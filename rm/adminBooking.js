var htPackages = [];
var htAddons = [];
var htExtras = window.htExtras || [];
var existing = [];

// Receipts/advance payments belong to the booking's guest. If a receipt row
// carries no party id (h), default it to the selected guest so server-side
// duplicate matching (same party + amount + date) and the n-bump agree.
function receiptPartyId(rec) {
  if (rec && rec.h != null && String(rec.h) !== "" && String(rec.h) !== "0")
    return rec.h;
  return bookingState.guestCId || 0;
}

// Relative-scoped styles for the read-only Receipt/Payment rows (ab-pay-row).
// Keeps Amount/Payment Mode/Txn ID in one horizontal row on mobile, unlike the
// global .form-row-premium which flips to a column under 600px.
(function () {
  var pid = "abPayRowsCss";
  if (document.getElementById(pid)) return;
  var st = document.createElement("style");
  st.id = pid;
  st.textContent =
    ".ab-pay-row{display:flex;align-items:flex-end;gap:8px;flex-wrap:nowrap;}" +
    ".ab-pay-row>.form-group-premium{flex:1 1 0;min-width:0;margin-bottom:0;}" +
    ".ab-pay-row .form-label-premium{font-size:10px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
    ".ab-pay-row .form-control-premium{font-size:12px;padding:6px 8px;}" +
    "@media(max-width:600px){.ab-pay-row{flex-direction:row;align-items:flex-end;}}";
  document.head.appendChild(st);
})();

window.fnAfterRcptPmt = function (...objjj) {
  var rData = (objjj && objjj[0]) || [];
  var payments = [];
  for (var i = 0; i < rData.length; i++) {
    var pm = rData[i] || {};
    var rec = {};
    for (var key in pm) {
      if (Object.prototype.hasOwnProperty.call(pm, key)) rec[key] = pm[key];
    }
    rec.j = fmtAmt(parseFloat(rec.j));
    rec.i = rec.i != null ? String(rec.i) : "";
    rec.h = receiptPartyId(rec);
    if (rec.l && rec.l.td != null) rec.td = String(rec.l.td);
    payments.push(rec);
  }
  existing = payments;
  bookingState.payments = payments;
  renderPaymentsRows("bkPaymentRows");
  renderPaymentsRows("bePaymentRows");
  if (typeof window.updateBalanceDue === "function") window.updateBalanceDue();
  if (typeof window.beUpdateBalanceDue === "function") window.beUpdateBalanceDue();
};

// Load this booking's saved receipts (table r) filtered by td == booking id.
// Returns full r-table records mapped to the same shape fnAfterRcptPmt uses
// (j numeric, i string, td = l.td txn id; keeps a, h, g, k, m, n, o, tb, ...).
async function loadBookingReceipts(bookingId) {
  var recs = [];
  try {
    var rRows = await dbDexieManager.getAllRecords(dbnm, "r");
    recs = (Array.isArray(rRows) ? rRows : []).filter(function (r) {
      return String(r.td) === String(bookingId);
    });
  } catch (e) {
    recs = [];
  }
  return recs
    .filter(function (pm) {
      return pm && (parseFloat(pm.j) > 0 || pm.i || pm.td || pm.l);
    })
    .map(function (pm) {
      var rec = {};
      for (var key in pm) {
        if (Object.prototype.hasOwnProperty.call(pm, key)) rec[key] = pm[key];
      }
      rec.j = fmtAmt(parseFloat(rec.j));
      rec.i = rec.i != null ? String(rec.i) : "";
      if (rec.l && rec.l.td != null) rec.td = String(rec.l.td);
      return rec;
    });
}

// "Update Payments" button shown under the receipt/payment list while editing
// an existing booking. Pushes the full r-table records (with a ids) to the
// server via p.php fn 103 (see updateBillPayments below).
function paymentUpdateBtnHTML() {
  if (!bookingState.editBookingId) return "";
  return (
    '<button type="button" class="btn-premium btn-premium-primary btn-premium-sm mt-2" onclick="updateBillPayments()">' +
    '<i class="fas fa-cloud-upload-alt me-1"></i> Update Payments</button>'
  );
}

window.updateBillPayments = async function () {
  var bookingId = bookingState.editBookingId;
  if (!bookingId) {
    showMessageModal("Info", "No bill selected to update", false);
    return;
  }
  var payList = (bookingState.payments || []).filter(function (pm) {
    return pm && (parseFloat(pm.j) > 0 || pm.i || pm.td);
  });
  if (!payList.length) {
    showMessageModal("Info", "No payments to update", false);
    return;
  }

  try {
    var paymentArray = payList.map(function (pm) {
      var r = {};
      for (var key in pm) {
        if (Object.prototype.hasOwnProperty.call(pm, key)) r[key] = pm[key];
      }
      r.td = bookingId;
      r.h = receiptPartyId(r);
      r.j = String(fmtAmt(pm.j));
      if (r.k == null) r.k = todayStr();
      return r;
    });

    clearPayload0();
    payload0.vw = 1;
    payload0.fn = 103;
    payload0.r = paymentArray;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
      { tb: "rb" },
      { tb: "rm" },
      { tb: "c" },
      { tb: "r" },
    ]);

    var response = null;

    response = await fnj3(
      "https://my1.in/2/p.php",
      payload0,
      1,
      true,
      null,
      20000,
      0,
      2,
      1
    );

    if (response && response.su == 1) {
      // if (typeof handl_rm_rspons !== "function") {
      //   try {
      //     await loadExe2Fn(52);
      //   } catch (e) {
      //     console.warn("loadExe2Fn(52) failed:", e);
      //   }
      // }
      await handl_rm_rspons(response);
      // Refresh state from the echoed r records so real server a ids show up in
      // the receipt list and any later modal open stays consistent.
      bookingState.payments = await loadBookingReceipts(bookingId);
      renderPaymentsRows("bkPaymentRows");
      renderPaymentsRows("bePaymentRows");
      if (typeof window.updateBalanceDue === "function") window.updateBalanceDue();
      if (typeof window.beUpdateBalanceDue === "function") window.beUpdateBalanceDue();
      //showMessageModal("Success", "✅ Payments updated successfully!", false);
      try {
        await reloadEditBooking();
      } catch (e) {
        console.warn("Reload edit booking failed:", e);
      }
    } else {
      window.showelsemodal(
        (response && response.ms) || "Failed to update payments"
      );
    }
  } catch (error) {
    console.error("Error updating payments:", error);
    showMessageModal(
      "Info",
      "Error updating payments: " +
      (error && error.message ? error.message : error),
      false
    );
  }
};

