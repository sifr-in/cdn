async function showFilterBox() {
 // Create modal dynamically
 const modal = create_modal_dynamically('filterModal');
 const modalContent = modal.contentElement;
 const modalInstance = modal.modalInstance;

 // Set modal title with violet theme
 modal.modalElement.querySelector('.modal-content').insertAdjacentHTML('afterbegin', `
        <div class="modal-header" style="background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); border-bottom: 1px solid rgba(255,255,255,0.2);">
            <h5 class="modal-title" style="color: var(--text-on-primary);">
                <i class="fas fa-filter me-2"></i>Filter Profiles
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
    `);

// Generate Marital Status HTML dynamically
const maritalStatusOptions = window.marital_status;

let maritalStatusHtml = '';
maritalStatusOptions.forEach(status => {
 if (status.a === 0) return;
 maritalStatusHtml += `
        <li class="dropdown-item p-1">
            <div class="form-check m-0">
                <input class="form-check-input" type="checkbox" value="${status.a}" id="ms${status.a}">
                <label class="form-check-label w-100" for="ms${status.a}">${status.e}</label>
            </div>
        </li>
    `;
});

// Load saved filters from localStorage
const storageKey = my1uzr.worknOnPg + "_marriage_filter";
let savedFilters = {};
try {
 const saved = localStorage.getItem(storageKey);
 if (saved) {
  savedFilters = JSON.parse(saved);
 }
} catch (e) {
 console.error('Error parsing saved filters:', e);
}

// Helper function to get saved value or empty
function getSavedValue(key, subKey = null) {
 if (subKey) {
  return savedFilters[key] && savedFilters[key][subKey] !== undefined ? savedFilters[key][subKey] : '';
 }
 return savedFilters[key] !== undefined ? savedFilters[key] : '';
}

// Generate checked attribute for checkboxes
function getCheckedStatus(category, value) {
 if (savedFilters[category] && Array.isArray(savedFilters[category])) {
  return savedFilters[category].includes(String(value)) ? 'checked' : '';
 }
 return '';
}

// Generate Marital Status with saved values
let maritalStatusHtmlWithSaved = '';
maritalStatusOptions.forEach(status => {
 if (status.a === 0) return;
 const isChecked = getCheckedStatus('marital_status', status.a);
 maritalStatusHtmlWithSaved += `
        <li class="dropdown-item p-1">
            <div class="form-check m-0">
                <input class="form-check-input" type="checkbox" value="${status.a}" id="ms${status.a}" ${isChecked}>
                <label class="form-check-label w-100" for="ms${status.a}">${status.e}</label>
            </div>
        </li>
    `;
});

// Set modal content with dynamic HTML
modalContent.innerHTML = `
<div class="container-fluid py-3">
<form id="filterForm">
<!-- Marital Status - Dynamic -->
<div class="mb-3">
<div class="dropdown">
<button class="btn btn-outline-primary w-100 text-start dropdown-toggle d-flex justify-content-between align-items-center filter-dropdown marital-dropdown" 
type="button" 
id="maritalStatusDropdown" 
data-bs-toggle="dropdown" 
aria-expanded="false">
<span id="maritalStatusText"><i class="fas fa-ring me-2" style="color: var(--primary-color);"></i>Marital Status</span>
<i class="fas fa-chevron-down ms-auto text-muted"></i>
</button>
<ul class="dropdown-menu w-100 p-2 filter-dropdown-menu" aria-labelledby="maritalStatusDropdown">
${maritalStatusHtmlWithSaved}
</ul>
</div>
</div>

<!-- Age Range -->
<div class="mb-3">
<label class="form-label" style="font-size: 0.8rem; color: #FF8F00; margin-bottom: 4px;">
<i class="fas fa-birthday-cake me-1"></i>Age in years (e.g., 21 to 27)
</label>
<div class="row g-2">
<div class="col">
<input type="number" class="form-control filter-input age-input" name="min_age" placeholder="Min Age" min="18" max="99" value="${getSavedValue('min_age')}" style="border-color: #FFB300;">
</div>
<div class="col-auto align-self-center">
<span class="text-muted">to</span>
</div>
<div class="col">
<input type="number" class="form-control filter-input age-input" name="max_age" placeholder="Max Age" min="18" max="99" value="${getSavedValue('max_age')}" style="border-color: #FFB300;">
</div>
</div>
</div>

<!-- Height Range -->
<div class="mb-3">
<label class="form-label" style="font-size: 0.8rem; color: #388E3C; margin-bottom: 4px;">
<i class="fas fa-arrow-up me-1"></i>Height in feet.inch (e.g., 5.2 to 6.2)
</label>
<div class="row g-2">
<div class="col">
<input type="text" class="form-control filter-input height-input" name="min_height" placeholder="Min Height" pattern="^(\\d{1,2})(\\.\\d{1,2})?$" 
title="Format: feet (e.g., 5) or feet.inch (e.g., 5.6)" value="${getSavedValue('min_height')}" style="border-color: #4CAF50;"
oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\./g, '$1');">
</div>
<div class="col-auto align-self-center">
<span class="text-muted">to</span>
</div>
<div class="col">
<input type="text" class="form-control filter-input height-input" name="max_height" placeholder="Max Height" pattern="^(\\d{1,2})(\\.\\d{1,2})?$" 
title="Format: feet (e.g., 6) or feet.inch (e.g., 6.2)" value="${getSavedValue('max_height')}" style="border-color: #4CAF50;"
oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\./g, '$1');">
</div>
</div>
</div>

<!-- Income Range -->
<div class="mb-3">
<label class="form-label" style="font-size: 0.8rem; color: #1976D2; margin-bottom: 4px;">
<i class="fas fa-rupee-sign me-1"></i>Yearly income in lakhs (e.g., 2.4 to 6)
</label>
<div class="row g-2">
<div class="col">
<input type="text" class="form-control filter-input income-input" name="min_income" placeholder="Min Income (Lakhs)" pattern="^(\\d{1,4})(\\.\\d{1,2})?$" 
title="Format: lakhs (e.g., 5) or lakhs.lakhs (e.g., 5.50)" value="${getSavedValue('min_income')}" style="border-color: #2196F3;"
oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\./g, '$1');">
</div>
<div class="col-auto align-self-center">
<span class="text-muted">to</span>
</div>
<div class="col">
<input type="text" class="form-control filter-input income-input" name="max_income" placeholder="Max Income (Lakhs)" pattern="^(\\d{1,4})(\\.\\d{1,2})?$" 
title="Format: lakhs (e.g., 10) or lakhs.lakhs (e.g., 10.50)" value="${getSavedValue('max_income')}" style="border-color: #2196F3;"
oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\./g, '$1');">
</div>
</div>
</div>

<!-- Specific Profile ID -->
<div class="mb-3">
<label class="form-label" style="font-size: 0.8rem; color: #7B1FA2; margin-bottom: 4px;">
<i class="fas fa-id-card me-1"></i>Specific Profile ID (8 chars)
</label>
<input type="text" class="form-control filter-input" name="specific_profile_id" placeholder="Enter 8-char profile ID" pattern="^[0-9a-z]{8}$" maxlength="8" value="${getSavedValue('specific_profile_id')}" style="border-color: #7B1FA2; text-transform: lowercase;" oninput="this.value = this.value.replace(/[^0-9a-z]/g, '').toLowerCase();">
<div class="invalid-feedback">Profile ID must be exactly 8 characters (0-9, a-z)</div>
</div>

<!-- Action Buttons -->
<div class="modal-footer border-top-0 pt-3" style="border-top: 1px solid var(--border-color) !important;">
<button type="button" class="btn btn-outline-primary" id="resetFilters"><i class="fas fa-redo me-1"></i>Reset</button>
<button type="button" class="btn btn-primary" id="applyFilters" style="background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); border: none;" disabled><i class="fas fa-check me-1"></i>Apply</button>
</div>
</form>
</div>
`;

 // Add custom CSS for better styling
 addFilterModalStyles();

 // Load cities dynamically
 await loadCities();

 // Show the modal
 modalInstance.show();

 // Initialize dropdown text updates (will also load saved selections)
 initializeDropdownTexts();

 // Setup search input focus when dropdown opens
 setupCitySearchFocus();

 // Add event listeners
 setupFilterEventListeners();
 
 // Add validation listeners for Apply button
 setupValidationListeners();
}

