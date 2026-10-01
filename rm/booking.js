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

function roomGuestLimits(room) {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var maxAdults = parseInt(cfg.maxAdults, 10);
  var maxChildren = parseInt(cfg.maxChildren, 10);
  if (!isFinite(maxAdults) || maxAdults < 1) maxAdults = 1;
  if (!isFinite(maxChildren) || maxChildren < 0) maxChildren = 0;
  var policy =
    room && typeof htRoomOccupancyPolicy === "function"
      ? htRoomOccupancyPolicy(room)
      : null;
  return {
    maxAdults: maxAdults,
    maxChildren: maxChildren,
    maxTotal: 0,
    roomCapacity: policy ? policy.capacity : 0,
    roomMaxOccupancy: policy ? policy.maxOccupancy : 0,
  };
}

// Re-filter the room list the moment the party changes, so a guest never has to
// re-run a search to see which rooms still fit. Also drops a selected
// combination that the new party size has invalidated, otherwise the details
// view would keep pricing rooms that no longer sleep everyone.
function refilterHomeForParty() {
  if (currentView !== "home") return;
  if (
    comboSelection &&
    comboSelection.key &&
    typeof publicComboOptions === "function" &&
    typeof htPublicParty === "function"
  ) {
    var party = htPublicParty();
    var stillOffered = publicComboOptions(party.adults, party.childAges).some(
      function (opt) {
        return opt.key === comboSelection.key;
      },
    );
    if (!stillOffered) {
      comboSelection = null;
      if (typeof refreshSummary === "function") refreshSummary();
    }
  }
  renderHome();
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
  refilterHomeForParty();
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
  refilterHomeForParty();
}

function setChildAge(i, v) {
  childAges[i] = parseInt(v, 10);
  renderChildStrip();
  refreshSummary();
  refilterHomeForParty();
}

function toggleChildStrip() {
  childStripOpen = !childStripOpen;
  var strip = document.querySelector("#childStrip .ht-child-strip");
  if (strip) strip.classList.toggle("collapsed", !childStripOpen);
}

