/* ============================================================
   HT - booking.js (menu)
   ------------------------------------------------------------
   The booking process for the user page:
   - stay search sheet (mobile)
   - date & guest controls
   - package / add-on picks
   - pricing engine (calcBooking)
   - booking summary and the pay preview modal

   Loaded by core/ht.js through loadExe2Fn(20). Shared data uses
   the KS module globals (roomRecords, packageRecords, ...).
   ============================================================ */

/* ---------- Initial dates ---------- */
function initDates() {
  // Intentionally empty — chkIn/chkOut must not auto-set to today/tomorrow.
}

/* ---------- Date & guest controls ---------- */
function setCheckIn(v) {
  checkIn = v;
  if (nightsBetween(v, checkOut) < 1) {
    checkOut = addDays(v, 1);
  }
  syncDateInputs();
  syncBeCheckinFromPublic();
  refreshSummary();
}

function setCheckOut(v) {
  if (nightsBetween(checkIn, v) < 1) {
    v = addDays(checkIn, 1);
  }
  checkOut = v;
  syncDateInputs();
  syncBeCheckinFromPublic();
  refreshSummary();
}

// Push the public navbar dates (checkIn/checkOut) into an open summary-sheet
// beCheckinPublic range input so the two date controls always share one value.
// Only the public sheet's own #beCheckinPublic (inside .be-date-host) is
// touched: the admin booking form (module 46) owns a separate #beCheckin inside
// #htContainer but shares the same bookingState, so an empty/other public
// selection must never blank an already-picked stay range.
function syncBeCheckinFromPublic() {
  var beCI = el("beCheckinPublic");
  if (!beCI || !beCI.closest(".be-date-host")) return;
  if (typeof bookingState === "undefined") return;
  var ci = bookingState.checkin;
  var co = bookingState.checkout;
  if ((!checkIn && ci) || (!checkOut && co)) {
    if (typeof beRangeDisplay === "function") {
      beCI.value = beRangeDisplay(ci, co);
    }
    return;
  }
  bookingState.checkin = checkIn;
  bookingState.checkout = checkOut;
  if (typeof beRangeDisplay === "function") {
    beCI.value = beRangeDisplay(checkIn, checkOut);
  }
}

function syncDateInputs() {
  var a = el("chkIn");
  var b = el("chkOut");
  if (a) a.value = checkIn;
  if (b) b.value = checkOut;
}

function roomGuestLimits() {
  var maxAdults = window[my1uzr.worknOnPg].clientConfig?.HT_CFG.maxAdults;
  var maxChildren = window[my1uzr.worknOnPg].clientConfig?.HT_CFG.maxChildren;
  if (maxAdults < 1) maxAdults = 1;
  return { maxAdults: maxAdults, maxChildren: maxChildren, maxTotal: 0 };
}

function changeAdult(delta) {
  var lim = roomGuestLimits();
  var next = clamp(adults + delta, 1, lim.maxAdults);
  if (lim.maxTotal && next + children > lim.maxTotal) {
    next = lim.maxTotal - children;
  }
  adults = next;
  setCounts();
  refreshSummary();
  if (roomFilterActive && currentView === "home") renderHome();
}

function changeChild(delta) {
  var lim = roomGuestLimits();
  var next = clamp(children + delta, 0, lim.maxChildren);
  if (lim.maxTotal && next + adults > lim.maxTotal) {
    next = lim.maxTotal - adults;
  }
  if (next > children) {
    childAges.push(window[my1uzr.worknOnPg].clientConfig?.HT_CFG.defaultChildAge);
  } else if (next < children) {
    childAges.pop();
  }
  children = next;
  setCounts();
  renderChildStrip();
  refreshSummary();
  if (roomFilterActive && currentView === "home") renderHome();
}

function setChildAge(i, v) {
  childAges[i] = parseInt(v, 10);
  refreshSummary();
}

function toggleChildStrip() {
  childStripOpen = !childStripOpen;
  var strip = document.querySelector("#childStrip .ht-child-strip");
  if (strip) strip.classList.toggle("collapsed", !childStripOpen);
}

function ageOptions(sel) {
  var html = "";
  for (var a = 0; a <= window[my1uzr.worknOnPg].clientConfig?.HT_CFG.childAgeMax; a++) {
    html +=
      '<option value="' +
      a +
      '"' +
      (a === sel ? " selected" : "") +
      ">" +
      a +
      " yrs" +
      (a > window[my1uzr.worknOnPg].clientConfig?.HT_CFG.childAgeFreeMax ? " \u00b7 paid" : " \u00b7 free") +
      "</option>";
  }
  return html;
}

function ageInputsHtml() {
  var html = "";
  for (var i = 0; i < children; i++) {
    var v = childAges[i] === undefined ? window[my1uzr.worknOnPg].clientConfig?.HT_CFG.defaultChildAge : childAges[i];
    html +=
      '<label class="cs-age"><span>Child ' +
      (i + 1) +
      '</span><select onchange="setChildAge(' +
      i +
      ', this.value)">' +
      ageOptions(v) +
      "</select></label>";
  }
  return html;
}

function renderChildStrip() {
  var wrap = el("childStrip");
  if (children === 0) {
    wrap.classList.add("ht-hidden");
    wrap.innerHTML = "";
    return;
  }
  wrap.classList.remove("ht-hidden");
  wrap.innerHTML =
    '<div class="ht-child-strip"><div class="container"><div class="inner">' +
    '<div class="cs-head">' +
    '<i class="fa-solid fa-children"></i> <span>Child Ages</span>' +
    '<span class="cs-note">Ages 8 &amp; under stay free</span>' +
    '<button class="cs-toggle" onclick="toggleChildStrip()" aria-label="Toggle child ages">' +
    '<i class="fa-solid fa-chevron-up"></i></button>' +
    "</div>" +
    '<div class="cs-ages" id="childStripAges">' +
    ageInputsHtml() +
    "</div>" +
    "</div></div></div>";
  var strip = wrap.querySelector(".ht-child-strip");
  if (strip) strip.classList.toggle("collapsed", !childStripOpen);
}

function setCounts() {
  var nodes = document.querySelectorAll("[data-count]");
  nodes.forEach(function (n) {
    n.textContent = window[n.getAttribute("data-count")];
  });
}

function navSearch() {
  roomFilterActive = true;
  if (typeof applyAvailabilityFilterToHome === "function") {
    applyAvailabilityFilterToHome();
    return;
  }
  if (currentView !== "home") showHome();
  else renderHome();
  scrollToRoomList();
}

function clearRoomFilter() {
  roomFilterActive = false;
  renderHome();
}

