// ks.js - Court Case Register
const tblsRequired = ["f", "fp", "cs", "c", "a", "cs91"];
const inTbls = ["dontCret:cs91", "pubilc:", "2/t-72~cs", "2/m-91~a", "2/m-92~cs,a,c91,c", "2/n-96~cs,a,c91,c", "2/n-98~cs,a,c91,c", "2/o-99~a", "2/o-101~cs,a", "2/r-107~cs,a,c91,c", "2/r-108~cs,a,c91,c"];
const cust_const = [
 {
  "a": "maxNoOfAdvOnBoard", "b": 9, "c": "more customiztaion", "d": "number of advocates that can be assigned case", "u": "url-explaining-video"
 }];
const moduLst = [
    { a: ",108,107,98,92,101,", b: "Add New Case", c: "fa-plus-circle", d: "addNew", e: "#20c997" },
    { a: ",92,   ,72,91,99,96,", b: "All Cases", c: "fa-list-ul", d: "allCases", e: "#0d6efd" }, // 96 k.js refresh, 99 nextDate.js updateNhEntry/updateNextDateRecord, 91 nextDate.js save next Hearing
    { a: ",92,", b: "Check New Data", c: "fa-sync-alt", d: "checkNewData", e: "#fd7e14" },
    { a: ",92,", b: "Clear All Data", c: "fa-trash", d: "clearAllData", e: "#dc3545" },
    { a: ",92,", b: "Settings", c: "fa-cog", d: "settings", e: "#6c757d" }
];
moduLst.hook = "onModuLstAllowed";
window[my1uzr.worknOnPg].moduLst = moduLst;
window[my1uzr.worknOnPg].onModuLstAllowed = function (allowedModules) {
 window[my1uzr.worknOnPg].allowedModulesMenuItems = allowedModules || [];
};

const sho_da_tkLimit = 1;
let appData = {};
const ids_of_views = [3];
let tblFailureCount = 1;
const cacheStrategy = 1;
const dontShoLoginConfirmation = 1;
const dontRestartAfterLogin = 1;

