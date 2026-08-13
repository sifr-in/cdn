// addNewCase.js - Add New Case modal + save + edit logic
// Extracted from sidebar.js for modular loading

var editingRecordId = null;
var addCaseModalId = null;
window._editingCaseDateEntry = null;

function showAddCaseModal(editRecord) {
  editingRecordId = editRecord ? editRecord.a : null;
  var isEditMode = editingRecordId !== null;
  var mid = "addCaseModal_" + Date.now();
  var today = getLocalToday();

  var hideCols = (
    window[my1uzr.worknOnPg]?.colsToHideCases || ""
  ).toLowerCase();
  var caseTypeOptions = [
    "R.C.S.",
    "Spl.C.S.",
    "Reg Dkst",
    "Civil M.A.",
    "R.C.A.",
    "L.A.R.",
    "S.C.C.",
    "Insolvency",
    "Final Decree",
    "PWDVA Appln.",
  ];
  var caseTypeDatalistHtml =
    '<datalist id="caseTypeOpts">' +
    caseTypeOptions
      .map(function (v) {
        return '<option value="' + v + '">';
      })
      .join("") +
    "</datalist>";

  var ecCtHtml =
    hideCols.indexOf("ct") < 0
      ? '<div class="form-group-premium mb-0">' +
        '<label class="form-label-premium">Case Type <span class="required">*</span></label>' +
        '<input list="ecCaseTypeOpts" id="ec_caseType" maxlength="8" class="form-control-premium" placeholder="Search type..." oninput="checkCustomCaseType(this,\'ec_caseTypeCustom\')">' +
        '<datalist id="ecCaseTypeOpts">' +
        caseTypeOptions
          .map(function (v) {
            return '<option value="' + v + '">';
          })
          .join("") +
        "</datalist>" +
        '<div id="ec_caseTypeCustom" class="cs-type-custom" style="display:none;"></div></div>'
      : "";

  var ecCnHtml =
    hideCols.indexOf("cn") < 0
      ? '<div class="form-group-premium mb-0">' +
        '<label class="form-label-premium">Case Number</label>' +
        '<input type="text" id="ec_caseNumber" maxlength="8" class="form-control-premium" placeholder="e.g. 201784"></div>'
      : "";

  var ecCyHtml =
    hideCols.indexOf("cy") < 0
      ? '<div class="form-group-premium mb-0">' +
        '<label class="form-label-premium">Case Year</label>' +
        '<input type="number" id="ec_caseYear" class="form-control-premium" placeholder="e.g. 2021"></div>'
      : "";

  var ecNdHtml =
    hideCols.indexOf("nd") < 0
      ? '<div class="form-group-premium mb-0">' +
        '<label class="form-label-premium">Next Date</label>' +
        '<input type="date" id="caseNextDate" class="form-control-premium">' +
        "</div>"
      : "";

  var basicFieldsHtml =
    // ======== CASE SOURCE ========
    '<div class="p-3" style="border-bottom:2px solid var(--gray-bg);">' +
    '<label class="form-label-premium">Case Source <span class="required">*</span></label>' +
    '<div class="d-flex gap-3 flex-wrap">' +
    '<label id="csRadioEcourt_' +
    mid +
    '" class="cs-radio-label">' +
    '<input type="radio" name="caseSource_' +
    mid +
    '" value="1" onchange="toggleCNRFields(\'' +
    mid +
    "')\"> E-Court Case (CNR)</label>" +
    '<label id="csRadioManual_' +
    mid +
    '" class="cs-radio-label cs-active-manual">' +
    '<input type="radio" name="caseSource_' +
    mid +
    '" value="0" checked onchange="toggleCNRFields(\'' +
    mid +
    "')\"> Non E-Court Case</label>" +
    "</div></div>" +
    '<div id="' +
    mid +
    '_caseContent" style="background:var(--section-manual-bg);border-left:3px solid var(--section-manual-border);">' +
    // ======== CNR NUMBER (E-Court) ========
    '<div id="' +
    mid +
    '_cnrSection" style="display:none;border-bottom:2px solid var(--gray-bg);padding:14px 18px;">' +
    '<div class="d-flex align-items-center gap-2 mb-2">' +
    '<i class="fas fa-qrcode text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-navy" style="font-size:14px;">CNR Number</span></div>' +
    '<p class="text-sm text-gray mb-3">Enter 16-digit CNR number to auto-fill case details</p>' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">CNR Number <span class="required">*</span></label>' +
    '<div class="d-flex gap-2">' +
    '<input type="text" id="caseCNR" placeholder="e.g. MHCC000120260123" maxlength="16" ' +
    'class="form-control-premium" style="border-color:var(--gold);text-transform:uppercase;letter-spacing:1px;font-family:monospace;" ' +
    "oninput=\"var v=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'');if(v.length>4)v=v.substring(0,4).replace(/[^A-Z]/g,'')+v.substring(4).replace(/[^0-9]/g,'');this.value=v\">" +
    '<button type="button" id="caseCNRSyncBtn" onclick="syncCaseFromECourt()" ' +
    'class="btn-premium btn-premium-primary" style="white-space:nowrap;">' +
    '<i class="fas fa-sync-alt me-1"></i>Sync</button>' +
    '<button type="button" id="caseCNRImportBtn" onclick="importCasesFromFile()" ' +
    'class="btn-premium btn-premium-primary" style="white-space:nowrap;">' +
    '<i class="fas fa-file-import me-1"></i>Import</button>' +
    "</div>" +
    '<div class="form-hint">Format: MHCC + District Code + Year + Sequence</div>' +
    "</div>" +
    '<div class="form-row-premium">' +
    ecCtHtml +
    "</div>" +
    '<div class="form-row-premium">' +
    ecCnHtml +
    ecCyHtml +
    "</div>" +
    '<div class="form-group-premium mb-0 mt-2" id="ecBriefGroup">' +
    '<label class="form-label-premium">Brief Number</label>' +
    '<input type="text" id="caseBriefNumberCNR" placeholder="e.g. Exh.45" maxlength="8" class="form-control-premium">' +
    "</div></div>" +
    // ======== MANUAL CASE DETAILS (Non E-Court) ========
    '<div id="' +
    mid +
    '_manualSection" style="border-bottom:2px solid var(--gray-bg);padding:14px 18px;">' +
    '<div class="d-flex align-items-center gap-2 mb-3">' +
    '<i class="fas fa-gavel text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-navy" style="font-size:14px;">Case Details</span></div>' +
    // Row 1: Case Number + Case Year
    '<div class="form-row-premium mb-3">' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Case Number <span class="required">*</span></label>' +
    '<input type="text" id="caseNumber" placeholder="e.g. 201784" maxlength="8" class="form-control-premium">' +
    "</div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Case Year <span class="required">*</span></label>' +
    '<input type="number" id="caseYear" placeholder="e.g. 2021" class="form-control-premium">' +
    "</div></div>" +
    // Row 2: Case Type + Brief Number
    '<div class="form-row-premium mb-0">' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Case Type <span class="required">*</span></label>' +
    '<input list="caseTypeOpts" id="caseType" maxlength="8" class="form-control-premium" placeholder="Search type..." oninput="checkCustomCaseType(this,\'caseTypeCustom\')">' +
    caseTypeDatalistHtml +
    '<div id="caseTypeCustom" class="cs-type-custom" style="display:none;"></div>' +
    "</div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Brief Number</label>' +
    '<input type="text" id="caseBriefNumber" placeholder="e.g. Exh.45" maxlength="8" class="form-control-premium">' +
    "</div></div></div>" +
    // ======== DATES ========
    '<div id="datesSection" style="border-bottom:2px solid var(--gray-bg);padding:14px 18px;">' +
    '<div class="form-row-premium mb-0">' +
    '<div class="form-group-premium mb-0" id="caseDdGroup">' +
    '<label class="form-label-premium">Display Date <span class="required">*</span></label>' +
    '<input type="date" id="casePreviousDate" value="' +
    today +
    '" class="form-control-premium fw-bold">' +
    "</div>" +
    ecNdHtml +
    "</div></div>" +
    // ======== COURT NAME ========
    '<div id="courtNameSection" style="border-bottom:2px solid var(--gray-bg);padding:14px 18px;">' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Judge / Court Name <span class="required">*</span></label>' +
    '<input type="text" id="caseCourtName" placeholder="Enter judge or court name" maxlength="12" class="form-control-premium">' +
    "</div></div>" +
    // ======== PARTY INFORMATION ========
    '<div style="border-bottom:2px solid var(--gray-bg);padding:14px 18px;">' +
    '<div class="d-flex align-items-center gap-2 mb-3">' +
    '<i class="fas fa-users text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-navy" style="font-size:14px;">Party Information</span></div>' +
    // Filer Party Name
    '<div class="form-group-premium" id="filerGroup">' +
    '<label class="form-label-premium">Filer Party Name <span class="required">*</span></label>' +
    '<div class="d-flex gap-2">' +
    '<input type="text" id="caseFilerName" placeholder="Enter filer name" class="form-control-premium flex-grow-1">' +
    '<button type="button" onclick="openMemberSelector(\'filer\')" style="background:var(--gold);border:none;border-radius:6px;padding:0 14px;font-size:18px;font-weight:bold;cursor:pointer;">+</button>' +
    "</div></div>" +
    // Respondent Party Name
    '<div class="form-group-premium" id="respondentGroup">' +
    '<label class="form-label-premium">Respondent / Answerer Name <span class="required">*</span></label>' +
    '<div class="d-flex gap-2">' +
    '<input type="text" id="caseRespondentName" placeholder="Enter respondent name" class="form-control-premium flex-grow-1">' +
    '<button type="button" onclick="openMemberSelector(\'answerer\')" style="background:var(--gold);border:none;border-radius:6px;padding:0 14px;font-size:18px;font-weight:bold;cursor:pointer;">+</button>' +
    "</div></div>" +
    // Party Side (Filer / Answerer)
    '<div class="form-group-premium mb-0" id="partySideGroup">' +
    '<label class="form-label-premium">You are the <span class="required">*</span></label>' +
    '<div class="d-flex gap-4 flex-wrap">' +
    '<label id="partySideFilerLabel" class="cursor-pointer d-inline-flex align-items-center gap-2 text-sm text-gray-dark">' +
    '<input type="radio" id="casePartySideFiler" name="casePartySide_' +
    mid +
    '" value="1" checked style="accent-color:var(--gold);"> Filer (Plaintiff)</label>' +
    '<label id="partySideAnswererLabel" class="cursor-pointer d-inline-flex align-items-center gap-2 text-sm text-gray-dark">' +
    '<input type="radio" id="casePartySideAnswerer" name="casePartySide_' +
    mid +
    '" value="2" style="accent-color:var(--gold);"> Answerer (Defendant)</label>' +
    "</div></div></div>" +
    // ======== NOTIFICATION PREFERENCE ========
    '<div id="notifSection" style="border-bottom:2px solid var(--gray-bg);padding:14px 18px;">' +
    '<div class="d-flex align-items-center gap-2 mb-3">' +
    '<i class="fas fa-bell text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-navy" style="font-size:13px;">Notification Preference</span></div>' +
    '<div class="d-flex gap-4 flex-wrap">' +
    '<label class="cursor-pointer d-inline-flex align-items-center gap-2 text-sm text-gray-dark">' +
    '<input type="radio" name="notifPref_' +
    mid +
    '" value="0" checked style="accent-color:var(--gold);"> No Reminder</label>' +
    '<label class="cursor-pointer d-inline-flex align-items-center gap-2 text-sm text-gray-dark">' +
    '<input type="radio" name="notifPref_' +
    mid +
    '" value="1" style="accent-color:var(--gold);"> Notify Filer</label>' +
    '<label class="cursor-pointer d-inline-flex align-items-center gap-2 text-sm text-gray-dark">' +
    '<input type="radio" name="notifPref_' +
    mid +
    '" value="2" style="accent-color:var(--gold);"> Notify Respondent</label>' +
    "</div></div>";

  // ======== MORE DETAILS TOGGLE ========
  var moreDetailsBtnHtml =
    '<div class="text-center p-3" style="border-bottom:2px solid var(--gray-bg);">' +
    '<button type="button" id="' +
    mid +
    '_moreBtn" onclick="toggleMoreDetails(\'' +
    mid +
    "')\" " +
    'class="btn-premium" style="background:transparent;border:2px solid var(--navy);color:var(--navy);padding:10px 28px;" ' +
    "onmouseover=\"this.style.background='var(--navy)';this.style.color='var(--gold)'\" " +
    "onmouseout=\"this.style.background='transparent';this.style.color='var(--navy)'\">" +
    'More Details <i class="fas fa-chevron-down ms-1" id="' +
    mid +
    '_moreIcon"></i></button></div>';

  // ======== MORE DETAILS SECTION ========
  var moreDetailsHtml =
    '<div id="' +
    mid +
    '_moreSection" style="display:none;">' +
    // Case Status & ID
    '<div class="p-3 bg-gold-light" style="border-bottom:2px solid var(--gray-bg);">' +
    '<div class="d-flex justify-content-between align-items-center flex-wrap gap-3">' +
    "<div>" +
    '<label class="form-label-premium mb-1">Case ID</label>' +
    '<span class="text-navy fw-bold" style="font-size:14px;">Auto Generated</span></div>' +
    '<div style="min-width:180px;">' +
    '<label class="form-label-premium mb-1">Status</label>' +
    '<select id="caseStatus" class="form-select-premium">' +
    '<option value="1" selected>Taken for Study</option>' +
    '<option value="2">Active</option>' +
    '<option value="3">Pending</option>' +
    '<option value="4">Closed</option>' +
    '<option value="5">Resolved</option>' +
    "</select></div></div></div>" +
    // Contact Information
    '<div class="p-3" style="border-bottom:2px solid var(--gray-bg);">' +
    '<div class="d-flex align-items-center gap-2 mb-3">' +
    '<i class="fas fa-address-book text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-navy" style="font-size:14px;">Contact Information</span></div>' +
    '<div class="form-row-premium mb-3">' +
    '<div class="form-group-premium mb-0" style="min-width:130px;">' +
    '<label class="form-label-premium">Country Code</label>' +
    '<select id="caseCountryCode" class="form-select-premium">' +
    '<option value="+91" selected>+91 (India)</option>' +
    '<option value="+1">+1 (USA)</option>' +
    '<option value="+44">+44 (UK)</option>' +
    '<option value="+971">+971 (UAE)</option>' +
    '<option value="+977">+977 (Nepal)</option>' +
    "</select></div>" +
    '<div class="form-group-premium mb-0 flex-grow-1">' +
    '<label class="form-label-premium">Contact Number</label>' +
    '<input type="tel" id="caseMobile" placeholder="Enter mobile number" class="form-control-premium">' +
    "</div></div>" +
    '<div class="form-group-premium mb-3">' +
    '<label class="form-label-premium">Contact Person Name</label>' +
    '<input type="text" id="caseContactName" placeholder="Enter contact person name" class="form-control-premium">' +
    "</div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Customer Type</label>' +
    '<div class="d-flex gap-4">' +
    '<label class="cursor-pointer d-inline-flex align-items-center gap-2 text-sm text-gray-dark">' +
    '<input type="radio" name="contactType_' +
    mid +
    '" value="1" checked style="accent-color:var(--gold);"> Individual</label>' +
    '<label class="cursor-pointer d-inline-flex align-items-center gap-2 text-sm text-gray-dark">' +
    '<input type="radio" name="contactType_' +
    mid +
    '" value="2" style="accent-color:var(--gold);"> Company</label>' +
    "</div></div></div>" +
    // Case Details
    '<div class="p-3" style="border-bottom:2px solid var(--gray-bg);">' +
    '<div class="d-flex align-items-center gap-2 mb-3">' +
    '<i class="fas fa-gavel text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-navy" style="font-size:14px;">Case Details</span></div>' +
    '<div class="form-row-premium mb-3">' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Advocate</label>' +
    '<select id="caseAdvocate" class="form-select-premium">' +
    '<option value="">Select advocate</option>' +
    '<option value="1|Adv. Sharma">Adv. Sharma</option>' +
    '<option value="2|Adv. Patil">Adv. Patil</option>' +
    '<option value="3|Adv. Joshi">Adv. Joshi</option>' +
    '<option value="4|Adv. Deshmukh">Adv. Deshmukh</option>' +
    '<option value="5|Adv. Kulkarni">Adv. Kulkarni</option>' +
    "</select></div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Case Category</label>' +
    '<select id="caseCategory" class="form-select-premium">' +
    '<option value="">Select category</option>' +
    '<option value="1">Civil</option>' +
    '<option value="2">Criminal</option>' +
    '<option value="3">Family</option>' +
    '<option value="4">Corporate</option>' +
    '<option value="5">Constitutional</option>' +
    '<option value="6">Labour</option>' +
    '<option value="7">Tax</option>' +
    '<option value="8">Other</option>' +
    "</select></div></div>" +
    '<div class="form-group-premium mb-3">' +
    '<label class="form-label-premium">Case Owner</label>' +
    '<select id="caseOwner" class="form-select-premium">' +
    '<option value="1" selected>Masoom Nazir Sanadi</option></select></div>' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Case Notes <span class="text-gray fw-normal">(Max 256 Characters)</span></label>' +
    '<textarea id="caseNotes" rows="4" maxlength="32" placeholder="Write short notes about this case..." ' +
    "oninput=\"var c=document.getElementById('" +
    mid +
    "_charCount');if(c)c.textContent=this.value.length+'/32'\" " +
    'class="form-control-premium" style="resize:vertical;"></textarea>' +
    '<div class="form-hint text-end">Characters: <span id="' +
    mid +
    '_charCount">0/32</span></div>' +
    "</div></div>" +
    // Supporting Document
    '<div class="p-3">' +
    '<div class="d-flex align-items-center gap-2 mb-3">' +
    '<i class="fas fa-paperclip text-gold" style="font-size:16px;"></i>' +
    '<span class="fw-bold text-navy" style="font-size:14px;">Supporting Document / Image</span></div>' +
    '<div class="form-group-premium">' +
    '<label class="form-label-premium">Image URL</label>' +
    '<input type="url" id="caseImageUrl" placeholder="Enter image URL" class="form-control-premium">' +
    "</div>" +
    '<div class="text-center fw-bold text-gray my-3">— OR —</div>' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium">Upload Image</label>' +
    '<input type="file" id="caseImageFile" accept="image/*" class="form-control-premium">' +
    "</div></div>" +
    "</div>";

  // ======== TAB BAR (Edit Mode Only) ========
  var tabBarHtml = isEditMode
    ? '<div class="d-flex" style="border-bottom:2px solid var(--gray-bg);background:var(--gray-surface);">' +
      '<button type="button" id="' +
      mid +
      '_tabBtnCase" onclick="switchEditTab(\'' +
      mid +
      "','case')\" " +
      'class="flex-fill text-center fw-bold py-2" style="font-size:13px;border:none;cursor:pointer;border-bottom:3px solid transparent;background:var(--gray-surface);color:var(--gray);transition:all 0.2s;">' +
      '<i class="fas fa-gavel me-1"></i> Case Details</button>' +
      '<button type="button" id="' +
      mid +
      '_tabBtnNextDate" onclick="switchEditTab(\'' +
      mid +
      "','nextdate')\" " +
      'class="flex-fill text-center fw-bold py-2" style="font-size:13px;border:none;cursor:pointer;border-bottom:3px solid var(--navy);background:var(--navy);color:var(--gold);transition:all 0.2s;">' +
      '<i class="fas fa-calendar-plus me-1"></i> Next Date</button>' +
      "</div>"
    : "";

  // ======== NEXT DATE TAB (Edit Mode Only) ========
  var caseDateEntry = window._editingCaseDateEntry;
  var prefNdDate = (caseDateEntry && caseDateEntry.e) || today;
  var prefNdLevel = (caseDateEntry && caseDateEntry.k) || 1;
  var prefNdStage = 1;
  var prefNdMustDo = "";
  var prefNdDone = "";
  if (caseDateEntry && caseDateEntry.n) {
    var cnData = getCaseDateN(caseDateEntry.n);
    prefNdStage = cnData.stg || 1;
    prefNdMustDo = cnData.n || "";
    prefNdDone = cnData.w || "";
  }
  var ndStageOptions = "";
  var ndStageLabels = {
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
  for (var si = 1; si <= 16; si++) {
    ndStageOptions +=
      '<option value="' +
      si +
      '"' +
      (si === prefNdStage ? " selected" : "") +
      ">" +
      si +
      " - " +
      ndStageLabels[si] +
      "</option>";
  }
  var ndCaseNo = editRecord ? editRecord.h + "/" + editRecord.i : "";
  var nextDateTabHtml = isEditMode
    ? '<div class="p-3" style="border-bottom:2px solid var(--gray-bg);">' +
      '<div class="text-sm text-gray">Case: <strong class="text-navy" style="font-size:14px;">' +
      escHtml(ndCaseNo) +
      "</strong></div>" +
      '<div class="text-sm text-gray">Court: ' +
      escHtml(editRecord ? editRecord.q : "") +
      "</div>" +
      '<div class="text-sm text-gray">Filer: ' +
      escHtml(editRecord ? editRecord.n : "") +
      "</div>" +
      "</div>" +
      '<div class="p-3">' +
      '<div class="form-group-premium mb-3">' +
      '<label class="form-label-premium" for="editNhDate">Next Date <span class="required">*</span></label>' +
      '<input type="date" id="editNhDate" value="' +
      escHtml(prefNdDate) +
      '" class="form-control-premium fw-bold">' +
      "</div>" +
      '<div class="d-flex gap-3 mb-3">' +
      '<div class="form-group-premium mb-0 flex-fill">' +
      '<label class="form-label-premium" for="editNhImportant">Imp-Level <span class="required">*</span></label>' +
      '<input type="number" id="editNhImportant" min="1" max="10" value="' +
      prefNdLevel +
      '" class="form-control-premium fw-bold">' +
      '<div class="form-hint">1 = Low, 10 = Critical</div>' +
      "</div>" +
      '<div class="form-group-premium mb-0 flex-fill">' +
      '<label class="form-label-premium" for="editNhStage">Stage <span class="required">*</span></label>' +
      '<select id="editNhStage" class="form-control-premium">' +
      ndStageOptions +
      "</select>" +
      "</div></div>" +
      '<div class="form-group-premium mb-3">' +
      '<label class="form-label-premium" for="editNhMustDo">What must be done?</label>' +
      '<textarea id="editNhMustDo" rows="3" maxlength="115" class="form-control-premium" placeholder="Plan for next hearing...">' +
      escHtml(prefNdMustDo) +
      "</textarea>" +
      "</div>" +
      '<div class="form-group-premium mb-0">' +
      '<label class="form-label-premium" for="editNhDone">What was done today?</label>' +
      '<textarea id="editNhDone" rows="3" maxlength="115" class="form-control-premium" placeholder="Summary of today\'s hearing...">' +
      escHtml(prefNdDone) +
      "</textarea>" +
      "</div></div>"
    : "";

  // ======== FOOTER ========
  var footerHtml =
    '<div id="' +
    mid +
    '_modalFooter" class="modal-footer" style="padding:14px 18px;border-top:2px solid var(--gray-bg);">' +
    '<button type="button" class="btn-premium btn-premium-secondary" data-bs-dismiss="modal">Cancel</button>' +
    (isEditMode
      ? '<button type="button" id="' +
        mid +
        '_saveBtn" onclick="updateCaseRecord()" class="btn-premium btn-premium-primary" style="display:none;">' +
        '<i class="fas fa-edit me-1"></i> Update Case</button>' +
        '<button type="button" id="' +
        mid +
        '_saveNextBtn" onclick="updateNextDateRecord()" class="btn-premium btn-premium-primary">' +
        '<i class="fas fa-calendar-check me-1"></i> Update Next Date</button>'
      : '<button type="button" id="' +
        mid +
        '_saveBtn" onclick="saveCase(\'' +
        mid +
        '\')" class="btn-premium btn-premium-primary">' +
        '<i class="fas fa-save me-1"></i> Save Case</button>') +
    "</div>";

  // ======== FULL MODAL ========
  var modalHtml =
    '<div class="modal fade" id="' +
    mid +
    '" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered modal-lg">' +
    '<div class="modal-content animate-scale-in shadow-xl" style="border:3px solid var(--navy);border-radius:12px;overflow:hidden;max-height:85vh;">' +
    '<div class="modal-header bg-navy-gradient text-gold" style="padding:14px 18px;border-bottom:3px solid var(--gold);">' +
    '<h6 class="modal-title fw-bold" style="font-size:15px;letter-spacing:0.5px;">' +
    '<i class="fas fa-balance-scale me-2 text-gold"></i>' +
    (isEditMode ? "EDIT CASE" : "ADD / UPDATE CASE") +
    "</h6>" +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
    '<div class="modal-body p-0" style="overflow-y:auto;max-height:calc(85vh - 120px);">' +
    tabBarHtml +
    '<div id="' +
    mid +
    '_tabCase" style="' +
    (isEditMode ? "display:none;" : "") +
    '">' +
    basicFieldsHtml +
    moreDetailsBtnHtml +
    moreDetailsHtml +
    "</div></div>" +
    (isEditMode
      ? '<div id="' +
        mid +
        '_tabNextDate" style="display:block;background:var(--section-nd-bg);border-left:3px solid var(--section-nd-border);">' +
        nextDateTabHtml +
        "</div>"
      : "") +
    "</div>" +
    footerHtml +
    "</div></div></div>";

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  var modalEl = document.getElementById(mid);
  addCaseModalId = mid;
  var m = new bootstrap.Modal(modalEl);

  if (isEditMode && editRecord) {
    prefillsAddCaseForm(editRecord, mid);
    var srcRadio = document.querySelector(
      'input[name="caseSource_' + mid + '"]:checked',
    );
    if (srcRadio) applyCaseFieldVisibility(mid, srcRadio.value === "1");
  }

  m.show();
  modalEl.addEventListener("hidden.bs.modal", function () {
    editingRecordId = null;
    addCaseModalId = null;
    window._editingCaseDateEntry = null;
    this.remove();
  });
}

window._caseTypeOptions = [
  "R.C.S.",
  "Spl.C.S.",
  "Reg Dkst",
  "Civil M.A.",
  "R.C.A.",
  "L.A.R.",
  "S.C.C.",
  "Insolvency",
  "Final Decree",
  "PWDVA Appln.",
];

window.checkCustomCaseType = function (input, tagId) {
  var val = (input.value || "").trim();
  var tag = document.getElementById(tagId);
  if (!tag) return;
  if (val && window._caseTypeOptions.indexOf(val) === -1) {
    tag.style.display = "block";
    tag.textContent = val;
  } else {
    tag.style.display = "none";
    tag.textContent = "";
  }
};

function extractCs91Records(text) {
  text = String(text || "").replace(/^\uFEFF/, "").trim();
  var records = [];
  var items = [];

  var aliasMap = {
    fil_no: "f",
    case_no: "g",
    state_code: "h",
    district_code: "i",
    court_no_desg_name: "j",
    type_name: "k",
    petparty_name: "l",
    resparty_name: "m",
    establishment_code: "n",
    date_last_list: "o",
    date_next_list: "p",
    purpose_name: "r",
    reg_year: "s",
    reg_no: "t",
  };
  var directKeys = [
    "c", "d", "f", "g", "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t", "u",
  ];

  function tryParse(s) {
    try {
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  }

  var parsed = tryParse(text);
  if (parsed !== null) {
    if (Array.isArray(parsed)) {
      items = parsed;
    } else if (typeof parsed === "string") {
      var inner = tryParse(parsed);
      if (Array.isArray(inner)) {
        items = inner;
      } else {
        items = [parsed];
      }
    } else if (parsed && typeof parsed === "object") {
      items = [parsed];
    }
  }

  if (items.length === 0) {
    var lines = text.split(/\r?\n/);
    for (var li = 0; li < lines.length; li++) {
      var line = lines[li].trim();
      if (!line) continue;
      var lp = tryParse(line);
      if (lp !== null) items.push(lp);
      else if (/^[A-Za-z]{4}\d{12}$/.test(line)) items.push(line);
    }
  }

  function isEmptyVal(v) {
    return v == null || String(v).trim() === "";
  }

  function isFilled(rec, key) {
    return Object.prototype.hasOwnProperty.call(rec, key) && !isEmptyVal(rec[key]);
  }

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (typeof item === "string") {
      var op = tryParse(item);
      if (op !== null) item = op;
    }
    if (!item || typeof item !== "object") continue;

    var cnr =
      item.e != null && String(item.e).trim()
        ? String(item.e).trim()
        : item.cino != null && String(item.cino).trim()
          ? String(item.cino).trim()
          : "";
    if (!cnr) continue;

    var rec = { e: cnr };

    for (var dk = 0; dk < directKeys.length; dk++) {
      var dKey = directKeys[dk];
      if (!isEmptyVal(item[dKey])) rec[dKey] = item[dKey];
    }

    for (var ak in aliasMap) {
      if (Object.prototype.hasOwnProperty.call(aliasMap, ak)) {
        var tKey = aliasMap[ak];
        if (!isEmptyVal(item[ak]) && !isFilled(rec, tKey)) rec[tKey] = item[ak];
      }
    }

    if (item.disp_name != null) {
      rec.d =
        String(item.disp_name).toUpperCase().indexOf("DISMISSED") !== -1
          ? 127
          : 0;
    }

    if (!isFilled(rec, "c")) rec.c = 0;
    if (!isFilled(rec, "d")) rec.d = 0;
    if (!isFilled(rec, "f")) rec.f = 0;
    if (!isFilled(rec, "q")) rec.q = 0;

    var dup = false;
    for (var rj = 0; rj < records.length; rj++) {
      if (records[rj].e == cnr) {
        dup = true;
        break;
      }
    }
    if (!dup) records.push(rec);
  }
  return records;
}

window.importCasesFromFile = function () {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = "*";
  input.style.display = "none";
  document.body.appendChild(input);

  input.addEventListener("change", async function () {
    var file = input.files && input.files[0];
    if (!file) {
      input.remove();
      return;
    }
    var reader = new FileReader();
    reader.onload = async function (ev) {
      try {
        var cs91Records = extractCs91Records(ev.target.result || "");
        if (cs91Records.length === 0) {
          showMessageModal(
            "Info",
            "No valid records found in the selected file!\n\n" +
              "Expected a JSON array of objects (each with an e field matching the cs91 table).",
            false,
          );
          return;
        }

        var btn = document.getElementById("caseCNRImportBtn");
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner"></span> Importing...';
        }

        payload0.x1 = JSON.stringify(cs91Records);
        payload0.fn = 108;
        payload0.vw = 1;
        payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
          { tb: "cs" },
          { tb: "cs91" },
          { tb: "c" },
          { tb: "a" },
        ]);

        try {
          if (typeof fnj3 !== "function") {
            showMessageModal(
              "Info",
              "Server communication not available",
              false,
            );
            return;
          }
          var response = await fnj3(
            "https://my1.in/2/r.php",
            payload0,
            1,
            true,
            null,
            20000,
            0,
            1,
            1,
          );
          console.log("📥 E-Court Import:", response);

          if (response && response.su == 1) {
            await handl_ks_rspons(response);
            await loadDataFromDB();
            renderTable();
            if (
              (response.cs91 && response.cs91.l) ||
              (response.cs && response.cs.l) ||
              (response.c && response.c.l) ||
              (response.a && response.a.l)
            ) {
              showImportResultModal(response);
            } else {
              showMessageModal(
                "Success",
                (response?.ms || "Import completed.").trim(),
                false,
              );
            }
          } else {
            showMessageModal("Error", response?.ms || "Import failed", true);
          }
        } catch (err) {
          showMessageModal("Info", "Error: " + err.message, false);
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-file-import me-1"></i>Import';
          }
        }
      } catch (err) {
        showMessageModal("Info", "Error reading file: " + err.message, false);
      } finally {
        input.remove();
      }
    };
    reader.readAsText(file);
  });

  input.click();
};