function setupValidationListeners() {
 const applyBtn = document.getElementById('applyFilters');
 if (!applyBtn) return;
 
 function validateForm() {
  let isValid = true;
  const specificProfileId = document.querySelector('input[name="specific_profile_id"]');
  
  // If specific profile ID is being used, skip other validations
  if (specificProfileId && specificProfileId.value.trim() !== '') {
   const profileIdPattern = /^[0-9a-z]{8}$/;
   if (!profileIdPattern.test(specificProfileId.value.trim())) {
    isValid = false;
    specificProfileId.classList.add('is-invalid');
   } else {
    specificProfileId.classList.remove('is-invalid');
    applyBtn.disabled = false;
    return;
   }
  }
  
  // Validate Height inputs
  const minHeight = document.querySelector('input[name="min_height"]');
  const maxHeight = document.querySelector('input[name="max_height"]');
  const heightPattern = /^(\d{1,2})(\.\d{1,2})?$/;
  if (minHeight && minHeight.value.trim() !== '') { if (!heightPattern.test(minHeight.value.trim())) { isValid = false;minHeight.classList.add('is-invalid'); } else { minHeight.classList.remove('is-invalid'); } }
  if (maxHeight && maxHeight.value.trim() !== '') { if (!heightPattern.test(maxHeight.value.trim())) { isValid = false;maxHeight.classList.add('is-invalid'); } else { maxHeight.classList.remove('is-invalid'); } }
  
  // Validate Income inputs
  const minIncome = document.querySelector('input[name="min_income"]');
  const maxIncome = document.querySelector('input[name="max_income"]');
  const incomePattern = /^(\d{1,4})(\.\d{1,2})?$/;
  if (minIncome && minIncome.value.trim() !== '') { if (!incomePattern.test(minIncome.value.trim())) { isValid = false;minIncome.classList.add('is-invalid'); } else { minIncome.classList.remove('is-invalid'); } }
  if (maxIncome && maxIncome.value.trim() !== '') { if (!incomePattern.test(maxIncome.value.trim())) { isValid = false;maxIncome.classList.add('is-invalid'); } else { maxIncome.classList.remove('is-invalid'); } }
  
  // Validate Age inputs
  const minAge = document.querySelector('input[name="min_age"]');
  const maxAge = document.querySelector('input[name="max_age"]');
  if (minAge && minAge.value) { const age = parseInt(minAge.value); if (age < 18 || age > 99) { isValid = false;minAge.classList.add('is-invalid'); } else { minAge.classList.remove('is-invalid'); } }
  if (maxAge && maxAge.value) { const age = parseInt(maxAge.value); if (age < 18 || age > 99) { isValid = false;maxAge.classList.add('is-invalid'); } else { maxAge.classList.remove('is-invalid'); } }
  
  applyBtn.disabled = !isValid;
 }
 
 const inputs = document.querySelectorAll('#filterForm input');
 inputs.forEach(input => { input.addEventListener('input', validateForm);input.addEventListener('change', validateForm);input.addEventListener('blur', validateForm); });
 validateForm();
}
// Confirmation modal for specific profile ID
function showSpecificProfileConfirmModal(profileId, callback) {
 const modalId = 'specificProfileConfirmModal';
 const existingModal = document.getElementById(modalId);
 if (existingModal) { const bsModal = bootstrap.Modal.getInstance(existingModal); if (bsModal) bsModal.hide(); existingModal.remove(); }
 
 const modalObj = create_modal_dynamically(modalId);
 const modalInstance = modalObj.modalInstance;
 const modalElement = modalObj.modalElement;
 const modalBody = modalObj.contentElement;
 modalElement.classList.add('confirm-profile-modal');
 const modalDialog = modalElement.querySelector('.modal-dialog');
 modalDialog.classList.add('modal-sm');
 const modalContent = modalElement.querySelector('.modal-content');
 modalContent.innerHTML = '';
 
 const header = document.createElement('div');
 header.className = 'modal-header';
 header.style.cssText = 'background: linear-gradient(135deg, #7B1FA2, #4A148C); color: white; border-bottom: none;';
 header.innerHTML = `<h5 class="modal-title" style="color: white;"><i class="fas fa-id-card me-2"></i>Search Specific Profile</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>`;
 
 const body = document.createElement('div');
 body.className = 'modal-body text-center';
 body.style.cssText = 'padding: 2rem;';
 body.innerHTML = `<div style="font-size: 48px; margin-bottom: 15px;"><i class="fas fa-search" style="color: #7B1FA2;"></i></div><h4 style="margin-bottom: 15px;">Search Profile ID: ${profileId}</h4><p style="color: #6c757d; margin-bottom: 5px;">Other filters will not be applied.</p><p style="color: #6c757d; font-size: 14px;">Proceed with this specific profile search?</p>`;
 
 const footer = document.createElement('div');
 footer.className = 'modal-footer d-flex justify-content-center gap-3 border-top-0';
 footer.style.cssText = 'border-top: none; padding-bottom: 1.5rem;';
 footer.innerHTML = `<button type="button" class="btn btn-secondary" id="cancelSpecificProfileBtn" style="border-radius: 50px; padding: 8px 24px;"><i class="fas fa-times me-2"></i>Cancel</button><button type="button" class="btn btn-primary" id="confirmSpecificProfileBtn" style="border-radius: 50px; padding: 8px 24px; background: linear-gradient(135deg, #7B1FA2, #4A148C); border: none;"><i class="fas fa-check me-2"></i>Search</button>`;
 
 modalContent.appendChild(header);
 modalContent.appendChild(body);
 modalContent.appendChild(footer);
 
 setTimeout(() => {
  const confirmBtn = document.getElementById('confirmSpecificProfileBtn');
  const cancelBtn = document.getElementById('cancelSpecificProfileBtn');
  if (confirmBtn) { confirmBtn.onclick = () => { modalInstance.hide(); callback(true); }; }
  if (cancelBtn) { cancelBtn.onclick = () => { modalInstance.hide(); callback(false); }; }
 }, 100);
 
 modalElement.addEventListener('hidden.bs.modal', function () { callback(false); });
 modalInstance.show();
}