// Bill preview for a saved booking: loads the raw rb row by id (plus its guest
// record), rebuilds the bill snapshot with the rb.n discount applied, and
// renders it through the shared showBill/bill module. Called after the booking
// is saved, before the loader clears.
window.printBillFromDashboard = async function (bookingId) {
  if (typeof showBill !== "function") {
    showMessageModal("Info", "Print unavailable.", true);
    return;
  }
  var raws = [];
  try {
    raws = (await dbDexieManager.getAllRecords(dbnm, "rb")) || [];
  } catch (e) {
    raws = [];
  }
  var raw = null;
  for (var i = 0; i < raws.length; i++) {
    if (raws[i] && String(raws[i].a) === String(bookingId)) {
      raw = raws[i];
      break;
    }
  }
  if (!raw) {
    showMessageModal("Info", "Bill not found", true);
    return;
  }
  var snap = null;
  if (
    typeof normalizeBookingRow === "function" &&
    typeof bookingSnapFromRecord === "function"
  ) {
    try {
      snap = bookingSnapFromRecord(normalizeBookingRow(raw));
    } catch (e) {
      snap = null;
    }
  }
  if (!snap) {
    showMessageModal(
      "Info",
      "Could not build the bill for this booking.",
      true,
    );
    return;
  }
  if (raw.o != null) {
    var cRows = [];
    try {
      cRows = (await dbDexieManager.getAllRecords(dbnm, "c")) || [];
    } catch (e) {
      cRows = [];
    }
    for (var cj = 0; cj < cRows.length; cj++) {
      if (
        cRows[cj] &&
        cRows[cj].a != null &&
        String(cRows[cj].a) === String(raw.o)
      ) {
        var guest = cRows[cj];
        snap.guestName = guest.h != null ? String(guest.h) : "";
        snap.contact = guest.e != null ? String(guest.e) : "";
        snap.email =
          typeof billC1Email === "function" ? billC1Email(guest) || "" : "";
        snap.address = guest.m != null ? String(guest.m) : "";
        break;
      }
    }
  }
  showBill(snap, function () {
    document.body.classList.add("ht-print-bill");
    var cleanup = function () {
      document.body.classList.remove("ht-print-bill");
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    window.setTimeout(cleanup, 30000);
  });
};

// Reload the currently-open Edit Booking view from the freshly saved DB row so
// server-confirmed receipts, balance due, and the form state all stay in sync.
window.reloadEditBooking = async function () {
  var bookingId = bookingState && bookingState.editBookingId;
  if (!bookingId) return;
  var record = null;
  try {
    var raws = (await dbDexieManager.getAllRecords(dbnm, "rb")) || [];
    for (var i = 0; i < raws.length; i++) {
      if (raws[i] && String(raws[i].a) === String(bookingId)) {
        record = raws[i];
        break;
      }
    }
  } catch (e) {
    console.warn("Failed to read record for reload:", e);
  }
  if (!record) return;
  var normRecord =
    typeof normalizeBookingRow === "function"
      ? normalizeBookingRow(record)
      : record;
  if (typeof editBookingRecord === "function") {
    await editBookingRecord(normRecord);
  }
};

window.openRcptPmtModal = async function () {
  if (!bookingState.guestCId || String(bookingState.guestCId) === "0") {
    showMessageModal(
      "Info",
      "Receipt Payments must be after the Select Guest Details!",
      false,
    );
    return;
  }
  var rRows = [];
  try {
    rRows = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
  } catch (e) {
    rRows = [];
  }

  if (bookingState.editBookingId) {
    var cfg =
      window[my1uzr.worknOnPg]?.clientConfig?.rp_xtraEiFlds_rmBookAdmin;
    var tbTarget = cfg && cfg.tb != null ? String(cfg.tb) : "";
    var guestId = bookingState.guestCId;
    var bkId = String(bookingState.editBookingId);
    existing = rRows.filter(function (r) {
      if (!r) return false;
      if (String(r.td) !== bkId) return false;
      if (tbTarget !== "" && String(r.tb) !== tbTarget) return false;
      if (guestId != null && String(guestId) !== "" && String(guestId) !== "0") {
        if (String(r.h) !== String(guestId)) return false;
      }
      return true;
    });
  } else {
    existing = (bookingState.payments || []).slice();
  }
  loadExe2Fn(53, [
    window[my1uzr.worknOnPg]?.clientConfig?.rp_xtraEiFlds_rmBookAdmin,
    window[my1uzr.worknOnPg]?.clientConfig?.cashiers,
    "fnAfterRcptPmt",
    existing,
    rRows
  ], [1]);
};

// Display label for a payment mode id (ids come from the Receipt/Payment modal).
function payModeLabel(id) {
  var labels = {
    1: "Cash",
    2: "Cheque",
    3: "Card",
    4: "UPI",
    5: "Bank Transfer"
  };
  if (id == null || String(id) === "0" || String(id) === "") return "—";
  return labels[String(id)] || ("Mode " + id);
}

// One read-only advance-payment row: amount (j), mode label (i), txn id (td).
function payRowReadOnly(p) {
  p = p || {};
  return (
    '<div class="ab-pay-row mb-2">' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Advance Payment (₹)</label>' +
    '<input type="text" class="form-control-premium fw-bold" readonly value="' +
    (p.j != null ? fmtAmt(p.j) : "") +
    '"></div>' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Payment Mode</label>' +
    '<input type="text" class="form-control-premium" readonly value="' +
    escAttr(payModeLabel(p.i)) +
    '"></div>' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Txn ID</label>' +
    '<input type="text" class="form-control-premium" readonly value="' +
    escAttr(p.td || "") +
    '" placeholder="Transaction ref"></div>' +
    "</div>"
  );
}

function payRowsHTML(payments) {
  var list = Array.isArray(payments) ? payments : [];
  if (!list.length) {
    return '<div class="text-sm text-gray"><i class="fas fa-info-circle me-1"></i>No payments added yet. Use the Receipt / Payment button above.</div>';
  }
  return list.map(function (p) {
    return payRowReadOnly(p);
  }).join("");
}

function renderPaymentsRows(containerId) {
  var wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = payRowsHTML(bookingState.payments);
}

// Map an extra's display name (htExtras.e, e.g. "Early Check-IN") to its
// server facility id for zrb.l. Matching is case/punctuation-insensitive, so
// any spelling like "Early CheckIN"/"early check in" still resolves. Extras
// resolve via the adtnolChrgs array only; add-ons keep their own adons array.
function htExtraFacilityId(name) {
  var norm = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  if (!norm) return 0;
  var cfg = window[my1uzr.worknOnPg]?.clientConfig || {};
  var adtnolChrgs = Array.isArray(cfg.adtnolChrgs) ? cfg.adtnolChrgs : [];
  for (var i = 0; i < adtnolChrgs.length; i++) {
    if (
      String(adtnolChrgs[i].b || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "") === norm
    ) {
      return Number(adtnolChrgs[i].a);
    }
  }
  return 0;
}

// Add-ons for the Extra Particulars list: each `adons` entry
// (facility id → name + default price). Add-ons are charged PER NIGHT
// (rate × nights), unlike the flat adtnolChrgs extras.
// Returns [{ id: fid, slug, name, price, mode: "night" }].
function htAddonRows() {
  var cfg = window[my1uzr.worknOnPg]?.clientConfig || {};
  var adons = Array.isArray(cfg.adons) ? cfg.adons : [];
  var out = [];
  for (var i = 0; i < adons.length; i++) {
    var rec = adons[i];
    if (!rec || rec.a == null) continue;
    var fid = Number(rec.a);
    out.push({
      id: fid,
      slug: String(rec.b || "").toLowerCase().replace(/[^a-z0-9]+/g, ""),
      name: rec.b != null ? String(rec.b) : "",
      price: Number(rec.c) || 0,
      mode: "night",
    });
  }
  return out;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

var STD_CHECKIN = "12:00";
var STD_CHECKOUT = "11:00";

// Extra Particulars: a checkbox + editable amount for every extra and add-on.
// Extras (adtnolChrgs) are flat custom amounts; add-ons (adons) are per-night
// rates (× nights). Selected items drive the
// Extra Charges total and are submitted to the payload (k.h [id, amount]
// breakdown + l facility charges). Shared by the Booking Entry view
// ("beExtraList") and the wizard ("bkExtraList").
function htExtraListHTML(savedItems) {
  savedItems = savedItems || [];
  var stateMap = {};
  for (var s = 0; s < savedItems.length; s++) {
    stateMap[String(savedItems[s].name)] = savedItems[s];
  }
  var h = "";
  function rowHtml(id, label, unit, amt, checked, mode) {
    return (
      '<div class="ht-extra-row">' +
      '<input type="checkbox" data-id="' +
      id +
      '" data-label="' +
      escAttr(label) +
      '" data-mode="' +
      mode +
      '"' +
      (checked ? " checked" : "") +
      ' onchange="beRefreshExtraCharges()">' +
      '<span class="be-extra-dd-name">' +
      escHtml(label) +
      "</span>" +
      '<span class="text-gray text-sm">' +
      unit +
      "</span>" +
      '<input type="number" class="form-control-premium beExtraAmt" min="0" step="1" value="' +
      fmtAmt(amt) +
      '" style="max-width:90px;" oninput="beRefreshExtraCharges()">' +
      "</div>"
    );
  }
  for (var i = 0; i < htExtras.length; i++) {
    var x = htExtras[i];
    var saved = stateMap[x.e];
    var amt =
      saved && saved.amount != null
        ? saved.amount
        : parseFloat(x.g) || 0;
    h += rowHtml(x.a, x.e, "₹", amt, !!saved, "stay");
  }
  var addons = htAddonRows();
  for (var ai = 0; ai < addons.length; ai++) {
    var adx = addons[ai];
    var aSaved = stateMap[adx.name];
    var aAmt =
      aSaved && aSaved.amount != null
        ? aSaved.amount
        : adx.price || 0;
    h += rowHtml(adx.id, adx.name, "₹/night", aAmt, !!aSaved, "night");
  }
  return h;
}

function beExtraOptions() {
  return (
    '<div class="ht-extra-list be-extra-list" id="beExtraList">' +
    htExtraListHTML(bookingState.extraItems) +
    "</div>"
  );
}

// Collect the currently checked extras/add-ons (name + amount + mode) from a
// list. mode "stay" = flat custom amount, "night" = per-night rate (× nights).
function htReadExtraItems(wrapId) {
  var wrap = document.getElementById(wrapId);
  if (!wrap) return [];
  var out = [];
  var rows = wrap.querySelectorAll(".ht-extra-row");
  for (var i = 0; i < rows.length; i++) {
    var box = rows[i].querySelector('input[type="checkbox"]');
    if (!box || !box.checked) continue;
    var amt = parseFloat(rows[i].querySelector(".beExtraAmt")?.value) || 0;
    out.push({
      id: box.getAttribute("data-id"),
      name: box.getAttribute("data-label") || "",
      amount: amt,
      mode: box.getAttribute("data-mode") || "stay",
    });
  }
  return out;
}

function htReadExtraParticular(wrapId) {
  var wrap = document.getElementById(wrapId);
  if (!wrap) return "";
  var parts = [];
  var boxes = wrap.querySelectorAll('input[type="checkbox"]:checked');
  for (var i = 0; i < boxes.length; i++) {
    parts.push(boxes[i].getAttribute("data-label") || "");
  }
  return parts.join(", ");
}

// Sum of checked extras/add-ons: extras are flat, add-ons are per-night
// (rate × nights), total = sum.
function htReadExtraCharges(wrapId) {
  var wrap = document.getElementById(wrapId);
  if (!wrap) return 0;
  var nights = calcNights(bookingState.checkin, bookingState.checkout) || 1;
  var total = 0;
  var rows = wrap.querySelectorAll(".ht-extra-row");
  for (var i = 0; i < rows.length; i++) {
    var box = rows[i].querySelector('input[type="checkbox"]');
    if (!box || !box.checked) continue;
    var amt = parseFloat(rows[i].querySelector(".beExtraAmt")?.value) || 0;
    var mode = box.getAttribute("data-mode") || "stay";
    total += mode === "night" ? amt * nights : amt;
  }
  return total;
}

window.beRefreshExtraCharges = function () {
  var beWrap = document.getElementById("beExtraList");
  var bkWrap = document.getElementById("bkExtraList");
  var wrap = beWrap || bkWrap;
  if (!wrap) return;
  var wrapId = beWrap ? "beExtraList" : "bkExtraList";
  bookingState.extraItems = htReadExtraItems(wrapId);
  var ecInput = document.getElementById(beWrap ? "beExtraCharges" : "bkExtraCharges");
  if (ecInput) {
    ecInput.value = bookingState.extraItems.length
      ? htReadExtraCharges(wrapId)
      : 0;
  }
  if (beWrap && typeof beRecalc === "function") beRecalc();
};

var bookingModalId = null;
var bookingStep = 1;
// lastCalcTotal holds the most recently computed Grand Total so the Balance
// Due field can auto-update live as the Advance Payment changes.
var lastCalcTotal = 0;
var bookingState = {
  bookingDate: "", // v: booking date (auto = today)
  checkin: "", // e: check-in date
  checkout: "", // f: check-out date
  checkinTime: "", // w: check-in time
  checkoutTime: "", // x: check-out time
  guestName: "", // g: primary guest name
  countryCode: "91", // h: country code part of contact
  mobile: "", // h: mobile part of contact
  email: "", // p: email (optional)
  idType: "", // q.t: ID proof type
  idNumber: "", // q.n: ID proof number
  address: "", // i.gs[0].ad: guest address (Booking Entry view)
  male: 1, // i.m: male guests (12+)
  female: 0, // i.f: female guests (12+)
  adults: 1, // r / i.ad: total adults = male + female (auto)
  children: [], // i.ch: [{ ag, n }] children list
  roomId: 0, // j: room id
  packageId: 1, // k: package id
  addonIds: [], // l: add-on id list
  extraParticular: "", // y.p: extra particulars text
  extraCharges: 0, // y.c: extra charges amount (₹)
  extraItems: [], // [{ id, name, amount, mode }] mode: "stay"=flat, "night"=per-night (persisted in k.h)
  payments: [], // r: [{ j: amount, i: modeId, td: txnId }] multiple advance payments
  payStatus: "", // z.s: payment status
};

// Field-hiding helper: reads `colsToHideAddBooking` from index.html (a comma
// CSV of codes). A hidden field is NOT rendered, NOT validated and NOT sent
// to the server — the payload key is simply omitted (decided with owner).
function getAddBookingHidden() {
  var c =
    (window[my1uzr.worknOnPg] &&
      window[my1uzr.worknOnPg].colsToHideAddBooking) ||
    "";
  return c
    .split(",")
    .map(function (k) {
      return k.trim().toLowerCase();
    })
    .filter(function (k) {
      return k;
    });
}
function isABHidden(code) {
  return getAddBookingHidden().indexOf(code) !== -1;
}

function getPackageById(id) {
  for (var i = 0; i < htPackages.length; i++) {
    if (String(htPackages[i].a) === String(id)) return htPackages[i];
  }
  return null;
}

function getAddonById(id) {
  for (var i = 0; i < htAddons.length; i++) {
    if (String(htAddons[i].a) === String(id)) return htAddons[i];
  }
  return null;
}

// Full-page "Booking Entry" view toggle from index.html. "1" shows the
// one-screen entry form (31 fields); "" keeps the original multi-step wizard.
function bookingEntryMode() {
  return !!(
    window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].changeToView === "1"
  );
}

// Shared state initialiser for both the wizard and the full-page view.
function initBookingState(roomPreset, ci, co) {
  var mid = "bookingModal_" + Date.now();
  bookingModalId = mid;
  var today = new Date().toISOString().split("T")[0];
  var tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  bookingState = {
    bookingDate: today, // v: booking date = today (auto)
    checkin: ci || "",
    checkout: co || "",
    checkinTime: "",
    checkoutTime: "",
    guestName: "",
    countryCode: "91",
    mobile: "",
    email: "",
    idType: "",
    idNumber: "",
    address: "",
    male: 1,
    female: 0,
    adults: 1,
    children: [],
    roomId: roomPreset
      ? roomPreset.a != null
        ? roomPreset.a
        : roomPreset.e
      : 0,
    packageId: 1,
    addonIds: [],
    extraParticular: "",
    extraCharges: 0,
    extraItems: [],
    payments: [],
    payStatus: "",
    guestCId: 0,
    editBookingId: 0,
    discountPercent: 0,
    discountAmt: 0,
    chargeWithAc: false,
    specialRequests: "",
  };

  bookingStep = 1;
  lastCalcTotal = 0;
  return mid;
}

window.openBookingModal = function (roomPreset, ci, co) {
  window.openRoomBooking();
  var mid = initBookingState(roomPreset, ci, co);
  if (bookingEntryMode()) {
    showBookingEntryView();
    return;
  }

  var modalHtml =
    '<div class="modal fade modal-premium" id="' +
    mid +
    '" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered modal-xl">' +
    '<div class="modal-content animate-scale-in shadow-xl" style="border:3px solid var(--emr);border-radius:12px;overflow:hidden;max-height:88vh;">' +
    '<div class="modal-header bg-emr-gradient text-gold" style="padding:14px 18px;border-bottom:3px solid var(--gold);">' +
    '<h6 class="modal-title fw-bold" style="font-size:15px;letter-spacing:0.5px;">' +
    '<i class="fas fa-hotel me-2 text-gold"></i>' +
    "NEW BOOKING" +
    "</h6>" +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
    '<div class="ht-stepper" id="' +
    mid +
    '_stepper"></div>' +
    '<div class="modal-body p-0" id="' +
    mid +
    '_body" style="overflow-y:auto;max-height:calc(88vh - 180px);"></div>' +
    '<div class="modal-footer" style="padding:12px 18px;border-top:2px solid var(--gray-bg);">' +
    '<button type="button" id="' +
    mid +
    '_prevBtn" class="btn-premium btn-premium-secondary btn-premium-sm" onclick="goBookingStep(-1)">' +
    '<i class="fas fa-arrow-left me-1"></i> Back</button>' +
    '<button type="button" class="btn-premium btn-premium-secondary btn-premium-sm ms-auto" onclick="clearBookingForm()">' +
    '<i class="fas fa-eraser me-1"></i> Clear Form</button>' +
    '<button type="button" id="' +
    mid +
    '_nextBtn" class="btn-premium btn-premium-primary btn-premium-sm" onclick="goBookingStep(1)">' +
    'Next <i class="fas fa-arrow-right ms-1"></i></button>' +
    "</div></div></div></div>";

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  var modalEl = document.getElementById(mid);
  var m = new bootstrap.Modal(modalEl);
  m.show();
  modalEl.addEventListener("hidden.bs.modal", function () {
    this.remove();
    bookingModalId = null;
  });
  renderBookingStep(1);
};

function renderBookingStep(step) {
  var mid = bookingModalId;
  if (!mid) return;
  bookingStep = step;
  var steps = ["Guest", "Guests", "Room", "Package", "Add-ons", "Summary"];
  var sh = "";
  for (var i = 0; i < steps.length; i++) {
    var cls = i + 1 < step ? " done" : i + 1 === step ? " active" : "";
    sh +=
      '<div class="stp' +
      cls +
      '"><div class="stp-circle">' +
      (i + 1 < step ? '<i class="fas fa-check"></i>' : i + 1) +
      '</div><div class="stp-label">' +
      steps[i] +
      "</div></div>";
  }
  document.getElementById(mid + "_stepper").innerHTML = sh;

  if (step === 1) renderGuestStep();
  else if (step === 2) renderChildrenStep();
  else if (step === 3) renderRoomStep();
  else if (step === 4) renderPackageStep();
  else if (step === 5) renderAddonStep();
  else renderSummaryStep();

  var prevBtn = document.getElementById(mid + "_prevBtn");
  if (prevBtn) prevBtn.disabled = step === 1;
  var nextBtn = document.getElementById(mid + "_nextBtn");
  if (nextBtn) {
    if (step === 6) {
      nextBtn.innerHTML =
        '<i class="fas fa-check-circle me-1"></i> Confirm Booking';
    } else {
      nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right ms-1"></i>';
    }
  }
}

window.goBookingStep = function (delta) {
  if (delta > 0) {
    if (!validateBookingStep(bookingStep)) return;
    if (bookingStep === 6) {
      saveBooking();
      return;
    }
    renderBookingStep(bookingStep + 1);
  } else {
    if (bookingStep === 1) return;
    renderBookingStep(bookingStep - 1);
  }
};

function validateBookingStep(step) {
  var mid = bookingModalId;
  if (step === 1) {
    // Guest step: name, contact, optional email, ID proof. Hidden = skipped.
    if (!isABHidden("name")) {
      var name = (document.getElementById("bkGuestName")?.value || "").trim();
      if (!name) {
        showMessageModal("Info", "Please enter the guest name!", false);
        return false;
      }
      bookingState.guestName = name;
    }
    if (!isABHidden("contact")) {
      var cc = document.getElementById("bkCountryCode")?.value || "91";
      var mob = (document.getElementById("bkMobile")?.value || "").trim();
      if (!/^\d{10}$/.test(mob)) {
        showMessageModal(
          "Info",
          "Please enter a valid 10-digit mobile number!",
          false,
        );
        return false;
      }
      bookingState.countryCode = cc;
      bookingState.mobile = mob;
    }
    bookingState.email = (
      document.getElementById("bkEmail")?.value || ""
    ).trim();
    if (!isABHidden("id")) {
      bookingState.idType = document.getElementById("bkIdType")?.value || "";
      bookingState.idNumber = (
        document.getElementById("bkIdNumber")?.value || ""
      ).trim();
      if (!bookingState.idType) {
        showMessageModal(
          "Info",
          "Please select the guest's ID proof type!",
          false,
        );
        return false;
      }
      if (!bookingState.idNumber) {
        showMessageModal("Info", "Please enter the guest's ID number!", false);
        return false;
      }
    }
    return true;
  }
  if (step === 2) {
    // Guests step: total adults = male + female (auto), then children.
    if (isABHidden("ad") && isABHidden("ch")) return true;
    if (!isABHidden("ad")) {
      var male = parseInt(document.getElementById("bkMale")?.value) || 0;
      var female = parseInt(document.getElementById("bkFemale")?.value) || 0;
      var total = male + female;
      if (total < 1 || total > 9) {
        showMessageModal(
          "Info",
          "Total guests (male + female) must be between 1 and 9!",
          false,
        );
        return false;
      }
      bookingState.male = male;
      bookingState.female = female;
      bookingState.adults = total;
    }
    if (!isABHidden("ch")) {
      var rows = document.querySelectorAll("#" + mid + " .ht-child-row");
      var children = [];
      for (var i = 0; i < rows.length; i++) {
        var age = parseInt(rows[i].querySelector(".bkChildAge")?.value);
        var nm = (rows[i].querySelector(".bkChildName")?.value || "").trim();
        if (isNaN(age) || age < 0 || age > 17) {
          showMessageModal(
            "Info",
            "Child " + (i + 1) + ": please enter a valid age between 0 and 17!",
            false,
          );
          return false;
        }
        // Child name optional only when age <= 8; above 8 it is required.
        if (age > 8 && !nm) {
          showMessageModal(
            "Info",
            "Child " + (i + 1) + ": name is required when age is above 8!",
            false,
          );
          return false;
        }
        // Paid children (age > 8) carry a per-night charge; 0 is allowed.
        var rateInput = rows[i].querySelector(".bkChildRate");
        var rate = rateInput ? parseFloat(rateInput.value) || 0 : 0;
        children.push({ n: nm, ag: age, c: rate });
      }
      bookingState.children = children;
    }
    return true;
  }
  if (step === 3) {
    // Room step: stay dates + times (guarded), then room + availability.
    if (!isABHidden("checkin")) {
      var ci = document.getElementById("bkCheckin")?.value || "";
      if (!ci) {
        showMessageModal("Info", "Please select a check-in date!", false);
        return false;
      }
      bookingState.checkin = ci;
    }
    if (!isABHidden("checkout")) {
      var co = document.getElementById("bkCheckout")?.value || "";
      if (!co) {
        showMessageModal("Info", "Please select a check-out date!", false);
        return false;
      }
      if (bookingState.checkin && co <= bookingState.checkin) {
        showMessageModal(
          "Info",
          "Check-out must be after check-in date!",
          false,
        );
        return false;
      }
      bookingState.checkout = co;
    }
    if (!isABHidden("timein")) {
      bookingState.checkinTime =
        document.getElementById("bkCheckinTime")?.value || "";
    }
    if (!isABHidden("timeout")) {
      bookingState.checkoutTime =
        document.getElementById("bkCheckoutTime")?.value || "";
    }
    if (!isABHidden("room")) {
      if (!bookingState.roomId) {
        showMessageModal("Info", "Please select a room!", false);
        return false;
      }
      var room = getRoomById(bookingState.roomId);
      if (!room) {
        showMessageModal("Info", "Selected room not found!", false);
        return false;
      }
      //var occ = htRoomOccupancy(room);
      // if (bookingState.adults > (occ.adults || 99)) {
      //   showMessageModal(
      //     "Info",
      //     "Capacity exceeded: this room allows max " + occ.adults + " adults!",
      //     false,
      //   );
      //   return false;
      // }
      // if (bookingState.children.length > (occ.children || 99)) {
      //   showMessageModal(
      //     "Info",
      //     "Capacity exceeded: this room allows max " +
      //       occ.children +
      //       " children!",
      //     false,
      //   );
      //   return false;
      // }
      if (
        !getRoomAvailability(
          room,
          bookingState.checkin,
          bookingState.checkout,
          bookingState.editBookingId || null,
        )
      ) {
        showMessageModal(
          "Info",
          "This room is not available for the selected dates!",
          false,
        );
        return false;
      }
    }
    return true;
  }
  if (step === 4) {
    if (!isABHidden("pkg") && !bookingState.packageId) {
      showMessageModal("Info", "Please select a package!", false);
      return false;
    }
    return true;
  }
  if (step === 5) {
    // Add-ons step: extras (extra particular + extra charges).
    if (!isABHidden("extra")) {
      bookingState.extraItems = htReadExtraItems("bkExtraList");
      bookingState.extraParticular = htReadExtraParticular("bkExtraList");
      var ec =
        parseFloat(document.getElementById("bkExtraCharges")?.value) || 0;
      bookingState.extraCharges = ec < 0 ? 0 : ec;
    }
    return true;
  }
  if (step === 6) {
    // Summary step: payments come from the Receipt/Payment modal
    // (bookingState.payments, set via window.fnAfterRcptPmt).
    if (!isABHidden("adv")) {
      var sum = bkStatePaymentSum();
    }
    if (!isABHidden("paystatus")) {
      bookingState.payStatus =
        document.getElementById("bkPayStatus")?.value || "";
    }
    if (!isABHidden("adv")) {
      var totalPayable = lastCalcTotal - (bookingState.discountAmt || 0);
      if (sum > totalPayable) {
        console.error(sum + ">" + totalPayable);
        showMessageModal(
          "Info",
          "Advance payments cannot exceed the total payable!",
          false,
        );
        return false;
      }
    }
    return true;
  }
  return true;
}

function renderGuestStep() {
  var b = document.getElementById(bookingModalId + "_body");
  var today = new Date().toISOString().split("T")[0];
  var ccOpts = ["91", "1", "44", "971", "977"];
  var ccHtml = "";
  for (var i = 0; i < ccOpts.length; i++) {
    ccHtml +=
      '<option value="' +
      ccOpts[i] +
      '"' +
      (bookingState.countryCode === ccOpts[i] ? " selected" : "") +
      ">+" +
      ccOpts[i] +
      "</option>";
  }

  // Guest step fields: Name, Contact, optional Email, ID proof. Each is
  // wrapped in its hide-code so hidden fields are never rendered.
  var h =
    '<div class="p-3">' +
    '<div class="d-flex align-items-center gap-2 mb-3 flex-wrap">' +
    '<i class="fas fa-user text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Guest Details</span>' +
    '<span class="badge-premium badge-premium-gold ms-auto">Booking Date: ' +
    escHtml(bookingState.bookingDate || today) +
    "</span>" +
    '<button type="button" class="btn-premium btn-premium-secondary btn-premium-sm" onclick="openBookingGuestPicker()">' +
    '<i class="fas fa-users me-1"></i> Search Guest</button></div>';
  if (!isABHidden("name")) {
    h +=
      '<div class="form-group-premium">' +
      '<label class="form-label-premium">Guest Name <span class="required">*</span></label>' +
      '<input type="text" id="bkGuestName" value="' +
      escAttr(bookingState.guestName) +
      '" placeholder="Enter full name" class="form-control-premium">' +
      "</div>";
  }
  if (!isABHidden("contact")) {
    h +=
      '<div class="form-row-premium mb-0">' +
      '<div class="form-group-premium mb-0" style="max-width:150px;">' +
      '<label class="form-label-premium">Country Code</label>' +
      '<select id="bkCountryCode" class="form-select-premium">' +
      ccHtml +
      "</select></div>" +
      '<div class="form-group-premium mb-0">' +
      '<label class="form-label-premium">Mobile Number <span class="required">*</span></label>' +
      '<input type="tel" id="bkMobile" value="' +
      escAttr(bookingState.mobile) +
      '" placeholder="10 digit mobile" maxlength="10" class="form-control-premium">' +
      "</div></div>";
  }
  if (!isABHidden("email")) {
    h +=
      '<div class="form-group-premium mb-0 mt-2">' +
      '<label class="form-label-premium">Email <span class="text-gray fw-normal">(optional)</span></label>' +
      '<input type="email" id="bkEmail" value="' +
      escAttr(bookingState.email) +
      '" placeholder="guest@email.com" class="form-control-premium">' +
      "</div>";
  }
  if (!isABHidden("id")) {
    h +=
      '<div class="form-group-premium mb-0 mt-3">' +
      '<label class="form-label-premium">ID Proof <span class="required">*</span></label>' +
      '<select id="bkIdType" class="form-select-premium">' +
      '<option value="">Select ID type...</option>' +
      '<option value="Aadhaar Card"' +
      (bookingState.idType === "Aadhaar Card" ? " selected" : "") +
      ">Aadhaar Card</option>" +
      '<option value="Passport"' +
      (bookingState.idType === "Passport" ? " selected" : "") +
      ">Passport</option>" +
      '<option value="Driving License"' +
      (bookingState.idType === "Driving License" ? " selected" : "") +
      ">Driving License</option>" +
      '<option value="Voter ID"' +
      (bookingState.idType === "Voter ID" ? " selected" : "") +
      ">Voter ID</option>" +
      '<option value="PAN Card"' +
      (bookingState.idType === "PAN Card" ? " selected" : "") +
      ">PAN Card</option>" +
      '<option value="Other"' +
      (bookingState.idType === "Other" ? " selected" : "") +
      ">Other</option>" +
      "</select>" +
      "</div>" +
      '<div class="form-group-premium mb-0 mt-2">' +
      '<label class="form-label-premium">ID Number <span class="required">*</span></label>' +
      '<input type="text" id="bkIdNumber" value="' +
      escAttr(bookingState.idNumber) +
      '" placeholder="e.g. XXXX XXXX XXXX" class="form-control-premium">' +
      "</div>";
  }
  h += "</div>";
  b.innerHTML = h;
}

async function beEnsureGuestPicker() {
  if (typeof open_entind_crud === "function") return true;
  try {
    await loadExe2Fn(36);
    return typeof open_entind_crud === "function";
  } catch (e) {
    console.error("Guest selector load failed:", e);
    return false;
  }
}

window.openBookingGuestPicker = async function () {
  if (await beEnsureGuestPicker()) {
    open_entind_crud(null, null, "htGuestCrud", "selectBookingGuest", null);
  } else {
    showMessageModal("Info", "Guest selector not available.", false);
  }
};

window.selectBookingGuest = function (record) {
  var nameIn = document.getElementById("bkGuestName");
  if (nameIn && record) nameIn.value = record.h || record.i || "";
  if (record && record.e) {
    var parts = String(record.e).split(".");
    if (parts.length === 2) {
      var cc = document.getElementById("bkCountryCode");
      var mob = document.getElementById("bkMobile");
      if (cc) cc.value = parts[0];
      if (mob) mob.value = parts[1];
    }
  }
  if (record && record.a) {
    bookingState.guestCId = record.a;
  }
};

function renderChildrenStep() {
  var b = document.getElementById(bookingModalId + "_body");
  var childOpts = "";
  for (var i = 0; i <= 5; i++) {
    var lbl = i === 0 ? "No children" : i === 1 ? "1 child" : i + " children";
    childOpts +=
      '<option value="' +
      i +
      '"' +
      (i === bookingState.children.length ? " selected" : "") +
      ">" +
      lbl +
      "</option>";
  }
  // Guests step: Male + Female (Total Guests auto = m+f), then Children.
  // Blocks are guarded by their hide-codes (ad / ch).
  var h =
    '<div class="p-3">' +
    '<div class="d-flex align-items-center gap-2 mb-2">' +
    '<i class="fas fa-users text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Guests &amp; Children</span></div>' +
    '<div class="d-flex flex-wrap gap-2 mb-3">' +
    '<span class="ht-age-rule"><i class="fas fa-baby me-1"></i>0-4 yrs: Free</span>' +
    '<span class="ht-age-rule"><i class="fas fa-child me-1"></i>5-11 yrs: 50% rate</span>' +
    '<span class="ht-age-rule"><i class="fas fa-user me-1"></i>12+ yrs: Full rate</span>' +
    "</div>";
  if (!isABHidden("ad")) {
    h +=
      '<div class="form-row-premium mb-0">' +
      '<div class="form-group-premium mb-0">' +
      '<label class="form-label-premium">Male (12+) <span class="required">*</span></label>' +
      '<input type="number" id="bkMale" min="0" max="9" value="' +
      bookingState.male +
      '" oninput="updateTotalGuests()" class="form-control-premium fw-bold">' +
      "</div>" +
      '<div class="form-group-premium mb-0">' +
      '<label class="form-label-premium">Female (12+) <span class="required">*</span></label>' +
      '<input type="number" id="bkFemale" min="0" max="9" value="' +
      bookingState.female +
      '" oninput="updateTotalGuests()" class="form-control-premium fw-bold">' +
      "</div>" +
      '<div class="form-group-premium mb-0" style="max-width:170px;">' +
      '<label class="form-label-premium">Total Guests</label>' +
      '<input type="text" id="bkTotalGuests" value="' +
      bookingState.adults +
      '" readonly class="form-control-premium fw-bold" style="background:#F6F8FA;">' +
      '<div class="form-hint">Auto = male + female (1 to 9)</div></div>' +
      "</div>";
  }
  if (!isABHidden("ch")) {
    h +=
      '<div class="form-row-premium mb-0 mt-3">' +
      '<div class="form-group-premium mb-0">' +
      '<label class="form-label-premium">Children (0-17)</label>' +
      '<select id="bkChildCount" class="form-select-premium" onchange="rerenderChildRows()">' +
      childOpts +
      "</select>" +
      '<div class="form-hint">Name required only for age above 8</div></div></div>' +
      '<div id="bkChildRows" class="mt-3"></div>';
  }
  h += "</div>";
  b.innerHTML = h;
  renderChildRows();
  updateTotalGuests();
}

// Male + Female -> Total Guests live counter.
window.updateTotalGuests = function () {
  var m = parseInt(document.getElementById("bkMale")?.value) || 0;
  var f = parseInt(document.getElementById("bkFemale")?.value) || 0;
  var t = document.getElementById("bkTotalGuests");
  if (t) t.value = m + f;
};

window.rerenderChildRows = function () {
  var count = parseInt(document.getElementById("bkChildCount")?.value) || 0;
  while (bookingState.children.length < count) {
    bookingState.children.push({
      n: "",
      ag: "",
      c: parseFloat(
        window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.paidChildCharge,
      ) || 0,
    });
  }
  bookingState.children.length = count;
  renderChildRows();
};

function renderChildRows() {
  var wrap = document.getElementById("bkChildRows");
  if (!wrap) return;
  var count = bookingState.children.length;
  if (count === 0) {
    wrap.innerHTML =
      '<div class="text-sm text-gray">No children — proceed to room selection.</div>';
    return;
  }
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var freeMax = cfg.childAgeFreeMax != null ? cfg.childAgeFreeMax : 8;
  var h = "";
  for (var i = 0; i < count; i++) {
    var c = bookingState.children[i];
    var age = (c.ag !== "" && c.ag !== undefined ? c.ag : "");
    var isPaid = parseInt(age) > freeMax;
    var rate =
      c.c != null ? c.c : parseFloat(cfg.paidChildCharge) || 0;
    h +=
      '<div class="ht-child-row">' +
      '<span class="badge-premium badge-premium-emr">Child ' +
      (i + 1) +
      "</span>" +
      '<input type="text" class="form-control-premium bkChildName" placeholder="Name (required if age > 8)" value="' +
      escAttr(c.n || "") +
      '">' +
      '<input type="number" class="form-control-premium bkChildAge" placeholder="Age (0-17)" min="0" max="17" value="' +
      age +
      '" style="max-width:120px;" oninput="bkChildAgeChanged(this,' +
      i +
      ')">' +
      (isPaid
        ? bkChildRateZoneHTML(i, rate)
        : '<span class="bkChildRateZone"><span class="badge-premium badge-premium-emr" style="font-size:11px;">free</span></span>') +
      "</div>";
  }
  wrap.innerHTML = h;
}

function bkChildRateZoneHTML(idx, rate) {
  return (
    '<span class="bkChildRateZone">' +
    '<span class="badge-premium badge-premium-gold" style="font-size:11px;">paid</span>' +
    '<label class="form-label-premium mb-0 text-sm">₹/night</label>' +
    '<input type="number" class="form-control-premium bkChildRate" min="0" step="1" value="' +
    (rate || 0) +
    '" style="max-width:90px;" oninput="bkChildRateChanged(this,' +
    idx +
    ')">' +
    "</span>"
  );
}

window.bkChildAgeChanged = function (input, idx) {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var freeMax = cfg.childAgeFreeMax != null ? cfg.childAgeFreeMax : 8;
  var age = parseInt(input.value) || 0;
  var prevAge = parseInt(bookingState.children[idx].ag) || 0;
  var wasPaid = prevAge > freeMax;
  bookingState.children[idx].ag = age;
  var isPaid = age > freeMax;
  var row = input.closest(".ht-child-row");
  var zone = row && row.querySelector(".bkChildRateZone");
  if (isPaid && !wasPaid) {
    if (bookingState.children[idx].c == null) {
      bookingState.children[idx].c = parseFloat(cfg.paidChildCharge) || 0;
    }
    if (zone) zone.outerHTML = bkChildRateZoneHTML(idx, bookingState.children[idx].c);
  } else if (!isPaid && wasPaid) {
    if (zone)
      zone.outerHTML =
        '<span class="bkChildRateZone"><span class="badge-premium badge-premium-emr" style="font-size:11px;">free</span></span>';
  }
};

window.bkChildRateChanged = function (input, idx) {
  if (!bookingState.children[idx]) return;
  bookingState.children[idx].c = parseFloat(input.value) || 0;
};

function renderRoomStep() {
  var b = document.getElementById(bookingModalId + "_body");
  var nights = calcNights(bookingState.checkin, bookingState.checkout) || 1;
  if (adminRoomRecords.length === 0) {
    b.innerHTML =
      '<div class="ht-empty">' +
      '<i class="fas fa-bed"></i>' +
      "<b>No rooms available</b>" +
      "<p>Room data will appear here once synced from the server.</p>" +
      "</div>";
    return;
  }
  var today = new Date().toISOString().split("T")[0];
  // Room step: stay dates + times on top, room cards below (each shows a
  // read-only Room Status badge from the room record key k).
  var h =
    '<div class="p-3">' +
    '<div class="d-flex align-items-center gap-2 mb-2 flex-wrap">' +
    '<i class="fas fa-calendar-alt text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Stay Dates &amp; Times</span>' +
    '<span class="badge-premium badge-premium-gold ms-auto">' +
    nights +
    " night" +
    (nights > 1 ? "s" : "") +
    "</span></div>" +
    '<div class="form-row-premium mb-3">';
  if (!isABHidden("checkin")) {
    h +=
      '<div class="form-group-premium mb-0">' +
      '<label class="form-label-premium">Check-in Date <span class="required">*</span></label>' +
      '<input type="date" id="bkCheckin" value="' +
      escAttr(bookingState.checkin) +
      '" min="' +
      today +
      '" onchange="rerenderRoomDates()" class="form-control-premium fw-bold">' +
      "</div>";
  }
  if (!isABHidden("checkout")) {
    h +=
      '<div class="form-group-premium mb-0">' +
      '<label class="form-label-premium">Check-out Date <span class="required">*</span></label>' +
      '<input type="date" id="bkCheckout" value="' +
      escAttr(bookingState.checkout) +
      '" min="' +
      today +
      '" onchange="rerenderRoomDates()" class="form-control-premium fw-bold">' +
      "</div>";
  }
  if (!isABHidden("timein")) {
    h +=
      '<div class="form-group-premium mb-0">' +
      '<label class="form-label-premium">Check-in Time</label>' +
      '<input type="time" id="bkCheckinTime" value="' +
      escAttr(bookingState.checkinTime) +
      '" class="form-control-premium">' +
      "</div>";
  }
  if (!isABHidden("timeout")) {
    h +=
      '<div class="form-group-premium mb-0">' +
      '<label class="form-label-premium">Check-out Time</label>' +
      '<input type="time" id="bkCheckoutTime" value="' +
      escAttr(bookingState.checkoutTime) +
      '" class="form-control-premium">' +
      "</div>";
  }
  h +=
    "</div>" +
    '<div class="d-flex align-items-center gap-2 mb-2">' +
    '<i class="fas fa-bed text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Select a Room</span></div>' +
    '<div class="row g-2">';
  for (var i = 0; i < adminRoomRecords.length; i++) {
    var r = adminRoomRecords[i];
    var available = getRoomAvailability(
      r,
      bookingState.checkin,
      bookingState.checkout,
      bookingState.editBookingId || null,
    );
    var occ = htRoomOccupancy(r);
    var capacityOk =
      bookingState.adults <= (occ.adults || 99) &&
      bookingState.children.length <= (occ.children || 99);
    var roomNum = r.a != null ? r.a : r.e;
    var selected = String(roomNum) === String(bookingState.roomId);
    var cls = "ht-option-card";
    if (selected) cls += " selected";
    if (!available || !capacityOk) cls += " sold-out";
    var clickable = available && capacityOk;
    var rImg = htRoomImage(r);
    var rImgHtml = rImg
      ? '<img src="' +
      escAttr(rImg) +
      '" alt="' +
      escAttr(htRoomName(r)) +
      '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">'
      : '<i class="fas fa-bed"></i>';
    h +=
      '<div class="col-12 col-md-6">' +
      '<label class="' +
      cls +
      '" ' +
      (clickable
        ? "onclick=\"applyBookingRoom('" + roomNum + "')\""
        : "style=opacity:0.6;cursor:not-allowed;") +
      ">" +
      '<input type="radio" class="opt-radio" name="bkRoom" value="' +
      roomNum +
      '"' +
      (selected ? " checked" : "") +
      (clickable ? "" : " disabled") +
      ">" +
      '<div class="opt-icon">' +
      rImgHtml +
      "</div>" +
      '<div class="flex-grow-1">' +
      '<div class="opt-title">' +
      escHtml(htRoomName(r)) +
      "</div>" +
      '<div class="opt-sub">' +
      escHtml(occ.adults || 0) +
      " adults · " +
      escHtml(occ.children || 0) +
      " children" +
      (htRoomDimensions(r) ? " · " + escHtml(htRoomDimensions(r)) : "") +
      "</div>" +
      // Read-only Room Status badge (never stored with the booking).
      '<span class="opt-badge" style="background:#EAF7EC;border-color:#28a745;color:#1e7e34;">' +
      escHtml(htRoomStatusLabel(r.d != null ? r.d : r.k)) +
      "</span>" +
      (!available
        ? '<span class="opt-badge" style="background:#FDECEA;border-color:#dc3545;color:#c0392b;">Not available for these dates</span>'
        : !capacityOk
          ? '<span class="opt-badge" style="background:#FDECEA;border-color:#dc3545;color:#c0392b;">Capacity exceeded</span>'
          : "") +
      "</div>" +
      '<div class="opt-price">₹' +
      fmtAmt(htRoomRate(r)) +
      "<small>/night</small></div>" +
      "</label></div>";
  }
  h += "</div></div>";
  b.innerHTML = h;
}

// Date changes refresh the night count + availability immediately.
window.rerenderRoomDates = function () {
  bookingState.checkin = document.getElementById("bkCheckin")?.value || "";
  bookingState.checkout = document.getElementById("bkCheckout")?.value || "";
  renderRoomStep();
};

window.applyBookingRoom = function (id) {
  bookingState.roomId = id;
  renderBookingStep(3);
};

function renderPackageStep() {
  var b = document.getElementById(bookingModalId + "_body");
  var h =
    '<div class="p-3">' +
    '<div class="d-flex align-items-center gap-2 mb-3">' +
    '<i class="fas fa-gem text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Select a Package</span></div>' +
    '<div class="row g-2">';
  for (var i = 0; i < htPackages.length; i++) {
    var p = htPackages[i];
    var selected = String(p.a) === String(bookingState.packageId);
    var adjTxt =
      p.g === 0
        ? "Included in base rate"
        : "Adds " + Math.round(p.g * 100) + "% to room rate";
    h +=
      '<div class="col-12 col-md-6">' +
      '<label class="ht-option-card' +
      (selected ? " selected" : "") +
      '" onclick="applyBookingPackage(\'' +
      p.a +
      "')\">" +
      '<input type="radio" class="opt-radio" name="bkPkg" value="' +
      p.a +
      '"' +
      (selected ? " checked" : "") +
      ">" +
      '<div class="opt-icon"><i class="fas ' +
      (p.a == 4
        ? "fa-heart"
        : p.a == 3
          ? "fa-spa"
          : p.a == 2
            ? "fa-crown"
            : "fa-bed") +
      '"></i></div>' +
      '<div class="flex-grow-1">' +
      '<div class="opt-title">' +
      escHtml(p.e) +
      "</div>" +
      '<div class="opt-sub">' +
      escHtml(p.f) +
      "</div>" +
      '<span class="opt-badge">' +
      adjTxt +
      "</span></div>" +
      "</label></div>";
  }
  h += "</div></div>";
  b.innerHTML = h;
}

window.applyBookingPackage = function (id) {
  bookingState.packageId = id;
  renderBookingStep(4);
};

function renderAddonStep() {
  var b = document.getElementById(bookingModalId + "_body");
  var nights = calcNights(bookingState.checkin, bookingState.checkout) || 1;
  var h =
    '<div class="p-3">' +
    '<div class="d-flex align-items-center gap-2 mb-3">' +
    '<i class="fas fa-plus-circle text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Add-ons</span>' +
    '<span class="text-gray text-sm ms-auto">Optional enhancements</span></div>';
  for (var i = 0; i < htAddons.length; i++) {
    var ad = htAddons[i];
    var isOn = bookingState.addonIds.indexOf(ad.a) >= 0;
    var priceTxt =
      ad.h === "perNight" ? "₹" + fmtAmt(ad.g) + " / night" : "₹" + fmtAmt(ad.g) + " one-time";
    h +=
      '<div class="ht-addon-row' +
      (isOn ? " selected" : "") +
      '" id="addonRow_' +
      ad.a +
      '" onclick="toggleBookingAddon(' +
      ad.a +
      ',this)">' +
      '<input type="checkbox" ' +
      (isOn ? "checked" : "") +
      ' onchange="event.stopPropagation()">' +
      '<div class="flex-grow-1">' +
      '<div class="ad-title">' +
      escHtml(ad.e) +
      "</div>" +
      '<div class="ad-sub">' +
      escHtml(ad.f) +
      "</div></div>" +
      '<div class="ad-price">' +
      priceTxt +
      "</div>" +
      "</div>";
  }
  h +=
    '<div class="text-sm text-gray mt-1"><i class="fas fa-info-circle me-1"></i>Per-night add-ons are charged for all ' +
    nights +
    " night" +
    (nights > 1 ? "s" : "") +
    " of your stay.</div>";
  // Extra Particulars: checkbox + editable per-night amount for each extra.
  if (!isABHidden("extra")) {
    h +=
      '<div class="card-premium p-3 mt-3 mb-1">' +
      '<div class="d-flex align-items-center gap-2 mb-2">' +
      '<i class="fas fa-list-ul text-gold" style="font-size:16px;"></i>' +
      '<span class="fw-bold text-emr-dark" style="font-size:14px;">Extra Particulars</span></div>' +
      '<div class="ht-extra-list" id="bkExtraList">' +
      htExtraListHTML(bookingState.extraItems) +
      "</div>" +
      '<div class="form-hint mt-1">Check an extra and set its ₹ amount; the charges total updates automatically.</div>' +
      '<div class="form-group-premium mb-0 mt-2" style="max-width:220px;">' +
      '<label class="form-label-premium">Extra Charges (₹)</label>' +
      '<input type="number" id="bkExtraCharges" min="0" step="1" value="' +
      (bookingState.extraCharges || "") +
      '" placeholder="0" class="form-control-premium" readonly>' +
      '<div class="form-hint">Added to the bill and taxed with GST</div></div>' +
      "</div>";
  }
  h += "</div>";
  b.innerHTML = h;
}

window.toggleBookingAddon = function (id, el) {
  var idx = bookingState.addonIds.indexOf(id);
  if (idx >= 0) bookingState.addonIds.splice(idx, 1);
  else bookingState.addonIds.push(id);
  var cb = el.querySelector('input[type="checkbox"]');
  if (cb) cb.checked = idx < 0;
  if (el) el.classList.toggle("selected", idx < 0);
};

function getComputedAddons() {
  var nights = calcNights(bookingState.checkin, bookingState.checkout) || 1;
  var out = [];
  for (var i = 0; i < bookingState.addonIds.length; i++) {
    var ad = getAddonById(bookingState.addonIds[i]);
    if (!ad) continue;
    out.push({
      name: ad.e,
      price: ad.h === "perNight" ? ad.g * nights : ad.g,
    });
  }
  return out;
}

function renderSummaryStep() {
  var b = document.getElementById(bookingModalId + "_body");
  var room = getRoomById(bookingState.roomId);
  var pkg = getPackageById(bookingState.packageId);
  var nights = calcNights(bookingState.checkin, bookingState.checkout) || 1;
  var addons = getComputedAddons();
  var childAges = [];
  var childRates = [];
  for (var i = 0; i < bookingState.children.length; i++) {
    var sAge = parseInt(bookingState.children[i].ag) || 0;
    childAges.push(sAge);
    childRates.push(
      sAge >
        (window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.childAgeFreeMax ??
          8)
        ? parseFloat(bookingState.children[i].c) || 0
        : 0,
    );
  }
  var calc = calcTotal({
    nights: nights,
    roomRates: room ? adminRoomRates(room, nights) : [],
    childAges: childAges,
    childRates: childRates,
    childRate: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.paidChildCharge || 0,
    childAgeFreeMax: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.childAgeFreeMax ?? 8,
    adults: bookingState.adults || 0,
    includedAdults: 2,
    extraGuestRate: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.extraAdultsCharge || 0,
    packageAdj: pkg ? pkg.g : 0,
    addons: addons,
    extraCharges: bookingState.extraCharges,
  });
  lastCalcTotal = calc.total;

  var addonRows = "";
  if (addons.length === 0) {
    addonRows = "<tr><td>No add-ons selected</td><td>—</td></tr>";
  } else {
    for (var a = 0; a < addons.length; a++) {
      addonRows +=
        "<tr><td>" +
        escHtml(addons[a].name) +
        "</td><td>₹" +
        fmtAmt(addons[a].price) +
        "</td></tr>";
    }
  }

  var childTxt = bookingState.children.length
    ? bookingState.children.length +
    " child" +
    (bookingState.children.length > 1 ? "ren" : "") +
    " (ages " +
    childAges.join(", ") +
    ")"
    : "None";

  var guestsTxt = isABHidden("ad")
    ? bookingState.adults + " adult(s)"
    : bookingState.male + " male · " + bookingState.female + " female";
  if (bookingState.children.length) guestsTxt += ", " + childTxt;

  var stayTxt =
    escHtml(bookingState.checkin) + " → " + escHtml(bookingState.checkout);
  if (bookingState.checkinTime || bookingState.checkoutTime) {
    stayTxt +=
      " (" +
      escHtml(bookingState.checkinTime || "—") +
      " → " +
      escHtml(bookingState.checkoutTime || "—") +
      ")";
  }
  stayTxt += " · " + nights + " night" + (nights > 1 ? "s" : "");

  // Extra Particular row (only shown when extra charges/particular exist).
  var extraRow = "";
  if (
    !isABHidden("extra") &&
    (bookingState.extraCharges > 0 || bookingState.extraParticular)
  ) {
    extraRow =
      "<tr><td>Extra Particular</td><td>" +
      escHtml(bookingState.extraParticular || "Extra charges") +
      "</td></tr>" +
      '<tr class="tot"><td>Extra Charges</td><td>₹' +
      fmtAmt(bookingState.extraCharges) +
      "</td></tr>";
  }

  b.innerHTML =
    '<div class="p-3">' +
    '<div class="d-flex align-items-center gap-2 mb-3">' +
    '<i class="fas fa-clipboard-check text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Booking Summary</span></div>' +
    '<div class="card-premium p-3 mb-3">' +
    '<table class="ht-sum-table">' +
    "<tr><td>Booking Date</td><td>" +
    escHtml(bookingState.bookingDate || "-") +
    "</td></tr>" +
    (isABHidden("name")
      ? ""
      : "<tr><td>Guest</td><td>" +
      escHtml(bookingState.guestName) +
      "</td></tr>") +
    (isABHidden("contact")
      ? ""
      : "<tr><td>Contact</td><td>" +
      escHtml(
        formatMobile(bookingState.countryCode + "." + bookingState.mobile),
      ) +
      "</td></tr>") +
    "<tr><td>Stay</td><td>" +
    stayTxt +
    "</td></tr>" +
    "<tr><td>Guests</td><td>" +
    guestsTxt +
    "</td></tr>" +
    "<tr><td>Room</td><td>" +
    escHtml(room ? htRoomName(room) : "-") +
    (room ? " @ ₹" + fmtAmt(htRoomRate(room)) + "/night" : "") +
    (room
      ? " · " + escHtml(htRoomStatusLabel(room.d != null ? room.d : room.k))
      : "") +
    "</td></tr>" +
    "<tr><td>Package</td><td>" +
    escHtml(pkg ? pkg.e : "-") +
    "</td></tr>" +
    addonRows +
    extraRow +
    '<tr class="tot"><td>Room Subtotal</td><td>₹' +
    fmtAmt(calc.roomSubtotal) +
    "</td></tr>" +
    (calc.childAdj > 0
      ? '<tr class="tot"><td>Paid Child (' +
      calc.paidChildren +
      ")</td><td>₹" +
      fmtAmt(calc.childAdj) +
      "</td></tr>"
      : "") +
    (calc.adultAdj > 0
      ? '<tr class="tot"><td>Extra Adult (' +
      calc.extraAdults +
      " \u00d7 \u20B9" +
      fmtAmt(calc.extraGuestRate) +
      ")</td><td>₹" +
      fmtAmt(calc.adultAdj) +
      "</td></tr>"
      : "") +
    (calc.pkgAmount > 0
      ? '<tr class="tot"><td>Package Adjustment</td><td>₹' +
      fmtAmt(calc.pkgAmount) +
      "</td></tr>"
      : "") +
    (calc.addonsTotal > 0
      ? '<tr class="tot"><td>Add-ons</td><td>₹' +
      fmtAmt(calc.addonsTotal) +
      "</td></tr>"
      : "") +
    '<tr class="tot"><td>Subtotal</td><td>₹' +
    fmtAmt(calc.subtotal) +
    "</td></tr>" +
    '<tr class="tot"><td>GST (' +
    htGST +
    "%)</td><td>₹" +
    fmtAmt(calc.tax) +
    "</td></tr>" +
    '<tr class="tot"><td>Grand Total</td><td>₹' +
    fmtAmt(calc.total) +
    "</td></tr>" +
    "</table></div>" +
    '<div class="card-premium p-3 mb-3">' +
    '<div class="form-row-premium mb-2">' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Discount (%)</label>' +
    '<input type="number" id="bkDiscountPercent" min="0" max="100" step="0.1" class="form-control-premium" value="' +
    (bookingState.discountPercent || "") +
    '" oninput="updateDiscountFromPercent(this, ' +
    calc.total +
    ')">' +
    "</div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Discount Amt (₹)</label>' +
    '<input type="number" id="bkDiscountAmt" min="0" step="0.01" class="form-control-premium" value="' +
    (bookingState.discountAmt || "") +
    '" oninput="updateDiscountFromAmt(this, ' +
    calc.total +
    ')">' +
    "</div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Total After Discount (₹)</label>' +
    '<input type="text" id="bkTotalAfterDiscount" class="form-control-premium fw-bold be-readonly" readonly>' +
    "</div>" +
    "</div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Special Requests</label>' +
    '<textarea id="bkSpecialRequests" rows="2" class="form-control-premium" placeholder="Any special requests...">' +
    escAttr(bookingState.specialRequests || "") +
    "</textarea></div>" +
    "</div>" +
    renderPaymentBlock(Math.round(calc.total - (bookingState.discountAmt || 0))) +
    '<div class="text-sm text-gray"><i class="fas fa-info-circle me-1 text-emr"></i>Please review before confirming. ' +
    "The bill will open after the server accepts the booking.</div></div>";
}

// Discount helpers: keep % and amount in sync, clamped to 0-100% and 0-total.
function updateDiscountFromPercent(input, total) {
  var pct = parseFloat(input.value) || 0;
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  input.value = pct;
  var amt = Math.round(((total * pct) / 100) * 100) / 100;
  var amtEl = document.getElementById("bkDiscountAmt");
  if (amtEl) amtEl.value = amt;
  var totEl = document.getElementById("bkTotalAfterDiscount");
  if (totEl) totEl.value = Math.round(Math.max(0, total - amt));
  bookingState.discountPercent = pct;
  bookingState.discountAmt = amt;
}

function updateDiscountFromAmt(input, total) {
  var amt = parseFloat(input.value) || 0;
  if (amt < 0) amt = 0;
  if (amt > total) amt = total;
  input.value = amt;
  var pct = total > 0 ? Math.round((amt / total) * 100 * 100) / 100 : 0;
  var pctEl = document.getElementById("bkDiscountPercent");
  if (pctEl) pctEl.value = pct;
  var totEl = document.getElementById("bkTotalAfterDiscount");
  if (totEl) totEl.value = Math.round(Math.max(0, total - amt));
  bookingState.discountAmt = amt;
  bookingState.discountPercent = pct;
}

// Discount helpers for Booking Entry view: keep % and amount in sync.
function beUpdateDiscountFromPercent(input) {
  var total = parseFloat(document.getElementById("bePayable")?.value) || 0;
  var pct = parseFloat(input.value) || 0;
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  input.value = pct;
  var amt = Math.round(((total * pct) / 100) * 100) / 100;
  var amtEl = document.getElementById("beDiscountAmt");
  if (amtEl) amtEl.value = amt;
  var totEl = document.getElementById("beTotalAfterDiscount");
  if (totEl) totEl.value = Math.round(Math.max(0, total - amt));
  bookingState.discountPercent = pct;
  bookingState.discountAmt = amt;
  beRecalc();
}

function beUpdateDiscountFromAmt(input) {
  var total = parseFloat(document.getElementById("bePayable")?.value) || 0;
  var amt = parseFloat(input.value) || 0;
  if (amt < 0) amt = 0;
  if (amt > total) amt = total;
  input.value = amt;
  var pct = total > 0 ? Math.round((amt / total) * 100 * 100) / 100 : 0;
  var pctEl = document.getElementById("beDiscountPercent");
  if (pctEl) pctEl.value = pct;
  var totEl = document.getElementById("beTotalAfterDiscount");
  if (totEl) totEl.value = Math.round(Math.max(0, total - amt));
  bookingState.discountAmt = amt;
  bookingState.discountPercent = pct;
  beRecalc();
}

function bePaymentsSum() {
  var payList = bookingState.payments || [];
  var sum = 0;
  for (var i = 0; i < payList.length; i++) {
    var v = parseFloat(payList[i] && payList[i].j) || 0;
    if (v > 0) sum += v;
  }
  return sum;
}

// Changing the advance payments only affects Balance Due (no full recalculation).
window.beUpdateBalanceDue = function () {
  var totalAfterDiscount =
    parseFloat(document.getElementById("beTotalAfterDiscount")?.value) ||
    parseFloat(document.getElementById("bePayable")?.value) ||
    0;
  var b = document.getElementById("beBalanceDue");
  if (b) b.value = Math.round(totalAfterDiscount - bePaymentsSum());
};

function bkStatePaymentSum() {
  var payList = bookingState.payments || [];
  var sum = 0;
  for (var i = 0; i < payList.length; i++) {
    var v = parseFloat(payList[i] && payList[i].j) || 0;
    if (v > 0) sum += v;
  }
  return sum;
}

// (Payments come from the Receipt/Payment modal via window.fnAfterRcptPmt.)

// Payment block (fields 22-31): read-only advance payments list fed by the
// Receipt/Payment modal, auto Balance Due, Payment Status. Blocks guarded by
// adv / paystatus.
function renderPaymentBlock(total) {
  var due = total - bkStatePaymentSum();
  var h =
    '<div class="card-premium p-3 mb-3">' +
    '<div class="d-flex align-items-center gap-2 mb-2">' +
    '<i class="fas fa-money-bill-wave text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Payment</span>' +
    '<span class="ms-auto text-gray text-sm">Total Payable: ₹' +
    fmtAmt(total) +
    "</span></div>";
  if (!isABHidden("adv")) {
    h +=
      '<button type="button" class="btn-premium btn-premium-secondary btn-premium-sm" onclick="openRcptPmtModal()">' +
      '<i class="fas fa-receipt me-1"></i> Receipt / Payment</button>' +
      '<div id="bkPaymentRows" class="mt-2">' +
      payRowsHTML(bookingState.payments) +
      "</div>" +
      paymentUpdateBtnHTML();
  }
  h +=
    '<div class="form-row-premium mb-2 mt-2">' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Balance Due (₹)</label>' +
    '<input type="text" id="bkBalanceDue" value="' +
    Math.round(due) +
    '" readonly class="form-control-premium fw-bold" style="background:#F6F8FA;">' +
    "</div></div>";
  if (!isABHidden("paystatus")) {
    var st = ["Pending", "Partial", "Paid"];
    var stOpts = '<option value="">Select status...</option>';
    for (var s = 0; s < st.length; s++) {
      stOpts +=
        '<option value="' +
        st[s] +
        '"' +
        (bookingState.payStatus === st[s] ? " selected" : "") +
        ">" +
        st[s] +
        "</option>";
    }
    h +=
      '<div class="form-group-premium mb-0 mt-1" style="max-width:240px;">' +
      '<label class="form-label-premium">Payment Status</label>' +
      '<select id="bkPayStatus" class="form-select-premium">' +
      stOpts +
      "</select></div>";
  }
  h += "</div>";
  return h;
}

// Balance Due auto-updates as the advance payments change.
window.updateBalanceDue = function () {
  var disc = bookingState.discountAmt || 0;
  var el = document.getElementById("bkBalanceDue");
  if (el) el.value = Math.round(lastCalcTotal - disc - bkStatePaymentSum());
};

// Clear Form: reset all state and start over from step 1 (new booking).
window.clearBookingForm = function () {
  window.showModal({
    title: "Clear Form",
    message: "Reset all booking form fields and start over?",
    type: "confirm",
    onConfirm: function () {
      var today = new Date().toISOString().split("T")[0];
      var tomorrow = new Date(Date.now() + 86400000)
        .toISOString()
        .split("T")[0];
      bookingStep = 1;
      lastCalcTotal = 0;
      bookingState = {
        bookingDate: today,
        checkin: today,
        checkout: tomorrow,
        checkinTime: "",
        checkoutTime: "",
        guestName: "",
        countryCode: "91",
        mobile: "",
        email: "",
        idType: "",
        idNumber: "",
        address: "",
        male: 1,
        female: 0,
        adults: 1,
        children: [],
        roomId: 0,
        packageId: 1,
        addonIds: [],
        extraParticular: "",
        extraCharges: 0,
        payments: [],
        payStatus: "",
        guestCId: 0,
        discountPercent: 0,
        discountAmt: 0,
        chargeWithAc: false,
        specialRequests: "",
      };
      renderBookingStep(1);
    },
  });
};

// Booking snapshot passed to the bill generator (modules/bill.js) so it can
// render the full counter bill without re-reading the closed modal.
function buildLastSnap(built) {
  var payList = bookingState.payments || [];
  var advanceTotal = 0;
  for (var pi = 0; pi < payList.length; pi++) {
    var pm = payList[pi] || {};
    var pv = fmtAmt(parseFloat(pm.j));
    if (pv > 0) advanceTotal += pv;
  }
  // Add-ons (ado) and extras (adt) shown on the bill must match the saved
  // facility-charges envelope in l, not the pre-save form state.
  var cfgAll = window[my1uzr.worknOnPg]?.clientConfig || {};
  var adonsSrc = Array.isArray(cfgAll.adons) ? cfgAll.adons : [];
  var adtSrc = Array.isArray(cfgAll.adtnolChrgs) ? cfgAll.adtnolChrgs : [];
  var env = parseBookingFacilityL(
    built && built.payload ? built.payload.l : null,
  );
  var snapNights =
    built && built.calc && built.calc.nights ? Number(built.calc.nights) || 1 : 1;
  var addonRows = [];
  var extraRows = [];
  var extraNames = [];
  var extraTotal = 0;
  (env.ado || []).forEach(function (en) {
    var nm = "";
    for (var ai2 = 0; ai2 < adonsSrc.length; ai2++) {
      if (Number(adonsSrc[ai2].a) === Number(en.a)) nm = String(adonsSrc[ai2].b || "");
    }
    addonRows.push({
      name: nm || "Add-on",
      price: (Number(en.b) || 0) * snapNights,
    });
  });
  (env.adt || []).forEach(function (en) {
    var nm = "";
    for (var aj2 = 0; aj2 < adtSrc.length; aj2++) {
      if (Number(adtSrc[aj2].a) === Number(en.a)) nm = String(adtSrc[aj2].b || "");
    }
    var label = nm || "Extra Charges";
    extraRows.push({ name: label, price: Number(en.b) || 0 });
    extraNames.push(label);
    extraTotal += Number(en.b) || 0;
  });
  return {
    bookingDate: bookingState.bookingDate,
    guestName: bookingState.guestName,
    contact: bookingState.countryCode + "." + bookingState.mobile,
    email: bookingState.email,
    idType: bookingState.idType,
    idNumber: bookingState.idNumber,
    checkin: bookingState.checkin,
    checkout: bookingState.checkout,
    checkinTime: bookingState.checkinTime,
    checkoutTime: bookingState.checkoutTime,
    nights: built.calc.nights,
    male: bookingState.male,
    female: bookingState.female,
    adults: bookingState.adults,
    children: bookingState.children,
    freeChildren: built.calc.freeChildren,
    roomName: built.room ? htRoomName(built.room) : "",
    roomRate: built.room ? parseInt(htRoomRate(built.room)) || 0 : 0,
    roomStatus: built.room
      ? htRoomStatusLabel(built.room.d != null ? built.room.d : built.room.k)
      : "",
    pkgName: built.pkg ? built.pkg.e : "",
    addons: addonRows,
    extraRows: extraRows,
    extraParticular: extraNames.join(", "),
    extraCharges: extraTotal,
    calc: built.calc,
    gst: htGST,
    discountAmt: bookingState.discountAmt || 0,
    discountPercent: bookingState.discountPercent || 0,
    payments: bookingState.payments,
    advanceAmount: advanceTotal,
    balanceDue: Math.round(
      Math.round(built.calc.total - (bookingState.discountAmt || 0)) -
      advanceTotal,
    ),
    payStatus: bookingState.payStatus,
  };
}

function bookingBtnLoading(on) {
  var btn = document.getElementById(bookingModalId + "_nextBtn");
  if (!btn) return;
  btn.disabled = on;
  btn.innerHTML = on
    ? '<span class="spinner"></span> Saving...'
    : '<i class="fas fa-check-circle me-1"></i> Confirm Booking';
}

function closeBookingModal() {
  var modalEl = document.getElementById(bookingModalId);
  if (modalEl) {
    var inst = bootstrap.Modal.getInstance(modalEl);
    if (inst) inst.hide();
  }
}

// Shared post-save flow: close the form, then show the generated bill.
// When the bill modal closes, reload the data and return to the dashboard.
// Falls back to a success popup if the bill module is not loaded.
function finishBookingSave(built, title, msg) {
  closeBookingModal();
  beBookedDatesCache = {};
  var snap = buildLastSnap(built);
  if (typeof showBill === "function") {
    showBill(snap, function () {
      adminLoadDataFromDB().then(function () {
        showDashboard();
      });
    });
  } else {
    adminLoadDataFromDB().then(function () {
      showDashboard();
      showMessageModal(title, msg, false);
    });
  }
}

// Shared flat booking payload builder (letters e..s). Used by:
// - saveBooking:   add,   fn=112 on s.php
// - updateBooking: update, fn=-4  on update.php (+ x1 = booking id)
function buildBookingPayload() {
  // payload0 is a shared global: the guest-search flows (fn 36 / entity crud)
  // can leave a guest object in payload0.c. The booking payload must not
  // can leave leftover keys. Reset to the set_owner base keys only
  // (eo/ec/fi/fk/mk) before assembling the booking request.
  clearPayload0();
  var room = getRoomById(bookingState.roomId);
  var pkg = getPackageById(bookingState.packageId);
  var nights = calcNights(bookingState.checkin, bookingState.checkout) || 1;
  var addons = getComputedAddons();
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var cfgAllRm = window[my1uzr.worknOnPg].clientConfig || {};
  var freeMax = cfg.childAgeFreeMax != null ? cfg.childAgeFreeMax : 8;
  var paidCharge = cfg.paidChildCharge || 0;
  var childAges = [];
  var childRates = [];
  var paidChildren = 0;
  var freeChildren = 0;
  for (var i = 0; i < bookingState.children.length; i++) {
    var age = parseInt(bookingState.children[i].ag) || 0;
    childAges.push(age);
    childRates.push(
      age > freeMax ? parseFloat(bookingState.children[i].c) || 0 : 0,
    );
    if (age > freeMax) paidChildren++;
    else freeChildren++;
  }
  var calc = calcTotal({
    nights: nights,
    roomRates: room ? adminRoomRates(room, nights) : [],
    childAges: childAges,
    childRates: childRates,
    childRate: paidCharge,
    childAgeFreeMax: freeMax,
    adults: bookingState.adults || 0,
    includedAdults: 2,
    extraGuestRate: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.extraAdultsCharge || 0,
    packageAdj: pkg ? pkg.g : 0,
    addons: addons,
    extraCharges: bookingState.extraCharges,
  });

  // 1. Build facility charges JSON envelope (zrb.l): core charges for the `l`
  //    array, selected add-ons in `ado`, selected adtnolChrgs extras in `adt`.
  var charges = [];
  var ado = [];
  var adt = [];
  if (room) {
    if (calc.adultAdj > 0) charges.push({ a: 9, b: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.extraAdultsCharge || 0 });
    // Children: single {a:8,b:rate} entry when every paid child uses the
    // default rate (payload stays byte-identical to legacy), otherwise one
    // {a:8,b:rate} entry per paid child with its editable rate.
    if (calc.childAdj > 0) {
      var customChildRate = false;
      for (var cr = 0; cr < bookingState.children.length; cr++) {
        var cAge = parseInt(bookingState.children[cr].ag) || 0;
        if (cAge > freeMax) {
          var cRate = parseFloat(bookingState.children[cr].c) || 0;
          if (Math.abs(cRate - paidCharge) > 0.0001) {
            customChildRate = true;
            break;
          }
        }
      }
      if (!customChildRate) {
        charges.push({ a: 8, b: paidCharge });
      } else {
        for (var cr2 = 0; cr2 < bookingState.children.length; cr2++) {
          var cAge2 = parseInt(bookingState.children[cr2].ag) || 0;
          if (cAge2 > freeMax) {
            charges.push({
              a: 8,
              b: parseFloat(bookingState.children[cr2].c) || 0,
            });
          }
        }
      }
    }
    // Add-ons section selections (bookingState.addonIds). Each ado entry
    // stores the add-on's PER-NIGHT rate (b), not the nights-multiplied total.
    var addonIdsArr = bookingState.addonIds || [];
    var adonsArr = Array.isArray(cfgAllRm.adons) ? cfgAllRm.adons : [];
    for (var adi = 0; adi < addonIdsArr.length; adi++) {
      var adRec = getAddonById(addonIdsArr[adi]);
      if (!adRec) continue;
      var fidA = 0;
      for (var adi2 = 0; adi2 < adonsArr.length; adi2++) {
        if (String(adonsArr[adi2].b || "") === String(adRec.e || "")) {
          fidA = Number(adonsArr[adi2].a);
          break;
        }
      }
      if (fidA) ado.push({ a: fidA, b: Number(adRec.g) || 0 });
    }
    // Each checked Extra Particular maps to its own facility id priced at its
    // amount. Add-on rows (adons, mode "night") store their PER-NIGHT rate in
    // ado; extras (adtnolChrgs) store their flat amount in adt.
    var mappedExtras = 0;
    var extraItemsPayload = bookingState.extraItems || [];
    for (var xq = 0; xq < extraItemsPayload.length; xq++) {
      var exItem = extraItemsPayload[xq] || {};
      var exName = String(exItem.name || "");
      var exAmt = parseFloat(exItem.amount) || 0;
      mappedExtras++;
      if (exItem.mode === "night") {
        var addonFid = Number(exItem.id);
        ado.push({ a: addonFid || 0, b: Math.round(exAmt) });
      } else {
        var fidX = htExtraFacilityId(exName);
        adt.push({
          a: fidX || Number(exItem.id) || 3,
          b: Math.round(exAmt),
        });
      }
    }
    // Fallback for manual/unknown extra amounts with no mapped selection.
    if (
      (bookingState.extraParticular || bookingState.extraCharges > 0) &&
      mappedExtras === 0
    ) {
      adt.push({ a: 3, b: bookingState.extraCharges }); // extra-mattress facility as catch-all
    }
  }

  // 2. Actual check-in/out timestamps
  var actualCheckin = bookingState.checkinTime
    ? bookingState.checkin + " " + bookingState.checkinTime
    : null;
  var actualCheckout = bookingState.checkoutTime
    ? bookingState.checkout + " " + bookingState.checkoutTime
    : null;

  // 3. Booking datetime (from booking date field + current time)
  var bookingDtt =
    (bookingState.bookingDate || todayStr()) +
    " " +
    new Date().toTimeString().slice(0, 5);

  // 4. Guest info JSON (zrb.k structure). g holds each child's editable
  // per-night charge (parallel to e, 0 for free children); h holds the extras
  // breakdown [[id, amount]] so edits restore the exact amounts (add-ons store
  // their per-night rate, extras their flat amount).
  var extraBreakdown = [];
  for (var eb = 0; eb < (bookingState.extraItems || []).length; eb++) {
    extraBreakdown.push([
      Number(bookingState.extraItems[eb].id) || 0,
      parseFloat(bookingState.extraItems[eb].amount) || 0,
    ]);
  }
  var guestJson = JSON.stringify({
    a: bookingState.adults,
    b: bookingState.children.length,
    c: paidChildren,
    d: freeChildren,
    e: childAges,
    f: bookingState.packageId || 0,
    g: childRates,
    h: extraBreakdown,
  });

  // 5a. Multiple advance payments -> p.r array. Each r record keeps the full
  // row shape produced by the Receipt/Payment modal (e, f, g, h, i, j, k, l,
  // m, n, o, tb, td) so the server stores them, mirroring updateBillPayments.
  // The temp client id (a) is not sent - it is only a local modal counter.
  var payments = [];
  var payList = bookingState.payments || [];
  for (var pi = 0; pi < payList.length; pi++) {
    var pm = payList[pi] || {};
    var pj = parseFloat(pm.j) || 0;
    var piMode = pm.i != null ? String(pm.i) : "";
    var pt =
      pm.td != null ? String(pm.td) : pm.l && pm.l.td != null ? String(pm.l.td) : "";
    if (pj <= 0 && !piMode && !pt) continue; // skip empty rows
    var rec = {};
    for (var key in pm) {
      if (!Object.prototype.hasOwnProperty.call(pm, key)) continue;
      if (key === "a") continue; // local modal counter, not a server id
      rec[key] = pm[key];
    }
    rec.j = String(pj);
    rec.i = piMode;
    rec.h = receiptPartyId(rec);
    if (rec.k == null || rec.k === "") rec.k = todayStr();
    if (pt) {
      if (!rec.l || typeof rec.l !== "object") rec.l = {};
      rec.l.td = pt;
    }
    payments.push(rec);
  }

  // 5. Flat payload matching zrb columns (excludes a,b,c,d - server managed)
  payload0.p = {
    e: room ? (room.a != null ? room.a : room.e) : 0, // room ID from rm
    f: bookingDtt, // booking datetime (from booking date field)
    g: bookingState.checkin, // check-in date
    h: bookingState.checkout, // check-out date
    i: actualCheckin, // actual check-in dtt
    j: actualCheckout, // actual check-out dtt
    k: guestJson, // guest info JSON
    l: buildBookingFacilityL(charges, ado, adt, bookingState.chargeWithAc ? 1 : 0), // facility charges JSON envelope
    m: Math.round(Math.max(0, calc.total - (bookingState.discountAmt || 0))), // total amount after discount
    n: bookingState.discountAmt || 0, // discount amount
    o: bookingState.guestCId || 0, // booker ID (guest's c table PK)
    p: 0, // booking ref (server assigns)
    q: bookingState.specialRequests || null, // special requests
    r: payments, // multiple advance payments [{ j, i, l: { td } }]
  };

  // Hidden-field cleanup: gated keys are deleted so nothing hidden is sent.
  function delP(key) {
    delete payload0.p[key];
  }
  if (isABHidden("room")) delP("e");
  if (isABHidden("timein")) delP("i");
  if (isABHidden("timeout")) delP("j");
  if (isABHidden("guest")) delP("k");
  if (isABHidden("addon") && isABHidden("extra")) delP("l");
  if (isABHidden("discount")) delP("n");
  if (isABHidden("special")) delP("q");
  if (isABHidden("adv")) delP("r");
  var built = { room: room, pkg: pkg, calc: calc };
  built.payload = payload0.p;
  return built;
}

window.saveBooking = async function () {
  var built = buildBookingPayload();

  bookingBtnLoading(true);
  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
    { tb: "rb" },
    { tb: "r" },
    { tb: "c" },
  ]);
  payload0.fn = 112; // counter booking op on bo.php

  console.log("📤 Save Booking:", JSON.stringify(payload0.p, null, 2));

  try {
    if (typeof fnj3 === "function") {
      var resp = await fnj3(
        "https://my1.in/2/s.php",
        payload0,
        1,
        true,
        null,
        20000,
        0,
        1,
        1,
      );
      if (resp && resp.su == 1) {
        if (typeof handl_rm_rspons !== "function") {
          try {
            await loadExe2Fn(52);
          } catch (e) {
            console.warn("loadExe2Fn(52) failed:", e);
          }
        }
        await handl_rm_rspons(resp);
        closeBookingModal();
        beBookedDatesCache = {};
        await adminLoadDataFromDB();
        showDashboard();
        my1PageLoader(true);
        setTimeout(function () {
          var rbList = (resp && resp.rb && resp.rb.l) || [];
          var lastRb = rbList.length ? rbList[rbList.length - 1] : null;
          printBillFromDashboard(lastRb ? lastRb.a : null);
          my1PageLoader(false);
        }, 2000);
      } else {
        showMessageModal("Error", resp?.ms || "Failed to save booking", true);
      }
    } else {
      showMessageModal("Info", "Server communication not available", false);
    }
  } catch (err) {
    if (bookingEntryMode()) {
      // Booking Entry view: keep the form (and its Stay Dates) so the user can
      // correct and retry instead of losing the entered data.
      showMessageModal("Info", "Error: " + err.message, false);
    } else {
      closeBookingModal();
      await adminLoadDataFromDB();
      showDashboard();
      showMessageModal("Info", "Error: " + err.message, false);
    }
  }
  bookingBtnLoading(false);
};

