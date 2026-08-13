// ei.js - Entity/Individual CRUD
// Premium Bootstrap Design

let d_entInd_ata = [],
  f1nEiToExe = null,
  loaderElement = null,
  s_ei_witchToReturn = null,
  currentEditingRecord = null,
  currentModalId = null;

if (typeof isFieldVisible !== "function") {
  window.isFieldVisible = function (fieldId) {
    var el = document.getElementById(fieldId);
    if (!el) return false;
    return el.offsetParent !== null;
  };
}

function getHiddenFields() {
  var c = window[my1uzr.worknOnPg]?.colsToHidePartyDetails || "";
  if (!c) return [];
  return c
    .split(",")
    .map(function (k) {
      return k.trim().toLowerCase();
    })
    .filter(function (k) {
      return k;
    });
}
function isFieldHidden(fk) {
  return getHiddenFields().includes(fk);
}

async function open_entind_crud(...args) {
  console.log("🚀 open_entind_crud called");

  if (args.length === 0) return;
  loaderElement = document.getElementById(args[0] || null);
  var trgt = args[2] || null;
  f1nEiToExe = args[3] || null;
  s_ei_witchToReturn = args[4] || null;
  if (loaderElement) loaderElement.style.display = "flex";

  try {
    d_entInd_ata = await dbDexieManager.getAllRecords(dbnm, "c");
    d_entInd_ata.sort(function (a, b) {
      return new Date(b.b) - new Date(a.b);
    });

    setTimeout(function () {
      if (loaderElement) loaderElement.style.display = "none";
      currentModalId =
        "entind_modal_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substr(2, 9);
      var mr = create_modal_dynamically(currentModalId),
        modal = mr.modalElement,
        mc = mr.contentElement;
      var md = modal.querySelector(".modal-dialog");
      if (md) {
        md.classList.add("modal-dialog-centered");
        md.style.maxWidth = "640px";
      }
      var ec = document.getElementById(trgt);
      if (ec && ec.parentNode) ec.remove();
      mc.id = trgt;
      mc.className = "modal-content h-100 d-flex flex-column";
      renderCRUDInterface(mc);
      mr.modalInstance.show();
      modal.addEventListener("hidden.bs.modal", function () {
        closeSpecificModal(currentModalId);
        modal.remove();
        currentModalId = null;
      });
    }, 500);
  } catch (e) {
    console.error("Error:", e);
    if (loaderElement) loaderElement.style.display = "none";
    showMessageModal("Info", "❌ " + e.message, false);
  }
}

function closeSpecificModal(id) {
  var m = document.getElementById(id);
  if (m) {
    var i = bootstrap.Modal.getInstance(m);
    if (i) i.hide();
  }
  currentModalId = null;
}

