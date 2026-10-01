/* ============================================================
   HT - billCombo.js
   ------------------------------------------------------------
   Loaded after bill.js. bill.js looks the guest row up by
   comparing the booking row's room field against a single room
   id with String(rb.e) !== roomId. That only works when the bill
   is opened for the one room a row names, so a bill covering a
   combination falls back to "guest details not found".

   So this still collects every room id in the bill context (a
   combination spans several rooms) and matches the saved row
   against any of them. Each row itself names a single room.

   Only resolveBookerInfo is replaced. Everything else - the bill
   layout, PDF export, status - stays with bill.js, which already
   renders a combination through summaryHtml.
   ============================================================ */

(function () {
  // Captured before the replacement below is installed, so a booking only the
  // original could resolve (for example through the logged-in guest's mobile)
  // still works.
  var orig =
    typeof window.resolveBookerInfo === "function" ? window.resolveBookerInfo : null;
  window.billOrigResolveBookerInfo = orig;

  function roomIdsOf(s) {
    if (!s) return [];
    var ids = [];
    function push(rr) {
      if (!rr) return;
      var rid =
        rr.a != null
          ? rr.a
          : rr.no != null
            ? rr.no
            : rr.e != null
              ? rr.e
              : rr.id;
      if (rid == null) return;
      var str =
        typeof adRoomId === "function" ? adRoomId(rid) : String(rid);
      if (str !== "" && ids.indexOf(str) === -1) ids.push(str);
    }
    if (Array.isArray(s.rooms)) s.rooms.forEach(push);
    if (s.room) push(s.room);
    if (!ids.length && s.roomId != null) {
      var one =
        typeof adRoomId === "function" ? adRoomId(s.roomId) : String(s.roomId);
      if (one !== "") ids.push(one);
    }
    return ids;
  }

  function canDb() {
    return (
      typeof dbDexieManager !== "undefined" &&
      typeof dbnm !== "undefined" &&
      typeof dbDexieManager.getAllRecords === "function"
    );
  }

  window.resolveBookerInfo = async function (s) {
    if (!canDb()) return typeof orig === "function" ? orig(s) : null;
    var roomIds = roomIdsOf(s);
    var inD = s && s.checkin != null ? String(s.checkin) : "";
    var outD = s && s.checkout != null ? String(s.checkout) : "";

    // Unpaid bookings live in rc (same shape as rb); rb is the paid copy and is
    // searched first.
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
        if (inD && String(rb.g) !== inD) continue;
        if (outD && String(rb.h) !== outD) continue;
        if (roomIds.length) {
          var echoed =
            typeof adRoomId === "function" ? adRoomId(rb.e) : String(rb.e);
          if (roomIds.indexOf(echoed) === -1) continue;
        }
        var bid = parseInt(rb.a, 10) || 0;
        if (bid > bestId) {
          bestId = bid;
          best = rb;
        }
      }
    }
    if (!best || best.o == null) {
      return typeof orig === "function" ? orig(s) : null;
    }

    var gcList = null;
    try {
      gcList = await dbDexieManager.getAllRecords(dbnm, "c");
    } catch (e) {
      gcList = null;
    }
    if (!gcList) return null;
    for (var ci = 0; ci < gcList.length; ci++) {
      var gc = gcList[ci] || {};
      if (gc.a != null && String(gc.a) === String(best.o)) {
        return {
          mobile:
            typeof billMobileText === "function"
              ? billMobileText(gc.e)
              : String(gc.e || ""),
          name: gc.h != null ? String(gc.h) : "",
          address: gc.m != null ? String(gc.m) : "",
          email: typeof billC1Email === "function" ? billC1Email(gc) : "",
        };
      }
    }
    return null;
  };
})();

console.log("✅ billCombo loaded");