function buildImportTableRows(list, type) {
  var rows = "";
  if (!list || !list.length) return "";
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    if (type === "cs91") {
      rows +=
        "<tr>" +
        '<td class="fw-semibold font-mono text-navy" style="white-space:nowrap;">' +
        escHtml(r.e || "-") +
        "</td>" +
        '<td class="fw-semibold font-mono text-navy" style="white-space:nowrap;">' +
        escHtml((r.h && r.i ? r.h + "/" + r.i : r.h || r.i || "-")) +
        "</td>" +
        "<td>" +
        escHtml(r.g || "-") +
        "</td>" +
        '<td class="text-start text-gray-dark truncate" style="max-width:160px;" title="' +
        escAttr(r.n) +
        '">' +
        escHtml(r.n || "-") +
        "</td>" +
        '<td class="text-start text-gray-dark truncate" style="max-width:160px;" title="' +
        escAttr(r.o) +
        '">' +
        escHtml(r.o || "-") +
        "</td>" +
        '<td class="text-start text-gray-dark truncate" style="max-width:160px;" title="' +
        escAttr(r.q) +
        '">' +
        escHtml(r.q || "-") +
        "</td>" +
        "</tr>";
    } else if (type === "cs") {
      rows +=
        "<tr>" +
        '<td class="fw-semibold font-mono text-navy" style="white-space:nowrap;">' +
        escHtml((r.h && r.i ? r.h + "/" + r.i : r.h || r.i || "-")) +
        "</td>" +
        "<td>" +
        escHtml(r.g || "-") +
        "</td>" +
        '<td class="text-start text-gray-dark truncate" style="max-width:180px;" title="' +
        escAttr(r.n) +
        '">' +
        escHtml(r.n || "-") +
        "</td>" +
        '<td class="text-start text-gray-dark truncate" style="max-width:180px;" title="' +
        escAttr(r.o) +
        '">' +
        escHtml(r.o || "-") +
        "</td>" +
        '<td class="text-start text-gray-dark truncate" style="max-width:180px;" title="' +
        escAttr(r.q) +
        '">' +
        escHtml(r.q || "-") +
        "</td>" +
        "</tr>";
    } else if (type === "c") {
      var mobile = r.e || "-";
      if (typeof mobile === "string" && mobile.indexOf(".") > 0) {
        var mp = mobile.split(".");
        mobile = "+" + mp[0] + " " + mp.slice(1).join(".");
      }
      rows +=
        "<tr>" +
        '<td class="text-start text-navy fw-semibold truncate" style="max-width:200px;" title="' +
        escAttr(r.h || r.i) +
        '">' +
        escHtml(r.h || r.i || "-") +
        "</td>" +
        '<td class="font-mono text-gray-dark" style="white-space:nowrap;">' +
        escHtml(mobile) +
        "</td>" +
        '<td class="text-start text-gray-dark truncate" style="max-width:200px;" title="' +
        escAttr(r.m) +
        '">' +
        escHtml(r.m || "-") +
        "</td>" +
        "</tr>";
    } else if (type === "a") {
      var cdN = getCaseDateN(r.n);
      var stgName = (window.stageMap && stageMap[cdN.stg]) || "-";
      rows +=
        "<tr>" +
        '<td class="fw-semibold font-mono text-navy">' +
        escHtml(r.td || "-") +
        "</td>" +
        '<td class="fw-semibold" style="white-space:nowrap;">' +
        escHtml(formatDate(r.e)) +
        "</td>" +
        '<td class="text-start text-gray-dark truncate" style="max-width:180px;" title="' +
        escAttr(stgName) +
        '">' +
        escHtml(stgName) +
        "</td>" +
        "</tr>";
    }
  }
  return rows;
}

