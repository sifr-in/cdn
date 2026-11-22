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
  var cc = (window[my1uzr.worknOnPg]?.clientConfigByAdm?.cust_da_const) || (cfg().cust_da_const || {});
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
   ".mrp-plan-price{flex:0 0 auto;font-size:26px;font-weight:800;color:var(--mrp-ember);white-space:nowrap;}",
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
   ".mrp-plan--added{border-color:rgba(224,122,26,.55);background:linear-gradient(180deg,#fff5e9,#ffffff);}",
   ".mrp-plan--added:hover{border-color:#e07a1a;box-shadow:0 10px 26px rgba(224,122,26,.16);}",
   ".mrp-plan--added .mrp-plan-price{color:#e07a1a;}",
   ".mrp-plan--added .mrp-perk{color:#8a4a0b;background:#fdefdd;border-color:rgba(224,122,26,.4);}",
   ".mrp-buy--added{background-image:linear-gradient(135deg,#f59e42,#e07a1a);box-shadow:0 10px 24px rgba(224,122,26,.32);color:#fff;}",
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
  //stop any sound the shared button is playing when this modal closes
  if (window.mrSoundBtn) window.mrSoundBtn.hide();
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

 //free plan button: "All free count Used" for any registered member (own profile row present)
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

  //free plan button: any registered member (own profile row present) => "All free count Used"
  function freeAlreadyAdded() {
    try {
      var me = ownMyEinMR();
      return !!(me && me.a != null && me.a !== "");
    } catch (e) { return false; }
  }

  //mr.da.wajiw lookup by key ('pgf' = Get Free, 'pga' = All free count Used)
  function soundRawOf(key) {
    var wj = cfg().wajiw;
    if (!Array.isArray(wj)) return "";
    for (var i = 0; i < wj.length; i++) {
      if (wj[i] && String(wj[i].a) === String(key)) return wj[i].e || "";
    }
    return "";
  }
  //which info sound the plans modal offers: free plan not added vs already added
  function freePlanSoundRaw() {
    var freeCnt = Number((window[my1uzr.worknOnPg]?.clientConfigByAdm?.cust_da_const || cfg().cust_da_const || {}).freeCnt) || 0;
    if (freeAlreadyAdded()) return soundRawOf(freeCnt > 0 ? "pga" : "pgaNoFree");
    return soundRawOf(freeCnt > 0 ? "pgf" : "pgfNoFree");
  }

  function planHtml(plan, recommended) {
  var id = esc(plan.a);
  var name = esc(plan.d || "Plan");
  var count = Number(plan.f) || 0;
  var isFree = Number(plan.e) === 0;
  var freeAdded = isFree && freeAlreadyAdded();
  var price = isFree ? "Free" : currency(plan.e);
  var priceWorth = currency(plan.g);
  var perk = '<span class="mrp-perk"><i class="fas fa-unlock"></i>' +
   (count > 0 ? "+" + count + " profile unlock" + (count === 1 ? "" : "s") : "profile access") +
   '</span>';
  return '<div class="mrp-plan' + (recommended ? ' mrp-plan--rec' : '') +
   (isFree ? ' mrp-plan--free' : '') +
   (freeAdded ? ' mrp-plan--added' : '') + '" data-plan="' + id + '">' +
   (recommended ? '<span class="mrp-rec">Best match</span>' : '') +
   '<div class="mrp-plan-top">' +
   '<div>' +
   '<h4 class="mrp-plan-name">' + name + '</h4>' +
   '<div class="mrp-plan-perks">' + perk + '</div>' +
   '</div>' +
   '<div class="mrp-plan-price">' + price + ' <span class="fs-4 text-danger text-decoration-line-through">' + priceWorth + '</span></div>' +
   '</div>' +
   '<button type="button" class="mrp-buy' + (isFree ? ' mrp-buy--free' : '') + (freeAdded ? ' mrp-buy--added' : '') + '" data-buy="' + id + '" '+ (isFree && freeAdded ? 'disabled' : '') +'>' +
   '<i class="fas fa-' + (isFree ? (freeAdded ? 'check' : 'gift') : 'bolt') + '"></i>' +
   (isFree ? (freeAdded ? 'All free count Used' : 'Get Free') : 'Buy') + '</button>' +
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
   //free plan card is only shown when mr.da freeCnt > 0
   var freeCnt = Number((cfg().cust_da_const || {}).freeCnt) || 0;
   var visibleList = list.filter(function (p) {
    if (Number(p.e) === 0 && !(freeCnt > 0)) return false;
    return true;
   });
   body = '<div class="mrp-list">' + visibleList.map(function (p) {
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
  //shared single sound button: free-plan state decides which wajiw sound is armed
  if (window.mrSoundBtn) {
   var planSnd = freePlanSoundRaw();
   if (!planSnd) console.warn("plans: no wajiw sound for", freeAlreadyAdded() ? "pga" : "pgf");
   window.mrSoundBtn.show(planSnd);
   if (planSnd) {
    if (typeof window.mrPlaySound === "function") window.mrPlaySound(planSnd); //auto-play via the shared pipeline
    else window.mrSoundBtn.play(planSnd);
   }
  }
  requestAnimationFrame(function () { ov.classList.add("open"); });

  ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
  box.querySelector("[data-close]").addEventListener("click", close);

  Array.prototype.forEach.call(box.querySelectorAll("[data-buy]"), function (btn) {
   btn.addEventListener("click", async function () {
    var id = btn.getAttribute("data-buy");
    var plan = list.find(function (p) { return String(p.a) === id; });
    if (!plan) return;
    //free plans (price 0) always go through the backend handler
    if (Number(plan.e) === 0) { window.beCheckPlan_fn(plan); return; }
    //paid plan: a member who has no OWN mr record yet must create it first - the
    //backend handler does that and then continues to mrPayForPlan. The test is the
    //same "own row present" one the free button uses (myEinMR / <tn>_myEinMR), so
    //the button state, the info sound and this routing never disagree.
    if (!freeAlreadyAdded()) { window.beCheckPlan_fn(plan); return; }
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
   console.info("[plans] payment.request", {
    flow: paymentBookingId,
    amountRupees: amount,
    mp: (snap.plan && snap.plan.e != null) ? Number(snap.plan.e) : 0,
    planId: (snap.plan && snap.plan.a != null) ? Number(snap.plan.a) : 0,
    eo: (window.appOwner && window.appOwner.eo) || "",
    ec: (window.appOwner && window.appOwner.ec) || "",
   });
   var resp = await fetch("https://zariya.vip/phonepe/request.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     amountRupees: amount,
     bookingId: paymentBookingId,
     // planIDs in fp 104 are keyed by the amount (50/200/350), not the UI id (1/2/3)
     mp: (snap.plan && snap.plan.e != null) ? Number(snap.plan.e) : 0,
     planId: (snap.plan && snap.plan.a != null) ? Number(snap.plan.a) : 0,
     jk: (window.my1uzr && window.my1uzr.jk) || '',
     eo: (window.appOwner && window.appOwner.eo) || '',
     ec: (window.appOwner && window.appOwner.ec) || '',
    }),
   });
   var data = await resp.json();
   if (typeof window.my1PageLoader === "function") window.my1PageLoader(false);
   console.info("[plans] payment.response", {
    flow: paymentBookingId,
    http: resp.status,
    orderId: data.orderId || "",
    error: data.error || "",
   });

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

 /* Return leg: PhonePe redirects back with ?pp=OK|ERR. The mp ledger row is
  * credited server-side in phonepe/redirect.php before the browser lands here;
  * planResult=OK|FAIL says whether that call succeeded. On OK we refresh the
  * member row with beCheckPlan_fn(0) so the paid unlock count reaches the UI. */
 var handledPhonePeReturn = false;
 async function handlePhonePeReturn() {
  if (handledPhonePeReturn) return;
  var params = new URLSearchParams(window.location.search);
  var pp = params.get("pp");
  if (!pp) return;
  handledPhonePeReturn = true;

  var planResult = params.get("planResult") || "";
  var planMsg = params.get("planMsg") || "";
  var oid = params.get("oid") || "";
  console.info("[plans] payment.return", { pp: pp, oid: oid, planResult: planResult, planMsg: planMsg });

  try {
   history.replaceState({}, "", window.location.pathname + window.location.hash);
  } catch (eH) { }

  if (pp === "OK") {
   if (planResult !== "OK") {
    window.showelsemodal(
     "Payment verified but plan update failed. " +
     (planMsg ? "Reason: " + planMsg : "Please contact support.")
    );
    return;
   }

   // Wait for mr.js to finish booting so hndlRspo70 / mrRenderList are ready.
   try {
    if (window.__mrInitPromise && typeof window.__mrInitPromise.then === "function") {
     await window.__mrInitPromise;
    }
   } catch (eInit) {
    console.warn("[plans] mr init wait failed", eInit);
   }

   try {
    console.info("[plans] refresh.call", { fn: 70, pid: 0, flow: oid });
    await window.beCheckPlan_fn(0);
    console.info("[plans] refresh.done", { fn: 70, pid: 0, flow: oid });
   } catch (eRefresh) {
    console.warn("[plans] refresh.failed", eRefresh);
   }

   window.showsuccessmodal("Payment done! Now you can unlock profile/s.");
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
   var checkPid = (plan && plan.a != null) ? plan.a : 0;
   console.info("[plans] fn70.start", { fn: 70, cd: 2, pid: checkPid });
   if (typeof clearPayload0 === "function") clearPayload0();
   payload0.fn = 70;
   payload0.cd = 2;
   payload0.pid = checkPid;
   payload0.ul = "3/0d.php";
   payload0.gt = 3;
   var resp = await fnj4(null, payload0, 1, 1, null, 20000, 2, 1);
   console.info("[plans] fn70.response", { fn: 70, pid: checkPid, su: resp && resp.su, ms: (resp && (resp.ms || resp.m)) || "" });
   //var resp = await fnj3("https://my1.in/3/d.php", payload0, 1, true, null, 20000, 0, 2, 1, 1);
   //hndlRspo70 (git/mr.js) normalises both response shapes, stores the row and returns it.
   var myRow = null;
   if (typeof window.hndlRspo70 === "function") {
    myRow = await window.hndlRspo70(resp);
   }
  //  else if (resp && resp.su == 1) {
  //   myRow = (resp.mr && resp.mr.l && resp.mr.l[0]) || (Array.isArray(resp.l) && resp.l[0]) || null;
  //  }
   //yza can be absent: do NOT guess from mr.l[0] (it may be an unlocked other). Use the
   //member's own persisted row only, so the success/plan flow is not aborted silently.
   if (!myRow && resp && resp.su == 1 && window.myEinMR && window.myEinMR.a != null) {
    myRow = window.myEinMR;
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
  var mrA = (me && me.a != null && me.a !== "") ? String(me.a) : "0";
  var needsProfile = Number((window[my1uzr.worknOnPg]?.clientConfigByAdm?.cust_da_const || cfg().cust_da_const || {}).paymentRequiresProfile) === 1;
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

 //close hook for the shared fn-70 success handler (git/mr.js hndlRspo70): the plans
 //modal can be the origin of a login/"Get Free" flow and is stale once it succeeds
 window.mrCloseMarriagePlans = close;
 window.showMarriagePlans = showMarriagePlans;

 /* PhonePe returns the browser here with ?pp=OK&planResult=... .
  * The mp ledger row is credited server-side by phonepe/redirect.php; this
  * only shows the right message once the page/UI scripts are ready. */
 if (document.readyState === 'complete') {
  setTimeout(handlePhonePeReturn, 0);
 } else {
  window.addEventListener('load', function () { setTimeout(handlePhonePeReturn, 0); });
 }
})();