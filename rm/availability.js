// availability.js - Reusable booking logic (hotel domain)
// Used by rooms.js, booking.js and home.js — never renders pages.

function adParseDate(d) {
  return new Date(d + "T00:00:00");
}

function calcNights(checkin, checkout) {
  if (!checkin || !checkout) return 0;
  var a = adParseDate(checkin);
  var b = adParseDate(checkout);
  var diff = Math.round((b - a) / 86400000);
  return diff > 0 ? diff : 0;
}

function getRoomById(id) {
  for (var i = 0; i < adminRoomRecords.length; i++) {
    var r = adminRoomRecords[i];
    if (String(r.a) === String(id) || String(r.e) === String(id)) return r;
  }
  return null;
}

function isBookingCancelled(bk) {
  return Number(bk.o) === 4 || Number(bk.oc) === 4;
}

// A booking's room reference is the payload's `e` field and is a single room
// id string: a combination is stored as one row per room, so a row never holds
// more than one room. Normalise to a non-empty id string, or "" when absent.
function adRoomId(value) {
  if (value == null) return "";
  // Rows saved while the field was briefly wrapped in a one-element array still
  // coerce to the same id, so those keep resolving without a list of rooms.
  var v = Array.isArray(value) ? value[0] : value;
  if (v == null || v === "") return "";
  return String(v);
}

function getOverlapCount(roomId, checkin, checkout, excludeBookingId) {
  var count = 0;
  var wanted = adRoomId(roomId);
  for (var i = 0; i < bookingRecords.length; i++) {
    var bk = bookingRecords[i];
    // One room per row, so a room is held when the row names it.
    if (!wanted || adRoomId(bk.j) !== wanted) continue;
    if (isBookingCancelled(bk)) continue; // cancelled bookings do not block
    if (!bk.e || !bk.f) continue;
    // Update mode: the booking being edited must not clash with its own dates.
    if (
      excludeBookingId &&
      String(bk.a).trim() === String(excludeBookingId).trim()
    )
      continue;
    if (bk.e < checkout && checkin < bk.f) {
      count++;
      if (excludeBookingId) {
        console.warn(
          "[CLASH] room:",
          bk.j,
          bk.e,
          "->",
          bk.f,
          "blocked by booking id",
          bk.a,
          "| excluded id",
          excludeBookingId,
          "| requested",
          checkin,
          checkout,
        );
      }
    }
  }
  return count;
}

function getRoomAvailability(room, checkin, checkout, excludeBookingId) {
  if (!room) return false;
  // Only Active (1) rooms can be booked. Status 2=maintenance,
  // 127=deleted are admin-controlled and never bookable here.
  // var st = room.d != null ? room.d : room.k;
  // if (String(st) !== "1") return false;
  var limit = 1; // one physical room per room number
  var roomId = room.a != null ? room.a : room.e; // new-shape rooms have e only
  return getOverlapCount(roomId, checkin, checkout, excludeBookingId) < limit;
}

function getArrivalsOnDate(dateStr) {
  return bookingRecords.filter(function (bk) {
    return bk.e === dateStr && !isBookingCancelled(bk);
  });
}

function getDeparturesOnDate(dateStr) {
  return bookingRecords.filter(function (bk) {
    return bk.f === dateStr && !isBookingCancelled(bk);
  });
}

function getActiveBookingsOnDate(dateStr) {
  return bookingRecords.filter(function (bk) {
    if (isBookingCancelled(bk)) return false;
    if (!bk.e || !bk.f) return false;
    return bk.e <= dateStr && dateStr < bk.f;
  });
}

// Age rules: 0-4 free, 5-11 half, 12+ full
function getAgeRate(age) {
  if (age < 5) return 0;
  if (age <= 11) return 0.5;
  return 1;
}

