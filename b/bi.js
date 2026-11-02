// bill_inward_modal.js - Bill Inward Modal
const BillItemsFormcolsToHise = [1,1]; // if here 1,1 then first for hide category lable and input and second for hide patry selection label and input (including title "& Party")
let biBillItems = [];
let biActiveModalId = '';
let biEditIndex = -1;
async function set_bill_Inverd_innerHTML(...params) {
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
   const modalId = 'billInwardModal_' + Date.now();
   const modalResult = create_modal_dynamically(modalId);
   if (!modalResult) {
    resolve(false);
    return;
   }

   const { contentElement, modalInstance, modalElement } = modalResult;

   // Preload shoRegItm.js so 'Add Item to Bill' uses the normal item picker
   // on the very first click (otherwise it falls back to 'Add New Item').
   if (typeof window.showAddNormalItemModal !== 'function') {
    await new Promise((resolve) => {
     const s = document.createElement('script');
     s.src = 'shoRegItm.js';
     s.onload = resolve;
     s.onerror = resolve;
     document.head.appendChild(s);
    });
   }

   setTimeout(() => {
    const md = modalElement.querySelector('.modal-dialog');
    if (md) {
     md.classList.remove('modal-dialog-centered');
     md.style.marginTop = '80px';
     md.style.maxWidth = '600px';
    }
    modalElement.style.zIndex = '1051';
   }, 50);

   let settled = false;
   biBillItems = [];
  biActiveModalId = modalId;

  // Build your modal content here
   contentElement.innerHTML = `
                <div class="modal-header" style="padding:0.4rem 0.75rem;">
                    <h5 class="modal-title">Bill Inward</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bm-scope" style="padding:0.25rem 0.5rem;">
                    <div class="row g-0">
<div class="col-2 d-flex align-items-center">
<button class="btn btn-outline-secondary" onclick="window.biShowInwardBilledList()" style="margin:0px;">
<i class="fas fa-eye"></i>
</button>
</div>
<div class="col-4">
<div class="input-group border border-dark rounded-2">
${window[my1uzr.worknOnPg].reqyTableInBills === 1 ? `<input type="text" class="form-control" style="padding-left:6.5px;" placeholder="Bill Number" id="billNumber2" required>
    ` : '<input type="text" class="form-control" style="padding-left:6.5px;" placeholder="Bill Number" id="billNumber2">'}
</div>
</div>
<div class="col-6">
<input type="text" class="form-control border border-dark" id="receiptDate2" placeholder="Select Date & Time">
</div>
</div>

<div class="row g-0 mb-3 mt-2">
<div class="col-12">
<input id="p_dtls_lient1" type="text" class="form-control border border-dark" readonly onclick="(async () => { await loadExe2Fn(14, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_op_ViewCall2', 1], [1]); })()" placeholder="Party Details">
<input type="hidden" id="partyId1">
</div>
</div>

<div class="bm-subhead" style="margin-top:16px;">Added Items</div>
<div id="biAfterPartySection" style="display:none;">
<div class="row">
<div class="col-12">
<div id="billItemsContainer2" class="mb-3">
<!-- Items will be added here dynamically -->
</div>
</div>
</div>

<div id="dv_for_add_itm_btn2" class="row mb-3" style="display:none;">
<div class="col-12 text-center">
<button class="btn btn-primary" onclick="window.biOpenAddItemToBill()">
<i class="fas fa-plus-circle me-2"></i>Add Item to Bill
</button>
</div>
</div>
</div>

<div class="bm-subhead" style="margin-top:16px;">Notes &amp; Actions</div>
<div class="row mt-2">
    <div class="col-12 border">
        <div class="card border border-dark">
            <div class="card-body" style="padding:0.25rem;">
                <textarea class="form-control" id="billNotes2" rows="3"
                    placeholder="Set comment/note for this bill.\nWhile generating 'bill-print', u can decide whether to print this 'note' in bill;"></textarea>
            </div>
        </div>
        <div class="card border border-dark">
            <div class="card-body" style="padding:0.25rem;">
                <div class="row g-2">
                    <div class="col-4">
                        <button id="saveBtn2" class="btn btn-success w-100" onclick="window.biSaveBillInward()">
                            <i class="fas fa-save me-2"></i>Save
                        </button>
                    </div>
                    <div class="col-4">
                        <button class="btn btn-warning w-100" id="updateBtn2" onclick="" disabled>
                            <i class="fas fa-edit me-2"></i>Updt
                        </button>
                    </div>
                    <div class="col-4">
                        <button class="btn btn-info w-100" id="printBtn2" disabled
                            onclick=''>
                            <i class="fas fa-print me-2"></i>Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                </div>
                <!--div class="modal-footer" style="padding:0.4rem 0.75rem;">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div-->
            `;

   initializeBillDatePicker2();

   // Submit button
   const submitBtn = contentElement.querySelector('#' + modalId + '_submit');
   if (submitBtn) {
    submitBtn.addEventListener('click', function () {
     if (settled) return;
     settled = true;
     // Add your save logic here
     resolve(true);
     modalInstance.hide();
    });
   }

   // Close/Cancel
   modalElement.addEventListener('hidden.bs.modal', function () {
    modalInstance.dispose();
    modalElement.remove();
    if (!settled) {
     settled = true;
     resolve(false);
    }
   }, { once: true });

   modalInstance.show();

   // Keep modal height fixed whether the lower section is visible or hidden
   (function fixModalHeight() {
    const mdBody = contentElement.querySelector('.modal-body');
    const lowerSection = document.getElementById('biAfterPartySection');
    if (!mdBody || !lowerSection) return;
    const apply = function () {
     const wasHidden = lowerSection.style.display === 'none';
     if (wasHidden) lowerSection.style.display = 'block';
     const h = mdBody.offsetHeight + 200;
     if (wasHidden) lowerSection.style.display = 'none';
     if (h > 0) {
      mdBody.style.height = h + 'px';
      mdBody.style.minHeight = h + 'px';
      mdBody.style.overflowY = 'auto';
     }
    };
    requestAnimationFrame(apply);
    setTimeout(apply, 200);
   })();

   // Stop the loader now that the modal is visible
   settled = true;
   resolve(true);

  } catch (e) {
   console.error('Bill inward modal failed:', e);
   resolve(false);
  }
 });
}