// ── UPDATE BOOKING ─────────────────────────────────────────────────────
// Endpoint: https://my1.in/2/update.php  |  fn = -4  |  x1 = booking id.
// Same flat payload letters (e..s) as an add, targeted at the record being
// edited via bookingState.editBookingId.
window.updateBooking = async function () {
  var bookingId = bookingState.editBookingId;
  if (!bookingId) {
    showMessageModal("Info", "No booking selected to update!", false);
    return;
  }
  if (typeof fnj3 !== "function") {
    showMessageModal("Info", "Server communication not available", false);
    return;
  }
  var built = buildBookingPayload();

  payload0.x1 = bookingId;
  payload0.p = built.payload;
  // Receipts (r-objects) are NOT part of the booking update payload — they are
  // updated separately via updateBillPayments (p.php, fn 103) using the
  // "Update Payments" button under the receipt list.
  if (payload0.p.r != null) delete payload0.p.r;
  payload0.vw = 1;
  payload0.fn = 114; // update op (update.php)
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
    { tb: "rb" },
    { tb: "rm" },
    { tb: "c" },
  ]);

  console.log(
    "📤 Update Booking:",
    bookingId,
    JSON.stringify(payload0.p, null, 2),
  );

  try {
    var resp = await fnj3(
      "https://my1.in/2/s.php",
      payload0,
      1,
      true,
      null,
      20000,
      0,
      1,
      1,
    );
    if (resp && resp.su == 1) {
      if (typeof handl_rm_rspons !== "function") {
        try {
          await loadExe2Fn(52);
        } catch (e) {
          console.warn("loadExe2Fn(52) failed:", e);
        }
      }
      await handl_rm_rspons(resp);
      beBookedDatesCache = {};
      bookingState.editBookingId = 0;
      await adminLoadDataFromDB();
      showDashboard();
      showMessageModal("Success", "✅ Booking updated successfully!", false);
    } else {
      showMessageModal("Error", resp?.ms || "Failed to update booking", true);
    }
  } catch (err) {
    showMessageModal("Info", "Error: " + err.message, false);
  }
};

