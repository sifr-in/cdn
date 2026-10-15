(function () {
 'use strict';

 // ---------------------------------------------------------------
 // Admin Dashboard (full-screen page, NOT a bootstrap modal).
 // Rebuilds the old admin workings on the current endpoints:
 //   fn 60  get all marriage records   -> https://my1.in/2/e.php
 //   fn 61  get all plans              -> https://my1.in/2/g.php
 //   fn 62  admin add new profile      -> https://my1.in/2/f.php  (regis admin mode)
 //   fn 63  admin update profile       -> https://my1.in/2/f.php  (regis admin mode)
 //   fn 65  admin update plan          -> https://my1.in/2/e.php
 //   fn 67  admin mark profile deleted -> https://my1.in/2/h.php
 // ---------------------------------------------------------------

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
 var prevOverflow_ = "";

 var FALLBACK_STATUSES = [
  { a: 0, e: "Entry" },
  { a: 1, e: "Accepted" },
  { a: 2, e: "Under process" },
  { a: 127, e: "denied" }
 ];

 function statusList() {
  try {
   if (Array.isArray(window.entryStatus) && window.entryStatus.length) { return window.entryStatus; }
  } catch (eS) { }
  return FALLBACK_STATUSES;
 }

 function statusName(v) {
  var list = statusList();
  for (var i = 0; i < list.length; i++) {
   if (String(list[i].a) === String(v)) { return list[i].e; }
  }
  return "Entry";
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

 function cityOf(b4) {
  if (b4 === undefined || b4 === null || b4 === "") { return ""; }
  if (typeof __mrCityName === "function") {
   try {
    var nm = __mrCityName(b4);
    if (nm) { return String(nm); }
   } catch (eC) { }
  }
  return String(b4);
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
   ".adm-body{flex:1 1 auto;overflow:auto;padding:16px 18px 60px;}" +
   ".adm-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:16px;}" +
   ".adm-stat{background:#fff;border:1px solid var(--adm-line);border-top:3px solid var(--adm-gold);border-radius:14px;padding:12px 14px;box-shadow:0 2px 8px rgba(110,23,51,.06);}" +
   ".adm-stat b{display:block;font-size:25px;line-height:1.1;color:var(--adm-ember);}" +
   ".adm-stat span{font-size:12px;color:var(--adm-mut);text-transform:uppercase;letter-spacing:.5px;}" +
   ".adm-tabs{display:flex;gap:8px;margin-bottom:14px;border-bottom:1px solid var(--adm-line);}" +
   ".adm-tab{background:transparent;border:none;padding:10px 18px;font-size:14px;font-weight:600;color:var(--adm-mut);cursor:pointer;position:relative;}" +
   ".adm-tab:hover{color:var(--adm-ember);}" +
   ".adm-tab-on{color:var(--adm-ember);}" +
   ".adm-tab-on::after{content:'';position:absolute;left:8px;right:8px;bottom:-1px;height:3px;border-radius:3px;background:linear-gradient(90deg,var(--adm-ember),var(--adm-gold));}" +
   ".adm-panel{display:block;animation:admIn .2s ease;}" +
   ".adm-panel-off{display:none;}" +
   "@keyframes admIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}" +
   ".adm-toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:12px;}" +
   ".adm-search{flex:1 1 240px;display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--adm-line);border-radius:40px;padding:0 14px;height:42px;}" +
   ".adm-search i{color:var(--adm-mut);}" +
   ".adm-search input{flex:1 1 auto;border:none;border-bottom:1px solid #d3c39f;outline:none;background:transparent;font-size:14px;color:var(--adm-ink);}" +
   ".adm-toolbar-rt{display:flex;flex-wrap:wrap;gap:8px;align-items:center;}" +
   ".adm-btn{border:none;border-radius:40px;padding:10px 18px;font-size:13.5px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:transform .15s ease,box-shadow .15s ease;}" +
   ".adm-btn:hover{transform:translateY(-1px);}" +
   ".adm-btn-gold{background:linear-gradient(135deg,#c9a45c,#b08d45);color:#3a2c10;box-shadow:0 3px 10px rgba(176,141,69,.35);}" +
   ".adm-btn-ghost{background:#fff;color:#8B1E3F;border:1px solid var(--adm-line);}" +
   ".adm-btn-danger{background:linear-gradient(135deg,#c0392b,#92261a);color:#fff;box-shadow:0 3px 10px rgba(146,38,26,.3);}" +
   ".adm-sel{height:42px;border:1px solid var(--adm-line);border-radius:40px;padding:0 12px;background:#fff;color:var(--adm-ink);font-size:13.5px;outline:none;cursor:pointer;}" +
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
   ".adm-chip{display:inline-block;padding:3px 10px;border-radius:30px;font-size:12px;font-weight:600;white-space:nowrap;}" +
   ".adm-chip-s0{background:#efe9dc;color:#57503f;}" +
   ".adm-chip-s1{background:#f5e9c8;color:#6d5614;}" +
   ".adm-chip-s2{background:#fde6d3;color:#8a4a12;}" +
   ".adm-chip-s127{background:#f6d9d4;color:#92261a;}" +
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
   "@media(max-width:560px){.adm-head-title h1{font-size:18px;}.adm-stats{grid-template-columns:repeat(2,1fr);}}";
  var head = document.head || document.documentElement;
  head.appendChild(st);
 }

 // ---------------------------------------------------------------
 // API helper (payload0 + fnj3, mirroring the old admin calls)
 // ---------------------------------------------------------------
 function api(url, body) {
  return new Promise(function (resolve, reject) {
   var sent = false;
   function cleanup() {
    try {
     ["x1", "x2", "x3", "la", "vw", "drml"].forEach(function (k) { delete payload0[k]; });
    } catch (eX) { }
   }
   function done(ok, val) {
    if (sent) { return; }
    sent = true;
    cleanup();
    if (ok) { resolve(val); } else { reject(val); }
   }
   try {
    if (typeof clearPayload0 === "function") { clearPayload0(); }
    payload0.vw = 4;
    if (body) {
     Object.keys(body).forEach(function (k) { payload0[k] = body[k]; });
    }
    fnj3(url, payload0, 1, true, null, 20000, 0, 1, 1, 1)
     .then(function (r) { done(true, r); }, function (err) { done(false, err); });
   } catch (err) {
    done(false, err);
   }
  });
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

 // ---------------------------------------------------------------
 // Data loading
 // ---------------------------------------------------------------
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

 // Profiles straight from the local IndexedDB 'mr' table (no network).
 async function loadProfilesFromDexie() {
  setStateIdle("admProfilesState");
  try {
   var local = await localRows("mr");
   rows_ = Array.isArray(local) ? local : [];
   renderProfiles();
  } catch (err) {
   setStateErr("admProfilesState", (err && err.message) || "Could not read local profiles.");
  }
 }

 // Manual server sync only (fn 60 via e.php) - fired only by the Refresh buttons.
 async function loadProfiles() {
  setStateIdle("admProfilesState");
  try {
   var r = await api("https://my1.in/2/e.php", { fn: 60, la: await maxDate([{ tb: "c" }, { tb: "mr" }]) });
   if (r && r.su == 1) {
    try {
     if (typeof handl_mr_rspons === "function") { await handl_mr_rspons(r); }
    } catch (eH) { }
    rows_ = (r.mr && r.mr.l) || [];
    renderProfiles();
   } else {
    setStateErr("admProfilesState", (r && (r.ms || r.m)) || "Failed to load profiles.");
   }
  } catch (err) {
   setStateErr("admProfilesState", (err && err.message) || "Failed to load profiles.");
  }
 }

 // Plans straight from the local IndexedDB 'mp' table (no network).
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

 // Manual server sync only (fn 61 via g.php) - fired only by the Refresh plans button.
 async function loadPlans() {
  var st = document.getElementById("admPlansState");
  if (st) { st.innerHTML = '<div class="adm-spin"></div>'; }
  try {
   var r = await api("https://my1.in/2/g.php", { fn: 61, la: await maxDate([{ tb: "mp" }]) });
   if (r && r.su == 1) {
    try {
     if (typeof handl_mr_rspons === "function") { await handl_mr_rspons(r); }
    } catch (eH) { }
    planRows_ = (r.mp && r.mp.l) || [];
    renderPlans();
   } else {
    setStateErr("admPlansState", (r && (r.ms || r.m)) || "Failed to load plans.");
   }
  } catch (err) {
   setStateErr("admPlansState", (err && err.message) || "Failed to load plans.");
  }
 }

 // ---------------------------------------------------------------
 // Rendering
 // ---------------------------------------------------------------
 function filteredRows() {
  var s = search_.toLowerCase();
  return rows_.filter(function (p) {
   if (status_ !== "" && String(p.d) !== String(status_)) { return false; }
   if (!s) { return true; }
   return String(p.m || "").toLowerCase().indexOf(s) >= 0 ||
    String(p.n || "").toLowerCase().indexOf(s) >= 0 ||
    String(p.l || "").toLowerCase().indexOf(s) >= 0 ||
    String(p.a || "").toLowerCase().indexOf(s) >= 0;
  });
 }

 function countRows(dv) {
  var c = 0;
  var i;
  for (i = 0; i < rows_.length; i++) { if (String(rows_[i].d) === String(dv)) { c++; } }
  return c;
 }

 function renderStats() {
  var el = document.getElementById("admStats");
  if (!el) { return; }
  var st = [
   { v: "total", n: "Profiles" },
   { v: "d1", n: "Accepted" },
   { v: "d2", n: "Under process" },
   { v: "d127", n: "Denied" },
   { v: "plans", n: "Plans" }
  ];
  var html = "";
  for (var i = 0; i < st.length; i++) {
   var val = "—";
   if (st[i].v === "total") { val = rows_.length; }
   else if (st[i].v === "plans") { val = planRows_.length; }
   else if (st[i].v === "d1") { val = countRows(1); }
   else if (st[i].v === "d2") { val = countRows(2); }
   else if (st[i].v === "d127") { val = countRows(127); }
   html += '<div class="adm-stat"><b>' + val + '</b><span>' + st[i].n + '</span></div>';
  }
  el.innerHTML = html;
 }

 function renderProfiles() {
  renderStats();
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
  var head =
   "<table class='adm-table' summary='Profiles'>" +
   "<thead><tr>" +
   "<th>Photo</th><th>ID</th><th>Name</th><th>Mobile</th><th>Age</th><th>Status</th><th>Native place</th><th>Added</th><th></th>" +
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
  var photo = av ? '<img data-lazy="' + esc(av) + '" alt="" loading="lazy" decoding="async">' : '<div class="adm-av">' + esc((p.m || "?").charAt(0).toUpperCase()) + '</div>';
  var chip = "adm-chip-s" + String(p.d == null ? "" : p.d);
  var stNm = statusName(p.d);
  var age = ageOf(p.g);
  var city = cityOf(p.b4);
  var added = fmtDate(p.b);
  return "<tr>" +
   '<td class="adm-tb-img">' + photo + "</td>" +
   '<td><div class="adm-tb-id">#' + esc(p.a) + "</div></td>" +
   '<td><div class="adm-tb-name">' + esc(p.m) + '</div><div class="adm-tb-sub">' + esc(p.n) + "</div></td>" +
   "<td>" + esc(phoneOf(p.l)) + "</td>" +
   "<td>" + esc(age) + "</td>" +
   '<td><span class="adm-chip ' + chip + '">' + esc(stNm) + "</span></td>" +
   "<td>" + esc(city) + "</td>" +
   "<td>" + esc(added) + "</td>" +
   '<td class="adm-tb-act">' +
   '<button data-act="view" data-id="' + esc(p.a) + '" title="View" class="adm-act-view"><i class="fa-solid fa-eye"></i></button>' +
   '<button data-act="edit" data-id="' + esc(p.a) + '" title="Edit" class="adm-act-edit"><i class="fa-solid fa-pen"></i></button>' +
   '<button data-act="del" data-id="' + esc(p.a) + '" title="Delete" class="adm-act-del"><i class="fa-solid fa-trash"></i></button>' +
   "</td></tr>";
 }

 function planVal(v) {
  return (v === undefined || v === null || v === "") ? "" : (String(v) === "-1" ? "Unlimited" : v);
 }

 function renderPlans() {
  renderStats();
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

 // ---------------------------------------------------------------
 // Page lifecycle
 // ---------------------------------------------------------------
 window.openMrAdmin = function () {
  if (open_) {
   var root = document.getElementById(PAGE_ID);
   if (root && root.style.display === "none") { root.style.display = ""; }
   return;
  }
  open_ = 1;
  ensureCss();
  prevOverflow_ = document.body.style.overflow;
  document.body.style.overflow = "hidden";
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
   "<button type='button' class='adm-icon' data-act='refresh' title='Refresh'><i class='fa-solid fa-rotate-right'></i></button>" +
   "</header>" +
   "<div class='adm-body'>" +
   "<div class='adm-stats' id='admStats'></div>" +
   "<div class='adm-tabs'>" +
   '<button type="button" class="adm-tab adm-tab-on" data-tab="profiles">Profiles</button>' +
   '<button type="button" class="adm-tab" data-tab="plans">Plans</button>' +
   "</div>" +
   "<section class='adm-panel' id='admPanelProfiles'>" +
   "<div class='adm-toolbar'>" +
   "<div class='adm-search'><i class='fa-solid fa-magnifying-glass'></i><input type='search' id='admSearch' placeholder='Search name, father, mobile or ID...'></div>" +
   "<div class='adm-toolbar-rt'>" +
   "<select id='admStatus' class='adm-sel' aria-label='Status'></select>" +
   "<button type='button' class='adm-btn adm-btn-gold' id='admAddProfile'><i class='fa-solid fa-user-plus'></i> Add New Profile</button>" +
   "<button type='button' class='adm-btn adm-btn-ghost' data-act='refresh'><i class='fa-solid fa-rotate-right'></i> Refresh</button>" +
   "</div></div>" +
   "<div class='adm-state' id='admProfilesState'></div>" +
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
   var addBtn = node ? node.closest("#admAddProfile") : null;
   if (addBtn && root.contains(addBtn)) { openReg(null); return; }
   var tabBtn = node ? node.closest(".adm-tab") : null;
   if (tabBtn && root.contains(tabBtn)) {
    switchTab(tabBtn.getAttribute("data-tab"), root);
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
    else if (act === "refresh") { loadProfiles(); if (tab_ === "plans") { loadPlans(); } }
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

  pageKeyH_ = function (e) {
   if (e.key !== "Escape") { return; }
   var rr = document.getElementById(REGIS_ID);
   var dd = document.getElementById(DLG_ID);
   var pv = document.getElementById(MODAL_PROFILE_ID);
   if (rr || dd || pv) { return; }
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
  try { document.body.style.overflow = prevOverflow_ || ""; } catch (eO) { }
  if (pageKeyH_) {
   try { document.removeEventListener("keydown", pageKeyH_); } catch (eK) { }
   pageKeyH_ = null;
  }
  var dlgs = document.getElementById(DLG_ID);
  if (dlgs && dlgs.parentNode) { dlgs.parentNode.removeChild(dlgs); }
  var root = document.getElementById(PAGE_ID);
  if (root && root.parentNode) { root.parentNode.removeChild(root); }
 }

 // ---------------------------------------------------------------
 // Row actions
 // ---------------------------------------------------------------
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

 // prfl.js opens its overlay with z-index 1045 (rg-overlay CSS). The admin page
 // sits at 3000, so raise the profile/unlock overlays above it and keep the
 // admin page open underneath ("stay on current").
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
  // Use loadExe2Fn to ensure regis.js is loaded and showRegistrationModal is ready for admin
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
   var r = await api("https://my1.in/2/h.php", { fn: 67, x1: reason, x2: x2, x3: p.m || "" });
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

 // ---------------------------------------------------------------
 // Plans edit (fn 65)
 // ---------------------------------------------------------------
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
   var r = await api("https://my1.in/2/e.php", { fn: 65, la: await maxDate([{ tb: "mp" }]), x1: planId, x2: x2 });
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

 // ---------------------------------------------------------------
 // Small dialog
 // ---------------------------------------------------------------
 function openDlg(opts) {
  var prev = document.getElementById(DLG_ID);
  if (prev && prev.parentNode) { prev.parentNode.removeChild(prev); }
  var modal = document.createElement("div");
  modal.id = DLG_ID;
  modal.className = "adm-ovl";
  modal.setAttribute("role", "alertdialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML =
   "<div class='adm-dlg'>" +
   "<div class='adm-dlg-top'><i class='fa-solid " + (opts.icon || "fa-circle-info") + "'></i><span>ADMIN</span></div>" +
   "<div class='adm-dlg-title'>" + esc(opts.title || "") + "</div>" +
   "<div class='adm-dlg-body'>" + (opts.body || "") + "</div>" +
   "<div class='adm-dlg-foot'>" +
   '<button type="button" class="adm-btn adm-btn-ghost" data-sure="cancel">' + esc(opts.cancelLabel || "Cancel") + "</button>" +
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

 // ---------------------------------------------------------------
 // Exports & helpers
 // ---------------------------------------------------------------
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
  return loadProfilesFromDexie();
 };
})();