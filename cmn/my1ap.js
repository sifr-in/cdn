// Common PWA application script for my1.in
// Prerequisites:
// - getWorkPathNm() function available from my1e3.js
// - fechAppData() function available from my1e3.js

// Initialize Firebase
loadScript('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js', function() {
  loadScript('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js', function() {
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
const c_lass_of_modal = 'pwa_modal';
const c_lass_of_modal_content = 'pwa_modal_content';
const c_lass_of_modal_close = 'pwa_modal_close';
const c_lass_of_progress_bar = 'pwa_progress_bar';

function initPWA() {
  // Handle before install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired');
    e.preventDefault();
    deferredPrompt = e;
    if(appData != null && appData.shoInstallAppModal){
    if (appData.shoInstallAppModal === 1) {
        console.log('Showing install modal');
        f_n_sho_install_modal();
    }
    }else{
        console.log('"shoInstallAppModal" is not defined.');
    }
  });

  // Check if app is installed
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    if(chkWhetherNotiAllowed(0)){
      registerServiceWorker();  
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('notification permission granted.');
            registerServiceWorker();
        }
      });
    }else{
        registerServiceWorker();
    }
  });

  // Check if app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://')) {
    console.log('PWA is already installed');
    //checkCacheVersion();
    registerServiceWorker();
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const swUrl = 'https://my1.in/my1sw.js';
    const scope = `${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1)}`;

    // Track if we've shown the refresh message for this session
    let refreshMessageShown = false;

    navigator.serviceWorker.register(swUrl, { scope })
      .then(registration => {
        console.log('ServiceWorker registration successful with scope:', registration.scope);

        // Check if this is a new service worker installation
        const isNewInstall = !localStorage.getItem(SW_STATE_KEY);
        if (isNewInstall) {
          localStorage.setItem(SW_STATE_KEY, 'installed');
        }

        // Listen for controller change (happens after refresh)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshMessageShown && isNewInstall) {
            showRefreshMessage();
            refreshMessageShown = true;
          }
        });

        // If there's no controller, we need to wait for activation
        if (!navigator.serviceWorker.controller) {
          return new Promise(resolve => {
            if (registration.installing) {
              registration.installing.addEventListener('statechange', () => {
                if (registration.installing && registration.installing.state === 'activated') {
                  resolve(registration);
                }
              });
            } else if (registration.waiting) {
              registration.waiting.addEventListener('statechange', () => {
                if (registration.waiting && registration.waiting.state === 'activated') {
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
        checkCacheVersion();

        if (chkWhetherNotiAllowed(0)) {
          console.log('notification granted:');
          // checkAndSubscribe(registration);
        } else {
          showToast("app won't work properly if notification is blocked.");
        }

        // Show refresh message if needed (for first installs)
        if (!navigator.serviceWorker.controller && !refreshMessageShown) {
          showRefreshMessage();
          refreshMessageShown = true;
        }
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  }
}

function showRefreshMessage() {
  const messageId = 'pwa-refresh-message';
  
  // Don't show if already visible
  if (document.getElementById(messageId)) return;

  // Create message container
  const message = document.createElement('div');
  message.id = messageId;
  message.style.position = 'fixed';
  message.style.top = '111px';
  message.style.right = '20px';
  message.style.backgroundColor = '#4a6fa5';
  message.style.color = 'white';
  message.style.padding = '15px';
  message.style.borderRadius = '8px';
  message.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  message.style.zIndex = '99999';
  message.style.display = 'flex';
  message.style.alignItems = 'center';
  message.style.gap = '15px';
  message.style.maxWidth = '320px';
  message.style.animation = 'slideIn 0.3s ease-out';

  // Message text
  const text = document.createElement('span');
  text.textContent = 'App is ready! Refresh to enjoy the full experience.';
  text.style.flex = '1';

  // Refresh button
  const refreshBtn = document.createElement('button');
  refreshBtn.textContent = 'Refresh';
  refreshBtn.style.background = 'white';
  refreshBtn.style.color = '#4a6fa5';
  refreshBtn.style.border = 'none';
  refreshBtn.style.padding = '6px 12px';
  refreshBtn.style.borderRadius = '4px';
  refreshBtn.style.fontWeight = 'bold';
  refreshBtn.style.cursor = 'pointer';
  refreshBtn.addEventListener('click', () => window.location.reload());

  // Close button
  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '20px';
  closeBtn.addEventListener('click', () => {
    message.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => message.remove(), 300);
  });

  // Add elements to message
  message.appendChild(text);
  message.appendChild(refreshBtn);
  message.appendChild(closeBtn);

  // Add to DOM
  document.body.appendChild(message);

  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Auto-dismiss after 1 minute
  setTimeout(() => {
    if (document.getElementById(messageId)) {
      message.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => message.remove(), 300);
    }
  }, 60000);
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
      showToast('New data available. Please update the app.');
    }
  }
}

function sendCacheUpgradeMessage() {
if (appData != null && appData.shoCachInProgressModal){
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
if(appData.cach){
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
}else{
    showToast("cach list not found.");
}
  }
}else{
    console.log('"appData.shoCachInProgressModal" is not defined.');
}
}

