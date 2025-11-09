async function set_cstm1_innerHTML(...params) {
 const c_ontainer_blank_main = document.getElementById(params[0]);
 c_ontainer_blank_main.innerHTML = `
    <div class="container-fluid p-0"> <!-- Changed from p-4 to p-0 -->
      <div class="row g-0"> <!-- Added g-0 to remove gutters -->
        <div class="col-12"> <!-- Removed col-lg-10 constraint -->
          <div class="card shadow m-3"> <!-- Added margin to card instead -->
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0"><i class="fas fa-file-excel me-2"></i>Excel to PDF Converter</h4>
            </div>
            <div>* col 1 = name (not Number); * col 2 must be mobile numbers (if multiple / divided by); * col 3 = adrs 1, col 4 = adrs 2, col 5 = city, * col 6 must be "6" digit pin code; col 7 payment type "COD"; col 8 = amt; col 9 = product name/s;</div>
            <div class="card-body p-3"> <!-- Reduced padding -->
              <!-- File Upload Section -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="input-group">
                    <input type="file" id="excelFileInput" class="form-control" accept=".xlsx, .xls">
                    <button class="btn btn-outline-secondary" type="button" onclick="document.getElementById('excelFileInput').click()">
                      <i class="fas fa-folder-open me-2"></i>Browse
                    </button>
                  </div>
                  <div class="form-text">Select an Excel file (.xlsx or .xls)</div>
                </div>
              </div>

              <!-- Cards Preview Section -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                      <h5 class="mb-0">
                        <i class="fas ${showTableView ? "fa-table" : "fa-address-card"} me-2"></i>
                        ${showTableView ? "Data Table Preview" : "Cards Preview"}
                      </h5>
                      <button id="printCardsBtn" class="btn btn-primary btn-sm" disabled onclick="printVisibleCards()" style="display:none;">
                        <i class="fas fa-print me-1"></i>Print ${showTableView ? "Table" : "Cards"}
                      </button>
                    </div>
                    <div class="card-body p-2"> <!-- Reduced padding -->
                      <div id="cardsPreview" class="container-fluid px-0"> <!-- Removed horizontal padding -->
                        <p class="text-muted text-center py-4">No data loaded yet. Please select an Excel file to see the ${showTableView ? "table" : "cards"}.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Generate PDF Section -->
              <div class="row">
                <div class="col-12 text-center">
                  <button id="generatePdfBtn" class="btn btn-success btn-lg" disabled onclick="generatePDF()">
                    <i class="fas fa-file-pdf me-2"></i>Generate PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

 // Add event listener for file input
 const fileInput = document.getElementById("excelFileInput");
 fileInput.addEventListener("change", handleExcelFile);
}

async function handleExcelFile(event) {
 const file = event.target.files[0];
 if (!file) return;

 // Clear previous payload0.pi
 payload0.pi = [];

 // Show loading
 const loader = createDynamicLoader("Reading Excel file...");

 try {
  const rawData = await readExcelFile(file);
  const { data, isValid, validationErrors } = validateAndCleanExcelData(rawData);

  if (showTableView) {
   displayTableView(data, validationErrors);
  } else {
   displayCardsPreview(data, validationErrors);
  }

  // Enable/disable buttons based on validation
  document.getElementById("generatePdfBtn").disabled = !isValid;
  document.getElementById("printCardsBtn").disabled = !isValid;

  // Create payload0.pi only if data is valid
  if (isValid) {
   payload0.pi = createPiObjectFromExcelData(data[0], data.slice(1));
  } else {
   payload0.pi = []; // Empty it if validation errors
   showValidationErrors(validationErrors);
  }

 } catch (error) {
  console.error("Error reading Excel file:", error);
  showError("Error reading Excel file: " + error.message);
  payload0.pi = []; // Empty it on error
 } finally {
  loader.removeLoader();
 }
}

function validateAndCleanExcelData(data) {
 if (!data || data.length === 0) {
  return { data: data, isValid: false };
 }

 const headers = data[0];
 const rows = data.slice(1).filter((row) => row.length > 0);

 let isValid = true;
 const validationErrors = [];

 // Track seen mobile + pincode combinations for duplicate detection
 const seenCombinations = new Map();

 const validatedRows = rows.map((row, rowIndex) => {
  const cleanedRow = [...row];
  const rowErrors = [];

  // 1. 1st column cannot be a number column
  if (cleanedRow[0] !== undefined && cleanedRow[0] !== null && cleanedRow[0] !== '') {
   const value = cleanedRow[0].toString().trim();
   if (/^\d+$/.test(value)) {
    rowErrors.push({ column: 0, message: "Should contain text, not only numbers" });
    isValid = false;
   }
  }

  // 2. 2nd column must contain valid 10-digit mobile number(s)
  let mobileNumbers = [];
  if (cleanedRow[1] !== undefined && cleanedRow[1] !== null && cleanedRow[1] !== '') {
   const rawMobile = cleanedRow[1].toString().trim();

   // Split by slash and validate each number
   const numbers = rawMobile.split('/')
    .map(num => num.trim())
    .filter(num => num.length > 0);

   let hasValidNumber = false;

   numbers.forEach((num, index) => {
    let mobile = num;
    // Remove all non-digit characters and spaces
    mobile = mobile.replace(/[\s\-]/g, '').replace(/\D/g, '');

    // Remove leading zero if present
    if (mobile.startsWith('0')) {
     mobile = mobile.substring(1);
    }

    // Validate it's exactly 10 digits
    if (mobile.length === 10 && /^\d{10}$/.test(mobile)) {
     hasValidNumber = true;
     mobileNumbers.push(mobile);
    } else if (num.trim().length > 0) {
     rowErrors.push({
      column: 1,
      message: `Invalid mobile number format: "${num.trim()}"`
     });
     isValid = false;
    }
   });

   if (numbers.length > 0 && !hasValidNumber) {
    rowErrors.push({ column: 1, message: "No valid 10-digit mobile numbers found" });
    isValid = false;
   }

   // Store the original mobile data for display, first valid number for validation
   cleanedRow[1] = rawMobile; // Keep original format for display
   cleanedRow._mobileNumbers = mobileNumbers; // Store valid numbers for payload
  } else {
   rowErrors.push({ column: 1, message: "At least one mobile number is required" });
   isValid = false;
  }

  // 3. 6th column must be a 6-digit pincode
  let pincode = '';
  if (cleanedRow[5] !== undefined && cleanedRow[5] !== null && cleanedRow[5] !== '') {
   pincode = cleanedRow[5].toString().trim();
   // Remove all non-digit characters
   pincode = pincode.replace(/\D/g, '');

   // Remove leading zero if present
   if (pincode.startsWith('0')) {
    pincode = pincode.substring(1);
   }

   // Validate it's exactly 6 digits
   if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    rowErrors.push({ column: 5, message: "Must be a 6-digit pincode" });
    isValid = false;
   }
   cleanedRow[5] = pincode;
  } else {
   rowErrors.push({ column: 5, message: "Pincode is required" });
   isValid = false;
  }

  // 4. 8th column must be a number (amount)
  if (cleanedRow[7] !== undefined && cleanedRow[7] !== null && cleanedRow[7] !== '') {
   let amount = cleanedRow[7].toString().trim();
   // Remove any currency symbols, commas, and spaces
   amount = amount.replace(/[₹$,]/g, '').replace(/\s/g, '');

   // Handle cases where amount might have decimal points
   // Remove everything after decimal point for integer values
   if (amount.includes('.')) {
    amount = amount.split('.')[0];
   }

   // Validate it's a valid number
   if (!/^\d+$/.test(amount)) {
    rowErrors.push({ column: 7, message: "Must be a valid number" });
    isValid = false;
   }
   cleanedRow[7] = amount;
  } else {
   rowErrors.push({ column: 7, message: "Amount is required" });
   isValid = false;
  }

  // Check for duplicates (mobile + pincode combination) for EACH mobile number
  if (mobileNumbers.length > 0 && pincode) {
   mobileNumbers.forEach(mobile => {
    const combination = `${mobile}-${pincode}`;
    if (seenCombinations.has(combination)) {
     const duplicateRow = seenCombinations.get(combination);
     rowErrors.push({
      column: 1,
      message: `Duplicate mobile+pincode combination (${mobile}) found (also in row ${duplicateRow + 2})`
     });
     isValid = false;
    } else {
     seenCombinations.set(combination, rowIndex);
    }
   });
  }

  if (rowErrors.length > 0) {
   validationErrors.push({
    rowIndex: rowIndex + 2, // +2 because header is row 1 and Excel rows start from 1
    errors: rowErrors
   });
  }

  return cleanedRow;
 });

 return {
  data: [headers, ...validatedRows],
  isValid,
  validationErrors
 };
}

// Updated function to create pi object from Excel data with multiple mobile number support
function createPiObjectFromExcelData(headers, rows) {
 const piArray = [];

 rows.forEach((row) => {
  // Process mobile numbers (2nd column) - handle multiple numbers separated by "/"
  let mobileNumbers = [];
  if (row._mobileNumbers && row._mobileNumbers.length > 0) {
   mobileNumbers = row._mobileNumbers;
  } else if (row[1]) {
   // Fallback: clean and split mobile numbers from original data
   const rawMobile = row[1].toString().trim();

   // Split by slash and clean each number
   mobileNumbers = rawMobile.split('/')
    .map(num => num.trim())
    .filter(num => num.length > 0)
    .map(num => {
     // Remove all non-digit characters and spaces
     let cleanNum = num.replace(/[\s\-]/g, '').replace(/\D/g, '');

     // Remove leading zero if present
     if (cleanNum.startsWith('0')) {
      cleanNum = cleanNum.substring(1);
     }

     // Only keep valid 10-digit numbers
     return cleanNum.length === 10 && /^\d{10}$/.test(cleanNum) ? cleanNum : null;
    })
    .filter(num => num !== null);
  }

  // If no valid mobile numbers found, create one entry with empty mobile
  if (mobileNumbers.length === 0) {
   const piObject = createPiObject("", row);
   piArray.push(piObject);
  } else {
   // Create separate payload entries for each mobile number
   mobileNumbers.forEach(mobile => {
    const piObject = createPiObject(mobile, row);
    piArray.push(piObject);
   });
  }
 });

 return piArray;
}

// Helper function to create individual pi object
function createPiObject(mobile, row) {
 const piObject = {};

 // Process mobile number with "91." prefix
 if (mobile) {
  piObject.e = `91.${mobile}`;
 } else {
  piObject.e = "";
 }

 // Process pincode (6th column)
 if (row[5]) {
  piObject.f = row[5].toString();
 } else {
  piObject.f = "";
 }

 // Process name (1st column)
 if (row[0]) {
  piObject.g = row[0].toString();
 } else {
  piObject.g = "";
 }

 // Process address (3rd + 4th + 5th columns)
 const addressParts = [];
 if (row[2]) addressParts.push(row[2].toString());
 if (row[3]) addressParts.push(row[3].toString());
 if (row[4]) addressParts.push(row[4].toString());

 piObject.h = addressParts.join(", ");

 return piObject;
}

// Function to show validation errors with orange highlighting
function showValidationErrors(validationErrors) {
 // Remove any existing error display
 hideValidationErrors();

 const errorDiv = document.createElement("div");
 errorDiv.id = "validation-errors";
 errorDiv.className = "alert alert-warning alert-dismissible fade show mt-3";

 let errorHTML = `
    <strong><i class="fas fa-exclamation-triangle me-2"></i>Data Validation Issues Found:</strong>
    <p class="mb-2">Please fix the following issues in your Excel file:</p>
    <div class="table-responsive">
      <table class="table table-sm table-bordered mb-0">
        <thead class="table-light">
          <tr>
            <th>Row</th>
            <th>Column</th>
            <th>Issue</th>
          </tr>
        </thead>
        <tbody>
  `;

 validationErrors.forEach(error => {
  error.errors.forEach(colError => {
   const columnName = getColumnName(colError.column);
   errorHTML += `
        <tr>
          <td>${error.rowIndex}</td>
          <td>${columnName}</td>
          <td>${colError.message}</td>
        </tr>
      `;
  });
 });

 errorHTML += `
        </tbody>
      </table>
    </div>
    <div class="mt-2">
      <small class="text-muted">Invalid cells are highlighted in orange. Fix these issues to generate PDF.</small>
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

 errorDiv.innerHTML = errorHTML;

 // Insert after the file input section
 const cardBody = document.querySelector(".card-body");
 const fileSection = cardBody.querySelector(".row.mb-4");
 fileSection.parentNode.insertBefore(errorDiv, fileSection.nextSibling);
}