function commonFnToRunAfter_op_ViewCall2(obj, swtch) {
 if (swtch === 1) {
  const name = `${obj.h || ''}`.trim();
  const mobile = obj.e || '';
  document.getElementById('p_dtls_lient1').value = name ? (mobile ? `${name} ${mobile}` : name) : mobile;
  document.getElementById('partyId1').value = obj.a;
  document.getElementById('dv_for_add_itm_btn2').style.display = "block";
  const biAfterParty = document.getElementById('biAfterPartySection');
  if (biAfterParty) biAfterParty.style.display = 'block';
 }
}

async function initializeBillDatePicker2() {
    const input = document.getElementById('receiptDate2');
    if (!input) return;

    try {
        await window.initDateTimePicker('receiptDate2', { autoNow: false });
    } catch (e) {
        console.error('Bill inward date picker failed:', e);
    }
}

window.getItemListData = function (...objjj) {
 const list = objjj.length === 1 && Array.isArray(objjj[0]) ? objjj[0] : objjj;
 if (Array.isArray(list)) biBillItems = biBillItems.concat(list);
 renderBillItemsList2(biBillItems);
};

window.biOpenAddItemToBill = function () {
 if (typeof window.showAddNormalItemModal === 'function') {
  window.showAddNormalItemModal(null, {
   onAdd: window.biAppendItemFromModal,
   onInventory: function (searchedName) {
    const inst = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
    if (inst) inst.hide();
    // Pass the searched product name through so the "Add New Item" modal
    // opens with "Enter product name" already filled in.
    let name = String(searchedName || '').trim();
    if (!name) {
     const nameEl = document.getElementById('modalItemName');
     name = nameEl ? String(nameEl.value || '').trim() : '';
    }
    const editData = name ? { p: { e: name }, s: {}, prefillOnly: true } : null;
    loadExe2Fn(27, [BillItemsFormcolsToHise, window.getItemListData, editData], [1]);
   }
  });
  return;
 }
 loadExe2Fn(27, [BillItemsFormcolsToHise, window.getItemListData], [1]);
};

