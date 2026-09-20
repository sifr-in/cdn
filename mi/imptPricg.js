// imptPricg.js - Import Pricing Data from Excel/CSV

var impRawData = [];
var impHeaders = [];
var impColumnMapping = {};
var impOriginalHeaders = [];
var impSplitHistory = [];
var impJsonResult = null;
var impCurrentFileName = "";

window.initImportPricing = function () {
  console.log("✅ Import Pricing module initialized");
};

// ============================================================
// SHOW IMPORT PRICING - Renders UI into #prdContent
// ============================================================

window.showImportPricing = function () {
  var container = document.getElementById("prdContent");
  if (!container) return;

  var now = new Date();
  var currentDate = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  var currentTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  var html = "";

  // Responsive styles for import pricing (ID-specific to override mi.js !important rules)
  html += '<style>';
  html += '@media(max-width:576px){';
  html += '#impFileInfo>div{flex-wrap:wrap!important;gap:6px!important;}';
  html += '#impFileInfo button{flex-shrink:0!important;}';
  html += '#impSplitRow{grid-template-columns:auto 1fr auto auto!important;}';
  html += '#impSplitRow select{min-width:0!important;width:100%;}';
  html += '#impMappingControls>div{gap:6px!important;}';
  html += '#impMappingControls>div>div{flex:1 1 calc(50% - 6px)!important;min-width:0!important;padding:4px 6px!important;font-size:11px!important;}';
  html += '#impMappingControls select{font-size:11px!important;min-width:50px!important;padding:2px 2px!important;}';
  html += '}';
  html += '</style>';

  // Back button + header
  html +=
    '<div class="milk-card" style="border:2px solid #ff5722;border-left:6px solid #ff5722;">';
  html +=
    '<div style="background:linear-gradient(135deg,#ff5722 0%,#e64a19 100%);color:white;padding:12px 15px;border-radius:10px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">';
  html += '<div style="display:flex;align-items:center;gap:10px;">';
  html +=
    '<button onclick="window.showMilkPricing()" style="background:rgba(255,255,255,0.2);border:none;color:white;font-size:18px;cursor:pointer;padding:5px 10px;border-radius:6px;"><i class="fas fa-arrow-left"></i></button>';
  html +=
    '<h5 class="mb-0"><i class="fas fa-file-import me-2"></i>Import Pricing Data</h5>';
  html += "</div>";
  html +=
    '<span style="font-size:13px;"><i class="far fa-clock"></i> ' +
    currentDate +
    " " +
    currentTime +
    "</span>";
  html += "</div>";

  // Step 1: Upload
  html +=
    '<div style="background:var(--surface);border-radius:12px;padding:15px;margin-bottom:15px;box-shadow:0 2px 10px rgba(0,0,0,0.08);">';
  html +=
    '<h6 style="color:#667eea;font-weight:600;"><i class="fas fa-upload me-1"></i> Step 1: Upload Excel/CSV</h6>';
  html +=
    '<div id="impFileDropZone" style="border:2px dashed #667eea;border-radius:12px;padding:30px;text-align:center;cursor:pointer;background:var(--surface-3);" onclick="document.getElementById(\'impFileInput\').click()">';
  html +=
    '<i class="fas fa-cloud-upload-alt" style="font-size:40px;color:#667eea;margin-bottom:10px;display:block;"></i>';
  html += "<h6>Click or Drag & Drop to Upload</h6>";
  html +=
    '<p style="color:#999;margin:0;font-size:12px;">.xlsx, .xls, .csv files</p>';
  html +=
    '<input type="file" id="impFileInput" accept=".xlsx,.xls,.csv" style="display:none;" />';
  html += "</div>";
  html += '<div id="impFileInfo" style="display:none;margin-top:10px;">';
  html +=
    '<div style="background:#e3f2fd;padding:10px 15px;border-radius:8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">';
  html +=
    '<div><i class="fas fa-file me-2"></i><strong id="impFileName">file.xlsx</strong> ';
  html +=
    '<span style="background:#90caf9;color:white;padding:2px 8px;border-radius:10px;font-size:11px;" id="impFileRows">0 rows</span> ';
  html +=
    '<span style="background:#42a5f5;color:white;padding:2px 8px;border-radius:10px;font-size:11px;" id="impFileCols">0 cols</span></div>';
  html +=
    '<button onclick="window.impClearFile()" style="background:#ef5350;color:white;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:12px;"><i class="fas fa-times"></i> Remove</button>';
  html += "</div></div>";
  html += "</div>";

  // Step 2: Mapping (hidden initially)
  html += '<div id="impPreviewSection" style="display:none;">';
  html +=
    '<div style="background:var(--surface);border-radius:12px;padding:15px;margin-bottom:15px;box-shadow:0 2px 10px rgba(0,0,0,0.08);">';
  html +=
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">';
  html +=
    '<h6 style="color:#667eea;font-weight:600;margin:0;"><i class="fas fa-table me-1"></i> Step 2: Map Columns & Preview</h6>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  html +=
    '<button onclick="window.impResetMapping()" style="background:#9e9e9e;color:white;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;"><i class="fas fa-undo"></i> Reset</button>';
  html +=
    '<button onclick="window.impGenerateJSON()" style="background:#4caf50;color:white;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;"><i class="fas fa-code"></i> Generate JSON</button>';
  html += "</div></div>";

  // Split options
  html +=
    '<div style="background:#fff3e0;padding:8px 12px;border-radius:6px;border-left:3px solid #ff9800;margin-bottom:12px;font-size:12px;">';
  html +=
    '<div id="impSplitRow" style="display:grid;grid-template-columns:auto 1fr auto auto;gap:6px;align-items:center;">';
  html += '<strong><i class="fas fa-cut me-1"></i> Split:</strong>';
  html +=
    '<select id="impSplitColumn" style="font-size:11px;padding:3px 6px;border-radius:4px;border:1px solid #ddd;min-width:100px;"><option value="">-- None --</option></select>';
  html +=
    '<input type="text" id="impSplitChar" placeholder="char" style="width:60px;font-size:11px;padding:3px 6px;border:1px solid #ddd;border-radius:4px;" />';
  html +=
    '<button onclick="window.impApplySplit()" style="background:#ff9800;color:white;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px;"><i class="fas fa-scissors"></i> Split</button>';
  html += "</div></div>";

  // Mapping controls
  html +=
    '<div style="background:#f8f9fa;padding:10px;border-radius:8px;margin-bottom:12px;">';
  html +=
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
  html +=
    '<label style="font-weight:600;font-size:12px;"><i class="fas fa-tag me-1"></i> Column Mapping</label>';
  html +=
    '<div><button onclick="window.impAutoDetect()" style="background:#667eea;color:white;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:10px;"><i class="fas fa-magic"></i> Auto</button> ';
  html +=
    '<button onclick="window.impSelectAll(true)" style="background:#9e9e9e;color:white;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:10px;">All</button> ';
  html +=
    '<button onclick="window.impSelectAll(false)" style="background:#9e9e9e;color:white;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:10px;">None</button></div>';
  html += "</div>";
  html += '<div id="impMappingControls"></div>';
  html += "</div>";

  // Preview table
  html += '<div style="margin-top:10px;">';
  html +=
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
  html +=
    '<strong style="font-size:12px;"><i class="fas fa-eye me-1"></i> Data Preview</strong>';
  html +=
    '<span style="color:#999;font-size:11px;">Click column header to split</span>';
  html += "</div>";
  html +=
    '<div style="max-height:400px;overflow:auto;border-radius:8px;border:1px solid #dee2e6;">';
  html += '<table style="width:100%;border-collapse:collapse;font-size:11px;">';
  html += '<thead id="impPreviewHead"></thead>';
  html += '<tbody id="impPreviewBody"></tbody>';
  html += "</table></div></div>";

  html += "</div></div>";

  // Step 3: JSON Output (hidden initially)
  html += '<div id="impJsonCard" style="display:none;">';
  html +=
    '<div style="background:var(--surface);border-radius:12px;padding:15px;margin-bottom:15px;box-shadow:0 2px 10px rgba(0,0,0,0.08);">';
  html +=
    '<div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">';
  html +=
    '<h6 style="color:#667eea;font-weight:600;margin:0;"><i class="fas fa-code me-1"></i> Step 3: JSON Output</h6>';
  html +=
    '<button onclick="window.impCopyJSON()" style="background:#667eea;color:white;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;"><i class="fas fa-copy"></i> Copy</button>';
  html +=
    '<button onclick="window.impDownloadJSON()" style="background:#42a5f5;color:white;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;"><i class="fas fa-download"></i> Download</button>';
  html +=
    '<button onclick="window.impSendToServer()" id="impSendButton" style="background:#ff5722;color:white;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;"><i class="fas fa-cloud-upload-alt"></i> Import to Server</button>';
  html += "</div>";
  html +=
    '<pre id="impJsonOutput" style="background:#1a1a2e;color:#00d4ff;padding:12px;border-radius:8px;font-size:11px;max-height:250px;overflow:auto;white-space:pre-wrap;word-break:break-all;margin:0;"></pre>';
  html += "</div></div>";

  html += "</div>";

  container.innerHTML = html;

  // Setup drag & drop
  window.impSetupDragDrop();
};