async function applyFilters() {
 const specificProfileId = getInputValue('specific_profile_id');
 
 // If specific profile ID is provided and valid
 if (specificProfileId && /^[0-9a-z]{8}$/.test(specificProfileId)) {
  showSpecificProfileConfirmModal(specificProfileId, async (confirmed) => {
   if (confirmed) {
    const filters = {specific_profile_id: specificProfileId};
    const storageKey = my1uzr.worknOnPg + "_marriage_filter";
    try { localStorage.setItem(storageKey, JSON.stringify(filters)); } catch (e) { console.error('Error saving filters to localStorage:', e); }
    if (typeof window[my1uzr.worknOnPg] === 'undefined') { window[my1uzr.worknOnPg] = {}; }
    window[my1uzr.worknOnPg].activeFilters = filters;
    const container = document.getElementById('profiles-container');
    if (container) { container.innerHTML = `<div class="col-12 text-center p-5"><div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"><span class="visually-hidden">Loading...</span></div><p class="mt-3 text-muted">Searching profile...</p></div>`; }
    const modalElement = document.getElementById('filterModal');
    if (modalElement) { const modal = bootstrap.Modal.getInstance(modalElement); if (modal) { modal.hide(); } }
    try { await fetchFilteredRecords(filters); showToast('Profile search completed', { type: 'success', duration: 2000 }); }
    catch (error) { console.error('Error searching profile:', error); showToast('Error searching profile: ' + error.message, { type: 'error' }); }
   }
  });
  return;
 }
 
 // Original filter logic for non-specific ID searches
 const filters = {marital_status: getSelectedValuesFromDropdown('maritalStatusDropdown'),min_age: getInputValue('min_age'),max_age: getInputValue('max_age'),with_photos: getCheckboxValue('with_photos'),inter_caste: getCheckboxValue('inter_caste'),city: getSelectedValuesFromDropdown('cityDropdown'),min_height: getInputValue('min_height'),max_height: getInputValue('max_height'),min_income: getInputValue('min_income'),max_income: getInputValue('max_income'),degree: getDegreeValues(),occupation: getOccupationValues()};
 if (filters.min_age && filters.max_age) { const minAge = parseInt(filters.min_age);const maxAge = parseInt(filters.max_age);if (minAge > maxAge) { showToast('Minimum age cannot be greater than maximum age', { type: 'error' });return; } }
 if (filters.min_height && filters.max_height) { const minHeight = parseFloat(filters.min_height);const maxHeight = parseFloat(filters.max_height);if (minHeight > maxHeight) { showToast('Minimum height cannot be greater than maximum height', { type: 'error' });return; } }
 if (filters.min_income && filters.max_income) { const minIncome = parseFloat(filters.min_income);const maxIncome = parseFloat(filters.max_income);if (minIncome > maxIncome) { showToast('Minimum income cannot be greater than maximum income', { type: 'error' });return; } }
 const storageKey = my1uzr.worknOnPg + "_marriage_filter";
 try { localStorage.setItem(storageKey, JSON.stringify(filters)); } catch (e) { console.error('Error saving filters to localStorage:', e); }
 if (typeof window[my1uzr.worknOnPg] === 'undefined') { window[my1uzr.worknOnPg] = {}; }
 window[my1uzr.worknOnPg].activeFilters = filters;
 const container = document.getElementById('profiles-container');
 if (container) { container.innerHTML = `<div class="col-12 text-center p-5"><div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"><span class="visually-hidden">Loading...</span></div><p class="mt-3 text-muted">Applying filters...</p></div>`; }
 const modalElement = document.getElementById('filterModal');
 if (modalElement) { const modal = bootstrap.Modal.getInstance(modalElement); if (modal) { modal.hide(); } }
 try {
  await fetchFilteredRecords(filters);
  showToast('Filters applied successfully', { type: 'success', duration: 2000 });
 } catch (error) {
  console.error('Error applying filters:', error);
  showToast('Error applying filters: ' + error.message, { type: 'error' });
  if (container) { container.innerHTML = `<div class="col-12"><div class="alert alert-danger text-center"><i class="fas fa-exclamation-triangle me-2"></i>Error applying filters: ${error.message}</div></div>`; }
 }
}
function addFilterModalStyles() {
 if (!document.getElementById('filterModalStyles')) {
  const style = document.createElement('style');
  style.id = 'filterModalStyles';
  style.textContent = `
.filter-modal .modal-content {
border: 1px solid var(--border-color);
border-radius: 12px;
box-shadow: 0 10px 30px rgba(123, 31, 162, 0.15);
}
.filter-dropdown {
border: 1px solid var(--primary-color) !important;
color: var(--primary-color) !important;
background: transparent !important;
border-radius: 8px !important;
padding: 10px 15px !important;
font-weight: 500;
transition: all 0.2s ease;
}
.filter-dropdown:hover {
background: rgba(123, 31, 162, 0.05) !important;
border-color: var(--primary-dark) !important;
color: var(--primary-dark) !important;
}
.filter-dropdown:focus {
box-shadow: 0 0 0 3px rgba(123, 31, 162, 0.1) !important;
}
.filter-dropdown.show {
border-color: var(--primary-dark) !important;
color: var(--primary-dark) !important;
}
.filter-dropdown-menu {
border: 1px solid var(--border-color);
border-radius: 8px;
box-shadow: 0 5px 15px rgba(123, 31, 162, 0.1);
margin-top: 5px !important;
}
.filter-dropdown-menu .dropdown-item {
padding: 6px 10px;
border-radius: 4px;
margin: 2px 0;
}
.filter-dropdown-menu .dropdown-item:hover {
background: rgba(123, 31, 162, 0.05);
}
.filter-input {
border: 1px solid var(--border-color);
border-radius: 8px;
padding: 10px 15px;
transition: all 0.2s ease;
}
.filter-input:focus {
border-color: var(--primary-color);
box-shadow: 0 0 0 3px rgba(123, 31, 162, 0.1);
outline: none;
}
.filter-checkbox {
border: 1px solid var(--border-color);
border-radius: 8px;
margin-bottom: 8px;
transition: all 0.2s ease;
}
.filter-checkbox:hover {
border-color: var(--primary-light);
background: rgba(123, 31, 162, 0.02);
}
.filter-checkbox .form-check-input {
width: 1.2em;
height: 1.2em;
margin-top: 0.2em;
cursor: pointer;
border: 1px solid var(--border-color);
}
.filter-checkbox .form-check-input:checked {
background-color: var(--primary-color);
border-color: var(--primary-color);
}
.filter-checkbox .form-check-input:focus {
box-shadow: 0 0 0 3px rgba(123, 31, 162, 0.25);
}
.filter-checkbox .form-check-label {
cursor: pointer;
color: var(--text-dark);
}
.filter-dropdown-menu .form-check-input {
width: 1.1em;
height: 1.1em;
margin-top: 0.1em;
border: 1px solid var(--border-color);
}
.filter-dropdown-menu .form-check-label {
cursor: pointer;
font-size: 0.9rem;
color: var(--text-dark);
}
.filter-modal .btn-outline-secondary {
border: 1px solid var(--border-color);
color: var(--text-secondary);
border-radius: 8px;
padding: 8px 16px;
}
.filter-modal .btn-outline-primary {
border: 1px solid var(--primary-color);
color: var(--primary-color);
border-radius: 8px;
padding: 8px 16px;
}
.filter-modal .btn-primary {
border-radius: 8px;
padding: 8px 20px;
font-weight: 500;
}
.filter-dropdown-menu::-webkit-scrollbar {
width: 6px;
}
.filter-dropdown-menu::-webkit-scrollbar-track {
background: var(--light-color);
border-radius: 3px;
}
.filter-dropdown-menu::-webkit-scrollbar-thumb {
background: var(--primary-light);
border-radius: 3px;
}
.filter-dropdown-menu::-webkit-scrollbar-thumb:hover {
background: var(--primary-color);
}
.filter-modal .text-muted {
color: var(--text-secondary) !important;
}
.filter-dropdown .fa-chevron-down {
color: var(--text-secondary) !important;
transition: transform 0.2s ease;
}
.filter-dropdown.show .fa-chevron-down {
transform: rotate(180deg);
}
#citySearch {
border: none;
border-radius: 0;
box-shadow: none !important;
}
#citySearch:focus {
box-shadow: none !important;
}
.input-group-text.bg-transparent {
background: transparent !important;
border-color: var(--border-color);
}
`;
  document.head.appendChild(style);
 }

 const modalElement = document.getElementById('filterModal');
 if (modalElement) {
  modalElement.classList.add('filter-modal');
 }
}