window.biAppendItemFromModal = function (item) {
 if (!item) return;
 const image = item.imageUrl || '';
 const tax1 = parseFloat(item.tax1) || 0;
 const tax2 = parseFloat(item.tax2) || 0;
 const tax1Amount = parseFloat(item.tax1Amount) || 0;
 const tax2Amount = parseFloat(item.tax2Amount) || 0;
 const taxAmount = Math.round((tax1Amount + tax2Amount) * 100) / 100;
 const unitId = '';
 const row = {
  p: { a: item.itemId || '', e: item.name || 'Item', gu: image, ba_f: item.description || '', j: tax1, k: tax2 },
  s: { i: item.qty || 1, j: unitId, k: item.rate || 0, h: item.price || 0, l: image ? [image] : [], taxAmount: taxAmount, tax1Amount: tax1Amount, tax2Amount: tax2Amount }
 };
 biBillItems = Array.isArray(biBillItems) ? biBillItems : [];
 biBillItems.push(row);
 renderBillItemsList2(biBillItems);
};

function renderBillItemsList2(items) {
 const container = document.getElementById('billItemsContainer2');
 if (!container) return;
 if (!Array.isArray(items) || items.length === 0) return;

 const unitList = Array.isArray(window.UNIT_DATA) ? window.UNIT_DATA : [];

 container.innerHTML = items.map(function (it, index) {
  const p = (it && it.p) || {};
  const s = (it && it.s) || {};
  const name = p.e || 'Product';
  const qty = s.i || '';
  const unitId = String(s.j || '');
  const unit = unitList.find(function (u) { return String(u.a) === unitId; });
  const unitLabel = unit ? unit.e : unitId;
  const soldIn = Array.isArray(s.l) ? s.l : [];
  const rate = s.k || '';
  const image = soldInFirstImage(soldIn);
  const price = formatPrice2(s.h);

  const imgHtml = image
   ? '<img src="' + image + '" style="width:52px;height:52px;object-fit:cover;border-radius:4px;" onerror="this.style.display=\'none\';">'
   : '<i class="fas fa-box text-muted" style="font-size:1.8rem;"></i>';

  return '<div class="row g-0 border rounded mb-1 bill-item-row" style="background:#fff;position:relative;padding:4px 46px 4px 4px;align-items:center;">'
   + '<div class="col-3 text-center">' + imgHtml + '</div>'
   + '<div class="col-6">'
   + '<div class="fw-bold text-truncate" style="font-size:0.9rem;padding-right:8px;" title="' + name + '">' + name + '</div>'
   + '<div class="text-muted" style="font-size:0.8rem;">' + qty + ' ' + unitLabel + (rate !== '' ? ' / Rate-₹' + rate : '') + '</div>'
   + (p.ba_f ? '<div class="text-muted" style="font-size:0.75rem;font-style:italic;">' + p.ba_f + '</div>' : '')
   + ((parseFloat(s.taxAmount) || 0) > 0 ? '<div class="text-muted" style="font-size:0.75rem;">Tax: ₹' + formatPrice2(s.taxAmount) + ' (' + ( (parseFloat(p.j)||0) + (parseFloat(p.k)||0) ).toFixed(2) + '%)</div>' : '')
   + '</div>'
   + '<div class="col-3 text-end pe-1">'
   + '<div class="fw-bold" style="font-size:0.9rem;">₹' + price + '</div>'
   + '</div>'
   + '<div style="position:absolute; top:2px; display:flex; gap:10px; justify-content: flex-end; margin-right:6px;">'
   + '<i class="fas fa-pen text-primary" style="cursor:pointer;" title="Edit" onclick="window.biEditBillItem(' + index + ')"></i>'
   + '<i class="fas fa-times text-danger" style="cursor:pointer;" title="Cancel" onclick="window.biRemoveBillItem(' + index + ')"></i>'
   + '</div>'
   + '</div>';
 }).join('');
}