// Modify the f_n_sho_progress_modal function
function f_n_sho_progress_modal(totalFiles, maxTries = 3) {
  const modalId = n_ame_of_progress_modal;
  if (document.getElementById(modalId)) return;

  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = c_lass_of_modal;
  modal.style.color = "black";
  
  const modalContent = document.createElement('div');
  modalContent.className = c_lass_of_modal_content;
  modalContent.style.height = '70%';
  
  const title = document.createElement('h3');
  title.textContent = appData.ttlCachInProgressModal || 'Required files are being ...';
  
  const progressText = document.createElement('p');
  progressText.id = `${modalId}_text`;
  progressText.textContent = `Total files to cache: ${totalFiles}`;
  
  const progressBar = document.createElement('div');
  progressBar.className = c_lass_of_progress_bar;
  const progressBarFill = document.createElement('div');
  progressBarFill.id = `${modalId}_fill`;
  progressBarFill.style.width = '0%';
  progressBar.appendChild(progressBarFill);
  
  // mns
  const contentDv = document.createElement('div');
  contentDv.style.height = '75%';
  contentDv.style.overflowY = 'auto';
  
  // Add progress details container
  const progressDetails = document.createElement('div');
  progressDetails.id = `${modalId}_details`;
  progressDetails.style.marginTop = '20px';
  contentDv.appendChild(progressDetails);
  
  // Add buttons container (initially hidden)
  const buttonsContainer = document.createElement('div');
  buttonsContainer.id = `${modalId}_buttons`;
  buttonsContainer.style.display = 'none';
  buttonsContainer.style.marginTop = '20px';
  buttonsContainer.style.textAlign = 'center';
  
  const okButton = document.createElement('button');
  okButton.textContent = 'OK';
  okButton.style.display = 'none';
  okButton.addEventListener('click', () => closeModal(modalId));
  
  const tryAgainButton = document.createElement('button');
  tryAgainButton.textContent = 'Try Again';
  tryAgainButton.style.backgroundColor = 'orange';
  tryAgainButton.style.color = 'black';
  tryAgainButton.style.display = 'none';
  tryAgainButton.addEventListener('click', () => {
    sendCacheUpgradeMessage();
    tryAgainButton.style.display = 'none';
  });
  
  buttonsContainer.appendChild(okButton);
  buttonsContainer.appendChild(tryAgainButton);
  
  modalContent.appendChild(title);
  modalContent.appendChild(progressText);
  modalContent.appendChild(progressBar);
  modalContent.appendChild(contentDv);
  modalContent.appendChild(buttonsContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Add isolated styles
  const style = document.createElement('style');
  style.textContent = `
    #${modalId} {
      display: flex;
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.7);
      opacity: 1;
      transition: opacity 0.3s;
      align-items: center;
      justify-content: center;
    }
    
    #${modalId} .${c_lass_of_modal_content} {
      background-color: #fff;
      margin: auto;
      padding: 20px;
      border-radius: 10px;
      width: 80%;
      max-width: 600px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      position: relative;
      animation: bounce 0.5s;
    }
    
    #${modalId} .${c_lass_of_progress_bar} {
      width: 100%;
      background-color: #e0e0e0;
      border-radius: 5px;
      margin: 10px 0;
      height: 20px;
    }
    
    #${modalId} .${c_lass_of_progress_bar} div {
      height: 100%;
      border-radius: 5px;
      background-color: #4CAF50;
      transition: width 0.3s;
    }
    
    #${modalId} button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      margin: 0 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      animation: pulse 2s infinite;
    }
    
    #${modalId} button:hover {
      background-color: #45a049;
      animation: none;
    }
    
    #${modalId} .url-progress {
      margin: 5px 0;
      padding: 5px;
      border-radius: 3px;
      background-color: #f5f5f5;
    }
    
    #${modalId} .url-progress.failed {
      background-color: #ffebee;
      color: #d32f2f;
    }
    
    #${modalId} .url-progress.success {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
      40% {transform: translateY(-20px);}
      60% {transform: translateY(-10px);}
    }
    
    @keyframes pulse {
      0% {transform: scale(1);}
      50% {transform: scale(1.05);}
      100% {transform: scale(1);}
    }
  `;
  modal.appendChild(style);
  
  // Listen for progress updates
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'progress') {
        updateProgressModal(event.data, maxTries);
      } else if (event.data.type === 'cacheComplete') {
        if (!event.data.allAlreadyCached)
            showCompletion(event.data);
      } else if (event.data.type === 'playSound') {
        playNotificationSound(event.data.url);
      }
    });
  }
}

