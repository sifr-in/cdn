// Initialize Firebase
loadScript('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js', function () {
 loadScript('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js', function () {
  // Firebase configuration - replace with your actual config
  const firebaseConfig = {
   apiKey: "AIzaSyDWms1JTFHIjoC6ojArrfYdkrU8f77C8g8",
   authDomain: "my-erp-d177d.firebaseapp.com",
   projectId: "my-erp-d177d",
   messagingSenderId: "741533059847",
   appId: "1:741533059847:web:b8731dd01193d6035793a2"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize messaging here
  if (typeof firebase !== 'undefined' && firebase.messaging) {
   messaging = firebase.messaging();
   console.log('Firebase messaging initialized globally');
  }

  // Now that Firebase is initialized, we can proceed with PWA initialization
  initializePWAAfterFirebase();
 });
});

let messaging = null;
let deferredPrompt = null;
const SW_STATE_KEY = `my1.in_sw_state`;

function initializePWAAfterFirebase() {

 // DOM elements for modals
 const n_ame_of_install_modal = 'pwa_install_modal';
 const n_ame_of_progress_modal = 'pwa_progress_modal';

 function initPWA() {
  // Handle before install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
   console.log('beforeinstallprompt event fired');
   e.preventDefault();
   deferredPrompt = e;

   // Show floating install button when install prompt is available
   if (shouldShowInstallPrompt()) {
    setTimeout(() => {
     createInstallPWAButton();
    }, 3000);
   }

   if (appData != null && appData.shoInstallAppModal) {
    if (appData.shoInstallAppModal === 1) {
     console.log('Showing install modal');
     f_n_sho_install_modal();
    }
   } else {
    console.log('"shoInstallAppModal" is not defined.');
   }
  });

  // Check if app is installed
  window.addEventListener('appinstalled', () => {
   console.log('PWA installed successfully');
   // Remove install button if it exists
   removeInstallPWAButton();

   // For installed PWA, we can be more direct with permission request
   const currentPermission = getNotificationPermissionStatus();
   if (currentPermission === 'granted') {
    registerServiceWorker();
   } else if (currentPermission === 'default') {
    // Show floating button for installed PWA
    setTimeout(() => {
     createNotificationPermissionButton();
    }, 2000);
   } else {
    registerServiceWorker();
   }
  });

  // Check if app is already installed
  const isPWAInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');

  if (isPWAInstalled) {
   console.log('PWA is already installed');
   registerServiceWorker();

   // Show floating button for already installed PWA if notifications not granted
   const currentPermission = getNotificationPermissionStatus();
   if (currentPermission !== 'granted') {
    setTimeout(() => {
     createNotificationPermissionButton();
    }, 2000);
   }
  } else {
   // For non-installed site, check if we should show install button
   if (shouldShowInstallPrompt()) {
    setTimeout(() => {
     createInstallPWAButton();
    }, 3000);
   }

   // Also show notification button
   setTimeout(() => {
    createNotificationPermissionButton();
   }, 2000);
  }
 }

 // Install PWA Button Functions
 function createInstallPWAButton() {
  // Check if we should show the button based on dismissal rules
  if (!shouldShowInstallPrompt()) {
   return;
  }

  // Don't show if already installed
  const isPWAInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isPWAInstalled) {
   return;
  }

  // Don't show if button already exists
  if (document.getElementById('install-pwa-btn-container')) {
   return;
  }

  // Create draggable install prompt button
  const btnContainer = document.createElement('div');
  btnContainer.className = 'd-flex align-items-center shadow';
  btnContainer.style.position = 'fixed';
  btnContainer.style.bottom = '80px'; // Position above notification button
  btnContainer.style.right = '20px';
  btnContainer.style.zIndex = '10000';
  btnContainer.style.backgroundColor = 'white';
  btnContainer.style.padding = '8px 12px';
  btnContainer.style.borderRadius = '20px';
  btnContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  btnContainer.style.cursor = 'grab';
  btnContainer.style.userSelect = 'none';
  btnContainer.style.touchAction = 'none';
  btnContainer.id = 'install-pwa-btn-container';

  // Make it draggable
  if (typeof makeDraggable === 'function') {
   makeDraggable(btnContainer);
  } else {
   console.error('makeDraggable function not found');
  }

  // Install button
  const installBtn = document.createElement('button');
  installBtn.className = 'btn btn-outline-success btn-sm';
  installBtn.innerHTML = '<i class="fas fa-download me-1"></i> Install App';
  installBtn.style.fontSize = '12px';
  installBtn.style.marginRight = '8px';
  installBtn.style.cursor = 'pointer';
  installBtn.style.pointerEvents = 'auto';

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn-close btn-close-sm';
  closeBtn.style.fontSize = '10px';
  closeBtn.title = 'Dismiss for 7 days';
  closeBtn.style.pointerEvents = 'auto';

  btnContainer.appendChild(installBtn);
  btnContainer.appendChild(closeBtn);

  installBtn.addEventListener('click', (e) => {
   e.stopPropagation();
   console.log('Install App button clicked');
   if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
     if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      showToast('App installation started!', { type: 'success' });
      removeInstallPWAButton();
     } else {
      console.log('User dismissed the install prompt');
     }
     deferredPrompt = null;
    });
   } else {
    // If deferredPrompt is not available, show the install modal
    f_n_sho_install_modal(1);
   }
  });

  closeBtn.addEventListener('click', (e) => {
   e.stopPropagation();
   console.log('Install button close clicked - setting 7-day dismissal');
   setInstallPromptDismissed();
   removeInstallPWAButton();
  });

  document.body.appendChild(btnContainer);

  // Auto-remove after 30 seconds
  setTimeout(() => {
   removeInstallPWAButton();
  }, 30000);
 }

 function removeInstallPWAButton() {
  const btnContainer = document.getElementById('install-pwa-btn-container');
  if (btnContainer) {
   btnContainer.remove();
  }
 }

 function shouldShowInstallPrompt() {
  // Check permanent "don't ask again" setting
  const dontAskPermanent = localStorage.getItem(`${my1uzr.worknOnPg}_dont_ask_install`);
  if (dontAskPermanent === 'true') {
   console.log('Permanent "don\'t ask again" for install is set');
   return false;
  }

  // Check temporary dismissal
  const dismissedUntil = localStorage.getItem(`${my1uzr.worknOnPg}_install_dismissed_until`);
  if (dismissedUntil) {
   const now = new Date().getTime();
   if (now < parseInt(dismissedUntil)) {
    console.log('Install prompt dismissed until:', new Date(parseInt(dismissedUntil)));
    return false;
   } else {
    // Period expired, clear the setting
    localStorage.removeItem(`${my1uzr.worknOnPg}_install_dismissed_until`);
   }
  }

  return true;
 }

 function setInstallPromptDismissed() {
  const sevenDaysFromNow = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);
  localStorage.setItem(`${my1uzr.worknOnPg}_install_dismissed_until`, sevenDaysFromNow.toString());
  console.log('Install prompt dismissed for 7 days');
 }

 function setInstallDontAskAgain() {
  localStorage.setItem(`${my1uzr.worknOnPg}_dont_ask_install`, 'true');
  console.log('Permanent "don\'t ask again" set for install');
  removeInstallPWAButton();
 }

 // Modified install modal to include "don't ask again" option
 window.f_n_sho_install_modal = function (showBoxForcefully = 0) {
  if (showBoxForcefully === 0) {
   const dontShowAgain = localStorage.getItem(`${my1uzr.worknOnPg}dont_show_install`);
   if (dontShowAgain === 'true' && appData != null && appData.shoDontShoInstallPWAAgain !== 0) {
    return;
   }
  }

  const modalId = n_ame_of_install_modal;
  if (document.getElementById(modalId)) return;

  const { contentElement, modalInstance } = create_modal_dynamically(modalId);

  contentElement.innerHTML = `
    <div class="modal-header">
      <h5 class="modal-title">${(appData && appData.msgToShoOnTtlInstallApp) || 'Install this app for better experience'}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body text-center">
      <i class="fas fa-mobile-alt fa-3x text-primary mb-3"></i>
      <p class="mb-3">Install our app for a faster, more reliable experience with offline access.</p>
      <div class="dismiss-options">
        <div class="form-check text-start mb-2">
          <input class="form-check-input" type="checkbox" id="${modalId}_dont_show_week">
          <label class="form-check-label" for="${modalId}_dont_show_week">
            Don't ask for a week
          </label>
        </div>
        <div class="form-check text-start">
          <input class="form-check-input" type="checkbox" id="${modalId}_dont_show_ever">
          <label class="form-check-label" for="${modalId}_dont_show_ever">
            Don't ask again
          </label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Not Now</button>
      <button type="button" class="btn btn-primary" id="install-pwa-btn">Install</button>
    </div>
  `;

  document.getElementById('install-pwa-btn').addEventListener('click', () => {
   if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
     if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      showToast('App installation started!', { type: 'success' });
     } else {
      console.log('User dismissed the install prompt');
     }
     deferredPrompt = null;
    });
   }
   modalInstance.hide();
  });

  // Handle dismissal options
  const dontShowWeekCheckbox = document.getElementById(`${modalId}_dont_show_week`);
  const dontShowEverCheckbox = document.getElementById(`${modalId}_dont_show_ever`);

  dontShowWeekCheckbox.addEventListener('change', (e) => {
   if (e.target.checked) {
    setInstallPromptDismissed();
    dontShowEverCheckbox.checked = false;
   }
  });

  dontShowEverCheckbox.addEventListener('change', (e) => {
   if (e.target.checked) {
    setInstallDontAskAgain();
    dontShowWeekCheckbox.checked = false;
   }
  });

  // Handle modal close
  modalInstance._element.addEventListener('hidden.bs.modal', () => {
   // If neither option was selected, set temporary dismissal
   if (dontShowWeekCheckbox.checked) {
    setInstallPromptDismissed();
   }
   if (dontShowEverCheckbox.checked) {
    setInstallDontAskAgain();
   }
  });

  modalInstance.show();
 }

 function createNotificationPermissionButton() {
  // Check if we should show the button based on 7-day rule
  if (!shouldShowNotificationPrompt()) {
   return;
  }

  const currentPermission = getNotificationPermissionStatus();

  // MODIFIED: Show button for both 'default' AND 'denied' permissions
  if (currentPermission === 'default' || currentPermission === 'denied') {
   // Create draggable notification prompt button
   const btnContainer = document.createElement('div');
   btnContainer.className = 'd-flex align-items-center shadow';
   btnContainer.style.position = 'fixed';
   btnContainer.style.bottom = '20px';
   btnContainer.style.right = '20px';
   btnContainer.style.zIndex = '10000'; // Higher z-index
   btnContainer.style.backgroundColor = 'white';
   btnContainer.style.padding = '8px 12px';
   btnContainer.style.borderRadius = '20px';
   btnContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
   btnContainer.style.cursor = 'grab';
   btnContainer.style.userSelect = 'none';
   btnContainer.style.touchAction = 'none'; // Important for mobile
   btnContainer.id = 'notification-permission-btn-container';

   // Make it draggable - ensure makeDraggable function is available
   if (typeof makeDraggable === 'function') {
    makeDraggable(btnContainer);
   } else {
    console.error('makeDraggable function not found');
   }

   // MODIFIED: Different button text and style based on permission status
   const permissionBtn = document.createElement('button');
   permissionBtn.className = currentPermission === 'denied' ? 'btn btn-outline-danger btn-sm' : 'btn btn-outline-primary btn-sm';
   permissionBtn.innerHTML = currentPermission === 'denied'
    ? '<i class="fas fa-bell-slash me-1"></i> Notifications Blocked'
    : '<i class="fas fa-bell me-1"></i> Enable Notifications';
   permissionBtn.style.fontSize = '12px';
   permissionBtn.style.marginRight = '8px';
   permissionBtn.style.cursor = 'pointer';
   permissionBtn.style.pointerEvents = 'auto'; // Ensure button is clickable

   // Close button
   const closeBtn = document.createElement('button');
   closeBtn.className = 'btn-close btn-close-sm';
   closeBtn.style.fontSize = '10px';
   closeBtn.title = 'Dismiss for 7 days';
   closeBtn.style.pointerEvents = 'auto'; // Ensure close button is clickable

   btnContainer.appendChild(permissionBtn);
   btnContainer.appendChild(closeBtn);

   permissionBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent drag event interference
    console.log('Notification permission button clicked, current permission:', currentPermission);

    if (currentPermission === 'denied') {
     // For denied permission, show the browser permission guide
     showBrowserPermissionGuide();
    } else {
     // For default permission, ask directly
     askNotificationPermission().then(result => {
      console.log('Notification permission result:', result);
      if (result === 'granted') {
       btnContainer.remove();
      }
     });
    }
   });

   closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent drag event interference
    console.log('Close button clicked - setting 7-day dismissal');
    setNotificationPromptDismissed();
    btnContainer.remove();
   });

   document.body.appendChild(btnContainer);

   // Auto-remove after 30 seconds
   setTimeout(() => {
    if (document.body.contains(btnContainer)) {
     btnContainer.remove();
    }
   }, 30000);
  }
 }

 function shouldShowNotificationPrompt() {
  const dismissedUntil = localStorage.getItem(`${my1uzr.worknOnPg}_notification_dismissed_until`);

  if (dismissedUntil) {
   const now = new Date().getTime();
   if (now < parseInt(dismissedUntil)) {
    console.log('Notification prompt dismissed until:', new Date(parseInt(dismissedUntil)));
    return false; // Still within dismissal period
   } else {
    // Period expired, clear the setting
    localStorage.removeItem(`${my1uzr.worknOnPg}_notification_dismissed_until`);
   }
  }

  // Also check the "don't ask again" permanent setting
  const dontAskPermanent = localStorage.getItem(`${my1uzr.worknOnPg}_dont_ask_notifications`);
  if (dontAskPermanent === 'true') {
   console.log('Permanent "don\'t ask again" is set');
   return false;
  }

  return true;
 }

 function setNotificationPromptDismissed() {
  const twoDaysFromNow = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);
  localStorage.setItem(`${my1uzr.worknOnPg}_notification_dismissed_until`, twoDaysFromNow.toString());
  console.log('Notification prompt dismissed for 2 days');
 }

 function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
   const swUrl = 'https://my1.in/my1sw.js';
   const scope = `${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1)}`;

   // Show loader when service worker is being registered
   const loader = createDynamicLoader('Wait Restarting', 5);
   let registrationCompleted = false;
   let loaderTimeout = null;

   // Set timeout to update message if registration takes longer than 5 seconds
   loaderTimeout = setTimeout(() => {
    if (!registrationCompleted) {
     loader.updateCountdown(0);
     const messageElement = loader.querySelector('div:last-child');
     if (messageElement) {
      messageElement.textContent = 'Still working, please wait...';
     }
    }
   }, 5000);

   navigator.serviceWorker.register(swUrl, { scope })
    .then(registration => {
     console.log('ServiceWorker registration successful with scope:', registration.scope);
     registrationCompleted = true;

     if (loaderTimeout) {
      clearTimeout(loaderTimeout);
     }

     // Check if this is a new service worker installation
     const isNewInstall = !localStorage.getItem(SW_STATE_KEY);
     if (isNewInstall) {
      localStorage.setItem(SW_STATE_KEY, 'installed');
     }

     // Listen for controller change (happens after refresh)
     navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Controller changed - service worker updated');
      // Auto-refresh when new service worker takes control
      window.location.reload();
     });

     // If there's no controller, we need to wait for activation
     if (!navigator.serviceWorker.controller) {
      return new Promise(resolve => {
       if (registration.installing) {
        registration.installing.addEventListener('statechange', () => {
         if (registration.installing && registration.installing.state === 'activated') {
          console.log('Service worker activated');
          resolve(registration);
         }
        });
       } else if (registration.waiting) {
        registration.waiting.addEventListener('statechange', () => {
         if (registration.waiting && registration.waiting.state === 'activated') {
          console.log('Service worker activated from waiting');
          resolve(registration);
         }
        });
       } else {
        resolve(registration);
       }
      });
     }
     return registration;
    })
    .then(registration => {
     // Service worker is ready
     console.log('Service worker ready, removing loader and continuing...');

     // Remove loader and proceed with initialization
     setTimeout(() => {
      loader.removeLoader();

      checkCacheVersion();

      // Call checkAndSubscribe when service worker is ready (regardless of permission)
      if ('serviceWorker' in navigator) {
       navigator.serviceWorker.ready.then((registration) => {
        console.log('Service worker ready, calling checkAndSubscribe');
        checkAndSubscribe(registration);
       });
      }

      // FIXED: For installed PWA, show floating button instead of toast
      const currentPermission = getNotificationPermissionStatus();
      const isPWAInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

      if (isPWAInstalled) {
       // For installed PWA, show floating button if permission is not granted
       if (currentPermission !== 'granted') {
        console.log('PWA installed but notifications not granted, showing floating button');
        setTimeout(() => {
         createNotificationPermissionButton();
        }, 2000);
       } else {
        console.log('PWA installed and notifications granted');
       }
      } else {
       // For non-installed site, use existing logic
       if (chkWhetherNotiAllowed(0)) {
        console.log('notification granted:');
       } else {
        showToast("Enable notifications for better experience", { type: 'info', duration: 2000 });
       }
      }

      // Auto-refresh if this is a new service worker installation
      if (!navigator.serviceWorker.controller) {
       console.log('New service worker installed, refreshing page...');
       setTimeout(() => {
        window.location.reload();
       }, 1000);
      }
     }, 1000);
    })
    .catch(error => {
     console.error('ServiceWorker registration failed:', error);
     registrationCompleted = true;

     if (loaderTimeout) {
      clearTimeout(loaderTimeout);
     }

     // Update loader to show error
     const messageElement = loader.querySelector('div:last-child');
     if (messageElement) {
      messageElement.textContent = 'Service worker registration failed';
      messageElement.style.color = '#ff6b6b';
     }

     // Remove loader after 3 seconds
     setTimeout(() => {
      loader.removeLoader();
     }, 3000);
    });
  }
 }

 function checkCacheVersion() {
  if (!my1uzr.worknOnPg || cacheVersion === undefined) {
   console.error('Required variables not available for cache version check');
   return;
  }

  const cacheLocalVersion = localStorage.getItem(`${my1uzr.worknOnPg}_version`) || 0;

  if (cacheVersion > cacheLocalVersion) {
   if (cacheStrategy === 1) {
    sendCacheUpgradeMessage();
   } else {
    showToast('New data available. Please update the app.', { type: 'info' });
   }
  }
 }

 function sendCacheUpgradeMessage() {
  if (appData != null && appData.shoCachInProgressModal) {
   if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    if (appData.cach) {
     navigator.serviceWorker.controller.postMessage({
      type: 'upgrade',
      cacheStrategy: cacheStrategy,
      cshPathNm: my1uzr.worknOnPg,
      cacheUrls: appData.cach || []
     });

     // Only show progress modal if there are URLs to cache
     if (appData.shoCachInProgressModal === 1 && appData.cach && appData.cach.length > 0) {
      // Listen for the initial response to see if everything is already cached
      const listener = (event) => {
       if (event.data.type === 'cacheComplete' && event.data.allAlreadyCached) {
        navigator.serviceWorker.removeEventListener('message', listener);
        // Don't show the modal since everything is cached
       } else if (event.data.type === 'progress') {
        navigator.serviceWorker.removeEventListener('message', listener);
        f_n_sho_progress_modal(appData.cach.length);
       }
      };

      navigator.serviceWorker.addEventListener('message', listener);
     }
    } else {
     showToast("Cache list not found.", { type: 'warning' });
    }
   }
  } else {
   console.log('"appData.shoCachInProgressModal" is not defined.');
  }
 }

 function f_n_sho_progress_modal(totalFiles, maxTries = 3) {
  const modalId = n_ame_of_progress_modal;
  if (document.getElementById(modalId)) return;

  const { contentElement, modalInstance } = create_modal_dynamically(modalId);

  contentElement.innerHTML = `
    <div class="modal-header">
      <h5 class="modal-title">${appData.ttlCachInProgressModal || 'Caching Required Files'}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="text-center mb-3">
        <div class="spinner-border text-primary mb-2" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p id="${modalId}_text" class="mb-3">Total files to cache: ${totalFiles}</p>
      </div>
      
      <div class="progress mb-3" style="height: 20px;">
        <div id="${modalId}_fill" class="progress-bar progress-bar-striped progress-bar-animated" 
             role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
        </div>
      </div>
      
      <div class="cache-details">
        <h6 class="mb-2">Cache Progress:</h6>
        <div id="${modalId}_details" class="border rounded p-2" style="max-height: 200px; overflow-y: auto; background-color: #f8f9fa;">
          <!-- Progress details will be added here -->
        </div>
      </div>
    </div>
    <div class="modal-footer" id="${modalId}_buttons" style="display: none;">
      <button type="button" class="btn btn-success" style="display: none;">OK</button>
      <button type="button" class="btn btn-warning" style="display: none;">Try Again</button>
    </div>
  `;

  // Get references to elements
  const progressText = document.getElementById(`${modalId}_text`);
  const progressFill = document.getElementById(`${modalId}_fill`);
  const progressDetails = document.getElementById(`${modalId}_details`);
  const buttonsContainer = document.getElementById(`${modalId}_buttons`);
  const okButton = buttonsContainer.querySelector('.btn-success');
  const tryAgainButton = buttonsContainer.querySelector('.btn-warning');

  // Set up button event listeners
  okButton.addEventListener('click', () => modalInstance.hide());
  tryAgainButton.addEventListener('click', () => {
   tryAgainButton.style.display = 'none';
   sendCacheUpgradeMessage();
  });

  // Listen for progress updates
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
   const messageHandler = (event) => {
    if (event.data.type === 'progress') {
     updateProgressModal(event.data, maxTries);
    } else if (event.data.type === 'cacheComplete') {
     if (!event.data.allAlreadyCached)
      showCompletion(event.data);
     navigator.serviceWorker.removeEventListener('message', messageHandler);
    } else if (event.data.type === 'playSound') {
     playNotificationSound(event.data.url);
    }
   };

   navigator.serviceWorker.addEventListener('message', messageHandler);
  }

  function updateProgressModal(data, maxTries) {
   if (progressText && progressFill && progressDetails) {
    const percent = Math.round((data.current / data.total) * 100);
    progressText.textContent = `Caching files: ${data.current}/${data.total} (${percent}%)`;
    progressFill.style.width = `${percent}%`;
    progressFill.setAttribute('aria-valuenow', percent);
    progressFill.textContent = `${percent}%`;

    // Add progress details
    const existingEntry = document.querySelector(`[data-url="${data.url}"]`);
    const urlProgress = existingEntry || document.createElement('div');

    if (!existingEntry) {
     urlProgress.dataset.url = data.url;
     urlProgress.className = `url-progress alert ${data.success ? 'alert-success' : data.attempt < maxTries ? 'alert-warning' : 'alert-danger'} py-1 px-2 mb-1 small`;
     progressDetails.appendChild(urlProgress);
    }

    let statusIcon = data.success ? '✅' :
     data.attempt < maxTries ? '🔄' : '❌';
    let statusText = data.success ? 'Cached successfully' :
     data.attempt < maxTries ? `Attempt ${data.attempt}/${maxTries}` :
      `Failed after ${maxTries} attempts${data.error ? ': ' + data.error : ''}`;

    urlProgress.innerHTML = `<strong>${data.url}:</strong> ${statusIcon} ${statusText}`;

    // Auto-scroll to the latest entry
    urlProgress.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
   }
  }

  function showCompletion(data) {
   if (buttonsContainer) {
    buttonsContainer.style.display = 'block';
    if (data.success) {
     okButton.style.display = 'inline-block';
     tryAgainButton.style.display = 'none';
     progressText.innerHTML = `<span class="text-success">✅ All ${data.successfulCount} files cached successfully!</span>`;
     progressFill.className = 'progress-bar bg-success';
    } else {
     okButton.style.display = 'inline-block';
     tryAgainButton.style.display = 'inline-block';
     progressText.innerHTML = `<span class="text-warning">⚠️ ${data.successfulCount}/${data.totalCount} files cached successfully.</span>`;
     progressFill.className = 'progress-bar bg-warning';
    }
   }
  }

  modalInstance.show();
 }

 // Notification Permission Handling Functions - FIXED VERSION
 function askNotificationPermission() {
  return new Promise((resolve) => {
   if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    resolve('unsupported');
    return;
   }

   const currentPermission = Notification.permission;
   console.log('Current notification permission:', currentPermission);

   if (currentPermission === "granted") {
    console.log("Notification permission already granted");
    resolve('granted');
    return;
   }

   if (currentPermission === "denied") {
    console.log("Notification permission previously denied");
    showBrowserPermissionGuide();
    resolve('denied');
    return;
   }

   // Permission is 'default' - ask the user directly
   console.log('Requesting notification permission...');
   Notification.requestPermission().then(permission => {
    console.log('Notification permission result:', permission);

    if (permission === "granted") {
     showToast('Notifications enabled successfully!', { type: 'success', duration: 3000 });
     console.log("Notification permission granted");

     // Initialize messaging after permission granted
     if (typeof firebase !== 'undefined' && firebase.messaging) {
      initFirebaseMessaging();
     }

     resolve('granted');
    } else {
     showToast('Notifications not enabled', { type: 'info', duration: 3000 });
     resolve('denied');
    }
   }).catch(error => {
    console.error("Error requesting notification permission:", error);
    showToast('Error enabling notifications', { type: 'error', duration: 3000 });
    resolve('denied');
   });
  });
 }

 // Direct permission request for installed PWAs
 function askNotificationPermissionDirect() {
  return new Promise((resolve) => {
   if (!("Notification" in window)) {
    resolve('unsupported');
    return;
   }

   Notification.requestPermission().then(permission => {
    resolve(permission);
   });
  });
 }

 function showBrowserPermissionGuide() {
  const { contentElement, modalInstance } = create_modal_dynamically('browser-permission-guide');

  contentElement.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Enable Notifications in Browser</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Notifications are currently blocked by your browser.
            </div>
            <p>To enable notifications:</p>
            <ol>
                <li>Click the lock icon (🔒) in your browser's address bar</li>
                <li>Find "Notifications" in the site settings</li>
                <li>Change the setting to "Allow"</li>
                <li>Refresh this page</li>
            </ol>
            <p class="text-muted small">
                <i class="fas fa-lightbulb"></i>
                Notifications work best when the app is installed.
            </p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Later</button>
            <button type="button" class="btn btn-primary" id="refresh-after-enable">Refresh Page</button>
        </div>
    `;

  document.getElementById('refresh-after-enable').addEventListener('click', () => {
   window.location.reload();
  });

  modalInstance.show();
 }

 function chkWhetherNotiAllowed(showAlert = 0) {
  if (!("Notification" in window)) {
   if (showAlert === 1) {
    showToast('This browser does not support notifications', { type: 'error' });
   }
   return false;
  }

  if (Notification.permission === "granted") {
   return true;
  }

  if (Notification.permission === "denied") {
   if (showAlert === 1) {
    const dontAskKey = `${my1uzr.worknOnPg}_dont_ask_notifications`;
    const dontAsk = localStorage.getItem(dontAskKey);

    if (dontAsk !== 'true') {
     showBrowserPermissionGuide();
    }
   }
   return false;
  }

  return false;
 }

 function getNotificationPermissionStatus() {
  if (!("Notification" in window)) {
   return 'unsupported';
  }
  return Notification.permission;
 }

 function showNotificationStatus() {
  const status = getNotificationPermissionStatus();
  const statusMessages = {
   'granted': { message: 'Notifications are enabled', type: 'success' },
   'denied': { message: 'Notifications are blocked', type: 'warning' },
   'default': { message: 'Notification permission not decided', type: 'info' },
   'unsupported': { message: 'Browser does not support notifications', type: 'warning' }
  };

  const statusInfo = statusMessages[status] || { message: 'Unknown status', type: 'info' };
  showToast(statusInfo.message, { type: statusInfo.type });

  return status;
 }

 function initFirebaseMessaging() {
  // Check if messaging is already initialized, if not, initialize it
  if (!messaging && typeof firebase !== 'undefined' && firebase.messaging) {
   messaging = firebase.messaging();
   console.log('Firebase messaging initialized in initFirebaseMessaging');
  }

  if (messaging) {
   messaging.onMessage((payload) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
     navigator.serviceWorker.controller.postMessage({
      type: 'foregroundMessage',
      payload: payload
     });
    }
   });

   // Always try to subscribe when Firebase messaging is initialized
   // The checkAndSubscribe function will handle permission checks internally
   if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
     console.log('Firebase messaging initialized, calling checkAndSubscribe');
     checkAndSubscribe(registration);
    });
   }
  } else {
   console.error('Firebase messaging not available');
  }
 }

 function checkAndSubscribe(registration) {
  // First, check notification permission
  const currentPermission = getNotificationPermissionStatus();
  console.log('Current notification permission:', currentPermission);

  if (currentPermission !== 'granted') {
   console.log('Notification permission not granted, skipping FCM token generation & registration');
   if (currentPermission === 'denied') {
    showToast("Notifications are blocked. Enable them for app functionality.", { type: 'error' });
   }
   return;
  }
  if (!messaging) {
   console.log('Messaging not available');
   return;
  }
  messaging.getToken({
   vapidKey: 'BPBypkaldaC5YUIKvT39jV6GQteK_0erL9OeW7cygdR_vRYT5aXgxpfR1JcMkYFISYdgYEPcQDNHM4vwP9ln_Cc',
   serviceWorkerRegistration: registration
  }).then((token) => {
   if (payload0 && payload0.mk && payload0.mk.length > 10) {
    const c68nst = localStorage.getItem('my1uzr_fc_tk');
    if (c68nst !== token) {
     payload0.vw = 0;
     payload0.fn = 24;
     payload0.x1 = token;

     fetch("https://my1.in/2/9.php", {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload0)
     })
      .then(response => response.json())
      .then(r67esponse => {
       if (r67esponse && r67esponse.su === 1) {
        localStorage.setItem('my1uzr_fc_tk', token);
        let objTk = { "old": c68nst, "nw": token }
        if (typeof handleFCMtokenChange === 'function') { handleFCMtokenChange(objTk); }
       } else if (appData != null && appData.shoAlertIfFCMSubscribeTopicFails === 1) {
        showToast(JSON.stringify(r67esponse), { type: 'error' });
       }
      })
      .catch(error => {
       console.error('Error subscribing to FCM:', error);
       showToast('Error subscribing to notifications', { type: 'error' });
      });
    }
   }
  }).catch((err) => {
   console.error("Failed to get token:", err);
   showToast('Failed to setup notifications', { type: 'error' });
  });
 }

 // Initialize PWA functionality
 async function init() {
  try {
   registerServiceWorker();
   initPWA();
   // Don't auto-init Firebase messaging - wait for user permission
  } catch (error) {
   console.error('PWA initialization failed:', error);
   showToast(`Initialization error: ${error.message}`, { type: 'error' });
  }
 }

 // Call the initialization
 init();
}