// ============================================================
// DRAG & DROP SETUP
// ============================================================

window.impSetupDragDrop = function () {
  var dropZone = document.getElementById("impFileDropZone");
  var fileInput = document.getElementById("impFileInput");

  if (fileInput) {
    fileInput.addEventListener("change", function (e) {
      if (this.files.length > 0) {
        window.impHandleFile(this.files[0]);
      }
    });
  }

  if (dropZone) {
    dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.style.background = "#e3f2fd";
    });
    dropZone.addEventListener("dragleave", function (e) {
      e.preventDefault();
      this.style.background = "#f8f9ff";
    });
    dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      this.style.background = "#f8f9ff";
      if (e.dataTransfer.files.length > 0) {
        window.impHandleFile(e.dataTransfer.files[0]);
      }
    });
  }
};

// ============================================================
// FILE HANDLING
// ============================================================

window.impHandleFile = function (file) {
  var reader = new FileReader();
  impCurrentFileName = file.name;

  reader.onload = function (e) {
    try {
      var data = e.target.result;
      var workbook;

      if (file.name.endsWith(".csv")) {
        var text = new TextDecoder("utf-8").decode(data);
        workbook = XLSX.read(text, { type: "string" });
      } else {
        workbook = XLSX.read(data, { type: "array" });
      }

      var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      var jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

      if (jsonData.length === 0) {
        showMessageModal("Error", "❌ No data found in the file!", true);
        return;
      }

      impRawData = jsonData;
      impHeaders = Object.keys(jsonData[0]);
      impOriginalHeaders = [...impHeaders];

      document.getElementById("impFileInfo").style.display = "block";
      document.getElementById("impFileName").textContent = file.name;
      document.getElementById("impFileRows").textContent =
        jsonData.length + " rows";
      document.getElementById("impFileCols").textContent =
        impHeaders.length + " cols";

      document.getElementById("impPreviewSection").style.display = "block";

      window.impInitializeMapping();
      window.impRenderTable();
      window.impRenderMappingControls();
      window.impPopulateSplitDropdown();
    } catch (err) {
      showMessageModal("Error", "❌ Error reading file: " + err.message, true);
      console.error(err);
    }
  };

  reader.readAsArrayBuffer(file);
};