function hideValidationErrors() {
 const existingErrorDiv = document.getElementById("validation-errors");
 if (existingErrorDiv && existingErrorDiv.parentNode) {
  existingErrorDiv.parentNode.removeChild(existingErrorDiv);
 }
}

function getColumnName(columnIndex) {
 const columns = [
  "1st (Name)", "2nd (Mobile)", "3rd", "4th", "5th",
  "6th (Pincode)", "7th", "8th (Amount)", "9th"
 ];
 return columns[columnIndex] || `Column ${columnIndex + 1}`;
}

function displayTableView(data, validationErrors = []) {
 const previewDiv = document.getElementById("cardsPreview");

 if (!data || data.length === 0) {
  previewDiv.innerHTML =
   '<p class="text-muted text-center py-4">No data found in the Excel file.</p>';
  return;
 }

 const headers = data[0];
 const rows = data.slice(1).filter((row) => row.length > 0);

 // Create a map of invalid cells for quick lookup
 const invalidCells = new Map();
 validationErrors.forEach(error => {
  const rowIndex = error.rowIndex - 2; // Convert to 0-based index in our rows array
  error.errors.forEach(colError => {
   const key = `${rowIndex}-${colError.column}`;
   invalidCells.set(key, colError.message);
  });
 });

 // Clear previous content
 previewDiv.innerHTML = "";

 // Create responsive table container
 const tableContainer = document.createElement("div");
 tableContainer.className = "table-responsive";
 tableContainer.style.maxHeight = "500px";

 // Create table
 const table = document.createElement("table");
 table.className = "table table-striped table-bordered table-hover table-sm";
 table.style.fontSize = "14px";

 // Create table header
 const thead = document.createElement("thead");
 thead.className = "table-light sticky-top";

 const headerRow = document.createElement("tr");

 // Add index column header
 const indexHeader = document.createElement("th");
 indexHeader.scope = "col";
 indexHeader.textContent = "#";
 indexHeader.style.width = "50px";
 headerRow.appendChild(indexHeader);

 // Add data headers
 headers.forEach((header, index) => {
  const th = document.createElement("th");
  th.scope = "col";
  th.textContent = header || `Column ${index + 1}`;
  headerRow.appendChild(th);
 });

 thead.appendChild(headerRow);
 table.appendChild(thead);

 // Create table body
 const tbody = document.createElement("tbody");

 // Add rows
 rows.forEach((rowData, rowIndex) => {
  const tr = document.createElement("tr");

  // Add row index
  const indexCell = document.createElement("th");
  indexCell.scope = "row";
  indexCell.textContent = rowIndex + 1;
  indexCell.style.fontWeight = "normal";
  tr.appendChild(indexCell);

  // Add data cells
  headers.forEach((header, colIndex) => {
   const td = document.createElement("td");
   td.textContent = rowData[colIndex] || "";
   td.style.wordWrap = "break-word";
   td.style.maxWidth = "200px";

   // Check if this cell is invalid
   const cellKey = `${rowIndex}-${colIndex}`;
   if (invalidCells.has(cellKey)) {
    td.style.backgroundColor = "#fff3cd"; // Orange background
    td.style.borderColor = "#ffc107";
    td.title = invalidCells.get(cellKey);
   }

   tr.appendChild(td);
  });

  tbody.appendChild(tr);
 });

 table.appendChild(tbody);
 tableContainer.appendChild(table);
 previewDiv.appendChild(tableContainer);

 // Add summary
 const summary = document.createElement("div");
 summary.className = "mt-3 text-center text-muted";
 const validRows = rows.length - new Set(validationErrors.map(e => e.rowIndex - 2)).size;
 summary.innerHTML = `<small>Showing ${rows.length} rows and ${headers.length} columns. ${validRows} valid rows, ${validationErrors.length} rows with issues.</small>`;
 previewDiv.appendChild(summary);
}

