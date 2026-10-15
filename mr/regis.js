const defnTabsToUs = { s: [2, 3], de: 2 };
(function () {
 "use strict";

 var CSS_ID = "rgRegisCss";
 var MODAL_ID = "rgRegistrationModal";
 var rgAdmOpen = 0;
 var rgAudioOn = 1;
 //the live modal's own close(), so hndlRspo68 can dismiss it after a save
 //(a bare close() there resolves to the browser's window.close, which is a no-op).
 var activeClose = null;

 var CSS = [
  ".rg-overlay{",
  "--rg-ember:#8B1E3F;--rg-ember-deep:#6E1733;--rg-gold:#c9a45c;--rg-gold-light:#e6cf9b;",
  "--rg-ink:#241d12;--rg-muted:#6f6656;--rg-surface:#fffdf6;--rg-cream:#faf4e6;",
  "--rg-err:#a33120;--rg-ok:#2e7d5b;",
  "position:fixed;inset:0;z-index:1045;display:flex;align-items:center;justify-content:center;",
  "padding:16px;background:rgba(30,24,12,.55);backdrop-filter:blur(3px);",
  "opacity:0;transition:opacity .26s ease;box-sizing:border-box;",
  "}",
  ".rg-overlay.open{opacity:1;}",
  ".rg-box{position:relative;width:100%;max-width:440px;background:var(--rg-surface);",
  "border:1px solid rgba(201,164,92,.5);border-radius:20px;overflow:hidden;",
  "box-shadow:0 24px 60px rgba(0,0,0,.35);transform:translateY(16px);",
  "transition:transform .26s ease;max-height:92vh;overflow-y:auto;box-sizing:border-box;}",
  ".rg-overlay.open .rg-box{transform:translateY(0);}",
  ".rg-head{display:flex;align-items:center;gap:12px;padding:18px 20px 16px;color:#fff;",
  "background-image:linear-gradient(135deg,var(--rg-ember),var(--rg-ember-deep));}",
  ".rg-ic{flex:0 0 auto;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;",
  "justify-content:center;font-size:18px;color:#2a2010;",
  "background:linear-gradient(135deg,var(--rg-gold-light),var(--rg-gold));",
  "box-shadow:0 6px 16px rgba(201,164,92,.45);}",
  ".rg-titles{flex:1 1 auto;min-width:0;}",
  ".rg-titles h3{margin:0;font-size:19px;line-height:1.25;color:#fff;}",
  ".rg-titles p{margin:2px 0 0;font-size:12.5px;line-height:1.45;color:rgba(255,255,255,.82);}",
  ".rg-x{flex:0 0 auto;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;",
  "justify-content:center;border:1px solid rgba(255,255,255,.45);background:rgba(255,255,255,.12);",
  "color:#fff;font-size:16px;cursor:pointer;transition:background .2s ease,transform .2s ease;}",
  ".rg-x:hover{background:rgba(255,255,255,.28);transform:rotate(90deg);}",
  ".rg-body{padding:18px 20px 20px;}",
  ".rg-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;}",
  ".rg-field{display:flex;flex-direction:column;gap:5px;min-width:0;}",
  ".rg-field.full{grid-column:1 / -1;}",
  ".rg-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.1px;",
  "color:var(--rg-muted);}",
  ".rg-label .rg-req{color:var(--rg-err);margin-left:3px;font-weight:700;}",
  ".rg-inwrap{display:flex;align-items:stretch;border:1px solid var(--rg-ember-deep);",
  "border-radius:12px;background:#fff;overflow:hidden;transition:border-color .2s ease,box-shadow .2s ease;}",
  ".rg-inwrap:focus-within{border-color:var(--rg-gold);box-shadow:0 0 0 3px rgba(201,164,92,.22);}",
  ".rg-prefix{display:flex;align-items:center;padding:0 10px;font-size:13.5px;font-weight:600;",
  "color:var(--rg-muted);background:var(--rg-cream);border-right:1px solid rgba(150,120,70,.35);",
  "user-select:none;}",
  ".rg-in{flex:1 1 auto;min-width:0;height:46px;padding:0 12px;font-size:15px;color:var(--rg-ink);",
  "background:transparent;border:0;outline:none;font-family:inherit;}",
  ".rg-in::placeholder{color:#9c937f;}",
  ".rg-selbox{min-height:46px;display:flex;flex-wrap:wrap;align-items:center;gap:8px;cursor:pointer;",
  "border:1px solid var(--rg-ember-deep);border-radius:12px;background:#fff;padding:7px 10px;",
  "transition:border-color .2s ease,box-shadow .2s ease;}",
  ".rg-selbox:focus-within{border-color:var(--rg-gold);box-shadow:0 0 0 3px rgba(201,164,92,.22);}",
  ".rg-selbox p{margin:0;color:#9c937f;font-size:14px;}",
  ".rg-selbox>div{margin-top:0 !important;}",
  ".rg-selbox .rg-selopen{min-height:32px;padding:4px 14px;border-radius:999px;",
  "border:1px dashed var(--rg-ember-deep);background:var(--rg-cream);color:var(--rg-muted);",
  "font-size:13.5px;font-weight:600;cursor:pointer;}",
  ".rg-selbox .rg-selopen:hover{border-color:var(--rg-gold);color:var(--rg-ink);}",
  ".rg-selbox[data-locked=\"1\"]{cursor:default;background:#f4efe3;}",
  ".rg-selbox[data-locked=\"1\"] button{display:none;}",
  ".rg-date-wrap{position:relative;cursor:pointer;}",
  ".rg-date-wrap .rg-in{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:2;}",
  ".rg-date-disp{display:flex;align-items:center;min-height:46px;padding:0 12px;font-size:15px;color:var(--rg-ink);}",
   ".rg-date-disp:empty::before{content:\"DD-MM-YYYY\";color:#9c937f;}",
   ".rg-dt-row{display:flex;gap:10px;}",
   ".rg-dt-row .rg-inwrap{flex:1 1 0;min-width:0;}",
   "[id^=\"rgtime-\"]:empty::before{content:\"HH:MM\";color:#9c937f;}",
  ".rg-cal{margin-left:auto;display:flex;align-items:center;padding:0 12px;color:var(--rg-muted);}",
  "body .tempus-dominus-widget.show{z-index:100002 !important;}",
  ".rg-snd{position:fixed;bottom:calc(12px + env(safe-area-inset-bottom,0px));right:12px;z-index:6;",
  "width:46px;height:46px;border-radius:50%;border:1px solid rgba(201,164,92,.6);",
  "display:flex;align-items:center;justify-content:center;cursor:pointer;",
  "background-image:linear-gradient(135deg,var(--rg-gold-light),var(--rg-gold));",
  "color:#2a2010;font-size:18px;box-shadow:0 8px 20px rgba(0,0,0,.28);",
  "transition:transform .18s ease,filter .2s ease;}",
  ".rg-snd:hover{filter:brightness(1.07);}",
  ".rg-snd:active{transform:scale(.94);}",
  ".rg-snd.rg-snd-play{animation:rg-snd-pulse .9s ease-in-out infinite;}",
  "@keyframes rg-snd-pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,164,92,.55);}",
  "50%{box-shadow:0 0 0 10px rgba(201,164,92,0);}}",
  ".rg-in.rg-ta{height:auto;min-height:78px;padding:10px 12px;line-height:1.45;resize:vertical;}",
  ".rg-dp{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}",
  ".rg-dp-thumb{width:84px;height:84px;border-radius:14px;border:1px dashed var(--rg-ember-deep);",
  "background:var(--rg-cream);display:flex;align-items:center;justify-content:center;overflow:hidden;",
  "flex:0 0 auto;color:var(--rg-muted);font-size:26px;}",
  ".rg-dp-thumb img{width:100%;height:100%;object-fit:cover;}",
  ".rg-dp-actions{display:flex;gap:8px;flex-wrap:wrap;}",
  ".rg-dp-actions .rg-btn{height:42px;padding:0 16px;font-size:13.5px;}",
  ".rg-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:8px;}",
  ".rg-gal-item{position:relative;aspect-ratio:1/1;border-radius:12px;overflow:hidden;",
  "border:1px solid rgba(201,164,92,.55);background:var(--rg-cream);}",
  ".rg-gal-item img{width:100%;height:100%;object-fit:cover;display:block;}",
  ".rg-gal-x{position:absolute;top:3px;right:3px;width:22px;height:22px;padding:0;border:none;",
  "border-radius:50%;background:rgba(36,29,18,.68);color:#fff;font-size:12px;line-height:1;",
  "display:flex;align-items:center;justify-content:center;cursor:pointer;}",
  ".rg-gal-x:hover{background:var(--rg-err);}",
  ".rg-gal-add{aspect-ratio:1/1;border:1px dashed var(--rg-ember-deep);border-radius:12px;",
  "background:var(--rg-cream);color:var(--rg-muted);display:flex;flex-direction:column;gap:4px;",
  "align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:600;}",
  ".rg-gal-add i{font-size:20px;}",
  ".rg-gal-add:hover{border-color:var(--rg-gold);color:var(--rg-ink);background:#fff;}",
  ".rg-gal-add[disabled]{opacity:.5;cursor:not-allowed;}",
  ".rg-msg{display:none;margin-top:14px;border-radius:12px;padding:10px 13px;font-size:13.5px;",
  "line-height:1.45;}",
  ".rg-msg.show{display:block;}",
  ".rg-msg.err{color:var(--rg-err);background:rgba(163,49,32,.08);border:1px solid rgba(163,49,32,.28);}",
  ".rg-msg.ok{color:var(--rg-ok);background:rgba(46,125,91,.09);border:1px solid rgba(46,125,91,.3);}",
  ".rg-err{display:none;font-size:12px;font-weight:600;color:var(--rg-err);}",
  ".rg-field.bad .rg-inwrap{border-color:var(--rg-err);box-shadow:0 0 0 3px rgba(163,49,32,.16);}",
  ".rg-field.bad .rg-selbox{border-color:var(--rg-err);box-shadow:0 0 0 3px rgba(163,49,32,.16);}",
  ".rg-field.bad .rg-err{display:block;}",
  ".rg-actions{display:flex;flex-direction:column;gap:10px;margin-top:18px;}",
  ".rg-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;",
  "border-radius:999px;border:1px solid transparent;font-size:15px;font-weight:600;cursor:pointer;",
  "transition:filter .2s ease,transform .18s ease;}",
  ".rg-btn:active{transform:scale(.985);}",
  ".rg-btn:disabled{opacity:.6;cursor:not-allowed;}",
  ".rg-btn[hidden]{display:none;}",
  ".rg-btn-main{background-image:linear-gradient(135deg,var(--rg-ember),var(--rg-ember-deep));",
  "color:#fff;box-shadow:0 10px 24px rgba(110,23,51,.3);}",
  ".rg-btn-main:hover:not(:disabled){filter:brightness(1.08);}",
  ".rg-btn-add{background-image:linear-gradient(135deg,#2e7d5b,#14402b);color:#fff;",
  "box-shadow:0 10px 24px rgba(20,64,43,.3);}",
  ".rg-btn-update{background-image:linear-gradient(135deg,#cf7b2a,#8a4708);color:#fff;",
  "box-shadow:0 10px 24px rgba(138,71,8,.3);}",
  ".rg-btn-ghost{background:transparent;color:var(--rg-muted);border-color:rgba(201,164,92,.55);}",
  ".rg-btn-ghost:hover{background:var(--rg-cream);color:var(--rg-ink);}",
  ".rgAlrdyRegMem{background:linear-gradient(135deg,var(--rg-gold-light),var(--rg-gold));color:var(--rg-ember-deep);border-color:var(--rg-gold);width:auto;margin:4px auto 0;padding:0 18px;height:42px;font-size:13.5px;}",
  ".rg-view{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:11px 14px;}",
  ".rg-view-item{display:flex;flex-direction:column;gap:3px;min-width:0;padding:8px 10px;",
  "border:1px solid rgba(119,79,1,.9);border-radius:8px;background:var(--rg-surface,#fffdf6);}",
  ".rg-view-item.full{grid-column:1 / -1;}",
  ".rg-view-key{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--rg-muted);}",
  ".rg-view-val{font-size:14.5px;line-height:1.4;color:var(--rg-ink);word-break:break-word;}",
  ".rg-view-val:empty::before{content:\"\\2014\";color:#b9b1a2;}",
   ".rg-more{flex:0 0 auto;align-self:center;height:30px;min-width:58px;margin:0 8px 0 4px;",
   "padding:0 12px;border-radius:999px;border:1px solid var(--rg-ember-deep);",
   "background:var(--rg-cream);color:var(--rg-muted);font-size:12.5px;font-weight:700;",
   "cursor:pointer;transition:border-color .2s ease,color .2s ease,background .2s ease;}",
   ".rg-more:hover{border-color:var(--rg-gold);color:var(--rg-ink);background:#fff;}",
   ".rg-more.rg-more-on{background:linear-gradient(135deg,var(--rg-gold-light),var(--rg-gold));color:var(--rg-ember-deep);border-color:var(--rg-gold);}",
   ".rg-more.rg-more-on:hover{background:linear-gradient(135deg,var(--rg-gold),var(--rg-gold-light));color:var(--rg-ember-deep);border-color:var(--rg-ember-deep);}",
   ".rg-morebtn{width:auto;height:34px;padding:0 18px;font-size:13px;border-radius:24px;grid-column:1 / -1;justify-self:center;margin:2px 0 10px;}",
   ".rg-morepane{display:none;}",
   ".rg-morepane.open{display:block;}",
   ".rg-morepane-grid{grid-template-columns:1fr;}",
   ".rg-morefold{grid-column:1 / -1;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;}",
   ".rg-cascbox{justify-content:space-between;align-items:flex-start;}",
   ".rg-cascbox-val{font-size:15px;color:var(--rg-ink);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
   ".rg-cascbox-val.empty{color:#9c937f;}",
   ".rg-casc-tree{display:flex;flex-direction:column;gap:1px;min-width:0;max-width:100%;}",
   ".rg-casc-node{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
   ".rg-casc-node.lv0{font-size:15px;font-weight:600;color:var(--rg-ink);}",
   ".rg-casc-node.lv1{font-size:13.5px;color:var(--rg-muted);padding-left:14px;}",
   ".rg-casc-node.lv2{font-size:12.5px;color:var(--rg-muted);padding-left:28px;}",
   ".rg-casc-node.lv1::before,.rg-casc-node.lv2::before{content:\"↳ \";color:var(--rg-gold);}",
   ".rg-cascbox[data-locked=\"1\"]{cursor:pointer;background:#fff;}",
   ".rg-cascbox[data-locked=\"1\"] .rg-selopen{display:inline-flex !important;}",
  "@media (max-width:480px){",
  ".rg-overlay{align-items:flex-end;padding:0;}",
  ".rg-box{max-width:none;border-radius:20px 20px 0 0;max-height:92vh;",
  "padding-bottom:env(safe-area-inset-bottom);}",
  ".rg-overlay.open .rg-box{transform:translateY(0);}",
  ".rg-body{padding:16px 16px calc(20px + env(safe-area-inset-bottom));}",
  ".rg-head{padding:16px 16px 14px;}",
  ".rg-titles h3{font-size:18px;}",
  "}",
  "@media (prefers-reduced-motion:reduce){",
  ".rg-overlay,.rg-box,.rg-x,.rg-btn{transition:none !important;}",
  "}"
 ].join("");

 function ensureCss() {
  if (document.getElementById(CSS_ID)) return;
  var s = document.createElement("style");
  s.id = CSS_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
 }

 function esc(v) {
  if (v === null || v === undefined) return "";
  return String(v)
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#39;");
 }

 function splitCsv(s) {
  return String(s == null ? "" : s)
   .split(",")
   .map(function (x) { return x.trim(); })
   .filter(Boolean);
 }

 function rgP() {
  try {
   if (typeof my1uzr !== "undefined" && my1uzr && my1uzr.worknOnPg) return window[my1uzr.worknOnPg] || {};
  } catch (e) { }
  return {};
 }

 function rgCfg() {
  return rgP().clientConfig || {};
 }

 //config-driven "more" grouping: { triggerField: [fields revealed behind its toggle] }
 function moreInfoMap(C, P) {
  var raw = (C && C.moreinfo) || (P && P.moreinfo) || null;
  var out = {};
  if (!raw || typeof raw !== "object") return out;
  Object.keys(raw).forEach(function (tr) {
   var v = raw[tr];
   out[tr] = splitCsv(typeof v === "string" ? v : (Array.isArray(v) ? v.join(",") : ""));
  });
  return out;
 }

 var BUILTIN_LISTS = {
  marital_status: [
   { a: 0, e: "-" }, { a: 1, e: "Never Married" }, { a: 2, e: "Divorced" },
   { a: 3, e: "Widow/er" }, { a: 4, e: "In Marriage" }, { a: 5, e: "Annulled" },
   { a: 6, e: "Awaiting Divorce" }
  ],
  var_genders: [
   { a: 0, e: "-" }, { a: 1, e: "male" }, { a: 2, e: "female" },
   { a: 3, e: "prefer not to say" }
  ],
  mr_job_types: [{ a: 0, e: "-" }, { a: 1, e: "gov" }, { a: 2, e: "mnc" }, { a: 3, e: "private" }],
  mr_bsns_forms: [
   { a: 1, e: "Sole Proprietorship" }, { a: 2, e: "Partnership Firm" },
   { a: 3, e: "LLP (Limited Liability Partnership)" }, { a: 4, e: "Private Limited Company" },
   { a: 5, e: "Public Limited Company" }, { a: 6, e: "One Person Company (OPC)" },
   { a: 7, e: "Cooperative Society" }, { a: 8, e: "Trust" }, { a: 9, e: "NGO" }
  ],
  mr_bsns_typs: [{ a: 0, e: "-" }, { a: 1, e: "IT & Software Development" }, { a: 2, e: "Real Estate" }, { a: 3, e: "Construction" }],
  entryStatus: [{ a: 0, e: "Entry" }, { a: 1, e: "Accepted" }, { a: 2, e: "Under process" }, { a: 127, e: "denied" }]
 };

 var BUILTIN_SEL_FIELDS = {
  a5: { arr: "var_genders" },
  j: { arr: "marital_status" },
  k: { arr: "var_caste_rlgns" },
k1: { arr: "var_caste_rlgns,castes", parent: "k", show: 1 },
   k2: { arr: "var_sub_caste_type", parent: "k1", show: 1 },
   a3: { arr: "var_ctco", show: 1 },
   a2: { arr: "var_ctco,cities", parent: "a3", show: 1 },
   b5: { arr: "var_ctco", show: 1 },
   b4: { arr: "var_ctco,cities", parent: "b5" },
   c5: { arr: "var_ctco", show: 1 },
   c6: { arr: "var_ctco,cities", parent: "c5", show: 1 },
  q: { arr: "mr_job_types" },
  qa: { arr: "mr_desig_posis" },
  qb: { arr: "mr_bsns_forms" },
  qc: { arr: "mr_bsns_typs" },
  d: { arr: "entryStatus" },
  s: { arr: "var_degres", multi: 1 }
 };

 //config-driven select specs from mr.da (selectFields); built-ins are the fallback
 function selFieldsCfg() {
  var out = {};
Object.keys(BUILTIN_SEL_FIELDS).forEach(function (k) {
    var c = BUILTIN_SEL_FIELDS[k];
    out[k] = { arr: c.arr, multi: c.multi, parent: c.parent, canAdd: c.canAdd, depth: c.depth, show: c.show };
   });
   var cfg = rgCfg().selectFields;
   if (cfg && typeof cfg === "object") {
    Object.keys(cfg).forEach(function (k) {
     var c = cfg[k] || {};
     if (!c.arr) return;
     out[k] = { arr: c.arr, multi: c.multi, parent: c.parent, canAdd: c.canAdd, depth: c.depth, show: c.show };
    });
   }
  return out;
 }

 function selCfg(key) {
  return selFieldsCfg()[key];
 }

 function allSelKeys() {
  return Object.keys(selFieldsCfg());
 }

 function childKeysOf(parentKey) {
  var cfg = selFieldsCfg();
  return Object.keys(cfg).filter(function (k) {
   return cfg[k] && cfg[k].parent === parentKey;
  });
 }

 function hasSelChildren(key) {
  return childKeysOf(key).length > 0;
 }

 //"cascade" declaration: moreinfo[root] lists select children the root's own
 //modal should walk through (moreinfo.k = "k1,k2" -> religion -> caste ->
 //sub caste). Returns [] unless the root and every listed child are selects,
 //so plain "more" groupings (e.g. moreinfo.m = "n,o,p" of text fields) stay
 //with the more-pane machinery.
 function cascadeChain(rootKey) {
  if (!selCfg(rootKey)) return [];
  var mi = moreInfoMap(rgCfg(), rgP());
  var kids = mi[rootKey] || [];
  if (!kids.length) return [];
  for (var i = 0; i < kids.length; i++) {
   if (!selCfg(kids[i])) return [];
  }
  return kids;
 }

 //level descriptors for a cascade root: level 0 is the root's own array; a
 //child is "nested" when its array is the previous array plus one segment
 //(read that segment off the selected item), otherwise it is a flat global
 //array. e.g. k/var_caste_rlgns -> k1 nested "castes" -> k2 flat.
 function cascadeLevels(rootKey) {
  var chain = cascadeChain(rootKey);
  if (!chain.length) return [];
  function rootSeg(a) { return String(a == null ? "" : a).split(",")[0]; }
  var levels = [{ key: rootKey, arr: rootSeg(selCfg(rootKey).arr), nested: false }];
  chain.forEach(function (child) {
   var cArr = String((selCfg(child) || {}).arr || "");
   var prev = levels[levels.length - 1];
   var prop = "";
   if (prev.arr && cArr.indexOf(prev.arr + ",") === 0) {
    var rest = cArr.slice(prev.arr.length + 1);
    if (rest && rest.indexOf(",") < 0) prop = rest;
   }
   if (prop) levels.push({ key: child, arr: cArr, nested: true, prop: prop });
   else levels.push({ key: child, arr: rootSeg(cArr), nested: false });
  });
  return levels;
 }

 //parent's currently chosen id (live input wins, base row and "97" as fallbacks)
 var rgClearedParents = {};

 function liveParentVal(parentKey, base) {
  var pv = "";
  try {
   if (rgClearedParents[parentKey]) pv = "97";
   else {
    var el = document.getElementById("rgf-" + parentKey);
    if (el && el.value !== undefined && el.value !== null) pv = String(el.value);
   }
  } catch (e) { }
  if (!pv) pv = baseVal(base, parentKey);
  if (!pv || pv === "0") pv = "97";
  return pv;
 }

 function selCanAdd(cfg) {
  if (cfg && cfg.canAdd !== undefined && cfg.canAdd !== null) return cfg.canAdd;
  return cfg.multi ? 2 : 1;
 }

 //city field -> its country config block in mr.da. The country fields (a3/b5/c5)
 //are not part of the registration form, so the country shown/scoped for a city
 //picker comes from the config default `.a` (see default*Country in mr.da).
 var COUNTRY_OF_FIELD = {
  b4: { cfg: "defaultNativeCountry", countryField: "b5" },
  a2: { cfg: "defaultWorkingCountry", countryField: "a3" },
  c6: { cfg: "defaultLivingCountry", countryField: "c5" }
 };

 //Country id/name/canChange for a city field. `overrideId` lets a caller show a
 //country the user just picked (config default is used otherwise).
 function countryInfoFor(key, overrideId) {
  var m = COUNTRY_OF_FIELD[key];
  if (!m) return null;
  var c = rgCfg()[m.cfg] || {};
  var id = (overrideId !== undefined && overrideId !== null && overrideId !== "")
   ? String(overrideId)
   : (c.a !== undefined && c.a !== null && c.a !== "" ? String(c.a) : "");
  return {
   id: id,
   name: id ? rgNameFromList("var_ctco", id) : "",
   canChange: Number(c.canChngeCountry) === 1,
   countryField: m.countryField || ""
  };
 }
 window.mrCountryInfoFor = countryInfoFor;

 function selIsDepth(cfg) {
  return !!(cfg && Number(cfg.depth) > 0);
 }

 //which selects show their value as an indented tree (like native city b4).
 //mr.da "showTreeView" (comma list) drives it; when that key is absent the
 //legacy selectFields.<k>.depth flag decides.
 function isTreeField(key) {
  var raw = rgCfg() && rgCfg().showTreeView;
  if (raw === undefined || raw === null) return selIsDepth(selCfg(key));
  return splitCsv(raw).indexOf(String(key)) >= 0;
 }

 //fullObject for the slkt2 depth picker's paint fn (setValByPrprtyDepthToElm)
 function selDepthFullObject(key) {
  var cfg = selCfg(key);
  return { c: cfg.arr, canAdd: selCanAdd(cfg), depthForNative: Number(cfg.depth) || String(cfg.arr || "").split(",").length };
 }

 //fullObject for openDepthSelectionModal: e = array path, f = required depth
 function selDepthModalObject(key) {
  var cfg = selCfg(key);
  var fo = { e: cfg.arr, f: Number(cfg.depth) || String(cfg.arr || "").split(",").length };
  var ct = countryInfoFor(key);
  if (ct) fo.ctry = ct;
  return fo;
 }

 function selFullObject(key, base) {
  var cfg = selCfg(key);
  var fo = { c: cfg.arr, canAdd: selCanAdd(cfg) };
  //drives the picker's depth navigation only when the array is nested;
  //a flat array (e.g. k2) still declares a parent for child-clearing, but must
  //open at root (no "1-<id>" depth path) or the picker would find no item.
  if (cfg.parent && String(cfg.arr).indexOf(",") >= 0) {
   var pv = liveParentVal(cfg.parent, base);
   fo.e = pv;
   fo.g = "1-" + pv;
  }
  if (hasSelChildren(key)) fo.h = "mrRegisParentSelected";
  return fo;
 }

 function selModalObject(key, base) {
  var cfg = selCfg(key);
  var fo = { e: cfg.arr, f: selCanAdd(cfg) };
  //city pickers (a2/c6) scope to the country from mr.da config; the country
  //fields (a3/c5) are not part of the form, so their stored value is ignored.
  var ct = countryInfoFor(key);
  if (ct) {
   fo.ctry = ct;
   if (ct.id) fo.g = "1-" + ct.id;
  } else if (cfg.parent && String(cfg.arr).indexOf(",") >= 0) {
   //only navigate by parent when the array is nested; flat arrays open at root
   var pv = liveParentVal(cfg.parent, base);
   fo.g = "1-" + pv;
  }
  if (hasSelChildren(key)) fo.h = "mrRegisParentSelected";
  return fo;
 }

 function ensureSelLists() {
  Object.keys(BUILTIN_LISTS).forEach(function (n) {
   var v = window[n];
   if (!Array.isArray(v) || !v.length) window[n] = BUILTIN_LISTS[n];
  });
 }

 var SKIP_UI = { x: 1 };

 //fields that must sit on their own full-width row, from mr.da "showOnSeparateRow"
 function sepRowSet() {
  var raw = rgCfg() && rgCfg().showOnSeparateRow;
  var src = (raw === undefined || raw === null || raw === "") ? "m,l,g,b4,s" : String(raw);
  var o = {};
  splitCsv(src).forEach(function (k) { if (k) o[k] = 1; });
  return o;
 }

 var TYPE_MAP = {
  u: "image",
  b6: "gallery",
  l: "tel",
  g: "date",
  x2: "textarea"
 };

 var PLACEHOLDERS = {
  m: "First name",
  n: "Surname",
  o: "Father's first name",
  p: "Mother's first name",
  h: "e.g. 5.6",
  i: "e.g. 6.50",
  r: "e.g. 12",
  d1: "00",
  c2: "leave blank if not",
  va: "e.g. patil, kadam",
  x2: "What are you looking for in a partner?",
  l: "10-digit number"
 };

  var NUM_INPUTMODE = { h: "decimal", i: "decimal", d1: "numeric", r: "numeric" };

 function labelText(map, key) {
  var s = map[key] != null ? String(map[key]) : String(key);
  return s.replace(/;\s*$/, "").trim();
 }

 function baseVal(base, key) {
  var v = base[key];
  if (v === undefined || v === null) return "";
  if (typeof v === "object") {
   try { return JSON.stringify(v); } catch (e) { return ""; }
  }
  return String(v);
 }

 function visibleKeys(map, hideSet, seqStr) {
  var seq = splitCsv(seqStr || "");
  if (!seq.length) seq = splitCsv(rgP().seqnce || "");
  var keys = [];
  function push(k) {
   if (!k || map[k] === undefined || (hideSet && hideSet[k]) || SKIP_UI[k] || keys.indexOf(k) >= 0) return;
   keys.push(k);
  }
  //the sequence is the complete visible set now (no auto-append of every map key);
  //columns left out of it simply don't render
  seq.forEach(push);
  return keys;
 }

 function toInputDate(v) {
  if (!v) return "";
  var s = String(v).trim();
  var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[0];
  m = s.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if (m) return m[3] + "-" + m[2] + "-" + m[1];
  return "";
 }

 function toInputTime(v) {
  var m = /(\d{2}):(\d{2})/.exec(String(v == null ? "" : v).trim());
  return m ? (m[1] + ":" + m[2]) : "";
 }

 function isoToBday(v, P) {
  var raw = v || "";
  var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!m) return raw;
  if ((P.bdayFormat || "dd-mm-yyyy") !== "dd-mm-yyyy") return raw;
  return m[3] + "-" + m[2] + "-" + m[1];
 }

 function fmtDdMmYyyy(v) {
  var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v == null ? "" : v).trim());
  return m ? (m[3] + "-" + m[2] + "-" + m[1]) : "";
 }

 //tracks the most recently played regis sound so the button can pause/resume it
 var regisLastAudio = null;

 //per-audio auto-play disabling: after the user pauses a given sound N times
 //(N = mr.da "autoPlaySoundStopAfter", default 2) auto-play stops for that sound.
 //Persisted in localStorage so it survives reloads. Manual play always still works.
 function audioPauseKey() {
  return ((window.appOwner && window.appOwner.tn) || "mr") + "_mrAudioPauseCounts";
 }
 function audioStopAfter() {
  try {
   var n = parseInt((rgCfg() || {}).autoPlaySoundStopAfter, 10);
   return isNaN(n) ? 2 : n;
  } catch (eA) { return 2; }
 }
 function loadAudioPauseCounts() {
  try {
   var o = JSON.parse(localStorage.getItem(audioPauseKey()) || "{}");
   return (o && typeof o === "object") ? o : {};
  } catch (eL) { return {}; }
 }
 function saveAudioPauseCounts(map) {
  try { localStorage.setItem(audioPauseKey(), JSON.stringify(map)); } catch (eS) { }
 }
 function isAudioAutoOff(raw) {
  var limit = audioStopAfter();
  if (!(limit > 0) || !raw) return false;
  return (parseInt(loadAudioPauseCounts()[String(raw)], 10) || 0) >= limit;
 }
 function noteAudioPause(raw) {
  if (!(audioStopAfter() > 0) || !raw) return;
  var map = loadAudioPauseCounts();
  var k = String(raw);
  map[k] = (parseInt(map[k], 10) || 0) + 1;
  saveAudioPauseCounts(map);
 }

 //wajiw "fm" = form mode(s) the sound applies to: 1 = registration, 2 = update.
 //undefined/empty -> both; "1" -> only registration; "2" -> only update; "1,2" -> both.
 function audioAllowedForMode(fm, isUpdate) {
  if (fm === undefined || fm === null || String(fm).trim() === "") return true;
  var modes = String(fm).split(",");
  var want = isUpdate ? "2" : "1";
  for (var i = 0; i < modes.length; i++) {
   if (modes[i].trim() === want) return true;
  }
  return false;
 }

 function regisPlaySound(raw) {
  if (!rgAudioOn) return;
  if (!raw) return;
  var prev = regisLastAudio;
  if (prev && typeof prev.pause === "function" && !prev.ended) {
   try { prev.pause(); } catch (eP) { }
   try { prev.currentTime = 0; } catch (eC) { }
  }
  var a = (typeof mrGetAudio === "function") ? mrGetAudio(raw) : null;
  if (!a) {
   try { a = new Audio(raw); } catch (e2) { return; }
  }
  regisLastAudio = a; //set synchronously so the next play always stops it
  try { a.__mrRaw = raw; } catch (eT) { }
  try { a.currentTime = 0; } catch (eC2) { }
  Promise.resolve(a.play()).catch(function () { });
 }

 function regisSoundToggle(raw) {
  if (!rgAudioOn) return;
  var a = regisLastAudio;
  if (a && typeof a.pause === "function" && !a.ended) {
   if (a.paused) {
    try { Promise.resolve(a.play()).catch(function () { }); } catch (eR) { }
   } else {
    try { a.pause(); } catch (eP) { }
    noteAudioPause(a.__mrRaw || raw);
   }
   return;
  }
  if (raw) regisPlaySound(raw);
 }

 function toDisplayPhone(v) {
  if (v === null || v === undefined || v === "") return "";
  var d = String(v).replace(/\D/g, "");
  if (d.length > 10 && d.slice(0, 2) === "91") d = d.slice(2);
  if (d.length > 10 && d.charAt(0) === "0") d = d.slice(1);
  return d.slice(0, 10);
 }

 // Resolve an id to its display name from a window list (supports "topNest,childList").
 function rgNameFromList(listName, id) {
  if (!listName || id === null || id === undefined || id === "") return "";
  var parts = String(listName).split(",");
  var topName = parts[0].trim();
  var top = window[topName];
  if (!Array.isArray(top) || !top.length) top = BUILTIN_LISTS[topName];
  if (!Array.isArray(top)) return "";
  var subKey = parts[1] ? parts[1].trim() : "";
  for (var i = 0; i < top.length; i++) {
   var it = top[i];
   if (!it) continue;
   if (String(it.a) === String(id)) return it.e != null ? String(it.e) : "";
   if (subKey && Array.isArray(it[subKey])) {
    var sub = it[subKey];
    for (var j = 0; j < sub.length; j++) {
     if (sub[j] && String(sub[j].a) === String(id)) return sub[j].e != null ? String(sub[j].e) : "";
    }
   }
  }
  return "";
 }

  // Resolve a comma path ("stateId,districtId,talukaId") against a nested
  // hierarchy list ("var_intal,dstrcts,thsls") into "State / District / Taluka".
  function rgDepthNameFromList(listName, path) {
   if (!listName || path === null || path === undefined || path === "") return "";
   var parts = String(listName).split(",").map(function (p) { return p.trim(); });
   var top = window[parts[0]];
   if (!Array.isArray(top)) return "";
   var childKeys = parts.slice(1);
   var ids = String(path).split(",").map(function (s) { return s.trim(); }).filter(Boolean);
   var names = [];
   var arr = top;
   for (var i = 0; i < ids.length; i++) {
    var found = null;
    for (var j = 0; j < arr.length; j++) {
     if (arr[j] && String(arr[j].a) === ids[i]) { found = arr[j]; break; }
    }
    if (!found) break;
    names.push(found.e != null ? String(found.e) : "");
    arr = (i < childKeys.length) ? (found[childKeys[i]] || []) : [];
   }
   return names.filter(Boolean).join(" / ");
  }

  // Format one field's stored value for read-only display (dates/phone/select lookups).
  function rgFieldValue(key, base) {
   var raw = baseVal(base, key);
   if (raw === "") return "";
   if (key === "g") return fmtDdMmYyyy(raw) || raw;
   if (key === "l") return toDisplayPhone(raw);
   var cfg = selCfg(key);
   if (!cfg) return raw;
   if (isTreeField(key)) return rgDepthNameFromList(cfg.arr, raw) || raw;
   if (cfg.multi) {
   return String(raw).split(",").map(function (v) {
    var t = v.trim();
    return rgNameFromList(cfg.arr, t) || t;
   }).filter(Boolean).join(", ");
  }
  return rgNameFromList(cfg.arr, raw) || raw;
 }

  // Read-only label/value grid reusing the registration (rg-) design.
  // Exposed so the profile-details module can render another member's data.
  // The rows come strictly from config colsToDispOnCard (no fallback, no
  // auto-append); colsToDispOnCardOnMoreBtn holds the extra rows revealed by the
  // detail "more" button. The "u" token is not a row - it toggles the hero DP
  // and is read by mrDetailShowDp.
  function mrDetailSeq() {
   return splitCsv(rgCfg().colsToDispOnCard || "");
  }

  function mrDetailMoreSeq() {
   return splitCsv(rgCfg().colsToDispOnCardOnMoreBtn || "");
  }

  function mrDetailHideSet(hiddenKeys) {
   var hideSet = {};
   if (Array.isArray(hiddenKeys)) hiddenKeys.forEach(function (k) { hideSet[k] = 1; });
   else splitCsv(hiddenKeys).forEach(function (k) { hideSet[k] = 1; });
   return hideSet;
  }

  //true when the hero DP should render: "u" is in the detail sequence and not hidden
  function mrDetailShowDp(hiddenKeys) {
   if (mrDetailSeq().indexOf("u") < 0) return false;
   return !mrDetailHideSet(hiddenKeys).u;
  }

