/* ============================================================
   HT - bill.js
   ------------------------------------------------------------
   Booking bill generator. After the server confirms a booking
   (response.su == 1) the bill modal opens with the hotel logo,
   hotel name and the full stay breakdown. The bill can be
   downloaded as PDF (jsPDF). html2canvas and jsPDF are loaded at
   boot through the csh list in core/ht.js.

   All data comes from the booking snapshot (lastSnap built by
   calcBooking in menu/booking.js) plus the shared hotel / policy
   records loaded from the Dexie "ht" table.
   ============================================================ */

var billNo = "";
var billLock = false;
var billOnClose = null;
var billBooker = null;
var currentBillSnap = null;

function pad2(n) {
  return String(n).padStart(2, "0");
}

function billDateStr(d) {
  return (
    pad2(d.getDate()) + " " + MONTHS[d.getMonth()] + " " + d.getFullYear()
  );
}

function buildBillNo() {
  var d = new Date();
  return (
    "HT-" +
    d.getFullYear() +
    pad2(d.getMonth() + 1) +
    pad2(d.getDate()) +
    "-" +
    Math.floor(1000 + Math.random() * 9000)
  );
}

function billLogoHtml(name) {
  var src =
    typeof appOwner !== "undefined" && appOwner && appOwner.el
      ? appOwner.el
      : "";
  if (src) {
    return (
      '<img class="ht-bill-logo" src="' +
      src +
      '" alt="' +
      escHtml(name) +
      '">'
    );
  }
  return '<span class="ht-bill-logo-icon"><i class="fa-solid fa-crown"></i></span>';
}

function billGuestText(s) {
  var children = Array.isArray(s.children) ? s.children.length : s.children;
  var t = s.adults + " Adult" + (s.adults > 1 ? "s" : "");
  if (children > 0) {
    t +=
      " \u00b7 " +
      children +
      " Child" +
      (children > 1 ? "ren" : "") +
      (s.freeChildren > 0 ? " (" + s.freeChildren + " free)" : "");
  }
  return t;
}

function billMobileText(m) {
  if (!m) return "";
  var s = String(m);
  var i = s.lastIndexOf(".");
  return i >= 0 ? s.substring(0, i) + " " + s.substring(i + 1) : s;
}

function billC1Email(c) {
  var c1 = c && c.c1 != null ? c.c1 : null;
  if (typeof c1 === "string") {
    try {
      c1 = JSON.parse(c1);
    } catch (e) {
      c1 = null;
    }
  }
  if (c1 && typeof c1 === "object") {
    var eml = c1.eml;
    if (eml != null) return String(eml);
  }
  return "";
}

function billBookerCells(b) {
  if (!b) return "";
  function cell(lb, v) {
    return (
      '<div class="ht-bill-cell"><div class="lb">' +
      lb +
      '</div><div class="vl">' +
      escHtml(v || "-") +
      "</div></div>"
    );
  }
  return (
    '<div class="ht-bill-grid" style="grid-template-columns:repeat(2,1fr);margin-top:8px;">' +
    cell("Guest Name", b.name) +
    cell("Mobile", b.mobile) +
    cell("Address", b.address) +
    cell("Email", b.email) +
    "</div>"
  );
}

