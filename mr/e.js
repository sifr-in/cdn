function applyDefaultValues(profileData) {
 // Check if default values exist
 const defaultVals = window[my1uzr.worknOnPg]?.defaFieldVals;
 if (!defaultVals || !Array.isArray(defaultVals) || defaultVals.length === 0) {
  return profileData;
 }

 // Process each default value
 defaultVals.forEach(item => {
  // Split by ~ to get field and value
  const parts = item.split('~');
  if (parts.length !== 2) return;

  const field = parts[0];
  let value = parts[1];

  // Check if field exists in profileData
  if (profileData.hasOwnProperty(field)) {
   // Try to parse as number if the original value is number
   const originalValue = profileData[field];
   if (typeof originalValue === 'number') {
    profileData[field] = parseInt(value, 10);
   } else if (typeof originalValue === 'boolean') {
    profileData[field] = value === 'true' || value === '1';
   } else {
    profileData[field] = value;
   }
  }
 });

 return profileData;
}

function safeReload() {
 try {
   // For Android WebView - use native reload
   if (typeof Android !== 'undefined' && Android.reloadPage) {
    Android.reloadPage();
   } else if (typeof Android !== 'undefined') {
    // Fallback for Android without reloadPage
    window.location.href = window.location.href.split('?')[0] + '?_t=' + Date.now();
   } else {
    // For regular browsers
    location.reload();
   }
 } catch (e) {
  console.error('Reload failed:', e);
  window.location.href = window.location.href.split('?')[0] + '?_t=' + Date.now();
 }
}
// ==================== lazy image loading (view-profile) ====================
// The view-profile modal is built while the modal is still display:none, so a
// bare IntersectionObserver can stall on an unrendered subtree. These helpers
// keep one shared observer and add a shown.bs.modal safety net that picks up
// anything still pending once Bootstrap has actually painted the modal.
let __mraImgObserver = null;

function __mraGetImgObserver() {
 if (__mraImgObserver) return __mraImgObserver;
 if (typeof IntersectionObserver !== 'function') return null;
 __mraImgObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
   if (!entry.isIntersecting) return;
   __mraImgObserver.unobserve(entry.target);
   __mraLoadImg(entry.target);
  });
 }, { rootMargin: '300px 0px' });
 return __mraImgObserver;
}

// Assigns the deferred src. No-op once data-src is gone, so it is safe to call
// from the observer, the modal-show safety net and the fallback path.
function __mraLoadImg(img) {
 if (!img) return;
 const src = img.getAttribute('data-src');
 if (!src) return;
 img.removeAttribute('data-src');
 img.src = src;
}

// Loads every still-pending image inside `root` that is now in (or near) the
// viewport, and re-observes the rest so they load on scroll.
function __mraSweepPendingImgs(root) {
 if (!root || typeof root.querySelectorAll !== 'function') return;
 const observer = __mraGetImgObserver();
 const pending = root.querySelectorAll('img[data-src]');
 Array.prototype.forEach.call(pending, function (img) {
  if (!observer) { __mraLoadImg(img); return; }
  const rect = img.getBoundingClientRect();
  const nearViewport = rect.top < (window.innerHeight || 0) + 300 && rect.bottom > -300;
  if (nearViewport) {
   observer.unobserve(img);
   __mraLoadImg(img);
  } else {
   observer.observe(img);
  }
 });
}

function mraLazyLoadImage(img, url) {
 if (!img || !url) return;
 img.setAttribute('data-src', url);
 img.classList.add('lazy-load-img');
 // Cheap fallback for engines with native lazy loading; the data-src gate above
 // is what actually defers the request.
 img.setAttribute('loading', 'lazy');
 img.setAttribute('decoding', 'async');

 const observer = __mraGetImgObserver();
 if (!observer) { __mraLoadImg(img); return; }
 observer.observe(img);
}
window.mraLazyLoadImage = mraLazyLoadImage;

// Hidden-modal safety net: the view-profile modal is built while it is still
// display:none, so a pending image can stay unobserved until Bootstrap paints
// it. Bootstrap dispatches shown.bs.modal on the modal element itself, so a
// capturing listener on document sees it for every modal and binds only once.
// This has to live here rather than per image: callers invoke the helper
// before attaching the img, so closest('.modal') would not resolve yet.
if (typeof document !== 'undefined' && !document.__mraLazyModalBound) {
 document.__mraLazyModalBound = true;
 document.addEventListener('shown.bs.modal', function (e) {
  __mraSweepPendingImgs(e && e.target);
 }, true);
}

// The my1img picker (csh 51) is optional: an app whose csh list has no entry
// for it would otherwise render a button that can only ever fail.
function mraHasImagePicker() {
 const csh = (typeof my1uzr !== 'undefined' && my1uzr.worknOnPg) ? window[my1uzr.worknOnPg]?.csh : null;
 return Array.isArray(csh) && csh.some(function (item) { return item && item.a === 51; });
}
// ==================== end lazy image loading ====================

window.relation_with_regr = [{ "a": 1, "e": "à¤–à¥à¤¦ - Self" }, { "a": 2, "e": "à¤®à¤¾à¤¤à¤¾ - Mother" }, { "a": 3, "e": "à¤ªà¤¿à¤¤à¤¾ - Father" }, { "a": 4, "e": "à¤šà¤¾à¤šà¤¾ - Father's Brother" }, { "a": 5, "e": "à¤šà¤¾à¤šà¥€ - Father's Brother's Wife" }, { "a": 6, "e": "à¤®à¤¾à¤®à¤¾ - Mother's Brother" }, { "a": 7, "e": "à¤®à¤¾à¤®à¥€ - Mother's Brother's Wife" }, { "a": 8, "e": "à¤¬à¥à¤† - Father's Sister" }, { "a": 9, "e": "à¤«à¥‚à¤«à¤¾ - Father's Sister's Husband" }, { "a": 10, "e": "à¤­à¤¾à¤ˆ - Brother" }, { "a": 11, "e": "à¤¬à¤¹à¤¨ - Sister" }, { "a": 12, "e": "à¤œà¥€à¤œà¤¾à¤œà¥€ - Sister's Husband" }, { "a": 13, "e": "à¤­à¤¾à¤­à¥€ - Brother's Wife" }, { "a": 14, "e": "à¤­à¤¤à¥€à¤œà¤¾" }, { "a": 15, "e": "à¤­à¤¤à¥€à¤œà¥€" }, { "a": 16, "e": "à¤¬à¥‡à¤Ÿà¤¾ - Son" }, { "a": 17, "e": "à¤¬à¥‡à¤Ÿà¥€ - Daughter" }, { "a": 18, "e": "à¤¦à¤¾à¤®à¤¾à¤¦ - Daughter's Husband" }, { "a": 19, "e": "à¤¬à¤¹à¥‚ - Son's Wife" }, { "a": 20, "e": "à¤¸à¤¸à¥à¤° - Husband's Father" }, { "a": 21, "e": "à¤¸à¤¾à¤¸ - Husband's Mother" }, { "a": 22, "e": "à¤¸à¤¾à¤²à¤¾ - Wife's Brother" }, { "a": 23, "e": "à¤¸à¤¾à¤²à¥€ - Wife's Sister" }, { "a": 24, "e": "à¤¦à¤¾à¤¦à¤¾ - Father's Father" }, { "a": 25, "e": "à¤¦à¤¾à¤¦à¥€ - Father's Mother" }, { "a": 26, "e": "à¤¨à¤¾à¤¨à¤¾ - Mother's Father" }, { "a": 27, "e": "à¤¨à¤¾à¤¨à¥€ - Mother's Mother" }, { "a": 28, "e": "à¤šà¤šà¥‡à¤°à¤¾ à¤­à¤¾à¤ˆ - Father's Brother's Son" }, { "a": 29, "e": "à¤šà¤šà¥‡à¤°à¥€ à¤¬à¤¹à¤¨ - Father's Brother's Daughter" }, { "a": 30, "e": "à¤®à¤®à¥‡à¤°à¤¾ à¤­à¤¾à¤ˆ - Mother's Brother's Son" }, { "a": 31, "e": "à¤®à¤®à¥‡à¤°à¥€ à¤¬à¤¹à¤¨ - Mother's Brother's Daughter" }, { "a": 32, "e": "à¤°à¤¿à¤¶à¥à¤¤à¥‡à¤¦à¤¾à¤° - Relative" }, { "a": 33, "e": "à¤¦à¥‹à¤¸à¥à¤¤ - Friend" }, { "a": 34, "e": "à¤ªà¤¡à¤¼à¥‹à¤¸à¥€ - Neighbour" }];

function mraApplyProfileImageData(profile) {
 if (typeof window.applyProfileImageData === 'function') return window.applyProfileImageData(profile);
 const imageData = (typeof window.mrResolveProfileImages === 'function')
  ? window.mrResolveProfileImages(profile.u)
  : { display: null, thumbnail: null };
 if (imageData.thumbnail) {
  profile.thumbnail = imageData.thumbnail;
  profile.originalImage = imageData.display || imageData.thumbnail;
 } else if (profile.ut) {
  profile.thumbnail = profile.ut;
  profile.originalImage = profile.ut;
 } else {
  profile.thumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFMEUwRTAiLz48dGV4dCB4PSIxNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdDwvdGV4dD48dGV4dCB4PSIxNTAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
  profile.originalImage = null;
 }
 return profile;
}

// Refreshes every UI surface that depends on the signed-in profile, in place,
// so a successful save does not need a full page reload.
function refreshUiAfterMrSave(response) {
 try {
  const rec = response && response.mr && response.mr.l && response.mr.l[0];
  if (!rec) return;

  const saved = mraApplyProfileImageData(Object.assign({}, (window.myEinMR || {}), rec));

  window.myEinMR = saved;
  try { localStorage.setItem(appOwner.tn + '_myEinMR', JSON.stringify(saved)); } catch (e) { }

  const listId = saved.a != null ? String(saved.a) : (saved.w != null ? String(saved.w) : null);
  if (listId && Array.isArray(window.profilesData)) {
   const idx = window.profilesData.findIndex(p => (p.a != null && String(p.a) === listId) || (p.a == null && p.w != null && String(p.w) === listId));
   if (idx > -1) window.profilesData[idx] = Object.assign({}, window.profilesData[idx], saved);
   else window.profilesData.unshift(saved);
  }

  if (listId && typeof window.createProfileCard === 'function') {
   const container = document.getElementById('profiles-container');
   if (container) {
    const oldCard = container.querySelector('[data-profile-id="' + listId + '"]');
    const freshCard = window.createProfileCard(saved);
    if (oldCard) oldCard.replaceWith(freshCard);
    if (typeof window.initLazyLoadImages === 'function') window.initLazyLoadImages();
   }
  }

  if (window.mrDrawerInstance && typeof window.mrDrawerInstance.updateProfile === 'function') {
   window.mrDrawerInstance.updateProfile({ imageUrl: saved.thumbnail, name: saved.m, mobile: saved.l });
  }

  if (saved.d1 != null) {
   window.profileUnlockCount = saved.d1;
   const usedCount = (window.appData && window.appData.usedCount) || 0;
   window.remainingProflCnt = window.profileUnlockCount - usedCount;
  }
 } catch (e) {
  console.error('Error refreshing UI after save:', e);
 }
}
window.refreshUiAfterMrSave = refreshUiAfterMrSave;

