// ks_da.js - KS Settings Editor
// Business Details + Logo + Advocates on Board
// Data source: ks.da | Save endpoint: 2/da.php (fn -22)

const SETTINGS_SAVE_URL = "https://my1.in/3/c.php";
const SETTINGS_SAVE_FN = 104;
const SETTINGS_DRML = "sambodhisarang.in";

const SETTINGS_FALLBACK = {
  printCompNm: "adv office kolhapur court",
  printAdrs: "",
};

const DEFAULT_LOGO = "https://i.postimg.cc/gJ62yjJf/my1.jpg";
const imgObjDimensRqd = ["500x500"];

(function () {
  "use strict";

  console.log("ks_da.js initializing...");

  let currentSettings = null;
  let personsList = [];

  var ADV_BOARD_MAX =
    typeof maxNoOfAdvOnBoard !== "undefined"
      ? Number(maxNoOfAdvOnBoard) || 9
      : 9;

  function escHtml(s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---------- Logo helpers ----------
  function resolveLogoUrl(value) {
    const raw = value ? String(value).trim() : "";
    if (!raw) return DEFAULT_LOGO;
    let resolved = raw;
    if (typeof window.getGoogleDriveImageUrl === "function") {
      resolved = window.getGoogleDriveImageUrl(raw) || raw;
    } else {
      const parts = raw.split(/\s+/);
      if (parts.length >= 1 && /^[A-Za-z0-9_-]{20,}$/.test(parts[0])) {
        resolved =
          "https://lh3.googleusercontent.com/d/" + parts[0] + "=s0?authuser=0";
      }
    }
    return resolved || DEFAULT_LOGO;
  }

  window.afterimagesetcallrun = function (objjjj) {
    const imgUrl = (objjjj && (objjjj.g1 || objjjj.url)) || "";
    const preview = document.getElementById("prtStngLogoPreview");
    const error = document.getElementById("prtStngLogoError");
    const logoInput = document.getElementById("prtStng_print_logo");
    if (preview) {
      preview.src = resolveLogoUrl(imgUrl);
      preview.style.display = "";
    }
    if (error) error.style.display = "none";
    if (logoInput) logoInput.value = imgUrl;
  };

  window.removeLogoPreview = function () {
    const preview = document.getElementById("prtStngLogoPreview");
    const error = document.getElementById("prtStngLogoError");
    const logoInput = document.getElementById("prtStng_print_logo");
    if (preview) preview.src = resolveLogoUrl("");
    if (error) error.style.display = "none";
    if (logoInput) logoInput.value = "";
  };

  // ---------- Load settings from ks.da ----------
  async function loadSettings() {
    let base = {
      printCompNm: SETTINGS_FALLBACK.printCompNm,
      printAdrs: SETTINGS_FALLBACK.printAdrs,
      print_logo: "",
      advOnBoard: [],
    };
    try {
      const response = await fetch("ks.da");
      if (response.ok) {
        const da = await response.json();
        if (da.entNm) base.printCompNm = da.entNm;
        if (da.entAdrs !== undefined && da.entAdrs !== null)
          base.printAdrs = String(da.entAdrs);
        const lg = String(da.entLogoUrl || "").trim();
        if (
          /^(https?:\/\/|data:image)/i.test(lg) ||
          /^[A-Za-z0-9_-]{20,}$/.test(lg)
        )
          base.print_logo = lg;
        if (Array.isArray(da.advOnBoard))
          base.advOnBoard = da.advOnBoard.map(function (v) {
            return Number(v);
          });
        console.log("Loaded settings from ks.da:", da);
      } else {
        console.warn(
          "ks.da not found (" + response.status + "), using fallback defaults",
        );
      }
    } catch (e) {
      console.warn("Could not load ks.da, using fallback defaults:", e);
    }
    return base;
  }

  // ---------- Persons (contacts table "c") ----------
  async function fetchPersons() {
    try {
      personsList = await dbDexieManager.getAllRecords(dbnm, "c");
      personsList.sort(function (a, b) {
        return new Date(b.b) - new Date(a.b);
      });
    } catch (e) {
      console.warn("Could not load persons list:", e);
      personsList = [];
    }
    return personsList;
  }

  function personName(rec) {
    if (!rec) return "";
    return rec.h || rec.i || "";
  }

  function findPerson(id) {
    return (
      personsList.find(function (p) {
        return Number(p.a) === Number(id);
      }) || null
    );
  }

  // ---------- Theme: navy structure, gold accent, neutral surfaces ----------
  function ensureKsetStyles() {
    if (document.getElementById("ksetStyles")) return;
    var st = document.createElement("style");
    st.id = "ksetStyles";
    st.innerHTML =
      /* ---- Modal shell ---- */
      "#printSettingsModal .modal-content{border-radius:14px !important;" +
      "border:1px solid rgba(27,42,74,.35) !important;" +
      "box-shadow:0 18px 50px rgba(13,27,54,.30) !important;overflow:hidden;}" +
      "#printSettingsModal_modal_content_body{" +
      "background:linear-gradient(165deg,#F7F4EC 0%,#EFF2F7 55%,#F6F2EA 100%) !important;" +
      "padding:18px 22px 20px !important;}" +
      /* ---- Cards ---- */
      ".kset-card{background:#FFFFFF;border:1px solid rgba(27,42,74,.14) !important;" +
      "border-radius:12px !important;border-color:rgba(27,42,74,.14) !important;" +
      "box-shadow:0 1px 3px rgba(13,27,54,.05),0 6px 18px rgba(13,27,54,.06) !important;" +
      "transition:box-shadow var(--transition-base);}" +
      ".kset-card:hover{box-shadow:0 3px 8px rgba(13,27,54,.07),0 12px 26px rgba(13,27,54,.09) !important;}" +
      ".kset-card>.card-header.kset-card-hdr{padding:11px 16px;font-size:13px;" +
      "border-radius:11px 11px 0 0;" +
      "background:linear-gradient(135deg,#FCF9F0,#F5EDD8);" +
      "border-bottom:1px solid rgba(201,168,76,.45);letter-spacing:.3px;}" +
      ".kset-card-hdr>span:first-child{display:inline-flex;align-items:center;color:var(--navy);font-weight:700;}" +
      ".kset-card-hdr>i,.kset-card-hdr>span:first-child>i{" +
      "width:26px;height:26px;margin-right:9px;display:inline-flex;align-items:center;justify-content:center;" +
      "background:linear-gradient(135deg,var(--navy-light),var(--navy));color:var(--gold) !important;" +
      "border-radius:8px;font-size:11px;box-shadow:0 2px 5px rgba(13,27,54,.25);}" +
      /* ---- Labels & inputs ---- */
      ".kset-label{color:#68708A;font-weight:700;font-size:10.5px;" +
      "text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px;}" +
      "#prtStngForm .form-control{background:#FCFBF7;border:1px solid #DCD6C6;" +
      "border-radius:10px;color:#24304A;font-size:13.5px;padding:8px 12px;" +
      "transition:border-color var(--transition-fast),box-shadow var(--transition-fast);}" +
      "#prtStngForm .form-control:focus{background:#FFFFFF;border-color:var(--navy);" +
      "box-shadow:0 0 0 3px rgba(201,168,76,.28);outline:none;}" +
      "#prtStngForm .form-control::placeholder{color:#B8B19D;font-weight:400;}" +
      "#prtStngForm .form-control:hover:not(:focus){border-color:var(--gold-dark);}" +
      "#prtStngForm textarea.form-control{resize:vertical;min-height:58px;}" +
      /* ---- Advocate picker input ---- */
      ".kset-adv-input{cursor:pointer;background:#FCFBF7;}" +
      ".kset-adv-input:hover,.kset-adv-input:focus{border-color:var(--gold-dark) !important;}" +
      ".kset-adv-input:focus{box-shadow:0 0 0 3px rgba(201,168,76,.28);}" +
      ".kset-adv-input::placeholder{color:#B8B19D;}" +
      /* ---- Dropdown ---- */
      "#advDropdown{background:#FFFFFF;border:1px solid rgba(27,42,74,.15);" +
      "border-radius:12px;box-shadow:0 16px 40px rgba(13,27,54,.22);margin-top:3px;" +
      "overscroll-behavior:contain;}" +
      ".kset-dd-anchor{z-index:5;}" +
      ".adv-search-wrap{position:sticky;top:0;z-index:2;background:#FFFFFF;" +
      "padding:9px 10px;border-bottom:1px solid #EFEADB;}" +
      ".adv-search-wrap .form-control{border-radius:999px;font-size:12.5px;" +
      "background:#F7F5EE;border-color:#DDD7C6;}" +
      ".adv-opt{display:flex;align-items:center;gap:10px;padding:9px 15px;cursor:pointer;" +
      "font-size:13px;color:#454E63;background:#fff;" +
      "transition:background var(--transition-fast);border-bottom:1px solid #F5F3EC;}" +
      ".adv-opt:last-child{border-bottom:none;}" +
      ".adv-opt:hover{background:#F4F6FA;}" +
      ".adv-opt-sel,.adv-opt-sel:hover{background:linear-gradient(90deg,#FDF8EA,#FBF3DC);" +
      "box-shadow:inset 3px 0 0 var(--gold-dark);}" +
      ".adv-opt-sel .adv-name{color:var(--navy);font-weight:600;}" +
      ".adv-opt .kset-check{width:15px;height:15px;font-size:9px;color:#fff;visibility:hidden;" +
      "flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;" +
      "border-radius:50%;background:var(--gold-dark);margin-right:2px;}" +
      ".adv-opt-sel .kset-check{visibility:visible;}" +
      /* ---- Plus button / badges ---- */
      ".kset-plus{width:46px;flex-shrink:0;border:none;border-radius:10px;cursor:pointer;" +
      "background:linear-gradient(135deg,var(--navy-light),var(--navy));" +
      "box-shadow:0 3px 8px rgba(13,27,54,.28);font-size:18px;color:#fff;" +
      "transition:transform var(--transition-fast),filter var(--transition-fast),box-shadow var(--transition-fast);}" +
      ".kset-plus i{color:var(--gold);}" +
      ".kset-plus:hover{filter:brightness(1.15);transform:translateY(-1px);" +
      "box-shadow:0 5px 12px rgba(13,27,54,.32);}" +
      ".kset-plus:active{transform:translateY(0);}" +
      ".kset-badge-count{background:linear-gradient(135deg,var(--gold),var(--gold-dark));" +
      "color:var(--navy-dark);font-size:10.5px;font-weight:700;padding:3px 11px;" +
      "border-radius:999px;letter-spacing:.4px;text-transform:uppercase;" +
      "box-shadow:0 2px 5px rgba(184,148,46,.35);}" +
      /* ---- Logo box ---- */
      ".kset-logo-box{text-align:center;padding:14px;border-radius:10px;" +
      "background:linear-gradient(135deg,#FBF9F3,#F4F0E3);" +
      "border:1.5px dashed rgba(184,148,46,.55);cursor:pointer;" +
      "transition:border-color var(--transition-fast),background var(--transition-fast);}" +
      ".kset-logo-box:hover{border-color:var(--gold-dark);background:#FBF7EA;}" +
      /* ---- Footer / actions ---- */
      ".kset-foot{display:flex;justify-content:flex-end;gap:10px;" +
      "padding-top:15px;margin-top:14px;border-top:1px solid rgba(27,42,74,.12);}" +
      "#prtStngForm .btn{border-radius:10px;}" +
      ".kset-save{border:none;border-radius:10px;padding:9px 24px;" +
      "background:linear-gradient(135deg,var(--navy-light),var(--navy));" +
      "color:#fff;font-weight:700;font-size:13px;letter-spacing:.3px;" +
      "box-shadow:0 3px 8px rgba(13,27,54,.28);" +
      "transition:filter var(--transition-fast),transform var(--transition-fast),box-shadow var(--transition-fast);}" +
      ".kset-save i{color:var(--gold);margin-right:6px;}" +
      ".kset-save:hover{color:#fff;filter:brightness(1.15);transform:translateY(-1px);" +
      "box-shadow:0 5px 14px rgba(13,27,54,.34);}" +
      ".kset-save:active{transform:translateY(0);}" +
      /* ---- Misc ---- */
      ".kset-hint{color:#96907C;font-size:11px;line-height:1.5;}";
    document.head.appendChild(st);
  }

  // ---------- Advocates on Board input ----------
  function renderAdvControl() {
    var input = document.getElementById("advBoardInput");
    if (!input || !currentSettings) return;
    var ids = currentSettings.advOnBoard || [];
    var names = [];
    ids.forEach(function (id) {
      var nm = personName(findPerson(id));
      if (nm) names.push(nm);
    });
    input.value = names.join(", ");
  }

  function updateCountBadge() {
    var badge = document.getElementById("advCountBadge");
    if (badge && currentSettings)
      badge.textContent =
        (currentSettings.advOnBoard || []).length + " selected";
  }

  function isBoardFull() {
    return (
      !!currentSettings &&
      (currentSettings.advOnBoard || []).length >= ADV_BOARD_MAX
    );
  }

  function updatePlusButton() {
    var btn = document.getElementById("prtStngAddAdvBtn");
    if (btn) btn.style.display = isBoardFull() ? "none" : "";
  }

  // Message modal must stack ABOVE printSettingsModal (inline z-index 1060)
  function showMsgAbove(title, message, isError, onClose) {
    if (typeof window.showMessageModal !== "function") return;
    var el = window.showMessageModal(title, message, isError, onClose);
    if (!el || !el.style) return;
    el.style.zIndex = "1080";
    var sib = el.nextElementSibling;
    while (sib) {
      if (
        sib.classList &&
        sib.classList.contains("modal-backdrop") &&
        Number(getComputedStyle(sib).zIndex || 0) < 1080
      ) {
        sib.style.zIndex = "1070";
        break;
      }
      sib = sib.nextElementSibling;
    }
  }

  function boardFullMessage() {
    showMsgAbove(
      "Info",
      "Maximum " + ADV_BOARD_MAX + " advocates allowed on board.",
      false,
    );
  }

  window.toggleAdvDropdownFromUI = async function (e) {
    if (e) e.stopPropagation();
    var dd = document.getElementById("advDropdown");
    if (!dd) return;
    if (dd.style.display === "block") {
      dd.style.display = "none";
      return;
    }
    await fetchPersons();
    renderAdvOptions("", false);
    dd.style.display = "block";
    setTimeout(function () {
      var si = document.getElementById("advDropSearch");
      if (si) si.focus();
    }, 50);
  };

  function renderAdvOptions(searchTerm, refocusInput) {
    var dd = document.getElementById("advDropdown");
    if (!dd) return;
    var st = (searchTerm || "").trim().toLowerCase();
    var selected = {};
    (currentSettings.advOnBoard || []).forEach(function (id) {
      selected[Number(id)] = true;
    });

    var list = personsList.filter(function (p) {
      if (!st) return true;
      return (
        (p.h && p.h.toLowerCase().indexOf(st) >= 0) ||
        (p.i && p.i.toLowerCase().indexOf(st) >= 0) ||
        (p.a && String(p.a).indexOf(st) >= 0)
      );
    });

    var html =
      '<div class="adv-search-wrap">' +
      '<input type="text" id="advDropSearch" class="form-control form-control-sm" ' +
      'placeholder="Search person..." value="' +
      escHtml(searchTerm || "") +
      '" oninput="advFilterOptions(this.value)" onclick="event.stopPropagation()"></div>';

    if (!list.length) {
      html +=
        '<div class="text-center py-3" style="color:var(--gray);font-size:13px;">No matching person.<br>' +
        '<span class="kset-hint">Use the <b style="color:var(--navy);">+</b> button to add a new one.</span></div>';
    } else {
      html += list
        .map(function (p) {
          var isSel = !!selected[Number(p.a)];
          return (
            '<div class="adv-opt' +
            (isSel ? " adv-opt-sel" : "") +
            '" onclick="toggleAdvSelection(' +
            Number(p.a) +
            ', event)">' +
            '<i class="fas fa-check kset-check"></i>' +
            '<span class="adv-name flex-grow-1 text-truncate">' +
            escHtml(personName(p)) +
            "</span></div>"
          );
        })
        .join("");
    }
    dd.innerHTML = html;
    var si2 = document.getElementById("advDropSearch");
    if (si2 && refocusInput) {
      si2.focus();
      si2.setSelectionRange(si2.value.length, si2.value.length);
    }
  }

  window.advFilterOptions = function (val) {
    renderAdvOptions(val, true);
  };

  window.toggleAdvSelection = function (id, e) {
    if (e) e.stopPropagation();
    if (!currentSettings) return;
    var idx = (currentSettings.advOnBoard || []).findIndex(function (v) {
      return Number(v) === Number(id);
    });
    if (idx >= 0) {
      currentSettings.advOnBoard.splice(idx, 1);
    } else {
      if (isBoardFull()) {
        boardFullMessage();
        return;
      }
      currentSettings.advOnBoard.push(Number(id));
    }
    renderAdvControl();
    updateCountBadge();
    updatePlusButton();
    var sv = document.getElementById("advDropSearch");
    renderAdvOptions(sv ? sv.value : "", true);
  };

  window.removeAdvFromBoard = function (id, e) {
    if (e) e.stopPropagation();
    if (!currentSettings) return;
    currentSettings.advOnBoard = (currentSettings.advOnBoard || []).filter(
      function (v) {
        return Number(v) !== Number(id);
      },
    );
    renderAdvControl();
    updateCountBadge();
    updatePlusButton();
    var sv = document.getElementById("advDropSearch");
    renderAdvOptions(sv ? sv.value : "", true);
  };

  // ---------- Member picker (+ button) ----------
  window.openAdvBoardSelector = async function () {
    if (isBoardFull()) {
      boardFullMessage();
      return;
    }
    window._currentMemberType = "advBoard";
    if (typeof loadExe2Fn === "function") {
      await loadExe2Fn(27, [], []);
    }
    if (typeof open_entind_crud === "function") {
      open_entind_crud(
        null,
        null,
        "entindadvBoard",
        "selectAdvBoardPerson",
        null,
      );
    } else {
      showMsgAbove("Info", "Member selector not available.", false);
    }
  };

  window.selectAdvBoardPerson = async function (record) {
    if (!record || !currentSettings) return;
    await fetchPersons();
    var id = Number(record.a);
    var already = currentSettings.advOnBoard.some(function (v) {
      return Number(v) === id;
    });
    if (!already) {
      if (isBoardFull()) {
        boardFullMessage();
        return;
      }
      currentSettings.advOnBoard.push(id);
    }
    renderAdvControl();
    updateCountBadge();
    updatePlusButton();
    if (typeof showsuccessmodal === "function") {
      showsuccessmodal((personName(record) || "Person") + " added to board");
    } else {
      console.log("Added to board:", personName(record));
    }
  };

  // ---------- Cards ----------
  function buildBusinessCard(s) {
    return (
      '<div class="card kset-card mb-3">' +
      '<div class="card-header kset-card-hdr fw-bold">' +
      '<span><i class="fas fa-store"></i>Business Details</span></div>' +
      '<div class="card-body">' +
      '<div class="mb-3">' +
      '<label for="prtStng_printCompNm" class="form-label kset-label mb-1">Company Name</label>' +
      '<input type="text" class="form-control" id="prtStng_printCompNm" maxlength="60"></div>' +
      '<div class="mb-0">' +
      '<label for="prtStng_printAdrs" class="form-label kset-label mb-1">Address</label>' +
      '<textarea class="form-control" id="prtStng_printAdrs" rows="2" maxlength="150" placeholder="Enter full address...">' +
      escHtml(s.printAdrs) +
      "</textarea></div></div></div>"
    );
  }

  function buildLogoCard(s) {
    return (
      '<div class="card kset-card mb-3">' +
      '<div class="card-header kset-card-hdr fw-bold">' +
      '<span><i class="fas fa-image"></i>Logo</span></div>' +
      '<div class="card-body">' +
      '<div class="kset-logo-box mb-3">' +
      '<img id="prtStngLogoPreview" alt="Logo Preview" src="' +
      resolveLogoUrl(s.print_logo) +
      '" style="max-width:200px;max-height:90px;object-fit:contain;cursor:pointer;display:inline-block;" ' +
      'onclick="(async () => { await loadExe2Fn(24, [afterimagesetcallrun, imgObjDimensRqd], [1]); })();" ' +
      "onload=\"this.style.display='inline-block';var el=document.getElementById('prtStngLogoError');if(el)el.style.display='none';\" " +
      "onerror=\"this.style.display='none';var el=document.getElementById('prtStngLogoError');if(el)el.style.display='block';\">" +
      '<div id="prtStngLogoError" class="text-muted small" style="display:none;cursor:pointer;" ' +
      'onclick="(async () => { await loadExe2Fn(24, [afterimagesetcallrun, imgObjDimensRqd], [1]); })();">' +
      '<i class="fas fa-image fa-2x mb-1 d-block" style="opacity:0.4;"></i>' +
      "Click to choose a logo image</div></div>" +
      '<div class="mb-0">' +
      '<label for="prtStng_print_logo" class="form-label kset-label mb-1">Logo URL</label>' +
      '<input type="text" class="form-control" id="prtStng_print_logo" maxlength="500" placeholder="https://... or Drive image ID" value="' +
      escHtml(s.print_logo || "") +
      '">' +
      '<div class="kset-hint mt-1">Paste an image URL / Drive ID, or click the preview above to upload &bull; clear the field for default logo</div>' +
      "</div></div></div>"
    );
  }

  function buildAdvCard() {
    return (
      '<div class="card kset-card mb-0">' +
      '<div class="card-header kset-card-hdr fw-bold d-flex justify-content-between align-items-center">' +
      '<span><i class="fas fa-users"></i>Advocates on Board</span>' +
      '<span class="kset-badge-count" id="advCountBadge">0 selected</span></div>' +
      '<div class="card-body">' +
      '<label class="form-label kset-label mb-1">Select Advocates <span class="kset-hint">(max ' +
      ADV_BOARD_MAX +
      ")</span></label>" +
      '<div class="d-flex gap-2 align-items-stretch">' +
      '<div class="position-relative flex-grow-1 kset-dd-anchor">' +
      '<input type="text" id="advBoardInput" class="form-control kset-adv-input" readonly placeholder="Click to select advocates..." onclick="toggleAdvDropdownFromUI(event)" title="Click to open list">' +
      '<div id="advDropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:1060;' +
      'max-height:260px;overflow-y:auto;"></div>' +
      "</div>" +
      '<button type="button" id="prtStngAddAdvBtn" class="kset-plus" onclick="openAdvBoardSelector()" title="Add new person (max ' +
      ADV_BOARD_MAX +
      ')">' +
      '<i class="fas fa-plus"></i></button></div>' +
      '<div class="kset-hint mt-2"><i class="fas fa-info-circle me-1"></i>Click the input to open the person list &bull; click a person to add/remove &bull; "+" adds a new person &bull; max ' +
      ADV_BOARD_MAX +
      "</div>" +
      "</div></div>"
    );
  }

  function buildFormHTML(s) {
    return (
      "<div>" +
      '<form id="prtStngForm">' +
      buildBusinessCard(s) +
      buildLogoCard(s) +
      buildAdvCard() +
      '<div class="kset-foot">' +
      '<button type="button" class="btn btn-outline-secondary btn-sm" id="prtStngResetBtn"><i class="fas fa-undo me-1"></i>Reset</button>' +
      '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times me-1"></i>Cancel</button>' +
      '<button type="submit" class="kset-save" id="prtStngSaveBtn"><i class="fas fa-save me-1"></i>Save Settings</button>' +
      "</div></form></div>"
    );
  }

  // ---------- Save ----------
  async function saveSettings(data) {
    payload0.vw = 1;
    payload0.fn = SETTINGS_SAVE_FN;
    payload0.drml = SETTINGS_DRML;
    payload0.appNm = "ks";
    payload0.prt_stng = data;

    var saveBtn = document.getElementById("prtStngSaveBtn");
    var originalText = saveBtn ? saveBtn.innerHTML : "";
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin me-1"></i>Saving...';
    }
    try {
      var resp = await fnj3(
        SETTINGS_SAVE_URL,
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
        if (typeof showsuccessmodal === "function")
          showsuccessmodal(resp.ms || "Settings saved successfully!");
        else
          showMsgAbove(
            "Success",
            resp.ms || "Settings saved successfully!",
            false,
          );
        return true;
      }
      if (typeof showelsemodal === "function")
        showelsemodal(
          (resp && resp.ms) || "Failed to save settings. Please try again.",
        );
      else
        showMsgAbove(
          "Error",
          (resp && resp.ms) || "Failed to save settings",
          true,
        );
      return false;
    } catch (error) {
      if (typeof showcatchmodal === "function")
        showcatchmodal(error || "Network Error: 500/404");
      else showMsgAbove("Info", "Error: " + (error.message || error), false);
      return false;
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
      }
    }
  }

  function collectFormValues() {
    var nm = (document.getElementById("prtStng_printCompNm") || {}).value || "";
    var ad = (document.getElementById("prtStng_printAdrs") || {}).value || "";
    var lg = (document.getElementById("prtStng_print_logo") || {}).value || "";
    return {
      entNm: nm.trim(),
      entAdrs: ad.trim(),
      entLogoUrl: lg.trim(),
      advOnBoard: (currentSettings && currentSettings.advOnBoard) || [],
    };
  }

  // ---------- Handlers ----------
  function handleOutsideClick(e) {
    var dd = document.getElementById("advDropdown");
    var lbl = e.target.closest ? e.target.closest(".kset-click-label") : null;
    var ctrl = document.getElementById("advBoardInput");
    if (dd && dd.style.display === "block") {
      if (
        !dd.contains(e.target) &&
        !(ctrl && ctrl.contains(e.target)) &&
        !lbl
      ) {
        dd.style.display = "none";
      }
    }
  }

  function attachHandlers(contentElement, modalInstance, modalElement) {
    var advInput = document.getElementById("advBoardInput");
    if (advInput) {
      advInput.addEventListener("click", function (e) {
        toggleAdvDropdownFromUI(e);
      });
    }

    document.addEventListener("mousedown", handleOutsideClick);

    var logoInput = document.getElementById("prtStng_print_logo");
    if (logoInput) {
      logoInput.addEventListener("input", function () {
        var preview = document.getElementById("prtStngLogoPreview");
        var error = document.getElementById("prtStngLogoError");
        if (preview) {
          preview.src = resolveLogoUrl(this.value);
          preview.style.display = "";
        }
        if (error) error.style.display = "none";
      });
    }

    var form = document.getElementById("prtStngForm");
    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        var vals = collectFormValues();
        var ok = await saveSettings(vals);
        if (ok) modalInstance.hide();
      });
    }

    var resetBtn = document.getElementById("prtStngResetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", async function () {
        currentSettings = await loadSettings();
        var nmEl = document.getElementById("prtStng_printCompNm");
        var adEl = document.getElementById("prtStng_printAdrs");
        var lgEl = document.getElementById("prtStng_print_logo");
        var pv = document.getElementById("prtStngLogoPreview");
        var err = document.getElementById("prtStngLogoError");
        if (nmEl) nmEl.value = currentSettings.printCompNm;
        if (adEl) adEl.value = currentSettings.printAdrs;
        if (lgEl) lgEl.value = currentSettings.print_logo || "";
        if (pv) pv.src = resolveLogoUrl(currentSettings.print_logo || "");
        if (err) err.style.display = "none";
        renderAdvControl();
        updateCountBadge();
        updatePlusButton();
      });
    }

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", function () {
        document.removeEventListener("mousedown", handleOutsideClick);
      });
    }
  }

  // ---------- Main ----------
  async function showPrintSettings() {
    console.log("Opening settings editor...");

    ensureKsetStyles();

    if (typeof create_modal_dynamically !== "function") {
      if (typeof showToast === "function")
        showToast("Modal system not available");
      return;
    }

    currentSettings = await loadSettings();

    var modalId = "printSettingsModal";
    var modalResult = create_modal_dynamically(modalId);
    if (!modalResult) return;

    var contentElement = modalResult.contentElement,
      modalInstance = modalResult.modalInstance,
      modalElement = modalResult.modalElement;

    contentElement.innerHTML = buildFormHTML(currentSettings);

    setTimeout(function () {
      var md = modalElement.querySelector(".modal-dialog");
      if (md) {
        md.style.marginTop = "60px";
        md.style.maxWidth = "620px";
      }
      var mc = modalElement.querySelector(".modal-content");
      if (mc) {
        mc.style.borderRadius = "12px";
        mc.style.boxShadow = "0 12px 40px rgba(13,27,54,0.25)";
        mc.style.border = "1px solid var(--navy)";
      }
      var mh = modalElement.querySelector(".modal-header");
      if (mh)
        mh.style.background =
          "linear-gradient(135deg,var(--navy),var(--navy-dark))";
      var mt = modalElement.querySelector(".modal-title");
      if (mt) {
        mt.style.color = "#fff";
        mt.style.fontSize = "16px";
        mt.style.fontWeight = "700";
      }
      var mx = modalElement.querySelector(".btn-close");
      if (mx) mx.classList.add("btn-close-white");
      var mb = modalElement.querySelector(".modal-body");
      if (mb) {
        mb.style.maxHeight = "80vh";
        mb.style.overflowY = "auto";
        mb.style.padding = "";
        mb.style.background = "";
      }
    }, 50);

    renderAdvControl();
    updateCountBadge();
    updatePlusButton();

    modalInstance.show();
    attachHandlers(contentElement, modalInstance, modalElement);
  }

  window.showPrintSettings = showPrintSettings;

  console.log("ks_da.js loaded successfully");
})();