async function resolveBookerInfo(s) {
  var mo =
    typeof my1uzr !== "undefined" && my1uzr ? my1uzr.mo : "";
  var mc =
    typeof my1uzr !== "undefined" && my1uzr ? my1uzr.mc : "";
  function canDb() {
    return (
      typeof dbDexieManager !== "undefined" &&
      typeof dbnm !== "undefined" &&
      typeof dbDexieManager.getAllRecords === "function"
    );
  }
  var needC = null;
  if (mo && mc && canDb()) {
    var cList = null;
    try {
      cList = await dbDexieManager.getAllRecords(dbnm, "c");
    } catch (e) {
      cList = null;
    }
    if (cList) {
      for (var i = 0; i < cList.length; i++) {
        var c = cList[i] || {};
        if (
          c.e != null &&
          String(c.e) === String(mo) &&
          c.f != null &&
          String(c.f) === String(mc)
        ) {
          needC = c;
          break;
        }
      }
    }
  }
  if (!needC && s && canDb()) {
    var roomId = "";
    if (s.room) {
      var rid =
        s.room.a != null ? s.room.a : s.room.no != null ? s.room.no : s.room.e;
      if (rid != null) roomId = String(rid);
    } else if (s.roomId != null) {
      roomId = String(s.roomId);
    }
    // Unpaid bookings live in rc (same format as rb), so look in both. rb is
    // the paid/confirmed copy and is searched first.
    var best = null;
    var bestId = -1;
    var srcList = ["rb", "rc"];
    for (var si = 0; si < srcList.length && !best; si++) {
      var rl = null;
      try {
        rl = await dbDexieManager.getAllRecords(dbnm, srcList[si]);
      } catch (e) {
        rl = null;
      }
      if (!rl) continue;
      for (var bi = 0; bi < rl.length; bi++) {
        var rb = rl[bi] || {};
        if (rb.g !== s.checkin || rb.h !== s.checkout) continue;
        if (roomId && String(rb.e) !== roomId) continue;
        var bid = parseInt(rb.a, 10) || 0;
        if (bid > bestId) {
          bestId = bid;
          best = rb;
        }
      }
    }
    if (best && best.o != null) {
      var gcList = null;
      try {
        gcList = await dbDexieManager.getAllRecords(dbnm, "c");
      } catch (e) {
        gcList = null;
      }
      if (gcList) {
        for (var ci = 0; ci < gcList.length; ci++) {
          var gc = gcList[ci] || {};
          if (gc.a != null && String(gc.a) === String(best.o)) {
            needC = gc;
            break;
          }
        }
      }
    }
  }
  if (!needC) return null;
  return {
    mobile: billMobileText(needC.e),
    name: needC.h != null ? String(needC.h) : "",
    address: needC.m != null ? String(needC.m) : "",
    email: billC1Email(needC),
  };
}

function billBookerFromSnap(s) {
  if (!s || !(s.guestName || s.contact || s.email)) return null;
  return {
    name: s.guestName != null ? String(s.guestName) : "",
    mobile: billMobileText(s.contact) || "",
    address: s.address != null ? String(s.address) : "",
    email: s.email != null ? String(s.email) : "",
  };
}

// Bill status reflects what was actually paid. Only a fully paid booking is
// Confirmed; any received amount short of the total is Partially Paid.
function billStatusOf(s) {
  if (!s) return { label: "Booking Requested", ok: false };
  if (s.paid) return { label: "Booking Confirmed", ok: true };
  var received = 0;
  if (s.received != null) received = Number(s.received) || 0;
  else if (s.advanceAmount != null) received = Number(s.advanceAmount) || 0;
  var total = 0;
  if (s.grandTotal != null) total = Number(s.grandTotal) || 0;
  else if (s.calc && s.calc.total != null)
    total = (Number(s.calc.total) || 0) - (Number(s.discountAmt) || 0);
  var pay = s.payStatus != null ? String(s.payStatus).toLowerCase() : "";
  if (pay === "paid" || (total > 0 && received >= total)) {
    return { label: "Booking Confirmed", ok: true };
  }
  if (pay === "partial" || (received > 0 && total > 0 && received < total)) {
    return { label: "Partially Paid", ok: false };
  }
  return { label: "Booking Requested", ok: false };
}

function billTimePart(dtt, fallback) {
  var t = String(dtt || "");
  var sp = t.indexOf(" ");
  if (sp > 0) {
    var s = t.slice(sp + 1, sp + 6);
    if (/^\d{2}:\d{2}$/.test(s)) return s;
  }
  var s0 = t.slice(0, 5);
  if (/^\d{2}:\d{2}$/.test(s0)) return s0;
  return fallback || "";
}