function buildImportTableSection(label, list, type, headers) {
  if (!list || !list.length) return "";
  var th = "";
  for (var i = 0; i < headers.length; i++) {
    th +=
      '<th style="font-size:11px;text-transform:uppercase;color:#666;white-space:nowrap;">' +
      escHtml(headers[i]) +
      "</th>";
  }
  return (
    '<div class="mb-3">' +
    '<div class="d-flex align-items-center gap-2 mb-1">' +
    '<span class="fw-bold text-navy" style="font-size:13px;">' +
    escHtml(label) +
    "</span>" +
    '<span class="badge-premium badge-premium-gold" style="font-size:11px;">' +
    list.length +
    "</span></div>" +
    '<div class="table-scroll-premium" style="max-height:30vh;overflow:auto;">' +
    '<table class="table-premium table table-bordered table-sm mb-0">' +
    "<thead><tr>" +
    th +
    "</tr></thead><tbody>" +
    buildImportTableRows(list, type) +
    "</tbody></table></div></div>"
  );
}

function showImportResultModal(response) {
  var mid = "importResultModal_" + Date.now();
  var ms = (response && response.ms) || "";

  var sections = "";
  sections += buildImportTableSection(
    "E-Court Cases (cs91)",
    response?.cs91?.l,
    "cs91",
    ["CNR", "Case No", "Type", "Filer", "Respondent", "Court"],
  );
  sections += buildImportTableSection(
    "Manual Cases (cs)",
    response?.cs?.l,
    "cs",
    ["Case No", "Type", "Filer", "Respondent", "Court"],
  );
  sections += buildImportTableSection(
    "Contacts (c)",
    response?.c?.l,
    "c",
    ["Name", "Mobile", "Address"],
  );
  sections += buildImportTableSection(
    "Case Dates (a)",
    response?.a?.l,
    "a",
    ["Case ID", "Date", "Stage"],
  );
  if (!sections) sections = "<div class='text-gray'>No records returned.</div>";

  var html =
    '<div class="modal fade" id="' +
    mid +
    '" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered modal-lg">' +
    '<div class="modal-content animate-scale-in shadow-xl" style="border:3px solid var(--navy);border-radius:12px;overflow:hidden;">' +
    '<div class="modal-header bg-navy-gradient text-gold" style="padding:14px 18px;border-bottom:3px solid var(--gold);">' +
    '<h6 class="modal-title fw-bold" style="font-size:15px;word-break:break-word;">' +
    '<i class="fas fa-file-import me-2 text-gold"></i>' +
    escHtml(ms || "Import Result") +
    "</h6>" +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
    '<div class="modal-body p-0">' +
    '<div class="p-3" style="background:var(--section-ecourt-bg);border-left:3px solid var(--section-ecourt-border);">' +
    '<div class="text-navy" style="font-size:13px;"><i class="fas fa-info-circle text-gold me-1"></i>' +
    escHtml(ms || "No records returned.") +
    "</div></div>" +
    '<div class="p-3" style="max-height:60vh;overflow:auto;">' +
    sections +
    "</div></div>" +
    '<div class="modal-footer" style="padding:12px 18px;border-top:2px solid var(--gray-bg);">' +
    '<button type="button" class="btn-premium btn-premium-primary" data-bs-dismiss="modal">OK</button></div>' +
    "</div></div></div>";

  document.body.insertAdjacentHTML("beforeend", html);
  var modalEl = document.getElementById(mid);
  var m = new bootstrap.Modal(modalEl);
  m.show();
  modalEl.addEventListener("hidden.bs.modal", function () {
    this.remove();
  });
}

