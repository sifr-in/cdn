// rep_coll.js - Collections Modal
let receipts = [];
let bills = [];
let receivedByBill = new Map();

async function loadCollectionsData() {
 // Load receipts and bills data from IndexedDB
 try {
  const [allReceipts, allBills] = await Promise.all([
   dbDexieManager.getAllRecords(dbnm, 'r'),
   dbDexieManager.getAllRecords(dbnm, 'b')
  ]);
  receipts = Array.isArray(allReceipts) ? allReceipts : [];
  bills = Array.isArray(allBills) ? allBills : [];
  receivedByBill = new Map();
  receipts.forEach(r => {
   if (r.tb == 7 && r.td != null) {
    const key = String(r.td);
    receivedByBill.set(key, (receivedByBill.get(key) || 0) + (parseFloat(r.j) || 0));
   }
  });
 } catch (e) {
  console.warn('Error loading receipts/bills from IndexedDB:', e);
  receipts = [];
  bills = [];
  receivedByBill = new Map();
 }
}

function billDateStr(b) {
 const d = String(b.f || '').split(' ')[0];
 return d.length >= 10 ? d : '';
}

function validYear(value) {
 const y = String(value || '').slice(0, 4);
 return /^\d{4}$/.test(y) ? parseInt(y, 10) : null;
}

function getBillTotal(b) {
 const itemsTotal = parseFloat(b.i_tot) || 0;
 const discount = parseFloat(b.k) || 0;
 return itemsTotal - discount;
}

function getBillReceived(b) {
 const key = String(b.a);
 if (receivedByBill.has(key)) return receivedByBill.get(key);
 return parseFloat(b.r_tot) || 0;
}

function getBillOutstanding(b) {
 const due = getBillTotal(b) - getBillReceived(b);
 return due > 0 ? due : 0;
}

function formatBillDate(dateStr) {
 if (!dateStr) return '';
 const d = String(dateStr).split(' ')[0];
 if (d.length < 10) return d;
 const parts = d.split('-');
 return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function formatBillDay(dateStr) {
 const d = String(dateStr || '').split(' ')[0];
 return d.length >= 10 ? d.slice(8, 10) : '';
}

function renderCollections(year) {
 const totals = {};
 bills.forEach(b => {
  const bd = billDateStr(b);
  if (!bd || bd.indexOf(year + '-') !== 0) return;
  const monthIndex = bd.slice(5, 7);
  totals[monthIndex] = (totals[monthIndex] || 0) + getBillTotal(b);
 });

 const cards = monthShortNms.map((monthName, i) => {
  const m = String(i + 1).padStart(2, '0');
  const amt = totals[m] || 0;
  const amtText = '₹' + amt.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const hasMoney = amt > 0;
  return `
    <div class="col-6 col-md-3 mb-2">
     <div class="card text-center h-100 repCollMonthCard" data-month="${m}" role="button" tabindex="0"
      style="${hasMoney ? 'border:1px solid #28a745;' : 'border:1px solid #7e7e7eea;'}cursor:pointer;">
      <div class="card-body p-2">
       <div class="fw-bold text-uppercase small ${hasMoney ? 'text-primary' : 'text-muted'}">${monthName}</div>
       <div class="fw-bold ${hasMoney ? 'text-success' : 'text-muted'}" style="font-size:1.05rem;">${amtText}</div>
      </div>
     </div>
    </div>`;
 }).join('');

 const totalAmt = bills.reduce((sum, b) => {
  if (billDateStr(b).indexOf(year + '-') === 0) sum += getBillTotal(b);
  return sum;
 }, 0);

 const yearGrid = document.getElementById('repCollMonthGrid');
 if (yearGrid) yearGrid.innerHTML = cards;

 const totalEl = document.getElementById('repCollTotal');
 if (totalEl) totalEl.textContent = '₹' + totalAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 });
}

function showBillsForMonth(year, month) {
 const monthName = monthShortNms[parseInt(month, 10) - 1] || month;
 const modalTitle = document.getElementById('repCollModalTitle');
 if (modalTitle) modalTitle.textContent = `Collections — ${monthName} ${year}`;

 const monthBills = bills
  .filter(b => billDateStr(b).indexOf(year + '-' + month) === 0)
  .sort((a, b) => {
   const da = billDateStr(a);
   const db = billDateStr(b);
   if (da !== db) return da < db ? -1 : 1;
   const na = parseFloat(a.g) || 0;
   const nb = parseFloat(b.g) || 0;
   if (na !== nb) return na - nb;
   return String(a.g || '').localeCompare(String(b.g || ''));
  });

 const container = document.getElementById('repCollBillTable');
 if (!container) return;

 if (monthBills.length === 0) {
  container.innerHTML = '<p class="text-muted text-center py-3 mb-0">No bills in this month.</p>';
 } else {
  let total = 0;
  let received = 0;
  let outstanding = 0;
  const rows = monthBills.map(b => {
   const amt = getBillTotal(b);
   const rec = getBillReceived(b);
   const out = getBillOutstanding(b);
   total += amt;
   received += rec;
   outstanding += out;
   return `
    <tr class="border border-secondary">
  <td class="py-1">${formatBillDay(b.f)}</td>
  <td class="py-1">${b.g || ''}</td>
  <td class="py-1 text-end">₹${rec.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
  <td class="py-1 text-end">₹${out.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
  <td class="py-1 text-end">₹${amt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
</tr>`;
  }).join('');

  container.innerHTML = `
   <table class="table table-sm table-bordered mb-0">
    <thead class="table-light">
     <tr class="border border-secondary">
      <th>Date</th>
      <th>Bill</th>
      <th class="text-end">Received</th>
      <th class="text-end">Outstanding</th>
      <th class="text-end">Total</th>
     </tr>
    </thead>
    <tbody>${rows}
     <tr class="table-light fw-bold">
      <td colspan="2">Total</td>
      <td class="text-end text-primary">₹${received.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      <td class="text-end text-danger">₹${outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      <td class="text-end text-success">₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
     </tr>
    </tbody>
   </table>`;
 }

 const monthPanel = document.getElementById('repCollMonthPanel');
 const tablePanel = document.getElementById('repCollTablePanel');
 if (monthPanel) monthPanel.style.display = 'none';
 if (tablePanel) tablePanel.style.display = 'block';
}

