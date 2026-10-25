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

 // Build hierarchical display
 const mainContainer = document.createElement('div');
 mainContainer.style.cssText = 'display: flex; flex-direction: column; gap: 1px; margin-top: 4px; min-width: 0; max-width: 100%;';

 //"@ctry" means the level below a country lives in that country's own region
 //list (var_<iso2>tal), not in a property on the country item
 let currentArray = dataArray;
 for (let i = 0; i < valueIds.length; i++) {
  const id = valueIds[i];
  const found = currentArray.find(item => String(item.a) === id);
  if (found) {
   const fullName = found.e || '';
   const line = document.createElement('div');
   line.style.cssText = `padding-left: ${i * 16}px; font-size: ${i === 0 ? '0.9rem' : i === 1 ? '0.85rem' : '0.8rem'}; color: ${i === 0 ? '#8B1E3F' : i === 1 ? '#6E1733' : '#212529'}; font-weight: ${i === 0 ? '600' : '400'}; display: flex; align-items: center; gap: 4px; min-width: 0; max-width: 100%; overflow-wrap: anywhere;`;
   if (i > 0) { line.innerHTML = '<span style="color:#c9a45c;font-size:0.7rem;">⤵</span> '; }
   line.innerHTML += fullName;
   mainContainer.appendChild(line);
   const seg = (i < childKeys.length) ? childKeys[i] : 'x';
   if (seg === '@ctry') {
    const loaded = (typeof window.__mrCtryRegionList === 'function') ? window.__mrCtryRegionList(found) : null;
    if (loaded) {
     currentArray = loaded;
    } else {
     if (typeof window.__mrCtryTbl === 'function' && window.__mrCtryTbl(found) && i < valueIds.length - 1 && typeof window.__mrLoadCtryRegion === 'function') {
      //region list not in memory yet: show the ctco fallback and repaint once
      //the country's own list (if any) has loaded
      const _val = value, _fo = fullObject;
      window.__mrLoadCtryRegion(found).then(function (list) {
       if (Array.isArray(list) && list.length && typeof window.setValByPrprtyDepthToElm === 'function') {
        window.setValByPrprtyDepthToElm(inputId, _val, divId, key, _fo);
       }
      });
     }
     currentArray = found.x || [];
    }
   } else {
    currentArray = found[seg] || [];
   }
  }
 }

 const wrapper = document.createElement('div');
 wrapper.style.cssText = 'display: flex; align-items: flex-start; gap: 8px; min-width: 0; max-width: 100%;';
 const textContainer = document.createElement('div');
 //min-width 0 lets the tree lines wrap instead of forcing the row wider
 textContainer.style.cssText = 'flex: 1 1 auto; min-width: 0;';
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
  //regis exposes the field's depth-picker object (labels, full names, locked
  //levels) so the pencil opens exactly the same modal as the box itself
  let fo = null;
  try { if (typeof window.mrDepthPickerObject === 'function') fo = window.mrDepthPickerObject(key); } catch (eObj) { fo = null; }
  if (!fo) fo = { e: selectionArrayName, f: requiredDepth };
  if (typeof window.openDepthSelectionModal === 'function') { window.openDepthSelectionModal(inputId, value, divId, key, fo); }
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

 //country-rooted tree: level 0 lists countries (var_ctco) and "@ctry" marks the
 //level below a country, which comes from that country's own region list
 const isCtryRoot = childKeys.length > 0 && childKeys[0] === '@ctry';
 //the religion/caste tree (regis k -> "var_caste_rlgns,x,x"): it has a config
 //default of its own (dfltReligious) instead of a country root, and is handled
 //with the same seed / pin / banner contract below
 const isReligionRoot = arrayName === 'var_caste_rlgns';
 const requiredDepth = fullObject.f || 3;
 const maxDepth = Math.min(childKeys.length + 1, requiredDepth);
 const depthLabels = (Array.isArray(fullObject.labels) && fullObject.labels.length) ? fullObject.labels : ['State', 'District', 'Taluka', 'Village'];
 const pickerTitle = fullObject.title || 'Select Location';

 //field-scoped name display: the religion/caste tree stores compound names
 //("Muslim - Malik") and must show them in full; location lists carry bilingual
 //names ("JAMMU & KASHMIR - जम्मू और कश्मीर") and keep the short English part
 const keepFullNames = !!(fullObject && fullObject.fullNames);
 //"Partially" (the filter's city pickers, mr.da fltr*Cntry) lets the user commit a
 //partial path: an OK button writes the deepest chosen level, not only a leaf item,
 //so a whole state/district works as a filter
 //mustSelectTillLast (mr.da dfltReligious / dfltCaste / default*Country) is the same
 //switch seen from the form side: 1 (or an absent key) commits only a full path down
 //to the last level, 0 also offers the OK button so the user may stop early
 const mustSelectTillLast = (fullObject && fullObject.mustSelectTillLast !== undefined &&
  fullObject.mustSelectTillLast !== null && fullObject.mustSelectTillLast !== '')
  ? (Number(fullObject.mustSelectTillLast) === 0 ? 0 : 1) : 1;
 const partially = !!(fullObject && fullObject.partially) || mustSelectTillLast === 0;
 //0-based levels frozen by config (dfltReligious -> 0, dfltCaste -> 1); they are
 //never changeable and Clear can never remove them
 const lockedLevels = (fullObject && Array.isArray(fullObject.lockedLevels)) ? fullObject.lockedLevels.map(Number) : [];
 function isLevelLocked(d) { return lockedLevels.indexOf(d) >= 0; }
 //how many leading levels are frozen (locked levels always form a prefix)
 function lockedDepthCount() { var n = 0; while (lockedLevels.indexOf(n) >= 0) n++; return n; }

 const dataArray = window[arrayName];
 if (!dataArray || !Array.isArray(dataArray)) { console.error(`Data array "${arrayName}" not found`); return; }

 const currentValue = value ? String(value).trim() : '';
 const currentIds = currentValue ? currentValue.split(',').map(v => v.trim()) : [];

 //region list of the country currently being browsed (null until loaded, or when
 //the country has no list and ctco's own nested cities are used instead)
 let regionList = null;
 let regionCountryId = null;
 //bumped whenever the region data above changes, so the search index is rebuilt
 let regionToken = 0;
 //true once a fixed country (canChngeCountry 0) has been pinned: level 0 is frozen
 let countryLocked = false;

 function ctryItem(id) {
  if (id === undefined || id === null || id === '') return null;
  return dataArray.find(it => it && String(it.a) === String(id)) || null;
 }

 //children of an item at a given level; "@ctry" resolves to the country's list
 function childrenOf(item, level) {
  const key = childKeys[level];
  if (key === undefined) return [];
  if (key === '@ctry') {
   const loaded = (typeof window.__mrCtryRegionList === 'function') ? window.__mrCtryRegionList(item) : null;
   if (loaded) return loaded;
   if (regionCountryId === String(item.a) && Array.isArray(regionList)) return regionList;
   return item.x || [];
  }
  return item[key] || [];
 }

 function hasRegionFor(id) {
  const c = ctryItem(id);
  if (!c) return false;
  if (regionCountryId === String(c.a) && Array.isArray(regionList)) return true;
  return !!(typeof window.__mrCtryRegionList === 'function' && window.__mrCtryRegionList(c));
 }

 //a country without a region file only has its country + city levels
 function effectiveMaxDepth() {
  if (!isCtryRoot) return maxDepth;
  if (currentDepth === 0) return maxDepth;
  return Math.min(hasRegionFor(selectedIds[0]) ? childKeys.length + 1 : 2, requiredDepth);
 }

 function labelForDepth(d) {
  if (!isCtryRoot) return depthLabels[d] || 'Item';
  if (d === 0) return 'Country';
  if (!hasRegionFor(selectedIds[0])) return 'City';
  return depthLabels[d - 1] || 'Taluka';
 }

 const modalId = `depth_select_modal_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
 const modalObj = create_modal_dynamically(modalId);
 const modalInstance = modalObj.modalInstance;
 const modalElement = modalObj.modalElement;
 const modalBody = modalObj.contentElement;

 const pageUniqueClass = `depth-select-modal-${Date.now()}`;
 modalElement.classList.add(pageUniqueClass);

 const scopedStyles = document.createElement('style');
 scopedStyles.textContent = `.${pageUniqueClass} .modal-header {display:flex !important;align-items:center !important;padding:0.75rem 1rem !important;background:linear-gradient(135deg,#8B1E3F,#6E1733) !important;color:white !important;border-radius:10px 10px 0 0 !important;}.${pageUniqueClass} .modal-header .back-btn {background:rgba(255,255,255,0.2) !important;border:none !important;border-radius:50% !important;width:36px !important;height:36px !important;display:flex !important;align-items:center !important;justify-content:center !important;color:white !important;cursor:pointer !important;font-size:1rem !important;}.${pageUniqueClass} .modal-header .close-btn {background:rgba(255,255,255,0.2) !important;border:none !important;border-radius:50% !important;width:36px !important;height:36px !important;display:flex !important;align-items:center !important;justify-content:center !important;color:white !important;cursor:pointer !important;font-size:1rem !important;}.${pageUniqueClass} .modal-header .close-btn:hover {background:rgba(255,255,255,0.3) !important;}.${pageUniqueClass} .modal-header .back-btn:disabled {opacity:0.3 !important;cursor:not-allowed !important;}.${pageUniqueClass} .modal-header .modal-title {flex:1 !important;text-align:center !important;margin:0 !important;font-weight:600 !important;font-size:1.1rem !important;}.${pageUniqueClass} .modal-body {padding:1rem !important;max-height:65vh !important;overflow-y:auto !important;}.${pageUniqueClass} .depth-info {background:#faf4e6 !important;padding:0.5rem 0.75rem !important;border-radius:8px !important;margin-bottom:0.75rem !important;font-size:0.8rem !important;color:#8B1E3F !important;text-align:center !important;font-weight:500 !important;}.${pageUniqueClass} .search-container {margin:-1rem -1rem .75rem !important;position:sticky !important;top:0 !important;z-index:10 !important;background:var(--bs-body-bg,#fff) !important;padding:1rem 1rem .6rem !important;}.${pageUniqueClass} .search-input {width:100% !important;padding:0.6rem 1rem !important;border:2px solid #e0e0e0 !important;border-radius:50px !important;font-size:0.9rem !important;transition:all 0.3s ease !important;background:white !important;padding-right:40px !important;}.${pageUniqueClass} .search-input:focus {border-color:#8B1E3F !important;box-shadow:0 0 0 3px rgba(139,30,63,0.1) !important;outline:none !important;}.${pageUniqueClass} .clear-search-btn {position:absolute !important;right:12px !important;top:50% !important;transform:translateY(-50%) !important;background:transparent !important;border:none !important;cursor:pointer !important;color:#6c757d !important;display:none !important;z-index:2 !important;}.${pageUniqueClass} .clear-search-btn:hover {color:#8B1E3F !important;}.${pageUniqueClass} .breadcrumb {display:flex !important;align-items:center !important;gap:6px !important;padding:0.5rem 0.75rem !important;background:#f8f9fa !important;border-radius:8px !important;margin-bottom:0.75rem !important;flex-wrap:wrap !important;font-size:0.85rem !important;}.${pageUniqueClass} .breadcrumb span {color:#8B1E3F !important;cursor:pointer !important;}.${pageUniqueClass} .breadcrumb span:hover {text-decoration:underline !important;}.${pageUniqueClass} .breadcrumb .sep {color:#6c757d !important;cursor:default !important;}.${pageUniqueClass} .breadcrumb .current {font-weight:600 !important;color:#6E1733 !important;}.${pageUniqueClass} .items-grid {display:grid !important;grid-template-columns:repeat(auto-fill,minmax(180px,1fr)) !important;gap:8px !important;}.${pageUniqueClass} .modal-footer {display:flex !important;justify-content:flex-end !important;gap:8px !important;padding:0.75rem 1rem !important;border-top:1px solid #e0e0e0 !important;}.${pageUniqueClass} .modal-footer .clear-btn {border-radius:20px !important;}.${pageUniqueClass} .item-card {background:white !important;border:1px solid #6c757d !important;border-radius:8px !important;padding:0.6rem 0.8rem !important;cursor:pointer !important;transition:all 0.2s ease !important;font-size:0.85rem !important;display:flex !important;align-items:center !important;gap:8px !important;}.${pageUniqueClass} .item-card:hover {background:#faf4e6 !important;border-color:#8B1E3F !important;transform:translateY(-1px) !important;}.${pageUniqueClass} .item-card.selected {background:linear-gradient(135deg,#8B1E3F,#6E1733) !important;color:white !important;border-color:#6E1733 !important;}.${pageUniqueClass} .item-card i {color:#8B1E3F !important;font-size:0.9rem !important;}.${pageUniqueClass} .item-card.selected i {color:white !important;}.${pageUniqueClass} .item-card .item-id {font-size:0.7rem !important;opacity:0.7 !important;margin-left:auto !important;}.${pageUniqueClass} .no-results {text-align:center !important;padding:2rem !important;color:#757575 !important;}.${pageUniqueClass} .level-label {font-size:0.8rem !important;color:#6c757d !important;margin-bottom:4px !important;font-weight:500 !important;}.${pageUniqueClass} .search-info {font-size:0.75rem !important;color:#8B1E3F !important;margin-bottom:6px !important;padding:2px 8px !important;background:rgba(139,30,63,0.08) !important;border-radius:12px !important;display:inline-block !important;}.${pageUniqueClass} .search-result-item {background:white !important;border:1px solid #6c757d !important;border-radius:8px !important;padding:0.5rem 0.75rem !important;cursor:pointer !important;transition:all 0.2s ease !important;margin-bottom:4px !important;}.${pageUniqueClass} .search-result-item:hover {background:#faf4e6 !important;border-color:#8B1E3F !important;}.${pageUniqueClass} .search-result-item .path-line {display:flex !important;align-items:center !important;gap:4px !important;color:#6c757d !important;font-size:0.75rem !important;margin-bottom:2px !important;}`;
 document.head.appendChild(scopedStyles);
 scopedStyles.textContent += `.${pageUniqueClass} .country-info{display:flex;align-items:center;gap:6px;flex-wrap:wrap;background:#eef6ff !important;color:#0b5394 !important;border:1px solid #cfe3ff !important;border-radius:8px !important;padding:0.45rem 0.75rem !important;margin-bottom:0.75rem !important;font-size:0.85rem !important;font-weight:500 !important;}.${pageUniqueClass} .country-info .ctry-id{color:#6c8ebf !important;font-weight:600 !important;}.${pageUniqueClass} .country-info .change-country-btn{margin-left:auto !important;background:linear-gradient(135deg,#8B1E3F,#6E1733) !important;color:#fff !important;border:none !important;border-radius:20px !important;padding:0.25rem 0.7rem !important;font-size:0.78rem !important;font-weight:500 !important;cursor:pointer !important;}.${pageUniqueClass} .country-info .change-country-btn:hover{opacity:0.9 !important;}`;
 //a frozen level (dfltReligious / dfltCaste): its non-fixed rows look inert
 scopedStyles.textContent += `.${pageUniqueClass} .item-card.locked{opacity:.8 !important;cursor:default !important;background:#f4efe3 !important;border-color:#c9a45c !important;}.${pageUniqueClass} .item-card.locked:hover{transform:none !important;background:#f4efe3 !important;border-color:#c9a45c !important;}.${pageUniqueClass} .item-card.locked i{color:#c9a45c !important;}`;
 //partial selection: the OK button is pushed to the right of Clear, in the app's own colour
 scopedStyles.textContent += `.${pageUniqueClass} .modal-footer .ok-btn{margin-left:auto !important;background:linear-gradient(135deg,#8B1E3F,#6E1733) !important;border:none !important;color:#fff !important;border-radius:8px !important;padding:6px 18px !important;font-weight:600 !important;}.${pageUniqueClass} .modal-footer .ok-btn:disabled{opacity:.5 !important;cursor:not-allowed !important;}`;

 const modalDialog = modalElement.querySelector('.modal-dialog');
 modalDialog.classList.add('modal-lg');
 const modalContent = modalElement.querySelector('.modal-content');
 modalContent.innerHTML = '';

 const header = document.createElement('div');
 header.className = 'modal-header';
 header.innerHTML = `<button class="back-btn" disabled><i class="fas fa-arrow-left"></i></button><h5 class="modal-title">${pickerTitle}</h5><button class="close-btn"><i class="fas fa-times"></i></button>`;
 modalContent.appendChild(header);

 const body = document.createElement('div');
 body.className = 'modal-body';
 body.innerHTML = `<div class="country-info" id="countryInfo_${modalId}" style="display:none;"></div><div class="depth-info" id="depthInfo_${modalId}">Select ${isCtryRoot ? 'Country' : depthLabels[0]}</div><div class="search-container"><input type="text" class="search-input" placeholder="🔍 Search across all levels..." id="depthSearch_${modalId}"><button class="clear-search-btn" id="clearSearch_${modalId}"><i class="fas fa-times-circle"></i></button></div><div class="breadcrumb" id="breadcrumb_${modalId}"></div><div class="items-grid" id="itemsGrid_${modalId}"><div class="text-center p-4 w-100">Loading...</div></div>`;
 modalContent.appendChild(body);

 const footer = document.createElement('div');
 footer.className = 'modal-footer';
 const footerClearBtn = document.createElement('button');
 footerClearBtn.type = 'button';
 footerClearBtn.className = 'btn btn-secondary clear-btn';
 footerClearBtn.innerHTML = '<i class="fas fa-eraser me-1"></i> Clear';
 const startHasValue = value !== null && value !== undefined && String(value).trim() !== '';
 const valueParts = value ? String(value).split(',').filter(s => s.trim() !== '').length : 0;
 let fixedDepth = Math.max(lockedDepthCount(), Math.min(Math.max(0, parseInt(fullObject.fixedDepth, 10) || 0), Math.max(0, valueParts)));
 //a frozen level survives Clear, so the button stays usable while an editable
 //level below the locked prefix still holds a value
 footerClearBtn.disabled = !startHasValue || (valueParts <= fixedDepth);
 footer.appendChild(footerClearBtn);
 //partial selection (filter city pickers, mr.da "Partially"): an OK button commits
 //the deepest chosen level instead of only a leaf. Shown only when the caller asks.
 let footerOkBtn = null;
 if (partially) {
  footerOkBtn = document.createElement('button');
  footerOkBtn.type = 'button';
  footerOkBtn.className = 'btn btn-primary ok-btn';
  footerOkBtn.innerHTML = '<i class="fas fa-check me-1"></i> OK';
  footerOkBtn.disabled = true;
  footerOkBtn.addEventListener('click', () => commitCurrentPath());
  footer.appendChild(footerOkBtn);
 }
 modalContent.appendChild(footer);

 footerClearBtn.addEventListener('click', () => {
  //a frozen religion/caste can never be cleared: keep the locked prefix and only
  //wipe the editable levels below it
  const kept = selectedIds.slice(0, fixedDepth).filter(v => v !== '' && v !== null && v !== undefined);
  const newValue = kept.join(',');
  const inEl = document.getElementById(inputId);
  if (inEl) { inEl.value = newValue; }
  const storedArrayName = divElement.getAttribute('data-selection-array') || fullObject.e || '';
  const storedDepth = parseInt(divElement.getAttribute('data-depth-for-native')) || requiredDepth;
  if (typeof window.setValByPrprtyDepthToElm === 'function') {
   window.setValByPrprtyDepthToElm(inputId, newValue, divId, key, { c: storedArrayName, canAdd: 1, depthForNative: storedDepth });
  }
  modalInstance.hide();
 });

 let currentDepth = 0;
 let selectedIds = [...currentIds];
 let isSearchMode = false;

 //write the deepest selected level as the value (the OK button, present only when the
 //caller allows a partial path). Mirrors the leaf-click commit in renderItems.
 function commitCurrentPath() {
  const newValue = selectedIds.filter(v => v !== '' && v !== null && v !== undefined).join(',');
  if (!newValue) return;
  const inEl = document.getElementById(inputId);
  if (inEl) inEl.value = newValue;
  const storedArrayName = divElement.getAttribute('data-selection-array') || fullObject.e || '';
  const storedDepth = parseInt(divElement.getAttribute('data-depth-for-native')) || requiredDepth;
  if (typeof window.setValByPrprtyDepthToElm === 'function') {
   window.setValByPrprtyDepthToElm(inputId, newValue, divId, key, { c: storedArrayName, canAdd: 1, depthForNative: storedDepth });
  }
  modalInstance.hide();
 }

 //a country-rooted picker works INSIDE the config default country: seed it when the
 //field is empty, so the grid opens on that country's own <iso2>tal levels (India ->
 //states). canChngeCountry 1 lets Back / the Change button return to the country list;
 //0 freezes level 0 instead, so the country can never be swapped.
 if (isCtryRoot) {
  //the caller's own object wins: the filter scopes its pickers with its mr.da block
  //(fltr*Cntry), while the register form passes what regis exposes for the same key
  const ciC = (fullObject && fullObject.ctry) ||
              (typeof window.mrCountryInfoFor === 'function' && window.mrCountryInfoFor(key)) || null;
  if (ciC && ciC.id !== undefined && ciC.id !== null && ciC.id !== '' &&
      (!selectedIds.length || String(selectedIds[0]) === String(ciC.id))) {
   const row = ctryItem(ciC.id);
   if (row) {
    if (!selectedIds.length) selectedIds = [String(row.a)];
    if (ciC.canChange === false) {
     countryLocked = true;
     lockedLevels.push(0);
     fixedDepth = Math.max(fixedDepth, 1);
    }
   }
  }
 }

 //a frozen prefix (locked religion/caste, or a country that cannot be changed)
 //moves the picker's headline down to the first editable level, so the header
 //matches the guided line ("Select Caste" instead of "Select Religion")
 if (isReligionRoot && fullObject && fullObject.relig) {
  //same contract as the country block above: the config default (dfltReligious)
  //seeds an EMPTY field so the modal opens inside that religion's castes, while
  //canChngeReligious 0 pins level 0 (regis normally hands that pin over through
  //lockedLevels; the push here only covers a caller that passes the flag alone)
  const riC = fullObject.relig;
  if (riC.id !== undefined && riC.id !== null && riC.id !== '' &&
      (!selectedIds.length || String(selectedIds[0]) === String(riC.id))) {
   const rowRel = dataArray.find(it => it && String(it.a) === String(riC.id));
   if (rowRel) {
    if (!selectedIds.length) selectedIds = [String(rowRel.a)];
    if (riC.canChange === false && lockedLevels.indexOf(0) < 0) {
     lockedLevels.push(0);
     fixedDepth = Math.max(fixedDepth, 1);
    }
   }
  }
 }
 if (fixedDepth > 0) {
  const titleEl = header.querySelector('.modal-title');
  if (titleEl) titleEl.textContent = `Select ${labelForDepth(Math.min(fixedDepth, effectiveMaxDepth() - 1))}`;
 }

 // ---- search index: the WHOLE tree, always from the root -------------------
 //One compact record per node: { p: parent index, i: id, n: name, nl: lowercase
 //name, np: " - " parts (or null), d: depth, leaf: no children }. Built once per modal (and again whenever
 //a country's region list arrives) so typing never re-walks the tree, and every
 //level - not just the current one, and not just leaves - stays searchable.
 let flatIndex = null;
 let flatKey = null;

 //rows are capped so a broad term (a country name matching every one of its
 //cities) can never freeze the modal by rendering thousands of nodes
 const SEARCH_ROW_LIMIT = 200;

 function buildFlatIndex() {
  const out = [];
  function walk(arr, parent, level, depth) {
   for (const it of arr) {
    if (!it || it.a === 0) continue;
    const idx = out.length;
    const name = it.e || '';
    //names are often "English - हिंदी" (or "Muslim - Sunni"): keep the parts so an
    //exact hit on either side still counts as an exact hit
    const parts = name.indexOf(' - ') >= 0 ? name.split(' - ').map(p => p.trim().toLowerCase()).filter(Boolean) : null;
    out.push({ p: parent, i: String(it.a), n: name, nl: name.toLowerCase(), np: parts, d: depth, leaf: true });
    const kids = childrenOf(it, level).filter(k => k && k.a !== 0);
    if (kids.length) {
     out[idx].leaf = false;
     walk(kids, idx, level + 1, depth + 1);
    } else if (level === 0 && isCtryRoot && typeof window.__mrCtryTbl === 'function' && window.__mrCtryTbl(it)) {
     //no rows in memory yet, but the country may still own a region file: keep it
     //a folder (same rule as the item grid) so it navigates instead of committing
     out[idx].leaf = false;
    }
   }
  }
  walk(dataArray, -1, 0, 1);
  return out;
 }

 function searchIndex() {
  const key = arrayName + '|' + regionToken;
  if (flatKey === key && flatIndex) return flatIndex;
  flatIndex = buildFlatIndex();
  flatKey = key;
  return flatIndex;
 }

 //ids + names of one index row, root first
 function pathOf(flat, idx) {
  const ids = [];
  const names = [];
  let i = idx;
  while (i >= 0) {
   ids.push(flat[i].i);
   names.push(flat[i].n);
   i = flat[i].p;
  }
  ids.reverse();
  names.reverse();
  return { ids, names };
 }

 //an ancestor at a given depth (1 = top row); allocation free
 function ancestorAtDepth(flat, idx, targetDepth) {
  let i = idx;
  if (flat[i].d < targetDepth) return null;
  let steps = flat[i].d - targetDepth;
  while (steps > 0 && i >= 0) { i = flat[i].p; steps--; }
  return i >= 0 ? flat[i] : null;
 }

 //a locked root (a fixed religion) stays invisible to search: its own row and
 //every sibling branch are dropped, so a result can never rewrite the lock
 function allowedByFixedRoot(flat, idx) {
  if (fixedDepth <= 0) return true;
  if (flat[idx].d <= fixedDepth) return false;
  for (let f = 1; f <= fixedDepth; f++) {
   const a = ancestorAtDepth(flat, idx, f);
   if (!a || a.i !== selectedIds[f - 1]) return false;
  }
  return true;
 }

 //Best rank of one lower-cased candidate string against the term: 0 exact,
 //1 starts with, 2 contains, -1 no match.
 function tierOf(s, lowerTerm) {
  if (!s) return -1;
  if (s === lowerTerm) return 0;
  if (s.startsWith(lowerTerm)) return 1;
  if (s.includes(lowerTerm)) return 2;
  return -1;
 }

 //a node matches on its whole name or on any of its " - " parts (so "Mumbai - मुंबई"
 //is an exact hit for "mumbai", and "Muslim - Sunni" an exact hit for "sunni")
 function ownMatchTier(node, lowerTerm) {
  let best = tierOf(node.nl, lowerTerm);
  const parts = node.np;
  if (parts) {
   for (const p of parts) {
    const r = tierOf(p, lowerTerm);
    if (r >= 0 && (best < 0 || r < best)) best = r;
   }
  }
  return best;
 }

 function matchRank(flat, idx, lowerTerm) {
  const own = ownMatchTier(flat[idx], lowerTerm);
  if (own >= 0) return own;
  let best = -1;
  let i = flat[idx].p;
  while (i >= 0) {
   const a = ownMatchTier(flat[i], lowerTerm);
   if (a >= 0) {
    const tier = 3 + a;
    if (best < 0 || tier < best) best = tier;
   }
   i = flat[i].p;
  }
  return best;
 }

 //a partial row (religion / country / state / caste ...) opens the level below it
 //instead of committing an incomplete path; leaves still commit
 function gotoResultPath(ids, depth) {
  selectedIds = ids.slice();
  currentDepth = Math.max(fixedDepth, Math.min(depth, Math.max(1, effectiveMaxDepth() - 1)));
  isSearchMode = false;
  const si = document.getElementById(`depthSearch_${modalId}`);
  if (si) si.value = '';
  const cb = document.getElementById(`clearSearch_${modalId}`);
  if (cb) cb.style.display = 'none';

  //a result inside a country we have not opened yet: load its list first
  if (isCtryRoot && ids.length) {
   const c = ctryItem(ids[0]);
   if (c && regionCountryId !== String(c.a)) {
    const g = document.getElementById(`itemsGrid_${modalId}`);
    if (g) g.innerHTML = '<div class="text-center p-4 w-100">Loading...</div>';
    Promise.resolve(typeof window.__mrLoadCtryRegion === 'function' ? window.__mrLoadCtryRegion(c) : null)
     .then(function (list) {
      regionCountryId = String(c.a);
      regionList = (Array.isArray(list) && list.length) ? list : null;
      regionToken++;
      updateUI();
     })
     .catch(function () { updateUI(); });
    return;
   }
  }
  updateUI();
 }

 // Render search results with hierarchical preview
 function renderSearchResults(term) {
  const grid = document.getElementById(`itemsGrid_${modalId}`);
  const clearBtn = document.getElementById(`clearSearch_${modalId}`);
  if (!grid) return;

  const flat = searchIndex();
  const lowerTerm = term.toLowerCase();
  //group the hits by level, then by rank (exact name first, then name matches,
  //then rows that only match through an ancestor), so the list reads root level
  //first, then the next level down. Walking in index order keeps the tree order
  //- full paths down to leaves - inside every (level, rank) cell, so no sort.
  const depthBuckets = [];
  for (let i = 0; i < flat.length; i++) {
   if (!allowedByFixedRoot(flat, i)) continue;
   const rank = matchRank(flat, i, lowerTerm);
   if (rank < 0) continue;
   const d = flat[i].d;
   if (!depthBuckets[d]) depthBuckets[d] = [[], [], [], [], [], []];
   depthBuckets[d][rank].push(i);
  }
  const filtered = [];
  for (const perRank of depthBuckets) {
   if (!perRank) continue;
   for (const bucket of perRank) {
    for (const idx of bucket) filtered.push(idx);
   }
  }

  if (clearBtn) clearBtn.style.display = term ? 'block' : 'none';

  if (filtered.length === 0) {
   grid.innerHTML = `<div class="no-results"><i class="fas fa-search fa-2x mb-3"></i><p>No results for "${term}"</p><button class="btn btn-sm btn-outline-primary mt-2" data-nores-clear="1" style="border-radius:20px;"><i class="fas fa-times me-1"></i>Clear Search</button></div>`;
   const clr = grid.querySelector('[data-nores-clear]');
   if (clr) clr.addEventListener('click', function () {
    const si2 = document.getElementById(`depthSearch_${modalId}`);
    if (si2) si2.value = '';
    const cb2 = document.getElementById(`clearSearch_${modalId}`);
    if (cb2) cb2.style.display = 'none';
    isSearchMode = false;
    updateUI();
   });
   return;
  }

  //rows are capped so a broad term (a country name matching every city under it)
  //can never freeze the modal by rendering thousands of nodes
  const shown = filtered.slice(0, SEARCH_ROW_LIMIT);
  let html = `<div class="search-info"><i class="fas fa-search me-1"></i> Found ${filtered.length} result(s) for "${term}"${filtered.length > shown.length ? ` (showing first ${shown.length})` : ''}</div>`;

  shown.forEach(function (idx) {
   const path = pathOf(flat, idx);
   const item = { ids: path.ids, names: path.names, depth: flat[idx].d, leaf: flat[idx].leaf };
   const valueStr = item.ids.join(',');
   const depthLabel = labelForDepth(item.depth - 1);
   html += `<div class="search-result-item" data-value="${valueStr}" data-depth="${item.depth}" data-leaf="${item.leaf ? 1 : 0}">`;
   html += `<div class="path-line" style="font-size:0.7rem;color:#c9a45c;">${depthLabel} level</div>`;
   item.names.forEach((name, i) => {
    const isLast = i === item.names.length - 1;
    const displayName = keepFullNames ? String(name || '') : String(name || '').split(' - ')[0];
    const highlighted = displayName.toLowerCase().includes(lowerTerm) ? `<span style="background:#fff3cd;padding:0 2px;border-radius:2px;">${displayName}</span>` : displayName;
    html += `<div style="padding-left:${i * 16}px;font-size:${i === 0 ? '0.9rem' : i === 1 ? '0.85rem' : '0.8rem'};color:${i === 0 ? '#8B1E3F' : i === 1 ? '#6E1733' : '#212529'};font-weight:${i === 0 ? '600' : '400'};display:flex;align-items:center;gap:4px;">${i > 0 ? '<span style="color:#c9a45c;font-size:0.7rem;">⤵</span> ' : ''}${highlighted}${isLast ? ' <i class="fas fa-check-circle" style="color:#4CAF50;font-size:0.7rem;"></i>' : ''}</div>`;
   });
   html += `</div>`;
  });
  grid.innerHTML = html;

  grid.querySelectorAll('.search-result-item').forEach(card => {
   card.addEventListener('click', () => {
    const newValue = card.dataset.value;
    const itemDepth = parseInt(card.dataset.depth, 10);
    //a row that still has children (religion / country / state / caste) opens the
    //level below it; only a leaf writes a value
    if (card.dataset.leaf !== '1') {
     gotoResultPath(String(newValue).split(',').filter(Boolean), itemDepth);
     return;
    }
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
   arr = childrenOf(found, i);
  }
  return arr;
 }

 function getPathNames() {
  let names = []; let arr = dataArray;
  for (let i = 0; i < selectedIds.length; i++) {
   const found = arr.find(item => String(item.a) === selectedIds[i]);
   if (!found) break;
   names.push(found.e || '');
   arr = childrenOf(found, i);
  }
  return names;
 }

 //descend from the country level: load its region list (or fall back to ctco's
 //nested cities when the country has no list), then paint level 1
 function enterCountry(country) {
  if (!country) return;
  const cid = String(country.a);
  const grid = document.getElementById(`itemsGrid_${modalId}`);
  if (grid) grid.innerHTML = '<div class="text-center p-4 w-100">Loading...</div>';
  const loader = (typeof window.__mrLoadCtryRegion === 'function') ? window.__mrLoadCtryRegion(country) : Promise.resolve(null);
  Promise.resolve(loader).then(function (list) {
   if (selectedIds.length === 0 || selectedIds[0] !== cid) {
    updateUI();
    return;
   }
   regionCountryId = cid;
   regionList = (Array.isArray(list) && list.length) ? list : null;
   regionToken++;
   currentDepth = 1;
   isSearchMode = false;
   const s = document.getElementById(`depthSearch_${modalId}`);
   if (s) s.value = '';
   updateUI();
  });
 }

 function updateBreadcrumb() {
  const bc = document.getElementById(`breadcrumb_${modalId}`);
  if (!bc) return;
  const names = getPathNames();
  let html = '<span data-depth="0">Root</span>';
  names.forEach((name, i) => { const shortName = keepFullNames ? name : name.split(' - ')[0]; html += `<span class="sep">›</span><span data-depth="${i + 1}"${i === names.length - 1 ? ' class="current"' : ''}>${shortName}</span>`; });
  bc.innerHTML = html;
  bc.querySelectorAll('span[data-depth]').forEach(span => { span.addEventListener('click', () => { const d = parseInt(span.dataset.depth); if (d < fixedDepth) return; selectedIds = selectedIds.slice(0, d); currentDepth = d; isSearchMode = false; document.getElementById(`depthSearch_${modalId}`).value = ''; updateUI(); }); });
 }

 function updateDepthInfo() {
  const di = document.getElementById(`depthInfo_${modalId}`);
  if (!di) return;
  if (isSearchMode) {
   di.textContent = 'Search results';
   di.style.background = '#fff3cd'; di.style.color = '#856404';
  }
  else if (currentDepth >= effectiveMaxDepth() - 1) { di.textContent = `Select ${labelForDepth(currentDepth)} (Final Level)`; di.style.background = '#e8f5e9'; di.style.color = '#2e7d32'; }
  else { di.textContent = `Select ${labelForDepth(currentDepth)} → then ${labelForDepth(currentDepth + 1)}`; di.style.background = '#faf4e6'; di.style.color = '#8B1E3F'; }
 }

 function updateSearchPlaceholder() {
  const si = document.getElementById(`depthSearch_${modalId}`);
  if (si) { si.placeholder = '🔍 Search across all levels...'; }
 }

 function updateCountryBanner() {
  const ciEl = document.getElementById(`countryInfo_${modalId}`);
  if (!ciEl) return;
  //only a chosen country gets a banner: while the user browses the country list
  //(before picking one, or after pressing Change) there is nothing to label yet
  const c = (isCtryRoot && selectedIds.length) ? ctryItem(selectedIds[0]) : null;
  if (!c || c.a === undefined || c.a === null || c.a === '') {
   ciEl.style.display = 'none';
   return;
  }
  //canChngeCountry (0 freezes the country) comes from mr.da through regis, unless
  //the caller passed its own country object (the filter's fltr*Cntry)
  const ci = (fullObject && fullObject.ctry) ||
             (typeof window.mrCountryInfoFor === 'function' && window.mrCountryInfoFor(key)) || null;
  //badge = the country's ISO2 when it has one ("#IN"), else the numeric id
  const badge = c.iso2 ? String(c.iso2).toUpperCase() : ((ci && ci.code) || String(c.a));
  const canChange = !!(ci && ci.canChange) && !countryLocked;
  ciEl.style.display = 'flex';
  ciEl.innerHTML = `<i class="fas fa-globe"></i> <span>Country:</span> <span>${c.e || c.n || ('#' + c.a)}</span> <span class="ctry-id">#${badge}</span>` +
   (canChange ? '<button type="button" class="change-country-btn">Change</button>' : '');
  if (canChange) {
   const btn = ciEl.querySelector('.change-country-btn');
   if (btn) btn.addEventListener('click', changeCountry);
  }
 }

 //swap the scoped country: go back to the country list to pick another one
 function changeCountry() {
  if (countryLocked || isLevelLocked(0)) return;
  selectedIds = [];
  currentDepth = 0;
  isSearchMode = false;
  regionCountryId = null;
  regionList = null;
  regionToken++;
  const s = document.getElementById(`depthSearch_${modalId}`);
  if (s) s.value = '';
  const cb = document.getElementById(`clearSearch_${modalId}`);
  if (cb) cb.style.display = 'none';
  updateUI();
 }

 //religion-side twin of updateCountryBanner(): the config default (dfltReligious)
 //labels the same strip with the chosen religion - plus the default caste while it
 //is the one in effect - and a Change button that walks back to the religion list.
 //A pinned level 0 (canChngeReligious 0) renders no Change button, exactly like a
 //pinned country. Returns false when this is not the religion picker, so the caller
 //can keep the country banner for a2/b2/c3.
 function updateReligionBanner() {
  if (!isReligionRoot) return false;
  const el = document.getElementById(`countryInfo_${modalId}`);
  if (!el) return true;
  const rootId = selectedIds.length ? selectedIds[0] : '';
  const rootRow = rootId ? dataArray.find(it => it && String(it.a) === String(rootId)) : null;
  if (!rootRow || rootRow.a === undefined || rootRow.a === null || rootRow.a === '') {
   el.style.display = 'none';
   return true;
  }
  const ri = (fullObject && fullObject.relig) || null;
  const canChange = !isLevelLocked(0) && !(ri && ri.canChange === false);
  const rootFull = rootRow.e || '';
  const rootName = keepFullNames ? rootFull : rootFull.split(' - ')[0];
  let casteSeg = '';
  const cst = (fullObject && fullObject.caste) || null;
  if (cst && selectedIds.length > 1 && String(selectedIds[1]) === String(cst.id)) {
   casteSeg = ` <span class="ctry-id">› ${cst.name || ('#' + cst.id)}</span>`;
  }
  el.style.display = 'flex';
  el.innerHTML = `<i class="fas fa-place-of-worship"></i> <span>Religion:</span> <span>${rootName}</span> <span class="ctry-id">#${rootRow.a}</span>${casteSeg}` +
   (canChange ? '<button type="button" class="change-country-btn">Change</button>' : '');
  if (canChange) {
   const btn = el.querySelector('.change-country-btn');
   if (btn) btn.addEventListener('click', changeReligion);
  }
  return true;
 }

 //swap the configured default religion: back to the religion list (the country
 //banner's changeCountry, minus the country-only region bookkeeping)
 function changeReligion() {
  if (isLevelLocked(0)) return;
  selectedIds = [];
  currentDepth = 0;
  isSearchMode = false;
  const s = document.getElementById(`depthSearch_${modalId}`);
  if (s) s.value = '';
  const cb = document.getElementById(`clearSearch_${modalId}`);
  if (cb) cb.style.display = 'none';
  updateUI();
 }

 function updateUI() {
  updateBreadcrumb(); updateDepthInfo(); updateSearchPlaceholder();
  if (!updateReligionBanner()) updateCountryBanner();
  const backBtn = header.querySelector('.back-btn'); if (backBtn) { backBtn.disabled = currentDepth <= fixedDepth; }
  const selCount = selectedIds.filter(function (v) { return v !== '' && v !== null && v !== undefined; }).length;
  if (footerClearBtn) {
   footerClearBtn.disabled = selCount <= fixedDepth;
  }
  //the partial-selection OK button stays disabled until something is on the path
  if (footerOkBtn) footerOkBtn.disabled = selCount === 0;
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
  const isFinalLevel = currentDepth >= effectiveMaxDepth() - 1;
  //a level frozen by config (dfltReligious / dfltCaste) is read-only once it holds
  //its fixed value; with nothing stored there yet the level stays pickable
  const levelLocked = isLevelLocked(currentDepth) && currentSelId !== null;
  const tok = childKeys[currentDepth];

  let html = `<div class="level-label">${labelForDepth(currentDepth)} (${items.length})</div>`;
  items.forEach(item => {
   const id = String(item.a);
   const fullName = item.e || '';
   const name = keepFullNames ? fullName : fullName.split(' - ')[0];
   const isSelected = currentSelId === id;
   let hasChildren = false;
   if (!isFinalLevel) {
    if (tok === '@ctry') {
     const ctry = item;
     const hasRegNow = (regionCountryId === String(ctry.a) && Array.isArray(regionList)) ||
                       !!(typeof window.__mrCtryRegionList === 'function' && window.__mrCtryRegionList(ctry)) ||
                       (ctry.x && ctry.x.length);
     const hasTbl = !!(typeof window.__mrCtryTbl === 'function' && window.__mrCtryTbl(ctry));
     hasChildren = hasRegNow || hasTbl;
    } else if (tok !== undefined) {
     hasChildren = !!(item[tok] && item[tok].length);
    }
   }
   const rowLocked = levelLocked && !isSelected;
   const icon = rowLocked ? 'fa-lock' : (isFinalLevel ? 'fa-check-circle' : hasChildren ? 'fa-folder-open' : 'fa-map-marker-alt');
   html += `<div class="item-card${isSelected ? ' selected' : ''}${rowLocked ? ' locked' : ''}" data-id="${id}" data-has-children="${hasChildren}" data-is-final="${isFinalLevel}"><i class="fas ${icon}"></i>${name}<span class="item-id">#${id}</span></div>`;
  });
  grid.innerHTML = html;

  grid.querySelectorAll('.item-card').forEach(card => {
   //on a frozen level every row but the fixed one is inert; the fixed row may still
   //descend (a locked caste with sub castes below it remains pickable)
   if (levelLocked && card.dataset.id !== currentSelId) return;
   card.addEventListener('click', () => {
    const id = card.dataset.id;
    const hasChildren = card.dataset.hasChildren === 'true';
    const isFinal = card.dataset.isFinal === 'true';
    selectedIds = selectedIds.slice(0, currentDepth);
    selectedIds.push(id);
    const seg = childKeys[currentDepth];
    if (hasChildren && !isFinal) {
     if (seg === '@ctry') { enterCountry(ctryItem(id)); }
     else { currentDepth++; isSearchMode = false; document.getElementById(`depthSearch_${modalId}`).value = ''; updateUI(); }
    }
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

 header.querySelector('.back-btn').addEventListener('click', () => { if (currentDepth > fixedDepth) { currentDepth--; selectedIds.pop(); isSearchMode = false; if (searchInput) searchInput.value = ''; updateUI(); } });
 header.querySelector('.close-btn').addEventListener('click', () => modalInstance.hide());

 //land on the deepest chosen level, so a filled value reopens on its last level
 //(and not on the empty children below it)
 const deepestCommitted = selectedIds.length > 0 ? Math.min(selectedIds.length - 1, maxDepth - 1) : 0;
 //a frozen prefix opens on its first editable level: a locked religion lands
 //straight on "Caste" (guided text "Select Caste → then Sub caste") instead of the
 //frozen religion list; a deeper stored chain still reopens on its last level
 currentDepth = fixedDepth > 0
  ? Math.max(deepestCommitted, Math.min(fixedDepth, maxDepth - 1))
  : deepestCommitted;
 //a config-default country seeded with nothing stored yet opens on that country's
 //first level (states for India), not on the country list itself
 if (isCtryRoot && deepestCommitted === 0 && selectedIds.length) {
  currentDepth = Math.min(maxDepth - 1, Math.max(1, fixedDepth));
 }
 //the same for the religion tree: a seeded (or stored) religion without a caste
 //below it opens on the caste list, so a default like dfltReligious {a:4} lands
 //straight on "Select Caste". A religion with no castes at all stays on level 0,
 //where picking it still commits it as a leaf
 if (isReligionRoot && deepestCommitted === 0 && selectedIds.length) {
  const rootRowO = dataArray.find(it => it && String(it.a) === String(selectedIds[0]));
  const rootKids = (rootRowO && Array.isArray(rootRowO.x)) ? rootRowO.x.filter(k => k && k.a !== 0) : [];
  if (rootKids.length) currentDepth = Math.min(maxDepth - 1, Math.max(1, fixedDepth));
 }
 //the headline follows the level the religion picker actually opens on (seeded,
 //stored or frozen it never sits on the root list), so the header always matches the
 //guided line and the grid below it - "Select Caste" instead of "Select Religion".
 //Frozen prefixes keep the retitle done above; the cities picker keeps its own title
 if (isReligionRoot && currentDepth > 0 && fixedDepth === 0) {
  const titleElR = header.querySelector('.modal-title');
  if (titleElR) titleElR.textContent = `Select ${labelForDepth(Math.min(currentDepth, effectiveMaxDepth() - 1))}`;
 }

 function finishOpen() {
  //a country-rooted picker always works inside one country (the config default, or
  //the country already stored), so load that country's own "<iso2>tal.da" before the
  //first paint: the level labels, the item grid and the search index all read it
  if (isCtryRoot && typeof window.__mrLoadCtryRegion === 'function' &&
      selectedIds.length > 0 && currentDepth > 0) {
   const c = ctryItem(selectedIds[0]);
   if (c) {
    window.__mrLoadCtryRegion(c).then(function (list) {
     regionCountryId = String(c.a);
     regionList = (Array.isArray(list) && list.length) ? list : null;
     regionToken++;
     updateUI();
    });
    return;
   }
  }
  updateUI();
 }

 setTimeout(finishOpen, 60);

 modalElement.addEventListener('hidden.bs.modal', function onHide() {
  modalElement.removeEventListener('hidden.bs.modal', onHide);
  if (scopedStyles && scopedStyles.parentNode) scopedStyles.parentNode.removeChild(scopedStyles);
  setTimeout(() => { if (modalElement && modalElement.parentNode) modalElement.parentNode.removeChild(modalElement); }, 300);
 });

 modalInstance.show();
}