/* ---------- Date-based room availability filter (public) ---------- */
function publicRoomIsAvailable(r, from, to) {
  if (!r || !from || !to || to <= from) return false;
  var key = String(r.id != null ? r.id : r.no != null ? r.no : "");
  if (typeof bookingRecords === "undefined" || !bookingRecords) return true;
  for (var bi = 0; bi < bookingRecords.length; bi++) {
    var b = bookingRecords[bi];
    if (!b || !b.j) continue;
    if (String(b.j) !== key) continue;
    if (Number(b.o) === 4) continue;
    if (!b.e || !b.f) continue;
    if (b.e < to && from < b.f) return false;
  }
  return true;
}

function scrollToRoomList() {
  var list = document.querySelector(".ht-room-list");
  if (list) list.scrollIntoView({ behavior: "smooth", block: "start" });
}

window.applyAvailabilityFilterToHome = async function () {
  roomAvailFilter = !!(checkIn && checkOut);
  if (!roomAvailFilter) {
    if (currentView === "home") renderHome();
    return;
  }
  if (!window.__pubBookingsLoaded) {
    try {
      await ensurePublicBookingsLoaded();
    } catch (e) {
      console.warn("Availability preload failed:", e);
    }
  }
  if (currentView !== "home") showHome();
  else renderHome();
  scrollToRoomList();
};

window.clearAvailFilter = function () {
  roomFilterActive = false;
  roomAvailFilter = false;
  renderHome();
};

/* ---------- Summary sheet & bottom bar ---------- */
function renderSummarySheet() {
  el("paySheet").innerHTML =
    '<div class="ht-sheet" id="paySheetPanel">' +
    '<div class="sheet-handle"></div>' +
    '<div class="sheet-title">Booking Summary</div>' +
    '<div class="sheet-summary-inner" id="sheetSummary"></div>' +
    "</div>";
}

function relocateSummaryPanel() {
  var panel = el("paySheetPanel");
  if (!panel) return;
  var host = el("summaryHost");
  var pay = el("paySheet");
  if (currentView === "details" && host && window.innerWidth >= 992) {
    if (panel.parentNode !== host) host.appendChild(panel);
  } else if (pay && panel.parentNode !== pay) {
    pay.appendChild(panel);
  }
}

var beSyncTimer = null;

function ensureBeCalStyle() {
  if (document.getElementById("beCalStyle")) return;
  var st = document.createElement("style");
  st.id = "beCalStyle";
  st.textContent =
    ".be-cal-wrap{position:relative;}" +
    ".be-cal{position:absolute;z-index:220;top:calc(100% + 4px);left:0;max-width:640px;width:min(640px,90vw);background:#fff;border:2px solid var(--gray-bg,#EEE8DA);border-radius:12px;box-shadow:0 14px 34px rgba(0,0,0,.22);padding:14px;overflow:auto;max-height:80vh;}" +
    ".be-cal-months{display:flex;gap:14px;min-width:max-content;}" +
    ".be-cal-month{width:270px;flex:0 0 270px;}" +
    ".be-cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}" +
    ".be-cal-title{font-weight:700;font-size:14px;color:#3a2a1a;}" +
    ".be-cal-nav{border:none;background:#f6e9c8;color:#8a6d2f;border-radius:6px;width:26px;height:26px;cursor:pointer;}" +
    ".be-cal-nav:hover{background:#c9a45c;color:#fff;}" +
    ".be-cal-dow{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px;}" +
    ".be-cal-dow span{text-align:center;font-size:11px;font-weight:700;color:#8a5a2b;text-transform:uppercase;padding:4px 0;}" +
    ".be-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}" +
    ".be-cal-day{display:flex;align-items:center;justify-content:center;height:34px;border:none;border-radius:8px;background:transparent;color:#3a2a1a;cursor:pointer;font-size:13px;}" +
    ".be-cal-day:hover{background:#f6e9c8;}" +
    ".be-cal-day.off,.be-cal-day.empty{cursor:default;pointer-events:none;color:#c8c0b2;}" +
    ".be-cal-day.today{outline:2px solid var(--gold,#c9a45c);outline-offset:-2px;}" +
    ".be-cal-day.sel{background:#b0452e;color:#fff;font-weight:700;}" +
    ".be-cal-day.booked{background:#fdecea;color:#d23f3f;font-weight:700;cursor:not-allowed;text-decoration:line-through;opacity:.9;}" +
    ".be-cal-day.past{background:#f4f2ec;color:#c8c0b2;cursor:not-allowed;text-decoration:line-through;opacity:.75;}" +
    ".be-cal-day.in{background:#e4f6e7;color:#1d7a3a;font-weight:600;}" +
    ".be-cal-leg{display:flex;gap:12px;margin-top:8px;padding-top:8px;border-top:1px solid #eee8da;font-size:11px;color:#8a5a2b;}" +
    ".be-cal-leg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px;}" +
    ".be-cal-leg .lg-booked{background:#fdecea;border:1px solid #d23f3f;}" +
    ".be-cal-leg .lg-in{background:#e4f6e7;border:1px solid #1d7a3a;}" +
    ".be-cal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:8px;padding-top:8px;border-top:1px solid #eee8da;}" +
    ".be-cal-ok{border:none;background:#b0452e;color:#fff;font-weight:700;font-size:13px;border-radius:8px;padding:8px 22px;cursor:pointer;}" +
    ".be-cal-ok:hover{background:#93331f;}" +
    ".be-cal-clear{border:1px solid #c8c0b2;background:#fff;color:#6b5d4d;font-weight:600;font-size:13px;border-radius:8px;padding:8px 18px;cursor:pointer;}" +
    ".be-cal-clear:hover{background:#f6f1e8;}";
  document.head.appendChild(st);
}

function startBeSyncTimer() {
  if (beSyncTimer) return;
  beSyncTimer = setInterval(function () {
    // Only the public summary-sheet field. The admin form's #beCheckin lives
    // inside #htContainer and must not spin this sync or leak its dates.
    if (!document.querySelector(".be-date-host #beCheckinPublic")) {
      clearInterval(beSyncTimer);
      beSyncTimer = null;
      return;
    }
    var ci = bookingState && bookingState.checkin;
    var co = bookingState && bookingState.checkout;
    if (
      ci &&
      co &&
      co > ci &&
      (!checkIn || !checkOut || ci !== checkIn || co !== checkOut) &&
      !document.getElementById("beCalPopup") &&
      !document.querySelector("#htContainer #beCheckin")
    ) {
      clearInterval(beSyncTimer);
      beSyncTimer = null;
      checkIn = ci;
      checkOut = co;
      if (typeof syncDateInputs === "function") syncDateInputs();
      if (typeof refreshSummary === "function") refreshSummary();
    }
  }, 300);
}

