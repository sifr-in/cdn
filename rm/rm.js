const tblsRequired = [ "f", "fp", "c", "rm", "r", "rb", "rc"];
const moduLst = [
  //{ a: ",3,79,80", mi: ",36,", b: "entInd entity/individual", c: "fa-user", d: "entind", e: "#064ebb" },
  { a: ",85,115,", mi: ",44,", b: "Dashboard", c: "fa-chart-line", d: "home", e: "#0d6efd" },
  { a: ",106,", mi: ",106,", b: "Manage Rooms", c: "fa-bed", d: "rooms", e: "#198754" },
  //{ a: ",106,", mi: ",106,", b: "Add Room", c: "fa-plus-circle", d: "addRoom", e: "#20c997" },
  { a: ",106,112,114,103,", mi: ",106,112,114,", b: "New Booking", c: "fa-calendar-plus", d: "booking", e: "#dc3545" },
  { a: ",112,114,", mi: ",112,114,", b: "Restaurant", c: "fa-utensils", d: "restaurant", e: "#fd7e14" },
  { a: ",112,114,111,", mi: ",112,114,111,", b: "Reviews", c: "fa-star", d: "reviews", e: "#ffc107" },
  { a: ",51,", mi: ",51,", b: "Publish App", c: "fa-gear", d: "Publish App", e: "#6c757d" }
];
window[my1uzr.worknOnPg].moduLst = moduLst;
moduLst.hook = "onModuLstAllowed";
window[my1uzr.worknOnPg].onModuLstAllowed = function (allowedModules) {
    window[my1uzr.worknOnPg].allowedModulesMenuItems = allowedModules || [];
};

window[my1uzr.worknOnPg].flsht = 3;
window[my1uzr.worknOnPg].flshu = "";
window[my1uzr.worknOnPg].lodErrMs = "press back & open the app again;";
window[my1uzr.worknOnPg].emptBodyMs =
  "Welcome to Hotel Shri Vimaleshwar Executive;";
window[my1uzr.worknOnPg].colsToHide = "n,";
window[my1uzr.worknOnPg].dtFormat = "dd-mm-yyyy";
window[my1uzr.worknOnPg].shodateofberthForEi = 1;

/* ============================================================
   PHONEPE payload handover
   ------------------------------------------------------------
   After a COMPLETED payment phonepe/redirect.php redirects here
   as ?pp=OK&oid=...&data=<urlencoded JSON payload>. Read it up
   front so it survives the query-string cleanup done later by
   handlePhonePeReturn() (booking.js), then expose it to
   showPhonePePostData().
   ============================================================ */
window.ppPostData = null;
(function capturePhonePePostData() {
  try {
    var raw = new URLSearchParams(window.location.search).get("data");
    if (raw) window.ppPostData = JSON.parse(raw);
  } catch (e) {
    window.ppPostData = null;
  }
})();