function requestSoundPermission() {
  return new Promise((resolve) => {
    const testAudio = new Audio();
    testAudio.volume = 0;
    testAudio.play().then(() => {
      testAudio.pause();
      resolve(true);
    }).catch(() => {
      showToast('Please click anywhere to enable notification sounds');
      /*document.addEventListener('click', function handler() {
        resolve(true);
        document.removeEventListener('click', handler);
      }, { once: true });*/
    });
  });
}

async function playNotificationSound(soundUrl) {
  try {
    // First try to play without requesting permission
    const audio = new Audio(soundUrl);
    audio.volume = 1.0;
    
    // Try to play immediately
    await audio.play().catch(async (e) => {
      console.log('First play attempt failed, requesting permission...');
      
      // If first attempt fails, request permission
      const hasPermission = await requestSoundPermission();
      if (hasPermission) {
        // Create new audio element after permission
        const newAudio = new Audio(soundUrl);
        newAudio.volume = 1.0;
        await newAudio.play().catch(e => {
          console.error('Playback failed after permission:', e);
          showToast('Please click anywhere to enable sounds');
          
          // Fallback: Play after user interaction
        //   document.addEventListener('click', () => {
        //     const fallbackAudio = new Audio(soundUrl);
        //     fallbackAudio.volume = 1.0;
        //     fallbackAudio.play();
        //   }, { once: true });
        });
      }
    });
  } catch (error) {
    console.error('Sound error:', error);
    showToast('Could not play notification sound');
  }
}

