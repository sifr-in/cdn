function set_abot_us_innerHTML(...args) {
 // Get the data from args (first argument is the data object)
 const data = args[0] || {};

 // Create unique class for scoping
 const uniqueClass = 'abtus-scope-' + Date.now();

 // Check if modal exists, create if not
 let modalId = 'abot_us';
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
max-width: 800px;
}

.${uniqueClass} .modal-content {
border: none;
border-radius: 16px;
overflow: hidden;
box-shadow: 0 25px 50px -12px rgba(111, 24, 77, 0.25);
}

.${uniqueClass} .modal-header {
background: linear-gradient(135deg, var(--primary-color, #6f184d), var(--primary-dark, #4d1035));
color: white;
padding: 1.25rem 1.5rem;
border-bottom: none;
}

.${uniqueClass} .modal-title {
font-weight: 700;
letter-spacing: 0.5px;
font-size: 1.35rem;
display: flex;
align-items: center;
gap: 10px;
}

.${uniqueClass} .modal-title i {
color: var(--accent-color, #FFB300);
}

.${uniqueClass} .btn-back {
background: rgba(255, 255, 255, 0.2);
border: 1px solid rgba(255, 255, 255, 0.3);
color: white;
border-radius: 50px;
padding: 0.5rem 1.25rem;
font-weight: 600;
font-size: 0.9rem;
transition: all 0.3s ease;
display: flex;
align-items: center;
gap: 8px;
margin-right: 15px;
}

.${uniqueClass} .btn-back:hover {
background: rgba(255, 255, 255, 0.3);
transform: translateX(-3px);
}

.${uniqueClass} .btn-back i {
font-size: 0.85rem;
}

.${uniqueClass} .modal-body {
padding: 0px !important;
background: linear-gradient(135deg, #FAFAFA 0%, #F5EDF3 100%);
}

.${uniqueClass} .about-content {
background: white;
border-radius: 12px;
padding: 1.75rem;
box-shadow: 0 4px 12px rgba(111, 24, 77, 0.08);
margin-bottom: 2rem;
border-left: 4px solid var(--primary-color, #6f184d);
}

.${uniqueClass} .about-text {
color: #333;
line-height: 1.7;
font-size: 0.95rem;
white-space: pre-line;
}

.${uniqueClass} .about-text strong {
color: var(--primary-color, #6f184d);
}

.${uniqueClass} .tagline-container {
text-align: center;
margin-top: 1.5rem;
padding-top: 1.5rem;
border-top: 2px dashed rgba(111, 24, 77, 0.2);
}

.${uniqueClass} .tagline-text {
color: var(--primary-color, #6f184d);
font-size: 1.1rem;
font-weight: 600;
font-style: italic;
letter-spacing: 0.5px;
}

.${uniqueClass} .tagline-text i {
color: #ff4d4d;
margin-right: 5px;
}

.${uniqueClass} .business-details-section {
background: white;
border-radius: 12px;
padding: 1.75rem;
box-shadow: 0 4px 12px rgba(111, 24, 77, 0.08);
}

.${uniqueClass} .section-title {
font-size: 1.1rem;
font-weight: 700;
color: var(--primary-color, #6f184d);
margin-bottom: 1.25rem;
padding-bottom: 0.75rem;
border-bottom: 2px solid rgba(111, 24, 77, 0.2);
display: flex;
align-items: center;
gap: 10px;
}

.${uniqueClass} .section-title i {
color: var(--accent-color, #FFB300);
}

.${uniqueClass} .form-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 1.25rem;
}

.${uniqueClass} .form-group {
display: flex;
flex-direction: column;
gap: 0.5rem;
}

.${uniqueClass} .form-group label {
font-weight: 600;
color: #555;
font-size: 0.85rem;
text-transform: uppercase;
letter-spacing: 0.5px;
display: flex;
align-items: center;
gap: 6px;
}

.${uniqueClass} .form-group label i {
color: var(--primary-color, #6f184d);
width: 16px;
}

.${uniqueClass} .form-control {
border: 2px solid #eee;
border-radius: 10px;
padding: 0.65rem 1rem;
font-size: 0.95rem;
transition: all 0.3s ease;
background: #fafafa;
}

.${uniqueClass} .form-control:focus {
border-color: var(--primary-color, #6f184d);
box-shadow: 0 0 0 3px rgba(111, 24, 77, 0.1);
background: white;
}

.${uniqueClass} .form-control[readonly] {
background: linear-gradient(to right, #f8f9fa, #fff);
border-color: #e0e0e0;
color: #333;
font-weight: 500;
}

.${uniqueClass} .badge-container {
display: flex;
flex-wrap: wrap;
gap: 0.5rem;
margin-top: 0.5rem;
}

.${uniqueClass} .feature-badge {
background: linear-gradient(135deg, rgba(111, 24, 77, 0.1), rgba(77, 16, 53, 0.1));
color: var(--primary-dark, #4d1035);
padding: 0.35rem 1rem;
border-radius: 50px;
font-size: 0.8rem;
font-weight: 600;
display: inline-flex;
align-items: center;
gap: 5px;
border: 1px solid rgba(111, 24, 77, 0.2);
}

.${uniqueClass} .feature-badge i {
color: var(--accent-color, #FFB300);
}

.${uniqueClass} .premium-badge {
background: linear-gradient(135deg, var(--accent-color, #FFB300), var(--accent-dark, #FF8F00));
color: white;
padding: 0.5rem 1.5rem;
border-radius: 50px;
font-weight: 700;
font-size: 0.9rem;
display: inline-flex;
align-items: center;
gap: 8px;
box-shadow: 0 4px 12px rgba(255, 179, 0, 0.3);
}

@media (max-width: 768px) {
.${uniqueClass} .modal-body {
padding: 1.25rem;
}

.${uniqueClass} .form-grid {
grid-template-columns: 1fr;
}

.${uniqueClass} .modal-header {
flex-direction: column;
align-items: flex-start;
gap: 10px;
}
}
`;
  document.head.appendChild(style);
 }

 // Format business name for display
 const formatBusinessName = (str) => {
  return str.split(' ')
   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
   .join(' ');
 };

 const formatOwnerName = (str) => {
  return str.split(' ')
   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
   .join(' ');
 };

 const formatCity = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
 };

 const formatTagline = (str) => {
  return str.split(' ')
   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
   .join(' ');
 };

 const businessName = formatBusinessName(data.business || 'abc matrimonial services');
 const ownerName = formatOwnerName(data.owner || 'xyz john doe');
 const city = formatCity(data.city || 'kolhapur');
 const tagline = formatTagline(data.tagline || 'aapke saath, behtar saath ke liye');
 const experience = data.experience || '99 years';
 const focus = data.focus || 'match making for all communities focusing on hindu / maratha caste';
 const verified = data.verified || 'yes, verified profiles will be provided';
 const privacy = data.privacy || 'privacy guarantee';
 const comparison = data.comparison || 'more matchmaking fields than Shaadi.com / Jeevansathi etc.?';
 const family_meeting = data.family_meeting || 'Family meeting arrangements? provided';

 // Extract styles from the styles string
 let stylesList = [];
 if (data.styles) {
  const stylesPart = data.styles.split(':')[1] || '';
  stylesList = stylesPart.split(',').map(s => s.trim()).filter(s => s);
 }

 const premium = data.premium || 'Premium / luxury matchmaking';

 // Generate the about us content
 const aboutUsText = `About Us

${businessName.toUpperCase()} is a trusted and respected matchmaking service based in ${city}, dedicated to helping individuals and families find meaningful and lifelong relationships. Founded by ${ownerName}, who brings an exceptional legacy of ${experience} of matchmaking experience, our service combines traditional values with modern professional methods to create perfect life partnerships.

We specialize in ${focus}. Our mission is to build relationships that are not only compatible but also culturally and emotionally fulfilling.

At ${businessName.toUpperCase()}, we believe marriage is not just a union of two individuals, but a bond between two families. Therefore, ${verified}. We maintain strict privacy and confidentiality standards, ensuring that all client information remains safe and secure.

Unlike general matrimonial platforms, ${comparison.replace('?', ',')} allowing us to understand personalities, family values, traditions, and expectations more deeply. This helps us offer highly personalized and accurate matches.

We also provide ${family_meeting.replace('?', ',')} helping both families interact comfortably and build mutual understanding before making important decisions. Our approach blends traditional matchmaking practices with modern professional service standards, offering a premium and personalized experience.

With a strong commitment to tradition, emotions, and modern relationship values, ${businessName.toUpperCase()} continues to create successful and happy marital journeys.

❤️ "${tagline}"`;

 // Build the modal content
 const modalContent = `
<div class="modal-header d-flex align-items-center">
<button type="button" class="btn-back" onclick="handleUniversalBackButton()">
<i class="fas fa-arrow-left"></i>
</button>
<h5 class="modal-title">
<i class="fas fa-building"></i>About Us
</h5>
</div>
<div class="modal-body">
<!-- About Us Content Section -->
<div class="about-content">
<div class="about-text">${aboutUsText.replace(/\n/g, '<br>')}</div>
<div class="tagline-container">
<span class="tagline-text">
<i class="fas fa-heart"></i> "${tagline}"
</span>
</div>
</div>

<!-- Business Details Form Section -->
<div class="business-details-section">
<div class="section-title">
<i class="fas fa-edit"></i> Business Information
</div>

<div class="form-grid">
<!-- Business Name -->
<div class="form-group">
<label><i class="fas fa-store"></i> Business Name</label>
<input type="text" class="form-control" value="${businessName}" readonly 
placeholder="Business name" id="abtus_business_name">
</div>

<!-- Owner Name -->
<div class="form-group">
<label><i class="fas fa-user-tie"></i> Owner</label>
<input type="text" class="form-control" value="${ownerName}" readonly
placeholder="Owner name" id="abtus_owner_name">
</div>

<!-- Experience -->
<div class="form-group">
<label><i class="fas fa-clock"></i> Experience</label>
<input type="text" class="form-control" value="${experience}" readonly
placeholder="Years of experience" id="abtus_experience">
</div>

<!-- City -->
<div class="form-group">
<label><i class="fas fa-map-marker-alt"></i> City</label>
<input type="text" class="form-control" value="${city}" readonly
placeholder="Location" id="abtus_city">
</div>

<!-- Focus/Specialization -->
<div class="form-group" style="grid-column: 1/-1;">
<label><i class="fas fa-users"></i> Specialization</label>
<input type="text" class="form-control" value="${focus}" readonly
placeholder="Matchmaking focus" id="abtus_focus">
</div>

<!-- Verified Profiles -->
<div class="form-group">
<label><i class="fas fa-check-circle"></i> Verification</label>
<input type="text" class="form-control" value="${verified}" readonly
placeholder="Verification status" id="abtus_verified">
</div>

<!-- Privacy -->
<div class="form-group">
<label><i class="fas fa-shield-alt"></i> Privacy</label>
<input type="text" class="form-control" value="${privacy}" readonly
placeholder="Privacy guarantee" id="abtus_privacy">
</div>

<!-- Comparison -->
<div class="form-group" style="grid-column: 1/-1;">
<label><i class="fas fa-chart-line"></i> Comparison</label>
<input type="text" class="form-control" value="${comparison}" readonly
placeholder="Compared to competitors" id="abtus_comparison">
</div>

<!-- Family Meeting -->
<div class="form-group">
<label><i class="fas fa-handshake"></i> Family Meeting</label>
<input type="text" class="form-control" value="${family_meeting}" readonly
placeholder="Family meeting arrangements" id="abtus_family_meeting">
</div>

<!-- Premium/Luxury -->
<div class="form-group">
<label><i class="fas fa-crown"></i> Premium Service</label>
<div class="badge-container">
<span class="premium-badge">
<i class="fas fa-star"></i> ${premium}
</span>
</div>
</div>
</div>

<!-- Matchmaking Styles -->
<div style="margin-top: 1.5rem;">
<label style="font-weight: 600; color: #555; display: block; margin-bottom: 0.75rem;">
<i class="fas fa-tags"></i> Matchmaking Styles
</label>
<div class="badge-container">
${stylesList.map(style => `
<span class="feature-badge">
<i class="fas fa-${getIconForStyle(style)}"></i> ${style}
</span>
`).join('')}
</div>
</div>

<!-- Tagline -->
<div style="margin-top: 1.5rem;">
<label style="font-weight: 600; color: #555; display: block; margin-bottom: 0.5rem;">
<i class="fas fa-quote-right"></i> Tagline
</label>
<input type="text" class="form-control" value="${tagline}" readonly
placeholder="Company tagline" id="abtus_tagline">
</div>
</div>
</div>
    `;

 // Helper function to get icon for style
 function getIconForStyle(style) {
  const styleLower = style.toLowerCase();
  if (styleLower.includes('tradition') || styleLower.includes('cultural')) return 'landmark';
  if (styleLower.includes('modern') || styleLower.includes('professional')) return 'laptop-code';
  if (styleLower.includes('emotional') || styleLower.includes('family')) return 'heart';
  if (styleLower.includes('premium') || styleLower.includes('luxury')) return 'gem';
  return 'check-circle';
 }

 // Set the content
 modalResult.contentElement.innerHTML = modalContent;

 // Store the original data in the modal for future updates
 modalResult.modalElement.setAttribute('data-business-data', JSON.stringify(data));

 // Show the modal
 modalResult.modalInstance.show();

 // Add to modal stack if not already there
 if (!modalStack.includes(modalId)) {
  modalStack.push(modalId);
 }

 console.log(`About Us modal displayed with data for ${businessName}`);

 return modalResult;
}

// Add a helper function to update the modal with new data
function update_abot_us_data(newData) {
 const modal = document.getElementById('abot_us');
 if (modal) {
  set_abot_us_innerHTML(newData);
 } else {
  console.warn('About Us modal not found, creating new one');
  set_abot_us_innerHTML(newData);
 }
}

// Add a helper function to get current data from the modal
function get_abot_us_data() {
 const modal = document.getElementById('abot_us');
 if (modal) {
  const dataAttr = modal.getAttribute('data-business-data');
  if (dataAttr) {
   return JSON.parse(dataAttr);
  }
 }
 return null;
}