async function set_rep_coll_innerHTML(...params) {
 return new Promise(async (resolve) => {
  // Check if Bootstrap modal is available
  if (typeof create_modal_dynamically !== 'function') {
   console.warn('create_modal_dynamically not available');
   resolve(false);
   return;
  }

  // Check if modals are suppressed
  if (window.suppressModals) {
   window.suppressModals = false;
   resolve(false);
   return;
  }

  try {
   const modalId = 'repCollModal_' + Date.now();
   const modalResult = create_modal_dynamically(modalId);
   if (!modalResult) {
    resolve(false);
    return;
   }

   const { contentElement, modalInstance, modalElement } = modalResult;

   setTimeout(() => {
    const md = modalElement.querySelector('.modal-dialog');
    if (md) {
     md.classList.remove('modal-dialog-centered');
     md.style.marginTop = '40px';
     md.style.maxWidth = '800px';
     md.style.width = '95%';
    }
    modalElement.style.zIndex = '1051';
   }, 50);

   let settled = false;

   // Show a loader while receipts load
   contentElement.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading...</p></div>`;
   modalInstance.show();

   await loadCollectionsData();

   const currentYear = new Date().getFullYear();
   const years = new Set();
   bills.forEach(b => {
    const y = validYear(billDateStr(b));
    if (y) years.add(y);
   });
   receipts.forEach(r => {
    const y = validYear(String(r.k || '').split(' ')[0]);
    if (y) years.add(y);
   });
   if (!years.has(currentYear)) years.add(currentYear);
   const yearOptions = [...years]
    .filter(y => y <= currentYear)
    .sort((a, b) => a - b)
    .map(y =>
     `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`
    ).join('');

   contentElement.innerHTML = `
                <div class="modal-header" style="padding:0.4rem 0.75rem;">
                    <h5 class="modal-title" id="repCollModalTitle">Collections</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding:0.25rem 0.5rem;">
                    <div id="repCollMonthPanel">
                        <div class="row g-2 mb-2">
                            <div class="col-auto">
                                <select id="repCollYearSel" class="form-select form-select-sm border border-dark">
                                    ${yearOptions}
                                </select>
                            </div>
                            <div class="col d-flex align-items-center justify-content-end">
                                <strong>Total: </strong>&nbsp;
                                <span id="repCollTotal" class="fw-bold text-success" style="font-size:1.1rem;">₹0.00</span>
                            </div>
                        </div>
                        <div class="row g-0" id="repCollMonthGrid"></div>
                    </div>
                    <div id="repCollTablePanel" style="display:none;">
                        <div class="row g-2 mb-2 align-items-center">
                            <div class="col-auto">
                                <button type="button" class="btn btn-sm btn-outline-secondary" id="repCollBackBtn">
                                    <i class="fas fa-arrow-left me-1"></i>Back
                                </button>
                            </div>
                        </div>
                        <div id="repCollBillTable"></div>
                    </div>
                </div>
                <div class="modal-footer" style="padding:0.4rem 0.75rem;">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
            `;

   renderCollections(currentYear);

   document.getElementById('repCollYearSel').addEventListener('change', function () {
    renderCollections(this.value);
   });

   document.getElementById('repCollMonthGrid').addEventListener('click', function (e) {
    const card = e.target.closest('.repCollMonthCard');
    if (!card) return;
    const yearSel = document.getElementById('repCollYearSel');
    showBillsForMonth(yearSel ? yearSel.value : currentYear, card.getAttribute('data-month'));
   });

   document.getElementById('repCollBackBtn').addEventListener('click', function () {
    const monthPanel = document.getElementById('repCollMonthPanel');
    const tablePanel = document.getElementById('repCollTablePanel');
    const modalTitle = document.getElementById('repCollModalTitle');
    if (monthPanel) monthPanel.style.display = 'block';
    if (tablePanel) tablePanel.style.display = 'none';
    if (modalTitle) modalTitle.textContent = 'Collections';
   });

   // Close/Cancel
   modalElement.addEventListener('hidden.bs.modal', function () {
    modalInstance.dispose();
    modalElement.remove();
    if (!settled) {
     settled = true;
     resolve(false);
    }
   }, { once: true });

   // Stop the loader now that the modal is visible
   settled = true;
   resolve(true);

  } catch (e) {
   console.error('Collections modal failed:', e);
   resolve(false);
  }
 });
}

// Make it globally accessible
window.set_rep_coll_innerHTML = set_rep_coll_innerHTML;
