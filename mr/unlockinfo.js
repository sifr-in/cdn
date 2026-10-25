/* git/unlockinfo.js - "After unlock" info modal.
 *
 * Opened through loadExe2Fn(23, ["n,l"], [1]) from the drawer ("After unlock" item).
 * loadExe2Fn looks up csh row a:23 (git/mr.js), loads this file and calls
 * window.mrUnlockInfoModal("n,l") with the passed keys.
 *
 * The keys are profile field keys (mr.da "fieldNameMap"). They are mapped to their
 * display labels and listed in a fixed sentence:
 *
 *   After Unlock you will be able to see Surname, Contact no. to display. Guaranteed!
 *
 * (n -> "Surname;" -> "Surname", l -> "Contact no. to display")
 */
(function () {
 "use strict";

 var MODAL_ID = "mrUnlockInfoModal";
 var CSS_ID = "mrUnlockInfoCss";

 function P() {
  try { return window[window.my1uzr.worknOnPg] || {}; } catch (e) { return {}; }
 }
 /* full mr.da config (clientConfig is the live copy; appInfo is the same object) */
 function cfg() {
  var p = P();
  return p.clientConfig || p.appInfo || {};
 }
 function esc(v) {
  if (v === null || v === undefined) return "";
  return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
 }
 function el(html) {
  var d = document.createElement("div");
  d.innerHTML = String(html).trim();
  return d.firstChild;
 }

 /* ---- styles (self-contained: matches the mrp-/rg- modal look, green unlock theme) -- */
 function ensureCss() {
  if (document.getElementById(CSS_ID)) return;
  var css = [
   ".lui-overlay{",
   "--lui-green:#2fa94b;--lui-green-deep:#1f8438;--lui-ink:#14311c;--lui-muted:#5d6b60;",
   "--lui-surface:#ffffff;--lui-mint:#eafaf0;",
   "position:fixed;inset:0;z-index:1047;display:flex;align-items:center;justify-content:center;",
   "padding:16px;background:rgba(20,40,26,.55);backdrop-filter:blur(3px);",
   "opacity:0;transition:opacity .26s ease;box-sizing:border-box;}",
   ".lui-overlay.open{opacity:1;}",
   ".lui-box{position:relative;width:100%;max-width:420px;background:var(--lui-surface);",
   "border:1px solid rgba(47,169,75,.45);border-radius:20px;overflow:hidden;",
   "box-shadow:0 24px 60px rgba(0,0,0,.35);transform:translateY(16px);",
   "transition:transform .26s ease;max-height:92vh;overflow-y:auto;box-sizing:border-box;}",
   ".lui-overlay.open .lui-box{transform:translateY(0);}",
   ".lui-head{display:flex;align-items:center;gap:12px;padding:18px 20px 16px;color:#fff;",
   "background-image:linear-gradient(135deg,var(--lui-green),var(--lui-green-deep));}",
   ".lui-ic{flex:0 0 auto;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;",
   "justify-content:center;font-size:19px;color:#fff;background:rgba(255,255,255,.2);",
   "border:1px solid rgba(255,255,255,.5);}",
   ".lui-titles{flex:1 1 auto;min-width:0;}",
   ".lui-titles h3{margin:0;font-size:19px;line-height:1.25;color:#fff;}",
   ".lui-x{flex:0 0 auto;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;",
   "justify-content:center;border:1px solid rgba(255,255,255,.45);background:rgba(255,255,255,.12);",
   "color:#fff;font-size:16px;cursor:pointer;transition:background .2s ease,transform .2s ease;}",
   ".lui-x:hover{background:rgba(255,255,255,.28);transform:rotate(90deg);}",
   ".lui-body{padding:20px 20px 20px;}",
   ".lui-msg{display:flex;gap:11px;align-items:flex-start;margin:0;padding:13px 15px;",
   "border-radius:12px;background:var(--lui-mint);border:1px solid rgba(47,169,75,.4);",
   "color:var(--lui-ink);font-size:14.5px;line-height:1.55;}",
   ".lui-msg i{color:var(--lui-green);font-size:18px;margin-top:1px;}",
   ".lui-msg b{color:var(--lui-green-deep);}",
   ".lui-ok{margin-top:16px;width:100%;display:inline-flex;align-items:center;justify-content:center;",
   "gap:8px;height:46px;border-radius:999px;border:1px solid transparent;font-size:15px;",
   "font-weight:600;cursor:pointer;color:#fff;",
   "background-image:linear-gradient(135deg,var(--lui-green),var(--lui-green-deep));",
   "box-shadow:0 10px 24px rgba(47,169,75,.3);transition:filter .2s ease,transform .18s ease;}",
   ".lui-ok:hover{filter:brightness(1.08);}",
   ".lui-ok:active{transform:scale(.985);}",
   "@media (max-width:480px){",
   ".lui-overlay{align-items:flex-end;padding:0;}",
   ".lui-box{max-width:none;border-radius:20px 20px 0 0;",
   "padding-bottom:env(safe-area-inset-bottom);}",
   ".lui-body{padding:16px 16px calc(20px + env(safe-area-inset-bottom));}",
   ".lui-head{padding:16px 16px 14px;}",
   ".lui-titles h3{font-size:18px;}",
   "}"
  ].join("");
  var s = document.createElement("style");
  s.id = CSS_ID;
  s.textContent = css;
  document.head.appendChild(s);
 }

 function close() {
  var ov = document.getElementById(MODAL_ID);
  if (!ov) return;
  ov.classList.remove("open");
  setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 260);
 }

 document.addEventListener("keydown", function (e) {
  if (e.key !== "Escape") return;
  if (!document.getElementById(MODAL_ID)) return;
  e.stopPropagation();
  e.preventDefault();
  close();
 }, true);

 /* keysCsv: comma separated profile field keys, e.g. "n,l".
  * Each key is resolved through mr.da fieldNameMap; unknown keys fall back to the key. */
 function fieldLabels(keysCsv) {
  var map = cfg().fieldNameMap || {};
  return String(keysCsv || "").split(",")
   .map(function (k) { return k.trim(); })
   .filter(Boolean)
   .map(function (k) {
    var label = map[k];
    label = (label === null || label === undefined || label === "") ? k : label;
    //labels in fieldNameMap carry trailing separators ("Surname;") - drop them
    return String(label).replace(/[\s;]+$/, "");
   });
 }

 window.mrUnlockInfoModal = function (keysCsv,secondLbl) {
  var labels = fieldLabels(keysCsv);
  if (!labels.length) return;

  var msgHtml = 'After Unlock you surely see:<br><b>• ' + labels.join("<br>• ") +
   '</b>';

  ensureCss();
  close();

  var ov = el('<div class="lui-overlay" id="' + MODAL_ID + '"></div>');
  var box = el(
   '<div class="lui-box">' +
   '<div class="lui-head">' +
   '<div class="lui-ic"><i class="fas fa-unlock"></i></div>' +
   '<div class="lui-titles"><h3>After Unlock</h3></div>' +
   '<button type="button" class="lui-x" data-close aria-label="Close"><i class="fas fa-xmark"></i></button>' +
   '</div>' +
   '<div class="lui-body">' +
   '<p class="lui-msg"><i class="fas fa-circle-check"></i><span>' + msgHtml + '</span></p>' +
   '<p class="lui-msg"><i class="fas fa-circle-check"></i><span>' + secondLbl + '</span></p>' +
   '<button type="button" class="lui-ok" data-close><i class="fas fa-check"></i>OK</button>' +
   '</div>' +
   '</div>'
  );
  ov.appendChild(box);
  document.body.appendChild(ov);
  requestAnimationFrame(function () { ov.classList.add("open"); });

  ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
  Array.prototype.forEach.call(box.querySelectorAll("[data-close]"), function (b) {
   b.addEventListener("click", close);
  });
 };
})();
