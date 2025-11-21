let d_entInd_ata = [];
let f1nEiToExe = null;
let loaderElement = null;
let s_ei_witchToReturn = null;
let currentEditingRecord = null;
let currentModalId = null; // Add this to track the current modal ID

async function open_entind_crud(...args) {
    loaderElement = document.getElementById(args[0] || null);
    const createNwModalif1 = 1; // args[1] || 0;
    const trgtDvIdForEntInd = args[2] || null;
    f1nEiToExe = args[3] || null;
    s_ei_witchToReturn = args[4] || null;

    if (loaderElement) {
        loaderElement.style.display = 'flex';
    }

    try {
        // Load d_entInd_ata first
        d_entInd_ata = await dbDexieManager.getAllRecords(dbnm, "c");
        // Sort d_entInd_ata descending by b field (created date)
        d_entInd_ata.sort((a, b) => new Date(b.b) - new Date(a.b));

        setTimeout(() => {
            // Hide loader when done
            if (loaderElement) {
                loaderElement.style.display = 'none';
            }

            // Check if modal content container already exists
            let existingContainer = document.getElementById(trgtDvIdForEntInd);
            
            if (createNwModalif1 == 1) {
                // Generate unique modal ID
                currentModalId = 'entind_modal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                
                // Use existing function to create modal
                const modalResult = create_modal_dynamically(currentModalId);
                const modal = modalResult.modalElement;
                let modalContent = modalResult.contentElement;
                
                // If container already exists elsewhere, remove it
                if (existingContainer && existingContainer.parentNode) {
                    existingContainer.remove();
                }
                
                // Set the target div ID for the content
                modalContent.id = trgtDvIdForEntInd;
                modalContent.className = 'modal-content h-100 d-flex flex-column';

                // Render the CRUD interface
                renderCRUDInterface(modalContent);

                // Show the modal
                modalResult.modalInstance.show();

                // Add close handler
                modal.addEventListener('hidden.bs.modal', () => {
                    closeSpecificModal(currentModalId);
                    // Reset current modal ID when modal is closed
                    currentModalId = null;
                });

            } else {
                // Use existing target - ensure it exists
                if (!existingContainer) {
                    console.error('Target container not found:', trgtDvIdForEntInd);
                    return;
                }
                modalContent = existingContainer;
                renderCRUDInterface(modalContent);

                // Show modal if modalid is provided
                if (mdlIdIfContentIsToBeShonInExistng) {
                    const existingModal = document.getElementById(mdlIdIfContentIsToBeShonInExistng);
                    if (existingModal) {
                        const modalInstance = bootstrap.Modal.getInstance(existingModal) || new bootstrap.Modal(existingModal);
                        modalInstance.show();
                        currentModalId = mdlIdIfContentIsToBeShonInExistng;
                    }
                }
            }
        }, 500);
    } catch (error) {
        console.error("Error loading d_entInd_ata:", error);
        if (loaderElement) {
            loaderElement.style.display = 'none';
        }
        showToast("Error loading d_entInd_ata");
    }
}

// Helper function to close specific modal by ID
function closeSpecificModal(modalId) {
 const modal = document.getElementById(modalId);
 if (modal) {
  const modalInstance = bootstrap.Modal.getInstance(modal);
  if (modalInstance) {
   modalInstance.hide();
  }
  // Modal will be removed by the hidden.bs.modal event handler in create_modal_dynamically
 }
 currentModalId = null; // Reset current modal ID
}

