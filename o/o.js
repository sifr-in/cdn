const tblsRequired = ["f", "fp", "p", "s", "c", "o", "os", "od", "fn100"];
const moduLst = [
 { "a": ",82,72,86,", "b": "Manage Products", "c": "fa-plus-circle", "d": "mn_prods", "e": "#198754" },
 { "a": ",81,", "b": "Manage Orders", "c": "fa-percent", "d": "mn_or", "e": "#dc3545" },
 { "a": ",85,", "b": "Manage Categorys", "c": "fa-star", "d": "mn_ct", "e": "#ffc107" },
 { "a": ",82,97,95,", "b": "Manage Permistions", "c": "fa-user-shield", "d": "fav1", "e": "#0d6efd" },
 { "a": ",-0,", "b": "Manage Driver", "c": "fa-truck", "d": "driver_panel", "e": "#fd7e14" },
 { "a": ",-100,", "b": "Driver Upload Img", "c": "fa-truck-loading", "d": "showDrvBilingPanel", "e": "#17a2b8" },
 { "a": ",100,", "b": "Driver Orders", "c": "fa-truck-loading", "d": "showMyDrvPanel", "e": "#17a2b8" },
 { "a": ",84,88,78,77,", "b": "Recent Orders", "c": "fa-clock", "d": "recent", "e": "#0dcaf0" }
];
moduLst.hook = "onModuLstAllowed";
window[my1uzr.worknOnPg].moduLst = moduLst;
const inTbls = ["dontCret:", "pubilc:77,78,84", "2/0i-72~p,s,c", "3/0a-77~o,os", "4/0a-78~p,s", "2/0j-79~c", "2/0j-80~c", , "2/0j-81~c,o,os", "2/0k-82~s", "2/0k-83~p", "3/0b-84~o,os", "2/0l-86~s,p", "2/0l-88~os,od", "2/0o-100~p,od", "2/0t-104~", "4/0a-118~"];//104 for .da
const cust_const = [
 {
  "100": [{ "a": "driverimageupload", "b": 1, "c": "more customiztaion", "d": "if value is 1 driver will be able to take photo of delivary and upload", "u": "url-explaining-video" }]
 },
 {
  "118": [{ "a": "getDirectIdFromServer", "b": 1, "c": "", "d": "At my1img: if here have 1 then be use function to get ids directly and if 0/undefined then keep get and pass image url-data form cors64", "u": "url-explaining-video" }]
 }
];
window[my1uzr.worknOnPg].onModuLstAllowed = function (allowedModules) {
 window[my1uzr.worknOnPg].allowedModulesMenuItems = allowedModules || [];
 const menuItems = allowedModules.map(m => ({ icon: m.c, label: m.b, action: m.d, color: m.e }));
 window[my1uzr.worknOnPg].adminMenuItems = menuItems;
 if (!Array.isArray(window.burgerMenuItems)) window.burgerMenuItems = [];
 const actions = new Set(menuItems.map(i => i.action));
 window.burgerMenuItems = window.burgerMenuItems.filter(i => !actions.has(i.action));
 window.burgerMenuItems.push(...menuItems);
 if (typeof createBurgerMenuElements === 'function') createBurgerMenuElements();
};

