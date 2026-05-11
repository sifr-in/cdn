function showNotifications() {
 // Create modal dynamically
 const modalInfo = create_modal_dynamically('notificationsModal');
 const modalContent = modalInfo.contentElement;
 const modalInstance = modalInfo.modalInstance;

 // Set modal title
 const modalTitle = document.createElement('h5');
 modalTitle.className = 'modal-title fw-bold text-primary mb-3';
 modalTitle.textContent = 'Notifications';
 modalTitle.id = 'notificationsModalLabel';

 // Create header section
 const headerSection = document.createElement('div');
 headerSection.className = 'd-flex justify-content-between align-items-center mb-3';

 // Add close button in header
 const closeBtn = document.createElement('button');
 closeBtn.type = 'button';
 closeBtn.className = 'btn-close';
 closeBtn.innerHTML = 'x';
 closeBtn.setAttribute('data-bs-dismiss', 'modal');
 closeBtn.setAttribute('aria-label', 'Close');

 headerSection.appendChild(modalTitle);
 headerSection.appendChild(closeBtn);

 // Clear modal content and add header
 modalContent.innerHTML = '';
 modalContent.appendChild(headerSection);

 // Create notifications container
 const notificationsContainer = document.createElement('div');
 notificationsContainer.className = 'notifications-container';

 // Check if profiles array exists
 if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
  const noNotifications = document.createElement('div');
  noNotifications.className = 'text-center py-5';
  noNotifications.innerHTML = `
            <div class="mb-3">
                <i class="fas fa-bell-slash fa-3x text-muted"></i>
            </div>
            <h5 class="text-muted">No notifications</h5>
            <p class="text-muted">You don't have any notifications yet</p>
        `;
  notificationsContainer.appendChild(noNotifications);
 } else {
  // Create notification cards
  profiles.forEach(profile => {
   if (!profile || typeof profile !== 'object') return;

   const notificationCard = document.createElement('div');
   notificationCard.className = 'notification-card mb-3 p-3 border rounded shadow-sm bg-white';

   // Create row for notification content
   const cardRow = document.createElement('div');
   cardRow.className = 'row g-3 align-items-center';

   // Left column: Profile thumbnail
   const leftCol = document.createElement('div');
   leftCol.className = 'col-auto';

   const profileImg = document.createElement('img');
   profileImg.className = 'rounded-circle';
   profileImg.style.width = '50px';
   profileImg.style.height = '50px';
   profileImg.style.objectFit = 'cover';
   profileImg.alt = profile.m || 'Profile';

   // Set image source with fallback
   profileImg.src = profile.ut || profile.u || 'https://via.placeholder.com/50';

   // Add error handling for image
   profileImg.onerror = function () {
    this.src = 'https://via.placeholder.com/50';
    this.alt = 'Image not available';
   };

   leftCol.appendChild(profileImg);

   // Right column: Notification details
   const rightCol = document.createElement('div');
   rightCol.className = 'col';

   // Name with suffix
   const nameElement = document.createElement('div');
   nameElement.className = 'fw-semibold text-dark mb-1';
   nameElement.textContent = (profile.m || 'Unknown') + ' viewed your profile';

   // Time element
   const timeElement = document.createElement('div');
   timeElement.className = 'text-muted small';

   if (profile.g) {
    try {
     const notificationDate = new Date(profile.g);
     const now = new Date();
     const diffMs = now - notificationDate;
     const diffMins = Math.floor(diffMs / 60000);
     const diffHours = Math.floor(diffMs / 3600000);
     const diffDays = Math.floor(diffMs / 86400000);

     let timeText = '';
     if (diffMins < 1) {
      timeText = 'Just now';
     } else if (diffMins < 60) {
      timeText = `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
     } else if (diffHours < 24) {
      timeText = `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
     } else if (diffDays < 7) {
      timeText = `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
     } else {
      timeText = notificationDate.toLocaleDateString('en-IN', {
       day: 'numeric',
       month: 'short',
       year: 'numeric'
      });
     }

     timeElement.textContent = timeText;
    } catch (error) {
     timeElement.textContent = profile.g;
    }
   } else {
    timeElement.textContent = 'Recently';
   }

   rightCol.appendChild(nameElement);
   rightCol.appendChild(timeElement);

   // Add columns to row
   cardRow.appendChild(leftCol);
   cardRow.appendChild(rightCol);

   // Add row to card
   notificationCard.appendChild(cardRow);

   // Add click handler to open profile details if needed
   notificationCard.style.cursor = 'pointer';
   notificationCard.addEventListener('click', function () {
    // You can add functionality here to view full profile
    console.log('Clicked profile:', profile);
    // Optional: Show profile details in another modal or page
   });

   // Add hover effect
   notificationCard.addEventListener('mouseenter', function () {
    this.style.backgroundColor = '#f8f9fa';
    this.style.transform = 'translateY(-2px)';
    this.style.transition = 'all 0.2s ease';
   });

   notificationCard.addEventListener('mouseleave', function () {
    this.style.backgroundColor = '#ffffff';
    this.style.transform = 'translateY(0)';
   });

   notificationsContainer.appendChild(notificationCard);
  });
 }

 modalContent.appendChild(notificationsContainer);

 // Show the modal
 modalInstance.show();

 // Add modal to stack
 if (!modalStack.includes('notificationsModal')) {
  modalStack.push('notificationsModal');
  history.pushState({
   modalOpen: true,
   modalId: 'notificationsModal',
   modalStack: [...modalStack]
  }, '');
 }

 // Add event listener to remove from stack when modal closes
 const modalElement = document.getElementById('notificationsModal');
 if (modalElement) {
  modalElement.addEventListener('hidden.bs.modal', function () {
   removeModalFromStack('notificationsModal');
  });
 }

 return modalInstance;
}