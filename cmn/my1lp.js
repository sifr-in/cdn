// Global variables
let nameOfLoggedInPage = "";
let originalBodyStyles = "";
let id_of_dv_shoLgnP_to_set_processed_dom_object;
let switch_shoLgnP_create_nw_modal;
let swtch_0nothing_1flex_2block_shoLgnP;
let swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn = 0;
let confirmMoNo = 1;
let isOtpSuppressed = false;

// Resend timer functionality
let resendTimer = null;
let resendTimeLeft = 0;

// Full screen loader element
let fullScreenLoader = null;

// Check if user is logged in
function isLoggedIn() {
 return typeof my1uzr !== 'undefined' && my1uzr != null && my1uzr.mk != null;
}

function showUserInfoModal() {
 if (!my1uzr) return;

 const { contentElement, modalInstance } = create_modal_dynamically('user_info');

 contentElement.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">User Information</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="text-center mb-4">
                <div class="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                    ${my1uzr.ml ?
   `<img src="${my1uzr.ml}" alt="Profile Picture" class="rounded-circle w-100 h-100" style="object-fit: cover;">` :
   '<i class="fas fa-user text-white" style="font-size: 2rem;"></i>'
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

 modalInstance.show();
}

// Show logout option modal
function showLogoutOption() {
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
function saveBodyStyles() {
 originalBodyStyles = {
  overflow: document.body.style.overflow,
  position: document.body.style.position,
  width: document.body.style.width
 };
}

// Restore body styles
function restoreL3BodyStyles() {
 document.body.style.overflow = originalBodyStyles.overflow || '';
 document.body.style.position = originalBodyStyles.position || '';
 document.body.style.width = originalBodyStyles.width || '';
}

// Function to show mobile confirmation modal
function showMobileConfirmationModal(countryCode, mobileNumber, callback) {
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
function showFullScreenLoader(message = 'Processing...') {
 fullScreenLoader = createDynamicLoader(message);
}

// Hide full screen loader
function hideFullScreenLoader() {
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
                <div class="card-header text-center">
                    <h5 class="card-title mb-0">Login with Password</h5>
                </div>
                <div class="card-body" style="background-color: #FFCCFF;">
                    <div class="mb-3">
                        <label for="loginMobile" class="form-label">Mobile Number</label>
                        <div class="input-group">
                            <select id="loginCountryCode" class="form-select" style="max-width: 120px;"></select>
                            <div id="mobileDigitsContainer" class="d-flex gap-1 ms-2 flex-wrap"></div>
                        </div>
                        <div id="mobileLengthInfo" class="form-text ms-2"></div>
                        <div id="mobileError" class="invalid-feedback d-none">Please enter a valid mobile number</div>
                    </div>

                    <div class="mb-3">
                        <label for="loginPassword" class="form-label">Password</label>
                        <input type="password" id="loginPassword" class="form-control" placeholder="Enter password (6-8 characters)">
                        <div id="passwordError" class="invalid-feedback d-none">Password must be 6-8 characters</div>
                    </div>

                    <button id="loginSubmit" class="btn btn-primary w-100 position-relative">
                        <span id="loginText">Login</span>
                        <span id="loginLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
                    </button>

                    <div class="text-center mt-3">
                        <a href="#" class="text-decoration-none" id="forgotPassword">Forgot password?</a>
                    </div>

                    <div class="text-center mt-3">
                        <hr>
                        <p class="text-muted mb-2">Don't have an account?</p>
                        <button id="switchToRegister" class="btn btn-outline-primary btn-sm">Register here</button>
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
                <div class="card-header text-center">
                    <h5 class="card-title mb-0">Register <span id="otpTextToggle" style="cursor: pointer; padding: 2px 5px; border-radius: 3px; transition: all 0.3s;">New</span> Account</h5>
                </div>
                <div class="card-body" style="background-color: #99FFFF;">
                    <div class="mb-3">
                        <label for="registerMobile" class="form-label">Mobile Number</label>
                        <div class="input-group">
                            <select id="registerCountryCode" class="form-select" style="max-width: 120px;"></select>
                            <div id="registerMobileDigitsContainer" class="d-flex gap-1 ms-2 flex-wrap"></div>
                        </div>
                        <div id="registerMobileLengthInfo" class="form-text ms-2"></div>
                        <div id="registerMobileError" class="invalid-feedback d-none">Please enter a valid mobile number</div>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="acceptTerms" style="background-color:lightgreen">
                        <label class="form-check-label" for="acceptTerms">
                            I agree to the <a href="#" class="text-primary">Terms & Conditions</a>
                        </label>
                    </div>

                    <button id="sendOtpBtn" class="btn btn-primary w-100 position-relative" disabled>
                        <span id="sendOtpText">Send OTP</span>
                        <span id="sendOtpLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
                    </button>

                    <div id="otpSection" class="d-none mt-3">
                        <div class="mb-3">
                            <label class="form-label">Enter OTP (6 digits)</label>
                            <div id="otpDigitsContainer" class="d-flex gap-1 justify-content-center"></div>
                        </div>
                        
                        <div class="text-center mt-2">
                            <div id="resendContainer" class="d-none">
                                <span id="resendCountdown" class="text-muted"></span>
                            </div>
                            <button id="resendOtp" class="btn btn-outline-secondary btn-sm">Resend OTP</button>
                        </div>

                        <button id="verifyOtpBtn" class="btn btn-primary w-100 mt-2 position-relative">
                            <span id="verifyOtpText">Verify OTP</span>
                            <span id="verifyOtpLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
                        </button>
                    </div>

                    <div id="registrationForm" class="d-none mt-3">
                        <div class="mb-3">
                            <label for="englishName" class="form-label">
                                Name in English 
                                <i class="fas fa-expand-alt ms-1 text-muted" id="expandLocalName" style="cursor: pointer; font-size: 0.8rem;" title="Add name in local language"></i>
                            </label>
                            <input type="text" id="englishName" class="form-control" placeholder="Enter your name in English (min 2 chars)">
                            <div id="englishNameError" class="invalid-feedback d-none">Name must be at least 2 characters and contain only English letters</div>
                        </div>

                        <div class="mb-3 d-none" id="localNameSection">
                            <label for="localName" class="form-label">Name in Local Language</label>
                            <input type="text" id="localName" class="form-control" placeholder="Name in local language (non-English characters only)">
                            <div id="localNameError" class="invalid-feedback d-none">Name must be in local language characters only, no English letters or numbers</div>
                        </div>

                        <div class="mb-3">
                            <label for="regPassword" class="form-label">Password (6-8 characters)</label>
                            <input type="password" id="regPassword" class="form-control" placeholder="Enter password">
                        </div>

                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label">Confirm Password</label>
                            <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm password">
                            <div id="confirmPasswordError" class="invalid-feedback d-none">Passwords do not match</div>
                        </div>

                        <button id="completeRegistration" class="btn btn-primary w-100 position-relative">
                            <span id="completeRegText">Complete Registration</span>
                            <span id="completeRegLoader" class="spinner-border spinner-border-sm d-none position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);"></span>
                        </button>
                    </div>

                    <div class="text-center mt-3">
                        <hr>
                        <p class="text-muted mb-2">Already have an account?</p>
                        <button id="switchToLogin" class="btn btn-outline-secondary btn-sm">Login here</button>
                    </div>
                </div>
            </div>
        </div>
    `;
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

 if (isLoggedIn()) {
  if (swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === 2) {
   showUserInfoModal();
  } else if (swtch_2shoInfoInsteadOfLogot_1shoLogout_0shoYouAreAlreadyLoggedIn === 1) {
   showLogoutOption();
  } else {
   showLogoutOption();
  }
  return;
 }

 const { contentElement, modalInstance, modalElement } = create_modal_dynamically('loginPasswordModal');

 // Set initial content to login form
 contentElement.innerHTML = set_innerHTML_of_shoLgnP();

 // Add event listener for when modal is hidden to restore body styles and release wake lock
 modalElement.addEventListener('hidden.bs.modal', function () {
  restoreL3BodyStyles();
  // Release wake lock when modal closes
  if (typeof releaseWakeLock === 'function') {
   releaseWakeLock();
  }
 });

 modalInstance.show();

 // Initialize login form
 initializeLoginForm(contentElement);

 // Setup event listeners for switching between login and register
 setupFormSwitching(contentElement, modalInstance);
}

function initializeLoginForm(container) {
 const countryCodeSelect = container.querySelector('#loginCountryCode');
 if (countryCodeSelect) {
  loadCountryCodes('loginCountryCode');
  setTimeout(() => {
   countryCodeSelect.value = '+91';
   updateMobileLengthInfo('loginCountryCode', 'mobileLengthInfo');
   createMobileDigitInputs('mobileDigitsContainer', getRequiredMobileLength('+91'));
  }, 100);
 }

 setupLoginEventListeners(container);
}

function initializeRegisterForm(container) {
 const countryCodeSelect = container.querySelector('#registerCountryCode');
 if (countryCodeSelect) {
  loadCountryCodes('registerCountryCode');
  setTimeout(() => {
   countryCodeSelect.value = '+91';
   updateMobileLengthInfo('registerCountryCode', 'registerMobileLengthInfo');
   createMobileDigitInputs('registerMobileDigitsContainer', getRequiredMobileLength('+91'));
  }, 100);
 }

 createOtpDigitInputs();
 setupRegisterEventListeners(container);
}

function setupFormSwitching(container, modalInstance) {
 const switchToRegister = container.querySelector('#switchToRegister');
 const switchToLogin = container.querySelector('#switchToLogin');

 if (switchToRegister) {
  switchToRegister.addEventListener('click', () => {
   container.innerHTML = set_innerHTML_of_register();
   initializeRegisterForm(container);
  });
 }

 if (switchToLogin) {
  // This will be added after switching to register form
  setTimeout(() => {
   const switchToLoginBtn = container.querySelector('#switchToLogin');
   if (switchToLoginBtn) {
    switchToLoginBtn.addEventListener('click', () => {
     container.innerHTML = set_innerHTML_of_shoLgnP();
     initializeLoginForm(container);
     setupFormSwitching(container, modalInstance);
    });
   }
  }, 100);
 }
}

function setupLoginEventListeners(container) {
 const loginSubmit = container.querySelector('#loginSubmit');
 const loginPassword = container.querySelector('#loginPassword');
 const countryCodeSelect = container.querySelector('#loginCountryCode');
 const forgotPassword = container.querySelector('#forgotPassword');

 if (countryCodeSelect) {
  countryCodeSelect.addEventListener('change', function () {
   updateMobileLengthInfo('loginCountryCode', 'mobileLengthInfo');
   const requiredLength = getRequiredMobileLength(this.value);
   createMobileDigitInputs('mobileDigitsContainer', requiredLength);
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
   alert('Please contact support to reset your password.');
  });
 }
}

function setupRegisterEventListeners(container) {
 const acceptTerms = container.querySelector('#acceptTerms');
 const sendOtpBtn = container.querySelector('#sendOtpBtn');
 const verifyOtpBtn = container.querySelector('#verifyOtpBtn');
 const resendOtp = container.querySelector('#resendOtp');
 const completeRegistration = container.querySelector('#completeRegistration');
 const englishName = container.querySelector('#englishName');
 const localName = container.querySelector('#localName');
 const expandLocalName = container.querySelector('#expandLocalName');
 const localNameSection = container.querySelector('#localNameSection');
 const regPassword = container.querySelector('#regPassword');
 const confirmPassword = container.querySelector('#confirmPassword');
 const countryCodeSelect = container.querySelector('#registerCountryCode');

 if (countryCodeSelect) {
  countryCodeSelect.addEventListener('change', function () {
   updateMobileLengthInfo('registerCountryCode', 'registerMobileLengthInfo');
   const requiredLength = getRequiredMobileLength(this.value);
   createMobileDigitInputs('registerMobileDigitsContainer', requiredLength);
  });
 }

 if (acceptTerms && sendOtpBtn) {
  acceptTerms.addEventListener('change', function () {
   sendOtpBtn.disabled = !this.checked;
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

 if (expandLocalName && localNameSection) {
  expandLocalName.addEventListener('click', function () {
   if (localNameSection.classList.contains('d-none')) {
    localNameSection.classList.remove('d-none');
    this.classList.remove('fa-expand-alt');
    this.classList.add('fa-compress-alt');
    this.title = 'Hide local language name';
   } else {
    localNameSection.classList.add('d-none');
    this.classList.remove('fa-compress-alt');
    this.classList.add('fa-expand-alt');
    this.title = 'Add name in local language';
   }
  });
 }

 if (englishName) {
  englishName.addEventListener('blur', function () {
   const errorElement = container.querySelector('#englishNameError');
   if (errorElement) {
    if (this.value.length >= 2 && /^[A-Za-z\s]+$/.test(this.value)) {
     errorElement.classList.add('d-none');
     this.classList.remove('is-invalid');
    } else {
     errorElement.classList.remove('d-none');
     this.classList.add('is-invalid');
    }
   }
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
 setupOtpTextToggle(container);
}

// OTP text toggle function for registration
function setupOtpTextToggle(container) {
 const otpTextToggle = container.querySelector('#otpTextToggle');
 if (otpTextToggle) {
  updateOtpTextAppearance(otpTextToggle);

  otpTextToggle.addEventListener('click', function () {
   if (isOtpSuppressed) {
    if (confirm('Do you want to enable OTP for registration?')) {
     isOtpSuppressed = false;
     updateOtpTextAppearance(otpTextToggle);
    }
   } else {
    if (confirm('Do you want to disable OTP for registration?')) {
     isOtpSuppressed = true;
     updateOtpTextAppearance(otpTextToggle);
    }
   }
  });
 }
}

function updateOtpTextAppearance(otpTextToggle) {
 if (otpTextToggle) {
  if (isOtpSuppressed) {
   otpTextToggle.textContent = 'sending OTP disabled';
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
 const countryCode = container.querySelector('#loginCountryCode').value;
 const mobileNumber = getMobileNumberFromDigits('mobileDigitsContainer');
 const password = container.querySelector('#loginPassword').value;
 const requiredLength = getRequiredMobileLength(countryCode);

 const mobileError = container.querySelector('#mobileError');
 mobileError.classList.add('d-none');

 const inputs = container.querySelectorAll('#mobileDigitsContainer input');
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

 showFullScreenLoader('Logging in...');

 try {
  await performLogin(countryCode, mobileNumber, password);
 } catch (error) {
  console.error('Login error:', error);
  alert('Login failed. Please try again.');
 } finally {
  loginText.classList.remove('d-none');
  loginLoader.classList.add('d-none');
  loginSubmit.disabled = false;
  hideFullScreenLoader();
 }
}

async function handleSendOtp(container) {
 const countryCode = container.querySelector('#registerCountryCode').value;
 const mobileNumber = getMobileNumberFromDigits('registerMobileDigitsContainer');
 const requiredLength = getRequiredMobileLength(countryCode);

 const mobileError = container.querySelector('#registerMobileError');
 mobileError.classList.add('d-none');

 const inputs = container.querySelectorAll('#registerMobileDigitsContainer input');
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

 const sendOtpText = container.querySelector('#sendOtpText');
 const sendOtpLoader = container.querySelector('#sendOtpLoader');
 const sendOtpBtn = container.querySelector('#sendOtpBtn');

 sendOtpText.classList.add('d-none');
 sendOtpLoader.classList.remove('d-none');
 sendOtpBtn.disabled = true;

 try {
  if (confirmMoNo === 1) {
   showMobileConfirmationModal(countryCode, mobileNumber, async (isConfirmed) => {
    if (isConfirmed) {
     await sendOtpRequest(countryCode, mobileNumber, container);
    } else {
     sendOtpText.classList.remove('d-none');
     sendOtpLoader.classList.add('d-none');
     sendOtpBtn.disabled = false;
     hideFullScreenLoader();
    }
   });
  } else {
   await sendOtpRequest(countryCode, mobileNumber, container);
  }
 } catch (error) {
  console.error('Send OTP error:', error);
  alert('Failed to send OTP. Please try again.');
  sendOtpText.classList.remove('d-none');
  sendOtpLoader.classList.add('d-none');
  sendOtpBtn.disabled = false;
  hideFullScreenLoader();
 }
}

async function sendOtpRequest(countryCode, mobileNumber, container) {
 try {
  showFullScreenLoader('Sending OTP...');
  const otpSent = await getOTP(countryCode, mobileNumber);
  if (otpSent.success) {
   container.querySelector('#otpSection').classList.remove('d-none');
   container.querySelector('#sendOtpBtn').classList.add('d-none');

   if (otpSent.waitTime) {
    startResendTimer(otpSent.waitTime, container);
   }
  }
 } finally {
  const sendOtpText = container.querySelector('#sendOtpText');
  const sendOtpLoader = container.querySelector('#sendOtpLoader');
  const sendOtpBtn = container.querySelector('#sendOtpBtn');

  sendOtpText.classList.remove('d-none');
  sendOtpLoader.classList.add('d-none');
  sendOtpBtn.disabled = false;
  hideFullScreenLoader();
 }
}

async function handleVerifyOtp(container) {
 const otp = getOtpFromInputs();

 if (otp.length !== 6) {
  alert('Please enter a valid 6-digit OTP');
  return;
 }

 const verifyOtpText = container.querySelector('#verifyOtpText');
 const verifyOtpLoader = container.querySelector('#verifyOtpLoader');
 const verifyOtpBtn = container.querySelector('#verifyOtpBtn');

 verifyOtpText.classList.add('d-none');
 verifyOtpLoader.classList.remove('d-none');
 verifyOtpBtn.disabled = true;

 showFullScreenLoader('Verifying OTP...');

 try {
  const countryCode = container.querySelector('#registerCountryCode').value;
  const mobileNumber = getMobileNumberFromDigits('registerMobileDigitsContainer');

  const success = await verifyOTP(countryCode, mobileNumber, otp);
  if (success) {
   container.querySelector('#otpSection').classList.add('d-none');
   container.querySelector('#registrationForm').classList.remove('d-none');
  } else {
   alert('Invalid OTP. Please try again.');
  }
 } catch (error) {
  console.error('Verify OTP error:', error);
  alert('Failed to verify OTP. Please try again.');
 } finally {
  verifyOtpText.classList.remove('d-none');
  verifyOtpLoader.classList.add('d-none');
  verifyOtpBtn.disabled = false;
  hideFullScreenLoader();
 }
}

async function handleResendOtp(container) {
 const countryCode = container.querySelector('#registerCountryCode').value;
 const mobileNumber = getMobileNumberFromDigits('registerMobileDigitsContainer');
 const requiredLength = getRequiredMobileLength(countryCode);

 const inputs = container.querySelectorAll('#registerMobileDigitsContainer input');
 inputs.forEach(input => input.classList.remove('is-invalid'));

 let allDigitsFilled = true;
 inputs.forEach(input => {
  if (input.value === '') {
   input.classList.add('is-invalid');
   allDigitsFilled = false;
  }
 });

 if (!allDigitsFilled) {
  alert('Please enter complete mobile number first');
  return;
 }

 if (mobileNumber.length !== requiredLength) {
  alert('Please enter a valid mobile number');
  return;
 }

 const resendOtp = container.querySelector('#resendOtp');
 resendOtp.disabled = true;

 showFullScreenLoader('Resending OTP...');

 try {
  if (confirmMoNo === 1) {
   showMobileConfirmationModal(countryCode, mobileNumber, async (isConfirmed) => {
    if (isConfirmed) {
     await resendOtpRequest(countryCode, mobileNumber, container);
    } else {
     resendOtp.disabled = false;
     hideFullScreenLoader();
    }
   });
  } else {
   await resendOtpRequest(countryCode, mobileNumber, container);
  }
 } catch (error) {
  console.error('Resend OTP error:', error);
  alert('Please try again.');
  resendOtp.disabled = false;
  hideFullScreenLoader();
 }
}

async function resendOtpRequest(countryCode, mobileNumber, container) {
 try {
  const otpSent = await getOTP(countryCode, mobileNumber);
  if (otpSent.success) {
   alert('OTP resent successfully');

   if (otpSent.waitTime) {
    startResendTimer(otpSent.waitTime, container);
   }
  }
 } finally {
  hideFullScreenLoader();
 }
}

async function handleCompleteRegistration(container) {
 const password = container.querySelector('#regPassword').value;
 const confirmPassword = container.querySelector('#confirmPassword').value;
 const englishName = container.querySelector('#englishName').value.trim();

 if (englishName.length < 2) {
  alert('Name must be at least 2 characters');
  return;
 }

 if (password.length < 6 || password.length > 8) {
  alert('Password must be between 6 and 8 characters');
  return;
 }

 if (password !== confirmPassword) {
  alert('Passwords do not match');
  return;
 }

 const completeRegText = container.querySelector('#completeRegText');
 const completeRegLoader = container.querySelector('#completeRegLoader');
 const completeRegistration = container.querySelector('#completeRegistration');

 completeRegText.classList.add('d-none');
 completeRegLoader.classList.remove('d-none');
 completeRegistration.disabled = true;

 showFullScreenLoader('Completing registration...');

 try {
  const countryCode = container.querySelector('#registerCountryCode').value;
  const mobileNumber = getMobileNumberFromDigits('registerMobileDigitsContainer');
  const localName = container.querySelector('#localName').value.trim();
  const otp = getOtpFromInputs();

  await performRegistration(countryCode, mobileNumber, englishName, localName, otp, password);
 } catch (error) {
  console.error('Registration error:', error);
  alert('Registration failed. Please try again.');
 } finally {
  completeRegText.classList.remove('d-none');
  completeRegLoader.classList.add('d-none');
  completeRegistration.disabled = false;
  hideFullScreenLoader();
 }
}

// Mobile digit input functions
function createMobileDigitInputs(containerId, requiredLength) {
 const container = document.getElementById(containerId);
 if (!container) return;

 container.innerHTML = '';

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
  input.addEventListener('input', handleMobileDigitInput);
  input.addEventListener('keydown', handleMobileDigitKeydown);
  input.addEventListener('paste', handleMobilePaste);
  input.addEventListener('focus', clearMobileDigitError);
  container.appendChild(input);
 }

 setTimeout(() => {
  const firstInput = container.querySelector('input');
  if (firstInput) firstInput.focus();
 }, 100);
}

function createOtpDigitInputs() {
 const container = document.getElementById('otpDigitsContainer');
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
  input.addEventListener('input', handleOtpDigitInput);
  input.addEventListener('keydown', handleOtpDigitKeydown);
  input.addEventListener('paste', handleOtpPaste);
  input.addEventListener('focus', clearOtpDigitError);
  container.appendChild(input);
 }

 setTimeout(() => {
  const firstInput = container.querySelector('input');
  if (firstInput) firstInput.focus();
 }, 100);
}

// Input handling functions
function handleMobileDigitInput(e) {
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
   }, 50);
  }
 }
}

function handleOtpDigitInput(e) {
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
  const inputs = document.querySelectorAll('#otpDigitsContainer input');
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
 const container = input.closest('[id$="DigitsContainer"]');
 const inputs = container.querySelectorAll('input');

 if (e.key === 'Backspace') {
  if (input.value === '' && index > 0) {
   setTimeout(() => {
    inputs[index - 1].focus();
    inputs[index - 1].value = '';
   }, 50);
  } else if (input.value !== '') {
   input.value = '';
  }
 } else if (e.key === 'ArrowLeft' && index > 0) {
  setTimeout(() => {
   inputs[index - 1].focus();
  }, 50);
 } else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
  setTimeout(() => {
   inputs[index + 1].focus();
  }, 50);
 }
}

function handleOtpDigitKeydown(e) {
 const input = e.target;
 const index = parseInt(input.dataset.index);
 const inputs = document.querySelectorAll('#otpDigitsContainer input');

 if (e.key === 'Backspace') {
  if (input.value === '' && index > 0) {
   setTimeout(() => {
    inputs[index - 1].focus();
    inputs[index - 1].value = '';
   }, 50);
  } else if (input.value !== '') {
   input.value = '';
  }
 } else if (e.key === 'ArrowLeft' && index > 0) {
  setTimeout(() => {
   inputs[index - 1].focus();
  }, 50);
 } else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
  setTimeout(() => {
   inputs[index + 1].focus();
  }, 50);
 }
}

function handleMobilePaste(e) {
 e.preventDefault();
 const pastedData = e.clipboardData.getData('text');
 const cleanData = pastedData.replace(/\D/g, '');
 const digits = cleanData.split('');

 const container = e.target.closest('[id$="DigitsContainer"]');
 const inputs = container.querySelectorAll('input');

 inputs.forEach(input => input.value = '');

 for (let i = 0; i < digits.length && i < inputs.length; i++) {
  inputs[i].value = digits[i];
 }

 const nextEmptyIndex = Array.from(inputs).findIndex(input => input.value === '');
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
 const pastedData = e.clipboardData.getData('text');
 const cleanData = pastedData.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6);
 const characters = cleanData.split('');

 const inputs = document.querySelectorAll('#otpDigitsContainer input');
 inputs.forEach(input => input.value = '');

 for (let i = 0; i < characters.length && i < inputs.length; i++) {
  inputs[i].value = characters[i];
 }

 const nextEmptyIndex = Array.from(inputs).findIndex(input => input.value === '');
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

function clearMobileDigitError(e) {
 const input = e.target;
 input.classList.remove('is-invalid');
 const container = input.closest('[id$="DigitsContainer"]');
 const errorId = container.id === 'mobileDigitsContainer' ? 'mobileError' : 'registerMobileError';
 const errorElement = document.getElementById(errorId);
 if (errorElement) {
  errorElement.classList.add('d-none');
 }
}

function clearOtpDigitError(e) {
 const input = e.target;
 input.classList.remove('is-invalid');
}

function getMobileNumberFromDigits(containerId) {
 const container = document.getElementById(containerId);
 if (!container) return '';
 const inputs = container.querySelectorAll('input');
 return Array.from(inputs).map(input => input.value).join('');
}

function getOtpFromInputs() {
 const inputs = document.querySelectorAll('#otpDigitsContainer input');
 return Array.from(inputs).map(input => input.value).join('');
}

// Resend timer functionality
function startResendTimer(waitTime, container) {
 const resendOtp = container.querySelector('#resendOtp');
 const resendContainer = container.querySelector('#resendContainer');

 if (!resendContainer || !resendOtp) return;

 if (resendTimer) {
  clearInterval(resendTimer);
 }

 resendTimeLeft = waitTime;

 resendOtp.disabled = true;
 resendOtp.classList.add('d-none');
 resendContainer.classList.remove('d-none');

 updateResendCountdown(container);

 resendTimer = setInterval(() => {
  resendTimeLeft--;
  updateResendCountdown(container);

  if (resendTimeLeft <= 0) {
   clearInterval(resendTimer);
   resendTimer = null;

   resendContainer.classList.add('d-none');
   resendOtp.classList.remove('d-none');
   resendOtp.disabled = false;
   resendOtp.classList.add('btn-warning');
  }
 }, 1000);
}

function updateResendCountdown(container) {
 const resendCountdown = container.querySelector('#resendCountdown');
 if (resendCountdown) {
  resendCountdown.textContent = `Resend OTP in ${resendTimeLeft} seconds`;
 }
}

// API functions
async function getOTP(countryCode, mobileNumber) {
 const requiredLength = getRequiredMobileLength(countryCode);

 if (mobileNumber.length !== requiredLength) {
  alert(`Please enter a valid ${requiredLength}-digit mobile number for ${countryCode}`);
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
   alert(JSON.stringify(result));
   return { success: false };
  }
 } catch (error) {
  console.error('Error sending OTP:', error);
  alert('Failed to send OTP. Please try again.');
  return { success: false };
 }
}

async function verifyOTP(countryCode, mobileNumber, otp) {
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
   return true;
  } else {
   alert(JSON.stringify(result));
   return false;
  }
 } catch (error) {
  console.error('Error verifying OTP:', error);
  alert('Failed to verify OTP. Please try again.');
  return false;
 }
}

async function performRegistration(countryCode, mobileNumber, englishName, localName, otp, password) {
 const data = {
  yo: mobileNumber,
  yc: countryCode,
  mn: englishName,
  mu: localName,
  mp: otp,
  pw: password
 };

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
   alert("You are registered. Please login with this password.");
   location.reload();
  } else {
   alert(JSON.stringify(result));
  }
 } catch (error) {
  console.error('Registration error:', error);
  alert('Registration failed. Please try again.');
 }
}

async function performLogin(countryCode, mobileNumber, password) {
 if (appOwner != null && appOwner.eo != null && appOwner.ec != null) {
  const data = {
   yc: countryCode,
   yo: mobileNumber,
   pw: password,
   eo: appOwner.eo,
   ec: appOwner.ec
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
        const userData = result.uzr;
        userData.fnf = result.fnf;
        userData.ffp = result.ffp;
        localStorage.setItem('my1uzr', JSON.stringify(userData));
        my1uzr = JSON.parse(localStorage.getItem('my1uzr'));
        payload0.mk = result.uzr.mk;

        nameOfLoggedInPage = `${my1uzr.mo}_${my1uzr.mc}_${appOwner.tn}_${payload0.fi}_${payload0.fk}_${appOwner.pg}`;
        localStorage.setItem(nameOfLoggedInPage, 1);

        // Release wake lock on successful login
        if (typeof releaseWakeLock === 'function') {
         releaseWakeLock();
        }

        if (typeof function2runAfter_P_Login !== 'undefined') {
         function2runAfter_P_Login(result);
        } else {
         alert("Login successful!");
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginPasswordModal'));
        if (modal) {
         modal.hide();
        }
       } else {
        alert(result.ms);
       }
      } else {
       alert(result.ms);
      }
     } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
     }
    } else {
     alert("Password must be minimum 6 characters");
    }
   } else {
    alert("Mobile number is invalid");
   }
  } else {
   alert("Mobile number must be 10 digits");
  }
 } else {
  alert("Please open the link of the entity you are working for");
 }
}

// Utility functions
function loadCountryCodes(selectId) {
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

function updateMobileLengthInfo(selectId, lengthInfoId) {
 const countryCode = document.getElementById(selectId)?.value;
 const requiredLength = getRequiredMobileLength(countryCode);
 const lengthInfoElement = document.getElementById(lengthInfoId);
 if (lengthInfoElement) {
  lengthInfoElement.textContent = `${requiredLength} digits required`;
 }
}

function getRequiredMobileLength(countryCode) {
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
function initLoginSystem() {
 const loginButton = document.getElementById('el_sho_login_modal');
 if (loginButton) {
  loginButton.addEventListener('click', function () {
   if (isLoggedIn()) {
    showLogoutOption();
   } else {
    open_shoLgnP([]);
   }
  });
 }
}

document.addEventListener('DOMContentLoaded', function () {
 initLoginSystem();
});

// Add custom styles
function addCustomStyles() {
 const style = document.createElement('style');
 style.textContent = `
        [id$="DigitsContainer"] input.form-control {
            border-color: #6c757d !important;
            font-size: 16px !important;
            color: #000 !important;
            background-color: #fff !important;
            padding: 0.375rem 0.25rem !important;
        }
        
        [id$="DigitsContainer"] input.form-control:focus {
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
        
        [id$="DigitsContainer"] input,
        #otpDigitsContainer input {
            -webkit-text-fill-color: #000 !important;
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
    `;
 document.head.appendChild(style);
}

// Initialize custom styles
addCustomStyles();
