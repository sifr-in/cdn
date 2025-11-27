let items = [];
let prods = [];
let clientReferrerArray = [];
let stored_bill = [];
let stored_eye_msrmnt = [];
let stored_bill_items = [];
let stored_bill_cash_info = [];

let mostUsedItems = {}; // Track item usage
let receivedAmounts = []; // Track received payments

let blurTimeout = null;
let dropdownClicked = false;

// Global variables for bill management
let billTableRowId = 0;
let billSelectedToUpdate = null;
let globalBill = {};
let globalItems = [];
let globalCashInfo = [];

async function set_bill_innerHTML(...params) {
 try {
  items = await dbDexieManager.getAllRecords(dbnm, "s") || [];
  prods = await dbDexieManager.getAllRecords(dbnm, "p") || [];
  clientReferrerArray = [];//   clientReferrerArray = await dbDexieManager.getAllRecords(dbnm, "c");
  stored_bill = await dbDexieManager.getAllRecords(dbnm, "b") || [];
  stored_eye_msrmnt = await dbDexieManager.getAllRecords(dbnm, "be") || [];
  stored_bill_items = await dbDexieManager.getAllRecords(dbnm, "i") || [];
  stored_bill_cash_info = await dbDexieManager.getAllRecords(dbnm, "r") || [];
 } catch (error) {
  console.error("Initialization failed:", error);
  showToast("Initialization error - please refresh");
 }

 const c_ontainer_blank_main = document.getElementById(params[0]);
 c_ontainer_blank_main.innerHTML = `
<div class="container-fluid">
<!-- First Row - 4 columns -->
<div class="row g-0">
<div class="col-2">
<div class="input-group">
<input type="text" class="form-control" placeholder="Invoice Number" id="invoiceNumber">
</div>
</div>
<div class="col-2 d-flex align-items-center">
<button class="btn btn-outline-secondary" onclick="showBillCards()" style="margin:0px;">
<i class="fas fa-eye"></i>
</button>
<button id="fileUploadTesting" class="btn btn-outline-secondary" onclick="temporary()" style="margin:0px;display:none;">
<i class="fas fa-eye"></i>
</button>
</div>
<div class="col-4">
<input type="text" class="form-control" id="receiptDate" placeholder="Select Date & Time">
</div>
<div class="col-4">
<input type="text" class="form-control" id="deliveryDate" placeholder="Select Date & Time">
</div>
</div>

<!-- Second Row - 2 read-only columns -->
<div class="row g-0 mb-3">
<div class="col-6">
<input id="c_dtls_lient" type="text" class="form-control" readonly onclick="(async () => { await loadExe2Fn(14, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_op_ViewCall', 1], [1]); })()" placeholder="Customer Details">
<input type="hidden" id="clientId">
</div>
<div class="col-6">
<input id="r_dtls_eferrer" type="text" class="form-control" readonly onclick="(async () => { await loadExe2Fn(14, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_op_ViewCall', 2], [1]); })()" placeholder="Referrer details">
<input type="hidden" id="referrerId">
</div>
</div>

<!-- Items Container -->
<div class="row">
<div class="col-12">
<div id="billItemsContainer" class="mb-3">
<!-- Items will be added here dynamically -->
</div>
</div>
</div>

<!-- Blank Item Card Template -->
<div class="card mb-3" id="blankItemCard">
<div class="card-body">
<div class="row">
<!-- Left side - Image (fixed 3 columns) -->
<div class="col-3">
<div class="text-center">
<input type="text" 
class="form-control form-control-sm mb-2" 
placeholder="Scan or type item ID" 
id="itemIdInput"
style="font-size: 0.8rem;">
<div id="itemImageContainer" class="text-center">
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
<div class="col-10">
<input type="text" class="form-control" placeholder="Item Name" id="itemName">
</div>
<div class="col-2 d-flex align-items-center" onclick="handleAddNewItem(document.getElementById('itemName').value)" title="Add New Item">
<i class="fas fa-plus"></i>
</div>
</div>

<!-- Row 2 - Quantity, Rate, Price (fixed 4-4-4 columns) -->
<div class="row mb-2 g-0">
<div class="col-4">
<input type="number" class="form-control" placeholder="Qty" id="itemQty" min="1" value="1">
</div>
<div class="col-4">
<input type="number" class="form-control" placeholder="Rate" id="itemRate" min="0" step="1">
</div>
<div class="col-4">
<input type="number" class="form-control" placeholder="Price" id="itemPrice" min="0" step="1" readonly>
</div>
</div>

<!-- Row 3 - Description and Add Button (fixed 10-2 columns) -->
<div class="row g-0">
<div class="col-10">
<textarea class="form-control" placeholder="Description" id="itemDescription" rows="2"></textarea>
</div>
<div class="col-2 d-flex align-items-center">
<button id="btn_ad_itm_to_invoice" class="btn btn-success btn-sm" onclick="addItemToInvoice()">
<i class="fas fa-plus"></i>
</button>
</div>
</div>
</div>
</div>
</div>
</div>

<!-- Added Items Section -->
<div class="row">
<div class="col-12">
<h5>Added Items</h5>
<div id="addedItemsContainer">
<!-- Added items will appear here -->
</div>
</div>
</div>

<!-- Bill Summary Section -->
<div class="row mt-4">
<div class="col-12">
<div class="card">
<div class="card-header bg-light">
<h5 class="mb-0">Bill Summary</h5>
</div>
<div class="card-body">
<div class="row">
<div class="col-3">
<strong>Itms:</strong>
<span id="totalItems">0</span>
</div>
<div class="col-4">
<strong>Qty:</strong>
<span id="totalQuantity">0</span>
</div>
<div class="col-5">
<strong>Tot:</strong>
₹<span id="totalPrice">0.00</span>
</div>
</div>

<!-- Discount and Final Amount in One Line -->
<div class="row mt-2 align-items-end">
<div class="col-3">
<div class="input-group input-group-sm">
<span class="input-group-text" style="padding:1px;">Di%</span>
<input type="number" 
class="form-control" 
id="discountPercentage" 
min="0" 
max="100" 
step="0.1"
placeholder="0.00"
value="0">
</div>
</div>
<div class="col-4">
<div class="input-group input-group-sm">
<span class="input-group-text" style="padding:1px;">Di₹</span>
<input type="number" 
class="form-control" 
id="discountAmount" 
min="0" 
step="1"
placeholder="0.00"
value="0">
</div>
</div>
<div class="col-5">
<div class="input-group input-group-sm">
<span class="input-group-text bg-success text-white">₹</span>
<input type="number" 
class="form-control bg-success text-white" 
id="finalAmount"
min="0" 
step="1"
value="0.00"
style="font-weight: bold;">
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<!-- Received Amounts Section -->
<div class="row mt-4">
<div class="col-12">
<div class="card">
<div class="card-header bg-light">
<h5 class="mb-0">Received Amounts</h5>
</div>
<div class="card-body">
<!-- Add Received Amount Card -->
<div class="card mb-3" id="addReceivedAmountCard">
<div class="row align-items-end g-2">
<!-- Date & Time - col-4 -->
<div class="col-4">
<label class="form-label small text-muted mb-1">Date</label>
<input type="text" class="form-control form-control-sm" id="receivedDateTime" placeholder="Select Date & Time">
</div>

<!-- Amount - col-4 -->
<div class="col-4">
<label class="form-label small text-muted mb-1">Rcvd Amt.</label>
<input type="number" class="form-control form-control-sm" placeholder="Amount" id="receivedAmount" min="0" step="1">
</div>

<!-- Payment Type - col-2 -->
<div class="col-2">
<label class="form-label small text-muted mb-1">Type</label>
<select class="form-control form-control-sm" id="paymentType">
<option value="0">Select</option>
<option value="1">Cash</option>
<option value="2">Cheque</option>
<option value="3">Card</option>
<option value="4">UPI</option>
<option value="5">Bank Transfer</option>
</select>
</div>

<!-- Add Button - col-2 -->
<div class="col-2">

<button class="btn btn-primary btn-sm" onclick="addReceivedAmount()">
<i class="fas fa-plus"></i>
</button>
</div>
</div>
</div>

<!-- Added Received Amounts -->
<div id="addedReceivedAmountsContainer">
<!-- Received amounts will appear here -->
</div>

<!-- Grand Total Summary -->
<div class="row mt-4">
<div class="col-12">
<div class="card border-success">
<div class="card-body bg-light">
<div class="row text-center">
<div class="col-4">
<h6>Total</h6>
<h4 class="text-primary">₹<span id="grandBillTotal">0.00</span></h4>
</div>
<div class="col-4">
<h6>Rcvd</h6>
<h4 class="text-success">₹<span id="grandTotalReceived">0.00</span></h4>
</div>
<div class="col-4">
<h6>Bal</h6>
<h4 class="text-danger">₹<span id="grandBalance">0.00</span></h4>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<div class="row mt-4">
<div class="col-12">
<div id="blankDivSection1">
<!-- This div is intentionally left blank for future use -->
</div>
</div>
</div>

<!-- Action Buttons Row -->
<div class="row mt-4">
<div class="col-12">
<div class="card">
<div class="card-body">
<textarea class="form-control" id="billNotes" rows="3" placeholder="Add any notes or comments for this bill..."></textarea>
</div>
</div>
<div class="card">
<div class="card-body">
<div class="row g-2">
<div class="col-4">
<button id="saveBtn" class="btn btn-success w-100" onclick="crUpBill(3)">
<i class="fas fa-save me-2"></i>Save
</button>
</div>
<div class="col-4">
<button class="btn btn-warning w-100" id="updateBtn" onclick="crUpBill(7)" disabled>
<i class="fas fa-edit me-2"></i>Updt
</button>
</div>
<div class="col-4">
<!-- <button class="btn btn-info w-100" id="printBtn" disabled onclick='printBill(billTableRowId)'></button> -->
<button class="btn btn-info w-100" id="printBtn" disabled onclick='window.open("bPrOp.html?b=" + billTableRowId)'>
<i class="fas fa-print me-2"></i>Print
</button>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
  `;

 // Initialize dates with current date and time
 initializeFlatpickr();

 // Add event listeners
 document.getElementById('itemQty').addEventListener('input', calculatePrice);
 document.getElementById('itemRate').addEventListener('input', calculatePrice);

 document.getElementById('itemName').addEventListener('input', function (e) {
  // Show dropdown when user starts typing
  showItemDropdown(this);
  // if (this.value.length > 0) {
  //     showItemDropdown(this);
  // }
 });

 document.getElementById('itemName').addEventListener('focus', function (e) {
  const inputRect = this.getBoundingClientRect();
  const scrollTopPosition = window.pageYOffset + inputRect.top - 10;
  window.scrollTo({ top: scrollTopPosition, behavior: 'smooth' });
  // Show dropdown with all items when focused (empty search)
  showItemDropdown(this);
 });

 // Add event listener for item ID input
 document.getElementById('itemIdInput').addEventListener('input', handleItemIdInput);
 document.getElementById('itemIdInput').addEventListener('click', openQRScanner);

 // Add event listeners for discount calculations
 document.getElementById('discountPercentage').addEventListener('input', calculateDiscountFromPercentage);
 document.getElementById('discountAmount').addEventListener('input', calculateDiscountFromAmount);
 document.getElementById('finalAmount').addEventListener('input', calculateDiscountFromFinalAmount);

 document.getElementById('itemName').addEventListener('blur', function (e) {
  const inputElement = this;

  // Clear any existing timeout
  if (blurTimeout) {
   clearTimeout(blurTimeout);
  }

  // Set a flag to track if dropdown was clicked
  dropdownClicked = false;

  // Delay the blur handling to see if dropdown item gets clicked
  blurTimeout = setTimeout(() => {
   // If dropdown was clicked, don't proceed with blur validation
   if (dropdownClicked) {
    dropdownClicked = false; // Reset for next time
    return;
   }

   // Otherwise, proceed with blur validation
   handleItemNameBlur(inputElement);
  }, 200); // 200ms delay - enough time for click to register
 });

 // Initialize received amount form
 initializeReceivedAmountForm();

 // Add dynamic styles for the dropdown
 addDropdownStyles();

 // Set max bill number
 setMaxBillNo();

 disablePrintButton();
 disableUpdateButton();
 enableSaveBtn();

 if (typeof billingRequisit_be === 'function') {
  billingRequisit_be();
 }
}
function printBill(billTableRowId) {
 if (!billTableRowId || billTableRowId === 0) {
  showToast('Please save the bill first before printing');
  return;
 }

 const modal = create_modal_dynamically('bill_print_modal');
 const modalContent = modal.contentElement;
 const modalInstance = modal.modalInstance;

 // Use the URL with parameters directly in iframe src
 const printUrl = `https://sifr-in.github.io/cdn/b/bPrOp.html?b=${billTableRowId}&flPath=/${appOwner.eo}/b/&dbName=my1_in_${appOwner.tn}`;

 modalContent.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Print Bill #${billTableRowId}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-0">
            <div class="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
                <button class="btn btn-primary btn-sm" onclick="printIframeContent('billPrintIframe')">
                    <i class="fas fa-print me-2"></i>Print
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="reloadBillIframe(${billTableRowId})">
                    <i class="fas fa-redo me-2"></i>Reload
                </button>
            </div>
            <iframe 
                id="billPrintIframe" 
                src="${printUrl}" 
                style="width: 100%; height: 70vh; border: none;"
                onload="onBillIframeLoad(this)"
                onerror="onBillIframeError(this)"
            ></iframe>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    `;

 modalInstance.show();
}

// Helper function to print iframe content
function printIframeContent(iframeId) {
 const iframe = document.getElementById(iframeId);
 if (iframe && iframe.contentWindow) {
  try {
   iframe.contentWindow.print();
  } catch (error) {
   console.error('Print error:', error);
   showToast('Print failed. Please try reloading the bill.');
  }
 } else {
  showToast('Cannot access print content');
 }
}

// Helper function to reload iframe with current bill ID
function reloadBillIframe(billTableRowId) {
 const iframe = document.getElementById('billPrintIframe');
 if (iframe) {
  // Add timestamp to avoid caching
  iframe.src = `https://sifr-in.github.io/cdn/b/bPrOp.html?b=${billTableRowId}&flPath=/${appOwner.eo}/b/&dbName=my1_in_${appOwner.tn}`;
  showToast('Bill reloaded');
 }
}