async function showPhonePePostData() {
  var data = window.ppPostData;
  if (!data) return false;
  window.ppPostData = null;
  try {
    history.replaceState({}, "", window.location.pathname + window.location.hash);
    clearPayload0();
    payload0.x1 = data.orderId;
    payload0.fn = 116;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "rb" },{ tb: "r" }]);
    var resp = await fnj3("https://my1.in/3/c.php", payload0, 1, true, null, 20000, 0, 1, 1);
    if (resp && resp.su == 1) {
      await handl_rm_rspons(resp);
      await adminLoadDataFromDB();
      try {
        if (
          typeof dbDexieManager !== "undefined" &&
          typeof dbnm !== "undefined" &&
          typeof buildMyBookingAll === "function"
        ) {
          var dbBk = (await dbDexieManager.getAllRecords(dbnm, "rb")) || [];
          var dbRc = (await dbDexieManager.getAllRecords(dbnm, "rc")) || [];
          myBookingAll = buildMyBookingAll(dbBk, dbRc);
        }
      } catch (e) {
        console.warn("Failed to reload bookings after payment:", e);
      }
      my1PageLoader(true);
      setTimeout(function () {
        printMyBookingById(resp?.x1);
        my1PageLoader(false);
      }, 2000);
    } else {
      showMessageModal("Error", resp?.ms || "Failed", true);
    }
  } catch (err) {
    showMessageModal("Info", "Error: " + err?.message || err, false);
  }

  console.log("📦 PhonePe payload received:", data);
  console.log("📦 Sifr payload received:", resp);
  return true;
}
(async function () {
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
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fbf62ad/cmn/my1lo.js",
        c: "open_shoLgnO",
        r: "open_shoLgnO",
      },
      { a: 5, u: "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
      {
        a: 8,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/my1xi.min.js",
      },
      {
        a: 9,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fbf62ad/cmn/my1lp.js",
        //u: "my1lp.js",
        c: "open_shoLgnP",
        r: "open_shoLgnP",
      },
      {
        a: 30,
        u: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
        r: " ",
      },
      {
        a: 31,
        u: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
        r: " ",
      },
      {
        a: 24,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@e5844db/rm/bill.js",
        //u: "git/bill.js",
        c: "showBill,closeBill",
        r: " ",
      },
      {
        a: 22,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/messageModal.js",
        c: "showMessageModal,showModal",
        r: " ",
      },
      {
        a: 21,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@e5844db/rm/rm_h.js",
        //u: "git/rm_h.js",
        c: "handl_rm_rspons",
        r: " ",
      },
      {
        a: 25,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@25415a1/cmn/conta.js",
        //u: "git/conta.js",
        c: "showContactModal",
        r: " ",
      },
      {
        a: 20,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@e5844db/rm/booking.js",
        //u: "git/booking.js",
        c: "openSummarySheet,calcBooking",
        r: " ",
      },
      {
        a: 35,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1236a32/cmn/my1img.js",
        c: "open_addimage",
        r: "open_addimage",
      },
      {
        a: 36,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/cmn/ei.min.js",
        c: "open_entind_crud",
        r: "open_entind_crud",
      },
      // fn 40 removed — admin.js merged into ht.js
      {
        a: 41,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/sidebar.js",
        c: "handleMenuAction,toggleSidebar",
        r: " ",
      },
      {
        a: 42,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/availability.js",
        c: "calcNights,calcTotal,getRoomAvailability,getRoomById",
        r: " ",
      },
      {
        a: 43,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/cfgMt.js",
        c: "htGetById,htRoomTypeLabel,htRoomStatusLabel,htRoomName,htBedLabels,htAmenityLabels,htRoomOccupancy,htRoomRate,htRoomImage",
        r: " ",
      },
      {
        a: 44,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@e5844db/rm/home.js",
        //u: "git/home.js",
        c: "showDashboard,renderTable",
        r: " ",
      },
      {
        a: 46,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@e5844db/rm/adminBooking.js",
        //u: "git/adminBooking.js",
        c: "openBookingModal,saveBooking",
        r: " ",
      },
      {
        a: 47,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/restaurant.js",
        c: "showRestaurant",
        r: " ",
      },
      {
        a: 49,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/reviews.js",
        c: "showReviews,openReviewModal,submitReview",
        r: " ",
      },
      {
        a: 50,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/addRoom.js",
        c: "showAddRoom,setAddRoomHero,updateThumb,publishAddRoom,resetAddRoomForm,editRoom",
        r: " ",
      },
      {
        a: 51,
        u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/rm_da.js",
        c: "showPrintSettings",
        r: " ",
      },
      { "a": 52, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b7740c3/cmn/my1ctr.js", "c": "open_my1ctr", "r": "open_my1ctr" },
      { "a": 53, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fcbc516/cmn/my1rp.js", "c": "open_my1rp", "r": "open_my1rp" },
      { "a": 106, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/addRoom.js", "c": "showAddRoom,setAddRoomHero,updateThumb,publishAddRoom,resetAddRoomForm,editRoom", "r": " " },
      { "a": 112, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@e5844db/rm/adminBooking.js", "c": "openBookingModal,saveBooking", "r": " " },
      //{ "a": 112, "u": "git/adminBooking.js", "c": "openBookingModal,saveBooking", "r": " " },
      { "a": 114, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/restaurant.js", "c": "showRestaurant", "r": " " },
      { "a": 111, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/reviews.js", "c": "showReviews,openReviewModal,submitReview", "r": " " },
    ];
  }

  try {
    console.log("🚀 Starting HT - Hotel Shri Vimaleshwar Executive...");

    let result1 = await loadCshScriptsSequentially(1, 2, 3, 4, 5, 8, 30, 31);
    if (!result1.success)
      throw new Error("Failed to load required scripts: " + result1.error);

    console.log("📦 Creating database tables for:", dbnm);
    try {
      const createResult = await dbDexieManager.handleNwTables(
        "loader",
        dbnm,
        tblsRequired,
      );
      var tblFailureCount = createResult.failureCount;
      console.log(
        "✅ Database initialized:",
        dbnm,
        "| Failure count:",
        createResult.failureCount,
      );
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
    }

  var hook = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg][moduLst.hook];
  var existing = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].allowedModulesMenuItems;
  var missing =
    typeof existing === 'undefined' ||
    existing === null ||
    existing === '' ||
    (Array.isArray(existing) && existing.length === 0);
  if (typeof hook === 'function' && missing) {
    try {
      var permitted = await chkModuLstAgainstFNF(moduLst);
      hook(permitted);
    } catch (e) {
      console.warn('failed to resolve allowed modules menu items', e);
    }
  }

    console.log("📦 Loading modules...");
    await loadExe2Fn(22);
    console.log("✅ messageModal loaded");
    await loadExe2Fn(21);
    console.log("✅ ht_h loaded");
    await loadExe2Fn(25);
    console.log("✅ policyContent loaded");
    await loadExe2Fn(20);
    console.log("✅ booking loaded");
    await loadExe2Fn(24);
    console.log("✅ bill loaded");

    injectHTStyles();

    // Ensure the shared room-meta helpers (htImgSrc, applyRoomLists,
    // htRoomName, htRoomRate, ...) are available, then load the config so the
    // public home can render rooms from window[my1uzr.worknOnPg].clientConfig.rm.
    if (
      typeof htImgSrc !== "function" ||
      typeof applyRoomLists !== "function"
    ) {
      try {
        await loadExe2Fn(43);
      } catch (e2) {}
    }
    if (typeof loadRoomConfig === "function") {
      await loadRoomConfig();
      applyClientConfigToPublic();
    }

    // Preload the public bookings/guests from the local DB when the user is
    // already logged in, so the home hero can show the Print / Cancel-booking
    // buttons (getMyActiveBooking needs bookingRecords populated up front).
    if (
      typeof isLoggedIn === "function" &&
      isLoggedIn() &&
      typeof ensurePublicBookingsLoaded === "function"
    ) {
      try {
        await ensurePublicBookingsLoaded();
      } catch (e) {
        console.warn("Failed to preload public bookings:", e);
      }
    }

    renderAppUI();
    console.log("✅ App UI rendered - Hotel Shri Vimaleshwar Executive");

    showPhonePePostData();

    // refreshFromServer();
  } catch (e) {
    console.error("❌ App initialization error:", e);
    document.getElementById("main_body").innerHTML =
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;">' +
      '<div style="max-width:400px;width:100%;text-align:center;background:linear-gradient(180deg,#fffdf6,#fff9ec);border:1px solid rgba(201,164,92,0.45);border-radius:20px;padding:30px;box-shadow:0 16px 44px rgba(43,36,25,0.18);">' +
      '<i class="fa-solid fa-exclamation-triangle" style="color:#a8863f;font-size:42px;margin-bottom:14px;"></i>' +
      "<h3 style=\"font-family:'Playfair Display',serif;color:#1f1b15;margin-bottom:6px;\">Error Loading App</h3>" +
      '<p style="color:#8a7c66;font-size:14px;">' +
      (e.message || e) +
      "</p>" +
      '<button class="ht-btn ht-btn-ember" onclick="location.reload()">Retry</button>' +
      "</div></div>";
  }
})();

var rszT;
window.addEventListener("resize", function () {
  clearTimeout(rszT);
  rszT = setTimeout(function () {
    if (typeof relocateSummaryPanel === "function") relocateSummaryPanel();
    if (
      window.innerWidth >= 992 &&
      typeof ensureBeCheckinField === "function"
    ) {
      ensureBeCheckinField();
    }
  }, 150);
});

/* ============================================================
   PART 2 - DESIGN SYSTEM (appcss) - injected into <head>
   ============================================================ */
appcss = `:root {
    --ember: #8a2a1b;
    --ember-dark: #6e1f12;
    --ember-deep: #57160c;
    --gold: #c9a45c;
    --gold-light: #e0c489;
    --gold-dark: #a8863f;
    --brown: #6b4a2e;
    --charcoal: #1f1b15;
    --charcoal-2: #2b2419;
    --charcoal-3: #372d20;
    --cream: #f7f0e2;
    --cream-2: #efe4cc;
    --surface: #fffdf6;
    --surface-2: #fff9ec;
    --ink: #2c241a;
    --muted: #8a7c66;
    --radius-lg: 20px;
    --radius-md: 14px;
    --radius-sm: 10px;
    --shadow-sm: 0 2px 10px rgba(43, 36, 25, 0.07);
    --shadow-md: 0 10px 30px rgba(43, 36, 25, 0.1);
    --shadow-lg: 0 16px 44px rgba(43, 36, 25, 0.18);
  }

  *, *::before, *::after { box-sizing: border-box; }

  html { scroll-behavior: smooth; }

  body {
    margin: 0;
    min-height: 100vh;
    overflow-x: clip;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--ink);
    background:
      radial-gradient(1200px 620px at 88% -12%, rgba(201, 164, 92, 0.12), transparent 60%),
      radial-gradient(900px 520px at -8% 28%, rgba(138, 42, 27, 0.07), transparent 55%),
      radial-gradient(rgba(201, 164, 92, 0.07) 1px, transparent 1.6px),
      linear-gradient(180deg, #fbf5e7 0%, #f4ead5 100%);
    background-size: auto, auto, 26px 26px, auto;
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection { background: rgba(138, 42, 27, 0.16); color: var(--ember); }

  ::-webkit-scrollbar { width: 9px; height: 9px; }
  ::-webkit-scrollbar-track { background: var(--cream-2); }
  ::-webkit-scrollbar-thumb { background: var(--charcoal-2); border-radius: 6px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--charcoal); }

  .ht-hidden { display: none !important; }

  .ht-serif { font-family: "Playfair Display", Georgia, serif; }

  /* ---- BUTTONS ---- */
  .ht-btn {
    border: none;
    border-radius: 12px;
    padding: 11px 22px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    white-space: nowrap;
  }
  .ht-btn:active { transform: translateY(0) scale(0.98); }
  .ht-btn[disabled] {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
    filter: grayscale(0.4);
  }
  .ht-btn-ember {
    background: linear-gradient(135deg, #a13a26, var(--ember-dark));
    color: #fbeedd;
    box-shadow: 0 4px 14px rgba(138, 42, 27, 0.4);
    border: 1px solid rgba(224, 196, 137, 0.35);
  }
  .ht-btn-ember:hover {
    transform: translateY(-1px);
    box-shadow: 0 7px 20px rgba(138, 42, 27, 0.5);
    color: #fff4df;
  }
  .modal-footer.ht-menu-footer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
    margin: 0;
    padding: 16px 18px 18px;
    border-top: 2px solid rgba(201, 164, 92, 0.45);
    background: linear-gradient(180deg, rgba(255, 249, 236, 0.6), transparent);
  }
  .modal-footer.ht-menu-footer > * { margin: 0; }
  button.ht-menu-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 7px;
    min-width: 0;
    padding: 11px 6px 9px;
    border-radius: 14px;
    border: 1px solid rgba(201, 164, 92, 0.35);
    background: var(--surface, #fffdf6);
    font-family: inherit;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  }
  button.ht-menu-tile .mt-ic {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: var(--mc, var(--gold-dark));
    background: rgba(201, 164, 92, 0.14);
    border: 1px solid rgba(201, 164, 92, 0.3);
  }
  button.ht-menu-tile .mt-lb {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
    line-height: 1;
    color: var(--ink, #2c241a);
  }
  button.ht-menu-tile:hover {
    transform: translateY(-2px);
    border-color: var(--mc, var(--gold));
    box-shadow: 0 6px 16px rgba(43, 36, 25, 0.14);
  }
  button.ht-menu-tile:active { transform: translateY(0) scale(0.97); }
  button.ht-menu-tile:focus-visible {
    outline: 2px solid var(--mc, var(--gold));
    outline-offset: 2px;
  }
  .modal-footer.ht-menu-footer .ht-menu-close {
    grid-column: 1 / -1;
    margin-top: 2px;
  }
  @media (min-width: 992px) {
    .modal-footer.ht-menu-footer { grid-template-columns: repeat(4, 1fr); }
  }
  .ht-btn-gold {
    background: linear-gradient(135deg, var(--gold-light), var(--gold) 55%, var(--gold-dark));
    color: #2a2010;
    box-shadow: 0 4px 14px rgba(201, 164, 92, 0.45);
  }
  .ht-btn-gold:hover {
    transform: translateY(-1px);
    box-shadow: 0 7px 20px rgba(201, 164, 92, 0.55);
    color: #1f180a;
  }
  .ht-btn-ghost {
    background: transparent;
    border: 1px solid rgba(201, 164, 92, 0.55);
    color: var(--gold);
  }
  .ht-btn-ghost:hover { background: rgba(201, 164, 92, 0.1); color: var(--gold-light); }

  .ht-book-now { margin-top: 16px; }

  /* ---- NAVBAR ---- */
  .ht-nav {
    position: sticky;
    top: 0;
    z-index: 1030;
    background: linear-gradient(160deg, #241d12, #1b1711 60%, #201a11);
    border-bottom: 2px solid var(--gold);
    box-shadow: 0 6px 24px rgba(31, 27, 21, 0.35);
  }
  .ht-nav-inner { display: flex; align-items: center; gap: 14px; padding: 9px 0 6px; flex-wrap: wrap; }
  .ht-brand { display: flex; align-items: center; gap: 11px; margin-right: auto; cursor: pointer; user-select: none; flex: none; }
  .ht-brand-icon { font-size: 23px; color: var(--gold); filter: drop-shadow(0 0 6px rgba(201, 164, 92, 0.55)); }
  .ht-brand-name {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 19px;
    font-weight: 700;
    color: #fff8e7;
    letter-spacing: 0.5px;
    line-height: 1.05;
    display: block;
  }
  .ht-brand-tag { display: block; font-size: 9.5px; letter-spacing: 2.6px; color: var(--gold); text-transform: uppercase; margin-top: 2px; }
  .ht-nav-controls { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; justify-content: flex-start; min-width: 0; flex: 1 1 auto; }
  .ht-field { display: flex; flex-direction: column; gap: 3px; }
  .ht-field label, .ht-stepper label {
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #b9ae97;
    margin: 0;
    line-height: 1;
  }
  .ht-field input[type="date"] {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(201, 164, 92, 0.35);
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 13px;
    font-family: "Inter", sans-serif;
    font-weight: 500;
    color: #f3e7c9;
    outline: none;
    color-scheme: dark;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .ht-field input[type="date"]:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201, 164, 92, 0.18); }
  .ht-field input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; filter: invert(0.72) sepia(0.55) saturate(4) hue-rotate(-10deg); }
  .ht-stepper { display: flex; flex-direction: column; gap: 3px; }
  .ht-stepper .stp-row { display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: center; gap: 7px; margin: 0; }
  .ht-stepper button {
    flex: none;
    width: 31px;
    height: 31px;
    border-radius: 50%;
    border: 1px solid rgba(201, 164, 92, 0.45);
    background: rgba(255, 255, 255, 0.07);
    color: #f3e7c9;
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, transform 0.15s ease;
  }
  .ht-stepper button:hover { background: rgba(201, 164, 92, 0.22); }
  .ht-stepper button:active { transform: scale(0.9); }
  .ht-stepper .val { flex: none; min-width: 24px; text-align: center; color: #fff; font-weight: 700; font-size: 14px; }
  .ht-nav-controls > * { flex: none; }
  .ht-search-btn { padding: 11px 18px; }

  /* ---- CHILD AGE STRIP ---- */
  .ht-child-strip {
    background: linear-gradient(180deg, #241d12, #1f1a11);
    border-bottom: 1px solid rgba(201, 164, 92, 0.35);
    padding: 9px 0 11px;
  }
  .ht-child-strip .inner { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .cs-head { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; color: #f3e7c9; }
  .cs-head i { color: var(--gold); font-size: 14px; }
  .cs-note { font-size: 11px; color: #a89d7f; font-weight: 400; }
  .cs-toggle {
    margin-left: 4px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid rgba(201, 164, 92, 0.5);
    background: rgba(255, 255, 255, 0.07);
    color: var(--gold);
    font-size: 11px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .cs-ages { display: flex; align-items: flex-end; gap: 10px; flex-wrap: wrap; }
  .ht-child-strip.collapsed .cs-ages { display: none; }
  .cs-age { display: flex; flex-direction: column; gap: 4px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(201, 164, 92, 0.4); border-radius: 10px; padding: 6px 10px 8px; }
  .cs-age span { font-size: 9.5px; text-transform: uppercase; letter-spacing: 1.1px; color: #e8ddc0; }
  .cs-age select {
    background: #241d12;
    border: 1px solid rgba(201, 164, 92, 0.35);
    border-radius: 10px;
    padding: 7px 10px;
    font-size: 13px;
    color: #f7ecd0;
    outline: none;
    color-scheme: dark;
    cursor: pointer;
  }

  /* ---- HOME ---- */
  .ht-hero { padding: 26px 0 22px; text-align: center; position: relative; }
  .ht-my-booking-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .ht-my-booking-row .ht-btn {
    padding: 8px 20px;
    font-size: 13px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .ht-hero .kicker { color: var(--gold-dark); letter-spacing: 3px; font-size: 11px; text-transform: uppercase; font-weight: 600; }
  .ht-hero h1 {
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(26px, 4vw, 38px);
    font-weight: 700;
    color: var(--charcoal);
    margin: 6px 0 2px;
  }
  .ht-hero .rule {
    width: 68px;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--ember), var(--gold), transparent);
    margin: 12px auto;
  }
  .ht-hero p { color: var(--brown); font-size: 14px; margin: 0; }

  .ht-slider {
    position: relative;
    width: 100%;
    height: 420px;
    margin: 18px auto 0;
    overflow: hidden;
    border-radius: 20px;
    border: 1px solid rgba(201, 164, 92, 0.38);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(135deg, var(--charcoal-2), var(--brown));
  }
  .ht-slider .track { display: flex; height: 100%; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
  .ht-slider .slide { flex: 0 0 100%; min-width: 100%; }
  .ht-slider .slide img { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1.12); }
  .ht-slider .slide.active img { transform: scale(1); transition: transform 6s cubic-bezier(0.15, 0.75, 0.3, 1); }
  .ht-slider .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 16, 10, 0) 55%, rgba(20, 16, 10, 0.45)); pointer-events: none; z-index: 1; }
  .ht-slider .arr {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgba(20, 16, 10, 0.42);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    opacity: 0.9;
    backdrop-filter: blur(4px);
    transition: background 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
  }
  .ht-slider .arr:hover { background: rgba(20, 16, 10, 0.75); opacity: 1; transform: translateY(-50%) scale(1.08); }
  .ht-slider .arr.prev { left: 16px; }
  .ht-slider .arr.next { right: 16px; }
  .ht-slider .dots {
    position: absolute;
    bottom: 14px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 2;
  }
  .ht-slider .dots span {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }
  .ht-slider .dots span:hover { background: #fff; }
  .ht-slider .dots span.active { background: var(--gold); transform: scale(1.3); box-shadow: 0 0 10px rgba(201, 164, 92, 0.6); }
  .ht-slider .counter {
    position: absolute;
    top: 14px;
    right: 16px;
    z-index: 2;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: #fff;
    background: rgba(20, 16, 10, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
    padding: 4px 12px;
    backdrop-filter: blur(4px);
  }

  .ht-room-list { padding-bottom: 60px; display: flex; flex-direction: column; gap: 26px; }

  .ht-filter-bar {
    margin: 0 0 20px;
    padding: 11px 16px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(201, 164, 92, 0.16), rgba(201, 164, 92, 0.08));
    border: 1px solid rgba(201, 164, 92, 0.5);
    font-size: 13px;
    color: var(--brown);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .ht-filter-bar i { color: var(--gold-dark); }
  .ht-filter-bar-empty { background: rgba(138, 42, 27, 0.08); border-color: rgba(138, 42, 27, 0.35); color: var(--ember); }
  .ht-filter-bar-empty i { color: var(--ember); }
  .ht-filter-clear {
    margin-left: auto;
    background: transparent;
    border: 1px solid rgba(201, 164, 92, 0.6);
    color: var(--gold-dark);
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .ht-filter-clear:hover { background: rgba(201, 164, 92, 0.12); }

  .ht-room-card {
    background: linear-gradient(180deg, #fffdf6, #fff9ec);
    border: 1px solid rgba(201, 164, 92, 0.38);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    display: flex;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .ht-room-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
  .ht-room-img {
    flex: 0 0 46%;
    position: relative;
    overflow: hidden;
    min-height: 320px;
    background: linear-gradient(135deg, var(--charcoal-2), var(--brown));
  }
  .ht-room-img img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; transition: transform 0.6s ease; }
  .ht-room-card:hover .ht-room-img img { transform: scale(1.05); }
  .ht-ribbon {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #2a2010;
    background: linear-gradient(135deg, var(--gold-light), var(--gold));
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
  }
  .ht-chip-start {
    position: absolute;
    bottom: 14px;
    left: 14px;
    z-index: 2;
    padding: 7px 13px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: #f3e7c9;
    background: rgba(31, 27, 21, 0.82);
    border: 1px solid rgba(201, 164, 92, 0.45);
    backdrop-filter: blur(4px);
  }
  .ht-room-body { flex: 1; padding: 24px 26px; display: flex; flex-direction: column; min-width: 0; }
  .ht-room-body h2 { font-family: "Playfair Display", Georgia, serif; font-size: 24px; font-weight: 700; color: var(--charcoal); margin: 0; }
  .ht-room-body .tagline { font-family: "Playfair Display", Georgia, serif; font-style: italic; color: var(--brown); font-size: 14px; margin: 3px 0 14px; }
  .ht-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .ht-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--charcoal-2);
    background: rgba(201, 164, 92, 0.14);
    border: 1px solid rgba(201, 164, 92, 0.4);
    padding: 5px 11px;
    border-radius: 999px;
  }
  .ht-badge i { color: var(--gold-dark); font-size: 12px; }
  .ht-pills { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 18px; }
  .ht-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--brown);
    background: rgba(201, 164, 92, 0.09);
    border: 1px solid rgba(201, 164, 92, 0.3);
    padding: 4px 11px;
    border-radius: 999px;
  }
  .ht-pill i { color: var(--gold-dark); font-size: 11px; }
  .ht-card-foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding-top: 8px; }
  .ht-price { font-family: "Playfair Display", Georgia, serif; font-size: 25px; font-weight: 700; color: var(--ember); }
  .ht-price .per { font-family: "Inter", sans-serif; font-size: 12.5px; font-weight: 400; color: var(--muted); }

  /* ---- ROOM DETAILS ---- */
  .ht-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--ember);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    padding: 12px 0 16px;
    transition: color 0.2s ease, transform 0.2s ease;
    text-decoration: none;
    border: none;
    background: none;
  }
  .ht-back:hover { color: var(--gold-dark); transform: translateX(-2px); }

  .ht-gallery {
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    border: 1px solid rgba(201, 164, 92, 0.38);
    margin-bottom: 20px;
    background: var(--charcoal-2);
  }
  .ht-gallery .hero { position: relative; height: 440px; background: linear-gradient(135deg, var(--charcoal-2), var(--brown)); }
  .ht-gallery .hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ht-gallery .thumbs { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; padding: 6px; }
  .ht-gallery .thumbs img {
    height: 78px;
    width: 100%;
    object-fit: cover;
    border-radius: 10px;
    cursor: pointer;
    opacity: 0.55;
    border: 2px solid transparent;
    transition: opacity 0.2s ease, border-color 0.2s ease;
    background: var(--brown);
  }
  .ht-gallery .thumbs img:hover { opacity: 0.85; }
  .ht-gallery .thumbs img.active { opacity: 1; border-color: var(--gold); }

  .ht-section {
    background: linear-gradient(180deg, #fffdf6, #fff9ec);
    border: 1px solid rgba(201, 164, 92, 0.38);
    border-radius: 18px;
    padding: 22px 24px;
    margin-bottom: 20px;
    box-shadow: var(--shadow-sm);
  }
  .ht-section h2 {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--charcoal);
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .ht-section h2 i { color: var(--gold-dark); font-size: 16px; }
  .ht-section h2::after { content: ""; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(201, 164, 92, 0.45), transparent); }
  .ht-room-title h2 { font-size: 30px; margin-bottom: 4px; }
  .ht-room-title h2::after { display: none; }
  .ht-room-title .tagline { font-family: "Playfair Display", Georgia, serif; font-style: italic; color: var(--brown); font-size: 15px; margin-bottom: 12px; }
  .ht-desc p { color: var(--ink); font-size: 14px; line-height: 1.7; margin-bottom: 10px; }
  .ht-fac-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); gap: 10px; }
  .ht-fac {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 13px;
    border: 1px solid rgba(201, 164, 92, 0.32);
    border-radius: 12px;
    background: rgba(201, 164, 92, 0.07);
    font-size: 13px;
    color: var(--brown);
  }
  .ht-fac i { color: var(--gold-dark); font-size: 15px; width: 18px; text-align: center; flex: none; }
  .ht-pill-line { display: flex; flex-wrap: wrap; gap: 8px; }
  .ht-rules {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }
  .ht-rules li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; color: var(--ink); padding: 6px 0; }
  .ht-rules li i { color: var(--ember); margin-top: 3px; font-size: 12px; }
  .ht-rules li.ht-rules-h {
    grid-column: 1 / -1;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 700;
    font-size: 11.5px;
    letter-spacing: 1.3px;
    text-transform: uppercase;
    color: var(--ember);
    padding: 16px 0 6px;
    margin-top: 10px;
    border-top: 1px dashed rgba(201, 164, 92, 0.35);
  }
  .ht-rules li.ht-rules-h:first-child { border-top: none; margin-top: 0; padding-top: 0; }
  .ht-rules li.ht-rules-h::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--gold);
    flex: none;
    margin-top: 3px;
  }
  .ht-policies { margin-top: 2px; }

  /* Packages */
  .ht-pkg-list { display: flex; flex-direction: column; gap: 10px; }
  .ht-pkg {
    display: flex;
    align-items: center;
    gap: 13px;
    border: 2px solid rgba(201, 164, 92, 0.4);
    border-radius: var(--radius-md);
    padding: 13px 16px;
    cursor: pointer;
    background: var(--surface);
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }
  .ht-pkg:hover { border-color: var(--gold); }
  .ht-pkg.active {
    border-color: var(--ember);
    background: rgba(138, 42, 27, 0.05);
    box-shadow: 0 4px 16px rgba(138, 42, 27, 0.12);
  }
  .ht-pkg .radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--gold-dark); display: flex; align-items: center; justify-content: center; flex: none; transition: border-color 0.2s ease; }
  .ht-pkg.active .radio { border-color: var(--ember); }
  .ht-pkg.active .radio::after { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--ember); }
  .ht-pkg .nm { font-weight: 600; font-size: 14px; color: var(--ink); }
  .ht-pkg .ds { font-size: 12px; color: var(--muted); }
  .ht-pkg .pr { margin-left: auto; font-weight: 700; font-size: 13.5px; color: var(--ember); white-space: nowrap; }
  .ht-pkg .pr.free { color: var(--gold-dark); }

  /* Add-ons */
  .ht-addon-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .ht-addon {
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid rgba(201, 164, 92, 0.35);
    border-radius: var(--radius-md);
    padding: 12px 14px;
    background: var(--surface);
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    user-select: none;
  }
  .ht-addon:hover { border-color: var(--gold); }
  .ht-addon-info { cursor: default; border-style: dashed; }
  .ht-addon-info:hover { border-color: var(--gold); background: var(--surface); }
  .ht-addon-info .chk-info { border: none; width: auto; height: auto; color: var(--muted); font-size: 13px; }
  .ht-addon.active {
    border-color: var(--ember);
    background: rgba(138, 42, 27, 0.05);
    box-shadow: 0 4px 14px rgba(138, 42, 27, 0.1);
  }
  .ht-addon .ic {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(201, 164, 92, 0.16);
    color: var(--gold-dark);
    font-size: 15px;
    flex: none;
  }
  .ht-addon .tx { min-width: 0; }
  .ht-addon .nm { font-weight: 600; font-size: 13.5px; color: var(--ink); }
  .ht-addon .ds { font-size: 11.5px; color: var(--muted); line-height: 1.35; }
  .ht-addon .nm, .ht-addon .ds { overflow-wrap: anywhere; }
  .ht-addon .chk {
    margin-left: auto;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 2px solid var(--gold-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 11px;
    flex: none;
    transition: all 0.2s ease;
  }
  .ht-addon.active .chk { background: linear-gradient(135deg, #a13a26, var(--ember-dark)); border-color: var(--ember-dark); }

  /* ---- BOOKING SUMMARY ---- */
  .s-head { padding-bottom: 12px; border-bottom: 1px dashed rgba(201, 164, 92, 0.3); margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .s-hotel { font-family: "Playfair Display", Georgia, serif; font-size: 18px; font-weight: 700; color: #fff8e7; line-height: 1.15; }
  .s-room { color: var(--gold); font-size: 13px; margin-top: 2px; }
  .s-day-rates { margin-top: 4px; }
  .s-day-rate { display: flex; justify-content: space-between; font-size: 12px; padding: 2px 0; color: #b9ae97; }
  .s-day-name { }
  .s-day-price { font-weight: 600; color: #e8dfc8; }
  .s-ac-toggle { flex: none; cursor: pointer; user-select: none; }
  .s-ac-tag { flex: none; display: inline-flex; align-items: center; justify-content: center; font-family: "Playfair Display", Georgia, serif; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; padding: 9px 12px; border-radius: 999px; border: 2px solid rgba(201,164,92,.55); background: #241c10; color: #cdbf93; text-align: center; line-height: 1.15; white-space: nowrap; }
  .s-ac-tag b { color: #fff; }
  .s-ac-toggle input { position: absolute; opacity: 0; pointer-events: none; }
  .s-ac-toggle .ic { display: inline-flex; align-items: center; justify-content: center; font-family: "Playfair Display", Georgia, serif; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; padding: 9px 12px; min-width: 128px; border-radius: 999px; border: 2px solid var(--gold); background: #241c10; color: #cdbf93; transition: all 0.2s ease; text-align: center; line-height: 1.15; }
  .s-ac-toggle.on .ic { background: linear-gradient(135deg, var(--emr-dark), var(--ember-dark)); color: #fff; border-color: var(--gold); box-shadow: 0 0 14px rgba(201,164,92,.35); }
  .s-stay { font-size: 12.5px; color: #b9ae97; margin-bottom: 8px; display: flex; align-items: center; flex-wrap: wrap; gap: 7px; min-width: 0; }
  .s-stay i { color: var(--gold); }
  .s-guests { font-size: 12px; color: #c9be9f; margin-bottom: 6px; line-height: 1.6; }
  .s-guests b { color: #f3e7c9; }
  .s-rows { border-top: 1px dashed rgba(201, 164, 92, 0.3); margin-top: 6px; padding-top: 4px; }
  .s-row { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; padding: 7px 0; color: #e8dfc8; }
  .s-row .amt { white-space: nowrap; font-weight: 600; }
  .s-row.neg .amt { color: #9fd19a; }
  .s-row.s-total { border-top: 1px solid rgba(201, 164, 92, 0.4); margin-top: 8px; padding-top: 12px; font-weight: 700; color: #fff; font-size: 15px; }
  .s-row.s-total .amt { font-family: "Playfair Display", Georgia, serif; font-size: 23px; color: var(--gold-light); }
  .ht-pay-btn { width: 100%; padding: 14px; font-size: 15px; margin-top: 14px; }
  .s-note { font-size: 11px; color: #9e9478; text-align: center; margin-top: 11px; line-height: 1.45; }

  /* ---- MOBILE ---- */
  .ht-bottom-bar {
    display: none;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    width: 100%;
    z-index: 1035;
    background: linear-gradient(180deg, #2b2419, #1e180f);
    border-top: 2px solid var(--gold);
    box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.4);
    padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
    align-items: center;
    gap: 12px;
  }
  .has-details .ht-bottom-bar { display: flex; }
  .ht-bottom-bar .t { color: #ede4ce; font-size: 11px; }
  .ht-bottom-bar .tt { color: var(--gold-light); font-family: "Playfair Display", Georgia, serif; font-size: 20px; font-weight: 700; line-height: 1; }
  .ht-bottom-bar .ht-btn { margin-left: auto; padding: 12px 18px; font-size: 13.5px; }

  .ht-sheet-overlay {
    position: fixed;
    inset: 0;
    background: rgba(31, 27, 21, 0.55);
    backdrop-filter: blur(3px);
    z-index: 1040;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  .ht-sheet-overlay.open { opacity: 1; visibility: visible; }
  .ht-sheet {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1045;
    background: linear-gradient(180deg, #2b2419, #221c12);
    border-radius: 22px 22px 0 0;
    border-top: 2px solid var(--gold);
    box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.5);
    transform: translateY(105%);
    transition: transform 0.32s cubic-bezier(0.32, 0.72, 0.3, 1);
    padding: 14px 18px calc(18px + env(safe-area-inset-bottom));
    max-height: 88vh;
    overflow-y: auto;
  }
  .ht-sheet.open { transform: translateY(0); }
  #searchSheet.open .ht-sheet, #paySheet.open .ht-sheet { transform: translateY(0); }
  .sheet-handle { width: 44px; height: 4px; border-radius: 4px; background: rgba(201, 164, 92, 0.4); margin: 0 auto 12px; }
  .sheet-title { font-family: "Playfair Display", Georgia, serif; font-size: 20px; font-weight: 700; color: #fff8e7; text-align: center; margin-bottom: 14px; }
  .sheet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
  .sheet-guests { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px 12px; margin-top: 12px; }
  .sheet-guests > * { min-width: 0; }
  .sheet-apply { width: 100%; padding: 14px; margin-top: 14px; font-size: 15px; }
  .sheet-summary-inner { color: #ede4ce; }

  /* ---- MODAL ---- */
  .ht-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(31, 27, 21, 0.6);
    backdrop-filter: blur(3px);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.25s ease, visibility 0.25s ease;
  }
  .ht-modal-overlay.open { opacity: 1; visibility: visible; }
  .ht-modal {
    background: linear-gradient(180deg, #fffdf6, #f6ebd2);
    border-radius: 22px;
    max-width: 440px;
    width: 100%;
    border: 1px solid rgba(201, 164, 92, 0.5);
    border-top: 4px solid var(--gold);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    padding: 26px;
    transform: translateY(14px) scale(0.98);
    transition: transform 0.25s ease;
    max-height: 90vh;
    overflow-y: auto;
  }
  .ht-modal-overlay.open .ht-modal { transform: none; }
  .m-ic {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin: 0 auto 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: linear-gradient(135deg, var(--gold-light), var(--gold));
    color: #2a2010;
    box-shadow: 0 8px 20px rgba(201, 164, 92, 0.45);
  }
  .ht-modal h3 { font-family: "Playfair Display", Georgia, serif; text-align: center; color: var(--charcoal); margin-bottom: 4px; }
  .m-sub { text-align: center; color: var(--muted); font-size: 13px; margin-bottom: 4px; }
  .m-rows { margin-top: 16px; border: 1px solid rgba(201, 164, 92, 0.4); border-radius: var(--radius-md); overflow: hidden; }
  .m-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    font-size: 13.5px;
    color: var(--ink);
    background: rgba(255, 255, 255, 0.5);
    border-bottom: 1px solid rgba(201, 164, 92, 0.2);
  }
  .m-row:last-child { border-bottom: none; }
  .m-row .k { color: var(--brown); }
  .m-row .v { font-weight: 600; text-align: right; }
  .m-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background: linear-gradient(135deg, var(--ember), var(--ember-dark));
    color: #fbeedd;
    font-weight: 700;
    font-size: 15px;
  }
  .m-total .amt { font-family: "Playfair Display", Georgia, serif; font-size: 23px; color: var(--gold-light); }
  .m-btn { width: 100%; padding: 14px; font-size: 15px; margin-top: 16px; }
  .m-note { font-size: 11.5px; color: var(--muted); text-align: center; margin-top: 12px; line-height: 1.5; }

  /* ---- BILL MODAL ---- */
  .ht-bill-overlay {
    position: fixed;
    inset: 0;
    background: rgba(31, 27, 21, 0.66);
    backdrop-filter: blur(4px);
    z-index: 1049;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.25s ease, visibility 0.25s ease;
  }
  .ht-bill-overlay.open { opacity: 1; visibility: visible; }
  .ht-bill-stage {
    max-width: 860px;
    width: 100%;
    max-height: 92vh;
    display: flex;
    flex-direction: column;
    background: transparent;
  }
  .ht-bill-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    border-radius: 18px 18px 0 0;
    background: #ffffff;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
  }
  .ht-bill-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px;
    background: linear-gradient(180deg, #2b2419, #201a11);
    border: 1px solid rgba(201, 164, 92, 0.45);
    border-top: none;
    border-radius: 0 0 18px 18px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  }
  .ht-bill-actions .ht-btn { flex: 1; padding: 13px; font-size: 14px; }
  .ht-bill-actions .ht-btn-ghost { background: rgba(255, 255, 255, 0.07); border-color: rgba(201, 164, 92, 0.4); color: #f3e7c9; }
  .ht-bill {
    width: 794px;
    max-width: 100%;
    margin: 0 auto;
    background: #fffdf8;
    color: #2c241a;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .ht-bill-top {
    background:
      radial-gradient(700px 220px at 90% -40%, rgba(224, 196, 137, 0.22), transparent 60%),
      linear-gradient(135deg, #2b2419, #201a11 70%, #1b1711);
    color: #fff8e7;
    padding: 28px 36px 24px;
    position: relative;
    overflow: hidden;
  }
  .ht-bill-top::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--ember), var(--gold), var(--ember));
  }
  .ht-bill-brand { display: flex; align-items: center; gap: 16px; }
  .ht-bill-logo {
    width: 62px;
    height: 62px;
    border-radius: 16px;
    flex: none;
    object-fit: cover;
    background: #1f1b15;
    border: 1px solid rgba(201, 164, 92, 0.6);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  }
  .ht-bill-logo-icon {
    width: 62px;
    height: 62px;
    border-radius: 16px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    color: var(--gold);
    background: #1f1b15;
    border: 1px solid rgba(201, 164, 92, 0.6);
  }
  .ht-bill-name {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 25px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: 0.3px;
  }
  .ht-bill-tag {
    font-size: 10.5px;
    letter-spacing: 2.6px;
    text-transform: uppercase;
    color: var(--gold);
    margin-top: 3px;
  }
  .ht-bill-city { font-size: 12px; color: #b9ae97; margin-top: 2px; }
  .ht-bill-meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    padding: 22px 36px 18px;
    border-bottom: 1px dashed rgba(201, 164, 92, 0.45);
  }
  .ht-bill-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ember);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ht-bill-title i { color: var(--gold-dark); font-size: 18px; }
  .ht-bill-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #2a2010;
    background: linear-gradient(135deg, var(--gold-light), var(--gold));
    border-radius: 999px;
    padding: 5px 12px;
    margin-top: 8px;
  }
  .ht-bill-status-ok {
    background: linear-gradient(135deg, #4caf7d, #2e7d32);
    color: #ffffff;
  }
  .ht-bill-meta .cols { text-align: right; font-size: 12.5px; line-height: 1.9; }
  .ht-bill-meta .cols b { color: var(--ink); }
  .ht-bill-meta .cols span { color: var(--muted); }
  .ht-bill-body { padding: 20px 36px 10px; }
  .ht-bill-stay {
    display: flex;
    gap: 18px;
    border: 1px solid rgba(201, 164, 92, 0.4);
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    box-shadow: var(--shadow-sm);
    margin-bottom: 20px;
  }
  .ht-bill-stay-info { flex: 1; padding: 14px 18px; min-width: 0; }
  .ht-bill-room {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--charcoal);
  }
  .ht-bill-room-sub { font-size: 11.5px; color: var(--muted); margin: 2px 0 10px; }
  .ht-bill-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px 12px;
  }
  .ht-bill-cell { background: rgba(201, 164, 92, 0.08); border: 1px solid rgba(201, 164, 92, 0.25); border-radius: 10px; padding: 8px 10px; }
  .ht-bill-cell .lb { font-size: 9.5px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }
  .ht-bill-cell .vl { font-size: 13px; font-weight: 600; color: var(--ink); margin-top: 2px; }
  .ht-bill-table { width: 100%; border-collapse: collapse; font-size: 13.5px; margin-top: 6px; }
  .ht-bill-table th {
    text-align: left;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--muted);
    border-bottom: 2px solid rgba(201, 164, 92, 0.5);
    padding: 8px 10px;
  }
  .ht-bill-table th.amt { text-align: right; }
  .ht-bill-table td { padding: 10px; border-bottom: 1px solid rgba(201, 164, 92, 0.18); color: var(--ink); }
  .ht-bill-table td.amt { text-align: right; font-weight: 600; white-space: nowrap; }
  .ht-bill-table tr.neg td.amt { color: #2e7d32; }
  .ht-bill-table tr.total td {
    background: linear-gradient(135deg, var(--ember), var(--ember-dark));
    color: #fbeedd;
    font-weight: 700;
    font-size: 14.5px;
    border-bottom: none;
  }
  .ht-bill-table tr.total td.amt {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 22px;
    color: var(--gold-light);
  }
  .ht-bill-table tr.total.ht-paid td {
    background: linear-gradient(135deg, #d9f3df, #c5ecd0) !important;
    color: #14532d;
  }
  .ht-bill-table tr.total.ht-paid td.amt { color: #14532d; }
  .ht-paid-badge {
    display: inline-block;
    margin-left: 6px;
    padding: 2px 10px;
    border-radius: 999px;
    background: #27ae60;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.6px;
    vertical-align: middle;
  }
  .ht-bill-table tr.rem td {
    font-weight: 700;
    border-top: 2px dashed rgba(201, 164, 92, 0.4);
  }
  .ht-bill-table tr.rem.ht-rem-ok td {
    background: #d9f3df;
    color: #14532d;
  }
  .ht-bill-foot {
    padding: 14px 36px 30px;
    border-top: 1px dashed rgba(201, 164, 92, 0.4);
    margin-top: 18px;
  }
  .ht-bill-thanks {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 15px;
    color: var(--ember);
    font-style: italic;
    margin-bottom: 8px;
  }
  .ht-bill-note { font-size: 11.5px; color: var(--muted); line-height: 1.6; }
  .ht-bill-note b { color: var(--brown); }
  .ht-bill-proforma { font-size: 10.5px; color: #a9987a; line-height: 1.6; margin-top: 12px; }
  @media (max-width: 640px) {
    .ht-bill-grid { grid-template-columns: repeat(2, 1fr); }
    .ht-bill-meta { flex-direction: column; gap: 8px; }
    .ht-bill-meta .cols { text-align: left; }
  }

  /* ---- MY BOOKINGS LIST MODAL ---- */
  .ht-mybook-scroll {
    background: #fffdf8;
    padding: 0 0 6px;
  }
  .ht-mybook-head {
    padding: 24px 24px 8px;
    text-align: center;
    border-bottom: 1px dashed rgba(201, 164, 92, 0.4);
  }
  .ht-mybook-head .ht-bill-title { font-size: 18px; }
  .ht-mybook-head .ht-bill-status { margin-top: 10px; }
  .ht-mybook-guest { font-size: 12.5px; color: var(--muted); margin-top: 6px; }
  .ht-mybook-guest b { color: var(--gold-dark); }
  .ht-mybook-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 18px 24px 24px;
    max-width: 860px;
    margin: 0 auto;
  }
  .ht-mybook-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px;
    background: #ffffff;
    border: 1px solid rgba(201, 164, 92, 0.4);
    border-radius: 14px;
    box-shadow: var(--shadow-sm);
  }
  .ht-mybook-card .mbc-top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 8px 12px;
  }
  .ht-mybook-card .mbc-room {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 15.5px;
    font-weight: 700;
    color: var(--charcoal);
  }
  .ht-mybook-card .mbc-room i { color: var(--gold-dark); font-size: 13px; }
  .ht-mybook-card .mbc-total {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .ht-mybook-card .mbc-total .lb {
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    font-size: 10px;
  }
  .ht-mybook-card .mbc-total .vl {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 19px;
    color: var(--ember-dark);
    font-weight: 700;
  }
  .ht-mybook-card .mbc-sub {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    border-top: 1px dashed rgba(201, 164, 92, 0.35);
    padding-top: 10px;
  }
  .ht-mybook-card .mbc-meta {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.5;
  }
  .ht-mybook-card .mbc-tools {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  .ht-mybook-card .mbc-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    color: #8a6d2f;
    background: rgba(201, 164, 92, 0.14);
    border: 1px solid rgba(201, 164, 92, 0.5);
    border-radius: 999px;
    padding: 5px 11px;
  }
  .ht-mybook-card .mbc-badge.ok {
    background: linear-gradient(135deg, #4caf7d, #2e7d32);
    border-color: #2e7d32;
    color: #ffffff;
  }
  .ht-mybook-card .mbc-badge.no { background: #fdecea; color: #b23a3a; border-color: #e8b4a6; }
  .ht-mybook-card .ht-btn { padding: 8px 14px; font-size: 12.5px; }
  .ht-mybook-card .ht-mybook-pay { flex: none; }
  .ht-mybook-empty { text-align: center; padding: 40px 20px 50px; color: var(--muted); }
  .ht-mybook-empty i { font-size: 34px; color: var(--gold); margin-bottom: 10px; display: block; }

  /* ---- BILL: summaryHtml overrides (light background) ---- */
  .ht-bill-body .s-head { border-bottom-color: rgba(201, 164, 92, 0.35); }
  .ht-bill-body .s-hotel { color: #2c241a; }
  .ht-bill-body .s-room { color: #8a6d2f; }
  .ht-bill-body .s-ac-tag { background: #faf3e3; color: #8a6d2f; border-color: #c9a45c; }
  .ht-bill-body .s-ac-tag b { color: #8a5a2b; }
  .ht-bill-body .s-day-rate { color: #7a6e5a; }
  .ht-bill-body .s-day-price { color: #3a2a1a; }
  .ht-bill-body .s-stay { color: #6b5d4d; }
  .ht-bill-body .s-stay i { color: #8a6d2f; }
  .ht-bill-body .s-guests { color: #5a4d3d; }
  .ht-bill-body .s-guests b { color: #3a2a1a; }
  .ht-bill-body .s-rows { border-top-color: rgba(201, 164, 92, 0.35); }
  .ht-bill-body .s-row { color: #3a2a1a; }
  .ht-bill-body .s-row.neg .amt { color: #2e7d32; }
  .ht-bill-body .s-row.s-total { border-top-color: rgba(201, 164, 92, 0.5); color: #1a1208; }
  .ht-bill-body .s-row.s-total .amt { color: #8a5a2b; }

  /* ---- ANIMATIONS ---- */
  @keyframes htFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .ht-fade-up { animation: htFadeUp 0.35s ease both; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    html { scroll-behavior: auto; }
  }

  /* ---- RESPONSIVE ---- */
  @media (max-width: 1199.98px) {
    .ht-nav-inner { gap: 10px; }
    .ht-nav-controls { gap: 8px; }
    .ht-brand-name { font-size: 16px; }
    .ht-field input[type="date"] { padding: 7px 8px; font-size: 12px; }
    .ht-stepper button { width: 28px; height: 28px; }
    .ht-search-btn { padding: 11px 12px; }
  }
  @media (max-width: 991.98px) {
    .ht-nav-inner { padding: 8px 0 7px; row-gap: 7px; }
    .ht-brand { gap: 8px; }
    .ht-brand-icon { font-size: 19px; }
    .ht-brand-name { font-size: 16px; }
    .ht-brand-tag { display: none; }
    .ht-nav-controls { flex: 1 1 100%; align-items: flex-end; gap: 6px 10px; border-top: 1px solid rgba(201, 164, 92, 0.18); padding-top: 7px; }
    .ht-nav-controls .ht-field { flex: 1 1 0; min-width: 0; }
    .ht-field { gap: 2px; }
    .ht-field label, .ht-stepper label { font-size: 8.5px; letter-spacing: 1px; }
    .ht-field input[type="date"] { width: 100%; padding: 5px 8px; font-size: 11.5px; }
    .ht-stepper .stp-row { gap: 5px; }
    .ht-stepper button { width: 25px; height: 25px; font-size: 10px; }
    .ht-stepper .val { min-width: 19px; font-size: 12.5px; }
    .ht-search-btn { margin-left: auto; padding: 0; width: 36px; height: 36px; justify-content: center; font-size: 12px; }
    .ht-search-label { display: none; }
    .ht-slider { width: 100%; min-height: 0; height: 240px; border-radius: 16px; }
    .ht-room-card { flex-direction: column; }
    .ht-room-img { flex: none; min-height: 0; height: 240px; }
    .ht-gallery .hero { height: 300px; }
    body.has-details { padding-bottom: 96px; }
  }
  @media (min-width: 992px) {
    .has-details .ht-bottom-bar { display: none; }
    .ht-nav-inner, .ht-nav-controls { flex-wrap: nowrap; }
    #summaryHost .ht-sheet {
      position: sticky;
      top: 96px;
      left: auto;
      right: auto;
      bottom: auto;
      transform: none;
      transition: none;
      width: 100%;
      border-radius: 18px;
      border-top: 3px solid var(--gold);
      box-shadow: 0 14px 40px rgba(31, 27, 21, 0.35);
      max-height: calc(100vh - 132px);
    }
    #summaryHost .sheet-handle { display: none; }
  }
  @media (max-width: 767.98px) {
    .ht-hero { padding: 20px 0 18px; }
    .ht-room-body { padding: 18px 18px 20px; }
    .ht-gallery .hero { height: 250px; }
    .ht-gallery .thumbs { grid-template-columns: repeat(5, 1fr); }
    .ht-gallery .thumbs img { height: 58px; }
    .ht-fac-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .ht-fac { padding: 9px 10px; font-size: 12px; gap: 8px; }
    .ht-fac i { font-size: 13px; }
    .ht-rules { grid-template-columns: 1fr; }
    .ht-addon-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .ht-addon { padding: 8px 10px; gap: 8px; }
    .ht-addon .ic { width: 30px; height: 30px; border-radius: 9px; font-size: 12px; }
    .ht-addon .nm { font-size: 12px; }
    .ht-addon .ds { font-size: 10.5px; line-height: 1.3; }
    .ht-addon .chk { width: 22px; height: 22px; font-size: 9px; }
    .ht-section { padding: 18px; }
  }
  @media (max-width: 479.98px) {
    .ht-brand-name { font-size: 15px; }
    .ht-brand-icon { font-size: 17px; }
    .ht-stepper button { width: 24px; height: 24px; font-size: 9.5px; }
    .ht-search-btn { width: 34px; height: 34px; }
  }

  /* ---- FOOTER ---- */
  .ht-footer {
    background: linear-gradient(160deg, #241d12, #1b1711 60%, #201a11);
    border-top: 2px solid var(--gold);
    padding: 28px 0 20px;
    color: #b9ae97;
    font-size: 13px;
  }
  .ht-footer-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .ht-footer-brand { font-family: "Playfair Display", Georgia, serif; font-size: 17px; font-weight: 700; color: #fff8e7; }
  .ht-footer-tag { font-size: 10px; letter-spacing: 2.4px; color: var(--gold); text-transform: uppercase; margin-top: 2px; text-align: center; }
  .ht-footer-contact { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 8px 28px; width: 100%; }
  .ht-footer-contact-item { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; }
  .ht-footer-contact-item i { color: var(--gold); font-size: 12px; width: 14px; text-align: center; }
  .ht-footer-c-label { color: var(--gold); font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; }
  .ht-footer-c-value { color: #d9cfb8; }
  .ht-footer-links { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .ht-footer-links a {
    color: var(--gold-light);
    text-decoration: none;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 8px;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .ht-footer-links a:hover { background: rgba(201, 164, 92, 0.12); color: #fff; }
  .ht-footer-sep { color: #5a4e3a; font-size: 10px; }
  .ht-footer-copy { font-size: 11px; color: #6b5e4a; margin-top: 4px; }

  /* ---- POLICY VIEW ---- */
  .ht-policy-view {
    width: 100%;
    padding: 32px 40px 60px;
  }
  .ht-policy-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 8px;
  }
  .ht-policy-header i {
    font-size: 28px;
    color: var(--gold);
  }
  .ht-policy-header h1 {
    margin: 0;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--charcoal);
  }
  .ht-policy-date {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 24px;
  }
  .ht-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
    padding: 8px 16px;
    border: 1px solid rgba(201, 164, 92, 0.45);
    border-radius: 10px;
    background: transparent;
    color: var(--gold);
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .ht-back-btn:hover { background: rgba(201, 164, 92, 0.1); color: var(--gold-light); }
  .ht-policy-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .ht-policy-section {
    background: var(--surface);
    border: 1px solid rgba(201, 164, 92, 0.2);
    border-radius: var(--radius-md);
    padding: 22px 24px;
    box-shadow: var(--shadow-sm);
  }
  .ht-policy-section h3 {
    margin: 0 0 10px;
    font-size: 15px;
    font-weight: 700;
    color: var(--charcoal);
  }
  .ht-policy-section p {
    margin: 0;
    font-size: 13.5px;
    line-height: 1.7;
    color: var(--ink);
  }

  /* ---- SHOW MORE TOGGLE ---- */
  .ht-toggle-rules { margin-top: 14px; width: 100%; }
  .ht-rules-extra.ht-hidden { display: none !important; }

  /* ---- PROFILE MODAL ---- */
  .ht-profile-dialog { max-width: 420px; }
  .ht-profile-dialog .modal-content { min-height: 340px; }
  @media (min-width: 992px) {
    .ht-profile-dialog { max-width: 500px; }
    .ht-profile-dialog .modal-content { min-height: 380px; }
  }
  @media (max-width: 479.98px) {
    .ht-profile-dialog { max-width: 92vw; }
    .ht-profile-dialog .modal-content { min-height: 300px; }
  }
  @media (max-width: 991.98px) {
    .ht-policy-view { padding: 28px 24px 50px; }
  }
  @media (max-width: 767.98px) {
    .ht-policy-grid { grid-template-columns: 1fr; }
    .ht-policy-view { padding: 24px 20px 50px; }
    .ht-footer-contact { flex-direction: column; align-items: center; gap: 8px; }
  }
  @media (max-width: 479.98px) {
    .ht-policy-view { padding: 20px 16px 50px; }
    .ht-policy-header h1 { font-size: 21px; }
    .ht-policy-section { padding: 16px 18px; }
    .ht-footer-links { flex-direction: column; gap: 4px; }
    .ht-footer-sep { display: none; }
  }`;

function injectHTStyles() {
  var tag = document.getElementById("htCss");
  if (tag) return;
  var s = document.createElement("style");
  s.id = "htCss";
  s.textContent = appcss;
  document.head.appendChild(s);
}

var IMG_FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#2b2419"/><stop offset="1" stop-color="#6b4a2e"/>' +
      "</linearGradient></defs>" +
      '<rect width="1400" height="900" fill="url(#g)"/>' +
      '<text x="700" y="490" font-size="120" fill="#c9a45c" text-anchor="middle" font-family="Georgia">\u2726</text>' +
      "</svg>",
  );

var MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* KS-style module globals shared across core, menu and modules. */
var hotel = null;
var roomRecords = [];
var packageRecords = [];
var addonRecords = [];
var policies = {};

var currentView = "home";
var roomId = null;
var heroIdx = 0;

var checkIn = "";
var checkOut = "";
var adults = 0;
var children = 0;
var childAges = [];

var packageId = null;
var addonIds = [];

var chargeWithAc = false;

var childStripOpen = true;
var lastSnap = null;

var roomFilterActive = false;
var roomAvailFilter = false;

/* ============================================================
   PART 4 - UTILITY FUNCTIONS
   ============================================================ */
function el(id) {
  return document.getElementById(id);
}

function escHtml(s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtMoney(n) {
  n = Math.round(Number(n) || 0);
  var sym = (hotel && hotel.symbol) || "\u20B9";
  return sym + " " + n.toLocaleString("en-IN");
}

// Amount with at most 2 digits after the decimal point (number, trailing
// zeros trimmed). Use for displaying stored/computed amounts in views.
function fmtAmt(n) {
  return +(Number(n) || 0).toFixed(2);
}

function parseDate(s) {
  var m = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  return new Date(NaN);
}

function dateStrFrom(d) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

function todayStr() {
  return dateStrFrom(new Date());
}

function addDays(dateStr, n) {
  var d = parseDate(dateStr);
  d.setDate(d.getDate() + n);
  return dateStrFrom(d);
}

function nightsBetween(a, b) {
  return Math.round((parseDate(b) - parseDate(a)) / 86400000);
}

function fmtDate(s) {
  var d = parseDate(s);
  return d.getDate() + " " + MONTHS[d.getMonth()];
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function imgFail(img) {
  if (!img || img.dataset.fb) return;
  img.dataset.fb = "1";
  img.src = IMG_FALLBACK;
}

function stripKey(o) {
  if (!o) return o;
  var c = {};
  for (var k in o) {
    if (k !== "id" && k !== "tb") c[k] = o[k];
  }
  return c;
}

// Standard JSON envelope for a booking's facility-charges column (zrb.l):
//   { "l": [{a: facilityId, b: perNightRate}, ...],
//     "ado": [{a: facilityId, b: perNightRate}, ...],   selected add-ons
//     "adt": [{a: facilityId, b: flatAmount}, ...]       selected adtnolChrgs }
// b semantics: core charges (l) and add-ons (ado) are PER-NIGHT rates; the
// amount actually charged is rate x nights. Additional charges (adt) are flat
// amounts shown directly. ado/adt are always emitted (empty arrays when none
// selected) so the server never has to fall back to the legacy bare-array
// format.
function buildBookingFacilityL(main, ado, adt, ac) {
  var arr = Array.isArray(main) ? main : [];
  var aList = Array.isArray(ado) ? ado : [];
  var tList = Array.isArray(adt) ? adt : [];
  return JSON.stringify({ l: arr, ado: aList, adt: tList, ac: ac ? 1 : 0 });
}

// Tolerant parser for the zrb.l column. Accepts:
//   - the standard envelope above      -> { main: l, ado, adt }
//   - a legacy bare array              -> { main: that array, ado: [], adt: [] }
//   - anything unparsable              -> empty arrays
function parseBookingFacilityL(l) {
  var main = [];
  var ado = [];
  var adt = [];
  var ac = 0;
  if (Array.isArray(l)) {
    main = l;
    return { main: main, ado: ado, adt: adt, ac: ac };
  }
  if (typeof l !== "string") return { main: main, ado: ado, adt: adt, ac: ac };
  var obj = null;
  try {
    obj = JSON.parse(l);
  } catch (e) {
    return { main: main, ado: ado, adt: adt, ac: ac };
  }
  if (Array.isArray(obj)) {
    main = obj;
  } else if (obj && typeof obj === "object") {
    if (Array.isArray(obj.l)) main = obj.l;
    if (Array.isArray(obj.ado)) ado = obj.ado;
    if (Array.isArray(obj.adt)) adt = obj.adt;
    if (obj.ac != null) ac = obj.ac;
  }
  return { main: main, ado: ado, adt: adt, ac: ac };
}

// Map a server/config room record (rm schema: a-j keys, nested h object) into
// the public ht-schema shape (name/pricePerNight/images/capacity/bed/...) that
// renderHome, roomCardHtml, renderDetails and booking.js already consume.
function mapRmToRoomRecord(rm) {
  if (!rm || typeof rm !== "object") return null;
  // rm.da ships f/g/h as JSON strings; parse them back to objects so the
  // roomMeta helpers below can read nested fields (h.a/h.b/h.e/...) cleanly.
  var keys = ["f", "g", "h"];
  for (var ki = 0; ki < keys.length; ki++) {
    var mk = keys[ki];
    if (typeof rm[mk] === "string") {
      var firstChar = rm[mk].trim().charAt(0);
      if (firstChar === "{" || firstChar === "[") {
        try {
          rm[mk] = JSON.parse(rm[mk]);
        } catch (e) {}
      }
    }
  }
  var occ = htRoomOccupancy(rm);
  var cap = occ.adults + occ.children;
  if (!cap && rm.h && typeof rm.h === "object" && rm.h.c != null) {
    var first = String(rm.h.c).split(",")[0];
    cap = parseInt(first) || 0;
  }
  var typeId = rm.i != null && typeof rm.i !== "object" ? rm.i : rm.j;
  var type = htGetById(htRoomTypes, typeId);
  var images = [];
  if (rm.f && typeof rm.f === "string") {
    images = String(rm.f)
      .trim()
      .split(/\s+/)
      .map(function (k) {
        return htImgSrc(k);
      })
      .filter(Boolean);
  }
  if (!images.length && rm.g) {
    var gArr = Array.isArray(rm.g)
      ? rm.g
      : typeof rm.g === "string"
        ? [rm.g]
        : [];
    images = gArr
      .map(function (x) {
        return typeof x === "string" ? htImgSrc(x) : "";
      })
      .filter(Boolean);
  }
  if (!images.length) images = htRoomImages(rm);
  return {
    id: String(rm.a != null ? rm.a : rm.e),
    a: rm.a != null ? rm.a : null,
    e: rm.e != null ? rm.e : null,
    no: rm.e != null ? rm.e : null,
    name: htRoomName(rm),
    tagline: "",
    pricePerNight: htRoomRate(rm),
    acRate:
      rm.h && typeof rm.h === "object" && rm.h.i && rm.h.i.b != null
        ? Number(rm.h.i.b)
        : 0,
    weekRates:
      rm.h && typeof rm.h === "object" && rm.h.j && typeof rm.h.j === "object"
        ? rm.h.j
        : {},
    capacity: cap || 2,
    maxAdults: occ.adults || 0,
    maxChildren: occ.children || 0,
    bed: htBedLabels(rm).join(" + ") || "King Bed",
    area: htRoomDimensions(rm) || "",
    amenities: htAmenityLabels(rm),
    ac: !!(type && type.folder === "AC"),
    facilities: htFacilityItems(rm),
    desc: [],
    images: images,
    includedGuests: 2,
    extraGuestRate: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.extraAdultsCharge || 0,
    childRate: 0,
  };
}

function applyClientConfigToPublic() {
  var cfg = window[my1uzr.worknOnPg].clientConfig;
  if (!cfg || typeof cfg !== "object") return;

  if (Array.isArray(cfg.rm) && cfg.rm.length) {
    roomRecords = [];
    for (var i = 0; i < cfg.rm.length; i++) {
      var mapped = mapRmToRoomRecord(cfg.rm[i]);
      if (mapped) roomRecords.push(mapped);
    }
  }

  hotel = {
    name: cfg.bznm || (hotel && hotel.name) || "Hotel",
    city: cfg.bzadrs || (hotel && hotel.city) || "",
    tagline: cfg.subjto || (hotel && hotel.tagline) || "",
    address: cfg.bzadrs || (hotel && hotel.address) || "",
    phone: cfg.conta || (hotel && hotel.phone) || "",
    email: cfg.emlAdrs || (hotel && hotel.email) || "",
    currency: (hotel && hotel.currency) || "INR",
    symbol: (hotel && hotel.symbol) || "\u20B9",
    gst: cfg.gst != null ? Number(cfg.gst) : (hotel && hotel.gst) || 5,
  };

  if (Array.isArray(cfg.rmruls) && cfg.rmruls.length) {
    policies = policies || {};
    policies.list = [];
    for (var j = 0; j < cfg.rmruls.length; j++) {
      var rule = cfg.rmruls[j];
      if (rule && rule.b != null) policies.list.push(String(rule.b));
    }
  }

  if (Array.isArray(cfg.adons) && cfg.adons.length) {
    addonRecords = [];
    for (var k = 0; k < cfg.adons.length; k++) {
      var ad = cfg.adons[k];
      if (!ad || ad.a == null) continue;
      addonRecords.push({
        id: String(ad.a),
        name: ad.b != null ? String(ad.b) : "",
        desc: "",
        icon: "plus",
        price: Number(ad.c) || 0,
        type: "perNight",
      });
    }
  }

  var adtnolChrgs = Array.isArray(cfg.adtnolChrgs) ? cfg.adtnolChrgs : [];
  for (var ai = 0; ai < adtnolChrgs.length; ai++) {
    var rec = adtnolChrgs[ai];
    if (!rec || rec.a == null) continue;
    addonRecords.push({
      id: String(rec.a),
      name: rec.b != null ? String(rec.b) : "",
      desc: "",
      icon: "clock",
      price: Number(rec.c) || 0,
      type: "perHour",
      info: true,
    });
  }
}

function getRoom() {
  for (var i = 0; i < roomRecords.length; i++) {
    if (roomRecords[i].id === roomId) return roomRecords[i];
  }
  return null;
}

function roomPackages(room) {
  return packageRecords.filter(function (p) {
    return !p.roomIds || p.roomIds.indexOf(room.id) > -1;
  });
}

/* ============================================================
   PART 7 - RENDERING (user page)
   ============================================================ */
function renderAppUI() {
  initDates();
  renderApp();
}

function renderApp() {
  var h = hotel || {};
  el("main_body").innerHTML =
    '<header id="htNav"></header>' +
    '<div id="childStrip" class="ht-hidden"></div>' +
    "<main>" +
    '<section id="viewHome"></section>' +
    '<section id="viewDetails" class="ht-hidden"></section>' +
    '<section id="viewPolicies" class="ht-hidden"></section>' +
    "</main>" +
    '<footer id="htFooter" class="ht-footer">' +
    '<div class="container"><div class="ht-footer-inner">' +
    '<div class="ht-footer-brand">' +
    escHtml(h.name || "Hotel") +
    "</div>" +
    '<div class="ht-footer-tag">' +
    escHtml(h.tagline || "") +
    "</div>" +
    (h.phone || h.email || h.address
      ? '<div class="ht-footer-contact">' +
        (h.phone
          ? '<div class="ht-footer-contact-item"><i class="fa-solid fa-phone"></i><span class="ht-footer-c-label">Mobile Number</span><span class="ht-footer-c-value">' +
            h.phone +
            "</span></div>"
          : "") +
        (h.email
          ? '<div class="ht-footer-contact-item"><i class="fa-solid fa-envelope"></i><span class="ht-footer-c-label">Email Address</span><span class="ht-footer-c-value">' +
            escHtml(h.email) +
            "</span></div>"
          : "") +
        (h.address
          ? '<div class="ht-footer-contact-item"><i class="fa-solid fa-location-dot"></i><span class="ht-footer-c-label">Address</span><span class="ht-footer-c-value">' +
            escHtml(h.address) +
            "</span></div>"
          : "") +
        "</div>"
      : "") +
    '<div class="ht-footer-links">' +
    '<a href="'+window[my1uzr.worknOnPg].clientConfig.trmsFl+'" target="_blank">Terms & Conditions</a>' +
    '<span class="ht-footer-sep">|</span>' +
    '<a href="'+window[my1uzr.worknOnPg].clientConfig.prvcFl+'" target="_blank">Privacy Policy</a>' +
    '<span class="ht-footer-sep">|</span>' +
    '<a href="'+window[my1uzr.worknOnPg].clientConfig.rfndFl+'" target="_blank">Refund Policy</a>' +
    '<span class="ht-footer-sep">|</span>' +
    '<button type="button" class="ht-btn ht-btn-ember ht-footer-contact-btn" onclick="if (typeof showContactModal === \'function\') showContactModal();">Contact Us</button>' +
    "</div>" +
    '<div class="ht-footer-copy">&copy; ' +
    new Date().getFullYear() +
    " " +
    escHtml(h.name || "Hotel") +
    ". All rights reserved.</div>" +
    "</div></div></footer>" +
    '<div id="bottomBar"></div>' +
    '<div id="paySheet"></div>' +
    '<div id="payOverlay" class="ht-sheet-overlay" onclick="closeSummarySheet()"></div>' +
    '<div id="modalRoot"></div>';

  renderNavBar();
  setCounts();
  renderSummarySheet();
  renderBottomBar();
  renderChildStrip();
  switchView("home");
}

function navField(label, inner) {
  return (
    '<div class="ht-field"><label>' + label + "</label>" + inner + "</div>"
  );
}

function navStepper(label, key, deltaFn) {
  return (
    '<div class="ht-stepper"><label>' +
    label +
    '</label><div class="stp-row">' +
    '<button type="button" onclick="' +
    deltaFn +
    '(-1)" aria-label="Decrease">-</button>' +
    '<span class="val" data-count="' +
    key +
    '">0</span>' +
    '<button type="button" onclick="' +
    deltaFn +
    '(1)" aria-label="Increase">+</button>' +
    "</div></div>"
  );
}
function showUserProfile() {
  var u = window.my1uzr || {};
  var mid = "profileModal_" + Date.now();
  var name = u.mn || "Guest";
  var mobile = u.mo || "—";
  var constraint = u.mc || "—";
  var username = u.mu || "—";

  var html =
    '<div class="modal fade" id="' +
    mid +
    '" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered ht-profile-dialog">' +
    '<div class="modal-content shadow-lg" style="border:2px solid var(--gold);border-radius:14px;overflow:hidden;background:var(--cream);">' +
    /* header */
    '<div class="modal-header" style="background:linear-gradient(135deg,#a13a26,#6e1f12);color:#fbeedd;padding:24px 20px 18px;border-bottom:2px solid var(--gold);flex-direction:column;align-items:center;text-align:center;">' +
    '<i class="fa-solid fa-crown" style="font-size:32px;color:var(--gold);margin-bottom:10px;filter:drop-shadow(0 0 8px rgba(201,164,92,0.55));"></i>' +
    '<h6 class="modal-title fw-bold" style="font-family:\'Playfair Display\',Georgia,serif;font-size:19px;color:#fff8e7;margin:0;">' +
    escHtml(name) +
    "</h6>" +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" style="position:absolute;top:10px;right:14px;"></button>' +
    "</div>" +
    /* body – info rows */
    '<div class="modal-body" style="padding:20px 22px 16px;">' +
    '<div style="display:flex;flex-direction:column;gap:16px;">' +
    profileRow("fa-mobile-screen-button", "Mobile", mobile) +
    profileRow("fa-user-shield", "Role", constraint) +
    profileRow("fa-at", "Username", username) +
    "</div></div>" +
    /* footer – admin module menu (from moduLst) */
    '<div class="modal-footer ht-menu-footer">' +
    (function () {
      var shortMap = {
        hm: "home",
        rm: "rooms",
        ar: "addRoom",
        bs: "booking",
        rt: "restaurant",
        rw: "reviews",
        st: "settings",
        pl: "policies",
      };
      var hCols = (
        (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].colsToHideMenu) ||
        ""
      )
        .split(",")
        .map(function (k) {
          return shortMap[k.trim().toLowerCase()] || k.trim().toLowerCase();
        })
        .filter(function (k) {
          return k;
        });
      return (window[my1uzr.worknOnPg].allowedModulesMenuItems || [])
        .filter(function (m) {
          return hCols.indexOf(m.d) === -1;
        })
        .map(function (m) {
          return (
            '<button type="button" class="ht-menu-tile" style="--mc:' +
            m.e +
            ';" data-bs-dismiss="modal" onclick="openAdminFromMenu(\'' +
            m.d +
            "')\">" +
            '<span class="mt-ic"><i class="fa-solid ' +
            m.c +
            '"></i></span>' +
            '<span class="mt-lb">' +
            escHtml(m.b) +
            "</span></button>"
          );
        })
        .join("");
    })() +
    '<button type="button" class="ht-btn ht-btn-ghost ht-menu-close" data-bs-dismiss="modal">Close</button>' +
    "</div>" +
    "</div></div></div>";

  document.body.insertAdjacentHTML("beforeend", html);
  var modalEl = document.getElementById(mid);
  var m = new bootstrap.Modal(modalEl, { backdrop: "static" });
  m.show();
  modalEl.addEventListener("hidden.bs.modal", function () {
    this.remove();
  });
}

function profileRow(icon, label, value) {
  return (
    '<div style="display:flex;align-items:center;gap:14px;padding:12px 14px;background:var(--surface-2);border:1px solid rgba(201,164,92,0.15);border-radius:12px;">' +
    '<i class="fa-solid ' +
    icon +
    '" style="font-size:16px;color:var(--gold);width:22px;text-align:center;"></i>' +
    '<div style="display:flex;flex-direction:column;gap:2px;">' +
    '<span style="font-size:10.5px;text-transform:uppercase;letter-spacing:1.2px;color:var(--muted);line-height:1;">' +
    label +
    "</span>" +
    '<span style="font-size:14.5px;font-weight:600;color:var(--ink);line-height:1.3;">' +
    escHtml(value) +
    "</span>" +
    "</div></div>"
  );
}

/* Load the moduLst item's fn scripts, then open the admin page
   on that section (openAdminPage is now inline in ht.js). */
async function openAdminFromMenu(action) {
  var item = null;
  for (var i = 0; i < moduLst.length; i++) {
    if (moduLst[i].d === action) {
      item = moduLst[i];
      break;
    }
  }
  if (!item) return;
  /* admin.js merged into ht.js — fn 40 no longer needed */
  if (typeof toggleSidebar !== "function") {
    try {
      await loadExe2Fn(41);
    } catch (e) {}
  }
  if (typeof calcNights !== "function") {
    try {
      await loadExe2Fn(42);
    } catch (e) {}
  }
  if (typeof htRoomName !== "function") {
    try {
      await loadExe2Fn(43);
    } catch (e) {}
  }
  if (typeof showDashboard !== "function") {
    try {
      await loadExe2Fn(44);
    } catch (e) {}
  }
  var alreadyLoaded = {};
  [41,42,43,44].forEach(function(id){ alreadyLoaded[id] = true; });
  var fns = item.mi.split(",").filter(function (n) {
    return n !== "";
  });
  for (var j = 0; j < fns.length; j++) {
    var fnId = parseInt(fns[j], 10);
    if (alreadyLoaded[fnId]) continue;
    try {
      await loadExe2Fn(fnId);
    } catch (e) {
      console.warn("loadExe2Fn failed for fn " + fns[j] + ":", e);
    }
  }
  if (action === "settings") {
    if (typeof loadRoomConfig === "function") await loadRoomConfig();
    if (typeof showPrintSettings === "function") showPrintSettings();
    return;
  }
  if (typeof openAdminPage === "function") await openAdminPage(action);
  else console.error("Admin panel not available");
}

async function openLogin() {
  const t351mp = await chkIfLoggedIn();
  if (t351mp.su == 1) showUserProfile();
  else
    (async () => {
      await loadExe2Fn(9, [], [1]);
    })();
}

function renderNavBar() {
  var h = hotel || {};
  el("htNav").innerHTML =
    '<div class="ht-nav"><div class="container"><div class="ht-nav-inner">' +
    '<div class="ht-brand" onclick="showHome()" role="button" title="' +
    escHtml(h.name) +
    '">' +
    '<i class="fa-solid fa-crown ht-brand-icon" onclick="(async () => { await loadExe2Fn(52, [\'dv_to_set_open_my1ctr_processed\', 0, 1, 2], [1]); })();"></i>' +
    //'<i class="fa-solid fa-crown ht-brand-icon" onClick = "openLogin()"></i>' +
    "<div>" +
    '<span class="ht-brand-name">' +
    escHtml(h.name) +
    "</span>" +
    '<span class="ht-brand-tag">' +
    //escHtml(h.tagline) +
    "</span>" +
    "</div>" +
    "</div>" +
    '<div class="ht-nav-controls">' +
    navField(
      "Check-in",
      '<input type="date" id="chkIn" min="' + todayStr() + '">',
    ) +
    navField("Check-out", '<input type="date" id="chkOut">') +
    navStepper("Adults", "adults", "changeAdult") +
    navStepper("Children", "children", "changeChild") +
    '<button class="ht-btn ht-btn-gold ht-search-btn" title="Check Availability" onclick="navSearch()">' +
    '<i class="fa-solid fa-magnifying-glass"></i><span class="ht-search-label"> Check Availability</span></button>' +
    "</div>" +
    "</div></div></div>";

  var ci = el("chkIn");
  var co = el("chkOut");
  ci.value = checkIn;
  co.value = checkOut;
  ci.onchange = function () {
    if (!this.value) {
      if (typeof clearPublicStayDates === "function") clearPublicStayDates();
      if (typeof applyAvailabilityFilterToHome === "function")
        applyAvailabilityFilterToHome();
      return;
    }
    setCheckIn(this.value);
    if (typeof applyAvailabilityFilterToHome === "function")
      applyAvailabilityFilterToHome();
  };
  co.onchange = function () {
    if (!this.value) {
      if (typeof clearPublicStayDates === "function") clearPublicStayDates();
      if (typeof applyAvailabilityFilterToHome === "function")
        applyAvailabilityFilterToHome();
      return;
    }
    setCheckOut(this.value);
    if (typeof applyAvailabilityFilterToHome === "function")
      applyAvailabilityFilterToHome();
  };
}

/* ---------- Home ---------- */
function roomFilterBarHtml(list) {
  var total = adults + children;
  var anyFilter = roomFilterActive || roomAvailFilter;
  if (!anyFilter || total < 1) return "";
  var guestLabel =
    adults +
    " adult" +
    (adults > 1 ? "s" : "") +
    (children > 0
      ? ", " + children + " child" + (children > 1 ? "ren" : "")
      : "");
  var scope;
  if (roomFilterActive && roomAvailFilter) {
    scope = "<b>" + total + "</b> guest" + (total > 1 ? "s" : "") + " on your selected dates";
  } else if (roomAvailFilter) {
    scope = "your selected dates";
  } else {
    scope = "<b>" + total + "</b> guest" + (total > 1 ? "s" : "");
  }
  if (list.length > 0) {
    return (
      '<div class="ht-filter-bar"><i class="fa-solid fa-wand-magic-sparkles"></i> ' +
      "<b>" +
      list.length +
      "</b> room" +
      (list.length > 1 ? "s" : "") +
      " available for " +
      scope +
      (roomFilterActive ? " (" + guestLabel + ")" : "") +
      '.<button class="ht-filter-clear" onclick="clearAvailFilter()">Show all rooms</button></div>'
    );
  }
  return (
    '<div class="ht-filter-bar ht-filter-bar-empty"><i class="fa-solid fa-triangle-exclamation"></i> ' +
    "No room is available for " +
    scope +
    (roomFilterActive ? " (" + guestLabel + ")" : "") +
    '.<button class="ht-filter-clear" onclick="clearAvailFilter()">Show all rooms</button></div>'
  );
}

var sliderIdx = 0;
var sliderTimer = null;
var slideStartX = null;
var slideDeltaX = 0;

function hotelSliderHtml() {
  var hn = hotel ? escHtml(hotel.name) : "";
  var slides = HOTEL_SLIDES.map(function (src, i) {
    return (
      '<div class="slide' +
      (i === sliderIdx ? " active" : "") +
      '"><img src="' +
      src +
      '" alt="' +
      hn +
      '" loading="lazy" onerror="imgFail(this)"></div>'
    );
  }).join("");
  var dots = HOTEL_SLIDES.map(function (_, i) {
    return (
      '<span class="' +
      (i === sliderIdx ? "active" : "") +
      '" onclick="gotoSlide(' +
      i +
      ')"></span>'
    );
  }).join("");
  return (
    '<div class="ht-slider" id="htSlider">' +
    '<div class="track">' +
    slides +
    "</div>" +
    '<div class="shade"></div>' +
    '<span class="counter">1 / ' +
    HOTEL_SLIDES.length +
    "</span>" +
    '<button class="arr prev" title="Previous" onclick="prevSlide(event)"><i class="fa-solid fa-chevron-left"></i></button>' +
    '<button class="arr next" title="Next" onclick="nextSlide(event)"><i class="fa-solid fa-chevron-right"></i></button>' +
    '<div class="dots">' +
    dots +
    "</div>" +
    "</div>"
  );
}

function moveSlider(i) {
  if (!HOTEL_SLIDES.length) return;
  sliderIdx =
    ((i % HOTEL_SLIDES.length) + HOTEL_SLIDES.length) % HOTEL_SLIDES.length;
  var track = document.querySelector(".ht-slider .track");
  if (track) track.style.transform = "translateX(-" + sliderIdx * 100 + "%)";
  var slides = document.querySelectorAll(".ht-slider .slide");
  slides.forEach(function (s, j) {
    s.classList.toggle("active", j === sliderIdx);
  });
  var dots = document.querySelectorAll(".ht-slider .dots span");
  dots.forEach(function (d, j) {
    d.classList.toggle("active", j === sliderIdx);
  });
  var counter = document.querySelector(".ht-slider .counter");
  if (counter)
    counter.textContent = sliderIdx + 1 + " / " + HOTEL_SLIDES.length;
}

function nextSlide(e) {
  if (e) e.stopPropagation();
  moveSlider(sliderIdx + 1);
}

function prevSlide(e) {
  if (e) e.stopPropagation();
  moveSlider(sliderIdx - 1);
}

function gotoSlide(i) {
  moveSlider(i);
}

function bindSlider() {
  if (sliderTimer) {
    clearInterval(sliderTimer);
    sliderTimer = null;
  }
  var slider = el("htSlider");
  if (!slider || !HOTEL_SLIDES.length) return;
  moveSlider(sliderIdx);
  sliderTimer = setInterval(function () {
    moveSlider(sliderIdx + 1);
  }, 4000);
  slider.addEventListener("mouseenter", function () {
    if (sliderTimer) {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }
  });
  slider.addEventListener("mouseleave", function () {
    if (sliderTimer) return;
    sliderTimer = setInterval(function () {
      moveSlider(sliderIdx + 1);
    }, 4000);
  });
  slider.addEventListener("touchstart", function (e) {
    slideStartX = e.touches ? e.touches[0].clientX : null;
    slideDeltaX = 0;
  });
  slider.addEventListener("touchmove", function (e) {
    if (slideStartX === null || !e.touches) return;
    slideDeltaX = e.touches[0].clientX - slideStartX;
  });
  slider.addEventListener("touchend", function () {
    if (slideStartX === null) return;
    if (Math.abs(slideDeltaX) > 50) {
      if (slideDeltaX < 0) nextSlide();
      else prevSlide();
    }
    slideStartX = null;
    slideDeltaX = 0;
  });
}

function renderHome() {
  var h = hotel || {};
  var list = roomRecords;
  if (roomFilterActive && adults + children > 0) {
    list = roomRecords.filter(function (r) {
      return (r.capacity || 2) >= adults + children;
    });
  }
  if (roomAvailFilter && checkIn && checkOut) {
    list = list.filter(function (r) {
      return typeof publicRoomIsAvailable === "function"
        ? publicRoomIsAvailable(r, checkIn, checkOut)
        : true;
    });
  }
  var cards = list.map(roomCardHtml).join("");
  var myBookingRow = "";
  if (
    typeof isLoggedIn === "function" &&
    isLoggedIn()
  ) {
    if (
      typeof ensurePublicBookingsLoaded === "function" &&
      !window.__pubBookingsLoaded &&
      !window.__pubBookingsLoading
    ) {
      window.__pubBookingsLoading = true;
      ensurePublicBookingsLoaded()
        .then(function () {
          window.__pubBookingsLoading = false;
          if (currentView === "home") renderHome();
        })
        .catch(function () {
          window.__pubBookingsLoading = false;
        });
    }
    myBookingRow =
      '<div class="ht-my-booking-row">' +
      '<button class="ht-btn ht-btn-gold" onclick="printMyBooking()">' +
      '<i class="fa-solid fa-book"></i> My Bookings</button>' +
      '<button class="ht-btn ht-btn-ember" onclick="cancelMyBooking()">' +
      '<i class="fa-solid fa-ban"></i> Cancel booking</button>' +
      "</div>";
  }
  el("viewHome").innerHTML =
    '<div class="ht-hero"><div class="container">' +
    myBookingRow +
    // '<div class="kicker">' +
    // escHtml(h.name) +
    // " \u00b7 " +
    // escHtml(h.city) +
    // "</div>" +
    "<h1>Find your perfect stay</h1>" +
    '<div class="rule"></div>' +
    hotelSliderHtml() +
    '<div class="rule"></div>' +
    "<p>Every room is a little retreat, styled for comfort and quiet luxury.</p>" +
    "</div></div>" +
    '<div class="container">' +
    roomFilterBarHtml(list) +
    "</div>" +
    '<div class="container ht-room-list">' +
    cards +
    "</div>" +
    '<div class="container pb-5">' +
    policiesSectionHtml() +
    "</div>";
  bindSlider();
}

function roomCardHtml(r) {
  var badgeIcon = r.ac ? "fa-snowflake" : "fa-fan";
  return (
    '<article class="ht-room-card" id="room-card-' +
    r.id +
    '">' +
    '<div class="ht-room-img">' +
    '<img src="' +
    r.images[0] +
    '" alt="' +
    escHtml(r.name) +
    '" loading="lazy" onerror="imgFail(this)">' +
    // '<span class="ht-ribbon"><i class="fa-solid ' +
    // badgeIcon +
    // '"></i> ' +
    // (r.ac ? "AC" : "Non-AC") +
    // "</span>" +
    '<span class="ht-chip-start">Starting ' +
    fmtMoney(r.pricePerNight) +
    " / night \u00b7 2 adults</span>" +
    "</div>" +
    '<div class="ht-room-body">' +
    "<h2>" +
    escHtml(r.e) + " - " + escHtml(r.name) +
    "</h2>" +
    '<p class="tagline">' +
    escHtml(r.tagline) +
    "</p>" +
    '<div class="ht-badges">' +
    badgeHtml("fa-user-group", r.capacity + " Guests") +
    badgeHtml("fa-bed", escHtml(r.bed)) +
    badgeHtml("fa-ruler-combined", r.area + " sq.ft") +
    "</div>" +
    '<div class="ht-pills">' +
    r.amenities
      .slice(0, 3)
      .map(function (a) {
        return pillHtml(a);
      })
      .join("") +
    (r.amenities.length > 3
      ? '<span class="ht-pill">+' + (r.amenities.length - 3) + " more</span>"
      : "") +
    "</div>" +
    '<div class="ht-card-foot">' +
    '<span class="ht-price">' +
    fmtMoney(r.pricePerNight) +
    '<br><span class="per"> / night \u00b7 adults 2 \u00b7 excl. GST</span></span>' +
    '<button class="ht-btn ht-btn-ember" onclick="openRoomBooking(); showRoomDetails(\'' +
    r.id +
    "')\">Book Now</button>" +
    "</div>" +
    "</div></article>"
  );
}

function badgeHtml(icon, text) {
  return (
    '<span class="ht-badge"><i class="fa-solid ' +
    icon +
    '"></i> ' +
    text +
    "</span>"
  );
}

function pillHtml(text) {
  return (
    '<span class="ht-pill"><i class="fa-solid fa-check"></i> ' +
    text +
    "</span>"
  );
}

/* ---------- Room Details ---------- */
function bpColHidden(code) {
  var s = window[my1uzr.worknOnPg].colsToHideBookingProcess;
  if (!s) return false;
  var tokens = String(s).split(",");
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].trim() === code) return true;
  }
  return false;
}