function displayCardsPreview(data, validationErrors = []) {
 const previewDiv = document.getElementById("cardsPreview");

 if (!data || data.length === 0) {
  previewDiv.innerHTML =
   '<p class="text-muted text-center py-4">No data found in the Excel file.</p>';
  return;
 }

 const headers = data[0];
 const rows = data.slice(1).filter((row) => row.length > 0);

 // Create a set of invalid rows for quick lookup
 const invalidRows = new Set();
 validationErrors.forEach(error => {
  invalidRows.add(error.rowIndex - 2); // Convert to 0-based index
 });

 // Clear previous content
 previewDiv.innerHTML = "";

 // Create cards grid container
 const gridContainer = document.createElement("div");
 gridContainer.className = "row g-3";

 // Add cards for each row
 rows.forEach((rowData, index) => {
  const isInvalid = invalidRows.has(index);
  const card = createPreviewCardElement(headers, rowData, index + 1, isInvalid);
  gridContainer.appendChild(card);
 });

 previewDiv.appendChild(gridContainer);

 // Add summary
 const summary = document.createElement("div");
 summary.className = "mt-3 text-center text-muted";
 const validCards = rows.length - invalidRows.size;
 summary.innerHTML = `<small>Showing ${rows.length} cards. ${validCards} valid cards, ${invalidRows.size} cards with issues.</small>`;
 previewDiv.appendChild(summary);
}

