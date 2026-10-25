(function () {
 'use strict';

 var PAGE_ID = "mrAdminPage";
 var DLG_ID = "mrAdminDialog";
 var REGIS_ID = "rgRegistrationModal";
 var MODAL_PROFILE_ID = "mrProfileDtlsModal";

 var open_ = 0;
 var cssAdded_ = 0;
 var pageKeyH_ = null;
 var rows_ = [];
 var planRows_ = [];
 var search_ = "";
 var status_ = "";
 var tab_ = "profiles";
 //page scroll position saved while the admin page locks the body (restored on close)
 var savedScrollY_ = 0;
 var mqRows_ = [];
 var reUpOpen_ = 0;
 var cRows_ = [];       // local "c" table (contacts): c.e is the member's mobile
 var muRows_ = [];      // local "mu" table (unlock records): used count = rows where mu.e == mr.e
 var cardsView_ = 0;    // admin profile list: 1 = card view, 0 = table view (persisted)

 function statusList() {
  var out = [];
  try {
   var cfg = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig;
   var m = cfg && cfg.statusMapingAllFromOne;
   if (Array.isArray(m) && m.length) { out = m; }
  } catch (eS) { }
  if (!out.length) {
   try { if (Array.isArray(window.entryStatus) && window.entryStatus.length) { out = window.entryStatus; } } catch (eE) { }
  }
  if (!out.length) {
   out = [
    { a: 0, e: "Pending" }, { a: 1, e: "Accepted" },
    { a: 2, e: "Under process" }, { a: -1, e: "Denied By Admin" }
   ];
  }
  return out;
 }

 function statusName(v) {
  //null/empty means the initial state (0 = Pending), same rule reUpPending uses
  var key = (v == null || v === "") ? "0" : String(v);
  var list = statusList();
  for (var i = 0; i < list.length; i++) {
   if (String(list[i].a) === key) { return list[i].e; }
  }
  return key;
 }

 //action -> status value, always read from mr.da.statusMapingAllFromOne (never
 //hardcode the numbers): accept matches "Accepted", reject "Denied By Admin",
 //block matches the "Admin blocked because sexual content update" entry.
 function statusValueFor(role, fallback) {
  var list = statusList();
  var needles = role === "accept" ? ["accept"]
   : role === "reject" ? ["denied", "reject"]
    : ["block"];
  for (var n = 0; n < needles.length; n++) {
   for (var i = 0; i < list.length; i++) {
    var it = list[i] || {};
    var e = String(it.e == null ? "" : it.e).toLowerCase();
    if (e.indexOf(needles[n]) >= 0 && it.a != null && it.a !== "") { return it.a; }
   }
  }
  return fallback;
 }

 function esc(s) {
  return String(s == null ? "" : s)
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#39;");
 }

 function fmtDate(u) {
  if (!u) { return ""; }
  var s = String(u).trim();
  var dPart = s.split(" ")[0] || s;
  try {
   var d = new Date(dPart.indexOf("-") >= 0 ? dPart.replace(/-/g, "/") : dPart);
   if (!isNaN(d.getTime())) {
    var mono = { month: "short", day: "numeric", year: "numeric" };
    return d.toLocaleDateString("en-GB", mono);
   }
  } catch (eD) { }
  return dPart;
 }

 function ageOf(g) {
  if (!g) { return ""; }
  if (typeof calculateAge === "function") {
   try {
    var a = calculateAge(g);
    if (Number.isFinite(a)) { return String(a); }
   } catch (eA) { }
  }
  var dPart = String(g).split(" ")[0];
  var yr = parseInt(String(dPart).split("-")[0], 10);
  if (isNaN(yr) || yr < 1900) { return ""; }
  return String(Math.max(0, new Date().getFullYear() - yr));
 }

 function cityOf(path) {
  if (path === undefined || path === null || path === "") { return ""; }
  if (typeof __mrCityName === "function") {
   try {
    var nm = __mrCityName(path);
    if (nm) { return String(nm); }
   } catch (eC) { }
  }
  return String(path);
 }

 function placePathOf(p, root) {
  if (!p) { return ""; }
  if (typeof window.__mrPlacePath === "function") {
   try { var j = window.__mrPlacePath(p, root); if (j) { return j; } } catch (eP) { }
  }
  var groups = {
   a2: ["a2", "a3", "a4", "a5", "a6"],
   b2: ["b2", "b3", "b4", "b5", "b6"],
   c3: ["c3", "c4", "c5", "c6", "c7"]
  };
  var grp = groups[root];
  if (!grp) { return ""; }
  var out = [];
  for (var i = 0; i < grp.length; i++) {
   var v = p[grp[i]];
   //keep the gap: a flat country stores its city in the last slot (a6/b6/c7)
   if (v === undefined || v === null || v === "" || String(v) === "0") { continue; }
   out.push(String(v));
  }
  return out.join(",");
 }

 function phoneOf(l) {
  if (l === undefined || l === null || l === "") { return ""; }
  if (typeof toDisplayPhone === "function") {
   try { return toDisplayPhone(l); } catch (eP) { }
  }
  return String(l);
 }

 function thumbOf(p) {
  try {
   if (typeof applyProfileImageData === "function") {
    applyProfileImageData(p);
    return p.thumbnail || "";
   }
  } catch (eT) { }
  if (p && p.ut) { return p.ut; }
  return "";
 }

 // ---------------------------------------------------------------
 // Card-view helpers
 // ---------------------------------------------------------------
 function cardsPrefKey() {
  try { return ((window.appOwner && window.appOwner.tn) || "mr") + "_admCardsView"; }
  catch (eK) { return "mr_admCardsView"; }
 }
 function loadCardsPref() {
  try { cardsView_ = localStorage.getItem(cardsPrefKey()) === "1" ? 1 : 0; }
  catch (eL) { cardsView_ = 0; }
 }
 function saveCardsPref() {
  try { localStorage.setItem(cardsPrefKey(), cardsView_ ? "1" : "0"); } catch (eS) { }
 }
 
 // "c" row whose id (c.a) matches the profile's registering-customer id (mr.e)
 function cRowOfProfile(p) {
  var id = (p && p.e != null) ? String(p.e) : "";
  if (!id) { return null; }
  for (var i = 0; i < cRows_.length; i++) {
   if (String(cRows_[i].a) === id) { return cRows_[i]; }
  }
  return null;
 }
 // Mobile number from the joined "c" table (c.e, where c.a == mr.e)
 function mobileOfProfile(p) {
  var c = cRowOfProfile(p);
  return c ? String(c.e == null ? "" : c.e) : "";
 }
 // Used count = how many "mu" (unlock) rows carry this member's id (mu.e == mr.e)
 function usedCountOf(p) {
  var id = (p && p.e != null) ? String(p.e) : "";
  if (!id) { return 0; }
  var n = 0;
  for (var i = 0; i < muRows_.length; i++) {
   if (String(muRows_[i].e) === id) { n++; }
  }
  return n;
 }
 function d2Of(p) { var n = parseInt((p && p.d2) || 0, 10); return (n > 0) ? n : 0; }
 function d1Of(p) { var n = parseInt((p && p.d1) || 0, 10); return (n > 0) ? n : 0; }
 function totalCountOf(p) { return d2Of(p) + d1Of(p); }
 function dash(v) { var s = (v == null) ? "" : String(v).trim(); return s ? s : "-"; }

 // ---------------------------------------------------------------
 // CSS
 // ---------------------------------------------------------------
 function ensureCss() {
  if (cssAdded_) { return; }
  cssAdded_ = 1;
  var st = document.createElement("style");
  st.id = PAGE_ID + "_css";
  st.textContent =
   "#" + PAGE_ID + "{--adm-ember:#8B1E3F;--adm-ember-d:#6E1733;--adm-gold:#c9a45c;--adm-gold-d:#b08d45;--adm-ink:#33302a;--adm-mut:#8a8176;--adm-line:#e7dcc6;--adm-cream:#faf4e6;position:fixed;inset:0;z-index:3000;background:var(--adm-cream);color:var(--adm-ink);font-family:'Segoe UI',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;}" +
   "#" + PAGE_ID + " *,#" + PAGE_ID + " *::before,#" + PAGE_ID + " *::after{box-sizing:border-box;}" +
   ".adm-page{display:flex;flex-direction:column;height:100%;}" +
   ".adm-head{display:flex;align-items:center;gap:12px;padding:12px 18px;background:linear-gradient(135deg,#8B1E3F,#6E1733);color:#fff;box-shadow:0 3px 14px rgba(110,23,51,.35);z-index:2;}" +
   ".adm-head-title{flex:1 1 auto;min-width:0;}" +
   ".adm-head-title h1{margin:0;font-size:21px;line-height:1.2;letter-spacing:.3px;}" +
   ".adm-head-title .adm-kicker{display:block;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#f3dfae;}" +
   ".adm-icon{width:38px;height:38px;border:none;border-radius:50%;background:#fff;color:#8B1E3F;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:transform .15s ease,box-shadow .15s ease;}" +
   ".adm-icon:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.25);}" +
   ".adm-body{flex:1 1 auto;overflow:auto;overscroll-behavior:contain;padding:16px 18px 60px;}" +
   //admin owns its own scroll lock as a class: never write body.style.overflow, which
   //Bootstrap's modal (the menu that opens this page) also manages and resets async
   "body.mr-admin-locked{overflow:hidden;}" +
   ".adm-panel{display:block;animation:admIn .2s ease;}" +
   ".adm-panel-off{display:none;}" +
   "@keyframes admIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}" +
   //search + status + Re-Up + Profl sit on ONE row from tablet up; only phones wrap
   //(the search takes the first line, the select + buttons the second).
   ".adm-toolbar{display:flex;flex-wrap:nowrap;gap:10px;align-items:center;margin-bottom:12px;}" +
   ".adm-search{flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--adm-line);border-radius:40px;padding:0 14px;height:42px;}" +
   ".adm-search i{color:var(--adm-mut);}" +
   ".adm-search input{flex:1 1 auto;min-width:0;border:none;border-bottom:1px solid #d3c39f;outline:none;background:transparent;font-size:14px;color:var(--adm-ink);}" +
   ".adm-toolbar-rt{display:flex;flex-wrap:nowrap;gap:8px;align-items:center;flex:0 0 auto;}" +
   ".adm-toolbar-rt .adm-btn{flex:0 0 auto;white-space:nowrap;}" +
   ".adm-btn{border:none;border-radius:40px;padding:10px 18px;font-size:13.5px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:transform .15s ease,box-shadow .15s ease;}" +
   ".adm-btn:hover{transform:translateY(-1px);}" +
   ".adm-btn-gold{background:linear-gradient(135deg,#c9a45c,#b08d45);color:#3a2c10;box-shadow:0 3px 10px rgba(176,141,69,.35);}" +
   ".adm-btn-ghost{background:#fff;color:#8B1E3F;border:1px solid var(--adm-line);}" +
   ".adm-btn-danger{background:linear-gradient(135deg,#c0392b,#92261a);color:#fff;box-shadow:0 3px 10px rgba(146,38,26,.3);}" +
   ".adm-sel{flex:0 1 160px;width:auto;min-width:0;max-width:38%;height:42px;border:1px solid var(--adm-line);border-radius:40px;padding:0 12px;background:#fff;color:var(--adm-ink);font-size:13.5px;outline:none;cursor:pointer;text-overflow:ellipsis;}" +
   ".adm-state{text-align:center;padding:46px 16px;color:var(--adm-mut);}" +
   ".adm-state .adm-spin{display:inline-block;width:34px;height:34px;border:3px solid var(--adm-line);border-top-color:var(--adm-ember);border-radius:50%;animation:admSpin .7s linear infinite;}" +
   "@keyframes admSpin{to{transform:rotate(360deg)}}" +
   ".adm-state .adm-ico{font-size:30px;color:var(--adm-gold);margin-bottom:8px;}" +
   ".adm-table-wrap{overflow-x:auto;background:#fff;border:1px solid var(--adm-line);border-radius:14px;box-shadow:0 2px 10px rgba(110,23,51,.05);}" +
   ".adm-table{width:100%;border-collapse:collapse;min-width:760px;}" +
   ".adm-table thead th{position:sticky;top:0;background:#8B1E3F;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:.5px;padding:10px 10px;text-align:left;white-space:nowrap;}" +
   ".adm-table tbody td{padding:9px 10px;border-top:1px solid #f0e9d8;font-size:13.5px;vertical-align:middle;}" +
   ".adm-table tbody tr:nth-child(even){background:#fdfaf2;}" +
   ".adm-table tbody tr:hover{background:#f7f0e0;}" +
   ".adm-tb-img img{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid var(--adm-gold);}" +
   ".adm-av{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#8B1E3F,#b08d45);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:17px;}" +
   ".adm-tb-id{color:var(--adm-mut);font-size:12.5px;}" +
   ".adm-tb-name{font-weight:600;color:var(--adm-ink);}" +
   ".adm-tb-sub{font-size:12.5px;color:var(--adm-mut);font-weight:400;}" +
   ".adm-chip{display:inline-block;padding:3px 10px;border-radius:30px;font-size:12px;font-weight:600;white-space:nowrap;border:1px solid transparent;background:#efe9dc;color:#57503f;}" +
   ".adm-chip-s0{background:#efe9dc;color:#57503f;border-color:#d8cfba;}" +
   ".adm-chip-s1{background:#f5e9c8;color:#6d5614;border-color:#e2cc90;}" +
   ".adm-chip-s2{background:#fde6d3;color:#8a4a12;border-color:#f0c7a3;}" +
   ".adm-chip-s-1{background:#f6d9d4;color:#92261a;border-color:#e6b3aa;}" +
   ".adm-chip-s-2,.adm-chip-s-3{background:#f3c9c3;color:#7a1c12;border-color:#d9a49b;}" +
   //red "block this profile" checkbox inside the reject confirmation dialog
   ".adm-block{display:flex;align-items:flex-start;gap:9px;margin:2px 0 12px;padding:10px 12px;border:1px solid #e6b3aa;border-radius:10px;background:#fdf1ef;color:#92261a;font-size:13px;font-weight:600;line-height:1.35;cursor:pointer;}" +
   ".adm-block input{width:16px;height:16px;margin:1px 0 0;accent-color:#92261a;flex:0 0 auto;cursor:pointer;}" +
   ".adm-block span{flex:1 1 auto;}" +
   ".adm-tb-act{white-space:nowrap;text-align:right;}" +
   ".adm-tb-act button{width:32px;height:32px;border:none;border-radius:50%;margin-left:6px;cursor:pointer;font-size:13px;background:#efe9dc;color:#6f5640;transition:transform .12s ease;}" +
   ".adm-tb-act button:hover{transform:translateY(-1px);}" +
   ".adm-tb-act .adm-act-edit{background:#f5e9c8;color:#8B1E3F;}" +
   ".adm-tb-act .adm-act-del{background:#f6d9d4;color:#99261b;}" +
   ".adm-plans{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;}" +
   ".adm-plan{background:#fff;border:1px solid var(--adm-line);border-top:3px solid var(--adm-ember);border-radius:14px;padding:16px;box-shadow:0 3px 12px rgba(110,23,51,.07);display:flex;flex-direction:column;}" +
   ".adm-plan-top{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:2px;}" +
   ".adm-plan-name{font-size:16px;font-weight:700;color:var(--adm-ember);text-transform:uppercase;}" +
   ".adm-plan-id{font-size:11.5px;color:var(--adm-mut);background:#f5f0e2;border-radius:8px;padding:2px 7px;}" +
   ".adm-plan-price{margin:8px 0;font-size:26px;font-weight:800;color:var(--adm-ink);}" +
   ".adm-plan-price small{font-size:12px;font-weight:400;color:var(--adm-mut);}" +
   ".adm-plan-feats{list-style:none;margin:0 0 12px;padding:0;flex:1 1 auto;}" +
   ".adm-plan-feats li{display:flex;align-items:center;gap:9px;padding:4px 0;font-size:13px;color:#5a5347;}" +
   ".adm-plan-feats i{color:var(--adm-gold-d);width:16px;text-align:center;}" +
   ".adm-plan-edit{margin-top:6px;justify-content:center;}" +
   ".adm-plan-tools{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;}" +
   ".adm-plan-hint{font-size:13px;color:var(--adm-mut);}" +
   ".adm-ovl{position:fixed;inset:0;z-index:3100;background:rgba(50,30,20,.45);display:flex;align-items:center;justify-content:center;padding:18px;}" +
   ".adm-dlg{width:min(430px,96vw);max-height:86vh;overflow:auto;background:#fff;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.35);}" +
   ".adm-dlg-top{display:flex;align-items:center;gap:10px;padding:14px 16px;background:#8B1E3F;color:#fff;border-radius:18px 18px 0 0;}" +
   ".adm-dlg-top i{font-size:15px;color:#f3dfae;}" +
   ".adm-dlg-title{font-size:16px;font-weight:700;color:var(--adm-ember);padding:16px 16px 0;}" +
   ".adm-dlg-sub{font-size:13px;color:var(--adm-mut);margin:6px 0 12px;}" +
   ".adm-dlg-body{padding:6px 16px 4px;}" +
   ".adm-field{margin-bottom:11px;}" +
   ".adm-field label{display:block;font-size:12px;color:var(--adm-mut);margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px;}" +
   ".adm-input{width:100%;border:1px solid var(--adm-line);border-radius:10px;padding:9px 12px;font-size:14px;color:var(--adm-ink);outline:none;background:#fff;}" +
   ".adm-input:focus{border-color:var(--adm-gold);box-shadow:0 0 0 3px rgba(201,164,92,.18);}" +
   ".adm-ta{resize:vertical;min-height:70px;font-family:inherit;}" +
   ".adm-dlg-err{display:none;background:#f6d9d4;color:#92261a;border-radius:10px;padding:9px 12px;font-size:13px;margin:4px 16px 0;}" +
   ".adm-dlg-foot{display:flex;justify-content:flex-end;gap:10px;padding:14px 16px 16px;}" +
   ".adm-dlg{position:relative;}" +
   ".adm-dlg-sm{width:min(300px,92vw);}" +
   ".adm-dlg-x{position:absolute;top:6px;right:8px;border:none;background:transparent;color:var(--adm-mut);font-size:20px;line-height:1;cursor:pointer;padding:2px 7px;border-radius:8px;}" +
   ".adm-dlg-x:hover{color:var(--adm-ember);background:#f5f0e2;}" +
   ".adm-dlg-sm .adm-dlg-body{padding:20px 14px 4px;}" +
   ".adm-dlg-sm .adm-dlg-foot{padding:8px 14px 12px;}" +
   ".adm-radios{display:flex;flex-direction:column;gap:6px;}" +
   ".adm-radio{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--adm-ink);padding:7px 10px;border:1px solid var(--adm-gold);border-radius:8px;background:#fff;cursor:pointer;}" +
   ".adm-radio:hover{background:var(--adm-cream);}" +
   ".adm-radio input{accent-color:var(--adm-ember);margin:0;}" +
   ".adm-radio:has(input:checked){border-color:var(--adm-ember);background:var(--adm-cream);box-shadow:0 0 0 2px rgba(201,164,92,.25);}" +
   ".adm-tb-status{cursor:pointer;}" +
   ".adm-tb-status:hover .adm-chip{filter:brightness(.96);}" +
   ".adm-toolbar-main{display:flex;flex-wrap:nowrap;gap:10px;align-items:center;flex:1 1 auto;min-width:0;}" +
   ".adm-reup-on .adm-toolbar-main{display:none;}" +
   ".adm-tb-back{display:none;flex:1 1 auto;gap:12px;align-items:center;flex-wrap:wrap;}" +
   ".adm-reup-on .adm-tb-back{display:flex;}" +
   //phones: search takes its own full-width line, then the status select + the two
   //buttons share the next line (select grows; Re-Up/Profl keep their icons and size)
   "@media(max-width:640px){" +
   ".adm-toolbar-main{flex-wrap:wrap;gap:8px;}" +
   ".adm-search{flex:1 1 100%;padding:0 10px;}" +
   ".adm-toolbar-rt{flex:1 1 100%;min-width:0;gap:6px;}" +
   ".adm-sel{flex:1 1 auto;max-width:none;padding:0 10px;font-size:13px;}" +
   "}" +
   ".adm-reup-title{font-size:15.5px;font-weight:700;color:#fff;}" +
   ".adm-reup-hint{font-size:12.5px;color:var(--adm-mut);margin:0 0 10px;}" +
   ".adm-reup{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;}" +
   ".adm-ru{background:#fff;border:1px solid var(--adm-line);border-top:3px solid var(--adm-ember);border-radius:14px;padding:14px;box-shadow:0 3px 12px rgba(110,23,51,.07);display:flex;flex-direction:column;gap:10px;}" +
   ".adm-ru-top{display:flex;align-items:center;gap:10px;}" +
   ".adm-ru-top img{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid var(--adm-gold);flex:0 0 auto;}" +
   ".adm-ru-id{min-width:0;flex:1 1 auto;}" +
   ".adm-ru-when{font-size:12px;color:var(--adm-mut);white-space:nowrap;}" +
   ".adm-ru-sec{font-size:11.5px;text-transform:uppercase;letter-spacing:.4px;color:var(--adm-mut);}" +
   ".adm-ru-hero{width:100%;height:150px;border-radius:10px;object-fit:cover;border:1px solid var(--adm-line);background:#f5f0e2;display:block;margin-top:3px;}" +
   ".adm-ru-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(56px,1fr));gap:6px;margin-top:3px;}" +
   ".adm-ru-gal img{width:100%;height:56px;object-fit:cover;border-radius:8px;border:1px solid var(--adm-line);}" +
   ".adm-ru-empty{font-size:12.5px;color:var(--adm-mut);}" +
   ".adm-ru-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto;flex-wrap:nowrap;}" +
   ".adm-ru-foot>.adm-chip{flex:0 0 auto;}" +
   ".adm-ru-foot>.adm-btn{flex:0 1 auto;min-width:0;white-space:nowrap;overflow:hidden;padding:8px 12px;font-size:12.5px;}" +
   "@media(max-width:560px){.adm-head-title h1{font-size:18px;}.adm-reup-title{font-size:14px;}.adm-ru-foot{gap:6px;}.adm-ru-foot>.adm-chip{font-size:11px;padding:2px 7px;}.adm-ru-foot>.adm-btn{flex:1 1 0;justify-content:center;padding:7px 8px;font-size:11.5px;gap:5px;}}" +
   "@media(max-width:380px){.adm-ru-foot{gap:5px;}.adm-ru-foot>.adm-chip{font-size:10.5px;padding:2px 6px;}.adm-ru-foot>.adm-btn{padding:7px 5px;font-size:11px;gap:4px;}.adm-ru-foot>.adm-btn i{display:none;}}" +
   ".adm-cardsview{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.45);color:#fff;border-radius:20px;padding:7px 13px;font-size:12.5px;cursor:pointer;user-select:none;white-space:nowrap;}" +
   ".adm-cardsview input{width:15px;height:15px;accent-color:var(--adm-gold);cursor:pointer;margin:0;}" +
   
   /* Card view CSS */
   ".adm-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;}" +
   ".adm-pc{background:#fff;border:1px solid var(--adm-line);border-top:3px solid var(--adm-ember);border-radius:14px;padding:16px;box-shadow:0 3px 12px rgba(110,23,51,.07);display:flex;gap:14px;align-items:flex-start;}" +
   ".adm-pc-img{flex:0 0 auto;}" +
   ".adm-pc-img img{width:60px;height:60px;border-radius:50%;object-fit:cover;border:2px solid var(--adm-gold);display:block;}" +
   ".adm-pc-img .adm-av{width:60px;height:60px;font-size:22px;}" +
   ".adm-pc-body{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px;}" +
   ".adm-pc-idrow{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;margin-bottom:2px;}" +
   ".adm-pc-idrow .id{color:var(--adm-mut);font-size:12.5px;}" +
   ".adm-pc-idrow .uid{color:var(--adm-mut);font-size:12.5px;}" +
   ".adm-pc-name{font-weight:700;font-size:15px;color:var(--adm-ink);margin-bottom:2px;}" +
   ".adm-pc-counts{font-size:13px;font-weight:600;color:var(--adm-ink);}" +
   ".adm-pc-counts span{font-weight:400;color:var(--adm-mut);}" +
   ".adm-pc-mob{font-size:13px;color:var(--adm-ink);margin-top:2px;}" +
   ".adm-pc-statusrow{display:flex;align-items:center;gap:10px;margin-top:4px;}" +
   ".adm-pc-date{font-size:12px;color:var(--adm-mut);}" +
   ".adm-pc-acts{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;}" +
   ".adm-pc-acts button{border:none;cursor:pointer;border-radius:6px;padding:5px 10px;font-size:12px;display:inline-flex;align-items:center;gap:4px;background:#f5f0e2;color:var(--adm-ink);}" +
   ".adm-pc-acts .adm-act-view{background:#eef4ee;color:#2e7d32;}" +
   ".adm-pc-acts .adm-act-edit{background:#fdf3e2;color:#9a6b12;}" +
   ".adm-pc-acts .adm-act-del{background:#fbe9e7;color:#b3261e;}" +
   ".adm-pc-acts button:hover{filter:brightness(.95);}";
  var head = document.head || document.documentElement;
  head.appendChild(st);
 }

 function admClear() {
  try { ["x1", "x2", "x3", "la", "vw", "drml", "cd"].forEach(function (k) { delete payload0[k]; }); } catch (eC) { }
 }

 function maxDate(tbs) {
  return new Promise(function (res) {
   try {
    if (typeof dbDexieManager === "undefined" || !dbDexieManager ||
     typeof dbDexieManager.getMaxDateRecords !== "function" ||
     typeof dbnm === "undefined" || !dbnm) { res(null); return; }
    dbDexieManager.getMaxDateRecords(dbnm, tbs).then(
     function (v) { res(v); },
     function () { res(null); });
   } catch (eM) { res(null); }
  });
 }

 function localRows(tbl) {
  return new Promise(function (res) {
   try {
    if (typeof dbDexieManager === "undefined" || !dbDexieManager ||
     typeof dbDexieManager.getAllRecords !== "function" ||
     typeof dbnm === "undefined" || !dbnm) { res(null); return; }
    dbDexieManager.getAllRecords(dbnm, tbl).then(
     function (v) { res(v || null); },
     function () { res(null); });
   } catch (eR) { res(null); }
  });
 }

 async function loadProfilesFromDexie() {
  setStateIdle("admProfilesState");
  try {
   var local = await localRows("mr");
   rows_ = Array.isArray(local) ? local : [];
   try { cRows_ = (await localRows("c")) || []; } catch (eC) { cRows_ = []; }
   try { muRows_ = (await localRows("mu")) || []; } catch (eM) { muRows_ = []; }
   renderProfiles();
  } catch (err) {
   setStateErr("admProfilesState", (err && err.message) || "Could not read local profiles.");
  }
 }

 async function syncProfiles() {
  try {
   if (typeof clearPayload0 === "function") { clearPayload0(); }
   payload0.vw = 4;
   payload0.fn = 60;
   payload0.la = await maxDate([{ tb: "c" }, { tb: "mr" }, { tb: "mq" }, { tb: "ma" }, { tb: "mu" }]);
   var r = await fnj3("https://my1.in/2/e.php", payload0, 1, true, null, 20000, 0, 1, 1, 1);
   admClear();
   if (r && r.su == 1) {
    try {
     if (typeof handl_mr_rspons === "function") { await handl_mr_rspons(r); }
    } catch (eH) { }
    return 1;
   }
   toast((r && (r.ms || r.m)) || "Sync failed; showing saved profiles.", "error");
   return 0;
  } catch (err) {
   admClear();
   toast("Sync failed: " + ((err && err.message) || err) + " \u2014 showing saved profiles.", "error");
   return 0;
  }
 }

 async function loadProfiles() {
  setStateIdle("admProfilesState");
  await syncProfiles();
  if (reUpOpen_) { await loadReUpFromDexie(); return; }
  await loadProfilesFromDexie();
 }

 async function loadPlansFromDexie() {
  var st = document.getElementById("admPlansState");
  if (st) { st.innerHTML = '<div class="adm-spin"></div>'; }
  try {
   var local = await localRows("mp");
   planRows_ = Array.isArray(local) ? local : [];
   renderPlans();
  } catch (err) {
   setStateErr("admPlansState", (err && err.message) || "Could not read local plans.");
  }
 }

 async function loadPlans() {
  var st = document.getElementById("admPlansState");
  if (st) { st.innerHTML = '<div class="adm-spin"></div>'; }
  try {
   if (typeof clearPayload0 === "function") { clearPayload0(); }
   payload0.vw = 4;
   payload0.fn = 61;
   payload0.la = await maxDate([{ tb: "mp" }]);
   var r = await fnj3("https://my1.in/2/g.php", payload0, 1, true, null, 20000, 0, 1, 1, 1);
   admClear();
   if (r && r.su == 1) {
    try {
     if (typeof handl_mr_rspons === "function") { await handl_mr_rspons(r); }
    } catch (eH) { }
    await loadPlansFromDexie();
   } else {
    await loadPlansFromDexie();
    toast((r && (r.ms || r.m)) || "Sync failed; showing saved plans.", "error");
   }
  } catch (err) {
   admClear();
   await loadPlansFromDexie();
   toast("Sync failed: " + ((err && err.message) || err) + " \u2014 showing saved plans.", "error");
  }
 }

 //"last added first": sort by the Added date (rd), falling back to the profile id
 //when a row has no usable date. Both the table and the card view use this order.
 function addedTs(p) {
  var raw = (p && p.rd != null) ? String(p.rd).trim() : "";
  if (!raw) { return NaN; }
  var d = new Date(raw.indexOf("-") >= 0 ? raw.replace(/-/g, "/") : raw);
  return isNaN(d.getTime()) ? NaN : d.getTime();
 }
 function newestFirst(x, y) {
  var tx = addedTs(x), ty = addedTs(y);
  var hasX = !isNaN(tx), hasY = !isNaN(ty);
  if (hasX && hasY && tx !== ty) { return ty - tx; }   //newest added date first
  if (hasX !== hasY) { return hasX ? -1 : 1; }         //dated rows before undated
  return Number(y.a || 0) - Number(x.a || 0);          //fallback: highest id first
 }

 function filteredRows() {
  var s = search_.toLowerCase();
  return rows_.filter(function (p) {
   if (status_ !== "" && String(p.d) !== String(status_)) { return false; }
   if (!s) { return true; }
   return String(p.m || "").toLowerCase().indexOf(s) >= 0 ||
    String(p.n || "").toLowerCase().indexOf(s) >= 0 ||
    String(p.l || "").toLowerCase().indexOf(s) >= 0 ||
    String(p.a || "").toLowerCase().indexOf(s) >= 0 ||
    String(p.w || "").toLowerCase().indexOf(s) >= 0;
  }).sort(newestFirst);
 }

 function renderProfiles() {
  var state = document.getElementById("admProfilesState");
  var wrap = document.getElementById("admTableWrap");
  if (!wrap) { return; }
  var list = filteredRows();
  if (!rows_.length) {
   if (state) { state.innerHTML = '<div class="adm-ico"><i class="fa-solid fa-users"></i></div><div>No profiles yet.</div><div style="font-size:12.5px;margin-top:6px">Use <b>Refresh</b> to sync from the server.</div>'; }
   wrap.innerHTML = "";
   return;
  }
  if (!list.length) {
   if (state) { state.innerHTML = '<div class="adm-ico"><i class="fa-solid fa-magnifying-glass"></i></div><div>No profiles match the current filters.</div>'; }
   wrap.innerHTML = "";
   return;
  }
  if (state) { state.innerHTML = ""; }
  
  if (cardsView_) {
   var cardsHtml = "";
   for (var ci = 0; ci < list.length; ci++) { cardsHtml += profileCardHtml(list[ci]); }
   wrap.innerHTML = '<div class="adm-cards">' + cardsHtml + "</div>";
   if (window.mrImg) { try { window.mrImg.hydrate(wrap); } catch (eHC) { } }
   return;
  }
  
  var head =
   "<table class='adm-table' summary='Profiles'>" +
   "<thead><tr>" +
   "<th>Photo</th><th>ID</th><th>UID</th><th>Free + Paid</th><th>Used</th><th>Name</th><th>Mobile</th><th>Status</th><th>Native place</th><th>Added</th><th></th>" +
   "</tr></thead><tbody>";
  var trs = "";
  for (var i = 0; i < list.length; i++) {
   trs += rowHtml(list[i]);
  }
  wrap.innerHTML = head + trs + "</tbody></table>";
  if (window.mrImg) { try { window.mrImg.hydrate(wrap); } catch (eH) { } }
 }

 function rowHtml(p) {
  var av = thumbOf(p);
  var photo = av ? '<img data-lazy="' + esc(av) + '" alt="" loading="lazy" decoding="async">' : '<div class="adm-av">' + esc(((p && p.m) || "?").charAt(0).toUpperCase()) + '</div>';
  var chip = "adm-chip-s" + String(p.d == null ? "" : p.d);
  var stNm = statusName(p.d);
  var city = cityOf(placePathOf(p, "b2"));
  var added = ((function(){ var rawAdded = (p.rd != null && String(p.rd).trim() !== "") ? p.rd : ""; return rawAdded ? fmtDate(rawAdded) : "-"; })());
  return "<tr>" +
   '<td class="adm-tb-img">' + photo + "</td>" +
   '<td><div class="adm-tb-id">#' + esc(p.a) + "</div></td>" +
   '<td><div class="adm-tb-id">' + esc(dash(p.w)) + "</div></td>" +
   "<td>" + esc(totalCountOf(p)) + "</td>" +
   "<td>" + esc(usedCountOf(p)) + "</td>" +
   '<td><div class="adm-tb-name">' + esc(dash(p.m)) + '</div><div class="adm-tb-sub">' + esc(dash(p.n)) + "</div></td>" +
   "<td>" + esc(dash(phoneOf(p.l))) + "</td>" +
   '<td class="adm-tb-status" data-act="status" data-id="' + esc(p.a) + '" data-d="' + esc(p.d == null ? "" : p.d) + '"><span class="adm-chip ' + chip + '">' + esc(stNm) + "</span></td>" +
   "<td>" + esc(dash(city)) + "</td>" +
   "<td>" + esc(added) + "</td>" +
   '<td class="adm-tb-act">' +
   '<button data-act="view" data-id="' + esc(p.a) + '" title="View" class="adm-act-view"><i class="fa-solid fa-eye"></i></button>' +
   '<button data-act="edit" data-id="' + esc(p.a) + '" title="Edit" class="adm-act-edit"><i class="fa-solid fa-pen"></i></button>' +
   '<button data-act="del" data-id="' + esc(p.a) + '" title="Delete" class="adm-act-del"><i class="fa-solid fa-trash"></i></button>' +
   "</td></tr>";
 }

 function profileCardHtml(p) {
  var av = thumbOf(p);
  var photo = av ? '<img data-lazy="' + esc(av) + '" alt="" loading="lazy" decoding="async">' : '<div class="adm-av">' + esc(((p && p.m) || "?").charAt(0).toUpperCase()) + '</div>';
  var chip = "adm-chip-s" + String(p.d == null ? "" : p.d);
  var stNm = statusName(p.d);
  
  // Mobile from table "c" where c.a = mr.e
  var mobVal = mobileOfProfile(p);
  var mobHtml = mobVal ? '<div class="adm-pc-mob"><i class="fa-solid fa-mobile-screen"></i> ' + esc(mobVal) + '</div>' : '';
  
  // Counts
  var countsHtml = '<div class="adm-pc-counts">' + esc(d2Of(p)) + ', ' + esc(d1Of(p)) + ', ' + esc(usedCountOf(p)) + ' <span>//free, paid, used</span></div>';
  
  // Date
  var added = ((function(){ var rawAdded = (p.rd != null && String(p.rd).trim() !== "") ? p.rd : ""; return rawAdded ? fmtDate(rawAdded) : ""; })());
  var dateHtml = added ? '<span class="adm-pc-date"><i class="fa-regular fa-calendar" style="margin-right:4px;"></i>' + esc(added) + '</span>' : '';

  return '<div class="adm-pc">' +
   '<div class="adm-pc-img">' + photo + '</div>' +
   '<div class="adm-pc-body">' +
     '<div class="adm-pc-idrow">' +
       '<span class="id">#' + esc(p.a) + '</span>' +
       '<span class="uid">' + esc(dash(p.w)) + '</span>' +
     '</div>' +
     '<div class="adm-pc-name">' + esc(dash(p.m)) + '</div>' +
     countsHtml +
     mobHtml +
     '<div class="adm-pc-statusrow">' +
       '<span class="adm-chip ' + chip + '" data-act="status" data-id="' + esc(p.a) + '" data-d="' + esc(p.d == null ? "" : p.d) + '" style="cursor:pointer;">' + esc(stNm) + '</span>' +
       dateHtml +
     '</div>' +
     '<div class="adm-pc-acts">' +
       '<button data-act="view" data-id="' + esc(p.a) + '" class="adm-act-view"><i class="fa-solid fa-eye"></i> View</button>' +
       '<button data-act="edit" data-id="' + esc(p.a) + '" class="adm-act-edit"><i class="fa-solid fa-pen"></i> Edit</button>' +
       '<button data-act="del" data-id="' + esc(p.a) + '" class="adm-act-del"><i class="fa-solid fa-trash"></i> Delete</button>' +
     '</div>' +
   '</div>' +
   '</div>';
 }

 function planVal(v) {
  return (v === undefined || v === null || v === "") ? "" : (String(v) === "-1" ? "Unlimited" : v);
 }

 function renderPlans() {
  var state = document.getElementById("admPlansState");
  var grid = document.getElementById("admPlansGrid");
  if (!grid) { return; }
  if (!planRows_.length) {
   if (state) { state.innerHTML = '<div class="adm-ico"><i class="fa-solid fa-book"></i></div><div>No plans found.</div><div style="font-size:12.5px;margin-top:6px">Use <b>Refresh plans</b> to sync from the server.</div>'; }
   grid.innerHTML = "";
   return;
  }
  if (state) { state.innerHTML = ""; }
  var html = "";
  for (var i = 0; i < planRows_.length; i++) {
   var p = planRows_[i] || {};
   var feats = "";
   if (p.f !== undefined) { feats += '<li><i class="fa-solid fa-mobile-screen"></i><span>Mobile unlocks \u2013 <b>' + esc(planVal(p.f)) + '</b></span></li>'; }
   if (p.g !== undefined) { feats += '<li><i class="fa-solid fa-comments"></i><span>Chats \u2013 <b>' + esc(planVal(p.g)) + '</b></span></li>'; }
   if (p.i !== undefined) { feats += '<li><i class="fa-solid fa-user-friends"></i><span>Profile browsing \u2013 <b>' + esc(planVal(p.i)) + '</b></span></li>'; }
   if (p.h !== undefined) { feats += '<li><i class="fa-solid fa-eye"></i><span>Profile views \u2013 <b>' + esc(planVal(p.h)) + '</b></span></li>'; }
   html += '<div class="adm-plan">' +
    '<div class="adm-plan-top"><span class="adm-plan-name">' + esc(p.e || "Plan") + '</span><span class="adm-plan-id">ID #' + esc(p.a) + '</span></div>' +
    '<div class="adm-plan-price">\u20B9 ' + esc(p.j == null ? "0" : planVal(p.j)) + " <small>/ month</small></div>" +
    (feats ? '<ul class="adm-plan-feats">' + feats + "</ul>" : "") +
    '<button type="button" class="adm-btn adm-btn-gold adm-plan-edit" data-plan="' + esc(p.a) + '"><i class="fa-solid fa-pen-to-square"></i> Edit plan</button>' +
    "</div>";
  }
  grid.innerHTML = html;
 }

 function setStateIdle(id) {
  var el = document.getElementById(id);
  if (el && !el.classList.contains("adm-state")) { return; }
  if (el) { el.innerHTML = '<div class="adm-spin"></div>'; }
 }

 function setStateErr(id, msg) {
  var el = document.getElementById(id);
  if (!el) { return; }
  el.innerHTML = '<div class="adm-ico"><i class="fa-solid fa-triangle-exclamation"></i></div><div>' + esc(msg) + '</div>';
 }

 window.openMrAdmin = function () {
  if (open_) {
   var root = document.getElementById(PAGE_ID);
   if (root && root.style.display === "none") { root.style.display = ""; }
   return;
  }
  open_ = 1;
  ensureCss();
  loadCardsPref();
  savedScrollY_ = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  document.body.classList.add("mr-admin-locked");
  buildPage();
  loadProfilesFromDexie();
 };

 function buildPage() {
  var prev = document.getElementById(PAGE_ID);
  if (prev && prev.parentNode) { prev.parentNode.removeChild(prev); }
  var root = document.createElement("div");
  root.id = PAGE_ID;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.innerHTML =
   "<div class='adm-page'>" +
   "<header class='adm-head'>" +
   "<button type='button' class='adm-icon' data-act='close' title='Back'><i class='fa-solid fa-arrow-left'></i></button>" +
   "<div class='adm-head-title'><span class='adm-kicker'>my1 matrimony</span><h1 class='text-white'>Admin Dashboard</h1></div>" +
   "<label class='adm-cardsview' title='Toggle card view'><input type='checkbox' id='admCardsView'" + (cardsView_ ? " checked" : "") + "><span>Cards view</span></label>" +
   "<button type='button' class='adm-icon' data-act='refresh' title='Refresh'><i class='fa-solid fa-rotate-right'></i></button>" +
   "</header>" +
   "<div class='adm-body'>" +
   "<section class='adm-panel' id='admPanelProfiles'>" +
   "<div class='adm-toolbar'>" +
   "<div class='adm-tb-back'><button type='button' class='adm-btn adm-btn-ghost' data-act='reupback'><i class='fa-solid fa-arrow-left'></i> Back to profiles</button><span class='adm-reup-title'>Image update requests</span></div>" +
   "<div class='adm-toolbar-main' id='admToolbarMain'>" +
   "<div class='adm-search'><i class='fa-solid fa-magnifying-glass'></i><input type='search' id='admSearch' placeholder='Search name, father, mobile or ID...'></div>" +
   "<div class='adm-toolbar-rt'>" +
   "<select id='admStatus' class='adm-sel' aria-label='Status'></select>" +
   "<button type='button' class='adm-btn adm-btn-gold' id='reUpProfile'><i class='fa-solid fa-rotate'></i> Re-Up</button>" +
   "<button type='button' class='adm-btn adm-btn-gold' id='admAddProfile'><i class='fa-solid fa-user-plus'></i> Profl</button>" +
   "</div></div>" +
   "</div>" +
   "<div class='adm-state d-none' id='admProfilesState'></div>" +
   "<div class='adm-table-wrap' id='admTableWrap'></div>" +
   "</section>" +
   "<section class='adm-panel adm-panel-off' id='admPanelPlans'>" +
   "<div class='adm-plan-tools'><span class='adm-plan-hint'>Manage subscription plans (update via fn 65)</span>" +
   "<button type='button' class='adm-btn adm-btn-ghost' data-act='loadplans'><i class='fa-solid fa-rotate-right'></i> Refresh plans</button></div>" +
   "<div class='adm-state' id='admPlansState'></div>" +
   "<div class='adm-plans' id='admPlansGrid'></div>" +
   "</section>" +
   "</div></div>";
  document.body.appendChild(root);

  var sEl = root.querySelector("#admStatus");
  var list = statusList();
  sEl.innerHTML = '<option value="">All statuses</option>' + list.map(function (s) {
   return '<option value="' + esc(s.a) + '">' + esc(s.e) + "</option>";
  }).join("");

  root.addEventListener("click", function (e) {
   var t = e.target;
   var node = t && t.closest ? t : null;
   var rowBtn = node ? node.closest('[data-act="view"],[data-act="edit"],[data-act="del"]') : null;
   if (rowBtn && root.contains(rowBtn)) {
    var rid = rowBtn.getAttribute("data-id");
    var rAct = rowBtn.getAttribute("data-act");
    if (rAct === "view") { viewProfile(rid); }
    else if (rAct === "edit") { openReg(rid); }
    else if (rAct === "del") { confirmDelete(rid); }
    return;
   }
   var stCell = node ? node.closest('[data-act="status"]') : null;
   if (stCell && root.contains(stCell)) { openStatus(findRow(stCell.getAttribute("data-id"))); return; }
   var addBtn = node ? node.closest("#admAddProfile") : null;
   if (addBtn && root.contains(addBtn)) { openReg(null); return; }
   var reUpBtn = node ? node.closest("#reUpProfile") : null;
   if (reUpBtn && root.contains(reUpBtn)) { openReUp(); return; }
   var backBtn = node ? node.closest('[data-act="reupback"]') : null;
   if (backBtn && root.contains(backBtn)) { closeReUp(); return; }
   var ruBtn = node ? node.closest('[data-act="reup-accept"],[data-act="reup-reject"]') : null;
   if (ruBtn && root.contains(ruBtn)) {
    var ruId = ruBtn.getAttribute("data-id");
    var ruKind = ruBtn.getAttribute("data-act") === "reup-accept" ? "accept" : "reject";
    for (var k = 0; k < mqRows_.length; k++) {
     if (String(mqRows_[k].a) === String(ruId)) { confirmReUp(mqRows_[k], ruKind); break; }
    }
    return;
   }
   var planBtn = node ? node.closest("[data-plan]") : null;
   if (planBtn && root.contains(planBtn)) {
    var pid = planBtn.getAttribute("data-plan");
    for (var i = 0; i < planRows_.length; i++) {
     if (String(planRows_[i].a) === String(pid)) { editPlan(planRows_[i]); break; }
    }
    return;
   }
   var actBtn = node ? node.closest('[data-act="close"],[data-act="refresh"],[data-act="loadplans"]') : null;
   if (actBtn && root.contains(actBtn)) {
    var act = actBtn.getAttribute("data-act");
    if (act === "close") { closeAdmin(); }
    else if (act === "refresh") { loadProfiles(); }
    else if (act === "loadplans") { loadPlans(); }
   }
  });

  root.querySelector("#admSearch").addEventListener("input", function () {
   search_ = this.value;
   renderProfiles();
  });
  sEl.addEventListener("change", function () {
   status_ = this.value;
   renderProfiles();
  });
  var cv = root.querySelector("#admCardsView");
  if (cv) {
   cv.addEventListener("change", function () {
    cardsView_ = this.checked ? 1 : 0;
    saveCardsPref();
    if (reUpOpen_) { return; }
    renderProfiles();
   });
  }
  pageKeyH_ = function (e) {
   if (e.key !== "Escape") { return; }
   var rr = document.getElementById(REGIS_ID);
   var dd = document.getElementById(DLG_ID);
   var pv = document.getElementById(MODAL_PROFILE_ID);
   if (rr || dd || pv) { return; }
   if (reUpOpen_) { closeReUp(); return; }
   closeAdmin();
  };
  document.addEventListener("keydown", pageKeyH_);
 }

 function switchTab(name, root) {
  tab_ = name;
  var tabs = root.querySelectorAll(".adm-tab");
  for (var i = 0; i < tabs.length; i++) {
   tabs[i].classList.toggle("adm-tab-on", tabs[i].getAttribute("data-tab") === name);
  }
  var prof = root.querySelector("#admPanelProfiles");
  var plans = root.querySelector("#admPanelPlans");
  if (prof) { prof.classList.toggle("adm-panel-off", name !== "profiles"); }
  if (plans) { plans.classList.toggle("adm-panel-off", name !== "plans"); }
  if (name === "plans" && !planRows_.length) { loadPlansFromDexie(); }
 }

 function closeAdmin() {
  if (!open_) { return; }
  open_ = 0;
  reUpOpen_ = 0;
  mqRows_ = [];
  try { document.body.classList.remove("mr-admin-locked"); } catch (eO) { }
  //put the page back where the member left it; scroll-behavior:smooth (Bootstrap
  //reboot) would turn this into an animation, so force an instant jump
  if (savedScrollY_) {
   var y = savedScrollY_;
   savedScrollY_ = 0;
   try {
    var de = document.documentElement;
    var prevSb = de.style.scrollBehavior;
    de.style.scrollBehavior = "auto";
    window.scrollTo(0, y);
    if (prevSb) { de.style.scrollBehavior = prevSb; } else { de.style.removeProperty("scroll-behavior"); }
   } catch (eS) { }
  }
  if (pageKeyH_) {
   try { document.removeEventListener("keydown", pageKeyH_); } catch (eK) { }
   pageKeyH_ = null;
  }
  var dlgs = document.getElementById(DLG_ID);
  if (dlgs && dlgs.parentNode) { dlgs.parentNode.removeChild(dlgs); }
  var root = document.getElementById(PAGE_ID);
  if (root && root.parentNode) { root.parentNode.removeChild(root); }
 }

 function findRow(id) {
  for (var i = 0; i < rows_.length; i++) {
   if (String(rows_[i].a) === String(id)) { return rows_[i]; }
  }
  return null;
 }

 function viewProfile(id) {
  var p = findRow(id);
  if (!p) { return; }
  if (typeof showProfileDtls === "function") {
   try {
    showProfileDtls(p.a);
   } catch (eV) {
    openReg(p.a);
    return;
   }
  } else {
   openReg(p.a);
   return;
  }
  raiseOverlay(MODAL_PROFILE_ID);
 }

 function raiseOverlay(id) {
  var tries = 0;
  var t = setInterval(function () {
   tries++;
   var ov = document.getElementById(id);
   if (ov) {
    try {
     if (ov.style.zIndex !== "3200") { ov.style.zIndex = "3200"; }
    } catch (eZ) { }
    clearInterval(t);
    return;
   }
   if (tries >= 15) { clearInterval(t); }
  }, 200);
 }

 function openReg(id) {
  function bump() {
   var ov = document.getElementById(REGIS_ID);
   if (ov) { ov.style.zIndex = "3200"; }
  }
  try {
   loadExe2Fn(14, [id, { admin: true }], [1]);
   setTimeout(bump, 400);
   return;
  } catch (eL) { }
  if (typeof showRegistrationModal === "function") {
   try {
    showRegistrationModal(id, { admin: true });
    bump();
    return;
   } catch (eR) { }
  }
  toast("Could not open the profile form.", "error");
 }

 function confirmDelete(id) {
  var p = findRow(id);
  if (!p) { return; }
  var nm = (p.m || "profile #" + p.a);
  var body = "<p class='adm-dlg-sub'>This sends an admin delete request (fn 67). The reason is recorded with the request.</p>" +
   '<div class="adm-field"><label for="admDelReason">Reason for removal</label>' +
   '<textarea id="admDelReason" class="adm-input adm-ta" rows="3" placeholder="e.g. duplicate entry, wrong details, member request..."></textarea></div>' +
   '<div class="adm-dlg-err" id="admDelErr"></div>';
  var ctl = null;
  ctl = openDlg({
   icon: "fa-trash-can",
   title: "Delete profile — " + nm,
   body: body,
   okLabel: "Delete",
   cancelLabel: "Keep profile",
   onOk: function () {
    var reason = (ctl.q("#admDelReason") ? ctl.q("#admDelReason").value : "").trim();
    if (!reason) {
     var errEl = ctl.q("#admDelErr");
     if (errEl) { errEl.style.display = "block"; errEl.textContent = "A reason is required."; }
     return;
    }
    ctl.close();
    doDelete(p, reason);
   },
   onCancel: function () { if (ctl) { ctl.close(); } }
  });
 }

 async function doDelete(p, reason) {
  try {
   var x2 = (p.l != null && String(p.l).trim() !== "") ? String(p.l).trim() : (p.w || "");
   if (typeof clearPayload0 === "function") { clearPayload0(); }
   payload0.vw = 4;
   payload0.fn = 67;
   payload0.x1 = reason;
   payload0.x2 = x2;
   payload0.x3 = p.m || "";
   var r = await fnj3("https://my1.in/2/h.php", payload0, 1, true, null, 20000, 0, 1, 1, 1);
   admClear();
   if (r && (r.su == 1 || (r.cd != null && Number(r.cd) > 0))) {
    toast("Profile removed.", "success");
    for (var i = 0; i < rows_.length; i++) {
     if (String(rows_[i].a) === String(p.a)) { rows_.splice(i, 1); break; }
    }
    renderProfiles();
   } else {
    toast((r && (r.ms || r.m)) || "Delete failed.", "error");
   }
  } catch (err) {
   toast("Delete failed: " + ((err && err.message) || err), "error");
  }
 }

 function openStatus(p) {
  if (!p) { return; }
  var cur = (p.d == null ? "" : String(p.d));
  var body = '<div id="admStatusUpd" class="adm-radios mt-2" role="radiogroup" aria-label="Status">' +
  statusList().map(function (o) {
    return '<label class="adm-radio"><input type="radio" name="admStatusUpd" value="' + esc(o.a) + '"' +
     (String(o.a) === cur ? " checked" : "") + '><span>' + esc(o.e) + '</span></label>';
   }).join("") +
   "</div>";
  var ctl = null;
  ctl = openDlg({
   compact: true,
   body: body,
   okLabel: "Update",
   onOk: function () {
    var picked = ctl.q('#admStatusUpd input[name="admStatusUpd"]:checked');
    var v = picked ? picked.value : "";
    ctl.close();
    updateStatus(p, v);
   },
   onCancel: function () { if (ctl) { ctl.close(); } }
  });
 }

 async function updateStatus(p, val) {
  try {
   if (typeof clearPayload0 === "function") { clearPayload0(); }
   payload0.vw = 4;
   payload0.fn = 63;
   payload0.la = await maxDate([{ tb: "mr" }]);
   payload0.x1 = p.a;
   payload0.x2 = { e: p.e, f: p.f, d: val };
   var r = await fnj3("https://my1.in/2/f.php", payload0, 1, true, null, 20000, 0, 1, 1, 1);
   admClear();
   if (r && r.su == 1) {
    toast("Status updated.", "success");
    try {
     if (typeof handl_mr_rspons === "function") { await handl_mr_rspons(r); }
    } catch (eH) { }
    await loadProfilesFromDexie();
   } else {
    toast((r && (r.ms || r.m)) || "Update failed.", "error");
   }
  } catch (err) {
   admClear();
   toast("Update failed: " + ((err && err.message) || err), "error");
  }
 }

 function editPlan(plan) {
  var f = plan.f == null ? "" : plan.f;
  var g = plan.g == null ? "" : plan.g;
  var i = plan.i == null ? "" : plan.i;
  var h = plan.h == null ? "" : plan.h;
  var j = plan.j == null ? "" : plan.j;
  var body =
   '<div class="adm-field"><label for="admPlE">Plan name</label>' +
   '<input id="admPlE" class="adm-input" type="text" value="' + esc(plan.e || "") + '"></div>' +
   '<div class="adm-field"><label for="admPlJ">Monthly price (INR)</label>' +
   '<input id="admPlJ" class="adm-input" type="text" inputmode="numeric" value="' + esc(j) + '"></div>' +
   '<div class="adm-field"><label for="admPlF">Mobile unlocks (-1 unlimited)</label>' +
   '<input id="admPlF" class="adm-input" type="text" inputmode="numeric" value="' + esc(f) + '"></div>' +
   '<div class="adm-field"><label for="admPlG">Chats allowed (-1 unlimited)</label>' +
   '<input id="admPlG" class="adm-input" type="text" inputmode="numeric" value="' + esc(g) + '"></div>' +
   '<div class="adm-field"><label for="admPlI">Profile browsing (-1 unlimited)</label>' +
   '<input id="admPlI" class="adm-input" type="text" inputmode="numeric" value="' + esc(i) + '"></div>' +
   '<div class="adm-field"><label for="admPlH">Profile views</label>' +
   '<input id="admPlH" class="adm-input" type="text" inputmode="numeric" value="' + esc(h) + '"></div>' +
   '<div class="adm-dlg-err" id="admPlErr"></div>';
  var ctl = null;
  ctl = openDlg({
   icon: "fa-pen-to-square",
   title: "Edit plan — " + (plan.e || "ID #" + plan.a),
   body: body,
   okLabel: "Save plan",
   onOk: function () {
    var vals = {
     e: (ctl.q("#admPlE") ? ctl.q("#admPlE").value : "").trim(),
     j: (ctl.q("#admPlJ") ? ctl.q("#admPlJ").value : "").trim(),
     f: (ctl.q("#admPlF") ? ctl.q("#admPlF").value : "").trim(),
     g: (ctl.q("#admPlG") ? ctl.q("#admPlG").value : "").trim(),
     i: (ctl.q("#admPlI") ? ctl.q("#admPlI").value : "").trim(),
     h: (ctl.q("#admPlH") ? ctl.q("#admPlH").value : "").trim()
    };
    var errEl = ctl.q("#admPlErr");
    var msg = "";
    if (!vals.e) { msg = "Plan name cannot be empty."; }
    else {
     ["f", "g", "i", "h", "j"].forEach(function (k) {
      if (!msg) {
       var v = vals[k];
       var isUnlim = k !== "h" && k !== "j" && v === "-1";
       if (v !== "" && !isUnlim && (isNaN(Number(v)) || Number(v) < 0)) {
        msg = "Field '" + k.toUpperCase() + "' must be a number" + (k === "h" || k === "j" ? "." : " or -1 for unlimited.");
       }
      }
     });
    }
    if (msg) {
     if (errEl) { errEl.style.display = "block"; errEl.textContent = msg; }
     return;
    }
    ctl.close();
    sendPlanUpdate(plan.a, vals);
   },
   onCancel: function () { if (ctl) { ctl.close(); } }
  });
 }

 async function sendPlanUpdate(planId, vals) {
  try {
   var x2 = { plan_id: planId, e: vals.e, f: vals.f === "" ? null : vals.f, g: vals.g === "" ? null : vals.g, i: vals.i === "" ? null : vals.i, h: vals.h === "" ? null : vals.h, j: vals.j };
   if (typeof clearPayload0 === "function") { clearPayload0(); }
   payload0.vw = 4;
   payload0.fn = 65;
   payload0.la = await maxDate([{ tb: "mp" }]);
   payload0.x1 = planId;
   payload0.x2 = x2;
   var r = await fnj3("https://my1.in/2/e.php", payload0, 1, true, null, 20000, 0, 1, 1, 1);
   admClear();
   if (r && r.su == 1) {
    toast("Plan updated.", "success");
    try {
     if (typeof handl_mr_rspons === "function") { await handl_mr_rspons(r); }
    } catch (eH) { }
    await loadPlansFromDexie();
   } else {
    toast((r && (r.ms || r.m)) || "Update failed.", "error");
   }
  } catch (err) {
   toast("Update failed: " + ((err && err.message) || err), "error");
  }
 }

 function reUpPending(r) { return String(r.d == null ? "0" : r.d) === "0"; }

 function reUpStateName(v) {
  var s = String(v == null ? "0" : v);
  var list = statusList();
  for (var i = 0; i < list.length; i++) {
   if (String(list[i].a) === s) { return list[i].e; }
  }
  return "Handled";
 }

 function reUpStateChip(v) {
  var s = String(v == null ? "0" : v);
  var cls = s === "1" ? "adm-chip-s1" : (s === "-1" ? "adm-chip-s-1" : (s === "0" ? "adm-chip-s0" : (s === "-2" || s === "-3" ? "adm-chip-s" + s : "adm-chip-s2")));
  return '<span class="adm-chip ' + cls + '">' + esc(reUpStateName(v)) + "</span>";
 }

 async function openReUp() {
  reUpOpen_ = 1;
  var panel = document.getElementById("admPanelProfiles");
  if (panel) { panel.classList.add("adm-reup-on"); }
  var state = document.getElementById("admProfilesState");
  if (state) { state.innerHTML = ""; }
  var wrap = document.getElementById("admTableWrap");
  if (wrap) { wrap.innerHTML = '<div class="adm-state"><div class="adm-spin"></div></div>'; }
  //await syncProfiles();
  await loadReUpFromDexie();
 }

 function closeReUp() {
  reUpOpen_ = 0;
  var panel = document.getElementById("admPanelProfiles");
  if (panel) { panel.classList.remove("adm-reup-on"); }
  renderProfiles();
 }

 async function loadReUpFromDexie() {
  try {
   var local = await localRows("mq");
   mqRows_ = Array.isArray(local) ? local : [];
  } catch (err) {
   mqRows_ = [];
  }
  renderReUp();
 }

 function reUpWhen(b) {
  var s = String(b == null ? "" : b).trim();
  if (!s) { return ""; }
  var parts = s.split(" ");
  return fmtDate(parts[0]) + (parts[1] ? " " + parts[1] : "");
 }

 function reUpRowHtml(r) {
  var p = findRow(r.e);
  var nm = p ? [p.m, p.n].filter(Boolean).join(" ") : "";
  var av = p ? thumbOf(p) : "";
  var hero = null;
  var gal = [];
  try {
   if (typeof window.mrResolveProfileImages === "function") {
    var hr = window.mrResolveProfileImages(r.u);
    hero = hr.display || hr.thumbnail || null;
   }
  } catch (eH) { }
  try {
   var raw = (typeof window.mrParseGalleryImages === "function") ? window.mrParseGalleryImages(r.u1) : [];
   gal = raw.map(function (tok) {
    var g = (typeof window.mrResolveProfileImages === "function") ? window.mrResolveProfileImages(tok) : null;
    return g ? (g.display || g.thumbnail) : null;
   }).filter(Boolean);
  } catch (eG) { }
  var pending = reUpPending(r);
  var actions = pending
   ? '<button type="button" class="adm-btn adm-btn-gold" data-act="reup-accept" data-id="' + esc(r.a) + '"><i class="fa-solid fa-check"></i> Accept update</button>' +
     '<button type="button" class="adm-btn adm-btn-danger" data-act="reup-reject" data-id="' + esc(r.a) + '"><i class="fa-solid fa-xmark"></i> Reject</button>'
   : reUpStateChip(r.d);
  return '<div class="adm-ru">' +
   '<div class="adm-ru-top">' +
   (av ? '<img data-lazy="' + esc(av) + '" alt="" loading="lazy" decoding="async">' : '<div class="adm-av">' + esc((nm || "?").charAt(0).toUpperCase()) + "</div>") +
   '<div class="adm-ru-id"><div class="adm-tb-name">' + (esc(nm) || "Profile #" + esc(r.e)) + '</div><div class="adm-tb-sub">#' + esc(r.e) + (p && p.d != null ? " &middot; " + esc(statusName(p.d)) : "") + "</div></div>" +
   '<div class="adm-ru-when">' + esc(reUpWhen(r.b)) + "</div>" +
   "</div>" +
   (hero ? '<div><div class="adm-ru-sec">New top image</div><img class="adm-ru-hero" data-lazy="' + esc(hero) + '" alt="" loading="lazy" decoding="async"></div>' : "") +
   (gal.length ? '<div><div class="adm-ru-sec">New gallery (' + gal.length + ')</div><div class="adm-ru-gal">' + gal.map(function (src) { return '<img data-lazy="' + esc(src) + '" alt="" loading="lazy" decoding="async">'; }).join("") + "</div></div>" : "") +
   (!hero && !gal.length ? '<div class="adm-ru-empty">No image previews in this request.</div>' : "") +
   '<div class="adm-ru-foot"><span class="adm-chip adm-chip-s0">Request #' + esc(r.a) + "</span>" + actions + "</div>" +
   "</div>";
 }

 function renderReUp() {
  var state = document.getElementById("admProfilesState");
  var wrap = document.getElementById("admTableWrap");
  if (!wrap) { return; }
  if (state) { state.innerHTML = ""; }
  var list = mqRows_.slice().sort(function (x, y) {
   var dx = String(x.b || ""), dy = String(y.b || "");
   if (dx !== dy) { return dy < dx ? -1 : 1; }
   return Number(y.a || 0) - Number(x.a || 0);
  });
  if (!list.length) {
   wrap.innerHTML = '<div class="adm-state"><div class="adm-ico"><i class="fa-solid fa-images"></i></div><div>No image update requests yet.</div><div style="font-size:12.5px;margin-top:6px">Requests appear here when members change their photos (use <b>Refresh</b> to sync).</div></div>';
   return;
  }
  wrap.innerHTML = '<div class="adm-reup-hint">Requested photo updates. <b>Accept</b> applies the new top image and gallery to the profile; <b>Reject</b> declines and keeps the current photos.</div>' +
   '<div class="adm-reup">' + list.map(reUpRowHtml).join("") + "</div>";
  if (window.mrImg) { try { window.mrImg.hydrate(wrap); } catch (eH) { } }
 }

 function confirmReUp(r, kind) {
  var p = findRow(r.e);
  var nm = p ? ([p.m, p.n].filter(Boolean).join(" ") || "profile #" + r.e) : "profile #" + r.e;
  var accepting = kind === "accept";
  var galCnt = 0;
  try {
   galCnt = (typeof window.mrParseGalleryImages === "function") ? window.mrParseGalleryImages(r.u1).length : 0;
  } catch (eG) { }
  var body = "<p class='adm-dlg-sub'>" +
   (accepting
    ? "Apply the requested image update to <b>" + esc(nm) + "</b> (profile # " + esc(r.e) + ")? The new top image and gallery (" + galCnt + " photo" + (galCnt === 1 ? "" : "s") + ") replace the current ones."
    : "Decline the requested image update for <b>" + esc(nm) + "</b> (profile # " + esc(r.e) + ")? The current photos stay unchanged.") +
   "</p>" +
   (accepting ? "" :
    '<label class="adm-block">' +
    '<input type="checkbox" id="admReUpBlock">' +
    '<span>Admin blocked because sexual content update</span>' +
    '</label>') +
   '<div class="adm-dlg-err" id="admReUpErr"></div>';
  var ctl = null;
  ctl = openDlg({
   icon: accepting ? "fa-images" : "fa-ban",
   title: (accepting ? "Accept update \u2014 " : "Reject request \u2014 ") + nm,
   body: body,
   okLabel: accepting ? "Accept update" : "Reject request",
   cancelLabel: "Cancel",
   onOk: function () {
    var cb = ctl.q("#admReUpBlock");
    var blocked = !!(cb && cb.checked);
    ctl.close();
    sendReUp(r, kind, blocked);
   },
   onCancel: function () { if (ctl) { ctl.close(); } }
  });
 }

 async function sendReUp(r, kind, blocked) {
  try {
   if (typeof clearPayload0 === "function") { clearPayload0(); }
   payload0.vw = 4;
   payload0.fn = 120;
   payload0.x1 = r.a; //mq.a = image update request id
   var accepting = kind === "accept";
   var stAccept = statusValueFor("accept", 1);
   var stReject = statusValueFor("reject", -1);
   //the block entry's "a" is the x3 flag sent with a reject, not a status for x2
   var stBlock = statusValueFor("block", -3);
   payload0.x2 = accepting ? stAccept : stReject;
   //x3 is only sent for the "block" case; a plain accept/reject omits it entirely
   if (!accepting && blocked) { payload0.x3 = stBlock; }
   var resp = await fnj3("https://my1.in/2/u.php", payload0, 1, true, null, 20000, 0, 1, 1, 1);
   admClear();
   if (resp && (resp.su == 1 || (resp.cd != null && Number(resp.cd) > 0))) {
    toast(accepting
     ? "Request accepted."
     : (blocked ? "Request rejected and profile blocked." : "Request rejected."), "success");
    //await syncProfiles();
    await loadReUpFromDexie();
   } else {
    toast((resp && (resp.ms || resp.m)) || "Request failed.", "error");
   }
  } catch (err) {
   toast("Request failed: " + ((err && err.message) || err), "error");
  }
 }

 function openDlg(opts) {
  var prev = document.getElementById(DLG_ID);
  if (prev && prev.parentNode) { prev.parentNode.removeChild(prev); }
  var modal = document.createElement("div");
  modal.id = DLG_ID;
  modal.className = "adm-ovl";
  modal.setAttribute("role", "alertdialog");
  modal.setAttribute("aria-modal", "true");
  var compact = !!opts.compact;
  modal.innerHTML =
   "<div class='adm-dlg" + (compact ? " adm-dlg-sm" : "") + "'>" +
   (compact
    ? '<button type="button" class="adm-dlg-x" data-sure="cancel" aria-label="Close">&times;</button>'
    : "<div class='adm-dlg-top'><i class='fa-solid " + (opts.icon || "fa-circle-info") + "'></i><span>ADMIN</span></div>") +
   (opts.title ? "<div class='adm-dlg-title'>" + esc(opts.title) + "</div>" : "") +
   "<div class='adm-dlg-body'>" + (opts.body || "") + "</div>" +
   "<div class='adm-dlg-foot'>" +
   (compact ? "" : '<button type="button" class="adm-btn adm-btn-ghost" data-sure="cancel">' + esc(opts.cancelLabel || "Cancel") + "</button>") +
   '<button type="button" class="adm-btn adm-btn-gold" data-sure="ok">' + esc(opts.okLabel || "OK") + "</button>" +
   "</div></div>";
  document.body.appendChild(modal);

  var ctl = {
   modal: modal,
   q: function (sel) { return modal.querySelector(sel); },
   close: function () {
    try {
     document.removeEventListener("keydown", keyH);
     modal.parentNode.removeChild(modal);
    } catch (eC) { }
   }
  };
  function keyH(e) {
   if (e.key !== "Escape") { return; }
   e.stopPropagation();
   ctl.close();
   if (opts.onCancel) { opts.onCancel(ctl); }
  }
  document.addEventListener("keydown", keyH);
  modal.querySelector('[data-sure="ok"]').addEventListener("click", function () {
   if (opts.onOk) { opts.onOk(ctl); }
  });
  modal.querySelector('[data-sure="cancel"]').addEventListener("click", function () {
   ctl.close();
   if (opts.onCancel) { opts.onCancel(ctl); }
  });
  return ctl;
 }

 function toast(msg, type) {
  if (typeof showToast === "function") {
   try {
    showToast(msg, { type: type || "info", duration: 3000, position: "top" });
    return;
   } catch (eT) { }
  }
  if (typeof alert === "function") { alert(msg); }
 }

 window.__mrAdminRefresh = function () {
  if (!open_) { return Promise.resolve(0); }
  var root = document.getElementById(PAGE_ID);
  if (!root) { return Promise.resolve(0); }
  if (root.style.display === "none") { root.style.display = ""; }
  return reUpOpen_ ? loadReUpFromDexie() : loadProfilesFromDexie();
 };
})();