function setupCitySearchFocus() {
 const cityDropdown = document.getElementById('cityDropdown');
 if (cityDropdown) {
  cityDropdown.addEventListener('shown.bs.dropdown', function () {
   const searchInput = document.getElementById('citySearch');
   if (searchInput) {
    setTimeout(() => {
     searchInput.focus();
    }, 100);
   }
  });
 }
}

function initializeOccupationSelection() {
 const occupationBtn = document.getElementById('occupationSelectBtn');
 const occupationText = document.getElementById('occupationText');

 if (occupationBtn) {
  occupationBtn.addEventListener('click', async function () {
   const prepOccupationData = 1;
   const shoOccupationModal = 1;
   const current_Occupations = document.getElementById('selectedOccupations')?.value || '';

   window.OccupationButtonRef = occupationBtn;
   window.OccupationTextRef = occupationText;

   await loadExe2Fn(33, [prepOccupationData, shoOccupationModal, "callBackfn_set_Occupations", current_Occupations, "selectedOccupations", "occupationText", 32], [1]);
  });
 }
}

function initializeDegreeSelection() {
 const degreeBtn = document.getElementById('degreeSelectBtn');
 const degreeText = document.getElementById('degreeText');

 if (degreeBtn) {
  degreeBtn.addEventListener('click', async function () {
   const prepDegData = 1;
   const shoDegModal = 1;
   const current_degrees = document.getElementById('selectedDegrees')?.value || '';

   window.degreeButtonRef = degreeBtn;
   window.degreeTextRef = degreeText;

   await loadExe2Fn(31, [prepDegData, shoDegModal, "callBackfn_set_degrees", current_degrees, "selectedDegrees", "degreeText"], [1]);
  });
 }
}