function createPreviewCardElement(headers, rowData, index, isInvalid = false) {
 const colDiv = document.createElement("div");
 colDiv.className = "col-12 col-sm-6 col-lg-4";

 const card = document.createElement("div");
 card.className = "card h-100";
 card.style.border = isInvalid ? "2px solid #ffc107" : "1px solid #ccc";
 card.style.backgroundColor = isInvalid ? "#fff3cd" : "";
 card.style.fontFamily = "Arial, sans-serif";
 card.style.overflow = "visible";

 if (isInvalid) {
  card.title = "This card contains invalid data";
 }

 const cardBody = document.createElement("div");
 cardBody.className = "card-body p-2";
 cardBody.style.display = "flex";
 cardBody.style.flexDirection = "column";
 cardBody.style.height = "100%";
 cardBody.style.overflow = "visible";

 // Top Section (contains Top Left and Top Right)
 const topSection = document.createElement("div");
 topSection.style.display = "flex";
 topSection.style.flex = "1";
 topSection.style.minHeight = "0";
 topSection.style.gap = "8px";
 topSection.style.marginBottom = "8px";
 topSection.style.overflow = "visible";

 // Section 1: Top Left - 1st to 6th columns - 55% width
 const topLeft = document.createElement("div");
 topLeft.style.flex = `${cstm1.ltwd || 55}`;
 topLeft.style.padding = "4px";
 topLeft.style.fontSize = "11px";
 topLeft.style.lineHeight = "1.0";
 topLeft.style.overflow = "visible";
 topLeft.style.wordWrap = "break-word";
 topLeft.style.wordBreak = "break-word";
 topLeft.style.overflowWrap = "break-word";

 // Add "To," on first line
 const toLabel = document.createElement("div");
 toLabel.style.fontWeight = "bold";
 toLabel.style.marginBottom = "3px";
 toLabel.textContent = "To,";
 topLeft.appendChild(toLabel);

 // Add 1st column data (Client Name) - Bold
 if (headers[0] && rowData[0]) {
  const line1 = document.createElement("div");
  line1.style.fontWeight = "bold";
  line1.style.marginBottom = "3px";
  line1.textContent = rowData[0];
  topLeft.appendChild(line1);
 }

 // Add 2nd column data (Mobile) - Show original format with multiple numbers
 if (headers[1] && rowData[1]) {
  const line2 = document.createElement("div");
  line2.style.fontSize = "12px";
  line2.style.marginBottom = "3px";
  line2.textContent = rowData[1]; // Show original format with slashes
  topLeft.appendChild(line2);
 }

 // Concatenate columns 3, 4, 5 with ", "
 const addressParts = [];
 if (headers[2] && rowData[2]) addressParts.push(rowData[2]);
 if (headers[3] && rowData[3]) addressParts.push(rowData[3]);
 if (headers[4] && rowData[4]) addressParts.push(rowData[4]);

 if (addressParts.length > 0) {
  const addressLine = document.createElement("div");
  addressLine.style.marginBottom = "3px";
  addressLine.textContent = addressParts.join(", ");
  topLeft.appendChild(addressLine);
 }

 // Add 6th column data (Pincode) - Separate line
 if (headers[5] && rowData[5]) {
  const line6 = document.createElement("div");
  line6.style.marginBottom = "3px";
  line6.textContent = rowData[5];
  topLeft.appendChild(line6);
 }

 // Section 2: Top Right - 7th to 9th columns - 45% width
 const topRight = document.createElement("div");
 topRight.style.flex = `${cstm1.rtwd || 45}`;
 topRight.style.padding = "4px";
 topRight.style.fontSize = "11px";
 topRight.style.lineHeight = "1.0";
 topRight.style.textAlign = "left";
 topRight.style.overflow = "visible";
 topRight.style.wordWrap = "break-word";
 topRight.style.wordBreak = "break-word";
 topRight.style.overflowWrap = "break-word";

 // Add 7th column data (Payment Type) with prefix
 if (headers[6] && rowData[6]) {
  const line7 = document.createElement("div");
  line7.style.marginBottom = "3px";
  line7.textContent = `Payment type: ${rowData[6]}`;
  topRight.appendChild(line7);
 }

 // Add 8th column data (Amount) with prefix and bold formatting
 if (headers[7] && rowData[7]) {
  const line8 = document.createElement("div");
  line8.style.marginBottom = "3px";
  line8.style.fontWeight = "bold";
  line8.textContent = `Price: ₹${rowData[7]}/-`;
  topRight.appendChild(line8);
 }

 // Add 9th column data (Product Name) with prefix
 if (headers[8] && rowData[8]) {
  const line9 = document.createElement("div");
  line9.style.marginBottom = "3px";
  line9.textContent = `Product Name: ${rowData[8]}`;
  topRight.appendChild(line9);
 }

 topSection.appendChild(topLeft);
 topSection.appendChild(topRight);

 // Bottom Section (contains Bottom Left and Bottom Right)
 const bottomSection = document.createElement("div");
 bottomSection.style.display = "flex";
 bottomSection.style.height = "120px";
 bottomSection.style.gap = "8px";
 bottomSection.style.overflow = "visible";

 // Section 3: Bottom Left - Empty - 40% width
 const bottomLeft = document.createElement("div");
 bottomLeft.style.flex = `${cstm1.lbwd || 40}`;
 bottomLeft.style.padding = "4px";
 bottomLeft.style.borderRadius = "4px";
 bottomLeft.style.display = "flex";
 bottomLeft.style.alignItems = "center";
 bottomLeft.style.justifyContent = "center";
 bottomLeft.style.fontSize = "10px";
 bottomLeft.style.overflow = "visible";

 // Section 4: Bottom Right - Dynamic FROM address - 60% width
 const bottomRight = document.createElement("div");
 bottomRight.style.flex = `${cstm1.rbwd || 60}`;
 bottomRight.style.padding = "4px";
 bottomRight.style.fontSize = "9px";
 bottomRight.style.lineHeight = "1.0";
 bottomRight.style.textAlign = "left";
 bottomRight.style.border = "1px solid #ccc";
 bottomRight.style.backgroundColor = "#fff";
 bottomRight.style.borderRadius = "4px";
 bottomRight.style.overflow = "visible";
 bottomRight.style.wordWrap = "break-word";
 bottomRight.style.wordBreak = "break-word";
 bottomRight.style.overflowWrap = "break-word";

 // Build FROM address dynamically from the array
 let fromAddressHTML = '';
 fromAddress.forEach((line, index) => {
  if (index === 0) {
   fromAddressHTML += `<div style="font-weight: bold; margin-bottom: 2px; font-size: 10px;">${line}</div>`;
  } else if (index === 1) {
   fromAddressHTML += `<div style="font-style: italic; margin-bottom: 3px; font-size: 8px;">${line}</div>`;
  } else {
   fromAddressHTML += `<div style="margin-bottom: 1px;">${line}</div>`;
  }
 });

 bottomRight.innerHTML = fromAddressHTML;

 bottomSection.appendChild(bottomLeft);
 bottomSection.appendChild(bottomRight);

 // Card header with index and warning icon for invalid cards
 const cardHeader = document.createElement("div");
 cardHeader.className = "card-header py-1 d-flex justify-content-between align-items-center";
 cardHeader.style.backgroundColor = isInvalid ? "#fff3cd" : "#f8f9fa";
 cardHeader.style.borderBottom = isInvalid ? "1px solid #ffc107" : "1px solid rgba(0,0,0,.125)";

 const headerText = document.createElement("span");
 headerText.style.fontSize = "12px";
 headerText.style.fontWeight = "bold";
 headerText.textContent = `Card ${index}`;

 cardHeader.appendChild(headerText);

 if (isInvalid) {
  const warningIcon = document.createElement("i");
  warningIcon.className = "fas fa-exclamation-triangle text-warning";
  warningIcon.title = "Contains invalid data";
  cardHeader.appendChild(warningIcon);
 }

 card.appendChild(cardHeader);
 cardBody.appendChild(topSection);
 cardBody.appendChild(bottomSection);
 card.appendChild(cardBody);
 colDiv.appendChild(card);

 return colDiv;
}

function printVisibleCards() {
 if (showTableView) {
  printTableView();
 } else {
  printCardsView();
 }
}

