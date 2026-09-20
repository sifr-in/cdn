//let audToPlayOnGetOTP = url; to play audio on clicking "get otp"

// Global variables
if (typeof nameOfLoggedInPage === "undefined") { var nameOfLoggedInPage = ""; }
if (typeof originalBodyStyles === "undefined") { var originalBodyStyles = ""; }
let id_of_dv_shoLgnO_to_set_processed_dom_object;
let switch_shoLgnO_create_nw_modal;
let swtch_0nothing_1flex_2block_shoLgnO;
if (typeof swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === "undefined") { var swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn = 0; }

if (typeof isOtpSuppressed === "undefined") { var isOtpSuppressed = false; }
if (typeof resendTimer === "undefined") { var resendTimer = null; }
if (typeof resendTimeLeft === "undefined") { var resendTimeLeft = 0; }

// WebOTP API variables
let webOtpAbortController = null;
let webOtpTimeoutId = null;
let isWebOtpListening = false;

// Full screen loader element
if (typeof fullScreenLoader === "undefined") { var fullScreenLoader = null; }

// Audio for OTP sent notification
let otpSentAudio = null;
let isAudioPreloaded = false;

// Only preload audio if audToPlayOnGetOTP is pre-declared
if (typeof audToPlayOnGetOTP !== 'undefined') {
 preloadOtpAudio();
} else {
 console.log("audToPlayOnGetOTP not declared, skipping audio preload");
}

async function preloadOtpAudio() {
 // Double-check that audToPlayOnGetOTP is declared
 if (typeof audToPlayOnGetOTP === 'undefined') {
  console.log("audToPlayOnGetOTP not declared, skipping audio preload");
  return;
 }

 try {
  console.log("Preloading OTP audio...");
  await loadExecFn("getDriveFileAsBlob,getMultipleDriveFilesAsBlobs", null, [], "loader", "https://cdn.jsdelivr.net/gh/sifr-in/cdn@6a35a4e/cmn/drPrx.js", []);
  const audioResults = await window.getMultipleDriveFilesAsBlobs([audToPlayOnGetOTP], "https://my1.in/2/drPrx.php", true);

  if (audioResults.success.length > 0) {
   const audioData = audioResults.success[0];
   const blobUrl = URL.createObjectURL(audioData.blob);
   otpSentAudio = new Audio(blobUrl);
   otpSentAudio.addEventListener("canplaythrough", () => {
    console.log("OTP audio preloaded and ready");
    isAudioPreloaded = true;
   });
   otpSentAudio.addEventListener("error", (e) => {
    console.error("Audio loading error:", e);
    isAudioPreloaded = false;
    URL.revokeObjectURL(blobUrl);
   });
  } else {
   throw new Error("Failed to load audio file");
  }
 } catch (error) {
  console.log("Audio preload failed:", error);
  isAudioPreloaded = false;
 }
}

// WebOTP API Implementation
function isWebOtpSupported() {
 return "OTPCredential" in window;
}

function startWebOtpListener() {
 if (!isWebOtpSupported()) {
  console.log("WebOTP API not supported in this browser");
  showManualVerificationMessage();
  return;
 }

 const input = document.querySelector('input[autocomplete="one-time-code"]');
 if (!input) {
  console.log("No OTP input field found with proper attributes");
  return;
 }

 stopWebOtpListener();
 webOtpAbortController = new AbortController();
 const form = input.closest("form");

 if (form) {
  const submitHandler = (e) => {
   console.log("Form submitted, stopping WebOTP listener");
   stopWebOtpListener();
  };
  form.addEventListener("submit", submitHandler, { once: true });
 }

 const waitTime = 120000;
 webOtpTimeoutId = setTimeout(() => {
  console.log(`WebOTP request timed out after ${waitTime / 1000} seconds`);
  removeVerificationMessages();
  stopWebOtpListener();
  showManualVerificationMessage();
 }, waitTime);

 console.log("Starting fresh WebOTP listener...");
 isWebOtpListening = true;

 navigator.credentials.get({ otp: { transport: ["sms"] }, signal: webOtpAbortController.signal }).then((otp) => {
  console.log("OTP received via WebOTP:", otp.code);
  clearTimeout(webOtpTimeoutId);
  webOtpTimeoutId = null;
  isWebOtpListening = false;
  autoFillAndVerifyOtp(otp.code);
 }).catch((err) => {
  console.log("WebOTP error:", err);
  clearTimeout(webOtpTimeoutId);
  webOtpTimeoutId = null;
  isWebOtpListening = false;
  hideFullScreenLoaderLO();
  if (err.name !== "AbortError") {
   console.log("WebOTP failed, showing manual verification message");
   removeVerificationMessages();
   showManualVerificationMessage();
   setTimeout(() => {
    if (document.getElementById("lo-otpSection") && !document.getElementById("lo-otpSection").classList.contains("d-none")) {
     console.log("Restarting WebOTP listener for next SMS");
     startWebOtpListener();
    }
   }, 1000);
  }
 });
}

function stopWebOtpListener() {
 if (webOtpAbortController) {
  console.log("Stopping WebOTP listener");
  webOtpAbortController.abort();
  webOtpAbortController = null;
 }
 if (webOtpTimeoutId) {
  clearTimeout(webOtpTimeoutId);
  webOtpTimeoutId = null;
 }
 isWebOtpListening = false;
}

// Show audio error message above Get OTP button
function showAudioErrorMessage() {
 const getOtpBtn = document.getElementById("lo-getOtpBtn");
 if (!getOtpBtn) return;
 let errorMsg = document.getElementById("audioErrorMsg");
 if (!errorMsg) {
  errorMsg = document.createElement("div");
  errorMsg.id = "audioErrorMsg";
  errorMsg.className = "alert alert-warning text-center mb-2";
  errorMsg.innerHTML = "<i class=\"fas fa-exclamation-triangle me-2\"></i>press 'yes', when chrome shows you.";
  getOtpBtn.parentNode.insertBefore(errorMsg, getOtpBtn);
 }
}

// Remove audio error message
function removeAudioErrorMessage() {
 const errorMsg = document.getElementById("audioErrorMsg");
 if (errorMsg && errorMsg.parentNode) {
  errorMsg.parentNode.removeChild(errorMsg);
 }
}

async function playOtpSentSound() {
 if (typeof audToPlayOnGetOTP === 'undefined') {
  console.log("audToPlayOnGetOTP not declared, skipping audio");
  return;
 }

 try {
  if (isAudioPreloaded && otpSentAudio) {
   otpSentAudio.currentTime = 0;
   await otpSentAudio.play();
   removeAudioErrorMessage();
   return;
  } else {
   console.log("Preloaded audio not available, loading on-demand...");
   const audioResults = await getMultipleDriveFilesAsBlobs([audToPlayOnGetOTP], "https://my1.in/2/drPrx.php", true);
   if (audioResults.success.length > 0) {
    const audioData = audioResults.success[0];
    const blobUrl = URL.createObjectURL(audioData.blob);
    const tempAudio = new Audio(blobUrl);
    tempAudio.currentTime = 0;
    const cleanup = () => {
     URL.revokeObjectURL(blobUrl);
     tempAudio.removeEventListener("ended", cleanup);
     tempAudio.removeEventListener("error", cleanup);
    };
    tempAudio.addEventListener("ended", cleanup);
    tempAudio.addEventListener("error", cleanup);
    await tempAudio.play();
    removeAudioErrorMessage();
   } else {
    throw new Error("Failed to load audio file");
   }
  }
 } catch (error) {
  console.log("Audio play failed:", error);
  showAudioErrorMessage();
 }
}

// Show full screen loader
function showFullScreenLoaderLO() {
 fullScreenLoader = createDynamicLoader("Processing...");
}

// Hide full screen loader
function hideFullScreenLoaderLO() {
 if (fullScreenLoader && typeof fullScreenLoader.removeLoader === 'function') {
  fullScreenLoader.removeLoader();
  fullScreenLoader = null;
 }
}

// Check if user is logged in
function isLoggedInLO() {
 return typeof my1uzr !== "undefined" && my1uzr != null && my1uzr.mk != null;
}

function showUserInfoModal() {
 if (!my1uzr) return;
 const modalResult = create_modal_dynamically("user_info_modal");
 const modalContent = modalResult.contentElement;
 modalContent.innerHTML = `
    <div class="modal-header">
      <h5 class="modal-title">
        <span id="userInfoTitle" style="cursor: pointer;">User</span> Information
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="text-center mb-4">
        <div class="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
          ${my1uzr.ml ? `<img src="${my1uzr.ml}" alt="Profile Picture" class="rounded-circle w-100 h-100" style="object-fit: cover;">` : `<i class="fas fa-user text-white" style="font-size: 2rem;"></i>`}
        </div>
        <h6 class="mb-1">${my1uzr.mn || "No Name"}</h6>
        ${my1uzr.mu ? `<p class="text-muted small mb-2">${my1uzr.mu}</p>` : ''}
      </div>
      <div class="border-top pt-3">
        <div class="row mb-2">
          <div class="col-4 text-muted">Mobile Number</div>
          <div class="col-8">${my1uzr.mo || "Not available"}</div>
        </div>
        <div class="row mb-2">
          <div class="col-4 text-muted">Constraint</div>
          <div class="col-8">${my1uzr.mc || "Not available"}</div>
        </div>
        <div class="row mb-2">
          <div class="col-4 text-muted">Relation ID</div>
          <div class="col-8">${my1uzr.mr || "Not available"}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
  `;
 const userTitle = modalContent.querySelector('#userInfoTitle');
 if (userTitle) {
  userTitle.addEventListener('click', function () {
   if (confirm("Do you want to log out?")) {
    my1uzr = null;
    localStorage.setItem('my1uzr', null);
    modalResult.modalInstance.hide();
    setTimeout(() => { location.reload(); }, 300);
   }
  });
 }
 modalResult.modalInstance.show();
}

// Show logout option modal
function showLogoutOptionLO() {
 const modalResult = create_modal_dynamically("logout_modal");
 const modalContent = modalResult.contentElement;
 modalContent.innerHTML = `
    <div class="modal-header">
      <h5 class="modal-title">Logout</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      Are you sure you want to logout?
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      ${(appData && appData.normalLogotNotAlod && appData.normalLogotNotAlod === 1) ? '' : '<button type="button" class="btn btn-danger" id="confirmLogoutBtn">Logout</button>'}
    </div>
  `;
 const confirmBtn = modalContent.querySelector('#confirmLogoutBtn');
 if (confirmBtn) {
  confirmBtn.addEventListener('click', () => {
   my1uzr = null;
   localStorage.setItem("my1uzr", null);
   modalResult.modalInstance.hide();
   setTimeout(() => { location.reload(); }, 300);
  });
 }
 modalResult.modalInstance.show();
}