function renderCRUDInterface(container) {
 // Create search box and cards container
 container.innerHTML = `
        <div class="modal-header sticky-top bg-white border-bottom pb-2">
            <div class="d-flex justify-content-between align-items-center w-100">
                <div class="input-group">
                    <button type="button" id="bt_sho_ad_ei" class="btn btn-primary">+</button>
                    <input type="text" class="form-control" id="entindSearch" placeholder="Search by ID, Mobile, Name...">
                    <button class="btn btn-outline-secondary" type="button" id="clearSearch">
                        X
                    </button>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>
        </div>
        <div class="modal-body overflow-auto flex-grow-1">
            <div id="addNewWhenNotFound" class="card mb-3 d-none">
                <div class="card-header">
                    <h5 id="formTitle" class="card-title mb-0">Add new record:</h5>
                </div>
                <div class="card-body">
                    <form id="quickAddForm">
                        <input type="hidden" id="editRecordId" value="">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Country Code</label>
                                    <select class="form-control" id="quickCountryCode">
                                        <option value="91" selected>India (+91)</option>
                                        <option value="1">USA/Canada (+1)</option>
                                        <option value="44">UK (+44)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Mobile Number*</label>
                                    <input type="text" class="form-control" id="quickMobile" required>
                                    <small class="text-danger" id="mobileError" style="display:none">Must be 10 digits</small>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Relation</label>
                                    <select class="form-control" id="quickRelation">
<option value="1" selected>self [स्वतः]</option>
<option value="2">relative 1 [नातेवाईक 1]</option>
<option value="3">relative 2 [नातेवाईक 2]</option>
<option value="4">relative 3 [नातेवाईक 3]</option>
<option value="5">relative 4 [नातेवाईक 4]</option>
<option value="6">relative 5 [नातेवाईक 5]</option>
<option value="7">relative 6 [नातेवाईक 6]</option>
<option value="8">relative 7 [नातेवाईक 7]</option>
<option value="9">relative 8 [नातेवाईक 8]</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Name (English, no UTF)</label>
                                    <input type="text" class="form-control" id="quickNameEnglish">
                                    <small class="text-danger" id="englishNameError" style="display:none">Only English characters allowed</small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Name (Local, no ASCII)</label>
                                    <input type="text" class="form-control" id="quickNameLocal">
                                    <small class="text-danger" id="localNameError" style="display:none">Only non-English characters allowed</small>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>Address</label>
                                    <input type="text" class="form-control" id="quickAddress">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Gender</label>
                                    <select class="form-control" id="quickGender">
                                        <option value="0" selected>Don't know</option>
                                        <option value="1">Male</option>
                                        <option value="2">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Image URL</label>
                                    <input type="url" class="form-control" id="quickImageUrl">
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary" id="quickSave">Save</button>
                        <button type="button" class="btn btn-secondary" id="cancelAddNew">Cancel</button>
                        <button type="button" class="btn btn-warning" id="updateEntInd" style="display:none;">Update</button>
                    </form>
                </div>
            </div>
            <div class="row" id="entindCardsContainer"></div>
        </div>
    `;

 // Add event listener to show add new form button
 document.getElementById('bt_sho_ad_ei').addEventListener('click', function () {
  showAddNewForm();
 });

 // Add event listener to cancel button
 document.getElementById('cancelAddNew').addEventListener('click', function () {
  hideAddNewForm();
  renderCards();
 });

 // Add event listener to update button
 document.getElementById('updateEntInd').addEventListener('click', function () {
  updateRecord();
 });

 // Add search functionality
 document.getElementById('entindSearch').addEventListener('input', function () {
  renderCards(this.value.toLowerCase());
 });

 /*document.getElementById('clearSearch').addEventListener('click', function () {
  document.getElementById('entindSearch').value = '';
  renderCards();
 });*/

 // Setup form validation
 setupQuickAddFormValidation();

 // Initial render of cards
 renderCards();
}