function printTableView() {
 const previewDiv = document.getElementById("cardsPreview");
 const table = previewDiv.querySelector("table");

 if (!table) {
  showError("No table available to print");
  return;
 }

 const loader = createDynamicLoader("Preparing table for printing...");

 try {
  // Create print container
  const printContainer = document.createElement("div");
  printContainer.id = "print-container";
  printContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 210mm;
      background: white;
      font-family: Arial, sans-serif;
    `;

  // Clone the table for printing
  const printTable = table.cloneNode(true);
  printTable.style.width = "100%";
  printTable.style.fontSize = "10pt";

  // Create page container
  const pageContainer = document.createElement("div");
  pageContainer.className = "print-page";
  pageContainer.style.cssText = `
      width: 210mm;
      height: 297mm;
      padding: 15mm;
      background: white;
      box-sizing: border-box;
    `;

  // Add title
  const title = document.createElement("h2");
  title.textContent = "Excel Data Export";
  title.style.cssText = `
      text-align: center;
      margin-bottom: 10mm;
      font-size: 16pt;
    `;
  pageContainer.appendChild(title);

  // Add table
  pageContainer.appendChild(printTable);

  // Add timestamp
  const timestamp = document.createElement("div");
  timestamp.textContent = `Generated on: ${new Date().toLocaleString()}`;
  timestamp.style.cssText = `
      text-align: center;
      margin-top: 10mm;
      font-size: 9pt;
      color: #666;
    `;
  pageContainer.appendChild(timestamp);

  printContainer.appendChild(pageContainer);

  // Add print container to document
  document.body.appendChild(printContainer);

  // Create print styles
  const printStyles = document.createElement("style");
  printStyles.innerHTML = `
      @media print {
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }
        body * {
          visibility: hidden;
        }
        #print-container, #print-container * {
          visibility: visible;
        }
        #print-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }
        .print-page {
          page-break-after: always;
          margin: 0 !important;
        }
        .no-print {
          display: none !important;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #000;
          padding: 4px;
          text-align: left;
        }
        th {
          background-color: #f8f9fa !important;
          font-weight: bold;
        }
      }
      @page {
        size: A4;
        margin: 0;
      }
    `;
  document.head.appendChild(printStyles);

  // Trigger print after a short delay to ensure styles are applied
  setTimeout(() => {
   window.print();

   // Clean up
   setTimeout(() => {
    if (document.body.contains(printContainer)) {
     document.body.removeChild(printContainer);
    }
    document.head.removeChild(printStyles);
   }, 100);
  }, 500);
 } catch (error) {
  console.error("Error printing table:", error);
  showError("Error printing table: " + error.message);

  // Clean up on error
  const printContainer = document.getElementById("print-container");
  const printStyles = document.querySelector("style");
  if (printContainer) document.body.removeChild(printContainer);
  if (printStyles) document.head.removeChild(printStyles);
 } finally {
  loader.removeLoader();
 }
}

function printCardsView() {
 const previewDiv = document.getElementById("cardsPreview");
 const cards = previewDiv.querySelectorAll(".card");

 if (!cards || cards.length === 0) {
  showError("No cards available to print");
  return;
 }

 const loader = createDynamicLoader("Preparing cards for printing...");

 try {
  // Extract data from visible cards
  const headers = [
   "Column 1", "Column 2", "Column 3", "Column 4",
   "Column 5", "Column 6", "Column 7", "Column 8", "Column 9"
  ];
  const rows = [];

  cards.forEach((card, index) => {
   const cardBody = card.querySelector(".card-body");
   const topLeft = cardBody.querySelector(
    "div > div:first-child > div:first-child"
   );
   const topRight = cardBody.querySelector(
    "div > div:first-child > div:last-child"
   );

   const rowData = [];

   // Extract data from top left (columns 1-6)
   const topLeftLines = topLeft.querySelectorAll("div");
   if (topLeftLines[0]) rowData[0] = topLeftLines[0].textContent.replace("To, ", "");
   if (topLeftLines[1]) rowData[1] = topLeftLines[1].textContent;
   if (topLeftLines[2]) {
    // Handle concatenated address
    const addressText = topLeftLines[2].textContent;
    rowData[2] = addressText.split(", ")[0] || "";
    rowData[3] = addressText.split(", ")[1] || "";
    rowData[4] = addressText.split(", ")[2] || "";
   }
   if (topLeftLines[3]) rowData[5] = topLeftLines[3].textContent;

   // Extract data from top right (columns 7-9)
   const topRightLines = topRight.querySelectorAll("div");
   if (topRightLines[0]) rowData[6] = topRightLines[0].textContent;
   if (topRightLines[1]) rowData[7] = topRightLines[1].textContent;
   if (topRightLines[2]) rowData[8] = topRightLines[2].textContent;

   rows.push(rowData);
  });

  // Calculate cards per page
  const cardsPerPage = cstm1.c * cstm1.r;
  const totalPages = Math.ceil(rows.length / cardsPerPage);

  // Create print container
  const printContainer = document.createElement("div");
  printContainer.id = "print-container";
  printContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 210mm;
      background: white;
      font-family: Arial, sans-serif;
    `;

  // Create pages
  for (let pageNum = 0; pageNum < totalPages; pageNum++) {
   const pageStart = pageNum * cardsPerPage;
   const pageEnd = Math.min(pageStart + cardsPerPage, rows.length);
   const pageData = rows.slice(pageStart, pageEnd);

   // Create page container
   const pageContainer = document.createElement("div");
   pageContainer.className = "print-page";
   pageContainer.style.cssText = `
        width: 210mm;
        height: 297mm;
        padding: ${cstm1.pageMargin}mm;
        background: white;
        page-break-after: ${pageNum < totalPages - 1 ? "always" : "auto"};
        box-sizing: border-box;
        position: relative;
      `;

   // Create cards container with absolute positioning
   const cardsContainer = document.createElement("div");
   cardsContainer.style.cssText = `
        position: relative;
        width: 100%;
        height: calc(100% - 15mm);
      `;

   // Calculate card positions using the new margin properties
   const cardWidth = (210 - 2 * cstm1.pageMargin - cstm1["margin-right"]) / cstm1.c;
   const cardHeight =
    (297 - 2 * cstm1.pageMargin - 15 - cstm1["margin-bottom"] * (cstm1.r - 1)) /
    cstm1.r;

   // Position cards in grid
   pageData.forEach((rowData, index) => {
    const row = Math.floor(index / cstm1.c);
    const col = index % cstm1.c;

    const card = createPrintCardElement(
     headers,
     rowData,
     pageStart + index + 1,
     {
      ...cstm1,
      cardWidth: cardWidth,
      cardHeight: cardHeight,
     }
    );

    card.style.cssText = `
          position: absolute;
          width: ${cardWidth}mm;
          height: ${cardHeight}mm;
          left: ${col * (cardWidth + cstm1["margin-right"])}mm;
          top: ${row * (cardHeight + cstm1["margin-bottom"])}mm;
        `;

    cardsContainer.appendChild(card);
   });

   // Add empty placeholders for remaining slots
   const remainingSlots = cardsPerPage - pageData.length;
   for (let i = 0; i < remainingSlots; i++) {
    const index = pageData.length + i;
    const row = Math.floor(index / cstm1.c);
    const col = index % cstm1.c;

    const emptyCard = document.createElement("div");
    emptyCard.style.cssText = `
          position: absolute;
          width: ${cardWidth}mm;
          height: ${cardHeight}mm;
          left: ${col * (cardWidth + cstm1["margin-right"])}mm;
          top: ${row * (cardHeight + cstm1["margin-bottom"])}mm;
          border: 1px dashed #ccc;
          box-sizing: border-box;
        `;
    cardsContainer.appendChild(emptyCard);
   }

   pageContainer.appendChild(cardsContainer);

   // Add page number
   const pageNumber = document.createElement("div");
   pageNumber.style.cssText = `
        position: absolute;
        bottom: 5mm;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 10px;
        color: #666;
      `;
   pageNumber.textContent = `Page ${pageNum + 1} of ${totalPages}`;
   pageContainer.appendChild(pageNumber);

   printContainer.appendChild(pageContainer);
  }

  // Add print container to document
  document.body.appendChild(printContainer);

  // Create print styles
  const printStyles = document.createElement("style");
  printStyles.innerHTML = `
      @media print {
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }
        body * {
          visibility: hidden;
        }
        #print-container, #print-container * {
          visibility: visible;
        }
        #print-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }
        .print-page {
          page-break-after: always;
          margin: 0 !important;
        }
        .no-print {
          display: none !important;
        }
      }
      @page {
        size: A4;
        margin: 0;
      }
    `;
  document.head.appendChild(printStyles);

  // Trigger print after a short delay to ensure styles are applied
  setTimeout(() => {
   window.print();

   // Clean up
   setTimeout(() => {
    if (document.body.contains(printContainer)) {
     document.body.removeChild(printContainer);
    }
    document.head.removeChild(printStyles);
   }, 100);
  }, 500);
 } catch (error) {
  console.error("Error printing cards:", error);
  showError("Error printing cards: " + error.message);

  // Clean up on error
  const printContainer = document.getElementById("print-container");
  const printStyles = document.querySelector("style");
  if (printContainer) document.body.removeChild(printContainer);
  if (printStyles) document.head.removeChild(printStyles);
 } finally {
  loader.removeLoader();
 }
}

