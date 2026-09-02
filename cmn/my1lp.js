// Global variables
if (typeof nameOfLoggedInPage === "undefined") { var nameOfLoggedInPage = ""; }
if (typeof originalBodyStyles === "undefined") { var originalBodyStyles = ""; }
let id_of_dv_shoLgnP_to_set_processed_dom_object;
let switch_shoLgnP_create_nw_modal;
let swtch_0nothing_1flex_2block_shoLgnP;
if (typeof swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === "undefined") { var swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn = 0; }
if (typeof isOtpSuppressed === "undefined") { var isOtpSuppressed = false; }

// Resend timer functionality
if (typeof resendTimer === "undefined") { var resendTimer = null; }
if (typeof resendTimeLeft === "undefined") { var resendTimeLeft = 0; }

// Full screen loader element
if (typeof fullScreenLoader === "undefined") { var fullScreenLoader = null; }

// Check if user is logged in
function isLoggedInLP() {
 return typeof my1uzr !== 'undefined' && my1uzr != null && my1uzr.mk != null;
}

function showAlertModal(message, type = 'error') {
 const { contentElement, modalInstance, modalElement } = create_modal_dynamically('alertModal_' + Date.now());
 modalElement.querySelector('.modal-dialog').style.marginTop = '80px';
 const icon = type === 'success' ? 'fa-check-circle text-success' : 'fa-exclamation-circle text-danger';
 const title = type === 'success' ? 'Success' : 'No Success';
 const titleColor = type === 'success' ? 'text-success' : 'text-danger';
 contentElement.innerHTML = `
      <div class="modal-header">
         <h5 class="modal-title ${titleColor}">${title}</h5>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-center">
         <i class="fas ${icon}" style="font-size: 3rem;"></i>
         <p class="mt-3 mb-0">${message}</p>
      </div>
      <div class="modal-footer justify-content-center">
         <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal">OK</button>
      </div>
   `;
 modalInstance.show();
}

// function showUserInfoModal() {
//  if (!my1uzr) return;

//  const { contentElement, modalInstance } = create_modal_dynamically('user_info');

//  contentElement.innerHTML = `
// <div class="modal-header">
// <h5 class="modal-title">User <span style="color: red; cursor: pointer; margin-left: 5px;" onclick="logPout()">_</span> Information</h5>
// <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
// </div>
// <div class="modal-body">
// <div class="text-center mb-4">
// <div class="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
// ${my1uzr.ml ?
//    `<img src="${my1uzr.ml}" alt="Profile Picture" class="rounded-circle w-100 h-100" style="object-fit: cover;">` :
//    '<i class="fas fa-user text-white" style="font-size: 2rem;"></i>'
//   }
// </div>
// <h6 class="mb-1">${my1uzr.mn || "No Name"}</h6>
// ${my1uzr.mu ? `<p class="text-muted small mb-2">${my1uzr.mu}</p>` : ''}
// </div>

// <div class="border-top pt-3">
// <div class="row mb-2">
// <div class="col-4 text-muted">Mobile Number</div>
// <div class="col-8">${my1uzr.mo || "Not available"}</div>
// </div>
// <div class="row mb-2">
// <div class="col-4 text-muted">Constraint</div>
// <div class="col-8">${my1uzr.mc || "Not available"}</div>
// </div>
// <div class="row mb-2">
// <div class="col-4 text-muted">Relation ID</div>
// <div class="col-8">${my1uzr.mr || "Not available"}</div>
// </div>
// </div>
// </div>
// <div class="modal-footer">
// <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
// </div>
// `;

//  modalInstance.show();
// }

// Show logout option modal
function showLogoutOptionLP() {
 const { contentElement, modalInstance } = create_modal_dynamically('logoutModal');

 contentElement.innerHTML = `
<div class="modal-header">
<h5 class="modal-title">Logout</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body">
<p>Are you sure you want to logout?</p>
</div>
<div class="modal-footer">
<button id="logoutCancel" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
<button id="logoutConfirm" type="button" class="btn btn-danger">Logout</button>
</div>
`;

 modalInstance.show();

 const confirmBtn = document.getElementById('logoutConfirm');

 if (confirmBtn) {
  confirmBtn.addEventListener('click', () => {
   my1uzr = null;
   localStorage.setItem('my1uzr', null);
   location.reload();
  });
 }
}

// Save original body styles
function saveBodyStylesLP() {
 originalBodyStyles = {
  overflow: document.body.style.overflow,
  position: document.body.style.position,
  width: document.body.style.width
 };
}

// Restore body styles
function restoreL3BodyStylesLP() {
 document.body.style.overflow = originalBodyStyles.overflow || '';
 document.body.style.position = originalBodyStyles.position || '';
 document.body.style.width = originalBodyStyles.width || '';
}

// Function to show mobile confirmation modal
function showMobileConfirmationModalLP(countryCode, mobileNumber, callback) {
 const { contentElement, modalInstance } = create_modal_dynamically('mobileConfirmationModal');

 contentElement.innerHTML = `
<div class="modal-header">
<h5 class="modal-title">Confirm Mobile Number</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body">
<p class="text-center mb-4">Please confirm your mobile number: ${countryCode} ${mobileNumber}</p>
<button id="confirmMobileYes" type="button" class="btn btn-primary w-100 mb-2">Yes, this is correct</button>
<button id="confirmMobileNo" type="button" class="btn btn-outline-secondary w-100">No, let me edit</button>
</div>
<div class="modal-footer"></div>
`;

 modalInstance.show();

 document.getElementById('confirmMobileYes').addEventListener('click', () => {
  modalInstance.hide();
  callback(true);
 });

 document.getElementById('confirmMobileNo').addEventListener('click', () => {
  modalInstance.hide();
  callback(false);
 });
}

// Show full screen loader
function showFullScreenLoaderLP(message = 'Processing...') {
 fullScreenLoader = createDynamicLoader(message);
}

// Hide full screen loader
function hideFullScreenLoaderLP() {
 if (fullScreenLoader && typeof fullScreenLoader.removeLoader === 'function') {
  fullScreenLoader.removeLoader();
  fullScreenLoader = null;
 }
}

// Generate HTML for the login modal
function set_innerHTML_of_shoLgnP() {
 return `
<div class="container p-0">
<div class="card">
<div class="card-header text-center d-flex justify-content-between align-items-center">
<h5 class="card-title mb-0">Login with Password</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="card-body" style="background-color: #FFCCFF;">
<div class="mb-3">
<!--label for="loginMobile" class="form-label">Mobile Number</label-->
<div class="input-group flex-nowrap">
<select id="lp-loginCountryCode" class="form-select" style="max-width: 120px; width: auto; flex-shrink: 0;"></select>
<div id="lp-mobileDigitsContainer" class="d-flex gap-1 ms-2 flex-row flex-wrap"></div>
</div>
<div id="lp-mobileLengthInfo" class="form-text ms-2"></div>
<div id="lp-mobileError" class="invalid-feedback d-none">Please enter a valid mobile number</div>
</div>

<div class="row align-items-center g-2 mb-3">
    <div class="col-8">
        <input type="password" id="loginPassword" class="form-control border border-dark"
            placeholder="Enter password (6-8 characters)"
            minlength="6" maxlength="8" pattern="[a-zA-Z0-9]+">
    </div>

    <div class="col-4">
        <button id="loginSubmit" class="btn btn-primary w-100 position-relative">
            <span id="loginText">Login</span>
            <span id="loginLoader"
                class="spinner-border spinner-border-sm d-none position-absolute"
                style="right:10px;top:50%;transform:translateY(-50%);">
            </span>
        </button>
    </div>
</div>

<div id="passwordError" class="invalid-feedback d-none mb-3">
    Password must be 6-8 characters
</div>

<div class="row align-items-center mt-3">
    <div class="col-6">
        <a href="#" class="text-decoration-none" id="forgotPassword">
            Forgot password?
        </a>
    </div>

    <div class="col-6 text-end">
        <button id="switchToRegister" class="btn btn-outline-primary btn-sm">
            New Register
        </button>
    </div>
</div>

</div>
</div>
</div>
`;
}

// Generate HTML for the registration modal
function set_innerHTML_of_register() {
 return `
<div class="container p-0">
<div class="card">
<div class="card-header text-center d-flex justify-content-between align-items-center">
<h5 class="card-title mb-0">Register <span id="lp-otpTextToggle" style="cursor: pointer; padding: 2px 5px; border-radius: 3px; transition: all 0.3s;">New</span> Account</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="card-body" style="background-color: #99FFFF; max-height: 70vh; overflow-y: auto;">
<div class="mb-3">
<!--label for="registerMobile" class="form-label">Mobile Number</label-->
<div class="input-group flex-nowrap">
<select id="lp-registerCountryCode" class="form-select" style="max-width: 120px; width: auto; flex-shrink: 0;"></select>
<div id="lp-registerMobileDigitsContainer" class="d-flex gap-1 ms-2 flex-row flex-wrap"></div>
</div>
<div id="lp-registerMobileLengthInfo" class="form-text ms-2"></div>
<div id="lp-registerMobileError" class="invalid-feedback d-none">Please enter a valid mobile number</div>
</div>

<label class="form-check-label ml-2 mb-4" id="lp-termsLabel">
You agree with the <a href="#" class="text-primary">Terms & Conditions</a> when you click on "Send OTP"
</label>

<div id="my1lpXtraFields"></div>

<button id="lp-sendOtpBtn" class="btn btn-primary w-100 position-relative">
<span id="lp-sendOtpText">Send OTP</span>
<span id="lp-sendOtpLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
</button>

<div id="lp-resendContainer" class="d-none ml-3">
<strong><span id="lp-resendCountdown" class="text-primary fw-bold"></span></strong>
</div>

<div id="lp-otpSection" class="d-none mt-3">
<div class="mb-3">
<label class="form-label">Enter OTP (6 digits)</label>
<div id="lp-otpDigitsContainer" class="d-flex gap-1 justify-content-center"></div>
</div>

<div class="text-center mt-2">
<button id="lp-resendOtp" class="btn btn-outline-secondary btn-sm">Resend OTP</button>
</div>

<button id="lp-verifyOtpBtn" class="btn btn-primary w-100 mt-2 position-relative">
<span id="lp-verifyOtpText">Verify OTP</span>
<span id="lp-verifyOtpLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
</button>
</div>

<div id="registrationForm" class="d-none mt-3">
<div class="mb-3 d-none" id="localNameSection">
<label for="localName" class="form-label">Name in Local Language</label>
<input type="text" id="localName" class="form-control" placeholder="Name in local language (non-English characters only)">
<div id="localNameError" class="invalid-feedback d-none">Name must be in local language characters only, no English letters or numbers</div>
</div>

<div class="mb-3">
<label for="regPassword" class="form-label">Password (6-8 characters)</label>
<input type="password" id="regPassword" class="form-control" placeholder="Enter password" minlength="6" maxlength="8" pattern="[A-Za-z0-9]+">
</div>

<div class="mb-3">
<label for="confirmPassword" class="form-label">Confirm Password</label>
<input type="password" id="confirmPassword" class="form-control" placeholder="Confirm password" minlength="6" maxlength="8" pattern="[A-Za-z0-9]+">
<div id="confirmPasswordError" class="invalid-feedback d-none">Passwords do not match</div>
</div>

<button id="completeRegistration" class="btn btn-primary w-100 position-relative">
<span id="completeRegText">Complete Registration</span>
<span id="completeRegLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
</button>
</div>

</div>
<div class="row align-items-center mt-1">
    <div class="col-8">
        <hr class="my-1">
        <p class="text-muted mb-0 ms-1">Already have an account?</p>
    </div>

    <div class="col-4 text-end">
        <hr class="my-1">
        <button id="switchToLogin" class="btn btn-outline-secondary btn-sm">
            Login here
        </button>
    </div>
</div>
</div>
</div>
</div>
`;
}