window.syncCaseFromECourt = async function () {
  var cnrInput = document.getElementById("caseCNR");
  if (!cnrInput) return;
  var cnr = (cnrInput.value || "").trim().toUpperCase();
  if (!cnr || !/^[A-Z]{4}\d{12}$/.test(cnr)) {
    showMessageModal(
      "Info",
      "Please enter a valid CNR Number!\n\nFormat: 4 Letters + 12 Digits\nExample: MHCC000120260123",
      false,
    );
    return;
  }

  var btn = document.getElementById("caseCNRSyncBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Syncing...';
  }

    payload0.x1 = cnr;
    payload0.fn = 107;
    payload0.vw = 1;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
      { tb: "cs" },
      { tb: "cs91" },
      { tb: "c" },
      { tb: "a" },
    ]);

  try {
    if (typeof fnj3 !== "function") {
      showMessageModal("Info", "Server communication not available", false);
      return;
    }
    var response = await fnj3(
      "https://my1.in/2/r.php",
      payload0,
      1,
      true,
      null,
      20000,
      0,
      1,
      1,
    );
    console.log("📥 E-Court Sync:", response);
    window._ecourtSyncData = response || null;
    showECourtSyncResult(response, !!(response && response.su == 1));
  } catch (err) {
    showMessageModal("Info", "Error: " + err.message, false);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sync-alt me-1"></i>Sync';
    }
  }
};

var ecourtSyncModalId = null;