function renderDetails() {
  var r = getRoom();
  if (!r) {
    showHome();
    return;
  }
  var body =
    '<div class="container py-3 pb-5">' +
    '<button class="ht-back" onclick="showHome()"><i class="fa-solid fa-arrow-left"></i> All Rooms</button>' +
    '<div class="row g-4">' +
    '<div class="col-xl-8 col-lg-7">' +
    galleryHtml(r) +
    aboutHtml(r);
  if (!bpColHidden("flt")) body += facilitiesHtml(r);
  if (!bpColHidden("ia")) body += amenitiesHtml(r);
  if (!bpColHidden("cyp")) body += packagesSectionHtml(r);
  if (!bpColHidden("aos")) body += addonsSectionHtml();
  body += policiesSectionHtml();
  body +=
    "</div>" +
    '<div class="col-xl-4 col-lg-5" id="summaryHost"></div>' +
    "</div></div>";
  el("viewDetails").innerHTML = body;
  if (!el("paySheetPanel") && typeof renderSummarySheet === "function") {
    renderSummarySheet();
  }
  refreshSummary();
  if (typeof relocateSummaryPanel === "function") relocateSummaryPanel();
  if (
    window.innerWidth >= 992 &&
    typeof ensureBeCheckinField === "function"
  ) {
    ensureBeCheckinField();
  }
}

