(function () {
 "use strict";

 var MODAL_ID = "mrPlansModal";
 var CSS_ID = "mrPlansCss";

 function P() {
  try { return window[window.my1uzr.worknOnPg] || {}; } catch (e) { return {}; }
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
 function toast(msg, type) {
  if (typeof window.showToast === "function") {
   window.showToast(msg, { type: type || "info", duration: 5000, position: "top", dismissible: true });
  } else { console.log(msg); }
 }

 /* full mr.da config (clientConfig is the live copy; appInfo is the same object) */
 function cfg() {
  var p = P();
  return p.clientConfig || p.appInfo || {};
 }
 function plans() {
  var c = cfg().marriagePlans;
  return Array.isArray(c) ? c : [];
 }
 function currency(v) {
  if (v === null || v === undefined || v === "") return "";
  var n = Number(v);
  return "\u20b9" + (isNaN(n) ? v : n);
 }
 function gatewayOn() {
  var cc = cfg().cust_da_const || {};
  return Number(cc.paymentGatewayIntegrated) === 1;
 }

 /* ---- styles (self-contained: matches the rg- modal look, own tokens) --------------- */
 function ensureCss() {
  if (document.getElementById(CSS_ID)) return;
  var css = [
   ".mrp-overlay{",
   "--mrp-ember:#8B1E3F;--mrp-ember-deep:#6E1733;--mrp-gold:#c9a45c;--mrp-gold-light:#e6cf9b;",
   "--mrp-ink:#241d12;--mrp-muted:#6f6656;--mrp-surface:#fffdf6;--mrp-cream:#faf4e6;",
   "position:fixed;inset:0;z-index:1047;display:flex;align-items:center;justify-content:center;",
   "padding:16px;background:rgba(30,24,12,.55);backdrop-filter:blur(3px);",
   "opacity:0;transition:opacity .26s ease;box-sizing:border-box;}",
   ".mrp-overlay.open{opacity:1;}",
   ".mrp-box{position:relative;width:100%;max-width:460px;background:var(--mrp-surface);",
   "border:1px solid rgba(201,164,92,.5);border-radius:20px;overflow:hidden;",
   "box-shadow:0 24px 60px rgba(0,0,0,.35);transform:translateY(16px);",
   "transition:transform .26s ease;max-height:92vh;overflow-y:auto;box-sizing:border-box;}",
   ".mrp-overlay.open .mrp-box{transform:translateY(0);}",
   ".mrp-head{display:flex;align-items:center;gap:12px;padding:18px 20px 16px;color:#fff;",
   "background-image:linear-gradient(135deg,var(--mrp-ember),var(--mrp-ember-deep));}",
   ".mrp-ic{flex:0 0 auto;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;",
   "justify-content:center;font-size:18px;color:#2a2010;",
   "background:linear-gradient(135deg,var(--mrp-gold-light),var(--mrp-gold));",
   "box-shadow:0 6px 16px rgba(201,164,92,.45);}",
   ".mrp-titles{flex:1 1 auto;min-width:0;}",
   ".mrp-titles h3{margin:0;font-size:19px;line-height:1.25;color:#fff;}",
   ".mrp-titles p{margin:2px 0 0;font-size:12.5px;line-height:1.45;color:rgba(255,255,255,.82);}",
   ".mrp-x{flex:0 0 auto;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;",
   "justify-content:center;border:1px solid rgba(255,255,255,.45);background:rgba(255,255,255,.12);",
   "color:#fff;font-size:16px;cursor:pointer;transition:background .2s ease,transform .2s ease;}",
   ".mrp-x:hover{background:rgba(255,255,255,.28);transform:rotate(90deg);}",
   ".mrp-body{padding:18px 20px 20px;}",
   ".mrp-note{display:flex;gap:10px;align-items:flex-start;margin:0 0 14px;padding:11px 13px;",
   "border-radius:12px;background:var(--mrp-cream);border:1px solid rgba(201,164,92,.5);",
   "color:var(--mrp-ink);font-size:13px;line-height:1.45;}",
   ".mrp-note i{color:var(--mrp-ember);font-size:16px;margin-top:1px;}",
   ".mrp-list{display:flex;flex-direction:column;gap:12px;}",
   ".mrp-plan{position:relative;border:1px solid rgba(201,164,92,.6);border-radius:14px;",
   "background:#fff;padding:14px 15px;display:flex;flex-direction:column;gap:12px;",
   "transition:border-color .2s ease,box-shadow .2s ease;}",
   ".mrp-plan:hover{border-color:var(--mrp-gold);box-shadow:0 10px 26px rgba(110,23,51,.12);}",
   ".mrp-plan--rec{border-color:var(--mrp-ember);box-shadow:0 10px 26px rgba(110,23,51,.16);}",
   ".mrp-rec{position:absolute;top:-10px;right:12px;padding:3px 10px;border-radius:999px;",
   "font-size:10.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:#2a2010;",
   "background:linear-gradient(135deg,var(--mrp-gold-light),var(--mrp-gold));",
   "box-shadow:0 4px 12px rgba(201,164,92,.5);}",
   ".mrp-plan-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}",
   ".mrp-plan-name{margin:0;font-size:15.5px;font-weight:700;color:var(--mrp-ink);line-height:1.3;}",
   ".mrp-plan-perks{margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;}",
   ".mrp-perk{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;",
   "font-size:12px;font-weight:600;color:var(--mrp-ember-deep);background:var(--mrp-cream);",
   "border:1px solid rgba(201,164,92,.5);}",
   ".mrp-perk i{font-size:11px;}",
   ".mrp-plan-price{flex:0 0 auto;font-size:20px;font-weight:800;color:var(--mrp-ember);white-space:nowrap;}",
   ".mrp-plan-price small{display:block;font-size:10px;font-weight:600;letter-spacing:.8px;",
   "text-transform:uppercase;color:var(--mrp-muted);}",
   ".mrp-buy{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;",
   "border-radius:999px;border:1px solid transparent;font-size:14.5px;font-weight:600;cursor:pointer;",
   "color:#fff;background-image:linear-gradient(135deg,var(--mrp-ember),var(--mrp-ember-deep));",
   "box-shadow:0 10px 24px rgba(110,23,51,.3);transition:filter .2s ease,transform .18s ease;}",
   ".mrp-buy:hover{filter:brightness(1.08);}",
   ".mrp-buy:active{transform:scale(.985);}",
   ".mrp-plan--free{border-color:rgba(34,150,84,.55);background:linear-gradient(180deg,#eefaf2,#ffffff);}",
   ".mrp-plan--free:hover{border-color:#1f9d55;box-shadow:0 10px 26px rgba(34,150,84,.16);}",
   ".mrp-plan--free .mrp-plan-price{color:#1f9d55;}",
   ".mrp-plan--free .mrp-perk{color:#14663a;background:#e7f7ee;border-color:rgba(34,150,84,.4);}",
   ".mrp-buy--free{background-image:linear-gradient(135deg,#34c26b,#1f9d55);box-shadow:0 10px 24px rgba(34,150,84,.32);color:#fff;}",
   ".mrp-empty{text-align:center;color:var(--mrp-muted);font-size:13.5px;padding:22px 6px;}",
   "@media (max-width:480px){",
   ".mrp-overlay{align-items:flex-end;padding:0;}",
   ".mrp-box{max-width:none;border-radius:20px 20px 0 0;max-height:92vh;",
   "padding-bottom:env(safe-area-inset-bottom);}",
   ".mrp-body{padding:16px 16px calc(20px + env(safe-area-inset-bottom));}",
   ".mrp-head{padding:16px 16px 14px;}",
   ".mrp-titles h3{font-size:18px;}",
   "}"
  ].join("");
  var s = document.createElement("style");
  s.id = CSS_ID;
  s.textContent = css;
  document.head.appendChild(s);
 }

 /* ---- modal plumbing --------------------------------------------------------------- */
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

 //free plan button: "You already added" for any registered member (own profile row present)
  function ownMyEinMR() {
    try {
      var live = (typeof window.myEinMR !== "undefined" && window.myEinMR) || {};
      if (live && Object.keys(live).length) return live;
    } catch (e) { }
    try {
      var tn = (window.appOwner && window.appOwner.tn) || null;
      var s = tn ? localStorage.getItem(tn + "_myEinMR") : null;
      if (s && s !== "undefined" && s !== "null") return JSON.parse(s) || {};
    } catch (e) { }
    return {};
  }

  //free plan button: any registered member (own profile row present) => "You already added"
  function freeAlreadyAdded() {
    try {
      var me = ownMyEinMR();
      return !!(me && me.a != null && me.a !== "");
    } catch (e) { return false; }
  }

  function planHtml(plan, recommended) {
  var id = esc(plan.a);
  var name = esc(plan.d || "Plan");
  var count = Number(plan.f) || 0;
  var isFree = Number(plan.e) === 0;
  var freeAdded = isFree && freeAlreadyAdded();
  var price = isFree ? "Free" : currency(plan.e);
  var perk = '<span class="mrp-perk"><i class="fas fa-unlock"></i>' +
   (count > 0 ? "+" + count + " profile unlock" + (count === 1 ? "" : "s") : "profile access") +
   '</span>';
  return '<div class="mrp-plan' + (recommended ? ' mrp-plan--rec' : '') +
   (isFree ? ' mrp-plan--free' : '') + '" data-plan="' + id + '">' +
   (recommended ? '<span class="mrp-rec">Best match</span>' : '') +
   '<div class="mrp-plan-top">' +
   '<div>' +
   '<h4 class="mrp-plan-name">' + name + '</h4>' +
   '<div class="mrp-plan-perks">' + perk + '</div>' +
   '</div>' +
   '<div class="mrp-plan-price">' + price + '<small>' + (isFree ? 'no cost' : 'one-time') + '</small></div>' +
   '</div>' +
   '<button type="button" class="mrp-buy' + (isFree ? ' mrp-buy--free' : '') + '" data-buy="' + id + '">' +
   '<i class="fas fa-' + (isFree ? (freeAdded ? 'check' : 'gift') : 'bolt') + '"></i>' +
   (isFree ? (freeAdded ? 'You already added' : 'Get Free') : 'Buy') + '</button>' +
   '</div>';
 }

 function showMarriagePlans(needed) {
  ensureCss();
  close();

  var list = plans();
  needed = Number(needed) || 0;

  var note = needed > 0
   ? '<div class="mrp-note"><i class="fas fa-circle-info"></i><div>You need <b>' + needed +
   '</b> more profile unlock' + (needed === 1 ? "" : "s") +
   '. Choose a plan below to continue viewing full profiles.</div></div>'
   : '';

  var body;
  if (!list.length) {
   body = '<div class="mrp-empty"><i class="fas fa-gem" style="font-size:26px;opacity:.5;"></i>' +
    '<div style="margin-top:8px;">No plans are available right now.</div></div>';
  } else {
   //mark the cheapest plan that still covers the needed count
   var recId = null;
   var recCount = Infinity;
   list.forEach(function (p) {
    if (Number(p.e) === 0) return; //free plans are never the "Best match" pick
    var f = Number(p.f);
    if (needed > 0 && f >= needed && f < recCount) { recCount = f; recId = String(p.a); }
   });
   body = '<div class="mrp-list">' + list.map(function (p) {
    return planHtml(p, recId != null && String(p.a) === recId);
   }).join("") + '</div>';
  }

  var ov = el('<div class="mrp-overlay" id="' + MODAL_ID + '"></div>');
  var box = el(
   '<div class="mrp-box">' +
   '<div class="mrp-head">' +
   '<div class="mrp-ic"><i class="fas fa-gem"></i></div>' +
   '<div class="mrp-titles"><h3>Membership Plans</h3>' +
   '<p>Buy a plan to unlock more full profiles</p></div>' +
   '<button type="button" class="mrp-x" data-close aria-label="Close"><i class="fas fa-xmark"></i></button>' +
   '</div>' +
   '<div class="mrp-body">' + note + body + '</div>' +
   '</div>'
  );
  ov.appendChild(box);
  document.body.appendChild(ov);
  requestAnimationFrame(function () { ov.classList.add("open"); });

  ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
  box.querySelector("[data-close]").addEventListener("click", close);

  Array.prototype.forEach.call(box.querySelectorAll("[data-buy]"), function (btn) {
   btn.addEventListener("click", async function () {
    var id = btn.getAttribute("data-buy");
    var plan = list.find(function (p) { return String(p.a) === id; });
    if (!plan) return;
    //free plans (price 0) go to the temporary handler; paid plans to the gateway hook
    if (Number(plan.e) === 0) { window.beCheckPlan_fn(plan); return; }
    var mrRows = (typeof window.proflFullData !== "undefined" && window.proflFullData) || [];
    var noMrRecord = mrRows.length === 0;
    if (Number(plan.e) === 0 && noMrRecord) { window.beCheckPlan_fn(plan); return; }
    var rows = [];
    try { rows = (await dbDexieManager.getAllRecords(window.dbnm, "mr")) || []; } catch (e) { rows = []; }
    var me = (typeof window.myEinMR !== "undefined" && window.myEinMR) || {};
    var hasMrRecord = rows.length > 0 || (me && me.a != null);
    if (!hasMrRecord) { window.beCheckPlan_fn(plan); return;}
    window.mrPayForPlan(plan);
   });
  });
 }

 async function startPhonePePayment(snapArg, orderIdArg) {
  var orderId = orderIdArg != null ? String(orderIdArg) : "";
  var snap = snapArg;
  if (!snap) return;
  if (!orderId) return;
  if (typeof window.my1PageLoader === "function") window.my1PageLoader(true);
  try {
   var amount = Number(snap.paymentPhonePayGT != null ? snap.paymentPhonePayGT : snap.grandTotal) || 0;
   var paymentBookingId = orderId;   // <mr.a>_<Date.now()> passed in by mrPayForPlan
   var resp = await fetch("phonepe/request.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentBookingId
     ? { amountRupees: amount, bookingId: paymentBookingId }
     : { amountRupees: amount }),
   });
   var data = await resp.json();
   if (typeof window.my1PageLoader === "function") window.my1PageLoader(false);

   if (!data.orderId || !data.redirectUrl) {
    window.showelsemodal(data.error || "Payment could not be started. Please try again.");
    return;
   }

   window.location.href = data.redirectUrl;

  } catch (e) {
   if (typeof window.my1PageLoader === "function") window.my1PageLoader(false);
   window.showelsemodal("Payment service unavailable. Please try again.");
  }
 }

 /* Return leg: PhonePe redirects back with ?pp=OK|ERR. The purchased count is credited by
  * showPhonePePostData() (git/mr.js) on init when window.ppPostData is present. */
 function handlePhonePeReturn() {
  var params = new URLSearchParams(window.location.search);
  var pp = params.get("pp");
  if (!pp) return;

  history.replaceState({}, "", window.location.pathname + window.location.hash);

  if (pp === "OK") {
   window.showsuccessmodal("Payment done! Now you can unlock more profiles.");
  } else {
   window.showelsemodal(
    "Payment Pending: " +
    (pp === "ERR"
     ? "We could not verify your payment. Please check your status later or contact the Matrimony."
     : "Payment was not completed. Please try again.")
   );
  }
 }
 window.handlePhonePeReturn = handlePhonePeReturn;

 async function beCheckPlan_fn(plan) {
  try {
   if (typeof clearPayload0 === "function") clearPayload0();
   payload0.vw = 4;
   payload0.fn = 70;
   payload0.cd = 2;
   payload0.pid = plan.a;
   var resp = await fnj3("https://my1.in/2/c.php", payload0, 1, true, null, 20000, 0, 2, 1, 1);
   //hndlRspo70 (git/mr.js) normalises both response shapes, stores the row and returns it.
   var myRow = null;
   if (typeof window.hndlRspo70 === "function") {
    myRow = await window.hndlRspo70(resp);
   } else if (resp && resp.su == 1) {
    myRow = (resp.mr && resp.mr.l && resp.mr.l[0]) || (Array.isArray(resp.l) && resp.l[0]) || null;
   }
   if (!myRow) {
    //no own row came back (or the handler already showed the error)
    return;
   }
   //success: dismiss the plans modal before the success message / payment redirect
   close();
   //hndlRspo70 (git/mr.js) already looked the plan up from resp.pid and continued to mrPayForPlan.
   //free plan: hndlRspo70 already stored it
   if (Number(plan.e) === 0 && !(resp?.mr?.l?.m || resp?.mr?.m) && typeof window.showsuccessmodal === "function") {
    window.showsuccessmodal("Free plan added!");
   }
  } catch (err) {
   window.showelsemodal((err && err.message) || err);
  }
  //alert("Free plan selected" + (plan && plan.d ? ": " + plan.d : ""));
 }
 window.beCheckPlan_fn = beCheckPlan_fn;

 window.mrPayForPlan = async function (plan) {
  if (!plan) return;

  if (!gatewayOn()) {
   var msg = "Notice: " + (cfg().noPaymentGatewayMsg || "Online payment is not available right now.");
   if (typeof window.showConfirmModal === "function") { await window.showConfirmModal(msg); }
   else { toast(msg, "info"); }
   return;
  }

  //order id = <mr.a>_<Date.now()>. When the member has no own profile row yet:
  //  paymentRequiresProfile = 1 -> ask them to log in/register and stop
  //  paymentRequiresProfile = 0 -> continue with an empty id part ("_<time>")
  var me = (typeof window.myEinMR !== "undefined" && window.myEinMR) || {};
  var mrA = (me && me.a != null && me.a !== "") ? String(me.a) : "";
  var needsProfile = Number((cfg().cust_da_const || {}).paymentRequiresProfile) === 1;
  if (!mrA && needsProfile) {
   var ask = "Please log in or register your profile before buying a plan.";
   if (typeof window.showConfirmModal === "function") { await window.showConfirmModal(ask); }
   else { toast(ask, "info"); }
   return;
  }
  //beCheckPlan_fn();
  var orderId = mrA + "_" + Date.now();
  startPhonePePayment({ paymentPhonePayGT: Number(plan.e) || 0, grandTotal: Number(plan.e) || 0, plan: plan }, orderId);
 };

 window.showMarriagePlans = showMarriagePlans;
})();
