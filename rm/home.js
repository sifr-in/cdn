// home.js - HT Royal Stay Home dashboard (hero, stats, bookings table)
// Home table logic + rendering for the summary bar / search / date filters.

function formatDate(d) {
  if (typeof d !== "string") return "";
  var p = d.split("-");
  if (p.length !== 3) return d;
  return p[2] + "-" + p[1] + "-" + p[0];
}

function formatDateShort(d) {
  if (!d) return "";
  var p = d.split("-");
  if (p.length !== 3) return d;
  return p[2] + "-" + p[1];
}

function formatMobile(m) {
  if (!m) return "";
  var parts = String(m).split(".");
  if (parts.length === 2) return "+" + parts[0] + " " + parts[1];
  return m;
}

function getBookingGuests(bk) {
  if (!bk.i) return { ad: bk.r || 0, ch: [] };
  try {
    var parsed = typeof bk.i === "string" ? JSON.parse(bk.i) : bk.i;
    return {
      ad: parseInt(parsed.ad) || bk.r || 0,
      ch: parsed.ch || [],
    };
  } catch (e) {
    return { ad: bk.r || 0, ch: [] };
  }
}

function bookingChildrenCount(bk, fallbackCh) {
  if (bk.k) {
    try {
      var g =
        typeof bk.k === "string"
          ? JSON.parse(bk.k)
          : bk.k;
      if (g && Array.isArray(g.e)) return g.e.length;
    } catch (e) {}
  }
  return Array.isArray(fallbackCh) ? fallbackCh.length : 0;
}

function getBookingReview(bk) {
  if (!bk.u) return null;
  try {
    var parsed = typeof bk.u === "string" ? JSON.parse(bk.u) : bk.u;
    if (parsed && parsed.r) return parsed;
  } catch (e) {}
  return null;
}

function bookingMatchesSearch(bk, s) {
  var room = getRoomById(bk.j);
  return (
    (bk.g && bk.g.toLowerCase().includes(s)) ||
    (bk.h && bk.h.toLowerCase().includes(s)) ||
    (bk.s && bk.s.toLowerCase().includes(s)) ||
    (room && String(room.e || "").toLowerCase().includes(s)) ||
    String(bk.a).includes(s)
  );
}

function filterBookings() {
  var from = document.getElementById("dateFrom")?.value || "";
  var to = document.getElementById("dateTo")?.value || "";
  var s = (document.getElementById("searchBox")?.value || "")
    .toLowerCase()
    .trim();
  var out = [];
  for (var i = 0; i < bookingRecords.length; i++) {
    var bk = bookingRecords[i];
    if (from && String(bk.e).slice(0, 10) < from) continue;
    if (to && String(bk.e).slice(0, 10) > to) continue;
    if (s && !bookingMatchesSearch(bk, s)) continue;
    out.push(bk);
  }
  out.sort(function (a, b) {
    return (Number(b.a) || 0) - (Number(a.a) || 0);
  });
  return out;
}

function getStatCard(icon, iconClass, value, label) {
  return (
    '<div class="ht-stat-card animate-fade-in-up">' +
    '<div class="stat-ico ' +
    iconClass +
    '"><i class="' +
    icon +
    '"></i></div>' +
    '<div><div class="stat-val">' +
    value +
    '</div><div class="stat-lbl">' +
    label +
    "</div></div>" +
    "</div>"
  );
}

window.htRefreshBookings = async function () {
  var btn = document.getElementById("htRefreshBtn");
  if (btn) { btn.querySelector("i").classList.add("fa-spin"); btn.disabled = true; }
  try {
    clearPayload0();
    payload0.vw = 1;
    payload0.fn = 85;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "rb" },{ tb: "rc" }, { tb: "c" }, { tb: "r" }]);
    var response = await fnj3("https://my1.in/2/l.php", payload0, 1, true, null, 20000, 0, 1, 1);
    if (response && response.su == 1) {
      await handl_rm_rspons(response);
      await adminLoadDataFromDB();
    } else {
      window.showelsemodal(response?.ms || 'Failed to save. Please try again.');
    }
  } catch (e) {
    console.warn("Refresh call failed:", e);
  }
  renderHomeTable();
  if (btn) { btn.querySelector("i").classList.remove("fa-spin"); btn.disabled = false; }
};

window.renderTable = function () {
  if (adminCurrentView === "home" && typeof renderHomeTable === "function") {
    renderHomeTable();
  }
};