function renderCRUDInterface(container) {
  var hCC = isFieldHidden("cc"),
    hPN = isFieldHidden("pn"),
    hRS = isFieldHidden("rs"),
    hNE = isFieldHidden("ne"),
    hNN = isFieldHidden("nn"),
    hAD = isFieldHidden("ad"),
    hG = isFieldHidden("g"),
    hUSI = isFieldHidden("usi");

  container.innerHTML = `
<!-- ========== HEADER ========== -->
<div class="modal-header bg-navy-gradient text-gold" style="padding:14px 20px;border-bottom:3px solid var(--gold);flex-shrink:0;">
  <div class="d-flex align-items-center gap-3 w-100 flex-wrap">
    <h5 class="modal-title fw-bold text-white" style="font-size:17px;white-space:nowrap;">
      <i class="fas fa-users me-2 text-gold"></i>Members
    </h5>
    <div class="d-flex gap-2 flex-grow-1" style="min-width:150px;">
      <button type="button" id="bt_sho_ad_ei" class="btn-premium btn-premium-primary btn-premium-sm" title="Add New Member">
        <i class="fas fa-plus"></i>
      </button>
      <input type="text" class="form-control-premium" id="entindSearch" placeholder="🔍 Search by ID, Mobile, Name...">
      <button class="btn-premium btn-premium-secondary btn-premium-sm" type="button" id="clearSearch" title="Clear Search">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" style="flex-shrink:0;"></button>
  </div>
</div>

<!-- ========== BODY ========== -->
<div class="modal-body p-3" style="overflow-y:auto;flex:1;background:var(--gray-surface);">

  <!-- Add New Form -->
  <div id="addNewWhenNotFound" class="d-none">
    <div class="card-premium p-3 mb-3 animate-fade-in">
      <div class="add-form-title mb-3 pb-2" style="border-bottom:2px solid var(--navy);">
        <i class="fas fa-user-plus me-2 text-navy"></i>
        <span class="fw-bold text-navy" style="font-size:16px;">Add New Member</span>
      </div>

      <!-- Mobile Number -->
      <div class="p-2 mb-2 rounded-md" style="${hCC && hPN ? "display:none;" : ""}background:var(--gold-bg);border:2px solid var(--gold);">
        <div class="text-xs fw-bold text-uppercase text-gray-dark mb-2">
          <i class="fas fa-phone me-1 text-navy"></i> Mobile Number
        </div>
        <div class="row g-2 align-items-center">
          <div class="col-4 col-sm-3" style="${hCC ? "display:none;" : ""}">
            <select class="form-select-premium" id="quickCountryCode" style="font-size:13px;padding:6px 8px;border-color:var(--gold);">
              <option value="91" selected>🇮🇳 +91</option>
              <option value="1">🇺🇸 +1</option>
              <option value="44">🇬🇧 +44</option>
            </select>
          </div>
          <div class="col-8 col-sm-9" style="${hPN ? "display:none;" : ""}">
            <input type="text" class="form-control-premium" id="quickMobile" placeholder="Enter Mobile Number" required style="font-size:14px;border-color:var(--gold);">
            <span class="error-text" id="mobileError" style="font-size:11px;color:#dc3545;display:none;margin-top:2px;">Must be 10 digits</span>
          </div>
        </div>
      </div>

      <!-- Relation -->
      <div class="p-2 mb-2 rounded-md" style="${hRS ? "display:none;" : ""}background:#E8EAF6;border:2px solid var(--navy);">
        <div class="text-xs fw-bold text-uppercase text-gray-dark mb-2">
          <i class="fas fa-link me-1 text-navy"></i> Name Relation
        </div>
        <select class="form-select-premium" id="quickRelation" style="font-size:13px;padding:6px 8px;border-color:var(--navy);">
          <option value="1" selected>self [स्वतः]</option>
          <option value="2">relative 1</option><option value="3">relative 2</option>
          <option value="4">relative 3</option><option value="5">relative 4</option>
          <option value="6">relative 5</option><option value="7">relative 6</option>
          <option value="8">relative 7</option><option value="9">relative 8</option>
        </select>
      </div>

      <!-- Name English -->
      <div class="p-2 mb-2 rounded-md" style="${hNE ? "display:none;" : ""}background:var(--gold-bg);border:2px solid var(--gold);">
        <div class="text-xs fw-bold text-uppercase text-gray-dark mb-2">
          <i class="fas fa-font me-1 text-navy"></i> Name (English)
        </div>
        <span class="error-text" id="englishNameError" style="font-size:11px;color:#dc3545;display:none;">Only English characters allowed</span>
        <input type="text" class="form-control-premium" id="quickNameEnglish" placeholder="Enter English Name" style="font-size:14px;border-color:var(--gold);">
      </div>

      <!-- Name Local -->
      <div class="p-2 mb-2 rounded-md" style="${hNN ? "display:none;" : ""}background:#E8EAF6;border:2px solid var(--navy);">
        <div class="text-xs fw-bold text-uppercase text-gray-dark mb-2">
          <i class="fas fa-language me-1 text-navy"></i> Name (Local)
        </div>
        <input type="text" class="form-control-premium" id="quickNameLocal" placeholder="Local name" style="font-size:14px;border-color:var(--navy);">
      </div>

      <!-- Address -->
      <div class="p-2 mb-2 rounded-md" style="${hAD ? "display:none;" : ""}background:var(--gold-bg);border:2px solid var(--gold);">
        <div class="text-xs fw-bold text-uppercase text-gray-dark mb-2">
          <i class="fas fa-map-marker-alt me-1 text-navy"></i> Address
        </div>
        <textarea class="form-control-premium" id="quickAddress" rows="2" placeholder="Enter Address" style="font-size:14px;border-color:var(--gold);resize:vertical;min-height:40px;"></textarea>
      </div>

      <!-- Gender + Unique ID -->
      <div class="row g-2">
        <div class="col-6 col-md-4">
          <div class="p-2 rounded-md" style="${hG ? "display:none;" : ""}background:#E8EAF6;border:2px solid var(--navy);">
            <div class="text-xs fw-bold text-uppercase text-gray-dark mb-2">
              <i class="fas fa-venus-mars me-1 text-navy"></i> Gender
            </div>
            <select class="form-select-premium" id="quickGender" style="font-size:13px;padding:6px 8px;border-color:var(--navy);">
              <option value="0">Don't know</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>
        </div>
        <div class="col-6 col-md-8">
          <div class="p-2 rounded-md" style="${hUSI ? "display:none;" : ""}background:var(--gold-bg);border:2px solid var(--gold);">
            <div class="text-xs fw-bold text-uppercase text-gray-dark mb-2">
              <i class="fas fa-id-card me-1 text-navy"></i> Unique ID
            </div>
            <input type="text" class="form-control-premium" id="quickUniqueSupplierId" placeholder="Unique ID (Optional)" maxlength="8" style="text-transform:uppercase;font-size:14px;border-color:var(--gold);" oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')">
          </div>
        </div>
      </div>

      <div style="display:none;">
        <textarea id="quickImageUrl"></textarea>
        <input type="hidden" id="editRecordId">
      </div>

      <!-- Buttons -->
      <div class="text-center mt-3">
        <button type="button" class="btn-premium btn-premium-primary me-2" id="quickSave">
          <i class="fas fa-save me-1"></i> Save
        </button>
        <button type="button" class="btn-premium btn-premium-secondary" id="cancelAddNew">
          <i class="fas fa-times me-1"></i> Cancel
        </button>
        <button type="button" class="btn-premium btn-premium-primary" id="updateEntInd" style="display:none;">
          <i class="fas fa-edit me-1"></i> Update
        </button>
      </div>
    </div>
  </div>

  <!-- Cards Container -->
  <div id="entindCardsContainer" style="max-height:40vh;overflow-y:auto;overflow-x:hidden;"></div>
</div>`;

  setupEventListeners();
  setupQuickAddFormValidation();
  renderCards();
}