function ageOptions(sel) {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var room = typeof getRoom === "function" ? getRoom() : null;
  var freeMax =
    typeof htRoomOccupancyPolicy === "function"
      ? htRoomOccupancyPolicy(room).childAgeFreeMax
      : cfg.childAgeFreeMax != null
        ? Number(cfg.childAgeFreeMax)
        : 8;
  var maxAge = cfg.childAgeMax != null ? Number(cfg.childAgeMax) : 17;
  var html = "";
  for (var a = 0; a <= maxAge; a++) {
    html +=
      '<option value="' +
      a +
      '"' +
      (a === sel ? " selected" : "") +
      ">" +
      a +
      " yrs" +
      (a > freeMax ? " \u00b7 adult-equivalent" : " \u00b7 free") +
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
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var room = typeof getRoom === "function" ? getRoom() : null;
  var freeMax =
    typeof htRoomOccupancyPolicy === "function"
      ? htRoomOccupancyPolicy(room).childAgeFreeMax
      : cfg.childAgeFreeMax != null
        ? Number(cfg.childAgeFreeMax)
        : 8;
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
     '<span class="cs-note">Ages ' +
     freeMax +
     " &amp; under stay free; older children count as adults</span>" +
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
  // Both dates set: the date fields' onchange (rm.js) already ran the filter and
  // re-rendered the list, so there is nothing left to rebuild - just take the
  // guest to the results, which is the scroll the dates already do.
  if (roomAvailFilter && currentView === "home") {
    scrollToSearchResults();
    return;
  }
  // A single date filters nothing, or we are off the home view where there is no
  // room list to scroll to (switchView hides #viewHome), so the full path runs
  // and showHome() brings that list back.
  applyAvailabilityFilterToHome();
}

function clearRoomFilter() {
  roomFilterActive = false;
  renderHome();
}

/* ---------- Date-based room availability filter (public) ---------- */
function publicRoomId(r) {
  if (!r) return "";
  var value =
    r.a != null && r.a !== ""
      ? r.a
      : r.id != null && r.id !== ""
        ? r.id
        : r.e != null && r.e !== ""
          ? r.e
          : r.no != null && r.no !== ""
            ? r.no
            : "";
  return value === "" ? "" : String(value);
}

// A booking row names exactly one room (a combination is one row per room), so
// normalise that single id before comparing. bookingRecords is always the
// normalised display schema - every assignment maps through normalizeBookingRow
// (rm.js) - where j is the room id and e is the check-in date, so reading e
// here compared a date against a room id and never matched. Only a raw
// payload-shaped row (e = room id, g/h = dates) still needs the e fallback;
// the date sniff mirrors beLoadBookedDates (adminBooking.js).
function publicBookingRoomId(b) {
  if (!b) return "";
  var isDateShape = /^\d{4}-\d{2}-\d{2}/.test(
    String(b.e == null ? "" : b.e).trim(),
  );
  var raw = isDateShape ? b.j : b.e != null && b.e !== "" ? b.e : b.j;
  if (typeof adRoomId === "function") return adRoomId(raw);
  if (Array.isArray(raw)) raw = raw[0];
  return raw == null || raw === "" ? "" : String(raw);
}

function publicRoomHasBookingOverlap(r, from, to) {
  if (!r || !from || !to || to <= from) return false;
  var key = publicRoomId(r);
  if (!key || typeof bookingRecords === "undefined" || !Array.isArray(bookingRecords)) {
    return false;
  }
  for (var bi = 0; bi < bookingRecords.length; bi++) {
    var b = bookingRecords[bi];
    if (!b) continue;
    if (publicBookingRoomId(b) !== key) continue;
    if (Number(b.o) === 4 || Number(b.oc) === 4) continue;
    if (!b.e || !b.f) continue;
    if (b.e < to && from < b.f) return true;
  }
  return false;
}

// True when ANY of the requested rooms clashes with an existing booking.
function publicRoomsHaveBookingOverlap(rooms, from, to) {
  var list = Array.isArray(rooms) ? rooms : rooms ? [rooms] : [];
  for (var i = 0; i < list.length; i++) {
    if (publicRoomHasBookingOverlap(list[i], from, to)) return true;
  }
  return false;
}

async function publicSelectedRoomHasBookingOverlap(r, from, to) {
  if (!r || !from || !to || to <= from) return false;
  if (typeof ensurePublicBookingsLoaded === "function") {
    await ensurePublicBookingsLoaded();
  }
  return publicRoomHasBookingOverlap(r, from, to);
}

async function publicSelectedRoomsHaveBookingOverlap(rooms, from, to) {
  if (!from || !to || to <= from) return false;
  if (typeof ensurePublicBookingsLoaded === "function") {
    await ensurePublicBookingsLoaded();
  }
  return publicRoomsHaveBookingOverlap(rooms, from, to);
}

function publicRoomIsAvailable(r, from, to) {
  if (!r || !from || !to || to <= from) return false;
  return !publicRoomHasBookingOverlap(r, from, to);
}

function showRoomBookedConflictMessage() {
  var cfg =
    window[my1uzr.worknOnPg]?.clientConfig?.cust_da_const || {};
  var message =
    cfg.msgOnBookButtonifRoomBooked ||
    "This room is already booked for the selected dates.";
  if (typeof showMessageModal === "function") {
    showMessageModal("Info", message, false);
  } else {
    window.alert(message);
  }
}

async function bookRoomNow(id) {
  var wanted = String(id);
  var room = null;
  for (var i = 0; i < roomRecords.length; i++) {
    if (String(roomRecords[i].id) === wanted) {
      room = roomRecords[i];
      break;
    }
  }
  var cfg =
    window[my1uzr.worknOnPg]?.clientConfig?.cust_da_const || {};
  if (cfg.showRoomAvalOnHomePg != 1 && typeof openRoomBooking === "function") {
    await openRoomBooking();
  }
  if (await publicSelectedRoomHasBookingOverlap(room, checkIn, checkOut)) {
    showRoomBookedConflictMessage();
    return;
  }
  showRoomDetails(wanted);
}

/* ---------- Room combinations ---------- */
var publicComboCache = { key: "", options: [] };

// Cheapest first so the recommendation order is stable. With dates chosen the
// comparison uses what the stay actually costs per night, so a weekend-priced
// set cannot outrank a cheaper one that happens to be listed higher.
function publicRoomRate(r) {
  if (typeof htStayRate === "function") {
    var stay = htStayRate(r);
    if (stay && stay.dated) return stay.avg;
  }
  return Number(r && r.pricePerNight) || 0;
}

function publicComboKey(ids) {
  return htComboKey(ids);
}

// Every combination of currently bookable rooms that can sleep the party, best
// first. The search itself lives in rm.js (htComboOptions) so the admin flow
// can offer the same sets; this wrapper only supplies the public room pool, the
// date filter and a cache.
//
// The public list is wider than the admin picker on purpose: combinations are
// offered even when a single room could take the party, so a guest can also see
// a set of the smaller rooms, and sets of up to four rooms are considered rather
// than stopping at the first room count that fits.
//
// With nothing in the stepper there is no party to search against and the search
// stops. rm.da's showAllOptionsOfRoomsOnInit lifts that: the empty party then
// ranks every two- and three-room set by price, so the hotel's stay options are
// all on the page before the guest has picked anyone.
function publicComboOptions(adultCount, childAges) {
  var party =
    typeof htPublicParty === "function"
      ? htPublicParty()
      : { adults: adultCount, childAges: childAges || [] };
  var occ = htOccupancyPool([{}], party.adults, party.childAges);
  var noParty = !occ.effectiveOccupancy;
  if (noParty && !htShowAllRoomOptions()) return [];
  // rm.da's showOnlyCombosAbovePersons can also name a band of party sizes that is
  // shown single rooms and no combinations. Answered here rather than only where
  // the section is drawn, so "is this set on offer" has one answer for all three
  // callers: the section is left out, a set already picked is dropped when the party
  // size moves into the band (refilterHomeForParty), and bookComboNow will not
  // price a set the hotel has chosen to hide.
  if (typeof htCombosHiddenForParty === "function" && htCombosHiddenForParty()) {
   return [];
  }
  var pool = roomRecords.filter(function (r) {
    if (checkIn && checkOut && typeof publicRoomIsAvailable === "function") {
      return publicRoomIsAvailable(r, checkIn, checkOut);
    }
    return true;
  });
  // Availability is part of the key, so a late booking load cannot leave a
  // stale combination behind that includes a sold-out room.
  var cacheKey =
    occ.adults +
    "|" +
    (occ.childAges || []).join(",") +
    "|" +
    checkIn +
    "|" +
    checkOut +
    "|" +
    pool
      .map(function (r) {
        return r.id + ":" + publicRoomRate(r);
      })
      .join(",");
  if (publicComboCache.key === cacheKey) return publicComboCache.options;
  publicComboCache = {
   key: cacheKey,
   options: htComboOptions(pool, party.adults, party.childAges, {
    rateOf: publicRoomRate,
    // Four rooms is a lot of empty rooms to put in front of a guest who has not
    // said how many of them are staying, so the party-less list stops at three.
    maxRooms: noParty ? 3 : 4,
    allSizes: true,
    allowWithSingleFit: true,
    allowEmptyParty: noParty,
    // The list order the hotel has chosen. cheapestAllIn (rm.da
    // showCombosCheapestFirst) ranks by what the guest pays, cheap to expensive,
    // mixing two-, three- and four-room sets in one list; without it the
    // fallback below blocks the list by room count instead, cheapest within each
    // size. Neither needs the "no surcharge needed" test to come first - that is
    // what used to push every set charging for its extra guests behind every set
    // that did not, leaving the two-room set a party of six would have chosen
    // last of 375.
    cheapestAllIn:
     typeof htCombosRankByAllInPrice === "function" && htCombosRankByAllInPrice(),
    cheapestWithinSize: true,
   }),
  };
  return publicComboCache.options;
}

function publicComboByKey(key) {
  var party = typeof htPublicParty === "function" ? htPublicParty() : null;
  if (!party) return null;
  var list = publicComboOptions(party.adults, party.childAges);
  for (var i = 0; i < list.length; i++) {
    if (list[i].key === key) return list[i];
  }
  return null;
}

function combinations(list, size) {
  return htCombinations(list, size);
}


async function bookComboNow(key) {
  var combo = publicComboByKey(key);
  if (!combo) return;
  var cfg = window[my1uzr.worknOnPg]?.clientConfig?.cust_da_const || {};
  if (cfg.showRoomAvalOnHomePg != 1 && typeof openRoomBooking === "function") {
    await openRoomBooking();
  }
  if (await publicSelectedRoomsHaveBookingOverlap(combo.rooms, checkIn, checkOut)) {
    showRoomBookedConflictMessage();
    return;
  }
  if (typeof setComboSelection === "function") setComboSelection(combo);
  switchView("details");
}

function scrollToRoomList() {
  var list = document.querySelector(".ht-room-list");
  if (list) list.scrollIntoView({ behavior: "smooth", block: "start" });
}

// After a search the first room list is not always the answer: with no free
// single room it is missing, or it holds only the extra-guest-charge rooms
// while the combinations sit further down. Land on the combinations then.
function scrollToSearchResults() {
  if (lastSearchSingleCount === 0 && lastSearchComboCount > 0) {
    var combos = document.getElementById("htComboSection");
    if (combos) {
      combos.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
  }
  scrollToRoomList();
}

window.applyAvailabilityFilterToHome = async function () {
  roomAvailFilter = !!(checkIn && checkOut);
  // Only a date-bounded search needs the booking rows. The old no-dates early
  // return skipped showHome() entirely, so a search that only moved the stepper
  // appeared to do nothing; it re-renders now, just without the scroll below.
  if (roomAvailFilter && !window.__pubBookingsLoaded) {
    try {
      await ensurePublicBookingsLoaded();
    } catch (e) {
      console.warn("Availability preload failed:", e);
    }
  }
  if (currentView !== "home") showHome();
  else renderHome();
  // Only a date-bounded search has a result set worth taking the guest to. With
  // a single date (or none) the filter narrows nothing, and the unconditional
  // scroll made the page jump on every date change.
  if (roomAvailFilter) scrollToSearchResults();
};

window.clearAvailFilter = function () {
  roomFilterActive = false;
  roomAvailFilter = false;
  renderHome();
};

/* ---------- Summary sheet & bottom bar ---------- */
function renderSummarySheet() {
 var pay = el("paySheet");
 if (!pay) return;
 pay.innerHTML =
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
    ".be-cal-leg{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;padding-top:8px;border-top:1px solid #eee8da;font-size:11px;color:#8a5a2b;}" +
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
    var paySheetEl = el("paySheet");
    var hostDiv = document.createElement("div");
    hostDiv.className = "be-date-host";
    hostDiv.innerHTML =
      '<div style="font-size:13px;font-weight:700;color:#e8dfc8;margin-bottom:6px;">' +
      '<i class="fa-solid fa-calendar-days me-1"></i> Stay Dates</div>';
    hostDiv.appendChild(wrap);
    // #paySheetPanel is created by renderSummarySheet and holds the sheet
    // title, the summary and this field, so the field has to live inside it or
    // relocateSummaryPanel orphans it on desktop.
    if (!sheetPanel && paySheetEl && typeof renderSummarySheet === "function") {
      renderSummarySheet();
      if (typeof refreshSummary === "function") refreshSummary();
      sheetPanel = el("paySheetPanel");
    }
    if (sheetPanel) {
      var old = sheetPanel.querySelector(".be-date-host");
      if (old) old.remove();
      sheetPanel.insertBefore(hostDiv, sheetPanel.firstChild);
    } else if (paySheetEl) {
      paySheetEl.appendChild(hostDiv);
    } else {
      return false;
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
  var curRoom = getRoom();
  if (await publicSelectedRoomHasBookingOverlap(curRoom, checkIn, checkOut)) {
    showRoomBookedConflictMessage();
    return;
  }

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
    var paySheetEl = el("paySheet");
    var payOverlayEl = el("payOverlay");
    if (paySheetEl) paySheetEl.classList.add("open");
    if (payOverlayEl) payOverlayEl.classList.add("open");
  }
}

function closeSummarySheet() {
 var paySheetEl = el("paySheet");
 var payOverlayEl = el("payOverlay");
 if (paySheetEl) paySheetEl.classList.remove("open");
 if (payOverlayEl) payOverlayEl.classList.remove("open");
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
  var rooms = typeof selectedComboRooms === "function" && selectedComboRooms().length
    ? selectedComboRooms()
    : [room];
  var calcN = nightsBetween(checkIn, checkOut);
  var nights = nightsOverride != null
    ? nightsOverride
    : (isFinite(calcN) && calcN > 0 ? calcN : 1);

  // Pooled across every selected room: a combination is judged on its combined
  // normal and max occupancy, not room by room.
  var occupancy = htOccupancyPool(rooms, adults, childAges);
  var paidChildren = occupancy.paidChildren;
  var chargeable = occupancy.effectiveOccupancy;
  var totalGuests = adults + children;
  var freeChildren = occupancy.freeChildren;

  // Every room bills its own nights, so a combination is the sum of its rooms.
  var full = 0;
  var dayRates = [];
  var roomNightCosts = [];
  rooms.forEach(function (rr) {
   var dr = buildDayRates(rr, checkIn, nights);
   full += dr.total;
   roomNightCosts.push({ room: rr, nights: nights, cost: dr.total });
   dayRates = dayRates.concat(
    dr.dayRates.map(function (d) {
     return { date: d.date, total: d.total, roomId: rr.id };
    })
   );
  });
  var discountAmt = 0;

  var includedGuests = occupancy.capacity;
  var extraAdults = occupancy.extraAdultUnits;
  var paidChildUnits = occupancy.paidChildUnits;
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var extraAdultsRate = cfg.extraAdultsCharge || 0;
  var childRate = cfg.paidChildCharge || 0;
  var adultFee = extraAdults * extraAdultsRate * nights;
  // Over-age children spilling past the pooled normal occupancy are charged at
  // paidChildCharge; children within it cost nothing.
  var childFee = paidChildUnits * childRate * nights;
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

  var gst = htGstRate();
  // All listed prices are GST-exclusive: the subtotal below is the taxable
  // base. GST is charged on top, so the grand total is subtotal + tax.
  var subtotal = full - discountAmt + occupancyFee + packageCost + addonCost;
  var tax = gst > 0 ? Math.round((subtotal * gst) / 100) : 0;
  var grandTotal = Math.round(subtotal + tax);

  return {
    room: room,
    rooms: rooms,
    roomCount: rooms.length,
    isCombo: rooms.length > 1,
    comboKey: typeof currentComboKey === "function" ? currentComboKey() : "",
    nights: nights,
    checkin: checkIn,
    checkout: checkOut,
    gst: gst,
    adults: adults,
    children: children,
    paidChildren: paidChildren,
    adultEquivalentChildren: occupancy.adultEquivalentChildren,
    freeChildren: freeChildren,
    chargeable: chargeable,
    effectiveOccupancy: occupancy.effectiveOccupancy,
    maxOccupancy: occupancy.maxOccupancy,
    totalGuests: totalGuests,
    includedGuests: includedGuests,
    extraAdults: extraAdults,
    extraAdultUnits: extraAdults,
    extraAdultsRate: extraAdultsRate,
    adultFee: adultFee,
    paidChildUnits: paidChildUnits,
    childFee: childFee,
    childRate: childRate,
    occupancy: occupancy,
    roomCostFull: full,
    roomNightCosts: roomNightCosts,
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
       " free, " +
       s.paidChildren +
       " adult-equivalent)"
      : "") +
    " \u00b7 <b>" +
    s.chargeable +
    "</b> Chargeable \u00b7 <b>" +
    s.totalGuests +
    "</b> Total";

  var rows = srow(
    "Room \u00b7 " + s.nights + " night" + (s.nights > 1 ? "s" : ""),
    fmtMoney(s.roomCostFull),
  );
  // A combination keeps each room on its own line so the pay sheet shows what
  // was paid for, room by room, before the combined total.
  if (s.isCombo && s.rooms && s.rooms.length > 1) {
   var costs = s.roomNightCosts || [];
   rows =
    '<div class="s-row-group">' +
    s.rooms
     .map(function (rr, ri) {
      var line = costs[ri] ? costs[ri].cost : 0;
      return srow(
       "Room " + (rr.e || rr.id) + " \u00b7 " + (rr.name || ""),
       fmtMoney(line),
      );
     })
     .join("") +
    srow(
     "Rooms total \u00b7 " + s.nights + " night" + (s.nights > 1 ? "s" : ""),
     fmtMoney(s.roomCostFull),
     "sub",
    ) +
    "</div>";
  }
  if (s.discountAmt > 0) {
    var dLbl =
      s.discountPercent && Number(s.discountPercent) > 0
        ? "Long-stay discount (" + s.discountPercent + "%)"
        : "Discount";
    rows += srow(dLbl, "\u2212" + fmtMoney(s.discountAmt), "neg");
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
    // Guests always carry one uniform rate, so this prints the familiar
    // "Child (N x rate)". Only the admin per-child rows, which can price each
    // child differently, fall back to the per-night total. The strict false
    // check means a snapshot that never sets the flag keeps today's wording.
    rows += srow(
      "Child (" +
      s.paidChildUnits +
      (s.childRateUniform === false
        ? ", " + fmtMoney(s.childRateSum) + "/night total"
        : " × " + fmtMoney(s.childRate || 0)) +
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
        "Add-on \u00b7 " + ((ao.addon && ao.addon.name) || "Add-on"),
        fmtMoney(ao.cost),
      );
    }
  }
  // Extra Particulars are saved in the row's adt envelope, so a rebuilt bill
  // hands them over as extraRows. They are part of the charged amount, so they
  // must be printed like every other line or the rows stop adding up to the
  // total. Older snapshots carry only the single extraCharges/extraParticular
  // pair, which is why the fallback below stays.
  if (s.extraRows && s.extraRows.length) {
    for (var xi = 0; xi < s.extraRows.length; xi++) {
      var xr = s.extraRows[xi] || {};
      var xAmt = Number(xr.price) || 0;
      // srow escapes its own label, so the raw name goes in here. A negative
      // extra (the rate adjustment) is a reduction, not a charge.
      rows += srow(
        "Extra \u00b7 " + (xr.name || "Charges"),
        xAmt < 0 ? "\u2212" + fmtMoney(-xAmt) : fmtMoney(xAmt),
        xAmt < 0 ? "neg" : "",
      );
    }
  } else if (s.extraCharges > 0) {
    rows += srow(
      "Extra \u00b7 " + (s.extraParticular || "Charges"),
      fmtMoney(s.extraCharges),
    );
  }
  if (s.mattressCharge > 0) {
    rows += srow("Extra Mattress", fmtMoney(s.mattressCharge));
  }
    rows += srow("GST " + (s.gst != null ? s.gst : htGstRate()) + "%", fmtMoney(s.tax));
  rows +=
    '<div class="s-row s-total"><span>Grand Total</span><span class="amt">' +
    fmtMoney(s.grandTotal) +
    "</span></div>";
  // A bill has to say what is still due; the live summary sheet shows that in
  // its own balance area, so these rows are printed for the bill only.
  if (billPrint) {
    var recAmt = Math.max(
      0,
      Math.round(Number(s.received != null ? s.received : s.advanceAmount) || 0),
    );
    if (recAmt > 0) {
      var remAmt = Math.max(
        0,
        Math.round(Number(s.grandTotal) || 0) - recAmt,
      );
      rows += srow("Received", "\u2212" + fmtMoney(recAmt));
      rows += srow(
        "Remaining",
        remAmt === 0 ? fmtMoney(0) + " (Settled)" : fmtMoney(remAmt),
        remAmt === 0 ? "neg" : "",
      );
    }
  }

  // A combination is stored as one booking row per room, so the guest is shown
  // one paysheet per room with that room's own share, followed by the combined
  // total they are actually charged.
  var roomSheets = "";
  if (s.isCombo && s.rooms && s.rooms.length > 1) {
    var parts = buildBookingRoomParts(s);
    if (parts.length > 1) {
      roomSheets =
       '<div class="s-room-sheets">' +
       parts
        .map(function (part) {
         var pr = [];
         pr.push(
          srow(
           "Room " +
            (part.roomNo || part.roomId) +
            " \u00b7 " +
            part.nights +
            " night" +
            (part.nights > 1 ? "s" : ""),
           fmtMoney(part.roomCostFull),
          ),
         );
         if (part.adultFee > 0) {
          pr.push(
           srow(
            "Extra adult" +
             (part.extraAdults > 1 ? "s" : "") +
             " (" +
             part.extraAdults +
             ")",
            fmtMoney(part.adultFee),
           ),
          );
         }
         if (part.childFee > 0) {
          pr.push(
           srow(
            "Paid child (" + part.paidChildren + " \u00d7 " +
             fmtMoney(part.childFee / (part.paidChildren * part.nights)) +
             ")",
            fmtMoney(part.childFee),
           ),
          );
         }
         if (part.packageCost > 0) {
          pr.push(srow("Package share", fmtMoney(part.packageCost)));
         }
         if (part.addonCost > 0) {
          pr.push(srow("Add-on share", fmtMoney(part.addonCost)));
         }
         if (part.extraCharges > 0) {
          pr.push(srow("Extras", fmtMoney(part.extraCharges)));
         }
         if (part.discountAmt > 0) {
          pr.push(
           srow("Discount", "\u2212" + fmtMoney(part.discountAmt), "neg"),
          );
         }
         pr.push(
          srow(
           "GST " + (part.gst != null ? part.gst : htGstRate()) + "%",
           fmtMoney(part.tax),
          ),
         );
         return (
          '<div class="s-room-sheet">' +
          '<div class="s-room-sheet-head"><i class="fa-solid fa-door-open"></i> ' +
          escHtml(part.roomName || "Room " + (part.roomNo || part.roomId)) +
          " \u00b7 paysheet" +
          "</div>" +
          '<div class="s-rows">' +
          pr.join("") +
          '</div><div class="s-row s-total"><span>Room total</span><span class="amt">' +
          fmtMoney(part.total) +
          "</span></div></div>"
         );
        })
        .join("") +
       "</div>";
    }
  }

  return (
    '<div class="s-head">' +
    '<div class="s-head-info">' +
    '<div class="s-hotel">' +
    escHtml(hotel.name) +
    "</div>" +
    '<div class="s-room" id="sRoomLine">' +
    escHtml(summaryRoomLine(s)) +
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
    roomSheets +
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

// "Deluxe Room" for a single booking, "Room 5, Room 6 \u00b7 combination" for a set.
function summaryRoomLine(s) {
  var rooms = (s && s.rooms) || [];
  if (s && s.isCombo && rooms.length > 1) {
    return (
     "Rooms " +
     rooms
      .map(function (rr) {
       return rr.e || rr.id;
      })
      .join(", ") +
     " \u00b7 combination"
    );
  }
  if (s && s.room) return s.room.name;
  return (s && s.roomName) || "";
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
    k guest info {a adults, b children total, c adult-equivalent children,
    d free children, e ages[], f package id} |
    l facility charges JSON envelope
    {l: [{a facility id, b unit price}], ado: [selected add-ons],
    adt: [selected adtnolChrgs]} | m total amount | n discount |
    o booker id | p booking reference number (server assigned) |
    q special requests / notes | r/s tax percents.

    Facility ids in l: 1 = room rate, 8 = legacy paid child,
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

   payload0.p is an ARRAY of row objects, one per selected room, a
   single room included. Every row is a real booking of its own and
   carries its own share of the money, so the rows re-add to the
   combined grand total. Boot-time refresh lives in core/ht.js with
   its own endpoint (refreshFromServer, rfsh.php).
   ============================================================ */
async function sendBookingPayload(paySnap) {
  var snap = paySnap || paySnapLatch || lastSnap || calcBooking();
  if (!snap) return;
  var rooms = getBookingRooms(snap);

  if (await publicSelectedRoomsHaveBookingOverlap(rooms, checkIn, checkOut)) {
    showRoomBookedConflictMessage();
    return false;
  }

  var nowDtt = todayStr() + " " + new Date().toTimeString().slice(0, 5);

  if (snap.adults == 1) {
    var ok = await showConfirmModal(
      "Check Adults: Please confirm " + (snap.adults + snap.children) + " persons",
    );
    if (!ok) return false;
  }

  // Money is split first; every row is then written from its own part, so a row
  // can never quote a total the combined stay does not add up to.
  var parts = buildBookingRoomParts(snap);
  if (!parts.length) {
    showelsemodal("Could not price the selected rooms. Try Again!", true);
    return false;
  }

  // Selected add-ons are charged once for the stay, so the facility lines are
  // spread across the rooms (equal per-room share of the per-night rate) and the
  // money split lands on the same rooms in proportion to their room cost.
  // b = the add-on's per-night rate (charged = rate x nights), matching the
  // admin writer. adt (additional charges) is flat and starts empty here.
  var adoLines = [];
  (snap.addonList || []).forEach(function (x) {
    var fid = addonFacilityId(x.addon.name);
    if (fid) adoLines.push({ a: fid, b: x.addon.price || 0 });
  });
  var adtLines = [];
  var roomRates = parts.map(function (part, i) {
    var rr = part.room || {};
    if (parts.length > 1) return roomNightRate(rr, checkIn || todayStr(), chargeWithAc);
    return part.roomCostFull > 0
      ? Math.round(part.roomCostFull / part.nights)
      : snap.roomRateIncl || 0;
  });
  var rows = buildBookingRoomRows(snap, {
    bookingDtt: nowDtt,
    checkin: checkIn,
    checkout: checkOut,
    packageId: packageId || 0,
    includeRoomRate: true,
    roomRates: roomRates,
    addonShares: htSplitFacilityLines(adoLines, parts.length),
    extraShares: htSplitFacilityLines(adtLines, parts.length),
    chargeWithAc: chargeWithAc,
    bookerId: (typeof my1uzr !== "undefined" && my1uzr && my1uzr.ui) || 0,
    specialRequests: snap.specialRequests || null,
  });
  // The room field is the single room id the server stores (rm.a, falling back
  // to the room record's own identifiers).
  if (rows.length) {
    for (var ri = 0; ri < rows.length; ri++) {
      var rr2 = parts[ri].room || {};
      var rawId = rr2.a != null ? rr2.a : rr2.e != null ? rr2.e : rr2.id;
      rows[ri].e = rawId == null || rawId === "" ? "" : String(rawId);
    }
  }

  clearPayload0();
  payload0.p = rows;
  if (bpColHidden("cyp")) {
    payload0.p = payload0.p.map(function (row) {
      var kg = JSON.parse(row.k);
      delete kg.f;
      var copy = {};
      for (var key in row) if (Object.prototype.hasOwnProperty.call(row, key)) copy[key] = row[key];
      copy.k = JSON.stringify(kg);
      return copy;
    });
  }
  payload0.fn = 113;
  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "rb" },{ tb: "rc" }]);

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
        await hndlRspo113(resp, snap, snap.room);
      } else {
        pendingPay = false;
        paySnapLatch = null;
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
    paySnapLatch = null;
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

  // The server echoes p.e back in rb.e. One row holds one room, but a
  // combination sends several rows, so match on any of the booked rooms rather
  // than only the first.
  var roomIds = [];
  var bsRooms = (bs.rooms && bs.rooms.length ? bs.rooms : bs.room ? [bs.room] : []);
  bsRooms.forEach(function (rr) {
    var rid = rr.a != null ? rr.a : rr.no != null ? rr.no : rr.e;
    if (rid != null) roomIds.push(String(rid));
  });
  var roomId = roomIds[0] || "";
  var inD = bs.checkin != null ? String(bs.checkin) : "";
  var outD = bs.checkout != null ? String(bs.checkout) : "";

  function rbMatchesRoom(rb) {
    if (!roomIds.length) return true;
    var echoed = typeof adRoomId === "function" ? adRoomId(rb.e) : String(rb.e);
    return roomIds.indexOf(echoed) !== -1;
  }

  var myRb = null;
  for (var i = 0; i < rbList.length; i++) {
    var rb = rbList[i] || {};
    if (!rbMatchesRoom(rb)) continue;
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
      var dbRc = (await dbDexieManager.getAllRecords(dbnm, "rc")) || [];
      myBookingAll = buildMyBookingAll(dbBk, dbRc);
      await applyReceiptsToBookings(myBookingAll);
    }
  } catch (e) {
    console.warn("Failed to reload bookings after save:", e);
  }
   if (typeof clearPublicStayDates === "function") clearPublicStayDates();
   if (!el("modalOverlay") && !el("billOverlay")) renderAppUI();
     closeModal();
     closeSummarySheet();
    var billSnap =
      snap ||
      (typeof lastSnap !== "undefined" && lastSnap) ||
      (typeof calcBooking === "function" ? calcBooking() : null);
    // A combination is stored as one booking row per room, so the save returns
    // several ids. One PhonePe charge settles the whole stay, so every id goes
    // out on the payment and the amount is the combined grand total - not the
    // first row's share.
    var bookingIds = bookingIdsFromResp(resp);
    if (billSnap) {
      billSnap.bookingIds = bookingIds;
      if (bookingIds.length) billSnap.a = bookingIds[0];
      billSnap.paymentPhonePayGT = billSnap.grandTotal;
    }
    if (billSnap) await startPhonePePayment(billSnap, bookingIds.join(PP_BOOKING_ID_SEP));
  return true;
 }else {
      pendingPay = false;
      paySnapLatch = null;
      showelsemodal(resp.ms || "Plese try again");
  }
}

