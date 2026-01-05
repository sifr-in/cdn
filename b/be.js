// Initialize modal and other global elements
let el_modal_dvnv = null;
let btnManual = null;
let elPositiveTable = null;
let elNegativeTable = null;
let elZeroTable = null;

let lastModalState = {
 radio: 'both',
 scrollPosition: 0
};

// Copy operation constants
const COPY_LEFT_TO_RIGHT = 'left_to_right';
const COPY_RIGHT_TO_LEFT = 'right_to_left';
let currentCopyOperation = null;

// Add these validation functions
function validateAxisInput(inputId) {
 const input = document.getElementById(inputId);
 if (!input) return;

 input.addEventListener('input', function () {
  let value = parseFloat(this.value);

  // If value is NaN, clear it
  if (isNaN(value)) {
   this.value = '';
   return;
  }

  // Ensure value is between 0 and 180
  if (value < 0) {
   this.value = '0';
  } else if (value > 180) {
   this.value = '180';
  } else {
   // Keep only integers for axis
   this.value = Math.round(value);
  }
 });

 input.addEventListener('blur', function () {
  let value = parseFloat(this.value);

  // If value is NaN, clear it
  if (isNaN(value)) {
   this.value = '';
   return;
  }

  // Ensure value is between 0 and 180
  if (value < 0) {
   this.value = '0';
  } else if (value > 180) {
   this.value = '180';
  } else {
   // Keep only integers for axis
   this.value = Math.round(value);
  }
 });

 // Prevent non-numeric input
 input.addEventListener('keydown', function (e) {
  // Allow: backspace, delete, tab, escape, enter, decimal point, numbers
  if ([46, 8, 9, 27, 13, 110, 190].includes(e.keyCode) ||
   // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
   (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
   (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
   (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
   (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
   // Allow: home, end, left, right
   (e.keyCode >= 35 && e.keyCode <= 39) ||
   // Allow: numbers on keypad
   (e.keyCode >= 96 && e.keyCode <= 105)) {
   return;
  }

  // Prevent if not a number
  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
   (e.keyCode < 96 || e.keyCode > 105)) {
   e.preventDefault();
  }
 });
}
function validateVNInput(inputId) {
 const input = document.getElementById(inputId);
 if (!input) return;

 input.addEventListener('input', function () {
  let value = parseFloat(this.value);

  // If value is NaN, clear it
  if (isNaN(value)) {
   this.value = '';
   return;
  }

  // Ensure value is between 0 and 20
  if (value < 0) {
   this.value = '0';
  } else if (value > 20) {
   this.value = '20';
  } else {
   // NO decimal values for V/N - only integers
   this.value = Math.round(value);
  }
 });

 input.addEventListener('blur', function () {
  let value = parseFloat(this.value);

  // If value is NaN, clear it
  if (isNaN(value)) {
   this.value = '';
   return;
  }

  // Ensure value is between 0 and 20
  if (value < 0) {
   this.value = '0';
  } else if (value > 20) {
   this.value = '20';
  } else {
   // NO decimal values for V/N - only integers
   this.value = Math.round(value);
  }
 });

 // Prevent non-numeric input including decimal point
 input.addEventListener('keydown', function (e) {
  // Allow: backspace, delete, tab, escape, enter, numbers
  // REMOVED: 110 (decimal point on keypad), 190 (decimal point)
  if ([46, 8, 9, 27, 13].includes(e.keyCode) ||
   // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
   (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
   (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
   (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
   (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
   // Allow: home, end, left, right
   (e.keyCode >= 35 && e.keyCode <= 39) ||
   // Allow: numbers on keypad
   (e.keyCode >= 96 && e.keyCode <= 105)) {
   return;
  }

  // Prevent if not a number
  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
   (e.keyCode < 96 || e.keyCode > 105)) {
   e.preventDefault();
  }
 });
}

function validatePDInput(inputId) {
 const input = document.getElementById(inputId);
 if (!input) return;

 input.addEventListener('input', function () {
  let value = parseFloat(this.value);

  // If value is NaN, clear it
  if (isNaN(value)) {
   this.value = '';
   return;
  }

  // Ensure value is between 0 and 90
  if (value < 0) {
   this.value = '0';
  } else if (value > 90) {
   this.value = '90';
  } else {
   // NO decimal values for PD - only integers
   this.value = Math.round(value);
  }
 });

 input.addEventListener('blur', function () {
  let value = parseFloat(this.value);

  // If value is NaN, clear it
  if (isNaN(value)) {
   this.value = '';
   return;
  }

  // Ensure value is between 0 and 90
  if (value < 0) {
   this.value = '0';
  } else if (value > 90) {
   this.value = '90';
  } else {
   // NO decimal values for PD - only integers
   this.value = Math.round(value);
  }
 });

 // Prevent non-numeric input including decimal point
 input.addEventListener('keydown', function (e) {
  // Allow: backspace, delete, tab, escape, enter, numbers
  // REMOVED: 110 (decimal point on keypad), 190 (decimal point)
  if ([46, 8, 9, 27, 13].includes(e.keyCode) ||
   // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
   (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
   (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
   (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
   (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
   // Allow: home, end, left, right
   (e.keyCode >= 35 && e.keyCode <= 39) ||
   // Allow: numbers on keypad
   (e.keyCode >= 96 && e.keyCode <= 105)) {
   return;
  }

  // Prevent if not a number
  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
   (e.keyCode < 96 || e.keyCode > 105)) {
   e.preventDefault();
  }
 });
}

// Add this function to setup all validations
function setupAllValidations() {
 // Axis validations
 validateAxisInput('rDvAxis');
 validateAxisInput('rNvAxis');
 validateAxisInput('lDvAxis');
 validateAxisInput('lNvAxis');

 // V/N validations
 validateVNInput('rDvV/n');
 validateVNInput('rNvV/n');
 validateVNInput('lDvV/n');
 validateVNInput('lNvV/n');

 // PD validations
 validatePDInput('rPd');
 validatePDInput('lPd');
}
function updateManualButtonText() {
 const manualInput = document.getElementById("manual_input");
 const btnManual = document.getElementById("manual_btn");

 if (!manualInput || !btnManual) return;

 if (manualInput.value && manualInput.value.trim() !== '') {
  btnManual.textContent = "Set this";
  btnManual.classList.remove("btn-secondary");
  btnManual.classList.add("btn-primary");
 } else {
  btnManual.textContent = "Clear";
  btnManual.classList.remove("btn-primary");
  btnManual.classList.add("btn-secondary");
 }
}
async function set_be_innerHTML(...params) {
 const c_ontainer_blank_main = document.getElementById(params[0]);
 c_ontainer_blank_main.innerHTML = `
<div class="container-fluid" style="--bs-gutter-x: 0rem;">
<div class="row">
<div id="table-div-right" class="col-md-6 mb-3">
<div class="card">
<div class="card-body" style="padding: 2px;">
<button id="copyRightToLeft" class="btn btn-sm btn-outline-secondary ms-2 mb-2">Copy readings to L eye</button>
<table id="tbl_left_eye_measurements" class="table table-bordered table-sm mb-0 eye-measurement-table">
<colgroup>
<col style="width: 20%; min-width: 45px;"> <!-- Column 0: Eye label -->
<col style="width: 19%; min-width: 55px;""> <!-- Column 1: SPH -->
<col style="width: 19%; min-width: 55px;""> <!-- Column 2: CYL -->
<col style="width: 19%; min-width: 55px;""> <!-- Column 3: AXIS -->
<col style="width: 23%; min-width: 60px;"> <!-- Column 4: V/N -->
</colgroup>
<thead class="table-light">
<tr>
<th class="align-middle text-center fw-bold eye-label">
Right
</th>
<th class="text-center sph-column">SPH</th>
<th class="text-center cyl-column">CYL</th>
<th class="text-center axis-column">AXIS</th>
<th class="text-center vn-column">V/N</th>
</tr>
</thead>
<tbody>
<tr>
<td class="fw-bold text-center eye-label">DV</td>
<td class="sph-column">
<input id="rDvSph" class="form-control form-control-sm to_add" autocomplete="off" type="text" readonly tabindex="11" />
</td>
<td class="cyl-column">
<input id="rDvCyl" class="form-control form-control-sm" autocomplete="off" type="text" readonly
tabindex="12" />
</td>
<td class="axis-column">
<input id="rDvAxis" class="form-control form-control-sm axis-input" autocomplete="off" type="number" tabindex="13" min="0" max="180" step="1"/>
</td>
<td class="vn-column">
<div class="input-group input-group-sm vn-input-group">
<span class="input-group-text vn-prefix">6/</span>
<input id="rDvV/n" class="form-control vn-input" autocomplete="off" type="number" tabindex="14" min="0" max="20" step="0.1"/>
</div>
</td>
</tr>
<tr>
<td class="fw-bold text-center eye-label">NV</td>
<td class="sph-column">
<input id="rNvSph" class="form-control form-control-sm to_add" autocomplete="off" type="text" readonly
tabindex="15" />
</td>
<td class="cyl-column">
<input id="rNvCyl" class="form-control form-control-sm" autocomplete="off" type="text" readonly
tabindex="16" />
</td>
<td class="axis-column">
<input id="rNvAxis" class="form-control form-control-sm axis-input" autocomplete="off" type="number" tabindex="17" min="0" max="180" step="1"/>
</td>
<td class="vn-column">
<div class="input-group input-group-sm vn-input-group">
<span class="input-group-text vn-prefix">N/</span>
<input id="rNvV/n" class="form-control vn-input" autocomplete="off" type="number" tabindex="18" min="0" max="20" step="0.1"/>
</div>
</td>
</tr>
</tbody>
<tfoot>
<tr>
<td class="text-center fw-bold eye-label">ADD</td>
<td>
<input id="rAdd" class="form-control form-control-sm" autocomplete="off" type="text" readonly tabindex="19" />
</td>
<td class="cyl-column"></td>
<td class="axis-column"></td>
<td class="vn-column"></td>
</tr>
<tr>
<td class="text-center fw-bold eye-label">PD</td>
<td>
<input id="rPd" class="form-control form-control-sm pd-input" autocomplete="off" type="number" tabindex="20" min="0" max="90" step="0.5"/>
</td>
<td class="cyl-column"></td>
<td class="axis-column"></td>
<td class="vn-column"></td>
</tr>
<tr style="display: none">
<td></td>
<td class="text-center fw-bold">Lens-Type</td>
<td colspan="3">
<select id="rSelect" class="form-select form-select-sm lens-type"></select>
</td>
</tr>
</tfoot>
</table>
</div>
</div>
</div>

<div id="table-div-left" class="col-md-6 mb-3">
<div class="card">
<div class="card-body" style="padding: 2px;">
<button id="copyLeftToRight" class="btn btn-sm btn-outline-secondary ms-2 mb-2">Copy readings to R eye</button>
<table id="tbl_right_eye_measurements" class="table table-bordered table-sm mb-0 eye-measurement-table">
<colgroup>
<col style="width: 20%; min-width: 45px;"> <!-- Column 0: Eye label -->
<col style="width: 19%; min-width: 55px;""> <!-- Column 1: SPH -->
<col style="width: 19%; min-width: 55px;""> <!-- Column 2: CYL -->
<col style="width: 19%; min-width: 55px;""> <!-- Column 3: AXIS -->
<col style="width: 23%; min-width: 60px;"> <!-- Column 4: V/N -->
</colgroup>
<thead class="table-light">
<tr>
<th class="align-middle text-center fw-bold eye-label">
Left
</th>
<th class="text-center sph-column">SPH</th>
<th class="text-center cyl-column">CYL</th>
<th class="text-center axis-column">AXIS</th>
<th class="text-center vn-column">V/N</th>
</tr>
</thead>
<tbody>
<tr>
<td class="fw-bold text-center eye-label">DV</td>
<td class="sph-column">
<input id="lDvSph" class="form-control form-control-sm to_add" autocomplete="off" type="text" readonly tabindex="1" />
</td>
<td class="cyl-column">
<input id="lDvCyl" class="form-control form-control-sm" autocomplete="off" type="text" readonly tabindex="2" />
</td>
<td class="axis-column">
<input id="lDvAxis" class="form-control form-control-sm axis-input" autocomplete="off" type="number" tabindex="3" min="0" max="180" step="1"/>
</td>
<td class="vn-column">
<div class="input-group input-group-sm vn-input-group">
<span class="input-group-text vn-prefix">6/</span>
<input id="lDvV/n" class="form-control vn-input" autocomplete="off" type="number" tabindex="4" min="0" max="20" step="0.1"/>
</div>
</td>
</tr>
<tr>
<td class="fw-bold text-center eye-label">NV</td>
<td class="sph-column">
<input id="lNvSph" class="form-control form-control-sm to_add" autocomplete="off" type="text" readonly
tabindex="5" />
</td>
<td class="cyl-column">
<input id="lNvCyl" class="form-control form-control-sm" autocomplete="off" type="text" readonly tabindex="6" />
</td>
<td class="axis-column">
<input id="lNvAxis" class="form-control form-control-sm axis-input" autocomplete="off" type="number" tabindex="7" min="0" max="180" step="1"/>
</td>
<td class="vn-column">
<div class="input-group input-group-sm vn-input-group">
<span class="input-group-text vn-prefix">N/</span>
<input id="lNvV/n" class="form-control vn-input" autocomplete="off" type="number" tabindex="8" min="0" max="20" step="0.1"/>
</div>
</td>
</tr>
</tbody>
<tfoot>
<tr>
<td class="text-center fw-bold eye-label">ADD</td>
<td>
<input id="lAdd" class="form-control form-control-sm" autocomplete="off" type="text" readonly tabindex="9" />
</td>
<td class="cyl-column"></td>
<td class="axis-column"></td>
<td class="vn-column"></td>
</tr>
<tr>
<td class="text-center fw-bold eye-label">PD</td>
<td>
<input id="lPd" class="form-control form-control-sm pd-input" autocomplete="off" type="number" tabindex="10" min="0" max="90" step="0.5"/>
</td>
<td class="cyl-column"></td>
<td class="axis-column"></td>
<td class="vn-column"></td>
</tr>
<tr style="display: none">
<td></td>
<td class="text-center fw-bold">Lens-Type</td>
<td colspan="3">
<select id="lSelect" class="form-select form-select-sm lens-type"></select>
</td>
</tr>
</tfoot>
</table>
</div>
</div>
</div>
</div>
</div>

<style>
.eye-measurement-table {
table-layout: fixed;
width: 100%;
border-collapse: separate;
border-spacing: 0;
}

.eye-measurement-table th,
.eye-measurement-table td {
padding: 0.25rem !important;
vertical-align: middle !important;
}

.eye-measurement-table .eye-label {
font-size: 0.85rem;
padding: 0.15rem !important;
word-break: break-word;
white-space: normal;
background-color: #f8f9fa !important; /* Light gray for label column */
}

.eye-measurement-table .form-control,
.eye-measurement-table .form-control-sm {
font-size: 0.8rem !important;
padding: 0.2rem 0.3rem !important;
height: calc(1.5em + 0.4rem + 2px) !important;
width: 100% !important;
min-width: 0 !important;
}

.eye-measurement-table .input-group-sm {
min-width: 0 !important;
}

.eye-measurement-table .vn-input-group {
flex-wrap: nowrap !important;
}

.eye-measurement-table .vn-prefix {
font-size: 0.75rem !important;
padding: 0.2rem 0.1rem !important;
min-width: 20px !important;
width: auto !important;
flex: 0 0 auto !important;
}

.eye-measurement-table input[type="number"] {
min-width: 0 !important;
}

/* Column 1: SPH - Light Peach */
.eye-measurement-table .sph-column {
background-color: #ffe8e6 !important; /* Very light peach/pink */
}

.eye-measurement-table th.sph-column {
background-color: #ffb7b3 !important; /* Slightly darker peach for header */
}

/* Column 2: CYL - Light Blue */
.eye-measurement-table .cyl-column {
background-color: #e7f5ff !important; /* Very light blue */
}

.eye-measurement-table th.cyl-column {
background-color: #95d2ff !important; /* Slightly darker blue for header */
}

/* Column 3: AXIS - Light Green */
.eye-measurement-table .axis-column {
background-color: #e6f7ef !important; /* Very light green */
}

.eye-measurement-table th.axis-column {
background-color: #8fffcf !important; /* Slightly darker green for header */
}

/* Column 4: V/N - Light Yellow */
.eye-measurement-table .vn-column {
background-color: #fff9e6 !important; /* Very light yellow */
}

.eye-measurement-table th.vn-column {
background-color: #ffe89e !important; /* Slightly darker yellow for header */
}

/* Default for other cells */
.eye-measurement-table th:not(.eye-label):not(.sph-column):not(.cyl-column):not(.axis-column):not(.vn-column),
.eye-measurement-table td:not(.eye-label):not(.sph-column):not(.cyl-column):not(.axis-column):not(.vn-column) {
background-color: #ffffff !important;
}

/* Validation styling */
.eye-measurement-table .axis-input:invalid,
.eye-measurement-table .vn-input:invalid,
.eye-measurement-table .pd-input:invalid {
border-color: #dc3545;
box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

@media (max-width: 768px) {
.eye-measurement-table .eye-label {
font-size: 0.75rem;
}

.eye-measurement-table .form-control,
.eye-measurement-table .form-control-sm {
font-size: 0.75rem !important;
padding: 0.15rem 0.2rem !important;
}

.eye-measurement-table .vn-prefix {
font-size: 0.7rem !important;
padding: 0.15rem 0.05rem !important;
min-width: 18px !important;
}
}
</style>

<div id="copyConfirmModal" class="modal fade" tabindex="-1">
<div class="modal-dialog modal-sm">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title">Confirm Copy</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
</div>
<div class="modal-body">
<p id="copyModalMessage">The target eye already has measurements. Do you want to overwrite?</p>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
<button type="button" class="btn btn-primary" id="confirmCopyYes">Yes, Overwrite</button>
</div>
</div>
</div>
</div>

<div id="modal_dvnv" class="modal fade" tabindex="-1">
<div class="modal-dialog modal-lg">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title">Enter Measurement</h5>
<button type="button" class="btn-close" id="close_dvnv"></button>
</div>
<div class="modal-body">
<div id="manual_div" class="input-group mb-3">
<input id="manual_input" class="form-control" type="number" placeholder="Enter Manually" step="0.25" />
<button id="manual_btn" class="btn btn-primary">Enter</button>
</div>

<div class="row text-center mb-3">
<div class="col-3">
<div class="form-check p-0" style="background: aquamarine;">
<input id="positive" class="form-check-input t_radio d-none" type="radio" name="t_radio" />
<label class="form-check-label btn btn-outline-primary w-100" for="positive" style="cursor: pointer;">
Plus
</label>
</div>
</div>
<div class="col-3">
<div class="form-check p-0" style="background: lightpink;">
<input id="negative" class="form-check-input t_radio d-none" type="radio" name="t_radio" />
<label class="form-check-label btn btn-outline-primary w-100" for="negative" style="cursor: pointer;">
Minus
</label>
</div>
</div>
<div class="col-3">
<div class="form-check p-0" style="background: aqua;">
<input id="both" class="form-check-input t_radio d-none" type="radio" name="t_radio" checked />
<label class="form-check-label btn btn-outline-primary w-100" for="both" style="cursor: pointer;">
Both
</label>
</div>
</div>
<div class="col-3">
<div class="form-check p-0">
<input id="zero" class="form-check-input t_radio d-none" type="radio" name="t_radio" />
<label class="form-check-label btn btn-outline-primary w-100" for="zero" style="cursor: pointer;">
Plain
</label>
</div>
</div>
</div>

<div id="modal_dvnv_table_div" class="table-responsive" style="max-height: 85vh;overflow-y: auto;">
<table id="dvnv_table_negative" class="modal_dvnv_table table table-bordered table-sm mb-0">
${generateNegativeTable()}
</table>

<!-- Fix 1: Zero as a separator bar between negative and positive -->
<div class="zero-separator bg-light border border-secondary text-center py-2 my-2">
<span class="fw-bold fs-5">0.00</span>
</div>

<table id="dvnv_table_positive" class="modal_dvnv_table table table-bordered table-sm mt-0">
${generatePositiveTable()}
</table>

<!-- Hidden zero table for zero radio selection -->
<table id="dvnv_table_zero" class="modal_dvnv_table table table-bordered table-sm d-none">
<tr>
<td class="table-success text-center fw-bold" colspan="4" style="cursor: pointer;">0.00</td>
</tr>
</table>
</div>
</div>
</div>
</div>
</div>
`;

 // Initialize modal and other global elements
 el_modal_dvnv = new bootstrap.Modal(document.getElementById('modal_dvnv'));
 btnManual = document.getElementById("manual_btn");
 const manualInput = document.getElementById("manual_input");

 // Initial update
 updateManualButtonText();

 // Update on input change
 manualInput.addEventListener('input', updateManualButtonText);

 // Update when modal is shown (in case input was pre-filled)
 const modalElement = document.getElementById('modal_dvnv');
 if (modalElement) {
  modalElement.addEventListener('shown.bs.modal', updateManualButtonText);
 }

 elPositiveTable = document.getElementById("dvnv_table_positive");
 elNegativeTable = document.getElementById("dvnv_table_negative");
 elZeroTable = document.getElementById("dvnv_table_zero");

 let decide = 0;
 let eyeMeasurementInfocus = 0;

 // Add event listeners
 setupEventListeners();
 setupKeyboardNavigation();
 setupCopyFunctionality();
 setupAllValidations(); // Add this line to set up all validations
}

// Helper function to generate negative table rows
function generateNegativeTable() {
 let html = '';
 for (let i = 0.25; i <= 19.25; i += 1.0) {
  if (i % 1 === 0.25) {
   html += '<tr>';
   for (let j = 0; j < 4; j++) {
    const value = (i + j * 0.25).toFixed(2);
    html += `<td class="p-2" style="cursor: pointer;" tabindex="0">-${value}</td>`;
   }
   html += '</tr>';
  }
 }
 return html;
}

// Helper function to generate positive table rows
function generatePositiveTable() {
 let html = '';
 for (let i = 0.25; i <= 19.25; i += 1.0) {
  if (i % 1 === 0.25) {
   html += '<tr>';
   for (let j = 0; j < 4; j++) {
    const value = (i + j * 0.25).toFixed(2);
    html += `<td class="p-2" style="cursor: pointer;" tabindex="0">+${value}</td>`;
   }
   html += '</tr>';
  }
 }
 return html;
}

// Function to check if a table has any values
function hasValues(tableId) {
 const table = document.getElementById(tableId);
 const inputs = table.querySelectorAll('input[type="text"]');

 for (let input of inputs) {
  if (input.value && input.value.trim() !== '') {
   return true;
  }
 }
 return false;
}

// Function to copy measurements
function copyMeasurements(direction) {
 const copyConfirmModal = new bootstrap.Modal(document.getElementById('copyConfirmModal'));

 // Check if source has any values
 const sourceTable = direction === COPY_LEFT_TO_RIGHT ? 'tbl_right_eye_measurements' : 'tbl_left_eye_measurements';
 if (!hasValues(sourceTable)) {
  document.getElementById('copyModalMessage').textContent = 'Nothing to copy - all fields are empty.';
  document.getElementById('confirmCopyYes').style.display = 'none';
  copyConfirmModal.show();
  return;
 }

 // Check if target has any values
 const targetTable = direction === COPY_LEFT_TO_RIGHT ? 'tbl_left_eye_measurements' : 'tbl_right_eye_measurements';
 if (hasValues(targetTable)) {
  document.getElementById('copyModalMessage').textContent = 'The target eye already has measurements. Do you want to overwrite?';
  document.getElementById('confirmCopyYes').style.display = 'inline-block';
  currentCopyOperation = direction;
  copyConfirmModal.show();
  return;
 }

 // If target is empty, proceed with copy
 performCopy(direction);
}

// Function to actually perform the copy
function performCopy(direction) {
 if (direction === COPY_LEFT_TO_RIGHT) {
  // Copy left to right
  document.getElementById("rDvSph").value = document.getElementById("lDvSph").value;
  document.getElementById("rDvCyl").value = document.getElementById("lDvCyl").value;
  document.getElementById("rDvAxis").value = document.getElementById("lDvAxis").value;
  document.getElementById("rDvV/n").value = document.getElementById("lDvV/n").value;
  document.getElementById("rNvSph").value = document.getElementById("lNvSph").value;
  document.getElementById("rNvCyl").value = document.getElementById("lNvCyl").value;
  document.getElementById("rNvAxis").value = document.getElementById("lNvAxis").value;
  document.getElementById("rNvV/n").value = document.getElementById("lNvV/n").value;
  document.getElementById("rAdd").value = document.getElementById("lAdd").value;
  document.getElementById("rPd").value = document.getElementById("lPd").value;

  // Trigger calculations
  document.getElementById("rDvSph").dispatchEvent(new Event('input'));
  document.getElementById("rNvSph").dispatchEvent(new Event('input'));
 } else {
  // Copy right to left
  document.getElementById("lDvSph").value = document.getElementById("rDvSph").value;
  document.getElementById("lDvCyl").value = document.getElementById("rDvCyl").value;
  document.getElementById("lDvAxis").value = document.getElementById("rDvAxis").value;
  document.getElementById("lDvV/n").value = document.getElementById("rDvV/n").value;
  document.getElementById("lNvSph").value = document.getElementById("rNvSph").value;
  document.getElementById("lNvCyl").value = document.getElementById("rNvCyl").value;
  document.getElementById("lNvAxis").value = document.getElementById("rNvAxis").value;
  document.getElementById("lNvV/n").value = document.getElementById("rNvV/n").value;
  document.getElementById("lAdd").value = document.getElementById("rAdd").value;
  document.getElementById("lPd").value = document.getElementById("rPd").value;

  // Trigger calculations
  document.getElementById("lDvSph").dispatchEvent(new Event('input'));
  document.getElementById("lNvSph").dispatchEvent(new Event('input'));
 }

 // Mark that eye measurements have been touched
 // eyeMeasurementTouched = 1; // Uncomment if you have this variable defined elsewhere
}

function setupCopyFunctionality() {
 // Add event listeners for copy buttons
 document.getElementById('copyLeftToRight').addEventListener('click', function () {
  copyMeasurements(COPY_LEFT_TO_RIGHT);
 });

 document.getElementById('copyRightToLeft').addEventListener('click', function () {
  copyMeasurements(COPY_RIGHT_TO_LEFT);
 });

 // Add event listener for confirmation modal
 document.getElementById('confirmCopyYes').addEventListener('click', function () {
  if (currentCopyOperation) {
   performCopy(currentCopyOperation);
   const copyConfirmModal = bootstrap.Modal.getInstance(document.getElementById('copyConfirmModal'));
   copyConfirmModal.hide();
   currentCopyOperation = null;
  }
 });
}

function setupEventListeners() {
 const el_modal_dvnv_element = document.getElementById('modal_dvnv');
 const modalBody = document.querySelector('#modal_dvnv .modal-body');

 // Fix 1: Add event listener for close button
 document.getElementById("close_dvnv").addEventListener("click", function () {
  el_modal_dvnv.hide();
 });

 el_modal_dvnv_element.addEventListener('shown.bs.modal', function () {
  // Apply last state ONLY if it's not 'zero'
  if (lastModalState.radio !== 'zero') {
   const radioToCheck = document.getElementById(lastModalState.radio);
   if (radioToCheck) {
    radioToCheck.checked = true;
    radioToCheck.dispatchEvent(new Event('change', { bubbles: true }));
   }
  } else {
   // If last state was zero, default to 'both'
   document.getElementById('both').checked = true;
   document.getElementById('both').dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Restore scroll position after a short delay
  setTimeout(() => {
   if (modalBody) {
    modalBody.scrollTop = lastModalState.scrollPosition;
   }
  }, 50);
 });
 el_modal_dvnv_element.addEventListener('hide.bs.modal', function () {
  // Save current radio state
  const checkedRadio = document.querySelector('input[name="t_radio"]:checked');
  if (checkedRadio) {
   lastModalState.radio = checkedRadio.id;
  }

  // Save scroll position
  if (modalBody) {
   lastModalState.scrollPosition = modalBody.scrollTop;
  }
 });

 document.getElementById("lDvSph").addEventListener("click", function () {
  decide = 1;
  el_modal_dvnv.show();
  eyeMeasurementInfocus = 1;
 });

 document.getElementById("lDvSph").addEventListener("blur", function () {
  chkLeftNearToCopy();
 });

 document.getElementById("lDvCyl").addEventListener("focus", function () {
  if (decide == 9) {
   chkRightAddition();
  } else if (decide == 10) {
   chkLeftAddition();
  }
 });

 document.getElementById("lDvCyl").addEventListener("blur", function () {
  chkLeftNearToCopy();
 });

 document.getElementById("lNvSph").addEventListener("blur", function () {
  chkLeftNearToCopy();
 });

 document.getElementById("lNvCyl").addEventListener("blur", function () {
  chkLeftNearToCopy();
 });

 document.getElementById("lDvAxis").addEventListener("blur", function () {
  chkLeftNearToCopy();
  validateAxisInputOnBlur(this);
 });

 document.getElementById("lNvAxis").addEventListener("blur", function () {
  chkLeftNearToCopy();
  validateAxisInputOnBlur(this);
 });

 document.getElementById("lAdd").addEventListener("blur", function () {
  // chkLeftNearToCopy();
 });

 document.getElementById("lDvAxis").addEventListener("focus", function () {
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 document.getElementById("lDvV/n").addEventListener("focus", function () {
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 document.getElementById("lNvAxis").addEventListener("focus", function () {
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 document.getElementById("lNvV/n").addEventListener("focus", function () {
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 document.getElementById("lPd").addEventListener("focus", function () {
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 document.getElementById("lDvCyl").addEventListener("click", function () {
  decide = 2;
  el_modal_dvnv.show();
  eyeMeasurementInfocus = 1;
 });

 document.getElementById("lNvSph").addEventListener("click", function () {
  decide = 3;
  el_modal_dvnv.show();
  eyeMeasurementInfocus = 1;
 });

 document.getElementById("lNvCyl").addEventListener("click", function () {
  decide = 4;
  el_modal_dvnv.show();
  eyeMeasurementInfocus = 1;
 });

 document.getElementById("rDvSph").addEventListener("click", function () {
  document.getElementById("both").click();
  decide = 5;
  el_modal_dvnv.show();
  eyeMeasurementInfocus = 1;
 });

 document.getElementById("rDvSph").addEventListener("blur", function () {
  chkRightNearToCopy();
 });

 document.getElementById("rDvCyl").addEventListener("focus", function () {
  if (decide == 9) {
   chkRightAddition();
  } else if (decide == 10) {
   chkLeftAddition();
  }
 });

 document.getElementById("rDvCyl").addEventListener("blur", function () {
  chkRightNearToCopy();
 });

 document.getElementById("rNvSph").addEventListener("blur", function () {
  chkRightNearToCopy();
 });

 document.getElementById("rNvCyl").addEventListener("blur", function () {
  chkRightNearToCopy();
 });

 document.getElementById("rDvAxis").addEventListener("blur", function () {
  chkRightNearToCopy();
  validateAxisInputOnBlur(this);
 });

 document.getElementById("rNvAxis").addEventListener("blur", function () {
  chkRightNearToCopy();
  validateAxisInputOnBlur(this);
 });

 document.getElementById("rAdd").addEventListener("blur", function () {
  // chkRightNearToCopy();
 });

 document.getElementById("rDvAxis").addEventListener("focus", function () {
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 document.getElementById("rDvV/n").addEventListener("focus", function () {
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 document.getElementById("rNvAxis").addEventListener("focus", function () {
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 document.getElementById("rNvV/n").addEventListener("focus", function () {
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 document.getElementById("rPd").addEventListener("focus", function () {
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 document.getElementById("rDvCyl").addEventListener("click", function () {
  document.getElementById("both").click();
  decide = 6;
  el_modal_dvnv.show();
  eyeMeasurementInfocus = 1;
 });

 document.getElementById("both").addEventListener("click", function () {
  triggerRadioBoth();
 });

 document.getElementById("zero").addEventListener("change", function () {
  if (this.checked) {
   // Instead of showing the table, directly set 0.00 based on current 'decide' value
   if (decide == 1) {
    document.getElementById("lDvSph").value = "0.00";
    chkLeftNearToCopy();
    document.getElementById("lDvCyl").focus();
    decide = 2;
    document.getElementById("lDvSph").dispatchEvent(new Event("input"));
   } else if (decide == 2) {
    document.getElementById("lDvCyl").value = "0.00";
    chkLeftNearToCopy();
    document.getElementById("lDvAxis").focus();
   } else if (decide == 3) {
    document.getElementById("lNvSph").value = "0.00";
    chkLeftNearToCopy();
    document.getElementById("lNvCyl").focus();
    decide = 4;
    document.getElementById("lNvSph").dispatchEvent(new Event("input"));
   } else if (decide == 4) {
    document.getElementById("lNvCyl").value = "0.00";
    document.getElementById("lNvAxis").focus();
   } else if (decide == 5) {
    document.getElementById("rDvSph").value = "0.00";
    chkRightNearToCopy();
    document.getElementById("rDvCyl").focus();
    decide = 6;
    document.getElementById("rDvSph").dispatchEvent(new Event("input"));
   } else if (decide == 6) {
    document.getElementById("rDvCyl").value = "0.00";
    chkRightNearToCopy();
    document.getElementById("rDvAxis").focus();
   } else if (decide == 7) {
    document.getElementById("rNvSph").value = "0.00";
    chkRightNearToCopy();
    document.getElementById("rNvCyl").focus();
    decide = 8;
    document.getElementById("rNvSph").dispatchEvent(new Event("input"));
   } else if (decide == 8) {
    document.getElementById("rNvCyl").value = "0.00";
    document.getElementById("rNvAxis").focus();
   } else if (decide == 9) {
    document.getElementById("rAdd").value = "0.00";
    document.getElementById("rDvCyl").focus();
   } else if (decide == 10) {
    document.getElementById("lAdd").value = "0.00";
    document.getElementById("lDvCyl").focus();
   }

   // Hide the modal immediately
   el_modal_dvnv.hide();
   eyeMeasurementInfocus = 0;
  }
 });

 document.getElementById("rNvSph").addEventListener("click", function () {
  decide = 7;
  el_modal_dvnv.show();
  eyeMeasurementInfocus = 1;
 });

 document.getElementById("rNvCyl").addEventListener("click", function () {
  decide = 8;
  el_modal_dvnv.show();
  eyeMeasurementInfocus = 1;
 });

 document.getElementById("rAdd").addEventListener("click", function () {
  decide = 9;
  el_modal_dvnv.show();
  eyeMeasurementInfocus = 1;
 });

 document.getElementById("lAdd").addEventListener("click", function () {
  decide = 10;
  el_modal_dvnv.show();
  eyeMeasurementInfocus = 1;
 });

 // Add validation for V/N fields
 document.getElementById("lDvV/n").addEventListener("blur", function () {
  validateVNInputOnBlur(this);
 });

 document.getElementById("lNvV/n").addEventListener("blur", function () {
  validateVNInputOnBlur(this);
 });

 document.getElementById("rDvV/n").addEventListener("blur", function () {
  validateVNInputOnBlur(this);
 });

 document.getElementById("rNvV/n").addEventListener("blur", function () {
  validateVNInputOnBlur(this);
 });

 // Add validation for PD fields
 document.getElementById("lPd").addEventListener("blur", function () {
  validatePDInputOnBlur(this);
 });

 document.getElementById("rPd").addEventListener("blur", function () {
  validatePDInputOnBlur(this);
 });

 Array.from(document.getElementsByClassName("to_add")).forEach(
  (element) => {
   element.addEventListener("input", (event) => {
    var t404 =
     Number(document.getElementById("lDvSph").value || 0) +
     Number(document.getElementById("lNvSph").value || 0).toFixed(2) *
     -1;
    if (t404 < 1) t404 = t404 * -1;
    if (
     document.getElementById("lDvSph").value.length > 0 &&
     document.getElementById("lNvSph").value.length > 0
    )
     if (t404 > 0)
      document.getElementById("lAdd").value = "+" + t404.toFixed(2);
     else
      document.getElementById("lAdd").value =
       "+" + (t404 * -1).toFixed(2);

    var t329 =
     Number(document.getElementById("rDvSph").value || 0) +
     Number(document.getElementById("rNvSph").value || 0).toFixed(2) *
     -1;
    if (t329 < 1) t329 = t329 * -1;
    if (
     document.getElementById("rDvSph").value.length > 0 &&
     document.getElementById("rNvSph").value.length > 0
    )
     if (t329 > 0)
      document.getElementById("rAdd").value = "+" + t329.toFixed(2);
     else
      document.getElementById("rAdd").value =
       "+" + (t329 * -1).toFixed(2);
   });
  }
 );

 Array.from(document.getElementsByClassName("t_radio")).forEach(
  (element) => {
   element.addEventListener("change", (event) => {
    if (event.target.id == "positive") {
     // Show only positive table
     elPositiveTable.classList.remove("d-none");
     elNegativeTable.classList.add("d-none");
     elZeroTable.classList.add("d-none");
     document.querySelector('.zero-separator').classList.add('d-none');

     // Scroll to top of positive table
     setTimeout(() => {
      if (modalBody && elPositiveTable) {
       modalBody.scrollTo({
        top: 0,
        behavior: 'smooth'
       });
      }
     }, 50);

    } else if (event.target.id == "negative") {
     // Show only negative table
     elPositiveTable.classList.add("d-none");
     elNegativeTable.classList.remove("d-none");
     elZeroTable.classList.add("d-none");
     document.querySelector('.zero-separator').classList.add('d-none');

     // Scroll to top of negative table
     setTimeout(() => {
      if (modalBody && elNegativeTable) {
       modalBody.scrollTo({
        top: 0,
        behavior: 'smooth'
       });
      }
     }, 50);

    } else if (event.target.id == "both") {
     // Show both tables with separator
     elPositiveTable.classList.remove("d-none");
     elNegativeTable.classList.remove("d-none");
     elZeroTable.classList.add("d-none");
     document.querySelector('.zero-separator').classList.remove('d-none');

     // Scroll to zero separator (middle)
     setTimeout(() => {
      const zeroSeparator = document.querySelector('.zero-separator');
      if (modalBody && zeroSeparator) {
       const separatorRect = zeroSeparator.getBoundingClientRect();
       const modalBodyRect = modalBody.getBoundingClientRect();
       const scrollPosition = zeroSeparator.offsetTop - modalBody.offsetTop - (modalBody.clientHeight / 2) + (separatorRect.height / 2);

       modalBody.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
       });
      }
     }, 50);

    } else if (event.target.id == "zero") {
     // Show only zero table
     //  elPositiveTable.classList.add("d-none");
     //  elNegativeTable.classList.add("d-none");
     //  elZeroTable.classList.remove("d-none");
     //  document.querySelector('.zero-separator').classList.add('d-none');

     //  // Scroll to top of zero table
     //  setTimeout(() => {
     //   if (modalBody && elZeroTable) {
     //   modalBody.scrollTo({
     //     top: 0,
     //     behavior: 'smooth'
     //   });
     //   }
     //  }, 50);
    }
   });
  }
 );

 // Fix 2: Prevent scroll to top when clicking on table cells
 Array.from(document.getElementsByClassName("modal_dvnv_table")).forEach(
  (element) => {
   element.addEventListener("click", (event) => {
    if (event.target.tagName == "TD") {
     const cellValue = event.target.textContent.trim();

     event.target.classList.add("bg-warning");

     // Store current scroll position
     const currentScroll = modalBody.scrollTop;

     if (decide == 1) {
      document.getElementById("lDvSph").value = cellValue;
      chkLeftNearToCopy();
      document.getElementById("lDvCyl").focus();
      decide = 2;
      document.getElementById("lDvSph").dispatchEvent(new Event("input"));
     } else if (decide == 2) {
      document.getElementById("lDvCyl").value = cellValue;
      chkLeftNearToCopy();
      document.getElementById("lDvAxis").focus();
     } else if (decide == 3) {
      document.getElementById("lNvSph").value = cellValue;
      chkLeftNearToCopy();
      document.getElementById("lNvCyl").focus();
      decide = 4;
      document.getElementById("lNvSph").dispatchEvent(new Event("input"));
     } else if (decide == 4) {
      document.getElementById("lNvCyl").value = cellValue;
     } else if (decide == 5) {
      document.getElementById("rDvSph").value = cellValue;
      chkRightNearToCopy();
      document.getElementById("rDvCyl").focus();
      decide = 6;
      document.getElementById("rDvSph").dispatchEvent(new Event("input"));
     } else if (decide == 6) {
      document.getElementById("rDvCyl").value = cellValue;
      chkRightNearToCopy();
      document.getElementById("rDvAxis").focus();
     } else if (decide == 7) {
      document.getElementById("rNvSph").value = cellValue;
      chkRightNearToCopy();
      document.getElementById("rNvCyl").focus();
      decide = 8;
      document.getElementById("rNvSph").dispatchEvent(new Event("input"));
     } else if (decide == 8) {
      document.getElementById("rNvCyl").value = cellValue;
     } else if (decide == 9) {
      document.getElementById("rAdd").value = cellValue;
      document.getElementById("rDvCyl").focus();
     } else if (decide == 10) {
      document.getElementById("lAdd").value = cellValue;
      document.getElementById("lDvCyl").focus();
     }

     // Restore scroll position after click
     setTimeout(() => {
      modalBody.scrollTop = currentScroll;
     }, 10);

     // Hide modal after selection
     setTimeout(() => {
      el_modal_dvnv.hide();
      eyeMeasurementInfocus = 0;
     }, 50);
    }
   });
  }
 );

 document.querySelectorAll("#table-div-left input, #table-div-right input").forEach((input) => {
  input.addEventListener("focus", function () {
   document.querySelectorAll(".border-primary").forEach((cell) => {
    cell.classList.remove("border-primary");
   });
   this.classList.add("border-primary");
  });

  input.addEventListener("blur", function () {
   this.classList.remove("border-primary");
  });
 });

 document.getElementById("manual_btn").addEventListener("click", function (e) {
  e.preventDefault();
  const manualInput = document.getElementById("manual_input");
  var mValue = document.getElementById("manual_input").value;

  // If button says "Clear", clear the input of clicked element and close dialog
  if (btnManual.textContent === "Clear") {
   // Clear the clicked element based on 'decide' value
   if (decide == 1) {
    document.getElementById("lDvSph").value = '';
   } else if (decide == 2) {
    document.getElementById("lDvCyl").value = '';
   } else if (decide == 3) {
    document.getElementById("lNvSph").value = '';
   } else if (decide == 4) {
    document.getElementById("lNvCyl").value = '';
   } else if (decide == 5) {
    document.getElementById("rDvSph").value = '';
   } else if (decide == 6) {
    document.getElementById("rDvCyl").value = '';
   } else if (decide == 7) {
    document.getElementById("rNvSph").value = '';
   } else if (decide == 8) {
    document.getElementById("rNvCyl").value = '';
   }

   // Also clear the manual input field
   manualInput.value = '';

   // Close the modal
   el_modal_dvnv.hide();
   eyeMeasurementInfocus = 0;

   // Update button text (though modal will close)
   updateManualButtonText();
   return;
  }

  // Otherwise, set the values based on decide (original logic)
  if (decide == 1) {
   document.getElementById("lDvSph").value = mValue;
  } else if (decide == 2) {
   document.getElementById("lDvCyl").value = mValue;
  } else if (decide == 3) {
   document.getElementById("lNvSph").value = mValue;
  } else if (decide == 4) {
   document.getElementById("lNvCyl").value = mValue;
  } else if (decide == 5) {
   document.getElementById("rDvSph").value = mValue;
  } else if (decide == 6) {
   document.getElementById("rDvCyl").value = mValue;
  } else if (decide == 7) {
   document.getElementById("rNvSph").value = mValue;
  } else if (decide == 8) {
   document.getElementById("rNvCyl").value = mValue;
  }

  // Clear the manual input and update button
  manualInput.value = '';
  updateManualButtonText();
  el_modal_dvnv.hide();
  eyeMeasurementInfocus = 0;
 });

 // Helper functions
 function chkLeftNearToCopy() {
  if (
   document.getElementById("lDvSph").value.length > 0 &&
   document.getElementById("lNvSph").value.length > 0
  ) {
   if (document.getElementById("lNvAxis").value.length == 0)
    document.getElementById("lNvAxis").value =
     document.getElementById("lDvAxis").value;
   if (document.getElementById("lNvCyl").value.length == 0)
    document.getElementById("lNvCyl").value =
     document.getElementById("lDvCyl").value;
  } else {
   document.getElementById("lNvAxis").value = "";
   document.getElementById("lNvCyl").value = "";
  }
 }

 function chkRightNearToCopy() {
  if (
   document.getElementById("rDvSph").value.length > 0 &&
   document.getElementById("rNvSph").value.length > 0
  ) {
   if (document.getElementById("rNvAxis").value.length == 0)
    document.getElementById("rNvAxis").value =
     document.getElementById("rDvAxis").value;
   if (document.getElementById("rNvCyl").value.length == 0)
    document.getElementById("rNvCyl").value =
     document.getElementById("rDvCyl").value;
  } else {
   document.getElementById("rNvAxis").value = "";
   document.getElementById("rNvCyl").value = "";
  }
 }

 function chkRightAddition() {
  if (
   document.getElementById("rDvSph").value.length > 0 &&
   document.getElementById("rAdd").value.length > 0
  ) {
   var t4364 =
    Number(document.getElementById("rDvSph").value) +
    Number(document.getElementById("rAdd").value);
   if (t4364 > 0)
    document.getElementById("rNvSph").value = "+" + t4364.toFixed(2);
   else document.getElementById("rNvSph").value = t4364.toFixed(2);
  } else if (
   document.getElementById("rNvSph").value.length > 0 &&
   document.getElementById("rAdd").value.length > 0
  ) {
   var t4364 =
    Number(document.getElementById("rNvSph").value) -
    Number(document.getElementById("rAdd").value);
   if (t4364 > 0)
    document.getElementById("rDvSph").value = "+" + t4364.toFixed(2);
   else document.getElementById("rDvSph").value = t4364.toFixed(2);
  }
 }

 function chkLeftAddition() {
  if (
   document.getElementById("lDvSph").value.length > 0 &&
   document.getElementById("lAdd").value.length > 0
  ) {
   var t4364 =
    Number(document.getElementById("lAdd").value) +
    Number(document.getElementById("lDvSph").value);
   if (t4364 > 0)
    document.getElementById("lNvSph").value = "+" + t4364.toFixed(2);
   else document.getElementById("lNvSph").value = t4364.toFixed(2);
  } else if (
   document.getElementById("lNvSph").value.length > 0 &&
   document.getElementById("lAdd").value.length > 0
  ) {
   var t4364 =
    Number(document.getElementById("lAdd").value) -
    Number(document.getElementById("lNvSph").value);
   if (t4364 > 0)
    document.getElementById("lDvSph").value = "+" + t4364.toFixed(2);
   else document.getElementById("lDvSph").value = t4364.toFixed(2);
  }
 }

 function triggerRadioBoth() {
  // Initially hide all tables when modal opens
  elPositiveTable.classList.add("d-none");
  elNegativeTable.classList.add("d-none");
  elZeroTable.classList.add("d-none");
  document.querySelector('.zero-separator').classList.add('d-none');
 }
 function closeAllDivs() {
  // This function is no longer used for hiding tables, only for radio-specific logic
  document.querySelector('.zero-separator').classList.add('d-none');
  elZeroTable.classList.remove("d-none");
 }
}

// Add these validation helper functions
function validateAxisInputOnBlur(inputElement) {
 let value = parseFloat(inputElement.value);

 // If value is NaN, clear it
 if (isNaN(value)) {
  inputElement.value = '';
  return;
 }

 // Ensure value is between 0 and 180
 if (value < 0) {
  inputElement.value = '0';
 } else if (value > 180) {
  inputElement.value = '180';
 } else {
  // Keep only integers for axis
  inputElement.value = Math.round(value);
 }
}
function validateVNInputOnBlur(inputElement) {
 let value = parseFloat(inputElement.value);

 // If value is NaN, clear it
 if (isNaN(value)) {
  inputElement.value = '';
  return;
 }

 // Ensure value is between 0 and 20
 if (value < 0) {
  inputElement.value = '0';
 } else if (value > 20) {
  inputElement.value = '20';
 } else {
  // NO decimal values for V/N - only integers
  inputElement.value = Math.round(value);
 }
}

function validatePDInputOnBlur(inputElement) {
 let value = parseFloat(inputElement.value);

 // If value is NaN, clear it
 if (isNaN(value)) {
  inputElement.value = '';
  return;
 }

 // Ensure value is between 0 and 90
 if (value < 0) {
  inputElement.value = '0';
 } else if (value > 90) {
  inputElement.value = '90';
 } else {
  // NO decimal values for PD - only integers
  inputElement.value = Math.round(value);
 }
}
function getEyeMeasurement() {
 const eye_msrmnt = {};

 // Right Eye
 eye_msrmnt.ra = document.getElementById("rDvSph").value;
 eye_msrmnt.rb = document.getElementById("rDvCyl").value;
 eye_msrmnt.rc = document.getElementById("rDvAxis").value;
 eye_msrmnt.rd = document.getElementById("rDvV/n").value;
 eye_msrmnt.re = document.getElementById("rNvSph").value;
 eye_msrmnt.rf = document.getElementById("rNvCyl").value;
 eye_msrmnt.rg = document.getElementById("rNvAxis").value;
 eye_msrmnt.rh = document.getElementById("rNvV/n").value;
 eye_msrmnt.ri = document.getElementById("rAdd").value;
 eye_msrmnt.rj = 0;
 eye_msrmnt.rk = document.getElementById("rPd").value;

 // Left Eye
 eye_msrmnt.la = document.getElementById("lDvSph").value;
 eye_msrmnt.lb = document.getElementById("lDvCyl").value;
 eye_msrmnt.lc = document.getElementById("lDvAxis").value;
 eye_msrmnt.ld = document.getElementById("lDvV/n").value;
 eye_msrmnt.le = document.getElementById("lNvSph").value;
 eye_msrmnt.lf = document.getElementById("lNvCyl").value;
 eye_msrmnt.lg = document.getElementById("lNvAxis").value;
 eye_msrmnt.lh = document.getElementById("lNvV/n").value;
 eye_msrmnt.li = document.getElementById("lAdd").value;
 eye_msrmnt.lj = 0;
 eye_msrmnt.lk = document.getElementById("lPd").value;

 // Check if all measurement fields are empty
 const measurementFields = [
  'ra', 'rb', 'rc', 'rd', 're', 'rf', 'rg', 'rh', 'ri', 'rk',
  'la', 'lb', 'lc', 'ld', 'le', 'lf', 'lg', 'lh', 'li', 'lk'
 ];

 const hasData = measurementFields.some(field => {
  const value = eye_msrmnt[field];
  return value !== undefined && value !== null && value.toString().trim() !== '';
 });

 // Return null if all measurement fields are empty (except ef which is from id_op_rfrr)
 return hasData ? eye_msrmnt : null;
}
function setEyeMeasurement(eyeMsrments) {
 if (!eyeMsrments) return;

 function setElementValue(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
   if (element.tagName === 'INPUT') {
    element.value = value;
   } else {
    const numValue = parseFloat(value);

    // Handle specific prefixes for V/n elements
    if (elementId === "rDvV/n" || elementId === "lDvV/n") {
     // Remove positive/negative sign and prefix with "6/"
     const absoluteValue = Math.abs(numValue);
     if (!isNaN(absoluteValue) && absoluteValue > 0) {
      element.innerText = '6/' + absoluteValue;
     } else {
      element.innerText = value;
     }
    } else if (elementId === "rNvV/n" || elementId === "lNvV/n") {
     // Remove positive/negative sign and prefix with "N/"
     const absoluteValue = Math.abs(numValue);
     if (!isNaN(absoluteValue) && absoluteValue > 0) {
      element.innerText = 'N/' + absoluteValue;
     } else {
      element.innerText = value;
     }
    } else {
     // Original logic for other elements
     if (!isNaN(numValue) && numValue > 0) {
      element.innerText = '+' + value;
     } else {
      element.innerText = value;
     }
    }
   }
  }
 }

 // Right Eye
 if (eyeMsrments.ra !== undefined) setElementValue("rDvSph", eyeMsrments.ra);
 if (eyeMsrments.rb !== undefined) setElementValue("rDvCyl", eyeMsrments.rb);
 if (eyeMsrments.rc !== undefined) setElementValue("rDvAxis", eyeMsrments.rc);
 if (eyeMsrments.rd !== undefined) setElementValue("rDvV/n", eyeMsrments.rd);
 if (eyeMsrments.re !== undefined) setElementValue("rNvSph", eyeMsrments.re);
 if (eyeMsrments.rf !== undefined) setElementValue("rNvCyl", eyeMsrments.rf);
 if (eyeMsrments.rg !== undefined) setElementValue("rNvAxis", eyeMsrments.rg);
 if (eyeMsrments.rh !== undefined) setElementValue("rNvV/n", eyeMsrments.rh);
 if (eyeMsrments.ri !== undefined) setElementValue("rAdd", eyeMsrments.ri);
 // rj is hardcoded to 0 in get function, so we don't set it
 if (eyeMsrments.rk !== undefined) setElementValue("rPd", eyeMsrments.rk);

 // Left Eye
 if (eyeMsrments.la !== undefined) setElementValue("lDvSph", eyeMsrments.la);
 if (eyeMsrments.lb !== undefined) setElementValue("lDvCyl", eyeMsrments.lb);
 if (eyeMsrments.lc !== undefined) setElementValue("lDvAxis", eyeMsrments.lc);
 if (eyeMsrments.ld !== undefined) setElementValue("lDvV/n", eyeMsrments.ld);
 if (eyeMsrments.le !== undefined) setElementValue("lNvSph", eyeMsrments.le);
 if (eyeMsrments.lf !== undefined) setElementValue("lNvCyl", eyeMsrments.lf);
 if (eyeMsrments.lg !== undefined) setElementValue("lNvAxis", eyeMsrments.lg);
 if (eyeMsrments.lh !== undefined) setElementValue("lNvV/n", eyeMsrments.lh);
 if (eyeMsrments.li !== undefined) setElementValue("lAdd", eyeMsrments.li);
 // lj is hardcoded to 0 in get function, so we don't set it
 if (eyeMsrments.lk !== undefined) setElementValue("lPd", eyeMsrments.lk);
}
function setupKeyboardNavigation() {
 document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
   const activeElement = document.activeElement;

   if (activeElement.tagName === 'TD' && activeElement.closest('.modal_dvnv_table')) {
    event.preventDefault();
    activeElement.click();
   }

   if (activeElement.tagName === 'BUTTON' && !activeElement.disabled) {
    event.preventDefault();
    activeElement.click();
   }

   if (activeElement.type === 'radio') {
    event.preventDefault();
    activeElement.checked = true;
    activeElement.dispatchEvent(new Event('change', { bubbles: true }));
   }
  }

  if (event.key === 'Tab') {
   const focusableElements = document.querySelectorAll(
    'input:not([readonly]):not([disabled]), button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
   );

   const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);

   if (event.shiftKey && currentIndex === 0) {
    event.preventDefault();
    focusableElements[focusableElements.length - 1].focus();
   } else if (!event.shiftKey && currentIndex === focusableElements.length - 1) {
    event.preventDefault();
    focusableElements[0].focus();
   }
  }
 });
}
