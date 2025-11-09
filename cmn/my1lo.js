// const audToPlayOnGetOTP = "https://cdn.pixabay.com/download/audio/2023/08/26/audio_a6ee15a317.mp3";
// const audToPlayOnGetOTP = "https://drive.google.com/file/d/1oWkhjIqP7nmE9-Xp5GkxDcXPoFh_I_cz/view?usp=drivesdk";
// const audToPlayOnGetOTP = "https://drive.google.com/file/d/1jpXpJnrgGDUL1ydvw0dT5gx5IY19T69s/view?usp=drivesdk";
// const audToPlayOnGetOTP = "https://drive.usercontent.google.com/download?id=1jpXpJnrgGDUL1ydvw0dT5gx5IY19T69s=download&confirm=t";
const audToPlayOnGetOTP =
  "https://drive.google.com/file/d/1ECpwV0wcp2ZxSvvo46kZpls_MOeWKuAG/view?usp=drivesdk";

// Global variables
let nameOfLoggedInPage = "";
let originalBodyStyles = "";
let id_of_dv_shoLgnO_to_set_processed_dom_object;
let switch_shoLgnO_create_nw_modal;
let swtch_0nothing_1flex_2block_shoLgnO;
let swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn = 0;
let confirmMoNo = 1;

let isOtpSuppressed = false;
let resendTimer = null;
let resendTimeLeft = 0;

// WebOTP API variables
let webOtpAbortController = null;
let webOtpTimeoutId = null;
let isWebOtpListening = false;

// Full screen loader element
let fullScreenLoader = null;

// Audio for OTP sent notification
let otpSentAudio = null;
let isAudioPreloaded = false;
preloadOtpAudio();