async function ensureBeCheckinField() {
  if (
    typeof beOpenCalendar !== "function" ||
    typeof initBookingState !== "function"
  ) {
    try {
      await loadExe2Fn(46);
    } catch (e) {
      console.error("Failed to load booking calendar:", e);
    }
  }
  if (typeof getRoomById !== "function" || typeof calcNights !== "function") {
    try {
      await loadExe2Fn(42);
    } catch (e) {
      console.error("Failed to load availability:", e);
    }
  }
  if (typeof beOpenCalendar !== "function") return false;

  var curRoom = getRoom();
  if (typeof initBookingState === "function") {
    // Do not reseed shared bookingState if the admin booking form already has
    // a picked stay range; the public sheet should follow it, not wipe it.
    if (!(bookingState && bookingState.checkin && bookingState.checkout)) {
      initBookingState(null, checkIn, checkOut);
    }
    bookingState.roomId = curRoom
      ? curRoom.a != null
        ? curRoom.a
        : curRoom.e != null
          ? curRoom.e
          : curRoom.id
      : 0;
  }

  ensureBeCalStyle();

  if (!document.querySelector(".be-date-host #beCheckinPublic")) {
    var wrap = document.createElement("div");
    wrap.className = "be-cal-wrap";
    wrap.style.cssText = "position:relative;margin:12px 0;";
    var input = document.createElement("input");
    input.type = "text";
    input.id = "beCheckinPublic";
    input.className = "form-control form-control-lg fw-bold";
    input.readOnly = true;
    input.placeholder = "From \u2192 Till";
    input.value = beRangeDisplay(bookingState.checkin, bookingState.checkout);
    input.addEventListener("click", function (ev) {
      beOpenCalendar("beCheckinPublic", ev);
    });
    wrap.appendChild(input);

    var sheetPanel = el("paySheetPanel");
    var hostDiv = document.createElement("div");
    hostDiv.className = "be-date-host";
    hostDiv.innerHTML =
      '<div style="font-size:13px;font-weight:700;color:#e8dfc8;margin-bottom:6px;">' +
      '<i class="fa-solid fa-calendar-days me-1"></i> Stay Dates</div>';
    hostDiv.appendChild(wrap);
    if (sheetPanel) {
      var old = sheetPanel.querySelector(".be-date-host");
      if (old) old.remove();
      sheetPanel.insertBefore(hostDiv, sheetPanel.firstChild);
    } else {
      el("paySheet").appendChild(hostDiv);
    }
  } else {
    var inp = document.querySelector(".be-date-host #beCheckinPublic");
    if (inp && typeof beRangeDisplay === "function") {
      inp.value = beRangeDisplay(bookingState.checkin, bookingState.checkout);
    }
  }

  startBeSyncTimer();
  return true;
}

function renderBottomBar() {
  el("bottomBar").innerHTML =
    '<div class="ht-bottom-bar">' +
    '<div class="t">Total for <span id="bNights">0</span> nights</div>' +
    '<div class="tt" id="bTotal">--</div>' +
    '<button class="ht-btn ht-btn-gold" onclick="openSummarySheet()">' +
    '<i class="fa-solid fa-arrow-up"></i> View &amp; Pay</button>' +
    "</div>";
}

async function openSummarySheet() {
  // Ensure the public bookingRecords (bookings) are loaded from the local DB so
  // we can detect whether the currently selected room is already booked for the
  // chosen dates. ht.js's adminLoadDataFromDB() only does this on admin flows,
  // so we load lazily here for the public details page.
  if (!window.__pubBookingsLoaded) {
    await ensurePublicBookingsLoaded();
  }

  var curRoom = getRoom();
  var roomKey = curRoom ? String(curRoom.id || curRoom.no || "") : "";
  var from = checkIn;
  var to = checkOut;

  // Clash detection (mirrors availability.getOverlapCount): the room already
  // has an active (non-cancelled) booking overlapping [from, to).
  var clash = false;
  if (roomKey && from && to) {
    for (var i = 0; i < bookingRecords.length; i++) {
      var bk = bookingRecords[i];
      if (String(bk.j) !== roomKey) continue;
      if (Number(bk.o) === 4) continue;
      if (!bk.e || !bk.f) continue;
      if (bk.e < to && from < bk.f) {
        clash = true;
        break;
      }
    }
  }

  // The stay-dates field reuses the admin booking flow's beCheckin/beOpenCalendar
  // date-range picker (module 46). ensureBeCheckinField() loads it as needed,
  // seeds bookingState from the current public selection, builds/updates the
  // #beCheckinPublic field inside the panel, and keeps the bookingState->public
  // flow in sync. Call it here so the field is always present on open.
  var calOk = await ensureBeCheckinField();
  if (!calOk) {
    showMessageModal("Info", "Date calendar unavailable.", false);
    return;
  }

  if (window.innerWidth >= 992 && currentView === "details") {
    var h = el("summaryHost");
    if (h && h.scrollIntoView)
      h.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    el("paySheet").classList.add("open");
    el("payOverlay").classList.add("open");
  }

  // Only when the room is already booked for the selected dates does the sheet
  // auto-open the calendar. Otherwise the field is just shown for manual edits.
  if (clash) beOpenCalendar("beCheckinPublic", null);
}

function closeSummarySheet() {
  el("paySheet").classList.remove("open");
  el("payOverlay").classList.remove("open");
}

/* ---------- Package & add-on picks ---------- */
function pickPackage(id) {
  packageId = id;
  var root = el("pkgRoot");
  var r = getRoom();
  if (root && r) root.innerHTML = packagesListHtml(r);
  refreshSummary();
}

function toggleAddon(id) {
  var idx = addonIds.indexOf(id);
  if (idx > -1) {
    addonIds.splice(idx, 1);
  } else {
    addonIds.push(id);
  }
  var root = el("addonsRoot");
  if (root) root.innerHTML = addonsListHtml();
  refreshSummary();
}