// ========== Dynamic extra fields for register (b.da.xtraEiFlds_forLoginP) ==========
// Mirrors the ei.js/my1lo.js dynamic-extra-fields engine, self-contained with a "my1lpX"
// prefix to avoid global-name collisions when ei.js and/or my1lo.js are present.
function my1lpXtraGet() {
 try {
  var c = (typeof window[my1uzr.worknOnPg].clientConfig === "object" && window[my1uzr.worknOnPg].clientConfig) ? window[my1uzr.worknOnPg].clientConfig : {};
  var defs = c && c.xtraEiFlds_forLoginP;
  return (defs && typeof defs === "object" && Object.keys(defs).length > 0) ? defs : null;
 } catch (e) { return null; }
}
function my1lpXtraIsGroup(def) {
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
function my1lpXtraChildren(def) {
 return (def.x && typeof def.x === "object") ? def.x : def;
}
function my1lpXtraQuery(sel, path) {
 return document.querySelector("." + sel + '[data-path="' + path + '"]');
}
function my1lpXtraTheme() {
 var r = (typeof window.my1loThemeReport === "object" && window.my1loThemeReport) ? window.my1loThemeReport : {};
 var brand = r.brandHex || r.brand || "#9933cc";
 var brandDark = r.brandDark || brand;
 var onBrand = r.onBrand || "#ffffff";
 var lightBg = r.lightBg || "#ffffff";
 var ink = r.ink || "#212529";
 return { brand: brand, brandDark: brandDark, onBrand: onBrand, lightBg: lightBg, ink: ink };
}
function my1lpXtraRender() {
 var wrap = document.getElementById("my1lpXtraFields");
 if (!wrap) return;
 var xtra = my1lpXtraGet();
 if (!xtra) { wrap.innerHTML = ""; wrap.style.display = "none"; return; }
 wrap.style.display = "";
 var p = my1lpXtraTheme();
 var inpDyn = "display:block;width:100%;background:#fff;border:2px solid #6c757d;border-radius:10px;padding:8px 12px;font-size:14px;color:" + p.ink + ";outline:none;";
 var boxStyle = "border:2px solid #6c757d;border-radius:.5rem;padding:8px 10px;margin-bottom:.5rem;background:" + p.lightBg + ";";
 var html = "";
 function renderDef(def, path, inDiv) {
  var out = "";
  if (!def || typeof def !== "object") return out;
  if (my1lpXtraIsGroup(def)) {
   var children = my1lpXtraChildren(def);
   var hasBox = (def.type === "div" || (def.x && typeof def.x === "object") || !!def.lbl) && !inDiv;
   var isMeta = function (key) { return key === "lbl" || key === "type" || key === "ptrn" || key === "rq" || key === "preProcess" || key === "postProcess" || key === "x"; };
   if (hasBox) {
    out += '<div style="' + boxStyle + '">';
    if (def.lbl) out += '<div class="text-xs fw-bold text-uppercase mb-2" style="color:#343a40;"><i class="fas fa-layer-group me-1" style="color:' + p.brand + ';"></i>' + def.lbl + '</div>';
    for (var ck in children) {
     if (!children.hasOwnProperty(ck)) continue;
     if (!def.x && isMeta(ck)) continue;
     out += renderDef(children[ck], path + "__" + ck, true);
    }
    out += "</div>";
   } else {
    if (def.lbl) out += '<div class="text-xs fw-bold text-uppercase mt-3" style="color:#343a40;"><i class="fas fa-layer-group me-1" style="color:' + p.brand + ';"></i>' + def.lbl + '</div>';
    for (var pk in children) {
     if (!children.hasOwnProperty(pk)) continue;
     if (isMeta(pk)) continue;
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
  out += '<label class="form-label m-0 fw-bold mb-1" style="font-size:12.5px;color:#343a40;">' + lbl + reqMark + "</label>";
  if (ftype === "file") {
   out += '<div class="my1lpXph-img-box" data-path="' + path + '" style="border:2px dashed #6c757d;border-radius:.5rem;text-align:center;padding:14px 8px;cursor:pointer;background:#f8f9fa;"><i class="fas fa-image mb-1 d-block" style="font-size:1.6rem;color:' + p.brand + ';"></i><span class="fw-bold">' + lbl + "</span></div>";
   out += '<div class="my1lpXph-img-prev" data-path="' + path + '" style="display:none;margin-top:6px;border:2px solid #6c757d;border-radius:.5rem;padding:6px;text-align:center;"><img class="my1lpXph-img-prev-img" data-path="' + path + '" src="" alt="' + lbl + '" style="max-width:100%;height:auto;max-height:150px;display:block;margin:auto;"><div class="mt-1"><span class="small text-muted my1lpXph-img-prev-name" data-path="' + path + '"></span><button type="button" class="btn btn-sm btn-outline-danger my1lpXph-img-remove" data-path="' + path + '" style="padding:0 6px;margin-left:6px;"><i class="fas fa-times"></i> Remove</button></div></div>';
   out += '<input type="hidden" class="my1lpXph-val" data-path="' + path + '">';
  } else if (ftype === "textarea") {
   out += '<textarea class="my1lpXph-val" data-path="' + path + '" rows="2" placeholder="' + ph + '" style="font-size:14px;' + inpDyn + 'resize:vertical;min-height:40px;"></textarea>';
  } else if (ftype === "select") {
   out += '<select class="my1lpXph-val" data-path="' + path + '" style="font-size:14px;' + inpDyn + 'padding:6px 8px;">';
   if (def.placeholder) out += '<option value="" disabled selected>' + def.placeholder + "</option>";
   var opts = def.opts || def.opt || {};
   if (typeof opts === "string") { opts = (window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig[opts]) || {}; }
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
    (def.strip ? ' data-strip="' + def.strip + '"' : "") +
    (def.min !== undefined && def.min !== null ? ' min="' + def.min + '"' : "") +
    (def.max !== undefined && def.max !== null ? ' max="' + def.max + '"' : "");
   out += '<input type="' + itype + '" class="my1lpXph-val" data-path="' + path + '" placeholder="' + ph + '" style="font-size:14px;' + inpDyn + '"' + dynAttrs + ">";
  }
  out += '<span class="my1lpXph-err" data-path="' + path + '" style="font-size:11px;color:#dc3545;display:none;margin-top:2px;"></span>';
  if (!inDiv) out += "</div>";
  return out;
 }
 for (var k in xtra) {
  if (!xtra.hasOwnProperty(k)) continue;
  var defx = xtra[k];
  if (defx && defx.cfgKey) {
   var w = (typeof my1uzr !== "undefined" && my1uzr && my1uzr.worknOnPg) ? window[my1uzr.worknOnPg] : null;
   var confg = (w && w.confg) || null;
   if (!confg || !confg[defx.cfgKey]) continue;
  }
  html += renderDef(xtra[k], k, false);
 }
 wrap.innerHTML = html;
 my1lpXtraBind();
}
function my1lpXtraSetImg(path, url) {
 var val = my1lpXtraQuery("my1lpXph-val", path);
 var box = my1lpXtraQuery("my1lpXph-img-box", path);
 var prev = my1lpXtraQuery("my1lpXph-img-prev", path);
 var img = my1lpXtraQuery("my1lpXph-img-prev-img", path);
 var nameEl = my1lpXtraQuery("my1lpXph-img-prev-name", path);
 if (val) val.value = url;
 if (box) { box.style.display = url ? "none" : ""; box.style.borderColor = "#6c757d"; }
 if (prev) prev.style.display = url ? "block" : "none";
 if (img) { if (url) img.src = url; else img.removeAttribute("src"); }
 if (nameEl) nameEl.textContent = url ? "Image selected" : "";
}
function my1lpXtraBind() {
 document.querySelectorAll(".my1lpXph-img-box").forEach(function (box) {
  box.addEventListener("click", async function (e) {
   e.preventDefault();
   e.stopPropagation();
   var path = this.getAttribute("data-path");
   var cbName = "my1lpXtraImgCb_" + path.replace(/[^a-zA-Z0-9]/g, "_");
   window[cbName] = function (obj) {
    var url = (obj && (obj.g1 || obj.url)) || "";
    my1lpXtraSetImg(path, url);
    delete window[cbName];
   };
   try {
    await loadExe2Fn(24, [window[cbName], window.imgObjDimensRqd2 || []], [1]);
   } catch (err) { delete window[cbName]; }
  });
 });
 document.querySelectorAll(".my1lpXph-img-remove").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
   e.stopPropagation();
   my1lpXtraSetImg(this.getAttribute("data-path"), "");
  });
 });
 document.querySelectorAll(".my1lpXph-val[data-uc], .my1lpXph-val[data-strip], .my1lpXph-val[data-maxlen]").forEach(function (el) {
  el.addEventListener("input", function () {
   var v = el.value || "";
   var strip = el.getAttribute("data-strip");
   if (strip) { try { v = v.replace(new RegExp(strip, "g"), ""); } catch (e) {} }
   if (el.getAttribute("data-uc")) v = v.toUpperCase();
   var ml = parseInt(el.getAttribute("data-maxlen") || "", 10);
   if (ml > 0 && v.length > ml) v = v.substring(0, ml);
   if (el.value !== v) el.value = v;
  });
 });
 document.querySelectorAll("#my1lpXtraFields .my1lpXph-val").forEach(function (el) {
  el.addEventListener("input", function () { my1lpXtraLiveCheck(this); });
  el.addEventListener("change", function () { my1lpXtraLiveCheck(this); });
 });
}
function my1lpXtraFindDefByPath(xtra, path) {
 if (!xtra || typeof xtra !== "object") return null;
 var parts = path.split("__");
 var cur = xtra;
 for (var i = 0; i < parts.length; i++) {
  if (!cur || typeof cur !== "object") return null;
  cur = cur[parts[i]];
  if (!cur) return null;
  if (my1lpXtraIsGroup(cur)) { cur = my1lpXtraChildren(cur); }
  else if (i < parts.length - 1) return null;
 }
 return cur;
}
function my1lpXtraCheckField(def, path, focusOnFail) {
 if (!def || typeof def !== "object") return true;
 var el = my1lpXtraQuery("my1lpXph-val", path);
 if (!el) return true;
 var isFile = def.type === "file";
 var req = def.rq === 1 || def.rq === true;
 var errEl = my1lpXtraQuery("my1lpXph-err", path);
 var val = String(el.value || "").trim();
 var failLocal = function (msg) {
  if (errEl) { errEl.textContent = msg; errEl.style.display = "block"; }
  if (isFile) { var box = my1lpXtraQuery("my1lpXph-img-box", path); if (box) box.style.borderColor = "#dc3545"; }
  else el.style.borderColor = "#dc3545";
  if (focusOnFail) {
   try { var t = isFile ? my1lpXtraQuery("my1lpXph-img-box", path) : el; t.focus(); t.scrollIntoView({ block: "center" }); } catch (e) {}
  }
  return false;
 };
 var clear = function () {
  if (errEl) errEl.style.display = "none";
  if (isFile) { var box = my1lpXtraQuery("my1lpXph-img-box", path); if (box) box.style.borderColor = "#6c757d"; }
  else el.style.borderColor = "#6c757d";
  return true;
 };
 if (req && !val) return failLocal((def.lbl || path) + " is required");
var ptrn = def.ptrn || def.pattern;
  if (val && ptrn && typeof ptrn === "string") {
  var re = null;
  try { re = new RegExp(ptrn); } catch (e) { re = null; }
  if (re && !re.test(val)) return failLocal("Invalid " + (def.lbl || path));
 }
 if (val && def.type === "email") {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return failLocal("Please enter valid email!");
 }
 if (val && def.type === "url") {
  if (!/^https?:\/\/.+\..+/.test(val)) return failLocal("Please enter valid URL!");
 }
 var vfn = def.validate;
 if (vfn && typeof window[vfn] === "function") {
  if (!window[vfn](el, errEl, def.lbl || path)) return false;
 }
 return clear();
}
function my1lpXtraLiveCheck(el) {
 if (!el) return;
 var path = el.getAttribute("data-path");
 if (!path) return;
 var def = my1lpXtraFindDefByPath(my1lpXtraGet(), path);
 my1lpXtraCheckField(def, path, false);
}
function my1lpXtraValidate() {
 var xtra = my1lpXtraGet();
 if (!xtra || typeof xtra !== "object") return true;
 var ok = true;
 var firstInvalid = null;
 function walk(obj, basePath) {
  for (var k in obj) {
   if (!obj.hasOwnProperty(k)) continue;
   var def = obj[k];
   var path = basePath ? basePath + "__" + k : k;
   if (!def || typeof def !== "object") continue;
   if (my1lpXtraIsGroup(def)) { walk(my1lpXtraChildren(def), path); continue; }
   if (!my1lpXtraCheckField(def, path, false)) {
    ok = false;
    if (!firstInvalid) {
     var el = my1lpXtraQuery("my1lpXph-val", path);
     firstInvalid = el ? (def.type === "file" ? my1lpXtraQuery("my1lpXph-img-box", path) : el) : null;
    }
   }
  }
 }
 walk(xtra, "");
 if (firstInvalid) {
  try { firstInvalid.focus(); firstInvalid.scrollIntoView({ block: "center" }); } catch (e) {}
 }
 return ok;
}
function my1lpXtraCollect() {
 var xtra = my1lpXtraGet();
 var out = {};
 if (!xtra || typeof xtra !== "object") return out;
 function walk(obj, basePath, dest) {
  for (var k in obj) {
   if (!obj.hasOwnProperty(k)) continue;
   var def = obj[k];
   var path = basePath ? basePath + "__" + k : k;
   if (!def || typeof def !== "object") continue;
   if (my1lpXtraIsGroup(def)) { dest[k] = {}; walk(my1lpXtraChildren(def), path, dest[k]); continue; }
   var el = my1lpXtraQuery("my1lpXph-val", path);
   if (el) dest[k] = el.value;
  }
 }
 walk(xtra, "", out);
 return out;
}
async function my1lpXtraRunPost(def, groupVals, payload) {
 var fn = def && def.postProcess;
 if (fn && typeof window[fn] === "function") {
  var result = await window[fn](groupVals, payload);
  if (!result) { showAlertModal("postProcess failed!"); return groupVals; }
  return result;
 }
 return groupVals;
}
async function my1lpXtraPostProcess(collected, xtra, payload) {
 if (!collected || !xtra || typeof xtra !== "object") return collected;
 for (var k in xtra) {
  if (!xtra.hasOwnProperty(k)) continue;
  var def = xtra[k];
  if (!def || typeof def !== "object") continue;
  if (my1lpXtraIsGroup(def)) {
   var children = my1lpXtraChildren(def);
   if (def.postProcess && collected[k] && typeof collected[k] === "object") {
    collected[k] = await my1lpXtraRunPost(def, collected[k], payload);
   } else if (collected[k] && typeof collected[k] === "object") {
    await my1lpXtraPostProcess(collected[k], children, payload);
   }
  } else if (def.postProcess && typeof collected[k] === "string") {
   collected[k] = await my1lpXtraRunPost(def, collected[k], payload);
  }
 }
 return collected;
}