// ── DELETE BOOKING ─────────────────────────────────────────────────────
window.deleteBookingRecord = function (record) {
  if (!record || !record.a) return;
  return (async function () {
    if (!(await window.showConfirmModal(
      "Delete this booking? This cannot be undone.",
    )))
      return;
    if (typeof fnj3 !== "function") {
      showMessageModal("Info", "Server communication not available", false);
      return;
    }
    var upd = {};
    for (var key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key))
        upd[key] = record[key];
    }
    upd.a = record.a;
    upd.o = 4; // status -> Cancelled

    clearPayload0();
    payload0.x1 = record.a;
    //payload0.p = upd;
    payload0.vw = 1;
    payload0.fn = 115; // Delete Bookings

    console.log("🗑️ Delete Booking:", record.a, JSON.stringify(payload0.p));

    try {
      var resp = await fnj3(
        "https://my1.in/2/t.php",
        payload0,
        1,
        true,
        null,
        20000,
        0,
        1,
        1,
      );
      if (resp && resp.su == 1) {
        // if (typeof handl_rm_rspons !== "function") {
        //   try {
        //     await loadExe2Fn(52);
        //   } catch (e) {
        //     console.warn("loadExe2Fn(52) failed:", e);
        //   }
        // }
        await dbDexieManager.deleteRecords(dbnm, "rb", record.a).catch(err => {
          console.error(err);
        });
        beBookedDatesCache = {};
        await adminLoadDataFromDB();
        showDashboard();
        showMessageModal("Success", "✅ " + resp?.ms || "Booking deleted" + "!", false);
      } else {
        showMessageModal("Error", resp?.ms || "Failed to delete booking", true);
      }
    } catch (err) {
      showMessageModal("Info", "Error: " + err.message, false);
    }
  })();
};