// function bookingIdFromResp(resp) {
//   if (resp) {
//     if (resp.x1 != null && resp.x1 !== "") return resp.x1;

//     // var rcL = resp.rc && resp.rc.l;
//     // if (rcL) {
//     //   if (Array.isArray(rcL) && rcL.length && rcL[0].a != null) return rcL[0].a;
//     //   if (rcL instanceof Object) {
//     //     var keys = Object.keys(rcL);
//     //     if (keys.length && rcL[keys[0]].a != null) return rcL[keys[0]].a;
//     //   }
//     // }
//   }
//   return "";
// }

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
var paySnapLatch = null;

// Guest-facing bookings: paid (rb) + unpaid (rc) rows merged once. rb rows are
// the paid/confirmed copies and win when the same stay (check-in e, check-out f,
// status o) also exists in rc.
var myBookingAll = [];

// Merge paid (rb) + unpaid (rc) booking rows into one guest-facing list. rb is
// the paid/confirmed copy; if a booking with the same (e,f,o) triple exists in
// rc it is dropped so a booking that was moved to rb after payment shows only
// once.
function buildMyBookingAll(rbArr, rcArr) {
  var out = [];
  var paidKeys = {};
  function keyOf(n) {
    return (n.e != null ? n.e : "") + "|" +
           (n.f != null ? n.f : "") + "|" +
           (n.o != null ? n.o : "");
  }
  function push(list, tb, dropPaid) {
    for (var i = 0; list && i < list.length; i++) {
      var n = normalizeBookingRow(list[i]);
      if (!n || typeof n !== "object") continue;
      n._tb = tb;
      var key = keyOf(n);
      if (dropPaid && key && paidKeys[key]) continue;
      if (!dropPaid && key) paidKeys[key] = true;
      out.push(n);
    }
  }
  push(rbArr, "rb", false);
  push(rcArr, "rc", true);
  return out;
}