function setupEventListeners() {
  var ab = document.getElementById("bt_sho_ad_ei");
  if (ab)
    ab.addEventListener("click", function () {
      showAddNewForm();
    });
  var cb = document.getElementById("cancelAddNew");
  if (cb)
    cb.addEventListener("click", function () {
      hideAddNewForm();
      renderCards();
    });
  var ub = document.getElementById("updateEntInd");
  if (ub)
    ub.addEventListener("click", function () {
      updateRecord();
    });
  var si = document.getElementById("entindSearch");
  if (si)
    si.addEventListener("input", function () {
      renderCards(this.value.trim());
    });
  var cl = document.getElementById("clearSearch");
  if (cl)
    cl.addEventListener("click", function () {
      var s = document.getElementById("entindSearch");
      if (s) {
        s.value = "";
        renderCards("");
      }
    });
  var sb = document.getElementById("quickSave");
  if (sb)
    sb.addEventListener("click", async function () {
      await saveRecord(false);
    });
}

function showAddNewForm(record) {
  var add = document.getElementById("addNewWhenNotFound");
  if (!add) return;
  var sb = document.getElementById("quickSave"),
    ub = document.getElementById("updateEntInd"),
    ri = document.getElementById("editRecordId");
  add.classList.remove("d-none");
  var cc = document.getElementById("entindCardsContainer");
  if (cc) cc.innerHTML = "";

  if (record) {
    if (sb) sb.style.display = "none";
    if (ub) ub.style.display = "inline-block";
    if (ri) ri.value = record.a;
    currentEditingRecord = record;
    if (record.e) {
      var mp = record.e.split(".");
      if (mp.length === 2) {
        var cf = document.getElementById("quickCountryCode"),
          mf = document.getElementById("quickMobile");
        if (cf) cf.value = mp[0];
        if (mf) mf.value = mp[1];
      }
    }
    setVal("quickRelation", record.f || "1");
    setVal("quickNameEnglish", record.h || "");
    setVal("quickNameLocal", record.i || "");
    setVal("quickAddress", record.m || "");
    setVal("quickGender", record.n || "0");
    setVal("quickImageUrl", record.l || "");
    setVal("quickUniqueSupplierId", record.k || "");
  } else {
    if (sb) sb.style.display = "inline-block";
    if (ub) ub.style.display = "none";
    if (ri) ri.value = "";
    currentEditingRecord = null;
    setVal("quickCountryCode", "91");
    setVal("quickMobile", "");
    setVal("quickRelation", "1");
    setVal("quickNameEnglish", "");
    setVal("quickNameLocal", "");
    setVal("quickAddress", "");
    setVal("quickGender", "0");
    setVal("quickImageUrl", "");
    setVal("quickUniqueSupplierId", "");
  }
  clearErrors();
}
function setVal(id, v) {
  var el = document.getElementById(id);
  if (el) el.value = v;
}
function clearErrors() {
  var me = document.getElementById("mobileError"),
    ee = document.getElementById("englishNameError"),
    le = document.getElementById("localNameError"),
    mi = document.getElementById("quickMobile"),
    ne = document.getElementById("quickNameEnglish"),
    nl = document.getElementById("quickNameLocal");
  if (me) me.style.display = "none";
  if (ee) ee.style.display = "none";
  if (le) le.style.display = "none";
  if (mi) mi.classList.remove("is-invalid");
  if (ne) ne.classList.remove("is-invalid");
  if (nl) nl.classList.remove("is-invalid");
}
function hideAddNewForm() {
  var a = document.getElementById("addNewWhenNotFound");
  if (a) a.classList.add("d-none");
}