function callBackfn_set_Occupations(selectedOccupations) {
 const occupationText = document.getElementById('occupationText');
 const hiddenInput = document.getElementById('selectedOccupations');

 if (!occupationText) return;

 if (selectedOccupations && selectedOccupations.length > 0) {
  if (selectedOccupations.length === 1) {
   occupationText.innerHTML = `<i class="fas fa-check me-2 text-success"></i>${selectedOccupations[0]}`;
  } else {
   occupationText.innerHTML = `<i class="fas fa-check-circle me-2 text-success"></i>${selectedOccupations.length} occupations selected`;
  }

  if (hiddenInput) {
   hiddenInput.value = selectedOccupations.join(',');
  }
 } else {
  occupationText.innerHTML = '<i class="fas fa-briefcase me-2"></i>Select Occupation';
  if (hiddenInput) {
   hiddenInput.value = '';
  }
 }
}

function getOccupationValues() {
 const hiddenInput = document.getElementById('selectedOccupations');
 if (hiddenInput && hiddenInput.value) {
  return hiddenInput.value.split(',').filter(v => v.trim() !== '');
 }
 return [];
}

function callBackfn_set_degrees(selectedDegrees) {
 const degreeText = document.getElementById('degreeText');
 const hiddenInput = document.getElementById('selectedDegrees');

 if (!degreeText) return;

 if (selectedDegrees && selectedDegrees.length > 0) {
  if (selectedDegrees.length === 1) {
   degreeText.innerHTML = `<i class="fas fa-check me-2 text-success"></i>${selectedDegrees[0]}`;
  } else {
   degreeText.innerHTML = `<i class="fas fa-check-circle me-2 text-success"></i>${selectedDegrees.length} degrees selected`;
  }

  if (hiddenInput) {
   hiddenInput.value = selectedDegrees.join(',');
  }
 } else {
  degreeText.innerHTML = '<i class="fas fa-graduation-cap me-2"></i>Select Education';
  if (hiddenInput) {
   hiddenInput.value = '';
  }
 }
}