// Callback when iframe loads successfully
function onBillIframeLoad(iframe) {
 console.log('Bill print iframe loaded successfully');
 // You can add additional logic here when iframe loads
}

// Callback when iframe fails to load
function onBillIframeError(iframe) {
 console.error('Bill print iframe failed to load');
 showToast('Failed to load bill. The bill print page might be unavailable.');
}

async function showBillCards() {
 const modal = create_modal_dynamically('bill_cards_container');
 const b_ill_cards_container = modal.contentElement;
 const m_odalInstance = modal.modalInstance;
 // Clear previous cards
 b_ill_cards_container.innerHTML = `
  <div class="modal-header">
    <h5 class="modal-title">Search Bills</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="modal-body">
    <div class="input-group mb-3">
      <input type="text" class="form-control" id="bill_op_search" placeholder="Search by bill no, Mobile, Name...">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
    </div>
    <div id="billCardsContainer" class="row g-3"></div>
  </div>
`;

 // Create a variable to store the filtered bills
 let filteredBills = stored_bill;

 // Search function
 const performSearch = (searchTerm) => {
  if (!searchTerm.trim()) {
   filteredBills = stored_bill;
  } else {
   const term = searchTerm.toLowerCase().trim();
   filteredBills = stored_bill.filter(bill => {
    return (
     (bill.g && bill.g.toString().toLowerCase().includes(term)) || // Bill number
     (bill.ee && bill.ee.toString().toLowerCase().includes(term)) || // Phone
     (bill.eh && bill.eh.toLowerCase().includes(term)) || // First name
     (bill.ei && bill.ei.toLowerCase().includes(term)) || // Last name
     (bill.em && bill.em.toString().toLowerCase().includes(term)) // em field
    );
   });
  }
  renderBillCards(filteredBills);
 };

 // Add search event listener
 document.getElementById('bill_op_search').addEventListener('input', function (e) {
  performSearch(e.target.value);
 });

 // Make sure we have client data
 if (!clientReferrerArray || clientReferrerArray.length === 0) {
  try {
   clientReferrerArray = await dbDexieManager.getAllRecords(dbnm, "c") || [];
  } catch (error) {
   console.error("Error loading client data:", error);
   showToast("Error loading client data");
   b_ill_cards_container.innerHTML = "<p class='text-danger'>Error loading client data</p>";
   modal_bill_cards.style.display = "block";
   return;
  }
 }

 if (stored_bill.length === 0) {
  document.getElementById('billCardsContainer').innerHTML = "<p class='text-muted text-center py-4'>No bills found</p>";
  modal_bill_cards.style.display = "block";
  return;
 }

 stored_bill.sort((a, b) => {
  const dateA = new Date(a.b);
  const dateB = new Date(b.b);
  return dateB - dateA;
 });

 // Create a map for faster client lookup
 const clientMap = new Map();
 clientReferrerArray.forEach(client => {
  clientMap.set(client.a, client);
 });

 // Join client data to bills
 stored_bill.forEach(bill => {
  const client = clientMap.get(bill.e) || {};

  // Add client fields to bill object
  bill.ee = client.e; // phone
  bill.ef = client.f; // ?
  bill.eh = client.h; // first name
  bill.ei = client.i; // last name
  bill.el = client.l; // ?
  bill.em = client.m; // ?
 });

 // Function to render bill cards
 function renderBillCards(billsToRender) {
  const container = document.getElementById('billCardsContainer');
  container.innerHTML = '';

  if (billsToRender.length === 0) {
   container.innerHTML = "<p class='text-muted text-center py-4'>No bills match your search</p>";
   return;
  }

  billsToRender.forEach(bill => {
   const col = document.createElement("div");
   col.className = "col-12 col-md-6 col-lg-4";

   const card = document.createElement("div");
   card.className = "card bill-card h-100";
   card.dataset.billId = bill.a;

   // Format bill date and time
   const billDate = bill.b ? new Date(bill.b) : null;
   const formattedDateTime = billDate ?
    `${billDate.toLocaleDateString()} ${billDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` :
    'No date';

   // Format client name and mobile
   const clientName = `${bill.eh || ''} ${bill.ei || ''}`.trim() || 'Unknown Client';
   const clientMobile = bill.ee || 'No phone';

   // Card header with dropdown
   const cardHeader = document.createElement("div");
   cardHeader.className = "card-header d-flex justify-content-between align-items-center";
   cardHeader.innerHTML = `
     <div>
       <span class="fw-bold">Bill #${bill.g}</span>
       <br>
       <small class="text-muted">${formattedDateTime}</small>
     </div>
     <div class="dropdown">
       <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
         <i class="bi bi-gear"></i>
       </button>
       <ul class="dropdown-menu">
         <li><button class="dropdown-item text-success" data-action="rcpt"><i class="bi bi-cash-coin"></i> Amount Received</button></li>
         <li><button class="dropdown-item" data-action="view"><i class="bi bi-eye"></i> View Details</button></li>
         <li><button class="dropdown-item" data-action="print"><i class="bi bi-printer"></i> Print Bill</button></li>
         <li><hr class="dropdown-divider"></li>
         <li><button class="dropdown-item text-danger" data-action="del"><i class="bi bi-trash"></i> Delete Bill</button></li>
       </ul>
     </div>
   `;

   // Card body
   const cardBody = document.createElement("div");
   cardBody.className = "card-body";
   cardBody.innerHTML = `
     <div class="mb-2">
       <h6 class="card-title mb-1">${clientName}</h6>
       <p class="card-text mb-1">
         <small class="text-muted">
           <i class="bi bi-telephone"></i> ${clientMobile}
         </small>
       </p>
     </div>
   `;

   // Add click event to card body for temporary alert
   cardBody.addEventListener("click", function (e) {
    // Don't trigger if clicking on dropdown or buttons
    if (!e.target.closest('.dropdown') && !e.target.closest('button')) {
     temporaryAlertFunction(bill.a);
    }
   });

   // Add event listeners to dropdown actions
   const dropdownButtons = cardHeader.querySelectorAll('.dropdown-item');
   dropdownButtons.forEach(button => {
    button.addEventListener("click", function (e) {
     e.stopPropagation();
     const action = this.dataset.action;
     handleBillAction(m_odalInstance, action, bill.a);
    });
   });

   card.appendChild(cardHeader);
   card.appendChild(cardBody);
   col.appendChild(card);
   container.appendChild(col);
  });
 }

 // Initial render
 renderBillCards(filteredBills);
 m_odalInstance.show();
}
window.showBillCards = showBillCards;