function validateMobile(inp) {
  if (!inp || !isFieldVisible("quickMobile")) return true;
  var v = /^\d{10}$/.test(inp.value),
    er = document.getElementById("mobileError");
  if (!v && inp.value) {
    if (er) er.style.display = "block";
    inp.classList.add("is-invalid");
    return false;
  } else {
    if (er) er.style.display = "none";
    inp.classList.remove("is-invalid");
    return true;
  }
}
function validateEnglishName(inp) {
  if (!inp || !isFieldVisible("quickNameEnglish")) return true;
  var v = /^[A-Za-z0-9\s\-'\/]+$/.test(inp.value),
    er = document.getElementById("englishNameError");
  if (!v && inp.value) {
    if (er) {
      er.textContent = "Only English chars allowed";
      er.style.display = "block";
    }
    inp.classList.add("is-invalid");
    return false;
  } else {
    if (er) er.style.display = "none";
    inp.classList.remove("is-invalid");
    return true;
  }
}
function validateLocalName(inp) {
  if (!inp || !isFieldVisible("quickNameLocal")) return true;
  if (!inp.value) return true;
  var v =
      /^[^\x00-\x7F\s]*$/.test(inp.value) ||
      /^[\u0900-\u097F\s\-']+$/.test(inp.value),
    er = document.getElementById("localNameError");
  if (!v) {
    if (er) {
      er.textContent = "Only local chars allowed";
      er.style.display = "block";
    }
    inp.classList.add("is-invalid");
    return false;
  } else {
    if (er) er.style.display = "none";
    inp.classList.remove("is-invalid");
    return true;
  }
}

function setupQuickAddFormValidation() {
  var mi = document.getElementById("quickMobile"),
    ne = document.getElementById("quickNameEnglish"),
    nl = document.getElementById("quickNameLocal");
  if (mi)
    mi.addEventListener("input", function () {
      validateMobile(this);
    });
  if (ne)
    ne.addEventListener("input", function () {
      validateEnglishName(this);
    });
  if (nl)
    nl.addEventListener("input", function () {
      validateLocalName(this);
    });
}

async function saveRecord(isUpdate) {
  try {

    var mi = document.getElementById("quickMobile"),
      ne = document.getElementById("quickNameEnglish"),
      nl = document.getElementById("quickNameLocal");
    if (
      !validateMobile(mi) ||
      !validateEnglishName(ne) ||
      !validateLocalName(nl)
    )
      return;
    if (isFieldVisible("quickMobile") && mi && !mi.value) {
      var me = document.getElementById("mobileError");
      if (me) me.style.display = "block";
      if (mi) mi.classList.add("is-invalid");
      return;
    }
    var cc = document.getElementById("quickCountryCode")?.value || "91",
      mn = mi?.value || "",
      fm = cc + "." + mn,
      rel = document.getElementById("quickRelation")?.value || "1";
    var ui = document.getElementById("quickUniqueSupplierId"),
      usid = ui?.value?.trim()?.toUpperCase() || "";
    usid = usid.replace(/[^A-Z0-9]/g, "");
    if (usid.length > 8) {
      usid = usid.substring(0, 8);
      if (ui) ui.value = usid;
    }
    var rid = document.getElementById("editRecordId")?.value || "",
      neVal = ne?.value || "",
      nlVal = nl?.value || "",
      addr = document.getElementById("quickAddress")?.value || "",
      gen = document.getElementById("quickGender")?.value || "0";
    var c = {};
    c.e = fm;
    c.f = rel;
    c.h = neVal;
    c.i = nlVal;
    c.k = usid || null;
    c.m = addr;
    c.n = gen;
    if (isUpdate) c.a = rid;
    payload0.c = c;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
      { tb: "c", col: "b", cl: "b" },
    ]);
    payload0.vw = 1;
    payload0.fn = isUpdate ? 80 : 79;
    if (typeof fnj3 !== "function") {
      showMessageModal("Info", "Server not available", false);
      return;
    }

    // Loading state
    var saveBtn = document.getElementById("quickSave"),
      updateBtn = document.getElementById("updateEntInd");
    var activeBtn = isUpdate ? updateBtn : saveBtn;
    if (activeBtn) {
      activeBtn.disabled = true;
      activeBtn.innerHTML = '<span class="spinner"></span> Saving...';
    }

    var resp = await fnj3(
      "https://my1.in/2/j.php",
      payload0,
      1,
      true,
      null,
      15000,
      0,
      1,
      1,
    );
    if (resp && resp.su === 1) {
      await handl_ks_rspons(resp, 0);
      hideAddNewForm();
      renderCards();
      showMessageModal("Success", "✅ Member saved successfully!", false);
      if (f1nEiToExe && window[f1nEiToExe]) {
        var cstmr = await dbDexieManager.getAllRecords(dbnm, "c");
        var saved = cstmr.find(function (d) {
          return d.e === c.e && d.f === c.f;
        });
        if (saved) {
          window[f1nEiToExe](saved, s_ei_witchToReturn);
          if (currentModalId) closeSpecificModal(currentModalId);
        }
      }
    } else {
      showMessageModal("Error", resp?.ms || "Failed", true);
    }
    if (activeBtn) {
      activeBtn.disabled = false;
      activeBtn.innerHTML = isUpdate
        ? '<i class="fas fa-edit me-1"></i> Update'
        : '<i class="fas fa-save me-1"></i> Save';
    }
  } catch (e) {
    showMessageModal("Info", e.message, false);
  }
}
async function updateRecord() {
  await saveRecord(true);
}