function galleryHtml(r) {
  return (
    '<div class="ht-gallery">' +
    '<div class="hero"><img id="gHero" src="' +
    r.images[0] +
    '" alt="' +
    escHtml(r.name) +
    '" onerror="imgFail(this)"></div>' +
    '<div class="thumbs">' +
    r.images
      .map(function (src, i) {
        return (
          '<img src="' +
          src +
          '" alt="" loading="lazy" onerror="imgFail(this)" ' +
          (i === 0 ? 'class="active" ' : "") +
          'onclick="setHero(' +
          i +
          ')">'
        );
      })
      .join("") +
    "</div></div>"
  );
}

function aboutHtml(r) {
  return (
    '<section class="ht-section ht-room-title">' +
    "<h2>" +
    escHtml(r.e) + " - " + escHtml(r.name) +
    "</h2>" +
    '<p class="tagline">' +
    escHtml(r.tagline) +
    "</p>" +
    '<div class="ht-badges mb-3">' +
    badgeHtml("fa-user-group", "Sleeps " + r.capacity) +
    badgeHtml("fa-bed", escHtml(r.bed)) +
    badgeHtml("fa-ruler-combined", r.area + " sq.ft") +
    badgeHtml(
      r.ac ? "fa-snowflake" : "fa-fan",
      r.ac ? "Air Conditioned" : "Non-AC",
    ) +
    "</div>" +
    '<div class="ht-desc">' +
    r.desc
      .map(function (p) {
        return "<p>" + escHtml(p) + "</p>";
      })
      .join("") +
    "</div>" +
    //'<button class="ht-btn ht-btn-ember ht-book-now" onclick="goToPackages(this)">' +
    //'<i class="fa-solid fa-box-open"></i> Book Now</button>' +
    "</section>"
  );
}