function updateProgressModal(data, maxTries) {
  const modalId = n_ame_of_progress_modal;
  const progressText = document.getElementById(`${modalId}_text`);
  const progressFill = document.getElementById(`${modalId}_fill`);
  const progressDetails = document.getElementById(`${modalId}_details`);
  
  if (progressText && progressFill && progressDetails) {
    const percent = Math.round((data.current / data.total) * 100);
    progressText.textContent = `Caching files: ${data.current}/${data.total} (${percent}%)`;
    progressFill.style.width = `${percent}%`;
    
    // Add progress details
    const existingEntry = document.querySelector(`[data-url="${data.url}"]`);
    const urlProgress = existingEntry || document.createElement('div');
    
    if (!existingEntry) {
      urlProgress.dataset.url = data.url;
      urlProgress.className = `url-progress ${data.success ? 'success' : data.attempt < maxTries ? '' : 'failed'}`;
      progressDetails.appendChild(urlProgress);
    }
    
    let statusText = data.success ? '✅ Cached successfully' : 
                   data.attempt < maxTries ? `🔄 Attempt ${data.attempt}/${maxTries}` : 
                   `❌ Failed after ${maxTries} attempts${data.error ? ': ' + data.error : ''}`;
    
    urlProgress.innerHTML = `<strong>${data.url}:</strong> ${statusText}`;
    
    // Auto-scroll to the latest entry
    urlProgress.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function showCompletion(data) {
  const modalId = n_ame_of_progress_modal;
  const buttonsContainer = document.getElementById(`${modalId}_buttons`);
  const okButton = buttonsContainer.querySelector('button');
  const tryAgainButton = buttonsContainer.querySelectorAll('button')[1];
  const progressText = document.getElementById(`${modalId}_text`);
  
  if (buttonsContainer) {
    buttonsContainer.style.display = 'block';
    if (data.success) {
      okButton.style.display = 'inline-block';
      tryAgainButton.style.display = 'none';
      progressText.textContent = `✅ All ${data.successfulCount} files cached successfully!`;
    } else {
      okButton.style.display = 'inline-block';
      tryAgainButton.style.display = 'inline-block';
      progressText.textContent = `⚠️ ${data.successfulCount}/${data.totalCount} files cached successfully.`;
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
}

function createModalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .${c_lass_of_modal} {
      display: flex;
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.7);
      opacity: 1;
      transition: opacity 0.3s;
      align-items: center;
      justify-content: center;
    }
    
    .${c_lass_of_modal_content} {
      background-color: #fff;
      margin: auto;
      padding: 20px;
      border-radius: 10px;
      width: 80%;
      max-width: 400px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      position: relative;
      animation: bounce 0.5s;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
      40% {transform: translateY(-20px);}
      60% {transform: translateY(-10px);}
    }
    
    .${c_lass_of_modal_close} {
      color: #aaa;
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
    }
    
    .${c_lass_of_modal_close}:hover {
      color: #555;
    }
    
    .${c_lass_of_progress_bar} {
      width: 100%;
      background-color: #e0e0e0;
      border-radius: 5px;
      margin: 10px 0;
      height: 20px;
    }
    
    .${c_lass_of_progress_bar} div {
      height: 100%;
      border-radius: 5px;
      background-color: #4CAF50;
      transition: width 0.3s;
    }
    
    button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      margin: 10px 5px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    
    button:hover {
      background-color: #45a049;
    }
  `;
  document.head.appendChild(style);
}

function showToast(message) {
  const alertId = 'custom_alert';
  let alertBox = document.getElementById(alertId);
  
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.id = alertId;
    alertBox.style.position = 'fixed';
    alertBox.style.top = '50px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.backgroundColor = '#333';
    alertBox.style.color = '#fff';
    alertBox.style.padding = '15px';
    alertBox.style.borderRadius = '5px';
    alertBox.style.zIndex = '10000';
    alertBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    alertBox.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
    document.body.appendChild(alertBox);
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {opacity: 0; bottom: 0;}
        to {opacity: 1; bottom: 20px;}
      }
      @keyframes fadeOut {
        from {opacity: 1; bottom: 20px;}
        to {opacity: 0; bottom: 0;}
      }
    `;
    document.head.appendChild(style);
  }
  
  alertBox.textContent = message;
  setTimeout(() => {
    if (alertBox) alertBox.remove();
  }, 3000);
}

function chkWhetherNotiAllowed(showAlert) {
  if (Notification.permission !== 'granted') {
    if (showAlert === 1 && appData != null && appData.msgWhenNotiNotAllowed) {
      showToast(appData.msgWhenNotiNotAllowed);
    }
    return false;
  }
  return true;
}

function initFirebaseMessaging() {
  if (typeof firebase !== 'undefined' && firebase.messaging) {
    messaging = firebase.messaging();
    
    messaging.onMessage((payload) => {
      // Send the payload to the service worker for common handling
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'foregroundMessage',
          payload: payload
        });
      }
    });
    
    if (chkWhetherNotiAllowed(0)) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          checkAndSubscribe(registration);
        });
      }
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted' && 'serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            checkAndSubscribe(registration);
          });
        } else if (permission === 'denied') {
            showToast("app won't work properly. if notfication is blocked.");
        }
      });
    }
  }
}

