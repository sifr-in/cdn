/* vc_.js - visual editor for vc.da
   Loaded on demand from vc.js (Edit button). Self-contained: injects its own
   CSS + shell. Saves back to vc.da via vc_da.php.
   Every primitive field carries a specific validation pattern. */

(function () {
 'use strict';

  var DA_URL = './vc.da';
  var DESIGN_CSS_BASE = 'https://cdn.jsdelivr.net/gh/sifr-in/cdn@fba9a74/vc/';
  var GMAPS_KEY = '';                    // fill to switch the picker to Google Maps JS
 var NOMINATIM = 'https://nominatim.openstreetmap.org';
 var $ = function (id) { return document.getElementById(id); };

 var ORIG = null;      // last loaded/saved from disk
 var W = null;         // working copy
 var DIRTY = false;

 var WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

 var ENUMS = {
  animations: ['on', 'off', ''],
  businessStatus: ['active', 'inactive', ''],
  profileVisibility: ['public', 'private', 'unlisted', ''],
  design: ['vc1', 'vc2', 'vc3', 'vc4', 'vc5', 'vc6', 'vc7', 'vc8', 'vc9', 'vc10', '']
 };

 var DESIGN_LABELS = {
  vc1: 'vc1 · Classic Ivory (Wave)',
  vc2: 'vc2 · Wine & Gold (Diagonals)',
  vc3: 'vc3 · Forest & Brass (Sidebar)',
  vc4: 'vc4 · Cobalt & Slate (Icons Dock)',
  vc5: 'vc5 · Charcoal & Copper (Brand Column)',
  vc6: 'vc6 · Teal & Amber (Concert Pass)',
  vc7: 'vc7 · Polaroid (Instant Frame)',
  vc8: 'vc8 · Blueprint (Technical Sheet)',
  vc9: 'vc9 · Origami (Paper Fold)',
  vc10: 'vc10 · Editorial (Stripe Bar)',
  '': '— none —'
 };

 var ARRAY_TEMPLATES = {
  catalogues: { url: '', title: '' },
  clientLogos: { url: '', title: '' },
  gallery: { url: '', title: '' },
  videos: { url: '', title: '' },
  brochures: { url: '', title: '' },
  testimonials: { name: '', role: '', quote: '' },
  faqs: { q: '', a: '' },
  certifications: { title: '', issuer: '', year: '' },
  accreditations: { title: '', issuer: '', year: '' },
  awards: { title: '', year: '' },
  businessHours: { day: 'Monday', open: '', close: '', closed: 'false' }
 };

 function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
 }
 function escAttr(s) {
  return esc(s).replace(/"/g, '&quot;');
 }
 function titleCase(key) {
  var s = String(key || '').replace(/^[-_]+|[-_]+$/g, '').replace(/[-_]+/g, ' ');
  if (/^[a-z0-9]+$/.test(s)) s = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return s.replace(/\b[a-z]/g, function (m) { return m.toUpperCase(); });
 }
 function normalizeKey(key) {
  return String(key || '').toLowerCase().replace(/[^a-z0-9]/g, '');
 }
 function deepClone(o) {
  return o == null ? o : JSON.parse(JSON.stringify(o));
 }

 /* ================= required fields (company name, 1 owner, mobile, about) ================= */

 var REQUIRED = [
  { paths: [['company', 'tradeName'], ['company', 'shortName'], ['company', 'legalName']], label: 'Company name' },
  { paths: [['company', 'contact', 'primaryPhone']], label: 'Mobile number' },
  { paths: [['company', 'description']], label: 'About' }
 ];
 var REQUIRED_ARRAY_PATH = ['company', 'founderNames'];

 var BLOCK_KEYS = ['contact', 'addresses', 'business', 'onlinePresence', 'media', 'mapAddressesCombined', 'trustAndCredentials', 'websiteContent', 'websiteSettings'];

 function pathEq(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) if (String(a[i]) !== String(b[i])) return false;
  return true;
 }

 function requiredRuleFor(path) {
  for (var i = 0; i < REQUIRED.length; i++) {
   for (var j = 0; j < REQUIRED[i].paths.length; j++) {
    if (pathEq(REQUIRED[i].paths[j], path)) return REQUIRED[i];
   }
  }
  return null;
 }

 function isRequiredArr(path) {
  return pathEq(REQUIRED_ARRAY_PATH, path);
 }

 function arrOk(v) {
  if (!Array.isArray(v)) return false;
  for (var i = 0; i < v.length; i++) if (String(v[i] || '').trim() !== '') return true;
  return false;
 }

 function ruleSatisfied(rule) {
  for (var i = 0; i < rule.paths.length; i++) {
   if (String(getByPath(W, rule.paths[i]) || '').trim() !== '') return true;
  }
  return false;
 }

 /* ================= editor CSS + shell (was vc_.html) ================= */

 var CSS = [
  ':root{--A:#1B2A4A;--A2:#2F4B8F;--ink:#1f2937;--mut:#6b7280;--line:#e5e7eb;--bg:#eef2f7;--card:#ffffff}',
  '*{box-sizing:border-box}',
  'html,body{margin:0;padding:0}',
  'body{font-family:Segoe UI,Roboto,Arial,sans-serif;background:var(--bg);color:var(--ink);padding-top:58px}',
  '#vd-top{position:fixed;top:0;left:0;right:0;z-index:50;background:linear-gradient(135deg,var(--A),var(--A2));color:#fff;display:flex;align-items:center;gap:8px;padding:10px 14px;box-shadow:0 4px 16px rgba(15,23,42,.25);overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch}',
  '#vd-top .t{font-weight:700;font-size:15px;margin-right:auto;display:flex;align-items:center;gap:8px}',
  '#vd-top .t small{font-weight:400;opacity:.75;font-size:12px}',
  '.vd-btn{border:0;border-radius:10px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:filter .15s,transform .1s}',
  '.vd-btn:hover{filter:brightness(1.08)}',
  '.vd-btn:active{transform:translateY(1px)}',
  '.vd-btn.primary{background:#fff;color:var(--A)}',
  '.vd-btn.ghost{background:rgba(255,255,255,.16);color:#fff}',
  '.vd-btn.danger{background:#dc2626;color:#fff}',
  '#vd-state{font-size:12px;opacity:.9;min-width:60px}',
  '#vd-main{max-width:1100px;margin:0 auto;padding:16px}',
  '.vd-ol{list-style:none;margin:0;padding:0 0 0 14px;border-left:1px dashed var(--line)}',
  '.vd-li{position:relative;margin-bottom:2px}',
  '.vd-lbl{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--A);padding:6px 4px;cursor:pointer;user-select:none;border-radius:6px}',
  '.vd-lbl:hover{background:#e6ecf9}',
  '.vd-lbl .chev{margin-left:auto;opacity:.6;transition:transform .2s}',
  '.vd-li.col>.vd-lbl .chev{transform:rotate(-90deg)}',
  '.vd-li.col>.vd-body{display:none}',
  '.vd-sec.col>.vd-lbl .chev{transform:rotate(-90deg)}',
  '.vd-sec.col>.vd-body{display:none}',
  '.vd-free{color:var(--mut);font-weight:400;font-size:11px}',
  '.vd-sec{background:var(--card);border:1px solid var(--line);border-radius:14px;margin:12px 0;overflow:hidden;box-shadow:0 4px 14px rgba(15,23,42,.06)}',
  '.vd-sec>.vd-lbl{background:linear-gradient(135deg,var(--A),var(--A2));color:#fff;font-size:14px;padding:10px 12px}',
  '.vd-sec>.vd-lbl .chev{color:#fff}',
  '.vd-sec>.vd-lbl:hover{background:linear-gradient(135deg,var(--A),var(--A2));filter:brightness(1.08)}',
  '.vd-sec>.vd-body{padding:10px}',
  '.vd-row{display:flex;align-items:flex-start;gap:8px;padding:5px 4px}',
  '.vd-row label{flex:0 0 190px;font-size:12px;font-weight:600;color:var(--mut);padding-top:9px;text-align:right;word-break:break-word}',
  '.vd-in{flex:1;min-width:0}',
  '.vd-in textarea,.vd-in input[type=time],.vd-in input[type=date],.vd-in input[type=text],.vd-in input[type=email],.vd-in input[type=url],.vd-in input[type=tel],.vd-in input[type=number],.vd-in select{width:100%;border:1px solid var(--line);border-radius:9px;padding:9px 10px;font-size:13px;font-family:inherit;outline:none;background:#fff;color:var(--ink);transition:border-color .15s,box-shadow .15s}',
  '.vd-in textarea{min-height:70px;resize:vertical}',
  '.vd-in input:focus,.vd-in textarea:focus,.vd-in select:focus{border-color:var(--A2);box-shadow:0 0 0 3px rgba(47,75,143,.15)}',
  '.vd-in input[type=color]{width:44px;height:38px;padding:2px;border:1px solid var(--line);border-radius:9px;cursor:pointer;background:#fff}',
  '.vd-in.blank input[type=color]{width:100%;height:38px}',
  '.vd-hint{font-size:11px;color:var(--mut);margin-top:3px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}',
  '.vd-hint .p{font-family:Consolas,monospace;background:#f1f5f9;border:1px solid var(--line);border-radius:5px;padding:1px 6px;color:#475569}',
  '.vd-hint .p a{color:var(--A2);text-decoration:none;word-break:break-all}',
  '.vd-hint .p a:hover{text-decoration:underline}',
  '.vd-hint .e{color:#dc2626;font-weight:600;display:none}',
  '.vd-in.bad input,.vd-in.bad textarea,.vd-in.bad select{border-color:#dc2626!important;box-shadow:0 0 0 3px rgba(220,38,38,.12)!important}',
  '.vd-in.bad .e{display:inline}',
  '.vd-in.bad .p{display:none}',
  '.vd-in.good input,.vd-in.good textarea,.vd-in.good select{border-color:#16a34a!important}',
  '.vd-li.vd-req>.vd-row label::after,.vd-li.vd-req>.vd-lbl::after{content:" *";color:#dc2626}',
  '.vd-arr.vd-flag{border:1px solid #dc2626;border-radius:11px}',
  '.vd-arr-item{border:1px solid var(--line);border-radius:11px;margin:8px 0;background:#fbfcfe}',
  '.vd-arr-item>.vd-li{display:block}',
  '.vd-it-hd{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--A2);padding:7px 10px;background:#f1f5fb;border-radius:11px 11px 0 0}',
  '.vd-it-hd .n{width:22px;height:22px;border-radius:6px;background:var(--A2);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px}',
  '.vd-del{width:24px;height:24px;border:0;border-radius:6px;background:#fee2e2;color:#dc2626;font-weight:800;font-size:13px;cursor:pointer;line-height:1;margin-left:auto}',
  '.vd-del:hover{background:#fecaca}',
  '.vd-add{width:100%;border:1px dashed #93a3c4;background:#f6f9ff;color:var(--A2);border-radius:10px;padding:7px;font-size:12.5px;font-weight:700;cursor:pointer;margin-top:8px;transition:background .15s}',
  '.vd-add:hover{background:#e9f0ff}',
  '.vd-body>.vd-ol{border-left:0;padding:0}',
  '.vd-arr-body{padding:6px 10px 10px}',
  '.vd-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#111827;color:#fff;font-size:13px;font-weight:600;padding:10px 18px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.35);opacity:0;transition:opacity .25s;z-index:99;max-width:80vw}',
  '.vd-toast.show{opacity:1}',
  '.vd-toast.ok{background:#15803d}',
  '.vd-toast.err{background:#b91c1c}',
  '#vd-jsonpane{position:fixed;inset:58px 0 0;background:#0f172a;color:#d1d5db;z-index:60;display:none;overflow:auto}',
  '#vd-jsonpane.show{display:block}',
  '#vd-jsonpane pre{margin:14px;font-family:Consolas,monospace;font-size:12px;white-space:pre-wrap}',
  '.vd-hd-note{font-size:11px;color:#fbbf24;font-weight:500}',
  '#vd-preview{position:fixed;top:58px;right:0;bottom:0;width:min(560px,94vw);background:var(--card);border-left:1px solid var(--line);box-shadow:-12px 0 32px rgba(15,23,42,.16);z-index:45;transform:translateX(102%);transition:transform .25s ease;display:flex;flex-direction:column}',
  '#vd-preview.open{transform:none}',
  '#vd-preview .hd{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--line);background:#f8fafc;font-size:13px;font-weight:700;color:var(--A)}',
  '#vd-preview .hd .t{margin-right:auto}',
  '#vd-preview .hd button{border:0;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer;background:var(--line);color:var(--ink)}',
  '#vd-preview .hd button:hover{background:#dbe1ea}',
  '#vd-preview iframe{flex:1;width:100%;border:0;background:#fff}',
  '.vd-mapbtn{border:0;border-radius:8px;background:var(--A2);color:#fff;font-size:11px;font-weight:700;padding:5px 10px;cursor:pointer;margin-top:6px;display:inline-flex;align-items:center;gap:5px}',
  '.vd-mapbtn:hover{filter:brightness(1.1)}',
  '#vd-mapmodal{position:fixed;inset:0;z-index:120;background:rgba(15,23,42,.55);display:none;align-items:center;justify-content:center;padding:14px}',
  '#vd-mapmodal.show{display:flex}',
  '#vd-mapmodal .box{background:#fff;border-radius:14px;width:min(720px,100%);max-height:92vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.4)}',
  '#vd-mapmodal .mhd{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--line);font-weight:700;color:var(--A);position:sticky;top:0;background:#fff;z-index:2}',
  '#vd-mapmodal .mhd .t{margin-right:auto}',
  '#vd-mapmodal .mhd button{border:0;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer;background:var(--line);color:var(--ink)}',
  '#vd-mapmodal .mbody{padding:10px 12px}',
  '#vd-mapmodal .mctl{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}',
  '#vd-mapmodal .mctl input{flex:1;min-width:180px;border:1px solid var(--line);border-radius:9px;padding:8px 10px;font-size:13px;font-family:inherit;outline:none}',
  '#vd-mapmodal .mctl button{border:0;border-radius:9px;padding:8px 12px;font-size:12.5px;font-weight:700;cursor:pointer;background:var(--A2);color:#fff}',
  '#vd-mapmodal .mctl button.alt{background:#eef2fb;color:var(--A2)}',
  '#vd-map{height:min(48vh,380px);border:1px solid var(--line);border-radius:10px;background:#eef2f7;z-index:1}',
  '#vd-mapmodal .mres{margin:0 0 8px;font-size:12px;color:var(--mut);max-height:120px;overflow:auto}',
  '#vd-mapmodal .mres div{padding:6px;border-radius:6px;cursor:pointer}',
  '#vd-mapmodal .mres div:hover{background:#eef2fb}',
  '#vd-mapmodal .mnote{font-size:11px;color:var(--mut);margin-top:6px}',
  '#vd-mapmodal .mfoot{display:flex;align-items:center;gap:8px;padding:10px 12px;border-top:1px solid var(--line);flex-wrap:wrap;position:sticky;bottom:0;background:#fff}',
  '#vd-mapmodal .mfoot .co{font-family:Consolas,monospace;font-size:12px;color:var(--ink);margin-right:auto}',
  '#vd-mapmodal .mfoot button{border:0;border-radius:9px;padding:9px 14px;font-size:13px;font-weight:700;cursor:pointer}',
  '#vd-mapmodal .mfoot .apply{background:var(--A2);color:#fff}',
  '#vd-mapmodal .mfoot .cancel{background:var(--line);color:var(--ink)}',
  '.vd-draggrp{display:inline-flex;gap:3px;margin-right:4px;align-items:center}',
  '.vd-draggrp button{border:0;background:#eef2fb;color:var(--A2);border-radius:6px;width:20px;height:20px;font-size:11px;line-height:1;cursor:pointer;padding:0}',
  '.vd-draggrp button:hover{background:#dbe4f3}',
  '.vd-draggrp .vd-drag{cursor:grab}',
  '.vd-li.dragging{opacity:.55}',
  '.vd-li.dragging *{pointer-events:none}',
  '.vd-li.drop-before{box-shadow:inset 0 3px 0 var(--A2)}',
  '.vd-li.drop-after{box-shadow:inset 0 -3px 0 var(--A2)}',
  '@media (max-width:640px){',
  '  #vd-state{display:none}',
  '  #vd-top{scrollbar-width:none;gap:6px;padding:9px 12px}',
  '  #vd-top::-webkit-scrollbar{display:none}',
  '  #vd-top>*{flex:0 0 auto;white-space:nowrap}',
  '  #vd-top .vd-btn{padding:8px 10px;font-size:12px}',
  '  .vd-row{flex-direction:column}',
  '  .vd-row label{flex:1 1 auto;text-align:left;padding-top:0;width:100%}',
  '}'
 ].join('\n');

 function installShell() {
  if (!document.getElementById('vc-edit-style')) {
   var s = document.createElement('style');
   s.id = 'vc-edit-style';
   s.textContent = CSS;
   document.head.appendChild(s);
  }
  document.body.classList.remove('vc-theme');
  var classes = (document.body.className || '').split(/\s+/);
  document.body.className = classes.filter(function (c) { return c.indexOf('vc-dsn-') !== 0; }).join(' ').trim();
  document.title = 'vc.da Editor';
  document.body.innerHTML =
   '<div id="vd-top">' +
   '<div class="t">vc.da <small>editor</small></div>' +
   '<span id="vd-state">…</span>' +
   '<a class="vd-btn ghost" href="./index.html" target="_blank" rel="noopener" style="text-decoration:none">View card</a>' +
   '<button class="vd-btn ghost" id="vd-prevbtn" title="Show design preview">Preview</button>' +
   '<button class="vd-btn ghost" id="vd-premessbtn" title="My Permessions">My Permessions</button>' +
   '<button class="vd-btn ghost" id="vd-togglejson" disabled>JSON</button>' +
   '<button class="vd-btn ghost" id="vd-refresh">Refresh</button>' +
   '<button class="vd-btn ghost" id="vd-reset">Reset</button>' +
   '<button class="vd-btn ghost" id="vd-close" title="Back to card">✕ Close</button>' +
   '<button class="vd-btn primary" id="vd-save">Save</button>' +
   '</div>' +
   '<div id="vd-main"><p class="vd-hd-note">Loading vc.da…</p></div>' +
   '<div id="vd-jsonpane"></div>' +
   '<div id="vd-preview">' +
   '<div class="hd"><span class="t">Design preview</span>' +
   '<button type="button" id="vd-prevrefresh" title="Re-render preview">Refresh</button>' +
   '<button type="button" id="vd-prevclose" title="Close preview">✕</button></div>' +
   '<iframe id="vd-preview-iframe" title="Card design preview"></iframe>' +
   '</div>' +
   '<div id="vd-mapmodal">' +
   '<div class="box">' +
   '<div class="mhd"><span class="t">Pick location</span><button type="button" id="vd-mapclose" title="Close">✕</button></div>' +
   '<div class="mbody">' +
   '<div class="mctl">' +
   '<input type="text" id="vd-mapsearch" placeholder="Search address or place…" autocomplete="off">' +
   '<button type="button" id="vd-mapfind">Find</button>' +
   '<button type="button" class="alt" id="vd-mapgps">My location</button>' +
   '<button type="button" class="alt" id="vd-mappaste">Paste Maps link</button>' +
   '</div>' +
   '<div class="mres" id="vd-mapres"></div>' +
   '<div id="vd-map"></div>' +
   '<div class="mnote">Click the map or drag the marker to set coordinates. Reverse geocode fills empty address fields only.</div>' +
   '</div>' +
   '<div class="mfoot">' +
   '<span class="co" id="vd-mapco">—</span>' +
   '<button type="button" class="apply" id="vd-mapapply">Apply to address</button>' +
   '<button type="button" class="cancel" id="vd-mapcancel">Cancel</button>' +
   '</div>' +
   '</div>' +
   '</div>' +
   '<div id="vd-toast" class="vd-toast"></div>';
 }

 /* ================= validation pattern per key ================= */

 function resolveFieldDef(key, val) {
  var k = normalizeKey(key);
  var kind = Array.isArray(val) ? 'array' : (val === null ? 'null' : typeof val);
  var def = { key: key, kind: kind, input: 'text', textarea: false, pattern: null, hint: 'text', options: null };

  if (kind === 'boolean') { def.input = 'select'; def.options = ['true', 'false']; def.pattern = '^$|^true$|^false$'; def.hint = 'true / false'; return def; }
  if (kind === 'null') { def.pattern = '[\\s\\S]*'; def.hint = 'null'; return def; }

  if (ENUMS[String(key)]) {
   def.input = 'select'; def.options = ENUMS[String(key)];
   def.labels = (String(key) === 'design') ? DESIGN_LABELS : null;
   def.pattern = '^(' + ENUMS[String(key)].join('|') + ')$'; def.hint = 'one of: ' + ENUMS[String(key)].join(', ');
   return def;
  }
  if (k === 'closed') { def.input = 'select'; def.options = ['true', 'false']; def.pattern = '^$|^true$|^false$'; def.hint = 'closed today?'; return def; }
  if (k === 'day') { def.input = 'select'; def.options = WEEKDAYS; def.pattern = '^(' + WEEKDAYS.join('|') + ')$'; def.hint = 'weekday'; return def; }
  if (k === 'mapaddressescombined') {
   def.input = 'select'; def.options = ['0', '1'];
   def.pattern = '^$|^0$|^1$'; def.hint = '0 = separate maps · 1 = all addresses on one map';
   return def;
  }

  if (/(^themecolor$|^shadecolor$|^inkcolor$|^mutedcolor$|^linecolor$|^pagebg$|^pagebgtop$|^pagebgbottom$|^chipbg$|^chipborder$|Color$)/.test(k)) {
   def.input = 'color'; def.pattern = '^$|^#?[0-9A-Fa-f]{6}$|^#?[0-9A-Fa-f]{3}$'; def.hint = 'empty or #RRGGBB'; return def;
  }
  if (/^(cardmaxwidth|basefontsize|radius|sectiongap|actionradius|galleryheight|fontsize|maxwidth|width|height)$/.test(k)) {
   def.pattern = '^$|^[0-9.]+(px|em|rem|vw|vh|%)$'; def.hint = 'CSS length'; return def;
  }
  if (k === 'foundeddate' || k === 'date' || k === 'established') {
   def.input = 'date'; def.pattern = '^$|^[0-9]{4}-[0-9]{2}-[0-9]{2}$'; def.hint = 'YYYY-MM-DD'; return def;
  }
  if (k === 'open' || k === 'close' || k === 'openhour' || k === 'closehour' || k === 'starttime' || k === 'endtime') {
   def.input = 'time'; def.pattern = '^$|^[0-9]{2}:[0-9]{2}$'; def.hint = 'HH:MM 24h'; return def;
  }
  if (/(phone|whatsapp|mobile|contact|emergency|fax)/.test(k)) {
   def.pattern = '^$|^\\+?[0-9][0-9 .()-]{5,19}$'; def.hint = 'digits / + / spaces / -'; return def;
  }
  if (/(email|mail)/.test(k)) {
   def.input = 'email'; def.pattern = '^$|^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$'; def.hint = 'name@domain.tld'; return def;
  }
  if (/(url|link|website|logo|cover|favicon|profile|map|pdf|brochure|catalog|page|youtube|instagram|facebook|linkedin|canonical|gmb|google|image|video|photo|source|href|u$)/.test(k)) {
   def.input = 'url'; def.pattern = '^$|^(?:[a-zA-Z][a-zA-Z0-9+.-]*:\\/\\/[^\\s]+|[a-z0-9-]+(?:\\.[a-z0-9-]+)+(?:\\/\\S*)?)$'; def.hint = 'https://…'; return def;
  }
  if (k === 'pin' || k === 'pincode' || k === 'zip' || k === 'zipcode' || k === 'postalcode') {
   def.pattern = '^$|^[0-9]{5,6}$'; def.hint = '5-6 digits'; return def;
  }
  if (k === 'gstin' || k === 'gst') {
   def.pattern = '^$|^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z][0-9A-Za-z][Zz][0-9A-Za-z]$'; def.hint = '27ABCDE1234F1Z5'; return def;
  }
  if (k === 'pan') {
   def.pattern = '^$|^[A-Za-z]{5}[0-9]{4}[A-Za-z]$'; def.hint = 'ABCDE1234F'; return def;
  }
  if (k === 'cin') {
   def.pattern = '^$|^[LUlu][0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}$'; def.hint = 'U72900PN2016PTC123456'; return def;
  }
  if (k === 'registrationnumber' || k === 'xbrl' || k === 'udyam' || k === 'rcnumber') {
   def.pattern = '^$|^[A-Za-z0-9-]{6,25}$'; def.hint = '6-25 letters/digits/-'; return def;
  }
  if (k === 'year' || k === 'estyear') {
   def.pattern = '^$|^[0-9]{4}$'; def.hint = '4-digit year'; return def;
  }
  if (/(language|locale|lang)/.test(k)) {
   def.pattern = '^$|^[A-Za-z]{2,16}(?:-[A-Za-z]{2,16})?$'; def.hint = 'e.g. en, hi, en-US'; return def;
  }
  if (k === 'employeecount') {
   def.pattern = '^$|^[0-9]{1,4}(?:-[0-9]{1,4})?$'; def.hint = 'e.g. 25-50'; return def;
  }
  if (k === 'refreshseconds') {
   def.pattern = '^$|^[0-9]{1,6}$'; def.hint = 'poll seconds - 0/empty disables refresh'; return def;
  }
  if (k === 'lat' || k === 'lng' || k === 'lon' || k === 'longitude' || k === 'latitude') {
   def.pattern = '^$|^-?[0-9]+(?:\\.[0-9]+)?$'; def.hint = 'decimal'; return def;
  }
  if (k === 'cardshadow') {
   def.pattern = '^$|(?=.)[\\s\\S]*'; def.hint = 'CSS box-shadow'; return def;
  }
  if (/(^description$|description|aboutus|mission|vision|history|metadescription|^quote$|^a$|summary|content|message|note)/.test(k)) {
   def.input = 'textarea'; def.pattern = '[\\s\\S]*'; def.hint = 'multi-line text'; return def;
  }
  def.pattern = '[\\s\\S]*';
  def.hint = 'text';
  return def;
 }

 function defForValue(key, value) {
  if (typeof value === 'string' && /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:\/\/|www\.)/.test(value)) key = 'url';
  return resolveFieldDef(key, value);
 }

 function valid(reStr, value) {
  if (!reStr || reStr === '[\\s\\S]*') return true;
  try { return new RegExp(reStr).test(String(value == null ? '' : value)); }
  catch (e) { return true; }
 }

 /* ================= toast ================= */

 var toastTimer = null;
 function toast(msg, type) {
  var t = $('vd-toast');
  t.textContent = msg;
  t.className = 'vd-toast show ' + (type === 'err' ? 'err' : (type === 'ok' ? 'ok' : ''));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.className = 'vd-toast'; }, 3200);
 }

 /* ================= data helpers ================= */

 function getByPath(o, path) {
  var c = o;
  for (var i = 0; i < path.length; i++) { if (c == null) return undefined; c = c[path[i]]; }
  return c;
 }
 function setByPath(o, path, value) {
  var obj = o;
  for (var i = 0; i < path.length - 1; i++) {
   if (obj == null || typeof obj !== 'object') return false;
   obj = obj[path[i]];
  }
  if (obj == null || typeof obj !== 'object') return false;
  obj[path[path.length - 1]] = value;
  return true;
 }

 /* ================= load ================= */

 function prettyBytes(n) {
  return n < 1024 ? n + ' B' : (n / 1024).toFixed(1) + ' KB';
 }

 function loadDa() {
  toast('Loading vc.da…', '');
  return fetch(DA_URL + '?t=' + Date.now(), { cache: 'no-store' })
   .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
   .then(function (txt) {
    ORIG = JSON.parse(txt);
    W = deepClone(ORIG);
    DIRTY = false;
    renderTree();
    $('vd-togglejson').disabled = false;
    $('vd-state').textContent = 'loaded ' + prettyBytes(txt.length);
    toast('Loaded vc.da', 'ok');
   })
   .catch(function (e) { toast('Load failed: ' + e.message, 'err'); });
 }

 /* ================= rendering (path-aware) ================= */

 function nodeSummary(v) {
  if (v === null) return 'null';
  if (typeof v === 'object' && !Array.isArray(v)) return Object.keys(v).length + ' keys';
  if (Array.isArray(v)) return v.length + ' items';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return 'number:' + v;
  return 'text';
 }

 function renderTree() {
  var main = $('vd-main');
  var html = '';
  Object.keys(W || {}).forEach(function (k) {
   html += '<div class="vd-sec' + (k === 'root-css' ? ' col' : '') + (k === 'company' ? ' vd-company' : '') + '">' +
    '<div class="vd-lbl" data-toggle="1">' + esc(titleCase(k)) +
    ' <span class="vd-free">(' + nodeSummary(W[k]) + ')</span><span class="chev">▼</span></div>' +
    '<div class="vd-body">' + renderValue(k, W[k], 0, [k]) + '</div></div>';
  });
  main.innerHTML = html;
  wireAttachments(main);
  validateAll();
  $('vd-state').textContent = DIRTY ? 'edited' : 'fields ready';
 }

 function renderValue(key, v, depth, path) {
  if (Array.isArray(v)) return renderArray(key, v, depth, path);
  if (v !== null && typeof v === 'object') return renderObject(key, v, depth, path);
  return renderField(key, v, path);
 }

 function renderObject(key, obj, depth, path) {
  var html = '<ol class="vd-ol">';
  Object.keys(obj).forEach(function (k) {
   html += renderLi(k, obj[k], depth + 1, path.concat([k]));
  });
  return html + '</ol>';
 }

 function renderLi(key, v, depth, path) {
  var isObj = v !== null && typeof v === 'object' && !Array.isArray(v);
  var isArr = Array.isArray(v);
  if (isObj || isArr) {
   var req = (isObj && requiredRuleFor(path)) || (isArr && isRequiredArr(path));
   return '<li class="vd-li' + (isArr && v.length === 0 ? ' col' : '') + (req ? ' vd-req' : '') + '" data-k="' + escAttr(key) + '" data-kind="' + (isArr ? 'a' : 'o') + '">' +
    '<div class="vd-lbl" data-toggle="1">' + esc(titleCase(key)) +
    ' <span class="vd-free">(' + nodeSummary(v) + ')</span><span class="chev">▼</span></div>' +
    '<div class="vd-body">' + renderValue(key, v, depth, path) + '</div></li>';
  }
  return renderField(key, v, path);
 }

 function renderArray(key, arr, depth, path) {
  var ap = escAttr(JSON.stringify(path));
  var html = '<div class="vd-arr" data-arr="' + escAttr(key) + '" data-ap="' + ap + '">';
  arr.forEach(function (item, idx) {
   var itemPath = path.concat([idx]);
   var isObj = item !== null && typeof item === 'object';
   html += '<div class="vd-arr-item" data-idx="' + idx + '">' +
    '<div class="vd-it-hd"><span class="n">' + (idx + 1) + '</span>' + esc(titleCase(key)) +
    '<button type="button" class="vd-del" data-idx="' + idx + '" title="Remove item">×</button></div>';
   if (isObj) {
    html += '<div class="vd-arr-body">' + renderObject(key, item, depth, itemPath) + '</div>';
   } else {
    html += '<div class="vd-arr-body"><div class="vd-row"><label>item</label><div class="vd-in">' +
     fieldInput(key, item, itemPath) + '</div></div></div>';
   }
   html += '</div>';
  });
  html += '<button type="button" class="vd-add">＋ Add ' + esc(titleCase(key)) + ' item</button>';
  return html + '</div>';
 }

 function fieldInput(key, value, path) {
  var def = defForValue(key, value);
  var pAttr = escAttr(JSON.stringify(path || []));
  var base = [' data-p="' + pAttr + '"', ' data-re="' + escAttr(def.pattern) + '"'].join('');
  var val = value == null ? '' : value;

  if (def.input === 'color') {
   var norm = /^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val) ? val : '#000000';
   return '<input type="color" value="' + escAttr(norm) + '"' + base + '>';
  }
  if (def.input === 'select') {
   var opts = (def.options || []).map(function (o) {
    var lbl = (def.labels && def.labels[o] != null) ? def.labels[o] : o;
    return '<option value="' + escAttr(o) + '"' + (String(val) === o ? ' selected' : '') + '>' + esc(lbl) + '</option>';
   }).join('');
   if (String(val) && (def.options || []).indexOf(String(val)) === -1) {
    opts = '<option value="' + escAttr(val) + '" selected>' + esc(val) + '</option>' + opts;
   }
   return '<select' + base + '>' + opts + '</select>';
  }
  if (def.input === 'date' || def.input === 'time') {
   return '<input type="' + def.input + '" value="' + escAttr(val) + '"' + base + '>';
  }
  if (def.input === 'email') return '<input type="email" value="' + escAttr(val) + '"' + base + '>';
  if (def.input === 'url') return '<input type="url" value="' + escAttr(val) + '"' + base + '>';
  if (def.textarea || def.input === 'textarea') {
   return '<textarea' + base + '>' + esc(val) + '</textarea>';
  }
  return '<input type="text" value="' + escAttr(val) + '"' + base + '>';
 }

 function isGeoKey(key) {
  return /^(lat|lng|lon|longitude|latitude)$/.test(normalizeKey(key));
 }

  function designCssUrl(value) {
   var m = String(value == null ? '' : value).trim().match(/^vc?([1-9]\d*)$/i);
   return m ? DESIGN_CSS_BASE + 'vc' + m[1] + '.css' : '';
  }

  function renderField(key, value, path) {
   var def = defForValue(key, value);
   var req = requiredRuleFor(path);
   var mapBtn = isGeoKey(key) && path.length > 1
    ? '<button type="button" class="vd-mapbtn" data-p="' + escAttr(JSON.stringify(path)) + '">Pick on map</button>'
    : '';
   var dUrl = (String(key) === 'design') ? designCssUrl(value) : '';
   var designNote = dUrl
    ? '<span class="p">css: <a href="' + escAttr(dUrl) + '" target="_blank" rel="noopener">' + esc(dUrl) + '</a></span>'
    : '';
   return '<li class="vd-li' + (req ? ' vd-req' : '') + '" data-k="' + escAttr(key) + '" data-kind="p"><div class="vd-row"><label for="f-' + escAttr(key) + '">' + esc(titleCase(key)) + '</label>' +
    '<div class="vd-in">' + fieldInput(key, value, path) + mapBtn +
    '<div class="vd-hint">' + designNote + '<span class="p">' + esc(def.pattern) + '</span><span class="e">' + (req ? 'required' : 'invalid') + '</span></div></div></div></li>';
  }

 /* ================= wiring ================= */

 function wireAttachments(root) {
  root.querySelectorAll('.vd-lbl').forEach(function (el) {
   el.addEventListener('click', function (e) {
    if (e.target.closest('button')) return;
    var li = el.closest('.vd-li') || el.closest('.vd-sec');
    if (li) li.classList.toggle('col');
   });
  });

  root.querySelectorAll('.vd-arr').forEach(function (box) {
   var arrPath = parsePath(box.getAttribute('data-ap'));
   var addB = box.querySelector('.vd-add');
   if (addB) {
    addB.addEventListener('click', function () {
     if (!W) return;
     var arr = getByPath(W, arrPath);
     if (!Array.isArray(arr)) return;
     arr.push(templateFor(arr, box.getAttribute('data-arr')));
     DIRTY = true;
     renderTree();
    });
   }
  });

  root.querySelectorAll('.vd-del').forEach(function (btn) {
   btn.addEventListener('click', function () {
    var box = btn.closest('.vd-arr');
    if (!box || !W) return;
    var arrPath = parsePath(box.getAttribute('data-ap'));
    var arr = getByPath(W, arrPath);
    var idx = parseInt(btn.getAttribute('data-idx'), 10);
    if (Array.isArray(arr)) { arr.splice(idx, 1); DIRTY = true; renderTree(); }
   });
  });

  root.querySelectorAll('.vd-in').forEach(function (cell) {
   var el = cell.querySelector('input,select,textarea');
   if (!el) return;
   var change = function () {
    if (!W) return;
    var p = parsePath(el.getAttribute('data-p'));
    if (setByPath(W, p, el.type === 'color' ? el.value : el.value)) DIRTY = true;
    validateCell(cell, el);
    if (p.length === 2 && p[0] === 'root-css' && p[1] === 'design') schedulePreview();
   };
   el.addEventListener('input', change);
   el.addEventListener('change', change);
  });

  root.querySelectorAll('.vd-mapbtn').forEach(function (btn) {
   btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!W) return;
    var p = parsePath(btn.getAttribute('data-p'));
    if (p.length < 2) return;
    openMapPicker(p.slice(0, -1));
   });
  });

  var companySec = root.querySelector('.vd-sec.vd-company');
  if (companySec) wireBlockSort(companySec);
 }

 function rebuildCompanyOrder(sec) {
  if (!W || !W.company) return false;
  var ol = sec.querySelector('.vd-body > .vd-ol');
  if (!ol) return false;
  var keys = [];
  var kids = ol.children;
  for (var i = 0; i < kids.length; i++) {
   var k = kids[i].getAttribute && kids[i].getAttribute('data-k');
   if (k) keys.push(k);
  }
  var cur = Object.keys(W.company);
  var same = keys.length === cur.length;
  if (same) for (var j = 0; j < keys.length; j++) if (keys[j] !== cur[j]) { same = false; break; }
  if (same) return false;
  var nb = {};
  keys.forEach(function (k) { if (k in W.company) nb[k] = W.company[k]; });
  W.company = nb;
  return true;
 }

 function moveCompanyKey(sec, key, dir) {
  if (!W || !W.company) return;
  var keys = Object.keys(W.company);
  var i = keys.indexOf(key);
  if (i < 0) return;
  var j = dir === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= keys.length) return;
  keys.splice(i, 1);
  keys.splice(j, 0, key);
  var nb = {};
  keys.forEach(function (k) { nb[k] = W.company[k]; });
  W.company = nb;
  DIRTY = true;
  renderTree();
 }

 function wireBlockSort(sec) {
  var ol = sec.querySelector('.vd-body > .vd-ol');
  if (!ol) return;

  Array.prototype.forEach.call(ol.children, function (li) {
   var key = li.getAttribute('data-k');
   if (!key || BLOCK_KEYS.indexOf(key) === -1) return;
   var lbl = li.querySelector('.vd-lbl');
   if (!lbl) return;
   var g = document.createElement('span');
   g.className = 'vd-draggrp';
   g.title = 'Reorder block';
   g.innerHTML = '<button type="button" class="vd-drag" draggable="true" title="Drag to reorder">⠿</button>' +
    '<button type="button" class="vd-move" data-dir="up" title="Move up">▲</button>' +
    '<button type="button" class="vd-move" data-dir="down" title="Move down">▼</button>';
   lbl.insertBefore(g, lbl.firstChild);
  });

  var dragLi = null;

  ol.addEventListener('dragstart', function (e) {
   var grip = e.target.closest ? e.target.closest('.vd-drag') : null;
   var li = grip ? grip.closest('li[data-k]') : null;
   if (!li || !ol.contains(li) || li.parentNode !== ol) return;
   dragLi = li;
   li.classList.add('dragging');
   e.dataTransfer.effectAllowed = 'move';
   try { e.dataTransfer.setData('text/plain', li.getAttribute('data-k')); } catch (err) { }
  });

  ol.addEventListener('dragover', function (e) {
   var li = e.target.closest ? e.target.closest('li[data-k]') : null;
   if (!li || !ol.contains(li) || li === dragLi) return;
   e.preventDefault();
   var r = li.getBoundingClientRect();
   var before = e.clientY < r.top + r.height / 2;
   var kids = ol.children;
   for (var i = 0; i < kids.length; i++) kids[i].classList.remove('drop-before', 'drop-after');
   li.classList.add(before ? 'drop-before' : 'drop-after');
  });

  ol.addEventListener('drop', function (e) {
   e.preventDefault();
   var li = e.target.closest ? e.target.closest('li[data-k]') : null;
   var kids = ol.children;
   for (var i = 0; i < kids.length; i++) kids[i].classList.remove('drop-before', 'drop-after');
   if (li && dragLi && li !== dragLi && ol.contains(li) && li.parentNode === ol) {
    var before = e.clientY < li.getBoundingClientRect().top + li.getBoundingClientRect().height / 2;
    ol.insertBefore(dragLi, before ? li : li.nextSibling);
    if (rebuildCompanyOrder(sec)) { DIRTY = true; renderTree(); }
   }
   dragLi = null;
  });

  ol.addEventListener('dragend', function () {
   var kids = ol.children;
   for (var i = 0; i < kids.length; i++) kids[i].classList.remove('dragging', 'drop-before', 'drop-after');
   dragLi = null;
  });

  ol.addEventListener('click', function (e) {
   var btn = e.target.closest ? e.target.closest('button.vd-move') : null;
   if (!btn) return;
   e.stopPropagation();
   var li = btn.closest('li[data-k]');
   if (!li) return;
   moveCompanyKey(sec, li.getAttribute('data-k'), btn.getAttribute('data-dir'));
  });
 }

 function parsePath(str) {
  try { var v = JSON.parse(str); return Array.isArray(v) ? v : []; }
  catch (e) { return []; }
 }

 function templateFor(arr, key) {
  if (arr.length && arr[0] !== null && typeof arr[0] === 'object') {
   var t = {};
   Object.keys(arr[0]).forEach(function (k) { t[k] = typeof arr[0][k] === 'number' ? 0 : (typeof arr[0][k] === 'boolean' ? false : ''); });
   return t;
  }
  if (ARRAY_TEMPLATES[key]) return deepClone(ARRAY_TEMPLATES[key]);
  if (arr.length) return typeof arr[0] === 'number' ? 0 : '';
  return ARRAY_TEMPLATES[key] ? deepClone(ARRAY_TEMPLATES[key]) : '';
 }

 function validateAll() {
  $('vd-main').querySelectorAll('.vd-in').forEach(function (cell) {
   var el = cell.querySelector('input,select,textarea');
   if (el) validateCell(cell, el);
  });
  var arr = $('vd-main').querySelector('.vd-arr[data-arr="' + REQUIRED_ARRAY_PATH[REQUIRED_ARRAY_PATH.length - 1] + '"]');
  if (arr) arr.classList.toggle('vd-flag', !arrOk(getByPath(W, REQUIRED_ARRAY_PATH)));
 }

 function validateCell(cell, el) {
  cell.classList.remove('good', 'bad');
  var rule = requiredRuleFor(parsePath(el.getAttribute('data-p')));
  var ok = valid(el.getAttribute('data-re'), el.value) && (!rule || ruleSatisfied(rule));
  cell.classList.add(ok ? 'good' : 'bad');
 }

 /* ================= save ================= */

 function collectOutput() {
  if (!W) return null;
  var out = {};
  Object.keys(W).forEach(function (top) {
   out[top] = normalizeFromScratch(ORIG ? ORIG[top] : undefined, W[top]);
  });
  return out;
 }

 function oneValue(oitem, wv) {
  if (wv === null || wv === undefined) return wv === null ? null : '';
  if (typeof wv === 'object') return wv;
  if (typeof wv === 'boolean') return !!wv;
  if (oitem != null && typeof oitem === 'number') return wv === '' ? '' : Number(wv);
  return String(wv);
 }

 function normalizeFromScratch(orig, w) {
  var res;
  if (Array.isArray(w)) {
   res = [];
   var oarr = Array.isArray(orig) ? orig : [];
   w.forEach(function (item, idx) {
    var oitem = idx < oarr.length ? oarr[idx] : undefined;
    if (item !== null && typeof item === 'object') res.push(normalizeFromScratch(oitem, item));
    else res.push(oneValue(oitem, item));
   });
   return res;
  }
  if (w !== null && typeof w === 'object') {
   res = {};
   Object.keys(w).forEach(function (k) { res[k] = (w[k] !== null && typeof w[k] === 'object') ? normalizeFromScratch(orig ? orig[k] : undefined, w[k]) : oneValue(orig ? orig[k] : undefined, w[k]); });
   return res;
  }
  return oneValue(orig, w);
 }

 async function save() {
  if (!W) { toast('Nothing loaded', 'err'); return; }
  var bad = [];
  $('vd-main').querySelectorAll('.vd-in').forEach(function (cell) {
   var el = cell.querySelector('input,select,textarea');
   if (el && !valid(el.getAttribute('data-re'), el.value)) bad.push(cell);
  });
  if (bad.length) {
   toast('Fix ' + bad.length + ' invalid field(s) first', 'err');
   bad[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
   return;
  }

  var missing = [];
  REQUIRED.forEach(function (rule) { if (!ruleSatisfied(rule)) missing.push(rule.label); });
  if (!arrOk(getByPath(W, REQUIRED_ARRAY_PATH))) missing.push('Owner name');
  if (missing.length) {
   validateAll();
   toast('Required: ' + missing.join(' | '), 'err');
   var t = $('vd-main').querySelector('.vd-in.bad') || $('vd-main').querySelector('.vd-arr.vd-flag');
   if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
   return;
  }

  // var payload = collectOutput();

  // fetch(SAVE_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // })
  //   .then(function (r) { if (!r.ok) return Promise.reject(new Error('HTTP ' + r.status)); return r.json(); })
  //   .then(function (res) {
  //     if (res && res.ok) {
  //       ORIG = deepClone(payload);
  //       W = deepClone(payload);
  //       DIRTY = false;
  //       renderTree();
  //       toast('Saved to vc.da', 'ok');
  //     } else {
  //       toast('Save failed: ' + (res && res.err ? res.err : 'server error'), 'err');
  //     }
  //   })
  //   .catch(function (e) { toast('Save error: ' + e.message, 'err'); });
  try {

   clearPayload0();
   payload0.fn = 104;
   payload0.drml = "sambodhisarang.in";
   payload0.appNm = "vc";
   payload0.prt_stng = collectOutput();

   var response = await fnj3(
    "https://my1.in/2/t.php",
    payload0,
    1,
    true,
    null,
    20000,
    0,
    1,
    1
   );
    await hndlRspo104(response);
  } catch (error) {
   console.error("Error: in Publishing - ", error);
   window.showelsemodal(
    error || "Error: in Publishing"
   );
  }
 }

 window.hndlRspo104 = async function (response) {
  if (response && response.su == 1) {
     window.showsuccessmodal(
     response.ms || "Published Successfully"
    );
   }else {
    window.showelsemodal(
     (response && response.ms) || "Failed to update payments"
    );
   }
  }
 /* ================= actions ================= */

 function resetForm() {
  if (!ORIG) return;
  if (!confirm('Discard current edits and reload from disk?')) return;
  W = deepClone(ORIG);
  DIRTY = false;
  renderTree();
  toast('Reset to saved vc.da', '');
 }

 function toggleJson() {
  var pane = $('vd-jsonpane');
  var show = !pane.classList.contains('show');
  if (show && W) pane.innerHTML = '<pre>' + esc(JSON.stringify(collectOutput(), null, 2)) + '</pre>';
  pane.classList.toggle('show', show);
 }

 /* ================= design preview ================= */

 var previewTimer = null;

 function schedulePreview() {
  if (previewTimer) clearTimeout(previewTimer);
  previewTimer = setTimeout(function () { openPreview(); refreshPreview(); }, 250);
 }

  function previewHtml() {
   var d = collectOutput();
   if (!d) return null;
   var json = JSON.stringify(d).replace(/<\//g, '<\\/');
   var vers = (typeof appVrzns !== 'undefined' && Array.isArray(appVrzns) && appVrzns.length)
    ? appVrzns : [{ a: 'local', b: '' }];
   var vjson = JSON.stringify(vers).replace(/<\//g, '<\\/');
   return '<!doctype html><html lang="en-GB"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<script>window.appVrzns=' + vjson + ';window.__VC_DATA__=' + json + ';<\/script>' +
    '</head><body id="main_body">' +
    '<script src="my1e3.js?v=vc.js&p=' + Date.now() + '"><\/script></body></html>';
  }

 function refreshPreview() {
  var f = $('vd-preview-iframe');
  if (!f || !W) { toast('Nothing to preview', 'err'); return; }
  var html = previewHtml();
  if (!html) { toast('Nothing to preview', 'err'); return; }
  f.srcdoc = html;
 }

 function openPreview() {
  var p = $('vd-preview');
  if (p) p.classList.add('open');
 }

 function closePreview() {
  var p = $('vd-preview');
  if (p) p.classList.remove('open');
 }

 function togglePreview() {
  var p = $('vd-preview');
  if (!p) return;
  if (p.classList.contains('open')) { p.classList.remove('open'); return; }
  openPreview();
  refreshPreview();
 }

 /* ================= map picker ================= */

 var MAP = { addrPath: null, lat: null, lng: null, marker: null, map: null, mode: null };
 var leafletP = null, gmapsP = null;

 function ensureLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (leafletP) return leafletP;
  leafletP = new Promise(function (resolve, reject) {
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
  return leafletP;
 }

 function ensureGoogle() {
  if (window.google && window.google.maps) return Promise.resolve(window.google.maps);
  if (gmapsP) return gmapsP;
  gmapsP = new Promise(function (resolve, reject) {
   window.__vdGmapsReady = function () { resolve(window.google.maps); };
   var s = document.createElement('script');
   s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(GMAPS_KEY) + '&libraries=places&callback=__vdGmapsReady';
   s.onerror = function () { reject(new Error('Google Maps failed to load')); };
   document.head.appendChild(s);
  });
  return gmapsP;
 }

 function openMapPicker(addrPath) {
  MAP.addrPath = addrPath;
  var addr = getByPath(W, addrPath) || {};
  var la = parseFloat(addr.lat), lo = parseFloat(addr.lng);
  if (!isFinite(la) || !isFinite(lo)) { la = 18.5204; lo = 73.8567; }
  $('vd-mapres').innerHTML = '';
  $('vd-mapres')._data = [];
  $('vd-mapsearch').value = '';
  $('vd-mapmodal').classList.add('show');
  updateCoordReadout(la, lo);
  initMap(la, lo);
 }

 function closeMapPicker() {
  var m = $('vd-mapmodal');
  if (m) m.classList.remove('show');
 }

 function updateCoordReadout(la, lo) {
  MAP.lat = la; MAP.lng = lo;
  $('vd-mapco').textContent = la.toFixed(6) + ', ' + lo.toFixed(6);
 }

 function initMap(la, lo) {
  if (typeof GMAPS_KEY === 'string' && GMAPS_KEY.length) {
   ensureGoogle().then(function () { buildGoogleMap(la, lo); })
    .catch(function (e) { toast('Google Maps: ' + e.message + ' — using OpenStreetMap', 'err'); buildLeafletMap(la, lo, true); });
  } else {
   buildLeafletMap(la, lo);
  }
 }

 function buildLeafletMap(la, lo, forceNew) {
  ensureLeaflet().then(function (L) {
   if (MAP.mode !== 'leaflet' || !MAP.map || forceNew) {
    MAP.map = L.map('vd-map', { zoomControl: true }).setView([la, lo], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 19, attribution: '© OpenStreetMap contributors'
    }).addTo(MAP.map);
    MAP.map.on('click', function (e) { setMapPoint(e.latlng.lat, e.latlng.lng, false); });
    MAP.marker = L.marker([la, lo], { draggable: true }).addTo(MAP.map);
    MAP.marker.on('dragend', function () { var p = MAP.marker.getLatLng(); setMapPoint(p.lat, p.lng, false); });
    MAP.mode = 'leaflet';
   } else {
    MAP.map.setView([la, lo], MAP.map.getZoom() || 15);
    MAP.marker.setLatLng([la, lo]);
   }
   setTimeout(function () { if (MAP.map && MAP.map.invalidateSize) MAP.map.invalidateSize(); }, 80);
  }).catch(function (e) { toast('Map load failed: ' + e.message, 'err'); });
 }

 function buildGoogleMap(la, lo) {
  var g = window.google.maps;
  var center = { lat: la, lng: lo };
  if (MAP.mode !== 'google' || !MAP.map) {
   MAP.map = new g.Map($('vd-map'), { center: center, zoom: 15, mapTypeControl: false, streetViewControl: false });
   MAP.marker = new g.Marker({ position: center, map: MAP.map, draggable: true });
   MAP.map.addListener('click', function (e) { setMapPoint(e.latLng.lat(), e.latLng.lng(), false); });
   MAP.marker.addListener('dragend', function () {
    var p = MAP.marker.getPosition(); setMapPoint(p.lat(), p.lng(), false);
   });
   MAP.mode = 'google';
  } else {
   MAP.map.setCenter(center);
   MAP.marker.setPosition(center);
  }
 }

 function setMapPoint(la, lo, pan) {
  la = Number(la); lo = Number(lo);
  if (!isFinite(la) || !isFinite(lo)) return;
  updateCoordReadout(la, lo);
  if (MAP.mode === 'leaflet' && MAP.marker) {
   MAP.marker.setLatLng([la, lo]);
   if (pan && MAP.map) MAP.map.setView([la, lo], MAP.map.getZoom() || 15);
  } else if (MAP.mode === 'google' && MAP.marker) {
   MAP.marker.setPosition({ lat: la, lng: lo });
   if (pan && MAP.map) { MAP.map.setZoom(MAP.map.getZoom() || 15); MAP.map.panTo({ lat: la, lng: lo }); }
  }
 }

 function mapFind() {
  var q = ($('vd-mapsearch').value || '').trim();
  if (!q) { toast('Enter a search term', 'err'); return; }
  var res = $('vd-mapres');
  res.textContent = 'Searching…';
  fetch(NOMINATIM + '/search?format=jsonv2&limit=5&q=' + encodeURIComponent(q))
   .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
   .then(function (list) {
    if (!list || !list.length) { res.textContent = 'No results'; return; }
    res._data = list;
    res.innerHTML = list.map(function (it, i) {
     return '<div data-i="' + i + '">' + esc(it.display_name || '') + '</div>';
    }).join('');
   })
   .catch(function (e) { res.textContent = 'Search failed: ' + e.message; });
 }

 function mapGps() {
  if (!navigator.geolocation) { toast('Geolocation not supported', 'err'); return; }
  toast('Getting your location…', '');
  navigator.geolocation.getCurrentPosition(function (p) {
   setMapPoint(p.coords.latitude, p.coords.longitude, true);
   toast('Location captured', 'ok');
  }, function (e) {
   toast('Location failed: ' + (e.message || 'permission denied'), 'err');
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
 }

 function parseMapsUrl(s) {
  s = String(s || '');
  var m = s.match(/@(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  m = s.match(/[?&](?:q|query|ll|center|destination)=(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/i);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  m = s.match(/!3d(-?\d{1,3}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  m = s.match(/(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  return null;
 }

 function mapPaste() {
  var raw = window.prompt('Paste a Google Maps link (or "lat,lng"):');
  if (!raw) return;
  var c = parseMapsUrl(raw);
  if (!c) { toast('No coordinates found in that link', 'err'); return; }
  setMapPoint(c.lat, c.lng, true);
  toast('Coordinates captured', 'ok');
 }

 function assignIfEmpty(obj, key, val) {
  if (val == null || String(val).trim() === '') return;
  if (!(key in obj)) return;
  if (String(obj[key] == null ? '' : obj[key]).trim() === '') obj[key] = String(val);
 }

 function reverseFill(addr, la, lo) {
  return fetch(NOMINATIM + '/reverse?format=jsonv2&addressdetails=1&lat=' + la + '&lon=' + lo)
   .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
   .then(function (d) {
    var a = (d && d.address) || {};
    assignIfEmpty(addr, 'line1', [a.house_number, a.road || a.pedestrian || a.footway || a.path].filter(Boolean).join(' '));
    assignIfEmpty(addr, 'line2', a.suburb || a.neighbourhood || a.hamlet || a.city_district);
    assignIfEmpty(addr, 'city', a.city || a.town || a.village || a.municipality || a.county);
    assignIfEmpty(addr, 'state', a.state || a.state_district);
    assignIfEmpty(addr, 'pin', a.postcode);
    assignIfEmpty(addr, 'country', a.country);
   });
 }

 function applyMapPicker() {
  if (!MAP.addrPath || !W) { closeMapPicker(); return; }
  var la = MAP.lat, lo = MAP.lng;
  if (!isFinite(la) || !isFinite(lo)) { toast('No coordinates selected', 'err'); return; }
  var addr = getByPath(W, MAP.addrPath) || {};
  setByPath(W, MAP.addrPath.concat(['lat']), String(la));
  setByPath(W, MAP.addrPath.concat(['lng']), String(lo));
  if (W.onlinePresence) {
   W.onlinePresence.googleMaps = 'https://www.google.com/maps/search/?api=1&query=' + la + ',' + lo;
  }
  DIRTY = true;
  closeMapPicker();
  renderTree();
  toast('Coordinates applied', 'ok');
  reverseFill(addr, la, lo).then(function () {
   renderTree();
   toast('Coordinates + address applied', 'ok');
  }).catch(function () {
   toast('Coordinates applied (address lookup skipped)', '');
  });
 }

 function wireMapPicker() {
  $('vd-mapclose').addEventListener('click', closeMapPicker);
  $('vd-mapcancel').addEventListener('click', closeMapPicker);
  $('vd-mapapply').addEventListener('click', applyMapPicker);
  $('vd-mapfind').addEventListener('click', mapFind);
  $('vd-mapgps').addEventListener('click', mapGps);
  $('vd-mappaste').addEventListener('click', mapPaste);
  $('vd-mapsearch').addEventListener('keydown', function (e) {
   if (e.key === 'Enter') { e.preventDefault(); mapFind(); }
  });
  $('vd-mapres').addEventListener('click', function (e) {
   var d = e.target.closest ? e.target.closest('div[data-i]') : null;
   if (!d) return;
   var list = this._data || [];
   var it = list[parseInt(d.getAttribute('data-i'), 10)];
   if (it) setMapPoint(parseFloat(it.lat), parseFloat(it.lon), true);
  });
  $('vd-mapmodal').addEventListener('click', function (e) {
   if (e.target === this) closeMapPicker();
  });
  document.addEventListener('keydown', function (e) {
   if (e.key === 'Escape' && $('vd-mapmodal') && $('vd-mapmodal').classList.contains('show')) closeMapPicker();
  });
 }
  window.openAdminFromMenu = function (action) {
if(action && action == 'save')
 save();
}

 /* ================= boot ================= */

 function boot() {
  if (window.__vdEditorBooted) return;
  window.__vdEditorBooted = true;
  installShell();
  wireMapPicker();
  $('vd-save').addEventListener('click', save);
  $('vd-reset').addEventListener('click', resetForm);
  $('vd-refresh').addEventListener('click', function () { loadDa(); });
  $('vd-togglejson').addEventListener('click', toggleJson);
  $('vd-prevbtn').addEventListener('click', togglePreview);
  $('vd-premessbtn').addEventListener('click', function () { (async () => { await loadExe2Fn(4, ['dv_to_set_open_my1ctr_processed', 0, 1, 2], [1]); })(); });
  $('vd-prevrefresh').addEventListener('click', refreshPreview);
  $('vd-prevclose').addEventListener('click', closePreview);
  $('vd-close').addEventListener('click', function () { location.reload(); });
  window.setInterval(function () { if (DIRTY) $('vd-state').textContent = 'unsaved changes'; }, 500);
  loadDa();
 }

 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
 else boot();
})();