function facilitiesHtml(r) {
  return (
    '<section class="ht-section">' +
    '<h2><i class="fa-solid fa-hands"></i> Facilities</h2>' +
    '<div class="ht-fac-grid">' +
    r.facilities
      .map(function (f) {
        return (
          '<div class="ht-fac"><i class="fa-solid ' +
          f.icon +
          '"></i> ' +
          escHtml(f.label) +
          "</div>"
        );
      })
      .join("") +
    "</div></section>"
  );
}

function amenitiesHtml(r) {
  return (
    '<section class="ht-section">' +
    '<h2><i class="fa-solid fa-gem"></i> Included Amenities</h2>' +
    '<div class="ht-pill-line">' +
    r.amenities
      .map(function (a) {
        return pillHtml(a);
      })
      .join("") +
    "</div></section>"
  );
}

function policiesSectionHtml() {
  var list = policies.list;
  if (!list || !Array.isArray(list) || list.length === 0) return "";
  var mainItems = "";
  var extraItems = "";
  var showCount = 0;
  var isExtra = false;
  for (var i = 0; i < list.length; i++) {
    var p = String(list[i]);
    var li = "";
    if (p.indexOf("\u2022") === 0) {
      li =
        '<li><i class="fa-solid fa-check"></i> <span>' +
        escHtml(p.slice(2)) +
        "</span></li>";
    } else {
      li =
        '<li class="ht-rules-h"><span>' +
        escHtml(p.replace(/\s*:\s*$/, "")) +
        "</span></li>";
    }
    if (!isExtra) {
      mainItems += li;
      showCount++;
      if (showCount >= 6) isExtra = true;
    } else {
      extraItems += li;
    }
  }
  if (!extraItems) {
    return (
      '<section class="ht-section ht-policies">' +
      '<h2><i class="fa-solid fa-scroll"></i> Hotel Policies</h2>' +
      '<ul class="ht-rules">' +
      mainItems +
      "</ul></section>"
    );
  }
  return (
    '<section class="ht-section ht-policies">' +
    '<h2><i class="fa-solid fa-scroll"></i> Hotel Policies</h2>' +
    '<ul class="ht-rules">' +
    mainItems +
    "</ul>" +
    '<ul class="ht-rules ht-rules-extra ht-hidden" id="htRulesExtra">' +
    extraItems +
    "</ul>" +
    '<button class="ht-btn ht-btn-ghost ht-toggle-rules" onclick="togglePolicies(this)">' +
    '<span id="htToggleLabel">Show More</span> <i class="fa-solid fa-chevron-down" id="htToggleIcon"></i>' +
    "</button></section>"
  );
}

function togglePolicies(btn) {
  var sec = btn && btn.closest ? btn.closest(".ht-policies") : null;
  var extra = sec ? sec.querySelector(".ht-rules-extra") : el("htRulesExtra");
  var label = sec ? sec.querySelector("#htToggleLabel") : el("htToggleLabel");
  var icon = sec ? sec.querySelector("#htToggleIcon") : el("htToggleIcon");
  if (!extra) return;
  var showing = !extra.classList.contains("ht-hidden");
  if (showing) {
    extra.classList.add("ht-hidden");
    if (label) label.textContent = "Show More";
    if (icon) {
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
    }
  } else {
    extra.classList.remove("ht-hidden");
    if (label) label.textContent = "Show Less";
    if (icon) {
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
    }
  }
}

function packagesSectionHtml(r) {
  return (
    '<section class="ht-section">' +
    '<h2><i class="fa-solid fa-box-open"></i> Choose Your Package</h2>' +
    '<div id="pkgRoot">' +
    packagesListHtml(r) +
    "</div>" +
    '<button class="ht-btn ht-btn-gold ht-book-now" onclick="openSummarySheet()">' +
    '<i class="fa-solid fa-shield-halved"></i> Book Now</button>' +
    "</section>"
  );
}

function packagesListHtml(r) {
  var list = roomPackages(r);
  return (
    '<div class="ht-pkg-list">' +
    list
      .map(function (p) {
        var active = p.id === packageId;
        var price =
          p.price === 0
            ? '<span class="pr free">Included</span>'
            : '<span class="pr">' +
              fmtMoney(p.price) +
              " / " +
              (p.type === "perNight" ? "night" : "stay") +
              "</span>";
        return (
          '<div class="ht-pkg' +
          (active ? " active" : "") +
          '" onclick="pickPackage(\'' +
          p.id +
          "')\">" +
          '<span class="radio"></span>' +
          "<div>" +
          '<div class="nm">' +
          escHtml(p.name) +
          "</div>" +
          '<div class="ds">' +
          escHtml(p.desc) +
          "</div>" +
          "</div>" +
          price +
          "</div>"
        );
      })
      .join("") +
    "</div>"
  );
}

function addonsSectionHtml() {
  return (
    '<section class="ht-section">' +
    '<h2><i class="fa-solid fa-plus"></i> Add-on Services</h2>' +
    '<div class="ht-addon-grid" id="addonsRoot">' +
    addonsListHtml() +
    "</div></section>"
  );
}

function addonsListHtml() {
  return addonRecords
    .map(function (a) {
      if (a.info) {
        return (
          '<div class="ht-addon ht-addon-info" title="Included at the property">' +
          '<span class="ic"><i class="fa-solid fa-clock"></i></span>' +
          '<span class="tx">' +
          '<span class="nm">' +
          escHtml(a.name) +
          "</span>" +
          '<span class="ds">' +
          fmtMoney(a.price) +
          " / hour</span>" +
          "</span>" +
          '<span class="chk chk-info"><i class="fa-solid fa-circle-info"></i></span>' +
          "</div>"
        );
      }
      var on = addonIds.indexOf(a.id) > -1;
      return (
        '<div class="ht-addon' +
        (on ? " active" : "") +
        '" onclick="toggleAddon(\'' +
        a.id +
        "')\">" +
        '<span class="ic"><i class="fa-solid fa-' +
        a.icon +
        '"></i></span>' +
        '<span class="tx">' +
        '<span class="nm">' +
        escHtml(a.name) +
        "</span>" +
        '<span class="ds">' +
        escHtml(a.desc) +
        " \u00b7 " +
        fmtMoney(a.price) +
        " / " +
        (a.type === "perNight" ? "night" : "stay") +
        "</span>" +
        "</span>" +
        '<span class="chk">' +
        (on
          ? '<i class="fa-solid fa-check"></i>'
          : '<i class="fa-solid fa-plus"></i>') +
        "</span>" +
        "</div>"
      );
    })
    .join("");
}

/* ---------- View switching ---------- */
var currentPolicyType = "";

function switchView(v, policyType) {
  currentView = v;
  var home = el("viewHome");
  var det = el("viewDetails");
  var pol = el("viewPolicies");
  if (v === "home") {
    roomId = 0;
    home.classList.remove("ht-hidden");
    det.classList.add("ht-hidden");
    pol.classList.add("ht-hidden");
    document.body.classList.remove("has-details");
    renderHome();
  } else if (v === "policies") {
    home.classList.add("ht-hidden");
    det.classList.add("ht-hidden");
    pol.classList.remove("ht-hidden");
    document.body.classList.remove("has-details");
    currentPolicyType = policyType || "terms";
  } else {
    home.classList.add("ht-hidden");
    det.classList.remove("ht-hidden");
    pol.classList.add("ht-hidden");
    document.body.classList.add("has-details");
    renderDetails();
  }
  window.scrollTo(0, 0);
}

function showHome() {
  switchView("home");
}