// Main function to open the login modal
async function open_shoLgnP(...args) {
 // Request wake lock when opening login modal
 if (typeof requestWakeLock === 'function') {
  await requestWakeLock();
 }

 id_of_dv_shoLgnP_to_set_processed_dom_object = args[0];
 switch_shoLgnP_create_nw_modal = args[1] || 0;
 swtch_0nothing_1flex_2block_shoLgnP = args[2] || 0;
 swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn = args[3] || 0;

 if (isLoggedInLP()) {
  if (swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === 2) {
   showUserInfoModal();
  }
  return;
 }

 const { contentElement, modalInstance, modalElement } = create_modal_dynamically('loginPasswordModal');
 const dialog = modalElement.querySelector('.modal-dialog');
 dialog.style.marginTop = '100px';

 // Set initial content to login form
 contentElement.innerHTML = set_innerHTML_of_shoLgnP();

 // Add event listener for when modal is hidden to restore body styles and release wake lock
 modalElement.addEventListener('hidden.bs.modal', function () {
  restoreL3BodyStylesLP();
  if (typeof releaseWakeLock === 'function') {
   releaseWakeLock();
  }
 });

 modalElement.addEventListener('shown.bs.modal', function () {
  const firstInput = modalElement.querySelector('#lp-mobileDigitsContainer input');
  if (firstInput) firstInput.focus();
 });

 if (appcss) { injectMy1lpTheme(generateLognThemeP(appcss)); }

 modalInstance.show();

 // Initialize login form
 initializeLoginForm(contentElement);

 // Setup event listeners for switching between login and register
 setupFormSwitching(contentElement, modalInstance);
}

function initializeLoginForm(container) {
 const countryCodeSelect = container.querySelector('#lp-loginCountryCode');
 if (countryCodeSelect) {
  loadCountryCodesLP('lp-loginCountryCode');
  setTimeout(() => {
   countryCodeSelect.value = '+91';
   updateMobileLengthInfoLP('lp-loginCountryCode', 'lp-mobileLengthInfo');
   createMobileDigitInputsLP('lp-mobileDigitsContainer', getRequiredMobileLengthLP('+91'));
  }, 500);
 }

 setupLoginEventListeners(container);
}

function initializeRegisterForm(container) {
 const countryCodeSelect = container.querySelector('#lp-registerCountryCode');
 if (countryCodeSelect) {
  loadCountryCodesLP('lp-registerCountryCode');
  setTimeout(() => {
   countryCodeSelect.value = '+91';
   updateMobileLengthInfoLP('lp-registerCountryCode', 'lp-registerMobileLengthInfo');
   createMobileDigitInputsLP('lp-registerMobileDigitsContainer', getRequiredMobileLengthLP('+91'));
  }, 500);
 }

createOtpDigitInputsLP();
  setupRegisterEventListeners(container);
  my1lpXtraRender();
}

function setupFormSwitching(container, modalInstance) {
 const switchToRegister = container.querySelector('#switchToRegister');
 const switchToLogin = container.querySelector('#switchToLogin');

 if (switchToRegister) {
  switchToRegister.addEventListener('click', () => {
   container.innerHTML = set_innerHTML_of_register();
   initializeRegisterForm(container);
   setupFormSwitching(container, modalInstance);
  });
 }

 if (switchToLogin) {
  switchToLogin.addEventListener('click', () => {
   container.innerHTML = set_innerHTML_of_shoLgnP();
   initializeLoginForm(container);
   setupFormSwitching(container, modalInstance);
  });
 }
}

function setupLoginEventListeners(container) {
 const loginSubmit = container.querySelector('#loginSubmit');
 const loginPassword = container.querySelector('#loginPassword');
 const countryCodeSelect = container.querySelector('#lp-loginCountryCode');
 const forgotPassword = container.querySelector('#forgotPassword');

 if (countryCodeSelect) {
  countryCodeSelect.addEventListener('change', function () {
   updateMobileLengthInfoLP('lp-loginCountryCode', 'lp-mobileLengthInfo');
   const requiredLength = getRequiredMobileLengthLP(this.value);
   createMobileDigitInputsLP('lp-mobileDigitsContainer', requiredLength);
  });
 }

 if (loginSubmit) {
  loginSubmit.addEventListener('click', async function () {
   await handleLoginSubmit(container);
  });
 }

 if (forgotPassword) {
  forgotPassword.addEventListener('click', function (e) {
   e.preventDefault();
   showAlertModal('Please contact support to reset your password.');
  });
 }
}