(async function () {

 window[my1uzr.worknOnPg].appInfo = {
  business: "Court Case Register",
  owner: "",
  city: "",
  tagline: "Case Management System",
  mail: "",
  mob: "",
  experience: "",
  focus: "Case management",
  verified: "",
  privacy: "",
  comparison: "",
  family_meeting: "",
  styles: "",
  premium: "",
  emailEndPoint: "",
 };

 window[my1uzr.worknOnPg].flsht = 3;
 window[my1uzr.worknOnPg].flshu = "";
 window[my1uzr.worknOnPg].lodErrMs = "press back & open the app again;";
 window[my1uzr.worknOnPg].emptBodyMs = "Welcome to Court Case Register;";
 window[my1uzr.worknOnPg].colsToHide = "n,";
 window[my1uzr.worknOnPg].colsToHidePartyDetails = "ad";
 window[my1uzr.worknOnPg].colsToHideCases =
  "nd, bn, bf, cy, ct, cn, dd, jn, fpn, rpn, fr, rp, np, more,";
 window[my1uzr.worknOnPg].dtFormat = "dd-mm-yyyy";

 if (!window[my1uzr.worknOnPg].csh) {
  window[my1uzr.worknOnPg].csh = [
   {
    a: 1,
    u: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
   },
   {
    a: 2,
    u: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
   },
   {
    a: 3,
    u: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",
   },
   {
    a: 4,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fbf62ad/cmn/my1lp.js",
    c: "open_shoLgnP",
    r: "open_shoLgnP",
   },
   { a: 5, u: "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
   {
    a: 8,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/my1xi.min.js",
   },
    {
    a: 25,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@30cfa42/ks/addNewCase.js",
    //u: "addNewCase.js",
    c: "showAddCaseModal,toggleCNRFields,toggleMoreDetails,saveCase,openEditCaseModal,updateCaseRecord,switchEditTab,openMemberSelector,selectFilerParty,selectAnswererParty",
    r: " ",
   },
   {
    a: 26,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@30cfa42/ks/allCases.js",
    //u: "allCases.js",
    c: "showAllCases,showHome",
    r: " ",
   },
   {
    a: 22,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@aa6cfeb/ks/messageModal.js",
    c: "showMessageModal,showModal",
    r: " ",
   },
   {
    a: 21,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@aa6cfeb/ks/ks_h.js",
    c: "handl_ks_rspons",
    r: " ",
   },
   {
    a: 23,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@aa6cfeb/ks/nextDate.js",
    c: "openNextHearingModal,saveNextHearing,updateNextDateRecord",
    r: " ",
   },
   {
    a: 24,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@30cfa42/ks/printRecords.js",
    c: "printDashboard",
    r: " ",
   },
   {
    a: 27,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/cmn/ei.js",
    c: "open_entind_crud",
    r: "open_entind_crud",
   },
   {
    a: 30,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1236a32/cmn/clrChe.js",
    c: "showClearCacheModal",
    r: "showClearCacheModal",
   },
   {
    a: 31,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@100357e/ks/ks_da.js",
    c: "showPrintSettings",
    r: "showPrintSettings",
   },
   {
    a: 32,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@a813e1f/cmn/my1ctr.js",
    c: "open_my1ctr",
    r: "open_my1ctr",
   },
   { "a": 33, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1d6dac3/cmn/my1ap.min.js" }
  ];
 }

 try {
  console.log("­ƒÜÇ Starting Court Case Register App...");

  let result1 = await loadCshScriptsSequentially(1, 2, 3, 4, 5, 8, 30, 33);
  if (!result1.success)
   throw new Error("Failed to load required scripts: " + result1.error);

  console.log("­ƒôª Creating database tables for:", dbnm);
  try {
   const createResult = await dbDexieManager.handleNwTables("loader", dbnm, tblsRequired);
   tblFailureCount = createResult.failureCount;
   console.log(
    "Ô£à Database initialized:",
    dbnm,
    "| Failure count:",
    createResult.failureCount,
   );
  } catch (dbError) {
   console.error("ÔØî Database error:", dbError);
  }
  try {
  var resp = await fetch("ks.da");
  if (!resp.ok) throw new Error("HTTP " + resp.status);
  var cfg = await resp.json();
  if (!cfg || typeof cfg !== "object") throw new Error("bad config");
  
  window[my1uzr.worknOnPg].clientConfig = cfg;
 } catch (err) {
  console.error("Failed to load ks.da:", err);
  window[my1uzr.worknOnPg].clientConfig = {};
 }

  await recomputeAllowedModules();

  console.log("­ƒôª Loading modules...");
  await loadExe2Fn(22);
  console.log("Ô£à messageModal loaded");
  await loadExe2Fn(21);
  console.log("Ô£à ks_h loaded");
  await loadExe2Fn(23);
  console.log("Ô£à nextDate loaded");
  await loadExe2Fn(24);
  console.log("Ô£à printRecords loaded");
  // Define sidebar handlers in ks.js (no external sidebar.js dependency)
  window.toggleSidebar = toggleSidebar;
  window.handleMenuAction = function (action) {
    var skipSidebar = window._skipSidebarOnMenu;
    window._skipSidebarOnMenu = false;

    if (skipSidebar) {
      if (action === "settings") {
        setTimeout(function () {
          loadExe2Fn(31);
        }, 0);
        return;
      }
      if (action === "addNew")
        setTimeout(function () { showAddCaseModal(); }, 0);
      else if (action === "allCases")
        setTimeout(function () { showAllCases(); }, 0);
      else if (action === "checkNewData")
        setTimeout(function () { refreshFromServer(); }, 0);
      else if (action === "clearAllData")
        setTimeout(function () { showClearCacheModal(); }, 0);
      return;
    }

    // Normal clicks: toggle sidebar as before
    if (typeof toggleSidebar === "function") toggleSidebar();
    if (action === "settings") {
      setTimeout(function () {
        loadExe2Fn(31);
      }, 300);
      return;
    }
    if (action === "addNew")
      setTimeout(function () { showAddCaseModal(); }, 300);
    else if (action === "allCases")
      setTimeout(function () { showAllCases(); }, 300);
    else if (action === "checkNewData")
      setTimeout(function () { refreshFromServer(); }, 300);
    else if (action === "clearAllData")
      setTimeout(function () { showClearCacheModal(); }, 300);
  };
  console.log("Ô£à sidebar handlers ready");
  await loadExe2Fn(25);
  console.log("Ô£à addNewCase loaded");
  installUpdateRecordWrapper();
  await loadExe2Fn(26);
  console.log("Ô£à allCases loaded");
  await loadExe2Fn(27);
  console.log("Ô£à ei loaded");

  injectKSStyles();

  await loadDataFromDB();

  renderAppUI();
  console.log("Ô£à App UI rendered - Premium Bootstrap Design");
 } catch (e) {
  console.error("ÔØî App initialization error:", e);
  document.getElementById("main_body").innerHTML =
   '<div class="d-flex justify-content-center align-items-center" style="min-height:100vh;">' +
   '<div class="card-premium p-4 text-center" style="max-width:400px;">' +
   '<i class="fas fa-exclamation-triangle text-gold mb-3" style="font-size:48px;"></i>' +
   '<h5 class="text-navy">Error Loading App</h5>' +
   '<p class="text-gray">' +
   (e.message || e) +
   "</p>" +
   '<button onclick="location.reload()" class="btn-premium btn-premium-primary mt-3">Retry</button>' +
   "</div></div>";
 }
})();

appcss =
 "/* ============================================\n   KS - Court Case Management System\n   Design System & Reusable Classes\n   Classic Authority Theme\n   ============================================ */\n\n/* CSS Variables */\n:root {\n  /* Navy Palette (60%) */\n  --navy-dark: #0D1B36;\n  --navy: #1B2A4A;\n  --navy-light: #2A3F6E;\n  \n  /* Gold Palette (10% Accent) */\n  --gold: #C9A84C;\n  --gold-light: #D4B96A;\n  --gold-dark: #B8942E;\n  --gold-bg: #FDF8EE;\n  --gold-rgb: 201, 168, 76;\n  \n  /* Gray Palette (30%) */\n  --gray-dark: #555555;\n  --gray: #7A7A7A;\n  --gray-light: #B0B0B0;\n  --gray-bg: #E8E8E8;\n  --gray-surface: #F5F5F5;\n  \n  /* Section Colors */\n  --section-nd-bg: #D0ECEE;\n  --section-nd-border: #4AADAD;\n  --section-ecourt-bg: #D5E2F2;\n  --section-ecourt-border: #87c1ff;\n  --section-manual-bg: #F8EDD5;\n  --section-manual-border: #C9A84C;\n  --section-csv-bg: #E9F4E3;\n  --section-csv-border: #6FBF4A;\n  \n  /* Spacing */\n  --spacing-xs: 4px;\n  --spacing-sm: 8px;\n  --spacing-md: 12px;\n  --spacing-lg: 16px;\n  --spacing-xl: 20px;\n  --spacing-2xl: 24px;\n  --spacing-3xl: 32px;\n  \n  /* Border Radius */\n  --radius-sm: 6px;\n  --radius-md: 8px;\n  --radius-lg: 12px;\n  --radius-xl: 16px;\n  --radius-full: 9999px;\n  \n  /* Shadows */\n  --shadow-sm: 0 1px 3px rgba(13, 27, 54, 0.06);\n  --shadow-md: 0 4px 12px rgba(13, 27, 54, 0.08);\n  --shadow-lg: 0 8px 24px rgba(13, 27, 54, 0.12);\n  --shadow-xl: 0 12px 32px rgba(13, 27, 54, 0.16);\n  \n  /* Transitions */\n  --transition-fast: 150ms ease;\n  --transition-base: 200ms ease;\n  --transition-slow: 300ms ease;\n  \n  /* Typography */\n  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  --font-size-xs: 10px;\n  --font-size-sm: 12px;\n  --font-size-base: 14px;\n  --font-size-lg: 16px;\n  --font-size-xl: 18px;\n  --font-size-2xl: 22px;\n  --font-weight-normal: 400;\n  --font-weight-medium: 500;\n  --font-weight-semibold: 600;\n  --font-weight-bold: 700;\n}\n\n/* ============================================\n   BASE STYLES\n   ============================================ */\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  padding: 0;\n  background:\n    radial-gradient(circle at 20% 20%, rgba(var(--gold-rgb), 0.06), transparent 30%),\n    radial-gradient(circle at 80% 70%, rgba(13, 27, 54, 0.05), transparent 35%),\n    var(--gray-surface);\n  background-size: 200% 200%;\n  animation: floatBlob 40s ease-in-out infinite alternate,\n             floatBlob 50s ease-in-out infinite alternate-reverse;\n  font-family: var(--font-family);\n  min-height: 100vh;\n  color: var(--navy);\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* ============================================\n   TYPOGRAPHY\n   ============================================ */\n.text-navy { color: var(--navy) !important; }\n.text-navy-dark { color: var(--navy-dark) !important; }\n.text-gold { color: var(--gold) !important; }\n.text-gray { color: var(--gray) !important; }\n.text-gray-dark { color: var(--gray-dark) !important; }\n.text-gray-light { color: var(--gray-light) !important; }\n\n.font-serif { font-family: Georgia, 'Times New Roman', serif; }\n.font-mono { font-family: 'Courier New', monospace; }\n\n.fw-medium { font-weight: var(--font-weight-medium) !important; }\n.fw-semibold { font-weight: var(--font-weight-semibold) !important; }\n\n.text-xs { font-size: var(--font-size-xs); }\n.text-sm { font-size: var(--font-size-sm); }\n.text-base { font-size: var(--font-size-base); }\n.text-lg { font-size: var(--font-size-lg); }\n\n/* ============================================\n   BACKGROUNDS\n   ============================================ */\n.bg-navy { background: var(--navy) !important; }\n.bg-navy-dark { background: var(--navy-dark) !important; }\n.bg-navy-gradient {\n  background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%) !important;\n}\n.bg-gold { background: var(--gold) !important; }\n.bg-gold-light { background: var(--gold-bg) !important; }\n.bg-gray-surface { background: var(--gray-surface) !important; }\n.bg-white { background: #ffffff !important; }\n\n/* ============================================\n   BORDERS\n   ============================================ */\n.border-navy { border-color: var(--navy) !important; }\n.border-gold { border-color: var(--gold) !important; }\n.border-gray { border-color: var(--gray-light) !important; }\n.border-gray-light { border-color: var(--gray-bg) !important; }\n\n.border-2 { border-width: 2px !important; }\n.border-3 { border-width: 3px !important; }\n\n.border-bottom-gold {\n  border-bottom: 3px solid var(--gold) !important;\n}\n\n/* ============================================\n   BORDER RADIUS\n   ============================================ */\n.rounded-md { border-radius: var(--radius-md) !important; }\n.rounded-lg { border-radius: var(--radius-lg) !important; }\n.rounded-xl { border-radius: var(--radius-xl) !important; }\n.rounded-full { border-radius: var(--radius-full) !important; }\n\n/* ============================================\n   SHADOWS\n   ============================================ */\n.shadow-sm { box-shadow: var(--shadow-sm) !important; }\n.shadow-md { box-shadow: var(--shadow-md) !important; }\n.shadow-lg { box-shadow: var(--shadow-lg) !important; }\n.shadow-xl { box-shadow: var(--shadow-xl) !important; }\n\n.shadow-hover {\n  transition: box-shadow var(--transition-base), transform var(--transition-base);\n}\n.shadow-hover:hover {\n  box-shadow: var(--shadow-lg);\n  transform: translateY(-1px);\n}\n\n/* ============================================\n   CARDS (Bootstrap Extension)\n   ============================================ */\n.card-premium {\n  background: #fff;\n  border: 1px solid var(--gray-bg);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow-sm);\n  transition: box-shadow var(--transition-base);\n  overflow: hidden;\n}\n.card-premium:hover {\n  box-shadow: var(--shadow-md);\n}\n\n.card-premium .card-header-premium {\n  background: var(--navy);\n  color: var(--gold);\n  padding: var(--spacing-lg);\n  border-bottom: 3px solid var(--gold);\n  font-weight: var(--font-weight-bold);\n  font-size: var(--font-size-base);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n\n/* ============================================\n   BUTTONS (Bootstrap Extension)\n   ============================================ */\n.btn-premium {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--spacing-xs);\n  padding: 10px 24px;\n  border-radius: var(--radius-md);\n  font-weight: var(--font-weight-semibold);\n  font-size: var(--font-size-base);\n  cursor: pointer;\n  transition: all var(--transition-base);\n  border: 2px solid transparent;\n  position: relative;\n  overflow: hidden;\n}\n\n.btn-premium-primary {\n  background: linear-gradient(135deg, var(--navy-dark), var(--navy));\n  color: var(--gold);\n  border-color: var(--gold);\n}\n.btn-premium-primary:hover {\n  background: var(--gold);\n  color: var(--navy-dark);\n  box-shadow: var(--shadow-md);\n  transform: translateY(-1px);\n}\n.btn-premium-primary:active {\n  transform: translateY(0);\n  box-shadow: var(--shadow-sm);\n}\n\n.btn-premium-secondary {\n  background: var(--gray-surface);\n  color: var(--gray-dark);\n  border-color: var(--gray-light);\n}\n.btn-premium-secondary:hover {\n  background: var(--gray-bg);\n  border-color: var(--gray);\n}\n\n.btn-premium-danger {\n  background: #dc3545;\n  color: #fff;\n  border-color: #dc3545;\n}\n.btn-premium-danger:hover {\n  background: #c82333;\n  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);\n}\n\n.btn-premium-sm {\n  padding: 6px 16px;\n  font-size: var(--font-size-sm);\n}\n\n.btn-premium-lg {\n  padding: 12px 32px;\n  font-size: var(--font-size-lg);\n}\n\n.btn-premium-icon {\n  width: 38px;\n  height: 38px;\n  padding: 0;\n  border-radius: var(--radius-full);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(var(--gold-rgb), 0.2);\n  color: #fff;\n  font-size: 18px;\n  transition: all var(--transition-base);\n}\n.btn-premium-icon:hover {\n  background: rgba(var(--gold-rgb), 0.25);\n  border-color: var(--gold);\n  transform: scale(1.1);\n}\n\n.btn-premium:disabled,\n.btn-premium.loading {\n  opacity: 0.6;\n  cursor: not-allowed;\n  pointer-events: none;\n}\n\n.btn-premium .spinner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid currentColor;\n  border-top-color: transparent;\n  border-radius: 50%;\n  animation: spin 0.6s linear infinite;\n}\n\n/* ============================================\n   FORMS (Bootstrap Extension)\n   ============================================ */\n.form-control-premium {\n  width: 100%;\n  padding: 10px 14px;\n  border: 2px solid var(--gray-light);\n  border-radius: var(--radius-md);\n  font-size: var(--font-size-base);\n  font-family: var(--font-family);\n  color: var(--navy);\n  background: #fff;\n  transition: all var(--transition-base);\n  outline: none;\n}\n.form-control-premium:focus {\n  border-color: var(--gold);\n  box-shadow: 0 0 0 3px rgba(var(--gold-rgb), 0.15);\n}\n.form-control-premium::placeholder {\n  color: var(--gray-light);\n  opacity: 0.7;\n}\n.form-control-premium.is-invalid {\n  border-color: #dc3545;\n}\n.form-control-premium.is-invalid:focus {\n  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);\n}\n\n.form-select-premium {\n  width: 100%;\n  padding: 10px 14px;\n  border: 2px solid var(--gray-light);\n  border-radius: var(--radius-md);\n  font-size: var(--font-size-base);\n  font-family: var(--font-family);\n  color: var(--navy);\n  background: #fff;\n  transition: all var(--transition-base);\n  outline: none;\n  appearance: none;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7A7A' d='M6 8L1 3h10z'/%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: right 12px center;\n  padding-right: 36px;\n}\n.form-select-premium:focus {\n  border-color: var(--gold);\n  box-shadow: 0 0 0 3px rgba(var(--gold-rgb), 0.15);\n}\n\n.form-label-premium {\n  font-weight: var(--font-weight-semibold);\n  font-size: var(--font-size-sm);\n  color: var(--gray-dark);\n  margin-bottom: 4px;\n  display: block;\n}\n\n.form-label-premium .required {\n  color: #dc3545;\n}\n\n.form-hint {\n  font-size: var(--font-size-xs);\n  color: var(--gray);\n  margin-top: 3px;\n  font-style: italic;\n}\n\n.form-group-premium {\n  margin-bottom: var(--spacing-md);\n}\n\n.form-row-premium {\n  display: flex;\n  gap: var(--spacing-md);\n}\n.form-row-premium > * {\n  flex: 1;\n}\n\n.form-hint {\n  font-size: 11px;\n  color: var(--gray);\n  margin-top: 4px;\n}\n\n/* Floating Label */\n.form-floating-premium {\n  position: relative;\n}\n.form-floating-premium .form-control-premium {\n  padding: 14px 14px 6px 14px;\n}\n.form-floating-premium label {\n  position: absolute;\n  top: 50%;\n  left: 14px;\n  transform: translateY(-50%);\n  font-size: var(--font-size-base);\n  color: var(--gray-light);\n  transition: all var(--transition-base);\n  pointer-events: none;\n}\n.form-floating-premium .form-control-premium:focus ~ label,\n.form-floating-premium .form-control-premium:not(:placeholder-shown) ~ label {\n  top: 8px;\n  font-size: 11px;\n  color: var(--navy);\n  font-weight: var(--font-weight-semibold);\n}\n\n/* ============================================\n   TABLES (Bootstrap Extension)\n   ============================================ */\n.table-premium {\n  width: 100%;\n  border-collapse: collapse;\n}\n.table-premium thead {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}\n.table-premium thead th {\n  background: var(--navy);\n  color: var(--gold);\n  font-size: var(--font-size-xs);\n  text-transform: uppercase;\n  letter-spacing: 0.6px;\n  padding: 14px 8px;\n  border: none;\n  white-space: nowrap;\n  text-align: center;\n  font-weight: var(--font-weight-bold);\n  border-bottom: 3px solid var(--gold);\n}\n.table-premium tbody td {\n  padding: 10px 8px;\n  font-size: var(--font-size-sm);\n  vertical-align: middle;\n  border-color: #eee;\n  text-align: center;\n  color: var(--gray-dark);\n  transition: background var(--transition-fast);\n}\n.table-premium tbody tr {\n  transition: background var(--transition-fast);\n}\n.table-premium tbody tr:hover {\n  background: var(--gold-bg);\n}\n.table-premium tbody tr:nth-child(even) {\n  background: #fafafa;\n}\n.table-premium tbody tr:nth-child(even):hover {\n  background: var(--gold-bg);\n}\n.table-premium tbody tr.row-selected {\n  background: var(--gold-bg);\n  border-left: 3px solid var(--gold);\n}\n\n.table-container-premium {\n  background: #fff;\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow-sm);\n  overflow: hidden;\n  border: 1px solid var(--gray-bg);\n  margin: var(--spacing-lg);\n}\n\n.table-scroll-premium {\n  max-height: calc(100vh - 210px);\n  overflow-y: auto;\n  overflow-x: auto;\n}\n\n.table-scroll-premium table {\n  min-width: 1100px;\n}\n\n/* ============================================\n   SIDEBAR\n   ============================================ */\n.sidebar-overlay-premium {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(13, 27, 54, 0.6);\n  z-index: 10000;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity var(--transition-slow), visibility var(--transition-slow);\n  backdrop-filter: blur(2px);\n}\n.sidebar-overlay-premium.visible {\n  opacity: 1;\n  visibility: visible;\n}\n\n.sidebar-premium {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 260px;\n  height: 100%;\n  background: #fff;\n  z-index: 10001;\n  box-shadow: var(--shadow-xl);\n  transform: translateX(-100%);\n  transition: transform var(--transition-slow);\n  display: flex;\n  flex-direction: column;\n}\n.sidebar-premium.open {\n  transform: translateX(0);\n}\n\n.sidebar-premium .sidebar-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: var(--spacing-lg);\n  background: linear-gradient(135deg, var(--navy-dark), var(--navy));\n  border-bottom: 3px solid var(--gold);\n  color: #fff;\n}\n\n.sidebar-premium .sidebar-menu {\n  padding: var(--spacing-sm) 0;\n  flex: 1;\n  overflow-y: auto;\n}\n\n.sidebar-premium .sidebar-item {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  padding: var(--spacing-md) var(--spacing-lg);\n  font-size: var(--font-size-base);\n  color: var(--gray-dark);\n  cursor: pointer;\n  transition: all var(--transition-fast);\n  text-decoration: none;\n  border-bottom: 1px solid var(--gray-bg);\n  position: relative;\n}\n.sidebar-premium .sidebar-item:hover {\n  background: var(--gold-bg);\n  color: var(--navy);\n}\n.sidebar-premium .sidebar-item.active {\n  background: var(--gold-bg);\n  color: var(--navy);\n  border-left: 3px solid var(--gold);\n  font-weight: var(--font-weight-semibold);\n}\n.sidebar-premium .sidebar-item i {\n  font-size: var(--font-size-lg);\n  width: 20px;\n  text-align: center;\n  color: var(--navy);\n  transition: transform var(--transition-fast);\n}\n.sidebar-premium .sidebar-item:hover i {\n  transform: translateX(2px);\n}\n\n/* ============================================\n   MODALS (Bootstrap Extension)\n   ============================================ */\n.modal-premium .modal-content {\n  border: 3px solid var(--navy);\n  border-radius: var(--radius-lg);\n  overflow: hidden;\n  box-shadow: var(--shadow-xl);\n}\n\n.modal-premium .modal-header {\n  background: linear-gradient(135deg, var(--navy-dark), var(--navy));\n  color: var(--gold);\n  padding: var(--spacing-lg);\n  border-bottom: 3px solid var(--gold);\n}\n\n.modal-premium .modal-body {\n  padding: 0;\n  overflow-y: auto;\n}\n\n.modal-premium .modal-footer {\n  padding: var(--spacing-lg);\n  border-top: 2px solid var(--gray-bg);\n  display: flex;\n  justify-content: flex-end;\n  gap: var(--spacing-sm);\n}\n\n.modal-backdrop-premium {\n  backdrop-filter: blur(4px);\n}\n\n/* ============================================\n   HEADER / NAVBAR\n   ============================================ */\n.header-premium {\n  position: sticky;\n  top: 0;\n  z-index: 9999;\n  background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%);\n  height: 64px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 var(--spacing-xl);\n  box-shadow: var(--shadow-lg);\n  border-bottom: 3px solid var(--gold);\n}\n\n.header-premium .header-title {\n  font-size: var(--font-size-2xl);\n  font-weight: var(--font-weight-bold);\n  color: #fff;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n  font-family: Georgia, 'Times New Roman', serif;\n  letter-spacing: 0.5px;\n}\n\n.header-premium .header-title .icon {\n  font-size: 26px;\n  color: var(--gold);\n}\n\n.header-premium .header-actions {\n  display: flex;\n  gap: var(--spacing-sm);\n}\n\n/* ============================================\n   SUMMARY BAR\n   ============================================ */\n.summary-bar-premium {\n  background: #fff;\n  padding: var(--spacing-md) var(--spacing-lg);\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--spacing-sm) var(--spacing-lg);\n  border-bottom: 1px solid var(--gray-bg);\n  box-shadow: var(--shadow-sm);\n}\n\n/* ============================================\n   BADGES\n   ============================================ */\n.badge-premium {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 5px 14px;\n  border-radius: var(--radius-full);\n  font-weight: var(--font-weight-bold);\n  font-size: var(--font-size-sm);\n  white-space: nowrap;\n}\n\n.badge-premium-navy {\n  background: var(--navy);\n  color: var(--gold);\n  border: 1px solid rgba(var(--gold-rgb), 0.4);\n}\n\n.badge-premium-gold {\n  background: var(--gold);\n  color: var(--navy-dark);\n  font-weight: var(--font-weight-bold);\n}\n\n.badge-premium-outline {\n  background: transparent;\n  border: 1px solid currentColor;\n}\n\n/* ============================================\n   SCROLLBAR\n   ============================================ */\n::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n::-webkit-scrollbar-track {\n  background: var(--gray-surface);\n  border-radius: 4px;\n}\n::-webkit-scrollbar-thumb {\n  background: var(--navy);\n  border-radius: 4px;\n}\n::-webkit-scrollbar-thumb:hover {\n  background: var(--navy-dark);\n}\n\n/* ============================================\n   ANIMATIONS\n   ============================================ */\n@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n@keyframes fadeInUp {\n  from { opacity: 0; transform: translateY(8px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n@keyframes fadeInDown {\n  from { opacity: 0; transform: translateY(-8px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n@keyframes slideInLeft {\n  from { transform: translateX(-100%); }\n  to { transform: translateX(0); }\n}\n@keyframes slideInRight {\n  from { transform: translateX(100%); }\n  to { transform: translateX(0); }\n}\n@keyframes scaleIn {\n  from { opacity: 0; transform: scale(0.95); }\n  to { opacity: 1; transform: scale(1); }\n}\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n@keyframes shimmer {\n  0% { background-position: -200px 0; }\n  100% { background-position: 200px 0; }\n}\n@keyframes floatBlob {\n  0%   { background-position: 0% 0%, 100% 100%; }\n  50%  { background-position: 100% 100%, 0% 0%; }\n  100% { background-position: 0% 0%, 100% 100%; }\n}\n\n.animate-fade-in { animation: fadeIn var(--transition-slow) ease; }\n.animate-fade-in-up { animation: fadeInUp var(--transition-slow) ease; }\n.animate-scale-in { animation: scaleIn var(--transition-base) ease; }\n.animate-slide-in-left { animation: slideInLeft var(--transition-slow) ease; }\n\n/* Skeleton Loading */\n.skeleton {\n  background: linear-gradient(90deg, var(--gray-bg) 25%, var(--gray-surface) 50%, var(--gray-bg) 75%);\n  background-size: 200px 100%;\n  animation: shimmer 1.5s infinite;\n  border-radius: var(--radius-sm);\n}\n\n/* Reduced Motion */\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n\n/* ============================================\n   RESPONSIVE\n   ============================================ */\n@media (max-width: 600px) {\n  .header-premium {\n    height: auto;\n    min-height: 52px;\n    padding: 6px 12px;\n  }\n  .header-premium .header-title {\n    font-size: var(--font-size-lg);\n    gap: 6px;\n  }\n  \n  .form-row-premium {\n    flex-direction: column;\n    gap: var(--spacing-sm);\n  }\n  \n  .summary-bar-premium {\n    padding: var(--spacing-sm) var(--spacing-md);\n    flex-direction: column;\n    align-items: stretch;\n    gap: var(--spacing-sm);\n  }\n  \n  .table-container-premium {\n    margin: var(--spacing-sm);\n    border-radius: var(--radius-md);\n  }\n  .cs-radio-label {\n    flex: 1;\n    justify-content: center;\n    font-size: 11px;\n    padding: 6px 10px;\n  }\n}\n\n/* ============================================\n   PRINT STYLES\n   ============================================ */\n@media print {\n  body { background: #fff; }\n  .header-premium {\n    background: var(--navy) !important;\n    -webkit-print-color-adjust: exact;\n    print-color-adjust: exact;\n  }\n  .btn-premium-icon { display: none !important; }\n  .table-container-premium {\n    max-height: none;\n    overflow: visible;\n    box-shadow: none;\n    margin: 0;\n    border-radius: 0;\n    border: none;\n  }\n  @page { margin: 8mm; }\n}\n\n/* ============================================\n   UTILITY CLASSES\n   ============================================ */\n.gap-xs { gap: var(--spacing-xs); }\n.gap-sm { gap: var(--spacing-sm); }\n.gap-md { gap: var(--spacing-md); }\n.gap-lg { gap: var(--spacing-lg); }\n\n.truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.cursor-pointer { cursor: pointer; }\n.select-none { user-select: none; }\n\n.opacity-0 { opacity: 0; }\n.opacity-50 { opacity: 0.5; }\n.opacity-100 { opacity: 1; }\n\n.transition-all { transition: all var(--transition-base); }\n.transition-transform { transition: transform var(--transition-base); }\n\n@keyframes ks-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\n\n.transition-opacity { transition: opacity var(--transition-base); }\n\n/* ============================================\n   RADIO OPTION CARDS\n   ============================================ */\n.cs-radio-label {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 16px;\n  border-radius: var(--radius-md);\n  border: 2px solid var(--gray-bg);\n  cursor: pointer;\n  transition: all var(--transition-base);\n  font-size: var(--font-size-sm);\n  color: var(--gray-dark);\n  user-select: none;\n  background: #fff;\n}\n.cs-radio-label:hover {\n  border-color: var(--gold);\n  background: var(--gold-bg);\n  box-shadow: 0 2px 8px rgba(var(--gold-rgb), 0.15);\n  transform: translateY(-1px);\}\n.cs-radio-label.cs-active-ecourt {\n  border-color: var(--section-ecourt-border);\n  background: var(--section-ecourt-bg);\n  box-shadow: 0 2px 8px rgba(94, 138, 184, 0.2);\n}\n.cs-radio-label.cs-active-manual {\n  border-color: var(--section-manual-border);\n  background: var(--section-manual-bg);\n  box-shadow: 0 2px 8px rgba(201, 168, 76, 0.2);\n}\n.cs-radio-label.cs-active-csv {\n  border-color: var(--section-csv-border);\n  background: var(--section-csv-bg);\n  box-shadow: 0 2px 8px rgba(111, 191, 74, 0.2);\n}\n.cs-radio-label input[type=radio] {\n  accent-color: var(--gold);\n  margin: 0;\n}\n\n/* ============================================\n   SEARCHABLE CASE TYPE\n   ============================================ */\n.cs-type-custom {\n  font-size: var(--font-size-xs);\n  color: #dc3545;\n  margin-top: 4px;\n  font-style: italic;\n  padding: 3px 8px;\n  background: rgba(220, 53, 69, 0.06);\n  border-radius: var(--radius-sm);\n  border-left: 3px solid #dc3545;\n}\n.cs-type-custom::before {\n  content: '\\u201C';\n  font-weight: bold;\n  font-size: 14px;\n}\n.cs-type-custom::after {\n  content: '\\u201D';\n  font-weight: bold;\n  font-size: 14px;\n}\n";

function injectKSStyles() {
 var st = document.createElement("style");
 st.id = "ks-custom-styles";
 st.innerHTML = appcss;
 document.head.appendChild(st);
 var stCs91 = document.createElement("style");
 stCs91.id = "ks-cs91-styles";
 stCs91.innerHTML =
  "tr.cs91-date-row{background:#D5E2F2!important;}" +
  "tr.cs91-date-row:hover{background:#C4D6EC!important;}" +
  ".db-date-badge{display:inline-block;padding:1px 5px;border-radius:3px;font-size:10px;margin:0 1px;white-space:nowrap;}" +
  ".db-date-primary{background:#FDF8EE;border:1px solid #C9A84C;color:#1B2A4A;}" +
  ".db-date-prev{background:#FDE8E8;border:1px solid #E57373;color:#C62828;}" +
  ".db-date-next{background:#E8F5E9;border:1px solid #81C784;color:#2E7D32;}";
 document.head.appendChild(stCs91);
}

var currentView = "home";

var sidebarItems = [
 { act: "addNew", lb: "Add New Case", ic: "fa-plus-circle", mod: "addNew" },
 { act: "allCases", lb: "All Cases", ic: "fa-list-ul", mod: "allCases" },
 { act: "checkNewData", lb: "Check New Data", ic: "fa-sync-alt", mod: "checkNewData" },
 { act: "clearAllData", lb: "Clear All Data", ic: "fa-trash", mod: "clearAllData" },
 { act: "settings", lb: "Settings", ic: "fa-cog", mod: "settings" },
];

function isModuleAllowed(code) {
 var mods =
  (window[my1uzr] &&
   window[my1uzr.worknOnPg] &&
   window[my1uzr.worknOnPg].allowedModulesMenuItems) ||
  [];
 if (!mods.length) return true;
 return mods.some(function (m) {
  return String(m.d || "").toLowerCase() === String(code).toLowerCase();
 });
}

function toggleSidebar() {
  var sidebar = document.getElementById("appSidebar");
  var overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.classList.toggle("open");
  if (overlay) overlay.classList.toggle("visible");
}
window.toggleSidebar = toggleSidebar;

function renderSidebarMenu() {
  var nav = document.querySelector("#appSidebar .sidebar-menu");
  if (!nav) return;
  nav.innerHTML = sidebarItems
   .filter(function (it) {
    return isModuleAllowed(it.mod);
   })
   .map(function (it) {
    return (
     '<a class="sidebar-item" onclick="handleMenuAction(\'' +
     it.act +
     '\')" role="button"><i class="fas ' +
     it.ic +
     '"></i> ' +
     it.lb +
     "</a>"
    );
   })
   .join("");
}

async function recomputeAllowedModules() {
 var hook = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg][moduLst.hook];
 var existing = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].allowedModulesMenuItems;
 var missing =
  typeof existing === "undefined" ||
  existing === null ||
  existing === "" ||
  (Array.isArray(existing) && existing.length === 0);
 if (typeof hook === "function" && missing) {
  try {
   var permitted = await chkModuLstAgainstFNF(moduLst);
   hook(permitted);
  } catch (e) {
   console.warn("failed to resolve allowed modules menu items", e);
  }
 }
}

