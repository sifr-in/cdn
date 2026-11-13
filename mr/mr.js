(function () {
 function u() {
  try {
   var btn = document.querySelector('.app-nav__filter');
   if (!btn) return;
   var wk = window[window.my1uzr && window.my1uzr.worknOnPg];
   var has = false;
   if (wk && wk.activeFilters) {
    var f = wk.activeFilters;
    for (var k in f) {
     if (!Object.prototype.hasOwnProperty.call(f, k)) continue;
     var v = f[k];
     if (v === '' || v == null || v === undefined) continue;
     if (Array.isArray(v)) { if (v.length > 0) { has = true; break; } }
     else if (typeof v === 'object') { if (Object.keys(v).length > 0) { has = true; break; } }
     else { has = true; break; }
    }
   }
   var b = document.getElementById('filterActiveBadge');
   if (has) {
    if (!b) {
     b = document.createElement('span');
     b.id = 'filterActiveBadge';
     b.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
     b.style.cssText = 'font-size:9px;padding:2px 6px;z-index:5;';
     b.textContent = 'filter';
     btn.style.position = 'relative';
     btn.appendChild(b);
    }
   } else if (b) { b.remove(); }
  } catch (e) { }
 }
 window.__mrUpdateFilterBadge = u;
 setInterval(u, 1000);
 setTimeout(u, 500);
})();

const tblsRequired = ["f", "fp", "mr", "c", "mp", "mr_h", "mq", "mu"];
const moduLst = [
 { a: ",60,61,62,63,65,67,", b: "Dashboard", c: "fa-chart-line", d: "aminPnl", e: "#9c6f7fea", cid: 130 }
];
const inTbls = ["dontCret~", "pubilc~64,66,67,68,69,70,118", "2/0e-60~mr,c,mq,ma", "2/g-61~mp", "2/0f-62~mr", "2/0f-63~mr", "4/b-64~mr", "2/e-65~mp", "3/0d-66~mu,mr,ma", "2/h-67~mr", "3/0e-68~mr,mr_h,mq", "3/0d-69~mr", "3/0d-70~mr", "2/j-79~c", "2/j-80~c", "4/a-118~", "2/u-120~"];
const cust_const = [
 { "a": "paymentGatewayIntegrated", "b": 0, "c": "more customiztaion", "d": "if value is 1 payment gatewy will be shown, else manual", "u": "url-explaining-video" },
 { "a": "paymentRequiresProfile", "b": 0, "c": "more custom...", "d": "if value is 1 & payment gatewy on then will be users registration or profile is requred to use gatway, else cotinue as is", "u": "url-explaining-video" },
 { "a": "freeCnt", "b": 0, "c": "", "d": "free count to be given when profile is created fn-68 or plan-check--1", "u": "url-explaining-video" },
 { "a": "imageGalleryMax", "b": 4, "c": "", "d": "how many gallery images can be useed that number to be given here exp: 4", "u": "url-explaining-video" },
 { "a": "getDirectIdFromServer", "b": 1, "c": "", "d": "At my1img: if here have 1 then be use function to get ids directly and if 0/undefined then keep get and pass image url-data form cors64", "u": "url-explaining-video" }
];
moduLst.hook = "onModuLstAllowed2";
window[my1uzr.worknOnPg].moduLst = moduLst;
window[my1uzr.worknOnPg].onModuLstAllowed2 = function (allowedModules) {
 window[my1uzr.worknOnPg].allowedModulesMenuItems = allowedModules || [];
};

window.imgObjDimensRqd = [];
const sho_da_tkLimit = 1;
let appData = {};
const ids_of_views = [3];
let tblFailureCount = 1;
const cacheVersion = 1763390987;
const cacheStrategy = 1;
const dontShoLoginConfirmation = 1;
const dontRestartAfterLogin = 1;
let profilesData = [];
window.__mrUnlockedIds = Object.create(null);
let __mrLocalProfilesMerged = false;
window[my1uzr.worknOnPg].flsht = 3;
window[my1uzr.worknOnPg].lodErrMs = "press back back & open the app again;";
window[my1uzr.worknOnPg].emptBodyMs = "welcome to 'Zariya Muslim Marriage Bureau' matrimoney app;";
window[my1uzr.worknOnPg].cardHeight = 60;
window[my1uzr.worknOnPg].nonEditableFields = ['a', 'b', 'c', 'k', 'k1'];
window[my1uzr.worknOnPg].defaFieldVals = ['k1~9'];
window[my1uzr.worknOnPg].seqnce = "u,ut,u1,c8,l,a7,m,n";
window[my1uzr.worknOnPg].bdayFormat = "dd-mm-yyyy";