window.impClearFile = function () {
  impRawData = [];
  impHeaders = [];
  impOriginalHeaders = [];
  impColumnMapping = {};
  impSplitHistory = [];
  impJsonResult = null;
  document.getElementById("impFileInput").value = "";
  document.getElementById("impFileInfo").style.display = "none";
  document.getElementById("impPreviewSection").style.display = "none";
  document.getElementById("impJsonCard").style.display = "none";
  document.getElementById("impJsonOutput").textContent = "";
};

// ============================================================
// COLUMN MAPPING
// ============================================================

window.impInitializeMapping = function () {
  impColumnMapping = {};
  impHeaders.forEach(function (h) {
    var lower = h.toLowerCase().trim();
    var mapped = "";

    if (
      lower.includes("date") ||
      lower.includes("day") ||
      lower.includes("d") ||
      lower.includes("तारीख")
    )
      mapped = "e";
    else if (
      lower.includes("animal") ||
      lower.includes("cow") ||
      lower.includes("buffalo") ||
      lower.includes("गाय") ||
      lower.includes("म्हैस")
    )
      mapped = "f";
    else if (lower.includes("fat") || lower.includes("चरबी")) mapped = "g";
    else if (
      lower.includes("snf") ||
      lower.includes("solid") ||
      lower.includes("घन")
    )
      mapped = "h";
    else if (
      lower.includes("price") ||
      lower.includes("rate") ||
      lower.includes("amt") ||
      lower.includes("amount") ||
      lower.includes("किंमत")
    )
      mapped = "i";
    else if (
      lower.includes("note") ||
      lower.includes("remark") ||
      lower.includes("desc") ||
      lower.includes("सूचना")
    )
      mapped = "j";

    impColumnMapping[h] = mapped;
  });
};

