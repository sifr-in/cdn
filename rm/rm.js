const tblsRequired = ["f", "fp", "c", "rm", "r", "rb", "rc"];
const moduLst = [
 { a: ",85,115,", mi: ",44,", b: "Dashboard", c: "fa-chart-line", d: "home", e: "#0d6efd" },
 { a: ",106,", mi: ",106,", b: "Manage Rooms", c: "fa-bed", d: "rooms", e: "#198754" },
  /* mi = csh "a" (script config) ids only. 114 here was an API fn id (inTbls
     "114~rb,c"), which has no csh entry, so loadExe2Fn threw and alert()ed. */
  { a: ",106,112,114,103,", mi: ",112,", b: "New Booking", c: "fa-calendar-plus", d: "booking", e: "#dc3545" },
 //{ a: ",112,114,", mi: ",112,114,", b: "Restaurant", c: "fa-utensils", d: "restaurant", e: "#fd7e14" },
 //{ a: ",112,114,111,", mi: ",112,114,111,", b: "Reviews", c: "fa-star", d: "reviews", e: "#ffc107" },
 { a: ",115,104", mi: ",51,", b: "Publish App", c: "fa-gear", d: "Publish App", e: "#6c757d" }
];
window[my1uzr.worknOnPg].moduLst = moduLst;
moduLst.hook = "onModuLstAllowed";
const inTbls = ["dontCret~", "pubilc~113,116,111", "85~c,rb,rc,r", "103~r", "104~", "106~rm", "111~rb", "112~rb,c,r", "113~rb,rc,c", "114~rb,c", "115~rb_h,rb", "116~rb,r"];
const cust_const = [
 { "a": "paymentGatewayIntegrated", "b": 0, "c": "more customiztaion", "d": "if value is 1 payment gatewy will be shown, else manual booking", "u": "url-explaining-video" },
 { "a": "showRoomAvalOnHomePg", "b": 1, "c": "more cust...", "d": "if 1 'already-booked' data is fetched on home-page load, to show `already booked` on first page itself", "u": "url-explaining-video" },
 { "a": "msgOnBookButtonifRoomBooked", "b": "This room is already booked for the selected dates.", "c": "more customiztaion", "d": "message to be shown, if room is already booked (useful when person clicks 'view all rooms' after applying booking dates & rooms have been filtered)", "u": "url-explaining-video" }
];
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

