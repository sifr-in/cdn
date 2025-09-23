if (typeof nameOfLoggedInPage === 'undefined') {
    let nameOfLoggedInPage = '';
}
if (typeof originalBodyStyles === 'undefined') {
    let originalBodyStyles = '';
}

function isLoggedIn() {
    return typeof my1uzr !== 'undefined' && my1uzr != null && my1uzr.mk != null;
}

function showLogoutOption() {
    // Create modal backdrop
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.style.backgroundColor = 'white';
    modalContainer.style.borderRadius = '8px';
    modalContainer.style.padding = '20px';
    modalContainer.style.width = '300px';
    modalContainer.style.maxWidth = '90%';
    modalContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    modalContainer.style.position = 'relative';
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Logout';
    title.style.margin = '0 0 20px 0';
    title.style.textAlign = 'center';
    title.style.fontSize = '1.25rem';
    title.style.color = '#333';
    
    // Add message
    const message = document.createElement('p');
    message.textContent = 'Are you sure you want to logout?';
    message.style.margin = '0 0 20px 0';
    message.style.textAlign = 'center';
    message.style.color = '#555';
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.justifyContent = 'center';
    
    // Create Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.padding = '8px 16px';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.border = '1px solid #ccc';
    cancelBtn.style.backgroundColor = 'white';
    cancelBtn.style.color = 'black';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.flex = '1';
    
    // Create Logout button
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Logout';
    confirmBtn.style.padding = '8px 16px';
    confirmBtn.style.borderRadius = '4px';
    confirmBtn.style.border = 'none';
    confirmBtn.style.backgroundColor = '#e74c3c';
    confirmBtn.style.color = 'white';
    confirmBtn.style.cursor = 'pointer';
    confirmBtn.style.flex = '1';
    
    // Add hover effects
    cancelBtn.addEventListener('mouseover', () => {
        cancelBtn.style.backgroundColor = '#f5f5f5';
    });
    cancelBtn.addEventListener('mouseout', () => {
        cancelBtn.style.backgroundColor = 'white';
    });
    
    confirmBtn.addEventListener('mouseover', () => {
        confirmBtn.style.backgroundColor = '#c0392b';
    });
    confirmBtn.addEventListener('mouseout', () => {
        confirmBtn.style.backgroundColor = '#e74c3c';
    });
    
    // Add event listeners
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    confirmBtn.addEventListener('click', () => {
        my1uzr = null;
        localStorage.setItem('my1uzr', null);
        location.reload();
    });
    
    // Assemble the modal
    buttonContainer.appendChild(cancelBtn);
    if(appData && appData.normalLogotNotAlod){
        if(appData.normalLogotNotAlod !== 1){
            buttonContainer.appendChild(confirmBtn);
        }
    }else buttonContainer.appendChild(confirmBtn);
    
    modalContainer.appendChild(title);
    modalContainer.appendChild(message);
    modalContainer.appendChild(buttonContainer);
    
    modal.appendChild(modalContainer);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function createLoginByOModal() {
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
        <div class="l3-scroll-container">
            <div class="l3-form-container">
                <div class="l3-form-group">
                    <input type="text" id="loginName" class="l3-input" placeholder="Enter your name (min 2 chars)">
                    <p id="nameError" class="l3-error l3-hidden">Name must be at least 2 characters</p>
                </div>

                <div class="l3-form-group" style="display:none;">
                    <input type="text" id="localName" class="l3-input" placeholder="name in local language">
                    <p id="localNameError" class="l3-error l3-hidden">Name must be 2 characters local language, not eng.</p>
                </div>

                <div class="l3-form-group">
                    <label class="l3-label" for="loginMobile">Mobile Number</label>
                    <div class="l3-input-group">
                        <select id="loginCountryCode" class="l3-select">
                            <!-- Country codes will be loaded here -->
                        </select>
                        <input type="tel" id="loginMobile" class="l3-input" placeholder="Enter mobile number">
                    </div>
                    <p id="mobileLengthInfo" class="l3-hint"></p>
                    <p id="mobileError" class="l3-error l3-hidden">Please enter a valid mobile number</p>
                </div>

                <div class="l3-form-group l3-checkbox-group">
                    <input type="checkbox" id="acceptTerms" class="l3-checkbox">
                    <label for="acceptTerms" class="l3-checkbox-label">
                        I agree to the <a href="#" class="l3-link">Terms & Conditions</a>
                    </label>
                </div>

                <button id="getOtpBtn" class="l3-button l3-button-primary">
                    <span id="getOtpText">Get OTP</span>
                    <div id="getOtpLoader" class="l3-loader l3-hidden"></div>
                </button>

                <div id="otpSection" class="l3-hidden">
                    <div class="l3-form-group">
                        <label class="l3-label">Enter OTP (6 digits)</label>
                        <input type="text" id="otpInput" maxlength="6" class="l3-input" placeholder="Enter OTP">
                    </div>
                    <button id="verifyOtpBtn" class="l3-button l3-button-primary">
                        <span id="verifyOtpText">Verify OTP</span>
                        <div id="verifyOtpLoader" class="l3-loader l3-hidden"></div>
                    </button>
                    <div class="l3-text-center">
                        <button id="resendOtp" class="l3-link">Resend OTP</button>
                    </div>
                </div>

                <h3 class="l3-modal-title">Login with OTP</h3>
            </div>
        </div>
    `;
    
    modalBackdrop.appendChild(modalContent);
    document.body.appendChild(modalBackdrop);
    addModalStyles();
    
    // Load country codes
    const countryCodeSelect = document.getElementById('loginCountryCode');
    if (countryCodeSelect) {
        loadCountryCodes('loginCountryCode');
        setTimeout(() => {
            countryCodeSelect.value = '+91'; // Default to India
            updateMobileLengthInfo('loginCountryCode', 'mobileLengthInfo');
        }, 100);
    }
    
    // Setup event listeners
    setupL3EventListeners();
    
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            document.body.removeChild(modalBackdrop);
            restoreL3BodyStyles();
        }
    });
}

function saveBodyStyles() {
    originalBodyStyles = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        width: document.body.style.width
    };
}

function restoreL3BodyStyles() {
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
        color: black;
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
    
    .l3-modal-content {
        position: fixed;
        top: 55px;
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 90%;
        max-width: 28rem;
        max-height: 70vh;
        display: flex;
        flex-direction: column;
        padding: 0;
        overflow: hidden;
    }
    
    .l3-scroll-container {
        overflow-y: auto;
        flex: 1;
    }
    
    /* Form styles */
    .l3-form-container {
        padding: 1.5rem;
    }
    
    .l3-modal-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin-top: 1.5rem;
        text-align: center;
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
    
    .l3-input {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 0.5rem 0.75rem;
    }
    
    .l3-input:focus {
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
        position: relative;
    }
    
    .l3-button-primary {
        background-color: #3b82f6;
        color: white;
    }
    
    .l3-button-primary:hover {
        background-color: #2563eb;
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
    
    .l3-error {
        font-size: 0.75rem;
        color: #ef4444;
        margin-top: 0.25rem;
    }
    
    .l3-checkbox-group {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .l3-checkbox {
        margin-right: 0.5rem;
    }
    
    .l3-checkbox-label {
        font-size: 0.875rem;
        color: #374151;
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
    
    /* Loader styles */
    .l3-loader {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: l3-spin 1s ease-in-out infinite;
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
    }
    
    @keyframes l3-spin {
        to { transform: translateY(-50%) rotate(360deg); }
    }
    `;
    
    document.head.appendChild(style);
}

function setupL3EventListeners() {
    const loginName = document.getElementById('loginName');
    const localName = document.getElementById('localName');
    const loginMobile = document.getElementById('loginMobile');
    const countryCodeSelect = document.getElementById('loginCountryCode');
    const acceptTerms = document.getElementById('acceptTerms');
    const getOtpBtn = document.getElementById('getOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resendOtp = document.getElementById('resendOtp');
    
    // Name validation
    if (loginName) {
        loginName.addEventListener('blur', function() {
            const errorElement = document.getElementById('nameError');
            if (errorElement) {
                errorElement.classList.toggle('l3-hidden', this.value.length >= 2);
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
    
    // Mobile number validation
    if (loginMobile) {
        loginMobile.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Country code change
    if (countryCodeSelect) {
        countryCodeSelect.addEventListener('change', function() {
            updateMobileLengthInfo('loginCountryCode', 'mobileLengthInfo');
        });
    }
    
    // Get OTP button
    if (getOtpBtn) {
        getOtpBtn.addEventListener('click', async function() {
            const name = loginName.value.trim();
            const mobile = loginMobile.value.trim();
            const countryCode = countryCodeSelect.value;
            const requiredLength = getRequiredMobileLength(countryCode);
            
            if (name.length < 2) {
                document.getElementById('nameError').classList.remove('l3-hidden');
                return;
            }
            
            if (mobile.length !== requiredLength) {
                document.getElementById('mobileError').textContent = 
                    `Please enter a valid ${requiredLength}-digit mobile number`;
                document.getElementById('mobileError').classList.remove('l3-hidden');
                return;
            }
            
            if (!acceptTerms.checked) {
                alert('Please accept the Terms & Conditions');
                return;
            }
            
            // Show loader and disable button
            const getOtpText = document.getElementById('getOtpText');
            const getOtpLoader = document.getElementById('getOtpLoader');
            
            getOtpText.classList.add('l3-hidden');
            getOtpLoader.classList.remove('l3-hidden');
            getOtpBtn.disabled = true;
            
            try {
                const otpSent = await getOTP(countryCode, mobile);
                if (otpSent) {
                    document.getElementById('otpSection').classList.remove('l3-hidden');
                    getOtpBtn.classList.add('l3-hidden');
                }
            } catch (error) {
                console.error('Error sending OTP:', error);
                alert('Failed to send OTP. Please try again.');
            } finally {
                // Restore button state
                getOtpText.classList.remove('l3-hidden');
                getOtpLoader.classList.add('l3-hidden');
                getOtpBtn.disabled = false;
            }
        });
    }
    
    // Verify OTP button
    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', async function() {
            const otp = document.getElementById('otpInput').value;
            
            if (!otp || otp.length !== 6) {
                alert('Please enter a 6-digit OTP');
                return;
            }
            
            // Show loader and disable button
            const verifyOtpText = document.getElementById('verifyOtpText');
            const verifyOtpLoader = document.getElementById('verifyOtpLoader');
            
            verifyOtpText.classList.add('l3-hidden');
            verifyOtpLoader.classList.remove('l3-hidden');
            verifyOtpBtn.disabled = true;
            
            try {
                await verifyOTP(otp);
            } catch (error) {
                console.error('Error verifying OTP:', error);
                alert('Failed to verify OTP. Please try again.');
            } finally {
                // Restore button state
                verifyOtpText.classList.remove('l3-hidden');
                verifyOtpLoader.classList.add('l3-hidden');
                verifyOtpBtn.disabled = false;
            }
        });
    }
    
    // Resend OTP button
    if (resendOtp) {
        resendOtp.addEventListener('click', async function() {
            const mobile = document.getElementById('loginMobile').value.trim();
            const countryCode = document.getElementById('loginCountryCode').value;
            
            if (!mobile || !countryCode) {
                alert('Please enter mobile number first');
                return;
            }
            
            // Disable resend button temporarily
            resendOtp.disabled = true;
            resendOtp.textContent = 'Sending...';
            
            try {
                const otpSent = await getOTP(countryCode, mobile);
                if (otpSent) {
                    alert('OTP resent successfully');
                }
            } catch (error) {
                console.error('Error resending OTP:', error);
                alert('Failed to resend OTP. Please try again.');
            } finally {
                // Restore button after 30 seconds
                setTimeout(() => {
                    resendOtp.disabled = false;
                    resendOtp.textContent = 'Resend OTP';
                }, 30000);
            }
        });
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
        `<option value="${country.code}">${country.flag} ${country.code}</option>`
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

async function getOTP(countryCode, mobileNumber) {
    const requiredLength = getRequiredMobileLength(countryCode);
    
    if (mobileNumber.length !== requiredLength) {
        alert(`Please enter a valid ${requiredLength}-digit mobile number for ${countryCode}`);
        return false;
    }

    const data = { "yo": mobileNumber, "yc": countryCode };
    try {
        const response = await fetch("https://my1.in/5z/o.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.su == 1) {
            alert(`OTP sent to ${countryCode}${mobileNumber}`);
            return true;
        } else {
            alert(JSON.stringify(result));
            return false;
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again.');
        return false;
    }
}

async function verifyOTP(otp) {
    const countryCode = document.getElementById('loginCountryCode').value;
    const mobileNumber = document.getElementById('loginMobile').value.trim();
    const l_oginName = document.getElementById('loginName').value.trim();
    const l_oginLocalName = document.getElementById('localName').value.trim();

    const data = { 
        "yo": mobileNumber, 
        "yc": countryCode, 
        "mp": otp, 
        "mn": l_oginName, 
        "mu": l_oginLocalName, 
        "eo": appOwner.eo, 
        "ec": appOwner.ec
    };
    
    try {
        const response = await fetch("https://my1.in/5z/k.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result && result.su == 1 && result.uzr.mk.length > 10) {
            const userData = result.uzr;
            userData.fnf = result.fnf;
            userData.ffp = result.ffp;
            localStorage.setItem('my1uzr', JSON.stringify(userData));
            my1uzr = JSON.parse(localStorage.getItem('my1uzr'));
            payload0.mk = result.uzr.mk;

            nameOfLoggedInPage = `${my1uzr.mo}_${my1uzr.mc}_${appOwner.tn}_${payload0.fi}_${payload0.fk}_${appOwner.pg}`;
            localStorage.setItem(nameOfLoggedInPage, 1);

            if (typeof function2runAfterLogin !== 'undefined') {
                function2runAfterLogin();
            } else {
                alert("Login successful!");
            }
            location.reload();
        } else {
            alert(result.ms || "Invalid OTP. Please try again.");
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        alert('Failed to verify OTP. Please try again.');
    }
}

function initLoginSystem() {
    const loginButton = document.getElementById('el_sho_login_modal');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            if (isLoggedIn()) {
                showLogoutOption();
            } else {
                createLoginByOModal();
            }
        });
    }

}