window.impRenderMappingControls = function () {
  var container = document.getElementById("impMappingControls");
  if (!container) return;
  var html = '<div style="display:flex;flex-wrap:wrap;gap:6px;">';

  impHeaders.forEach(function (h, index) {
    var mapped = impColumnMapping[h] || "";
    html +=
      '<div style="background:var(--surface-3);padding:4px 8px;border-radius:6px;border:1px solid var(--border);display:flex;align-items:center;gap:4px;flex-wrap:wrap;">';
    html +=
      '<input type="checkbox" class="impColCb" data-index="' +
      index +
      '" checked onchange="window.impUpdateMapping()" />';
    html +=
      '<span style="font-size:11px;font-weight:600;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' +
      h +
      '">' +
      window.impTruncate(h, 15) +
      "</span>";
    html +=
      '<select style="font-size:10px;padding:2px 3px;min-width:70px;border:1px solid #ddd;border-radius:3px;" data-column="' +
      h +
      '" onchange="window.impUpdateColMapping(this)">';
    html += '<option value="">--</option>';
    html +=
      '<option value="e" ' +
      (mapped === "e" ? "selected" : "") +
      ">Date</option>";
    html +=
      '<option value="f" ' +
      (mapped === "f" ? "selected" : "") +
      ">Animal</option>";
    html +=
      '<option value="g" ' +
      (mapped === "g" ? "selected" : "") +
      ">FAT</option>";
    html +=
      '<option value="h" ' +
      (mapped === "h" ? "selected" : "") +
      ">SNF</option>";
    html +=
      '<option value="i" ' +
      (mapped === "i" ? "selected" : "") +
      ">Price</option>";
    html +=
      '<option value="j" ' +
      (mapped === "j" ? "selected" : "") +
      ">Note</option>";
    html += "</select></div>";
  });

  html += "</div>";
  container.innerHTML = html;
};

window.impUpdateColMapping = function (select) {
  var column = select.getAttribute("data-column");
  impColumnMapping[column] = select.value;
};

window.impUpdateMapping = function () {};

window.impAutoDetect = function () {
  window.impInitializeMapping();
  window.impRenderMappingControls();
  window.impRenderTable();
};

window.impSelectAll = function (select) {
  document.querySelectorAll(".impColCb").forEach(function (cb) {
    cb.checked = select;
  });
};

