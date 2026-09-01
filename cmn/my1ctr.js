// my1ctr.js - Profile / Proxy / Permissions modal module
// Entry point: open_my1ctr() | loaded via csh id 30 in b.js
// Keeps only: profile/proxy/permits views, Allow button endpoint (fn 97), Refresh button endpoint (fn 95)

// Global variables
if (typeof nameOfLoggedInPage === "undefined") { var nameOfLoggedInPage = ""; }
if (typeof originalBodyStyles === "undefined") { var originalBodyStyles = ""; }
window.id_of_dv_my1ctr_to_set_processed_dom_object = undefined;
window.switch_my1ctr_create_nw_modal = undefined;
window.swtch_0nothing_1flex_2block_my1ctr = undefined;
if (typeof swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === "undefined") { var swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn = 0; }
window.confirmMoNo = 1;

// Shared date-time picker helpers (fall back to native input when b.js picker is unavailable)
function admPpUseSharedPicker() {
  return typeof window.initDateTimePicker === 'function';
}

// Read the committed value of a date-time element: via shared-picker api if present, else native .value
function admPpGetDTVal(inp) {
  if (inp && inp.__dtApi && inp.__dtApi.getCommitted) {
    return inp.__dtApi.getCommitted();
  }
  return inp ? inp.value : '';
}

// Write a committed value to a date-time element: via shared-picker api if present, else native .value
function admPpSetDTVal(inp, v) {
  if (inp && inp.__dtApi && inp.__dtApi.setCommitted) {
    inp.__dtApi.setCommitted(v == null ? '' : v);
  } else if (inp) {
    inp.value = v == null ? '' : v;
  }
}

// Convert the shared-picker "YYYY-MM-DD HH:mm" value back to "YYYY-MM-DDTHH:mm" (existing payload format)
function admPpToPayloadDT(v) {
  v = v == null ? '' : String(v);
  return v ? v.replace(' ', 'T') : '';
}

// Initialize a shared date-time picker on an element; returns the api (or null when unavailable)
async function admPpInitPicker(inputId, options) {
  if (!admPpUseSharedPicker()) return null;
  try {
    return await window.initDateTimePicker(inputId, options);
  } catch (e) {
    console.warn('admPp: shared picker init failed for ' + inputId, e);
    return null;
  }
}

