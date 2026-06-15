// slkt2.js - State, District, Taluka Selection with Preview & Search
function setValByPrprtyDepthToElm(inputId, value, divId, key, fullObject) {
 if (!divId) return;
 const divElement = document.getElementById(divId);
 if (!divElement) return;

 const inElement = document.getElementById(inputId);
 if (inElement) { inElement.style.display = 'none'; }

 // Store attributes on first load
 if (!divElement.hasAttribute('data-initialized')) {
  divElement.setAttribute('data-can-add', fullObject.canAdd || 0);
  divElement.setAttribute('data-selection-array', fullObject.c || '');
  divElement.setAttribute('data-depth-for-native', fullObject.depthForNative || 3);
  if (fullObject.g) { divElement.setAttribute('data-fn-set-val', fullObject.g); }
  if (fullObject.e) { divElement.setAttribute('data-parent-id', fullObject.e); }
  divElement.setAttribute('data-initialized', 'true');
 }

 const storedCanAdd = parseInt(divElement.getAttribute('data-can-add')) || 0;
 const requiredDepth = parseInt(divElement.getAttribute('data-depth-for-native')) || 3;

 divElement.innerHTML = '';

 let arrayName = fullObject.c;
 let childKeys = [];
 if (arrayName && arrayName.includes(',')) { const parts = arrayName.split(',').map(p => p.trim()); arrayName = parts[0]; childKeys = parts.slice(1); }

 const dataArray = window[arrayName];
 if (!dataArray || !Array.isArray(dataArray)) {
  divElement.innerHTML = '<p class="text-muted">Data not available</p>';
  if (storedCanAdd > 0) { addDepthEditButton(divElement, inputId, value, divId, key, fullObject, storedCanAdd); }
  return;
 }

 const valueStr = value !== null && value !== undefined ? String(value).trim() : '';
 if (valueStr === '' || valueStr === '0') {
  divElement.innerHTML = '<p class="text-muted">Not specified</p>';
  if (storedCanAdd > 0) { addDepthEditButton(divElement, inputId, value, divId, key, fullObject, storedCanAdd); }
  return;
 }

 const valueIds = valueStr.split(',').map(v => v.trim()).filter(v => v !== '');
 const childKey0 = childKeys[0] || 'dstrcts';
 const childKey1 = childKeys[1] || 'thsls';

 // Build hierarchical display
 const mainContainer = document.createElement('div');
 mainContainer.style.cssText = 'display: flex; flex-direction: column; gap: 1px; margin-top: 4px;';

 let currentArray = dataArray;
 for (let i = 0; i < valueIds.length; i++) {
  const id = valueIds[i];
  const found = currentArray.find(item => String(item.a) === id);
  if (found) {
   const fullName = found.e || '';
   const line = document.createElement('div');
   line.style.cssText = `padding-left: ${i * 16}px; font-size: ${i === 0 ? '0.9rem' : i === 1 ? '0.85rem' : '0.8rem'}; color: ${i === 0 ? '#7B1FA2' : i === 1 ? '#4A148C' : '#212529'}; font-weight: ${i === 0 ? '600' : '400'}; display: flex; align-items: center; gap: 4px;`;
   if (i > 0) { line.innerHTML = '<span style="color:#9C27B0;font-size:0.7rem;">⤵</span> '; }
   line.innerHTML += fullName;
   mainContainer.appendChild(line);
   if (i === 0) { currentArray = found[childKey0] || []; }
   else if (i === 1) { currentArray = found[childKey1] || []; }
  }
 }

 const wrapper = document.createElement('div');
 wrapper.style.cssText = 'display: flex; align-items: flex-start; gap: 8px;';
 const textContainer = document.createElement('div');
 textContainer.style.cssText = 'flex: 1;';
 textContainer.appendChild(mainContainer);
 wrapper.appendChild(textContainer);

 if (storedCanAdd > 0) {
  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'flex-shrink: 0;';
  addDepthEditButton(btnContainer, inputId, value, divId, key, fullObject, storedCanAdd);
  wrapper.appendChild(btnContainer);
 }

 divElement.appendChild(wrapper);
}