/* ---------- Book Now flow ---------- */
function goToPackages(btn) {
  if (btn) btn.classList.add("ht-hidden");
  var t = el("pkgRoot");
  if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Pricing engine ---------- */

// Effective nightly rate for a given stay date, respecting the AC toggle.
// Base (non-AC) = room.pricePerNight. AC-on uses weekend per-day AC rates from
// room.weekRates (JS getDay() key: 0=Sun..6=Sat) when the night falls on a
// configured day, otherwise the room's base AC rate. Falls back to base when
// no AC data is available.
function roomNightRate(room, dateStr, acOverride) {
  var base = Number(room.pricePerNight) || 0;
  var d = new Date(dateStr + "T00:00:00");
  var day = d.getDay();
  var wr = room.weekRates && typeof room.weekRates === "object" ? room.weekRates : {};
  var dayCfg = wr["" + day];
  var useAc = acOverride != null ? !!acOverride : !!chargeWithAc;
  if (!useAc) {
    if (dayCfg && dayCfg.a != null && Number(dayCfg.a) > 0) return Number(dayCfg.a);
    return base;
  }
  if (dayCfg && dayCfg.b != null && Number(dayCfg.b) > 0) return Number(dayCfg.b);
  var ac = Number(room.acRate);
  return ac > 0 ? ac : base;
}

function buildDayRates(room, checkin, nights, acOverride) {
  var dayRates = [];
  var total = 0;
  var d0 = new Date((checkin || todayStr()) + "T00:00:00");
  for (var ni = 0; ni < nights; ni++) {
    var dd = new Date(d0.getTime() + ni * 86400000);
    var y = dd.getFullYear();
    var mo = ("0" + (dd.getMonth() + 1)).slice(-2);
    var dayS = ("0" + dd.getDate()).slice(-2);
    var dateStr = y + "-" + mo + "-" + dayS;
    var nRate = roomNightRate(room, dateStr, acOverride);
    total += nRate;
    dayRates.push({
      date: DAY_NAMES[dd.getDay()] + " " + dd.getDate() + " " + MONTHS[dd.getMonth()],
      rate: nRate
    });
  }
  return { dayRates: dayRates, total: total };
}

function clearPublicStayDates() {
  checkIn = "";
  checkOut = "";
  if (typeof bookingState !== "undefined" && bookingState) {
    bookingState.checkin = "";
    bookingState.checkout = "";
  }
  if (typeof syncDateInputs === "function") syncDateInputs(); // clears #chkIn / #chkOut
  var be = document.querySelector(".be-date-host #beCheckinPublic");
  if (be) be.value = "";
  if (typeof refreshSummary === "function") refreshSummary();
}

function calcBooking(nightsOverride) {
  var room = getRoom();
  if (!room) return null;
  var calcN = nightsBetween(checkIn, checkOut);
  var nights = nightsOverride != null
    ? nightsOverride
    : (isFinite(calcN) && calcN > 0 ? calcN : 1);

  var paidChildren = childAges.filter(function (a) {
    return a > window[my1uzr.worknOnPg].clientConfig?.HT_CFG.childAgeFreeMax;
  }).length;
  var chargeable = adults + paidChildren;
  var totalGuests = adults + children;
  var freeChildren = children - paidChildren;

  var dr = buildDayRates(room, checkIn, nights);
  var full = dr.total;
  var dayRates = dr.dayRates;
  var discountAmt = 0;

  var includedGuests = 2;
  var extraAdults = Math.max(0, adults - includedGuests);
  var extraAdultsRate = window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.extraAdultsCharge || 0;
  var adultFee = extraAdults * extraAdultsRate * nights;
  var childFee = paidChildren * (window[my1uzr.worknOnPg].clientConfig?.HT_CFG.paidChildCharge || 0) * nights;
  var occupancyFee = adultFee + childFee;

  var pkg = null;
  var packageCost = 0;

  var addonList = [];
  var addonCost = 0;
  addonRecords.forEach(function (a) {
    if (a.info) return;
    if (addonIds.indexOf(a.id) > -1) {
      var cost = a.price * (a.type === "perNight" ? nights : 1);
      addonList.push({ addon: a, cost: cost });
      addonCost += cost;
    }
  });

  var gst = hotel.gst != null ? hotel.gst : 0;
  // All listed prices are GST-exclusive: the subtotal below is the taxable
  // base. GST is charged on top, so the grand total is subtotal + tax.
  var subtotal = full - discountAmt + occupancyFee + packageCost + addonCost;
  var tax = gst > 0 ? Math.round((subtotal * gst) / 100) : 0;
  var grandTotal = Math.round(subtotal + tax);

  return {
    room: room,
    nights: nights,
    checkin: checkIn,
    checkout: checkOut,
    gst: gst,
    adults: adults,
    children: children,
    paidChildren: paidChildren,
    freeChildren: freeChildren,
    chargeable: chargeable,
    totalGuests: totalGuests,
    includedGuests: includedGuests,
    extraAdults: extraAdults,
    extraAdultsRate: extraAdultsRate,
    adultFee: adultFee,
    childFee: childFee,
    childRate: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.paidChildCharge || 0,
    roomCostFull: full,
    roomRateIncl: roomNightRate(room, checkIn || todayStr()),
    discountAmt: discountAmt,
    discountPercent: 0,
    occupancyFee: occupancyFee,
    mattressCharge: 0,
    dayRates: dayRates,
    package: pkg,
    packageCost: packageCost,
    addonList: addonList,
    addonCost: addonCost,
    subtotal: subtotal,
    tax: tax,
    grandTotal: grandTotal,
  };
}

/* ---------- Booking summary ---------- */
function refreshSummary() {
  if (currentView !== "details") return;
  var snap = calcBooking();
  if (!snap) return;
  lastSnap = snap;
  var html = summaryHtml(snap);
  var ss = el("sheetSummary");
  if (ss) ss.innerHTML = html;
  var bn = el("bNights");
  if (bn) bn.textContent = snap.nights;
  var bt = el("bTotal");
  if (bt) {
    var one = calcBooking(1);
    bt.textContent = one ? fmtMoney(one.grandTotal) : "--";
  }
}

function toggleChargeAc() {
  chargeWithAc = document.getElementById("sAcToggle")
    ? document.getElementById("sAcToggle").checked
    : false;
  refreshSummary();
}

var DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayRatesHtml(s) {
  if (!s || !s.nights || s.nights < 2) return "";
  var dr = buildDayRates(s.room, s.checkin, s.nights, s.ac);
  var html = "";
  for (var i = 0; i < dr.dayRates.length; i++) {
    var d = dr.dayRates[i];
    html +=
      '<div class="s-day-rate">' +
      '<span class="s-day-name">' +
      escHtml(d.date) +
      "</span>" +
      '<span class="s-day-price">' +
      fmtMoney(d.rate) +
      "</span>" +
      "</div>";
  }
  return html;
}

function summaryHtml(s, opts) {
  var billPrint = opts && opts.billPrint;
  var sIn = s.checkin || checkIn;
  var sOut = s.checkout || checkOut;

  var guestLine =
    "<b>" +
    s.adults +
    "</b> Adult" +
    (s.adults > 1 ? "s" : "") +
    (s.children > 0
      ? " \u00b7 <b>" +
      s.children +
      "</b> Child" +
      (s.children > 1 ? "ren" : "") +
      " (" +
      s.freeChildren +
      " free)"
      : "") +
    " \u00b7 <b>" +
    s.chargeable +
    "</b> Chargeable \u00b7 <b>" +
    s.totalGuests +
    "</b> Total";

  var rows = srow(
    "Room \u00b7 " + s.nights + " night" + (s.nights > 1 ? "s" : ""),
    fmtMoney(s.roomCostFull),
  ); if (s.discountAmt > 0) {
    rows += srow(
      "Long-stay discount (" + s.discountPercent + "%)",
      "\u2212" + fmtMoney(s.discountAmt),
      "neg",
    );
  }
  if (s.adultFee > 0) {
    rows += srow(
      "Extra adult" +
      (s.extraAdults > 1 ? "s" : "") +
      " (" +
      s.extraAdults +
      " \u00d7 " +
      fmtMoney(s.extraAdultsRate) +
      ")",
      fmtMoney(s.adultFee),
    );
  }
  if (s.childFee > 0) {
    rows += srow(
      "Child (" +
      s.paidChildren +
      " \u00d7 " +
      fmtMoney(s.childRate || 0) +
      ")",
      fmtMoney(s.childFee),
    );
  }
  if (s.package && s.packageCost > 0) {
    rows += srow("Package \u00b7 " + s.package.name, fmtMoney(s.packageCost));
  }
  if (s.addonList && s.addonList.length) {
    for (var ai = 0; ai < s.addonList.length; ai++) {
      var ao = s.addonList[ai];
      rows += srow(
        "Add-on \u00b7 " + escHtml((ao.addon && ao.addon.name) || "Add-on"),
        fmtMoney(ao.cost),
      );
    }
  }
  if (s.mattressCharge > 0) {
    rows += srow("Extra Mattress", fmtMoney(s.mattressCharge));
  }
  rows += srow("GST " + (s.gst != null ? s.gst : hotel.gst) + "%", fmtMoney(s.tax));
  rows +=
    '<div class="s-row s-total"><span>Grand Total</span><span class="amt">' +
    fmtMoney(s.grandTotal) +
    "</span></div>";

  return (
    '<div class="s-head">' +
    '<div class="s-head-info">' +
    '<div class="s-hotel">' +
    escHtml(hotel.name) +
    "</div>" +
    '<div class="s-room" id="sRoomLine">' +
    escHtml(s.room.name) +
    "</div>" +
    '<div class="s-day-rates">' +
    dayRatesHtml(s) +
    "</div>" +
    "</div>" +
    (billPrint
      ? '<div class="s-ac-tag">Room <b>' +
        (s.ac ? "With AC" : "Without AC") +
        "</b></div>"
      : '<label class="s-ac-toggle' +
        (chargeWithAc ? " on" : "") +
        '" title="Charge with AC">' +
        '<input type="checkbox" id="sAcToggle"' +
        (chargeWithAc ? " checked" : "") +
        ' onchange="toggleChargeAc()">' +
        '<span class="ic">' +
        (chargeWithAc ? "charge with-AC" : "charge without AC") +
        "</span>" +
        "</label>") +
    "</div>" +
    '<div class="s-stay"><i class="fa-solid fa-calendar-days"></i> ' +
    (fmtDate(sIn) || "Not Selected") +
    " \u2192 " +
    (fmtDate(sOut) || "Not Selected") +
    " \u00b7 " +
    s.nights +
    " night" +
    (s.nights > 1 ? "s" : "") +
    "</div>" +
    '<div class="s-guests">' +
    guestLine +
    "</div>" +
    '<div class="s-rows">' +
    rows +
    "</div>" +
    (billPrint
      ? ""
      : '<button class="ht-btn ht-btn-ember ht-pay-btn" onclick="finishPreview()">' +
        '<i class="fa-solid fa-shield-halved"></i> Pay ' +
        fmtMoney(s.grandTotal) +
        "</button>" +
        '<div class="s-note">Taxes and totals are indicative. The hotel will confirm your stay.</div>')
  );
}

function srow(k, v, cls) {
  return (
    '<div class="s-row' +
    (cls ? " " + cls : "") +
    '"><span>' +
    escHtml(k) +
    '</span><span class="amt">' +
    v +
    "</span></div>"
  );
}

/* ============================================================
   BOOKING PAYLOAD (send-side)
   ------------------------------------------------------------
   payload0.p is ONE flat object built inside sendBookingPayload()
   below, shaped 1:1 to the zrb table columns. a/b/c/d are NOT
   sent - the server generates them on insert (id auto-increment,
   record dtt default, facility ref proxy, status booked):

   e room id (rm) | f booking dtt | g check-in date | h
   check-out date | i actual check-in dtt (planned at create) |
   j actual check-out dtt (planned at create) |
   k guest info {a adults, b children total, c paid children,
   d free children, e ages[], f package id} |
   l facility charges JSON envelope
   {l: [{a facility id, b unit price}], ado: [selected add-ons],
   adt: [selected adtnolChrgs]} | m total amount | n discount |
   o booker id | p booking reference number (server assigned) |
   q special requests / notes | r/s tax percents.

   Facility ids in l: 1 = room rate, 8 = paid child,
   9 = extra adult, adons via the ado array.
   ============================================================ */

function addonFacilityId(name) {
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
  var adons = Array.isArray(cfg.adons) ? cfg.adons : [];
  for (var i = 0; i < adons.length; i++) {
    if (
      String(adons[i].b || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "") === norm
    ) {
      return Number(adons[i].a);
    }
  }
  return 0;
}

/* ============================================================
   PAYLOAD + SERVER REQUEST (booking only)
   ------------------------------------------------------------
   Mirrors the KS save pattern: a single flat payload0.p built
   inline, fnj3 with a hardcoded endpoint and a silent
   best-effort sync - the booking preview modal (payAmount) is
   the only UI feedback.

   payload0.p is ONE flat object shaped 1:1 to the zrb table
   (see section header above). Boot-time refresh lives in core/ht.js with its
   own endpoint (refreshFromServer, rfsh.php).
   ============================================================ */
async function sendBookingPayload() {
  var snap = lastSnap || calcBooking();
  if (!snap) return;
  var room = snap.room;

  var nowDtt = todayStr() + " " + new Date().toTimeString().slice(0, 5);

  if (snap.adults == 1) {
    var ok = await showConfirmModal(
      "Check Adults: Please confirm " + (snap.adults + snap.children) + " persons",
    );
    if (!ok) return false;
  }
  var charges = [];
  if (snap.roomRateIncl > 0) {
    charges.push({ a: 1, b: snap.roomRateIncl }); // room rate per night
  }
  if (snap.extraAdults > 0) {
    charges.push({ a: 9, b: snap.extraAdultsRate || 0 }); // extra adult
  }
  if (snap.paidChildren > 0) {
    charges.push({ a: 8, b: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.paidChildCharge || 0 }); // paid child
  }
  // Selected add-ons travel in the ado section of the facility-charges JSON.
  // b = the add-on's per-night rate (charged = rate x nights), matching the
  // admin writer. adt (additional charges) is flat and starts empty here.
  var ado = [];
  (snap.addonList || []).forEach(function (x) {
    var fid = addonFacilityId(x.addon.name);
    if (fid) ado.push({ a: fid, b: x.addon.price || 0 });
  });
  // Additional charges (rm.da.adtnolChrgs) are not selectable on the public
  // side, so adt starts empty but the key is still sent.
  var adt = [];

  payload0.p = {
    e: room ? room.a || room.no || room.e || 0 : 0, // room ID from rm table
    f: nowDtt, // booking dtt
    g: checkIn, // check-in date
    h: checkOut, // check-out date
    k: JSON.stringify({
      a: snap.adults,
      b: snap.children,
      c: snap.paidChildren,
      d: snap.freeChildren,
      e: childAges.slice(),
      f: packageId || 0,
    }),
    l: buildBookingFacilityL(charges, ado, adt, chargeWithAc ? 1 : 0),
    m: snap.grandTotal,
    o: (typeof my1uzr !== "undefined" && my1uzr && my1uzr.ui) || 0,
  };
  if (bpColHidden("cyp")) {
    var kg = JSON.parse(payload0.p.k);
    delete kg.f;
    payload0.p.k = JSON.stringify(kg);
  }
  payload0.fn = 113;
  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "rb" }]);

  delete payload0.x1;

  try {
    if (typeof fnj3 === "function") {
      var resp = await fnj3(
        "https://my1.in/3/c.php",
        payload0,
        1,
        true,
        null,
        20000,
        0,
        2,
        1,
      );
      if (resp && resp.su == 1) {
        await hndlRspo113(resp, snap, room);
      } else {
        pendingPay = false;
          showelsemodal(
    resp?.ms ||
    "Try Again!",
    true,
  );
        console.warn("Server did not return data - keeping local data");
          return;
      }
    }
  } catch (err) {
    pendingPay = false;
    if (!el("modalOverlay") && !el("billOverlay")) //renderAppUI();
      showelsemodal(
    resp?.ms ||
    "Try Again!",
    true,
  );
    console.warn("Server request failed - keeping local data");
      return;
  }
  return false;
}