// Today at local 00:00 (used as the lowest allowed date for renewal grants)
function admPpTodayStart() {
  var n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

// A card is a "renewal" when the selected user already has that function granted
function admPpIsRenewalCard(card) {
  return !!(card && card.dataset && card.dataset.renews === '1');
}

// Lowest allowed date-time for a card: today 00:00 for renewals, else now
function admPpMinDateFor(card) {
  return admPpIsRenewalCard(card) ? admPpTodayStart() : new Date();
}

// Check if user is logged in
function isLoggedIn() {
 return typeof my1uzr !== 'undefined' && my1uzr != null && my1uzr.mk != null;
}

// Self-contained theme helper: builds a full palette from arbitrary appcss
// (analyzes CSS rules, plus :root vars) so this modal matches the global theme
// even if ei.js never loaded. Kept compact & lightweight.
function AdmPpTheme(resolve) {
  if (window.__admPpTheme && resolve !== true) return window.__admPpTheme;

  function parseHex(value) {
    if (!value) return null;
    var hex = String(value).trim().replace(/^#/, "");
    if (/^[0-9a-f]{3}$/i.test(hex)) hex = hex.split("").map(function (c) { return c + c; }).join("");
    if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
    return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
  }
  function toHex(rgb) {
    var c = function (n) { n = Math.max(0, Math.min(255, Math.round(n))); return ("0" + n.toString(16)).slice(-2); };
    return "#" + c(rgb.r) + c(rgb.g) + c(rgb.b);
  }
  function mix(a, b, t) {
    var ca = parseRgb(a), cb = parseRgb(b);
    if (ca && cb) {
      var m = function (x, y) { return Math.round(x + (y - x) * t); };
      return toHex({ r: m(ca.r, cb.r), g: m(ca.g, cb.g), b: m(ca.b, cb.b) });
    }
    if (ca) return toHex(ca);
    if (cb) return toHex(cb);
    return a || "#6f42c1";
  }
  function shift(rgb, amt) {
    if (!rgb) return null;
    var f = function (c) { return c + Math.round(255 * amt); };
    return { r: f(rgb.r), g: f(rgb.g), b: f(rgb.b) };
  }
  function luminance(rgb) {
    if (!rgb) return 0;
    var f = function (c) { c = c / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(rgb.r) + 0.7152 * f(rgb.g) + 0.0722 * f(rgb.b);
  }
  function textOn(rgb) {
    if (!rgb) return "#ffffff";
    return luminance(rgb) > 0.5 ? "#212529" : "#ffffff";
  }
  function parseRgb(value) {
    if (!value) return null;
    value = value.trim();
    var m = value.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
    if (m) {
      var hex = m[1];
      if (hex.length === 3 || hex.length === 4) hex = hex.split("").map(function (c) { return c + c; }).join("");
      hex = hex.slice(0, 6);
      return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
    }
    m = value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if (m) return { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]) };
    m = value.match(/^hsla?\(\s*([\d.]+)(?:deg)?\s*[,\s]+([\d.]+)%\s*[,\s]+([\d.]+)%/i);
    if (m) return hslToRgb(+m[1], +m[2], +m[3]);
    return parseHex(value);
  }
  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    var f = function (n) {
      var k = (n + h / 30) % 12;
      var a = s * Math.min(l, 1 - l);
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
  }
  function extractColors(value) {
    var out = [];
    if (!value || typeof value !== "string") return out;
    var m, hexRe = /#([0-9a-fA-F]{3,8})\b/g;
    while ((m = hexRe.exec(value)) !== null) {
      var hex = m[1];
      if (hex.length === 3 || hex.length === 4) hex = hex.split("").map(function (c) { return c + c; }).join("");
      if (hex.length === 6 || hex.length === 8) {
        hex = hex.slice(0, 6).toLowerCase();
        out.push({ hex: "#" + hex, rgb: { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) } });
      }
    }
    var rgbRe = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,\/]\s*[\d.%]+)?\s*\)/gi;
    while ((m = rgbRe.exec(value)) !== null) {
      var r = Math.round(+m[1]), g = Math.round(+m[2]), b = Math.round(+m[3]);
      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        out.push({ hex: toHex({ r: r, g: g, b: b }), rgb: { r: r, g: g, b: b } });
      }
    }
    return out;
  }
  function parseRules(cssText) {
    var rules = [], text = cssText.replace(/\/\*[\s\S]*?\*\//g, ""), len = text.length, i = 0;
    while (i < len) {
      var brace = text.indexOf("{", i);
      if (brace === -1) break;
      var selector = text.slice(i, brace).trim();
      var depth = 1, j = brace + 1;
      while (j < len && depth > 0) {
        if (text.charAt(j) === "{") depth++;
        else if (text.charAt(j) === "}") depth--;
        j++;
      }
      var block = text.slice(brace + 1, j - 1);
      if (selector && selector.charAt(0) !== "@") rules.push({ selector: selector, block: block });
      else if (/^@media/i.test(selector)) rules = rules.concat(parseRules(block));
      i = j;
    }
    return rules;
  }
  function cssVars(cssText) {
    var vars = {}, m, re = /(--[a-zA-Z0-9_-]+\s*:\s*[^;]+;)/g;
    while ((m = re.exec(cssText)) !== null) {
      var idx = m[1].indexOf(":"), name = m[1].slice(0, idx).trim(), val = m[1].slice(idx + 1).replace(/;$/, "").trim();
      vars[name] = val;
    }
    return vars;
  }
  function resolveVar(value, vars, depth) {
    if (!value || typeof value !== "string" || value.indexOf("var(") === -1) return value;
    depth = depth || 0;
    if (depth > 6) return value;
    return value.replace(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,\s*([^)]*))?\)/g, function (m, name, fb) {
      if (vars[name] !== undefined) return resolveVar(vars[name], vars, depth + 1);
      if (fb !== undefined) return fb.trim();
      return m;
    });
  }
  function splitDecls(block) {
    var parts = [], cur = "", depth = 0;
    if (!block) return parts;
    for (var i = 0; i < block.length; i++) {
      var ch = block.charAt(i);
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      if (ch === ";" && depth === 0) { parts.push(cur); cur = ""; }
      else cur += ch;
    }
    if (cur.trim()) parts.push(cur);
    return parts;
  }
  // Heuristic: analyze arbitrary CSS, pick brand / lightBg / ink / secondary.
  function analyzeTheme(cssText) {
    var rules = parseRules(cssText), vars = cssVars(cssText), usage = {};
    function add(u, hex, rgb) { if (!u[hex]) u[hex] = { hex: hex, rgb: rgb, count: 0, text: 0, accent: 0, bg: 0, bodyBg: 0, secBg: 0, btnBg: 0, border: 0 }; return u[hex]; }
    var firstVar = true;
    for (var vn in vars) {
      var cols = extractColors(resolveVar(vars[vn], vars, 0));
      if (!cols.length) continue;
      var nl = vn.toLowerCase(), sem = /(brand|primary|accent|main|theme|cta|saffron|maroon|brick|purple|navy|teal)/.test(nl) ? 3 : 0;
      if (/(gold|amber|orange)/.test(nl)) sem += 1;
      if (/(bg|background|surface|cream|light|page|paper|card|body)/.test(nl)) sem += 2;
      if (firstVar) { sem += 2; firstVar = false; }
      for (var c = 0; c < cols.length; c++) { add(usage, cols[c].hex, cols[c].rgb).count += 0.5; add(usage, cols[c].hex, cols[c].rgb).varSem = Math.max((usage[cols[c].hex].varSem || 0), sem); }
    }
    for (var r = 0; r < rules.length; r++) {
      var decls = splitDecls(rules[r].block), selL = rules[r].selector.toLowerCase();
      var isBody = /(^|\s)(body|html)([\s,:>{]|$)/.test(selL);
      var isBtn = /(^|[\s.#>])h?t?-?btn|\.btn|button/i.test(selL);
      var isAccent = /price|total|amt|active|back|ribbon|kicker|cta|emphas|selected|current/i.test(selL);
      var isSec = /card|section|modal|surface|summary|panel|wrap|box|strip|sidebar|listing/i.test(selL);
      for (var d = 0; d < decls.length; d++) {
        var ci = decls[d].indexOf(":"), prop, value;
        if (ci === -1) continue;
        prop = decls[d].slice(0, ci).trim().toLowerCase();
        value = resolveVar(decls[d].slice(ci + 1).trim(), vars, 0);
        var cs2 = extractColors(value);
        if (!cs2.length) continue;
        var isBorder = prop.indexOf("border") === 0, isBg = prop.indexOf("background") === 0, isText = prop === "color";
        for (var c2 = 0; c2 < cs2.length; c2++) {
          var u2 = add(usage, cs2[c2].hex, cs2[c2].rgb);
          u2.count++;
          if (isText) { u2.text++; if (isAccent) u2.accent++; }
          if (isBg) { u2.bg++; if (isBody) u2.bodyBg++; if (isSec) u2.secBg++; if (isBtn) u2.btnBg++; }
          if (isBorder) u2.border++;
        }
      }
    }
    var hexes = Object.keys(usage), lightBest = null, lightScore = -1, brandBest = null, brandScore = -1, inkBest = null, inkScore = -1;
    for (var h = 0; h < hexes.length; h++) {
      var u3 = usage[hexes[h]], lum = luminance(u3.rgb);
      var sat = (Math.max(u3.rgb.r, u3.rgb.g, u3.rgb.b) - Math.min(u3.rgb.r, u3.rgb.g, u3.rgb.b)) / 255;
      if (lum > 0.72 && sat < 0.4) {
        var s = u3.count + u3.bodyBg * 8 + u3.secBg * 1.5 + u3.bg * 0.5 + (u3.varSem >= 2 ? 2 : 0) - (hexes[h] === "#ffffff" ? 5 : 0);
        if (s > lightScore) { lightScore = s; lightBest = hexes[h]; }
      }
      if (lum < 0.42 && sat < 0.3 && u3.text > 0) {
        var s2 = u3.text * 2 + u3.count * 0.5 + (u3.varSem ? 1 : 0);
        if (s2 > inkScore) { inkScore = s2; inkBest = hexes[h]; }
      }
      if (sat >= 0.18 && lum > 0.05 && lum < 0.95) {
        var s3 = u3.count * 0.5 + u3.text * 0.3 + u3.accent * 4 + u3.btnBg * 3 + (u3.varSem >= 3 ? 5 : u3.varSem >= 2 ? 1 : 0);
        if (s3 > brandScore) { brandScore = s3; brandBest = hexes[h]; }
      }
    }
    var secondScore = -1, secondHex = null;
    for (var h2 = 0; h2 < hexes.length; h2++) {
      if (hexes[h2] === brandBest) continue;
      var u4 = usage[hexes[h2]], lum2 = luminance(u4.rgb), sat2 = (Math.max(u4.rgb.r, u4.rgb.g, u4.rgb.b) - Math.min(u4.rgb.r, u4.rgb.g, u4.rgb.b)) / 255;
      if (sat2 >= 0.18 && lum2 > 0.05 && lum2 < 0.95) {
        var s4 = u4.count * 0.5 + u4.accent * 3 + u4.btnBg * 3 + u4.border * 1.5 + (u4.varSem || 0);
        if (s4 > secondScore) { secondScore = s4; secondHex = hexes[h2]; }
      }
    }
    return { brand: brandBest, lightBg: lightBest, ink: inkBest, secondary: secondHex };
  }

  var src = typeof window.appcss === "string" && window.appcss ? window.appcss : "";
  var report = src ? analyzeTheme(src) : { brand: null, lightBg: null, ink: null, secondary: null };

  function readVar(names) {
    try {
      var cs = getComputedStyle(document.documentElement);
      for (var i = 0; i < names.length; i++) { var v = cs.getPropertyValue(names[i]).trim(); if (v) return v; }
    } catch (e) {}
    if (src) {
      for (var j = 0; j < names.length; j++) {
        var m = src.match(new RegExp(names[j] + "\\s*:\\s*([^;}{]+)"));
        if (m && m[1]) return m[1].trim();
      }
    }
    return null;
  }
  function readEi(key) {
    var p = window.__eiPalette;
    return p && p[key] ? p[key] : null;
  }
  var brand = readVar(["--primary-purple", "--ember", "--brand", "--brand-color"]) || readEi("brand") || report.brand || "#6f42c1";
  var light = readVar(["--light-purple", "--light-bg", "--surface", "--cream"]) || readEi("lightBg") || readEi("surface") || report.lightBg || "#e2d9f3";
  var secondary = readVar(["--secondary-gold", "--gold", "--accent", "--secondary"]) || readEi("secondary") || report.secondary || "#ffd700";
  var ink = readVar(["--ink", "--charcoal", "--dark", "--dark-purple", "--text"]) || readEi("ink") || report.ink || "#212529";

  var bRgb = parseRgb(brand);
  var sRgb = parseRgb(secondary);
  var brandDark = readVar(["--dark-purple", "--ember-dark", "--brand-dark"]) || (bRgb ? toHex(shift(bRgb, -0.14)) : "#4a2d7e");
  var onBrand = bRgb ? textOn(bRgb) : "#ffffff";
  var onSecondary = sRgb ? textOn(sRgb) : "#212529";
  var goldDark = sRgb ? mix(secondary, "#000000", 0.35) : "#a68a00";
  var goldBg = sRgb ? mix("#ffffff", secondary, 0.12) : "#fff8e1";
  var theme = {
    brand: brand,
    brandDark: brandDark,
    onBrand: onBrand,
    secondary: secondary,
    onSecondary: onSecondary,
    lightBg: light,
    surface: mix("#ffffff", light, 0.35),
    ink: ink,
    glow: bRgb ? "rgba(" + bRgb.r + ", " + bRgb.g + ", " + bRgb.b + ", 0.25)" : "rgba(111, 66, 193, 0.25)",
    goldBg: goldBg,
    goldDark: goldDark,
    bodyBg: light,
    headerBg: mix(brand, "#ffffff", 0.60),
    profileBg: mix(brand, "#ffffff", 0.72)
  };
  window.__admPpTheme = theme;
  return theme;
}

function AdmPpThemeForceReload() {
  window.__admPpTheme = null;
}

function admPpInjectMenuCss() {
  if (document.getElementById('admPpMenuCss')) return;
  var st = document.createElement('style');
  st.id = 'admPpMenuCss';
  st.textContent = '#admPpModMenu{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:10px;}'
    + '@media(min-width:768px){#admPpModMenu{grid-template-columns:repeat(auto-fill,minmax(90px,1fr));}}'
    + '#admPpModMenu button{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 4px 8px;border-radius:12px;border:1px solid #6c757d;background:#fff;cursor:pointer;min-width:0;transition:transform .15s,box-shadow .15s;font-family:inherit;}'
    + '#admPpModMenu button:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.12);}'
    + '#admPpModMenu button .mt-ic{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--mc,#6c757d);background:#ceffda;border:1px solid rgba(108,117,125,.25);}'
    + '#admPpModMenu button .mt-lb{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:600;letter-spacing:.2px;line-height:1;color:#212529;}';
  document.head.appendChild(st);
}

function admPpRenderModMenu() {
  var menuEl = document.getElementById('admPpModMenu');
  if (!menuEl) return;
  var mods = (window[my1uzr && my1uzr.worknOnPg] && window[my1uzr.worknOnPg].allowedModulesMenuItems)
    || [];
  if (!mods.length) { menuEl.innerHTML = ''; return; }
  var shortMap = { hm:'home', rm:'rooms', ar:'addRoom', bs:'booking', rt:'restaurant', rw:'reviews', st:'settings', pl:'policies' };
  var hCols = ((window[my1uzr && my1uzr.worknOnPg] && window[my1uzr.worknOnPg].colsToHideMenu) || '')
    .split(',').map(function (k) { return shortMap[k.trim().toLowerCase()] || k.trim().toLowerCase(); }).filter(function (k) { return k; });
  var visible = mods.filter(function (m) { return hCols.indexOf(m.d) === -1; });
  menuEl.innerHTML = visible.map(function (m) {
    var iconColor = m.e && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(m.e) ? m.e : 'var(--mc,#6c757d)';
    return '<button type="button" data-action="' + AdmPpEsc(m.d) + '" style="--mc:' + AdmPpEsc(iconColor) + ';">'
      + '<span class="mt-ic"><i class="fa-solid ' + AdmPpEsc(m.c || 'fa-cube') + '"></i></span>'
      + '<span class="mt-lb">' + AdmPpEsc(m.b || 'Module') + '</span></button>';
  }).join('');
  menuEl.querySelectorAll('button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var action = btn.dataset.action;
      if (admPpModalRefs.instance) admPpModalRefs.instance.hide();
      if (typeof openAdminFromMenu === 'function') openAdminFromMenu(action);
    });
  });
}

 function showUserInfoModal() {
  if (!my1uzr) return;

  const theme = AdmPpTheme();
  const { contentElement, modalInstance, modalElement } = create_modal_dynamically('user_info');

 // Card-style dialog (card look taken from b copy.js .bm-card)
 const dlg = modalElement.querySelector('.modal-dialog');
 dlg.style.maxWidth = 'min(94vw, 640px)';
 dlg.style.marginTop = '14px';
 dlg.style.marginLeft = 'auto';
 dlg.style.marginRight = 'auto';

 const mContent = modalElement.querySelector('.modal-content');
 if (mContent) {
   mContent.style.background = theme.bodyBg;
   mContent.style.border = '2px solid gray';
  mContent.style.borderRadius = '14px';
  mContent.style.boxShadow = '0 2px 12px rgba(36,27,69,.07)';
  mContent.style.height = 'auto';
  mContent.style.marginTop = '35px'
  mContent.style.minHeight = '620px';
  mContent.style.maxHeight = '94vh';
  mContent.style.display = 'flex';
  mContent.style.flexDirection = 'column';
 }
 contentElement.style.padding = '0';
 contentElement.style.flex = '1 1 auto';
 contentElement.style.overflowY = 'auto';
 contentElement.style.background = theme.profileBg;

 const avatarInner = my1uzr.ml ?
  `<img src="${my1uzr.ml}" alt="Profile Picture" style="width:100%; height:100%; object-fit:cover;">` :
  `<i class="fas fa-user" style="font-size:1.05rem;"></i>`;

 contentElement.innerHTML = `
<div class="modal-header" style="position:sticky; top:0; z-index:5; background:${theme.headerBg};">
<div class="ms-3 mt-1">
  <button type="button" id="admPpBtnProxy" class="btn btn-outline-success btn-sm">Proxy</button>
  <button type="button" id="admPpBtnPermissions" class="btn btn-outline-primary btn-sm ms-1">Permissions</button>
  <span onclick="logPout()" title="Logout" style="color:red; cursor:pointer; margin-left:4px;">_</span>
</div>
 <!--h5 class="modal-title mb-0">User  Information</h5-->
 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div id="admPp_view_profile" class="px-3 pb-2 pt-2" style="background:${theme.profileBg};">
 <div style="background:#fff; border:1px solid #6c757d; border-radius:14px; box-shadow:0 2px 12px rgba(36,27,69,.07); padding:16px; min-height:96px; display:flex; align-items:center;">
  <div style="display:flex; align-items:center; gap:16px; width:100%;">
   <div class="d-flex flex-column align-items-center justify-content-center flex-shrink-0" style="gap:4px;">
    <span class="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center overflow-hidden"
     style="width:38px; height:38px;">${avatarInner}</span>
     <span class="fw-bold text-center" style="font-size:.92rem; display:block; width:60px; white-space:normal; overflow-wrap:break-word; text-align:center;" title="${AdmPpEsc(my1uzr.mn || 'No Name')}">${AdmPpEsc(my1uzr.mn || 'No Name')}</span>
   </div>

   <div style="width:1px; align-self:stretch; background:#ced4da; margin:2px 4px;"></div>

   <div class="d-flex flex-column justify-content-center" style="flex:1 1 auto; min-width:0; gap:9px;">
    <div class="d-flex justify-content-between align-items-center" style="gap:12px;">
     <span class="text-muted" style="font-size:.82rem;">Mobile</span>
     <span class="fw-semibold" style="font-size:.92rem; white-space:nowrap; overflow-wrap:anywhere;">${my1uzr.mo || "N/A"}</span>
    </div>
    <div class="d-flex justify-content-between align-items-center" style="gap:12px;">
     <span class="text-muted" style="font-size:.82rem;">Relation</span>
     <span class="fw-semibold" style="font-size:.92rem; white-space:nowrap;">${my1uzr.mc || "0"}</span>
    </div>
   </div>
 </div>
</div>
</div>
<div id="admPpModMenu" class="mt-3" style="background:${theme.surface};border:1px solid #6c757d;border-radius:14px;box-shadow:0 2px 12px rgba(36,27,69,.07);margin:0 10px 14px;"></div>
<div id="admPp_view_proxy" class="px-2 pb-2 pt-2 d-none" style="background:${theme.surface};border:1px solid #6c757d;border-radius:14px;box-shadow:0 2px 12px rgba(36,27,69,.07);padding: 16px 6px;margin:0 10px 14px;"></div>
<div id="admPp_view_permits" class="px-2 pb-2 pt-2 d-none" style="background:${theme.surface};border:1px solid #6c757d;border-radius:14px;box-shadow:0 2px 12px rgba(36,27,69,.07);padding: 16px 6px;margin:0 10px 14px;"></div>
`;

 const footerEl = document.createElement('div');
 footerEl.className = 'modal-footer py-2';
 footerEl.id = 'admPpFooter';
 footerEl.innerHTML = `<button type="button" class="btn btn-sm w-100" id="admPpGvPrmAllowBtn" style="background:${theme.brand};border:1px solid ${theme.brand};color:${theme.onBrand};font-weight:600;">Allow Selected</button>`;
 mContent.appendChild(footerEl);

 admPpModalRefs.instance = modalInstance;
 admPpModalRefs.element = contentElement;
 admPpModalRefs.parent = mContent;
admPpState.view = 'profile';
  admPpState.checked = new Set();
  admPpState.selectedUser = null;
  admPpGvPrmOnlyPermitted = false;

 const bpEl = contentElement.querySelector('#admPpBtnProxy');
  const btEl = contentElement.querySelector('#admPpBtnPermissions');
 if (bpEl) bpEl.addEventListener('click', () => { if (admPpState.view !== 'proxy') AdmPpSetView('proxy'); });
  if (btEl) btEl.addEventListener('click', () => { if (admPpState.view !== 'permits') AdmPpSetView('permits'); });

 AdmPpSetView('profile');
 modalInstance.show();
 admPpInjectMenuCss();
 admPpRenderModMenu();
}