// Stamp the money actually collected against each booking. billStatusOf derives
// the bill's status from it, and a paysheet that ignores the receipts can call a
// fully settled stay "Booking Requested". Receipts are matched on td (the
// booking id), the same way loadBookingReceipts in adminBooking.js reads them.
async function applyReceiptsToBookings(rows) {
  var list = Array.isArray(rows) ? rows : [];
  if (!list.length) return list;
  var byId = {};
  for (var i = 0; i < list.length; i++) {
    if (list[i] && list[i].a != null) byId[String(list[i].a)] = list[i];
  }
  var rRows = [];
  try {
    if (
      typeof dbDexieManager !== "undefined" &&
      typeof dbnm !== "undefined"
    ) {
      rRows = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
    }
  } catch (e) {
    console.warn("Failed to load receipts for bookings:", e);
    rRows = [];
  }
  for (var ri = 0; ri < rRows.length; ri++) {
    var rc = rRows[ri] || {};
    var amt = parseFloat(rc.j) || 0;
    if (amt <= 0) continue;
   var td = receiptBookingId(rc);
   if (!td || !byId[td]) continue;
    byId[td].received = (Number(byId[td].received) || 0) + amt;
  }
  for (var bi = 0; bi < list.length; bi++) {
    var bk = list[bi];
    if (!bk || bk.received == null) bk.received = 0;
  }
  return list;
}