// Build the post-booking bill snapshot purely from the request snapshot (snap)
// plus the server response records: the newly created booking row (rb) and the
// guest record (c), matched by c.a === rb.o. Never reads rendered elements.
function buildGuestBookingBillSnap(snap, resp) {
  var bs = snap || {};
  var rbList = (resp && resp.rb && resp.rb.l) || [];
  var cList = (resp && resp.c && resp.c.l) || [];
  if (!rbList.length || !cList.length) return bs;

  var roomId = "";
  if (bs.room) {
    var rid =
      bs.room.a != null ? bs.room.a : bs.room.no != null ? bs.room.no : bs.room.e;
    if (rid != null) roomId = String(rid);
  }
  var inD = bs.checkin != null ? String(bs.checkin) : "";
  var outD = bs.checkout != null ? String(bs.checkout) : "";

  var myRb = null;
  for (var i = 0; i < rbList.length; i++) {
    var rb = rbList[i] || {};
    if (roomId !== "" && String(rb.e) !== roomId) continue;
    if (inD && String(rb.g) !== inD) continue;
    if (outD && String(rb.h) !== outD) continue;
    if (!myRb || (parseInt(rb.a, 10) || 0) > (parseInt(myRb.a, 10) || 0)) {
      myRb = rb;
    }
  }
  if (!myRb && cList.length) {
    var gid = String(cList[0].a);
    for (var j = 0; j < rbList.length; j++) {
      var rj = rbList[j] || {};
      if (rj.o != null && String(rj.o) === gid) {
        if (!myRb || (parseInt(rj.a, 10) || 0) > (parseInt(myRb.a, 10) || 0)) {
          myRb = rj;
        }
      }
    }
  }

  var myGuest = null;
  if (myRb && myRb.o != null) {
    for (var k = 0; k < cList.length; k++) {
      if (cList[k].a != null && String(cList[k].a) === String(myRb.o)) {
        myGuest = cList[k];
        break;
      }
    }
  }
  if (!myGuest) myGuest = cList[0];

  if (myGuest) {
    bs.guestName = myGuest.h != null ? String(myGuest.h) : bs.guestName;
    bs.contact = myGuest.e != null ? String(myGuest.e) : bs.contact;
    bs.address = myGuest.m != null ? String(myGuest.m) : bs.address;
    bs.email =
      typeof billC1Email === "function"
        ? billC1Email(myGuest) || bs.email
        : bs.email;
  }
  if (myRb && myRb.g && myRb.h) {
    bs.checkin = myRb.g;
    bs.checkout = myRb.h;
  }
  return bs;
}

