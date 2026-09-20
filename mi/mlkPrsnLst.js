// ============================================================
// mlkPrsnLst.js - Display milk suppliers with detailed reports
// ============================================================

// ============================================================
// PLACEHOLDER FUNCTIONS (to prevent errors from other modules)
// ============================================================

function filterPersonsByCategory(category) {
  showPersonList();
}

function showSupplierPaymentModal(personId) {
  showMessageModal(
    "Info",
    "Payment functionality is available in the Payment section.",
    false,
  );
}

function submitSupplierPayment(personId) {
  showMessageModal(
    "Info",
    "Payment functionality is available in the Payment section.",
    false,
  );
}

// ============================================================
// CALLBACK: Runs after user selects a supplier from the modal
// ============================================================

window.commonFnToRunAfter_op_ViewCall_List = function (selectedData) {
  if (selectedData && selectedData.a) {
    var personId = selectedData.a;
    var supplierIdField = document.getElementById("supplierId");
    var clientDisplay = document.getElementById("clientDisplay");
    var searchInput = document.getElementById("uniqueIdSearchInput");
    var openBtn = document.getElementById("openSupplierListBtn");

    if (supplierIdField) {
      supplierIdField.value = personId;

      // ✅ Get person details
      var persons = window.milk_persons || [];
      var person = persons.find(function (p) {
        return String(p.a) == String(personId);
      });

      if (person && clientDisplay) {
        var name = person.h || person.i || person.e || "Unnamed";
        var phone = person.e || "";
        var uniqueId = person.k || "";

        // ✅ Display supplier with Unique ID
        clientDisplay.value =
          "🆔 " + (uniqueId || "N/A") + " | " + name + " | 📱 " + phone;
        clientDisplay.style.color = "#1a237e";
        clientDisplay.style.fontWeight = "bold";
        clientDisplay.style.background = "#e8f5e9";
        clientDisplay.style.borderColor = "#4caf50";

        // ✅ Update search input with the ID
        if (searchInput) {
          searchInput.value = uniqueId || name;
        }

        // ✅ Hide + button
        if (openBtn) {
          openBtn.style.display = "none";
        }

        // Store unique ID for reference
        document.getElementById("selectedUniqueId").value = uniqueId || "";
        window._selectedSupplier = person;
      }

      window.loadPersonReport();
    }
  }
};

// ============================================================
// MAIN PERSON LIST FUNCTION - Builds the UI
// ============================================================

function initPersonList() {}