function setupRegisterEventListeners(container) {
 const sendOtpBtn = container.querySelector('#lp-sendOtpBtn');
 const verifyOtpBtn = container.querySelector('#lp-verifyOtpBtn');
 const resendOtp = container.querySelector('#lp-resendOtp');
 const completeRegistration = container.querySelector('#completeRegistration');
 const localName = container.querySelector('#localName');
 const regPassword = container.querySelector('#regPassword');
 const confirmPassword = container.querySelector('#confirmPassword');
 const countryCodeSelect = container.querySelector('#lp-registerCountryCode');

 if (countryCodeSelect) {
  countryCodeSelect.addEventListener('change', function () {
   updateMobileLengthInfoLP('lp-registerCountryCode', 'lp-registerMobileLengthInfo');
   const requiredLength = getRequiredMobileLengthLP(this.value);
   createMobileDigitInputsLP('lp-registerMobileDigitsContainer', requiredLength);
  });
 }

 if (sendOtpBtn) {
  sendOtpBtn.addEventListener('click', async function () {
   await handleSendOtp(container);
  });
 }

 if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener('click', async function () {
   await handleVerifyOtp(container);
  });
 }

 if (resendOtp) {
  resendOtp.addEventListener('click', async function () {
   await handleResendOtp(container);
  });
 }

 if (localName) {
  localName.addEventListener('blur', function () {
   const errorElement = container.querySelector('#localNameError');
   if (errorElement) {
    const hasEnglishChars = /[A-Za-z0-9]/.test(this.value);

    if (!hasEnglishChars && this.value.trim() !== '') {
     errorElement.classList.add('d-none');
     this.classList.remove('is-invalid');
    } else if (hasEnglishChars) {
     errorElement.textContent = 'Local name must not contain English letters or numbers';
     errorElement.classList.remove('d-none');
     this.classList.add('is-invalid');
    } else {
     errorElement.classList.add('d-none');
     this.classList.remove('is-invalid');
    }
   }
  });
 }

 if (confirmPassword) {
  confirmPassword.addEventListener('input', function () {
   const password = regPassword?.value;
   const errorElement = container.querySelector('#confirmPasswordError');
   if (errorElement) {
    if (password === this.value || this.value.length === 0) {
     errorElement.classList.add('d-none');
     this.classList.remove('is-invalid');
    } else {
     errorElement.classList.remove('d-none');
     this.classList.add('is-invalid');
    }
   }
  });
 }

 if (completeRegistration) {
  completeRegistration.addEventListener('click', async function () {
   await handleCompleteRegistration(container);
  });
 }

 // Add OTP text toggle functionality
 setupOtpTextToggleLP(container);
}

// OTP text toggle function for registration
function setupOtpTextToggleLP(container) {
 const otpTextToggle = container.querySelector('#lp-otpTextToggle');
 if (otpTextToggle) {
  updateOtpTextAppearanceLP(otpTextToggle);

  otpTextToggle.addEventListener('click', function () {
   if (isOtpSuppressed) {
    if (confirm('Do you want to Enable?')) {
     isOtpSuppressed = false;
     updateOtpTextAppearanceLP(otpTextToggle);
    }
   } else {
    if (confirm('Do you want to Disable?')) {
     isOtpSuppressed = true;
     updateOtpTextAppearanceLP(otpTextToggle);
    }
   }
  });
 }
}

function updateOtpTextAppearanceLP(otpTextToggle) {
 if (otpTextToggle) {
  if (isOtpSuppressed) {
   otpTextToggle.textContent = 'disabled';
   otpTextToggle.style.backgroundColor = 'red';
   otpTextToggle.style.color = 'white';
  } else {
   otpTextToggle.textContent = 'New';
   otpTextToggle.style.backgroundColor = '';
   otpTextToggle.style.color = '';
  }
 }
}

async function handleLoginSubmit(container) {
 const countryCode = container.querySelector('#lp-loginCountryCode').value;
 const mobileNumber = getMobileNumberFromDigitsLP('lp-mobileDigitsContainer');
 const password = container.querySelector('#loginPassword').value;
 const requiredLength = getRequiredMobileLengthLP(countryCode);

 const mobileError = container.querySelector('#lp-mobileError');
 mobileError.classList.add('d-none');

 const inputs = container.querySelectorAll('#lp-mobileDigitsContainer input');
 inputs.forEach(input => input.classList.remove('is-invalid'));

 let allDigitsFilled = true;
 inputs.forEach(input => {
  if (input.value === '') {
   input.classList.add('is-invalid');
   allDigitsFilled = false;
  }
 });

 if (!allDigitsFilled) {
  mobileError.textContent = `Please enter all ${requiredLength} digits`;
  mobileError.classList.remove('d-none');
  return;
 }

 if (mobileNumber.length !== requiredLength) {
  mobileError.textContent = `Please enter a valid ${requiredLength}-digit mobile number`;
  mobileError.classList.remove('d-none');
  return;
 }

 if (password.length < 6 || password.length > 8) {
  const passwordError = container.querySelector('#passwordError');
  passwordError.textContent = 'Password must be 6-8 characters';
  passwordError.classList.remove('d-none');
  container.querySelector('#loginPassword').classList.add('is-invalid');
  return;
 }

 const loginText = container.querySelector('#loginText');
 const loginLoader = container.querySelector('#loginLoader');
 const loginSubmit = container.querySelector('#loginSubmit');

 loginText.classList.add('d-none');
 loginLoader.classList.remove('d-none');
 loginSubmit.disabled = true;

 showFullScreenLoaderLP('Logging in...');

 try {
  await performLogin(countryCode, mobileNumber, password);
 } catch (error) {
  console.error('Login error:', error);
  showAlertModal('Login failed. Please try again.');
 } finally {
  loginText.classList.remove('d-none');
  loginLoader.classList.add('d-none');
  loginSubmit.disabled = false;
  hideFullScreenLoaderLP();
 }
}

async function handleSendOtp(container) {
 const switchToRegister = container.querySelector('#switchToRegister');
 if (switchToRegister) switchToRegister.disabled = true;
 const switchToLogin = container.querySelector('#switchToLogin');
 if (switchToLogin) switchToLogin.disabled = true;
 const termsLabel = container.querySelector('#lp-termsLabel');
 if (termsLabel) termsLabel.classList.add('d-none');
 const countryCode = container.querySelector('#lp-registerCountryCode').value;
 const mobileNumber = getMobileNumberFromDigitsLP('lp-registerMobileDigitsContainer');
 const requiredLength = getRequiredMobileLengthLP(countryCode);

 const mobileError = container.querySelector('#lp-registerMobileError');
 mobileError.classList.add('d-none');

 const inputs = container.querySelectorAll('#lp-registerMobileDigitsContainer input');
 inputs.forEach(input => input.classList.remove('is-invalid'));

 let allDigitsFilled = true;
 inputs.forEach(input => {
  if (input.value === '') {
   input.classList.add('is-invalid');
   allDigitsFilled = false;
  }
 });

 if (!allDigitsFilled) {
  mobileError.textContent = `Please enter all ${requiredLength} digits`;
  mobileError.classList.remove('d-none');
  return;
 }

 if (mobileNumber.length !== requiredLength) {
  mobileError.textContent = `Please enter a valid ${requiredLength}-digit mobile number`;
  mobileError.classList.remove('d-none');
  return;
 }

 if (!my1lpXtraValidate()) return;

 const sendOtpText = container.querySelector('#lp-sendOtpText');
 const sendOtpLoader = container.querySelector('#lp-sendOtpLoader');
 const sendOtpBtn = container.querySelector('#lp-sendOtpBtn');

 sendOtpText.classList.add('d-none');
 sendOtpLoader.classList.remove('d-none');
 sendOtpBtn.disabled = true;

 try {
  await sendOtpRequest(countryCode, mobileNumber, container);
 } catch (error) {
  console.error('Send OTP error:', error);
  showAlertModal('Failed to send OTP. Please try again.');
  sendOtpText.classList.remove('d-none');
  sendOtpLoader.classList.add('d-none');
  sendOtpBtn.disabled = false;
  hideFullScreenLoaderLP();
 }
}

async function sendOtpRequest(countryCode, mobileNumber, container) {
 try {
  showFullScreenLoaderLP('Sending OTP...');
  const otpSent = await getOTP_LP(countryCode, mobileNumber);
  if (otpSent.success) {
   container.querySelector('#lp-otpSection').classList.remove('d-none');
   container.querySelector('#lp-sendOtpBtn').classList.add('d-none');

   if (otpSent.waitTime) {
    startResendTimerLP(otpSent.waitTime, container);
   }
  }
 } finally {
  const sendOtpText = container.querySelector('#lp-sendOtpText');
  const sendOtpLoader = container.querySelector('#lp-sendOtpLoader');
  const sendOtpBtn = container.querySelector('#lp-sendOtpBtn');

  sendOtpText.classList.remove('d-none');
  sendOtpLoader.classList.add('d-none');
  sendOtpBtn.disabled = false;
  hideFullScreenLoaderLP();
 }
}

async function handleVerifyOtp(container) {
 const otp = getOtpFromInputsLP();

 if (otp.length !== 6) {
  showAlertModal('Please enter a valid 6-digit OTP');
  return;
 }

 const verifyOtpText = container.querySelector('#lp-verifyOtpText');
 const verifyOtpLoader = container.querySelector('#lp-verifyOtpLoader');
 const verifyOtpBtn = container.querySelector('#lp-verifyOtpBtn');

 verifyOtpText.classList.add('d-none');
 verifyOtpLoader.classList.remove('d-none');
 verifyOtpBtn.disabled = true;

 showFullScreenLoaderLP('Verifying OTP...');

 try {
  const countryCode = container.querySelector('#lp-registerCountryCode').value;
  const mobileNumber = getMobileNumberFromDigitsLP('lp-registerMobileDigitsContainer');

  const result = await verifyOTP_LP(countryCode, mobileNumber, otp);
  if (result) {
   container.querySelector('#lp-otpSection').classList.add('d-none');
   container.querySelector('#registrationForm').classList.remove('d-none');
  } else {
   showAlertModal('Invalid OTP. Please try again.');
  }
 } catch (error) {
  console.error('Verify OTP error:', error);
  showAlertModal('Failed to verify OTP. Please try again.');
 } finally {
  verifyOtpText.classList.remove('d-none');
  verifyOtpLoader.classList.add('d-none');
  verifyOtpBtn.disabled = false;
  hideFullScreenLoaderLP();
 }
}

async function handleResendOtp(container) {
 const countryCode = container.querySelector('#lp-registerCountryCode').value;
 const mobileNumber = getMobileNumberFromDigitsLP('lp-registerMobileDigitsContainer');
 const requiredLength = getRequiredMobileLengthLP(countryCode);

 const inputs = container.querySelectorAll('#lp-registerMobileDigitsContainer input');
 inputs.forEach(input => input.classList.remove('is-invalid'));

 let allDigitsFilled = true;
 inputs.forEach(input => {
  if (input.value === '') {
   input.classList.add('is-invalid');
   allDigitsFilled = false;
  }
 });

 if (!allDigitsFilled) {
  showAlertModal('Please enter complete mobile number first');
  return;
 }

 if (mobileNumber.length !== requiredLength) {
  showAlertModal('Please enter a valid mobile number');
  return;
 }

 const resendOtp = container.querySelector('#lp-resendOtp');
 resendOtp.disabled = true;

 showFullScreenLoaderLP('Resending OTP...');

 try {
  await resendOtpRequest(countryCode, mobileNumber, container);
 } catch (error) {
  console.error('Resend OTP error:', error);
  showAlertModal('Please try again.');
  resendOtp.disabled = false;
  hideFullScreenLoaderLP();
 }
}