function showECourtSyncResult(response, valid) {
  var mid = "ecourtSyncModal_" + Date.now();
  ecourtSyncModalId = mid;
  var pretty;
  try {
    pretty = JSON.stringify(response, null, 2);
  } catch (e) {
    pretty = String(response);
  }

  var obj = (response && response.obj) || {};
  var petAdv = obj.pet_adv || "-";
  var resAdv = obj.res_adv || "-";
  var cnr =
    obj.cino ||
    response?.x1 ||
    document.getElementById("caseCNR")?.value ||
    "";
  var title = petAdv + " vs " + resAdv;

  var saveBtnHtml =
    valid === false
      ? '<button type="button" id="ecourtSyncSaveBtn" onclick="saveECourtSync()" ' +
        'class="btn-premium btn-premium-sm" style="background:#dc3545;border-color:#dc3545;color:#fff;">' +
        '<i class="fas fa-save me-1"></i>no response, still save?</button>'
      : '<button type="button" id="ecourtSyncSaveBtn" onclick="saveECourtSync()" ' +
        'class="btn-premium btn-premium-primary">' +
        '<i class="fas fa-save me-1"></i>Save</button>';

  var html =
    '<div class="modal fade" id="' +
    mid +
    '" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered modal-lg">' +
    '<div class="modal-content animate-scale-in shadow-xl" style="border:3px solid var(--navy);border-radius:12px;overflow:hidden;">' +
    '<div class="modal-header bg-navy-gradient text-gold" style="padding:14px 18px;border-bottom:3px solid var(--gold);">' +
    '<h6 class="modal-title fw-bold" style="font-size:15px;word-break:break-word;">' +
    '<i class="fas fa-balance-scale me-2 text-gold"></i>' +
    escHtml(title) +
    "</h6>" +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
    '<div class="modal-body p-0">' +
    '<div class="p-3" style="background:var(--section-ecourt-bg);border-left:3px solid var(--section-ecourt-border);">' +
    '<div class="fw-bold text-navy mb-1" style="font-size:13px;"><i class="fas fa-qrcode text-gold me-1"></i>CNR: ' +
    escHtml(cnr) +
    "</div>" +
    '<div class="text-navy" style="font-size:13px;"><i class="fas fa-info-circle text-gold me-1"></i>' +
    escHtml(response?.ms || "Case info fetched from E-Court") +
    "</div></div>" +
    '<div class="p-3" style="max-height:55vh;overflow:auto;">' +
    '<pre style="margin:0;font-size:12px;line-height:1.5;color:#333;white-space:pre-wrap;word-break:break-word;">' +
    escHtml(pretty) +
    "</pre></div></div>" +
    '<div class="modal-footer" style="padding:12px 18px;border-top:2px solid var(--gray-bg);">' +
    saveBtnHtml +
    '<button type="button" class="btn-premium btn-premium-secondary" data-bs-dismiss="modal">Close</button></div>' +
    "</div></div></div>";

  document.body.insertAdjacentHTML("beforeend", html);
  var modalEl = document.getElementById(mid);
  var m = new bootstrap.Modal(modalEl);
  m.show();
  modalEl.addEventListener("hidden.bs.modal", function () {
    ecourtSyncModalId = null;
    window._ecourtSyncData = null;
    this.remove();
  });
}

window.saveECourtSync = async function () {
  var cnrInput = document.getElementById("caseCNR");
  var cnr = (cnrInput && (cnrInput.value || "").trim().toUpperCase()) || "";
  if (!cnr) {
    showMessageModal("Info", "CNR Number is missing!", false);
    return;
  }
  var encry = window._ecourtSyncData ? window._ecourtSyncData.encry : null;

  var saveBtn = document.getElementById("ecourtSyncSaveBtn");
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner"></span> Saving...';
  }

  payload0.x1 = cnr;
  payload0.fn = 107;
  if (encry) {
    payload0.x3 = encry;
  } else {
    delete payload0.x3;
  }

  try {
    if (typeof fnj3 !== "function") {
      showMessageModal("Info", "Server communication not available", false);
      return;
    }
    var response = await fnj3(
      "https://my1.in/2/r.php",
      payload0,
      1,
      true,
      null,
      20000,
      0,
      1,
      1,
    );
    console.log("📥 E-Court Save:", response);

    if (response && response.su == 1) {
      if (ecourtSyncModalId) {
        var modalEl = document.getElementById(ecourtSyncModalId);
        if (modalEl) {
          var inst = bootstrap.Modal.getInstance(modalEl);
          if (inst) inst.hide();
        }
      }
      await handl_ks_rspons(response);
      await loadDataFromDB();
      renderTable();
      showMessageModal(
        "Success",
        "✅ E-Court case saved successfully!\n\nCNR: " + cnr,
        false,
      );
    } else {
      showMessageModal("Error", response?.ms || "Failed to save", true);
    }
  } catch (err) {
    showMessageModal("Info", "Error: " + err.message, false);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML =
        '<i class="fas fa-save me-1"></i>' +
        (window._ecourtSyncData && window._ecourtSyncData.su == 1
          ? "Save"
          : "no response, still save?");
    }
  }
};

window.toggleEcFields = function () {
  var hideCols = (
    window[my1uzr.worknOnPg]?.colsToHideCases || ""
  ).toLowerCase();
  var ctGrp = document.getElementById("ec_caseType");
  var cnGrp = document.getElementById("ec_caseNumber");
  var cyGrp = document.getElementById("ec_caseYear");
  if (ctGrp && ctGrp.parentElement)
    ctGrp.parentElement.style.display =
      hideCols.indexOf("ct") < 0 ? "" : "none";
  if (cnGrp && cnGrp.parentElement)
    cnGrp.parentElement.style.display =
      hideCols.indexOf("cn") < 0 ? "" : "none";
  if (cyGrp && cyGrp.parentElement)
    cyGrp.parentElement.style.display =
      hideCols.indexOf("cy") < 0 ? "" : "none";
};

function applyCaseFieldVisibility(modalId, isECourt) {
  var hideCols = (
    window[my1uzr.worknOnPg]?.colsToHideCases || ""
  ).toLowerCase();
  var hideBf = hideCols.indexOf("bf") >= 0 || hideCols.indexOf("bn") >= 0;
  var hideDd = hideCols.indexOf("dd") >= 0;
  var hideNd = hideCols.indexOf("nd") >= 0;
  var hideJn = hideCols.indexOf("jn") >= 0;
  var hideFpn = hideCols.indexOf("fpn") >= 0;
  var hideRpn = hideCols.indexOf("rpn") >= 0;
  var hideFr = hideCols.indexOf("fr") >= 0;
  var hideRp = hideCols.indexOf("rp") >= 0;
  var hideNp = hideCols.indexOf("np") >= 0;
  var hideMore = hideCols.indexOf("more") >= 0;

  function setShow(id, show) {
    var el = document.getElementById(id);
    if (el) el.style.display = show ? "" : "none";
  }

  if (isECourt) {
    setShow("ecBriefGroup", !hideBf);
    setShow("caseDdGroup", !hideDd);
    setShow("courtNameSection", !hideJn);
    setShow("filerGroup", !hideFpn);
    setShow("respondentGroup", !hideRpn);
    setShow("notifSection", !hideNp);
    setShow("partySideFilerLabel", !hideFr);
    setShow("partySideAnswererLabel", !hideRp);
    setShow("datesSection", !(hideDd && hideNd));
    setShow("partySideGroup", !(hideFpn && hideRpn && hideFr && hideRp));
    setShow(modalId + "_moreBtn", !hideMore);
    setShow(modalId + "_moreSection", !hideMore);
    setShow(modalId + "_modalFooter", false);

    var filerRadio = document.getElementById("casePartySideFiler");
    var answererRadio = document.getElementById("casePartySideAnswerer");
    if (filerRadio && answererRadio) {
      if (hideFr && filerRadio.checked) answererRadio.checked = true;
      if (hideRp && answererRadio.checked) filerRadio.checked = true;
    }
  } else {
    setShow("ecBriefGroup", true);
    setShow("caseDdGroup", true);
    setShow("courtNameSection", true);
    setShow("filerGroup", true);
    setShow("respondentGroup", true);
    setShow("notifSection", true);
    setShow("partySideFilerLabel", true);
    setShow("partySideAnswererLabel", true);
    setShow("datesSection", true);
    setShow("partySideGroup", true);
    setShow(modalId + "_moreBtn", true);
    setShow(modalId + "_moreSection", false);
    setShow(modalId + "_modalFooter", true);
  }
}

window.toggleCNRFields = function (modalId) {
  var sourceRadio = document.querySelector(
    'input[name="caseSource_' + modalId + '"]:checked',
  );
  var cnrSection = document.getElementById(modalId + "_cnrSection");
  var manualSection = document.getElementById(modalId + "_manualSection");
  var caseContent = document.getElementById(modalId + "_caseContent");
  var radioEcourt = document.getElementById("csRadioEcourt_" + modalId);
  var radioManual = document.getElementById("csRadioManual_" + modalId);

  if (sourceRadio && sourceRadio.value === "1") {
    if (cnrSection) cnrSection.style.display = "block";
    if (manualSection) manualSection.style.display = "none";
    if (caseContent) {
      caseContent.style.background = "var(--section-ecourt-bg)";
      caseContent.style.borderLeft = "3px solid var(--section-ecourt-border)";
    }
    if (radioEcourt) {
      radioEcourt.className = "cs-radio-label cs-active-ecourt";
    }
    if (radioManual) {
      radioManual.className = "cs-radio-label";
    }
    toggleEcFields();
    applyCaseFieldVisibility(modalId, true);
  } else {
    if (cnrSection) cnrSection.style.display = "none";
    if (manualSection) manualSection.style.display = "block";
    if (caseContent) {
      caseContent.style.background = "var(--section-manual-bg)";
      caseContent.style.borderLeft = "3px solid var(--section-manual-border)";
    }
    if (radioEcourt) {
      radioEcourt.className = "cs-radio-label";
    }
    if (radioManual) {
      radioManual.className = "cs-radio-label cs-active-manual";
    }
    applyCaseFieldVisibility(modalId, false);
  }
};

window.switchEditTab = function (modalId, tab) {
  var tabCase = document.getElementById(modalId + "_tabCase");
  var tabNextDate = document.getElementById(modalId + "_tabNextDate");
  var btnCase = document.getElementById(modalId + "_tabBtnCase");
  var btnNextDate = document.getElementById(modalId + "_tabBtnNextDate");
  var saveBtn = document.getElementById(modalId + "_saveBtn");
  var saveNextBtn = document.getElementById(modalId + "_saveNextBtn");

  if (tab === "case") {
    if (tabCase) tabCase.style.display = "block";
    if (tabNextDate) tabNextDate.style.display = "none";
    if (btnCase) {
      btnCase.style.background = "var(--navy)";
      btnCase.style.color = "var(--gold)";
      btnCase.style.borderBottom = "3px solid var(--navy)";
    }
    if (btnNextDate) {
      btnNextDate.style.background = "var(--gray-surface)";
      btnNextDate.style.color = "var(--gray)";
      btnNextDate.style.borderBottom = "3px solid transparent";
    }
    if (saveBtn) saveBtn.style.display = "";
    if (saveNextBtn) saveNextBtn.style.display = "none";
  } else {
    if (tabCase) tabCase.style.display = "none";
    if (tabNextDate) tabNextDate.style.display = "block";
    if (btnCase) {
      btnCase.style.background = "var(--gray-surface)";
      btnCase.style.color = "var(--gray)";
      btnCase.style.borderBottom = "3px solid transparent";
    }
    if (btnNextDate) {
      btnNextDate.style.background = "var(--navy)";
      btnNextDate.style.color = "var(--gold)";
      btnNextDate.style.borderBottom = "3px solid var(--navy)";
    }
    if (saveBtn) saveBtn.style.display = "none";
    if (saveNextBtn) saveNextBtn.style.display = "";
  }
};