// Receipts a booking row has collected, normalised to a whole rupee. A row may
// carry the field (stamped by applyReceiptsToBookings) or a receipt array that
// the server echoed inline, so both are counted.
function billReceivedOf(bk) {
  if (!bk) return 0;
  var sum = Math.round(Number(bk.received) || 0);
  if (sum <= 0 && Array.isArray(bk.r)) {
    for (var i = 0; i < bk.r.length; i++) {
      sum += Math.round(parseFloat((bk.r[i] || {}).j) || 0);
    }
  }
  return Math.max(0, sum);
}

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
  if (typeof myBookingAll === "undefined" || !myBookingAll || !myBookingAll.length)
    return null;
  var u = typeof my1uzr !== "undefined" && my1uzr ? my1uzr : {};
  var guestId = getMyGuestId();
  var moDigits = String(u.mo || "").replace(/\D/g, "");
  var best = null;
  for (var i = 0; i < myBookingAll.length; i++) {
    var bk = myBookingAll[i];
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
      var dbRc = (await dbDexieManager.getAllRecords(dbnm, "rc")) || [];
      if (dbBk.length && typeof bookingRecords !== "undefined") {
        bookingRecords = dbBk.map(normalizeBookingRow);
      }
      myBookingAll = buildMyBookingAll(dbBk, dbRc);
      await applyReceiptsToBookings(myBookingAll);
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
  // A row names exactly one room; a combination is read back as its separate
  // rows, each with its own room.
  var rmList = (window[my1uzr.worknOnPg].clientConfig &&
    window[my1uzr.worknOnPg].clientConfig.rm) || [];
  var roomId = typeof adRoomId === "function" ? adRoomId(bk.j) : String(bk.j);
  function resolveRoom(id) {
    var found = null;
    if (typeof getRoomById === "function") found = getRoomById(id);
    if (found && typeof mapRmToRoomRecord === "function") found = mapRmToRoomRecord(found);
    if (found) return found;
    for (var ri = 0; ri < rmList.length; ri++) {
      var r = rmList[ri];
      if (r && (String(r.a) === String(id) || String(r.e) === String(id) || String(r.id) === String(id))) {
        return typeof mapRmToRoomRecord === "function" ? mapRmToRoomRecord(r) : r;
      }
    }
    return null;
  }
  var rooms = [];
  var rr = roomId ? resolveRoom(roomId) : null;
  if (rr) rooms.push(rr);
  var room = rooms[0] || null;
  if (!room) {
    room = { name: bk.s || "Hotel Stay", tagline: "", city: "" };
  } else {
    rooms = [room];
  }
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
  var occupancy;
  if (typeof htOccupancyPool === "function") {
    // This row is a single room; htOccupancyPool handles that as a pool of one.
    occupancy = htOccupancyPool(rooms, adults, ages);
  } else if (typeof htEffectiveRoomOccupancy === "function") {
    occupancy = htEffectiveRoomOccupancy(room, adults, ages);
  } else {
    var policy = typeof htRoomOccupancyPolicy === "function"
      ? htRoomOccupancyPolicy(room)
      : {
          capacity: 2,
          maxOccupancy: cfg.maxOccupancy != null ? Number(cfg.maxOccupancy) : 2,
          childAgeFreeMax: cfg.childAgeFreeMax != null ? Number(cfg.childAgeFreeMax) : 8,
        };
    var adultEquivalentChildren = ages.filter(function (age) {
      return Number(age) > policy.childAgeFreeMax;
    }).length;
    var effectiveOccupancy = adults + adultEquivalentChildren;
    // Included slots go to the adults first, then to the over-age children, so
    // whoever is left over is billed at their own rate.
    var includedForAdults = Math.min(adults, policy.capacity);
    var includedForChildren = Math.min(
      adultEquivalentChildren,
      policy.capacity - includedForAdults,
    );
    var extraAdultUnits = adults - includedForAdults;
    occupancy = {
      capacity: policy.capacity,
      maxOccupancy: policy.maxOccupancy,
      childAgeFreeMax: policy.childAgeFreeMax,
      adults: adults,
      children: children,
      childAges: ages,
      adultEquivalentChildren: adultEquivalentChildren,
      paidChildren: adultEquivalentChildren,
      paidChildUnits: adultEquivalentChildren - includedForChildren,
      freeChildren: Math.max(0, children - adultEquivalentChildren),
      effectiveOccupancy: effectiveOccupancy,
      extraAdultUnits: extraAdultUnits,
      extraAdults: extraAdultUnits,
      overflowUnits:
        extraAdultUnits + (adultEquivalentChildren - includedForChildren),
      isOverCapacity: effectiveOccupancy > policy.capacity,
      overMaxOccupancy: effectiveOccupancy > policy.maxOccupancy,
    };
  }
  var paidChildren = occupancy.paidChildren;
  var freeChildren = occupancy.freeChildren;
  var gst = htGstRate();

  var parsedL = parseBookingFacilityL(bk.l);
  var chargesMain = Array.isArray(parsedL.main) ? parsedL.main : [];
  var chargesAdo = Array.isArray(parsedL.ado) ? parsedL.ado : [];
  var chargesAdt = Array.isArray(parsedL.adt) ? parsedL.adt : [];

  var rate1 = null;
  var roomRates = [];
  var rate8 = 0;
  var rate8Count = 0;
  // Per-child a:8 rates are only ever all-equal on the public flow; the admin
  // per-child rows can differ, so track the spread to label the bill honestly.
  var rate8Min = null;
  var rate8Max = null;
  var rate9 = 0;
  var rate9Count = 0;
  var mattressCharge = 0;
  var addonChargeTotal = 0;
  for (var ci = 0; ci < chargesMain.length; ci++) {
    var c = chargesMain[ci] || {};
    var fid = Number(c.a);
    // a combination writes one room-rate line per room.
    if (fid === 1) {
      var rv = Number(c.b) || 0;
      rate1 = rate1 == null ? rv : rate1;
      roomRates.push(rv);
    } else if (fid === 3) mattressCharge += Number(c.b) || 0;
    else if (fid === 8) {
      var r8 = Number(c.b) || 0;
      rate8 += r8;
      rate8Count++;
      if (rate8Min == null || r8 < rate8Min) rate8Min = r8;
      if (rate8Max == null || r8 > rate8Max) rate8Max = r8;
    } else if (fid === 9) {
      rate9 += Number(c.b) || 0;
      rate9Count++;
    }
    else if (fid > 0) addonChargeTotal += Number(c.b) || 0;
  }

  if (!room.pricePerNight && rate1 > 0) {
    room.pricePerNight = rate1;
  }

  // Nights for the whole set: each room bills its own rate.
  var full = 0;
  var dayRates = [];
  var roomNightCosts = [];
  var rateCursor = 0;
  var roomsToBill = rooms.length ? rooms : [room];
  roomsToBill.forEach(function (rr) {
   var dr = buildDayRates(rr, bk.e, nights, parsedL.ac ? true : false);
   var cost = dr.total;
   if (roomsToBill.length > 1 && rateCursor < roomRates.length) {
    var stored = roomRates[rateCursor];
    if (stored > 0) cost = stored * nights;
    rateCursor++;
   }
   full += cost;
   roomNightCosts.push({ room: rr, nights: nights, cost: cost });
   dayRates = dayRates.concat(
    dr.dayRates.map(function (d) {
     return { date: d.date, total: d.total, roomId: rr.id };
    })
   );
  });

  var extraAdults = Math.max(0, Number(occupancy.extraAdultUnits) || 0);
  if (rate9 > 0 && extraAdults === 0) {
    extraAdults = Math.max(1, rate9Count);
  }
  var extraAdultsRate = Number(cfg.extraAdultsCharge) || 0;
  if (rate9Count > 1) {
    extraAdultsRate = rate9 / rate9Count;
  } else if (rate9 > 0 && extraAdultsRate === 0) {
    extraAdultsRate = rate9;
  }
  var adultFee = rate9 > 0
    ? rate9 * (rate9Count > 1 ? 1 : Math.max(1, extraAdults)) * nights
    : extraAdults * extraAdultsRate * nights;
  // Each paid child is its own facility line, so the count comes from the lines
  // themselves rather than from how many over-age children were present.
  var paidChildUnits = rate8Count > 0
    ? rate8Count
    : Math.max(0, Number(occupancy.paidChildUnits) || 0);
  var childFee = rate8 > 0 ? rate8 * nights : 0;
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

  // The saved row names its package in k.f and the package is a PERCENTAGE of
  // the room subtotal (calcTotal: pkgAmount = round(roomSubtotal * pct)), so it
  // is re-priced here exactly as calcTotal did at save time. Without this the
  // Package line never appeared and the printed total was short by it.
  var pkgRow = null;
  var packageCost = 0;
  var pkgId = k && k.f != null ? Number(k.f) || 0 : 0;
  if (pkgId > 0) {
    var pkgRec =
      typeof getPackageById === "function" ? getPackageById(pkgId) : null;
    var pkgPct = Number(pkgRec && pkgRec.g) || 0;
    if (pkgPct !== 0) {
      pkgRow = { name: (pkgRec && pkgRec.e) || "Package" };
      packageCost = Math.round(full * pkgPct);
    }
  }

  var extraTotal = 0;
  for (var exi = 0; exi < extraRows.length; exi++) {
    extraTotal += Number((extraRows[exi] || {}).price) || 0;
  }

  var discountAmt = Math.round(Number(bk.disc) || 0);
  var roomCostFull = full;
  // Package and extras are part of the amount that was charged, so they belong
  // in the taxable base - both used to be dropped here, which is why a rebuilt
  // bill showed fewer lines than the total it printed.
  var subtotal =
    roomCostFull + occupancyFee + packageCost + addonCost + extraTotal;
  var tax = gst > 0 ? Math.round((subtotal * gst) / 100) : 0;

  if (subtotal <= 0 && bk.n) {
    roomCostFull = Number(bk.n) || 0;
    subtotal = roomCostFull;
    tax = 0;
    discountAmt = 0;
  }
  var grandTotal = Math.round(subtotal + tax) - discountAmt;

  // The row's own stored amount (bk.n after normalizeBookingRow) is what the
  // guest was actually charged. A rate that changed after the booking, or a
  // package whose percentage is no longer in the catalog, would otherwise make
  // the bill print a total the counter never took. Print the difference as an
  // explicit adjustment line and let the total match the stored amount. Only a
  // display-schema row is checked: in the send-side payload letters n is the
  // discount, not the amount.
  var isDisplayRow = /^\d{4}-\d{2}-\d{2}/.test(String(bk.e == null ? "" : bk.e).trim());
  var storedTotal = isDisplayRow ? Math.round(Number(bk.n) || 0) : 0;
  if (storedTotal > 0 && grandTotal !== storedTotal) {
    var adjName = pkgId > 0 && packageCost === 0 ? "Package adjustment" : "Rate adjustment";
    extraRows.push({ name: adjName, price: storedTotal - grandTotal });
    grandTotal = storedTotal;
    // Keep the printed GST in step with the adjusted taxable base.
    tax = gst > 0
      ? Math.max(0, Math.round(((grandTotal + discountAmt) * gst) / (100 + gst)))
      : 0;
  }

  return {
    a: bk.a != null ? Number(bk.a) || bk.a : undefined,
    // Every booking id of the same stay, so the bill's own Pay button charges
    // the whole stay rather than just this room.
    bookingIds: stayBookingIds(bk),
    room: room,
    rooms: roomsToBill,
    roomCount: roomsToBill.length,
    isCombo: roomsToBill.length > 1,
    comboKey: roomsToBill.length > 1
      ? publicComboKey(roomsToBill.map(function (rr) { return rr.id; }))
      : "",
    d: bk.d,
    // Money already collected against this stay (stamped by
    // applyReceiptsToBookings), so the bill can tell a settled stay from a
    // requested one instead of always printing "Booking Requested". A total of 0
    // proves nothing, so it never flips the status on its own.
    received: billReceivedOf(bk),
    paid:
      Number(bk.d) === 1 ||
      (billReceivedOf(bk) >= grandTotal && grandTotal > 0),
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
    adultEquivalentChildren: occupancy.adultEquivalentChildren,
    freeChildren: freeChildren,
    chargeable: occupancy.effectiveOccupancy,
    effectiveOccupancy: occupancy.effectiveOccupancy,
    maxOccupancy: occupancy.maxOccupancy,
    totalGuests: adults + children,
    includedGuests: occupancy.capacity,
    extraAdults: extraAdults,
    extraAdultUnits: extraAdults,
    extraAdultsRate: extraAdultsRate,
    adultFee: adultFee,
    paidChildUnits: paidChildUnits,
    childFee: childFee,
    // a:8 is stored per paid child unit, so keep a per-unit rate here for the
    // summary row and the rebuilt guest bill. childFee stays the line total.
    childRate: rate8Count > 0 ? rate8 / rate8Count : 0,
    childRateSum: rate8,
    childRateUniform: rate8Count > 0 && rate8Min === rate8Max,
    occupancy: occupancy,
    roomCostFull: roomCostFull,
    roomNightCosts: roomNightCosts,
    roomRateIncl: roomCostFull > 0 && nights ? Math.round(roomCostFull / nights) : 0,
    discountAmt: discountAmt,
    // Only the amount is stored (bk.n) - the % the bill prints is implied by it.
    discountPercent:
      discountAmt > 0 && subtotal + tax > 0
        ? Math.round((discountAmt / (subtotal + tax)) * 100 * 100) / 100
        : 0,
    occupancyFee: occupancyFee,
    mattressCharge: mattressCharge,
    dayRates: dayRates,
    package: pkgRow,
    packageCost: packageCost,
    addonList: addonList,
    addonCost: addonCost,
    extraRows: extraRows,
    extraCharges: extraTotal,
    extraParticular: extraRows
      .map(function (x) {
        return x.name;
      })
      .join(", "),
    subtotal: subtotal,
    tax: tax,
    grandTotal: grandTotal,
  };
}

