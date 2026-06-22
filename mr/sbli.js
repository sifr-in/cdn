// Sibling Details Modal Function
function set_mr_x_sibling_details(...arg) {
 let siblingData = [];
 let currentIndex = -1;

 const currentSiblingString = arg && arg.length > 0 ? arg[0] : null;
 const previewDivId = arg && arg.length > 1 ? arg[1] : null;
 const showModal = arg && arg.length > 2 ? arg[2] : 0;
 const callbackFnName = arg && arg.length > 3 ? arg[3] : null;
 const previewInputId = arg && arg.length > 4 ? arg[4] : null;

 const forceSibling = window[my1uzr.worknOnPg]?.forceSibling === 1;

 function convertToPreviewString(data) {
  if (!data || data.length === 0) return '';
  if (typeof data[0] === 'string' && (data[0].includes('~') || data[0] === '3')) { return data.map(item => `"${item}"`).join(','); }
  return data.map(item => { if (item === '3' || item.type === '3') return '"3"'; const type = item.type || item; return `"${type}~${item.age}!${item.marital}@${item.living}"`; }).join(',');
 }

 if (currentSiblingString && currentSiblingString.trim() !== '') {
  const cleanStr = currentSiblingString.replace(/"/g, '');
  const items = cleanStr.split(',').filter(s => s.trim() !== '');
  siblingData = items.map(item => item.trim());
 } else { siblingData = []; }

 if (previewDivId) {
  const previewString = convertToPreviewString(siblingData);
  setSiblingTags(previewInputId, previewString, previewDivId, null, { canEdit: true, canAdd: 1 });
 }

 if (showModal == 1) {
  let modalElement = document.getElementById('sibling_dtls');

  if (!modalElement) {
   const modalResult = create_modal_dynamically("sibling_dtls");
   if (modalResult && modalResult.modalInstance) { window.siblingModalInstance = modalResult.modalInstance; }
   if (!modalResult || !modalResult.contentElement) { console.error("Failed to create modal"); return; }
   const contentElement = modalResult.contentElement;
   modalResult.modalElement.classList.add('sibling-dtls-modal');

   const header = document.createElement('div');
   header.className = 'sibling-dtls-header d-flex align-items-center p-3 border-bottom';
   header.style.cssText = 'position: sticky; top: 0; background: linear-gradient(135deg, #7B1FA2, #4A148C); color: white; z-index: 1020; border-radius: 15px 15px 0 0;';

   const backButton = document.createElement('button');
   backButton.type = 'button'; backButton.className = 'btn btn-link text-white p-0 me-2'; backButton.innerHTML = '<i class="fas fa-arrow-left fa-lg"></i>';
   backButton.style.cssText = 'font-size: 1.2rem; text-decoration: none; min-width: 40px;';
   backButton.onclick = function () { const modal = bootstrap.Modal.getInstance(document.getElementById('sibling_dtls')); if (modal) modal.hide(); };

   const title = document.createElement('h5');
   title.className = 'mb-0 flex-grow-1 text-center'; title.id = 'sibling_dtls_title'; title.textContent = 'Sibling Details';

   const menuButton = document.createElement('button');
   menuButton.type = 'button'; menuButton.className = 'btn btn-link text-white p-0 ms-2'; menuButton.innerHTML = '<i class="fas fa-ellipsis-v fa-lg"></i>';
   menuButton.style.cssText = 'font-size: 1.2rem; text-decoration: none; min-width: 40px;';

   header.appendChild(backButton); header.appendChild(title); header.appendChild(menuButton);

   const contentContainer = document.createElement('div');
   contentContainer.className = 'sibling-dtls-content p-4';
   contentContainer.style.cssText = 'max-height: calc(80vh - 70px); overflow-y: auto; background: linear-gradient(135deg, #FAFAFA, #F3E5F5);';

   const formContainer = document.createElement('div');
   formContainer.className = 'sibling-dtls-form'; formContainer.id = 'sibling_dtls_form';

   // Step 1: Sibling Type Selection
   const step1Div = document.createElement('div'); step1Div.className = 'mb-4';
   const step1Label = document.createElement('label'); step1Label.className = 'form-label fw-semibold text-muted mb-2'; step1Label.textContent = 'Select Sibling Type';
   const typeSelect = document.createElement('select'); typeSelect.className = 'form-select sibling-type-select'; typeSelect.id = 'sibling_type_select';
   [{ value: '', text: '-- Select Sibling Type --' },{ value: '1', text: 'Brother' },{ value: '2', text: 'Sister' },{ value: '3', text: 'Self' }].forEach(opt => { const o = document.createElement('option'); o.value = opt.value; o.textContent = opt.text; typeSelect.appendChild(o); });
   step1Div.appendChild(step1Label); step1Div.appendChild(typeSelect);

   // Step 2: Age Relative Selection
   const step2Div = document.createElement('div'); step2Div.className = 'mb-4'; step2Div.id = 'step2_age_relative'; step2Div.style.display = 'none';
   const step2Label = document.createElement('label'); step2Label.className = 'form-label fw-semibold text-muted mb-2'; step2Label.textContent = 'Age Relative to You';
   const ageSelect = document.createElement('select'); ageSelect.className = 'form-select age-relative-select'; ageSelect.id = 'sibling_age_select';
   [{ value: '', text: '-- Select Age Relative --' },{ value: '1', text: 'Elder' },{ value: '2', text: 'Younger' }].forEach(opt => { const o = document.createElement('option'); o.value = opt.value; o.textContent = opt.text; ageSelect.appendChild(o); });
   step2Div.appendChild(step2Label); step2Div.appendChild(ageSelect);

   // Step 3: Marital Status Selection
   const step3Div = document.createElement('div'); step3Div.className = 'mb-4'; step3Div.id = 'step3_marital_status'; step3Div.style.display = 'none';
   const step3Label = document.createElement('label'); step3Label.className = 'form-label fw-semibold text-muted mb-2'; step3Label.textContent = 'Marital Status';
   const maritalSelect = document.createElement('select'); maritalSelect.className = 'form-select'; maritalSelect.id = 'sibling_marital_status';
   [{ value: '', text: '-- Select Marital Status --' },{ value: '1', text: 'Never Married' },{ value: '2', text: 'Married' },{ value: '3', text: 'Divorced' },{ value: '4', text: 'Widow/Widower' },{ value: '5', text: 'Separated' },{ value: '6', text: 'Awaiting Divorce' }].forEach(opt => { const o = document.createElement('option'); o.value = opt.value; o.textContent = opt.text; maritalSelect.appendChild(o); });
   step3Div.appendChild(step3Label); step3Div.appendChild(maritalSelect);

   maritalSelect.addEventListener('change', function () { if (this.value && this.value !== '') { document.getElementById('step4_living_status').style.display = 'block'; } else { document.getElementById('step4_living_status').style.display = 'none'; } });

   // Step 4: Living Status Selection
   const step4Div = document.createElement('div'); step4Div.className = 'mb-4'; step4Div.id = 'step4_living_status'; step4Div.style.display = 'none';
   const step4Label = document.createElement('label'); step4Label.className = 'form-label fw-semibold text-muted mb-2'; step4Label.textContent = 'Living Status';
   const livingSelect = document.createElement('select'); livingSelect.className = 'form-select living-status-select'; livingSelect.id = 'sibling_living_select';
   [{ value: '', text: '-- Select Living Status --' },{ value: '1', text: 'Lives with us' },{ value: '2', text: 'Lives separate' },{ value: '3', text: 'Lives with spouse' }].forEach(opt => { const o = document.createElement('option'); o.value = opt.value; o.textContent = opt.text; livingSelect.appendChild(o); });
   step4Div.appendChild(step4Label); step4Div.appendChild(livingSelect);

   // Add to List button
   const addButtonDiv = document.createElement('div'); addButtonDiv.className = 'd-grid gap-2 mb-4';
   const addButton = document.createElement('button'); addButton.type = 'button'; addButton.className = 'btn btn-lg'; addButton.id = 'add_sibling_btn';
   addButton.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Add to List';
   addButton.style.cssText = 'background: linear-gradient(135deg, #7B1FA2, #4A148C); color: white; border: none; border-radius: 50px; padding: 12px; font-weight: 600; transition: all 0.3s ease;';
   addButtonDiv.appendChild(addButton);

   // Siblings List Preview
   const listPreviewDiv = document.createElement('div'); listPreviewDiv.className = 'siblings-list-preview'; listPreviewDiv.id = 'modal_sibling_preview_container';
   const listLabel = document.createElement('label'); listLabel.className = 'form-label fw-semibold text-muted mb-2'; listLabel.textContent = 'Added Siblings';
   const listContainer = document.createElement('div'); listContainer.className = 'list-group'; listContainer.id = 'siblings_list_container'; listContainer.style.maxHeight = '200px'; listContainer.style.overflowY = 'auto';
   listPreviewDiv.appendChild(listLabel); listPreviewDiv.appendChild(listContainer);

   // Hidden input with new prefix
   const hiddenInput = document.createElement('input'); hiddenInput.type = 'hidden'; hiddenInput.id = 'mra_e__x'; hiddenInput.name = 'x';

   formContainer.appendChild(step1Div); formContainer.appendChild(step2Div); formContainer.appendChild(step3Div); formContainer.appendChild(step4Div);
   formContainer.appendChild(addButtonDiv); formContainer.appendChild(listPreviewDiv); formContainer.appendChild(hiddenInput);

   contentContainer.appendChild(formContainer);
   contentElement.appendChild(header); contentElement.appendChild(contentContainer);

   // Event listeners for steps
   document.getElementById('sibling_type_select').addEventListener('change', function () {
    const type = this.value;
    if (type === '3') { document.getElementById('step2_age_relative').style.display = 'none'; document.getElementById('step3_marital_status').style.display = 'none'; document.getElementById('step4_living_status').style.display = 'none'; document.getElementById('sibling_age_select').value = ''; document.getElementById('sibling_marital_status').value = ''; document.getElementById('sibling_living_select').value = ''; }
    else if (type) { document.getElementById('step2_age_relative').style.display = 'block'; document.getElementById('step3_marital_status').style.display = 'none'; document.getElementById('step4_living_status').style.display = 'none'; document.getElementById('sibling_age_select').value = ''; document.getElementById('sibling_marital_status').value = ''; document.getElementById('sibling_living_select').value = ''; }
   });

   document.getElementById('sibling_age_select').addEventListener('change', function () { if (this.value) { document.getElementById('step3_marital_status').style.display = 'block'; document.getElementById('step4_living_status').style.display = 'none'; document.getElementById('sibling_living_select').value = ''; } });

   // CSS
   const style = document.createElement('style');
   style.textContent = '.sibling-dtls-modal .modal-content {border-radius: 15px !important; overflow: hidden !important; box-shadow: 0 20px 40px rgba(123, 31, 162, 0.2) !important; border: none !important;}.sibling-dtls-modal .list-group-item {border-left: 3px solid #7B1FA2; transition: all 0.2s ease;}.sibling-dtls-modal .list-group-item:hover {background: #F3E5F5; transform: translateX(5px);}';
   document.head.appendChild(style);

   // Add button handler
   document.getElementById('add_sibling_btn').addEventListener('click', function () {
    const selectedType = document.getElementById('sibling_type_select').value;
    const selectedAge = document.getElementById('sibling_age_select').value;
    const selectedLiving = document.getElementById('sibling_living_select').value;
    const maritalStatus = document.getElementById('sibling_marital_status').value;

    if (!selectedType) { alert('Please select sibling type'); return; }

    let siblingString;
    if (selectedType === '3') { siblingString = '3'; }
    else {
     if (forceSibling) {
      if (!selectedAge) { alert('Please select age relative'); return; }
      if (!maritalStatus) { alert('Please select marital status'); return; }
      if (!selectedLiving) { alert('Please select living status'); return; }
     }
     siblingString = `${selectedType}~${selectedAge || ''}!${maritalStatus || ''}@${selectedLiving || ''}`;
    }

    if (currentIndex >= 0 && currentIndex < siblingData.length) { siblingData[currentIndex] = siblingString; currentIndex = -1; this.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Add to List'; }
    else { siblingData.push(siblingString); }

    updateSiblingsList();
    document.getElementById('mra_e__x').value = convertToPreviewString(siblingData);

    const previewString = convertToPreviewString(siblingData);
    const modalPreviewContainer = document.getElementById('modal_sibling_preview_container');
    if (modalPreviewContainer) { setSiblingTags(null, previewString, 'modal_sibling_preview_container', null, { canEdit: true, canAdd: 1 }); }
    if (previewDivId) { setSiblingTags(previewInputId, previewString, previewDivId, null, { canEdit: true, canAdd: 1 }); }

    clearForm();
    if (callbackFnName && typeof window[callbackFnName] === 'function') { window[callbackFnName](previewString); }
   });

   function getMaritalText(value) { const map = {'1':'Never Married','2':'Married','3':'Divorced','4':'Widow/er','5':'Separated','6':'Awaiting Divorce'}; return map[value] || ''; }
   function getLivingText(value) { const map = {'1':'Lives with us','2':'Lives separate','3':'Lives with spouse'}; return map[value] || ''; }

   function clearForm() {
    document.getElementById('sibling_type_select').value = ''; document.getElementById('sibling_age_select').value = ''; document.getElementById('sibling_marital_status').value = ''; document.getElementById('sibling_living_select').value = '';
    document.getElementById('step2_age_relative').style.display = 'none'; document.getElementById('step3_marital_status').style.display = 'none'; document.getElementById('step4_living_status').style.display = 'none';
    document.getElementById('add_sibling_btn').innerHTML = '<i class="fas fa-plus-circle me-2"></i>Add to List';
   }

   function updateSiblingsList() {
    const container = document.getElementById('siblings_list_container'); if (!container) return; container.innerHTML = '';
    if (siblingData.length === 0) { const emptyItem = document.createElement('div'); emptyItem.className = 'list-group-item text-muted text-center py-3'; emptyItem.textContent = 'No siblings added yet'; container.appendChild(emptyItem); return; }
    siblingData.forEach((item, index) => {
     const listItem = document.createElement('div'); listItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
     let displayText = '';
     if (item === '3') { displayText = 'Self'; }
     else {
      const parts = item.split('~'); const type = parts[0] === '1' ? 'Brother' : 'Sister';
      if (parts.length < 2 || !parts[1]) { displayText = type; }
      else {
       const details = parts[1].split('!'); const ageMarital = details[0].split('@'); const age = ageMarital[0] === '1' ? 'Elder' : ageMarital[0] === '2' ? 'Younger' : ''; const marital = ageMarital[1] ? getMaritalText(ageMarital[1]) : ''; const living = details.length > 1 && details[1] ? getLivingText(details[1]) : '';
       const infoParts = [age, marital, living].filter(p => p); displayText = infoParts.length > 0 ? `${type} - ${infoParts.join(', ')}` : type;
      }
     }
     listItem.innerHTML = `<span>${displayText}</span><div><button class="btn btn-sm btn-outline-primary me-1" onclick="window.editSiblingFn(${index})"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-outline-danger" onclick="window.deleteSiblingFn(${index})"><i class="fas fa-trash"></i></button></div>`;
     container.appendChild(listItem);
    });
   }

   function editSiblingFn(index) {
    const item = siblingData[index]; currentIndex = index; clearForm();
    if (item === '3') { document.getElementById('sibling_type_select').value = '3'; document.getElementById('sibling_type_select').dispatchEvent(new Event('change', { bubbles: true })); }
    else {
     const parts = item.split('~'); const type = parts[0];
     document.getElementById('sibling_type_select').value = type; document.getElementById('sibling_type_select').dispatchEvent(new Event('change', { bubbles: true }));
     if (parts.length > 1 && parts[1]) {
      const details = parts[1].split('!'); const ageMarital = details[0].split('@'); const age = ageMarital[0]; const marital = ageMarital[1] || ''; const living = details.length > 1 ? details[1] : '';
      setTimeout(() => {
       if (age) { document.getElementById('sibling_age_select').value = age; document.getElementById('sibling_age_select').dispatchEvent(new Event('change', { bubbles: true })); }
       if (marital) { document.getElementById('sibling_marital_status').value = marital; document.getElementById('sibling_marital_status').dispatchEvent(new Event('change', { bubbles: true })); }
       if (living) { setTimeout(() => { document.getElementById('sibling_living_select').value = living; }, 100); }
      }, 100);
     }
    }
    document.getElementById('add_sibling_btn').innerHTML = '<i class="fas fa-save me-2"></i>Update Sibling';
   }

   function deleteSiblingFn(index) {
    if (confirm('Remove this sibling from list?')) {
     siblingData.splice(index, 1); updateSiblingsList(); document.getElementById('mra_e__x').value = convertToPreviewString(siblingData);
     const previewString = convertToPreviewString(siblingData);
     const modalPreviewContainer = document.getElementById('modal_sibling_preview_container');
     if (modalPreviewContainer) { setSiblingTags(null, previewString, 'modal_sibling_preview_container', null, { canEdit: true, canAdd: 1 }); }
     if (previewDivId) { setSiblingTags(previewInputId, previewString, previewDivId, null, { canEdit: true, canAdd: 1 }); }
     if (callbackFnName && typeof window[callbackFnName] === 'function') { window[callbackFnName](previewString); }
     if (currentIndex === index) { currentIndex = -1; clearForm(); }
    }
   }

   window.updateSiblingsList = updateSiblingsList; window.clearForm = clearForm; window.editSiblingFn = editSiblingFn; window.deleteSiblingFn = deleteSiblingFn;
   updateSiblingsList();
   if (hiddenInput) { hiddenInput.value = JSON.stringify(siblingData); }
   const modalPreviewString = convertToPreviewString(siblingData);
   const modalPreviewContainer = document.getElementById('modal_sibling_preview_container');
   if (modalPreviewContainer) { setSiblingTags(null, modalPreviewString, 'modal_sibling_preview_container', null, { canEdit: true, canAdd: 1 }); }

   if (window.siblingModalInstance) { window.siblingModalInstance.show(); }
   else { const modalElementExists = document.getElementById('sibling_dtls'); if (modalElementExists) { const bsModal = new bootstrap.Modal(modalElementExists); bsModal.show(); } }
  } else {
   if (typeof window.updateSiblingsList === 'function') { window.updateSiblingsList(); }
   const hiddenInputExists = document.getElementById('mra_e__x'); if (hiddenInputExists) { hiddenInputExists.value = JSON.stringify(siblingData); }
   const modalPreviewString = convertToPreviewString(siblingData);
   const modalPreviewContainer = document.getElementById('modal_sibling_preview_container');
   if (modalPreviewContainer) { setSiblingTags(null, modalPreviewString, 'modal_sibling_preview_container', null, { canEdit: true, canAdd: 1 }); }
   if (window.siblingModalInstance) { window.siblingModalInstance.show(); }
  }
 } else {
  if (previewDivId) { const previewString = convertToPreviewString(siblingData); setSiblingTags(previewInputId, previewString, previewDivId, null, { canEdit: true, canAdd: 1 }); }
 }
}