window.marital_status = [{ "a": 0, "e": "-" }, { "a": 1, "e": "Never Married" }, { "a": 2, "e": "Divorced" }, { "a": 3, "e": "Widow/er" }, { "a": 4, "e": "In Marriage" }, { "a": 5, "e": "Annulled" }, { "a": 6, "e": "Awaiting Divorce" }];
window.mr_leavng_stts = [{ "a": -1, "e": "got married" }, { "a": -2, "e": "dis-satisfaction on your portal" }, { "a": -3, "e": "something personal;" }];
window.mr_job_types = [{ "a": 0, "e": "-" }, { "a": 1, "e": "gov" }, { "a": 2, "e": "mnc" }, { "a": 3, "e": "private" }];
window.mr_bsns_forms = [{ "a": 1, "e": "Sole Proprietorship" }, { "a": 2, "e": "Partnership Firm" }, { "a": 3, "e": "LLP (Limited Liability Partnership)" }, { "a": 4, "e": "Private Limited Company" }, { "a": 5, "e": "Public Limited Company" }, { "a": 6, "e": "One Person Company (OPC)" }, { "a": 7, "e": "Cooperative Society" }, { "a": 8, "e": "Trust" }, { "a": 9, "e": "NGO" }];
window.mr_bsns_typs = [{ "a": 0, "e": "-" }, { "a": 1, "e": "IT & Software Development" }, { "a": 2, "e": "Real Estate" }, { "a": 3, "e": "Construction" }];
window.entryStatus = [{ "a": 0, "e": "Entry" }, { "a": 1, "e": "Accepted" }, { "a": 2, "e": "Under process" }, { "a": 127, "e": "denied" }];
window.bloodGroups = [{ "a": 0, "e": "-" }, { "a": 1, "e": "A positive (A+)" }, { "a": 2, "e": "A negative (A-)" }, { "a": 3, "e": "B positive (B+)" }, { "a": 4, "e": "B negative (B-)" }, { "a": 5, "e": "AB positive (AB+)" }, { "a": 6, "e": "AB negative (AB-)" }, { "a": 7, "e": "O positive (O+)" }, { "a": 8, "e": "O negative (O-)" }];
window.var_genders = [{ "a": 0, "e": "-" }, { "a": 1, "e": "male" }, { "a": 2, "e": "female" }, { "a": 3, "e": "prefer not to say" }];

// ==================== my1img (csh 51) integration ====================
// dims[0] -> g1 (thumbnail), dims[1] -> g2 (display)
const imgObjDimensRqd3 = ["600x600px-64kb", "1080x1080px-512kb"];
let mraImgPickTarget = null;

function mraParseImgInputValue(value) {
  try {
   // Must also accept '[' : a gallery value is a JSON array. Failing to parse it
   // would reset the array and drop previously picked images.
   if (typeof value === 'string' &&
    (value.trim().startsWith('{') || value.trim().startsWith('['))) return JSON.parse(value);
  } catch (e) { }
  return null;
}

// Writes the picked data URLs into the hidden input and refreshes the preview.
// No upload step: the data URL is what gets saved, via the normal main endpoint.
window.afterimagesetcallrun3 = function (obj) {
  const target = mraImgPickTarget;
  mraImgPickTarget = null;

  if (!target) {
   console.warn('my1img callback fired without an active pick target.');
   return;
  }

  const g1 = (obj && obj.g1) || '';
  const g2 = (obj && obj.g2) || (obj && obj.url) || '';
  const displayUrl = g2 || g1;
  const thumbUrl = g1 || g2;

  if (!displayUrl && !thumbUrl) return;

  const input = document.getElementById(target.inputId);
  if (!input) {
   console.warn('my1img callback: input ' + target.inputId + ' not found.');
   return;
  }

  const picked = { a: displayUrl, b: thumbUrl };

  if (target.isGallery) {
   let arr = [];
   const parsed = mraParseImgInputValue(input.value);
   if (Array.isArray(parsed)) arr = parsed;
   arr.push(picked);
   input.value = JSON.stringify(arr);
   setGalleryImages(target.inputId, input.value, target.divId, target.key, target.fullObject);
  } else {
   input.value = JSON.stringify(picked);
   prepImgByURL(target.inputId, input.value, target.divId, target.key, target.fullObject);
  }

  if (typeof showToast === 'function') {
   showToast(target.isGallery ? 'Image added to gallery!' : 'Image selected!', {
    duration: 2000,
    position: 'top',
    type: 'success',
    dismissible: true
   });
  }
};
// ==================== end my1img integration ====================

