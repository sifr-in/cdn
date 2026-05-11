// Global function to open common selection modal
async function openCommonSelectionModal(inputId, value, divId, key, fullObject) {
 if (!divId) return;

 const divElement = document.getElementById(divId);
 if (!divElement) return;

 // Hide the input element if it exists
 const inElement = document.getElementById(inputId);
 if (inElement) {
  inElement.style.display = 'none';
 }

 // Get parameters from fullObject
 // Parse e parameter - format: "arrayName,childArrayName,grandchildArrayName,..."
 let arrayName = fullObject.e;
 let childArrayNames = [];

 if (arrayName && arrayName.includes(',')) {
  const parts = arrayName.split(',').map(p => p.trim());
  arrayName = parts[0];
  childArrayNames = parts.slice(1);
 }

 const isMultiSelect = fullObject.f === 2;
 let depthPath = fullObject.g ? String(fullObject.g) : null;
 const callbackFunction = fullObject.h;

 // IMPORTANT: Check if there's an existing modal with the same array
 const modalId = `common_select_modal_${arrayName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

 // Remove any existing modal for this array
 const existingModal = document.querySelector(`.modal[data-array-name="${arrayName}"]`);
 if (existingModal) {
  const existingBsModal = bootstrap.Modal.getInstance(existingModal);
  if (existingBsModal) {
   existingBsModal.hide();
  }
  existingModal.remove();
  removeModalFromStack(existingModal.id);
 }

 // Evaluate depthPath if it looks like a function call
 let evaluatedDepthPath = null;
 let targetDepth = 0;
 let targetIds = [];
 let isValidDepthPath = false;
 let hasDepthPath = false;
 let selectAtDepth0 = false;

 if (depthPath) {
  if (depthPath.includes('(') && depthPath.includes(')')) {
   try {
    const functionMatch = depthPath.match(/^([^(]+)\((.*)\)$/);
    if (functionMatch) {
     const functionName = functionMatch[1].trim();
     const argsString = functionMatch[2].trim();

     const args = [];
     let currentArg = '';
     let inQuotes = false;
     let quoteChar = '';

     for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];
      if ((char === '"' || char === "'") && (i === 0 || argsString[i - 1] !== '\\')) {
       if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
       } else if (char === quoteChar) {
        inQuotes = false;
       } else {
        currentArg += char;
       }
      } else if (char === ',' && !inQuotes) {
       args.push(currentArg.trim());
       currentArg = '';
      } else {
       currentArg += char;
      }
     }
     if (currentArg) args.push(currentArg.trim());

     const cleanArgs = args.map(arg => {
      arg = arg.trim();
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
       return arg.slice(1, -1);
      }
      return arg;
     });

     if (typeof window[functionName] === 'function') {
      evaluatedDepthPath = window[functionName](...cleanArgs);
      console.log(`Evaluated ${functionName}(${cleanArgs.join(', ')}) = ${evaluatedDepthPath}`);
     } else {
      console.error(`Function ${functionName} not found`);
      showToast(`Function ${functionName} not found`, { duration: 3000, position: 'top', type: 'error', dismissible: true });
      return;
     }
    }
   } catch (e) {
    console.error('Error evaluating depth path function:', e);
    showToast(`Error evaluating depth path: ${e.message}`, { duration: 3000, position: 'top', type: 'error', dismissible: true });
    return;
   }
  } else {
   evaluatedDepthPath = depthPath;
  }
 }

 // Parse depth path
 if (evaluatedDepthPath && evaluatedDepthPath.includes('-')) {
  const depthPathParts = evaluatedDepthPath.split('-').map(p => p.trim());
  targetDepth = parseInt(depthPathParts[0]) || 0;
  targetIds = depthPathParts.slice(1).map(id => parseInt(id));
  isValidDepthPath = targetDepth > 0;
  hasDepthPath = true;
  selectAtDepth0 = false;
 } else if (evaluatedDepthPath && !isNaN(parseInt(evaluatedDepthPath))) {
  targetDepth = parseInt(evaluatedDepthPath);
  targetIds = [];
  isValidDepthPath = targetDepth > 0;
  hasDepthPath = true;
  selectAtDepth0 = (targetDepth === 0);
 } else if (evaluatedDepthPath === '0') {
  hasDepthPath = true;
  targetDepth = 0;
  isValidDepthPath = false;
  selectAtDepth0 = true;
 } else {
  selectAtDepth0 = true;
  hasDepthPath = false;
 }

 if (!arrayName) {
  console.error('Array name not provided in fullObject.e');
  return;
 }

 const dataArray = window[arrayName];
 if (!dataArray || !Array.isArray(dataArray)) {
  console.error(`Data array "${arrayName}" not found or not an array`);
  showToast(`Data array "${arrayName}" not found`, { duration: 3000, position: 'top', type: 'error', dismissible: true });
  return;
 }

 function getItemDisplayName(item) {
  return item.e || item.name || 'Unnamed';
 }

 function getItemId(item) {
  return item.a || item.id;
 }

 function escapeHtml(str) {
  if (!str) return '';
  return str
   .replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;');
 }

 // Function to get child array from an item at a specific level
 function getChildArrayAtLevel(item, level) {
  if (level < childArrayNames.length) {
   const childArrayNameAtLevel = childArrayNames[level];
   if (item[childArrayNameAtLevel] && Array.isArray(item[childArrayNameAtLevel])) {
    return item[childArrayNameAtLevel];
   }
  }

  // Fallback: try to find any array property
  const childKeys = Object.keys(item).filter(key =>
   Array.isArray(item[key]) && key !== 'a' && key !== 'e' && key !== 'id' && key !== 'name'
  );
  if (childKeys.length > 0) {
   return item[childKeys[0]];
  }
  return null;
 }

 // Function to get child array (uses current level from navigation stack)
 function getChildArray(item) {
  const currentLevelIndex = currentLevel;
  return getChildArrayAtLevel(item, currentLevelIndex);
 }

 // Validate depth availability
 function validateDepthAvailability() {
  if (!hasDepthPath || targetDepth === 0 || targetIds.length === 0) {
   return true;
  }

  let currentDataLevel = dataArray;
  let currentLevelCount = 0;

  for (let i = 0; i < targetIds.length; i++) {
   const targetId = targetIds[i];
   const foundItem = currentDataLevel.find(item => getItemId(item).toString() === targetId.toString());

   if (!foundItem) {
    showToast(`Cannot find item with ID ${targetId} at depth level ${i}`, { duration: 4000, position: 'top', type: 'error', dismissible: true });
    return false;
   }

   if (i < targetIds.length - 1) {
    let nextLevelArray = getChildArrayAtLevel(foundItem, i);

    if (!nextLevelArray || nextLevelArray.length === 0) {
     showToast(`Cannot reach depth ${targetDepth}: No more levels available at ID ${targetId}`, { duration: 4000, position: 'top', type: 'error', dismissible: true });
     return false;
    }
    currentDataLevel = nextLevelArray;
   }
   currentLevelCount++;
  }

  if (currentLevelCount < targetDepth) {
   showToast(`Cannot reach depth ${targetDepth}: Only ${currentLevelCount} level(s) available`, { duration: 4000, position: 'top', type: 'error', dismissible: true });
   return false;
  }
  return true;
 }

 if (hasDepthPath && targetDepth > 0 && targetIds.length > 0) {
  const isValid = validateDepthAvailability();
  if (!isValid) return;
 }

 // Create modal
 const modalObj = create_modal_dynamically(modalId);
 const modalInstance = modalObj.modalInstance;
 const modalElement = modalObj.modalElement;
 const modalBody = modalObj.contentElement;

 modalElement.setAttribute('data-array-name', arrayName);
 modalElement.setAttribute('data-child-arrays', childArrayNames.join(','));
 modalElement.setAttribute('data-select-mode', selectAtDepth0 ? 'root' : 'depth');
 if (hasDepthPath) modalElement.setAttribute('data-depth-path', evaluatedDepthPath);

 const pageUniqueClass = `common-select-modal-${Date.now()}`;
 modalElement.classList.add(pageUniqueClass);

 // ========== BEAUTIFICATION CSS ==========
 const scopedStyles = document.createElement('style');
 scopedStyles.textContent = `
.${pageUniqueClass} .modal-header {
display: flex !important;
align-items: center !important;
padding: 0.75rem 1rem !important;
border-bottom: 2px solid var(--primary-light, #9C27B0) !important;
background: linear-gradient(135deg, var(--primary-color, #7B1FA2), var(--primary-dark, #4A148C)) !important;
color: white !important;
border-radius: 10px 10px 0 0 !important;
}

.${pageUniqueClass} .modal-header .back-button {
background: rgba(255, 255, 255, 0.2) !important;
border: none !important;
border-radius: 50% !important;
width: 36px !important;
height: 36px !important;
display: flex !important;
align-items: center !important;
justify-content: center !important;
color: white !important;
cursor: pointer !important;
transition: all 0.3s ease !important;
margin-right: 8px !important;
}

.${pageUniqueClass} .modal-header .back-button:hover {
background: rgba(255, 255, 255, 0.3) !important;
transform: scale(1.1) !important;
}

.${pageUniqueClass} .modal-header .modal-title {
flex: 1 !important;
text-align: center !important;
margin: 0 !important;
font-weight: 600 !important;
font-size: 1.1rem !important;
}

.${pageUniqueClass} .modal-header .close-button {
background: rgba(255, 255, 255, 0.2) !important;
border: none !important;
border-radius: 50% !important;
width: 36px !important;
height: 36px !important;
display: flex !important;
align-items: center !important;
justify-content: center !important;
color: white !important;
cursor: pointer !important;
transition: all 0.3s ease !important;
margin-left: 8px !important;
}

.${pageUniqueClass} .modal-header .close-button:hover {
background: rgba(255, 255, 255, 0.3) !important;
transform: scale(1.1) !important;
}

.${pageUniqueClass} .modal-body {
padding: 1.25rem !important;
max-height: 70vh !important;
overflow-y: auto !important;
}

.${pageUniqueClass} .search-container {
margin-bottom: 1.5rem !important;
position: relative !important;
top: 0 !important;
background: inherit !important;
z-index: 10 !important;
padding: 10px 0 !important;
}

.${pageUniqueClass} .search-input {
width: 100% !important;
padding: 0.75rem 1rem !important;
border: 2px solid #e0e0e0 !important;
border-radius: 50px !important;
font-size: 0.95rem !important;
transition: all 0.3s ease !important;
background: white !important;
padding-right: 40px !important;
}

.${pageUniqueClass} .search-input:focus {
border-color: var(--primary-color, #7B1FA2) !important;
box-shadow: 0 0 0 3px rgba(123, 31, 162, 0.1) !important;
outline: none !important;
}

.${pageUniqueClass} .clear-search-btn {
position: absolute !important;
right: 15px !important;
top: 50% !important;
transform: translateY(-50%) !important;
padding: 0 !important;
display: none !important;
z-index: 11 !important;
background: transparent !important;
border: none !important;
cursor: pointer !important;
}

.${pageUniqueClass} .clear-search-btn i {
font-size: 1.2rem !important;
color: #6c757d !important;
}

.${pageUniqueClass} .clear-search-btn:hover i {
color: var(--primary-color, #7B1FA2) !important;
}

.${pageUniqueClass} .search-context {
font-size: 0.7rem !important;
color: #6c757d !important;
margin-top: 4px !important;
margin-left: 12px !important;
}

.${pageUniqueClass} .search-info {
font-size: 0.8rem !important;
color: var(--primary-color, #7B1FA2) !important;
margin-bottom: 8px !important;
padding: 4px 8px !important;
background: rgba(123, 31, 162, 0.1) !important;
border-radius: 20px !important;
display: inline-block !important;
}

.${pageUniqueClass} .selected-label {
background: linear-gradient(135deg, #f3e5f5, #e1bee7) !important;
padding: 1rem !important;
border-radius: 10px !important;
margin-bottom: 1.5rem !important;
border-left: 4px solid var(--primary-color, #7B1FA2) !important;
}

.${pageUniqueClass} .selected-label .selected-text {
margin: 0 !important;
color: var(--text-primary, #212121) !important;
font-size: 1rem !important;
}

.${pageUniqueClass} .selected-label .selected-text strong {
color: var(--primary-dark, #4A148C) !important;
}

.${pageUniqueClass} .items-container {
display: grid !important;
grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
gap: 8px !important;
margin-bottom: 1rem !important;
}

.${pageUniqueClass} .select-item {
background: white !important;
border: 1px solid #e0e0e0 !important;
border-radius: 8px !important;
padding: 0.5rem 1rem !important;
cursor: pointer !important;
transition: all 0.3s ease !important;
font-size: 0.9rem !important;
display: flex !important;
align-items: center !important;
gap: 6px !important;
}

.${pageUniqueClass} .select-item:hover {
background: linear-gradient(135deg, #f3e5f5, #e1bee7) !important;
border-color: var(--primary-color, #7B1FA2) !important;
transform: translateY(-2px) !important;
box-shadow: 0 4px 8px rgba(123, 31, 162, 0.15) !important;
}

.${pageUniqueClass} .select-item.selected {
background: linear-gradient(135deg, var(--primary-color, #7B1FA2), var(--primary-dark, #4A148C)) !important;
color: white !important;
border-color: var(--primary-dark, #4A148C) !important;
}

.${pageUniqueClass} .select-item.selected i {
color: white !important;
}

.${pageUniqueClass} .select-item i {
color: var(--primary-color, #7B1FA2) !important;
font-size: 0.9rem !important;
}

.${pageUniqueClass} .select-item .item-id {
font-size: 0.7rem !important;
opacity: 0.7 !important;
margin-left: auto !important;
}

.${pageUniqueClass} .breadcrumb-nav {
background: #f8f9fa !important;
padding: 0.5rem 1rem !important;
border-radius: 8px !important;
margin-bottom: 1rem !important;
display: flex !important;
align-items: center !important;
gap: 8px !important;
flex-wrap: wrap !important;
}

.${pageUniqueClass} .breadcrumb-nav .breadcrumb-item {
color: var(--primary-color, #7B1FA2) !important;
cursor: pointer !important;
font-weight: 500 !important;
}

.${pageUniqueClass} .breadcrumb-nav .breadcrumb-item:hover {
text-decoration: underline !important;
}

.${pageUniqueClass} .breadcrumb-nav .separator {
color: #6c757d !important;
}

.${pageUniqueClass} .no-results {
text-align: center !important;
padding: 2rem !important;
color: var(--text-secondary, #757575) !important;
font-style: italic !important;
}

.${pageUniqueClass} .depth-indicator {
background: var(--primary-light, #9C27B0) !important;
color: white !important;
padding: 4px 12px !important;
border-radius: 20px !important;
font-size: 0.75rem !important;
margin-left: 8px !important;
}

.${pageUniqueClass} .warning-badge {
background: #ff9800 !important;
color: white !important;
padding: 4px 12px !important;
border-radius: 20px !important;
font-size: 0.75rem !important;
margin-left: 8px !important;
}

.${pageUniqueClass} .error-badge {
background: #dc3545 !important;
color: white !important;
padding: 4px 12px !important;
border-radius: 20px !important;
font-size: 0.75rem !important;
margin-left: 8px !important;
}

@media (prefers-color-scheme: dark) {
.${pageUniqueClass} .modal-content {
background-color: #2d2d2d !important;
color: white !important;
}
.${pageUniqueClass} .search-input {
background-color: #3d3d3d !important;
border-color: #444 !important;
color: white !important;
}
.${pageUniqueClass} .search-input::placeholder {
color: #aaa !important;
}
.${pageUniqueClass} .select-item {
background-color: #3d3d3d !important;
border-color: #444 !important;
color: white !important;
}
.${pageUniqueClass} .selected-label {
background: linear-gradient(135deg, #2d2d2d, #3d3d3d) !important;
}
.${pageUniqueClass} .breadcrumb-nav {
background: #3d3d3d !important;
}
.${pageUniqueClass} .search-context {
color: #aaa !important;
}
}
    `;
 document.head.appendChild(scopedStyles);

 // Create header
 const modalDialog = modalElement.querySelector('.modal-dialog');
 modalDialog.classList.add('modal-lg');

 const modalContent = modalElement.querySelector('.modal-content');
 modalContent.innerHTML = '';

 const header = document.createElement('div');
 header.className = 'modal-header';
 header.innerHTML = `
        <button class="back-button" type="button" aria-label="Back"><i class="fas fa-arrow-left"></i></button>
        <h5 class="modal-title">Select ${arrayName.replace(/_/g, ' ')}</h5>
        <button class="close-button" type="button" aria-label="Close"><i class="fas fa-times"></i></button>
    `;

 const body = document.createElement('div');
 body.className = 'modal-body';
 body.innerHTML = `
        <div class="search-container">
            <input type="text" class="search-input" placeholder="🔍 Search at current level..." id="commonSelectSearch_${modalId}">
        </div>
        <div id="breadcrumbNav_${modalId}" class="breadcrumb-nav" style="display: none;"></div>
        <div class="selected-label" id="selectedLabel_${modalId}" style="display: none;">
            <p class="selected-text"><strong>Selected:</strong> <span id="selectedItemText_${modalId}"></span> (ID: <span id="selectedItemId_${modalId}"></span>)</p>
        </div>
        <div id="itemsListContainer_${modalId}"><div class="text-center p-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading data...</p></div></div>
    `;

 modalContent.appendChild(header);
 modalContent.appendChild(body);

 // Navigation state
 let navigationStack = [];
 let currentLevel = 0;
 let currentData = dataArray;
 let currentParent = null;
 let currentParentChain = [];
 let depthReached = false;
 let depthError = false;

 function getCurrentValue() {
  const currentInput = document.getElementById(inputId);
  return currentInput && currentInput.value ? currentInput.value : value;
 }

 function updateSelectedDisplay() {
  const currentValue = getCurrentValue();
  const selectedLabel = document.getElementById(`selectedLabel_${modalId}`);
  const selectedItemText = document.getElementById(`selectedItemText_${modalId}`);
  const selectedItemId = document.getElementById(`selectedItemId_${modalId}`);

  if (currentValue && currentValue !== '') {
   const ids = currentValue.split(',').map(v => v.trim());
   selectedItemText.textContent = `${ids.length} item(s) selected`;
   selectedItemId.textContent = ids.join(', ');
   selectedLabel.style.display = 'block';
  } else {
   selectedLabel.style.display = 'none';
  }
 }

 function updateBreadcrumb() {
  const breadcrumbDiv = document.getElementById(`breadcrumbNav_${modalId}`);
  if (!breadcrumbDiv) return;

  if (currentParentChain.length === 0 && currentLevel === 0) {
   breadcrumbDiv.style.display = 'none';
   return;
  }

  breadcrumbDiv.style.display = 'flex';
  let breadcrumbHtml = '<span class="breadcrumb-item" data-level="root">Root</span>';

  currentParentChain.forEach((parent, index) => {
   breadcrumbHtml += `<span class="separator">›</span>`;
   breadcrumbHtml += `<span class="breadcrumb-item" data-level="${index + 1}">${escapeHtml(getItemDisplayName(parent))}</span>`;
  });

  if (currentParent && currentParentChain[currentParentChain.length - 1] !== currentParent) {
   breadcrumbHtml += `<span class="separator">›</span>`;
   breadcrumbHtml += `<span class="breadcrumb-item active">${escapeHtml(getItemDisplayName(currentParent))}</span>`;
  }

  if (selectAtDepth0) {
   breadcrumbHtml += `<span class="depth-indicator">Select at Root Level</span>`;
  } else if (hasDepthPath && targetDepth > 0) {
   if (depthError) {
    breadcrumbHtml += `<span class="error-badge">❌ Depth ${targetDepth} Not Available</span>`;
   } else if (depthReached) {
    breadcrumbHtml += `<span class="depth-indicator">✓ At Depth ${currentLevel}</span>`;
   } else {
    breadcrumbHtml += `<span class="depth-indicator">Target Depth: ${targetDepth}</span>`;
   }
  }

  breadcrumbDiv.innerHTML = breadcrumbHtml;

  breadcrumbDiv.querySelectorAll('.breadcrumb-item[data-level]').forEach((item) => {
   const level = item.dataset.level;
   if (!item.classList.contains('active')) {
    item.addEventListener('click', (e) => {
     e.stopPropagation();
     if (level === 'root') {
      while (navigationStack.length > 0) {
       const prev = navigationStack.pop();
       currentLevel = prev.level;
       currentData = prev.data;
       currentParent = prev.parent;
       currentParentChain = prev.parentChain || [];
      }
      currentLevel = 0;
      currentData = dataArray;
      currentParent = null;
      currentParentChain = [];
      // Clear search when navigating
      const searchInput = document.getElementById(`commonSelectSearch_${modalId}`);
      if (searchInput) searchInput.value = '';
      renderItems('', true);
     } else {
      const targetLevel = parseInt(level);
      while (navigationStack.length > targetLevel) {
       const prev = navigationStack.pop();
       currentLevel = prev.level;
       currentData = prev.data;
       currentParent = prev.parent;
       currentParentChain = prev.parentChain || [];
      }
      // Clear search when navigating
      const searchInput = document.getElementById(`commonSelectSearch_${modalId}`);
      if (searchInput) searchInput.value = '';
      renderItems('', true);
     }
    });
   }
  });
 }

 function selectItem(item) {
  const itemId = getItemId(item);
  const itemName = getItemDisplayName(item);

  const parentId = currentParent ? getItemId(currentParent) : null;
  const parentName = currentParent ? getItemDisplayName(currentParent) : null;

  const allPathIds = [];
  if (parentId) {
   allPathIds.push(parentId);
  }
  allPathIds.push(itemId);

  const depthPathForSet = `${allPathIds.length}-${allPathIds.join('-')}`;

  const currentChildArrayName = currentLevel < childArrayNames.length ? childArrayNames[currentLevel] : null;

  if (isMultiSelect) {
   const currentValue = getCurrentValue();
   const currentIds = currentValue ? String(currentValue).split(',').map(v => v.trim()).filter(v => v !== '') : [];

   if (currentIds.includes(String(itemId))) {
    const newValue = currentIds.filter(id => id !== String(itemId)).join(',');
    setValByProprtyToElm(inputId, newValue, divId, key, {
     c: arrayName,
     f: currentChildArrayName,
     e: parentId,
     g: depthPathForSet
    });
   } else {
    currentIds.push(String(itemId));
    const newValue = currentIds.join(',');
    setValByProprtyToElm(inputId, newValue, divId, key, {
     c: arrayName,
     f: currentChildArrayName,
     e: parentId,
     g: depthPathForSet
    });
   }
   updateSelectedDisplay();
   const currentSearch = document.getElementById(`commonSelectSearch_${modalId}`).value.trim();
   renderItems(currentSearch, true);
  } else {
   const selectedObject = {
    id: itemId,
    name: itemName,
    fullName: parentName ? `${parentName} > ${itemName}` : itemName,
    level: currentLevel + 1,
    parent: currentParent,
    parentChain: currentParentChain,
    fullObject: item,
    depth: currentLevel + 1,
    depthPath: depthPathForSet,
    inputId: inputId,
    value: value,
    divId: divId,
    key: key,
    originalFullObject: fullObject
   };

   setValByProprtyToElm(inputId, String(itemId), divId, key, {
    c: arrayName,
    f: currentChildArrayName,
    e: parentId,
    g: depthPathForSet
   });

   if (callbackFunction && typeof window[callbackFunction] === 'function') {
    window[callbackFunction](selectedObject, inputId, divId, key, fullObject);
   }

   modalInstance.hide();
  }
 }

 function navigateToChild(item) {
  if (selectAtDepth0) {
   selectItem(item);
   return;
  }

  if (targetDepth > 0 && currentLevel + 1 > targetDepth) {
   showToast(`Cannot go beyond depth ${targetDepth}`, { duration: 2000, position: 'top', type: 'warning', dismissible: true });
   return;
  }

  let childArray = getChildArray(item);

  if (childArray && childArray.length > 0) {
   navigationStack.push({
    level: currentLevel,
    data: currentData,
    parent: currentParent,
    parentChain: [...currentParentChain]
   });

   currentLevel++;
   currentData = childArray;
   currentParent = item;
   currentParentChain.push(item);

   // Clear search when navigating to children
   const searchInput = document.getElementById(`commonSelectSearch_${modalId}`);
   if (searchInput) searchInput.value = '';

   renderItems('', true);
  } else {
   selectItem(item);
  }
 }

 async function navigateToTargetDepth() {
  if (!hasDepthPath || targetDepth === 0 || targetIds.length === 0) return;

  let currentDataLevel = dataArray;
  let foundPath = [];

  for (let i = 0; i < targetIds.length; i++) {
   const targetId = targetIds[i];
   const foundItem = currentDataLevel.find(item => getItemId(item).toString() === targetId.toString());

   if (!foundItem) {
    showToast(`Cannot find item with ID ${targetId}`, { duration: 4000, position: 'top', type: 'error', dismissible: true });
    modalInstance.hide();
    return;
   }

   foundPath.push(foundItem);

   if (i < targetIds.length - 1) {
    let nextLevelArray = getChildArrayAtLevel(foundItem, i);

    if (!nextLevelArray || nextLevelArray.length === 0) {
     showToast(`Cannot reach depth ${targetDepth}: No more levels`, { duration: 4000, position: 'top', type: 'error', dismissible: true });
     modalInstance.hide();
     return;
    }
    currentDataLevel = nextLevelArray;
   }
  }

  if (foundPath.length > 0) {
   navigationStack = [];
   currentParentChain = [];

   for (let i = 0; i < foundPath.length - 1; i++) {
    const item = foundPath[i];
    currentParentChain.push(item);

    let childArray = getChildArrayAtLevel(item, i);

    navigationStack.push({
     level: i,
     data: i === 0 ? dataArray : childArray,
     parent: i === 0 ? null : foundPath[i - 1],
     parentChain: [...currentParentChain.slice(0, -1)]
    });
   }

   currentLevel = foundPath.length;
   const lastItem = foundPath[foundPath.length - 1];

   currentParent = lastItem;

   if (targetDepth === targetIds.length) {
    currentParent = lastItem;
    currentParentChain.push(lastItem);

    let childrenArray = getChildArrayAtLevel(lastItem, foundPath.length - 1);

    if (childrenArray && childrenArray.length > 0) {
     currentData = childrenArray;
    } else {
     currentData = [lastItem];
    }
   } else {
    currentData = [lastItem];
    currentParent = foundPath.length > 1 ? foundPath[foundPath.length - 2] : null;
   }

   depthReached = true;
   renderItems('', true);
  }
 }

 function renderItems(searchTerm = '', preserveNavigation = false) {
  const container = document.getElementById(`itemsListContainer_${modalId}`);
  const searchInput = document.getElementById(`commonSelectSearch_${modalId}`);

  if (!preserveNavigation) {
   navigationStack = [];
   currentLevel = 0;
   currentData = dataArray;
   currentParent = null;
   currentParentChain = [];
   depthReached = false;
   depthError = false;
   if (searchInput && !searchTerm) {
    searchInput.value = '';
   }
  }

  updateBreadcrumb();

  let filteredData = currentData;
  let hasSearchResults = true;

  if (searchTerm && searchTerm.trim() !== '') {
   const term = searchTerm.toLowerCase().trim();
   filteredData = currentData.filter(item => {
    if (item.a === 0) return false;
    const displayName = getItemDisplayName(item);
    return displayName && displayName.toLowerCase().includes(term);
   });

   hasSearchResults = filteredData.length > 0;

   if (!hasSearchResults) {
    container.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search fa-2x mb-3"></i>
                        <p>No items found matching "${escapeHtml(searchTerm)}" at current level</p>
                        <button class="btn btn-sm btn-outline-primary mt-2 clear-search-btn-no-results" style="border-radius: 20px;">
                            <i class="fas fa-times me-1"></i> Clear Search
                        </button>
                    </div>
                `;

    const clearBtn = container.querySelector('.clear-search-btn-no-results');
    if (clearBtn) {
     clearBtn.addEventListener('click', () => {
      if (searchInput) {
       searchInput.value = '';
       renderItems('', preserveNavigation);
      }
     });
    }
    return;
   }
  } else {
   filteredData = currentData.filter(item => item.a !== 0);
  }

  if (!filteredData || filteredData.length === 0) {
   container.innerHTML = `<div class="no-results"><i class="fas fa-info-circle fa-2x mb-3"></i><p>No items available at this level</p></div>`;
   return;
  }

  const currentValue = getCurrentValue();
  const currentValueArray = currentValue ? String(currentValue).split(',').map(v => v.trim()) : [];

  let searchInfoHtml = '';
  if (searchTerm && searchTerm.trim() !== '') {
   searchInfoHtml = `
                <div class="search-info">
                    <i class="fas fa-search me-1"></i> Found ${filteredData.length} result(s) for "${escapeHtml(searchTerm)}"
                </div>
            `;
  }

  let html = searchInfoHtml + '<div class="items-container">';

  filteredData.forEach(item => {
   const itemId = getItemId(item);
   const itemName = getItemDisplayName(item);
   const isSelected = currentValueArray.includes(String(itemId));

   let hasChildren = false;
   const nextLevelIndex = currentLevel;
   if (nextLevelIndex < childArrayNames.length) {
    const childArrayNameAtLevel = childArrayNames[nextLevelIndex];
    if (childArrayNameAtLevel && item[childArrayNameAtLevel] && Array.isArray(item[childArrayNameAtLevel])) {
     hasChildren = item[childArrayNameAtLevel].length > 0;
    }
   }
   if (!hasChildren) {
    const childKeys = Object.keys(item).filter(key =>
     Array.isArray(item[key]) && key !== 'a' && key !== 'e' && key !== 'id' && key !== 'name'
    );
    hasChildren = childKeys.length > 0;
   }

   let shouldShowAsFolder = false;
   if (!selectAtDepth0 && hasDepthPath && targetDepth > 0) {
    const canGoDeeper = currentLevel < targetDepth;
    shouldShowAsFolder = hasChildren && canGoDeeper;
   } else if (!selectAtDepth0 && !hasDepthPath && hasChildren) {
    shouldShowAsFolder = true;
   }

   html += `
                <div class="select-item ${isSelected ? 'selected' : ''}" 
                     data-item-id="${itemId}" 
                     data-item-name="${escapeHtml(itemName)}" 
                     data-has-children="${shouldShowAsFolder}">
                    <i class="fas ${shouldShowAsFolder ? 'fa-folder-open' : 'fa-tag'}"></i>
                    <span class="item-name">${escapeHtml(itemName)}</span>
                    <span class="item-id">#${itemId}</span>
                    ${shouldShowAsFolder ? '<i class="fas fa-chevron-right" style="margin-left: auto;"></i>' : ''}
                </div>
            `;
  });

  html += '</div>';
  container.innerHTML = html;

  document.querySelectorAll(`.${pageUniqueClass} .select-item`).forEach(itemEl => {
   itemEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const itemId = itemEl.dataset.itemId;
    const hasChildren = itemEl.dataset.hasChildren === 'true';
    const actualItem = filteredData.find(i => getItemId(i).toString() === itemId.toString());

    if (hasChildren && !selectAtDepth0) {
     if (searchInput) searchInput.value = '';
     navigateToChild(actualItem);
    } else {
     selectItem(actualItem);
    }
   });
  });
 }

 setTimeout(() => {
  header.querySelector('.back-button').addEventListener('click', () => {
   if (navigationStack.length > 0) {
    const prev = navigationStack.pop();
    currentLevel = prev.level;
    currentData = prev.data;
    currentParent = prev.parent;
    currentParentChain = prev.parentChain || [];
    // Clear search when going back
    const searchInput = document.getElementById(`commonSelectSearch_${modalId}`);
    if (searchInput) searchInput.value = '';
    renderItems('', true);
   } else if (currentLevel > 0) {
    navigationStack = [];
    currentLevel = 0;
    currentData = dataArray;
    currentParent = null;
    currentParentChain = [];
    const searchInput = document.getElementById(`commonSelectSearch_${modalId}`);
    if (searchInput) searchInput.value = '';
    renderItems('', true);
   } else {
    modalInstance.hide();
   }
  });

  header.querySelector('.close-button').addEventListener('click', () => modalInstance.hide());

  // ========== SEARCH INPUT HANDLER ==========
  const searchInput = document.getElementById(`commonSelectSearch_${modalId}`);
  let searchTimeout;

  // Add search context indicator
  const searchContainer = document.querySelector(`.${pageUniqueClass} .search-container`);
  if (searchContainer && !searchContainer.querySelector('.search-context')) {
   const contextIndicator = document.createElement('div');
   contextIndicator.className = 'search-context';
   contextIndicator.innerHTML = '<i class="fas fa-info-circle me-1"></i> Searching only at current level';
   searchContainer.appendChild(contextIndicator);
  }

  // Add clear search button inside input
  const clearSearchBtn = document.createElement('button');
  clearSearchBtn.className = 'clear-search-btn';
  clearSearchBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
  clearSearchBtn.onclick = () => {
   searchInput.value = '';
   renderItems('', true);
   clearSearchBtn.style.display = 'none';
  };
  searchInput.parentNode.appendChild(clearSearchBtn);

  // Search input event
  searchInput.addEventListener('input', (e) => {
   clearTimeout(searchTimeout);
   const searchTerm = e.target.value;

   clearSearchBtn.style.display = searchTerm ? 'block' : 'none';

   const container = document.getElementById(`itemsListContainer_${modalId}`);
   if (searchTerm && searchTerm.trim() !== '') {
    container.innerHTML = `
                    <div class="text-center p-4">
                        <div class="spinner-border spinner-border-sm text-primary" role="status">
                            <span class="visually-hidden">Searching...</span>
                        </div>
                        <p class="mt-2">Searching at current level...</p>
                    </div>
                `;
   }

   searchTimeout = setTimeout(() => {
    renderItems(searchTerm, true);
   }, 300);
  });
  // ========== END SEARCH INPUT HANDLER ==========

  renderItems('');

  if (hasDepthPath && targetDepth > 0 && targetIds.length > 0) {
   setTimeout(() => navigateToTargetDepth(), 100);
  }

  if (isMultiSelect) updateSelectedDisplay();

  modalElement.addEventListener('hidden.bs.modal', function onHide() {
   modalElement.removeEventListener('hidden.bs.modal', onHide);
   if (scopedStyles && scopedStyles.parentNode) scopedStyles.parentNode.removeChild(scopedStyles);
   setTimeout(() => { if (modalElement && modalElement.parentNode) modalElement.parentNode.removeChild(modalElement); }, 300);
  });
 }, 100);

 modalInstance.show();
}
function setValByProprtyToElm(inputId, value, divId, key, fullObject) {
 if (!divId) return;

 const divElement = document.getElementById(divId);
 if (!divElement) return;

 // Store canAdd value and ORIGINAL depth path on the div element (only on first load)
 if (fullObject.canAdd !== undefined && !divElement.hasAttribute('data-initialized')) {
  divElement.setAttribute('data-can-add', fullObject.canAdd);
  divElement.setAttribute('data-selection-array', fullObject.c || '');
  // Store the ORIGINAL depth path (from fullObject.g) - never update this
  if (fullObject.g) {
   divElement.setAttribute('data-original-depth-path', fullObject.g);
  }
  divElement.setAttribute('data-selection-callback', fullObject.h || '');
  divElement.setAttribute('data-initialized', 'true');
 }

 // Get stored values
 const storedCanAdd = divElement.getAttribute('data-can-add');
 const storedOriginalDepthPath = divElement.getAttribute('data-original-depth-path');
 const canAddValue = (fullObject.canAdd !== undefined) ? fullObject.canAdd : (storedCanAdd ? parseInt(storedCanAdd) : 0);

 // DON'T hide the input element - keep it visible with the value
 const inElement = document.getElementById(inputId);
 if (inElement) {
  // Set the input value
  inElement.value = value !== null && value !== undefined ? value : '';
  inElement.style.display = 'none';
 }

 // Clear previous content
 divElement.innerHTML = '';

 // Convert value to string for checking
 const valueStr = value !== null && value !== undefined ? String(value) : '';

 // Check if value is valid
 if (valueStr === '') {
  divElement.innerHTML = '<p class="text-muted">Not specified</p>';
  // Still show edit button even when no value
  if (canAddValue > 0) {
   addEditButton(divElement, inputId, value, divId, key, fullObject, canAddValue);
  }
  return;
 }

 // Split comma-separated values (for multi-select)
 const valueArray = valueStr.split(',').map(v => v.trim()).filter(v => v !== '');

 // Parse c parameter - format: "arrayName,childArrayName,grandchildArrayName,..."
 let arrayName = fullObject.c;
 let childArrayNames = [];

 if (arrayName && arrayName.includes(',')) {
  const parts = arrayName.split(',').map(p => p.trim());
  arrayName = parts[0];
  childArrayNames = parts.slice(1);
 }

 // Get parent IDs from e parameter - format: "id1,id2,id3,..."
 let parentIds = [];
 if (fullObject.e) {
  parentIds = String(fullObject.e).split(',').map(id => id.trim()).filter(id => id !== '');
 }

 // Get depth path from g parameter
 let depthPathIds = [];
 let hasDepthPath = false;
 if (fullObject.g) {
  const depthPath = String(fullObject.g);
  if (depthPath.includes('-')) {
   const parts = depthPath.split('-').map(p => p.trim());
   depthPathIds = parts.slice(1).map(id => parseInt(id));
   hasDepthPath = depthPathIds.length > 0;
  }
 }

 if (!arrayName) {
  divElement.innerHTML = '<p class="text-danger">Configuration error: array name missing</p>';
  if (canAddValue > 0) {
   addEditButton(divElement, inputId, value, divId, key, fullObject, canAddValue);
  }
  return;
 }

 // Get the array from window object
 const dataArray = window[arrayName];
 if (!dataArray || !Array.isArray(dataArray)) {
  divElement.innerHTML = '<p class="text-danger">Data not available</p>';
  if (canAddValue > 0) {
   addEditButton(divElement, inputId, value, divId, key, fullObject, canAddValue);
  }
  return;
 }

 // Helper function to get child array at specific level
 function getChildArrayAtLevel(item, level) {
  if (level < childArrayNames.length) {
   const childArrayNameAtLevel = childArrayNames[level];
   if (item[childArrayNameAtLevel] && Array.isArray(item[childArrayNameAtLevel])) {
    return item[childArrayNameAtLevel];
   }
  }
  const childKeys = Object.keys(item).filter(key =>
   Array.isArray(item[key]) && key !== 'a' && key !== 'e' && key !== 'id' && key !== 'name'
  );
  if (childKeys.length > 0) {
   return item[childKeys[0]];
  }
  return null;
 }

 // Helper function to find item by traversing through levels
 function findItemByPath(pathIds, startData = dataArray) {
  let currentData = startData;
  let foundItem = null;
  let pathNames = [];

  for (let i = 0; i < pathIds.length; i++) {
   const targetId = pathIds[i];
   const found = currentData.find(item => item.a.toString() === targetId.toString());

   if (found) {
    pathNames.push(found.e || found.name || 'Unnamed');
    foundItem = found;

    if (i < pathIds.length - 1) {
     const nextLevelArray = getChildArrayAtLevel(found, i);
     if (nextLevelArray && nextLevelArray.length > 0) {
      currentData = nextLevelArray;
     } else {
      break;
     }
    }
   } else {
    break;
   }
  }

  return { foundItem, pathNames, currentData };
 }

 // Create main container for tags and edit button
 const mainContainer = document.createElement('div');
 mainContainer.style.cssText = 'display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px;';

 // Create container for tags
 const tagsContainer = document.createElement('div');
 tagsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px;';

 // Process each value
 valueArray.forEach(singleValue => {
  let matchedLabel = null;
  let fullPathName = null;

  // Method 1: Try depth path navigation (from g parameter)
  if (hasDepthPath && depthPathIds.length > 0) {
   const { foundItem, pathNames, currentData } = findItemByPath(depthPathIds);

   if (foundItem) {
    if (String(foundItem.a || foundItem.id) === singleValue) {
     matchedLabel = foundItem.e || foundItem.name || 'Unnamed';
     fullPathName = pathNames.join(' > ');
    } else if (currentData && currentData !== dataArray) {
     const directItem = currentData.find(item => item.a.toString() === singleValue.toString());
     if (directItem && directItem.e) {
      matchedLabel = directItem.e;
      fullPathName = [...pathNames, matchedLabel].join(' > ');
     }
    }
   }
  }

  // Method 2: Try parent ID navigation (from e parameter with child array names)
  if (!matchedLabel && parentIds.length > 0 && childArrayNames.length > 0) {
   let currentData = dataArray;
   let pathNames = [];
   let lastValidItem = null;

   for (let i = 0; i < parentIds.length; i++) {
    const parentId = parentIds[i];
    const parentItem = currentData.find(item => item.a.toString() === parentId.toString());

    if (parentItem) {
     pathNames.push(parentItem.e || parentItem.name || 'Unnamed');
     lastValidItem = parentItem;

     if (i < parentIds.length) {
      const nextLevelArray = getChildArrayAtLevel(parentItem, i);
      if (nextLevelArray && nextLevelArray.length > 0) {
       currentData = nextLevelArray;
      } else {
       break;
      }
     }
    } else {
     break;
    }
   }

   if (currentData && currentData !== dataArray) {
    const foundItem = currentData.find(item => item.a.toString() === singleValue.toString());
    if (foundItem && foundItem.e) {
     matchedLabel = foundItem.e;
     fullPathName = [...pathNames, matchedLabel].join(' > ');
    }
   }
  }

  // Method 3: Direct search in the array (for root level items)
  if (!matchedLabel) {
   const directItem = dataArray.find(item => item.a.toString() === singleValue.toString());
   if (directItem && directItem.e) {
    matchedLabel = directItem.e;
    fullPathName = matchedLabel;
   }
  }

  // If still not found, use the value itself as label
  if (!matchedLabel) {
   matchedLabel = singleValue;
   fullPathName = singleValue;
  }

  // Create individual tag element
  const tagElement = document.createElement('span');
  tagElement.className = 'badge mra_-relation-badge';
  tagElement.style.cssText = 'display: inline-block; background: linear-gradient(135deg, var(--primary-color, #7B1FA2), var(--primary-dark, #4A148C)); color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.875rem; font-weight: 500; transition: all 0.2s ease; white-space: nowrap;';
  tagElement.textContent = matchedLabel;

  if (fullPathName && fullPathName !== matchedLabel) {
   tagElement.title = fullPathName;
  }

  tagsContainer.appendChild(tagElement);
 });

 mainContainer.appendChild(tagsContainer);

 // Add edit button if needed
 if (canAddValue > 0) {
  addEditButton(mainContainer, inputId, value, divId, key, fullObject, canAddValue);
 }

 divElement.appendChild(mainContainer);
}

// Helper function to add edit button
function addEditButton(container, inputId, value, divId, key, fullObject, canAddValue) {
 const editButtonContainer = document.createElement('div');
 editButtonContainer.style.cssText = 'display: inline-flex; margin-left: auto;';

 const editBtn = document.createElement('button');
 editBtn.innerHTML = '<i class="fas fa-edit"></i>';
 editBtn.style.cssText = 'background: linear-gradient(135deg, #FF9800, #F57C00); color: white; border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 14px; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center;';
 editBtn.title = 'Edit selection';

 editBtn.onmouseover = () => {
  editBtn.style.transform = 'scale(1.1)';
  editBtn.style.boxShadow = '0 2px 8px rgba(255,152,0,0.4)';
 };
 editBtn.onmouseout = () => {
  editBtn.style.transform = 'scale(1)';
  editBtn.style.boxShadow = 'none';
 };

 // Get stored parameters from div attributes
 const divEl = document.getElementById(divId);
 const selectionArrayName = divEl?.getAttribute('data-selection-array') || fullObject.c || '';
 // Use the ORIGINAL depth path, not the current one
 const selectionDepthPath = divEl?.getAttribute('data-original-depth-path') || null;
 const selectionCallback = divEl?.getAttribute('data-selection-callback') || fullObject.h || null;

 editBtn.onclick = (e) => {
  e.stopPropagation();
  e.preventDefault();

  if (typeof window.openCommonSelectionModal === 'function') {
   window.openCommonSelectionModal(
    inputId,
    value,
    divId,
    key,
    {
     e: selectionArrayName,
     g: selectionDepthPath,  // Uses ORIGINAL depth path, not the updated one
     h: selectionCallback,
     f: canAddValue === 1 ? 1 : (canAddValue > 1 ? 2 : 0)
    }
   );
  } else {
   console.warn('openCommonSelectionModal function not found');
  }
 };

 editButtonContainer.appendChild(editBtn);
 container.appendChild(editButtonContainer);
}