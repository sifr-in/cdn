// myModal.js
function showMyControls() {
  // Create modal container
  const modal = document.createElement('div');
  modal.id = 'myCustomModal';
  modal.style.color = 'black';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
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
  modalContent.style.maxWidth = '800px';
  modalContent.style.maxHeight = '80vh';
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


// Create a new container for buttons above the table
const buttonsContainer = document.createElement('div');
buttonsContainer.style.marginBottom = '15px';
buttonsContainer.style.display = 'flex';
buttonsContainer.style.flexWrap = 'wrap';
buttonsContainer.style.gap = '10px';

// Create buttons for items where vn.length > 0
my1uzr.fnf.forEach(item => {
const idVw = id_of_view || 1;
if (my1uzr.mo.toString() === item.e.toString() && my1uzr.mc.toString() === item.f.toString() && item.va === idVw && item.vn && item.vn.length > 0) {
  const button = document.createElement('button');
  button.textContent = item.vn;
  button.style.padding = '8px 12px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  
  button.onclick = async function() {
    try {
      // Parse the JSON string from item.ve
      const veData = JSON.parse(item.ve);
      
      // Extract function name, parameters, and file URL
      const functionName = veData.f;
      const parameters = JSON.parse(veData.p.replace(/'/g, '"')); // Convert single quotes to double quotes for valid JSON
      const fileUrl = "https://"+veData.l;
      
      // Call the function similar to your test2 example
      await loadAndExeFn(functionName, parameters, 'loader', fileUrl);
    } catch (error) {
      console.error('Error executing function:', error);
      alert('Error executing function: ' + error.message);
    }
  };
  
  buttonsContainer.appendChild(button);
}
});

// Only add the buttons container if there are buttons to show
if (buttonsContainer.children.length > 0) {
modalContent.appendChild(buttonsContainer);
}

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
  
  my1uzr.fnf.forEach(item => {
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
    
    const t150mp = document.createElement('div');
    t150mp.textContent = "g:"+item.g+" h:"+item.h+" i:"+item.i+" k:"+item.k+" l:"+item.l;
    expiryCell.appendChild(t150mp);
    
    row.appendChild(expiryCell);
    
    // Description column
    const nmCell = document.createElement('td');
    nmCell.textContent = item.fn;
    nmCell.style.padding = '10px';
    row.appendChild(nmCell);
    
    // Action column
    const actionCell = document.createElement('td');
    actionCell.style.padding = '10px';
    
    const actionButton = document.createElement('button');
    actionButton.textContent = 'give perm';
    actionButton.style.padding = '5px 10px';
    actionButton.style.backgroundColor = '#4CAF50';
    actionButton.style.color = 'white';
    actionButton.style.border = 'none';
    actionButton.style.borderRadius = '4px';
    actionButton.style.cursor = 'pointer';
    actionButton.onclick = function() {
      showMobileNumberModal(item);
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

async function givePermToGvnNo(mo, mc=1, vwNo, fnNo, dtt){
playClickSound();

payload0.vw = 0;
payload0.fn = 46;
payload0.x0 = mo;
payload0.x1 = mc;
payload0.x2 = vwNo;
payload0.x3 = fnNo;
payload0.x4 = dtt;

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
function showMobileNumberModal(item) {
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
  modalContent.style.width = '80%';
  modalContent.style.maxWidth = '400px';

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
  title.textContent = 'Permit Mobile Number';
  title.style.marginTop = '0';
  title.style.color = '#333';

  // Create info section
  const infoContainer = document.createElement('div');
  infoContainer.style.marginBottom = '15px';
  infoContainer.style.padding = '10px';
  infoContainer.style.backgroundColor = '#f5f5f5';
  infoContainer.style.borderRadius = '4px';

  const descriptionLabel = document.createElement('div');
  descriptionLabel.textContent = `Description: ${item.fn}`;
  descriptionLabel.style.marginBottom = '5px';

  const viewNoLabel = document.createElement('div');
  viewNoLabel.textContent = `View No: ${item.g}`;
  viewNoLabel.style.marginBottom = '5px';

  const functionNoLabel = document.createElement('div');
  functionNoLabel.textContent = `Function No: ${item.h}`;
  functionNoLabel.style.marginBottom = '5px';

  const expiryLabel = document.createElement('div');
  expiryLabel.textContent = `Expiry Date: ${item.j}`;
  expiryLabel.style.fontWeight = 'bold';

  infoContainer.appendChild(descriptionLabel);
  infoContainer.appendChild(viewNoLabel);
  infoContainer.appendChild(functionNoLabel);
  infoContainer.appendChild(expiryLabel);

  // Create input field for mobile number
  const mobileInputContainer = document.createElement('div');
  mobileInputContainer.style.margin = '15px 0';

  const mobileInputLabel = document.createElement('label');
  mobileInputLabel.textContent = 'Mobile Number:';
  mobileInputLabel.style.display = 'block';
  mobileInputLabel.style.marginBottom = '5px';

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

  mobileInputContainer.appendChild(mobileInputLabel);
  mobileInputContainer.appendChild(mobileInput);

  // Create date time input
  const dateInputContainer = document.createElement('div');
  dateInputContainer.style.margin = '15px 0';

  const dateInputLabel = document.createElement('label');
  dateInputLabel.textContent = 'Date and Time:';
  dateInputLabel.style.display = 'block';
  dateInputLabel.style.marginBottom = '5px';

  const dateInput = document.createElement('input');
  dateInput.type = 'datetime-local';
  dateInput.style.width = '100%';
  dateInput.style.padding = '8px';
  dateInput.style.border = '1px solid #ddd';
  dateInput.style.borderRadius = '4px';
  
    // Set max date to item.j (expiry date)
  const expiryDate = new Date(item.j);
  const maxDateString = expiryDate.toISOString().slice(0, 16);
  dateInput.max = maxDateString;
  
  // Set default to current date/time
  const now = new Date();
  const nowString = now.toISOString().slice(0, 16);
  dateInput.value = nowString;

  dateInputContainer.appendChild(dateInputLabel);
  dateInputContainer.appendChild(dateInput);

  // Create permit button
  const permitButton = document.createElement('button');
  permitButton.textContent = 'Permit this Number';
  permitButton.style.padding = '10px 15px';
  permitButton.style.backgroundColor = '#4CAF50';
  permitButton.style.color = 'white';
  permitButton.style.border = 'none';
  permitButton.style.borderRadius = '4px';
  permitButton.style.cursor = 'pointer';
  permitButton.style.marginTop = '10px';
  permitButton.style.width = '100%';
  
  // Function to check if date is valid (in the future)
  function checkDateValidity() {
    const selectedDate = new Date(dateInput.value);
    const isValid = selectedDate > new Date();
    
    permitButton.disabled = !isValid;
    permitButton.style.backgroundColor = isValid ? '#4CAF50' : '#cccccc';
    permitButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
  }
  
  // Initial check
  checkDateValidity();
  
  // Add event listener to date input
  dateInput.addEventListener('change', checkDateValidity);
  dateInput.addEventListener('input', checkDateValidity);

  permitButton.onclick = async function() {
    const mobileNumber = mobileInput.value.trim();
    const selectedDateTime = dateInput.value;
    
    // Validate mobile number (exactly 10 digits)
    if (!/^\d{10}$/.test(mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number');
      mobileInput.focus();
      return;
    }
    
    // Validate date is selected
    if (!selectedDateTime) {
      alert('Please select a date and time');
      dateInput.focus();
      return;
    }
    
    // Additional check (should already be handled by disabled state)
    const selectedDate = new Date(selectedDateTime);
    if (selectedDate <= new Date()) {
      alert('Please select a future date and time');
      return;
    }
    
    // Call the function with all parameters
    await givePermToGvnNo(mobileNumber, 1, item.g, item.h, selectedDateTime);
    document.body.removeChild(modal);
  };

  // Assemble modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(infoContainer);
  modalContent.appendChild(mobileInputContainer);
  modalContent.appendChild(dateInputContainer);
  modalContent.appendChild(permitButton);
  modal.appendChild(modalContent);

  // Add modal to body
  document.body.appendChild(modal);

  // Close modal when clicking outside content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // Focus the mobile input field when modal opens
  mobileInput.focus();
}

// Make the function available globally

window.showMyControls = showMyControls;