async function openAdminFromMenu(action) {
  window._skipSidebarOnMenu = true;
  await handleMenuAction(action);
}

function loadMy1ctr() {
 (async () => { await loadExe2Fn(32, ["dv_to_set_open_my1ctr_processed", 0, 1, 2], [1]); })();
}

function getHeaderTitle() {
 if (currentView === "allCases") {
  return '<span class="icon" style="cursor:pointer;" onclick="showHome()">&#x2190;</span> All Cases';
 }
 return (
  '<span class="icon" style="cursor:pointer;" onclick="loadMy1ctr()" title="Open My Court">&#x2696;</span>' +
  (window.shopName || "KS")
 );
}

var defaultVisibleCols = {
 sr: true,
  menu: true,
  pdate: true,
 court: true,
 adv: true,
 brief: true,
 caseType: true,
 caseNo: true,
 stg: true,
 ndate: true,
 filer: true,
 answerer: true,
 edit: true,
 del: true,
};
var KS_COLS_PREF_V = 2;
function loadVisibleCols() {
  var stored = null;
  try {
    stored = JSON.parse(localStorage.getItem("ks_visibleCols") || "null");
  } catch (e) {
    stored = null;
  }
  if (!stored || stored.v !== KS_COLS_PREF_V || !stored.cols) {
   stored = { cols: {} };
  }
  var cols = {};
  for (var k in defaultVisibleCols) {
   cols[k] = stored.cols[k] !== false;
  }
  return cols;
}
function saveVisibleCols() {
  localStorage.setItem(
   "ks_visibleCols",
   JSON.stringify({ v: KS_COLS_PREF_V, cols: visibleCols }),
  );
}
var visibleCols = loadVisibleCols();
function isColVisible(id) {
  return visibleCols[id] !== false;
}
function toggleCol(id) {
  visibleCols[id] = !isColVisible(id);
  saveVisibleCols();
  renderTable();
}

