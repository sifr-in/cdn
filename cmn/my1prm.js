function showGivePermissionsModal() {
  // Create modal container
  const modal = document.createElement('div');
  modal.id = 'myCustomModal';
  modal.style.color = 'black';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = '#ff8787';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#fff';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.width = '80%';
  modalContent.style.maxHeight = '85vh';
  modalContent.style.overflow = 'hidden'; // Changed to hidden to contain the scrolling table

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '24px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = function() {
    document.body.removeChild(modal);
  };

  // Create title
  const title = document.createElement('h2');
  title.textContent = 'Functions List';
  title.style.marginTop = '0';
  title.style.color = '#333';

  const tableOuterContainer = document.createElement('div');
  tableOuterContainer.style.width = '100%';
  tableOuterContainer.style.height = 'calc(80vh - 100px)';
  tableOuterContainer.style.overflow = 'auto';
  tableOuterContainer.style.marginTop = '15px';
  tableOuterContainer.style.position = 'relative';

  // Create table container with fixed header
  const tableContainer = document.createElement('div');
  tableContainer.style.width = '100%';
  tableContainer.style.overflowX = 'auto';
  tableContainer.style.marginTop = '0';

  // Create table
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.minWidth = '600px';
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '0';

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.style.backgroundColor = '#f2f2f2';
  headerRow.style.position = 'sticky';
  headerRow.style.top = '0';
  headerRow.style.zIndex = '10';
  
  const headers = ['Expiry', 'Description', 'Actions'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.style.padding = '10px';
    th.style.textAlign = 'left';
    th.style.borderBottom = '1px solid #ddd';
    th.style.backgroundColor = '#f2f2f2'; // Ensure background color is set for sticky header
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  
  my1uzr.ffp.forEach(item => {

    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid #ddd';
    
    // Expiry column with progress indicator
    const expiryCell = document.createElement('td');
    expiryCell.style.padding = '10px';
    expiryCell.style.position = 'relative';
    
    // Display the date
    const dateText = document.createElement('div');
    dateText.textContent = item.j;
    expiryCell.appendChild(dateText);
    
    // Calculate days remaining
    const expiryDate = new Date(item.j);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const timeDiff = expiryDate.getTime() - today.getTime();
    let daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Cap the days remaining for display purposes (365 days max for the indicator)
    const displayDays = Math.min(daysRemaining, 365);
    const daysPercentage = Math.min(displayDays / 365, 1); // Cap at 1 (100%)
    
    // Create gradient line container
    const lineContainer = document.createElement('div');
    lineContainer.style.width = '100%';
    lineContainer.style.height = '4px';
    lineContainer.style.background = 'linear-gradient(to right, red, yellow, green)';
    lineContainer.style.borderRadius = '2px';
    lineContainer.style.marginTop = '5px';
    lineContainer.style.position = 'relative';
    
    // Create indicator dot
    const indicatorDot = document.createElement('div');
    indicatorDot.style.position = 'absolute';
    indicatorDot.style.left = `${daysPercentage * 100}%`;
    indicatorDot.style.top = '50%';
    indicatorDot.style.transform = 'translateY(-50%) translateX(-50%)';
    indicatorDot.style.width = '8px';
    indicatorDot.style.height = '8px';
    indicatorDot.style.borderRadius = '50%';
    indicatorDot.style.backgroundColor = 'black';
    indicatorDot.style.border = '1px solid white';
    indicatorDot.style.boxShadow = '0 0 2px rgba(0,0,0,0.3)';
    
    lineContainer.appendChild(indicatorDot);
    expiryCell.appendChild(lineContainer);
    
    // Add tooltip with days remaining
    let tooltipText = `${daysRemaining} days remaining`;
    if (daysRemaining > 365) {
      tooltipText += ` (display capped at 365 days)`;
    }
    lineContainer.title = tooltipText;
    
    row.appendChild(expiryCell);
    
    // Description column
    const nmCell = document.createElement('td');
    nmCell.innerHTML = item.fn + "<br>a:"+item.a+"; g:"+item.g+"; h:"+item.h+"; i:"+item.i+"; k:"+item.k+"; l:"+item.l;
    nmCell.style.padding = '10px';
    row.appendChild(nmCell);
    
    // Action column
    const actionCell = document.createElement('td');
    actionCell.style.padding = '10px';
    
    const actionButton = document.createElement('button');
    actionButton.textContent = 'gv perm';
    actionButton.style.padding = '5px 10px';
    actionButton.style.backgroundColor = '#006d04';
    actionButton.style.color = 'white';
    actionButton.style.border = 'none';
    actionButton.style.borderRadius = '4px';
    actionButton.style.cursor = 'pointer';
    actionButton.onclick = function() {
      shoMonoModalForPrm(item);
    };
    
    actionCell.appendChild(actionButton);
    row.appendChild(actionCell);
    
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);
  tableOuterContainer.appendChild(tableContainer);
  
  // Assemble modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(tableOuterContainer);
  
  modal.appendChild(modalContent);

  // Add modal to body
  document.body.appendChild(modal);

  // Close modal when clicking outside content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

async function managPrmOfGvnNo(mo, mc=1, vwNo, fnNo, dtt, setDTTtoNOW, i202tem){
payload0.vw = 0;
payload0.fn = 46;
payload0.x0 = mo;
payload0.x1 = mc;
payload0.x2 = vwNo;
payload0.x3 = fnNo;
payload0.x4 = dtt;
payload0.x5 = setDTTtoNOW;

try {
 const response = await fnj3(
  "https://my1.in/2/c.php",
  payload0,
  1,
  true,
  "loader",
  20000,
  0,
  2,
  1
 );

 if (response) {
  if (response.su) {

my1uzr = JSON.parse(localStorage.getItem('my1uzr'));
my1uzr.fnf = response.fnf;
my1uzr.ffp = response.ffp;
localStorage.setItem('my1uzr', JSON.stringify(my1uzr));

if(i202tem){
 shoMonoModalForPrm(i202tem);
}

  } else {
   alert(response.ms);
  }
 }
} catch (error) {
 if (error.message.includes("timed out")) {
  alert("Error: timed out - " + error.message);
 } else {
  alert("Error: " + error.message);
 }
}
}
function shoMonoModalForPrm(item) {
  // Find existing permissions for this function
  const existingPermissions = my1uzr.fnf.filter(fnfItem => 
    fnfItem.l == item.cid && fnfItem.g == item.g && fnfItem.h == item.h
  );

  const expiredPermissions = existingPermissions.filter(fnfItem => {
    if (fnfItem.j === "0000-00-00 00:00:00" || !fnfItem.j) {
      return true;
    }
    try {
      const permissionDate = new Date(fnfItem.j);
      if (isNaN(permissionDate.getTime())) {
        return true;
      }
      return permissionDate < new Date();
    } catch (e) {
      return true;
    }
  });
  
  const permsUsedCnt = (existingPermissions.length - expiredPermissions.length);
  
  // Calculate available slots
  const availableSlots = item.k - permsUsedCnt;
  
  // Create modal container
  const modal = document.createElement('div');
  modal.id = 'mobileNumberModal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1001';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#fff';
  modalContent.style.color = '#000';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.width = '90%';
  modalContent.style.maxWidth = '800px';
  modalContent.style.maxHeight = '90vh';
  modalContent.style.overflow = 'auto';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '24px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = function() {
    document.body.removeChild(modal);
  };

  // Create title
  const title = document.createElement('h3');
  title.textContent = `Permissions for:`;
  title.style.marginTop = '0';
  title.style.color = '#333';

  // Create info section
  const infoContainer = document.createElement('div');
  infoContainer.style.marginBottom = '15px';
  infoContainer.style.padding = '10px';
  infoContainer.style.borderRadius = '4px';
  
  // Get the item's expiry date for validation
  const itemExpiryDate = new Date(item.j);
  const now = new Date();
  const isExpired = itemExpiryDate < now;
  
  if (isExpired) {
    infoContainer.style.backgroundColor = '#ff8787'; // Red for expired
  } else {
    infoContainer.style.backgroundColor = '#f5f5f5'; // Default gray
  }

  const viewNoLabel = document.createElement('div');
  viewNoLabel.innerHTML = `Xpi: ${item.j}<br>${item.fn}`;
  viewNoLabel.style.marginBottom = '5px';

  const slotsLabel = document.createElement('div');
  slotsLabel.textContent = `Vw: ${item.g} / Fu: ${item.h} / tot: ${item.k} / used: ${permsUsedCnt}`;
  slotsLabel.style.fontWeight = 'bold';

  infoContainer.appendChild(viewNoLabel);
  infoContainer.appendChild(slotsLabel);

  // Create permissions table
  const tableContainer = document.createElement('div');
  tableContainer.style.margin = '15px 0';
  
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  
  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.style.backgroundColor = '#f2f2f2';
  
  const headers = ['Mobile Number', 'Permission Until', 'Actions'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.style.padding = '10px';
    th.style.textAlign = 'left';
    th.style.borderBottom = '1px solid #ddd';
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  
  // Add existing permissions
  existingPermissions.forEach(permission => {
    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid #ddd';
    
    // Mobile number cell
    const mobileCell = document.createElement('td');
    mobileCell.textContent = permission.e;
    mobileCell.style.padding = '10px';
    row.appendChild(mobileCell);
    
    // Expiry date cell
    const expiryCell = document.createElement('td');
    expiryCell.style.padding = '10px';
    
    const dateInput = document.createElement('input');
    dateInput.type = 'datetime-local';
    dateInput.style.width = '100%';
    dateInput.style.padding = '8px';
    dateInput.style.border = '1px solid #ddd';
    dateInput.style.borderRadius = '4px';
    
    // Set max date to item.j (expiry date)
    const maxDateString = convertToDateTimeWithT(itemExpiryDate);
    dateInput.max = maxDateString;
    
    // Set current permission date
    if (permission.j && permission.j !== "0000-00-00 00:00:00") {
      try {
        const permissionDate = new Date(permission.j);
        if (!isNaN(permissionDate.getTime())) {
          const permissionDateString = convertToDateTimeWithT(permissionDate);
          dateInput.value = permissionDateString;
        }
      } catch (e) {
        // Handle date parsing error
      }
    }
    
    expiryCell.appendChild(dateInput);
    row.appendChild(expiryCell);
    
    // Actions cell
    const actionCell = document.createElement('td');
    actionCell.style.padding = '10px';
    
    // Add update button for existing permissions
    const updateButton = document.createElement('button');
    updateButton.textContent = 'update';
    updateButton.style.padding = '5px 10px';
    updateButton.style.backgroundColor = '#4c9572';
    updateButton.style.color = 'white';
    updateButton.style.border = 'none';
    updateButton.style.borderRadius = '4px';
    updateButton.style.cursor = 'pointer';
    updateButton.style.marginRight = '5px';
    updateButton.onclick = async function() {
      const selectedDateTime = dateInput.value;
      
      if (!selectedDateTime) {
        alert('Please select a date and time');
        dateInput.focus();
        return;
      }
      
      const selectedDate = new Date(selectedDateTime);
      const now = new Date();
      
      // Validate that selected date is not greater than item's expiry date
      if (selectedDate > itemExpiryDate) {
        alert(`date-time cannot be more than your own expiry, date-time: ${item.j}`);
        return;
      }
      
      // Check if the selected date is in the past
      if (selectedDate <= now) {
        const confirmStop = confirm('The selected date is in the past. Do you want to stop the permissions for this number?');
        if (!confirmStop) {
          return;
        }
        // Set mode to 2 (stop permission) if date is in the past
        await managPrmOfGvnNo(permission.e, 1, item.g, item.h, selectedDateTime, 1, item);
      } else {
        // Set mode to 3 (update permission) if date is in the future
        await managPrmOfGvnNo(permission.e, 1, item.g, item.h, selectedDateTime, 0, item);
      }
      
      // Refresh the modal to show the updated permission
    //   document.body.removeChild(modal);
    //   shoMonoModalForPrm(item);
    };
    
    actionCell.appendChild(updateButton);
    row.appendChild(actionCell);
    
    tbody.appendChild(row);
  });
  
  // Add input rows for available slots
  for (let i = 0; i < availableSlots; i++) {
    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid #ddd';
    
    // Mobile number input cell
    const mobileCell = document.createElement('td');
    mobileCell.style.padding = '10px';
    
    const mobileInput = document.createElement('input');
    mobileInput.type = 'tel';
    mobileInput.placeholder = 'Enter 10-digit mobile number';
    mobileInput.style.width = '100%';
    mobileInput.style.padding = '8px';
    mobileInput.style.border = '1px solid #ddd';
    mobileInput.style.borderRadius = '4px';
    mobileInput.maxLength = 10;
    
    // Only allow numbers in mobile input
    mobileInput.addEventListener('input', function(e) {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    mobileCell.appendChild(mobileInput);
    row.appendChild(mobileCell);
    
    // Date input cell
    const dateCell = document.createElement('td');
    dateCell.style.padding = '10px';
    
    const dateInput = document.createElement('input');
    dateInput.type = 'datetime-local';
    dateInput.style.width = '100%';
    dateInput.style.padding = '8px';
    dateInput.style.border = '1px solid #ddd';
    dateInput.style.borderRadius = '4px';
    
    // Set max date to item.j (expiry date)
    const maxDateString = convertToDateTimeWithT(itemExpiryDate);
    dateInput.max = maxDateString;
    
    // Set default to current date/time
    dateInput.value = convertToDateTimeWithT(new Date());
    
    dateCell.appendChild(dateInput);
    row.appendChild(dateCell);
    
    // Action cell
    const actionCell = document.createElement('td');
    actionCell.style.padding = '10px';
    
    const addButton = document.createElement('button');
    addButton.textContent = 'giv perm';
    addButton.style.padding = '5px 10px';
    addButton.style.backgroundColor = '#5cb85c';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '4px';
    addButton.style.cursor = 'pointer';
    
    // Function to check if inputs are valid
    function checkInputsValidity() {
      const mobileValue = mobileInput.value.trim();
      const dateValue = dateInput.value;
      const selectedDate = new Date(dateValue);
      const now = new Date();
      
      // Check if selected date is not greater than item's expiry date
      const isDateValid = selectedDate > now && selectedDate <= itemExpiryDate;
      const isMobileValid = /^\d{10}$/.test(mobileValue);
      
      const isValid = isMobileValid && isDateValid;
      
      addButton.disabled = !isValid;
      addButton.style.backgroundColor = isValid ? '#5cb85c' : '#cccccc';
      addButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }
    
    // Initial check
    checkInputsValidity();
    
    // Add event listeners
    mobileInput.addEventListener('input', checkInputsValidity);
    dateInput.addEventListener('change', checkInputsValidity);
    dateInput.addEventListener('input', checkInputsValidity);
    
    addButton.onclick = async function() {
      const mobileNumber = mobileInput.value.trim();
      const selectedDateTime = dateInput.value;
      
      // Validate inputs (should already be valid from checkInputsValidity)
      if (!/^\d{10}$/.test(mobileNumber)) {
        alert('Please enter a valid 10-digit mobile number');
        mobileInput.focus();
        return;
      }
      
      if (!selectedDateTime) {
        alert('Please select a date and time');
        dateInput.focus();
        return;
      }
      
      const selectedDate = new Date(selectedDateTime);
      const now = new Date();
      
      if (selectedDate <= now) {
        alert('Please select a future date and time');
        return;
      }
      
      // Validate that selected date is not greater than item's expiry date
      if (selectedDate > itemExpiryDate) {
        alert(`date-time cannot be more than your own expiry, date-time: ${item.j}`);
        return;
      }
      
      // Call the function with all parameters (mode 1 for new permission)
      await managPrmOfGvnNo(mobileNumber, 1, item.g, item.h, selectedDateTime, 0, item);
      
      // Refresh the modal to show the new permission
      document.body.removeChild(modal);
      shoMonoModalForPrm(item);
    };
    
    actionCell.appendChild(addButton);
    row.appendChild(actionCell);
    
    tbody.appendChild(row);
  }
  
  table.appendChild(tbody);
  tableContainer.appendChild(table);
  
  // Add message if no available slots
  if (availableSlots <= 0) {
    const noSlotsMessage = document.createElement('div');
    noSlotsMessage.textContent = 'All permission slots are already used.';
    noSlotsMessage.style.padding = '10px';
    noSlotsMessage.style.textAlign = 'center';
    noSlotsMessage.style.fontStyle = 'italic';
    tableContainer.appendChild(noSlotsMessage);
  }

  // Assemble modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(infoContainer);
  modalContent.appendChild(tableContainer);

  modal.appendChild(modalContent);

  // Add modal to body
  document.body.appendChild(modal);

  // Close modal when clicking outside content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}
window.showGivePermissionsModal = showGivePermissionsModal;