// ── EDIT BOOKING (prefill + open the entry form / wizard) ──────────────
// Copies back every field the add payload stores (room e, dates g/h, times
// i/j, booking date f, guests/children k, extras/addons l, discount n,
// special requests q) from the saved raw row, plus name/mobile from the
// display row. Fields the payload never sent (address, advance, balance,
// payment status, discount %) are never stored, so they stay blank.
function timePartOfDtt(dtt) {
  var s = String(dtt || "");
  var sp = s.indexOf(" ");
  if (sp > 0) {
    var t = s.slice(sp + 1, sp + 6);
    if (/^\d{2}:\d{2}$/.test(t)) return t;
  }
  if (/^\d{2}:\d{2}$/.test(s.slice(0, 5))) return s.slice(0, 5);
  return "";
}

// Rebuilds addonIds + extraItems (and extraParticular/extraCharges) from the
// saved raw row. New payloads carry the exact breakdown in k.h ([[id, rate]]);
// legacy [[name, rate]] rows are also accepted. per-child charges live in k.g;
// oldest rows are reconstructed best-effort from the facility-charges envelope
// l = {l: [{a: facilityId, b: price}], ado: [...], adt: [...]}.
function applySavedExtrasToState(raw) {
  if (!raw) return;
  var parsedL = parseBookingFacilityL(raw.l);
  var charges = parsedL.main.concat(parsedL.ado).concat(parsedL.adt);
  var gk = null;
  try {
    gk = typeof raw.k === "string" ? JSON.parse(raw.k) : raw.k || null;
  } catch (e) {
    gk = null;
  }
  var nights = Math.max(
    1,
    calcNights(bookingState.checkin, bookingState.checkout) || 1,
  );

  // Add-ons (ado, per-night) and extras (adt, fixed) may share the same
  // facility id (adons and adtnolChrgs each start at 1), so they are resolved
  // against their own list by id - a shared id -> name map would cross-wire
  // the checkboxes.
  var addonRowById = {};
  var cfgA = window[my1uzr.worknOnPg]?.clientConfig || {};
  var adonsArr = Array.isArray(cfgA.adons) ? cfgA.adons : [];
  for (var adi = 0; adi < adonsArr.length; adi++) {
    var arec = adonsArr[adi];
    if (arec && arec.a != null)
      addonRowById[Number(arec.a)] = {
        name: arec.b != null ? String(arec.b) : "",
        mode: "night",
      };
  }
  var extraRowById = {};
  for (var i = 0; i < htExtras.length; i++) {
    var x = htExtras[i];
    var xi = x && x.a != null ? Number(x.a) : 0;
    if (xi) extraRowById[xi] = { name: x.e, mode: "stay" };
  }
  // fid -> {name, mode}: union of extras (flat) and add-ons (per-night), used
  // to resolve saved k.h [id, amount] rows back into names and modes.
  var fidMeta = {};
  for (var em = 0; em < htExtras.length; em++) {
    var ex = htExtras[em];
    var exFid = Number(ex.a);
    if (exFid && fidMeta[exFid] === undefined)
      fidMeta[exFid] = { name: ex.e, mode: "stay" };
  }
  var addRows = htAddonRows();
  for (var am2 = 0; am2 < addRows.length; am2++) {
    var ar = addRows[am2];
    if (ar.id && fidMeta[ar.id] === undefined)
      fidMeta[ar.id] = { name: ar.name, mode: "night" };
  }

  var addonIds = [];
  var extraItems = [];

  // Push an item into extraItems de-duplicated by name (the same key the
  // Extra Particulars checkbox list uses to restore its checked state).
  function pushExtra(item) {
    if (!item || !item.name) return;
    for (var d = 0; d < extraItems.length; d++) {
      if (extraItems[d].name === item.name) return;
    }
    extraItems.push(item);
  }

  // Restores one saved charge entry (facility id + amount). Add-ons (ado) map
  // to their per-night add-on checkbox in Extra Particulars as well as the
  // wizard addonIds list; extras (adt) map to their flat Extra Particular row.
  function mapAddon(c) {
    if (!c || c.a == null) return;
    var fid = Number(c.a);
    var row = addonRowById[fid];
    if (!row) return;
    if (addonIds.indexOf(fid) === -1) addonIds.push(fid);
    pushExtra({
      id: fid,
      name: row.name,
      amount: parseFloat(c.b) || 0,
      mode: "night",
    });
  }
  function mapExtra(c) {
    if (!c || c.a == null) return;
    var xi = extraRowById[Number(c.a)];
    if (!xi) return;
    // l stores the flat extra amount.
    pushExtra({
      id: Number(c.a),
      name: xi.name,
      amount: parseFloat(c.b) || 0,
      mode: "stay",
    });
  }

  // The l envelope (ado = add-ons, adt = extras) is the authoritative source
  // for the Extra Particulars checkboxes. It restores everything saved to the
  // booking, including add-ons picked in the wizard step (which live in ado but
  // not always in k.h).
  if (parsedL.ado.length || parsedL.adt.length) {
    parsedL.ado.forEach(mapAddon);
    parsedL.adt.forEach(mapExtra);
  } else if (Array.isArray(gk && gk.h)) {
    // k.h breakdown rows are [id, amount]; legacy [name, amount] rows are
    // matched by name so older bookings restore too. Add-on ids resolve to a
    // per-night mode, extras to a flat mode.
    for (var hq = 0; hq < gk.h.length; hq++) {
      var hr = gk.h[hq];
      if (!hr || hr.length < 2) continue;
      var first = hr[0];
      var rate = parseFloat(hr[1]) || 0;
      var meta = null;
      var fidN = 0;
      var firstS = String(first);
      var num = parseFloat(firstS);
      if (firstS.trim() !== "" && !isNaN(num)) {
        fidN = Number(num);
        meta = fidMeta[fidN];
      }
      if (!meta) {
        for (var nmk in fidMeta) {
          if (fidMeta[nmk].name === firstS) {
            meta = fidMeta[nmk];
            fidN = Number(nmk);
            break;
          }
        }
      }
      if (!meta) continue;
      if (meta.mode === "night" && fidN && addonIds.indexOf(fidN) === -1)
        addonIds.push(fidN);
      pushExtra({
        id: fidN,
        name: meta.name,
        amount: rate,
        mode: meta.mode,
      });
    }
  } else {
    // Oldest rows (bare-array l, no k.h breakdown): scan the flattened charges.
    // Core facility codes (1 room rate, 8 paid child, 9 extra adult, 3 extra
    // mattress catch-all) are line items, never add-ons/extras. Skipping them
    // stops the room row (a:1) from re-checking "Extra Mattress" and
    // "Early Check-IN" via id collision.
    charges.forEach(function (c) {
      var cfid = c && Number(c.a) || 0;
      if (cfid === 1 || cfid === 3 || cfid === 8 || cfid === 9) return;
      mapAddon(c);
      mapExtra(c);
    });
  }

  bookingState.addonIds = addonIds;
  bookingState.extraItems = extraItems;
  var extrasTotal = 0;
  var names = [];
  for (var tq = 0; tq < extraItems.length; tq++) {
    var ei = extraItems[tq];
    extrasTotal += ei.mode === "night" ? ei.amount * nights : ei.amount;
    names.push(ei.name);
  }
  bookingState.extraParticular = names.join(", ");
  bookingState.extraCharges = extrasTotal;
}

// Copies every editable field stored in a saved raw row (k/l/i/j/n/q/f) back
// into bookingState so the Booking Entry / wizard edit form re-opens fully.
function restoreSavedBookingIntoState(raw) {
  if (!raw) return;
  var acEnv = parseBookingFacilityL(raw.l);
  bookingState.chargeWithAc = acEnv.ac ? true : false;
  var gk = null;
  try {
    gk = typeof raw.k === "string" ? JSON.parse(raw.k) : raw.k || null;
  } catch (e) {
    gk = null;
  }
  if (gk && gk.a != null) {
    var adultTotal = parseInt(gk.a, 10) || 0;
    bookingState.male = adultTotal;
    bookingState.female = 0;
    bookingState.adults = adultTotal;
    bookingState.packageId = gk.f || bookingState.packageId;
  }
  // Children restore sequentially from the saved age list (k.e). Each age
  // decides paid/free (paid when older than childAgeFreeMax); paid children
  // take their per-night rate from the saved facility charges (l, {a:8}
  // entries) in order, falling back to k.g then the configured paid-child
  // charge. Free children restore at 0 (or their k.g value when present).
  bookingState.children = [];
  if (gk && Array.isArray(gk.e)) {
    var cfgCh = window[my1uzr.worknOnPg]?.clientConfig?.HT_CFG || {};
    var freeMaxCh = cfgCh.childAgeFreeMax != null ? Number(cfgCh.childAgeFreeMax) : 8;
    var parsedLch = parseBookingFacilityL(raw.l);
    var childCharges = [];
    for (var ccx = 0; ccx < parsedLch.main.length; ccx++) {
      if (Number(parsedLch.main[ccx].a) === 8)
        childCharges.push(parseFloat(parsedLch.main[ccx].b) || 0);
    }
    var paidPos = -1;
    for (var cgi = 0; cgi < gk.e.length; cgi++) {
      var age = parseInt(gk.e[cgi]) || 0;
      var isPaid = age > Number(freeMaxCh);
      var rate = Array.isArray(gk.g) ? parseFloat(gk.g[cgi]) || 0 : 0;
      if (isPaid) {
        paidPos++;
        if (childCharges.length) {
          // Reuse the last entry when fewer charges than paid children
          // (a single {a:8} entry is saved when every paid child shares the
          // default rate).
          rate = childCharges[Math.min(paidPos, childCharges.length - 1)] || 0;
        } else if (!rate) {
          rate = parseFloat(cfgCh.paidChildCharge) || 0;
        }
      }
      bookingState.children.push({ n: "", ag: age, c: rate });
    }
  }
  if (raw.f && typeof raw.f === "string" && raw.f.indexOf(" ") > 0) {
    bookingState.bookingDate = raw.f.split(" ")[0];
  }
  bookingState.checkinTime = timePartOfDtt(raw.i);
  bookingState.checkoutTime = timePartOfDtt(raw.j);
  bookingState.discountAmt = parseFloat(raw.n) || 0;
  bookingState.specialRequests = raw.q ? String(raw.q) : "";
  applySavedExtrasToState(raw);
}

window.editBookingRecord = async function (record) {
  if (!record || !record.a) return;
  var room = getRoomById(record.j);
  if (bookingEntryMode()) {
    var raw = null;
    try {
      var raws = await dbDexieManager.getAllRecords(dbnm, "rb");
      for (var ri = 0; ri < raws.length; ri++) {
        if (String(raws[ri].a) === String(record.a)) {
          raw = raws[ri];
          break;
        }
      }
    } catch (e) {
      raw = null;
    }
    // Payload-shape rows (e = room id, g = check-in date, k = guest JSON)
    // carry the full saved set; display-shape rows fall back to g/h only.
    var payloadShape =
      !!raw &&
      String(raw.e) !== "" &&
      String(raw.e) !== undefined &&
      !/^\d{4}-\d{2}-\d{2}/.test(String(raw.e));
    initBookingState(
      room,
      raw && payloadShape ? raw.g : record.e,
      raw && payloadShape ? raw.h : record.f,
    );
    bookingState.editBookingId = record.a;
    bookingState.guestName = record.g || "";
    bookingState.guestCId = record.oc || (raw && raw.o) || 0;
    if (record.h) {
      var hp = String(record.h).split(".");
      if (hp.length === 2) {
        bookingState.countryCode = hp[0];
        bookingState.mobile = hp[1] || "";
      } else {
        bookingState.mobile = String(record.h);
      }
    }
    if (raw && payloadShape) {
      restoreSavedBookingIntoState(raw);
      // Restore receipts for this booking: prefer table r (td == booking id,
      // carries real a ids); fall back to the booking payload p.r array.
      var savedRecs = await loadBookingReceipts(record.a);
      if (savedRecs.length) {
        bookingState.payments = savedRecs;
      } else if (raw.r != null) {
        var rArr = Array.isArray(raw.r)
          ? raw.r
          : (function () {
            try {
              var tmp = JSON.parse(raw.r);
              return Array.isArray(tmp) ? tmp : [];
            } catch (e) {
              return [];
            }
          })();
        bookingState.payments = rArr
          .filter(function (pm) {
            return pm && (parseFloat(pm.j) > 0 || pm.i || pm.l);
          })
          .map(function (pm) {
            return {
              j: parseFloat(pm.j) || 0,
              i: pm.i != null ? String(pm.i) : "",
              td: (pm.l && pm.l.td != null ? String(pm.l.td) : "") || "",
            };
          });
      }
    }
    beBookedDatesCache = {};
    showBookingEntryView();
    // Enrich the already-rendered guest section from the c-table record
    // (match rb.o == c.a). commonFnToRunAfter_op_ViewCall sets name/mobile/
    // address/ID docs on the be* fields and reveals the guest section.
    if (bookingState.guestCId && String(bookingState.guestCId) !== "0") {
      try {
        var cRows = (await dbDexieManager.getAllRecords(dbnm, "c")) || [];
        for (var ci = 0; ci < cRows.length; ci++) {
          if (String(cRows[ci].a) === String(bookingState.guestCId)) {
            commonFnToRunAfter_op_ViewCall(cRows[ci], 1);
            break;
          }
        }
      } catch (e) { console.warn("Guest detail lookup failed:", e); }
    }
  } else {
    openBookingModal(room, record.e, record.f);
    bookingState.editBookingId = record.a;
    bookingState.guestName = record.g || "";
    bookingState.guestCId = record.oc || 0;
    // Wizard path: restore children/extras/times from the saved raw row (k/l)
    // so the wizard re-opens with the full booking data.
    var rawW = null;
    try {
      var rawsW = await dbDexieManager.getAllRecords(dbnm, "rb");
      for (var riW = 0; riW < rawsW.length; riW++) {
        if (String(rawsW[riW].a) === String(record.a)) {
          rawW = rawsW[riW];
          break;
        }
      }
    } catch (e) {
      rawW = null;
    }
    if (rawW && String(rawW.e) !== "" && String(rawW.e) !== undefined) {
      restoreSavedBookingIntoState(rawW);
    }
    // Restore the booking's saved receipts (table r, td filtered) so the
    // Summary payment block and Update Payments button stay in sync.
    bookingState.payments = await loadBookingReceipts(record.a);
    // Auto-populate guest details from c table (rb.o == c.a) so the wizard's
    // guest step re-opens with the saved guest values.
    if (bookingState.guestCId && String(bookingState.guestCId) !== "0") {
      try {
        var cRowsW = (await dbDexieManager.getAllRecords(dbnm, "c")) || [];
        for (var ci = 0; ci < cRowsW.length; ci++) {
          if (String(cRowsW[ci].a) === String(bookingState.guestCId)) {
            var gRecW = cRowsW[ci];
            if (gRecW.h) bookingState.guestName = gRecW.h;
            if (gRecW.e) {
              var hpW = String(gRecW.e).split(".");
              if (hpW.length === 2) {
                bookingState.countryCode = hpW[0];
                bookingState.mobile = hpW[1];
              }
            }
            if (gRecW.m) bookingState.address = gRecW.m;
            break;
          }
        }
      } catch (e) { console.warn("Guest detail lookup failed:", e); }
    }
    beBookedDatesCache = {};
  }
};
console.log("📅 booking.js loaded");