// Save original body styles
function saveBodyStylesLO() {
 originalBodyStyles = { overflow: document.body.style.overflow, position: document.body.style.position, width: document.body.style.width };
}

// Restore body styles
function restoreL3BodyStylesLO() {
 document.body.style.overflow = originalBodyStyles.overflow || "";
 document.body.style.position = originalBodyStyles.position || "";
 document.body.style.width = originalBodyStyles.width || "";
}

// Function to show mobile confirmation modal
function showMobileConfirmationModalLO(countryCode, mobileNumber, callback) {
 const modalResult = create_modal_dynamically("mobile_confirmation_modal");
 const modalContent = modalResult.contentElement;
 modalContent.innerHTML = `
    <div class="modal-header">
      <h5 class="modal-title">Confirm Mobile Number</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <p class="text-center mb-4">Please confirm your mobile number: ${countryCode} ${mobileNumber}</p>
      <button type="button" class="btn btn-primary w-100 mb-2" id="confirmMobileBtn">Yes, this is correct</button>
      <button type="button" class="btn btn-outline-secondary w-100" id="editMobileBtn">No, let me edit</button>
    </div>
    <div class="modal-footer"></div>
  `;
 const confirmBtn = modalContent.querySelector('#confirmMobileBtn');
 const editBtn = modalContent.querySelector('#editMobileBtn');
const handleClose = (result) => {
   modalResult.modalInstance.hide();
   callback(result);
  };
  confirmBtn.addEventListener('click', () => handleClose(true));
  editBtn.addEventListener('click', () => handleClose(false));
  modalResult.modalElement.addEventListener('hidden.bs.modal', () => {
   callback(false);
  });
  modalResult.modalInstance.show();
}

function autoFillAndVerifyOtp(otp) {
 console.log("Auto-filling OTP:", otp);
 const inputs = document.querySelectorAll("#lo-otpDigitsContainer input");
 const otpDigits = otp.split("");
 for (let i = 0; i < Math.min(inputs.length, otpDigits.length); i++) {
  inputs[i].value = otpDigits[i];
 }
 showAutoVerificationInProgress();
 showFullScreenLoaderLO();
 setTimeout(async () => {
  try {
   await verifyOTP_LO(otp);
  } catch (error) {
   console.error("Auto-verification failed:", error);
   hideFullScreenLoaderLO();
  }
 }, 1000);
}

function showAutoVerificationInProgress() {
 const otpSection = document.getElementById("lo-otpSection");
 if (!otpSection) return;
 let progressMsg = document.getElementById("autoVerifyProgress");
 if (!progressMsg) {
  progressMsg = document.createElement("div");
  progressMsg.id = "autoVerifyProgress";
  progressMsg.className = "alert alert-info text-center mt-2";
  progressMsg.innerHTML = '<i class="fas fa-sync fa-spin me-2"></i>Auto-verifying OTP...';
  otpSection.appendChild(progressMsg);
 }
}

function showManualVerificationMessage() {
 const otpSection = document.getElementById("lo-otpSection");
 if (!otpSection) return;
 let manualMsg = document.getElementById("manualVerifyMsg");
 if (!manualMsg) {
  manualMsg = document.createElement("div");
  manualMsg.id = "manualVerifyMsg";
  manualMsg.className = "alert alert-warning text-center mt-2";
  manualMsg.innerHTML = '<i class="fas fa-info-circle me-2"></i>Please verify OTP manually';
  otpSection.appendChild(manualMsg);
 }
}

function removeVerificationMessages() {
 const progressMsg = document.getElementById("autoVerifyProgress");
 const manualMsg = document.getElementById("manualVerifyMsg");
 if (progressMsg && progressMsg.parentNode) { progressMsg.parentNode.removeChild(progressMsg); }
 if (manualMsg && manualMsg.parentNode) { manualMsg.parentNode.removeChild(manualMsg); }
}