async function cmn_prep_data_set_to_var(...arg) {
 const varNm = arg[0];
 const mode = arg[1];
 const identifier = arg[2];

 // Create window.varNm if it doesn't exist
 if (!window[varNm]) {
  window[varNm] = null;
 }

 // Helper function to get URL from csh array
 const getUrlFromCsh = () => {
  const cshItem = window[my1uzr.worknOnPg]?.csh?.find(item => item.a === identifier);
  return cshItem?.u;
 };

 // Helper function to safely store to localStorage
 const safeStoreToLocalStorage = (key, data) => {
  try {
   const jsonStr = JSON.stringify(data);
   localStorage.setItem(key, jsonStr);
   return true;
  } catch (error) {
   if (error.name === 'QuotaExceededError') {
    showToast(`LocalStorage quota exceeded! Data will be kept in memory only.`, {
     duration: 5000,
     position: 'top',
     type: 'warning',
     dismissible: true
    });
    return false;
   }
   console.error('Error storing to localStorage:', error);
   return false;
  }
 };

 // Helper function to fetch and store data
 const fetchAndStoreData = async (url) => {
  if (!url) {
   console.error('No URL found for identifier:', identifier);
   return null;
  }

  try {
   const response = await fetch(url);
   const data = await response.json();

   // Try to store to localStorage
   const stored = safeStoreToLocalStorage(varNm, data);

   if (!stored) {
    showToast(`${varNm}: Data stored in memory only`, {
     duration: 3000,
     position: 'top',
     type: 'info',
     dismissible: true
    });
   }
   /*else {
    showToast(`${varNm}: Data stored`, {
     duration: 2000,
     position: 'top',
     type: 'success',
     dismissible: true
    });
   }*/

   // Always set to window property
   window[varNm] = data;

   return data;
  } catch (error) {
   console.error('Error fetching data:', error);
   showToast(`Error fetching data for ${varNm}: ${error.message}`, {
    duration: 5000,
    position: 'top',
    type: 'error',
    dismissible: true
   });
   return null;
  }
 };

 // Helper function to clean up old localStorage items (optional)
 const cleanupOldStorage = () => {
  try {
   // Get all keys
   const keys = Object.keys(localStorage);
   if (keys.length > 50) {
    showToast(`Storage has ${keys.length} items. Consider clearing unused data.`, {
     duration: 3000,
     position: 'top',
     type: 'warning',
     dismissible: true
    });
   }
  } catch (e) {
   console.error('Error checking storage:', e);
  }
 };

 // Mode 1: Check localStorage first, then fetch if empty/null
 if (mode === 1) {
  // Try to get from localStorage
  const storedData = localStorage.getItem(varNm);
  let parsedData = null;

  if (storedData) {
   try {
    parsedData = JSON.parse(storedData);
    // Check if it's empty (null, undefined, empty array, empty object)
    const isEmpty = parsedData === null ||
     parsedData === undefined ||
     (Array.isArray(parsedData) && parsedData.length === 0) ||
     (typeof parsedData === 'object' && Object.keys(parsedData).length === 0);

    if (!isEmpty) {
     // Data exists in localStorage, set to window property
     window[varNm] = parsedData;
     console.log(`${varNm}: Loaded from localStorage`);
     return parsedData;
    }
   } catch (e) {
    console.error('Error parsing localStorage data:', e);
    // If parsing fails, remove corrupted data
    localStorage.removeItem(varNm);
   }
  }

  // localStorage is empty or null, fetch from URL
  console.log(`${varNm}: Fetching from URL`);
  return await fetchAndStoreData(getUrlFromCsh());
 }
 // Mode 2: Always fetch from URL
 else if (mode === 2) {
  console.log(`${varNm}: Force fetching from URL`);
  return await fetchAndStoreData(getUrlFromCsh());
 }

 // Invalid mode
 console.error('Invalid mode:', mode);
 showToast(`Invalid mode: ${mode} for ${varNm}`, {
  duration: 3000,
  position: 'top',
  type: 'error',
  dismissible: true
 });
 return null;
}
function hideLoaderById2(id) {
 console.log('hideLoaderById2 called for ID:', id);
 const loader = document.getElementById(id);
 console.log('Found loader:', loader);
 if (loader) {
  // Clear any countdown interval if exists
  if (loader._countdownInterval) {
   clearInterval(loader._countdownInterval);
   loader._countdownInterval = null;
  }
  loader.style.display = 'none';
  console.log('Loader hidden successfully:', id);
 } else {
  console.warn('Loader not found for ID:', id);
  // Try to find any loader with similar ID
  const allLoaders = document.querySelectorAll('div[id*="loader"]');
  console.log('All loaders in DOM:', allLoaders);
 }
 return loader;
}
function removeLoaderById2(id) {
 const loader = document.getElementById(id);
 if (loader) {
  if (loader._countdownInterval) {
   clearInterval(loader._countdownInterval);
  }
  loader.remove();
 }
 return null;
}
function createDynamicLoader2(id, message = 'Loading...', countdown = null) {
 // Check if loader with this ID already exists
 const existingLoader = document.getElementById(id);
 if (existingLoader) {
  // Update message if needed
  const msgEl = existingLoader.querySelector('.mra_loader-message');
  if (msgEl && message) msgEl.textContent = message;
  // Ensure it is visible
  existingLoader.style.display = 'flex';
  return existingLoader;
 }

 // If loader doesn't exist, CREATE NEW ONE
 const loader = document.createElement('div');
 loader.id = id;  // THIS IS CRITICAL - SET THE ID
 loader.style.position = 'fixed';
 loader.style.top = '0';
 loader.style.left = '0';
 loader.style.width = '100%';
 loader.style.height = '100%';
 loader.style.backgroundColor = 'rgba(0,0,0,0.5)';
 loader.style.display = 'flex';
 loader.style.justifyContent = 'center';
 loader.style.alignItems = 'center';
 loader.style.zIndex = '99999';
 loader.style.flexDirection = 'column';

 // Spinner Container
 const spinnerContainer = document.createElement('div');
 spinnerContainer.style.position = 'relative';
 spinnerContainer.style.display = 'flex';
 spinnerContainer.style.justifyContent = 'center';
 spinnerContainer.style.alignItems = 'center';
 spinnerContainer.style.width = '4rem';
 spinnerContainer.style.height = '4rem';

 // Spinner
 const spinner = document.createElement('div');
 spinner.style.width = '100%';
 spinner.style.height = '100%';
 spinner.style.border = '4px solid #f3f3f3';
 spinner.style.borderTop = '4px solid #007bff';
 spinner.style.borderRadius = '50%';
 spinner.style.animation = 'spin 1s linear infinite';
 spinnerContainer.appendChild(spinner);

 // CSS for spin
 if (!document.querySelector('#loader-spin-style')) {
  const style = document.createElement('style');
  style.id = 'loader-spin-style';
  style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
 }

 // Countdown element (if countdown provided)
 let countdownElement = null;
 let countdownInterval = null;
 if (countdown !== null) {
  countdownElement = document.createElement('div');
  countdownElement.style.position = 'absolute';
  countdownElement.style.fontSize = '1.2rem';
  countdownElement.style.fontWeight = 'bold';
  countdownElement.style.color = '#007bff';
  countdownElement.textContent = countdown;
  spinnerContainer.appendChild(countdownElement);

  if (typeof countdown === 'number' && countdown > 0) {
   let timeLeft = countdown;
   countdownInterval = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;
    if (timeLeft <= 0) clearInterval(countdownInterval);
   }, 1000);
  }
 }

 // Message Element
 const messageElement = document.createElement('div');
 messageElement.className = 'mra_loader-message';
 messageElement.style.marginTop = '1rem';
 messageElement.style.color = 'white';
 messageElement.style.fontSize = '1.1rem';
 messageElement.textContent = message;  // This should be the message, NOT the ID

 // Assemble
 const loaderContent = document.createElement('div');
 loaderContent.style.display = 'flex';
 loaderContent.style.flexDirection = 'column';
 loaderContent.style.alignItems = 'center';
 loaderContent.appendChild(spinnerContainer);
 loaderContent.appendChild(messageElement);
 loader.appendChild(loaderContent);

 if (countdownInterval) loader._countdownInterval = countdownInterval;

 document.body.appendChild(loader);

 console.log('Loader created with ID:', id, 'Element:', loader);

 return loader;
}
function fn_setValToGvnInputs(prefix, keysString, attribute = 'value') {
 if (!prefix || !keysString) {
  console.error('fn to show values of comma separated string ValueOfElementOfGvnKeyAdvanced: prefix and keysString are required');
  return '';
 }

 // Split the keys string by comma
 const keys = keysString.split(',').map(key => key.trim()).filter(key => key !== '');

 if (keys.length === 0) {
  return '';
 }

 // Collect values from each element
 const values = [];
 let missingElements = [];

 for (const key of keys) {
  const elementId = `${prefix}_${key}`;
  const element = document.getElementById(elementId);

  if (element) {
   let value = '';

   // Handle different element types
   if (attribute === 'value') {
    value = element.value || '';
   } else if (attribute === 'innerHTML') {
    value = element.innerHTML || '';
   } else if (attribute === 'innerText') {
    value = element.innerText || '';
   } else if (attribute === 'textContent') {
    value = element.textContent || '';
   } else if (element.getAttribute(attribute) !== null) {
    value = element.getAttribute(attribute) || '';
   } else {
    value = element.value || '';
   }

   values.push(value);
  } else {
   console.error(`Element with ID "${elementId}" not found`);
   missingElements.push(key);
   values.push(''); // Push empty string for missing elements
  }
 }

 // If any elements are missing, show error and return empty string
 if (missingElements.length > 0) {
  console.error(`Missing elements for keys: ${missingElements.join(', ')}`);
  showToast(`Elements not found: ${missingElements.join(', ')}`, {
   duration: 3000,
   position: 'top',
   type: 'error',
   dismissible: true
  });
  return '';
 }

 // Get count of keys
 const count = keys.length;

 // Build result string with count first, then values
 const result = [count, ...values].join('-');

 return result;
}
function showFullImageModal(imageUrl) {
 // Generate unique modal ID
 const modalId = 'mra__full_image_modal_' + Date.now();

 // Create modal dynamically
 const modalObj = create_modal_dynamically(modalId);
 const modalInstance = modalObj.modalInstance;
 const modalElement = modalObj.modalElement;
 const modalBody = modalObj.contentElement;

 // Set modal styling for full screen
 const modalDialog = modalElement.querySelector('.modal-dialog');
 if (modalDialog) {
  modalDialog.classList.add('modal-fullscreen');
  modalDialog.style.cssText = 'max-width: 95%; width: 95%; margin: 1rem auto;';
 }

 // Style modal content
 const modalContent = modalElement.querySelector('.modal-content');
 if (modalContent) {
  modalContent.style.cssText = 'background: transparent; border: none; box-shadow: none;';
 }

 // Style modal body
 modalBody.style.cssText = 'padding: 0; position: relative; background: transparent;';

 // Create image container
 const imageContainer = document.createElement('div');
 imageContainer.style.cssText = 'position: relative; width: 100%; min-height: 80vh; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.9); border-radius: 12px; overflow: hidden;';

 // Create close button
 const closeBtn = document.createElement('button');
 closeBtn.className = 'btn-close btn-close-white';
 closeBtn.style.cssText = 'position: absolute; top: 20px; right: 20px; z-index: 10; width: 30px; height: 30px; background-size: 20px; opacity: 0.8; transition: opacity 0.2s ease;';
 closeBtn.setAttribute('aria-label', 'Close');
 closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
 closeBtn.onmouseout = () => closeBtn.style.opacity = '0.8';
 closeBtn.onclick = () => {
  if (modalInstance) modalInstance.hide();
 };

 // Create image element
 const imgElement = document.createElement('img');
 imgElement.src = imageUrl;
 imgElement.alt = 'Full size image';
 imgElement.style.cssText = 'max-width: 100%; max-height: 85vh; object-fit: contain; display: block; transition: opacity 0.3s ease;';
 imgElement.style.opacity = '0';

 // Add loading indicator
 const loader = document.createElement('div');
 loader.className = 'spinner-border text-light';
 loader.style.cssText = 'position: absolute; width: 40px; height: 40px;';
 loader.setAttribute('role', 'status');

 const loaderSpan = document.createElement('span');
 loaderSpan.className = 'visually-hidden';
 loaderSpan.textContent = 'Loading...';
 loader.appendChild(loaderSpan);

 imageContainer.appendChild(loader);
 imageContainer.appendChild(imgElement);
 imageContainer.appendChild(closeBtn);
 modalBody.appendChild(imageContainer);

 // Handle image load
 imgElement.onload = () => {
  loader.style.display = 'none';
  imgElement.style.opacity = '1';
 };

 imgElement.onerror = () => {
  loader.style.display = 'none';
  imgElement.style.display = 'none';
  const errorMsg = document.createElement('div');
  errorMsg.className = 'alert alert-danger m-3';
  errorMsg.textContent = 'Failed to load image. Please check the URL.';
  errorMsg.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; text-align: center;';
  imageContainer.appendChild(errorMsg);
 };

 // Add keyboard support for ESC key
 const handleEsc = (e) => {
  if (e.key === 'Escape' && modalInstance) {
   modalInstance.hide();
   document.removeEventListener('keydown', handleEsc);
  }
 };
 document.addEventListener('keydown', handleEsc);

 // Add click on backdrop to close
 modalElement.addEventListener('click', (e) => {
  if (e.target === modalElement && modalInstance) {
   modalInstance.hide();
  }
 });

 // Clean up on modal hide
 modalElement.addEventListener('hidden.bs.modal', function () {
  document.removeEventListener('keydown', handleEsc);
  setTimeout(() => {
   if (modalElement && modalElement.remove) {
    modalElement.remove();
   }
  }, 300);
 }, { once: true });

 // Show modal
 modalInstance.show();
}
function setGalleryImages(inputId, value, divId, key, fullObject) {
 if (!divId) return;
 const inElement = document.getElementById(inputId);
 if (inElement) {
  inElement.style.display = 'none';
 };

 const divElement = document.getElementById(divId);
 if (!divElement) return;

 // Clear previous content
 divElement.innerHTML = '';

  // Parse the value. Each element is either a "tok1 tok2" pair string or the
  // legacy {"a":display,"b":thumbnail} object. `raw` is kept so a delete can
  // re-serialize the array in the same format it was stored in.
  let imagesArray = [];
  if (typeof window.mrResolveGalleryImages === 'function') {
   imagesArray = window.mrResolveGalleryImages(value);
  } else {
   try {
    if (typeof value === 'string') {
     imagesArray = JSON.parse(value);
    } else if (Array.isArray(value)) {
     imagesArray = value;
    }
   } catch (e) {
    console.error('Error parsing gallery images:', e);
    imagesArray = [];
   }
  }

 const showAddButton = fullObject && fullObject.canAdd > 0 && mraHasImagePicker();

 // Create a wrapper container
 const wrapper = document.createElement('div');
 wrapper.style.cssText = 'display:flex;flex-direction:column;gap:15px;';

 // Create gallery grid
 const galleryGrid = document.createElement('div');
 galleryGrid.className = 'mra_-gallery-grid';
 galleryGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;';

  // Add existing images
  // rawEntries mirrors imagesArray so a delete can write back the untouched
  // stored values instead of the resolved view models.
  const rawEntries = imagesArray.map(img => img.raw);
  imagesArray.forEach((img, index) => {
   const thumbnailUrl = img.thumbnail;
   const originalUrl = img.display;
   if (!thumbnailUrl || !originalUrl) return;

  const imageItem = document.createElement('div');
  imageItem.style.cssText = 'position:relative;cursor:pointer;border-radius:8px;overflow:hidden;aspect-ratio:1;transition:transform 0.2s ease,box-shadow 0.2s ease;';
  imageItem.onmouseover = () => {
   imageItem.style.transform = 'scale(1.05)';
   imageItem.style.boxShadow = '0 4px 12px rgba(123,31,162,0.3)';
  };
  imageItem.onmouseout = () => {
   imageItem.style.transform = 'scale(1)';
   imageItem.style.boxShadow = 'none';
  };

  const imgElement = document.createElement('img');
  mraLazyLoadImage(imgElement, thumbnailUrl);
  imgElement.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';

  // Delete button
  const deleteBtn = document.createElement('div');
  deleteBtn.innerHTML = 'Ã—';
  deleteBtn.style.cssText = 'position:absolute;top:5px;right:5px;width:20px;height:20px;background:rgba(255,0,0,0.7);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;opacity:0;transition:opacity 0.2s;z-index:2;';
  deleteBtn.onclick = (e) => {
   e.stopPropagation();
   imagesArray.splice(index, 1);
   rawEntries.splice(index, 1);
   const remaining = JSON.stringify(rawEntries);
   const input = document.getElementById(inputId);
   if (input) input.value = remaining;
   setGalleryImages(inputId, remaining, divId, key, fullObject);
  };

  imageItem.appendChild(deleteBtn);
  imageItem.onmouseenter = () => { deleteBtn.style.opacity = '1'; };
  imageItem.onmouseleave = () => { deleteBtn.style.opacity = '0'; };
  imageItem.appendChild(imgElement);

  imageItem.onclick = () => {
   if (typeof showFullImageModal === 'function') {
    showFullImageModal(originalUrl);
   }
  };

  galleryGrid.appendChild(imageItem);
 });

 wrapper.appendChild(galleryGrid);

 // Add image count
 if (imagesArray.length > 0) {
  const countBadge = document.createElement('div');
  countBadge.style.cssText = 'font-size:12px;color:#757575;text-align:center;';
  countBadge.textContent = `${imagesArray.length} image${imagesArray.length > 1 ? 's' : ''}`;
  wrapper.appendChild(countBadge);
 }

 // Create a SEPARATE Add button container (outside the gallery grid)
 if (showAddButton) {
  const addButtonContainer = document.createElement('div');
  addButtonContainer.style.cssText = 'display:flex;justify-content:center;margin-top:10px;';

  const addButton = document.createElement('button');
  addButton.innerHTML = '+ Add Image in Gallery';
  addButton.style.cssText = 'background:linear-gradient(135deg, #4CAF50, #45a049);color:white;border:none;border-radius:50px;padding:8px 20px;font-weight:600;cursor:pointer;transition:all 0.3s ease;';
  addButton.onmouseover = () => {
   addButton.style.transform = 'translateY(-2px)';
   addButton.style.boxShadow = '0 4px 12px rgba(76,175,80,0.3)';
  };
  addButton.onmouseout = () => {
   addButton.style.transform = 'translateY(0)';
   addButton.style.boxShadow = 'none';
  };

  // Store a flag to prevent multiple clicks
  let isPicking = false;

  addButton.onclick = async (e) => {
   e.stopPropagation();
   e.preventDefault();

   if (isPicking) {
    console.log('Image picker already open');
    return;
   }

   isPicking = true;

   try {
    mraImgPickTarget = { inputId, divId, key, fullObject, isGallery: true };
    // 4th arg '' = no preload; a gallery has no single current image.
    await loadExe2Fn(51, [window.afterimagesetcallrun3, imgObjDimensRqd3, 0, ''], [1]);
   } catch (error) {
    console.error('my1img error:', error);
    mraImgPickTarget = null;

    if (typeof showToast === 'function') {
     showToast('Could not open image picker: ' + error.message, {
      duration: 3000,
      position: 'top',
      type: 'error',
      dismissible: true
     });
    }
   } finally {
    isPicking = false;
   }
  };

  addButtonContainer.appendChild(addButton);
  wrapper.appendChild(addButtonContainer);
 }

 divElement.appendChild(wrapper);
}
function prepImgByURL(inputId, value, divId, key, fullObject) {
 if (!divId) return;

 const divElement = document.getElementById(divId);
 if (!divElement) return;

 const inElement = document.getElementById(inputId);
 if (inElement) {
  inElement.style.display = 'none';
 };

 // Clear previous content
 divElement.innerHTML = '';

  // Parse value. Accepts the token format ("tok1 tok2"), the legacy
  // {"a":display,"b":thumbnail} object, and an already-resolved URL/data URL.
  let imageUrl = null;
  let thumbnailUrl = null;
  let originalUrl = null;

  if (typeof window.mrResolveProfileImages === 'function') {
   const imgs = window.mrResolveProfileImages(value);
   thumbnailUrl = imgs.thumbnail;
   originalUrl = imgs.display;
   imageUrl = thumbnailUrl || originalUrl;
  } else if (typeof value === 'string' && value.trim().startsWith('{')) {
   try {
    const parsed = JSON.parse(value);
    originalUrl = parsed && parsed.a;
    thumbnailUrl = parsed && parsed.b;
    imageUrl = thumbnailUrl || originalUrl;
   } catch (e) {
    imageUrl = value; originalUrl = value; thumbnailUrl = value;
   }
  } else {
   imageUrl = value; originalUrl = value; thumbnailUrl = value;
  }

 // Create main container
 const mainContainer = document.createElement('div');
 mainContainer.style.cssText = 'position: relative; width: 100%; margin-top: 8px;';

 // Check if edit button should be shown
 const showEditButton = fullObject && fullObject.canEdit === true && mraHasImagePicker();

 // Check if value is valid URL
 const hasImage = imageUrl && imageUrl.trim() !== '';

 if (hasImage) {
  // Create image container
  const imageContainer = document.createElement('div');
  imageContainer.style.cssText = 'position: relative; width: 100%; cursor: pointer; transition: transform 0.2s ease;';

  // Create image element with full width
  const imgElement = document.createElement('img');
  mraLazyLoadImage(imgElement, imageUrl);
  imgElement.alt = 'Preview image';
  imgElement.style.cssText = 'width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.2s ease; display: block; object-fit: cover;';

  // Add loading state
  const loader = document.createElement('div');
  loader.className = 'spinner-border spinner-border-sm text-primary';
  loader.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: none;';
  loader.setAttribute('role', 'status');

  imgElement.style.opacity = '0';
  imgElement.style.transition = 'opacity 0.3s ease';

  // Handle image load
  imgElement.onload = () => {
   loader.style.display = 'none';
   imgElement.style.opacity = '1';
  };

  imgElement.onerror = () => {
   loader.style.display = 'none';
   imgElement.style.display = 'none';
   const errorMsg = document.createElement('div');
   errorMsg.className = 'text-danger';
   errorMsg.style.cssText = 'font-size: 0.875rem; margin-top: 8px; text-align: center;';
   errorMsg.textContent = 'Failed to load image';
   imageContainer.appendChild(errorMsg);
  };

  // Show loader while loading
  loader.style.display = 'block';

  // Hover effects
  imageContainer.onmouseover = () => {
   imgElement.style.transform = 'scale(1.02)';
   imgElement.style.boxShadow = '0 4px 16px rgba(123,31,162,0.3)';
  };

  imageContainer.onmouseout = () => {
   imgElement.style.transform = 'scale(1)';
   imgElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  };

  // Click to show full screen
  imageContainer.onclick = (e) => {
   e.stopPropagation();
   const fullImageUrl = originalUrl || imageUrl;
   if (typeof showFullImageModal === 'function') {
    showFullImageModal(fullImageUrl);
   } else {
    console.warn('showFullImageModal function not found');
   }
  };

  imageContainer.appendChild(loader);
  imageContainer.appendChild(imgElement);
  mainContainer.appendChild(imageContainer);

 } else {
  // No image available - show placeholder
  const placeholderContainer = document.createElement('div');
  placeholderContainer.style.cssText = 'width: 100%; min-height: 150px; border: 2px dashed #dee2e6; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8f9fa; margin-bottom: 10px;';

  const placeholderIcon = document.createElement('i');
  placeholderIcon.className = 'fas fa-image';
  placeholderIcon.style.cssText = 'font-size: 48px; color: #adb5bd; margin-bottom: 10px;';

  const placeholderText = document.createElement('p');
  placeholderText.textContent = 'No image available';
  placeholderText.style.cssText = 'color: #6c757d; margin: 0; font-size: 14px;';

  placeholderContainer.appendChild(placeholderIcon);
  placeholderContainer.appendChild(placeholderText);
  mainContainer.appendChild(placeholderContainer);
 }

 // Add edit button if enabled
 if (showEditButton) {
  const editContainer = document.createElement('div');
  editContainer.style.cssText = 'display: flex; justify-content: flex-end; margin-top: 8px;';

  // Create edit button
  const editBtn = document.createElement('button');
  editBtn.innerHTML = hasImage ? '<i class="fas fa-edit"></i> Change Image' : '<i class="fas fa-plus"></i> Add Image';
  editBtn.style.cssText = 'background: linear-gradient(135deg, #FF9800, #F57C00); color: white; border: none; border-radius: 50px; padding: 6px 16px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 6px;';

  editBtn.onmouseover = () => {
   editBtn.style.transform = 'translateY(-2px)';
   editBtn.style.boxShadow = '0 4px 12px rgba(255,152,0,0.3)';
  };
  editBtn.onmouseout = () => {
   editBtn.style.transform = 'translateY(0)';
   editBtn.style.boxShadow = 'none';
  };

  // Prevent multiple picks
  let isPicking = false;

  editBtn.onclick = async (e) => {
   e.stopPropagation();
   e.preventDefault();

   if (isPicking) {
    console.log('Image picker already open');
    return;
   }

   isPicking = true;

   try {
    mraImgPickTarget = { inputId, divId, key, fullObject, isGallery: false };
    // 4th arg preloads the image already stored for this field, so 'Change Image'
    // opens the modal showing the current picture. Prefer the full-size original.
    await loadExe2Fn(51, [window.afterimagesetcallrun3, imgObjDimensRqd3, 0, originalUrl || imageUrl || ''], [1]);
   } catch (error) {
    console.error('my1img error:', error);
    mraImgPickTarget = null;

    if (typeof showToast === 'function') {
     showToast('Could not open image picker: ' + error.message, {
      duration: 3000,
      position: 'top',
      type: 'error',
      dismissible: true
     });
    }
   } finally {
    isPicking = false;
   }
  };

  editContainer.appendChild(editBtn);
  mainContainer.appendChild(editContainer);
 }

 divElement.appendChild(mainContainer);
}
function setSiblingTags(inputId, value, divId, key, fullObject) {
 if (!divId) return;

 const divElement = document.getElementById(divId);
 if (!divElement) return;

 // Store canAdd value and ORIGINAL parameters on the div element (only on first load)
 if (fullObject.canAdd !== undefined && !divElement.hasAttribute('data-initialized')) {
  divElement.setAttribute('data-can-add', fullObject.canAdd);
  divElement.setAttribute('data-params', JSON.stringify(fullObject.params || []));
  divElement.setAttribute('data-initialized', 'true');
 }

 // Get stored values
 const storedCanAdd = divElement.getAttribute('data-can-add');
 const storedParams = divElement.getAttribute('data-params');
 const canAddValue = (fullObject.canAdd !== undefined) ? fullObject.canAdd : (storedCanAdd ? parseInt(storedCanAdd) : 0);
 const params = storedParams ? JSON.parse(storedParams) : [];

 // Hide the input element if it exists
 const inElement = document.getElementById(inputId);
 if (inElement) {
  inElement.value = value;
  inElement.style.display = 'none';
 };

 // Clear previous content
 divElement.innerHTML = '';

 // Convert value to string and handle comma-separated sibling strings
 const valueStr = value !== null && value !== undefined ? String(value) : '';

 // Parse sibling strings
 let siblings = [];
 if (valueStr && valueStr.trim() !== '') {
  try {
   let cleanStr = valueStr;
   if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
    cleanStr = cleanStr.slice(1, -1);
   }

   const matches = cleanStr.match(/("[^"]*"|[^,]+)/g);
   if (matches) {
    siblings = matches.map(s => s.replace(/^"|"$/g, '').trim()).filter(s => s !== '');
   } else {
    siblings = cleanStr.split(',').map(s => s.trim()).filter(s => s !== '');
   }
  } catch (e) {
   console.log('Error parsing sibling string:', e);
   siblings = [];
  }
 }

 // Create main container for preview and edit button
 const mainContainer = document.createElement('div');
 mainContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';

 // Create preview container with styling
 const previewContainer = document.createElement('div');
 previewContainer.className = 'sibling-preview-container';
 previewContainer.style.cssText = `
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  flex: 1;
 `;

 // Create header with total count
 const header = document.createElement('div');
 header.style.cssText = `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 2px solid #7B1FA2;
 `;

 const title = document.createElement('span');
 title.style.cssText = `
  font-weight: 600;
  color: #495057;
  font-size: 14px;
 `;
 title.textContent = 'Siblings List';

 const count = document.createElement('span');
 count.style.cssText = `
  background: #7B1FA2;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
 `;
 count.textContent = `Total: ${siblings.length}`;

 header.appendChild(title);
 header.appendChild(count);
 previewContainer.appendChild(header);

 if (siblings.length === 0) {
  const emptyMsg = document.createElement('div');
  emptyMsg.style.cssText = `
   text-align: center;
   color: #6c757d;
   padding: 20px;
   font-style: italic;
   font-size: 14px;
  `;
  emptyMsg.textContent = 'No siblings added yet';
  previewContainer.appendChild(emptyMsg);
 } else {
  // Create list container
  const listContainer = document.createElement('div');
  listContainer.style.cssText = `
   max-height: 250px;
   overflow-y: auto;
   padding: 5px;
  `;

  // Process each sibling string
  siblings.forEach((sibling, index) => {
   const siblingItem = document.createElement('div');
   siblingItem.style.cssText = `
    display: flex;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 6px;
    background: white;
    border-left: 3px solid #7B1FA2;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
   `;

   // Parse sibling string
   const cleanSibling = sibling.trim();
   let displayText = '';
   let icon = '';

   if (cleanSibling === '3') {
    displayText = 'Self';
    icon = 'ðŸ‘¤';
   } else {
    try {
     let clean = cleanSibling.replace(/^"|"$/g, '');
     const typeParts = clean.split('~');
     const type = typeParts[0];
     const rest = typeParts[1];

     if (rest) {
      const ageMaritalParts = rest.split('!');
      const elderYounger = ageMaritalParts[0];
      const marStts_lvngStts = ageMaritalParts[1].split('@');
      const maritalVal = marStts_lvngStts[0];
      const lvng_stts = marStts_lvngStts[1];

      const parts = elderYounger.split('@');
      const ageVal = parts[0];

      let typeText = '';
      if (type === '1') {
       typeText = 'Brother';
       icon = 'ðŸ‘¨';
      } else if (type === '2') {
       typeText = 'Sister';
       icon = 'ðŸ‘©';
      } else {
       typeText = '';
       icon = 'ðŸ‘¤';
      }

      let ageText = '';
      if (ageVal === '1') {
       ageText = 'Elder';
      } else if (ageVal === '2') {
       ageText = 'Younger';
      }

      const maritalText = getMaritalTextShort(maritalVal);
      const livingText = getLivingTextShort(lvng_stts);

      const partsArray = [typeText];
      if (ageText) partsArray.push(ageText);
      if (maritalText) partsArray.push(maritalText);
      if (livingText) partsArray.push(livingText);

      displayText = partsArray.join(' | ');
     } else {
      displayText = clean;
      icon = 'ðŸ‘¤';
     }
    } catch (e) {
     console.log('Error parsing sibling:', cleanSibling, e);
     displayText = cleanSibling;
     icon = 'ðŸ‘¤';
    }
   }

   // Create icon element
   const iconSpan = document.createElement('span');
   iconSpan.style.cssText = `
    font-size: 18px;
    margin-right: 10px;
    width: 24px;
    text-align: center;
   `;
   iconSpan.textContent = icon || 'ðŸ‘¤';

   // Create text element
   const textSpan = document.createElement('span');
   textSpan.style.cssText = `
    flex: 1;
    font-size: 13px;
    color: #212529;
   `;
   textSpan.textContent = displayText || cleanSibling;

   // Create index badge
   const indexBadge = document.createElement('span');
   indexBadge.style.cssText = `
    background: #e9ecef;
    color: #495057;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    margin-left: 8px;
   `;
   indexBadge.textContent = `#${index + 1}`;

   siblingItem.appendChild(iconSpan);
   siblingItem.appendChild(textSpan);
   siblingItem.appendChild(indexBadge);

   // Add delete button if canAddValue > 0
   if (canAddValue > 0) {
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.style.cssText = `
     background: transparent;
     border: none;
     color: #dc3545;
     cursor: pointer;
     font-size: 14px;
     margin-left: 8px;
     padding: 4px 8px;
     border-radius: 4px;
    `;
    deleteBtn.title = 'Remove sibling';
    deleteBtn.onclick = (function (idx) {
     return function (e) {
      e.stopPropagation();
      if (confirm('Remove this sibling from list?')) {
       siblings.splice(idx, 1);

       // Update the value string
       const newValueStr = siblings.map(s => `"${s}"`).join(',');

       // Update input element
       if (inElement) {
        inElement.value = newValueStr;
       }

       // Re-render the component
       setSiblingTags(inputId, newValueStr, divId, key, fullObject);
      }
     };
    })(index);

    siblingItem.appendChild(deleteBtn);
   }

   listContainer.appendChild(siblingItem);
  });

  previewContainer.appendChild(listContainer);
 }

 mainContainer.appendChild(previewContainer);

 // Add edit button if needed
 if (canAddValue > 0) {
  addEditButtonForSiblings(mainContainer, inputId, value, divId, key, fullObject, canAddValue, params);
 }

 divElement.appendChild(mainContainer);

 // Helper functions
 function getMaritalTextShort(value) {
  const map = {
   '1': 'Never Marr',
   '2': 'Married',
   '3': 'Divorced',
   '4': 'Widow/er',
   '5': 'Separated',
   '6': 'Await Div'
  };
  return map[value] || '';
 }

 function getLivingTextShort(value) {
  const map = {
   '1': 'With us',
   '2': 'Separate',
   '3': 'With spouse'
  };
  return map[value] || '';
 }
}
function addEditButtonForSiblings(container, inputId, value, divId, key, fullObject, canAddValue, params) {
 const editButtonContainer = document.createElement('div');
 editButtonContainer.style.cssText = 'display: flex; justify-content: flex-end; margin-top: 8px;';

 const editBtn = document.createElement('button');
 editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Siblings';
 editBtn.style.cssText = 'background: linear-gradient(135deg, #FF9800, #F57C00); color: white; border: none; border-radius: 50px; padding: 6px 16px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 6px;';

 editBtn.onmouseover = () => {
  editBtn.style.transform = 'translateY(-2px)';
  editBtn.style.boxShadow = '0 4px 12px rgba(255,152,0,0.3)';
 };
 editBtn.onmouseout = () => {
  editBtn.style.transform = 'translateY(0)';
  editBtn.style.boxShadow = 'none';
 };

 editBtn.onclick = (e) => {
  e.stopPropagation();
  e.preventDefault();

  // Get the sibling_csh_no from params (first element of params array)
  const siblingCshNo = params[0] || 30;
  const siblingParams = params[1] || [null, 'div_x', 1, "callBackFn_forSiblings"];
  const loaderParams = params[2] || [1];

  // Update the first parameter with current input value
  siblingParams[0] = value;
  // Update the second parameter with the div ID
  siblingParams[1] = divId;

  // Call loadExe2Fn
  if (typeof window.loadExe2Fn === 'function') {
   window.loadExe2Fn(siblingCshNo, siblingParams, loaderParams);
  } else {
   console.warn('loadExe2Fn function not found');
  }
 };

 editButtonContainer.appendChild(editBtn);
 container.appendChild(editButtonContainer);
}
async function saveProfileChanges(inputId, value, divId, key, fullObject) {
 // Show loader
 const loaderId = 'save_profile_loader';
 let loader = document.getElementById(loaderId);
 if (!loader) {
  loader = createDynamicLoader2(loaderId, 'Saving changes...', null);
 } else {
  loader.style.display = 'flex';
 }

 try {
  // Get parameters from fullObject
  const colsToSubmit = fullObject.originalItem.f;
  const fn = fullObject.originalItem.g;  // functionNumber (62)
  const update1New0 = fullObject.originalItem.h;  // 0 = update, 1 = new

  // Prepare formData from the input fields
  let formData = {};

  if (colsToSubmit) {
   // If colsToSubmit is a comma-separated string, split it
   let fieldsArray = [];
   if (typeof colsToSubmit === 'string') {
    fieldsArray = colsToSubmit.split(',').map(f => f.trim());
   } else if (Array.isArray(colsToSubmit)) {
    fieldsArray = colsToSubmit;
   }

   // Collect values from form fields
   const allFields = window.mraFormFields || {};

   for (const fieldKey of fieldsArray) {
    if (allFields[fieldKey] && allFields[fieldKey].input) {
     formData[fieldKey] = allFields[fieldKey].input.value;
    } else {
     // Try to get element by ID directly
     const element = document.getElementById(`mra__${fieldKey}`);
     if (element) {
      formData[fieldKey] = element.value;
     } else {
      formData[fieldKey] = '';
     }
    }
   }
  } else {
   // If no colsToSubmit, collect all fields
   const allFields = window.mraFormFields || {};
   for (const [fieldKey, field] of Object.entries(allFields)) {
    formData[fieldKey] = field.input.value;
   }
  }

  console.log('FormData collected:', formData);
  console.log('Function number:', fn);
  console.log('Update/New mode:', update1New0);

  // Get validation rules for this function
  const validationRules = window["vlidFn62_63"];//window["vlidFn" + fn];
  if (validationRules) {
   const validationResult = cmnVldet(formData, validationRules);

   if (validationResult.su !== 1) {
    // Hide loader
    if (loader && loader.hideLoader) {
     loader.hideLoader();
    } else {
     const ldr = document.getElementById(loaderId);
     if (ldr) ldr.style.display = 'none';
    }

    // Show validation error toast
    if (typeof showToast === 'function') {
     showToast(validationResult.ms, {
      type: 'error',
      duration: 5000,
      position: 'top'
     });
    } else {
     alert(validationResult.ms);
    }

    // Scroll to first invalid field
    if (validationResult.fld) {
     const invalidFieldId = `mra__${validationResult.fld}`;
     const invalidInput = document.getElementById(invalidFieldId);
     if (invalidInput) {
      const formGroup = invalidInput.closest('.mra__form-group');
      if (formGroup) {
       formGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
       invalidInput.classList.add('is-invalid');
       invalidInput.style.borderColor = '#dc3545';
       invalidInput.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
       setTimeout(() => { invalidInput.classList.remove('is-invalid'); invalidInput.style.borderColor = ''; invalidInput.style.boxShadow = ''; }, 3000);
      }
     }
    }
    return;
   }
  }

  payload0.vw = 4;
  payload0.fn = fn;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'mr' }]);

  // Set x1 based on update1New0 flag
  if (update1New0 == 1) {
   payload0.x1 = formData["a"];
  } else {
   // Update existing record
   payload0.x1 = null;
  }


  const propertiesToClean = ['h', 'i', 'r', 'a1', 'a8', 'b1'];
  const cleaned = { ...formData };
  propertiesToClean.forEach(key => {
   if (cleaned[key] !== undefined) { cleaned[key] = cleanNumericProperty(cleaned[key], key); }
  });

  // Set form data to x2
  payload0.x2 = cleaned;
  payload0.drml = window[my1uzr.worknOnPg]?.clientConfig?.drml;
  console.log('Payload0:', payload0);
  let urlPart = "f.php";
  if (fn == 68) {
   urlPart = "c.php";
  }
  // Make API call
  const response = await fnj3("https://my1.in/2/" + urlPart, payload0, 1, true, null, 20000, 0, 1, 1);

  // Hide loader
  if (loader && loader.hideLoader) {
   loader.hideLoader();
  } else {
   const ldr = document.getElementById(loaderId);
   if (ldr) ldr.style.display = 'none';
  }

  if (response.su == 1) {

   const draftKey = "mra_" + '_draft';//prfix + '_draft' so that auto save profile changes are cleared;
   localStorage.removeItem(draftKey);

   // Call the response handler if available
    if (typeof hndl_mr_rspo === 'function') {
     hndl_mr_rspo(response, 1, null, null);
    } else if (typeof hndl_mrrspo === 'function') {
     hndl_mrrspo(response, 0, null, null, payload0);
     refreshUiAfterMrSave(response);
    }

   // Show success message
   if (typeof showToast === 'function') {
    showToast('Profile saved successfully!', {
     type: 'success',
     duration: 3000,
     position: 'top'
    });
   } else {
    alert('Profile saved successfully!');
   }

   // Close the modal if modalInstance is available
   if (fullObject.modalInstance) {
    fullObject.modalInstance.hide();
   } else if (typeof mraModalInstance !== 'undefined' && mraModalInstance) {
    mraModalInstance.hide();
   }

  } else {
   throw new Error(response.ms || 'Save failed');
  }

 } catch (error) {
  console.error('Error saving profile:', error);

  // Hide loader on error
  const ldr = document.getElementById(loaderId);
  if (ldr) ldr.style.display = 'none';

  if (typeof showToast === 'function') {
   showToast('Failed to save changes: ' + error.message, {
    type: 'error',
    duration: 5000,
    position: 'top'
   });
  } else {
   alert('Error saving changes: ' + error.message);
  }
 }
}
async function executeLoadExe2Fn(inputId, value, divId, key, fullObject) {
 console.log('executeLoadExe2Fn called with:', { inputId, value, divId, key, fullObject });

 // Extract parameters from fullObject
 const id_as_a = fullObject.c;
 const params = fullObject.d;
 const loaderParams = fullObject.e;

 // Call loadExe2Fn with extracted parameters
 await loadExe2Fn(id_as_a, params, loaderParams);
}
//used specially to align with existing call back function in https://cdn.jsdelivr.net/gh/sifr-in/cdn@3988bc6/cmn/ei.js;
function callBck_mra_e(value, inputId) {
 document.getElementById(inputId + "_div").innerHTML = value.i + " " + value.h + " " + value.e;
 document.getElementById(inputId).value = value.a;
 document.getElementById('mra__f').value = "1";
}
function set_mra_e(inputId, value, divId, key, fullObject) {
 // Find the record from c_table
 const tmp1271Reco = c_table.find(item => String(item.a) === String(value));

 // Get the div element
 const divElement = document.getElementById(divId);
 if (!divElement) return;

 // Get the input element
 const inputElement = document.getElementById(inputId);
 if (inputElement) {
  inputElement.value = value;
 }

 // Set the 'mra__f' input if it exists
 const fElement = document.getElementById('mra__f');
 if (fElement) {
  fElement.value = "1";
 }

 // Get the parent container (the form-group)
 const formGroup = divElement.closest('.mra__form-group');
 if (!formGroup) return;

 // Check if edit button container already exists
 let editButtonContainer = formGroup.querySelector('.mra__edit-button-container');

 // If edit button container doesn't exist, create it
 if (!editButtonContainer) {
  editButtonContainer = document.createElement('div');
  editButtonContainer.className = 'mra__edit-button-container';
  editButtonContainer.style.cssText = 'display: flex; justify-content: flex-end; margin-top: 8px;';
  formGroup.appendChild(editButtonContainer);
 } else {
  // Clear existing content
  editButtonContainer.innerHTML = '';
 }

 // Set the display content in the div
 if (tmp1271Reco) {
  divElement.innerHTML = `${tmp1271Reco.i || ''} ${tmp1271Reco.h || ''} ${tmp1271Reco.e || ''}`.trim();
  divElement.style.cssText = 'font-size: 0.875rem; color: #0d6efd; background: #e7f1ff; border-radius: 0.25rem; padding: 0.375rem;';
 } else {
  divElement.innerHTML = '<span class="text-muted">Not specified</span>';
  divElement.style.cssText = 'font-size: 0.875rem; color: #6c757d; background: #f8f9fa; border-radius: 0.25rem; padding: 0.375rem;';
 }

 // Check if edit button should be shown
 const canEdit = fullObject && fullObject.canEdit === 1;
 const params = fullObject && fullObject.params ? fullObject.params : null;

 if (canEdit && params) {
  // Create edit button
  const editBtn = document.createElement('button');
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.style.cssText = 'background: linear-gradient(135deg, #FF9800, #F57C00); color: white; border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 14px; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center;';
  editBtn.title = 'Edit';

  editBtn.onmouseover = () => {
   editBtn.style.transform = 'scale(1.1)';
   editBtn.style.boxShadow = '0 2px 8px rgba(255,152,0,0.4)';
  };
  editBtn.onmouseout = () => {
   editBtn.style.transform = 'scale(1)';
   editBtn.style.boxShadow = 'none';
  };

  editBtn.onclick = async (e) => {
   e.stopPropagation();
   e.preventDefault();

   // Call loadExe2Fn with the provided params
   if (params && Array.isArray(params) && params.length >= 3) {
    const id_as_a = params[0];
    const pFNarams = params[1];
    const pSCRParams = params[2];

    if (typeof window.loadExe2Fn === 'function') {
     await window.loadExe2Fn(id_as_a, pFNarams, pSCRParams);
    } else {
     console.warn('loadExe2Fn function not found');
    }
   } else {
    console.warn('Invalid params format for loadExe2Fn');
   }
  };

  editButtonContainer.appendChild(editBtn);
 } else if (editButtonContainer) {
  // If canEdit is false, hide or remove the edit button container
  editButtonContainer.style.display = 'none';
 }
}
function formatDate(date, format) {
 const pad = (num) => String(num).padStart(2, '0');

 const year = date.getFullYear();
 const month = pad(date.getMonth() + 1);
 const day = pad(date.getDate());
 const hour = pad(date.getHours());
 const minute = pad(date.getMinutes());
 const second = pad(date.getSeconds());

 switch (format) {
  case 'dd-mm-yyyy':
   return `${day}-${month}-${year}`;
  case 'dd-mm-yyyy HH:MM':
   return `${day}-${month}-${year} ${hour}:${minute}`;
  case 'dd-mm-yyyy HH:MM:SS':
   return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
  case 'dd/mm/yyyy':
   return `${day}/${month}/${year}`;
  case 'dd/mm/yyyy HH:MM':
   return `${day}/${month}/${year} ${hour}:${minute}`;
  case 'dd/mm/yyyy HH:MM:SS':
   return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  case 'yyyy-mm-dd':
   return `${year}-${month}-${day}`;
  case 'yyyy-mm-dd HH:MM':
   return `${year}-${month}-${day} ${hour}:${minute}`;
  case 'yyyy-mm-dd HH:MM:SS':
   return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  case 'yyyy/mm/dd':
   return `${year}/${month}/${day}`;
  case 'yyyy/mm/dd HH:MM':
   return `${year}/${month}/${day} ${hour}:${minute}`;
  case 'yyyy/mm/dd HH:MM:SS':
   return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  default:
   return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
 }
}
function convertDateStrToGvn(dateStr, cnvoOptions) {
 // Extract options
 const currentFormat = cnvoOptions.currentFormat;
 const targetFormat = cnvoOptions.targetFormat;
 const retType = cnvoOptions.retType || 0;

 // Return empty string if input is invalid
 if (!dateStr || typeof dateStr !== 'string') {
  return retType === 1 ? new Date(NaN) : '';
 }

 // Parse the current format to extract components
 let day, month, year, hour, minute, second;

 // Define format patterns
 const formatPatterns = {
  'dd-mm-yyyy': /^(\d{2})-(\d{2})-(\d{4})$/,
  'dd-mm-yyyy HH:MM': /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/,
  'dd-mm-yyyy HH:MM:SS': /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
  'dd/mm/yyyy': /^(\d{2})\/(\d{2})\/(\d{4})$/,
  'dd/mm/yyyy HH:MM': /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/,
  'dd/mm/yyyy HH:MM:SS': /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
  'yyyy-mm-dd': /^(\d{4})-(\d{2})-(\d{2})$/,
  'yyyy-mm-dd HH:MM': /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/,
  'yyyy-mm-dd HH:MM:SS': /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
  'yyyy/mm/dd': /^(\d{4})\/(\d{2})\/(\d{2})$/,
  'yyyy/mm/dd HH:MM': /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})$/,
  'yyyy/mm/dd HH:MM:SS': /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
 };

 // Get pattern for current format
 const pattern = formatPatterns[currentFormat];
 if (!pattern) {
  console.error(`Unsupported format: ${currentFormat}`);
  return retType === 1 ? new Date(NaN) : '';
 }

 // Match the date string against pattern
 const match = dateStr.match(pattern);
 if (!match) {
  console.error(`Date string "${dateStr}" does not match format "${currentFormat}"`);
  return retType === 1 ? new Date(NaN) : '';
 }

 // Determine if format has time component
 const hasTime = currentFormat.includes('HH:MM');
 const hasSeconds = currentFormat.includes('HH:MM:SS');

 // Extract components based on format
 if (currentFormat.includes('dd-mm-yyyy') || currentFormat.includes('dd/mm/yyyy')) {
  // Day-Month-Year format
  day = parseInt(match[1], 10);
  month = parseInt(match[2], 10);
  year = parseInt(match[3], 10);

  if (hasSeconds) {
   hour = parseInt(match[4], 10);
   minute = parseInt(match[5], 10);
   second = parseInt(match[6], 10);
  } else if (hasTime) {
   hour = parseInt(match[4], 10);
   minute = parseInt(match[5], 10);
   second = 0;
  } else {
   hour = 0;
   minute = 0;
   second = 0;
  }
 } else {
  // Year-Month-Day format
  year = parseInt(match[1], 10);
  month = parseInt(match[2], 10);
  day = parseInt(match[3], 10);

  if (hasSeconds) {
   hour = parseInt(match[4], 10);
   minute = parseInt(match[5], 10);
   second = parseInt(match[6], 10);
  } else if (hasTime) {
   hour = parseInt(match[4], 10);
   minute = parseInt(match[5], 10);
   second = 0;
  } else {
   hour = 0;
   minute = 0;
   second = 0;
  }
 }

 // CHECK FOR ZERO VALUES - if all date components are zero, return zeros in target format
 if (year === 0 && month === 0 && day === 0) {
  // Return zeros in the target format
  if (targetFormat === 'dd-mm-yyyy') {
   return '00-00-0000';
  } else if (targetFormat === 'dd/mm/yyyy') {
   return '00/00/0000';
  } else if (targetFormat === 'yyyy-mm-dd') {
   return '0000-00-00';
  } else if (targetFormat === 'yyyy/mm/dd') {
   return '0000/00/00';
  } else if (targetFormat && targetFormat.includes('HH:MM')) {
   // Handle formats with time
   const timePart = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
   if (targetFormat === 'dd-mm-yyyy HH:MM') {
    return `00-00-0000 ${timePart}`;
   } else if (targetFormat === 'dd/mm/yyyy HH:MM') {
    return `00/00/0000 ${timePart}`;
   } else if (targetFormat === 'yyyy-mm-dd HH:MM') {
    return `0000-00-00 ${timePart}`;
   } else if (targetFormat === 'yyyy/mm/dd HH:MM') {
    return `0000/00/00 ${timePart}`;
   }
  }
  return '00-00-0000';
 }

 // Create Date object (month is 0-indexed in JavaScript)
 const dateObj = new Date(year, month - 1, day, hour, minute, second);

 // Check if date is valid
 if (isNaN(dateObj.getTime())) {
  console.error('Invalid date created');
  return retType === 1 ? new Date(NaN) : '';
 }

 // If return type is 1, return Date object
 if (retType === 1) {
  return dateObj;
 }

 // Format the date according to target format
 return formatDate(dateObj, targetFormat);
}
function set_dtt(inputId, value, divId, key, fullObject) {
 // Get the input element
 const inputElement = document.getElementById(inputId);
 if (!inputElement) return;

 // Get the div element for preview (if needed)
 const divElement = document.getElementById(divId);

 // Get formats from fullObject
 const currentFormat = fullObject.c;
 const targetFormat = fullObject.d;

 // If no formats provided, show error and return
 if (!currentFormat || !targetFormat) {
  console.error('set_dtt: Missing format parameters. Need currentFormat (c) and targetFormat (d)');
  if (divElement) {
   divElement.innerHTML = '<span class="text-danger">Format configuration error</span>';
  }
  return;
 }

 // Convert the date string
 let convertedValue = value;
 try {
  if (value && value !== '') {
   // Create cnvoOptions object for convertDateStrToGvn
   const cnvoOptions = {
    currentFormat: currentFormat,
    targetFormat: targetFormat,
    retType: 0
   };
   convertedValue = convertDateStrToGvn(value, cnvoOptions);
  }
 } catch (e) {
  console.error('set_dtt: Error converting date', e);
  convertedValue = value;
  if (divElement) {
   divElement.innerHTML = '<span class="text-danger">Invalid date format</span>';
  }
  return;
 }

 // Set the converted value to input
 inputElement.value = convertedValue;

 // Also update the div if provided (for preview)
 if (divElement) {
  divElement.innerHTML = convertedValue;
  divElement.style.cssText = 'font-size: 0.875rem; color: #0d6efd; background: #e7f1ff; border-radius: 0.25rem; padding: 0.375rem;';
 }

 // Initialize datepicker with the target format
 // Determine datepicker format from targetFormat
 let datepickerFormat = 'dd-mm-yyyy';
 if (targetFormat === 'dd-mm-yyyy') {
  datepickerFormat = 'dd-mm-yyyy';
 } else if (targetFormat === 'dd/mm/yyyy') {
  datepickerFormat = 'dd/mm/yyyy';
 } else if (targetFormat === 'yyyy-mm-dd') {
  datepickerFormat = 'yyyy-mm-dd';
 } else if (targetFormat === 'yyyy/mm/dd') {
  datepickerFormat = 'yyyy/mm/dd';
 }

 $(inputElement).datepicker({
  format: datepickerFormat,
  autoclose: true,
  todayHighlight: true
 });

 // Hide the input element
 inputElement.style.display = 'block';
}