async function handleBillAction(m_odalInstance, action, b346illID) {
 billTableRowId = b346illID;
 switch (action) {
  case 'rcpt':
   let s594CurrItems = stored_bill_items.filter(item => item.e == b346illID);
   let c594ashInfo = stored_bill_cash_info.filter(cash => cash.tb == 7 && cash.td == b346illID);
   showAlreadyReceivedAmts(b346illID, s594CurrItems, c594ashInfo);
   break;
  case 'view':
   // Find the selected bill
   let sCurrBill = stored_bill.find(bill => bill.a == b346illID);

   if (!sCurrBill) {
    showToast('Bill not found');
    return;
   }

   // Set global bill ID
   billTableRowId = b346illID;
   billSelectedToUpdate = sCurrBill;

   // Find related items
   let sCurrItems = stored_bill_items.filter(item => item.e == b346illID);

   // Find cash info
   let sCurrCashInfo = stored_bill_cash_info.filter(cash =>
    cash.tb == 7 && cash.td == b346illID
   );

   // Set global variables
   globalBill = sCurrBill;
   globalItems = sCurrItems;
   globalCashInfo = sCurrCashInfo;

   if (typeof billingRequisit_be === 'function') {
    if (typeof setEyeMeasurement === 'function') {
     let sCurrEyeMsrmnt = stored_eye_msrmnt.find(eye => eye.ea == b346illID) || {};
     setEyeMeasurement(sCurrEyeMsrmnt);
    } else {
     alert("setEyeMeasurement function not found; contact admin;");
    }
   }
   // Load the bill data into the form
   loadBillIntoForm(sCurrBill, sCurrItems, sCurrCashInfo);

   m_odalInstance.hide();

   break;
  case 'del':
   const billData = stored_bill.find((c) => c.a == b346illID);
   if (billData && billData.a > 0) {
    if (confirm(`Are you sure you want to delete this bill & it's data?`)) {
     if (confirm(`this cannot be undone?`)) {
      payload0.fn = 9;
      payload0.vw = 1;
      payload0.b = billData;
      var tTxt = postCall_Json("https://my1.in/2/1.php", payload0, 0, false);
      var response = JSON.parse(tTxt);
      if (response.su == 1) {
       await delBillByID(billTableRowId);
      } else {
       alert(response.ms);
      }
     }
    }
   } else {
    alert("bill not found");
   }
   break;
  case 'print':
   window.open("bPrOp.html?b=" + billTableRowId);
   break;
 }
}
function showAlreadyReceivedAmts(b346illID, s594CurrItems, c594ashInfo) {
 const modal = create_modal_dynamically('received_amount_modal');
 const modalContent = modal.contentElement;
 const modalInstance = modal.modalInstance;

 // Calculate bill total from items
 const billTotal = s594CurrItems.reduce((sum, item) => sum + parseFloat(item.g || 0), 0);

 // Calculate totals from existing payments
 const totalReceived = c594ashInfo.reduce((sum, payment) => sum + parseFloat(payment.j || 0), 0);
 const balance = billTotal - totalReceived;

 // Store bill total globally for this modal
 window.modalBillTotal = billTotal;
 window.modalExistingPaymentsTotal = totalReceived;

 // Set modal title and content
 modalContent.innerHTML = `
<div class="modal-header">
 <h5 class="modal-title">Add Received Amount - Bill #${b346illID}</h5>
 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body">
 <!-- Add Received Amount Card -->
 <div class="card mb-3" id="addReceivedAmountCard">
  <div class="row align-items-end g-2">
   <!-- Date & Time - col-4 -->
   <div class="col-4">
    <label class="form-label small text-muted mb-1">Date</label>
    <input type="text" class="form-control form-control-sm" id="receivedDateTimeModal" placeholder="Select Date & Time">
   </div>

   <!-- Amount - col-4 -->
   <div class="col-4">
    <label class="form-label small text-muted mb-1">Rcvd Amt.</label>
    <input type="number" class="form-control form-control-sm" placeholder="Amount" id="receivedAmountModal" min="0"
     step="1">
   </div>

   <!-- Payment Type - col-2 -->
   <div class="col-2">
    <label class="form-label small text-muted mb-1">Type</label>
    <select class="form-control form-control-sm" id="paymentTypeModal">
     <option value="0">Select</option>
     <option value="1">Cash</option>
     <option value="2">Cheque</option>
     <option value="3">Card</option>
     <option value="4">UPI</option>
     <option value="5">Bank Transfer</option>
    </select>
   </div>

   <!-- Add Button - col-2 -->
   <div class="col-2">
    <button class="btn btn-primary btn-sm" onclick="addTempReceivedAmount(${b346illID})">
     <i class="fas fa-plus"></i>
    </button>
   </div>
  </div>
 </div>
 
 <!-- Temporary payments container (hidden) -->
 <div id="tempPaymentsContainer" style="display: none;"></div>

 <!-- Grand Total Summary -->
 <div class="row mt-4">
  <div class="col-12">
   <div class="card border-success">
    <div class="card-body bg-light">
     <div class="row text-center">
      <div class="col-4">
       <h6>Total</h6>
       <h4 class="text-primary">₹<span id="modalGrandBillTotal">${billTotal.toFixed(2)}</span></h4>
      </div>
      <div class="col-4">
       <h6>Rcvd</h6>
       <h4 class="text-success">₹<span id="modalGrandTotalReceived">${totalReceived.toFixed(2)}</span></h4>
      </div>
      <div class="col-4">
       <h6>Bal</h6>
       <h4 class="text-danger">₹<span id="modalGrandBalance">${balance.toFixed(2)}</span></h4>
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>

 <!-- Existing Received Amounts -->
 <div id="addedReceivedAmountsContainerModal">
  <h6>Existing Payments</h6>
  ${renderExistingPayments(c594ashInfo)}
 </div>
</div>
<div class="modal-footer">
 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
 <button type="button" class="btn btn-success" onclick="submitAllPayments(${b346illID})">Submit new Payments</button>
</div>
`;
 initializeModalFlatpickr();

 // Store temporary payments array for this modal
 window.tempReceivedAmounts = [];
 modalInstance.show();
}
async function submitAllPayments(billId) {
 if (window.tempReceivedAmounts.length === 0) {
  showToast('No new payments to submit');
  return;
 }
 if (window.tempReceivedAmounts.length > 1) {
  alert('only 1 amount entry allowed at a time;');
  return;
 }

 try {
  // Find the bill data
  const billData = stored_bill.find((c) => c.a == billId);
  if (!billData) {
   alert("Bill not found, refresh all data");
   return false;
  }

  // Show confirmation with all payment details
  let paymentDetails = window.tempReceivedAmounts.map(payment => {
   return `₹${payment.amount} (${getPaymentTypeText(payment.paymentType)}) on ${formatDateTime(payment.dateTime)}`;
  }).join('\n');

  if (!confirm(`Submit the following payments for bill #${billId}:\n\n${paymentDetails}`)) {
   return;
  }

  // Prepare payload for each payment
  payload0.vw = 1;
  payload0.fn = 23; // Use the same function number as your existing code

  // Process all payments
  for (const payment of window.tempReceivedAmounts) {
   let paymentPayload = {
    h: billData.e, // Client ID from bill
    i: payment.paymentType, // Payment type (1=Cash, 2=Cheque, etc.)
    j: payment.amount.toString(), // Amount received
    k: payment.dateTime.split(' ')[0], // Date only (YYYY-MM-DD format)
    td: billData.a, // Bill ID
   };

   payload0.r = paymentPayload;
   payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'c' }, { "tb": 'b' }, { "tb": 'i' }, { "tb": 'r' }, { "tb": 'be', "col": 'eb', "cl": "eb" }, { "tb": 'ba' }, { "tb": 'p' }, { "tb": 's' }]);

   // Make the API call for each payment
   const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 2, 1);

   if (response.su !== 1) {
    alert(`Failed to save payment: ${extractMessages(response)}`);
    return;
   } else {
    handl_op_rspons(response, 0);
    showToast('All payments submitted successfully!');
    setTimeout(() => {
     window.tempReceivedAmounts = [];
    }, 1000);
   }
  }
  stored_bill_cash_info = await dbDexieManager.getAllRecords(dbnm, "r") || [];

  const modal = bootstrap.Modal.getInstance(document.getElementById('received_amount_modal'));
  if (modal) {
   modal.hide();
  }

 } catch (error) {
  console.error('Error submitting payments:', error);
  showToast('Error submitting payments: ' + error.message);
 }
}
function addTempReceivedAmount(billId) {
 const dateTime = document.getElementById('receivedDateTimeModal').value;
 const amount = parseFloat(document.getElementById('receivedAmountModal').value) || 0;
 const paymentType = document.getElementById('paymentTypeModal').value;

 // Validation
 if (!dateTime) {
  showToast('Please select date and time');
  return;
 }

 if (amount <= 0) {
  showToast('Please enter a valid amount');
  return;
 }

 // Add to temporary array
 const tempPayment = {
  id: Date.now(),
  dateTime: dateTime,
  amount: amount,
  paymentType: paymentType,
  timestamp: new Date().toISOString()
 };

 window.tempReceivedAmounts.push(tempPayment);

 // Update UI to show temporary payments
 updateTempPaymentsUI();

 // Clear the form
 document.getElementById('receivedAmountModal').value = '';
 document.getElementById('paymentTypeModal').value = '0';

 // Update the totals in the modal
 updateModalTotals();

 showToast('Payment added to temporary list. Click "Submit All Payments" to save.');
}
function updateModalTotals() {
 // Get existing payments total and bill total from stored values
 const existingPaymentsTotal = window.modalExistingPaymentsTotal || 0;
 const tempPaymentsTotal = window.tempReceivedAmounts.reduce((sum, payment) => sum + payment.amount, 0);
 const totalReceived = existingPaymentsTotal + tempPaymentsTotal;
 const billTotal = window.modalBillTotal || 0;
 const balance = billTotal - totalReceived;

 document.getElementById('modalGrandTotalReceived').textContent = totalReceived.toFixed(2);
 document.getElementById('modalGrandBalance').textContent = balance.toFixed(2);

 // Update balance color based on amount
 const balanceElement = document.getElementById('modalGrandBalance');
 if (balance === 0) {
  balanceElement.className = 'text-success';
 } else if (balance > 0) {
  balanceElement.className = 'text-warning';
 } else {
  balanceElement.className = 'text-danger';
 }
}
function updateTempPaymentsUI() {
 const container = document.getElementById('tempPaymentsContainer');

 if (window.tempReceivedAmounts.length === 0) {
  container.style.display = 'none';
  return;
 }

 container.style.display = 'block';
 container.innerHTML = '<h6 class="mt-4">New Payments to be Added</h6>';

 window.tempReceivedAmounts.forEach((payment, index) => {
  const paymentTypeIcon = getPaymentTypeIcon(payment.paymentType);
  const formattedDate = formatDateTime(payment.dateTime);

  const paymentHTML = `
   <div class="card mb-2 received-amount-card" style="border-left: 4px solid #ffc107 !important;">
    <div class="card-body py-2">
     <div class="row align-items-center">
      <div class="col-6">
       <small class="text-muted">${formattedDate}</small>
      </div>
      <div class="col-4">
       <strong>${paymentTypeIcon} ₹${payment.amount.toFixed(2)}</strong>
      </div>
      <div class="col-2 text-end">
       <button class="btn btn-outline-danger btn-sm" onclick="removeTempPayment(${payment.id})">
        <i class="fas fa-times"></i>
       </button>
      </div>
     </div>
    </div>
   </div>
  `;

  container.insertAdjacentHTML('beforeend', paymentHTML);
 });
}
function removeTempPayment(paymentId) {
 window.tempReceivedAmounts = window.tempReceivedAmounts.filter(payment => payment.id !== paymentId);
 updateTempPaymentsUI();
 updateModalTotals();
 showToast('Payment removed from temporary list');
}
function addAmountToBill(billId) {
 const dateTime = document.getElementById('receivedDateTimeModal').value;
 const amount = parseFloat(document.getElementById('receivedAmountModal').value) || 0;
 const paymentType = document.getElementById('paymentTypeModal').value;

 // Validation
 if (!dateTime) {
  showToast('Please select date and time');
  return;
 }

 if (amount <= 0) {
  showToast('Please enter a valid amount');
  return;
 }

 if (paymentType === '0') {
  showToast('Please select payment type');
  return;
 }

 // Show alert as requested
 alert(`Adding amount to bill #${billId}\nAmount: ₹${amount}\nPayment Type: ${getPaymentTypeText(paymentType)}\nDate: ${dateTime}`);

 // Here you would typically make an API call to save the payment
 // For now, just show success message
 showToast(`₹${amount} added to bill #${billId}`);

 // Clear the form
 document.getElementById('receivedAmountModal').value = '';
 document.getElementById('paymentTypeModal').value = '0';

 // Note: In a real implementation, you would:
 // 1. Make API call to save the payment
 // 2. Update the UI with the new payment
 // 3. Possibly refresh the payments list
}
function initializeModalFlatpickr() {
 if (typeof flatpickr !== 'undefined') {
  const now = new Date();

  flatpickr("#receivedDateTimeModal", {
   enableTime: true,
   dateFormat: "Y-m-d H:i",
   time_24hr: true,
   defaultDate: now,
   minuteIncrement: 1,
   static: true,
   disableMobile: true,
   position: "above",
   positionElement: document.body,
   onReady: function (selectedDates, dateStr, instance) {
    const calendar = instance.calendarContainer;
    calendar.style.position = 'fixed';
    calendar.style.top = '50%';
    calendar.style.left = '50%';
    calendar.style.transform = 'translate(-50%, -50%)';
    calendar.style.zIndex = '9999';
   }
  });

  // Set initial value
  document.getElementById('receivedDateTimeModal').value = formatForFlatpickr(now);
 }
}
function renderExistingPayments(payments) {
 if (!payments || payments.length === 0) {
  return `
            <div class="text-center text-muted py-3">
                <i class="fas fa-receipt fa-2x mb-2"></i>
                <p>No payments recorded yet</p>
            </div>
        `;
 }

 let html = '';
 payments.forEach(payment => {
  const paymentTypeIcon = getPaymentTypeIcon(payment.i);
  const paymentTypeText = getPaymentTypeText(payment.i);
  const formattedDate = payment.k || 'No date';

  html += `
<div class="card mb-2 received-amount-card">
<div class="card-body py-2">
<div class="row align-items-center">
<div class="col-6">
<small class="text-muted">${formattedDate}</small>
</div>
<div class="col-4">
<strong>${paymentTypeIcon} ₹${parseFloat(payment.j || 0).toFixed(2)}</strong>
<br>
<small class="text-muted">${paymentTypeText}</small>
</div>
<div class="col-2 text-end">
<small class="text-muted">#${payment.a}</small>
</div>
</div>
</div>
</div>
`;
 });

 return html;
}

