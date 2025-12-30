let p_bn_arams = [];
async function set_add_itm_nw_innerHTML(...params) {
 p_bn_arams = params;
 const modal = create_modal_dynamically('modal_for_new_item');
 const modalContent = modal.contentElement;
 const modalInstance = modal.modalInstance;

 const maxLength = window[my1uzr.worknOnPg]?.confg?.itmNameMxLength || 16;

 modalContent.innerHTML = `<div class="modal-header">
<h5 class="modal-title">Add New Item in our list</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body">
<form id="addItemForm">
<div class="mb-3">
<label for="new_item_nm" class="form-label">Item Name</label>
<textarea class="form-control" id="new_item_nm" style="background-color: bisque;" rows="3" placeholder="Enter item name (multiple lines allowed)"
maxlength="${maxLength}" required>${params[0] || ""}</textarea>
<div class="form-text text-end">
<span id="itemNameCounter">${params[0] ? params[0].length : 0}</span> / ${maxLength} characters
</div>
</div>

<div class="row mb-3">
<div class="col-12">
<div class="form-check">
<input class="form-check-input" type="checkbox" checked id="exclude_from_stock_chk" value="1"
style="border: 2px solid #007bff !important;">
<label class="form-check-label" for="exclude_from_stock_chk">
Ignore from stock checking
</label>
</div>
</div>
</div>

<div class="row mb-3">
<div class="col-12">
<label for="new_item_prc" class="form-label">Price of single unit</label>
</div>
<div class="col-12">
<input type="number" class="form-control" id="new_item_prc" placeholder="Enter price" step="0.01" min="0" required>
</div>
</div>

<div class="row mb-3" style="display:none;">
<div class="col-12">
<label for="new_item_url" class="form-label">Link of Image of product / service</label>
</div>
<div class="col-12">
<input type="url" class="form-control" id="new_item_url" placeholder="Enter URL (max 256 characters)"
maxlength="256" required>
</div>
</div>
</form>
</div>
<div class="modal-footer">
<div class="d-flex gap-2 w-100">
<button type="button" class="btn btn-primary flex-fill" id="item_add_btn" onclick="addItemToAPI()">
<i class="fas fa-plus me-2"></i>Add Item
</button>
<button type="button" class="btn btn-outline-secondary flex-fill" id="item_add_with_stock_btn" style="display:none;" onclick="addItemsWithStock()">
<i class="fas fa-boxes me-2"></i>Add with Stock
</button>
</div>
</div>
`;

 setupKeyboardNavigation();
 setFocusToPriceInput();

 setupItemNameCounter();
 modalInstance.show();
}

function addItemsWithStock() {
 (async () => {
  await loadExe2Fn(10, ['loader', 1, 'not_existing_container', 'handl_op_rspons', 0], [1]);
 })()
}

function setupKeyboardNavigation() {
 const form = document.getElementById('addItemForm');
 const inputs = form.querySelectorAll('input, textarea, button');

 inputs.forEach((input, index) => {
  input.addEventListener('keydown', (e) => {
   if (e.key === 'Enter') {
    e.preventDefault();

    if (input.type === 'button' || input.tagName === 'BUTTON') {
     input.click();
    } else {
     const nextIndex = (index + 1) % inputs.length;
     inputs[nextIndex].focus();
    }
   }
  });
 });
}

function setFocusToPriceInput() {
 setTimeout(() => {
  const priceInput = document.getElementById('new_item_prc');
  if (priceInput) {
   priceInput.focus();
  }
 }, 999);
}

function setupItemNameCounter() {
 const textarea = document.getElementById('new_item_nm');
 const counter = document.getElementById('itemNameCounter');
 const maxLength = window[my1uzr.worknOnPg]?.confg?.itmNameMxLength || 16;

 if (textarea && counter) {
  textarea.addEventListener('input', function () {
   counter.textContent = this.value.length;

   if (this.value.length > maxLength * 0.8) {
    counter.classList.add('text-warning');
    counter.classList.remove('text-danger');
   } else {
    counter.classList.remove('text-warning', 'text-danger');
   }

   if (this.value.length >= maxLength) {
    counter.classList.add('text-danger');
    counter.classList.remove('text-warning');
   }
  });

  counter.textContent = textarea.value.length;

  if (textarea.value.length > maxLength * 0.8) {
   counter.classList.add('text-warning');
  }
  if (textarea.value.length >= maxLength) {
   counter.classList.add('text-danger');
   counter.classList.remove('text-warning');
  }
 }
}

async function addItemToAPI() {
 const itemName = document.getElementById('new_item_nm').value;
 const itemPrice = parseFloat(document.getElementById('new_item_prc').value);
 const itemUrl = document.getElementById('new_item_url').value;

 const maxLength = window[my1uzr.worknOnPg]?.confg?.itmNameMxLength || 16;

 // Validate item name length
 if (itemName.length > maxLength) {
  alert(`Item name must be ${maxLength} characters or less. Current: ${itemName.length} characters`);
  document.getElementById('new_item_nm').focus();
  return;
 }

 // Validate price is greater than -1
 if (itemPrice < 0 || isNaN(itemPrice)) {
  alert('Price must be 0 or greater');
  document.getElementById('new_item_prc').focus();
  return;
 }

 var p = { e: itemName, g: itemUrl };
 var s = {
  d: document.getElementById('exclude_from_stock_chk').checked ? 111 : 0,
  k: itemPrice
 };
 payload0.p = p;
 payload0.s = s;
 payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'c', "col": 'b', "cl": "b" }, { "tb": 'b', "col": 'b', "cl": "b" }, { "tb": 'i', "col": 'b', "cl": "b" }, { "tb": 'r', "col": 'b', "cl": "b" }, { "tb": 'be', "col": 'eb', "cl": "eb" }, { "tb": 'ba', "col": 'b', "cl": "b" }, { "tb": 'p', "col": 'b', "cl": "b" }, { "tb": 's', "col": 'b', "cl": "b" }]);
 payload0.vw = 1;
 payload0.fn = 2;
 const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
 if (response.su == 1) {
  handl_op_rspons(response, 0);
  setTimeout(async () => {
   let fn176Name = p_bn_arams[1] || "";
   if (typeof window[fn176Name] === 'function') {
    window[fn176Name](itemName);
   }
  }, 1000);
  const modal = document.getElementById('modal_for_new_item');
  if (modal) {
   const modalInstance = bootstrap.Modal.getInstance(modal);
   if (modalInstance) {
    modalInstance.hide();
   }
  }
 } else {
  alert(response.ms);
 }
}