function renderAppUI() {
 var mainBody = document.getElementById("main_body");
 if (!mainBody) return;
 var today = getLocalToday();

 mainBody.innerHTML =
  '<header class="header-premium">' +
  '<div class="header-title" id="headerTitle">' +
  '<button class="btn-premium-icon" id="menuBtn" onclick="toggleSidebar()" aria-label="Open menu">' +
  '<i class="fas fa-bars"></i>' +
  "</button>" +
  getHeaderTitle() +
  "</div>" +
  '<div class="header-actions">' +
  '<button class="btn-premium-icon" title="Print" onclick="printDashboard()" aria-label="Print">' +
  '<i class="fas fa-print"></i>' +
  "</button>" +
  '<div class="col-vis-dropdown" style="position:relative;display:inline-block;">' +
  '<button class="btn-premium-icon" id="colVisToggle" title="Toggle Columns" aria-label="Toggle Columns" onclick="toggleColVisPanel()">' +
  '<i class="fas fa-columns"></i>' +
  "</button>" +
  '<div id="colVisPanel" class="col-vis-panel" style="display:none;position:absolute;right:0;top:100%;background:#fff;border:1px solid #ccc;border-radius:8px;padding:8px;z-index:1000;min-width:160px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">' +
  '<div class="fw-bold mb-2 text-navy" style="font-size:13px;border-bottom:1px solid #eee;padding-bottom:6px;">Show/Hide Columns</div>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("sr") ? "checked" : "") +
  ' onchange="toggleCol(\'sr\')" style="margin-right:6px;">ID</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("pdate") ? "checked" : "") +
  ' onchange="toggleCol(\'pdate\')" style="margin-right:6px;">PDate</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("court") ? "checked" : "") +
  ' onchange="toggleCol(\'court\')" style="margin-right:6px;">Court</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("adv") ? "checked" : "") +
  ' onchange="toggleCol(\'adv\')" style="margin-right:6px;">Adv</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("brief") ? "checked" : "") +
  ' onchange="toggleCol(\'brief\')" style="margin-right:6px;">Brief</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("caseType") ? "checked" : "") +
  ' onchange="toggleCol(\'caseType\')" style="margin-right:6px;">Case Type</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("caseNo") ? "checked" : "") +
  ' onchange="toggleCol(\'caseNo\')" style="margin-right:6px;">Case No.</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("stg") ? "checked" : "") +
  ' onchange="toggleCol(\'stg\')" style="margin-right:6px;">STG</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("ndate") ? "checked" : "") +
  ' onchange="toggleCol(\'ndate\')" style="margin-right:6px;">NDate</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("filer") ? "checked" : "") +
  ' onchange="toggleCol(\'filer\')" style="margin-right:6px;">Filer</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("answerer") ? "checked" : "") +
  ' onchange="toggleCol(\'answerer\')" style="margin-right:6px;">Answerer</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("menu") ? "checked" : "") +
  ' onchange="toggleCol(\'menu\')" style="margin-right:6px;">Actions</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("edit") ? "checked" : "") +
  ' onchange="toggleCol(\'edit\')" style="margin-right:6px;">Edit</label>' +
  '<label style="display:block;padding:4px 6px;cursor:pointer;font-size:13px;"><input type="checkbox" ' +
  (isColVisible("del") ? "checked" : "") +
  ' onchange="toggleCol(\'del\')" style="margin-right:6px;">Del</label>' +
  "</div>" +
  "</div>" +
  "</div>" +
  "</header>" +
  '<div id="sidebarOverlay" class="sidebar-overlay-premium" onclick="toggleSidebar()"></div>' +
  '<aside id="appSidebar" class="sidebar-premium">' +
  '<div class="sidebar-header">' +
  '<span class="fw-bold"><i class="fas fa-bars me-2 text-gold"></i>Menu</span>' +
  '<button class="btn-close btn-close-white" onclick="toggleSidebar()" aria-label="Close menu"></button>' +
  "</div>" +
  '<nav class="sidebar-menu">' +
  sidebarItems
   .filter(function (it) {
    return isModuleAllowed(it.mod);
   })
   .map(function (it) {
    return (
     '<a class="sidebar-item" onclick="handleMenuAction(\'' +
     it.act +
     '\')" role="button"><i class="fas ' +
     it.ic +
     '"></i> ' +
     it.lb +
     "</a>"
    );
   })
   .join("") +
  "</nav>" +
  "</aside>" +
  '<div class="summary-bar-premium">' +
  '<div class="d-flex align-items-center gap-md flex-grow-1">' +
  '<span class="badge-premium badge-premium-navy" id="totalBadge">0</span>' +
  '<input type="text" id="searchBox" class="form-control-premium" placeholder="Search cases..." style="flex:1; min-width:150px;">' +
  "</div>" +
  '<div class="d-flex align-items-center gap-sm mt-2 mt-md-0">' +
  '<div class="form-group-premium mb-0">' +
  '<label class="form-label-premium mb-1" for="dateFrom">From</label>' +
  '<input type="date" id="dateFrom" value="' +
  today +
  '" class="form-control-premium" style="width:118px;min-width:0;">' +
  "</div>" +
  '<div class="form-group-premium mb-0">' +
  '<label class="form-label-premium mb-1" for="dateTo">To</label>' +
  '<input type="date" id="dateTo" value="' +
  today +
  '" class="form-control-premium" style="width:118px;min-width:0;">' +
  "</div>" +
  '<div class="form-group-premium mb-0" style="position:relative;">' +
  '<label class="form-label-premium mb-1">Adv</label>' +
  '<button type="button" id="advFilterBtn" onclick="toggleAdvFilterMenu()" title="All Advocates" aria-label="Filter by advocate" class="form-control-premium" style="cursor:pointer;display:flex;align-items:center;justify-content:center;width:38px;height:38px;padding:0;background:#FFFFFF;border-width:1px;">' +
  '<i class="fas fa-user-tie" style="color:var(--gold);"></i>' +
  "</button>" +
  '<div id="advFilterMenu" style="display:none;position:absolute;top:100%;right:0;z-index:1060;background:#FFFFFF;border:1px solid var(--gray-light);border-radius:8px;box-shadow:var(--shadow-lg);min-width:230px;max-height:260px;overflow-y:auto;margin-top:4px;"></div>' +
  "</div>" +
  "</div>" +
  "</div>" +
  '<div id="casesContainer" class="animate-fade-in-up"></div>' +
  '<div id="rowActionsMenu" style="display:none;position:absolute;z-index:1080;background:#FFFFFF;border:1px solid var(--gray-light);border-radius:8px;box-shadow:var(--shadow-lg);min-width:212px;padding:4px 0;">' +
  '<button type="button" onclick="handleRowAction(\'changeJuzeName\')" style="display:flex;width:100%;align-items:center;gap:10px;padding:9px 14px;background:none;border:none;text-align:left;font-size:13px;color:var(--gray-dark);cursor:pointer;" onmouseover="this.style.background=\'var(--gold-bg)\'" onmouseout="this.style.background=\'\'">' +
  '<i class="fas fa-user-tie" style="color:var(--gold);width:14px;"></i>Change Judge name - only this case' +
  "</button>" +
  '<button type="button" onclick="handleRowAction(\'changeAllJuzesName\')" style="display:flex;width:100%;align-items:center;gap:10px;padding:9px 14px;background:none;border:none;text-align:left;font-size:13px;color:var(--gray-dark);cursor:pointer;" onmouseover="this.style.background=\'var(--gold-bg)\'" onmouseout="this.style.background=\'\'">' +
  '<i class="fas fa-users" style="color:var(--gold);width:14px;"></i>Change Judge name - all cases' +
  "</button>" +
  //   '<button type="button" onclick="" style="display:flex;width:100%;align-items:center;gap:10px;padding:9px 14px;background:none;border:none;text-align:left;font-size:13px;color:var(--gray-dark);cursor:pointer;" onmouseover="this.style.background=\'var(--gold-bg)\'" onmouseout="this.style.background=\'\'">' +
  // '<i class="fas fa-users" style="color:var(--gold);width:14px;"></i>Transfer' +
  // "</button>" +
  //   '<button type="button" onclick="" style="display:flex;width:100%;align-items:center;gap:10px;padding:9px 14px;background:none;border:none;text-align:left;font-size:13px;color:var(--gray-dark);cursor:pointer;" onmouseover="this.style.background=\'var(--gold-bg)\'" onmouseout="this.style.background=\'\'">' +
  // '<i class="fas fa-users" style="color:var(--gold);width:14px;"></i>Pull Serials' +
  // "</button>" +
  //   '<button type="button" onclick="" style="display:flex;width:100%;align-items:center;gap:10px;padding:9px 14px;background:none;border:none;text-align:left;font-size:13px;color:var(--gray-dark);cursor:pointer;" onmouseover="this.style.background=\'var(--gold-bg)\'" onmouseout="this.style.background=\'\'">' +
  // '<i class="fas fa-users" style="color:var(--gold);width:14px;"></i>Attach Files' +
  // "</button>" +
  "</div>";

 var searchInput = document.getElementById("searchBox");
 if (searchInput) {
  document.getElementById("dateFrom").addEventListener("change", function () {
   renderTable();
   searchInput.value = "";
  });
  document.getElementById("dateTo").addEventListener("change", function () {
   renderTable();
   searchInput.value = "";
  });
  searchInput.addEventListener("input", function () {
   renderTable();
  });
 }
 renderTable();
}