function showPolicy(type) {
  switchView("policies", type);
}

function showRoomDetails(id) {
  var r = null;
  for (var i = 0; i < roomRecords.length; i++) {
    if (roomRecords[i].id === id) {
      r = roomRecords[i];
      break;
    }
  }
  if (!r) return;
  roomId = id;
  chargeWithAc = false;
  heroIdx = 0;
  addonIds = [];
  if (typeof roomGuestLimits === "function") {
    var lim = roomGuestLimits();
    adults = clamp(adults, 1, lim.maxAdults);
    if (lim.maxTotal && adults + children > lim.maxTotal) {
      children = lim.maxTotal - adults;
    }
    if (children > lim.maxChildren) children = lim.maxChildren;
    if (childAges.length > children) childAges = childAges.slice(0, children);
    if (typeof setCounts === "function") setCounts();
    if (typeof renderChildStrip === "function") renderChildStrip();
  }
  var pkgs = roomPackages(r);
  packageId = pkgs.length ? pkgs[0].id : null;
  switchView("details");
}

function setHero(i) {
  var r = getRoom();
  if (!r) return;
  heroIdx = i;
  var hero = el("gHero");
  if (hero) hero.src = r.images[i];
  var thumbs = document.querySelectorAll(".ht-gallery .thumbs img");
  thumbs.forEach(function (t, j) {
    t.classList.toggle("active", j === i);
  });
}

/* ============================================================
   PART 6 - ADMIN PANEL (merged from core/admin.js)
   ============================================================ */

// ============================================================
// ADMIN PANEL - merged from core/admin.js into core/ht.js
// ------------------------------------------------------------
// Admin panel lives inside the SAME index.html as the user
// site. Now inlined in ht.js (no longer lazy-loaded via
// loadExe2Fn(40)). Renders a full-screen #adminPage layer
// over the user UI; closeAdminPage() removes it and refreshes
// the site.
//
// Renames (top-level clashes with core/ht.js user site):
//   loadDataFromDB  -> adminLoadDataFromDB
//   roomRecords     -> adminRoomRecords
//   currentView     -> adminCurrentView
//   injectHTStyles  -> injectAdminStyles (CSS_HT_CONTENT -> ADMIN_CSS)
//   showHome        -> showDashboard   (menu/home.js)
//   handl_rm_rspons -> handl_rm_rspons (core/admin_h.js)
// ============================================================

/* PART A - admin globals */
var bookingRecords = [];
var guestRecords = [];
var adminRoomRecords = [];

var adminCurrentView = "home";
var adminStylesInjected = false;

var adminViewTitles = {
  home: "Dashboard",
  rooms: "Room Management",
  addRoom: "Add Room",
  bookingEntry: "Booking Entry",
  policies: "Policies",
  restaurant: "Restaurant Menu",
  gallery: "Photo Gallery",
  reviews: "Reviews Management",
};

/* PART B - data loading (bo / rm / c tables) */
function daysBetweenStr(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return 0;
  var d1 = new Date(a + "T00:00:00Z").getTime();
  var d2 = new Date(b + "T00:00:00Z").getTime();
  var n = Math.round((d2 - d1) / 86400000);
  return n > 0 ? n : 0;
}

// A booking row stored with the send-side payload letters (e = room id number,
// g = check-in date, h = check-out date, k = guest info, m = total, o = booker
// id) instead of the display schema (e = check-in date, g = name, h = mobile,
// j = room id, n = amount, o = status) would crash the dashboard. Detect rows
// whose e is not a date string and remap them to the display schema.
function normalizeBookingRow(bk) {
  if (!bk || typeof bk !== "object") return bk;
  if (
    typeof bk.e === "string" &&
    /^\d{4}-\d{2}-\d{2}/.test(String(bk.e).trim())
  )
    return bk;
  var guestJson = null;
  try {
    guestJson = typeof bk.k === "string" ? JSON.parse(bk.k) : bk.k;
  } catch (e) {
    // ignore
  }
  var adults =
    (guestJson && parseInt(guestJson.a, 10)) ||
    (guestJson && guestJson.ad) ||
    0;
  var e = typeof bk.g === "string" ? bk.g : "";
  var f = typeof bk.h === "string" ? bk.h : "";
  // Payload-shape rows carry actual check-in/out datetimes (YYYY-MM-DD HH:MM)
  // in i / j; preserve them so the bill card can show them when present.
  var actualCheckin =
    typeof bk.i === "string" && /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(bk.i)
      ? bk.i
      : "";
  var actualCheckout =
    typeof bk.j === "string" && /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(bk.j)
      ? bk.j
      : "";
  var row = {
    a: bk.a,
    d: bk.d,
    e: e,
    f: f,
    g: "",
    h: "",
    i: JSON.stringify({ ad: adults, ch: [] }),
    j: bk.e != null ? bk.e : 0,
    m: daysBetweenStr(e, f),
    n: typeof bk.m === "number" ? bk.m : parseFloat(bk.m) || 0,
    disc: bk.n != null ? Number(bk.n) || 0 : 0,
    o: bk.o != null ? bk.o : 0,
    oc: bk.o != null ? bk.o : 0,
    k: bk.k != null ? bk.k : null,
    l: bk.l != null ? bk.l : null,
  };
  if (actualCheckin) row.actualCheckin = actualCheckin;
  if (actualCheckout) row.actualCheckout = actualCheckout;
  return row;
}

async function adminLoadDataFromDB() {
  var rawBkRecords = [];
  try {
    var dbBk = await dbDexieManager.getAllRecords(dbnm, "rb");
    if (dbBk && dbBk.length > 0) {
      rawBkRecords = dbBk;
      bookingRecords = dbBk.map(normalizeBookingRow);
    }
  } catch (e) {
    console.warn("Failed to load bookings from DB:", e);
  }
  try {
    var dbRm = (window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.rm) || [];
    if (dbRm && dbRm.length > 0) {
      // Server room records carry h as an object ({a,b,c,d,e,f,g}); any
      // legacy local room-config rows (keyed by e, no h object) are excluded.
      // The server may also return nested fields (f/g/h) as JSON strings —
      // parse them back into objects so such rooms are still kept.
      var rooms = [];
      for (var ri = 0; ri < dbRm.length; ri++) {
        var r = dbRm[ri];
        if (!r) continue;
        var keys = ["f", "g", "h"];
        for (var kj = 0; kj < keys.length; kj++) {
          var k = keys[kj];
          if (typeof r[k] === "string") {
            try {
              r[k] = JSON.parse(r[k]);
            } catch (e) {
              // leave unparsable strings as-is
            }
          }
        }
        if (r.h && typeof r.h === "object" && !Array.isArray(r.h)) {
          rooms.push(r);
        }
      }
      adminRoomRecords = rooms;
      console.info("🏨 adminLoadDataFromDB:", rooms.length, "rooms");
    }
  } catch (e) {
    console.warn("Failed to load rooms from DB:", e);
  }
  try {
    var dbC = await dbDexieManager.getAllRecords(dbnm, "c");
    if (dbC && dbC.length > 0) guestRecords = dbC;
  } catch (e) {
    console.warn("Failed to load guests from DB:", e);
  }
  var receivedMap = {};
  try {
    var dbPay = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
    for (var pi = 0; pi < dbPay.length; pi++) {
      var pr = dbPay[pi] || {};
      var amt = parseFloat(pr.j) || 0;
      if (amt <= 0) continue;
      var bId =
        pr.td != null ? String(pr.td) : pr.l && pr.l.td != null ? String(pr.l.td) : "";
      if (!bId) continue;
      receivedMap[bId] = (receivedMap[bId] || 0) + amt;
    }
  } catch (e) {
    console.warn("Failed to load receipts from DB:", e);
  }
  for (var ri2 = 0; ri2 < rawBkRecords.length; ri2++) {
    var rawRow = rawBkRecords[ri2] || {};
    if (!Array.isArray(rawRow.r)) continue;
    var eAmt = 0;
    for (var ePi = 0; ePi < rawRow.r.length; ePi++) {
      eAmt += parseFloat((rawRow.r[ePi] || {}).j) || 0;
    }
    if (eAmt > 0 && rawRow.a != null) {
      receivedMap[String(rawRow.a)] = (receivedMap[String(rawRow.a)] || 0) + eAmt;
    }
  }
  for (var bi = 0; bi < bookingRecords.length; bi++) {
    var rb = bookingRecords[bi];
    if (!rb || !rb.oc || !rb.e) continue;
    rb.received = receivedMap[String(rb.a)] || 0;
    for (var ci = 0; ci < guestRecords.length; ci++) {
      var gc = guestRecords[ci];
      if (gc && String(gc.a) === String(rb.oc)) {
        rb.g = gc.h || gc.i || "";
        rb.h = gc.e || "";
        break;
      }
    }
  }
}

/* PART C - view plumbing */
function getAdminHeaderTitle() {
  if (adminCurrentView !== "home") {
    return (
      '<span class="icon" style="cursor:pointer;" onclick="handleMenuAction(\'home\')">&#x2190;</span> ' +
      (adminViewTitles[adminCurrentView] || "HT")
    );
  }
  return '<span class="icon">&#x1F3E8;</span>' + "Dashboard";
}

function setAdminHeaderTitle() {
  var titleEl = document.getElementById("headerTitle");
  if (titleEl) {
    titleEl.innerHTML =
      '<button class="btn-premium-icon" id="menuBtn" onclick="toggleSidebar()" aria-label="Open menu">' +
      '<i class="fas fa-bars"></i>' +
      "</button>" +
      getAdminHeaderTitle();
  }
}

function setView(v) {
  adminCurrentView = v;
  setAdminHeaderTitle();
  var bar = document.getElementById("summaryBar");
  if (bar) bar.style.display = v === "home" ? "" : "none";
}

