let f1nBaToExe = null;
let s_ba_witchToReturn = null;
let l1oaderElementId = null;
let f1nToRunToHandlRspons = null;
let sltd_ba_obj = {};

let g_createNwModal = null;
let g_targetDivId = null;
let currentBillModalElement = null; // Store the actual modal element
let itemsData = [];
let mostUsed_ba_Items = {}; // Track most used items
let existingBills = []; // Store existing bills for duplicate checking
let existingBillItems = []; // Store existing bill items for update mode
let isUpdateMode = false; // Flag to track if we're in update mode
let currentBillId = null; // Store the current bill ID being updated

// Helper function to get max item name length
function getMaxItemNameLength() {
 // Check if the current page has the config variable set
 if (window[my1uzr.worknOnPg] &&
  window[my1uzr.worknOnPg].confg &&
  window[my1uzr.worknOnPg].confg.itmNameMxLength) {
  return window[my1uzr.worknOnPg].confg.itmNameMxLength;
 }
 // Default to 16 characters if not set
 return 16;
}

// Function to update item name character counter
function updateItemNameCounter(textarea) {
 const maxLength = getMaxItemNameLength();
 const currentLength = textarea.value.length;
 const counter = document.getElementById('itemNameCounter');
 if (counter) {
  counter.textContent = `${currentLength}/${maxLength}`;
  // Optional: Change color when approaching limit
  if (currentLength > maxLength * 0.8) {
   counter.style.color = currentLength >= maxLength ? 'red' : 'orange';
  } else {
   counter.style.color = '';
  }
 }
}

// Function to enable add item button
function enableAddItemButton() {
 const addItemBtn = getBillFormElement('#addItemBtn');
 if (addItemBtn) {
  addItemBtn.disabled = false;
  addItemBtn.classList.remove('disabled');
  addItemBtn.innerHTML = '<i class="fas fa-plus me-1"></i> Add Item';
 }
}

async function open_bil_inward(...args) {

 l1oaderElementId = document.getElementById(args[0] || null);
 g_createNwModal = args[1] || 0;
 g_targetDivId = args[2] || null;
 f1nToRunToHandlRspons = args[3] || null;
 s_ba_witchToReturn = args[4] || null;

 // Load existing bills for duplicate checking
 existingBills = await dbDexieManager.getAllRecords(dbnm, "ba") || [];

 // Load existing bill items for potential update mode
 existingBillItems = await dbDexieManager.getAllRecords(dbnm, "s") || [];

 // Create the form HTML with Bootstrap classes
 const formHTML = `
<div class="container-fluid bill-inward-form">
 <div class="card mb-4">
  <div class="card-body">
   <h5 class="card-title">Bill Inward Details</h5>
   <div class="form-section">
    <div class="row mb-3">
     <div class="col-md-8">
      <div class="input-group">
       <div id="supplier_nm" class="alert alert-info"></div>
       <div id="updateModeMsg" class="alert alert-warning ms-2" style="display: none;">
        <i class="fas fa-lock me-1"></i> Disabled in update mode
       </div>
       <input type="hidden" id="supplierId" value="0" readonly>
       <button class="btn btn-outline-primary" id="selectPartyBtn">
        <i class="fas fa-user-friends me-1"></i> Select Party
       </button>
      </div>
     </div>
     <div class="col-md-4">
      <label for="billDate" class="form-label">Date of Bill Received:</label>
      <input type="date" class="form-control" id="billDate" required>
     </div>
    </div>

    <div class="row mb-3">
     <div class="col-6">
      <label for="billNo" class="form-label">Bill No:</label>
      <input type="text" class="form-control" id="billNo" required>
     </div>
     <div class="col-6">
      <label for="billAmount" class="form-label">Bill Amount:</label>
      <input type="number" class="form-control" id="billAmount" step="0.01" required>
     </div>
    </div>

    <div class="mb-3">
     <label for="billRemark" class="form-label">
      Remark
      <button type="button" class="btn btn-sm btn-outline-secondary toggle-remark" onclick="toggleRemarkVisibility()">
       <i class="fas fa-plus"></i>
      </button>
     </label>
     <textarea class="form-control" id="billRemark" rows="2" style="display: none;"></textarea>
    </div>
   </div>
  </div>
 </div>

 <div class="card mb-4" id="billItemsSection">
  <div class="card-body">
   <h5 class="card-title">Bill Items</h5>
   <div class="row" id="itemsCardsContainer">
    <!-- Items will be added here as cards -->
   </div>
   <button type="button" class="btn btn-primary mt-3" id="addItemBtn">
    <i class="fas fa-plus me-1"></i> Add Item
   </button>
  </div>
 </div>

 <div class="form-actions">
  <button type="button" class="btn btn-success" id="saveBtn">
   <i class="fas fa-save me-1"></i> Save Bill
  </button>
  <button type="button" class="btn btn-warning" id="updateBtn" style="display: none;">
   <i class="fas fa-sync-alt me-1"></i> Update Bill
  </button>
  <button type="button" class="btn btn-secondary" id="closeBtn">
   <i class="fas fa-times me-1"></i> Close
  </button>
 </div>
</div>

<!-- Item Form Modal -->
<div id="itemFormModal" class="modal fade" tabindex="-1">
 <div class="modal-dialog modal-lg">
  <div class="modal-content">
   <div class="modal-header">
    <h5 class="modal-title">Add/Edit Item</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
   </div>
   <div class="modal-body">
    <div id="itemFormContainer"></div>
   </div>
  </div>
 </div>
</div>`;

 // Handle modal creation based on createNwModal parameter
 if (g_createNwModal == 1) {
  // Create a new isolated modal using existing function
  const modalId = g_targetDivId || 'billInwardModal';
  const modal = create_modal_dynamically(modalId);
  modal.contentElement.innerHTML = formHTML;
  currentBillModalElement = modal.modalElement;
  modal.modalInstance.show();
 } else {
  // Use existing target div
  const targetDiv = document.getElementById(g_targetDivId);
  targetDiv.innerHTML = formHTML;
  currentBillModalElement = targetDiv;

  if (modalid) {
   showModal(modalid);
  }
 }

 // Set up event listeners
 setupEventListeners();

 // Apply custom styles
 applyStyles();

 // Hide loader if provided
 if (l1oaderElementId) {
  const loader = document.getElementById(l1oaderElementId);
  if (loader) loader.style.display = 'none';
 }

 // Show bill items section by default
 const itemsSection = getBillFormElement('#billItemsSection');
 const saveBtn = getBillFormElement('#saveBtn');
 if (itemsSection) itemsSection.style.display = 'block';
 if (saveBtn) saveBtn.style.display = 'inline-block';
}

