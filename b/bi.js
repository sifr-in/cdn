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
                <div class="modal-body" style="padding:0.25rem 0.5rem;">
                    <div class="row g-0">
<div class="col-4">
<div class="input-group border border-dark rounded-2">
${window[my1uzr.worknOnPg].reqyTableInBills === 1 ? `<input type="text" class="form-control" style="padding-left:6.5px;" placeholder="Bill Number" id="billNumber2" required>
    ` : '<input type="text" class="form-control" style="padding-left:6.5px;" placeholder="Bill Number" id="billNumber2">'}
</div>
</div>
<div class="col-2 d-flex align-items-center">
<button class="btn btn-outline-secondary" onclick="" style="margin:0px;">
<i class="fas fa-eye"></i>
</button>
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
<button class="btn btn-primary" onclick="(async () => { await loadExe2Fn(27, [BillItemsFormcolsToHise,window.getItemListData], [1]);})();">
<i class="fas fa-plus-circle me-2"></i>Add Item to Bill
</button>
</div>
</div>

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
  const name = `${obj.i || ''} ${obj.h || ''}`.trim();
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
   + '</div>'
   + '<div class="col-3 text-end pe-1">'
   + '<div class="fw-bold" style="font-size:0.9rem;">₹' + price + '</div>'
   + '</div>'
   + '<div style="position:absolute;top:2px;end:2px;display:flex;gap:10px;">'
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
  el.focus();
  if (typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'center' });
 }
 if (typeof showToast === 'function') showToast(msg, { type: 'warning', duration: 2000 });
}

window.biSaveBillInward = async function () {
 try {
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
   return window.showelsemodal('Please add at least one item to the bill.');
  }

  const totalAmount = biBillItems.reduce(function (sum, it) {
   return sum + (parseFloat((it && it.s && it.s.h)) || 0);
  }, 0);

  const payload0 = window.payload0 || {};
  payload0.vw = 1;
  payload0.fn = -600;
  payload0.drml = 'sambodhisarang.in';
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

  const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
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

// Make it globally accessible
window.set_bill_Inverd_innerHTML = set_bill_Inverd_innerHTML;
window.commonFnToRunAfter_op_ViewCall2 = commonFnToRunAfter_op_ViewCall2;