function initializeDropdownTexts() {
 updateDropdownText('maritalStatusDropdown', 'maritalStatusText');
 updateDropdownText('religionDropdown', 'religionText');
 updateDropdownText('cityDropdown', 'cityText');
 updateDropdownText('occupationDropdown', 'occupationText');

 document.querySelectorAll('.filter-dropdown-menu input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', function () {
   const dropdownId = this.closest('.filter-dropdown-menu').previousElementSibling.id;
   const textId = dropdownId.replace('Dropdown', 'Text');
   updateDropdownText(dropdownId, textId);
  });
 });
}

function updateDropdownText(dropdownId, textId) {
 const dropdown = document.getElementById(dropdownId);
 const textElement = document.getElementById(textId);

 if (!dropdown || !textElement) return;

 const menu = dropdown.nextElementSibling;
 const checkboxes = menu.querySelectorAll('input[type="checkbox"]:checked');

 if (checkboxes.length === 0) {
  textElement.innerHTML = dropdownId.includes('marital') ? '<i class="fas fa-ring me-2"></i>Marital Status' :
   dropdownId.includes('religion') ? '<i class="fas fa-pray me-2"></i>Religion' :
    dropdownId.includes('city') ? '<i class="fas fa-city me-2"></i>City' :
     dropdownId.includes('degree') ? '<i class="fas fa-graduation-cap me-2"></i>Education' :
      '<i class="fas fa-briefcase me-2"></i>Occupation';
 } else if (checkboxes.length === 1) {
  const label = checkboxes[0].nextElementSibling.textContent;
  textElement.innerHTML = `<i class="fas fa-check me-2 text-success"></i>${label}`;
 } else {
  textElement.innerHTML = `<i class="fas fa-check-circle me-2 text-success"></i>${checkboxes.length} selected`;
 }
}

async function loadCities() {
 try {
  const cityList = document.getElementById('cityList');
  if (!cityList) return;

  cityList.innerHTML = '<div class="text-center text-muted p-3">Loading cities...</div>';

  let cities = [];

  if (typeof window[my1uzr.worknOnPg] !== 'undefined' &&
   window[my1uzr.worknOnPg].cty &&
   Array.isArray(window[my1uzr.worknOnPg].cty)) {
   cities = window[my1uzr.worknOnPg].cty;
  }

  if (cities.length === 0) {
   const url = "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1d275e7/cmn/ctco.da";
   const response = await fetch(url);
   if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
   }
   window[my1uzr.worknOnPg].cty = await response.json();
   cities = window[my1uzr.worknOnPg].cty;
  }

  renderCities(cities);

 } catch (error) {
  console.error('Error loading cities:', error);
  const cityList = document.getElementById('cityList');
  if (cityList) {
   cityList.innerHTML = '<div class="text-center text-danger p-3">Failed to load cities</div>';
  }
 }
}

function renderCities(cities) {
 const cityList = document.getElementById('cityList');
 const citySearch = document.getElementById('citySearch');

 if (!cityList || cities.length === 0) {
  cityList.innerHTML = '<div class="text-center text-muted p-3">No cities available</div>';
  return;
 }

 renderCityList(cities, '');

 if (citySearch) {
  let searchTimeout;
  citySearch.addEventListener('input', function () {
   clearTimeout(searchTimeout);
   searchTimeout = setTimeout(() => {
    renderCityList(cities, this.value.toLowerCase());
   }, 300);
  });
 }
}

function renderCityList(cities, searchTerm) {
 const cityList = document.getElementById('cityList');

 const filteredCities = searchTerm ?
  cities.filter(city => city.n.toLowerCase().includes(searchTerm)) :
  cities.slice(0, 20);

 if (filteredCities.length === 0) {
  cityList.innerHTML = '<div class="text-center text-muted p-3">No cities found</div>';
  return;
 }

 cityList.innerHTML = '';
 filteredCities.forEach(city => {
  const div = document.createElement('div');
  div.className = 'p-1';
  div.innerHTML = `
            <div class="form-check m-0">
                <input class="form-check-input" type="checkbox" value="${city.a}" id="city${city.a}">
                <label class="form-check-label w-100" for="city${city.a}" style="font-size: 0.9rem;">${city.n}</label>
            </div>
        `;
  cityList.appendChild(div);
 });

 updateDropdownText('cityDropdown', 'cityText');
}

