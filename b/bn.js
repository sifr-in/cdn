async function set_add_itm_nw_innerHTML(...params) {
const modal = create_modal_dynamically('modal_for_new_item');
const modalContent = modal.contentElement;
const modalInstance = modal.modalInstance;

 modalContent.innerHTML = `
    <div class="modal-header">
      <h5 class="modal-title">Add New Item</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <form id="addItemForm">
        <div class="mb-3">
          <label for="new_item_nm" class="form-label">Item Name</label>
          <textarea 
            class="form-control" 
            id="new_item_nm" 
            rows="3" 
            placeholder="Enter item name (multiple lines allowed)"
            required>${params[0] || ""}</textarea>
        </div>
        
        <div class="row mb-3">
          <div class="col-12">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                checked
                id="exclude_from_stock_chk"
                value="1"
                style="border: 2px solid #007bff !important;">
              <label class="form-check-label" for="exclude_from_stock_chk">
                Ignore from stock checking
              </label>
            </div>
          </div>
        </div>
        
        <div class="row mb-3">
          <div class="col-4">
            <label for="new_item_prc" class="form-label">Price</label>
          </div>
          <div class="col-8">
            <input 
              type="number" 
              class="form-control" 
              id="new_item_prc" 
              placeholder="Enter price" 
              step="0.01" 
              min="0"
              required>
          </div>
        </div>
        
        <div class="row mb-3">
          <div class="col-4">
            <label for="new_item_url" class="form-label">URL</label>
          </div>
          <div class="col-8">
            <input 
              type="url" 
              class="form-control" 
              id="new_item_url" 
              placeholder="Enter URL (max 256 characters)" 
              maxlength="256"
              required>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <div class="d-flex gap-2 w-100">
        <button 
          type="button" 
          class="btn btn-primary flex-fill" 
          id="item_add_btn"
          onclick="addItemToAPI()">
          <i class="fas fa-plus me-2"></i>Add Item
        </button>
        <button 
          type="button" 
          class="btn btn-outline-secondary flex-fill" 
          id="item_add_with_stock_btn"
          onclick="addItemsWithStock()">
          <i class="fas fa-boxes me-2"></i>Add with Stock
        </button>
      </div>
    </div>
  `;

 // Add keyboard navigation and set focus to price input
 setupKeyboardNavigation();
 setFocusToPriceInput();
 modalInstance.show();
}
function addItemsWithStock(){
/*const modal = document.getElementById('modal_for_new_item');
  if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }*/
(async () => { await loadExecFn('open_bil_inward','open_bil_inward',['loader',1,'not_existing_container','handl_op_rspons',0],'loader','https://cdn.jsdelivr.net/gh/sifr-in/cdn@9cd8935/b/ba.min.js',[]); })()
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
     // Move to next input or button
     const nextIndex = (index + 1) % inputs.length;
     inputs[nextIndex].focus();
    }
   }
  });
 });
}

function setFocusToPriceInput() {
 // Set focus to price input field after a small delay to ensure modal is fully rendered
 setTimeout(() => {
  const priceInput = document.getElementById('new_item_prc');
  if (priceInput) {
   priceInput.focus();
  }
 }, 999);
}

async function addItemToAPI() {
 const itemName = document.getElementById('new_item_nm').value;
 const itemPrice = document.getElementById('new_item_prc').value;
 const itemUrl = document.getElementById('new_item_url').value;

 var p = { e: itemName, g: itemUrl };
 var s = { d: document.getElementById('exclude_from_stock_chk').checked ? 111 : 0, k: itemPrice };
 payload0.p = p;
 payload0.s = s;
 payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'c', "col": 'b', "cl": "b" }, { "tb": 'b', "col": 'b', "cl": "b" }, { "tb": 'i', "col": 'b', "cl": "b" }, { "tb": 'r', "col": 'b', "cl": "b" }, { "tb": 'be', "col": 'eb', "cl": "eb" }, { "tb": 'ba', "col": 'b', "cl": "b" }, { "tb": 'p', "col": 'b', "cl": "b" }, { "tb": 's', "col": 'b', "cl": "b" }]);
 payload0.vw = 1;
 payload0.fn = 2;
 const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
 if (response.su == 1) {
  handl_op_rspons(response, 0);
      const modal = document.getElementById('modal_for_new_item');
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
// Wait a bit for the database to update and modal to close
    setTimeout(async () => {
      // Refresh items from database
      items = await dbDexieManager.getAllRecords(dbnm, "s") || [];
      
      // Set the item name in the main form
      const itemNameInput = document.getElementById('itemName');
      if (itemNameInput) {
        itemNameInput.value = itemName;
        
        // Find the newly added item in the refreshed items array
        const newItem = items.find(item => item.gn === itemName);
        if (newItem) {
          // Select the item programmatically (simulate dropdown selection)
          selectItem(newItem);
          
          // Optional: Show success message
          showToast('Item added successfully and selected!');
        } else {
          // Fallback: just set the name and let user select manually
          itemNameInput.focus();
          showToast('Item added successfully! Please select it from dropdown.');
        }
      }
    }, 1000);

 } else {
  alert(response.ms);
 }

}