function loadBillIntoForm(bill, billItems, cashInfo) {
 try {
  // Populate basic bill information
  document.getElementById('invoiceNumber').value = bill.g || '';
  document.getElementById('receiptDate').value = bill.f || '';
  document.getElementById('billNotes').value = bill.i || '';
  document.getElementById('discountAmount').value = bill.k || 0;
  const discountAmount = parseFloat(bill.k) || 0;
  if (discountAmount > 0) {
   setTimeout(() => {
    calculateDiscountFromAmount();
   }, 100);
  }


  // Set delivery date from bill.i.dldt if available
  if (bill.i && bill.i.dldt) {
   document.getElementById('deliveryDate').value = bill.i.dldt;
  }

  // Set client information
  if (bill.e) {
   document.getElementById('clientId').value = bill.e;
   // Fetch and display client name
   loadClientName(bill.e);
  }

  // Clear existing items
  document.getElementById('addedItemsContainer').innerHTML = '';

  // Add bill items to the form
  billItems.forEach(item => {
   addBillItemToForm(item);
  });

  // Clear and populate received amounts
  receivedAmounts = [];
  if (cashInfo && cashInfo.length > 0) {
   cashInfo.forEach(payment => {
    receivedAmounts.push({
     id: payment.a,
     dateTime: payment.k || new Date().toISOString().split('T')[0] + ' 00:00',
     amount: parseFloat(payment.j) || 0,
     paymentType: payment.i || '0',
     timestamp: payment.b || new Date().toISOString()
    });
   });
  }
  updateReceivedAmountsUI();

  // Update bill summary
  updateBillSummary();
  updateGrandTotals();

  // Enable update and print buttons
  enableUpdateButton();
  enablePrintButton();
  disableSaveBtn();

  // Scroll to top of form
  window.scrollTo({ top: 0, behavior: 'smooth' });

  showToast('Bill loaded successfully');

 } catch (error) {
  console.error('Error loading bill into form:', error);
  showToast('Error loading bill data');
 }
}