// ════════════════════════════════════════════════════════════════════
//  BOOKING ENTRY VIEW (full-page, 31 fields) — shown when changeToView = "1"
//  Design differs from the wizard: one screen, grouped sections.
//  Same colour format; responsive row/col grid; be* input ids.
// ════════════════════════════════════════════════════════════════════
var BE_STYLES = `
.be-sec{
  margin:0 16px 16px;
  background:var(--surface);
  border:2px solid var(--sec-border,#EFE4CC);
  border-radius:var(--radius-lg);
  box-shadow:var(--shadow-sm);
  transition:box-shadow var(--transition-base);
}
.be-sec:hover{box-shadow:var(--shadow-md);}
.be-sec-head{
  display:flex;align-items:center;flex-wrap:wrap;gap:10px;
  padding:12px 16px;
  background:var(--sec-grad,linear-gradient(135deg,#A13A26,#6E1F12));
  border-bottom:3px solid var(--sec-c,#8A2A1B);
  border-radius:var(--radius-lg) var(--radius-lg) 0 0;
}
.be-sec-title{
  display:flex;align-items:center;gap:10px;flex:1;
  color:var(--sec-ink,#FFF9EC);
  font-weight:800;font-size:15px;letter-spacing:.3px;
}
.be-sec-title i{
  width:32px;height:32px;border-radius:8px;flex:0 0 auto;
  background:rgba(255,255,255,.16);
  color:var(--sec-ink,#FFF9EC);
  display:flex;align-items:center;justify-content:center;font-size:14px;
}
.be-sec-head .be-head-btn{
  margin-left:auto;
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:7px 14px;border-radius:8px;
  background:rgba(255,255,255,.14);
  border:1px solid rgba(255,255,255,.35);
  color:var(--sec-ink,#FFF9EC);
  font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;
  transition:background var(--transition-fast);
}
.be-sec-head .be-head-btn:hover{background:rgba(255,255,255,.26);}
.be-sec-body{padding:16px;}
.be-sec-guest{--sec-c:#8A2A1B;--sec-border:rgba(138,42,27,.4);--sec-grad:linear-gradient(135deg,#A13A26,#6E1F12);--sec-ink:#FFF9EC;}
.be-sec-stay{--sec-c:#C9A45C;--sec-border:rgba(201,164,92,.55);--sec-grad:linear-gradient(135deg,#E0C489,#A8863F);--sec-ink:#57160C;}
.be-sec-room{--sec-c:#A8863F;--sec-border:rgba(168,134,63,.5);--sec-grad:linear-gradient(135deg,#C9A45C,#8A6D2F);--sec-ink:#FFF9EC;}
.be-sec-guests{--sec-c:#A13A26;--sec-border:rgba(161,58,38,.4);--sec-grad:linear-gradient(135deg,#B0452E,#7E2418);--sec-ink:#FFF9EC;}
.be-sec-extras{--sec-c:#6B4A2E;--sec-border:rgba(107,74,46,.4);--sec-grad:linear-gradient(135deg,#8A6A48,#4E3420);--sec-ink:#FFF9EC;}
.be-sec-billing{--sec-c:#57160C;--sec-border:rgba(87,22,12,.4);--sec-grad:linear-gradient(135deg,#8A2A1B,#3E1007);--sec-ink:#FFF9EC;}
.be-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;margin:0 16px 24px;}
.be-actions .btn-premium{min-width:150px;}
.be-cc-row{display:flex;gap:8px;}
.be-cc-row .form-select-premium{max-width:110px;flex:0 0 auto;}
#beChildRows .ht-child-row{margin-top:8px;}
.be-readonly{background:#F6F8FA;}
.be-total-read{background:#F6F8FA;color:var(--emr-bright);font-weight:700;}
.be-extra-combo{position:relative;}
.be-extra-combo .form-control-premium{padding-right:44px;}
.be-extra-combo .form-control-premium.has-value{color:var(--emr-dark);font-weight:600;}
.be-extra-combo .ht-combo-btn{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:32px;height:32px;border:none;background:var(--gold-bg);color:var(--gold-dark);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;}
.be-extra-combo .ht-combo-btn:hover{background:var(--gold);}
.be-extra-combo .ht-type-list{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:60;background:var(--surface);border:2px solid var(--gray-bg);border-radius:var(--radius-md);box-shadow:0 8px 24px rgba(0,0,0,.14);max-height:260px;overflow:auto;padding:6px;display:flex;flex-direction:column;gap:2px;}
.be-extra-combo .ht-type-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:9px 10px;border:none;border-radius:8px;background:transparent;color:var(--ink);font-family:var(--font-family);font-size:13px;cursor:pointer;}
.be-extra-combo .ht-type-item:hover{background:var(--gold-bg);}
.be-extra-combo .ht-type-item.sel{background:var(--gold-bg);color:var(--ember-deep);font-weight:600;}
.be-extra-combo .ht-type-item input{position:absolute;opacity:0;pointer-events:none;}
.be-extra-dd-name{flex:1;}
.be-extra-dd-price{margin-left:auto;font-size:12px;font-weight:700;color:var(--emr-bright);white-space:nowrap;}

/* Room select - grouped & scrollable */
#beRoom{min-height:44px;}
#beRoom optgroup{font-weight:700;color:var(--brown);font-size:12px;text-transform:uppercase;letter-spacing:.5px;}
#beRoom option{padding:8px 4px;font-size:13px;}
#beRoom option:disabled{color:#999;background:#fafafa;font-style:italic;}
#beRoom::-webkit-scrollbar{width:8px;}
#beRoom::-webkit-scrollbar-track{background:var(--gray-bg);border-radius:4px;}
#beRoom::-webkit-scrollbar-thumb{background:var(--gold);border-radius:4px;}
#beRoom::-webkit-scrollbar-thumb:hover{background:var(--gold-dark);}
#beRoom{scrollbar-width:thin;scrollbar-color:var(--gold) var(--gray-bg);}

/* Room select + AC/non-AC toggle side by side */
.be-room-wrap{display:flex;align-items:center;gap:10px;}
.be-room-wrap #beRoom{flex:1;min-width:0;}
.be-ac-check{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;height:44px;padding:0 12px;border:2px solid var(--gray-bg,#E5DCC8);border-radius:10px;font-size:13px;font-weight:700;color:var(--brown,#8A5A2B);cursor:pointer;user-select:none;background:var(--surface,#fff);white-space:nowrap;transition:all var(--transition-fast,.15s);}
.be-ac-check input{width:15px;height:15px;accent-color:var(--emr-bright,#B0452E);cursor:pointer;}
.be-ac-check:hover{border-color:var(--gold,#C9A45C);}
.be-ac-check.on{border-color:var(--emr-bright,#B0452E);background:var(--gold-bg,#F6E9C8);color:var(--ember-deep,#7A1F0D);}

@media (min-width:768px){.be-sec{margin-left:24px;margin-right:24px;}.be-actions{margin-left:24px;margin-right:24px;}}
@media (max-width:575px){.be-actions .btn-premium{width:100%;}.be-sec-head .be-head-btn{width:100%;}}

/* Datetime picker input styling */
.be-time-flash{border-color:var(--gold,#C9A45C) !important;box-shadow:0 0 0 2px var(--gold-bg,#F6E9C8) !important;transition:box-shadow var(--transition-fast,.15s);}

/* Custom calendar - booked dates shown red & disabled, two months side by side, scrollable */
.be-cal-wrap{position:relative;}
.be-cal{position:absolute;z-index:120;top:calc(100% + 4px);left:0;max-width:640px;width:min(640px,90vw);
  background:var(--surface,#fff);border:2px solid var(--gold,#C9A45C);border-radius:12px;
  box-shadow:0 10px 30px rgba(0,0,0,.18);padding:10px;overflow-x:auto;font-family:var(--font-family,inherit);}
.be-cal::-webkit-scrollbar{height:8px;}
.be-cal::-webkit-scrollbar-track{background:var(--gray-bg,#EEE8DA);border-radius:4px;}
.be-cal::-webkit-scrollbar-thumb{background:var(--gold,#C9A45C);border-radius:4px;}
.be-cal::-webkit-scrollbar-thumb:hover{background:var(--gold-dark,#8A6D2F);}
.be-cal-months{display:flex;min-width:max-content;gap:14px;}
.be-cal-month{width:270px;flex:0 0 270px;}
.be-cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.be-cal-title{font-weight:700;font-size:14px;color:var(--ink,#3A2A1A);}
.be-cal-nav{border:none;background:var(--gold-bg,#F6E9C8);color:var(--gold-dark,#8A6D2F);
  width:28px;height:28px;border-radius:8px;cursor:pointer;font-size:14px;line-height:1;
  display:flex;align-items:center;justify-content:center;}
.be-cal-nav:hover{background:var(--gold,#C9A45C);color:#fff;}
.be-cal-dow{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px;}
.be-cal-dow span{text-align:center;font-size:11px;font-weight:700;color:var(--brown,#8A5A2B);text-transform:uppercase;padding:4px 0;}
.be-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}
.be-cal-day{display:flex;align-items:center;justify-content:center;height:34px;border:none;border-radius:8px;
  background:transparent;color:var(--ink,#3A2A1A);font-size:13px;cursor:pointer;font-family:inherit;transition:background var(--transition-fast,.15s);}
.be-cal-day:hover{background:var(--gold-bg,#F6E9C8);}
.be-cal-day.off{color:#c8c0b2;cursor:default;pointer-events:none;}
.be-cal-day.empty{cursor:default;pointer-events:none;}
.be-cal-day.today{outline:2px solid var(--gold,#C9A45C);outline-offset:-2px;}
.be-cal-day.sel{background:var(--emr-bright,#B0452E);color:#fff;font-weight:700;}
.be-cal-day.booked{background:#fdecea;color:#d23f3f;font-weight:700;cursor:not-allowed;text-decoration:line-through;opacity:.9;}
.be-cal-day.booked:hover{background:#fdecea;color:#d23f3f;}
.be-cal-day.in{background:#e4f6e7;color:#1d7a3a;font-weight:600;}
.be-cal-day.in:hover{background:#cdecd3;}
.be-cal-leg{display:flex;gap:12px;margin-top:8px;padding-top:8px;border-top:1px solid var(--gray-bg,#EEE8DA);font-size:11px;color:var(--brown,#8A5A2B);}
.be-cal-leg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px;}
.be-cal-leg .lg-booked{background:#fdecea;border:1px solid #d23f3f;}
.be-cal-leg .lg-in{background:#e4f6e7;border:1px solid #1d7a3a;}
.be-cal-leg .lg-avail{background:var(--gold-bg,#F6E9C8);border:1px solid var(--gold,#C9A45C);}
.be-cal-actions{display:flex;justify-content:flex-end;margin-top:8px;padding-top:8px;border-top:1px solid var(--gray-bg,#EEE8DA);}
.be-cal-ok{border:none;background:#b0452e;color:#fff;font-weight:700;font-size:13px;border-radius:8px;padding:8px 22px;cursor:pointer;}
.be-cal-ok:hover{background:#93331f;}
`;

function beIdOpts() {
  var ids = [
    "Aadhaar Card",
    "Passport",
    "Driving License"
  ];
  var h = '<option value="">Select ID type...</option>';
  for (var i = 0; i < ids.length; i++) {
    h +=
      '<option value="' +
      ids[i] +
      '"' +
      (bookingState.idType === ids[i] ? " selected" : "") +
      ">" +
      ids[i] +
      "</option>";
  }
  return h;
}

function beGuestSection() {
  var ccOpts = ["91", "1", "44", "971", "977"];
  var ccHtml = "";
  for (var i = 0; i < ccOpts.length; i++) {
    ccHtml +=
      '<option value="' +
      ccOpts[i] +
      '"' +
      (bookingState.countryCode === ccOpts[i] ? " selected" : "") +
      ">+" +
      ccOpts[i] +
      "</option>";
  }
  var h =
    '<div class="be-sec be-sec-guest">' +
    '<div class="be-sec-head">' +
    '<div class="be-sec-title"><i class="fas fa-user"></i>Guest Details</div>' +
    //'<button type="button" class="be-head-btn" onclick="beSearchGuest()">' +
    '</div><div class="be-sec-body" id="beGuestBody" style="display:none;"><div class="row g-3">';
  if (!isABHidden("name")) {
    h +=
      '<div class="col-12 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Guest Name <span class="required">*</span></label>' +
      '<input type="text" id="beGuestName" class="form-control-premium" value="' +
      escAttr(bookingState.guestName) +
      '" placeholder="Enter full name" readonly></div>';
  }
  if (!isABHidden("contact")) {
    h +=
      '<div class="col-12 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Mobile Number <span class="required">*</span></label>' +
      '<div class="be-cc-row">' +
      '<select id="beCountryCode" class="form-select-premium" disabled>' +
      ccHtml +
      "</select>" +
      '<input type="tel" id="beMobile" class="form-control-premium" maxlength="10" value="' +
      escAttr(bookingState.mobile) +
      '" placeholder="10 digit mobile" readonly></div></div>';
  }
  h +=
    '<div class="col-12 col-sm-6 col-lg-4">' +
    '<label class="form-label-premium">Address</label>' +
    '<input type="text" id="beAddress" class="form-control-premium" value="' +
    escAttr(bookingState.address) +
    '" placeholder="Guest address"></div>';
  if (!isABHidden("id")) {
    h +=
      '<div class="col-12 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">ID Details</label>' +
      '<div id="beIdInfo"></div></div>';
  }
  h += "</div></div></div>";
  return h;
}

function beRevealGuestBody() {
  var el = document.getElementById("beGuestBody");
  if (el) el.style.display = "";
}

function formatNameMobile(i, h) {
  const name = `${i || ''} ${h || ''}`.trim();
  return name ? name : `${name}`;
}


function commonFnToRunAfter_op_ViewCall(obj, swtch) {
  obj = obj || {};
  if (swtch === 1) {
    // Set values to client
    var nm = document.getElementById("beGuestName");
    if (nm) nm.value = formatNameMobile(obj.a, obj.h);
    var mob = document.getElementById("beMobile");
    var mobParts = obj.e ? String(obj.e).split(".") : [];
    if (mob) mob.value = mobParts.length === 2 ? mobParts[1] : (obj.e || "");
    var ad = document.getElementById("beAddress");
    if (ad) ad.value = obj.m || "";
    // Capture the guest's c-table PK so the booking payload p.o carries it
    // instead of 0.
    bookingState.guestCId = obj.a ? obj.a : 0;
    //doHere
    var c1o = obj.c1 || null;
    if (typeof c1o === "string") {
      try { c1o = JSON.parse(c1o); } catch (e) { c1o = null; }
    }
    var lines = "";
    var have = 0;
    for (var ck in (c1o || {})) {
      if (!c1o.hasOwnProperty(ck)) continue;
      if (c1o[ck] === undefined || c1o[ck] === null) continue;
      var v = c1o[ck];
      if (typeof v !== "string") v = JSON.stringify(v);
      if (!v) continue;
      var lbl = ck === "adhar" ? "Aadhaar Card" :
        ck === "pport" ? "Passport" :
          ck === "drvlc" ? "Driving License" : ck;
      lines +=
        '<div class="be-id-line" style="display:flex;justify-content:space-between;gap:8px;padding:2px 0;">' +
        '<span class="fw-bold" style="color:#8A5A2B;">' + lbl + '</span>' +
        '<span>' + escAttr(v) + '</span></div>';
      have++;
    }
    if (have) {
      var infoBox = document.getElementById("beIdInfo");
      if (infoBox) {
        infoBox.style.cssText = "margin-top:6px;border-left:2px solid var(--gold,#C9A45C);padding-left:8px;";
        infoBox.innerHTML = lines;
      }
    }
    beRevealGuestBody();
  } else if (swtch === 2) {
    // Set values to referrer
  }
}

function beRoomStaySection() {
  var opts = beGetRoomOptions();
  var nights = calcNights(bookingState.checkin, bookingState.checkout) || 1;
  var h =
    '<div class="be-sec be-sec-room">' +
    '<div class="be-sec-head"><div class="be-sec-title"><i class="fas fa-bed"></i>Room &amp; Stay Detail</div></div>' +
    '<div class="be-sec-body"><div class="row g-3">';
  if (!isABHidden("room")) {
    h +=
      '<div class="col-12 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Room <span class="required">*</span></label>' +
      '<div class="be-room-wrap">' +
      '<select id="beRoom" class="form-select-premium fw-bold" onchange="beRoomChanged()">' +
      opts +
      "</select>" +
      '<label class="be-ac-check' +
      (bookingState.chargeWithAc ? " on" : "") +
      '" title="Charge room with AC">' +
      '<input type="checkbox" id="beRoomAc"' +
      (bookingState.chargeWithAc ? " checked" : "") +
      ' onchange="beRoomAcChanged()">AC</label></div></div>';
  }
  h +=
    '<!--div class="col-6 col-sm-6 col-lg-4">' +
    '<label class="form-label-premium">Tariff Per Night (₹)</label>' +
    '<input type="text" id="beRoomTariff" class="form-control-premium fw-bold be-total-read" readonly></div-->' +
    '<div class="col-12 col-sm-6 col-lg-3">' +
    '<label class="form-label-premium">Booking Date &amp; Time</label>' +
    '<input type="text" id="beBookingDate" class="form-control-premium" readonly placeholder="Select date & time..." value="">' +
    "</div>";
  h +=
    '<div class="col-12 col-sm-6 col-lg-5">' +
    '<label class="form-label-premium">Stay Dates (Check-in &#8594; Check-out) <span class="required">*</span></label>' +
    '<div class="be-cal-wrap">' +
    '<input type="text" id="beCheckin" class="form-control-premium fw-bold" readonly placeholder="From &#8594; Till" value="' +
    escAttr(beRangeDisplay(bookingState.checkin, bookingState.checkout)) +
    '" onclick="beOpenCalendar(\'beCheckin\', event)"></div></div>';
  h += '<div class="col-12 col-sm-6 col-lg-4"><div class="row g-3">';
  if (!isABHidden("timein")) {
    h +=
      '<div class="col-6">' +
      '<label class="form-label-premium">Check-in Date &amp; Time</label>' +
      '<input type="text" id="beCheckinTime" class="form-control-premium" readonly placeholder="Select check-in date & time..." value="">' +
      "</div>";
  }
  if (!isABHidden("timeout")) {
    h +=
      '<div class="col-6">' +
      '<label class="form-label-premium">Check-out Date &amp; Time</label>' +
      '<input type="text" id="beCheckoutTime" class="form-control-premium" readonly placeholder="Select check-out date & time..." value="">' +
      "</div>";
  }
  h += "</div></div>";
  h +=
    '<div class="col-12 col-sm-6 col-lg-4">' +
    '<label class="form-label-premium">Total Stay</label>' +
    '<input type="text" id="beTotalStay" class="form-control-premium fw-bold be-readonly" value="' +
    nights +
    " night" +
    '" readonly></div>';
  h +=
    '<div class="col-12 col-sm-6 col-lg-4">' +
    '<label class="form-label-premium">Select guest</label>' +
    '<button type="button" class="be-head-btn" onclick="(async () => { await loadExe2Fn(36, [\'no-loader-element\', 1, \'modalContentForEntInd\', \'commonFnToRunAfter_op_ViewCall\', 1, typeof window[my1uzr.worknOnPg].clientConfig.xtraEiFlds_ei_admin_srchGuest !== \'undefined\' ? window[my1uzr.worknOnPg].clientConfig.xtraEiFlds_ei_admin_srchGuest : null], [1]); })()">' +
    '<i class="fas fa-search me-1"></i> Select Guest</button></div>' +
    '</div>' +
    "</div></div></div>";
  return h;
}

// ---- Custom calendar (booked dates from rb table shown red & disabled) ----
var beBookedDatesCache = {}; // { roomId: { "YYYY-MM-DD": true } } per selected room

function beNormalizeDate(d) {
  if (!d) return null;
  var s = String(d).trim();
  var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return m[1] + "-" + m[2] + "-" + m[3];
}

function beDateStr(dt) {
  var y = dt.getFullYear();
  var mo = ("0" + (dt.getMonth() + 1)).slice(-2);
  var dd = ("0" + dt.getDate()).slice(-2);
  return y + "-" + mo + "-" + dd;
}

function beRangeDisplay(ci, co) {
  if (!ci) return "";
  if (!co || co <= ci) return ci;
  return ci + " \u2192 " + co;
}

async function beLoadBookedDates(roomId) {
  var key =
    roomId != null && String(roomId) !== "" && String(roomId) !== "0"
      ? String(roomId)
      : null;
  var map = {};
  if (key == null) return map;
  try {
    var recs = (await dbDexieManager.getAllRecords(dbnm, "rb")) || [];
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (!r || typeof r !== "object") continue;
      // Two stored layouts: display schema (e = check-in date string, f =
      // check-out date, j = room id) and payload schema (e = room id, g =
      // check-in date, h = check-out date). Disambiguate by whether e parses
      // as a date.
      var g, h, rid;
      if (beNormalizeDate(r.e)) {
        g = r.e;
        h = r.f;
        rid = r.j;
      } else {
        g = r.g;
        h = r.h;
        rid = r.e;
      }
      if (rid == null || rid === "") continue;
      if (String(rid) !== key) continue;
      // While editing, free the booking's own dates so the stay range can be
      // changed; other bookings' dates stay marked booked/disabled.
      if (
        bookingState.editBookingId != null &&
        String(bookingState.editBookingId) !== "0" &&
        r.a != null &&
        String(r.a) === String(bookingState.editBookingId)
      ) {
        continue;
      }
      var gs = beNormalizeDate(g);
      var hs = beNormalizeDate(h);
      if (!gs || !hs || gs >= hs) continue;
      var cur = new Date(gs + "T00:00:00");
      var end = new Date(hs + "T00:00:00");
      while (cur < end) {
        var y = cur.getFullYear();
        var mo = ("0" + (cur.getMonth() + 1)).slice(-2);
        var dd = ("0" + cur.getDate()).slice(-2);
        map[y + "-" + mo + "-" + dd] = true;
        cur.setDate(cur.getDate() + 1);
      }
    }
  } catch (e) {
    console.warn("Failed to load rb booked dates:", e);
  }
  beBookedDatesCache[key] = map;
  return map;
}