// Booking process hide keys (comma-separated, empty = show all):
// "flt" Facilities | "ia" Included Amenities | "rr" Room Rules
// | "cyp" Choose Your Package (also hides its Book Now button) | "aos" Add-on Services
window[my1uzr.worknOnPg].colsToHideBookingProcess = "cyp";
window[my1uzr.worknOnPg].changeToView = "1";
// colsToHideAddBooking — hide fields in the New Booking form (comma CSV).
// Codes: name=Guest Name | contact=Contact | id=ID Proof | email=Email |
//   ad=Adults(Male/Female) | ch=Children | room=Room | checkin/checkout=Dates |
//   timein/timeout=Times | pkg=Package | addon=Add-ons | extra=Extras |
//   adv=Advance Pay | bal=Balance Pay | paystatus=Payment Status | gst=GST line
window[my1uzr.worknOnPg].colsToHideAddBooking = "";
window[my1uzr.worknOnPg].colsToHideBookings = "nd";
window[my1uzr.worknOnPg].colsToHideMenu = "rt, rw, pl, gl,"; //hm, rm, ar, pl, bs, rt, gl, rw
window[my1uzr.worknOnPg].colsToHideGuestDetails = "ad";

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
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "rb" }, { tb: "r" }]);
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
     // A combination comes back as one joined id ("51_52_53"), one row per room.
     // Only one bill overlay fits on screen, so the stays are chained rather
     // than shown together.
     if (typeof printBookingBillsSequentially === "function") {
      printBookingBillsSequentially(resp?.x1);
     } else {
      printMyBookingById(resp?.x1);
     }
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
 // Loads the Google Fonts stylesheet from JS rather than index.html, so a
 // blocked or slow CDN can never stall first paint, and the HTML stays free of
 // font references. Deliberately not loadPromiseScript: its CSS heuristic is
 // endsWith(".css") || includes("/css/"), and the /css2? URL matches neither,
 // so it would be injected as a <script>, fail to parse the CSS as JavaScript,
 // and still fire `load` - resolving as success with the fonts never applied.
 // my1e3.js is read-only, so this mirrors its CSS branch locally.
 function loadFontStylesheet(href) {
  return new Promise((resolve) => {
   if (document.querySelector("link[data-ht-fonts]")) {
    resolve();
    return;
   }
   const link = document.createElement("link");
   link.rel = "stylesheet";
   link.href = href;
   link.dataset.htFonts = "1";
   link.media = "print";
   link.onload = () => {
    link.media = "all";
    resolve();
   };
   link.onerror = () => {
    console.warn("[fonts] Google Fonts unreachable - using system fallbacks");
    link.remove();
    resolve();
   };
   document.head.appendChild(link);
  });
 }

 for (const o of [
  "https://fonts.gstatic.com",
  "https://fonts.googleapis.com",
 ]) {
  const pc = document.createElement("link");
  pc.rel = "preconnect";
  pc.href = o;
  pc.crossOrigin = "anonymous";
  document.head.appendChild(pc);
 }
 loadFontStylesheet(
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap"
 );

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
     u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@caafdee/rm/bill.js",
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
    c: "handl_rm_rspons",
    r: " ",
   },
   {
    a: 25,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@25415a1/cmn/conta.js",
    c: "showContactModal",
    r: " ",
   },
   {
    a: 20,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@caafdee/rm/booking.js",
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
   // fn 40 removed — admin.js merged into rm.js
   {
    a: 41,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/sidebar.js",
    c: "handleMenuAction,toggleSidebar",
    r: " ",
   },
   {
    a: 42,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@caafdee/rm/availability.js",
    c: "calcNights,calcTotal,getRoomAvailability,getRoomById,adRoomId,getOverlapCount",
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
    c: "showDashboard,renderTable",
    r: " ",
   },
   {
    a: 46,
     u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@caafdee/rm/adminBooking.js",
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
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@caafdee/rm/rm_da.js",
    c: "showPrintSettings",
    r: " ",
   },
   { "a": 52, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b7740c3/cmn/my1ctr.js", "c": "open_my1ctr", "r": "open_my1ctr" },
   { "a": 53, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fcbc516/cmn/my1rp.js", "c": "open_my1rp", "r": "open_my1rp" },
   { "a": 106, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/rm/addRoom.js", "c": "showAddRoom,setAddRoomHero,updateThumb,publishAddRoom,resetAddRoomForm,editRoom", "r": " " },
   { "a": 112, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@caafdee/rm/adminBooking.js", "c": "openBookingModal,saveBooking", "r": " " },
    { "a": 43, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@caafdee/rm/billCombo.js", "c": " ", "r": " " }
   ];
 }

 try {

   let result1 = await loadCshScriptsSequentially(1, 2, 3, 4, 5, 8, 30, 31, 22, 21, 25, 20, 24, 43);
  if (!result1.success)
   throw new Error("Failed to load required scripts: " + result1.error);

  console.log("📦 Creating database tables for:", dbnm);
  try {
   const createResult = await dbDexieManager.handleNwTables(
    "loader",
    dbnm,
    tblsRequired,
   );
   createResult.failureCount;
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
   } catch (e2) { }
  }

  await loadRoomConfig();
  if (window[my1uzr.worknOnPg].clientConfig?.cust_da_const?.showRoomAvalOnHomePg == 1)
   await openRoomBooking();
  applyClientConfigToPublic();


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
  // #paySheet only exists once renderApp has run, which happens after the
  // bootstrap awaits its data. Calling before that hits a null node, and the
  // async function has no way to report it, so gate on the node itself.
  if (
   window.innerWidth >= 992 &&
   el("paySheet") &&
   typeof ensureBeCheckinField === "function"
  ) {
   ensureBeCheckinField().catch(function (e) {
    console.warn("ensureBeCheckinField failed:", e);
   });
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

  /* Both result lists run the full width of the page - never inside a
     .container - with only a ms-1 / me-1 gutter at each end, so the room and
     combination cards line up edge to edge. */
  .ht-room-list { margin-inline: 0.25rem; width: calc(100% - 0.5rem); padding-bottom: 60px; display: flex; flex-direction: column; gap: 26px; }

  .ht-filter-bar {
    margin: 0 0 20px;
    padding: 11px 16px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.14), rgba(40, 167, 69, 0.06));
    border: 1px solid rgba(40, 167, 69, 0.45);
    font-size: 13px;
    color: #1e5c33;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .ht-filter-bar > .ht-btn {
    margin-left: auto;
    flex: 0 0 auto;
    max-width: 100%;
  }
  .ht-filter-bar i { color: #1e7e34; }
  .ht-filter-bar b { color: #14532d; }
  .ht-filter-bar-empty { background: rgba(138, 42, 27, 0.08); border-color: rgba(138, 42, 27, 0.35); color: var(--ember); }
  .ht-filter-bar-empty i { color: var(--ember); }
  .ht-filter-bar-empty b { color: var(--ember); }
  /* The bar shown when no search was run - only the guest count trimmed the
     list - carries no action button, so it reads as a plain note. */
  .ht-filter-bar-note {
    background: rgba(201, 164, 92, 0.13);
    border-color: rgba(201, 164, 92, 0.42);
    color: var(--brown);
  }
  .ht-filter-bar-note i { color: var(--gold-dark); }
  .ht-filter-bar-note b { color: var(--charcoal); }
  /* How many rooms the current search left out, appended to any bar. */
  .ht-filter-note { display: inline-flex; align-items: center; gap: 6px; }
  .ht-filter-note i { color: currentColor; opacity: 0.75; }
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

  /* Greenish tinge marks a room that is free for the selected dates. A room
     that only fits by charging for an extra guest is bookable too, so it gets
     the same greenish treatment - the surcharge is called out on its own chip
     rather than by dropping the colour. */
  .ht-room-card.is-avail,
  .ht-room-card.is-extra {
    background: linear-gradient(180deg, #fbfffc, #f4fbf6);
    border-color: rgba(40, 167, 69, 0.5);
    box-shadow: var(--shadow-md), 0 0 0 1px rgba(40, 167, 69, 0.18);
  }
  .ht-room-card.is-avail:hover,
  .ht-room-card.is-extra:hover { box-shadow: var(--shadow-lg), 0 0 0 2px rgba(40, 167, 69, 0.3); }
  .ht-avail-chip {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 700;
    color: #1e7e34;
    background: #eaf7ec;
    border: 1px solid #bfe3d2;
  }
  .ht-extra-chip {
    position: absolute;
    bottom: 14px;
    right: 14px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 600;
    color: #8a5a2b;
    background: rgba(246, 233, 200, 0.92);
    border: 1px solid rgba(201, 164, 92, 0.6);
  }

  /* ---- Room combination (party larger than any single room) ---- */
  .ht-combo-list { margin-inline: 0.25rem; width: calc(100% - 0.5rem); display: flex; flex-direction: column; gap: 22px; }
  .ht-combo-card {
    background: linear-gradient(180deg, #fbfffc, #f4fbf6);
    border: 1px solid rgba(40, 167, 69, 0.5);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md), 0 0 0 1px rgba(40, 167, 69, 0.18);
    overflow: hidden;
  }
  .ht-combo-head {
    display: flex;
    align-items: center;
    gap: 9px;
    flex-wrap: wrap;
    padding: 13px 20px;
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.15), rgba(40, 167, 69, 0.06));
    border-bottom: 1px solid rgba(40, 167, 69, 0.3);
    font-size: 13px;
    font-weight: 700;
    color: #14532d;
  }
  .ht-combo-head i { color: #1e7e34; }
  .ht-combo-head .tag {
    font-weight: 600;
    font-size: 11.5px;
    color: #1e5c33;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid #bfe3d2;
    border-radius: 999px;
    padding: 3px 10px;
  }
  /* The individual rooms of a combination sit side by side, always on one row.
     Below the mobile breakpoint they shrink rather than wrap, so a 2- or 3-room
     set still reads as one strip. */
  .ht-combo-rooms { display: flex; flex-wrap: nowrap; gap: 0; }
  .ht-combo-room {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    gap: 12px;
    padding: 16px 18px;
    border-right: 1px dashed rgba(40, 167, 69, 0.3);
    background: rgba(255, 255, 255, 0.5);
  }
  .ht-combo-room:last-child { border-right: none; }
  .ht-combo-room img {
    width: 74px;
    height: 74px;
    flex: 0 0 74px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(201, 164, 92, 0.5);
  }
  .ht-combo-room .cr-body { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
  .ht-combo-room .cr-no { font-family: "Playfair Display", Georgia, serif; font-size: 16px; font-weight: 700; color: var(--charcoal); }
  .ht-combo-room .cr-name { font-size: 12px; color: var(--brown); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ht-combo-room .cr-occ { font-size: 11px; color: #6b5d4d; }
  .ht-combo-room .cr-rate { font-size: 13px; font-weight: 700; color: var(--gold-dark); }
  /* A set never wraps, so on a narrow screen the thumbnails are dropped and the
     tiles stack their own text instead of overflowing sideways. */
  @media (max-width: 640px) {
    .ht-combo-room { flex-direction: column; gap: 6px; padding: 12px 10px; }
    .ht-combo-room img { display: none; }
    .ht-combo-room .cr-no { font-size: 14px; }
    .ht-combo-room .cr-name { font-size: 11px; }
  }
  .ht-combo-foot {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    padding: 14px 20px;
    border-top: 1px solid rgba(40, 167, 69, 0.3);
    background: rgba(255, 255, 255, 0.6);
  }
  .ht-combo-foot .csum { font-size: 12.5px; color: #6b5d4d; }
  .ht-combo-foot .csum b { color: var(--charcoal); font-size: 15px; }
  .ht-combo-foot .ht-btn { margin-left: auto; }
  .ht-combo-note { font-size: 11.5px; font-weight: 600; color: #8a5a2b; }
  .ht-combo-note.warn { color: #c0392b; }
  .ht-combo-rest { display: none; }
  .ht-combo-rest.is-open { display: contents; }
  .ht-combo-more { display: flex; justify-content: center; margin-top: 4px; }
  .ht-combo-section-title {
    display: flex;
    align-items: center;
    gap: 9px;
    margin: 4px 0 14px;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 19px;
    font-weight: 700;
    color: var(--charcoal);
  }
  .ht-combo-section-title i { color: #1e7e34; }
  .ht-combo-detail-head {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 18px;
    padding: 12px 18px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.15), rgba(40, 167, 69, 0.06));
    border: 1px solid rgba(40, 167, 69, 0.4);
    font-size: 13.5px;
    font-weight: 700;
    color: #14532d;
  }
  .ht-combo-detail-head i { color: #1e7e34; }
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
  /* A dated stay lists its rates instead of quoting one figure, so the block
     drops .ht-price's display serif and reads as a small ledger. The rows are
     the paysheet's own .s-day-* markup (built by htCardPriceRows), recoloured
     and resized for the light card - the same treatment .ht-bill-body gives
     them. A few rows are a headline again, set large; a long per-stay list types
     down so a month-long stay stays a list and not a wall. The width cap keeps
     each date paired with its own amount instead of flung to either edge. */
  .ht-price-block { display: block; max-width: 340px; }
  .ht-price-block .s-day-rates { margin-top: 0; }
  .ht-price-block .s-day-rate { color: var(--muted); gap: 18px; font-size: 17px; padding: 3px 0; }
  .ht-price-block .s-day-price { color: var(--ember); font-family: "Playfair Display", Georgia, serif; font-size: 20px; }
  .ht-price-block .s-day-rates.is-long .s-day-rate { font-size: 14px; padding: 2px 0; }
  .ht-price-block .s-day-rates.is-long .s-day-price { font-size: 16px; }
  .ht-price-block .ht-price-gst { font-size: 11.5px; color: var(--muted); opacity: 0.8; padding-top: 4px; }
  /* Mode 3 (showAndOptionsOfCardPriceings 3): one line, the total big and the
     GST added to it small - "₹ 1,250 + ₹ 63 GST for 2 nights". The total is a
     bare span, so it simply inherits .ht-price's display serif and ember; the
     two additions are set in the plain face at a fraction of the size, which
     makes them read as annotations on the figure rather than as figures of
     their own. The GST is picked out in gold so the extra is findable, and the
     note - the nights this covers - stays muted behind it. */
  .ht-price .ht-gst-add, .ht-price .ht-gst-note { font-family: "Inter", sans-serif; font-size: 12.5px; font-weight: 400; color: var(--muted); margin-left: 7px; }
  .ht-price .ht-gst-add { color: var(--gold-dark); }
  /* A combination footer is a smaller line than a room card and shares the row
     with the book button, so the same markup steps the total down a size there
     and the extras down to match. */
  .ht-combo-foot .csum .ht-gst-total { font-family: "Playfair Display", Georgia, serif; font-size: 19px; font-weight: 700; color: var(--charcoal); }
  .ht-combo-foot .csum .ht-gst-add, .ht-combo-foot .csum .ht-gst-note { font-size: 11.5px; color: #6b5d4d; margin-left: 6px; }
  .ht-combo-foot .csum .ht-gst-add { color: #8a5a2b; }
  /* On a long list the button belongs at the foot of the ledger, not floating
     halfway down it. */
  .ht-card-foot-long { align-items: flex-end; }

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
  /* Room-by-room breakdown of a combination. */
  .s-row-group { border-left: 2px solid rgba(201, 164, 92, 0.45); margin: 6px 0 8px; padding-left: 11px; }
  .s-row-group .s-row { color: #ded2b6; font-size: 12.5px; }
  .s-row-group .s-row.sub { border-top: 1px dashed rgba(201, 164, 92, 0.25); margin-top: 3px; padding-top: 7px; font-weight: 700; color: #f3e7c9; }
  .s-row.s-total { border-top: 1px solid rgba(201, 164, 92, 0.4); margin-top: 8px; padding-top: 12px; font-weight: 700; color: #fff; font-size: 15px; }
  .s-row.s-total .amt { font-family: "Playfair Display", Georgia, serif; font-size: 23px; color: var(--gold-light); }
  /* One paysheet per room of a combination, each with that room's own share. */
  .s-room-sheets { margin-top: 14px; display: flex; flex-direction: column; gap: 10px; }
  .s-room-sheet {
    border: 1px solid rgba(201, 164, 92, 0.35);
    border-left: 3px solid rgba(201, 164, 92, 0.7);
    border-radius: 10px;
    padding: 10px 12px 4px;
    background: rgba(255, 255, 255, 0.04);
  }
  .s-room-sheet-head {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 13.5px;
    font-weight: 700;
    color: var(--gold-light);
  }
  .s-room-sheet .s-row { color: #ded2b6; font-size: 12.5px; }
  .s-room-sheet .s-row.s-total { font-size: 13.5px; color: #fff; }
  .s-room-sheet .s-row.s-total .amt { font-size: 17px; }
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
  .ht-bill-body .s-row-group { border-left-color: rgba(138, 90, 43, 0.4); }
  .ht-bill-body .s-row-group .s-row { color: #4a3f31; }
  .ht-bill-body .s-row-group .s-row.sub { border-top-color: rgba(138, 90, 43, 0.3); color: #1a1208; }
  .ht-bill-body .s-row.s-total { border-top-color: rgba(201, 164, 92, 0.5); color: #1a1208; }
  .ht-bill-body .s-row.s-total .amt { color: #8a5a2b; }
  .ht-bill-body .s-room-sheet { background: rgba(255, 255, 255, 0.55); }
  .ht-bill-body .s-room-sheet .s-row { color: #4a3f31; }
  .ht-bill-body .s-room-sheet .s-row.s-total { color: #1a1208; }

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
    /* Rooms of a combination stack instead of sitting side by side. */
    .ht-combo-room { flex: 1 1 100%; border-right: none; border-bottom: 1px dashed rgba(40, 167, 69, 0.3); }
    .ht-combo-room:last-child { border-bottom: none; }
    .ht-combo-foot .ht-btn { margin-left: 0; width: 100%; justify-content: center; }
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

// A combination booking holds every selected room here. One entry means a plain
// single-room booking, so the rest of the code can stay single-room shaped.
var comboSelection = null;

// What the last renderHome() found, so a search can scroll to the section that
// actually holds the results. With no single room free the room list is either
// missing or holds only the extra-guest-charge rooms, so the combinations are
// the only useful landing spot.
var lastSearchSingleCount = 0;
var lastSearchComboCount = 0;

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

// ── RECEIPT (table r) FIELD READERS ──────────────────────────────────────
// A receipt keeps its extra fields in an `l` envelope (see
// clientConfig.rp_xtraEiFlds_rmBookAdmin.l) and the server persists that
// envelope as a JSON STRING - {"td":"500"} - so it can never be read as a plain
// `rec.l.td`. These three readers are the only place that shape is understood.
// They live here, not in adminBooking.js, because booking.js and rm.js read
// receipts too and every chunk is lazy-loaded.

// The envelope as an object: a live object is returned as-is, a JSON string is
// parsed, anything unusable becomes {} so callers never touch a string's props.
function receiptL(rec) {
 var l = rec ? rec.l : null;
 if (l && typeof l === "object" && !Array.isArray(l)) return l;
 if (typeof l === "string" && l.trim() !== "") {
  try {
   var o = JSON.parse(l);
   if (o && typeof o === "object" && !Array.isArray(o)) return o;
  } catch (e) { }
 }
 return {};
}

// Transaction ID of a receipt: l.td only, because that is the field the modal
// collects (rp_xtraEiFlds_rmBookAdmin.l.td, "Transaction ID", required). The
// top-level r.td is the booking link, so it is never shown as a transaction id -
// a receipt carrying no l.td simply has no transaction id to display.
function receiptTxnId(rec) {
 var td = receiptL(rec).td;
 return td == null ? "" : String(td);
}

// Which booking a receipt belongs to: the top-level r.td (what both save paths
// stamp), falling back to l.td for rows written before the link was set. Reads
// the envelope through receiptL, so a row with an empty top-level td and a
// JSON-string l is still matched instead of being silently dropped from the
// received total.
function receiptBookingId(rec) {
 if (rec && rec.td != null && String(rec.td) !== "") return String(rec.td);
 var td = receiptL(rec).td;
 return td == null ? "" : String(td);
}

// A fresh copy of a receipt's envelope carrying the transaction id, for the two
// paths that post receipts (new booking and Update Payments). Copied rather than
// reused so posting never mutates the envelope the form is still holding, and so
// the other configured extra fields in it survive the round trip.
function receiptEnvelopeWithTxn(rec, txn) {
 var out = {};
 var env = receiptL(rec);
 for (var k in env) {
  if (Object.prototype.hasOwnProperty.call(env, k)) out[k] = env[k];
 }
 if (txn) out.td = String(txn);
 return out;
}

// Single GST source. rm.da carries it as the top-level "gst" key, which reaches
// JS as clientConfig.gst. Resolved at call time so script load order never
// matters, and never cached on `hotel`.
function htGstRate() {
  var raw = window[my1uzr.worknOnPg]?.clientConfig?.gst;
  var n = parseFloat(raw);
  return isFinite(n) && n > 0 ? n : 0;
}

// The GST due on an amount, rounded exactly the way the paysheet rounds it
// (booking.js and availability.js both use Math.round(base * gst / 100), so
// ₹ 1,250 at 5% is ₹ 63). One rule in one place, so a card can never quote a tax
// the summary sheet then contradicts by a rupee.
function htGstOn(amount) {
  var base = Math.round(Number(amount) || 0);
  var rate = htGstRate();
  return rate > 0 ? Math.round((base * rate) / 100) : 0;
}

// Map a server/config room record (rm schema: a-j keys, nested h object) into
// the public ht-schema shape (name/pricePerNight/images/capacity/bed/...) that
// renderHome, roomCardHtml, renderDetails and booking.js already consume.
//
// A room's occupancy policy is packed into rm.h.e as "normal-max~freeChildAge",
// e.g. "2-3~8" = 2 guests included, sleeps at most 3, children aged 8 and under
// stay free. The middle number is a MAX OCCUPANCY ceiling, not a child count.
function htRoomOccupancyPolicy(room) {
  var cfg = window[my1uzr.worknOnPg]?.clientConfig?.HT_CFG || {};
  var numberOr = function (value, fallback) {
    var n = parseInt(value, 10);
    return isFinite(n) ? n : fallback;
  };
  var policy = room && room.occupancyPolicy;
  var capacity = numberOr(
    policy && policy.capacity,
    numberOr(room && room.capacity, 2),
  );
  var maxOccupancy = numberOr(
    policy && policy.maxOccupancy,
    numberOr(
      room && room.maxOccupancy,
      numberOr(room && room.maxChildren, numberOr(cfg.maxOccupancy, capacity)),
    ),
  );
  var freeMax = numberOr(
    policy &&
      (policy.childAgeFreeMax != null ? policy.childAgeFreeMax : policy.freeAge),
    numberOr(cfg.childAgeFreeMax, 8),
  );
  var source = room && room.h;
  if (typeof source === "string") {
    var text = source.trim();
    if (text.charAt(0) === "{" || text.charAt(0) === "[") {
      try {
        source = JSON.parse(text);
      } catch (e) {
        source = null;
      }
    } else if (text.indexOf("-") > -1 && text.indexOf("~") > -1) {
      source = { e: text };
    }
  }
  var value =
    source && typeof source === "object" && source.e != null
      ? source.e
      : room && room.m;
  if (value != null && typeof value !== "object") {
    var occupancyText = String(value);
    var parts = occupancyText.split("~")[0].split("-");
    var freePart = occupancyText.split("~")[1];
    capacity = numberOr(parts[0], capacity);
    maxOccupancy = numberOr(parts[1], maxOccupancy);
    freeMax = numberOr(freePart, freeMax);
  }
  return {
    capacity: Math.max(0, capacity),
    maxOccupancy: Math.max(0, maxOccupancy),
    childAgeFreeMax: Math.max(0, freeMax),
    freeAge: Math.max(0, freeMax),
  };
}

// Chargeable occupancy across a SET of rooms (one element for a single room,
// several for a combo). The free slots of every room pool together, so a party
// is never pinned to a specific room - the set only has to be able to hold it.
//
// Chargeable heads = adults + children above the free age. Children within the
// free age are excluded entirely: they neither occupy a slot nor cost anything.
// The pooled normal occupancy is filled by the adults first, so whoever is left
// over is billed at their own rate - an extra adult at extraAdultsCharge, an
// over-age child at paidChildCharge. The two together always equal the overflow.
function htOccupancyPool(rooms, adultCount, childAges) {
  var list = Array.isArray(rooms) ? rooms : rooms ? [rooms] : [];
  var capacitySum = 0;
  var maxOccupancySum = 0;
  var childAgeFreeMax = 8;
  for (var i = 0; i < list.length; i++) {
    var p = htRoomOccupancyPolicy(list[i]);
    capacitySum += p.capacity;
    maxOccupancySum += p.maxOccupancy;
    if (p.childAgeFreeMax > childAgeFreeMax) childAgeFreeMax = p.childAgeFreeMax;
  }
  var ages = Array.isArray(childAges) ? childAges : [];
  var adultsCount = Math.max(0, parseInt(adultCount, 10) || 0);
  var adultEquivalentChildren = 0;
  var freeChildren = 0;
  for (var ci = 0; ci < ages.length; ci++) {
    var value = ages[ci];
    if (value && typeof value === "object") {
      value =
        value.ag != null
          ? value.ag
          : value.age != null
            ? value.age
            : value.a;
    }
    var age = parseInt(value, 10);
    if (!isFinite(age) || age < 0) age = 0;
    if (age > childAgeFreeMax) adultEquivalentChildren++;
    else freeChildren++;
  }
  var effectiveOccupancy = adultsCount + adultEquivalentChildren;
  // Included slots go to the adults first, then to the over-age children.
  var includedForAdults = Math.min(adultsCount, capacitySum);
  var includedForChildren = Math.min(
    adultEquivalentChildren,
    capacitySum - includedForAdults,
  );
  var extraAdultUnits = adultsCount - includedForAdults;
  var paidChildUnits = adultEquivalentChildren - includedForChildren;
  var overflow = extraAdultUnits + paidChildUnits;
  return {
    rooms: list,
    roomCount: list.length,
    capacity: capacitySum,
    maxOccupancy: maxOccupancySum,
    childAgeFreeMax: childAgeFreeMax,
    adults: adultsCount,
    children: ages.length,
    childAges: ages,
    adultEquivalentChildren: adultEquivalentChildren,
    paidChildren: adultEquivalentChildren,
    paidChildUnits: paidChildUnits,
    freeChildren: freeChildren,
    effectiveOccupancy: effectiveOccupancy,
    extraAdultUnits: extraAdultUnits,
    extraAdylts: extraAdultUnits,
    extraAdults: extraAdultUnits,
    overflowUnits: overflow,
    isOverCapacity: overflow > 0,
    overMaxOccupancy: effectiveOccupancy > maxOccupancySum,
  };
}

// Single-room convenience wrapper. Every existing caller keeps working; combo
// callers reach for htOccupancyPool directly.
function htEffectiveRoomOccupancy(room, adultCount, childAges) {
  var occ = htOccupancyPool([room], adultCount, childAges);
  occ.room = room;
  return occ;
}

/* ============================================================
   SHARED ROOM-COMBINATION ENGINE
   ------------------------------------------------------------
   Used by both booking flows. The public side filters roomRecords
   through publicRoomIsAvailable and caches the result; the admin
   side passes adminRoomRecords and getRoomAvailability.

   By default a single room that already sleeps the party wins on
   its own, so combinations only appear when the normal room list
   cannot take the party. options.allowWithSingleFit lifts that for
   the public list, which then also offers combinations of the
   smaller rooms to a party a single room could have taken.
   ============================================================ */
function htCombinations(list, size) {
  var out = [];
  (function walk(start, picked) {
    if (picked.length === size) {
     out.push(picked.slice());
     return;
    }
    for (var i = start; i < list.length; i++) {
     picked.push(list[i]);
     walk(i + 1, picked);
     picked.pop();
    }
  })(0, []);
  return out;
}

function htComboKey(ids) {
  return (ids || []).map(String).join("-");
}

// rm.da "showAllOptionsOfRoomsOnInit": with no guests in the stepper yet the
// public home has no party to search against, so the room combinations are left
// out. A hotel that wants its whole set of stay options on first paint turns
// this on and gets the combinations next to the rooms from the start. The admin
// picker is unaffected - it only ever searches a party that is already entered.
function htShowAllRoomOptions() {
  return (
    window[my1uzr.worknOnPg]?.clientConfig?.showAllOptionsOfRoomsOnInit == 1
  );
}

// rm.da "showAndUseFreeChildsOptionsOfRooms": a child within the room's free age
// is not a guest as far as the search is concerned - htOccupancyPool keeps them
// out of the priced capacity and out of the sleeping ceiling - so a party of two
// adults and two five-year-olds is filtered, ranked and priced as two people.
// The flag makes the copy in the search area count them that way too. It changes
// no room in the list: the "use" half is what the search already does.
function htExcludeFreeChildsFromTotal() {
  return (
    window[my1uzr.worknOnPg]?.clientConfig
      ?.showAndUseFreeChildsOptionsOfRooms == 1
  );
}

// rm.da "showAndOptionsOfCardPriceings": decides how much of a stay a room card
// spells out. Read as a number, not as on/off, because 1 and 3 are two different
// views of the same stay:
//
//   3  - one line only: the stay's total with the GST added to it, as
//        "₹ 1,250 + ₹ 63 GST". No breakdown at all.
//   1  - the room's own weekly pricing: a normal night, a Friday and a Saturday,
//        as three separate amounts. Needs no dates and keeps a month-long search
//        from turning the card into a 30-row list.
//   0  - missing, or set to anything else: one dated row per night of the stay,
//        exactly as the paysheet does.
//
// The figures are identical however it is set; only the detail shown changes.
function htCardPricingMode() {
  var raw = window[my1uzr.worknOnPg]?.clientConfig?.showAndOptionsOfCardPriceings;
  var v = Number(raw);
  return v === 1 || v === 3 ? v : 0;
}

function htCardShowsWeeklyRates() {
  return htCardPricingMode() == 1;
}

// Mode 3: the total and the GST on it, and nothing else.
function htCardShowsTotalWithGst() {
  return htCardPricingMode() == 3;
}

// The party as the search area should describe it. The free-child count comes
// back with it so the breakdown beside the count can still say where the
// children went - dropping them from the total and from the sentence would leave
// "2 guests (2 adults, 2 children)" arguing with itself.
function htSearchParty() {
  var occ = htOccupancyPool([{}], adults, childAges);
  var excluding = htExcludeFreeChildsFromTotal();
  return {
    pool: occ,
    excluding: excluding,
    total: excluding ? occ.effectiveOccupancy : occ.adults + occ.children,
  };
}

// rm.da "showOnlyCombosAbovePersons": the band of party sizes, written as a
// comma-separated string like "0,5", that the search reshapes for. Read as a pair
// rather than as a number, because the two ends do different jobs and the key needs
// to say both at once:
//
//   "0,5"  - 0 through 5 are shown single rooms and no combinations at all;
//            above 5 they are shown combinations and no single rooms - unless
//            showExtraChargeRoomsAbovePersons is on, which keeps the rooms a
//            party can take for the price of a surcharge. See
//            htSingleRoomsHiddenForParty.
//   "1,5"  - the same above 5, but the empty stepper is left alone, so 0 keeps
//            whatever showAllOptionsOfRoomsOnInit already decided for the first
//            paint. Only the 1-5 band loses its combinations.
//
// A bare number is read as "1,N" - the same threshold the key always had, with no
// band - so an existing "5" keeps its meaning and the empty stepper is untouched.
//
// Both ends are inclusive, and the counts are the head count the search itself
// matched on (htSearchParty), so they agree with the "N guests" printed beside the
// stepper and with which rooms were priced - and with rm.da's free-child flag on,
// children inside the free age are off it, so four adults with three free children
// is still a party of four.
//
// No key, an empty value, a zero threshold, a band that runs backwards, or anything
// unreadable means the rule is off: every party sees single rooms and combinations,
// which is how the search behaved before.
function htCombosRange() {
  var raw =
    window[my1uzr.worknOnPg]?.clientConfig?.showOnlyCombosAbovePersons;
  if (raw == null) return null;
  var s = String(raw).trim();
  if (!s) return null;
  var parts = s.split(",");
  var from, to;
  if (parts.length >= 2) {
   from = parseInt(parts[0], 10);
   to = parseInt(parts[1], 10);
  } else {
   from = 1;
   to = parseInt(parts[0], 10);
  }
  if (!isFinite(from) || !isFinite(to)) return null;
  if (to < 1) return null;
  if (from < 0) from = 0;
  if (from > to) return null;
  return { from: from, to: to };
}

// A party over the top of the band is shown combinations first, and by default
// no single room at all: neither the normally priced ones nor the
// extra-guest-charge ones, so a large group reads one list instead of two.
function htCombosOnlyForParty() {
  var r = htCombosRange();
  return !!r && htSearchParty().total > r.to;
}

// rm.da "showExtraChargeRoomsAbovePersons": 1 lifts that for the room list. A
// room that sleeps the party only by charging for the guests past its included
// capacity - a suite that sleeps six and includes four, for a party of six - is
// a real answer, and hiding it behind a rule about list tidiness loses a sale.
// The rooms themselves are unchanged either way: renderHome has already dropped
// every room that cannot sleep the party, so lifting the wipe cannot list one
// that does not fit. It just lets the ones that do fit speak for themselves
// beside the combinations, with their surcharge on the card.
//
// Off (or absent) the room list is emptied above the band, as it always was, so
// a hotel that wants the old single-list reading keeps it.
function htKeepExtraChargeRoomsAboveBand() {
  return (
    window[my1uzr.worknOnPg]?.clientConfig
      ?.showExtraChargeRoomsAbovePersons == 1
  );
}

// True when the room list has actually been withheld from this party: over the
// band, and the hotel has not asked to keep the rooms that fit with a surcharge.
// The two places that branch on the band - the wipe and the filter bar - must
// agree on this, or the bar goes on counting a list the guest cannot see.
function htSingleRoomsHiddenForParty() {
  return htCombosOnlyForParty() && !htKeepExtraChargeRoomsAboveBand();
}

// rm.da "showCombosCheapestFirst": 1 orders the public combination list by what
// the guest actually pays - the rooms plus the guests the set has to charge for -
// with the room count only settling ties. Off, or absent, the list is blocked by
// room count instead: every two-room set, then every three-room set, then four.
// One flag covers the order and the preview count together (see
// comboCardsPreviewCount), so turning it off restores the list as it was.
//
// The two orders are not interchangeable. A third room costs Rs 1,250 and saves
// about Rs 660 of surcharge, so a set that grows by a room gets cheaper and the
// prices arrive clustered by size - blocking the list by room count is exactly
// what stops a two-room and a three-room set from ever being read side by side.
// Ranking by price breaks that up on its own: for a party of six the list
// becomes 36 blocks of a few cards each, alternating two, three and four rooms
// from the cheapest set to the dearest.
function htCombosRankByAllInPrice() {
  return (
    window[my1uzr.worknOnPg]?.clientConfig?.showCombosCheapestFirst == 1
  );
}

// A party inside the band is the mirror image: single rooms stay, the combinations
// go. The two never overlap, so a party is never left with neither.
function htCombosHiddenForParty() {
  var r = htCombosRange();
  if (!r) return false;
  var t = htSearchParty().total;
  return t >= r.from && t <= r.to;
}

// Every combination of the given pool that can sleep the party, best first:
// a set whose pooled normal occupancy already covers everyone, then the fewest
// rooms, then the most spare max-occupancy headroom, then the cheapest.
//
// "Most spare headroom" is a reasonable stand-in when every candidate set holds
// the same number of rooms, but it is the wrong way to rank a widened list: a
// set that vastly over-sleeps the party then beats the cheapest one that
// actually fits. options.preferCheapest leads with the nightly total instead,
// for a caller whose list mixes room counts and includes parties a single room
// could have taken.
//
// options.rateOf(room) prices a room for the comparison and the card total, so
// a caller that knows the stay dates can rank by the real rate. It defaults to
// the room's base rate, which is what the admin flow (base rates, no stay
// context) has always used.
//
// options.maxRooms caps how many rooms a set may hold (default 3, which is what
// the admin picker allows). options.allSizes searches every room count up to
// that cap instead of stopping at the first one that fits.
// options.allowWithSingleFit keeps the combinations coming for a party a single
// room can already take, so the smaller-room sets are offered next to that room
// instead of being hidden.
// options.allowEmptyParty lifts the "no guests, nothing to search for" early
// return, so a caller that just lists the hotel's stay options can rank the sets
// by price. Every set then trivially fits, so the ranking is the price order.
//
// options.cheapestAllIn puts the public group-search list in one continuous run,
// cheap to expensive, with the room count settling only the ties. It is what
// rm.da's showCombosCheapestFirst switches on, and it is the order a guest
// comparing prices wants: for a party of six the 375 sets arrive as 36 blocks of
// a few cards each, alternating two, three and four rooms, rather than as one
// flat wall of two-room sets and then another of three-room sets. The ranking
// uses the same sum the card's own total and its "N extra guest" line are built
// from, so the order and the printed price cannot disagree.
//
// options.cheapestWithinSize is the alternative, and the fallback whenever the
// flag is off: fewest rooms first, then the cheapest all-in set within each room
// count. That order answers a different question - a two-room set of the smaller
// rooms beats a three-room set of the same ones, because three rooms for six
// guests is a worse stay at a similar price - but it can only show a guest two
// and three rooms side by side by breaking the price order.
//
// Both exist because the default order cannot answer either. The default puts
// "the pool's included capacity already covers everyone" ahead of price, so every
// set that needs no surcharge outranks every set that does: for a party of six on
// ten rooms that is 354 sets ahead of 21, and the two-room set they would have
// picked sits last of 375.
function htComboOptions(pool, adultCount, childAges, opts) {
 var options = opts || {};
 var isAvailable =
  typeof options.isAvailable === "function" ? options.isAvailable : null;
 var rateOf =
  typeof options.rateOf === "function"
   ? options.rateOf
   : function (r) {
      return Number(r && r.pricePerNight) || 0;
    };
 var list = (pool || []).filter(function (r) {
  return r && (!isAvailable || isAvailable(r));
 });
  var occ = htOccupancyPool([{}], adultCount, childAges);
  if ((!occ.effectiveOccupancy && !options.allowEmptyParty) || !list.length)
   return [];
  var maxRooms = Math.min(options.maxRooms || 3, list.length);

 if (maxRooms < 2) return [];
 // A room that already sleeps the whole party wins on its own, so stop before
 // looking at any combination - unless the caller asked for the smaller-room
 // sets to be offered as well.
 if (!options.allowWithSingleFit) {
  for (var p = 0; p < list.length; p++) {
   if (!htOccupancyPool([list[p]], adultCount, childAges).overMaxOccupancy) {
    return [];
   }
  }
 }
 // The fewest rooms that can hold the party is the answer, so the search stops
 // at the first room count that yields a set. options.allSizes keeps going up to
 // the ceiling instead, so a three-room set can be offered next to the two-room
 // set that already fits. The pooled occupancy rides along with the set so the
 // map below never has to work it out twice.
 var fitting = [];
 var bestSize = 0;
 for (var size = 2; size <= maxRooms; size++) {
  var sized = htCombinations(list, size);
  for (var i = 0; i < sized.length; i++) {
   var so = htOccupancyPool(sized[i], adultCount, childAges);
   if (so.overMaxOccupancy) continue;
   fitting.push({ rooms: sized[i], occ: so });
   if (!bestSize) bestSize = size;
  }
  if (bestSize && !options.allSizes) break;
 }
 if (!bestSize) return [];
 var cfg = window[my1uzr.worknOnPg]?.clientConfig?.HT_CFG || {};
 var extraRate = cfg.extraAdultsCharge || 0;
 var childRate = cfg.paidChildCharge || 0;
 return fitting
  .map(function (entry) {
   var set = entry.rooms;
   var so = entry.occ;
   var totalPerNight = set.reduce(function (sum, r) {
    return sum + (Number(rateOf(r)) || 0);
   }, 0);
     return {
      key: htComboKey(
       set.map(function (r) {
        return r.id;
       }),
      ),
      rooms: set,
      roomIds: set.map(function (r) {
       return String(r.id);
      }),
      roomCount: set.length,
      capacity: so.capacity,
      maxOccupancy: so.maxOccupancy,
      totalPerNight: totalPerNight,
      effectiveOccupancy: so.effectiveOccupancy,
      extraAdultUnits: so.extraAdultUnits,
      paidChildUnits: so.paidChildUnits,
      freeChildren: so.freeChildren,
       fitsPooledNormal: !so.isOverCapacity,
       extraAdultsCharge: extraRate,
       paidChildCharge: childRate,
       // The nightly figure the guest actually pays: the rooms, plus the guests
       // the set has to charge for. htPartyCharge builds the same sum for one
       // night from the same two rates, so this ranks sets on the number the card
       // then prints.
       allInPerNight:
        totalPerNight +
        so.extraAdultUnits * extraRate +
        so.paidChildUnits * childRate,
      };
     })
     .sort(function (a, b) {
      if (options.cheapestAllIn) {
       // rm.da "showCombosCheapestFirst": what the guest pays, cheap to
       // expensive, and the room count only settles ties. allInPerNight is the
       // same sum htPartyCharge and htCardTotal build for the card, so a set is
       // ranked on the figure its own card prints and the two cannot disagree.
       if (a.allInPerNight !== b.allInPerNight)
        return a.allInPerNight - b.allInPerNight;
       if (a.roomCount !== b.roomCount) return a.roomCount - b.roomCount;
       if (a.fitsPooledNormal !== b.fitsPooledNormal)
        return a.fitsPooledNormal ? -1 : 1;
       if (a.maxOccupancy !== b.maxOccupancy)
        return b.maxOccupancy - a.maxOccupancy;
       return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
      }
      if (options.cheapestWithinSize) {
       // Fewest rooms first, then the cheapest way to fill them. Nothing here
       // looks at whether the set needs a surcharge until two sets are otherwise
       // level, so a two-room set that covers six by charging for two of them
       // leads the list instead of trailing every no-surcharge set behind it.
       if (a.roomCount !== b.roomCount) return a.roomCount - b.roomCount;
       if (a.allInPerNight !== b.allInPerNight)
        return a.allInPerNight - b.allInPerNight;
      }
      if (a.fitsPooledNormal !== b.fitsPooledNormal) return a.fitsPooledNormal ? -1 : 1;
      if (options.preferCheapest && a.totalPerNight !== b.totalPerNight)
       return a.totalPerNight - b.totalPerNight;
      // Several room counts reach the sort together, so fewer rooms has to
      // outrank the headroom comparison - a three-room set always has more of it
      // than a two-room set, and always costs more.
      if (a.roomCount !== b.roomCount) return a.roomCount - b.roomCount;
      if (a.maxOccupancy !== b.maxOccupancy) return b.maxOccupancy - a.maxOccupancy;
      if (a.totalPerNight !== b.totalPerNight) return a.totalPerNight - b.totalPerNight;
      return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    });
}

/* ============================================================
   PER-ROOM FINANCIAL SPLIT
   ------------------------------------------------------------
   One stay snapshot in, one financial part per selected room out.
   Stay-level items (package, add-ons, extras, discount) are spread
   across the rooms in proportion to their room cost. Every
   allocation uses htAllocate, so the parts always re-add to the
   snapshot's own subtotal / tax / grand total exactly.
   ============================================================ */

// Split `total` across `weights` in proportion, with the rounding remainder
// landing on the last slot. Returns integers that sum back to `total`.
function htAllocate(total, weights) {
  var n = (weights || []).length;
  var out = [];
  for (var z = 0; z < n; z++) out.push(0);
  if (!n) return out;
  var t = Math.round(Number(total) || 0);
  if (!t) return out;
  var sum = 0;
  for (var w = 0; w < n; w++) sum += Number(weights[w]) || 0;
  if (sum <= 0) {
    // Nothing to weight by (all rooms free): the whole amount sits on the
    // first room rather than vanishing.
    out[0] = t;
    return out;
  }
  var acc = 0;
  for (var i = 0; i < n; i++) {
    var share = i === n - 1 ? t - acc : Math.round((t * (Number(weights[i]) || 0)) / sum);
    out[i] = share;
    acc += share;
  }
  return out;
}

// Spread stay-level facility lines across a set of rooms. Each room gets its
// own copy of the line carrying an equal share of the rate, so the set still
// adds up to the single amount the guest selected (server multiplies a per-night
// rate by nights on whichever row carries it).
function htSplitFacilityLines(lines, roomCount) {
  var list = Array.isArray(lines) ? lines : [];
  var n = Math.max(1, parseInt(roomCount, 10) || 1);
  var out = [];
  for (var i = 0; i < n; i++) out.push([]);
  for (var li = 0; li < list.length; li++) {
    var line = list[li] || {};
    var weights = [];
    for (var w = 0; w < n; w++) weights.push(1);
    var shares = htAllocate(line.b, weights);
    for (var k = 0; k < n; k++) {
      if (shares[k]) out[k].push({ a: line.a, b: shares[k] });
    }
  }
  return out;
}

function buildBookingRoomParts(snap) {
  if (!snap) return [];
  var rooms =
   snap.rooms && snap.rooms.length
    ? snap.rooms
    : snap.room
     ? [snap.room]
     : [];
  if (!rooms.length) return [];
  var n = rooms.length;
  var nights = Math.max(1, Number(snap.nights) || 1);
  var costs = snap.roomNightCosts || [];
  var gstRate = snap.gst != null ? Number(snap.gst) || 0 : htGstRate();

  var roomCost = rooms.map(function (rr, i) {
    if (costs[i]) return Math.round(Number(costs[i].cost) || 0);
    return Math.round(Number(rr && rr.pricePerNight) || 0) * nights;
  });

  // Pooled occupancy attributed room by room: each room seats up to its normal
  // capacity from the queue (adults first, then over-age children), and whatever
  // is still unseated at the end belongs to the last room of the set - the one
  // that was still filling when the party ran out of space. Summing this back
  // reproduces htOccupancyPool's extraAdultUnits / paidChildUnits exactly.
  var pool =
   snap.occupancy && typeof snap.occupancy === "object"
    ? snap.occupancy
    : htOccupancyPool(rooms, snap.adults, snap.childAges || []);
  var extraAdultsRate = Number(snap.extraAdultsRate) || 0;
  var childRate = Number(snap.childRate) || 0;
  var remA = Math.max(0, Number(pool.adults) || 0);
  var remC = Math.max(0, Number(pool.adultEquivalentChildren) || 0);
  // Free children are not chargeable, so they never consume a pooled slot, but
  // they still have to be recorded against a room. Hand them out in order, never
  // pushing a room past its own max-occupancy headroom, remainder last.
  var poolAges = Array.isArray(pool.childAges) ? pool.childAges : [];
  // Per-child per-night rates ride along with the ages in the same arrays, so
  // every split below keeps them index-parallel. Absent rates fall back to the
  // flat childRate the pool split has always used.
  var poolRates = Array.isArray(snap.childRates) ? snap.childRates : [];
  var hasRates = poolRates.length > 0;
  var freeMax =
   Number(pool.childAgeFreeMax) != null ? Number(pool.childAgeFreeMax) : 8;
  var paidAges = [];
  var freeAges = [];
  var paidRates = [];
  var freeRates = [];
  for (var agi = 0; agi < poolAges.length; agi++) {
   var ageV = poolAges[agi];
   if (ageV && typeof ageV === "object") ageV = ageV.ag != null ? ageV.ag : ageV.a;
   var ageNum = parseInt(ageV, 10);
   if (!isFinite(ageNum) || ageNum < 0) ageNum = 0;
   var rateNum = Math.max(0, parseFloat(poolRates[agi]) || 0);
   if (ageNum > freeMax) {
    paidAges.push(ageNum);
    paidRates.push(rateNum);
   } else {
    freeAges.push(ageNum);
    freeRates.push(rateNum);
   }
  }
  var remFree = freeAges.length;
  var last = n - 1;
  var occParts = rooms.map(function (rr, i) {
    var policy = htRoomOccupancyPolicy(rr);
    var cap = Math.max(0, policy.capacity);
    var incA = Math.min(remA, cap);
    remA -= incA;
    var incC = Math.min(remC, Math.max(0, cap - incA));
    remC -= incC;
    var ovA = i === last ? remA : 0;
    var ovC = i === last ? remC : 0;
    remA = i === last ? 0 : remA;
    remC = i === last ? 0 : remC;
    // Free children follow the same "last room takes the remainder" rule, but
    // are bounded by the room's own max-occupancy headroom.
    var headroom = Math.max(0, policy.maxOccupancy - (incA + ovA + incC + ovC));
    var freeHere = i === last ? remFree : Math.min(remFree, headroom);
    remFree -= freeHere;
    var myFreeAges = freeAges.splice(0, freeHere);
    var myFreeRates = freeRates.splice(0, freeHere);
    var myPaidAges = paidAges.splice(0, incC + ovC);
    var myPaidRates = paidRates.splice(0, incC + ovC);
    // With rates supplied the operator decides who is charged, so every
    // over-age child in THIS room with a non-zero rate is billed - whether the
    // pool seated them inside the included capacity or not. Without rates the
    // pool's overflow count and the flat rate stand, unchanged.
    var chargedRates = [];
    if (hasRates) {
      for (var cri = 0; cri < myPaidRates.length; cri++) {
        if (myPaidRates[cri] > 0) chargedRates.push(myPaidRates[cri]);
      }
    }
    var chargedRateSum = chargedRates.reduce(function (a, r) {
      return a + r;
    }, 0);
    return {
      includedAdults: incA,
      extraAdults: ovA,
      adults: incA + ovA,
      // Over-age children sleeping in this room (included in the pooled normal
      // occupancy plus the ones billed extra) - this is the guest-block count.
      overAgeChildren: incC + ovC,
      // Over-age children actually charged, each at its own rate.
      paidChildren: hasRates ? chargedRates.length : ovC,
      freeChildren: freeHere,
      childAges: myFreeAges.concat(myPaidAges),
      childRates: myFreeRates.concat(myPaidRates),
      chargedChildRates: chargedRates,
      // Per-night money for the bill label: a single rate when every charged
      // child in this room is priced alike, otherwise the per-night total.
      childRateSum: hasRates ? chargedRateSum : ovC * childRate,
      childRateUniform: hasRates
        ? chargedRates.length === 0 ||
          chargedRates.every(function (r) {
            return r === chargedRates[0];
          })
        : true,
      adultFee: Math.round(ovA * extraAdultsRate * nights),
      childFee: Math.round(
        (hasRates ? chargedRateSum : ovC * childRate) * nights,
      ),
    };
  });

  var pkgShare = htAllocate(snap.packageCost || 0, roomCost);
  var addonShare = htAllocate(snap.addonCost || 0, roomCost);
  var extraShare = htAllocate(snap.extraCharges || 0, roomCost);
  var discShare = htAllocate(snap.discountAmt || 0, roomCost);

  var parts = rooms.map(function (rr, i) {
    var o = occParts[i];
    var subtotal =
     roomCost[i] +
     o.adultFee +
     o.childFee +
     pkgShare[i] +
     addonShare[i] +
     extraShare[i] -
     discShare[i];
    return {
     index: i,
     room: rr,
     roomId: String(
      rr && rr.id != null ? rr.id : rr && rr.e != null ? rr.e : "",
     ),
     roomNo: rr && rr.e != null ? rr.e : rr && rr.no != null ? rr.no : "",
     roomName: (rr && rr.name) || "",
      nights: nights,
      roomCostFull: roomCost[i],
      includedAdults: o.includedAdults,
      adults: o.adults,
      childAges: o.childAges,
      childRates: o.childRates,
      chargedChildRates: o.chargedChildRates,
      freeChildren: o.freeChildren,
      extraAdults: o.extraAdults,
      // Charged over-age children (drives the a:8 facility lines) ...
      paidChildren: o.paidChildren,
      // ... and every over-age child in the room, for the guest block.
      overAgeChildren: o.overAgeChildren,
     adultFee: o.adultFee,
     childFee: o.childFee,
     childRate: o.paidChildren
       ? o.childRateSum / o.paidChildren
       : 0,
     childRateSum: o.childRateSum,
     childRateUniform: o.childRateUniform,
     packageCost: pkgShare[i],
     addonCost: addonShare[i],
     extraCharges: extraShare[i],
     discountAmt: discShare[i],
     subtotal: Math.round(subtotal),
     gst: gstRate,
     tax: 0,
     total: 0,
    };
  });

  // Tax each part on its own base, then push the rounding difference onto the
  // largest part so the parts re-add to the snapshot totals exactly.
  var big = 0;
  for (var b = 1; b < parts.length; b++) {
    if (parts[b].subtotal > parts[big].subtotal) big = b;
  }
  var taxSum = 0;
  for (var t = 0; t < parts.length; t++) {
    parts[t].tax = gstRate > 0 ? Math.round((parts[t].subtotal * gstRate) / 100) : 0;
    taxSum += parts[t].tax;
  }
  var snapTax = Math.round(Number(snap.tax) || 0);
  if (snapTax) parts[big].tax += snapTax - taxSum;
  var totalSum = 0;
  for (var g = 0; g < parts.length; g++) {
    if (parts[g].tax < 0) parts[g].tax = 0;
    parts[g].total = parts[g].subtotal + parts[g].tax;
    totalSum += parts[g].total;
  }
  // Reconcile the grand total the same way, so the combined bill is unchanged.
  var snapTotal = Math.round(Number(snap.grandTotal) || 0);
  if (snapTotal) {
    var delta = snapTotal - totalSum;
    if (delta && parts[big].total - delta >= 0) parts[big].total += delta;
  }
  return parts;
}

// Pull the created booking ids out of a save response. The server echoes the
// ids in x1 (a scalar for one row, a list for several) and repeats them on the
// echoed rc/rb records, so read BOTH sources and merge them rather than
// stopping at the first one that yields anything.
// A combined booking id is "12_13_14-<timestamp>": the ids are joined with an
// underscore and the writers append a "-<timestamp>" uniqueness tail.
var PP_ID_SEP_RE = /[_,\s]+/;

function bookingIdsFromResp(resp) {
  var out = [];
  function push(v) {
    if (v == null || v === "") return;
    // A combined value ("12_13") still counts as the ids it carries.
    String(v)
      .split(PP_ID_SEP_RE)
      .forEach(function (part) {
        var s = part.trim();
        // Drop the uniqueness timestamp the writers append to a payment id.
        s = s.replace(/-\d+$/, "");
        if (s !== "" && out.indexOf(s) === -1) out.push(s);
      });
  }
  if (!resp || typeof resp !== "object") return out;
  push(resp.x1);
  ["rc", "rb"].forEach(function (tb) {
    var list = resp[tb] && resp[tb].l;
    // The echoed rows come back either as an array or keyed by id.
    var rows = Array.isArray(list)
      ? list
      : list && typeof list === "object"
        ? Object.keys(list).map(function (k) {
            return list[k];
          })
        : [];
    rows.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      push(row.a != null ? row.a : row.bkId != null ? row.bkId : null);
    });
  });
  return out;
}

// The rooms of a stay snapshot, always as a list, for every caller that used to
// assume a single room.
function getBookingRooms(snap) {
  if (!snap) return [];
  if (snap.rooms && snap.rooms.length) return snap.rooms;
  return snap.room ? [snap.room] : [];
}

/* ============================================================
   PER-ROOM BOOKING ROWS (send-side, shared)
   ------------------------------------------------------------
   A combination is stored as ONE zrb ROW PER ROOM, so both writers
   (public fn 113 and admin fn 112) post an array of rows. Each row
   carries that room's own financial part (m), that room's discount
   (n), that room's payments (r) and a guest block (k) scoped to
   the guests actually sleeping in it. The parts always re-add to
   the stay snapshot, so the combined total is unchanged.
   ============================================================ */

// The facility-charges envelope for one part. l holds the room rate plus one
// line per extra adult (9) and per paid child (8); ado/adt carry this room's
// share of the selected add-ons and extras.
function buildBookingRoomL(part, ctx) {
  var cfg = (ctx && ctx.cfg) || {};
  var charges = [];
  // The room rate is per-night (charged = rate x nights). The public writer
  // sends it because that flow has always carried a:1; the admin writer lets the
  // server derive it from rm, so the row only carries the guest-count charges.
  if (ctx && ctx.includeRoomRate) {
    var rate = (ctx.roomRates || [])[ctx.index] || 0;
    if (rate > 0) charges.push({ a: 1, b: rate });
  }
  var adultsRate = cfg.extraAdultsCharge || 0;
  for (var ai = 0; ai < part.extraAdults; ai++) {
    charges.push({ a: 9, b: adultsRate });
  }
  // One a:8 line per charged child, each carrying that child's own per-night
  // rate. chargedChildRates is empty on the public flow, which has no per-child
  // rates and keeps the single flat config charge.
  var chargedChildRates = part.chargedChildRates || [];
  if (chargedChildRates.length) {
    for (var cri = 0; cri < chargedChildRates.length; cri++) {
      charges.push({ a: 8, b: chargedChildRates[cri] });
    }
  } else {
    var childCharge = cfg.paidChildCharge || 0;
    for (var ci = 0; ci < part.paidChildren; ci++) {
      charges.push({ a: 8, b: childCharge });
    }
  }
  return buildBookingFacilityL(
    charges,
    (ctx && ctx.addonPart) || [],
    (ctx && ctx.extraPart) || [],
    (ctx && ctx.chargeWithAc) || 0,
  );
}

// Guest block (zrb.k) for one part. a adults, b children total, c the
// adult-equivalent children, d the free children, e their ages, f package id,
// g parallel child-rate slots, h the extras breakdown. Everything here is
// scoped to the room, so a read-back bill of one row shows its own guests.
function buildBookingRoomGuestJson(part, snap, ctx) {
  var extraBreakdown = (ctx && ctx.extraBreakdown) || [];
  return JSON.stringify({
    a: part.adults,
    b: (part.childAges || []).length,
    // c is the adult-equivalent (over free-age) children in this room, which is
    // every one of them whether or not they were billed extra.
    c: part.overAgeChildren != null ? part.overAgeChildren : part.paidChildren,
    d: part.freeChildren,
    e: part.childAges || [],
    f: (ctx && ctx.packageId) || 0,
    // g is parallel to e: the per-night rate of each child in this room, 0 for
    // a child that is not charged.
    g: (part.childAges || []).map(function (_, gi) {
      return Math.max(0, parseFloat((part.childRates || [])[gi]) || 0);
    }),
    h: extraBreakdown,
  });
}

// Build the send array - one row per booked room. Returns [] when the snapshot
// has no usable room, so callers can report "nothing to send" instead of
// posting a broken row.
function buildBookingRoomRows(snap, opts) {
  var o = opts || {};
  var parts = buildBookingRoomParts(snap);
  if (!parts.length) return [];
  var cfg = window[my1uzr.worknOnPg]?.clientConfig || {};
  var rows = [];
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    var addonPart = (o.addonShares && o.addonShares[i]) || [];
    var extraPart = (o.extraShares && o.extraShares[i]) || [];
    rows.push({
      // One row per room, so the room field is a single id string.
      e: part.roomId,
      f: o.bookingDtt,
      g: o.checkin,
      h: o.checkout,
      i: o.actualCheckin,
      j: o.actualCheckout,
      k: buildBookingRoomGuestJson(part, snap, {
        packageId: o.packageId,
        extraBreakdown: o.extraBreakdown,
      }),
      l: buildBookingRoomL(part, {
        cfg: cfg.HT_CFG || {},
        index: i,
        includeRoomRate: !!o.includeRoomRate,
        roomRates: o.roomRates || [],
        addonPart: addonPart,
        extraPart: extraPart,
        chargeWithAc: o.chargeWithAc,
      }),
      m: part.total,
      n: part.discountAmt,
      o: o.bookerId,
      p: 0,
      q: o.specialRequests || null,
      r: (o.payments && o.payments[i]) || [],
    });
  }
  return rows;
}

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
    } catch (e) { }
   }
  }
 }
  var occupancyPolicy = htRoomOccupancyPolicy(rm);
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
   capacity: occupancyPolicy.capacity,
   maxAdults: occupancyPolicy.capacity,
   maxOccupancy: occupancyPolicy.maxOccupancy,
   childAgeFreeMax: occupancyPolicy.childAgeFreeMax,
   occupancyPolicy: occupancyPolicy,
   bed: htBedLabels(rm).join(" + ") || "King Bed",
  area: htRoomDimensions(rm) || "",
  amenities: htAmenityLabels(rm),
  ac: !!(type && type.folder === "AC"),
  facilities: htFacilityItems(rm),
  desc: [],
  images: images,
   includedGuests: occupancyPolicy.capacity,
    extraGuestRate: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.extraAdultsCharge || 0,
    childRate: window[my1uzr.worknOnPg].clientConfig?.HT_CFG?.paidChildCharge || 0,
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
  '<a href="' + window[my1uzr.worknOnPg].clientConfig.trmsFl + '" target="_blank">Terms & Conditions</a>' +
  '<span class="ht-footer-sep">|</span>' +
  '<a href="' + window[my1uzr.worknOnPg].clientConfig.prvcFl + '" target="_blank">Privacy Policy</a>' +
  '<span class="ht-footer-sep">|</span>' +
  '<a href="' + window[my1uzr.worknOnPg].clientConfig.rfndFl + '" target="_blank">Refund Policy</a>' +
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
   on that section (openAdminPage is now inline in rm.js). */
async function openAdminFromMenu(action) {
 var item = null;
 for (var i = 0; i < moduLst.length; i++) {
  if (moduLst[i].d === action) {
   item = moduLst[i];
   break;
  }
 }
 if (!item) return;
 /* admin.js merged into rm.js — fn 40 no longer needed */
 if (typeof toggleSidebar !== "function") {
  try {
   await loadExe2Fn(41);
  } catch (e) { }
 }
 if (typeof calcNights !== "function") {
  try {
   await loadExe2Fn(42);
  } catch (e) { }
 }
 if (typeof htRoomName !== "function") {
  try {
   await loadExe2Fn(43);
  } catch (e) { }
 }
 if (typeof showDashboard !== "function") {
  try {
   await loadExe2Fn(44);
  } catch (e) { }
 }
  var alreadyLoaded = {};
  [41, 42, 43, 44].forEach(function (id) { alreadyLoaded[id] = true; });
  /* Only ids that actually exist in csh are loadable. A stale id would make
     loadExe2Fn throw and alert(), which blocks the whole menu action. */
  var cshIds = {};
  (window[my1uzr.worknOnPg].csh || []).forEach(function (s) {
   cshIds[s.a] = true;
  });
  var fns = item.mi.split(",").filter(function (n) {
   if (n === "") return false;
   var id = parseInt(n, 10);
   if (!cshIds[id])
    console.warn("moduLst '" + item.d + "': script id " + id + " has no csh entry, skipping.");
   return cshIds[id];
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
// hiddenCount is how many rooms the current party/dates left out of the list
// (booked for the dates, or too small). They are not rendered as cards, so the
// bar is the only place the guest learns the list is short. When no search was
// run at all - only the stepper moved - the bar is that note on its own, with
// no "Show all rooms" button, which could not bring those rooms back anyway.
function roomFilterBarHtml(list, comboCount, hiddenCount, combosOnly) {
  // A party over the top of rm.da's showOnlyCombosAbovePersons band is shown
  // combinations only, so every count this bar reports is a zero and its "No single
  // room is available" line would be untrue - rooms were available, the rule just
  // does not list them. The guest is told nothing here: the combinations section is
  // simply the list. A party inside the band's lower half still reads this bar
  // normally, because its room list is a real list.
  //
  // rm.da's showExtraChargeRoomsAbovePersons puts the room list back, and the bar
  // comes back with it. The test is htSingleRoomsHiddenForParty - the same one the
  // wipe uses, rather than a second copy of it here, so this can never end up
  // counting a list the guest cannot see or suppressing a bar they need.
  if (htSingleRoomsHiddenForParty()) return "";
  // The count the search itself used: with rm.da's free-child flag on, children
  // within the free age are not part of it, so every "N guests" below agrees
  // with the rooms that were kept. With the flag off it stays a head count.
  var sp = htSearchParty();
  var total = sp.total;
  var kids = sp.pool.children;
  var searched = roomFilterActive || roomAvailFilter;
  hiddenCount = hiddenCount || 0;
  if (!searched && !hiddenCount) return "";
  comboCount = comboCount || 0;
  var guestLabel = total > 0
   ? adults +
   " adult" +
   (adults > 1 ? "s" : "") +
   (kids > 0
    ? ", " + kids + " child" + (kids > 1 ? "ren" : "") +
      // The children are off the count above, so say how many of them ride free.
      (sp.excluding && sp.pool.freeChildren > 0
       ? " \u00b7 " + sp.pool.freeChildren + " free"
       : "")
    : "")
   : "";
  var hiddenNote =
   hiddenCount > 0
    ? '<span class="ht-filter-note"><i class="fa-solid fa-eye-slash"></i> ' +
      hiddenCount +
      " room" +
      (hiddenCount > 1 ? "s" : "") +
      " not shown" +
      (total > 0
       ? " \u00b7 " +
         (roomAvailFilter
          ? "booked for your dates or too small for " + total
          : "too small for " + total + " guest" + (total > 1 ? "s" : ""))
       : "") +
      "</span>"
    : "";
  if (!searched) {
   return (
    '<div class="ht-filter-bar ht-filter-bar-note"><i class="fa-solid fa-user-group"></i> ' +
    "<b>" +
    list.length +
    "</b> room" +
    (list.length > 1 ? "s" : "") +
    (total > 0
     ? " for <b>" + total + "</b> guest" + (total > 1 ? "s" : "")
     : "") +
    "." +
    hiddenNote +
    "</div>"
   );
  }
  var scope;
  if (roomFilterActive && roomAvailFilter) {
   scope = total > 0
    ? "<b>" + total + "</b> guest" + (total > 1 ? "s" : "") + " on your selected dates"
    : "your selected dates";
  } else if (roomAvailFilter) {
   scope = "your selected dates";
  } else {
   scope = total > 0
    ? "<b>" + total + "</b> guest" + (total > 1 ? "s" : "")
    : "your criteria";
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
    (roomFilterActive && guestLabel ? " (" + guestLabel + ")" : "") +
    "." +
    hiddenNote +
    '<button class="ht-btn ht-btn-ember" onclick="clearAvailFilter()">Show all rooms</button></div>'
   );
  }
  return (
   '<div class="ht-filter-bar ht-filter-bar-empty"><i class="fa-solid fa-triangle-exclamation"></i> ' +
   (comboCount > 0
    ? "No single room is available for " +
      scope +
      (roomFilterActive && guestLabel ? " (" + guestLabel + ")" : "") +
      ", but " +
      comboCount +
      " room combination" +
      (comboCount > 1 ? "s" : "") +
      " can."
    : "No room is available for " +
      scope +
      (roomFilterActive && guestLabel ? " (" + guestLabel + ")" : "")) +
   hiddenNote +
   '<button class="ht-btn ht-btn-ember" onclick="clearAvailFilter()">Show all rooms</button></div>'
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
  var party = htPublicParty();
  var availNow = [];
  var availLater = [];
  var soldOut = [];
  var tooSmall = [];
  // rm.da "showOnlyCombosAbovePersons": read before the loop, because whether a
  // room is listed is decided by the party size and not by the room itself.
  var combosOnly = htCombosOnlyForParty();
  // The other end of the same band. The two are read together because which of the
  // two lists survives is one decision, and a party is always left with one of them.
  var combosHidden = htCombosHiddenForParty();
  list.forEach(function (r) {
   var free =
    !checkIn || !checkOut
     ? true
     : typeof publicRoomIsAvailable === "function"
      ? publicRoomIsAvailable(r, checkIn, checkOut)
      : true;
   if (!free) {
    soldOut.push(r);
    return;
   }
   // A room that cannot sleep the whole party is never offered, even when its
   // dates are free - a combination of rooms is offered instead.
   var occ = htEffectiveRoomOccupancy(r, party.adults, party.childAges);
   if (occ.overMaxOccupancy) {
    tooSmall.push(r);
    return;
   }
    (occ.isOverCapacity ? availLater : availNow).push(r);
   });
  // A party over the rm.da threshold reads combinations only, so the room cards
  // are dropped here - both the normally priced list and the extra-guest-charge
  // one. tooSmall and soldOut are left alone: they are counted as "not shown"
  // for the reason they actually did not appear, and in this mode the bar that
  // would say so is suppressed.
  //
  // rm.da's showExtraChargeRoomsAbovePersons keeps this list, so a party of six
  // still sees the suite that sleeps six, with its surcharge, above the
  // combinations. Nothing that cannot hold the party reaches this point either
  // way: the overMaxOccupancy test above has already put those in tooSmall.
  if (htSingleRoomsHiddenForParty()) {
   availNow = [];
   availLater = [];
  }
  var sections = "";
  if (availNow.length) {
   sections =
    '<div class="ht-room-list">' +
    availNow.map(function (r) { return roomCardHtml(r, "now"); }).join("") +
    "</div>";
  }
  if (availLater.length) {
   sections +=
    '<div class="container"><div class="ht-combo-section-title"><i class="fa-solid fa-arrow-up-long"></i> Available with an extra guest charge</div></div>' +
    '<div class="ht-room-list">' +
    availLater.map(function (r) { return roomCardHtml(r, "extra"); }).join("") +
    "</div>";
  }
 var combosHtml = "";
 var combos = [];
  // An empty stepper has no party to match sets against, so the combinations are
  // left out unless rm.da asks for every room option on the first paint.
  // A party inside the band's lower half is the other way round: it has a party, and
  // rm.da has said this size reads single rooms, so the sets are not built at all -
  // and this beats showAllOptionsOfRoomsOnInit, which would otherwise put them back
  // on the first paint.
  if (
   typeof publicComboOptions === "function" &&
   !combosHidden &&
   (party.total > 0 || (!party.total && htShowAllRoomOptions()))
  ) {
    combos = publicComboOptions(party.adults, party.childAges);
    // Say the group has no options at all only when both lists came up empty -
    // either because the band rule took the rooms away, or because with
    // showExtraChargeRoomsAbovePersons on no room turned out to sleep the party
    // either. A suite sitting in the section above must not be contradicted by
    // this, and a genuinely empty page must not be left silent.
    if (
     !combos.length &&
     (htSingleRoomsHiddenForParty() ||
      (!availNow.length && !availLater.length))
    ) {
     // A group this size is only ever offered combinations, so having none is a
     // real answer rather than a missing section - say so instead of leaving the
     // page with a silent gap between the search area and the policies.
     combosHtml =
      '<div class="container"><div class="ht-empty">' +
      '<i class="fas fa-people-group"></i>' +
      "<b>No stay options for " +
      htSearchParty().total +
      " guests</b>" +
      "<p>No combination of rooms is free for the selected dates. Try different dates, or call us and we will find a way.</p>" +
      "</div></div>";
    }
    if (combos.length) {
    // Combinations are offered next to the single rooms too, so the "no single
    // room sleeps N" note only belongs here while the list above is empty. In
    // combos-only mode the list above is empty because the rule emptied it, and
    // a room may well have been able to take the party - the note would be
    // claiming a limit the hotel does not have, so it stays off. The same goes for
    // showExtraChargeRoomsAbovePersons, except that there the list is empty
    // because the party is genuinely past every room - which is the one case where
    // the note is true.
    var noSingleFits = !htSingleRoomsHiddenForParty() && !availNow.length && !availLater.length;
    // The N is the head count the search actually matched on, which is not the
    // same number as party.total once free children are off it.
    var noSingleSleeps = htSearchParty().total;
    combosHtml =
     '<div id="htComboSection">' +
     '<div class="container"><div class="ht-combo-section-title"><i class="fa-solid fa-people-group"></i> Stay in a combination of rooms' +
     (noSingleFits
      ? ' <span style="font-family:var(--font-body);font-size:12px;font-weight:400;color:var(--brown)">no single room sleeps ' + noSingleSleeps + "</span>"
      : "") +

    "</div></div>" +
    comboCardsHtml(combos) +
    "</div>";
   }
 }
  // Rooms that are booked for the selected dates, or that cannot sleep the
  // party, are never rendered - they used to sit at the bottom of the list as
  // greyed-out cards. They are still counted, so the bar above the list can
  // tell the guest how many rooms the current search left out.
  var hiddenCount = tooSmall.length + soldOut.length;
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
  lastSearchSingleCount = availNow.length + availLater.length;
  lastSearchComboCount = combos.length;
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
   roomFilterBarHtml(
    availNow.concat(availLater),
    combos.length,
    hiddenCount,
    combosOnly,
   ) +
   "</div>" +
  sections +
  combosHtml +
  '<div class="container pb-5">' +
  policiesSectionHtml() +
  "</div>";
  bindSlider();
}

// The occupancy chosen in the nav stepper, with every child's age resolved to a
// number so htOccupancyPool can bucket it as in-range or chargeable. The ages
// come from the childAges array that setChildAge/addChild/removeChild maintain;
// an unresolved age falls back to 0, which is inside the free range.
function htPublicParty() {
 var n = Math.max(0, parseInt(children, 10) || 0);
 var a = Math.max(0, parseInt(adults, 10) || 0);
 var ages = [];
 for (var i = 0; i < n; i++) {
  var age = parseInt(Array.isArray(childAges) ? childAges[i] : undefined, 10);
  ages.push(isNaN(age) ? 0 : age);
 }
  return { adults: a, childAges: ages, total: a + n };
}

// What a room costs for the dates in the nav bar: the total for the whole stay
// and the per-night average of it. Rates come from roomNightRate (booking.js),
// which reads the per-weekday overrides in room.weekRates and falls back to the
// room's base rate.
//
// The AC rate is deliberately NOT followed: a room card carries no AC switch -
// the guest turns AC on in the summary sheet, where the price re-prices - so the
// list always advertises the non-AC rate. With no usable range (no dates, or a
// single date) dated is false and the caller shows the plain base rate.
function htStayRate(room) {
  var base = Number(room && room.pricePerNight) || 0;
  var nights =
    typeof nightsBetween === "function" ? nightsBetween(checkIn, checkOut) : 0;
  if (
    !room ||
    !(nights > 0) ||
    !checkIn ||
    typeof roomNightRate !== "function" ||
    typeof addDays !== "function"
  ) {
    return { dated: false, nights: 0, total: base, avg: base };
  }
  var total = 0;
  for (var i = 0; i < nights; i++) {
    total += Number(roomNightRate(room, addDays(checkIn, i), false)) || 0;
  }
  return {
   dated: true,
   nights: nights,
   total: total,
   avg: Math.round(total / nights),
  };
}

// The mode-3 price line, shared by the room card and the combination card so
// both say the same thing the same way: the total in the display serif, the GST
// added to it small and muted on the same baseline, then an optional note
// ("for 2 nights", "/ night"). Inline spans, not blocks - the caller decides
// which element wraps them, so a card and a combination footer can size the one
// figure differently while the markup stays the same.
//
// No breakdown: the total and the tax on it are what a guest needs to judge the
// offer, and the summary sheet still spells out every night of the stay.
//
// Returns "" for an amount that cannot be quoted, so the caller can fall back to
// its own wording. With no GST configured the small half is left off rather than
// printing a pointless "+ ₹ 0 GST".
function htTotalWithGstHtml(amount, note) {
  var total = Math.round(Number(amount) || 0);
  if (!(total > 0)) return "";
  var gst = htGstOn(total);
  return (
   '<span class="ht-gst-total">' +
   fmtMoney(total) +
   "</span>" +
   (gst > 0
    ? '<span class="ht-gst-add">+ ' + fmtMoney(gst) + " GST</span>"
    : "") +
   (note ? '<span class="ht-gst-note">' + escHtml(note) + "</span>" : "")
  );
}

// What the party in the nav stepper owes on top of the room's own nights, over a
// set of rooms. This is the occupancy term of the paysheet's taxable base and
// nothing else: calcBooking (booking.js) builds
//
//   subtotal = room nights + extraAdults x extraAdultsCharge x nights
//                        + paidChildUnits x paidChildCharge x nights
//
// and its other terms are zero on a search card - the guest has not picked a
// package or an add-on yet, and the long-stay discount is still hard-wired to 0 -
// so those two are the whole difference, on both sides of the page.
//
// The pool comes from htOccupancyPool, the same call calcBooking makes with the
// same adults/childAges globals, so included, free and over-age children resolve
// identically here and on the summary sheet.
//
// nights of 0 means no dates are chosen, and the card is quoting a single night:
// the charge is then counted for one night, which is what the guest would meet on
// the first night of any stay they pick, rather than silently quoting a room
// total that hides the surcharge its own "Extra guest charge applies" chip
// advertises.
function htPartyCharge(rooms, nights) {
  var pool = htOccupancyPool(rooms, adults, childAges);
  var cfg = window[my1uzr.worknOnPg]?.clientConfig?.HT_CFG || {};
  var units = Number(nights) > 0 ? Number(nights) : 1;
  var extraAdultUnits = Number(pool.extraAdultUnits) || 0;
  var paidChildUnits = Number(pool.paidChildUnits) || 0;
  var fee =
   extraAdultUnits * (Number(cfg.extraAdultsCharge) || 0) * units +
   paidChildUnits * (Number(cfg.paidChildCharge) || 0) * units;
  return { fee: fee, pool: pool, nights: units };
}

// The figure a mode-3 card leads with: the room's own nights plus what the party
// adds to them, which is the same total the paysheet will arrive at (before GST,
// and before any package or add-on the guest picks later on the details page).
// base and fee are carried alongside so a caller can show the uplift on its own
// if it wants to.
function htCardTotal(rooms, roomTotal, nights) {
  var base = Math.round(Number(roomTotal) || 0);
  var charge = htPartyCharge(rooms, nights);
  var fee = Math.round(Number(charge.fee) || 0);
  return {
   base: base,
   fee: fee,
   total: base + fee,
   hasFee: fee > 0,
   pool: charge.pool,
  };
}

// The priced rows a room card shows in place of one headline figure, in the
// paysheet's own markup (summaryHtml -> dayRatesHtml uses these classes, and
// buildDayRates is the same call) so a card line and a paysheet line are the
// same line. Two shapes, chosen by rm.da's showAndOptionsOfCardPriceings:
//
//   on  - the room's weekly pricing: a normal night, a Friday and a Saturday,
//         as three separate amounts. A rate that repeats one already listed is
//         dropped, so a room with no weekend markup prints a single row. These
//         are the room's own prices rather than the stay's, so no dates are
//         needed and the rows show on first paint.
//   off - one dated row per night of the stay, all of them (a 30-night stay
//         prints 30 rows), which needs a dated stay.
//
// A third setting, 3, lists nothing: the card shows one total with the GST on it
// instead (htTotalWithGstHtml), so this function stands aside entirely.
//
// Rates are not re-derived here. Both modes run buildDayRates, which is what
// priced the stay, so a card can never quote a number the paysheet contradicts.
// Returns "" when the mode has nothing to price - the caller then keeps the plain
// "Starting ... / night" wording.
function htCardPriceRows(room, nights) {
  if (!room || typeof buildDayRates !== "function") return "";
  // Mode 3 quotes one total rather than a list, so there is nothing to list. This
  // is the single choke point for that mode: the room card asks for rows either
  // way and gets "" back here, then renders its own total line.
  if (htCardShowsTotalWithGst()) return "";
  var rows = [];
  var seen = [];
  var dedupe = false;
  if (htCardShowsWeeklyRates()) {
    dedupe = true;
    // A week of nights always contains every weekday, so pricing one week and
    // bucketing it by weekday yields the Friday, Saturday and normal rates
    // through the same code path the stay itself used. With no dates chosen the
    // week starts today, which prices the same room the same way.
    var from =
      checkIn || (typeof todayStr === "function" ? todayStr() : "");
    var week = from ? buildDayRates(room, from, 7) : null;
    if (!week) return "";
    var byDay = {};
    var tally = {};
    // Weekday of night w, walked from the window's first night so the key lines
    // up with the dayRates rows buildDayRates just produced.
    var d0 = new Date(from + "T00:00:00");
    if (isNaN(d0.getTime())) d0 = new Date();
    for (var w = 0; w < week.dayRates.length; w++) {
      var rate = Number(week.dayRates[w].rate) || 0;
      var dayKey = String(
        new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + w).getDay(),
      );
      byDay[dayKey] = rate;
      tally[rate] = (tally[rate] || 0) + 1;
    }
    // The most common rate in that week is the normal one - which is the room's
    // own base rate unless the hotel has priced most weekdays apart. Ties leave
    // the base rate in place, so "normal" is never an arbitrary weekday.
    var normal = Number(room.pricePerNight) || 0;
    var bestCount = tally[normal] || 0;
    for (var tk in tally) {
      if (!Object.prototype.hasOwnProperty.call(tally, tk)) continue;
      if (tally[tk] > bestCount) {
        bestCount = tally[tk];
        normal = Number(tk) || 0;
      }
    }
    rows.push({ label: "Normal night", rate: normal });
    // Friday (5) and Saturday (6), only when they are priced apart from what is
    // already on the list.
    if (byDay["5"] != null) rows.push({ label: "Friday/Saturday", rate: byDay["5"] });
    if (byDay["6"] != null) rows.push({ label: "Saturday", rate: byDay["6"] });
  } else {
    // The stay itself, one row per charged night. Nothing here without dates.
    if (!(nights > 0) || !checkIn) return "";
    var dr = buildDayRates(room, checkIn, nights);
    for (var i = 0; i < dr.dayRates.length; i++) {
      rows.push({ label: dr.dayRates[i].date, rate: dr.dayRates[i].rate });
    }
  }
  // Past a handful of rows the list stops being a headline and starts being a
  // ledger, so it marks itself long and the card types it down a size.
  var html =
    '<div class="s-day-rates' +
    (rows.length > 6 ? " is-long" : "") +
    '">';
  for (var ri = 0; ri < rows.length; ri++) {
    var amt = Math.round(Number(rows[ri].rate) || 0);
    // The weekly view drops a rate that repeats one already listed - a Friday
    // that costs the same as a normal night, or a Saturday that costs the same
    // as the Friday. The per-stay view keeps every night, repeated rate and all,
    // because each row is a real date the guest will be charged.
    if (dedupe && seen.indexOf(amt) !== -1) continue;
    seen.push(amt);
    html +=
      '<div class="s-day-rate"><span class="s-day-name">' +
      escHtml(rows[ri].label) +
      '</span><span class="s-day-price">' +
      fmtMoney(amt) +
      "</span></div>";
  }
  // Every figure above is a bare nightly rate, so the GST that is added at the
  // paysheet stays out of it - say so once, at the foot of the list.
  return html + '<div class="ht-price-gst">excl. GST</div></div>';
}


// state: now = bookable, extra = bookable with a surcharge.
//
// Only bookable rooms are ever rendered: a room that is booked for the selected
// dates, or that cannot sleep the party, is left out of the list entirely
// rather than shown greyed out.
function roomCardHtml(r, state) {
  var badgeIcon = r.ac ? "fa-snowflake" : "fa-fan";
  var policy = htRoomOccupancyPolicy(r);
  // Both bookable states get the greenish card and the Available chip; the
  // surcharge of the "extra" state is called out separately in the footer.
  var chip =
   '<span class="ht-avail-chip"><i class="fa-solid fa-circle-check"></i> Available</span>';
  var foot =
   '<button class="ht-btn ht-btn-ember" onclick="bookRoomNow(\'' +
   r.id +
   '\')">Book Now</button>' +
   (state === "extra"
    ? '<span class="ht-extra-chip"><i class="fa-solid fa-coins"></i> Extra guest charge applies</span>'
    : "");
  // With dates chosen the card prices the stay the way the paysheet does, one
  // line per night (or per distinct weekday rate, per rm.da
  // showAndOptionsOfCardPriceings) - see htCardPriceRows. Without dates it keeps
  // the base rate and its "from" wording. The image chip carries the stay facts
  // only: quoting a per-night average there would contradict the block below it.
  var stay = htStayRate(r);
  // The weekly view prices the room itself and needs no dates; the per-stay view
  // is the stay and only exists once dates are chosen. Mode 3 lists no rows at
  // all - htCardPriceRows stands aside and this line below takes its place.
  var dayRows =
   (htCardShowsWeeklyRates() || stay.dated)
    ? htCardPriceRows(r, stay.nights)
    : "";
  // Mode 3: one figure - what the party actually pays for this stay, and the GST
  // on top of it. The room's own nights come from htStayRate; htCardTotal adds
  // the occupancy surcharge for anyone past this room's included capacity, on the
  // same terms the paysheet uses, so a card and the summary sheet for the same
  // party land on the same number. Undated there is one night's worth of both,
  // which is the rate the guest would be quoted on any night they pick.
  //
  // The wrapper below is .ht-price (dayRows is empty, so listed is false), which
  // is exactly the big display serif the total should keep.
  var totalLine = "";
  var cardTotal = null;
  if (htCardShowsTotalWithGst()) {
   cardTotal = htCardTotal(
    [r],
    stay.dated ? stay.total : Number(r.pricePerNight) || 0,
    stay.dated ? stay.nights : 0
   );
   totalLine = htTotalWithGstHtml(
    cardTotal.total,
    stay.dated
     ? "for " + stay.nights + (stay.nights > 1 ? " nights" : " night")
     : "/ night"
   );
  }
  // If the priced rows could not be produced after all, the card falls back to
  // the plain base rate rather than showing an empty price block.
  var listed = !!dayRows;
  // A long per-stay list is a ledger, not a headline: it types down a size and
  // drops the button to the foot of it (see .ht-card-foot-long).
  var longList = dayRows.indexOf("is-long") !== -1;
  var chipStart = stay.dated
   ? stay.nights + (stay.nights > 1 ? " nights" : " night")
   : cardTotal && cardTotal.hasFee
    ? ""
    : "Starting " + fmtMoney(r.pricePerNight) + " / night";
  // The image chip carries the stay facts, not the price: quoting a second
  // per-night figure here would argue with the one under the image. So the
  // "Starting ..." rate is dropped exactly when the party charge has moved the
  // price off the base rate, and the capacity stays either way.
  var chipFacts = [];
  if (chipStart) chipFacts.push(chipStart);
  chipFacts.push(policy.capacity + " included");
  // Rows if there are any, else the mode-3 total, else the plain base rate. The
  // fallback keeps the capacity note because there is no total line carrying the
  // stay facts; the total line's own note covers the same ground.
  var price = listed
   ? dayRows
   : totalLine ||
     (fmtMoney(r.pricePerNight) +
      '<br><span class="per"> / night \u00b7 ' +
      policy.capacity +
      " included \u00b7 excl. GST</span>");
  return (
   '<article class="ht-room-card' +
   (state === "now" ? " is-avail" : " is-extra") +
  '" id="room-card-' +
  r.id +
  '">' +
  chip +
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
   '<span class="ht-chip-start">' +
   chipFacts.join(" \u00b7 ") +
   "</span>" +
  "</div>" +
  '<div class="ht-room-body">' +
  "<h2>" +
  escHtml(r.e) + " - " + escHtml(r.name) +
  "</h2>" +
  '<p class="tagline">' +
  escHtml(r.tagline) +
  "</p>" +
  '<div class="ht-badges">' +
   badgeHtml("fa-user-group", policy.capacity + " included") +
   badgeHtml("fa-people-group", "Sleeps up to " + policy.maxOccupancy) +
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
  '<div class="ht-card-foot' +
   (longList ? " ht-card-foot-long" : "") +
   '">' +
   // A rate list instead of one headline figure, so the block steps out of
   // .ht-price's 25px serif and keeps the foot's plain type. A div wrapper,
   // because the list inside it is block markup.
   '<div class="' +
   (listed ? "ht-price-block" : "ht-price") +
   '">' +
   price +
   "</div>" +
   foot +
   "</div>" +
  "</div></article>"
 );
}

/* ---------- Room combinations ---------- */
// The widened public search can turn up hundreds of sets, so the list opens on
// the best few and holds the rest back behind a count. The tail is built when
// the guest asks for it rather than up front: renderHome re-runs on every
// stepper change, and a few hundred cards of markup per re-render is a lot to
// throw away. Booking either way goes through bookComboNow, which reads the
// whole option list, so nothing is lost by holding the cards back.
var COMBO_CARDS_PREVIEW = 8;
var comboCardsHeld = [];

// How many cards the list opens on. rm.da's showCombosCheapestFirst puts the
// first two-room set at rank 11, so 12 is the smallest preview that reaches it -
// anything less hides the mix that the price order exists to produce. With the
// flag off the count is the 8 it has always been, and with the flag off the whole
// list is ordered by room count, where a bigger opening buys nothing.
function comboCardsPreviewCount() {
  return htCombosRankByAllInPrice() ? 12 : COMBO_CARDS_PREVIEW;
}

// One card per combination. Its rooms sit side by side, each keeping its own
// details, and the footer carries the combined nightly total plus the shared
// extra-guest / paid-child charges.
function comboCardsHtml(combos) {
  var list = combos || [];
  var preview = comboCardsPreviewCount();
  comboCardsHeld = list.slice(preview);
  return (
   '<div class="ht-combo-list">' +
   list.slice(0, preview).map(comboCardHtml).join("") +
  (comboCardsHeld.length
   ? '<div class="ht-combo-rest" id="htComboRest"></div>' +
     '<div class="ht-combo-more" id="htComboMore">' +
     '<button type="button" class="ht-btn ht-btn-gold" onclick="showAllCombos()">' +
     '<i class="fa-solid fa-layer-group"></i> Show all ' +
     list.length +
     " combinations" +
     "</button></div>"
   : "") +
  "</div>"
 );
}

window.showAllCombos = function () {
 var rest = el("htComboRest");
 if (rest) {
  rest.innerHTML = comboCardsHeld.map(comboCardHtml).join("");
  rest.classList.add("is-open");
 }
 var more = el("htComboMore");
 if (more && more.parentNode) more.parentNode.removeChild(more);
 comboCardsHeld = [];
};

function comboCardHtml(c) {
  var head =
   '<div class="ht-combo-head"><i class="fa-solid fa-layer-group"></i> ' +
   c.rooms.length +
   " room" +
   (c.rooms.length > 1 ? "s" : "") +
   ' <span class="tag">Sleeps ' + c.maxOccupancy + " combined</span>" +
   (c.fitsPooledNormal
    ? '<span class="tag"><i class="fa-solid fa-circle-check"></i> All guests included</span>'
    : '<span class="tag"><i class="fa-solid fa-coins"></i> Extra guest charge applies</span>') +
   "</div>";
  // Every room is priced for the selected dates (see htStayRate), and the
  // footer sums those stay totals rather than the base rates. Without dates the
  // card falls back to the plain per-night figures the search engine ranked on.
  var stayRates = c.rooms.map(htStayRate);
  var dated = stayRates.some(function (s) {
   return s.dated;
  });
  var stay = {
   nights: dated ? stayRates[0].nights : 0,
   total: stayRates.reduce(function (sum, s) {
    return sum + (s.dated ? s.total : s.avg);
   }, 0),
  };
  var rooms = c.rooms
   .map(function (r, ri) {
    var policy = htRoomOccupancyPolicy(r);
    var rs = stayRates[ri];
    var rate = rs.dated
     ? fmtMoney(rs.avg) + " / night avg"
     : fmtMoney(r.pricePerNight) + " / night";
    return (
     '<div class="ht-combo-room">' +
     '<img src="' +
     r.images[0] +
     '" alt="' +
     escHtml(r.name) +
     '" loading="lazy" onerror="imgFail(this)">' +
     '<div class="cr-body">' +
     '<span class="cr-no">Room ' + escHtml(r.e) + "</span>" +
     '<span class="cr-name">' + escHtml(r.name) + "</span>" +
     '<span class="cr-occ">' +
     policy.capacity +
     " included \u00b7 sleeps up to " +
     policy.maxOccupancy +
     " \u00b7 " +
     escHtml(r.bed) +
     "</span>" +
     '<span class="cr-rate">' + rate + "</span>" +
     "</div></div>"
    );
   })
   .join("");
  // The set's total and the context that gives it meaning, hoisted out of the two
  // wordings below so mode 3 can print the same figures in one shape. Dated it
  // is the whole stay plus the per-night average; undated it is the combined
  // nightly figure, which is what the ranking used.
  var totalAmount = dated ? stay.total : c.totalPerNight;
  // The party charge for this set, added to the room's own nights on the paysheet's
  // terms (see htPartyCharge). A combination pools its free slots across the rooms,
  // so its surcharge is usually nil even when a single room would have charged -
  // which is exactly what the set is for. The units come from this one pool, so the
  // breakdown line below and the total can never count different guests.
  var cardTotal = htCardTotal(c.rooms, totalAmount, dated ? stay.nights : 0);
  var totalNote = dated
   ? "for " +
     stay.nights +
     (stay.nights > 1 ? " nights" : " night") +
     " \u00b7 " +
     fmtMoney(Math.round(cardTotal.total / stay.nights)) +
     " / night avg"
   : "/ night";
  // Mode 3 replaces the <b> with the shared total-and-GST line, so the footer
  // carries the same markup a room card does. htTotalWithGstHtml returns "" only
  // for an unquotable amount, in which case the wording below still stands.
  var totalLine = "";
  if (htCardShowsTotalWithGst())
   totalLine = htTotalWithGstHtml(cardTotal.total, totalNote);
  // What the party surcharge is made of. Read from the same pool and the same
  // HT_CFG the total above was built from, so this line is a breakdown of the
  // figure beside it rather than a second, independently counted claim - and in
  // mode 3 the two add up to exactly the total shown.
  var hcfg = window[my1uzr.worknOnPg]?.clientConfig?.HT_CFG || {};
  var fees = [];
  if (cardTotal.pool.extraAdultUnits)
   fees.push(cardTotal.pool.extraAdultUnits + " extra guest \u00d7 " + fmtMoney(hcfg.extraAdultsCharge));
  if (cardTotal.pool.paidChildUnits)
   fees.push(cardTotal.pool.paidChildUnits + " child \u00d7 " + fmtMoney(hcfg.paidChildCharge));
  if (!totalLine)
   totalLine = dated
    ? "Total <b>" +
      fmtMoney(stay.total) +
      "</b> for " +
      stay.nights +
      (stay.nights > 1 ? " nights" : " night") +
      " \u00b7 " +
      fmtMoney(Math.round(stay.total / stay.nights)) +
      " / night avg"
    : "Total <b>" +
      fmtMoney(c.totalPerNight) +
      "</b> / night";
  // The "excl. GST" footnote only makes sense while the GST is not written out.
  // Mode 3 names the amount next to the total, so repeating it would contradict
  // the line it sits on.
  var gstFootnote = htCardShowsTotalWithGst() ? "" : " \u00b7 excl. GST";
  var foot =
   '<div class="ht-combo-foot">' +
   '<span class="csum">' +
   totalLine +
   gstFootnote +
   "</span>" +
   (fees.length
     ? '<span class="ht-combo-note' + (cardTotal.pool.extraAdultUnits ? " warn" : "") + '"><i class="fa-solid fa-coins"></i> ' + fees.join(" \u00b7 ") + "</span>"
    : "") +
   '<button class="ht-btn ht-btn-ember" onclick="bookComboNow(\'' +
   c.key +
   '\')">Book this combination</button>' +
   "</div>";
  return '<article class="ht-combo-card">' + head + '<div class="ht-combo-rooms">' + rooms + "</div>" + foot + "</article>";
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
  // A combination shows every room of the set, each with its own details, above
  // the same shared summary sheet a single room uses.
  var combo = comboSelection && comboSelection.rooms && comboSelection.rooms.length > 1
   ? comboSelection
   : null;
  var left;
  if (combo) {
   left =
    '<div class="ht-combo-detail-head">' +
    '<i class="fa-solid fa-layer-group"></i> Combination of ' +
    combo.rooms.length +
    " rooms \u00b7 sleeps " +
    htOccupancyPool(combo.rooms, adults, childAges).maxOccupancy +
    " combined</div>";
   combo.rooms.forEach(function (cr, ci) {
    left +=
     '<section class="ht-section ht-room-title" data-combo-room="' + cr.id + '">' +
     "<h2>" +
     escHtml(cr.e) + " - " + escHtml(cr.name) +
     "</h2>" +
     '<p class="tagline">' + escHtml(cr.tagline) + "</p>" +
     galleryHtml(cr, "combo-" + ci) +
     aboutHtml(cr);
    if (!bpColHidden("flt")) left += facilitiesHtml(cr);
    if (!bpColHidden("ia")) left += amenitiesHtml(cr);
    left += "</section>";
   });
   if (!bpColHidden("cyp")) left += packagesSectionHtml(r);
   if (!bpColHidden("aos")) left += addonsSectionHtml();
   left += policiesSectionHtml();
  } else {
   left =
    galleryHtml(r, "main") +
    aboutHtml(r);
   if (!bpColHidden("flt")) left += facilitiesHtml(r);
   if (!bpColHidden("ia")) left += amenitiesHtml(r);
   if (!bpColHidden("cyp")) left += packagesSectionHtml(r);
   if (!bpColHidden("aos")) left += addonsSectionHtml();
   left += policiesSectionHtml();
  }
  var body =
   '<div class="container py-3 pb-5">' +
   '<button class="ht-back" onclick="showHome()"><i class="fa-solid fa-arrow-left"></i> All Rooms</button>' +
   '<div class="row g-4">' +
   '<div class="col-xl-8 col-lg-7">' +
   left +
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
  el("paySheet") &&
  typeof ensureBeCheckinField === "function"
 ) {
  ensureBeCheckinField().catch(function (e) {
   console.warn("ensureBeCheckinField failed:", e);
  });
 }
}

// uid scopes the hero/thumb ids so a view holding several galleries (a room
// combination) does not have them collide.
function galleryHtml(r, uid) {
  uid = uid || r.id;
  return (
  '<div class="ht-gallery" data-room="' +
  r.id +
  '">' +
  '<div class="hero"><img id="gHero_' +
  uid +
  '" src="' +
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
     ",'" +
     uid +
     '\')">'
    );
   })
   .join("") +
  "</div></div>"
 );
}

function aboutHtml(r) {
  var policy = htRoomOccupancyPolicy(r);
  return (
  '<section class="ht-section ht-room-title">' +
  "<h2>" +
  escHtml(r.e) + " - " + escHtml(r.name) +
  "</h2>" +
  '<p class="tagline">' +
  escHtml(r.tagline) +
  "</p>" +
  '<div class="ht-badges mb-3">' +
   badgeHtml("fa-user-group", policy.capacity + " included") +
   badgeHtml("fa-people-group", "Sleeps up to " + policy.maxOccupancy) +
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
  comboSelection = null;
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
   var lim = roomGuestLimits(r);
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
  comboSelection = null;
  switchView("details");
}

/* ---------- Combination selection ---------- */
// The rooms currently chosen for booking: one room for a normal booking, the
// whole set for a combination. Everything downstream reads this.
function selectedComboRooms() {
  if (comboSelection && comboSelection.rooms && comboSelection.rooms.length) {
    return comboSelection.rooms;
  }
  var r = getRoom();
  return r ? [r] : [];
}

function currentComboKey() {
  if (!comboSelection || !comboSelection.rooms || comboSelection.rooms.length < 2) return "";
  return publicComboKey(comboSelection.rooms.map(function (r) { return r.id; }));
}

function setComboSelection(combo) {
  if (!combo || !combo.rooms || !combo.rooms.length) {
    comboSelection = null;
    return;
  }
  comboSelection = {
    key: combo.key || publicComboKey(combo.rooms.map(function (r) { return r.id; })),
    rooms: combo.rooms.slice(),
  };
  // The details view and the summary are both written against one room, so
  // point them at the first of the set.
  roomId = combo.rooms[0].id;
  chargeWithAc = false;
  heroIdx = 0;
  addonIds = [];
  var pkgs = roomPackages(combo.rooms[0]);
  packageId = pkgs.length ? pkgs[0].id : null;
  if (typeof setCounts === "function") setCounts();
  if (typeof renderChildStrip === "function") renderChildStrip();
}

// Each gallery carries its own room id, so the hero swap works per-gallery and a
// view showing several rooms at once behaves correctly.
function setHero(i, uid) {
  var hero = el("gHero_" + (uid || "main"));
  if (!hero) return;
  var gallery = hero.closest(".ht-gallery");
  var owner = null;
  if (gallery && gallery.getAttribute("data-room") != null) {
   owner = getRoomById(gallery.getAttribute("data-room"));
  }
  if (!owner) {
   var r = getRoom();
   if (!r) return;
   owner = r;
  } else if (uid === "main") {
   heroIdx = i;
  }
  if (!owner.images[i]) return;
  hero.src = owner.images[i];
  var thumbs = gallery ? gallery.querySelectorAll(".thumbs img") : [];
  thumbs.forEach(function (t, j) {
   t.classList.toggle("active", j === i);
  });
}

/* ============================================================
   PART 6 - ADMIN PANEL (merged from core/admin.js)
   ============================================================ */

// ============================================================
// ADMIN PANEL - merged from core/admin.js into core/rm.js
// ------------------------------------------------------------
// Admin panel lives inside the SAME index.html as the user
// site. Now inlined in rm.js (no longer lazy-loaded via
// loadExe2Fn(40)). Renders a full-screen #adminPage layer
// over the user UI; closeAdminPage() removes it and refreshes
// the site.
//
// Renames (top-level clashes with core/rm.js user site):
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
    // j is the room reference, a single id string - one room per row.
    j: bk.e != null ? bk.e : 0,
   m: daysBetweenStr(e, f),
   n: typeof bk.m === "number" ? bk.m : parseFloat(bk.m) || 0,
   disc: bk.n != null ? Number(bk.n) || 0 : 0,
   o: bk.o != null ? bk.o : 0,
   oc: bk.o != null ? bk.o : 0,
   k: bk.k != null ? bk.k : null,
   l: bk.l != null ? bk.l : null,
  };
  if (Array.isArray(row.j)) {
    row.j = typeof adRoomId === "function" ? adRoomId(row.j) : row.j[0];
  }
  row.jPrimary = row.j;
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
   var bId = receiptBookingId(pr);
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
.ht-avail-badge.ok { background: #EAF7EC; color: #1e7e34; border: 1px solid #BFE3D2; }
.ht-avail-badge.no { background: #FDECEA; color: #c0392b; border: 1px solid #f5c6c2; }

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
/* Greenish tinge marks a room that is free for the selected dates. */
.ht-option-card.is-avail {
  border-color: #BFE3D2;
  background: #F6FCF7;
}
.ht-option-card.is-avail:hover {
  border-color: #28a745;
  background: #EAF7EC;
}
.ht-option-card.is-avail.selected {
  border-color: #1e7e34;
  background: #EAF7EC;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.18);
}
/* A room that cannot take the whole party, even though the dates are free. */
.ht-option-card.is-undersized {
  border-color: #E8D9B8;
  background: #FBF7EE;
}
.ht-option-card.is-undersized .opt-title,
.ht-option-card.is-undersized .opt-sub,
.ht-option-card.is-undersized .opt-price { color: #8a8072; }
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
  } catch (e) { }
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
   } catch (e) { }
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
   var policy = htRoomOccupancyPolicy(r);
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
     '<span><i class="fas fa-user"></i>Included: ' +
     policy.capacity +
     "</span>" +
     "<span>Sleeps up to: " +
     policy.maxOccupancy +
     "</span>" +
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