function showPersonList() {
  var container = document.getElementById("prdContent");
  if (!container) return;

  var now = new Date();
  var currentDate = formatDateYYYYMMDD(now);
  var firstDayOfMonth = formatDateYYYYMMDD(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  var lastDayOfMonth = formatDateYYYYMMDD(
    new Date(now.getFullYear(), now.getMonth() + 1, 0),
  );

  var html = "";
  html +=
    '<div class="milk-card">';

  // Header
  html +=
    '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 15px; border-radius: 10px; margin-bottom: 12px; text-align: center;">';
  html +=
    '<h5 class="mb-0" style="font-size:16px;"><i class="fas fa-users me-2"></i>Milk Suppliers</h5>';
  html += "</div>";

  // Styles
  html += "<style>";
  html +=
    ".section-box { padding:10px; border-radius:8px; margin-bottom:8px; border:2px solid #e0e0e0; }";
  html += ".section-orange { background:#fff3e0; border-color:#ff9800; }";
  html += ".section-blue { background:#e8eaf6; border-color:#5c6bc0; }";
  html += ".section-green { background:#e8f5e9; border-color:#4caf50; }";
  html += ".section-purple { background:#f3e5f5; border-color:#9c27b0; }";
  html += ".client-input { cursor:pointer; background:var(--surface-3); }";
  html +=
    ".client-input:hover { border-color:#667eea !important; background:var(--surface-2); }";
  html +=
    ".report-table { font-size:11px; width:100%; border-collapse:separate; border-spacing:0; }";
  html +=
    ".report-table th { background:#667eea; color:white; padding:6px 4px; text-align:center; font-weight:600; white-space:nowrap; }";
  html +=
    ".report-table td { padding:5px 4px; text-align:center; border-bottom:2px solid var(--border); white-space:nowrap; }";
  html += ".report-table tr:hover { background:#F4EDDC; }";
  html +=
    ".report-table .total-row { background:#e8eaf6; font-weight:700; border-top:2px solid #667eea; }";
  html += ".report-table .total-row td { padding:6px 4px; }";
  html +=
    ".report-table .summary-row { background:#fff8e1; font-weight:700; border-top:2px solid #ff9800; }";
  html += ".report-table .summary-row td { padding:6px 4px; }";
  html +=
    ".report-table .fixed-col { position:sticky; left:0; background:var(--surface); z-index:2; border-right:3px solid #667eea; min-width:35px; }";
  html +=
    ".report-table .fixed-col-header { position:sticky; left:0; background:#667eea; z-index:3; border-right:3px solid #5a6fd6; min-width:35px; }";
  html += ".report-table .total-row .fixed-col { background:#e8eaf6; }";
  html += ".report-table .summary-row .fixed-col { background:#fff8e1; }";
  html +=
    ".filter-select { font-size:12px; padding:4px 6px; border-radius:4px; border:1px solid #ccc; }";
  html += ".scroll-wrapper { overflow-x:auto; margin-top:5px; }";
  html +=
    ".print-btn { background:#667eea; color:white; border:none; padding:6px 15px; border-radius:6px; font-size:13px; cursor:pointer; }";
  html += ".print-btn:hover { background:#5a6fd6; }";
  html += "@media print { .no-print { display:none !important; } }";
  html +=
    ".summary-flex { display:flex; justify-content:center; gap:20px; flex-wrap:wrap; }";
  html +=
    ".summary-item { background:#fff3e0; padding:6px 15px; border-radius:6px; font-size:12px; border:1px solid #ff9800; }";
  html += ".summary-item strong { color:#e65100; }";
  html += ".empty-cell { color:#ccc; font-size:10px; }";
  html +=
    ".search-input { border:2px solid #667eea; padding:6px 10px; border-radius:6px; width:100%; font-size:14px; }";
  html +=
    ".search-input:focus { outline:none; border-color:#764ba2; box-shadow:0 0 0 3px rgba(102,126,234,0.2); }";
  html +=
    ".filter-group { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }";
  html += ".filter-group .filter-item { flex:1; min-width:80px; }";
  html += ".filter-group .filter-item-date { flex:1; min-width:100px; }";
  html +=
    ".date-label { font-size:11px; font-weight:700; color:#5c6bc0; display:block; margin-bottom:2px; }";
  html +=
    ".date-input { font-size:12px; padding:4px 6px; border-radius:4px; border:1.5px solid #5c6bc0; width:100%; }";
  html +=
    ".date-input:focus { outline:none; border-color:#667eea; box-shadow:0 0 0 2px rgba(102,126,234,0.2); }";
  html +=
    ".filter-btn { background:#667eea; color:white; border:none; padding:4px 16px; border-radius:4px; font-size:12px; cursor:pointer; transition:background 0.2s; margin-top:16px; }";
  html += ".filter-btn:hover { background:#5a6fd6; }";
  html +=
    ".reset-btn { background:#6c757d; color:white; border:none; padding:4px 16px; border-radius:4px; font-size:12px; cursor:pointer; transition:background 0.2s; margin-top:16px; }";
  html += ".reset-btn:hover { background:#5a6268; }";
  html +=
    ".date-range-display { text-align:center; font-size:11px; color:#666; padding:4px; background:#e8eaf6; border-radius:4px; margin-top:4px; }";
  html +=
    ".report-cards { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:12px; margin-top:5px; }";
  html +=
    ".day-card { background:var(--surface); border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden; border:1px solid var(--border); }";
  html +=
    ".day-card-header { background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:#fff; padding:10px 14px; display:flex; align-items:center; gap:10px; }";
  html +=
    ".day-num { background:rgba(255,255,255,0.2); border-radius:8px; font-size:20px; font-weight:800; padding:4px 10px; min-width:48px; text-align:center; }";
  html += ".day-date { font-size:13px; font-weight:700; line-height:1.2; }";
  html +=
    ".day-weekday { font-size:11px; opacity:0.85; text-transform:capitalize; }";
  html +=
    ".session-block { padding:10px 14px; border-top:1px solid var(--border); }";
  html +=
    ".session-block.session-morning { background:#f1f8e9; border-left:5px solid #4caf50; }";
  html +=
    ".session-block.session-evening { background:#fff3e0; border-left:5px solid #ff9800; }";
  html +=
    ".session-title { font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; }";
  html +=
    ".session-morning .session-title { color:#2e7d32; }";
  html +=
    ".session-evening .session-title { color:#e65100; }";
  html +=
    ".session-amount { font-size:18px; font-weight:800; color:#1a237e; }";
  html +=
    ".session-meta { font-size:11px; color:#555; margin-top:2px; }";
  html +=
    ".session-meta .meta-sep { margin:0 3px; color:#aaa; }";
  html +=
    ".day-card-total { background:var(--surface-2); padding:8px 14px; font-size:12px; font-weight:700; color:#333; display:flex; justify-content:space-between; align-items:center; }";
  html +=
    ".day-card-total .total-amt { color:#c62828; font-size:14px; }";
  html +=
    ".report-cards .empty-state { grid-column:1 / -1; text-align:center; color:#999; padding:20px; background:var(--surface-2); border-radius:10px; }";
  html +=
    "@media (max-width: 480px) { .report-cards { grid-template-columns:1fr; } }";
  html +=
    "@media print { .day-card { break-inside: avoid; box-shadow:none; } .session-morning { border-left:5px solid #4caf50 !important; } .session-evening { border-left:5px solid #ff9800 !important; } }";
  html += "</style>";

  html += '<form onsubmit="return false;" autocomplete="off">';

  // ============================================================
  // SECTION 1: Supplier Search with + Button
  // ============================================================
  html += '<div class="section-box section-orange no-print">';
  html +=
    '<label class="form-label fw-bold mb-1" style="color: #e65100; font-size: 12px;"><i class="fas fa-user"></i> Supplier Search</label>';

  // ✅ Search Row - Auto-search on input
  html +=
    '<div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px;">';
  html += '<div style="flex: 1;">';
  html +=
    '<input type="text" id="uniqueIdSearchInput" class="search-input" placeholder="🔍 Enter Unique ID, Name or Mobile..." style="border: 2px solid #667eea; padding: 6px 10px; border-radius: 6px; width: 100%; font-size: 14px;">';
  html += "</div>";
  // ✅ + Button - Hidden by default, shows only when supplier NOT found
  html +=
    '<button type="button" id="openSupplierListBtn" class="btn btn-success btn-sm" style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: bold; cursor: pointer; white-space: nowrap; display: none;">';
  html += '<i class="fas fa-plus"></i> Add';
  html += "</button>";
  html += "</div>";

  // ✅ Display selected supplier
  html += '<div style="position:relative;">';
  html +=
    '<input id="clientDisplay" type="text" class="form-control form-control-sm client-input" readonly placeholder="No supplier selected..." style="border: 2px solid #ff9800; font-weight:500; cursor:default; background:#f5f5f5; padding:6px 10px; border-radius:6px; width:100%; font-size:14px; color:#666;">';
  html += '<div id="supplierDropdown" style="display:none; position:absolute; top:100%; left:0; right:0; z-index:9999; background:white; border:2px solid #667eea; border-radius:8px; max-height:220px; overflow-y:auto; width:100%; box-shadow:0 4px 12px rgba(0,0,0,0.15);"></div>';
  html += '</div>';
  html += '<input type="hidden" id="supplierId" value="">';
  html += '<input type="hidden" id="selectedUniqueId" value="">';
  html += "</div>";

  // ============================================================
  // SECTION 2: Filters - Date Range, Animal, Print Button
  // ============================================================
  html += '<div class="section-box section-blue no-print">';
  html += '<div class="filter-group">';

  // From Date
  html += '<div class="filter-item-date">';
  html += '<label class="date-label">📅 From</label>';
  html +=
    '<input type="date" id="filterFromDate" class="date-input" value="' +
    firstDayOfMonth +
    '">';
  html += "</div>";

  // To Date
  html += '<div class="filter-item-date">';
  html += '<label class="date-label">📅 To</label>';
  html +=
    '<input type="date" id="filterToDate" class="date-input" value="' +
    lastDayOfMonth +
    '">';
  html += "</div>";

  // Animal Filter
  html += '<div class="filter-item">';
  html += '<label class="date-label">🐄 Animal</label>';
  html +=
    '<select class="form-select form-select-sm filter-select" id="filterAnimal" style="border:2px solid #5c6bc0; font-size:12px; padding:4px 6px; width:100%;">';
  html += '<option value="all">All</option>';
  html += '<option value="1">🐃 Buffalo</option>';
  html += '<option value="2">🐄 Cow</option>';
  html += "</select>";
  html += "</div>";

  // Apply Button
  html += '<div class="filter-item" style="flex:0.5; min-width:70px;">';
  html +=
    '<button class="filter-btn" onclick="window.applyDateFilter()" style="margin-top:16px;"><i class="fas fa-filter"></i> Apply</button>';
  html += "</div>";

  // Print Button
  html +=
    '<div class="filter-item" style="flex:0.3; min-width:50px; text-align:right;">';
  html +=
    '<button class="print-btn" onclick="window.printReport()" style="margin-top:16px;"><i class="fas fa-print"></i></button>';
  html += "</div>";

  html += "</div>";

  // Date Range Display
  html +=
    '<div class="date-range-display" id="dateRangeDisplay">📌 Showing records from <strong id="displayFromDate">' +
    formatDateDisplay(firstDayOfMonth) +
    '</strong> to <strong id="displayToDate">' +
    formatDateDisplay(lastDayOfMonth) +
    "</strong></div>";
  html += "</div>";

  // ============================================================
  // SECTION 3: Report Container (hidden until supplier selected)
  // ============================================================
  html += '<div id="reportContainer" style="display:none;">';

  // Person Info Section
  html += '<div class="section-box section-green" id="personInfo">';
  html += '<div id="personInfoContent" style="text-align:center;">';
  html +=
    '<div style="font-size:16px;font-weight:700;color:#1a237e;" id="personName">-</div>';
  html += '<div style="font-size:13px;color:#666;" id="personDetails">-</div>';
  html += "</div>";
  html += "</div>";

  // Report Table with Horizontal Scroll
  html += '<div class="section-box section-purple">';
  html +=
    '<div id="reportHeader" style="text-align:center;font-weight:700;color:#6a1b9a;font-size:14px;margin-bottom:8px;">📊 Milk Collection Report</div>';
  html += '<div class="scroll-wrapper" id="scrollWrapper">';
  html += '<table class="report-table" id="reportTable">';
  html += "<thead>";
  html += "<tr>";
  html += '<th class="fixed-col-header" rowspan="2">D</th>';
  html +=
    '<th colspan="5" style="background:#4CAF50; border-right:2px solid #a5d6a7;">Morning</th>';
  html +=
    '<th colspan="5" style="background:#FF9800; border-left:2px solid #a5d6a7;">Evening</th>';
  html += "</tr>";
  html += "<tr>";
  html += '<th style="border-right:1px solid #e8f5e9;">Qty</th>';
  html += '<th style="border-right:1px solid #e8f5e9;">Fat</th>';
  html += '<th style="border-right:1px solid #e8f5e9;">SNF</th>';
  html += '<th style="border-right:1px solid #e8f5e9;">Rate</th>';
  html += '<th style="border-right:2px solid #a5d6a7;">Amt</th>';
  html +=
    '<th style="border-left:2px solid #a5d6a7; border-right:1px solid #fff3e0;">Qty</th>';
  html += '<th style="border-right:1px solid #fff3e0;">Fat</th>';
  html += '<th style="border-right:1px solid #fff3e0;">SNF</th>';
  html += '<th style="border-right:1px solid #fff3e0;">Rate</th>';
  html += "<th>Amt</th>";
  html += "</tr>";
  html += "</thead>";
  html += '<tbody id="reportBody">';
  html +=
    '<tr><td colspan="11" style="text-align:center;color:#999;padding:20px;">No data available. Please select a client.</td></tr>';
  html += "</tbody>";
  html += "</table>";
  html += "</div>";
  html +=
    '<div id="scrollHint" style="text-align:center;font-size:10px;color:#999;margin-top:5px;">← Scroll horizontally → (D column is fixed)</div>';
  html += "</div>";

  // Card view container (shown when changeToView === "1")
  html += '<div id="reportCards" class="report-cards" style="display:none;"></div>';

  html += "</div>"; // end reportContainer

  html += "</form></div>";

  container.innerHTML = html;

  // ✅ Setup event listeners
  setupListEventListeners();

  // Auto-load if supplier already selected
  if (document.getElementById("supplierId")?.value) {
    setTimeout(function () {
      window.loadPersonReport();
    }, 200);
  }
}

// ============================================================
// SETUP LIST EVENT LISTENERS
// ============================================================

function setupListEventListeners() {
  var searchInput = document.getElementById("uniqueIdSearchInput");
  var openBtn = document.getElementById("openSupplierListBtn");

  // ✅ Auto-search on input (as user types)
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchSupplierForList();
    });
  }

  // ✅ Open supplier list on + button click (only visible when supplier NOT found)
  if (openBtn) {
    openBtn.addEventListener("click", function () {
      window.openSupplierList(
        "commonFnToRunAfter_op_ViewCall_List",
        typeof window[my1uzr.worknOnPg].clientConfig?.xtraEiFlds_ei_admin_srchGuest !== "undefined"
          ? window[my1uzr.worknOnPg].clientConfig?.xtraEiFlds_ei_admin_srchGuest
          : null,
      );
    });
  }
}

