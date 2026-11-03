// clr_cache.js - Clear all browser cache with confirmation modal
(function () {
 'use strict';

 async function clearAllCache() {
  var errors = [];

  // 0. Clear cookies for this site
  try {
   document.cookie.split(';').forEach(function (cookie) {
    var name = cookie.split('=')[0].trim();
    if (!name) return;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname;
   });
  } catch (e) { errors.push('Cookies: ' + e.message); }

  // 1. Clear Cache API
  if ('caches' in window) {
   try {
    var cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(function (name) { return caches.delete(name); }));
   } catch (e) { errors.push('Cache API: ' + e.message); }
  }

  // 2. Unregister all service workers
  if ('serviceWorker' in navigator) {
   try {
    var registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(function (reg) { return reg.unregister(); }));
   } catch (e) { errors.push('Service Worker: ' + e.message); }
  }

  // 3. Clear legacy Application Cache
  try {
   if (window.applicationCache && typeof window.applicationCache.update === 'function') {
    window.applicationCache.update();
   }
  } catch (e) { errors.push('Application Cache: ' + e.message); }

  // 4. Clear IndexedDB
  if ('indexedDB' in window) {
   try {
    var dbs = await indexedDB.databases();
    await Promise.all(dbs.map(function (db) {
     return new Promise(function (resolve) {
      var req = indexedDB.deleteDatabase(db.name);
      req.onsuccess = function () { resolve(); };
      req.onerror = function () { resolve(); };
      req.onblocked = function () { resolve(); };
     });
    }));
   } catch (e) { errors.push('IndexedDB: ' + e.message); }
  }

  // 5. Clear localStorage and sessionStorage
  try { localStorage.clear(); } catch (e) { errors.push('localStorage: ' + e.message); }
  try { sessionStorage.clear(); } catch (e) { errors.push('sessionStorage: ' + e.message); }

  return errors;
 }

 window.showClearCacheModal = function () {
  if (typeof create_modal_dynamically !== 'function') {
   if (typeof showToast === 'function') showToast('Modal system not available', { type: 'error', duration: 2000 });
   return;
  }

  var modalId = 'clearCacheModal_' + Date.now();
  var modalResult = create_modal_dynamically(modalId);
  if (!modalResult) {
   if (typeof showToast === 'function') showToast('Failed to create modal', { type: 'error', duration: 2000 });
   return;
  }

  var contentElement = modalResult.contentElement;
  var modalInstance = modalResult.modalInstance;
  var modalElement = modalResult.modalElement;

  var md = modalElement ? modalElement.querySelector('.modal-dialog') : null;
  if (md) {
   md.classList.remove('modal-dialog-centered');
   md.style.marginTop = '16.5vh';
   md.style.maxWidth = '420px';
  }

  contentElement.innerHTML =
   '<div class="p-4 text-center">' +
   '<div class="mb-3"><i class="fas fa-broom text-warning" style="font-size:48px;"></i></div>' +
   '<h5 class="text-dark mb-2">Clear Cache Memory</h5>' +
   '<p class="text-muted mb-3">This will clear all cached data including Cache API, Service Workers, IndexedDB, localStorage, and sessionStorage. You may need to log in again.</p>' +
   '<div class="d-flex justify-content-center gap-2">' +
   '<button class="btn btn-secondary btn-sm" id="cancelClearCacheBtn_' + modalId + '">Cancel</button>' +
   '<button class="btn btn-danger btn-sm" id="confirmClearCacheBtn_' + modalId + '"><i class="fas fa-trash me-1"></i>Clear All</button>' +
   '</div></div>';

  contentElement.querySelector('#cancelClearCacheBtn_' + modalId).addEventListener('click', function () {
   modalInstance.hide();
  });

  contentElement.querySelector('#confirmClearCacheBtn_' + modalId).addEventListener('click', async function () {
   var btn = this;
   btn.disabled = true;
   btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Clearing...';

   var errors = await clearAllCache();

   modalInstance.hide();

   if (errors.length > 0) {
    if (typeof showToast === 'function') showToast('Cache cleared with some errors: ' + errors.join(', '), { type: 'warning', duration: 4000 });
   } else {
    if (typeof showToast === 'function') showToast('All cache cleared successfully!', { type: 'success', duration: 2000 });
   }

   // Force a fresh, cache-bypassing reload so the app opens like a new device.
   setTimeout(function () {
    try {
     var url = window.location.pathname + window.location.search;
     url += (window.location.search ? '&' : '?') + '_cb=' + Date.now();
     url += window.location.hash;
     window.location.replace(url);
    } catch (e) {
     window.location.reload(true);
    }
   }, 1000);
  });

  modalInstance.show();
 };

})();