async function resendOtpRequest(countryCode, mobileNumber, container) {
 try {
  const otpSent = await getOTP_LP(countryCode, mobileNumber);
  if (otpSent.success) {
   showAlertModal('OTP resent successfully', 'success');

   const verifyOtpBtn = container.querySelector('#lp-verifyOtpBtn');
   if (verifyOtpBtn) verifyOtpBtn.classList.remove('d-none');

   if (otpSent.waitTime) {
    startResendTimerLP(otpSent.waitTime, container);
   }
  }
 } finally {
  hideFullScreenLoaderLP();
 }
}

async function handleCompleteRegistration(container) {
 const password = container.querySelector('#regPassword').value;
 const confirmPassword = container.querySelector('#confirmPassword').value;

 if (password.length < 6 || password.length > 8) {
  showAlertModal('Password must be between 6 and 8 characters');
  return;
 }

 if (password !== confirmPassword) {
  showAlertModal('Passwords do not match');
  return;
 }

 const completeRegText = container.querySelector('#completeRegText');
 const completeRegLoader = container.querySelector('#completeRegLoader');
 const completeRegistration = container.querySelector('#completeRegistration');

 completeRegText.classList.add('d-none');
 completeRegLoader.classList.remove('d-none');
 completeRegistration.disabled = true;

 showFullScreenLoaderLP('Completing registration...');

 try {
  const countryCode = container.querySelector('#lp-registerCountryCode').value;
  const mobileNumber = getMobileNumberFromDigitsLP('lp-registerMobileDigitsContainer');
  const localName = container.querySelector('#localName').value.trim();
  const otp = getOtpFromInputsLP();

  await performRegistration(countryCode, mobileNumber, localName, otp, password);
 } catch (error) {
  console.error('Registration error:', error);
  showAlertModal('Registration failed. Please try again.');
 } finally {
  completeRegText.classList.remove('d-none');
  completeRegLoader.classList.add('d-none');
  completeRegistration.disabled = false;
  hideFullScreenLoaderLP();
 }
}

// Mobile digit input functions
function blockAutofillOnDigitsLP(input, index) {
 input.autocomplete = 'off';
 input.name = 'md' + index + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
 input.spellcheck = false;
 input.setAttribute('data-lpignore', 'true');
 input.setAttribute('data-form-type', 'other');
 input.readOnly = true;
 const unlock = function () { input.readOnly = false; };
 input.addEventListener('mousedown', unlock);
 input.addEventListener('touchstart', unlock);
 input.addEventListener('keydown', unlock);
}

function createMobileDigitInputsLP(containerId, requiredLength) {
 const container = document.getElementById(containerId);
 if (!container) return;

 container.innerHTML = '';

 if (containerId === 'lp-mobileDigitsContainer' || containerId === 'lp-registerMobileDigitsContainer') {
  const half = Math.ceil(requiredLength / 2);
  const row1 = document.createElement('div');
  row1.className = 'd-flex gap-1 mb-1';
  const row2 = document.createElement('div');
  row2.className = 'd-flex gap-1';

  for (let i = 0; i < requiredLength; i++) {
   const input = document.createElement('input');
   input.type = 'text';
   input.inputMode = 'numeric';
   input.pattern = '[0-9]*';
   input.className = 'form-control text-center';
   input.style.setProperty("padding", "1px", "important");
   input.style.width = 'clamp(28px, 7.5vw, 40px)';
   input.style.height = 'clamp(32px, 7.5vw, 40px)';
   input.style.borderColor = '#6c757d';
   input.style.fontSize = '16px';
   input.style.color = '#000';
   input.style.backgroundColor = '#fff';
   input.dataset.index = i;
   input.addEventListener('input', handleMobileDigitInputLP);
   input.addEventListener('keydown', handleMobileDigitKeydownLP);
   input.addEventListener('paste', handleMobilePasteLP);
   input.addEventListener('focus', clearMobileDigitErrorLP);
   blockAutofillOnDigitsLP(input, i);
   if (i < half) {
    row1.appendChild(input);
   } else {
    row2.appendChild(input);
   }
  }

  container.appendChild(row1);
  if (row2.children.length > 0) container.appendChild(row2);
 } else {
  for (let i = 0; i < requiredLength; i++) {
   const input = document.createElement('input');
   input.type = 'text';
   input.inputMode = 'numeric';
   input.pattern = '[0-9]*';
   input.className = 'form-control text-center';
   input.style.width = '40px';
   input.style.height = '40px';
   input.style.borderColor = '#6c757d';
   input.style.fontSize = '16px';
   input.style.color = '#000';
   input.style.backgroundColor = '#fff';
   input.dataset.index = i;
   input.addEventListener('input', handleMobileDigitInputLP);
   input.addEventListener('keydown', handleMobileDigitKeydownLP);
   input.addEventListener('paste', handleMobilePasteLP);
   input.addEventListener('focus', clearMobileDigitErrorLP);
   blockAutofillOnDigitsLP(input, i);
   container.appendChild(input);
  }
 }

 setTimeout(() => {
  const firstInput = container.querySelector('input');
  if (firstInput) firstInput.focus();
 }, 200);
}

function createOtpDigitInputsLP() {
 const container = document.getElementById('lp-otpDigitsContainer');
 if (!container) return;

 container.innerHTML = '';

 for (let i = 0; i < 6; i++) {
  const input = document.createElement('input');
  input.type = 'text';
  input.inputMode = 'numeric';
  input.maxLength = 1;
  input.className = 'form-control text-center';
  input.style.width = '40px';
  input.style.height = '40px';
  input.style.borderColor = '#6c757d';
  input.style.fontSize = '16px';
  input.style.color = '#000';
  input.style.backgroundColor = '#fff';
  input.style.textTransform = 'uppercase';
  input.dataset.index = i;
  input.addEventListener('input', handleOtpDigitInputLP);
  input.addEventListener('keydown', handleOtpDigitKeydownLP);
  input.addEventListener('paste', handleOtpPasteLP);
  input.addEventListener('focus', clearOtpDigitErrorLP);
  blockAutofillOnDigitsLP(input, i);
  container.appendChild(input);
 }

 setTimeout(() => {
  const firstInput = container.querySelector('input');
  if (firstInput) firstInput.focus();
 }, 200);
}

// Input handling functions
function handleMobileDigitInputLP(e) {
 const input = e.target;
 const index = parseInt(input.dataset.index);
 let value = input.value;

 value = value.replace(/\D/g, '');

 if (value.length > 1) {
  value = value.charAt(0);
 }

 input.value = value;
 input.classList.remove('is-invalid');

 if (value.length === 1) {
  const container = input.closest('[id$="DigitsContainer"]');
  const inputs = container.querySelectorAll('input');
  if (index < inputs.length - 1) {
   setTimeout(() => {
    inputs[index + 1].focus();
   }, 10);
  }
 }
}

function handleOtpDigitInputLP(e) {
 const input = e.target;
 const index = parseInt(input.dataset.index);
 let value = input.value;

 value = value.replace(/[^a-zA-Z0-9]/g, '');

 if (value.length > 1) {
  value = value.charAt(0);
 }

 value = value.toUpperCase();
 input.value = value;
 input.classList.remove('is-invalid');

 if (value.length === 1) {
  const inputs = document.querySelectorAll('#lp-otpDigitsContainer input');
  if (index < inputs.length - 1) {
   setTimeout(() => {
    inputs[index + 1].focus();
   }, 80);
  }
 }
}

function handleMobileDigitKeydownLP(e) {
 const input = e.target;
 const index = parseInt(input.dataset.index);
 const container = input.closest('[id$="DigitsContainer"]');
 const inputs = container.querySelectorAll('input');

 if (e.key === 'Backspace') {
  if (input.value === '' && index > 0) {
   setTimeout(() => {
    inputs[index - 1].focus();
    inputs[index - 1].value = '';
   }, 10);
  } else if (input.value !== '') {
   input.value = '';
  }
 } else if (e.key === 'ArrowLeft' && index > 0) {
  setTimeout(() => {
   inputs[index - 1].focus();
  }, 10);
 } else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
  setTimeout(() => {
   inputs[index + 1].focus();
  }, 10);
 }
}

function handleOtpDigitKeydownLP(e) {
 const input = e.target;
 const index = parseInt(input.dataset.index);
 const inputs = document.querySelectorAll('#lp-otpDigitsContainer input');

 if (e.key === 'Backspace') {
  if (input.value === '' && index > 0) {
   setTimeout(() => {
    inputs[index - 1].focus();
    inputs[index - 1].value = '';
   }, 80);
  } else if (input.value !== '') {
   input.value = '';
  }
 } else if (e.key === 'ArrowLeft' && index > 0) {
  setTimeout(() => {
   inputs[index - 1].focus();
  }, 80);
 } else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
  setTimeout(() => {
   inputs[index + 1].focus();
  }, 80);
 }
}

function handleMobilePasteLP(e) {
 e.preventDefault();
 const pastedData = e.clipboardData.getData('text');
 const cleanData = pastedData.replace(/\D/g, '');
 const digits = cleanData.split('');

 const container = e.target.closest('[id$="DigitsContainer"]');
 const inputs = container.querySelectorAll('input');

 inputs.forEach(input => {
  input.value = '';
  input.readOnly = false;
 });

 for (let i = 0; i < digits.length && i < inputs.length; i++) {
  inputs[i].value = digits[i];
 }

 const nextEmptyIndex = Array.from(inputs).findIndex(input => input.value === '');
 if (nextEmptyIndex !== -1) {
  setTimeout(() => {
   inputs[nextEmptyIndex].focus();
  }, 10);
 } else {
  setTimeout(() => {
   inputs[inputs.length - 1].focus();
  }, 10);
 }
}

function handleOtpPasteLP(e) {
 e.preventDefault();
 const pastedData = e.clipboardData.getData('text');
 const cleanData = pastedData.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6);
 const characters = cleanData.split('');

 const inputs = document.querySelectorAll('#lp-otpDigitsContainer input');
 inputs.forEach(input => {
  input.value = '';
  input.readOnly = false;
 });

 for (let i = 0; i < characters.length && i < inputs.length; i++) {
  inputs[i].value = characters[i];
 }

 const nextEmptyIndex = Array.from(inputs).findIndex(input => input.value === '');
 if (nextEmptyIndex !== -1) {
  setTimeout(() => {
   inputs[nextEmptyIndex].focus();
  }, 80);
 } else {
  setTimeout(() => {
   inputs[inputs.length - 1].focus();
  }, 80);
 }
}

function clearMobileDigitErrorLP(e) {
 const input = e.target;
 input.classList.remove('is-invalid');
 input.readOnly = false;
 const container = input.closest('[id$="DigitsContainer"]');
 const errorId = container.id === 'lp-mobileDigitsContainer' ? 'lp-mobileError' : 'lp-registerMobileError';
 const errorElement = document.getElementById(errorId);
 if (errorElement) {
  errorElement.classList.add('d-none');
 }
}

