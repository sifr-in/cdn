const tblsRequired = ["f","fp"];
const moduLst = [
 { a: ",104,", b: "Publish Visiting Card App Website", c: "fa-chart-line", d: "save", e: "#0d6efd" },
];
window[my1uzr.worknOnPg].moduLst = moduLst;
moduLst.hook = "onModuLstAllowed";
const inTbls = ["dontCret~", "pubilc~", "104~"];
const cust_const = [];
// [{ "a": "paymentGatewayIntegrated", "b": 0, "c": "more customiztaion", "d": "if value is 1 payment gatewy will be shown, else manual booking", "u": "url-explaining-video" },...];
window[my1uzr.worknOnPg].onModuLstAllowed = function (allowedModules) {
 window[my1uzr.worknOnPg].allowedModulesMenuItems = allowedModules || [];
};

window[my1uzr.worknOnPg].csh = [
 {
  a: 1,
  u: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
 },
 {
  a: 2,
  u: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
 },
 {
  a: 3,
  u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fbf62ad/cmn/my1lp.js",
  c: "open_shoLgnP",
  r: "open_shoLgnP"
 },
 {
  "a": 4,
  "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b7740c3/cmn/my1ctr.js",
  "c": "open_my1ctr",
  "r": "open_my1ctr"
 },
  { a: 5, u: "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
  {
  a: 6,
  u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/my1xi.min.js",
  },
     {
    a: 7,
    u: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",
   },
];
(async function () {
  'use strict';

  var DATA_URL = 'vc.da';
  var DESIGN_CSS_BASE = 'https://cdn.jsdelivr.net/gh/sifr-in/cdn@fba9a74/vc/';
     let result1 = await loadCshScriptsSequentially(1, 2, 5, 6, 7);
  if (!result1.success)
   throw new Error("Failed to load required scripts: " + result1.error);

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

  function esc(v) {
    if (v == null || v === '') return '';
    var d = document.createElement('div');
    d.textContent = String(v);
    return d.innerHTML;
  }

  function firstNonEmpty() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (v != null && String(v).trim() !== '') return v;
    }
    return '';
  }

  function hasVal(v) {
    return v != null && String(v).trim() !== '';
  }

  function shade(hex, mixWhite) {
    hex = String(hex || '').replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return '#1B2A4A';
    var r = parseInt(hex.substr(0, 2), 16);
    var g = parseInt(hex.substr(2, 2), 16);
    var b = parseInt(hex.substr(4, 2), 16);
    r = Math.round(r + (255 - r) * mixWhite);
    g = Math.round(g + (255 - g) * mixWhite);
    b = Math.round(b + (255 - b) * mixWhite);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  var ICONS = {
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 448 512" aria-hidden="true"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>',
    email: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.3 1L8 8.6 13.7 5H2.3z"/></svg>',
    globe: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 8h13M8 1.5c1.5 1.5 2.5 3.9 2.5 6.5S9.5 13 8 14.5C6.5 13 5.5 10.6 5.5 8S6.5 3 8 1.5z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    pin: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 16s6-5.07 6-10a6 6 0 1 0-12 0c0 4.93 6 10 6 10zm0-8.5A2.5 2.5 0 1 1 8 5a2.5 2.5 0 0 1 0 2.5z"/></svg>',
    clock: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.75" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 5v3.3l2.2 1.3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    save: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>',
    share: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zM8 8h3.8v2.2h.1c.5-1 1.8-2.2 3.9-2.2 4.2 0 5 2.8 5 6.4V24h-4V15.5c0-1.5 0-3.5-2.1-3.5s-2.5 1.7-2.5 3.5V24H8V8z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 14.17V9.83L14.05 12l-4.5 2.17z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.2 8.8 2.2 12 2.2zm0 1.8c-3.16 0-3.52.01-4.76.07-1.06.05-1.63.22-2.02.37a3.4 3.4 0 0 0-1.24.8 3.4 3.4 0 0 0-.8 1.24c-.15.39-.32.96-.37 2.02C2.8 8.48 2.8 8.84 2.8 12s.01 3.52.07 4.76c.05 1.06.22 1.63.37 2.02.17.49.4.84.8 1.24.4.4.75.63 1.24.8.39.15.96.32 2.02.37 1.24.06 1.6.07 4.76.07s3.52-.01 4.76-.07c1.06-.05 1.63-.22 2.02-.37.49-.17.84-.4 1.24-.8.4-.4.63-.75.8-1.24.15-.39.32-.96.37-2.02.06-1.24.07-1.6.07-4.76s-.01-3.52-.07-4.76c-.05-1.06-.22-1.63-.37-2.02-.17-.49-.4-.84-.8-1.24-.4-.4-.75-.63-1.24-.8-.39-.15-.96-.32-2.02-.37C15.52 4 15.16 4 12 4zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88zm0 8.14a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.3-8.34a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 1.15h3.68l-8.04 9.19L24 23.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 20.4h2.04L6.49 3.24h-2.19L17.61 21.55z"/></svg>',
    card: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm2-.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM7 12.5h7a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5zM1.5 4.5H5A1.5 1.5 0 0 1 6.5 6v1A1.5 1.5 0 0 1 5 8.5H1.5A1.5 1.5 0 0 1 0 7V6A1.5 1.5 0 0 1 1.5 4.5z"/></svg>',
    chl: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chr: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5v11M2.5 8h11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    minus: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8h11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    x: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 15.6 12 3.61 3.61 0 0 1 12 15.6z"/></svg>',
    person: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 8a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 1.5c-2.5 0-5 1.25-5 3.75V15h10v-1.75c0-2.5-2.5-3.75-5-3.75z"/></svg>'
  };

  function icon(name) {
    return ICONS[name] || ICONS.card;
  }

  appcss = ':root{--c:#1B2A4A;--c2:#2F4B8F;--ink:#1f2937;--muted:#6b7280;--line:#e5e7eb;--bg1:#eef2f7;--bgTop:#2F4B8F;--bgBot:#1B2A4A;--cw:560px;--cs:0 24px 60px rgba(15,23,42,.22),0 2px 8px rgba(15,23,42,.08);--rd:18px;--fs:15px;--chipBg:#eef2fb;--chipBd:#dfe6f5;--ard:12px;--gap:18px}*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}html,body{width:100%}body{min-height:100dvh;font-family:Segoe UI,Roboto,Arial,sans-serif;display:flex;align-items:flex-start;justify-content:center;padding:12px 10px 24px;background:var(--bg1);-webkit-font-smoothing:antialiased}body.vc-theme{background:radial-gradient(1200px 600px at -10% -10%,var(--bgTop) 0%,transparent 60%),radial-gradient(1000px 500px at 110% 110%,var(--bgBot) 0%,transparent 55%),var(--bg1)}#vc-root{width:100%;display:flex;justify-content:center}.vc-card{width:100%;max-width:var(--cw,560px);background:#fff;border-radius:var(--rd,18px);box-shadow:var(--cs,0 24px 60px rgba(15,23,42,.22),0 2px 8px rgba(15,23,42,.08));overflow:hidden;position:relative;animation:vcFlipIn .9s cubic-bezier(.2,.86,.3,1.05) both;transform-style:preserve-3d;font-size:var(--fs,15px)}@keyframes vcFlipIn{0%{opacity:0;transform:perspective(1200px) rotateX(55deg) translateY(60px) scale(.9)}60%{opacity:1}100%{opacity:1;transform:perspective(1200px) rotateX(0) translateY(0) scale(1)}}@keyframes vcFadeUp{0%{opacity:0;transform:translateY(18px)}100%{opacity:1;transform:translateY(0)}}@keyframes vcZoomIn{0%{opacity:0;transform:scale(.6)}100%{opacity:1;transform:scale(1)}}@keyframes vcSlideInL{0%{opacity:0;transform:translateX(-40px)}100%{opacity:1;transform:translateX(0)}}@keyframes vcSlideInR{0%{opacity:0;transform:translateX(40px)}100%{opacity:1;transform:translateX(0)}}@keyframes vcRotateIn{0%{opacity:0;transform:rotate(-8deg) scale(.8)}100%{opacity:1;transform:rotate(0) scale(1)}}@keyframes vcDrop{0%{opacity:0;transform:translateY(-30px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes vcBlur{0%{opacity:0;filter:blur(10px)}100%{opacity:1;filter:blur(0)}}.vc-cover{position:relative;height:clamp(150px,28vw,230px);overflow:hidden;background:linear-gradient(135deg,var(--c2),var(--c))}.vc-cover img{width:100%;height:100%;object-fit:cover;display:block;position:absolute;inset:0}.vc-cover .vc-cover-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,12,28,.05),rgba(7,12,28,.55))}.vc-cover::after{content:"";position:absolute;top:0;left:-80%;width:50%;height:100%;background:linear-gradient(105deg,transparent 0,rgba(255,255,255,.35) 50%,transparent 100%);animation:vcShine 1.4s ease .7s}@keyframes vcShine{from{left:-80%}to{left:130%}}.vc-editbtn{position:absolute;top:12px;right:12px;z-index:3;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(15,23,42,.35);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(3px);transition:.15s ease}.vc-editbtn svg{width:18px;height:18px;fill:#fff;display:block}.vc-editbtn:hover{background:var(--c);transform:translateY(-1px)}.vc-logo-wrap{margin-top:clamp(-56px,-11vw,-42px);padding:0 clamp(16px,5vw,26px);position:relative;z-index:2;display:flex;align-items:flex-end;gap:14px}.vc-logo{width:clamp(84px,22vw,104px);height:clamp(84px,22vw,104px);border-radius:50%;border:4px solid #fff;background:linear-gradient(135deg,var(--c2),var(--c));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:clamp(26px,7vw,34px);letter-spacing:1px;box-shadow:0 10px 24px rgba(15,23,42,.25);overflow:hidden;flex:none;animation:vcPop .6s ease .35s both}.vc-logo img{width:100%;height:100%;object-fit:cover}@keyframes vcPop{0%{opacity:0;transform:scale(.4)}100%{opacity:1;transform:scale(1)}}.vc-headline{padding:clamp(10px,3vw,16px) clamp(16px,5vw,26px) 0}.vc-name{font-size:clamp(21px,6.5vw,28px);font-weight:800;color:var(--ink);line-height:1.15}.vc-legal{font-size:12.5px;color:var(--muted);margin-top:2px}.vc-owner{display:flex;align-items:center;gap:6px;color:var(--c);font-weight:600;font-size:13px;margin-top:6px}.vc-owner svg{width:14px;height:14px;fill:var(--c);flex:none}.vc-owner span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vc-tagline{color:var(--c);font-weight:600;font-size:clamp(13px,3.8vw,15px);margin-top:7px}.vc-slogan{color:var(--muted);font-size:12.5px;margin-top:2px;font-style:italic}.vc-badges{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.vc-badge{font-size:11px;font-weight:700;color:var(--c);background:var(--chipBg,#eef2fb);border:1px solid var(--chipBd,#dfe6f5);padding:4px 10px;border-radius:999px}.vc-body{padding:6px clamp(16px,5vw,26px) clamp(18px,5vw,26px)}.vc-sec{animation:vcFadeUp .6s ease both;animation-delay:var(--d,0s);margin-top:var(--gap,18px)}.vc-sec-title{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--muted);margin-bottom:10px}.vc-sec-title .vc-sdot{width:8px;height:8px;border-radius:50%;background:var(--c);flex:none}.vc-desc{color:#374151;font-size:clamp(13px,3.9vw,14.5px);line-height:1.65}.vc-actions{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:14px}.vc-action{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:10px 6px;border-radius:var(--ard,12px);text-decoration:none;color:var(--c);background:var(--chipBg,#eef2fb);border:1px solid var(--chipBd,#dfe6f5);box-shadow:inset 0 0 0 0 rgba(0,0,0,0);transition:transform .15s ease,box-shadow .15s ease;font-size:11.5px;font-weight:700;text-align:center}.vc-action svg{width:22px;height:22px;fill:currentColor;display:block;flex:none}.vc-action:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(27,42,74,.16)}.vc-action.primary{background:var(--c);color:#fff;border-color:var(--c)}.vc-list{display:flex;flex-direction:column;gap:9px}.vc-li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:#374151;line-height:1.55}.vc-li svg{width:17px;height:17px;fill:var(--c);flex:none;margin-top:1px}.vc-li a{color:#2563eb;text-decoration:none;word-break:break-all}.vc-li .vc-lbl{font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.4px;display:block}.vc-tags{display:flex;flex-wrap:wrap;gap:7px}.vc-tag{font-size:12px;font-weight:600;color:var(--c);background:var(--chipBg,#eef2fb);border:1px solid var(--chipBd,#dfe6f5);padding:5px 11px;border-radius:999px}.vc-hrs{width:100%;border-collapse:collapse;font-size:13px}.vc-hrs td{padding:6px 2px;border-bottom:1px dashed var(--line);color:#374151}.vc-hrs td:last-child{text-align:right}.vc-hrs .closed{color:#b91c1c;font-weight:700}.vc-hrs .today{color:var(--c);font-weight:800}.vc-hrwrap{position:relative;overflow:hidden;border:1px solid var(--chipBd,#dfe6f5);border-radius:12px;padding:12px 14px;background:var(--chipBg,#eef2fb)}.vc-hrwrap .vc-hricon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:120px;height:120px;color:var(--c);opacity:.09;pointer-events:none}.vc-hrwrap .vc-hricon svg{width:100%;height:100%;fill:currentColor;stroke:currentColor}.vc-hrwrap .vc-hrs{position:relative;z-index:1}.vc-kv{display:grid;grid-template-columns:1fr 1fr;gap:10px}.vc-kv>div{background:#f8fafc;border:1px solid var(--line);border-radius:12px;padding:10px 12px}.vc-kv .k{font-size:10.5px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);font-weight:700}.vc-kv .v{font-size:13px;font-weight:700;color:var(--ink);margin-top:3px;word-break:break-all}.vc-social{display:flex;gap:10px;flex-wrap:wrap}.vc-soc{width:42px;height:42px;border-radius:var(--ard,12px);background:var(--chipBg,#eef2fb);border:1px solid var(--chipBd,#dfe6f5);display:flex;align-items:center;justify-content:center;color:var(--c);transition:.15s ease}.vc-soc svg{width:19px;height:19px;fill:currentColor}.vc-soc:hover{background:var(--c);color:#fff;transform:translateY(-2px)}.vc-foot{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px;animation:vcFadeUp .6s ease both;animation-delay:var(--d,0s)}.vc-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:13px;border-radius:12px;border:none;cursor:pointer;font-size:13.5px;font-weight:800;color:#fff;background:linear-gradient(135deg,var(--c2),var(--c));transition:.15s ease}.vc-btn svg{width:17px;height:17px;fill:#fff;display:block}.vc-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}.vc-btn.ghost{background:#fff;color:var(--c);border:1.5px solid var(--c)}.vc-btn.ghost svg{fill:var(--c)}.vc-map{margin-top:8px;border:1px solid var(--chipBd,#dfe6f5);border-radius:12px;overflow:hidden;background:var(--chipBg,#eef2fb)}.vc-map iframe{display:block;width:100%;height:180px;border:0;filter:saturate(.95)}.vc-mapopen{display:block;padding:7px 10px;font-size:12px;font-weight:700;text-decoration:none;color:var(--c);background:var(--chipBg,#eef2fb);border-top:1px solid var(--chipBd,#dfe6f5)}.vc-mapopen:hover{filter:brightness(.97)}.vc-map.vc-multimap{height:auto}.vc-map.vc-multimap .vc-mm{height:260px;line-height:0}.vc-mapall{display:block;padding:7px 10px;font-size:12px;font-weight:700;text-decoration:none;color:var(--c);background:var(--chipBg,#eef2fb);border-top:1px solid var(--chipBd,#dfe6f5)}.vc-mapall:hover{filter:brightness(.97)}.vc-mlog{background:#fff;border:2px solid var(--c,#1B2A4A);border-radius:50%;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center}.vc-mlog img{width:100%;height:100%;object-fit:cover;display:block}.vc-map .vc-mm-sm{height:180px;line-height:0}body.vc-scroll .vc-sec{animation:none!important}body.vc-scroll .vc-foot{animation:none!important}.vc-lz{opacity:0;transition:opacity .55s ease}.vc-lz.loaded{opacity:1}.vc-g-item img.vc-lz{transition:transform .3s ease,opacity .55s ease}.vc-wa{position:fixed;right:18px;bottom:18px;width:clamp(52px,13vw,60px);height:clamp(52px,13vw,60px);border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 8px 20px rgba(37,211,102,.45);animation:vcWa 2s infinite;z-index:5}.vc-wa svg{width:55%;height:55%;fill:#fff}@keyframes vcWa{0%{box-shadow:0 0 0 0 rgba(37,211,102,.45)}70%{box-shadow:0 0 0 16px rgba(37,211,102,0)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}}.vc-gallery{overflow:hidden;border-radius:14px;border:1px solid var(--chipBd,#dfe6f5);-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);height:var(--galH,160px)}.vc-g-track{display:flex;gap:10px;width:max-content;height:100%;will-change:transform;animation:vcSlide var(--dur,20s) linear infinite;padding:4px 0}.vc-gallery:hover .vc-g-track,.vc-gallery:active .vc-g-track{animation-play-state:paused}@keyframes vcSlide{from{transform:translateX(0)}to{transform:translateX(-50%)}}.vc-g-item{flex:0 0 calc(25% - 8px);height:100%;position:relative;border:0;padding:0;cursor:zoom-in;border-radius:12px;overflow:hidden;display:block;background:#0f172a;box-shadow:0 4px 12px rgba(15,23,42,.15)}.vc-g-item img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s ease}.vc-g-item:hover img,.vc-g-item:focus img{transform:scale(1.07)}.vc-g-cap{position:absolute;left:0;right:0;bottom:0;padding:5px 8px;font-size:11px;color:#fff;background:linear-gradient(180deg,transparent,rgba(0,0,0,.78));text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vc-err{width:min(92vw,420px);background:#fff;border-radius:var(--rd,18px);box-shadow:0 20px 50px rgba(15,23,42,.18);padding:clamp(22px,6vw,34px);text-align:center;margin-top:8vh;animation:vcFadeUp .5s ease both}.vc-err h3{color:var(--ink);margin-bottom:8px}.vc-err p{color:var(--muted);font-size:13.5px;line-height:1.6;word-break:break-all}.vc-err .vc-err-ico{font-size:34px;margin-bottom:8px}.vc-lb{position:fixed;inset:0;background:rgba(2,6,18,.93);z-index:9999;display:none;align-items:center;justify-content:center;opacity:0;transition:opacity .25s ease}.vc-lb.open{display:flex;opacity:1}.vc-lb.open .vc-lb-stage{animation:vcZoomIn .3s ease}.vc-lb-stage{max-width:100vw;max-height:100vh;width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;touch-action:none;overflow:hidden}.vc-lb-img{max-width:94vw;max-height:88vh;width:auto;height:auto;object-fit:contain;user-select:none;-webkit-user-drag:none;will-change:transform;transform-origin:center;box-shadow:0 0 40px rgba(0,0,0,.6);transition:transform .08s ease-out}.vc-lb-top{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;z-index:3;pointer-events:none}.vc-lb-top>*{pointer-events:auto}.vc-lb-count{color:#e2e8f0;font-size:13px;font-weight:700;background:rgba(15,23,42,.55);padding:6px 12px;border-radius:999px;backdrop-filter:blur(4px)}.vc-lb-zoom{display:flex;gap:6px}.vc-lb-btn{width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.25);background:rgba(15,23,42,.55);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(4px);transition:.15s ease}.vc-lb-btn:hover{background:rgba(37,42,74,.85)}.vc-lb-btn.close{background:rgba(220,38,38,.75)}.vc-lb-btn.close:hover{background:rgba(220,38,38,.95)}.vc-lb-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:3}.vc-lb-nav.prev{left:10px}.vc-lb-nav.next{right:10px}.vc-lb-cap{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);color:#e2e8f0;font-size:13px;background:rgba(15,23,42,.6);padding:6px 14px;border-radius:999px;max-width:82%;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;z-index:3}.vc-lb svg{fill:none;stroke:currentColor;stroke-width:2;width:20px;height:20px}@media(max-width:560px){.vc-lb-nav{width:36px;height:36px}.vc-lb-btn{width:34px;height:34px}}@media(min-width:640px){.vc-actions{grid-template-columns:repeat(5,1fr)}}@media(max-width:520px){.vc-g-item{flex:0 0 calc(50% - 9px)}}@media(max-width:370px){.vc-actions{grid-template-columns:1fr 1fr}.vc-foot{grid-template-columns:1fr}.vc-kv{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.vc-g-track{animation:none!important}}';

  var ANIMS = ['vcFadeUp', 'vcFlipIn', 'vcZoomIn', 'vcSlideInL', 'vcSlideInR', 'vcRotateIn', 'vcDrop', 'vcBlur'];

  function pickAnim() {
    return ANIMS[Math.floor(Math.random() * ANIMS.length)];
  }

  var refreshMs = 4000;
  var animOff = false;
  var lastJson = null;
  var pollInFlight = false;
  var lightboxOpen = false;
  var editing = false;
  var pollTimer = null;
  var multiMap = null;
  var leafletPromise = null;
  var leafletMaps = [];

  function ensureStyle() {
    if (!document.getElementById('vc-style')) {
      var s = document.createElement('style');
      s.id = 'vc-style';
      s.textContent = appcss;
      document.head.appendChild(s);
    }
  }

  var ROOTCSS_MAP = {
    themeColor: '--c',
    shadeColor: '--c2',
    inkColor: '--ink',
    mutedColor: '--muted',
    lineColor: '--line',
    pageBg: '--bg1',
    pageBgTop: '--bgTop',
    pageBgBottom: '--bgBot',
    cardMaxWidth: '--cw',
    cardShadow: '--cs',
    radius: '--rd',
    baseFontSize: '--fs',
    chipBg: '--chipBg',
    chipBorder: '--chipBd',
    actionRadius: '--ard',
    sectionGap: '--gap',
    galleryHeight: '--galH'
  };

  function applyTheme(themeColor, rootCss) {
    rootCss = rootCss || {};
    var root = document.documentElement.style;

    var c = String(themeColor || '').trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(c)) c = String(rootCss.themeColor || '').trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(c)) c = '#1B2A4A';
    root.setProperty('--c', c);
    root.setProperty('--c2', shade(c, 0.28));

    Object.keys(ROOTCSS_MAP).forEach(function (k) {
      var v = rootCss[k];
      if (v == null || String(v).trim() === '') return;
      root.setProperty(ROOTCSS_MAP[k], String(v).trim());
    });

    var refr = parseInt(rootCss.refreshSeconds, 10);
    refreshMs = isNaN(refr) || refr < 0 ? 4 : refr;
    animOff = String(rootCss.animations || 'on').toLowerCase() === 'off';

    document.body.classList.add('vc-theme');
  }

  function ensureDesign(rootCss) {
    rootCss = rootCss || {};
    var raw = String(rootCss.design || '').trim();
    var m = raw.match(/^vc?([1-9]\d*)$/i);
    var design = m ? 'vc' + m[1] : '';
    var classes = (document.body.className || '').split(/\s+/);
    document.body.className = classes.filter(function (c) { return c.indexOf('vc-dsn-') !== 0; }).join(' ').trim();

    var link = document.getElementById('vc-design');
    if (!design) {
      if (link) link.remove();
      return;
    }
    document.body.classList.add('vc-dsn-' + design);
    if (!link) {
      link = document.createElement('link');
      link.id = 'vc-design';
      link.rel = 'stylesheet';
      link.onerror = function () {
        link.removeAttribute('data-href');
        console.warn('[vc] design css failed:', DESIGN_CSS_BASE + design + '.css');
      };
      document.head.appendChild(link);
    }
    var url = DESIGN_CSS_BASE + design + '.css';
    if (link.getAttribute('data-href') !== url) {
      link.setAttribute('data-href', url);
      link.href = url;
    }
  }

  function initials(name) {
    name = String(name || '').trim();
    if (!name) return '?';
    var parts = name.split(/\s+/);
    var res = (parts[0][0] || '') + (parts[1] ? parts[1][0] : '') + (parts[2] ? parts[2][0] : '');
    return res.toUpperCase() || name.substr(0, 2).toUpperCase();
  }

  function telLink(p) {
    p = String(p || '').replace(/\s+/g, '');
    return p ? 'tel:' + p : '';
  }

  function waNum(p) {
    return String(p || '').replace(/[^0-9]/g, '');
  }

  function loadData() {
    return fetch(DATA_URL + '?tmp=' + Date.now())
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
  }

  function buildActions(c) {
    var a = [];
    var ph = firstNonEmpty(c.contact.primaryPhone, c.contact.alternatePhone);
    if (ph) a.push('<a class="vc-action primary" href="' + esc(telLink(ph)) + '">' + icon('phone') + 'Call</a>');
    var wa = firstNonEmpty(c.onlinePresence.whatsapp, c.contact.primaryPhone);
    if (wa) a.push('<a class="vc-action" href="https://wa.me/' + waNum(wa) + '" target="_blank" rel="noopener">' + icon('whatsapp') + 'WhatsApp</a>');
    if (hasVal(c.contact.email)) a.push('<a class="vc-action" href="mailto:' + esc(c.contact.email) + '">' + icon('email') + 'Email</a>');
    if (hasVal(c.contact.website)) a.push('<a class="vc-action" href="' + esc(c.contact.website) + '" target="_blank" rel="noopener">' + icon('globe') + 'Website</a>');
    var mapUrl = firstNonEmpty(c.onlinePresence.googleMaps, c.onlinePresence.googleBusinessProfile);
    if (mapUrl) a.push('<a class="vc-action" href="' + esc(mapUrl) + '" target="_blank" rel="noopener">' + icon('pin') + 'Map</a>');
    return a.length ? '<div class="vc-actions">' + a.join('') + '</div>' : '';
  }

  function sec(title, bodyHtml, cls) {
    if (!bodyHtml) return '';
    return '<div class="vc-sec' + (cls ? ' ' + cls : '') + '" style="--d:' + (document.currentDelay = (document.currentDelay || 0) + 0.05) + 's"><div class="vc-sec-title"><span class="vc-sdot"></span>' + esc(title) + '</div>' + bodyHtml + '</div>';
  }

  function resetDelay() {
    document.currentDelay = 0;
  }

  function buildTags(list) {
    if (!list) return '';
    var out = [];
    for (var i = 0; i < list.length; i++) { if (hasVal(list[i])) out.push('<span class="vc-tag">' + esc(list[i]) + '</span>'); }
    return out.length ? '<div class="vc-tags">' + out.join('') + '</div>' : '';
  }

  function buildContactList(c) {
    var rows = [];
    if (hasVal(c.contact.primaryPhone)) rows.push('<div class="vc-li">' + icon('phone') + '<div><span class="vc-lbl">Primary</span><a href="' + esc(telLink(c.contact.primaryPhone)) + '">' + esc(c.contact.primaryPhone) + '</a></div></div>');
    if (hasVal(c.contact.alternatePhone)) rows.push('<div class="vc-li">' + icon('phone') + '<div><span class="vc-lbl">Alternate</span><a href="' + esc(telLink(c.contact.alternatePhone)) + '">' + esc(c.contact.alternatePhone) + '</a></div></div>');
    if (hasVal(c.contact.email)) rows.push('<div class="vc-li">' + icon('email') + '<div><span class="vc-lbl">Email</span><a href="mailto:' + esc(c.contact.email) + '">' + esc(c.contact.email) + '</a></div></div>');
    if (hasVal(c.contact.supportEmail) && String(c.contact.supportEmail).trim() !== String(c.contact.email || '').trim()) rows.push('<div class="vc-li">' + icon('email') + '<div><span class="vc-lbl">Support</span><a href="mailto:' + esc(c.contact.supportEmail) + '">' + esc(c.contact.supportEmail) + '</a></div></div>');
    if (hasVal(c.contact.website)) rows.push('<div class="vc-li">' + icon('globe') + '<div><span class="vc-lbl">Website</span><a href="' + esc(c.contact.website) + '" target="_blank" rel="noopener">' + esc(c.contact.website) + '</a></div></div>');
    return rows.length ? '<div class="vc-list">' + rows.join('') + '</div>' : '';
  }

  function mapEmbed(lat, lng) {
    var d = 0.006;
    var bbox = (lng - d) + ',' + (lat - d) + ',' + (lng + d) + ',' + (lat + d);
    var src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox + '&layer=mapnik&marker=' + lat + ',' + lng;
    var g = 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng;
    return '<div class="vc-map"><iframe src="' + esc(src) + '" loading="lazy" title="Location map" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
      '<a class="vc-mapopen" href="' + esc(g) + '" target="_blank" rel="noopener">Open in Google Maps</a></div>';
  }

  function singleMapHtml(idx, lat, lng) {
    var g = 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng;
    return '<div class="vc-map"><div id="vc-map-' + idx + '" class="vc-mm-sm"></div>' +
      '<a class="vc-mapopen" href="' + esc(g) + '" target="_blank" rel="noopener">Open in Google Maps</a></div>';
  }

  function buildAddresses(c) {
    var combined = Number(c.mapAddressesCombined) === 1;
    var rows = [];
    var maps = c.onlinePresence.googleMaps;
    var geo = [];
    (c.addresses || []).forEach(function (ad, i) {
      var addr = [ad.line1, ad.line2, ad.city, ad.state, ad.pin, ad.country].filter(function (x) { return String(x || '').trim(); }).join(', ');
      var lat = parseFloat(ad.lat), lng = parseFloat(ad.lng);
      var hasGeo = isFinite(lat) && isFinite(lng);
      if (hasGeo) geo.push({ lat: lat, lng: lng, type: ad.type || 'Address', addr: addr, logo: ad.logoUrl });
      if (!addr && !hasGeo) return;
      var qurl = 'https://www.google.com/maps/search/?api=1&query=' + (hasGeo ? (lat + ',' + lng) : encodeURIComponent(addr));
      var link = hasGeo ? qurl : (maps || qurl);
      var mapHtml = '';
      if (!combined && hasGeo) mapHtml = (String(ad.logoUrl || '').trim() !== '') ? singleMapHtml(i, lat, lng) : mapEmbed(lat, lng);
      rows.push('<div class="vc-li">' + icon('pin') + '<div style="flex:1;min-width:0"><span class="vc-lbl">' + esc(ad.type || 'Address') + '</span>' +
        (addr ? '<a href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(addr) + '</a>' : '') +
        mapHtml + '</div></div>');
    });
    var list = rows.length ? '<div class="vc-list">' + rows.join('') + '</div>' : '';
    if (!combined || !geo.length) return list;
    return list + combinedMap(geo);
  }

  function combinedMap(geo) {
    var html = '<div class="vc-map vc-multimap"><div id="vc-multimap" class="vc-mm"></div>';
    if (geo.length > 1) {
      var stops = geo.map(function (g) { return g.lat + ',' + g.lng; }).join('/');
      html += '<a class="vc-mapall" href="https://www.google.com/maps/dir/' + stops + '" target="_blank" rel="noopener">Open all ' + geo.length + ' locations in Google Maps</a>';
    } else {
      html += '<a class="vc-mapopen" href="https://www.google.com/maps/search/?api=1&query=' + geo[0].lat + ',' + geo[0].lng + '" target="_blank" rel="noopener">Open in Google Maps</a>';
    }
    return html + '</div>';
  }

  function ensureLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise(function (resolve, reject) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';
      s.onload = function () { window.L ? resolve(window.L) : reject(new Error('Leaflet unavailable')); };
      s.onerror = function () { reject(new Error('Leaflet failed to load')); };
      document.head.appendChild(s);
    });
    return leafletPromise;
  }

  function attr(v) {
    return esc(v).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function logoIcon(L, url) {
    if (!url || String(url).trim() === '') return null;
    return L.divIcon({
      className: 'vc-mlog',
      html: '<img src="' + attr(url) + '" alt="" loading="lazy" onerror="this.style.visibility=&quot;hidden&quot;">',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  }

  function initCombinedMap(c) {
    var el = document.getElementById('vc-multimap');
    if (!el) return;
    if (Number(c.mapAddressesCombined) !== 1) return;
    var geo = [];
    (c.addresses || []).forEach(function (ad) {
      var lat = parseFloat(ad.lat), lng = parseFloat(ad.lng);
      if (isFinite(lat) && isFinite(lng)) {
        geo.push({ lat: lat, lng: lng, type: ad.type || 'Address', addr: [ad.line1, ad.line2, ad.city, ad.state, ad.pin, ad.country].filter(function (x) { return String(x || '').trim(); }).join(', '), logo: ad.logoUrl });
      }
    });
    if (!geo.length) return;
    ensureLeaflet().then(function (L) {
      if (!document.body.contains(el)) return;
      var ll = L.map(el, { scrollWheelZoom: false }).setView([geo[0].lat, geo[0].lng], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© OpenStreetMap contributors'
      }).addTo(ll);
      geo.forEach(function (g) {
        var logoHtml = (String(g.logo || '').trim() !== '') ? '<img src="' + attr(g.logo) + '" style="width:34px;height:34px;border-radius:8px;object-fit:cover;float:left;margin-right:8px" alt="">' : '';
        var pop = logoHtml + '<strong>' + esc(g.type) + '</strong>' + (g.addr ? '<br>' + esc(g.addr) : '') +
          '<br><a href="https://www.google.com/maps/search/?api=1&query=' + g.lat + ',' + g.lng + '" target="_blank" rel="noopener">Open in Google Maps</a>';
        var ic = logoIcon(L, g.logo);
        var m = ic ? L.marker([g.lat, g.lng], { icon: ic }) : L.marker([g.lat, g.lng]);
        m.addTo(ll).bindPopup(pop);
      });
      if (geo.length > 1) ll.fitBounds(geo.map(function (g) { return [g.lat, g.lng]; }), { padding: [30, 30] });
      multiMap = ll;
    }).catch(function (e) { console.warn('vc combined-map failed:', e); });
  }

  function initAddressMaps(c) {
    (c.addresses || []).forEach(function (ad, i) {
      var el = document.getElementById('vc-map-' + i);
      if (!el || String(ad.logoUrl || '').trim() === '') return;
      var lat = parseFloat(ad.lat), lng = parseFloat(ad.lng);
      if (!isFinite(lat) || !isFinite(lng)) return;
      ensureLeaflet().then(function (L) {
        if (!document.body.contains(el)) return;
        var ll = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19, attribution: '© OpenStreetMap contributors'
        }).addTo(ll);
        var addr = [ad.line1, ad.line2, ad.city, ad.state, ad.pin, ad.country].filter(function (x) { return String(x || '').trim(); }).join(', ');
        var pop = '<img src="' + attr(ad.logoUrl) + '" style="width:34px;height:34px;border-radius:8px;object-fit:cover;float:left;margin-right:8px" alt="">' +
          '<strong>' + esc(ad.type || 'Address') + '</strong>' + (addr ? '<br>' + esc(addr) : '') +
          '<br><a href="https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng + '" target="_blank" rel="noopener">Open in Google Maps</a>';
        L.marker([lat, lng], { icon: logoIcon(L, ad.logoUrl) }).addTo(ll).bindPopup(pop);
        leafletMaps.push(ll);
      }).catch(function (e) { console.warn('vc address-map failed:', e); });
    });
  }

  function destroyMaps() {
    if (multiMap) { multiMap.remove(); multiMap = null; }
    leafletMaps.forEach(function (m) { try { m.remove(); } catch (e) { } });
    leafletMaps = [];
  }

  function buildHours(c) {
    var hrs = (c.business && c.business.businessHours) || [];
    if (!hrs.length) return '';
    var today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    var rows = '';
    hrs.forEach(function (h) {
      if (!hasVal(h.day)) return;
      var label;
      var cls;
      if (h.closed) {
        label = 'Closed';
        cls = 'closed';
      } else {
        if (!hasVal(h.open) && !hasVal(h.close)) return;
        label = (h.open ? esc(h.open) : '—') + ' – ' + (h.close ? esc(h.close) : '—');
        cls = '';
      }
      var td = (String(h.day) === today) ? ' class="today"' : '';
      rows += '<tr><td' + td + '>' + esc(h.day) + '</td><td' + td + '><span class="' + cls + '">' + label + '</span></td></tr>';
    });
    return rows ? '<table class="vc-hrs"><tbody>' + rows + '</tbody></table>' : '';
  }

  function buildMeta(c) {
    var kv = [];
    var t = c.trustAndCredentials || {};
    if (hasVal(t.gstin)) kv.push(['GSTIN', t.gstin]);
    if (hasVal(t.cin)) kv.push(['CIN', t.cin]);
    if (hasVal(t.pan)) kv.push(['PAN', t.pan]);
    if (hasVal(t.registrationNumber)) kv.push(['Reg. No.', t.registrationNumber]);
    if (hasVal(c.foundedDate)) kv.push(['Founded', String(c.foundedDate).substr(0, 4)]);
    if (hasVal(c.employeeCount)) kv.push(['Team', c.employeeCount + ' staff']);
    var pay = c.paymentMethods && c.paymentMethods.length ? c.paymentMethods : (c.business && c.business.paymentMethods) || [];
    pay = pay.filter(hasVal);
    if (pay.length) kv.push(['Payments', pay.slice(0, 4).join(', ')]);
    var lang = (c.languagesSupported && c.languagesSupported.length ? c.languagesSupported : (c.business && c.business.languagesSupported) || []).filter(hasVal);
    if (lang.length) kv.push(['Languages', lang.join(', ')]);
    if (!kv.length) return '';
    var out = '<div class="vc-kv">';
    kv.forEach(function (p) { out += '<div><div class="k">' + esc(p[0]) + '</div><div class="v">' + esc(p[1]) + '</div></div>'; });
    return out + '</div>';
  }

  function buildSocial(c) {
    var o = c.onlinePresence || {};
    var items = [
      ['linkedin', o.linkedin],
      ['facebook', o.facebook],
      ['instagram', o.instagram],
      ['youtube', o.youtube],
      ['x', o.x]
    ];
    var out = [];
    items.forEach(function (it) {
      if (hasVal(it[1])) out.push('<a class="vc-soc" href="' + esc(it[1]) + '" target="_blank" rel="noopener" title="' + esc(it[0]) + '">' + icon(it[0]) + '</a>');
    });
    return out.length ? '<div class="vc-social">' + out.join('') + '</div>' : '';
  }

  function galleryList(c) {
    var g = (c.media && c.media.gallery) || c.gallery || [];
    return g.filter(function (x) {
      var u = x.url || x.u || x.src;
      return !!String(u || '').trim();
    });
  }

  function buildGallery(c) {
    var g = galleryList(c);
    if (!g.length) return '';
    var base = [];
    for (var i = 0; i < g.length; i++) {
      var u = g[i].url || g[i].u || g[i].src;
      var t = g[i].title || g[i].name || '';
      base.push('<button type="button" class="vc-g-item" data-i="' + i + '"><img data-src="' + esc(u) + '" alt="' + esc(t) + '" loading="lazy" decoding="async" class="vc-lz"><span class="vc-g-cap">' + esc(t) + '</span></button>');
    }
    while (base.length < 4) base = base.concat(base);
    base = base.slice(0, 4);
    var dur = Math.max(12, base.length * 4);
    var outer = sec('Gallery', '<div class="vc-gallery"><div class="vc-g-track" style="--dur:' + dur + 's">' + base.join('') + base.join('') + '</div></div>', 'vc-sec-gallery');
    return outer;
  }

  function buildVcf(c) {
    var lines = [];
    lines.push('BEGIN:VCARD', 'VERSION:3.0');
    var name = firstNonEmpty(c.tradeName, c.shortName, c.legalName);
    lines.push('FN:' + name);
    lines.push('N:' + name + ';;;');
    if (c.legalName) lines.push('ORG:' + c.legalName);
    if (c.tagline) lines.push('TITLE:' + c.tagline);
    if (c.contact.primaryPhone) lines.push('TEL;TYPE=CELL:' + waNum(c.contact.primaryPhone));
    if (c.contact.alternatePhone) lines.push('TEL;TYPE=WORK:' + waNum(c.contact.alternatePhone));
    if (c.contact.email) lines.push('EMAIL:' + c.contact.email);
    if (c.contact.website) lines.push('URL:' + c.contact.website);
    (c.addresses || []).forEach(function (ad, i) {
      if (!ad.city && !ad.line1) return;
      lines.push('ADR;TYPE=WORK;LABEL=ADDRESS' + (i + 1) + ':' + [null, null, (ad.line1 ? ad.line1 + (ad.line2 ? ', ' + ad.line2 : '') : ''), ad.city || '', ad.state || '', ad.pin || '', ad.country || ''].join(';').replace(/^;/, ';'));
    });
    if (c.description) lines.push('NOTE:' + c.description.replace(/\n/g, ' '));
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }

  function downloadVcf(c) {
    var blob = new Blob([buildVcf(c)], { type: 'text/vcard;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (firstNonEmpty(c.shortName, c.tradeName) || 'contact').replace(/\s+/g, '_') + '.vcf';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  function shareCard(c) {
    var name = firstNonEmpty(c.tradeName, c.shortName, c.legalName);
    var text = '*' + name + '*\n' + (c.tagline || '') + '\n\nCall: ' + (c.contact.primaryPhone || '') + '\nWhatsApp: ' + firstNonEmpty(c.onlinePresence.whatsapp, c.contact.primaryPhone) + '\nEmail: ' + c.contact.email + '\nWebsite: ' + c.contact.website;
    var url = 'https://wa.me/?text=' + encodeURIComponent(text);
    if (navigator.share) {
      navigator.share({ title: name, text: text }).catch(function () { window.open(url, '_blank'); });
    } else {
      window.open(url, '_blank');
    }
  }

  function applyRandomAnims() {
    if (animOff) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var card = document.querySelector('.vc-card');
    if (card) {
      card.style.animation = pickAnim() + ' .9s cubic-bezier(.2,.86,.3,1.05) both';
    }

    var targets = document.querySelectorAll('.vc-name,.vc-logo,.vc-actions,.vc-sec,.vc-foot');
    for (var t = 0; t < targets.length; t++) {
      var el = targets[t];
      var delay = el.style.getPropertyValue('--d');
      el.style.removeProperty('animation');
      el.style.animation = pickAnim() + ' .75s cubic-bezier(.2,.8,.3,1) both';
      if (delay) el.style.animationDelay = delay;
    }
  }

  var scrollObserver = null;

  function scrollHidden(anim) {
    switch (anim) {
      case 'vcSlideInL': return 'translateX(-46px)';
      case 'vcSlideInR': return 'translateX(46px)';
      case 'vcZoomIn': return 'scale(.7)';
      case 'vcRotateIn': return 'rotate(-9deg) scale(.85)';
      case 'vcBlur': return 'blur(14px)';
      case 'vcDrop': return 'translateY(-30px)';
      default: return 'translateY(34px)';
    }
  }

  function wireScrollReveal() {
    if (animOff) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) { applyRandomAnims(); return; }
    if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }

    var card = document.querySelector('.vc-card');
    if (!card) { applyRandomAnims(); return; }
    document.body.classList.add('vc-scroll');

    var els = card.querySelectorAll('.vc-cover,.vc-logo-wrap,.vc-headline,.vc-sec,.vc-foot');
    var items = [];
    var dur = ' .8s cubic-bezier(.22,.9,.35,1)';

    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var anim = pickAnim();
      var useFilter = anim === 'vcBlur';
      var st = el.style;
      st.willChange = 'opacity, transform' + (useFilter ? ', filter' : '');
      st.transition = 'opacity' + dur + ',transform' + dur + (useFilter ? ',filter' + dur : '');
      st.opacity = '0';
      st.transform = scrollHidden(anim);
      if (useFilter) st.filter = 'blur(14px)';
      items.push({ el: el, hidden: st.transform, filter: useFilter });
    }

    function reveal(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    }
    function conceal(el) {
      for (var t = 0; t < items.length; t++) {
        if (items[t].el === el) {
          el.style.opacity = '0';
          el.style.transform = items[t].hidden;
          el.style.filter = items[t].filter ? 'blur(14px)' : 'none';
          return;
        }
      }
    }

    scrollObserver = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) reveal(entries[e].target);
        else conceal(entries[e].target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    for (var o = 0; o < items.length; o++) scrollObserver.observe(items[o].el);
  }

  var imgObserver = null;

  function wireImgLazy() {
    if (imgObserver) { imgObserver.disconnect(); imgObserver = null; }

    var containers = document.querySelectorAll('.vc-card .vc-cover,.vc-card .vc-logo,.vc-card .vc-gallery');
    if (!containers.length) return;

    function loadImages(root) {
      var imgs = root.querySelectorAll('img[data-src]');
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        if (img.getAttribute('src')) continue;
        img.onload = function () { this.classList.add('loaded'); };
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        if (img.complete) img.classList.add('loaded');
      }
    }

    if (!('IntersectionObserver' in window)) {
      for (var j = 0; j < containers.length; j++) loadImages(containers[j]);
      return;
    }

    imgObserver = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (!entries[e].isIntersecting) continue;
        loadImages(entries[e].target);
        imgObserver.unobserve(entries[e].target);
      }
    }, { threshold: 0.01, rootMargin: '200px' });

    for (var k = 0; k < containers.length; k++) imgObserver.observe(containers[k]);
  }

  function wireGallery(c) {
    var g = galleryList(c);
    if (!g.length) return;
    var items = document.querySelectorAll('.vc-g-item');
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('click', function () {
        openLightbox(g, parseInt(this.getAttribute('data-i'), 10) || 0);
      });
    }
  }

  var lb = null;

  function buildLightbox() {
    if (lb) return lb;
    var wrap = document.createElement('div');
    wrap.className = 'vc-lb';
    wrap.innerHTML =
      '<div class="vc-lb-stage">' +
      '<img class="vc-lb-img" alt="">' +
      '</div>' +
      '<div class="vc-lb-top">' +
      '<span class="vc-lb-count">1/1</span>' +
      '<div class="vc-lb-zoom">' +
      '<button type="button" class="vc-lb-btn" data-lb="reset" title="Reset zoom">' + icon('reset') + '</button>' +
      '<button type="button" class="vc-lb-btn" data-lb="out" title="Zoom out">' + icon('minus') + '</button>' +
      '<button type="button" class="vc-lb-btn" data-lb="in" title="Zoom in">' + icon('plus') + '</button>' +
      '<button type="button" class="vc-lb-btn close" data-lb="close" title="Close">' + icon('x') + '</button>' +
      '</div>' +
      '</div>' +
      '<button type="button" class="vc-lb-btn vc-lb-nav prev" data-lb="prev" title="Previous">' + icon('chl') + '</button>' +
      '<button type="button" class="vc-lb-btn vc-lb-nav next" data-lb="next" title="Next">' + icon('chr') + '</button>' +
      '<div class="vc-lb-cap"></div>';
    document.body.appendChild(wrap);

    var state = { list: [], i: 0, scale: 1, tx: 0, ty: 0, min: 1, max: 5 };
    var img = wrap.querySelector('.vc-lb-img');
    var count = wrap.querySelector('.vc-lb-count');
    var cap = wrap.querySelector('.vc-lb-cap');
    var pointers = {};
    var pinchStart = null;

    function fitScale() {
      return clamp(1, 1, 5);
    }

    function apply() {
      img.style.transform = 'translate(' + state.tx + 'px,' + state.ty + 'px) scale(' + state.scale + ')';
      count.textContent = (state.i + 1) + '/' + state.list.length;
      cap.textContent = state.list[state.i].title || '';
    }

    function reset() {
      state.scale = 1;
      state.tx = 0;
      state.ty = 0;
      pinchStart = null;
      apply();
    }

    function panLimit() {
      var vw = window.innerWidth, vh = window.innerHeight;
      return { x: (vw * state.scale - vw) / 2 + 40, y: (vh * state.scale - vh) / 2 + 40 };
    }

    function show(i) {
      if (!state.list.length) return;
      state.i = (i + state.list.length) % state.list.length;
      var src = state.list[state.i].url || state.list[state.i].u || state.list[state.i].src;
      img.src = src;
      reset();
    }

    function open(list, idx) {
      state.list = list;
      lightboxOpen = true;
      show(idx || 0);
      wrap.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightboxOpen = false;
      wrap.classList.remove('open');
      document.body.style.overflow = '';
      pointers = {};
      pinchStart = null;
    }

    function persistPointersUp() {
      var ids = Object.keys(pointers);
      if (ids.length <= 1 && pinchStart) {
        pinchStart = null;
        if (state.scale <= state.min + 0.01) {
          state.tx = 0;
          state.ty = 0;
          apply();
        }
      }
    }

    function activeCount() {
      return Object.keys(pointers).length;
    }

    wrap.querySelector('.vc-lb-stage').addEventListener('pointerdown', function (e) {
      e.preventDefault();
      this.setPointerCapture(e.pointerId);
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (activeCount() === 2) {
        var ids = Object.keys(pointers);
        var p1 = pointers[ids[0]];
        var p2 = pointers[ids[1]];
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        pinchStart = {
          dist: Math.max(1, Math.sqrt(dx * dx + dy * dy)),
          scale: state.scale,
          tx: state.tx,
          ty: state.ty,
          mx: (p1.x + p2.x) / 2,
          my: (p1.y + p2.y) / 2
        };
      }
    });

    wrap.querySelector('.vc-lb-stage').addEventListener('pointermove', function (e) {
      e.preventDefault();
      var p = pointers[e.pointerId];
      if (!p) return;
      var dx = e.clientX - p.x;
      var dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;

      if (activeCount() === 2 && pinchStart) {
        var ids = Object.keys(pointers);
        var p1 = pointers[ids[0]];
        var p2 = pointers[ids[1]];
        var nx = (p1.x + p2.x) / 2;
        var ny = (p1.y + p2.y) / 2;
        var ndist = Math.max(1, Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y)));
        state.scale = clamp(pinchStart.scale * (ndist / pinchStart.dist), state.min, state.max);
        state.tx = pinchStart.tx + (nx - pinchStart.mx);
        state.ty = pinchStart.ty + (ny - pinchStart.my);
        apply();
      } else if (activeCount() === 1 && state.scale > 1) {
        var lim = panLimit();
        state.tx = clamp(state.tx + dx, -lim.x, lim.x);
        state.ty = clamp(state.ty + dy, -lim.y, lim.y);
        apply();
      }
    });

    function removePointer(e) {
      delete pointers[e.pointerId];
      persistPointersUp();
    }
    wrap.querySelector('.vc-lb-stage').addEventListener('pointerup', removePointer);
    wrap.querySelector('.vc-lb-stage').addEventListener('pointercancel', removePointer);

    wrap.querySelector('.vc-lb-stage').addEventListener('dblclick', function () {
      state.scale = state.scale > 1.05 ? 1 : 2.5;
      if (state.scale === 1) { state.tx = 0; state.ty = 0; }
      apply();
    });

    wrap.querySelector('.vc-lb-stage').addEventListener('wheel', function (e) {
      e.preventDefault();
      var f = e.deltaY < 0 ? 1.15 : 0.87;
      state.scale = clamp(state.scale * f, state.min, state.max);
      apply();
    }, { passive: false });

    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lb]');
      if (!btn) return;
      var act = btn.getAttribute('data-lb');
      if (act === 'close') close();
      else if (act === 'prev') show(state.i - 1);
      else if (act === 'next') show(state.i + 1);
      else if (act === 'in') { state.scale = clamp(state.scale * 1.4, state.min, state.max); apply(); }
      else if (act === 'out') { state.scale = clamp(state.scale / 1.4, state.min, state.max); if (state.scale <= state.min + 0.01) { state.tx = 0; state.ty = 0; } apply(); }
      else if (act === 'reset') reset();
    });

    document.addEventListener('keydown', function (e) {
      if (!wrap.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(state.i - 1);
      else if (e.key === 'ArrowRight') show(state.i + 1);
    });

    lb = { open: open };
    return lb;
  }

  function openLightbox(list, idx) {
    buildLightbox().open(list, idx);
  }

  function render(d) {
    if (editing) return;
    destroyMaps();
    var c = d.company || {};
    var rootCss = d['root-css'] || {};
    applyTheme((c.websiteSettings || {}).themeColor, rootCss);
    ensureDesign(rootCss);

    var name = firstNonEmpty(c.tradeName, c.shortName, c.legalName);
    var logoImg = c.logo ? '<img data-src="' + esc(c.logo) + '" alt="' + esc(name) + '" loading="lazy" decoding="async" class="vc-lz" onerror="this.style.display=&quot;none&quot;">' : '';
    var coverImg = c.coverImage ? '<img data-src="' + esc(c.coverImage) + '" alt="" loading="lazy" decoding="async" class="vc-lz" onerror="this.remove()">' : '';

    var badges = [];
    if (hasVal(c.companyType)) badges.push(c.companyType);
    if (hasVal(c.industry)) badges.push(c.industry);
    if (hasVal(c.subIndustry)) badges.push(c.subIndustry);
    if (hasVal(c.foundedDate)) badges.push('Since ' + String(c.foundedDate).substr(0, 4));
    var badgeHtml = badges.length ? '<div class="vc-badges">' + badges.map(function (b) { return '<span class="vc-badge">' + esc(b) + '</span>'; }).join('') + '</div>' : '';

    var ownerName = '';
    (c.founderNames || []).forEach(function (n) { if (!ownerName && hasVal(n)) ownerName = n; });

    resetDelay();
    var body = '';
    Object.keys(c).forEach(function (k) {
      var b = CARD_BLOCK_BUILDERS[k];
      if (b) body += b(c);
    });

    var card = '';
    card += '<div class="vc-card">';
    card += '<div class="vc-cover">' + coverImg + '<div class="vc-cover-grad"></div>' +
      '<button type="button" class="vc-editbtn" id="vc-edit" title="Edit card">' + icon('gear') + '</button></div>';
    card += '<div class="vc-logo-wrap"><div class="vc-logo">' + logoImg + (hasVal(name) ? esc(initials(name)) : '') + '</div></div>';
    card += '<div class="vc-headline">';
    if (hasVal(name)) card += '<div class="vc-name">' + esc(name) + '</div>';
    if (hasVal(ownerName)) card += '<div class="vc-owner">' + icon('person') + '<span>' + esc(ownerName) + '</span></div>';
    if (hasVal(c.legalName) && c.legalName !== name) card += '<div class="vc-legal">' + esc(c.legalName) + '</div>';
    if (hasVal(c.tagline)) card += '<div class="vc-tagline">' + esc(c.tagline) + '</div>';
    if (hasVal(c.slogan)) card += '<div class="vc-slogan">' + esc(c.slogan) + '</div>';
    card += badgeHtml;
    card += '</div>';
    card += '<div class="vc-body">';
    resetDelay();
    var actions = buildActions(c);
    if (actions) card += '<div class="vc-sec vc-sec-actions" style="--d:0.08s">' + actions + '</div>';
    card += body;
    card += '<div class="vc-foot" style="--d:' + (document.currentDelay + 0.05) + 's">';
    card += '<button class="vc-btn" id="vc-save">' + icon('save') + 'Save Contact</button>';
    card += '<button class="vc-btn ghost" id="vc-share">' + icon('share') + 'Share Card</button>';
    card += '</div>';
    card += '</div>';
    card += '</div>';

    document.body.innerHTML = '<div id="vc-root">' + card + '</div>';
    lb = null;

    var wa = firstNonEmpty(c.onlinePresence.whatsapp, c.contact.primaryPhone);
    if (wa) {
      var link = document.createElement('a');
      link.className = 'vc-wa';
      link.href = 'https://wa.me/' + waNum(wa);
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', 'Chat on WhatsApp');
      link.innerHTML = icon('whatsapp');
      document.body.appendChild(link);
    }

    document.getElementById('vc-save').addEventListener('click', function () { downloadVcf(c); });
    document.getElementById('vc-share').addEventListener('click', function () { shareCard(c); });
    var editBtn = document.getElementById('vc-edit');
    if (editBtn) editBtn.addEventListener('click', openEditor);
    wireGallery(c);
    wireImgLazy();
    wireScrollReveal();
    initAddressMaps(c);
    initCombinedMap(c);
  }

  function buildTagsHtml(title, tagHtml, cls) {
    return tagHtml ? sec(title, tagHtml, cls) : '';
  }

  function buildBusinessSections(c) {
    var o = '';
    o += buildTagsHtml('Services', buildTags(c.business.services), 'vc-sec-services');
    o += buildTagsHtml('Specializations', buildTags(c.business.specializations), 'vc-sec-specializations');
    o += buildTagsHtml('Products', buildTags(c.business.products), 'vc-sec-products');
    o += buildTagsHtml('Service Areas', buildTags(c.business.serviceAreas), 'vc-sec-areas');
    var hrs = buildHours(c);
    if (hrs) o += sec('Business Hours', '<div class="vc-hrwrap"><div class="vc-hricon">' + icon('clock') + '</div>' + hrs + '</div>', 'vc-sec-hours');
    return o;
  }

  var CARD_BLOCK_BUILDERS = {
    description: function (c) {
      return hasVal(c.description) ? sec('About', '<div class="vc-desc">' + esc(c.description) + '</div>', 'vc-sec-about') : '';
    },
    contact: function (c) {
      var h = buildContactList(c);
      return h ? sec('Contact', h, 'vc-sec-contact') : '';
    },
    addresses: function (c) {
      var h = buildAddresses(c);
      return h ? sec('Locations', h, 'vc-sec-locations') : '';
    },
    business: function (c) { return buildBusinessSections(c); },
    onlinePresence: function (c) {
      var h = buildSocial(c);
      return h ? sec('Follow Us', h, 'vc-sec-social') : '';
    },
    media: function (c) { return buildGallery(c); },
    trustAndCredentials: function (c) {
      var h = buildMeta(c);
      return h ? sec('Credentials & Info', h, 'vc-sec-meta') : '';
    }
  };

  function showError(e) {
    document.body.innerHTML = '<div id="vc-root"><div class="vc-err"><div class="vc-err-ico">&#128230;</div><h3>Could not load card</h3><p>Unable to read "' + esc(DATA_URL) + '".<br>' + esc(e && e.message ? e.message : String(e)) + '</p></div></div>';
  }

  function pollOnce() {
    if (pollInFlight || lightboxOpen || editing) return;
    pollInFlight = true;
    fetch(DATA_URL + '?tmp=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        var s = JSON.stringify(d);
        if (s !== lastJson) {
          lastJson = s;
          render(d);
        }
      })
      .catch(function (err) { console.warn('vc live-refresh failed:', err); })
      .then(function () { pollInFlight = false; });
  }

  function startWatch() {
    if (refreshMs <= 0) return;
    var ms = Math.max(1000, refreshMs * 1000);
    pollTimer = setInterval(pollOnce, ms);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) pollOnce();
    });
    window.addEventListener('focus', pollOnce);
  }

  function stopWatch() {
    editing = true;
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  function openEditor() {
    if (editing) return;
    stopWatch();
    document.body.classList.remove('vc-theme');
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/sifr-in/cdn@963984e/vc/vc_.js';
    document.body.appendChild(s);
  }

  function boot() {
    ensureStyle();
    applyTheme('#1B2A4A', {});
    document.body.style.minHeight = '100dvh';
    var injected = (window.__VC_DATA__ != null) ? window.__VC_DATA__ : '';
    if (injected !== '') {
      var d;
      try { d = typeof injected === 'string' ? JSON.parse(injected) : injected; }
      catch (err) { showError(err); return; }
      lastJson = JSON.stringify(d);
      render(d);
      return;
    }
    loadData()
      .then(function (d) {
        lastJson = JSON.stringify(d);
        render(d);
        startWatch();
      })
      .catch(showError);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();