// Helper function to get elements in the current modal context
function getBillFormElement(selector) {
 if (!currentBillModalElement) {
  console.warn('currentBillModalElement is not set');
  // Try to find the element globally as fallback
  return document.querySelector(selector);
 }

 // For Bootstrap modals, the content is inside .modal-content
 let element = currentBillModalElement.querySelector(selector);

 if (!element) {
  // If not found, try searching in the entire modal
  element = currentBillModalElement.querySelector(selector);
 }

 if (!element) {
  // Final fallback - search globally
  element = document.querySelector(selector);
 }

 return element;
}

// Setup event listeners in the correct context
function setupEventListeners() {
 // Use setTimeout to ensure DOM is ready
 setTimeout(() => {
  const addItemBtn = getBillFormElement('#addItemBtn');
  const saveBtn = getBillFormElement('#saveBtn');
  const updateBtn = getBillFormElement('#updateBtn');
  const closeBtn = getBillFormElement('#closeBtn');
  const billNoInput = getBillFormElement('#billNo');
  const selectPartyBtn = getBillFormElement('#selectPartyBtn');

  console.log('Setting up event listeners:', { addItemBtn, saveBtn, updateBtn, closeBtn, billNoInput, selectPartyBtn });

  addItemBtn?.addEventListener('click', function () {
   showItemFormModal();
  });

  saveBtn?.addEventListener('click', saveBillData);

  updateBtn?.addEventListener('click', function () {
   saveBillData(sltd_ba_obj.a);
  });

  closeBtn?.addEventListener('click', function () {
   const modalId = g_createNwModal == 1 ? (g_targetDivId || 'billInwardModal') : modalid;
   if (modalId) {
    hideModal(modalId);
   }
  });

  // Add bill number blur event for duplicate checking
  if (billNoInput) {
   billNoInput.addEventListener('blur', checkDuplicateBillNumber);
   // Add input event to re-enable button when bill number changes
   billNoInput.addEventListener('input', function () {
    enableAddItemButton();
   });
  }

  // Add event listener for select party button
  if (selectPartyBtn) {
   selectPartyBtn.addEventListener('click', async function () {
    if (!isUpdateMode) {
     await loadExe2Fn(14, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_ba_ViewCall', 1], [1]);
    }
   });
  }
 }, 100);
}

async function checkDuplicateBillNumber() {
 const billNoInput = getBillFormElement('#billNo');
 const billNo = billNoInput?.value?.trim();

 // Check if bill number has value
 if (!billNo || billNo.length === 0) {
  return;
 }

 // Check if party is selected
 if (!sltd_ba_obj?.a || Number(sltd_ba_obj.a) <= 0) {
  // Party not selected yet, but we still want to show the duplicate warning
  // We'll check for any bill with this number for any party
  const duplicateBills = existingBills.filter(bill =>
   bill.g && bill.g.toLowerCase() === billNo.toLowerCase()
  );

  if (duplicateBills.length > 0) {
   showDuplicateBillModal(duplicateBills);
  }
  return;
 }

 // Check for duplicate bill for the selected party (case insensitive)
 const duplicateBills = existingBills.filter(bill =>
  bill.e && bill.e.toString() === sltd_ba_obj.a.toString() &&
  bill.g && bill.g.toLowerCase() === billNo.toLowerCase()
 );

 if (duplicateBills.length > 0) {
  showDuplicateBillModal(duplicateBills);
 }
}

function showDuplicateBillModal(duplicateBills) {
 // Create a dynamic modal for duplicate bill warning
 const modal = create_modal_dynamically('duplicateBillModal');

 let message = '';
 if (duplicateBills.length === 1) {
  const bill = duplicateBills[0];
  message = `Bill number "${bill.g}" already exists`;

  if (sltd_ba_obj?.a && bill.e) {
   message += ` for this party.`;
  } else if (bill.e) {
   message += ` for party ID: ${bill.e}.`;
  }
 } else {
  message = `Bill number "${duplicateBills[0].g}" exists in ${duplicateBills.length} records.`;
 }

 modal.contentElement.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Duplicate Bill Found</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
            <p>Do you want to see/update this bill inward?</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="viewDuplicateBtn">
                <i class="fas fa-eye me-1"></i> Yes, View/Update
            </button>
            <button type="button" class="btn btn-secondary" id="ignoreDuplicateBtn">
                <i class="fas fa-times me-1"></i> No, Continue New
            </button>
        </div>
    `;

 // Store the duplicate bill(s) in the modal element for later use
 modal.modalElement.dataset.duplicateBills = JSON.stringify(duplicateBills);

 // Show the modal
 modal.modalInstance.show();

 // Add event listeners after modal is shown
 setTimeout(() => {
  const viewBtn = document.getElementById('viewDuplicateBtn');
  const ignoreBtn = document.getElementById('ignoreDuplicateBtn');
  const closeBtn = modal.modalElement.querySelector('.btn-close');

  if (viewBtn) {
   viewBtn.addEventListener('click', async function () {
    // Close the duplicate modal
    modal.modalInstance.hide();

    try {
     // Get the duplicate bills from data attribute
     const duplicateBillsData = JSON.parse(modal.modalElement.dataset.duplicateBills);
     if (duplicateBillsData && duplicateBillsData.length > 0) {
      // Get the first duplicate bill
      const duplicateBill = duplicateBillsData[0];

      // Get bill items where f matches the party ID (sltd_ba_obj.a)
      const partyItems = existingBillItems.filter(item =>
       item.f && item.f === duplicateBill.a
      );

      // Enable update mode
      enableUpdateMode(duplicateBill, partyItems);
     }
    } catch (error) {
     console.error('Error processing duplicate bill:', error);
     alert('Error loading duplicate bill data');
    }
   });
  }

  if (ignoreBtn) {
   ignoreBtn.addEventListener('click', function () {
    // Close the modal
    modal.modalInstance.hide();

    // Disable the add item button
    const addItemBtn = getBillFormElement('#addItemBtn');
    if (addItemBtn) {
     addItemBtn.disabled = true;
     addItemBtn.classList.add('disabled');
     addItemBtn.innerHTML = '<i class="fas fa-ban me-1"></i> Add Item (Disabled)';
    }
   });
  }

  if (closeBtn) {
   closeBtn.addEventListener('click', function () {
    // When user closes with X, treat as "No"
    const addItemBtn = getBillFormElement('#addItemBtn');
    if (addItemBtn) {
     addItemBtn.disabled = true;
     addItemBtn.classList.add('disabled');
     addItemBtn.innerHTML = '<i class="fas fa-ban me-1"></i> Add Item (Disabled)';
    }
   });
  }

  // Handle modal hide event
  modal.modalElement.addEventListener('hidden.bs.modal', function () {
   // Check if add item button should be disabled
   const addItemBtn = getBillFormElement('#addItemBtn');
   if (addItemBtn && addItemBtn.disabled) {
    // Button is already disabled (user clicked "No")
   }
  });
 }, 100);
}

function enableUpdateMode(duplicateBill, partyItems) {
 // Set update mode flag
 isUpdateMode = true;
 currentBillId = duplicateBill.a; // Store the bill ID

 // Hide save button, show update button
 const saveBtn = getBillFormElement('#saveBtn');
 const updateBtn = getBillFormElement('#updateBtn');

 if (saveBtn) saveBtn.style.display = 'none';
 if (updateBtn) updateBtn.style.display = 'inline-block';

 // Disable party selection button and show message
 const selectPartyBtn = getBillFormElement('#selectPartyBtn');
 const updateModeMsg = getBillFormElement('#updateModeMsg');

 if (selectPartyBtn) {
  selectPartyBtn.disabled = true;
  selectPartyBtn.classList.add('disabled');
 }

 if (updateModeMsg) {
  updateModeMsg.style.display = 'block';
 }

 // Populate form fields with duplicate bill data
 const billDateInput = getBillFormElement('#billDate');
 const billNoInput = getBillFormElement('#billNo');
 const billAmountInput = getBillFormElement('#billAmount');
 const billRemarkInput = getBillFormElement('#billRemark');

 if (billDateInput && duplicateBill.f) {
  billDateInput.value = duplicateBill.f;
 }

 if (billNoInput && duplicateBill.g) {
  billNoInput.value = duplicateBill.g;
 }

 if (billAmountInput && duplicateBill.h) {
  billAmountInput.value = duplicateBill.h;
 }

 if (billRemarkInput && duplicateBill.i) {
  billRemarkInput.value = duplicateBill.i;
  // Show the remark textarea if there's a remark
  const toggleBtn = getBillFormElement('.toggle-remark');
  if (billRemarkInput.value.trim() !== '') {
   billRemarkInput.style.display = 'block';
   if (toggleBtn) {
    toggleBtn.innerHTML = '<i class="fas fa-minus"></i>';
   }
  }
 }

 // Clear existing items and load the party items
 itemsData = [];

 // Convert party items to the format expected by itemsData
 if (partyItems && partyItems.length > 0) {
  partyItems.forEach(item => {
   const itemData = {
    itemName: item.e || '',
    itemThumbnail: item.g || '',
    itemImage: item.h || '',
    purchasePrice: item.ss?.h || 0,
    quantityReceived: item.ss?.i || 0,
    salesPrice: item.ss?.k || 0,
    receivedUnit: item.ss?.l || '',
    sellingUnit: item.ss?.m || '',
    itemRemark: '',
    excludeFromStock: item.ss?.d === 111,
    e_a: item.e_a || 0
   };

   itemsData.push(itemData);
  });

  // Refresh the items display
  refreshItemsCards();
 }

 // Show a success message
 const supplierNm = getBillFormElement('#supplier_nm');
 if (supplierNm) {
  const originalContent = supplierNm.innerHTML;
  supplierNm.innerHTML = originalContent + ' <span class="text-success"><i class="fas fa-info-circle"></i> Update Mode Activated</span>';
 }

 console.log('Update mode enabled for bill:', duplicateBill);
}

function toggleRemarkVisibility() {
 const remarkTextarea = getBillFormElement('#billRemark');
 const toggleBtn = getBillFormElement('.toggle-remark');

 console.log('Toggle remark elements:', { remarkTextarea, toggleBtn });

 if (remarkTextarea && remarkTextarea.style.display === 'none') {
  remarkTextarea.style.display = 'block';
  toggleBtn.innerHTML = '<i class="fas fa-minus"></i>';
 } else if (remarkTextarea) {
  remarkTextarea.style.display = 'none';
  toggleBtn.innerHTML = '<i class="fas fa-plus"></i>';
 }
}

function validatePartyAndBillNo() {
 // Check if party is selected
 if (!sltd_ba_obj?.a || Number(sltd_ba_obj.a) <= 0) {
  alert('Please select a party/supplier first');
  return false;
 }

 // Check if bill number is entered
 const billNoInput = getBillFormElement('#billNo');
 const billNo = billNoInput?.value.trim();
 if (!billNo) {
  alert('Please enter bill number first');
  billNoInput?.focus();
  return false;
 }

 return true;
}

function showItemFormModal(itemIndex = null, itemData = null) {
 // Validate party and bill number before showing item form
 if (!validatePartyAndBillNo()) {
  return; // Stop if validation fails
 }

 const isEditMode = itemIndex !== null;
 const maxLength = getMaxItemNameLength();

 const itemFormHTML = `
<div class="item-form-modal">
 <h5 class="mb-3">${isEditMode ? 'Edit Item' : 'Add New Item'}</h5>
 <div id="modalItemIdDisplay" class="alert alert-info item-id-display" style="display: none;">
  <strong>Item ID:</strong> <span id="modalItemIdValue"></span>
 </div>
 <div class="mb-3">
  <label for="modalItemName" class="form-label">Item Name:</label>
  <textarea class="form-control" id="modalItemName" rows="2" placeholder="Item / Product Name" maxlength="${maxLength}"
   oninput="updateItemNameCounter(this)"></textarea>
  <div class="form-text text-end">
   <span id="itemNameCounter">0/${maxLength}</span> characters
  </div>
 </div>
 <div class="mb-3">
  <label for="modalItemThumbnail" class="form-label">Thumbnail Image URL:</label>
  <input type="url" class="form-control" id="modalItemThumbnail">
 </div>
 <div class="mb-3">
  <label for="modalItemImage" class="form-label">Big Image URL:</label>
  <input type="url" class="form-control" id="modalItemImage">
 </div>
 <div class="row mb-3">
  <div class="col-4">
   <label for="modalPurchasePrice" class="form-label">Purch Price:</label>
   <input type="number" class="form-control" id="modalPurchasePrice" step="0.01" required>
  </div>
  <div class="col-4">
   <label for="modalSalesPrice" class="form-label">Sels Price:</label>
   <input type="number" class="form-control" id="modalSalesPrice" step="0.01" required>
  </div>
  <div class="col-4">
   <label for="modalQuantity" class="form-label">Qty Rcvd:</label>
   <input type="number" class="form-control" id="modalQuantity" step="0.01" required>
  </div>
 </div>
 <div class="mb-3">
  <div class="form-check">
   <input class="form-check-input" type="checkbox" id="exclude_this_item_from_stock_chk"
    style="border: 1px solid black;">
   <label class="form-check-label" for="exclude_this_item_from_stock_chk">
    Exclude this item from stock
   </label>
  </div>
 </div>
 <div class="mb-3" style="visibility:hidden">
  <label for="modalReceivedUnit" class="form-label">Received Unit:</label>
  <input type="text" class="form-control" id="modalReceivedUnit" required>
 </div>
 <div class="mb-3" style="visibility:hidden">
  <label for="modalSellingUnit" class="form-label">Selling Unit:</label>
  <input type="text" class="form-control" id="modalSellingUnit" required>
 </div>
 <div class="mb-3" style="visibility:hidden">
  <label for="modalItemRemark" class="form-label">Remark:</label>
  <textarea class="form-control" id="modalItemRemark" rows="2"></textarea>
 </div>
 <div class="d-flex justify-content-end gap-2">
  <button type="button" class="btn btn-primary" id="modalSaveItemBtn">
   <i class="fas fa-save me-1"></i> ${isEditMode ? 'Update' : 'Save'}
  </button>
  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
   <i class="fas fa-times me-1"></i> Cancel
  </button>
 </div>
</div>
    `;

 // Set the form content
 document.getElementById('itemFormContainer').innerHTML = itemFormHTML;

 const itemNameInput = document.getElementById('modalItemName');
 if (itemNameInput) {
  itemNameInput.addEventListener('focus', () => {
   showItemNameDropdown(itemNameInput);
  });

  itemNameInput.addEventListener('input', () => {
   showItemNameDropdown(itemNameInput);
   checkExactItemMatch(itemNameInput.value);
  });
 }

 // If in edit mode, populate the form with existing data
 if (isEditMode) {
  document.getElementById('modalItemName').value = itemData.itemName;
  document.getElementById('modalItemThumbnail').value = itemData.itemThumbnail;
  document.getElementById('modalItemImage').value = itemData.itemImage;
  document.getElementById('modalPurchasePrice').value = itemData.purchasePrice;
  document.getElementById('modalSalesPrice').value = itemData.salesPrice;
  document.getElementById('modalQuantity').value = itemData.quantityReceived;
  document.getElementById('modalReceivedUnit').value = itemData.receivedUnit;
  document.getElementById('modalSellingUnit').value = itemData.sellingUnit;
  document.getElementById('modalItemRemark').value = itemData.itemRemark;

  // Set the checkbox value
  const excludeFromStockCheckbox = document.getElementById('exclude_this_item_from_stock_chk');
  if (excludeFromStockCheckbox) {
   excludeFromStockCheckbox.checked = itemData.excludeFromStock || false;
  }

  // Set item ID if available
  if (itemData.e_a) {
   document.getElementById('modalItemIdDisplay').style.display = 'block';
   document.getElementById('modalItemIdValue').textContent = itemData.e_a;
  }

  // Update counter for existing data
  setTimeout(() => {
   updateItemNameCounter(document.getElementById('modalItemName'));
  }, 100);
 }

 // Set up save button event listener
 document.getElementById('modalSaveItemBtn').addEventListener('click', function () {
  saveItemToTable(itemIndex);
 });

 // Show the modal using Bootstrap
 const modal = new bootstrap.Modal(document.getElementById('itemFormModal'));
 modal.show();
}

async function checkExactItemMatch(itemName) {
 try {
  const i_ba_tems = await dbDexieManager.getAllRecords(dbnm, "s");
  const exactMatch = i_ba_tems.find(item =>
   item.gn.toLowerCase() === itemName.toLowerCase()
  );

  const itemIdDisplay = document.getElementById('modalItemIdDisplay');
  const itemIdValue = document.getElementById('modalItemIdValue');

  if (exactMatch) {
   itemIdDisplay.style.display = 'block';
   itemIdValue.textContent = exactMatch.a;

   // Remove new item styling if it exists
   itemIdDisplay.classList.remove('alert-warning');
   itemIdDisplay.classList.add('alert-info');
  } else {
   // Show "new item" message when no match found
   itemIdDisplay.style.display = 'block';
   itemIdValue.textContent = '0';
   itemIdDisplay.classList.remove('alert-info');
   itemIdDisplay.classList.add('alert-warning');
  }
 } catch (error) {
  console.error("Error checking item match:", error);
 }
}

function saveItemToTable(itemIndex = null) {
 // Validate the form
 if (!validateItemForm()) {
  return;
 }

 // Get item ID display element
 const itemIdDisplay = document.getElementById('modalItemIdDisplay');
 const itemIdValue = document.getElementById('modalItemIdValue');

 // Check if it's a new item (ID = 0)
 const isNewItem = itemIdValue.textContent === '0';

 const itemId = itemIdDisplay.style.display !== 'none' ?
  document.getElementById('modalItemIdValue').textContent : null;

 // Get the checkbox value
 const excludeFromStockCheckbox = document.getElementById('exclude_this_item_from_stock_chk');
 const excludeFromStock = excludeFromStockCheckbox ? excludeFromStockCheckbox.checked : false;

 // Get form data
 const itemData = {
  itemName: document.getElementById('modalItemName').value,
  itemThumbnail: document.getElementById('modalItemThumbnail').value,
  itemImage: document.getElementById('modalItemImage').value,
  purchasePrice: parseFloat(document.getElementById('modalPurchasePrice').value),
  salesPrice: parseFloat(document.getElementById('modalSalesPrice').value),
  quantityReceived: parseFloat(document.getElementById('modalQuantity').value),
  receivedUnit: document.getElementById('modalReceivedUnit').value,
  sellingUnit: document.getElementById('modalSellingUnit').value,
  itemRemark: document.getElementById('modalItemRemark').value,
  excludeFromStock: excludeFromStock, // Add this property
  e_a: isNewItem ? 0 : itemIdValue.textContent
 };

 if (itemIndex !== null) {
  // Update existing item
  itemsData[itemIndex] = itemData;
 } else {
  // Add new item
  itemsData.push(itemData);
 }

 // Refresh the cards display
 refreshItemsCards();

 // Hide the modal using Bootstrap
 const modal = bootstrap.Modal.getInstance(document.getElementById('itemFormModal'));
 modal.hide();
}

function validateItemForm() {
 // Simple validation - expand as needed
 const itemNameInput = document.getElementById('modalItemName');
 const itemName = itemNameInput?.value?.trim();
 const maxLength = getMaxItemNameLength();

 if (!itemName) {
  alert('Please enter item name');
  return false;
 }

 if (itemName.length > maxLength) {
  alert(`Item name cannot exceed ${maxLength} characters. Current length: ${itemName.length}`);
  itemNameInput.focus();
  return false;
 }

 if (!document.getElementById('modalPurchasePrice').value ||
  isNaN(parseFloat(document.getElementById('modalPurchasePrice').value))) {
  alert('Please enter valid purchase price');
  return false;
 }

 if (!document.getElementById('modalSalesPrice').value ||
  isNaN(parseFloat(document.getElementById('modalSalesPrice').value))) {
  alert('Please enter valid sales price');
  return false;
 }

 if (!document.getElementById('modalQuantity').value ||
  isNaN(parseFloat(document.getElementById('modalQuantity').value))) {
  alert('Please enter valid quantity');
  return false;
 }

 return true;
}

function refreshItemsCards() {
 const cardsContainer = getBillFormElement('#itemsCardsContainer');
 if (!cardsContainer) {
  console.error('Items cards container not found');
  return;
 }

 cardsContainer.innerHTML = '';

 itemsData.forEach((item, index) => {
  const cardCol = document.createElement('div');
  cardCol.className = 'col-md-6 col-lg-4 mb-3';

  const isNewItem = item.e_a === 0;

  cardCol.innerHTML = `
<div class="card item-card h-100 ${isNewItem ? 'border-warning' : ''} ${item.excludeFromStock ? 'border-danger' : ''}"
 data-index="${index}">
 <div
  class="card-header d-flex justify-content-between align-items-center py-2 ${isNewItem ? 'bg-warning text-dark' : item.excludeFromStock ? 'bg-danger text-white' : 'bg-light'}">
  <small class="fw-bold">
   ${isNewItem ? 'NEW ITEM' : `Item ID: ${item.e_a}`}
   ${item.excludeFromStock ? ' (Excluded)' : ''}
  </small>
  <div class="item-actions">
   <button class="btn btn-sm btn-outline-primary edit-btn me-1" data-index="${index}">
    <i class="fas fa-edit"></i>
   </button>
   <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}">
    <i class="fas fa-trash"></i>
   </button>
  </div>
 </div>
 <div class="card-body p-3">
  <div class="row">
   <div class="col-4">
    <img src="${item.itemThumbnail || 'https://cdn-icons-png.freepik.com/512/13543/13543330.png'}"
     class="img-fluid rounded" alt="${item.itemName}"
     onerror="this.src='https://cdn-icons-png.freepik.com/512/13543/13543330.png'">
   </div>
   <div class="col-8">
    <h6 class="card-title mb-2 text-truncate" title="${item.itemName}" style="max-width: 100%;">${item.itemName}</h6>
    <div class="item-details">
     <div class="d-flex justify-content-between mb-1">
      <small class="text-muted">Purchase:</small>
      <small class="fw-bold">₹${item.purchasePrice.toFixed(2)}</small>
     </div>
     <div class="d-flex justify-content-between mb-1">
      <small class="text-muted">Sales:</small>
      <small class="fw-bold text-success">₹${item.salesPrice.toFixed(2)}</small>
     </div>
     <div class="d-flex justify-content-between mb-1">
      <small class="text-muted">Qty:</small>
      <small class="fw-bold">${item.quantityReceived} ${item.receivedUnit}</small>
     </div>
     <div class="d-flex justify-content-between">
      <small class="text-muted">Total:</small>
      <small class="fw-bold text-primary">₹${(item.purchasePrice * item.quantityReceived).toFixed(2)}</small>
     </div>
    </div>
   </div>
  </div>
 </div>
</div>
        `;

  // Add click event for the entire card (excluding action buttons)
  const card = cardCol.querySelector('.item-card');
  card.addEventListener('click', function (e) {
   // Don't trigger if edit/delete buttons were clicked
   if (!e.target.closest('.item-actions')) {
    // Check if we're in a modal context and handle accordingly
    handleCardClick(index);
   }
  });

  cardsContainer.appendChild(cardCol);
 });

 // Add event listeners for edit and delete buttons
 cardsContainer.querySelectorAll('.edit-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
   e.stopPropagation();
   const index = parseInt(this.getAttribute('data-index'));
   showItemFormModal(index, itemsData[index]);
  });
 });

 cardsContainer.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
   e.stopPropagation();
   const index = parseInt(this.getAttribute('data-index'));
   if (confirm('Are you sure you want to delete this item?')) {
    itemsData.splice(index, 1);
    refreshItemsCards();
   }
  });
 });

 // Update bill amount if needed
 updateBillAmount();
}

// New function to handle card click properly
function handleCardClick(index) {
 // Only proceed if we have the function to execute
 if (f1nBaToExe && window[f1nBaToExe]) {
  // Check if we're in a modal context
  const isInModal = g_createNwModal == 1 || currentBillModalElement?.classList?.contains('modal');

  if (isInModal) {
   // For modal context, don't close the modal, just execute the function
   window[f1nBaToExe](itemsData[index], s_ba_witchToReturn);
  } else {
   // For non-modal context, check if there's any open modal to close
   const openModal = document.querySelector('.modal.show');
   if (openModal) {
    const bsModal = bootstrap.Modal.getInstance(openModal);
    if (bsModal) {
     bsModal.hide();
    }
   }
   window[f1nBaToExe](itemsData[index], s_ba_witchToReturn);
  }
 }
}

function updateBillAmount() {
 // Calculate total bill amount based on items
 const totalAmount = itemsData.reduce((sum, item) => {
  return sum + (item.purchasePrice * item.quantityReceived);
 }, 0);

 // Update the bill amount field
 const billAmountInput = getBillFormElement('#billAmount');
 if (billAmountInput) {
  billAmountInput.value = totalAmount.toFixed(2);
 }
}

function showModal(modalId) {
 const modalElement = document.getElementById(modalId);
 if (modalElement) {
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Update current modal reference
  currentBillModalElement = modalElement;
 }
}

function hideModal(modalId) {
 const modalElement = document.getElementById(modalId);
 if (modalElement) {
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) {
   modal.hide();
  }
 }
}

async function saveBillData(billIdParam = null) {
 // Show loader
 const loaderElement = document.getElementById(l1oaderElementId) || createLoader();
 loaderElement.style.display = 'flex';

 try {
  const isValid = await validateForm();
  if (!isValid) {
   loaderElement.style.display = 'none';
   return;
  }

  const billData = {
   "e": sltd_ba_obj.a,
   "f": getBillFormElement('#billDate').value,
   "g": getBillFormElement('#billNo').value,
   "h": parseFloat(getBillFormElement('#billAmount').value),
   "i": getBillFormElement('#billRemark').value,
   "items": itemsData.map(item => ({
    "e_a": item.e_a || 0,
    "e": item.itemName,
    "f": 0, // Assuming default value
    "g": item.itemThumbnail,
    "h": item.itemImage,
    "ss": {
     "h": item.purchasePrice,
     "i": item.quantityReceived,
     "j": 0, // Assuming default value
     "k": item.salesPrice,
     "l": item.receivedUnit,
     "m": item.sellingUnit,
     "n": 0, // Assuming default value
     "d": item.excludeFromStock ? 111 : 0 // Add this line - 111 if excluded, 0 if included
    }
   }))
  };

  payload0.da = billData;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'ba', "col": 'b', "cl": "b" }, { "tb": 'p', "col": 'b', "cl": "b" }, { "tb": 's', "col": 'b', "cl": "b" }]);
  payload0.vw = 1;
  payload0.fn = 47;//insert
  // If in update mode, add the bill ID
  if (isUpdateMode && currentBillId) {
   payload0.fn = 56;//update
   billData.a = currentBillId;
  }

  var r368esponse = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 15000, 0, 1, 0);

  if (r368esponse && r368esponse.su === 1) {
   if (f1nToRunToHandlRspons && window[f1nToRunToHandlRspons]) {
    window[f1nToRunToHandlRspons](r368esponse, s_ba_witchToReturn);
    const modalId = g_createNwModal == 1 ? (g_targetDivId || 'billInwardModal') : modalid;
    if (modalId) {
     hideModal(modalId);
    }
   }
  } else {
   alert("Error: " + (r368esponse?.ms || "Unknown error"));
  }
 } catch (error) {
  console.error("Error saving item:", error);
  showToast("Error saving item: " + error.message);
 } finally {
  // Hide loader when done
  loaderElement.style.display = 'none';
  console.log("reached in finally");
 }
}

// Helper function to create a loader if one isn't provided
function createLoader() {
 const loaderId = 'dynamicLoader_' + Date.now();
 const loaderHTML = `
    <div id="${loaderId}" class="modal fade" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Saving...</p>
                </div>
            </div>
        </div>
    </div>
    `;

 document.body.insertAdjacentHTML('beforeend', loaderHTML);

 // Show the loader
 const loaderElement = document.getElementById(loaderId);
 const loaderModal = new bootstrap.Modal(loaderElement);
 loaderModal.show();

 return loaderElement;
}

function validateForm() {
 return new Promise(async (resolve, reject) => {
  try {
   // Validate supplier ID - must exist and have a valid ID (a > 0)
   if (typeof sltd_ba_obj === 'undefined' ||
    sltd_ba_obj === null ||
    !sltd_ba_obj.a ||
    Number(sltd_ba_obj.a) <= 0) {
    alert('Please select a valid supplier/party');
    resolve(false);
    return;
   }

   // Validate bill date format (YYYY-MM-DD)
   const billDate = getBillFormElement('#billDate').value;
   if (!billDate || billDate.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(billDate)) {
    alert('Please select a valid date in YYYY-MM-DD format');
    resolve(false);
   }

   // Validate bill number (non-empty)
   const billNo = getBillFormElement('#billNo').value;
   if (!billNo || billNo.trim() === '') {
    alert('Please enter bill number');
    resolve(false);
   }

   // Note: Duplicate bill check is now handled by checkDuplicateBillNumber function
   // and the add item button will be disabled if duplicate exists

   // Validate bill amount (positive number)
   const billAmount = parseFloat(getBillFormElement('#billAmount').value);
   if (isNaN(billAmount) || billAmount <= 0) {
    alert('Please enter a valid positive bill amount');
    resolve(false);
   }

   // Validate items - must have at least one item
   if (itemsData.length === 0) {
    alert('Please add at least one item');
    resolve(false);
   }

   // Validate each item
   for (const item of itemsData) {
    if (!item.itemName || item.itemName.trim() === '') {
     alert('All items must have a name');
     resolve(false);
    }
    if (isNaN(item.purchasePrice) || item.purchasePrice < 0) {
     alert('All items must have a valid positive purchase price');
     resolve(false);
    }
    if (isNaN(item.salesPrice) || item.salesPrice < 0) {
     alert('All items must have a valid positive sales price');
     resolve(false);
    }
    if (isNaN(item.quantityReceived) || item.quantityReceived < 1) {
     alert('Quantity cannot be 0');
     resolve(false);
    }
   }

   // If all validations pass
   resolve(true);
  } catch (error) {
   showToast("Error saving item: " + error.message);
   resolve(false);
  }
 });
}

async function showItemNameDropdown(inputElement) {
 // Close any existing dropdown
 const existingDropdown = document.querySelector('.item-dropdown');
 if (existingDropdown) {
  existingDropdown.remove();
 }

 // Get the input position
 const rect = inputElement.getBoundingClientRect();

 // Create dropdown container
 const dropdown = document.createElement('div');
 dropdown.className = 'item-dropdown dropdown-menu show';

 // Position dropdown below the input
 dropdown.style.position = 'absolute';
 dropdown.style.top = `${rect.bottom + window.scrollY}px`;
 dropdown.style.left = `${rect.left + window.scrollX}px`;
 dropdown.style.width = `${rect.width}px`;
 dropdown.style.maxHeight = '300px';
 dropdown.style.overflowY = 'auto';

 try {
  // Get items from database
  const i_ba_tems = await dbDexieManager.getAllRecords(dbnm, "s");

  // Filter items based on input value
  const searchValue = inputElement.value.toLowerCase();
  let filteredItems = i_ba_tems;

  if (searchValue) {
   filteredItems = i_ba_tems.filter(item =>
    item.gn.toLowerCase().includes(searchValue))
    .sort((a, b) => {
     // Sort by match position and length
     const aIndex = a.gn.indexOf(searchValue);
     const bIndex = b.gn.indexOf(searchValue);
     if (aIndex !== bIndex) return aIndex - bIndex;
     return a.gn.length - b.gn.length;
    });
  } else {
   // Sort by most used when no search term
   filteredItems = [...i_ba_tems].sort((a, b) => {
    return (mostUsed_ba_Items[b.a] || 0) - (mostUsed_ba_Items[a.a] || 0);
   }).slice(0, 20); // Limit to top 20 items
  }

  // Add items to dropdown
  filteredItems.forEach(item => {
   const itemElement = document.createElement('a');
   itemElement.className = 'dropdown-item';
   itemElement.href = '#';
   itemElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.gu || 'https://cdn-icons-png.freepik.com/512/13543/13543330.png'}" 
                         class="me-2" style="width: 40px; height: 40px; object-fit: cover; border-radius: 3px;"
                         onerror="this.src='https://cdn-icons-png.freepik.com/512/13543/13543330.png'">
                    <div style="flex: 1; min-width: 0;">
                        <div class="fw-bold text-truncate" title="${item.gn}">${item.gn}</div>
                        <small class="text-muted">${item.ba_f} [₹${item.k}] - ${item.ba_g}</small>
                    </div>
                </div>
            `;

   itemElement.addEventListener('click', (e) => {
    e.preventDefault();
    // Select the item 
    document.getElementById('modalItemName').value = item.gn;
    document.getElementById('modalItemThumbnail').value = item.h || '';
    document.getElementById('modalItemImage').value = item.gu || '';

    // Show item ID
    document.getElementById('modalItemIdDisplay').style.display = 'block';
    document.getElementById('modalItemIdValue').textContent = item.g;

    // Update character counter
    updateItemNameCounter(document.getElementById('modalItemName'));

    // Track usage
    mostUsed_ba_Items[item.a] = (mostUsed_ba_Items[item.a] || 0) + 1;

    // Close dropdown
    dropdown.remove();
   });

   dropdown.appendChild(itemElement);
  });

  if (filteredItems.length > 0) {
   document.body.appendChild(dropdown);
  }

  // Close dropdown when clicking outside
  const clickHandler = (e) => {
   if (!dropdown.contains(e.target) && e.target !== inputElement) {
    dropdown.remove();
    document.removeEventListener('click', clickHandler);
   }
  };

  setTimeout(() => {
   document.addEventListener('click', clickHandler);
  }, 100);

 } catch (error) {
  console.error("Error loading items:", error);
 }
}