// ===================== Proxy & Permissions management =====================
var AdmPpFn_NAMES = {
  0: "Dashboard", 1: "add product", 2: "edit product", 3: "delete product",
  4: "view reports", 5: "manage users", 6: "settings", 7: "billing",
  8: "inventory", 9: "customer support", 10: "analytics"
};

var admPpModalRefs = { instance: null, element: null };
var admPpState = { view: 'profile', checked: new Set(), selectedUser: null, isGranting: false };
var admPpSelUFPerms = [];
var admPpGvPrmOnlyPermitted = false;

function AdmPpGetFunctionName(funcId) {
  return AdmPpFn_NAMES[funcId] || 'Unknown Function #' + funcId;
}

function AdmPpFormatDateTime(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr || '';
  return date.toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function AdmPpToInputDT(d) {
  const p = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
}

// Display helper for the shared datetime picker: YYYY-MM-DD HH:mm -> dd/mm/yyyy hh:mm
function AdmPpFmtDisp(v) {
  if (!v) return '';
  const parts = String(v).trim().split(/[\sT]+/);
  const d = (parts[0] || '').split('-');
  if (d.length < 3) return v;
  const t = (parts[1] || '').split(':');
  return d[2] + '/' + d[1] + '/' + d[0] + ' ' + (t[0] || '00') + ':' + (t[1] || '00');
}

// Minimal overlay styles so the shared picker's date display (and its placeholder) render
function AdmPpInjectDateCss() {
  if (document.getElementById('admPpDateCss')) return;
  const st = document.createElement('style');
  st.id = 'admPpDateCss';
  st.textContent = '.adm-pp .bm-date-wrap,.bm-date-wrap{position:relative}.bm-date-wrap.has-val input{color:transparent;caret-color:transparent}.bm-date-wrap .bm-date-disp{position:absolute;inset:0;display:flex;align-items:center;padding:0 .6rem;pointer-events:none;z-index:2;white-space:nowrap;overflow:hidden}';
  document.head.appendChild(st);
}

function AdmPpEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function AdmPpLoadPermData() {
  if (!window[my1uzr.worknOnPg]) window[my1uzr.worknOnPg] = {};
  let fRecs = [];
  let fpRecs = [];
  let cRecs = [];
  try {
    fRecs = (await dbDexieManager.getAllRecords(dbnm, 'f')) ||[];
    fpRecs = (await dbDexieManager.getAllRecords(dbnm, 'fp')) || [];
    cRecs = (await dbDexieManager.getAllRecords(dbnm, 'c')) || [];
  } catch (e) {
    console.warn('failed to load "f", "fp" or "c":', e);
  }
  window[my1uzr.worknOnPg].admPp_f = fRecs;
  window[my1uzr.worknOnPg].admPp_fp = fpRecs;
  window[my1uzr.worknOnPg].admPp_c = cRecs;
  window[my1uzr.worknOnPg].fnfp = fRecs;
  window[my1uzr.worknOnPg].fnf = fpRecs;
}

function AdmPpBadgeForTill(till) {
  const t = new Date(till);
  if (isNaN(t.getTime())) return '';
  const now = new Date();
  const days = Math.ceil((t - now) / 86400000);
  if (t < now) return '<span class="badge bg-danger">Expired</span>';
  if (days <= 7) return '<span class="badge bg-warning text-dark">' + days + 'd left</span>';
  return '<span class="badge bg-success">Active</span>';
}

function AdmPpShowLoader() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 99999;';
  overlay.innerHTML = '<div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
  if (!document.getElementById('spinAnimationStyle')) {
    const style = document.createElement('style');
    style.id = 'spinAnimationStyle';
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
  document.body.appendChild(overlay);
  return overlay;
}

function AdmPpSetView(view) {
  const el = admPpModalRefs.element;
  if (!el) return;
  admPpState.view = view;
  ['proxy', 'permits'].forEach(v => {
    const c = el.querySelector('#admPp_view_' + v);
    if (c) c.classList.toggle('d-none', v !== view);
  });
  const bp = el.querySelector('#admPpBtnProxy');
  const bt = el.querySelector('#admPpBtnPermissions');
  if (bp) {
    bp.classList.toggle('btn-success', view === 'proxy');
    bp.classList.toggle('btn-outline-success', view !== 'proxy');
    bp.style.backgroundColor = view !== 'proxy' ? '#fff' : '';
    bp.style.borderColor = view !== 'proxy' ? '#198754' : '';
    bp.style.color = view !== 'proxy' ? '#198754' : '';
  }
  if (bt) {
    const pTheme2 = AdmPpTheme();
    const pBrand = pTheme2.brand;
    bt.classList.toggle('btn-primary', view === 'permits');
    bt.classList.toggle('btn-outline-primary', view !== 'permits');
    bt.style.backgroundColor = view !== 'permits' ? '#fff' : pBrand;
    bt.style.borderColor = pBrand;
    bt.style.color = view !== 'permits' ? pBrand : pTheme2.onBrand;
  }
  if (view === 'proxy') AdmPpOpenProxy();
  if (view === 'permits') AdmPpOpenPermits();
  const footer = document.getElementById('admPpFooter');
  if (footer) footer.classList.toggle('d-none', view !== 'permits');
}

async function AdmPpOpenProxy() {
  await AdmPpLoadPermData();
  const root = admPpModalRefs.element && admPpModalRefs.element.querySelector('#admPp_view_proxy');
  if (!root) return;
  const recs = window[my1uzr.worknOnPg].admPp_f || [];
  let html = '<h6 class="mb-2"><i class="fas fa-key me-1 text-secondary"></i>My Permissions</h6>';
  if (!recs.length) {
    html += '<div class="alert alert-light border py-2 mb-0" style="font-size:.85rem;">No permissions found.</div>';
  } else {
    html += '<div style="display:flex; flex-direction:column; gap:10px;">';
    recs.forEach(rec => {
      if (rec.h === undefined || rec.h === null) return;
      const tillValid = rec.j && !isNaN(new Date(rec.j).getTime());
      const expired = tillValid && new Date(rec.j) < new Date();
      html += `
<div title="ID: ${AdmPpEsc(rec.a)} | ${AdmPpEsc(rec.e || '')}${tillValid ? ' | till: ' + AdmPpEsc(AdmPpFormatDateTime(rec.j)) : ''}" style="background:#fff; border:1px solid #6c757d; border-radius:12px; box-shadow:0 2px 8px rgba(36,27,69,.05); padding:10px 14px; display:flex; align-items:center; gap:10px;">
 <i class="fas fa-check-circle ${expired ? 'text-muted' : 'text-success'}"></i>
 <div style="flex:1 1 auto; min-width:0;">
  <div class="fw-semibold" style="font-size:.92rem;">${AdmPpEsc(rec.fn || AdmPpGetFunctionName(rec.h))}</div>
  <div class="d-flex align-items-center gap-1">
   <span class="text-muted" style="font-size:.78rem;">Function #${AdmPpEsc(rec.h)}${tillValid ? ' &middot; till ' + AdmPpEsc(AdmPpFormatDateTime(rec.j)) : ''}</span>
   <button type="button" class="btn btn-outline-secondary btn-sm admPpPermArrow" data-fn-h="${AdmPpEsc(rec.h)}" title="Users permitted on Function #${AdmPpEsc(rec.h)}" style="margin-left:auto; padding:0 7px; line-height:1.1; flex-shrink:0;">&rarr;</button>
   ${tillValid ? AdmPpBadgeForTill(rec.j) : ''}
  </div>
 </div>
</div>`;
    });
    html += '</div>';
  }
  root.innerHTML = html;
  root.querySelectorAll('.admPpPermArrow').forEach(function (btn) {
    btn.addEventListener('click', function () {
      AdmPpShowPermittedUsers(Number(this.dataset.fnH));
    });
  });
}

async function AdmPpShowPermittedUsers(h) {
  const data = window[my1uzr && my1uzr.worknOnPg] || {};
  const fRecs = data.admPp_f || [];
  const cRecs = data.admPp_c || [];
  const theme = AdmPpTheme();

  const granted = fRecs.filter(function (r) {
    return r.h !== undefined && r.h !== null && Number(r.h) === Number(h);
  });

  const nameOf = function (e) {
    for (var i = 0; i < cRecs.length; i++) {
      if (String(cRecs[i].e) === String(e)) return cRecs[i];
    }
    return null;
  };

  let rows = '';
  const seen = {};
  granted.forEach(function (r) {
    const user = nameOf(r.e);
    const label = user && user.h ? user.h : (r.e || 'Unknown user');
    const key = String(r.e || label);
    const till = r.j && !isNaN(new Date(r.j).getTime()) ? AdmPpFormatDateTime(r.j) : 'N/A';
    if (seen[key]) {
      seen[key].tills.push(till);
      return;
    }
    seen[key] = { label: label, mob: r.e || '', rel: user ? user.f : '', tills: [till] };
  });

  Object.keys(seen).forEach(function (key) {
    const item = seen[key];
    rows += `<div style="display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #6c757d; border-radius:10px; box-shadow:0 2px 6px rgba(36,27,69,.05); padding:8px 12px;">
  <i class="fas fa-user-circle" style="font-size:1.4rem; color:${theme.brand}; flex-shrink:0;"></i>
  <div style="flex:1 1 auto; min-width:0;">
   <div class="fw-semibold" style="font-size:.9rem;">${AdmPpEsc(item.label)}</div>
   <div class="text-muted" style="font-size:.76rem;">${AdmPpEsc(item.mob || '&mdash;')}${item.rel ? ' &middot; Relation ' + AdmPpEsc(String(item.rel)) : ''}</div>
  </div>
  <div class="text-end" style="flex-shrink:0;">
   ${item.tills.map(function (t) { return '<div class="text-muted" style="font-size:.72rem;">till <b style="color:' + AdmPpGvPrmTillColorSafe(t) + ';">' + AdmPpEsc(t) + '</b></div>'; }).join('')}
  </div>
 </div>`;
  });

  const { contentElement, modalInstance, modalElement } = create_modal_dynamically('adm_pp_perm_users');
  const dlg = modalElement.querySelector('.modal-dialog');
  if (dlg) {
    dlg.style.maxWidth = 'min(94vw, 520px)';
    dlg.style.marginTop = '14px';
    dlg.style.marginLeft = 'auto';
    dlg.style.marginRight = 'auto';
  }
  const mContent = modalElement.querySelector('.modal-content');
  if (mContent) {
    mContent.style.background = theme.bodyBg;
    mContent.style.border = '2px solid gray';
    mContent.style.borderRadius = '14px';
    mContent.style.boxShadow = '0 2px 12px rgba(36,27,69,.07)';
  }
  contentElement.innerHTML = `
<div class="modal-header" style="position:sticky; top:0; z-index:5; background:${theme.headerBg};">
 <h5 class="modal-title mb-0" style="font-size:1rem;"><i class="fas fa-users me-1" style="color:${theme.brand};"></i>Permitted Users &middot; Function #${AdmPpEsc(h)}</h5>
 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="px-3 py-2" style="font-size:.85rem; display:flex; flex-direction:column; gap:8px; overflow-y:auto; max-height:60vh;">
 ${rows || '<div class="text-muted d-flex align-items-center justify-content-center" style="min-height:120px;">No users permitted on this function.</div>'}
</div>`;
 modalInstance.show();
}

function AdmPpGvPrmTillColorSafe(till) {
  if (typeof AdmPpGvPrmTillColor === 'function') return AdmPpGvPrmTillColor(till);
  const t = new Date(till);
  if (isNaN(t.getTime())) return '#198754';
  const now = new Date();
  const days = Math.ceil((t - now) / 86400000);
  if (t < now) return '#dc3545';
  if (days <= 7) return '#fd7e14';
  if (days <= 30) return '#ffc107';
  return '#198754';
}

async function AdmPpOpenPermits() {
  const root = admPpModalRefs.element && admPpModalRefs.element.querySelector('#admPp_view_permits');
  if (!root) return;

  window.gvPrmSelected = new Set();
  await AdmPpLoadPermData();

  AdmPpInjectDateCss();
  var theme = AdmPpTheme();
  let html = '<div class="d-flex align-items-center justify-content-between mb-2"><h6 class="mb-0"><i class="fas fa-users me-1" style="color:' + theme.brand + ';"></i>Give Permissions</h6>'
   + '<button type="button" id="admPpRefreshBtn" class="btn btn-outline-secondary btn-sm" title="Refresh permissions" style="background:#fff;"><i class="fas fa-sync-alt"></i></button></div>';

  html += `
<div class="d-flex gap-2 mb-2">
  <button type="button" class="btn btn-sm btn-outline-primary flex-grow-1 border border-dark" id="admPpGvPrmPersonBtn" title="Select person" style="background:#fff;">
    <i class="fas fa-user me-1"></i> Select User
  </button>
  <label class="d-inline-flex align-items-center gap-1 mb-0" style="white-space:nowrap;font-size:.8rem;cursor:pointer;" title="Show only already-approved functions for the selected user">
    <input type="checkbox" id="admPpGvPrmOnlyPermittedCb" class="form-check-input mt-0 border border-dark" style="width:19px;height:19px;cursor:pointer;"${admPpGvPrmOnlyPermitted ? ' checked' : ''}>
  </label>
  <div class="dropdown flex-grow-1">
    <button class="btn btn-sm btn-outline-primary dropdown-toggle w-100 border border-dark text-start" type="button" data-bs-toggle="dropdown" id="admPpGvPrmModuleDropBtn" style="background:#fff;">
      <i class="fas fa-link me-1"></i> Select Module
    </button>
    <ul class="dropdown-menu w-100 border border-dark" id="admPpGvPrmModuleDropMenu"></ul>
  </div>
</div>
<div class="d-flex align-items-center gap-2 mb-2">
  <label class="form-label mb-0" style="font-size:.82rem;white-space:nowrap;">Set All Till</label>
  <div class="bm-date-wrap" style="max-width:200px;">
    <input type="datetime-local" class="form-control form-control-sm border border-dark" id="admPpPermTill" placeholder="dd/mm/yyyy --:--" style="max-width:200px;">
    <span class="bm-date-disp" id="admPpPermTill_disp"></span>
  </div>
</div>

<div id="admPpGvPrmContent" style="font-size:.85rem;">
</div>`;

  root.innerHTML = html;

  const personBtn = root.querySelector('#admPpGvPrmPersonBtn');
  const dropBtn = root.querySelector('#admPpGvPrmModuleDropBtn');
  const dropMenu = root.querySelector('#admPpGvPrmModuleDropMenu');
  const contentEl = root.querySelector('#admPpGvPrmContent');
  const tillInput = root.querySelector('#admPpPermTill');
  const allowBtn = document.querySelector('#admPpGvPrmAllowBtn');
  const onlyCb = root.querySelector('#admPpGvPrmOnlyPermittedCb');
  if (tillInput) {
    tillInput.min = AdmPpToInputDT(new Date());
    const tillApi = await admPpInitPicker('admPpPermTill', { autoNow: false, displayFormatter: AdmPpFmtDisp });
    if (tillApi) tillInput.__dtApi = tillApi;
  }
  if (onlyCb) {
    onlyCb.checked = !!admPpGvPrmOnlyPermitted;
    onlyCb.disabled = !admPpState.selectedUser;
    onlyCb.addEventListener('change', function () {
      admPpGvPrmOnlyPermitted = onlyCb.checked;
      if (typeof window.admPpGvPrmRenderFp === 'function') window.admPpGvPrmRenderFp();
    });
  }

  const mods = (typeof gvPrmGetModules === 'function' ? gvPrmGetModules() : null)
    || window[my1uzr.worknOnPg].moduLst
    || [];

  const allFp = window[my1uzr.worknOnPg].admPp_fp || [];
  const fRecs = window[my1uzr.worknOnPg].admPp_f || [];

  admPpSelUFPerms = [];
  if (admPpState.selectedUser && admPpState.selectedUser.e) {
    admPpSelUFPerms = fRecs.filter(function (r) {
      return String(r.e) === String(admPpState.selectedUser.e)
        && (admPpState.selectedUser.f === undefined || String(r.f) === String(admPpState.selectedUser.f));
    });
  }

  const myMo = String(my1uzr.mo);
  const myMc = String(my1uzr.mc);
  const myC = (window[my1uzr.worknOnPg].admPp_c || []).find(function (r) { return String(r.e) === myMo && String(r.f) === myMc; });
  const cA = myC ? String(myC.a) : null;
  const now = Date.now();
  const usedByH = {};
  if (cA != null) {
    fRecs.forEach(function (x) {
      if (String(x.c) !== cA) return;
      const till = x.j ? new Date(x.j) : null;
      if (!till || isNaN(till.getTime()) || till.getTime() <= now) return;
      const h = Number(x.h);
      usedByH[h] = (usedByH[h] || 0) + 1;
    });
  }
  const myFp = allFp.filter(function (r) { return String(r.e) === myMo && String(r.f) === myMc; });

  console.log('admPp: AdmPpOpenPermits called, mods:', mods.length, 'fp:', allFp.length, 'myFp:', myFp.length, 'f:', fRecs.length);

  if (mods.length) {
    dropMenu.innerHTML = '<li><button class="dropdown-item" data-mod-idx="-1"><i class="fas fa-list me-2 text-secondary"></i>Show All</button></li>'
     + mods.map(function (m, i) {
      return '<li><button class="dropdown-item" data-mod-idx="' + i + '"><i class="fas ' + AdmPpEsc(m.c || 'fa-cube') + ' me-2" style="color:' + (m.e && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(m.e) ? AdmPpEsc(m.e) : theme.brand) + ';"></i>' + AdmPpEsc(m.b || ('Module ' + (i + 1))) + '</button></li>';
    }).join('');
  }

  function AdmPpGvPrmTillColor(till) {
    var t = new Date(till);
    if (isNaN(t.getTime())) return '';
    var now = new Date();
    var days = Math.ceil((t - now) / 86400000);
    if (t < now) return '#dc3545';
    if (days <= 7) return '#fd7e14';
    if (days <= 30) return '#ffc107';
    return '#198754';
  }

  var fpTillValues = {};
  var fpDepthValues = {};
  var fpAllowCntValues = {};

  async function renderFpList(fpRecs) {
    var prevSelected = new Set(window.gvPrmSelected);

    if (!fpRecs.length) {
      contentEl.innerHTML = '<div class="text-muted d-flex align-items-center justify-content-center" style="min-height:120px;">No functions available</div>';
      return;
    }
    var cardsHtml = '';
    var onlyCb = contentEl ? contentEl.ownerDocument.getElementById('admPpGvPrmOnlyPermittedCb') : null;
    var onlyPermitted = onlyCb ? onlyCb.checked : admPpGvPrmOnlyPermitted;
    fpRecs.forEach(function (rec) {
      var h = Number(rec.h);
      var already = admPpSelUFPerms.filter(function (x) { return Number(x.h) === Number(h); });
      if (onlyPermitted && !already.length) return;
      var name = rec.fn || AdmPpGetFunctionName(h);
      var limit = parseInt(rec.k) || 0;
      var iVal = parseInt(rec.i) || 0;
      var tillDate = rec.j;
      var tillMax = tillDate;
      var used = usedByH[h] || 0;
      var exhausted = !!limit && used >= limit;
      var tillLine = '';
      if (tillDate) {
        var tillTxt = AdmPpFormatDateTime(tillDate);
        var tc = AdmPpGvPrmTillColor(tillDate);
        tillLine = '<div class="d-flex align-items-center gap-1">'
         + '<div class="text-muted" style="font-size:.78rem;">till <span style="color:' + tc + ';font-weight:600;">' + AdmPpEsc(tillTxt) + '</span></div>'
         + '<button type="button" class="btn btn-outline-secondary btn-sm admPpPermArrow" data-fn-h="' + h + '" title="Users permitted on Function #' + h + '" style="margin-left:auto; padding:0 7px; line-height:1.1; flex-shrink:0;">&rarr;</button>'
         + '</div>';
      }
      cardsHtml += '<div class="admPpGvPrmCard" data-func-id="' + h + '"' + (already.length ? ' data-renews="1"' : '') + ' style="cursor:pointer;border:1px solid #6c757d;border-radius:8px;padding:8px 12px;margin-bottom:6px;background:#fff;">'
       + '<div class="d-flex align-items-center gap-2">'
       + '<input type="checkbox" class="form-check-input mt-0 admPpGvPrmCb border border-dark" data-h="' + h + '" tabindex="-1" style="width:16px;height:16px;">'
       + '<span class="fw-bold" style="font-size:.88rem;color:' + theme.brand + ';">' + h + '</span>'
       + '<span class="fw-semibold flex-grow-1" style="font-size:.88rem;">' + AdmPpEsc(name) + '</span>'
       + '<span class="badge bg-info text-dark" style="font-size:.88rem;">' + AdmPpEsc(String(iVal)) + '</span>'
       + '<span class="badge ' + (exhausted ? 'bg-danger' : 'bg-info') + ' text-dark" style="font-size:.88rem;" title="allowed/used">' + AdmPpEsc(String(limit)) + '/' + AdmPpEsc(String(used)) + '</span>'
       + '</div>'
       + '<div class="ps-4 mt-1 d-flex align-items-center gap-2">'
       + '<div class="bm-date-wrap" style="max-width:200px;"><input type="datetime-local" id="admPpCardTill_' + h + '" class="form-control form-control-sm admPpCardTill border border-secondary" data-h="' + h + '" min="' + AdmPpToInputDT(already.length ? admPpTodayStart() : new Date()) + '" max="' + (tillMax ? AdmPpToInputDT(new Date(tillMax)) : '') + '" placeholder="dd/mm/yyyy --:--" style="max-width:200px;font-size:.78rem;"><span class="bm-date-disp" id="admPpCardTill_' + h + '_disp"></span></div>'
        + '<input type="text" class="form-control form-control-sm admPpCardDepth border border-secondary" data-h="' + h + '" max="' + iVal + '" placeholder="depth" pattern="[0-9]*" inputmode="numeric" style="max-width:60px;font-size:.78rem;' + (iVal <= 0 ? 'opacity:.5;' : '') + '"' + (iVal <= 0 ? ' disabled' : '') + '>'
        + '<input type="text" class="form-control form-control-sm admPpCardAllowCnt border border-secondary" data-h="' + h + '" max="' + limit + '" placeholder="allow-cnt" pattern="[0-9]*" inputmode="numeric" style="max-width:70px;font-size:.78rem;' + (limit <= 0 ? 'opacity:.5;' : '') + '"' + (limit <= 0 ? ' disabled' : '') + '>'
       + '</div>'
       + (tillLine ? '<div class="ps-4">' + tillLine + '</div>' : '')
       + '</div>';
      if (already.length) {
        cardsHtml += '<div style="border:1px solid ' + theme.brand + ';border-radius:6px;margin-bottom:6px;padding:5px 10px;background:' + theme.lightBg + ';font-size:.76rem;">'
         + '<div class="text-muted" style="font-size:.72rem;font-weight:600;">Already permitted</div>'
         + already.map(function (x) {
            var tt = AdmPpFormatDateTime(x.j);
            var tc = AdmPpGvPrmTillColor(x.j);
            return '<div style="display:flex;align-items:center;gap:6px;"><i class="fas fa-lock-open text-success"></i><span>till</span><span style="color:' + tc + ';font-weight:600;">' + AdmPpEsc(tt) + '</span></div>';
          }).join('')
         + '</div>';
      }
    });

    if (!cardsHtml && onlyPermitted) {
      cardsHtml = '<div class="text-muted d-flex align-items-center justify-content-center" style="min-height:120px;">No already-permitted functions for this user</div>';
    }
    contentEl.innerHTML = cardsHtml;

    contentEl.querySelectorAll('.admPpPermArrow').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        AdmPpShowPermittedUsers(Number(this.dataset.fnH));
      });
    });

    prevSelected.forEach(function (key) {
      var cb = contentEl.querySelector('.admPpGvPrmCb[data-h="' + key + '"]');
      if (cb) {
        cb.checked = true;
        var card = cb.closest('.admPpGvPrmCard');
        if (card) {
          card.classList.add('border-primary', 'bg-light');
          card.style.borderColor = theme.brand;
        }
      }
    });
    window.gvPrmSelected = prevSelected;

    var tillInps = Array.prototype.slice.call(contentEl.querySelectorAll('.admPpCardTill'));
    for (var ti = 0; ti < tillInps.length; ti++) {
      var tInp = tillInps[ti];
      var tId = 'admPpCardTill_' + tInp.dataset.h;
      var tApi = await admPpInitPicker(tId, { autoNow: false, initialValue: (fpTillValues[tInp.dataset.h] || ''), displayFormatter: AdmPpFmtDisp });
      if (tApi) tInp.__dtApi = tApi;
    }
    tillInps.forEach(function (inp) {
      validateCardTill(inp);
      inp.addEventListener('change', function () {
        fpTillValues[inp.dataset.h] = admPpGetDTVal(inp);
        validateCardTill(inp);
      });
      inp.addEventListener('click', function (e) { e.stopPropagation(); });
      if (inp.__dtApi && inp.__dtApi.instance && typeof tempusDominus !== 'undefined') {
        inp.__dtApi.instance.subscribe(tempusDominus.Namespace.events.change, function () {
          fpTillValues[inp.dataset.h] = admPpGetDTVal(inp);
          validateCardTill(inp);
        });
      }
    });

    contentEl.querySelectorAll('.admPpCardDepth').forEach(function (inp) {
      if (fpDepthValues[inp.dataset.h]) inp.value = fpDepthValues[inp.dataset.h];
      inp.addEventListener('input', function () {
        var maxVal = parseInt(inp.getAttribute('max')) || 0;
        var num = parseInt(inp.value) || 0;
        if (maxVal >= 0 && num >= maxVal) { inp.value = maxVal - 1; num = maxVal - 1; }
        fpDepthValues[inp.dataset.h] = String(num);
      });
      inp.addEventListener('click', function (e) { e.stopPropagation(); });
    });

    contentEl.querySelectorAll('.admPpCardAllowCnt').forEach(function (inp) {
      if (fpAllowCntValues[inp.dataset.h]) inp.value = fpAllowCntValues[inp.dataset.h];
      inp.addEventListener('input', function () {
        var maxVal = parseInt(inp.getAttribute('max')) || 0;
        var num = parseInt(inp.value) || 0;
        if (maxVal >= 0 && num > maxVal) { inp.value = maxVal; num = maxVal; }
        fpAllowCntValues[inp.dataset.h] = String(num);
      });
      inp.addEventListener('click', function (e) { e.stopPropagation(); });
    });

    contentEl.querySelectorAll('.admPpGvPrmCard').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.admPpCardTill')) return;
        var cb = card.querySelector('.admPpGvPrmCb');
        if (e.target === cb || e.target.closest('.admPpGvPrmCb')) {
          // native checkbox already toggled — just sync state
        } else {
          cb.checked = !cb.checked;
        }
        var key = String(cb.dataset.h);
        if (cb.checked) { window.gvPrmSelected.add(key); } else { window.gvPrmSelected.delete(key); }
        card.classList.toggle('border-primary', cb.checked);
        card.classList.toggle('bg-light', cb.checked);
        card.style.borderColor = cb.checked ? theme.brand : '#6c757d';
        var till = card.querySelector('.admPpCardTill');
        if (till) validateCardTill(till);
        updateAllowBtnState();
      });
    });

    updateAllowBtnState();
  }

  function validateCardTill(inp) {
    var val = admPpGetDTVal(inp);
    var card = inp.closest('.admPpGvPrmCard');
    if (!card) return;
    var cb = card.querySelector('.admPpGvPrmCb');
    var isChecked = cb && cb.checked;
    var isInvalid = false;
    var reason = '';
    if (isChecked && !val) {
      isInvalid = true;
      reason = 'Date is required';
    } else if (val) {
      var d = new Date(val);
      var maxDate = inp.max ? new Date(inp.max) : null;
      var minDate = admPpMinDateFor(card);
      if (d < minDate) { isInvalid = true; reason = 'Date is before today'; }
      else if (maxDate && d > maxDate) { isInvalid = true; reason = 'Exceeds max allowed (' + AdmPpFormatDateTime(inp.max) + ')'; }
    }
    inp.classList.toggle('border-danger', isInvalid);
    inp.style.backgroundColor = isInvalid ? '#f8d7da' : '';
    card.dataset.tillInvalid = isInvalid ? '1' : '';
    var warnEl = card.querySelector('.admPpCardTillWarn');
    if (isInvalid) {
      if (!warnEl) {
        warnEl = document.createElement('div');
        warnEl.className = 'admPpCardTillWarn text-danger mt-1';
        warnEl.style.fontSize = '.72rem';
        card.appendChild(warnEl);
      }
      warnEl.textContent = reason;
      warnEl.style.display = 'block';
    } else if (warnEl) {
      warnEl.style.display = 'none';
    }
    updateAllowBtnState();
  }

  function updateAllowBtnState() {
    if (!allowBtn) return;
    var hasInvalid = false;
    contentEl.querySelectorAll('.admPpGvPrmCard').forEach(function (card) {
      var cb = card.querySelector('.admPpGvPrmCb');
      if (cb && cb.checked && card.dataset.tillInvalid === '1') hasInvalid = true;
    });
    var hasChecked = window.gvPrmSelected.size > 0;
    allowBtn.className = 'btn btn-sm w-100';
    allowBtn.style.opacity = '1';
    if (hasInvalid && hasChecked) {
      allowBtn.style.background = '#dc3545';
      allowBtn.style.borderColor = '#dc3545';
      allowBtn.style.color = '#ffffff';
      allowBtn.innerHTML = '<i class="fas fa-exclamation-triangle me-1"></i>Fix red dates before saving';
      allowBtn.disabled = true;
    } else {
      allowBtn.style.background = theme.brand;
      allowBtn.style.borderColor = theme.brand;
      allowBtn.style.color = theme.onBrand;
      allowBtn.innerHTML = 'Allow Selected';
      allowBtn.disabled = false;
    }
  }

  var activeFpList = myFp;
  window.admPpGvPrmRenderFp = function (list) {
    if (list) activeFpList = list;
    renderFpList(activeFpList);
  };
  renderFpList(activeFpList);

  if (tillInput) {
    function propagateTill(val) {
      val = val == null ? '' : String(val);
      if (!val) {
        contentEl.querySelectorAll('.admPpCardTill').forEach(function (inp) {
          admPpSetDTVal(inp, '');
          fpTillValues[inp.dataset.h] = '';
          validateCardTill(inp);
        });
        return;
      }
      var now = new Date();
      contentEl.querySelectorAll('.admPpCardTill').forEach(function (inp) {
        var maxDate = inp.max ? new Date(inp.max) : null;
        var chosen = new Date(val);
        if (isNaN(chosen.getTime())) chosen = now;
        var minDate = admPpMinDateFor(inp.closest('.admPpGvPrmCard'));
        if (chosen < minDate) chosen = minDate;
        if (maxDate && chosen > maxDate) chosen = maxDate;
        admPpSetDTVal(inp, AdmPpToInputDT(chosen));
        fpTillValues[inp.dataset.h] = admPpGetDTVal(inp);
        validateCardTill(inp);
      });
    }
    tillInput.addEventListener('change', function () {
      propagateTill(tillInput.value);
    });
    if (tillInput.__dtApi && tillInput.__dtApi.instance && typeof tempusDominus !== 'undefined') {
      tillInput.__dtApi.instance.subscribe(tempusDominus.Namespace.events.change, function () {
        propagateTill(admPpGetDTVal(tillInput));
      });
    }
  }

  allowBtn.addEventListener('click', async function () {
    if (admPpState.isGranting) return;
    var ids = Array.from(window.gvPrmSelected).map(Number).filter(function (n) { return !isNaN(n); });
    if (!ids.length) { showToast('Select at least one function', { type: 'warning', duration: 2000 }); return; }
    if (!admPpState.selectedUser || !admPpState.selectedUser.e) { showToast('Select a user first', { type: 'warning', duration: 2000 }); return; }
    var adminTill = {};
    myFp.forEach(function (r) { if (r.h !== undefined) adminTill[Number(r.h)] = r.j; });
    var validIds = ids.filter(function (id) {
      var fTill = adminTill[id];
      if (!fTill) return false;
      return new Date(fTill) > new Date();
    });
    var skipped = ids.filter(function (id) { return validIds.indexOf(id) === -1; });
    if (skipped.length) {
      showToast('Skipped ' + skipped.length + ' expired function(s) — you don\'t have active permission', { type: 'warning', duration: 3000 });
    }
    if (!validIds.length) {
      showToast('All selected functions expired for you — cannot grant', { type: 'warning', duration: 3000 });
      return;
    }
    var pArr = [];
    var hasInvalid = false;
    validIds.forEach(function (id) {
      var inp = contentEl.querySelector('.admPpCardTill[data-h="' + id + '"]');
      var dt = inp ? admPpGetDTVal(inp) : '';
      if (!dt || inp.dataset.tillInvalid === '1') { hasInvalid = true; return; }
      var depthInp = contentEl.querySelector('.admPpCardDepth[data-h="' + id + '"]');
      var depth = depthInp ? parseInt(depthInp.value) || 0 : 0;
      var allowInp = contentEl.querySelector('.admPpCardAllowCnt[data-h="' + id + '"]');
      var allowCount = allowInp ? parseInt(allowInp.value) || 0 : 0;
      pArr.push({ a: id, b: admPpToPayloadDT(dt), c: depth, d: allowCount });
    });
    if (hasInvalid) {
      showToast('Fix red dates before saving', { type: 'warning', duration: 2000 });
      return;
    }
    if (!pArr.length) {
      showToast('No valid permissions to grant', { type: 'warning', duration: 2000 });
      return;
    }
    var mob = admPpState.selectedUser.e;
    if (typeof payload0 === 'undefined') return;
    admPpState.isGranting = true;
    allowBtn.disabled = true;
    payload0.fn = 97;
    payload0.vw = 1;
    payload0.b = mob;
    payload0.p = pArr;
    var _ldDiv = document.createElement('div');
    _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
    _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
    document.body.appendChild(_ldDiv);
    try {
      var response = await fnj3('https://my1.in/3/b.php', payload0, 1, true, null, 20000, 0, 2, 1);
      _ldDiv.remove();
      if (response && response.su == 1) {
        window.showsuccessmodal('Permissions granted successfully');
        window.gvPrmSelected = new Set();
        admPpState.selectedUser = null;
        admPpSelUFPerms = [];
        fpTillValues = {};
        fpDepthValues = {};
        fpAllowCntValues = {};
        try {
          if (response.f && response.f.l) {
            await dbDexieManager.insertToDexie(dbnm, "f", response.f.l, true, ["a"]);
          }
          if (response.fp && response.fp.l) {
            await dbDexieManager.insertToDexie(dbnm, "fp", response.fp.l, true, ["a"]);
          }
        } catch (e) {
          console.warn('admPp: failed to persist fn97 tables', e);
        }
        await AdmPpLoadPermData();
        AdmPpOpenPermits();
        setTimeout(() => { location.reload() }, 640);
      } else {
        window.showelsemodal(response.ms || response.m || 'No success to grant permissions');
      }
    } catch (err) {
      _ldDiv.remove();
      window.showelsemodal(err);
    } finally {
      allowBtn.disabled = false;
      admPpState.isGranting = false;
    }
  });

  personBtn.addEventListener('click', async function () {
    console.log('admPp: opening ei.js for user selection');
    var xtraEiFlds = typeof window[my1uzr.worknOnPg].clientConfig !== 'undefined' && typeof window[my1uzr.worknOnPg].clientConfig.xtraEiFlds_forCust !== 'undefined'
     ? window[my1uzr.worknOnPg].clientConfig.xtraEiFlds_forCust : null;
    const t987 = getCacheId("ei.js");
    await loadExe2Fn(t987, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_AdmPpGvPrmUserSelect', 1, xtraEiFlds], [1]);
  });

  dropMenu.addEventListener('click', function (e) {
    var item = e.target.closest('[data-mod-idx]');
    if (!item) return;
    e.preventDefault();
    e.stopPropagation();
    var idx = parseInt(item.dataset.modIdx, 10);
    if (isNaN(idx)) return;
    dropBtn.dataset.modIdx = idx;
    bootstrap.Dropdown.getInstance(dropBtn).hide();
    if (idx === -1) {
      dropBtn.innerHTML = '<i class="fas fa-link me-1"></i> Select Module';
      window.admPpGvPrmRenderFp(myFp);
    } else {
      dropBtn.innerHTML = '<i class="fas ' + AdmPpEsc(mods[idx].c || 'fa-cube') + ' me-1" style="color:' + (mods[idx].e && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(mods[idx].e) ? AdmPpEsc(mods[idx].e) : theme.brand) + ';"></i>' + AdmPpEsc(mods[idx].b);
      var modIds = new Set(String(mods[idx].a || '').split(',').map(function (s) { return parseInt(s, 10); }).filter(function (n) { return !isNaN(n) && n > 0; }));
      var filtered = myFp.filter(function (r) { return modIds.has(Number(r.h)); });
      window.admPpGvPrmRenderFp(filtered);
    }
  });

  var refreshBtn = admPpModalRefs.element && admPpModalRefs.element.querySelector('#admPpRefreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', function () { AdmPpRefreshPerms(this); });
}


