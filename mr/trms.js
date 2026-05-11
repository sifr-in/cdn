function set_terms_condi_innerHTML(...args) {
 // Get the data from args (first argument is the data object containing all company data)
 const data = args[0] || {};

 // Create unique class for scoping
 const uniqueClass = 'terms-scope-' + Date.now();

 // Check if modal exists, create if not
 let modalId = 'terms_condi';
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
max-width: 950px;
}

.${uniqueClass} .modal-content {
border: none;
border-radius: 28px;
overflow: hidden;
box-shadow: 0 35px 70px -15px rgba(111, 24, 77, 0.4);
border: 1px solid rgba(111, 24, 77, 0.18);
}

.${uniqueClass} .modal-header {
background: linear-gradient(145deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
color: white;
padding: 1.6rem 2.2rem;
border-bottom: none;
position: relative;
overflow: hidden;
}

.${uniqueClass} .modal-header::before {
content: '';
position: absolute;
top: -50%;
right: -20%;
width: 300px;
height: 300px;
background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
border-radius: 50%;
}

.${uniqueClass} .modal-header::after {
content: '';
position: absolute;
bottom: -5px;
left: 0;
right: 0;
height: 8px;
background: linear-gradient(90deg, var(--accent-color, #FFB300), var(--secondary-color, #00BFA5), var(--primary-light, #8a1f61));
border-radius: 0 0 20px 20px;
}

.${uniqueClass} .modal-title {
font-weight: 800;
letter-spacing: 1.2px;
font-size: 1.7rem;
display: flex;
align-items: center;
gap: 18px;
position: relative;
z-index: 2;
}

.${uniqueClass} .modal-title i {
color: var(--accent-color, #FFB300);
filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
font-size: 2rem;
}

.${uniqueClass} .btn-back {
background: rgba(255, 255, 255, 0.18);
border: 1.5px solid rgba(255, 255, 255, 0.25);
color: white;
border-radius: 50px;
padding: 0.7rem 1.8rem;
font-weight: 700;
font-size: 1rem;
transition: all 0.3s ease;
display: flex;
align-items: center;
gap: 12px;
margin-right: 25px;
backdrop-filter: blur(8px);
position: relative;
z-index: 2;
}

.${uniqueClass} .btn-back:hover {
background: rgba(255, 255, 255, 0.35);
transform: translateX(-10px);
border-color: rgba(255, 255, 255, 0.5);
}

.${uniqueClass} .btn-back i {
font-size: 0.95rem;
}

.${uniqueClass} .modal-body {
padding: 0;
background: linear-gradient(145deg, #ffffff 0%, #fcf7fa 100%);
}

.${uniqueClass} .terms-content {
padding: 2.8rem;
}

.${uniqueClass} .company-header-card {
background: linear-gradient(145deg, rgba(111, 24, 77, 0.05), rgba(0, 191, 165, 0.05));
border-radius: 24px;
padding: 1.8rem;
margin-bottom: 2.2rem;
border: 1px solid rgba(111, 24, 77, 0.15);
display: flex;
flex-wrap: wrap;
align-items: center;
justify-content: space-between;
position: relative;
overflow: hidden;
box-shadow: 0 10px 25px rgba(111, 24, 77, 0.08);
}

.${uniqueClass} .company-header-card::before {
content: '';
position: absolute;
top: 0;
left: 0;
right: 0;
height: 5px;
background: linear-gradient(90deg, var(--primary-color, #6f184d), var(--accent-color, #FFB300), var(--secondary-color, #00BFA5));
}

.${uniqueClass} .company-header-info {
display: flex;
flex-direction: column;
gap: 8px;
}

.${uniqueClass} .header-company-name {
font-size: 1.5rem;
font-weight: 900;
color: var(--primary-color, #6f184d);
letter-spacing: 0.8px;
text-shadow: 0 2px 4px rgba(111, 24, 77, 0.1);
}

.${uniqueClass} .header-tagline {
font-size: 1rem;
color: var(--primary-dark, #4d1035);
font-style: italic;
display: flex;
align-items: center;
gap: 10px;
}

.${uniqueClass} .header-badges {
display: flex;
gap: 12px;
flex-wrap: wrap;
}

.${uniqueClass} .header-badge {
background: white;
padding: 0.6rem 1.4rem;
border-radius: 50px;
font-size: 0.9rem;
font-weight: 600;
color: var(--primary-color, #6f184d);
box-shadow: 0 5px 15px rgba(111, 24, 77, 0.12);
display: flex;
align-items: center;
gap: 8px;
border: 1px solid rgba(111, 24, 77, 0.15);
}

.${uniqueClass} .header-badge i {
color: var(--accent-color, #FFB300);
}

.${uniqueClass} .effective-date {
background: linear-gradient(145deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
color: white;
border-radius: 50px;
padding: 0.7rem 1.8rem;
font-size: 0.95rem;
font-weight: 600;
display: inline-flex;
align-items: center;
gap: 12px;
margin-bottom: 2rem;
border: 1px solid rgba(255,255,255,0.2);
box-shadow: 0 8px 20px rgba(111, 24, 77, 0.25);
}

.${uniqueClass} .terms-section {
background: white;
border-radius: 24px;
padding: 1.8rem 2rem;
margin-bottom: 1.8rem;
box-shadow: 0 8px 25px rgba(111, 24, 77, 0.06);
border: 1px solid rgba(111, 24, 77, 0.08);
transition: all 0.4s ease;
position: relative;
overflow: hidden;
}

.${uniqueClass} .terms-section:hover {
box-shadow: 0 15px 40px rgba(111, 24, 77, 0.15);
border-color: rgba(111, 24, 77, 0.2);
transform: translateY(-3px);
}

.${uniqueClass} .terms-section::after {
content: '';
position: absolute;
top: 0;
left: 0;
width: 6px;
height: 100%;
background: linear-gradient(135deg, var(--primary-color, #6f184d), var(--accent-color, #FFB300));
opacity: 0;
transition: opacity 0.3s ease;
}

.${uniqueClass} .terms-section:hover::after {
opacity: 1;
}

.${uniqueClass} .section-header {
display: flex;
align-items: center;
gap: 18px;
margin-bottom: 1.3rem;
padding-bottom: 0.8rem;
border-bottom: 2px solid rgba(111, 24, 77, 0.12);
}

.${uniqueClass} .section-header i {
font-size: 2rem;
color: var(--primary-color, #6f184d);
background: linear-gradient(145deg, rgba(111, 24, 77, 0.1), rgba(255, 179, 0, 0.1));
padding: 12px;
border-radius: 18px;
}

.${uniqueClass} .section-header h2 {
font-size: 1.4rem;
font-weight: 800;
color: var(--primary-dark, #4d1035);
margin: 0;
letter-spacing: 0.5px;
}

.${uniqueClass} .section-content {
color: #444;
line-height: 1.75;
font-size: 0.98rem;
padding-left: 0.5rem;
}

.${uniqueClass} .section-content p {
margin-bottom: 1.2rem;
}

.${uniqueClass} .section-content ul, 
.${uniqueClass} .section-content ol {
padding-left: 2.2rem;
margin-bottom: 1.2rem;
}

.${uniqueClass} .section-content li {
margin-bottom: 0.7rem;
position: relative;
}

.${uniqueClass} .section-content li::marker {
color: var(--primary-color, #6f184d);
font-weight: bold;
}

.${uniqueClass} .important-notice {
background: linear-gradient(145deg, #fff9e6, #fff3d4);
border-left: 6px solid var(--accent-color, #FFB300);
border-radius: 16px;
padding: 1.5rem 2rem;
margin: 1.8rem 0;
box-shadow: 0 5px 20px rgba(255, 179, 0, 0.15);
}

.${uniqueClass} .important-notice i {
color: var(--accent-color, #FFB300);
font-size: 1.8rem;
margin-right: 15px;
float: left;
}

.${uniqueClass} .legal-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 1.5rem;
margin-top: 1.2rem;
}

.${uniqueClass} .legal-card {
background: #faf5f9;
border-radius: 18px;
padding: 1.5rem;
border: 1px solid rgba(111, 24, 77, 0.1);
transition: all 0.3s ease;
}

.${uniqueClass} .legal-card:hover {
background: white;
border-color: var(--primary-color, #6f184d);
box-shadow: 0 8px 20px rgba(111, 24, 77, 0.12);
}

.${uniqueClass} .legal-card i {
color: var(--primary-color, #6f184d);
font-size: 1.6rem;
margin-bottom: 1rem;
}

.${uniqueClass} .legal-card h4 {
font-size: 1.1rem;
font-weight: 800;
color: var(--primary-dark, #4d1035);
margin-bottom: 0.8rem;
}

.${uniqueClass} .legal-card p {
font-size: 0.9rem;
color: #666;
margin: 0;
}

.${uniqueClass} .fee-structure {
background: linear-gradient(145deg, rgba(0, 191, 165, 0.05), rgba(0, 137, 123, 0.05));
border-radius: 20px;
padding: 1.5rem;
margin-top: 1rem;
border: 1px solid rgba(0, 191, 165, 0.2);
}

.${uniqueClass} .fee-item {
display: flex;
justify-content: space-between;
align-items: center;
padding: 0.8rem 0;
border-bottom: 1px dashed rgba(0, 191, 165, 0.3);
}

.${uniqueClass} .fee-item:last-child {
border-bottom: none;
}

.${uniqueClass} .fee-label {
font-weight: 700;
color: var(--secondary-dark, #00897B);
display: flex;
align-items: center;
gap: 10px;
}

.${uniqueClass} .fee-value {
font-weight: 800;
color: var(--primary-color, #6f184d);
background: white;
padding: 0.3rem 1rem;
border-radius: 50px;
box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.${uniqueClass} .membership-tier {
display: inline-block;
background: linear-gradient(145deg, var(--accent-color, #FFB300), var(--accent-dark, #FF8F00));
color: white;
padding: 0.4rem 1.2rem;
border-radius: 50px;
font-size: 0.8rem;
font-weight: 700;
margin-left: 0.8rem;
text-transform: uppercase;
letter-spacing: 1px;
}

.${uniqueClass} .acceptance-box {
background: linear-gradient(145deg, rgba(111, 24, 77, 0.08), rgba(0, 191, 165, 0.08));
border-radius: 20px;
padding: 1.8rem;
margin: 2rem 0 1.5rem;
border: 2px solid rgba(111, 24, 77, 0.2);
text-align: center;
}

.${uniqueClass} .acceptance-check {
display: flex;
align-items: center;
justify-content: center;
gap: 12px;
margin-top: 1rem;
}

.${uniqueClass} .acceptance-check input[type="checkbox"] {
width: 22px;
height: 22px;
accent-color: var(--primary-color, #6f184d);
cursor: pointer;
}

.${uniqueClass} .acceptance-check label {
font-weight: 700;
color: var(--primary-dark, #4d1035);
cursor: pointer;
}

.${uniqueClass} .footer-acceptance {
background: linear-gradient(145deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
color: white;
border-radius: 24px;
padding: 2rem;
margin-top: 2.5rem;
text-align: center;
position: relative;
overflow: hidden;
}

.${uniqueClass} .footer-acceptance::before {
content: '';
position: absolute;
top: -50%;
left: -20%;
width: 300px;
height: 300px;
background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
border-radius: 50%;
}

.${uniqueClass} .footer-acceptance h3 {
font-size: 1.4rem;
font-weight: 800;
margin-bottom: 1.2rem;
position: relative;
z-index: 2;
display: flex;
align-items: center;
justify-content: center;
gap: 15px;
}

.${uniqueClass} .footer-acceptance i {
color: var(--accent-color, #FFB300);
}

.${uniqueClass} .btn-accept {
background: white;
color: var(--primary-color, #6f184d);
border: none;
border-radius: 50px;
padding: 0.9rem 2.8rem;
font-weight: 800;
font-size: 1.1rem;
letter-spacing: 1.5px;
transition: all 0.3s ease;
box-shadow: 0 10px 30px rgba(0,0,0,0.2);
display: inline-flex;
align-items: center;
gap: 12px;
margin-top: 0.8rem;
position: relative;
z-index: 2;
}

.${uniqueClass} .btn-accept:hover {
transform: translateY(-3px);
box-shadow: 0 15px 40px rgba(0,0,0,0.3);
background: var(--accent-color, #FFB300);
color: white;
}

.${uniqueClass} .btn-accept i {
transition: transform 0.3s ease;
}

.${uniqueClass} .btn-accept:hover i {
transform: translateX(8px);
color: white;
}

.${uniqueClass} .version-info {
text-align: center;
margin-top: 1.5rem;
color: #888;
font-size: 0.8rem;
display: flex;
align-items: center;
justify-content: center;
gap: 20px;
}

.${uniqueClass} .version-info i {
color: var(--accent-color, #FFB300);
}

@media (max-width: 768px) {
.${uniqueClass} .terms-content {
padding: 1.8rem;
}

.${uniqueClass} .company-header-card {
flex-direction: column;
align-items: flex-start;
gap: 1.2rem;
}

.${uniqueClass} .header-badges {
width: 100%;
}

.${uniqueClass} .header-badge {
width: 100%;
justify-content: center;
}

.${uniqueClass} .modal-title {
font-size: 1.3rem;
}

.${uniqueClass} .section-header h2 {
font-size: 1.2rem;
}

.${uniqueClass} .fee-item {
flex-direction: column;
align-items: flex-start;
gap: 0.5rem;
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

 // Extract data from all sources
 const businessName = formatBusinessName(data.business || data.company_name || 'abc matrimonial services');
 const businessNameShort = (data.business || 'abc matrimonial services').split(' ')[0].toUpperCase();
 const ownerName = formatOwnerName(data.owner || data.owner_name || 'xyz john doe');
 const city = formatCity(data.city || 'kolhapur');
 const tagline = formatTagline(data.tagline || 'aapke saath, behtar saath ke liye');
 const experience = data.experience || '99 years';
 const mail = data.mail || data.email || 'legal@abcmatrimony.com';
 const mob = data.mob || data.phone || '+91 99607 06060';
 const verified = data.verified || 'verified profiles';
 const focus = data.focus || 'matchmaking for all communities focusing on Hindu and Maratha caste';

 // Current date for effective date
 const currentDate = new Date();
 const effectiveDate = currentDate.toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
 });

 // Expiry date (1 year from now)
 const expiryDate = new Date();
 expiryDate.setFullYear(expiryDate.getFullYear() + 1);
 const formattedExpiryDate = expiryDate.toLocaleDateString('en-IN', {
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
<i class="fas fa-file-contract"></i> Terms & Conditions
</h5>
</div>
<div class="modal-body">
<div class="terms-content">
<!-- Company Header Card -->
<div class="company-header-card">
<div class="company-header-info">
<div class="header-company-name">${businessName.toUpperCase()}</div>
<div class="header-tagline">
<i class="fas fa-heart" style="color: #ff4d4d;"></i> "${tagline}"
</div>
</div>
<div class="header-badges">
<div class="header-badge">
<i class="fas fa-check-circle"></i> ${experience}
</div>
<div class="header-badge">
<i class="fas fa-map-marker-alt"></i> ${city}
</div>
<div class="header-badge">
<i class="fas fa-shield-alt"></i> ${verified}
</div>
</div>
</div>

<!-- Effective Date -->
<div class="effective-date">
<i class="fas fa-calendar-check"></i> Effective Date: ${effectiveDate}
<i class="fas fa-clock" style="margin-left: 15px;"></i> Valid Until: ${formattedExpiryDate}
<span class="membership-tier">v2.0.${Math.floor(Math.random() * 100)}</span>
</div>

<!-- Section 1: Acceptance of Terms -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-handshake"></i>
<h2>1. Acceptance of Terms</h2>
</div>
<div class="section-content">
<p>Welcome to <strong>${businessName}</strong> ("Company," "we," "our," or "us"). By accessing or using our matchmaking services, website, mobile applications, or any associated platforms (collectively, the "Services"), you agree to be bound by these Terms & Conditions ("Terms").</p>
<p>If you do not agree to these Terms, please do not access or use our Services. These Terms constitute a legally binding agreement between you and ${businessName}. Our Services are designed to facilitate matrimonial alliances and are intended for individuals seeking lawful matrimonial relationships.</p>
<div class="important-notice">
<i class="fas fa-gavel"></i>
<strong style="font-size: 1.1rem;">IMPORTANT:</strong> These Terms contain provisions that govern dispute resolution through binding arbitration and include a waiver of class action rights. Please read them carefully.
</div>
</div>
</div>

<!-- Section 2: Eligibility -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-user-check"></i>
<h2>2. Eligibility</h2>
</div>
<div class="section-content">
<p>By using our Services, you represent and warrant that:</p>
<ul>
<li>You are at least 18 years of age (21 years in states where applicable) and legally eligible to marry under the laws of India.</li>
<li>You are not already married, or if divorced/widowed, you provide legal documentation of the same.</li>
<li>All information provided in your profile is accurate, complete, and current.</li>
<li>You are not prohibited by law from using our Services.</li>
<li>You are not a convicted sex offender or have any criminal record involving moral turpitude.</li>
<li>You are using our Services for genuine matrimonial purposes and not for casual dating, commercial solicitation, or any fraudulent activity.</li>
</ul>
<p>We reserve the right to verify the information provided and request supporting documents (age proof, identity proof, marital status proof, etc.) at any time. Failure to provide such documentation may result in immediate suspension or termination of your account.</p>
</div>
</div>

<!-- Section 3: Account Registration and Security -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-user-lock"></i>
<h2>3. Account Registration and Security</h2>
</div>
<div class="section-content">
<p>To access certain features of our Services, you must register for an account. You agree to:</p>
<ul>
<li>Provide accurate, current, and complete information during the registration process.</li>
<li>Maintain and promptly update your account information to keep it accurate and complete.</li>
<li>Maintain the security and confidentiality of your password and account credentials.</li>
<li>Notify us immediately of any unauthorized access to or use of your account.</li>
<li>Accept full responsibility for all activities that occur under your account.</li>
</ul>
<p>You may not:</p>
<ul>
<li>Create multiple accounts or create an account on behalf of someone else without authorization.</li>
<li>Share your account credentials with any third party.</li>
<li>Use another user's account without permission.</p>
<li>Create a profile for someone other than yourself or an immediate family member (with proper authorization).</li>
</ul>
<div class="highlight-box" style="background: rgba(111, 24, 77, 0.05); padding: 1.2rem; border-radius: 12px; margin-top: 0.8rem;">
<i class="fas fa-shield" style="color: var(--primary-color, #6f184d); margin-right: 10px;"></i>
<strong>Profile Verification:</strong> ${businessName} offers ${verified.toLowerCase()}. Verified profiles are marked with a verification badge, increasing trust and authenticity.
</div>
</div>
</div>

<!-- Section 4: Membership and Fees -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-crown"></i>
<h2>4. Membership and Fees</h2>
</div>
<div class="section-content">
<p>${businessName} offers both free and paid membership plans. The following terms apply to our membership services:</p>

<div class="fee-structure">
<h4 style="color: var(--primary-color, #6f184d); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 10px;">
<i class="fas fa-tags"></i> Membership Plans
</h4>
<div class="fee-item">
<span class="fee-label"><i class="fas fa-user"></i> Basic Membership (Free)</span>
<span class="fee-value">₹0 - Profile creation, basic search</span>
</div>
<div class="fee-item">
<span class="fee-label"><i class="fas fa-star"></i> Premium Membership <span class="membership-tier">Popular</span></span>
<span class="fee-value">₹2,999 - 3 months</span>
</div>
<div class="fee-item">
<span class="fee-label"><i class="fas fa-gem"></i> Gold Membership</span>
<span class="fee-value">₹5,999 - 6 months</span>
</div>
<div class="fee-item">
<span class="fee-label"><i class="fas fa-crown"></i> Platinum Membership <span class="membership-tier">Best Value</span></span>
<span class="fee-value">₹9,999 - 12 months</span>
</div>
<div class="fee-item">
<span class="fee-label"><i class="fas fa-hand-holding-heart"></i> Premium Matchmaking</span>
<span class="fee-value">₹25,000 - Personalized assistance</span>
</div>
</div>

<p style="margin-top: 1.2rem;"><strong>Payment Terms:</strong></p>
<ul>
<li>All fees are non-refundable except as expressly provided in our cancellation policy.</li>
<li>Membership fees are charged in advance for the subscription term.</li>
<li>Auto-renewal is enabled by default for paid memberships. You may disable auto-renewal from account settings.</li>
<li>We accept various payment methods including credit/debit cards, net banking, UPI, and digital wallets.</li>
<li>Taxes (GST) will be applied as per applicable laws.</li>
</ul>

<p><strong>Cancellation and Refund Policy:</strong></p>
<ul>
<li>Cancellation within 48 hours of purchase: 100% refund (minus transaction charges).</li>
<li>No refund after 48 hours or if any matches have been viewed/contacted.</li>
<li>Refunds are processed within 7-10 business days.</li>
</ul>
</div>
</div>

<!-- Section 5: User Conduct and Prohibited Activities -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-ban"></i>
<h2>5. User Conduct and Prohibited Activities</h2>
</div>
<div class="section-content">
<p>You agree not to engage in any of the following prohibited activities:</p>

<div class="legal-grid">
<div class="legal-card">
<i class="fas fa-fraud"></i>
<h4>Fraudulent Behavior</h4>
<p>Creating fake profiles, providing false information, impersonating others, or engaging in any deceptive practices.</p>
</div>
<div class="legal-card">
<i class="fas fa-heart-broken"></i>
<h4>Harassment</h4>
<p>Sending abusive, threatening, or offensive messages; stalking; or making unwanted advances.</p>
</div>
<div class="legal-card">
<i class="fas fa-coins"></i>
<h4>Financial Solicitation</h4>
<p>Requesting money, investments, or financial assistance from other users under any pretext.</p>
</div>
<div class="legal-card">
<i class="fas fa-ad"></i>
<h4>Commercial Use</h4>
<p>Using our platform for advertising, promotions, or soliciting business.</p>
</div>
<div class="legal-card">
<i class="fas fa-user-secret"></i>
<h4>Privacy Violation</h4>
<p>Collecting or harvesting user information without consent.</p>
</div>
<div class="legal-card">
<i class="fas fa-copyright"></i>
<h4>Intellectual Property</h4>
<p>Copying, reproducing, or distributing our content without authorization.</p>
</div>
</div>

<p style="margin-top: 1rem;"><strong>Violation Consequences:</strong> Violation of these conduct rules may result in immediate account termination, forfeiture of fees paid, and legal action including filing of police complaints under relevant sections of the Indian Penal Code and Information Technology Act, 2000.</p>
</div>
</div>

<!-- Section 6: Matchmaking Process and Limitations -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-heart"></i>
<h2>6. Matchmaking Process and Limitations</h2>
</div>
<div class="section-content">
<p>${businessName} provides a platform to connect individuals seeking matrimonial alliances. Our role is limited to:</p>
<ul>
<li>Providing technology infrastructure for profile creation and discovery.</li>
<li>Facilitating communication between interested parties.</li>
<li>Offering verification services as an additional trust layer.</li>
<li>Providing personalized matchmaking assistance (for premium plans).</li>
</ul>

<p><strong>Important Disclaimers:</strong></p>
<ul>
<li>We do not conduct background checks on users unless explicitly opted for verification services.</li>
<li>We do not guarantee successful marriage or specific number of matches.</li>
<li>We are not responsible for the conduct of users, whether online or offline.</li>
<li>We do not endorse or verify statements made by users in their profiles.</li>
<li>Users are solely responsible for their interactions and decisions.</li>
</ul>

<div class="important-notice">
<i class="fas fa-exclamation-triangle"></i>
<strong>SAFETY ADVISORY:</strong> We strongly recommend meeting in public places, informing family members, conducting independent verification, and not transferring money to anyone you meet through our platform. ${businessName} is not liable for any financial or personal losses incurred during the matchmaking process.
</div>
</div>
</div>

<!-- Section 7: Intellectual Property Rights -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-copyright"></i>
<h2>7. Intellectual Property Rights</h2>
</div>
<div class="section-content">
<p>All content on our platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, is the property of ${businessName} or its content suppliers and is protected by Indian and international copyright, trademark, and other intellectual property laws.</p>

<p><strong>License to Use:</strong> We grant you a limited, non-exclusive, non-transferable, revocable license to access and use our Services for personal, non-commercial matrimonial purposes.</p>

<p><strong>Content You Post:</strong> By posting content (photos, information, messages) on our platform, you grant ${businessName} a worldwide, royalty-free, non-exclusive license to host, store, reproduce, modify, and adapt such content solely for the purpose of operating and improving our Services.</p>
</div>
</div>

<!-- Section 8: Privacy and Data Protection -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-shield-virus"></i>
<h2>8. Privacy and Data Protection</h2>
</div>
<div class="section-content">
<p>Your privacy is important to us. Our collection, use, and disclosure of personal information is governed by our <a href="#" onclick="set_privcy_polc_innerHTML(window.lastCompanyData || {}); return false;" style="color: var(--primary-color, #6f184d); font-weight: 700; text-decoration: underline;">Privacy Policy</a>, which is incorporated into these Terms by reference.</p>

<p><strong>Key Privacy Commitments:</strong></p>
<ul>
<li>We do not sell your personal information to third parties.</li>
<li>Your contact information is only shared with mutual matches.</li>
<li>You can delete your account and data at any time.</li>
<li>We implement industry-standard security measures.</li>
</ul>
</div>
</div>

<!-- Section 9: Third-Party Links and Services -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-external-link-alt"></i>
<h2>9. Third-Party Links and Services</h2>
</div>
<div class="section-content">
<p>Our Services may contain links to third-party websites or services that are not owned or controlled by ${businessName}. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. You acknowledge and agree that we shall not be liable for any damage or loss caused by or in connection with the use of any such third-party websites or services.</p>
</div>
</div>

<!-- Section 10: Termination and Suspension -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-power-off"></i>
<h2>10. Termination and Suspension</h2>
</div>
<div class="section-content">
<p>We reserve the right to suspend or terminate your account and access to our Services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>

<p><strong>By You:</strong> You may terminate your account at any time through account settings or by contacting us. Your profile will be deactivated immediately, and your information will be deleted within 30 days.</p>

<p><strong>Effect of Termination:</strong> Upon termination, your right to use our Services ceases immediately. Fees paid are non-refundable upon termination for cause.</p>
</div>
</div>

<!-- Section 11: Dispute Resolution and Arbitration -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-gavel"></i>
<h2>11. Dispute Resolution and Arbitration</h2>
</div>
<div class="section-content">
<p><strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms or our Services shall be resolved through the following process:</p>

<ol>
<li><strong>Informal Resolution:</strong> You must first contact us to attempt to resolve any dispute informally. Most disputes can be resolved at this stage.</li>
<li><strong>Arbitration:</strong> If the dispute cannot be resolved informally, it shall be resolved through binding arbitration administered by the Indian Council of Arbitration (ICA) in accordance with its Arbitration Rules.</li>
<li><strong>Venue:</strong> The arbitration shall be conducted in ${city}, Maharashtra. The language of arbitration shall be English or Marathi.</li>
<li><strong>Class Action Waiver:</strong> You agree to resolve disputes with us on an individual basis and waive any right to participate in a class action, class arbitration, or representative proceeding.</li>
</ol>

<p><strong>Jurisdiction:</strong> For any disputes not subject to arbitration, the courts in ${city} shall have exclusive jurisdiction.</p>
</div>
</div>

<!-- Section 12: Limitation of Liability -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-balance-scale"></i>
<h2>12. Limitation of Liability</h2>
</div>
<div class="section-content">
<p>To the maximum extent permitted by law, in no event shall ${businessName}, its directors, employees, partners, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
<ul>
<li>Your use or inability to use our Services.</li>
<li>Any conduct or content of any third party on our Services.</li>
<li>Any unauthorized access, use, or alteration of your transmissions or content.</li>
<li>Any interactions, meetings, or relationships formed through our platform.</li>
</ul>
<p>Our total liability to you shall not exceed the amount paid by you to us during the twelve months preceding the claim, or ₹1,000, whichever is greater.</p>
</div>
</div>

<!-- Section 13: Indemnification -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-shield"></i>
<h2>13. Indemnification</h2>
</div>
<div class="section-content">
<p>You agree to indemnify, defend, and hold harmless ${businessName}, its officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:</p>
<ul>
<li>Your violation of these Terms.</li>
<li>Your use of our Services.</li>
<li>Your violation of any rights of another user or third party.</li>
<li>Any content you post or share on our platform.</li>
</ul>
</div>
</div>

<!-- Section 14: Modifications to Terms -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-edit"></i>
<h2>14. Modifications to Terms</h2>
</div>
<div class="section-content">
<p>We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by email, through a prominent notice on our platform, or by updating the "Effective Date" at the top of these Terms. Your continued use of our Services after such modifications constitutes your acceptance of the revised Terms.</p>
</div>
</div>

<!-- Section 15: Contact Information -->
<div class="terms-section">
<div class="section-header">
<i class="fas fa-headset"></i>
<h2>15. Contact Information</h2>
</div>
<div class="section-content">
<p>If you have any questions about these Terms, please contact us:</p>
<ul style="list-style-type: none; padding-left: 0;">
<li style="margin-bottom: 0.8rem;"><i class="fas fa-building" style="color: var(--primary-color, #6f184d); width: 25px;"></i> <strong>${businessName}</strong></li>
<li style="margin-bottom: 0.8rem;"><i class="fas fa-user-tie" style="color: var(--primary-color, #6f184d); width: 25px;"></i> Attn: ${ownerName}, Grievance Officer</li>
<li style="margin-bottom: 0.8rem;"><i class="fas fa-envelope" style="color: var(--primary-color, #6f184d); width: 25px;"></i> Email: <a href="mailto:${mail}" style="color: var(--primary-color, #6f184d);">${mail}</a></li>
<li style="margin-bottom: 0.8rem;"><i class="fas fa-phone-alt" style="color: var(--primary-color, #6f184d); width: 25px;"></i> Phone: <a href="tel:${mob}" style="color: var(--primary-color, #6f184d);">${mob}</a></li>
<li style="margin-bottom: 0.8rem;"><i class="fas fa-map-marker-alt" style="color: var(--primary-color, #6f184d); width: 25px;"></i> Address: ${city}, Maharashtra, India</li>
<li style="margin-bottom: 0.8rem;"><i class="fas fa-clock" style="color: var(--primary-color, #6f184d); width: 25px;"></i> Response Time: 24-48 hours</li>
</ul>
</div>
</div>

<!-- Acceptance Box -->
<div class="acceptance-box">
<h4 style="color: var(--primary-dark, #4d1035); font-weight: 800; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 12px;">
<i class="fas fa-check-circle" style="color: var(--success-color, #4CAF50);"></i>
Acceptance of Terms
</h4>
<p style="margin-bottom: 1.2rem;">By using ${businessName}, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.</p>
<div class="acceptance-check">
<input type="checkbox" id="acceptTerms_${uniqueClass}" onchange="document.getElementById('acceptBtn_${uniqueClass}').disabled = !this.checked;">
<label for="acceptTerms_${uniqueClass}">I have read and agree to the Terms & Conditions</label>
</div>
</div>

<!-- Footer Acceptance -->
<div class="footer-acceptance">
<h3>
<i class="fas fa-file-signature"></i>
Ready to find your life partner?
</h3>
<p style="margin-bottom: 1.5rem; opacity: 0.95; font-size: 1.05rem;">Join ${businessName} today and begin your journey toward a meaningful relationship.</p>
<button class="btn-accept" id="acceptBtn_${uniqueClass}" disabled onclick="acceptTermsAndConditions('${uniqueClass}', '${businessName}')">
<i class="fas fa-check-circle"></i> ACCEPT & CONTINUE
</button>
<div class="version-info">
<span><i class="fas fa-code-branch"></i> Version 2.0.${Math.floor(Math.random() * 100)}</span>
<span><i class="fas fa-calendar"></i> Effective: ${effectiveDate}</span>
<span><i class="fas fa-balance-scale"></i> ${businessNameShort} Matrimony</span>
</div>
</div>
</div>
</div>
    `;

 // Set the content
 modalResult.contentElement.innerHTML = modalContent;

 // Store the original data in the modal for future updates
 modalResult.modalElement.setAttribute('data-terms-data', JSON.stringify(data));

 // Store last company data for cross-modal linking
 window.lastCompanyData = data;

 // Show the modal
 modalResult.modalInstance.show();

 // Add to modal stack if not already there
 if (!modalStack.includes(modalId)) {
  modalStack.push(modalId);
 }

 console.log(`Terms & Conditions modal displayed for ${businessName}`);

 return modalResult;
}

// Helper function for terms acceptance
function acceptTermsAndConditions(uniqueClass, businessName) {
 // Get the checkbox
 const checkbox = document.getElementById(`acceptTerms_${uniqueClass}`);

 if (checkbox && checkbox.checked) {
  // Show success message
  showToast(`Thank you for accepting the Terms & Conditions. Welcome to ${businessName}!`, {
   type: 'success',
   duration: 5000,
   position: 'top'
  });

  // Close the modal
  const modal = document.getElementById('terms_condi');
  if (modal) {
   const modalInstance = bootstrap.Modal.getInstance(modal);
   if (modalInstance) {
    modalInstance.hide();
   }
  }

  // Log acceptance (replace with actual API call)
  console.log('Terms accepted:', {
   business: businessName,
   acceptedAt: new Date().toISOString(),
   version: '2.0'
  });

  // You can trigger additional actions here
  // e.g., enable premium features, redirect to dashboard, etc.
 }
}

// Helper function to update the modal with new data
function update_terms_condi_data(newData) {
 const modal = document.getElementById('terms_condi');
 if (modal) {
  set_terms_condi_innerHTML(newData);
 } else {
  console.warn('Terms & Conditions modal not found, creating new one');
  set_terms_condi_innerHTML(newData);
 }
}

// Helper function to get current terms data from the modal
function get_terms_condi_data() {
 const modal = document.getElementById('terms_condi');
 if (modal) {
  const dataAttr = modal.getAttribute('data-terms-data');
  if (dataAttr) {
   return JSON.parse(dataAttr);
  }
 }
 return null;
}

// Helper function to check if user has accepted terms
function hasUserAcceptedTerms() {
 // This can be connected to your backend/user session
 // For now, returns false
 return false;
}

// Add to global window object for access from modal buttons
window.acceptTermsAndConditions = acceptTermsAndConditions;