window.beOpenCalendar = function (inputId, ev) {
  if (ev && ev.stopPropagation) ev.stopPropagation();
  // Use the input that was actually clicked when available; otherwise prefer
  // the admin form's #beCheckin (inside #htContainer) over the public
  // summary-sheet field that shares the same id.
  var input =
    (ev && ev.currentTarget) ||
    (inputId === "beCheckin"
      ? document.querySelector("#htContainer #beCheckin")
      : null) ||
    document.getElementById(inputId);
  if (!input) return;
  var wrap = input.closest(".be-cal-wrap");
  if (!wrap) return;
  var existing = document.getElementById("beCalPopup");
  if (existing && existing.dataset.beInput === inputId) {
    existing.remove();
    return;
  }
  if (existing) existing.remove();

  // The public summary-sheet field (beCheckinPublic) reuses the admin
  // calendar, but must always show the currently-viewed public room's booked
  // dates — never the shared bookingState.roomId, which the admin modal and
  // the fire-and-forget openRoomBooking() session seed can leave stale or 0.
  var bookRoomId = bookingState.roomId;
  if (inputId === "beCheckinPublic" && typeof getRoom === "function") {
    var pubRoom = getRoom();
    if (pubRoom) {
      bookRoomId =
        pubRoom.a != null
          ? pubRoom.a
          : pubRoom.e != null
            ? pubRoom.e
            : pubRoom.id != null
              ? pubRoom.id
              : bookRoomId;
    }
  }

  var monthDate = bookingState.checkin
    ? new Date(bookingState.checkin + "T00:00:00")
    : new Date();
  var pop = document.createElement("div");
  pop.id = "beCalPopup";
  pop.dataset.beInput = inputId;
  pop.className = "be-cal";
  // Position relative to the viewport so the popup escapes any
  // overflow-clipping ancestor (e.g. the public .ht-sheet summary panel),
  // keeping the OK button visible on both desktop & mobile.
  var rect = input.getBoundingClientRect();
  pop.style.position = "fixed";
  var maxH = Math.max(240, window.innerHeight - rect.bottom - 16);
  pop.style.maxHeight = maxH + "px";
  pop.style.overflowY = "auto";
  pop.style.top = rect.bottom + 4 + "px";
  var popW = Math.min(640, window.innerWidth - 16);
  var left = Math.max(8, Math.min(rect.left, window.innerWidth - popW - 8));
  pop.style.left = left + "px";
  pop.style.right = "auto";
  pop.style.width = popW + "px";
  pop.style.zIndex = "1300";
  wrap.appendChild(pop);
  beRenderCalendar(pop, input, monthDate, {});

  beLoadBookedDates(bookRoomId)
    .then(function (booked) {
      if (document.getElementById("beCalPopup") === pop) {
        beRenderCalendar(pop, input, monthDate, booked);
      }
    })
    .catch(function (e) {
      console.warn("Failed to load booked dates for calendar:", e);
    });
};

function beNightsFree(booked, a, b) {
  if (!a || !b || b <= a) return true;
  var cur = new Date(a + "T00:00:00");
  var end = new Date(b + "T00:00:00");
  while (cur < end) {
    var y = cur.getFullYear();
    var mo = ("0" + (cur.getMonth() + 1)).slice(-2);
    var dd = ("0" + cur.getDate()).slice(-2);
    if (booked[y + "-" + mo + "-" + dd]) return false;
    cur.setDate(cur.getDate() + 1);
  }
  return true;
}

function beRenderMonth(monthDate, input, inputId, booked) {
  var y = monthDate.getFullYear();
  var mo = monthDate.getMonth();
  var first = new Date(y, mo, 1);
  var startDow = first.getDay();
  var daysInMonth = new Date(y, mo + 1, 0).getDate();
  var todayStr = new Date().toISOString().split("T")[0];
  var ci = bookingState.checkin ? beNormalizeDate(bookingState.checkin) : "";
  var co = bookingState.checkout ? beNormalizeDate(bookingState.checkout) : "";
  var monthLabel = first.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  var dow = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  var h =
    '<div class="be-cal-month">' +
    '<div class="be-cal-head">' +
    '<button type="button" class="be-cal-nav" data-be-nav="-1">&#9664;</button>' +
    '<span class="be-cal-title">' +
    monthLabel +
    "</span>" +
    '<button type="button" class="be-cal-nav" data-be-nav="1">&#9654;</button>' +
    "</div>" +
    '<div class="be-cal-dow">' +
    dow
      .map(function (d) {
        return "<span>" + d + "</span>";
      })
      .join("") +
    "</div>" +
    '<div class="be-cal-grid">';

  for (var i = 0; i < startDow; i++) {
    h += '<span class="be-cal-day empty"></span>';
  }
  for (var d = 1; d <= daysInMonth; d++) {
    var ds = y + "-" + ("0" + (mo + 1)).slice(-2) + "-" + ("0" + d).slice(-2);
    var cls = "be-cal-day";
    var past = ds < todayStr;
    // Role-aware blocking: a day is unusable only if clicking it would create a
    // range that overlaps an occupied night. Boundary days of a booked stay stay
    // selectable (check-out day -> next check-in, check-in day -> next check-out).
    var usable = !past;
    if (usable) {
      if (!ci) {
        usable = !booked[ds];
      } else if (co && co > ci) {
        if (ds < ci) usable = beNightsFree(booked, ds, co);
        else if (ds > co) usable = beNightsFree(booked, ci, ds);
        else usable = true;
      } else {
        usable = ds <= ci ? beNightsFree(booked, ds, ci) : beNightsFree(booked, ci, ds);
      }
    }
    if (past) {
      cls += " past";
    } else if (booked[ds]) {
      cls += " booked";
    } else if (ci && co && co > ci && ds > ci && ds < co) {
      cls += " in";
    }
    if (ds === todayStr) cls += " today";
    if ((ci && ds === ci) || (co && ds === co)) cls += " sel";
    h +=
      '<button type="button" class="' +
      cls +
      '"' +
      (past || !usable ? " disabled" : "") +
      ' data-be-day="' +
      ds +
      '">' +
      d +
      "</button>";
  }
  h += "</div></div>";

  return {
    html: h,
    y: y,
    mo: mo,
  };
}

function beRenderCalendar(pop, input, monthDate, booked) {
  if (!pop || !input) return;
  booked = booked || {};
  var inputId = pop.dataset.beInput;
  var firstMonth = beRenderMonth(monthDate, input, inputId, booked);
  var secondMonth = beRenderMonth(
    new Date(firstMonth.y, firstMonth.mo + 1, 1),
    input,
    inputId,
    booked,
  );

  pop.innerHTML =
    '<div class="be-cal-months">' +
    firstMonth.html +
    secondMonth.html +
    "</div>" +
    '<div class="be-cal-leg">' +
    '<span><i class="lg-booked"></i>Booked (disabled)</span>' +
    '<span><i class="lg-in"></i>Selected stay</span>' +
    "</div>" +
    '<div class="be-cal-actions">' +
    '<button type="button" class="be-cal-clear">Clear</button>' +
    '<button type="button" class="be-cal-ok">OK</button>' +
    "</div>";

  var firstY = firstMonth.y;
  var firstMo = firstMonth.mo;

  pop.querySelectorAll("[data-be-nav]").forEach(function (btn) {
    btn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      var delta = parseInt(btn.getAttribute("data-be-nav"), 10);
      beRenderCalendar(
        pop,
        input,
        new Date(firstY, firstMo + delta, 1),
        booked,
      );
    });
  });
  pop.querySelectorAll("[data-be-day]").forEach(function (btn) {
    btn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (btn.disabled) return;
      var clicked = btn.getAttribute("data-be-day");
      var ci = bookingState.checkin
        ? beNormalizeDate(bookingState.checkin)
        : "";
      var co = bookingState.checkout
        ? beNormalizeDate(bookingState.checkout)
        : "";

      if (!ci) {
        // No check-in yet -> start a fresh range with this day as check-in.
        bookingState.checkin = clicked;
        bookingState.checkout = "";
      } else if (co && co > ci) {
        // A full range already exists. Adjust the closer boundary without
        // breaking the range, so re-picking never leaves checkout empty.
        if (clicked < ci) {
          bookingState.checkin = clicked; // keep checkout (still after the new check-in)
        } else if (clicked > co) {
          bookingState.checkout = clicked; // keep check-in
        }
        // Clicks on an existing boundary or inside the range are no-ops.
      } else {
        // check-in set, no check-out -> set check-out (ensure after check-in)
        if (clicked <= ci) {
          bookingState.checkout = ci;
          bookingState.checkin = clicked;
        } else {
          bookingState.checkout = clicked;
        }
        // Keep the popup open after the till date is chosen; the user confirms
        // with the OK button at the bottom.
      }

      input.value = beRangeDisplay(bookingState.checkin, bookingState.checkout);
      beRenderCalendar(pop, input, new Date(firstY, firstMo, 1), booked);
    });
  });

  var okBtn = pop.querySelector(".be-cal-ok");
  if (okBtn) {
    okBtn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      var ci = bookingState && bookingState.checkin;
      var co = bookingState && bookingState.checkout;
      if (!ci || !co || !(co > ci)) {
        return;
      }
      if (pop.parentNode) pop.remove();
      if (typeof beRecalc === "function") beRecalc();
      if (pop.dataset.beInput === "beCheckinPublic") {
        if (typeof checkIn !== "undefined" && typeof checkOut !== "undefined") {
          checkIn = bookingState.checkin;
          checkOut = bookingState.checkout;
        }
        if (typeof syncDateInputs === "function") syncDateInputs();
        if (typeof refreshSummary === "function") refreshSummary();
      }
    });
  }

  var clearBtn = pop.querySelector(".be-cal-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      bookingState.checkin = "";
      bookingState.checkout = "";
      input.value = "";
      beRenderCalendar(pop, input, new Date(firstY, firstMo, 1), booked);
      if (typeof checkIn !== "undefined") {
        checkIn = "";
        checkOut = "";
      }
      if (typeof syncDateInputs === "function") syncDateInputs();
      if (typeof refreshSummary === "function") refreshSummary();
      if (typeof beRecalc === "function") beRecalc();
    });
  }
}

// Close any open calendar on outside click
document.addEventListener("click", function (ev) {
  var pop = document.getElementById("beCalPopup");
  if (!pop) return;
  if (!pop.contains(ev.target)) pop.remove();
});

function beGetRoomOptions() {
  var groups = {};
  for (var i = 0; i < adminRoomRecords.length; i++) {
    var r = adminRoomRecords[i];
    var typeLabel = htRoomTypeLabel(r.i) || "Other";
    if (!groups[typeLabel]) groups[typeLabel] = [];
    groups[typeLabel].push(r);
  }
  var typeOrder = ["Deluxe-A", "Deluxe-B", "Family Room", "Executive Suite"];
  var opts = '<option value="" disabled selected>Select Room</option>';
  for (var t = 0; t < typeOrder.length; t++) {
    var type = typeOrder[t];
    var rooms = groups[type];
    if (!rooms || !rooms.length) continue;
    opts += '<optgroup label="' + escHtml(type) + '">';
    for (var j = 0; j < rooms.length; j++) {
      var r = rooms[j];
      var num = r.e != null ? r.e : '';
      var num2 = r.a != null ? r.a : '';
      var sel = bookingState.editBookingId && String(num2) === String(bookingState.roomId);
      var available = getRoomAvailability(
        r,
        bookingState.checkin,
        bookingState.checkout,
        bookingState.editBookingId || null,
      );
      opts +=
        '<option value="' +
        escAttr(num2) +
        '"' +
        (sel ? " selected" : "") +
        (!available && !sel ? " disabled" : "") +
        ">" +
        "#" + num + " " +
        escHtml(htRoomName(r)) +
        " @ \u20B9" +
        fmtAmt(htRoomRate(r)) +
        "/night" +
        (!available ? " (Not available)" : "") +
        "</option>";
    }
    opts += "</optgroup>";
  }
  for (var type in groups) {
    if (typeOrder.indexOf(type) === -1) {
      var rooms = groups[type];
      opts += '<optgroup label="' + escHtml(type) + '">';
      for (var j = 0; j < rooms.length; j++) {
        var r = rooms[j];
        var num = r.e != null ? r.e : '';
        var num2 = r.a != null ? r.a : '';
        var sel = bookingState.editBookingId && String(num2) === String(bookingState.roomId);
        var available = getRoomAvailability(
          r,
          bookingState.checkin,
          bookingState.checkout,
          bookingState.editBookingId || null,
        );
        opts +=
          '<option value="' +
          escAttr(num2) +
          '"' +
          (sel ? " selected" : "") +
          (!available && !sel ? " disabled" : "") +
          ">" +
          "#" + num + ": " +
          escHtml(htRoomName(r)) +
          " @ \u20B9" +
          fmtAmt(htRoomRate(r)) +
          "/night" +
          (!available ? " (Not available)" : "") +
          "</option>";
      }
      opts += "</optgroup>";
    }
  }
  return opts || '<option value="">No rooms available</option>';
}

function beGuestsSection() {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var maxCh = cfg.maxChildren != null ? cfg.maxChildren : 5;
  var childOpts = "";
  for (var i = 0; i <= maxCh; i++) {
    var lbl = i === 0 ? "No children" : i === 1 ? "1 child" : i + " children";
    childOpts +=
      '<option value="' +
      i +
      '"' +
      (i === bookingState.children.length ? " selected" : "") +
      ">" +
      lbl +
      "</option>";
  }
  var h =
    '<div class="be-sec be-sec-guests">' +
    '<div class="be-sec-head"><div class="be-sec-title"><i class="fas fa-users"></i>Guests</div></div>' +
    '<div class="be-sec-body"><div class="row g-3">';
  if (!isABHidden("ad")) {
    h +=
      '<div class="col-4 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Total Guests</label>' +
      '<input type="text" id="beTotalGuests" class="form-control-premium fw-bold be-readonly" readonly></div>' +
      '<div class="col-4 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Male</label>' +
      '<input type="text" id="beMale" min="0" max="9" class="form-control-premium" value="' +
      bookingState.male +
      '" oninput="beRecalc()"></div>' +
      '<div class="col-4 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Female</label>' +
      '<input type="text" id="beFemale" min="0" max="9" class="form-control-premium" value="' +
      bookingState.female +
      '" oninput="beRecalc()"></div>';
  }
  if (!isABHidden("ch")) {
    h +=
      '<div class="col-12 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Children (0-17)</label>' +
      '<select id="beChildCount" class="form-select-premium" onchange="beSetChildCount()">' +
      childOpts +
      "</select></div>" +
      '<div class="col-12"><div id="beChildRows"></div></div>';
  }
  h += "</div></div></div>";
  return h;
}

function beExtrasSection() {
  var h =
    '<div class="be-sec be-sec-extras">' +
    '<div class="be-sec-head"><div class="be-sec-title"><i class="fas fa-list-alt"></i>Extras &amp; Charges</div></div>' +
    '<div class="be-sec-body"><div class="row g-3">';
  if (!isABHidden("extra")) {
    h +=
      '<div class="col-12 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Extra Particular</label>' +
      beExtraOptions() +
      '<div class="form-hint">Check an extra and set its ₹ amount; the charges total updates automatically.</div>' +
      "</div>" +
      '<div class="col-12 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Extra Charges (₹)</label>' +
      '<input type="number" id="beExtraCharges" min="0" step="1" class="form-control-premium" value="' +
      (bookingState.extraCharges || "") +
      '" oninput="beRecalc()"></div>';
  }
  h += "</div></div></div>";
  return h;
}

function beBillingSection() {
  var h =
    '<div class="be-sec be-sec-billing">' +
    '<div class="be-sec-head"><div class="be-sec-title"><i class="fas fa-money-bill-wave"></i>Billing Summary</div></div>' +
    '<div class="be-sec-body"><div class="row g-3">';
  if (!isABHidden("gst")) {
    h +=
      '<div class="col-4 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Total (₹)</label>' +
      '<input type="text" id="beTotal" class="form-control-premium fw-bold be-readonly" readonly></div>' +
      '<div class="col-4 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">GST (' +
      htGST +
      "%)</label>" +
      '<input type="text" id="beGST" class="form-control-premium fw-bold be-readonly" readonly></div>' +
      '<div class="col-4 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Total Payable (₹)</label>' +
      '<input type="text" id="bePayable" class="form-control-premium fw-bold be-total-read" readonly></div>';
  }
  // Discount & Special Requests (always shown if not hidden)
  if (!isABHidden("discount")) {
    h +=
      '<div class="col-4 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Discount (%)</label>' +
      '<input type="text" id="beDiscountPercent" min="0" max="100" step="0.1" class="form-control-premium" value="' +
      (bookingState.discountPercent || "") +
      '" oninput="beUpdateDiscountFromPercent(this)">' +
      "</div>" +
      '<div class="col-4 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Discount Amt (₹)</label>' +
      '<input type="text" id="beDiscountAmt" min="0" step="0.01" class="form-control-premium" value="' +
      (bookingState.discountAmt || "") +
      '" oninput="beUpdateDiscountFromAmt(this)">' +
      "</div>" +
      '<div class="col-4 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Total After Discount (₹)</label>' +
      '<input type="text" id="beTotalAfterDiscount" class="form-control-premium fw-bold be-readonly" readonly></div>';
  }
  if (!isABHidden("special")) {
    h +=
      '<div class="col-12">' +
      '<label class="form-label-premium">Special Requests</label>' +
      '<textarea id="beSpecialRequests" rows="2" class="form-control-premium" placeholder="Any special requests...">' +
      escAttr(bookingState.specialRequests || "") +
      "</textarea></div>";
  }
  if (!isABHidden("adv")) {
    h +=
      '<div class="col-12">' +
      '<button type="button" class="btn-premium btn-premium-secondary btn-premium-sm mt-1" onclick="openRcptPmtModal()">' +
      '<i class="fas fa-receipt me-1"></i> Receipt / Payment</button>' +
      '<div id="bePaymentRows" class="mt-1">' +
      payRowsHTML(bookingState.payments) +
      "</div>" +
      paymentUpdateBtnHTML() +
      "</div>";
  }
  h +=
    '<div class="col-12 col-sm-6 col-lg-4">' +
    '<label class="form-label-premium">Balance Due (₹)</label>' +
    '<input type="text" id="beBalanceDue" class="form-control-premium fw-bold be-total-read" readonly></div>';
  if (!isABHidden("paystatus")) {
    var st = ["Pending", "Partial", "Paid"];
    var stOpts = '<option value="">Select status...</option>';
    for (var s = 0; s < st.length; s++) {
      stOpts +=
        '<option value="' +
        st[s] +
        '"' +
        (bookingState.payStatus === st[s] ? " selected" : "") +
        ">" +
        st[s] +
        "</option>";
    }
    h +=
      '<div class="col-4 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Payment Status</label>' +
      '<select id="bePayStatus" class="form-select-premium">' +
      stOpts +
      "</select></div>";
  }
  h += "</div></div></div>";
  return h;
}

function beActionBar() {
  var editing = !!bookingState.editBookingId;
  return (
    '<div class="be-actions">' +
    '<button type="button" class="btn-premium btn-premium-secondary" onclick="beSearchGuest()">' +
    '<i class="fas fa-search me-1"></i> Search</button>' +
    '<button type="button" class="btn-premium btn-premium-secondary" onclick="beClear()">' +
    '<i class="fas fa-eraser me-1"></i> Clear Form</button>' +
    '<button type="button" id="beSaveBtn" class="btn-premium btn-premium-primary" onclick="beSave()">' +
    '<i class="fas fa-check-circle me-1"></i> ' +
    (editing ? "Update Entry" : "Save Entry") +
    "</button></div>"
  );
}

function showBookingEntryView() {
  setView("bookingEntry");
  var container = document.getElementById("htContainer");
  if (!container) return;
  var allBeCI = document.querySelectorAll("#beCheckin");
  for (var i = 0; i < allBeCI.length; i++) {
    var orph = allBeCI[i];
    if (orph && !container.contains(orph)) {
      var host = orph.closest(".be-date-host");
      if (host) host.remove();
      else orph.remove();
    }
  }
  var editing = !!bookingState.editBookingId;
  container.innerHTML =
    "<style>" +
    BE_STYLES +
    "</style>" +
    '<div class="ht-section-title">' +
    '<div class="bar"></div>' +
    "<h5>" +
    (editing ? "Edit Booking" : "Booking Entry") +
    "</h5>" +
    '<span class="sub">' +
    (editing
      ? "Modify the booking details below"
      : "Fill the details below and save the booking") +
    "</span>" +
    "</div>" +
    beRoomStaySection() +
    beGuestSection() +
    beGuestsSection() +
    beExtrasSection() +
    beBillingSection() +
    beActionBar();
  beRenderChildRows();
  beAutoFillExtras();
  beRecalc();
  beInitBookingPickers();
}

// Initialize Tempus Dominus datetime pickers for the Booking Entry view
// (beBookingDate, beCheckinTime, beCheckoutTime). Values are "YYYY-MM-DD HH:mm".
function beInitBookingPickers() {
  if (typeof window.initDateTimePicker !== "function") return;
  var now = new Date().toTimeString().slice(0, 5);

  (async function () {
    await window.initDateTimePicker("beBookingDate", {
      initialValue: bookingState.bookingDate
        ? bookingState.bookingDate + " " + now
        : "",
      autoNow: false,
    });
    await window.initDateTimePicker("beCheckinTime", {
      initialValue: bookingState.checkinTime
        ? (bookingState.checkin || "") + " " + bookingState.checkinTime
        : "",
      autoNow: false,
    });
    await window.initDateTimePicker("beCheckoutTime", {
      initialValue: bookingState.checkoutTime
        ? (bookingState.checkout || "") + " " + bookingState.checkoutTime
        : "",
      autoNow: false,
    });
    beRecalc();
  })();
}