function showAlertModalLO(message, type = 'error') {
 const modalResult = create_modal_dynamically('alertModal_' + Date.now());
 const dialog = modalResult.modalElement.querySelector('.modal-dialog');
 if (dialog) dialog.style.marginTop = '80px';
 const icon = type === 'success' ? 'fa-check-circle text-success' : 'fa-exclamation-circle text-danger';
 const title = type === 'success' ? 'Success' : 'No Success';
 const titleColor = type === 'success' ? 'text-success' : 'text-danger';
 modalResult.contentElement.innerHTML = `
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
 modalResult.modalInstance.show();
}

// Add validation function
function validateGetOtpForm() {
 //const loginName = document.getElementById("loginName");
 const mobileNumber = getMobileNumberFromDigitsLO();
 const countryCode = document.getElementById("lo-loginCountryCode");
 const getOtpBtn = document.getElementById("lo-getOtpBtn");
 if (!countryCode || !getOtpBtn) return;
 const requiredLength = getRequiredMobileLengthLO(countryCode.value);
 //const isNameValid = loginName.value.trim().length >= 2;
 const isMobileValid = mobileNumber.length === requiredLength;
 getOtpBtn.disabled = !(isMobileValid);
}

function setupL3EventListeners() {
 //const loginName = document.getElementById("loginName");
 //const localName = document.getElementById("localName");
 const countryCodeSelect = document.getElementById("lo-loginCountryCode");
 const acceptTerms = document.getElementById("lo-acceptTerms");
 const getOtpBtn = document.getElementById("lo-getOtpBtn");
 const verifyOtpBtn = document.getElementById("lo-verifyOtpBtn");
 const resendOtp = document.getElementById("lo-resendOtp");
 //const expandLocalName = document.getElementById("expandLocalName");
 //const localNameSection = document.getElementById("localNameSection");

 /*
 if (expandLocalName) {
     expandLocalName.addEventListener("click", function () {
         if (localNameSection.classList.contains("d-none")) {
             localNameSection.classList.remove("d-none");
             this.classList.remove("fa-expand-alt");
             this.classList.add("fa-compress-alt");
             this.title = "Hide local language name";
         } else {
             localNameSection.classList.add("d-none");
             this.classList.remove("fa-compress-alt");
             this.classList.add("fa-expand-alt");
             this.title = "Add name in local language";
         }
     });
 }

 if (loginName) {
     loginName.addEventListener("input", validateGetOtpForm);
     loginName.addEventListener("blur", function () {
         const errorElement = document.getElementById("nameError");
         if (errorElement) {
             if (this.value.length >= 2) {
                 errorElement.classList.add("d-none");
                 this.classList.remove("is-invalid");
             } else {
                 errorElement.classList.remove("d-none");
                 this.classList.add("is-invalid");
             }
         }
     });
 }

 if (localName) {
     localName.addEventListener("blur", function () {
         const errorElement = document.getElementById("localNameError");
         if (errorElement) {
             const hasEnglishChars = /[A-Za-z0-9]/.test(this.value);
             if (!hasEnglishChars && this.value.trim() !== "") {
                 errorElement.classList.add("d-none");
                 this.classList.remove("is-invalid");
             } else if (hasEnglishChars) {
                 errorElement.textContent = "Local name must not contain English letters or numbers";
                 errorElement.classList.remove("d-none");
                 this.classList.add("is-invalid");
             } else {
                 errorElement.classList.add("d-none");
                 this.classList.remove("is-invalid");
             }
         }
     });
 }
 */

 if (countryCodeSelect) {
  countryCodeSelect.addEventListener("change", function () { updateMobileLengthInfoLO("lo-loginCountryCode", "lo-mobileLengthInfo"); });
 }

 if (acceptTerms) {
  acceptTerms.addEventListener("change", validateGetOtpForm);
 }

 const mobileInputs = document.querySelectorAll("#lo-mobileDigitsContainer input");
 mobileInputs.forEach(input => {
  input.addEventListener("input", validateGetOtpForm);
  input.addEventListener("paste", () => { setTimeout(validateGetOtpForm, 200); });
 });

 if (getOtpBtn) { getOtpBtn.disabled = true; }

 if (getOtpBtn) {
  getOtpBtn.addEventListener("click", async function () {
   const termsLabel = document.querySelector('label[for="lo-acceptTerms"]');
   if (termsLabel) termsLabel.classList.add("d-none");
   //const name = loginName.value.trim();
   const mobile = getMobileNumberFromDigitsLO();
   const countryCode = countryCodeSelect.value;
   const requiredLength = getRequiredMobileLengthLO(countryCode);
   const mobileError = document.getElementById("lo-mobileError");
   mobileError.classList.add("d-none");
   const inputs = document.querySelectorAll("#lo-mobileDigitsContainer input");
   inputs.forEach((input) => input.classList.remove("is-invalid"));

   //if (name.length < 2) { document.getElementById("nameError").classList.remove("d-none"); loginName.classList.add("is-invalid"); return; }
   //if (!localNameSection.classList.contains("d-none") && localName.value.trim() !== "") {
   //    const hasEnglishChars = /[A-Za-z0-9]/.test(localName.value);
   //    if (hasEnglishChars) { alert("Local name must not contain English letters or numbers"); document.getElementById("localNameError").classList.remove("d-none"); localName.classList.add("is-invalid"); return; }
   //}

   let allDigitsFilled = true;
   inputs.forEach((input) => { if (input.value === "") { input.classList.add("is-invalid"); allDigitsFilled = false; } });
   if (!allDigitsFilled) { mobileError.textContent = `Please enter all ${requiredLength} digits`; mobileError.classList.remove("d-none"); return; }
   if (mobile.length !== requiredLength) { mobileError.textContent = `Please enter a valid ${requiredLength}-digit mobile number`; mobileError.classList.remove("d-none"); return; }
   if (!my1loXtraValidate()) return;
   await playOtpSentSound();

   await sendOTPRequest(countryCode, mobile);
  });
 }

 async function sendOTPRequest(countryCode, mobile) {
  const getOtpText = document.getElementById("lo-getOtpText");
  const getOtpLoader = document.getElementById("lo-getOtpLoader");
  const getOtpBtn = document.getElementById("lo-getOtpBtn");
  getOtpText.classList.add("d-none");
  getOtpLoader.classList.remove("d-none");
  getOtpBtn.disabled = true;
  showFullScreenLoaderLO();

  try {
   const otpSent = await getOTP_LO(countryCode, mobile);
   if (otpSent.success) {
    document.getElementById("lo-otpSection").classList.remove("d-none");
    getOtpBtn.classList.add("d-none");
    if (isWebOtpSupported()) { console.log("Starting fresh WebOTP listener for SMS auto-detection"); startWebOtpListener(); }
    else { console.log("WebOTP not supported - manual entry required"); showManualVerificationMessage(); }
    const verifyOtpBtn = document.getElementById("lo-verifyOtpBtn");
    if (verifyOtpBtn) { verifyOtpBtn.classList.remove("d-none"); }
    if (otpSent.waitTime) { startResendTimerLO(otpSent.waitTime); }
   }
  } catch (error) {
   console.error("Error sending OTP:", error);
   showAlertModalLO("Failed to send OTP. Please try again.");
  } finally {
   getOtpText.classList.remove("d-none");
   getOtpLoader.classList.add("d-none");
   getOtpBtn.disabled = false;
   hideFullScreenLoaderLO();
  }
 }

 function startResendTimerLO(waitTime) {
  const resendOtp = document.getElementById("lo-resendOtp");
  const resendContainer = document.getElementById("lo-resendContainer");
  const verifyOtpBtn = document.getElementById("lo-verifyOtpBtn");
  if (!resendContainer || !resendOtp) return;
  if (resendTimer) { clearInterval(resendTimer); }
  resendTimeLeft = waitTime;
  resendOtp.disabled = true;
  resendOtp.classList.add("d-none");
  resendContainer.classList.remove("d-none");
  if (verifyOtpBtn) { verifyOtpBtn.classList.remove("d-none"); }
  updateResendCountdownLO();
  resendTimer = setInterval(() => {
   resendTimeLeft--;
   updateResendCountdownLO();
   if (resendTimeLeft <= 0) {
    clearInterval(resendTimer);
    resendTimer = null;
    resendContainer.classList.add("d-none");
    const resendOtpText = document.getElementById("lo-resendOtpText");
    const resendOtpLoader = document.getElementById("lo-resendOtpLoader");
    if (resendOtpText) resendOtpText.classList.remove("d-none");
    if (resendOtpLoader) resendOtpLoader.classList.add("d-none");
    resendOtp.classList.remove("d-none");
    resendOtp.disabled = false;
    resendOtp.classList.add("btn-warning");
    if (verifyOtpBtn) { verifyOtpBtn.classList.add("d-none"); }
    removeVerificationMessages();
   }
  }, 1000);
 }

 function updateResendCountdownLO() {
  const resendCountdown = document.getElementById("lo-resendCountdown");
  if (resendCountdown) { resendCountdown.innerHTML = `Verify OTP in <span class="blink-text cntrsec">${resendTimeLeft}</span> seconds`; }
 }

 if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener("click", async function () {
   const otp = getOtpFromInputsLO();
   if (otp.length !== 6) { showAlertModalLO("Please enter a valid 6-character OTP"); return; }
   removeVerificationMessages();
   stopWebOtpListener();
   const verifyOtpText = document.getElementById("lo-verifyOtpText");
   const verifyOtpLoader = document.getElementById("lo-verifyOtpLoader");
   verifyOtpText.classList.add("d-none");
   verifyOtpLoader.classList.remove("d-none");
   verifyOtpBtn.disabled = true;
   showFullScreenLoaderLO();
   try {
    await verifyOTP_LO(otp);
   } catch (error) {
    console.error("Error verifying OTP:", error);
    showAlertModalLO("Failed to verify OTP. Please try again.");
   } finally {
    verifyOtpText.classList.remove("d-none");
    verifyOtpLoader.classList.add("d-none");
    verifyOtpBtn.disabled = false;
    hideFullScreenLoaderLO();
   }
  });
 }

 if (resendOtp) {
  resendOtp.addEventListener("click", async function () {
   const mobile = getMobileNumberFromDigitsLO();
   const countryCode = document.getElementById("lo-loginCountryCode").value;
   const requiredLength = getRequiredMobileLengthLO(countryCode);
   const inputs = document.querySelectorAll("#lo-mobileDigitsContainer input");
   inputs.forEach((input) => input.classList.remove("is-invalid"));
   let allDigitsFilled = true;
   inputs.forEach((input) => { if (input.value === "") { input.classList.add("is-invalid"); allDigitsFilled = false; } });
   if (!allDigitsFilled) { showAlertModalLO("Please enter complete mobile number first"); return; }
   if (mobile.length !== requiredLength) { showAlertModalLO("Please enter a valid mobile number"); return; }
   await playOtpSentSound();
   showMobileConfirmationModalLO(countryCode, mobile, async (isConfirmed) => { if (isConfirmed) { await resendOTPRequest(countryCode, mobile); } });
  });
 }

 async function resendOTPRequest(countryCode, mobile) {
  const resendOtp = document.getElementById("lo-resendOtp");
  const resendOtpText = document.getElementById("lo-resendOtpText");
  const resendOtpLoader = document.getElementById("lo-resendOtpLoader");
  resendOtp.disabled = true;
  resendOtp.classList.remove("btn-warning");
  if (resendOtpText) resendOtpText.classList.add("d-none");
  if (resendOtpLoader) resendOtpLoader.classList.remove("d-none");
  showFullScreenLoaderLO();
  try {
   const otpSent = await getOTP_LO(countryCode, mobile);
   if (otpSent.success) {
    showAlertModalLO("OTP resent successfully", "success");
    if (isWebOtpSupported()) { console.log("Restarting fresh WebOTP listener for resent SMS"); startWebOtpListener(); }
    const verifyOtpBtn = document.getElementById("lo-verifyOtpBtn");
    if (verifyOtpBtn) { verifyOtpBtn.classList.remove("d-none"); }
    if (otpSent.waitTime) { startResendTimerLO(otpSent.waitTime); }
   }
  } catch (error) {
   console.error("Error resending OTP:", error);
   showAlertModalLO("Please try again.");
   resendOtp.disabled = false;
   resendOtp.classList.add("btn-warning");
   if (resendOtpText) resendOtpText.classList.remove("d-none");
   if (resendOtpLoader) resendOtpLoader.classList.add("d-none");
  } finally {
   hideFullScreenLoaderLO();
  }
 }
}

// Load country codes into select element
function loadCountryCodesLO(selectId) {
 const countryCodes = [
  { code: "+1", name: "USA", flag: "🇺🇸", length: 10 },
  { code: "+44", name: "UK", flag: "🇬🇧", length: 10 },
  { code: "+91", name: "India", flag: "🇮🇳", length: 10 },
  { code: "+86", name: "China", flag: "🇨🇳", length: 11 },
  { code: "+81", name: "Japan", flag: "🇯🇵", length: 10 },
  { code: "+33", name: "France", flag: "🇫🇷", length: 9 },
  { code: "+49", name: "Germany", flag: "🇩🇪", length: 10 },
  { code: "+7", name: "Russia", flag: "🇷🇺", length: 10 },
  { code: "+55", name: "Brazil", flag: "🇧🇷", length: 11 },
  { code: "+61", name: "Australia", flag: "🇦🇺", length: 9 }
 ];
 const selectElement = document.getElementById(selectId);
 selectElement.innerHTML = countryCodes.map((country) => `<option value="${country.code}">${country.flag} ${country.code}</option>`).join("");
}

function updateMobileLengthInfoLO(selectId, lengthInfoId) {
 const countryCode = document.getElementById(selectId).value;
 const requiredLength = getRequiredMobileLengthLO(countryCode);
 document.getElementById(lengthInfoId).textContent = `${requiredLength} digits required`;
 createMobileDigitInputsLO(requiredLength);
}

// Get required mobile length based on country code
function getRequiredMobileLengthLO(countryCode) {
 const lengthMap = { "+1": 10, "+44": 10, "+91": 10, "+86": 11, "+81": 10, "+33": 9, "+49": 10, "+7": 10, "+55": 11, "+61": 9 };
 return lengthMap[countryCode] || 10;
}

// Send OTP to the provided mobile number
async function getOTP_LO(countryCode, mobileNumber) {
 const requiredLength = getRequiredMobileLengthLO(countryCode);
 if (mobileNumber.length !== requiredLength) { showAlertModalLO(`Please enter a valid ${requiredLength}-digit mobile number for ${countryCode}`); return { success: false }; }
 const data = { yo: mobileNumber, yc: countryCode };
 if (isOtpSuppressed) { data.supress = 1; }
 try {
  const response = await fetch("https://my1.in/5z/o.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const result = await response.json();
  if (result.su == 1) { return { success: true, waitTime: result.wait || 30 }; }
  else { showAlertModalLO(JSON.stringify(result)); return { success: false }; }
 } catch (error) {
  console.error("Error sending OTP:", error);
  showAlertModalLO("Failed to send OTP. Please try again.");
  return { success: false };
 }
}

// Verify the OTP entered by the user
async function verifyOTP_LO(otp) {
 const countryCode = document.getElementById("lo-loginCountryCode").value;
 const mobileNumber = getMobileNumberFromDigitsLO();
 const requiredLength = getRequiredMobileLengthLO(countryCode);
 if (mobileNumber.length !== requiredLength) { showAlertModalLO(`Please enter a valid ${requiredLength}-digit mobile number`); return; }
 const l_oginName = document.getElementById("loginName") ? document.getElementById("loginName").value.trim() : "";
 const l_oginLocalName = document.getElementById("localName") ? document.getElementById("localName").value.trim() : "";
 // const data = {yo: mobileNumber,yc: countryCode,mp: otp,mn: l_oginName,mu: l_oginLocalName,eo: appOwner.eo,ec: appOwner.ec,xtra: typeof xtraj_payload !== "undefined" ? xtraj_payload : null};
 const data = { yo: mobileNumber, yc: countryCode, mp: otp, mn: l_oginName, mu: l_oginLocalName, eo: appOwner.eo, ec: appOwner.ec, xtra: typeof xtraj_payload !== "undefined" ? xtraj_payload : null };
 if (!my1loXtraValidate()) return;
 var xtraVals = my1loXtraCollect();
 xtraVals = await my1loXtraPreProcess(xtraVals, my1loXtraGet(), data);
 xtraVals = await my1loXtraPostProcess(xtraVals, my1loXtraGet(), data);
 if (xtraVals && Object.keys(xtraVals).length > 0) data.p = xtraVals;
 try {
  const response = await fetch("https://my1.in/5z/k2.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const result = await response.json();
  const verifyOtpText = document.getElementById("lo-verifyOtpText");
  const verifyOtpLoader = document.getElementById("lo-verifyOtpLoader");
  const verifyOtpBtn = document.getElementById("lo-verifyOtpBtn");
  if (verifyOtpText) verifyOtpText.classList.remove("d-none");
  if (verifyOtpLoader) verifyOtpLoader.classList.add("d-none");
  if (verifyOtpBtn) verifyOtpBtn.disabled = false;
  hideFullScreenLoaderLO();
  removeVerificationMessages();
  if (result && result.su == 1 && result.uzr.mk.length > 10) {
   localStorage.setItem(my1uzr.worknOnPg, true);
   const userData = result.uzr;
   userData.fnf = result.fnf;
   userData.fnp = result.fnp;
   localStorage.setItem("my1uzr", JSON.stringify(userData));
   const storedData = JSON.parse(localStorage.getItem("my1uzr")) || {};
   my1uzr = { ...my1uzr, ...storedData };
   // my1uzr = JSON.parse(localStorage.getItem("my1uzr"));
   payload0.mk = result.uzr.mk;
   nameOfLoggedInPage = `${my1uzr.mo}_${my1uzr.mc}_${appOwner.tn}_${payload0.fi}_${payload0.fk}_${appOwner.pg}`;
   localStorage.setItem(nameOfLoggedInPage, 1);
   const tmp741 = `${appOwner.tn}_${payload0.fi}_${payload0.fk}_${my1uzr.mo}_${my1uzr.mc}_${appOwner.pg}`;
   localStorage.setItem(tmp741, true);

   if (my1uzr.mo && my1uzr.mc) {
    const dbnm = "my1_in_" + window.appOwner.tn + "_" + my1uzr.mo.replace(/\./g, "_") + "_" + my1uzr.mc + "_" + payload0.fi + "_" + payload0.fk;
    window.dbnm = dbnm;
    if (typeof dbDexieManager !== 'undefined' && typeof dbDexieManager.handleNwTables === 'function') {
     await dbDexieManager.handleNwTables(null, dbnm, typeof tblsRequired !== 'undefined' ? tblsRequired : ["f", "fp"]);
    }
   }
   if (typeof releaseWakeLock === 'function') { releaseWakeLock(); }
   if (typeof function2runAfter_O_Login !== "undefined") { function2runAfter_O_Login(result); }
   else {
    if (!result.xtra)
     window.showsuccessmodal("Login successful: " + result.ms);
   }
   const modal = bootstrap.Modal.getInstance(document.getElementById(id_of_dv_shoLgnO_to_set_processed_dom_object));
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
   window.showelsemodal("Verification failed. Please try again;");
  }
 } catch (error) {
  console.error("Error verifying OTP:", error);
  removeVerificationMessages();
  window.showelsemodal("Failed to verify OTP. Please try again.");
 }
}

// Generate HTML for the login modal
function set_innerHTML_of_shoLgnO() {
 return `
        <div class="container p-0">
            <div class="card">
                <div class="card-header text-center d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Login with <span id="lo-otpTextToggle" style="cursor: pointer; padding: 2px 5px; border-radius: 3px; transition: all 0.3s;">OTP</span></h5>
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-sm lo-pw-login" onclick="openLoginWithPassFromLoginWith()" title="Login with Password">🔑 Password</button>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="card-body" style="background-color: #33FFCC;">
                    <!--
                    <div class="mb-3">
                        <label for="loginName" class="form-label">
                            Name in English 
                            <i class="fas fa-expand-alt ms-1 text-muted" id="expandLocalName" style="cursor: pointer; font-size: 0.8rem;" title="Add name in local language"></i>
                        </label>
                        <input type="text" id="loginName" class="form-control" placeholder="Enter your name (min 2 chars)">
                        <div id="nameError" class="invalid-feedback d-none">Name must be at least 2 characters</div>
                    </div>
                    <div class="mb-3 d-none" id="localNameSection">
                        <label for="localName" class="form-label">Name in Local Language</label>
                        <input type="text" id="localName" class="form-control" placeholder="Name in local language (non-English characters only)">
                        <div id="localNameError" class="invalid-feedback d-none">Name must be in local language characters only, no English letters or numbers</div>
                    </div>
                    -->
                    <div class="mb-3">
                        <div class="input-group flex-nowrap">
                            <select id="lo-loginCountryCode" class="form-select" style="max-width: 120px; width: auto; flex-shrink: 0;"></select>
                            <div id="lo-mobileDigitsContainer" class="d-flex gap-1 ms-2 flex-row flex-wrap"></div>
                        </div>
                        <div id="lo-mobileLengthInfo" class="form-text ms-2"></div>
                        <div id="lo-mobileError" class="invalid-feedback d-none">Please enter a valid mobile number</div>
                    </div>
                    <div id="my1loXtraFields"></div>
                    <label class="form-check-label mb-4" for="lo-acceptTerms" style="cursor: pointer;">You agree with the 'Terms & Conditions' when you click on "Get OTP"</label>
                    <input type="checkbox" class="d-none" id="lo-acceptTerms">
                    <button id="lo-getOtpBtn" class="btn btn-primary w-100 position-relative" disabled>
                        <span id="lo-getOtpText">Get OTP</span>
                        <span id="lo-getOtpLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
                    </button>
                    <div id="lo-otpSection" class="d-none mt-3">
                        <div class="mb-3">
                            <label class="form-label">
                                Enter or Copy/Paste OTP (6 chars)
                                <small class="text-muted d-block" id="webOtpStatus">We'll try to auto-detect from SMS</small>
                            </label>
                            <div id="lo-otpDigitsContainer" class="d-flex gap-1 justify-content-center"></div>
                        </div>
                        <div class="text-center mt-2">
                            <div id="lo-resendContainer" class="d-none ml-3">
                                <strong><span id="lo-resendCountdown" class="text-primary fw-bold"></span></strong>
                            </div>
                            <button id="lo-resendOtp" class="btn btn-outline-secondary btn-sm position-relative">
                                <span id="lo-resendOtpText">Resend OTP</span>
                                <span id="lo-resendOtpLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
                            </button>
                        </div>
                        <button id="lo-verifyOtpBtn" class="btn btn-primary w-100 position-relative">
                            <span id="lo-verifyOtpText">Verify OTP</span>
                            <span id="lo-verifyOtpLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function openLoginWithPassFromLoginWith() {
    const modal = bootstrap.Modal.getInstance(document.getElementById(id_of_dv_shoLgnO_to_set_processed_dom_object));
    if (modal) modal.hide();
    const t932 = getCacheId("my1lp.js");
    if (t932)
        await loadExe2Fn(t932, ['dv_to_set_open_my1ctr_processed', 0, 1, 2], [1]);
}

