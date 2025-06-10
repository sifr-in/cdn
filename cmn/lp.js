// l3.js - Robust Login/Registration Modal
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('el_sho_login_modal');
    
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            if (isLoggedIn()) {
                showLogoutOption();
            } else {
                createLoginModal();
            }
        });
    }
});

function isLoggedIn() {
    return typeof my1uzr !== 'undefined' && my1uzr != null && my1uzr.mk != null;
}

function showLogoutOption() {
    const modal = document.createElement('div');
    modal.className = 'l3-modal-backdrop';
    modal.innerHTML = `
        <div class="l3-modal-container">
            <h3 class="l3-modal-title">Logout</h3>
            <p class="l3-modal-text">Are you sure you want to logout?</p>
            <div class="l3-button-group">
                <button id="logoutCancel" class="l3-button l3-button-secondary">Cancel</button>
                <button id="logoutConfirm" class="l3-button l3-button-danger">Logout</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    addModalStyles();
    
    const cancelBtn = document.getElementById('logoutCancel');
    const confirmBtn = document.getElementById('logoutConfirm');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            restoreBodyStyles();
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            my1uzr = null;
            localStorage.setItem('my1uzr', null);
            location.reload();
        });
    }
}

function createLoginModal() {
    saveBodyStyles();
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '90%';
    
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'l3-modal-backdrop';
    modalBackdrop.id = 'loginModalBackdrop';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'l3-modal-content';
    
    modalContent.innerHTML = `
        <div class="l3-tab-container">
            <div class="l3-tab-header">
                <button id="loginTab" class="l3-tab-button l3-tab-active">Login</button>
                <button id="registerTab" class="l3-tab-button">Register</button>
            </div>
        </div>
        
        <div class="l3-scroll-container">
            <!-- Login Form -->
            <div id="loginForm" class="l3-form-container">
                <div class="l3-form-group">
                    <label class="l3-label" for="loginMobile">Mobile Number</label>
                    <div class="l3-input-group">
                        <select id="loginCountryCode" class="l3-select">
                            <!-- Country codes will be loaded here -->
                        </select>
                        <input type="tel" id="loginMobile" class="l3-input" placeholder="Enter mobile number">
                    </div>
                    <p id="loginMobileLength" class="l3-hint"></p>
                </div>
                <div class="l3-form-group">
                    <label class="l3-label" for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" class="l3-input" placeholder="Enter password">
                </div>
                <button id="loginSubmit" class="l3-button l3-button-primary">Login</button>
                <div class="l3-text-center">
                    <a href="#" class="l3-link">Forgot password?</a>
                </div>
            </div>
            
            <!-- Register Form -->
            <div id="registerForm" class="l3-form-container l3-hidden">
                <div class="l3-form-group">
                    <label class="l3-label" for="registerMobile">Mobile Number</label>
                    <div class="l3-input-group">
                        <select id="registerCountryCode" class="l3-select">
                            <!-- Country codes will be loaded here -->
                        </select>
                        <input type="tel" id="registerMobile" class="l3-input" placeholder="Enter mobile number">
                    </div>
                    <p id="registerMobileLength" class="l3-hint"></p>
                </div>
                <div class="l3-form-group l3-checkbox-group">
                    <input type="checkbox" id="acceptTerms" class="l3-checkbox">
                    <label for="acceptTerms" class="l3-checkbox-label">
                        I agree to the <a href="#" class="l3-link">Terms & Conditions</a>
                    </label>
                </div>
                <button id="sendOtpBtn" disabled class="l3-button l3-button-disabled">Send OTP</button>
                
                <!-- OTP Verification -->
                <div id="otpSection" class="l3-hidden">
                    <div class="l3-form-group">
                        <label class="l3-label">Enter OTP (6 digits)</label>
                        <input type="text" id="otpInput" maxlength="6" class="l3-input" placeholder="Enter OTP">
                    </div>
                    <button id="verifyOtpBtn" class="l3-button l3-button-primary">Verify OTP</button>
                    <div class="l3-text-center">
                        <button id="resendOtp" class="l3-link">Resend OTP</button>
                    </div>
                </div>
                
                <!-- Registration Form -->
                <div id="registrationForm" class="l3-hidden">
                    <div class="l3-form-group">
                        <label class="l3-label" for="englishName">Name in English</label>
                        <input type="text" id="englishName" class="l3-input" placeholder="Enter your name in English">
                        <p id="englishNameError" class="l3-error l3-hidden">Only ASCII characters allowed, no numbers</p>
                    </div>
                    <div class="l3-form-group">
                        <label class="l3-label" for="localName">Name in Local Language</label>
                        <input type="text" id="localName" class="l3-input" placeholder="Enter your name in local language">
                        <p id="localNameError" class="l3-error l3-hidden">Only local language characters allowed, no English or numbers</p>
                    </div>
                    <div class="l3-form-group">
                        <label class="l3-label" for="regPassword">Password (6-8 characters)</label>
                        <input type="password" id="regPassword" class="l3-input" placeholder="Enter password">
                    </div>
                    <div class="l3-form-group">
                        <label class="l3-label" for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" class="l3-input" placeholder="Confirm password">
                        <p id="passwordError" class="l3-error l3-hidden">Passwords do not match</p>
                    </div>
                    <button id="completeRegistration" class="l3-button l3-button-primary">Complete Registration</button>
                </div>
            </div>
        </div>
    `;
    
    modalBackdrop.appendChild(modalContent);
    document.body.appendChild(modalBackdrop);
    addModalStyles();
    
    // Load country codes with null checks
    const loginCountryCode = document.getElementById('loginCountryCode');
    const registerCountryCode = document.getElementById('registerCountryCode');
    
    if (loginCountryCode) loadCountryCodes('loginCountryCode');
    if (registerCountryCode) loadCountryCodes('registerCountryCode');
    
    // Set default country code with null checks
    setTimeout(() => {
        if (loginCountryCode) loginCountryCode.value = '+91';
        if (registerCountryCode) registerCountryCode.value = '+91';
        updateMobileLengthInfo('loginCountryCode', 'loginMobileLength');
        updateMobileLengthInfo('registerCountryCode', 'registerMobileLength');
    }, 100);
    
    // Setup event listeners with null checks
    setupTabSwitching();
    
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            document.body.removeChild(modalBackdrop);
            restoreBodyStyles();
        }
    });
    
    setupEventListeners();
}

// Helper functions
let originalBodyStyles = {};

function saveBodyStyles() {
    originalBodyStyles = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        width: document.body.style.width
    };
}

function restoreBodyStyles() {
    document.body.style.overflow = originalBodyStyles.overflow || '';
    document.body.style.position = originalBodyStyles.position || '';
    document.body.style.width = originalBodyStyles.width || '';
}

function addModalStyles() {
    if (document.getElementById('l3-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'l3-modal-styles';
    style.textContent = `
    /* Base modal styles */
    .l3-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    
    .l3-modal-container, .l3-modal-content {
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 28rem;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
    }
    
    .l3-modal-content {
        padding: 0;
        overflow: hidden;
    }
    
    .l3-scroll-container {
        overflow-y: auto;
        flex: 1;
    }
    
    /* Tab styles */
    .l3-tab-header {
        display: flex;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .l3-tab-button {
        flex: 1;
        padding: 1rem 1.5rem;
        text-align: center;
        font-weight: 500;
        color: #6b7280;
        background: none;
        border: none;
        cursor: pointer;
    }
    
    .l3-tab-active {
        color: #3b82f6;
        border-bottom: 2px solid #3b82f6;
    }
    
    /* Form styles */
    .l3-form-container {
        padding: 1.5rem;
    }
    
    .l3-form-group {
        margin-bottom: 1rem;
    }
    
    .l3-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.5rem;
    }
    
    .l3-input-group {
        display: flex;
    }
    
    .l3-select {
        width: 6rem;
        border: 1px solid #d1d5db;
        border-right: none;
        border-radius: 0.375rem 0 0 0.375rem;
        padding: 0.5rem;
        background-color: #f9fafb;
    }
    
    .l3-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 0 0.375rem 0.375rem 0;
        padding: 0.5rem 0.75rem;
    }
    
    .l3-input:focus, .l3-select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 1px #3b82f6;
    }
    
    /* Button styles */
    .l3-button {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 500;
        cursor: pointer;
        border: none;
        width: 100%;
        margin-top: 0.5rem;
    }
    
    .l3-button-primary {
        background-color: #3b82f6;
        color: white;
    }
    
    .l3-button-primary:hover {
        background-color: #2563eb;
    }
    
    .l3-button-secondary {
        background-color: white;
        color: #374151;
        border: 1px solid #d1d5db;
    }
    
    .l3-button-secondary:hover {
        background-color: #f9fafb;
    }
    
    .l3-button-danger {
        background-color: #ef4444;
        color: white;
    }
    
    .l3-button-danger:hover {
        background-color: #dc2626;
    }
    
    .l3-button-disabled {
        background-color: #d1d5db;
        color: #6b7280;
        cursor: not-allowed;
    }
    
    /* Utility classes */
    .l3-hidden {
        display: none !important;
    }
    
    .l3-text-center {
        text-align: center;
    }
    
    .l3-link {
        color: #3b82f6;
        text-decoration: none;
        font-size: 0.875rem;
    }
    
    .l3-link:hover {
        text-decoration: underline;
    }
    
    .l3-hint {
        font-size: 0.75rem;
        color: #6b7280;
        margin-top: 0.25rem;
    }
    
    .l3-error {
        font-size: 0.75rem;
        color: #ef4444;
        margin-top: 0.25rem;
    }
    
    .l3-checkbox-group {
        display: flex;
        align-items: center;
    }
    
    .l3-checkbox {
        margin-right: 0.5rem;
    }
    
    .l3-checkbox-label {
        font-size: 0.875rem;
        color: #374151;
    }
    
    .l3-button-group {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
    }
    
    /* Scrollbar styling */
    .l3-scroll-container::-webkit-scrollbar {
        width: 6px;
    }
    
    .l3-scroll-container::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    .l3-scroll-container::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
    }
    
    .l3-scroll-container::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
    }
    `;
    
    document.head.appendChild(style);
}

function setupTabSwitching() {
    document.getElementById('loginTab').addEventListener('click', () => {
        document.getElementById('loginTab').classList.add('l3-tab-active');
        document.getElementById('registerTab').classList.remove('l3-tab-active');
        document.getElementById('loginForm').classList.remove('l3-hidden');
        document.getElementById('registerForm').classList.add('l3-hidden');
    });
    
    document.getElementById('registerTab').addEventListener('click', () => {
        document.getElementById('registerTab').classList.add('l3-tab-active');
        document.getElementById('loginTab').classList.remove('l3-tab-active');
        document.getElementById('registerForm').classList.remove('l3-hidden');
        document.getElementById('loginForm').classList.add('l3-hidden');
    });
}

function setupEventListeners() {
    // Login form elements
    const loginMobile = document.getElementById('loginMobile');
    const loginCountryCode = document.getElementById('loginCountryCode');
    const loginSubmit = document.getElementById('loginSubmit');
    
    // Register form elements
    const registerMobile = document.getElementById('registerMobile');
    const registerCountryCode = document.getElementById('registerCountryCode');
    const acceptTerms = document.getElementById('acceptTerms');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resendOtp = document.getElementById('resendOtp');
    const englishName = document.getElementById('englishName');
    const localName = document.getElementById('localName');
    const confirmPassword = document.getElementById('confirmPassword');
    const completeRegistration = document.getElementById('completeRegistration');
    
    // Add event listeners only if elements exist
    if (loginMobile) {
        loginMobile.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    if (registerMobile) {
        registerMobile.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    if (loginCountryCode) {
        loginCountryCode.addEventListener('change', function() {
            updateMobileLengthInfo('loginCountryCode', 'loginMobileLength');
        });
    }
    
    if (registerCountryCode) {
        registerCountryCode.addEventListener('change', function() {
            updateMobileLengthInfo('registerCountryCode', 'registerMobileLength');
        });
    }
    
    if (acceptTerms && sendOtpBtn) {
        acceptTerms.addEventListener('change', function() {
            sendOtpBtn.disabled = !this.checked;
            sendOtpBtn.classList.toggle('l3-button-disabled', !this.checked);
            sendOtpBtn.classList.toggle('l3-button-primary', this.checked);
        });
    }
    
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', function() {
            if (getOTP()) {
                document.getElementById('otpSection')?.classList.remove('l3-hidden');
                this.classList.add('l3-hidden');
            }
        });
    }
    
    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', function() {
            const otp = document.getElementById('otpInput')?.value;
            
            if (!otp || otp.length !== 6) {
                alert('Please enter a 6-digit OTP');
                return;
            }
            
            if (verifyOTP(otp)) {
                document.getElementById('otpSection')?.classList.add('l3-hidden');
                document.getElementById('registrationForm')?.classList.remove('l3-hidden');
            } else {
                alert('Invalid OTP. Please try again.');
            }
        });
    }
    
    if (resendOtp) {
        resendOtp.addEventListener('click', function() {
            if (getOTP()) {
                alert('OTP resent successfully');
            }
        });
    }
    
    if (englishName) {
        englishName.addEventListener('blur', function() {
            const errorElement = document.getElementById('englishNameError');
            if (errorElement) {
                errorElement.classList.toggle('l3-hidden', !/[^A-Za-z\s]/.test(this.value));
            }
        });
    }
    
    if (localName) {
        localName.addEventListener('blur', function() {
            const errorElement = document.getElementById('localNameError');
            if (errorElement) {
                errorElement.classList.toggle('l3-hidden', !(/[A-Za-z]/.test(this.value) || /[0-9]/.test(this.value)));
            }
        });
    }
    
    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            const password = document.getElementById('regPassword')?.value;
            const errorElement = document.getElementById('passwordError');
            if (errorElement) {
                errorElement.classList.toggle('l3-hidden', 
                    password === this.value || this.value.length === 0
                );
            }
        });
    }
    
    if (completeRegistration) {
        completeRegistration.addEventListener('click', completeRegistration);
    }
    
    if (loginSubmit) {
        loginSubmit.addEventListener('click', loginSubmit);
    }
}

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
    selectElement.innerHTML = countryCodes.map(country => 
        `<option value="${country.code}">${country.flag} ${country.code} (${country.name})</option>`
    ).join('');
}

function updateMobileLengthInfo(selectId, lengthInfoId) {
    const countryCode = document.getElementById(selectId).value;
    const requiredLength = getRequiredMobileLength(countryCode);
    document.getElementById(lengthInfoId).textContent = `${requiredLength} digits required`;
}

function getRequiredMobileLength(countryCode) {
    const lengthMap = {
        '+1': 10, '+44': 10, '+91': 10, '+86': 11, '+81': 10,
        '+33': 9, '+49': 10, '+7': 10, '+55': 11, '+61': 9
    };
    return lengthMap[countryCode] || 10;
}

function getOTP() {
    const countryCode = document.getElementById('registerCountryCode').value;
    const mobileNumber = document.getElementById('registerMobile').value.trim();
    const requiredLength = getRequiredMobileLength(countryCode);
    
    if (mobileNumber.length !== requiredLength) {
        alert(`Please enter a valid ${requiredLength}-digit mobile number for ${countryCode}`);
        return false;
    }

    const data = { "yo": mobileNumber, "yc": countryCode };
    const response = JSON.parse(postCall_Json("https://my1.in/5z/o.php", data));
    
    if (response.su == 1) {
        alert(`OTP sent to ${countryCode}${mobileNumber}`);
        return true;
    } else {
        alert(JSON.stringify(response));
        return false;
    }
}

function verifyOTP(otp) {
    const countryCode = document.getElementById('registerCountryCode').value;
    const mobileNumber = document.getElementById('registerMobile').value.trim();

    const data = { "yo": mobileNumber, "yc": countryCode, "mp": otp };
    const response = JSON.parse(postCall_Json("https://my1.in/5z/v.php", data, 0, false));
    
    if (response.su == 1) {
        return true;
    } else {
        alert(JSON.stringify(response));
        return false;
    }
}

function completeRegistration() {
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password.length < 6 || password.length > 8) {
        alert('Password must be between 6 and 8 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const countryCode = document.getElementById('registerCountryCode').value;
    const mobileNumber = document.getElementById('registerMobile').value.trim();
    const englishName = document.getElementById('englishName').value.trim();
    const localName = document.getElementById('localName').value.trim();
    const otp = document.getElementById('otpInput').value;

    const data = { 
        "yo": mobileNumber, 
        "yc": countryCode, 
        "mn": englishName, 
        "mu": localName, 
        "mp": otp, 
        "pw": confirmPassword 
    };
    
    const response = JSON.parse(postCall_Json("https://my1.in/5z/s.php", data, 0, false));
    
    if (response.su == 1) {
        alert("You are registered. Please login with this password.");
        location.reload();
    } else {
        alert(JSON.stringify(response));
    }
}

function loginSubmit() {
    const countryCode = document.getElementById('loginCountryCode').value;
    const mobileNumber = document.getElementById('loginMobile').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const requiredLength = getRequiredMobileLength(countryCode);
    if (mobileNumber.length !== requiredLength) {
        alert(`Please enter a valid ${requiredLength}-digit mobile number for ${countryCode}`);
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    if (appOwner != null && appOwner.eo != null && appOwner.ec != null) {
        const data = { 
            "yc": countryCode, 
            "yo": mobileNumber, 
            "pw": password, 
            "eo": appOwner.eo, 
            "ec": appOwner.ec 
        };
        
        if (data.yo != null && data.yo.length == 10) {
            if (validateMobileNumber(data.yo)) {
                if (data.pw != null && data.pw.length > 5) {
                    const response = JSON.parse(postCall_Json("https://my1.in/5z/g.php", data, 0, false));
                    
                    if (response.su == 1) {
                        if (response.uzr.mk.length > 10) {
                            const userData = response.uzr;
                            userData.fn_f = response.fn_f;
                            userData.fn_v = response.fn_v;
                            localStorage.setItem('my1uzr', JSON.stringify(userData));
                            my1uzr = JSON.parse(localStorage.getItem('my1uzr'));
                            payload0.mk = response.uzr.mk;
                            
                            const nameOfLoggedInPage = `${my1uzr.mo}_${my1uzr.mc}_${appOwner.tn}_${payload0.fi}_${payload0.fk}_${appOwner.pg}`;
                            localStorage.setItem(nameOfLoggedInPage, 1);
                            
                            if (typeof function2runAfterLogin !== 'undefined') {
                                function2runAfterLogin();
                            } else {
                                alert("Login successful!");
                            }
                            location.reload();
                        } else {
                            alert(response.ms);
                        }
                    } else {
                        alert(response.ms);
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