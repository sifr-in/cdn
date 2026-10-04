// get_data.js - Add New Product Modal (add-only, based on ed_prod.js flow + bi.js modal structure)
const imgObjDimensRqd2 = ["1920x1080px~1-511kb", "400x300px~1-31kb"];
(function () {
 'use strict';

 // Global flags
 let isProcessing = false;
 let BillItemsFormcolsToHise = [];
 let gdEditData = null;

 // ==================== UTILITY FUNCTIONS ====================

 if (typeof window.allowFloat !== 'function') {
  window.allowFloat = function (el, decimals = 2) {
   let v = el.value;
   v = v.replace(/[^0-9.]/g, '').slice(0, 11);
   const parts = v.split('.');
   if (parts.length > 2) {
    v = parts.shift() + '.' + parts.join('');
   }
   if (v.includes('.')) {
    const p = v.split('.');
    p[1] = p[1].substring(0, decimals);
    v = p[0] + '.' + p[1];
   }
   el.value = v;
  };
 }

 if (typeof window.allowHsnInput !== 'function') {
  window.allowHsnInput = function (el) {
   el.value = el.value.replace(/[^0-9]/g, '').slice(0, 8);
  };
 }

 window.gdMarkManual = function (el) {
  if (!el) return;
  if (el.value === '') {
   delete el.dataset.gdManual;
  } else {
   el.dataset.gdManual = '1';
  }
 };

 window.gdRecalcPurchaseAndTax = function () {
  const qtyEl = document.querySelector('[name="quantity_received"]');
  const rateEl = document.querySelector('[name="rate_per_qty"]');
  const tax1El = document.querySelector('[name="cgst_received"]');
  const tax2El = document.querySelector('[name="sgst_received"]');
  const purEl = document.querySelector('[name="purchase_price"]');
  const taxAmtEl = document.querySelector('[name="tax_amount"]');
  if (!qtyEl || !rateEl || !purEl || !taxAmtEl) return;

  const qty = parseFloat(qtyEl.value) || 0;
  const rate = parseFloat(rateEl.value) || 0;
  if (!(qty > 0) || !(rate > 0)) return;

  const t1 = parseFloat((tax1El ? tax1El.value : '').replace('%', '')) || 0;
  const t2 = parseFloat((tax2El ? tax2El.value : '').replace('%', '')) || 0;

  const base = qty * rate;
  const taxAmt = base * (t1 + t2) / 100;
  const purchase = base + taxAmt;

  if (!purEl.dataset.gdManual) purEl.value = purchase ? purchase.toFixed(2) : '';
  if (!taxAmtEl.dataset.gdManual) taxAmtEl.value = taxAmt ? taxAmt.toFixed(2) : '';
 };

 function gdGetNextProductId() {
  const products = window.prod_list || [];
  if (products.length === 0) return "1001";
  return String(Math.max(...products.map(p => parseInt(p.a) || 0)) + 1);
 }

 function gdGetCurrentDateTime() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
 }

 function handlePercentInput(input) {
  let value = input.value.replace(/[^0-9.]/g, '');
  const firstDot = value.indexOf('.');
  if (firstDot !== -1) {
   value = value.slice(0, firstDot + 1) + value.slice(firstDot + 1).replace(/\./g, '');
  }
  const parts = value.split('.');
  parts[0] = parts[0].slice(0, 3);
  if (parts.length > 1) parts[1] = parts[1].slice(0, 2);
  value = parts.join('.');

  let display = value;
  if (display && display.indexOf('.') !== -1) {
   const intPart = display.split('.')[0];
   const decPart = display.split('.')[1].padEnd(2, '0');
   display = intPart + '.' + decPart;
  }

  input.value = display ? display + '%' : '';
  const caretPos = input.value.length - (display ? 1 : 0);
  input.setSelectionRange(caretPos, caretPos);
 }

 function gdSyncImageBoxes() {
  const url = gdPickedImg1 || gdPickedImg2;
  const root = document.getElementById('gdPricingItemsContainer') || document;
  const addBox = root.querySelector('#addImageBox');
  const prevSection = root.querySelector('#imagePreviewSection');
  const preview = root.querySelector('#imagePreview');
  const previewName = root.querySelector('#imagePreviewName');
  const removeBtn = root.querySelector('#gdRemoveImageBtn');

  if (preview) {
   if (url) {
    preview.src = url;
   } else {
    preview.removeAttribute('src');
   }
  }
  if (previewName) previewName.textContent = url ? 'Image selected' : '';
  if (addBox) addBox.style.display = url ? 'none' : '';
  if (prevSection) prevSection.style.display = url ? 'block' : 'none';
  if (removeBtn) {
   removeBtn.style.display = url ? 'inline-flex' : 'none';
   removeBtn.onclick = function (e) {
    if (e) e.stopPropagation();
    gdPickedImg1 = '';
    gdPickedImg2 = '';
    gdSyncImageBoxes();
   };
  }
 }

 window.afterimagesetcallrun2 = function (obj) {
  gdPickedImg1 = (obj && (obj.g1 || obj.url)) || '';
  gdPickedImg2 = (obj && obj.g2) || '';
  gdSyncImageBoxes();
  gdUpdateSoldInPreview();
 };

 // ==================== PRICING ITEMS MANAGEMENT ====================

 let gdCurrentPricingItems = [];
 let gdPurchasePriceVal = '';
 let gdQtyReceivedVal = '';
 let gdRatePerQtyRcv = '';
 let tax1 = '';
 let tax2 = '';
 let hsn = '';
 let Tax_price = '';
 let gdPickedImg1 = '';
 let gdPickedImg2 = '';

 function gdUpdateSoldInPreview() {
  const previewDiv = document.getElementById('gdSoldInPreview');
  if (!previewDiv) return;

  const generatedArray = gdGenerateSoldInString();
  if (!generatedArray || generatedArray.length === 0) {
   previewDiv.style.display = 'none';
   previewDiv.innerHTML = '';
   return;
  }

  const card = document.createElement('div');
  card.className = 'd-flex align-items-center';
  card.style.cssText = 'border:1px solid #c8e6c9;background:#e8f5e9;padding:6px 8px;border-radius:8px;gap:10px;';

  const textContent = document.createElement('div');
  textContent.id = 'gdSoldInPreviewText';
  textContent.style.cssText = 'flex:1 1 auto;font-family:monospace;font-size:12px;line-height:1.5;white-space:pre-wrap;word-break:break-word;min-width:0;';
  textContent.textContent = generatedArray.join(';\n');
  card.appendChild(textContent);

  previewDiv.style.display = 'block';
  previewDiv.innerHTML = '';
  previewDiv.appendChild(card);
 }

 function gdAddPricingItem(data = null) {
  gdCurrentPricingItems.push({
   measuredIn: data?.measuredIn || '',
   sellingPrice: data?.sellingPrice || '',
   mrp: data?.mrp || '',
   packageSize: data?.packageSize || '',
   quantity: data?.quantity || '',
   minQty: data?.minQty || '',
   maxQty: data?.maxQty || '',
   g1: data?.g1 || '',
   g2: data?.g2 || ''
  });
  gdRenderPricingItemsList();
 }

 function gdRemovePricingItem(index) {
  gdCurrentPricingItems.splice(index, 1);
  gdRenderPricingItemsList();
 }

 function gdRenderPricingItemsList() {
  const container = document.getElementById('gdPricingItemsContainer');
  if (!container) return;

  const unitOptions = Array.isArray(window.UNIT_DATA) && window.UNIT_DATA.length > 0
   ? window.UNIT_DATA.map(unit => `<option value="${unit.a}">${unit.e} (${unit.f})</option>`).join('')
   : '';

  const unitOptionItems = Array.isArray(window.UNIT_DATA) && window.UNIT_DATA.length > 0
   ? window.UNIT_DATA.map(unit => `
    <div class="gd-unit-option" data-value="${unit.a}" data-name="${(unit.e + ' ' + unit.f).toLowerCase()}" role="option" tabindex="-1">
     <i class="fas fa-ruler me-1 text-info"></i>${unit.e} (${unit.f})
    </div>`).join('')
   : '<div class="gd-unit-empty">No units available</div>';

  let html = '';
  html += `
            <div class="pricing-item-form mt-2" style="background:#f8f9fa;padding:4px;border-radius:8px;border:1px solid #dee2e6;">
                <h6 class="fw-bold small mb-2"><i class="fas fa-plus-circle text-success me-1"></i>Add New Pricing Item</h6>

                <div id="gdPricingFieldsContainer">
                    <div class="row g-2 mb-2" id="gdStepMeasuredIn">
                        <div class="col-12">
                            <label class="form-label fw-bold small mb-0" title="Select the unit of measurement">
                                <i class="fas fa-ruler me-1 text-info"></i>Measured In<span class="text-danger">*</span>
                            </label>
                            <select id="gdNewMeasuredIn" class="gd-unit-hidden-select" title="Unit of measurement for this pricing item">
                                <option value="">Select Unit</option>
                                ${unitOptions}
                            </select>
                            <div class="gd-unit-wrap" id="gdMeasuredInWrap">
                                <div class="gd-unit-trigger" id="gdMeasuredInTrigger" role="button" tabindex="0">
                                    <i class="fas fa-search gd-unit-search-icon"></i>
                                    <span class="gd-unit-trigger-label" id="gdMeasuredInTriggerLabel">Select Unit</span>
                                    <i class="fas fa-times gd-unit-clear" id="gdMeasuredInClear" title="Clear selection" style="display:none;"></i>
                                    <i class="fas fa-chevron-down gd-unit-caret"></i>
                                </div>
                                <div class="gd-unit-panel  border border-dark" id="gdMeasuredInPanel" style="display:none;">
                                    <div class="gd-unit-searchbox">
                                        <i class="fas fa-search"></i>
                                        <input type="text" class="gd-unit-search border border-info" id="gdMeasuredInSearch" placeholder="Search unit..." autocomplete="off">
                                    </div>
                                    <div class="gd-unit-options" id="gdMeasuredInOptions">
                                        ${unitOptionItems}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row g-2 mb-2">
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Selling price per unit to customer">
                                <i class="fas fa-tag me-1 text-success"></i>Selling Pr<span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm" id="gdNewSellingPrice" oninput="window.allowFloat(this,2)"
                                placeholder="₹" min="0" step="0.01"
                                title="Price at which product will be sold to customer">
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Maximum Retail Price (printed price)">
                                <i class="fas fa-receipt me-1 text-warning"></i>MRP<span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm" id="gdNewMrp" oninput="window.allowFloat(this,2)"
                                placeholder="₹" min="0" step="0.01"
                                title="Maximum Retail Price - the printed price on product">
                        </div>
                    </div>

                    <div class="row g-2 mb-2">
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Size/weight of the package">
                                <i class="fas fa-box me-1 text-primary"></i>Packaging<span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm" id="gdNewPackageSize" oninput="window.allowFloat(this,3)"
                                placeholder="" min="1"
                                title="Size of the package (e.g., 250 for 250gm)">
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Quantity to add per increment when purchasing">
                                <i class="fas fa-plus-circle me-1 text-info"></i>Qty Count +/-
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm pricing-field" id="gdNewQtyInc"
                                placeholder="" min="1"
                                title="Increment quantity - each click adds this much (e.g., +2)">
                        </div>
                    </div>

                    <div class="row g-2 mb-2">
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Minimum quantity that must be purchased (cannot be less than Qty Increment)">
                                <i class="fas fa-arrow-down me-1 text-danger"></i>Min Qty
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm pricing-field" id="gdNewMinQty"
                                placeholder="" min="1" value=""
                                title="Minimum purchase quantity - must be >= Qty Increment and multiple of Qty Increment">
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Maximum quantity that can be purchased (must be a multiple of Qty Increment)">
                                <i class="fas fa-arrow-up me-1 text-secondary"></i>Max Qty
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm pricing-field" id="gdNewMaxQty"
                                placeholder="" min="1" value=""
                                title="Maximum purchase quantity limit">
                        </div>
                    </div>
    <div class="container-fluid px-1 d-none">
    <div class="card">
        <div class="card-body p-1" onclick="(async () => { await loadExe2Fn(24, [afterimagesetcallrun2, imgObjDimensRqd2], [1]); })();">

            <!-- Add Image Box -->
            <div id="addImageBox"
                 class="border border-dark rounded text-center d-flex flex-column justify-content-center align-items-center"
                 style="min-height:150px; cursor:pointer;">

                <i class="fas fa-image mb-1 text-primary" style="font-size:2rem;"></i>
                <span class="fw-bold">Add Image</span>
            </div>

            <!-- Preview Section -->
            <div id="imagePreviewSection"
                 class="mt-1"
                 style="display:none;">

                <div class="border border-dark rounded p-1 text-center">
                    <img id="imagePreview"
                         src=""
                         alt="Image Preview"
                         style="max-width:100%; height:auto; display:block; margin:auto;">

                    <div class="mt-1">
                        <span id="imagePreviewName" class="small text-muted"></span>
                        <button type="button" id="gdRemoveImageBtn"
                                class="btn btn-sm btn-outline-danger ms-1"
                                title="Remove image"
                                style="padding:0 6px;display:none;">
                            <i class="fas fa-times me-1 mt-1"></i>Remove
                        </button>
                    </div>
                </div>

            </div>

        </div>
    </div>
</div>
                </div>

                <button type="button" class="btn btn-sm btn-success mt-2" id="gdBtnAddPricing" style="display:none;" onclick="window.getDataSaveNewPricingItem()">
                    <i class="fas fa-plus me-1"></i>Add This Pricing
                </button>
                <div id="gdPricingValidationMsg" class="text-danger small mt-1 ml-3" style="display:none;"></div>
            </div>`;

  gdCurrentPricingItems.forEach((item, index) => {
   const unitName = (Array.isArray(window.UNIT_DATA) ? window.UNIT_DATA.find(u => u.a == item.measuredIn)?.e : '') || 'Not set';
   html += `
                    <div class="pricing-item-saved mb-2" style="background:#e8f5e9;padding:5px;border-radius:8px;border:1px solid #c8e6c9;">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="badge bg-primary me-2">${unitName}</span>
                                <strong>₹${item.sellingPrice}</strong> @ MRP ₹${item.mrp} |
                                Size: ${item.packageSize} | Inc: ${item.quantity} |
                                Min: ${item.minQty} | Max: ${item.maxQty}
                            </div>
                            <button type="button" class="btn btn-sm btn-outline-danger"
                                    onclick="window.getDataRemovePricingItem(${index})" title="Remove this pricing">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>`;
  });

  container.innerHTML = html;

  setTimeout(function () {
   const numberInputs = container.querySelectorAll('.pricing-field');
   numberInputs.forEach(input => {
    input.addEventListener('input', function () {
     this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
    });
   });
  }, 50);

  setTimeout(function () {
   gdSetupPricingItemsHandlers();
  }, 150);

  gdUpdateSoldInPreview();
  gdSyncImageBoxes();
 }

 window.getDataSaveNewPricingItem = function () {
  const measuredIn = document.getElementById('gdNewMeasuredIn')?.value || '';
  const sellingPrice = document.getElementById('gdNewSellingPrice')?.value || '';
  const mrp = document.getElementById('gdNewMrp')?.value || '';
  const packageSize = document.getElementById('gdNewPackageSize')?.value || '';
  const quantity = document.getElementById('gdNewQtyInc')?.value || '';
  const minQty = document.getElementById('gdNewMinQty')?.value || '';
  const maxQty = document.getElementById('gdNewMaxQty')?.value || '';

  if (!measuredIn) {
   if (typeof showToast === 'function') showToast('Please select Measured In', { type: 'warning', duration: 2000 });
   return;
  }
  if (!sellingPrice || !mrp || !packageSize) {
   if (typeof showToast === 'function') showToast('Please fill all required fields', { type: 'warning', duration: 2000 });
   return;
  }

  const qtyInc = parseInt(quantity) || 1;
  const minQtyVal = parseInt(minQty) || 1;
  const maxQtyVal = parseInt(maxQty) || 10;

  if (quantity && minQtyVal < qtyInc) {
   if (typeof showToast === 'function') showToast('Min Qty cannot be less than Qty Increment', { type: 'warning', duration: 2000 });
   return;
  }
  if (quantity && maxQtyVal < minQtyVal) {
   if (typeof showToast === 'function') showToast('Max Qty cannot be less than Min Qty', { type: 'warning', duration: 2000 });
   return;
  }
  if (quantity && maxQtyVal % qtyInc !== 0) {
   if (typeof showToast === 'function') showToast('Max Qty must be a multiple of Qty Increment (' + qtyInc + ')', { type: 'warning', duration: 2000 });
   return;
  }
  if (quantity && minQtyVal % qtyInc !== 0) {
   if (typeof showToast === 'function') showToast('Min Qty must be a multiple of Qty Increment (' + qtyInc + ')', { type: 'warning', duration: 2000 });
   return;
  }

  gdAddPricingItem({
   measuredIn: measuredIn,
   sellingPrice: sellingPrice,
   mrp: mrp,
   packageSize: packageSize,
   quantity: quantity,
   minQty: minQty,
   maxQty: maxQty,
   g1: gdPickedImg1,
   g2: gdPickedImg2
  });

  gdPickedImg1 = '';
  gdPickedImg2 = '';
  gdSyncImageBoxes();

  if (typeof showToast === 'function') showToast('Pricing item added', { type: 'success', duration: 1000 });
 };

 window.getDataRemovePricingItem = gdRemovePricingItem;

 function gdGenerateSoldInString() {
  const arr = [];

  gdCurrentPricingItems.forEach(item => {
   if (!item.measuredIn) return;
   const images = [item.g1, item.g2].filter(Boolean).join(' ');
   arr.push(`${item.measuredIn}~${item.packageSize}-${item.sellingPrice}-${item.mrp}-${images}-${item.quantity}-${item.minQty}-${item.maxQty}`);
  });

  return arr;
 }

 // For add-only modal: always start with empty pricing items
 function gdInitPricingItemsForEdit() {
  gdCurrentPricingItems = [];
  gdRenderPricingItemsList();
 }

 function gdParseSoldInString(str) {
  if (!str) return null;
  const parts = String(str).split('~');
  if (parts.length !== 2) return null;
  const measuredIn = parts[0];
  const rest = parts[1];
  const m = rest.match(/^([\d.]*)-([\d.]*)-([\d.]*)-(.*)-([\d.]*)-([\d.]*)-([\d.]*)$/);
  if (!m) return null;
  const images = m[4].trim();
  const imgs = images ? images.split(/\s+/) : [];
  return {
   measuredIn: measuredIn,
   packageSize: m[1],
   sellingPrice: m[2],
   mrp: m[3],
   g1: imgs[0] || '',
   g2: imgs[1] || '',
   quantity: m[5],
   minQty: m[6],
   maxQty: m[7]
  };
 }

 function gdPreparePricingItems(editData) {
  if (editData && Array.isArray(editData.s && editData.s.l)) {
   gdCurrentPricingItems = editData.s.l
    .map(function (str) { return gdParseSoldInString(str); })
    .filter(function (it) { return !!it; });
  } else {
   gdCurrentPricingItems = [];
  }
  gdRenderPricingItemsList();
 }

 function gdInitUnitPicker(opts) {
  const wrap = document.getElementById(opts.wrapId);
  const trigger = document.getElementById(opts.triggerId);
  const triggerLabel = document.getElementById(opts.triggerLabelId);
  const clearBtn = document.getElementById(opts.clearId);
  const panel = document.getElementById(opts.panelId);
  const searchInput = document.getElementById(opts.searchId);
  const optionsBox = document.getElementById(opts.optionsId);
  const select = document.getElementById(opts.selectId);
  if (!wrap || !trigger || !select) return;

  const alreadyInit = wrap.getAttribute('data-gd-unit-init') === '1';
  wrap.setAttribute('data-gd-unit-init', '1');

  function syncTrigger() {
   const val = select.value;
   if (val) {
    const unit = (Array.isArray(window.UNIT_DATA) ? window.UNIT_DATA.find(u => u.a == val) : null);
    if (triggerLabel) triggerLabel.textContent = unit ? (unit.e + ' (' + unit.f + ')') : 'Select Unit';
    if (clearBtn) clearBtn.style.display = 'inline-flex';
   } else {
    if (triggerLabel) triggerLabel.textContent = 'Select Unit';
    if (clearBtn) clearBtn.style.display = 'none';
   }
  }

  function closePanel() {
   if (panel) panel.style.display = 'none';
   if (searchInput) searchInput.value = '';
   if (optionsBox) optionsBox.querySelectorAll('.gd-unit-option').forEach(opt => { opt.style.display = ''; });
  }

  function openPanel() {
   if (panel) {
    panel.style.display = 'block';
    if (searchInput) {
     searchInput.value = '';
     searchInput.focus();
    }
    if (optionsBox) optionsBox.querySelectorAll('.gd-unit-option').forEach(opt => { opt.style.display = ''; });
   }
  }

  if (!alreadyInit) {
   if (trigger) {
    trigger.addEventListener('click', function (e) {
     e.stopPropagation();
     if (panel && panel.style.display === 'block') {
      closePanel();
     } else {
      openPanel();
     }
    });
    trigger.addEventListener('keydown', function (e) {
     if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      trigger.click();
     }
    });
   }

   if (clearBtn) {
    clearBtn.addEventListener('click', function (e) {
     e.stopPropagation();
     select.value = '';
     syncTrigger();
     opts.onChange && opts.onChange();
    });
   }

   if (searchInput) {
    searchInput.addEventListener('input', function () {
     const q = this.value.trim().toLowerCase();
     const optsEls = optionsBox ? optionsBox.querySelectorAll('.gd-unit-option') : [];
     let visible = 0;
     optsEls.forEach(opt => {
      const match = !q || (opt.getAttribute('data-name') || '').indexOf(q) > -1;
      opt.style.display = match ? '' : 'none';
      if (match) visible++;
     });
     if (optionsBox) {
      let emptyEl = optionsBox.querySelector('.gd-unit-empty-filtered');
      if (visible === 0) {
       if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'gd-unit-empty gd-unit-empty-filtered';
        emptyEl.textContent = 'No results found';
        optionsBox.appendChild(emptyEl);
       }
       emptyEl.style.display = 'block';
      } else if (emptyEl) {
       emptyEl.style.display = 'none';
      }
     }
    });
    searchInput.addEventListener('keydown', function (e) {
     if (e.key === 'ArrowDown') {
      e.preventDefault();
      const optsEls = optionsBox ? Array.from(optionsBox.querySelectorAll('.gd-unit-option')).filter(o => o.style.display !== 'none') : [];
      if (optsEls.length > 0) optsEls[0].focus();
     } else if (e.key === 'Escape') {
      closePanel();
     }
    });
   }

   if (optionsBox) {
    optionsBox.querySelectorAll('.gd-unit-option').forEach(opt => {
     opt.addEventListener('click', function (e) {
      e.stopPropagation();
      select.value = this.getAttribute('data-value');
      syncTrigger();
      closePanel();
      opts.onChange && opts.onChange();
     });
     opt.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
       e.preventDefault();
       this.click();
      } else if (e.key === 'ArrowDown') {
       e.preventDefault();
       const optsEls = Array.from(optionsBox.querySelectorAll('.gd-unit-option')).filter(o => o.style.display !== 'none');
       const idx = optsEls.indexOf(this);
       if (idx < optsEls.length - 1) optsEls[idx + 1].focus();
      } else if (e.key === 'ArrowUp') {
       e.preventDefault();
       const optsEls = Array.from(optionsBox.querySelectorAll('.gd-unit-option')).filter(o => o.style.display !== 'none');
       const idx = optsEls.indexOf(this);
       if (idx > 0) optsEls[idx - 1].focus();
       else if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape') {
       closePanel();
      }
     });
    });
   }

   if (!window._gdOutsideClickHandler) {
    window._gdOutsideClickHandler = function (e) {
     document.querySelectorAll('.gd-unit-panel').forEach(panelEl => {
      const w = panelEl.closest('.gd-unit-wrap');
      if (w && !w.contains(e.target)) panelEl.style.display = 'none';
     });
    };
    document.addEventListener('click', window._gdOutsideClickHandler);
   }
  }

  syncTrigger();
 }

 function gdSetupPricingItemsHandlers() {
  const container = document.getElementById('gdPricingItemsContainer');
  if (!container) return;

  const measuredInSelect = document.getElementById('gdNewMeasuredIn');
  const fieldsContainer = document.getElementById('gdPricingFieldsContainer');
  const btnAdd = document.getElementById('gdBtnAddPricing');
  const msgDiv = document.getElementById('gdPricingValidationMsg');

  if (!measuredInSelect) return;

  function checkFormValidity() {
   let valid = true;
   let msg = '';

   const sellingPrice = document.getElementById('gdNewSellingPrice')?.value;
   const mrp = document.getElementById('gdNewMrp')?.value;
   const packageSize = document.getElementById('gdNewPackageSize')?.value;
   const qtyInc = document.getElementById('gdNewQtyInc')?.value;
   const minQty = document.getElementById('gdNewMinQty')?.value;
   const maxQty = document.getElementById('gdNewMaxQty')?.value;
   const measuredIn = document.getElementById('gdNewMeasuredIn')?.value;

   const minQtyInput = document.getElementById('gdNewMinQty');
   const maxQtyInput = document.getElementById('gdNewMaxQty');
   const btnAddBtn = document.getElementById('gdBtnAddPricing');
   const msgDivEl = document.getElementById('gdPricingValidationMsg');

   if (minQtyInput) minQtyInput.style.borderColor = '';
   if (maxQtyInput) maxQtyInput.style.borderColor = '';

   if (!measuredIn) {
    valid = false;
    msg = 'Please select Measured In.';
   } else if (!sellingPrice || !mrp || !packageSize) {
    valid = false;
    msg = 'Please fill all required fields.';
   } else {
    const qtyIncNum = parseInt(qtyInc) || 1;
    const minQtyNum = parseInt(minQty) || 1;
    const maxQtyNum = parseInt(maxQty) || 10;

    if (qtyInc && minQtyNum < qtyIncNum) {
     valid = false;
     msg = 'Min Qty cannot be less than Qty Increment.';
     if (minQtyInput) minQtyInput.style.borderColor = '#dc3545';
    } else if (qtyInc && maxQtyNum < minQtyNum) {
     valid = false;
     msg = 'Max Qty cannot be less than Min Qty.';
     if (maxQtyInput) maxQtyInput.style.borderColor = '#dc3545';
    } else if (qtyInc && maxQtyNum % qtyIncNum !== 0) {
     valid = false;
     msg = 'Max Qty must be a multiple of Qty Increment (' + qtyIncNum + ').';
     if (maxQtyInput) maxQtyInput.style.borderColor = '#dc3545';
    } else if (qtyInc && minQtyNum % qtyIncNum !== 0) {
     valid = false;
     msg = 'Min Qty must be a multiple of Qty Increment (' + qtyIncNum + ').';
     if (minQtyInput) minQtyInput.style.borderColor = '#dc3545';
    }
   }

   if (btnAddBtn) {
    btnAddBtn.style.display = valid ? 'inline-block' : 'none';
   }
   if (msgDivEl) {
    const hasAddedItems = gdCurrentPricingItems.length > 0;
    if (hasAddedItems) {
     msgDivEl.style.display = 'none';
    } else {
     msgDivEl.style.display = valid ? 'none' : 'block';
     if (!valid) msgDivEl.textContent = msg;
    }
   }

   return valid;
  }

  function gdRunUnitChange() {
   if (document.getElementById('gdNewMeasuredIn')?.value) {
    checkFormValidity();
   } else {
    const btnAddBtn = document.getElementById('gdBtnAddPricing');
    const msgDivEl = document.getElementById('gdPricingValidationMsg');
    if (btnAddBtn) btnAddBtn.style.display = 'none';
    if (msgDivEl) msgDivEl.style.display = 'none';
   }
  }

  gdInitUnitPicker({
   selectId: 'gdNewMeasuredIn',
   wrapId: 'gdMeasuredInWrap',
   triggerId: 'gdMeasuredInTrigger',
   triggerLabelId: 'gdMeasuredInTriggerLabel',
   clearId: 'gdMeasuredInClear',
   panelId: 'gdMeasuredInPanel',
   searchId: 'gdMeasuredInSearch',
   optionsId: 'gdMeasuredInOptions',
   onChange: gdRunUnitChange
  });

  gdInitUnitPicker({
   selectId: 'gdNewRcvdMeasuredIn',
   wrapId: 'gdRcvdMeasuredInWrap',
   triggerId: 'gdRcvdMeasuredInTrigger',
   triggerLabelId: 'gdRcvdMeasuredInTriggerLabel',
   clearId: 'gdRcvdMeasuredInClear',
   panelId: 'gdRcvdMeasuredInPanel',
   searchId: 'gdRcvdMeasuredInSearch',
   optionsId: 'gdRcvdMeasuredInOptions',
   onChange: gdRunUnitChange
  });

  setTimeout(function () {
   const allFields = document.querySelectorAll('#gdPricingFieldsContainer .pricing-field');
   allFields.forEach(field => {
    const newField = field.cloneNode(true);
    field.parentNode.replaceChild(newField, field);

    newField.addEventListener('input', function () {
     this.value = this.value.replace(/[^0-9]/g, '');
     checkFormValidity();
    });
   });

   const qtyIncInput = document.getElementById('gdNewQtyInc');
   if (qtyIncInput) {
    const newQtyInc = qtyIncInput.cloneNode(true);
    qtyIncInput.parentNode.replaceChild(newQtyInc, qtyIncInput);
    newQtyInc.addEventListener('input', function () {
     this.value = this.value.replace(/[^0-9]/g, '');
     checkFormValidity();
    });
   }

   document.querySelectorAll('#gdPricingFieldsContainer input').forEach(input => {
    input.addEventListener('input', checkFormValidity);
   });
  }, 100);

  setTimeout(checkFormValidity, 200);
 }


 // ==================== PARTY SELECTION CALLBACK ====================

 function commonFnToRunAfter_op_ViewCallGD(obj, swtch) {
  if (swtch === 1) {
   const partyInput = document.getElementById('gdPartyInput');
   const partyIdInput = document.getElementById('gdPartyId');
   if (partyInput) partyInput.value = obj.i || obj.h || obj.e || 'Unknown';
   if (partyIdInput) partyIdInput.value = obj.a;
   const dvBtn = document.getElementById('gdDvForAddItmBtn');
   if (dvBtn) dvBtn.style.display = 'block';

   if (typeof removeAllBackdrops === 'function') removeAllBackdrops();
   if (window._fpNavStack && window._fpNavStack.length > 0) {
    var topId = window._fpNavStack[window._fpNavStack.length - 1];
    if (topId && topId.indexOf('entind_modal_') === 0) {
     window._fpNavStack.pop();
     var topEl = document.getElementById(topId);
     if (topEl) { topEl.dispatchEvent(new Event('fp-close')); topEl.remove(); }
    }
    if (window._fpNavStack.length > 0) {
     var prevId = window._fpNavStack[window._fpNavStack.length - 1];
     var prevEl = document.getElementById(prevId);
     if (prevEl) prevEl.style.display = 'block';
    }
   }

   if (typeof showToast === 'function') showToast(`Party selected: ${obj.h || obj.i || obj.e}`, { type: 'success', duration: 2000 });
  } else {
   alert("Please Select a valid option");
  }
 }

 // ==================== FORM HTML ====================

 function gdBuildItemFormHTML(fd, categoryOptions, isEdit) {
  const hideCategory = BillItemsFormcolsToHise[0] === 1;
  const hideParty = BillItemsFormcolsToHise[1] === 1;
  const unitOptions = Array.isArray(window.UNIT_DATA) && window.UNIT_DATA.length > 0
   ? window.UNIT_DATA.map(unit => `<option value="${unit.a}">${unit.e} (${unit.f})</option>`).join('')
   : '';
  const unitOptionItems = Array.isArray(window.UNIT_DATA) && window.UNIT_DATA.length > 0
   ? window.UNIT_DATA.map(unit => `
    <div class="gd-unit-option" data-value="${unit.a}" data-name="${(unit.e + ' ' + unit.f).toLowerCase()}" role="option" tabindex="-1">
     <i class="fas fa-ruler me-1 text-info"></i>${unit.e} (${unit.f})
    </div>`).join('')
   : '<div class="gd-unit-empty">No units available</div>';
  return `
    <div class="p-2">
        <div class="modal-header" style="padding:0.4rem 0.75rem;">
            <h5 class="modal-title">
                ${isEdit
                 ? '<i class="fas fa-pen me-2 text-primary"></i>Edit Item'
                 : '<i class="fas fa-plus-circle me-2 text-primary"></i>Add New Item'}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <form id="gdItemForm">
            <h6 class="text-primary mb-2"><i class="fas fa-box me-2"></i>Item Information</h6>

            <div class="row g-2 mb-3 inputbox2">
                <div class="col-12">
                    <label class="form-label fw-bold small mb-1">Product Name <span class="text-danger">*</span></label>
                    <input type="text" name="e" class="form-control inputbox form-control-sm"
                           value="${fd.e}" placeholder="Enter product name"
                           required>
                </div>
                ${!hideCategory ? `
                <div class="col-12">
                    <label class="form-label fw-bold small mb-1">Category</label>
                    <select name="f" class="form-select inputbox form-select-sm">
                        <option value="">Select Category</option>
                        ${categoryOptions}
                    </select>
                </div>` : ''}
                <div class="row g-2 mb-2">
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Harmonized System of Nomenclature">
                               HSN
                            </label>
                            <input type="text" name="hsn_price" class="form-control inputbox form-control-sm" oninput="window.allowHsnInput(this)"
                                value="${hsn}" placeholder="code" maxlength="8"
                                title="HSN at which the product was purchased">
                        </div>
                        <div class="col-3">
                            <label class="form-label fw-bold small mb-0" title="CGST">
                                Tax1
                            </label>
                            <input type="text" name="cgst_received" class="form-control inputbox form-control-sm"
                                oninput="handlePercentInput(this);gdRecalcPurchaseAndTax()" autocorrect="off"
                                value="${tax1}" placeholder="%"
                                title="CGST of this product received">
                        </div>
                        <div class="col-3">
                            <label class="form-label fw-bold small mb-0" title="SGST">
                                Tax2
                            </label>
                            <input type="text" name="sgst_received" class="form-control inputbox form-control-sm"
                                oninput="handlePercentInput(this);gdRecalcPurchaseAndTax()" autocorrect="off"
                                value="${tax2}" placeholder="%"
                                title="SGST of this product received">
                        </div>
                </div>
            </div>

            <hr>
            ${!hideParty ? `
            <h6 class="text-success mb-2"><i class="fas fa-truck me-2"></i>Stock & Party Details</h6>
            
            <div class="row g-2 mb-3 inputbox2">
                <div class="col-12">
                    <label class="form-label fw-bold small mb-1">Party (From whom received)</label>
                    <input id="gdPartyInput" name="stock_party_id" class="form-control inputbox form-control-sm"
                        readonly onclick="(async () => { await loadExe2Fn(22, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_op_ViewCallGD', 1], [1]); })()"
                        placeholder="Click to select Party" value="${fd.stock_party_name || ''}">
                    <input type="hidden" id="gdPartyId" value="${fd.stock_party_id || ''}">
                    <div id="gdDvForAddItmBtn" style="display:${fd.stock_party_id ? 'block' : 'none'};margin-top:5px;">
                        <small class="text-success"><i class="fas fa-check-circle"></i> Party selected</small>
                    </div>
                </div>
            </div>` : ''}
            
            <div class="row g-2 mb-3 inputbox2">
                <h6 class="fw-bold small mb-2"><i class="fas fa-plus-circle text-success me-1"></i>Purchase Details</h6>

                <div class="col-12">
                    <div class="row g-2 mb-2">
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Unit in which the received quantity is counted">
                                <i class="fas fa-inbox me-1 text-warning"></i>Measured-In<span class="text-danger">*</span>
                            </label>
                            <select id="gdNewRcvdMeasuredIn" class="gd-unit-hidden-select mt-1" title="Unit of measurement for received quantity">
                                <option value="">Select Unit</option>
                                ${unitOptions}
                            </select>
                            <div class="gd-unit-wrap" id="gdRcvdMeasuredInWrap">
                                <div class="gd-unit-trigger" id="gdRcvdMeasuredInTrigger" role="button" tabindex="0">
                                    <i class="fas fa-search gd-unit-search-icon"></i>
                                    <span class="gd-unit-trigger-label" id="gdRcvdMeasuredInTriggerLabel">Select Unit</span>
                                    <i class="fas fa-times gd-unit-clear" id="gdRcvdMeasuredInClear" title="Clear selection" style="display:none;"></i>
                                    <i class="fas fa-chevron-down gd-unit-caret"></i>
                                </div>
                                <div class="gd-unit-panel border border-dark" id="gdRcvdMeasuredInPanel" style="display:none;">
                                    <div class="gd-unit-searchbox">
                                        <i class="fas fa-search"></i>
                                        <input type="text" class="gd-unit-search border border-info" id="gdRcvdMeasuredInSearch" placeholder="Search unit..." autocomplete="off">
                                    </div>
                                    <div class="gd-unit-options" id="gdRcvdMeasuredInOptions">
                                        ${unitOptionItems}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-3">
                            <label class="form-label fw-bold small mb-0" title="Quantity of this product received">
                                Qty<span class="text-danger">*</span>
                            </label>
                            <input type="text" name="quantity_received" class="form-control inputbox form-control-sm"
                                oninput="this.value=this.value.replace(/[^0-9]/g,'').slice(0,5);gdRecalcPurchaseAndTax()" autocorrect="off"
                                value="${gdQtyReceivedVal}" placeholder="" required
                                title="Quantity of this product received">
                        </div>
                        <div class="col-3">
                            <label class="form-label fw-bold small mb-0" title="Rate as per 1 quantity received">
                                Rate<span class="text-danger">*</span>
                            </label>
                            <input type="text" name="rate_per_qty" class="form-control inputbox form-control-sm"
                                oninput="this.value=this.value.replace(/[^0-9]/g,'').slice(0,7);gdRecalcPurchaseAndTax()" autocorrect="off"
                                value="${gdRatePerQtyRcv}" placeholder="₹" required
                                title="Rate as per 1 quantity received">
                        </div>
                    </div>
                    <div class="row g-2 mb-2">
                      <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Price at which the product was purchased">
                                <i class="fas fa-shopping-cart me-1 text-primary"></i>Purchase Pr<span class="text-danger">*</span>
                            </label>
                            <input type="text" name="purchase_price" class="form-control inputbox form-control-sm" oninput="window.allowFloat(this,2);gdMarkManual(this)"
                                value="${gdPurchasePriceVal}" placeholder="₹" min="0" step="0.01"
                                title="Price at which the product was purchased">
                      </div>
                      <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Tax Amount">
                                Tax Amount<span class="text-danger">*</span>
                            </label>
                            <input type="text" name="tax_amount" class="form-control inputbox form-control-sm"
                                oninput="this.value=this.value.replace(/[^0-9]/g,'').slice(0,7);gdMarkManual(this)" autocorrect="off"
                                value="${Tax_price}" placeholder="₹" required
                                title="Tax Price of this product received">
                      </div>
                    </div>
                </div>
            </div>
            <div class="row g-2 mb-3 inputbox2">
                <div class="col-12">
                    <label class="form-label fw-bold small mb-1">Selling Details</label>
                    <div id="gdPricingItemsContainer"></div>
                    <!--div id="gdSoldInPreview" class="mt-2" style="display:none;">
                        <!--small class="text-success"><i class="fas fa-code me-1"></i>Generated: <span id="gdSoldInPreviewText" style="font-family:monospace;font-size:12px;"></span></small>
                    </div-->
                </div>
            </div>
            <div class="row g-2 mb-3 inputbox2">
                <div class="col-12">
                    <label class="form-label fw-bold small mb-1">Notes</label>
                    <textarea name="notes" class="form-control inputbox form-control-sm" rows="2" disabled
                              placeholder="Enter any additional notes">${fd.notes}</textarea>
                </div>
            </div>

            <input type="hidden" name="a" value="${fd.a}">
            <input type="hidden" name="b" value="${fd.b}">
            <input type="hidden" name="c" value="${fd.c}">
            <input type="hidden" name="d" value="${fd.d}">
            <input type="hidden" name="bill_id" value="${fd.bill_id}">
            <input type="hidden" name="product_id" value="${fd.product_id}">
            <input type="hidden" name="measured_in" value="${fd.measured_in}">
            <input type="hidden" name="global_product_id" value="${fd.global_product_id}">

            <div class="d-flex justify-content-end gap-2 pt-2 border-top mt-2">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i>Cancel
                </button>
                <button type="submit" class="btn btn-sm btn-primary" id="gdSubmitBtn">
                    <i class="fas fa-save me-1"></i>${isEdit ? 'Update Item' : 'Add Item'}
                </button>
            </div>
        </form>
    </div>`;
 }

 // ==================== MAIN MODAL ENTRY ====================

 async function set_get_data_innerHTML(...params) {
  BillItemsFormcolsToHise = params ? params[0] : [];
  window.afterItemSet2fn = typeof params[1] === 'function' ? params[1] : null;
  gdEditData = (params && params[2] && (params[2].p || params[2].s)) ? params[2] : null;
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
    const modalId = 'getDataModal_' + Date.now();
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
      md.style.marginTop = '10px';
      md.style.maxWidth = '800px';
      md.style.width = '95%';
     }
     modalElement.style.zIndex = '1051';
    }, 50);

    let settled = false;

    // Show a loader while categories load
    contentElement.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading...</p></div>`;
    modalInstance.show();

    // Load categories like ed_prod.js
    let categories = [];
    try {
     const allCategories = await dbDexieManager.getAllRecords(dbnm, 'p');

     const categoryIds = window[my1uzr.worknOnPg]?.categorys || [];

     if (categoryIds.length > 0) {
      const cataMap = {};
      allCategories.forEach(c => { cataMap[Number(c.a)] = c; });
      categories = categoryIds
       .map(id => cataMap[Number(id)])
       .filter(c => c);
     } else {
      categories = allCategories;
     }

     window.prod_cata = categories;
    } catch (e) {
     console.warn('Error loading categories from IndexedDB:', e);
     categories = window.prod_cata || [];
    }

    const categoryOptions = categories.map(c =>
     `<option value="${c.a}">${c.e || 'Unnamed Category'}</option>`
    ).join('');

    const finalCategoryOptions = categoryOptions || '<option value="">No categories available</option>';

    // Fresh values for a new product (add-only)
    const editP = (gdEditData && gdEditData.p) || {};
    const editS = (gdEditData && gdEditData.s) || {};

    const fd = {
     a: gdGetNextProductId(),
     b: gdGetCurrentDateTime(),
     c: "0",
     d: "0",
     e: editP.e || "",
     f: editP.f || '0',
     stock_party_id: editS.e || '',
     stock_party_name: '',
     bill_id: '0',
     product_id: '0',
     rate_per_qty: editS.k || '',
     purchase_price: editS.h || '',
     quantity_received: editS.i || '',
     measured_in: editS.j || '',
     sold_in: '',
     notes: '',
     global_product_id: '0'
    };

    gdPurchasePriceVal = editS.h || '';
    gdQtyReceivedVal = editS.i || '';
    gdRatePerQtyRcv = editS.k || '';
    hsn = editP.i || '';
    tax1 = editP.j || '';
    tax2 = editP.k || '';
    Tax_price = editS.o || '';

    contentElement.innerHTML = gdBuildItemFormHTML(fd, finalCategoryOptions, !!gdEditData);

    if (editS.j) {
     const rcvdSel = document.getElementById('gdNewRcvdMeasuredIn');
     if (rcvdSel) rcvdSel.value = String(editS.j);
    }

    if (gdEditData && Array.isArray(editS.l) && editS.l.length > 0) {
     const parsedFirst = gdParseSoldInString(editS.l[0]);
     if (parsedFirst) {
      gdPickedImg1 = parsedFirst.g1 || '';
      gdPickedImg2 = parsedFirst.g2 || '';
     }
    }
    gdSyncImageBoxes();

    setTimeout(function () { gdSetupPricingItemsHandlers(); }, 500);

    setTimeout(() => {
     gdPreparePricingItems(gdEditData);
    }, 300);

    const form = contentElement.querySelector('#gdItemForm');
    if (form) {
     form.onsubmit = async function (e) {
      e.preventDefault();

      if (isProcessing) return;
      isProcessing = true;
      const sb = this.querySelector('#gdSubmitBtn');
      const btnLabel = gdEditData ? 'Update Item' : 'Add Item';
      if (sb) { sb.disabled = true; sb.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Saving...'; }
      try {
       const fd2 = new FormData(this);
       let nm = (fd2.get('e') || '').trim();

       if (!nm) {
        if (typeof showToast === 'function') showToast('Product name required', { type: 'error', duration: 2000 });
        isProcessing = false;
        if (sb) { sb.disabled = false; sb.innerHTML = '<i class="fas fa-save me-1"></i>' + btnLabel; }
        return;
       }

       // Build and log the payload (endpoint not called yet)
       const rcvdMeasuredIn = document.getElementById('gdNewRcvdMeasuredIn')?.value || '';
       const soldIn = gdGenerateSoldInString();

       if (!rcvdMeasuredIn) {
        if (typeof showToast === 'function') showToast('Please select Rcvd - Measured In', { type: 'warning', duration: 2000 });
        isProcessing = false;
        if (sb) { sb.disabled = false; sb.innerHTML = '<i class="fas fa-save me-1"></i>' + btnLabel; }
        return;
       }
       if (soldIn.length === 0) {
        if (typeof showToast === 'function') showToast('Please add at least one pricing item', { type: 'warning', duration: 2000 });
        isProcessing = false;
        if (sb) { sb.disabled = false; sb.innerHTML = '<i class="fas fa-save me-1"></i>' + btnLabel; }
        return;
       }

        const ob = [{
        p: {
         e: nm,
         f: fd2.get('f') || '0',
         g: '',
         g1: '',
         g2: '',
         i: fd2.get('hsn_price') || '0',
         j: fd2.get('cgst_received') || '0',
         k: fd2.get('sgst_received') || '0',
        },
        s: {
         e: parseInt(document.getElementById('gdPartyId')?.value) || 0,
         //f: bill id(not send)
         //g: product id(not send)
         h: fd2.get('purchase_price') || '',
         i: fd2.get('quantity_received') || '',
         j: rcvdMeasuredIn,
         k: fd2.get('rate_per_qty') || '',
         l: soldIn,
         //m: note not send
         n: 0,
         o: fd2.get('tax_amount') || '',//tax amount
        }
       }];

       //console.log('get_data.js Payload:', { ob });

       if (typeof window.afterItemSet2fn === 'function') window.afterItemSet2fn(ob);
       gdEditData = null;

       if (typeof showToast === 'function') showToast('Item added to bill', { type: 'info', duration: 2000 });

       modalInstance.hide();

      } catch (er) {
       console.error(er);
       if (typeof showToast === 'function') showToast('Error saving', { type: 'error', duration: 2000 });
      }
      finally {
       isProcessing = false;
       if (sb) {
        if (!sb.disabled) {
         sb.disabled = false;
         sb.innerHTML = '<i class="fas fa-save me-1"></i>' + btnLabel;
        }
       }
      }
     };
    }

    // Close/Cancel
    modalElement.addEventListener('hidden.bs.modal', function () {
     modalInstance.dispose();
     modalElement.remove();
     gdEditData = null;
     if (!settled) {
      settled = true;
      resolve(false);
     }
    }, { once: true });

    // Stop the loader now that the modal is visible
    settled = true;
    resolve(true);

   } catch (e) {
    console.error('get_data.js modal failed:', e);
    resolve(false);
   }
  });
 }

 // Inject styles used by this modal
 const gdStyles = document.createElement('style');
 gdStyles.textContent = `
        .pricing-item-saved { transition: all 0.2s; }
        .pricing-item-saved:hover { background: #c8e6c9 !important; }
        .inputbox{ border: 0.98px solid #000000dc; margin-top: 10px; margin-bottom: 8px; width: 100%; }
        .inputbox2{ border: 0.88px solid #1a1a1aa6; margin-top: 10px; padding: 20px; margin-bottom: 8px; }
        .gd-unit-hidden-select { display: none !important; }
        .gd-unit-wrap { position: relative; width: 100%; margin-top: 10px; margin-bottom: 8px; }
        .gd-unit-trigger {
            display: flex; align-items: center; gap: 8px; cursor: pointer;
            border: 1px solid #000; border-radius: 6px; padding: 4px 10px;
            background: #fff; min-height: 31px; font-size: 0.875rem; color: #212529;
            transition: border-color 0.15s, box-shadow 0.15s; user-select: none;
        }
        .gd-unit-trigger:hover { border-color: #86b7fe; }
        .gd-unit-trigger:focus-within { border-color: #86b7fe; box-shadow: 0 0 0 0.2rem rgba(13,110,253,0.15); }
        .gd-unit-search-icon { color: #6c757d; font-size: 0.8rem; }
        .gd-unit-trigger-label { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gd-unit-clear {
            display: inline-flex; align-items: center; justify-content: center;
            width: 20px; height: 20px; border-radius: 50%; color: #6c757d;
            cursor: pointer; font-size: 0.75rem;
        }
        .gd-unit-clear:hover { color: #dc3545; background: #f8d7da; }
        .gd-unit-caret { color: #6c757d; font-size: 0.75rem; }
        .gd-unit-panel {
            position: absolute; top: calc(100% + 2px); left: 0; right: 0; z-index: 1080;
            background: #fff; border: 1px solid #ced4da; border-radius: 6px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15); overflow: hidden;
        }

        #gdRcvdMeasuredInPanel { min-width: 280px; }
        .gd-unit-searchbox {
            display: flex; align-items: center; gap: 6px; padding: 4px 6px;
            border: 1px solid #ced4da; border-top: none; border-left: none; border-right: none;
            background: #f8f9fa; color: #6c757d;
        }
        .gd-unit-searchbox input {
            flex: 1 1 auto; border: 1px solid #ced4da; border-radius: 4px; outline: none;
            background: #fff; font-size: 0.8rem; padding: 3px 5px;
        }
        .gd-unit-searchbox input:focus { border-color: #86b7fe; box-shadow: 0 0 0 0.2rem rgba(13,110,253,0.15); }
        .gd-unit-options { max-height: 160px; overflow-y: auto; padding: 3px; }
        .gd-unit-option {
            display: flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 4px;
            cursor: pointer; font-size: 0.8rem; color: #212529; outline: none;
        }
        .gd-unit-option:hover, .gd-unit-option:focus { background: #e7f1ff; }
        .gd-unit-empty { padding: 10px; text-align: center; color: #6c757d; font-size: 0.85rem; }
        .card-body:has(#imagePreviewSection[style*="display: block"]) #addImageBox { display: none !important; }
    `;
 document.head.appendChild(gdStyles);

 // Expose globally
 window.set_get_data_innerHTML = set_get_data_innerHTML;
 window.commonFnToRunAfter_op_ViewCallGD = commonFnToRunAfter_op_ViewCallGD;
 window.getDataSaveNewPricingItem = window.getDataSaveNewPricingItem;
 window.getDataRemovePricingItem = window.getDataRemovePricingItem;
 window.handlePercentInput = handlePercentInput;

 console.log('get_data.js loaded successfully');
})();