function setupOtpTextToggleLO() {
 const otpTextToggle = document.getElementById("lo-otpTextToggle");
 if (otpTextToggle) {
  updateOtpTextAppearanceLO();
  otpTextToggle.addEventListener("click", function () {
   if (isOtpSuppressed) {
    if (confirm("Do you want to enable OTP?")) { isOtpSuppressed = false; updateOtpTextAppearanceLO(); }
   } else {
    if (confirm("Do you want to disable OTP?")) { isOtpSuppressed = true; updateOtpTextAppearanceLO(); }
   }
  });
 }
}

function updateOtpTextAppearanceLO() {
 const otpTextToggle = document.getElementById("lo-otpTextToggle");
 if (otpTextToggle) {
  if (isOtpSuppressed) { otpTextToggle.textContent = "sending OTP disabled"; otpTextToggle.style.backgroundColor = "red"; otpTextToggle.style.color = "white"; }
  else { otpTextToggle.textContent = "OTP"; otpTextToggle.style.backgroundColor = ""; otpTextToggle.style.color = ""; }
 }
}

function blockAutofillOnDigitsLO(input, index) {
 input.autocomplete = "off";
 input.name = "md" + index + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
 input.spellcheck = false;
 input.setAttribute("data-lpignore", "true");
 input.setAttribute("data-form-type", "other");
 input.readOnly = true;
 const unlock = function () { input.readOnly = false; };
 input.addEventListener("mousedown", unlock);
 input.addEventListener("touchstart", unlock);
 input.addEventListener("keydown", unlock);
}

function createMobileDigitInputsLO(requiredLength) {
 const container = document.getElementById("lo-mobileDigitsContainer");
 if (!container) return;
 container.innerHTML = "";
 const half = Math.ceil(requiredLength / 2);
 const row1 = document.createElement('div');
 row1.className = 'd-flex gap-1 mb-1';
 const row2 = document.createElement('div');
 row2.className = 'd-flex gap-1';
 for (let i = 0; i < requiredLength; i++) {
  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "numeric";
  input.pattern = "[0-9]*";
  input.className = "form-control text-center";
  input.style.setProperty("padding", "1px", "important");
  input.style.width = "clamp(28px, 7.5vw, 40px)";
  input.style.height = "clamp(32px, 7.5vw, 40px)";
  input.style.borderColor = "#6c757d";
  input.style.fontSize = "16px";
  input.style.color = "#000";
  input.style.backgroundColor = "#fff";
  input.dataset.index = i;
  input.addEventListener("input", handleMobileDigitInputLO);
  input.addEventListener("keydown", handleMobileDigitKeydownLO);
  input.addEventListener("paste", handleMobilePasteLO);
  input.addEventListener("focus", function (e) { clearMobileDigitErrorLO(e); this.select(); });
  blockAutofillOnDigitsLO(input, i);
  if (i < half) { row1.appendChild(input); } else { row2.appendChild(input); }
 }
 container.appendChild(row1);
 if (row2.children.length > 0) container.appendChild(row2);
 setTimeout(() => { const firstInput = container.querySelector("input"); if (firstInput) firstInput.focus(); }, 200);
}