window.commonFnToRunAfter_AdmPpGvPrmUserSelect = async function (obj, swtch) {
  if (swtch === undefined) swtch = 1;
  console.log('admPp: user select callback fired, swtch:', swtch, 'obj:', obj);
  if (swtch !== 1) {
    if (typeof showToast === 'function') showToast('Please select a valid user', { type: 'warning', duration: 2000 });
    return;
  }
  var root = admPpModalRefs.element && admPpModalRefs.element.querySelector('#admPp_view_permits');
  if (!root) return;

  var uid = obj.a || '';
  var mob = obj.e || '';
  var name = obj.h || obj.i || 'Unknown';
  admPpState.selectedUser = { a: uid, e: mob, f: obj.f, h: name };
  console.log('admPp: user stored:', admPpState.selectedUser);

  admPpSelUFPerms = [];
  if (mob) {
    admPpSelUFPerms = (window[my1uzr.worknOnPg].admPp_f || []).filter(function (r) {
      return String(r.e) === mob && (obj.f === undefined || String(r.f) === String(obj.f));
    });
  }

  var userInfo = root.querySelector('#admPpGvPrmUserInfo');
  if (userInfo) userInfo.classList.add('d-none');

  var personBtn = root.querySelector('#admPpGvPrmPersonBtn');
  if (personBtn) {
    personBtn.innerHTML = '<i class="fas fa-user-check me-1"></i> ' + AdmPpEsc(name) + (mob ? ' (' + AdmPpEsc(mob) + ')' : '');
    personBtn.classList.remove('btn-outline-primary');
    personBtn.classList.add('btn-success');
    personBtn.style.background = '';
    personBtn.style.whiteSpace = 'nowrap';
    personBtn.style.overflow = 'hidden';
    personBtn.style.textOverflow = 'ellipsis';
  }

  document.querySelectorAll('.modal-backdrop').forEach(function (el) { el.remove(); });
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  setTimeout(function () {
    if (admPpModalRefs.instance) {
      admPpModalRefs.instance.show();
      setTimeout(function () {
        var backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(function (el, i) { if (i > 0) el.remove(); });
      }, 100);
    }
  }, 300);

  if (typeof showToast === 'function') showToast('User selected: ' + name, { type: 'success', duration: 2000 });
  var onlyCb = root.querySelector('#admPpGvPrmOnlyPermittedCb');
  if (onlyCb) onlyCb.disabled = false;
  if (typeof window.admPpGvPrmRenderFp === 'function') window.admPpGvPrmRenderFp();
};