var caseRecords = [];
var caseRecords91 = [];
var caseDates = [];

async function loadDataFromDB() {
 try {
  var allCases = [];
  var dbCases = await dbDexieManager.getAllRecords(dbnm, "cs");
  if (dbCases && dbCases.length > 0) allCases = allCases.concat(dbCases);
  var dbCases91 = await dbDexieManager.getAllRecords(dbnm, "cs91");
  if (dbCases91 && dbCases91.length > 0) {
   caseRecords91 = dbCases91;
   allCases = allCases.concat(dbCases91);
  }
  if (allCases.length > 0) caseRecords = allCases;

  var dbDates = await dbDexieManager.getAllRecords(dbnm, "a");
  if (dbDates && dbDates.length > 0) caseDates = dbDates;
 } catch (e) {
  console.warn("Failed to load from DB:", e);
 }
}

function escHtml(s) {
 if (!s) return "";
 return String(s)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
}

function escAttr(s) {
 if (!s) return "";
 return String(s).replace(/"/g, "&quot;").replace(/&/g, "&amp;");
}

window.refreshFromServer = async function () {
 var btn = document.querySelector('[aria-label="Refresh"]');
 if (btn) {
  btn.disabled = true;
  btn.querySelector("i").style.animation = "ks-spin 1s linear infinite";
 }
 try {
  if (typeof fnj3 !== "function") {
   showMessageModal("Info", "Server communication not available", false);
   return;
  }
  clearPayload0();
  payload0.fn = 96;
  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
   { tb: "cs" },
   { tb: "cs91" },
   { tb: "c" },
   { tb: "a" },
  ]);
  var response = await fnj3(
   "https://my1.in/2/n.php",
   payload0,
   1,
   true,
   null,
   360000,
   0,
   1,
   1,
  );
  console.log("­ƒôÑ Refresh:", response);
  if (response && response.su == 1) {
   hndlRspo96(response);
  } else {
   showMessageModal("Error", response?.ms || "Refresh failed", true);
  }
 } catch (err) {
  showMessageModal("Info", "Error: " + err.message, false);
 } finally {
  if (btn) {
   btn.disabled = false;
   btn.querySelector("i").style.animation = "";
  }
 }
};