function soldInFirstImage(soldIn) {
 if (!Array.isArray(soldIn) || soldIn.length === 0) return '';
 const str = String(soldIn[0]);
 const m = str.match(/data:image\/[\w.+-]+;base64,[A-Za-z0-9+\/=]+/);
 if (m) return m[0];
 const u = str.match(/(?:https?:)?\/\/[^\s-]+/);
 return u ? u[0] : '';
}

window.biRemoveBillItem = function (index) {
 if (!Array.isArray(biBillItems)) return;
 if (index < 0 || index >= biBillItems.length) return;
 biBillItems.splice(index, 1);
 const container = document.getElementById('billItemsContainer2');
 if (biBillItems.length === 0) {
  if (container) container.innerHTML = '';
 } else {
  renderBillItemsList2(biBillItems);
 }
};

window.biEditBillItem = async function (index) {
 if (!Array.isArray(biBillItems) || index < 0 || index >= biBillItems.length) return;
 const item = biBillItems[index];
 biEditIndex = index;
 await loadExe2Fn(27, [BillItemsFormcolsToHise, window.getItemListDataUpdate, { p: item.p || {}, s: item.s || {}, index: index }], [1]);
};

window.getItemListDataUpdate = function (...objjj) {
 const list = objjj.length === 1 && Array.isArray(objjj[0]) ? objjj[0] : objjj;
 if (Array.isArray(list) && list.length > 0) {
  const idx = biEditIndex;
  if (idx >= 0 && idx < biBillItems.length) biBillItems[idx] = list[0];
 }
 biEditIndex = -1;
 renderBillItemsList2(biBillItems);
};

 function formatPrice2(v) {
 if (v === '' || v === null || v === undefined) return '';
 const n = parseFloat(v);
 if (isNaN(n)) return String(v);
 return n.toFixed(2);
}

function biValidateAndToast(elId, msg) {
 const el = document.getElementById(elId);
 if (el) {
  markInvalid(el);
  el.focus();
  if (typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'center' });
 }
 if (typeof showToast === 'function') showToast(msg, { type: 'warning', duration: 2000 });
}

window.biSaveBillInward = async function () {
 try {
  ['billNumber2','p_dtls_lient1'].forEach(function (id) { clearInvalid(document.getElementById(id)); });
  const billNo = (document.getElementById('billNumber2')?.value || '').trim();
  const receiptDate = (document.getElementById('receiptDate2')?.value || '').trim();
  const partyId = (document.getElementById('partyId1')?.value || '').trim();
  const notes = (document.getElementById('billNotes2')?.value || '').trim();

  const billNoRequired = window[my1uzr.worknOnPg]?.reqyTableInBills === 1;

  if (billNoRequired && !billNo) {
   return biValidateAndToast('billNumber2', 'Please enter Bill Number.');
  }
  if (!partyId) {
   return biValidateAndToast('p_dtls_lient1', 'Please select Party.');
  }

  if (!Array.isArray(biBillItems) || biBillItems.length === 0) {
   return window.showConfirmModal('Please add at least one item to the bill.');
  }

  const totalAmount = biBillItems.reduce(function (sum, it) {
   return sum + (parseFloat((it && it.s && it.s.h)) || 0);
  }, 0);

  const payload0 = window.payload0 || {};
  payload0.vw = 1;
  payload0.fn = 122;
  payload0.ul = "2/00.php";
  payload0.gt = 2;
  //drml must not be sent hence forth;
  //payload0.drml = 'sambodhisarang.in';
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'c' }, { "tb": 'b' }, { "tb": 'i' }, { "tb": 'r' }, { "tb": 'ba' }, { "tb": 'p' }, { "tb": 's' }]);
  payload0.ba = {
   e: partyId,
   f: receiptDate,
   g: billNo,
   h: totalAmount,
   i: notes
  };
  payload0.ob = biBillItems.map(function (it) {
   return { p: (it && it.p) || {}, s: (it && it.s) || {} };
  });

  console.log('bi.js Payload:', payload0);

  const response = await fnj4(null, payload0, 1, 1, null, 20000, 2, 1);
  if (response.su == 1) {
   if (typeof window.handl_op_rspons === 'function') window.handl_op_rspons(response, 0);
   if (typeof showToast === 'function') showToast('Bill saved successfully!', { type: 'success', duration: 2000 });
   const modalEl = document.getElementById(biActiveModalId);
   const inst = modalEl ? bootstrap.Modal.getInstance(modalEl) : null;
   if (inst) inst.hide();
  } else {
   let msg = response.ms || '';
   if (!msg && response.fn3 && response.fn3.r && Array.isArray(response.fn3.r) && response.fn3.r.length > 0) {
    msg = response.fn3.r[0].ms || '';
   }
   window.showelsemodal(msg || 'Failed to save bill.');
  }
 } catch (error) {
  console.error('bi.js save error:', error);
  if (typeof showToast === 'function') showToast('Error saving bill: ' + error.message, { type: 'error', duration: 2000 });
 }
};