// Create OTP digit inputs (6 alphanumeric characters)
function createOtpDigitInputsLO() {
 const container = document.getElementById("lo-otpDigitsContainer");
 container.innerHTML = "";
 for (let i = 0; i < 6; i++) {
  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "numeric";
  input.maxLength = 1;
  input.className = "form-control text-center";
  input.style.width = "40px";
  input.style.height = "40px";
  input.style.borderColor = "#6c757d";
  input.style.fontSize = "16px";
  input.style.color = "#000";
  input.style.backgroundColor = "#fff";
  input.style.textTransform = "uppercase";
  if (i === 0) { input.setAttribute("autocomplete", "one-time-code"); }
  input.dataset.index = i;
  input.addEventListener("input", handleOtpDigitInputLO);
  input.addEventListener("keydown", handleOtpDigitKeydownLO);
  input.addEventListener("paste", handleOtpPasteLO);
  input.addEventListener("focus", function (e) { clearOtpDigitErrorLO(e); this.select(); });
  blockAutofillOnDigitsLO(input, i);
  container.appendChild(input);
 }
 setTimeout(() => { const firstInput = container.querySelector("input"); if (firstInput) firstInput.focus(); }, 200);
}

function addCustomStyles() {
 const style = document.createElement("style");
 style.textContent = `#lo-mobileDigitsContainer input.form-control {border-color: #6c757d !important;font-size: 16px !important;color: #000 !important;background-color: #fff !important;padding: 0.375rem 0.25rem !important;}#lo-mobileDigitsContainer input.form-control:focus {border-color: #495057 !important;box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25) !important;color: #000 !important;background-color: #fff !important;}#lo-otpDigitsContainer input.form-control {border-color: #6c757d !important;font-size: 16px !important;color: #000 !important;background-color: #fff !important;padding: 0.375rem 0.25rem !important;text-transform: uppercase !important;}#lo-otpDigitsContainer input.form-control:focus {border-color: #495057 !important;box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25) !important;color: #000 !important;background-color: #fff !important;}#lo-mobileDigitsContainer input,#lo-otpDigitsContainer input {-webkit-text-fill-color: #000 !important;}#fullScreenLoader {background-color: rgba(255, 255, 255, 0.9) !important;z-index: 10000 !important;}#autoVerifyProgress, #manualVerifyMsg {font-size: 0.875rem;padding: 0.5rem;margin-bottom: 0.5rem;}#lo-resendOtp:disabled {cursor: not-allowed;opacity: 0.6;}#lo-resendOtp.btn-warning {background-color: #ffc107 !important;border-color: #ffc107 !important;color: #212529 !important;}#audioErrorMsg {font-size: 0.875rem;padding: 0.5rem;margin-bottom: 0.5rem;}.lo-pw-login {color: #6c757d;border-color: #6c757d;background: transparent;}#lo-getOtpBtn:disabled {opacity: 0.6;cursor: not-allowed;}.blink-text {animation: blinkAnim 1s step-end infinite;} @keyframes blinkAnim {0%,100%{opacity:1}50%{opacity:0}}body.modal-open{overflow:visible!important;padding-right:0!important}`;
 document.head.appendChild(style);
}

function my1loNormColor(value) {
 if (!value) return null;
 value = value.trim();
 if (!value || value === "transparent" || value === "none" || value === "initial" || value === "inherit") return null;
 if (value.indexOf("var(") !== -1 || value.indexOf("linear-gradient") !== -1 || value.indexOf("url(") !== -1) return null;
 return value;
}

function my1loParseRgb(value) {
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

function my1loToHex(rgb) {
 if (!rgb) return null;
 const to2 = function (n) { n = Math.max(0, Math.min(255, Math.round(n))); return ("0" + n.toString(16)).slice(-2); };
 return "#" + to2(rgb.r) + to2(rgb.g) + to2(rgb.b);
}

function my1loShift(rgb, amt) {
 if (!rgb) return null;
 const f = function (c) { return c + Math.round(255 * amt); };
 return { r: f(rgb.r), g: f(rgb.g), b: f(rgb.b) };
}

function my1loLuminance(rgb) {
 if (!rgb) return 0;
 const f = function (c) { c = c / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
 return 0.2126 * f(rgb.r) + 0.7152 * f(rgb.g) + 0.0722 * f(rgb.b);
}

function my1loTextOn(rgb) {
 if (!rgb) return "#ffffff";
 return my1loLuminance(rgb) > 0.5 ? "#212529" : "#ffffff";
}

function my1loToRgba(value, alpha) {
 const rgb = my1loParseRgb(value);
 if (!rgb) return null;
 return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
}

function my1loBlockProp(cssText, selector, prop) {
 const re = new RegExp("(?:^|[;{}]\\s*)" + selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\{([^}]*)\\}", "i");
 const m = cssText.match(re);
 if (!m) return null;
 const pm = m[1].match(new RegExp("(?:^|;)\\s*" + prop + "\\s*:\\s*([^;]+)", "i"));
 return pm ? pm[1].trim() : null;
}

function my1loParseCss(cssText) {
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
   const nested = my1loParseCss(block);
   for (let k = 0; k < nested.length; k++) { rules.push(nested[k]); }
  }
  i = j;
 }
 return rules;
}

function my1loSplitDecls(block) {
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

function my1loHslToRgb(h, s, l) {
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

function my1loExtractColors(value) {
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
   out.push({ hex: my1loToHex({ r: r, g: g, b: b }), rgb: { r: r, g: g, b: b } });
  }
 }
 const hslRe = /hsla?\(\s*([\d.]+)(?:deg)?\s*[,\s]+([\d.]+)%\s*[,\s]+([\d.]+)%(?:\s*[,\/]\s*[\d.%]+)?\s*\)/gi;
 while ((m = hslRe.exec(value)) !== null) {
  const rgb = my1loHslToRgb(+m[1], +m[2], +m[3]);
  if (rgb) out.push({ hex: my1loToHex(rgb), rgb: rgb });
 }
 return out;
}

function my1loCssVars(cssText) {
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

function my1loResolveVar(value, vars, depth) {
 if (!value || typeof value !== "string" || value.indexOf("var(") === -1) return value;
 depth = depth || 0;
 if (depth > 6) return value;
 return value.replace(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,\s*([^)]*))?\)/g, function (m, name, fallback) {
  if (vars[name] !== undefined) return my1loResolveVar(vars[name], vars, depth + 1);
  if (fallback !== undefined) return fallback.trim();
  return m;
 });
}