function commonFnToRunAfter_ba_ViewCall(...args) {
 if (args[1] === 1) {
  sltd_ba_obj = args[0];

  console.log('commonFnToRunAfter_ba_ViewCall called with:', args[0]);
  console.log('currentBillModalElement:', currentBillModalElement);

  // Try multiple ways to find the supplier_nm element
  let s_upplier_nm = null;

  // Method 1: Use our helper function
  s_upplier_nm = getBillFormElement('#supplier_nm');
  console.log('Method 1 - getBillFormElement result:', s_upplier_nm);

  // Method 2: Direct search in current modal
  if (!s_upplier_nm && currentBillModalElement) {
   s_upplier_nm = currentBillModalElement.querySelector('#supplier_nm');
   console.log('Method 2 - currentBillModalElement querySelector result:', s_upplier_nm);
  }

  // Method 3: Search in any visible modal
  if (!s_upplier_nm) {
   const visibleModals = document.querySelectorAll('.modal.show');
   for (let modal of visibleModals) {
    s_upplier_nm = modal.querySelector('#supplier_nm');
    if (s_upplier_nm) break;
   }
   console.log('Method 3 - visible modals search result:', s_upplier_nm);
  }

  // Method 4: Global search
  if (!s_upplier_nm) {
   s_upplier_nm = document.querySelector('#supplier_nm');
   console.log('Method 4 - global search result:', s_upplier_nm);
  }

  if (s_upplier_nm) {
   s_upplier_nm.innerHTML = `<strong>Selected:</strong> ${args[0].h} / ${args[0].i}`;
   console.log('Successfully updated supplier name');
  } else {
   console.error('Supplier name element not found after all search methods');
   // Create the element if it doesn't exist
   createSupplierNameElement(args[0]);
  }

  // Enable add item button when party is selected (in case it was disabled from duplicate check)
  enableAddItemButton();
 }
}