function showAddNewForm(record = null) {
 const addNewDiv = document.getElementById('addNewWhenNotFound');
 const formTitle = document.getElementById('formTitle');
 const saveButton = document.getElementById('quickSave');
 const updateButton = document.getElementById('updateEntInd');
 const recordIdInput = document.getElementById('editRecordId');

 addNewDiv.classList.remove('d-none');

 // Clear any search term
//  document.getElementById('entindSearch').value = '';

 // Clear the cards container
 document.getElementById('entindCardsContainer').innerHTML = '';

 if (record) {
  // Editing mode
  formTitle.textContent = 'Edit Record';
  saveButton.style.display = 'none';
  updateButton.style.display = 'inline-block';
  recordIdInput.value = record.a;
  currentEditingRecord = record;

  // Fill form with record data
  if (record.e) {
   const mobileParts = record.e.split('.');
   if (mobileParts.length === 2) {
    document.getElementById('quickCountryCode').value = mobileParts[0];
    document.getElementById('quickMobile').value = mobileParts[1];
   }
  }

  document.getElementById('quickRelation').value = record.f || '1';
  document.getElementById('quickNameEnglish').value = record.h || '';
  document.getElementById('quickNameLocal').value = record.i || '';
  document.getElementById('quickAddress').value = record.m || '';
  document.getElementById('quickGender').value = record.n || '0';
  document.getElementById('quickImageUrl').value = record.l || '';
 } else {
  // Add new mode
  formTitle.textContent = 'Add new record:';
  saveButton.style.display = 'inline-block';
  updateButton.style.display = 'none';
  recordIdInput.value = '';
  currentEditingRecord = null;

  // Pre-fill with empty values
  document.getElementById('quickCountryCode').value = '91';
  document.getElementById('quickMobile').value = '';
  document.getElementById('quickRelation').value = '1';
  document.getElementById('quickNameEnglish').value = '';
  document.getElementById('quickNameLocal').value = '';
  document.getElementById('quickAddress').value = '';
  document.getElementById('quickGender').value = '0';
  document.getElementById('quickImageUrl').value = '';
 }

 // Clear validation errors
 document.getElementById('mobileError').style.display = 'none';
 document.getElementById('englishNameError').style.display = 'none';
 document.getElementById('localNameError').style.display = 'none';

 document.getElementById('quickMobile').classList.remove('is-invalid');
 document.getElementById('quickNameEnglish').classList.remove('is-invalid');
 document.getElementById('quickNameLocal').classList.remove('is-invalid');
}

function hideAddNewForm() {
 document.getElementById('addNewWhenNotFound').classList.add('d-none');
}
// Validation functions
function validateMobile(input) {
 const isValid = /^\d{10}$/.test(input.value);
 const errorElement = document.getElementById('mobileError');
 if (!isValid && input.value) {
  errorElement.style.display = 'block';
  input.classList.add('is-invalid');
  return false;
 } else {
  errorElement.style.display = 'none';
  input.classList.remove('is-invalid');
  return true;
 }
}

function validateEnglishName(input) {
 const value = input.value;
 const errorElement = document.getElementById('englishNameError');
 if (/[^\x00-\x7F]/.test(value)) {
  errorElement.style.display = 'block';
  input.classList.add('is-invalid');
  return false;
 } else {
  errorElement.style.display = 'none';
  input.classList.remove('is-invalid');
  return true;
 }
}

function validateLocalName(input) {
 const value = input.value;
 const errorElement = document.getElementById('localNameError');
 if (value && /[\x00-\x7F]/.test(value.replace(/\s/g, ''))) {
  errorElement.style.display = 'block';
  input.classList.add('is-invalid');
  return false;
 } else {
  errorElement.style.display = 'none';
  input.classList.remove('is-invalid');
  return true;
 }
}

function setupQuickAddFormValidation() {

 // Add event listeners for validation
 document.getElementById('quickMobile').addEventListener('input', function () {
  validateMobile(this);
 });

 document.getElementById('quickNameEnglish').addEventListener('input', function () {
  validateEnglishName(this);
 });

 document.getElementById('quickNameLocal').addEventListener('input', function () {
  validateLocalName(this);
 });

 // Add save event listener
 document.getElementById('quickSave').addEventListener('click', async function () {
  await saveRecord(false);
 });
}