function renderCards(searchTerm) {
  var cont = document.getElementById("entindCardsContainer");
  if (!cont) return;
  cont.innerHTML = "";
  var st = searchTerm?.trim()?.toLowerCase() || "",
    fd = st
      ? d_entInd_ata.filter(function (i) {
          return (
            (i.a && i.a.toString().toLowerCase().includes(st)) ||
            (i.e && i.e.toString().toLowerCase().includes(st)) ||
            (i.h && i.h.toLowerCase().includes(st)) ||
            (i.i && i.i.toLowerCase().includes(st)) ||
            (i.k && i.k.toString().toLowerCase().includes(st))
          );
        })
      : d_entInd_ata;
  var add = document.getElementById("addNewWhenNotFound");
  if (add) add.classList.add("d-none");
  if (fd.length === 0 && st) {
    showAddNewForm();
    var isn = /^\d+$/.test(st),
      isa = /^[\x00-\x7F]*$/.test(st),
      mi = document.getElementById("quickMobile"),
      ne = document.getElementById("quickNameEnglish"),
      nl = document.getElementById("quickNameLocal");
    if (isn && mi) mi.value = st.substring(0, 10);
    else if (ne) ne.value = st;
    if (!isa && nl) {
      nl.value = st;
      if (ne) ne.value = "";
    }
  }
  if (fd.length === 0) {
    cont.innerHTML =
      '<div class="text-center text-gray-light py-4"><i class="fas fa-users mb-2 d-block" style="font-size:36px;"></i>No records found</div>';
    return;
  }

  fd.forEach(function (item, idx) {
    var card = document.createElement("div");
    card.className = "col-12 col-md-6 mb-2";
    card.innerHTML =
      '<div class="card-premium shadow-hover animate-fade-in" style="animation-delay:' +
      idx * 50 +
      'ms;cursor:pointer;">' +
      '<div class="card-body p-3">' +
      '<div class="d-flex justify-content-between align-items-start mb-2">' +
      '<div><span class="fw-semibold text-navy" style="font-size:13px;">' +
      (item.h || item.i || "N/A") +
      "</span>" +
      (item.k
        ? '<span class="badge-premium badge-premium-gold ms-2">' +
          item.k +
          "</span>"
        : "") +
      "</div>" +
      '<span class="badge-premium badge-premium-navy">#' +
      item.a +
      "</span></div>" +
      '<div class="text-sm text-gray">' +
      (item.e
        ? '<div><i class="fas fa-phone me-1 text-navy" style="width:14px;"></i>' +
          item.e +
          "</div>"
        : "") +
      (item.f
        ? '<div><i class="fas fa-tag me-1 text-navy" style="width:14px;"></i>' +
          getRelationText(item.f) +
          "</div>"
        : "") +
      (item.m
        ? '<div class="mt-1 truncate"><i class="fas fa-map-marker-alt me-1 text-navy" style="width:14px;"></i>' +
          item.m +
          "</div>"
        : "") +
      "</div></div>" +
      '<div class="card-footer bg-transparent border-top p-2 d-flex gap-2">' +
      '<button class="btn-premium btn-premium-primary btn-premium-sm edit-btn" style="font-size:10px;padding:3px 12px;" data-id="' +
      item.a +
      '">Edit</button>' +
      '<button class="btn-premium btn-premium-danger btn-premium-sm delete-btn" style="font-size:10px;padding:3px 12px;" data-id="' +
      item.a +
      '">Delete</button></div></div>';
    card.addEventListener("click", function (e) {
      if (
        !e.target.classList.contains("edit-btn") &&
        !e.target.classList.contains("delete-btn")
      ) {
        if (currentModalId) closeSpecificModal(currentModalId);
        if (f1nEiToExe && window[f1nEiToExe])
          window[f1nEiToExe](item, s_ei_witchToReturn);
      }
    });
    cont.appendChild(card);
  });

  document.querySelectorAll(".edit-btn").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var id = e.target.getAttribute("data-id"),
        rec = d_entInd_ata.find(function (i) {
          return i.a.toString() === id.toString();
        });
      if (rec) showAddNewForm(rec);
    });
  });
  document.querySelectorAll(".delete-btn").forEach(function (b) {
    b.addEventListener("click", async function (e) {
      e.stopPropagation();
      var id = e.target.getAttribute("data-id");
      window.showModal({
        title: "Delete Record",
        message: "Are you sure you want to delete this record?",
        type: "confirm",
        onConfirm: async function () {
          try {
            payload0.c = { a: id };
            payload0.fn = 3;
            var resp = await fnj3(
              "https://my1.in/2/b.php",
              payload0,
              1,
              true,
              null,
              15000,
              0,
              1,
              1,
            );
            if (resp && resp.su === 1) {
              d_entInd_ata = d_entInd_ata.filter(function (i) {
                return i.a !== id;
              });
              renderCards(document.getElementById("entindSearch")?.value || "");
              showMessageModal("Success", "✅ Record deleted!", false);
            } else {
              showMessageModal("Error", resp?.ms || "Failed", true);
            }
          } catch (e) {
            showMessageModal("Info", e.message, false);
          }
        },
      });
    });
  });
}
function getRelationText(c) {
  var r = {
    1: "self",
    2: "relative 1",
    3: "relative 2",
    4: "relative 3",
    5: "relative 4",
    6: "relative 5",
    7: "relative 6",
    8: "relative 7",
    9: "relative 8",
  };
  return r[c] || "Unknown";
}

window.open_entind_crud = open_entind_crud;
console.log("📂 ei.js loaded - Premium Design");