function createPrintCardElement(headers, rowData, index, config) {
 const card = document.createElement("div");
 card.style.cssText = `
    border: 1px solid #000;
    border-radius: 2px;
    padding: 2mm;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: visible;
    page-break-inside: avoid;
    font-size: 8pt;
    width: ${config.cardWidth}mm;
    height: ${config.cardHeight}mm;
  `;

 // Top Section (contains Top Left and Top Right)
 const topSection = document.createElement("div");
 topSection.style.cssText = `
    display: flex;
    flex: 1;
    min-height: 0;
    gap: 2mm;
    margin-bottom: 1mm;
    overflow: visible;
  `;

 // Section 1: Top Left - 1st to 6th columns - 55% width
 const topLeft = document.createElement("div");
 topLeft.style.cssText = `
    flex: ${config.ltwd || 55};
    padding: 1mm;
    font-size: ${config.ltfo || 7}pt;
    line-height: 1.1;
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    word-wrap: break-word;
  `;

 // Add "To," on first line
 const toLabel = document.createElement("div");
 toLabel.style.cssText = "font-weight: bold; margin-bottom: 0.5mm;";
 toLabel.textContent = "To,";
 topLeft.appendChild(toLabel);

 // Add 1st column data (Client Name) - Bold
 if (headers[0] && rowData[0]) {
  const line1 = document.createElement("div");
  line1.style.cssText = "font-weight: bold; margin-bottom: 0.5mm;";
  line1.textContent = rowData[0];
  topLeft.appendChild(line1);
 }

 // Add 2nd column data (Mobile) - Show original format with multiple numbers
 if (headers[1] && rowData[1]) {
  const line2 = document.createElement("div");
  line2.style.cssText = `font-size: ${(config.ltfo || 7) + 1}pt; margin-bottom: 0.5mm;`;
  line2.textContent = rowData[1]; // Show original format with slashes
  topLeft.appendChild(line2);
 }

 // Concatenate columns 3, 4, 5 with ", "
 const addressParts = [];
 if (headers[2] && rowData[2]) addressParts.push(rowData[2]);
 if (headers[3] && rowData[3]) addressParts.push(rowData[3]);
 if (headers[4] && rowData[4]) addressParts.push(rowData[4]);

 if (addressParts.length > 0) {
  const addressLine = document.createElement("div");
  addressLine.style.cssText = "margin-bottom: 0.5mm;";
  addressLine.textContent = addressParts.join(", ");
  topLeft.appendChild(addressLine);
 }

 // Add 6th column data (Pincode) - Separate line
 if (headers[5] && rowData[5]) {
  const line6 = document.createElement("div");
  line6.style.cssText = "margin-bottom: 0.5mm;";
  line6.textContent = rowData[5];
  topLeft.appendChild(line6);
 }

 // Section 2: Top Right - 7th to 9th columns - 45% width
 const topRight = document.createElement("div");
 topRight.style.cssText = `
    flex: ${config.rtwd || 45};
    padding: 1mm;
    font-size: ${config.rtfo || 7}pt;
    line-height: 1.1;
    text-align: left;
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    word-wrap: break-word;
  `;

 // Add 7th column data (Payment Type) with prefix
 if (headers[6] && rowData[6]) {
  const line7 = document.createElement("div");
  line7.style.cssText = "margin-bottom: 0.5mm;";
  line7.textContent = `Payment type: ${rowData[6]}`;
  topRight.appendChild(line7);
 }

 // Add 8th column data (Amount) with prefix and bold formatting
 if (headers[7] && rowData[7]) {
  const line8 = document.createElement("div");
  line8.style.cssText = "margin-bottom: 0.5mm; font-weight: bold;";
  line8.textContent = `Price: ₹${rowData[7]}/-`;
  topRight.appendChild(line8);
 }

 // Add 9th column data (Product Name) with prefix
 if (headers[8] && rowData[8]) {
  const line9 = document.createElement("div");
  line9.style.cssText = "margin-bottom: 0.5mm;";
  line9.textContent = `Product Name: ${rowData[8]}`;
  topRight.appendChild(line9);
 }

 topSection.appendChild(topLeft);
 topSection.appendChild(topRight);

 // Bottom Section (contains Bottom Left and Bottom Right)
 const bottomSection = document.createElement("div");
 bottomSection.style.cssText = `
    display: flex;
    height: 15mm;
    gap: 2mm;
    margin-top: 1mm;
    overflow: visible;
  `;

 // Section 3: Bottom Left - Empty - 40% width
 const bottomLeft = document.createElement("div");
 bottomLeft.style.cssText = `
    flex: ${config.lbwd || 40};
    padding: 1mm;
    min-height: 12mm;
    box-sizing: border-box;
    overflow: visible;
  `;
 // Empty section - no content

 // Section 4: Bottom Right - Dynamic FROM address - 60% width
 const bottomRight = document.createElement("div");
 bottomRight.style.cssText = `
    flex: ${config.rbwd || 60};
    padding: 1mm;
    font-size: ${config.rbfo || 5.5}pt;
    line-height: 1.0;
    text-align: left;
    border: 1px solid #ccc;
    background: #fff;
    overflow: visible;
    min-height: 12mm;
    box-sizing: border-box;
    word-wrap: break-word;
  `;

 // Build FROM address dynamically from the array
 let fromAddressHTML = '';
 fromAddress.forEach((line, index) => {
  if (index === 0) {
   fromAddressHTML += `<div style="font-weight: bold; margin-bottom: 0.3mm;">${line}</div>`;
  } else if (index === 1) {
   fromAddressHTML += `<div style="font-style: italic; margin-bottom: 0.5mm;">${line}</div>`;
  } else {
   fromAddressHTML += `<div style="margin-bottom: 0.2mm;">${line}</div>`;
  }
 });

 bottomRight.innerHTML = fromAddressHTML;

 bottomSection.appendChild(bottomLeft);
 bottomSection.appendChild(bottomRight);

 // Add all sections to card
 card.appendChild(topSection);
 card.appendChild(bottomSection);

 return card;
}

// Function to read Excel file
function readExcelFile(file) {
 return new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.onload = function (e) {
   try {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    resolve(jsonData);
   } catch (error) {
    reject(error);
   }
  };

  reader.onerror = function () {
   reject(new Error("Failed to read file"));
  };

  reader.readAsArrayBuffer(file);
 });
}