// ============================================================
// SEARCH SUPPLIER FOR LIST - Auto-search on input
// ============================================================

async function searchSupplierForList() {
  var searchInput = document.getElementById("uniqueIdSearchInput");
  var clientDisplay = document.getElementById("clientDisplay");
  var supplierIdField = document.getElementById("supplierId");
  var reportContainer = document.getElementById("reportContainer");
  var openBtn = document.getElementById("openSupplierListBtn");
  var personNameEl = document.getElementById("personName");
  var personDetailsEl = document.getElementById("personDetails");

  var searchTerm = searchInput?.value?.trim() || "";

  closeSupplierDropdown();

  // ✅ If search is empty, reset everything
  if (!searchTerm) {
    clientDisplay.value = "No supplier selected...";
    clientDisplay.style.color = "#666";
    clientDisplay.style.background = "#f5f5f5";
    clientDisplay.style.borderColor = "#ff9800";
    supplierIdField.value = "";
    document.getElementById("selectedUniqueId").value = "";
    window._selectedSupplier = null;
    window._selectedAnimalTypes = null;
    if (reportContainer) reportContainer.style.display = "none";
    if (openBtn) openBtn.style.display = "none";
    if (personNameEl) personNameEl.textContent = "-";
    if (personDetailsEl) personDetailsEl.textContent = "-";
    return;
  }

  // ✅ Search in all suppliers
  var allSuppliers = (await dbDexieManager.getAllRecords(dbnm, "c")) || [];

  var foundSupplier = null;

  // ✅ COMMA-SEPARATED SEARCH (Cow/Buffalo IDs)
  // Format: "55," or ",557" or "57,557"
  // >500 = Cow, <500 = Buffalo
  if (searchTerm.indexOf(",") !== -1) {
    var parts = searchTerm.split(",");
    var cowIds = [];
    var buffaloIds = [];

    for (var ci = 0; ci < parts.length; ci++) {
      var val = parts[ci].trim();
      if (val === "") continue;
      var num = parseInt(val);
      if (isNaN(num)) continue;
      if (num > 500) {
        cowIds.push(val);
      } else {
        buffaloIds.push(val);
      }
    }

    window._selectedAnimalTypes = {
      hasCow: cowIds.length > 0,
      hasBuffalo: buffaloIds.length > 0,
    };

    // ✅ Search: collect ALL matching suppliers
    var searchValues = [];
    for (var ci2 = 0; ci2 < parts.length; ci2++) {
      var v2 = parts[ci2].trim();
      if (v2 !== "") searchValues.push(v2);
    }
    var matchedSuppliers = [];
    for (var i = 0; i < allSuppliers.length; i++) {
      var item = allSuppliers[i];
      if (!item.k) continue;
      var pkStr = item.k.toString();
      var allMatch = true;
      for (var vi = 0; vi < searchValues.length; vi++) {
        if (pkStr.indexOf("," + searchValues[vi] + ",") === -1) {
          allMatch = false;
          break;
        }
      }
      if (allMatch) matchedSuppliers.push(item);
    }

    if (matchedSuppliers.length === 1) {
      foundSupplier = matchedSuppliers[0];
    } else if (matchedSuppliers.length > 1) {
      clientDisplay.value = "📋 Found " + matchedSuppliers.length + " parties — tap to select";
      clientDisplay.style.color = "#1a237e";
      clientDisplay.style.fontWeight = "bold";
      clientDisplay.style.background = "#e3f2fd";
      clientDisplay.style.borderColor = "#2196f3";
      supplierIdField.value = "";
      document.getElementById("selectedUniqueId").value = "";
      window._selectedSupplier = null;
      if (reportContainer) reportContainer.style.display = "none";
      if (openBtn) openBtn.style.display = "none";
      if (personNameEl) personNameEl.textContent = "-";
      if (personDetailsEl) personDetailsEl.textContent = "-";
      window._commaMatchedSuppliers = matchedSuppliers;
      showSupplierDropdown(matchedSuppliers, function (supplier) {
        var clientDisplay = document.getElementById("clientDisplay");
        var supplierIdField = document.getElementById("supplierId");
        var reportContainer = document.getElementById("reportContainer");
        var personNameEl = document.getElementById("personName");
        var personDetailsEl = document.getElementById("personDetails");
        var openBtn = document.getElementById("openSupplierListBtn");
        var name = supplier.h || supplier.i || supplier.e || "Unnamed";
        var phone = supplier.e || "";
        var uniqueId = supplier.k || "";
        clientDisplay.value = "🆔 " + (uniqueId || "N/A") + " | " + name + " | 📱 " + phone;
        clientDisplay.style.color = "#1a237e";
        clientDisplay.style.fontWeight = "bold";
        clientDisplay.style.background = "#e8f5e9";
        clientDisplay.style.borderColor = "#4caf50";
        supplierIdField.value = supplier.a;
        document.getElementById("selectedUniqueId").value = uniqueId || "";
        if (openBtn) openBtn.style.display = "none";
        window._selectedSupplier = supplier;
        if (reportContainer) reportContainer.style.display = "block";
        if (personNameEl) personNameEl.textContent = "👤 " + name;
        if (personDetailsEl) personDetailsEl.textContent = "";
        window.loadPersonReport();
      });
      return;
    }

    if (foundSupplier) {
      var name = foundSupplier.h || foundSupplier.i || foundSupplier.e || "Unnamed";
      var phone = foundSupplier.e || "";
      var uniqueId = foundSupplier.k || "";

      clientDisplay.value = "🆔 " + (uniqueId || "N/A") + " | " + name + " | 📱 " + phone;
      clientDisplay.style.color = "#1a237e";
      clientDisplay.style.fontWeight = "bold";
      clientDisplay.style.background = "#e8f5e9";
      clientDisplay.style.borderColor = "#4caf50";

      supplierIdField.value = foundSupplier.a;
      document.getElementById("selectedUniqueId").value = uniqueId || "";

      if (openBtn) openBtn.style.display = "none";

      window._selectedSupplier = foundSupplier;

      if (reportContainer) {
        reportContainer.style.display = "block";
      }

      if (personNameEl) {
        personNameEl.textContent = "👤 " + name;
      }

      window.loadPersonReport();
    } else {
      clientDisplay.value = "❌ No supplier found for: " + searchTerm;
      clientDisplay.style.color = "#d32f2f";
      clientDisplay.style.fontWeight = "bold";
      clientDisplay.style.background = "#ffebee";
      clientDisplay.style.borderColor = "#d32f2f";

      supplierIdField.value = "";
      document.getElementById("selectedUniqueId").value = "";
      window._selectedSupplier = null;

      if (openBtn) {
        openBtn.style.display = "inline-block";
        openBtn.innerHTML = '<i class="fas fa-plus"></i> Add "' + searchTerm + '"';
      }

      if (reportContainer) {
        reportContainer.style.display = "none";
      }

      if (personNameEl) personNameEl.textContent = "-";
      if (personDetailsEl) personDetailsEl.textContent = "-";
    }
    return;
  }

  // ✅ PARTIAL ANIMAL ID SEARCH (k field — numeric, no comma)
  if (!isNaN(parseInt(searchTerm)) && searchTerm.indexOf(",") === -1) {
    var animalMatchCount = window.showAnimalIdDropdown(
      allSuppliers,
      searchTerm,
      function (supplier) {
        var clientDisplay = document.getElementById("clientDisplay");
        var supplierIdField = document.getElementById("supplierId");
        var reportContainer = document.getElementById("reportContainer");
        var personNameEl = document.getElementById("personName");
        var personDetailsEl = document.getElementById("personDetails");
        var openBtn = document.getElementById("openSupplierListBtn");
        var name = supplier.h || supplier.i || supplier.e || "Unnamed";
        var phone = supplier.e || "";
        var uniqueId = supplier.k || "";
        clientDisplay.value =
          "🆔 " + (uniqueId || "N/A") + " | " + name + " | 📱 " + phone;
        clientDisplay.style.color = "#1a237e";
        clientDisplay.style.fontWeight = "bold";
        clientDisplay.style.background = "#e8f5e9";
        clientDisplay.style.borderColor = "#4caf50";
        supplierIdField.value = supplier.a;
        document.getElementById("selectedUniqueId").value = uniqueId || "";
        if (openBtn) openBtn.style.display = "none";
        window._selectedAnimalTypes = null;
        window._selectedSupplier = supplier;
        if (reportContainer) reportContainer.style.display = "block";
        if (personNameEl) personNameEl.textContent = "👤 " + name;
        if (personDetailsEl) personDetailsEl.textContent = "";
        window.loadPersonReport();
      }
    );
    if (animalMatchCount > 0) {
      clientDisplay.value =
        "📋 Found " + animalMatchCount + " parties — tap to select";
      clientDisplay.style.color = "#1a237e";
      clientDisplay.style.fontWeight = "bold";
      clientDisplay.style.background = "#e3f2fd";
      clientDisplay.style.borderColor = "#2196f3";
      supplierIdField.value = "";
      document.getElementById("selectedUniqueId").value = "";
      window._selectedSupplier = null;
      if (reportContainer) reportContainer.style.display = "none";
      if (openBtn) openBtn.style.display = "none";
      if (personNameEl) personNameEl.textContent = "-";
      if (personDetailsEl) personDetailsEl.textContent = "-";
      return;
    }
  }

  // ✅ STANDARD SEARCH (Name, Unique ID, Mobile, Local Name)
  window._selectedAnimalTypes = null;

  for (var i = 0; i < allSuppliers.length; i++) {
    var item = allSuppliers[i];
    var isMatch = false;

    // ✅ Check Unique ID (k) - EXACT match (case insensitive)
    if (
      item.k &&
      item.k.toString().toUpperCase() === searchTerm.toUpperCase()
    ) {
      isMatch = true;
    }
    // ✅ Check Name (h) - PARTIAL match (case insensitive)
    else if (
      item.h &&
      item.h.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      isMatch = true;
    }
    // ✅ Check Local Name (i) - PARTIAL match (case insensitive)
    else if (
      item.i &&
      item.i.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      isMatch = true;
    }
    // ✅ Check Mobile (e) - EXACT match after cleaning
    else if (item.e) {
      var cleanMobile = item.e
        .replace(/^91\.?/, "")
        .replace(/^\+91/, "")
        .replace(/\./g, "")
        .trim();
      var searchMobile = searchTerm
        .replace(/^91\.?/, "")
        .replace(/^\+91/, "")
        .replace(/\./g, "")
        .trim();

      if (cleanMobile === searchMobile) {
        isMatch = true;
      } else if (
        searchMobile.length >= 6 &&
        cleanMobile.endsWith(searchMobile)
      ) {
        isMatch = true;
      }
    }

    if (isMatch) {
      foundSupplier = item;
      break;
    }
  }

  if (foundSupplier) {
    // ✅ Supplier found - show details and hide + button
    var name =
      foundSupplier.h || foundSupplier.i || foundSupplier.e || "Unnamed";
    var phone = foundSupplier.e || "";
    var uniqueId = foundSupplier.k || "";

    clientDisplay.value =
      "🆔 " + (uniqueId || "N/A") + " | " + name + " | 📱 " + phone;
    clientDisplay.style.color = "#1a237e";
    clientDisplay.style.fontWeight = "bold";
    clientDisplay.style.background = "#e8f5e9";
    clientDisplay.style.borderColor = "#4caf50";

    supplierIdField.value = foundSupplier.a;
    document.getElementById("selectedUniqueId").value = uniqueId || "";

    // ✅ Hide + button (supplier found)
    if (openBtn) {
      openBtn.style.display = "none";
    }

    // ✅ Store supplier data
    window._selectedSupplier = foundSupplier;

    // ✅ Show report
    if (reportContainer) {
      reportContainer.style.display = "block";
    }

    // ✅ Update person info
    if (personNameEl) {
      personNameEl.textContent = "👤 " + name;
    }

    // ✅ Load the report
    window.loadPersonReport();
  } else {
    // ❌ Supplier NOT found - show + button, NO MODAL
    clientDisplay.value = "❌ No supplier found for: " + searchTerm;
    clientDisplay.style.color = "#d32f2f";
    clientDisplay.style.fontWeight = "bold";
    clientDisplay.style.background = "#ffebee";
    clientDisplay.style.borderColor = "#d32f2f";

    supplierIdField.value = "";
    document.getElementById("selectedUniqueId").value = "";
    window._selectedSupplier = null;

    // ✅ Show + button (supplier not found)
    if (openBtn) {
      openBtn.style.display = "inline-block";
      openBtn.innerHTML =
        '<i class="fas fa-plus"></i> Add "' + searchTerm + '"';
    }

    // ✅ Hide report
    if (reportContainer) {
      reportContainer.style.display = "none";
    }

    if (personNameEl) personNameEl.textContent = "-";
    if (personDetailsEl) personDetailsEl.textContent = "-";
  }
}

