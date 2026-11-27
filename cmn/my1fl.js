(function () {
 'use strict';

 // ---------------------------------------------------------------- utilities

 function formatSize(bytes) {
  var b = Number(bytes);
  if (!isFinite(b) || b <= 0) return '0 B';
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  if (b < 1024 * 1024 * 1024) return (b / (1024 * 1024)).toFixed(2) + ' MB';
  return (b / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
 }

 function extOf(name) {
  var s = String(name == null ? '' : name);
  var i = s.lastIndexOf('.');
  if (i < 0 || i === s.length - 1) return '';
  return s.slice(i + 1).toLowerCase();
 }

 function escapeHtml(s) {
  return String(s == null ? '' : s)
   .replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;');
 }

 function isRenderableId(v) {
  return /^[A-Za-z0-9_-]{20,}$/.test(String(v == null ? '' : v).trim());
 }

 // ---------------------------------------------------------------- icons (inline SVG)

 var SVG_OPEN = '<svg class="my1gal-svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" '
  + 'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" '
  + 'aria-hidden="true" focusable="false">';

 var ICON_PATHS = {
  upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m21 15-5-5L5 20"/>',
  video: '<rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 9 4-2v10l-4-2z"/>',
  audio: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  pdf: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8 13h8"/><path d="M8 16h5"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8 13h8M8 16h8"/>',
  sheet: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/>',
  slides: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M8 9h6M8 12h4"/>',
  zip: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M10 3v4M12 7v4M10 11v4"/>',
  text: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8 13h8M8 16h6"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  open: '<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  remove: '<path d="M6 6l12 12M18 6 6 18"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4"/><path d="M12 17h.01"/>'
 };

 function svgIcon(kind) {
  return SVG_OPEN + (ICON_PATHS[kind] || ICON_PATHS.file) + '</svg>';
 }

 // extension -> icon kind
 var EXT_KIND = {
  mp3: 'audio', amr: 'audio', wav: 'audio', m4a: 'audio', aac: 'audio', ogg: 'audio', flac: 'audio', wma: 'audio',
  mp4: 'video', mkv: 'video', avi: 'video', mov: 'video', wmv: 'video', webm: 'video', flv: 'video', m4v: 'video', mpeg: 'video', mpg: 'video', '3gp': 'video',
  png: 'image', jpg: 'image', jpeg: 'image', webp: 'image', gif: 'image', bmp: 'image', svg: 'image', heic: 'image',
  doc: 'doc', docx: 'doc', odt: 'doc', rtf: 'doc',
  xls: 'sheet', xlsx: 'sheet', csv: 'sheet', ods: 'sheet',
  ppt: 'slides', pptx: 'slides', odp: 'slides',
  pdf: 'pdf',
  zip: 'zip', rar: 'zip', '7z': 'zip', tar: 'zip', gz: 'zip',
  txt: 'text', md: 'text', log: 'text'
 };

 function kindForExt(ext) {
  return EXT_KIND[String(ext || '').toLowerCase()] || 'file';
 }

 function isImageExt(ext) { return kindForExt(ext) === 'image'; }

 // ---------------------------------------------------------------- styling (tokens)

 function ensureStyles() {
  if (document.getElementById('my1gal-style')) return;
  var css = (typeof window.appcss === 'string' ? window.appcss : '') +
   // Tokens: neutral defaults, scoped with :where() (zero specificity) so a host
   // page can override any of them with a plain rule. accent is intentionally NOT
   // declared here so it can inherit from the host; usages fall back to currentColor.
   ':where(.my1gal-root){' +
   '--my1gal-bg:#ffffff;--my1gal-fg:#1f2328;--my1gal-muted:rgba(0,0,0,.55);' +
   '--my1gal-border:rgba(0,0,0,.15);--my1gal-surface-2:rgba(0,0,0,.045);' +
   '--my1gal-radius:10px;--my1gal-danger:#c0392b;--my1gal-success:#1a7f37;--my1gal-scrim:rgba(255,255,255,.78);' +
   '--my1gal-shadow:0 12px 40px rgba(0,0,0,.22);}' +
   '@media (prefers-color-scheme: dark){:where(.my1gal-root){' +
   '--my1gal-bg:#1e1e1e;--my1gal-fg:#e8e8e8;--my1gal-muted:rgba(255,255,255,.6);' +
   '--my1gal-border:rgba(184, 231, 253, 0.81);--my1gal-surface-2:rgba(255,255,255,.06);' +
   '--my1gal-danger:#ff6b6b;--my1gal-scrim:rgba(30,30,30,.78);' +
   '--my1gal-shadow:0 12px 40px rgba(0,0,0,.55);}}' +
   '.my1gal-root,.my1gal-root *{box-sizing:border-box;}' +
   '.my1gal-root{font:inherit;color:var(--my1gal-fg);}' +
   '.my1gal-svg{display:inline-block;vertical-align:-.125em;}' +
   '.my1gal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483640;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.5);overflow:auto;}' +
   '.my1gal-dialog{position:relative;width:100%;max-width:640px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;background:var(--my1gal-bg);color:var(--my1gal-fg);border:1px solid var(--my1gal-border);border-radius:var(--my1gal-radius);box-shadow:var(--my1gal-shadow);}' +
   '.my1gal-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--my1gal-border);}' +
   '.my1gal-title{display:flex;align-items:center;gap:8px;font-size:1rem;font-weight:600;margin:0;}' +
   '.my1gal-x{border:none;background:transparent;color:var(--my1gal-muted);cursor:pointer;font-size:18px;line-height:1;padding:6px;border-radius:8px;display:inline-flex;}' +
   '.my1gal-x:hover{background:var(--my1gal-surface-2);color:var(--my1gal-fg);}' +
   '.my1gal-body{padding:16px;overflow-y:auto;}' +
   '.my1gal-footer{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--my1gal-border);}' +
   '.my1gal-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--my1gal-border);background:transparent;color:inherit;padding:8px 14px;border-radius:calc(var(--my1gal-radius) - 2px);cursor:pointer;font:inherit;font-size:.85rem;line-height:1;}' +
   '.my1gal-btn:hover{background:var(--my1gal-surface-2);}' +
   '.my1gal-btn-primary{border-color:var(--my1gal-accent,currentColor);color:var(--my1gal-accent,currentColor);}' +
   '.my1gal-btn-success{border-color:var(--my1gal-success,#1a7f37);color:var(--my1gal-success,#1a7f37);}' +
   '.my1gal-btn-success:hover{background:var(--my1gal-success,#1a7f37);color:#fff;}' +
   '.my1gal-dropzone{ margin-top:16px; border:2px dashed var(--my1gal-border);border-radius:var(--my1gal-radius);padding:22px 14px;text-align:center;cursor:pointer;transition:border-color .18s ease,background .18s ease;background:var(--my1gal-surface-2);}' +
   '.my1gal-dropzone:hover,.my1gal-dropzone.my1gal-drag{border-color:var(--my1gal-accent,currentColor);}' +
   '.my1gal-hint{font-size:.78rem;margin:8px 0 0;color:var(--my1gal-muted);}' +
   '.my1gal-limit{font-size:.72rem;margin-top:4px;color:var(--my1gal-muted);}' +
   '.my1gal-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;margin-top:14px;}' +
   '.my1gal-card{position:relative;display:flex;align-items:center;gap:10px;border:1px solid var(--my1gal-border);border-radius:var(--my1gal-radius);padding:10px;background:var(--my1gal-bg);min-height:64px;}' +
   '.my1gal-close{position:absolute;top:4px;right:4px;border:none;background:transparent;color:var(--my1gal-muted);cursor:pointer;padding:2px 4px;border-radius:4px;font-size:12px;line-height:1;display:inline-flex;}' +
   '.my1gal-close:hover{color:var(--my1gal-fg);background:var(--my1gal-surface-2);}' +
   '.my1gal-thumb{width:46px;height:46px;flex:0 0 46px;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--my1gal-surface-2);color:var(--my1gal-accent,currentColor);font-size:22px;}' +
   '.my1gal-thumb img{width:100%;height:100%;object-fit:cover;display:block;}' +
   '.my1gal-meta{min-width:0;flex:1 1 auto;}' +
   '.my1gal-name{font-size:.82rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
   '.my1gal-sub{font-size:.7rem;color:var(--my1gal-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
   '.my1gal-actions{display:flex;gap:2px;flex:0 0 auto;}' +
   '.my1gal-actions button{border:none;background:transparent;color:var(--my1gal-muted);cursor:pointer;padding:5px 6px;border-radius:6px;font-size:14px;display:inline-flex;}' +
   '.my1gal-actions button:hover{color:var(--my1gal-fg);background:var(--my1gal-surface-2);}' +
   '.my1gal-empty{text-align:center;color:var(--my1gal-muted);font-size:.82rem;padding:16px 0;}' +
   '.my1gal-card.my1gal-uploading .my1gal-meta{opacity:.6;}' +
   '.my1gal-status{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:8px;font-size:.75rem;background:var(--my1gal-scrim);border-radius:var(--my1gal-radius);}' +
   '.my1gal-card.my1gal-error{border-color:var(--my1gal-danger);}' +
   '.my1gal-card.my1gal-error .my1gal-status{color:var(--my1gal-danger);cursor:pointer;}' +
   '@keyframes my1galSpin{to{transform:rotate(360deg);}}' +
   '.my1gal-spin{width:16px;height:16px;border:2px solid var(--my1gal-border);border-top-color:var(--my1gal-accent,currentColor);border-radius:50%;animation:my1galSpin .7s linear infinite;}' +
   '.my1gal-root :focus-visible{outline:2px solid var(--my1gal-accent,currentColor);outline-offset:2px;}';
  var el = document.createElement('style');
  el.id = 'my1gal-style';
  el.textContent = css;
  document.head.appendChild(el);
 }
 // ---------------------------------------------------------------- messaging

 function notify(type, msg) {
  try {
   if (type === 'ok' && typeof window.showsuccessmodal === 'function') { window.showsuccessmodal(msg); return; }
   if (type !== 'ok' && typeof window.showelsemodal === 'function') { window.showelsemodal(msg); return; }
  } catch (e) { }
  // neutral, framework-free fallback
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:flex-start;justify-content:center;background:rgba(0,0,0,.5);z-index:2147483640;';
  var box = document.createElement('div');
  box.style.cssText = 'background:#fff;color:#1f2328;border-radius:8px;margin-top:18vh;max-width:360px;width:88%;padding:18px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.25);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;';
  box.innerHTML = '<p style="margin:0 0 12px;font-size:14px;color:' + (type === 'ok' ? '#1a7f37' : '#c0392b') + '">' + escapeHtml(msg) + '</p>';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'OK';
  btn.style.cssText = 'border:1px solid rgba(0,0,0,.2);background:transparent;padding:6px 16px;border-radius:6px;cursor:pointer;font:inherit;font-size:13px;';
  btn.onclick = function () { if (ov.parentNode) ov.parentNode.removeChild(ov); };
  box.appendChild(btn);
  ov.appendChild(box);
  ov.onclick = function (e) { if (e.target === ov && ov.parentNode) ov.parentNode.removeChild(ov); };
  document.body.appendChild(ov);
 }

 function copyText(text) {
  try {
   if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
    return true;
   }
  } catch (e) { }
  try {
   var ta = document.createElement('textarea');
   ta.value = text;
   ta.style.cssText = 'position:fixed;opacity:0';
   document.body.appendChild(ta);
   ta.select();
   document.execCommand('copy');
   document.body.removeChild(ta);
   return true;
  } catch (e2) { return false; }
 }

 // ---------------------------------------------------------------- gallery

 var DEFAULT_LABELS = {
  browse: 'Browse more files',
  drop: 'or drag & drop files here',
  uploading: 'Uploading…',
  failed: 'Upload failed. Tap to retry.',
  tooBig: 'File is larger than the allowed size',
  remove: 'Remove',
  copy: 'Copy ID',
  open: 'Open',
  retry: 'Retry',
  empty: 'No files yet',
  close: 'Close'
 };

 // drml is an app hint for the server; read it only when a host provides it.
 function resolveDrml(explicit) {
  if (explicit != null && explicit !== '') return explicit;
  try {
   var P = (typeof window.my1uzr !== 'undefined' && window.my1uzr && window.my1uzr.worknOnPg)
    ? window[window.my1uzr.worknOnPg] : null;
   if (P && P.clientConfig && P.clientConfig.drml) return P.clientConfig.drml;
  } catch (e) { }
  return '';
 }

 function fieldEl(fieldId) {
  if (!fieldId) return null;
  return document.getElementById(fieldId) ||
   document.querySelector('[name="' + fieldId + '"]') ||
   document.querySelector('[data-name="' + fieldId + '"]');
 }

 // Generic, injectable URL resolution. No backend is assumed; host helpers are
 // consulted only if they happen to exist.
 function resolveThumb(it, cfg) {
  if (typeof cfg.thumbUrl === 'function') {
   try { var u = cfg.thumbUrl(it); if (u) return u; } catch (e) { }
  }
  if (it.url && /^https?:\/\//i.test(it.url) && isImageExt(it.ext)) return it.url;
  if (it.id && typeof window.getGoogleDriveImageUrl === 'function' && isRenderableId(it.id)) {
   try { return window.getGoogleDriveImageUrl(it.id, false); } catch (e2) { }
  }
  return null;
 }

 function resolveOpen(it, cfg) {
  if (typeof cfg.openUrl === 'function') {
   try { var u = cfg.openUrl(it); if (u) return u; } catch (e) { }
  }
  if (it.url && /^(https?:|blob:|data:)/i.test(it.url)) return it.url;
  if (it.id && /^(https?:|blob:|data:)/i.test(it.id)) return it.id;
  return null;
 }

 window.open_my1fileFn = function (_getFilesFN,opts) {
  // Allow open_my1fileFn(opts) as well as open_my1fileFn(callback, opts).
  if (_getFilesFN && typeof _getFilesFN === 'object' && !Array.isArray(_getFilesFN) && (opts == null)) {
   opts = _getFilesFN;
   _getFilesFN = null;
  }
  if (typeof opts === 'string') opts = { accept: opts };
  opts = opts || {};
  function resolveFilesCallback() {
   var fn = (typeof _getFilesFN === 'function') ? _getFilesFN
    : (typeof _getFilesFN === 'string') ? window[_getFilesFN] : null;
   return (typeof fn === 'function') ? fn : null;
  }
  var getFilesCallback = resolveFilesCallback();
  var callbackWarned = false;
  function ensureFilesCallback() {
   getFilesCallback = resolveFilesCallback();
   if (!getFilesCallback) {
    if (!callbackWarned) {
     callbackWarned = true;
     notify('err', 'Upload callback function not found');
    }
    return false;
   }
   callbackWarned = false;
   return true;
  }
  // Convert a comma-separated extension list (e.g. "pdf,docx") into an accept attribute.
  if (opts.accept && opts.accept !== '*' && String(opts.accept).indexOf('.') === -1 && String(opts.accept).indexOf('/') === -1) {
   opts.accept = String(opts.accept).split(',').map(function (e) { e = e.trim(); return e ? ('.' + e.replace(/^\.+/, '')) : ''; }).filter(Boolean).join(',');
   if (!opts.accept) opts.accept = '*';
  }
  ensureStyles();

  var useBs = !!opts.useBootstrapModal && typeof window.bootstrap !== 'undefined'
   && window.bootstrap && window.bootstrap.Modal;

  // ---- resolve upload config (size/count) from .da (cust_da_const.user_upload_config) ----
  function parseSizeToBytes(v, fallback) {
   if (v == null || v === '') return fallback;
   if (typeof v === 'number' && isFinite(v) && v > 0) return Math.round(v * 1024 * 1024);
   var m = String(v).trim().match(/^(\\d+(?:\\.\\d+)?)\\s*(b|kb|mb|gb)?$/i);
   if (!m) return fallback;
   var n = parseFloat(m[1]);
   if (!isFinite(n) || n <= 0) return fallback;
   var unit = (m[2] || '').toLowerCase();
   // bare number (no unit) is treated as MB
   var mult = unit === 'gb' ? 1024*1024*1024 : unit === 'mb' ? 1024*1024 : unit === 'kb' ? 1024 : unit === 'b' ? 1 : 1024*1024;
   return Math.round(n * mult);
  }
  function getUploadConfig() {
   var uc = {};
   try {
    var state = (window.my1uzr && window.my1uzr.worknOnPg) ? window[window.my1uzr.worknOnPg] : null;
    var cc = (state && state.clientConfig) ? state.clientConfig : (window.clientConfig || {});
    var daConst = (cc.cust_da_const && typeof cc.cust_da_const === 'object') ? cc.cust_da_const : cc;
    uc = (daConst.my1fl_config && typeof daConst.my1fl_config === 'object') ? daConst.my1fl_config : {};
   } catch (e) { }
   var size = parseSizeToBytes(uc.size || uc.maxSize || uc.maxBytes, 25 * 1024 * 1024);
   var countRaw = uc.cn != null ? uc.cn : (uc.cunt != null ? uc.cunt : (uc.count != null ? uc.count : (uc.maxFiles != null ? uc.maxFiles : 1)));
   var count = parseInt(countRaw, 10);
   if (!isFinite(count) || count <= 0) count = 1;
   return { size: size, count: count };
  }
  function my1Endpoint(file) {
   var path = location.pathname;
   var last = path.split('/').pop();
   if (last && /\\.[a-z0-9]+$/i.test(last)) {
    path = path.slice(0, path.length - last.length);
   } else if (!path.endsWith('/')) {
    path = path + '/';
   }
   var host = location.hostname;
   var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' ||
    host === '::1' || host.endsWith('.local') ||
    /^192\\.168\\./.test(host) || /^10\\./.test(host) ||
    /^172\\.(1[6-9]|2\\d|3[01])\\./.test(host);
   var origin = isLocal ? 'https://my1.in' : location.origin;
   return origin + path + file;
  }
  var _upCfg = getUploadConfig();
  var cfg = {
   endpoint: opts.endpoint || my1Endpoint('1.php'),
   fn: 128,
   fi: 0,//(opts.vw != null ? opts.vw : 4),
   drml: resolveDrml(opts.drml),
   folderId: opts.folderId || null,
   maxSize: (opts.maxSize != null ? Number(opts.maxSize) : _upCfg.size),
   maxFiles: (opts.maxFiles != null ? Number(opts.maxFiles) : _upCfg.count),
   accept: opts.accept || '*',
   multiple: opts.multiple !== false,
   fieldId: opts.fieldId || null,
   callback: (typeof opts.callback === 'function') ? opts.callback : null,
   title: opts.title || 'Upload Files',
   accent: opts.accent || null,
   theme: opts.theme || null,
   iconMap: opts.iconMap || null,
   renderIcon: (typeof opts.renderIcon === 'function') ? opts.renderIcon : null,
   thumbUrl: (typeof opts.thumbUrl === 'function') ? opts.thumbUrl : null,
   openUrl: (typeof opts.openUrl === 'function') ? opts.openUrl : null,
   timeout: opts.timeout || 60000,
   loginRequired: opts.loginRequired != null ? opts.loginRequired : 1,
   labels: Object.assign({}, DEFAULT_LABELS, opts.labels || {}),
   useBootstrapModal: !!useBs
  };

  // Hard allowlist derived from a simple comma-separated extension list such as
  // "pdf,docx" (already normalised to ".pdf,.docx" above). Empty => allow all.
  cfg.allowedExts = [];
  if (cfg.accept && cfg.accept !== '*' && String(cfg.accept).indexOf('/') === -1) {
   var _parts = String(cfg.accept).split(',');
   var _allExt = true;
   var _exts = [];
   _parts.forEach(function (p) {
    p = String(p || '').trim();
    if (!p) return;
    if (!/^\.[A-Za-z0-9]+$/.test(p)) { _allExt = false; return; }
    _exts.push(p.slice(1).toLowerCase());
   });
   if (_allExt && _exts.length) cfg.allowedExts = _exts;
  }

  function fileAllowed(file) {
   if (!cfg.allowedExts.length) return true;
   var ext = extOf(file && file.name).toLowerCase();
   return cfg.allowedExts.indexOf(ext) !== -1;
  }

  var items = [];
  var batchResults = [];
  var batchPending = 0;

  function collectUploadedResults() {
   if (Array.isArray(batchResults) && batchResults.length) return batchResults.slice();
   return items.filter(function (it) { return it && it.id; }).map(function (it) {
    return {
     su: 1,
     id: it.id,
     file_id: it.id,
     name: it.name,
     file_name: it.name,
     mime: it.mime,
     size: it.size,
     ext: it.ext,
     url: it.url
    };
   });
  }

  function completeBatchPending() {
   if (batchPending > 0) batchPending--;
  }
  (Array.isArray(opts.existing) ? opts.existing : []).forEach(function (it) {
   if (!it) return;
   var name = it.name || it.n || '';
   items.push({
    id: it.id || it.g1 || '',
    name: name,
    mime: it.mime || it.type || '',
    size: it.size != null ? it.size : 0,
    ext: it.ext || extOf(name),
    url: it.url || ''
   });
  });

  // remove any previous instance
  var prev = document.getElementById('my1gal-overlay');
  if (prev) {
   try { if (useBs) { var pm = window.bootstrap.Modal.getInstance(prev); if (pm) pm.dispose(); } } catch (e) { }
   prev.remove();
  }

  function iconFor(it) {
   var kind = kindForExt(it.ext);
   if (cfg.renderIcon) {
    try {
     var h = cfg.renderIcon(kind, it);
     if (h) return h;
    } catch (e) { }
   }
   if (cfg.iconMap && cfg.iconMap[kind]) return cfg.iconMap[kind];
   return svgIcon(kind);
  }

  var limitText = cfg.maxSize > 0 ? ('Max ' + formatSize(cfg.maxSize) + ' per file') : '';

  var inner =
   '<div class="my1gal-header">' +
   '<h5 class="my1gal-title">' + svgIcon('upload') + '<span>' + escapeHtml(cfg.title) + '</span></h5>' +
   '<button type="button" class="my1gal-x" data-act="close" aria-label="Close">' + svgIcon('remove') + '</button>' +
   '</div>' +
   '<div class="my1gal-body">' +
   '<input type="file" id="my1gal-input" style="display:none" accept="' + escapeHtml(cfg.accept) + '"' + (cfg.multiple ? ' multiple' : '') + '>' +
   '<div class="my1gal-grid" id="my1gal-grid"></div>' +
   '<div class="my1gal-empty" id="my1gal-empty">' + escapeHtml(cfg.labels.empty) + '</div>' +
   '<div class="my1gal-dropzone" id="my1gal-dropzone">' +
   '<button type="button" class="my1gal-btn my1gal-btn-primary" id="my1gal-browse">' + svgIcon('folder') + '<span>' + escapeHtml(cfg.labels.browse) + '</span></button>' +
   '<p class="my1gal-hint">' + escapeHtml(cfg.labels.drop) + '</p>' +
   '<div class="my1gal-limit">' + escapeHtml(limitText) + '</div>' +
   '</div>' +
   '</div>' +
   '<div class="my1gal-footer">' +
   //'<button type="button" class="my1gal-btn" data-act="close">' + escapeHtml(cfg.labels.close) + '</button>' +
   '<button type="button" class="my1gal-btn my1gal-btn-success" data-act="upload-files">' + escapeHtml('Upload') + '</button>' +
   '<button type="button" class="my1gal-btn my1gal-btn-primary" data-act="use-files">' + escapeHtml('Use this files') + '</button>' +
   '</div>';

  var html;
  if (useBs) {
   html = '<div class="modal fade my1gal-root" id="my1gal-overlay" tabindex="-1" role="dialog" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">' +
    '<div class="modal-content my1gal-dialog">' + inner + '</div>' +
    '</div></div>';
  } else {
   html = '<div class="my1gal-overlay my1gal-root" id="my1gal-overlay" role="dialog" aria-modal="true" aria-label="' + escapeHtml(cfg.title) + '">' +
    '<div class="my1gal-dialog">' + inner + '</div></div>';
  }

  document.body.insertAdjacentHTML('beforeend', html);

  var overlayEl = document.getElementById('my1gal-overlay');
  var gridEl = document.getElementById('my1gal-grid');
  var emptyEl = document.getElementById('my1gal-empty');
  var inputEl = document.getElementById('my1gal-input');
  var dzEl = document.getElementById('my1gal-dropzone');

  // Apply accent + theme as inline custom props on the overlay (wins over the
  // :where() defaults, so hosts can override without !important).
  if (cfg.accent) overlayEl.style.setProperty('--my1gal-accent', cfg.accent);
  if (cfg.theme) {
   Object.keys(cfg.theme).forEach(function (k) {
    if (cfg.theme[k] == null) return;
    var name = (k.indexOf('--') === 0) ? k : ('--my1gal-' + k);
    overlayEl.style.setProperty(name, String(cfg.theme[k]));
   });
  }

  // ---- open/close ----
  var bsModal = null;
  var keyHandler = null;
  var prevOverflow = '';

  function close() {
   if (cfg.useBootstrapModal && bsModal) { bsModal.hide(); return; }
   cleanup();
  }

  function cleanup() {
   if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
   try { document.body.style.overflow = prevOverflow || ''; } catch (e) { }
   if (overlayEl && overlayEl.parentNode) overlayEl.parentNode.removeChild(overlayEl);
  }

  if (cfg.useBootstrapModal) {
   bsModal = new window.bootstrap.Modal(overlayEl, { backdrop: true, keyboard: true });
   bsModal.show();
   overlayEl.addEventListener('hidden.bs.modal', function () {
    try { bsModal.dispose(); } catch (e) { }
    if (overlayEl.parentNode) overlayEl.parentNode.removeChild(overlayEl);
   });
  } else {
   prevOverflow = document.body.style.overflow;
   document.body.style.overflow = 'hidden';
   overlayEl.addEventListener('click', function (e) { if (e.target === overlayEl) close(); });
   keyHandler = function (e) { if (e.key === 'Escape' || e.keyCode === 27) close(); };
   document.addEventListener('keydown', keyHandler);
   setTimeout(function () {
    var b = document.getElementById('my1gal-browse');
    if (b) { try { b.focus(); } catch (e) { } }
   }, 30);
  }

  // ---- rendering ----
  function cardHTML(it, idx) {
   var ext = it.ext || extOf(it.name);
   var thumbUrl = (!it.status || it.status !== 'error') ? resolveThumb(it, cfg) : null;
   var thumb = (thumbUrl && isImageExt(ext))
    ? '<img src="' + escapeHtml(thumbUrl) + '" alt="" loading="lazy">'
    : iconFor(it);
   var sub = (ext ? ext.toUpperCase() : 'FILE') + (it.size ? ' · ' + formatSize(it.size) : '');
   var statusHTML = '';
   var cardCls = 'my1gal-card';
   if (it.status === 'uploading') {
    cardCls += ' my1gal-uploading';
    statusHTML = '<div class="my1gal-status"><span class="my1gal-spin"></span> ' + escapeHtml(cfg.labels.uploading) + '</div>';
   } else if (it.status === 'error') {
    cardCls += ' my1gal-error';
    statusHTML = '<div class="my1gal-status" title="' + escapeHtml(it.error || cfg.labels.retry) + '">' + svgIcon('alert') + ' ' + escapeHtml(cfg.labels.retry) + '</div>';
   }
   var openable = !!resolveOpen(it, cfg);
   return '<div class="' + cardCls + '" data-idx="' + idx + '">' +
    '<button type="button" class="my1gal-close" data-act="remove" title="' + escapeHtml(cfg.labels.remove) + '">&times;</button>' +
    '<div class="my1gal-thumb">' + thumb + '</div>' +
    '<div class="my1gal-meta">' +
    '<div class="my1gal-name" title="' + escapeHtml(it.name) + '">' + escapeHtml(it.name || 'file') + '</div>' +
    '<div class="my1gal-sub">' + escapeHtml(sub) + (it.id ? ' · <span title="' + escapeHtml(it.id) + '">' + escapeHtml(String(it.id).slice(0, 12)) + (String(it.id).length > 12 ? '…' : '') + '</span>' : '') + '</div>' +
    '</div>' +
    '<div class="my1gal-actions">' +
    (openable ? '<button type="button" data-act="open" title="' + escapeHtml(cfg.labels.open) + '">' + svgIcon('open') + '</button>' : '') +
    (it.id ? '<button type="button" data-act="copy" title="' + escapeHtml(cfg.labels.copy) + '">' + svgIcon('copy') + '</button>' : '') +
    '<button type="button" data-act="remove" title="' + escapeHtml(cfg.labels.remove) + '">' + svgIcon('remove') + '</button>' +
    '</div>' +
    statusHTML +
    '</div>';
  }

  function statusRank(it) {
   if (!it) return 4;
   if (it.status === 'uploading') return 0;
   if (it.status === 'pending') return 1;
   if (it.status === 'error') return 2;
   return 3;
  }
  function render() {
   var view = items.map(function (it, i) { return { it: it, i: i }; })
    .sort(function (a, b) { return statusRank(a.it) - statusRank(b.it) || a.i - b.i; });
   gridEl.innerHTML = view.map(function (v) { return cardHTML(v.it, v.i); }).join('');
   emptyEl.style.display = items.length ? 'none' : 'block';
   if (dzEl) dzEl.style.display = (cfg.maxFiles > 0 && items.length >= cfg.maxFiles) ? 'none' : '';
  }

  function persist() {
   var out = items.map(function (it) {
    return { id: it.id, name: it.name, mime: it.mime, size: it.size, ext: it.ext };
   });
   var f = fieldEl(cfg.fieldId);
   if (f) {
    try { f.value = JSON.stringify(out); } catch (e) { }
    try { f.dispatchEvent(new Event('input', { bubbles: true })); } catch (e2) { }
    try { f.dispatchEvent(new Event('change', { bubbles: true })); } catch (e3) { }
   }
   if (cfg.callback) {
    try { cfg.callback(out); } catch (e4) { console.error('my1gal callback error:', e4); }
   }
  }

  // ---- upload (sequential queue) ----
  var queue = [];
  var busy = false;

  function addFile(file) {
   if (!fileAllowed(file)) {
    notify('err', (file && file.name ? file.name + ': ' : '') + 'File type not allowed');
    return;
   }
   if (cfg.maxFiles > 0 && items.length >= cfg.maxFiles) {
    notify('err', 'Maximum ' + cfg.maxFiles + ' files allowed');
    return;
   }
   if (cfg.maxSize > 0 && file.size > cfg.maxSize) {
    notify('err', file.name + ': ' + cfg.labels.tooBig + ' (' + formatSize(file.size) + ' > ' + formatSize(cfg.maxSize) + ')');
    return;
   }
   var idx = items.length;
   items.push({ id: '', name: file.name, mime: file.type || '', size: file.size, ext: extOf(file.name), url: '', status: 'pending', file: file });

   render();
  }

  function pump() {
   if (busy) return;
   var job = queue.shift();
   if (!job) return;
   busy = true;
   uploadOne(job.file, job.idx, function () { busy = false; pump(); });
  }

  function uploadOne(file, idx, done) {
   function finish() {
    completeBatchPending();
    if (done) done();
   }
   if (!ensureFilesCallback()) {
    completeBatchPending();
    if (typeof done === 'function') done();
    return;
   }

   var fd = new FormData();
   fd.append('fn', cfg.fn);
   fd.append('fi', cfg.fi);
   if (cfg.drml) fd.append('drml', cfg.drml);
   if (cfg.folderId) fd.append('folderId', cfg.folderId);
   fd.append('name', file.name);
   fd.append('mime', file.type || '');
   fd.append('size', file.size);
   fd.append('ul', '2/0u.php');
   fd.append('gt', '2');
   fd.append('eo', (window.payload0 && window.payload0.eo) || (window.appOwner && window.appOwner.eo) || '');
   fd.append('ec', (window.payload0 && window.payload0.ec) || (window.appOwner && window.appOwner.ec) || '');
   fd.append('jk', (window.payload0 && window.payload0.jk != null) ? window.payload0.jk : ((window.my1uzr && window.my1uzr.jk != null) ? window.my1uzr.jk : ''));
   fd.append('file', file, file.name);
   if (!fd.get('file')) {
    notify('err', file.name + ': Upload payload is empty');
    completeBatchPending();
    if (typeof done === 'function') done();
    return;
   }

   // Show the common my1e4 loader while the upload request is in progress.
   var _uploadPromise;
   try { _uploadPromise = window.fnf4(cfg.endpoint, fd, cfg.loginRequired, true, null, cfg.timeout, 1, 1); }
   catch (e) { _uploadPromise = Promise.reject(e); }
   _uploadPromise
    .then(function (resp) {
     if (!resp || (resp.su != null && resp.su != 1)) {
      throw new Error((resp && (resp.ms || resp.m)) || 'Server rejected the upload');
     }
     var id = resp.id || resp.g1 || resp.url || resp.d || '';
     var name = resp.name || resp.n || file.name;
     items[idx] = {
      id: id,
      name: name,
      mime: resp.mime || file.type || '',
      size: (resp.size != null ? resp.size : file.size),
      ext: extOf(name),
      url: (resp.url && resp.url !== id) ? resp.url : '',
      status: 'done',
      file: file
     };
     if (getFilesCallback) {
      var _upName = resp.file_name || resp.name || resp.n || file.name;
      var _upId = resp.file_id || resp.id || resp.g1 || resp.url || resp.d || id || '';
      var uploaded = (resp && typeof resp === 'object') ? Object.assign({}, resp) : { response: resp };
      uploaded.file_name = uploaded.file_name || _upName;
      uploaded.file_id = uploaded.file_id || _upId;
      uploaded.name = uploaded.file_name;
      uploaded.id = uploaded.file_id;
      batchResults.push(uploaded);
     }
     render();
     persist();
    })
    .catch(function (err) {
     var raw = (err && err.message) || cfg.labels.failed;
     var msg = raw;
     try {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.ms) msg = parsed.ms;
     } catch (e) { }
     items[idx].status = 'error';
     items[idx].error = msg;
     render();
     try { notify('err', msg); } catch (e2) { }
    })
    .then(finish, finish);
  }

  // ---- events ----
  function browse() {
   if (cfg.maxFiles > 0 && items.length >= cfg.maxFiles) {
    notify('err', 'Maximum ' + cfg.maxFiles + ' files allowed');
    return;
   }
   inputEl.click();
  }

  dzEl.addEventListener('click', function (e) {
   if (e.target.closest('#my1gal-browse') || e.target === dzEl ||
    e.target.classList.contains('my1gal-hint') || e.target.classList.contains('my1gal-limit')) {
    browse();
   }
  });

  inputEl.addEventListener('change', function () {
   var files = Array.prototype.slice.call(this.files || []);
   this.value = '';
   for (var i = 0; i < files.length; i++) {
    if (!fileAllowed(files[i])) {
     notify('err', files[i].name + ': File type not allowed');
     continue;
    }
    if (cfg.maxFiles > 0 && items.length >= cfg.maxFiles) {
     notify('err', 'Maximum ' + cfg.maxFiles + ' files allowed');
     break;
    }
    if (cfg.maxSize > 0 && files[i].size > cfg.maxSize) {
     notify('err', files[i].name + ': ' + cfg.labels.tooBig + ' (' + formatSize(files[i].size) + ' > ' + formatSize(cfg.maxSize) + ')');
     break;
    }
    addFile(files[i]);
   }
  });

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (evt) {
   dzEl.addEventListener(evt, function (e) { e.preventDefault(); e.stopPropagation(); });
  });
  dzEl.addEventListener('dragenter', function () { dzEl.classList.add('my1gal-drag'); });
  dzEl.addEventListener('dragover', function () { dzEl.classList.add('my1gal-drag'); });
  dzEl.addEventListener('dragleave', function () { dzEl.classList.remove('my1gal-drag'); });
  dzEl.addEventListener('drop', function (e) {
   dzEl.classList.remove('my1gal-drag');
   var files = Array.prototype.slice.call((e.dataTransfer && e.dataTransfer.files) || []);
   if (!cfg.multiple && files.length > 1) files = files.slice(0, 1);
   for (var i = 0; i < files.length; i++) {
    if (!fileAllowed(files[i])) {
     notify('err', files[i].name + ': File type not allowed');
     continue;
    }
    if (cfg.maxFiles > 0 && items.length >= cfg.maxFiles) {
     notify('err', 'Maximum ' + cfg.maxFiles + ' files allowed');
     break;
    }
    if (cfg.maxSize > 0 && files[i].size > cfg.maxSize) {
     notify('err', files[i].name + ': ' + cfg.labels.tooBig + ' (' + formatSize(files[i].size) + ' > ' + formatSize(cfg.maxSize) + ')');
     break;
    }
    addFile(files[i]);
   }
  });

  overlayEl.addEventListener('click', function (e) {
   var closeBtn = e.target.closest('[data-act="close"]');
   if (closeBtn) { close(); return; }

   var uploadBtn = e.target.closest('[data-act="upload-files"]');
   if (uploadBtn) {
    var _active = items.some(function (it) { return it && it.status === 'uploading'; });
    if (busy && _active && queue.length) return;
    if (busy && !_active) busy = false;
    if (!ensureFilesCallback()) return;
     var pending = items.filter(function (it) { return it && (it.status === 'pending' || (it.status === 'error' && it.file)); });
    if (!pending.length) { notify('err', 'No files selected'); return; }
    batchResults = [];
    batchPending = pending.length;
    pending.forEach(function (it) {
     it.status = 'uploading';
      it.error = '';
    });
    render();
    items.forEach(function (it, idx) {
     if (it && it.status === 'uploading' && it.file && !queue.some(function (q) { return q.idx === idx; })) {
      queue.push({ file: it.file, idx: idx });
     }
    });
    pump();
    return;
   }

   var useFilesBtn = e.target.closest('[data-act="use-files"]');
   if (useFilesBtn) {
    if (!ensureFilesCallback()) return;
    var result = collectUploadedResults();
    if (!result.length) { notify('err', 'No uploaded files'); return; }
    getFilesCallback(result);
    return;
   }

   var btn = e.target.closest('button[data-act]');
   var card = e.target.closest('.my1gal-card');
   if (!card) return;
   var idx = parseInt(card.getAttribute('data-idx'), 10);
   var it = items[idx];
   if (!it) return;

   if (it.status === 'error' && (!btn || btn.getAttribute('data-act') === 'retry')) {
    if (it.file) {
     queue = queue.filter(function (q) { return q.idx !== idx; });
     if (!items.some(function (x) { return x && x.status === 'uploading'; })) busy = false;
     if (!ensureFilesCallback()) return;
     if (batchPending <= 0) batchResults = [];
     batchPending++;
     it.status = 'uploading';
     it.error = '';
     render();
     queue.push({ file: it.file, idx: idx });
     pump();
     return;
    }
    items.splice(idx, 1);
    render();
    persist();
    browse();
    return;
   }
   if (!btn) return;
   var act = btn.getAttribute('data-act');
   if (act === 'remove') {
    items.splice(idx, 1);
    render();
    persist();
   } else if (act === 'copy' && it.id) {
    if (copyText(it.id)) notify('ok', cfg.labels.copy + ': ' + it.id);
   } else if (act === 'open') {
    var url = resolveOpen(it, cfg);
    if (url) window.open(url, '_blank', 'noopener');
   }
  });

  render();
  persist();
  return true;
 };

})();