function clearOtpDigitErrorLP(e) {
 const input = e.target;
 input.classList.remove('is-invalid');
 input.readOnly = false;
}

function getMobileNumberFromDigitsLP(containerId) {
 const container = document.getElementById(containerId);
 if (!container) return '';
 const inputs = container.querySelectorAll('input');
 return Array.from(inputs).map(input => input.value).join('');
}

function getOtpFromInputsLP() {
 const inputs = document.querySelectorAll('#lp-otpDigitsContainer input');
 return Array.from(inputs).map(input => input.value).join('');
}

// Resend timer functionality
function startResendTimerLP(waitTime, container) {
 const resendOtp = container.querySelector('#lp-resendOtp');
 const resendContainer = container.querySelector('#lp-resendContainer');

 if (!resendContainer || !resendOtp) return;

 if (resendTimer) {
  clearInterval(resendTimer);
 }

 resendTimeLeft = waitTime;

 resendOtp.disabled = true;
 resendOtp.classList.add('d-none');
 resendContainer.classList.remove('d-none');

 updateResendCountdownLP(container);

 resendTimer = setInterval(() => {
  resendTimeLeft--;
  updateResendCountdownLP(container);

  if (resendTimeLeft <= 0) {
   clearInterval(resendTimer);
   resendTimer = null;

   resendContainer.classList.add('d-none');
   resendOtp.classList.remove('d-none');
   resendOtp.disabled = false;
   resendOtp.classList.add('btn-warning');

   const regForm = container.querySelector('#registrationForm');
   const otpSec = container.querySelector('#lp-otpSection');
   if (regForm && !regForm.classList.contains('d-none')) {
    regForm.classList.add('d-none');
   }
   if (otpSec && otpSec.classList.contains('d-none')) {
    otpSec.classList.remove('d-none');
    container.querySelector('#lp-sendOtpBtn').classList.add('d-none');
   }
   const verifyOtpBtn = container.querySelector('#lp-verifyOtpBtn');
   if (verifyOtpBtn) verifyOtpBtn.classList.add('d-none');
   const otpInputs = container.querySelectorAll('#lp-otpDigitsContainer input');
   otpInputs.forEach(input => input.value = '');
  }
 }, 1000);
}

function updateResendCountdownLP(container) {
 const resendCountdown = container.querySelector('#lp-resendCountdown');
 if (resendCountdown) {
  resendCountdown.innerHTML = `Complete Registration in <span class="blink-text cntrsec">${resendTimeLeft}</span> seconds`;
 }
}

// API functions
async function getOTP_LP(countryCode, mobileNumber) {
 const requiredLength = getRequiredMobileLengthLP(countryCode);

 if (mobileNumber.length !== requiredLength) {
  showAlertModal(`Please enter a valid ${requiredLength}-digit mobile number for ${countryCode}`);
  return { success: false };
 }

 const data = { yo: mobileNumber, yc: countryCode };

 // Add suppression flag if OTP is disabled
 if (isOtpSuppressed) {
  data.supress = 1;
 }

 try {
  const response = await fetch('https://my1.in/5z/o.php', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify(data)
  });

  const result = await response.json();

  if (result.su == 1) {
   return {
    success: true,
    waitTime: result.wait || 30,
   };
  } else {
   showAlertModal(result.ms || 'Failed to send OTP');
   return { success: false };
  }
 } catch (error) {
  console.error('Error sending OTP:', error);
  showAlertModal('Failed to send OTP. Please try again.');
  return { success: false };
 }
}

async function verifyOTP_LP(countryCode, mobileNumber, otp) {
 const data = { yo: mobileNumber, yc: countryCode, mp: otp };

 try {
  const response = await fetch('https://my1.in/5z/v.php', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify(data)
  });

  const result = await response.json();

  if (result.su == 1) {
   return result;
  } else {
   showAlertModal(result.ms || 'OTP verification failed');
   return null;
  }
 } catch (error) {
  console.error('Error verifying OTP:', error);
  showAlertModal('Failed to verify OTP. Please try again.');
  return null;
 }
}

async function performRegistration(countryCode, mobileNumber, localName, otp, password) {
 const data = {
  yo: mobileNumber,
  yc: countryCode,
  mu: localName,
  mp: otp,
  pw: password,
  eo: appOwner.eo,
  ec: appOwner.ec
 };

 if (!my1lpXtraValidate()) return;
 var xtraVals = my1lpXtraCollect();
 xtraVals = await my1lpXtraPostProcess(xtraVals, my1lpXtraGet(), data);
 if (xtraVals && Object.keys(xtraVals).length > 0) data.p = xtraVals;

 try {
  const response = await fetch('https://my1.in/5z/s.php', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify(data)
  });

  const result = await response.json();

  if (result.su == 1) {
   showAlertModal("You are registered. Please login with this password.", 'success');
   location.reload();
  } else {
   showAlertModal(result.ms || 'Registration failed');
  }
 } catch (error) {
  console.error('Registration error:', error);
  showAlertModal('Registration failed. Please try again.');
 }
}

async function performLogin(countryCode, mobileNumber, password) {
 if (appOwner != null && appOwner.eo != null && appOwner.ec != null) {
  const data = {
   yc: countryCode,
   yo: mobileNumber,
   pw: password,
   eo: appOwner.eo,
   ec: appOwner.ec,
   xtra: typeof xtraj_payload !== "undefined" ? xtraj_payload : null
  };

  if (data.yo != null && data.yo.length == 10) {
   if (validateMobileNumber(data.yo)) {
    if (data.pw != null && data.pw.length > 5) {
     try {
      const response = await fetch('https://my1.in/5z/g.php', {
       method: 'POST',
       headers: {
        'Content-Type': 'application/json',
       },
       body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.su == 1) {
       if (result.uzr.mk.length > 10) {
        localStorage.setItem(my1uzr.worknOnPg, true);

        const userData = result.uzr;
        userData.fnf = result.fnf;
        userData.fnp = result.fnp;
        localStorage.setItem('my1uzr', JSON.stringify(userData));
        const storedData = JSON.parse(localStorage.getItem("my1uzr")) || {};
        my1uzr = { ...my1uzr, ...storedData };
        // my1uzr = JSON.parse(localStorage.getItem('my1uzr'));
        payload0.mk = result.uzr.mk;

        nameOfLoggedInPage = `${my1uzr.mo}_${my1uzr.mc}_${appOwner.tn}_${payload0.fi}_${payload0.fk}_${appOwner.pg}`;
        localStorage.setItem(nameOfLoggedInPage, 1);

        const tmp741 = `${appOwner.tn}_${payload0.fi}_${payload0.fk}_${my1uzr.mo}_${my1uzr.mc}_${appOwner.pg}`;
        localStorage.setItem(tmp741, true);

        // Release wake lock on successful login
        if (typeof releaseWakeLock === 'function') {
         releaseWakeLock();
        }
        if (my1uzr.mo && my1uzr.mc) {
         const dbnm = "my1_in_" + window.appOwner.tn + "_" + my1uzr.mo.replace(/\./g, "_") + "_" + my1uzr.mc + "_" + payload0.fi + "_" + payload0.fk;
         window.dbnm = dbnm;
         if (typeof dbDexieManager !== 'undefined' && typeof dbDexieManager.handleNwTables === 'function') {
          await dbDexieManager.handleNwTables(null, dbnm, typeof tblsRequired !== 'undefined' ? tblsRequired : ["f", "fp"]);
         }
        }
        if (typeof function2runAfter_P_Login !== 'undefined') {
         function2runAfter_P_Login(result);
        } else {
         if (!result.xtra)
          window.showsuccessmodal("Login successful!", 'success');
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginPasswordModal'));
        if (modal) { modal.hide(); }
        if (result.xtra && result.xtra.fn) {
         const fnName = "hndlRspo" + result.xtra.fn;
         const handler = window[fnName];
         if (typeof handler === 'function') {
          const maybePromise = handler(result.xtra);
          if (maybePromise && typeof maybePromise.then === 'function') {
           await maybePromise;
          }
         } else { console.log("No success to xtra"); }
        }
        setTimeout(async () => {
         if (typeof dbDexieManager !== 'undefined' && typeof dbDexieManager.handleNwTables === 'function') {
          if (result.fnf != null) {
           await dbDexieManager.insertToDexie(
            dbnm,
            "f",
            result.fnf,
            true,
            ["a"]
           );
          }
          if (result.fnp != null) {
           await dbDexieManager.insertToDexie(
            dbnm,
            "fp",
            result.fnp,
            true,
            ["a"]
           );
          }
         }
         const appModuLst = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].moduLst) || window.moduLst;
         if (appModuLst && typeof chkModuLstAgainstFNF === 'function') {
          window.suppressModals = true;
          let allowedModules;
          try {
           allowedModules = await chkModuLstAgainstFNF(appModuLst);
          } finally {
           window.suppressModals = false;
          }
          if (allowedModules && allowedModules.length > 0) {
           const hookName = allowedModules.hook || "onModuLstAllowed";
           const hook = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg][hookName];
           if (typeof hook === 'function') {
            hook(allowedModules);
           } else {
            console.warn(hookName + " hook not defined; allowed modules not shown in menu");
           }
          }
         }
        }, 800);
       } else {
        showAlertModal(result.ms || 'Login failed');
       }
      } else {
       showAlertModal(result.ms || 'Login failed');
      }
     } catch (error) {
      console.error('Login error:', error);
      showAlertModal('Login failed. Please try again.');
     }
    } else {
     showAlertModal("Password must be minimum 6 characters");
    }
   } else {
    showAlertModal("Mobile number is invalid");
   }
  } else {
   showAlertModal("Mobile number must be 10 digits");
  }
 } else {
  showAlertModal("Please open the link of the entity you are working for");
 }
}

// Utility functions
function loadCountryCodesLP(selectId) {
 const countryCodes = [
  { code: '+1', name: 'USA', flag: '🇺🇸', length: 10 },
  { code: '+44', name: 'UK', flag: '🇬🇧', length: 10 },
  { code: '+91', name: 'India', flag: '🇮🇳', length: 10 },
  { code: '+86', name: 'China', flag: '🇨🇳', length: 11 },
  { code: '+81', name: 'Japan', flag: '🇯🇵', length: 10 },
  { code: '+33', name: 'France', flag: '🇫🇷', length: 9 },
  { code: '+49', name: 'Germany', flag: '🇩🇪', length: 10 },
  { code: '+7', name: 'Russia', flag: '🇷🇺', length: 10 },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', length: 11 },
  { code: '+61', name: 'Australia', flag: '🇦🇺', length: 9 },
 ];

 const selectElement = document.getElementById(selectId);
 if (selectElement) {
  selectElement.innerHTML = countryCodes.map(country =>
   `<option value="${country.code}">${country.flag} ${country.code}</option>`
  ).join('');
 }
}

