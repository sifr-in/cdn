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
    // The selected-set banner and the per-room receipts of a combination.
    ".ht-selected-rooms{display:flex;align-items:center;flex-wrap:wrap;gap:6px;" +
    "padding:8px 11px;border:1px solid rgba(201,164,92,0.5);border-radius:8px;" +
    "background:rgba(201,164,92,0.08);font-size:13px;font-weight:600;}" +
    ".be-room-payments .be-room-pay{border:1px solid rgba(138,90,43,0.25);" +
    "border-left:3px solid rgba(138,90,43,0.6);border-radius:8px;padding:9px 11px;" +
    "margin-bottom:8px;background:rgba(255,255,255,0.5);}" +
    ".be-room-pay .be-room-pay-head{display:flex;align-items:center;flex-wrap:wrap;gap:6px;" +
    "font-size:13px;}" +
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
    // Mirror the transaction id (l.td) onto the row for callers that read td,
    // but never blank the booking link a stored row carries there.
    var recTxn = receiptTxnId(rec);
    if (recTxn) rec.td = recTxn;
    payments.push(rec);
  }
  existing = payments;
  // Route the receipt to the room that was open, so each row of a combination
  // keeps only its own payments.
  if (bePaymentTargetRoomId) {
    bookingState.roomPayments = bookingState.roomPayments || {};
    bookingState.roomPayments[bePaymentTargetRoomId] = payments;
  }
  bookingState.payments = payments;
  renderPaymentsRows("bkPaymentRows");
  renderPaymentsRows("bePaymentRows");
  if (typeof renderBeRoomPayments === "function") renderBeRoomPayments();
  if (typeof window.updateBalanceDue === "function") window.updateBalanceDue();
  if (typeof window.beUpdateBalanceDue === "function") window.beUpdateBalanceDue();
};

// One receipt row in the shape the app works with: the full stored record is
// kept (a, e, f, g, h, k, m, n, o, tb, l, ...) and only j / i / td are
// normalised, so the Receipt/Payment modal can edit and re-post a row without
// losing the voucher, cashier, date, party or round-off it was saved with.
function normaliseReceiptRec(pm) {
  var rec = {};
  for (var key in pm) {
    if (Object.prototype.hasOwnProperty.call(pm, key)) rec[key] = pm[key];
  }
  rec.j = fmtAmt(parseFloat(rec.j));
  rec.i = rec.i != null ? String(rec.i) : "";
  // Mirror the transaction id (l.td) onto the row for callers that read td,
  // but never blank the booking link a stored row carries there.
  var recTxn = receiptTxnId(rec);
  if (recTxn) rec.td = recTxn;
  return rec;
}

// Load this booking's saved receipts: table r filtered by td == booking id
// (it carries the real a ids), and when that is empty the booking row's own p.r
// array, so a booking whose receipts only ever lived in its row still opens
// with them. Returns full records mapped to the same shape fnAfterRcptPmt uses
// (j numeric, i string, td = l.td txn id; keeps a, h, g, k, m, n, o, tb, ...).
async function loadBookingReceipts(bookingId, rawRow) {
  var recs = [];
  try {
    var rRows = await dbDexieManager.getAllRecords(dbnm, "r");
    recs = (Array.isArray(rRows) ? rRows : []).filter(function (r) {
      return String(r.td) === String(bookingId);
    });
  } catch (e) {
    recs = [];
  }
  recs = recs.filter(function (pm) {
    return pm && (parseFloat(pm.j) > 0 || pm.i || pm.td || pm.l);
  });
  if (!recs.length && rawRow && rawRow.r != null) {
    var rArr = Array.isArray(rawRow.r)
      ? rawRow.r
      : (function () {
          try {
            var tmp = JSON.parse(rawRow.r);
            return Array.isArray(tmp) ? tmp : [];
          } catch (e) {
            return [];
          }
        })();
    recs = rArr.filter(function (pm) {
      return pm && (parseFloat(pm.j) > 0 || pm.i || pm.l);
    });
  }
  return recs.map(normaliseReceiptRec);
}

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
      // Post the envelope as an object with the operator's transaction id in it
      // (the server stores it back as {"td":"..."}). l.td is the ONLY source for
      // it - r.td above is the booking link, and writing that here is what used
      // to replace the transaction id with the booking id on every re-save.
      var txn = receiptTxnId(pm);
      if (txn || r.l != null) r.l = receiptEnvelopeWithTxn(r, txn);
      return r;
    });

    clearPayload0();
    payload0.vw = 1;
    payload0.fn = 103;
    payload0.r = paymentArray;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
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

// Any id value a save echoes, reduced to a flat, deduped list of lookup keys.
// A single-room save answers with one id; a combination is one row per room, so
// the ids arrive as a LIST (["55","56"]) or joined ("55_56-<timestamp>"), and a
// list member can itself be joined - so every segment is split.
var AB_SAVED_ID_SEP_RE = /[_,\s]+/;
function savedBookingIdList(v) {
  var out = [];
  var vals = Array.isArray(v) ? v : [v];
  for (var i = 0; i < vals.length; i++) {
    if (vals[i] == null || vals[i] === "") continue;
    var segs = String(vals[i]).split(AB_SAVED_ID_SEP_RE);
    for (var j = 0; j < segs.length; j++) {
      // Drop the "-<timestamp>" uniqueness tail a joined id carries.
      var s = segs[j].trim().replace(/-\d+$/, "");
      if (s !== "" && out.indexOf(s) === -1) out.push(s);
    }
  }
  return out;
}

// The booking ids a save created, from x1 alone: it carries exactly the rows this
// save wrote. The rb echo alongside it is the table's rows, so reading it as well
// queues bills for bookings this save never touched.
function savedBookingIdsFromResp(resp) {
  if (!resp || typeof resp !== "object") return [];
  var out = savedBookingIdList(resp.x1);
  // Numeric order so the bill queue always prints a stay's rooms the same way.
  out.sort(function (x, y) {
    return (parseInt(x, 10) || 0) - (parseInt(y, 10) || 0);
  });
  return out;
}

function billSnapForDashboardRow(raw, cRows, rRows) {
  if (!raw) return null;
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
  if (!snap) return null;
  if (raw.o != null) {
    var guests = Array.isArray(cRows) ? cRows : [];
    for (var cj = 0; cj < guests.length; cj++) {
      if (
        guests[cj] &&
        guests[cj].a != null &&
        String(guests[cj].a) === String(raw.o)
      ) {
        var guest = guests[cj];
        snap.guestName = guest.h != null ? String(guest.h) : "";
        snap.contact = guest.e != null ? String(guest.e) : "";
        snap.email =
          typeof billC1Email === "function" ? billC1Email(guest) || "" : "";
        snap.address = guest.m != null ? String(guest.m) : "";
        break;
      }
    }
  }
  // Receipts decide the bill's status and what is still due (billStatusOf), so
  // the money actually collected against this row has to travel with the
  // snapshot. Table r is the posted receipt; a row may also still carry its own
  // r array, which counts when the table has not caught up.
  if (typeof ensureSnapGst === "function") snap = ensureSnapGst(snap) || snap;
  var received = 0;
  var bId = String(raw.a == null ? "" : raw.a);
  if (bId !== "") {
    var receipts = Array.isArray(rRows) ? rRows : [];
    for (var ri2 = 0; ri2 < receipts.length; ri2++) {
      var rc = receipts[ri2] || {};
      var td = receiptBookingId(rc);
      if (td !== bId) continue;
      received += parseFloat(rc.j) || 0;
    }
    if (received <= 0 && Array.isArray(raw.r)) {
      for (var rj = 0; rj < raw.r.length; rj++) {
        received += parseFloat((raw.r[rj] || {}).j) || 0;
      }
    }
  }
  received = Math.round(received);
  if (received > 0) {
    snap.received = received;
    var payable = Math.max(0, Number(snap.grandTotal) || 0);
    snap.advanceAmount = received;
    snap.paid = payable > 0 && received >= payable;
  }
  return snap;
}

// Paysheet parts for a status mail, built from the same rb/c/r rows the bill
// printer reads. The admin panel never populates myBookingAll - that is the
// public guest's cache, filled only on the public booking and payment paths - so
// sendRoomBookingStatusMail cannot resolve these ids on its own and silently
// dropped every admin mail. The parts are assembled here and handed over.
//
// Status comes from billStatusOf(snap), which reads the money actually collected
// against the row. myBookingsStatus() must not be used here: it reads o === 4 as
// "Cancelled", but on a booking row o is the booker's guest id, so a booking for
// guest 4 would be mailed as a cancellation.
async function bookingMailParts(idList) {
  var ids = savedBookingIdList(idList);
  if (!ids.length) return [];
  var wanted = {};
  for (var i = 0; i < ids.length; i++) wanted[String(ids[i])] = true;
  var rbRows = [];
  var cRows = [];
  var rRows = [];
  try {
    rbRows = (await dbDexieManager.getAllRecords(dbnm, "rb")) || [];
    cRows = (await dbDexieManager.getAllRecords(dbnm, "c")) || [];
    rRows = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
  } catch (e) {
    console.warn("Status mail: could not read the booking tables:", e);
    return [];
  }
  var parts = [];
  for (var r = 0; r < rbRows.length; r++) {
    var raw = rbRows[r] || {};
    if (raw.a == null || !wanted[String(raw.a)]) continue;
    var snap = billSnapForDashboardRow(raw, cRows, rRows);
    if (!snap) continue;
    // billSnapForDashboardRow already folded the receipts into snap.received /
    // snap.paid, so the money on the mail matches the printed bill. st.paid is
    // deliberately left unset: setting it makes sendRoomBookingStatusMail
    // overwrite received with the grand total and bill a part-paid stay as paid.
    parts.push({
      snap: snap,
      bk: raw,
      st:
        typeof billStatusOf === "function"
          ? billStatusOf(snap)
          : { label: "Booking Requested", ok: false },
    });
  }
  return parts;
}

// A status mail that did not go out. The send is fire-and-forget, so without
// this the admin is never told and a guest with no email on file never hears.
function adminMailNotSent(reason) {
  showMessageModal(
    "Status mail not sent",
    "The booking was saved, but the status mail did not go out: " + reason + ".",
    false,
  );
}

// Fire the guest status mail for a save/update. Returns nothing: the caller goes
// on to print the bills, and this must not hold that up.
function adminSendBookingStatusMail(ids, why) {
  if (!ids || !ids.length) return;
  if (typeof window.sendRoomBookingStatusMail !== "function") {
    console.warn("Admin booking " + why + ": status mail is unavailable");
    return;
  }
  bookingMailParts(ids)
    .then(function (parts) {
      if (!parts.length) {
        adminMailNotSent("the saved booking could not be read back");
        return;
      }
      return window
        .sendRoomBookingStatusMail(ids, {
          parts: parts,
          timeout: 8000,
          onFail: adminMailNotSent,
        })
        .catch(function (e) {
          console.warn("Admin booking " + why + ": status mail skipped", e);
        });
    })
    .catch(function (e) {
      console.warn("Admin booking " + why + ": status mail skipped", e);
    });
}

// The local rb row for a booking id, or null.
function findDashboardBookingRow(raws, bookingId) {
  var list = Array.isArray(raws) ? raws : [];
  for (var i = 0; i < list.length; i++) {
    if (list[i] && String(list[i].a) === String(bookingId)) return list[i];
  }
  return null;
}

// Bill preview for a saved booking: loads the raw rb row by id (plus its guest
// record), rebuilds the bill snapshot with the rb.n discount applied, and
// renders it through the shared showBill/bill module. Called after the booking
// is saved, before the loader clears.
// onDone (optional) runs once the bill is dismissed, or straight away when no
// bill could be shown, so a queue of bills can advance from it.
window.printBillFromDashboard = async function (bookingId, onDone) {
  var finish = function () {
    if (typeof onDone === "function") onDone();
  };
  if (typeof showBill !== "function") {
    console.log("Print unavailable.");
    finish();
    return;
  }
  var raws = [];
  try {
    raws = (await dbDexieManager.getAllRecords(dbnm, "rb")) || [];
  } catch (e) {
    raws = [];
  }
  var raw = findDashboardBookingRow(raws, bookingId);
  if (!raw) {
    showMessageModal("Info", "Bill not found", true);
    finish();
    return;
  }
  var cRows = [];
  if (raw.o != null) {
    try {
      cRows = (await dbDexieManager.getAllRecords(dbnm, "c")) || [];
    } catch (e) {
      cRows = [];
    }
  }
  var rRows = [];
  try {
    rRows = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
  } catch (e) {
    rRows = [];
  }
  var snap = billSnapForDashboardRow(raw, cRows, rRows);
  if (!snap) {
    showMessageModal(
      "Info",
      "Could not build the bill for this booking.",
      true,
    );
    finish();
    return;
  }
  showBill(snap, function () {
    document.body.classList.remove("ht-print-bill");
    finish();
  });
};