function addBillItemToForm(item) {
 // This function adds an item directly to the added items container
 // without going through the form entry process

 const addedItemsContainer = document.getElementById('addedItemsContainer');
 const uniqueItemId = Date.now();

 // Find item details from items array
 const itemDetails = items.find(i => i.a == item.f) || {};

 const itemHTML = `
        <div class="card mb-3 added-item-card" id="invoiceItem-${uniqueItemId}" data-item-id="${item.f}">
            <div class="card-body">
                <div class="row">
                    <!-- Left side - Image -->
                    <div class="col-3">
                        <div class="text-center">
                            ${itemDetails.gu ?
   `<img src="${itemDetails.gu}" class="added-item-image" alt="Item Image" 
                                      onerror="this.style.display='none'; this.parentElement.innerHTML = '<i class=\\'fas fa-image fa-2x text-muted\\'></i><div class=\\'mt-1\\'><small class=\\'text-muted\\'>No Image</small></div>'">` :
   `<i class="fas fa-image fa-2x text-muted"></i>
                                 <div class="mt-1">
                                   <small class="text-muted">No Image</small>
                                 </div>`
  }
                        </div>
                    </div>
                    
                    <!-- Right side - Details -->
                    <div class="col-9">
                        <!-- Row 1 - Item Name -->
                        <div class="row mb-2 g-0">
                            <div class="col-10">
                                <strong>${itemDetails.gn || 'Unknown Item'}</strong>
                            </div>
                            <div class="col-2 d-flex align-items-center justify-content-end">
                                <div class="action-dropdown">
                                    <button class="btn btn-link ellipsis-btn" onclick="toggleActionMenu(${uniqueItemId})">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                    <div class="action-menu" id="actionMenu-${uniqueItemId}">
                                        <div class="action-menu-item edit" onclick="editItem(${uniqueItemId})">
                                            <i class="fas fa-edit me-2"></i>Edit
                                        </div>
                                        <div class="action-menu-item delete" onclick="removeItemFromInvoice(${uniqueItemId})">
                                            <i class="fas fa-trash me-2"></i>Delete
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Row 2 - Quantity, Rate, Price -->
                        <div class="row mb-2 g-0">
                            <div class="col-4">
                                <strong>Qty:</strong> ${item.h || '1'}
                            </div>
                            <div class="col-4">
                                <strong>Rate:</strong> ₹${parseFloat(itemDetails.k || 0).toFixed(2)}
                            </div>
                            <div class="col-4">
                                <strong>Price:</strong> ₹${parseFloat(item.g || 0).toFixed(2)}
                            </div>
                        </div>
                        
                        <!-- Row 3 - Description -->
                        <div class="row g-0">
                            <div class="col-12">
                                <small class="text-muted">${item.i || 'No description'}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

 addedItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
}

async function loadClientName(clientId) {
 try {
  // Try to find client in existing array first
  let client = clientReferrerArray.find(c => c.a == clientId);

  // If not found, try to fetch from database
  if (!client && clientReferrerArray.length === 0) {
   clientReferrerArray = await dbDexieManager.getAllRecords(dbnm, "c") || [];
   client = clientReferrerArray.find(c => c.a == clientId);
  }

  if (client) {
   const clientName = `${client.i || ''} ${client.h || ''}`.trim();
   document.getElementById('c_dtls_lient').value = clientName || 'Unknown Client';
  } else {
   document.getElementById('c_dtls_lient').value = 'Client ID: ' + clientId;
  }
 } catch (error) {
  console.error('Error loading client name:', error);
  document.getElementById('c_dtls_lient').value = 'Client ID: ' + clientId;
 }
}

async function delBillByID(b426illID) {
 try {
  let t1999mp = await dbDexieManager.deleteRecords(dbnm, 'b', b426illID);
  let itemsToDelete = (await dbDexieManager.getAllRecords(dbnm, 'i')).filter(o => o.e === b426illID);
  for (let o of itemsToDelete) {
   await dbDexieManager.deleteRecords(dbnm, 'i', o.a);
  }
  let t2001mp = await dbDexieManager.deleteRecords(dbnm, 'be', { ea: b426illID }, ['ea']);
  let cashInfoToDelete = (await dbDexieManager.getAllRecords(dbnm, 'r')).filter(o => o.tb === 7 && o.td === b426illID);
  for (let o of cashInfoToDelete) {
   await dbDexieManager.deleteRecords(dbnm, 'r', o.a);
  }
  await setMaxBillNo();
  // location.reload();
 } catch (error) {
  alert("Initialization error - please refresh");
 }
}

// Flatpickr dependency loader
function loadFlatpickrDependencies() {
 return new Promise((resolve, reject) => {
  // Check if Flatpickr is already loaded
  if (typeof flatpickr !== 'undefined') {
   resolve();
   return;
  }

  let cssLoaded = false;
  let jsLoaded = false;

  // Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
  link.onload = () => {
   cssLoaded = true;
   if (jsLoaded) resolve();
  };
  link.onerror = () => reject(new Error('Failed to load Flatpickr CSS'));
  document.head.appendChild(link);

  // Load JavaScript
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
  script.onload = () => {
   jsLoaded = true;
   if (cssLoaded) resolve();
  };
  script.onerror = () => reject(new Error('Failed to load Flatpickr JS'));
  document.head.appendChild(script);
 });
}

// Format for Flatpickr (YYYY-MM-DD HH:mm)
function formatForFlatpickr(date) {
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2, '0');
 const day = String(date.getDate()).padStart(2, '0');
 const hours = String(date.getHours()).padStart(2, '0');
 const minutes = String(date.getMinutes()).padStart(2, '0');
 return `${year}-${month}-${day} ${hours}:${minutes}`;
}
// Initialize Flatpickr for all datetime fields
async function initializeFlatpickr() {
 try {
  await loadFlatpickrDependencies();

  const now = new Date();


  // Initialize Flatpickr for receipt date
  flatpickr("#receiptDate", {
   enableTime: true,
   dateFormat: "Y-m-d H:i",
   time_24hr: true,
   defaultDate: now,
   minuteIncrement: 1,
   static: true,
   disableMobile: true,
   position: "above", // or "below"
   positionElement: document.body, // Position relative to body instead of input
   onReady: function (selectedDates, dateStr, instance) {
    // Center the calendar when opened
    const calendar = instance.calendarContainer;
    calendar.style.position = 'fixed';
    calendar.style.top = '50%';
    calendar.style.left = '50%';
    calendar.style.transform = 'translate(-50%, -50%)';
    calendar.style.zIndex = '9999';
   }
  });

  // Initialize Flatpickr for delivery date
  flatpickr("#deliveryDate", {
   enableTime: true,
   dateFormat: "Y-m-d H:i",
   time_24hr: true,
   defaultDate: now,
   minuteIncrement: 1,
   static: true,
   disableMobile: true,
   position: "above",
   positionElement: document.body,
   onReady: function (selectedDates, dateStr, instance) {
    const calendar = instance.calendarContainer;
    calendar.style.position = 'fixed';
    calendar.style.top = '50%';
    calendar.style.left = '50%';
    calendar.style.transform = 'translate(-50%, -50%)';
    calendar.style.zIndex = '9999';
   }
  });

  // Initialize Flatpickr for received date time
  flatpickr("#receivedDateTime", {
   enableTime: true,
   dateFormat: "Y-m-d H:i",
   time_24hr: true,
   defaultDate: now,
   minuteIncrement: 1,
   static: true,
   disableMobile: true,
   position: "above",
   positionElement: document.body,
   onReady: function (selectedDates, dateStr, instance) {
    const calendar = instance.calendarContainer;
    calendar.style.position = 'fixed';
    calendar.style.top = '50%';
    calendar.style.left = '50%';
    calendar.style.transform = 'translate(-50%, -50%)';
    calendar.style.zIndex = '9999';
   }
  });

  // Set initial values
  document.getElementById('receiptDate').value = formatForFlatpickr(now);
  document.getElementById('deliveryDate').value = formatForFlatpickr(now);
  document.getElementById('receivedDateTime').value = formatForFlatpickr(now);

 } catch (error) {
  console.error('Failed to initialize Flatpickr:', error);
  showToast('Date picker initialization failed - using basic input');
  // Fallback: set current datetime manually
  initializeBasicDates();
 }
}

// Fallback function if Flatpickr fails to load
function initializeBasicDates() {
 const now = new Date();
 const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
 };
 document.getElementById('receiptDate').value = formatDateTime(now);

 const tomorrow = new Date(now);
 tomorrow.setDate(now.getDate() + 1);
 document.getElementById('deliveryDate').value = formatDateTime(tomorrow);
 document.getElementById('receivedDateTime').value = formatDateTime(now);
}

// Validation function that scrolls to invalid field
function validateAndScrollToField(fieldId, message) {
 const field = document.getElementById(fieldId);
 if (field) {
  // Scroll to the field
  const fieldRect = field.getBoundingClientRect();
  const scrollTopPosition = window.pageYOffset + fieldRect.top - 100;
  window.scrollTo({ top: scrollTopPosition, behavior: 'smooth' });

  // Focus on the field
  field.focus();

  // Highlight the field with red border
  field.style.borderColor = '#dc3545';
  field.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';

  // Remove highlight after 3 seconds
  setTimeout(() => {
   field.style.borderColor = '';
   field.style.boxShadow = '';
  }, 3000);
 }

 if (message) {
  showToast(message);
 }

 return false;
}

function handleItemNameBlur(inputElement) {
 const itemName = inputElement.value.trim();

 // Clear the input if it's just whitespace
 if (itemName === '') {
  inputElement.value = '';
  clearItemFormFields();
  disableAddButton();
  return;
 }

 // Check if there's exactly one item with this name
 const matchedItems = items.filter(item => {
  if (!item || !item.gn) return false;
  return item.gn.toLowerCase() === itemName.toLowerCase();
 });

 if (matchedItems.length !== 1) {
  // Not exactly one match found - clear fields and disable button
  clearItemFormFields();
  disableAddButton();

  // Optional: Show a message if there are multiple matches
  if (matchedItems.length > 1) {
   showToast('Multiple items found with this name. Please select from dropdown.');
  } else if (matchedItems.length === 0) {
   // Don't show toast here as user might want to add new item
  }
 } else {
  // Exactly one match found - ensure add button is enabled
  enableAddButton();
 }
}

// Helper function to clear form fields
function clearItemFormFields() {
 document.getElementById('itemQty').value = '';
 document.getElementById('itemRate').value = '';
 document.getElementById('itemPrice').value = '';
}

// Helper function to disable add button
function disableAddButton() {
 const addButton = document.querySelector('#btn_ad_itm_to_invoice');
 if (addButton) {
  addButton.disabled = true;
  addButton.classList.add('btn-secondary');
  addButton.classList.remove('btn-success');
 }
}

// Helper function to enable add button
function enableAddButton() {
 const addButton = document.querySelector('#btn_ad_itm_to_invoice');
 if (addButton) {
  addButton.disabled = false;
  addButton.classList.remove('btn-secondary');
  addButton.classList.add('btn-success');
 }
}

// Also update your clearItemForm function to handle the button state
function clearItemForm() {
 document.getElementById('itemName').value = '';
 document.getElementById('itemName').removeAttribute('data-item-id');
 document.getElementById('itemQty').value = '1';
 document.getElementById('itemRate').value = '';
 document.getElementById('itemPrice').value = '';
 document.getElementById('itemDescription').value = '';
 document.getElementById('itemIdInput').value = '';
 updateItemImage('');
 enableAddButton(); // Enable button when form is cleared for new entry
}

// Define your callback function
function handleUploadedFile(fileUrl, fileName, fileType, fileId) {
 console.log('File uploaded:', fileName, fileUrl);
 // Update your form fields or UI here
 document.getElementById('itemDescription').value = fileUrl;
}
async function temporary() {
 //await loadAndExeFn('upldAnyFile2drv', ['fileUploadTesting', 'loader', null, '*', 'handleUploadedFile'], 'loader', 'https://cdn.jsdelivr.net/gh/sifr-in/cdn@7262bc9/cmn/my1dra.min.js');
 await loadExe2Fn(20, ['fileUploadTesting', 'loader', null, '*', 'handleUploadedFile'], [1]);
}
function enableSaveBtn() {
 const updateBtn = document.getElementById('saveBtn');
 updateBtn.disabled = false;
 updateBtn.classList.remove('btn-secondary');
 updateBtn.classList.add('btn-success');
}

function disableSaveBtn() {
 const updateBtn = document.getElementById('saveBtn');
 updateBtn.disabled = true;
 updateBtn.classList.remove('btn-success');
 updateBtn.classList.add('btn-secondary');
}
function enableUpdateButton() {
 const updateBtn = document.getElementById('updateBtn');
 updateBtn.disabled = false;
 updateBtn.classList.remove('btn-secondary');
 updateBtn.classList.add('btn-warning');
}

function disableUpdateButton() {
 const updateBtn = document.getElementById('updateBtn');
 updateBtn.disabled = true;
 updateBtn.classList.remove('btn-warning');
 updateBtn.classList.add('btn-secondary');
}

function enablePrintButton() {
 const printBtn = document.getElementById('printBtn');
 printBtn.disabled = false;
 printBtn.classList.remove('btn-secondary');
 printBtn.classList.add('btn-info');
}

function disablePrintButton() {
 const printBtn = document.getElementById('printBtn');
 printBtn.disabled = true;
 printBtn.classList.remove('btn-info');
 printBtn.classList.add('btn-secondary');
}

// Save Bill Function with enhanced validation
async function crUpBill(fnNumber) {
 try {
  // Validate required fields
  const invoiceNumber = document.getElementById('invoiceNumber').value.trim();
  const receiptDateValue = document.getElementById('receiptDate').value;
  const deliveryDateValue = document.getElementById('deliveryDate').value;
  const clientId = document.getElementById('clientId').value;
  const r_eferrerId = parseInt(document.getElementById('referrerId').value);

  if (!invoiceNumber) {
   return validateAndScrollToField('invoiceNumber', 'Please enter invoice number');
  }

  if (!receiptDateValue) {
   return validateAndScrollToField('receiptDate', 'Please select receipt date and time');
  }

  if (!deliveryDateValue) {
   return validateAndScrollToField('deliveryDate', 'Please select delivery date and time');
  }

  // Validate clientId - cannot be blank or 0
  if (!clientId || clientId === '0') {
   return validateAndScrollToField('c_dtls_lient', 'Please select a customer');
  }

  // Validate date formats and ensure time is included
  if (!receiptDateValue.includes(' ') || receiptDateValue.split(' ')[1].length !== 5) {
   return validateAndScrollToField('receiptDate', 'Please select both date and time for receipt');
  }

  if (!deliveryDateValue.includes(' ') || deliveryDateValue.split(' ')[1].length !== 5) {
   return validateAndScrollToField('deliveryDate', 'Please select both date and time for delivery');
  }

  if (typeof billingRequisit_be === 'function') {
   const eyeMeasurement = getEyeMeasurement();
   if (eyeMeasurement !== null) {
    payload0.be = eyeMeasurement;
    payload0.be.ef = r_eferrerId;
   } else {
    const confirmed = confirm("Save without eye measurement?");
    if (!confirmed) {
     return;
    }
   }
  }

  // Parse the date strings (format: "YYYY-MM-DD HH:mm")
  const receiptDate = receiptDateValue;
  const deliveryDate = deliveryDateValue;

  // Get added items
  const addedItems = document.querySelectorAll('#addedItemsContainer .added-item-card');
  if (addedItems.length === 0) {
   return validateAndScrollToField('itemName', 'Please add at least one item to the bill');
  }

  // Prepare bill items array
  const billItems = Array.from(addedItems).map(item => {
   const itemId = item.getAttribute('data-item-id') || '';
   const name = item.querySelector('strong').textContent;
   const qtyElement = item.querySelector('.col-4:nth-child(1)');
   const priceElement = item.querySelector('.col-4:nth-child(3)');
   const descriptionElement = item.querySelector('.text-muted');

   const qty = parseInt(qtyElement.textContent.replace('Qty:', '').trim()) || 0;
   const price = parseFloat(priceElement.textContent.replace('Price: ₹', '').trim()) || 0;
   const description = descriptionElement.textContent === 'No description' ? '' : descriptionElement.textContent;

   return {
    "h": qty.toString(), // Quantity
    "f": itemId, // Item ID
    "g": price, // Price
    "i": description // Description
   };
  });

  // Prepare received amounts array
  const receivedPayments = receivedAmounts.map(payment => {
   const paymentDateTime = payment.dateTime;
   return {
    "i": payment.paymentType, // Payment type
    "j": payment.amount.toFixed(2), // Amount
    "k": paymentDateTime // Date with time (YYYY-MM-DD HH:mm)
   };
  });

  if (receivedPayments.length == 0) {
   const confirmed = confirm("Continue without money?");
   if (!confirmed) {
    return;
   }
  }

  payload0.i = billItems;
  payload0.b = {
   "e": clientId, // Client ID (validated above)
   "f": receiptDate.split(' ')[0], // Receipt date only (YYYY-MM-DD)
   "g": invoiceNumber, // Invoice number
   "i": document.getElementById('billNotes').value.trim(),
   "k": document.getElementById('discountAmount').value || 0,
   "l": r_eferrerId
  };
  if (fnNumber == 7) { payload0.b.a = billSelectedToUpdate.a; }
  payload0.r = receivedPayments;

  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'c' }, { "tb": 'b' }, { "tb": 'i' }, { "tb": 'r' }, { "tb": 'be', "col": 'eb', "cl": "eb" }, { "tb": 'ba' }, { "tb": 'p' }, { "tb": 's' }]);
  payload0.vw = 1;
  payload0.fn = fnNumber;//3=save new bill,7=update bill
  const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
  if (response.su == 1) {
   if (fnNumber == 7) {
    let t1999mp = await dbDexieManager.deleteRecords(dbnm, 'b', billSelectedToUpdate.a);
    let t2000mp = (await dbDexieManager.getAllRecords(dbnm, 'i')).filter(o => o.e === billSelectedToUpdate.a).forEach(o => dbDexieManager.deleteRecords(dbnm, 'i', o.a));
    let t2001mp = await dbDexieManager.deleteRecords(dbnm, 'be', { ea: billSelectedToUpdate.a }, ['ea']);
    let t2002mp = (await dbDexieManager.getAllRecords(dbnm, 'r')).filter(o => o.tb === 7 && o.td === billSelectedToUpdate.a).forEach(o => dbDexieManager.deleteRecords(dbnm, 'r', o.a));
   }
   handl_op_rspons(response, 0);
   disableSaveBtn();
   disableUpdateButton();
   enablePrintButton();

   if (response?.b?.l && Array.isArray(response.b.l)) {
    for (let item of response.b.l) {
     if (item?.g.toString() === invoiceNumber) {
      billTableRowId = item.a;
      break;
     }
    }
   }
   showToast('Bill saved successfully!');
  } else {
   alert(extractMessages(response));
  }
 } catch (error) {
  console.error('Error saving bill:', error);
  showToast('Error saving bill: ' + error.message);
 }
}
function extractMessages(data) {
 if (!data.fn3 || !data.fn3.r || !Array.isArray(data.fn3.r)) {
  return "";
 }

 return data.fn3.r
  .map(obj => obj.ms || "") // Extract ms property or empty string if not present
  .filter(ms => ms !== "")  // Remove empty messages
  .join('\n');              // Join with line breaks
}

// Discount Calculation Functions
function calculateDiscountFromPercentage() {
 const totalPrice = parseFloat(document.getElementById('totalPrice').textContent) || 0;
 const discountPercentage = parseFloat(document.getElementById('discountPercentage').value) || 0;

 if (totalPrice <= 0) return;

 // Calculate discount amount
 const discountAmount = (totalPrice * discountPercentage) / 100;
 document.getElementById('discountAmount').value = discountAmount.toFixed(2);

 // Calculate final amount
 const finalAmount = totalPrice - discountAmount;
 document.getElementById('finalAmount').value = finalAmount.toFixed(2);

 // Update grand totals
 updateGrandTotals();
}

function calculateDiscountFromAmount() {
 const totalPrice = parseFloat(document.getElementById('totalPrice').textContent) || 0;
 const discountAmount = parseFloat(document.getElementById('discountAmount').value) || 0;

 if (totalPrice <= 0) return;

 // Calculate discount percentage
 const discountPercentage = totalPrice > 0 ? (discountAmount / totalPrice) * 100 : 0;
 document.getElementById('discountPercentage').value = discountPercentage.toFixed(2);

 // Calculate final amount
 const finalAmount = totalPrice - discountAmount;
 document.getElementById('finalAmount').value = finalAmount.toFixed(2);

 // Update grand totals
 updateGrandTotals();
}

function calculateDiscountFromFinalAmount() {
 const totalPrice = parseFloat(document.getElementById('totalPrice').textContent) || 0;
 const finalAmount = parseFloat(document.getElementById('finalAmount').value) || 0;

 if (totalPrice <= 0) return;

 // Calculate discount amount
 const discountAmount = totalPrice - finalAmount;
 document.getElementById('discountAmount').value = discountAmount.toFixed(2);

 // Calculate discount percentage
 const discountPercentage = totalPrice > 0 ? (discountAmount / totalPrice) * 100 : 0;
 document.getElementById('discountPercentage').value = discountPercentage.toFixed(2);

 // Update grand totals
 updateGrandTotals();
}

async function loadQRScanner() {
 return new Promise((resolve, reject) => {
  if (window.Html5QrcodeScanner) {
   resolve('QR Scanner already loaded');
   return;
  }

  const script = document.createElement('script');
  script.src = QR_SCANNER_CDN;
  script.async = true;

  let loaded = false;

  script.onload = () => {
   if (!loaded) {
    loaded = true;
    // Additional check to ensure the library is properly loaded
    if (typeof Html5QrcodeScanner !== 'undefined') {
     resolve('QR Scanner loaded successfully');
    } else {
     reject(new Error('QR Scanner library not properly initialized'));
    }
   }
  };

  script.onerror = () => {
   if (!loaded) {
    loaded = true;
    reject(new Error('Failed to load QR Scanner from CDN'));
   }
  };

  // Add timeout to handle hanging requests
  setTimeout(() => {
   if (!loaded) {
    loaded = true;
    reject(new Error('QR Scanner loading timeout'));
   }
  }, 10000); // 10 second timeout

  document.head.appendChild(script);
 });
}

async function openQRScanner() {
 try {
  // Check camera permissions and availability first
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
  stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately after permission check

  // Create UI elements for the scanner
  const overlay = document.createElement('div');
  overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999;`;

  const scannerContainer = document.createElement('div');
  scannerContainer.id = 'qr-reader';
  scannerContainer.style.cssText = `position: fixed !important; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10000; width: 90%; max-width: 500px;`;

  scannerContainer.classList.add('scanner-container');

  document.body.appendChild(overlay);
  document.body.appendChild(scannerContainer);

  // Initialize the scanner with the FIXED configuration (no supportedScanTypes)
  const html5QrcodeScanner = new Html5QrcodeScanner(
   "qr-reader",
   {
    fps: 10,
    qrbox: { width: 250, height: 250 }
    // Removed the problematic supportedScanTypes line
   },
   false
  );

  html5QrcodeScanner.render(
   (decodedText) => {
    // Success: Populate the input and process the item
    document.getElementById('itemIdInput').value = decodedText;
    handleItemIdInput({ target: { value: decodedText } });

    html5QrcodeScanner.clear().then(() => {
     document.body.removeChild(scannerContainer);
     document.body.removeChild(overlay);
    });
   },
   (errorMessage) => {
    // Errors are logged but scanning continues
    console.log(`QR Scan: ${errorMessage}`);
   }
  );

  // Close scanner when clicking the overlay
  overlay.addEventListener('click', () => {
   html5QrcodeScanner.clear().then(() => {
    document.body.removeChild(scannerContainer);
    document.body.removeChild(overlay);
   });
  });

 } catch (error) {
  console.error('QR Scanner initialization failed:', error);
  // Provide specific user feedback based on the error
  if (error.name === 'NotAllowedError') {
   showToast('Camera access was denied. Please allow camera permissions in your browser settings.');
  } else if (error.name === 'NotFoundError') {
   showToast('No camera found on this device.');
  } else {
   showToast('QR scanner is currently unavailable. Please enter the item ID manually.');
  }
  document.getElementById('itemIdInput').focus();
 }
}