function beAutoFillExtras() {
  var wrap = document.getElementById("beExtraList");
  var charges = document.getElementById("beExtraCharges");
  if (!wrap || !charges) return;
  if (wrap.querySelectorAll('input[type="checkbox"]:checked').length === 0) {
    return;
  }
  if (!(parseFloat(charges.value) > 0)) {
    charges.value = htReadExtraCharges("beExtraList");
  }
  beRefreshExtraCharges();
}

function beReadChildren() {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var maxAge = cfg.childAgeMax != null ? cfg.childAgeMax : 17;
  var rows = document.querySelectorAll("#beChildRows .ht-child-row");
  var children = [];
  for (var i = 0; i < rows.length; i++) {
    var age = parseInt(rows[i].querySelector(".beChildAge")?.value);
    var rateInput = rows[i].querySelector(".beChildRate");
    var rate = rateInput ? parseFloat(rateInput.value) || 0 : 0;
    var nm = "";
    if (!isNaN(age) && age >= 0 && age <= maxAge)
      children.push({ n: nm, ag: age, c: rate });
  }
  return children;
}

window.beSetChildCount = function () {
  var count = parseInt(document.getElementById("beChildCount")?.value) || 0;
  while (bookingState.children.length < count) {
    bookingState.children.push({
      n: "",
      ag: "",
      c: parseFloat(
        window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.paidChildCharge,
      ) || 0,
    });
  }
  bookingState.children.length = count;
  beRenderChildRows();
  beRecalc();
};

function beRenderChildRows() {
  var wrap = document.getElementById("beChildRows");
  if (!wrap) return;
  var count = bookingState.children.length;
  if (count === 0) {
    wrap.innerHTML = '<div class="text-sm text-gray">No children.</div>';
    return;
  }
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var maxAge = cfg.childAgeMax != null ? cfg.childAgeMax : 17;
  var freeMax = cfg.childAgeFreeMax != null ? cfg.childAgeFreeMax : 8;
  var defaultAge = cfg.defaultChildAge != null ? cfg.defaultChildAge : 5;
  var h = "";
  for (var i = 0; i < count; i++) {
    var c = bookingState.children[i];
    var age = (c.ag !== "" && c.ag !== undefined) ? c.ag : defaultAge;
    var isPaid = parseInt(age) > freeMax;
    var rate =
      c.c != null
        ? c.c
        : parseFloat(cfg.paidChildCharge) || 0;
    h +=
      '<div class="ht-child-row">' +
      '<span class="badge-premium badge-premium-emr">Child ' +
      (i + 1) +
      "</span>" +
      '<input type="number" class="form-control-premium beChildAge" min="0" max="' + maxAge + '" value="' +
      age +
      '" style="max-width:120px;" oninput="beChildAgeChanged(this,' + i + ')">' +
      (isPaid
        ? beChildRateZoneHTML(i, rate)
        : '<span class="beChildRateZone"><span class="badge-premium badge-premium-emr" style="font-size:11px;">free</span></span>') +
      "</div>";
  }
  wrap.innerHTML = h;
}

function beChildRateZoneHTML(idx, rate) {
  return (
    '<span class="beChildRateZone">' +
    '<span class="badge-premium badge-premium-gold" style="font-size:11px;">paid</span>' +
    '<label class="form-label-premium mb-0 text-sm">₹/night</label>' +
    '<input type="number" class="form-control-premium beChildRate" min="0" step="1" value="' +
    (rate || 0) +
    '" style="max-width:90px;" oninput="beChildRateChanged(this,' +
    idx +
    ')">' +
    "</span>"
  );
}

function beChildRateChanged(input, idx) {
  var c = bookingState.children[idx];
  if (!c) return;
  c.c = parseFloat(input.value) || 0;
  beRecalc();
}

function beChildAgeChanged(input, idx) {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var freeMax = cfg.childAgeFreeMax != null ? cfg.childAgeFreeMax : 8;
  var age = parseInt(input.value) || 0;
  var prevAge = parseInt(bookingState.children[idx].ag) || 0;
  var wasPaid = prevAge > freeMax;
  bookingState.children[idx].ag = age;
  var isPaid = age > freeMax;
  var row = input.closest(".ht-child-row");
  var zone = row && row.querySelector(".beChildRateZone");
  if (isPaid && !wasPaid) {
    // Child crossed into the paid band: default the per-night rate.
    if (bookingState.children[idx].c == null) {
      bookingState.children[idx].c = parseFloat(cfg.paidChildCharge) || 0;
    }
    if (zone) zone.outerHTML = beChildRateZoneHTML(idx, bookingState.children[idx].c);
  } else if (!isPaid && wasPaid) {
    if (zone)
      zone.outerHTML =
        '<span class="beChildRateZone"><span class="badge-premium badge-premium-emr" style="font-size:11px;">free</span></span>';
  }
  beRecalc();
}

window.beRoomChanged = function () {
  bookingState.roomId = document.getElementById("beRoom")?.value || 0;
  bookingState.checkin = "";
  bookingState.checkout = "";
  beRecalc();
  beRefreshOpenCalendar();
};

window.beRoomAcChanged = function () {
  bookingState.chargeWithAc =
    document.getElementById("beRoomAc")?.checked || false;
  beRecalc();
};

function adminRoomNightRate(room, dateStr) {
  if (!room) return 0;
  var base = parseInt(htRoomRate(room)) || 0;
  var day = new Date(dateStr + "T00:00:00").getDay();
  var h = room.h || {};
  var wr = h.j && typeof h.j === "object" ? h.j : {};
  var dayCfg = wr["" + day];
  if (!bookingState.chargeWithAc) {
    if (dayCfg && dayCfg.a != null && Number(dayCfg.a) > 0) return Number(dayCfg.a);
    return base;
  }
  if (dayCfg && dayCfg.b != null && Number(dayCfg.b) > 0) return Number(dayCfg.b);
  var ac = h.i && h.i.b != null ? Number(h.i.b) : 0;
  return ac > 0 ? ac : base;
}

function adminRoomRates(room, nights) {
  var rates = [];
  if (!room || nights <= 0 || !bookingState.checkin) return rates;
  var start = new Date(bookingState.checkin + "T00:00:00");
  for (var i = 0; i < nights; i++) {
    var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    var mm = d.getMonth() + 1;
    var dd = d.getDate();
    rates.push(
      adminRoomNightRate(
        room,
        d.getFullYear() + "-" + (mm < 10 ? "0" : "") + mm + "-" + (dd < 10 ? "0" : "") + dd,
      ),
    );
  }
  return rates;
}

function beRefreshOpenCalendar() {
  var pop = document.getElementById("beCalPopup");
  if (!pop) return;
  var input =
    document.querySelector("#htContainer #beCheckin") ||
    document.getElementById("beCheckin");
  if (!input) return;
  var monthDate = bookingState.checkin
    ? new Date(bookingState.checkin + "T00:00:00")
    : new Date();
  beLoadBookedDates(bookingState.roomId).then(function (booked) {
    if (document.getElementById("beCalPopup") === pop) {
      beRenderCalendar(pop, input, monthDate, booked);
    }
  });
}

// Live totals: nights, total guests, room read-only fields, GST + payable,
// and balance due (auto) as the advance changes.
// Live totals: nights, total guests, room read-only fields, GST + payable,
// and balance due (auto) as the advance changes.
function beRecalc() {
  // Sync Tempus Dominus datetime picker values into bookingState. The picker
  // inputs hold "YYYY-MM-DD HH:mm"; the calendar remains the source of truth
  // for the stay check-in/out dates, so only the bookers' date and the two
  // times are extracted here.
  var bkVal = document.getElementById("beBookingDate")?.value || "";
  if (bkVal) {
    var bkParts = bkVal.split(" ");
    if (bkParts[0]) bookingState.bookingDate = bkParts[0];
  }
  var ciVal = document.getElementById("beCheckinTime")?.value || "";
  if (ciVal) {
    var ciParts = ciVal.split(" ");
    if (ciParts.length === 2) bookingState.checkinTime = ciParts[1];
  }
  var coVal = document.getElementById("beCheckoutTime")?.value || "";
  if (coVal) {
    var coParts = coVal.split(" ");
    if (coParts.length === 2) bookingState.checkoutTime = coParts[1];
  }

  // checkin/checkout are maintained by the range-selector calendar; keep them.
  var beCI =
    document.querySelector("#htContainer #beCheckin") ||
    document.getElementById("beCheckin");
  if (beCI)
    beCI.value = beRangeDisplay(bookingState.checkin, bookingState.checkout);

  // Re-render room dropdown when dates change to reflect availability
  var roomSelect = document.getElementById("beRoom");
  if (roomSelect) {
    var currentRoomId = roomSelect.value;
    roomSelect.innerHTML = beGetRoomOptions();
    // Restore selection if still available, otherwise clear
    var newOpts = roomSelect.options;
    var found = false;
    for (var i = 0; i < newOpts.length; i++) {
      if (newOpts[i].value === currentRoomId && !newOpts[i].disabled) {
        roomSelect.value = currentRoomId;
        bookingState.roomId = currentRoomId;
        found = true;
        break;
      }
    }
    if (!found && newOpts.length > 0) {
      roomSelect.selectedIndex = 0;
      bookingState.roomId = 0;
    }
  }

  var beAcEl = document.getElementById("beRoomAc");
  if (beAcEl) bookingState.chargeWithAc = beAcEl.checked;

  var room = getRoomById(bookingState.roomId);
  var nights = calcNights(bookingState.checkin, bookingState.checkout);
  var male = parseInt(document.getElementById("beMale")?.value) || 0;
  var female = parseInt(document.getElementById("beFemale")?.value) || 0;
  bookingState.male = male;
  bookingState.female = female;
  bookingState.adults = male + female;
  var children = beReadChildren();

  if (!nights) {
    // Stay dates are incomplete/invalid (e.g. checkout missing or range inverted).
    // Leave the existing night/total fields untouched instead of wiping them to
    // 0, so partial re-picking of Stay Dates never blanks the amounts.
    var ts0 = document.getElementById("beTotalStay");
    if (ts0) ts0.value = "0 night";
    var tg0 = document.getElementById("beTotalGuests");
    if (tg0) tg0.value = male + female + children.length;
    return;
  }

  var ts = document.getElementById("beTotalStay");
  if (ts) ts.value = nights + " night" + (nights === 1 ? "" : "s");
  var tg = document.getElementById("beTotalGuests");
  if (tg) tg.value = male + female + children.length;

  var rn = document.getElementById("beRoomNumber");
  var rt = document.getElementById("beRoomType");
  var rs = document.getElementById("beRoomStatus");
  var rf = document.getElementById("beRoomTariff");
  if (room) {
    if (rn) rn.value = room.e != null ? room.e : room.a;
    if (rt) rt.value = htRoomTypeLabel(room.i);
    if (rs) rs.value = htRoomStatusLabel(room.d != null ? room.d : room.k);
    if (rf) rf.value = parseInt(htRoomRate(room)) || 0;
  } else {
    [rn, rt, rs, rf].forEach(function (el) {
      if (el) el.value = "";
    });
  }

  var cfgRecalc = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var freeMax = cfgRecalc.childAgeFreeMax != null ? cfgRecalc.childAgeFreeMax : 8;
  var childAges = [];
  var childRates = [];
  for (var i = 0; i < children.length; i++) {
    childAges.push(parseInt(children[i].ag) || 0);
    childRates.push(
      children[i].ag != null && parseInt(children[i].ag) > freeMax
        ? parseFloat(children[i].c) || 0
        : 0,
    );
  }
  var beList = document.getElementById("beExtraList");
  var ecInput = document.getElementById("beExtraCharges");
  var extraCharges = 0;
  if (
    beList &&
    beList.querySelectorAll('input[type="checkbox"]:checked').length > 0
  ) {
    extraCharges = htReadExtraCharges("beExtraList");
    if (ecInput) ecInput.value = extraCharges;
  } else {
    extraCharges = parseFloat(ecInput?.value) || 0;
  }
  var bePkg = getPackageById(bookingState.packageId);
  var calc = calcTotal({
    nights: nights,
    roomRates: room ? adminRoomRates(room, nights) : [],
    childAges: childAges,
    childRates: childRates,
    childRate: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.paidChildCharge || 0,
    childAgeFreeMax: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.childAgeFreeMax ?? 8,
    adults: male + female,
    includedAdults: 2,
    extraGuestRate: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.extraAdultsCharge || 0,
    packageAdj: bePkg ? bePkg.g : 0,
    addons: [],
    extraCharges: extraCharges,
  });
  lastCalcTotal = calc.total;

  var t = document.getElementById("beTotal");
  if (t) t.value = fmtAmt(calc.subtotal);
  var g = document.getElementById("beGST");
  if (g) g.value = fmtAmt(calc.tax);
  var p = document.getElementById("bePayable");
  if (p) p.value = fmtAmt(calc.total);

  // Apply discount to payable total
  var discAmt = bookingState.discountAmt || 0;
  var totalAfterDiscount = Math.round(Math.max(0, calc.total - discAmt));
  var pad = document.getElementById("beTotalAfterDiscount");
  if (pad) pad.value = totalAfterDiscount;
  var pctEl = document.getElementById("beDiscountPercent");
  if (pctEl) pctEl.value = bookingState.discountPercent || 0;
  var amtEl = document.getElementById("beDiscountAmt");
  if (amtEl) amtEl.value = discAmt;
  var b = document.getElementById("beBalanceDue");
  if (b) b.value = Math.round(totalAfterDiscount - bePaymentsSum());
}
window.beRecalc = beRecalc;

window.beSearchGuest = async function () {
  if (await beEnsureGuestPicker()) {
    open_entind_crud(
      null,
      null,
      "htGuestCrud",
      "selectBookingGuestEntry",
      null,
    );
  } else {
    showMessageModal("Info", "Guest selector not available.", false);
  }
};

window.selectBookingGuestEntry = function (record) {
  if (!record) return;
  var nm = document.getElementById("beGuestName");
  if (nm && (record.h || record.i)) nm.value = record.h || record.i;
  if (record.e) {
    var parts = String(record.e).split(".");
    if (parts.length === 2) {
      var cc = document.getElementById("beCountryCode");
      var mob = document.getElementById("beMobile");
      if (cc) cc.value = parts[0];
      if (mob) mob.value = parts[1];
    }
  }
  var ad = document.getElementById("beAddress");
  if (ad && record.m) ad.value = record.m;
  if (record.a) {
    bookingState.guestCId = record.a;
  }
  beRevealGuestBody();
};

// Push the DOM back into bookingState so saveBooking() can reuse the wizard's
// e→z payload map (package defaults to 1, no add-ons in this view).
function syncBookingEntryToState() {
  bookingState.guestName = (
    document.getElementById("beGuestName")?.value || ""
  ).trim();
  bookingState.countryCode =
    document.getElementById("beCountryCode")?.value || "91";
  bookingState.mobile = (
    document.getElementById("beMobile")?.value || ""
  ).trim();
  bookingState.address = (
    document.getElementById("beAddress")?.value || ""
  ).trim();
  bookingState.email = "";
  bookingState.idType = document.getElementById("beIdType")?.value || "";
  bookingState.idNumber = "";
  var bkDtVal = document.getElementById("beBookingDate")?.value || "";
  bookingState.bookingDate = bkDtVal
    ? bkDtVal.split(" ")[0]
    : new Date().toISOString().split("T")[0];
  // checkin/checkout are maintained by the range-selector calendar.
  var ciDtVal = document.getElementById("beCheckinTime")?.value || "";
  bookingState.checkinTime = ciDtVal ? ciDtVal.split(" ")[1] || "" : "";
  var coDtVal = document.getElementById("beCheckoutTime")?.value || "";
  bookingState.checkoutTime = coDtVal ? coDtVal.split(" ")[1] || "" : "";
  bookingState.roomId = document.getElementById("beRoom")?.value || 0;
  bookingState.male = parseInt(document.getElementById("beMale")?.value) || 0;
  bookingState.female =
    parseInt(document.getElementById("beFemale")?.value) || 0;
  bookingState.adults = bookingState.male + bookingState.female;
  bookingState.children = beReadChildren();
  bookingState.packageId = 1;
  bookingState.addonIds = [];
  bookingState.extraItems = htReadExtraItems("beExtraList");
  bookingState.extraParticular = htReadExtraParticular("beExtraList");
  bookingState.extraCharges =
    bookingState.extraItems.length > 0
      ? htReadExtraCharges("beExtraList")
      : (function () {
        var ec = parseFloat(document.getElementById("beExtraCharges")?.value) || 0;
        return ec < 0 ? 0 : ec;
      })();
  // payments come from the Receipt/Payment modal (window.fnAfterRcptPmt);
  // bookingState.payments is already set, keep as-is.
  bookingState.payStatus = document.getElementById("bePayStatus")?.value || "";
  bookingState.discountPercent =
    parseFloat(document.getElementById("beDiscountPercent")?.value) || 0;
  bookingState.discountAmt =
    parseFloat(document.getElementById("beDiscountAmt")?.value) || 0;
  bookingState.specialRequests = (
    document.getElementById("beSpecialRequests")?.value || ""
  ).trim();
}

function beValidate() {
  var ci = "";
  if (!isABHidden("name")) {
    var name = (document.getElementById("beGuestName")?.value || "").trim();
    if (!name) {
      showMessageModal("Info", "Please enter the guest name!", false);
      return false;
    }
  }
  if (!isABHidden("contact")) {
    var mob = (document.getElementById("beMobile")?.value || "").trim();
    if (!/^\d{10}$/.test(mob)) {
      showMessageModal(
        "Info",
        "Please enter a valid 10-digit mobile number!",
        false,
      );
      return false;
    }
  }
  ci = bookingState.checkin || "";
  if (!ci) {
    showMessageModal("Info", "Please select a check-in date!", false);
    return false;
  }
  var co = bookingState.checkout || "";
  if (!co) {
    showMessageModal("Info", "Please select a check-out date!", false);
    return false;
  }
  if (co <= ci) {
    showMessageModal("Info", "Check-out must be after check-in date!", false);
    return false;
  }
  var male = parseInt(document.getElementById("beMale")?.value) || 0;
  var female = parseInt(document.getElementById("beFemale")?.value) || 0;
  var total = male + female;
  if (!isABHidden("ad") && (total < 1 || total > 9)) {
    showMessageModal(
      "Info",
      "Total guests (male + female) must be between 1 and 9!",
      false,
    );
    return false;
  }
  if (!isABHidden("room")) {
    var room = getRoomById(document.getElementById("beRoom")?.value);
    if (!room) {
      showMessageModal("Info", "Please select a room!", false);
      return false;
    }
    // var occ = htRoomOccupancy(room);
    // if (total > (occ.adults || 99)) {
    //   showMessageModal(
    //     "Info",
    //     "Capacity exceeded: this room allows max " + occ.adults + " adults!",
    //     false,
    //   );
    //   return false;
    // }
    //var children = beReadChildren();
    // if (children.length > (occ.children || 99)) {
    //   showMessageModal(
    //     "Info",
    //     "Capacity exceeded: this room allows max " +
    //       occ.children +
    //       " children!",
    //     false,
    //   );
    //   return false;
    // }
    if (
      !getRoomAvailability(
        room,
        bookingState.checkin,
        bookingState.checkout,
        bookingState.editBookingId || null,
      )
    ) {
      console.log(
        "[beValidate] roomId",
        room.a != null ? room.a : room.e,
        "checkin",
        bookingState.checkin,
        "checkout",
        bookingState.checkout,
        "editId",
        bookingState.editBookingId,
      );
      showMessageModal(
        "Info",
        "This room is not available for the selected dates! Change the dates or pick another room.",
        false,
      );
      return false;
    }
  }
  var adv = bePaymentsSum();
  if (adv < 0) {
    showMessageModal("Info", "Advance payment cannot be negative!", false);
    return false;
  }
  // Validate discount
  if (!isABHidden("discount")) {
    var discAmt =
      parseFloat(document.getElementById("beDiscountAmt")?.value) || 0;
    var discPct =
      parseFloat(document.getElementById("beDiscountPercent")?.value) || 0;
    if (discAmt < 0) {
      showMessageModal("Info", "Discount amount cannot be negative!", false);
      return false;
    }
    var totalPayable =
      parseFloat(document.getElementById("bePayable")?.value) || 0;
    if (discAmt > totalPayable) {
      showMessageModal("Info", "Discount cannot exceed total payable!", false);
      return false;
    }
    if (discPct < 0 || discPct > 100) {
      showMessageModal(
        "Info",
        "Discount percent must be between 0 and 100!",
        false,
      );
      return false;
    }
  }
  if (adv > lastCalcTotal) {
    console.error(adv + ">" + lastCalcTotal);
    showMessageModal(
      "Info",
      "Advance payments cannot exceed the total payable!",
      false,
    );
    return false;
  }
  return true;
}

function beSaveLoading(on) {
  var btn = document.getElementById("beSaveBtn");
  if (!btn) return;
  btn.disabled = on;
  btn.innerHTML = on
    ? '<span class="spinner"></span> Saving...'
    : '<i class="fas fa-check-circle me-1"></i> Save Entry';
}

window.beSave = function () {
  if (!beValidate()) return;
  syncBookingEntryToState();
  beSaveLoading(true);
  var op = bookingState.editBookingId ? updateBooking() : saveBooking();
  op.then(function () {
    beSaveLoading(false);
  });
};

window.beClear = function () {
  window.showModal({
    title: "Clear Form",
    message: "Reset all booking entry fields and start over?",
    type: "confirm",
    onConfirm: function () {
      var keep = bookingState.roomId;
      initBookingState(getRoomById(keep), null, null);
      showBookingEntryView();
    },
  });
};