function prefillsAddCaseForm(record, mid) {
  var isECourt =
    record.f === 0 && record.g === "" && record.h === "" && record.i === 0;

  if (isECourt) {
    var eRadio = document.querySelector(
      'input[name="caseSource_' + mid + '"][value="1"]',
    );
    if (eRadio) {
      eRadio.checked = true;
      eRadio.dispatchEvent(new Event("change"));
    }
    var cnrInput = document.getElementById("caseCNR");
    if (cnrInput) {
      var cnrVal = "";
      try {
        var cs91Recs = window.caseRecords91 || [];
        for (var ci = 0; ci < cs91Recs.length; ci++) {
          var cr = cs91Recs[ci];
          if (cr.a === record.a || cr.td === record.a) {
            cnrVal = cr.e || "";
            break;
          }
        }
        if (!cnrVal) {
          for (var ci2 = 0; ci2 < cs91Recs.length; ci2++) {
            var cr2 = cs91Recs[ci2];
            if (
              cr2.q === record.q &&
              cr2.n === record.n &&
              cr2.o === record.o
            ) {
              cnrVal = cr2.e || "";
              break;
            }
          }
        }
      } catch (e) {}
      cnrInput.value = cnrVal;
    }
    var ecCt = document.getElementById("ec_caseType");
    if (ecCt) ecCt.value = record.g || "";
    var ecCn = document.getElementById("ec_caseNumber");
    if (ecCn) ecCn.value = record.h || "";
    var ecCy = document.getElementById("ec_caseYear");
    if (ecCy) ecCy.value = record.i || "";
    if (ecCt && ecCt.value) checkCustomCaseType(ecCt, "ec_caseTypeCustom");
    var briefCNR = document.getElementById("caseBriefNumberCNR");
    if (briefCNR) briefCNR.value = record.l || "";
  } else {
    var nRadio = document.querySelector(
      'input[name="caseSource_' + mid + '"][value="0"]',
    );
    if (nRadio) {
      nRadio.checked = true;
      nRadio.dispatchEvent(new Event("change"));
    }
    var cn = document.getElementById("caseNumber");
    if (cn) cn.value = record.h || "";
    var ct = document.getElementById("caseType");
    if (ct) ct.value = record.g || "";
    var cy = document.getElementById("caseYear");
    if (cy) cy.value = record.i || "";
    var brief = document.getElementById("caseBriefNumber");
    if (brief) brief.value = record.l || "";
  }

  var courtName = document.getElementById("caseCourtName");
  if (courtName) courtName.value = record.q || "";

  var filerName = document.getElementById("caseFilerName");
  if (filerName) filerName.value = record.n || "";

  var respName = document.getElementById("caseRespondentName");
  if (respName) respName.value = record.o || "";

  var sideRadio = document.querySelector(
    'input[name="casePartySide_' + mid + '"][value="' + (record.r || 1) + '"]',
  );
  if (sideRadio) sideRadio.checked = true;

  var adv = document.getElementById("caseAdvocate");
  if (adv) {
    var opts = adv.options;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value && opts[i].value.split("|")[0] === String(record.k)) {
        adv.selectedIndex = i;
        break;
      }
    }
  }

  var cat = document.getElementById("caseCategory");
  if (cat) cat.value = record.t || "";

  var notes = document.getElementById("caseNotes");
  if (notes && record.u) {
    try {
      var parsed =
        typeof record.u === "string" ? JSON.parse(record.u) : record.u;
      notes.value = parsed.n || "";
    } catch (e) {
      notes.value = "";
    }
    var cc = document.getElementById(mid + "_charCount");
    if (cc) cc.textContent = notes.value.length + "/32";
  }
}

window.openEditCaseModal = function (record, cd) {
  window._editingCaseDateEntry = cd || getCaseDatesForRecord(record.a).current;
  showAddCaseModal(record);
};

window.updateCaseRecord = async function () {
  if (!editingRecordId) {
    showMessageModal("Info", "No record selected for editing.", false);
    return;
  }

  var modalId = addCaseModalId;
  var sourceRadio = document.querySelector(
    'input[name="caseSource_' + modalId + '"]:checked',
  );
  var isECourt = sourceRadio && sourceRadio.value === "1";
  var hideCols = (
    window[my1uzr.worknOnPg]?.colsToHideCases || ""
  ).toLowerCase();

  var previousDate = document.getElementById("casePreviousDate")?.value || "";
  var courtName = (
    document.getElementById("caseCourtName")?.value || ""
  ).trim();
  var filerName = (
    document.getElementById("caseFilerName")?.value || ""
  ).trim();
  var respondentName = (
    document.getElementById("caseRespondentName")?.value || ""
  ).trim();

  var countryCode = document.getElementById("caseCountryCode")?.value || "+91";
  var advocate = (document.getElementById("caseAdvocate")?.value || "").trim();
  var caseCategory =
    parseInt(document.getElementById("caseCategory")?.value) || 0;
  var notes = (document.getElementById("caseNotes")?.value || "").trim();
  var imageUrl = (document.getElementById("caseImageUrl")?.value || "").trim();

  // if (!previousDate) {
  //   showMessageModal("Info", "Please select a Previous Date!", false);
  //   return;
  // }
  // if (!courtName) {
  //   showMessageModal("Info", "Please enter Court Name!", false);
  //   return;
  // }
  var fpnHidden = isECourt && hideCols.indexOf("fpn") >= 0;
  var rpnHidden = isECourt && hideCols.indexOf("rpn") >= 0;
  if (!fpnHidden && !filerName) {
    showMessageModal("Info", "Please enter Filer Name!", false);
    return;
  }
  if (!rpnHidden && !respondentName) {
    showMessageModal("Info", "Please enter Respondent Name!", false);
    return;
  }

  var caseNumber, caseType, caseYear, cnrNumber;

  if (isECourt) {
    cnrNumber = (document.getElementById("caseCNR")?.value || "")
      .trim()
      .toUpperCase();
    if (!cnrNumber || !/^[A-Z]{4}\d{12}$/.test(cnrNumber)) {
      showMessageModal(
        "Info",
        "Please enter a valid CNR Number!\n\nFormat: 4 Letters + 12 Digits\nExample: MHCC000120260123",
        false,
      );
      return;
    }
    var ecCnInputU = document.getElementById("ec_caseNumber");
    var ecCyInputU = document.getElementById("ec_caseYear");
    var ecCtInputU = document.getElementById("ec_caseType");
    caseNumber = ecCnInputU ? (ecCnInputU.value || "").trim() : "";
    caseType = ecCtInputU ? (ecCtInputU.value || "").trim() : "";
    caseYear = ecCyInputU ? parseInt(ecCyInputU.value) || 0 : 0;
  } else {
    caseNumber = (document.getElementById("caseNumber")?.value || "").trim();
    caseType = (document.getElementById("caseType")?.value || "").trim();
    caseYear = parseInt(document.getElementById("caseYear")?.value) || 0;
    cnrNumber = null;
    if (!caseNumber) {
      showMessageModal("Info", "Please enter a Case Number!", false);
      return;
    }
    if (!caseType) {
      showMessageModal("Info", "Please select a Case Type!", false);
      return;
    }
    if (!caseYear) {
      showMessageModal("Info", "Please enter a Case Year!", false);
      return;
    }
  }

  var briefNumber = isECourt
    ? (document.getElementById("caseBriefNumberCNR")?.value || "").trim()
    : (document.getElementById("caseBriefNumber")?.value || "").trim();

  var saveBtn = document.getElementById(modalId + "_saveBtn");
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner"></span> Updating...';
  }

  var advocateParts = (advocate || "").split("|");
  var advocateId = parseInt(advocateParts[0]) || 0;

  var partySideRadio = document.querySelector(
    'input[name="casePartySide_' + modalId + '"]:checked',
  );
  var partySide = parseInt(partySideRadio?.value) || 1;

  payload0.x1 = editingRecordId; //Id

  if (isECourt) {
    payload0.cs91 = {
      e: cnrNumber,
    };
  }

  payload0.p = {
    e: parseInt(countryCode.replace("+", "")) || 91,
    f: parseInt(caseNumber) || 0,
    g: caseType,
    h: caseNumber,
    i: caseYear,
    j: imageUrl ? JSON.stringify([{ e: "document", f: imageUrl }]) : null,
    k: advocateId,
    l: briefNumber || "",
    n: filerName,
    o: respondentName,
    q: courtName,
    r: partySide,
    s: null,
    t: caseCategory || 0,
    u: notes ? JSON.stringify({ n: notes }) : null,
  };

  if (isECourt) {
    if (hideCols.indexOf("bf") >= 0 || hideCols.indexOf("bn") >= 0)
      delete payload0.p.l;
    if (hideCols.indexOf("ct") >= 0) delete payload0.p.g;
    if (hideCols.indexOf("cn") >= 0) {
      delete payload0.p.f;
      delete payload0.p.h;
    }
    if (hideCols.indexOf("cy") >= 0) delete payload0.p.i;
    if (hideCols.indexOf("jn") >= 0) delete payload0.p.q;
    if (hideCols.indexOf("fpn") >= 0) delete payload0.p.n;
    if (hideCols.indexOf("rpn") >= 0) delete payload0.p.o;
    if (hideCols.indexOf("fr") >= 0 && hideCols.indexOf("rp") >= 0)
      delete payload0.p.r;
  }

  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
    { tb: "cs" },
    { tb: "cs91" },
    { tb: "c" },
    { tb: "a" },
  ]);
  payload0.fn = 98;

  console.log(
    "📤 Update Case (" + (isECourt ? "E-Court CNR" : "Manual") + "):",
    "a=" + editingRecordId,
    isECourt
      ? JSON.stringify(payload0.cs91, null, 2)
      : JSON.stringify(payload0.p, null, 2),
  );

  try {
    if (typeof fnj3 === "function") {
      var response = await fnj3(
        "https://my1.in/2/n.php",
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
        await handl_ks_rspons(response);
        var modalEl = document.getElementById(modalId);
        if (modalEl) {
          var inst = bootstrap.Modal.getInstance(modalEl);
          if (inst) inst.hide();
        }
        await loadDataFromDB();
        renderTable();
        showMessageModal(
          "Success",
          "✅ Case updated successfully!\n\n" +
            (isECourt
              ? "CNR: " + cnrNumber
              : "Number: " + caseNumber + "/" + caseYear) +
            "\nCourt: " +
            courtName,
          false,
        );
      } else {
        showMessageModal("Info", response?.ms || "Record not updated", false);
      }
    } else {
      showMessageModal("Info", "Server communication not available", false);
    }
  } catch (err) {
    showMessageModal("Info", "Error: " + err.message, false);
  }

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fas fa-edit me-1"></i> Update Case';
  }
};