function billHtml(s) {
  var h = hotel || {};
  var st = billStatusOf(s);
  var sIn = (
    s.checkin !== undefined &&
    s.checkin !== null &&
    s.checkin !== '' &&
    s.checkin !== 'undefined'
) ? s.checkin : checkIn;

var sOut = (
    s.checkout !== undefined &&
    s.checkout !== null &&
    s.checkout !== '' &&
    s.checkout !== 'undefined'
) ? s.checkout : checkOut;

  return (
    '<div class="ht-bill" id="billCard">' +
    '<div class="ht-bill-top">' +
    '<div class="ht-bill-brand">' +
    billLogoHtml(h.name) +
    "<div>" +
    '<div class="ht-bill-name">' +
    escHtml(h.name) +
    "</div>" +
    '<div class="ht-bill-tag">' +
    escHtml(h.tagline) +
    "</div>" +
    '<div class="ht-bill-city">' +
    escHtml(h.city) +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="ht-bill-meta">' +
    "<div>" +
    '<div class="ht-bill-title"><i class="fa-solid fa-file-invoice"></i> Booking Bill</div>' +
    '<span class="ht-bill-status' + (st.ok ? " ht-bill-status-ok" : "") + '" id="billStatus"><i class="fa-solid fa-circle-check"></i> ' + st.label + '</span>' +
    "</div>" +
    '<div class="cols">' +
    "<div><span>Bill No </span><b>" +
    escHtml(billNo) +
    "</b></div>" +
    "<div><span>Issue Date </span><b>" +
    billDateStr(new Date()) +
    "</b></div>" +
    "<div><span>Stay Dates </span><b>" +
    (sIn && sOut
      ? billDateStr(parseDate(sIn)) +
        " \u2192 " +
        billDateStr(parseDate(sOut))
      : "Not Selected") +
    "</b></div>" +
    "</div>" +
    "</div>" +
    '<div class="ht-bill-body">' +
    summaryHtml(s, { billPrint: true }) +
    (billBooker
      ? '<div class="ht-bill-guest" style="margin-top:16px;">' +
        '<div class="ht-bill-room" style="font-size:15px;">Guest Details</div>' +
        billBookerCells(billBooker) +
        "</div>"
      : "") +
    "</div>" +
    '<div class="ht-bill-foot">' +
    '<div class="ht-bill-thanks">Thank you for choosing ' +
    escHtml(h.name) +
    "</div>" +
    '<div class="ht-bill-note"><b>Status:</b> ' + st.label + '.</div>' +
    '<div class="ht-bill-proforma">This bill was generated on this device for your reference.</div>' +
    "</div>" +
    "</div>"
  );
}

function showBill(snap, onClose) {
  if (typeof onClose === "function") billOnClose = onClose;
  var s = snap || lastSnap || calcBooking();
  if (!s) return;
  if (el("billOverlay")) {
    renderBill(s);
    return;
  }
  billOnClose = typeof onClose === "function" ? onClose : null;
  // A bill number identifies ONE bill, so it is minted per bill rather than
  // once per page load. Otherwise every bill of a combination printed the same
  // number, and a bill reopened later still carried the first one's.
  billNo = buildBillNo();
  billBooker = billBookerFromSnap(s);
  if (billBooker) {
    renderBill(s);
    return;
  }
  document.body.style.overflow = "hidden";
  resolveBookerInfo(s).then(function (info) {
    billBooker = info;
    if (!billBooker) {
      document.body.style.overflow = "";
      showMessageModal(
        "Info",
        "Guest details not found. Print bill manually.",
        true,
        function () {
          var oc = billOnClose;
          billOnClose = null;
          if (typeof oc === "function") oc();
        },
      );
      return;
    }
    renderBill(s);
  });
}

function renderBill(s) {
  if (!el("modalRoot")) return;
  currentBillSnap = s;
  var payBtnHtml = s && s.paid
    ? '<button class="ht-btn ht-btn-ghost" disabled title="Booking Confirmed">' +
      '<i class="fa-solid fa-circle-check"></i> Booking Confirmed</button>'
    : '<button class="ht-btn ht-btn-ghost" onclick="payBillNow()">' +
      '<i class="fa-solid fa-credit-card"></i> Pay</button>';
  el("modalRoot").innerHTML =
    '<div class="ht-bill-overlay open" id="billOverlay" onclick="closeBill()">' +
    '<div class="ht-bill-stage" onclick="event.stopPropagation()">' +
    '<div class="ht-bill-scroll">' +
    billHtml(s) +
    "</div>" +
    '<div class="ht-bill-actions">' +
    payBtnHtml +
    '<button class="ht-btn ht-btn-gold" onclick="downloadPDF()">' +
    '<i class="fa-solid fa-file-pdf"></i> PDF</button>' +
    '<button class="ht-btn ht-btn-ember" onclick="closeBill()">' +
    '<i class="fa-solid fa-check"></i> Done</button>' +
    "</div>" +
    "</div></div>";
  window.setTimeout(function () {
    var stage = document.querySelector(".ht-bill-scroll");
    if (stage) stage.scrollTop = 0;
  }, 0);
}