// ============================================================
// Open supplier list (uses shared window.openSupplierList from mi.js)
// ============================================================

// ============================================================
// Apply Date Filter
// ============================================================

window.applyDateFilter = function () {
  var fromDate = document.getElementById("filterFromDate")?.value;
  var toDate = document.getElementById("filterToDate")?.value;

  if (!fromDate || !toDate) {
    showMessageModal("Info", "⚠️ Please select both From and To dates!", false);
    return;
  }

  if (new Date(fromDate) > new Date(toDate)) {
    showMessageModal("Info", "⚠️ From date cannot be after To date!", false);
    return;
  }

  // Update display
  var displayFrom = document.getElementById("displayFromDate");
  var displayTo = document.getElementById("displayToDate");
  if (displayFrom) displayFrom.textContent = formatDateDisplay(fromDate);
  if (displayTo) displayTo.textContent = formatDateDisplay(toDate);

  // Reload report
  window.loadPersonReport();

  showMessageModal(
    "Success",
    "✅ Report updated for date range: " +
      formatDateDisplay(fromDate) +
      " to " +
      formatDateDisplay(toDate),
    false,
  );
};

// ============================================================
// Print Report
// ============================================================

window.printReport = function () {
  var reportContainer = document.getElementById("reportContainer");

  if (!reportContainer || reportContainer.style.display === "none") {
    showMessageModal(
      "Info",
      "Please select a client first to print the report.",
      false,
    );
    return;
  }

  var personName =
    document.getElementById("personName")?.innerHTML || "Supplier Report";
  var personDetails = document.getElementById("personDetails")?.innerHTML || "";
  var reportHeader =
    document.getElementById("reportHeader")?.innerHTML ||
    "Milk Collection Report";
  var reportTable = document.querySelector("#reportTable")?.outerHTML || "";

  var summaryItems = document.querySelectorAll(".summary-item");
  var summaryHtml = "";
  summaryItems.forEach(function (item) {
    summaryHtml += item.outerHTML;
  });

  var isCardView = !!(
    window[my1uzr.worknOnPg] &&
    window[my1uzr.worknOnPg].changeToView === "1"
  );

  var bodyContentHtml = isCardView
    ? '<div class="report-cards">' +
      (document.getElementById("reportCards")?.innerHTML || "") +
      "</div>"
    : '<div class="table-responsive">' + reportTable + "</div>";

  var printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Milk Collection Report</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        body { padding: 30px; background: white; }
        .print-header { text-align: center; border-bottom: 3px solid #667eea; padding-bottom: 15px; margin-bottom: 20px; }
        .print-header h2 { color: #1a237e; margin: 0 0 5px 0; font-size: 24px; font-weight: 700; }
        .print-header .subtitle { color: #666; font-size: 14px; margin: 0; }
        .print-person-info { text-align: center; background: #e8f5e9; padding: 12px 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #4caf50; }
        .print-person-info .name { font-size: 18px; font-weight: 700; color: #1a237e; }
        .print-person-info .details { font-size: 13px; color: #555; margin-top: 4px; }
        .print-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
        .print-table th { background: #667eea; color: white; padding: 8px 6px; text-align: center; font-weight: 600; }
        .print-table td { padding: 6px 4px; text-align: center; border-bottom: 1px solid #dee2e6; }
        .print-table .total-row { background: #e8eaf6; font-weight: 700; border-top: 2px solid #667eea; }
        .print-table .summary-row { background: #fff8e1; font-weight: 700; border-top: 2px solid #ff9800; }
        .print-summary { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-top: 15px; padding-top: 15px; border-top: 2px solid #ff9800; }
        .print-summary-item { background: #fff3e0; padding: 8px 20px; border-radius: 8px; border: 1px solid #ff9800; font-size: 13px; }
        .print-summary-item strong { color: #e65100; }
        .day-card { border: 1px solid #e0e0e0; border-radius: 10px; margin-bottom: 12px; overflow: hidden; break-inside: avoid; }
        .day-card-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 8px 12px; display: flex; align-items: center; gap: 10px; }
        .day-num { background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 18px; font-weight: 800; padding: 3px 8px; min-width: 40px; text-align: center; }
        .day-date { font-size: 13px; font-weight: 700; }
        .day-weekday { font-size: 11px; opacity: 0.85; text-transform: capitalize; }
        .session-block { padding: 8px 12px; border-top: 1px solid #f0f0f0; }
        .session-morning { background: #f1f8e9; border-left: 5px solid #4caf50; }
        .session-evening { background: #fff3e0; border-left: 5px solid #ff9800; }
        .session-title { font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .session-morning .session-title { color: #2e7d32; }
        .session-evening .session-title { color: #e65100; }
        .session-amount { font-size: 16px; font-weight: 800; color: #1a237e; }
        .session-meta { font-size: 11px; color: #555; margin-top: 2px; }
        .day-card-total { background: #f5f5f5; padding: 6px 12px; font-size: 12px; font-weight: 700; display: flex; justify-content: space-between; }
        .day-card-total .total-amt { color: #c62828; font-size: 13px; }
        .print-footer { text-align: center; margin-top: 25px; font-size: 11px; color: #999; border-top: 1px solid #dee2e6; padding-top: 12px; }
        @media print { body { padding: 15px; } .no-print { display: none !important; } .btn { display: none !important; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="print-header">
          <h2><i class="fas fa-tint text-primary"></i> Milk Collection Report</h2>
          <div class="subtitle">${reportHeader}</div>
        </div>
        <div class="print-person-info">
          <div class="name">${personName}</div>
          <div class="details">${personDetails}</div>
        </div>
        ${bodyContentHtml}
        <div class="print-summary">${summaryHtml}</div>
        <div class="print-footer"><i class="far fa-clock"></i> Printed on: ${new Date().toLocaleString()}</div>
      </div>
      <script>
        window.onload = function() { window.print(); };
      <\/script>
    </body>
    </html>
  `;

  var printWindow = window.open(
    "",
    "_blank",
    "width=1000,height=800,scrollbars=yes",
  );
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
  } else {
    showMessageModal("Info", "Please allow popups to print the report.", false);
  }
};

// ============================================================
// Helper: Get date from record
// ============================================================

function getDateFromRecord(record) {
  if (record.f && record.f !== "") return new Date(record.f);
  if (record.k && record.k !== "") return new Date(record.k);
  if (record.b && record.b !== "") return new Date(record.b);
  return new Date();
}

// ============================================================
// Load Person Report - Main function with Date Range filter
// ============================================================

window.loadPersonReport = async function () {
  var personId = document.getElementById("supplierId")?.value;
  var reportContainer = document.getElementById("reportContainer");
  var reportBody = document.getElementById("reportBody");

  if (!personId) {
    if (reportContainer) reportContainer.style.display = "none";
    return;
  }

  var fromDate = document.getElementById("filterFromDate")?.value;
  var toDate = document.getElementById("filterToDate")?.value;
  var animal = document.getElementById("filterAnimal")?.value || "all";

  // ✅ If no date range selected, use current month
  if (!fromDate || !toDate) {
    var now = new Date();
    fromDate = formatDateYYYYMMDD(
      new Date(now.getFullYear(), now.getMonth(), 1),
    );
    toDate = formatDateYYYYMMDD(
      new Date(now.getFullYear(), now.getMonth() + 1, 0),
    );
    var fromInput = document.getElementById("filterFromDate");
    var toInput = document.getElementById("filterToDate");
    if (fromInput) fromInput.value = fromDate;
    if (toInput) toInput.value = toDate;
  }

  var fromDateObj = new Date(fromDate);
  var toDateObj = new Date(toDate);
  toDateObj.setHours(23, 59, 59, 999);

  var animalLabel =
    animal === "all" ? "All" : animal === "1" ? "Buffalo" : "Cow";

  var headerEl = document.getElementById("reportHeader");
  if (headerEl) {
    headerEl.textContent =
      "📊 Milk Collection Report - " +
      formatDateDisplay(fromDate) +
      " to " +
      formatDateDisplay(toDate) +
      " (" +
      animalLabel +
      ")";
  }

  if (reportContainer) reportContainer.style.display = "block";

  try {
    var allRecords = await dbDexieManager.getAllRecords(dbnm, "mi");
    var allPricingRecords = await dbDexieManager.getAllRecords(dbnm, "mb");
    var allPersons = await dbDexieManager.getAllRecords(dbnm, "c");

    var pricingMap = {};
    allPricingRecords.forEach(function (p) {
      pricingMap[p.a] = p;
    });

    var personMap = {};
    allPersons.forEach(function (p) {
      personMap[p.a] = p;
    });

    var person = personMap[personId];
    var name = "Unnamed";
    var phone = "";

    if (person) {
      name = person.h || person.i || person.e || "Unnamed";
      phone = person.e || "";

      var clientDisplay = document.getElementById("clientDisplay");
      if (clientDisplay) {
        clientDisplay.value = name + (phone ? " - " + phone : "");
        clientDisplay.style.color = "#1a237e";
      }

      var personNameEl = document.getElementById("personName");
      if (personNameEl) personNameEl.textContent = "👤 " + name;
    }

    // ✅ Filter records by date range
    var filtered = allRecords.filter(function (record) {
      if (record.e != parseInt(personId)) return false;
      var dateObj = getDateFromRecord(record);
      return dateObj >= fromDateObj && dateObj <= toDateObj;
    });

    filtered.sort(function (a, b) {
      return getDateFromRecord(a) - getDateFromRecord(b);
    });

    var groupedData = {};
    var totalMorningQty = 0;
    var totalMorningFat = 0;
    var totalMorningSnf = 0;
    var totalMorningRate = 0;
    var totalMorningAmt = 0;
    var totalEveningQty = 0;
    var totalEveningFat = 0;
    var totalEveningSnf = 0;
    var totalEveningRate = 0;
    var totalEveningAmt = 0;

    filtered.forEach(function (record) {
      var dateObj = getDateFromRecord(record);
      var dateKey = dateObj.toISOString().split("T")[0];

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          morning: { qty: 0, fat: 0, snf: 0, rate: 0, amt: 0, count: 0 },
          evening: { qty: 0, fat: 0, snf: 0, rate: 0, amt: 0, count: 0 },
        };
      }

      var session = parseInt(record.g) || 0;
      var qty = parseFloat(record.i) || 0;
      var amt = parseFloat(record.j) || 0;

      var pricingId = parseInt(record.k) || 0;
      var pricing = pricingMap[pricingId] || {};
      var fat = parseFloat(pricing.g) || 0;
      var snf = parseFloat(pricing.h) || 0;
      var rate = parseFloat(pricing.i) || (qty > 0 ? amt / qty : 0);

      if (animal !== "all" && pricing.f != parseInt(animal)) return;

      if (session === 1) {
        groupedData[dateKey].morning.qty += qty;
        groupedData[dateKey].morning.fat += fat * qty;
        groupedData[dateKey].morning.snf += snf * qty;
        groupedData[dateKey].morning.rate += rate * qty;
        groupedData[dateKey].morning.amt += amt;
        groupedData[dateKey].morning.count += 1;
        totalMorningQty += qty;
        totalMorningFat += fat * qty;
        totalMorningSnf += snf * qty;
        totalMorningRate += rate * qty;
        totalMorningAmt += amt;
      } else if (session === 2) {
        groupedData[dateKey].evening.qty += qty;
        groupedData[dateKey].evening.fat += fat * qty;
        groupedData[dateKey].evening.snf += snf * qty;
        groupedData[dateKey].evening.rate += rate * qty;
        groupedData[dateKey].evening.amt += amt;
        groupedData[dateKey].evening.count += 1;
        totalEveningQty += qty;
        totalEveningFat += fat * qty;
        totalEveningSnf += snf * qty;
        totalEveningRate += rate * qty;
        totalEveningAmt += amt;
      }
    });

    var avgMorningFat =
      totalMorningQty > 0 ? totalMorningFat / totalMorningQty : 0;
    var avgMorningSnf =
      totalMorningQty > 0 ? totalMorningSnf / totalMorningQty : 0;
    var avgMorningRate =
      totalMorningQty > 0 ? totalMorningRate / totalMorningQty : 0;
    var avgEveningFat =
      totalEveningQty > 0 ? totalEveningFat / totalEveningQty : 0;
    var avgEveningSnf =
      totalEveningQty > 0 ? totalEveningSnf / totalEveningQty : 0;
    var avgEveningRate =
      totalEveningQty > 0 ? totalEveningRate / totalEveningQty : 0;

    var monthlyTotalQty = totalMorningQty + totalEveningQty;
    var monthlyTotalAmt = totalMorningAmt + totalEveningAmt;

    var personDetailsEl = document.getElementById("personDetails");
    if (personDetailsEl) {
      personDetailsEl.textContent =
        (phone ? "📱 " + phone + " | " : "") +
        "📅 " +
        formatDateDisplay(fromDate) +
        " to " +
        formatDateDisplay(toDate) +
        " | 🥛 " +
        window.fmtMilk(monthlyTotalQty) +
        " Ltr | 💰 Amount: ₹" +
        monthlyTotalAmt.toFixed(2);
    }

    var isCardView = !!(
      window[my1uzr.worknOnPg] &&
      window[my1uzr.worknOnPg].changeToView === "1"
    );

    var tableHtml = "";
    var cardsHtml = "";
    var dateKeys = Object.keys(groupedData).sort();

    if (dateKeys.length === 0) {
      tableHtml =
        '<tr><td colspan="11" style="text-align:center;color:#999;padding:20px;">No collection data for this period</td></tr>';
      cardsHtml =
        '<div class="empty-state">No collection data for this period</div>';
    } else {
      dateKeys.forEach(function (dateKey) {
        var data = groupedData[dateKey];
        var dateObj = new Date(dateKey);
        var day = dateObj.getDate();

        var mQty = data.morning.qty > 0 ? window.fmtMilk(data.morning.qty) : "";
        var mFat =
          data.morning.qty > 0
            ? window.fmtFat(data.morning.fat / data.morning.qty)
            : "";
        var mSnf =
          data.morning.qty > 0
            ? window.fmtSnf(data.morning.snf / data.morning.qty)
            : "";
        var mRate =
          data.morning.qty > 0
            ? (data.morning.rate / data.morning.qty).toFixed(2)
            : "";
        var mAmt =
          data.morning.amt > 0 ? "₹" + data.morning.amt.toFixed(2) : "";

        var eQty = data.evening.qty > 0 ? window.fmtMilk(data.evening.qty) : "";
        var eFat =
          data.evening.qty > 0
            ? window.fmtFat(data.evening.fat / data.evening.qty)
            : "";
        var eSnf =
          data.evening.qty > 0
            ? window.fmtSnf(data.evening.snf / data.evening.qty)
            : "";
        var eRate =
          data.evening.qty > 0
            ? (data.evening.rate / data.evening.qty).toFixed(2)
            : "";
        var eAmt =
          data.evening.amt > 0 ? "₹" + data.evening.amt.toFixed(2) : "";

        // ---- Table row (existing) ----
        tableHtml += "<tr>";
        tableHtml += '<td class="fixed-col"><strong>' + day + "</strong></td>";
        tableHtml +=
          '<td style="border-right:1px solid #e8f5e9;">' + mQty + "</td>";
        tableHtml +=
          '<td style="border-right:1px solid #e8f5e9;">' + mFat + "</td>";
        tableHtml +=
          '<td style="border-right:1px solid #e8f5e9;">' + mSnf + "</td>";
        tableHtml +=
          '<td style="border-right:1px solid #e8f5e9;">' + mRate + "</td>";
        tableHtml +=
          '<td style="border-right:2px solid #a5d6a7;">' + mAmt + "</td>";
        tableHtml +=
          '<td style="border-left:2px solid #a5d6a7; border-right:1px solid #fff3e0;">' +
          eQty +
          "</td>";
        tableHtml +=
          '<td style="border-right:1px solid #fff3e0;">' + eFat + "</td>";
        tableHtml +=
          '<td style="border-right:1px solid #fff3e0;">' + eSnf + "</td>";
        tableHtml +=
          '<td style="border-right:1px solid #fff3e0;">' + eRate + "</td>";
        tableHtml += "<td>" + eAmt + "</td>";
        tableHtml += "</tr>";

        // ---- Card for this day (used when changeToView === "1") ----
        var dayQty = data.morning.qty + data.evening.qty;
        var dayAmt = data.morning.amt + data.evening.amt;
        var dateLabel = dateObj.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        var weekday = dateObj.toLocaleDateString("en-IN", {
          weekday: "long",
        });

        cardsHtml += '<div class="day-card">';
        cardsHtml += '<div class="day-card-header">';
        cardsHtml += '<span class="day-num">' + day + "</span>";
        cardsHtml += "<div>";
        cardsHtml += '<div class="day-date">' + dateLabel + "</div>";
        cardsHtml += '<div class="day-weekday">' + weekday + "</div>";
        cardsHtml += "</div></div>";

        if (data.morning.qty > 0) {
          cardsHtml += '<div class="session-block session-morning">';
          cardsHtml +=
            '<div class="session-title">🌅 Morning</div>' +
            '<div class="session-amount">' +
            mAmt +
            "</div>";
          cardsHtml +=
            '<div class="session-meta">🥛 ' +
            mQty +
            ' Ltr<span class="meta-sep">·</span>Fat ' +
            mFat +
            '<span class="meta-sep">·</span>SNF ' +
            mSnf +
            '<span class="meta-sep">·</span>Rate ₹' +
            mRate +
            "</div>";
          cardsHtml += "</div>";
        }

        if (data.evening.qty > 0) {
          cardsHtml += '<div class="session-block session-evening">';
          cardsHtml +=
            '<div class="session-title">🌙 Evening</div>' +
            '<div class="session-amount">' +
            eAmt +
            "</div>";
          cardsHtml +=
            '<div class="session-meta">🥛 ' +
            eQty +
            ' Ltr<span class="meta-sep">·</span>Fat ' +
            eFat +
            '<span class="meta-sep">·</span>SNF ' +
            eSnf +
            '<span class="meta-sep">·</span>Rate ₹' +
            eRate +
            "</div>";
          cardsHtml += "</div>";
        }

        cardsHtml += '<div class="day-card-total">';
        cardsHtml += "<span>Total:</span>";
        cardsHtml +=
          '<span class="total-amt">' +
          window.fmtMilk(dayQty) +
          " Ltr · ₹" +
          dayAmt.toFixed(2) +
          "</span>";
        cardsHtml += "</div>";
        cardsHtml += "</div>";
      });

      // Total row
      tableHtml += '<tr class="total-row">';
      tableHtml += '<td class="fixed-col"><strong>T</strong></td>';
      tableHtml +=
        "<td><strong>" + window.fmtMilk(totalMorningQty) + "</strong></td>";
      tableHtml += "<td><strong>" + window.fmtFat(avgMorningFat) + "</strong></td>";
      tableHtml += "<td><strong>" + window.fmtSnf(avgMorningSnf) + "</strong></td>";
      tableHtml +=
        "<td><strong>" + avgMorningRate.toFixed(2) + "</strong></td>";
      tableHtml +=
        "<td><strong>₹" + totalMorningAmt.toFixed(2) + "</strong></td>";
      tableHtml +=
        "<td><strong>" + window.fmtMilk(totalEveningQty) + "</strong></td>";
      tableHtml += "<td><strong>" + window.fmtFat(avgEveningFat) + "</strong></td>";
      tableHtml += "<td><strong>" + window.fmtSnf(avgEveningSnf) + "</strong></td>";
      tableHtml +=
        "<td><strong>" + avgEveningRate.toFixed(2) + "</strong></td>";
      tableHtml +=
        "<td><strong>₹" + totalEveningAmt.toFixed(2) + "</strong></td>";
      tableHtml += "</tr>";

      var grandTotalQty = totalMorningQty + totalEveningQty;
      var grandTotalAmt = totalMorningAmt + totalEveningAmt;

      tableHtml += '<tr class="summary-row">';
      tableHtml +=
        '<td class="fixed-col" style="font-size:10px;color:#e65100;"></td>';
      tableHtml +=
        '<td colspan="10" style="text-align:center;padding:8px 4px;">';
      tableHtml += '<div class="summary-flex">';
      tableHtml +=
        '<div class="summary-item">📊 <strong>Total Quantity:</strong> ' +
        window.fmtMilk(grandTotalQty) +
        " Ltr</div>";
      tableHtml +=
        '<div class="summary-item">💰 <strong>Total Amount:</strong> ₹' +
        grandTotalAmt.toFixed(2) +
        "</div>";
      tableHtml += "</div>";
      tableHtml += "</td>";
      tableHtml += "</tr>";
    }

    if (reportBody) reportBody.innerHTML = tableHtml;

    var reportCards = document.getElementById("reportCards");
    if (reportCards) reportCards.innerHTML = cardsHtml;

    // Toggle table / card view based on changeToView config
    var scrollWrapper = document.getElementById("scrollWrapper");
    var scrollHint = document.getElementById("scrollHint");
    if (isCardView) {
      if (scrollWrapper) scrollWrapper.style.display = "none";
      if (scrollHint) scrollHint.style.display = "none";
      if (reportCards) reportCards.style.display = "grid";
    } else {
      if (scrollWrapper) scrollWrapper.style.display = "";
      if (scrollHint) scrollHint.style.display = "";
      if (reportCards) reportCards.style.display = "none";
    }
  } catch (error) {
    var isCardViewOnError = !!(
      window[my1uzr.worknOnPg] &&
      window[my1uzr.worknOnPg].changeToView === "1"
    );
    if (reportBody) {
      reportBody.innerHTML =
        '<tr><td colspan="11" style="text-align:center;color:#d63031;padding:20px;">❌ Error loading data: ' +
        error.message +
        "</td></tr>";
    }
    var reportCardsErr = document.getElementById("reportCards");
    if (reportCardsErr) {
      reportCardsErr.innerHTML =
        '<div class="empty-state" style="color:#d63031;">❌ Error loading data: ' +
        error.message +
        "</div>";
      reportCardsErr.style.display = isCardViewOnError ? "grid" : "none";
    }
    var scrollWrapperErr = document.getElementById("scrollWrapper");
    var scrollHintErr = document.getElementById("scrollHint");
    if (scrollWrapperErr) scrollWrapperErr.style.display = isCardViewOnError ? "none" : "";
    if (scrollHintErr) scrollHintErr.style.display = isCardViewOnError ? "none" : "";
  }
};

// ============================================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================

window.showPersonList = showPersonList;
window.loadPersonReport = loadPersonReport;
window.printReport = printReport;
window.filterPersonsByCategory = filterPersonsByCategory;
window.showSupplierPaymentModal = showSupplierPaymentModal;
window.submitSupplierPayment = submitSupplierPayment;
window.applyDateFilter = applyDateFilter;

console.log("👥 Person list module loaded with date range filter!");
