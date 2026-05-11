function set_privcy_polc_innerHTML(...args) {
 // Get the data from args (first argument is the data object containing both about and contact data)
 const data = args[0] || {};

 // Create unique class for scoping
 const uniqueClass = 'privcy-scope-' + Date.now();

 // Check if modal exists, create if not
 let modalId = 'privcy_polc';
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
                max-width: 900px;
            }
            
            .${uniqueClass} .modal-content {
                border: none;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 30px 60px -15px rgba(111, 24, 77, 0.35);
                border: 1px solid rgba(111, 24, 77, 0.15);
            }
            
            .${uniqueClass} .modal-header {
                background: linear-gradient(135deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
                color: white;
                padding: 1.5rem 2rem;
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
                background: linear-gradient(90deg, var(--accent-color, #FFB300), var(--secondary-color, #00BFA5), transparent);
                border-radius: 0 0 20px 20px;
            }
            
            .${uniqueClass} .modal-title {
                font-weight: 800;
                letter-spacing: 1px;
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .${uniqueClass} .modal-title i {
                color: var(--accent-color, #FFB300);
                filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
                font-size: 1.8rem;
            }
            
            .${uniqueClass} .btn-back {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                border-radius: 50px;
                padding: 0.6rem 1.5rem;
                font-weight: 600;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                margin-right: 20px;
                backdrop-filter: blur(5px);
            }
            
            .${uniqueClass} .btn-back:hover {
                background: rgba(255, 255, 255, 0.4);
                transform: translateX(-8px);
                border-color: rgba(255, 255, 255, 0.6);
            }
            
            .${uniqueClass} .btn-back i {
                font-size: 0.9rem;
            }
            
            .${uniqueClass} .modal-body {
                padding: 0;
                background: linear-gradient(135deg, #ffffff 0%, #faf5f9 100%);
            }
            
            .${uniqueClass} .privacy-content {
                padding: 2.5rem;
            }
            
            .${uniqueClass} .company-badge {
                background: linear-gradient(135deg, rgba(111, 24, 77, 0.08), rgba(0, 191, 165, 0.08));
                border-radius: 16px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                border: 1px solid rgba(111, 24, 77, 0.15);
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                position: relative;
                overflow: hidden;
            }
            
            .${uniqueClass} .company-badge::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, var(--primary-color, #6f184d), var(--accent-color, #FFB300), var(--secondary-color, #00BFA5));
            }
            
            .${uniqueClass} .company-badge-info {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .${uniqueClass} .badge-company-name {
                font-size: 1.3rem;
                font-weight: 800;
                color: var(--primary-color, #6f184d);
                letter-spacing: 0.5px;
            }
            
            .${uniqueClass} .badge-tagline {
                font-size: 0.95rem;
                color: var(--primary-dark, #4d1035);
                font-style: italic;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .${uniqueClass} .badge-contact {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .${uniqueClass} .badge-contact-item {
                display: flex;
                align-items: center;
                gap: 8px;
                background: white;
                padding: 0.5rem 1.2rem;
                border-radius: 50px;
                box-shadow: 0 4px 12px rgba(111, 24, 77, 0.1);
                font-size: 0.9rem;
            }
            
            .${uniqueClass} .badge-contact-item i {
                color: var(--primary-color, #6f184d);
            }
            
            .${uniqueClass} .last-updated {
                background: rgba(255, 179, 0, 0.1);
                border-radius: 50px;
                padding: 0.5rem 1.5rem;
                font-size: 0.85rem;
                color: var(--primary-dark, #4d1035);
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 2rem;
                border: 1px dashed var(--accent-color, #FFB300);
            }
            
            .${uniqueClass} .privacy-section {
                background: white;
                border-radius: 20px;
                padding: 1.75rem;
                margin-bottom: 1.5rem;
                box-shadow: 0 8px 20px rgba(111, 24, 77, 0.06);
                border: 1px solid rgba(111, 24, 77, 0.08);
                transition: all 0.3s ease;
            }
            
            .${uniqueClass} .privacy-section:hover {
                box-shadow: 0 12px 30px rgba(111, 24, 77, 0.12);
                border-color: rgba(111, 24, 77, 0.2);
                transform: translateY(-2px);
            }
            
            .${uniqueClass} .section-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 1.25rem;
                padding-bottom: 0.75rem;
                border-bottom: 2px solid rgba(111, 24, 77, 0.15);
            }
            
            .${uniqueClass} .section-header i {
                font-size: 1.8rem;
                color: var(--primary-color, #6f184d);
                background: rgba(111, 24, 77, 0.1);
                padding: 12px;
                border-radius: 16px;
            }
            
            .${uniqueClass} .section-header h2 {
                font-size: 1.3rem;
                font-weight: 700;
                color: var(--primary-dark, #4d1035);
                margin: 0;
            }
            
            .${uniqueClass} .section-content {
                color: #444;
                line-height: 1.7;
                font-size: 0.98rem;
            }
            
            .${uniqueClass} .section-content p {
                margin-bottom: 1rem;
            }
            
            .${uniqueClass} .section-content ul, 
            .${uniqueClass} .section-content ol {
                padding-left: 1.8rem;
                margin-bottom: 1rem;
            }
            
            .${uniqueClass} .section-content li {
                margin-bottom: 0.5rem;
            }
            
            .${uniqueClass} .highlight-box {
                background: linear-gradient(135deg, rgba(111, 24, 77, 0.05), rgba(0, 191, 165, 0.05));
                border-left: 4px solid var(--primary-color, #6f184d);
                padding: 1.25rem;
                border-radius: 12px;
                margin: 1.25rem 0;
            }
            
            .${uniqueClass} .data-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.25rem;
                margin-top: 1rem;
            }
            
            .${uniqueClass} .data-card {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 1.25rem;
                border: 1px solid #eee;
            }
            
            .${uniqueClass} .data-card i {
                color: var(--accent-color, #FFB300);
                font-size: 1.2rem;
                margin-bottom: 0.75rem;
            }
            
            .${uniqueClass} .data-card h4 {
                font-size: 1rem;
                font-weight: 700;
                color: var(--primary-color, #6f184d);
                margin-bottom: 0.75rem;
            }
            
            .${uniqueClass} .data-card p {
                font-size: 0.9rem;
                color: #666;
                margin: 0;
            }
            
            .${uniqueClass} .commitment-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: linear-gradient(135deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
                color: white;
                padding: 0.4rem 1.2rem;
                border-radius: 50px;
                font-size: 0.85rem;
                font-weight: 600;
                margin-right: 0.75rem;
                margin-bottom: 0.75rem;
            }
            
            .${uniqueClass} .contact-info-footer {
                background: linear-gradient(135deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
                color: white;
                border-radius: 16px;
                padding: 1.75rem;
                margin-top: 2rem;
                text-align: center;
            }
            
            .${uniqueClass} .contact-info-footer h4 {
                font-size: 1.2rem;
                font-weight: 700;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }
            
            .${uniqueClass} .contact-info-footer i {
                color: var(--accent-color, #FFB300);
            }
            
            .${uniqueClass} .footer-contact-details {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 2rem;
                margin-top: 1rem;
            }
            
            .${uniqueClass} .footer-contact-item {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(255, 255, 255, 0.15);
                padding: 0.6rem 1.5rem;
                border-radius: 50px;
                backdrop-filter: blur(5px);
            }
            
            .${uniqueClass} .footer-contact-item i {
                color: var(--accent-color, #FFB300);
            }
            
            .${uniqueClass} .cookie-settings-btn {
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
                border-radius: 50px;
                padding: 0.5rem 1.5rem;
                font-weight: 600;
                margin-left: 1rem;
                transition: all 0.3s ease;
            }
            
            .${uniqueClass} .cookie-settings-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                border-color: rgba(255, 255, 255, 0.5);
            }
            
            @media (max-width: 768px) {
                .${uniqueClass} .privacy-content {
                    padding: 1.5rem;
                }
                
                .${uniqueClass} .company-badge {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                }
                
                .${uniqueClass} .badge-contact {
                    width: 100%;
                }
                
                .${uniqueClass} .badge-contact-item {
                    width: 100%;
                }
                
                .${uniqueClass} .footer-contact-details {
                    flex-direction: column;
                    gap: 1rem;
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

 const formatOwnerName = (str) => {
  if (!str) return 'XYZ John Doe';
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

 // Extract data from both about-us and contact-us
 const businessName = formatBusinessName(data.business || data.company_name || 'abc matrimonial services');
 const ownerName = formatOwnerName(data.owner || data.owner_name || 'xyz john doe');
 const city = formatCity(data.city || 'kolhapur');
 const tagline = formatTagline(data.tagline || 'aapke saath, behtar saath ke liye');
 const experience = data.experience || '99 years';
 const mail = data.mail || data.email || 'privacy@abcmatrimony.com';
 const mob = data.mob || data.phone || '+91 99607 06060';
 const verified = data.verified || 'yes, verified profiles will be provided';

 // Current date for last updated
 const currentDate = new Date();
 const formattedDate = currentDate.toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
 });

 // Build the modal content
 const modalContent = `
        <div class="modal-header d-flex align-items-center">
            <button type="button" class="btn-back" onclick="handleUniversalBackButton()">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h5 class="modal-title">
                <i class="fas fa-shield-alt"></i> Privacy Policy
            </h5>
        </div>
        <div class="modal-body">
            <div class="privacy-content">
                <!-- Company Badge -->
                <div class="company-badge">
                    <div class="company-badge-info">
                        <div class="badge-company-name">${businessName.toUpperCase()}</div>
                        <div class="badge-tagline">
                            <i class="fas fa-heart" style="color: #ff4d4d;"></i> "${tagline}"
                        </div>
                    </div>
                    <div class="badge-contact">
                        <div class="badge-contact-item">
                            <i class="fas fa-envelope"></i> ${mail}
                        </div>
                        <div class="badge-contact-item">
                            <i class="fas fa-phone-alt"></i> ${mob}
                        </div>
                        <div class="badge-contact-item">
                            <i class="fas fa-map-marker-alt"></i> ${city}
                        </div>
                    </div>
                </div>
                
                <!-- Last Updated -->
                <div class="last-updated">
                    <i class="fas fa-calendar-alt"></i> Last Updated: ${formattedDate}
                    <i class="fas fa-check-circle" style="margin-left: 10px; color: var(--success-color, #4CAF50);"></i>
                </div>
                
                <!-- Section 1: Introduction -->
                <div class="privacy-section">
                    <div class="section-header">
                        <i class="fas fa-info-circle"></i>
                        <h2>1. Introduction</h2>
                    </div>
                    <div class="section-content">
                        <p>Welcome to <strong>${businessName}</strong>. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our matchmaking services.</p>
                        <p>With <strong>${experience}</strong> of trusted matchmaking experience, we understand the sensitive nature of matrimonial alliances and treat your personal data with the highest level of confidentiality and respect.</p>
                        <div class="highlight-box">
                            <i class="fas fa-handshake" style="color: var(--primary-color, #6f184d); margin-right: 10px;"></i>
                            <strong>Our Commitment:</strong> ${verified}. We never share your personal information without your explicit consent.
                        </div>
                    </div>
                </div>
                
                <!-- Section 2: Information We Collect -->
                <div class="privacy-section">
                    <div class="section-header">
                        <i class="fas fa-database"></i>
                        <h2>2. Information We Collect</h2>
                    </div>
                    <div class="section-content">
                        <p>We collect personal information that you voluntarily provide to us when you register for our services, create a profile, or contact us. The information we collect includes:</p>
                        
                        <div class="data-grid">
                            <div class="data-card">
                                <i class="fas fa-user-circle"></i>
                                <h4>Profile Information</h4>
                                <p>Name, age, gender, date of birth, religion, caste, education, occupation, income, family details, and photographs.</p>
                            </div>
                            <div class="data-card">
                                <i class="fas fa-address-card"></i>
                                <h4>Contact Information</h4>
                                <p>Email address, phone number, residential address, and preferred contact methods.</p>
                            </div>
                            <div class="data-card">
                                <i class="fas fa-heart"></i>
                                <h4>Matchmaking Preferences</h4>
                                <p>Partner preferences, lifestyle choices, dietary habits, family values, and horoscope details (if provided).</p>
                            </div>
                            <div class="data-card">
                                <i class="fas fa-mobile-alt"></i>
                                <h4>Technical Information</h4>
                                <p>IP address, browser type, device information, cookies, and usage data when you visit our platform.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Section 3: How We Use Your Information -->
                <div class="privacy-section">
                    <div class="section-header">
                        <i class="fas fa-tasks"></i>
                        <h2>3. How We Use Your Information</h2>
                    </div>
                    <div class="section-content">
                        <p>We use the information we collect for the following purposes:</p>
                        <ul>
                            <li><i class="fas fa-check-circle" style="color: var(--success-color, #4CAF50); margin-right: 8px;"></i> <strong>Matchmaking Services:</strong> To create and manage your profile, suggest compatible matches, and facilitate communication between interested parties.</li>
                            <li><i class="fas fa-check-circle" style="color: var(--success-color, #4CAF50); margin-right: 8px;"></i> <strong>Verification:</strong> To verify the authenticity of the information provided and ensure the integrity of our platform.</li>
                            <li><i class="fas fa-check-circle" style="color: var(--success-color, #4CAF50); margin-right: 8px;"></i> <strong>Communication:</strong> To respond to your inquiries, send service updates, and inform you about potential matches.</li>
                            <li><i class="fas fa-check-circle" style="color: var(--success-color, #4CAF50); margin-right: 8px;"></i> <strong>Improvement:</strong> To analyze usage patterns and enhance our matchmaking algorithms and user experience.</li>
                            <li><i class="fas fa-check-circle" style="color: var(--success-color, #4CAF50); margin-right: 8px;"></i> <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Section 4: Information Sharing and Disclosure -->
                <div class="privacy-section">
                    <div class="section-header">
                        <i class="fas fa-share-alt"></i>
                        <h2>4. Information Sharing and Disclosure</h2>
                    </div>
                    <div class="section-content">
                        <p>We do not sell, trade, or rent your personal information to third parties. Your information is shared only in the following circumstances:</p>
                        <ul>
                            <li><strong>With Your Consent:</strong> Your profile information is visible to other registered members based on your privacy settings.</li>
                            <li><strong>With Family Members:</strong> Information may be shared with family members who are assisting in the matchmaking process, with your permission.</li>
                            <li><strong>Service Providers:</strong> We may engage trusted third-party service providers who assist us in operating our platform, subject to strict confidentiality agreements.</li>
                            <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority.</li>
                        </ul>
                        <div class="highlight-box">
                            <i class="fas fa-lock" style="color: var(--primary-color, #6f184d); margin-right: 10px;"></i>
                            <strong>Privacy Guarantee:</strong> ${data.privacy || 'Your information is never shared with external parties without your explicit consent.'}
                        </div>
                    </div>
                </div>
                
                <!-- Section 5: Data Security -->
                <div class="privacy-section">
                    <div class="section-header">
                        <i class="fas fa-shield-virus"></i>
                        <h2>5. Data Security</h2>
                    </div>
                    <div class="section-content">
                        <p>We implement comprehensive security measures to protect your personal information:</p>
                        <ul>
                            <li><i class="fas fa-lock" style="color: var(--primary-color, #6f184d); margin-right: 8px;"></i> 256-bit SSL encryption for all data transmission</li>
                            <li><i class="fas fa-user-secret" style="color: var(--primary-color, #6f184d); margin-right: 8px;"></i> Strict access controls and authentication protocols</li>
                            <li><i class="fas fa-shield" style="color: var(--primary-color, #6f184d); margin-right: 8px;"></i> Regular security audits and vulnerability assessments</li>
                            <li><i class="fas fa-server" style="color: var(--primary-color, #6f184d); margin-right: 8px;"></i> Secure data centers with 24/7 monitoring</li>
                            <li><i class="fas fa-user-check" style="color: var(--primary-color, #6f184d); margin-right: 8px;"></i> Employee training on data protection and confidentiality</li>
                        </ul>
                        <p>While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure.</p>
                    </div>
                </div>
                
                <!-- Section 6: Your Rights and Choices -->
                <div class="privacy-section">
                    <div class="section-header">
                        <i class="fas fa-user-shield"></i>
                        <h2>6. Your Rights and Choices</h2>
                    </div>
                    <div class="section-content">
                        <p>You have the following rights regarding your personal information:</p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information in your profile.</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and personal information.</li>
                            <li><strong>Withdrawal of Consent:</strong> Withdraw consent for data processing at any time.</li>
                            <li><strong>Data Portability:</strong> Receive your data in a structured, commonly used format.</li>
                        </ul>
                        <p>To exercise these rights, please contact us at <strong>${mail}</strong> or call <strong>${mob}</strong>.</p>
                    </div>
                </div>
                
                <!-- Section 7: Cookies and Tracking Technologies -->
                <div class="privacy-section">
                    <div class="section-header">
                        <i class="fas fa-cookie-bite"></i>
                        <h2>7. Cookies and Tracking Technologies</h2>
                    </div>
                    <div class="section-content">
                        <p>We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.</p>
                        <div style="margin-top: 1rem;">
                            <span class="commitment-badge">
                                <i class="fas fa-cookie"></i> Essential Cookies
                            </span>
                            <span class="commitment-badge">
                                <i class="fas fa-chart-line"></i> Analytics Cookies
                            </span>
                            <span class="commitment-badge">
                                <i class="fas fa-ad"></i> Functional Cookies
                            </span>
                            <button class="cookie-settings-btn" onclick="alert('Cookie preferences panel would open here. This is a demo implementation.');">
                                <i class="fas fa-sliders-h"></i> Cookie Settings
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Section 8: Children's Privacy -->
                <div class="privacy-section">
                    <div class="section-header">
                        <i class="fas fa-child"></i>
                        <h2>8. Children's Privacy</h2>
                    </div>
                    <div class="section-content">
                        <p>Our services are intended for individuals who are legally eligible to marry under applicable laws. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us immediately.</p>
                    </div>
                </div>
                
                <!-- Section 9: Changes to This Privacy Policy -->
                <div class="privacy-section">
                    <div class="section-header">
                        <i class="fas fa-history"></i>
                        <h2>9. Changes to This Privacy Policy</h2>
                    </div>
                    <div class="section-content">
                        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page with a revised "Last Updated" date.</p>
                        <p>We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.</p>
                    </div>
                </div>
                
                <!-- Section 10: Grievance Officer -->
                <div class="privacy-section">
                    <div class="section-header">
                        <i class="fas fa-gavel"></i>
                        <h2>10. Grievance Officer</h2>
                    </div>
                    <div class="section-content">
                        <p>In accordance with applicable laws, we have appointed a Grievance Officer to address any concerns or complaints regarding data privacy:</p>
                        <ul>
                            <li><strong>Name:</strong> ${ownerName}</li>
                            <li><strong>Designation:</strong> Founder & Grievance Officer</li>
                            <li><strong>Email:</strong> grievance@${data.business ? data.business.replace(/\s+/g, '').toLowerCase() : 'abcmatrimony'}.com</li>
                            <li><strong>Phone:</strong> ${mob}</li>
                            <li><strong>Response Time:</strong> Within 24-48 hours</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Contact Footer -->
                <div class="contact-info-footer">
                    <h4>
                        <i class="fas fa-question-circle"></i>
                        Have Questions About Your Privacy?
                    </h4>
                    <p style="margin-bottom: 1.5rem; opacity: 0.9;">Our privacy team is here to help you with any concerns or inquiries.</p>
                    <div class="footer-contact-details">
                        <div class="footer-contact-item">
                            <i class="fas fa-envelope"></i>
                            ${mail}
                        </div>
                        <div class="footer-contact-item">
                            <i class="fas fa-phone-alt"></i>
                            ${mob}
                        </div>
                        <div class="footer-contact-item">
                            <i class="fas fa-building"></i>
                            ${city}
                        </div>
                    </div>
                    <p style="margin-top: 1.5rem; font-size: 0.85rem; opacity: 0.8;">
                        <i class="fas fa-clock"></i> We typically respond within 24 hours
                    </p>
                </div>
                
                <!-- Consent Confirmation -->
                <div style="text-align: center; margin-top: 1.5rem; padding: 1rem; color: #666; font-size: 0.85rem;">
                    <i class="fas fa-check-circle" style="color: var(--success-color, #4CAF50);"></i>
                    By using ${businessName}, you acknowledge that you have read and understood this Privacy Policy.
                </div>
            </div>
        </div>
    `;

 // Set the content
 modalResult.contentElement.innerHTML = modalContent;

 // Store the original data in the modal for future updates
 modalResult.modalElement.setAttribute('data-privacy-data', JSON.stringify(data));

 // Show the modal
 modalResult.modalInstance.show();

 // Add to modal stack if not already there
 if (!modalStack.includes(modalId)) {
  modalStack.push(modalId);
 }

 console.log(`Privacy Policy modal displayed for ${businessName}`);

 return modalResult;
}

// Add a helper function to update the modal with new data
function update_privcy_polc_data(newData) {
 const modal = document.getElementById('privcy_polc');
 if (modal) {
  set_privcy_polc_innerHTML(newData);
 } else {
  console.warn('Privacy Policy modal not found, creating new one');
  set_privcy_polc_innerHTML(newData);
 }
}

// Add a helper function to get current privacy data from the modal
function get_privcy_polc_data() {
 const modal = document.getElementById('privcy_polc');
 if (modal) {
  const dataAttr = modal.getAttribute('data-privacy-data');
  if (dataAttr) {
   return JSON.parse(dataAttr);
  }
 }
 return null;
}