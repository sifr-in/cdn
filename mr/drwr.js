// Global variables to track drawer state
let currentDrawer = null;
let drawerInstance = null;

function showDrawer(menuItems = [], title = 'Menu', position = 'left') {
 // Check if drawer already exists
 const existingDrawer = document.getElementById('mobileDrawer');
 const existingBackdrop = document.getElementById('drawerBackdrop');

 // If drawer exists, just show it
 if (existingDrawer && drawerInstance) {
  // Update profile data if needed
  updateProfileData(existingDrawer);

  // Open drawer
  drawerInstance.open();
  return drawerInstance;
 }

 // Get profile data from window object
 const defaultUrl = 'https://cdn-icons-png.freepik.com/512/13470/13470397.png?ga=GA1.1.943033089.1762783218';
 const profileImageUrl = (() => {
  try {
   const u = myEinMR?.u;
   if (!u) return defaultUrl;
   const parsed = typeof u === 'string' ? JSON.parse(u) : u;
   return parsed?.b || defaultUrl;
  } catch { return defaultUrl; }
 })();
 const userName = myEinMR?.m || 'Guest User';
 const mobileNumber = myEinMR?.l || 'Not provided';

 // Create drawer backdrop
 const backdrop = document.createElement('div');
 backdrop.id = 'drawerBackdrop';
 backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1040;
        opacity: 0;
        transition: opacity 0.3s ease;
        display: none;
    `;

 // Create drawer container
 const drawer = document.createElement('div');
 drawer.id = 'mobileDrawer';
 drawer.style.cssText = `
        position: fixed;
        top: 0;
        ${position === 'left' ? 'left: -100%;' : 'right: -100%;'}
        width: 85%;
        max-width: 320px;
        height: 100%;
        background: linear-gradient(135deg, var(--white-color) 0%, #FCE4EC 100%);
        z-index: 1041;
        overflow-y: auto;
        transition: ${position === 'left' ? 'left' : 'right'} 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 4px 0 25px rgba(216, 27, 96, 0.15);
        display: flex;
        flex-direction: column;
        display: none;
    `;

 // Create drawer header with gradient
 const drawerHeader = document.createElement('div');
 drawerHeader.style.cssText = `
        padding: 25px 20px 20px;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
        color: var(--text-on-primary);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    `;

 // Create header content with profile
 const headerContent = document.createElement('div');
 headerContent.style.cssText = `
        display: flex;
        align-items: flex-start;
        position: relative;
    `;

 // Create profile image container
 const profileImageContainer = document.createElement('div');
 profileImageContainer.style.cssText = `
        position: relative;
        margin-right: 15px;
        flex-shrink: 0;
    `;

 // Create profile image
 const profileImage = document.createElement('img');
 profileImage.id = 'drawerProfileImage';
 profileImage.style.cssText = `
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.3);
        object-fit: cover;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, var(--accent-light), var(--accent-dark));
    `;
 profileImage.src = profileImageUrl;
 profileImage.alt = 'Profile Picture';

 // Add loading error handler
 profileImage.onerror = function () {
  this.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=D81B60&color=fff&size=100';
  this.style.background = 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))';
 };

 // Create profile info container
 const profileInfo = document.createElement('div');
 profileInfo.style.cssText = `
        flex: 1;
        min-width: 0;
    `;

 // Create user name element
 const userNameElement = document.createElement('div');
 userNameElement.id = 'drawerUserName';
 userNameElement.style.cssText = `
        font-weight: 600;
        font-size: 1.2rem;
        margin-bottom: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-on-primary);
    `;
 userNameElement.textContent = userName;

 // Create mobile number element
 const mobileElement = document.createElement('div');
 mobileElement.id = 'drawerMobileNumber';
 mobileElement.style.cssText = `
        font-size: 0.9rem;
        opacity: 0.9;
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--text-on-primary);
    `;
 mobileElement.innerHTML = `
        <i class="fas fa-phone fa-xs"></i>
        <span id="drawerMobileText" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${mobileNumber}</span>
    `;

 // Create close button
 const closeButton = document.createElement('button');
 closeButton.innerHTML = '<i class="fas fa-times"></i>';
 closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.2) !important;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        color: var(--text-on-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0 !important;
        z-index: 2;
    `;

 // Hover effect for close button
 closeButton.addEventListener('mouseenter', () => {
  closeButton.style.background = 'rgba(255, 255, 255, 0.3) !important';
  closeButton.style.transform = 'scale(1.1)';
 });

 closeButton.addEventListener('mouseleave', () => {
  closeButton.style.background = 'rgba(255, 255, 255, 0.2) !important';
  closeButton.style.transform = 'scale(1)';
 });

 // Create menu container
 const menuContainer = document.createElement('div');
 menuContainer.id = 'drawerMenuContainer';
 menuContainer.style.cssText = `
        flex: 1;
        padding: 20px 0;
        overflow-y: auto;
    `;

 // Create drawer footer
 const drawerFooter = document.createElement('div');
 drawerFooter.style.cssText = `
        padding: 15px 20px;
        border-top: 1px solid var(--border-color);
        background: var(--card-bg-color);
    `;

 const footerText = document.createElement('div');
 footerText.style.cssText = `
        font-size: 0.8rem;
        color: var(--text-secondary);
        text-align: center;
    `;
 footerText.textContent = 'Powered by sifr';

 // Build header
 profileImageContainer.appendChild(profileImage);
 profileInfo.appendChild(userNameElement);
 profileInfo.appendChild(mobileElement);
 headerContent.appendChild(profileImageContainer);
 headerContent.appendChild(profileInfo);
 drawerHeader.appendChild(headerContent);
 drawerHeader.appendChild(closeButton);

 // Define the exact menu sequence with icons (all icons in grey color, removed Profile Privacy)
 const defaultMenuItems = [
  {
   title: 'Profile Settings',
   icon: 'fas fa-user-cog',
   color: '#6c757d', // Grey color
   onClick: () => {
    let recordId = 0;//$(this).data('record-id');

    showProfileDtls(recordId)
    // (async () => { 
    //     await loadExe2Fn(14, [recordId], [1]);
    // })();
   }
  },
  {
   title: 'Gallery Photos',
   icon: 'fas fa-images',
   color: '#6c757d', // Grey color
   onClick: () => {
    showGalInModal(myEinMR.b6);
   }
  },
  /*{
      title: 'Shortlisted Profiles',
      icon: 'fas fa-heart',
      color: '#6c757d', // Grey color
      onClick: () => console.log('Shortlisted Profiles clicked')
  },
  {
      title: 'Viewed Contacts',
      icon: 'fas fa-eye',
      color: '#6c757d', // Grey color
      onClick: () => console.log('Viewed Contacts clicked')
  },
  {
      title: 'My Active Plan',
      icon: 'fas fa-crown',
      color: '#6c757d', // Grey color
      onClick: () => console.log('My Active Plan clicked')
  },
  {
      title: 'Membership Plans',
      icon: 'fas fa-gem',
      color: '#6c757d', // Grey color
      onClick: () => {
          (async () => { 
              await loadExe2Fn(17, [], [1]); 
          })();
      }
  },*/
  {
   title: 'Contact Us',
   icon: 'fas fa-headset',
   color: '#6c757d',
   onClick: () => {
    (async () => {
     await loadExe2Fn(21, [window[my1uzr.worknOnPg].appInfo], [1]);
    })();
   }
  },
  {
   title: 'About Us',
   icon: 'fas fa-info-circle',
   color: '#6c757d',
   onClick: () => {
    (async () => {
     await loadExe2Fn(20, [window[my1uzr.worknOnPg].appInfo], [1]);
    })();
   }
  },
  {
   title: 'Privacy Policy',
   icon: 'fas fa-lock',
   color: '#6c757d',
   onClick: () => {
    (async () => {
     await loadExe2Fn(22, [window[my1uzr.worknOnPg].appInfo], [1]);
    })();
   }
  },
  {
   title: 'Terms And Condition',
   icon: 'fas fa-file-contract',
   color: '#6c757d',
   onClick: () => {
    (async () => {
     await loadExe2Fn(23, [window[my1uzr.worknOnPg].appInfo], [1]);
    })();
   }
  },
  {
   title: 'Child Safety Policy',
   icon: 'fas fa-child',
   color: '#6c757d',
   onClick: () => {
    (async () => {
     await loadExe2Fn(24, [window[my1uzr.worknOnPg].appInfo], [1]);
    })();
   }
  },
  {
   title: 'Share App',
   icon: 'fas fa-share-alt',
   color: '#6c757d', // Grey color
   onClick: () => {
    console.log('Share App clicked');
    shareApp();
   }
  }
 ];

 // Use provided menu items or default ones
 const itemsToShow = menuItems.length > 0 ? menuItems : defaultMenuItems;

 // Build menu items
 itemsToShow.forEach((item) => {
  const menuItem = createMenuItem(item);
  menuContainer.appendChild(menuItem);
 });

 // Helper function to create menu items
 function createMenuItem(item) {
  const menuItem = document.createElement('div');
  menuItem.className = 'drawer-menu-item';
  menuItem.style.cssText = `
            display: flex;
            align-items: center;
            padding: 15px 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 1px solid var(--border-color);
            background: transparent;
        `;

  menuItem.innerHTML = `
            <div style="margin-right: 15px; color: ${item.color || '#6c757d'};">
                <i class="${item.icon || 'fas fa-circle'} fa-fw"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 500; color: var(--text-primary);">${item.title}</div>
                ${item.subtitle ? `<div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">${item.subtitle}</div>` : ''}
            </div>
            ${item.badge ? `<span style="background: ${item.badgeColor || 'var(--accent-color)'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">${item.badge}</span>` : ''}
            <i class="fas fa-chevron-right" style="margin-left: 10px; color: var(--text-secondary); font-size: 0.9rem;"></i>
        `;

  // Add click handler
  menuItem.addEventListener('click', () => {
   if (item.onClick) {
    item.onClick();
   }
   if (item.href) {
    window.location.href = item.href;
   }
   if (item.closeOnClick !== false) {
    closeDrawer();
   }
  });

  // Hover effect
  menuItem.addEventListener('mouseenter', () => {
   menuItem.style.background = 'rgba(216, 27, 96, 0.08)';
   menuItem.style.transform = 'translateX(4px)';
  });

  menuItem.addEventListener('mouseleave', () => {
   menuItem.style.background = 'transparent';
   menuItem.style.transform = 'translateX(0)';
  });

  return menuItem;
 }

 // Build footer
 drawerFooter.appendChild(footerText);

 // Assemble drawer
 drawer.appendChild(drawerHeader);
 drawer.appendChild(menuContainer);
 drawer.appendChild(drawerFooter);

 // Add to document
 document.body.appendChild(backdrop);
 document.body.appendChild(drawer);

 // Function to close drawer
 function closeDrawer() {
  drawer.style[position === 'left' ? 'left' : 'right'] = position === 'left' ? '-100%' : '-100%';
  backdrop.style.opacity = '0';

  setTimeout(() => {
   backdrop.style.display = 'none';
   drawer.style.display = 'none';
  }, 300);
 }

 // Function to open drawer
 function openDrawer() {
  // Update profile data before showing
  updateProfileData(drawer);

  backdrop.style.display = 'block';
  drawer.style.display = 'flex';

  setTimeout(() => {
   drawer.style[position === 'left' ? 'left' : 'right'] = '0';
   backdrop.style.opacity = '1';
  }, 10);
 }

 // Function to update profile data in drawer
 function updateProfileData(drawerElement) {
  const profileImage = drawerElement.querySelector('#drawerProfileImage');
  const userNameElement = drawerElement.querySelector('#drawerUserName');
  const mobileText = drawerElement.querySelector('#drawerMobileText');

  if (profileImage) {
   const currentImageUrl = window[my1uzr.worknOnPg]?.t46mp;
   if (currentImageUrl && profileImage.src !== currentImageUrl) {
    profileImage.src = currentImageUrl;
   }
  }

  if (userNameElement) {
   const currentName = window[my1uzr.worknOnPg]?.t47mp || 'Guest User';
   userNameElement.textContent = currentName;
  }

  if (mobileText) {
   const currentMobile = window[my1uzr.worknOnPg]?.t48mp || 'Not provided';
   mobileText.textContent = currentMobile;
  }
 }

 // Add close functionality
 closeButton.addEventListener('click', closeDrawer);
 backdrop.addEventListener('click', closeDrawer);

 // Add keyboard support
 drawer.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
   closeDrawer();
  }
 });

 // Add touch swipe to close (for mobile)
 let touchStartX = 0;
 let touchStartY = 0;

 drawer.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
 });

 drawer.addEventListener('touchmove', (e) => {
  if (!touchStartX) return;

  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  const diffX = touchX - touchStartX;
  const diffY = touchY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
   if (position === 'left' && diffX < -50) {
    closeDrawer();
   } else if (position === 'right' && diffX > 50) {
    closeDrawer();
   }
  }
 });

 // Store drawer instance globally
 drawerInstance = {
  close: closeDrawer,
  open: openDrawer,
  drawerElement: drawer,
  backdropElement: backdrop,
  updateProfile: function (newData) {
   const profileImage = drawer.querySelector('#drawerProfileImage');
   const userNameElement = drawer.querySelector('#drawerUserName');
   const mobileText = drawer.querySelector('#drawerMobileText');

   if (newData.imageUrl && profileImage) {
    profileImage.src = newData.imageUrl;
   }
   if (newData.name && userNameElement) {
    userNameElement.textContent = newData.name;
   }
   if (newData.mobile && mobileText) {
    mobileText.textContent = newData.mobile;
   }
  },
  // Method to completely remove drawer
  destroy: function () {
   if (document.body.contains(drawer)) {
    drawer.remove();
   }
   if (document.body.contains(backdrop)) {
    backdrop.remove();
   }
   drawerInstance = null;
  }
 };

 // Open drawer initially
 openDrawer();

 return drawerInstance;
}

// Helper function to close drawer (can be called globally)
function closeDrawer() {
 if (drawerInstance) {
  drawerInstance.close();
 }
}

// Helper function to toggle drawer
function toggleDrawer(menuItems = [], title = 'Menu', position = 'left') {
 const existingDrawer = document.getElementById('mobileDrawer');

 if (existingDrawer && drawerInstance) {
  // Check if drawer is currently visible
  const isVisible = existingDrawer.style.display !== 'none' &&
   existingDrawer.style[position === 'left' ? 'left' : 'right'] !== (position === 'left' ? '-100%' : '-100%');

  if (isVisible) {
   drawerInstance.close();
  } else {
   drawerInstance.open();
  }
 } else {
  // Create new drawer
  showDrawer(menuItems, title, position);
 }
}

function shareApp() {
 if (typeof Android !== 'undefined' && Android && typeof Android.shareApp === 'function') {
  Android.shareApp();
 } else if (navigator.share) {
  navigator.share({
   title: 'My App',
   text: 'Check out this amazing app!',
   url: window.location.href
  }).catch(() => fallbackShare());
 } else {
  fallbackShare();
 }
}

function fallbackShare() {
 prompt('Copy this link:', url);
}

// Updated toggle button function with profile
function createDrawerToggleButton(menuItems = [], title = 'Menu', position = 'left') {
 const toggleButton = document.createElement('button');

 // Try to use profile image as button icon if available
 const profileImageUrl = window[my1uzr.worknOnPg]?.t46mp;

 if (profileImageUrl) {
  toggleButton.style.cssText = `
            background: none !important;
            border: 2px solid var(--white-color) !important;
            border-radius: 50% !important;
            width: 44px !important;
            height: 44px !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(216, 27, 96, 0.3) !important;
            padding: 0 !important;
            margin: 5px !important;
            overflow: hidden !important;
        `;

  toggleButton.innerHTML = `
            <img src="${profileImageUrl}" 
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
                 alt="Profile"
                 onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-user\\' style=\\'color: white; font-size: 1.2rem;\\'></i>';">
        `;
 } else {
  toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
  toggleButton.style.cssText = `
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;
            border: none !important;
            border-radius: 50% !important;
            width: 44px !important;
            height: 44px !important;
            color: var(--text-on-primary) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(216, 27, 96, 0.3) !important;
            padding: 0 !important;
            margin: 5px !important;
        `;
 }

 toggleButton.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleDrawer(menuItems, title, position);
 });

 return toggleButton;
}
function showGalInModal(galString) {
 // Parse the gallery string
 let imagesArray = [];
 try {
  if (typeof galString === 'string') {
   imagesArray = JSON.parse(galString);
  } else if (Array.isArray(galString)) {
   imagesArray = galString;
  } else {
   imagesArray = [];
  }
 } catch (e) {
  console.error('Error parsing gallery string:', e);
  imagesArray = [];
 }

 // Create unique modal ID
 const modalId = 'gallery_modal_' + Date.now();

 // Create modal dynamically
 const modalObj = create_modal_dynamically(modalId);
 const modalInstance = modalObj.modalInstance;
 const modalElement = modalObj.modalElement;
 const modalBody = modalObj.contentElement;

 // Add custom class for styling
 modalElement.classList.add('gallery-view-modal');

 // Set modal size to large
 const modalDialog = modalElement.querySelector('.modal-dialog');
 modalDialog.classList.add('modal-lg');

 // Create modal content
 const modalContent = modalElement.querySelector('.modal-content');
 modalContent.innerHTML = '';

 // Create header
 const header = document.createElement('div');
 header.className = 'modal-header';
 header.style.cssText = 'background: linear-gradient(135deg, #7B1FA2, #4A148C); color: white; border-bottom: none; border-radius: 10px 10px 0 0;';
 header.innerHTML = `
  <h5 class="modal-title" style="color: white;">
   <i class="fas fa-images me-2"></i>Gallery
  </h5>
  <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
 `;

 // Create body
 const body = document.createElement('div');
 body.className = 'modal-body';
 body.style.cssText = 'padding: 1.5rem; background: linear-gradient(135deg, #FAFAFA, #F3E5F5);';

 // Create container for gallery
 const galleryContainer = document.createElement('div');
 galleryContainer.id = 'gallery_container_' + modalId;

 body.appendChild(galleryContainer);

 // Create footer
 const footer = document.createElement('div');
 footer.className = 'modal-footer';
 footer.style.cssText = 'border-top: none; justify-content: center;';
 footer.innerHTML = `
  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="border-radius: 50px; padding: 8px 24px;">
   <i class="fas fa-times me-2"></i>Close
  </button>
 `;

 modalContent.appendChild(header);
 modalContent.appendChild(body);
 modalContent.appendChild(footer);

 // Show modal first
 modalInstance.show();

 // After modal is shown, render the gallery
 setTimeout(() => {
  // Create a temporary fullObject for setGalleryImages (read-only mode, no add button)
  const fullObject = {
   canAdd: 0  // No add button for view-only gallery
  };

  // Call setGalleryImages to render the gallery
  setGalleryImages(
   null,                    // inputId (not needed for view-only)
   JSON.stringify(imagesArray),  // value
   galleryContainer.id,     // divId
   null,                    // key
   fullObject               // fullObject
  );
 }, 100);

 // Clean up modal when hidden
 modalElement.addEventListener('hidden.bs.modal', function onHide() {
  modalElement.removeEventListener('hidden.bs.modal', onHide);
  setTimeout(() => {
   if (modalElement && modalElement.parentNode) {
    modalElement.parentNode.removeChild(modalElement);
   }
  }, 300);
 });
}