function shareProfl(inputId, value, divId, key, fullObject) {
 // Check if profile ID exists
 const profileId = fullObject?.keyVals?.w || value;

 if (!profileId) {
  if (typeof showToast === 'function') {
   showToast('Profile ID not found. Please contact admin.', {
    type: 'error',
    duration: 3000,
    position: 'top'
   });
  } else {
   alert('Profile ID not found. Please contact admin.');
  }
  return;
 }

 // Get the base URL without the filename
 let basePath = window.location.pathname;
 basePath = basePath.replace(/mr_/g, 'mr');

 // Remove everything after the last '/'
 const lastSlash = basePath.lastIndexOf('/');
 basePath = basePath.substring(0, lastSlash + 1);

 // Construct the share URL
 const shareUrl = `${window.location.protocol}//${window.location.host}${basePath}p/${profileId}.html`;

 // Share using native Android or Web Share API
 if (typeof Android !== 'undefined' && Android && typeof Android.shareApp === 'function') {
  // For Android WebView - pass the specific profile URL
  if (typeof Android.shareUrl === 'function') {
   Android.shareUrl(shareUrl);
  } else {
   fallbackShare(shareUrl);
  }
 } else if (navigator.share) {
  navigator.share({
   title: 'Matrimony Profile',
   text: 'Check out this profile!',
   url: shareUrl
  }).catch(() => fallbackShare(shareUrl));
 } else {
  fallbackShare(shareUrl);
 }
}