// Item ID Input Handling
function handleItemIdInput(event) {
 const itemId = event.target.value.trim();

 if (itemId === '') {
  // Clear any existing dropdown
  const existingDropdown = document.querySelector('.item-id-dropdown');
  if (existingDropdown) {
   existingDropdown.remove();
  }
  return;
 }

 // Search for items by ID (items.a)
 const matchedItems = items.find((c) => c.a.toString() == itemId);

 // Close any existing dropdown
 const existingDropdown = document.querySelector('.item-id-dropdown');
 if (existingDropdown) {
  existingDropdown.remove();
 }

 if (!matchedItems) {
  // No items found - show toast
  showToast('No items found with this ID');
 } else {
  // Single item found - auto-select it
  selectItem(matchedItems);
  event.target.value = ''; // Clear the input
 }
}

function selectItem(item) {
 // Populate the form with item data
 document.getElementById('itemName').value = item.gn;
 document.getElementById('itemRate').value = item.k;
 document.getElementById('itemQty').value = '1'; // Set default quantity to 1
 calculatePrice(); // Calculate and show the price

 // Update the image
 updateItemImage(item.gu);

 // Store item ID in a hidden field or data attribute
 const itemNameInput = document.getElementById('itemName');
 itemNameInput.setAttribute('data-item-id', item.a);

 // Track usage
 mostUsedItems[item.a] = (mostUsedItems[item.a] || 0) + 1;

 // Enable the add button since we have a valid item
 enableAddButton();

 // Focus on quantity field for quick editing
 document.getElementById('itemQty').focus();
}

function showItemDropdown(inputElement) {
 // Close any existing dropdown
 const existingDropdown = document.querySelector('.item-dropdown');
 if (existingDropdown) {
  existingDropdown.remove();
 }

 const rect = inputElement.getBoundingClientRect();

 // Create dropdown container
 const dropdown = document.createElement('div');
 dropdown.className = 'item-dropdown';

 // Position dropdown below the input relative to the modal
 const modal = inputElement.closest('.modal');
 if (modal) {
  const modalRect = modal.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom - modalRect.top}px`;
  dropdown.style.left = `${rect.left - modalRect.left}px`;
  dropdown.style.width = `${rect.width}px`;

  // Append to modal instead of body
  modal.appendChild(dropdown);
 } else {
  // Fallback to original positioning if no modal found
  dropdown.style.top = `${rect.bottom + window.scrollY}px`;
  dropdown.style.left = '2%';
  dropdown.style.width = '96%';
  document.body.appendChild(dropdown);
 }

 const searchValue = inputElement.value.toLowerCase().trim();
 let filteredItems = items;

 if (searchValue) {
  filteredItems = items.filter(item => {
   if (!item || !item.gn) return false;

   // Apply stock filtering based on config - CHANGED: Check item.d != 111 instead of itemsToIgnoreInStockCount
   if (window[my1uzr.worknOnPg].confg.canSaleIfStock == 1 && item.d != 111) {
    // Only show items with available stock > 0
    if (!item.qAvlb || item.qAvlb <= 0) {
     return false;
    }
   }

   const itemName = item.gn.toLowerCase();
   const itemId = item.a ? item.a.toString().toLowerCase() : '';
   const itemDescription = item.ba_f ? item.ba_f.toLowerCase() : '';

   return itemName.includes(searchValue) ||
    itemId.includes(searchValue) ||
    itemDescription.includes(searchValue);
  }).sort((a, b) => {
   const aName = a.gn.toLowerCase();
   const bName = b.gn.toLowerCase();
   const aExactMatch = aName === searchValue;
   const bExactMatch = bName === searchValue;

   if (aExactMatch && !bExactMatch) return -1;
   if (!aExactMatch && bExactMatch) return 1;

   const aIndex = aName.indexOf(searchValue);
   const bIndex = bName.indexOf(searchValue);
   if (aIndex !== bIndex) return aIndex - bIndex;

   return (mostUsedItems[b.a] || 0) - (mostUsedItems[a.a] || 0);
  });
 } else {
  // When no search value, apply stock filtering to all items - CHANGED: Check item.d != 111 instead of itemsToIgnoreInStockCount
  filteredItems = items.filter(item => {
   if (!item || !item.gn) return false;

   // Apply stock filtering based on config - CHANGED: Check item.d != 111 instead of itemsToIgnoreInStockCount
   if (window[my1uzr.worknOnPg].confg.canSaleIfStock == 1 && item.d != 111) {
    // Only show items with available stock > 0
    return item.qAvlb && item.qAvlb > 0;
   }

   return true; // Show all items that don't meet the exclusion criteria
  }).sort((a, b) => {
   return (mostUsedItems[b.a] || 0) - (mostUsedItems[a.a] || 0);
  });
 }

 filteredItems = filteredItems.slice(0, 20);

 // Create dropdown content
 if (filteredItems.length === 0) {
  const noResults = document.createElement('div');
  noResults.className = 'item-dropdown-item';
  noResults.innerHTML = `
            <div class="text-center text-muted py-2">
                <i class="fas fa-search me-2"></i>No items found
            </div>
        `;
  dropdown.appendChild(noResults);
 } else {
  filteredItems.forEach(item => {
   const itemElement = document.createElement('div');
   itemElement.className = 'item-dropdown-item';

   // Determine what to show at the start of item name
   let prefixText = '';
   let stockIndicator = '';

   if (item.hasOwnProperty('qAvlb')) {
    // Show available quantity if property exists
    prefixText = `[${item.qAvlb}] `;

    // Add visual indicator for low stock
    if (item.qAvlb <= 5 && item.qAvlb > 0) {
     stockIndicator = '<span class="badge bg-warning ms-1">Low Stock</span>';
    } else if (item.qAvlb === 0) {
     stockIndicator = '<span class="badge bg-danger ms-1">Out of Stock</span>';
    }
   } else if (item.i) {
    // Show items.i if available
    prefixText = `[${item.i}] `;
   }

   itemElement.innerHTML = `
                <img src="${item.gu || 'https://cdn-icons-png.freepik.com/512/13543/13543330.png'}" 
                     onerror="this.src='https://cdn-icons-png.freepik.com/512/13543/13543330.png'">
                <div class="item-name">
                    <strong>${prefixText}${item.gn || 'Unnamed Item'}</strong>
                    ${stockIndicator}
                    <br>
                    <small class="text-muted">${item.ba_f || 'No description'}</small>
                </div>
                <div class="item-price">
                    <br>
                    <small class="text-muted">₹${item.k || '0'}</small>
                </div>
            `;

   // Add disabled styling for out-of-stock items - CHANGED: Check item.d != 111 instead of itemsToIgnoreInStockCount
   if (window[my1uzr.worknOnPg].confg.canSaleIfStock == 1 &&
    item.d != 111 &&
    (!item.qAvlb || item.qAvlb <= 0)) {
    itemElement.style.opacity = '0.6';
    itemElement.style.cursor = 'not-allowed';
    itemElement.title = 'Out of stock - cannot be sold';
   } else {
    itemElement.addEventListener('click', (e) => {
     // Set flag to indicate dropdown was clicked
     dropdownClicked = true;

     // Clear any pending blur timeout
     if (blurTimeout) {
      clearTimeout(blurTimeout);
      blurTimeout = null;
     }

     // Select the item
     selectItem(item);

     // Remove dropdown
     dropdown.remove();

     // Focus on quantity field
     setTimeout(() => {
      document.getElementById('itemQty').focus();
     }, 10);
    });
   }

   dropdown.appendChild(itemElement);
  });
 }

 // Update click handler to work with modal
 const clickHandler = (e) => {
  if (!dropdown.contains(e.target) && e.target !== inputElement) {
   dropdown.remove();
   document.removeEventListener('click', clickHandler);
  }
 };

 setTimeout(() => {
  document.addEventListener('click', clickHandler);
 }, 100);
}

async function handleAddNewItem(nwProdNm = '') {
 // Close the dropdown first
 const dropdown = document.querySelector('.item-dropdown');
 if (dropdown) {
  dropdown.remove();
 }

 // If no name provided, get current item name value
 if (!nwProdNm) {
  nwProdNm = document.getElementById('itemName').value.trim();
 }
 //0ni changeed to bn.js
 //await loadExecFn("set_add_itm_nw_innerHTML", "set_add_itm_nw_innerHTML", [nwProdNm], "loader", "https://cdn.jsdelivr.net/gh/sifr-in/cdn@734983c/b/bn.min.js", []);
 await loadExe2Fn(11, [nwProdNm], [1]);
}

// Price Calculation
function calculatePrice() {
 const qty = parseFloat(document.getElementById('itemQty').value) || 0;
 const rate = parseFloat(document.getElementById('itemRate').value) || 0;
 const price = qty * rate;
 document.getElementById('itemPrice').value = price.toFixed(2);
}

// Add Item to Invoice with validation
function addItemToInvoice() {
 const name = document.getElementById('itemName').value.trim();
 const qty = document.getElementById('itemQty').value;
 const rate = document.getElementById('itemRate').value;
 const price = document.getElementById('itemPrice').value;
 const description = document.getElementById('itemDescription').value;
 const itemId = document.getElementById('itemName').getAttribute('data-item-id');
 const imageUrl = document.querySelector('#itemImageContainer img')?.src || '';

 if (!name) {
  return validateAndScrollToField('itemName', 'Please enter item name');
 }

 if (!price || parseFloat(price) <= 0) {
  return validateAndScrollToField('itemRate', 'Please enter a valid price');
 }

 const addedItemsContainer = document.getElementById('addedItemsContainer');
 const uniqueItemId = Date.now(); // Unique ID for each item

 const itemHTML = `
    <div class="card mb-3 added-item-card" id="invoiceItem-${uniqueItemId}" data-item-id="${itemId}">
      <div class="card-body">
        <div class="row">
          <!-- Left side - Image (fixed 3 columns) -->
          <div class="col-3">
            <div class="text-center">
              ${imageUrl ?
   `<img src="${imageUrl}" class="added-item-image" alt="Item Image" 
                      onerror="this.style.display='none'; this.parentElement.innerHTML = '<i class=\\'fas fa-image fa-2x text-muted\\'></i><div class=\\'mt-1\\'><small class=\\'text-muted\\'>No Image</small></div>'">` :
   `<i class="fas fa-image fa-2x text-muted"></i>
                 <div class="mt-1">
                   <small class="text-muted">No Image</small>
                 </div>`
  }
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
                <div class="action-dropdown">
                  <button class="btn btn-link ellipsis-btn" onclick="toggleActionMenu(${uniqueItemId})">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <div class="action-menu" id="actionMenu-${uniqueItemId}">
                    <div class="action-menu-item edit" onclick="editItem(${uniqueItemId})">
                      <i class="fas fa-edit me-2"></i>Edit
                    </div>
                    <div class="action-menu-item delete" onclick="removeItemFromInvoice(${uniqueItemId})">
                      <i class="fas fa-trash me-2"></i>Delete
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Row 2 - Quantity, Rate, Price (fixed 4-4-4 columns) -->
            <div class="row mb-2 g-0">
              <div class="col-4">
                <strong>Qty:</strong> ${qty}
              </div>
              <div class="col-4">
                <strong>Rate:</strong> ₹${parseFloat(rate).toFixed(2)}
              </div>
              <div class="col-4">
                <strong>Price:</strong> ₹${parseFloat(price).toFixed(2)}
              </div>
            </div>
            
            <!-- Row 3 - Description -->
            <div class="row g-0">
              <div class="col-12">
                <small class="text-muted">${description || 'No description'}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

 addedItemsContainer.insertAdjacentHTML('beforeend', itemHTML);

 // Clear the form
 clearItemForm();

 // Update bill summary
 updateBillSummary();
}