function closeBill() {
  var ov = el("billOverlay");
  var onClose = billOnClose;
  billOnClose = null;
  if (ov) ov.classList.remove("open");
  document.body.style.overflow = "";
  window.setTimeout(function () {
    if (el("modalRoot")) el("modalRoot").innerHTML = "";
    if (onClose) {
      onClose();
    } else if (typeof showHome === "function") {
      showHome();
    }
  }, 250);
}

async function payBillNow() {
  if (currentBillSnap && currentBillSnap.paid) return;
  closeBill();
  await startPhonePePayment(currentBillSnap);
}

function billFileName() {
  var base = (hotel && hotel.name ? hotel.name : "Bill").replace(
    /[^A-Za-z0-9]+/g,
    "-",
  );
  return base + "-" + billNo;
}

function exportLogoPng() {
  return new Promise(function (resolve) {
    var src =
      typeof appOwner !== "undefined" && appOwner && appOwner.el
        ? appOwner.el
        : "";
    if (!src) return resolve(null);
    var img = new Image();
    img.onload = function () {
      try {
        var c = document.createElement("canvas");
        c.width = 160;
        c.height = 160;
        var ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, 160, 160);
        resolve(c.toDataURL("image/png"));
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = function () {
      resolve(null);
    };
    img.src = src;
  });
}

function prepExportCard(card) {
  return exportLogoPng().then(function (png) {
    var logo = card.querySelector(".ht-bill-logo");
    if (logo) {
      if (png) {
        logo.src = png;
      } else {
        var sp = document.createElement("span");
        sp.className = "ht-bill-logo-icon";
        sp.innerHTML = '<i class="fa-solid fa-crown"></i>';
        logo.parentNode.replaceChild(sp, logo);
      }
    }
    if (document.fonts && document.fonts.ready) {
      return document.fonts.ready;
    }
    return Promise.resolve();
  });
}

function renderBillCanvas() {
  var src = el("billCard");
  if (!src || typeof html2canvas !== "function") {
    return Promise.reject(new Error("html2canvas not available"));
  }
  var card = src.cloneNode(true);
  card.id = "billCardExport";
  card.style.position = "fixed";
  card.style.left = "-9999px";
  card.style.top = "0";
  card.style.width = "794px";
  card.style.margin = "0";
  document.body.appendChild(card);
  return prepExportCard(card)
    .then(function () {
      return html2canvas(card, {
        scale: 2,
        backgroundColor: "#fffdf8",
        logging: false,
      });
    })
    .then(
      function (canvas) {
        return canvas;
      },
      function (err) {
        document.body.removeChild(card);
        throw err;
      },
    );
}

function triggerDownload(url, name) {
  var a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadPDF() {
  renderBillCanvas()
    .then(function (canvas) {
      var JsPdf =
        typeof window.jspdf !== "undefined" && window.jspdf.jsPDF
          ? window.jspdf.jsPDF
          : null;
      if (!JsPdf) throw new Error("jsPDF not available");
      var pdf = new JsPdf("p", "mm", "a4");
      var pageW = pdf.internal.pageSize.getWidth();
      var pageH = pdf.internal.pageSize.getHeight();
      var ratio = canvas.height / canvas.width;
      var imgW = pageW;
      var imgH = imgW * ratio;
      if (imgH > pageH) {
        imgH = pageH;
        imgW = imgH / ratio;
      }
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.92),
        "JPEG",
        (pageW - imgW) / 2,
        (pageH - imgH) / 2,
        imgW,
        imgH,
      );
      pdf.save(billFileName() + ".pdf");
    })
    .catch(function (err) {
      console.error("PDF export error:", err);
      showMessageModal(
        "Bill Error",
        "Could not create the PDF. " + (err && err.message ? err.message : ""),
        true,
      );
    });
}

console.log("✅ bill loaded");