function fallbackShare(url) {
 prompt('Share this link manually:\n', url);
}

function confirmLeaveProfile(inputId, value, divId, key, fullObject) {
 // Get the button element that was clicked
 //  const buttonElement = document.getElementById(divId);
 //  if (!buttonElement) return;

 // Get the function names from fullObject
 const onOkFunction = fullObject.originalItem.runFnOnOk;
 const onCancelFunction = fullObject.originalItem.runFnOnCancel;

 // Create modal dynamically
 const modalId = 'confirm_leave_modal';

 // Remove existing modal if any
 const existingModal = document.getElementById(modalId);
 if (existingModal) {
  const bsModal = bootstrap.Modal.getInstance(existingModal);
  if (bsModal) bsModal.hide();
  existingModal.remove();
 }

 // Create new modal
 const modalObj = create_modal_dynamically(modalId);
 const modalInstance = modalObj.modalInstance;
 const modalElement = modalObj.modalElement;
 const modalBody = modalObj.contentElement;

 // Add custom class for styling
 modalElement.classList.add('confirm-leave-modal');

 // Set modal size
 const modalDialog = modalElement.querySelector('.modal-dialog');
 modalDialog.classList.add('modal-md');

 // Create modal content
 const modalContent = modalElement.querySelector('.modal-content');
 modalContent.innerHTML = '';

 // Create header
 const header = document.createElement('div');
 header.className = 'modal-header';
 header.style.cssText = 'background: linear-gradient(135deg, #dc3545, #b02a37); color: white; border-bottom: none;';
 header.innerHTML = `
  <h5 class="modal-title" style="color: white;">
   <i class="fas fa-sign-out-alt me-2"></i>Confirm Leave
  </h5>
  <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
 `;

 // Create body
 const body = document.createElement('div');
 body.className = 'modal-body';
 body.style.cssText = 'padding: 1.5rem;';

 body.innerHTML = `
  <div style="text-align: center; font-size: 48px; margin-bottom: 15px;">
   <i class="fas fa-question-circle" style="color: #dc3545;"></i>
  </div>
  <h4 style="text-align: center; margin-bottom: 20px;">Are you sure you want to leave?</h4>
  <p style="color: #6c757d; text-align: center; margin-bottom: 20px;">
   Please select a reason for leaving:
  </p>
  <div id="leaveReasonsContainer" style="margin-bottom: 20px;">
   ${window.mr_leavng_stts.map(reason => `
    <div class="form-check mb-2">
     <input class="form-check-input" type="radio" name="leaveReason" id="reason_${reason.a}" value="${reason.a}" ${reason.a === '' ? 'checked' : ''}>
     <label class="form-check-label" for="reason_${reason.a}">
      ${reason.e}
     </label>
    </div>
   `).join('')}
  </div>
 `;

 // Create footer
 const footer = document.createElement('div');
 footer.className = 'modal-footer d-flex justify-content-center gap-3 border-top-0';
 footer.style.cssText = 'border-top: none; padding-bottom: 1.5rem;';
 footer.innerHTML = `
  <button type="button" class="btn btn-secondary" id="cancelLeaveBtn" style="border-radius: 50px; padding: 8px 24px;">
   <i class="fas fa-times me-2"></i>Cancel
  </button>
  <button type="button" class="btn btn-danger" id="confirmLeaveBtn" style="border-radius: 50px; padding: 8px 24px;">
   <i class="fas fa-check me-2"></i>Leave
  </button>
 `;

 modalContent.appendChild(header);
 modalContent.appendChild(body);
 modalContent.appendChild(footer);

 // Store references for event handlers
 currentLeaveModal = {
  modalInstance: modalInstance,
  modalElement: modalElement,
  onOkFunction: onOkFunction,
  onCancelFunction: onCancelFunction,
  inputId: inputId,
  value: value,
  divId: divId,
  key: key,
  fullObject: fullObject
 };

 // Add event listeners after modal is in DOM
 setTimeout(() => {
  const confirmBtn = document.getElementById('confirmLeaveBtn');
  const cancelBtn = document.getElementById('cancelLeaveBtn');

  if (confirmBtn) {
   confirmBtn.onclick = async () => {
    // Get selected reason
    const selectedReason = document.querySelector('input[name="leaveReason"]:checked');
    if (!selectedReason) {
     if (typeof showToast === 'function') {
      showToast('Please select a reason', {
       type: 'warning',
       duration: 3000,
       position: 'top'
      });
     }
     return;
    }

    if (!fullObject.keyVals.a) {
     if (typeof showToast === 'function') {
      showToast('You are not registered', {
       type: 'warning',
       duration: 3000,
       position: 'top'
      });
     }
     return;
    }

    const reasonValue = parseInt(selectedReason.value);

    // Check if reason value is negative (< 0)
    if (reasonValue < 0) {

     if (reasonValue.toString() === fullObject.keyVals.d.toString()) {
      localStorage.removeItem(appOwner.tn + '_myEinMR');

      if (currentLeaveModal && currentLeaveModal.modalInstance) {
       currentLeaveModal.modalInstance.hide();
      }


      // Get the modal element
      const modalElement = document.getElementById("mra_");
      if (modalElement) {
       // Get Bootstrap modal instance
       const modal = bootstrap.Modal.getInstance(modalElement);
       if (modal) {
        modal.hide(); // Hide the modal first
       }
       // Remove from DOM
       modalElement.remove();
       // Remove from modal stack if you're using it
       if (typeof removeModalFromStack === 'function') {
        removeModalFromStack("abc");
       }
      }

      if (typeof showToast === 'function') {
       showToast('your status has already been updated', {
        type: 'warning',
        duration: 3000,
        position: 'top'
       });
      }
      return;
     }
     // Show loader
     const loaderId = 'leave_profile_loader';
     let loader = document.getElementById(loaderId);
     if (!loader) {
      loader = createDynamicLoader2(loaderId, 'Processing...', null);
     } else {
      loader.style.display = 'flex';
     }

     try {
      // Prepare payload (assuming payload0 exists globally)
      payload0.vw = 4;
      payload0.fn = fullObject.originalItem.fnNo2Del;// 69; // remove delete

      // Set x1 to reasonValue
      payload0.x1 = reasonValue;
      payload0.x2 = fullObject.keyVals.w;
      payload0.x3 = fullObject.keyVals.m;

      let fl2225Part = "c.php";
      if (payload0.fn == 67)
       fl2225Part = "h.php";
      // Make API call
      const response = await fnj3("https://my1.in/2/" + fl2225Part, payload0, 1, true, null, 20000, 0, 1, 1, 0);

      // Hide loader
      if (loader && loader.hideLoader) {
       loader.hideLoader();
      } else {
       const ldr = document.getElementById(loaderId);
       if (ldr) ldr.style.display = 'none';
      }
      if (response?.cd > 0) response.su = 1;//set success to 1 because it is not handled deliberately on server;
      if (response.su == 1) {
       console.log('removed successfully:', response);

       // Call the response handler if available
       if (payload0.fn == 67)
        hndl_mr_rspo(response, 0, null, null, payload0);
       else
        hndl_mrrspo(response, 0, null, null, payload0);

       localStorage.setItem(appOwner.tn + '_myEinMR', JSON.stringify(response.mr.l[0]));

       safeReload();

      } else {
       throw new Error(response.ms || 'Save failed');
      }

     } catch (error) {
      console.error('Error:', error);

      // Hide loader on error
      const ldr = document.getElementById(loaderId);
      if (ldr) ldr.style.display = 'none';

      if (typeof showToast === 'function') {
       showToast('Failed to submit: ' + error.message, {
        type: 'error',
        duration: 5000,
        position: 'top'
       });
      } else {
       alert('Error: ' + error.message);
      }
     }
    }

    // Close modal regardless (if not already closed)
    if (currentLeaveModal && currentLeaveModal.modalInstance) {
     currentLeaveModal.modalInstance.hide();
    }
   };
  }

  if (cancelBtn) {
   cancelBtn.onclick = () => {
    if (currentLeaveModal && currentLeaveModal.onCancelFunction && typeof window[currentLeaveModal.onCancelFunction] === 'function') {
     window[currentLeaveModal.onCancelFunction](
      currentLeaveModal.inputId,
      currentLeaveModal.value,
      currentLeaveModal.divId,
      currentLeaveModal.key,
      currentLeaveModal.fullObject
     );
    }
    if (currentLeaveModal && currentLeaveModal.modalInstance) {
     currentLeaveModal.modalInstance.hide();
    }
   };
  }
 }, 100);

 // Handle modal close on backdrop click
 modalElement.addEventListener('hidden.bs.modal', function () {
  currentLeaveModal = null;
 });

 // Show modal
 modalInstance.show();
}
function cleanNumericProperty(value, propertyKey) {
 if (value === null || value === undefined || value === '') return '0';

 const str = String(value).toLowerCase().trim();

 // Handle height (h): "4.4 feet" or "4 feet 4 inch" -> "4.4"
 if (propertyKey === 'h') {
  const feetInchMatch = str.match(/(\d+)\s*feet\s*(\d+)\s*inch/);
  if (feetInchMatch) { return (parseInt(feetInchMatch[1]) + parseInt(feetInchMatch[2]) / 12).toFixed(1); }
  const feetMatch = str.match(/(\d+\.?\d*)\s*feet/);
  if (feetMatch) { return parseFloat(feetMatch[1]).toFixed(1); }
  const numMatch = str.match(/(\d+\.?\d*)/);
  if (numMatch) { return parseFloat(numMatch[1]).toFixed(1); }
 }

 // Handle income (i): "6.6 lakhs" or "6 lakhs 60 thousand" -> "6.6"
 if (propertyKey === 'i') {
  const lakhThousandMatch = str.match(/(\d+)\s*lakhs?\s*(\d+)\s*thousand/);
  if (lakhThousandMatch) { return (parseInt(lakhThousandMatch[1]) + parseInt(lakhThousandMatch[2]) / 100).toFixed(1); }
  const lakhMatch = str.match(/(\d+\.?\d*)\s*lakhs?/);
  if (lakhMatch) { return parseFloat(lakhMatch[1]).toFixed(1); }
  const numMatch = str.match(/(\d+\.?\d*)/);
  if (numMatch) { return parseFloat(numMatch[1]).toFixed(1); }
 }

 // Handle education (r): "12 commerce" -> "12"
 if (propertyKey === 'r') {
  const numMatch = str.match(/(\d+)/);
  if (numMatch) { return numMatch[1]; }
 }

 // Handle weight (a1): "56 kg 500 gram" -> "56.5"
 if (propertyKey === 'a1') {
  const kgGramMatch = str.match(/(\d+)\s*kg\s*(\d+)\s*gram/);
  if (kgGramMatch) { return (parseInt(kgGramMatch[1]) + parseInt(kgGramMatch[2]) / 1000).toFixed(1); }
  const kgMatch = str.match(/(\d+\.?\d*)\s*kg/);
  if (kgMatch) { return parseFloat(kgMatch[1]).toFixed(1); }
  const numMatch = str.match(/(\d+\.?\d*)/);
  if (numMatch) { return parseFloat(numMatch[1]).toFixed(1); }
 }

 // Handle houses (a8): "2 house 1 shop" -> "3"
 // Handle vehicles (b1): "3 honda 1 civi" -> "4" or "1 2 wheeler 1 4 wheeler" -> "2"
 if (propertyKey === 'a8' || propertyKey === 'b1') {
  const allNums = str.match(/(\d+)/g);
  if (allNums) { const total = allNums.reduce((sum, num) => sum + parseInt(num), 0); return String(total); }
 }

 // Default: extract first number
 const numMatch = str.match(/(\d+\.?\d*)/);
 return numMatch ? numMatch[1] : '0';
}

 function getOrderedKeys(labels, displaySequence, hiddenKeys) {
  const allKeys = Object.keys(labels);

  // Parse display sequence (arg[7])
  const sequenceArray = displaySequence ? displaySequence.split(',').map(k => k.trim()) : [];

  // Create ordered list (include ALL keys, hidden keys will be hidden later)
  const orderedKeys = [];

  // First add keys from display sequence (include hidden keys here)
  for (const seqKey of sequenceArray) {
   if (labels[seqKey] !== undefined && !orderedKeys.includes(seqKey)) {
    orderedKeys.push(seqKey);
   }
  }

  // Then add remaining keys (including hidden ones that weren't in sequence)
  for (const key of allKeys) {
   if (!orderedKeys.includes(key)) {
    orderedKeys.push(key);
   }
  }

  return orderedKeys;
 }