async function generatePDF() {
 const fileInput = document.getElementById("excelFileInput");
 if (!fileInput.files[0]) {
  showError("Please select an Excel file first");
  return;
 }

 // Check if PDF generation is disabled (due to validation errors)
 const generatePdfBtn = document.getElementById("generatePdfBtn");
 if (generatePdfBtn.disabled) {
  alert("Import proper data. Please fix all validation issues highlighted in orange before generating PDF.");
  return;
 }

 // Check if payload0.pi is populated
 if (!payload0.pi || payload0.pi.length === 0) {
  alert("No valid data available. Please re-upload the Excel file.");
  return;
 }

 const loader = createDynamicLoader("Generating PDF with address cards...");
 try {
  payload0.fn = 54;
  payload0.vw = 1;

  // payload0.pi is already prepared from handleExcelFile with only required fields
  console.log("Sending payload0.pi:", payload0.pi); // For debugging

  const response = await fnj3("https://my1.in/2/d.php", payload0, 1, true, null, 20000, 0, 1, 1);
  if (response.su == 1) {
   // Continue with PDF generation using html2canvas
   const data = await readExcelFile(fileInput.files[0]);
   const { data: validatedData } = validateAndCleanExcelData(data);

   if (!validatedData || validatedData.length === 0) {
    showError("No data found in the Excel file");
    return;
   }

   const headers = validatedData[0];
   const rows = validatedData.slice(1).filter((row) => row.length > 0);

   if (rows.length === 0) {
    showError("No data rows found in the Excel file");
    return;
   }

   // Use html2canvas to preserve exact visual appearance including UTF characters
   if (typeof html2canvas === "undefined") {
    await loadHtml2Canvas();
   }

   const { jsPDF } = window.jspdf;

   // Calculate total cards per page
   const cardsPerPage = config.columnsPerPage * config.rowsPerPage;
   const totalPages = Math.ceil(rows.length / cardsPerPage);

   // Generate filename with timestamp
   const now = new Date();
   const timestamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0") +
    (now.getHours() >= 12 ? "pm" : "am");
   const filename = `address_print_${timestamp}.pdf`;

   // Create PDF document
   const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: config.pageSize,
   });

   const pageWidth = doc.internal.pageSize.getWidth();
   const pageHeight = doc.internal.pageSize.getHeight();

   let currentPage = 0;

   // Process data in pages
   for (
    let pageStart = 0;
    pageStart < rows.length;
    pageStart += cardsPerPage
   ) {
    if (currentPage > 0) {
     doc.addPage();
    }

    const pageEnd = Math.min(pageStart + cardsPerPage, rows.length);
    const pageData = rows.slice(pageStart, pageEnd);

    // Create page container for html2canvas
    const pageContainer = document.createElement("div");
    pageContainer.style.cssText = `
        width: ${pageWidth}mm;
        min-height: ${pageHeight}mm;
        padding: ${config.pageMargin}mm;
        background: white;
        position: absolute;
        left: -9999px;
        top: 0;
        font-family: Arial, sans-serif;
        box-sizing: border-box;
      `;

    // Create cards container
    const cardsContainer = document.createElement("div");
    cardsContainer.style.cssText = `
        position: relative;
        width: 100%;
        height: calc(100% - 10mm);
      `;

    // Calculate card dimensions
    const availableWidth = pageWidth - 2 * config.pageMargin;
    const availableHeight = pageHeight - 2 * config.pageMargin - 1;

    const cardWidth = (availableWidth - config.marginRight * (config.columnsPerPage - 1)) / config.columnsPerPage;
    const cardHeight = (availableHeight - config.marginBottom * (config.rowsPerPage - 1)) / config.rowsPerPage;

    // Create cards for this page with proper 4-section structure
    pageData.forEach((rowData, index) => {
     const rowIndex = Math.floor(index / config.columnsPerPage);
     const colIndex = index % config.columnsPerPage;

     const card = createPDFCardElement(headers, rowData, pageStart + index + 1, {
      ...config,
      cardWidth: cardWidth,
      cardHeight: cardHeight
     });

     card.style.cssText = `
        border: 1px solid black;
          position: absolute;
          width: ${cardWidth}mm;
          height: ${cardHeight}mm;
          left: ${colIndex * (cardWidth + config.marginRight)}mm;
          top: ${rowIndex * (cardHeight + config.marginBottom)}mm;
          box-sizing: border-box;
        `;

     cardsContainer.appendChild(card);
    });

    // Add empty placeholders for remaining slots
    const remainingSlots = cardsPerPage - pageData.length;
    for (let i = 0; i < remainingSlots; i++) {
     const index = pageData.length + i;
     const rowIndex = Math.floor(index / config.columnsPerPage);
     const colIndex = index % config.columnsPerPage;

     const emptyCard = document.createElement("div");
     emptyCard.style.cssText = `
          position: absolute;
          width: ${cardWidth}mm;
          height: ${cardHeight}mm;
          left: ${colIndex * (cardWidth + config.marginRight)}mm;
          top: ${rowIndex * (cardHeight + config.marginBottom)}mm;
          border: 1px dashed #ccc;
          box-sizing: border-box;
        `;
     cardsContainer.appendChild(emptyCard);
    }

    pageContainer.appendChild(cardsContainer);

    // Add page number
    const pageNumber = document.createElement("div");
    pageNumber.style.cssText = `
        position: absolute;
        bottom: 2mm;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 10pt;
        color: #666;
      `;
    pageNumber.textContent = `Page ${currentPage + 1} of ${totalPages}`;
    pageContainer.appendChild(pageNumber);

    // Add to document for rendering
    document.body.appendChild(pageContainer);

    try {
     // Convert page to image using html2canvas (preserves UTF and layout)
     const canvas = await html2canvas(pageContainer, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: pageContainer.offsetWidth,
      height: pageContainer.scrollHeight,
      removeContainer: true,
      onclone: function (clonedDoc) {
       // Ensure fonts are loaded in cloned document
       const clonedContainer = clonedDoc.querySelector('div');
       if (clonedContainer) {
        clonedContainer.style.fontFamily = 'Arial, sans-serif';
       }
      }
     });

     // Add image to PDF
     const imgData = canvas.toDataURL("image/jpeg", 0.9);
     const imgWidth = pageWidth;
     const imgHeight = (canvas.height * pageWidth) / canvas.width;

     doc.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

    } catch (error) {
     console.error("Error converting page to image:", error);
     throw error;
    } finally {
     // Clean up
     if (document.body.contains(pageContainer)) {
      document.body.removeChild(pageContainer);
     }
    }

    currentPage++;
   }

   // Save PDF with dynamic filename
   doc.save(filename);

  } else {
   alert(response.ms);
  }
 } catch (error) {
  console.error("Error generating PDF:", error);
  showError("Error generating PDF: " + error.message);
 } finally {
  loader.removeLoader();
 }
}

