// Dynamic body construction with inline CSS
(function() {
// Extract app owner number from URL (first part after domain)
const currentUrl = window.location.href;
const urlParts = currentUrl.split('/');
const appOwnerNumberRaw = urlParts[3] || '91.9960706060';

// Remove dots from phone number for WhatsApp
const appOwnerNumber = appOwnerNumberRaw.replace(/\./g, '');

// Extract person name from title
const titleText = document.title;
const titleMatch = titleText.match(/"([^"]+)"/);
const personName = titleMatch ? titleMatch[1] : 'This profile';

// Get the image URL from meta tag
const ogImageMeta = document.querySelector('meta[property="og:image"]');
const fullImageUrl = ogImageMeta ? ogImageMeta.getAttribute('content') : 'https://i.postimg.cc/gJ62yjJf/my1.jpg';

// Extract page info for redirect
const filename = urlParts[urlParts.length - 1];
const fileId = filename.replace('.html', '');
const pageName = fileId || filename;

// Remove the filename and the 'p' directory for redirect
const urlPartsCopy = [...urlParts];
urlPartsCopy.pop();
urlPartsCopy.pop();
const redirectUrl = urlPartsCopy.join('/') + '/';

// WhatsApp message
const whatsappMessage = `removed profile - ${personName}\n${pageName}`;
const whatsappUrl = `https://wa.me/${appOwnerNumber}?text=${encodeURIComponent(whatsappMessage)}`;

// Get og:title if available
const ogTitleMeta = document.querySelector('meta[property="og:title"]');
const ogTitle = ogTitleMeta ? ogTitleMeta.getAttribute('content') : titleText;

// Inject Google AdSense Auto Ads script ONLY (no manual ad units)
const adSenseScript = document.createElement('script');
adSenseScript.async = true;
adSenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5594579046538353';
adSenseScript.crossOrigin = 'anonymous';
document.head.appendChild(adSenseScript);

// Inject minimal CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
* {
margin: 0;
padding: 0;
box-sizing: border-box;
}

html, body {
width: 100%;
min-height: 100%;
font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
background: #f5f5f5;
overflow-x: hidden;
}

.page-container {
max-width: 800px;
margin: 0 auto;
background: #fff;
min-height: 100vh;
}

.header-section {
background: #1a1a2e;
color: #fff;
padding: 2rem 1.5rem;
text-align: center;
}

.header-icon {
font-size: 3rem;
margin-bottom: 1rem;
opacity: 0.9;
}

.header-title {
font-size: 1.5rem;
font-weight: 600;
margin-bottom: 0.5rem;
line-height: 1.3;
}

.header-subtitle {
font-size: 1rem;
opacity: 0.8;
font-weight: 400;
}

.content-section {
padding: 1.5rem;
}

.info-card {
background: #fff;
border: 1px solid #e0e0e0;
border-radius: 12px;
padding: 1.5rem;
margin-bottom: 1.5rem;
box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.info-card h2 {
font-size: 1.2rem;
color: #1a1a2e;
margin-bottom: 0.8rem;
font-weight: 600;
}

.info-card p {
color: #555;
line-height: 1.6;
font-size: 0.95rem;
margin-bottom: 0.8rem;
}

.info-card ul {
list-style: none;
padding: 0;
}

.info-card ul li {
padding: 0.5rem 0;
color: #555;
font-size: 0.95rem;
border-bottom: 1px solid #f0f0f0;
display: flex;
align-items: center;
gap: 0.5rem;
}

.info-card ul li:last-child {
border-bottom: none;
}

.info-card ul li::before {
content: "•";
color: #e94560;
font-weight: bold;
font-size: 1.2rem;
}

.image-container {
width: 100%;
background: #000;
display: flex;
justify-content: center;
align-items: center;
padding: 1rem 0;
}

.profile-image {
max-width: 100%;
max-height: 400px;
object-fit: contain;
display: block;
}

.action-buttons {
display: flex;
flex-direction: column;
gap: 1rem;
padding: 0 1.5rem 1.5rem 1.5rem;
}

.btn {
width: 100%;
padding: 1rem 1.5rem;
border-radius: 8px;
font-size: 1rem;
font-weight: 600;
cursor: pointer;
border: none;
transition: all 0.3s ease;
text-align: center;
text-decoration: none;
display: inline-block;
}

.btn-primary {
background: #e94560;
color: #fff;
}

.btn-primary:hover {
background: #d63850;
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);
}

.btn-secondary {
background: #1a1a2e;
color: #fff;
}

.btn-secondary:hover {
background: #16213e;
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(26, 26, 46, 0.3);
}

.whatsapp-float {
position: fixed;
bottom: 2rem;
right: 1.5rem;
z-index: 1000;
width: 60px;
height: 60px;
background: #25D366;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
cursor: pointer;
transition: all 0.3s ease;
text-decoration: none;
}

.whatsapp-float:hover {
transform: scale(1.1);
box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
}

.whatsapp-float:active {
transform: scale(0.95);
}

.whatsapp-icon {
width: 35px;
height: 35px;
fill: #fff;
}

@media (max-width: 480px) {
.header-section {
padding: 1.5rem 1rem;
}

.header-title {
font-size: 1.3rem;
}

.content-section {
padding: 1rem;
}

.info-card {
padding: 1.2rem;
}

.action-buttons {
padding: 0 1rem 1rem 1rem;
}

.whatsapp-float {
width: 55px;
height: 55px;
bottom: 1.5rem;
right: 1rem;
}

.whatsapp-icon {
width: 30px;
height: 30px;
}
}

@media (min-width: 768px) {
.action-buttons {
flex-direction: row;
flex-wrap: wrap;
}

.btn {
flex: 1;
}
}
`;
document.head.appendChild(styleSheet);

// Construct body content - NO manual ad units
const bodyHTML = `
<div class="page-container">
  <!-- Header Section -->
  <div class="header-section">
    <div class="header-icon">🔒</div>
    <h1 class="header-title">Profile No Longer Available</h1>
    <p class="header-subtitle">The matrimonial profile of "${personName}" has been removed</p>
  </div>

  <!-- Image Section -->
  <div class="image-container">
    <img src="${fullImageUrl}" alt="Profile removed" class="profile-image" loading="eager">
  </div>

  <!-- Content Section -->
  <div class="content-section">
    <div class="info-card">
      <h2>What Happened?</h2>
      <p>The profile of <strong>"${personName}"</strong> is no longer active on our platform. In most cases, profiles are removed when individuals have found their life partner and have chosen to deactivate their account.</p>
      <p>We respect the privacy of our members and honor their decision to remove their profiles once they have achieved their matrimonial goals.</p>
    </div>

    <div class="info-card">
      <h2>What Can You Do Next?</h2>
      <ul>
        <li>Browse other active profiles that match your preferences</li>
        <li>Create your own profile to connect with compatible matches</li>
        <li>Contact our support team if you need assistance</li>
      </ul>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="action-buttons">
    <button class="btn btn-primary" id="browseProfiles">
      Browse Other Profiles
    </button>
    <button class="btn btn-secondary" id="createProfile">
      Create Your Profile
    </button>
  </div>

  <div class="footer-note">
    <p>If you believe this is an error, please reach out to our support team.</p>
  </div>
</div>

<!-- WhatsApp Floating Button -->
<a href="${whatsappUrl}" target="_blank" rel="noopener" class="whatsapp-float" aria-label="Contact on WhatsApp">
  <svg class="whatsapp-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
</a>
`;

// Insert content at the beginning of body
document.body.insertAdjacentHTML('afterbegin', bodyHTML);

// Initialize Google AdSense Auto Ads ONLY (no push for manual units)
adSenseScript.onload = function() {
try {
// Auto ads don't need push() - they auto-detect placements
// Just initialize the ad service
if (window.adsbygoogle) {
console.log('AdSense Auto Ads initialized');
}
} catch (e) {
console.log('AdSense error:', e);
}
};

// Add click handlers for buttons
const browseBtn = document.getElementById('browseProfiles');
if (browseBtn) {
browseBtn.addEventListener('click', function() {
window.location.href = redirectUrl;
});
}

const createBtn = document.getElementById('createProfile');
if (createBtn) {
createBtn.addEventListener('click', function() {
const parentUrl = urlPartsCopy.join('/') + '/';
window.location.href = parentUrl + "?axn=1"; //axn=1 = action create profile;
});
}
})();
