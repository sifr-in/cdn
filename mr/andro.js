// andro.js - Android WebView Back Button Support

(function () {
 'use strict';

 console.log('andro.js: Initializing Android WebView back button support...');

 // Track if Android bridge is ready
 let androidBridgeReady = false;

 // Function to update Android about modal status
 function updateAndroidModalStatus() {
  if (!androidBridgeReady) return;

  if (typeof Android !== 'undefined' && Android.updateModalStatus) {
   try {
    const modalStatus = {
     modalsOpen: false,
     modalCount: 0,
     timestamp: Date.now()
    };

    // Try to get modalStack from global scope (from my1e3.js)
    if (typeof window.modalStack !== 'undefined') {
     modalStatus.modalsOpen = window.modalStack.length > 0;
     modalStatus.modalCount = window.modalStack.length;
     modalStatus.hasModalStack = true;
    } else {
     // Fallback: Check for visible modals in DOM
     const visibleModals = document.querySelectorAll('.modal.show, .modal[style*="display: block"], [role="dialog"][style*="display: block"]');
     modalStatus.modalsOpen = visibleModals.length > 0;
     modalStatus.modalCount = visibleModals.length;
     modalStatus.hasModalStack = false;
    }

    Android.updateModalStatus(JSON.stringify(modalStatus));
    console.log('andro.js: Updated Android modal status:', modalStatus);
   } catch (error) {
    console.error('andro.js: Error updating Android modal status:', error);
   }
  }
 }

 // Function to handle Android back button press
 function handleAndroidBackButton() {
  console.log('andro.js: Android back button pressed');

  // Priority 1: Use handleUniversalBackButton if available
  if (typeof window.handleUniversalBackButton === 'function') {
   console.log('andro.js: Using handleUniversalBackButton');
   const result = window.handleUniversalBackButton();
   updateAndroidModalStatus();
   return result;
  }

  // Priority 2: Check modalStack directly
  if (typeof window.modalStack !== 'undefined' && window.modalStack.length > 0) {
   console.log('andro.js: Using modalStack approach, count:', window.modalStack.length);
   return closeTopModal();
  }

  // Priority 3: Check DOM for visible modals
  const visibleModals = document.querySelectorAll('.modal.show, .modal[style*="display: block"]');
  if (visibleModals.length > 0) {
   console.log('andro.js: Found', visibleModals.length, 'visible modal(s) in DOM');
   return closeVisibleModal(visibleModals[visibleModals.length - 1]);
  }

  console.log('andro.js: No modals found to close');
  updateAndroidModalStatus();
  return false;
 }

 // Helper function to close top modal using modalStack
 function closeTopModal() {
  if (!window.modalStack || window.modalStack.length === 0) return false;

  const topModalId = window.modalStack[window.modalStack.length - 1];
  const modalElement = document.getElementById(topModalId);

  if (modalElement) {
   console.log('andro.js: Closing modal by ID:', topModalId);

   // Try Bootstrap modal API first
   if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    const bsModal = bootstrap.Modal.getInstance(modalElement);
    if (bsModal) {
     bsModal.hide();
     return true;
    }
   }

   // Manual close
   modalElement.style.display = 'none';
   modalElement.classList.remove('show');
   return true;
  } else {
   // Modal element not found, clean up stack
   window.modalStack.pop();
  }

  return false;
 }

 // Helper function to close visible modal
 function closeVisibleModal(modalElement) {
  if (!modalElement) return false;

  console.log('andro.js: Closing visible modal');

  // Try Bootstrap modal API
  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
   const bsModal = bootstrap.Modal.getInstance(modalElement);
   if (bsModal) {
    bsModal.hide();
    return true;
   }
  }

  // Manual close
  modalElement.style.display = 'none';
  modalElement.classList.remove('show');

  // Remove backdrop if exists
  const backdrops = document.querySelectorAll('.modal-backdrop');
  if (backdrops.length > 0) {
   backdrops[backdrops.length - 1].remove();
  }

  // Reset body styles
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  return true;
 }

 // Function to initialize Android bridge
 function initializeAndroidBridge() {
  // Check if Android bridge is available
  if (typeof Android === 'undefined') {
   console.log('andro.js: Android bridge not available (not in WebView)');
   return;
  }

  console.log('andro.js: Android bridge detected');
  androidBridgeReady = true;

  // Expose function for Android to call
  window.handleAndroidBackButton = handleAndroidBackButton;

  // Send initial status
  setTimeout(updateAndroidModalStatus, 500);

  // Hook into modal events if modalStack exists
  if (typeof window.modalStack !== 'undefined') {
   console.log('andro.js: Hooking into modalStack events');

   const originalPush = window.modalStack.push;
   const originalSplice = window.modalStack.splice;

   window.modalStack.push = function () {
    const result = originalPush.apply(this, arguments);
    updateAndroidModalStatus();
    return result;
   };

   window.modalStack.splice = function () {
    const result = originalSplice.apply(this, arguments);
    updateAndroidModalStatus();
    return result;
   };
  } else {
   // Use MutationObserver to watch for modal changes
   console.log('andro.js: Setting up MutationObserver for modal detection');

   const observer = new MutationObserver(function (mutations) {
    let shouldUpdate = false;

    mutations.forEach(function (mutation) {
     // Check for modal class/style changes
     if (mutation.type === 'attributes' &&
      (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
      const target = mutation.target;

      // Check if it's a modal
      if (target.classList &&
       (target.classList.contains('modal') || target.getAttribute('role') === 'dialog')) {
       shouldUpdate = true;
      }
     }

     // Check for added/removed nodes that are modals
     if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(function (node) {
       if (node.nodeType === 1 && // Element node
        (node.classList.contains('modal') || node.getAttribute('role') === 'dialog')) {
        shouldUpdate = true;
       }
      });

      mutation.removedNodes.forEach(function (node) {
       if (node.nodeType === 1 &&
        (node.classList.contains('modal') || node.getAttribute('role') === 'dialog')) {
        shouldUpdate = true;
       }
      });
     }
    });

    if (shouldUpdate) {
     updateAndroidModalStatus();
    }
   });

   // Start observing the document
   observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class', 'style'],
    childList: true,
    subtree: true
   });
  }

  // Override the universal back button handler to ensure Android gets updates
  if (typeof window.handleUniversalBackButton === 'function') {
   console.log('andro.js: Wrapping handleUniversalBackButton');

   const originalHandler = window.handleUniversalBackButton;
   window.handleUniversalBackButton = function () {
    const result = originalHandler();
    updateAndroidModalStatus();
    return result;
   };
  }

  console.log('andro.js: Android bridge initialized successfully');

  // Log test message to Android
  try {
   if (typeof Android.log === 'function') {
    Android.log('andro.js: Bridge initialized successfully');
   }
  } catch (e) {
   console.log('andro.js: Android.log not available');
  }
 }

 // Wait for DOM to be ready and all scripts loaded
 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
   console.log('andro.js: DOMContentLoaded fired');

   // Wait a bit more for other scripts (like my1e3.js)
   setTimeout(initializeAndroidBridge, 1500);
  });
 } else {
  // DOM already loaded
  console.log('andro.js: DOM already loaded');
  setTimeout(initializeAndroidBridge, 1500);
 }

 // Also try initialization after a longer delay as fallback
 setTimeout(initializeAndroidBridge, 5000);

 // Expose functions globally
 window.updateAndroidModalStatus = updateAndroidModalStatus;

 console.log('andro.js: Script loaded successfully');

})();