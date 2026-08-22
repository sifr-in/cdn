// ks.js - Court Case Register
(async function () {
  const sho_da_tkLimit = 1;
  let appData = {};
  const ids_of_views = [3];
  let tblFailureCount = 1;
  const cacheStrategy = 1;
  const dontShoLoginConfirmation = 1;
  const dontRestartAfterLogin = 1;

  window[my1uzr.worknOnPg] = {};
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
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@c16355d/cmn/my1lp.js",
        c: "open_shoLgnP",
        r: "open_shoLgnP",
      },
      { a: 5, u: "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
      {
        a: 8,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/cmn/my1xi.min.js",
      },
      {
        a: 20,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@5945bc7/ks/sidebar.js",
        c: "handleMenuAction,toggleSidebar",
        r: " ",
      },
      {
        a: 25,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@357863b/ks/addNewCase.js",
        // u: "addNewCase.js",
        c: "showAddCaseModal,toggleCNRFields,toggleMoreDetails,saveCase,openEditCaseModal,updateCaseRecord,switchEditTab,openMemberSelector,selectFilerParty,selectAnswererParty",
        r: " ",
      },
      {
        a: 26,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@357863b/ks/allCases.js",
        // u: "allCases.js",
        c: "showAllCases,showHome",
        r: " ",
      },
      {
        a: 21,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@5b69764/ks/ks_h.js",
        c: "handl_ks_rspons",
        r: " ",
      },
      {
        a: 22,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@5b69764/ks/messageModal.js",
        c: "showMessageModal,showModal",
        r: " ",
      },
      {
        a: 23,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@357863b/ks/nextDate.js",
        // u: "nextDate.js",
        c: "openNextHearingModal,saveNextHearing,updateNextDateRecord",
        r: " ",
      },
      {
        a: 24,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@5b69764/ks/printRecords.js",
        c: "printDashboard",
        r: " ",
      },
      {
        a: 27,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@72bbbd3/cmn/ei.js",
        // u: "ei.js",
        c: "open_entind_crud",
        r: "open_entind_crud",
      },
      {
        a: 30,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1236a32/cmn/clrChe.js",
        c: "showClearCacheModal",
        r: "showClearCacheModal",
      },
    ];
  }

  try {
    console.log("🚀 Starting Court Case Register App...");

    let result1 = await loadCshScriptsSequentially(1, 2, 3, 4, 5, 8, 30);
    if (!result1.success)
      throw new Error("Failed to load required scripts: " + result1.error);

    console.log("📦 Creating database tables for:", dbnm);
    try {
      const createResult = await dbDexieManager.handleNwTables("loader", dbnm, [
        "cs",
        "c",
        "a",
        "cs91",
      ]);
      tblFailureCount = createResult.failureCount;
      console.log(
        "✅ Database initialized:",
        dbnm,
        "| Failure count:",
        createResult.failureCount,
      );
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
    }

    console.log("📦 Loading modules...");
    await loadExe2Fn(22);
    console.log("✅ messageModal loaded");
    await loadExe2Fn(21);
    console.log("✅ ks_h loaded");
    await loadExe2Fn(23);
    console.log("✅ nextDate loaded");
    await loadExe2Fn(24);
    console.log("✅ printRecords loaded");
    await loadExe2Fn(20);
    console.log("✅ sidebar loaded");
    await loadExe2Fn(25);
    console.log("✅ addNewCase loaded");
    await loadExe2Fn(26);
    console.log("✅ allCases loaded");
    await loadExe2Fn(27);
    console.log("✅ ei loaded");

    injectKSStyles();

    await loadDataFromDB();

    renderAppUI();
    console.log("✅ App UI rendered - Premium Bootstrap Design");
  } catch (e) {
    console.error("❌ App initialization error:", e);
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
  "/* ============================================\n   KS - Court Case Management System\n   Design System & Reusable Classes\n   Classic Authority Theme\n   ============================================ */\n\n/* CSS Variables */\n:root {\n  /* Navy Palette (60%) */\n  --navy-dark: #0D1B36;\n  --navy: #1B2A4A;\n  --navy-light: #2A3F6E;\n  \n  /* Gold Palette (10% Accent) */\n  --gold: #C9A84C;\n  --gold-light: #D4B96A;\n  --gold-dark: #B8942E;\n  --gold-bg: #FDF8EE;\n  --gold-rgb: 201, 168, 76;\n  \n  /* Gray Palette (30%) */\n  --gray-dark: #555555;\n  --gray: #7A7A7A;\n  --gray-light: #B0B0B0;\n  --gray-bg: #E8E8E8;\n  --gray-surface: #F5F5F5;\n  \n  /* Section Colors */\n  --section-nd-bg: #D0ECEE;\n  --section-nd-border: #4AADAD;\n  --section-ecourt-bg: #D5E2F2;\n  --section-ecourt-border: #87c1ff;\n  --section-manual-bg: #F8EDD5;\n  --section-manual-border: #C9A84C;\n  \n  /* Spacing */\n  --spacing-xs: 4px;\n  --spacing-sm: 8px;\n  --spacing-md: 12px;\n  --spacing-lg: 16px;\n  --spacing-xl: 20px;\n  --spacing-2xl: 24px;\n  --spacing-3xl: 32px;\n  \n  /* Border Radius */\n  --radius-sm: 6px;\n  --radius-md: 8px;\n  --radius-lg: 12px;\n  --radius-xl: 16px;\n  --radius-full: 9999px;\n  \n  /* Shadows */\n  --shadow-sm: 0 1px 3px rgba(13, 27, 54, 0.06);\n  --shadow-md: 0 4px 12px rgba(13, 27, 54, 0.08);\n  --shadow-lg: 0 8px 24px rgba(13, 27, 54, 0.12);\n  --shadow-xl: 0 12px 32px rgba(13, 27, 54, 0.16);\n  \n  /* Transitions */\n  --transition-fast: 150ms ease;\n  --transition-base: 200ms ease;\n  --transition-slow: 300ms ease;\n  \n  /* Typography */\n  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  --font-size-xs: 10px;\n  --font-size-sm: 12px;\n  --font-size-base: 14px;\n  --font-size-lg: 16px;\n  --font-size-xl: 18px;\n  --font-size-2xl: 22px;\n  --font-weight-normal: 400;\n  --font-weight-medium: 500;\n  --font-weight-semibold: 600;\n  --font-weight-bold: 700;\n}\n\n/* ============================================\n   BASE STYLES\n   ============================================ */\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  padding: 0;\n  background:\n    radial-gradient(circle at 20% 20%, rgba(var(--gold-rgb), 0.06), transparent 30%),\n    radial-gradient(circle at 80% 70%, rgba(13, 27, 54, 0.05), transparent 35%),\n    var(--gray-surface);\n  background-size: 200% 200%;\n  animation: floatBlob 40s ease-in-out infinite alternate,\n             floatBlob 50s ease-in-out infinite alternate-reverse;\n  font-family: var(--font-family);\n  min-height: 100vh;\n  color: var(--navy);\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* ============================================\n   TYPOGRAPHY\n   ============================================ */\n.text-navy { color: var(--navy) !important; }\n.text-navy-dark { color: var(--navy-dark) !important; }\n.text-gold { color: var(--gold) !important; }\n.text-gray { color: var(--gray) !important; }\n.text-gray-dark { color: var(--gray-dark) !important; }\n.text-gray-light { color: var(--gray-light) !important; }\n\n.font-serif { font-family: Georgia, 'Times New Roman', serif; }\n.font-mono { font-family: 'Courier New', monospace; }\n\n.fw-medium { font-weight: var(--font-weight-medium) !important; }\n.fw-semibold { font-weight: var(--font-weight-semibold) !important; }\n\n.text-xs { font-size: var(--font-size-xs); }\n.text-sm { font-size: var(--font-size-sm); }\n.text-base { font-size: var(--font-size-base); }\n.text-lg { font-size: var(--font-size-lg); }\n\n/* ============================================\n   BACKGROUNDS\n   ============================================ */\n.bg-navy { background: var(--navy) !important; }\n.bg-navy-dark { background: var(--navy-dark) !important; }\n.bg-navy-gradient {\n  background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%) !important;\n}\n.bg-gold { background: var(--gold) !important; }\n.bg-gold-light { background: var(--gold-bg) !important; }\n.bg-gray-surface { background: var(--gray-surface) !important; }\n.bg-white { background: #ffffff !important; }\n\n/* ============================================\n   BORDERS\n   ============================================ */\n.border-navy { border-color: var(--navy) !important; }\n.border-gold { border-color: var(--gold) !important; }\n.border-gray { border-color: var(--gray-light) !important; }\n.border-gray-light { border-color: var(--gray-bg) !important; }\n\n.border-2 { border-width: 2px !important; }\n.border-3 { border-width: 3px !important; }\n\n.border-bottom-gold {\n  border-bottom: 3px solid var(--gold) !important;\n}\n\n/* ============================================\n   BORDER RADIUS\n   ============================================ */\n.rounded-md { border-radius: var(--radius-md) !important; }\n.rounded-lg { border-radius: var(--radius-lg) !important; }\n.rounded-xl { border-radius: var(--radius-xl) !important; }\n.rounded-full { border-radius: var(--radius-full) !important; }\n\n/* ============================================\n   SHADOWS\n   ============================================ */\n.shadow-sm { box-shadow: var(--shadow-sm) !important; }\n.shadow-md { box-shadow: var(--shadow-md) !important; }\n.shadow-lg { box-shadow: var(--shadow-lg) !important; }\n.shadow-xl { box-shadow: var(--shadow-xl) !important; }\n\n.shadow-hover {\n  transition: box-shadow var(--transition-base), transform var(--transition-base);\n}\n.shadow-hover:hover {\n  box-shadow: var(--shadow-lg);\n  transform: translateY(-1px);\n}\n\n/* ============================================\n   CARDS (Bootstrap Extension)\n   ============================================ */\n.card-premium {\n  background: #fff;\n  border: 1px solid var(--gray-bg);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow-sm);\n  transition: box-shadow var(--transition-base);\n  overflow: hidden;\n}\n.card-premium:hover {\n  box-shadow: var(--shadow-md);\n}\n\n.card-premium .card-header-premium {\n  background: var(--navy);\n  color: var(--gold);\n  padding: var(--spacing-lg);\n  border-bottom: 3px solid var(--gold);\n  font-weight: var(--font-weight-bold);\n  font-size: var(--font-size-base);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n\n/* ============================================\n   BUTTONS (Bootstrap Extension)\n   ============================================ */\n.btn-premium {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--spacing-xs);\n  padding: 10px 24px;\n  border-radius: var(--radius-md);\n  font-weight: var(--font-weight-semibold);\n  font-size: var(--font-size-base);\n  cursor: pointer;\n  transition: all var(--transition-base);\n  border: 2px solid transparent;\n  position: relative;\n  overflow: hidden;\n}\n\n.btn-premium-primary {\n  background: linear-gradient(135deg, var(--navy-dark), var(--navy));\n  color: var(--gold);\n  border-color: var(--gold);\n}\n.btn-premium-primary:hover {\n  background: var(--gold);\n  color: var(--navy-dark);\n  box-shadow: var(--shadow-md);\n  transform: translateY(-1px);\n}\n.btn-premium-primary:active {\n  transform: translateY(0);\n  box-shadow: var(--shadow-sm);\n}\n\n.btn-premium-secondary {\n  background: var(--gray-surface);\n  color: var(--gray-dark);\n  border-color: var(--gray-light);\n}\n.btn-premium-secondary:hover {\n  background: var(--gray-bg);\n  border-color: var(--gray);\n}\n\n.btn-premium-danger {\n  background: #dc3545;\n  color: #fff;\n  border-color: #dc3545;\n}\n.btn-premium-danger:hover {\n  background: #c82333;\n  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);\n}\n\n.btn-premium-sm {\n  padding: 6px 16px;\n  font-size: var(--font-size-sm);\n}\n\n.btn-premium-lg {\n  padding: 12px 32px;\n  font-size: var(--font-size-lg);\n}\n\n.btn-premium-icon {\n  width: 38px;\n  height: 38px;\n  padding: 0;\n  border-radius: var(--radius-full);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(var(--gold-rgb), 0.2);\n  color: #fff;\n  font-size: 18px;\n  transition: all var(--transition-base);\n}\n.btn-premium-icon:hover {\n  background: rgba(var(--gold-rgb), 0.25);\n  border-color: var(--gold);\n  transform: scale(1.1);\n}\n\n.btn-premium:disabled,\n.btn-premium.loading {\n  opacity: 0.6;\n  cursor: not-allowed;\n  pointer-events: none;\n}\n\n.btn-premium .spinner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid currentColor;\n  border-top-color: transparent;\n  border-radius: 50%;\n  animation: spin 0.6s linear infinite;\n}\n\n/* ============================================\n   FORMS (Bootstrap Extension)\n   ============================================ */\n.form-control-premium {\n  width: 100%;\n  padding: 10px 14px;\n  border: 2px solid var(--gray-light);\n  border-radius: var(--radius-md);\n  font-size: var(--font-size-base);\n  font-family: var(--font-family);\n  color: var(--navy);\n  background: #fff;\n  transition: all var(--transition-base);\n  outline: none;\n}\n.form-control-premium:focus {\n  border-color: var(--gold);\n  box-shadow: 0 0 0 3px rgba(var(--gold-rgb), 0.15);\n}\n.form-control-premium::placeholder {\n  color: var(--gray-light);\n  opacity: 0.7;\n}\n.form-control-premium.is-invalid {\n  border-color: #dc3545;\n}\n.form-control-premium.is-invalid:focus {\n  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);\n}\n\n.form-select-premium {\n  width: 100%;\n  padding: 10px 14px;\n  border: 2px solid var(--gray-light);\n  border-radius: var(--radius-md);\n  font-size: var(--font-size-base);\n  font-family: var(--font-family);\n  color: var(--navy);\n  background: #fff;\n  transition: all var(--transition-base);\n  outline: none;\n  appearance: none;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7A7A' d='M6 8L1 3h10z'/%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: right 12px center;\n  padding-right: 36px;\n}\n.form-select-premium:focus {\n  border-color: var(--gold);\n  box-shadow: 0 0 0 3px rgba(var(--gold-rgb), 0.15);\n}\n\n.form-label-premium {\n  font-weight: var(--font-weight-semibold);\n  font-size: var(--font-size-sm);\n  color: var(--gray-dark);\n  margin-bottom: 4px;\n  display: block;\n}\n\n.form-label-premium .required {\n  color: #dc3545;\n}\n\n.form-hint {\n  font-size: var(--font-size-xs);\n  color: var(--gray);\n  margin-top: 3px;\n  font-style: italic;\n}\n\n.form-group-premium {\n  margin-bottom: var(--spacing-md);\n}\n\n.form-row-premium {\n  display: flex;\n  gap: var(--spacing-md);\n}\n.form-row-premium > * {\n  flex: 1;\n}\n\n.form-hint {\n  font-size: 11px;\n  color: var(--gray);\n  margin-top: 4px;\n}\n\n/* Floating Label */\n.form-floating-premium {\n  position: relative;\n}\n.form-floating-premium .form-control-premium {\n  padding: 14px 14px 6px 14px;\n}\n.form-floating-premium label {\n  position: absolute;\n  top: 50%;\n  left: 14px;\n  transform: translateY(-50%);\n  font-size: var(--font-size-base);\n  color: var(--gray-light);\n  transition: all var(--transition-base);\n  pointer-events: none;\n}\n.form-floating-premium .form-control-premium:focus ~ label,\n.form-floating-premium .form-control-premium:not(:placeholder-shown) ~ label {\n  top: 8px;\n  font-size: 11px;\n  color: var(--navy);\n  font-weight: var(--font-weight-semibold);\n}\n\n/* ============================================\n   TABLES (Bootstrap Extension)\n   ============================================ */\n.table-premium {\n  width: 100%;\n  border-collapse: collapse;\n}\n.table-premium thead {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}\n.table-premium thead th {\n  background: var(--navy);\n  color: var(--gold);\n  font-size: var(--font-size-xs);\n  text-transform: uppercase;\n  letter-spacing: 0.6px;\n  padding: 14px 8px;\n  border: none;\n  white-space: nowrap;\n  text-align: center;\n  font-weight: var(--font-weight-bold);\n  border-bottom: 3px solid var(--gold);\n}\n.table-premium tbody td {\n  padding: 10px 8px;\n  font-size: var(--font-size-sm);\n  vertical-align: middle;\n  border-color: #eee;\n  text-align: center;\n  color: var(--gray-dark);\n  transition: background var(--transition-fast);\n}\n.table-premium tbody tr {\n  transition: background var(--transition-fast);\n}\n.table-premium tbody tr:hover {\n  background: var(--gold-bg);\n}\n.table-premium tbody tr:nth-child(even) {\n  background: #fafafa;\n}\n.table-premium tbody tr:nth-child(even):hover {\n  background: var(--gold-bg);\n}\n.table-premium tbody tr.row-selected {\n  background: var(--gold-bg);\n  border-left: 3px solid var(--gold);\n}\n\n.table-container-premium {\n  background: #fff;\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow-sm);\n  overflow: hidden;\n  border: 1px solid var(--gray-bg);\n  margin: var(--spacing-lg);\n}\n\n.table-scroll-premium {\n  max-height: calc(100vh - 210px);\n  overflow-y: auto;\n  overflow-x: auto;\n}\n\n.table-scroll-premium table {\n  min-width: 1100px;\n}\n\n/* ============================================\n   SIDEBAR\n   ============================================ */\n.sidebar-overlay-premium {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(13, 27, 54, 0.6);\n  z-index: 10000;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity var(--transition-slow), visibility var(--transition-slow);\n  backdrop-filter: blur(2px);\n}\n.sidebar-overlay-premium.visible {\n  opacity: 1;\n  visibility: visible;\n}\n\n.sidebar-premium {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 260px;\n  height: 100%;\n  background: #fff;\n  z-index: 10001;\n  box-shadow: var(--shadow-xl);\n  transform: translateX(-100%);\n  transition: transform var(--transition-slow);\n  display: flex;\n  flex-direction: column;\n}\n.sidebar-premium.open {\n  transform: translateX(0);\n}\n\n.sidebar-premium .sidebar-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: var(--spacing-lg);\n  background: linear-gradient(135deg, var(--navy-dark), var(--navy));\n  border-bottom: 3px solid var(--gold);\n  color: #fff;\n}\n\n.sidebar-premium .sidebar-menu {\n  padding: var(--spacing-sm) 0;\n  flex: 1;\n  overflow-y: auto;\n}\n\n.sidebar-premium .sidebar-item {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  padding: var(--spacing-md) var(--spacing-lg);\n  font-size: var(--font-size-base);\n  color: var(--gray-dark);\n  cursor: pointer;\n  transition: all var(--transition-fast);\n  text-decoration: none;\n  border-bottom: 1px solid var(--gray-bg);\n  position: relative;\n}\n.sidebar-premium .sidebar-item:hover {\n  background: var(--gold-bg);\n  color: var(--navy);\n}\n.sidebar-premium .sidebar-item.active {\n  background: var(--gold-bg);\n  color: var(--navy);\n  border-left: 3px solid var(--gold);\n  font-weight: var(--font-weight-semibold);\n}\n.sidebar-premium .sidebar-item i {\n  font-size: var(--font-size-lg);\n  width: 20px;\n  text-align: center;\n  color: var(--navy);\n  transition: transform var(--transition-fast);\n}\n.sidebar-premium .sidebar-item:hover i {\n  transform: translateX(2px);\n}\n\n/* ============================================\n   MODALS (Bootstrap Extension)\n   ============================================ */\n.modal-premium .modal-content {\n  border: 3px solid var(--navy);\n  border-radius: var(--radius-lg);\n  overflow: hidden;\n  box-shadow: var(--shadow-xl);\n}\n\n.modal-premium .modal-header {\n  background: linear-gradient(135deg, var(--navy-dark), var(--navy));\n  color: var(--gold);\n  padding: var(--spacing-lg);\n  border-bottom: 3px solid var(--gold);\n}\n\n.modal-premium .modal-body {\n  padding: 0;\n  overflow-y: auto;\n}\n\n.modal-premium .modal-footer {\n  padding: var(--spacing-lg);\n  border-top: 2px solid var(--gray-bg);\n  display: flex;\n  justify-content: flex-end;\n  gap: var(--spacing-sm);\n}\n\n.modal-backdrop-premium {\n  backdrop-filter: blur(4px);\n}\n\n/* ============================================\n   HEADER / NAVBAR\n   ============================================ */\n.header-premium {\n  position: sticky;\n  top: 0;\n  z-index: 9999;\n  background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%);\n  height: 64px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 var(--spacing-xl);\n  box-shadow: var(--shadow-lg);\n  border-bottom: 3px solid var(--gold);\n}\n\n.header-premium .header-title {\n  font-size: var(--font-size-2xl);\n  font-weight: var(--font-weight-bold);\n  color: #fff;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n  font-family: Georgia, 'Times New Roman', serif;\n  letter-spacing: 0.5px;\n}\n\n.header-premium .header-title .icon {\n  font-size: 26px;\n  color: var(--gold);\n}\n\n.header-premium .header-actions {\n  display: flex;\n  gap: var(--spacing-sm);\n}\n\n/* ============================================\n   SUMMARY BAR\n   ============================================ */\n.summary-bar-premium {\n  background: #fff;\n  padding: var(--spacing-md) var(--spacing-lg);\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--spacing-sm) var(--spacing-lg);\n  border-bottom: 1px solid var(--gray-bg);\n  box-shadow: var(--shadow-sm);\n}\n\n/* ============================================\n   BADGES\n   ============================================ */\n.badge-premium {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 5px 14px;\n  border-radius: var(--radius-full);\n  font-weight: var(--font-weight-bold);\n  font-size: var(--font-size-sm);\n  white-space: nowrap;\n}\n\n.badge-premium-navy {\n  background: var(--navy);\n  color: var(--gold);\n  border: 1px solid rgba(var(--gold-rgb), 0.4);\n}\n\n.badge-premium-gold {\n  background: var(--gold);\n  color: var(--navy-dark);\n  font-weight: var(--font-weight-bold);\n}\n\n.badge-premium-outline {\n  background: transparent;\n  border: 1px solid currentColor;\n}\n\n/* ============================================\n   SCROLLBAR\n   ============================================ */\n::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n::-webkit-scrollbar-track {\n  background: var(--gray-surface);\n  border-radius: 4px;\n}\n::-webkit-scrollbar-thumb {\n  background: var(--navy);\n  border-radius: 4px;\n}\n::-webkit-scrollbar-thumb:hover {\n  background: var(--navy-dark);\n}\n\n/* ============================================\n   ANIMATIONS\n   ============================================ */\n@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n@keyframes fadeInUp {\n  from { opacity: 0; transform: translateY(8px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n@keyframes fadeInDown {\n  from { opacity: 0; transform: translateY(-8px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n@keyframes slideInLeft {\n  from { transform: translateX(-100%); }\n  to { transform: translateX(0); }\n}\n@keyframes slideInRight {\n  from { transform: translateX(100%); }\n  to { transform: translateX(0); }\n}\n@keyframes scaleIn {\n  from { opacity: 0; transform: scale(0.95); }\n  to { opacity: 1; transform: scale(1); }\n}\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n@keyframes shimmer {\n  0% { background-position: -200px 0; }\n  100% { background-position: 200px 0; }\n}\n@keyframes floatBlob {\n  0%   { background-position: 0% 0%, 100% 100%; }\n  50%  { background-position: 100% 100%, 0% 0%; }\n  100% { background-position: 0% 0%, 100% 100%; }\n}\n\n.animate-fade-in { animation: fadeIn var(--transition-slow) ease; }\n.animate-fade-in-up { animation: fadeInUp var(--transition-slow) ease; }\n.animate-scale-in { animation: scaleIn var(--transition-base) ease; }\n.animate-slide-in-left { animation: slideInLeft var(--transition-slow) ease; }\n\n/* Skeleton Loading */\n.skeleton {\n  background: linear-gradient(90deg, var(--gray-bg) 25%, var(--gray-surface) 50%, var(--gray-bg) 75%);\n  background-size: 200px 100%;\n  animation: shimmer 1.5s infinite;\n  border-radius: var(--radius-sm);\n}\n\n/* Reduced Motion */\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n\n/* ============================================\n   RESPONSIVE\n   ============================================ */\n@media (max-width: 600px) {\n  .header-premium {\n    height: auto;\n    min-height: 52px;\n    padding: 6px 12px;\n  }\n  .header-premium .header-title {\n    font-size: var(--font-size-lg);\n    gap: 6px;\n  }\n  \n  .form-row-premium {\n    flex-direction: column;\n    gap: var(--spacing-sm);\n  }\n  \n  .summary-bar-premium {\n    padding: var(--spacing-sm) var(--spacing-md);\n    flex-direction: column;\n    align-items: stretch;\n    gap: var(--spacing-sm);\n  }\n  \n  .table-container-premium {\n    margin: var(--spacing-sm);\n    border-radius: var(--radius-md);\n  }\n  .cs-radio-label {\n    flex: 1;\n    justify-content: center;\n    font-size: 11px;\n    padding: 6px 10px;\n  }\n}\n\n/* ============================================\n   PRINT STYLES\n   ============================================ */\n@media print {\n  body { background: #fff; }\n  .header-premium {\n    background: var(--navy) !important;\n    -webkit-print-color-adjust: exact;\n    print-color-adjust: exact;\n  }\n  .btn-premium-icon { display: none !important; }\n  .table-container-premium {\n    max-height: none;\n    overflow: visible;\n    box-shadow: none;\n    margin: 0;\n    border-radius: 0;\n    border: none;\n  }\n  @page { margin: 8mm; }\n}\n\n/* ============================================\n   UTILITY CLASSES\n   ============================================ */\n.gap-xs { gap: var(--spacing-xs); }\n.gap-sm { gap: var(--spacing-sm); }\n.gap-md { gap: var(--spacing-md); }\n.gap-lg { gap: var(--spacing-lg); }\n\n.truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.cursor-pointer { cursor: pointer; }\n.select-none { user-select: none; }\n\n.opacity-0 { opacity: 0; }\n.opacity-50 { opacity: 0.5; }\n.opacity-100 { opacity: 1; }\n\n.transition-all { transition: all var(--transition-base); }\n.transition-transform { transition: transform var(--transition-base); }\n\n@keyframes ks-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\n\n.transition-opacity { transition: opacity var(--transition-base); }\n\n/* ============================================\n   RADIO OPTION CARDS\n   ============================================ */\n.cs-radio-label {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 16px;\n  border-radius: var(--radius-md);\n  border: 2px solid var(--gray-bg);\n  cursor: pointer;\n  transition: all var(--transition-base);\n  font-size: var(--font-size-sm);\n  color: var(--gray-dark);\n  user-select: none;\n  background: #fff;\n}\n.cs-radio-label:hover {\n  border-color: var(--gold);\n  background: var(--gold-bg);\n  box-shadow: 0 2px 8px rgba(var(--gold-rgb), 0.15);\n  transform: translateY(-1px);\}\n.cs-radio-label.cs-active-ecourt {\n  border-color: var(--section-ecourt-border);\n  background: var(--section-ecourt-bg);\n  box-shadow: 0 2px 8px rgba(94, 138, 184, 0.2);\n}\n.cs-radio-label.cs-active-manual {\n  border-color: var(--section-manual-border);\n  background: var(--section-manual-bg);\n  box-shadow: 0 2px 8px rgba(201, 168, 76, 0.2);\n}\n.cs-radio-label input[type=radio] {\n  accent-color: var(--gold);\n  margin: 0;\n}\n\n/* ============================================\n   SEARCHABLE CASE TYPE\n   ============================================ */\n.cs-type-custom {\n  font-size: var(--font-size-xs);\n  color: #dc3545;\n  margin-top: 4px;\n  font-style: italic;\n  padding: 3px 8px;\n  background: rgba(220, 53, 69, 0.06);\n  border-radius: var(--radius-sm);\n  border-left: 3px solid #dc3545;\n}\n.cs-type-custom::before {\n  content: '\\u201C';\n  font-weight: bold;\n  font-size: 14px;\n}\n.cs-type-custom::after {\n  content: '\\u201D';\n  font-weight: bold;\n  font-size: 14px;\n}\n";

function injectKSStyles() {
  var st = document.createElement("style");
  st.id = "ks-custom-styles";
  st.innerHTML = appcss;
  document.head.appendChild(st);
  var stCs91 = document.createElement("style");
  stCs91.id = "ks-cs91-styles";
  stCs91.innerHTML =
    "tr.cs91-date-row{background:#D5E2F2!important;}" +
    "tr.cs91-date-row:hover{background:#C4D6EC!important;}";
  document.head.appendChild(stCs91);
}

var currentView = "home";

function getHeaderTitle() {
  if (currentView === "allCases") {
    return '<span class="icon" style="cursor:pointer;" onclick="showHome()">&#x2190;</span> All Cases';
  }
  return '<span class="icon">&#x2696;</span>' + (window.shopName || "KS");
}

var defaultVisibleCols = {
  sr: true,
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
var visibleCols = JSON.parse(
  localStorage.getItem("ks_visibleCols") || JSON.stringify(defaultVisibleCols),
);
function isColVisible(id) {
  return visibleCols[id] !== false;
}
function toggleCol(id) {
  visibleCols[id] = !visibleCols[id];
  localStorage.setItem("ks_visibleCols", JSON.stringify(visibleCols));
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
    ' onchange="toggleCol(\'sr\')" style="margin-right:6px;">SR</label>' +
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
    '<a class="sidebar-item" onclick="handleMenuAction(\'addNew\')" role="button">' +
    '<i class="fas fa-plus-circle"></i> Add New Case' +
    "</a>" +
    '<a class="sidebar-item" onclick="handleMenuAction(\'allCases\')" role="button">' +
    '<i class="fas fa-list-ul"></i> All Cases' +
    "</a>" +
    '<a class="sidebar-item" onclick="handleMenuAction(\'checkNewData\')" role="button">' +
    '<i class="fas fa-sync-alt"></i> Check New Data' +
    "</a>" +
    '<a class="sidebar-item" onclick="handleMenuAction(\'clearAllData\')" role="button">' +
    '<i class="fas fa-trash"></i> Clear All Data' +
    "</a>" +
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
    '" class="form-control-premium" style="width:140px;">' +
    "</div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium mb-1" for="dateTo">To</label>' +
    '<input type="date" id="dateTo" value="' +
    today +
    '" class="form-control-premium" style="width:auto;">' +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div id="casesContainer" class="animate-fade-in-up"></div>';

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
    console.log("📥 Refresh:", response);
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

window.hndlRspo96 = function (response){
   handl_ks_rspons(response);
   loadDataFromDB();
  renderTable();

}

window.toggleColVisPanel = function () {
  var panel = document.getElementById("colVisPanel");
  if (panel) {
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  }
};

document.addEventListener("click", function (e) {
  var panel = document.getElementById("colVisPanel");
  var btn = document.getElementById("colVisToggle");
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
    panel.style.display = "none";
  }
});

console.log("✅ ks.js ready - Premium Design");