async function saveRecord(isUpdate = false) {
 // Show loader using existing function
 const loader = createDynamicLoader();
 document.body.appendChild(loader);

 try {
  const mobileValid = validateMobile(document.getElementById('quickMobile'));
  const englishValid = validateEnglishName(document.getElementById('quickNameEnglish'));
  const localValid = validateLocalName(document.getElementById('quickNameLocal'));

  if (!mobileValid || !englishValid || !localValid) {
   return;
  }

  if (!document.getElementById('quickMobile').value) {
   document.getElementById('mobileError').style.display = 'block';
   document.getElementById('quickMobile').classList.add('is-invalid');
   return;
  }

  // Check if record with same mobile and relation already exists (only for new records)
  if (!isUpdate) {
   const countryCode = document.getElementById('quickCountryCode').value;
   const mobileNumber = document.getElementById('quickMobile').value;
   const fullMobile = countryCode + "." + mobileNumber;
   const relation = document.getElementById('quickRelation').value;

   const existingRecord = d_entInd_ata.find(item =>
    item.e.toString() === fullMobile.toString() && item.f.toString() === relation.toString()
   );

   if (existingRecord) {
    if (confirm("This mobile number and relation already exists!\nClick 'yes' to use.\n" + JSON.stringify(existingRecord))) {
     if (f1nEiToExe && window[f1nEiToExe]) {
      window[f1nEiToExe](existingRecord, s_ei_witchToReturn);
      // Close only the current modal by ID
      if (currentModalId) {
       closeSpecificModal(currentModalId);
      }
     }
    }
    return;
   }
  }

  const recordId = document.getElementById('editRecordId').value;
  const newRecord = {
   a: isUpdate ? recordId : (d_entInd_ata.length + 1).toString(),
   b: isUpdate ? currentEditingRecord.b : new Date().toISOString().replace('T', ' ').substring(0, 19),
   c: "0",
   d: "0",
   e: document.getElementById('quickCountryCode').value + "." + document.getElementById('quickMobile').value,
   f: document.getElementById('quickRelation').value,
   g: "0",
   h: document.getElementById('quickNameEnglish').value || '',
   i: document.getElementById('quickNameLocal').value || '',
   j: "0",
   k: null,
   l: document.getElementById('quickImageUrl').value || '',
   m: document.getElementById('quickAddress').value || '',
   n: document.getElementById('quickGender').value,
   c1: null
  };

  var c = {};
  c.e = document.getElementById('quickCountryCode').value + "." + document.getElementById('quickMobile').value;
  c.f = document.getElementById('quickRelation').value;
  c.h = document.getElementById('quickNameEnglish').value || '';
  c.i = document.getElementById('quickNameLocal').value || '';
  c.m = document.getElementById('quickAddress').value || '';
  c.n = document.getElementById('quickGender').value;

  if (isUpdate) {
   c.a = recordId;
  }

  payload0.c = c;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'c', "col": 'b', "cl": "b" }]);
  payload0.vw = 1;
  payload0.fn = isUpdate ? 5 : 1;

  var r368esponse = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 15000, 0, 1, 0);

  if (r368esponse && r368esponse.su === 1) {
   const t635mp = await dbDexieManager.insertToDexie(dbnm, "c", r368esponse.c.l, true, "a");

   if (t635mp && t635mp.success) {
    let cstmr = await dbDexieManager.getAllRecords(dbnm, "c");

    if (!cstmr || cstmr.length === 0) {
     console.warn("No customers found in database");
     return;
    } else {
     const c377stmr = cstmr.filter(d377ata =>
      d377ata.e.toString() === c.e.toString() &&
      d377ata.f.toString() === c.f.toString()
     );

     if (c377stmr && c377stmr.length > 0) {
      if (isUpdate) {
       // Update existing record
       const index = d_entInd_ata.findIndex(item => item.a === recordId);
       if (index !== -1) {
        d_entInd_ata[index] = newRecord;
       }
      } else {
       // Add new record
       d_entInd_ata.push(newRecord);
      }

      hideAddNewForm();
      document.getElementById('entindSearch').value = '';
      renderCards();

      if (f1nEiToExe && window[f1nEiToExe]) {
       window[f1nEiToExe](c377stmr[0], s_ei_witchToReturn);
       // Close only the current modal by ID
       if (currentModalId) {
        closeSpecificModal(currentModalId);
       }
      }
     } else {
      showToast("Please wait a few seconds and try again");
     }
    }
   } else {
    showToast("Error saving customer records");
   }
  } else {
   alert(r368esponse?.ms || "Unknown error occurred");
  }
 } catch (error) {
  console.error("Error saving item:", error);
  showToast("Error saving item: " + error.message);
 } finally {
  // Hide loader
  if (loader && loader.parentNode) {
   loader.parentNode.removeChild(loader);
  }
 }
}

async function updateRecord() {
 await saveRecord(true);
}