function createPDFCardElement(headers, rowData, index, config) {
 const card = document.createElement("div");
 card.style.cssText = `
    border: 1px solid #000;
    border-radius: 2px;
    padding: 2mm;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: visible;
    font-family: Arial, sans-serif;
  `;

 // Top Section (contains Top Left and Top Right) - 60% height
 const topSection = document.createElement("div");
 topSection.style.cssText = `
    display: flex;
    flex: 0.6;
    min-height: 0;
    gap: 2mm;
    margin-bottom: 1mm;
    overflow: visible;
  `;

 // Section 1: Top Left - 1st to 6th columns - 55% width
 const topLeft = document.createElement("div");
 topLeft.style.cssText = `
    flex: ${config.ltwd || 55};
    padding: 1mm;
    font-size: ${config.ltfo}pt;
    line-height: 1.2;
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    border-right: 1px dashed #ccc;
  `;

 // Add "To," on first line
 const toLabel = document.createElement("div");
 toLabel.style.cssText = "font-weight: bold; margin-bottom: 1mm; min-height: 1.2em;";
 toLabel.textContent = "To,";
 topLeft.appendChild(toLabel);

 // Add 1st column data (Client Name) - Bold
 const line1 = document.createElement("div");
 line1.style.cssText = "font-weight: bold; margin-bottom: 1mm; min-height: 1.2em;";
 line1.textContent = headers[0] && rowData[0] ? rowData[0] : " ";
 topLeft.appendChild(line1);

 // Add 2nd column data (Mobile) - Show original format with multiple numbers
 const line2 = document.createElement("div");
 line2.style.cssText = `font-size: ${config.ltfo + 1}pt; margin-bottom: 1mm; min-height: 1.2em;`;
 line2.textContent = headers[1] && rowData[1] ? rowData[1] : " "; // Show original format with slashes
 topLeft.appendChild(line2);

 // Concatenate columns 3, 4, 5 with ", "
 const addressParts = [];
 if (headers[2] && rowData[2]) addressParts.push(rowData[2]);
 if (headers[3] && rowData[3]) addressParts.push(rowData[3]);
 if (headers[4] && rowData[4]) addressParts.push(rowData[4]);

 const addressLine = document.createElement("div");
 addressLine.style.cssText = "margin-bottom: 1mm; min-height: 1.2em;";
 addressLine.textContent = addressParts.length > 0 ? addressParts.join(", ") : " ";
 topLeft.appendChild(addressLine);

 // Add 6th column data (Pincode) - Separate line
 const line6 = document.createElement("div");
 line6.style.cssText = "min-height: 1.2em;";
 line6.textContent = headers[5] && rowData[5] ? rowData[5] : " ";
 topLeft.appendChild(line6);

 // Section 2: Top Right - 7th to 9th columns - 45% width
 const topRight = document.createElement("div");
 topRight.style.cssText = `
    flex: ${config.rtwd || 45};
    padding: 1mm;
    font-size: ${config.rtfo}pt;
    line-height: 1.2;
    text-align: left;
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  `;

 // Add 7th column data (Payment Type) with prefix
 const line7 = document.createElement("div");
 line7.style.cssText = "margin-bottom: 1mm; min-height: 1.2em;";
 line7.textContent = headers[6] && rowData[6] ? `Payment type: ${rowData[6]}` : "Payment type: ";
 topRight.appendChild(line7);

 // Add 8th column data (Amount) with prefix and bold formatting
 const line8 = document.createElement("div");
 line8.style.cssText = "margin-bottom: 1mm; min-height: 1.2em; font-weight: bold;";
 line8.textContent = headers[7] && rowData[7] ? `Price: ₹${rowData[7]}/-` : "Price: ₹ /-";
 topRight.appendChild(line8);

 // Add 9th column data (Product Name) with prefix
 const line9 = document.createElement("div");
 line9.style.cssText = "min-height: 1.2em;";
 line9.textContent = headers[8] && rowData[8] ? `Product Name: ${rowData[8]}` : "Product Name: ";
 topRight.appendChild(line9);

 topSection.appendChild(topLeft);
 topSection.appendChild(topRight);

 // Bottom Section (contains Bottom Left and Bottom Right) - 40% height
 const bottomSection = document.createElement("div");
 bottomSection.style.cssText = `
    display: flex;
    flex: 0.4;
    min-height: 0;
    gap: 2mm;
    margin-top: 1mm;
    overflow: visible;
  `;

 // Section 3: Bottom Left - Empty (always visible) - 40% width
 const bottomLeft = document.createElement("div");
 bottomLeft.style.cssText = `
    flex: ${config.lbwd || 40};
    padding: 1mm;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10pt;
    color: #999;
    overflow: visible;
  `;
 // Empty section - no content but maintains border

 // Section 4: Bottom Right - Dynamic FROM address - 60% width
 const bottomRight = document.createElement("div");
 bottomRight.style.cssText = `
    flex: ${config.rbwd || 60};
    padding: 1mm;
    font-size: ${config.rbfo}pt;
    line-height: 1.1;
    text-align: left;
    border: 1px solid #ccc;
    background: #fff;
    overflow: visible;
    box-sizing: border-box;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `;

 // Build FROM address dynamically from the array
 let fromAddressHTML = '';
 fromAddress.forEach((line, index) => {
  if (index === 0) {
   fromAddressHTML += `<div style="font-weight: bold; margin-bottom: 0.3mm;">${line}</div>`;
  } else if (index === 1) {
   fromAddressHTML += `<div style="font-style: italic; margin-bottom: 0.5mm; font-size: ${config.rbfo - 1}pt;">${line}</div>`;
  } else {
   fromAddressHTML += `<div style="margin-bottom: 0.2mm;">${line}</div>`;
  }
 });

 bottomRight.innerHTML = fromAddressHTML;

 bottomSection.appendChild(bottomLeft);
 bottomSection.appendChild(bottomRight);

 // Add all sections to card
 card.appendChild(topSection);
 card.appendChild(bottomSection);

 return card;
}

function loadHtml2Canvas() {
 return new Promise((resolve, reject) => {
  const script = document.createElement("script");
  script.src =
   "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
 });
}

// Function to show error messages
function showError(message) {
 // Create a Bootstrap alert
 const alertDiv = document.createElement("div");
 alertDiv.className = "alert alert-danger alert-dismissible fade show mt-3";
 alertDiv.innerHTML = `
    <strong>Error!</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

 // Insert after the file input section
 const cardBody = document.querySelector(".card-body");
 const fileSection = cardBody.querySelector(".row.mb-4");
 fileSection.parentNode.insertBefore(alertDiv, fileSection.nextSibling);

 // Auto remove after 5 seconds
 setTimeout(() => {
  if (alertDiv.parentNode) {
   alertDiv.remove();
  }
 }, 5000);
}

// Helper function to create dynamic loader
function createDynamicLoader(message) {
 const loader = {
  removeLoader: function () {
   if (this.loaderElement && this.loaderElement.parentNode) {
    this.loaderElement.parentNode.removeChild(this.loaderElement);
   }
  }
 };

 const loaderElement = document.createElement('div');
 loaderElement.className = 'alert alert-info text-center';
 loaderElement.innerHTML = `
    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
    ${message}
  `;

 const cardBody = document.querySelector('.card-body');
 cardBody.insertBefore(loaderElement, cardBody.firstChild);

 loader.loaderElement = loaderElement;
 return loader;
}