function addDepthEditButton(container, inputId, value, divId, key, fullObject, canAddValue) {
 const editBtn = document.createElement('button');
 editBtn.innerHTML = '<i class="fas fa-edit"></i>';
 editBtn.style.cssText = 'background: linear-gradient(135deg, #FF9800, #F57C00); color: white; border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 14px; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;';
 editBtn.title = 'Edit selection';
 editBtn.onmouseover = () => { editBtn.style.transform = 'scale(1.1)'; editBtn.style.boxShadow = '0 2px 8px rgba(255,152,0,0.4)'; };
 editBtn.onmouseout = () => { editBtn.style.transform = 'scale(1)'; editBtn.style.boxShadow = 'none'; };

 const divEl = document.getElementById(divId);
 const selectionArrayName = divEl?.getAttribute('data-selection-array') || fullObject.c || '';
 const requiredDepth = parseInt(divEl?.getAttribute('data-depth-for-native')) || 3;

 editBtn.onclick = (e) => {
  e.stopPropagation(); e.preventDefault();
  if (typeof window.openDepthSelectionModal === 'function') { window.openDepthSelectionModal(inputId, value, divId, key, { e: selectionArrayName, f: requiredDepth }); }
 };
 container.appendChild(editBtn);
}

async function openDepthSelectionModal(inputId, value, divId, key, fullObject) {
 if (!divId) return;
 const divElement = document.getElementById(divId);
 if (!divElement) return;

 const inElement = document.getElementById(inputId);
 if (inElement) { inElement.style.display = 'none'; }

 let arrayName = fullObject.e;
 let childKeys = [];
 if (arrayName && arrayName.includes(',')) { const parts = arrayName.split(',').map(p => p.trim()); arrayName = parts[0]; childKeys = parts.slice(1); }

 const childKey0 = childKeys[0] || 'dstrcts';
 const childKey1 = childKeys[1] || 'thsls';
 const requiredDepth = fullObject.f || 3;
 const maxDepth = Math.min(childKeys.length + 1, requiredDepth);
 const depthLabels = ['State', 'District', 'Taluka', 'Village'];

 const dataArray = window[arrayName];
 if (!dataArray || !Array.isArray(dataArray)) { console.error(`Data array "${arrayName}" not found`); return; }

 const currentValue = value ? String(value).trim() : '';
 const currentIds = currentValue ? currentValue.split(',').map(v => v.trim()) : [];

 const modalId = `depth_select_modal_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
 const modalObj = create_modal_dynamically(modalId);
 const modalInstance = modalObj.modalInstance;
 const modalElement = modalObj.modalElement;
 const modalBody = modalObj.contentElement;

 const pageUniqueClass = `depth-select-modal-${Date.now()}`;
 modalElement.classList.add(pageUniqueClass);

 const scopedStyles = document.createElement('style');
 scopedStyles.textContent = `.${pageUniqueClass} .modal-header {display:flex !important;align-items:center !important;padding:0.75rem 1rem !important;background:linear-gradient(135deg,#7B1FA2,#4A148C) !important;color:white !important;border-radius:10px 10px 0 0 !important;}.${pageUniqueClass} .modal-header .back-btn,.${pageUniqueClass} .modal-header .close-btn {background:rgba(255,255,255,0.2) !important;border:none !important;border-radius:50% !important;width:36px !important;height:36px !important;display:flex !important;align-items:center !important;justify-content:center !important;color:white !important;cursor:pointer !important;font-size:1rem !important;}.${pageUniqueClass} .modal-header .back-btn:disabled {opacity:0.3 !important;cursor:not-allowed !important;}.${pageUniqueClass} .modal-header .modal-title {flex:1 !important;text-align:center !important;margin:0 !important;font-weight:600 !important;font-size:1.1rem !important;}.${pageUniqueClass} .modal-body {padding:1rem !important;max-height:65vh !important;overflow-y:auto !important;}.${pageUniqueClass} .depth-info {background:#f3e5f5 !important;padding:0.5rem 0.75rem !important;border-radius:8px !important;margin-bottom:0.75rem !important;font-size:0.8rem !important;color:#7B1FA2 !important;text-align:center !important;font-weight:500 !important;}.${pageUniqueClass} .search-container {margin-bottom:0.75rem !important;position:relative !important;}.${pageUniqueClass} .search-input {width:100% !important;padding:0.6rem 1rem !important;border:2px solid #e0e0e0 !important;border-radius:50px !important;font-size:0.9rem !important;transition:all 0.3s ease !important;background:white !important;padding-right:40px !important;}.${pageUniqueClass} .search-input:focus {border-color:#7B1FA2 !important;box-shadow:0 0 0 3px rgba(123,31,162,0.1) !important;outline:none !important;}.${pageUniqueClass} .clear-search-btn {position:absolute !important;right:12px !important;top:50% !important;transform:translateY(-50%) !important;background:transparent !important;border:none !important;cursor:pointer !important;color:#6c757d !important;display:none !important;z-index:2 !important;}.${pageUniqueClass} .clear-search-btn:hover {color:#7B1FA2 !important;}.${pageUniqueClass} .breadcrumb {display:flex !important;align-items:center !important;gap:6px !important;padding:0.5rem 0.75rem !important;background:#f8f9fa !important;border-radius:8px !important;margin-bottom:0.75rem !important;flex-wrap:wrap !important;font-size:0.85rem !important;}.${pageUniqueClass} .breadcrumb span {color:#7B1FA2 !important;cursor:pointer !important;}.${pageUniqueClass} .breadcrumb span:hover {text-decoration:underline !important;}.${pageUniqueClass} .breadcrumb .sep {color:#6c757d !important;cursor:default !important;}.${pageUniqueClass} .breadcrumb .current {font-weight:600 !important;color:#4A148C !important;}.${pageUniqueClass} .items-grid {display:grid !important;grid-template-columns:repeat(auto-fill,minmax(180px,1fr)) !important;gap:8px !important;}.${pageUniqueClass} .item-card {background:white !important;border:1px solid #e0e0e0 !important;border-radius:8px !important;padding:0.6rem 0.8rem !important;cursor:pointer !important;transition:all 0.2s ease !important;font-size:0.85rem !important;display:flex !important;align-items:center !important;gap:8px !important;}.${pageUniqueClass} .item-card:hover {background:#f3e5f5 !important;border-color:#7B1FA2 !important;transform:translateY(-1px) !important;}.${pageUniqueClass} .item-card.selected {background:linear-gradient(135deg,#7B1FA2,#4A148C) !important;color:white !important;border-color:#4A148C !important;}.${pageUniqueClass} .item-card i {color:#7B1FA2 !important;font-size:0.9rem !important;}.${pageUniqueClass} .item-card.selected i {color:white !important;}.${pageUniqueClass} .item-card .item-id {font-size:0.7rem !important;opacity:0.7 !important;margin-left:auto !important;}.${pageUniqueClass} .no-results {text-align:center !important;padding:2rem !important;color:#757575 !important;}.${pageUniqueClass} .level-label {font-size:0.8rem !important;color:#6c757d !important;margin-bottom:4px !important;font-weight:500 !important;}.${pageUniqueClass} .search-info {font-size:0.75rem !important;color:#7B1FA2 !important;margin-bottom:6px !important;padding:2px 8px !important;background:rgba(123,31,162,0.08) !important;border-radius:12px !important;display:inline-block !important;}.${pageUniqueClass} .search-result-item {background:white !important;border:1px solid #e0e0e0 !important;border-radius:8px !important;padding:0.5rem 0.75rem !important;cursor:pointer !important;transition:all 0.2s ease !important;margin-bottom:4px !important;}.${pageUniqueClass} .search-result-item:hover {background:#f3e5f5 !important;border-color:#7B1FA2 !important;}.${pageUniqueClass} .search-result-item .path-line {display:flex !important;align-items:center !important;gap:4px !important;color:#6c757d !important;font-size:0.75rem !important;margin-bottom:2px !important;}`;
 document.head.appendChild(scopedStyles);

 const modalDialog = modalElement.querySelector('.modal-dialog');
 modalDialog.classList.add('modal-lg');
 const modalContent = modalElement.querySelector('.modal-content');
 modalContent.innerHTML = '';

 const header = document.createElement('div');
 header.className = 'modal-header';
 header.innerHTML = `<button class="back-btn" disabled><i class="fas fa-arrow-left"></i></button><h5 class="modal-title">Select Location</h5><button class="close-btn"><i class="fas fa-times"></i></button>`;
 modalContent.appendChild(header);

 const body = document.createElement('div');
 body.className = 'modal-body';
 body.innerHTML = `<div class="depth-info" id="depthInfo_${modalId}">Select ${depthLabels[0]}</div><div class="search-container"><input type="text" class="search-input" placeholder="🔍 Search across all levels..." id="depthSearch_${modalId}"><button class="clear-search-btn" id="clearSearch_${modalId}"><i class="fas fa-times-circle"></i></button></div><div class="breadcrumb" id="breadcrumb_${modalId}"></div><div class="items-grid" id="itemsGrid_${modalId}"><div class="text-center p-4 w-100">Loading...</div></div>`;
 modalContent.appendChild(body);

 let currentDepth = 0;
 let selectedIds = [...currentIds];
 let isSearchMode = false;

 // Flatten the entire hierarchy for global search
 function flattenHierarchy() {
  const results = [];
  for (const state of dataArray) {
   if (state.a === 0) continue;
   const districts = state[childKey0] || [];
   for (const district of districts) {
    if (district.a === 0) continue;
    const talukas = district[childKey1] || [];
    if (talukas.length === 0) {
     results.push({ ids: [String(state.a), String(district.a)], names: [state.e, district.e], depth: 2 });
    } else {
     for (const taluka of talukas) {
      if (taluka.a === 0) continue;
      results.push({ ids: [String(state.a), String(district.a), String(taluka.a)], names: [state.e, district.e, taluka.e], depth: 3 });
     }
    }
   }
  }
  return results;
 }

 // Render search results with hierarchical preview
 function renderSearchResults(term) {
  const grid = document.getElementById(`itemsGrid_${modalId}`);
  const clearBtn = document.getElementById(`clearSearch_${modalId}`);
  if (!grid) return;

  const allItems = flattenHierarchy();
  const lowerTerm = term.toLowerCase();
  const filtered = allItems.filter(item => item.names.some(name => (name || '').toLowerCase().includes(lowerTerm)));

  if (clearBtn) clearBtn.style.display = term ? 'block' : 'none';

  if (filtered.length === 0) {
   grid.innerHTML = `<div class="no-results"><i class="fas fa-search fa-2x mb-3"></i><p>No results for "${term}"</p><button class="btn btn-sm btn-outline-primary mt-2" style="border-radius:20px;" onclick="document.getElementById('depthSearch_${modalId}').value='';isSearchMode=false;updateUI();"><i class="fas fa-times me-1"></i>Clear Search</button></div>`;
   return;
  }

  let html = `<div class="search-info"><i class="fas fa-search me-1"></i> Found ${filtered.length} result(s) for "${term}"</div>`;

  filtered.forEach(item => {
   const valueStr = item.ids.join(',');
   const depthLabel = item.depth >= 3 ? 'Taluka' : 'District';
   html += `<div class="search-result-item" data-value="${valueStr}" data-depth="${item.depth}">`;
   html += `<div class="path-line" style="font-size:0.7rem;color:#9C27B0;">${depthLabel} level</div>`;
   item.names.forEach((name, i) => {
    const isLast = i === item.names.length - 1;
    const displayName = (name || '').split(' - ')[0];
    const highlighted = displayName.toLowerCase().includes(lowerTerm) ? `<span style="background:#fff3cd;padding:0 2px;border-radius:2px;">${displayName}</span>` : displayName;
    html += `<div style="padding-left:${i * 16}px;font-size:${i === 0 ? '0.9rem' : i === 1 ? '0.85rem' : '0.8rem'};color:${i === 0 ? '#7B1FA2' : i === 1 ? '#4A148C' : '#212529'};font-weight:${i === 0 ? '600' : '400'};display:flex;align-items:center;gap:4px;">${i > 0 ? '<span style="color:#9C27B0;font-size:0.7rem;">⤵</span> ' : ''}${highlighted}${isLast ? ' <i class="fas fa-check-circle" style="color:#4CAF50;font-size:0.7rem;"></i>' : ''}</div>`;
   });
   html += `</div>`;
  });
  grid.innerHTML = html;

  grid.querySelectorAll('.search-result-item').forEach(card => {
   card.addEventListener('click', () => {
    const newValue = card.dataset.value;
    const itemDepth = parseInt(card.dataset.depth);
    const inEl = document.getElementById(inputId);
    if (inEl) { inEl.value = newValue; }
    const storedArrayName = divElement?.getAttribute('data-selection-array') || fullObject.e || '';
    const storedDepth = parseInt(divElement?.getAttribute('data-depth-for-native')) || requiredDepth;
    if (typeof window.setValByPrprtyDepthToElm === 'function') { window.setValByPrprtyDepthToElm(inputId, newValue, divId, key, { c: storedArrayName, canAdd: 1, depthForNative: storedDepth }); }
    modalInstance.hide();
   });
  });
 }

 function getCurrentArray() {
  let arr = dataArray;
  for (let i = 0; i < currentDepth && i < selectedIds.length; i++) {
   const found = arr.find(item => String(item.a) === selectedIds[i]);
   if (!found) return [];
   if (i === 0) arr = found[childKey0] || [];
   else if (i === 1) arr = found[childKey1] || [];
  }
  return arr;
 }

 function getPathNames() {
  let names = []; let arr = dataArray;
  for (let i = 0; i < selectedIds.length; i++) {
   const found = arr.find(item => String(item.a) === selectedIds[i]);
   if (found) { names.push(found.e || ''); if (i === 0) arr = found[childKey0] || []; else if (i === 1) arr = found[childKey1] || []; }
  }
  return names;
 }

 function updateBreadcrumb() {
  const bc = document.getElementById(`breadcrumb_${modalId}`);
  if (!bc) return;
  const names = getPathNames();
  let html = '<span data-depth="0">Root</span>';
  names.forEach((name, i) => { const shortName = name.split(' - ')[0]; html += `<span class="sep">›</span><span data-depth="${i + 1}"${i === names.length - 1 ? ' class="current"' : ''}>${shortName}</span>`; });
  bc.innerHTML = html;
  bc.querySelectorAll('span[data-depth]').forEach(span => { span.addEventListener('click', () => { const d = parseInt(span.dataset.depth); selectedIds = selectedIds.slice(0, d); currentDepth = d; isSearchMode = false; document.getElementById(`depthSearch_${modalId}`).value = ''; updateUI(); }); });
 }

 function updateDepthInfo() {
  const di = document.getElementById(`depthInfo_${modalId}`);
  if (!di) return;
  if (isSearchMode) { di.textContent = 'Search results across all levels'; di.style.background = '#fff3cd'; di.style.color = '#856404'; }
  else if (currentDepth >= maxDepth - 1) { di.textContent = `Select ${depthLabels[currentDepth] || 'Item'} (Final Level)`; di.style.background = '#e8f5e9'; di.style.color = '#2e7d32'; }
  else { di.textContent = `Select ${depthLabels[currentDepth] || 'Item'} → then ${depthLabels[currentDepth + 1] || 'next'}`; di.style.background = '#f3e5f5'; di.style.color = '#7B1FA2'; }
 }

 function updateSearchPlaceholder() {
  const si = document.getElementById(`depthSearch_${modalId}`);
  if (si) { si.placeholder = '🔍 Search across all levels...'; }
 }

 function updateUI() {
  updateBreadcrumb(); updateDepthInfo(); updateSearchPlaceholder();
  const backBtn = header.querySelector('.back-btn'); if (backBtn) { backBtn.disabled = currentDepth === 0; }
  if (isSearchMode) { const searchInput = document.getElementById(`depthSearch_${modalId}`); if (searchInput && searchInput.value.trim()) { renderSearchResults(searchInput.value.trim()); return; } else { isSearchMode = false; } }
  renderItems();
 }

 function renderItems() {
  const grid = document.getElementById(`itemsGrid_${modalId}`);
  const clearBtn = document.getElementById(`clearSearch_${modalId}`);
  if (!grid) return;

  if (clearBtn) clearBtn.style.display = 'none';

  let items = getCurrentArray().filter(item => item.a !== 0);
  if (items.length === 0) { grid.innerHTML = '<div class="no-results"><i class="fas fa-info-circle fa-2x mb-3"></i><p>No items available</p></div>'; return; }

  const currentSelId = selectedIds.length > currentDepth ? selectedIds[currentDepth] : null;
  const isFinalLevel = currentDepth >= maxDepth - 1;

  let html = `<div class="level-label">${depthLabels[currentDepth] || 'Items'} (${items.length})</div>`;
  items.forEach(item => {
   const id = String(item.a);
   const fullName = item.e || '';
   const name = fullName.split(' - ')[0];
   const isSelected = currentSelId === id;
   const hasChildren = !isFinalLevel && (currentDepth === 0 ? (item[childKey0] && item[childKey0].length > 0) : (currentDepth === 1 ? (item[childKey1] && item[childKey1].length > 0) : false));
   html += `<div class="item-card${isSelected ? ' selected' : ''}" data-id="${id}" data-has-children="${hasChildren}" data-is-final="${isFinalLevel}"><i class="fas ${isFinalLevel ? 'fa-check-circle' : hasChildren ? 'fa-folder-open' : 'fa-map-marker-alt'}"></i>${name}<span class="item-id">#${id}</span></div>`;
  });
  grid.innerHTML = html;

  grid.querySelectorAll('.item-card').forEach(card => {
   card.addEventListener('click', () => {
    const id = card.dataset.id;
    const hasChildren = card.dataset.hasChildren === 'true';
    const isFinal = card.dataset.isFinal === 'true';
    selectedIds = selectedIds.slice(0, currentDepth);
    selectedIds.push(id);
    if (hasChildren && !isFinal) { currentDepth++; isSearchMode = false; document.getElementById(`depthSearch_${modalId}`).value = ''; updateUI(); }
    else {
     const newValue = selectedIds.join(',');
     const inEl = document.getElementById(inputId);
     if (inEl) { inEl.value = newValue; }
     const storedArrayName = divElement?.getAttribute('data-selection-array') || fullObject.e || '';
     const storedDepth = parseInt(divElement?.getAttribute('data-depth-for-native')) || requiredDepth;
     if (typeof window.setValByPrprtyDepthToElm === 'function') { window.setValByPrprtyDepthToElm(inputId, newValue, divId, key, { c: storedArrayName, canAdd: 1, depthForNative: storedDepth }); }
     modalInstance.hide();
    }
   });
  });
 }

 // Search handler
 const searchInput = document.getElementById(`depthSearch_${modalId}`);
 const clearBtn = document.getElementById(`clearSearch_${modalId}`);
 let searchTimeout;
 if (searchInput) {
  searchInput.addEventListener('input', (e) => {
   clearTimeout(searchTimeout);
   const term = e.target.value.trim();
   if (clearBtn) clearBtn.style.display = term ? 'block' : 'none';
   if (term) {
    isSearchMode = true;
    updateDepthInfo();
    searchTimeout = setTimeout(() => renderSearchResults(term), 250);
   } else {
    isSearchMode = false;
    updateUI();
   }
  });
 }
 if (clearBtn) { clearBtn.addEventListener('click', () => { isSearchMode = false; searchInput.value = ''; clearBtn.style.display = 'none'; updateUI(); }); }

 header.querySelector('.back-btn').addEventListener('click', () => { if (currentDepth > 0) { currentDepth--; selectedIds.pop(); isSearchMode = false; if (searchInput) searchInput.value = ''; updateUI(); } });
 header.querySelector('.close-btn').addEventListener('click', () => modalInstance.hide());

 if (selectedIds.length > 0) { currentDepth = Math.min(selectedIds.length, maxDepth); }
 else { currentDepth = 0; }

 setTimeout(() => updateUI(), 100);

 modalElement.addEventListener('hidden.bs.modal', function onHide() {
  modalElement.removeEventListener('hidden.bs.modal', onHide);
  if (scopedStyles && scopedStyles.parentNode) scopedStyles.parentNode.removeChild(scopedStyles);
  setTimeout(() => { if (modalElement && modalElement.parentNode) modalElement.parentNode.removeChild(modalElement); }, 300);
 });

 modalInstance.show();
}