function escAttr(s) {
  if (!s) return "";
  return String(s).replace(/"/g, "&quot;").replace(/&/g, "&amp;");
}

/* PART D - design system (premium theme from rm_.js) */
var ADMIN_CSS = `/* ============================================
   HT - Royal Stay Hotel Booking
   Design System & Reusable Classes
   Dark Ivory + Champagne Gold + Ember Red
   ============================================ */

/* CSS Variables */
:root {
  /* Ember Red Palette (Primary Accent) */
  --ember: #8A2A1B;
  --ember-dark: #6E1F12;
  --ember-deep: #57160C;
  --ember-light: #A13A26;
  --ember-bright: #B0452E;

  /* Gold Palette (Champagne Accent) */
  --gold: #C9A45C;
  --gold-light: #E0C489;
  --gold-dark: #A8863F;
  --gold-bg: #F7F0E2;
  --gold-rgb: 201, 164, 92;

  /* Neutral Palette (Ivory / Charcoal) */
  --brown: #6B4A2E;
  --charcoal: #1F1B15;
  --charcoal-2: #2B2419;
  --charcoal-3: #372D20;
  --cream: #F7F0E2;
  --cream-2: #EFE4CC;
  --surface: #FFFDF6;
  --surface-2: #FFF9EC;
  --ink: #2C241A;
  --muted: #8A7C66;

  /* Legacy Aliases */
  --emr: #8A2A1B;
  --emr-dark: #6E1F12;
  --emr-light: #A13A26;
  --emr-bright: #B0452E;
  --gray-dark: #6B4A2E;
  --gray: #8A7C66;
  --gray-light: #B9AE97;
  --gray-bg: #EFE4CC;
  --gray-surface: #F7F0E2;

  /* Section Colors */
  --section-arrival-bg: #F6EBD2;
  --section-arrival-border: #8A2A1B;
  --section-gold-bg: #FBF4E3;
  --section-gold-border: #C9A45C;
  --section-royal-bg: #F4EAD5;
  --section-royal-border: #A8863F;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-2xl: 24px;
  --spacing-3xl: 32px;

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(31, 27, 21, 0.06);
  --shadow-md: 0 4px 12px rgba(31, 27, 21, 0.08);
  --shadow-lg: 0 8px 24px rgba(31, 27, 21, 0.12);
  --shadow-xl: 0 12px 32px rgba(31, 27, 21, 0.16);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-2xl: 22px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}

/* ============================================
   BASE STYLES
   ============================================ */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background:
    radial-gradient(circle at 88% -8%, rgba(201, 164, 92, 0.12), transparent 32%),
    radial-gradient(circle at -8% 100%, rgba(138, 42, 27, 0.07), transparent 38%),
    radial-gradient(rgba(201, 164, 92, 0.07) 1px, transparent 1px),
    linear-gradient(180deg, #FBF5E7 0%, #F4EAD5 100%);
  background-size: 100% 100%, 100% 100%, 26px 26px, 100% 100%;
  background-attachment: fixed;
  font-family: var(--font-family);
  min-height: 100vh;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============================================
   TYPOGRAPHY
   ============================================ */
.text-emr { color: var(--emr) !important; }
.text-emr-dark { color: var(--ember-deep) !important; }
.text-emr-bright { color: var(--emr-bright) !important; }
.text-gold { color: var(--gold) !important; }
.text-gold-dark { color: var(--gold-dark) !important; }
.text-gray { color: var(--gray) !important; }
.text-gray-dark { color: var(--gray-dark) !important; }
.text-gray-light { color: var(--gray-light) !important; }
.text-white { color: #fff !important; }
.text-danger { color: #dc3545 !important; }

.font-serif { font-family: Georgia, 'Times New Roman', serif; }
.font-mono { font-family: 'Courier New', monospace; }

.fw-medium { font-weight: var(--font-weight-medium) !important; }
.fw-semibold { font-weight: var(--font-weight-semibold) !important; }

.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }

/* ============================================
   BACKGROUNDS
   ============================================ */
.bg-emr { background: var(--emr) !important; }
.bg-emr-dark { background: var(--emr-dark) !important; }
.bg-emr-gradient {
  background: linear-gradient(135deg, var(--emr-dark) 0%, var(--emr) 100%) !important;
}
.bg-gold { background: var(--gold) !important; }
.bg-gold-light { background: var(--gold-bg) !important; }
.bg-gray-surface { background: var(--gray-surface) !important; }
.bg-white { background: #ffffff !important; }

/* ============================================
   BORDERS
   ============================================ */
.border-emr { border-color: var(--emr) !important; }
.border-gold { border-color: var(--gold) !important; }
.border-gray { border-color: var(--gray-light) !important; }
.border-gray-light { border-color: var(--gray-bg) !important; }

.border-2 { border-width: 2px !important; }
.border-3 { border-width: 3px !important; }

.border-bottom-gold {
  border-bottom: 3px solid var(--gold) !important;
}

/* ============================================
   BORDER RADIUS
   ============================================ */
.rounded-md { border-radius: var(--radius-md) !important; }
.rounded-lg { border-radius: var(--radius-lg) !important; }
.rounded-xl { border-radius: var(--radius-xl) !important; }
.rounded-full { border-radius: var(--radius-full) !important; }

/* ============================================
   SHADOWS
   ============================================ */
.shadow-sm { box-shadow: var(--shadow-sm) !important; }
.shadow-md { box-shadow: var(--shadow-md) !important; }
.shadow-lg { box-shadow: var(--shadow-lg) !important; }
.shadow-xl { box-shadow: var(--shadow-xl) !important; }

.shadow-hover {
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}
.shadow-hover:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

/* ============================================
   CARDS (Bootstrap Extension)
   ============================================ */
.card-premium {
  background: linear-gradient(180deg, #FFFDF6, #FFF9EC);
  border: 1px solid rgba(201, 164, 92, 0.38);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
  overflow: hidden;
}
.card-premium:hover {
  box-shadow: var(--shadow-md);
}

.card-premium .card-header-premium {
  background: linear-gradient(135deg, #6E1F12, #8A2A1B);
  color: var(--gold-light);
  padding: var(--spacing-lg);
  border-bottom: 3px solid var(--gold);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-base);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* ============================================
   BUTTONS (Bootstrap Extension)
   ============================================ */
.btn-premium {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: 10px 24px;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition-base);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.btn-premium-primary {
  background: linear-gradient(135deg, #A13A26, #6E1F12);
  color: #FBEEDD;
  border-color: rgba(224, 196, 137, 0.35);
}
.btn-premium-primary:hover {
  background: var(--ember);
  color: #FBEEDD;
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.btn-premium-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-premium-secondary {
  background: var(--surface);
  color: var(--ink);
  border-color: rgba(201, 164, 92, 0.55);
}
.btn-premium-secondary:hover {
  background: var(--gold-bg);
  border-color: var(--gold);
}

.btn-premium-danger {
  background: #dc3545;
  color: #fff;
  border-color: #dc3545;
}
.btn-premium-danger:hover {
  background: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-premium-sm {
  padding: 6px 16px;
  font-size: var(--font-size-sm);
}

.btn-premium-lg {
  padding: 12px 32px;
  font-size: var(--font-size-lg);
}

.btn-premium-icon {
  width: 38px;
  height: 38px;
  padding: 0;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(var(--gold-rgb), 0.2);
  color: #fff;
  font-size: 18px;
  transition: all var(--transition-base);
}
.btn-premium-icon:hover {
  background: rgba(var(--gold-rgb), 0.25);
  border-color: var(--gold);
  transform: scale(1.1);
}

.btn-premium:disabled,
.btn-premium.loading {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-premium .spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* ============================================
   FORMS (Bootstrap Extension)
   ============================================ */
.form-control-premium {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid rgba(201, 164, 92, 0.45);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  color: var(--ink);
  background: var(--surface);
  transition: all var(--transition-base);
  outline: none;
}
.form-control-premium:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(var(--gold-rgb), 0.15);
}
.form-control-premium::placeholder {
  color: var(--gray-light);
  opacity: 0.7;
}
.form-control-premium.is-invalid {
  border-color: #dc3545;
}
.form-control-premium.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
}

.form-select-premium {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid rgba(201, 164, 92, 0.45);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  color: var(--ink);
  background: var(--surface);
  transition: all var(--transition-base);
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238A7C66' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}
.form-select-premium:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(var(--gold-rgb), 0.15);
}

.form-label-premium {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--brown);
  margin-bottom: 4px;
  display: block;
}

.form-label-premium .required {
  color: #dc3545;
}

.form-hint {
  font-size: var(--font-size-xs);
  color: var(--gray);
  margin-top: 3px;
  font-style: italic;
}

.form-group-premium {
  margin-bottom: var(--spacing-md);
}

.form-row-premium {
  display: flex;
  gap: var(--spacing-md);
}
.form-row-premium > * {
  flex: 1;
}

/* ============================================
   TABLES (Bootstrap Extension)
   ============================================ */
.table-premium {
  width: 100%;
  border-collapse: collapse;
}
.table-premium thead {
  position: sticky;
  top: 0;
  z-index: 10;
}
.table-premium thead th {
  background: var(--emr);
  color: var(--gold);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 14px 8px;
  border: none;
  white-space: nowrap;
  text-align: center;
  font-weight: var(--font-weight-bold);
  border-bottom: 3px solid var(--gold);
}
.table-premium tbody td {
  padding: 10px 8px;
  font-size: var(--font-size-sm);
  vertical-align: middle;
  border-color: #eee;
  text-align: center;
  color: var(--gray-dark);
  transition: background var(--transition-fast);
}
.table-premium tbody tr {
  transition: background var(--transition-fast);
}
.table-premium tbody tr:hover {
  background: var(--gold-bg);
}
.table-premium tbody tr:nth-child(even) {
  background: #fafafa;
}
.table-premium tbody tr:nth-child(even):hover {
  background: var(--gold-bg);
}
.table-premium tbody tr.row-selected {
  background: var(--gold-bg);
  border-left: 3px solid var(--gold);
}

.table-container-premium {
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: 1px solid var(--gray-bg);
  margin: var(--spacing-lg);
}

.table-scroll-premium {
  max-height: calc(100vh - 210px);
  overflow-y: auto;
  overflow-x: auto;
}

.table-scroll-premium table {
  min-width: 1000px;
}

/* ============================================
   SIDEBAR
   ============================================ */
.sidebar-overlay-premium {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(31, 27, 21, 0.6);
  z-index: 10000;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-slow), visibility var(--transition-slow);
  backdrop-filter: blur(2px);
}
.sidebar-overlay-premium.visible {
  opacity: 1;
  visibility: visible;
}

.sidebar-premium {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100%;
  background: #fff;
  z-index: 10001;
  box-shadow: var(--shadow-xl);
  transform: translateX(-100%);
  transition: transform var(--transition-slow);
  display: flex;
  flex-direction: column;
}
.sidebar-premium.open {
  transform: translateX(0);
}

.sidebar-premium .sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #241D12 0%, #1B1711 55%, #201A11 100%);
  border-bottom: 3px solid var(--gold);
  color: #FFF8E7;
}

.sidebar-premium .sidebar-menu {
  padding: var(--spacing-sm) 0;
  flex: 1;
  overflow-y: auto;
}

.sidebar-premium .sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  color: var(--gray-dark);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  border-bottom: 1px solid var(--gray-bg);
  position: relative;
}
.sidebar-premium .sidebar-item:hover {
  background: var(--gold-bg);
  color: var(--emr);
}
.sidebar-premium .sidebar-item.active {
  background: var(--gold-bg);
  color: var(--emr);
  border-left: 3px solid var(--gold);
  font-weight: var(--font-weight-semibold);
}
.sidebar-premium .sidebar-item i {
  font-size: var(--font-size-lg);
  width: 20px;
  text-align: center;
  color: var(--emr);
  transition: transform var(--transition-fast);
}
.sidebar-premium .sidebar-item:hover i {
  transform: translateX(2px);
}

/* ============================================
   MODALS (Bootstrap Extension)
   ============================================ */
.modal-premium .modal-content {
  border: 3px solid var(--emr);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.modal-premium .modal-header {
  background: linear-gradient(135deg, var(--emr-dark), var(--emr));
  color: var(--gold);
  padding: var(--spacing-lg);
  border-bottom: 3px solid var(--gold);
}

.modal-premium .modal-body {
  padding: 0;
  overflow-y: auto;
}

.modal-premium .modal-footer {
  padding: var(--spacing-lg);
  border-top: 2px solid var(--gray-bg);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.modal-backdrop-premium {
  backdrop-filter: blur(4px);
}

/* ============================================
   HEADER / NAVBAR
   ============================================ */
.header-premium {
  position: sticky;
  top: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #241D12 0%, #1B1711 55%, #201A11 100%);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  border-bottom: 3px solid var(--gold);
}

.header-premium .header-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: #FFF8E7;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: Georgia, 'Times New Roman', serif;
  letter-spacing: 0.5px;
}

.header-premium .header-title .icon {
  font-size: 26px;
  color: var(--gold);
}

.header-premium .header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* ============================================
   SUMMARY BAR
   ============================================ */
.summary-bar-premium {
  background: var(--surface);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm) var(--spacing-lg);
  border-bottom: 1px solid var(--gray-bg);
  box-shadow: var(--shadow-sm);
}

/* ============================================
   BADGES
   ============================================ */
.badge-premium {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 14px;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  white-space: nowrap;
}

.badge-premium-emr {
  background: var(--emr);
  color: var(--gold);
  border: 1px solid rgba(var(--gold-rgb), 0.4);
}

.badge-premium-gold {
  background: var(--gold);
  color: var(--emr-dark);
  font-weight: var(--font-weight-bold);
}

.badge-premium-outline {
  background: transparent;
  border: 1px solid currentColor;
}

/* ============================================
   SCROLLBAR
   ============================================ */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--gray-surface);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: var(--emr);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--emr-dark);
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}
@keyframes floatBlob {
  0%   { background-position: 0% 0%, 100% 100%; }
  50%  { background-position: 100% 100%, 0% 0%; }
  100% { background-position: 0% 0%, 100% 100%; }
}
@keyframes ht-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.animate-fade-in { animation: fadeIn var(--transition-slow) ease; }
.animate-fade-in-up { animation: fadeInUp var(--transition-slow) ease; }
.animate-scale-in { animation: scaleIn var(--transition-base) ease; }
.animate-slide-in-left { animation: slideInLeft var(--transition-slow) ease; }

/* Skeleton Loading */
.skeleton {
  background: linear-gradient(90deg, var(--gray-bg) 25%, var(--gray-surface) 50%, var(--gray-bg) 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ============================================
   HERO
   ============================================ */
.ht-hero {
  background: linear-gradient(135deg, var(--emr-dark) 0%, var(--emr) 55%, var(--emr-light) 100%);
  border-radius: var(--radius-xl);
  padding: 26px;
  color: #fff;
  position: relative;
  overflow: hidden;
  margin: var(--spacing-lg);
}
.ht-hero::after {
  content: "";
  position: absolute;
  right: -70px;
  top: -70px;
  width: 230px;
  height: 230px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--gold-rgb), 0.35), transparent 70%);
}
.ht-hero .hero-title {
  font-size: 26px;
  font-weight: 800;
  font-family: Georgia, 'Times New Roman', serif;
  color: #fff;
}
.ht-hero .hero-title .gold { color: var(--gold); }
.ht-hero .hero-sub {
  color: rgba(255, 255, 255, 0.82);
  font-size: 13px;
  margin: 6px 0 14px;
  max-width: 520px;
}
.ht-hero .hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ht-hero .hero-chip {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(var(--gold-rgb), 0.4);
  color: var(--gold-light);
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
}

/* ============================================
   STAT CARDS
   ============================================ */
.ht-stat-card {
  background: #fff;
  border: 1px solid var(--gray-bg);
  border-radius: var(--radius-lg);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-sm);
}
.ht-stat-card .stat-ico {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.ht-stat-card .stat-val {
  font-size: 24px;
  font-weight: 800;
  color: var(--emr-dark);
  line-height: 1;
}
.ht-stat-card .stat-lbl {
  font-size: 11px;
  color: var(--gray);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.ht-stat-card .stat-ico.emr { background: var(--emr); color: var(--gold); }
.ht-stat-card .stat-ico.gold { background: var(--gold); color: var(--emr-dark); }
.ht-stat-card .stat-ico.red { background: #FDECEA; color: #c0392b; }
.ht-stat-card .stat-ico.green { background: #F6EBD2; color: #8A2A1B; }

/* ============================================
   SECTION TITLE
   ============================================ */
.ht-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: var(--spacing-lg) var(--spacing-lg) var(--spacing-md);
}
.ht-section-title .bar {
  width: 4px;
  height: 22px;
  background: var(--gold);
  border-radius: 2px;
}
.ht-section-title h5 {
  margin: 0;
  font-weight: 800;
  color: var(--emr-dark);
  font-size: 16px;
}
.ht-section-title .sub {
  color: var(--gray);
  font-size: 12px;
}

/* ============================================
   ROOM CARDS
   ============================================ */
.ht-room-card {
  background: #fff;
  border: 1px solid var(--gray-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base), transform var(--transition-base);
  display: flex;
  flex-direction: column;
}
.ht-room-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.ht-room-card .room-img {
  height: 170px;
  background: linear-gradient(135deg, var(--emr-dark), var(--emr-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(var(--gold-rgb), 0.9);
  font-size: 44px;
  position: relative;
}
.ht-room-card .room-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ht-room-card .room-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.ht-room-card .room-name {
  font-weight: 700;
  color: var(--emr-dark);
  font-size: 15px;
}
.ht-room-card .room-meta {
  font-size: 12px;
  color: var(--gray);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 6px 0;
}
.ht-room-card .room-meta i {
  color: var(--gold-dark);
  width: 16px;
  text-align: center;
}
.ht-price {
  font-weight: 800;
  color: var(--gold-dark);
  font-size: 18px;
}
.ht-price small {
  font-size: 11px;
  color: var(--gray);
  font-weight: 600;
}
.ht-amenity {
  display: inline-block;
  font-size: 11px;
  color: var(--emr);
  background: var(--section-arrival-bg);
  border: 1px solid #BFE3D2;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  margin: 2px 3px 2px 0;
}
.ht-avail-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-full);
}
.ht-avail-badge.ok { background: #F6EBD2; color: #8A2A1B; }
.ht-avail-badge.no { background: #FDECEA; color: #c0392b; }

/* ============================================
   BOOKING STEPPER
   ============================================ */
.ht-stepper {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: var(--gray-surface);
  border-bottom: 2px solid var(--gray-bg);
  overflow-x: auto;
}
.ht-stepper .stp {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
  min-width: 54px;
}
.ht-stepper .stp-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  background: #fff;
  border: 2px solid var(--gray-light);
  color: var(--gray);
  transition: all var(--transition-fast);
}
.ht-stepper .stp-label {
  font-size: 10px;
  color: var(--gray);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
}
.ht-stepper .stp.done .stp-circle {
  background: var(--emr);
  border-color: var(--emr);
  color: var(--gold);
}
.ht-stepper .stp.done .stp-label {
  color: var(--gray-dark);
}
.ht-stepper .stp.active .stp-circle {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--emr-dark);
  box-shadow: 0 0 0 4px rgba(var(--gold-rgb), 0.25);
}
.ht-stepper .stp.active .stp-label {
  color: var(--emr);
}

/* ============================================
   OPTION CARDS (Room / Package selection)
   ============================================ */
.ht-option-card {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px;
  border: 2px solid var(--gray-bg);
  border-radius: var(--radius-md);
  background: #fff;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}
.ht-option-card:hover {
  border-color: var(--gold);
  background: var(--gold-bg);
}
.ht-option-card.selected {
  border-color: var(--emr);
  background: var(--section-arrival-bg);
  box-shadow: 0 0 0 3px rgba(46, 139, 102, 0.15);
}
.ht-option-card.selected.sold-out {
  border-color: #dc3545;
  background: #FDECEA;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.12);
}
.ht-option-card .opt-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.ht-option-card .opt-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--gold-bg);
  color: var(--gold-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.ht-option-card .opt-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--emr-dark);
}
.ht-option-card .opt-sub {
  font-size: 12px;
  color: var(--gray);
  margin-top: 1px;
}
.ht-option-card .opt-price {
  font-weight: 700;
  color: var(--gold-dark);
  font-size: 13px;
  white-space: nowrap;
}
.ht-option-card .opt-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--gold-bg);
  border: 1px solid var(--gold);
  color: var(--gold-dark);
  margin-top: 3px;
}

/* Addon rows */
.ht-addon-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid var(--gray-bg);
  border-radius: var(--radius-md);
  background: #fff;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: 8px;
}
.ht-addon-row:hover {
  border-color: var(--gold);
  background: var(--gold-bg);
}
.ht-addon-row.selected {
  border-color: var(--emr);
  background: var(--section-arrival-bg);
}
.ht-addon-row input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--emr);
  flex-shrink: 0;
}
.ht-addon-row .ad-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--emr-dark);
}
.ht-addon-row .ad-sub {
  font-size: 12px;
  color: var(--gray);
}
.ht-addon-row .ad-price {
  font-weight: 700;
  color: var(--gold-dark);
  font-size: 13px;
  white-space: nowrap;
  margin-left: auto;
}

/* Extra Particulars rows (checkbox + editable per-night amount) */
.ht-extra-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ht-extra-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 2px solid var(--gray-bg);
  border-radius: var(--radius-md);
  background: #fff;
  transition: all var(--transition-fast);
}
.ht-extra-row:hover {
  border-color: var(--gold);
  background: var(--gold-bg);
}
.ht-extra-row input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--emr);
  flex-shrink: 0;
}
.ht-extra-row .be-extra-dd-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--emr-dark);
}
.ht-extra-row .text-gray {
  margin-left: auto;
  white-space: nowrap;
  font-size: 12px;
}
.ht-extra-row .beExtraAmt {
  padding: 4px 8px;
  font-size: 13px;
}

/* Age rules */
.ht-age-rule {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--gold-bg);
  border: 1px solid var(--gold);
  color: var(--gold-dark);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

/* Child row */
.ht-child-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

/* Summary table */
.ht-sum-table {
  width: 100%;
  font-size: 13px;
}
.ht-sum-table td {
  padding: 7px 4px;
  border-bottom: 1px solid var(--gray-bg);
  color: var(--gray-dark);
}
.ht-sum-table td:last-child {
  text-align: right;
  font-weight: 600;
  color: var(--emr-dark);
}
.ht-sum-table .tot td {
  border-bottom: none;
  padding-top: 10px;
  font-weight: 800;
  color: var(--emr-dark);
  font-size: 15px;
}
.ht-sum-table .tot td:last-child {
  color: var(--gold-dark);
  font-size: 17px;
}

/* ============================================
   POLICY CARDS
   ============================================ */
.ht-policy-card {
  background: #fff;
  border: 1px solid var(--gray-bg);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  height: 100%;
}
.ht-policy-card .pc-ico {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--gold-bg);
  color: var(--gold-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  margin-bottom: 8px;
}
.ht-policy-card .pc-title {
  font-weight: 700;
  color: var(--emr-dark);
  font-size: 14px;
}
.ht-policy-card .pc-text {
  font-size: 12px;
  color: var(--gray);
  margin-top: 4px;
  line-height: 1.5;
}

/* ============================================
   RESTAURANT
   ============================================ */
.ht-menu-card {
  background: #fff;
  border: 1px solid var(--gray-bg);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
}
.ht-menu-title {
  font-weight: 800;
  color: var(--emr-dark);
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 2px solid var(--gold);
  padding-bottom: 8px;
  margin-bottom: 10px;
}
.ht-menu-title i {
  color: var(--gold-dark);
}
.ht-menu-item {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 7px 2px;
  border-bottom: 1px dashed var(--gray-bg);
  font-size: 13px;
}
.ht-menu-item .mi-name {
  color: var(--gray-dark);
  font-weight: 500;
}
.ht-menu-item .mi-price {
  color: var(--gold-dark);
  font-weight: 700;
  white-space: nowrap;
}
.ht-timing-card {
  background: var(--section-arrival-bg);
  border: 1px solid #BFE3D2;
  border-radius: var(--radius-md);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
.ht-timing-card i { color: var(--emr); width: 18px; text-align: center; }
.ht-timing-card b { color: var(--emr-dark); }
.ht-timing-card span { color: var(--gray-dark); }

/* ============================================
   GALLERY
   ============================================ */
.ht-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}
.ht-gallery-item {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  cursor: pointer;
  background: linear-gradient(135deg, var(--emr), var(--emr-light));
  box-shadow: var(--shadow-sm);
}
.ht-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}
.ht-gallery-item:hover img {
  transform: scale(1.05);
}
.ht-gallery-item .cap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px 12px 8px;
  background: linear-gradient(transparent, rgba(31, 27, 21, 0.85));
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}
.ht-gallery-item .ph {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(var(--gold-rgb), 0.9);
  font-size: 40px;
}

/* ============================================
   REVIEWS
   ============================================ */
.ht-review-card {
  background: #fff;
  border: 1px solid var(--gray-bg);
  border-radius: var(--radius-lg);
  padding: 14px;
  box-shadow: var(--shadow-sm);
  height: 100%;
}
.ht-review-card .rv-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--emr);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}
.ht-review-card .rv-name {
  font-weight: 700;
  color: var(--emr-dark);
  font-size: 13px;
}
.ht-review-card .rv-room {
  font-size: 11px;
  color: var(--gray);
}
.ht-review-card .rv-text {
  font-size: 13px;
  color: var(--gray-dark);
  margin-top: 8px;
  line-height: 1.5;
}
.ht-star {
  color: #d3d3d3;
  font-size: 15px;
}
.ht-star.filled {
  color: var(--gold);
}
.ht-rating-box {
  background: var(--emr);
  color: var(--gold);
  border-radius: var(--radius-lg);
  padding: 18px;
  text-align: center;
}
.ht-rating-box .avg {
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
}
.ht-rating-box .lbl {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

/* ============================================
   STATUS BADGE
   ============================================ */
.ht-status {
  display: inline-block;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

/* ============================================
   EMPTY STATE
   ============================================ */
.ht-empty {
  text-align: center;
  padding: 48px 16px;
  color: var(--gray);
}
.ht-empty i {
  font-size: 40px;
  color: var(--gray-light);
  display: block;
  margin-bottom: 10px;
}
.ht-empty b {
  color: var(--gray-dark);
  font-size: 14px;
}
.ht-empty p {
  font-size: 12px;
}

/* ============================================
   UTILITY CLASSES
   ============================================ */
.gap-xs { gap: var(--spacing-xs); }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cursor-pointer { cursor: pointer; }
.select-none { user-select: none; }

.opacity-0 { opacity: 0; }
.opacity-50 { opacity: 0.5; }
.opacity-100 { opacity: 1; }

.transition-all { transition: all var(--transition-base); }
.transition-transform { transition: transform var(--transition-base); }
.transition-opacity { transition: opacity var(--transition-base); }

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 600px) {
  .header-premium {
    height: auto;
    min-height: 52px;
    padding: 6px 12px;
  }
  .header-premium .header-title {
    font-size: var(--font-size-lg);
    gap: 6px;
  }

  .form-row-premium {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .summary-bar-premium {
    padding: var(--spacing-sm) var(--spacing-md);
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .table-container-premium {
    margin: var(--spacing-sm);
    border-radius: var(--radius-md);
  }

  .ht-hero {
    margin: var(--spacing-sm);
    padding: 18px;
  }
  .ht-hero .hero-title {
    font-size: 20px;
  }
  .ht-gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 0 var(--spacing-sm) var(--spacing-sm);
  }
  .ht-option-card {
    flex-direction: column;
    gap: 6px;
  }
}

/* ============================================
   PRINT STYLES
   ============================================ */
@media print {
  body { background: #fff; }
  .header-premium {
    background: var(--emr) !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .btn-premium-icon { display: none !important; }
  body.ht-print-bill * { visibility: hidden; }
  body.ht-print-bill .ht-bill-overlay,
  body.ht-print-bill .ht-bill-overlay * { visibility: visible; }
  body.ht-print-bill .ht-bill-overlay {
    position: absolute !important;
    inset: 0 !important;
    background: #fff !important;
    backdrop-filter: none !important;
    padding: 0 !important;
    display: block !important;
    overflow: visible !important;
  }
  body.ht-print-bill .ht-bill-stage {
    max-width: none !important;
    max-height: none !important;
    width: 100% !important;
  }
  body.ht-print-bill .ht-bill-scroll {
    overflow: visible !important;
    max-height: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  body.ht-print-bill .ht-bill-actions { display: none !important; }
  .table-container-premium {
    max-height: none;
    overflow: visible;
    box-shadow: none;
    margin: 0;
    border-radius: 0;
    border: none;
  }
  @page { margin: 8mm; }
}
`;

function injectAdminStyles() {
  if (adminStylesInjected) return;
  var st = document.createElement("style");
  st.id = "htAdminStyles";
  st.innerHTML =
    ADMIN_CSS +
    "#adminPage{position:fixed;inset:0;z-index:1000;overflow-y:auto;overscroll-behavior:contain;background:var(--surface,#fffdf6);isolation:isolate;}" +
    /* While the admin page is open, hide the user-site structure so it
       cannot bleed through (its navbar/bars use z-index up to 1050).
       Explicit child list: Bootstrap .modal/.modal-backdrop (also body
       children) stay visible above #adminPage. */
    "body.admin-open > #htNav,body.admin-open > #childStrip," +
    "body.admin-open > main,body.admin-open > #htFooter," +
    "body.admin-open > #bottomBar,body.admin-open > #paySheet," +
    "body.admin-open > #payOverlay{display:none !important;}" +
    "body.admin-open{overflow:hidden;}";
  document.head.appendChild(st);
  adminStylesInjected = true;
}

/* PART E - shell render / open / close */
var adminPanelFns = {
  home: "showDashboard",
  rooms: "showRooms",
  addRoom: "showAddRoom",
  booking: "openBookingModal",
  restaurant: "showRestaurant",
  reviews: "showReviews",
  Save: "showPrintSettings",
};

function adminMenuVisible(code) {
  var hidden = (
    (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].colsToHideMenu) ||
    ""
  )
    .split(",")
    .map(function (k) {
      return k.trim().toLowerCase();
    })
    .filter(function (k) {
      return k;
    });
  return hidden.indexOf(code) === -1;
}