window.hndlRspo96 = async function (response) {
 await handl_ks_rspons(response);
 await recomputeAllowedModules();
 await loadDataFromDB();
 renderTable();
};

window.toggleColVisPanel = function () {
 var panel = document.getElementById("colVisPanel");
 if (panel) {
  panel.style.display = panel.style.display === "block" ? "none" : "block";
 }
};

var _ksRowMenuContext = null;
function openRowMenu(event, rec, dv, cdCur) {
  event.stopPropagation();
  var menu = document.getElementById("rowActionsMenu");
  if (!menu) return;
  _ksRowMenuContext = { rec: rec, dv: dv, cdCur: cdCur };
  menu.style.display = "block";
  var btn = event.currentTarget || event.target;
  var rect = btn.getBoundingClientRect();
  var below = rect.bottom + 4;
  var above = rect.top - menu.offsetHeight - 4;
  var top =
    below + menu.offsetHeight > window.innerHeight && above > 0 ? above : below;
  menu.style.top = top + window.scrollY + "px";
  var left = rect.right - menu.offsetWidth;
  if (left < 0) left = 0;
  menu.style.left = left + window.scrollX + "px";
}
function closeRowMenu() {
  var menu = document.getElementById("rowActionsMenu");
  if (menu) menu.style.display = "none";
  _ksRowMenuContext = null;
}
function handleRowAction(action) {
  var ctx = _ksRowMenuContext || {};
  if (action === "changeJuzeName") {
    if (typeof changeJuzeName === "function") changeJuzeName(ctx.rec, ctx);
  }
  if (action === "changeAllJuzesName") {
    if (typeof changeAllJuzesName === "function") changeAllJuzesName(ctx.rec, ctx);
  }
  closeRowMenu();
}
function installUpdateRecordWrapper() {
  if (typeof window.updateCaseRecord !== "function") return;
  if (window.updateCaseRecord._ksWrapped) return;
  var base = window.updateCaseRecord;
  var wrapper = async function () {
    if (payload0.cd !== 2) payload0.cd = 1;
    return base.apply(this, arguments);
  };
  wrapper._ksWrapped = true;
  window.updateCaseRecord = wrapper;
}

