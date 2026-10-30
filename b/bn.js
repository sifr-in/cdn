let p_bn_arams = [];

function bnInjectCompactStyles() {
 if (window.__bnNewItemCssInjected) return;
 window.__bnNewItemCssInjected = true;
 const style = document.createElement('style');
 style.id = 'bnNewItemCompactCss';
 style.textContent = `
#modal_for_new_item .modal-dialog{
max-width: 430px;
}
#modal_for_new_item #modal_for_new_item_modal_content_body{
padding: .4rem;
}
#modal_for_new_item .modal-body > .modal-body{
padding: .15rem 0 .3rem;
}
#modal_for_new_item .modal-header{
padding: .45rem .55rem;
}
#modal_for_new_item .modal-footer{
padding: .45rem 0 0;
border-top: 1px solid #dee2e6;
}
#modal_for_new_item .form-label{
font-size: .82rem;
margin-bottom: .15rem;
}
#modal_for_new_item .form-text{
font-size: .7rem;
}
#modal_for_new_item #new_item_nm{
min-height: 48px;
font-size: .9rem;
}
#modal_for_new_item .input-group-text{
font-size: .72rem;
padding: .2rem .4rem;
}
#modal_for_new_item .modal-footer .btn{
padding: .35rem .6rem;
font-size: .82rem;
}
`;
 document.head.appendChild(style);
}