function checkAndSubscribe(registration) {
  if (!messaging) return;
  
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
            let objTk = {"old":c68nst, "nw":token}
            if (typeof handleFCMtokenChange === 'function') {handleFCMtokenChange(objTk);}
          } else if (appData != null && appData.shoAlertIfFCMSubscribeTopicFails === 1) {
            showToast(JSON.stringify(r67esponse));
          }
        })
        .catch(error => {
          console.error('Error subscribing to FCM:', error);
        });
      }
    }
  }).catch((err) => {
    console.error("Failed to get token:", err);
  });
}

  // Initialize PWA functionality
  async function init() {
    try {
      //await requestSoundPermission();
      registerServiceWorker();
      initPWA();
      initFirebaseMessaging();
      createModalStyles();
    } catch (error) {
      console.error('PWA initialization failed:', error);
      showToast(`Initialization error: ${error.message}`);
    }
  }

window.f_n_sho_install_modal = function(showBoxForcefully=0){
  if(showBoxForcefully===0){
  const dontShowAgain = localStorage.getItem(`${my1uzr.worknOnPg}dont_show_install`);
  if (dontShowAgain === 'true' && appData != null && appData.shoDontShoInstallPWAAgain !== 0) {
    return;
  }
  }
  
  const modalId = n_ame_of_install_modal;
  if (document.getElementById(modalId)) return;
  
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = c_lass_of_modal;
  
  const modalContent = document.createElement('div');
  modalContent.className = c_lass_of_modal_content;
  
  const title = document.createElement('h3');
  title.textContent = (appData && appData.msgToShoOnTtlInstallApp) || 'Install this app for better experience';
  title.style.color = "black";
  
  const installBtn = document.createElement('button');
  installBtn.textContent = 'Install';
  installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        deferredPrompt = null;
      });
    }
    closeModal(modalId);
  });
  
  const notNowBtn = document.createElement('button');
  notNowBtn.textContent = 'Not Now';
  notNowBtn.style.backgroundColor = 'orange';
  notNowBtn.style.color = 'black';
  notNowBtn.addEventListener('click', () => {
    if (dontShowCheckbox.checked) {
      localStorage.setItem(`${my1uzr.worknOnPg}dont_show_install`, 'true');
    }
    closeModal(modalId);
  });
  
  let dontShowCheckbox;
    const dontShowContainer = document.createElement('div');
    dontShowCheckbox = document.createElement('input');
    dontShowCheckbox.type = 'checkbox';
    dontShowCheckbox.id = `${modalId}_dont_show`;
    
    const label = document.createElement('label');
    label.htmlFor = `${modalId}_dont_show`;
    label.textContent = 'Don\'t show this again';
    label.style.color = "black";
    
    dontShowContainer.appendChild(dontShowCheckbox);
    dontShowContainer.appendChild(label);
    modalContent.appendChild(dontShowContainer);
  
  if (appData != null && appData.shoChkBoxDontPromptToInstlPWAAgain !== 1) {
      dontShowCheckbox.style.display = 'none';
  }
  
  modalContent.appendChild(title);
  modalContent.appendChild(installBtn);
  modalContent.appendChild(notNowBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

  // Call the initialization
  init();
}