// Action Menu Functions
function toggleActionMenu(itemId) {
 // Close all other open menus first
 const allMenus = document.querySelectorAll('.action-menu');
 allMenus.forEach(menu => {
  if (menu.id !== `actionMenu-${itemId}`) {
   menu.classList.remove('show');
  }
 });

 // Toggle current menu
 const menu = document.getElementById(`actionMenu-${itemId}`);
 if (menu) {
  menu.classList.toggle('show');
 }

 // Close menu when clicking outside
 const clickHandler = (e) => {
  if (!menu.contains(e.target) && !e.target.closest('.ellipsis-btn')) {
   menu.classList.remove('show');
   document.removeEventListener('click', clickHandler);
  }
 };

 setTimeout(() => {
  document.addEventListener('click', clickHandler);
 }, 100);
}

function editItem(itemId) {
 const itemElement = document.getElementById(`invoiceItem-${itemId}`);
 if (!itemElement) return;

 // Get current values from the item card
 const name = itemElement.querySelector('strong').textContent;
 const qty = itemElement.querySelector('.col-4:nth-child(1)').textContent.replace('Qty:', '').trim();
 const rate = itemElement.querySelector('.col-4:nth-child(2)').textContent.replace('Rate: ₹', '').trim();
 const price = itemElement.querySelector('.col-4:nth-child(3)').textContent.replace('Price: ₹', '').trim();
 const description = itemElement.querySelector('.text-muted').textContent;
 const imageUrl = itemElement.querySelector('img')?.src || '';
 const originalItemId = itemElement.getAttribute('data-item-id');

 // Populate the form with existing values
 document.getElementById('itemName').value = name;
 document.getElementById('itemName').setAttribute('data-item-id', originalItemId);
 document.getElementById('itemQty').value = qty;
 document.getElementById('itemRate').value = rate;
 document.getElementById('itemPrice').value = price;
 document.getElementById('itemDescription').value = description === 'No description' ? '' : description;

 // Update image
 updateItemImage(imageUrl);

 // Remove the item from added items
 itemElement.remove();

 // Update bill summary
 updateBillSummary();

 // Scroll to the form
 const fieldRect = document.getElementById('itemName').getBoundingClientRect();
 const scrollTopPosition = window.pageYOffset + fieldRect.top - 100;
 window.scrollTo({ top: scrollTopPosition, behavior: 'smooth' });
 document.getElementById('itemName').focus();
}

function removeItemFromInvoice(itemId) {
 const itemElement = document.getElementById(`invoiceItem-${itemId}`);
 if (itemElement) {
  itemElement.remove();
  updateBillSummary();
 }
}

// Bill Summary Calculations
function calculateBillSummary() {
 const addedItems = document.querySelectorAll('#addedItemsContainer .added-item-card');
 let totalItems = 0;
 let totalQuantity = 0;
 let totalPrice = 0;

 addedItems.forEach(item => {
  totalItems++;

  const qtyElement = item.querySelector('.col-4:nth-child(1)');
  const priceElement = item.querySelector('.col-4:nth-child(3)');

  if (qtyElement && priceElement) {
   const qty = parseInt(qtyElement.textContent.replace('Qty:', '').trim()) || 0;
   const price = parseFloat(priceElement.textContent.replace('Price: ₹', '').trim()) || 0;

   totalQuantity += qty;
   totalPrice += price;
  }
 });

 // Update summary
 document.getElementById('totalItems').textContent = totalItems;
 document.getElementById('totalQuantity').textContent = totalQuantity;
 document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);

 // Recalculate discount and grand totals
 calculateDiscountFromPercentage();
 updateGrandTotals();
}

function calculateLoadedBillTotals() {
 const addedItems = document.querySelectorAll('#addedItemsContainer .added-item-card');
 let totalItems = 0;
 let totalQuantity = 0;
 let totalPrice = 0;

 addedItems.forEach(item => {
  totalItems++;

  const qtyElement = item.querySelector('.col-4:nth-child(1)');
  const priceElement = item.querySelector('.col-4:nth-child(3)');

  if (qtyElement && priceElement) {
   const qty = parseInt(qtyElement.textContent.replace('Qty:', '').trim()) || 0;
   const price = parseFloat(priceElement.textContent.replace('Price: ₹', '').trim()) || 0;

   totalQuantity += qty;
   totalPrice += price;
  }
 });

 // Update summary
 document.getElementById('totalItems').textContent = totalItems;
 document.getElementById('totalQuantity').textContent = totalQuantity;
 document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);

 // Set final amount (you might want to store discount info in your bill object)
 document.getElementById('finalAmount').value = totalPrice.toFixed(2);

 // Update grand totals
 updateGrandTotals();
}

function updateBillSummary() {
 // Check if we're viewing an existing bill or creating a new one
 if (billTableRowId && billTableRowId > 0) {
  calculateLoadedBillTotals();
 } else {
  calculateBillSummary();
 }
}

// Received Amount Functions with validation
function initializeReceivedAmountForm() {
 // Flatpickr already handles the initial value
}

function addReceivedAmount() {
 const dateTime = document.getElementById('receivedDateTime').value;
 const amount = parseFloat(document.getElementById('receivedAmount').value) || 0;
 const paymentType = document.getElementById('paymentType').value;

 // Validation
 if (!dateTime) {
  return validateAndScrollToField('receivedDateTime', 'Please select date and time');
 }

 if (amount <= 0) {
  return validateAndScrollToField('receivedAmount', 'Please enter a valid amount');
 }

 // Create received amount object
 const receivedAmount = {
  id: -Date.now(),
  dateTime: dateTime,
  amount: amount,
  paymentType: paymentType,
  timestamp: new Date().toISOString()
 };

 // Add to array
 receivedAmounts.push(receivedAmount);

 // Update UI
 updateReceivedAmountsUI();

 // Clear form
 clearReceivedAmountForm();

 // Update grand totals
 updateGrandTotals();
}

