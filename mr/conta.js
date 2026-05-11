function set_conta_us_innerHTML(...args) {
 // Get the data from args (first argument is the data object)
 const data = args[0] || {};

 // Create unique class for scoping
 const uniqueClass = 'contus-scope-' + Date.now();

 // Check if modal exists, create if not
 let modalId = 'conta_us';
 let modalResult;

 if (!document.getElementById(modalId)) {
  modalResult = create_modal_dynamically(modalId);
  modalResult.modalElement.classList.add(uniqueClass);
 } else {
  const existingModal = document.getElementById(modalId);
  existingModal.classList.add(uniqueClass);
  const modalBody = existingModal.querySelector('.modal-body');
  modalResult = {
   contentElement: modalBody,
   modalElement: existingModal,
   modalInstance: bootstrap.Modal.getInstance(existingModal) || new bootstrap.Modal(existingModal)
  };
 }

 // Add scoped CSS
 const styleId = `${uniqueClass}-styles`;
 if (!document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
            .${uniqueClass} .modal-dialog {
                max-width: 600px;
            }
            
            .${uniqueClass} .modal-content {
                border: none;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 30px 60px -15px rgba(111, 24, 77, 0.3);
                border: 1px solid rgba(111, 24, 77, 0.1);
            }
            
            .${uniqueClass} .modal-header {
                background: linear-gradient(135deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
                color: white;
                padding: 1.35rem 1.75rem;
                border-bottom: none;
                position: relative;
            }
            
            .${uniqueClass} .modal-header::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                right: 0;
                height: 10px;
                background: linear-gradient(90deg, var(--accent-color, #FFB300), transparent);
                border-radius: 0 0 10px 10px;
            }
            
            .${uniqueClass} .modal-title {
                font-weight: 700;
                letter-spacing: 0.5px;
                font-size: 1.4rem;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .${uniqueClass} .modal-title i {
                color: var(--accent-color, #FFB300);
                filter: drop-shadow(0 2px 5px rgba(0,0,0,0.2));
            }
            
            .${uniqueClass} .btn-back {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                border-radius: 50px;
                padding: 0.5rem 1.35rem;
                font-weight: 600;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                margin-right: 15px;
                backdrop-filter: blur(5px);
            }
            
            .${uniqueClass} .btn-back:hover {
                background: rgba(255, 255, 255, 0.35);
                transform: translateX(-5px);
                border-color: rgba(255, 255, 255, 0.5);
            }
            
            .${uniqueClass} .btn-back i {
                font-size: 0.85rem;
            }
            
            .${uniqueClass} .modal-body {
                padding: 0px !important;
                background: linear-gradient(135deg, #ffffff 0%, #faf5f9 100%);
            }
            
            .${uniqueClass} .company-info-card {
                background: linear-gradient(135deg, rgba(111, 24, 77, 0.03), rgba(0, 191, 165, 0.03));
                border-radius: 16px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                border: 1px solid rgba(111, 24, 77, 0.1);
                box-shadow: 0 6px 15px rgba(111, 24, 77, 0.05);
                position: relative;
                overflow: hidden;
            }
            
            .${uniqueClass} .company-info-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 6px;
                height: 100%;
                background: linear-gradient(135deg, var(--primary-color, #6f184d), var(--accent-color, #FFB300));
                border-radius: 6px 0 0 6px;
            }
            
            .${uniqueClass} .company-name {
                font-size: 1.4rem;
                font-weight: 800;
                color: var(--primary-color, #6f184d);
                margin-bottom: 0.5rem;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            
            .${uniqueClass} .company-tagline {
                font-size: 1rem;
                color: var(--primary-dark, #4d1035);
                font-style: italic;
                margin-bottom: 1.25rem;
                padding-bottom: 1rem;
                border-bottom: 2px dashed rgba(111, 24, 77, 0.2);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .${uniqueClass} .company-tagline i {
                color: #ff4d4d;
            }
            
            .${uniqueClass} .company-contact-details {
                display: flex;
                flex-wrap: wrap;
                gap: 1.25rem;
            }
            
            .${uniqueClass} .contact-item {
                display: flex;
                align-items: center;
                gap: 10px;
                background: white;
                padding: 0.6rem 1.2rem;
                border-radius: 50px;
                box-shadow: 0 4px 10px rgba(111, 24, 77, 0.08);
                border: 1px solid rgba(111, 24, 77, 0.1);
                transition: all 0.3s ease;
            }
            
            .${uniqueClass} .contact-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(111, 24, 77, 0.15);
                border-color: var(--primary-color, #6f184d);
            }
            
            .${uniqueClass} .contact-item i {
                color: var(--primary-color, #6f184d);
                font-size: 1.1rem;
                width: 20px;
                text-align: center;
            }
            
            .${uniqueClass} .contact-item span {
                font-weight: 600;
                color: #333;
                font-size: 0.95rem;
            }
            
            .${uniqueClass} .contact-item .contact-value {
                color: var(--secondary-color, #00BFA5);
                font-weight: 700;
            }
            
            .${uniqueClass} .form-title {
                font-size: 1.2rem;
                font-weight: 700;
                color: var(--primary-dark, #4d1035);
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 12px;
                padding-bottom: 0.75rem;
                border-bottom: 3px solid rgba(111, 24, 77, 0.2);
            }
            
            .${uniqueClass} .form-title i {
                color: var(--accent-color, #FFB300);
                background: rgba(111, 24, 77, 0.1);
                padding: 8px;
                border-radius: 50%;
            }
            
            .${uniqueClass} .contact-form {
                background: white;
                border-radius: 16px;
                padding: 1.75rem;
                box-shadow: 0 8px 25px rgba(111, 24, 77, 0.08);
            }
            
            .${uniqueClass} .form-group {
                margin-bottom: 1.5rem;
            }
            
            .${uniqueClass} .form-group label {
                font-weight: 600;
                color: #555;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 0.5rem;
            }
            
            .${uniqueClass} .form-group label i {
                color: var(--primary-color, #6f184d);
                width: 18px;
            }
            
            .${uniqueClass} .form-group label .required-star {
                color: #dc3545;
                margin-left: 4px;
            }
            
            .${uniqueClass} .form-control {
                border: 2px solid #f0e6ed;
                border-radius: 12px;
                padding: 0.8rem 1.2rem;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                background: #fff;
                box-shadow: inset 0 2px 5px rgba(0,0,0,0.02);
            }
            
            .${uniqueClass} .form-control:focus {
                border-color: var(--primary-color, #6f184d);
                box-shadow: 0 0 0 4px rgba(111, 24, 77, 0.1);
                background: white;
            }
            
            .${uniqueClass} .form-control::placeholder {
                color: #bbb;
                font-size: 0.9rem;
                font-style: italic;
            }
            
            .${uniqueClass} textarea.form-control {
                resize: vertical;
                min-height: 120px;
            }
            
            .${uniqueClass} .btn-submit {
                background: linear-gradient(135deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
                border: none;
                color: white;
                border-radius: 50px;
                padding: 0.9rem 2rem;
                font-weight: 700;
                font-size: 1rem;
                letter-spacing: 1px;
                transition: all 0.3s ease;
                box-shadow: 0 8px 20px rgba(111, 24, 77, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                width: 100%;
                margin-top: 1rem;
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            .${uniqueClass} .btn-submit:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 30px rgba(111, 24, 77, 0.4);
                background: linear-gradient(135deg, var(--primary-dark, #4d1035), var(--primary-color, #6f184d));
            }
            
            .${uniqueClass} .btn-submit:active {
                transform: translateY(0);
            }
            
            .${uniqueClass} .btn-submit i {
                font-size: 1.1rem;
                transition: transform 0.3s ease;
            }
            
            .${uniqueClass} .btn-submit:hover i {
                transform: translateX(5px);
            }
            
            .${uniqueClass} .form-footer-text {
                text-align: center;
                margin-top: 1.25rem;
                color: #777;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .${uniqueClass} .form-footer-text i {
                color: var(--accent-color, #FFB300);
                font-size: 0.7rem;
            }
            
            .${uniqueClass} .validation-feedback {
                font-size: 0.8rem;
                margin-top: 0.4rem;
                color: #dc3545;
                display: none;
            }
            
            @media (max-width: 576px) {
                .${uniqueClass} .modal-body {
                    padding: 1.5rem;
                }
                
                .${uniqueClass} .company-contact-details {
                    flex-direction: column;
                }
                
                .${uniqueClass} .contact-item {
                    width: 100%;
                }
                
                .${uniqueClass} .modal-header {
                    padding: 1rem;
                }
                
                .${uniqueClass} .modal-title {
                    font-size: 1.2rem;
                }
            }
        `;
  document.head.appendChild(style);
 }

 // Format data for display
 const formatBusinessName = (str) => {
  if (!str) return 'ABC Matrimonial Services';
  return str.split(' ')
   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
   .join(' ');
 };

 const formatCity = (str) => {
  if (!str) return 'Kolhapur';
  return str.charAt(0).toUpperCase() + str.slice(1);
 };

 const formatTagline = (str) => {
  if (!str) return 'aapke saath, behtar saath ke liye';
  return str.split(' ')
   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
   .join(' ');
 };

 const businessName = formatBusinessName(data.business || 'abc matrimonial services');
 const city = formatCity(data.city || 'kolhapur');
 const tagline = formatTagline(data.tagline || 'aapke saath, behtar saath ke liye');
 const mail = data.mail || 'contact@abcmatrimony.com';
 const mob = data.mob || '+91 98765 43210';

 // Generate unique IDs for form fields
 const nameInputId = `contus_name_${Date.now()}`;
 const emailInputId = `contus_email_${Date.now()}`;
 const messageInputId = `contus_message_${Date.now()}`;
 const submitBtnId = `contus_submit_${Date.now()}`;

 // Build the modal content
 const modalContent = `
        <div class="modal-header d-flex align-items-center">
            <button type="button" class="btn-back" onclick="handleUniversalBackButton()">
                <i class="fas fa-arrow-left"></i> Back
            </button>
            <h5 class="modal-title">
                <i class="fas fa-envelope"></i> Contact Us
            </h5>
        </div>
        <div class="modal-body">
            <!-- Company Information Card -->
            <div class="company-info-card">
                <div class="company-name">${businessName}</div>
                <div class="company-tagline">
                    <i class="fas fa-heart"></i> "${tagline}"
                </div>
                
                <div class="company-contact-details">
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Based in:</span>
                        <span class="contact-value">${city}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>Email:</span>
                        <span class="contact-value">${mail}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone-alt"></i>
                        <span>Mobile:</span>
                        <span class="contact-value">${mob}</span>
                    </div>
                </div>
            </div>
            
            <!-- Contact Form -->
            
            <div class="contact-form">
            <div class="form-title">
                <i class="fas fa-paper-plane"></i> Send us a message
            </div>
                <form id="contactForm_${uniqueClass}" onsubmit="event.preventDefault(); handleContactSubmit('${uniqueClass}')">
                    <!-- Name Field -->
                    <div class="form-group">
                        <label>
                            <i class="fas fa-user"></i> Full Name
                            <span class="required-star">*</span>
                        </label>
                        <input type="text" 
                               class="form-control" 
                               id="${nameInputId}"
                               placeholder="Enter your full name" 
                               required
                               autocomplete="name">
                        <div class="validation-feedback" id="name_feedback_${uniqueClass}"></div>
                    </div>
                    
                    <!-- Email Field -->
                    <div class="form-group">
                        <label>
                            <i class="fas fa-at"></i> Email Address
                            <span class="required-star">*</span>
                        </label>
                        <input type="email" 
                               class="form-control" 
                               id="${emailInputId}"
                               placeholder="Enter your email address" 
                               required
                               autocomplete="email">
                        <div class="validation-feedback" id="email_feedback_${uniqueClass}"></div>
                    </div>
                    
                    <!-- Message Field -->
                    <div class="form-group">
                        <label>
                            <i class="fas fa-comment-dots"></i> Message
                            <span class="required-star">*</span>
                        </label>
                        <textarea class="form-control" 
                                  id="${messageInputId}"
                                  placeholder="Type your message here..." 
                                  required
                                  rows="5"></textarea>
                        <div class="validation-feedback" id="message_feedback_${uniqueClass}"></div>
                    </div>
                    
                    <!-- Submit Button -->
                    <button type="submit" class="btn-submit" id="${submitBtnId}">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                    
                    <div class="form-footer-text">
                        <i class="fas fa-shield-alt"></i>
                        Your information is secure with us
                    </div>
                </form>
            </div>
        </div>
    `;

 // Set the content
 modalResult.contentElement.innerHTML = modalContent;

 // Store the original data in the modal for future updates
 modalResult.modalElement.setAttribute('data-contact-data', JSON.stringify(data));

 // Add form submission handler to window for global access
 window.handleContactSubmit = async function (scopedClass) {
  const form = document.querySelector(`.${scopedClass} #contactForm_${scopedClass}`);
  const nameInput = document.querySelector(`.${scopedClass} #${nameInputId}`);
  const emailInput = document.querySelector(`.${scopedClass} #${emailInputId}`);
  const messageInput = document.querySelector(`.${scopedClass} #${messageInputId}`);
  const submitBtn = document.querySelector(`.${scopedClass} #${submitBtnId}`);

  // Reset validation feedback
  document.querySelectorAll(`.${scopedClass} .validation-feedback`).forEach(el => el.style.display = 'none');

  let isValid = true;

  // Validate Name
  if (!nameInput.value.trim()) {
   showValidationError(`.${scopedClass} #name_feedback_${scopedClass}`, 'Please enter your name');
   isValid = false;
  } else if (nameInput.value.trim().length < 2) {
   showValidationError(`.${scopedClass} #name_feedback_${scopedClass}`, 'Name must be at least 2 characters');
   isValid = false;
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.trim()) {
   showValidationError(`.${scopedClass} #email_feedback_${scopedClass}`, 'Please enter your email address');
   isValid = false;
  } else if (!emailRegex.test(emailInput.value.trim())) {
   showValidationError(`.${scopedClass} #email_feedback_${scopedClass}`, 'Please enter a valid email address');
   isValid = false;
  }

  // Validate Message
  if (!messageInput.value.trim()) {
   showValidationError(`.${scopedClass} #message_feedback_${scopedClass}`, 'Please enter your message');
   isValid = false;
  } else if (messageInput.value.trim().length < 10) {
   showValidationError(`.${scopedClass} #message_feedback_${scopedClass}`, 'Message must be at least 10 characters');
   isValid = false;
  }

  if (isValid) {
   // Disable submit button to prevent double submission
   submitBtn.disabled = true;
   submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

   // Prepare form data
   const formData = new FormData();
   formData.append('nm', nameInput.value.trim());
   formData.append('nu', emailInput.value.trim());
   formData.append('ms', messageInput.value.trim());

   try {
    // Make API call to your PHP endpoint 
    const response = await fetch(data.emailEndPoint, {
     method: 'POST',
     body: formData
    });

    const responseText = await response.text();

    if (response.ok) {
     // Show success message
     if (typeof showToast === 'function') {
      showToast('Message sent successfully! We\'ll get back to you soon.', {
       type: 'success',
       duration: 5000,
       position: 'top'
      });
     } else {
      alert('Message sent successfully!');
     }

     // Clear form
     nameInput.value = '';
     emailInput.value = '';
     messageInput.value = '';

     // Close modal after 2 seconds
     setTimeout(() => {
      const modal = document.getElementById('conta_us');
      if (modal) {
       const bsModal = bootstrap.Modal.getInstance(modal);
       if (bsModal) bsModal.hide();
      }
     }, 2000);
    } else {
     throw new Error(responseText || 'Failed to send message');
    }
   } catch (error) {
    console.error('Contact form error:', error);
    if (typeof showToast === 'function') {
     showToast('Failed to send message. Please try again later.', {
      type: 'error',
      duration: 5000,
      position: 'top'
     });
    } else {
     alert('Failed to send message. Please try again later.');
    }
   } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
   }
  }
 };

 // Helper function to show validation error
 function showValidationError(selector, message) {
  const feedbackEl = document.querySelector(selector);
  if (feedbackEl) {
   feedbackEl.textContent = message;
   feedbackEl.style.display = 'block';
  }
 }

 // Show the modal
 modalResult.modalInstance.show();

 // Add to modal stack if not already there
 if (!modalStack.includes(modalId)) {
  modalStack.push(modalId);
 }

 // Focus on name input when modal is shown
 modalResult.modalElement.addEventListener('shown.bs.modal', function () {
  const nameInput = document.querySelector(`.${uniqueClass} #${nameInputId}`);
  if (nameInput) {
   nameInput.focus();
  }
 }, { once: true });

 console.log(`Contact Us modal displayed for ${businessName}`);

 return modalResult;
}

// Add a helper function to update the modal with new company data
function update_conta_us_data(newData) {
 const modal = document.getElementById('conta_us');
 if (modal) {
  set_conta_us_innerHTML(newData);
 } else {
  console.warn('Contact Us modal not found, creating new one');
  set_conta_us_innerHTML(newData);
 }
}

// Add a helper function to get current contact data from the modal
function get_conta_us_data() {
 const modal = document.getElementById('conta_us');
 if (modal) {
  const dataAttr = modal.getAttribute('data-contact-data');
  if (dataAttr) {
   return JSON.parse(dataAttr);
  }
 }
 return null;
}

// Add a helper function to pre-fill the contact form
function prefill_conta_us_form(formData) {
 const modal = document.getElementById('conta_us');
 if (!modal) {
  console.warn('Contact Us modal not found');
  return false;
 }

 const uniqueClass = Array.from(modal.classList).find(cls => cls.startsWith('contus-scope-'));
 if (uniqueClass) {
  const nameInput = modal.querySelector(`.${uniqueClass} input[placeholder*="full name"]`);
  const emailInput = modal.querySelector(`.${uniqueClass} input[type="email"]`);
  const messageInput = modal.querySelector(`.${uniqueClass} textarea`);

  if (formData.name && nameInput) nameInput.value = formData.name;
  if (formData.email && emailInput) emailInput.value = formData.email;
  if (formData.message && messageInput) messageInput.value = formData.message;

  return true;
 }

 return false;
}