const sho_da_tkLimit = 1;
const ids_of_views = [3];
const dontShoLoginConfirmation = 1;
const dontRestartAfterLogin = 1;
(async function () {
 const CSH_PUSH = [
  { a: 16, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/menu.js", c: "openBurgerMenu,closeBurgerMenu,createBurgerMenuElements", r: "createBurgerMenuElements" },
  { a: 17, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/ed_prod.js", c: "showProductList", r: "showProductList" },
  { a: 20, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1d6dac3/o/show_prods.js", c: "showProductsByCategory", r: "showProductsByCategory" },
  { a: 23, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/o_r.js", c: "handl_o_rspons", r: "handl_o_rspons" },
  { a: 24, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/cart.js", c: "initCartIcon,addToCart,openCartModal", r: "initCartIcon" },
  { a: 25, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/or_hst.js", c: "howOrderHistoryModal", r: "howOrderHistoryModal" },
  { a: 26, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/mn_or.js", c: "showManageOrders", r: "showManageOrders" },
  { a: 27, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/up_prod.js", c: "showUpdateProduct", r: "showUpdateProduct" },
  { a: 28, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/mn_ct.js", c: "showManageCategories", r: "showManageCategories" },
  { a: 29, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/mn_drvr.js", c: "showDriverPanel", r: "showDriverPanel" },
  { a: 32, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/my_drvr.js", c: "showMyDrvPanel", r: "showMyDrvPanel" },
  { a: 37, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@9a0cf3a/o/drvr_upld_img.js", c: "showDrvBilingPanel", r: "showDrvBilingPanel" },
  { a: 30, u: "https://code.jquery.com/jquery-3.6.0.min.js" },
  { a: 31, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/mr/andro.js" },
  { a: 32, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/mr/noti.js", c: "showNotifications", r: "showNotifications" },
  { a: 33, u: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css" },
  { a: 34, u: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" },
  { a: 35, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/mr/drvphp.js", c: "upld2drv", r: "upld2drv" }
 ];

 const cshIds = {};
 if (typeof pushCsh === 'function') {
  for (let i = 0; i < CSH_PUSH.length; i++) {
   const it = CSH_PUSH[i];
   cshIds[it.r || it.c || it.u] = pushCsh(it.u, it.c, it.r, it.a);
  }
 }

 window[my1uzr.worknOnPg].appInfo = {
  "business": "Star Milk Shop",
  "owner": "Godase",
  "city": "kolhapur",
  "tagline": "Aapke Saath, Behtar Saath ke liye",
  "mail": "sifr.matrimony@gmail.com",
  "mob": "+91 9960706060",
  "logo": "https://iili.io/n22ERrx.md.png"
 };
 window[my1uzr.worknOnPg].showHstfrmMO = null;

 window[my1uzr.worknOnPg].prodDispMaxWidth = 1080;
 window[my1uzr.worknOnPg].prodDispMaxSize = 512;//kb
 window[my1uzr.worknOnPg].prodThmpMaxWidth = 300;
 window[my1uzr.worknOnPg].prodThmpMaxSize = 32;//kb
 window[my1uzr.worknOnPg].mesd_pkgSLCHide = [1, 1]; //[1(mesured-in),1(pakage-size)both hide and [0,0] both show

 // Ensure UNIT_DATA is available
 if (typeof window.UNIT_DATA === 'undefined' || !window.UNIT_DATA || window.UNIT_DATA.length === 0) {
  window.UNIT_DATA = [
   { "a": "32", "e": "adult", "f": "adl" }, { "a": "28", "e": "bags", "f": "bag" }, { "a": "22", "e": "box", "f": "box" },
   { "a": "27", "e": "brass", "f": "brass" }, { "a": "5", "e": "centimeter", "f": "cm" }, { "a": "33", "e": "child", "f": "chi" },
   { "a": "23", "e": "cubic feet", "f": "cft" }, { "a": "13", "e": "cubic meter", "f": "cum" }, { "a": "19", "e": "days", "f": "day" },
   { "a": "10", "e": "dozen", "f": "dz" }, { "a": "2", "e": "foot", "f": "ft" }, { "a": "35", "e": "full ticket", "f": "ftk" },
   { "a": "4", "e": "gram", "f": "gm" }, { "a": "36", "e": "half ticket", "f": "htk" }, { "a": "18", "e": "hours", "f": "hr" },
   { "a": "3", "e": "kilogram", "f": "kg" }, { "a": "8", "e": "kilometer", "f": "km" }, { "a": "1", "e": "liter", "f": "ltr" },
   { "a": "6", "e": "meter", "f": "m" }, { "a": "26", "e": "metric tonne", "f": "mt" }, { "a": "7", "e": "milligram", "f": "mg" },
   { "a": "9", "e": "millilitre", "f": "ml" }, { "a": "37", "e": "millimeter", "f": "mm" }, { "a": "17", "e": "minutes", "f": "min" },
   { "a": "20", "e": "month", "f": "month" }, { "a": "29", "e": "numbers", "f": "no" }, { "a": "11", "e": "pieces", "f": "pcs" },
   { "a": "31", "e": "plate", "f": "pl" }, { "a": "25", "e": "running foot", "f": "rft" }, { "a": "15", "e": "running meter", "f": "rmt" },
   { "a": "16", "e": "seconds", "f": "sec" }, { "a": "12", "e": "service", "f": "srv" }, { "a": "34", "e": "special ticket", "f": "stk" },
   { "a": "24", "e": "square feet", "f": "sqft" }, { "a": "14", "e": "square meter", "f": "sqm" }, { "a": "30", "e": "units", "f": "ut" },
   { "a": "21", "e": "year", "f": "year" }
  ];
 }

 window.UNIT_MAP = {};
 window.UNIT_DATA.forEach(function (unit) { window.UNIT_MAP[unit.a] = unit; });

 window.escapeHTML = function (str) {
  if (str == null) return '';
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
 };

 // Navigation stack for fullpage views
 if (!window._fpNavStack) window._fpNavStack = [];

 // Close all fullpage views and go home
 window._fpGoHome = function () {
  window._fpNavStack.forEach(function (id) {
   var el = document.getElementById(id);
   if (el) { el.dispatchEvent(new Event('fp-close')); el.remove(); }
  });
  window._fpNavStack = [];
  var mainBody = document.getElementById('main_body');
  if (mainBody) mainBody.style.display = '';
  document.body.style.overflow = '';
  document.querySelectorAll('.modal-backdrop').forEach(function (b) { b.remove(); });
  document.body.classList.remove('modal-open');
  document.body.style.paddingRight = '';
  var s = document.getElementById('fpModalZOverride');
  if (s) s.remove();
  if (typeof restoreHomeView === 'function') restoreHomeView();
 };

 // Full page view utility - returns same interface as create_modal_dynamically
 window.create_fullpage_view = function (containerId) {
  const mainBody = document.getElementById('main_body');

  // Inject modal z-index override once
  if (!document.getElementById('fpModalZOverride')) {
   const s = document.createElement('style');
   s.id = 'fpModalZOverride';
   s.textContent = '.modal{z-index:10002!important}.modal-backdrop{z-index:10001!important}';
   document.head.appendChild(s);
  }

  if (!document.getElementById('fpDesktopStyle')) {
   const sd = document.createElement('style');
   sd.id = 'fpDesktopStyle';
   sd.textContent = [
    '@media (min-width:992px){',
    '[id$="_header"],[id$="_content"]{width:90%;max-width:1400px;margin-left:auto;margin-right:auto}',
    '[id$="_header"]{left:0;right:0;}',
    '[id$="_content"]{margin-top:8px}',
    '}'
   ].join('');
   document.head.appendChild(sd);
  }

  if (!document.getElementById('fpResponsiveStyle')) {
   const sr = document.createElement('style');
   sr.id = 'fpResponsiveStyle';
   sr.textContent = [
    '@media (max-width:480px){',
    '[id$="_header"]{padding:0 10px!important}',
    '[id$="_content"]{margin-left:0!important;margin-right:0!important}',
    '[id$="_content"] .modal-body{margin-left:0!important}',
    '}'
   ].join('');
   document.head.appendChild(sr);
  }

  // Container
  const container = document.createElement('div');
  container.id = containerId;
  container.setAttribute('role', 'dialog');
  container.style.cssText = [
   'position:fixed;top:0;left:0;right:0;bottom:0',
   'background:#EAF6FF',
   'z-index:10000',
   'overflow-y:auto',
   'display:block',
   'font-family:"Segoe UI",Roboto,Arial,sans-serif'
  ].join(';');

  // Header bar with back arrow + close button
  const header = document.createElement('div');
  header.id = containerId + '_header';
  header.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:10001;background:#005F73;height:50px;width:auto;display:flex;align-items:center;padding:0 45px;box-shadow:0 3px 8px rgba(0,0,0,0.3);';
  header.innerHTML =
   '<i class="fas fa-arrow-left" style="font-size:20px;cursor:pointer;color:white;" data-fp-back="1"></i>' +
   '<span style="color:white;font-size:16px;margin-left:15px;font-weight:500;flex:1;" id="' + containerId + '_title"></span>' +
   '<i class="fas fa-times" style="font-size:20px;cursor:pointer;color:white;" data-fp-close="1"></i>';
  container.appendChild(header);

  // Content wrapper
  const content = document.createElement('div');
  content.id = containerId + '_content';
  content.style.cssText = 'border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.15);border:none;background:#fff;min-height:calc(100vh - 58px);margin:4px 4px;padding-top:52px;overflow:auto;margin-left:5%;';

  const body = document.createElement('div');
  body.className = 'modal-body';
  body.style.cssText = 'padding:8px 10px;min-height:200px;';

  content.appendChild(body);
  container.appendChild(content);
  document.documentElement.appendChild(container);

  // Click handlers for back and close
  container.addEventListener('click', function (e) {
   if (e.target.closest('[data-fp-back="1"]')) {
    // Back: go to previous view or home
    backFn();
   } else if (e.target.closest('[data-fp-close="1"]')) {
    // Close (X): go all the way home
    window._fpGoHome();
   }
  });

  function backFn() {
   // Pop current from stack
   var idx = window._fpNavStack.indexOf(containerId);
   if (idx >= 0) window._fpNavStack.splice(idx, 1);
   container.dispatchEvent(new Event('fp-close'));
   container.remove();

   // If there's a previous view, show it
   if (window._fpNavStack.length > 0) {
    var prevId = window._fpNavStack[window._fpNavStack.length - 1];
    var prevEl = document.getElementById(prevId);
    if (prevEl) prevEl.style.display = 'block';
   } else {
    // No previous view — go home
    if (mainBody) mainBody.style.display = '';
    document.body.style.overflow = '';
    document.querySelectorAll('.modal-backdrop').forEach(function (b) { b.remove(); });
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    var s = document.getElementById('fpModalZOverride');
    if (s) s.remove();
    if (typeof restoreHomeView === 'function') restoreHomeView();
   }
  }

  return {
   contentElement: body,
   modalElement: container,
   modalInstance: {
    show: function () {
     // Hide the previous view if any
     if (window._fpNavStack.length > 0) {
      var prevId = window._fpNavStack[window._fpNavStack.length - 1];
      var prevEl = document.getElementById(prevId);
      if (prevEl) prevEl.style.display = 'none';
     }
     window._fpNavStack.push(containerId);
     container.style.display = 'block';
     document.body.style.overflow = 'hidden';
    },
    hide: function () {
     backFn();
    },
    dispose: function () {
     backFn();
    }
   }
  };
 };


 // Close order history modal
 window.closeOrderHistoryModal = function (modalId, modalInstance) {
  // Get the Bootstrap modal instance if not passed
  if (!modalInstance) {
   const modalEl = document.getElementById(modalId);
   if (modalEl) {
    modalInstance = bootstrap.Modal.getInstance(modalEl);
   }
  }

  if (modalInstance) {
   modalInstance.hide();
  }

  // Remove modal after hidden
  const modal = document.getElementById(modalId);
  if (modal) {
   modal.addEventListener('hidden.bs.modal', function () {
    if (modalInstance) modalInstance.dispose();
    modal.remove();
   }, { once: true });
  }
 };

 window.showOrderHistoryForCustomer = async function (customerId) {
  window[my1uzr.worknOnPg].showHstfrmMO = customerId;
  // Store customer ID in a global variable so or_hst.js can access it
  window._selectedOrderCustomerId = customerId;

  // Load and show or_hst.js which will use the customerId
  try {
   await loadExe2Fn(25, [], [1]);
  } catch (error) {
   window.showelsemodal(error || "404/500");
  }
 };


 var PLACEHOLDER_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e9ecef"/><text x="50" y="55" text-anchor="middle" font-size="40" fill="#adb5bd">?</text></svg>');
 window.PLACEHOLDER_IMG = PLACEHOLDER_IMG;

 try {
  let result1;
  if (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].usdInAndroWv === 1)
   result1 = await loadCshScriptsSequentially(20, 23, 30);
  else
   result1 = await loadCshScriptsSequentially(20, 23, 30, 31);

  if (!result1.success) {
   throw new Error('Failed to load required scripts: ' + result1.error);
  } else {
   fetch('o.da').then(function (r) { return r.json(); }).then(function (d) {
    if (d && typeof d === 'object' && !Array.isArray(d)) {
     window[my1uzr.worknOnPg].clientConfig = d;
     window[my1uzr.worknOnPg].categorys = Array.isArray(d.cata) ? d.cata : [];
     rerenderCategoriesWhenDomReady();
    } else {
     window[my1uzr.worknOnPg].clientConfig = {};
     window[my1uzr.worknOnPg].categorys = [];
    }
   }).catch(function (e) {
    window[my1uzr.worknOnPg].clientConfig = {};
    window[my1uzr.worknOnPg].categorys = [];
    console.warn('Could not load o.da, using defaults:', e);
   });
   fetch('0.da').then(function (r) { return r.json(); }).then(function (d) {
    if (d && typeof d === 'object' && !Array.isArray(d)) {
     window[my1uzr.worknOnPg].clientConfigByAdm = d;
     window.driverimageupload = d?.cust_da_const?.driverimageupload;
    } else {
     window[my1uzr.worknOnPg].clientConfigByAdm = {};
     window.driverimageupload = undefined;
    }
   }).catch(function (e) {
    window[my1uzr.worknOnPg].clientConfigByAdm = {};
    window.driverimageupload = undefined;
    console.warn('Could not load 0.da, using defaults:', e);
   });
   const createResult = await dbDexieManager.handleNwTables("loader", dbnm, tblsRequired);
   tblFailureCount = createResult.failureCount;

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

   // INJECT styles + build HTML while data loads (pure sync, no data needed)
   // ==================== ALL STYLES ====================
   const st = document.createElement("style");
   st.innerHTML = appcss;
   document.head.appendChild(st);

   const shopNameFromAppInfo = window[my1uzr.worknOnPg].appInfo.business;
   const shopAppLogo = window[my1uzr.worknOnPg].appInfo.logo;
   const mainBody = document.getElementById("main_body");
   mainBody.innerHTML = `
                <div class="topnav">
                    <div id="burgerBtn"><i class="fas fa-bars bbm"></i></div>
                    <div class="shopname">
                        <img class="shopname-logo" src="${shopAppLogo}" alt="Star Milk Shop">
                        <span class="shopname-text">${shopNameFromAppInfo}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div id="searchBtn"><i class="fas fa-search bbs"></i></div>
                        <div id="cartContainer"></div>
                    </div>
                </div>
                <div class="search-bar-wrap" id="searchBarWrap">
                    <input type="text" id="searchInput" placeholder="Search products by name..." autocomplete="off">
                    <button class="btn-close-search" id="btnCloseSearch"><i class="fas fa-times"></i></button>
                </div>
                <div class="search-results-dropdown" id="searchResultsDropdown"></div>
                <div id="catStripDesktop" class="cat-strip-desktop"></div>
                <div class="mobile-layout" id="mobileLayout">
                    <div class="mobile-sidebar" id="mobileSidebar"></div>
                    <div class="mobile-products" id="prdContentMobile"><div class="loader-container"><div class="loader"></div></div></div>
                </div>
                <div id="prdContentDesktop"><div class="loader-container"><div class="loader"></div></div></div>
            `;

   // FIRE prod_cata + prod_stock IN PARALLEL (IndexedDB already created above)
   const [pc, ps] = await Promise.all([
    dbDexieManager.getAllRecords(dbnm, 'p'),
    dbDexieManager.getAllRecords(dbnm, 's')
   ]);
   window.prod_cata = pc;
   window.prod_stock = ps;
   //if (createResult?.results.length !== 0 && window.prod_stock.length == 0) { localStorage.setItem('isLoadedIn', 'false'); }

   if (typeof refreshProductsCache === 'function') {
    await refreshProductsCache(window.prod_cata, window.prod_stock);
   }

   updateLayoutVisibility();
   window.addEventListener('resize', updateLayoutVisibility);
   setupSearch();
   setupBurgerMenu();

   window.withRefreshAnimation = async function (btn, callback) {
    var icon = btn.querySelector('i');
    if (icon) icon.classList.add('opencode-refresh-spin');
    btn.disabled = true;
    try {
     await callback();
    } finally {
     if (icon) icon.classList.remove('opencode-refresh-spin');
     btn.disabled = false;
    }
   };

   const isLoadedIn = localStorage.getItem('isLoadedIn');


   // Mark as already loaded BEFORE calling API
   localStorage.setItem('isLoadedIn', 'true');

   if (typeof payload0 !== 'undefined') {
    payload0.vw = 1;
    payload0.fn = 78;
    payload0.ul = '4/0a.php';
    payload0.gt = 4;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
     { tb: 'p', col: 'b', cl: 'b' },
     { tb: 's', col: 'b', cl: 'b' }
    ]);

    try {
     const response = await fnj4(null, payload0, 0, 1, null, 20000, 2, 1);
     // const response = await fnj3(
     //  "https://my1.in/4/a.php",
     //  payload0,
     //  0,
     //  true,
     //  null,
     //  20000,
     //  0,
     //  2,
     //  1
     // );

     if (response && response.su == 1) {
      await handl_o_rspons(response, 1);
      // Re-read fresh data from IndexedDB after API saved new records
      window.prod_cata = await dbDexieManager.getAllRecords(dbnm, 'p');
      window.prod_stock = await dbDexieManager.getAllRecords(dbnm, 's');
      if (typeof refreshProductsCache === 'function') {
       await refreshProductsCache(window.prod_cata, window.prod_stock);
      }
      // Only reload on FIRST load, not subsequent loads
      if (isLoadedIn !== 'true') {
       localStorage.setItem('isLoadedIn', 'true');
       //setTimeout(() => location.reload(), 300);
      }
     } else {
      // Allow retry if API failed
      localStorage.setItem('isLoadedIn', 'false');
      window.showelsemodal(response?.ms || 'Not allow to use. Please try again.');
     }

    } catch (apiErr) {
     // Allow retry if network error
     localStorage.setItem('isLoadedIn', 'false');
     window.showelsemodal(apiErr || '404');
    }
   }

  }
  // Load show_prods.js first, then cart.js
  await loadCshScriptsSequentially(20, 24);
  renderCategoryStrip();

  if (my1uzr && my1uzr.mk && my1uzr.mk.length >= 1 && localStorage.getItem(my1uzr.worknOnPg)) {
   window.suppressModals = true;
   try {
    const am = await chkModuLstAgainstFNF(moduLst);
    if (am && am.length > 0) {
     const hookName = am.hook || "onModuLstAllowed";
     if (typeof window[my1uzr.worknOnPg][hookName] === 'function') {
      window[my1uzr.worknOnPg][hookName](am);
     }
    }
   } catch (e) { console.error(e); }
   finally { window.suppressModals = false; }
  }
 } catch (e) {
  console.error(e);
  document.getElementById("main_body").innerHTML = `<div class="alert alert-danger m-3">${e.message || e}</div>`;
 }
 window.closeOrderHistoryModal = window.closeOrderHistoryModal;
 window.showelsemodal = window.showelsemodal;
 window.showelsemodal = window.showelsemodal;
 window.showOrderHistoryForCustomer = window.showOrderHistoryForCustomer;
 window.queuedImageLoad = queuedImageLoad;
 window.queuedPreload = queuedPreload;
})();

var driveThmW = 300;
function getGoogleDriveImageUrl(value, thumbnail) {
 if (!value) return '';
 value = String(value).trim();
 var parts = value.split(/\s+/);
 if (parts.length >= 1 && /^[A-Za-z0-9_-]{20,}$/.test(parts[0])) {
  var fileId = thumbnail && parts[1] ? parts[1] : parts[0];
  var w = thumbnail ? 200 : (window.driveThmW || 300);
  return 'https://lh3.googleusercontent.com/d/' + fileId + '=w' + w + '?authuser=0';
 }
 if (/^https?:\/\//i.test(value)) return value;
 return '';
}

var _blobCache = {};
var _displayedSession = {};
var _gdrvCacheName = 'gdrive-imgs';
var _gdrvCache = null;
var _prioQueue = [];
var _bgQueue = [];
var _prioActive = 0;
var _bgActive = 0;
var _PRIO_MAX = 3;
var _BG_MAX = 1;
var _bgStaggerMs = 300;
var _imgObserver = null;
var _bgPending = {};
var _bgFetching = {};
var _displayInFlight = {};
var _consecFails = 0;
var _bgPauseUntil = 0;
if (!document.querySelector('link[href*="lh3.googleusercontent.com"][rel="preconnect"]')) {
 var _preconnect = document.createElement('link');
 _preconnect.rel = 'preconnect';
 _preconnect.href = 'https://lh3.googleusercontent.com';
 document.head.appendChild(_preconnect);
}
function _isGoogleDriveUrl(url) {
 return url && url.indexOf('lh3.googleusercontent.com') !== -1;
}

function _getGdrvCache() {
 if (_gdrvCache) return _gdrvCache;
 if (typeof caches === 'undefined') return null;
 _gdrvCache = caches.open(_gdrvCacheName).catch(function () { return null; });
 return _gdrvCache;
}

function _revokeObjUrl(objUrl) {
 if (objUrl && objUrl.indexOf('blob:') === 0) {
  try { URL.revokeObjectURL(objUrl); } catch (e) { }
 }
}

function _makeObjUrl(blob) {
 try { return URL.createObjectURL(blob); } catch (e) { return ''; }
}

function _loadFromCache(url) {
 return Promise.resolve(_getGdrvCache()).then(function (cache) {
  if (!cache) return null;
  return cache.match(url).then(function (hit) {
   if (hit) return hit.blob();
   return null;
  });
 });
}

function _warmImgCache(url) {
 return new Promise(function (resolve) {
  if (typeof caches === 'undefined') { resolve(false); return; }
  if (_blobCache[url] || _bgFetching[url] || _displayInFlight[url] || _displayedSession[url]) { resolve(true); return; }
  _bgFetching[url] = true;
  _getGdrvCache().then(function (cache) {
   if (!cache) { delete _bgFetching[url]; resolve(false); return; }
   cache.match(url).then(function (hit) {
    if (hit) {
     hit.blob().then(function (blob) {
      delete _bgFetching[url];
      if (blob) {
       var objUrl = _makeObjUrl(blob);
       if (objUrl) { _blobCache[url] = objUrl; }
       resolve(true);
      } else {
       resolve(false);
      }
     }).catch(function () { delete _bgFetching[url]; resolve(false); });
     return;
    }
    fetch(url, { mode: 'cors' }).then(function (resp) {
     delete _bgFetching[url];
     if (!resp || !resp.ok) {
      if (resp && resp.status === 429) { _consecFails += 2; }
      resolve(false);
      return;
     }
     _consecFails = 0;
     var clone = resp.clone();
     cache.put(url, resp).then(function () {
      return clone.blob();
     }).then(function (blob) {
      if (blob) {
       var objUrl = _makeObjUrl(blob);
       if (objUrl) { _blobCache[url] = objUrl; }
      }
      resolve(true);
     }).catch(function () { resolve(false); });
    }).catch(function () {
     delete _bgFetching[url];
     _consecFails++;
     resolve(false);
    });
   }).catch(function () { delete _bgFetching[url]; resolve(false); });
  }).catch(function () { delete _bgFetching[url]; resolve(false); });
 });
}

function _deferBg(fn) {
 if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(fn, { timeout: 1000 });
 } else {
  setTimeout(fn, _bgStaggerMs);
 }
}

function _getImgObserver() {
 if (_imgObserver) return _imgObserver;
 if (typeof IntersectionObserver !== 'function') return null;
 _imgObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
   var img = entry.target;
   if (!entry.isIntersecting) return;
   if (!img || !img.dataset || !img.dataset.__lazyUrl) return;
   _imgObserver.unobserve(img);
   var lazyUrl = img.dataset.__lazyUrl;
   delete img.dataset.__lazyUrl;
   _prioQueue.push({ el: img, url: lazyUrl });
   _processPrioQueue();
  });
 }, { rootMargin: '0px', threshold: 0 });
 return _imgObserver;
}

function queuedImageLoad(imgEl, url) {
 if (!url) { if (imgEl) imgEl.src = window.PLACEHOLDER_IMG || ''; return; }
 if (!_isGoogleDriveUrl(url)) { if (imgEl) imgEl.src = url; return; }
 var observer = _getImgObserver();
 if (observer && imgEl && imgEl.dataset) {
  if (imgEl.dataset.src) delete imgEl.dataset.src;
  imgEl.dataset.__lazyUrl = url;
  observer.observe(imgEl);
 } else {
  _prioQueue.push({ el: imgEl, url: url });
  _processPrioQueue();
 }
 _scheduleBgWarm(url);
}

function queuedPreload(url) {
 if (!url || !_isGoogleDriveUrl(url)) return;
 _scheduleBgWarm(url);
}

function _scheduleBgWarm(url) {
 if (_blobCache[url] || _bgPending[url] || _displayInFlight[url] || _displayedSession[url]) return;
 _bgPending[url] = true;
 _deferBg(function () {
  _bgPending[url] = false;
  if (_blobCache[url] || _displayInFlight[url] || _bgFetching[url] || _displayedSession[url]) return;
  _bgQueue.push(url);
  _processBgQueue();
 });
}

function _processBgQueue() {
 if (Date.now() < _bgPauseUntil) return;
 while (_bgActive < _BG_MAX && _bgQueue.length > 0) {
  if (_consecFails >= 5) break;
  var url = _bgQueue.shift();
  if (!url) continue;
  if (_blobCache[url] || _displayInFlight[url] || _bgFetching[url] || _displayedSession[url]) continue;
  _bgActive++;
  _warmImgCache(url).then(function () { _bgDone(); });
 }
}

function _bgDone() {
 _bgActive--;
 var delay = _bgStaggerMs;
 if (_consecFails >= 5) {
  delay = Math.min(60000, 5000 * Math.pow(2, _consecFails - 4));
  _bgPauseUntil = Date.now() + delay;
 }
 setTimeout(_processBgQueue, delay);
}

function _prioDone() {
 if (_prioActive > 0) _prioActive--;
 _processPrioQueue();
}

function _processPrioQueue() {
 while (_prioActive < _PRIO_MAX && _prioQueue.length > 0) {
  var item = _prioQueue.shift();
  if (!item) continue;
  _prioActive++;
  _loadPrioImg(item.el, item.url);
 }
}

function _startDisplay(url) {
 if (_displayInFlight[url]) { _displayInFlight[url]++; }
 else { _displayInFlight[url] = 1; }
}

function _endDisplay(url) {
 if (_displayInFlight[url]) {
  _displayInFlight[url]--;
  if (_displayInFlight[url] <= 0) {
   delete _displayInFlight[url];
   _displayedSession[url] = true;
  }
 }
 _prioDone();
}

function _attachImgHandlers(imgEl, url) {
 imgEl.onerror = function () {
  imgEl.onerror = null;
  imgEl.onload = null;
  imgEl.src = window.PLACEHOLDER_IMG || '';
  if (imgEl.dataset) delete imgEl.dataset.src;
  if (imgEl.dataset) delete imgEl.dataset.__lazyUrl;
  _endDisplay(url);
 };
 imgEl.onload = function () {
  imgEl.onload = null;
  imgEl.onerror = null;
  var w = imgEl.naturalWidth || 0;
  var h = imgEl.naturalHeight || 0;
  if (w === 0 || h === 0 || w < 10 || h < 10) {
   imgEl.src = window.PLACEHOLDER_IMG || '';
  }
  if (imgEl.dataset) delete imgEl.dataset.src;
  if (imgEl.dataset) delete imgEl.dataset.__lazyUrl;
  _endDisplay(url);
 };
}

function _serveNative(imgEl, url) {
 if (_blobCache[url]) {
  if (imgEl.isConnected) imgEl.src = _blobCache[url];
  else _endDisplay(url);
  return;
 }
 if (!imgEl.isConnected) { _endDisplay(url); return; }
 if (_bgFetching[url]) {
  setTimeout(function () {
   if (_blobCache[url]) {
    if (imgEl.isConnected) imgEl.src = _blobCache[url];
    _endDisplay(url);
    return;
   }
   if (!imgEl.isConnected) { _endDisplay(url); return; }
   _attachImgHandlers(imgEl, url);
   imgEl.src = url;
  }, 400);
  return;
 }
 _attachImgHandlers(imgEl, url);
 imgEl.src = url;
}

function _loadPrioImg(imgEl, url) {
 if (!imgEl) { _prioDone(); return; }
 if (_blobCache[url]) {
  imgEl.src = _blobCache[url];
  _prioDone();
  return;
 }
 _startDisplay(url);
 _loadFromCache(url).then(function (blob) {
  if (blob) {
   var objUrl = _makeObjUrl(blob);
   if (objUrl) {
    if (!_blobCache[url]) _blobCache[url] = objUrl;
    if (imgEl.isConnected) imgEl.src = objUrl;
    _endDisplay(url);
    return;
   }
  }
  _serveNative(imgEl, url);
 }).catch(function () {
  _serveNative(imgEl, url);
 });
}

// Guards so overlapping render requests (modal close, back, resize, api save)
// cannot leave the product container stuck on its loader.
var _catAutoClickTimer = null;
var _homeRenderSeq = 0;

// Render products through a guard: a stale or failed render can never leave
// prdContentMobile / prdContentDesktop showing only the loader.
function safeShowProducts(categoryId) {
 var token = ++_homeRenderSeq;
 var timeoutId = null;
 var products = window.PRODUCTS || [];
 // show_prods.js reads product.P.a while building cards; some cache rebuilds
 // produce products without that wrapper, which would throw mid-render and
 // leave the loader in place.
 for (var i = 0; i < products.length; i++) {
  if (!products[i] || typeof products[i] !== 'object') continue;
  if (!products[i].P) products[i].P = { a: products[i].f || products[i].category || 0 };
 }
 // Align the layout switches with the viewport before rendering. CDN
 // show_prods.js resolves its container from mobileLayout.style.display; if
 // that disagrees with our innerWidth check it can return early and leave
 // prdContentMobile stuck on its loader after a back.
 var _isMobile = window.innerWidth <= 768;
 var _ml = document.getElementById('mobileLayout');
 if (_ml) _ml.style.display = _isMobile ? 'flex' : 'none';
 var _dpc = document.getElementById('prdContentDesktop');
 if (_dpc) _dpc.style.display = _isMobile ? 'none' : 'block';
 var clearLoader = function (msg) {
  if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
  if (token !== _homeRenderSeq) return;
  var pc = getActivePrdContainer();
  if (pc && pc.querySelector('.loader-container')) {
   pc.innerHTML = '<div class="text-center text-muted p-4">' + msg + '</div>';
  }
 };
 var failed = function (e) {
  console.warn('Product render failed:', e);
  clearLoader('Unable to load products. Please try again.');
 };
 var chain;
 if (typeof showProductsByCategory !== 'function') {
  if (typeof loadExe2Fn !== 'function') {
   clearLoader('Products are not available right now.');
   return Promise.resolve();
  }
  chain = loadExe2Fn(20, [], [1]).then(function () {
   if (typeof showProductsByCategory !== 'function') throw new Error('showProductsByCategory is not available');
   return showProductsByCategory(categoryId);
  });
 } else {
  try {
   chain = Promise.resolve(showProductsByCategory(categoryId));
  } catch (e) {
   failed(e);
   return Promise.resolve();
  }
 }
 // Never let a stalled render leave the loader spinning forever.
 var guard = new Promise(function (resolve) {
  timeoutId = setTimeout(function () { timeoutId = null; resolve(); }, 8000);
 });
 return Promise.race([chain, guard]).then(function () {
  clearLoader('No products to display.');
 }).catch(failed);
}

// Re-render category strip + product list after returning home from any
// fullpage view / modal / back navigation.
function restoreHomeView() {
 try {
  if (typeof updateLayoutVisibility === 'function') updateLayoutVisibility();
  if (typeof renderCategoryStrip === 'function') renderCategoryStrip();
  // Repopulate the active product container directly instead of relying only
  // on renderCategoryStrip's deferred category auto-click. The render guard
  // keeps the newest call authoritative, so the later click is harmless.
  safeShowProducts(window.selectedCategoryId || 'all');
 } catch (e) {
  console.warn('restoreHomeView failed:', e);
 }
}
window.restoreHomeView = restoreHomeView;

function rerenderCategoriesWhenDomReady() {
 if (typeof renderCategoryStrip !== 'function') return;
 if (document.getElementById('catStripDesktop') || document.getElementById('mobileSidebar')) {
  renderCategoryStrip();
  if (typeof updateLayoutVisibility === 'function') updateLayoutVisibility();
 } else {
  setTimeout(rerenderCategoriesWhenDomReady, 100);
 }
}

function getCategoryName(categoryId) {
 if (categoryId === 'all') return 'All Products';
 if (window.prod_cata) {
  var category = window.prod_cata.find(function (c) { return String(c.a) === String(categoryId); });
  if (category) return category.e;
 }
 return 'Category ' + categoryId;
}

function updateLayoutVisibility() {
 const isMobile = window.innerWidth <= 768;

 // Check if we have categories to display
 var allRecords = window.prod_cata || [];
 var configuredCategoryIds = window[my1uzr.worknOnPg]?.categorys || [];
 var categoryRecords = allRecords.filter(function (r) { return Number(r.f) === 0; });
 var productRecords = allRecords.filter(function (r) { return Number(r.f) > 0; });

 var usedCategoryIds = new Set();
 productRecords.forEach(function (product) {
  var categoryId = product.f || (product.P ? product.P.f : null);
  if (categoryId && Number(categoryId) > 0) {
   usedCategoryIds.add(String(categoryId));
  }
 });

 // Check if we have any valid categories to show
 var hasCategories = false;
 if (configuredCategoryIds.length > 0) {
  // If o.da specifies categories, check if any exist or are used
  hasCategories = configuredCategoryIds.some(function (catId) {
   var catIdStr = String(catId);
   var exists = categoryRecords.some(function (r) { return String(r.a) === catIdStr; });
   var isUsed = usedCategoryIds.has(catIdStr);
   return exists || isUsed;
  });
 } else {
  // No o.da config, check if any categories have products
  hasCategories = categoryRecords.some(function (cat) {
   return usedCategoryIds.has(String(cat.a));
  }) || usedCategoryIds.size > 0;
 }

 document.getElementById('mobileLayout').style.display = isMobile ? 'flex' : 'none';

 if (isMobile) {
  document.getElementById('catStripDesktop').style.display = 'none';
  document.getElementById('prdContentDesktop').style.display = 'none';
  if (!hasCategories) {
   document.getElementById('mobileSidebar').style.display = 'none';
  } else {
   document.getElementById('mobileSidebar').style.display = 'flex';
  }
 } else {
  if (hasCategories) {
   document.getElementById('catStripDesktop').style.display = 'flex';
   document.getElementById('prdContentDesktop').style.marginLeft = '95px';
  } else {
   document.getElementById('catStripDesktop').style.display = 'none';
   document.getElementById('prdContentDesktop').style.marginLeft = '0';
  }
  document.getElementById('prdContentDesktop').style.display = 'block';
 }
}

function getActivePrdContainer() {
 return window.innerWidth <= 768 ? document.getElementById('prdContentMobile') : document.getElementById('prdContentDesktop');
}

function showLoadingInPrd() {
 var pc = getActivePrdContainer();
 if (pc) {
  if (window.innerWidth <= 768) {
   // FIXED: For mobile, use grid layout for loader
   pc.innerHTML = '<div class="loader-container" style="grid-column: 1 / -1;"><div class="loader"></div></div>';
  } else {
   pc.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
  }
 }
}

async function renderCategoryStrip() {
 // Cancel any pending auto-click from a previous render so a stale timer
 // cannot re-trigger the loader after we come back from a modal/back.
 if (_catAutoClickTimer) { clearTimeout(_catAutoClickTimer); _catAutoClickTimer = null; }
 var isMobile = window.innerWidth <= 768;
 var desktopStrip = document.getElementById('catStripDesktop');
 var mobileSidebar = document.getElementById('mobileSidebar');

 if (!desktopStrip && !mobileSidebar) {
  console.error('Category containers not found - DOM not ready yet');
  return;
 }

 if (desktopStrip) desktopStrip.innerHTML = '';
 if (mobileSidebar) mobileSidebar.innerHTML = '';

 let categories = [];
 let allRecords = window.prod_cata || [];


 // If no records in memory, try fetching from IndexedDB
 if (allRecords.length === 0) {
  try {
   if (typeof dbDexieManager !== 'undefined' && dbDexieManager.db) {
    allRecords = await dbDexieManager.getAllRecords(dbnm, 'p');
    window.prod_cata = allRecords;
   }
  } catch (e) {
   console.warn('Error fetching from IndexedDB:', e);
  }
 }

 // Get category IDs from o.da configuration
 var configuredCategoryIds = window[my1uzr.worknOnPg]?.categorys || [];

 if (allRecords.length > 0 && configuredCategoryIds.length > 0) {
  // Build a map for quick lookup
  var cataMap = {};
  allRecords.forEach(function (c) {
   cataMap[Number(c.a)] = c;
  });

  // Show categories in the exact order from o.da config
  configuredCategoryIds.forEach(function (catId) {
   var catRecord = cataMap[Number(catId)];

   if (catRecord) {
    // Found in p table - use its name and image
    categories.push({
     a: catRecord.a,
     e: catRecord.e || 'Category ' + catId,
     g: getGoogleDriveImageUrl(catRecord.g) || getGoogleDriveImageUrl(catRecord.h) || PLACEHOLDER_IMG,
     h: catRecord.h || '',
     f: catRecord.f || 0
    });
   }
   // else {
   //     // Not found in p table - still show with placeholder
   //     categories.push({
   //         a: catId,
   //         e: 'Category ' + catId,
   //         g: PLACEHOLDER_IMG,
   //         h: '',
   //         f: 0
   //     });
   // }
  });

 }
 // else if (allRecords.length > 0) {
 //     // No o.da config - show categories that have f=0 and are used by products
 //     var categoryRecords = allRecords.filter(function (r) { return Number(r.f) === 0; });
 //     var productRecords = allRecords.filter(function (r) { return Number(r.f) > 0; });

 //     var usedCategoryIds = new Set();
 //     productRecords.forEach(function (product) {
 //         if (product.f && Number(product.f) > 0) {
 //             usedCategoryIds.add(Number(product.f));
 //         }
 //     });

 //     categoryRecords.forEach(function (cat) {
 //         if (usedCategoryIds.has(Number(cat.a))) {
 //             categories.push({
 //                 a: cat.a,
 //                 e: cat.e || 'Unnamed Category',
 //                 g: getGoogleDriveImageUrl(cat.g) || getGoogleDriveImageUrl(cat.h) || PLACEHOLDER_IMG,
 //                 h: cat.h || '',
 //                 f: cat.f || 0
 //             });
 //         }
 //     });

 //     // Sort by ID when no o.da config
 //     categories.sort(function (a, b) {
 //         return Number(a.a) - Number(b.a);
 //     });
 // }


 if (categories.length === 0) {

  if (desktopStrip)
   desktopStrip.style.display = "none";

  if (mobileSidebar)
   mobileSidebar.style.display = "none";

  var desktopProducts = document.getElementById("prdContentDesktop");
  if (desktopProducts)
   desktopProducts.style.marginLeft = "0";

  safeShowProducts('all');
  return;
 }

 // Render to the appropriate container
 if (isMobile) {
  if (mobileSidebar) {
   mobileSidebar.style.display = 'flex';
   var mobileProducts = document.getElementById('prdContentMobile');
   if (mobileProducts) mobileProducts.style.width = '';
   renderCategoriesTo(mobileSidebar, categories);

   _catAutoClickTimer = setTimeout(function () {
    _catAutoClickTimer = null;
    var wanted = window.selectedCategoryId || 'all';
    var target = mobileSidebar.querySelector('.cat-card[data-cat-id="' + wanted + '"]') ||
                 mobileSidebar.querySelector('.cat-card');
    if (target && target.isConnected) {
     target.click();
    } else {
     safeShowProducts(wanted);
    }
   }, 300);
  }
 } else {
  if (desktopStrip) {
   desktopStrip.style.display = 'flex';
   var desktopProducts = document.getElementById('prdContentDesktop');
   if (desktopProducts) desktopProducts.style.marginLeft = '95px';
   renderCategoriesTo(desktopStrip, categories);

   _catAutoClickTimer = setTimeout(function () {
    _catAutoClickTimer = null;
    var wanted = window.selectedCategoryId || 'all';
    var target = desktopStrip.querySelector('.cat-card[data-cat-id="' + wanted + '"]') ||
                 desktopStrip.querySelector('.cat-card');
    if (target && target.isConnected) {
     target.click();
    } else {
     safeShowProducts(wanted);
    }
   }, 300);
  }
 }
}
window.renderCategoryStrip = renderCategoryStrip;

// Also update renderCategoriesTo to be more robust
function renderCategoriesTo(container, categories) {
 if (!container) {
  console.error('Container not found for categories');
  return;
 }


 // Clear container
 container.innerHTML = '';

 // Always add "All" category first
 var allDiv = document.createElement('div');
 allDiv.className = 'cat-card';
 allDiv.setAttribute('data-cat-id', 'all');
 allDiv.innerHTML = '<img class="cat-img" src="https://cdn-icons-png.flaticon.com/512/5110/5110770.png" alt="All" onerror="this.src=\'' + (window.PLACEHOLDER_IMG || '') + '\'"><div class="cat-name">All</div>';
 allDiv.addEventListener('click', function (e) {
  e.preventDefault();
  selectCategory(this, 'all');
 });
 container.appendChild(allDiv);


 // Add other categories
 if (categories && categories.length > 0) {
  categories.forEach(function (cat) {
   var d = document.createElement('div');
   d.className = 'cat-card';
   d.setAttribute('data-cat-id', cat.a);
   var imgSrc = typeof getGoogleDriveImageUrl === 'function' ? getGoogleDriveImageUrl(cat.g || cat.h) : (cat.g || cat.h || '');
   if (!imgSrc) imgSrc = PLACEHOLDER_IMG;
   d.innerHTML = '<img class="cat-img" alt="' + (cat.e || 'Category') + '" onerror="this.onerror=null;this.src=\'' + (window.PLACEHOLDER_IMG || '') + '\'"><div class="cat-name">' + (cat.e || 'Unnamed') + '</div>';
   d.addEventListener('click', function (e) {
    e.preventDefault();
    selectCategory(this, cat.a);
   });
   container.appendChild(d);
   var catImg = d.querySelector('.cat-img');
   if (catImg) queuedImageLoad(catImg, imgSrc);
  });
 }

}

function selectCategory(element, categoryId) {
 // Remove active class from all category cards
 document.querySelectorAll('.cat-card').forEach(function (card) {
  card.classList.remove('active-cat');
 });
 document.querySelectorAll('.cat-img').forEach(function (img) {
  img.classList.remove('active');
 });

 // Add active class to clicked element
 if (element) {
  element.classList.add('active-cat');
  var img = element.querySelector('.cat-img');
  if (img) img.classList.add('active');
 }

 showLoadingInPrd();
 window.selectedCategoryId = categoryId;


 safeShowProducts(categoryId);
}

function setupSearch() {
 var searchBtn = document.getElementById('searchBtn');
 var searchBar = document.getElementById('searchBarWrap');
 var searchInput = document.getElementById('searchInput');
 var closeBtn = document.getElementById('btnCloseSearch');
 var resultsDiv = document.getElementById('searchResultsDropdown');
 if (searchBtn && searchBar) {
  searchBtn.onclick = function () {
   var isOpen = searchBar.classList.contains('show');
   if (isOpen) { searchBar.classList.remove('show'); if (resultsDiv) resultsDiv.classList.remove('show'); if (searchInput) searchInput.value = ''; }
   else { searchBar.classList.add('show'); if (searchInput) { searchInput.value = ''; searchInput.focus(); } }
  };
 }
 if (closeBtn && searchBar && resultsDiv) { closeBtn.onclick = function () { searchBar.classList.remove('show'); resultsDiv.classList.remove('show'); if (searchInput) searchInput.value = ''; }; }
 if (searchInput && resultsDiv) {
  searchInput.oninput = function () {
   var q = this.value.trim().toLowerCase();
   if (!q) { resultsDiv.classList.remove('show'); return; }
   var products = window.PRODUCTS || window.prod_list || [];
   var filtered = products.filter(function (p) { var name = p.name || p.e || ''; return name.toLowerCase().indexOf(q) !== -1; });
   if (filtered.length > 0) {
    var html = '';
    filtered.forEach(function (p) {
     var name = p.name || p.e || 'Unnamed'; var img = p.image || p.g || ''; var price = p.sellingPrice || p.k || p.salesPrice || '0'; var catId = p.category || p.f || (p.P ? p.P.f : null) || 'all';
     var driveUrl = getGoogleDriveImageUrl(img) || '';
     html += '<div class="search-result-item" onclick="(function(){document.getElementById(\'searchBarWrap\').classList.remove(\'show\');document.getElementById(\'searchResultsDropdown\').classList.remove(\'show\');document.getElementById(\'searchInput\').value=\'\';selectCategory(document.querySelector(\'[data-cat-id=\\\'' + catId + '\\\']\'), \'' + catId + '\');})()"><img class="sr-img" data-src="' + driveUrl + '" alt="' + name + '" onerror="this.src=\'' + (window.PLACEHOLDER_IMG || '') + '\'"><div><div class="sr-name">' + name + '</div><div class="sr-price">₹' + price + '</div></div></div>';
    });
    resultsDiv.innerHTML = html; resultsDiv.classList.add('show');
    resultsDiv.querySelectorAll('.sr-img[data-src]').forEach(function (img) {
     queuedImageLoad(img, img.dataset.src);
    });
   } else { resultsDiv.innerHTML = '<div class="text-center text-muted p-4">No products found for "' + q + '"</div>'; resultsDiv.classList.add('show'); }
  };
 }
}

function setupBurgerMenu() {
 var burgerBtn = document.getElementById('burgerBtn');
 if (burgerBtn) {
  burgerBtn.onclick = function () {
   loadExe2Fn(16, [], [1]).then(function () {
    if (typeof openBurgerMenu === 'function') openBurgerMenu();
    else if (typeof showToast === 'function') showToast('Menu is loading, please try again', { type: 'warning', duration: 2000 });
   }).catch(function (err) { console.error('Failed to load menu:', err); if (typeof showToast === 'function') showToast('Failed to load menu', { type: 'error', duration: 2000 }); });
  };
 }
}

appcss = `.shopname-text,body{font-family:'Segoe UI',Roboto,Arial,sans-serif}*{box-sizing:border-box}body{margin:0;padding:56px 0 0;background:#eaf6ff;min-height:100vh}.topnav{position:fixed;top:0;left:0;right:0;z-index:9999;background:#005f73;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 15px;box-shadow:0 3px 8px rgba(0,0,0,.3)}#cartContainer,.shopname{align-items:center;display:flex}.topnav i{font-size:22px;cursor:pointer;color:#fff;transition:transform .2s}.topnav i:hover{transform:scale(1.1)}.shopname{gap:8px;min-width:0;max-width:45%}.shopname-logo{width:34px;height:34px;border-radius:50%;object-fit:cover;background:#fff;flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,.25)}.shopname-text{font-size:24px;font-weight:500;color:#fff;text-shadow:1px 1px 3px rgba(0,0,0,.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.cat-strip-desktop,.search-results-dropdown{overflow-y:auto;background:#fff;position:fixed;left:0;bottom:0}#cartContainer{margin-left:10px}.search-bar-wrap{position:fixed;top:56px;left:0;right:0;z-index:9998;background:#fff;padding:8px 12px;box-shadow:0 2px 6px rgba(0,0,0,.15);display:none;align-items:center;gap:8px}.search-bar-wrap.show{display:flex}.search-bar-wrap input{flex:1;padding:10px 16px;border:2px solid #e0e0e0;border-radius:24px;font-size:14px;outline:0;transition:border-color .2s;background:#f5f7fa}.search-bar-wrap input:focus{border-color:#005f73}.search-bar-wrap .btn-close-search{background:0 0;border:none;font-size:18px;color:#dc3545;cursor:pointer;padding:4px 8px}.search-results-dropdown{top:112px;right:0;z-index:9997;display:none;padding:8px}.search-results-dropdown.show{display:block}.search-result-item{display:flex;align-items:center;gap:10px;padding:12px;border-bottom:1px solid #f0f0f0;cursor:pointer}.cat-card:hover,.search-result-item:hover{background:#f0f7fa}.search-result-item img{width:44px;height:44px;border-radius:8px;object-fit:cover}.search-result-item .sr-name{font-weight:600;font-size:14px;color:#2d3748}.search-result-item .sr-price{color:#005f73;font-weight:700;font-size:13px}#cartIcon{position:relative;cursor:pointer;font-size:28px;padding:6px}#cartBadge{position:absolute;top:-5px;right:-5px;min-width:18px;height:18px;border-radius:50%;background:#e53e3e;color:#fff;font-size:11px;display:flex;justify-content:center;align-items:center}.cat-strip-desktop{display:flex;flex-direction:column;overflow-x:hidden;gap:6px;padding:16px 8px;scrollbar-width:none;-ms-overflow-style:none;width:95px;min-width:95px;box-shadow:2px 0 12px rgba(0,0,0,.06);top:56px;z-index:500;user-select:none;-webkit-user-select:none}.cat-strip-desktop::-webkit-scrollbar{display:none}.cat-strip-desktop.active{cursor:grabbing}.cat-card{display:flex;flex-direction:column;align-items:center;padding:10px 6px;cursor:pointer;border-radius:16px;border:2px solid transparent;transition:.25s;text-align:center;background:0 0;min-height:90px;justify-content:center;border-color:#42b1c073}.cat-card:active{transform:scale(.95)}.cat-card.active-cat{border-color:#0b6b78!important;background:#e8f4f8!important;box-shadow:0 2px 8px rgba(11,107,120,.15)!important}.cat-img{width:55px;height:55px;border-radius:14px;object-fit:contain;border:2px solid #e8ecf0;pointer-events:none;transition:.25s;background:#fafbfc;margin-bottom:6px}.cat-card.active-cat .cat-img{width:58px;height:58px}.cat-name{font-size:11px;color:#4a5568;text-align:center;line-height:1.3;font-weight:500;word-break:break-word;max-width:80px}#prdContentDesktop{margin-left:95px;padding:8px;min-height:200px}.loader-container{display:flex;justify-content:center;align-items:center;min-height:200px}.loader{border:4px solid #e8ecf0;border-top:4px solid #005f73;border-radius:50%;width:40px;height:40px;animation:1s linear infinite spin}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.opencode-refresh-spin{animation:.8s linear infinite drvSpin}@keyframes drvSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.mobile-layout{display:none}@media (max-width:768px){#prdContentDesktop,.cat-strip-desktop{display:none!important}.mobile-products,.mobile-sidebar{overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}#prdContentDesktop{margin-left:0}.mobile-layout{display:flex;height:calc(100vh - 50px)}.mobile-sidebar{width:85px;min-width:85px;background:#fff;border-right:1px solid #e8ecf0;box-shadow:2px 0 8px rgba(0,0,0,.04);margin-left:2.2px;margin-right:-3px;padding:12px 4px;display:flex;flex-direction:column;gap:4px}.mobile-sidebar::-webkit-scrollbar{display:none}.mobile-sidebar .cat-card{padding:8px 4px;min-height:75px;border-radius:14px;margin-bottom:2px}.mobile-sidebar .cat-card:hover{background:#f0f7fa}.mobile-sidebar .cat-img{width:44px;height:44px;border-radius:12px;margin-bottom:4px}.mobile-sidebar .cat-card.active-cat .cat-img{width:46px;height:46px}.mobile-sidebar .cat-name{font-size:10px;max-width:70px}.mobile-products{flex:1;background:#eaf6ff}.mobile-products::-webkit-scrollbar{display:none}.shopname{margin-left:60px;font-size:20px}.topnav{height:50px;padding:0 10px}body{padding-top:50px}.topnav i{font-size:18px}.search-bar-wrap{top:50px}.search-results-dropdown{top:100px}.bbs{position:relative;left:80%}#prdContentMobile{display:grid;gap:8px;padding:8px;width:100%}#prdContentMobile .product-card{display:flex;flex-direction:column;background:#fff;border-radius:12px;padding:10px;box-shadow:0 2px 8px rgba(0,0,0,.08);margin:0;width:100%;height:100%}#prdContentMobile .product-card .product-img{width:100%;height:120px;object-fit:contain;border-radius:8px;background:#fafbfc}#prdContentMobile .product-card .product-name{font-size:13px;font-weight:600;margin:6px 0 2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:36px}#prdContentMobile .product-card .product-price{color:#005f73;font-weight:700;font-size:14px;margin-top:auto}#prdContentMobile .product-card .add-cart-btn{margin-top:6px;width:100%;padding:6px;font-size:12px;border-radius:20px}.loader-container{min-height:200px;display:flex;justify-content:center;align-items:center;width:100%;grid-column:1/-1}}@media (max-width:480px){.mobile-sidebar{width:70px;min-width:70px;padding:12px 2px}.mobile-sidebar .cat-img{width:38px;height:38px;border-radius:10px}.mobile-sidebar .cat-card.active-cat .cat-img{width:40px;height:40px}.mobile-sidebar .cat-name{font-size:9px;max-width:60px}.mobile-sidebar .cat-card{padding:6px 2px;min-height:65px}.shopname{margin-left:60px;font-size:18px}.topnav{height:44px;padding:0 6px}body{padding-top:44px}.search-bar-wrap{top:44px}.search-results-dropdown{top:94px}#prdContentMobile{gap:6px;padding:6px}#prdContentMobile .product-card{padding:8px}#prdContentMobile .product-card .product-img{height:90px}#prdContentMobile .product-card .product-name{font-size:11px;min-height:30px}#prdContentMobile .product-card .product-price{font-size:12px}}@media (prefers-color-scheme:dark){body{background:#1a1a1a}.cat-strip-desktop,.mobile-sidebar{background:#2d2d2d;color:#e0e0e0;border-color:#444}#prdContentMobile .product-card .product-img,.cat-img{background:#333}.cat-name{color:#e0e0e0}.cat-card:hover{background:#3a3a3a}.cat-card.active-cat{background:#1a3a40!important;border-color:#0b6b78!important}.cat-img{border-color:#555}.search-bar-wrap,.search-results-dropdown{background:#2d2d2d;color:#e0e0e0}.search-bar-wrap input{background:#444;color:#fff;border-color:#555}.search-result-item{border-color:#444}#prdContentDesktop,.mobile-products{color:#e0e0e0;background:#1a1a1a}#prdContentMobile .product-card{background:#2d2d2d}}.bbm{margin-left:8px;font-size:12px;margin-top:8px}`;