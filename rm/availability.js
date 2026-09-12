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

function getOverlapCount(roomId, checkin, checkout, excludeBookingId) {
  var count = 0;
  for (var i = 0; i < bookingRecords.length; i++) {
    var bk = bookingRecords[i];
    if (String(bk.j) !== String(roomId)) continue;
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
          String(bk.j),
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

// SINGLE GST SOURCE: change this one value when the government rate changes.
// Used by availability.js (calcTotal), the booking form label, the booking
// payload (z.gst) and the bill generator (modules/bill.js).
var htGST = 5;

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
  var childAdj = 0;
  var paidChildren = 0;
  var freeMax =
    opts.childAgeFreeMax != null
      ? opts.childAgeFreeMax
      : typeof window[my1uzr.worknOnPg].clientConfig?.HT_CFG !== "undefined"
        ? window[my1uzr.worknOnPg].clientConfig?.HT_CFG.childAgeFreeMax
        : 8;
  if (opts.childRate != null) {
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
  } else {
    for (var c = 0; c < childAges.length; c++) {
      if (childAges[c] > freeMax) paidChildren++;
      childAdj += nights * roomRate * getAgeRate(childAges[c]);
    }
  }

  // Extra adults over the room's included guests pay a flat rate per night.
  var includedAdults = opts.includedAdults != null ? opts.includedAdults : 2;
  var extraAdults = Math.max(0, (opts.adults || 0) - includedAdults);
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
  // GST is charged on top and the total is what the customer pays.
  var subtotal =
    roomSubtotal + childAdj + adultAdj + pkgAmount + addonsTotal + extraCharges;
  var tax = htGST > 0 ? Math.round((subtotal * htGST) / 100) : 0;
  var total = subtotal + tax;

  return {
    nights: nights,
    roomSubtotal: Math.round(roomSubtotal),
    childAdj: Math.round(childAdj),
    paidChildren: paidChildren,
    freeChildren: Math.max(0, childAges.length - paidChildren),
    childRate: opts.childRate || 0,
    extraAdults: extraAdults,
    adultAdj: Math.round(adultAdj),
    extraGuestRate: extraGuestRate,
    pkgAmount: pkgAmount,
    addonsTotal: Math.round(addonsTotal),
    extraCharges: Math.round(extraCharges),
    subtotal: Math.round(subtotal),
    tax: tax,
    total: Math.round(total),
  };
}

console.log("📐 availability.js loaded");
