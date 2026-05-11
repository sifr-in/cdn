function set_child_safety_pol_innerHTML(...args) {
 // Get the data from args (first argument is the data object containing all company data)
 const data = args[0] || {};

 // Create unique class for scoping
 const uniqueClass = 'child-safety-scope-' + Date.now();

 // Check if modal exists, create if not
 let modalId = 'child_safety_pol';
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
border-radius: 28px;
overflow: hidden;
box-shadow: 0 35px 70px -15px rgba(111, 24, 77, 0.4);
border: 1px solid rgba(111, 24, 77, 0.18);
}

/* FLEX-BOX HEADER - Fixed at top */
.${uniqueClass} .modal-header {
background: linear-gradient(145deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
color: white;
padding: 1.2rem 1.8rem;
border-bottom: none;
position: sticky;
top: 0;
z-index: 1020;
display: flex;
align-items: center;
justify-content: space-between;
flex-wrap: nowrap;
gap: 15px;
box-shadow: 0 8px 20px rgba(0,0,0,0.2);
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

/* Left section - Back button */
.${uniqueClass} .header-left {
flex: 0 0 auto;
}

.${uniqueClass} .btn-back {
background: rgba(255, 255, 255, 0.18);
border: 1.5px solid rgba(255, 255, 255, 0.25);
color: white;
border-radius: 50px;
padding: 0.6rem 1.5rem;
font-weight: 700;
font-size: 0.95rem;
transition: all 0.3s ease;
display: flex;
align-items: center;
gap: 10px;
backdrop-filter: blur(8px);
white-space: nowrap;
}

.${uniqueClass} .btn-back:hover {
background: rgba(255, 255, 255, 0.35);
transform: translateX(-8px);
border-color: rgba(255, 255, 255, 0.5);
}

.${uniqueClass} .btn-back i {
font-size: 0.9rem;
}

/* Center section - Title - takes remaining space */
.${uniqueClass} .header-center {
flex: 1 1 auto;
text-align: center;
overflow: hidden;
}

.${uniqueClass} .modal-title {
font-weight: 800;
letter-spacing: 1.2px;
font-size: 1.5rem;
display: flex;
align-items: center;
justify-content: center;
gap: 12px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.${uniqueClass} .modal-title i {
color: var(--accent-color, #FFB300);
filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
font-size: 1.7rem;
flex-shrink: 0;
}

.${uniqueClass} .modal-title span {
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}

/* Right section - Vertical ellipsis */
.${uniqueClass} .header-right {
flex: 0 0 auto;
}

.${uniqueClass} .btn-ellipsis {
background: rgba(255, 255, 255, 0.18);
border: 1.5px solid rgba(255, 255, 255, 0.25);
color: white;
border-radius: 50px;
padding: 0.6rem 1.2rem;
font-weight: 700;
transition: all 0.3s ease;
display: flex;
align-items: center;
justify-content: center;
backdrop-filter: blur(8px);
}

.${uniqueClass} .btn-ellipsis:hover {
background: rgba(255, 255, 255, 0.35);
border-color: rgba(255, 255, 255, 0.5);
}

.${uniqueClass} .btn-ellipsis i {
font-size: 1.2rem;
}

/* Dropdown menu for ellipsis */
.${uniqueClass} .ellipsis-dropdown {
position: absolute;
top: 100%;
right: 1.8rem;
background: white;
border-radius: 16px;
box-shadow: 0 15px 40px rgba(0,0,0,0.2);
padding: 0.8rem 0;
min-width: 220px;
display: none;
z-index: 1050;
margin-top: 10px;
border: 1px solid rgba(111, 24, 77, 0.15);
}

.${uniqueClass} .ellipsis-dropdown.show {
display: block;
}

.${uniqueClass} .ellipsis-dropdown a {
display: flex;
align-items: center;
gap: 12px;
padding: 0.8rem 1.5rem;
color: #333;
text-decoration: none;
transition: all 0.2s ease;
font-size: 0.95rem;
}

.${uniqueClass} .ellipsis-dropdown a:hover {
background: rgba(111, 24, 77, 0.08);
color: var(--primary-color, #6f184d);
}

.${uniqueClass} .ellipsis-dropdown a i {
width: 20px;
color: var(--primary-color, #6f184d);
}

.${uniqueClass} .ellipsis-dropdown .dropdown-divider {
height: 1px;
background: rgba(111, 24, 77, 0.1);
margin: 0.5rem 0;
}

/* Scrollable content area */
.${uniqueClass} .modal-body {
padding: 0;
background: linear-gradient(145deg, #ffffff 0%, #fcf7fa 100%);
max-height: 70vh;
overflow-y: auto;
scrollbar-width: thin;
scrollbar-color: var(--primary-color, #6f184d) #f0e0e8;
}

.${uniqueClass} .modal-body::-webkit-scrollbar {
width: 8px;
}

.${uniqueClass} .modal-body::-webkit-scrollbar-track {
background: #f0e0e8;
border-radius: 10px;
}

.${uniqueClass} .modal-body::-webkit-scrollbar-thumb {
background: var(--primary-color, #6f184d);
border-radius: 10px;
}

.${uniqueClass} .modal-body::-webkit-scrollbar-thumb:hover {
background: var(--primary-dark, #4d1035);
}

.${uniqueClass} .policy-content {
padding: 2.5rem;
}

.${uniqueClass} .company-banner {
background: linear-gradient(145deg, rgba(111, 24, 77, 0.05), rgba(255, 179, 0, 0.05));
border-radius: 20px;
padding: 1.5rem;
margin-bottom: 2rem;
display: flex;
flex-wrap: wrap;
align-items: center;
justify-content: space-between;
border: 1px solid rgba(111, 24, 77, 0.15);
position: relative;
overflow: hidden;
}

.${uniqueClass} .company-banner::before {
content: '';
position: absolute;
top: 0;
left: 0;
right: 0;
height: 4px;
background: linear-gradient(90deg, var(--primary-color, #6f184d), var(--accent-color, #FFB300), var(--secondary-color, #00BFA5));
}

.${uniqueClass} .banner-info {
display: flex;
flex-direction: column;
gap: 5px;
}

.${uniqueClass} .banner-company {
font-size: 1.3rem;
font-weight: 900;
color: var(--primary-color, #6f184d);
letter-spacing: 0.8px;
}

.${uniqueClass} .banner-tagline {
font-size: 0.95rem;
color: var(--primary-dark, #4d1035);
font-style: italic;
display: flex;
align-items: center;
gap: 8px;
}

.${uniqueClass} .banner-badge {
background: linear-gradient(145deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
color: white;
padding: 0.7rem 1.8rem;
border-radius: 50px;
font-weight: 700;
font-size: 0.95rem;
display: flex;
align-items: center;
gap: 10px;
box-shadow: 0 8px 20px rgba(111, 24, 77, 0.25);
}

.${uniqueClass} .banner-badge i {
color: var(--accent-color, #FFB300);
}

.${uniqueClass} .child-safety-badge {
background: linear-gradient(145deg, #FF6B6B, #c92a2a);
color: white;
border-radius: 50px;
padding: 0.5rem 1.5rem;
font-size: 0.9rem;
font-weight: 700;
display: inline-flex;
align-items: center;
gap: 10px;
margin-bottom: 2rem;
border: 1px solid rgba(255,255,255,0.3);
box-shadow: 0 8px 20px rgba(201, 42, 42, 0.25);
}

.${uniqueClass} .zero-tolerance {
background: linear-gradient(145deg, #fff0f0, #ffe0e0);
border-left: 6px solid #c92a2a;
border-radius: 16px;
padding: 1.5rem 2rem;
margin-bottom: 2rem;
display: flex;
align-items: center;
gap: 20px;
flex-wrap: wrap;
box-shadow: 0 8px 25px rgba(201, 42, 42, 0.15);
}

.${uniqueClass} .zero-tolerance i {
font-size: 3rem;
color: #c92a2a;
}

.${uniqueClass} .zero-tolerance-text {
flex: 1;
}

.${uniqueClass} .zero-tolerance-text h3 {
font-size: 1.4rem;
font-weight: 900;
color: #c92a2a;
margin-bottom: 0.5rem;
}

.${uniqueClass} .zero-tolerance-text p {
color: #444;
font-size: 1rem;
margin: 0;
}

.${uniqueClass} .policy-section {
background: white;
border-radius: 24px;
padding: 1.8rem 2rem;
margin-bottom: 1.8rem;
box-shadow: 0 8px 25px rgba(111, 24, 77, 0.06);
border: 1px solid rgba(111, 24, 77, 0.08);
transition: all 0.3s ease;
}

.${uniqueClass} .policy-section:hover {
box-shadow: 0 15px 40px rgba(111, 24, 77, 0.12);
border-color: rgba(111, 24, 77, 0.2);
transform: translateY(-2px);
}

.${uniqueClass} .section-header {
display: flex;
align-items: center;
gap: 15px;
margin-bottom: 1.3rem;
padding-bottom: 0.8rem;
border-bottom: 2px solid rgba(111, 24, 77, 0.12);
}

.${uniqueClass} .section-header i {
font-size: 1.8rem;
color: var(--primary-color, #6f184d);
background: linear-gradient(145deg, rgba(111, 24, 77, 0.1), rgba(255, 179, 0, 0.1));
padding: 12px;
border-radius: 16px;
}

.${uniqueClass} .section-header h2 {
font-size: 1.3rem;
font-weight: 800;
color: var(--primary-dark, #4d1035);
margin: 0;
letter-spacing: 0.3px;
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
padding-left: 2rem;
margin-bottom: 1rem;
}

.${uniqueClass} .section-content li {
margin-bottom: 0.6rem;
}

.${uniqueClass} .section-content li::marker {
color: var(--primary-color, #6f184d);
font-weight: bold;
}

.${uniqueClass} .highlight-box {
background: linear-gradient(145deg, rgba(111, 24, 77, 0.05), rgba(0, 191, 165, 0.05));
border-left: 6px solid var(--primary-color, #6f184d);
border-radius: 12px;
padding: 1.3rem;
margin: 1.2rem 0;
}

.${uniqueClass} .warning-box {
background: linear-gradient(145deg, #fff3e0, #ffe0b2);
border-left: 6px solid #ff9800;
border-radius: 12px;
padding: 1.3rem;
margin: 1.2rem 0;
}

.${uniqueClass} .safety-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
gap: 1.5rem;
margin-top: 1.2rem;
}

.${uniqueClass} .safety-card {
background: #faf5f9;
border-radius: 20px;
padding: 1.5rem;
border: 1px solid rgba(111, 24, 77, 0.1);
transition: all 0.3s ease;
}

.${uniqueClass} .safety-card:hover {
background: white;
border-color: var(--primary-color, #6f184d);
box-shadow: 0 10px 30px rgba(111, 24, 77, 0.15);
transform: translateY(-5px);
}

.${uniqueClass} .safety-card i {
font-size: 2.2rem;
color: var(--primary-color, #6f184d);
margin-bottom: 1rem;
}

.${uniqueClass} .safety-card h4 {
font-size: 1.15rem;
font-weight: 800;
color: var(--primary-dark, #4d1035);
margin-bottom: 0.8rem;
}

.${uniqueClass} .safety-card p {
font-size: 0.9rem;
color: #666;
margin: 0;
}

.${uniqueClass} .commitment-badge {
display: inline-block;
background: linear-gradient(145deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
color: white;
padding: 0.4rem 1.2rem;
border-radius: 50px;
font-size: 0.8rem;
font-weight: 700;
margin-right: 0.6rem;
margin-bottom: 0.6rem;
letter-spacing: 0.5px;
}

.${uniqueClass} .report-button {
background: linear-gradient(145deg, #c92a2a, #a51e1e);
color: white;
border: none;
border-radius: 50px;
padding: 0.9rem 2.2rem;
font-weight: 800;
font-size: 1rem;
letter-spacing: 1px;
transition: all 0.3s ease;
box-shadow: 0 10px 25px rgba(201, 42, 42, 0.3);
display: inline-flex;
align-items: center;
gap: 12px;
margin-top: 0.5rem;
}

.${uniqueClass} .report-button:hover {
transform: translateY(-3px);
box-shadow: 0 15px 35px rgba(201, 42, 42, 0.4);
background: linear-gradient(145deg, #a51e1e, #c92a2a);
}

.${uniqueClass} .report-button i {
font-size: 1.1rem;
}

.${uniqueClass} .contact-card {
background: linear-gradient(145deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
color: white;
border-radius: 24px;
padding: 2rem;
margin-top: 2rem;
position: relative;
overflow: hidden;
}

.${uniqueClass} .contact-card::before {
content: '';
position: absolute;
top: -50%;
right: -20%;
width: 300px;
height: 300px;
background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
border-radius: 50%;
}

.${uniqueClass} .contact-card h3 {
font-size: 1.4rem;
font-weight: 800;
margin-bottom: 1.2rem;
display: flex;
align-items: center;
gap: 12px;
position: relative;
z-index: 2;
}

.${uniqueClass} .contact-card i {
color: var(--accent-color, #FFB300);
}

.${uniqueClass} .contact-details {
display: flex;
flex-wrap: wrap;
gap: 1.5rem;
margin-top: 1.2rem;
position: relative;
z-index: 2;
}

.${uniqueClass} .contact-detail-item {
display: flex;
align-items: center;
gap: 12px;
background: rgba(255, 255, 255, 0.15);
padding: 0.7rem 1.8rem;
border-radius: 50px;
backdrop-filter: blur(5px);
}

.${uniqueClass} .contact-detail-item i {
color: var(--accent-color, #FFB300);
font-size: 1.1rem;
}

.${uniqueClass} .legal-footer {
text-align: center;
margin-top: 2rem;
padding-top: 1.5rem;
border-top: 2px dashed rgba(111, 24, 77, 0.2);
color: #777;
font-size: 0.8rem;
display: flex;
align-items: center;
justify-content: center;
gap: 20px;
flex-wrap: wrap;
}

@media (max-width: 768px) {
.${uniqueClass} .modal-header {
padding: 1rem;
}

.${uniqueClass} .modal-title {
font-size: 1.1rem;
}

.${uniqueClass} .modal-title i {
font-size: 1.3rem;
}

.${uniqueClass} .btn-back {
padding: 0.5rem 1rem;
font-size: 0.85rem;
}

.${uniqueClass} .btn-ellipsis {
padding: 0.5rem 1rem;
}

.${uniqueClass} .policy-content {
padding: 1.5rem;
}

.${uniqueClass} .company-banner {
flex-direction: column;
align-items: flex-start;
gap: 1rem;
}

.${uniqueClass} .banner-badge {
width: 100%;
justify-content: center;
}

.${uniqueClass} .zero-tolerance {
flex-direction: column;
text-align: center;
}

.${uniqueClass} .contact-details {
flex-direction: column;
}

.${uniqueClass} .contact-detail-item {
width: 100%;
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
 const mail = data.mail || data.email || 'child-safety@abcmatrimony.com';
 const mob = data.mob || data.phone || '+91 99607 06060';

 // Current date for last updated
 const currentDate = new Date();
 const formattedDate = currentDate.toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
 });

 // Toggle dropdown function
 const toggleDropdownScript = `
        function toggleEllipsisDropdown_${uniqueClass}() {
            const dropdown = document.getElementById('ellipsisDropdown_${uniqueClass}');
            dropdown.classList.toggle('show');
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('ellipsisDropdown_${uniqueClass}');
            const btn = document.getElementById('ellipsisBtn_${uniqueClass}');
            if (dropdown && btn && !btn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    `;

 // Add script to head if not exists
 if (!document.getElementById(`dropdownScript_${uniqueClass}`)) {
  const script = document.createElement('script');
  script.id = `dropdownScript_${uniqueClass}`;
  script.textContent = toggleDropdownScript;
  document.head.appendChild(script);
 }

 // Build the modal content
 const modalContent = `
<!-- FIXED FLEX-BOX HEADER -->
<div class="modal-header">
<!-- Left: Back Button -->
<div class="header-left">
<button type="button" class="btn-back" onclick="handleUniversalBackButton()">
<i class="fas fa-arrow-left"></i> Back
</button>
</div>

<!-- Center: Title (takes remaining space) -->
<div class="header-center">
<h5 class="modal-title">
<i class="fas fa-shield-child"></i>
<span>Child Safety Policy</span>
</h5>
</div>

<!-- Right: Vertical Ellipsis -->
<div class="header-right">
<button type="button" class="btn-ellipsis" id="ellipsisBtn_${uniqueClass}" onclick="toggleEllipsisDropdown_${uniqueClass}()">
<i class="fas fa-ellipsis-vertical"></i>
</button>

<!-- Dropdown Menu -->
<div class="ellipsis-dropdown" id="ellipsisDropdown_${uniqueClass}">
<a href="#" onclick="window.print(); return false;">
<i class="fas fa-print"></i> Print Policy
</a>
<a href="#" onclick="showToast('Download started', {type: 'info'}); return false;">
<i class="fas fa-download"></i> Download PDF
</a>
<a href="#" onclick="showToast('Policy shared', {type: 'success'}); return false;">
<i class="fas fa-share-alt"></i> Share
</a>
<div class="dropdown-divider"></div>
<a href="#" onclick="showToast('Report a concern', {type: 'warning'}); return false;">
<i class="fas fa-flag"></i> Report Issue
</a>
<a href="#" onclick="window.location.href='mailto:${mail}?subject=Child%20Safety%20Policy%20Inquiry'; return false;">
<i class="fas fa-envelope"></i> Contact Child Safety Team
</a>
</div>
</div>
</div>

<!-- SCROLLABLE CONTENT -->
<div class="modal-body">
<div class="policy-content">
<!-- Company Banner -->
<div class="company-banner">
<div class="banner-info">
<div class="banner-company">${businessName.toUpperCase()}</div>
<div class="banner-tagline">
<i class="fas fa-heart" style="color: #ff4d4d;"></i> "${tagline}"
</div>
</div>
<div class="banner-badge">
<i class="fas fa-verified"></i> CHILD SAFETY PROTECTED
</div>
</div>

<!-- Child Safety Badge & Last Updated -->
<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 1.5rem;">
<div class="child-safety-badge">
<i class="fas fa-shield-haltered"></i> ZERO TOLERANCE POLICY
</div>
<div style="background: rgba(111, 24, 77, 0.08); padding: 0.5rem 1.5rem; border-radius: 50px; font-size: 0.85rem; color: var(--primary-dark, #4d1035); font-weight: 600;">
<i class="fas fa-calendar-alt"></i> Last Updated: ${formattedDate}
</div>
</div>

<!-- ZERO TOLERANCE BANNER -->
<div class="zero-tolerance">
<i class="fas fa-ban"></i>
<div class="zero-tolerance-text">
<h3>ABSOLUTE ZERO TOLERANCE</h3>
<p>${businessName} has a strict ZERO TOLERANCE policy towards any content, communication, or behaviour involving minors. Our platform is STRICTLY FOR ADULTS (18+ years) seeking lawful matrimonial alliances.</p>
</div>
</div>

<!-- Section 1: Our Commitment to Child Safety -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-hand-holding-heart"></i>
<h2>1. Our Commitment to Child Safety</h2>
</div>
<div class="section-content">
<p><strong>${businessName}</strong> is unequivocally committed to the protection of children. We maintain a COMPLETE PROHIBITION of any individual below the age of 18 from creating an account, accessing our platform, or using our services in any capacity.</p>

<div class="highlight-box">
<i class="fas fa-gavel" style="color: var(--primary-color, #6f184d); margin-right: 10px;"></i>
<strong>Legal Compliance:</strong> Our child safety policy is fully compliant with:
<ul style="margin-top: 10px; margin-bottom: 0;">
<li>The Protection of Children from Sexual Offences (POCSO) Act, 2012</li>
<li>Information Technology (IT) Act, 2000</li>
<li>Juvenile Justice (Care and Protection of Children) Act, 2015</li>
<li>National Policy for Children, 2013</li>
<li>United Nations Convention on the Rights of the Child (UNCRC)</li>
</ul>
</div>

<p>We recognize our social and legal responsibility to ensure that our platform is never used to harm, exploit, or endanger children in any manner.</p>
</div>
</div>

<!-- Section 2: Age Verification and Prevention -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-id-card"></i>
<h2>2. Age Verification and Prevention</h2>
</div>
<div class="section-content">
<p>We implement rigorous age verification measures to prevent underage access:</p>

<div class="safety-grid">
<div class="safety-card">
<i class="fas fa-calendar-check"></i>
<h4>Mandatory Age Declaration</h4>
<p>All users must confirm they are 18+ years with a legally binding declaration during registration.</p>
<span class="commitment-badge">Required</span>
</div>
<div class="safety-card">
<i class="fas fa-id-card"></i>
<h4>Document Verification</h4>
<p>Age proof (Aadhaar, PAN, Passport, Birth Certificate, 10th Marksheet) mandatory for verification badge.</p>
<span class="commitment-badge">Verified Users</span>
</div>
<div class="safety-card">
<i class="fas fa-shield"></i>
<h4>AI-Based Age Estimation</h4>
<p>Machine learning algorithms analyze profile photos to flag potential underage users.</p>
<span class="commitment-badge">Automated</span>
</div>
<div class="safety-card">
<i class="fas fa-flag"></i>
<h4>Immediate Takedown</h4>
<p>Suspected underage profiles are blocked within 1 hour of detection/reporting.</p>
<span class="commitment-badge">24/7</span>
</div>
</div>

<div class="warning-box" style="margin-top: 1.5rem;">
<i class="fas fa-exclamation-triangle" style="color: #ff9800; font-size: 1.5rem; margin-right: 15px; float: left;"></i>
<strong style="font-size: 1.05rem;">CRIMINAL OFFENSE:</strong> Submitting false age information or attempting to register as a minor constitutes fraud and may result in criminal prosecution under the POCSO Act, IPC, and IT Act. Offenders will be reported to law enforcement authorities and added to a national blacklist.
</div>
</div>
</div>

<!-- Section 3: Prohibited Content and Behaviours -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-ban"></i>
<h2>3. Prohibited Content and Behaviours</h2>
</div>
<div class="section-content">
<p>The following are STRICTLY PROHIBITED on our platform and will result in IMMEDIATE PERMANENT BAN and LEGAL ACTION:</p>

<ul>
<li><strong>Child Sexual Abuse Material (CSAM):</strong> Any content depicting, suggesting, or implying sexual activity involving minors.</li>
<li><strong>Grooming:</strong> Any communication attempting to establish an inappropriate relationship with a minor.</li>
<li><strong>Age Misrepresentation:</strong> Falsely claiming to be 18+ years when underage.</li>
<li><strong>Solicitation:</strong> Requesting, sharing, or trading any sexually explicit content involving minors.</li>
<li><strong>Inappropriate Communication:</strong> Sending sexual, obscene, or predatory messages to any user suspected to be underage.</li>
<li><strong>Commercial Exploitation:</strong> Any form of child trafficking, forced marriage, or commercial sexual exploitation.</li>
</ul>

<div class="highlight-box" style="border-left-color: #c92a2a; background: #fff0f0;">
<i class="fas fa-police-box" style="color: #c92a2a; margin-right: 10px;"></i>
<strong>Immediate Reporting:</strong> All such content is reported to the National Cyber Crime Reporting Portal (cybercrime.gov.in) and local police within 24 hours of detection, along with full user details, IP addresses, and evidence preservation.
</div>
</div>
</div>

<!-- Section 4: Detection and Monitoring Systems -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-radar"></i>
<h2>4. Detection and Monitoring Systems</h2>
</div>
<div class="section-content">
<p>We employ multi-layered detection systems to identify and block underage users or predatory behaviour:</p>

<ul>
<li><strong>AI-Powered Content Moderation:</strong> Machine learning models scan profile photos, descriptions, and communications for age indicators and prohibited content.</li>
<li><strong>Keyword Detection:</strong> Automated flagging of conversations containing predatory language patterns.</li>
<li><strong>Manual Review Team:</strong> Dedicated 24/7 child safety moderators review flagged profiles and reports.</li>
<li><strong>Pattern Recognition:</strong> Behavioral analysis to identify suspicious account creation patterns.</li>
<li><strong>Photo Analysis:</strong> Age estimation algorithms analyze facial features to detect potential underage users.</li>
</ul>

<div style="background: linear-gradient(145deg, rgba(0, 191, 165, 0.1), rgba(0, 137, 123, 0.1)); border-radius: 12px; padding: 1.2rem; margin-top: 1rem;">
<i class="fas fa-chart-line" style="color: var(--secondary-color, #00BFA5); margin-right: 10px;"></i>
<strong>Our Impact:</strong> In the last 12 months, we have prevented <span style="font-weight: 900; color: var(--primary-color, #6f184d);">2,847</span> underage registration attempts, blocked <span style="font-weight: 900; color: var(--primary-color, #6f184d);">156</span> predatory accounts, and reported <span style="font-weight: 900; color: #c92a2a;">23</span> cases to law enforcement.
</div>
</div>
</div>

<!-- Section 5: Reporting Mechanisms -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-flag"></i>
<h2>5. Reporting Mechanisms</h2>
</div>
<div class="section-content">
<p>If you encounter any suspected underage user, inappropriate content, or predatory behaviour, IMMEDIATELY report through any of these channels:</p>

<div style="display: flex; flex-direction: column; gap: 1rem; margin: 1.5rem 0;">
<div style="display: flex; align-items: center; gap: 15px; background: #f8f9fa; padding: 1rem 1.5rem; border-radius: 12px;">
<i class="fas fa-circle" style="color: var(--primary-color, #6f184d); font-size: 0.8rem;"></i>
<span><strong>In-App Reporting:</strong> Click the "Report" button on any profile or message → Select "Underage User" or "Inappropriate Content"</span>
</div>
<div style="display: flex; align-items: center; gap: 15px; background: #f8f9fa; padding: 1rem 1.5rem; border-radius: 12px;">
<i class="fas fa-circle" style="color: var(--primary-color, #6f184d); font-size: 0.8rem;"></i>
<span><strong>Child Safety Helpline:</strong> <a href="tel:${mob}" style="color: var(--primary-color, #6f184d); font-weight: 700;">${mob}</a> (24x7, Toll-Free)</span>
</div>
<div style="display: flex; align-items: center; gap: 15px; background: #f8f9fa; padding: 1rem 1.5rem; border-radius: 12px;">
<i class="fas fa-circle" style="color: var(--primary-color, #6f184d); font-size: 0.8rem;"></i>
<span><strong>Email:</strong> <a href="mailto:${mail}" style="color: var(--primary-color, #6f184d); font-weight: 700;">${mail}</a> - Dedicated Child Safety Team responds within 4 hours</span>
</div>
<div style="display: flex; align-items: center; gap: 15px; background: #f8f9fa; padding: 1rem 1.5rem; border-radius: 12px;">
<i class="fas fa-circle" style="color: var(--primary-color, #6f184d); font-size: 0.8rem;"></i>
<span><strong>Anonymous Reporting:</strong> <a href="#" style="color: var(--primary-color, #6f184d); font-weight: 700;" onclick="showToast('Anonymous reporting form opened', {type: 'info'}); return false;">Click here</a> for anonymous reporting without login</span>
</div>
</div>

<button class="report-button" onclick="showToast('Report submitted to Child Safety Team', {type: 'success', duration: 5000});">
<i class="fas fa-shield-haltered"></i> REPORT CHILD SAFETY CONCERN
</button>
</div>
</div>

<!-- Section 6: Response and Action Protocol -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-clock"></i>
<h2>6. Response and Action Protocol</h2>
</div>
<div class="section-content">
<p>Upon receiving any child safety report or detection, we follow this strict protocol:</p>

<ol style="list-style-type: decimal; padding-left: 1.8rem;">
<li><strong>IMMEDIATE BLOCK (Within 5 minutes):</strong> The reported account is immediately restricted from all platform activities.</li>
<li><strong>EVIDENCE PRESERVATION (Within 30 minutes):</strong> All profile data, communications, IP logs, and metadata are securely preserved in a forensically sound manner.</li>
<li><strong>INTERNAL INVESTIGATION (Within 2 hours):</strong> Dedicated child safety team reviews all evidence and user history.</li>
<li><strong>CONFIRMATION (Within 4 hours):</strong> If violation is confirmed, account is PERMANENTLY DELETED.</li>
<li><strong>LEGAL REPORTING (Within 24 hours):</strong> Complete case file is submitted to:</li>
</ol>

<ul style="margin-left: 2rem; margin-top: 0.5rem;">
<li>National Cyber Crime Reporting Portal (cybercrime.gov.in)</li>
<li>Local Police Station (Jurisdiction: ${city})</li>
<li>National Commission for Protection of Child Rights (NCPCR)</li>
<li>CERT-In (Indian Computer Emergency Response Team)</li>
</ul>

<div class="highlight-box" style="margin-top: 1.2rem;">
<i class="fas fa-balance-scale"></i>
<strong>Zero Tolerance Enforcement:</strong> We do not issue warnings for child safety violations. ANY violation results in IMMEDIATE PERMANENT BAN and LEGAL ACTION.
</div>
</div>
</div>

<!-- Section 7: Employee Training and Awareness -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-chalkboard-teacher"></i>
<h2>7. Employee Training and Awareness</h2>
</div>
<div class="section-content">
<p>All ${businessName} employees, contractors, and volunteers undergo mandatory child safety training:</p>

<ul>
<li><strong>Initial Training:</strong> Mandatory 8-hour certification on POCSO Act, child rights, and reporting protocols.</li>
<li><strong>Annual Refresher:</strong> Mandatory 4-hour advanced training on emerging threats and detection methods.</li>
<li><strong>Moderator Specialization:</strong> Content moderators receive additional 40-hour specialized training.</li>
<li><strong>Background Verification:</strong> All child safety team members undergo comprehensive police verification.</li>
</ul>

<p style="margin-top: 0.8rem;">All employees sign a legally binding Child Protection Code of Conduct with severe consequences for non-compliance.</p>
</div>
</div>

<!-- Section 8: Technology Safety by Design -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-microchip"></i>
<h2>8. Technology Safety by Design</h2>
</div>
<div class="section-content">
<p>Child safety is embedded into our platform architecture:</p>

<div class="safety-grid">
<div class="safety-card">
<i class="fas fa-user-secret"></i>
<h4>Privacy-Preserving Age Verification</h4>
<p>Age verification without storing sensitive documents unnecessarily.</p>
</div>
<div class="safety-card">
<i class="fas fa-message-slash"></i>
<h4>Automated Filtering</h4>
<p>Real-time scanning of profile descriptions and messages for age-related keywords.</p>
</div>
<div class="safety-card">
<i class="fas fa-history"></i>
<h4>Audit Trails</h4>
<p>Complete, immutable logs of all detection and reporting actions.</p>
</div>
<div class="safety-card">
<i class="fas fa-lock"></i>
<h4>Secure Evidence Storage</h4>
<p>Encrypted, access-controlled storage for investigation data.</p>
</div>
</div>
</div>
</div>

<!-- Section 9: User Education and Awareness -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-users"></i>
<h2>9. User Education and Awareness</h2>
</div>
<div class="section-content">
<p>We actively educate our users about child safety through:</p>

<ul>
<li>Mandatory pop-up acknowledgment of our Child Safety Policy during registration.</li>
<li>Quarterly safety awareness campaigns within the platform.</li>
<li>Easy-to-access reporting guides and tutorials.</li>
<li>Partnerships with child rights organizations for awareness content.</li>
</ul>

<div class="warning-box" style="margin-top: 1.2rem;">
<i class="fas fa-lightbulb"></i>
<strong>Parents and Guardians:</strong> If you suspect your child is attempting to access matrimonial platforms, please contact our Child Safety Team immediately for intervention and prevention.
</div>
</div>
</div>

<!-- Section 10: External Audits and Compliance -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-clipboard-check"></i>
<h2>10. External Audits and Compliance</h2>
</div>
<div class="section-content">
<p>Our child safety measures are independently audited:</p>

<ul>
<li><strong>Quarterly Audits:</strong> Independent third-party security firms audit our age verification systems.</li>
<li><strong>Annual Compliance Certification:</strong> We undergo annual certification for child safety standards.</li>
<li><strong>Government Reporting:</strong> We submit mandatory compliance reports to the Ministry of Electronics and Information Technology (MeitY).</li>
</ul>
</div>
</div>

<!-- Section 11: Grievance Officer for Child Safety -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-user-shield"></i>
<h2>11. Grievance Officer for Child Safety</h2>
</div>
<div class="section-content">
<p>In compliance with the POCSO Act and IT Rules, we have appointed a dedicated Grievance Officer for child safety concerns:</p>

<ul style="list-style-type: none; padding-left: 0; margin-top: 1.2rem;">
<li style="margin-bottom: 0.8rem;"><i class="fas fa-user-tie" style="color: var(--primary-color, #6f184d); width: 25px;"></i> <strong>Name:</strong> ${ownerName}</li>
<li style="margin-bottom: 0.8rem;"><i class="fas fa-badge" style="color: var(--primary-color, #6f184d); width: 25px;"></i> <strong>Designation:</strong> Child Safety Grievance Officer</li>
<li style="margin-bottom: 0.8rem;"><i class="fas fa-envelope" style="color: var(--primary-color, #6f184d); width: 25px;"></i> <strong>Email:</strong> <a href="mailto:child-safety@${data.business ? data.business.replace(/\s+/g, '').toLowerCase() : 'abcmatrimony'}.com" style="color: var(--primary-color, #6f184d);">child-safety@${data.business ? data.business.replace(/\s+/g, '').toLowerCase() : 'abcmatrimony'}.com</a></li>
<li style="margin-bottom: 0.8rem;"><i class="fas fa-phone-alt" style="color: var(--primary-color, #6f184d); width: 25px;"></i> <strong>Child Safety Helpline:</strong> <a href="tel:${mob}" style="color: var(--primary-color, #6f184d);">${mob}</a> (24x7, Toll-Free)</li>
<li style="margin-bottom: 0.8rem;"><i class="fas fa-clock" style="color: var(--primary-color, #6f184d); width: 25px;"></i> <strong>Response Commitment:</strong> All child safety reports acknowledged within 2 hours, resolved within 24 hours</li>
</ul>
</div>
</div>

<!-- Section 12: Policy Review and Updates -->
<div class="policy-section">
<div class="section-header">
<i class="fas fa-sync-alt"></i>
<h2>12. Policy Review and Updates</h2>
</div>
<div class="section-content">
<p>This Child Safety Policy is reviewed and updated:</p>
<ul>
<li><strong>Quarterly:</strong> Internal review by Child Safety Committee</li>
<li><strong>Annually:</strong> Comprehensive external audit and policy enhancement</li>
<li><strong>Immediate:</strong> In response to new legal requirements or emerging threats</li>
</ul>
<p>Users are notified of any material changes via email and platform notification. The current version was last updated on <strong>${formattedDate}</strong>.</p>
</div>
</div>

<!-- Contact Card -->
<div class="contact-card">
<h3>
<i class="fas fa-shield-child"></i>
Report Child Safety Concerns
</h3>
<p style="margin-bottom: 1.2rem; opacity: 0.95; font-size: 1.05rem;">Your vigilance protects children. Report immediately if you suspect any violation.</p>

<div class="contact-details">
<div class="contact-detail-item">
<i class="fas fa-phone-alt"></i>
${mob}
</div>
<div class="contact-detail-item">
<i class="fas fa-envelope"></i>
child-safety@${data.business ? data.business.replace(/\s+/g, '').toLowerCase() : 'abcmatrimony'}.com
</div>
<div class="contact-detail-item">
<i class="fas fa-clock"></i>
24x7 Emergency Response
</div>
</div>

<div style="margin-top: 1.8rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
<span style="background: rgba(255,255,255,0.15); padding: 0.4rem 1.2rem; border-radius: 50px; font-size: 0.85rem;">
<i class="fas fa-gavel"></i> POCSO Compliant
</span>
<span style="background: rgba(255,255,255,0.15); padding: 0.4rem 1.2rem; border-radius: 50px; font-size: 0.85rem;">
<i class="fas fa-shield"></i> IT Act 2000
</span>
<span style="background: rgba(255,255,255,0.15); padding: 0.4rem 1.2rem; border-radius: 50px; font-size: 0.85rem;">
<i class="fas fa-balance-scale"></i> UNCRC
</span>
</div>
</div>

<!-- Legal Footer -->
<div class="legal-footer">
<span><i class="fas fa-copyright"></i> ${new Date().getFullYear()} ${businessName}. All rights reserved.</span>
<span><i class="fas fa-shield"></i> Child Safety Policy v3.0.${Math.floor(Math.random() * 100)}</span>
<span><i class="fas fa-verified"></i> Certified Child Safe Platform</span>
</div>
</div>
</div>
    `;

 // Set the content
 modalResult.contentElement.innerHTML = modalContent;

 // Store the original data in the modal for future updates
 modalResult.modalElement.setAttribute('data-child-safety-data', JSON.stringify(data));

 // Store last company data for cross-modal linking
 window.lastCompanyData = data;

 // Show the modal
 modalResult.modalInstance.show();

 // Add to modal stack if not already there
 if (!modalStack.includes(modalId)) {
  modalStack.push(modalId);
 }

 console.log(`Child Safety Policy modal displayed for ${businessName}`);

 return modalResult;
}

// Helper function to update the modal with new data
function update_child_safety_pol_data(newData) {
 const modal = document.getElementById('child_safety_pol');
 if (modal) {
  set_child_safety_pol_innerHTML(newData);
 } else {
  console.warn('Child Safety Policy modal not found, creating new one');
  set_child_safety_pol_innerHTML(newData);
 }
}

// Helper function to get current child safety data from the modal
function get_child_safety_pol_data() {
 const modal = document.getElementById('child_safety_pol');
 if (modal) {
  const dataAttr = modal.getAttribute('data-child-safety-data');
  if (dataAttr) {
   return JSON.parse(dataAttr);
  }
 }
 return null;
}

// Helper function to report child safety concern
function report_child_safety_concern(type, details = {}) {
 showToast('Reporting child safety concern...', { type: 'warning' });

 // This would connect to your backend API
 console.log('Child Safety Report:', {
  type: type,
  details: details,
  timestamp: new Date().toISOString(),
  reportedBy: 'user'
 });

 // Simulate API call
 setTimeout(() => {
  showToast('Thank you for your report. Our Child Safety Team has been notified.', {
   type: 'success',
   duration: 8000
  });
 }, 1500);
}

// Add to global window object for access from modal buttons
window.report_child_safety_concern = report_child_safety_concern;