async function set_add_itm_nw_innerHTML(...params) {
 p_bn_arams = params;
 const modal = create_modal_dynamically('modal_for_new_item');
 const modalContent = modal.contentElement;
 const modalInstance = modal.modalInstance;
 const modalElement = modal.modalElement;

 const modalDialog = modalElement.querySelector('.modal-dialog');
 if (modalDialog) {
     modalDialog.style.marginTop = '80px';
 }

 const maxLength = window[my1uzr.worknOnPg]?.confg?.itmNameMxLength || 16;

 bnInjectCompactStyles();

 modalContent.innerHTML = `<div class="modal-header">
<h5 class="modal-title">Add New Item in our list</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body p-3">
<form id="addItemForm">
<div class="row g-0 mb-2">
<label for="bn_c_dtls_lient" class="form-label">Party Details</label>
<div class="col-12">
<div class="input-group">
<input id="bn_c_dtls_lient" type="text" class="form-control border border-dark" readonly onclick="(async () => { await loadExe2Fn(14, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_bn_PartyCall', 1], [1]); })()" placeholder="Select Party">
<button class="btn btn-outline-danger border border-dark" type="button" id="bn_clr_party" onclick="document.getElementById('bn_c_dtls_lient').value='';document.getElementById('bn_partyId').value='';" title="Clear Party"><i class="fas fa-times"></i></button>
<input type="hidden" id="bn_partyId">
</div>
</div>
</div>
<div class="mb-2">
<label for="new_item_nm" class="form-label">Item Name</label>
<textarea class="form-control border border-dark" id="new_item_nm" style="background-color: bisque;" rows="2" placeholder="Enter item name (multiple lines allowed)"
maxlength="${maxLength}" required>${params[0] || ""}</textarea>
<div class="form-text text-end">
<span id="itemNameCounter">${params[0] ? params[0].length : 0}</span> / ${maxLength} characters
</div>
</div>

<div class="row mb-2">
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

<div class="row mb-2">
<div class="col-12">
<label for="new_item_prc" class="form-label">Price of single unit</label>
</div>
<div class="col-12">
<input type="number" class="form-control border border-dark" id="new_item_prc" placeholder="Enter price" step="0.01" min="0" required>
</div>
</div>

<div class="row g-0 mb-2 mt-1" id="bnTaxRow">
<div class="col-6">
<div class="input-group input-group-sm">
<span class="input-group-text border border-dark">Tax 1 %</span>
<input type="text" inputmode="decimal" autocomplete="off" class="form-control border border-dark" id="new_item_tax1" placeholder="0.00" value="" onfocus="this.select();">
</div>
</div>
<div class="col-6">
<div class="input-group input-group-sm">
<span class="input-group-text border border-dark">Tax 2 %</span>
<input type="text" inputmode="decimal" autocomplete="off" class="form-control border border-dark" id="new_item_tax2" placeholder="0.00" value="" onfocus="this.select();">
</div>
</div>
</div>

<div class="row mb-3" style="display:none;">
<div class="col-12">
<label for="new_item_url" class="form-label">Link of Image of product / service</label>
</div>
<div class="col-12">
<input type="url" class="form-control border border-dark" id="new_item_url" placeholder="Enter URL (max 256 characters)"
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

 // hideTax = 1 -> keep the tax values/math, just don't show the two inputs.
 if (typeof window.taxDisplayHidden === 'function' && window.taxDisplayHidden()) {
  const taxRow = document.getElementById('bnTaxRow');
  if (taxRow) taxRow.style.display = 'none';
 }

 setupKeyboardNavigation();
 setFocusToPriceInput();

 setupItemNameCounter();
 setupNewItemTaxInputs();
 modalInstance.show();
}

function bnRoundToTwo(value) {
 return Math.round((Number(value) || 0) * 100) / 100;
}

// Tax inputs accept 0-99.99 only: two integer digits, two decimals, digits and
// a single dot while typing. A comma decimal (locale keypads) is read as a dot.
function bnSanitizeTaxText(raw) {
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

function bnSanitizeTaxField(input) {
 if (!input) return;
 const next = bnSanitizeTaxText(input.value);
 if (input.value !== next) input.value = next;
}

function bnNormalizeTaxField(input) {
 if (!input) return;
 const number = parseFloat(input.value);
 const safe = Number.isFinite(number) ? Math.min(99.99, Math.max(0, number)) : 0;
 input.value = bnRoundToTwo(safe).toFixed(2);
}

function bnReadTaxPercent(input) {
 if (!input) return 0;
 const number = parseFloat(input.value);
 if (!Number.isFinite(number) || number < 0) return 0;
 return bnRoundToTwo(Math.min(99.99, number));
}

function bnGetTaxValues() {
 return {
  tax1: bnReadTaxPercent(document.getElementById('new_item_tax1')),
  tax2: bnReadTaxPercent(document.getElementById('new_item_tax2'))
 };
}

function setupNewItemTaxInputs() {
 ['new_item_tax1', 'new_item_tax2'].forEach(function (id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener('input', function () {
   bnSanitizeTaxField(input);
  });
  input.addEventListener('blur', function () {
   bnNormalizeTaxField(input);
  });
 });
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
  window.showelsemodal(`Item name must be ${maxLength} characters or less. Current: ${itemName.length} characters`);
  document.getElementById('new_item_nm').focus();
  return;
 }

 // Validate price is greater than -1
 if (itemPrice < 0 || isNaN(itemPrice)) {
  window.showelsemodal('Price must be 0 or greater');
  document.getElementById('new_item_prc').focus();
  return;
 }

 bnNormalizeTaxField(document.getElementById('new_item_tax1'));
 bnNormalizeTaxField(document.getElementById('new_item_tax2'));
 const bnTax = bnGetTaxValues();

 var p = { e: itemName, g: itemUrl, j: bnTax.tax1, k: bnTax.tax2 };
 var s = {
  d: document.getElementById('exclude_from_stock_chk').checked ? 111 : 0,
  e: document.getElementById('bn_partyId').value || 0,
  k: itemPrice,
 };
 await clearPayload0();
 payload0.p = p;
 payload0.s = s;
 var laTables = [{ "tb": 'c', "col": 'b', "cl": "b" }, { "tb": 'b', "col": 'b', "cl": "b" }, { "tb": 'i', "col": 'b', "cl": "b" }, { "tb": 'r', "col": 'b', "cl": "b" }, { "tb": 'ba', "col": 'b', "cl": "b" }, { "tb": 'p', "col": 'b', "cl": "b" }, { "tb": 's', "col": 'b', "cl": "b" }];
 if (typeof showEyeMesuremetsTableInBill !== "undefined" && showEyeMesuremetsTableInBill == 1) {
  laTables.splice(4, 0, { tb: 'be', col: 'eb', cl: 'eb' });
 }
 payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, laTables);
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
  window.showelsemodal(response.ms);
 }
}
function commonFnToRunAfter_bn_PartyCall(obj, swtch) {
 if (swtch === 1) {
  document.getElementById('bn_c_dtls_lient').value = obj.i + " " + obj.h + " " + obj.e;
  document.getElementById('bn_partyId').value = obj.a;
 }
}
window.commonFnToRunAfter_bn_PartyCall = commonFnToRunAfter_bn_PartyCall;