function renderCards(searchTerm = '') {
 const container = document.getElementById('entindCardsContainer');
 if (!container) return;
 container.innerHTML = '';

 const filteredData = searchTerm ? d_entInd_ata.filter(item =>
  (item.a && item.a.toString().toLowerCase().includes(searchTerm)) ||
  (item.e && item.e.toString().toLowerCase().includes(searchTerm)) ||
  (item.h && item.h.toLowerCase().includes(searchTerm)) ||
  (item.i && item.i.toLowerCase().includes(searchTerm)))
  : d_entInd_ata;

 // Hide the add new form initially
 document.getElementById('addNewWhenNotFound').classList.add('d-none');

 // Show add new form if no results and search term exists
 if (filteredData.length === 0 && searchTerm) {
  showAddNewForm();

  // Pre-fill fields based on search term
  const cleanSearchTerm = searchTerm.trim();
  const isNumeric = /^\d+$/.test(cleanSearchTerm);

  if (isNumeric) {
   document.getElementById('quickMobile').value = cleanSearchTerm.substring(0, 10);
  } else {
   const isASCII = /^[\x00-\x7F]*$/.test(cleanSearchTerm);
   if (isASCII) {
    document.getElementById('quickNameEnglish').value = cleanSearchTerm;
   } else {
    document.getElementById('quickNameLocal').value = cleanSearchTerm;
   }
  }
 }

 // Render cards for each record
 filteredData.forEach(item => {
  const card = document.createElement('div');
  card.className = 'col-md-6 mb-3';
  card.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${getGenderText(item.n)} - ${item.h} / ${item.i}</h5>
                        <small class="text-muted">ID: ${item.a}</small> ${parseFloat(item.j).toFixed(2)}
                    </div>
                    ${item.l ? `<img src="${item.l}" class="card-img-top mb-2 img-fluid" style="max-height: 100px; object-fit: contain;" onerror="this.style.display='none'">` : ''}
                    <div class="card-text">
                        <div><strong>Mobile:</strong> ${item.e}</div>
                        <div><strong>Relation:</strong> ${getRelationText(item.f)}</div>
                        ${item.m ? `<div><strong>Address:</strong> ${item.m}</div>` : ''}
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${item.a}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${item.a}">Delete</button>
                </div>
            </div>
        `;


  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
   if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('delete-btn')) {
    // Close only the current modal by ID
    if (currentModalId) {
     closeSpecificModal(currentModalId);
    }

    if (f1nEiToExe && window[f1nEiToExe]) {
     window[f1nEiToExe](item, s_ei_witchToReturn);
    }
   }
  });

  container.appendChild(card);
 });

 // Add event listeners to edit and delete buttons
 document.querySelectorAll('.edit-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
   e.stopPropagation();
   const id = e.target.getAttribute('data-id');
   const record = d_entInd_ata.find(item => item.a.toString() === id.toString());
   showAddNewForm(record);
  });
 });

 document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
   e.stopPropagation();
   const id = e.target.getAttribute('data-id');
   if (confirm('Are you sure you want to delete this record?')) {
    // Show loader using existing function
    const loader = createDynamicLoader();
    document.body.appendChild(loader);

    try {
     // Prepare payload for deletion
     payload0.c = { a: id };
     payload0.fn = 3; // Use fn=3 for delete

     var r368esponse = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 15000, 0, 1, 0);

     if (r368esponse && r368esponse.su === 1) {
      // Remove from local data
      d_entInd_ata = d_entInd_ata.filter(item => item.a !== id);
      renderCards(document.getElementById('entindSearch').value.toLowerCase());
      showToast("Record deleted successfully");
     } else {
      showToast(r368esponse?.ms || "Error deleting record");
     }
    } catch (error) {
     console.error("Error deleting record:", error);
     showToast("Error deleting record: " + error.message);
    } finally {
     // Hide loader
     if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
     }
    }
   }
  });
 });
}

function getRelationText(code) {
 const relations = {
  '1': "self [स्वतः]",
  '2': "relative 1 [नातेवाईक 1]",
  '3': "relative 2 [नातेवाईक 2]",
  '4': "relative 3 [नातेवाईक 3]",
  '5': "relative 4 [नातेवाईक 4]",
  '6': "relative 5 [नातेवाईक 5]",
  '7': "relative 6 [नातेवाईक 6]",
  '8': "relative 7 [नातेवाईक 7]",
  '9': "relative 8 [नातेवाईक 8]"
 };
 return relations[code] || 'Unknown';
}

function getGenderText(code) {
 const genders = {
  '0': "Don't know",
  '1': "Male",
  '2': "Female"
 };
 return genders[code] || 'Unknown';
}