function updateReceivedAmountsUI() {
 const container = document.getElementById('addedReceivedAmountsContainer');

 if (receivedAmounts.length === 0) {
  container.innerHTML = `
      <div class="text-center text-muted py-3">
        <i class="fas fa-receipt fa-2x mb-2"></i>
        <p>No received amounts added yet</p>
      </div>
    `;
  return;
 }

 let html = '<h6>Payment History</h6>';

 receivedAmounts.forEach((payment, index) => {
  const paymentTypeIcon = getPaymentTypeIcon(payment.paymentType);
  const formattedDate = formatDateTime(payment.dateTime);

  html += `
      <div class="card mb-2 received-amount-card" id="receivedAmount-${payment.id}">
        <div class="card-body py-2">
          <div class="row align-items-center">
            <div class="col-6">
              <small class="text-muted">${formattedDate}</small>
            </div>
            <div class="col-4">
              <strong>${paymentTypeIcon} ₹${payment.amount.toFixed(2)}</strong>
            </div>
            <div class="col-2 text-end">
              <div class="dropdown">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><button class="dropdown-item" onclick="updatePayment(${payment.id})"><i class="fas fa-edit me-2"></i>Update</button></li>
                  <li><hr class="dropdown-divider"><hr class="dropdown-divider"></li>
                  <li><button class="dropdown-item text-danger" onclick="removeReceivedAmount(${payment.id})"><i class="fas fa-trash me-2"></i>Delete</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
 });

 container.innerHTML = html;
}

function getPaymentTypeIcon(type) {
 const paymentTypeIcons = {
  '0': '0', // Unknown
  '1': 'C', // Cash
  '2': 'Q', // Cheque
  '3': 'A', // Card
  '4': 'U', // UPI
  '5': 'B'  // Bank Transfer
 };
 return paymentTypeIcons[type] || '0';
}

function getPaymentTypeText(type) {
 const paymentTypes = {
  '0': 'Unknown',
  '1': 'Cash',
  '2': 'Cheque',
  '3': 'Card',
  '4': 'UPI',
  '5': 'Bank Transfer'
 };
 return paymentTypes[type] || 'Unknown';
}

function updatePayment(paymentId) {
 // Find the payment to update
 const paymentIndex = receivedAmounts.findIndex(payment => payment.id === paymentId);
 if (paymentIndex === -1) return;

 const payment = receivedAmounts[paymentIndex];

 // Populate the form with existing payment data
 document.getElementById('receivedDateTime').value = payment.dateTime;
 document.getElementById('receivedAmount').value = payment.amount;
 document.getElementById('paymentType').value = payment.paymentType;

 // Remove the payment from the array
 receivedAmounts.splice(paymentIndex, 1);

 // Update UI
 updateReceivedAmountsUI();
 updateGrandTotals();

 // Scroll to the payment form
 const fieldRect = document.getElementById('receivedDateTime').getBoundingClientRect();
 const scrollTopPosition = window.pageYOffset + fieldRect.top - 100;
 window.scrollTo({ top: scrollTopPosition, behavior: 'smooth' });
 document.getElementById('receivedAmount').focus();

 showToast('Payment loaded for editing. Update the details and click Add to save.');
}

function removeReceivedAmount(id) {
 receivedAmounts = receivedAmounts.filter(payment => payment.id !== id);
 updateReceivedAmountsUI();
 updateGrandTotals();
}

function formatDateTime(dateTimeString) {
 const date = new Date(dateTimeString);
 return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function clearReceivedAmountForm() {
 document.getElementById('receivedAmount').value = '';
 document.getElementById('paymentType').value = '0';
 // Flatpickr will maintain the current datetime for the next entry
}

function updateGrandTotals() {
 const finalAmount = parseFloat(document.getElementById('finalAmount').value) || 0;
 const totalReceived = receivedAmounts.reduce((sum, payment) => sum + payment.amount, 0);
 const balance = finalAmount - totalReceived;

 document.getElementById('grandBillTotal').textContent = finalAmount.toFixed(2);
 document.getElementById('grandTotalReceived').textContent = totalReceived.toFixed(2);
 document.getElementById('grandBalance').textContent = balance.toFixed(2);

 // Add visual indicators
 const balanceElement = document.getElementById('grandBalance');
 if (balance === 0) {
  balanceElement.className = 'text-success';
 } else if (balance > 0) {
  balanceElement.className = 'text-warning';
 } else {
  balanceElement.className = 'text-danger';
 }
}

// Utility Functions
function clearItemForm() {
 document.getElementById('itemName').value = '';
 document.getElementById('itemName').removeAttribute('data-item-id');
 document.getElementById('itemQty').value = '1';
 document.getElementById('itemRate').value = '';
 document.getElementById('itemPrice').value = '';
 document.getElementById('itemDescription').value = '';
 document.getElementById('itemIdInput').value = '';
 updateItemImage('');
}

function updateItemImage(imageUrl) {
 const imageContainer = document.getElementById('itemImageContainer');
 if (imageUrl && imageUrl !== '') {
  imageContainer.innerHTML = `
      <img src="${imageUrl}" 
           class="img-fluid rounded" 
           alt="Item Image"
           style="max-width: 100%; height: auto; max-height: 120px; object-fit: cover;"
           onerror="this.style.display='none'; document.getElementById('itemImageContainer').innerHTML = '<i class=\\'fas fa-image fa-3x text-muted\\'></i><div class=\\'mt-2\\'><small class=\\'text-muted\\'>No Image</small></div>'">
    `;
 } else {
  imageContainer.innerHTML = `
      <i class="fas fa-image fa-3x text-muted"></i>
      <div class="mt-2">
        <small class="text-muted">No Image</small>
      </div>
    `;
 }
}

function showToast(message) {
 // Simple toast implementation
 const toast = document.createElement('div');
 toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 3000;
    font-size: 14px;
  `;
 toast.textContent = message;
 document.body.appendChild(toast);

 setTimeout(() => {
  document.body.removeChild(toast);
 }, 3000);
}

function addDropdownStyles() {
 const style = document.createElement('style');
 style.textContent = `
    .item-dropdown {
      position: absolute;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
      width: 96%;
      left: 2%;
    }
    
    .item-dropdown-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .item-dropdown-item:last-child {
      border-bottom: none;
    }
    
    .item-dropdown-item:hover {
      background-color: #f8f9fa;
    }
    
    .item-dropdown-item img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 12px;
    }
    
    .item-dropdown-item .item-name {
      flex: 1;
      font-weight: 500;
      line-height: 1.2;
    }
    
    .item-dropdown-item .item-price {
      text-align: right;
      color: #28a745;
      font-weight: 500;
      line-height: 1.2;
    }
    
    .row.g-0 > [class*="col-"] {
      padding-left: 5px;
      padding-right: 5px;
    }
    
    .row.g-0 .input-group {
      margin-bottom: 0;
    }
    
    .added-item-card {
      border-left: 4px solid #28a745 !important;
    }
    
    .added-item-image {
      max-width: 80px;
      max-height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .action-dropdown {
      position: relative;
      display: inline-block;
    }
    
    .action-menu {
      display: none;
      position: absolute;
      right: 0;
      top: 100%;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      min-width: 120px;
    }
    
    .action-menu.show {
      display: block;
    }
    
    .action-menu-item {
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s;
    }
    
    .action-menu-item:last-child {
      border-bottom: none;
    }
    
    .action-menu-item:hover {
      background-color: #f8f9fa;
    }
    
    .action-menu-item.edit {
      color: #007bff;
    }
    
    .action-menu-item.delete {
      color: #dc3545;
    }
    
    .ellipsis-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #6c757d;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .ellipsis-btn:hover {
      background-color: #f8f9fa;
      color: #495057;
    }
    
    .qr-scanner-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .qr-scanner-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      max-width: 90%;
      max-height: 90%;
    }
    
#qr-reader.scanner-container {
  position: fixed !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
    
    .received-amount-card {
      border-left: 4px solid #007bff !important;
      transition: all 0.3s ease;
    }
    
    .received-amount-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .badge.bg-secondary {
      font-size: 0.75rem;
      padding: 4px 8px;
    }
    
    .card.border-success {
      border-width: 2px !important;
    }
    
    .bg-light {
      background-color: #f8f9fa !important;
    }
    
    /* Flatpickr customization */
    .flatpickr-input {
      background-color: white !important;
    }
    
    /* Action Buttons Styles */
    .btn-success, .btn-warning, .btn-info {
      font-weight: 600;
      padding: 10px 16px;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }
    
    .btn-secondary:disabled {
      background-color: #6c757d !important;
      border-color: #6c757d !important;
    }
    
    .btn:disabled:hover {
      transform: none !important;
      box-shadow: none !important;
    }
    
    /* Responsive discount line */
    .input-group-sm {
      margin-bottom: 0.5rem;
    }
    
    .input-group-sm .form-control {
      font-size: 0.875rem;
    }
    
    .input-group-sm .input-group-text {
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
    }
    
    /* Add New Item Button Styles */
    .btn-success.btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      height: 38px; /* Match input field height */
    }
    
    @media (max-width: 576px) {
      .row.g-2 > [class*="col-"] {
        margin-bottom: 0.5rem;
      }
      
      .input-group-sm {
        margin-bottom: 0.25rem;
      }
      
      .btn-success, .btn-warning, .btn-info {
        padding: 8px 12px;
        font-size: 0.9rem;
      }
      
      .btn-success.btn-sm {
        height: 36px; /* Slightly smaller on mobile */
      }
    }
    
    @media (min-width: 576px) {
      .row.g-2.align-items-end {
        align-items: end !important;
      }
      
      .input-group-sm {
        margin-bottom: 0;
      }
    }

.dropdown-menu {
  z-index: 9999 !important;
}

.received-amount-card, .card, .modal-body {
  position: static !important;
}

#received_amount_modal .modal-dialog {
    max-width: 600px;
}

#addedReceivedAmountsContainerModal {
    max-height: 400px;
    overflow-y: auto;
}

.received-amount-card {
    border-left: 4px solid #007bff !important;
}

 .badge {
        font-size: 0.6rem;
        padding: 2px 4px;
    }
    
    .bg-warning {
        background-color: #ffc107 !important;
        color: #000 !important;
    }
    
    .bg-danger {
        background-color: #dc3545 !important;
        color: #fff !important;
    }
    
    .item-dropdown-item.disabled {
        opacity: 0.6;
        cursor: not-allowed !important;
    }
    
    .item-dropdown-item.disabled:hover {
        background-color: transparent !important;
    }
  `;
 document.head.appendChild(style);
}

function commonFnToRunAfter_op_ViewCall(obj, swtch) {
 if (swtch === 1) {
  // Set values to client
  document.getElementById('c_dtls_lient').value = obj.i + " " + obj.h + " " + obj.e;
  document.getElementById('clientId').value = obj.a;
 } else if (swtch === 2) {
  // Set values to referrer
  document.getElementById('r_dtls_eferrer').value = obj.i + " " + obj.h + " " + obj.e;
  document.getElementById('referrerId').value = obj.a;
 }
}

function function2runAfter_O_Login() {
 location.reload();
}
function function2runAfter_P_Login() {
 location.reload();
}

function handl_op_rspons(response, reload = 0) {
 (async () => {
  try {
   if (response.su == 1) {
    let t3032mp = null;
    if (response.be != null) {
     if (response.be.l != null) {
      const t3776mp = await dbDexieManager.insertToDexie(dbnm, "be", response.be.l, true, ["ea"]);
      reye_msrmnt = response.be.l;
     }
    }
    if (response.ba != null) {
     if (response.ba.l != null) {
      const t3776mp = await dbDexieManager.insertToDexie(dbnm, "ba", response.ba.l, true, ["a"]);
     }
    }
    if (response.i != null) {
     if (response.i.l != null) {
      const t3782mp = await dbDexieManager.insertToDexie(dbnm, "i", response.i.l, true, ["a"]);
      t3032mp = JSON.parse(JSON.stringify(response.i.l));
      ritem_info = JSON.parse(JSON.stringify(response.i.l)); // Deep clone
     }
    }
    if (response.r != null) {
     if (response.r.l != null) {
      const t3782mp = await dbDexieManager.insertToDexie(dbnm, "r", response.r.l, true, ["a"]);
     }
    }
    if (response.c != null) {
     if (response.c.l != null) {
      const t3793mp = await dbDexieManager.insertToDexie(dbnm, "c", response.c.l, true, ["a"]);
     }
    }
    if (response.p != null) {
     if (response.p.l != null) {
      const t3663mp = await dbDexieManager.insertToDexie(dbnm, "p", response.p.l, true, ["a"]);
     }
    }

    if (response.b != null) {
     if (response.b.l != null) {
      const t3764mp = await dbDexieManager.insertToDexie(dbnm, "b", response.b.l, true, ["g"]);//chk by index=g because id=a can change but g=bill number creates problem;
      if (t3764mp && t3764mp.success) {
       rbill_info = response.b.l;
      }

      await setMaxBillNo();

     }
    }

    if (response.s != null) {
     if (response.s.l != null) {

      let t_p_mp = await dbDexieManager.getAllRecords(dbnm, "p") || [];
      let t_ba_mp = await dbDexieManager.getAllRecords(dbnm, "ba") || [];
      let t3667mp = response.s.l.map(item => {
       const matchingProd = t_p_mp.find(prod => prod.a === item.g);
       if (matchingProd) {
        item.gn = matchingProd.e;
        item.gu = matchingProd.g;
        item.hu = matchingProd.h;
       } else {
        item.gn = "no name";
        item.gu = "https://cdn-icons-png.freepik.com/512/13543/13543330.png";
        item.hu = "https://cdn-icons-png.freepik.com/512/13543/13543330.png";
       }
       const m_ba_atching = t_ba_mp.find(i3762tm => i3762tm.a === item.f);
       if (m_ba_atching) {
        item.ba_f = m_ba_atching.f;
        item.ba_g = m_ba_atching.g;
       } else {
        item.ba_f = "0000-00-00 00:00:00";
        item.ba_g = "0";
       }
       return item;
      });
      const t3793mp = await dbDexieManager.insertToDexie(dbnm, "s", t3667mp, true, ["a"]);
     }
    }
    if (t3032mp != null) {
     if (window[my1uzr.worknOnPg].confg.calcStock == 1) {
      await update_qty_sold(response);
     }
    }
    alert("stored successfully");
    if (reload == 1) {
     location.reload();
    }
   } else {
    if (response.ms != null) { alert(response.ms); }
    if (response.fn3 != null) {
     if (response.fn3.r != null) {
      for (let i7 = 0; i7 < response.fn3.r.length; i7++) {
       if (response.fn3.r[i7].ms != null)
        alert(response.fn3.r[i7].ms);
      }
     }
    }
    if (
     response.su == 2 &&
     response.ba != null &&
     response.ba.mx != null
    ) {
     var t55 = parseInt(invoice.hNum.value);
     var t15 = parseInt(response.ba.mx);
     if (t55 > t15) t15 = t55;
     t15 = t15 + 1;
     billAlreadyExistsObject = t15;
     m_odal_msg_tell_bill_exists.innerText =
      "if you want to save with latest bill no, '" +
      t15 +
      "', click button below;";
     m_odal_tell_bill_exists.style.display = "block";
    } else {
     alert(response.ms);
    }
   }
   payload0.go = 0;
  } catch (error) {
   console.error("Initialization failed:", error);
   showToast("Initialization error - please refresh");
  }
 })();
}
async function update_qty_sold(resp3206onse) {
 setTimeout(async () => {
  // Calculate total quantity sold for each stock item
  const stockSales = {};

  let t_i_mp = await dbDexieManager.getAllRecords(dbnm, "i") || [];
  let t_s_mp = await dbDexieManager.getAllRecords(dbnm, "s") || [];

  t_i_mp.forEach(soldItem => {
   const stockId = soldItem.f;
   const quantity = soldItem.h;

   if (stockSales[stockId]) {
    stockSales[stockId] += quantity;
   } else {
    stockSales[stockId] = quantity;
   }
  });

  // Add qSold column to stock items, excluding items where d == 111 - CHANGED: Check item.d != 111 instead of itemsToIgnoreInStockCount
  t_s_mp.forEach(stockItem => {
   stockItem.qSold = stockSales[stockItem.a] || 0;
   stockItem.qAvlb = stockItem.i - stockItem.qSold;
  });
  const t3025mp = await dbDexieManager.insertToDexie(dbnm, "s", t_s_mp, true, ["a"]);
  console.log('Updated stock items with qSold:', t_s_mp);

 }, 1000); // 1 second delay
}
async function setMaxBillNo() {
 var t55 = await getMaxBillNo();
 t55 = parseFloat(t55) + 1;
 localStorage.setItem("lastInvoiNum", t55);
 document.getElementById('invoiceNumber').value = t55;
}
async function getMaxBillNo() {
 let arr41 = await dbDexieManager.getAllRecords(dbnm, "b") || [];
 var t4642 = 0;
 if (arr41.length > 0) {
  let maxNum = arr41.reduce(
   (max, item) =>
    parseFloat(item["g"]) > max ? parseFloat(item["g"]) : max,
   arr41[0]["g"]
  );
  // Ensure both dates are valid and compare
  if (maxNum > t4642) t4642 = maxNum;
 }
 return t4642;
}

// Close all action menus when clicking outside
document.addEventListener('click', function (e) {
 if (!e.target.closest('.action-dropdown')) {
  const allMenus = document.querySelectorAll('.action-menu');
  allMenus.forEach(menu => {
   menu.classList.remove('show');
  });
 }
});

function temporaryAlertFunction(billId) {
 // Implement temporary alert functionality
 console.log('Temporary alert for bill:', billId);
}