window.renderHomeTable = function () {
  var container = document.getElementById("htContainer");
  if (!container) return;

  var today = new Date().toISOString().split("T")[0];
  var from = document.getElementById("dateFrom")?.value || "";
  var to = document.getElementById("dateTo")?.value || "";
  var useRange = !!from && !!to;

  var availToday = 0;
  var checkins = 0;
  var checkouts = 0;
  var inHouse = 0;
  if (useRange) {
    for (var i = 0; i < adminRoomRecords.length; i++) {
      var ar = adminRoomRecords[i];
      if (getRoomAvailability(ar, from, to)) availToday++;
    }
    for (var k = 0; k < bookingRecords.length; k++) {
      var bm = bookingRecords[k];
      if (bm.o === 4) continue;
      var cin = String(bm.e).slice(0, 10);
      var cout = String(bm.f).slice(0, 10);
      if (cin >= from && cin <= to) checkins++;
      if (cout >= from && cout <= to) checkouts++;
      if (cin <= to && cout > from) inHouse++;
    }
  } else {
    for (var i2 = 0; i2 < adminRoomRecords.length; i2++) {
      var ar2 = adminRoomRecords[i2];
      var ast2 = ar2.d != null ? ar2.d : ar2.k;
      if (String(ast2) === "1") availToday++;
    }
    checkins = getArrivalsOnDate(today).length;
    checkouts = getDeparturesOnDate(today).length;
    inHouse = getActiveBookingsOnDate(today).length;
  }

  var appInfo = window[my1uzr.worknOnPg].appInfo || {};

  var todayLabel = today.split("-").reverse().join("-");
  var hero = '';
    // '<div class="ht-hero animate-fade-in-up">' +
    // '<div class="d-flex align-items-center justify-content-between flex-wrap gap-2">' +
    // '<div>' +
    // '<div class="hero-title"><i class="fas fa-chart-line me-2" style="color:var(--gold);"></i>Dashboard</div>' +
    // '<div class="hero-sub">' +
    // '<i class="fas fa-calendar-alt me-1"></i>' +
    // todayLabel +
    // " &nbsp;\u00b7&nbsp; " +
    // escHtml(window.shopName || "HT") +
    // " Royal Stay</div>" +
    // "</div>" +
    // "</div>" +
    // "</div>";

  var stats =
    '<div class="row g-2 g-md-3 px-3 px-md-4 pt-1">' +
    '<div class="col-6 col-md-3">' +
    getStatCard("fas fa-bed", "emr", availToday, "Rooms Available") +
    "</div>" +
    '<div class="col-6 col-md-3">' +
    getStatCard("fas fa-sign-in-alt", "green", checkins, "Check-ins") +
    "</div>" +
    '<div class="col-6 col-md-3">' +
    getStatCard("fas fa-sign-out-alt", "gold", checkouts, "Check-outs") +
    "</div>" +
    '<div class="col-6 col-md-3">' +
    getStatCard("fas fa-users", "red", inHouse, "In-stay Guests") +
    "</div>" +
    "</div>";

  var list = filterBookings();
  var bdg = document.getElementById("totalBadge");
  if (bdg) bdg.textContent = list.length;

  var tableHtml = "";
  if (list.length === 0) {
    tableHtml =
      '<div class="ht-empty">' +
      '<i class="fas fa-calendar-day"></i>' +
      "<b>No bookings found</b>" +
      '<p>Bookings in the selected date range will appear here.</p>' +
      '<button class="btn-premium btn-premium-primary btn-premium-sm mt-2" onclick="homeNewBooking()">' +
      '<i class="fas fa-plus me-1"></i> New Booking</button>' +
      "</div>";
  } else {
    var buildHomeRow = function (bk, j) {
      var room = getRoomById(bk.j);
      var guests = getBookingGuests(bk);
      var review = getBookingReview(bk);
      var chCount = bookingChildrenCount(bk, guests.ch);
      var totalAmt = fmtAmt(Number(bk.n) || 0);
      var rcvdAmt = fmtAmt(bk.received || 0);
      var remAmt = Math.round(Math.max(0, totalAmt - rcvdAmt));
      var settledRow = totalAmt > 0 && remAmt === 0;
      var actions =
        '<td><div class="d-flex justify-content-center gap-1">' +
        '<button class="btn btn-sm" title="Print Bill" style="color:var(--gold-dark);border:1px solid var(--gold-dark);padding:2px 8px;font-size:12px;cursor:pointer;" ' +
        "onclick='printBillFromDashboard(" +
        (bk.a != null ? Number(bk.a) : 0) +
        ")'><i class=\"fas fa-print\"></i></button>" +
        '<button class="btn btn-sm" title="Edit Booking" style="color:#2563eb;border:1px solid #2563eb;padding:2px 8px;font-size:12px;cursor:pointer;" ' +
        "onclick='editBookingFromDashboard(" +
        JSON.stringify(bk).replace(/'/g, "&#39;") +
        ")'><i class=\"fas fa-pen\"></i></button>" +
        '<button class="btn btn-sm" title="Delete Booking" style="color:var(--emr);border:1px solid var(--emr);padding:2px 8px;font-size:12px;cursor:pointer;" ' +
        "onclick='deleteBookingFromDashboard(" +
        JSON.stringify(bk).replace(/'/g, "&#39;") +
        ")'><i class=\"fas fa-times\"></i></button>" +
        (bk.o == 3 && !review
          ? '<button class="btn btn-sm" title="Rate Stay" style="color:var(--emr);border:1px solid var(--emr);padding:2px 8px;font-size:12px;cursor:pointer;" ' +
            "onclick='openReviewModal(" +
            JSON.stringify(bk).replace(/'/g, "&#39;") +
            ")'>⭐</button>"
          : "") +
        "</div></td>";

      return (
        '<tr class="animate-fade-in" style="animation-delay:' +
        j * 30 +
        'ms;' +
        (settledRow ? "background:#e5f7e8;" : "") +
        '">' +
        '<td class="fw-bold text-emr">' +
        (bk.a != null ? bk.a : "") +
        "</td>" +
        '<td class="text-start fw-semibold text-emr-dark truncate" style="max-width:160px;">' +
        escHtml(bk.g || "-") +
        "</td>" +
        '<td class="text-gray">' +
        escHtml(formatMobile(bk.h)) +
        "</td>" +
        '<td class="text-start text-gray-dark truncate" style="max-width:130px;">' +
        escHtml(
          room
            ? (room.e != null && room.e !== "" ? "#" + room.e + ": " : "") +
                htRoomName(room)
            : bk.s || "-",
        ) +
        "</td>" +
        '<td class="fw-semibold" style="color:#c0392b;">' +
        escHtml(formatDate(bk.e)) +
        "</td>" +
        '<td class="fw-semibold text-emr-bright">' +
        escHtml(formatDate(bk.f)) +
        "</td>" +
        '<td class="fw-semibold text-gray-dark">' +
        (bk.m || calcNights(bk.e, bk.f)) +
        "</td>" +
        '<td class="text-gray-dark text-start">' +
        escHtml(guests.ad || 0) +
        " / " +
        escHtml(chCount || 0) +
        "</td>" +
        '<td class="text-nowrap">' +
        (settledRow
          ? '<span class="fw-bold" style="color:#1e7e34;">₹' +
            totalAmt +
            " paid</span>"
          : '<span class="fw-bold text-emr-dark">₹' +
            totalAmt +
            '</span><span class="text-gray" style="font-size:11px;"> − ₹' +
            rcvdAmt +
            " = </span>" +
            '<span class="fw-bold" style="color:var(--emr-dark);">₹' +
            remAmt +
            "</span>") +
        "</td>" +
        actions +
        "</tr>"
      );
    };
    var rows = "";
    for (var j = 0; j < list.length; j++) {
      var bk = list[j];
      var rowHtml;
      try {
        rowHtml = buildHomeRow(bk, j);
      } catch (err) {
        rowHtml =
          '<tr class="animate-fade-in" style="animation-delay:' +
          j * 30 +
          'ms;">' +
          '<td class="fw-bold text-emr">' +
          (bk && bk.a != null ? String(bk.a) : "") +
          "</td>" +
          '<td colspan="9" class="text-start text-danger"><i class="fas fa-exclamation-triangle"></i> data error: ' +
          escHtml(String(err && err.message ? err.message : err)) +
          "</td></tr>";
      }
      rows += rowHtml;
    }
    tableHtml =
      '<div class="table-container-premium animate-fade-in-up">' +
      '<div class="table-scroll-premium">' +
      '<table class="table-premium table table-bordered table-sm mb-0">' +
      "<thead><tr>" +
      "<th>SR</th><th class=\"text-start\">Guest</th><th>Mobile</th><th class=\"text-start\">Room Details</th><th>Check-in</th><th>Check-out</th><th>Nights</th><th class=\"text-start\">Guests</th><th>Amount</th><th>Actions</th>" +
      "</tr></thead><tbody>" +
      rows +
      "</tbody></table></div></div>";
  }

  container.innerHTML =
    hero +
    stats +
    '<div class="ht-section-title">' +
    '<div class="bar"></div>' +
    "<h5>Recent Bookings</h5>" +
    '<span class="sub">Stay records for the selected range</span>' +
    '<button id="htRefreshBtn" title="Refresh Bookings" onclick="htRefreshBookings()" ' +
    'style="margin-left:auto;background:var(--emr-dark);border:1px solid var(--gold);color:var(--gold);border-radius:50%;width:32px;height:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;">' +
    '<i class="fas fa-sync-alt"></i></button>' +
    "</div>" +
    tableHtml;
};

window.homeNewBooking = async function () {
  // Force a fresh session: openRoomBooking()'s late seed must re-initialise an
  // empty state even when a previous entry already picked stay dates, otherwise
  // the seedAdminBooking guard would keep the stale form.
  if (typeof openRoomBooking === "function") {
    bookingState = null;
    await openRoomBooking();
  } else {
    await loadExe2Fn(45, [], [1]);
    if (typeof openRoomBooking === "function") {
      bookingState = null;
      await openRoomBooking();
    }
  }
  // openRoomBooking only seeds bookingState; actually open the booking form.
  if (typeof bookingEntryMode === "function" && bookingEntryMode()) {
    if (typeof showBookingEntryView === "function") showBookingEntryView();
  } else if (typeof openBookingModal === "function") {
    openBookingModal();
  }
};

window.editBookingFromDashboard = function (record) {
  if (typeof editBookingRecord === "function") {
    editBookingRecord(record);
    return;
  }
  loadExe2Fn(46, [], [1]).then(function () {
    if (typeof editBookingRecord === "function") editBookingRecord(record);
  });
};

window.deleteBookingFromDashboard = function (record) {
  if (typeof deleteBookingRecord === "function") {
    deleteBookingRecord(record);
    return;
  }
  loadExe2Fn(46, [], [1]).then(function () {
    if (typeof deleteBookingRecord === "function") deleteBookingRecord(record);
  });
};

window.printBillFromDashboard = async function (bookingId) {
  var bk = null;
  for (var bi = 0; bi < bookingRecords.length; bi++) {
    if (
      bookingRecords[bi] &&
      String(bookingRecords[bi].a) === String(bookingId)
    ) {
      bk = bookingRecords[bi];
      break;
    }
  }
  if (!bk) {
    showMessageModal("Info", "Booking not found. Refresh and try again.", true);
    return;
  }

  var snap = typeof bookingSnapFromRecord === "function" ? bookingSnapFromRecord(bk) : null;
  if (!snap) {
    showMessageModal("Info", "Could not calculate bill. Try again.", true);
    return;
  }

  var guestDoc = null;
  for (var gi = 0; gi < guestRecords.length; gi++) {
    if (
      guestRecords[gi] &&
      String(guestRecords[gi].a) === String(bk.oc)
    ) {
      guestDoc = guestRecords[gi];
      break;
    }
  }

  snap.guestName = bk.g || (guestDoc ? guestDoc.h || guestDoc.i || "" : "");
  snap.contact = bk.h || (guestDoc ? guestDoc.e || "" : "");
  snap.email = guestDoc && typeof billC1Email === "function" ? billC1Email(guestDoc) : "";
  snap.address = guestDoc && guestDoc.m != null ? String(guestDoc.m) : "";
  snap.roomName = snap.room
    ? (typeof htRoomName === "function" ? htRoomName(snap.room) : snap.room.name)
    : bk.s || "";
  snap.roomRate = snap.room && typeof htRoomRate === "function"
    ? parseInt(htRoomRate(snap.room), 10) || 0
    : 0;
  snap.roomStatus = snap.room && typeof htRoomStatusLabel === "function"
    ? htRoomStatusLabel(snap.room.d != null ? snap.room.d : snap.room.k)
    : "";
  snap.checkinTime = typeof billTimePart === "function" ? billTimePart(bk.actualCheckin, "") : "";
  snap.checkoutTime = typeof billTimePart === "function" ? billTimePart(bk.actualCheckout, "") : "";
  snap.received = bk.received || 0;

  if (typeof buildBillNo === "function") billNo = buildBillNo();
  if (typeof showBill === "function") {
    showBill(snap);
  } else {
    showMessageModal(
      "Info",
      "Bill module not available. Print bill manually.",
      true,
    );
  }
};

window.showDashboard = function () {
  setView("home");
  renderHomeTable();
};

console.log("🏠 home.js loaded");