window.hndlRspo113 = async function (resp, snap, room) {
  if (resp && resp.su == 1) {
  await handl_rm_rspons(resp);
  if (typeof beBookedDatesCache !== "undefined") beBookedDatesCache = {};
  window.__pubBookingsLoaded = false;
  try {
    if (typeof dbDexieManager !== "undefined" && typeof dbnm !== "undefined") {
      var dbBk = (await dbDexieManager.getAllRecords(dbnm, "rb")) || [];
      if (dbBk.length && typeof bookingRecords !== "undefined") {
        bookingRecords = dbBk.map(normalizeBookingRow);
      }
    }
  } catch (e) {
    console.warn("Failed to reload bookings after save:", e);
  }
  if (typeof clearPublicStayDates === "function") clearPublicStayDates();
  if (!el("modalOverlay") && !el("billOverlay")) renderAppUI();
  if (typeof showBill === "function") {
    closeModal();
    closeSummarySheet();
    var billSnap = snap;
    if (!billSnap) {
      billSnap =
        (typeof lastSnap !== "undefined" && lastSnap) ||
        (typeof calcBooking === "function" ? calcBooking() : null);
    }
    // showBill(buildGuestBookingBillSnap(billSnap || {}, resp), function () {
    //   var scrollRoom = room || (billSnap && billSnap.room);
    //   if (scrollRoom && typeof showHome === "function") {
    //     showHome();
    //     window.setTimeout(function () {
    //       var card = document.getElementById("room-card-" + scrollRoom.id);
    //       if (card && card.scrollIntoView) {
    //         card.scrollIntoView({ behavior: "smooth", block: "center" });
    //       }
    //     }, 64);
    //   }
    // });
  } else {
    showMessageModal(
      "Done",
      "Your booking request has been sent. The hotel will confirm shortly.",
    );
  }
  return true;
 }else {
        pendingPay = false;
        showelsemodal(resp.ms || "Plese try again");
      }
}

function mrow(k, v) {
  return (
    '<div class="m-row"><span class="k">' +
    escHtml(k) +
    '</span><span class="v">' +
    escHtml(v) +
    "</span></div>"
  );
}

function closeModal() {
  var ov = el("modalOverlay");
  if (ov) ov.classList.remove("open");
  document.body.style.overflow = "";
  window.setTimeout(function () {
    if (el("modalOverlay") && el("modalRoot")) el("modalRoot").innerHTML = "";
  }, 250);
}