function getMyBookings() {
  var list = [];
  if (typeof myBookingAll === "undefined" || !myBookingAll) return list;
  var u = typeof my1uzr !== "undefined" && my1uzr ? my1uzr : {};
  var guestId = getMyGuestId();
  var moDigits = String(u.mo || "").replace(/\D/g, "");
  for (var i = 0; i < myBookingAll.length; i++) {
    var bk = myBookingAll[i];
    if (!bk || Number(bk.o) === 4) continue;
    var mine = false;
    if (guestId && bk.oc != null) mine = String(bk.oc) === guestId;
    if (!mine && moDigits) {
      var hDigits = String(bk.h || "").replace(/\D/g, "");
      mine = hDigits.length >= 10 && hDigits.slice(-10) === moDigits.slice(-10);
    }
    if (mine) list.push(bk);
  }
  list.sort(function (x, y) {
    var vx =
      x && x.b != null && x.b !== ""
        ? Date.parse(String(x.b)) || Number(x.b) || 0
        : 0;
    var vy =
      y && y.b != null && y.b !== ""
        ? Date.parse(String(y.b)) || Number(y.b) || 0
        : 0;
    return vy - vx;
  });
  return list;
}

function getMyBookingById(id) {
  if (typeof myBookingAll === "undefined" || !myBookingAll) return null;
  var key = String(id == null ? "" : id);
  var tb = "";
  var sep = key.indexOf(":");
  if (sep > -1) {
    tb = key.slice(0, sep);
    key = key.slice(sep + 1);
  }
  for (var i = 0; i < myBookingAll.length; i++) {
    var bk = myBookingAll[i];
    if (bk && String(bk.a) === key && (!tb || bk._tb === tb)) return bk;
  }
  return null;
}