async function AdmPpRefreshPerms(btn) {
  const doRefresh = async () => {
    payload0.fn = 95;
    payload0.vw = 1;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: 'fp' }, { tb: 'f' }]);
    const loader = AdmPpShowLoader();
    try {
      const response = await fnj3('https://my1.in/3/b.php', payload0, 1, true, null, 20000, 0, 2, 1);
      if (response.su == 1) {
          if (response.f && response.f.l) {
            await dbDexieManager.insertToDexie(dbnm, "f", response.f.l, true, ["a"]);
          }
          if (response.fp && response.fp.l) {
            await dbDexieManager.insertToDexie(dbnm, "fp", response.fp.l, true, ["a"]);
          }
        await new Promise(r => setTimeout(r, 500));
        await AdmPpLoadPermData();
        if (admPpState.view === 'permits') await AdmPpOpenPermits();
        else if (admPpState.view === 'proxy') await AdmPpOpenProxy();
        showsuccessmodal("Permissions refreshed successfully!");
        setTimeout(() => { location.reload() }, 400);
      } else {
        showelsemodal(response.m || "Failed to refresh permissions");
      }
    } catch (e) {
      console.error('Refresh error:', e);
      showelsemodal("Failed to refresh permissions");
    } finally {
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    }
  };
  if (typeof window.withRefreshAnimation === 'function') {
    await window.withRefreshAnimation(btn, doRefresh);
  } else {
    await doRefresh();
  }
}

// Open the profile / permissions modal
async function open_my1ctr(...args) {
  id_of_dv_my1ctr_to_set_processed_dom_object = args[0];
  switch_my1ctr_create_nw_modal = args[1] || 0;
  swtch_0nothing_1flex_2block_my1ctr = args[2] || 0;
  swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn = args[3] || 0;

  if (swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === 2) {
    if (isLoggedIn()) {
      showUserInfoModal();
    } else{
      const t987 = getCacheId("my1lp.js");
    await loadExe2Fn(t987, [], [1]);
    }
  }
}

function logPout() {
  my1uzr = null;
  localStorage.setItem("my1uzr", null);
  setTimeout(() => {
    location.reload();
  }, 300);
}

function initLoginSystem() {
  const loginButton = document.getElementById('el_sho_login_modal');
  if (loginButton) {
    loginButton.addEventListener('click', function () {
      open_my1ctr([]);
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initLoginSystem();
});