function updateMobileLengthInfoLP(selectId, lengthInfoId) {
 const countryCode = document.getElementById(selectId)?.value;
 const requiredLength = getRequiredMobileLengthLP(countryCode);
 const lengthInfoElement = document.getElementById(lengthInfoId);
 if (lengthInfoElement) {
  lengthInfoElement.textContent = `${requiredLength} digits required`;
 }
}

function getRequiredMobileLengthLP(countryCode) {
 const lengthMap = {
  '+1': 10, '+44': 10, '+91': 10, '+86': 11, '+81': 10,
  '+33': 9, '+49': 10, '+7': 10, '+55': 11, '+61': 9
 };
 return lengthMap[countryCode] || 10;
}

function validateMobileNumber(mobile) {
 return /^\d{10}$/.test(mobile);
}

// Initialize login system
function initLoginSystemLP() {
 const loginButton = document.getElementById('el_sho_login_modal');
 if (loginButton) {
  loginButton.addEventListener('click', function () {
   // if (isLoggedInLP()) {
   //    showLogoutOptionLP();
   // } else {
   open_shoLgnP([]);
   // }
  });
 }
}

document.addEventListener('DOMContentLoaded', function () {
 initLoginSystemLP();
});

function logPout() {
 my1uzr = null;
 localStorage.setItem("my1uzr", null);
 setTimeout(() => {
  location.reload();
 }, 300);
}

// Add custom styles
function addCustomStylesP() {
 const style = document.createElement('style');
 style.textContent = `
   .cntrsec{color : #dc3545; font-size : 200%;}
[id$="DigitsContainer"] input.form-control{border-color:#6c757d!important;font-size:16px!important;color:#000!important;background-color:#fff!important;padding:.375rem 0.25rem!important}[id$="DigitsContainer"] input.form-control:focus{border-color:#495057!important;box-shadow:0 0 0 .2rem rgb(108 117 125 / .25)!important;color:#000!important;background-color:#fff!important}#lp-otpDigitsContainer input.form-control{border-color:#6c757d!important;font-size:16px!important;color:#000!important;background-color:#fff!important;padding:.375rem 0.25rem!important;text-transform:uppercase!important}#lp-otpDigitsContainer input.form-control:focus{border-color:#495057!important;box-shadow:0 0 0 .2rem rgb(108 117 125 / .25)!important;color:#000!important;background-color:#fff!important}[id$="DigitsContainer"] input,#lp-otpDigitsContainer input{-webkit-text-fill-color:#000!important}#lp-resendOtp:disabled{cursor:not-allowed;opacity:.6}#lp-resendOtp.btn-warning{background-color:#ffc107!important;border-color:#ffc107!important;color:#212529!important}.blink-text{animation:blinkAnim 1s step-end infinite}@keyframes blinkAnim{0%,100%{opacity:1}50%{opacity:0}}
`;
 document.head.appendChild(style);
}

function my1loNormColorP(value) {
 if (!value) return null;
 value = value.trim();
 if (!value || value === "transparent" || value === "none" || value === "initial" || value === "inherit") return null;
 if (value.indexOf("var(") !== -1 || value.indexOf("linear-gradient") !== -1 || value.indexOf("url(") !== -1) return null;
 return value;
}

function my1loParseRgbP(value) {
 if (!value) return null;
 value = value.trim();
 let m = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
 if (m) {
  let hex = m[1];
  if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
  return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
 }
 m = value.match(/^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/i);
 if (m) return { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]) };
 m = value.match(/^rgb\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
 if (m) return { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]) };
 return null;
}

function my1loToHexP(rgb) {
 if (!rgb) return null;
 const to2 = function (n) { n = Math.max(0, Math.min(255, Math.round(n))); return ("0" + n.toString(16)).slice(-2); };
 return "#" + to2(rgb.r) + to2(rgb.g) + to2(rgb.b);
}

function my1loShiftP(rgb, amt) {
 if (!rgb) return null;
 const f = function (c) { return c + Math.round(255 * amt); };
 return { r: f(rgb.r), g: f(rgb.g), b: f(rgb.b) };
}

function my1loLuminanceP(rgb) {
 if (!rgb) return 0;
 const f = function (c) { c = c / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
 return 0.2126 * f(rgb.r) + 0.7152 * f(rgb.g) + 0.0722 * f(rgb.b);
}

function my1loTextOnP(rgb) {
 if (!rgb) return "#ffffff";
 return my1loLuminanceP(rgb) > 0.5 ? "#212529" : "#ffffff";
}

function my1loToRgbaP(value, alpha) {
 const rgb = my1loParseRgbP(value);
 if (!rgb) return null;
 return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
}

function my1loBlockPropP(cssText, selector, prop) {
 const re = new RegExp("(?:^|[;{}]\\s*)" + selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\{([^}]*)\\}", "i");
 const m = cssText.match(re);
 if (!m) return null;
 const pm = m[1].match(new RegExp("(?:^|;)\\s*" + prop + "\\s*:\\s*([^;]+)", "i"));
 return pm ? pm[1].trim() : null;
}

function my1loParseCssP(cssText) {
 const rules = [];
 if (!cssText || typeof cssText !== "string") return rules;
 const text = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
 const len = text.length;
 let i = 0;
 while (i < len) {
  const brace = text.indexOf("{", i);
  if (brace === -1) break;
  const selector = text.slice(i, brace).trim();
  let depth = 1;
  let j = brace + 1;
  while (j < len && depth > 0) {
   if (text.charAt(j) === "{") depth++;
   else if (text.charAt(j) === "}") depth--;
   j++;
  }
  const block = text.slice(brace + 1, j - 1);
  if (selector && selector.charAt(0) !== "@") {
   rules.push({ selector: selector, block: block });
  } else if (/^@media/i.test(selector)) {
   const nested = my1loParseCssP(block);
   for (let k = 0; k < nested.length; k++) { rules.push(nested[k]); }
  }
  i = j;
 }
 return rules;
}

function my1loSplitDeclsP(block) {
 const parts = [];
 if (!block) return parts;
 let cur = "", depth = 0;
 for (let i = 0; i < block.length; i++) {
  const ch = block.charAt(i);
  if (ch === "(") depth++;
  else if (ch === ")") depth--;
  if (ch === ";" && depth === 0) { parts.push(cur); cur = ""; }
  else cur += ch;
 }
 if (cur.trim()) parts.push(cur);
 return parts;
}

function my1loHslToRgbP(h, s, l) {
 h = ((h % 360) + 360) % 360;
 s = Math.max(0, Math.min(100, s)) / 100;
 l = Math.max(0, Math.min(100, l)) / 100;
 const f = function (n) {
  const k = (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
 };
 return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
}

function my1loExtractColorsP(value) {
 const out = [];
 if (!value || typeof value !== "string") return out;
 let m;
 const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
 while ((m = hexRe.exec(value)) !== null) {
  let hex = m[1];
  if (hex.length === 3 || hex.length === 4) hex = hex.split("").map(function (c) { return c + c; }).join("");
  if (hex.length === 6 || hex.length === 8) {
   hex = hex.slice(0, 6).toLowerCase();
   const rgb = { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
   out.push({ hex: "#" + hex, rgb: rgb });
  }
 }
 const rgbRe = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,\/]\s*[\d.%]+)?\s*\)/gi;
 while ((m = rgbRe.exec(value)) !== null) {
  const r = Math.round(+m[1]), g = Math.round(+m[2]), b = Math.round(+m[3]);
  if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
   out.push({ hex: my1loToHexP({ r: r, g: g, b: b }), rgb: { r: r, g: g, b: b } });
  }
 }
 const hslRe = /hsla?\(\s*([\d.]+)(?:deg)?\s*[,\s]+([\d.]+)%\s*[,\s]+([\d.]+)%(?:\s*[,\/]\s*[\d.%]+)?\s*\)/gi;
 while ((m = hslRe.exec(value)) !== null) {
  const rgb = my1loHslToRgbP(+m[1], +m[2], +m[3]);
  if (rgb) out.push({ hex: my1loToHexP(rgb), rgb: rgb });
 }
 return out;
}

function my1loCssVarsP(cssText) {
 const vars = {};
 const re = /(--[a-zA-Z0-9_-]+\s*:\s*[^;]+;)/g;
 let m;
 while ((m = re.exec(cssText)) !== null) {
  const idx = m[1].indexOf(":");
  const name = m[1].slice(0, idx).trim();
  const val = m[1].slice(idx + 1).replace(/;$/, "").trim();
  vars[name] = val;
 }
 return vars;
}

function my1loResolveVarP(value, vars, depth) {
 if (!value || typeof value !== "string" || value.indexOf("var(") === -1) return value;
 depth = depth || 0;
 if (depth > 6) return value;
 return value.replace(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,\s*([^)]*))?\)/g, function (m, name, fallback) {
  if (vars[name] !== undefined) return my1loResolveVarP(vars[name], vars, depth + 1);
  if (fallback !== undefined) return fallback.trim();
  return m;
 });
}