function myBookingsStatus(bk) {
  if (!bk) return { label: "Booking Requested", ok: false, paid: false };
  if (Number(bk.o) === 4)
    return { label: "Cancelled", ok: false, paid: false, cancelled: true };
  if (Number(bk.d) === 1)
    return { label: "Booking Confirmed", ok: true, paid: true };
  return { label: "Booking Requested", ok: false, paid: false };
}

function myBookingsGuest() {
  var id = typeof getMyGuestId === "function" ? getMyGuestId() : "";
  var name = "";
  if (id && typeof guestRecords !== "undefined" && guestRecords) {
    for (var i = 0; i < guestRecords.length; i++) {
      var c = guestRecords[i] || {};
      if (String(c.a) === id) {
        name = c.h != null ? String(c.h) : "";
        break;
      }
    }
  }
  return { id: id, name: name };
}

function myBkDateRange(e, f) {
  var s = String(e || "").slice(0, 10);
  var o = String(f || "").slice(0, 10);
  if (s && o) return s + " \u2192 " + o;
  return s || o || "-";
}

function myBookingsCardHtml(bk) {
  var snap =
    typeof bookingSnapFromRecord === "function"
      ? bookingSnapFromRecord(bk)
      : null;
  var roomName =
    snap && snap.room && snap.room.name
      ? snap.room.name
      : bk.s
        ? String(bk.s)
        : "Hotel Stay";
  var nights = (snap && snap.nights) || Number(bk.m) || 1;
  var total =
    snap && snap.grandTotal != null ? snap.grandTotal : Number(bk.n) || 0;
  var guests = snap ? (snap.adults || 0) + (snap.children || 0) : "";
  var st = myBookingsStatus(bk);
  var ref = bk.p != null && bk.p !== "" ? bk.p : bk.a;
  var payHtml = st.paid
    ? ""
    : '<button class="ht-btn ht-btn-ember ht-mybook-pay" type="button" onclick="payMyBookingById(\'' +
      escAttr((bk._tb ? bk._tb + ":" : "") + bk.a) +
      '\')">' +
      '<i class="fa-solid fa-credit-card"></i> Pay</button>';
  var metaParts = [
    escHtml(myBkDateRange(bk.e, bk.f)),
    nights + (nights > 1 ? " nights" : " night"),
    guests ? guests + (guests > 1 ? " guests" : " guest") : "",
    "Booking #" + escHtml(String(ref)),
  ].filter(Boolean).join(" \u00b7 ");
  return (
    '<div class="ht-mybook-card">' +
    '<div class="mbc-top">' +
    '<div class="mbc-room"><i class="fa-solid fa-bed"></i> ' +
    escHtml(roomName) +
    "</div>" +
    '<div class="mbc-total"><span class="lb">Total</span><span class="vl">' +
    fmtMoney(total) +
    "</span></div>" +
    "</div>" +
    '<div class="mbc-sub">' +
    '<div class="mbc-meta">' +
    metaParts +
    "</div>" +
    '<div class="mbc-tools">' +
    payHtml +
    '<span class="mbc-badge' +
    (st.ok ? " ok" : "") +
    '"><i class="fa-solid ' +
    (st.ok ? "fa-circle-check" : "fa-clock") +
    '"></i> ' +
    escHtml(st.label) +
    "</span>" +
    '<button class="ht-btn ht-btn-gold ht-mybook-print" type="button" onclick="printMyBookingById(\'' +
    escAttr((bk._tb ? bk._tb + ":" : "") + bk.a) +
    '\')">' +
    '<i class="fa-solid fa-print"></i> Print</button>' +
    "</div>" +
    "</div>" +
    "</div>"
  );
}

function showMyBookingsModal() {
  if (!el("modalRoot")) return;
  var list = getMyBookings();
  var g = myBookingsGuest();
  var body = "";
  if (list.length) {
    var cards = "";
    for (var i = 0; i < list.length; i++)
      cards += myBookingsCardHtml(list[i]);
    body = '<div class="ht-mybook-list">' + cards + "</div>";
  } else {
    body =
      '<div class="ht-mybook-empty">' +
      '<i class="fa-solid fa-calendar-xmark"></i>' +
      "No active bookings found. Book a room to get started." +
      "</div>";
  }
  el("modalRoot").innerHTML =
    '<div class="ht-bill-overlay open" id="myBookingsOverlay" onclick="closeMyBookingsModal()">' +
    '<div class="ht-bill-stage" onclick="event.stopPropagation()">' +
    '<div class="ht-bill-scroll ht-mybook-scroll">' +
    '<div class="ht-mybook-head">' +
    '<div class="ht-bill-title"><i class="fa-solid fa-book"></i> My Bookings</div>' +
    '<div class="ht-mybook-guest">' +
    (g.name
      ? "Guest: <b>" + escHtml(g.name) + "</b> \u00b7 "
      : "") +
    "Guest ID <b>#" +
    escHtml(g.id || "-") +
    "</b></div>" +
    "</div>" +
    body +
    "</div>" +
    '<div class="ht-bill-actions">' +
    '<button class="ht-btn ht-btn-gold" onclick="closeMyBookingsModal()">' +
    '<i class="fa-solid fa-check"></i> Done</button>' +
    "</div>" +
    "</div></div>";
  document.body.style.overflow = "hidden";
}

function closeMyBookingsModal() {
  var ov = el("myBookingsOverlay");
  if (ov) ov.classList.remove("open");
  document.body.style.overflow = "";
  window.clearTimeout(window.__myBkCloseT);
  window.__myBkCloseT = window.setTimeout(function () {
    if (el("myBookingsOverlay") && el("modalRoot")) el("modalRoot").innerHTML = "";
  }, 250);
}

async function printBookingBill(bk) {
  closeMyBookingsModal();
  if (typeof showBill === "function") {
    showBill(ensureSnapGst(bookingSnapFromRecord(bk)), function () {
      if (typeof showHome === "function") showHome();
    });
  } else {
    console.log("Print unavailable.");
  }
}

window.printMyBookingById = async function (id) {
  var bk = getMyBookingById(id);
  if (!bk) {
    showMessageModal("Info", "Booking not found.", false);
    return;
  }
  await printBookingBill(bk);
};

// A combination is one stay held as one row per room, so it arrives here as a
// joined id list ("51_52_53", possibly with a trailing separator, plus the
// "-<timestamp>" tail the payment writers append). Reduce it to the lookup keys
// it carries; parseInt drops that tail, so the last id comes out clean. An
// optional table prefix ("rc:51") is kept, since that is how the unpaid rows are
// addressed.
function ppStayRoomIds(x1) {
  var raw = Array.isArray(x1) ? x1.map(String) : String(x1 == null ? "" : x1).split("_");
  var out = [];
  for (var i = 0; i < raw.length; i++) {
    var seg = String(raw[i]).trim();
    var pre = "";
    var colon = seg.indexOf(":");
    if (colon > -1) {
      pre = seg.slice(0, colon + 1);
      seg = seg.slice(colon + 1);
    }
    var id = parseInt(seg, 10);
    if (!isFinite(id) || id <= 0) continue;
    var key = pre + id;
    if (out.indexOf(key) === -1) out.push(key);
  }
  return out;
}

// Only one bill overlay exists at a time (renderBill overwrites modalRoot), so
// several bills cannot simply be shown one after another - the last would win.
// Each bill advances the queue from its own onClose, which closeBill fires when
// the guest dismisses it, so the stays are read one at a time.
function printBookingBillsSequentially(idList, onAllDone) {
  var ids = ppStayRoomIds(idList);
  var done = typeof onAllDone === "function" ? onAllDone : function () {
    if (typeof showHome === "function") showHome();
  };
  if (!ids.length) {
    done();
    return [];
  }
  closeMyBookingsModal();
  var i = 0;
  function next() {
    if (i >= ids.length) {
      done();
      return;
    }
    var bk = getMyBookingById(ids[i++]);
    if (!bk) {
      // Report the id that is missing, then carry on so the rest still print.
      showMessageModal(
        "Info",
        "Booking not found.",
        false,
        next,
      );
      return;
    }
    showBill(ensureSnapGst(bookingSnapFromRecord(bk)), next);
  }
  if (typeof showBill !== "function") {
    console.log("Print unavailable.");
    return ids;
  }
  next();
  return ids;
}
window.printBookingBillsSequentially = printBookingBillsSequentially;