window.impResetMapping = function () {
  impHeaders = [...impOriginalHeaders];
  impSplitHistory = [];
  window.impInitializeMapping();
  window.impRenderTable();
  window.impRenderMappingControls();
  window.impPopulateSplitDropdown();
};

// ============================================================
// COLUMN SPLIT
// ============================================================

window.impPopulateSplitDropdown = function () {
  var select = document.getElementById("impSplitColumn");
  if (!select) return;
  var currentVal = select.value;
  select.innerHTML = '<option value="">-- None --</option>';
  impHeaders.forEach(function (h) {
    var selected = h === currentVal ? "selected" : "";
    select.innerHTML +=
      '<option value="' +
      h +
      '" ' +
      selected +
      ">" +
      window.impTruncate(h, 25) +
      "</option>";
  });
};

window.impApplySplit = function () {
  var column = document.getElementById("impSplitColumn").value;
  var splitChar = document.getElementById("impSplitChar").value;

  if (!column) {
    showMessageModal("Validation", "❌ Select a column to split!", true);
    return;
  }
  if (!splitChar) {
    showMessageModal("Validation", "❌ Enter a split character!", true);
    return;
  }

  var hasData = impRawData.some(function (row) {
    return String(row[column] || "").includes(splitChar);
  });
  if (!hasData) {
    showMessageModal("Info", '⚠️ No data contains "' + splitChar + '"', true);
    return;
  }

  var maxParts = 0;
  impRawData.forEach(function (row) {
    var parts = String(row[column] || "")
      .split(splitChar)
      .map(function (s) {
        return s.trim();
      });
    if (parts.length > maxParts) maxParts = parts.length;
  });

  var newColumns = [];
  for (var i = 1; i <= maxParts; i++) newColumns.push(column + "_" + i);

  var newData = [];
  impRawData.forEach(function (row) {
    var parts = String(row[column] || "")
      .split(splitChar)
      .map(function (s) {
        return s.trim();
      });
    var newRow = {};
    impHeaders.forEach(function (h) {
      if (h !== column) newRow[h] = row[h] || "";
    });
    for (var j = 0; j < maxParts; j++) {
      newRow[column + "_" + (j + 1)] = j < parts.length ? parts[j] : "";
    }
    newData.push(newRow);
  });

  var idx = impHeaders.indexOf(column);
  if (idx !== -1) impHeaders.splice(idx, 1);
  newColumns.forEach(function (col) {
    if (!impHeaders.includes(col)) impHeaders.push(col);
  });

  impRawData = newData;
  impSplitHistory.push({
    column: column,
    splitChar: splitChar,
    newColumns: newColumns,
  });

  window.impRenderTable();
  window.impRenderMappingControls();
  window.impPopulateSplitDropdown();
};

// ============================================================
// RENDER TABLE
// ============================================================