async function preloadOtpAudio() {
  try {
    console.log("Preloading OTP audio...");

    await loadExecFn(
      "getDriveFileAsBlob,getMultipleDriveFilesAsBlobs",
      null,
      [],
      "loader",
      "https://my1.in/0.0000000000/0drPrx.js",
      []
    );
    const audioResults = await window.getMultipleDriveFilesAsBlobs(
      [audToPlayOnGetOTP],
      "https://my1.in/0.0000000000/0drPrx.php",
      true
    );

    if (audioResults.success.length > 0) {
      const audioData = audioResults.success[0];
      const blobUrl = URL.createObjectURL(audioData.blob);

      otpSentAudio = new Audio(blobUrl);

      // Don't revoke the URL here - wait until we're done with the audio
      otpSentAudio.addEventListener("canplaythrough", () => {
        console.log("OTP audio preloaded and ready");
        isAudioPreloaded = true;
      });

      otpSentAudio.addEventListener("error", (e) => {
        console.error("Audio loading error:", e);
        isAudioPreloaded = false;
        // Clean up on error
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

  // Clean up any existing WebOTP request
  stopWebOtpListener();

  webOtpAbortController = new AbortController();
  const form = input.closest("form");

  // Abort if user submits manually
  if (form) {
    const submitHandler = (e) => {
      console.log("Form submitted, stopping WebOTP listener");
      stopWebOtpListener();
    };
    form.addEventListener("submit", submitHandler, { once: true });
  }

  // WebOTP times out after waitTime seconds (120 seconds = 2 minutes)
  const waitTime = 120000; // 2 minutes in milliseconds
  webOtpTimeoutId = setTimeout(() => {
    console.log(`WebOTP request timed out after ${waitTime / 1000} seconds`);
    removeVerificationMessages();
    stopWebOtpListener();
    showManualVerificationMessage();
  }, waitTime);

  console.log("Starting fresh WebOTP listener...");
  isWebOtpListening = true;

  navigator.credentials
    .get({
      otp: { transport: ["sms"] },
      signal: webOtpAbortController.signal,
    })
    .then((otp) => {
      console.log("OTP received via WebOTP:", otp.code);
      clearTimeout(webOtpTimeoutId);
      webOtpTimeoutId = null;
      isWebOtpListening = false;

      // The loader will be shown inside autoFillAndVerifyOtp
      autoFillAndVerifyOtp(otp.code);
    })
    .catch((err) => {
      console.log("WebOTP error:", err);
      clearTimeout(webOtpTimeoutId);
      webOtpTimeoutId = null;
      isWebOtpListening = false;

      // Ensure loader is hidden on WebOTP error
      hideFullScreenLoader();

      if (err.name !== "AbortError") {
        console.log("WebOTP failed, showing manual verification message");
        removeVerificationMessages();
        showManualVerificationMessage();

        // Restart listener for next SMS after a short delay
        setTimeout(() => {
          if (
            document.getElementById("otpSection") &&
            !document.getElementById("otpSection").classList.contains("d-none")
          ) {
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
  const getOtpBtn = document.getElementById("getOtpBtn");
  if (!getOtpBtn) return;

  let errorMsg = document.getElementById("audioErrorMsg");
  if (!errorMsg) {
    errorMsg = document.createElement("div");
    errorMsg.id = "audioErrorMsg";
    errorMsg.className = "alert alert-warning text-center mb-2";
    errorMsg.innerHTML =
      "<i class=\"fas fa-exclamation-triangle me-2\"></i>press 'yes', when chrome shows you.";

    // Insert before the Get OTP button
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
  try {
    // If audio is already preloaded, play it
    if (isAudioPreloaded && otpSentAudio) {
      otpSentAudio.currentTime = 0;
      await otpSentAudio.play();
      removeAudioErrorMessage();
      return;
    } else {
      // Fallback: load audio on-demand
      console.log("Preloaded audio not available, loading on-demand...");
      const audioResults = await getMultipleDriveFilesAsBlobs(
        [audToPlayOnGetOTP],
        "https://my1.in/0.0000000000/0drPrx.php",
        true
      );
      if (audioResults.success.length > 0) {
        const audioData = audioResults.success[0];
        const blobUrl = URL.createObjectURL(audioData.blob);

        const tempAudio = new Audio(blobUrl);
        tempAudio.currentTime = 0;

        // Clean up after playback ends or on error
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
function showFullScreenLoader() {
  fullScreenLoader = createDynamicLoader("Processing...");
}

// Hide full screen loader
function hideFullScreenLoader() {
  if (fullScreenLoader && typeof fullScreenLoader.removeLoader === 'function') {
    fullScreenLoader.removeLoader();
    fullScreenLoader = null;
  }
}

// Check if user is logged in
function isLoggedIn() {
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
          ${my1uzr.ml ? 
            `<img src="${my1uzr.ml}" alt="Profile Picture" class="rounded-circle w-100 h-100" style="object-fit: cover;">` : 
            `<i class="fas fa-user text-white" style="font-size: 2rem;"></i>`
          }
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

  // Add click event to the user title for logout
  const userTitle = modalContent.querySelector('#userInfoTitle');
  if (userTitle) {
    userTitle.addEventListener('click', function() {
      if (confirm("Do you want to log out?")) {
        my1uzr = null;
        localStorage.setItem('my1uzr', null);
        modalResult.modalInstance.hide();
        setTimeout(() => {
          location.reload();
        }, 300);
      }
    });
  }

  modalResult.modalInstance.show();
}

// Show logout option modal
function showLogoutOption() {
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
      ${(appData && appData.normalLogotNotAlod && appData.normalLogotNotAlod === 1) ? '' : 
        '<button type="button" class="btn btn-danger" id="confirmLogoutBtn">Logout</button>'
      }
    </div>
  `;

  const confirmBtn = modalContent.querySelector('#confirmLogoutBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      my1uzr = null;
      localStorage.setItem("my1uzr", null);
      modalResult.modalInstance.hide();
      setTimeout(() => {
        location.reload();
      }, 300);
    });
  }

  modalResult.modalInstance.show();
}

// Save original body styles
function saveBodyStyles() {
  originalBodyStyles = {
    overflow: document.body.style.overflow,
    position: document.body.style.position,
    width: document.body.style.width,
  };
}

// Restore body styles
function restoreL3BodyStyles() {
  document.body.style.overflow = originalBodyStyles.overflow || "";
  document.body.style.position = originalBodyStyles.position || "";
  document.body.style.width = originalBodyStyles.width || "";
}

// Function to show mobile confirmation modal
function showMobileConfirmationModal(countryCode, mobileNumber, callback) {
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
    restoreL3BodyStyles();
    callback(result);
  };

  confirmBtn.addEventListener('click', () => handleClose(true));
  editBtn.addEventListener('click', () => handleClose(false));
  
  // Handle modal close via backdrop or escape
  modalResult.modalElement.addEventListener('hidden.bs.modal', () => {
    restoreL3BodyStyles();
    callback(false);
  });

  saveBodyStyles();
  document.body.style.overflow = "hidden";
  modalResult.modalInstance.show();
}

function autoFillAndVerifyOtp(otp) {
  console.log("Auto-filling OTP:", otp);

  const inputs = document.querySelectorAll("#otpDigitsContainer input");
  const otpDigits = otp.split("");

  for (let i = 0; i < Math.min(inputs.length, otpDigits.length); i++) {
    inputs[i].value = otpDigits[i];
  }

  showAutoVerificationInProgress();

  // Show loader for automatic verification
  showFullScreenLoader();

  setTimeout(async () => {
    try {
      await verifyOTP(otp);
    } catch (error) {
      console.error("Auto-verification failed:", error);
      // Ensure loader is hidden on error
      hideFullScreenLoader();
    }
  }, 1000);
}

function showAutoVerificationInProgress() {
  const otpSection = document.getElementById("otpSection");
  if (!otpSection) return;

  let progressMsg = document.getElementById("autoVerifyProgress");
  if (!progressMsg) {
    progressMsg = document.createElement("div");
    progressMsg.id = "autoVerifyProgress";
    progressMsg.className = "alert alert-info text-center mt-2";
    progressMsg.innerHTML =
      '<i class="fas fa-sync fa-spin me-2"></i>Auto-verifying OTP...';
    otpSection.appendChild(progressMsg);
  }
}

function showManualVerificationMessage() {
  const otpSection = document.getElementById("otpSection");
  if (!otpSection) return;

  let manualMsg = document.getElementById("manualVerifyMsg");
  if (!manualMsg) {
    manualMsg = document.createElement("div");
    manualMsg.id = "manualVerifyMsg";
    manualMsg.className = "alert alert-warning text-center mt-2";
    manualMsg.innerHTML =
      '<i class="fas fa-info-circle me-2"></i>Please verify OTP manually';
    otpSection.appendChild(manualMsg);
  }
}

function removeVerificationMessages() {
  const progressMsg = document.getElementById("autoVerifyProgress");
  const manualMsg = document.getElementById("manualVerifyMsg");

  if (progressMsg && progressMsg.parentNode) {
    progressMsg.parentNode.removeChild(progressMsg);
  }
  if (manualMsg && manualMsg.parentNode) {
    manualMsg.parentNode.removeChild(manualMsg);
  }
}

function setupL3EventListeners() {
  const loginName = document.getElementById("loginName");
  const localName = document.getElementById("localName");
  const countryCodeSelect = document.getElementById("loginCountryCode");
  const acceptTerms = document.getElementById("acceptTerms");
  const getOtpBtn = document.getElementById("getOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const resendOtp = document.getElementById("resendOtp");
  const expandLocalName = document.getElementById("expandLocalName");
  const localNameSection = document.getElementById("localNameSection");

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
          errorElement.textContent =
            "Local name must not contain English letters or numbers";
          errorElement.classList.remove("d-none");
          this.classList.add("is-invalid");
        } else {
          errorElement.classList.add("d-none");
          this.classList.remove("is-invalid");
        }
      }
    });
  }

  if (countryCodeSelect) {
    countryCodeSelect.addEventListener("change", function () {
      updateMobileLengthInfo("loginCountryCode", "mobileLengthInfo");
    });
  }

  if (getOtpBtn) {
    getOtpBtn.addEventListener("click", async function () {
      const name = loginName.value.trim();
      const mobile = getMobileNumberFromDigits();
      const countryCode = countryCodeSelect.value;
      const requiredLength = getRequiredMobileLength(countryCode);

      const mobileError = document.getElementById("mobileError");
      mobileError.classList.add("d-none");

      const inputs = document.querySelectorAll("#mobileDigitsContainer input");
      inputs.forEach((input) => input.classList.remove("is-invalid"));

      if (name.length < 2) {
        document.getElementById("nameError").classList.remove("d-none");
        loginName.classList.add("is-invalid");
        return;
      }

      if (
        !localNameSection.classList.contains("d-none") &&
        localName.value.trim() !== ""
      ) {
        const hasEnglishChars = /[A-Za-z0-9]/.test(localName.value);
        if (hasEnglishChars) {
          alert("Local name must not contain English letters or numbers");
          document.getElementById("localNameError").classList.remove("d-none");
          localName.classList.add("is-invalid");
          return;
        }
      }

      let allDigitsFilled = true;
      inputs.forEach((input) => {
        if (input.value === "") {
          input.classList.add("is-invalid");
          allDigitsFilled = false;
        }
      });

      if (!allDigitsFilled) {
        mobileError.textContent = `Please enter all ${requiredLength} digits`;
        mobileError.classList.remove("d-none");
        return;
      }

      if (mobile.length !== requiredLength) {
        mobileError.textContent = `Please enter a valid ${requiredLength}-digit mobile number`;
        mobileError.classList.remove("d-none");
        return;
      }

      if (!acceptTerms.checked) {
        alert("Please accept the Terms & Conditions");
        return;
      }

      // Play OTP sound instantly when user clicks Get OTP
      await playOtpSentSound();

      if (confirmMoNo === 1) {
        showMobileConfirmationModal(
          countryCode,
          mobile,
          async (isConfirmed) => {
            if (isConfirmed) {
              await sendOTPRequest(countryCode, mobile);
            }
          }
        );
      } else {
        await sendOTPRequest(countryCode, mobile);
      }
    });
  }

  async function sendOTPRequest(countryCode, mobile) {
    const getOtpText = document.getElementById("getOtpText");
    const getOtpLoader = document.getElementById("getOtpLoader");
    const getOtpBtn = document.getElementById("getOtpBtn");

    getOtpText.classList.add("d-none");
    getOtpLoader.classList.remove("d-none");
    getOtpBtn.disabled = true;

    showFullScreenLoader();

    try {
      const otpSent = await getOTP(countryCode, mobile);
      if (otpSent.success) {
        document.getElementById("otpSection").classList.remove("d-none");
        getOtpBtn.classList.add("d-none");

        // Start WebOTP listener when OTP is successfully sent
        if (isWebOtpSupported()) {
          console.log("Starting fresh WebOTP listener for SMS auto-detection");
          startWebOtpListener();
        } else {
          console.log("WebOTP not supported - manual entry required");
          showManualVerificationMessage();
        }
        
// Ensure Verify OTP button is visible when OTP section is shown
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
if (verifyOtpBtn) {
  verifyOtpBtn.classList.remove("d-none");
}

        if (otpSent.waitTime) {
          startResendTimer(otpSent.waitTime);
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      getOtpText.classList.remove("d-none");
      getOtpLoader.classList.add("d-none");
      getOtpBtn.disabled = false;
      hideFullScreenLoader();
    }
  }

function startResendTimer(waitTime) {
  const resendOtp = document.getElementById("resendOtp");
  const resendContainer = document.getElementById("resendContainer");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");

  if (!resendContainer || !resendOtp) return;

  if (resendTimer) {
    clearInterval(resendTimer);
  }

  resendTimeLeft = waitTime;

  resendOtp.disabled = true;
  resendOtp.classList.add("d-none");
  resendContainer.classList.remove("d-none");

  // Show Verify OTP button when timer starts
  if (verifyOtpBtn) {
    verifyOtpBtn.classList.remove("d-none");
  }

  updateResendCountdown();

  resendTimer = setInterval(() => {
    resendTimeLeft--;
    updateResendCountdown();

    if (resendTimeLeft <= 0) {
      clearInterval(resendTimer);
      resendTimer = null;

      resendContainer.classList.add("d-none");
      resendOtp.classList.remove("d-none");
      resendOtp.disabled = false;
      resendOtp.classList.add("btn-warning");
      
      // Hide Verify OTP button when timer expires and Resend is shown
      if (verifyOtpBtn) {
        verifyOtpBtn.classList.add("d-none");
      }
      
      // Remove any auto-verification messages
      removeVerificationMessages();
    }
  }, 1000);
}

  function updateResendCountdown() {
    const resendCountdown = document.getElementById("resendCountdown");
    if (resendCountdown) {
      resendCountdown.textContent = `Resend OTP in ${resendTimeLeft} seconds`;
    }
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener("click", async function () {
      const otp = getOtpFromInputs();

      if (otp.length !== 6) {
        alert("Please enter a valid 6-character OTP");
        return;
      }

      removeVerificationMessages();
      stopWebOtpListener();

      const verifyOtpText = document.getElementById("verifyOtpText");
      const verifyOtpLoader = document.getElementById("verifyOtpLoader");

      verifyOtpText.classList.add("d-none");
      verifyOtpLoader.classList.remove("d-none");
      verifyOtpBtn.disabled = true;

      showFullScreenLoader();

      try {
        await verifyOTP(otp);
      } catch (error) {
        console.error("Error verifying OTP:", error);
        alert("Failed to verify OTP. Please try again.");
      } finally {
        verifyOtpText.classList.remove("d-none");
        verifyOtpLoader.classList.add("d-none");
        verifyOtpBtn.disabled = false;
        hideFullScreenLoader();
      }
    });
  }

  if (resendOtp) {
    resendOtp.addEventListener("click", async function () {
      const mobile = getMobileNumberFromDigits();
      const countryCode = document.getElementById("loginCountryCode").value;
      const requiredLength = getRequiredMobileLength(countryCode);

      const inputs = document.querySelectorAll("#mobileDigitsContainer input");
      inputs.forEach((input) => input.classList.remove("is-invalid"));

      let allDigitsFilled = true;
      inputs.forEach((input) => {
        if (input.value === "") {
          input.classList.add("is-invalid");
          allDigitsFilled = false;
        }
      });

      if (!allDigitsFilled) {
        alert("Please enter complete mobile number first");
        return;
      }

      if (mobile.length !== requiredLength) {
        alert("Please enter a valid mobile number");
        return;
      }

      // Play OTP sound instantly when user clicks Resend OTP
      await playOtpSentSound();

      if (confirmMoNo === 1) {
        showMobileConfirmationModal(
          countryCode,
          mobile,
          async (isConfirmed) => {
            if (isConfirmed) {
              await resendOTPRequest(countryCode, mobile);
            }
          }
        );
      } else {
        await resendOTPRequest(countryCode, mobile);
      }
    });
  }

  async function resendOTPRequest(countryCode, mobile) {
    const resendOtp = document.getElementById("resendOtp");
    resendOtp.disabled = true;
    resendOtp.classList.remove("btn-warning");

    showFullScreenLoader();

    try {
      const otpSent = await getOTP(countryCode, mobile);
      if (otpSent.success) {
        alert("OTP resent successfully");

        // Restart WebOTP listener for resend with fresh instance
        if (isWebOtpSupported()) {
          console.log("Restarting fresh WebOTP listener for resent SMS");
          startWebOtpListener();
        }
        
// Show Verify OTP button when OTP is resent
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  if (verifyOtpBtn) {
    verifyOtpBtn.classList.remove("d-none");
  }

        if (otpSent.waitTime) {
          startResendTimer(otpSent.waitTime);
        }
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Please try again.");

      resendOtp.disabled = false;
      resendOtp.classList.add("btn-warning");
    } finally {
      hideFullScreenLoader();
    }
  }
}

// Load country codes into select element
function loadCountryCodes(selectId) {
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
    { code: "+61", name: "Australia", flag: "🇦🇺", length: 9 },
  ];

  const selectElement = document.getElementById(selectId);
  selectElement.innerHTML = countryCodes
    .map(
      (country) =>
        `<option value="${country.code}">${country.flag} ${country.code}</option>`
    )
    .join("");
}

function updateMobileLengthInfo(selectId, lengthInfoId) {
  const countryCode = document.getElementById(selectId).value;
  const requiredLength = getRequiredMobileLength(countryCode);
  document.getElementById(
    lengthInfoId
  ).textContent = `${requiredLength} digits required`;

  createMobileDigitInputs(requiredLength);
}

// Get required mobile length based on country code
function getRequiredMobileLength(countryCode) {
  const lengthMap = {
    "+1": 10,
    "+44": 10,
    "+91": 10,
    "+86": 11,
    "+81": 10,
    "+33": 9,
    "+49": 10,
    "+7": 10,
    "+55": 11,
    "+61": 9,
  };
  return lengthMap[countryCode] || 10;
}

// Send OTP to the provided mobile number
async function getOTP(countryCode, mobileNumber) {
  const requiredLength = getRequiredMobileLength(countryCode);

  if (mobileNumber.length !== requiredLength) {
    alert(
      `Please enter a valid ${requiredLength}-digit mobile number for ${countryCode}`
    );
    return { success: false };
  }

  const data = { yo: mobileNumber, yc: countryCode };
  if (isOtpSuppressed) {
    data.supress = 1;
  }

  try {
    const response = await fetch("https://my1.in/5z/o.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.su == 1) {
    //   alert(`OTP sent to ${countryCode}${mobileNumber}`);
      return {
        success: true,
        waitTime: result.wait || 30,
      };
    } else {
      alert(JSON.stringify(result));
      return { success: false };
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    alert("Failed to send OTP. Please try again.");
    return { success: false };
  }
}

// Verify the OTP entered by the user
async function verifyOTP(otp) {
  const countryCode = document.getElementById("loginCountryCode").value;
  const mobileNumber = getMobileNumberFromDigits();
  const requiredLength = getRequiredMobileLength(countryCode);

  if (mobileNumber.length !== requiredLength) {
    alert(`Please enter a valid ${requiredLength}-digit mobile number`);
    return;
  }

  const l_oginName = document.getElementById("loginName").value.trim();
  const l_oginLocalName = document.getElementById("localName").value.trim();

  const data = {
    yo: mobileNumber,
    yc: countryCode,
    mp: otp,
    mn: l_oginName,
    mu: l_oginLocalName,
    eo: appOwner.eo,
    ec: appOwner.ec,
    xtra: typeof xtraj_payload !== "undefined" ? xtraj_payload : null,
  };

  try {
    const response = await fetch("https://my1.in/5z/k2.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // Always remove verification messages when verification completes (success or failure)
    removeVerificationMessages();

    if (result && result.su == 1 && result.uzr.mk.length > 10) {
      const userData = result.uzr;
      userData.fnf = result.fnf;
      userData.ffp = result.ffp;
      localStorage.setItem("my1uzr", JSON.stringify(userData));
      my1uzr = JSON.parse(localStorage.getItem("my1uzr"));
      payload0.mk = result.uzr.mk;

      nameOfLoggedInPage = `${my1uzr.mo}_${my1uzr.mc}_${appOwner.tn}_${payload0.fi}_${payload0.fk}_${appOwner.pg}`;
      localStorage.setItem(nameOfLoggedInPage, 1);

// Release wake lock on successful login
if (typeof releaseWakeLock === 'function') {
    releaseWakeLock();
}

      if (typeof function2runAfter_O_Login !== "undefined") {
       function2runAfter_O_Login(result);
      } else {
       alert("Login successful; refresh the page!");
      }
    }else{
        alert("Verification failed. Please try again;");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    // Remove verification messages on error too
    removeVerificationMessages();
    alert("Failed to verify OTP. Please try again.");
  }
}

// Generate HTML for the login modal
function set_innerHTML_of_shoLgnO() {
  return `
        <div class="container p-0">
            <div class="card">
                <div class="card-header text-center">
                    <h5 class="card-title mb-0">Login with <span id="otpTextToggle" style="cursor: pointer; padding: 2px 5px; border-radius: 3px; transition: all 0.3s;">OTP</span></h5>
                </div>
                <div class="card-body" style="background-color: #33FFCC;">
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

                    <div class="mb-3">
                        <div class="input-group">
                            <select id="loginCountryCode" class="form-select" style="max-width: 120px;"></select>
                            <div id="mobileLengthInfo" class="form-text ms-2"></div>
                            <div id="mobileDigitsContainer" class="d-flex gap-1 ms-2 flex-wrap"></div>
                        </div>
                        <div id="mobileError" class="invalid-feedback d-none">Please enter a valid mobile number</div>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="acceptTerms" style="background-color:lightgreen">
                        <label class="form-check-label" for="acceptTerms">
                            I agree to the <a href="#" class="text-primary">Terms & Conditions</a>
                        </label>
                    </div>

                    <button id="getOtpBtn" class="btn btn-primary w-100 position-relative">
                        <span id="getOtpText">Get OTP</span>
                        <span id="getOtpLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
                    </button>

                    <div id="otpSection" class="d-none mt-3">
                        <div class="mb-3">
                            <label for="otpInput" class="form-label">
                                Enter or Copy/Paste OTP (6 chars)
                                <small class="text-muted d-block" id="webOtpStatus">We'll try to auto-detect from SMS</small>
                            </label>
                            <div id="otpDigitsContainer" class="d-flex gap-1 justify-content-center"></div>
                        </div>
                        <div class="text-center mt-2">
                            <div id="resendContainer" class="d-none">
                                <span id="resendCountdown" class="text-muted"></span>
                            </div>
                            <button id="resendOtp" class="btn btn-outline-secondary btn-sm">Resend OTP</button>
                        </div>
                        <button id="verifyOtpBtn" class="btn btn-primary w-100 position-relative">
                            <span id="verifyOtpText">Verify OTP</span>
                            <span id="verifyOtpLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupOtpTextToggle() {
  const otpTextToggle = document.getElementById("otpTextToggle");
  if (otpTextToggle) {
    updateOtpTextAppearance();

    otpTextToggle.addEventListener("click", function () {
      if (isOtpSuppressed) {
        if (confirm("Do you want to enable OTP?")) {
          isOtpSuppressed = false;
          updateOtpTextAppearance();
        }
      } else {
        if (confirm("Do you want to disable OTP?")) {
          isOtpSuppressed = true;
          updateOtpTextAppearance();
        }
      }
    });
  }
}

function updateOtpTextAppearance() {
  const otpTextToggle = document.getElementById("otpTextToggle");
  if (otpTextToggle) {
    if (isOtpSuppressed) {
      otpTextToggle.textContent = "sending OTP disabled";
      otpTextToggle.style.backgroundColor = "red";
      otpTextToggle.style.color = "white";
    } else {
      otpTextToggle.textContent = "OTP";
      otpTextToggle.style.backgroundColor = "";
      otpTextToggle.style.color = "";
    }
  }
}

function createMobileDigitInputs(requiredLength) {
  const container = document.getElementById("mobileDigitsContainer");
  container.innerHTML = "";

  for (let i = 0; i < requiredLength; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "numeric";
    input.pattern = "[0-9]*";
    input.className = "form-control text-center";
    input.style.width = "40px";
    input.style.height = "40px";
    input.style.borderColor = "#6c757d";
    input.style.fontSize = "16px";
    input.style.color = "#000";
    input.style.backgroundColor = "#fff";
    input.dataset.index = i;
    input.addEventListener("input", handleMobileDigitInput);
    input.addEventListener("keydown", handleMobileDigitKeydown);
    input.addEventListener("paste", handleMobilePaste);
    input.addEventListener("focus", clearMobileDigitError);
    container.appendChild(input);
  }

  setTimeout(() => {
    const firstInput = container.querySelector("input");
    if (firstInput) firstInput.focus();
  }, 100);
}

// Create OTP digit inputs (6 alphanumeric characters)
function createOtpDigitInputs() {
  const container = document.getElementById("otpDigitsContainer");
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

    // Add autocomplete attribute to first input for WebOTP
    if (i === 0) {
      input.setAttribute("autocomplete", "one-time-code");
    }

    input.dataset.index = i;
    input.addEventListener("input", handleOtpDigitInput);
    input.addEventListener("keydown", handleOtpDigitKeydown);
    input.addEventListener("paste", handleOtpPaste);
    input.addEventListener("focus", clearOtpDigitError);
    container.appendChild(input);
  }

  setTimeout(() => {
    const firstInput = container.querySelector("input");
    if (firstInput) firstInput.focus();
  }, 100);
}

function addCustomStyles() {
  const style = document.createElement("style");
  style.textContent = `
        #mobileDigitsContainer input.form-control {
            border-color: #6c757d !important;
            font-size: 16px !important;
            color: #000 !important;
            background-color: #fff !important;
            padding: 0.375rem 0.25rem !important;
        }
        
        #mobileDigitsContainer input.form-control:focus {
            border-color: #495057 !important;
            box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25) !important;
            color: #000 !important;
            background-color: #fff !important;
        }
        
        #otpDigitsContainer input.form-control {
            border-color: #6c757d !important;
            font-size: 16px !important;
            color: #000 !important;
            background-color: #fff !important;
            padding: 0.375rem 0.25rem !important;
            text-transform: uppercase !important;
        }
        
        #otpDigitsContainer input.form-control:focus {
            border-color: #495057 !important;
            box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25) !important;
            color: #000 !important;
            background-color: #fff !important;
        }
        
        #mobileDigitsContainer input,
        #otpDigitsContainer input {
            -webkit-text-fill-color: #000 !important;
        }
        
        #fullScreenLoader {
            background-color: rgba(255, 255, 255, 0.9) !important;
            z-index: 10000 !important;
        }
        
        #autoVerifyProgress, #manualVerifyMsg {
            font-size: 0.875rem;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
#resendOtp:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

#resendOtp.btn-warning {
    background-color: #ffc107 !important;
    border-color: #ffc107 !important;
    color: #212529 !important;
}
        
        #audioErrorMsg {
            font-size: 0.875rem;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
        }
    `;
  document.head.appendChild(style);
}

function clearMobileDigitError(e) {
  const input = e.target;
  input.classList.remove("is-invalid");

  const mobileError = document.getElementById("mobileError");
  if (mobileError) {
    mobileError.classList.add("d-none");
  }
}

function clearOtpDigitError(e) {
  const input = e.target;
  input.classList.remove("is-invalid");
}

function handleMobileDigitInput(e) {
  const input = e.target;
  const index = parseInt(input.dataset.index);
  let value = input.value;

  value = value.replace(/\D/g, "");

  if (value.length > 1) {
    value = value.charAt(0);
  }

  input.value = value;

  input.classList.remove("is-invalid");

  if (value.length === 1) {
    const inputs = document.querySelectorAll("#mobileDigitsContainer input");
    if (index < inputs.length - 1) {
      setTimeout(() => {
        inputs[index + 1].focus();
      }, 50);
    }
  }
}

function handleOtpDigitInput(e) {
  const input = e.target;
  const index = parseInt(input.dataset.index);
  let value = input.value;

  value = value.replace(/[^a-zA-Z0-9]/g, "");

  if (value.length > 1) {
    value = value.charAt(0);
  }

  value = value.toUpperCase();
  input.value = value;

  input.classList.remove("is-invalid");

  if (value.length === 1) {
    const inputs = document.querySelectorAll("#otpDigitsContainer input");
    if (index < inputs.length - 1) {
      setTimeout(() => {
        inputs[index + 1].focus();
      }, 50);
    }
  }
}

function handleMobileDigitKeydown(e) {
  const input = e.target;
  const index = parseInt(input.dataset.index);
  const inputs = document.querySelectorAll("#mobileDigitsContainer input");

  if (e.key === "Backspace") {
    if (input.value === "" && index > 0) {
      setTimeout(() => {
        inputs[index - 1].focus();
        inputs[index - 1].value = "";
      }, 50);
    } else if (input.value !== "") {
      input.value = "";
    }
  } else if (e.key === "ArrowLeft" && index > 0) {
    setTimeout(() => {
      inputs[index - 1].focus();
    }, 50);
  } else if (e.key === "ArrowRight" && index < inputs.length - 1) {
    setTimeout(() => {
      inputs[index + 1].focus();
    }, 50);
  }
}

function handleOtpDigitKeydown(e) {
  const input = e.target;
  const index = parseInt(input.dataset.index);
  const inputs = document.querySelectorAll("#otpDigitsContainer input");

  if (e.key === "Backspace") {
    if (input.value === "" && index > 0) {
      setTimeout(() => {
        inputs[index - 1].focus();
        inputs[index - 1].value = "";
      }, 50);
    } else if (input.value !== "") {
      input.value = "";
    }
  } else if (e.key === "ArrowLeft" && index > 0) {
    setTimeout(() => {
      inputs[index - 1].focus();
    }, 50);
  } else if (e.key === "ArrowRight" && index < inputs.length - 1) {
    setTimeout(() => {
      inputs[index + 1].focus();
    }, 50);
  }
}

function handleMobilePaste(e) {
  e.preventDefault();
  const pastedData = e.clipboardData.getData("text");

  // Clean the pasted data - remove non-digit characters
  const cleanData = pastedData.replace(/\D/g, "");
  const digits = cleanData.split("");

  const inputs = document.querySelectorAll("#mobileDigitsContainer input");

  // Always start from first input regardless of where user pasted
  const startIndex = 0;

  // Clear all inputs first
  inputs.forEach((input) => (input.value = ""));

  // Fill all inputs starting from the first input
  for (let i = 0; i < digits.length && i < inputs.length; i++) {
    inputs[i].value = digits[i];
  }

  // Focus the next empty input or the last input if all are filled
  const nextEmptyIndex = Array.from(inputs).findIndex(
    (input) => input.value === ""
  );

  if (nextEmptyIndex !== -1) {
    setTimeout(() => {
      inputs[nextEmptyIndex].focus();
    }, 50);
  } else {
    setTimeout(() => {
      inputs[inputs.length - 1].focus();
    }, 50);
  }
}

function handleOtpPaste(e) {
  e.preventDefault();
  const pastedData = e.clipboardData.getData("text");

  // Clean the pasted data - remove non-alphanumeric characters and limit to 6 chars
  const cleanData = pastedData
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .substring(0, 6);
  const characters = cleanData.split("");

  const inputs = document.querySelectorAll("#otpDigitsContainer input");

  // Always start from first input regardless of where user pasted
  const startIndex = 0;

  // Clear all inputs first
  inputs.forEach((input) => (input.value = ""));

  // Fill all inputs starting from the first input
  for (let i = 0; i < characters.length && i < inputs.length; i++) {
    inputs[i].value = characters[i];
  }

  // Focus the next empty input or the last input if all are filled
  const nextEmptyIndex = Array.from(inputs).findIndex(
    (input) => input.value === ""
  );

  if (nextEmptyIndex !== -1) {
    setTimeout(() => {
      inputs[nextEmptyIndex].focus();
    }, 50);
  } else {
    setTimeout(() => {
      inputs[inputs.length - 1].focus();
    }, 50);
  }
}

function getMobileNumberFromDigits() {
  const inputs = document.querySelectorAll("#mobileDigitsContainer input");
  return Array.from(inputs)
    .map((input) => input.value)
    .join("");
}

function getOtpFromInputs() {
  const inputs = document.querySelectorAll("#otpDigitsContainer input");
  return Array.from(inputs)
    .map((input) => input.value)
    .join("");
}

// Main function to open the login modal
async function open_shoLgnO(...args) {
// Request wake lock when opening login modal
    if (typeof requestWakeLock === 'function') {
        await requestWakeLock();
    }



  id_of_dv_shoLgnO_to_set_processed_dom_object = "dv_to_set_open_shoLgnO_processed";//args[0];
  switch_shoLgnO_create_nw_modal = args[1] || 0;
  swtch_0nothing_1flex_2block_shoLgnO = args[2] || 0;
  swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn =
    args[3] || 0;

  if (isLoggedIn()) {
    if (
      swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === 2
    ) {
      showUserInfoModal();
    } else if (
      swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === 1
    ) {
      showLogoutOption();
    } else {
      showLogoutOption();
    }
    return;
  }

  let targetElement = document.getElementById(
    id_of_dv_shoLgnO_to_set_processed_dom_object
  );

  
    const modalResult = create_modal_dynamically(id_of_dv_shoLgnO_to_set_processed_dom_object);
    targetElement = modalResult.contentElement;
    
    // Store modal instance for later use
    window.currentLoginModal = modalResult;

    modalResult.modalElement.addEventListener("hidden.bs.modal", function () {
      restoreL3BodyStyles();
      // Release wake lock when modal closes
      if (typeof releaseWakeLock === 'function') {
          releaseWakeLock();
      }
    });

  targetElement.innerHTML = set_innerHTML_of_shoLgnO();

  if (swtch_0nothing_1flex_2block_shoLgnO === 1) {
    targetElement.style.display = "flex";
  } else if (swtch_0nothing_1flex_2block_shoLgnO === 2) {
    targetElement.style.display = "block";
  }

  const countryCodeSelect = document.getElementById("loginCountryCode");
  if (countryCodeSelect) {
    loadCountryCodes("loginCountryCode");
    setTimeout(() => {
      countryCodeSelect.value = "+91";
      updateMobileLengthInfo("loginCountryCode", "mobileLengthInfo");
    }, 100);
  }

  createOtpDigitInputs();

  setupL3EventListeners();

  
    saveBodyStyles();
    document.body.style.overflow = "hidden";
    window.currentLoginModal.modalInstance.show();

  setupOtpTextToggle();
}

function initLoginSystem() {
  addCustomStyles();

  const loginButton = document.getElementById("el_sho_login_modal");
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      if (isLoggedIn()) {
        showLogoutOption();
      } else {
        open_shoLgnO("tempLoginModal", 0, 0);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initLoginSystem();
});