function isKsCs91Record(rec) {
  if (!rec) return false;
  if (typeof isCs91Record === "function") return !!isCs91Record(rec);
  return rec.tmt !== undefined;
}

function collectJudgeCaseIds(desigName) {
  var d = String(desigName || "").trim();
  var out = [];
  var seen = {};
  if (!d) return out;
  var recs91 =
    (typeof caseRecords91 !== "undefined" && caseRecords91) ||
    window.caseRecords91 ||
    [];
  for (var i = 0; i < recs91.length; i++) {
    var cr = recs91[i];
    if (!cr || String(cr.j || "").trim() !== d) continue;
    var cs =
      typeof findCsByCs91Link === "function" ? findCsByCs91Link(cr.a) : null;
    if (cs && cs.a != null && !seen[cs.a]) {
      seen[cs.a] = 1;
      out.push(cs.a);
    }
  }
  return out;
}

function changeJuzeName(caseRecord, context) {
  var rec = (context && context.rec) || caseRecord;
  if (!rec) {
    showMessageModal("Info", "No record selected.", false);
    return;
  }
  showJuzeNameModal(rec, { all: false });
}

function changeAllJuzesName(caseRecord, context) {
  var rec = (context && context.rec) || caseRecord;
  if (!rec) {
    showMessageModal("Info", "No record selected.", false);
    return;
  }
  showJuzeNameModal(rec, { all: true });
}