window[my1uzr.worknOnPg].csh = [
 { a: 1, u: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" },
 { a: 2, u: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" },
 { a: 3, u: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" },
 { a: 4, u: "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
 { a: 5, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7353e60/cmn/my1xi.min.js" },
 { a: 6, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1fb51f0/cmn/my1jp.min.js", c: "open_shoJgnP", r: "open_shoJgnP" },
 { a: 7, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1fb51f0/cmn/my1jo.min.js", c: "open_shoJgnO", r: "open_shoJgnO" },
 { a: 8, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/cmn/conta.min.js", c: "showContactModal", r: "showContactModal" },
 { a: 9, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@60f8540/cmn/my1img.min.js", c: "open_addimage", r: "open_addimage" },
 { a: 10, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8d9bf3e/cmn/my1ctr.min.js", c: "open_my1ctr", r: "open_my1ctr" },
 { a: 12, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1fb51f0/mr/fltr.js", c: "showFilterBox", r: "showFilterBox" },
 { a: 13, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1fb51f0/mr/drwr.min.js", c: "showDrawer", r: "showDrawer" },
 { a: 14, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1fb51f0/mr/regis.min.js", c: "showRegistrationModal", r: "showRegistrationModal" },
 { a: 17, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1fb51f0/mr/plans.js", c: "showMarriagePlans", r: "showMarriagePlans" },
 { a: 55, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1fb51f0/mr/prfl.min.js", c: "mrPrflReady", r: "mrShowProfileDtlsLazy" },
 { a: 15, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@141f125/cmn/ei.min.js", c: "open_entind_crud", r: "open_entind_crud" },
 { a: 39, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8d9bf3e/mr/slRlgn.min.js", c: "openCommonSelectionModal", r: "openCommonSelectionModal" },
 { a: 47, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1fb51f0/mr/slCoTal.js", c: "setValByPrprtyDepthToElm", r: "setValByPrprtyDepthToElm" },
 { a: 48, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8d9bf3e/mr/admr.min.js", c: "openMrAdmin", r: "openMrAdmin" },
 { a: 18, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7353e60/cmn/caste.da" },
 { a: 19, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7353e60/cmn/ctco.da" },
 { a: 20, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8d9bf3e/mr/abot.min.js", c: "set_abot_us_innerHTML", r: "set_abot_us_innerHTML" },
 { a: 24, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8d9bf3e/mr/chldpol.min.js", c: "set_child_safety_pol_innerHTML", r: "set_child_safety_pol_innerHTML" },
 { a: 23, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8d9bf3e/mr/unlkInf.min.js", c: "mrUnlockInfoModal", r: "mrUnlockInfoModal" },
 { a: 31, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@666354f/cmn/degs.da" },
 { a: 33, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@0208362/cmn/occu.da" },
 { a: 45, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7353e60/cmn/intal.da" },
 { a: 22, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@141f125/cmn/my1ap.js" },
 { a: 25, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@141f125/cmn/clrChe.min.js", c: "showClearCacheModal", r: "showClearCacheModal" }
];

async function showPhonePePostData() {
 var data = window.ppPostData;
 if (!data) return false;
 window.ppPostData = null;
 try {
  history.replaceState({}, "", window.location.pathname + window.location.hash);
  if (typeof clearPayload0 === "function") clearPayload0();
  if (!window.payload0) window.payload0 = {};
  var p = window.payload0;
  p.fn = 70;
  p.x1 = data.orderId;
  p.ul = "2/c.php";
  p.gt = 2;
  if (typeof dbDexieManager !== "undefined" && dbDexieManager &&
   typeof dbDexieManager.getMaxDateRecords === "function") {
   try { p.la = await dbDexieManager.getMaxDateRecords(window.dbnm, [{ tb: "mr" }]); } catch (eL) { }
  }
  var resp = await fnj4(null, p, 1, 1, null, 20000, 2, 1);
  if (resp && resp.su == 1) {
   if (typeof handl_mr_rspons === "function") { await handl_mr_rspons(resp); }
   if (typeof window.showelsemodal === "function") {
    window.showelsemodal("Payment successful! Your profile unlock count has been added.");
   }
  } else if (typeof window.showelsemodal === "function") {
   window.showelsemodal((resp && (resp.ms || resp.m)) || "Could not confirm your payment. Please contact support.");
  }
  return true;
 } catch (err) {
  if (typeof window.showelsemodal === "function") {
   window.showelsemodal("Error: " + ((err && err.message) || err));
  }
  return false;
 }
}
window.showPhonePePostData = showPhonePePostData;

(async function initMr() {
 //Start the config fetch right away so the Logo can be warmed into the image
 //cache while the boot loader is still on screen. The result is reused below.
 var __cfgPromise = null;
 try {
  __cfgPromise = fetch("mr.da").then(function (r) {
   if (!r.ok) throw new Error("HTTP " + r.status);
   return r.json();
  });
  __cfgPromise.catch(function () { });
 } catch (eCf) { __cfgPromise = null; }
 try {
  let result1 = await loadCshScriptsSequentially(1, 2, 3, 4, 5, 17, 22, 25);
  if (!result1.success) throw new Error("Failed to load required scripts: " + result1.error);

  const createResult = await dbDexieManager.handleNwTables("loader", dbnm, tblsRequired);

  var hook = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg][moduLst.hook];
  var existing = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].allowedModulesMenuItems;
  var missing = typeof existing === 'undefined' || existing === null || existing === '' || (Array.isArray(existing) && existing.length === 0);

  if (typeof hook === 'function' && missing) {
   var permitted = await chkModuLstAgainstFNF(moduLst);
   hook(permitted);
  }

  var cfg = __cfgPromise ? await __cfgPromise : null;
  if (!cfg || typeof cfg !== "object") throw new Error("bad config");

  try { window.da_mr = cfg; } catch (e) { }
  try { if (!window[my1uzr.worknOnPg]) window[my1uzr.worknOnPg] = {}; window[my1uzr.worknOnPg].clientConfig = cfg; } catch (e) { }
  window.imgObjDimensRqd = cfg?.imgObjDimensRqd;

  //Warm the Logo into Cache Storage + the mrImg memory cache immediately,
  //but only when the welcome modal is actually going to show it.
  try {
   window.__mrLogoReady = __mrWelcomeWanted() ? __mrStartLogoPreload(cfg) : null;
  } catch (eLp) { window.__mrLogoReady = null; }
 } catch (e) {
  window[my1uzr.worknOnPg].clientConfig = {};
 }
 try {
  if (typeof mrResolveAudioUrl === "function") {
   var __wjRes = (window[my1uzr.worknOnPg].clientConfig || {}).wajiw || [];
   if (Array.isArray(__wjRes)) {
    for (var __i = 0; __i < __wjRes.length; __i++) {
     var __it = __wjRes[__i];
     if (__it && __it.e != null && __it.e !== "") {
      __it.resolvedE = mrResolveAudioUrl(__it.e);
     }
    }
   }
  }
 } catch (eRes) {
 }
 try {
  if (typeof preloadWajiwSounds === "function") {
   var __wj = (window[my1uzr.worknOnPg].clientConfig || {}).wajiw || [];
   if (!Array.isArray(__wj)) __wj = [];
   var __only = function (keys) {
    return __wj.filter(function (it) { return it && it.e && keys.indexOf(String(it.a)) >= 0; });
   };
   var __not = function (keys) {
    return __wj.filter(function (it) { return it && it.e && keys.indexOf(String(it.a)) < 0; });
   };

   preloadWajiwSounds(__only(["wlcm"]));
   preloadWajiwSounds(__not(["wlcm", "pgf", "pga", "unlk"]));

   var __chained = false;
   function __chainWajiwRest() {
    if (__chained) return;
    __chained = true;
    try { preloadWajiwSounds(__only(["pgf", "pga", "unlk"])); }
    catch (eCW) { }
   }
   var __wa = ((window[my1uzr.worknOnPg] || {}).wajiwSnds || {})["wlcm"];
   if (!__wa || __wa.readyState >= 2 || __wa.error) {
    __chainWajiwRest();
   } else {
    __wa.addEventListener("loadeddata", __chainWajiwRest, { once: true });
    __wa.addEventListener("canplaythrough", __chainWajiwRest, { once: true });
    __wa.addEventListener("error", __chainWajiwRest, { once: true });
    setTimeout(__chainWajiwRest, 4000);
   }
  }
 } catch (ePW) {
 }
 try {
  var __cfg = window[my1uzr.worknOnPg].clientConfig || {};
  __mrApplyCardConfig(__cfg);
  __mrInjectAppCss();
  __mrRenderShell();
 } catch (e2) {
 }
 try {
  await __mrPrepLookups();
 } catch (e2b) {
 }
 try {
  for (var __w = 0; __w < 100 && !document.getElementById('main-content'); __w++) {
   await new Promise(function (r) { setTimeout(r, 50); });
  }
  await mrRenderList();
 } catch (e3) {
 }
 try {
  //Hold the loader until the Logo is cached so the welcome modal paints it
  //immediately, with a hard cap so a dead image can never block the app.
  try { await __mrWaitLogoReady(6000); } catch (eLw) { }
  __mrWelcomeModal();
 } catch (eW) { }
})();

function __mrLogoUrlFromCfg(cfg) {
 var raw = (cfg && cfg.Logo) || '';
 if (!raw) return '';
 if (typeof window.getGoogleDriveImageUrl === "function") {
  try { return window.getGoogleDriveImageUrl(raw) || raw; } catch (e) { return raw; }
 }
 return raw;
}

function __mrWelcomeWanted() {
 var P = window[my1uzr.worknOnPg] || {};
 var wj = (P.clientConfig || {}).wajiw || [];
 var has = false;
 for (var i = 0; i < wj.length; i++) {
  if (wj[i] && String(wj[i].a) === "wlcm" && wj[i].e) { has = true; break; }
 }
 if (!has) return false;
 var key = ((window.appOwner && window.appOwner.tn) || "mr") + "_mrWelcomeModalSeen";
 try { return (parseInt(localStorage.getItem(key) || "0", 10) || 0) < 2; } catch (e) { return false; }
}

function __mrStartLogoPreload(cfg) {
 var src = __mrLogoUrlFromCfg(cfg);
 if (!src) return Promise.resolve('');
 window.__mrLogoUrl = src;
 if (window.mrImg && typeof window.mrImg.load === "function") {
  try {
   return window.mrImg.load(src).then(function (u) {
    window.__mrLogoResolved = u || src;
    window.__mrLogoDone = true;
    return window.__mrLogoResolved;
   }, function () {
    window.__mrLogoResolved = src;
    window.__mrLogoDone = true;
    return src;
   });
  } catch (e) {
   window.__mrLogoResolved = src;
   window.__mrLogoDone = true;
   return Promise.resolve(src);
  }
 }
 //No cache helper yet: at least warm the browser HTTP cache.
 try { var im = new Image(); im.src = src; } catch (e2) { }
 window.__mrLogoDone = true;
 return Promise.resolve(src);
}

function __mrWaitLogoReady(timeoutMs) {
 var p = window.__mrLogoReady;
 if (!p || typeof p.then !== "function") return Promise.resolve();
 //Already warmed while booting: never flash the loader just to re-check.
 if (window.__mrLogoDone) return Promise.resolve();
 var shownByUs = false;
 try {
  var ld = document.getElementById('commonPageLoader');
  var visible = !!ld && ld.style.display !== 'none';
  if (!visible && typeof window.my1PageLoader === 'function') {
   window.my1PageLoader(true);
   shownByUs = true;
  }
 } catch (e) { }
 function done() {
  if (!shownByUs) return;
  shownByUs = false;
  try { window.my1PageLoader(false); } catch (e2) { }
 }
 var guard = new Promise(function (res) {
  setTimeout(function () { done(); res(); }, timeoutMs || 6000);
 });
 return Promise.race([
  Promise.resolve(p).then(done, done),
  guard
 ]);
}

function __mrWelcomeModal() {
 var P = window[my1uzr.worknOnPg] || {};
 var wj = (P.clientConfig || {}).wajiw || [];
 var raw = "";
 for (var i = 0; i < wj.length; i++) {
  if (wj[i] && String(wj[i].a) === "wlcm") { raw = wj[i].e || ""; break; }
 }
 if (!raw) return;

 var key = ((window.appOwner && window.appOwner.tn) || "mr") + "_mrWelcomeModalSeen";
 function seen() {
  try { return parseInt(localStorage.getItem(key) || "0", 10) || 0; } catch (e) { return 2; }
 }
 if (seen() >= 2) return;

 function playRaw() {
  if (typeof window.mrPlaySound === "function") { window.mrPlaySound(raw); }
  else if (window.mrSoundBtn) { window.mrSoundBtn.play(raw); }
 }

 function show() {
  try { localStorage.setItem(key, String(seen() + 1)); } catch (eS) { }
  if (window.mrSoundBtn && typeof window.mrSoundBtn.show === "function") {
   window.mrSoundBtn.show(raw);
  }

  //Use the URL warmed during boot; the preload already put it in Cache
  //Storage, so this paints without any network wait.
  var __wlSrc = window.__mrLogoResolved || window.__mrLogoUrl || '';
  if (!__wlSrc) {
   var __wlRaw = (window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.Logo) || '';
   __wlSrc = __mrLogoUrlFromCfg({ Logo: __wlRaw });
  }
  //The welcome logo is the very first thing the user sees, so it must not
  //wait on the IntersectionObserver that drives data-lazy hydration.
  var __wlImg = __wlSrc
   ? '<img id="mr-wlcm-logo" alt="Logo" loading="eager" decoding="async" style="max-width:220px;max-height:260px;width:auto;height:auto;display:block;margin:0 auto 12px;">'
   : '';
  var overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;" +
   "background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:99999;";
  overlay.innerHTML =
   '<div style="position:relative;background:#fff;border-radius:10px;padding:30px 26px 18px;' +
   'min-width:220px;box-sizing:border-box;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.25);">' +
   '<button type="button" data-mr-wlcm="x" aria-label="Close" ' +
   'style="position:absolute;top:6px;right:10px;border:none;background:transparent;' +
   'font-size:22px;line-height:1;color:#888;cursor:pointer;padding:2px 6px;">&times;</button>' +
   __wlImg +
   '<div style="font-size:17px;color:#8B1E3F;margin:4px 0 18px;">Welcome</div>' +
   '<button type="button" data-mr-wlcm="ok" ' +
   'style="background:#8B1E3F;color:#fff;border:none;padding:7px 26px;border-radius:6px;' +
   'font-size:14px;cursor:pointer;">OK</button>' +
   '</div>';
  document.body.appendChild(overlay);
  if (__wlSrc) {
   var __wlIm = overlay.querySelector("#mr-wlcm-logo");
   if (__wlIm) {
    __wlIm.src = __wlSrc;
    //Cold-start fallback only: if the boot preload never finished,
    //resolve through mrImg and swap in the cached blob URL.
    if (!window.__mrLogoResolved && window.mrImg && typeof window.mrImg.load === "function") {
     try {
      window.mrImg.load(__wlSrc).then(function (u) {
       if (u && __wlIm.parentNode) __wlIm.src = u;
      });
     } catch (eLd) { }
    }
   }
  }
  if (window.mrImg) { try { window.mrImg.hydrate(overlay); } catch (eH) { } }

  function close() {
   if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }
  overlay.addEventListener("click", function (ev) {
   var el = ev.target && ev.target.closest ? ev.target.closest("[data-mr-wlcm]") : null;
   var act = el ? el.getAttribute("data-mr-wlcm") : null;
   if (act === "ok") { close(); playRaw(); }
   else if (act === "x" || ev.target === overlay) { close(); }
  });
 }

 if (document.body) show();
 else document.addEventListener("DOMContentLoaded", show, { once: true });
}

function __mrEscHtml(value) {
 if (value === null || value === undefined) return '';
 return String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

var __mrAppCssTries = 0;
function __mrInjectAppCss() {
 if (document.getElementById('mr-appcss')) return;
 if (typeof appcss !== 'string' || !appcss) {
  if (++__mrAppCssTries <= 100) setTimeout(__mrInjectAppCss, 50);
  return;
 }
 var st = document.createElement('style');
 st.id = 'mr-appcss';
 st.textContent = appcss;
 document.head.appendChild(st);
 try {
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', '#8B1E3F');
 } catch (e) { }
}

function createNavigationBar(cfg) {
 var navBar = document.createElement('nav');
 navBar.id = 'mr-navbar';
 navBar.className = 'navbar app-navbar';
 navBar.innerHTML = `
        <div class="container-fluid app-nav">
            <div class="app-nav__left">
                <button class="app-nav__icon app-nav__menu" type="button" title="Menu"
                        aria-label="Open menu"
                        onclick="(async () => { await loadExe2Fn(13, [], [1]); })()">
                    <i class="fas fa-bars fa-lg"></i>
                </button>
            </div>
            <div class="app-nav">
                <button class="app-nav__brand" type="button" title="Account"
                        onclick="(async () => { await loadExe2Fn(10, ['dv_to_set_open_my1ctr_processed', 0, 1, 2], [1]); })()">
                    <span id="navbarBusinessName"></span>
                </button>
            </div>
            <div class="app-nav__right">
                <button class="app-nav__icon app-nav__filter" type="button" title="Filters" aria-label="Filters"
                        onclick="(async () => { await loadExe2Fn(12, [], [1]); })()">
                    <i class="fa-solid fa-sliders"></i>
                </button>
            </div>
        </div>
    `;
 var nameEl = navBar.querySelector('#navbarBusinessName');
 if (nameEl) nameEl.textContent = (cfg && cfg.business) ? String(cfg.business) : '';
 return navBar;
}

function createFooter(cfg) {
 var business = (cfg && cfg.business) ? String(cfg.business) : 'Matrimony App';
 var prvcFl = (cfg && cfg.prvcFl) ? String(cfg.prvcFl) : 'privacy-policy.html';
 var trmsFl = (cfg && cfg.trmsFl) ? String(cfg.trmsFl) : 'terms-and-conditions.html';
 var rfndFl = (cfg && cfg.rfndFl) ? String(cfg.rfndFl) : 'refund-policy.html';
 var footer = document.createElement('footer');
 footer.id = 'mr-footer';
 footer.className = 'app-footer app-footer--collapsed';
 footer.style = `padding:5px;`
 footer.innerHTML = `
        <div class="container">
            <button type="button" class="app-footer__toggle" aria-expanded="false" aria-label="Toggle footer">&#8593;</button>
             <div class="app-footer__details">
                 <div class="app-footer__brand">${__mrEscHtml(business)}</div>
            <div class="app-footer__links">
                <a href="${__mrEscHtml(prvcFl)}">Privacy</a>
                <a href="${__mrEscHtml(trmsFl)}">Terms</a>
                <a href="${__mrEscHtml(rfndFl)}">Refund</a>
            </div>
            <p class="app-footer__copy">&copy; ${new Date().getFullYear()} by sifr. All rights reserved.</p>
        </div>
             </div>
    `;
 var __ftToggle = footer.querySelector('.app-footer__toggle');
 if (__ftToggle) {
  __ftToggle.addEventListener('click', function () {
   var expanded = footer.classList.toggle('app-footer--expanded');
   footer.classList.toggle('app-footer--collapsed', !expanded);
   __ftToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
   __ftToggle.innerHTML = expanded ? '&#8595;' : '&#8593;';
  });
 }
 return footer;
}

async function __mrRenderShell() {
 function render() {
  if (!document.body || document.getElementById('mr-navbar')) return;
  var cfg = window[my1uzr.worknOnPg].clientConfig || {};
  document.body.appendChild(createNavigationBar(cfg));
  var main = document.createElement('div');
  main.id = 'main-content';
  document.body.appendChild(main);
  document.body.appendChild(createFooter(cfg));
 }
 if (document.body) {
  render();
  await __mrShowMainLoading();
 }
 else if (document.readyState === 'loading') {
  await new Promise(function (resolve) {
   document.addEventListener('DOMContentLoaded', function () {
    render();
    resolve();
   }, { once: true });
  });
  await __mrShowMainLoading();
 }
}

function __mrApplyCardConfig(cfg) {
 const P = window[my1uzr.worknOnPg];
 cfg = cfg || {};
 P.appInfo = cfg;
 P.pullWhenCardsRemain = (cfg.pullWhenCardsRemain != null) ? cfg.pullWhenCardsRemain : 6;
 P.showTableViewOnCardClick = (cfg.showTableViewOnCardClick != null) ? cfg.showTableViewOnCardClick : 1;
 P.fieldsOnCard = cfg.fieldsOnCard || "m~s~g,h,'budhdhist',k2,b2";
 P.cardExtras = cfg.cardExtras || { bio: "", online: "", match: "" };
 P.shoBadge = cfg.shoBadge || "qa";
 P.cardMetaIcons = cfg.cardMetaIcons || {};
 window.var_sub_caste_type = cfg.var_sub_caste_type || [
  { "a": 0, "e": "" }, { "a": 1, "e": "Jamati" },
  { "a": 2, "e": "Ahle hadees" }, { "a": 3, "e": "Devbandi" }
 ];
}

const __MR_DEFAULT_META_ICONS = { k: "mosque", g: "calendar-days", h: "ruler-vertical", s: "graduation-cap" };
function __mrMetaIcon(token) {
 const P = window[my1uzr.worknOnPg] || {};
 const m = P.cardMetaIcons || {};
 return m[token] || __MR_DEFAULT_META_ICONS[token] || 'circle';
}

window.marital_status = [
 { "a": 0, "e": "-" }, { "a": 1, "e": "Never Married" }, { "a": 2, "e": "Divorced" },
 { "a": 3, "e": "Widow/er" }, { "a": 4, "e": "In Marriage" }, { "a": 5, "e": "Annulled" },
 { "a": 6, "e": "Awaiting Divorce" }
];

const MR_LOOKUP_CACHE_V = 2;
const MR_LOOKUP_LEGACY_KEYS = ['var_caste_rlgns', 'var_degres', 'var_ctco', 'mr_desig_posis', 'var_intal'];
try {
 MR_LOOKUP_LEGACY_KEYS.forEach(function (k) { localStorage.removeItem(k); });
} catch (eLgc) { }

async function cmn_prep_data_set_to_var(varNm, mode, identifier, urlOverride, silent, opts) {
 if (!window[varNm]) window[varNm] = null;
 opts = opts || {};
 var useStorage = (opts.useStorage !== false);
 const lsKey = varNm + '@' + MR_LOOKUP_CACHE_V;

 const getUrlFromCsh = () => {
  if (urlOverride) return urlOverride;
  const cshItem = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].csh)
   ? window[my1uzr.worknOnPg].csh.find(item => item.a === identifier) : null;
  return cshItem ? cshItem.u : null;
 };

 const safeStoreToLocalStorage = (key, data) => {
  if (!useStorage) { return true; }
  try {
   localStorage.setItem(key, JSON.stringify(data));
   return true;
  } catch (error) {
   if (error && error.name === 'QuotaExceededError') {
    if (typeof showToast === 'function') {
     showToast('LocalStorage quota exceeded! Data will be kept in memory only.', {
      duration: 5000, position: 'top', type: 'warning', dismissible: true
     });
    }
    return false;
   }
   return false;
  }
 };

 const fetchAndStoreData = async (url) => {
  if (!url) {
   return null;
  }
  try {
   const response = await fetch(url);
   const data = await response.json();
   safeStoreToLocalStorage(lsKey, data);
   window[varNm] = data;
   try { if (varNm) window['da_' + varNm] = data; } catch (e) { }
   return data;
  } catch (error) {
   return null;
  }
 };

 if (mode === 1) {
  if (useStorage) {
   const storedData = localStorage.getItem(lsKey);
   if (storedData) {
    let parsedData = null;
    try {
     parsedData = JSON.parse(storedData);
     const isEmpty = parsedData === null || parsedData === undefined ||
      (Array.isArray(parsedData) && parsedData.length === 0) ||
      (typeof parsedData === 'object' && !Array.isArray(parsedData) && Object.keys(parsedData).length === 0);
     if (!isEmpty) {
      window[varNm] = parsedData;
      try { if (varNm) window['da_' + varNm] = parsedData; } catch (e) { }
      return parsedData;
     }
    } catch (e) {
     try { localStorage.removeItem(lsKey); } catch (e2) { }
    }
   }
  }
  return await fetchAndStoreData(getUrlFromCsh());
 }
 if (mode === 2) {
  return await fetchAndStoreData(getUrlFromCsh());
 }
 return null;
}
window.cmn_prep_data_set_to_var = cmn_prep_data_set_to_var;

async function __mrPrepLookups() {
 try {
  await Promise.all([
   cmn_prep_data_set_to_var('var_caste_rlgns', 1, 18, null, false, { useStorage: false }),
   cmn_prep_data_set_to_var('var_degres', 1, 31, null, false, { useStorage: false }),
   cmn_prep_data_set_to_var('var_ctco', 1, 19, null, false, { useStorage: false }),
   cmn_prep_data_set_to_var('mr_desig_posis', 1, 33, null, false, { useStorage: false }),
   cmn_prep_data_set_to_var('var_intal', 1, 45, null, false, { useStorage: false })
  ]);
  const P = window[my1uzr.worknOnPg];
  if (P && !P.cty && Array.isArray(window.var_ctco)) P.cty = window.var_ctco;
 } catch (e) {
 }
}

const MR_CTRY_REF_CSH = 45;
const __mrCtryRegionCache = {};

function __mrRegionAllow() {
 let raw = '';
 try {
  const P = window[my1uzr.worknOnPg];
  raw = (P && P.clientConfig && P.clientConfig.regionListCountries) || '';
 } catch (e) { }
 const set = String(raw || 'in').toLowerCase().split(',').map(function (s) { return s.trim(); }).filter(Boolean);
 if (set.indexOf('in') < 0) set.push('in');
 return set;
}

function __mrCtryTbl(country) {
 const iso2 = country && country.iso2;
 if (!iso2) return '';
 const t = String(iso2).toLowerCase().replace(/[^a-z]/g, '');
 if (!t || __mrRegionAllow().indexOf(t) < 0) return '';
 return t + 'tal';
}

function __mrCtryListVar(tbl) { return tbl ? 'var_' + tbl : ''; }

function __mrCtryListUrl(tbl) {
 if (!tbl) return null;
 const P = window[my1uzr.worknOnPg];
 const ref = (P && P.csh) ? P.csh.find(function (i) { return i.a === MR_CTRY_REF_CSH; }) : null;
 const base = ref && ref.u ? String(ref.u) : '';
 if (!base) return 'git/' + tbl + '.da';
 return base.replace(/[^\/?]*\.da(?=([?#]|$))/, tbl + '.da');
}

function __mrCtryRegionList(country) {
 const tbl = __mrCtryTbl(country);
 if (!tbl) return null;
 const v = window[__mrCtryListVar(tbl)];
 if (Array.isArray(v)) return v;
 const st = __mrCtryRegionCache[tbl];
 return (st && st.status === 'loaded') ? st.list : null;
}

function __mrIsCtryToken(seg) { return seg === '@ctry'; }

function __mrLoadCtryRegion(country) {
 const tbl = __mrCtryTbl(country);
 if (!tbl) return Promise.resolve(null);
 const st = __mrCtryRegionCache[tbl];
 if (st && st.promise) return st.promise;
 if (st && st.status === 'loaded') return Promise.resolve(st.list);
 if (st && st.status === 'missing') return Promise.resolve(null);
 const inMem = window[__mrCtryListVar(tbl)];
 if (Array.isArray(inMem) && inMem.length) {
  __mrCtryRegionCache[tbl] = { status: 'loaded', list: inMem };
  return Promise.resolve(inMem);
 }
 const promise = cmn_prep_data_set_to_var(__mrCtryListVar(tbl), 1, MR_CTRY_REF_CSH, __mrCtryListUrl(tbl), true, { useStorage: false })
  .then(function (list) {
   if (Array.isArray(list) && list.length) {
    __mrCtryRegionCache[tbl] = { status: 'loaded', list: list };
    return list;
   }
   __mrCtryRegionCache[tbl] = { status: 'missing', list: null };
   return null;
  })
  .catch(function () {
   __mrCtryRegionCache[tbl] = { status: 'missing', list: null };
   return null;
  });
 __mrCtryRegionCache[tbl] = { status: 'pending', list: null, promise: promise };
 promise.then(function () {
  if (typeof mrRenderMain === 'function' && profilesData.length && document.querySelector('.profile-card')) {
   try { mrRenderMain(true); } catch (eRP) { }
  }
 });
 return promise;
}
window.__mrLoadCtryRegion = __mrLoadCtryRegion;
window.__mrCtryTbl = __mrCtryTbl;
window.__mrCtryRegionList = __mrCtryRegionList;
window.__mrIsCtryToken = __mrIsCtryToken;

function handl_mr_rspons(response) {
 return (async () => {
  try {
   if (response.su == 1) {
    if (response.ma != null && response.ma.l != null) {
     await dbDexieManager.insertToDexie(dbnm, "ma", response.ma.l, true, ["a"]);
    }
    if (response.f != null && response.f.l != null) {
     await dbDexieManager.insertToDexie(dbnm, "f", response.f.l, true, ["a"]);
    }
    if (response.fp != null && response.fp.l != null) {
     await dbDexieManager.insertToDexie(dbnm, "fp", response.fp.l, true, ["a"]);
    }
    if (response.mr != null && response.mr.l != null) {
     await dbDexieManager.insertToDexie(dbnm, "mr", response.mr.l, true, ["a"]);
    }
    if (response.c != null && response.c.l != null) {
     await dbDexieManager.insertToDexie(dbnm, "c", response.c.l, true, ["a"]);
    }
    if (response.mp != null && response.mp.l != null) {
     await dbDexieManager.insertToDexie(dbnm, "mp", response.mp.l, true, ["a"]);
    }
    if (response.mq != null && response.mq.l != null) {
     await dbDexieManager.insertToDexie(dbnm, "mq", response.mq.l, true, ["a"]);
    }
    if (response.mr_h != null && response.mr_h.l != null) {
     await dbDexieManager.insertToDexie(dbnm, "mr_h", response.mr_h.l, true, ["a"]);
    }
    if (response.mu != null && response.mu.l != null) {
     await dbDexieManager.insertToDexie(dbnm, "mu", response.mu.l, true, ["a"]);
    }
   } else {
    if (typeof window.showelsemodal === "function") {
     window.showelsemodal(response.ms || response.m || "Operation failed");
    } else {
     alert(response.ms || "Error occurred");
    }
   }
  } catch (error) {
   if (typeof window.showelsemodal === "function") {
    window.showelsemodal(error && error.message ? error.message : "Operation failed");
   } else {
    alert(error);
   }
  }
 })();
}
window.handl_mr_rspons = handl_mr_rspons;

function __mrPlanByPid(pid) {
 try {
  const P = window[window.my1uzr.worknOnPg] || {};
  const list = (P.clientConfig || P.appInfo || {}).marriagePlans;
  if (!Array.isArray(list)) return null;
  return list.find(function (p) { return p && String(p.a) === String(pid); }) || null;
 } catch (e) { return null; }
}

async function hndlRspo70(resp) {
 if (!(resp && resp.su == 1)) {
  if (typeof window.showelsemodal === "function") {
   window.showelsemodal((resp && (resp.ms || resp.m)) || "No registered profile found for this number.");
  }
  return null;
 }
 const topShape = (!resp.mr && Array.isArray(resp.l));
 if (topShape) resp.mr = { l: resp.l };

 if (typeof handl_mr_rspons === "function") {
  try { await handl_mr_rspons(resp); } catch (eH) { }
 }
 const myRow = (resp.mr && Array.isArray(resp.mr.l) && resp.mr.l.length) ? resp.mr.l[0] : null;
 if (myRow && myRow.a != null && typeof window.mrPersistMyEinMR === "function") {
  try { window.mrPersistMyEinMR(myRow); } catch (eP) { }
 }
 if (typeof window.mrCloseMarriagePlans === "function") {
  try { window.mrCloseMarriagePlans(); } catch (ePC) { }
 }
 if (resp.pid != null && Number(resp.pid) !== 0 && typeof window.mrPayForPlan === "function") {
  const plan = __mrPlanByPid(resp.pid);
  if (plan && Number(plan.e) !== 0) { try { window.mrPayForPlan(plan); } catch (ePay) { } }
 }
 if (!topShape && typeof showToast === "function") {
  showToast((myRow && myRow.a != null) ? "Welcome back!" : "Updated successfully", { type: "success", duration: 3000, position: "top" });
 }
 if (typeof activeClose === "function") { try { activeClose(); } catch (eC) { } }
 if (typeof mrRenderList === "function") { try { await mrRenderList(true); } catch (eR) { } }
 return myRow;
}
window.hndlRspo70 = hndlRspo70;

function __mrLowestProfileCursor() {
 let lowest = null;
 (profilesData || []).forEach(function (p) {
  if (!p || !p.b) return;
  const d = new Date(p.b);
  if (isNaN(d.getTime())) return;
  if (!lowest || d < lowest) lowest = d;
 });
 if (!lowest) return '';
 const pad = function (n) { return String(n).padStart(2, '0'); };
 return lowest.getFullYear() + '-' + pad(lowest.getMonth() + 1) + '-' + pad(lowest.getDate())
  + ' ' + pad(lowest.getHours()) + ':' + pad(lowest.getMinutes()) + ':' + pad(lowest.getSeconds());
}

function __mrWhereFromSavedFilters() {
 try {
  //fltr.js stores the filters under "<page>_marriage_filter"; use the page
  //NAME for the key (window[page] is an object, which stringifies to
  //"[object Object]" and never matched the saved entry)
  const _pg = (typeof my1uzr !== 'undefined' && my1uzr && my1uzr.worknOnPg) ? my1uzr.worknOnPg : null;
  const _app = _pg ? window[_pg] : null;
  const _key = (_pg || 'app') + '_marriage_filter';
  let _src = {};
  try {
   const _raw = localStorage.getItem(_key);
   if (_raw) { try { _src = JSON.parse(_raw) || {}; } catch (eWS) { } }
  } catch (eWS2) { }
  const filters = (_app && _app.activeFilters && Object.keys(_app.activeFilters).length) ? _app.activeFilters : _src;
  if (!filters || typeof filters !== 'object') { return null; }
  const parts = [];
  const add = function (c) { if (c) { parts.push(c); } };
  if (filters.specific_profile_id) { add("w = '" + String(filters.specific_profile_id).replace(/'/g, '') + "'"); }
  const _ms = filters.marital_status;
  if (Array.isArray(_ms) && _ms.length) { add("j IN (" + _ms.map(function (v) { return String(v); }).join(',') + ")"); }
  const _minAge = filters.min_age, _maxAge = filters.max_age;
  if (_minAge || _maxAge) {
   const _d1 = _minAge ? new Date() : null;
   if (_d1) { _d1.setFullYear(_d1.getFullYear() - parseInt(_minAge)); add("g <= '" + convertDateFormatToComputer(_d1) + "'"); }
   const _d2 = _maxAge ? new Date() : null;
   if (_d2) { _d2.setFullYear(_d2.getFullYear() - parseInt(_maxAge)); add("g >= '" + convertDateFormatToComputer(_d2) + "'"); }
  }
  const _minH = filters.min_height, _maxH = filters.max_height;
  if (_minH || _maxH) {
   const _h1 = parseFloat(_minH) || 4.9;
   const _h2 = parseFloat(_maxH) || 7.11;
   add("h BETWEEN " + _h1 + " AND " + _h2);
  }
  const _minI = filters.min_income, _maxI = filters.max_income;
  if (_minI || _maxI) {
   const _i1 = parseFloat(_minI);
   const _i2 = parseFloat(_maxI);
   if (_minI) { add("i >= " + _i1); }
   if (_maxI) { add("i <= " + _i2); }
  }
  const _deg = filters.degree;
  if (Array.isArray(_deg) && _deg.length) {
   const _conds = _deg.map(function (v) { return "s LIKE '%" + String(v) + "%'"; });
   add("(" + _conds.join(' OR ') + ")");
  }
  const _occ = filters.occupation;
  if (Array.isArray(_occ) && _occ.length) {
   const _oconds = _occ.map(function (v) { return "qa LIKE '%" + String(v) + "%'"; });
   add("(" + _oconds.join(' OR ') + ")");
  }
  //place filters are stored as a comma path of ids (fltr.js applyFilters);
  //rebuild the same SQL placeSqlCondition() uses so a reload keeps them
  if (filters.native_city) { add(__mrPlaceCondition('b2', filters.native_city)); }
  if (filters.living_city) { add(__mrPlaceCondition('c3', filters.living_city)); }
  if (filters.working_city) { add(__mrPlaceCondition('a2', filters.working_city)); }
  if (!parts.length) { return null; }
  return parts.join(' AND ');
 } catch (eWF) {
  return null;
 }
}

async function pullProfiles(whr, reset) {
 try {
  payload0.fn = 64;
  payload0.x1 = (reset) ? '' : (__mrLowestProfileCursor() || '');
  payload0.whr = whr || '';
  payload0.ul = "4/b.php";
  payload0.gt = 4;
  const response = await fnj4(null, payload0, 0, 1, null, 20000, 2, 0);
  if (!(response && response.su == 1)) {
   if (typeof window.showelsemodal === "function") {
    window.showelsemodal((response && (response.ms || response.m)) || "Request failed");
   } else { alert((response && response.ms) || "Request failed"); }
  }
  if (response.su == 1) {
   const rows = (response.mr && response.mr.l) ? response.mr.l : [];
   const profiles = rows.map(applyProfileImageData).filter(function (p) {
    return Number(p && p.d) >= 1;
   });
   if (profiles.length === 0) {
   }
   return {
    profiles: profiles,
    hasMore: !!((response.mr && response.mr.hasMore) || rows.length > 0),
    ok: true
   };
  }
  return { profiles: [], hasMore: false, ok: false };
 } catch (error) {
  if (typeof window.showelsemodal === "function") {
   window.showelsemodal(error && error.message ? error.message : "Request failed");
  } else {
   alert(error);
  }
  return { profiles: [], hasMore: false, ok: false };
 }
}

window.pullNwProfiles = pullProfiles;
// Legacy name used by the filter module: it used to be a no-op, which left
// every filtered card's <img data-lazy> unhydrated (no picture after apply).
window.initLazyLoadImages = function (root) {
 if (window.mrImg) { try { window.mrImg.hydrate(root || document); } catch (e) { } }
};

window.mrDriveUrlFromToken = function (token) {
 if (token == null) return null;
 var t = String(token).trim();
 if (!t) return null;
 if (t.indexOf('://') !== -1 || t.indexOf('data:') === 0) return t;
 if (!/^[A-Za-z0-9_-]{20,}$/.test(t)) return null;
 return 'https://lh3.googleusercontent.com/d/' + t + '=s0?authuser=0';
};

window.mrImgSrcOrNull = function (value) {
 if (value == null) return null;
 var v = String(value).trim();
 if (!v) return null;
 if (v.indexOf('://') !== -1 || v.indexOf('data:') === 0 || v.indexOf('blob:') === 0) { return v; }
 return null;
};

window.mrUrlFromU = function (value, isThumb) {
 var fn = (typeof window.getGoogleDriveImageUrl === 'function')
  ? window.getGoogleDriveImageUrl
  : window.mrDriveUrlFromToken;
 return window.mrImgSrcOrNull(fn(value, isThumb));
};

window.mrResolveProfileImages = function (value) {
 var out = { display: null, thumbnail: null };
 if (value == null) return out;

 if (typeof value === 'object') {
  out.display = window.mrUrlFromU(value.b, false);
  out.thumbnail = window.mrUrlFromU(value.a, true);
  return out;
 }

 var raw = String(value).trim();
 if (!raw) return out;
 if (raw.charAt(0) === '{') {
  try { return window.mrResolveProfileImages(JSON.parse(raw)); } catch (e) { }
 }

 out.thumbnail = window.mrUrlFromU(raw, true);
 out.display = window.mrUrlFromU(raw, false) || out.thumbnail;
 return out;
};

window.mrParseGalleryImages = function (value) {
 var out = [];
 function push(v) {
  if (v === null || v === undefined) return;
  if (typeof v === "object") {
   var src = (v.a != null && v.a !== "") ? v.a : ((v.b != null && v.b !== "") ? v.b : (v.url != null ? v.url : null));
   if (src != null) out.push(src);
   return;
  }
  var s = String(v).trim();
  if (s) out.push(s);
 }
 if (value === null || value === undefined || value === "") return out;
 if (Array.isArray(value)) { value.forEach(push); return out; }
 if (typeof value === "object") { push(value); return out; }
 var raw = String(value).trim();
 if (!raw) return out;
 if (raw.charAt(0) === "[") {
  try { return window.mrParseGalleryImages(JSON.parse(raw)); } catch (e) { }
 }
 if (raw.charAt(0) === "{") {
  try { push(JSON.parse(raw)); return out; } catch (e) { }
 }
 raw.split(/[\n\r,]+/).forEach(function (part) {
  if (!part) return;
  if (part.charAt(0) === "{") {
   try { push(JSON.parse(part)); return; } catch (e) { }
  }
  push(part);
 });
 return out;
};

window.mrSerializeGalleryImages = function (arr) {
 var list = window.mrParseGalleryImages(arr);
 return JSON.stringify(list);
};

function applyProfileImageData(profile) {
 const imageData = window.mrResolveProfileImages(profile.u);
 if (imageData.thumbnail) {
  profile.thumbnail = imageData.thumbnail;
  profile.originalImage = imageData.display;
 } else if (profile.ut) {
  profile.thumbnail = profile.ut;
  profile.originalImage = profile.ut;
 } else {
  profile.thumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFMEUwRTAiLz48dGV4dCB4PSIxNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdDwvdGV4dD48dGV4dCB4PSIxNTAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
  profile.originalImage = null;
 }
 return profile;
}
window.applyProfileImageData = applyProfileImageData;

window.mrImg = (function () {
 var CACHE = "mr-img-v1", mem = Object.create(null), busy = Object.create(null);
 var MAX_CONC = 2, active = 0, queue = [];

 function drain() {
  while (active < MAX_CONC && queue.length) {
   var start = queue.shift();
   start();
  }
 }

 function runJob(url, resolve, attempt) {
  attempt = attempt || 0;
  active++;
  var open = (window.caches && typeof fetch === "function") ? caches.open(CACHE) : Promise.reject();
  open.then(function (c) {
   return c.match(url).then(function (hit) {
    if (hit) return hit;
    return fetch(url, { mode: "cors", credentials: "omit" }).then(function (res) {
     if (!res || !res.ok) { throw new Error("http-" + (res ? res.status : 0)); }
     try { c.put(url, res.clone()); } catch (e) { }
     return res;
    });
   });
  }).then(function (res) {
   if (!res) throw new Error("no-response");
   return res.blob();
  }).then(function (blob) {
   if (!blob || !blob.size) throw new Error("empty-blob");
   mem[url] = URL.createObjectURL(blob);
   active--;
   resolve(mem[url]);
   drain();
  }).catch(function () {
   active--;
   if (attempt < 2) {
    setTimeout(function () {
     queue.push(function () { runJob(url, resolve, attempt + 1); });
     drain();
    }, 1000 * (attempt + 1));
   } else {
    resolve(url);
   }
   drain();
  });
 }

 function load(url) {
  if (url == null) return Promise.resolve(url);
  url = String(url);
  if (!url || url.indexOf("data:") === 0 || url.indexOf("blob:") === 0) return Promise.resolve(url);
  if (mem[url]) return Promise.resolve(mem[url]);
  if (busy[url]) return busy[url];
  busy[url] = new Promise(function (resolve) {
   queue.push(function () { runJob(url, resolve); });
   drain();
  });
  busy[url].then(function () { delete busy[url]; });
  return busy[url];
 }

 function reveal(im) {
  var url = im.getAttribute("data-lazy");
  if (!url) return;
  im.removeAttribute("data-lazy");
  load(url).then(function (u) { im.src = u; });
 }

 var io = null;
 function hydrate(root) {
  var imgs = (root || document).querySelectorAll("img[data-lazy]");
  if (!imgs.length) return;
  if (typeof IntersectionObserver !== "function") { Array.prototype.forEach.call(imgs, reveal); return; }
  if (!io) io = new IntersectionObserver(function (es) {
   es.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); reveal(en.target); } });
  }, { rootMargin: "300px 0px" });
  Array.prototype.forEach.call(imgs, function (im) { io.observe(im); });
 }

 return { load: load, hydrate: hydrate };
})();

function calculateAge(value) {
 try {
  if (value === null || value === undefined || value === '') return 'Unknown';
  var y, m, d;
  if (value instanceof Date) {
   if (isNaN(value.getTime())) return 'Unknown';
   y = value.getFullYear(); m = value.getMonth() + 1; d = value.getDate();
  } else if (typeof value === 'number') {
   var dn = new Date(value);
   if (isNaN(dn.getTime())) return 'Unknown';
   y = dn.getFullYear(); m = dn.getMonth() + 1; d = dn.getDate();
  } else {
   var s = String(value).trim();
   var a = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
   if (a) { y = +a[1]; m = +a[2]; d = +a[3]; }
   else {
    var b = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/);
    if (!b) return 'Unknown';
    d = +b[1]; m = +b[2]; y = +b[3];
   }
  }
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return 'Unknown';
  var today = new Date();
  var age = today.getFullYear() - y;
  var md = (today.getMonth() + 1) - m;
  if (md < 0 || (md === 0 && today.getDate() < d)) age--;
  return age < 1 ? 'Unknown' : age;
 } catch (e) {
  return 'Unknown';
 }
}

function formatHeight(height) {
 //Height is stored as feet.inches (e.g. 5.89 -> 5' 89"), the same way the
 //profile details view shows it. Do not convert the fraction as feet, that
 //turned 5.89 into 5' 11".
 const s = String(height == null ? '' : height).trim();
 if (!s) return '';
 const parts = s.split('.');
 const feet = parts[0] || '0';
 const inches = parts.length > 1 && parts[1] !== '' ? parts[1] : '0';
 return feet + "' " + inches + '"';
}

function formatPackage(packageValue) {
 const n = parseFloat(packageValue);
 if (!n || n <= 0) return '';
 return "â‚¹" + packageValue + " Lakhs";
}

function __mrPathNames(listName, path) {
 const parts = String(listName || '').split(',').map(s => s.trim()).filter(Boolean);
 const top = parts.length ? window[parts[0]] : null;
 if (!Array.isArray(top)) { return []; }
 const childKeys = parts.slice(1);
 const ids = String(path).split(',').map(s => s.trim()).filter(Boolean);
 if (!ids.length) { return []; }
 const names = [];
 let arr = top;
 for (let i = 0; i < ids.length; i++) {
  const found = arr.find(it => it && String(it.a) === ids[i]);
  if (!found) { break; }
  const nm = found.e || found.n || '';
  if (!/^-+\s*select\s*-+$/i.test(String(nm).trim())) names.push(nm);
  if (i >= childKeys.length) { break; }
  const seg = childKeys[i];
  if (__mrIsCtryToken(seg)) {
   const loaded = __mrCtryRegionList(found);
   if (loaded) {
    arr = loaded;
   } else {
    if (__mrCtryTbl(found) && i < ids.length - 1) { __mrLoadCtryRegion(found); }
    arr = found.x || [];
   }
  } else {
   arr = found[seg] || [];
  }
 }
 return names.filter(Boolean);
}
window.__mrPathNames = __mrPathNames;

function __mrPathName(listName, path) {
 return __mrPathNames(listName, path).join(' / ');
}
window.__mrPathName = __mrPathName;

const __MR_PLACE_GROUPS = {
 a2: ['a2', 'a3', 'a4', 'a5', 'a6'],
 b2: ['b2', 'b3', 'b4', 'b5', 'b6'],
 c3: ['c3', 'c4', 'c5', 'c6', 'c7']
};
function __mrPlacePath(profile, root) {
 const grp = __MR_PLACE_GROUPS[root];
 if (!grp || !profile) return '';
 const ids = [];
 for (let i = 0; i < grp.length; i++) {
  const v = profile[grp[i]];
  if (v === undefined || v === null || v === '' || String(v) === '0') continue;
  ids.push(String(v));
 }
 return ids.join(',');
}
window.__mrPlacePath = __mrPlacePath;

function __mrPlaceSlots(root, path) {
 const grp = __MR_PLACE_GROUPS[root];
 if (!grp) return [];
 const ids = String(path || '').split(',').map(s => s.trim()).filter(Boolean);
 const out = grp.map(() => '');
 let flat = false;
 if (ids.length > 1 && ids.length < grp.length) {
  const list = Array.isArray(window.var_ctco) ? window.var_ctco : [];
  const row = list.find(c => c && String(c.a) === ids[0]);
  if (row && !__mrCtryRegionList(row)) flat = true;
 }
 if (!flat) {
  for (let i = 0; i < ids.length && i < grp.length; i++) out[i] = ids[i];
  return out;
 }
 const leaf = ids[ids.length - 1];
 for (let i = 0; i < ids.length - 1 && i < grp.length - 1; i++) out[i] = ids[i];
 out[grp.length - 1] = leaf;
 return out;
}
window.__mrPlaceSlots = __mrPlaceSlots;

// Same SQL a saved place filter needs after a reload (mirrors fltr.js
// placeSqlCondition, which is not loaded yet when the first list renders).
function __mrPlaceCondition(root, path) {
 const grp = __MR_PLACE_GROUPS[root];
 if (!grp || !path) return '';
 const q = function (v) { return String(v).replace(/'/g, "''"); };
 const ids = String(path).split(',').map(s => s.trim()).filter(Boolean);
 const slots = __mrPlaceSlots(root, path);
 const parts = [];
 for (let i = 0; i < grp.length; i++) {
  if (slots[i]) parts.push(grp[i] + " = '" + q(slots[i]) + "'");
 }
 if (!parts.length) return '';
 let next = '(' + parts.join(' AND ') + ')';
 //rows saved before the flat-country fix kept the city in the state slot
 const legacy = [];
 for (let j = 0; j < ids.length && j < grp.length; j++) {
  legacy.push(grp[j] + " = '" + q(ids[j]) + "'");
 }
 if (legacy.join('|') !== parts.join('|')) {
  next = '(' + next + ' OR (' + legacy.join(' AND ') + '))';
 }
 return next;
}
window.__mrPlaceCondition = __mrPlaceCondition;

function __mrIsTreeField(token) {
 const C = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig) || {};
 const raw = C.showTreeView;
 if (raw === undefined || raw === null) {
  const sf = C.selectFields || {};
  return !!(sf[token] && Number(sf[token].depth) > 0);
 }
 return String(raw).split(',').map(s => s.trim()).filter(Boolean).indexOf(String(token)) >= 0;
}

function __mrCityName(id) {
 if (id === undefined || id === null || id === '') { return ''; }
 const C = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig) || {};
 if (__mrIsTreeField('b2')) {
  const b2arr = (C.selectFields && C.selectFields.b2 && C.selectFields.b2.arr) || 'var_ctco,@ctry,x,x,x';
  const depthNm = __mrPathName(b2arr, id);
  if (depthNm) { return depthNm; }
 }
 const list = window.var_ctco || [];
 for (let i = 0; i < list.length; i++) {
  if (list[i].a == id) {
   const nm = list[i].n || list[i].e;
   return nm ? String(nm) : '';
  }
  const cities = list[i].x || [];
  for (let j = 0; j < cities.length; j++) {
   if (cities[j].a == id) {
    const cnm = cities[j].n || cities[j].e;
    return cnm ? String(cnm) : '';
   }
  }
 }
 return '';
}

function __mrDegreeNames(value) {
 const ids = value ? String(value).split(',').map(id => id.trim()).filter(Boolean) : [];
 if (ids.length === 0) { return ''; }
 const names = ids.map(id => {
  const degree = (window.var_degres || []).find(item => item.a == id);
  return degree ? degree.e : null;
 }).filter(Boolean);
 return names.join(', ');
}

function __mrExtraRaw(profile, key) {
 if (!key || !profile) { return null; }
 const v = profile[key];
 if (v === undefined || v === null || v === '') { return null; }
 return v;
}
function __mrExtraText(profile, key) {
 const v = __mrExtraRaw(profile, key);
 if (v === null) { return ''; }
 return (typeof v === 'object') ? '' : String(v);
}
function __mrExtraFlag(profile, key) {
 const v = __mrExtraRaw(profile, key);
 if (v === null) { return false; }
 if (typeof v === 'boolean') { return v; }
 const s = String(v).trim().toLowerCase();
 return !(s === '' || s === '0' || s === 'false' || s === 'off' || s === 'null');
}
function __mrExtraNumber(profile, key) {
 const v = __mrExtraRaw(profile, key);
 if (v === null) { return null; }
 const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
 if (isNaN(n)) { return null; }
 return Math.max(0, Math.min(100, Math.round(n)));
}

function safeReload() {
 try {
  if (typeof Android !== 'undefined' && Android.reloadPage) {
   Android.reloadPage();
  } else if (typeof Android !== 'undefined') {
   window.location.href = window.location.href.split('?')[0] + '?_t=' + Date.now();
  } else {
   location.reload();
  }
 } catch (e) {
  window.location.href = window.location.href.split('?')[0] + '?_t=' + Date.now();
 }
}

let isFetching = false;
let hasMore = true;
let __mrScrollBound = false;

window.showProfileDtls = function (profileId) {
 loadExe2Fn(55, [profileId], [1]);
};

window.openAdminFromMenu = window.aminPnl = function (action) {
 try {
  loadExe2Fn(48, [], [1]);
 } catch (e) {
  if (typeof showToast === "function") {
   showToast("Could not open admin.", { type: "error", duration: 3000, position: "top" });
  }
 }
};

function createLoader() {
 const loader = document.createElement('div');
 loader.id = 'infinite-scroll-loader';
 loader.innerHTML = `
        <div class="skeleton-loader">
            <div class="skeleton-row skeleton-row--sm">
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton skeleton-line skeleton-title"></div>
                <div class="skeleton skeleton-line skeleton-meta short"></div>
                <div class="skeleton skeleton-line skeleton-meta short"></div>
            </div>
            <div class="skeleton-row skeleton-row--sm">
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton skeleton-line skeleton-title"></div>
                <div class="skeleton skeleton-line skeleton-meta short"></div>
                <div class="skeleton skeleton-line skeleton-meta short"></div>
            </div>
        </div>
        <p class="text-muted mt-2 mb-0">Loading more profiles...</p>
    `;
 return loader;
}

function __mrCardFactValue(profile, token) {
 if (token.startsWith("'") && token.endsWith("'")) { return token.slice(1, -1); }
 if (token.startsWith('"') && token.endsWith('"')) { return token.slice(1, -1); }
 if (token === 'm') return profile.m || null;
 if (token === 'g') {
  const age = profile.g ? calculateAge(profile.g) : null;
  return (age !== null && age !== 'Unknown') ? age + ' yrs' : '-';
 }
 if (token === 'h') return profile.h ? formatHeight(profile.h) : null;
 if (token === 'i') return profile.i ? formatPackage(profile.i) : null;
 if (token === 'k') {
  if (!__mrIsSetId(profile.k)) return '-';
  const rlgn = (window.var_caste_rlgns || []).find(function (item) { return item && __mrIsSetId(item.a) && String(item.a) === String(profile.k); });
  return rlgn ? __mrTreeLabel(rlgn.e) : '-';
 }
 if (token === 'k1') {
  if (!__mrIsSetId(profile.k)) return '-';
  if (!__mrIsSetId(profile.k1)) return '-';
  const rlgn = (window.var_caste_rlgns || []).find(function (item) { return item && __mrIsSetId(item.a) && String(item.a) === String(profile.k); });
  if (!rlgn || !Array.isArray(rlgn.x)) return '-';
  const caste = rlgn.x.find(function (c) { return c && __mrIsSetId(c.a) && String(c.a) === String(profile.k1); });
  return caste ? __mrTreeLabel(caste.e) : '-';
 }
 if (token === 'k2') {
  if (!__mrIsSetId(profile.k) || !__mrIsSetId(profile.k1) || !__mrIsSetId(profile.k2)) return '-';
  const rlgn = (window.var_caste_rlgns || []).find(function (item) { return item && __mrIsSetId(item.a) && String(item.a) === String(profile.k); });
  const caste = (rlgn && Array.isArray(rlgn.x)) ? rlgn.x.find(function (c) { return c && __mrIsSetId(c.a) && String(c.a) === String(profile.k1); }) : null;
  const subCaste = (caste && Array.isArray(caste.x)) ? caste.x.find(function (s) { return s && __mrIsSetId(s.a) && String(s.a) === String(profile.k2); }) : null;
  return subCaste ? __mrTreeLabel(subCaste.e) : '-';
 }
 if (token === 's') return __mrDegreeNames(profile.s) || null;
 if (__mrIsTreeField(token)) {
  const tCfg = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig) || {};
  const tField = (tCfg.selectFields || {})[token];
  const tPath = __mrPlacePath(profile, token) || profile[token];
  return __mrPathName(tField && tField.arr, tPath) || null;
 }
 if (token === 'a3' || token === 'b5' || token === 'c5') return __mrCityName(profile[token]) || null;
 return profile[token] || null;
}

function __mrIsSetId(v) {
 if (v === null || v === undefined) return false;
 var s = String(v).trim();
 if (s === '') return false;
 if (s === '0') return false;
 if (s === 'undefined') return false;
 if (s === 'null') return false;
 return true;
}

function __mrTreeLabel(v) {
 if (v === null || v === undefined) return '-';
 var s = String(v).trim();
 if (s === '') return '-';
 if (/^-+\s*select\s*-+$/i.test(s)) return '-';
 return s;
}

function __mrRelationName(id) {
 if (id == null || id === '') return '';
 const s = (window.marital_status || []).find(x => x.a == id);
 return s ? (s.e || '') : '';
}

function __mrReligionNames(profile) {
 var names = [];
 if (!profile) return names;
 var list = window.var_caste_rlgns || [];
 if (!Array.isArray(list)) return names;
 if (!__mrIsSetId(profile.k)) return names;
 var rlgn = list.find(function (it) { return it && __mrIsSetId(it.a) && String(it.a) === String(profile.k); });
 if (!rlgn) return names;
 names.push(__mrTreeLabel(rlgn.e));

 if (profile.k1 !== undefined) {
  var castes = Array.isArray(rlgn.x) ? rlgn.x : [];
  var caste = __mrIsSetId(profile.k1)
   ? castes.find(function (c) { return c && __mrIsSetId(c.a) && String(c.a) === String(profile.k1); })
   : null;
  names.push(caste ? __mrTreeLabel(caste.e) : '-');

  if (caste && profile.k2 !== undefined) {
   var subs = Array.isArray(caste.x) ? caste.x : [];
   var sub = __mrIsSetId(profile.k2)
    ? subs.find(function (s) { return s && __mrIsSetId(s.a) && String(s.a) === String(profile.k2); })
    : null;
   names.push(sub ? __mrTreeLabel(sub.e) : '-');
  }
 }
 return names;
}

function __mrCardColors(id) {
 let hash = 0;
 const s = String(id == null ? '' : id);
 for (let i = 0; i < s.length; i++) {
  hash = ((hash << 5) - hash) + s.charCodeAt(i);
  hash |= 0;
 }
 const h = Math.abs(hash) % 360;
 return { light: 'hsl(' + h + ', 70%, 55%)', dark: 'hsl(' + h + ', 70%, 35%)' };
}

function createProfileCard(profile) {
 const uniqueProflID = profile.w || '';
 const profileId = profile.a;
 const firstName = profile.m || 'Unknown';

 const age = profile.g ? calculateAge(profile.g) : null;
 const ageTxt = (age !== null && age !== 'Unknown') ? (age + ' yrs') : '-';
 const height = profile.h ? formatHeight(profile.h) : '';
 const degreeTxt = __mrDegreeNames(profile.s);
 const packageAmount = null;

 const qaValue = String(profile.qa || '').trim();
 const isVerified = qaValue.length > 0;
 const isPremium = !!packageAmount;

 const religionNames = __mrReligionNames(profile);
 const relationTxt = __mrRelationName(profile.j);

 const inlineParts = [];
 if (ageTxt && ageTxt !== '-') inlineParts.push(`<span class="app-card__meta-item"><i class="fas fa-${__mrMetaIcon('g')}"></i>${__mrEscHtml(ageTxt)}</span>`);
 if (height) inlineParts.push(`<span class="app-card__meta-item"><i class="fas fa-${__mrMetaIcon('h')}"></i>${__mrEscHtml(height)}</span>`);
 const inlineMeta = inlineParts.join('');
 const isUnlocked = !!window.__mrUnlockedIds[String(profileId)];
 const badgeStyle = isUnlocked
  ? 'background-image:linear-gradient(135deg,#2e7d5b,#1f7a4d 55%,#155f3c);background-color:#2e7d5b;'
  : 'background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));background-color:var(--mr-primary);';
 const viewBadge = `<button type="button" class="app-card__view-badge${isUnlocked ? ' app-card__view-badge--unlocked' : ''}" title="View Profile"
            style="${badgeStyle}"
            onclick="event.stopPropagation(); showProfileDtls(${profileId})"><i class="fas fa-eye"></i></button>`;
 const degreeText = degreeTxt ? `<span class="app-card__degree-text"><i class="fas fa-${__mrMetaIcon('s')}"></i> ${__mrEscHtml(degreeTxt)}</span>` : '';

 const col = document.createElement('div');
 col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4 app-card';
 col.dataset.profileId = String(profileId);

 col.innerHTML = `
        <div class="card profile-card" onclick="showProfileDtls(${profileId})" style="cursor:pointer;border-color:var(--mr-primary);border-width:1px;border-style:solid;">
            <div class="profile-image-container">
                <img data-lazy="${__mrEscHtml(profile.thumbnail || '')}"
                     alt="${__mrEscHtml(firstName)}"
                     class="profile-thumbnail"
                     loading="lazy" decoding="async">
                <div class="profile-overlay"></div>
                ${isPremium ? '<span class="app-card__premium"><i class="fas fa-crown"></i>Premium</span>' : ''}
                ${(() => {
   const uid = String(uniqueProflID || '').trim();
   if (!uid) return '';
   const eo = window.ownr_eo || '';
   const ec = window.ownr_ec || '';
   const pj = window.ownr_pj || '';
   if (!eo || !ec || !pj) return `<span class="app-card__id">ID: ${__mrEscHtml(uid)}</span>`;
   const url = `https://my1.in/${eo}/${ec}/${pj}/p/${encodeURIComponent(uid)}.html`;
   return `<span class="app-card__id app-card__id--link" role="button" tabindex="0" title="Share profile" onclick="event.stopPropagation(); var u='${url.replace(/'/g, "\\'")}'; if(typeof shareApp==='function'){ shareApp({url:u}); } else if(navigator.share){ navigator.share({url:u}).catch(function(){ try{prompt('Copy this link:',u);}catch(e){} }); } else { try{prompt('Copy this link:',u);} catch(e){} }">ID: ${__mrEscHtml(uid)}</span>`;
  })()}
            </div>

            <div class="app-card__body">
                <div class="app-card__title">
                    <h3 class="app-card__name">${__mrEscHtml(firstName)}</h3>
                    ${relationTxt ? `<span class="app-detail-main">${__mrEscHtml(relationTxt)}</span>` : ''}
                </div>
                <div class="app-card__row">
                    <div class="app-card__row-left">
                        ${inlineMeta ? `<div class="app-card__meta-inline">${inlineMeta}</div>` : ''}
                        ${degreeText}
                    </div>
                    <div class="app-card__row-right">${viewBadge}</div>
                </div>
            </div>
        </div>
    `;
 return col;
}

window.__mrMarkUnlocked = function (id) {
 if (id == null) return;
 if (!window.__mrUnlockedIds) window.__mrUnlockedIds = Object.create(null);
 window.__mrUnlockedIds[String(id)] = 1;
 var badge = null;
 try {
  var card = document.querySelector('.app-card[data-profile-id="' + String(id) + '"]');
  if (card) badge = card.querySelector('.app-card__view-badge');
 } catch (e) { }
 if (!badge) {
  try {
   var cards = document.querySelectorAll('.app-card');
   for (var i = 0; i < cards.length; i++) {
    if (String(cards[i].dataset && cards[i].dataset.profileId) === String(id)) {
     badge = cards[i].querySelector('.app-card__view-badge');
     break;
    }
   }
  } catch (e2) { }
 }
 if (badge) {
  badge.classList.add('app-card__view-badge--unlocked');
  badge.style.backgroundImage = 'linear-gradient(135deg,#2e7d5b,#1f7a4d 55%,#155f3c)';
  badge.style.backgroundColor = '#2e7d5b';
 } else if (typeof mrRenderList === "function") {
  try { mrRenderList(true); } catch (e3) { }
 }
};

(function __mrWrapHndlRspo66() {
 var t = setInterval(function () {
  if (typeof window.hndlRspo66 === "function" && !window.hndlRspo66.__mrWrapped) {
   var orig = window.hndlRspo66;
   window.hndlRspo66 = async function (resp, id) {
    var r = await orig.apply(this, arguments);
    if (id != null && id !== "") {
     if (typeof window.__mrMarkUnlocked === "function") {
      try { window.__mrMarkUnlocked(id); } catch (e) { }
     }
    }
    return r;
   };
   window.hndlRspo66.__mrWrapped = true;
   clearInterval(t);
  }
 }, 100);
 setTimeout(function () { clearInterval(t); }, 30000);
})();

function __mrNewCardReligionOpts() {
 const opts = [{ v: '', l: 'Religion' }];
 (window.var_caste_rlgns || []).forEach(r => {
  if (r && r.a != null && r.e) opts.push({ v: String(r.a), l: String(r.e) });
 });
 return opts;
}

function __mrNewCardStatusOpts() {
 const opts = [{ v: '', l: 'Status' }];
 (window.marital_status || []).forEach(s => {
  if (s && s.a != 0 && s.a != null && s.e) opts.push({ v: String(s.a), l: String(s.e) });
 });
 return opts;
}

function __mrNewCardDegreeOpts() {
 const opts = [{ v: '', l: 'Education' }];
 (window.var_degres || []).forEach(d => {
  if (d && d.a != null && d.e) opts.push({ v: String(d.a), l: String(d.e) });
 });
 return opts;
}

function __mrPersistMyRow(row) {
 if (!row) return;
 var handled = false;
 try {
  var d = Object.getOwnPropertyDescriptor(window, "myEinMR");
  if (d && typeof d.set === "function") { window.myEinMR = row; handled = true; }
 } catch (e) { }
 if (handled) return;
 try { window.myEinMR = row; } catch (e1) { }
 try {
  var tn = window.appOwner && window.appOwner.tn;
  if (tn) localStorage.setItem(tn + "_myEinMR", JSON.stringify(row));
 } catch (e2) { }
}
window.mrPersistMyEinMR = __mrPersistMyRow;

async function __mrOpenRegistration(explicitId) {
 var tn = window.appOwner && window.appOwner.tn;
 var id = (explicitId != null && explicitId !== "" && Number(explicitId) > 0) ? explicitId : null;
 if (!id) {
  try {
   var s = tn ? localStorage.getItem(tn + "_myEinMR") : null;
   if (s && s !== "undefined" && s !== "null") {
    var o = JSON.parse(s);
    if (o && Number(o.a) > 0) id = o.a;
   }
  } catch (e) { }
 }
 if (!id) {
  try {
   var mem = window.myEinMR;
   if (mem && Number(mem.a) > 0) id = mem.a;
  } catch (eMem) { }
 }
 if (id && typeof dbDexieManager !== 'undefined'
  && typeof dbDexieManager.getAllRecords === 'function' && dbnm) {
  try {
   var rows = await dbDexieManager.getAllRecords(dbnm, 'mr');
   var row = (rows || []).find(function (r) { return r && String(r.a) === String(id); });
   if (row) __mrPersistMyRow(row);
  } catch (eR) { }
 }
 loadExe2Fn(14, id ? [id] : [], [1]);
}
window.mrOpenRegistration = __mrOpenRegistration;

function mrOpenRegistrationForMe() { __mrOpenRegistration(); }

function createEmptyProfileCard() {
 const col = document.createElement('div');
 col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4 app-card app-card--new';
 col.style.visibility = 'hidden';

 const optsHtml = (list) => list
  .map(o => `<option value="${__mrEscHtml(o.v)}">${__mrEscHtml(o.l)}</option>`)
  .join('');
 const vSel = (field, list, label, cls) => `
        <select class="app-card__select${cls ? ' ' + cls : ''}" data-mrfield="${field}"
                tabindex="-1" aria-label="${__mrEscHtml(label)}">
            ${optsHtml(list)}
        </select>`;
 const vInp = (field, attrs) => `
        <input class="app-card__input" data-mrfield="${field}" tabindex="-1" readonly ${attrs}>`;
 const metaItem = (icon, ctl) => `
        <span class="app-card__meta-item"><i class="fas fa-${icon}"></i>${ctl}</span>`;

 const titleHtml = `
        <div class="app-card__title">
            <h3 class="app-card__name">
                <input class="app-card__input app-card__input--name" type="text" data-mrfield="m"
                       tabindex="-1" readonly placeholder="Name" aria-label="Name">
            </h3>
            ${vSel('j', __mrNewCardStatusOpts(), 'Status', 'app-detail-main')}
        </div>`;
 //Layout A: age + height inline, degree below, action on the right (same as real cards)
 const metaHtml = metaItem(__mrMetaIcon('g'), 'Age')
  + metaItem(__mrMetaIcon('h'), 'Height');
 //const degreeHtml = `<span class="app-card__degree-text"><i class="fas fa-${__mrMetaIcon('s')}"></i>${vSel('s', __mrNewCardDegreeOpts(), 'Education')}</span>`;

 const degreeHtml = `
    <span class="app-card__degree-text">
        <i class="fas fa-${__mrMetaIcon('s')}"></i>
        ${vSel('s', __mrNewCardDegreeOpts(), 'Education')}
    </span>
`;

 col.innerHTML = `
    <div class="card profile-card">
        <div class="profile-image-container profile-image-container--empty">
            <i class="fas fa-user-plus"></i>
            <div class="profile-overlay"></div>
        </div>

        <div class="app-card__body">
            ${titleHtml}

            <div class="app-card__meta-inline">
                ${metaHtml}
            </div>

            <div class="app-card__row">
                <div class="app-card__row-left">
                    ${degreeHtml}
                </div>

                <button type="button" class="app-card__create-btn">
                    <i class="fas fa-id-badge"></i>
                    Create My Profile
                </button>
            </div>
        </div>
    </div>
`;

 col.addEventListener('click', function () {
  function getSelfProfileLocal() {
   try {
    if (typeof getSelfProfile === 'function') {
     const s = getSelfProfile();
     if (s) return s;
    }
    if (typeof myEinMR !== 'undefined' && myEinMR && myEinMR.a) return myEinMR;
    const tn = window.appOwner && window.appOwner.tn;
    const ss = tn ? localStorage.getItem(tn + "_myEinMR") : null;
    if (ss && ss !== "undefined" && ss !== "null") {
     const o = JSON.parse(ss);
     if (o && o.a) return o;
    }
   } catch (e) { }
   return null;
  }

  const self = getSelfProfileLocal();

  if (!self) {
   const poseTill = window[my1uzr.worknOnPg]?.clientConfig?.registrationPoseTill;

   if (poseTill !== undefined && poseTill !== null && String(poseTill).trim().length > 0) {
    window.showConfirmModal(String(poseTill));
    return;
   }
  }

  mrOpenRegistrationForMe();
 });
 __mrHideAddCardIfLocalData(col);
 return col;
}

function __mrHideAddCardIfLocalData(col) {
 var reveal = function () { col.style.visibility = ''; };
 try {
  if (typeof dbDexieManager === 'undefined' || typeof dbDexieManager.getAllRecords !== 'function') { reveal(); return; }
  Promise.resolve(dbDexieManager.getAllRecords(dbnm, 'mr'))
   .then(function (rows) {
    if (rows && rows.length > 0) { if (col.isConnected) col.remove(); }
    else reveal();
   })
   .catch(reveal);
 } catch (e) { reveal(); }
}

function __mrShowMainLoading() {
 const main = document.getElementById('main-content');
 if (!main) return;
 main.innerHTML = `
        <div class="container app-state app-state--skeleton">
            <div class="skeleton-cards">
                <div class="skeleton-card skeleton-card--lg">
                    <div class="skeleton skeleton-avatar skeleton-avatar--lg"></div>
                    <div class="skeleton skeleton-line skeleton-title--lg"></div>
                    <div class="skeleton skeleton-line skeleton-meta--lg short"></div>
                    <div class="skeleton skeleton-line skeleton-meta--lg short"></div>
                </div>
                <div class="skeleton-card skeleton-card--lg">
                    <div class="skeleton skeleton-avatar skeleton-avatar--lg"></div>
                    <div class="skeleton skeleton-line skeleton-title--lg"></div>
                    <div class="skeleton skeleton-line skeleton-meta--lg short"></div>
                    <div class="skeleton skeleton-line skeleton-meta--lg short"></div>
                </div>
                <div class="skeleton-card skeleton-card--lg">
                    <div class="skeleton skeleton-avatar skeleton-avatar--lg"></div>
                    <div class="skeleton skeleton-line skeleton-title--lg"></div>
                    <div class="skeleton skeleton-line skeleton-meta--lg short"></div>
                    <div class="skeleton skeleton-line skeleton-meta--lg short"></div>
                </div>
            </div>
        </div>
    `;
}

function mrRenderMain(ok) {
 const main = document.getElementById('main-content');
 if (!main) return;

 if (!ok) {
  main.innerHTML = `
            <div class="container app-state">
                <div class="app-state__icon"><i class="fas fa-triangle-exclamation"></i></div>
                <div class="app-state__title">Error Loading Profiles</div>
                <p class="app-state__text">Something went wrong while fetching profiles. Please try again.</p>
                <button type="button" class="btn btn-primary" onclick="safeReload()">
                    <i class="fas fa-redo me-2"></i> Retry
                </button>
            </div>
        `;
  return;
 }

 if (profilesData.length === 0) {
  main.innerHTML = `
            <div class="container app-state">
                <div class="app-state__icon"><i class="fas fa-user-friends"></i></div>
                <div class="app-state__title">No Profiles Yet</div>
                <p class="app-state__text">Profiles will appear here when available. Check back soon!</p>
                <button type="button" class="btn btn-primary" onclick="mrRenderList()">
                    <i class="fas fa-rotate me-2"></i> Refresh
                </button>
            </div>
        `;
  return;
 }

 main.innerHTML = `
        <div class="container app-container">
            <div class="row" id="profiles-container"></div>
            <div id="loader-container"></div>
        </div>
    `;
 const container = main.querySelector('#profiles-container');
 const loaderContainer = main.querySelector('#loader-container');
 if (container) {
  container.appendChild(createEmptyProfileCard());
  profilesData.forEach(profile => container.appendChild(createProfileCard(profile)));
  if (hasMore && loaderContainer) loaderContainer.appendChild(createLoader());
  if (window.mrImg) window.mrImg.hydrate(container);
 }
}

async function mrRenderList(forceReset) {
 const main = document.getElementById('main-content');
 if (!main) return;
 __mrShowMainLoading();
 await new Promise(function (r) { setTimeout(r, 700); });

 const idParam = new URLSearchParams(window.location.search).get('id');
 const whr = idParam ? ("w = '" + String(idParam).replace(/'/g, '') + "'") : __mrWhereFromSavedFilters();

 const result = await pullProfiles(whr, forceReset || !!idParam);
 profilesData = result.profiles;
 hasMore = result.hasMore;

 try {
  if (typeof dbDexieManager !== 'undefined' && typeof dbDexieManager.getAllRecords === 'function' && dbnm) {
   const muRows = await dbDexieManager.getAllRecords(dbnm, 'mu');
   window.__mrUnlockedIds = Object.create(null);
   (muRows || []).forEach(function (r) { if (r && r.f != null) window.__mrUnlockedIds[String(r.f)] = 1; });
  }
 } catch (eU) { }

 if (result.ok && !idParam && !__mrWhereFromSavedFilters() && (forceReset || !__mrLocalProfilesMerged)) {
  try {
   if (typeof dbDexieManager !== 'undefined'
    && typeof dbDexieManager.getAllRecords === 'function' && dbnm) {
    __mrLocalProfilesMerged = true;
    const localRows = await dbDexieManager.getAllRecords(dbnm, 'mr');
    if (Array.isArray(localRows) && localRows.length) {
     const seen = {};
     profilesData.forEach(p => { if (p && p.a != null) seen[String(p.a)] = 1; });
     const locals = [];
     localRows.forEach(r => {
      if (!r || r.a == null) return;
      const id = String(r.a);
      if (seen[id]) return;
      seen[id] = 1;
      locals.push(applyProfileImageData(r));
     });
     profilesData = locals.concat(profilesData);
    }
   }
  } catch (e) { }
 }

 mrRenderMain(result.ok);

 if (!__mrScrollBound) {
  window.addEventListener('scroll', handleScroll);
  __mrScrollBound = true;
 }
}

async function handleScroll() {
 if (isFetching || !hasMore) return;
 const container = document.getElementById('profiles-container');
 if (!container) return;
 const allCards = container.querySelectorAll('.profile-card');
 if (allCards.length === 0) return;

 let lastVisibleIndex = -1;
 for (let i = allCards.length - 1; i >= 0; i--) {
  if (allCards[i].getBoundingClientRect().top < window.innerHeight) {
   lastVisibleIndex = i;
   break;
  }
 }
 if (lastVisibleIndex >= 0) {
  const remainingCards = allCards.length - 1 - lastVisibleIndex;
  if (remainingCards <= (window[my1uzr.worknOnPg].pullWhenCardsRemain || 0)) {
   await loadMoreProfiles();
  }
 }
}

async function loadMoreProfiles() {
 if (isFetching) return;
 isFetching = true;
 try {
  const loaderContainer = document.getElementById('loader-container');
  if (loaderContainer) {
   loaderContainer.innerHTML = '';
   loaderContainer.appendChild(createLoader());
  }

  const result = await pullProfiles(__mrWhereFromSavedFilters(), false);
  if (result.ok && result.profiles.length > 0) {
   profilesData = profilesData.concat(result.profiles);
   const container = document.getElementById('profiles-container');
   if (container) {
    result.profiles.forEach(profile => container.appendChild(createProfileCard(profile)));
    if (window.mrImg) window.mrImg.hydrate(container);
   }
  }
  hasMore = result.ok ? result.hasMore : false;

  if (loaderContainer) {
   loaderContainer.innerHTML = '';
   if (hasMore && result.ok && result.profiles.length > 0) loaderContainer.appendChild(createLoader());
  }
 } finally {
  isFetching = false;
 }
}

appcss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap');

:root{
  --surface:#fffdf6;
  --cream:#faf4e6;
  --ink:#241d12;
  --muted:#6f6656;
  --charcoal:#2f2a20;
  --on-brand:#ffffff;
  --mr-primary:#8B1E3F;
  --mr-primary-600:#A32A50;
  --mr-primary-700:#6E1733;
  --mr-primary-300:#B9607C;
  --mr-primary-50:#F9E9EE;
  --gold:#c9a45c;
  --gold-light:#e6cf9b;
  --gold-pale:#f3e7cd;
  --radius-sm:10px;
  --radius-md:16px;
  --radius-lg:22px;
  --radius-pill:999px;
  --font-display:'Playfair Display','Georgia',serif;
  --font-body:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  --shadow-sm:0 1px 2px rgba(36,29,18,.06),0 4px 12px rgba(36,29,18,.06);
  --shadow-md:0 6px 20px rgba(36,29,18,.10);
  --shadow-lg:0 24px 60px rgba(78,12,35,.24);
  --gold-ring:0 0 0 3px rgba(201,164,92,.28);
}

html, body{
  height:100%;
  background-color:#fffdf6;
  color:#241d12;
  font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  font-size:15px;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}
body{
  display:flex;
  flex-direction:column;
  min-height:100vh;
  min-height:100dvh;
}
a{ color:var(--mr-primary); text-decoration:none; }
a:hover{ color:var(--mr-primary-700); }
h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6,.card-title,.modal-title{
  font-family:'Playfair Display','Georgia',serif;
  font-weight:700;
  letter-spacing:.2px;
  color:#2f2a20;
}
::selection{ background:rgba(201,164,92,.4); color:#241d12; }
:focus-visible{ outline:none; box-shadow:0 0 0 3px rgba(201,164,92,.35); border-radius:6px; }

*{ scrollbar-width:thin; scrollbar-color:#c9a45c #faf4e6; }
*::-webkit-scrollbar{ width:10px; height:10px; }
*::-webkit-scrollbar-track{ background:#faf4e6; }
*::-webkit-scrollbar-thumb{ background:linear-gradient(180deg,#c9a45c,#a88a3f); border-radius:999px; border:2px solid #faf4e6; }
*::-webkit-scrollbar-thumb:hover{ background:var(--mr-primary); }

.text-primary,.text-primary:hover{ color:var(--mr-primary) !important; }
.text-muted{ color:#6f6656 !important; }
.text-success{ color:#2e7d5b !important; }
.text-danger{ color:#a33120 !important; }

.btn{
  font-family:'Inter',system-ui,sans-serif;
  font-weight:600;
  letter-spacing:.3px;
  border-radius:999px;
  padding:.55rem 1.25rem;
  border:1px solid transparent;
  transition:transform .18s ease, box-shadow .18s ease, background-color .18s ease, color .18s ease, border-color .18s ease;
  box-shadow:none;
  position:relative;
  white-space:nowrap;
}
.btn:hover{ transform:translateY(-1px); }
.btn:active{ transform:translateY(0) scale(.985); }
.btn:disabled,.btn.disabled{ opacity:.55; box-shadow:none; transform:none; }

.btn-primary{
  color:#ffffff;
  border-color:var(--mr-primary);
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  box-shadow:0 8px 20px rgba(78,12,35,.28);
}
.btn-primary:hover,.btn-primary:focus{
  color:#ffffff;
  border-color:var(--mr-primary);
  background-image:linear-gradient(135deg,#7a2317,#5c1a12 55%,#430f13);
  box-shadow:0 10px 26px rgba(78,12,35,.34);
}
.btn-primary:focus{ box-shadow:0 0 0 3px rgba(201,164,92,.4); }

.btn-outline-primary{
  color:var(--mr-primary);
  border-color:#c9a45c;
  background:transparent;
}
.btn-outline-primary:hover,.btn-outline-primary:focus{
  color:#ffffff;
  border-color:var(--mr-primary);
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600));
}
.btn-outline-primary:focus{ box-shadow:0 0 0 3px rgba(201,164,92,.4); }

.btn-secondary{
  color:#2f2a20;
  background-color:#f3e7cd;
  border-color:#d8bc86;
}
.btn-secondary:hover,.btn-secondary:focus{
  color:#2f2a20;
  background-color:#e6cf9b;
  border-color:#c9a45c;
}

.btn-success{
  color:#ffffff;
  background-image:linear-gradient(135deg,#2e7d5b,#1f5f44);
  border-color:#2e7d5b;
}
.btn-danger{
  color:#ffffff;
  background-image:linear-gradient(135deg,#a33120,#7a2317);
  border-color:#a33120;
}
.btn-warning{
  color:#3a2d10;
  background-image:linear-gradient(135deg,#e6cf9b,#c9a45c);
  border-color:#c9a45c;
}
.btn-sm{ padding:.35rem .9rem; font-size:.83rem; }
.btn-close{
  border-radius:999px;
  transition:transform .2s ease, opacity .2s ease;
}
.btn-close:hover{ transform:rotate(90deg); opacity:.9; }

.card{
  background:#fffdf6;
  border:1px solid rgba(201,164,92,.55);
  border-radius:18px;
  box-shadow:0 1px 2px rgba(36,29,18,.05),0 10px 30px rgba(36,29,18,.08);
  overflow:hidden;
}
.card-header{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  border-bottom:1px solid rgba(201,164,92,.6);
  color:#ffffff;
  padding:1rem 1.35rem;
}
.card-header .card-title{ color:#ffffff; font-size:1.15rem; margin:0; }
.card-body{ background:#fffdf6; color:#241d12; }
.card-footer{
  background:#faf4e6;
  border-top:1px solid rgba(201,164,92,.4);
}

.modal-backdrop{ background:rgba(43,22,14,.55); }
.modal-content{
  background:#fffdf6;
  border:1px solid rgba(201,164,92,.75);
  border-radius:22px;
  box-shadow:0 24px 60px rgba(78,12,35,.28);
  overflow:hidden;
}
.modal-header{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  border-bottom:1px solid rgba(201,164,92,.6);
  padding:1.15rem 1.5rem;
  color:#ffffff;
}
.modal-header .modal-title{ color:#ffffff; font-size:1.2rem; }
.modal-header .btn-close{ filter:invert(1); }
.modal-body{ background:#fffdf6; color:#241d12; padding:1.5rem; }
.modal-footer{
  background:#faf4e6;
  border-top:1px solid rgba(201,164,92,.4);
  padding:.9rem 1.5rem;
}

.modal .card{ border:none; box-shadow:none; border-radius:0; }
.modal .card-header{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  background-color:var(--mr-primary);
  border-bottom:1px solid rgba(201,164,92,.6);
  border-radius:0;
  padding:1rem 1.35rem;
}
.modal .card-header .card-title{ color:#ffffff; }
.modal .card-body{
  background-color:#fffdf6;
  padding:1.5rem;
}
.modal .card-title{ font-size:1.15rem; }

.navbar{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 60%,var(--mr-primary-700));
  box-shadow:0 4px 20px rgba(78,12,35,.22);
}
.navbar-brand{
  font-family:'Playfair Display','Georgia',serif;
  font-weight:700;
  font-size:1.3rem;
  color:#ffffff !important;
  letter-spacing:.4px;
}
.navbar .nav-link{
  color:rgba(255,255,255,.82) !important;
  border-radius:999px;
  padding:.5rem .95rem;
  font-weight:500;
  transition:color .2s ease, background-color .2s ease, transform .2s ease;
}
.navbar .nav-link:hover{
  color:#ffffff !important;
  background:rgba(201,164,92,.22);
  transform:translateY(-1px);
}
.navbar .nav-link.active{
  color:#ffffff !important;
  background-image:linear-gradient(135deg,#c9a45c,#a88a3f);
  box-shadow:0 6px 16px rgba(78,12,35,.3);
}
.nav-pills .nav-link.active{ background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600)); color:#ffffff; }
.nav-link.active,.nav-link{ font-family:'Inter',system-ui,sans-serif; }

.dropdown-menu{
  background:#fffdf6;
  border:1px solid rgba(201,164,92,.55);
  border-radius:14px;
  box-shadow:0 16px 40px rgba(36,29,18,.16);
  padding:.45rem;
}
.dropdown-item{
  border-radius:9px;
  color:#2f2a20;
  font-weight:500;
  padding:.55rem .9rem;
}
.dropdown-item:hover,.dropdown-item:focus{
  background:#faf4e6;
  color:var(--mr-primary);
}
.dropdown-item:active{ background:var(--mr-primary); color:#ffffff; }
.dropdown-divider{ border-color:rgba(201,164,92,.4); }

.list-group-item{
  background:#fffdf6;
  border-color:rgba(201,164,92,.4);
  color:#2f2a20;
}
.list-group-item.active{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600));
  border-color:var(--mr-primary);
  color:#ffffff;
}

.table{ color:#2f2a20; }
.table thead th{
  background:#faf4e6;
  color:var(--mr-primary);
  font-size:.75rem;
  text-transform:uppercase;
  letter-spacing:1px;
  border-bottom:2px solid rgba(201,164,92,.6);
}
.table td,.table th{ border-color:rgba(201,164,92,.35); }

.form-label{
  font-size:.72rem;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:1.1px;
  color:#6f6656;
  margin-bottom:.4rem;
}
.form-control,.form-select{
  background-color:#fffdf6;
  border:1px solid rgba(150,120,70,.45);
  border-radius:12px;
  color:#241d12;
  font-family:'Inter',system-ui,sans-serif;
  font-size:.95rem;
  padding:.6rem .9rem;
  transition:border-color .2s ease, box-shadow .2s ease, background-color .2s ease;
}
.form-control:focus,.form-select:focus{
  background-color:#ffffff;
  border-color:#c9a45c;
  box-shadow:0 0 0 3px rgba(201,164,92,.25);
  color:#241d12;
}
.form-control::placeholder{ color:#9c937f; opacity:1; }
.form-control:disabled,.form-control[readonly]{ background-color:#faf4e6; }
.form-select{ background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='https://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%238B1E3F' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3E%3C/svg%3E"); }
.input-group-text{
  background:#faf4e6;
  border:1px solid rgba(150,120,70,.45);
  color:#6f6656;
  border-radius:12px;
  font-weight:500;
}
.form-text{ color:#9c937f; }
.invalid-feedback{ color:#a33120; font-weight:500; }
input.form-control.is-invalid{ border-color:#a33120; }
input.form-control.is-invalid:focus{ box-shadow:0 0 0 3px rgba(163,49,32,.2); }

#lp-mobileDigitsContainer input.form-control,
#lp-registerMobileDigitsContainer input.form-control,
#lp-otpDigitsContainer input.form-control,
#lo-mobileDigitsContainer input.form-control,
#lo-otpDigitsContainer input.form-control{
  border-radius:12px !important;
  font-family:'Inter',system-ui,sans-serif !important;
  font-weight:600 !important;
  letter-spacing:2px;
}
#lp-loginCountryCode.form-select,
#lp-registerCountryCode.form-select,
#lo-loginCountryCode.form-select{
  border-radius:12px !important;
  font-weight:600;
}

#loginPasswordModal .card-header,
#loginPasswordModal .card,
#login-info-modal .modal-content{ border-radius:20px; }
#lp-termsLabel,#lo-acceptTerms + label{
  font-size:.83rem;
  color:#6f6656;
  line-height:1.5;
}
#switchToRegister,#switchToLogin,#lp-resendOtp,#lo-resendOtp{
  border-radius:999px;
  border-color:#c9a45c !important;
  color:var(--mr-primary) !important;
  background:#fffdf6 !important;
}
#switchToRegister:hover,#switchToLogin:hover,#lp-resendOtp:hover,#lo-resendOtp:hover{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600)) !important;
  border-color:var(--mr-primary) !important;
  color:#ffffff !important;
}
#forgotPassword{ font-weight:600; }
#lp-otpTextToggle,#lo-otpTextToggle{
  color:var(--mr-primary);
  font-weight:700;
  border-radius:999px;
}
.blink-text{ color:var(--mr-primary) !important; }

.badge{
  font-weight:600;
  letter-spacing:.5px;
  border-radius:999px;
  padding:.45em .8em;
}
.alert{
  border-radius:14px;
  border:1px solid transparent;
}
.alert-warning{
  background:#f3e7cd;
  border-color:#e6cf9b;
  color:#5c4a18;
}
.alert-info{
  background:rgba(201,164,92,.12);
  border-color:rgba(201,164,92,.4);
  color:#5c3f0e;
}
.alert-success{ background:rgba(46,125,91,.1); border-color:rgba(46,125,91,.35); color:#1f5f44; }

.spinner-border,.spinner-grow{ color:#c9a45c; }
.spinner-border.text-light{ color:#e6cf9b !important; }

#commonPageLoader,
#loader{
  background:rgba(43,22,14,.5);
  backdrop-filter:blur(4px);
}
#dynamic-toast-container > div{
  background:#fffdf6 !important;
  color:#241d12 !important;
  border:1px solid rgba(201,164,92,.6) !important;
  border-left:4px solid #8B1E3F !important;
  border-radius:14px !important;
  box-shadow:0 12px 34px rgba(36,29,18,.22) !important;
  font-family:'Inter',system-ui,sans-serif !important;
}
#login-info-modal .modal-content{ overflow:hidden; }
#login-info-modal .user-info {
  background:#fffdf6;
  border:1px solid rgba(201,164,92,.4);
  border-radius:14px;
  padding:1rem;
}
#login-info-modal .logout-button{
  background-image:linear-gradient(135deg,#a33120,#7a2317);
  color:#ffffff;
  border-radius:999px;
  border:none;
  padding:.5rem 1.1rem;
  font-weight:600;
}

#dyna_dv_1{
  background:#fffdf6;
  border-radius:18px;
  box-shadow:0 24px 60px rgba(78,12,35,.22);
}

.card:not(.modal-content):hover{
  transform:translateY(-3px);
  box-shadow:0 14px 38px rgba(36,29,18,.12);
  border-color:#c9a45c;
}
.card,.btn,.nav-link,.dropdown-menu,.toast{ transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
.btn-primary::after,.btn-outline-primary::after{
  content:"";
  position:absolute;
  inset:0;
  border-radius:999px;
  background:linear-gradient(120deg,rgba(255,255,255,.0) 30%,rgba(255,255,255,.22) 50%,rgba(255,255,255,.0) 70%);
  transform:translateX(-120%);
  transition:transform .7s ease;
  pointer-events:none;
}
.btn-primary:hover::after,.btn-outline-primary:hover::after{ transform:translateX(120%); }

@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{
    animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
  }
}
@media (max-width:576px){
  .modal-content{ border-radius:16px; }
  .modal-body{ padding:1.1rem; }
  .btn{ padding:.5rem 1rem; }
}

:root{
  --primary-color:var(--mr-primary);
  --primary-light:var(--mr-primary-600);
  --primary-dark:var(--mr-primary-700);
  --accent-color:var(--gold);
  --accent-light:var(--gold-pale);
  --accent-dark:var(--gold);
  --white-color:#FFFFFF;
  --text-on-primary:#FFFFFF;
  --background-color:var(--surface);
  --card_bg_color:var(--surface);
  --text-primary:var(--ink);
  --text-secondary:var(--muted);
  --text-dark:var(--ink);
  --light-color:var(--cream);
  --border-color:rgba(36,29,18,.16);
  --mr-border:rgba(36,29,18,.16);
  --mr-primary-050:#F9E9EE;
}
.drawer-menu-item{ font-size:.92rem; transition:background-color .2s ease, transform .2s ease; }
.drawer-menu-item:hover{ background:var(--mr-primary-050) !important; }

#mr-navbar{
  flex-shrink:0;
  position:sticky; top:0; z-index:1030;
  padding:.55rem 1rem;
}
.app-nav{ display:flex; align-items:flex-start; justify-content:space-between; gap:0; }
.container-fluid.app-nav{ padding-left:0; padding-right:0; }
.app-nav__icon{ margin-top:.2rem; }
.app-nav__left{ display:flex; align-items:center; gap:.45rem; flex:1 1 0; min-width:0; }
.app-nav__center{ display:flex; align-items:center; justify-content:center; gap:.45rem; flex:0 0 auto; margin:0 auto; }
.app-nav__right{ display:flex; align-items:center; justify-content:flex-end; gap:.35rem; flex:1 1 0; min-width:0; }
.app-nav__brand{
  background:transparent; border:none;
  padding:.35rem .6rem;
  color:#fffdf6;
  font-family:'Playfair Display','Georgia',serif;
  font-weight:700; font-size:1.12rem; letter-spacing:.4px;
  border-radius:999px; cursor:pointer;
  flex:0 1 auto; min-width:0;
  max-width:70vw;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;
  word-break:break-word;
  line-height:1.15;
}
.app-nav__brand:hover{ background:rgba(201,164,92,.18); color:#ffffff; }
.app-nav__brand-gem{ color:var(--gold); font-size:.95rem; flex:0 0 auto; }
.app-nav__icon{
  position:relative;
  width:42px; height:42px; padding:0 !important; border-radius:50%;
  display:inline-flex; align-items:center; justify-content:center;
  color:#fffdf6 !important; text-decoration:none !important;
  background:rgba(255,255,255,.10);
  border:1px solid rgba(201,164,92,.45);
  flex:0 0 auto;
  transition:background-color .2s ease, border-color .2s ease, transform .2s ease, box-shadow .2s ease;
}
.app-nav__icon:hover{
  background:rgba(201,164,92,.22) !important; color:#ffffff !important;
  border-color:var(--gold); transform:translateY(-1px);
  box-shadow:0 6px 16px rgba(36,29,18,.25);
}
.app-nav__icon:focus-visible{ box-shadow:0 0 0 3px rgba(201,164,92,.45); }

@media (max-width:480px){
  #mr-navbar{ padding:.5rem .6rem; }
  .app-nav{ gap:.4rem; }
  .app-nav__left{ gap:.35rem; }
  .app-nav__icon{ width:38px; height:38px; }
  .app-nav__brand{ font-size:1rem; padding:.3rem .45rem; gap:.4rem; }
}

#main-content{ flex:1 0 auto; min-height:55vh; padding-bottom:4.5rem; }

#mr-footer{
  position:fixed;
  bottom:0; left:0; right:0;
  z-index:1030;
  background-image:linear-gradient(135deg,#2f2a20 0%,#241d12 55%,#17120c 100%);
  border-top:3px solid var(--gold);
  color:rgba(255,253,246,.82);
  text-align:center;
  padding:1.6rem 1rem 1.4rem;
  transition:padding .25s ease;
}
.app-footer--collapsed{}
.app-footer--collapsed .app-footer__toggle{ margin:0; }
#mr-footer .container{ display:flex; flex-direction:column; align-items:center; gap:.25rem; }
.app-footer--expanded .container{ flex-direction:row; align-items:flex-start; gap:1rem; justify-content:center; }
.app-footer__toggle{ flex:0 0 auto; }
.app-footer__details{ flex:1 1 auto; text-align:center; min-width:0; }
.app-footer__details{
  max-height:0;
  overflow:hidden;
  opacity:0;
  transition:max-height .3s ease, opacity .25s ease, margin-top .25s ease;
}
.app-footer--expanded .app-footer__details{
  max-height:260px;
  opacity:1;
  margin-top:.6rem;
}
.app-footer--expanded{ padding:1.2rem 1rem 1rem; }
.app-footer__brand{
  font-family:'Playfair Display','Georgia',serif;
  font-weight:700; font-size:1.15rem; color:var(--gold-light);
  margin-bottom:.6rem; letter-spacing:.3px;
}
.app-footer__links{ display:flex; flex-wrap:wrap; justify-content:center; gap:.5rem; margin-bottom:.7rem; }
.app-footer__links a{
  color:#f3e7cd; font-size:.85rem; font-weight:600;
  border:1px solid rgba(201,164,92,.5); border-radius:999px;
  padding:.3rem .85rem; text-decoration:none;
  transition:background-color .2s ease, color .2s ease, border-color .2s ease;
}
.app-footer__links a:hover{ background:var(--gold); color:#241d12; border-color:var(--gold); }
.app-footer__copy{ margin:0; font-size:.8rem; color:rgba(255,253,246,.6); }
.app-footer__toggle{ display:block; margin:0 auto .6rem; width:2.2rem; height:2.2rem; border-radius:50%; border:1px solid rgba(201,164,92,.5); background:transparent; color:var(--gold-light); font-size:1.1rem; line-height:1; cursor:pointer; transition:transform .2s ease, background .2s ease; }
.app-footer__toggle:hover{ background:rgba(201,164,92,.15); }
.app-footer--collapsed .app-footer__details{ display:none; }
.app-footer--expanded .app-footer__details{ display:block; }

#flash-container{
  position:fixed; inset:0; z-index:20000;
  display:flex; align-items:center; justify-content:center;
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-700));
  transition:opacity .5s ease;
}
.app-flash-img{
  max-width:92vw; max-height:82vh;
  border-radius:18px; object-fit:contain;
  box-shadow:0 24px 60px rgba(0,0,0,.45);
}

  .app-card__create-btn {
    flex-shrink: 0;
    border: 0;
    border-radius: 25px;
    padding: 4px 6px;
    background: #18794e;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
}

.app-container{ padding-top:1.25rem; }

.app-card > .card{
  display:flex; flex-direction:column;
  height:100%;
  max-height:60vh;
  transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}
.app-card > .card:hover{
  transform:translateY(-4px);
  box-shadow:0 18px 44px rgba(78,12,35,.16);
  border-color:var(--gold);
}

.profile-image-container{
  height:78%;
  position:relative;
  aspect-ratio:4 / 5;
  overflow:hidden;
  background:#f3e7cd;
}
.profile-thumbnail{
  width:100%; height:100%;
  object-fit:cover; object-position:center top;
  display:block;
  transition:transform .35s ease;
}
.profile-card:hover .profile-thumbnail{ transform:scale(1.045); }
.profile-overlay{
  position:absolute; inset:0;
  background:linear-gradient(180deg,rgba(36,29,18,0) 55%,rgba(36,29,18,.35) 100%);
  pointer-events:none;
}

.app-card__premium,
.app-card__verified{
  position:absolute; z-index:2;
  display:inline-flex; align-items:center; gap:.35rem;
  font-size:.7rem; font-weight:700; letter-spacing:.6px;
  text-transform:uppercase;
  padding:.32em .7em; border-radius:999px;
  box-shadow:0 4px 12px rgba(0,0,0,.25);
}
.app-card__premium{
  top:.6rem; left:.6rem;
  background:linear-gradient(135deg,var(--gold-light),var(--gold));
  color:#241d12;
}
.app-card__verified{
  top:.6rem; right:.6rem;
  background:linear-gradient(135deg,#2e7d5b,#1f5f44);
  color:#ffffff;
}

.app-card__body{
  display:flex; flex-direction:column; gap:.4rem;
  padding:.95rem 1rem 1.1rem;
  flex:1 1 auto;
  min-height:0;
}
.app-card__title{
  display:flex; align-items:baseline; gap:.5rem;
  min-width:0;
}
.app-card__name{
  margin:0;
  font-size:1.2rem; line-height:1.25;
  color:#2f2a20;
  flex:0 1 auto; min-width:0;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.app-card__meta{
  display:flex; flex-wrap:wrap; gap:.35rem .85rem;
  font-size:.85rem; font-weight:600; color:var(--muted);
}
.app-card__meta-item{ display:inline-flex; align-items:center; gap:.35rem; }
.app-card__meta-item i{ color:var(--mr-primary); font-size:.78rem; }
.app-card__meta-item--tree{ align-items:flex-start; }
.app-card__tree{ display:inline-flex; flex-direction:column; line-height:1.25; min-width:0; }
.app-card__tree-node{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.app-card__tree-node.lv0{ color:#8B1E3F; font-weight:700; }
.app-card__tree-node.lv1{ color:#6E1733; font-size:.78rem; padding-left:12px; }
.app-card__tree-node.lv2{ color:#6b6355; font-size:.74rem; padding-left:24px; }
.app-card__tree-node.lv1::before,.app-card__tree-node.lv2::before{ content:"⤵ "; color:#c9a45c; font-size:.65rem; }

.app-card__religion{ display:flex; flex-direction:column; gap:.25rem; margin:.35rem 0; }
.app-card__religion-head{ display:inline-flex; align-items:center; gap:.35rem; font-weight:700; color:#8B1E3F; font-size:.9rem; }
.app-card__religion-head i{ color:var(--mr-primary); font-size:.78rem; }
.app-card__meta-inline{
  display:flex; flex-wrap:nowrap; align-items:center; gap:.6rem;
  font-size:.85rem; font-weight:600; color:var(--muted);
  overflow:hidden; white-space:nowrap; text-overflow:ellipsis;
}
.app-card__meta-inline .app-card__meta-item{ display:inline-flex; align-items:center; gap:.3rem; flex:0 0 auto; min-width:0; white-space:nowrap; }
.app-card--new .app-card__meta-inline{ flex-wrap:nowrap; overflow:visible; }
.app-card--new .app-card__row{ align-items:flex-start; }
.app-card--new .app-card__row-right{ margin-top:-.35rem; margin-right:-.25rem; }
.app-card__meta-inline .app-card__meta-item i{ color:var(--mr-primary); font-size:.78rem; }
.app-card__caste{ flex:0 0 auto; white-space:nowrap; color:var(--muted); font-weight:600; }
.app-card__religion-sub{ font-size:.78rem; color:#6b6355; padding-left:1.35rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.app-card__degree{
  display:flex; align-items:flex-start; justify-content:space-between; gap:.6rem;
  margin:.35rem 0 .5rem;
}
.app-card__degree-text{
  display:flex; align-items:flex-start; gap:.35rem;
  font-size:.85rem; font-weight:600; color:var(--muted);
  line-height:1.35;
  flex:1 1 auto; min-width:0;
}
.app-card__degree-text i{ color:var(--mr-primary); font-size:.78rem; margin-top:.2rem; flex:0 0 auto; }
.app-card__degree-badge{
  flex:0 0 auto;
  width:2.1rem; height:2.1rem; border-radius:50%;
  display:inline-flex; align-items:center; justify-content:center;
  background:linear-gradient(135deg,var(--gold-light),var(--gold));
  color:#241d12; font-size:.85rem; font-weight:700;
  box-shadow:0 2px 6px rgba(0,0,0,.18);
}
.app-card__actions{ display:flex; justify-content:flex-end; margin-top:auto; padding-top:.6rem; }
.app-card__view-badge{
  width:2.6rem; height:2.6rem; border-radius:50%;
  display:inline-flex; align-items:center; justify-content:center;
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  color:#ffffff; border:none; cursor:pointer;
  font-size:.9rem;
  box-shadow:0 8px 20px rgba(78,12,35,.24);
  transition:transform .18s ease, box-shadow .18s ease, background-image .18s ease, color .18s ease;
}
.app-card__view-badge:hover{
  transform:translateY(-2px) scale(1.06);
  box-shadow:0 10px 26px rgba(78,12,35,.32);
  background-image:linear-gradient(135deg,#7a2317,#5c1a12 55%,#430f13);
  color:#ffffff;
}
.app-card__view-badge--unlocked{
  background-image:linear-gradient(135deg,#2e7d5b,#1f7a4d 55%,#155f3c) !important;
  color:#ffffff;
  box-shadow:0 8px 20px rgba(31,122,77,.28);
}
.app-card__view-badge--unlocked:hover{
  background-image:linear-gradient(135deg,#256a4c,#1a6a45 55%,#114f31) !important;
  box-shadow:0 10px 26px rgba(31,122,77,.36);
}
.app-card__degree--solo{ justify-content:flex-end; }
.app-card__row{ display:flex; align-items:center; justify-content:space-between; gap:1rem; margin:.35rem 0; }
.app-card__row-left{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:.35rem; }
.app-card__row-right{ flex:0 0 auto; display:flex; align-items:center; }
.app-card__degree-text{ display:block; font-size:.85rem; font-weight:600; color:var(--muted); line-height:1.35; }
.app-card__degree-text i{ color:var(--mr-primary); font-size:.78rem; margin-right:.35rem; }
.app-card__role{
  display:flex; align-items:center; gap:.4rem;
  font-size:.85rem; font-weight:600; color:#5c4a18;
  background:rgba(201,164,92,.14);
  border:1px solid rgba(201,164,92,.4);
  border-radius:999px;
  padding:.25rem .7rem;
  width:fit-content; max-width:100%;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.app-card__role i{ color:var(--gold); font-size:.75rem; flex:0 0 auto; }

.app-detail-main{
  margin-left:auto;
  max-width:55%;
  font-size:.88rem; font-weight:600; color:var(--muted);
  text-align:right;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}

.app-card__id{
  position:absolute; top:.6rem; right:.6rem; z-index:2;
  display:inline-flex; align-items:center; gap:.35rem;
  font-size:.7rem; font-weight:700; letter-spacing:.6px;
  text-transform:uppercase;
  padding:.32em .7em; border-radius:999px;
  background:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  color:#ffffff;
  border:1px solid rgba(255,255,255,.35);
  box-shadow:0 4px 12px rgba(0,0,0,.35);
  max-width:60%;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.app-card__id i{ font-size:.65rem; color:#ffffff; flex:0 0 auto; }

.app-card__actions{ margin-top:auto; padding-top:.75rem; }
.app-btn-primary{
  display:inline-flex; align-items:center; justify-content:center; gap:.45rem;
  width:100%;
  font-family:'Inter',system-ui,sans-serif;
  font-weight:600; font-size:.88rem; letter-spacing:.3px;
  color:#ffffff;
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  border:1px solid transparent; border-radius:999px;
  padding:.55rem 1rem;
  cursor:pointer;
  box-shadow:0 8px 20px rgba(78,12,35,.24);
  transition:transform .18s ease, box-shadow .18s ease, background-color .18s ease;
}
.app-btn-primary:hover{
  transform:translateY(-1px);
  box-shadow:0 10px 26px rgba(78,12,35,.32);
  background-image:linear-gradient(135deg,#7a2317,#5c1a12 55%,#430f13);
}
.app-btn-primary:active{ transform:translateY(0) scale(.985); }

.app-card__input{
  min-width:0; flex:1 1 6rem; max-width:100%;
  font-size:.85rem; font-weight:600; color:#2f2a20;
  background:#fffdf6;
  border:1px solid rgba(139,30,63,.35); border-radius:.5rem;
  padding:.2rem .5rem;
}
.app-card__input:focus{
  border-color:var(--mr-primary);
  box-shadow:0 0 0 .15rem rgba(139,30,63,.15);
  outline:none;
}

.app-card--new{ cursor:pointer; }
.app-card--new .app-card__title{ flex-wrap:wrap; align-items:center; }
.app-card--new .app-card__input,
.app-card--new .app-card__select{
  pointer-events:none;
  background:transparent; border:0; border-radius:0;
  padding:0; margin:0;
  height:auto; line-height:1.4;
  font:inherit;
  color:var(--muted);
  appearance:none; -webkit-appearance:none;
  flex:0 1 auto;
  max-width:100%;
}
.app-card--new .app-card__input:focus,
.app-card--new .app-card__select:focus{ border:0; box-shadow:none; outline:none; }
.app-card--new .app-card__input::placeholder{ color:var(--muted); opacity:1; }
.app-card--new .app-card__name{ flex:1 1 0; min-width:0; }
.app-card--new .app-detail-main{ flex:0 0 auto; }
.app-card--new .app-card__input--name{
  font-size:1.2rem; font-weight:700; color:#2f2a20;
  width:100%; border:0; background:transparent; padding:0;
}
@media (max-width:576px){ .app-card--new .app-card__input--name{ font-size:1.12rem; } }

.app-card--new .app-card__meta .app-card__input,
.app-card--new .app-card__meta .app-card__select{ max-width:none; flex:0 0 auto; }
.app-card--new select[data-mrfield="k"]{ width:8ch; }
.app-card--new input[data-mrfield="g"]{ width:4ch; }
.app-card--new input[data-mrfield="h"]{ width:6ch; }
.app-card--new select[data-mrfield="s"]{ width:auto; flex:0 0 auto; }
.app-card--new .app-card__degree-text{ display:flex; align-items:center; gap:.35rem; min-width:0; }
.app-card--new .app-card__degree-text i{ margin-top:0; }
.app-card--new .app-btn-primary{ width:auto; padding:.45rem .9rem; font-size:.78rem; white-space:nowrap; }
.app-card--new .app-card__meta-inline{ margin:.35rem 0; }
.app-card--new .app-card__row{ margin:.1rem 0 0; }
.app-card--new select[data-mrfield="j"]{ width:7ch; max-width:none; }
.app-card__select{
  min-width:0; max-width:48%;
  font-size:.85rem; font-weight:600; color:#2f2a20;
  background:#fffdf6;
  border:1px solid rgba(139,30,63,.35); border-radius:.5rem;
  padding:.2rem .5rem;
  cursor:pointer;
  transition:border-color .18s ease, box-shadow .18s ease;
}
.app-card__select:focus{
  border-color:var(--mr-primary);
  box-shadow:0 0 0 .15rem rgba(139,30,63,.15);
  outline:none;
}

.app-card--new .profile-image-container{ border-radius:18px 18px 0 0; }

.app-btn-save{
  background-image:linear-gradient(135deg,#2e7d5b,#1f7a4d 55%,#155f3c);
  box-shadow:0 8px 20px rgba(31,122,77,.28);
}
.app-btn-save:hover{
  background-image:linear-gradient(135deg,#256a4c,#1a6a45 55%,#114f31);
  box-shadow:0 10px 26px rgba(31,122,77,.36);
}

.profile-image-container--empty{
  display:flex; align-items:center; justify-content:center;
}
.profile-image-container--empty > i{
  font-size:3.2rem; color:rgba(139,30,63,.3);
}

.app-state{
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:.6rem; text-align:center;
  padding:4rem 1rem;
}
.app-state__icon{
  font-size:2.6rem; color:var(--gold);
  background:rgba(201,164,92,.14);
  border:1px solid rgba(201,164,92,.4);
  border-radius:50%;
  width:84px; height:84px;
  display:flex; align-items:center; justify-content:center;
}
.app-state__title{
  font-family:'Playfair Display','Georgia',serif;
  font-weight:700; font-size:1.3rem; color:#2f2a20;
}
.app-state__text{ max-width:420px; color:var(--muted); margin:0; }
.app-state__spinner{ width:2.4rem; height:2.4rem; color:var(--mr-primary); }

@media (max-width:576px){
  .app-card__name{ font-size:1.12rem; }
  .app-state{ padding:3rem 1rem; }
}

#profiles-container{
  overflow-y:auto;
}

.skeleton{
  background:linear-gradient(90deg,rgba(139,30,63,0.16) 25%,rgba(139,30,63,0.42) 50%,rgba(139,30,63,0.16) 75%);
  background-size:200% 100%;
  animation:skeleton-shimmer 1.4s ease-in-out infinite;
  border-radius:8px;
}
@keyframes skeleton-shimmer{
  0%{ background-position:200% 0; }
  100%{ background-position:-200% 0; }
}
/* ============================================================
   SKELETON LOADER — responsive, fluid, DARKER placeholders
   ============================================================ */

.skeleton-loader{
  display:flex;
  flex-direction:column;
  gap:clamp(.5rem, 1.2vw, .75rem);
  padding:clamp(1rem, 3vw, 1.5rem) 0;
}

.skeleton-row{
  display:flex;
  gap:clamp(.6rem, 1.5vw, .85rem);
  align-items:flex-start;
}

.skeleton-avatar{
  width:clamp(56px, 9vw, 72px);
  height:clamp(70px, 11vw, 90px);
  border-radius:clamp(10px, 1.6vw, 14px);
  flex:0 0 auto;
}

.skeleton-line{
  height:clamp(.9rem, 1.6vw, 1.1rem);
  border-radius:6px;
  margin-bottom:clamp(.25rem, .7vw, .35rem);
}
.skeleton-line.short{ width:55%; }
.skeleton-line.skeleton-title{
  width:62%;
  height:clamp(1.05rem, 1.9vw, 1.25rem);
}

.skeleton-cards{
  display:grid;
  grid-template-columns:1fr;
  gap:clamp(.6rem, 1.4vw, 1rem);
  width:100%;
  max-width:980px;
  margin:0 auto;
  padding-inline:clamp(.5rem, 2vw, 0);
}

.skeleton-card{
  display:flex;
  flex-direction:column;
  gap:clamp(.5rem, 1.2vw, .75rem);
  background:transparent;
  min-width:0;
}

.skeleton-avatar--lg{
  width:100%;
  aspect-ratio:4/5;
  border-radius:clamp(14px, 2vw, 18px) clamp(14px, 2vw, 18px) 0 0;
}

.skeleton-title--lg{
  height:clamp(1.15rem, 2vw, 1.35rem);
  width:55%;
}
.skeleton-meta--lg{
  height:clamp(.85rem, 1.5vw, 1rem);
  width:70%;
}
.skeleton-meta--lg.short{ width:45%; }

/* ============================================================
   BREAKPOINTS
   ============================================================ */

@media (min-width:577px){
  .skeleton-cards{
    grid-template-columns:repeat(2, minmax(0,1fr));
    gap:clamp(.75rem, 1.6vw, 1rem);
  }
}
@media (min-width:768px){
  .skeleton-cards{
    grid-template-columns:repeat(3, minmax(0,1fr));
    gap:clamp(.85rem, 1.8vw, 1rem);
  }
}
@media (min-width:992px){
  .skeleton-cards{
    grid-template-columns:repeat(4, minmax(0,1fr));
    gap:clamp(.9rem, 1.6vw, 1rem);
  }
}

/* ============================================================
   DARKER PLACEHOLDER FILL + SHIMMER
   (base ink darkened: rgba(36,29,18, …) → rgba(20,14,8, …))
   ============================================================ */

.skeleton-avatar,
.skeleton-line,
.skeleton-avatar--lg,
.skeleton-title--lg,
.skeleton-meta--lg{
  background:linear-gradient(
    90deg,
    rgba(20,14,8,.16) 25%,
    rgba(20,14,8,.26) 37%,
    rgba(20,14,8,.16) 63%
  );
  background-size:400% 100%;
  animation:skeleton-shimmer 1.4s ease infinite;
}

@keyframes skeleton-shimmer{
  0%{ background-position:100% 0; }
  100%{ background-position:0 0; }
}

@media (prefers-reduced-motion: reduce){
  .skeleton-avatar,
  .skeleton-line,
  .skeleton-avatar--lg,
  .skeleton-title--lg,
  .skeleton-meta--lg{
    animation:none;
    background:rgba(20,14,8,.20);   /* solid, dark, no motion */
  }
}
`;

(function () {
 var SEL = '.rg-overlay, .mrd-viewer, .ht-modal-overlay, .mrp-overlay';
 var SEL_OBS = SEL + ', #drawerBackdrop, #mobileDrawer';
 var lockedByUs = false;
 var unlockTimer = null;
 var savedScrollY = 0;
 function hasOverlay() {
  try { if (document.querySelector(SEL)) return true; } catch (e) { }
  var db = document.getElementById('drawerBackdrop');
  return !!(db && db.offsetWidth > 0);
 }
 function lockBody() {
  if (lockedByUs) return;
  savedScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  var b = document.body.style;
  b.position = 'fixed';
  b.top = (-savedScrollY) + 'px';
  b.left = '0';
  b.right = '0';
  b.width = '100%';
 }
 function unlockBody() {
  var y = savedScrollY;
  savedScrollY = 0;
  var b = document.body.style;
  b.position = '';
  b.top = '';
  b.left = '';
  b.right = '';
  b.width = '';
  if (!y) return;
  var de = document.documentElement;
  var prev = de.style.scrollBehavior;
  de.style.scrollBehavior = 'auto';
  window.scrollTo(0, y);
  if (prev) de.style.scrollBehavior = prev; else de.style.removeProperty('scroll-behavior');
 }
 function syncLock() {
  if (!document.body) return;
  if (hasOverlay()) {
   if (unlockTimer) { clearTimeout(unlockTimer); unlockTimer = null; }
   lockBody();
   lockedByUs = true;
  } else if (lockedByUs && !unlockTimer) {
   unlockTimer = setTimeout(function () {
    unlockTimer = null;
    if (!hasOverlay() && lockedByUs) {
     lockedByUs = false;
     unlockBody();
    }
   }, 80);
  }
 }
 function scheduleSync() {
  if (window.__mrScrollLockScheduled) return;
  window.__mrScrollLockScheduled = true;
  (typeof requestAnimationFrame === 'function' ? requestAnimationFrame : setTimeout)(function () {
   window.__mrScrollLockScheduled = false;
   syncLock();
  }, 16);
 }
 if (typeof MutationObserver === 'undefined') return;
 var startObserving = function () {
  if (!document.body) return;
  new MutationObserver(function (muts) {
   var relevant = false;
   for (var i = 0; i < muts.length; i++) {
    var m = muts[i];
    if (m.type === 'childList') { relevant = true; break; }
    if (m.type === 'attributes' && m.target && m.target.matches &&
     typeof m.target.matches === 'function' && m.target.matches(SEL_OBS)) {
     relevant = true;
     break;
    }
   }
   if (relevant) scheduleSync();
  }).observe(document.body, {
   childList: true,
   subtree: true,
   attributes: true,
   attributeFilter: ['style', 'class']
  });
  syncLock();
 };
 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startObserving, { once: true });
 } else {
  startObserving();
 }
})();