var pendingPay = false;

function isLoggedIn() {
  return !!(typeof my1uzr !== "undefined" && my1uzr && my1uzr.mk);
}

/* ---------- Logged-in guest booking actions ---------- */
function getMyGuestId() {
  var u = typeof my1uzr !== "undefined" && my1uzr ? my1uzr : {};
  if (u.ui != null && String(u.ui) !== "" && !isNaN(Number(u.ui)))
    return String(u.ui);
  if (
    u.mo &&
    u.mc &&
    typeof guestRecords !== "undefined" &&
    guestRecords
  ) {
    for (var i = 0; i < guestRecords.length; i++) {
      var c = guestRecords[i] || {};
      if (
        c.a != null &&
        String(c.e) === String(u.mo) &&
        String(c.f) === String(u.mc)
      )
        return String(c.a);
    }
  }
  return "";
}

function getMyActiveBooking() {
  if (typeof bookingRecords === "undefined" || !bookingRecords) return null;
  var u = typeof my1uzr !== "undefined" && my1uzr ? my1uzr : {};
  var guestId = getMyGuestId();
  var moDigits = String(u.mo || "").replace(/\D/g, "");
  var best = null;
  for (var i = 0; i < bookingRecords.length; i++) {
    var bk = bookingRecords[i];
    if (!bk || Number(bk.o) === 4) continue;
    var mine = false;
    if (guestId && bk.oc != null) mine = String(bk.oc) === guestId;
    if (!mine && moDigits) {
      var hDigits = String(bk.h || "").replace(/\D/g, "");
      mine = hDigits.length >= 10 && hDigits.slice(-10) === moDigits.slice(-10);
    }
    if (!mine) continue;
    if (!best || (Number(bk.a) || 0) > (Number(best.a) || 0)) best = bk;
  }
  return best;
}

// Public bookings are otherwise only lazy-loaded when the summary sheet opens
// (see openSummarySheet below). Load the rb and c tables into bookingRecords /
// guestRecords so a logged-in guest's active booking can be shown on home.
async function ensurePublicBookingsLoaded() {
  try {
    if (
      typeof dbDexieManager !== "undefined" &&
      typeof dbnm !== "undefined"
    ) {
      var dbBk = (await dbDexieManager.getAllRecords(dbnm, "rb")) || [];
      if (dbBk.length && typeof bookingRecords !== "undefined") {
        bookingRecords = dbBk.map(normalizeBookingRow);
      }
      try {
        var dbC = (await dbDexieManager.getAllRecords(dbnm, "c")) || [];
        if (dbC.length && typeof guestRecords !== "undefined") {
          guestRecords = dbC;
        }
      } catch (e2) {
        console.warn("Failed to load guest records:", e2);
      }
    }
  } catch (e) {
    console.warn("Failed to load bookings for public home:", e);
  }
  window.__pubBookingsLoaded = true;
}

function bookingSnapFromRecord(bk) {
  if (!bk) return null;
  var room = null;
  var raw = typeof getRoomById === "function" ? getRoomById(bk.j) : null;
  if (raw && typeof mapRmToRoomRecord === "function") {
    room = mapRmToRoomRecord(raw);
  }
  if (!room) {
    var rmList = (window[my1uzr.worknOnPg].clientConfig &&
      window[my1uzr.worknOnPg].clientConfig.rm) || [];
    for (var ri = 0; ri < rmList.length; ri++) {
      var r = rmList[ri];
      if (r && (String(r.a) === String(bk.j) || String(r.e) === String(bk.j))) {
        room = typeof mapRmToRoomRecord === "function" ? mapRmToRoomRecord(r) : r;
        break;
      }
    }
  }
  room = room || { name: bk.s || "Hotel Stay", tagline: "", city: "" };
  var nights =
    bk.e && bk.f && typeof calcNights === "function"
      ? calcNights(bk.e, bk.f)
      : Number(bk.m) || 1;
  if (!(nights > 0)) nights = 1;

  var gi = null;
  var k = null;
  try {
    gi = typeof bk.i === "string" ? JSON.parse(bk.i) : bk.i;
  } catch (e) {}
  try {
    k = typeof bk.k === "string" ? JSON.parse(bk.k) : bk.k;
  } catch (e) {}

  var adults = parseInt(gi && gi.ad != null ? gi.ad : k && k.a, 10) || 0;
  var ages = Array.isArray(k && k.e)
    ? k.e
    : Array.isArray(gi && gi.ch)
      ? gi.ch.map(function (c) {
          return c != null && typeof c === "object" && c.a != null ? c.a : 1;
        })
      : [];
  var children =
    k && k.b != null && !isNaN(Number(k.b)) ? Number(k.b) : ages.length;

  var cfg =
    (window[my1uzr.worknOnPg].clientConfig &&
      window[my1uzr.worknOnPg].clientConfig.HT_CFG) ||
    {};
  var freeMax = cfg.childAgeFreeMax != null ? Number(cfg.childAgeFreeMax) : 8;
  var paidChildren = ages.filter(function (a) {
    return Number(a) > freeMax;
  }).length;
  var freeChildren = Math.max(0, children - paidChildren);
  var gst = typeof hotel !== "undefined" && hotel ? hotel.gst || 0 : 0;

  var parsedL = parseBookingFacilityL(bk.l);
  var chargesMain = Array.isArray(parsedL.main) ? parsedL.main : [];
  var chargesAdo = Array.isArray(parsedL.ado) ? parsedL.ado : [];
  var chargesAdt = Array.isArray(parsedL.adt) ? parsedL.adt : [];

  var rate1 = null;
  var rate8 = 0;
  var rate9 = 0;
  var mattressCharge = 0;
  var addonChargeTotal = 0;
  for (var ci = 0; ci < chargesMain.length; ci++) {
    var c = chargesMain[ci] || {};
    var fid = Number(c.a);
    if (fid === 1) rate1 = Number(c.b) || 0;
    else if (fid === 3) mattressCharge += Number(c.b) || 0;
    else if (fid === 8) rate8 += Number(c.b) || 0;
    else if (fid === 9) rate9 += Number(c.b) || 0;
    else if (fid > 0) addonChargeTotal += Number(c.b) || 0;
  }

  if (!room.pricePerNight && rate1 > 0) {
    room.pricePerNight = rate1;
  }

  var dr = buildDayRates(room, bk.e, nights, parsedL.ac ? true : false);
  var full = dr.total;
  var dayRates = dr.dayRates;

  var extraAdults = Math.max(0, adults - 2);
  var extraAdultsRate = Number(cfg.extraAdultsCharge) || 0;
  var adultFee = extraAdults * (rate9 || extraAdultsRate) * nights;
  var childFee =
    paidChildren * (rate8 || Number(cfg.paidChildCharge) || 0) * nights;
  var occupancyFee = adultFee + childFee;

  // Add-ons / extras come from their own envelope sections (ado | adt): ado
  // stores a PER-NIGHT rate (charged = rate x nights), adt stores a FLAT amount
  // shown directly. Names are resolved back by facility id - never by re-scanning the
  // whole addonRecords list (which also holds display-only adtnolChrgs "info"
  // rows and would fabricate rows the booking never had).
  var cfgAllRec = window[my1uzr.worknOnPg]?.clientConfig || {};
  var adonsSrc = Array.isArray(cfgAllRec.adons) ? cfgAllRec.adons : [];
  var adtsSrc = Array.isArray(cfgAllRec.adtnolChrgs) ? cfgAllRec.adtnolChrgs : [];

  var addonList = [];
  var addonCost = 0;
  for (var ai = 0; ai < chargesAdo.length; ai++) {
    var en = chargesAdo[ai] || {};
    var nm = "";
    for (var api = 0; api < adonsSrc.length; api++) {
      if (Number(adonsSrc[api].a) === Number(en.a)) nm = String(adonsSrc[api].b || "");
    }
    var cost = (Number(en.b) || 0) * nights;
    addonList.push({ addon: { name: nm || "Add-on" }, cost: cost });
    addonCost += cost;
  }
  var extraRows = [];
  for (var aj3 = 0; aj3 < chargesAdt.length; aj3++) {
    var et = chargesAdt[aj3] || {};
    var enm = "";
    for (var apj = 0; apj < adtsSrc.length; apj++) {
      if (Number(adtsSrc[apj].a) === Number(et.a)) enm = String(adtsSrc[apj].b || "");
    }
    extraRows.push({ name: enm || "Extra Charges", price: Number(et.b) || 0 });
  }
  // Legacy tolerance: old bare-array records have no ado/adt sections, so any
  // unknown facility charge in main is surfaced as a single aggregate row.
  if (!chargesAdo.length && !chargesAdt.length && addonChargeTotal > 0) {
    addonCost = addonChargeTotal;
    addonList.push({ addon: { name: "Add-ons" }, cost: addonChargeTotal });
  }

  var discountAmt = 0;
  var roomCostFull = full;
  var subtotal = roomCostFull + occupancyFee + addonCost - discountAmt;
  var tax = gst > 0 ? Math.round((subtotal * gst) / 100) : 0;

  if (subtotal <= 0 && bk.n) {
    roomCostFull = Number(bk.n) || 0;
    subtotal = roomCostFull;
    tax = 0;
  }
  var grandTotal = Math.round(subtotal + tax);

  return {
    room: room,
    nights: nights,
    checkin: bk.e,
    checkout: bk.f,
    ac: parsedL.ac || 0,
    actualCheckin:
      bk.actualCheckin != null && bk.actualCheckin !== ""
        ? bk.actualCheckin
        : "",
    actualCheckout:
      bk.actualCheckout != null && bk.actualCheckout !== ""
        ? bk.actualCheckout
        : "",
    gst: gst,
    adults: adults,
    children: children,
    paidChildren: paidChildren,
    freeChildren: freeChildren,
    chargeable: adults + paidChildren,
    totalGuests: adults + children,
    includedGuests: 2,
    extraAdults: extraAdults,
    extraAdultsRate: rate9 || extraAdultsRate,
    adultFee: adultFee,
    childFee: childFee,
    childRate: rate8 || Number(cfg.paidChildCharge) || 0,
    roomCostFull: roomCostFull,
    roomRateIncl: roomCostFull > 0 && nights ? Math.round(roomCostFull / nights) : 0,
    discountAmt: discountAmt,
    discountPercent: 0,
    occupancyFee: occupancyFee,
    mattressCharge: mattressCharge,
    dayRates: dayRates,
    package: null,
    packageCost: 0,
    addonList: addonList,
    addonCost: addonCost,
    extraRows: extraRows,
    subtotal: subtotal,
    tax: tax,
    grandTotal: grandTotal,
  };
}