function calcTotal(opts) {
  var nights = opts.nights || 0;
  var roomRate = opts.roomRate || 0;
  var childAges = opts.childAges || [];
  var pkgAdj = opts.packageAdj || 0;
  var addons = opts.addons || [];
  var extraCharges = opts.extraCharges || 0; // Extra Particulars amount (y.c)

  var roomSubtotal = 0;
  if (opts.roomRates) {
    for (var ri = 0; ri < opts.roomRates.length; ri++) {
      roomSubtotal += Number(opts.roomRates[ri]) || 0;
    }
  } else {
    roomSubtotal = nights * roomRate;
  }

  // Child pricing follows the hotel policy (matches booking.js calcBooking):
  // children up to childAgeFreeMax are free; older children pay a flat
  // childRate per night. Without childRate, falls back to getAgeRate as a
  // percentage of the room rate for legacy callers.
  //
  // Callers that need per-room pooling (a combo booking) or the adults-first
  // allocation pass a precomputed `occupancy` block instead of the flat
  // adults/includedAdults pair; see rm.js htOccupancyPool. It decides how many
  // extra-adult units and how many paid-child units a set of rooms produces.
  var occ = opts.occupancy && typeof opts.occupancy === "object" ? opts.occupancy : null;
  var childAdj = 0;
  var paidChildren = 0;
  var adultEquivalentChildren = 0;
  var freeChildren = 0;
  var extraAdults = 0;
  var freeMax =
    opts.childAgeFreeMax != null
      ? opts.childAgeFreeMax
      : typeof window[my1uzr.worknOnPg].clientConfig?.HT_CFG !== "undefined"
        ? window[my1uzr.worknOnPg].clientConfig?.HT_CFG.childAgeFreeMax
        : 8;
  if (occ) {
    // occ separates the two counts that used to be conflated: paidChildren is
    // every over-age child, paidChildUnits only those pushed past the pooled
    // normal occupancy. Only the latter is billed, so only the latter is a
    // "paid" child; free children come straight from the pool as well.
    adultEquivalentChildren = Math.max(0, Number(occ.paidChildren) || 0);
    paidChildren = Math.max(0, Number(occ.paidChildUnits) || 0);
    freeChildren = Math.max(
      0,
      occ.freeChildren != null
        ? Number(occ.freeChildren) || 0
        : childAges.length - adultEquivalentChildren,
    );
    extraAdults = Math.max(0, Number(occ.extraAdultUnits) || 0);
    childAdj = paidChildren * (Number(opts.childRate) || 0) * nights;
  } else if (opts.childRate != null) {
    var childRates = opts.childRates || [];
    for (var i = 0; i < childAges.length; i++) {
      if (childAges[i] > freeMax) {
        paidChildren++;
        // Per-child editable per-night rates take priority when supplied;
        // otherwise fall back to the flat config childRate.
        var cr =
          childRates[i] != null ? parseFloat(childRates[i]) || 0 : opts.childRate;
        childAdj += cr * nights;
      }
    }
    adultEquivalentChildren = paidChildren;
    freeChildren = Math.max(0, childAges.length - paidChildren);
  } else {
    for (var c = 0; c < childAges.length; c++) {
      if (childAges[c] > freeMax) paidChildren++;
      childAdj += nights * roomRate * getAgeRate(childAges[c]);
    }
    adultEquivalentChildren = paidChildren;
    freeChildren = Math.max(0, childAges.length - paidChildren);
  }

  // Per-child rates (the admin Booking Entry rows) are the operator's decision:
  // every over-age child is billed its own rate per night, and a rate of 0 means
  // the child is not charged - which is how a child the pool seats inside the
  // included capacity stays free, and how the operator waives one deliberately.
  // A rate list is therefore honoured as soon as it is supplied; when none is
  // supplied the pool's own split above stands, so the public booking flow
  // prices exactly as it did before.
  var perChildRates = Array.isArray(opts.childRates) ? opts.childRates : null;
  // A supplied list is the operator's decision, so it prices every over-age
  // child - including one explicitly rated 0, which means "do not charge this
  // child". Presence of the list, not a non-zero value in it, is what makes it
  // authoritative; that is why this is kept separate from childRatesActive
  // below, which only asks whether anything is actually being charged.
  var childRatesAuthoritative = !!(perChildRates && perChildRates.length);
  var childRateSum = 0;
  var rateCharged = 0;
  var rateFirst = null;
  var rateUniform = true;
  if (childRatesAuthoritative) {
    for (var pr = 0; pr < childAges.length; pr++) {
      if (childAges[pr] > freeMax) {
        var prc = Math.max(0, parseFloat(perChildRates[pr]) || 0);
        if (prc > 0) {
          rateCharged++;
          childRateSum += prc;
          // Every charged child is priced alike, so the bill can keep printing
          // one "N x rate" figure instead of a per-night total.
          if (rateFirst == null) rateFirst = prc;
          else if (prc !== rateFirst) rateUniform = false;
        }
      }
    }
  }
  // Drives the bill wording only: a flat config rate is printed unless at least
  // one child carries a rate. An all-zero list still charges nobody, so it must
  // not be announced as a per-child rate.
  var childRatesActive = rateCharged > 0;
  if (childRatesAuthoritative) {
    paidChildren = rateCharged;
    childAdj = childRateSum * nights;
  }

  // Extra adults over the room's included guests pay a flat rate per night.
  var includedAdults =
    occ && occ.capacity != null
      ? occ.capacity
      : opts.includedAdults != null
        ? opts.includedAdults
        : 2;
  if (!occ) extraAdults = Math.max(0, (opts.adults || 0) - includedAdults);
  var extraGuestRate =
    opts.extraGuestRate != null
      ? opts.extraGuestRate
      : window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.extraAdultsCharge || 0;
  var adultAdj = extraAdults * extraGuestRate * nights;

  var pkgAmount = Math.round(roomSubtotal * pkgAdj);
  var addonsTotal = 0;
  for (var j = 0; j < addons.length; j++) {
    addonsTotal += addons[j].price || 0;
  }
  // All prices are GST-exclusive: the subtotal below is the taxable base,
  // GST is charged on top and the total is what the customer pays. The rate
  // comes from rm.da's "gst" (clientConfig.gst) unless a caller overrides it,
  // which is what the per-room splitter does to keep every row on one rate.
  var gstRate = opts.gst != null ? Number(opts.gst) || 0 : htGstRate();
  var subtotal =
    roomSubtotal + childAdj + adultAdj + pkgAmount + addonsTotal + extraCharges;
  var tax = gstRate > 0 ? Math.round((subtotal * gstRate) / 100) : 0;
  var total = subtotal + tax;

  return {
    nights: nights,
    roomSubtotal: Math.round(roomSubtotal),
    childAdj: Math.round(childAdj),
    paidChildren: occ ? adultEquivalentChildren : paidChildren,
    paidChildUnits: occ ? paidChildren : null,
    freeChildren: freeChildren,
    childRate: opts.childRate || 0,
    childRateSum: childRateSum,
    childRatesActive: childRatesActive,
    // True when the flat config rate applies (no per-child rates) or every
    // charged child happens to share one rate.
    childRateUniform: !childRatesActive || rateUniform,
    extraAdults: extraAdults,
    extraAdultUnits: occ ? extraAdults : null,
    includedAdults: includedAdults,
    capacity: occ && occ.capacity != null ? occ.capacity : null,
    maxOccupancy: occ && occ.maxOccupancy != null ? occ.maxOccupancy : null,
    // Whether the party overruns the max occupancy comes from the pool, not
    // from re-deriving it here (which would miss in-capacity paid children).
    overMaxOccupancy: occ
      ? occ.overMaxOccupancy != null
        ? !!occ.overMaxOccupancy
        : (Number(occ.effectiveOccupancy) || 0) >
          (Number(occ.maxOccupancy) || 0)
      : false,
    adultAdj: Math.round(adultAdj),
    extraGuestRate: extraGuestRate,
    pkgAmount: pkgAmount,
    addonsTotal: Math.round(addonsTotal),
    extraCharges: Math.round(extraCharges),
    subtotal: Math.round(subtotal),
    gst: gstRate,
    tax: Math.round(tax),
    total: Math.round(total),
  };
}

console.log("📐 availability.js loaded");