// Show every bill of a saved stay, one bill at a time. Only one bill overlay
// exists (renderBill overwrites modalRoot), so the bills are queued and each one
// advances from the previous bill's own onClose, which closeBill fires when the
// operator dismisses it. Every row is read up front, so an id the local DB does
// not hold yet (sync lag) is skipped with a warning instead of stalling the
// queue on an error popup.
window.printBillsFromDashboard = async function (idList, onAllDone) {
  var done = typeof onAllDone === "function" ? onAllDone : function () {};
  var ids = savedBookingIdList(idList);
  if (!ids.length || typeof showBill !== "function") {
    if (!ids.length) console.log("Print unavailable.");
    done();
    return;
  }
  var raws = [];
  var cRows = [];
  var rRows = [];
  try {
    raws = (await dbDexieManager.getAllRecords(dbnm, "rb")) || [];
  } catch (e) {
    raws = [];
  }
  try {
    cRows = (await dbDexieManager.getAllRecords(dbnm, "c")) || [];
  } catch (e) {
    cRows = [];
  }
  try {
    rRows = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
  } catch (e) {
    rRows = [];
  }
  var snaps = [];
  var missing = [];
  for (var i = 0; i < ids.length; i++) {
    var snap = billSnapForDashboardRow(
      findDashboardBookingRow(raws, ids[i]),
      cRows,
      rRows,
    );
    if (snap) snaps.push(snap);
    else missing.push(ids[i]);
  }
  if (missing.length) {
    console.warn("Bill not found for booking id(s):", missing.join(", "));
  }
  if (!snaps.length) {
    done();
    return;
  }
  var n = 0;
  function next() {
    document.body.classList.remove("ht-print-bill");
    if (n >= snaps.length) {
      done();
      return;
    }
    showBill(snaps[n++], next);
  }
  next();
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

// Which room the Receipt/Payment modal is currently entering a receipt for.
// A combination is saved as one row per room, so the operator enters each
// room's own payments; an empty target means the single combined list.
var bePaymentTargetRoomId = "";

// The server id (r.a) of a receipt row, or "" for a row that is still local
// (just added in the modal, or read back from the booking row's p.r).
function receiptServerId(rec) {
  if (!rec || rec.a == null) return "";
  var a = String(rec.a).trim();
  return a === "" || a === "0" || a === "0.00" ? "" : a;
}

// Amount + mode + date + txn id, used only to spot a row the base list already
// holds. Two identical receipts inside ONE list are legitimate (the modal's
// own n counter allows them), so this is never applied within a single list.
function receiptSig(rec) {
  var r = rec || {};
  var amt = parseFloat(r.j);
  return [
    isNaN(amt) ? String(r.j == null ? "" : r.j) : String(amt),
    String(r.i == null ? "" : r.i),
    String(r.k == null ? "" : r.k),
    receiptTxnId(r),
  ].join("|");
}

// Seed for the Receipt/Payment modal: the list the form is already showing
// first, then every matching r-table row it does not contain yet. The base
// list can be ahead of the table (an unsent edit) and is the only place
// receipts saved inside the booking row live, so it must not be replaced by the
// table read. Merging is by server id, so a row is never listed twice.
function mergeReceiptLists(base, dbRows) {
  var out = (Array.isArray(base) ? base : []).slice();
  var seenIds = {};
  var seenSigs = {};
  for (var i = 0; i < out.length; i++) {
    var sid = receiptServerId(out[i]);
    if (sid) seenIds[sid] = true;
    seenSigs[receiptSig(out[i])] = true;
  }
  var db = Array.isArray(dbRows) ? dbRows : [];
  for (var j = 0; j < db.length; j++) {
    var rec = db[j];
    if (!rec) continue;
    var id = receiptServerId(rec);
    if (id) {
      if (seenIds[id]) continue;
      seenIds[id] = true;
    } else if (seenSigs[receiptSig(rec)]) {
      continue;
    }
    out.push(rec);
  }
  return out;
}

window.openRcptPmtModal = async function (roomId) {
  if (!bookingState.guestCId || String(bookingState.guestCId) === "0") {
    showMessageModal(
      "Info",
      "Receipt Payments must be after the Select Guest Details!",
      false,
    );
    return;
  }
  bePaymentTargetRoomId = roomId != null ? String(roomId) : "";
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
    var dbList = rRows.filter(function (r) {
      if (!r) return false;
      if (String(r.td) !== bkId) return false;
      if (tbTarget !== "" && String(r.tb) !== tbTarget) return false;
      if (guestId != null && String(guestId) !== "" && String(guestId) !== "0") {
        if (String(r.h) !== String(guestId)) return false;
      }
      return true;
    });
    // What the form lists: the room's own list when a room was targeted, else
    // the one combined list for this booking.
    var base = bePaymentTargetRoomId
      ? (bookingState.roomPayments || {})[bePaymentTargetRoomId] || []
      : bookingState.payments || [];
    existing = mergeReceiptLists(base, dbList);
    console.info(
      "🧾 Receipt/Payment seed:",
      (base || []).length,
      "in booking state,",
      dbList.length,
      "matching r rows,",
      existing.length,
      "opened",
    );
  } else {
    // While editing a combination, the room being paid for decides which list
    // the modal opens with.
    if (bePaymentTargetRoomId) {
      var roomList = (bookingState.roomPayments || {})[bePaymentTargetRoomId];
      existing = (roomList || []).slice();
    } else {
      existing = (bookingState.payments || []).slice();
    }
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
    escAttr(receiptTxnId(p)) +
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
  roomId: 0, // j: room id (first of roomIds)
  roomIds: [], // every selected room id - one stays a 1-item list
  packageId: 1, // k: package id
  addonIds: [], // l: add-on id list
  extraParticular: "", // y.p: extra particulars text
  extraCharges: 0, // y.c: extra charges amount (₹)
  extraItems: [], // [{ id, name, amount, mode }] mode: "stay"=flat, "night"=per-night (persisted in k.h)
  payments: [], // r: [{ j: amount, i: modeId, td: txnId }] multiple advance payments
  // One payment list per selected room, keyed by room id. A combination is
  // saved as one row per room and the operator enters each room's own
  // receipts - nothing is pro-rated for them.
  roomPayments: {},
  payStatus: "", // z.s: payment status
  // Which discount field the operator last edited ("pct" | "amt"). The add
  // payload saves only the rupee amount, so a fresh form and a re-opened edit
  // booking both anchor on "amt"; resolveDiscount re-derives the other field.
  discountSource: "amt",
  // Occupancy fingerprint behind the child rows. While it is unchanged the rows
  // are left alone, so typing in a rate box can never re-render itself; a real
  // occupancy change re-seeds every rate the operator has not chosen.
  childOccSig: "",
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
    roomIds: roomPreset
      ? [
          String(
            roomPreset.a != null ? roomPreset.a : roomPreset.e,
          ),
        ]
      : [],
    packageId: 1,
    addonIds: [],
    extraParticular: "",
    extraCharges: 0,
    extraItems: [],
    payments: [],
    roomPayments: {},
    payStatus: "",
    guestCId: 0,
    editBookingId: 0,
    discountPercent: 0,
    discountAmt: 0,
    discountSource: "amt",
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

async function validateBookingStep(step) {
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
      var freeMax = beChildFreeMax();
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
        if ((!isABHidden("room") && !bookingState.roomId || isABHidden("room")) && age > freeMax && !nm) {
          showMessageModal(
            "Info",
            "Child " + (i + 1) + ": name is required when age is above " + freeMax + "!",
            false,
          );
          return false;
        }
        children.push({ n: nm, ag: age, c: 0 });
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
      if (!beSelectedRoomIds().length) {
        showMessageModal("Info", "Please select a room!", false);
        return false;
      }
      var roomsSel = beSelectedRooms();
      if (roomsSel.length !== beSelectedRoomIds().length) {
        showMessageModal("Info", "Selected room not found!", false);
        return false;
      }
      // A combination has to sleep the party as a set, not room by room.
      if (roomsSel.length > 1 && !beRoomsPartyFits(roomsSel)) {
        showMessageModal(
          "Info",
          "The selected rooms together cannot sleep your party.",
          false,
        );
        return false;
      }
      var room = roomsSel[0];
      var roomFreeMax = beChildFreeMax();
      for (var ri = 0; ri < bookingState.children.length; ri++) {
        var rc = bookingState.children[ri] || {};
        if (parseInt(rc.ag, 10) > roomFreeMax && !String(rc.n || "").trim()) {
          showMessageModal(
            "Info",
            "Child " +
              (ri + 1) +
              ": name is required when age is above " +
              roomFreeMax +
              "!",
            false,
          );
          return false;
        }
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
  if (step === 6 && !bookingState.editBookingId) {
    // Summary step: payments come from the Receipt/Payment modal
    // (bookingState.payments, set via window.fnAfterRcptPmt). A combination
    // keeps one list per room, so the over-payment guard uses their sum.
    if (!isABHidden("adv")) {
      var sum = beAllRoomPaymentsTotal();
    }
    bookingState.payStatus = "";
    if (!isABHidden("adv")) {
      var totalPayable = lastCalcTotal - (bookingState.discountAmt || 0);
      if (sum > totalPayable&& !bookingState.editBookingId) {
        console.error(sum + ">" + totalPayable);
        showMessageModal(
          "Info",
          "Advance payments cannot exceed the total payable!",
          false,
        );
        return false;
      } else if (bookingState.editBookingId) {
        var ok = await showConfirmModal(
          "Advance payments: Please confirm more payable added!",
        );
        if (!ok) return false;
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
  var maxCh = beMaxChildren();
  var freeMax = beChildFreeMax();
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
  // Guests step: Male + Female (Total Guests auto = m+f), then Children.
  // Blocks are guarded by their hide-codes (ad / ch).
  var h =
    '<div class="p-3">' +
    '<div class="d-flex align-items-center gap-2 mb-2">' +
    '<i class="fas fa-users text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Guests &amp; Children</span></div>' +
     '<div class="d-flex flex-wrap gap-2 mb-3">' +
      '<span class="ht-age-rule"><i class="fas fa-baby me-1"></i>0-' +
      freeMax +
      " yrs: Free</span>" +
      '<span class="ht-age-rule"><i class="fas fa-user me-1"></i>' +
      (freeMax + 1) +
      "+ yrs: Adult-equivalent occupancy</span>" +
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
      '<div class="form-hint">Name required only for age above ' +
      beChildFreeMax() +
      "</div></div></div>" +
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
      c: 0,
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
  var freeMax = beChildFreeMax();
  var h = "";
  for (var i = 0; i < count; i++) {
    var c = bookingState.children[i];
    var age = (c.ag !== "" && c.ag !== undefined ? c.ag : "");
    var isAdultEquivalent = parseInt(age) > freeMax;
    h +=
      '<div class="ht-child-row">' +
      '<span class="badge-premium badge-premium-emr">Child ' +
      (i + 1) +
      "</span>" +
      '<input type="text" class="form-control-premium bkChildName" placeholder="Name (required if age > ' +
      freeMax +
      ')" value="' +
      escAttr(c.n || "") +
      '">' +
      '<input type="number" class="form-control-premium bkChildAge" placeholder="Age (0-17)" min="0" max="17" value="' +
      age +
      '" style="max-width:120px;" oninput="bkChildAgeChanged(this,' +
      i +
      ')">' +
      (isAdultEquivalent
        ? bkChildStatusZoneHTML()
        : '<span class="bkChildStatusZone"><span class="badge-premium badge-premium-emr" style="font-size:11px;">free</span></span>') +
      "</div>";
  }
  wrap.innerHTML = h;
}

function bkChildStatusZoneHTML() {
  return (
    '<span class="bkChildStatusZone">' +
    '<span class="badge-premium badge-premium-gold" style="font-size:11px;">adult-equivalent</span>' +
    "</span>"
  );
}

window.bkChildAgeChanged = function (input, idx) {
  var freeMax = beChildFreeMax();
  var age = parseInt(input.value) || 0;
  var prevAge = parseInt(bookingState.children[idx].ag) || 0;
  var wasAdultEquivalent = prevAge > freeMax;
  bookingState.children[idx].ag = age;
  var isAdultEquivalent = age > freeMax;
  var row = input.closest(".ht-child-row");
  var zone = row && row.querySelector(".bkChildStatusZone");
  if (isAdultEquivalent && !wasAdultEquivalent) {
    bookingState.children[idx].c = 0;
    if (zone) zone.outerHTML = bkChildStatusZoneHTML();
  } else if (!isAdultEquivalent && wasAdultEquivalent) {
    bookingState.children[idx].c = 0;
    if (zone)
      zone.outerHTML =
        '<span class="bkChildStatusZone"><span class="badge-premium badge-premium-emr" style="font-size:11px;">free</span></span>';
  }
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
  var singleRoom = beSingleRoomOnly();
  h +=
    "</div>" +
    '<div class="d-flex align-items-center gap-2 mb-2">' +
    '<i class="fas fa-bed text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Select ' +
    (!singleRoom && bookingState.adults > 1 ? "Rooms" : "a Room") +
    "</span>" +
    '<span class="ms-auto text-gray text-sm">' +
    (singleRoom ? "One room per booking" : "Pick up to 3 rooms") +
    "</span></div>";
  // What is selected right now, so a combination is obvious before pricing.
  var selRooms = beSelectedRooms();
  if (selRooms.length) {
    var selNames = [];
    var selTotal = 0;
    for (var si = 0; si < selRooms.length; si++) {
      selNames.push(htRoomName(selRooms[si]));
      selTotal += Number(htRoomRate(selRooms[si])) || 0;
    }
    h +=
      '<div class="ht-selected-rooms mb-2">' +
      '<i class="fas fa-check-circle text-emr"></i> ' +
      escHtml(selNames.join(" + ")) +
      (selRooms.length > 1
        ? ' <span class="badge-premium badge-premium-gold ms-1">combination</span>'
        : "") +
      '<span class="ms-auto">₹' +
      fmtAmt(selTotal) +
      "/night</span>" +
      (selRooms.length > 1 || singleRoom
        ? '<button type="button" class="btn btn-sm btn-link p-0 ms-2" onclick="clearBookingRoomSelection()">clear</button>'
        : "") +
      "</div>";
  }
  // Combinations, but only when no single room can take the party on its own.
  var comboOptions = beComboOptions();
  if (comboOptions.length) {
    h +=
      '<div class="d-flex align-items-center gap-2 mb-2 mt-3">' +
      '<i class="fas fa-layer-group text-gold" style="font-size:16px;"></i>' +
      '<span class="fw-bold text-emr-dark" style="font-size:14px;">Room ' +
      "Combinations</span></div>" +
      (singleRoom
        ? '<div class="form-hint mb-2"><i class="fas fa-circle-info me-1"></i>' +
          "Unavailable for now - one room per booking.</div>"
        : "") +
      '<div class="ht-combo-rooms">';
    for (var co = 0; co < comboOptions.length; co++) {
      var coOpt = comboOptions[co];
      var coNames = [];
      for (var cn = 0; cn < coOpt.rooms.length; cn++) {
        coNames.push(coOpt.rooms[cn].name);
      }
      var coSelected = htComboKey(beSelectedRoomIds()) === coOpt.key;
      h +=
        '<div class="ht-combo-room' +
        (coSelected ? " selected" : "") +
        '"' +
        (singleRoom
          ? ' aria-disabled="true" style="opacity:0.55;cursor:not-allowed;"'
          : " onclick=\"applyBookingCombo('" + coOpt.key + "')\"") +
        ">" +
        '<div class="ht-combo-room-name">' +
        escHtml(coNames.join(" + ")) +
        "</div>" +
        '<div class="ht-combo-room-meta">' +
        "sleeps " +
        escHtml(coOpt.maxOccupancy) +
        " · ₹" +
        fmtAmt(coOpt.totalPerNight) +
        "/night" +
        (coOpt.fitsPooledNormal
          ? " · no extra guest charge"
          : " · extra guest charge applies") +
        "</div></div>";
    }
    h += "</div>";
  }
  h += '<div class="row g-2">';
  for (var i = 0; i < adminRoomRecords.length; i++) {
    var r = adminRoomRecords[i];
    var available = getRoomAvailability(
      r,
      bookingState.checkin,
      bookingState.checkout,
      bookingState.editBookingId || null,
    );
    var policy = htRoomOccupancyPolicy(r);
    var roomNum = r.a != null ? r.a : r.e;
    var selected = beSelectedRoomIds().indexOf(String(roomNum)) !== -1;
    // A room that cannot sleep the whole party is shown but not offered, the
    // same way the public room list treats it.
    var partyOcc =
      typeof beBookingOccupancy === "function"
        ? beBookingOccupancy(r, bookingState.adults || 0, bookingState.children || [])
        : null;
    var undersized = !!(partyOcc && partyOcc.overMaxOccupancy);
    var cls = "ht-option-card";
    if (selected) cls += " selected";
    if (!available) cls += " sold-out";
    else if (available && undersized) cls += " is-undersized";
    else if (available) cls += " is-avail";
    var clickable = available && !undersized;
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
      '<input type="checkbox" class="opt-radio" name="bkRoom" value="' +
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
       escHtml(policy.capacity || 0) +
       " included · sleeps up to " +
       escHtml(policy.maxOccupancy || 0) +
       (htRoomDimensions(r) ? " · " + escHtml(htRoomDimensions(r)) : "") +
       "</div>" +
      // Read-only Room Status badge (never stored with the booking).
      '<span class="opt-badge" style="background:#EAF7EC;border-color:#28a745;color:#1e7e34;">' +
      escHtml(htRoomStatusLabel(r.d != null ? r.d : r.k)) +
      "</span>" +
      (!available
        ? '<span class="opt-badge" style="background:#FDECEA;border-color:#dc3545;color:#c0392b;">Not available for these dates</span>'
         : undersized
          ? '<span class="opt-badge" style="background:#FBF7EE;border-color:#E8D9B8;color:#8a5a2b;">Sleeps only ' +
            escHtml(policy.maxOccupancy || 0) +
            " of " +
            // Count chargeable occupancy: children within the free age do not
            // take a slot, so they must not push a room into "too small".
            escHtml(
             partyOcc && partyOcc.effectiveOccupancy != null
              ? partyOcc.effectiveOccupancy
              : (bookingState.adults || 0) + (bookingState.children || []).length,
            ) +
            " guests</span>"
          : '<span class="ht-avail-badge ok"><i class="fas fa-circle-check"></i> Available</span>') +
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

window.clearBookingRoomSelection = function () {
  bookingState.roomIds = [];
  bookingState.roomId = 0;
  bookingState.roomPayments = {};
  bookingState.payments = [];
  renderRoomStep();
};

// Room selection is limited to ONE room per booking for now. Set this to false
// to bring the 2-3 room combinations back (multi-room pickers, per-room
// receipts, one saved booking row per room).
var BE_SINGLE_ROOM_ONLY = true;

function beSingleRoomOnly() {
  return BE_SINGLE_ROOM_ONLY;
}

// Every selected room, in selection order. A single room is a 1-item list, so
// the rest of the flow never has to special-case it.
function beSelectedRoomIds() {
  var ids = [];
  var list = bookingState.roomIds || [];
  for (var i = 0; i < list.length; i++) {
    var v = list[i];
    if (v == null || v === "") continue;
    if (ids.indexOf(String(v)) === -1) ids.push(String(v));
  }
  if (!ids.length && bookingState.roomId) ids = [String(bookingState.roomId)];
  return ids;
}

function beSelectedRooms() {
  var out = [];
  var ids = beSelectedRoomIds();
  for (var i = 0; i < ids.length; i++) {
    var r = getRoomById(ids[i]);
    if (r) out.push(r);
  }
  return out;
}

function beRoomsPartyFits(rooms) {
  if (!rooms || !rooms.length) return false;
  var childAges = (bookingState.children || []).map(function (c) {
    return c && c.ag != null ? parseInt(c.ag, 10) || 0 : 0;
  });
  var pool = htOccupancyPool(rooms, bookingState.adults || 0, childAges);
  return !pool.overMaxOccupancy;
}

// Pick one room, or a set of them, depending on the mode.
window.applyBookingRoom = function (id) {
  var sid = String(id);
  if (beSingleRoomOnly()) {
    // Clicking the selected room clears it; any other click replaces the pick.
    var cur = beSelectedRoomIds();
    bookingState.roomIds = cur.length === 1 && cur[0] === sid ? [] : [sid];
    bookingState.roomId = bookingState.roomIds.length ? sid : 0;
    bookingState.roomPayments = {};
    bookingState.payments = [];
    renderBookingStep(3);
    return;
  }
  var ids = beSelectedRoomIds();
  var at = ids.indexOf(sid);
  if (at !== -1) {
    if (ids.length === 1) return;
    ids.splice(at, 1);
  } else {
    if (ids.length >= 3) {
      showMessageModal(
        "Rooms",
        "A stay can hold at most 3 rooms. Remove one to pick another.",
        false,
      );
      return;
    }
    ids.push(sid);
  }
  var rooms = beSelectedRooms();
  if (ids.length > 1 && rooms.length === ids.length && !beRoomsPartyFits(rooms)) {
    showMessageModal(
      "Rooms",
      "Those rooms together cannot sleep your party. Pick a different set.",
      false,
    );
    return;
  }
  bookingState.roomIds = ids;
  bookingState.roomId = ids.length ? ids[0] : 0;
  // A different set of rooms means the old per-room receipts no longer apply.
  bookingState.roomPayments = {};
  bookingState.payments = [];
  renderBookingStep(3);
};

// The combination options for the current dates/party, ranked best first. Only
// produced when no single room can take the party, matching the public list.
function beComboOptions() {
  if (typeof htComboOptions !== "function") return [];
  var pool = [];
  for (var i = 0; i < adminRoomRecords.length; i++) {
    var r = adminRoomRecords[i];
    if (!r) continue;
    if (
      !getRoomAvailability(
        r,
        bookingState.checkin,
        bookingState.checkout,
        bookingState.editBookingId || null,
      )
    )
      continue;
    var partyOcc = beBookingOccupancy(
      r,
      bookingState.adults || 0,
      bookingState.children || [],
    );
    if (partyOcc && partyOcc.overMaxOccupancy) continue;
    var roomNum = r.a != null ? r.a : r.e;
    pool.push({
      id: roomNum,
      name: htRoomName(r),
      pricePerNight: Number(htRoomRate(r)) || 0,
      record: r,
    });
  }
  var childAges = (bookingState.children || []).map(function (c) {
    return c && c.ag != null ? parseInt(c.ag, 10) || 0 : 0;
  });
  return htComboOptions(pool, bookingState.adults || 0, childAges, {
    maxRooms: 3,
  });
}

window.applyBookingCombo = function (key) {
  if (beSingleRoomOnly()) return;
  var options = beComboOptions();
  for (var i = 0; i < options.length; i++) {
    if (String(options[i].key) !== String(key)) continue;
    bookingState.roomIds = options[i].roomIds.slice();
    bookingState.roomId = options[i].roomIds[0];
    bookingState.roomPayments = {};
    bookingState.payments = [];
    renderBookingStep(3);
    return;
  }
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

function beMaxChildren() {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var max = parseInt(cfg.maxChildren, 10);
  if (!isFinite(max) || max < 0) max = 0;
  return Math.max(max, bookingState.children.length);
}

function beChildFreeMax() {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  // A combination takes the oldest room's free-child age, so no child of the
  // party is charged a different rate in one row than in another.
  var rooms = beSelectedRooms();
  var best = cfg.childAgeFreeMax != null ? Number(cfg.childAgeFreeMax) : 8;
  if (typeof htRoomOccupancyPolicy === "function") {
    for (var i = 0; i < rooms.length; i++) {
      var v = htRoomOccupancyPolicy(rooms[i]).childAgeFreeMax;
      if (v != null && Number(v) > best) best = Number(v);
    }
  }
  return best;
}

// Seed rate for each child row, index-parallel to bookingState.children. The
// pool seats the adults first, so the FIRST over-age children fall inside the
// included capacity and cost nothing and only the ones left over are billed.
// Seeding those two groups differently keeps the pre-filled total identical to
// what the pool charges today, so nothing re-prices until a rate is edited.
function beChildRatePrefill() {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var base = Math.max(0, Number(cfg.paidChildCharge) || 0);
  var freeMax = beChildFreeMax();
  var children = bookingState.children || [];
  var out = [];
  var overIdx = [];
  for (var i = 0; i < children.length; i++) {
    var isOver = parseInt(children[i] && children[i].ag, 10) > freeMax;
    out.push(isOver ? base : 0);
    if (isOver) overIdx.push(i);
  }
  var rooms = beSelectedRooms();
  if (!rooms.length || !overIdx.length) return out;
  var occ = beBookingOccupancy(rooms, bookingState.adults || 0, children);
  var included = Math.max(0, overIdx.length - (Number(occ.paidChildUnits) || 0));
  for (var n = 0; n < overIdx.length; n++) {
    if (n < included) out[overIdx[n]] = 0;
  }
  return out;
}

// Chargeable occupancy for a SET of rooms. The free slots of every room pool
// together, so a large party is never pinned to one room. A single room is a
// 1-item list and behaves exactly as before.
function beBookingOccupancy(roomOrRooms, adults, children) {
  var rooms = Array.isArray(roomOrRooms)
    ? roomOrRooms.filter(Boolean)
    : roomOrRooms
      ? [roomOrRooms]
      : [];
  var childAges = (children || []).map(function (child) {
    return child && child.ag != null ? parseInt(child.ag, 10) || 0 : 0;
  });
  if (typeof htOccupancyPool === "function") {
    return htOccupancyPool(rooms, adults, childAges);
  }
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var policy =
    typeof htRoomOccupancyPolicy === "function"
      ? htRoomOccupancyPolicy(rooms[0])
      : {
          capacity: 2,
          maxOccupancy: parseInt(cfg.maxOccupancy, 10) || 2,
          childAgeFreeMax: parseInt(cfg.childAgeFreeMax, 10) || 8,
        };
  var adultEquivalentChildren = childAges.filter(function (age) {
    return age > policy.childAgeFreeMax;
  }).length;
  var adultsCount = Math.max(0, parseInt(adults, 10) || 0);
  var effectiveOccupancy = adultsCount + adultEquivalentChildren;
  // Included slots go to the adults first, then to the over-age children, so
  // whoever is left over is billed at their own rate.
  var includedForAdults = Math.min(adultsCount, policy.capacity);
  var includedForChildren = Math.min(
    adultEquivalentChildren,
    policy.capacity - includedForAdults,
  );
  var extraAdultUnits = adultsCount - includedForAdults;
  var paidChildUnits = adultEquivalentChildren - includedForChildren;
  return {
    rooms: rooms,
    roomCount: rooms.length,
    capacity: policy.capacity,
    maxOccupancy: policy.maxOccupancy,
    childAgeFreeMax: policy.childAgeFreeMax,
    adults: adultsCount,
    children: childAges.length,
    childAges: childAges,
    adultEquivalentChildren: adultEquivalentChildren,
    paidChildren: adultEquivalentChildren,
    paidChildUnits: paidChildUnits,
    freeChildren: childAges.length - adultEquivalentChildren,
    effectiveOccupancy: effectiveOccupancy,
    extraAdultUnits: extraAdultUnits,
    extraAdults: extraAdultUnits,
    overflowUnits: extraAdultUnits + paidChildUnits,
    isOverCapacity: effectiveOccupancy > policy.capacity,
    overMaxOccupancy: effectiveOccupancy > policy.maxOccupancy,
  };
}

// Stay pricing for one room or a whole set. The room rates of every room are
// added together and the occupancy is pooled, so a combination is priced as one
// stay rather than as several independent bookings.
function beCalculateTotal(roomOrRooms, nights, addons, extraCharges, children, packageAdj) {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var rooms = Array.isArray(roomOrRooms)
    ? roomOrRooms.filter(Boolean)
    : roomOrRooms
      ? [roomOrRooms]
      : [];
  var room = rooms[0] || null;
  var occupancy = beBookingOccupancy(rooms, bookingState.adults || 0, children);
  // occupancy carries the pooled capacity and the adults-first split, so
  // calcTotal does not re-derive extra adults from effectiveOccupancy (which
  // would bill over-age children a second time as extra adults).
  var paidChildRate = cfg.paidChildCharge || 0;
  // Index-parallel to occupancy.childAges, which beBookingOccupancy builds from
  // this same list, so calcTotal can bill each over-age child at its own rate.
  // A child still at c === null is undecided, not free: an explicit 0 is the
  // operator's own "do not charge", so only a null seeds from the prefill. Without
  // this the list would read every untouched child as a deliberate 0 and, since a
  // supplied list prices over-age children outright, drop the default charge.
  var undecidedPre = beChildRatePrefill();
  var perChildRates = (children || []).map(function (child, ci) {
    var raw = child && child.c != null ? child.c : undecidedPre[ci];
    return Math.max(0, parseFloat(raw) || 0);
  });
  var allRates = [];
  for (var ri = 0; ri < rooms.length; ri++) {
    var rRates = adminRoomRates(rooms[ri], nights) || [];
    for (var rj = 0; rj < rRates.length; rj++) allRates.push(rRates[rj]);
  }
  var calc = calcTotal({
    nights: nights,
    roomRates: allRates,
    childAges: occupancy.childAges,
    childRates: perChildRates,
    childRate: paidChildRate,
    childAgeFreeMax: occupancy.childAgeFreeMax,
    adults: occupancy.adults,
    includedAdults: occupancy.capacity,
    extraGuestRate: cfg.extraAdultsCharge || 0,
    packageAdj: packageAdj || 0,
    addons: addons || [],
    extraCharges: extraCharges || 0,
    occupancy: occupancy,
  });
  calc.occupancy = occupancy;
  calc.rooms = rooms;
  calc.roomCount = rooms.length;
  calc.childRates = perChildRates;
  return calc;
}

function renderSummaryStep() {
  var b = document.getElementById(bookingModalId + "_body");
  var rooms = beSelectedRooms();
  var room = rooms[0] || null;
  var pkg = getPackageById(bookingState.packageId);
  var nights = calcNights(bookingState.checkin, bookingState.checkout) || 1;
  var addons = getComputedAddons();
  var calc = beCalculateTotal(
    rooms,
    nights,
    addons,
    bookingState.extraCharges,
    bookingState.children,
    pkg ? pkg.g : 0,
  );
  var occupancy = calc.occupancy;
  var childAges = occupancy.childAges;
  lastCalcTotal = calc.total;
  // Same settling as the Booking Entry summary: a % the operator typed rescales
  // its rupee amount against the total this step just priced, and a rupee amount
  // holds and re-derives its %. Without this, stepping back to change the room
  // or the dates and returning here left the two fields quoting the old stay.
  resolveDiscount(calc.total, bookingState.discountSource);

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
    (rooms.length
      ? rooms
          .map(function (rr) {
            return (
              escHtml(htRoomName(rr)) +
              " @ ₹" +
              fmtAmt(htRoomRate(rr)) +
              "/night" +
              (rr ? " · " + escHtml(htRoomStatusLabel(rr.d != null ? rr.d : rr.k)) : "")
            );
          })
          .join("<br>") +
        (rooms.length > 1
          ? '<br><span class="text-gray text-sm">' +
            rooms.length +
            " rooms · 1 combination · saved as " +
            rooms.length +
            " separate rows</span>"
          : "")
      : "-") +
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
      ? '<tr class="tot"><td>Adult-equivalent child (' +
      calc.paidChildren +
      ")</td><td>₹" +
      fmtAmt(calc.childAdj) +
      "</td></tr>"
      : "") +
    (calc.adultAdj > 0
      ? '<tr class="tot"><td>Extra Occupancy (' +
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
    htGstRate() +
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
    (Number(calc.total) || 0) +
    ')">' +
    "</div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Discount Amt (₹)</label>' +
    '<input type="number" id="bkDiscountAmt" min="0" step="0.01" class="form-control-premium" value="' +
    (bookingState.discountAmt || "") +
    '" oninput="updateDiscountFromAmt(this, ' +
    (Number(calc.total) || 0) +
    ')">' +
    "</div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Total After Discount (₹)</label>' +
    '<input type="text" id="bkTotalAfterDiscount" class="form-control-premium fw-bold be-readonly" value="' +
    Math.round(Math.max(0, calc.total - (bookingState.discountAmt || 0))) +
    '" readonly>' +
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

// Discount helpers (wizard step 6): keep % and amount in sync, clamped to
// 0-100% and 0-total. The wizard has no live recalc, so each handler records
// which field the operator edited and paints the other from resolveDiscount.
function updateDiscountFromPercent(input, total) {
  var pct = parseFloat(input.value) || 0;
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  input.value = pct;
  bookingState.discountPercent = pct;
  bookingState.discountSource = "pct";
  paintWizardDiscount(input, resolveDiscount(total, "pct"));
}

function updateDiscountFromAmt(input, total) {
  var amt = parseFloat(input.value) || 0;
  if (amt < 0) amt = 0;
  input.value = amt;
  bookingState.discountAmt = amt;
  bookingState.discountSource = "amt";
  paintWizardDiscount(input, resolveDiscount(total, "amt"));
}

// Show the settled discount in both wizard fields plus the net total. Only the
// field the operator is typing into is left as they entered it; the companion
// gets whatever resolveDiscount derived. lastCalcTotal is the Grand Total the
// current step 6 was rendered with.
function paintWizardDiscount(edited, disc) {
  var amtEl = document.getElementById("bkDiscountAmt");
  if (amtEl && amtEl !== edited) amtEl.value = disc.amt;
  var pctEl = document.getElementById("bkDiscountPercent");
  if (pctEl && pctEl !== edited) pctEl.value = disc.percent;
  var totEl = document.getElementById("bkTotalAfterDiscount");
  if (totEl) totEl.value = Math.round(Math.max(0, lastCalcTotal - disc.amt));
}

// Discount: settle the % and the rupee amount against a total this pass just
// priced, so the two can never disagree.
//
// Whichever field the operator last edited (bookingState.discountSource) is
// authoritative and the other is re-derived from it. Before this, the rupee
// amount was frozen and the % written once, so changing the room, the guest
// count or the stay dates moved the payable while both discount fields kept
// quoting the old stay - a "10%" that was really 4.16% of the new total.
// The add payload stores only the amount (rb.n), so a fresh form and a
// re-opened edit booking both anchor on "amt".
function resolveDiscount(total, source) {
  var src = source || bookingState.discountSource || "amt";
  var pct = parseFloat(bookingState.discountPercent) || 0;
  var amt = parseFloat(bookingState.discountAmt) || 0;
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  if (amt < 0) amt = 0;
  if (src === "pct") {
    amt = Math.round(((Number(total) || 0) * pct) / 100 * 100) / 100;
  } else if (total > 0) {
    pct = Math.round((amt / total) * 100 * 100) / 100;
  } else {
    // Nothing priced, so a "free" rupee amount would be an infinite percent.
    pct = 0;
  }
  // A discount can never exceed what it discounts; otherwise the net total
  // would have to go negative and the save-time guard would reject the stay.
  if (amt > total) {
    amt = total > 0 ? total : 0;
    pct = total > 0 ? 100 : 0;
  }
  bookingState.discountPercent = pct;
  bookingState.discountAmt = amt;
  return { percent: pct, amt: amt };
}

// Discount helpers for Booking Entry view: keep % and amount in sync.
function beUpdateDiscountFromPercent(input) {
  var pct = parseFloat(input.value) || 0;
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  input.value = pct;
  bookingState.discountPercent = pct;
  bookingState.discountSource = "pct";
  // beRecalc re-derives the rupee amount, Total After Discount and Balance Due
  // against the total it prices here, so this handler only records the intent.
  beRecalc();
}

function beUpdateDiscountFromAmt(input) {
  var amt = parseFloat(input.value) || 0;
  if (amt < 0) amt = 0;
  input.value = amt;
  bookingState.discountAmt = amt;
  bookingState.discountSource = "amt";
  // beRecalc clamps the amount to the total it prices here and re-derives the %.
  beRecalc();
}

function bePaymentsSum() {
  return beAllRoomPaymentsTotal();
}

// Total received across the stay: for a combination that is the sum of each
// room's own list, for a single room the one combined list.
function beAllRoomPaymentsTotal() {
  var rooms = beSelectedRooms();
  if (rooms.length > 1) {
    var total = 0;
    for (var i = 0; i < rooms.length; i++) {
      var rn = String(rooms[i].a != null ? rooms[i].a : rooms[i].e);
      total += beRoomPaymentsSum(rn);
    }
    return total;
  }
  return bkStatePaymentSum();
}

// Changing the advance payments only affects Balance Due (no full recalculation).
window.beUpdateBalanceDue = function () {
  var b = document.getElementById("beBalanceDue");
  if (!b) return;
  // Same rule as beRecalc: with no stay range or no room there is nothing to be
  // due against, so a receipt must not leave a negative balance on a form whose
  // totals are (correctly) blank.
  if (!beStayRangeComplete() || !beSelectedRooms().length) {
    b.value = "";
    return;
  }
  var totalAfterDiscount =
    parseFloat(document.getElementById("beTotalAfterDiscount")?.value) ||
    parseFloat(document.getElementById("bePayable")?.value) ||
    0;
  b.value = Math.round(totalAfterDiscount - bePaymentsSum());
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

// Sum of one room's own receipts.
function beRoomPaymentsSum(roomId) {
  var list = (bookingState.roomPayments || {})[String(roomId)] || [];
  var sum = 0;
  for (var i = 0; i < list.length; i++) {
    var v = parseFloat(list[i] && list[i].j) || 0;
    if (v > 0) sum += v;
  }
  return sum;
}

// Every room's receipts, for a combination. Nothing is pro-rated: each room
// shows exactly what the operator entered against it.
function beAllRoomPaymentsHtml() {
  var rooms = beSelectedRooms();
  if (rooms.length < 2) return "";
  var h =
    '<div class="be-room-payments mt-3">' +
    '<div class="fw-bold text-emr-dark mb-2"><i class="fas fa-money-bill-wave text-gold me-1"></i>Payments by Room</div>';
  for (var i = 0; i < rooms.length; i++) {
    var rr = rooms[i];
    var roomNum = String(rr.a != null ? rr.a : rr.e);
    var list = (bookingState.roomPayments || {})[roomNum] || [];
    h +=
      '<div class="be-room-pay">' +
      '<div class="be-room-pay-head">' +
      "<b>" +
      escHtml(htRoomName(rr)) +
      "</b>" +
      '<span class="text-gray text-sm ms-1">Room ' +
      escHtml(rr.e != null ? rr.e : roomNum) +
      "</span>" +
      '<span class="ms-auto text-sm">received ₹' +
      fmtAmt(beRoomPaymentsSum(roomNum)) +
      "</span></div>" +
      '<div class="mt-1" id="beRoomPayRows_' +
      escAttr(roomNum) +
      '">' +
      payRowsHTML(list) +
      "</div>" +
      '<button type="button" class="btn-premium btn-premium-secondary btn-premium-sm mt-1" onclick="openRcptPmtModal(\'' +
      escAttr(roomNum) +
      '\')">' +
      '<i class="fas fa-receipt me-1"></i> Receipt / Payment for this room</button>' +
      "</div>";
  }
  h += "</div>";
  return h;
}

function renderBeRoomPayments() {
  var block = beAllRoomPaymentsHtml();
  var bk = document.getElementById("bkRoomPayments");
  if (bk) bk.innerHTML = block;
  var be = document.getElementById("beRoomPayments");
  if (be) be.innerHTML = block;
}

// Payment block: read-only advance payments list fed by the Receipt/Payment
// modal, plus an auto Balance Due. Blocks guarded by adv. Payment Status is
// deliberately absent - the bill derives it from the amounts paid
// (see billStatusOf in bill.js), so no manual value can contradict them.
function renderPaymentBlock(total) {
  var roomsSel = beSelectedRooms();
  // A combination stores one row per room, so the operator enters one payment
  // list per room and the combined balance is the sum of the room balances.
  var due;
  if (roomsSel.length > 1) {
    var received = 0;
    for (var ri = 0; ri < roomsSel.length; ri++) {
      var rn = String(roomsSel[ri].a != null ? roomsSel[ri].a : roomsSel[ri].e);
      received += beRoomPaymentsSum(rn);
    }
    due = total - received;
  } else {
    due = total - bkStatePaymentSum();
  }
  var h =
    '<div class="card-premium p-3 mb-3">' +
    '<div class="d-flex align-items-center gap-2 mb-2">' +
    '<i class="fas fa-money-bill-wave text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:14px;">Payment</span>' +
    '<span class="ms-auto text-gray text-sm">Total Payable: ₹' +
    fmtAmt(total) +
    "</span></div>";
  if (!isABHidden("adv")) {
    if (roomsSel.length > 1) {
      h += '<div id="bkRoomPayments">' + beAllRoomPaymentsHtml() + "</div>";
    } else {
      h +=
        '<button type="button" class="btn-premium btn-premium-secondary btn-premium-sm" onclick="openRcptPmtModal()">' +
        '<i class="fas fa-receipt me-1"></i> Receipt / Payment</button>' +
        '<div id="bkPaymentRows" class="mt-2">' +
        payRowsHTML(bookingState.payments) +
        "</div>" +
        paymentUpdateBtnHTML();
    }
  }
  h +=
    '<div class="form-row-premium mb-2 mt-2">' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Balance Due (₹)</label>' +
    '<input type="text" id="bkBalanceDue" value="' +
    Math.round(due) +
    '" readonly class="form-control-premium fw-bold" style="background:#F6F8FA;">' +
    "</div></div>";
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
        roomIds: [],
        packageId: 1,
        addonIds: [],
        extraParticular: "",
        extraCharges: 0,
        payments: [],
        roomPayments: {},
        payStatus: "",
        guestCId: 0,
        discountPercent: 0,
        discountAmt: 0,
        discountSource: "amt",
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
  // facility-charges envelope in l, not the pre-save form state. payload0.p is
  // an ARRAY (one row per booked room), so the envelope has to be read per row
  // and merged: a single room carries the whole selection, while a combination
  // has the stay's lines split across its rooms by htSplitFacilityLines.
  var cfgAll = window[my1uzr.worknOnPg]?.clientConfig || {};
  var adonsSrc = Array.isArray(cfgAll.adons) ? cfgAll.adons : [];
  var adtSrc = Array.isArray(cfgAll.adtnolChrgs) ? cfgAll.adtnolChrgs : [];
  var snapNights =
    built && built.calc && built.calc.nights ? Number(built.calc.nights) || 1 : 1;
  var calcRef = (built && built.calc) || {};
  var payloadRows = (built && built.payload)
    ? Array.isArray(built.payload)
      ? built.payload
      : [built.payload]
    : [];
  var env = { main: [], ado: [], adt: [], ac: 0 };
  // Merge lines that share a facility id across the rows of a combination, so
  // an add-on is listed once for the stay at its full amount rather than once
  // per room at a pro-rated share.
  function mergeFacilityLines(lines) {
    var byId = [];
    (lines || []).forEach(function (en) {
      var id = Number(en && en.a);
      var amt = Number(en && en.b) || 0;
      if (!id) return;
      var found = null;
      for (var mi = 0; mi < byId.length; mi++) {
        if (byId[mi].a === id) { found = byId[mi]; break; }
      }
      if (found) found.b = (Number(found.b) || 0) + amt;
      else byId.push({ a: id, b: amt });
    });
    return byId;
  }
  payloadRows.forEach(function (prow, pri) {
    if (!prow) return;
    var pe = parseBookingFacilityL(prow.l);
    if (pri === 0) {
      env.ac = pe.ac || 0;
      env.main = pe.main || [];
    } else if (pe.ac) {
      env.ac = env.ac || pe.ac;
    }
    env.ado = env.ado.concat(pe.ado || []);
    env.adt = env.adt.concat(pe.adt || []);
  });
  env.ado = mergeFacilityLines(env.ado);
  env.adt = mergeFacilityLines(env.adt);
  // htSplitFacilityLines can drop a share that rounds to zero; fall back to the
  // priced total whenever the merged lines do not add up to what was charged.
  var mergedAddonCost = env.ado.reduce(function (a, e) {
    return a + (Number(e.b) || 0) * snapNights;
  }, 0);
  if (
    Number(calcRef.addonsTotal) > 0 &&
    Math.round(mergedAddonCost) !== Math.round(calcRef.addonsTotal)
  ) {
    env.ado = [{ a: 0, b: Number(calcRef.addonsTotal) / Math.max(1, snapNights) }];
  }
  var mergedExtraCost = env.adt.reduce(function (a, e) {
    return a + (Number(e.b) || 0);
  }, 0);
  if (
    Number(calcRef.extraCharges) > 0 &&
    Math.round(mergedExtraCost) !== Math.round(calcRef.extraCharges)
  ) {
    env.adt = [{ a: 0, b: Number(calcRef.extraCharges) }];
  }
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
  var roomsBuilt = (built && built.rooms) || (built && built.room ? [built.room] : []);
  var roomNameBuilt = roomsBuilt
    .map(function (r) {
      return htRoomName(r);
    })
    .join(" + ");
  var roomRateSum = 0;
  for (var rbq = 0; rbq < roomsBuilt.length; rbq++) {
    roomRateSum += parseInt(htRoomRate(roomsBuilt[rbq])) || 0;
  }
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
    rooms: roomsBuilt,
    room: roomsBuilt[0] || null,
    roomCount: roomsBuilt.length,
    isCombo: roomsBuilt.length > 1,
    roomName: roomNameBuilt,
    roomRate: roomRateSum,
    roomStatus: roomsBuilt.length
      ? htRoomStatusLabel(roomsBuilt[0].d != null ? roomsBuilt[0].d : roomsBuilt[0].k)
      : "",
    pkgName: built.pkg ? built.pkg.e : "",
    addons: addonRows,
    extraRows: extraRows,
    extraParticular: extraNames.join(", "),
    extraCharges: extraTotal,
    calc: built.calc,
    gst: htGstRate(),
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

function buildBookingPayload() {
  // payload0 is a shared global: the guest-search flows (fn 36 / entity crud)
  // can leave a guest object in payload0.c. The booking payload must not
  // can leave leftover keys. Reset to the set_owner base keys only
  // (eo/ec/fi/fk/mk) before assembling the booking request.
  clearPayload0();
  var rooms = beSelectedRooms();
  var room = rooms[0] || null;
  var pkg = getPackageById(bookingState.packageId);
  var nights = calcNights(bookingState.checkin, bookingState.checkout) || 1;
  var addons = getComputedAddons();
  var cfgAllRm = window[my1uzr.worknOnPg].clientConfig || {};
  var cfg = cfgAllRm.HT_CFG || {};
  var childAges = [];
  var childRates = [];
  for (var i = 0; i < bookingState.children.length; i++) {
    var child = bookingState.children[i];
    var age = parseInt(child && child.ag) || 0;
    childAges.push(age);
    childRates.push(Math.max(0, parseFloat(child && child.c) || 0));
  }
  // Priced once for the whole stay, with the rooms pooled, so a combination
  // is never charged as several independent bookings.
  var calc = beCalculateTotal(
    rooms,
    nights,
    addons,
    bookingState.extraCharges,
    bookingState.children,
    pkg ? pkg.g : 0,
  );
  var occupancy = calc.occupancy;
  var paidChildren = occupancy.paidChildren;
  var freeChildren = occupancy.freeChildren;

  // 1. Stay-level facility lines. The guest-count charges (extra adult / paid
  //    child) are added per room by the shared row writer, so only the
  //    stay-level selections are assembled here and then spread over the set.
  var ado = [];
  var adt = [];
  if (rooms.length) {
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

  // 4. Extras breakdown [[id, amount]] carried on every row's guest block.
  var extraBreakdown = [];
  for (var eb = 0; eb < (bookingState.extraItems || []).length; eb++) {
    extraBreakdown.push([
      Number(bookingState.extraItems[eb].id) || 0,
      parseFloat(bookingState.extraItems[eb].amount) || 0,
    ]);
  }

  // 5. Advance payments. Each r record keeps the full row shape produced by the
  //    Receipt/Payment modal (e, f, g, h, i, j, k, l, m, n, o, tb, td) so the
  //    server stores them, mirroring updateBillPayments. The temp client id (a)
  //    is not sent - it is only a local modal counter.
  function beNormalisePayments(payList) {
    var out = [];
    for (var pi = 0; pi < (payList || []).length; pi++) {
      var pm = payList[pi] || {};
      var pj = parseFloat(pm.j) || 0;
      var piMode = pm.i != null ? String(pm.i) : "";
      // Transaction id from l.td alone. pm.td is the booking link on any row read
      // back from the server, so preferring it here wrote the booking id over the
      // real transaction id every time an edited booking was re-saved.
      var pt = receiptTxnId(pm);
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
      if (pt || rec.l != null) {
        // A parsed copy of the stored envelope, so the other configured extra
        // fields survive instead of being dropped by a bare {}.
        rec.l = receiptEnvelopeWithTxn(rec, pt);
      }
      out.push(rec);
    }
    return out;
  }

  // One snapshot describing the whole stay, priced once. buildBookingRoomParts
  // then splits it into one financial part per selected room.
  var discountAmt = bookingState.discountAmt || 0;
  var snapRooms = rooms.map(function (rr) {
    return {
      id: rr.a != null ? rr.a : rr.e,
      e: rr.e != null ? rr.e : rr.a,
      name: htRoomName(rr),
      pricePerNight: Number(htRoomRate(rr)) || 0,
      record: rr,
    };
  });
  var roomNightCosts = rooms.map(function (rr) {
    var rates = adminRoomRates(rr, nights) || [];
    var sum = 0;
    for (var ni = 0; ni < rates.length; ni++) sum += Number(rates[ni]) || 0;
    return { cost: Math.round(sum) };
  });
  var staySnap = {
    rooms: snapRooms,
    room: snapRooms[0] || null,
    nights: nights,
    roomNightCosts: roomNightCosts,
    occupancy: occupancy,
    adults: bookingState.adults,
    childAges: occupancy.childAges,
    childRates: calc.childRates || [],
    extraAdultsRate: cfg.extraAdultsCharge || 0,
    childRate: cfg.paidChildCharge || 0,
    packageCost: calc.pkgAmount || 0,
    addonCost: calc.addonsTotal || 0,
    extraCharges: calc.extraCharges || 0,
    discountAmt: discountAmt,
    gst: calc.gst != null ? calc.gst : htGstRate(),
    tax: calc.tax,
    grandTotal: Math.round(Math.max(0, calc.total - discountAmt)),
  };
  var stayParts = buildBookingRoomParts(staySnap);
  if (!stayParts.length) {
    showMessageModal("Info", "Could not price the selected rooms.", false);
    return null;
  }

  // The operator enters each room's own receipts; a single room keeps using the
  // one combined list. Nothing is pro-rated across the set for them.
  var roomPayMap = bookingState.roomPayments || {};
  var perRoomPayments = stayParts.map(function (part) {
    var list = roomPayMap[part.roomId];
    if (Array.isArray(list) && list.length) return beNormalisePayments(list);
    if (stayParts.length === 1) return beNormalisePayments(bookingState.payments);
    return [];
  });

  // 6. One row per room. p.e is a single room id string, so a single room
  //    looks exactly like it did before and a combination is a list of rows.
  payload0.p = buildBookingRoomRows(staySnap, {
    bookingDtt: bookingDtt,
    checkin: bookingState.checkin,
    checkout: bookingState.checkout,
    actualCheckin: actualCheckin,
    actualCheckout: actualCheckout,
    packageId: bookingState.packageId || 0,
    includeRoomRate: false,
    extraBreakdown: extraBreakdown,
    addonShares: htSplitFacilityLines(ado, stayParts.length),
    extraShares: htSplitFacilityLines(adt, stayParts.length),
    chargeWithAc: bookingState.chargeWithAc,
    bookerId: bookingState.guestCId || 0,
    specialRequests: bookingState.specialRequests || null,
    payments: perRoomPayments,
  });
  if (!payload0.p || !payload0.p.length) {
    showMessageModal("Info", "Could not price the selected rooms.", false);
    return null;
  }

  // Hidden-field cleanup: gated keys are deleted so nothing hidden is sent.
  function delP(key) {
    for (var ri = 0; ri < payload0.p.length; ri++) delete payload0.p[ri][key];
  }
  if (isABHidden("room")) delP("e");
  if (isABHidden("timein")) delP("i");
  if (isABHidden("timeout")) delP("j");
  if (isABHidden("guest")) delP("k");
  if (isABHidden("addon") && isABHidden("extra")) delP("l");
  if (isABHidden("discount")) delP("n");
  if (isABHidden("special")) delP("q");
  if (isABHidden("adv")) delP("r");
  var built = {
    room: room,
    rooms: rooms,
    pkg: pkg,
    calc: calc,
    parts: stayParts,
    // The stay snapshot the rows and the bill's per-room shares were built from.
    // buildLastSnap spreads it so the shared bill renderer can re-derive those
    // same shares without knowing anything about the admin booking form.
    staySnap: staySnap,
  };
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
  payload0.fn = 112;

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
        adminSendBookingStatusMail(savedBookingIdsFromResp(resp), "save");
        setTimeout(function () {
          // A combination is one row per room, so the save answers with one id
          // per room (x1 is a list like ["55","56"]) - print every created row
          // of the stay, one bill at a time.
          var billQueue = printBillsFromDashboard(
            savedBookingIdsFromResp(resp),
          );
          if (billQueue && typeof billQueue.catch === "function") {
            billQueue.catch(function (e) {
              console.warn("Bill printing failed:", e);
            });
          }
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
  for (var ri = 0; ri < payload0.p.length; ri++) delete payload0.p[ri].r;
  payload0.vw = 1;
  payload0.fn = 114;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
    { tb: "rb" },
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
      var idsUpd = savedBookingIdsFromResp(resp);
      if (!idsUpd.length && bookingId) idsUpd = [String(bookingId)];
      adminSendBookingStatusMail(idsUpd, "update");
      showMessageModal("Success", "?o. Booking updated successfully!", false);
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
// legacy [[name, rate]] rows are also accepted. k.g is retained only for
// compatibility; oldest rows are reconstructed best-effort from the facility-
// charges envelope l = {l: [{a: facilityId, b: price}], ado: [...], adt: [...]}.
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
  bookingState.children = [];
  if (gk && Array.isArray(gk.e)) {
    var freeMaxCh = beChildFreeMax();
    var parsedLch = parseBookingFacilityL(raw.l);
    var childCharges = [];
    for (var ccx = 0; ccx < parsedLch.main.length; ccx++) {
      if (Number(parsedLch.main[ccx].a) === 8)
        childCharges.push(parseFloat(parsedLch.main[ccx].b) || 0);
    }
    // k.g is index-parallel with k.e and now carries each child's own rate, so
    // it is the source of truth. Rows saved before per-child rates existed have
    // an all-zero k.g and keep the old reading, which walked the a:8 lines onto
    // the over-age children in order (safe back then, because every billed
    // child shared one rate).
    var gkRates = Array.isArray(gk.g) ? gk.g : [];
    var gkHasRates = false;
    for (var gci = 0; gci < gk.e.length; gci++) {
      var gAge = parseInt(gk.e[gci]) || 0;
      if (gAge > Number(freeMaxCh) && (parseFloat(gkRates[gci]) || 0) > 0) {
        gkHasRates = true;
        break;
      }
    }
    var adultEquivalentPos = -1;
    for (var cgi = 0; cgi < gk.e.length; cgi++) {
      var age = parseInt(gk.e[cgi]) || 0;
      var isAdultEquivalent = age > Number(freeMaxCh);
      var rate = parseFloat(gkRates[cgi]) || 0;
      if (isAdultEquivalent) {
        adultEquivalentPos++;
        if (!gkHasRates && childCharges.length) {
          rate = childCharges[Math.min(adultEquivalentPos, childCharges.length - 1)] || 0;
        }
      }
      // A saved 0 is "nothing was billed for this child", not "the operator
      // waived it" - k.g has always stored an all-zero list for a booking that
      // predates per-child rates, and a child the pool seats inside its included
      // capacity writes no a:8 line at all. Restoring it as a decided 0 would
      // freeze that free state, so a later occupancy increase would go on not
      // charging the child. null puts it back in step with the pool.
      bookingState.children.push({ n: "", ag: age, c: rate > 0 ? rate : null });
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
      bookingState.payments = await loadBookingReceipts(record.a, raw);
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
    // Restore the booking's saved receipts (table r, td filtered, else the
    // row's own p.r) so the Summary payment block, the Receipt/Payment modal
    // and the Update Payments button stay in sync.
    bookingState.payments = await loadBookingReceipts(record.a, rawW);
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
    .be-cal-leg{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;padding-top:8px;border-top:1px solid var(--gray-bg,#EEE8DA);font-size:11px;color:var(--brown,#8A5A2B);}
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
    // Same as selectBookingGuestEntry: the summary must describe the party that
    // is now on the form, not the one that was there when it was last priced.
    if (typeof beRecalc === "function") beRecalc();
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
    var selCount = beSelectedRoomIds().length;
    var singleRoom = beSingleRoomOnly();
    h +=
      '<div class="col-12 col-sm-6 col-lg-4">' +
      '<label class="form-label-premium">Room' +
      (selCount > 1 && !singleRoom
        ? ' <span class="badge-premium badge-premium-gold">' +
          selCount +
          " rooms · combination</span>"
        : "") +
      ' <span class="required">*</span></label>' +
      '<div class="be-room-wrap">' +
      '<select id="beRoom"' +
      (singleRoom ? "" : " multiple") +
      ' size="' +
      (singleRoom || selCount <= 1 ? 1 : Math.min(4, selCount)) +
      '" class="form-select-premium fw-bold" onchange="beRoomChanged()"' +
      (singleRoom
        ? ""
        : ' title="Hold Ctrl / Cmd to pick more than one room"') +
      ">" +
      opts +
      "</select>" +
      '<label class="be-ac-check' +
      (bookingState.chargeWithAc ? " on" : "") +
      '" title="Charge room with AC">' +
      '<input type="checkbox" id="beRoomAc"' +
      (bookingState.chargeWithAc ? " checked" : "") +
      ' onchange="beRoomAcChanged()">AC</label></div>' +
      '<div class="form-hint mt-1">' +
      (singleRoom
        ? "One room per booking."
        : "Up to 3 rooms. A combination is saved as one row per room.") +
      "</div>" +
      "</div>";
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
    '<button type="button" class="btn-premium btn-premium-primary" onclick="(async () => { await loadExe2Fn(36, [\'no-loader-element\', 1, \'modalContentForEntInd\', \'commonFnToRunAfter_op_ViewCall\', 1, typeof window[my1uzr.worknOnPg].clientConfig.xtraEiFlds_ei_admin_srchGuest !== \'undefined\' ? window[my1uzr.worknOnPg].clientConfig.xtraEiFlds_ei_admin_srchGuest : null], [1]); })()">' +
    '<i class="fas fa-search me-1"></i> Select Guest</button></div>' +
    '</div>' +
    "</div></div></div>";
  return h;
}

// ---- Custom calendar (booked dates from rb table shown red & disabled) ----
// Keyed by the whole selected room set (ids sorted, comma-joined), so a
// combination resolves to a single entry holding the union of its rooms' dates.
var beBookedDatesCache = {};

function beNormalizeRoomIds(value) {
  var list = Array.isArray(value) ? value : value == null ? [] : [value];
  var out = [];
  for (var i = 0; i < list.length; i++) {
    var v = list[i];
    if (v == null || v === "") continue;
    if (Array.isArray(v)) {
      var nested = beNormalizeRoomIds(v);
      for (var n = 0; n < nested.length; n++) {
        if (out.indexOf(nested[n]) === -1) out.push(nested[n]);
      }
      continue;
    }
    var s = String(v);
    if (s === "" || s === "0") continue;
    if (out.indexOf(s) === -1) out.push(s);
  }
  return out;
}

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

// A stay can only be priced once both ends of the range are set and check-out
// is genuinely after check-in. The range calendar can leave check-in alone (a
// first pick with no till yet) and the room picker clears both, so this is the
// single test the Billing Summary uses to decide there is nothing to price.
function beStayRangeComplete() {
  var ci = beNormalizeDate(bookingState.checkin);
  var co = beNormalizeDate(bookingState.checkout);
  return !!(ci && co && co > ci);
}

// Every selected room's booked nights, merged. Accepts one room id or a set
// (array) of them: a combination shares a single stay range across every room,
// so the union is what it must be blocked on — a night taken in any one of the
// rooms is unavailable to the whole set.
async function beLoadBookedDates(roomIds) {
  var ids = beNormalizeRoomIds(roomIds);
  var key = ids.slice().sort().join(",");
  var map = {};
  if (!key) return map;
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
      if (ids.indexOf(String(rid)) === -1) continue;
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

// The rooms a calendar instance has to account for. A combination shares one
// stay range across all of its rooms, so the calendar must block the union of
// every one of them — not just the room the rest of the views are pointed at
// (bookingState.roomId only ever holds the first of the set).
function beCalendarRoomIds(inputId) {
  if (inputId === "beCheckinPublic") {
    // The public summary-sheet field. comboSelection is the source of truth for
    // a booked set and falls back to the single viewed room, but the admin
    // modal and the fire-and-forget openRoomBooking() seed can leave
    // bookingState.roomId stale or 0, so it is only the last resort.
    if (typeof selectedComboRooms === "function") {
      var comboIds = beNormalizeRoomIds(
        selectedComboRooms().map(function (r) {
          return typeof publicRoomId === "function" ? publicRoomId(r) : r && r.id;
        }),
      );
      if (comboIds.length) return comboIds;
    }
    if (typeof getRoom === "function") {
      var pubRoom = getRoom();
      if (pubRoom) {
        var pubId = beNormalizeRoomIds([
          pubRoom.a != null
            ? pubRoom.a
            : pubRoom.e != null
              ? pubRoom.e
              : pubRoom.id,
        ]);
        if (pubId.length) return pubId;
      }
    }
    return beNormalizeRoomIds([
      typeof bookingState !== "undefined" ? bookingState.roomId : 0,
    ]);
  }
  // The admin form field: every room of the multi-select.
  if (typeof beSelectedRoomIds === "function") {
    var ids = beNormalizeRoomIds(beSelectedRoomIds());
    if (ids.length) return ids;
  }
  return beNormalizeRoomIds([
    typeof bookingState !== "undefined" ? bookingState.roomId : 0,
  ]);
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

  // One room is a 1-item set, so the single-room and combination cases take the
  // same path: the union of the selected rooms' booked nights.
  var bookRoomIds = beCalendarRoomIds(inputId);

  var monthDate = bookingState.checkin
    ? new Date(bookingState.checkin + "T00:00:00")
    : new Date();
  var pop = document.createElement("div");
  pop.id = "beCalPopup";
  pop.dataset.beInput = inputId;
  pop.dataset.beRoomCount = String(bookRoomIds.length);
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

  beLoadBookedDates(bookRoomIds)
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

  var roomCount = parseInt(pop.dataset.beRoomCount, 10) || 0;
  pop.innerHTML =
    '<div class="be-cal-months">' +
    firstMonth.html +
    secondMonth.html +
    "</div>" +
    '<div class="be-cal-leg">' +
    '<span><i class="lg-booked"></i>Booked (disabled)</span>' +
    '<span><i class="lg-in"></i>Selected stay</span>' +
    (roomCount > 1
      ? "<span>" + roomCount + " rooms combined \u2014 a date booked in any room is disabled</span>"
      : "") +
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
  var noSel = beSelectedRoomIds().length === 0;
  // The placeholder carries `selected` while nothing is picked. A non-multiple
  // size=1 select with no selected option auto-selects the first NON-disabled
  // one, which used to pre-fill the first real room on init - a room the
  // operator never chose, yet beRoom.value fed straight into bookingState.roomId
  // and beSelectedRoomIds fell back to it. Disabled keeps it un-committable.
  var opts =
    '<option value="" disabled' +
    (noSel ? " selected" : "") +
    ">Select Room</option>";
  for (var t = 0; t < typeOrder.length; t++) {
    var type = typeOrder[t];
    var rooms = groups[type];
    if (!rooms || !rooms.length) continue;
    opts += '<optgroup label="' + escHtml(type) + '">';
    for (var j = 0; j < rooms.length; j++) {
      var r = rooms[j];
      var num = r.e != null ? r.e : '';
      var num2 = r.a != null ? r.a : '';
      var sel = beSelectedRoomIds().indexOf(String(num2)) !== -1;
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
        var sel = beSelectedRoomIds().indexOf(String(num2)) !== -1;
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
  var maxCh = beMaxChildren();
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
      '<div class="col-6 col-sm-6 col-lg-6">' +
      '<label class="form-label-premium">Adult Guests</label>' +
      '<input type="text" id="beMale" min="0" max="9" class="form-control-premium" value="' +
      bookingState.male +
      '" oninput="beRecalc()"></div>' +
      '<div class="col-4 col-sm-6 col-lg-4 d-none">' +
      '<label class="form-label-premium">Female</label>' +
      '<input type="text" id="beFemale" min="0" max="9" class="form-control-premium" value="' +
      bookingState.female +
      '" oninput="beRecalc()"></div>' +
      '<div class="col-6 col-sm-6 col-lg-6">' +
      '<label class="form-label-premium">Total Guests</label>' +
      '<input type="text" id="beTotalGuests" class="form-control-premium fw-bold be-readonly border-0" readonly></div>';
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
      htGstRate() +
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
    if (beSelectedRooms().length > 1) {
      h +=
        '<div class="col-12">' +
        '<div id="beRoomPayments">' +
        beAllRoomPaymentsHtml() +
        "</div></div>";
    } else {
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
  }
  h +=
    '<div class="col-8">' +
    '<label class="form-label-premium">Balance Due (₹)</label>' +
    '<input type="text" id="beBalanceDue" class="form-control-premium fw-bold be-total-read" readonly></div>';
  h += "</div></div></div>";
  return h;
}

// The save button is the same button whether the form is creating or updating,
// and beSaveLoading has to put the caption back when it clears the spinner.
// Deriving it in one place keeps "Update Entry" from turning into "Save Entry"
// the moment a save attempt finishes.
function beSaveBtnLabel() {
  return (
    '<i class="fas fa-check-circle me-1"></i> ' +
    (bookingState && bookingState.editBookingId ? "Update Entry" : "Save Entry")
  );
}

function beActionBar() {
  return (
    '<div class="be-actions">' +
    '<button type="button" class="btn-premium btn-premium-secondary" onclick="beSearchGuest()">' +
    '<i class="fas fa-search me-1"></i> Search</button>' +
    '<button type="button" class="btn-premium btn-premium-secondary" onclick="beClear()">' +
    '<i class="fas fa-eraser me-1"></i> Clear Form</button>' +
    '<button type="button" id="beSaveBtn" class="btn-premium btn-premium-primary" onclick="beSave()">' +
    beSaveBtnLabel() +
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

// A child's age, or the configured default when the box is blank or out of
// range. Every reader runs the age through this one helper so the box, the state
// and the priced record can never disagree about how old a child is.
function beChildAgeOrDefault(raw) {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var maxAge = cfg.childAgeMax != null ? cfg.childAgeMax : 17;
  var def = cfg.defaultChildAge != null ? cfg.defaultChildAge : 5;
  var age = parseInt(raw);
  if (isNaN(age) || age < 0 || age > maxAge) return def;
  return age;
}

function beReadChildren() {
  var rows = document.querySelectorAll("#beChildRows .ht-child-row");
  var children = [];
  // Exactly one entry per row, index-aligned with bookingState.children and with
  // the prefill beChildRatePrefill builds. A row is never skipped for an
  // unreadable age: dropping it used to shift every later index, so a rate could
  // be priced onto the wrong child.
  for (var i = 0; i < rows.length; i++) {
    var age = beChildAgeOrDefault(rows[i].querySelector(".beChildAge")?.value);
    var rateEl = rows[i].querySelector(".beChildRate");
    // null = the operator has not chosen a rate for this child, which
    // beCalculateTotal resolves from beChildRatePrefill. Coercing it to 0 here
    // read every untouched child as a deliberate "do not charge" and silently
    // dropped the default paidChildCharge.
    var rate =
      rateEl && rateEl.getAttribute("data-seeded") !== "1"
        ? Math.max(0, parseFloat(rateEl.value) || 0)
        : null;
    children.push({ n: "", ag: age, c: rate });
  }
  return children;
}

window.beSetChildCount = function () {
  var count = parseInt(document.getElementById("beChildCount")?.value) || 0;
  while (bookingState.children.length < count) {
    bookingState.children.push({
      n: "",
      ag: "",
      // null = no rate chosen yet, so the row seeds from beChildRatePrefill.
      // A number (including 0) is an explicit operator choice and is kept.
      c: null,
    });
  }
  bookingState.children.length = count;
  beRenderChildRows();
  beRecalc();
};

// Fingerprint of everything the child rows are derived from. The rates are
// deliberately excluded: typing in a rate box must never re-render that box, so
// only a genuine occupancy change - rooms, guest counts, ages or the policy -
// refreshes the rows.
function beChildOccSignature() {
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var rows = document.querySelectorAll("#beChildRows .ht-child-row");
  var ages = [];
  for (var i = 0; i < rows.length; i++)
    ages.push(beChildAgeOrDefault(rows[i].querySelector(".beChildAge")?.value));
  var male = parseInt(document.getElementById("beMale")?.value) || 0;
  var female = parseInt(document.getElementById("beFemale")?.value) || 0;
  return [
    beSelectedRoomIds().join(","),
    // Only the total reaches beBookingOccupancy, so the male/female split is
    // left out: re-splitting the same party must not rewrite the rate boxes.
    String(male + female),
    ages.join(","),
    beChildFreeMax(),
    cfg.paidChildCharge || 0,
  ].join("|");
}

// Re-prices every child row against the current occupancy: the free /
// adult-equivalent badges and the rate boxes are refreshed in place, leaving the
// age boxes untouched so a half-typed age keeps its focus and caret.
function beSyncChildRowsToOccupancy() {
  var rows = document.querySelectorAll("#beChildRows .ht-child-row");
  if (!rows.length) return;
  var freeMax = beChildFreeMax();
  // The boxes hold what the operator typed, the state holds what gets priced.
  // Ages are synced first so the prefill below splits the pool on the real ages.
  for (var i = 0; i < rows.length; i++) {
    var child = bookingState.children[i];
    if (child)
      child.ag = beChildAgeOrDefault(
        rows[i].querySelector(".beChildAge")?.value,
      );
  }
  var prefill = beChildRatePrefill();
  for (var r = 0; r < rows.length; r++) {
    var zone = rows[r].querySelector(".beChildStatusZone");
    var kid = bookingState.children[r];
    if (!zone || !kid) continue;
    var over = parseInt(kid.ag, 10) > freeMax;
    var decided = kid.c != null && parseFloat(kid.c) >= 0;
    var rate = over
      ? decided
        ? Math.max(0, parseFloat(kid.c) || 0)
        : Math.max(0, parseFloat(prefill[r]) || 0)
      : 0;
    zone.outerHTML =
      !over
        ? beChildFreeZoneHTML()
        : (decided || rate > 0)
          ? beChildStatusZoneHTML(r, rate, !decided)
          : beChildAdultEquivalentZoneHTML();
  }
}

function beRenderChildRows() {
  var wrap = document.getElementById("beChildRows");
  if (!wrap) return;
  var count = bookingState.children.length;
  if (count === 0) {
    wrap.innerHTML = '<div class="text-sm text-gray">No children.</div>';
    bookingState.childOccSig = beChildOccSignature();
    return;
  }
  var cfg = window[my1uzr.worknOnPg].clientConfig?.HT_CFG || {};
  var maxAge = cfg.childAgeMax != null ? cfg.childAgeMax : 17;
  var freeMax = beChildFreeMax();
  var defaultAge = cfg.defaultChildAge != null ? cfg.defaultChildAge : 5;
  var prefill = beChildRatePrefill();
  var h = "";
  for (var i = 0; i < count; i++) {
    var c = bookingState.children[i];
    var age = (c.ag !== "" && c.ag !== undefined) ? c.ag : defaultAge;
    var isAdultEquivalent = parseInt(age) > freeMax;
    var decided = c.c != null && parseFloat(c.c) >= 0;
    // A rate the operator chose always wins and keeps its box, including an
    // explicit 0. An undecided child follows the pool, where 0 means the pooled
    // capacity seats it for free - so that child keeps the adult-equivalent badge
    // but gets no rate box, since there is nothing to price.
    var rate = isAdultEquivalent
      ? decided
        ? Math.max(0, parseFloat(c.c) || 0)
        : Math.max(0, parseFloat(prefill[i]) || 0)
      : 0;
    h +=
      '<div class="ht-child-row">' +
      '<span class="badge-premium badge-premium-emr">Child ' +
      (i + 1) +
      "</span>" +
      '<input type="number" class="form-control-premium beChildAge" min="0" max="' + maxAge + '" value="' +
      age +
      '" style="max-width:120px;" oninput="beChildAgeChanged(this,' + i +
      ')" onchange="beChildAgeSettled(this,' + i +
      ')">' +
      (!isAdultEquivalent
        ? beChildFreeZoneHTML()
        : (decided || rate > 0)
          ? beChildStatusZoneHTML(i, rate, !decided)
          : beChildAdultEquivalentZoneHTML()) +
      "</div>";
  }
  wrap.innerHTML = h;
  // The rows now show this occupancy, so record it and spare beRecalc a second
  // pass that would only rewrite the zones to the same markup.
  bookingState.childOccSig = beChildOccSignature();
}

function beChildFreeZoneHTML() {
  return (
    '<span class="beChildStatusZone"><span class="badge-premium badge-premium-emr" ' +
    'style="font-size:11px;">free</span></span>'
  );
}

// An over-age child the pooled capacity still seats: a genuine adult-equivalent
// guest, but with nothing to price, so the row carries the badge alone and no
// rate box. Matches bkChildStatusZoneHTML so both views render the same.
function beChildAdultEquivalentZoneHTML() {
  return (
    '<span class="beChildStatusZone">' +
    '<span class="badge-premium badge-premium-gold" style="font-size:11px;">adult-equivalent</span>' +
    "</span>"
  );
}

// `seeded` marks a rate that came from the occupancy prefill rather than from
// the operator. beReadChildren reports a seeded box back as null, so the
// prefill keeps tracking occupancy instead of freezing into a chosen rate the
// first time the row is read.
function beChildStatusZoneHTML(idx, rate, seeded) {
  var v = Math.max(0, parseFloat(rate) || 0);
  return (
    '<span class="beChildStatusZone" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">' +
    '<span class="badge-premium badge-premium-gold" style="font-size:11px;">adult-equivalent</span>' +
    '<label class="form-label-premium" style="font-size:10px;margin:0;line-height:1.1;">Rate / night</label>' +
    '<input type="number" class="form-control-premium beChildRate" min="0" step="1" ' +
    'style="max-width:92px;padding:5px 6px;font-size:12px;" value="' +
    v +
    '" data-seeded="' +
    (seeded ? "1" : "0") +
    '" oninput="beChildRateChanged(this,' +
    idx +
    ')">' +
    '<span class="text-gray" style="font-size:10px;">per night</span>' +
    "</span>"
  );
}

// A new age re-splits the pooled capacity across every child, since the pool
// gives its included slots to the adults first and then to the over-age
// children in order. So every badge and rate box is refreshed, not just this
// row's; beRecalc does that pass. The age is kept in state and the box is left
// alone, because rewriting it here would fight an operator clearing the field
// to retype.
function beChildAgeChanged(input, idx) {
  var child = bookingState.children[idx];
  if (child) child.ag = beChildAgeOrDefault(input.value);
  beRecalc({ skipRoomRebuild: true });
}

// onchange fires once the age box loses focus, so a blank or out-of-range entry
// settles on the default visibly without interfering with typing.
window.beChildAgeSettled = function (input, idx) {
  var age = beChildAgeOrDefault(input.value);
  var child = bookingState.children[idx];
  if (child) child.ag = age;
  if (parseInt(input.value) !== age) input.value = age;
  beRecalc({ skipRoomRebuild: true });
};

// The per-child rate is the authoritative money for that child: a non-zero rate
// is billed for that many nights, and 0 means the child is not charged at all.
// Typing clears the seeded marker, so the value becomes an operator decision
// that later occupancy changes no longer overwrite.
window.beChildRateChanged = function (input, idx) {
  var child = (bookingState.children || [])[idx];
  if (!child) return;
  child.c = Math.max(0, parseFloat(input.value) || 0);
  if (input.getAttribute) input.setAttribute("data-seeded", "0");
  beRecalc({ skipRoomRebuild: true });
};

// The room picker of the Booking Entry view. Single-select while one-room mode
// is on; otherwise a multi-select, so a stay can hold 2-3 rooms which are saved
// as one booking row per room.
window.beRoomChanged = function () {
  var el = document.getElementById("beRoom");
  var ids = [];
  if (el && el.options) {
    for (var i = 0; i < el.options.length; i++) {
      if (el.options[i].selected && el.options[i].value !== "")
        ids.push(String(el.options[i].value));
    }
  }
  // One room per booking: a picker rendered before the switch could still hold
  // several, so keep only the last (newly picked) one.
  if (beSingleRoomOnly() && ids.length > 1) ids = [ids[ids.length - 1]];
  if (ids.length > 3) {
    // Keep the first three and put the control back in step with the state.
    ids = ids.slice(0, 3);
    showMessageModal("Info", "A stay can hold at most 3 rooms.", false);
  }
  // A different set of rooms means the old per-room receipts no longer apply.
  if (ids.join(",") !== beSelectedRoomIds().join(",")) {
    bookingState.roomPayments = {};
    bookingState.payments = [];
  }
  bookingState.roomIds = ids;
  bookingState.roomId = ids.length ? ids[0] : 0;
  bookingState.checkin = "";
  bookingState.checkout = "";
  beRenderChildRows();
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
  // Refresh whichever field owns the open popup, so a public summary-sheet
  // calendar is not re-rendered against the admin form's #beCheckin.
  var input =
    pop.dataset.beInput === "beCheckinPublic"
      ? document.querySelector(".be-date-host #beCheckinPublic")
      : document.querySelector("#htContainer #beCheckin") ||
        document.getElementById("beCheckin");
  if (!input) return;
  var monthDate = bookingState.checkin
    ? new Date(bookingState.checkin + "T00:00:00")
    : new Date();
  // Re-resolve the set: a room being added or removed while the popup is open
  // changes which nights are occupied.
  var bookRoomIds = beCalendarRoomIds(pop.dataset.beInput);
  pop.dataset.beRoomCount = String(bookRoomIds.length);
  beLoadBookedDates(bookRoomIds).then(function (booked) {
    if (document.getElementById("beCalPopup") === pop) {
      beRenderCalendar(pop, input, monthDate, booked);
    }
  });
}

// Live totals: nights, total guests, room read-only fields, GST + payable,
// and balance due (auto) as the advance changes.
// The room picker is only rebuilt when the room set could actually have moved;
// a child-rate keystroke re-runs this for a value the picker does not show, and
// rebuilding it there would re-query every room against every booking per key.
function beRecalc(opts) {
  var skipRoomRebuild = !!(opts && opts.skipRoomRebuild);
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

  // Re-render the room picker when dates change to reflect availability. The
  // picker is a multi-select, so each selected room is re-applied after the
  // options are rebuilt and a room that is no longer available is dropped.
  var roomSelect = document.getElementById("beRoom");
  if (roomSelect && !skipRoomRebuild) {
    var keepIds = beSelectedRoomIds();
    roomSelect.innerHTML = beGetRoomOptions();
    var newOpts = roomSelect.options;
    var keptIds = [];
    for (var i = 0; i < newOpts.length; i++) {
      var optVal = String(newOpts[i].value);
      if (keepIds.indexOf(optVal) === -1) continue;
      if (newOpts[i].disabled && optVal !== String(bookingState.roomId)) continue;
      newOpts[i].selected = true;
      keptIds.push(optVal);
    }
    bookingState.roomIds = keptIds;
    bookingState.roomId = keptIds.length ? keptIds[0] : 0;
    // A dropped room shrinks the set the calendar blocks on, so an open popup
    // would be showing nights that are now free. Repaint it, but only on an
    // actual change: beRecalc runs on every keystroke and an unconditional
    // refresh would re-query the bookings table constantly.
    if (keptIds.join(",") !== keepIds.join(",")) {
      beRefreshOpenCalendar();
    }
  }

  var beAcEl = document.getElementById("beRoomAc");
  if (beAcEl) bookingState.chargeWithAc = beAcEl.checked;

  var room = getRoomById(bookingState.roomId);
  var beRooms = beSelectedRooms();
  var nights = calcNights(bookingState.checkin, bookingState.checkout);
  var male = parseInt(document.getElementById("beMale")?.value) || 0;
  var female = parseInt(document.getElementById("beFemale")?.value) || 0;
  bookingState.male = male;
  bookingState.female = female;
  bookingState.adults = male + female;
  // Changing the guest count re-splits the pooled capacity, so any child the
  // operator has not priced yet follows the new occupancy. This runs before the
  // children are read so the total is computed from the refreshed rows, and only
  // when the occupancy really moved - typing a rate leaves it alone.
  var occSig = beChildOccSignature();
  if (occSig !== bookingState.childOccSig) {
    beSyncChildRowsToOccupancy();
    bookingState.childOccSig = occSig;
  }
  var children = beReadChildren();

  // "Total Stay" is the operator's guide to the stay, not a money field, so it
  // reports the real count - 0 while the range is still open.
  var ts = document.getElementById("beTotalStay");
  if (ts) ts.value = nights > 0 ? nights + " night" + (nights === 1 ? "" : "s") : "";
  var tg = document.getElementById("beTotalGuests");
  if (tg) tg.value = male + female + children.length;

  var rn = document.getElementById("beRoomNumber");
  var rt = document.getElementById("beRoomType");
  var rs = document.getElementById("beRoomStatus");
  var rf = document.getElementById("beRoomTariff");
  if (room) {
    // A combination lists every room, so the read-only fields show the set.
    if (rn) rn.value = beRooms.map(function (r) { return r.e != null ? r.e : r.a; }).join(", ");
    if (rt) rt.value = beRooms.map(function (r) { return htRoomTypeLabel(r.i); }).join(", ");
    if (rs) rs.value = beRooms.map(function (r) { return htRoomStatusLabel(r.d != null ? r.d : r.k); }).join(", ");
    if (rf) {
      var beRateSum = 0;
      for (var bq = 0; bq < beRooms.length; bq++) beRateSum += parseInt(htRoomRate(beRooms[bq])) || 0;
      rf.value = beRateSum;
    }
  } else {
    [rn, rt, rs, rf].forEach(function (el) {
      if (el) el.value = "";
    });
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
  // No stay range yet (a fresh form, or the room picker has just been
  // re-picked, which clears the dates): price nothing and show nothing. A
  // provisional "1 night" total is what made the summary look wrong right
  // after a room change - it quoted a stay that did not exist. The discount is
  // deliberately left untouched here so a rupee amount the operator already
  // entered survives until the dates come back and it can be re-priced.
  // A room is the other half of that: with none picked the room rate list is
  // empty, so the only thing that could be quoted is extras + GST on a stay
  // that has no room in it. Same blank-out until both are in.
  var hasStay = beStayRangeComplete();
  var hasRoom = beRooms.length > 0;
  if (!hasStay || !hasRoom) {
    lastCalcTotal = 0;
    var blankIds = [
      "beTotal",
      "beGST",
      "bePayable",
      "beTotalAfterDiscount",
      "beBalanceDue",
    ];
    for (var bi = 0; bi < blankIds.length; bi++) {
      var bel = document.getElementById(blankIds[bi]);
      if (bel) bel.value = "";
    }
    return;
  }

  var bePkg = getPackageById(bookingState.packageId);
  var calc = beCalculateTotal(
    beRooms,
    nights,
    [],
    extraCharges,
    children,
    bePkg ? bePkg.g : 0,
  );
  lastCalcTotal = calc.total;

  var t = document.getElementById("beTotal");
  if (t) t.value = fmtAmt(calc.subtotal);
  var g = document.getElementById("beGST");
  if (g) g.value = fmtAmt(calc.tax);
  var p = document.getElementById("bePayable");
  if (p) p.value = fmtAmt(calc.total);

  // Settle % against ₹ against the total just priced, so the pair cannot drift
  // apart when the room, the guest count or the dates move underneath them.
  var disc = resolveDiscount(calc.total, bookingState.discountSource);
  var totalAfterDiscount = Math.round(Math.max(0, calc.total - disc.amt));
  var pad = document.getElementById("beTotalAfterDiscount");
  if (pad) pad.value = totalAfterDiscount;
  var pctEl = document.getElementById("beDiscountPercent");
  if (pctEl) pctEl.value = disc.percent;
  var amtEl = document.getElementById("beDiscountAmt");
  if (amtEl) amtEl.value = disc.amt;
  var b = document.getElementById("beBalanceDue");
  // Never negative: receipts collected against a now-shorter stay are an
  // overpayment the save-time guard reports, not a negative amount due.
  if (b) b.value = Math.max(0, Math.round(totalAfterDiscount - bePaymentsSum()));
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
  // Re-price so the summary reflects the new party. Nothing on a guest record
  // prices today, but the receipts already booked against the form belong to the
  // party in guestCId, so the summary must never be left describing the old one.
  beRecalc();
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
  bookingState.payStatus = "";
  bookingState.discountPercent =
    parseFloat(document.getElementById("beDiscountPercent")?.value) || 0;
  bookingState.discountAmt =
    parseFloat(document.getElementById("beDiscountAmt")?.value) || 0;
  bookingState.specialRequests = (
    document.getElementById("beSpecialRequests")?.value || ""
  ).trim();
}

async function beValidate() {
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
  // The advance is capped by what the guest actually has to pay, which is the
  // net total the summary already shows - not the gross payable. Comparing
  // against the gross rejected any advance sitting between "total - discount"
  // and "total", i.e. exactly the range the Balance Due field invites.
  var netPayable = Math.max(0, lastCalcTotal - (bookingState.discountAmt || 0));
  if (adv > netPayable && !bookingState.editBookingId) {
    console.error(adv + ">" + netPayable);
    showMessageModal(
      "Info",
      "Advance payments cannot exceed the total payable!",
      false,
    );
    return false;
  } else if(bookingState.editBookingId){
    var ok = await showConfirmModal(
      "Advance payments: Please confirm more payble added!",
    );
    if (!ok) return false;
  }
  return true;
}

function beSaveLoading(on) {
  var btn = document.getElementById("beSaveBtn");
  if (!btn) return;
  btn.disabled = on;
  // Not a literal "Save Entry": after an update attempt the form is still an
  // update, and the caption is what tells the operator which one beSave will run.
  btn.innerHTML = on ? '<span class="spinner"></span> Saving...' : beSaveBtnLabel();
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