// Fallback function to create supplier name element if not found
function createSupplierNameElement(supplierData) {
 console.log('Creating supplier name element as fallback');

 // Try to find a logical place to insert the supplier info
 const possibleContainers = [
  currentBillModalElement,
  document.querySelector('.bill-inward-form'),
  document.querySelector('.card-body'),
  document.getElementById(g_targetDivId)
 ];

 for (let container of possibleContainers) {
  if (container) {
   const supplierDiv = document.createElement('div');
   supplierDiv.id = 'supplier_nm';
   supplierDiv.className = 'alert alert-info';
   supplierDiv.innerHTML = `<strong>Selected:</strong> ${supplierData.h} / ${supplierData.i}`;

   // Try to insert at the top of the container
   if (container.firstChild) {
    container.insertBefore(supplierDiv, container.firstChild);
   } else {
    container.appendChild(supplierDiv);
   }

   console.log('Created supplier name element in container:', container);
   break;
  }
 }
}

// Updated applyStyles function with card-specific styles
function applyStyles() {
 const style = document.createElement('style');
 style.textContent = `.new-item-display{background-color:#fff3cd!important;border-left:4px solid #ffc107!important;color:#856404!important}.new-item-display span{color:#856404!important;font-style:italic}.item-id-display{padding:8px 12px;border-radius:4px;margin-bottom:15px;font-size:14px}.item-id-display span{font-weight:700}.bill-inward-form{font-family:Arial,sans-serif;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:8px;box-shadow:0 2px 4px rgb(0 0 0 / .1)}.toggle-remark{font-size:.75rem;padding:.125rem .25rem}.item-card{cursor:pointer;transition:transform 0.2s ease-in-out,box-shadow 0.2s ease-in-out}.item-card:hover{transform:translateY(-2px);box-shadow:0 4px 8px rgb(0 0 0 / .15)}.item-card .card-header{padding:.5rem .75rem}.item-card .card-body{padding:.75rem}.item-card .item-actions{opacity:1}.item-card .item-actions .btn{padding:.125rem .375rem;font-size:.75rem}.item-card .card-title{font-size:.9rem;line-height:1.2}.item-card .item-details{font-size:.8rem}.item-card img{height:80px;object-fit:cover}.item-dropdown-item{display:flex;align-items:center;padding:8px 10px;cursor:pointer;border-bottom:1px solid #eee}.item-dropdown-item:hover{background-color:#f5f5f5}.item-dropdown-item img{width:55px;height:55px;object-fit:cover;margin-right:10px;border-radius:3px}.item-dropdown-item .item-name{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}@media (max-width:768px){.item-card .col-4{width:30%}.item-card .col-8{width:70%}}@media (max-width:576px){.col-md-6{width:100%}}`;

 document.head.appendChild(style);
}
