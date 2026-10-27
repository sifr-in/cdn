// shLdItm.js - Add / Update / Delete items module (follows ei.js pattern)
// Owns the add-item modal and the added-item card design.
// Passes built cards to b.js via shared #addedItemsContainer + b.js globals.

let mostUsedItems = {}; // Track item usage
let blurTimeout = null;
let dropdownClicked = false;
let continuousQRMode = false;
let qrScannerActive = false;
let editingCardId = null; // uniqueItemId of card being edited (update mode)

const SERVICE_MODE_STORAGE_KEY = 'addItemServiceMode';

function isServiceModeEnabled() {
  try {
    return localStorage.getItem(SERVICE_MODE_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

// ========== Self-contained styles (same card design as b.js addDropdownStyles) ==========
function shoRegItmInjectStyles() {
  if (window.__shoRegItmCssInjected) return;
  window.__shoRegItmCssInjected = true;
  const style = document.createElement('style');
  style.textContent = `
.row.g-0>[class*="col-"]{
padding-left: 5px;
padding-right: 5px;
}

.added-item-card{
border-left: 4px solid #28a745 !important;
}

.added-item-image{
max-width: 80px;
max-height: 80px;
object-fit: cover;
border-radius: 4px;
}

.added-item-card .form-control-sm{
display: inline-block !important;
height: 24px;
padding: 0 4px;
font-size: .875rem;
margin-left: 4px;
}

.added-item-card .form-control-sm:focus{
border-color: #007bff;
box-shadow: 0 0 0 .2rem rgba(0, 123, 255, .25);
}

.added-item-card .btn-outline-danger.btn-sm,
.added-item-card .btn-outline-primary.btn-sm{
padding: 2px 6px;
font-size: .75rem;
border-width: 1px;
}

.added-item-card .btn-outline-danger.btn-sm:hover{
background-color: #dc3545;
color: #fff;
}

.added-item-card strong{
font-size: .9rem;
margin-right: 4px;
}

[id^="itemPrice-"]{
font-weight: 700;
color: #28a745;
}

#addItemModal .modal-dialog{
max-width: 480px;
}

#addItemModal .modal-body{
padding: .6rem;
}

#addItemModal .modal-header,
#addItemModal .modal-footer{
padding: .5rem .65rem;
}

#addItemModal .modal-footer .btn{
padding: .35rem .65rem;
font-size: .82rem;
}

#addItemModal #modalItemImageContainer img{
max-height: 80px !important;
}

#addItemModal #modalItemDescription{
min-height: 36px;
}

#addItemModal .input-group-text{
font-size: .72rem;
padding: .2rem .4rem;
}

@media (max-width: 768px) {
#addItemModal .modal-dialog,
#addItemModal2 .modal-dialog {
margin-top: 70px;
}
}
`;
  document.head.appendChild(style);
}

// ========== Open modal (loader entry point) ==========
function showAddNormalItemModal(prefill = null) {
  shoRegItmInjectStyles();

  // Create a modal
  const modal = create_modal_dynamically('addItemModal');
  const modalContent = modal.contentElement;
  const modalInstance = modal.modalInstance;

  // Create a clean modal form
  const modalHTML = `
<div class="modal-header">
<h5 class="modal-title">${prefill ? 'Update Item' : 'Add Item to Bill'}</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body border border-dark">
<div class="row">
<!-- Left side - Image (fixed 3 columns) -->
<div class="col-3">
<div class="text-center">
<input type="text"
class="form-control form-control-sm mb-2 border border-dark"
placeholder="Scan or type item ID"
id="modalItemIdInput"
style="font-size: 0.8rem;">

<!-- Continuous QR Mode Switch -->
<div class="form-check form-switch mt-2 mb-2" style="font-size: 0.8rem;">
<input class="form-check-input" type="checkbox" id="modalContinuousQRMode">
<label class="form-check-label" for="modalContinuousQRMode">Continuous Scan</label>
</div>

<!-- Service Mode -->
<div class="form-check mb-2" style="font-size: 0.8rem;">
<input class="form-check-input" type="checkbox" id="modalServiceMode">
<label class="form-check-label" for="modalServiceMode">Service</label>
</div>

<div id="modalItemImageContainer" class="text-center">
<i class="fas fa-image fa-3x text-muted"></i>
<div class="mt-2">
<small class="text-muted">No Image</small>
</div>
</div>
</div>
</div>

<!-- Right side - Details (fixed 9 columns) -->
<div class="col-9">
<!-- Row 1 - Item Name with Add New Button -->
<div class="row mb-2 g-0">
<div class="col-12">
<div style="position:relative;">
<input type="text" class="form-control border border-dark" placeholder="Item Name" id="modalItemName">
</div>
</div>
</div>

<!-- Row 2 - Quantity, Rate, Price (fixed 4-4-4 columns) -->
<div class="row mb-2 g-0">
<div class="col-4">
<input type="number" class="form-control border border-dark" placeholder="Qty" id="modalItemQty" min="1" value="" onfocus="this.select();">
</div>
<div class="col-4">
<input type="number" class="form-control border border-dark" placeholder="Rate" id="modalItemRate" min="0" step="1" onfocus="this.select();">
</div>
<div class="col-4">
<input type="number" class="form-control border border-dark" placeholder="Price" id="modalItemPrice" min="0" step="1" readonly>
</div>
</div>

<!-- Row 3 - Tax 1 and Tax 2 percentages -->
<div class="row mb-2 g-0">
<div class="col-6">
<div class="input-group input-group-sm">
<span class="input-group-text border border-dark">Tax 1 %</span>
<input type="text" inputmode="decimal" autocomplete="off" class="form-control border border-dark" placeholder="0.00" id="modalItemTax1" value="" onfocus="this.select();">
</div>
</div>
<div class="col-6">
<div class="input-group input-group-sm">
<span class="input-group-text border border-dark">Tax 2 %</span>
<input type="text" inputmode="decimal" autocomplete="off" class="form-control border border-dark" placeholder="0.00" id="modalItemTax2" value="" onfocus="this.select();">
</div>
</div>
</div>

<!-- Row 4 - Description and Add Button -->
<div class="row g-0">
<div class="col-12">
<textarea class="form-control border border-dark" placeholder="Description" id="modalItemDescription" rows="1"></textarea>
</div>
</div>
</div>
</div>
</div>
<div class="modal-footer">
<button id="modalAddNewItemBtn" class="btn btn-warning w-100" onclick="handleAddNewItemInModal()" style="display: none;"><i class="fas fa-plus"></i> in inventory</button>
&emsp;&emsp;
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
&emsp;
<button class="btn btn-success h-100" id="modalAddItemBtn" onclick="addItemFromModal()" disabled><i class="fas fa-plus"></i> in bill</button>
</div>
`;

  modalContent.innerHTML = modalHTML;

  // Restore the last Service mode setting
  const modalServiceMode = document.getElementById('modalServiceMode');
  if (modalServiceMode) {
    modalServiceMode.checked = isServiceModeEnabled();
  }

  // Initialize event listeners for the modal - pass the entire modal object
  initializeModalEventListeners(modal);

  // Show the modal
  modalInstance.show();

  // Pre-fill for update mode or focus name field
  setTimeout(() => {
    const modalItemName = document.getElementById('modalItemName');
    if (prefill && modalItemName) {
      modalItemName.value = prefill.name || '';
      if (prefill.itemId) {
        modalItemName.setAttribute('data-item-id', prefill.itemId);
      }
      document.getElementById('modalItemQty').value = prefill.qty || '';
      document.getElementById('modalItemRate').value = prefill.rate || '';
      document.getElementById('modalItemDescription').value = prefill.description || '';

      document.getElementById('modalItemTax1').value = modalTaxClampPercent(prefill.tax1).toFixed(2);
      document.getElementById('modalItemTax2').value = modalTaxClampPercent(prefill.tax2).toFixed(2);

      calculateModalPrice();

      const modalAddItemBtn = document.getElementById('modalAddItemBtn');
      if (modalAddItemBtn) {
        modalAddItemBtn.disabled = false;
        modalAddItemBtn.innerHTML = '<i class="fas fa-save"></i> update';
      }

      // Show item image if available
      const imageContainer = document.getElementById('modalItemImageContainer');
      if (imageContainer && prefill.imageUrl) {
        imageContainer.innerHTML = `
<img src="${prefill.imageUrl}"
class="img-fluid rounded"
alt="Item Image"
style="max-width: 100%; height: auto; max-height: 120px; object-fit: cover;"
onerror="this.style.display='none'; document.getElementById('modalItemImageContainer').innerHTML = '<i class=\\'fas fa-image fa-3x text-muted\\'></i><div class=\\'mt-2\\'><small class=\\'text-muted\\'>No Image</small></div>'">
`;
      }
    } else if (modalItemName) {
      modalItemName.focus();
    }
  }, 100);
}

function initializeModalEventListeners(modalResult) {
  // Get elements from the modal
  const modalItemQty = document.getElementById('modalItemQty');
  const modalItemRate = document.getElementById('modalItemRate');
  const modalItemName = document.getElementById('modalItemName');
  const modalItemIdInput = document.getElementById('modalItemIdInput');
  const modalContinuousQRMode = document.getElementById('modalContinuousQRMode');
  const modalServiceMode = document.getElementById('modalServiceMode');
  const modalItemTax1 = document.getElementById('modalItemTax1');
  const modalItemTax2 = document.getElementById('modalItemTax2');
  const modalAddNewItemBtn = document.getElementById('modalAddNewItemBtn');
  const modalAddItemBtn = document.getElementById('modalAddItemBtn');

  // Safely add modal close event listener
  if (modalResult && modalResult.modalElement) {
    modalResult.modalElement.addEventListener('hidden.bs.modal', function () {
      // Clear any blur timeout
      if (blurTimeout) {
        clearTimeout(blurTimeout);
        blurTimeout = null;
      }
      // Remove any remaining dropdown
      const hidDropdown = document.querySelector('.item-dropdown');
      if (hidDropdown) {
        hidDropdown.remove();
      }
      // Reset edit mode when modal is dismissed without saving
      editingCardId = null;
    });
  }

  if (modalItemQty && modalItemRate) {
    modalItemQty.addEventListener('input', calculateModalPrice);
    modalItemRate.addEventListener('input', calculateModalPrice);
  }

  if (modalItemName) {
    modalItemName.addEventListener('input', function (e) {
      showItemDropdown(this);

      // Show/hide Add New Item button based on search
      const searchValue = this.value.trim();
      if (modalAddNewItemBtn) {
        if (searchValue) {
          const matchedItems = items.filter(item => {
            if (!item || !item.gn) return false;
            return item.gn.toLowerCase().includes(searchValue.toLowerCase());
          });

          if (matchedItems.length === 0) {
            modalAddNewItemBtn.style.display = 'block';
          } else {
            modalAddNewItemBtn.style.display = 'none';
          }
        } else {
          modalAddNewItemBtn.style.display = 'none';
        }
      }
    });

    modalItemName.addEventListener('focus', function (e) {
      showItemDropdown(this);
    });

    modalItemName.addEventListener('blur', function (e) {
      const inputElement = this;

      if (blurTimeout) {
        clearTimeout(blurTimeout);
      }

      dropdownClicked = false;

      blurTimeout = setTimeout(() => {
        if (dropdownClicked) {
          dropdownClicked = false;
          return;
        } else {
          handleModalItemNameBlur(inputElement);
        }
      }, 200);
    });
  }

  if (modalItemIdInput) {
    modalItemIdInput.addEventListener('input', handleModalItemIdInput);
    modalItemIdInput.addEventListener('click', async function () {
      if (modalContinuousQRMode && modalContinuousQRMode.checked && qrScannerActive) {
        showToast('Continuous scan already active');
        return;
      }
      await openQRScannerModal();
    });
  }

  if (modalContinuousQRMode) {
    modalContinuousQRMode.addEventListener('change', function (e) {
      continuousQRMode = e.target.checked;
      localStorage.setItem('continuousQRMode', continuousQRMode ? 'true' : 'false');

      if (continuousQRMode) {
        showToast('Continuous scan mode enabled');
      }
    });
  }

  if (modalServiceMode) {
    modalServiceMode.addEventListener('change', function (e) {
      try {
        localStorage.setItem(SERVICE_MODE_STORAGE_KEY, e.target.checked ? 'true' : 'false');
      } catch (err) {
        console.warn('Unable to save Service mode:', err);
      }
    });
  }

  [modalItemTax1, modalItemTax2].forEach(function (input) {
    if (!input) return;
    input.addEventListener('input', function () {
      modalSanitizeTaxField(input);
      updateModalAddButtonState();
    });
    input.addEventListener('blur', function () {
      modalNormalizeTaxField(input);
    });
  });

  // Enable/disable add button based on form validity
  if (modalItemName && modalAddItemBtn) {
    modalItemName.addEventListener('input', function () {
      updateModalAddButtonState();
    });

    modalItemRate.addEventListener('input', function () {
      updateModalAddButtonState();
    });
  }

  if (modalItemRate) {
    modalItemRate.addEventListener('input', function () {
      calculateModalPrice();
      updateModalAddButtonState(); // Add this line
    });
  }
}

function modalSanitizeTaxText(raw) {
  let value = String(raw == null ? '' : raw).replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const firstDot = value.indexOf('.');
  if (firstDot !== -1) {
    value = value.slice(0, firstDot + 1) + value.slice(firstDot + 1).replace(/\./g, '');
  }
  const parts = value.split('.');
  const intPart = (parts[0] || '').slice(0, 2);
  const decPart = parts.length > 1 ? parts[1].slice(0, 2) : '';
  return parts.length > 1 ? intPart + '.' + decPart : intPart;
}

function modalSanitizeTaxField(input) {
  if (!input) return;
  const next = modalSanitizeTaxText(input.value);
  if (input.value !== next) input.value = next;
}

function modalNormalizeTaxField(input) {
  if (!input) return;
  const number = parseFloat(input.value);
  const safe = Number.isFinite(number) ? Math.min(99.99, Math.max(0, number)) : 0;
  input.value = roundToTwo(safe).toFixed(2);
}

function modalTaxClampPercent(value) {
  const number = parseFloat(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.min(99.99, roundToTwo(number));
}

function roundToTwo(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

// Tax 1 / Tax 2 percentages for a stock row (`g` -> product `p.j` / `p.k`)
// or a product-shaped row (rates stored directly on `j` / `k`).
function modalRatesFor(item) {
  if (typeof window.productTaxRates === 'function') {
    return window.productTaxRates(item);
  }
  const hasStockProductId = item && item.g != null && String(item.g).trim() !== '' && Number.isFinite(Number(item.g));
  const isProductRow = item && !hasStockProductId && Number.isFinite(parseFloat(item.j));
  return {
    tax1: modalTaxClampPercent(isProductRow ? item.j : (item && item.tax1)),
    tax2: modalTaxClampPercent(isProductRow ? item.k : (item && item.tax2))
  };
}

function getModalTaxValues() {
  return {
    tax1: modalTaxClampPercent(document.getElementById('modalItemTax1')?.value),
    tax2: modalTaxClampPercent(document.getElementById('modalItemTax2')?.value)
  };
}

function getModalTaxAmounts() {
  const { tax1, tax2 } = getModalTaxValues();
  const price = parseFloat(document.getElementById('modalItemPrice')?.value) || 0;
  if (typeof window.itemTaxAmounts === 'function') {
    return Object.assign({ tax1: tax1, tax2: tax2 }, window.itemTaxAmounts(tax1, tax2, price));
  }
  const tax1Amount = roundToTwo((price * tax1) / 100);
  const tax2Amount = roundToTwo((price * tax2) / 100);
  return { tax1: tax1, tax2: tax2, tax1Amount: tax1Amount, tax2Amount: tax2Amount, taxAmount: roundToTwo(tax1Amount + tax2Amount) };
}

function calculateModalPrice() {
  const qty = parseFloat(document.getElementById('modalItemQty').value) || 1;
  const rate = parseFloat(document.getElementById('modalItemRate').value) || 0;
  const price = qty * rate;
  document.getElementById('modalItemPrice').value = price.toFixed(2);

  // Update add button state
  updateModalAddButtonState();
}

function updateModalAddButtonState() {
  const modalAddItemBtn = document.getElementById('modalAddItemBtn');
  if (!modalAddItemBtn) return;

  const name = document.getElementById('modalItemName').value.trim();
  const price = parseFloat(document.getElementById('modalItemPrice').value) || 0;
  const itemId = document.getElementById('modalItemName').getAttribute('data-item-id');

  // Check if item exists in inventory
  const itemExistsInInventory = checkIfItemExists(name);

  // Enable button only if:
  // 1. Name is not empty
  // 2. Price > 0
  // 3. Item exists in inventory OR we have a valid item ID
  // 4. Item has a valid ID (either from existing item or newly created)
  if (name && price > 0 && (itemExistsInInventory || itemId)) {
    modalAddItemBtn.disabled = false;
  } else {
    modalAddItemBtn.disabled = true;
  }
}

// Helper function to check if item exists in inventory
function checkIfItemExists(itemName) {
  if (!itemName.trim()) return false;

  const searchName = itemName.toLowerCase().trim();

  // Check if exact match exists in items array
  const matchedItems = items.filter(item => {
    if (!item || !item.gn) return false;
    return item.gn.toLowerCase() === searchName;
  });

  return matchedItems.length > 0;
}

function handleModalItemNameBlur(inputElement) {
  const itemName = inputElement.value.trim();
  const modalAddNewItemBtn = document.getElementById('modalAddNewItemBtn');

  if (itemName === '') {
    clearModalItemForm();
    if (modalAddNewItemBtn) modalAddNewItemBtn.style.display = 'none';
    // Update button state
    updateModalAddButtonState();
    return;
  }

  const matchedItems = items.filter(item => {
    if (!item || !item.gn) return false;
    return item.gn.toLowerCase() === itemName.toLowerCase();
  });

  if (matchedItems.length !== 1) {
    // Clear the data-item-id attribute since item doesn't exist
    inputElement.removeAttribute('data-item-id');
    if (modalAddNewItemBtn) modalAddNewItemBtn.style.display = 'block';
  } else {
    // Exactly one match found
    if (modalAddNewItemBtn) modalAddNewItemBtn.style.display = 'none';
    // Set the item ID attribute
    const previousId = inputElement.getAttribute('data-item-id');
    inputElement.setAttribute('data-item-id', matchedItems[0].a);

    // Typing a full name (no dropdown click) should still surface that item's
    // Tax 1 / Tax 2 instead of leaving the previous item's rates behind.
    if (String(previousId) !== String(matchedItems[0].a)) {
      const presetRates = modalRatesFor(matchedItems[0]);
      const tax1Input = document.getElementById('modalItemTax1');
      const tax2Input = document.getElementById('modalItemTax2');
      if (tax1Input) tax1Input.value = modalTaxClampPercent(presetRates.tax1).toFixed(2);
      if (tax2Input) tax2Input.value = modalTaxClampPercent(presetRates.tax2).toFixed(2);
    }
  }

  // Always update button state after name blur
  updateModalAddButtonState();
}

function clearModalItemForm() {
  document.getElementById('modalItemName').value = '';
  document.getElementById('modalItemName').removeAttribute('data-item-id');
  document.getElementById('modalItemQty').value = '';
  document.getElementById('modalItemRate').value = '';
  document.getElementById('modalItemPrice').value = '';
  document.getElementById('modalItemDescription').value = '';
  document.getElementById('modalItemIdInput').value = '';
  document.getElementById('modalItemTax1').value = '';
  document.getElementById('modalItemTax2').value = '';

  const imageContainer = document.getElementById('modalItemImageContainer');
  if (imageContainer) {
    imageContainer.innerHTML = `
<i class="fas fa-image fa-3x text-muted"></i>
<div class="mt-2">
<small class="text-muted">No Image</small>
</div>
`;
  }

  const modalAddItemBtn = document.getElementById('modalAddItemBtn');
  if (modalAddItemBtn) {
    modalAddItemBtn.disabled = true;
  }
}

function handleModalItemIdInput(event) {
  const itemId = event.target.value.trim();

  if (itemId === '') {
    const existingDropdown = document.querySelector('.item-id-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
    }
    return;
  }

  const matchedItems = items.find((c) => c.a.toString() == itemId);

  const existingDropdown = document.querySelector('.item-id-dropdown');
  if (existingDropdown) {
    existingDropdown.remove();
  }

  if (!matchedItems) {
    showToast('No items found with this ID');

    if (continuousQRMode && qrScannerActive) {
      event.target.value = '';
    }
  } else {
    if (window[my1uzr.worknOnPg]?.confg?.addByQR == 1) {
      addItemDirectlyFromQR(matchedItems);
      event.target.value = '';

      window.lastQRScannedItemAdded = true;
      window.lastQRScannedItemId = matchedItems.a;

      // Close the modal after adding via QR
      const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
      if (modal) {
        modal.hide();
      }
    } else {
      selectModalItem(matchedItems);
      event.target.value = '';

      window.lastQRScannedItemAdded = true;
      window.lastQRScannedItemId = matchedItems.a;
    }
  }
}

function selectModalItem(item) {
  const presetRates = modalRatesFor(item);

  document.getElementById('modalItemName').value = item.gn;
  document.getElementById('modalItemRate').value = item.k;
  document.getElementById('modalItemQty').value = '';
  const tax1Input = document.getElementById('modalItemTax1');
  const tax2Input = document.getElementById('modalItemTax2');
  if (tax1Input) tax1Input.value = modalTaxClampPercent(presetRates.tax1).toFixed(2);
  if (tax2Input) tax2Input.value = modalTaxClampPercent(presetRates.tax2).toFixed(2);

  // Set the data-item-id attribute
  document.getElementById('modalItemName').setAttribute('data-item-id', item.a);

  calculateModalPrice();

  const imageContainer = document.getElementById('modalItemImageContainer');
  if (imageContainer && item.gu) {
    imageContainer.innerHTML = `
<img src="${getGoogleDriveImageUrl(item.gu)}"
class="img-fluid rounded"
alt="Item Image"
style="max-width: 100%; height: auto; max-height: 120px; object-fit: cover;"
onerror="this.style.display='none'; document.getElementById('modalItemImageContainer').innerHTML = '<i class=\\'fas fa-image fa-3x text-muted\\'></i><div class=\\'mt-2\\'><small class=\\'text-muted\\'>No Image</small></div>'">
`;
  }

  mostUsedItems[item.a] = (mostUsedItems[item.a] || 0) + 1;

  const modalAddNewItemBtn = document.getElementById('modalAddNewItemBtn');
  if (modalAddNewItemBtn) modalAddNewItemBtn.style.display = 'none';

  // Update button state
  updateModalAddButtonState();

  setTimeout(() => {
    document.getElementById('modalItemQty').focus();
  }, 10);
}

async function handleAddNewItemInModal(nwProdNm = '') {
  // Get the value from modal if not provided
  if (!nwProdNm) {
    nwProdNm = document.getElementById('modalItemName').value.trim();
  }

  // Close the dropdown in modal
  const dropdown = document.querySelector('.item-dropdown');
  if (dropdown) {
    dropdown.remove();
  }

  // Then open the add item modal
  await loadExe2Fn(11, [nwProdNm, "handleNewItmAddedToInventory"], [1]);
}
function handleNewItmAddedToInventory(nwItmNm) {
  try {
    const itemName = nwItmNm.trim();
    // 2. Find the item in items array (case-insensitive)
    const findItem = () => {
      return items.find(item => {
        if (!item || !item.gn) return false;
        return item.gn.toLowerCase() === itemName.toLowerCase();
      });
    };

    let foundItem = findItem();

    if (!foundItem) {
      // If not found immediately, wait a bit and try again (item might have just been added)
      setTimeout(() => {
        // Refresh items array if needed
        if (typeof dbDexieManager !== 'undefined') {
          dbDexieManager.getAllRecords(dbnm, "s").then(async (refreshedItems) => {
            items = refreshedItems || [];
            if (typeof window.refreshItemsWithTax === 'function') {
              try { await window.refreshItemsWithTax(); } catch (e) { console.warn('refreshItemsWithTax failed', e); }
            }
            const retryItem = findItem();

            if (retryItem) {
              // Simulate a dropdown click event to add the item
              selectModalItem(retryItem);
              addItemFromModal();
            } else {
              showToast(`Item "${itemName}" not found in inventory`);
            }
          }).catch(error => {
            console.error('Error refreshing items:', error);
            showToast('Error searching for item');
          });
        }
      }, 1000);
      return;
    }

    // 3. Use the existing function to add the item
    selectModalItem(foundItem);
    addItemFromModal();
    updateBillSectionsVisibility();

  } catch (error) {
    console.error('Error in handleNewItmAddedToInventory:', error);
    showToast('Error adding new inventory item to bill');
  }
}

// Build the added-item card HTML (same design as b.js addItemToSaleList + pencil button)
function buildAddedItemCardHTML(opts) {
  const {
    uniqueItemId,
    itemId,
    name,
    qty,
    rate,
    price,
    description,
    imageUrl,
    tax1 = 0,
    tax2 = 0,
    tax1Amount = null,
    tax2Amount = null,
    subName = ''
  } = opts;

  const safeTax1 = modalTaxClampPercent(tax1);
  const safeTax2 = modalTaxClampPercent(tax2);
  const safeTax1Amount = tax1Amount == null
    ? roundToTwo((price * safeTax1) / 100)
    : Math.max(0, parseFloat(tax1Amount) || 0);
  const safeTax2Amount = tax2Amount == null
    ? roundToTwo((price * safeTax2) / 100)
    : Math.max(0, parseFloat(tax2Amount) || 0);
  const safeTaxAmount = roundToTwo(safeTax1Amount + safeTax2Amount);
  const safeTaxPercent = price > 0
    ? roundToTwo((safeTaxAmount / price) * 100)
    : roundToTwo(safeTax1 + safeTax2);
  const taxRatesLabel = (typeof window.itemTaxRatesLabel === 'function')
    ? window.itemTaxRatesLabel(safeTax1, safeTax2)
    : (safeTax1 + safeTax2).toFixed(2) + '%';

  return `
<div class="card mb-3 added-item-card" id="invoiceItem-${uniqueItemId}" data-item-id="${itemId}" data-item-rate="${rate}" data-item-subname="${String(subName || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}" data-item-tax1="${safeTax1.toFixed(2)}" data-item-tax2="${safeTax2.toFixed(2)}" data-item-tax1-amount="${safeTax1Amount.toFixed(2)}" data-item-tax2-amount="${safeTax2Amount.toFixed(2)}" data-item-tax-percent="${safeTaxPercent.toFixed(2)}" data-item-tax-amount="${safeTaxAmount.toFixed(2)}">
<div class="card-body">
<div class="row">
<!-- Left side - Image (fixed 3 columns) -->
<div class="col-3">
<div class="text-center">
${`<img src="${imageUrl || 'https://cdn-icons-png.freepik.com/512/13543/13543330.png'}" class="added-item-image" alt="Item Image"
onerror="this.src='https://cdn-icons-png.freepik.com/512/13543/13543330.png'">`}
</div>
</div>

<!-- Right side - Details (fixed 9 columns) -->
<div class="col-9">
<!-- Row 1 - Item Name -->
<div class="row mb-2 g-0">
<div class="col-10">
<strong>${name}</strong>
</div>
<div class="col-2 d-flex align-items-center justify-content-end">
<button class="btn btn-outline-primary btn-sm me-1" onclick="editItemInModal(${uniqueItemId})">
<i class="fas fa-pencil"></i>
</button>
<button class="btn btn-outline-danger btn-sm" onclick="removeItemFromInvoice(${uniqueItemId})">
<i class="fas fa-trash"></i>
</button>
</div>
</div>

<!-- Row 2 - Quantity, Rate, Price (fixed 4-4-4 columns) -->
<div class="row mb-2 g-0">
<div class="col-4">
<strong>Qty:</strong>
<input type="number"
class="form-control form-control-sm d-inline-block w-auto"
value="${qty}"
min="1"
step="1"
style="width: 70px; display: inline-block;"
onchange="updateItemQuantity(${uniqueItemId}, parseFloat(this.value))"
onblur="updateItemQuantity(${uniqueItemId}, parseFloat(this.value))">
</div>
<div class="col-4">
<strong>Rate:</strong>
<input type="number"
class="form-control form-control-sm d-inline-block w-auto"
value="${rate.toFixed(2)}"
min="0"
step="0.01"
style="width: 80px; display: inline-block;"
onchange="updateItemRate(${uniqueItemId}, this.value)"
onblur="updateItemRate(${uniqueItemId}, this.value)">
</div>
<div class="col-4">
<strong>Price:</strong> ₹<span id="itemPrice-${uniqueItemId}">${price.toFixed(2)}</span>
<span class="item-tax-line" style="display:block;color:#6c757d;font-size:.75rem;">Tax: ₹<span id="itemTax-${uniqueItemId}">${safeTaxAmount.toFixed(2)}</span> (<span id="itemTaxRates-${uniqueItemId}">${taxRatesLabel}</span>)</span>
</div>
</div>

<!-- Row 3 - Description -->
<div class="row g-0">
<div class="col-12">
<small class="text-muted">${description || ''}</small>
</div>
</div>
</div>
</div>
</div>
</div>
`;
}

function addItemFromModal() {
  // Get values from modal
  const name = document.getElementById('modalItemName').value.trim();
  const qty = parseInt(document.getElementById('modalItemQty').value) || 1;
  const rate = parseFloat(document.getElementById('modalItemRate').value) || 0;
  const price = parseFloat(document.getElementById('modalItemPrice').value) || 0;
  const description = document.getElementById('modalItemDescription').value;
  const itemId = document.getElementById('modalItemName').getAttribute('data-item-id');
  const imageUrl = document.querySelector('#modalItemImageContainer img')?.src || '';

  const taxValues = getModalTaxAmounts();

  // Validation
  if (!name) {
    showToast('Please enter item name');
    document.getElementById('modalItemName').focus();
    return;
  }

  if (!price || parseFloat(price) <= 0) {
    showToast('Please enter a valid price');
    document.getElementById('modalItemRate').focus();
    return;
  }

  const addedItemsContainer = document.getElementById('addedItemsContainer');

  if (editingCardId !== null) {
    // ===== Update mode: replace the edited card in place =====
    const card = document.getElementById('invoiceItem-' + editingCardId);
    if (card) {
      const preservedSubName = card.getAttribute('data-item-subname') || '';
      card.outerHTML = buildAddedItemCardHTML({
        uniqueItemId: editingCardId,
        itemId: itemId,
        name: name,
        qty: qty,
        rate: rate,
        price: price,
        description: description,
        imageUrl: imageUrl,
        tax1: taxValues.tax1,
        tax2: taxValues.tax2,
        tax1Amount: taxValues.tax1Amount,
        tax2Amount: taxValues.tax2Amount,
        subName: preservedSubName
      });
      showToast(`${name} updated`);
    }
    editingCardId = null;
  } else {
    // ===== Add mode =====

    // Service mode keeps every item on its own line
    const serviceMode = document.getElementById('modalServiceMode')?.checked === true;

    // Check if item already exists in sale list with same rate and tax
    const existingCard = serviceMode ? null : findExistingItemInSaleList(itemId, rate, taxValues);

    if (existingCard) {
      // Item exists with same rate - increment quantity
      incrementItemQuantity(existingCard, qty);
      showToast(`Quantity increased for ${name}`);
    } else {
      // Add new item
      const uniqueItemId = Date.now();
      addedItemsContainer.insertAdjacentHTML('beforeend', buildAddedItemCardHTML({
        uniqueItemId: uniqueItemId,
        itemId: itemId,
        name: name,
        qty: qty,
        rate: rate,
        price: price,
        description: description,
        imageUrl: imageUrl,
        tax1: taxValues.tax1,
        tax2: taxValues.tax2,
        tax1Amount: taxValues.tax1Amount,
        tax2Amount: taxValues.tax2Amount
      }));
    }
  }

  // Close the modal immediately after adding
  try {
    const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
    if (modal) modal.hide();
  } catch (e) { console.warn('addItemFromModal: failed to close modal', e); }

  // Pass to b.js: update bill summary + section visibility (must not block closing)
  // Each step is isolated so a failure in one can never freeze the totals.
  try { updateBillSummary(); } catch (e) { console.warn('addItemFromModal: updateBillSummary failed', e); }
  try { updateBillSectionsVisibility(); } catch (e) { console.warn('addItemFromModal: updateBillSectionsVisibility failed', e); }

  try { playSound('https://cdn.pixabay.com/download/audio/2025/10/21/audio_3880ed67e2.mp3'); } catch (e) {}
}

// Open modal pre-filled with the card's current values (update flow)
function editItemInModal(uniqueItemId) {
  const card = document.getElementById('invoiceItem-' + uniqueItemId);
  if (!card) return;

  editingCardId = uniqueItemId;

  const nameEl = card.querySelector('strong');
  const numberInputs = card.querySelectorAll('input[type="number"]');
  const descriptionEl = card.querySelector('.text-muted');
  const imgEl = card.querySelector('img');

  showAddNormalItemModal({
    name: nameEl ? nameEl.textContent : '',
    itemId: card.getAttribute('data-item-id') || '',
    qty: numberInputs[0] ? numberInputs[0].value : '',
    rate: numberInputs[1] ? numberInputs[1].value : '',
    description: descriptionEl ? descriptionEl.textContent : '',
    imageUrl: imgEl ? imgEl.src : '',
    tax1: modalTaxClampPercent(card.getAttribute('data-item-tax1')),
    tax2: modalTaxClampPercent(card.getAttribute('data-item-tax2'))
  });
}

// Helper functions used by addItemFromModal

// Find an already-added card with same item ID, rate, and tax
function findExistingItemInSaleList(itemId, rate, taxValues) {
  if (!itemId) return null;

  const tax1 = modalTaxClampPercent(taxValues && taxValues.tax1);
  const tax2 = modalTaxClampPercent(taxValues && taxValues.tax2);

  const addedCards = document.querySelectorAll('#addedItemsContainer .added-item-card');
  for (const card of addedCards) {
    const cardItemId = card.getAttribute('data-item-id');
    const cardRate = parseFloat(card.getAttribute('data-item-rate')) || 0;
    const cardTax1 = modalTaxClampPercent(card.getAttribute('data-item-tax1'));
    const cardTax2 = modalTaxClampPercent(card.getAttribute('data-item-tax2'));

    if (
      cardItemId === itemId.toString() &&
      Math.abs(cardRate - rate) < 0.001 &&
      Math.abs(cardTax1 - tax1) < 0.001 &&
      Math.abs(cardTax2 - tax2) < 0.001
    ) {
      return card;
    }
  }

  return null;
}

// Increment quantity on an existing card and refresh its price
function incrementItemQuantity(card, qtyToAdd) {
  const numberInputs = card.querySelectorAll('input[type="number"]');
  const qtyInput = numberInputs[0];
  const rateInput = numberInputs[1];
  if (!qtyInput) return;

  const newQty = (parseInt(qtyInput.value) || 0) + qtyToAdd;
  qtyInput.value = newQty;

  const rate = parseFloat(rateInput ? rateInput.value : 0) || 0;
  const newPrice = newQty * rate;
  const priceSpan = card.querySelector('span[id^="itemPrice-"]');
  if (priceSpan) {
    priceSpan.textContent = newPrice.toFixed(2);
  }

  let tax1 = modalTaxClampPercent(card.getAttribute('data-item-tax1'));
  let tax2 = modalTaxClampPercent(card.getAttribute('data-item-tax2'));
  if (!card.hasAttribute('data-item-tax1') && !card.hasAttribute('data-item-tax2')) {
    tax1 = modalTaxClampPercent(card.getAttribute('data-item-tax-percent'));
    tax2 = 0;
  }

  const tax1Amount = roundToTwo((newPrice * tax1) / 100);
  const tax2Amount = roundToTwo((newPrice * tax2) / 100);
  const taxAmount = roundToTwo(tax1Amount + tax2Amount);
  card.setAttribute('data-item-tax1-amount', tax1Amount.toFixed(2));
  card.setAttribute('data-item-tax2-amount', tax2Amount.toFixed(2));
  card.setAttribute('data-item-tax-amount', taxAmount.toFixed(2));
  card.setAttribute('data-item-tax-percent', (newPrice > 0 ? roundToTwo((taxAmount / newPrice) * 100) : roundToTwo(tax1 + tax2)).toFixed(2));

  const uniqueItemId = card.id.replace('invoiceItem-', '');
  const taxAmountEl = document.getElementById(`itemTax-${uniqueItemId}`);
  const taxRatesEl = document.getElementById(`itemTaxRates-${uniqueItemId}`);
  if (taxAmountEl) taxAmountEl.textContent = taxAmount.toFixed(2);
  if (taxRatesEl) {
    taxRatesEl.textContent = (typeof window.itemTaxRatesLabel === 'function')
      ? window.itemTaxRatesLabel(tax1, tax2)
      : (tax1 + tax2).toFixed(2) + '%';
  }
}

// Open QR scanner modal (delegates to the shared scanner in b.js)
async function openQRScannerModal() {
  if (typeof window.my1OpenQRScanner !== 'function') {
    showToast('QR scanner is currently unavailable. Please enter the item ID manually.');
    return;
  }
  try {
    qrScannerActive = true;
    await window.my1OpenQRScanner({
      isContinuous: function () {
        const sw = document.getElementById('modalContinuousQRMode');
        return !!(sw && sw.checked);
      },
      onDecode: function (text) {
        const input = document.getElementById('modalItemIdInput');
        if (!input) return;
        input.value = text;
        handleModalItemIdInput({ target: { value: text } });
        input.value = '';
      },
      onClose: function () { qrScannerActive = false; }
    });
  } finally {
    qrScannerActive = false;
  }
}

// ========== Public API (ei.js pattern) ==========
window.showAddNormalItemModal = showAddNormalItemModal;
window.addItemFromModal = addItemFromModal;
window.selectModalItem = selectModalItem;
window.handleAddNewItemInModal = handleAddNewItemInModal;
window.handleNewItmAddedToInventory = handleNewItmAddedToInventory;
window.editItemInModal = editItemInModal;

console.log("📂 shLdItm.js loaded");