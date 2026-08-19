// ei.js - Entity/Individual CRUD
// Premium Bootstrap Design

let d_entInd_ata = [],
  f1nEiToExe = null,
  loaderElement = null,
  s_ei_witchToReturn = null,
  currentEditingRecord = null,
  currentModalId = null,
  myxtraFlds_fildsToNeeds = null,
  eiInpStyle = "";

// ========== ei.js self-contained theme engine (uses global appcss like my1lo.js) ==========
function eiToHex(rgb) {
  if (!rgb) return null;
  var to2 = function (n) {
    n = Math.max(0, Math.min(255, Math.round(n)));
    return ("0" + n.toString(16)).slice(-2);
  };
  return "#" + to2(rgb.r) + to2(rgb.g) + to2(rgb.b);
}
function eiParseRgb(value) {
  if (!value) return null;
  value = value.trim();
  var m = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    var hex = m[1];
    if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
    return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
  }
  m = value.match(/^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/i);
  if (m) return { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]) };
  m = value.match(/^rgb\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
  if (m) return { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]) };
  return null;
}
function eiShift(rgb, amt) {
  if (!rgb) return null;
  var f = function (c) { return c + Math.round(255 * amt); };
  return { r: f(rgb.r), g: f(rgb.g), b: f(rgb.b) };
}
function eiLuminance(rgb) {
  if (!rgb) return 0;
  var f = function (c) {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(rgb.r) + 0.7152 * f(rgb.g) + 0.0722 * f(rgb.b);
}
function eiTextOn(rgb) {
  if (!rgb) return "#ffffff";
  return eiLuminance(rgb) > 0.5 ? "#212529" : "#ffffff";
}
function eiToRgba(value, alpha) {
  var rgb = eiParseRgb(value);
  if (!rgb) return null;
  return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
}
function eiMix(hexA, hexB, t) {
  var a = eiParseRgb(hexA),
    b = eiParseRgb(hexB);
  if (!a || !b) return hexA;
  var mix = function (x, y) { return Math.round(x + (y - x) * t); };
  return eiToHex({ r: mix(a.r, b.r), g: mix(a.g, b.g), b: mix(a.b, b.b) });
}
function eiHslToRgb(h, s, l) {
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
function eiExtractColors(value) {
  var out = [];
  if (!value || typeof value !== "string") return out;
  var m;
  var hexRe = /#([0-9a-fA-F]{3,8})\b/g;
  while ((m = hexRe.exec(value)) !== null) {
    var hex = m[1];
    if (hex.length === 3 || hex.length === 4) hex = hex.split("").map(function (c) { return c + c; }).join("");
    if (hex.length === 6 || hex.length === 8) {
      hex = hex.slice(0, 6).toLowerCase();
      var rgb = { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
      out.push({ hex: "#" + hex, rgb: rgb });
    }
  }
  var rgbRe = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,\/]\s*[\d.%]+)?\s*\)/gi;
  while ((m = rgbRe.exec(value)) !== null) {
    var r = Math.round(+m[1]),
      g = Math.round(+m[2]),
      b = Math.round(+m[3]);
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      out.push({ hex: eiToHex({ r: r, g: g, b: b }), rgb: { r: r, g: g, b: b } });
    }
  }
  var hslRe = /hsla?\(\s*([\d.]+)(?:deg)?\s*[,\s]+([\d.]+)%\s*[,\s]+([\d.]+)%(?:\s*[,\/]\s*[\d.%]+)?\s*\)/gi;
  while ((m = hslRe.exec(value)) !== null) {
    var rgb2 = eiHslToRgb(+m[1], +m[2], +m[3]);
    if (rgb2) out.push({ hex: eiToHex(rgb2), rgb: rgb2 });
  }
  return out;
}
function eiCssVars(cssText) {
  var vars = {};
  var re = /(--[a-zA-Z0-9_-]+\s*:\s*[^;]+;)/g;
  var m;
  while ((m = re.exec(cssText)) !== null) {
    var idx = m[1].indexOf(":");
    var name = m[1].slice(0, idx).trim();
    var val = m[1].slice(idx + 1).replace(/;$/, "").trim();
    vars[name] = val;
  }
  return vars;
}
function eiResolveVar(value, vars, depth) {
  if (!value || typeof value !== "string" || value.indexOf("var(") === -1) return value;
  depth = depth || 0;
  if (depth > 6) return value;
  return value.replace(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,\s*([^)]*))?\)/g, function (m, name, fallback) {
    if (vars[name] !== undefined) return eiResolveVar(vars[name], vars, depth + 1);
    if (fallback !== undefined) return fallback.trim();
    return m;
  });
}
function eiParseCss(cssText) {
  var rules = [];
  if (!cssText || typeof cssText !== "string") return rules;
  var text = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  var len = text.length;
  var i = 0;
  while (i < len) {
    var brace = text.indexOf("{", i);
    if (brace === -1) break;
    var selector = text.slice(i, brace).trim();
    var depth = 1;
    var j = brace + 1;
    while (j < len && depth > 0) {
      if (text.charAt(j) === "{") depth++;
      else if (text.charAt(j) === "}") depth--;
      j++;
    }
    var block = text.slice(brace + 1, j - 1);
    if (selector && selector.charAt(0) !== "@") {
      rules.push({ selector: selector, block: block });
    } else if (/^@media/i.test(selector)) {
      var nested = eiParseCss(block);
      for (var k = 0; k < nested.length; k++) rules.push(nested[k]);
    }
    i = j;
  }
  return rules;
}
function eiSplitDecls(block) {
  var parts = [];
  if (!block) return parts;
  var cur = "",
    depth = 0;
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
function eiAnalyzeTheme(cssText) {
  var report = { brand: null, brandHex: null, brandDark: null, onBrand: "#ffffff", glow: null, lightBg: null, ink: null, secondary: null };
  if (!cssText || typeof cssText !== "string") return report;
  var rules = eiParseCss(cssText);
  var vars = eiCssVars(cssText);
  var usage = {};
  function addUsage(hex, rgb) {
    if (!usage[hex]) usage[hex] = { hex: hex, rgb: rgb, count: 0, textCount: 0, accentText: 0, bgCount: 0, bodyBg: 0, sectionBg: 0, btnBg: 0, varSem: 0 };
    return usage[hex];
  }
  var firstColorVar = true;
  for (var vname in vars) {
    var resolved = eiResolveVar(vars[vname], vars, 0);
    var colors = eiExtractColors(resolved);
    if (!colors.length) continue;
    var nl = vname.toLowerCase();
    var sem = 0;
    if (/(ember|brand|primary|accent|main|theme|cta|color1|c1|b1|saffron|maroon|brick)/.test(nl)) sem += 3;
    if (/(gold|amber|orange|copper)/.test(nl)) sem += 1;
    if (/(bg|background|surface|cream|light|page|paper|card|body|sheet)/.test(nl)) sem += 2;
    if (/(ink|text|muted|dark|charcoal|brown)/.test(nl)) sem += 1;
    if (firstColorVar) { sem += 2; firstColorVar = false; }
    for (var ci = 0; ci < colors.length; ci++) {
      var u = addUsage(colors[ci].hex, colors[ci].rgb);
      u.count += 0.5;
      u.varSem = Math.max(u.varSem, sem);
    }
  }
  for (var r = 0; r < rules.length; r++) {
    var rule = rules[r];
    var decls = eiSplitDecls(rule.block);
    var selL = rule.selector.toLowerCase();
    var isBody = /(^|\s)(body|html)([\s,:>{]|$)/.test(selL);
    var isBtn = /(^|[\s.#>])ht?-?btn|\.btn|button/i.test(selL);
    var isAccentText = /price|total|amt|active|back|ribbon|kicker|cta|emphas|selected/i.test(selL);
    var isSection = /card|section|modal|surface|summary|room|bill|sheet|page|container|hero|filter|panel|wrap|box|listing/i.test(selL);
    for (var d = 0; d < decls.length; d++) {
      var item = decls[d];
      var ci2 = item.indexOf(":");
      if (ci2 === -1) continue;
      var prop = item.slice(0, ci2).trim().toLowerCase();
      var value = eiResolveVar(item.slice(ci2 + 1).trim(), vars, 0);
      var cols = eiExtractColors(value);
      if (!cols.length) continue;
      var isBorder = prop.indexOf("border") === 0;
      var isBg = prop.indexOf("background") === 0;
      var isText = prop === "color";
      for (var c = 0; c < cols.length; c++) {
        var u2 = addUsage(cols[c].hex, cols[c].rgb);
        u2.count++;
        if (isText) { u2.textCount++; if (isAccentText) u2.accentText++; }
        if (isBg) { u2.bgCount++; if (isBody) u2.bodyBg++; if (isSection) u2.sectionBg++; if (isBtn) u2.btnBg++; }
        if (isBorder) u2.borderCount = (u2.borderCount || 0) + 1;
      }
    }
  }
  var hexes = Object.keys(usage);
  var lightBest = null,
    lightScore = -1,
    brandBest = null,
    brandScore = -1,
    inkBest = null,
    inkScore = -1;
  for (var h = 0; h < hexes.length; h++) {
    var hex = hexes[h];
    var u3 = usage[hex];
    var lum = eiLuminance(u3.rgb);
    var sat = (Math.max(u3.rgb.r, u3.rgb.g, u3.rgb.b) - Math.min(u3.rgb.r, u3.rgb.g, u3.rgb.b)) / 255;
    if (lum > 0.72 && sat < 0.4) {
      var s = u3.count + u3.bodyBg * 8 + u3.sectionBg * 1.5 + u3.bgCount * 0.5;
      if (u3.varSem >= 2) s += 2;
      if (hex === "#ffffff") s -= 5;
      if (s > lightScore) { lightScore = s; lightBest = hex; }
    }
    if (lum < 0.42 && sat < 0.3 && u3.textCount > 0) {
      var s2 = u3.textCount * 2 + u3.count * 0.5;
      if (u3.varSem) s2 += 1;
      if (s2 > inkScore) { inkScore = s2; inkBest = hex; }
    }
    if (sat >= 0.18 && lum > 0.05 && lum < 0.95) {
      var s3 = u3.count * 0.5 + u3.textCount * 0.3 + u3.accentText * 4 + u3.btnBg * 3 + (u3.borderCount || 0) * 1.5 + (u3.varSem >= 3 ? 5 : u3.varSem >= 2 ? 1 : 0);
      if (s3 > brandScore) { brandScore = s3; brandBest = hex; }
    }
  }
  var secondScore = -1,
    secondHex = null;
  for (var h2 = 0; h2 < hexes.length; h2++) {
    if (hexes[h2] === brandBest) continue;
    var u4 = usage[hexes[h2]];
    var lum2 = eiLuminance(u4.rgb);
    var sat2 = (Math.max(u4.rgb.r, u4.rgb.g, u4.rgb.b) - Math.min(u4.rgb.r, u4.rgb.g, u4.rgb.b)) / 255;
    if (sat2 >= 0.18 && lum2 > 0.05 && lum2 < 0.95) {
      var s4 = u4.count * 0.5 + u4.accentText * 3 + u4.btnBg * 3 + (u4.varSem ? u4.varSem : 0);
      if (s4 > secondScore) { secondScore = s4; secondHex = hexes[h2]; }
    }
  }
  report.brand = brandBest;
  report.lightBg = lightBest;
  report.ink = inkBest;
  report.secondary = secondHex;
  if (brandBest) {
    var rgb = usage[brandBest].rgb;
    report.brandHex = brandBest;
    report.brandDark = eiToHex(eiShift(rgb, -0.14));
    report.onBrand = eiTextOn(rgb);
    report.glow = eiToRgba(brandBest, 0.25);
  }
  return report;
}
function eiReadRootVars() {
  var out = {};
  if (typeof document === "undefined" || !document.documentElement) return out;
  var cs = getComputedStyle(document.documentElement);
  var names = ["--primary-purple", "--ember", "--brand", "--brand-color", "--secondary-gold", "--gold", "--light-purple", "--dark-purple", "--ember-dark", "--surface", "--cream", "--ink", "--charcoal", "--gold-bg", "--gray-surface", "--light-bg"];
  for (var i = 0; i < names.length; i++) {
    try {
      var v = cs.getPropertyValue(names[i]).trim();
      if (v) out[names[i]] = v;
    } catch (e) {}
  }
  return out;
}
function eiResolvePalette(src) {
  var p = {
    brand: "#6f42c1",
    brandDark: "#4a2d7e",
    onBrand: "#ffffff",
    secondary: "#ffd700",
    onSecondary: "#212529",
    lightBg: "#e2d9f3",
    surface: "#ffffff",
    ink: "#4a2d7e",
    glow: "rgba(111, 66, 193, 0.25)",
    goldBg: "#fff8e1",
    goldDark: "#a68a00",
    header1: "#a98ce0",
    header2: "#7a5cc0"
  };
  var report = null;
  var rv = eiReadRootVars();
  var brand = rv["--primary-purple"] || rv["--ember"] || rv["--brand"] || rv["--brand-color"] || null;
  var dark = rv["--dark-purple"] || rv["--ember-dark"] || null;
  var gold = rv["--secondary-gold"] || rv["--gold"] || null;
  var lightBg = rv["--light-purple"] || rv["--light-bg"] || rv["--surface"] || rv["--cream"] || null;
  var ink = rv["--ink"] || rv["--charcoal"] || rv["--dark-purple"] || null;
  if (src && typeof src === "string") report = eiAnalyzeTheme(src);
  if (!brand && report && report.brand) brand = report.brand;
  if (!gold && report && report.secondary) gold = report.secondary;
  if (!lightBg && report && report.lightBg) lightBg = report.lightBg;
  if (!ink && report && report.ink) ink = report.ink;
  if (!dark && report && report.brandDark) dark = report.brandDark;
  if (brand) {
    var bRgb = eiParseRgb(brand);
    if (bRgb) {
      p.brand = eiToHex(bRgb);
      p.onBrand = eiTextOn(bRgb);
      p.glow = eiToRgba(p.brand, 0.25);
      if (!dark) dark = eiToHex(eiShift(bRgb, -0.14));
    }
  }
  if (dark) {
    var dRgb = eiParseRgb(dark);
    if (dRgb) p.brandDark = eiToHex(dRgb);
  }
  if (gold) {
    var gRgb = eiParseRgb(gold);
    if (gRgb) {
      p.secondary = eiToHex(gRgb);
      p.onSecondary = eiTextOn(gRgb);
      p.goldBg = eiMix("#ffffff", p.secondary, 0.12);
    }
  }
  if (lightBg) {
    var lRgb = eiParseRgb(lightBg);
    if (lRgb) {
      p.lightBg = eiToHex(lRgb);
      p.surface = eiMix("#ffffff", p.lightBg, 0.35);
    }
  }
  if (ink) {
    var iRgb = eiParseRgb(ink);
    if (iRgb) p.ink = eiToHex(iRgb);
  }
  p.goldDark = eiMix(p.secondary, "#000000", 0.35);
  p.header1 = eiMix(p.brand, "#ffffff", 0.3);
  p.header2 = eiMix(p.brandDark, "#ffffff", 0.12);
  return p;
}
function eiGenerateTheme(cssText) {
  return eiResolvePalette(cssText);
}
function eiTheme() {
  if (!window.__eiPalette) {
    var src = typeof appcss !== "undefined" && appcss ? appcss : "";
    window.__eiPalette = eiGenerateTheme(src);
  }
  return window.__eiPalette;
}
function eiApplyTheme() {
  var src = typeof appcss !== "undefined" && appcss ? appcss : "";
  if (typeof window.eiApplyThemeRan === "undefined") {
    console.log("🎨 ei.js theme applied (inline)" + (src ? " from appcss" : " default"));
    window.eiApplyThemeRan = true;
  }
  window.__eiPalette = eiGenerateTheme(src);
}

if (typeof isFieldVisible !== "function") {
  window.isFieldVisible = function (fieldId) {
    var el = document.getElementById(fieldId);
    if (!el) return false;
    return el.offsetParent !== null;
  };
}

function getHiddenFields() {
  var c = window[my1uzr.worknOnPg]?.colsToHidePartyDetails || "";
  if (!c) return [];
  return c
    .split(",")
    .map(function (k) {
      return k.trim().toLowerCase();
    })
    .filter(function (k) {
      return k;
    });
}
function isFieldHidden(fk) {
  return getHiddenFields().includes(fk);
}

async function open_entind_crud(...args) {
  console.log("🚀 open_entind_crud called");

  if (args.length === 0) return;
  loaderElement = document.getElementById(args[0] || null);
  var trgt = args[2] || null;
  f1nEiToExe = args[3] || null;
  s_ei_witchToReturn = args[4] || null;
  myxtraFlds_fildsToNeeds = args[5] || null;
  if (loaderElement) loaderElement.style.display = "flex";

  try {
    d_entInd_ata = await dbDexieManager.getAllRecords(dbnm, "c");
    d_entInd_ata.sort(function (a, b) {
      return new Date(b.b) - new Date(a.b);
    });

    setTimeout(function () {
      if (loaderElement) loaderElement.style.display = "none";
      currentModalId =
        "entind_modal_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substr(2, 9);
      var mr = create_modal_dynamically(currentModalId),
        modal = mr.modalElement,
        mc = mr.contentElement;
      var md = modal.querySelector(".modal-dialog");
      if (md) {
        md.classList.remove("modal-dialog-centered", "modal-dialog-scrollable");
        md.style.marginTop = "80px";
        md.style.maxWidth = "640px";
        md.style.height = "calc(100vh - 100px)";
        md.style.maxHeight = "calc(100vh - 100px)";
        md.style.display = "flex";
        md.style.flexDirection = "column";

        var oc = mc.parentElement;
        oc.style.height = "100%";
        oc.style.display = "flex";
        oc.style.flexDirection = "column";
        oc.style.minHeight = "0";

        mc.style.height = "100%";
        mc.style.maxHeight = "none";
        mc.style.flex = "1";
        mc.style.minHeight = "0";
        mc.style.overflow = "hidden";
      }
      var ec = document.getElementById(trgt);
      if (ec && ec.parentNode) ec.remove();
      mc.id = trgt;
      mc.className = "modal-content h-100 d-flex flex-column";
      renderCRUDInterface(mc);
      mr.modalInstance.show();
      modal.addEventListener("shown.bs.modal", function () {
        var s = document.getElementById("entindSearch");
        if (s) {
          s.focus();
          s.select();
        }
      });
      modal.addEventListener("hidden.bs.modal", function () {
        closeSpecificModal(currentModalId);
        modal.remove();
        currentModalId = null;
      });
    }, 500);
  } catch (e) {
    console.error("Error:", e);
    if (loaderElement) loaderElement.style.display = "none";
    window.showelsemodal("Info", "❌ " + e.message, false);
  }
}

function closeSpecificModal(id) {
  var m = document.getElementById(id);
  if (m) {
    var i = bootstrap.Modal.getInstance(m);
    if (i) i.hide();
  }
  currentModalId = null;
}

function renderCRUDInterface(container) {
  eiApplyTheme();
  var p = eiTheme();
  var bNavy =
    "display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:600;font-size:14px;line-height:1.2;padding:9px 16px;border:none;border-radius:10px;cursor:pointer;white-space:nowrap;background:linear-gradient(135deg," +
    p.brand +
    "," +
    p.brandDark +
    ");color:" +
    p.onBrand +
    ";box-shadow:0 4px 14px " +
    p.glow +
    ";";
  var bGold =
    "display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:600;font-size:14px;line-height:1.2;padding:9px 16px;border:none;border-radius:10px;cursor:pointer;white-space:nowrap;background:linear-gradient(135deg," +
    p.secondary +
    "," +
    eiMix(p.secondary, "#000000", 0.2) +
    ");color:" +
    p.onSecondary +
    ";box-shadow:0 4px 14px rgba(0,0,0,.35);";
  var bSec =
    "display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:600;font-size:14px;line-height:1.2;padding:9px 16px;border:none;border-radius:10px;cursor:pointer;white-space:nowrap;background:#fff;border:2px solid #6c757d;color:#6c757d;";
  var bDanger =
    "display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:600;font-size:14px;line-height:1.2;padding:9px 16px;border:none;border-radius:10px;cursor:pointer;white-space:nowrap;background:linear-gradient(135deg,#e35d6a,#dc3545);color:#fff;box-shadow:0 4px 12px rgba(220,53,69,.3);";
  var bSm = "font-size:12px;padding:6px 12px;border-radius:8px;";
  var inp =
    "display:block;width:100%;background:#fff;border:2px solid #6c757d;border-radius:10px;padding:8px 12px;font-size:14px;color:" +
    p.ink +
    ";outline:none;";
  var badgeGold =
    "display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;letter-spacing:.3px;background:" +
    p.secondary +
    ";color:" +
    p.onSecondary +
    ";";
  var badgeNavy =
    "display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;letter-spacing:.3px;background:" +
    p.brand +
    ";color:" +
    p.onBrand +
    ";";
  var cardS =
    "background:" +
    p.surface +
    ";border:1px solid #6c757d;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.06);";
  var hCC = isFieldHidden("cc"),
    hPN = isFieldHidden("pn"),
    hRS = isFieldHidden("rs"),
    hNE = isFieldHidden("ne"),
    hAD = isFieldHidden("ad");

  container.innerHTML = `
<!-- ========== HEADER ========== -->
<div class="modal-header bg-navy-gradient text-gold" style="padding:14px 20px;border-bottom:3px solid ${p.goldDark};flex-shrink:0;position:relative;background:linear-gradient(135deg,${eiMix(p.brand, "#ffffff", 0.12)},${eiMix(p.brandDark, "#ffffff", 0.08)});">
  <div class="d-flex align-items-center gap-3 w-100 flex-wrap" style="padding-right:34px;">
    <h5 class="modal-title fw-bold text-white" style="color:#fff;font-size:17px;white-space:nowrap;">
      <i class="fas fa-users me-2" style="color:${p.secondary};"></i>Members
    </h5>
    <div class="d-flex gap-2" style="flex:1 1 300px;min-width:100%;max-width:100%;">
      <button type="button" id="bt_sho_ad_ei" class="btn-premium btn-premium-primary btn-premium-sm" style="flex-shrink:0;${bGold}${bSm}" title="Add New Member">
        <i class="fas fa-plus"></i>
      </button>
      <input type="text" class="form-control-premium" id="entindSearch" placeholder="🔍 Search by ID, Mobile, Name..." style="flex:1 1 auto;width:auto;min-width:80px;${inp}">
      <button class="btn-premium btn-premium-secondary btn-premium-sm" style="flex-shrink:0;${bSec}${bSm}" type="button" id="clearSearch" title="Clear Search">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" style="position:absolute;top:14px;right:18px;flex-shrink:0;"></button>
  </div>
</div>

<!-- ========== BODY ========== -->
<div class="modal-body p-3" style="display:flex;flex-direction:column;overflow:hidden;flex:1;min-height:0;background:${p.lightBg};">

  <!-- Add New Form -->
  <div id="addNewWhenNotFound" class="d-none" style="flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;">
    <div class="card-premium p-3 mb-3" style="${cardS}">
      <div class="add-form-title mb-3 pb-2" style="border-bottom:2px solid ${p.brand};">
        <i class="fas fa-user-plus me-2" style="color:${p.brand};"></i>
        <span class="fw-bold" style="color:${p.brand};font-size:16px;">Add New Member</span>
      </div>

      <!-- Mobile Number -->
      <div class="mb-2 d-flex align-items-center gap-2 flex-wrap" style="${hCC && hPN ? "display:none;" : ""}padding:8px 10px;border-radius:.5rem;background:${p.goldBg};border:2px solid #6c757d;">
        <label class="form-label m-0 fw-bold" style="flex-shrink:0;width:120px;color:#343a40;font-size:13px;">
          <i class="fas fa-phone me-1" style="color:${p.brand};"></i> Mobile Number
        </label>
        <div class="d-flex gap-2 align-items-center" style="flex:1;min-width:220px;">
          <div style="${hCC ? "display:none;" : ""}flex-shrink:0;width:100px;">
            <select class="form-select-premium" id="quickCountryCode" data-bc="${p.secondary}" style="${inp}font-size:13px;padding:8px 6px;">
              <option value="91" selected>🇮🇳 +91</option>
              <option value="1">🇺🇸 +1</option>
              <option value="44">🇬🇧 +44</option>
            </select>
          </div>
          <div style="${hPN ? "display:none;" : ""}flex:1;min-width:140px;">
            <input type="text" class="form-control-premium" id="quickMobile" placeholder="Enter Mobile Number" required maxlength="10" data-bc="${p.secondary}" style="font-size:14px;${inp}" oninput="this.value=this.value.replace(/\D/g,'').slice(0,10)">
            <span class="error-text" id="mobileError" style="font-size:11px;color:#dc3545;display:none;margin-top:2px;">Must be 10 digits</span>
          </div>
        </div>
      </div>

      <!-- Name English + Relation -->
      <div class="mb-2" style="${hNE ? "display:none;" : ""}padding:8px 10px;border-radius:.5rem;background:${p.goldBg};border:2px solid #6c757d;">
        <label class="form-label m-0 fw-bold mb-2" style="color:#343a40;font-size:13px;">
          <i class="fas fa-font me-1" style="color:${p.brand};"></i> Name
        </label>
        <div class="d-flex align-items-center gap-2">
        <div style="flex:1;min-width:0;">
          <input type="text" class="form-control-premium" id="quickNameEnglish" placeholder="Enter Name" maxlength="64" data-bc="${p.secondary}" style="font-size:14px;${inp}">
          <span class="error-text" id="nameError" style="font-size:11px;color:#dc3545;display:none;">Name is required</span>
        </div>
        <div style="${hRS ? "display:none;" : ""}position:relative;flex-shrink:0;">
          <button type="button" id="relationBtn" title="Select Relation" style="display:inline-flex;align-items:center;gap:4px;font-weight:600;font-size:14px;line-height:1.5;padding:8px 6px;border-radius:8px;cursor:pointer;white-space:nowrap;border:2px solid ${p.brand};background:#fff;color:${p.brand};">
            <i class="fas fa-tag"></i><span id="relationBtnText">self [स्वतः]</span><i class="fas fa-caret-down"></i>
          </button>
          <div id="relationDropdown" style="display:none;position:absolute;top:calc(100% + 4px);right:0;z-index:1060;min-width:190px;max-height:230px;overflow-y:auto;background:#fff;border:1px solid ${p.brand};border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:4px;">
            <div class="rel-opt" data-rv="1" onclick="selectRelation(1)" onmouseover="this.style.background='#f0eaff'" onmouseout="this.style.background=''" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:${p.ink};"><i class="fas fa-check" style="width:14px;color:${p.brand};"></i>self [स्वतः]</div>
            <div class="rel-opt" data-rv="2" onclick="selectRelation(2)" onmouseover="this.style.background='#f0eaff'" onmouseout="this.style.background=''" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:${p.ink};"><i class="fas fa-check" style="width:14px;color:${p.brand};"></i>relative 1</div>
            <div class="rel-opt" data-rv="3" onclick="selectRelation(3)" onmouseover="this.style.background='#f0eaff'" onmouseout="this.style.background=''" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:${p.ink};"><i class="fas fa-check" style="width:14px;color:${p.brand};"></i>relative 2</div>
            <div class="rel-opt" data-rv="4" onclick="selectRelation(4)" onmouseover="this.style.background='#f0eaff'" onmouseout="this.style.background=''" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:${p.ink};"><i class="fas fa-check" style="width:14px;color:${p.brand};"></i>relative 3</div>
            <div class="rel-opt" data-rv="5" onclick="selectRelation(5)" onmouseover="this.style.background='#f0eaff'" onmouseout="this.style.background=''" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:${p.ink};"><i class="fas fa-check" style="width:14px;color:${p.brand};"></i>relative 4</div>
            <div class="rel-opt" data-rv="6" onclick="selectRelation(6)" onmouseover="this.style.background='#f0eaff'" onmouseout="this.style.background=''" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:${p.ink};"><i class="fas fa-check" style="width:14px;color:${p.brand};"></i>relative 5</div>
            <div class="rel-opt" data-rv="7" onclick="selectRelation(7)" onmouseover="this.style.background='#f0eaff'" onmouseout="this.style.background=''" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:${p.ink};"><i class="fas fa-check" style="width:14px;color:${p.brand};"></i>relative 6</div>
            <div class="rel-opt" data-rv="8" onclick="selectRelation(8)" onmouseover="this.style.background='#f0eaff'" onmouseout="this.style.background=''" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:${p.ink};"><i class="fas fa-check" style="width:14px;color:${p.brand};"></i>relative 7</div>
            <div class="rel-opt" data-rv="9" onclick="selectRelation(9)" onmouseover="this.style.background='#f0eaff'" onmouseout="this.style.background=''" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:${p.ink};"><i class="fas fa-check" style="width:14px;color:${p.brand};"></i>relative 8</div>
          </div>
          <select class="form-select-premium" id="quickRelation" data-bc="${p.brand}" style="display:none;">
            <option value="1" selected>self [स्वतः]</option>
            <option value="2">relative 1</option><option value="3">relative 2</option>
            <option value="4">relative 3</option><option value="5">relative 4</option>
            <option value="6">relative 5</option><option value="7">relative 6</option>
            <option value="8">relative 7</option><option value="9">relative 8</option>
          </select>
        </div>
        </div>
      </div>

      <!-- Dynamic Extra Fields (from myxtraFlds_fildsToNeeds) -->
      <div id="eiDynamicFields"></div>

      <div style="display:none;">
        <textarea id="quickImageUrl"></textarea>
        <input type="hidden" id="editRecordId">
      </div>

      <!-- Buttons -->
      <div class="text-center mt-3">
        <button type="button" class="btn-premium btn-premium-primary me-2" id="quickSave" style="${bNavy}">
          <i class="fas fa-save me-1"></i> Save
        </button>
        <button type="button" class="btn-premium btn-premium-secondary" id="cancelAddNew" style="${bSec}">
          <i class="fas fa-times me-1"></i> Cancel
        </button>
        <button type="button" class="btn-premium btn-premium-primary" id="updateEntInd" style="display:none;${bNavy}">
          <i class="fas fa-edit me-1"></i> Update
        </button>
      </div>
    </div>
  </div>

  <!-- Cards Container -->
  <div id="entindCardsContainer" style="flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;"></div>
</div>`;

  eiInpStyle = inp;

  eiRenderDynamicFields();
  eiBindDynamicHandlers();

  setupEventListeners();
  setupQuickAddFormValidation();
  renderCards();
}

function setupEventListeners() {
  var ab = document.getElementById("bt_sho_ad_ei");
  if (ab)
    ab.addEventListener("click", function () {
      showAddNewForm();
    });
  var cb = document.getElementById("cancelAddNew");
  if (cb)
    cb.addEventListener("click", function () {
      hideAddNewForm();
      renderCards();
    });
  var ub = document.getElementById("updateEntInd");
  if (ub)
    ub.addEventListener("click", function () {
      updateRecord();
    });
  var si = document.getElementById("entindSearch");
  if (si)
    si.addEventListener("input", function () {
      renderCards(this.value.trim());
    });
  var cl = document.getElementById("clearSearch");
  if (cl)
    cl.addEventListener("click", function () {
      var s = document.getElementById("entindSearch");
      if (s) {
        s.value = "";
        renderCards("");
      }
    });
  var sb = document.getElementById("quickSave");
  if (sb)
    sb.addEventListener("click", async function () {
      await saveRecord(false);
    });
  var rb = document.getElementById("relationBtn");
  if (rb)
    rb.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleRelationDropdown();
    });
  document.addEventListener("mousedown", closeRelationDropdown);
}

async function showAddNewForm(record) {
  var add = document.getElementById("addNewWhenNotFound");
  if (!add) return;
  var sb = document.getElementById("quickSave"),
    ub = document.getElementById("updateEntInd"),
    ri = document.getElementById("editRecordId");
  add.classList.remove("d-none");
  var cc = document.getElementById("entindCardsContainer");
  if (cc) {
    cc.innerHTML = "";
    cc.style.display = "none";
  }

  if (record) {
    if (sb) sb.style.display = "none";
    if (ub) ub.style.display = "inline-block";
    if (ri) ri.value = record.a;
    currentEditingRecord = record;
    if (record.e) {
      var mp = record.e.split(".");
      if (mp.length === 2) {
        var cf = document.getElementById("quickCountryCode"),
          mf = document.getElementById("quickMobile");
        if (cf) cf.value = mp[0];
        if (mf) mf.value = mp[1];
      }
    }
    setVal("quickRelation", record.f || "1");
    setVal("quickNameEnglish", record.h || "");
    setVal("quickImageUrl", record.l || "");
    await eiFillDynamicFields(record, payload0);
  } else {
    if (sb) sb.style.display = "inline-block";
    if (ub) ub.style.display = "none";
    if (ri) ri.value = "";
    currentEditingRecord = null;
    setVal("quickCountryCode", "91");
    setVal("quickMobile", "");
    setVal("quickRelation", "1");
    setVal("quickNameEnglish", "");
    setVal("quickImageUrl", "");
    eiClearDynamicFields();
  }
  clearErrors();
  syncRelationUI();
}
function setVal(id, v) {
  var el = document.getElementById(id);
  if (el) el.value = v;
}
function eiSetFieldBorder(el, valid) {
  if (!el) return;
  el.style.borderColor = valid ? "#6c757d" : "#dc3545";
}
function clearErrors() {
  var me = document.getElementById("mobileError"),
    ee = document.getElementById("nameError"),
    mi = document.getElementById("quickMobile"),
    ne = document.getElementById("quickNameEnglish");
  if (me) me.style.display = "none";
  if (ee) ee.style.display = "none";
  eiSetFieldBorder(mi, true);
  eiSetFieldBorder(ne, true);
}
function hideAddNewForm() {
  var a = document.getElementById("addNewWhenNotFound");
  if (a) a.classList.add("d-none");
  var cc = document.getElementById("entindCardsContainer");
  if (cc) cc.style.display = "";
}

function eiRelationLabel(v) {
  return (v == 1 ? "self [स्वतः]" : getRelationText(v));
}
function syncRelationUI() {
  var sel = document.getElementById("quickRelation"),
    txt = document.getElementById("relationBtnText");
  if (sel) {
    var v = sel.value || "1";
    if (txt) txt.textContent = eiRelationLabel(v);
    var opts = document.querySelectorAll(".rel-opt");
    for (var i = 0; i < opts.length; i++) {
      var chk = opts[i].querySelector(".fa-check");
      if (chk) chk.style.display = opts[i].getAttribute("data-rv") === v ? "inline-block" : "none";
    }
  }
}
function toggleRelationDropdown() {
  var dd = document.getElementById("relationDropdown");
  if (!dd) return;
  syncRelationUI();
  if (dd.style.display === "none") {
    dd.style.transform = "";
    dd.style.left = "0";
    dd.style.right = "auto";
    dd.style.display = "block";
    var btn = document.getElementById("relationBtn");
    if (btn) {
      var r = btn.getBoundingClientRect();
      var sc = dd.closest("#addNewWhenNotFound") || dd.closest(".modal-body");
      var s = sc ? sc.getBoundingClientRect() : null;
      if (s && r.left + dd.offsetWidth > s.right - 4) {
        dd.style.left = "auto";
        dd.style.right = "0";
        if (r.right - dd.offsetWidth < s.left + 4) {
          dd.style.left = "50%";
          dd.style.right = "auto";
          dd.style.transform = "translateX(-50%)";
        }
      }
    }
  } else {
    dd.style.display = "none";
  }
}
function selectRelation(v) {
  var sel = document.getElementById("quickRelation");
  if (sel) sel.value = v;
  syncRelationUI();
  var dd = document.getElementById("relationDropdown");
  if (dd) dd.style.display = "none";
}
function closeRelationDropdown(e) {
  var dd = document.getElementById("relationDropdown");
  if (!dd || dd.style.display === "none") return;
  var rb = document.getElementById("relationBtn");
  if (e && (rb && rb.contains(e.target)) || (dd.contains(e.target))) return;
  dd.style.display = "none";
}

function validateMobile(inp) {
  if (!inp || !isFieldVisible("quickMobile")) return true;
  var v = /^\d{10}$/.test(inp.value),
    er = document.getElementById("mobileError");
  if (!v && inp.value) {
    if (er) er.style.display = "block";
    eiSetFieldBorder(inp, false);
    try {
      inp.focus();
    } catch (e) {}
    return false;
  } else {
    if (er) er.style.display = "none";
    eiSetFieldBorder(inp, true);
    return true;
  }
}
function validateName(inp) {
  if (!inp || !isFieldVisible("quickNameEnglish")) return true;
  var v = (inp.value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim(),
    er = document.getElementById("nameError");
  if (!v) {
    if (er) {
      er.textContent = "Name is required";
      er.style.display = "block";
    }
    eiSetFieldBorder(inp, false);
    try {
      inp.focus();
    } catch (e) {}
    return false;
  } else {
    if (er) er.style.display = "none";
    eiSetFieldBorder(inp, true);
    return true;
  }
}
function setupQuickAddFormValidation() {
  var mi = document.getElementById("quickMobile"),
    ne = document.getElementById("quickNameEnglish");
  if (mi)
    mi.addEventListener("input", function () {
      validateMobile(this);
    });
  if (ne)
    ne.addEventListener("input", function () {
      validateName(this);
    });
}

async function saveRecord(isUpdate) {
  try {

    var mi = document.getElementById("quickMobile"),
      ne = document.getElementById("quickNameEnglish");
    if (!validateMobile(mi) || !validateName(ne))
      return;
    if (isFieldVisible("quickMobile") && mi && !mi.value) {
      var me = document.getElementById("mobileError");
      if (me) me.style.display = "block";
      eiSetFieldBorder(mi, false);
      try {
        mi.focus();
      } catch (e) {}
      return;
    }
    var cc = document.getElementById("quickCountryCode")?.value || "91",
      mn = mi?.value || "",
      fm = cc + "." + mn,
      rel = document.getElementById("quickRelation")?.value || "1";
    var rid = document.getElementById("editRecordId")?.value || "",
      neVal = ne?.value || "";
    var c = {};
    c.e = fm;
    c.f = rel;
    c.h = neVal;
    if (isUpdate) c.a = rid;
    if (!eiValidateDynamicFields()) return;
    var xtraVals = eiCollectDynamicFields();
    xtraVals = await eiApplyPostProcessToCollected(xtraVals, myxtraFlds_fildsToNeeds, payload0);
    if (xtraVals && Object.keys(xtraVals).length) c.k = xtraVals.k;
    payload0.c = c;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
      { tb: "c", col: "b", cl: "b" },
    ]);
    payload0.vw = 1;
    payload0.fn = isUpdate ? 80 : 79;
    if (typeof fnj3 !== "function") {
      window.showelsemodal("Info", "Server not available", false);
      return;
    }

    // Loading state
    var saveBtn = document.getElementById("quickSave"),
      updateBtn = document.getElementById("updateEntInd");
    var activeBtn = isUpdate ? updateBtn : saveBtn;
    if (activeBtn) {
      activeBtn.disabled = true;
      activeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Saving...';
    }

    var resp = await fnj3(
      "https://my1.in/2/j.php",
      payload0,
      1,
      true,
      null,
      15000,
      0,
      1,
      1,
    );
    if (resp && resp.su === 1) {
      var insResult = await dbDexieManager.insertToDexie(dbnm, "c", resp.c.l, true, "a");

      if (insResult && insResult.success) {
        d_entInd_ata = await dbDexieManager.getAllRecords(dbnm, "c");
        d_entInd_ata.sort(function (a, b) {
          return new Date(b.b) - new Date(a.b);
        });

        var saved = d_entInd_ata.find(function (d) {
          return d.e === c.e && d.f === c.f;
        });

        hideAddNewForm();
        renderCards();
        window.showsuccessmodal("Success", "✅ Member saved successfully!", false);

        if (f1nEiToExe && window[f1nEiToExe] && saved) {
          window[f1nEiToExe](saved, s_ei_witchToReturn);
          if (currentModalId) closeSpecificModal(currentModalId);
        }
      } else {
        window.showelsemodal("Info", "⚠️ Saved to server but local sync failed", false);
      }
    } else {
      window.showelsemodal("Error", resp?.ms || "Failed", true);
    }
    if (activeBtn) {
      activeBtn.disabled = false;
      activeBtn.innerHTML = isUpdate
        ? '<i class="fas fa-edit me-1"></i> Update'
        : '<i class="fas fa-save me-1"></i> Save';
    }
  } catch (e) {
    window.showelsemodal("Info", e.message, false);
  }
}
async function updateRecord() {
  await saveRecord(true);
}

function renderCards(searchTerm) {
  var cont = document.getElementById("entindCardsContainer");
  if (!cont) return;
  var p = eiTheme();
  var bSmEdit =
    "display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:600;line-height:1.2;border:none;border-radius:8px;cursor:pointer;white-space:nowrap;font-size:12px;padding:5px 14px;background:linear-gradient(135deg," +
    p.brand +
    "," +
    p.brandDark +
    ");color:" +
    p.onBrand +
    ";box-shadow:0 4px 14px " +
    p.glow +
    ";";
  var bSmDanger =
    "display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:600;line-height:1.2;border:none;border-radius:8px;cursor:pointer;white-space:nowrap;font-size:12px;padding:5px 14px;background:linear-gradient(135deg,#e35d6a,#dc3545);color:#fff;box-shadow:0 4px 12px rgba(220,53,69,.3);";
  var badgeGold =
    "display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;letter-spacing:.3px;background:" +
    p.secondary +
    ";color:" +
    p.onSecondary +
    ";";
  var badgeNavy =
    "display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;letter-spacing:.3px;background:" +
    p.brand +
    ";color:" +
    p.onBrand +
    ";";
  var cardS =
    "background:" +
    p.surface +
    ";border:1px solid #6c757d;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.06);cursor:pointer;";
  cont.innerHTML = "";
  var raw = searchTerm?.trim() || "",
    st = raw.toLowerCase(),
    fd = st
      ? d_entInd_ata.filter(function (i) {
          return (
            (i.a && i.a.toString().toLowerCase().includes(st)) ||
            (i.e && i.e.toString().toLowerCase().includes(st)) ||
            (i.h && i.h.toLowerCase().includes(st)) ||
            (i.i && i.i.toLowerCase().includes(st)) ||
            (i.k && i.k.toString().toLowerCase().includes(st))
          );
        })
      : d_entInd_ata;
  var add = document.getElementById("addNewWhenNotFound");
  if (add) add.classList.add("d-none");
  if (cont) cont.style.display = "";
  if (fd.length === 0 && st) {
    showAddNewForm();
    var isn = /^\d+$/.test(st),
      mi = document.getElementById("quickMobile"),
      ne = document.getElementById("quickNameEnglish");
    if (isn && mi) mi.value = raw.substring(0, 10);
    else if (ne) ne.value = raw.substring(0, 64);
  }
  if (fd.length === 0) {
    cont.innerHTML =
      '<div class="text-center py-4" style="color:#adb5bd;"><i class="fas fa-users mb-2 d-block" style="font-size:36px;"></i>No records found</div>';
    return;
  }

  fd.forEach(function (item, idx) {
    var card = document.createElement("div");
    card.className = "col-12 col-md-6 mb-2";
    card.innerHTML =
      '<div class="card-premium" style="' +
      cardS +
      '">' +
      '<div class="card-body p-3">' +
      '<div class="d-flex align-items-center gap-2 mb-2 flex-wrap">' +
      '<span class="badge-premium" style="' +
      badgeNavy +
      '">#' +
      item.a +
      "</span>" +
      (item.e
        ? '<span style="color:#6c757d;font-size:16px;"><i class="fas fa-phone me-1" style="color:' +
          p.brand +
          ';"></i>' +
          item.e +
          "</span>"
        : "") +
      (item.k
        ? '<span class="badge-premium ms-1" style="' +
          badgeGold +
          '">' +
          item.k +
          "</span>"
        : "") +
      '<span class="fw-semibold ms-auto" style="color:' +
      p.brand +
      ";font-size:15px;\">" +
      (item.h || item.i || "N/A") +
      "</span></div>" +
      '<div class="d-flex align-items-start gap-2">' +
      '<div style="color:#6c757d;font-size:13.5px;flex:1;min-width:0;">' +
      (item.f
        ? '<div><i class="fas fa-tag me-1" style="color:' +
          p.brand +
          ';width:14px;"></i>' +
          getRelationText(item.f) +
          "</div>"
        : "") +
      (item.m
        ? '<div class="mt-1" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><i class="fas fa-map-marker-alt me-1" style="color:' +
          p.brand +
          ';width:14px;"></i>' +
          item.m +
          "</div>"
        : "") +
      "</div>" +
      '<div class="d-flex gap-2 flex-shrink-0">' +
      '<button class="btn-premium edit-btn" style="' +
      bSmEdit +
      '" data-id="' +
      item.a +
      '">Edit</button>' +
      '<button class="btn-premium delete-btn" style="' +
      bSmDanger +
      '" data-id="' +
      item.a +
      '">Delete</button></div></div></div></div>';
    card.addEventListener("click", async function (e) {
      if (
        !e.target.classList.contains("edit-btn") &&
        !e.target.classList.contains("delete-btn")
      ) {
        if (currentModalId) closeSpecificModal(currentModalId);
        if (f1nEiToExe && window[f1nEiToExe]) {
          var expanded = await eiExpandRecordForSelect(item, payload0);
          window[f1nEiToExe](expanded, s_ei_witchToReturn);
        }
      }
    });
    cont.appendChild(card);
  });

  document.querySelectorAll(".edit-btn").forEach(function (b) {
    b.addEventListener("click", async function (e) {
      e.stopPropagation();
      var id = e.target.getAttribute("data-id"),
        rec = d_entInd_ata.find(function (i) {
          return i.a.toString() === id.toString();
        });
      if (rec) await showAddNewForm(rec);
    });
  });
  document.querySelectorAll(".delete-btn").forEach(function (b) {
    b.addEventListener("click", async function (e) {
      e.stopPropagation();
      var id = e.target.getAttribute("data-id");
      window.showModal({
        title: "Delete Record",
        message: "Are you sure you want to delete this record?",
        type: "confirm",
        onConfirm: async function () {
          try {
            payload0.c = { a: id };
            payload0.fn = 3;
            var resp = await fnj3(
              "https://my1.in/2/b.php",
              payload0,
              1,
              true,
              null,
              15000,
              0,
              1,
              1,
            );
            if (resp && resp.su === 1) {
              d_entInd_ata = d_entInd_ata.filter(function (i) {
                return i.a !== id;
              });
              renderCards(document.getElementById("entindSearch")?.value || "");
              window.showsuccessmodal("Success", "✅ Record deleted!", false);
            } else {
              window.showelsemodal("Error", resp?.ms || "Failed", true);
            }
          } catch (e) {
            window.showelsemodal("Info", e.message, false);
          }
        },
      });
    });
  });
}
function getRelationText(c) {
  var r = {
    1: "self",
    2: "relative 1",
    3: "relative 2",
    4: "relative 3",
    5: "relative 4",
    6: "relative 5",
    7: "relative 6",
    8: "relative 7",
    9: "relative 8",
  };
  return r[c] || "Unknown";
}

// ========== Dynamic extra fields from myxtraFlds_fildsToNeeds ==========
function eiDynIsGroup(def) {
  if (!def || typeof def !== "object") return false;
  if (def.type === "div") return true;
  if (def.x && typeof def.x === "object") return true;
  if (!def.type) {
    for (var k in def) {
      if (!def.hasOwnProperty(k)) continue;
      if (k === "lbl" || k === "ptrn" || k === "rq" || k === "preProcess" || k === "postProcess" || k === "x") continue;
      if (def[k] && typeof def[k] === "object") return true;
    }
  }
  return false;
}
function eiDynChildren(def) {
  return def.x && typeof def.x === "object" ? def.x : def;
}
function eiDynQuery(sel, path) {
  return document.querySelector('.' + sel + '[data-path="' + path + '"]');
}
function eiDynIsField(def) {
  return !eiDynIsGroup(def);
}
function eiSetDynImg(path, url) {
  var val = eiDynQuery("ei-dyn-val", path);
  var box = eiDynQuery("ei-dyn-img-box", path);
  var prev = eiDynQuery("ei-dyn-img-prev", path);
  var img = eiDynQuery("ei-dyn-img-prev-img", path);
  var nameEl = eiDynQuery("ei-dyn-img-prev-name", path);
  if (val) val.value = url;
  if (box) {
    box.style.display = url ? "none" : "";
    box.style.borderColor = "#6c757d";
  }
  if (prev) prev.style.display = url ? "block" : "none";
  if (img) {
    if (url) img.src = url;
    else img.removeAttribute("src");
  }
  if (nameEl) nameEl.textContent = url ? "Image selected" : "";
}
function eiRenderDynamicFields() {
  var wrap = document.getElementById("eiDynamicFields");
  if (!wrap) return;
  var xtra = myxtraFlds_fildsToNeeds || null;
  if (!xtra || typeof xtra !== "object" || Object.keys(xtra).length === 0) {
    wrap.innerHTML = "";
    wrap.style.display = "none";
    return;
  }
  wrap.style.display = "";
  var p = eiTheme();
  var inpDyn =
    eiInpStyle ||
    "display:block;width:100%;background:#fff;border:2px solid #6c757d;border-radius:10px;padding:8px 12px;font-size:14px;color:" +
      p.ink +
      ";outline:none;";
  var boxStyle =
    "border:2px solid #6c757d;border-radius:.5rem;padding:8px 10px;margin-bottom:.5rem;background:" +
    p.surface +
    ";";
  var html = "";
  function renderDef(def, path, inDiv) {
    var out = "";
    if (!def || typeof def !== "object") return out;
    if (eiDynIsGroup(def)) {
      var children = eiDynChildren(def);
      var hasBox = (def.type === "div" || (def.x && typeof def.x === "object") || !!def.lbl) && !inDiv;
      if (hasBox) {
        out += '<div style="' + boxStyle + '">';
        if (def.lbl) {
          out +=
            '<div class="text-xs fw-bold text-uppercase mb-2" style="color:#343a40;"><i class="fas fa-layer-group me-1" style="color:' +
            p.brand +
            ';"></i>' +
            def.lbl +
            "</div>";
        }
        for (var ck in children) {
          if (!children.hasOwnProperty(ck)) continue;
          if (!def.x && (ck === "lbl" || ck === "type" || ck === "ptrn" || ck === "rq" || ck === "preProcess" || ck === "postProcess" || ck === "x")) continue;
          out += renderDef(children[ck], path + "__" + ck, true);
        }
        out += "</div>";
      } else {
        if (def.lbl) {
          out +=
            '<div class="text-xs fw-bold text-uppercase mt-3" style="color:#343a40;"><i class="fas fa-layer-group me-1" style="color:' +
            p.brand +
            ';"></i>' +
            def.lbl +
            "</div>";
        }
        for (var pk in children) {
          if (!children.hasOwnProperty(pk)) continue;
          if (pk === "lbl" || pk === "type" || pk === "ptrn" || pk === "rq" || pk === "preProcess" || pk === "postProcess" || pk === "x") continue;
          out += renderDef(children[pk], path + "__" + pk, inDiv);
        }
      }
      return out;
    }
    var ftype = def.type || "text";
    var req = def.rq === 1 || def.rq === true;
    var lbl = def.lbl || path;
    var ph = def.placeholder || lbl;
    var reqMark = req ? ' <span style="color:#dc3545;">*</span>' : "";
    if (!inDiv) out += '<div style="' + boxStyle + '">';
    out +=
      '<label class="form-label m-0 fw-bold mb-1" style="font-size:12.5px;color:#343a40;">' +
      lbl +
      reqMark +
      "</label>";
    if (ftype === "file") {
      out +=
        '<div class="ei-dyn-img-box" data-path="' +
        path +
        '" style="border:2px dashed #6c757d;border-radius:.5rem;text-align:center;padding:14px 8px;cursor:pointer;background:#f8f9fa;"><i class="fas fa-image mb-1 d-block" style="font-size:1.6rem;color:' +
        p.brand +
        ';"></i><span class="fw-bold">' +
        lbl +
        "</span></div>";
      out +=
        '<div class="ei-dyn-img-prev" data-path="' +
        path +
        '" style="display:none;margin-top:6px;border:2px solid #6c757d;border-radius:.5rem;padding:6px;text-align:center;"><img class="ei-dyn-img-prev-img" data-path="' +
        path +
        '" src="" alt="' +
        lbl +
        '" style="max-width:100%;height:auto;max-height:150px;display:block;margin:auto;"><div class="mt-1"><span class="small text-muted ei-dyn-img-prev-name" data-path="' +
        path +
        '"></span><button type="button" class="btn btn-sm btn-outline-danger ei-dyn-img-remove" data-path="' +
        path +
        '" style="padding:0 6px;margin-left:6px;"><i class="fas fa-times"></i> Remove</button></div></div>';
      out += '<input type="hidden" class="ei-dyn-val" data-path="' + path + '">';
    } else if (ftype === "textarea") {
      out +=
        '<textarea class="ei-dyn-val" data-path="' +
        path +
        '" rows="2" placeholder="' +
        ph +
        '" style="font-size:14px;' +
        inpDyn +
        'resize:vertical;min-height:40px;"></textarea>';
    } else if (ftype === "select") {
      out +=
        '<select class="ei-dyn-val" data-path="' +
        path +
        '" style="font-size:14px;' +
        inpDyn +
        'padding:6px 8px;">';
      if (def.placeholder)
        out += '<option value="" disabled selected>' + def.placeholder + "</option>";
      var opts = def.opts || def.opt || {};
      if (typeof opts === "string") {
        opts = (window.clientConfig && window.clientConfig[opts]) || {};
      }
      for (var ov in opts) {
        if (!opts.hasOwnProperty(ov)) continue;
        var oc = opts[ov];
        var olabel = typeof oc === "object" && oc ? (oc.b || oc.l || ov) : (oc === undefined ? ov : oc);
        var oval = typeof oc === "object" && oc && oc.a !== undefined ? oc.a : ov;
        out += '<option value="' + oval + '">' + olabel + "</option>";
      }
      out += "</select>";
    } else {
      var allowed = { text: 1, tel: 1, email: 1, number: 1, date: 1, url: 1, password: 1 };
      var itype = allowed[ftype] ? ftype : "text";
      var dynAttrs =
        (def.maxlength ? ' maxlength="' + def.maxlength + '" data-maxlen="' + def.maxlength + '"' : "") +
        (def.uppercase ? ' data-uc="1"' : "") +
        (def.strip ? ' data-strip="' + def.strip + '"' : "");
      out +=
        '<input type="' +
        itype +
        '" class="ei-dyn-val" data-path="' +
        path +
        '" placeholder="' +
        ph +
        '" style="font-size:14px;' +
        inpDyn +
        '"' +
        dynAttrs +
        ">";
    }
    out +=
      '<span class="ei-dyn-err" data-path="' +
      path +
      '" style="font-size:11px;color:#dc3545;display:none;margin-top:2px;"></span>';
    if (!inDiv) out += "</div>";
    return out;
  }
  for (var k in xtra) {
    if (!xtra.hasOwnProperty(k)) continue;
    html += renderDef(xtra[k], k, false);
  }
  wrap.innerHTML = html;
}
function eiBindDynamicHandlers() {
  document.querySelectorAll(".ei-dyn-img-box").forEach(function (box) {
    box.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();
      var path = this.getAttribute("data-path");
      var cbName = "eiDynImgCb_" + path.replace(/[^a-zA-Z0-9]/g, "_");
      window[cbName] = function (obj) {
        var url = (obj && (obj.g1 || obj.url)) || "";
        eiSetDynImg(path, url);
        delete window[cbName];
      };
      try {
        await loadExe2Fn(24, [window[cbName], window.imgObjDimensRqd2 || []], [1]);
      } catch (err) {
        delete window[cbName];
      }
    });
  });
  document.querySelectorAll(".ei-dyn-img-remove").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      eiSetDynImg(this.getAttribute("data-path"), "");
    });
  });
  document.querySelectorAll(".ei-dyn-val[data-uc], .ei-dyn-val[data-strip], .ei-dyn-val[data-maxlen]").forEach(function (el) {
    el.addEventListener("input", function () {
      var v = el.value || "";
      var strip = el.getAttribute("data-strip");
      if (strip) {
        try {
          v = v.replace(new RegExp(strip, "g"), "");
        } catch (e) {}
      }
      if (el.getAttribute("data-uc")) v = v.toUpperCase();
      var ml = parseInt(el.getAttribute("data-maxlen") || "", 10);
      if (ml > 0 && v.length > ml) v = v.substring(0, ml);
      if (el.value !== v) el.value = v;
    });
  });
}
function eiValidateDynamicFields() {
  var xtra = myxtraFlds_fildsToNeeds || null;
  if (!xtra || typeof xtra !== "object") return true;
  var ok = true;
  var firstInvalid = null;
  function walk(obj, basePath) {
    for (var k in obj) {
      if (!obj.hasOwnProperty(k)) continue;
      var def = obj[k];
      var path = basePath ? basePath + "__" + k : k;
      if (!def || typeof def !== "object") continue;
      if (eiDynIsGroup(def)) {
        walk(eiDynChildren(def), path);
        continue;
      }
      var el = eiDynQuery("ei-dyn-val", path);
      if (!el) continue;
      var isFile = def.type === "file";
      var req = def.rq === 1 || def.rq === true;
      var val = (el.value || "").trim();
      var err = eiDynQuery("ei-dyn-err", path);
      var setErr = function (msg) {
        ok = false;
        if (!firstInvalid) {
          firstInvalid = isFile ? eiDynQuery("ei-dyn-img-box", path) : el;
        }
        if (err) {
          err.textContent = msg;
          err.style.display = "block";
        }
        if (isFile) {
          var box = eiDynQuery("ei-dyn-img-box", path);
          if (box) box.style.borderColor = "#dc3545";
        } else {
          eiSetFieldBorder(el, false);
        }
      };
      var clearErr = function () {
        if (err) err.style.display = "none";
        if (isFile) {
          var box = eiDynQuery("ei-dyn-img-box", path);
          if (box) box.style.borderColor = "#6c757d";
        } else {
          eiSetFieldBorder(el, true);
        }
      };
      if (req && !val) {
        setErr((def.lbl || k) + " is required");
        continue;
      }
      var ptrn = def.ptrn;
      if (val && ptrn && typeof ptrn === "string" && ptrn.indexOf("^") !== -1) {
        var re = null;
        try {
          re = new RegExp(ptrn);
        } catch (e) {
          re = null;
        }
        if (re && !re.test(val)) {
          setErr("Invalid " + (def.lbl || k));
          continue;
        }
      }
      var vfn = def.validate;
      if (vfn && typeof window[vfn] === "function") {
        if (!window[vfn](el, err, def.lbl || k)) {
          ok = false;
          if (!firstInvalid) firstInvalid = el;
          continue;
        }
      }
      clearErr();
    }
  }
  walk(xtra, "");
  if (firstInvalid) {
    try {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ block: "center" });
    } catch (e) {}
  }
  return ok;
}
function eiCollectDynamicFields() {
  var xtra = myxtraFlds_fildsToNeeds || null;
  var out = {};
  if (!xtra || typeof xtra !== "object") return out;
  function walk(obj, basePath, dest) {
    for (var k in obj) {
      if (!obj.hasOwnProperty(k)) continue;
      var def = obj[k];
      var path = basePath ? basePath + "__" + k : k;
      if (!def || typeof def !== "object") continue;
      if (eiDynIsGroup(def)) {
        dest[k] = {};
        walk(eiDynChildren(def), path, dest[k]);
        continue;
      }
      var el = eiDynQuery("ei-dyn-val", path);
      if (el) dest[k] = el.value;
    }
  }
  walk(xtra, "", out);
  return out;
}
async function eiFillDynamicFields(record, payload0) {
  var xtra = myxtraFlds_fildsToNeeds || null;
  if (!xtra || typeof xtra !== "object") return;
  var data = (record && record.p) || {};
  async function walk(obj, basePath, dataObj) {
    for (var k in obj) {
      if (!obj.hasOwnProperty(k)) continue;
      var def = obj[k];
      var path = basePath ? basePath + "__" + k : k;
      if (!def || typeof def !== "object") continue;
      if (eiDynIsGroup(def)) {
        var groupData = dataObj && dataObj[k];
        if (def.preProcess && typeof groupData === "string") {
          groupData = await eiRunPreProcess(def, groupData, payload0);
        }
        await walk(eiDynChildren(def), path, groupData || {});
        continue;
      }
      var el = eiDynQuery("ei-dyn-val", path);
      var val = dataObj ? dataObj[k] : undefined;
      if (def.preProcess && typeof val === "string") val = await eiRunPreProcess(def, val, payload0);
      if (el) {
        el.value = val !== undefined && val !== null ? val : "";
        if (def.type === "file") eiSetDynImg(path, el.value);
      }
    }
  }
  await walk(xtra, "", data);
}
function eiClearDynamicFields() {
  document.querySelectorAll(".ei-dyn-val").forEach(function (el) {
    el.value = "";
  });
  document.querySelectorAll(".ei-dyn-img-box").forEach(function (box) {
    box.style.display = "";
    box.style.borderColor = "#6c757d";
  });
  document.querySelectorAll(".ei-dyn-img-prev").forEach(function (p) {
    p.style.display = "none";
  });
  document.querySelectorAll(".ei-dyn-img-prev-img").forEach(function (img) {
    img.removeAttribute("src");
  });
  document.querySelectorAll(".ei-dyn-img-prev-name").forEach(function (n) {
    n.textContent = "";
  });
  document.querySelectorAll(".ei-dyn-err").forEach(function (e) {
    e.style.display = "none";
  });
}
async function eiRunPostProcess(def, groupVals, payload0) {
  var fn = def && def.postProcess;
  if (fn && typeof window[fn] === "function") {
    var result = await window[fn](groupVals, payload0);
    if (!result) { alert("postProcess failed!"); return groupVals; }
    return result;
  }
  return groupVals;
}
async function eiRunPreProcess(def, storedVal, payload0) {
  var fn = def && def.preProcess;
  if (fn && typeof window[fn] === "function") {
    var result = await window[fn](storedVal, payload0);
    if (!result) { alert("preProcess failed!"); return storedVal; }
    return result;
  }
  return storedVal;
}
async function eiApplyPostProcessToCollected(collected, xtra, payload0) {
  if (!collected || !xtra || typeof xtra !== "object") return collected;
  for (var k in xtra) {
    if (!xtra.hasOwnProperty(k)) continue;
    var def = xtra[k];
    if (!def || typeof def !== "object") continue;
    if (eiDynIsGroup(def)) {
      var children = eiDynChildren(def);
      if (def.postProcess && collected[k] && typeof collected[k] === "object") {
        collected[k] = await eiRunPostProcess(def, collected[k], payload0);
      } else if (collected[k] && typeof collected[k] === "object") {
        await eiApplyPostProcessToCollected(collected[k], children, payload0);
      } else if (collected[k] === undefined || collected[k] === null) {
        collected[k] = {};
      }
    } else if (def.postProcess && typeof collected[k] === "string") {
      collected[k] = await eiRunPostProcess(def, collected[k], payload0);
    }
  }
  return collected;
}
async function eiExpandRecordForSelect(record, payload0) {
  if (!record || typeof record !== "object") return record;
  var xtra = myxtraFlds_fildsToNeeds || null;
  if (!xtra || typeof xtra !== "object" || !record.p) return record;
  var copy = JSON.parse(JSON.stringify(record));
  async function walk(def, dataObj, basePath) {
    if (!def || typeof def !== "object" || !dataObj || typeof dataObj !== "object") return;
    for (var k in def) {
      if (!def.hasOwnProperty(k)) continue;
      var d = def[k];
      if (!d || typeof d !== "object") continue;
      var path = basePath ? basePath + "__" + k : k;
      if (eiDynIsGroup(d)) {
        var cv = dataObj[k];
        if (d.preProcess && typeof cv === "string") {
          dataObj[k] = await eiRunPreProcess(d, cv, payload0) || {};
          cv = dataObj[k];
        }
        await walk(eiDynChildren(d), cv || {}, path);
      } else if (d.preProcess && typeof dataObj[k] === "string") {
        dataObj[k] = await eiRunPreProcess(d, dataObj[k], payload0);
      }
    }
  }
  await walk(xtra, copy.p, "");
  return copy;
}
function validateUniqueId(el, err, lbl) {
  var v = (el && el.value) || "";
  if (!v) return true;
  if (!/^[A-Z0-9]{1,8}$/.test(v)) {
    if (err) {
      err.textContent = "Only letters & numbers (max 8)";
      err.style.display = "block";
    }
    eiSetFieldBorder(el, false);
    return false;
  }
  return true;
}
function preUniqueId(v) {
  return typeof v === "string" ? v.trim() : v;
}
function postUniqueId(v) {
  if (typeof v !== "string") return v;
  var s = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return s.substring(0, 8);
}
function validateAddress(el, err, lbl) {
  var v = ((el && el.value) || "").trim();
  if (!v) return true;
  if (v.length < 5 || v.length > 200) {
    if (err) {
      err.textContent = "Address must be 5-200 characters";
      err.style.display = "block";
    }
    eiSetFieldBorder(el, false);
    return false;
  }
  return true;
}
function preAddress(v) {
  return typeof v === "string" ? v.trim() : v;
}
function postAddress(v) {
  return preAddress(v);
}
function validateGender(el, err, lbl) {
  var v = (el && el.value) || "";
  if (!v) {
    if (err) {
      err.textContent = "Select a gender";
      err.style.display = "block";
    }
    eiSetFieldBorder(el, false);
    return false;
  }
  return true;
}
function preGender(v) {
  return v;
}
function postGender(v) {
  return v;
}

window.open_entind_crud = open_entind_crud;

console.log("📂 ei.js loaded - Premium Design");