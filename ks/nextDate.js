// nextDate.js - Premium Next Hearing Date Modal
window.openNextHearingModal = function (recordData, caseDateEntry) {
  window._nhRecordData = recordData;
  window._nhCaseDateEntry = caseDateEntry || null;
  window._nhRecordSnapshot = recordData
    ? JSON.parse(JSON.stringify(recordData))
    : null;
  var today = getLocalToday();
  var isUpdate = !!(
    caseDateEntry &&
    caseDateEntry.e &&
    caseDateEntry.e > today
  );
  var caseNo = recordData.h + "/" + recordData.i;
  var mid = "nhModal_" + Date.now();
  var prefilledDate = isUpdate ? (caseDateEntry && caseDateEntry.e) || "" : "";
  var prefilledLevel = (caseDateEntry && caseDateEntry.k) || 1;
  var prefilledStage = 1;
  if (caseDateEntry && caseDateEntry.n) {
    var cn = getCaseDateN(caseDateEntry.n);
    prefilledStage = cn.stg || 1;
  }
  var prefilledMustDo = "";
  if (caseDateEntry && caseDateEntry.n) {
    var cn2 = getCaseDateN(caseDateEntry.n);
    prefilledMustDo = cn2.n || "";
  }
  var prefilledDone = "";
  if (caseDateEntry && caseDateEntry.n) {
    var cn3 = getCaseDateN(caseDateEntry.n);
    prefilledDone = cn3.w || "";
  }

  var stageOptions = "";
  for (var si = 1; si <= 16; si++) {
    var selected = si === prefilledStage ? " selected" : "";
    var stageLabels = {
      1: "Filing/Registration",
      2: "Notice Issued",
      3: "Appearance",
      4: "Written Statement",
      5: "Issues Framed",
      6: "Evidence-Plaintiff",
      7: "Evidence-Defendant",
      8: "Cross Examination",
      9: "Arguments",
      10: "Judgment Reserved",
      11: "Judgment Pronounced",
      12: "Execution",
      13: "Adjourned",
      14: "Settlement",
      15: "Dismissed",
      16: "Withdrawn",
    };
    stageOptions +=
      '<option value="' +
      si +
      '"' +
      selected +
      ">" +
      si +
      " - " +
      stageLabels[si] +
      "</option>";
  }

  var modalHtml = `
    <div class="modal fade" id="${mid}" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content animate-scale-in shadow-xl" style="border:2px solid var(--navy);border-radius:12px;overflow:hidden;">
          <div class="modal-header bg-navy-gradient text-gold" style="padding:14px 18px;border-bottom:2px solid var(--gold);">
            <h6 class="modal-title fw-bold" style="font-size:15px;">
              <i class="fas fa-calendar-plus me-2"></i>${isUpdate ? "Update Next Hearing" : "Set Next Hearing"}
            </h6>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="padding:18px;background:var(--section-nd-bg);border-left:3px solid var(--section-nd-border);">
            <div class="bg-gold-light p-3 rounded-md mb-3" style="border:1px solid var(--gold);">
              <div class="text-sm text-gray">Case: <strong class="text-navy" style="font-size:14px;">${escHtml(caseNo)}</strong></div>
              <div class="text-sm text-gray">Court: ${escHtml(recordData.q || "")}</div>
              <div class="text-sm text-gray">Filer: ${escHtml(recordData.n || "")}</div>
            </div>
            <div class="form-group-premium mb-3">
              <label class="form-label-premium" for="nhDate">Next Date <span class="required">*</span></label>
              <input type="date" id="nhDate" value="${prefilledDate}" class="form-control-premium fw-bold">
            </div>
            <div class="d-flex gap-3 mb-3">
              <div class="form-group-premium mb-0 flex-fill">
                <label class="form-label-premium" for="nhImportant">Imp-Level <span class="required">*</span></label>
                <input type="number" id="nhImportant" min="1" max="10" value="${prefilledLevel}" class="form-control-premium fw-bold">
                <div class="form-hint">1 = Low, 10 = Critical</div>
              </div>
              <div class="form-group-premium mb-0 flex-fill">
                <label class="form-label-premium" for="nhStage">Stage <span class="required">*</span></label>
                <select id="nhStage" class="form-control-premium">${stageOptions}</select>
              </div>
            </div>
            <div class="form-group-premium mb-3">
              <label class="form-label-premium" id="nhMustDoLabel" for="nhMustDo">What must be done?</label>
              <textarea id="nhMustDo" rows="3" maxlength="115" class="form-control-premium" placeholder="Plan for next hearing..."></textarea>
            </div>
            <div class="form-group-premium mb-0">
              <label class="form-label-premium" for="nhDone">What was done today?</label>
              <textarea id="nhDone" rows="3" maxlength="115" class="form-control-premium" placeholder="Summary of today's hearing..."></textarea>
            </div>
          </div>
          <div class="modal-footer" style="padding:12px 18px;border-top:1px solid var(--gray-bg);gap:8px;">
            <button type="button" class="btn-premium btn-premium-secondary btn-premium-sm" data-bs-dismiss="modal">Cancel</button>
            <button type="button" id="${mid}_saveBtn" class="btn-premium btn-premium-primary btn-premium-sm">
              <i class="${isUpdate ? "fas fa-calendar-check" : "fas fa-save"} me-1"></i> ${isUpdate ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  var modalEl = document.getElementById(mid);
  var mustDoEl = modalEl.querySelector("#nhMustDo");
  if (mustDoEl && prefilledMustDo) mustDoEl.textContent = prefilledMustDo;
  var doneEl = modalEl.querySelector("#nhDone");
  if (doneEl && prefilledDone) doneEl.textContent = prefilledDone;
  var m = new bootstrap.Modal(modalEl);
  m.show();

  document
    .getElementById(mid + "_saveBtn")
    .addEventListener("click", function () {
      if (isUpdate) {
        window.updateNhEntry(mid);
      } else {
        window.saveNextHearing(mid);
      }
    });
  modalEl.addEventListener("hidden.bs.modal", function () {
    window._nhMode = null;
    window._nhRecordData = null;
    window._nhCaseDateEntry = null;
    this.remove();
  });
};

window.updateNhEntry = async function (modalId) {
  var record = window._nhRecordData;
  var caseDateEntry = window._nhCaseDateEntry;
  if (!record || !caseDateEntry || !caseDateEntry.a) {
    showMessageModal("Info", "No date entry selected for update.", false);
    return;
  }
  var mustDo = (document.getElementById("nhMustDo")?.value || "").trim();
  var done = (document.getElementById("nhDone")?.value || "").trim();
  var importantLevel =
    parseInt(document.getElementById("nhImportant")?.value) || 1;
  var selectedStage = parseInt(document.getElementById("nhStage")?.value) || 1;
  var newDate = document.getElementById("nhDate")?.value;
  if (!newDate) {
    showMessageModal("Info", "Please select a date!", false);
    return;
  }
  var displayDate = getCaseDisplayDate(record.a);
  if (displayDate && newDate <= displayDate) {
    showMessageModal(
      "Info",
      "Next date must be after the display date (" +
        formatDate(displayDate) +
        ")!",
      false,
    );
    return;
  }

  var btn = document.getElementById(modalId + "_saveBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Updating...';
  }

  payload0.p = {
    a: caseDateEntry.a,
    e: newDate,
    f: caseDateEntry.f || 0,
    g: 0,
    h: 0,
    k: importantLevel,
    n:
      mustDo || selectedStage
        ? { n: mustDo, stg: selectedStage, w: done }
        : null,
    tb: 36,
    td: record.a,
  };
  payload0.fn = 99;
  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "a" }]);

  try {
    if (typeof fnj3 === "function") {
      var resp = await fnj3(
        "https://my1.in/2/o.php",
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
        await hndlRspo99(resp, {
          modalId: modalId,
          newDate: newDate,
          selectedStage: selectedStage,
        });
      } else {
        showMessageModal("Info", resp?.ms || "Record not updated", false);
      }
    } else {
      showMessageModal("Info", "Server communication not available", false);
    }
  } catch (err) {
    showMessageModal(
      "Error",
      err?.message || "Failed to update next hearing date",
      true,
    );
  }
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save me-1"></i> Save';
  }
};

function getCaseDisplayDate(recordA) {
  var earliest = null;
  for (var i = 0; i < caseDates.length; i++) {
    var cd = caseDates[i];
    if (cd.td == recordA && (!earliest || cd.e < earliest.e)) earliest = cd;
  }
  if (!earliest) {
    var rec = null;
    for (var j = 0; j < caseRecords.length; j++) {
      if (caseRecords[j].a == recordA) {
        rec = caseRecords[j];
        break;
      }
    }
    var cr = rec ? getCaseCs91Record(rec) : null;
    if (cr && cr.p) return cr.p;
  }
  return earliest ? earliest.e : null;
}

function restoreCaseRecord(rec) {
  var isECourt = rec.f === 0 && rec.g === "" && rec.h === "" && rec.i === 0;
  return dbDexieManager.insertToDexie(
    dbnm,
    isECourt ? "cs91" : "cs",
    [rec],
    true,
    ["a"],
  );
}

async function ensureCaseIntact(rec) {
  if (!rec) return false;
  var found = null;
  for (var i = 0; i < caseRecords.length; i++) {
    if (caseRecords[i].a == rec.a) {
      found = caseRecords[i];
      break;
    }
  }
  var looksCleared =
    typeof hasCaseData === "function" ? !hasCaseData(found) : false;
  if (!found || looksCleared) {
    //await restoreCaseRecord(rec);
    await loadDataFromDB();
    return true;
  }
  return false;
}

window.updateNextDateRecord = async function (mid = 0) {
  if (!editingRecordId) {
    showMessageModal("Info", "No record selected for editing.", false);
    return;
  }

  var modalId = addCaseModalId;
  var newDate = document.getElementById("editNhDate")?.value || "";
  var importantLevel =
    parseInt(document.getElementById("editNhImportant")?.value) || 1;
  var selectedStage =
    parseInt(document.getElementById("editNhStage")?.value) || 1;
  var mustDo = (document.getElementById("editNhMustDo")?.value || "").trim();
  var done = (document.getElementById("editNhDone")?.value || "").trim();

  if (!newDate) {
    showMessageModal("Info", "Please select a Next Date!", false);
    return;
  }
  var caseDateEntry = window._editingCaseDateEntry;
  var displayDate = null;
  if (caseDateEntry && caseDateEntry.f) {
    for (var di = 0; di < caseDates.length; di++) {
      if (caseDates[di].a == caseDateEntry.f) {
        displayDate = caseDates[di].e;
        break;
      }
    }
  }
  if (!displayDate) displayDate = getCaseDisplayDate(editingRecordId);
  if (displayDate && newDate <= displayDate) {
    showMessageModal(
      "Info",
      "Next date must be after the display date (" +
        formatDate(displayDate) +
        ")!",
      false,
    );
    return;
  }

  var saveNextBtn = document.getElementById(modalId + "_saveNextBtn");
  if (saveNextBtn) {
    saveNextBtn.disabled = true;
    saveNextBtn.innerHTML = '<span class="spinner"></span> Updating...';
  }

  payload0.p = {
    a: (caseDateEntry && caseDateEntry.a) || 0,
    e: newDate,
    f: (caseDateEntry && caseDateEntry.f) || 0,
    g: 0,
    h: 0,
    k: importantLevel,
    n:
      mustDo || selectedStage
        ? { n: mustDo, stg: selectedStage, w: done }
        : null,
    tb: 36,
    td: editingRecordId,
  };
  payload0.fn = 99;
  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "a" }]);

  console.log(
    "📤 Update Next Date:",
    "a=" + editingRecordId,
    JSON.stringify(payload0.p, null, 2),
  );

  try {
    if (typeof fnj3 === "function") {
      var response = await fnj3(
        "https://my1.in/2/o.php",
        payload0,
        1,
        true,
        null,
        20000,
        0,
        1,
        1,
      );
      console.log("📥 Server:", response);

      if (response && response.su == 1) {
        await hndlRspo99(response, {
          modalId: modalId,
          newDate: newDate,
          selectedStage: selectedStage,
        });
      } else {
        showMessageModal("Info", response?.ms || "Record not updated", false);
      }
    } else {
      showMessageModal("Info", "Server communication not available", false);
    }
  } catch (err) {
    showMessageModal("Info", "Error: " + err.message, false);
  }

  if (saveNextBtn) {
    saveNextBtn.disabled = false;
    saveNextBtn.innerHTML =
      '<i class="fas fa-calendar-check me-1"></i> Update Next Date';
  }
};

window.hndlRspo99 = async function (response, ctx) {
  ctx = ctx || {};
  await handl_ks_rspons(response);
  var modalEl = document.getElementById(ctx.modalId);
  if (modalEl) {
    var inst = bootstrap.Modal.getInstance(modalEl);
    if (inst) inst.hide();
  }
  await loadDataFromDB();
  var editRec = null;
  for (var ei = 0; ei < caseRecords.length; ei++) {
    if (caseRecords[ei].a == editingRecordId) {
      editRec = caseRecords[ei];
      break;
    }
  }
  await ensureCaseIntact(editRec);
  renderTable();
  showMessageModal(
    "Success",
    "Next hearing date updated successfully!\n\nDate: " +
      ctx.newDate +
      "\nStage: " +
      ctx.selectedStage,
    false,
  );
};

window.saveNextHearing = async function (modalId) {
  var today = getLocalToday();
  var record = window._nhRecordData;
  var caseDateEntry = window._nhCaseDateEntry;
  var mustDo = (document.getElementById("nhMustDo")?.value || "").trim();
  var done = (document.getElementById("nhDone")?.value || "").trim();
  var importantLevel =
    parseInt(document.getElementById("nhImportant")?.value) || 1;
  var selectedStage = parseInt(document.getElementById("nhStage")?.value) || 1;
  var newDate = document.getElementById("nhDate")?.value;
  if (!newDate) {
    showMessageModal("Info", "Please select a date!", false);
    return;
  }
  var displayDate = getCaseDisplayDate(record.a);
  if (displayDate && newDate <= displayDate) {
    showMessageModal(
      "Info",
      "Next date must be after the display date (" +
        formatDate(displayDate) +
        ")!",
      false,
    );
    return;
  }

  var fLink = (caseDateEntry && caseDateEntry.a) || 0;
  if (!fLink && typeof getCaseDatesForRecord === "function") {
    var curChain = getCaseDatesForRecord(record.a);
    if (curChain && curChain.current && curChain.current.a)
      fLink = curChain.current.a;
  }

  var btn = document.getElementById(modalId + "_saveBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Saving...';
  }

  // Chain-root seed: first manual next date on an E-Court case whose
  // schedule lives only in cs91.p/o - persist the old p as an anchor row
  // so the new date links to it instead of starting an orphan chain.
  if (!fLink && typeof fnj3 === "function") {
    var crSeed =
      typeof isCs91Record === "function" && isCs91Record(record)
        ? record
        : typeof getCaseCs91Record === "function"
          ? getCaseCs91Record(record)
          : null;
    var anchorDate =
      crSeed && crSeed.p && crSeed.p < newDate ? crSeed.p : null;
    if (anchorDate) {
      try {
        payload0.p = {
          e: anchorDate,
          f: 0,
          g: 0,
          h: 0,
          k: importantLevel,
          n:
            done || selectedStage
              ? { n: "", stg: selectedStage, w: done }
              : null,
          tb: 36,
          td: record.a,
        };
        payload0.fn = 91;
        payload0.vw = 1;
        payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
          { tb: "a" },
        ]);
        var anchorResp = await fnj3(
          "https://my1.in/2/m.php",
          payload0,
          1,
          true,
          null,
          20000,
          0,
          1,
          1,
        );
        if (
          anchorResp &&
          anchorResp.su == 1 &&
          anchorResp.a &&
          anchorResp.a.l &&
          anchorResp.a.l.length > 0 &&
          anchorResp.a.l[0].a
        ) {
          await handl_ks_rspons(anchorResp);
          fLink = anchorResp.a.l[0].a;
        }
      } catch (anchorErr) {
        console.warn("Anchor date row could not be created:", anchorErr);
      }
    }
  }

  payload0.p = {
    e: newDate,
    f: fLink,
    g: 0,
    h: 0,
    k: importantLevel,
    n:
      mustDo || selectedStage
        ? { n: mustDo, stg: selectedStage, w: done }
        : null,
    tb: 36,
    td: record.a,
  };
  payload0.fn = 91;
  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "a" }]);

  try {
    if (typeof fnj3 === "function") {
      var resp = await fnj3(
        "https://my1.in/2/m.php",
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
        await hndlRspo91(resp, modalId);
      } else {
        showMessageModal("Error", resp?.ms || "Failed to save", true);
      }
    } else {
      showMessageModal("Info", "Server communication not available", false);
    }
  } catch (err) {
    showMessageModal(
      "Error",
      err?.message || "Failed to save next hearing date",
      true,
    );
  }
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save me-1"></i> Save';
  }
};

window.hndlRspo91 = async function (response, modalId) {
  await handl_ks_rspons(response);
  var modalEl = document.getElementById(modalId);
  if (modalEl) {
    var inst = bootstrap.Modal.getInstance(modalEl);
    if (inst) inst.hide();
  }
  await loadDataFromDB();
  renderTable();
  showMessageModal("Success", "Next hearing date updated successfully!", false);
};

console.log("nextDate.js loaded");