function renderAdminShell() {
  var navItems = [
    {
      code: "hm",
      html: '<a class="sidebar-item" onclick="handleMenuAction(\'home\')" role="button"><i class="fas fa-chart-line"></i> Dashboard</a>',
    },
    {
      code: "rm",
      html: '<a class="sidebar-item" onclick="handleMenuAction(\'rooms\')" role="button"><i class="fas fa-bed"></i> Manage Rooms</a>',
    },
    // {
    //   code: "ar",
    //   html: '<a class="sidebar-item" onclick="handleMenuAction(\'addRoom\')" role="button"><i class="fas fa-plus-circle"></i> Add Room</a>',
    // },
    {
      code: "bs",
      html: '<a class="sidebar-item" onclick="handleMenuAction(\'booking\')" role="button"><i class="fas fa-calendar-plus"></i> New Booking</a>',
    },
    {
      code: "rt",
      html: '<a class="sidebar-item" onclick="handleMenuAction(\'restaurant\')" role="button"><i class="fas fa-utensils"></i> Restaurant</a>',
    },
    {
      code: "rw",
      html: '<a class="sidebar-item" onclick="handleMenuAction(\'reviews\')" role="button"><i class="fas fa-star"></i> Reviews</a>',
    },
  ].filter(function (m) {
    return adminMenuVisible(m.code);
  });

  var page = document.createElement("div");
  page.id = "adminPage";
  page.innerHTML =
    '<header class="header-premium">' +
    '<div class="header-title" id="headerTitle">' +
    '<button class="btn-premium-icon" id="menuBtn" onclick="toggleSidebar()" aria-label="Open menu">' +
    '<i class="fas fa-bars"></i>' +
    "</button>" +
    getAdminHeaderTitle() +
    "</div>" +
    '<div class="header-actions">' +
    '<button class="btn-premium-icon" id="adminCloseBtn" title="Back to site" aria-label="Back to site" onclick="closeAdminPage()">' +
    '<i class="fas fa-house"></i>' +
    "</button>" +
    "</div>" +
    "</header>" +
    '<div id="sidebarOverlay" class="sidebar-overlay-premium" onclick="toggleSidebar()"></div>' +
    '<aside id="appSidebar" class="sidebar-premium">' +
    '<div class="sidebar-header">' +
    '<span class="fw-bold"><i class="fas fa-hotel me-2 text-gold"></i>Menu</span>' +
    '<button class="btn-close btn-close-white" onclick="toggleSidebar()" aria-label="Close menu"></button>' +
    "</div>" +
    '<nav class="sidebar-menu">' +
    navItems
      .map(function (m) {
        return m.html;
      })
      .join("") +
    "</nav>" +
    "</aside>" +
    '<div class="summary-bar-premium" id="summaryBar">' +
    '<div class="d-flex align-items-center gap-md flex-grow-1">' +
    '<span class="badge-premium badge-premium-gold" id="totalBadge">0</span>' +
    '<input type="text" id="searchBox" class="form-control-premium" placeholder="Search bookings..." style="flex:1; min-width:150px;">' +
    "</div>" +
    '<div class="d-flex align-items-center gap-sm mt-2 mt-md-0">' +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium mb-1" for="dateFrom">From</label>' +
    '<input type="date" id="dateFrom" class="form-control-premium" style="width:140px;">' +
    "</div>" +
    '<div class="form-group-premium mb-0">' +
    '<label class="form-label-premium mb-1" for="dateTo">To</label>' +
    '<input type="date" id="dateTo" class="form-control-premium" style="width:140px;">' +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div id="htContainer" class="animate-fade-in-up"></div>';

  document.body.appendChild(page);

  var searchInput = document.getElementById("searchBox");
  if (searchInput) {
    document.getElementById("dateFrom").addEventListener("input", function () {
      renderTable();
      searchInput.value = "";
    });
    document.getElementById("dateTo").addEventListener("input", function () {
      renderTable();
      searchInput.value = "";
    });
    searchInput.addEventListener("input", function () {
      renderTable();
    });
  }
}

async function openAdminPage(action) {
  if (action === "Publish App") {
    if (typeof showPrintSettings === "function") showPrintSettings();
    return;
  }

  injectAdminStyles();
  if (!document.getElementById("adminPage")) renderAdminShell();
  document.body.classList.add("admin-open");

  // One-time cleanup of old admin seed data (Unsplash URLs, fake rooms)
  if (!localStorage.getItem("ht_seed_cleaned")) {
    try {
      await dbDexieManager.deleteRecords(dbnm, "rm");
      await dbDexieManager.deleteRecords(dbnm, "rb");
      await dbDexieManager.deleteRecords(dbnm, "c");
      localStorage.setItem("ht_seed_cleaned", "1");
      console.log("🧹 Old admin seed data cleared");
    } catch (e) {}
  }

  // fetch rm.da config once per session (room types/amenities lists);
  // needs cfgMt.js (htImgSrc) — guarded for direct deep links
  if (
    !window[my1uzr.worknOnPg].clientConfig &&
    typeof loadRoomConfig === "function" &&
    typeof htImgSrc === "function"
  ) {
    await loadRoomConfig(); // must resolve before rendering pages
  }

  try {
    await adminLoadDataFromDB();
  } catch (e) {
    console.error("adminLoadDataFromDB failed:", e);
  }

  action = action || "home";
  var fnName = adminPanelFns[action] || "showDashboard";
  try {
    if (typeof window[fnName] === "function") window[fnName]();
    else if (typeof showDashboard === "function") showDashboard();
  } catch (e) {
    console.error("Admin page function failed:", fnName, e);
  }
}

function removeAdminStyles() {
  var st = document.getElementById("htAdminStyles");
  if (st) st.remove();
  adminStylesInjected = false;
}

function closeAdminPage() {
  // hide any admin-opened bootstrap modals and drop their backdrops so
  // nothing lingers over the user site
  if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
    var openModals = document.querySelectorAll(".modal.show");
    for (var mi = 0; mi < openModals.length; mi++) {
      try {
        var inst = bootstrap.Modal.getInstance(openModals[mi]);
        if (inst) inst.hide();
      } catch (e) {}
    }
  }
  document.querySelectorAll(".modal-backdrop").forEach(function (b) {
    b.remove();
  });
  document.body.classList.remove("modal-open");

  var page = document.getElementById("adminPage");
  if (page) page.remove();
  document.body.classList.remove("admin-open");

  // drop the admin theme entirely — several class names (.ht-hero etc.)
  // exist in BOTH themes with different layouts, so leaving it injected
  // would keep restyling the user site after close
  removeAdminStyles();
  adminCurrentView = "home";

  // refresh user-side data (admin edits may have changed rooms) and
  // restore the user home through the full switchView path
  if (typeof applyClientConfigToPublic === "function")
    applyClientConfigToPublic();
  if (typeof showHome === "function") showHome();
  else if (typeof renderHome === "function") renderHome();
}

// Load the business config (rm_.da) and apply the room master lists
// (room types, amenities, facilities, rules, beds) to the shared ht* arrays.
// Fails safe: a missing/broken .da file keeps the hardcoded defaults.
window.loadRoomConfig = async function () {
  try {
    var resp = await fetch("rm.da");
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    var cfg = await resp.json();
    if (!cfg || typeof cfg !== "object") throw new Error("bad config");
    if (cfg.bzlogo) {
      cfg.bzlogo =
        htImgSrc(cfg.bzlogo) || "https://i.postimg.cc/gJ62yjJf/my1.jpg";
    }
    window[my1uzr.worknOnPg].clientConfig = cfg;
    window.HOTEL_SLIDES = window[my1uzr.worknOnPg].clientConfig?.HOTEL_SLIDES || [];
    applyRoomLists(cfg);
    if (
      document.getElementById("roomsGrid") &&
      typeof renderRoomsGrid === "function"
    ) {
      renderRoomsGrid();
    }
  } catch (err) {
    console.error("Failed to load rm.da:", err);
    window[my1uzr.worknOnPg].clientConfig = {};
  }
};

/* ============================================================
   ROOMS — merged from menu/rooms.js (module 45) into ht.js
   ------------------------------------------------------------
   Admin "Room Management" listing page + openRoomBooking helper.
   Now executed in global scope so showRooms, openRoomBooking,
   updateRoomStatus, renderRoomsGrid etc. are always available.
   ============================================================ */

function getRoomAmenities(room) {
  return htAmenityLabels(room);
}

var roomStatusFilter = "all"; // all | 1 | 2 | 3 | 127

window.showRooms = function () {
  setView("rooms");
  var container = document.getElementById("htContainer");
  if (!container) return;

  var stOpts = "";
  var stAll = [{ id: "all", label: "All Statuses" }].concat(htRoomStatus);
  for (var sj = 0; sj < stAll.length; sj++) {
    var sid = String(stAll[sj].id);
    stOpts +=
      '<option value="' +
      sid +
      '"' +
      (String(roomStatusFilter) === sid ? " selected" : "") +
      ">" +
      escHtml(stAll[sj].label) +
      "</option>";
  }

  container.innerHTML =
    '<div class="ht-section-title">' +
    '<div class="bar"></div>' +
    "<h5>Room Management</h5>" +
    '<span class="sub">Manage inventory, rates &amp; availability</span>' +
    "</div>" +
    '<div class="card-premium mx-3 mx-md-4 p-2 mb-2 w-fit-content">' +
    '<div class="d-flex align-items-center gap-2 flex-wrap">' +
    '<span class="badge-premium badge-premium-gold"><i class="fas fa-filter me-1"></i>Status</span>' +
    '<select id="roomsStatusFilter" class="form-select-premium" style="max-width:220px;" onchange="applyRoomsStatusFilter()">' +
    stOpts +
    "</select>" +
    '<span class="text-sm text-gray" id="roomsFilterCount"></span>' +
    '<button class="btn-premium btn-premium-secondary" onclick="showAddRoom()">' +
    '<i class="fas fa-plus-circle me-1"></i> Add Room</button>' +
    "</div>" +
    "</div>" +
    '<div id="roomsGrid"></div>';

  renderRoomsGrid();
};

window.applyRoomsStatusFilter = function () {
  var sel = document.getElementById("roomsStatusFilter");
  if (sel) roomStatusFilter = sel.value;
  renderRoomsGrid();
};

// Seed the shared admin booking state (bookingState from menu/adminBooking.js)
// without opening the booking modal, so the details page / date picker can
// react to the selected room and dates. Requires module 46 to be loaded.
async function seedAdminBooking(roomPreset, ci, co) {
  if (typeof initBookingState !== "function") {
    try {
      await loadExe2Fn(46);
    } catch (e) {
      console.error("adminBooking load failed:", e);
    }
  }
  if (typeof initBookingState === "function") {
    // Guard against late/fire-and-forget session seeds (e.g. openBookingModal's
    // unawaited openRoomBooking, or the public "Book Now" call): never wipe a
    // stay range the user has already picked in the live booking form.
    var liveStay = bookingState && bookingState.checkin && bookingState.checkout;
    if (!liveStay) initBookingState(roomPreset, ci, co);
  }
  if (typeof getRoomById !== "function" || typeof calcNights !== "function") {
    try {
      await loadExe2Fn(42);
    } catch (e) {
      console.error("availability load failed:", e);
    }
  }
}
// Admin "Room Management" grid -> open the full admin booking modal with the
// chosen room preselected and the grid's current check-in/check-out dates.
window.openAdminRoomBooking = async function (roomId, ci, co) {
  if (typeof getRoomById !== "function" || typeof calcNights !== "function") {
    try {
      await loadExe2Fn(42);
    } catch (e) {
      console.error("availability load failed:", e);
    }
  }
  var r = getRoomById(roomId);
  if (!r) {
    showMessageModal("Info", "Room not found!", false);
    return;
  }
  if (typeof openBookingModal === "function") {
    openBookingModal(r, ci || "", co || "");
  } else {
    loadExe2Fn(46).then(function () {
      openBookingModal(r, ci || "", co || "");
    });
  }
};

window.openRoomBooking = async function (roomId, ci, co) {
  // Ensure the server-side booking session completes before seeding the
  // booking state so IndexedDB has fresh data when the calendar opens.
  try {
    var la = await dbDexieManager
      .getMaxDateRecords(dbnm, [{ tb: "rb" }]);
    clearPayload0();
    payload0.vw = 1;
    payload0.fn = 111;
    payload0.la = la;
    var resp = await fnj3(
      "https://my1.in/4/a.php",
      payload0,
      0,
      true,
      null,
      20000,
      0,
      0,
      1,
      0
    );
    if (resp && resp.su == 1) {
      await handl_rm_rspons(resp);
      if (typeof beLoadBookedDates !== "function") {
        try {
          await loadExe2Fn(46);
        } catch (e) {
          console.error("adminBooking load failed:", e);
        }
      }
      if (typeof beLoadBookedDates === "function") {
        try {
          await beLoadBookedDates(roomId);
        } catch (e) {
          console.warn("Failed to preload booked dates:", e);
        }
      }
      console.log("✅ New booking init applied");
    } else {
      console.warn(
        "New booking init failed:",
        (resp && resp.ms) || "Unknown error",
      );
    }
  } catch (e) {
    console.error("New booking init error:", e);
  }

  // Seed booking state - with or without room preselection. Does NOT open the
  // admin modal; the caller decides the next UI step (e.g. showRoomDetails).
  if (roomId) {
    if (typeof getRoomById !== "function") {
      try {
        await loadExe2Fn(42);
      } catch (e) {
        console.error("availability load failed:", e);
      }
    }
    var r = typeof getRoomById === "function" ? getRoomById(roomId) : null;
    if (!r) {
      showMessageModal("Info", "Room not found!", false);
      return;
    }
    await seedAdminBooking(r, ci || "", co || "");
  } else {
    await seedAdminBooking(null, ci || "", co || "");
  }
};

// Server room status update: update.php, fn = -4, payload same as the room
// record (a + d/e/f/g/h/i/j) with the new status in d.
window.updateRoomStatus = async function (roomId, status) {
  var r = getRoomById(roomId);
  if (!r) return;
  var val = parseInt(status, 10);
  var cur = r.d != null ? parseInt(r.d, 10) : null;
  if (cur === val) return;
  var lbl = htRoomStatusLabel(val);
  if (!window.confirm("Set room to " + lbl + "?")) {
    var resetSel = document.querySelector(
      'select[data-rmstat="' + roomId + '"]',
    );
    if (resetSel) resetSel.value = r.d;
    return;
  }
  try {
    var upd = {};
    for (var key in r) {
      if (Object.prototype.hasOwnProperty.call(r, key)) upd[key] = r[key];
    }
    upd.a = roomId;
    upd.d = val;

    clearPayload0();
    payload0.x1 = roomId;
    payload0.p = upd;
    payload0.vw = 1;
    payload0.fn = -4;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
      { tb: "rb" },
      { tb: "rm" },
      { tb: "c" },
      { tb: "r" },
    ]);

    var resp = await fnj3(
      "https://my1.in/2/update.php",
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
      await handl_rm_rspons(resp);
      await adminLoadDataFromDB();
      renderRoomsGrid();
      showMessageModal("Success", "✅ Room status updated to " + lbl, false);
    } else {
      showMessageModal("Error", resp?.ms || "Failed to update status", true);
      var failSel = document.querySelector(
        'select[data-rmstat="' + roomId + '"]',
      );
      if (failSel) failSel.value = r.d;
    }
  } catch (err) {
    showMessageModal("Info", "Error: " + err.message, false);
    var errSel = document.querySelector('select[data-rmstat="' + roomId + '"]');
    if (errSel) errSel.value = r.d;
  }
};

function renderRoomsGrid() {
  var grid = document.getElementById("roomsGrid");
  if (!grid) return;
  var from = document.getElementById("roomsFrom")?.value || todayStr();
  var to = document.getElementById("roomsTo")?.value || addDays(todayStr(), 1);

  var list = [];
  if (roomStatusFilter === "all") {
    list = adminRoomRecords.slice();
  } else {
    for (var fi = 0; fi < adminRoomRecords.length; fi++) {
      var fr = adminRoomRecords[fi];
      var fst = fr.d != null ? fr.d : fr.k;
      if (Number(fst) === Number(roomStatusFilter)) list.push(fr);
    }
  }

  // Show one card per room record, newest first (descending by record id)
  list.sort(function (a, b) {
    var ai = a.a != null ? a.a : 0;
    var bi = b.a != null ? b.a : 0;
    return bi - ai;
  });

  if (list.length === 0) {
    grid.innerHTML =
      adminRoomRecords.length === 0
        ? '<div class="ht-empty">' +
          '<i class="fas fa-bed"></i>' +
          "<b>No rooms yet</b>" +
          "<p>Room details will appear here once synced from the server.</p>" +
          "</div>"
        : '<div class="ht-empty">' +
          '<i class="fas fa-filter"></i>' +
          "<b>No rooms match this filter</b>" +
          "<button class=\"btn-premium btn-premium-secondary btn-premium-sm mt-2\" onclick=\"roomStatusFilter='all';document.getElementById('roomsStatusFilter').value='all';renderRoomsGrid()\">" +
          '<i class="fas fa-undo me-1"></i> Show All</button>' +
          "</div>";
    var emptyCount = document.getElementById("roomsFilterCount");
    if (emptyCount)
      emptyCount.textContent =
        list.length + " of " + adminRoomRecords.length + " rooms";
    return;
  }

  var cnt = document.getElementById("roomsFilterCount");
  if (cnt)
    cnt.textContent = list.length + " of " + adminRoomRecords.length + " rooms";

  var h =
    '<div class="row g-3 px-3 px-md-4 pb-4">' +
    '<div class="col-12"><span class="badge-premium badge-premium-emr">' +
    list.length +
    " Room Types</span></div>";

  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    var nights = calcNights(from, to) || 1;
    var am = getRoomAmenities(r);
    var amHtml = "";
    for (var a = 0; a < am.length; a++) {
      amHtml += '<span class="ht-amenity">' + escHtml(am[a]) + "</span>";
    }
    var occ = htRoomOccupancy(r);
    var beds = htBedLabels(r);
    var bedsHtml = "";
    for (var b = 0; b < beds.length; b++) {
      bedsHtml +=
        '<span class="ht-amenity"><i class="fas fa-bed me-1"></i>' +
        escHtml(beds[b]) +
        "</span>";
    }
    var rate = htRoomRate(r);
    var st = r.d != null ? r.d : r.k;
    var stStr = String(st);

    var hero = htRoomImage(r);
    var imgHtml = hero
      ? '<img src="' +
        escAttr(hero) +
        '" alt="' +
        escAttr(htRoomName(r)) +
        '" loading="lazy">'
      : '<i class="fas fa-bed"></i>';

    var badgeHtml =
      '<span class="ht-avail-badge ok" style="position:absolute;top:10px;right:10px;"><i class="fas fa-check-circle me-1"></i>Available</span>';

    var roomId = r.a != null ? r.a : r.e;

    var stOpts = "";
    for (var si = 0; si < htRoomStatus.length; si++) {
      var sOpt = htRoomStatus[si];
      stOpts +=
        '<option value="' +
        sOpt.id +
        '"' +
        (String(sOpt.id) === stStr ? " selected" : "") +
        ">" +
        escHtml(sOpt.label) +
        "</option>";
    }

    h +=
      '<div class="col-12 col-md-6 col-lg-4">' +
      '<div class="ht-room-card animate-fade-in-up" style="animation-delay:' +
      i * 60 +
      'ms;">' +
      '<div class="room-img">' +
      imgHtml +
      badgeHtml +
      "</div>" +
      '<div class="room-body">' +
      '<div class="d-flex justify-content-between align-items-start">' +
      '<div class="room-name">' +
      escHtml(htRoomName(r)) +
      "</div>" +
      '<div class="ht-price">₹' +
      rate +
      "<small>/night \u00b7 excl. GST</small></div>" +
      "</div>" +
      '<div class="room-meta">' +
      '<span><i class="fas fa-user"></i>Capacity: ' +
      (occ.adults + occ.children) +
      "</span>" +
      "<span>2 Included</span>" +
      (htRoomDimensions(r)
        ? '<span><i class="fas fa-vector-square"></i>' +
          escHtml(htRoomDimensions(r)) +
          "</span>"
        : "") +
      "</div>" +
      '<div class="mb-2">' +
      (amHtml || '<span class="text-sm text-gray">No amenities listed</span>') +
      "</div>" +
      (bedsHtml ? '<div class="mb-2">' + bedsHtml + "</div>" : "") +
      '<div class="mt-auto pt-2 d-flex gap-2 align-items-center">' +
      '<button class="btn-premium btn-premium-primary btn-premium-sm flex-fill" ' +
      'onclick="openAdminRoomBooking(' +
      roomId +
      ",'" +
      from +
      "','" +
      to +
      "')\"" +
      '><i class="fas fa-calendar-plus me-1"></i> New Booking</button>' +
      '<button class="btn-premium btn-premium-secondary btn-premium-sm" onclick="editRoom(' +
      roomId +
      ')"><i class="fas fa-pen me-1"></i> Edit</button>' +
      "</div>" +
      '<div class="mt-2 d-flex gap-2 align-items-center">' +
      '<span class="text-sm text-gray">Status</span>' +
      '<select class="form-select-premium" data-rmstat="' +
      roomId +
      '" onchange="updateRoomStatus(' +
      roomId +
      ', this.value)" style="font-size:12px;padding:4px 8px;max-width:180px;">' +
      stOpts +
      "</select>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";
  }
  h += "</div>";
  grid.innerHTML = h;
}

console.log("✅ admin panel merged into ht.js ready");

console.log("✅ ht.js ready ...");