function setupFilterEventListeners() {
 const applyBtn = document.getElementById('applyFilters');
 if (applyBtn) {
  applyBtn.addEventListener('click', applyFilters);
 }

 const resetBtn = document.getElementById('resetFilters');
 if (resetBtn) {
  resetBtn.addEventListener('click', resetFilters);
 }

 const minAge = document.querySelector('input[name="min_age"]');
 const maxAge = document.querySelector('input[name="max_age"]');

 if (minAge && maxAge) {
  minAge.addEventListener('change', function () {
   const min = parseInt(this.value) || 18;
   const max = parseInt(maxAge.value) || 99;
   if (min > max) {
    maxAge.value = min;
   }
  });

  maxAge.addEventListener('change', function () {
   const min = parseInt(minAge.value) || 18;
   const max = parseInt(this.value) || 99;
   if (max < min) {
    minAge.value = max;
   }
  });
 }

 const minHeight = document.querySelector('input[name="min_height"]');
 const maxHeight = document.querySelector('input[name="max_height"]');

 if (minHeight && maxHeight) {
  minHeight.addEventListener('blur', validateHeight);
  maxHeight.addEventListener('blur', validateHeight);
 }

 document.querySelectorAll('.filter-dropdown-menu input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', function () {
   const dropdownId = this.closest('.filter-dropdown-menu').previousElementSibling.id;
   const textId = dropdownId.replace('Dropdown', 'Text');
   updateDropdownText(dropdownId, textId);
  });
 });
 
 initializeDegreeSelection();
 initializeOccupationSelection();
}

function validateHeight() {
 const input = this;
 const value = input.value.trim();

 if (!value) return;

 // Validate height format: integer (feet) OR feet.inch (with 1-2 decimal places)
 const pattern = /^(\d{1,2})(\.(\d{1,2}))?$/;
 if (!pattern.test(value)) {
  showToast('Invalid height format. Use feet (e.g., 5) or feet.inch (e.g., 5.6)', { type: 'error', duration: 3000 });
  input.value = '';
  return;
 }

 // If decimal exists, check inches part
 if (value.includes('.')) {
  const [feet, inches] = value.split('.');
  if (parseInt(inches) > 11) {
   showToast('Inches must be between 0-11', { type: 'error', duration: 3000 });
   input.value = '';
  }
 }
}

function resetFilters() {
 // Reset all checkboxes
 document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
  cb.checked = false;
 });

 // Reset all input fields
 document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
  input.value = '';
 });

 // Reset degree selection
 const degreeText = document.getElementById('degreeText');
 const hiddenDegree = document.getElementById('selectedDegrees');
 if (degreeText) {
  degreeText.innerHTML = '<i class="fas fa-graduation-cap me-2"></i>Select Education';
 }
 if (hiddenDegree) {
  hiddenDegree.value = '';
 }

 // Reset occupation selection
 const occupationText = document.getElementById('occupationText');
 const hiddenOccupation = document.getElementById('selectedOccupations');
 if (occupationText) {
  occupationText.innerHTML = '<i class="fas fa-briefcase me-2"></i>Select Occupation';
 }
 if (hiddenOccupation) {
  hiddenOccupation.value = '';
 }
 
const specificProfileId = document.querySelector('input[name="specific_profile_id"]');
if (specificProfileId) { specificProfileId.value = ''; specificProfileId.classList.remove('is-invalid'); }

 // Reset all dropdown texts
 initializeDropdownTexts();

 // Clear saved filters from localStorage
 const storageKey = my1uzr.worknOnPg + "_marriage_filter";
 try {
  localStorage.removeItem(storageKey);
 } catch (e) {
  console.error('Error clearing filters from localStorage:', e);
 }

 // Show loader in the profiles container
 const container = document.getElementById('profiles-container');
 if (container) {
  container.innerHTML = `
   <div class="col-12 text-center p-5">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
     <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mt-3 text-muted">Resetting filters...</p>
   </div>
  `;
 }

 // Close the modal
 const modalElement = document.getElementById('filterModal');
 if (modalElement) {
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) {
   modal.hide();
  }
 }

 // Reset profiles data and reload
 profilesData = [];
 hasMore = true;
 currentPage = 0;
 
 // Fetch all profiles
 pullNwProfiles(null, true).then(result => {
  if (result && result.profiles) {
   profilesData = result.profiles;
   hasMore = result.hasMore;
   
   // Update UI
   if (container) {
    container.innerHTML = '';
    profilesData.forEach(profile => {
     const profileCard = window.createProfileCard(profile);
     container.appendChild(profileCard);
    });
   }
   
   // Update loader container
   const loaderContainer = document.getElementById('loader-container');
   if (loaderContainer) {
    if (hasMore) {
     loaderContainer.innerHTML = '<div class="text-center text-muted p-3">Scroll down for more profiles...</div>';
    } else {
     loaderContainer.innerHTML = '';
    }
   }
   
   showToast('All filters reset', { type: 'info', duration: 2000 });
  } else {
   throw new Error('Failed to load profiles');
  }
 }).catch(error => {
  console.error('Error resetting filters:', error);
  if (container) {
   container.innerHTML = `
    <div class="col-12">
     <div class="alert alert-danger text-center">
      <i class="fas fa-exclamation-triangle me-2"></i>
      Error loading profiles. Please refresh the page.
     </div>
    </div>
   `;
  }
 });
}

function getDegreeValues() {
 const hiddenInput = document.getElementById('selectedDegrees');
 if (hiddenInput && hiddenInput.value) {
  return hiddenInput.value.split(',').filter(v => v.trim() !== '');
 }
 return [];
}

function getSelectedValuesFromDropdown(dropdownId) {
 const dropdown = document.getElementById(dropdownId);
 if (!dropdown) return [];

 const menu = dropdown.nextElementSibling;
 const checkboxes = menu.querySelectorAll('input[type="checkbox"]:checked');
 return Array.from(checkboxes).map(cb => cb.value);
}