function my1loAnalyzeTheme(cssText) {
 const report = { brand: null, brandHex: null, brandDark: null, onBrand: "#ffffff", glow: null, lightBg: null, ink: null, secondary: null, matches: [] };
 if (!cssText || typeof cssText !== "string") return report;
 const rules = my1loParseCss(cssText);
 const vars = my1loCssVars(cssText);
 const usage = {};
 const addUsage = function (hex, rgb) {
  if (!usage[hex]) usage[hex] = { hex: hex, rgb: rgb, count: 0, textCount: 0, accentText: 0, bgCount: 0, bodyBg: 0, sectionBg: 0, btnBg: 0, selBg: 0, borderCount: 0, borderTop: 0, varSem: 0, sources: [] };
  return usage[hex];
 };
 let firstColorVar = true;
 for (const vname in vars) {
  const resolved = my1loResolveVar(vars[vname], vars, 0);
  const colors = my1loExtractColors(resolved);
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
  const decls = my1loSplitDecls(rule.block);
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
   const value = my1loResolveVar(item.slice(ci + 1).trim(), vars, 0);
   const colors = my1loExtractColors(value);
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
  const lum = my1loLuminance(u.rgb);
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
   let s = u.count * 0.5 + u.textCount * 0.3 + u.accentText * 4 + u.btnBg * 3 + u.borderTop * 1.5 + u.selBg * 1 + (u.varSem >= 3 ? 5 : u.varSem >= 2 ? 1 : 0);
   if (s > brandScore) { brandScore = s; brandBest = hex; }
   else if (s === brandScore && brandBest && lum < my1loLuminance(usage[brandBest].rgb)) { brandBest = hex; }
  }
 }
 let secondScore = -1, secondHex = null;
 for (const hex of hexes) {
  if (hex === brandBest) continue;
  const u = usage[hex];
  const lum = my1loLuminance(u.rgb);
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
  report.brandDark = my1loToHex(my1loShift(rgb, -0.14));
  report.onBrand = my1loTextOn(rgb);
  report.glow = my1loToRgba(brandBest, 0.25);
 }
 const matches = [];
 if (brandBest) matches.push({ role: "brand", hex: brandBest, score: Math.round(brandScore * 100) / 100, sources: usage[brandBest].sources.slice(0, 12) });
 if (secondHex) matches.push({ role: "secondary", hex: secondHex, score: Math.round(secondScore * 100) / 100, sources: usage[secondHex].sources.slice(0, 8) });
 if (lightBest) matches.push({ role: "lightBg", hex: lightBest, score: Math.round(lightScore * 100) / 100, sources: usage[lightBest].sources.slice(0, 8) });
 if (inkBest) matches.push({ role: "ink", hex: inkBest, score: Math.round(inkScore * 100) / 100, sources: usage[inkBest].sources.slice(0, 8) });
 const accentCands = [];
 for (const hex of hexes) {
  const u = usage[hex];
  const lum = my1loLuminance(u.rgb);
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

function generateLognTheme(cssText) {
 if (!cssText || typeof cssText !== 'string') return "";
 let report = null;
 try {
  report = my1loAnalyzeTheme(cssText);
  if (typeof window !== "undefined") { window.my1loThemeReport = report; }
 } catch (e) {
  console.log("[my1lo.theme] analysis error:", e);
 }
 if (report && report.brand) {
  //console.log("[my1lo.theme]", report.matches);
 } else {
  console.log("[my1lo.theme] no brand color detected");
 }
 if (!report || !report.brand) return "";
 const brand = report.brand;
 const brandHex = report.brandHex || brand;
 const brandDark = report.brandDark || brand;
 const onBrand = report.onBrand || "#ffffff";
 const lightBg = report.lightBg || "#ffffff";
 const glow = report.glow || my1loToRgba(brand, 0.25);
 let css = "";
 css += ".modal .card-header { background-color: " + brandHex + " !important; border-color: " + brandHex + " !important; }\n";
 css += ".modal .card-header .card-title { color: " + onBrand + " !important; }\n";
 css += ".modal .card-header .btn-close { filter: " + (onBrand === "#ffffff" ? "invert(1)" : "none") + "; }\n";
 css += ".modal .card-header .lo-pw-login { color: " + onBrand + " !important; border-color: " + onBrand + " !important; background-color: transparent !important; }\n";
 css += ".modal .card-header .lo-pw-login:hover { background-color: " + brandDark + " !important; color: " + onBrand + " !important; }\n";
 css += ".modal .card-body { background-color: " + lightBg + " !important; }\n";
 css += "#lo-getOtpBtn, #lo-verifyOtpBtn { background-color: " + brandHex + " !important; border-color: " + brandHex + " !important; color: " + onBrand + " !important; }\n";
 css += "#lo-getOtpBtn:hover, #lo-getOtpBtn:focus, #lo-verifyOtpBtn:hover, #lo-verifyOtpBtn:focus { background-color: " + brandDark + " !important; border-color: " + brandDark + " !important; color: " + onBrand + " !important; }\n";
 css += "#lo-getOtpBtn:disabled { background-color: " + brandHex + " !important; border-color: " + brandHex + " !important; opacity: 0.55; }\n";
 css += "#lo-resendOtp { border-color: " + brandHex + " !important; color: " + brandHex + " !important; }\n";
 css += "#lo-resendOtp:hover { background-color: " + brandHex + " !important; color: " + onBrand + " !important; }\n";
 css += ".modal .text-primary, .modal a.text-primary { color: " + brandHex + " !important; }\n";
 css += "#lo-mobileDigitsContainer input.form-control, #lo-otpDigitsContainer input.form-control, #lo-loginCountryCode.form-select, #loginName.form-control, #localName.form-control { border-color: #495057 !important; }\n";
 if (glow) {
  css += "#lo-mobileDigitsContainer input.form-control:focus, #lo-otpDigitsContainer input.form-control:focus, #lo-loginCountryCode.form-select:focus, #loginName.form-control:focus, #localName.form-control:focus { border-color: #495057 !important; box-shadow: 0 0 0 0.2rem " + glow + " !important; }\n";
 } else {
  css += "#lo-mobileDigitsContainer input.form-control:focus, #lo-otpDigitsContainer input.form-control:focus, #lo-loginCountryCode.form-select:focus, #loginName.form-control:focus, #localName.form-control:focus { border-color: #495057 !important; }\n";
 }
 return css;
}

function injectMy1loTheme(css) {
 if (!css) return;
 let styleEl = document.getElementById("my1lo_project_style");
 if (!styleEl) {
  styleEl = document.createElement("style");
  styleEl.id = "my1lo_project_style";
  document.head.appendChild(styleEl);
 }
 styleEl.textContent = css;
}

function clearMobileDigitErrorLO(e) {
 const input = e.target;
 input.classList.remove("is-invalid");
 input.readOnly = false;
 const container = input.closest('[id$="DigitsContainer"]');
 const errorId = container && container.id === 'lo-mobileDigitsContainer' ? 'lo-mobileError' : 'lo-mobileError';
 const mobileError = document.getElementById(errorId);
 if (mobileError) { mobileError.classList.add("d-none"); }
}

function clearOtpDigitErrorLO(e) {
 const input = e.target;
 input.classList.remove("is-invalid");
 input.readOnly = false;
}

function handleMobileDigitInputLO(e) {
 const input = e.target;
 const index = parseInt(input.dataset.index);
 let value = input.value;
 value = value.replace(/\D/g, "");
 if (value.length > 1) { value = value.charAt(0); }
 input.value = value;
 input.classList.remove("is-invalid");
 if (value.length === 1) {
  const container = input.closest('[id$="DigitsContainer"]');
  const inputs = container ? container.querySelectorAll('input') : [];
  if (index < inputs.length - 1) { setTimeout(() => { inputs[index + 1].focus(); }, 10); }
 }
}

function handleOtpDigitInputLO(e) {
 const input = e.target;
 const index = parseInt(input.dataset.index);
 let value = input.value;
 value = value.replace(/[^a-zA-Z0-9]/g, "");
 if (value.length > 1) { value = value.charAt(0); }
 value = value.toUpperCase();
 input.value = value;
 input.classList.remove("is-invalid");
 if (value.length === 1) {
  const inputs = document.querySelectorAll("#lo-otpDigitsContainer input");
  if (index < inputs.length - 1) { inputs[index + 1].focus(); }
 }
}

function handleMobileDigitKeydownLO(e) {
 const input = e.target;
 const index = parseInt(input.dataset.index);
 const container = input.closest('[id$="DigitsContainer"]');
 const inputs = container ? container.querySelectorAll('input') : [];
 if (e.key === "Backspace") {
  if (input.value === "" && index > 0) { setTimeout(() => { inputs[index - 1].focus(); inputs[index - 1].value = ""; }, 10); }
  else if (input.value !== "") { input.value = ""; }
 } else if (e.key === "ArrowLeft" && index > 0) { setTimeout(() => { inputs[index - 1].focus(); }, 10); }
 else if (e.key === "ArrowRight" && index < inputs.length - 1) { setTimeout(() => { inputs[index + 1].focus(); }, 10); }
}

function handleOtpDigitKeydownLO(e) {
 const input = e.target;
 const index = parseInt(input.dataset.index);
 const inputs = document.querySelectorAll("#lo-otpDigitsContainer input");
 if (e.key === "Backspace") {
  if (input.value === "" && index > 0) { setTimeout(() => { inputs[index - 1].focus(); inputs[index - 1].value = ""; }, 80); }
  else if (input.value !== "") { input.value = ""; }
 } else if (e.key === "ArrowLeft" && index > 0) { setTimeout(() => { inputs[index - 1].focus(); }, 80); }
 else if (e.key === "ArrowRight" && index < inputs.length - 1) { setTimeout(() => { inputs[index + 1].focus(); }, 80); }
}

function handleMobilePasteLO(e) {
 e.preventDefault();
 const pastedData = e.clipboardData.getData("text");
 const cleanData = pastedData.replace(/\D/g, "");
 const digits = cleanData.split("");
 const container = e.target.closest('[id$="DigitsContainer"]');
 const inputs = container ? container.querySelectorAll('input') : [];
 inputs.forEach((input) => { input.value = ""; input.readOnly = false; });
 for (let i = 0; i < digits.length && i < inputs.length; i++) { inputs[i].value = digits[i]; }
 const nextEmptyIndex = Array.from(inputs).findIndex((input) => input.value === "");
 if (nextEmptyIndex !== -1) { setTimeout(() => { inputs[nextEmptyIndex].focus(); }, 10); }
 else { setTimeout(() => { inputs[inputs.length - 1].focus(); }, 10); }
}

function handleOtpPasteLO(e) {
 e.preventDefault();
 const pastedData = e.clipboardData.getData("text");
 const cleanData = pastedData.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 6);
 const characters = cleanData.split("");
 const inputs = document.querySelectorAll("#lo-otpDigitsContainer input");
 const startIndex = 0;
 inputs.forEach((input) => { input.value = ""; input.readOnly = false; });
 for (let i = 0; i < characters.length && i < inputs.length; i++) { inputs[i].value = characters[i]; }
 const nextEmptyIndex = Array.from(inputs).findIndex((input) => input.value === "");
 if (nextEmptyIndex !== -1) { setTimeout(() => { inputs[nextEmptyIndex].focus(); }, 80); }
 else { setTimeout(() => { inputs[inputs.length - 1].focus(); }, 80); }
}

function getMobileNumberFromDigitsLO() {
 const inputs = document.querySelectorAll("#lo-mobileDigitsContainer input");
 return Array.from(inputs).map((input) => input.value).join("");
}

function getOtpFromInputsLO() {
 const inputs = document.querySelectorAll("#lo-otpDigitsContainer input");
 return Array.from(inputs).map((input) => input.value).join("");
}