window.saveCase = async function (modalId) {
  var sourceRadio = document.querySelector(
    'input[name="caseSource_' + modalId + '"]:checked',
  );
  var isECourt = sourceRadio && sourceRadio.value === "1";

  var previousDate = document.getElementById("casePreviousDate")?.value || "";
  var nextDate = document.getElementById("caseNextDate")?.value || "";
  var courtName = (
    document.getElementById("caseCourtName")?.value || ""
  ).trim();
  var filerName = (
    document.getElementById("caseFilerName")?.value || ""
  ).trim();
  var respondentName = (
    document.getElementById("caseRespondentName")?.value || ""
  ).trim();

  var countryCode = document.getElementById("caseCountryCode")?.value || "+91";
  var mobile = (document.getElementById("caseMobile")?.value || "").trim();
  var contactName = (
    document.getElementById("caseContactName")?.value || ""
  ).trim();
  var contactTypeRadio = document.querySelector(
    'input[name="contactType_' + modalId + '"]:checked',
  );
  var advocate = (document.getElementById("caseAdvocate")?.value || "").trim();
  var caseCategory =
    parseInt(document.getElementById("caseCategory")?.value) || 0;
  var caseStatus = document.getElementById("caseStatus")?.value || "1";
  var caseOwner = document.getElementById("caseOwner")?.value || "";
  var notes = (document.getElementById("caseNotes")?.value || "").trim();
  var imageUrl = (document.getElementById("caseImageUrl")?.value || "").trim();

  // if (!previousDate) {
  //   showMessageModal("Info", "Please select a Previous Date!", false);
  //   return;
  // }
  // if (!courtName) {
  //   showMessageModal("Info", "Please enter Court Name!", false);
  //   return;
  // }

  var caseNumber, caseType, caseYear, cnrNumber;

  if (isECourt) {
    cnrNumber = (document.getElementById("caseCNR")?.value || "")
      .trim()
      .toUpperCase();
    if (!cnrNumber || !/^[A-Z]{4}\d{12}$/.test(cnrNumber)) {
      showMessageModal(
        "Info",
        "Please enter a valid CNR Number!\n\nFormat: 4 Letters + 12 Digits\nExample: MHCC000120260123",
        false,
      );
      return;
    }
    var ecCnInputS = document.getElementById("ec_caseNumber");
    var ecCyInputS = document.getElementById("ec_caseYear");
    var ecCtInputS = document.getElementById("ec_caseType");
    caseNumber = ecCnInputS ? (ecCnInputS.value || "").trim() : "";
    caseType = ecCtInputS ? (ecCtInputS.value || "").trim() : "";
    caseYear = ecCyInputS ? parseInt(ecCyInputS.value) || 0 : 0;
    var hideCols = (
      window[my1uzr.worknOnPg]?.colsToHideCases || ""
    ).toLowerCase();
    if (hideCols.indexOf("ct") < 0 && !caseType) {
      showMessageModal("Info", "Please select a Case Type!", false);
      return;
    }
    if (hideCols.indexOf("cn") < 0 && !caseNumber) {
      showMessageModal("Info", "Please enter a Case Number!", false);
      return;
    }
    if (hideCols.indexOf("cy") < 0 && !caseYear) {
      showMessageModal("Info", "Please enter a Case Year!", false);
      return;
    }
  } else {
    caseNumber = (document.getElementById("caseNumber")?.value || "").trim();
    caseType = (document.getElementById("caseType")?.value || "").trim();
    caseYear = parseInt(document.getElementById("caseYear")?.value) || 0;
    cnrNumber = null;
    if (!caseNumber) {
      showMessageModal("Info", "Please enter a Case Number!", false);
      return;
    }
    if (!caseYear) {
      showMessageModal("Info", "Please enter a Case Year!", false);
      return;
    }
    if (!caseType) {
      showMessageModal("Info", "Please select a Case Type!", false);
      return;
    }
  }
  var fpnHidden = isECourt && hideCols.indexOf("fpn") >= 0;
  var rpnHidden = isECourt && hideCols.indexOf("rpn") >= 0;
  if (!fpnHidden && !filerName) {
    showMessageModal("Info", "Please enter Filer Name!", false);
    return;
  }
  if (!rpnHidden && !respondentName) {
    showMessageModal("Info", "Please enter Respondent Name!", false);
    return;
  }

  var briefNumber = isECourt
    ? (document.getElementById("caseBriefNumberCNR")?.value || "").trim()
    : (document.getElementById("caseBriefNumber")?.value || "").trim();

  // === DUPLICATE CHECK ===
  try {
    if (isECourt) {
      var existingRecords = await dbDexieManager.getAllRecords(dbnm, "cs91");
      var cnrExists =
        existingRecords &&
        existingRecords.some(function (r) {
          return r.e === cnrNumber;
        });
      if (cnrExists) {
        showMessageModal(
          "Info",
          "This CNR Number already exists!\n\nCNR: " + cnrNumber,
          false,
        );
        return;
      }
    } else {
      var existingCases = await dbDexieManager.getAllRecords(dbnm, "cs");
      var caseExists =
        existingCases &&
        existingCases.some(function (r) {
          return (
            r.e === (parseInt(countryCode.replace("+", "")) || 91) &&
            r.g === caseType &&
            r.h === caseNumber &&
            r.i === caseYear
          );
        });
      if (caseExists) {
        showMessageModal(
          "Info",
          "This Case already exists!\n\n" +
            caseType +
            " " +
            caseNumber +
            "/" +
            caseYear,
          false,
        );
        return;
      }
    }
  } catch (e) {
    console.warn("Duplicate check error:", e);
  }

  // Disable save button & show loading
  var saveBtn = document.getElementById(modalId + "_saveBtn");
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner"></span> Saving...';
  }

  var advocateParts = (advocate || "").split("|");
  var advocateId = parseInt(advocateParts[0]) || 0;
  var advocateName = advocateParts[1] || "";

  var partySideRadio = document.querySelector(
    'input[name="casePartySide_' + modalId + '"]:checked',
  );
  var partySide = parseInt(partySideRadio?.value) || 1;

  // ✅ Build MySQL-aligned payload
  if (isECourt) {
    payload0.cs91 = {
      e: cnrNumber,
    };
  }
  if (isECourt && hideCols.indexOf("dd") >= 0) {
    delete payload0.x1;
  } else {
    payload0.x1 = previousDate || today;
  }

  payload0.p = {
    e: parseInt(countryCode.replace("+", "")) || 91,
    f: parseInt(caseNumber) || 0,
    g: caseType,
    h: caseNumber,
    i: caseYear,
    j: imageUrl ? JSON.stringify([{ e: "document", f: imageUrl }]) : null,
    k: advocateId,
    l: briefNumber || "",
    n: filerName,
    o: respondentName,
    q: courtName,
    r: partySide,
    s: null,
    t: caseCategory || 0,
    u: notes ? JSON.stringify({ n: notes }) : null,
  };

  if (isECourt) {
    if (hideCols.indexOf("bf") >= 0 || hideCols.indexOf("bn") >= 0)
      delete payload0.p.l;
    if (hideCols.indexOf("ct") >= 0) delete payload0.p.g;
    if (hideCols.indexOf("cn") >= 0) {
      delete payload0.p.f;
      delete payload0.p.h;
    }
    if (hideCols.indexOf("cy") >= 0) delete payload0.p.i;
    if (hideCols.indexOf("jn") >= 0) delete payload0.p.q;
    if (hideCols.indexOf("fpn") >= 0) delete payload0.p.n;
    if (hideCols.indexOf("rpn") >= 0) delete payload0.p.o;
    if (hideCols.indexOf("fr") >= 0 && hideCols.indexOf("rp") >= 0)
      delete payload0.p.r;
  }

  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
    { tb: "cs" },
    { tb: "cs91" },
    { tb: "c" },
    { tb: "a" },
  ]);
  payload0.fn = 92; //Function number is here ---- insert payload

  console.log(
    "📤 Save Case (" + (isECourt ? "E-Court CNR" : "Manual") + "):",
    isECourt
      ? JSON.stringify(payload0.cs91, null, 2)
      : JSON.stringify(payload0.p, null, 2),
  );

  try {
    if (typeof fnj3 === "function") {
      var response = await fnj3(
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
      console.log("📥 Server:", response);

      if (response && response.su == 1) {
        await handl_ks_rspons(response);
        var modalEl = document.getElementById(modalId);
        if (modalEl) {
          var inst = bootstrap.Modal.getInstance(modalEl);
          if (inst) inst.hide();
        }
        await loadDataFromDB();
        renderTable();
        showMessageModal(
          "Success",
          "✅ Case saved successfully!\n\n" +
            (isECourt
              ? "CNR: " + cnrNumber
              : "Number: " + caseNumber + "/" + caseYear) +
            "\nCourt: " +
            courtName,
          false,
        );
      } else {
        showMessageModal("Error", response?.ms || "Failed to save", true);
      }
    } else {
      showMessageModal("Info", "Server communication not available", false);
    }
  } catch (err) {
    // showMessageModal("Info", "Error: " + err.message, false);
  }

  // Re-enable save button
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fas fa-save me-1"></i> Save Case';
  }
};

window.openMemberSelector = function (type) {
  window._currentMemberType = type;
  if (typeof open_entind_crud === "function") {
    var callbackFn =
      type === "filer" ? "selectFilerParty" : "selectAnswererParty";
    open_entind_crud(null, null, "entind" + type, callbackFn, null);
  } else {
    showMessageModal("Info", "Member selector not available.", false);
  }
};

window.toggleMoreDetails = function (modalId) {
  var section = document.getElementById(modalId + "_moreSection");
  var btn = document.getElementById(modalId + "_moreBtn");
  if (!section || !btn) return;
  if (section.style.display === "none" || section.style.display === "") {
    section.style.display = "block";
    btn.innerHTML = 'Less Details <i class="fas fa-chevron-up ms-1"></i>';
  } else {
    section.style.display = "none";
    btn.innerHTML = 'More Details <i class="fas fa-chevron-down ms-1"></i>';
  }
};