window.biShowInwardBilledList = async function () {
 const modalId = 'biBilledList_' + Date.now();
 if (typeof create_modal_dynamically !== 'function') {
  if (typeof showToast === 'function') showToast('Modal system not available.', { type: 'error', duration: 2000 });
  return;
 }
 const modalResult = create_modal_dynamically(modalId);
 if (!modalResult) return;
 const { contentElement, modalInstance, modalElement } = modalResult;

 setTimeout(() => {
  const md = modalElement.querySelector('.modal-dialog');
  if (md) {
   md.classList.remove('modal-dialog-centered');
   md.style.marginTop = '80px';
   md.style.maxWidth = '760px';
  }
  modalElement.style.zIndex = '1051';
 }, 50);

 let ba = [], sold = [], clients = [];
 try { ba = await dbDexieManager.getAllRecords(dbnm, 'ba') || []; } catch (e) { console.error('bi list ba:', e); }
 try { sold = await dbDexieManager.getAllRecords(dbnm, 's') || []; } catch (e) { console.error('bi list s:', e); }
 try { clients = await dbDexieManager.getAllRecords(dbnm, 'c') || []; } catch (e) { console.error('bi list c:', e); }

 const unitList = Array.isArray(window.UNIT_DATA) ? window.UNIT_DATA : [];

 function clientName(id) {
  const c = clients.find(function (x) { return String(x.a) === String(id); });
  if (!c) return (id == null || id === '' ? '-' : String(id));
  return c.e || c.h || String(id);
 }

 function itemsFor(baId) {
  return sold.filter(function (x) { return String(x.f) === String(baId); });
 }

 const sorted = [...ba].sort(function (a, b) {
  return new Date(b.f || 0) - new Date(a.f || 0);
 });

 contentElement.innerHTML = `
  <div class="modal-header" style="padding:0.4rem 0.75rem;">
   <h5 class="modal-title"><i class="fas fa-list me-2"></i>Inward Bills</h5>
   <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="modal-body" style="padding:0.4rem 0.75rem;">
   <div class="input-group mb-2">
    <input type="text" class="form-control border border-dark" id="biBilledSearch" placeholder="Search by bill no, party, notes...">
    <span class="input-group-text p-0 border border-dark"><i class="fa-solid fa-magnifying-glass px-2"></i></span>
    <span class="input-group-text p-0 border border-dark">
     <button id="biBilledDateToggle" class="btn p-0 px-2 border-0" type="button"><i class="fa-solid fa-angle-right text-primary"></i></button>
    </span>
   </div>
   <div id="biBilledDateFilter" class="row g-2 mb-2" style="display:none;">
    <div class="col-6">
     <div class="d-flex align-items-center gap-2">
      <label class="mb-0 text-nowrap small">From</label>
      <input type="date" class="form-control form-control-sm border border-dark" id="biBilledFrom">
     </div>
    </div>
    <div class="col-6">
     <div class="d-flex align-items-center gap-2">
      <label class="mb-0 text-nowrap small">To</label>
      <input type="date" class="form-control form-control-sm border border-dark" id="biBilledTo">
     </div>
    </div>
   </div>
   <div id="biBilledList" style="max-height: calc(100vh - 260px); overflow-y: auto;"></div>
  </div>
  <div class="modal-footer" style="padding:0.4rem 0.75rem;">
   <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
  </div>
 `;

 const listEl = contentElement.querySelector('#biBilledList');
 const searchEl = contentElement.querySelector('#biBilledSearch');
 const fromEl = contentElement.querySelector('#biBilledFrom');
 const toEl = contentElement.querySelector('#biBilledTo');
 const toggleBtn = contentElement.querySelector('#biBilledDateToggle');
 const filterSec = contentElement.querySelector('#biBilledDateFilter');

 if (toggleBtn && filterSec) {
  toggleBtn.addEventListener('click', function () {
   const open = filterSec.style.display === 'none';
   filterSec.style.display = open ? 'flex' : 'none';
   const ic = toggleBtn.querySelector('i');
   if (ic) ic.className = open ? 'fa-solid fa-angle-down text-primary' : 'fa-solid fa-angle-right text-primary';
  });
 }

 function renderList() {
  const term = (searchEl.value || '').toLowerCase().trim();
  const from = fromEl.value ? new Date(fromEl.value) : null;
  const to = toEl.value ? new Date(toEl.value + 'T23:59:59') : null;
  let rows = sorted.filter(function (b) {
   if (term) {
    const hay = [b.g, b.e, b.i, b.f].map(function (x) { return x == null ? '' : String(x); }).join(' ').toLowerCase();
    if (hay.indexOf(term) === -1) return false;
   }
   if (from || to) {
    const d = new Date(b.f || 0);
    if (from && d < from) return false;
    if (to && d > to) return false;
   }
   return true;
  });

  if (!rows.length) {
   listEl.innerHTML = "<p class='text-muted text-center py-4'>No inward bills found</p>";
   return;
  }

  listEl.innerHTML = rows.map(function (b) {
   const its = itemsFor(b.a);
   const total = (b.h == null ? '' : formatPrice2(b.h));
   return '<div class="card mb-2 border" style="cursor:pointer;" data-ba="' + String(b.a) + '">'
    + '<div class="card-body p-2">'
    + '<div class="d-flex justify-content-between align-items-center">'
    + '<div style="min-width:0;">'
    + '<div class="fw-bold text-truncate">Bill No: ' + (b.g || '-') + '</div>'
    + '<small class="text-muted">' + (b.f || '') + ' · ' + clientName(b.e) + '</small>'
    + '</div>'
    + '<div class="text-end ms-2">'
    + '<div class="fw-bold text-success">₹' + total + '</div>'
    + '<small class="text-muted">' + its.length + ' item(s)</small>'
    + '</div>'
    + '</div>'
    + (b.i ? '<div class="text-muted small mt-1 text-truncate">' + b.i + '</div>' : '')
    + '</div>'
    + '</div>';
  }).join('');

  listEl.querySelectorAll('[data-ba]').forEach(function (card) {
   card.addEventListener('click', function () {
    const id = card.getAttribute('data-ba');
    const b = ba.find(function (x) { return String(x.a) === String(id); });
    if (b) window.biShowInwardBillDetail(b, itemsFor(b.a), unitList, clients);
   });
  });
 }

 if (searchEl) searchEl.addEventListener('input', renderList);
 if (fromEl) fromEl.addEventListener('change', renderList);
 if (toEl) toEl.addEventListener('change', renderList);
 renderList();

 modalInstance.show();
};