window.payMyBookingById = async function (id) {
  var bk = getMyBookingById(id);
  if (!bk) {
    showMessageModal("Info", "Booking not found.", false);
    return;
  }
  if (Number(bk.d) === 1) {
    showelsemodal("This booking is already confirmed & paid.");
    return;
  }
  // A combination is one row per room but a single stay, and one PhonePe charge
  // settles all of it, so any row's Pay button sends every id of the stay.
  var ids = stayBookingIds(bk);
  if (!ids.length) ids = [String(bk.a)];
  closeMyBookingsModal();
  var snap = ensureSnapGst(bookingSnapFromRecord(bk));
  snap.bookingIds = ids;
  await startPhonePePayment(snap, ids.join(PP_BOOKING_ID_SEP));
};

window.printMyBooking = async function (opt, item) {
  if (!window.__pubBookingsLoaded) {
    try {
      await ensurePublicBookingsLoaded();
    } catch (e) {
      console.warn("Failed to preload bookings:", e);
    }
  }
  if (opt === false) {
    var bk = item || getMyActiveBooking();
    if (!bk) {
      showMessageModal("Info", "No active booking found.", false);
      return;
    }
    if (typeof showBill === "function") {
      showBill(ensureSnapGst(bookingSnapFromRecord(normalizeBookingRow(bk))), function () {
        if (typeof showHome === "function") showHome();
      });
    } else {
      console.log("Print unavailable.");
    }
    return;
  }
  showMyBookingsModal();
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
  var lim = roomGuestLimits(room);
  if (adults > lim.maxAdults || children > lim.maxChildren) {
    return (
      "Guest limit is " +
      lim.maxAdults +
      " adults and " +
      lim.maxChildren +
      " children. Occupancy beyond the room's included capacity is charged as extra occupancy."
    );
  }
  return "";
}

async function finishPreview() {
  var msg = validateStay();
  if (msg) {
    showMessageModal("Check Your Stay", msg, true);
    return;
  }
  var s =
    (typeof lastSnap !== "undefined" && lastSnap) ||
    (typeof calcBooking === "function" ? calcBooking() : null);
  if (!s) return;
  // A combination is several rooms, so every one of them has to be free for
  // the stay, not just the one the details view happens to point at.
  if (
    await publicSelectedRoomsHaveBookingOverlap(
      getBookingRooms(s),
      checkIn,
      checkOut,
    )
  ) {
    showRoomBookedConflictMessage();
    return;
  }
  paySnapLatch = s;
  await sendBookingPayload(s);
}

/* ============================================================
   PHONEPE PAYMENT (front-end)
   ------------------------------------------------------------
   1. POST the grand total to phonepe/request.php.
   2. Redirect the browser to the PhonePe checkout page.
   On return the app lands on ?pp=OK|FAIL|ERR&oid=... and the
   handlePhonePeReturn() below prints the confirmed booking
   (the server verifies the order via phonepe/redirect.php and
   showPhonePePostData() in rm.js submits it as x1).

   A combination is stored as one booking row per room, so paying
   it sends every id of the stay in one bookingId, joined with
   PP_BOOKING_ID_SEP. The uniqueness suffix stays a "-<timestamp>"
   tail, which the server strips before splitting the ids.
   ============================================================ */
var PP_BOOKING_ID_SEP = "_";

// Every booking id that belongs to the same stay as bk. A combination produces
// one row per room and the rows only share a booker (oc) and the stay dates
// (e / f), so those three fields are what tie a set back together.
function stayBookingIds(bk) {
  var ids = [];
  if (!bk) return ids;
  var all =
   typeof myBookingAll !== "undefined" && myBookingAll ? myBookingAll : [];
  for (var i = 0; i < all.length; i++) {
    var r = all[i];
    if (!r || r.a == null) continue;
    if (String(r.oc) !== String(bk.oc)) continue;
    if (String(r.e || "") !== String(bk.e || "")) continue;
    if (String(r.f || "") !== String(bk.f || "")) continue;
    if (typeof isBookingCancelled === "function" && isBookingCancelled(r)) continue;
    var rid = String(r.a);
    if (ids.indexOf(rid) === -1) ids.push(rid);
  }
  if (!ids.length && bk.a != null) ids.push(String(bk.a));
  // Numeric order so the set is always assembled the same way, and the
  // timestamp lands on the same id for a given stay.
  ids.sort(function (x, y) {
    return (parseInt(x, 10) || 0) - (parseInt(y, 10) || 0);
  });
  return ids;
}

// Every snapshot reaches the bill with its GST rate already resolved, so the
// bill's own fallback never has to guess.
function ensureSnapGst(s) {
  if (s && s.gst == null) s.gst = htGstRate();
  return s;
}

async function startPhonePePayment(snapArg, orderIdArg) {
  var orderId = orderIdArg != null ? String(orderIdArg) : "";
  var snap = snapArg;
  if (snapArg != null && (typeof snapArg === "string" || typeof snapArg === "number")) {
    if (!orderId) orderId = String(snapArg);
    snap = null;
  }
  // The snapshot wins: it carries the whole set for the stay, so the bill's own
  // Pay button sends every id without booking.js having to be involved.
  var idList = [];
  if (snap && Array.isArray(snap.bookingIds) && snap.bookingIds.length) {
    idList = snap.bookingIds
      .map(function (v) {
        return String(v);
      })
      .filter(function (v) {
        return v !== "";
      });
  }
  if (!idList.length && orderId) {
    idList = orderId
      .split(PP_BOOKING_ID_SEP)
      .map(function (v) {
        return v.trim();
      })
      .filter(function (v) {
        return v !== "";
      });
  }
  if (!idList.length && snap) {
    var single =
     snap.a != null
      ? String(snap.a)
      : snap.id != null
        ? String(snap.id)
        : snap.bookingId != null
          ? String(snap.bookingId)
          : snap.orderId != null
            ? String(snap.orderId)
            : "";
    if (single) idList = [single];
  }
  idList = idList.filter(function (v, i) {
    return idList.indexOf(v) === i;
  });
  snap = snap || lastSnap || calcBooking();
  if (!snap) return;
  my1PageLoader(true);
  if(window[my1uzr.worknOnPg].clientConfig?.cust_da_const?.paymentGatewayIntegrated == 1){
  try {
    var amount =
      snap.paymentPhonePayGT != null
        ? Number(snap.paymentPhonePayGT)
        : snap.grandTotal;
    var paymentBookingId = idList.length
      ? idList.join(PP_BOOKING_ID_SEP) + "-" + Date.now()
      : "";
    var resp = await fetch("phonepe/request.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentBookingId
        ? { amountRupees: amount, bookingId: paymentBookingId }
        : { amountRupees: amount }),
    });
    var data = await resp.json();
    my1PageLoader(false);

    if (!data.orderId || !data.redirectUrl) {
      showelsemodal(data.error || "Payment could not be started. Please try again.", true);
      return;
    }

    window.location.href = data.redirectUrl;
    
  } catch (e) {
    my1PageLoader(false);
    showelsemodal("Payment service unavailable. Please try again.", true);
  }
  }else{
    my1PageLoader(false);
    var ok = await showConfirmModal(
      "Notice: " + window[my1uzr.worknOnPg].clientConfig.noPaymentGatewayMsg,
    );
    //if (!ok) return false;
    // Without a gateway the unpaid rows are printed instead. A combination has
    // one row per room, so print them all, each as its own booking.
    var printIds = idList.length ? idList : orderId ? [orderId] : [];
    setTimeout(function () {
        printBookingBillsSequentially(
          printIds.map(function (v) {
            return "rc:" + v;
          }),
        );
      }, 1000);
  }
  return false;
}

function handlePhonePeReturn() {
  var params = new URLSearchParams(window.location.search);
  var pp = params.get("pp");
  if (!pp) return;

  history.replaceState({}, "", window.location.pathname);

  if (pp === "OK") {
    printMyBooking(false);
  } else {
    showMessageModal(
      "Payment Pending",
      pp === "ERR"
        ? "We could not verify your payment. Please check your bookings later or contact the hotel."
        : "Payment was not completed. Please try again.",
      true,
    );
  }
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handlePhonePeReturn);
  } else {
    handlePhonePeReturn();
  }
}

window.function2runAfter_O_Login = function (result) {
  if (result && result.xtra && result.xtra.fn) return;
  if (pendingPay) {
    pendingPay = false;
    sendBookingPayload();
    paySnapLatch = null;
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