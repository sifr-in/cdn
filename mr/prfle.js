// mra_.js - Modal Record Access utility
(function () {
 // Store modal instance globally
 let mraModalInstance = null;
 let mraModalElement = null;
 let mraContentDiv = null;

 // Main function
 window.mr_e__main = function (...arg) {
  const prfix = arg[0];
  if (!prfix) {
   console.error('mr_e__main: prefix is required as first argument');
   return;
  }

  // Check if modal exists, if not create it
  const modalId = 'mra_';
  let modal = document.getElementById(modalId);

  if (!modal) {
   // Create modal dynamically
   const modalObj = create_modal_dynamically(modalId);
   mraModalInstance = modalObj.modalInstance;
   mraModalInstance._config.backdrop = 'static';//to avoid closing modal on clicking outside;
   mraModalElement = modalObj.modalElement;
   mraContentDiv = modalObj.contentElement;

   // Set modal ID for content div
   mraContentDiv.id = 'mr_e__content_div';

   // Build modal header structure
   buildModalHeader(prfix, arg[6]);

   // Add content area
   const contentArea = document.createElement('div');
   contentArea.id = 'mr_e__content_area';
   contentArea.className = 'mr_e__content-area';
   contentArea.style.cssText = 'padding: 1rem; overflow-y: auto; flex: 1;';
   mraContentDiv.appendChild(contentArea);

   // Add footer area for buttons (always visible)
   const footerArea = document.createElement('div');
   footerArea.id = 'mr_e__footer_area';
   footerArea.className = 'mr_e__footer-area';
   footerArea.style.cssText = 'padding: 1rem; border-top: 1px solid #dee2e6; display: flex; justify-content: center; gap: 10px; background: white; position: sticky; bottom: 0; z-index: 5;';
   mraContentDiv.appendChild(footerArea);

   // Store references
   window.mraContentArea = contentArea;
   window.mraFooterArea = footerArea;

   if (mraModalElement) { if (window._mraSaveDraft) { mraModalElement.removeEventListener('hidden.bs.modal', window._mraSaveDraft); } window._mraSaveDraft = function () { const formData = {}; if (window.mraFormFields) { for (const [key, field] of Object.entries(window.mraFormFields)) { formData[key] = field.input.value; } } localStorage.setItem(prfix + '_draft', JSON.stringify(formData)); }; mraModalElement.addEventListener('hidden.bs.modal', window._mraSaveDraft); }

  } else {
   // Modal exists, get references
   mraModalElement = modal;
   mraContentDiv = document.getElementById('mr_e__content_div');
   window.mraContentArea = document.getElementById('mr_e__content_area');
   window.mraFooterArea = document.getElementById('mr_e__footer_area');

   // Clear existing content
   if (window.mraContentArea) {
    window.mraContentArea.innerHTML = '';
   }
   if (window.mraFooterArea) {
    window.mraFooterArea.innerHTML = '';
   }

   // Get Bootstrap modal instance
   if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    mraModalInstance = bootstrap.Modal.getInstance(modal);
    if (!mraModalInstance) {
     //mraModalInstance = new bootstrap.Modal(modal);
     mraModalInstance = new bootstrap.Modal(modal, { backdrop: 'static', keyboard: false });
    }
   }
  }

  // Call display function if second arg is 1
  if (arg[1] === 1) {
   disp_mr_e__data(...arg);
  } else {
   // Just set values if modal exists
   if (window.mraContentArea) {
    set_mr_e__data_vals(...arg);
   }
  }
 };

 // Build modal header with back button, title, and dynamic dropdown menu
 function buildModalHeader(prfix, menuItems) {
  // Get modal body and wrap content properly
  const modalBody = mraContentDiv;
  if (!modalBody) return;

  // Clear existing header if any
  const existingHeader = modalBody.querySelector('.mr_e__modal-header');
  if (existingHeader) {
   existingHeader.remove();
  }

  // Create header container
  const header = document.createElement('div');
  header.className = 'mr_e__modal-header';
  header.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #dee2e6; position: sticky; top: 0; background: white; z-index: 10;';

  // Back button (left)
  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-link mr_e__back-btn';
  backBtn.style.cssText = 'padding: 0; margin: 0; font-size: 1.5rem; line-height: 1; text-decoration: none; color: var(--primary-color, #7B1FA2);';
  backBtn.innerHTML = '←';
  backBtn.onclick = function () {
   // Store all current form values to localStorage before closing
   const formData = {};
   if (window.mraFormFields) {
    for (const [key, field] of Object.entries(window.mraFormFields)) { formData[key] = field.input.value; }
   }
   const draftKey = prfix + '_draft';
   localStorage.setItem(draftKey, JSON.stringify(formData));
   if (mraModalInstance) { mraModalInstance.hide(); }
  };

  // Title (center)
  const title = document.createElement('h5');
  title.className = 'mr_e__modal-title';
  title.style.cssText = 'margin: 0; flex: 1; text-align: center; font-weight: 600;';
  title.textContent = 'Details';

  // Check if menuItems is valid array and has items
  const hasMenuItems = Array.isArray(menuItems) && menuItems.length > 0;

  if (hasMenuItems) {
   // Ellipsis dropdown (right)
   const dropdownDiv = document.createElement('div');
   dropdownDiv.className = 'dropdown mr_e__dropdown';
   dropdownDiv.style.cssText = 'position: relative;';

   const ellipsisBtn = document.createElement('button');
   ellipsisBtn.className = 'btn btn-link mr_e__ellipsis-btn';
   ellipsisBtn.style.cssText = 'padding: 0; margin: 0; font-size: 1.2rem; line-height: 1; color: var(--primary-color, #7B1FA2);';
   ellipsisBtn.innerHTML = '⋮';
   ellipsisBtn.setAttribute('data-bs-toggle', 'dropdown');
   ellipsisBtn.setAttribute('aria-expanded', 'false');

   const dropdownMenu = document.createElement('ul');
   dropdownMenu.className = 'dropdown-menu mr_e__dropdown-menu';
   dropdownMenu.style.cssText = 'min-width: 120px;';

   // Add dynamic dropdown items from menuItems array
   menuItems.forEach(item => {
    const menuItem = document.createElement('li');
    const menuLink = document.createElement('a');
    menuLink.className = 'dropdown-item mr_e__dropdown-item';
    menuLink.href = '#';
    menuLink.textContent = item.a || 'Menu Item';

    // Add danger class for delete action
    if (item.a && item.a.toLowerCase() === 'delete') {
     menuLink.classList.add('text-danger');
    }

    // Store the function name to call
    const functionName = item.e;
    // Store the fields to collect (f parameter)
    const fieldsToCollect = item.f ? item.f.split(',').map(f => f.trim()) : null;

    menuLink.onclick = (e) => {
     e.preventDefault();
     e.stopPropagation();

     // Close the dropdown
     const dropdown = bootstrap.Dropdown.getInstance(ellipsisBtn);
     if (dropdown) {
      dropdown.hide();
     }

     // Collect form data
     const formData = {};
     const allFields = window.mraFormFields || {};

     if (fieldsToCollect && fieldsToCollect.length > 0) {
      // Collect only specified fields
      for (const fieldKey of fieldsToCollect) {
       if (allFields[fieldKey] && allFields[fieldKey].input) {
        formData[fieldKey] = allFields[fieldKey].input.value;
       }
      }
     } else {
      // Collect all fields
      for (const [fieldKey, field] of Object.entries(allFields)) {
       formData[fieldKey] = field.input.value;
      }
     }

     // Call the function if it exists - following standard pattern
     if (functionName && typeof window[functionName] === 'function') {
      // Find the input element ID and value for the first field in fieldsToCollect
      let firstInputId = null;
      let firstInputValue = null;
      let firstDivId = null;

      if (fieldsToCollect && fieldsToCollect.length > 0) {
       const firstKey = fieldsToCollect[0];
       if (allFields[firstKey] && allFields[firstKey].input) {
        firstInputId = allFields[firstKey].input.id;
        firstInputValue = allFields[firstKey].input.value;
        firstDivId = document.getElementById(`${firstInputId}_div`)?.id || null;
       }
      }

      // If no fieldsToCollect, use the first field from allFields
      if (!firstInputId && Object.keys(allFields).length > 0) {
       const firstKey = Object.keys(allFields)[0];
       firstInputId = allFields[firstKey].input.id;
       firstInputValue = allFields[firstKey].input.value;
       firstDivId = document.getElementById(`${firstInputId}_div`)?.id || null;
      }

      window[functionName](
       firstInputId,     // inputId
       firstInputValue,  // value
       firstDivId,       // divId
       null,             // key
       {                 // fullObject
        action: item.a,
        functionName: functionName,
        originalItem: item,
        modalInstance: mraModalInstance,
        modalElement: mraModalElement,
        keyVals: formData,
        fieldsToCollect: fieldsToCollect
       }
      );
     }
    };

    menuItem.appendChild(menuLink);
    dropdownMenu.appendChild(menuItem);
   });

   dropdownDiv.appendChild(ellipsisBtn);
   dropdownDiv.appendChild(dropdownMenu);
   header.appendChild(backBtn);
   header.appendChild(title);
   header.appendChild(dropdownDiv);

   // Initialize dropdown
   if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
    new bootstrap.Dropdown(ellipsisBtn);
   }
  } else {
   // No menu items, just add back button and title
   header.appendChild(backBtn);
   header.appendChild(title);
   // Add an empty div for spacing to keep title centered
   const spacer = document.createElement('div');
   spacer.style.cssText = 'width: 36px;';
   header.appendChild(spacer);
  }

  // Insert header at the beginning of modal body
  modalBody.insertBefore(header, modalBody.firstChild);
 }

 // Display data in modal
 window.disp_mr_e__data = function (...arg) {
  const prfix = arg[0];
  const labels = arg[2] || {};
  let values = arg[3] || {};
  const specialProcessors = arg[4] || [];
  const clickHandlers = arg[5] || [];
  const menuItems = arg[6] || [];
  const displaySequence = arg[7] || '';
  const hiddenKeys = arg[8] || '';
  const actionButtons = arg[9] || [];



  // draft system must be changed, as it is overwriding existing values;
  // give button to see previous draft;

  // const draftKey = prfix + '_draft';
  // const savedDraft = localStorage.getItem(draftKey);
  // let mergedValues = values;
  // if (savedDraft) {
  //  try {
  //   const draftData = JSON.parse(savedDraft);
  //   mergedValues = {...values,...draftData};
  //   values = mergedValues;
  //  } catch (e) { console.error('Error parsing draft:', e); }
  // }




  // Store menu items for header rebuild if needed
  window.mraMenuItems = menuItems;

  const contentArea = window.mraContentArea;
  const footerArea = window.mraFooterArea;
  if (!contentArea) return;

  // Clear content area
  contentArea.innerHTML = '';
  if (footerArea) {
   footerArea.innerHTML = '';
  }

  // Parse action buttons - now an array of objects
  let actionButtonsList = [];
  if (Array.isArray(actionButtons) && actionButtons.length > 0) {
   actionButtonsList = actionButtons;
  }

  // Get ordered keys first (includes all keys, even hidden ones for sequence)
  const orderedKeys = getOrderedKeys(labels, displaySequence, hiddenKeys);

  // Parse hidden keys array for quick lookup
  const hiddenKeysArray = hiddenKeys ? hiddenKeys.split(',').map(k => k.trim()) : [];

  // Store all form fields for later collection
  const formFields = {};
  window.mraFormFields = formFields;

  // Create form group for each ordered key (including hidden ones)
  for (const key of orderedKeys) {
   const labelText = labels[key];
   const value = values[key] !== undefined ? values[key] : '';

   // Check if this key should be hidden
   const isHidden = hiddenKeysArray.includes(key);

   // Check if this key has special processor (arg[4])
   const processor = specialProcessors.find(p => p.a === key);
   // Check if this key has click handler (arg[5])
   const clickHandler = clickHandlers.find(p => p.a === key);

   // Determine if key matches processor or clickHandler
   const hasProcessor = processor !== undefined;
   const hasClickHandler = clickHandler !== undefined;

   // Create form group div
   const formGroup = document.createElement('div');
   formGroup.className = 'mr_e__form-group';
   formGroup.style.cssText = 'margin-bottom: 1rem; padding: 0.75rem; border: 2px solid #000; border-radius: 6px;';

   // If hidden, add style to hide the entire form group
   if (isHidden) {
    formGroup.style.display = 'none';
   }

   // Create label
   const label = document.createElement('label');
   label.className = 'mr_e__form-label';
   label.style.cssText = 'display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.875rem; color: #6c757d;';
   label.textContent = labelText;
   label.setAttribute('for', `${prfix}_${key}`);

   // Create input container for flex layout
   const inputContainer = document.createElement('div');
   inputContainer.className = 'mr_e__input-container';
   inputContainer.style.cssText = 'display: flex; align-items: center; gap: 0.5rem;';

   // Create input element
   const input = document.createElement('input');
   input.type = 'text';
   input.className = 'form-control mr_e__form-control';
   input.id = `${prfix}_${key}`;
   input.style.cssText = 'flex: 1; border: 1px solid #ced4da; border-radius: 4px;';
   input.value = value;

   // Store field reference (always store, even if hidden)
   formFields[key] = {
    input: input,
    label: labelText,
    value: value,
    isHidden: isHidden
   };

   // Create div element for processed value (if needed)
   let valueDiv = null;
   if (hasProcessor || hasClickHandler) {
    valueDiv = document.createElement('div');
    valueDiv.id = `${prfix}_${key}_div`;
    valueDiv.className = 'mr_e__value-div';
   }

   // Apply styling based on conditions
   if (hasProcessor) {
    input.style.display = 'none';
    if (valueDiv) {
     valueDiv.style.cssText += 'font-size: 0.875rem; color: #00349d; border-radius: 0.22rem;';
    }
    label.style.cssText += 'color: #00349d;';
    label.innerHTML = labelText;
   }
   if (hasClickHandler) {
    if (valueDiv) {
     valueDiv.style.cssText += 'font-size: 0.925rem; color: #b0006b; border-radius: 0.35rem; padding: 0.33rem';
    }
    label.style.cssText += 'color: #b0006b;';
    // Add solid link icon at beginning of label
    label.innerHTML = `<i class="fas fa-link mr_e__link-icon" style="margin-right: 0.25rem; font-size: 0.75rem;"></i>${labelText}`;

    // HIDE the input element completely
    input.style.display = 'none';

    // Add onclick event to content div
    const contentDivRef = valueDiv || inputContainer;
    contentDivRef.style.cursor = 'pointer';
    contentDivRef.onclick = (function (inpId, inpVal, divId, keyName, handlerObj) {
     return function () {
      if (typeof window[handlerObj.b] === 'function') {
       window[handlerObj.b](inpId, inpVal, divId, keyName, handlerObj);
      } else {
       console.warn(`Function ${handlerObj.b} not found`);
      }
     };
    })(`${prfix}_${key}`, value, valueDiv ? `${prfix}_${key}_div` : null, key, clickHandler);

    // Style 3: Show content div with additional styling
    if (valueDiv) {
     valueDiv.style.cssText += 'background: #d4edda; border-left: 3px solid #198754;';
    }
   }

   // Assemble components
   inputContainer.appendChild(input);
   formGroup.appendChild(label);
   formGroup.appendChild(inputContainer);
   if (valueDiv) {
    formGroup.appendChild(valueDiv);
   }

   contentArea.appendChild(formGroup);
  }

  // Create footer buttons from actionButtons array
  if (footerArea && actionButtonsList.length > 0) {
   footerArea.style.display = 'flex';

   for (const btnConfig of actionButtonsList) {
    const btnText = btnConfig.a || 'Button';
    const btnFunction = btnConfig.e;
    const fieldsToCollect = btnConfig.f ? btnConfig.f.split(',').map(f => f.trim()) : null;

    // Determine button style based on text
    let btnColor = '#7B1FA2'; // default violet
    let btnGradient = 'linear-gradient(135deg, #7B1FA2, #4A148C)';
    let btnShadow = 'rgba(123, 31, 162, 0.3)';

    if (btnText.toLowerCase().includes('add')) {
     btnColor = '#4CAF50';
     btnGradient = 'linear-gradient(135deg, #4CAF50, #45a049)';
     btnShadow = 'rgba(76, 175, 80, 0.3)';
    } else if (btnText.toLowerCase().includes('update')) {
     btnColor = '#FF9800';
     btnGradient = 'linear-gradient(135deg, #FF9800, #F57C00)';
     btnShadow = 'rgba(255, 152, 0, 0.3)';
    } else if (btnText.toLowerCase().includes('delete')) {
     btnColor = '#dc3545';
     btnGradient = 'linear-gradient(135deg, #dc3545, #c82333)';
     btnShadow = 'rgba(220, 53, 69, 0.3)';
    }

    const actionBtn = document.createElement('button');
    actionBtn.id = `mr_e__action_btn_${btnText.replace(/\s/g, '_')}`;
    actionBtn.className = 'btn mr_e__action-btn';
    actionBtn.style.cssText = `background: ${btnGradient} !important; color: white; border: none; border-radius: 50px; padding: 10px 24px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px ${btnShadow};`;
    actionBtn.innerHTML = `<i class="fas ${btnText.toLowerCase().includes('add') ? 'fa-plus' : btnText.toLowerCase().includes('update') ? 'fa-edit' : btnText.toLowerCase().includes('delete') ? 'fa-trash' : 'fa-check'} me-2"></i> ${btnText}`;

    actionBtn.onmouseover = () => {
     actionBtn.style.transform = 'translateY(-2px)';
     actionBtn.style.boxShadow = `0 6px 18px ${btnShadow}`;
    };
    actionBtn.onmouseout = () => {
     actionBtn.style.transform = 'translateY(0)';
     actionBtn.style.boxShadow = `0 4px 12px ${btnShadow}`;
    };

    actionBtn.onclick = async () => {
const t351mp = await chkIfLoggedIn();
if (t351mp.su == 1) {
     // Collect form data based on fieldsToCollect
     const formData = {};

     if (fieldsToCollect && fieldsToCollect.length > 0) {
      // Collect only specified fields
      for (const fieldKey of fieldsToCollect) {
       if (formFields[fieldKey] && formFields[fieldKey].input) {
        formData[fieldKey] = formFields[fieldKey].input.value;
       }
      }
     } else {
      // Collect all fields
      for (const [fieldKey, field] of Object.entries(formFields)) {
       formData[fieldKey] = field.input.value;
      }
     }

     // Call the function if it exists - following standard pattern
     if (btnFunction && typeof window[btnFunction] === 'function') {
      // Find the input element ID and value for the first field in fieldsToCollect
      let firstInputId = null;
      let firstInputValue = null;
      let firstDivId = null;

      if (fieldsToCollect && fieldsToCollect.length > 0) {
       const firstKey = fieldsToCollect[0];
       if (formFields[firstKey] && formFields[firstKey].input) {
        firstInputId = formFields[firstKey].input.id;
        firstInputValue = formFields[firstKey].input.value;
        firstDivId = document.getElementById(`${firstInputId}_div`)?.id || null;
       }
      }

      // If no fieldsToCollect, use the first field from formFields
      if (!firstInputId && Object.keys(formFields).length > 0) {
       const firstKey = Object.keys(formFields)[0];
       firstInputId = formFields[firstKey].input.id;
       firstInputValue = formFields[firstKey].input.value;
       firstDivId = document.getElementById(`${firstInputId}_div`)?.id || null;
      }

      window[btnFunction](
       firstInputId,     // inputId
       firstInputValue,  // value
       firstDivId,       // divId
       null,             // key
       {                 // fullObject
        action: btnText,
        functionName: btnFunction,
        originalItem: btnConfig,
        modalInstance: mraModalInstance,
        modalElement: mraModalElement,
        keyVals: formData,
        originalArg: arg,
        fieldsToCollect: fieldsToCollect
       }
      );
     }
}else {(async () => { await loadExe2Fn(5, [], [1]); })();}
    };

    footerArea.appendChild(actionBtn);
   }
  } else if (footerArea) {
   footerArea.style.display = 'none';
  }

  // Set values after creating all elements
  arg[3] = values;
  set_mr_e__data_vals(...arg);

  // Show modal
  if (mraModalInstance) {
   mraModalInstance.show();
  }
 };

 // Set values to input elements
 window.set_mr_e__data_vals = function (...arg) {
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

  // Parse hidden keys array
  const hiddenKeysArray = hiddenKeys ? hiddenKeys.split(',').map(k => k.trim()) : [];

  // Set values for all inputs
  for (const [key, val] of Object.entries(values)) {
   // Skip hidden keys
   if (hiddenKeysArray.includes(key)) continue;

   const input = document.getElementById(`${prfix}_${key}`);
   if (input) {
    input.value = val !== null && val !== undefined ? val : '';
   }

   // Check if this key has special processor
   const processor = specialProcessors.find(p => p.a === key);
   const clickHandler = clickHandlers.find(p => p.a === key);

   // Process with special processor if exists
   if (processor) {
    const divElement = document.getElementById(`${prfix}_${key}_div`);
    if (divElement && typeof window[processor.b] === 'function') {
     // Call processor function
     const processedValue = window[processor.b](
      `${prfix}_${key}`,
      val,
      `${prfix}_${key}_div`,
      key,
      processor
     );
     // If function doesn't return value, assume it sets the div content
     if (processedValue !== undefined && divElement) {
      divElement.textContent = processedValue;
     }
    } else if (divElement && processor) {
     console.warn(`Processor function ${processor.b} not found for key ${key}`);
    }
   } else if (clickHandler) {
    // For click handlers, set the div content directly if no processor
    const divElement = document.getElementById(`${prfix}_${key}_div`);
    if (divElement && val !== null && val !== undefined) {
     divElement.textContent = val;
    }
   }
  }
 };

})();