function mrRenderProfileReadonly(profile, hiddenKeys, galleryHtmlStr) {
    profile = profile || {};
    ensureSelLists();
    var map = rgCfg().fieldNameMap || rgP().fieldNameMap || {};
    var hideSet = mrDetailHideSet(hiddenKeys);
    var seq = mrDetailSeq();
    if (!seq.length) return "";
    var out = "";
    var rows = "";
    var headDone = false;
    var galDone = false;
    function flushRows() {
     if (rows === "") return;
     if (!headDone) { out += '<div class="mrd-section">Details</div>'; headDone = true; }
     out += '<div class="rg-view">' + rows + '</div>';
     rows = "";
    }
    //value + label for one detail key; null = nothing to print
    function detailRow(k) {
     if (!k || k === "u" || k === "b6") return null;
     if (hideSet[k] || SKIP_UI[k]) return null;
     var v;
     var keyLabel;
     if (k === "age") {
      //synthetic row: age computed from the "g" birth date via calculateAge (mr.js)
      keyLabel = "Age";
      var ag = (typeof window.calculateAge === "function" && profile && profile.g)
       ? window.calculateAge(profile.g) : "";
      v = (ag !== null && ag !== "" && ag !== "Unknown") ? (ag + " yrs") : "-";
     } else {
      if (map[k] === undefined) return null;
      keyLabel = labelText(map, k);
      v = rgFieldValue(k, profile);
     }
     //skip fields that resolved to nothing, so blank columns don't print empty rows
     if (v === null || v === undefined || String(v).trim() === "") return null;
     return { label: keyLabel, val: String(v) };
    }
    function rowHtml(r) {
     var full = r.val.length > 28 ? " full" : "";
     return '<div class="rg-view-item' + full + '">' +
      '<span class="rg-view-key">' + esc(r.label) + '</span>' +
      '<span class="rg-view-val">' + esc(r.val) + '</span></div>';
    }
    seq.forEach(function (k) {
     if (!k || k === "u") return;
     if (k === "b6") {
      //gallery sits at the "b6" position of colsToDispOnCard
      if (!hideSet.b6 && !galDone && galleryHtmlStr) { flushRows(); out += galleryHtmlStr; galDone = true; }
      return;
     }
     var r = detailRow(k);
     if (r) rows += rowHtml(r);
    });
    flushRows();
    //extra rows behind the "more" button: colsToDispOnCardOnMoreBtn minus colsToDispOnCard
    var moreRows = "";
    mrDetailMoreSeq().forEach(function (k) {
     if (!k || seq.indexOf(k) >= 0) return;
     var r = detailRow(k);
     if (r) moreRows += rowHtml(r);
    });
    if (moreRows) {
     if (!headDone) { out += '<div class="mrd-section">Details</div>'; headDone = true; }
     out += '<div class="rg-view mrd-more" data-more hidden>' + moreRows + '</div>' +
      '<button type="button" class="rg-btn rg-morebtn mrd-morebtn" data-more-btn ' +
      'onclick="mrDetailMoreToggle(this)">' +
      '<i class="fa-solid fa-chevron-down"></i><span>more</span></button>';
    }
    return out;
   }

  //toggle for the detail "more" block (reveals colsToDispOnCardOnMoreBtn rows)
  window.mrDetailMoreToggle = function (btn) {
   try {
    var wrap = btn && btn.parentNode ? btn.parentNode : null;
    var box = wrap ? wrap.querySelector(".mrd-more") : null;
    if (!box) return;
    var open = box.hasAttribute("hidden");
    if (open) box.removeAttribute("hidden"); else box.setAttribute("hidden", "");
    btn.innerHTML = open
     ? '<i class="fa-solid fa-chevron-up"></i><span>less</span>'
     : '<i class="fa-solid fa-chevron-down"></i><span>more</span>';
   } catch (e) { }
  };

  window.mrRegisEnsureCss = ensureCss;
  window.mrRenderProfileReadonly = mrRenderProfileReadonly;
  window.mrDetailShowDp = mrDetailShowDp;

 function sanitizeTel(el) {
  var d = el.value.replace(/\D/g, ""); if (d.length > 10 && d.slice(0, 2) === "91") d = d.slice(2);
  if (d.length > 10 && d.charAt(0) === "0") d = d.slice(1);
  el.value = d.slice(0, 10);
 }

 function maskAlphaDot(el) {
  el.value = el.value.replace(/[^A-Za-z.]/g, "");
 }

 function maskDecimal(el, intMax) {
  var v = el.value.replace(/[^\d.]/g, "");
  var dot = v.indexOf(".");
  var i = dot >= 0 ? v.slice(0, dot) : v;
  var d = dot >= 0 ? v.slice(dot + 1).replace(/\./g, "").slice(0, 2) : "";
  if (intMax > 0) i = i.slice(0, intMax);
  el.value = i + (dot >= 0 ? "." + d : "");
 }

  function maskEducation(el) {
   el.value = el.value.replace(/\D/g, "").slice(0, 2);
  }

 function normalizeDecimal2(el) {
  if (el.value === "" || el.value === ".") { el.value = ""; return; }
  var n = parseFloat(el.value);
  if (!isNaN(n)) el.value = n.toFixed(2);
 }

 function maskDigits2(el) {
  el.value = el.value.replace(/\D/g, "").slice(0, 2);
 }

 function fieldHtml(key, map, base, P, reqSet, lockSet) {
  var type = selCfg(key) ? "sel" : (TYPE_MAP[key] || "text");
  var label = esc(labelText(map, key)) + (reqSet && reqSet[key] ? '<span class="rg-req">*</span>' : "");
  var val = baseVal(base, key);
  var ph = PLACEHOLDERS[key] || "";
  var inner = "";
  var cls = "";
  var sepSet = sepRowSet();

  if (type === "sel") {
   var locked = lockSet && lockSet[key];
   inner =
    '<input type="hidden" id="rgf-' + esc(key) + '" data-name="' + esc(key) + '" value="' + esc(val) + '">' +
    '<div class="rg-selbox' + (locked ? " rg-locked" : "") + '" id="rgsel-' + esc(key) + '"' +
    (locked ? ' data-locked="1"' : "") + '></div>';
  } else if (type === "image") {
   cls = "full";
   inner =
    '<div class="rg-dp">' +
    '<div class="rg-dp-thumb" data-dp-thumb></div>' +
    '<div class="rg-dp-actions">' +
    '<button type="button" class="rg-btn rg-btn-ghost" data-act="dp-pick"><i class="fa-solid fa-camera"></i> Add photo</button>' +
    '<button type="button" class="rg-btn rg-btn-ghost" data-act="dp-rm" hidden><i class="fa-solid fa-trash"></i> Remove</button>' +
    "</div>" +
    "</div>" +
    '<input type="hidden" data-name="' + key + '" value="' + esc(val) + '">';
  } else if (type === "gallery") {
   cls = "full";
   inner =
    '<div class="rg-gal" data-gal-grid></div>' +
    '<input type="hidden" data-name="' + key + '" value="' + esc(val) + '">';
  } else if (type === "tel") {
   inner =
    '<div class="rg-inwrap"><span class="rg-prefix">+91</span>' +
    '<input class="rg-in" data-name="' + key + '" type="tel" inputmode="numeric" maxlength="10" ' +
    'placeholder="' + esc(ph) + '" value="' + esc(toDisplayPhone(val)) + '"></div>';
  } else if (type === "date") {
   cls = "full";
   inner =
    '<div class="rg-dt-row">' +
    '<div class="rg-inwrap rg-date-wrap">' +
    '<input class="rg-in" id="rgdate-' + esc(key) + '" data-name="' + esc(key) + '" type="text" ' +
    'readonly aria-label="' + esc(labelText(map, key)) + '" value="' + esc(toInputDate(val)) + '">' +
    '<span class="rg-date-disp" id="rgdate-' + esc(key) + '_disp"></span>' +
    '<span class="rg-cal"><i class="fa-solid fa-calendar-days"></i></span>' +
    "</div>" +
    '<div class="rg-inwrap rg-date-wrap">' +
    '<input class="rg-in" id="rgtime-' + esc(key) + '" type="text" readonly ' +
    'aria-label="Time" value="' + esc(toInputTime(val)) + '">' +
    '<span class="rg-date-disp" id="rgtime-' + esc(key) + '_disp"></span>' +
    '<span class="rg-cal"><i class="fa-solid fa-clock"></i></span>' +
    "</div>" +
    "</div>";
  } else if (type === "textarea") {
   cls = "full";
   inner =
    '<div class="rg-inwrap"><textarea class="rg-in rg-ta" data-name="' + key + '" rows="3" ' +
    'placeholder="' + esc(ph) + '">' + esc(val) + "</textarea></div>";
  } else {
   var im = NUM_INPUTMODE[key] ? ' inputmode="' + NUM_INPUTMODE[key] + '"' : "";
   inner =
    '<div class="rg-inwrap"><input class="rg-in" data-name="' + key + '" type="text"' + im +
    ' placeholder="' + esc(ph) + '" value="' + esc(val) + '"></div>';
  }

  if (sepSet[key]) cls = "full";

  return (
   '<div class="rg-field' + (cls ? " " + cls : "") + '" data-key="' + esc(key) + '">' +
   '<span class="rg-label">' + label + "</span>" + inner +
   '<span class="rg-err"></span></div>'
  );
 }

 function formatDate(date, format) {
  function pad(num) { return String(num).padStart(2, "0"); }
  var year = date.getFullYear();
  var month = pad(date.getMonth() + 1);
  var day = pad(date.getDate());
  var hour = pad(date.getHours());
  var minute = pad(date.getMinutes());
  var second = pad(date.getSeconds());
  switch (format) {
   case "dd-mm-yyyy": return day + "-" + month + "-" + year;
   case "dd-mm-yyyy HH:MM": return day + "-" + month + "-" + year + " " + hour + ":" + minute;
   case "dd-mm-yyyy HH:MM:SS": return day + "-" + month + "-" + year + " " + hour + ":" + minute + ":" + second;
   case "dd/mm/yyyy": return day + "/" + month + "/" + year;
   case "dd/mm/yyyy HH:MM": return day + "/" + month + "/" + year + " " + hour + ":" + minute;
   case "dd/mm/yyyy HH:MM:SS": return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
   case "yyyy-mm-dd": return year + "-" + month + "-" + day;
   case "yyyy-mm-dd HH:MM": return year + "-" + month + "-" + day + " " + hour + ":" + minute;
   case "yyyy-mm-dd HH:MM:SS": return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
   case "yyyy/mm/dd": return year + "/" + month + "/" + day;
   case "yyyy/mm/dd HH:MM": return year + "/" + month + "/" + day + " " + hour + ":" + minute;
   case "yyyy/mm/dd HH:MM:SS": return year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
   default: return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }
 }

 window.convertDateStrToGvn = function (dateStr, cnvoOptions) {
  cnvoOptions = cnvoOptions || {};
  var currentFormat = cnvoOptions.currentFormat;
  var targetFormat = cnvoOptions.targetFormat;
  var retType = cnvoOptions.retType || 0;
  if (!dateStr || typeof dateStr !== "string") {
   return retType === 1 ? new Date(NaN) : "";
  }
  var day, month, year, hour, minute, second;
  var formatPatterns = {
   "dd-mm-yyyy": /^(\d{2})-(\d{2})-(\d{4})$/,
   "dd-mm-yyyy HH:MM": /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/,
   "dd-mm-yyyy HH:MM:SS": /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
   "dd/mm/yyyy": /^(\d{2})\/(\d{2})\/(\d{4})$/,
   "dd/mm/yyyy HH:MM": /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/,
   "dd/mm/yyyy HH:MM:SS": /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
   "yyyy-mm-dd": /^(\d{4})-(\d{2})-(\d{2})$/,
   "yyyy-mm-dd HH:MM": /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/,
   "yyyy-mm-dd HH:MM:SS": /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
   "yyyy/mm/dd": /^(\d{4})\/(\d{2})\/(\d{2})$/,
   "yyyy/mm/dd HH:MM": /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})$/,
   "yyyy/mm/dd HH:MM:SS": /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
  };
  var pattern = formatPatterns[currentFormat];
  if (!pattern) {
   console.error("Unsupported format: " + currentFormat);
   return retType === 1 ? new Date(NaN) : "";
  }
  var match = dateStr.match(pattern);
  if (!match) {
   console.error('Date string "' + dateStr + '" does not match format "' + currentFormat + '"');
   return retType === 1 ? new Date(NaN) : "";
  }
  var hasTime = currentFormat.indexOf("HH:MM") >= 0;
  var hasSeconds = currentFormat.indexOf("HH:MM:SS") >= 0;
  if (currentFormat.indexOf("dd-mm-yyyy") >= 0 || currentFormat.indexOf("dd/mm/yyyy") >= 0) {
   day = parseInt(match[1], 10);
   month = parseInt(match[2], 10);
   year = parseInt(match[3], 10);
   if (hasSeconds) {
    hour = parseInt(match[4], 10);
    minute = parseInt(match[5], 10);
    second = parseInt(match[6], 10);
   } else if (hasTime) {
    hour = parseInt(match[4], 10);
    minute = parseInt(match[5], 10);
    second = 0;
   } else {
    hour = 0;
    minute = 0;
    second = 0;
   }
  } else {
   year = parseInt(match[1], 10);
   month = parseInt(match[2], 10);
   day = parseInt(match[3], 10);
   if (hasSeconds) {
    hour = parseInt(match[4], 10);
    minute = parseInt(match[5], 10);
    second = parseInt(match[6], 10);
   } else if (hasTime) {
    hour = parseInt(match[4], 10);
    minute = parseInt(match[5], 10);
    second = 0;
   } else {
    hour = 0;
    minute = 0;
    second = 0;
   }
  }
  if (year === 0 && month === 0 && day === 0) {
   if (targetFormat === "dd-mm-yyyy") return "00-00-0000";
   if (targetFormat === "dd/mm/yyyy") return "00/00/0000";
   if (targetFormat === "yyyy-mm-dd") return "0000-00-00";
   if (targetFormat === "yyyy/mm/dd") return "0000/00/00";
   return "00-00-0000";
  }
  var dateObj = new Date(year, month - 1, day, hour, minute, second);
  if (isNaN(dateObj.getTime())) {
   console.error("Invalid date created");
   return retType === 1 ? new Date(NaN) : "";
  }
  if (retType === 1) return dateObj;
  return formatDate(dateObj, targetFormat);
 };

 window.handleAsString = function (value, cnvoOptions) {
  var prependStr = cnvoOptions && cnvoOptions.prepn ? cnvoOptions.prepn : "";
  if (!prependStr) return value;
  var strValue = String(value);
  if (strValue.indexOf(prependStr) !== 0) strValue = prependStr + strValue;
  return strValue;
 };

 function cmnVldet(dataToValidate, objOfValidation) {
  var result = { su: 1, ms: "Validation passed" };
  if (!objOfValidation || typeof objOfValidation !== "object" || Object.keys(objOfValidation).length === 0) {
   return result;
  }
  function isAllZerosDate(dateStr) {
   if (!dateStr) return false;
   var zeroPatterns = [/^0000-00-00$/, /^0000-00-00 00:00:00$/, /^0000-00-00 00:00$/, /^00-00-0000$/, /^00\/00\/0000$/];
   return zeroPatterns.some(function (pattern) { return pattern.test(dateStr); });
  }
  function parseMinDate(minValue) {
   if (!minValue) return null;
   var parts = minValue.split("-");
   return {
    year: parseInt(parts[0], 10),
    month: parts.length > 1 ? parseInt(parts[1], 10) : null,
    day: parts.length > 2 ? parseInt(parts[2], 10) : null
   };
  }
  function meetsMinDate(dateObj, minConfig) {
   if (!minConfig) return true;
   var dateYear = dateObj.getFullYear();
   var dateMonth = dateObj.getMonth() + 1;
   var dateDay = dateObj.getDate();
   if (dateYear < minConfig.year) return false;
   if (dateYear > minConfig.year) return true;
   if (minConfig.month !== null) {
    if (dateMonth < minConfig.month) return false;
    if (dateMonth > minConfig.month) return true;
   }
   if (minConfig.day !== null) {
    if (dateDay < minConfig.day) return false;
   }
   return true;
  }
  function meetsMaxDate(dateObj, maxConfig) {
   if (!maxConfig) return true;
   var dateYear = dateObj.getFullYear();
   var dateMonth = dateObj.getMonth() + 1;
   var dateDay = dateObj.getDate();
   if (dateYear > maxConfig.year) return false;
   if (dateYear < maxConfig.year) return true;
   if (maxConfig.month !== null) {
    if (dateMonth > maxConfig.month) return false;
    if (dateMonth < maxConfig.month) return true;
   }
   if (maxConfig.day !== null) {
    if (dateDay > maxConfig.day) return false;
   }
   return true;
  }
  var entries = Object.entries(objOfValidation);
  for (var i = 0; i < entries.length; i++) {
   var fieldKey = entries[i][0];
   var rules = entries[i][1];
   var fieldValue = dataToValidate[fieldKey];
   var customMessage = rules.ms;
   if (fieldValue === undefined || fieldValue === null) {
    if (rules.opt) continue;
    result.su = 0;
    result.fld = fieldKey;
    result.ms = customMessage || "field cannot be empty";
    return result;
   }
   var valueStr = String(fieldValue).trim();
   if (valueStr === "") {
    if (rules.opt) continue;
    result.su = 0;
    result.fld = fieldKey;
    result.ms = customMessage || "field cannot be blank";
    return result;
   }
   var cnvFunction = rules.cnv;
   var cnvoOptions = rules.cnvo || {};
   var valueType = rules.ty;
   var minValue = rules.mi;
   var maxValue = rules.mx;
   var pattern = rules.patn;
   var processedValue = valueStr;
   try {
    processedValue = window[cnvFunction](valueStr, cnvoOptions);
    dataToValidate[fieldKey] = processedValue;
    fieldValue = processedValue;
   } catch (e) {
    console.error("Error in conversion function " + cnvFunction + ":", e);
    result.su = 0;
    result.fld = fieldKey;
    result.ms = customMessage || "Invalid format for field: " + fieldKey;
    return result;
   }
   if (valueType === "dt") {
    var dateObj = new Date(processedValue);
    if (isNaN(dateObj.getTime())) {
     result.su = 0;
     result.fld = fieldKey;
     result.ms = customMessage || "Invalid date for field: " + fieldKey;
     return result;
    }
    if (isAllZerosDate(processedValue)) {
     result.su = 0;
     result.fld = fieldKey;
     result.ms = customMessage || "Invalid date (all zeros) for field: " + fieldKey;
     return result;
    }
    if (minValue) {
     var minConfig = parseMinDate(minValue);
     if (!meetsMinDate(dateObj, minConfig)) {
      result.su = 0;
      result.fld = fieldKey;
      result.ms = customMessage || "Date is before minimum allowed (" + minValue + ") for field: " + fieldKey;
      return result;
     }
    }
    if (maxValue) {
     var maxConfig = parseMinDate(maxValue);
     if (!meetsMaxDate(dateObj, maxConfig)) {
      result.su = 0;
      result.fld = fieldKey;
      result.ms = customMessage || "Date is after maximum allowed (" + maxValue + ") for field: " + fieldKey;
      return result;
     }
    }
   }
   if (pattern) {
    try {
     var regex = new RegExp(pattern, rules.flgs || "");
     if (!regex.test(processedValue)) {
      result.su = 0;
      result.fld = fieldKey;
      result.ms = customMessage || "Invalid format for field: " + fieldKey;
      return result;
     }
    } catch (e) {
     console.error("Invalid regex pattern: " + pattern, e);
     result.su = 0;
     result.fld = fieldKey;
     result.ms = customMessage || "Invalid validation pattern for field: " + fieldKey;
     return result;
    }
   }
  }
  return result;
 }

 function cleanNumericProperty(value, propertyKey) {
  if (value === null || value === undefined || value === "") return "0";
  var str = String(value).toLowerCase().trim();
  if (propertyKey === "h") {
   var feetInchMatch = str.match(/(\d+)\s*feet\s*(\d+)\s*inch/);
   if (feetInchMatch) { return (parseInt(feetInchMatch[1], 10) + parseInt(feetInchMatch[2], 10) / 12).toFixed(2); }
   var feetMatch = str.match(/(\d+\.?\d*)\s*feet/);
   if (feetMatch) { return parseFloat(feetMatch[1]).toFixed(2); }
   var numMatch = str.match(/(\d+\.?\d*)/);
   if (numMatch) { return parseFloat(numMatch[1]).toFixed(2); }
  }
  if (propertyKey === "i") {
   var lakhThousandMatch = str.match(/(\d+)\s*lakhs?\s*(\d+)\s*thousand/);
   if (lakhThousandMatch) { return (parseInt(lakhThousandMatch[1], 10) + parseInt(lakhThousandMatch[2], 10) / 100).toFixed(2); }
   var lakhMatch = str.match(/(\d+\.?\d*)\s*lakhs?/);
   if (lakhMatch) { return parseFloat(lakhMatch[1]).toFixed(2); }
   var numMatch2 = str.match(/(\d+\.?\d*)/);
   if (numMatch2) { return parseFloat(numMatch2[1]).toFixed(2); }
  }
  if (propertyKey === "r") {
   var rMatch = str.match(/(\d+)/);
   if (rMatch) { return rMatch[1]; }
  }
  if (propertyKey === "a1") {
   var kgGramMatch = str.match(/(\d+)\s*kg\s*(\d+)\s*gram/);
   if (kgGramMatch) { return (parseInt(kgGramMatch[1], 10) + parseInt(kgGramMatch[2], 10) / 1000).toFixed(1); }
   var kgMatch = str.match(/(\d+\.?\d*)\s*kg/);
   if (kgMatch) { return parseFloat(kgMatch[1]).toFixed(1); }
   var numMatch3 = str.match(/(\d+\.?\d*)/);
   if (numMatch3) { return parseFloat(numMatch3[1]).toFixed(1); }
  }
  if (propertyKey === "a8" || propertyKey === "b1") {
   var allNums = str.match(/(\d+)/g);
   if (allNums) {
    var total = allNums.reduce(function (sum, num) { return sum + parseInt(num, 10); }, 0);
    return String(total);
   }
  }
  var defMatch = str.match(/(\d+\.?\d*)/);
  return defMatch ? defMatch[1] : "0";
 }

 function dfltReligiousCfg() {
  var cfg = rgCfg().dfltReligious;
  if (cfg && typeof cfg === "object") return cfg;
  if (cfg !== undefined && cfg !== null && cfg !== "") return { a: cfg };
  return null;
 }

 function setDfltReligious(profileData) {
  if (!profileData) return profileData;
  var cfg = dfltReligiousCfg();
  if (!cfg) return profileData;
  var id = cfg.a;
  if (id === undefined || id === null || id === "") return profileData;
  var list = (typeof window !== "undefined" && window.var_caste_rlgns) || [];
  var hit = null;
  for (var i = 0; i < list.length; i++) {
   if (list[i] && String(list[i].a) === String(id)) { hit = list[i]; break; }
  }
  profileData.k = hit ? hit.a : id;
  return profileData;
 }
 window.setDfltReligious = setDfltReligious;

 function dfltReligiousLock() {
  var cfg = dfltReligiousCfg();
  return !!(cfg && Number(cfg.z) === 1);
 }

 function dfltCasteCfg() {
  var cfg = rgCfg().dfltCaste;
  if (cfg && typeof cfg === "object") return cfg;
  if (cfg !== undefined && cfg !== null && cfg !== "") return { a: cfg };
  return null;
 }

 //dfltCaste.a is the id of the default caste (k1), nested under a religion's
 //castes; prefer a match inside the already-chosen religion, else any religion.
 function setDfltCaste(profileData) {
  if (!profileData) return profileData;
  var cfg = dfltCasteCfg();
  if (!cfg) return profileData;
  var id = cfg.a;
  if (id === undefined || id === null || id === "") return profileData;
  var list = (typeof window !== "undefined" && window.var_caste_rlgns) || [];
  var preK = profileData.k;
  var hit = null;
  function findIn(religion) {
   var castes = religion && religion.castes;
   if (!Array.isArray(castes)) return null;
   for (var j = 0; j < castes.length; j++) {
    if (castes[j] && String(castes[j].a) === String(id)) return castes[j];
   }
   return null;
  }
  if (preK !== undefined && preK !== null && preK !== "") {
   for (var i = 0; i < list.length && !hit; i++) {
    if (String(list[i] && list[i].a) === String(preK)) hit = findIn(list[i]);
   }
  }
  for (var m = 0; m < list.length && !hit; m++) hit = findIn(list[m]);
  profileData.k1 = hit ? hit.a : id;
  return profileData;
 }
 window.setDfltCaste = setDfltCaste;

 function dfltCasteLock() {
  var cfg = dfltCasteCfg();
  return !!(cfg && Number(cfg.z) === 1);
 }

 function defaultProfileData() {
  return setDfltCaste(setDfltReligious({
   d: 0, e: 0, g: "", j: 0, q: "", qa: "", qb: "", qc: "", s: "", x: "", z: "",
   a2: "", b4: "", c6: "", a9: "", a5: 0, a7: 0, b6: [], u: "",
   k: 0, k1: 9, k2: 0, a3: 97, b5: 97, c5: 97
  }));
 }

 function applyDefaultValues(profileData) {
  var defaultVals = rgP().defaFieldVals;
  if (!Array.isArray(defaultVals) || defaultVals.length === 0) return profileData;
  defaultVals.forEach(function (item) {
   var parts = String(item).split("~");
   if (parts.length !== 2) return;
   var field = parts[0];
   var value = parts[1];
   if (!Object.prototype.hasOwnProperty.call(profileData, field)) return;
   var originalValue = profileData[field];
   if (typeof originalValue === "number") {
    profileData[field] = parseInt(value, 10);
   } else if (typeof originalValue === "boolean") {
    profileData[field] = value === "true" || value === "1";
   } else {
    profileData[field] = value;
   }
  });
  return profileData;
 }

 function resolveValidationRules(P, C) {
  var raw = (C && C.vlidFn62_63) || (P && P.vlidFn62_63) || null;
  if (!raw || typeof raw !== "object") return null;
  var out = {};
  Object.keys(raw).forEach(function (k) {
   var src = raw[k] || {};
   var rule = {};
   Object.keys(src).forEach(function (rk) { rule[rk] = src[rk]; });
   if (!rule.cnv || typeof window[rule.cnv] !== "function") rule.cnv = "handleAsString";
   var cnvo = {};
   if (src.cnvo && typeof src.cnvo === "object") {
    Object.keys(src.cnvo).forEach(function (rk) { cnvo[rk] = src.cnvo[rk]; });
   }
   if (typeof cnvo.currentFormat === "string" && cnvo.currentFormat.indexOf("bdayFormat") >= 0) {
    cnvo.currentFormat = P.bdayFormat || "dd-mm-yyyy";
   }
   rule.cnvo = cnvo;
   out[k] = rule;
  });
  return out;
 }

 function findProfile(id) {
  try {
   if (typeof profilesData !== "undefined" && Array.isArray(profilesData)) {
    for (var i = 0; i < profilesData.length; i++) {
     if (profilesData[i] && String(profilesData[i].a) === String(id)) return profilesData[i];
    }
   }
  } catch (e) { }
  //fall back to the stored copy of the member's own profile so "edit" opens pre-filled
  try {
   if (window.myEinMR && String(window.myEinMR.a) === String(id)) return window.myEinMR;
   var tn = window.appOwner && window.appOwner.tn;
   var s = tn ? localStorage.getItem(tn + "_myEinMR") : null;
   if (s && s !== "undefined" && s !== "null") {
    var o = JSON.parse(s);
    if (o && String(o.a) === String(id)) return o;
   }
  } catch (e2) { }
  return null;
 }

 function resolveU(raw) {
  if (!raw) return { display: null, thumbnail: null };
  if (typeof window.mrResolveProfileImages === "function") {
   try { return window.mrResolveProfileImages(raw); } catch (e) { }
  }
  try {
   var o = typeof raw === "string" ? JSON.parse(raw) : raw;
   if (o && (o.a || o.b)) return { display: o.a || null, thumbnail: o.b || o.a || null };
  } catch (e2) { }
  return { display: raw, thumbnail: raw };
 }

 var selOverlayOpen = false;
 var selGuardsBound = false;

 function fixSelZ(t) {
  try {
   if (t && t.style) t.style.zIndex = "100001";
  } catch (e) { }
  var bds = document.querySelectorAll(".modal-backdrop");
  if (bds.length) bds[bds.length - 1].style.zIndex = "100000";
 }

 function injectSelOkFooter(modal) {
  var content = modal.querySelector(".modal-content");
  if (!content || content.querySelector(".rg-sel-ok-footer")) return;
  var footer = document.createElement("div");
  footer.className = "modal-footer rg-sel-ok-footer";
  footer.style.cssText = "justify-content:center;gap:8px;padding:10px 16px;";
  var ok = document.createElement("button");
  ok.type = "button";
  ok.className = "btn btn-primary";
  ok.style.cssText = "border-radius:999px;padding:8px 30px;font-weight:600;border:none;" +
   "background-image:linear-gradient(135deg,var(--mr-primary,#8B1E3F),var(--mr-primary-700,#6E1733));";
  ok.innerHTML = '<i class="fas fa-check me-1"></i>OK';
  ok.addEventListener("click", function () {
   var inst = (typeof bootstrap !== "undefined" && bootstrap.Modal)
    ? bootstrap.Modal.getInstance(modal) : null;
   if (inst) inst.hide();
  });
  footer.appendChild(ok);
  content.appendChild(footer);
 }

 function bindSelGuards() {
  if (selGuardsBound) return;
  selGuardsBound = true;
  document.addEventListener("show.bs.modal", function (e) {
   var t = e.target;
   if (!isSelLibModal(t)) return;
   selOverlayOpen = true;
   if (t.getAttribute("data-array-name") === "var_degres") injectSelOkFooter(t);
   fixSelZ(t);
   setTimeout(function () { fixSelZ(t); }, 60);
  });
  document.addEventListener("hidden.bs.modal", function (e) {
   var t = e.target;
   if (!isSelLibModal(t)) return;
   selOverlayOpen = false;
  });
 }

 // The slkt.js picker tags its modal with data-array-name; the slkt2.js depth
 // picker uses an id prefixed depth_select_modal_; the moreinfo cascade modal
 // uses rgCasc_. Treat all three as selection modals.
 function isSelLibModal(t) {
  if (!t || !t.getAttribute) return false;
  if (t.getAttribute("data-array-name")) return true;
  if (typeof t.id !== "string") return false;
  //the moreinfo cascade modal (rgCasc_) needs the same z-index/backdrop fix
  return t.id.indexOf("depth_select_modal_") === 0 || t.id.indexOf("rgCasc_") === 0;
 }

 window.showRegistrationModal = function (recordId, opts) {
  ensureCss();
  bindSelGuards();
  selOverlayOpen = false;
  var prev = document.getElementById(MODAL_ID);
  if (prev && prev.parentNode) prev.parentNode.removeChild(prev);

  var P = rgP();
  rgClearedParents = {};
  var C = rgCfg();
  var map = C.fieldNameMap || P.fieldNameMap || {};

  //add vs update drives the visible/required columns: colsToShowOnProfileSave /
  //colsRequiredOnProfileSave for a new profile, colsToShowOnProfileUpdate /
  //colsRequiredOnProfileUpdate when editing. Admin add/update uses the same pair.
  var adminMode = !!(opts && opts.admin);
  rgAdmOpen = adminMode ? 1 : 0;
  rgAudioOn = adminMode ? 0 : 1;
  if (adminMode && regisLastAudio && typeof regisLastAudio.pause === "function") {
   try { regisLastAudio.pause(); } catch (eP) { }
  }

  var isUpdate = recordId != null && recordId !== "" && Number(recordId) > 0;
  var hideSet = {};
  var seqOrder = isUpdate ? (C.colsToShowOnProfileUpdate || P.colsToShowOnProfileUpdate || "")
                          : (C.colsToShowOnProfileSave || P.colsToShowOnProfileSave || "");
  var reqKeys = splitCsv(isUpdate
   ? (C.colsRequiredOnProfileUpdate || P.colsRequiredOnProfileUpdate || "")
   : (C.colsRequiredOnProfileSave || P.colsRequiredOnProfileSave || ""));
  //the show list is the visible set; required-but-not-shown keys (e.g. "a" on update)
  //are submitted as hidden carry inputs so their stored values survive the save
  var submitKeys = splitCsv(seqOrder).concat(reqKeys);
   //image-gallery cap; config-driven with a safe default so a missing key never blocks uploads
   var galleryMax = parseInt(C.imageGalleryMax || P.imageGalleryMax || 12, 10);
   if (!(galleryMax > 0)) galleryMax = 12;
   //server-vs-local image handling: mr.da "getDirectIdFromServer" (1=server fn:118, 0=local)
   var imageServerFlag = (C.getDirectIdFromServer != null) ? C.getDirectIdFromServer
    : (P.getDirectIdFromServer != null ? P.getDirectIdFromServer : 1);
var reqStar = {};
   reqKeys.forEach(function (k) { reqStar[k] = 1; });
   var lockSet = {};
   if (dfltReligiousLock()) lockSet.k = 1;
   if (dfltCasteLock()) lockSet.k1 = 1;
   var moreMap = moreInfoMap(C, P);
   //entries whose children are all selects drive the root's cascade modal, not
   //a "more" pane, so they must not hide those child fields.
   Object.keys(moreMap).forEach(function (tr) {
    if (cascadeChain(tr).length) delete moreMap[tr];
   });
   var moreHide = {};
   Object.keys(moreMap).forEach(function (tr) {
    (moreMap[tr] || []).forEach(function (k) { moreHide[k] = 1; });
   });
   var vis = visibleKeys(map, hideSet, seqOrder).filter(function (k) { return !moreHide[k]; });
   var carryKeys = submitKeys.filter(function (k) { return vis.indexOf(k) < 0 && !moreHide[k]; });

  var base;
  if (isUpdate) {
   base = findProfile(recordId);
   if (!base) {
    if (typeof showToast === "function") {
     showToast("Profile #" + recordId + " not found to edit.", { type: "error", duration: 3000, position: "top" });
    }
    return;
   }
  } else {
   base = setDfltCaste(applyDefaultValues(defaultProfileData()));
  }

  var rules = resolveValidationRules(P, C);
  //g is rendered as a split [date][time] control; collectData emits "yyyy-mm-dd HH:MM",
  //so point the date converter at that format and keep it (no seconds) on the way out.
  if (vis.indexOf("g") >= 0 && rules && rules.g && rules.g.cnv === "convertDateStrToGvn") {
   rules.g.cnvo = rules.g.cnvo || {};
   rules.g.cnvo.currentFormat = "yyyy-mm-dd HH:MM";
   rules.g.cnvo.targetFormat = "yyyy-mm-dd HH:MM";
  }
  if (reqKeys.length) {
   if (!rules) rules = {};
   reqKeys.forEach(function (k) {
    if (rules[k]) {
     delete rules[k].opt;
    } else {
     rules[k] = { cnv: "handleAsString", ms: labelText(map, k) + " is required" };
    }
   });
  }
  var sendLabel = isUpdate ? "Update profile" : "Save profile";
  var pickerOpen = false;
  var sending = false;
  var lastFocus = document.activeElement;

  var ov = document.createElement("div");
  ov.className = "rg-overlay";
  ov.id = MODAL_ID;
  ov.setAttribute("role", "dialog");
  ov.setAttribute("aria-modal", "true");
  ov.setAttribute("aria-label", sendLabel);

  var fieldsHtml = "";
  function morePaneHtml(tr, keys) {
   var filled = false;
   keys.forEach(function (k) { if (!filled && String(baseVal(base, k)).trim() !== "") filled = true; });
   return '<div class="rg-field full rg-morepane" data-more-of="' + esc(tr) + '"' +
    (filled ? ' data-moreopen="1"' : "") + ">" +
    '<div class="rg-fields rg-morepane-grid">' +
    keys.map(function (k) { return fieldHtml(k, map, base, P, reqStar, lockSet); }).join("") +
    "</div></div>";
  }
  vis.forEach(function (k) {
   fieldsHtml += fieldHtml(k, map, base, P, reqStar, lockSet);
   if (moreMap[k] && moreMap[k].length) fieldsHtml += morePaneHtml(k, moreMap[k]);
  });
  var carryHtml = carryKeys.map(function (k) {
   return '<input type="hidden" data-name="' + esc(k) + '" value="' + esc(baseVal(base, k)) + '">';
  }).join("");

  ov.innerHTML =
   '<div class="rg-box">' +
   '<div class="rg-head">' +
   '<span class="rg-ic"><i class="fa-solid ' + (isUpdate ? "fa-user-pen" : "fa-user-plus") + '"></i></span>' +
   '<div class="rg-titles"><h3>' + (adminMode ? "Admin \u00b7 " : "") + (isUpdate ? "Update Profile" : "Register") + "</h3><p>" +
   (isUpdate ? (adminMode ? "Admin edit \u2014 saved via admin endpoints." : "Review the details and save your changes.") : (adminMode ? "Admin add \u2014 saved via admin endpoints." : "Create a complete profile in one step.")) +
   "</p></div>" +
   '<button type="button" class="rg-x" data-close title="Close" aria-label="Close">' +
   '<i class="fa-solid fa-xmark"></i></button>' +
   "</div>" +
   '<div class="rg-body rg-alrdy' + (isUpdate ? ' d-none' : '') + '">' +
   '<button type="button" class="rg-btn rgAlrdyRegMem" id="rgAlrdyRegMem">' +
   '<i class="fa-solid fa-user-check"></i><span>Already Registered</span></button>' +
   '</div>' +
   '<div class="rg-body">' +
   '<form id="rgRegForm" novalidate>' +
   '<div class="rg-fields">' + fieldsHtml + carryHtml + "</div>" +
   '<div class="rg-msg" id="rgRegMsg"></div>' +
   '<div class="rg-actions">' +
   '<button type="submit" class="rg-btn rg-btn-main ' + (isUpdate ? 'rg-btn-update' : 'rg-btn-add') + '" id="rgRegSend">' +
   '<i class="fa-solid fa-check"></i><span>' + sendLabel + "</span></button>" +
   "</div>" +
   "</form>" +
   "</div>" +
   "</div>";

  document.body.appendChild(ov);

  var wjList = C.wajiw || P.wajiw || [];
  var sndMap = {}, sndFmMap = {};
  for (var wi = 0; wi < wjList.length; wi++) {
   var wjIt = wjList[wi] || {};
   if (wjIt.e && wjIt.a !== undefined && wjIt.a !== null) {
    sndMap[String(wjIt.a)] = wjIt.e;
    sndFmMap[String(wjIt.a)] = wjIt.fm;
   }
  }
  var sndRaw = sndMap["1"] || "";
  // defensive fallback: audio element preloaded in background by preloadWajiwSounds()
  if (!sndRaw && P.wajiwSnds && P.wajiwSnds["1"]) {
   try { sndRaw = P.wajiwSnds["1"].getAttribute("src") || ""; } catch (eSP) { }
  }

  var sndBtn = document.createElement("button");
  sndBtn.type = "button";
  sndBtn.className = "rg-snd";
  sndBtn.title = "Play information sound";
  sndBtn.setAttribute("aria-label", "Play information sound");
  sndBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  sndBtn.addEventListener("click", function () { regisSoundToggle(sndRaw); });
  if (adminMode) { sndBtn.style.display = "none"; }
  var onAudioState = function (ev) {
   var playing = !!(ev && ev.detail && ev.detail.playing);
   sndBtn.classList.toggle("rg-snd-play", playing);
  };
  document.addEventListener("mraudiostate", onAudioState);
  ov.appendChild(sndBtn);

  var form = ov.querySelector("#rgRegForm");

  //play the per-field wajiw sound (keyed by field code) on focus/interaction
  function fieldKeyOf(ev) {
   var t = ev.target;
   var f = t && t.closest ? t.closest('.rg-field[data-key]') : null;
   return f ? f.getAttribute('data-key') : "";
  }
  function onFieldSound(ev) {
   var k = fieldKeyOf(ev);
   if (!k || !sndMap[k]) return;
   if (!audioAllowedForMode(sndFmMap[k], isUpdate)) return;
   var f = ev.target && ev.target.closest ? ev.target.closest('.rg-field[data-key]') : null;
   //'Add photo' field (.rg-dp): play sound only on the thumbnail / action buttons, never blank space
   if (f && f.querySelector('.rg-dp')) {
    var t = ev.target;
    if (!(t.closest && (t.closest('.rg-dp-thumb') || t.closest('.rg-dp-actions')))) return;
   }
   if (!isAudioAutoOff(sndMap[k])) regisPlaySound(sndMap[k]);
  }
  var suppressInitFocusSound = false;
  var onFieldFocus = function (ev) {
   if (suppressInitFocusSound) return;
   if (ev.target && ev.target.classList && ev.target.classList.contains('rg-in')) onFieldSound(ev);
  };
  form.addEventListener("focusin", onFieldFocus);
  form.addEventListener("click", onFieldSound);

  var sendBtn = ov.querySelector("#rgRegSend");
  var allreadyBtn = ov.querySelector("#rgAlrdyRegMem");

  //"Already Registered Member" -> fn 70 (chkMyCount): fetch my own profile by my mobile
  //number, then store it in the Dexie "mr" table and in localStorage "<tn>_myEinMR".
  if (allreadyBtn) {
   allreadyBtn.addEventListener("click", async function () {
    if (sending) return;
    if (typeof fnj3 !== "function") { showMsg("err", "Network helper unavailable."); return; }
    hideMsg();
    setSending(true);
    var p0 = null;
    try {
     if (typeof clearPayload0 === "function") clearPayload0();
     if (!window.payload0) window.payload0 = {};
     p0 = window.payload0;
     p0.vw = 4;
     p0.fn = 70; //fn 70 = chkMyCount (my own profile)
     var resp = await fnj3("https://my1.in/2/c.php", p0, 1, true, null, 20000, 0, 2, 1, 1);
     hndlRspo70(resp);
    } catch (err) {
     showMsg("err", "Failed to load profile: " + ((err && err.message) || err));
    } finally {
     try { if (p0) { delete p0.x1; delete p0.x2; delete p0.la; delete p0.drml; } } catch (eX) { }
     setSending(false);
    }
   });
  }

  //hndlRspo70 (fn 70 handler) lives in git/mr.js (core, loaded first) and is shared with
  //git/plans.js; the call above resolves to window.hndlRspo70 from there.

  var msgEl = ov.querySelector("#rgRegMsg");
  var uInput = form.querySelector('[data-name="u"]');
  var thumbEl = ov.querySelector("[data-dp-thumb]");
  var rmBtn = ov.querySelector('[data-act="dp-rm"]');

  function selInput(k) { return document.getElementById("rgf-" + k); }
  function selBox(k) { return document.getElementById("rgsel-" + k); }

  //"more"/"less" fold: after the configured key, everything below can be collapsed
  var moreAfter = C.applyMoreButtonAfterKey || P.applyMoreButtonAfterKey || "";
  var moreFold = null;
  var moreBtn = null;
  var moreAnchor = null;
  var moreOpen = true;
  function setFold(on) {
   moreOpen = on;
   if (!moreFold || !moreBtn || !moreAnchor) return;
   moreFold.style.display = on ? "" : "none";
   moreBtn.innerHTML = on
    ? '<i class="fa-solid fa-chevron-up"></i> <span>less</span>'
    : '<i class="fa-solid fa-chevron-down"></i> <span>more</span>';
   var actions = form.querySelector(".rg-actions");
   if (on && actions) form.insertBefore(moreBtn, actions);
   else if (!on) moreAnchor.after(moreBtn);
  }
  (function initMoreFold() {
   if (!moreAfter || vis.indexOf(moreAfter) < 0) return;
   moreAnchor = form.querySelector('.rg-field[data-key="' + moreAfter + '"]');
   if (!moreAnchor) return;
   if (moreAnchor.nextElementSibling) {
    moreFold = document.createElement("div");
    moreFold.className = "rg-morefold";
    var n = moreAnchor.nextElementSibling;
    while (n) {
     var nx = n.nextElementSibling;
     moreFold.appendChild(n);
     n = nx;
    }
    moreAnchor.after(moreFold);
   }
   moreBtn = document.createElement("button");
   moreBtn.type = "button";
   moreBtn.className = "rg-btn rg-btn-main rg-morebtn mt-2";
   moreAnchor.after(moreBtn);
   moreBtn.addEventListener("click", function () { setFold(!moreOpen); });
   var shouldOpen = false;
   if (isUpdate && moreFold) {
    var fx = moreFold.querySelectorAll('.rg-field[data-key]');
    for (var i = 0; i < fx.length; i++) {
     var fk = fx[i].getAttribute('data-key');
     if (fk && String(baseVal(base, fk)).trim() !== "") { shouldOpen = true; break; }
    }
   }
   setFold(shouldOpen);
  })();

  function lockSelBox(box) {
   if (!box || box.getAttribute("data-locked") !== "1") return;
   box.classList.add("rg-locked");
   var btn = box.querySelector("button");
   if (btn) btn.remove();
  }

  function selDisplayName(k) {
   var input = selInput(k);
   var v = input ? input.value : "";
   var cfg = selCfg(k);
   var arr = cfg && window[cfg.arr];
   if (Array.isArray(arr)) {
    for (var i = 0; i < arr.length; i++) {
     if (arr[i] && String(arr[i].a) === String(v)) return arr[i].e || v;
    }
   }
   return v || "\u2014";
  }

  //cascade roots (moreinfo-declared) get their own box: it shows the chosen
  //chain as a tree (like native city) and opens the single cascade modal
  //instead of the flat slkt picker.
  function paintCascBox(k) {
   var box = selBox(k);
   if (!box) return false;
   box.setAttribute("data-painted", "casc");
   box.classList.add("rg-cascbox");
   var locked = box.getAttribute("data-locked") === "1";
   //walk the cascade levels and render each chosen value as a tree node
   //(religion -> caste -> sub caste), mirroring the native-city field
   var levels = cascadeLevels(k);
   var ids = levels.map(function (lv) {
    var inp = selInput(lv.key);
    return inp && inp.value != null ? String(inp.value) : "";
   });
   var nodes = [];
   for (var i = 0; i < levels.length; i++) {
    if (!ids[i]) break;
    var it = cascItem(levels, ids, i);
    var nm = it ? it.e : selDisplayName(levels[i].key);
    if (!nm) break;
    nodes.push('<div class="rg-casc-node lv' + i + '">' + esc(nm) + "</div>");
   }
   var valHtml = nodes.length
    ? '<div class="rg-casc-tree">' + nodes.join("") + "</div>"
    : '<div class="rg-cascbox-val empty">Not specified</div>';
   box.innerHTML =
    valHtml +
    '<button type="button" class="rg-selopen">' + (locked || !nodes.length ? "Select..." : "Change") + "</button>";
   //even a locked root (fixed dfltReligious) opens the cascade so the child
   //levels (caste / sub caste) can still be chosen; finish() never rewrites it.
   box.onclick = function () { openMrCascadeModal(k); };
   return true;
  }

  function paintSelField(k) {
   var cfg = selCfg(k);
   var input = selInput(k);
   var box = selBox(k);
   if (!input || !box) return false;
   if (cascadeChain(k).length) return paintCascBox(k);
   if (box.getAttribute("data-painted") === "slkt") { lockSelBox(box); return true; }
   if (isTreeField(k)) {
    if (typeof setValByPrprtyDepthToElm !== "function") return false;
    try {
     setValByPrprtyDepthToElm(input.id, input.value, box.id, k, selDepthFullObject(k));
     box.setAttribute("data-painted", "slkt");
     lockSelBox(box);
     return true;
    } catch (eD) { return false; }
   }
   if (typeof setValByProprtyToElm !== "function") return false;
   try {
    setValByProprtyToElm(input.id, input.value, box.id, k, selFullObject(k, base));
    box.setAttribute("data-painted", "slkt");
    lockSelBox(box);
    return true;
   } catch (eS) { return false; }
  }

  function paintSelFallback(k) {
   var box = selBox(k);
   if (!box || box.getAttribute("data-painted")) return;
   if (box.getAttribute("data-locked") === "1") {
    box.setAttribute("data-painted", "locked");
    box.textContent = selDisplayName(k);
    return;
   }
   box.setAttribute("data-painted", "fb");
   box.innerHTML = '<button type="button" class="rg-selopen">Select...</button>';
   box.querySelector("button").addEventListener("click", function () { openSelModal(k); });
  }

  function repaintSel(k) {
   var box = selBox(k);
   //a locked field holds a fixed default (dfltReligious/dfltCaste); never wipe it
   if (box && box.getAttribute("data-locked") === "1") return;
   var input = selInput(k);
   if (input) input.value = "";
   if (box) {
    box.removeAttribute("data-painted");
    box.removeAttribute("data-initialized");
    box.removeAttribute("data-can-add");
    box.removeAttribute("data-selection-array");
    box.removeAttribute("data-original-depth-path");
    box.removeAttribute("data-depth-for-native");
    box.removeAttribute("data-selection-callback");
    box.innerHTML = "";
   }
   if (!paintSelField(k)) paintSelFallback(k);
  }

  //slkt.js calls window[fullObject.h](sel, inputId, divId, key) after a parent selection
  window.mrRegisParentSelected = function (sel, inputId, divId, key) {
   if (!key) return;
   //remember cleared parents so descendants fall back to the default (97) branch
   var inp = null;
   try { inp = document.getElementById("rgf-" + key); } catch (eI) { }
   if (inp && inp.value) delete rgClearedParents[key];
   else rgClearedParents[key] = 1;
   //clear the whole descendant chain (e.g. Religion -> Caste -> Sub caste)
   (function clearDescendants(parentKey) {
    childKeysOf(parentKey).forEach(function (child) {
     repaintSel(child);
     clearDescendants(child);
    });
   })(key);
  };

  //----- cascade select modal (moreinfo-driven) -----
  //items at a level: root/flat levels read their own global array, a nested
  //level reads "prop" off the previously selected item.
  function cascList(levels, ids, i) {
   var lv = levels[i];
   if (!lv) return [];
   if (!lv.nested) return Array.isArray(window[lv.arr]) ? window[lv.arr] : [];
   var parent = cascItem(levels, ids, i - 1);
   return (parent && Array.isArray(parent[lv.prop])) ? parent[lv.prop] : [];
  }

  function cascItem(levels, ids, i) {
   if (i < 0) return null;
   var list = cascList(levels, ids, i);
   var want = ids[i];
   for (var j = 0; j < list.length; j++) {
    if (list[j] && String(list[j].a) === String(want)) return list[j];
   }
   return null;
  }

  function cascStyles(cls) {
   var p = "." + cls;
   return [
    p + " .modal-content{border:1px solid rgba(201,164,92,.5) !important;border-radius:16px !important;overflow:hidden;}",
    p + " .modal-dialog{max-width:520px;margin:1.75rem auto;}",
    p + " .rg-casc-head{display:flex;align-items:center;gap:10px;padding:12px 14px;color:#fff;",
    "background-image:linear-gradient(135deg,#8B1E3F,#6E1733);}",
    p + " .rg-casc-title{flex:1 1 auto;margin:0;font-size:16px;font-weight:600;color:#fff;text-align:center;}",
    p + " .rg-casc-back{flex:0 0 auto;width:34px;height:34px;border-radius:50%;",
    "border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.14);color:#fff;cursor:pointer;",
    "display:flex;align-items:center;justify-content:center;font-size:14px;}",
    p + " .rg-casc-x{flex:0 0 auto;width:34px;height:34px;border-radius:50%;",
    "border:1px solid #6c757d;background:#6c757d;color:#fff;cursor:pointer;",
    "display:flex;align-items:center;justify-content:center;font-size:14px;}",
    p + " .rg-casc-back:disabled{opacity:.35;cursor:not-allowed;}",
    p + " .rg-casc-x:hover{background:#5c636a;}",
    p + " .rg-casc-body{padding:14px;}",
    p + " .rg-casc-info{background:#faf4e6;border-radius:8px;padding:8px 10px;margin-bottom:10px;",
    "font-size:12.5px;font-weight:600;color:#8B1E3F;text-align:center;}",
    p + " .rg-casc-search{width:100%;height:40px;padding:0 14px;border:1px solid #e0d6bf;border-radius:999px;",
    "font-size:14px;outline:none;margin-bottom:10px;box-sizing:border-box;}",
    p + " .rg-casc-search:focus{border-color:#8B1E3F;box-shadow:0 0 0 3px rgba(139,30,63,.12);}",
    p + " .rg-casc-crumbs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;}",
    p + " .rg-casc-crumb{border:1px solid rgba(201,164,92,.6);background:#fff;color:#6f6656;",
    "border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:600;cursor:pointer;max-width:100%;",
    "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
    p + " .rg-casc-crumb-on{background-image:linear-gradient(135deg,#c9a45c,#e6cf9b);color:#6E1733;border-color:#c9a45c;}",
    p + " .rg-casc-crumb-done{background:#faf4e6;color:#8B1E3F;border-color:#c9a45c;}",
    p + " .rg-casc-crumb-fixed{cursor:default;}",
    p + " .rg-casc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;",
    "max-height:52vh;overflow-y:auto;}",
    p + " .rg-casc-item{padding:11px 12px;border:1px solid rgba(201,164,92,.5);border-radius:10px;",
    "background:#fff;font-size:14px;color:#241d12;text-align:left;cursor:pointer;transition:border-color .18s ease,background .18s ease;}",
    p + " .rg-casc-item:hover{border-color:#8B1E3F;background:#faf4e6;}",
    p + " .rg-casc-item.on{background-image:linear-gradient(135deg,#c9a45c,#e6cf9b);color:#6E1733;border-color:#c9a45c;font-weight:600;}",
    p + " .rg-casc-none{grid-column:1 / -1;padding:22px;text-align:center;color:#9c937f;font-size:13.5px;}",
    p + " .rg-casc-foot{display:flex;justify-content:center;padding-top:12px;}",
    p + " .rg-casc-clear{height:38px;padding:0 20px;border-radius:999px;border:1px solid rgba(201,164,92,.55);",
    "background:transparent;color:#6f6656;font-size:13.5px;font-weight:600;cursor:pointer;}",
    p + " .rg-casc-clear:hover{background:#faf4e6;color:#241d12;}"
   ].join("");
  }

  function openMrCascadeModal(rootKey) {
   var levels = cascadeLevels(rootKey);
   if (!levels.length) return;
   if (typeof create_modal_dynamically !== "function") {
    showMsg("err", "Selection list is unavailable.");
    return;
   }
   var ids = levels.map(function (lv) {
    var inp = selInput(lv.key);
    return inp && inp.value != null && inp.value !== "" ? String(inp.value) : "";
   });
   var rootBox = selBox(rootKey);
   var rootLocked = !!(rootBox && rootBox.getAttribute("data-locked") === "1");
   //a locked root (fixed dfltReligious) keeps its value: start at the first
   //editable level so the cascade only picks caste / sub caste.
   var startMin = rootLocked && levels.length > 1 ? 1 : 0;
   //religion already chosen (auto/locked default or stored) -> land on caste (1);
   //otherwise land on religion (0). Never auto-descend to sub-caste.
   var rootHasVal = !!(selInput(rootKey) && String(selInput(rootKey).value) !== "");
   var cur = rootHasVal ? 1 : 0;
   if (cur < startMin) cur = startMin;
   if (cur > levels.length - 1) cur = levels.length - 1;

   var modalId = "rgCasc_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
   var obj = create_modal_dynamically(modalId);
   var inst = obj.modalInstance;
   var el = obj.modalElement;
   var cls = "rg-casc-" + Date.now();
   el.classList.add(cls, "rg-casc-modal");
   var st = document.createElement("style");
   st.textContent = cascStyles(cls);
   document.head.appendChild(st);

   var content = el.querySelector(".modal-content");
   content.innerHTML =
    '<div class="rg-casc-head">' +
    '<button type="button" class="rg-casc-back" disabled><i class="fa-solid fa-arrow-left"></i></button>' +
    '<h5 class="rg-casc-title">' + esc(labelText(map, rootKey)) + "</h5>" +
    '<button type="button" class="rg-casc-x"><i class="fa-solid fa-xmark"></i></button>' +
    "</div>" +
    '<div class="rg-casc-body">' +
    '<div class="rg-casc-info"></div>' +
    '<input type="text" class="rg-casc-search" placeholder="Search..." autocomplete="off">' +
    '<div class="rg-casc-crumbs"></div>' +
    '<div class="rg-casc-grid"></div>' +
    '<div class="rg-casc-foot"><button type="button" class="rg-casc-clear"><i class="fa-solid fa-eraser"></i> Clear</button></div>' +
    "</div>";

   var infoEl = content.querySelector(".rg-casc-info");
   var searchEl = content.querySelector(".rg-casc-search");
   var crumbsEl = content.querySelector(".rg-casc-crumbs");
   var gridEl = content.querySelector(".rg-casc-grid");
   var backBtn = content.querySelector(".rg-casc-back");

   function crumbLabel(i) {
    if (ids[i]) {
     var it = cascItem(levels, ids, i);
     if (it) return it.e;
    }
    return labelText(map, levels[i].key) || levels[i].key;
   }

   function render() {
    infoEl.textContent = "Select " + (labelText(map, levels[cur].key) || levels[cur].key);
    crumbsEl.innerHTML = levels.map(function (lv, i) {
     var state = i === cur ? " rg-casc-crumb-on" : (i < cur && ids[i] ? " rg-casc-crumb-done" : "");
     var fixed = i < startMin ? " rg-casc-crumb-fixed" : "";
     return '<button type="button" class="rg-casc-crumb' + state + fixed + '" data-lv="' + i + '">' +
      esc(crumbLabel(i)) + "</button>";
    }).join("");
    var q = (searchEl.value || "").trim().toLowerCase();
    var list = cascList(levels, ids, cur).filter(function (it) { return it && it.a !== 0; });
    if (q) list = list.filter(function (it) { return String(it.e || "").toLowerCase().indexOf(q) >= 0; });
    gridEl.innerHTML = list.length
     ? list.map(function (it) {
      var on = String(ids[cur]) === String(it.a);
      return '<button type="button" class="rg-casc-item' + (on ? " on" : "") + '" data-id="' + esc(it.a) + '">' + esc(it.e) + "</button>";
     }).join("")
     : '<div class="rg-casc-none">No items available</div>';
    backBtn.disabled = cur <= startMin;
   }

   function finish() {
    levels.forEach(function (lv, i) {
     var box = selBox(lv.key);
     if (box && box.getAttribute("data-locked") === "1") return;
     var inp = selInput(lv.key);
     if (inp) inp.value = ids[i] || "";
    });
    levels.forEach(function (lv) {
     repaintSel(lv.key);
     var f = form.querySelector('.rg-field[data-key="' + lv.key + '"]');
     if (f) {
      f.classList.remove("bad");
      var er = f.querySelector(".rg-err");
      if (er) er.textContent = "";
     }
    });
    inst.hide();
   }

   gridEl.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest ? e.target.closest(".rg-casc-item") : null;
    if (!btn) return;
    ids[cur] = btn.getAttribute("data-id");
    for (var d = cur + 1; d < levels.length; d++) ids[d] = "";
    if (cur < levels.length - 1) { cur++; searchEl.value = ""; render(); }
    else finish();
   });

   crumbsEl.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest ? e.target.closest(".rg-casc-crumb") : null;
    if (!btn) return;
    var lv = parseInt(btn.getAttribute("data-lv"), 10);
    if (!isNaN(lv) && lv >= startMin) { cur = lv; searchEl.value = ""; render(); }
   });

   searchEl.addEventListener("input", render);
   backBtn.addEventListener("click", function () {
    if (cur > startMin) { cur--; searchEl.value = ""; render(); }
   });
   content.querySelector(".rg-casc-x").addEventListener("click", function () { inst.hide(); });
   content.querySelector(".rg-casc-clear").addEventListener("click", function () {
    levels.forEach(function (lv) {
     var box = selBox(lv.key);
     if (box && box.getAttribute("data-locked") === "1") return;
     var inp = selInput(lv.key);
     if (inp) inp.value = "";
    });
    var rinp = selInput(rootKey);
    if (rinp && !rinp.value) rgClearedParents[rootKey] = 1;
    levels.forEach(function (lv) { repaintSel(lv.key); });
    inst.hide();
   });

   el.addEventListener("hidden.bs.modal", function onHide() {
    el.removeEventListener("hidden.bs.modal", onHide);
    if (st && st.parentNode) st.parentNode.removeChild(st);
    setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 300);
   });

   render();
   inst.show();
  }

  function openSelModal(k) {
   var input = selInput(k);
   var box = selBox(k);
   if (box && box.getAttribute("data-locked") === "1") return;
   if (!input || !box) {
    showMsg("err", "Selection list is unavailable.");
    return;
   }
   if (cascadeChain(k).length) { openMrCascadeModal(k); return; }
   if (isTreeField(k)) {
    var moD = selDepthModalObject(k);
    function fireDepth() {
     openDepthSelectionModal(input.id, input.value, box.id, k, moD);
     fixSelZ();
     setTimeout(fixSelZ, 60);
    }
    if (typeof openDepthSelectionModal === "function") {
     try { fireDepth(); } catch (eD) { showMsg("err", "Could not open selection list."); }
     paintSelField(k);
     return;
    }
    if (typeof loadExe2Fn !== "function") {
     showMsg("err", "Selection list is unavailable.");
     return;
    }
    Promise.resolve(loadExe2Fn(47, [null, null, null, null, null], [1]))
     .then(function () {
      paintSelField(k);
      if (typeof openDepthSelectionModal === "function" &&
       !document.querySelector('.modal[id^="depth_select_modal_"]')) {
       fireDepth();
      }
     })
     .catch(function (err) {
      showMsg("err", "Could not open selection list: " + ((err && err.message) || err));
     });
    return;
   }
   var mo = selModalObject(k, base);
   function fire() {
    openCommonSelectionModal(input.id, input.value, box.id, k, mo);
    fixSelZ();
    setTimeout(fixSelZ, 60);
   }
   if (typeof openCommonSelectionModal === "function") {
    try { fire(); } catch (eS) { showMsg("err", "Could not open selection list."); }
    paintSelField(k);
    return;
   }
   if (typeof loadExe2Fn !== "function") {
    showMsg("err", "Selection list is unavailable.");
    return;
   }
   Promise.resolve(loadExe2Fn(39, [input.id, input.value, box.id, k, mo], [1]))
    .then(function () {
     paintSelField(k);
     if (typeof openCommonSelectionModal === "function" &&
      !document.querySelector('.modal[data-array-name]')) {
      fire();
     }
    })
    .catch(function (err) {
     showMsg("err", "Could not open selection list: " + ((err && err.message) || err));
    });
  }

  function ensureSelLib() {
   var needDepth = allSelKeys().some(function (k) {
    return isTreeField(k) && vis.indexOf(k) >= 0;
   });
   var jobs = [];
   if (typeof setValByProprtyToElm !== "function" && typeof loadExe2Fn === "function") {
    jobs.push(Promise.resolve(loadExe2Fn(39, [null, null, null, null, null], [1])).catch(function () { }));
   }
   if (needDepth && typeof setValByPrprtyDepthToElm !== "function" && typeof loadExe2Fn === "function") {
    jobs.push(Promise.resolve(loadExe2Fn(47, [null, null, null, null, null], [1])).catch(function () { }));
   }
   if (!jobs.length) {
    var ready = (typeof setValByProprtyToElm === "function");
    if (needDepth) ready = ready && (typeof setValByPrprtyDepthToElm === "function");
    return Promise.resolve(ready);
   }
   return Promise.all(jobs).then(function () {
    var ok = (typeof setValByProprtyToElm === "function");
    if (needDepth) ok = ok && (typeof setValByPrprtyDepthToElm === "function");
    return ok;
   });
  }

  ensureSelLists();
  var selKeys = allSelKeys().filter(function (k) { return vis.indexOf(k) >= 0; });
  selKeys.forEach(function (k) {
   if (!paintSelField(k)) paintSelFallback(k);
  });
  ensureSelLib().then(function (ok) {
   if (ok) selKeys.forEach(paintSelField);
  });

  var dateApi = null;
  var timeApi = null;
  (function initDateField() {
   var gEl = form.querySelector('[data-name="g"]');
   var tEl = form.querySelector("#rgtime-g");
   if (!gEl || typeof window.initDateTimePicker !== "function") return;
   var gField = gEl.closest(".rg-field");
   function onPick() {
    if (gField) gField.classList.remove("bad");
    hideMsg();
   }
   Promise.resolve(window.initDateTimePicker(gEl.id, {
    mode: "date",
    autoNow: false,
    readonly: true,
    initialValue: toInputDate(baseVal(base, "g")),
    displayFormatter: fmtDdMmYyyy,
    onChange: onPick
   })).then(function (api) {
    dateApi = api;
   }).catch(function (e) { console.error("date picker init failed:", e); });
   if (!tEl) return;
   Promise.resolve(window.initDateTimePicker(tEl.id, {
    mode: "time",
    autoNow: false,
    readonly: true,
    initialValue: toInputTime(baseVal(base, "g")),
    displayFormatter: function (v) { return v || ""; },
    onChange: onPick
   })).then(function (api) {
    timeApi = api;
   }).catch(function (e) { console.error("time picker init failed:", e); });
  })();

  Object.keys(moreMap).forEach(function (tr) {
   var f = form.querySelector('.rg-field[data-key="' + tr + '"]');
   var pane = form.querySelector('.rg-morepane[data-more-of="' + tr + '"]');
   if (!f || !pane) return;
   var wrap = f.querySelector(".rg-inwrap");
   if (!wrap) return;
   var btn = document.createElement("button");
   btn.type = "button";
   btn.className = "rg-more";
   btn.setAttribute("aria-expanded", "false");
   var open = pane.getAttribute("data-moreopen") === "1";
    function paintMore() {
     pane.classList.toggle("open", open);
     btn.setAttribute("aria-expanded", open ? "true" : "false");
     btn.classList.toggle("rg-more-on", !open);
     btn.textContent = open ? "less" : "more";
    }
   btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    open = !open;
    paintMore();
   });
   paintMore();
   wrap.appendChild(btn);
  });

  function close() {
   activeClose = null;
   rgAdmOpen = 0;
   if (dateApi && dateApi.instance && typeof dateApi.instance.dispose === "function") {
    try { dateApi.instance.dispose(); } catch (eD) { }
   }
   if (timeApi && timeApi.instance && typeof timeApi.instance.dispose === "function") {
    try { timeApi.instance.dispose(); } catch (eD2) { }
   }
   selOverlayOpen = false;
   ov.classList.remove("open");
   document.removeEventListener("mraudiostate", onAudioState);
   form.removeEventListener('focusin', onFieldFocus);
   form.removeEventListener('click', onFieldSound);
   if (regisLastAudio && typeof regisLastAudio.pause === "function") {
    try { regisLastAudio.pause(); } catch (eS) { }
   }
   regisLastAudio = null;
   delete window.mrRegisParentSelected;
   rgClearedParents = {};
   setTimeout(function () {
    var node = document.getElementById(MODAL_ID);
    if (node && node.parentNode) node.parentNode.removeChild(node);
   }, 260);
   document.removeEventListener("keydown", onKey);
   if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { } }
  }
  activeClose = close;

  function onKey(e) {
   if (e.key === "Escape" && !pickerOpen && !selOverlayOpen && document.getElementById(MODAL_ID) === ov) close();
  }

  function showMsg(kind, text) {
   msgEl.className = "rg-msg show " + kind;
   msgEl.textContent = text;
  }

  function hideMsg() {
   msgEl.className = "rg-msg";
   msgEl.textContent = "";
  }

  function setSending(on) {
   sending = on;
   sendBtn.disabled = on;
   sendBtn.innerHTML = on
    ? '<i class="fa-solid fa-spinner fa-spin"></i><span>Saving...</span>'
    : '<i class="fa-solid fa-check"></i><span>' + sendLabel + "</span>";
  }

  function clearBad() {
   ov.querySelectorAll(".rg-field.bad").forEach(function (f) { f.classList.remove("bad"); });
  }

  function markBad(fld, ms) {
   if (!fld) return;
   var f = ov.querySelector('.rg-field[data-key="' + fld + '"]');
   if (!f) return;
   var ar = f.closest ? f.closest(".rg-morepane") : null;
   if (ar && !ar.classList.contains("open")) {
    ar.classList.add("open");
    var tr = ar.getAttribute("data-more-of") || "";
    var b = form.querySelector('.rg-field[data-key="' + tr + '"] .rg-more');
    if (b) { b.textContent = "less"; b.setAttribute("aria-expanded", "true"); }
   }
   var fd = f.closest ? f.closest(".rg-morefold") : null;
   if (fd && !moreOpen) setFold(true);
   f.classList.add("bad");
   var err = f.querySelector(".rg-err");
   if (err) err.textContent = ms || "";
   var ctl = f.querySelector(".rg-in") || f.querySelector(".rg-selbox button");
   if (ctl) {
    try { ctl.focus(); ctl.scrollIntoView({ block: "center" }); } catch (e) { }
   }
  }

  function renderDp() {
   if (!uInput || !thumbEl || !rmBtn) return;
   var imgs = resolveU(uInput.value);
   var src = imgs.display || imgs.thumbnail;
   if (src) {
    thumbEl.innerHTML = '<img alt="Profile photo" src="' + esc(src) + '">';
    rmBtn.hidden = false;
   } else {
    thumbEl.innerHTML = '<i class="fa-solid fa-user"></i>';
    rmBtn.hidden = true;
   }
  }

  function onImgPicked(img) {
   setTimeout(function () { pickerOpen = false; }, 800);
   if (!img || !uInput) return;
   var disp = img.g1 || img.url || "";
   var thb = img.g2 || disp;
   if (!disp && !thb) return;
   try {
    uInput.value = JSON.stringify({ a: disp, b: thb });
   } catch (e) {
    uInput.value = disp || thb;
   }
   renderDp();
   hideMsg();
   if (typeof showToast === "function") {
    showToast("Photo selected!", { type: "success", duration: 2000, position: "top" });
   }
  }

  function fixPickerZ() {
   var am = document.getElementById("addImageModal");
   if (am) {
    am.style.zIndex = "100001";
    am.addEventListener("hidden.bs.modal", function () { pickerOpen = false; });
   }
   var bds = document.querySelectorAll(".modal-backdrop");
   if (bds.length) bds[bds.length - 1].style.zIndex = "100000";
  }

  function openDpPicker() {
   if (pickerOpen) return;
   if (typeof loadExe2Fn !== "function") {
    showMsg("err", "Image picker is unavailable.");
    return;
   }
   pickerOpen = true;
   Promise.resolve(loadExe2Fn(9, [onImgPicked, window.imgObjDimensRqd || [], defnTabsToUs, '',
    imageServerFlag], [1]))
    .then(function () {
     fixPickerZ();
     setTimeout(fixPickerZ, 60);
    })
    .catch(function (err) {
     pickerOpen = false;
     showMsg("err", "Could not open image picker: " + ((err && err.message) || err));
    });
  }

  // ---- image gallery (b6) ---------------------------------------------------------
  //The gallery keeps its tokens in the b6 hidden input as a JSON array and re-renders
  //its thumbnail grid from that value, so add/remove stays in sync with what is submitted.
  function galInput() { return form.querySelector('[data-name="b6"]'); }

  function galArray() {
   var input = galInput();
   if (!input) return [];
   return (typeof window.mrParseGalleryImages === "function")
    ? window.mrParseGalleryImages(input.value)
    : [];
  }

  function setGalArray(arr) {
   var input = galInput();
   if (input) {
    input.value = (typeof window.mrSerializeGalleryImages === "function")
     ? window.mrSerializeGalleryImages(arr)
     : JSON.stringify(arr);
   }
   renderGal();
  }

  function renderGal() {
   var grid = form.querySelector("[data-gal-grid]");
   if (!grid) return;
   var arr = galArray();
   var html = "";
   for (var i = 0; i < galleryMax; i++) {
    if (i < arr.length) {
     var r = (typeof window.mrResolveProfileImages === "function")
      ? window.mrResolveProfileImages(arr[i]) : { display: null, thumbnail: null };
     var src = r.display || r.thumbnail || "";
     html += '<div class="rg-gal-item">' +
      (src ? '<img src="' + esc(src) + '" alt="Gallery photo">' : '<i class="fa-solid fa-image"></i>') +
      '<button type="button" class="rg-gal-x" data-act="gal-rm" data-idx="' + i + '" aria-label="Remove photo"><i class="fa-solid fa-xmark"></i></button>' +
      "</div>";
    } else {
     html += '<button type="button" class="rg-gal-add" data-act="gal-pick" ' +
      'aria-label="Add gallery photo"><i class="fa-solid fa-plus"></i></button>';
    }
   }
   grid.innerHTML = html;
  }

  //A bare Google Drive id (20+ of [A-Za-z0-9_-]); space-separated pairs only resolve
  //when every part is such an id, so never join URLs/data-URLs into one token.
  function isBareId(v) {
   return /^[A-Za-z0-9_-]{20,}$/.test(String(v == null ? "" : v).trim());
  }

  function isRenderableToken(tok) {
   if (!tok) return false;
   var s = String(tok).trim();
   if (!s) return false;
   if (s.indexOf("://") !== -1 || s.indexOf("data:") === 0 || s.indexOf("blob:") === 0) return true;
   return /^[A-Za-z0-9_-]{20,}(\s+[A-Za-z0-9_-]{20,})?$/.test(s);
  }

  function onGalPicked(img) {
   setTimeout(function () { pickerOpen = false; }, 800);
   if (!img) return;
   var disp = img.g1 || img.url || "";
   var thb = img.g2 || "";
   //keep the thumbnail+display pair only when both are bare Drive ids; otherwise
   //store a single token (a joined "url url"/"data:.. data:.." string is not a valid src)
   var tok = (isBareId(disp) && isBareId(thb)) ? [disp, thb].join(" ") : (disp || thb);
   if (!isRenderableToken(tok)) {
    showMsg("err", "Server returned an image that can't be displayed. Please try again.");
    return;
   }
   var arr = galArray();
   if (arr.indexOf(tok) < 0) arr.push(tok);
   setGalArray(arr);
   hideMsg();
   if (typeof showToast === "function") {
    showToast("Photo added!", { type: "success", duration: 2000, position: "top" });
   }
  }

  function openGalPicker() {
   if (pickerOpen) return;
   if (galArray().length >= galleryMax) {
    showMsg("err", "You can add up to " + galleryMax + " gallery photos.");
    return;
   }
   if (typeof loadExe2Fn !== "function") {
    showMsg("err", "Image picker is unavailable.");
    return;
   }
   pickerOpen = true;
   Promise.resolve(loadExe2Fn(9, [onGalPicked, window.imgObjDimensRqd || [], defnTabsToUs, '',
    imageServerFlag], [1]))
    .then(function () {
     fixPickerZ();
     setTimeout(fixPickerZ, 60);
    })
    .catch(function (err) {
     pickerOpen = false;
     showMsg("err", "Could not open image picker: " + ((err && err.message) || err));
    });
  }

  function uForSend(raw) {
   var disp = "", thb = "";
   if (String(raw || "").charAt(0) === "{") {
    try { var o = JSON.parse(raw); if (o) { disp = o.a || ""; thb = o.b || ""; } } catch (e) { }
   }
   if (!disp && !thb) return String(raw || "").trim();
   return [disp, thb].filter(Boolean).join(" ");
  }

  function galForSend(raw) {
   var list = (typeof window.mrParseGalleryImages === "function")
    ? window.mrParseGalleryImages(raw) : [];
   return list.join(", ");
  }

  function collectData() {
   var keys = isUpdate ? ["a"].concat(submitKeys) : submitKeys.slice();
   var out = {};
   keys.forEach(function (k) {
    var el = form.querySelector('[data-name="' + k + '"]');
    if (!el) {
     out[k] = baseVal(base, k);
     return;
    }
    if (k === "g") {
     var dVal = (el.value || "").trim();
     var tElG = form.querySelector("#rgtime-g");
     var tVal = tElG ? (tElG.value || "").trim() : "";
     out.g = dVal ? (dVal + " " + (tVal || "00:00")) : "";
    } else if (k === "l") {
     out.l = toDisplayPhone(el.value);
    } else if (k === "u") {
     out.u = uForSend(el.value);
    } else if (k === "b6") {
     out.b6 = galForSend(el.value);
    } else {
     out[k] = el.value;
    }
   });
   return out;
  }

  renderDp();
  renderGal();

  ov.addEventListener("click", function (e) {
   if (e.target === ov) {
    if (!pickerOpen && !selOverlayOpen) close();
    return;
   }
   var closer = e.target.closest ? e.target.closest("[data-close]") : null;
   if (closer && ov.contains(closer)) {
    if (!pickerOpen && !selOverlayOpen) close();
    return;
   }
   var act = e.target.closest ? e.target.closest("[data-act]") : null;
   if (act && ov.contains(act)) {
    var a = act.getAttribute("data-act");
     if (a === "dp-pick") {
      openDpPicker();
     } else if (a === "dp-rm") {
      uInput.value = "";
      renderDp();
      hideMsg();
     } else if (a === "gal-pick") {
      openGalPicker();
     } else if (a === "gal-rm") {
      var gi = parseInt(act.getAttribute("data-idx"), 10);
      var ga = galArray();
      if (gi >= 0 && gi < ga.length) {
       ga.splice(gi, 1);
       setGalArray(ga);
      }
      hideMsg();
     }
    return;
   }
   var sb = e.target.closest ? e.target.closest(".rg-selbox") : null;
   if (sb && ov.contains(sb)) {
    if (sb.getAttribute("data-locked") === "1") return;
    var fw = sb.closest(".rg-field");
    if (fw) fw.classList.remove("bad");
    hideMsg();
    if (!(e.target.closest && e.target.closest("button"))) {
     var editIc = sb.querySelector("button i.fa-edit, button i.fa-pen, button i.fa-pencil");
     var editBtn = editIc ? editIc.closest("button") : null;
     if (editBtn) {
      editBtn.click();
     } else if (fw) {
      openSelModal(fw.getAttribute("data-key"));
     }
    }
   }
  });

  form.addEventListener("input", function (e) {
   var t = e.target;
   if (!t) return;
   var f = t.closest ? t.closest(".rg-field") : null;
   if (f) f.classList.remove("bad");
   hideMsg();
   var name = t.getAttribute ? t.getAttribute("data-name") : "";
   if (name === "l") sanitizeTel(t);
   else if (name === "m") maskAlphaDot(t);
   else if (name === "h") maskDecimal(t, 1);
   else if (name === "i") maskDecimal(t, 2);
   else if (name === "r") maskEducation(t);
   else if (name === "d1") maskDigits2(t);
  });

  form.addEventListener("change", function (e) {
   var t = e.target;
   if (!t) return;
   var f = t.closest ? t.closest(".rg-field") : null;
   if (f) f.classList.remove("bad");
   hideMsg();
   var cname = t.getAttribute ? t.getAttribute("data-name") : "";
   if (cname === "h" || cname === "i") normalizeDecimal2(t);
  });

  form.addEventListener("submit", async function (e) {
   e.preventDefault();
   if (sending) return;
   hideMsg();
   clearBad();
   var out = collectData();
   if (rules) {
    var vr = cmnVldet(out, rules);
    if (vr.su !== 1) {
     markBad(vr.fld, vr.ms);
     showMsg("err", vr.ms || "Please fix the highlighted fields.");
     return;
    }
   }
   ["h", "i", "r", "a1", "a8", "b1"].forEach(function (k) {
    if (out[k] !== undefined) out[k] = cleanNumericProperty(out[k], k);
   });
   setSending(true);

   try {
    if (typeof clearPayload0 === "function") clearPayload0();
    payload0.vw = 4;
    payload0.fn = adminMode ? (isUpdate ? 63 : 62) : 68;
    if (typeof dbDexieManager !== "undefined" && dbDexieManager &&
     typeof dbDexieManager.getMaxDateRecords === "function" &&
     typeof dbnm !== "undefined" && dbnm) {
     payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "mr" }]);
    }
    if (isUpdate && out.a !== undefined && out.a !== null && out.a !== "") {
     payload0.x1 = out.a;
    }
    payload0.x2 = out;
    if (C.drml) payload0.drml = C.drml;
    var resp = await fnj3("https://my1.in/2/" + (adminMode && !isUpdate ? "f.php" : "c.php"), payload0, 1, true, null, 20000, 0, 2, 1, 1);
    hndlRspo68(resp);
   } catch (err) {
    showMsg("err", "Failed to save: " + ((err && err.message) || err));
   } finally {
    try { delete payload0.x2; delete payload0.x1; delete payload0.la; delete payload0.drml; } catch (eX) { }
    setSending(false);
   }
  });

  document.addEventListener("keydown", onKey);

  requestAnimationFrame(function () {
   ov.classList.add("open");
   if (sndRaw && audioAllowedForMode(sndFmMap["1"], isUpdate) && !isAudioAutoOff(sndRaw)) regisPlaySound(sndRaw);
   var first = form.querySelector('.rg-in[type="text"]');
   if (!first) first = form.querySelector(".rg-in");
   suppressInitFocusSound = true;
   if (first) { try { first.focus(); } catch (e) { } }
   suppressInitFocusSound = false;
  });

 window.hndlRspo68 = async function (resp) {
  if (resp && resp.su == 1) {
   var imgRequestSend = false;
   var savedMsg = "Profile saved successfully!";
   if (isUpdate && !adminMode) {
    var elU = form.querySelector('[data-name="u"]');
    var elB6 = form.querySelector('[data-name="b6"]');
    var beforeU = uForSend(baseVal(base, "u"));
    var beforeB6 = galForSend(baseVal(base, "b6"));
    var nowU = uForSend(elU ? elU.value : baseVal(base, "u"));
    var nowB6 = galForSend(elB6 ? elB6.value : baseVal(base, "b6"));
    imgRequestSend = (nowU !== beforeU) || (nowB6 !== beforeB6);
    savedMsg = imgRequestSend
     ? "Profile update successfully! and Image request sent for approval."
     : "Profile update successfully!";
   }
   try {
    if (typeof handl_mr_rspons === "function") await handl_mr_rspons(resp);
   } catch (eH) { console.error(eH); }
   //remember the member's own row (id + data) so the modal reopens pre-filled
   try {
    var myRow = (resp.mr && Array.isArray(resp.mr.l) && resp.mr.l.length) ? resp.mr.l[0] : null;
    if ((!myRow || myRow.a == null) && typeof payload0 !== "undefined" && payload0) {
     var pv = payload0.x2;
     if (pv && pv.a != null) myRow = { a: pv.a };
    }
    if (myRow && myRow.a != null && typeof window.mrPersistMyEinMR === "function") {
     window.mrPersistMyEinMR(myRow);
    }
   } catch (eP) { console.error(eP); }
   if (typeof showToast === "function") {
    showToast(savedMsg, { type: "success", duration: 3000, position: "top" });
   }
   var hAdm = rgAdmOpen;
   if (typeof activeClose === "function") { try { activeClose(); } catch (eC) { console.error(eC); } }
   try {
    if (hAdm) {
     if (typeof window.__mrAdminRefresh === "function") { await window.__mrAdminRefresh(); }
    } else if (typeof mrRenderList === "function") {
     await mrRenderList(true);
    }
   } catch (eR) { console.error(eR); }
  } else {
   showMsg("err", (resp && (resp.ms || resp.m)) || "Save failed. Please try again.");
   window.showelsemodal((resp && (resp.ms || resp.m)) || "Please try again.");
  }
 };
};
})();