function showJuzeNameModal(rec, opts) {
  opts = opts || {};
  if (!rec) {
    showMessageModal("Info", "No record selected.", false);
    return;
  }
  if (isKsCs91Record(rec)) {
    showMessageModal(
      "Info",
      "Judge name change is not available for E-Court (CNR) records.",
      false,
    );
    return;
  }
  // var disp =
  //   typeof getCaseDisplayRecord === "function" ? getCaseDisplayRecord(rec) : rec;
  var cr =
    typeof getCaseCs91Fallback === "function" ? getCaseCs91Fallback(rec) : null;
  var courtName = rec.q || "";
  var desigName = (cr && cr.j) || "";
  var desig = String(desigName).trim();
  var mid = "juzeNameModal_" + Date.now();
  var ids = opts.all ? collectJudgeCaseIds(desig) : [];
  window._ksJuzeCtx = {
    rec: rec,
    court: String(courtName).trim(),
    desig: desig,
    all: !!opts.all,
    count: ids.length,
  };
  var affectHtml = "";
  if (opts.all) {
    affectHtml =
      '<div class="form-group-premium mb-2">' +
      '<label class="form-label-premium mb-1">Cases affected:</label>' +
      '<div class="form-control-premium" style="background:var(--gray-surface);font-weight:600;">' +
      ids.length +
      (ids.length === 1 ? " case" : " cases") +
      " with this designation</div></div>";
  }
  var html =
    '<div class="modal fade" id="' +
    mid +
    '" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered">' +
    '<div class="modal-content animate-scale-in shadow-xl" style="border:3px solid var(--navy);border-radius:12px;overflow:hidden;">' +
    '<div class="modal-header bg-navy-gradient text-gold" style="padding:14px 18px;border-bottom:3px solid var(--gold);">' +
    '<h6 class="modal-title fw-bold" style="font-size:15px;letter-spacing:0.5px;"><i class="fas fa-user-tie me-2 text-gold"></i>CHANGE JUDGE NAME</h6>' +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
    '<div class="modal-body p-3">' +
    '<div class="form-group-premium mb-2">' +
    '<label class="form-label-premium mb-1">Court name:</label>' +
    '<div class="form-control-premium" style="background:var(--gray-surface);font-weight:600;">' +
    (courtName ? escHtml(courtName) : '<span class="text-muted">Court name not available</span>') +
    "</div></div>" +
    '<div class="form-group-premium mb-2">' +
    '<label class="form-label-premium mb-1">Designation name:</label>' +
    '<div class="form-control-premium" style="background:var(--gray-surface);font-weight:600;">' +
    (desigName ? escHtml(desigName) : '<span class="text-muted">Designation name not available</span>') +
    "</div></div>" +
    affectHtml +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium mb-1" for="juzeNewName">New judge name:</label>' +
    '<input type="text" id="juzeNewName" class="form-control-premium" maxlength="12" placeholder="Enter new judge name" autocomplete="off" spellcheck="false" oninput="this.value=this.value.replace(/[^A-Za-z0-9]/g,\'\').slice(0,12)" onkeydown="if(event.key===\'Enter\'){event.preventDefault();saveJuzeName(\'' +
    mid +
    '\');}">' +
    '<div class="form-hint">Maximum 12 characters, letters and digits only.</div>' +
    "</div></div>" +
    '<div class="modal-footer" style="padding:12px 18px;border-top:2px solid var(--gray-bg);display:flex;justify-content:flex-end;gap:8px;">' +
    '<button type="button" class="btn-premium btn-premium-secondary" data-bs-dismiss="modal">Cancel</button>' +
    '<button type="button" class="btn-premium btn-premium-primary" onclick="saveJuzeName(\'' +
    mid +
    '\')"><i class="fas fa-check me-1"></i> OK</button>' +
    "</div></div></div>";
  document.body.insertAdjacentHTML("beforeend", html);
  var modalEl = document.getElementById(mid);
  new bootstrap.Modal(modalEl).show();
  setTimeout(function () {
    var input = document.getElementById("juzeNewName");
    if (input) input.focus();
  }, 250);
  modalEl.addEventListener("hidden.bs.modal", function () {
    window._ksJuzeCtx = null;
    this.remove();
  });
}

async function saveJuzeName(mid) {
  var ctx = window._ksJuzeCtx || {};
  var rec = ctx.rec;
  if (!rec) {
    showMessageModal("Info", "No record selected.", false);
    return;
  }
  if (isKsCs91Record(rec)) {
    showMessageModal(
      "Info",
      "Judge name change is not available for E-Court (CNR) records.",
      false,
    );
    return;
  }
  var input = document.getElementById("juzeNewName");
  var val = input ? String(input.value || "").trim() : "";
  if (!val) {
    showMessageModal("Info", "Please enter new judge name.", false);
    return;
  }
  if (!/^[A-Za-z0-9]{1,12}$/.test(val)) {
    showMessageModal("Info", "Only letters and digits allowed (max 12).", false);
    return;
  }
  if (ctx.court && val === ctx.court) {
    showMessageModal("Info", "New judge name is same as current.", false);
    return;
  }
  var ids = rec.a;
  var allCount = 0;
  if (ctx.all) {
    if (!ctx.desig) {
      showMessageModal(
        "Info",
        "Designation name not available for this record.",
        false,
      );
      return;
    }
    ids = collectJudgeCaseIds(ctx.desig);
    if (ids.length === 0) {
      showMessageModal("Info", "No cases found with this designation.", false);
      return;
    }
    allCount = ids.length;
  }
  var modalEl = document.getElementById(mid);
  if (modalEl) {
    var inst = bootstrap.Modal.getInstance(modalEl);
    if (inst) inst.hide();
  }
  await new Promise(function (r) { setTimeout(r, 300); });
  try {
    await updateCaseRecordJudgeName(ids, val, allCount);
  } catch (e) {
    showMessageModal("Error", e && e.message ? e.message : "Update failed", true);
  }
}

async function updateCaseRecordJudgeName(recId, newJudgeName, count) {
  var isArr = Array.isArray(recId);
  var ids = isArr
    ? recId.filter(function (v) {
        return v != null && v !== "";
      })
    : recId == null || recId === ""
      ? []
      : [recId];
  var jName = String(newJudgeName || "").trim();
  if (ids.length === 0) {
    showMessageModal("Info", "No record selected.", false);
    return;
  }
  if (!jName) {
    showMessageModal("Info", "Please enter new judge name.", false);
    return;
  }
  clearPayload0();
  payload0.x1 = isArr ? ids : ids[0]; //Id (one case) or Id array (all cases)
  payload0.p = { q: jName };
  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "cs" }]);
  payload0.fn = 72;
  payload0.cd = 2;
  console.log(
    "📤 Update Judge Name:",
    "a=" + (isArr ? ids.join(",") : ids[0]),
    JSON.stringify(payload0.p),
  );
  try {
    if (typeof fnj3 !== "function") {
      showMessageModal("Info", "Server communication not available", false);
      return;
    }
    var jResponse = await fnj3(
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
    console.log("📥 Server:", jResponse);
    if (jResponse && jResponse.su == 1) {
      await hndlRspo72(jResponse, { courtName: jName, count: count || 0 });
    } else {
      showMessageModal("Info", jResponse?.ms || "Record not updated", false);
    }
  } catch (e) {
    showMessageModal("Info", "Error: " + e.message, false);
  } finally {
    payload0.cd = 1;
  }
}

async function hndlRspo72(response, ctx) {
  ctx = ctx || {};
  await handl_ks_rspons(response);
  await loadDataFromDB();
  renderTable();
  var n = parseInt(ctx.count || 0) || 0;
  if (n > 0) {
    showMessageModal(
      "Success",
      "✅ Judge name updated for " +
        n +
        (n === 1 ? " case" : " cases") +
        ".\n\nNew name: " +
        (ctx.courtName || ""),
      false,
    );
  } else {
    showMessageModal(
      "Success",
      "✅ Judge name updated successfully!\n\nCourt: " + (ctx.courtName || ""),
      false,
    );
  }
}

document.addEventListener("click", function (e) {
  var panel = document.getElementById("colVisPanel");
  var btn = document.getElementById("colVisToggle");
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
    panel.style.display = "none";
  }
  var menu = document.getElementById("rowActionsMenu");
  var mbtn = e.target.closest ? e.target.closest("#rowActionsMenu button") : null;
  if (menu && !menu.contains(e.target) && mbtn === null) {
    closeRowMenu();
  }
});

console.log("Ô£à ks.js ready - Premium Design");