// ========== Dynamic extra fields for login (b.da.xtraEiFlds_forLoginO) ==========
// Mirrors the ei.js dynamic-extra-fields engine (myxtraFlds_fildsToNeeds), self-contained
// with a "my1loX" prefix to avoid global-name collisions when both scripts are present.
function my1loXtraGet() {
    try {
        var c = (typeof window[my1uzr.worknOnPg].clientConfig === "object" && window[my1uzr.worknOnPg].clientConfig) ? window[my1uzr.worknOnPg].clientConfig : {};
        var defs = c && c.xtraEiFlds_forLoginO;
        return (defs && typeof defs === "object" && Object.keys(defs).length > 0) ? defs : null;
    } catch (e) { return null; }
}
function my1loXtraIsGroup(def) {
 if (!def || typeof def !== "object") return false;
 if (def.type === "div") return true;
 if (def.x && typeof def.x === "object") return true;
 if (!def.type) {
  for (var k in def) {
   if (!def.hasOwnProperty(k)) continue;
   if (k === "lbl" || k === "ptrn" || k === "rq" || k === "rqOneOf" || k === "preProcess" || k === "postProcess" || k === "x") continue;
   if (def[k] && typeof def[k] === "object") return true;
  }
 }
 return false;
}
function my1loXtraChildren(def) {
 return (def.x && typeof def.x === "object") ? def.x : def;
}
function my1loXtraQuery(sel, path) {
 return document.querySelector("." + sel + '[data-path="' + path + '"]');
}
function my1loXtraTheme() {
 var r = (typeof window.my1loThemeReport === "object" && window.my1loThemeReport) ? window.my1loThemeReport : {};
 var brand = r.brandHex || r.brand || "#9933cc";
 var brandDark = r.brandDark || brand;
 var onBrand = r.onBrand || "#ffffff";
 var lightBg = r.lightBg || "#ffffff";
 var ink = r.ink || "#212529";
 return { brand: brand, brandDark: brandDark, onBrand: onBrand, lightBg: lightBg, ink: ink };
}
function my1loXtraRender() {
 var wrap = document.getElementById("my1loXtraFields");
 if (!wrap) return;
 var xtra = my1loXtraGet();
 if (!xtra) { wrap.innerHTML = ""; wrap.style.display = "none"; return; }
 wrap.style.display = "";
 var p = my1loXtraTheme();
 var inpDyn = "display:block;width:100%;background:#fff;border:2px solid #6c757d;border-radius:10px;padding:8px 12px;font-size:14px;color:" + p.ink + ";outline:none;";
 var boxStyle = "border:2px solid #6c757d;border-radius:.5rem;padding:8px 10px;margin-bottom:.5rem;background:" + p.lightBg + ";";
 var html = "";
 function renderDef(def, path, inDiv) {
  var out = "";
  if (!def || typeof def !== "object") return out;
   if (my1loXtraIsGroup(def)) {
    var children = my1loXtraChildren(def);
    var hasBox = (def.type === "div" || (def.x && typeof def.x === "object") || !!def.lbl) && !inDiv;
     var isMeta = function (key) { return key === "lbl" || key === "type" || key === "ptrn" || key === "rq" || key === "rqOneOf" || key === "preProcess" || key === "postProcess" || key === "x"; };
    if (hasBox) {
     out += '<div style="' + boxStyle + '">';
     if (def.lbl) out += '<div class="text-xs fw-bold text-uppercase mb-2" style="color:#343a40;"><i class="fas fa-layer-group me-1" style="color:' + p.brand + ';"></i>' + def.lbl + '</div>';
     var _ro = def.rqOneOf && typeof def.rqOneOf === "object" && def.rqOneOf.length ? def.rqOneOf : null;
     var _roSelDone = false;
     for (var ck in def) {
      if (!def.hasOwnProperty(ck)) continue;
      if (isMeta(ck)) {
       if (_ro && ck === "rqOneOf" && !_roSelDone) {
        _roSelDone = true;
        out += '<select class="my1loXph-rqOneOf-sel" data-path="' + path + '" style="font-size:14px;' + inpDyn + 'padding:6px 8px;margin-bottom:8px;"><option value="" disabled selected>Select...</option>';
        for (var ri = 0; ri < _ro.length; ri++) {
         var rKey = _ro[ri];
         var rLbl = (children[rKey] && children[rKey].lbl) || rKey;
         out += '<option value="' + rKey + '">' + rLbl + '</option>';
        }
         out += '</select>';
         out += '<span class="my1loXph-err" data-path="' + path + '__rqOneOfSel" style="font-size:11px;color:#dc3545;display:none;margin-top:2px;"></span>';
        }
        continue;
       }
       if (!def.x && !children[ck]) continue;
      if (_ro && _ro.indexOf(ck) !== -1) {
       out += '<div class="my1loXph-rqOneOf-item" data-rqoneof="' + path + '" data-rqoneof-key="' + ck + '" style="display:none;">';
       out += renderDef(children[ck], path + "__" + ck, true);
       out += '</div>';
      } else {
       out += renderDef(children[ck], path + "__" + ck, true);
      }
     }
     out += "</div>";
    } else {
     if (def.lbl) out += '<div class="text-xs fw-bold text-uppercase mt-3" style="color:#343a40;"><i class="fas fa-layer-group me-1" style="color:' + p.brand + ';"></i>' + def.lbl + '</div>';
     var _ro = def.rqOneOf && typeof def.rqOneOf === "object" && def.rqOneOf.length ? def.rqOneOf : null;
     var _roSelDone = false;
     for (var pk in def) {
      if (!def.hasOwnProperty(pk)) continue;
      if (isMeta(pk)) {
       if (_ro && pk === "rqOneOf" && !_roSelDone) {
        _roSelDone = true;
        out += '<select class="my1loXph-rqOneOf-sel" data-path="' + path + '" style="font-size:14px;' + inpDyn + 'padding:6px 8px;margin-bottom:8px;"><option value="" disabled selected>Select...</option>';
        for (var ri = 0; ri < _ro.length; ri++) {
         var rKey = _ro[ri];
         var rLbl = (children[rKey] && children[rKey].lbl) || rKey;
         out += '<option value="' + rKey + '">' + rLbl + '</option>';
        }
         out += '</select>';
         out += '<span class="my1loXph-err" data-path="' + path + '__rqOneOfSel" style="font-size:11px;color:#dc3545;display:none;margin-top:2px;"></span>';
        }
        continue;
       }
       if (!children[pk]) continue;
      if (_ro && _ro.indexOf(pk) !== -1) {
       out += '<div class="my1loXph-rqOneOf-item" data-rqoneof="' + path + '" data-rqoneof-key="' + pk + '" style="display:none;">';
       out += renderDef(children[pk], path + "__" + pk, inDiv);
       out += '</div>';
      } else {
       out += renderDef(children[pk], path + "__" + pk, inDiv);
      }
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
   out += '<div class="my1loXph-img-box" data-path="' + path + '" style="border:2px dashed #6c757d;border-radius:.5rem;text-align:center;padding:14px 8px;cursor:pointer;background:#f8f9fa;"><i class="fas fa-image mb-1 d-block" style="font-size:1.6rem;color:' + p.brand + ';"></i><span class="fw-bold">' + lbl + "</span></div>";
   out += '<div class="my1loXph-img-prev" data-path="' + path + '" style="display:none;margin-top:6px;border:2px solid #6c757d;border-radius:.5rem;padding:6px;text-align:center;"><img class="my1loXph-img-prev-img" data-path="' + path + '" src="" alt="' + lbl + '" style="max-width:100%;height:auto;max-height:150px;display:block;margin:auto;"><div class="mt-1"><span class="small text-muted my1loXph-img-prev-name" data-path="' + path + '"></span><button type="button" class="btn btn-sm btn-outline-danger my1loXph-img-remove" data-path="' + path + '" style="padding:0 6px;margin-left:6px;"><i class="fas fa-times"></i> Remove</button></div></div>';
   out += '<input type="hidden" class="my1loXph-val" data-path="' + path + '">';
  } else if (ftype === "textarea") {
   out += '<textarea class="my1loXph-val" data-path="' + path + '" rows="2" placeholder="' + ph + '" style="font-size:14px;' + inpDyn + 'resize:vertical;min-height:40px;"></textarea>';
  } else if (ftype === "select") {
   out += '<select class="my1loXph-val" data-path="' + path + '" style="font-size:14px;' + inpDyn + 'padding:6px 8px;">';
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
   out += '<input type="' + itype + '" class="my1loXph-val" data-path="' + path + '" placeholder="' + ph + '" style="font-size:14px;' + inpDyn + '"' + dynAttrs + ">";
  }
  out += '<span class="my1loXph-err" data-path="' + path + '" style="font-size:11px;color:#dc3545;display:none;margin-top:2px;"></span>';
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
 my1loXtraBind();
}
function my1loXtraSetImg(path, url) {
 var val = my1loXtraQuery("my1loXph-val", path);
 var box = my1loXtraQuery("my1loXph-img-box", path);
 var prev = my1loXtraQuery("my1loXph-img-prev", path);
 var img = my1loXtraQuery("my1loXph-img-prev-img", path);
 var nameEl = my1loXtraQuery("my1loXph-img-prev-name", path);
 if (val) val.value = url;
 if (box) { box.style.display = url ? "none" : ""; box.style.borderColor = "#6c757d"; }
 if (prev) prev.style.display = url ? "block" : "none";
 if (img) { if (url) img.src = url; else img.removeAttribute("src"); }
 if (nameEl) nameEl.textContent = url ? "Image selected" : "";
}
function my1loXtraBind() {
 document.querySelectorAll(".my1loXph-img-box").forEach(function (box) {
  box.addEventListener("click", async function (e) {
   e.preventDefault();
   e.stopPropagation();
   var path = this.getAttribute("data-path");
   var cbName = "my1loXtraImgCb_" + path.replace(/[^a-zA-Z0-9]/g, "_");
   window[cbName] = function (obj) {
    var url = (obj && (obj.g1 || obj.url)) || "";
    my1loXtraSetImg(path, url);
    delete window[cbName];
   };
   try {
    await loadExe2Fn(24, [window[cbName], window.imgObjDimensRqd2 || []], [1]);
   } catch (err) { delete window[cbName]; }
  });
 });
 document.querySelectorAll(".my1loXph-img-remove").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
   e.stopPropagation();
   my1loXtraSetImg(this.getAttribute("data-path"), "");
  });
 });
 document.querySelectorAll(".my1loXph-val[data-uc], .my1loXph-val[data-strip], .my1loXph-val[data-maxlen]").forEach(function (el) {
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
 document.querySelectorAll("#my1loXtraFields .my1loXph-val").forEach(function (el) {
  el.addEventListener("input", function () { my1loXtraLiveCheck(this); });
  el.addEventListener("change", function () { my1loXtraLiveCheck(this); });
   el.addEventListener("blur", async function () {
    var path = this.getAttribute("data-path");
    if (!path) return;
    var def = my1loXtraFindDefByPath(my1loXtraGet(), path);
    if (!def || !def.preProcess || typeof window[def.preProcess] !== "function") return;
    var pre = await my1loXtraRunPre(def, String(this.value || ""), null);
    if (String(pre) !== String(this.value || "")) this.value = pre;
    my1loXtraLiveCheck(this);
   });
  });
  document.querySelectorAll(".my1loXph-rqOneOf-sel").forEach(function (sel) {
   sel.addEventListener("change", function () {
    var gp = this.getAttribute("data-path");
    document.querySelectorAll('.my1loXph-rqOneOf-item[data-rqoneof="' + gp + '"]').forEach(function (d) { d.style.display = "none"; });
    var chosen = this.value;
    if (chosen) {
     var item = document.querySelector('.my1loXph-rqOneOf-item[data-rqoneof="' + gp + '"][data-rqoneof-key="' + chosen + '"]');
     if (item) {
      item.style.display = "";
      var def = my1loXtraFindDefByPath(my1loXtraGet(), gp + "__" + chosen);
      if (def && def._origRq !== undefined) { def.rq = def._origRq; delete def._origRq; }
     }
    }
   });
  });
 }
function my1loXtraFindDefByPath(xtra, path) {
 if (!xtra || typeof xtra !== "object") return null;
 var parts = path.split("__");
 var cur = xtra;
 for (var i = 0; i < parts.length; i++) {
  if (!cur || typeof cur !== "object") return null;
  cur = cur[parts[i]];
  if (!cur) return null;
  if (my1loXtraIsGroup(cur)) { cur = my1loXtraChildren(cur); }
  else if (i < parts.length - 1) return null;
 }
 return cur;
}
 function my1loXtraCheckField(def, path, focusOnFail) {
  if (!def || typeof def !== "object") return true;
  var el = my1loXtraQuery("my1loXph-val", path);
  if (!el) return true;
  var rpItem = el.closest('.my1loXph-rqOneOf-item');
  if (rpItem && rpItem.style.display === "none") {
   if (def.rq !== undefined && def._origRq === undefined) { def._origRq = def.rq; def.rq = 0; }
   return true;
  }
  var isFile = def.type === "file";
 var req = def.rq === 1 || def.rq === true;
 var errEl = my1loXtraQuery("my1loXph-err", path);
 var val = String(el.value || "").trim();
 var failLocal = function (msg) {
  if (errEl) { errEl.textContent = msg; errEl.style.display = "block"; }
  if (isFile) { var box = my1loXtraQuery("my1loXph-img-box", path); if (box) box.style.borderColor = "#dc3545"; }
  else el.style.borderColor = "#dc3545";
  if (focusOnFail) {
   try { var t = isFile ? my1loXtraQuery("my1loXph-img-box", path) : el; t.focus(); t.scrollIntoView({ block: "center" }); } catch (e) {}
  }
  return false;
 };
 var clear = function () {
  if (errEl) errEl.style.display = "none";
  if (isFile) { var box = my1loXtraQuery("my1loXph-img-box", path); if (box) box.style.borderColor = "#6c757d"; }
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
function my1loXtraLiveCheck(el) {
 if (!el) return;
 var path = el.getAttribute("data-path");
 if (!path) return;
 var def = my1loXtraFindDefByPath(my1loXtraGet(), path);
 my1loXtraCheckField(def, path, false);
}
function my1loXtraValidate() {
 var xtra = my1loXtraGet();
 if (!xtra || typeof xtra !== "object") return true;
 var ok = true;
 var firstInvalid = null;
 function walk(obj, basePath) {
  for (var k in obj) {
   if (!obj.hasOwnProperty(k)) continue;
   var def = obj[k];
   var path = basePath ? basePath + "__" + k : k;
   if (!def || typeof def !== "object") continue;
   if (my1loXtraIsGroup(def)) { walk(my1loXtraChildren(def), path); continue; }
   if (!my1loXtraCheckField(def, path, false)) {
    ok = false;
    if (!firstInvalid) {
     var el = my1loXtraQuery("my1loXph-val", path);
     firstInvalid = el ? (def.type === "file" ? my1loXtraQuery("my1loXph-img-box", path) : el) : null;
    }
   }
  }
 }
  walk(xtra, "");
   (function() {
    function chkGroup(obj, basePath) {
     for (var k in obj) {
      if (!obj.hasOwnProperty(k)) continue;
      var def = obj[k];
      var path = basePath ? basePath + "__" + k : k;
      if (!def || typeof def !== "object") continue;
      if (my1loXtraIsGroup(def)) {
       var ro = def.rqOneOf;
       if (ro && typeof ro === "object" && ro.length) {
        var ch = my1loXtraChildren(def);
        var anyVal = false;
        var anyVisible = false;
        var lbls = [];
        var firstVisiblePath = null;
        var ddEl = my1loXtraQuery("my1loXph-rqOneOf-sel", path);
        for (var i = 0; i < ro.length; i++) {
         var fk = ro[i];
         if (ch[fk] && ch[fk].lbl) lbls.push(ch[fk].lbl);
         var cel = my1loXtraQuery("my1loXph-val", path + "__" + fk);
         if (!cel) continue;
         var celItem = cel.closest('.my1loXph-rqOneOf-item');
         if (celItem && celItem.style.display === "none") continue;
         if (!anyVisible) { anyVisible = true; firstVisiblePath = path + "__" + fk; }
         if (String(cel.value || "").trim()) { anyVal = true; break; }
        }
         if (!anyVal) {
          ok = false;
          if (!firstInvalid) {
           firstInvalid = ddEl || (firstVisiblePath ? my1loXtraQuery("my1loXph-val", firstVisiblePath) : null) || null;
          }
          var errEl = !anyVisible
           ? my1loXtraQuery("my1loXph-err", path + "__rqOneOfSel")
           : (ddEl ? my1loXtraQuery("my1loXph-err", path + "__" + ro[0]) : (firstVisiblePath ? my1loXtraQuery("my1loXph-err", firstVisiblePath) : null));
          if (errEl) {
           errEl.textContent = !anyVisible ? "Required" : "Please enter at least one: " + lbls.join(", ");
           errEl.style.display = "block";
          }
        }
       }
       chkGroup(my1loXtraChildren(def), path);
       continue;
      }
     }
    }
    chkGroup(xtra, "");
   })();
  if (firstInvalid) {
   try { firstInvalid.focus(); firstInvalid.scrollIntoView({ block: "center" }); } catch (e) {}
  }
  return ok;
}
function my1loXtraCollect() {
 var xtra = my1loXtraGet();
 var out = {};
 if (!xtra || typeof xtra !== "object") return out;
 function walk(obj, basePath, dest) {
  for (var k in obj) {
   if (!obj.hasOwnProperty(k)) continue;
   var def = obj[k];
   var path = basePath ? basePath + "__" + k : k;
   if (!def || typeof def !== "object") continue;
   if (my1loXtraIsGroup(def)) { dest[k] = {}; walk(my1loXtraChildren(def), path, dest[k]); continue; }
    var el = my1loXtraQuery("my1loXph-val", path);
    if (el) {
     var _roItem = el.closest('.my1loXph-rqOneOf-item');
     if (_roItem && _roItem.style.display === "none") continue;
     dest[k] = el.value;
    }
  }
 }
 walk(xtra, "", out);
 return out;
}
async function my1loXtraRunPre(def, groupVals, payload) {
 var fn = def && def.preProcess;
 if (fn && typeof window[fn] === "function") {
  var result = await window[fn](groupVals, payload);
  return (result === undefined || result === false || result === null) ? groupVals : result;
 }
 return groupVals;
}
async function my1loXtraPreProcess(collected, xtra, payload) {
 if (!collected || !xtra || typeof xtra !== "object") return collected;
 for (var k in xtra) {
  if (!xtra.hasOwnProperty(k)) continue;
  var def = xtra[k];
  if (!def || typeof def !== "object") continue;
  if (my1loXtraIsGroup(def)) {
   var children = my1loXtraChildren(def);
   if (def.preProcess && collected[k] && typeof collected[k] === "object") {
    collected[k] = await my1loXtraRunPre(def, collected[k], payload);
   } else if (collected[k] && typeof collected[k] === "object") {
    await my1loXtraPreProcess(collected[k], children, payload);
   }
  } else if (def.preProcess && typeof collected[k] === "string") {
   collected[k] = await my1loXtraRunPre(def, collected[k], payload);
  }
 }
 return collected;
}
async function my1loXtraRunPost(def, groupVals, payload) {
 var fn = def && def.postProcess;
 if (fn && typeof window[fn] === "function") {
  var result = await window[fn](groupVals, payload);
  if (!result) { showAlertModalLO("postProcess failed!"); return groupVals; }
  return result;
 }
 return groupVals;
}
async function my1loXtraPostProcess(collected, xtra, payload) {
 if (!collected || !xtra || typeof xtra !== "object") return collected;
 for (var k in xtra) {
  if (!xtra.hasOwnProperty(k)) continue;
  var def = xtra[k];
  if (!def || typeof def !== "object") continue;
  if (my1loXtraIsGroup(def)) {
   var children = my1loXtraChildren(def);
   if (def.postProcess && collected[k] && typeof collected[k] === "object") {
    collected[k] = await my1loXtraRunPost(def, collected[k], payload);
   } else if (collected[k] && typeof collected[k] === "object") {
    await my1loXtraPostProcess(collected[k], children, payload);
   }
  } else if (def.postProcess && typeof collected[k] === "string") {
   collected[k] = await my1loXtraRunPost(def, collected[k], payload);
  }
 }
 return collected;
}

// Main function to open the login modal
async function open_shoLgnO(...args) {

 if (typeof requestWakeLock === 'function') { await requestWakeLock(); }
 id_of_dv_shoLgnO_to_set_processed_dom_object = "dv_to_set_open_shoLgnO_processed";
 switch_shoLgnO_create_nw_modal = args[1] || 0;
 swtch_0nothing_1flex_2block_shoLgnO = args[2] || 0;
 swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn = args[3] || 0;

 if (isLoggedInLO()) {
  if (swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === 2) { showUserInfoModal(); }
  else if (swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === 1) { showLogoutOptionLO(); }
  else { showLogoutOptionLO(); }
  return;
 }

 let targetElement = document.getElementById(id_of_dv_shoLgnO_to_set_processed_dom_object);
 const modalResult = create_modal_dynamically(id_of_dv_shoLgnO_to_set_processed_dom_object);
 targetElement = modalResult.contentElement;
 window.currentLoginModal = modalResult;
 const dialog = modalResult.modalElement.querySelector('.modal-dialog');
 if (dialog) dialog.style.marginTop = '100px';

 modalResult.modalElement.addEventListener("hidden.bs.modal", function () {
  if (typeof releaseWakeLock === 'function') { releaseWakeLock(); }
 });

 modalResult.modalElement.addEventListener('shown.bs.modal', function () {
  const firstInput = modalResult.modalElement.querySelector('#lo-mobileDigitsContainer input');
  if (firstInput) firstInput.focus();
 });

 targetElement.innerHTML = set_innerHTML_of_shoLgnO();
 my1loXtraRender();

 if (swtch_0nothing_1flex_2block_shoLgnO === 1) { targetElement.style.display = "flex"; }
 else if (swtch_0nothing_1flex_2block_shoLgnO === 2) { targetElement.style.display = "block"; }

 const countryCodeSelect = document.getElementById("lo-loginCountryCode");
 if (countryCodeSelect) {
  loadCountryCodesLO("lo-loginCountryCode");
  setTimeout(() => {
   countryCodeSelect.value = "+91";
   updateMobileLengthInfoLO("lo-loginCountryCode", "lo-mobileLengthInfo");
   const mobileInputs = document.querySelectorAll("#lo-mobileDigitsContainer input");
   mobileInputs.forEach(input => {
    input.addEventListener("input", validateGetOtpForm);
    input.addEventListener("paste", () => { setTimeout(validateGetOtpForm, 150); });
   });
   validateGetOtpForm();
  }, 500);
 }

 createOtpDigitInputsLO();
 setupL3EventListeners();
 if (appcss) { injectMy1loTheme(generateLognTheme(appcss)); }
 //let my1lo_style = null;
 //if (my1lo_style) { injectMy1loTheme(generateLognTheme(my1lo_style)); }
 window.currentLoginModal.modalInstance.show();
 setupOtpTextToggleLO();
}

function initLoginSystemLO() {
 addCustomStyles();
 const loginButton = document.getElementById("el_sho_login_modal");
 if (loginButton) {
  loginButton.addEventListener("click", function () {
   if (isLoggedInLO()) { showLogoutOptionLO(); }
   else { open_shoLgnO("tempLoginModal", 0, 0); }
  });
 }
}

document.addEventListener("DOMContentLoaded", function () { initLoginSystemLO(); });