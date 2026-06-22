// prflt.js
(function () {
 let mraModalInstance = null;
 let mraModalElement = null;
 let mraContentDiv = null;

 window.mr_t__main = function (...arg) {
  const prfix = arg[0];
  if (!prfix) { console.error('mr_t__main: prefix is required as first argument'); return; }

  const modalId = 'mr_t_';
  let modal = document.getElementById(modalId);

  if (!modal) {
   const modalObj = create_modal_dynamically(modalId);
   mraModalInstance = modalObj.modalInstance;
   mraModalInstance._config.backdrop = 'static';
   mraModalElement = modalObj.modalElement;
   mraContentDiv = modalObj.contentElement;
   mraContentDiv.id = 'mr_t__content_div';
   mraContentDiv.style.cssText = 'padding: 0.5rem;';

   const contentArea = document.createElement('div');
   contentArea.id = 'mr_t__content_area';
   contentArea.className = 'mr_t__content-area';
   contentArea.style.cssText = 'padding: 0.25rem; overflow-y: auto; flex: 1;';
   mraContentDiv.appendChild(contentArea);

   const footerArea = document.createElement('div');
   footerArea.id = 'mr_t__footer_area';
   footerArea.className = 'mr_t__footer-area';
   footerArea.style.cssText = 'padding: 0.75rem; border-top: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center; gap: 10px; background: white; position: sticky; bottom: 0; z-index: 5;';
   mraContentDiv.appendChild(footerArea);

   window.mraContentArea = contentArea;
   window.mraFooterArea = footerArea;

   if (mraModalElement) { if (window._mraSaveDraft) { mraModalElement.removeEventListener('hidden.bs.modal', window._mraSaveDraft); } window._mraSaveDraft = function () { const formData = {}; if (window.mraFormFields) { for (const [key, field] of Object.entries(window.mraFormFields)) { formData[key] = field.input.value; } } localStorage.setItem(prfix + '_draft', JSON.stringify(formData)); }; mraModalElement.addEventListener('hidden.bs.modal', window._mraSaveDraft); }
  } else {
   mraModalElement = modal;
   mraContentDiv = document.getElementById('mr_t__content_div');
   window.mraContentArea = document.getElementById('mr_t__content_area');
   window.mraFooterArea = document.getElementById('mr_t__footer_area');
   if (window.mraContentArea) { window.mraContentArea.innerHTML = ''; }
   if (window.mraFooterArea) { window.mraFooterArea.innerHTML = ''; }

   if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    mraModalInstance = bootstrap.Modal.getInstance(modal);
    if (!mraModalInstance) { mraModalInstance = new bootstrap.Modal(modal, { backdrop: 'static', keyboard: false }); }
   }
  }

  buildFooter(prfix, arg[6], arg[9], arg);

  if (arg[1] === 1) { disp_mr_t__data(...arg); }
  else { if (window.mraContentArea) { set_mr_t__dat_t_vals(...arg); } }
 };

 function buildFooter(prfix, menuItems, actionButtons, mainArg) {
  const footerArea = window.mraFooterArea;
  if (!footerArea) return;
  footerArea.innerHTML = '';

  // Back button (left)
  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-link mr_t__back-btn';
  backBtn.style.cssText = 'padding: 0; margin: 0; font-size: 1.5rem; line-height: 1; text-decoration: none; color: var(--primary-color, #7B1FA2);';
  backBtn.innerHTML = '←';
  backBtn.onclick = function () {
   const formData = {};
   if (window.mraFormFields) { for (const [key, field] of Object.entries(window.mraFormFields)) { formData[key] = field.input.value; } }
   localStorage.setItem(prfix + '_draft', JSON.stringify(formData));
   if (mraModalInstance) { mraModalInstance.hide(); }
  };

  // Action buttons (center)
  const actionBtnsContainer = document.createElement('div');
  actionBtnsContainer.style.cssText = 'display: flex; gap: 10px; flex: 1; justify-content: center;';

  if (Array.isArray(actionButtons) && actionButtons.length > 0) {
   for (const btnConfig of actionButtons) {
    const btnText = btnConfig.a || 'Button';
    const actionBtn = document.createElement('button');
    actionBtn.className = 'btn mr_t__action-btn';
    let btnGradient = 'linear-gradient(135deg, #7B1FA2, #4A148C)';
    let btnShadow = 'rgba(123, 31, 162, 0.3)';
    if (btnText.toLowerCase().includes('add')) { btnGradient = 'linear-gradient(135deg, #4CAF50, #45a049)'; btnShadow = 'rgba(76, 175, 80, 0.3)'; }
    else if (btnText.toLowerCase().includes('update')) { btnGradient = 'linear-gradient(135deg, #FF9800, #F57C00)'; btnShadow = 'rgba(255, 152, 0, 0.3)'; }
    else if (btnText.toLowerCase().includes('delete')) { btnGradient = 'linear-gradient(135deg, #dc3545, #c82333)'; btnShadow = 'rgba(220, 53, 69, 0.3)'; }
    actionBtn.style.cssText = `background: ${btnGradient} !important; color: white; border: none; border-radius: 50px; padding: 10px 24px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px ${btnShadow};`;
    actionBtn.innerHTML = `<i class="fas ${btnText.toLowerCase().includes('add') ? 'fa-plus' : btnText.toLowerCase().includes('update') ? 'fa-edit' : btnText.toLowerCase().includes('delete') ? 'fa-trash' : 'fa-check'} me-2"></i> ${btnText}`;
    actionBtn.onmouseover = () => { actionBtn.style.transform = 'translateY(-2px)'; actionBtn.style.boxShadow = `0 6px 18px ${btnShadow}`; };
    actionBtn.onmouseout = () => { actionBtn.style.transform = 'translateY(0)'; actionBtn.style.boxShadow = `0 4px 12px ${btnShadow}`; };

    actionBtn.onclick = async () => {
     const t351mp = await chkIfLoggedIn();
     if (t351mp.su == 1) {
      const formData = {};
      const formFields = window.mraFormFields || {};
      const fieldsToCollect = btnConfig.f ? btnConfig.f.split(',').map(f => f.trim()) : null;
      if (fieldsToCollect && fieldsToCollect.length > 0) { for (const fk of fieldsToCollect) { if (formFields[fk] && formFields[fk].input) { formData[fk] = formFields[fk].input.value; } } }
      else { for (const [fk, field] of Object.entries(formFields)) { formData[fk] = field.input.value; } }
      if (btnConfig.e && typeof window[btnConfig.e] === 'function') {
       let firstInputId = null, firstInputValue = null, firstDivId = null;
       if (fieldsToCollect && fieldsToCollect.length > 0) { const fk = fieldsToCollect[0]; if (formFields[fk] && formFields[fk].input) { firstInputId = formFields[fk].input.id; firstInputValue = formFields[fk].input.value; firstDivId = document.getElementById(`${firstInputId}_div`)?.id || null; } }
       else if (Object.keys(formFields).length > 0) { const fk = Object.keys(formFields)[0]; firstInputId = formFields[fk].input.id; firstInputValue = formFields[fk].input.value; firstDivId = document.getElementById(`${firstInputId}_div`)?.id || null; }
       window[btnConfig.e](firstInputId, firstInputValue, firstDivId, null, { action: btnText, functionName: btnConfig.e, originalItem: btnConfig, modalInstance: mraModalInstance, modalElement: mraModalElement, keyVals: formData, originalArg: mainArg, fieldsToCollect: fieldsToCollect });
      }
     } else { (async () => { await loadExe2Fn(5, [], [1]); })(); }
    };
    actionBtnsContainer.appendChild(actionBtn);
   }
  }

  // Ellipsis dropdown (right)
  const hasMenuItems = Array.isArray(menuItems) && menuItems.length > 0;
  let ellipsisDiv = null;
  if (hasMenuItems) {
   ellipsisDiv = document.createElement('div');
   ellipsisDiv.className = 'dropdown mr_t__dropdown';
   ellipsisDiv.style.cssText = 'position: relative;';
   const ellipsisBtn = document.createElement('button');
   ellipsisBtn.className = 'btn btn-link mr_t__ellipsis-btn';
   ellipsisBtn.style.cssText = 'padding: 0; margin: 0; font-size: 1.2rem; line-height: 1; color: var(--primary-color, #7B1FA2);';
   ellipsisBtn.innerHTML = '⋮';
   ellipsisBtn.setAttribute('data-bs-toggle', 'dropdown');
   ellipsisBtn.setAttribute('aria-expanded', 'false');
   const dropdownMenu = document.createElement('ul');
   dropdownMenu.className = 'dropdown-menu mr_t__dropdown-menu';
   dropdownMenu.style.cssText = 'min-width: 120px;';
   menuItems.forEach(item => {
    const menuItem = document.createElement('li');
    const menuLink = document.createElement('a');
    menuLink.className = 'dropdown-item mr_t__dropdown-item';
    menuLink.href = '#';
    menuLink.textContent = item.a || 'Menu Item';
    if (item.a && item.a.toLowerCase() === 'delete') { menuLink.classList.add('text-danger'); }
    const functionName = item.e;
    const fieldsToCollect = item.f ? item.f.split(',').map(f => f.trim()) : null;
    menuLink.onclick = (e) => {
     e.preventDefault(); e.stopPropagation();
     const dropdown = bootstrap.Dropdown.getInstance(ellipsisBtn);
     if (dropdown) { dropdown.hide(); }
     const formData = {};
     const allFields = window.mraFormFields || {};
     if (fieldsToCollect && fieldsToCollect.length > 0) { for (const fk of fieldsToCollect) { if (allFields[fk] && allFields[fk].input) { formData[fk] = allFields[fk].input.value; } } }
     else { for (const [fk, field] of Object.entries(allFields)) { formData[fk] = field.input.value; } }
     if (functionName && typeof window[functionName] === 'function') {
      let firstInputId = null, firstInputValue = null, firstDivId = null;
      if (fieldsToCollect && fieldsToCollect.length > 0) { const fk = fieldsToCollect[0]; if (allFields[fk] && allFields[fk].input) { firstInputId = allFields[fk].input.id; firstInputValue = allFields[fk].input.value; firstDivId = document.getElementById(`${firstInputId}_div`)?.id || null; } }
      else if (Object.keys(allFields).length > 0) { const fk = Object.keys(allFields)[0]; firstInputId = allFields[fk].input.id; firstInputValue = allFields[fk].input.value; firstDivId = document.getElementById(`${firstInputId}_div`)?.id || null; }
      window[functionName](firstInputId, firstInputValue, firstDivId, null, { action: item.a, functionName: functionName, originalItem: item, modalInstance: mraModalInstance, modalElement: mraModalElement, keyVals: formData, fieldsToCollect: fieldsToCollect });
     }
    };
    menuItem.appendChild(menuLink);
    dropdownMenu.appendChild(menuItem);
   });
   ellipsisDiv.appendChild(ellipsisBtn);
   ellipsisDiv.appendChild(dropdownMenu);
   if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) { new bootstrap.Dropdown(ellipsisBtn); }
  }

  footerArea.appendChild(backBtn);
  footerArea.appendChild(actionBtnsContainer);
  if (ellipsisDiv) { footerArea.appendChild(ellipsisDiv); } else { const spacer = document.createElement('div'); spacer.style.cssText = 'width: 36px;'; footerArea.appendChild(spacer); }
 }

 function getOrderedKeys(labels, displaySequence, hiddenKeys) {
  const allKeys = Object.keys(labels);
  const sequenceArray = displaySequence ? displaySequence.split(',').map(k => k.trim()) : [];
  const orderedKeys = [];
  for (const seqKey of sequenceArray) { if (labels[seqKey] !== undefined && !orderedKeys.includes(seqKey)) { orderedKeys.push(seqKey); } }
  for (const key of allKeys) { if (!orderedKeys.includes(key)) { orderedKeys.push(key); } }
  return orderedKeys;
 }

 window.disp_mr_t__data = function (...arg) {
  const prfix = arg[0];
  const labels = arg[2] || {};
  let values = arg[3] || {};
  const specialProcessors = arg[4] || [];
  const clickHandlers = arg[5] || [];
  const menuItems = arg[6] || [];
  const displaySequence = arg[7] || '';
  const hiddenKeys = arg[8] || '';
  const actionButtons = arg[9] || [];

  window.mraMenuItems = menuItems;
  const contentArea = window.mraContentArea;
  const footerArea = window.mraFooterArea;
  if (!contentArea) return;
  contentArea.innerHTML = '';
  if (footerArea) { footerArea.innerHTML = ''; }

  let actionButtonsList = [];
  if (Array.isArray(actionButtons) && actionButtons.length > 0) { actionButtonsList = actionButtons; }

  const orderedKeys = getOrderedKeys(labels, displaySequence, hiddenKeys);
  const hiddenKeysArray = hiddenKeys ? hiddenKeys.split(',').map(k => k.trim()) : [];
  // Ensure 'ut' is hidden
  if (!hiddenKeysArray.includes('ut')) { hiddenKeysArray.push('ut'); }

  const formFields = {};
  window.mraFormFields = formFields;

  // Create table
  const table = document.createElement('table');
  table.style.cssText = 'width: 100%; border-collapse: collapse;';
  const tbody = document.createElement('tbody');

  // Track if image fields are rendered separately
  let imageFieldHTML = '';
  let galleryFieldHTML = '';

  for (const key of orderedKeys) {
   const labelText = labels[key];
   const value = values[key] !== undefined ? values[key] : '';
   const isHidden = hiddenKeysArray.includes(key);
   const processor = specialProcessors.find(p => p.a === key);
   const clickHandler = clickHandlers.find(p => p.a === key);
   const hasProcessor = processor !== undefined;
   const hasClickHandler = clickHandler !== undefined;
   const isMainImage = (key === 'u');
   const isGallery = (key === 'b6');

   // Create hidden input
   const input = document.createElement('input');
   input.type = 'hidden';
   input.id = `${prfix}_${key}`;
   input.value = value;

   // Create display div
   const valueDisplay = document.createElement('div');
   valueDisplay.id = `${prfix}_${key}_display`;
   valueDisplay.textContent = value;

if (isHidden && !isMainImage && !isGallery) {
 // Still create hidden input for form data collection
 formFields[key] = { input: input, label: labelText, value: value, isHidden: isHidden, displayDiv: valueDisplay };
 contentArea.appendChild(input);
 continue;
}

   formFields[key] = { input: input, label: labelText, value: value, isHidden: isHidden, displayDiv: valueDisplay };

   let valueDiv = null;
   if (hasProcessor || hasClickHandler) {
    valueDiv = document.createElement('div');
    valueDiv.id = `${prfix}_${key}_div`;
    valueDiv.className = 'mr_t__value-div';
    valueDisplay.style.display = 'none';
   }

   // Handle main image (u)
   if (isMainImage) {
    imageFieldHTML = `<div style="height: 35vh; overflow: hidden; margin-bottom: 0.5rem;">`;
    imageFieldHTML += `<div id="${prfix}_${key}_display" style="display:none;">${value}</div>`;
    imageFieldHTML += `<div id="${prfix}_${key}_div" style="height: 100%;"></div>`;
    imageFieldHTML += `</div>`;
    formFields[key].input = input;
    continue;
   }

   // Handle gallery (b6)
   if (isGallery) {
    galleryFieldHTML = `<div style="margin-bottom: 0.5rem;">`;
    galleryFieldHTML += `<div id="${prfix}_${key}_display" style="display:none;">${value}</div>`;
    galleryFieldHTML += `<div id="${prfix}_${key}_div"></div>`;
    galleryFieldHTML += `</div>`;
    formFields[key].input = input;
    continue;
   }

   // Table row for other fields
   const row = document.createElement('tr');
   row.style.cssText = 'border: 1px solid #dee2e6;';

   const labelCell = document.createElement('td');
   labelCell.style.cssText = 'padding: 0.5rem 0.75rem; font-weight: 500; font-size: 0.875rem; color: #6c757d; width: 35%; vertical-align: top; border: 1px solid #dee2e6;';
   labelCell.textContent = labelText;

   const valueCell = document.createElement('td');
   valueCell.style.cssText = 'padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #212529; word-break: break-word; vertical-align: top; border: 1px solid #dee2e6;';

   if (hasProcessor) {
    labelCell.style.color = '#00349d';
    if (valueDiv) { valueDiv.style.cssText += 'font-size: 0.875rem; color: #00349d; border-radius: 0.22rem;'; }
   }

   if (valueDiv) { valueCell.appendChild(valueDiv); }
   valueCell.appendChild(valueDisplay);
   row.appendChild(labelCell);
   row.appendChild(valueCell);
   tbody.appendChild(row);

   // Add hidden input to content area
   contentArea.appendChild(input);
  }

  table.appendChild(tbody);
  contentArea.appendChild(table);

  // Process main image
  if (imageFieldHTML) {
   const imgContainer = document.createElement('div');
   imgContainer.innerHTML = imageFieldHTML;
   contentArea.insertBefore(imgContainer, contentArea.firstChild);
  }

  // Process gallery
  if (galleryFieldHTML) {
   const galContainer = document.createElement('div');
   galContainer.innerHTML = galleryFieldHTML;
   const tableEl = contentArea.querySelector('table');
   if (tableEl) { contentArea.insertBefore(galContainer, tableEl); }
   else { contentArea.appendChild(galContainer); }
  }

  // Rebuild footer with action buttons
  buildFooter(prfix, menuItems, actionButtons, arg);

  arg[3] = values;
  set_mr_t__dat_t_vals(...arg);

  if (mraModalInstance) { mraModalInstance.show(); }
 };

 window.set_mr_t__dat_t_vals = function (...arg) {
  const prfix = arg[0];
  const values = arg[3] || {};
  const defaFieldVals = window[my1uzr.worknOnPg]?.defaFieldVals || [];
  if (defaFieldVals && defaFieldVals.length > 0) {
   const defaults = {};
   defaFieldVals.forEach(pair => { const [key, val] = pair.split('~'); if (key && val) { defaults[key.trim()] = val.trim(); } });
   if ((!values.k || values.k == 0 || values.k == '0') && defaults.k) { values.k = defaults.k; }
   if ((!values.k1 || values.k1 == 0 || values.k1 == '0') && defaults.k1) { values.k1 = defaults.k1; }
   if ((!values.k2 || values.k2 == 0 || values.k2 == '0') && defaults.k2) { values.k2 = defaults.k2; }
  }
  const specialProcessors = arg[4] || [];
  const clickHandlers = arg[5] || [];
  const hiddenKeys = arg[8] || '';
  const hiddenKeysArray = hiddenKeys ? hiddenKeys.split(',').map(k => k.trim()) : [];
  if (!hiddenKeysArray.includes('ut')) { hiddenKeysArray.push('ut'); }

  for (const [key, val] of Object.entries(values)) {
   if (hiddenKeysArray.includes(key)) continue;
   const input = document.getElementById(`${prfix}_${key}`);
   if (input) { input.value = val !== null && val !== undefined ? val : ''; }
   const displayDiv = document.getElementById(`${prfix}_${key}_display`);
   if (displayDiv) { displayDiv.textContent = val !== null && val !== undefined ? val : ''; }

   const processor = specialProcessors.find(p => p.a === key);
   const clickHandler = clickHandlers.find(p => p.a === key);
   if (processor) {
    const divElement = document.getElementById(`${prfix}_${key}_div`);
    if (divElement && typeof window[processor.b] === 'function') {
     const processedValue = window[processor.b](`${prfix}_${key}`, val, `${prfix}_${key}_div`, key, processor);
     if (processedValue !== undefined && divElement) { divElement.textContent = processedValue; }
    } else if (divElement && processor) { console.warn(`Processor function ${processor.b} not found for key ${key}`); }
   } else if (clickHandler) {
    const divElement = document.getElementById(`${prfix}_${key}_div`);
    if (divElement && val !== null && val !== undefined) { divElement.textContent = val; }
   }
  }
 };

 // Add CSS for gallery images
 const style = document.createElement('style');
 style.textContent = `.mr_t__gallery-img {width: calc(20% - 6px); height: auto; aspect-ratio: 1; object-fit: cover; border-radius: 4px; cursor: pointer; border: 1px solid #dee2e6;}.mr_t__gallery-img:hover {opacity: 0.8;}.mr_t__main-img {width: 100%; height: 100%; object-fit: cover; object-position: top; border-radius: 4px;}`;
 document.head.appendChild(style);

})();