window.biShowInwardBillDetail = function (b, items, unitList, clients) {
 if (typeof create_modal_dynamically !== 'function') return;
 const modalResult = create_modal_dynamically('biBilledDetail_' + Date.now());
 if (!modalResult) return;
 const { contentElement, modalInstance, modalElement } = modalResult;

 const clientName = function (id) {
  const c = (clients || []).find(function (x) { return String(x.a) === String(id); });
  if (!c) return (id == null || id === '' ? '-' : String(id));
  return c.e || c.h || String(id);
 };

 setTimeout(() => {
  const md = modalElement.querySelector('.modal-dialog');
  if (md) { md.classList.remove('modal-dialog-centered'); md.style.maxWidth = '720px'; md.style.marginTop = '80px'; }
 }, 50);

 const unitLabel = function (id) {
  const u = (unitList || []).find(function (x) { return String(x.a) === String(id); });
  return u ? u.e : (id == null ? '' : String(id));
 };

 const itemRows = (items || []).map(function (it) {
  const p = (it && it.p) || {};
  const s = (it && it.s) || {};
  const name = it.gn || p.e || 'Product';
  const image = it.gu || p.gu || soldInFirstImage(Array.isArray(s.l) ? s.l : []);
  const imgHtml = image
   ? '<img src="' + image + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px;" onerror="this.style.display=\'none\';">'
   : '<i class="fas fa-box text-muted" style="font-size:1.4rem;"></i>';
  const tax1 = (it.tax1 != null ? it.tax1 : (p.j != null ? p.j : ''));
  const tax2 = (it.tax2 != null ? it.tax2 : (p.k != null ? p.k : ''));
  const taxStr = (tax1 !== '' || tax2 !== '') ? ('Tax: ' + tax1 + '% / ' + tax2 + '%') : '';
  return '<div class="row g-0 border rounded mb-1" style="background:#fff;padding:4px;align-items:center;">'
   + '<div class="col-2 text-center">' + imgHtml + '</div>'
   + '<div class="col-7">'
   + '<div class="fw-bold text-truncate" style="font-size:0.85rem;" title="' + name + '">' + name + '</div>'
   + '<div class="text-muted" style="font-size:0.75rem;">' + (s.i || '') + ' ' + unitLabel(s.j) + (s.k !== '' && s.k != null ? ' / Rate-₹' + s.k : '') + '</div>'
   + (s.ba_f || p.ba_f ? '<div class="text-muted" style="font-size:0.75rem;font-style:italic;">' + (s.ba_f || p.ba_f) + '</div>' : '')
   + (taxStr ? '<div class="text-muted" style="font-size:0.75rem;">' + taxStr + '</div>' : '')
   + '</div>'
   + '<div class="col-3 text-end pe-1">'
   + '<div class="fw-bold" style="font-size:0.85rem;">₹' + formatPrice2(s.h) + '</div>'
   + '</div>'
   + '</div>';
 }).join('');

 contentElement.innerHTML = `
  <div class="modal-header" style="padding:0.4rem 0.75rem;">
   <h5 class="modal-title">Inward Bill Details</h5>
   <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="modal-body" style="padding:0.4rem 0.75rem;">
   <div class="row g-2 mb-2">
    <div class="col-6"><strong>Bill No:</strong> ${b.g || '-'}</div>
    <div class="col-6"><strong>Date:</strong> ${b.f || '-'}</div>
    <div class="col-6"><strong>Party:</strong> ${clientName(b.e)}</div>
    <div class="col-6"><strong>Total:</strong> ₹${formatPrice2(b.h)}</div>
   </div>
   ${b.i ? '<div class="mb-2"><strong>Notes:</strong> <span class="text-muted">' + b.i + '</span></div>' : ''}
   <div class="bm-subhead" style="margin-top:8px;">Items (${items.length})</div>
   <div style="max-height: calc(100vh - 320px); overflow-y: auto;">
    ${itemRows || "<p class='text-muted text-center py-3'>No items</p>"}
   </div>
  </div>
  <div class="modal-footer" style="padding:0.4rem 0.75rem;">
   <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
  </div>
 `;

 modalInstance.show();
};

// Make it globally accessible
window.set_bill_Inverd_innerHTML = set_bill_Inverd_innerHTML;
window.commonFnToRunAfter_op_ViewCall2 = commonFnToRunAfter_op_ViewCall2;