window.selectFilerParty = function (record) {
  var nameInput = document.getElementById("caseFilerName");
  if (nameInput && record)
    nameInput.value = record.h || record.i || record.e || "";
};

window.selectAnswererParty = function (record) {
  var nameInput = document.getElementById("caseRespondentName");
  if (nameInput && record)
    nameInput.value = record.h || record.i || record.e || "";
};

window.deleteCaseRecord = function (record) {
  var caseDatesForRecord = caseDates.filter(function (cd) {
    return cd.td === record.a;
  });

  var mid = "deleteCaseModal_" + Date.now();

  var dateRows = "";
  if (caseDatesForRecord.length > 0) {
    for (var i = 0; i < caseDatesForRecord.length; i++) {
      var cd = caseDatesForRecord[i];
      var cnData = getCaseDateN(cd.n);
      var stgName = stageMap[cnData.stg] || "-";
      dateRows +=
        '<tr><td style="padding:4px 8px;font-size:12px;color:#333;">' +
        formatDate(cd.e) +
        '</td><td style="padding:4px 8px;font-size:12px;color:#666;">' +
        escHtml(stgName) +
        "</td></tr>";
    }
  } else {
    dateRows =
      '<tr><td colspan="2" style="padding:8px;font-size:12px;color:#999;text-align:center;">No dates found</td></tr>';
  }

  var caseNo = record.h && record.i ? record.h + "/" + record.i : "-";
  var cdMain = getCaseDatesForRecord(record.a);
  var cdMainN = getCaseDateN(cdMain.current ? cdMain.current.n : null);
  var stgName = stageMap[cdMainN.stg] || "-";

  var html =
    '<div class="modal fade" id="' +
    mid +
    '" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered">' +
    '<div class="modal-content animate-scale-in shadow-xl" style="border:2px solid #dc3545;border-radius:12px;overflow:hidden;">' +
    '<div class="modal-header" style="background:#dc3545;color:#fff;padding:12px 16px;border-bottom:2px solid #dc3545;">' +
    '<h6 class="modal-title fw-bold" style="font-size:14px;"><i class="fas fa-trash-alt me-2"></i>Delete Case</h6>' +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
    "</div>" +
    '<div class="modal-body" style="padding:16px;max-height:70vh;overflow-y:auto;">' +
    '<div style="background:#FFF5F5;border:1px solid #FECACA;border-radius:8px;padding:12px;margin-bottom:12px;">' +
    '<div class="fw-bold text-navy mb-2" style="font-size:13px;"><i class="fas fa-gavel me-1"></i>Case Details</div>' +
    '<table style="width:100%;font-size:13px;">' +
    '<tr><td style="padding:3px 8px;color:#666;width:110px;">Court:</td><td style="padding:3px 8px;color:#333;font-weight:500;">' +
    escHtml(record.q || "-") +
    "</td></tr>" +
    '<tr><td style="padding:3px 8px;color:#666;">Case No:</td><td style="padding:3px 8px;color:#333;font-weight:500;">' +
    escHtml(caseNo) +
    "</td></tr>" +
    '<tr><td style="padding:3px 8px;color:#666;">Filer:</td><td style="padding:3px 8px;color:#333;font-weight:500;">' +
    escHtml(record.n || "-") +
    "</td></tr>" +
    '<tr><td style="padding:3px 8px;color:#666;">Respondent:</td><td style="padding:3px 8px;color:#333;font-weight:500;">' +
    escHtml(record.o || "-") +
    "</td></tr>" +
    '<tr><td style="padding:3px 8px;color:#666;">Case Type:</td><td style="padding:3px 8px;color:#333;font-weight:500;">' +
    escHtml(record.g || "-") +
    "</td></tr>" +
    '<tr><td style="padding:3px 8px;color:#666;">Stage:</td><td style="padding:3px 8px;color:#333;font-weight:500;">' +
    escHtml(stgName) +
    "</td></tr>" +
    "</table></div>" +
    '<div style="background:#FFF5F5;border:1px solid #FECACA;border-radius:8px;padding:12px;margin-bottom:12px;">' +
    '<div class="fw-bold text-navy mb-2" style="font-size:13px;"><i class="fas fa-calendar me-1"></i>Case Dates (' +
    caseDatesForRecord.length +
    ")</div>" +
    '<table style="width:100%;font-size:13px;border-collapse:collapse;">' +
    '<thead><tr style="border-bottom:1px solid #FECACA;"><th style="padding:4px 8px;text-align:left;color:#666;font-size:12px;">Date</th><th style="padding:4px 8px;text-align:left;color:#666;font-size:12px;">Stage</th></tr></thead>' +
    "<tbody>" +
    dateRows +
    "</tbody></table></div>" +
    '<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:8px;padding:12px;text-align:center;">' +
    '<i class="fas fa-exclamation-triangle" style="color:#dc3545;font-size:18px;"></i>' +
    '<div class="fw-bold mt-1" style="color:#dc3545;font-size:14px;">Are you sure you want to delete this case?</div>' +
    '<div style="color:#666;font-size:12px;margin-top:4px;">This action cannot be undone.</div>' +
    "</div></div>" +
    '<div class="modal-footer" style="padding:10px 16px;border-top:1px solid #FECACA;gap:8px;">' +
    '<button type="button" class="btn-premium btn-premium-secondary btn-premium-sm" data-bs-dismiss="modal">Cancel</button>' +
    '<button type="button" class="btn-premium btn-premium-sm" id="' +
    mid +
    '_deleteBtn" style="background:#dc3545;border-color:#dc3545;color:#fff;">' +
    '<i class="fas fa-trash-alt me-1"></i> Delete Case</button>' +
    "</div></div></div></div>";

  document.body.insertAdjacentHTML("beforeend", html);
  var modalEl = document.getElementById(mid);
  var m = new bootstrap.Modal(modalEl, { backdrop: "static" });
  m.show();

  document
    .getElementById(mid + "_deleteBtn")
    .addEventListener("click", async function () {
      //only id payload
      var btn = document.getElementById(mid + "_deleteBtn");
      btn.disabled = true;
      btn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-1"></span> Deleting...';

      try {
        payload0.x1 = record.a;
        delete payload0.dldt;
        payload0.fn = 101;
        payload0.vw = 1;
        payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
          { tb: "cs" },
          { tb: "cs91" },
          { tb: "c" },
          { tb: "a" },
        ]);

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
          m.hide();
          var db = dbDexieManager.dbCache.get(dbnm);
          if (db) {
            await db.table("cs").where("a").equals(record.a).delete();
            await db.table("cs91").where("a").equals(record.a).delete();
            await db
              .table("a")
              .filter(function (d) {
                return d.td == record.a;
              })
              .delete();
          }
          showMessageModal("Success", "Your case is deleted", false);
          setTimeout(function () {
            location.reload();
          }, 1500);
        } else if (
          resp &&
          resp.su == 0 &&
          String(resp.cd).indexOf("1") !== -1
        ) {
          m.hide();
          showDatesDeleteConfirm(record.a);
        } else {
          showMessageModal("Error", resp?.ms || "Failed to delete case", true);
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-trash-alt me-1"></i> Delete Case';
        }
      } catch (err) {
        showMessageModal("Info", "Error: " + err.message, false);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-trash-alt me-1"></i> Delete Case';
      }
    });

  modalEl.addEventListener("hidden.bs.modal", function () {
    this.remove();
  });
};

function showDatesDeleteConfirm(recordA) {
  var mid2 = "deleteDatesModal_" + Date.now();

  var html =
    '<div class="modal fade" id="' +
    mid2 +
    '" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered modal-sm">' +
    '<div class="modal-content animate-scale-in shadow-xl" style="border:2px solid #dc3545;border-radius:12px;overflow:hidden;">' +
    '<div class="modal-header" style="background:#dc3545;color:#fff;padding:12px 16px;border-bottom:2px solid #dc3545;">' +
    '<h6 class="modal-title fw-bold" style="font-size:14px;"><i class="fas fa-question-circle me-2"></i>Delete Case Dates</h6>' +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
    "</div>" +
    '<div class="modal-body" style="padding:16px;text-align:center;">' +
    '<div style="color:#333;font-size:14px;">This case has dates.</div>' +
    '<div style="color:#333;font-size:14px;font-weight:600;margin-top:8px;">Are you want to delete the case dates?</div>' +
    "</div>" +
    '<div class="modal-footer" style="padding:10px 16px;border-top:1px solid #FECACA;gap:8px;justify-content:center;">' +
    '<button type="button" class="btn-premium btn-premium-sm" id="' +
    mid2 +
    '_noBtn" style="background:#6c757d;border-color:#6c757d;color:#fff;min-width:80px;">No</button>' +
    '<button type="button" class="btn-premium btn-premium-sm" id="' +
    mid2 +
    '_yesBtn" style="background:#dc3545;border-color:#dc3545;color:#fff;min-width:80px;">Yes</button>' +
    "</div></div></div></div>";

  document.body.insertAdjacentHTML("beforeend", html);
  var modalEl2 = document.getElementById(mid2);
  var m2 = new bootstrap.Modal(modalEl2, { backdrop: "static" });
  m2.show();

  document
    .getElementById(mid2 + "_yesBtn")
    .addEventListener("click", async function () {
      m2.hide();
      await sendDeleteWithDltd(recordA, 1);
    });

  document
    .getElementById(mid2 + "_noBtn")
    .addEventListener("click", async function () {
      m2.hide();
      await sendDeleteWithDltd(recordA, 0);
    });

  modalEl2.addEventListener("hidden.bs.modal", function () {
    this.remove();
  });
}

async function sendDeleteWithDltd(recordA, dldt) {
  //dltd payload with id
  try {
    payload0.x1 = recordA;
    payload0.dldt = dldt;
    payload0.fn = 101;
    payload0.vw = 1;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
      { tb: "cs" },
      { tb: "cs91" },
      { tb: "c" },
      { tb: "a" },
    ]);

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
      var db = dbDexieManager.dbCache.get(dbnm);
      if (db) {
        await db.table("cs").where("a").equals(recordA).delete();
        await db.table("cs91").where("a").equals(recordA).delete();
        await db
          .table("a")
          .filter(function (d) {
            return d.td == recordA;
          })
          .delete();
      }
      showMessageModal("Success", "Your case is deleted", false);
      setTimeout(function () {
        location.reload();
      }, 1500);
    } else {
      showMessageModal("Error", resp?.ms || "Failed to delete case", true);
    }
  } catch (err) {
    showMessageModal("Info", "Error: " + err.message, false);
  }
}

console.log("📂 addNewCase.js loaded");