function my1loAnalyzeThemeP(cssText) {
 const report = { brand: null, brandHex: null, brandDark: null, onBrand: "#ffffff", glow: null, lightBg: null, ink: null, secondary: null, matches: [] };
 if (!cssText || typeof cssText !== "string") return report;
 const rules = my1loParseCssP(cssText);
 const vars = my1loCssVarsP(cssText);
 const usage = {};
 const addUsage = function (hex, rgb) {
  if (!usage[hex]) usage[hex] = { hex: hex, rgb: rgb, count: 0, textCount: 0, accentText: 0, bgCount: 0, bodyBg: 0, sectionBg: 0, btnBg: 0, selBg: 0, borderCount: 0, borderTop: 0, varSem: 0, sources: [] };
  return usage[hex];
 };
 let firstColorVar = true;
 for (const vname in vars) {
  const resolved = my1loResolveVarP(vars[vname], vars, 0);
  const colors = my1loExtractColorsP(resolved);
  if (!colors.length) continue;
  const nl = vname.toLowerCase();
  let sem = 0;
  if (/(ember|brand|primary|accent|main|theme|cta|color1|c1|b1|saffron|maroon|brick)/.test(nl)) sem += 3;
  if (/(gold|amber|orange|copper)/.test(nl)) sem += 1;
  if (/(bg|background|surface|cream|light|page|paper|card|body|sheet|paper)/.test(nl)) sem += 2;
  if (/(ink|text|muted|dark|charcoal|brown)/.test(nl)) sem += 1;
  if (firstColorVar) { sem += 2; firstColorVar = false; }
  for (const c of colors) {
   const u = addUsage(c.hex, c.rgb);
   u.count += 0.5;
   u.varSem = Math.max(u.varSem, sem);
   u.sources.push("--" + vname);
  }
 }
 for (let r = 0; r < rules.length; r++) {
  const rule = rules[r];
  const decls = my1loSplitDeclsP(rule.block);
  const selL = rule.selector.toLowerCase();
  const isBody = /(^|\s)(body|html)([\s,:>{]|$)/.test(selL);
  const isBtn = /(^|[\s.#>])ht?-?btn|\.btn|button/i.test(selL);
  const isAccentText = /price|total|amt|active|back|bill-title|ribbon|kicker|\.pr|cta|emphas|selected/i.test(selL);
  const isSection = /card|section|modal|surface|summary|room|bill|sheet|page|container|hero|filter|panel|wrap|box|listing/i.test(selL);
  const isSelection = /selection/i.test(selL);
  for (let d = 0; d < decls.length; d++) {
   const item = decls[d];
   const ci = item.indexOf(":");
   if (ci === -1) continue;
   const prop = item.slice(0, ci).trim().toLowerCase();
   const value = my1loResolveVarP(item.slice(ci + 1).trim(), vars, 0);
   const colors = my1loExtractColorsP(value);
   if (!colors.length) continue;
   const isBorder = prop.indexOf("border") === 0;
   const isBg = prop.indexOf("background") === 0;
   const isText = prop === "color";
   for (const c of colors) {
    const u = addUsage(c.hex, c.rgb);
    u.count++;
    if (isText) { u.textCount++; if (isAccentText) u.accentText++; }
    if (isBg) { u.bgCount++; if (isBody) u.bodyBg++; if (isSection) u.sectionBg++; if (isBtn) u.btnBg++; if (isSelection) u.selBg++; }
    if (isBorder) { u.borderCount++; if (prop === "border-top" || prop === "border-top-color") u.borderTop++; }
    u.sources.push(rule.selector + " " + prop);
   }
  }
 }
 const hexes = Object.keys(usage);
 let lightBest = null, lightScore = -1, brandBest = null, brandScore = -1, inkBest = null, inkScore = -1;
 for (const hex of hexes) {
  const u = usage[hex];
  const lum = my1loLuminanceP(u.rgb);
  const sat = (Math.max(u.rgb.r, u.rgb.g, u.rgb.b) - Math.min(u.rgb.r, u.rgb.g, u.rgb.b)) / 255;
  if (lum > 0.72 && sat < 0.4) {
   let s = u.count + u.bodyBg * 8 + u.sectionBg * 1.5 + u.bgCount * 0.5;
   if (u.varSem >= 2) s += 2;
   if (hex === "#ffffff") s -= 5;
   if (s > lightScore) { lightScore = s; lightBest = hex; }
  }
  if (lum < 0.42 && sat < 0.3 && u.textCount > 0) {
   let s = u.textCount * 2 + u.count * 0.5;
   if (u.varSem) s += 1;
   if (s > inkScore) { inkScore = s; inkBest = hex; }
  }
  if (sat >= 0.18 && lum > 0.05 && lum < 0.95) {
   let s = u.count * 0.5 + u.textCount * 0.3 + u.accentText * 4 + u.btnBg * 3 + u.borderTop * 1.5 + u.selBg * 1 + (u.varSem >= 3 ? 20 : u.varSem >= 2 ? 1 : 0);
   if (s > brandScore) { brandScore = s; brandBest = hex; }
   else if (s === brandScore && brandBest && lum < my1loLuminanceP(usage[brandBest].rgb)) { brandBest = hex; }
  }
 }
 let secondScore = -1, secondHex = null;
 for (const hex of hexes) {
  if (hex === brandBest) continue;
  const u = usage[hex];
  const lum = my1loLuminanceP(u.rgb);
  const sat = (Math.max(u.rgb.r, u.rgb.g, u.rgb.b) - Math.min(u.rgb.r, u.rgb.g, u.rgb.b)) / 255;
  if (sat >= 0.18 && lum > 0.05 && lum < 0.95) {
   let s = u.count * 0.5 + u.accentText * 3 + u.btnBg * 3 + (u.varSem ? u.varSem : 0);
   if (s > secondScore) { secondScore = s; secondHex = hex; }
  }
 }
 report.brand = brandBest;
 report.lightBg = lightBest;
 report.ink = inkBest;
 report.secondary = secondHex;
 if (brandBest) {
  const rgb = usage[brandBest].rgb;
  report.brandHex = brandBest;
  report.brandDark = my1loToHexP(my1loShiftP(rgb, -0.14));
  report.onBrand = my1loTextOnP(rgb);
  report.glow = my1loToRgbaP(brandBest, 0.25);
 }
 const matches = [];
 if (brandBest) matches.push({ role: "brand", hex: brandBest, score: Math.round(brandScore * 100) / 100, sources: usage[brandBest].sources.slice(0, 12) });
 if (secondHex) matches.push({ role: "secondary", hex: secondHex, score: Math.round(secondScore * 100) / 100, sources: usage[secondHex].sources.slice(0, 8) });
 if (lightBest) matches.push({ role: "lightBg", hex: lightBest, score: Math.round(lightScore * 100) / 100, sources: usage[lightBest].sources.slice(0, 8) });
 if (inkBest) matches.push({ role: "ink", hex: inkBest, score: Math.round(inkScore * 100) / 100, sources: usage[inkBest].sources.slice(0, 8) });
 const accentCands = [];
 for (const hex of hexes) {
  const u = usage[hex];
  const lum = my1loLuminanceP(u.rgb);
  const sat = (Math.max(u.rgb.r, u.rgb.g, u.rgb.b) - Math.min(u.rgb.r, u.rgb.g, u.rgb.b)) / 255;
  if (sat >= 0.18 && lum > 0.05 && lum < 0.95) {
   let s = u.count * 0.5 + u.accentText * 3 + u.btnBg * 3 + (u.varSem >= 3 ? 3 : u.varSem >= 2 ? 1 : 0);
   accentCands.push({ hex: hex, score: s, count: u.count });
  }
 }
 accentCands.sort(function (a, b) { return b.score - a.score; });
 matches.push({ role: "accentCandidates", list: accentCands.slice(0, 6).map(function (c) { return { hex: c.hex, score: Math.round(c.score * 100) / 100, count: c.count }; }) });
 report.matches = matches;
 return report;
}

function generateLognThemeP(cssText) {
 if (!cssText || typeof cssText !== 'string') return "";
 let report = null;
 try {
  report = my1loAnalyzeThemeP(cssText);
  if (typeof window !== "undefined") { window.my1loThemeReport = report; }
 } catch (e) {
  console.log("[my1lo.theme] analysis error:", e);
 }
 if (report && report.brand) {
  console.log("[my1lo.theme]", report.matches);
 } else {
  console.log("[my1lo.theme] no brand color detected");
 }
 if (!report || !report.brand) return "";
 const brand = report.brand;
 const brandHex = report.brandHex || brand;
 const brandDark = report.brandDark || brand;
 const onBrand = report.onBrand || "#ffffff";
 const lightBg = report.lightBg || "#ffffff";
 const glow = report.glow || my1loToRgbaP(brand, 0.25);
 let css = "";
 css += ".modal .card-header { background-color: " + brandHex + " !important; border-color: " + brandHex + " !important; }\n";
 css += ".modal .card-header .card-title { color: " + onBrand + " !important; }\n";
 css += ".modal .card-header .btn-close { filter: " + (onBrand === "#ffffff" ? "invert(1)" : "none") + "; }\n";
 css += ".modal .card-body { background-color: " + lightBg + " !important; }\n";
 css += "#loginSubmit, #lp-sendOtpBtn, #lp-verifyOtpBtn, #completeRegistration { background-color: " + brandHex + " !important; border-color: " + brandHex + " !important; color: " + onBrand + " !important; }\n";
 css += "#loginSubmit:hover, #loginSubmit:focus, #lp-sendOtpBtn:hover, #lp-sendOtpBtn:focus, #lp-verifyOtpBtn:hover, #lp-verifyOtpBtn:focus, #completeRegistration:hover, #completeRegistration:focus { background-color: " + brandDark + " !important; border-color: " + brandDark + " !important; color: " + onBrand + " !important; }\n";
 css += "#loginSubmit:disabled, #lp-sendOtpBtn:disabled, #lp-verifyOtpBtn:disabled, #completeRegistration:disabled { background-color: " + brandHex + " !important; border-color: " + brandHex + " !important; opacity: 0.55; }\n";
 css += "#switchToRegister { border-color: " + brandHex + " !important; color: " + brandHex + " !important; }\n";
 css += "#switchToRegister:hover { background-color: " + brandHex + " !important; color: " + onBrand + " !important; }\n";
 css += "#lp-resendOtp { border-color: " + brandHex + " !important; color: " + brandHex + " !important; }\n";
 css += "#lp-resendOtp:hover { background-color: " + brandHex + " !important; color: " + onBrand + " !important; }\n";
 css += ".modal .text-primary, .modal a.text-primary { color: " + brandHex + " !important; }\n";
 css += "#forgotPassword { color: " + brandHex + " !important; }\n";
 css += "#forgotPassword:hover { color: " + brandDark + " !important; }\n";
css += "#lp-mobileDigitsContainer input.form-control, #lp-registerMobileDigitsContainer input.form-control, #lp-otpDigitsContainer input.form-control, #lp-loginCountryCode.form-select, #lp-registerCountryCode.form-select, #loginPassword.form-control, #regPassword.form-control, #confirmPassword.form-control, #localName.form-control { border-color: #495057 !important; }\n";
  if (glow) {
   css += "#lp-mobileDigitsContainer input.form-control:focus, #lp-registerMobileDigitsContainer input.form-control:focus, #lp-otpDigitsContainer input.form-control:focus, #lp-loginCountryCode.form-select:focus, #lp-registerCountryCode.form-select:focus, #loginPassword.form-control:focus, #regPassword.form-control:focus, #confirmPassword.form-control:focus, #localName.form-control:focus { border-color: #495057 !important; box-shadow: 0 0 0 0.2rem " + glow + " !important; }\n";
  } else {
   css += "#lp-mobileDigitsContainer input.form-control:focus, #lp-registerMobileDigitsContainer input.form-control:focus, #lp-otpDigitsContainer input.form-control:focus, #lp-loginCountryCode.form-select:focus, #lp-registerCountryCode.form-select:focus, #loginPassword.form-control:focus, #regPassword.form-control:focus, #confirmPassword.form-control:focus, #localName.form-control:focus { border-color: #495057 !important; }\n";
 }
 return css;
}

function injectMy1lpTheme(css) {
 if (!css) return;
 let styleEl = document.getElementById("my1lp_project_style");
 if (!styleEl) {
  styleEl = document.createElement("style");
  styleEl.id = "my1lp_project_style";
  document.head.appendChild(styleEl);
 }
 styleEl.textContent = css;
}

// Initialize custom styles
addCustomStylesP();