window.printMyBooking = async function () {
  if (!window.__pubBookingsLoaded) {
    try {
      await ensurePublicBookingsLoaded();
    } catch (e) {
      console.warn("Failed to preload bookings for print:", e);
    }
  }
  var bk = getMyActiveBooking();
  if (!bk) {
    showMessageModal("Info", "No active booking to print.", false);
    return;
  }
  if (typeof showBill === "function") {
    showBill(bookingSnapFromRecord(bk), function () {
      if (typeof showHome === "function") showHome();
    });
    window.setTimeout(function () {
      document.body.classList.add("ht-print-bill");
      var cleanup = function () {
        document.body.classList.remove("ht-print-bill");
      };
      window.addEventListener("afterprint", cleanup);
      window.print();
      window.setTimeout(cleanup, 30000);
    }, 500);
  } else {
    showMessageModal("Info", "Print unavailable.", true);
  }
};

window.cancelMyBooking = async function () {
 
    showMessageModal("Info", window[my1uzr.worknOnPg].clientConfig.cnclBookMssgSw, false);
    return;
  
};

function validateStay() {
  var room = getRoom();
  if (!room) return "Please choose a room to continue.";
  if (!checkIn || !checkOut || nightsBetween(checkIn, checkOut) < 1) {
    return "Please select 'check-in' and 'check-out' dates.";
  }
  if (!adults || adults < 1) {
    return "Please select at least one adult.";
  }
  var lim = roomGuestLimits();
  if (lim.maxTotal && adults + children > lim.maxTotal) {
    return (
      escHtml(room.name) +
      " fits only " +
      lim.maxTotal +
      " guests in total. Please adjust the number of adults and children."
    );
  }
  if (adults > lim.maxAdults || children > lim.maxChildren) {
    return (
      escHtml(room.name) +
      " fits up to " +
      lim.maxAdults +
      " adults and " +
      lim.maxChildren +
      " children. Please adjust the number of adults and children."
    );
  }
  return "";
}

function finishPreview() {
  var msg = validateStay();
  if (msg) {
    showMessageModal("Check Your Stay", msg, true);
    return;
  }
  //if (isLoggedIn()) {
    sendBookingPayload();
  // } else {
  //   pendingPay = true;
  //   open_shoLgnO("tempLoginModal", 0, 0);
  // }
}

window.function2runAfter_O_Login = function (result) {
  if (result && result.xtra && result.xtra.fn) return;
  if (pendingPay) {
    pendingPay = false;
    sendBookingPayload();
  }
  if (currentView === "home") {
    (typeof ensurePublicBookingsLoaded === "function"
      ? ensurePublicBookingsLoaded()
      : Promise.resolve()
    ).then(function () {
      if (currentView === "home" && typeof renderHome === "function") {
        renderHome();
      }
    });
  }
};

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeSummarySheet();
    closeModal();
  }
});

console.log("✅ booking loaded");