window.impRenderTable = function () {
  var thead = document.getElementById("impPreviewHead");
  var tbody = document.getElementById("impPreviewBody");
  if (!thead || !tbody) return;

  var headerHtml = "<tr>";
  impHeaders.forEach(function (h) {
    var mapped = impColumnMapping[h] || "";
    var label = mapped ? " (" + mapped + ")" : "";
    headerHtml +=
      '<th style="background:#667eea;color:white;padding:6px 8px;cursor:pointer;white-space:nowrap;font-size:11px;position:sticky;top:0;z-index:10;" onclick="window.impSplitByClick(\'' +
      h.replace(/'/g, "\\'") +
      '\')" title="Click to split">' +
      window.impTruncate(h, 18) +
      label +
      "</th>";
  });
  headerHtml += "</tr>";
  thead.innerHTML = headerHtml;

  var displayData = impRawData.slice(0, 100);
  var bodyHtml = "";
  displayData.forEach(function (row) {
    bodyHtml += "<tr>";
    impHeaders.forEach(function (h) {
      bodyHtml +=
        '<td style="padding:4px 8px;font-size:11px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
        window.impTruncate(String(row[h] || ""), 25) +
        "</td>";
    });
    bodyHtml += "</tr>";
  });

  if (impRawData.length > 100) {
    bodyHtml +=
      '<tr><td colspan="' +
      impHeaders.length +
      '" style="text-align:center;color:#999;font-style:italic;padding:8px;">... and ' +
      (impRawData.length - 100) +
      " more rows</td></tr>";
  }

  tbody.innerHTML = bodyHtml;
};

window.impSplitByClick = function (columnName) {
  var select = document.getElementById("impSplitColumn");
  if (select) select.value = columnName;
  var charInput = document.getElementById("impSplitChar");
  if (charInput) charInput.focus();
};

window.impTruncate = function (text, maxLen) {
  if (!text) return "";
  var str = String(text);
  return str.length <= maxLen ? str : str.substring(0, maxLen) + "...";
};

// ============================================================
// GENERATE JSON
// ============================================================

window.impGenerateJSON = function () {
  var selectedColumns = [];
  document.querySelectorAll(".impColCb").forEach(function (cb) {
    if (cb.checked) {
      var index = parseInt(cb.getAttribute("data-index"));
      if (impHeaders[index]) selectedColumns.push(impHeaders[index]);
    }
  });

  if (selectedColumns.length === 0) {
    showMessageModal("Validation", "⚠️ Select at least one column!", true);
    return;
  }

  var mapping = {};
  impHeaders.forEach(function (h) {
    var mapped = impColumnMapping[h] || "";
    if (mapped) mapping[h] = mapped;
  });

  // Check if required fields are mapped
  var hasRequired = Object.values(mapping).some(function (v) {
    return v === "e" || v === "f" || v === "g" || v === "h" || v === "i";
  });

  if (!hasRequired) {
    if (
      !confirm(
        "⚠️ No required fields (Date, Animal, FAT, SNF, Price) are mapped.\n\nContinue anyway?",
      )
    ) {
      return;
    }
  }

  function excelSerialToDate(serial) {
    var excelEpoch = new Date(1899, 11, 30);
    var date = new Date(excelEpoch.getTime() + serial * 86400000);
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  }

  function parseDate(value) {
    if (!value) return "";
    var dateObj = new Date(value);
    if (
      !isNaN(dateObj.getTime()) &&
      typeof value === "string" &&
      value.match(/[a-zA-Z]/)
    ) {
      return (
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0")
      );
    }
    var numValue = parseFloat(value);
    if (
      !isNaN(numValue) &&
      numValue > 0 &&
      numValue < 100000 &&
      Number.isInteger(numValue)
    ) {
      return excelSerialToDate(numValue);
    }
    dateObj = new Date(value);
    if (!isNaN(dateObj.getTime())) {
      return (
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0")
      );
    }
    return value;
  }

  var result = [];
  impRawData.forEach(function (row, rowIndex) {
    var obj = {};
    selectedColumns.forEach(function (col) {
      var key = mapping[col] || col;
      var value = row[col] || "";

      if (key === "e" && value) {
        value = parseDate(value);
      } else if (key === "f" && value) {
        var animalNum = parseInt(value);
        if (!isNaN(animalNum) && animalNum >= 1 && animalNum <= 2) {
          value = animalNum;
        } else {
          var lower = String(value).toLowerCase();
          if (
            lower.includes("buffalo") ||
            lower.includes("buffelo") ||
            lower.includes("bhains") ||
            lower.includes("म्हैस")
          ) {
            value = 1;
          } else if (
            lower.includes("cow") ||
            lower.includes("gai") ||
            lower.includes("गाय")
          ) {
            value = 2;
          } else {
            value = parseInt(value) || 1;
          }
        }
      } else if ((key === "g" || key === "h" || key === "i") && value) {
        value = parseFloat(value) || 0;
      }

      obj[key] = value;
    });
    // Store original row number for duplicate reporting
    obj._rowNum = rowIndex + 2; // +2 because Excel row 1 is header, data starts at row 2
    result.push(obj);
  });

  // ============================================================
  // DUPLICATE DETECTION (BEFORE generating JSON)
  // ============================================================

  var seen = {};
  var duplicateDetails = [];

  result.forEach(function (obj, idx) {
    // Create unique key from: date + animal + fat + snf + price
    var key = [
      obj.e || "",
      obj.f || "",
      parseFloat(obj.g || 0).toFixed(3),
      parseFloat(obj.h || 0).toFixed(3),
    ].join("||");

    if (!seen[key]) {
      seen[key] = [];
    }
    seen[key].push({
      rowNum: obj._rowNum,
      index: idx,
    });
  });

  // Find keys with more than 1 occurrence
  Object.keys(seen).forEach(function (key) {
    if (seen[key].length > 1) {
      duplicateDetails.push({
        key: key,
        entries: seen[key],
      });
    }
  });

  // ✅ If duplicates found, show detailed message and STOP
  if (duplicateDetails.length > 0) {
    var msg = "⚠️ DUPLICATE ENTRIES FOUND!\n\n";
    msg +=
      "Found " + duplicateDetails.length + " duplicate group(s) in Excel.\n";
    msg += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    duplicateDetails.forEach(function (dup, i) {
      var parts = dup.key.split("||");
      var animalName =
        parts[1] == "1" ? "🐃 Buffalo" : parts[1] == "2" ? "🐄 Cow" : "Unknown";

      msg += i + 1 + ". " + animalName + "\n";
      msg += "   Date: " + parts[0] + "\n";
      msg +=
        "   FAT: " +
        parts[2] +
        " | SNF: " +
        parts[3] +
        "\n";
      var rowNums = dup.entries.map(function (e) {
        return "Row " + e.rowNum;
      });
      msg += "   🔴 Remove row(s): " + rowNums.join(", ") + "\n\n";
    });

    msg += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    msg += "Please remove duplicate entries from Excel and re-import.\n";
    msg += "OR deselect columns to change the duplicate key.";

    showMessageModal("Duplicate Detected", msg, true);

    // Clear any previous JSON
    impJsonResult = null;
    document.getElementById("impJsonCard").style.display = "none";
    document.getElementById("impJsonOutput").textContent = "";

    return; // ✅ STOP here, don't generate JSON
  }

  // ============================================================
  // NO DUPLICATES - Generate JSON
  // ============================================================

  // Remove _rowNum from objects before sending
  var cleanResult = result.map(function (obj) {
    var clean = {};
    Object.keys(obj).forEach(function (k) {
      if (k !== "_rowNum") {
        clean[k] = obj[k];
      }
    });
    return clean;
  });

  // ✅ Build proper payload0 structure
  if (typeof payload0 === "undefined") {
    window.payload0 = {};
  }

  clearPayload0();

  payload0.eo = "0.0000000000";
  payload0.ec = "z";
  payload0.fi = 0;
  payload0.fk = 0;
  payload0.la = [];
  payload0.vw = 1;
  payload0.fn = 71;
  payload0.p = cleanResult;

  impJsonResult = JSON.parse(JSON.stringify(payload0));

  var jsonOutput = document.getElementById("impJsonOutput");
  if (jsonOutput) jsonOutput.textContent = JSON.stringify(payload0, null, 2);
  var jsonCard = document.getElementById("impJsonCard");
  if (jsonCard) jsonCard.style.display = "block";

  window.impShowToast(
    "✅ JSON generated! " + cleanResult.length + " records (no duplicates)",
  );

};
// ============================================================
// COPY / DOWNLOAD / SEND
// ============================================================

window.impCopyJSON = function () {
  var text = document.getElementById("impJsonOutput").textContent;
  navigator.clipboard
    .writeText(text)
    .then(function () {
      window.impShowToast("✅ Copied!");
    })
    .catch(function () {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      window.impShowToast("✅ Copied!");
    });
};

window.impDownloadJSON = function () {
  var text = document.getElementById("impJsonOutput").textContent;
  var blob = new Blob([text], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download =
    "pricing_data_" + new Date().toISOString().split("T")[0] + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  window.impShowToast("✅ Downloaded!");
};

window.impSendToServer = async function () {
  if (!impJsonResult) {
    showMessageModal("Validation", "⚠️ Generate JSON first!", true);
    return;
  }

  if (!impJsonResult.p || impJsonResult.p.length === 0) {
    showMessageModal("Validation", "⚠️ No records to send!", true);
    return;
  }

  var sendButton = document.getElementById("impSendButton");
  var originalHtml = sendButton.innerHTML;
  sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  sendButton.disabled = true;

  try {
    // ✅ Use the global payload0 and update it
    clearPayload0();
    payload0.p = impJsonResult.p;
    payload0.vw = 1;
    payload0.fn = 71;
    // ✅ Get la from IndexedDB (like pricing.js does)
    if (typeof dbDexieManager !== "undefined" && typeof dbnm !== "undefined") {
      try {
        payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
          { tb: "mb" },
        ]);
      } catch (e) {
        console.warn("⚠️ Could not get la records:", e.message);
        payload0.la = [];
      }
    }

    console.log("📤 Sending payload:", {
      records: payload0.p.length,
      fn: payload0.fn,
      vw: payload0.vw,
      mk: payload0.mk ? "✓" : "✗",
      la: payload0.la ? payload0.la.length : 0,
    });

    if (typeof fnj3 === "function") {
      var response = await fnj3(
        "https://my1.in/2/h.php",
        payload0,
        1,
        true,
        null,
        20000,
        0,
        1,
        1,
      );

      console.log("📥 Server response:", {
        su: response ? response.su : "NO RESPONSE",
        ms: response ? response.ms : "",
        hasData: response ? !!response.data : false,
      });

      if (response && response.su == 1) {
        // ✅ Process response (may update other tables)
        if (typeof handl_mi_rspons === "function") {
          await handl_mi_rspons(response, 0);
        }

        // ✅ Verify data saved
        setTimeout(async function () {
          try {
            var records = await dbDexieManager.getAllRecords(dbnm, "mb");
            console.log("📊 Total mb records after import:", records.length);

            var msg = "✅ Success!\n\n";
            msg += "📤 Records sent: " + impJsonResult.p.length + "\n";
            msg += "📊 Total in database: " + records.length + "\n\n";
            msg += "Go to Pricing History to view all records.";

            showMessageModal("Success", msg, false);
          } catch (e) {
            console.error("Error checking records:", e);
            showMessageModal("Success",
              "✅ Records imported successfully!\n\n" +
                impJsonResult.p.length +
                " records sent.",
              false,
            );
          }
        }, 500);
      } else {
        var errMsg = response
          ? response.ms || "Server rejected the data"
          : "No response from server";
        console.error("❌ Server rejected:", response);
        showMessageModal("Error", "❌ Import failed!\n\n" + errMsg, true);
      }
    } else {
      showMessageModal("Error",
        "❌ Server connection function (fnj3) not available!\n\nPlease check your internet connection.",
        true,
      );
    }
  } catch (err) {
    console.error("❌ Error sending:", err);
    showMessageModal("Error", "❌ Error: " + err.message + "\n\nPlease try again.", true);
  } finally {
    if (sendButton) {
      sendButton.innerHTML = originalHtml;
      sendButton.disabled = false;
    }
  }
};

// ============================================================
// TOAST
// ============================================================

window.impShowToast = function (message) {
  var toast = document.createElement("div");
  toast.style.cssText =
    "position:fixed;bottom:20px;right:20px;background:#333;color:white;padding:12px 24px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.3);z-index:99999;font-size:14px;max-width:400px;transition:opacity 0.3s;";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity = "0";
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3000);
};