function getInputValue(name) {
 const input = document.querySelector(`input[name="${name}"]`);
 return input ? input.value.trim() : '';
}

function getCheckboxValue(name) {
 const checkbox = document.querySelector(`input[name="${name}"]`);
 return checkbox && checkbox.checked ? checkbox.value : '';
}

window.filterResultsUpdated = function(filteredProfiles) {
 console.log('filterResultsUpdated called with', filteredProfiles?.length || 0, 'profiles');
 
 try {
  const container = document.getElementById('profiles-container');
  if (!container) {
   console.error('profiles-container not found');
   return;
  }
  
  // Clear existing cards
  container.innerHTML = '';
  
  // Add new filtered cards
  if (filteredProfiles && filteredProfiles.length > 0) {
   filteredProfiles.forEach(profile => {
    const profileCard = createProfileCard(profile);
    container.appendChild(profileCard);
   });
   
   // Update loader container
   const loaderContainer = document.getElementById('loader-container');
   if (loaderContainer) {
    loaderContainer.innerHTML = '';
   }
   
   // Reset infinite scroll variables
   hasMore = false;
   currentPage = 0;
   
  } else {
   container.innerHTML = `
    <div class="col-12">
     <div class="alert alert-info text-center">
      <i class="fas fa-info-circle me-2"></i>
      No profiles found matching your filters. Try adjusting your criteria.
     </div>
    </div>
   `;
  }
 } catch (error) {
  console.error('Error in filterResultsUpdated:', error);
 }
};

async function fetchFilteredRecords(filters) {
 try {
  const whereConditions = [];
  
  // Specific Profile ID
  if (filters.specific_profile_id) {
   whereConditions.push(`w = '${filters.specific_profile_id}'`);
  }
  
  // Only apply other filters if no specific profile ID
  if (!filters.specific_profile_id) {
   if (filters.marital_status && filters.marital_status.length > 0) { whereConditions.push(`j IN (${filters.marital_status.join(',')})`); }
   if (filters.min_age || filters.max_age) { const currentDate = new Date(); if (filters.min_age) { const minDate = new Date(); minDate.setFullYear(currentDate.getFullYear() - parseInt(filters.min_age)); whereConditions.push(`g <= '${convertDateFormatToComputer(minDate)}'`); } if (filters.max_age) { const maxDate = new Date(); maxDate.setFullYear(currentDate.getFullYear() - parseInt(filters.max_age)); whereConditions.push(`g >= '${convertDateFormatToComputer(maxDate)}'`); } }
   if (filters.with_photos === '1') { whereConditions.push(`(u IS NOT NULL AND u != '' AND ut IS NOT NULL AND ut != '')`); }
   if (filters.city && filters.city.length > 0) { whereConditions.push(`(a2 IN (${filters.city.join(',')}) OR c6 IN (${filters.city.join(',')}))`); }
   if (filters.min_height || filters.max_height) { const minHeight = parseFloat(filters.min_height) || 4.9; const maxHeight = parseFloat(filters.max_height) || 7.11; whereConditions.push(`h BETWEEN ${minHeight} AND ${maxHeight}`); }
   if (filters.min_income || filters.max_income) { if (filters.min_income && filters.max_income) { whereConditions.push(`i BETWEEN ${parseFloat(filters.min_income)} AND ${parseFloat(filters.max_income)}`); } else if (filters.min_income) { whereConditions.push(`i >= ${parseFloat(filters.min_income)}`); } else if (filters.max_income) { whereConditions.push(`i <= ${parseFloat(filters.max_income)}`); } }
   if (filters.degree && filters.degree.length > 0) { const degreeConditions = filters.degree.map(deg => `s LIKE '%${deg}%'`); whereConditions.push(`(${degreeConditions.join(' OR ')})`); }
   if (filters.occupation && filters.occupation.length > 0) { const occConditions = filters.occupation.map(occ => `qa LIKE '%${occ}%'`); whereConditions.push(`(${occConditions.join(' OR ')})`); }
  }
  
  const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : '';
  profilesData = [];
  const result = await pullNwProfiles(whereClause, true);
  
  if (result && result.profiles) {
   window[my1uzr.worknOnPg].filteredProfiles = result.profiles;
   profilesData = result.profiles;
   hasMore = result.hasMore;
   const container = document.getElementById('profiles-container');
   if (container) { container.innerHTML = ''; if (result.profiles.length > 0) { result.profiles.forEach(profile => { const profileCard = createProfileCard(profile); container.appendChild(profileCard); }); } else { container.innerHTML = `<div class="col-12"><div class="alert alert-info text-center"><i class="fas fa-info-circle me-2"></i>No profiles found matching your filters. Try adjusting your criteria.</div></div>`; } }
   const loaderContainer = document.getElementById('loader-container');
   if (loaderContainer) { loaderContainer.innerHTML = ''; }
   hasMore = false;
   currentPage = 0;
   const count = result.profiles.length;
   showToast(`Found ${count} matching profiles`, {type: 'success',duration: 3000});
   return result.profiles;
  } else { throw new Error(result?.ms || 'Failed to fetch records'); }
 } catch (error) { console.error('Error fetching filtered records:', error); throw error; }
}

// Make functions globally available
window.showFilterBox = showFilterBox;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.fetchFilteredRecords = fetchFilteredRecords;