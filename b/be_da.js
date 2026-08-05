// prt_stng.js - Print Settings Editor
const imgObjDimensRqd = ["500x500"];
const DEFAULT_LOGO = "https://i.postimg.cc/gJ62yjJf/my1.jpg";
function resolveLogoUrl(value) {
 const raw = value ? String(value).trim() : '';
 if (!raw) return DEFAULT_LOGO;
 let resolved = raw;
 if (typeof window.getGoogleDriveImageUrl === 'function') {
  resolved = window.getGoogleDriveImageUrl(raw) || raw;
 } else {
  const parts = raw.split(/\s+/);
  if (parts.length >= 1 && /^[A-Za-z0-9_-]{20,}$/.test(parts[0])) {
   resolved = 'https://lh3.googleusercontent.com/d/' + parts[0] + '=s0?authuser=0';
  }
 }
 return resolved || DEFAULT_LOGO;
}
(function () {
 'use strict';

 console.log('prt_stng.js initializing...');

 // Default settings structure
 const defaultSettings = {
  optiInvoice: "Invoice:",
  optiCompNm: "sifr Optician",
  printMo: "<b>Mo:</b><br>+91 0000000000",
  printInvoice: "Sales Invoice",
  printCompNm: "sifr Optician",
  printAdrs: "390, C ward, Beside Ghudanpeer Dargah, Kolhapur",
  printSubjectTo: "Mo: 0000000000      Subject to Kolhapur Jurisdiction",
  printPartyTtl: "Name:",
  printPavtiTtl: "Invoice no.:",
  printMobTtl: "Mo.No.:",
  printBilDtTtl: "Date:",
  printAdrsTtl: "Address:",
  printDeliveryDtTtl: "Delivery:",
  printTxAmtTtl: "Total:",
  printAdvAmtTtl: "Received:",
  printForTtl: "For<br><br>sifr Optician",
  printRefByTtl: "Referred by: ",
  print_logo: "https://i.postimg.cc/gJ62yjJf/my1.jpg",
  tbl_disp: 2,
  show_all_receipts: 1
 };

 // Field groups for organized display
 const fieldGroups = [
  {
   title: '📄 Invoice Header',
   icon: 'fa-file-invoice',
   fields: [
    { key: 'printInvoice', label: 'Invoice Title', type: 'text', maxlength: 50, required: true },
    { key: 'printCompNm', label: 'Company Name', type: 'text', maxlength: 60, required: true },
    { key: 'printAdrs', label: 'Address', type: 'textarea', rows: 2, maxlength: 150 },
    { key: 'printSubjectTo', label: 'Subject To / Footer', type: 'textarea', rows: 2, maxlength: 100 },
    { key: 'print_logo', label: 'Logo URL', type: 'url', maxlength: 500, placeholder: 'https://...' }
   ]
  },
  {
   title: '🏷️ Label Titles',
   icon: 'fa-tags',
   fields: [
    { key: 'printPartyTtl', label: 'Party Name Label', type: 'text', maxlength: 30, required: true },
    { key: 'printPavtiTtl', label: 'Invoice No. Label', type: 'text', maxlength: 30, required: true },
    { key: 'printMobTtl', label: 'Mobile No. Label', type: 'text', maxlength: 30 },
    { key: 'printBilDtTtl', label: 'Date Label', type: 'text', maxlength: 30, required: true },
    { key: 'printAdrsTtl', label: 'Address Label', type: 'text', maxlength: 30 },
    { key: 'printDeliveryDtTtl', label: 'Delivery Label', type: 'text', maxlength: 30 },
    { key: 'printTxAmtTtl', label: 'Total Label', type: 'text', maxlength: 30, required: true },
    { key: 'printAdvAmtTtl', label: 'Received Label', type: 'text', maxlength: 30 },
    { key: 'printRefByTtl', label: 'Referred By Label', type: 'text', maxlength: 30 }
   ]
  },
  {
   title: '🏪 Business Info',
   icon: 'fa-store',
   fields: [
    { key: 'optiInvoice', label: 'Invoice Prefix', type: 'text', maxlength: 30, required: true },
    { key: 'optiCompNm', label: 'Business Name', type: 'text', maxlength: 60, required: true },
    {
     key: 'printMo',
     label: 'Mobile Display',
     type: 'multi_line_html',
     parts: [
      { key: 'printMo_line1', stripRegex: /<b>|<br>|<\/b>/gi, default: 'Mo:' },
      { key: 'printMo_line2', stripRegex: /<b>|<br>|<\/b>|\+/gi, default: '+91 0000000000' }
     ],
     maxlength: 30,
     required: true
    },
    {
     key: 'printForTtl',
     label: 'Signature Area',
     type: 'multi_line_html',
     parts: [
      { key: 'printForTtl_line1', stripRegex: /<br>|<\/b>/gi, default: 'For' },
      { key: 'printForTtl_line2', stripRegex: /<br>|<\/b>/gi, default: 'sifr Optician' }
     ],
     maxlength: 40,
     required: true
    }
   ]
  },
  {
   title: '⚙️ Display Options',
   icon: 'fa-cog',
   fields: [
    {
     key: 'tbl_disp', label: 'Table Display Style', type: 'select', options: [
      { value: 1, label: 'Style 1 - Simple' },
      { value: 2, label: 'Style 2 - Detailed' }
     ]
    },
    {
     key: 'show_all_receipts', label: 'Show All Receipts', type: 'select', options: [
      { value: 0, label: 'No - Hide old receipts' },
      { value: 1, label: 'Yes - Show all receipts' }
     ]
    }
   ]
  }
 ];

 // Load settings from b.da
 async function loadSettings() {
  try {
   const response = await fetch('b.da');
   if (response.ok) {
    const data = await response.json();
    console.log('Loaded settings from b.da:', data);
    return { ...defaultSettings, ...data };
   }
  } catch (e) {
   console.warn('Could not load b.da, using defaults:', e);
  }
  return { ...defaultSettings };
 }

 window.afterimagesetcallrun = function (objjjj) {
  const imgUrl = (objjjj && (objjjj.g1 || objjjj.url)) || '';
  const preview = document.getElementById('prtStngLogoPreview');
  const error = document.getElementById('prtStngLogoError');
  const logoInput = document.getElementById('prtStng_print_logo');
  const removeBtn = document.getElementById('prtStngLogoRemoveBtn');
  if (preview) {
   preview.src = resolveLogoUrl(imgUrl);
   preview.style.display = '';
  }
  if (error) error.style.display = 'none';
  if (logoInput) logoInput.value = imgUrl;
  if (removeBtn) removeBtn.style.display = imgUrl ? '' : 'none';
 };

 window.removeLogoPreview = function () {
  const preview = document.getElementById('prtStngLogoPreview');
  const error = document.getElementById('prtStngLogoError');
  const logoInput = document.getElementById('prtStng_print_logo');
  const removeBtn = document.getElementById('prtStngLogoRemoveBtn');
  if (preview) {
   preview.src = '';
   preview.style.display = 'none';
  }
  if (error) error.style.display = 'block';
  if (logoInput) logoInput.value = '';
  if (removeBtn) removeBtn.style.display = 'none';
 };

 // Build form HTML
 function buildFormHTML(settings) {
  let groupsHTML = '';

  fieldGroups.forEach((group, gIndex) => {
   let fieldsHTML = '';

   group.fields.forEach(field => {
    let fieldsHTMLForThis = '';

    if (field.type === 'multi_line_html') {
     // Multi-line HTML field - split into separate inputs
     const fieldId = `prtStng_${field.key}`;
     let allPartsHTML = '';

     (field.parts || []).forEach((part, pIndex) => {
      const value = settings[field.key] || part.default || '';
      // Strip HTML tags to get clean text lines
      const lines = value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').split('\n').filter(l => l.trim());
      const lineValue = lines[pIndex] || part.default || '';
      const escapedLineValue = String(lineValue).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const lineId = `${fieldId}_line${pIndex + 1}`;

      allPartsHTML += `
                <input type="text" class="form-control border border-dark mb-2" 
                    id="${lineId}" 
                    name="${field.key}_line${pIndex + 1}" 
                    value="${escapedLineValue}" 
                    maxlength="${field.maxlength || 30}" 
                    placeholder="Line ${pIndex + 1}" 
                    ${field.required && pIndex === 0 ? 'required' : ''}
                    data-field-key="${field.key}"
                    data-line-index="${pIndex}">`;
     });

     fieldsHTMLForThis = `
            <div class="mb-3">
                <label class="form-label fw-medium small mb-1">
                    ${field.label} ${field.required ? '<span class="text-danger">*</span>' : ''}
                </label>
                ${allPartsHTML}
                <small class="text-muted">${field.maxlength ? `Max ${field.maxlength} characters each` : ''}</small>
            </div>`;
    } else if (field.type === 'textarea') {
     const value = settings[field.key] !== undefined ? settings[field.key] : '';
     const fieldId = `prtStng_${field.key}`;
     const escapedValue = String(value).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

     fieldsHTMLForThis = `
            <div class="mb-3">
                <label for="${fieldId}" class="form-label fw-medium small mb-1">
                    ${field.label} ${field.required ? '<span class="text-danger">*</span>' : ''}
                </label>
                <textarea class="form-control border border-dark" id="${fieldId}" name="${field.key}" rows="${field.rows || 2}" maxlength="${field.maxlength || 200}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>${escapedValue}</textarea>
                <small class="text-muted">${field.maxlength ? `Max ${field.maxlength} characters` : ''}</small>
            </div>`;
    } else if (field.type === 'select') {
     const value = settings[field.key] !== undefined ? settings[field.key] : '';
     const fieldId = `prtStng_${field.key}`;
     let inputHTML = `<select class="form-select border border-dark" id="${fieldId}" name="${field.key}" ${field.required ? 'required' : ''}>`;
     (field.options || []).forEach(opt => {
      const selected = String(value) === String(opt.value) ? 'selected' : '';
      inputHTML += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
     });
     inputHTML += `</select>`;

     fieldsHTMLForThis = `
            <div class="mb-3">
                <label for="${fieldId}" class="form-label fw-medium small mb-1">
                    ${field.label} ${field.required ? '<span class="text-danger">*</span>' : ''}
                </label>
                ${inputHTML}
            </div>`;
    } else {
     const value = settings[field.key] !== undefined ? settings[field.key] : '';
     const fieldId = `prtStng_${field.key}`;
     const escapedValue = String(value).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

     fieldsHTMLForThis = `
            <div class="mb-3">
                <label for="${fieldId}" class="form-label fw-medium small mb-1">
                    ${field.label} ${field.required ? '<span class="text-danger">*</span>' : ''}
                </label>
                <input type="${field.type}" class="form-control border border-dark" id="${fieldId}" name="${field.key}" value="${escapedValue}" maxlength="${field.maxlength || 100}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
                <small class="text-muted">${field.maxlength ? `Max ${field.maxlength} characters` : ''}</small>
            </div>`;
    }

    fieldsHTML += fieldsHTMLForThis;
   });

   groupsHTML += `
                <div class="card mb-3 border shadow-sm border border-dark">
                    <div class="card-header bg-light fw-bold">
                        <!--i class="fas ${group.icon} me-2 text-primary"></i-->${group.title}
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            ${fieldsHTML}
                        </div>
                    </div>
                </div>`;
  });

  // Logo preview
  const logoUrl = settings.print_logo || '';

  return `
            <div>
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <h5 class="mb-0">
                        <i class="fas fa-cog me-2 text-primary"></i>Settings
                    </h5>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary" id="prtStngResetBtn">
                            <i class="fas fa-undo me-1"></i>Reset
                        </button>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                </div>

                <form id="prtStngForm">
                    <!-- Logo Preview -->
                    <div class="card mb-3 border shadow-sm border border-dark">
                        <div class="card-header bg-light fw-bold d-flex justify-content-between align-items-center">
                            <span><i class="fas fa-image me-2 text-primary"></i>Logo Preview</span>
                            <!--button type="button" class="btn btn-sm btn-outline-danger" id="prtStngLogoRemoveBtn" style="display:none;" onclick="removeLogoPreview()">✕ Remove</button-->
                        </div>
                        <div class="card-body text-center pt-0">
                            <img id="prtStngLogoPreview" class="border border-dark" src="${resolveLogoUrl(logoUrl)}" alt="Logo Preview" 
                                style="max-width:200px;max-height:100px;object-fit:contain;cursor:pointer;display:inline-block;"
                                onclick="(async () => { await loadExe2Fn(24, [afterimagesetcallrun, imgObjDimensRqd], [1]); })();"
                                onload="this.style.display='inline-block';var el=document.getElementById('prtStngLogoError');if(el)el.style.display='none';"
                                onerror="this.style.display='none';var el=document.getElementById('prtStngLogoError');if(el)el.style.display='block';">
                            <div id="prtStngLogoError" class="text-muted small" style="display:none;cursor:pointer;"
                                onclick="(async () => { await loadExe2Fn(24, [afterimagesetcallrun, imgObjDimensRqd], [1]); })();">
                                <i class="fas fa-image fa-2x mb-1 d-block" style="opacity:0.4;"></i>
                                Logo preview will appear here
                            </div>
                        </div>
                    </div>

                    ${groupsHTML}

                    <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i>Cancel
                        </button>
                        <button type="submit" class="btn btn-primary" id="prtStngSaveBtn">
                            <i class="fas fa-save me-1"></i>Save Settings
                        </button>
                    </div>
                </form>
            </div>`;
 }

 // Validate form
 function validateForm(scope) {
  const root = scope || document;
  const form = root.getElementById ? root.getElementById('prtStngForm') : root.querySelector('#prtStngForm');
  if (!form) return false;

  let isValid = true;

  // Check all required fields
  fieldGroups.forEach(group => {
   group.fields.forEach(field => {
    if (field.required) {
     const el = root.querySelector('#prtStng_' + field.key);
     if (el && !el.value.trim()) {
      el.classList.add('is-invalid');
      isValid = false;
     } else if (el) {
      el.classList.remove('is-invalid');
     }
    }
   });
  });

  // Validate logo URL if provided
  const logoInput = root.querySelector('#prtStng_print_logo');
  if (logoInput && logoInput.value.trim()) {
   const url = logoInput.value.trim();
   const isGoogleId = /^[A-Za-z0-9_-]{20,}$/.test((url.split(/\s+/)[0] || ''));
   if (!url.match(/^https?:\/\/.+/i) && !url.match(/^data:image\//i) && !isGoogleId) {
    logoInput.classList.add('is-invalid');
    isValid = false;
   }
  }

  if (!isValid && typeof showToast === 'function') {
   showToast('Please fill all required fields', { type: 'warning', duration: 2000 });
  }

  return isValid;
 }

 // Save settings
 async function saveSettings(formData) {
  const settings = { ...defaultSettings };

  // Track multi-line fields to combine
  const multiLineGroups = {};

  // Update with form values
  fieldGroups.forEach(group => {
   group.fields.forEach(field => {
    if (field.type === 'multi_line_html') {
     // Collect multi-line parts
     const lines = [];
     (field.parts || []).forEach((part, pIndex) => {
      const lineValue = formData.get(field.key + '_line' + (pIndex + 1));
      if (lineValue !== null && lineValue !== undefined) {
       lines.push(String(lineValue).trim());
      }
     });
     // Combine with proper HTML format
     if (field.key === 'printMo') {
      // Format: <b>Mo:</b><br>+91 0000000000
      if (lines.length >= 2) {
       settings[field.key] = '<b>' + lines[0] + '</b><br>' + lines.slice(1).join('<br>');
      } else {
       settings[field.key] = lines.join('<br>');
      }
     } else {
      settings[field.key] = lines.join('<br>');
     }
    } else {
     let value = formData.get(field.key);
     if (value !== null && value !== undefined) {
      value = String(value).trim();
      if (field.type === 'select') {
       const numVal = Number(value);
       settings[field.key] = isNaN(numVal) ? value : numVal;
      } else {
       settings[field.key] = value;
      }
     }
    }
   });
  });
  console.log('Saving settings:', settings);
  // Prepare payload
  if (typeof payload0 !== 'undefined') {
   payload0.vw = 1;
   payload0.fn = 104; // Function number for print settings
   payload0.drml = "sambodhisarang.in";
   payload0.prt_stng = settings;

   try {

    const response = await fnj3("https://my1.in/3/c.php", payload0, 1, true, null, 20000, 0, 2, 1);

    if (response && response.su == 1) {
     if (typeof showToast === 'function') {
      showToast(response.ms || 'Settings saved successfully!', { type: 'success', duration: 2000 });
     }
     if (typeof showsuccessmodal === 'function') {
      showsuccessmodal(response.ms || 'Print settings updated successfully!');
     }
     return true;
    } else {
     window.showelsemodal(response?.ms || 'Failed to save settings. Please try again.');
     saveBtn.disabled = false;
     saveBtn.innerHTML = originalText;
     return false;
    }
   } catch (error) {
    window.showcatchmodal(error || 'Network Error: 500/404');
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalText;
    return false;
   }
  } else {
   // Fallback - just show success
   console.log('Settings data ready (payload0 not available):', settings);
   if (typeof showsuccessmodal === 'function') {
    showsuccessmodal('Settings saved successfully! (local only)');
   }
   return true;
  }
 }

 // Re-attach event handlers after rendering/rebuilding the form
 function attachPrintSettingsHandlers(contentElement, modalInstance, modalElement) {
  const root = contentElement || document;
  let resetting = false;

  // Logo preview update
  const logoInput = root.querySelector('#prtStng_print_logo');
  if (logoInput) {
   logoInput.addEventListener('input', function () {
    const preview = root.querySelector('#prtStngLogoPreview');
    const error = root.querySelector('#prtStngLogoError');
    if (preview) {
     preview.src = resolveLogoUrl(this.value);
     preview.style.display = '';
    }
    if (error) {
     error.style.display = 'none';
    }
   });
  }

  // Form submit
  const form = root.querySelector('#prtStngForm');
  if (form) {
   form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateForm(root)) return;

    const saveBtn = root.querySelector('#prtStngSaveBtn');
    const originalText = saveBtn ? saveBtn.innerHTML : '';
    if (saveBtn) {
     saveBtn.disabled = true;
     saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Saving...';
    }

    const formData = new FormData(form);
    const success = await saveSettings(formData);

    if (success) {
     modalInstance.hide();
    }

    if (saveBtn) {
     saveBtn.disabled = false;
     saveBtn.innerHTML = originalText;
    }
   });
  }

  // Reset button: show defaults, then close and reopen the modal
  const resetBtn = root.querySelector('#prtStngResetBtn');
  if (resetBtn) {
   resetBtn.addEventListener('click', function () {
    contentElement.innerHTML = buildFormHTML(defaultSettings);
    resetting = true;
    setTimeout(() => {
     modalInstance.hide();
    }, 100);
   });
  }

  // Reopen the modal only after it has fully closed due to a reset
  if (modalElement) {
   modalElement.addEventListener('hidden.bs.modal', function () {
    if (resetting) {
     resetting = false;
     (async () => { await loadExe2Fn(23, [], [1]); })();
    }
   });
  }
 }

 // Main function to show the editor
 async function showPrintSettings() {
  console.log('Opening print settings editor...');

  if (typeof create_modal_dynamically !== 'function') {
   if (typeof showToast === 'function') showToast('Modal system not available');
   return;
  }

  const settings = await loadSettings();

  const modalId = 'printSettingsModal';
  const modalResult = create_modal_dynamically(modalId);
  if (!modalResult) return;

  const { contentElement, modalInstance, modalElement } = modalResult;

  contentElement.innerHTML = buildFormHTML(settings);

  setTimeout(() => {
   const md = modalElement.querySelector('.modal-dialog');
   if (md) {
    md.style.marginTop = '70px';
    md.style.maxWidth = '700px';
   }
   const mc = modalElement.querySelector('.modal-content');
   if (mc) {
    mc.style.borderRadius = '8px';
    mc.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
    mc.style.border = '1px soild black';
   }
   const mb = modalElement.querySelector('.modal-body');
   if (mb) {
    mb.style.maxHeight = '80vh';
    mb.style.overflowY = 'auto';
    mb.style.padding = '15px 20px';
   }
  }, 50);

  modalInstance.show();

  attachPrintSettingsHandlers(contentElement, modalInstance, modalElement);
 }

 // Expose globally
 window.showPrintSettings = showPrintSettings;

 console.log('prt_stng.js loaded successfully');

})();