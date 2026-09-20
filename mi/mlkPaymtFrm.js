// mlkPaymtFrm.js - Standalone Payment & Receipt Form with Search

var _submittedPayments = [];

// ============================================================
// CALLBACK - Runs after supplier selection from open_entind_crud
// ============================================================

function commonFnToRunAfter_op_ViewCall(selectedData) {
  console.log("✅ Supplier selected in PAYMENT form:", selectedData);

  if (selectedData && selectedData.a) {
    var personId = selectedData.a;

    var personIdField = document.getElementById("paymentPersonId");
    var clientDisplay = document.getElementById("clientDisplay");
    var searchInput = document.getElementById("uniqueIdSearchInput");
    var openBtn = document.getElementById("openSupplierListBtn");
    var paymentFields = document.getElementById("paymentFieldsContainer");

    if (personIdField && clientDisplay) {
      personIdField.value = personId;

      var persons = window.milk_persons || [];
      var person = persons.find(function (p) {
        return String(p.a) == String(personId);
      });

      if (person) {
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

        // ✅ Show payment fields
        if (paymentFields) {
          paymentFields.style.display = "block";
        }

        // Store unique ID for reference
        document.getElementById("selectedUniqueId").value = uniqueId || "";
        window._selectedSupplier = person;

        // Load payment form fields
        loadPaymentFormFields();
      }
    }
  }
}

// =============================================
// MAIN PAYMENT FORM
// =============================================

function initMilkPaymentForm() {
  console.log("✅ Payment Form module initialized");
}

function showMilkPaymentForm() {
  var container = document.getElementById("prdContent");
  if (!container) return;

  var now = new Date();
  var today = now.toISOString().split("T")[0];

  var html = "";
  html +=
    '<div class="milk-card">';

  // Header
  html +=
    '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 15px; border-radius: 10px; margin-bottom: 12px; text-align: center;">';
  html +=
    '<h5 class="mb-0" style="font-size:16px;"><i class="fas fa-money-bill-wave me-2"></i>Payment & Receipt</h5>';
  html += "</div>";

  // Styles
  html += "<style>";
  html +=
    ".section-box { padding:10px; border-radius:8px; margin-bottom:8px; border:2px solid #e0e0e0; }";
  html += ".section-orange { background:#fff3e0; border-color:#ff9800; }";
  html += ".section-green { background:#e8f5e9; border-color:#4caf50; }";
  html += ".section-blue { background:#e8eaf6; border-color:#5c6bc0; }";
  html += ".section-purple { background:#f3e5f5; border-color:#9c27b0; }";
  html += ".section-amber { background:#fff8e1; border-color:#ffc107; }";
  html += ".section-gray { background:var(--surface-2); border-color:#bdbdbd; }";
  html +=
    "#tempPaymentsContainer { border:2px solid #ff9800; border-radius:8px; padding:8px; margin-bottom:8px; background:var(--surface); }";
  html += "#tempPaymentsContainer table { margin:0; }";
  html += "#tempPaymentsContainer thead { background:#fff3e0; }";
  html += ".client-input { cursor:pointer; background:var(--surface-3); }";
  html +=
    ".client-input:hover { border-color:#667eea !important; background:var(--surface-2); }";
  html +=
    ".search-input { border:2px solid #667eea; padding:6px 10px; border-radius:6px; width:100%; font-size:14px; }";
  html +=
    ".search-input:focus { outline:none; border-color:#764ba2; box-shadow:0 0 0 3px rgba(102,126,234,0.2); }";
  html +=
    ".radio-highlight { background: #f3e5f5 !important; border-color: #9c27b0 !important; }";
  html += "#paymentAmount::placeholder { opacity: 0.4; font-weight: normal; }";
  html += "#paymentDiscountPct, #paymentDiscountAmt { color: #aaa; }";
  html +=
    "#paymentDiscountPct:focus, #paymentDiscountAmt:focus { color: #000; }";
  html += "</style>";

  html += '<form onsubmit="return false;" autocomplete="off">';

  // ============================================================
  // PERSON SELECTION - WITH SEARCH
  // ============================================================
  html += '<div class="section-box section-orange">';
  html +=
    '<label class="form-label fw-bold mb-1" style="color: #e65100; font-size: 12px;"><i class="fas fa-user"></i> Select Client *</label>';

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
  html += '<input type="hidden" id="paymentPersonId" value="">';
  html += '<input type="hidden" id="selectedUniqueId" value="">';
  html += "</div>";

  // ============================================================
  // PAYMENT FIELDS (hidden until person selected)
  // ============================================================
  html += '<div id="paymentFieldsContainer" style="display:none;">';

  // ✅ Balance Info - Clearer labels
  html +=
    '<div id="balanceInfo" style="background:#FFF8E1;padding:8px 12px;border-radius:8px;margin-bottom:8px;text-align:center;border:2px solid #FFC107;font-weight:700;font-size:13px;">';
  html += "<span>💵 <strong>Milk Total:</strong> ₹0.00</span> | ";
  html +=
    '<span style="color:#2e7d32;">💰 <strong>Paid Amount:</strong> ₹0.00</span> | ';
  html +=
    '<span style="color:#c62828;">⚖️ <strong>Balance:</strong> ₹0.00</span>';
  html += "</div>";

  // ✅ Transaction Type - Highlight selected
  html += '<div class="section-box section-purple">';
  html +=
    '<div style="display:flex; gap:20px; align-items:center; justify-content:center;">';
  html += '<div class="form-check form-check-inline" style="margin:0;">';
  html +=
    '<input class="form-check-input" type="radio" name="transactionType" id="radioPayment" value="2" onchange="onTransactionTypeChange()" required>';
  html +=
    '<label class="form-check-label fw-bold" style="color:#6a1b9a;" for="radioPayment">💰 Payment <span style="font-weight:normal;color:#888;font-size:11px;">(Pay to Supplier)</span></label>';
  html += "</div>";
  html += '<div class="form-check form-check-inline" style="margin:0;">';
  html +=
    '<input class="form-check-input" type="radio" name="transactionType" id="radioReceived" value="1" onchange="onTransactionTypeChange()" required>';
  html +=
    '<label class="form-check-label fw-bold" style="color:#6a1b9a;" for="radioReceived">📥 Received <span style="font-weight:normal;color:#888;font-size:11px;">(Received from Supplier)</span></label>';
  html += "</div>";
  html += "</div>";
  html += "</div>";

  // Date, Amount, Mode Row
  html += '<div class="section-box section-blue">';
  html += '<div class="row g-2 align-items-end">';
  html += '<div class="col-4">';
  html += '<small style="color:#5c6bc0;font-weight:700;">📅 Date *</small>';
  html +=
    '<input type="date" class="form-control form-control-sm mt-1" style="border: 2px solid #5c6bc0;" id="paymentDate" required>';
  html += "</div>";
  html += '<div class="col-4">';
  html += '<small style="color:#2e7d32;font-weight:700;">₹ Amount *</small>';
  html +=
    '<input type="text" class="form-control form-control-sm fw-bold mt-1" style="border: 2px solid #2e7d32; font-size:16px; text-align:center;" id="paymentAmount" placeholder="0.00" step="0.01" min="0.01" required>';
  html += "</div>";
  html += '<div class="col-4">';
  html += '<small style="color:#666;font-weight:700;">💳 Mode</small>';
  html +=
    '<select class="form-select form-select-sm mt-1" id="paymentType" style="border: 2px solid #bdbdbd;">';
  html += '<option value="">Select</option>';
  html += '<option value="1">💵 Cash</option>';
  html += '<option value="2">📝 Cheque</option>';
  html += '<option value="3">💳 Card</option>';
  html += '<option value="4">📱 UPI</option>';
  html += '<option value="5">🏦 Bank Transfer</option>';
  html += "</select>";
  html += "</div>";
  html += "</div>";
  html += "</div>";

  // Discount & Add Button Row
  html += '<div class="section-box section-amber">';
  html += '<div class="row g-2 align-items-end">';
  html += '<div class="col-4">';
  html += '<small style="color:#e65100;font-weight:700;">Round-UP %</small>';
  html +=
    '<input type="text" class="form-control form-control-sm mt-1" style="border: 2px solid #e65100;" id="paymentDiscountPct" value="0" step="0.1" min="0" max="100">';
  html += "</div>";
  html += '<div class="col-4">';
  html += '<small style="color:#e65100;font-weight:700;">Round-UP ₹</small>';
  html +=
    '<input type="text" class="form-control form-control-sm mt-1" style="border: 2px solid #e65100;" id="paymentDiscountAmt" value="0" step="0.01" min="0">';
  html += "</div>";
  html += '<div class="col-4">';
  html +=
    '<button type="button" class="btn btn-success btn-sm w-100 py-2 fw-bold" onclick="addTempPayment()" style="font-size:14px;"><i class="fas fa-plus"></i> Add</button>';
  html += "</div>";
  html += "</div>";
  html += "</div>";

  // Temp Payments List
  html += '<div id="tempPaymentsContainer" style="display:none;"></div>';

  // Note
  html += '<div style="margin-bottom:8px;">';
  html +=
    '<textarea class="form-control form-control-sm" id="paymentNote" rows="2" placeholder="Note (e.g., Advance Payment, Adjustment, Returned Cash)"></textarea>';
  html += "</div>";

  // ✅ Grand Total Summary - Clearer labels
  html += '<div class="section-box section-gray">';
  html += '<div class="row text-center g-0">';
  html +=
    '<div class="col-4"><small style="font-weight:700;">💵 Milk Total</small><div class="fw-bold text-primary" id="summaryFinal">₹0</div></div>';
  html +=
    '<div class="col-4"><small style="font-weight:700;">💰 Paid Amount</small><div class="fw-bold text-success" id="summaryReceived">₹0</div></div>';
  html +=
    '<div class="col-4"><small style="font-weight:700;">⚖️ Balance</small><div class="fw-bold" id="summaryBalance" style="color:#c62828;">₹0</div></div>';
  html += "</div>";
  html += "</div>";

  // History Section
  html += '<div id="paymentHistoryContainer" style="margin-bottom:8px;"></div>';

  // Buttons Row - Close, History, Submit
  html += '<div class="row g-2">';
  html += '<div class="col-4">';
  html +=
    '<button type="button" class="btn btn-secondary btn-sm w-100" onclick="window.showMilkCollectionForm()">Close</button>';
  html += "</div>";
  html += '<div class="col-4">';
  html +=
    '<button type="button" class="btn btn-warning btn-sm w-100 fw-bold" onclick="showFullPaymentHistory()" style="background:#ff9800; color:white; border:none;">';
  html += '<i class="fas fa-history me-1"></i>History</button>';
  html += "</div>";
  html += '<div class="col-4">';
  html +=
    '<button type="button" class="btn btn-success btn-sm w-100 fw-bold" id="submitPaymentBtn" onclick="submitAllPayments()" disabled><i class="fas fa-paper-plane me-1"></i>Submit</button>';
  html += "</div>";
  html += "</div>";

  html += "</div>"; // end paymentFieldsContainer
  html += "</form></div>";

  container.innerHTML = html;

  window._tempPayments = [];
  toggleSubmitBtn();

  // ✅ Setup event listeners
  setupPaymentEventListeners();

  // Initialize discount listeners
  setTimeout(function () {
    var discPct = document.getElementById("paymentDiscountPct");
    var discAmt = document.getElementById("paymentDiscountAmt");
    var amountField = document.getElementById("paymentAmount");

    if (discPct) {
      discPct.addEventListener("input", function () {
        var amount =
          parseFloat(document.getElementById("paymentAmount")?.value) || 0;
        var pct = parseFloat(this.value) || 0;
        var discValue = (amount * pct) / 100;
        if (discAmt) discAmt.value = discValue.toFixed(2);
      });
    }
    if (discAmt) {
      discAmt.addEventListener("input", function () {
        var amount =
          parseFloat(document.getElementById("paymentAmount")?.value) || 0;
        var amt = parseFloat(this.value) || 0;
        if (discPct)
          discPct.value = amount > 0 ? ((amt / amount) * 100).toFixed(2) : 0;
      });
    }

    if (amountField) {
      amountField.addEventListener("input", function () {
        checkAmountBalance();
      });
    }

    // ✅ Highlight selected radio button
    var radioPayment = document.getElementById("radioPayment");
    var radioReceived = document.getElementById("radioReceived");

    if (radioPayment) {
      radioPayment.addEventListener("change", function () {
        if (this.checked) {
          this.closest(".section-box").classList.add("radio-highlight");
        }
      });
    }
    if (radioReceived) {
      radioReceived.addEventListener("change", function () {
        if (this.checked) {
          this.closest(".section-box").classList.add("radio-highlight");
        }
      });
    }
  }, 100);
}

// ============================================================
// SETUP PAYMENT EVENT LISTENERS
// ============================================================

function setupPaymentEventListeners() {
  var searchInput = document.getElementById("uniqueIdSearchInput");
  var openBtn = document.getElementById("openSupplierListBtn");

  // ✅ Auto-search on input (as user types)
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchSupplierForPayment();
    });
  }

  // ✅ Open supplier list on + button click (only visible when supplier NOT found)
  if (openBtn) {
    openBtn.addEventListener("click", function () {
      window.openSupplierList(
        "commonFnToRunAfter_op_ViewCall",
        typeof window[my1uzr.worknOnPg].clientConfig?.xtraEiFlds_ei_admin_srchGuest !== "undefined"
          ? window[my1uzr.worknOnPg].clientConfig?.xtraEiFlds_ei_admin_srchGuest
          : null,
      );
    });
  }
}

// ============================================================
// SEARCH SUPPLIER FOR PAYMENT - Auto-search on input
// ============================================================

async function searchSupplierForPayment() {
  var searchInput = document.getElementById("uniqueIdSearchInput");
  var clientDisplay = document.getElementById("clientDisplay");
  var personIdField = document.getElementById("paymentPersonId");
  var paymentFields = document.getElementById("paymentFieldsContainer");
  var openBtn = document.getElementById("openSupplierListBtn");

  var searchTerm = searchInput?.value?.trim() || "";

  closeSupplierDropdown();

  // ✅ If search is empty, reset everything
  if (!searchTerm) {
    clientDisplay.value = "No supplier selected...";
    clientDisplay.style.color = "#666";
    clientDisplay.style.background = "#f5f5f5";
    clientDisplay.style.borderColor = "#ff9800";
    personIdField.value = "";
    document.getElementById("selectedUniqueId").value = "";
    window._selectedSupplier = null;
    window._selectedAnimalTypes = null;
    if (paymentFields) paymentFields.style.display = "none";
    if (openBtn) openBtn.style.display = "none";
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
      personIdField.value = "";
      document.getElementById("selectedUniqueId").value = "";
      window._selectedSupplier = null;
      if (paymentFields) paymentFields.style.display = "none";
      if (openBtn) openBtn.style.display = "none";
      window._commaMatchedSuppliers = matchedSuppliers;
      showSupplierDropdown(matchedSuppliers, function (supplier) {
        var clientDisplay = document.getElementById("clientDisplay");
        var personIdField = document.getElementById("paymentPersonId");
        var paymentFields = document.getElementById("paymentFieldsContainer");
        var openBtn = document.getElementById("openSupplierListBtn");
        var name = supplier.h || supplier.i || supplier.e || "Unnamed";
        var phone = supplier.e || "";
        var uniqueId = supplier.k || "";
        clientDisplay.value = "🆔 " + (uniqueId || "N/A") + " | " + name + " | 📱 " + phone;
        clientDisplay.style.color = "#1a237e";
        clientDisplay.style.fontWeight = "bold";
        clientDisplay.style.background = "#e8f5e9";
        clientDisplay.style.borderColor = "#4caf50";
        personIdField.value = supplier.a;
        document.getElementById("selectedUniqueId").value = uniqueId || "";
        if (openBtn) openBtn.style.display = "none";
        window._selectedSupplier = supplier;
        if (paymentFields) paymentFields.style.display = "block";
        loadPaymentFormFields();
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

      personIdField.value = foundSupplier.a;
      document.getElementById("selectedUniqueId").value = uniqueId || "";

      if (openBtn) openBtn.style.display = "none";

      window._selectedSupplier = foundSupplier;

      if (paymentFields) {
        paymentFields.style.display = "block";
      }

      loadPaymentFormFields();
    } else {
      clientDisplay.value = "❌ No supplier found for: " + searchTerm;
      clientDisplay.style.color = "#d32f2f";
      clientDisplay.style.fontWeight = "bold";
      clientDisplay.style.background = "#ffebee";
      clientDisplay.style.borderColor = "#d32f2f";

      personIdField.value = "";
      document.getElementById("selectedUniqueId").value = "";
      window._selectedSupplier = null;

      if (openBtn) {
        openBtn.style.display = "inline-block";
        openBtn.innerHTML = '<i class="fas fa-plus"></i> Add "' + searchTerm + '"';
      }

      if (paymentFields) {
        paymentFields.style.display = "none";
      }
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
        var personIdField = document.getElementById("paymentPersonId");
        var paymentFields = document.getElementById("paymentFieldsContainer");
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
        personIdField.value = supplier.a;
        document.getElementById("selectedUniqueId").value = uniqueId || "";
        if (openBtn) openBtn.style.display = "none";
        window._selectedAnimalTypes = null;
        window._selectedSupplier = supplier;
        if (paymentFields) paymentFields.style.display = "block";
        loadPaymentFormFields();
      }
    );
    if (animalMatchCount > 0) {
      clientDisplay.value =
        "📋 Found " + animalMatchCount + " parties — tap to select";
      clientDisplay.style.color = "#1a237e";
      clientDisplay.style.fontWeight = "bold";
      clientDisplay.style.background = "#e3f2fd";
      clientDisplay.style.borderColor = "#2196f3";
      personIdField.value = "";
      document.getElementById("selectedUniqueId").value = "";
      window._selectedSupplier = null;
      if (paymentFields) paymentFields.style.display = "none";
      if (openBtn) openBtn.style.display = "none";
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

    personIdField.value = foundSupplier.a;
    document.getElementById("selectedUniqueId").value = uniqueId || "";

    // ✅ Hide + button (supplier found)
    if (openBtn) {
      openBtn.style.display = "none";
    }

    // ✅ Store supplier data
    window._selectedSupplier = foundSupplier;

    // ✅ Show payment fields
    if (paymentFields) {
      paymentFields.style.display = "block";
    }

    // ✅ Load payment form fields
    loadPaymentFormFields();
  } else {
    // ❌ Supplier NOT found - show + button, NO MODAL
    clientDisplay.value = "❌ No supplier found for: " + searchTerm;
    clientDisplay.style.color = "#d32f2f";
    clientDisplay.style.fontWeight = "bold";
    clientDisplay.style.background = "#ffebee";
    clientDisplay.style.borderColor = "#d32f2f";

    personIdField.value = "";
    document.getElementById("selectedUniqueId").value = "";
    window._selectedSupplier = null;

    // ✅ Show + button (supplier not found)
    if (openBtn) {
      openBtn.style.display = "inline-block";
      openBtn.innerHTML =
        '<i class="fas fa-plus"></i> Add "' + searchTerm + '"';
    }

    // ✅ Hide payment fields
    if (paymentFields) {
      paymentFields.style.display = "none";
    }
  }
}

// ============================================================
// OPEN SUPPLIER LIST (uses shared window.openSupplierList from mi.js)
// ============================================================

// ============================================================
// COMPUTE SUPPLIER TOTALS FROM INDEXEDDB (single source of truth)
// ============================================================

window.computeSupplierTotals = async function (personId) {
  var supplierId = parseInt(String(personId).replace(/^P/, ""));
  var milkTotal = 0;
  var paidTotal = 0;
  var receivedTotal = 0;
  try {
    var collections = (await dbDexieManager.getAllRecords(dbnm, "mi")) || [];
    for (var i = 0; i < collections.length; i++) {
      if (parseInt(collections[i].e) == supplierId) {
        milkTotal += parseFloat(collections[i].j) || 0;
      }
    }
    var payments = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
    for (var j = 0; j < payments.length; j++) {
      if (parseInt(payments[j].h) == supplierId) {
        var amt = parseFloat(payments[j].j) || 0;
        if (parseInt(payments[j].f) == 2) paidTotal += amt;
        else receivedTotal += amt;
      }
    }
  } catch (e) {
    console.warn("⚠️ Could not compute supplier totals:", e.message);
  }
  console.log("📊 computeSupplierTotals → supplierId:", supplierId, "milkTotal:", milkTotal, "paidTotal:", paidTotal, "receivedTotal:", receivedTotal);
  return { milkTotal: milkTotal, paidTotal: paidTotal, receivedTotal: receivedTotal };
};

// ============================================================
// CHECK AMOUNT BALANCE
// ============================================================

async function checkAmountBalance() {
  var personId = document.getElementById("paymentPersonId")?.value;
  if (!personId) return;

  var paymentRadio = document.getElementById("radioPayment");
  if (!paymentRadio.checked) return;

  var amount = parseFloat(document.getElementById("paymentAmount")?.value) || 0;
  if (amount <= 0) return;

  var totals = await window.computeSupplierTotals(personId);
  var milkTotal = totals.milkTotal;

  var tempTotal = 0;
  if (window._tempPayments) {
    for (var j = 0; j < window._tempPayments.length; j++) {
      tempTotal += window._tempPayments[j].amount;
    }
  }

  var paidAmount = totals.paidTotal + tempTotal;
  var balance = milkTotal - paidAmount;

  if (amount > milkTotal) {
    var extraAmount = amount - milkTotal;
    document.getElementById("summaryBalance").textContent =
      "-₹" + extraAmount.toFixed(2);
    document.getElementById("summaryBalance").style.color = "#d63031";
  }
}

// ============================================================
// RADIO BUTTON CHANGE HANDLER - CORRECTED
// ============================================================

function onTransactionTypeChange() {
  var paymentRadio = document.getElementById("radioPayment");
  var receivedRadio = document.getElementById("radioReceived");

  var transType = paymentRadio.checked
    ? "2"
    : receivedRadio.checked
      ? "1"
      : "0";

  window._currentTransType = transType;

  if (window._tempPayments && window._tempPayments.length > 0) {
    var currentType = window._tempPayments[0]?.transactionType;
    if (String(currentType) !== String(transType)) {
      clearTempPaymentsWithModal();
    }
  }

  toggleSubmitBtn();
  updateBalanceInfo();
  updatePaymentHistory();
}

// ============================================================
// LOAD PAYMENT FORM FIELDS
// ============================================================

function loadPaymentFormFields() {
  var personId = document.getElementById("paymentPersonId")?.value;
  var paymentFields = document.getElementById("paymentFieldsContainer");

  if (personId) {
    var persons = window.milk_persons || [];
    var person = persons.find(function (p) {
      return String(p.a) == String(personId);
    });
    if (person) {
      var name = person.h || person.i || person.e || "Unnamed";
      var phone = person.e || "";
      var uniqueId = person.k || "";

      var clientDisplay = document.getElementById("clientDisplay");
      if (clientDisplay) {
        clientDisplay.value =
          "🆔 " + (uniqueId || "N/A") + " | " + name + " | 📱 " + phone;
        clientDisplay.style.color = "#1a237e";
        clientDisplay.style.background = "#e8f5e9";
        clientDisplay.style.borderColor = "#4caf50";
      }
    }

    paymentFields.style.display = "block";
    updateBalanceInfo();
    updatePaymentHistory();
    toggleSubmitBtn();
    checkAmountBalance();

    if (window._tempPayments && window._tempPayments.length > 0) {
      window.showModal({
        title: "Change Client",
        message:
          "You are changing the client.<br><br>If you continue, the current list will be cleared. Do you want to continue?",
        type: "confirm",
        onConfirm: function () {
          window._tempPayments = [];
          updateTempPaymentsUI();
          updateSummary();
          showMessageModal("Info", "✅ List cleared for new client.", false);
        },
        onCancel: function () {
          var currentPersonId = window._tempPayments[0]?.personId || "";
          document.getElementById("paymentPersonId").value = currentPersonId;
          loadPaymentFormFields();
        },
      });
    }
  } else {
    paymentFields.style.display = "none";
    document.getElementById("clientDisplay").value =
      "👆 Click to choose client...";
    document.getElementById("clientDisplay").style.color = "#999";
  }
}

// ============================================================
// CLEAR TEMP PAYMENTS WITH MODAL
// ============================================================

function clearTempPaymentsWithModal() {
  if (!window._tempPayments || window._tempPayments.length === 0) {
    return;
  }

  var paymentRadio = document.getElementById("radioPayment");
  var newType = paymentRadio.checked ? "2" : "1";

  var typeLabel = newType == "2" ? "Payment" : "Received";
  var currentType = window._tempPayments[0]?.transactionType;

  if (currentType === undefined || currentType === null) return;

  var currentLabel = currentType == "2" ? "Payment" : "Received";

  if (String(currentType) === String(newType)) return;

  window.showModal({
    title: "Change Transaction Type",
    message:
      "You are changing from <strong>" +
      currentLabel +
      "</strong> to <strong>" +
      typeLabel +
      "</strong>.<br><br>If you continue, the current list of " +
      currentLabel.toLowerCase() +
      "s will be cleared. Do you want to continue?",
    type: "confirm",
    onConfirm: function () {
      window._tempPayments = [];
      updateTempPaymentsUI();
      updateSummary();
      showMessageModal(
        "Info",
        "✅ List cleared. Now adding " + typeLabel.toLowerCase() + "s.",
        false,
      );
    },
    onCancel: function () {
      var revertType = window._tempPayments[0]?.transactionType || "2";
      if (revertType == "2") {
        document.getElementById("radioPayment").checked = true;
      } else {
        document.getElementById("radioReceived").checked = true;
      }
    },
  });
}

// ============================================================
// UPDATE BALANCE INFO - Clearer Labels
// ============================================================

async function updateBalanceInfo() {
  var personId = document.getElementById("paymentPersonId")?.value;
  if (!personId) return;

  var totals = await window.computeSupplierTotals(personId);
  var milkTotal = totals.milkTotal;
  var paidAmount = totals.paidTotal;

  var balance = milkTotal - paidAmount;
  console.log("⚖️ updateBalanceInfo → milkTotal:", milkTotal, "paidAmount:", paidAmount, "balance:", balance);
  document.getElementById("balanceInfo").innerHTML =
    "<span>💵 <strong>Milk Total:</strong> ₹" +
    milkTotal.toFixed(2) +
    "</span> | " +
    '<span style="color:#2e7d32;">💰 <strong>Paid Amount:</strong> ₹' +
    paidAmount.toFixed(2) +
    "</span> | " +
    '<span style="color:' +
    (balance < 0 ? "#d63031" : "#c62828") +
    ';">⚖️ <strong>Balance:</strong> ₹' +
    balance.toFixed(2) +
    "</span>";
}

// ============================================================
// TOGGLE SUBMIT BUTTON
// ============================================================

function toggleSubmitBtn() {
  var btn = document.getElementById("submitPaymentBtn");
  if (!btn) return;
  var paymentRadio = document.getElementById("radioPayment");
  var receivedRadio = document.getElementById("radioReceived");
  var type = paymentRadio.checked || receivedRadio.checked;
  var personId = document.getElementById("paymentPersonId")?.value;
  btn.disabled =
    !type ||
    !personId ||
    !window._tempPayments ||
    window._tempPayments.length === 0;
}

// ============================================================
// ADD TEMP PAYMENT - CORRECTED LABELS
// ============================================================

function addTempPayment() {
  var date = document.getElementById("paymentDate")?.value;
  var amount = parseFloat(document.getElementById("paymentAmount")?.value) || 0;
  var type = document.getElementById("paymentType")?.value;
  var paymentRadio = document.getElementById("radioPayment");
  var receivedRadio = document.getElementById("radioReceived");
  var transType = 0;
  var note = document.getElementById("paymentNote")?.value;
  var discAmt =
    parseFloat(document.getElementById("paymentDiscountAmt")?.value) || 0;

  // ✅ Validation
  if (!paymentRadio.checked && !receivedRadio.checked) {
    showMessageModal("Validation", "❌ Please select transaction type!", true);
    return;
  }

  if (paymentRadio.checked) {
    transType = 2; // Payment - Admin pays supplier
  } else if (receivedRadio.checked) {
    transType = 1; // Received - Admin receives from supplier
  }

  if (!date) {
    showMessageModal("Validation", "❌ Please select a date!", true);
    return;
  }
  if (amount <= 0) {
    showMessageModal("Validation", "❌ Please enter a valid amount!", true);
    return;
  }

  if (!window._tempPayments) window._tempPayments = [];

  var transLabel = transType == 1 ? "📥 Received" : "💰 Payment";

  window._tempPayments.push({
    id: Date.now(),
    date: date,
    amount: amount,
    paymentType: type || "",
    transactionType: transType,
    transLabel: transLabel,
    discount: discAmt,
    note: note,
    personId: document.getElementById("paymentPersonId").value,
  });

  // ✅ Clear amount field after adding
  document.getElementById("paymentAmount").value = "";
  document.getElementById("paymentDiscountPct").value = "0";
  document.getElementById("paymentDiscountAmt").value = "0";
  document.getElementById("paymentNote").value = "";

  updateTempPaymentsUI();
  updateSummary();
  toggleSubmitBtn();
  showMessageModal("Success", "✅ Entry added to list!", false);
}

// ============================================================
// UPDATE TEMP PAYMENTS UI - CORRECTED LABELS
// ============================================================

function updateTempPaymentsUI() {
  var container = document.getElementById("tempPaymentsContainer");
  if (!container) return;

  if (!window._tempPayments || window._tempPayments.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";

  var firstItem = window._tempPayments[0];
  var headerText = "📋 Entries to be Saved";
  if (firstItem) {
    headerText =
      firstItem.transactionType == 1
        ? "📋 Received (Received from Supplier)"
        : "📋 Payment (Paid to Supplier)";
  }

  var html =
    '<h6 class="mt-2 mb-2 fw-bold" style="font-size:13px;">' +
    headerText +
    "</h6>";
  html += '<div style="overflow-x:auto;">';
  html +=
    '<table class="table table-sm table-bordered" style="font-size:11px;margin:0;">';
  html +=
    '<thead style="background:#f5f5f5;"><tr><th>Date</th><th>Type</th><th>Amount</th><th>Mode</th><th>Note</th><th></th></tr></thead><tbody>';

  var modeLabels = {
    1: "Cash",
    2: "Cheque",
    3: "Card",
    4: "UPI",
    5: "Bank Transfer",
  };

  for (var i = 0; i < window._tempPayments.length; i++) {
    var p = window._tempPayments[i];
    var transLabel = p.transactionType == 1 ? "📥 Received" : "💰 Payment";
    var modeLabel = modeLabels[p.paymentType] || "-";
    var noteDisplay = p.note ? p.note.substring(0, 15) : "-";
    if (noteDisplay.length > 15) noteDisplay += "...";

    html += "<tr>";
    html += "<td>" + p.date + "</td>";
    html += "<td>" + transLabel + "</td>";
    html += "<td><strong>₹" + p.amount.toFixed(2) + "</strong></td>";
    html += "<td>" + modeLabel + "</td>";
    html += "<td style='font-size:10px;color:#888;'>" + noteDisplay + "</td>";
    html +=
      '<td><button class="btn btn-outline-danger btn-sm" onclick="removeTempPayment(' +
      p.id +
      ')" style="font-size:10px;padding:2px 6px;">&times;</button></td>';
    html += "</tr>";
  }
  html += "</tbody></table></div>";
  container.innerHTML = html;
}

// ============================================================
// REMOVE TEMP PAYMENT
// ============================================================

function removeTempPayment(id) {
  if (!window._tempPayments) return;
  window._tempPayments = window._tempPayments.filter(function (p) {
    return p.id !== id;
  });
  updateTempPaymentsUI();
  updateSummary();
  toggleSubmitBtn();
}

// ============================================================
// UPDATE SUMMARY - Clearer Labels
// ============================================================

async function updateSummary() {
  var personId = document.getElementById("paymentPersonId")?.value;
  if (!personId) return;

  var totals = await window.computeSupplierTotals(personId);
  var milkTotal = totals.milkTotal;

  var tempTotal = 0;
  if (window._tempPayments) {
    for (var j = 0; j < window._tempPayments.length; j++) {
      tempTotal += window._tempPayments[j].amount;
    }
  }

  var paidAmount = totals.paidTotal + tempTotal;
  var balance = milkTotal - paidAmount;

  console.log("📊 updateSummary → milkTotal:", milkTotal, "paidAmount:", paidAmount, "tempTotal:", tempTotal, "balance:", balance);
  document.getElementById("summaryFinal").textContent =
    "₹" + milkTotal.toFixed(2);
  document.getElementById("summaryReceived").textContent =
    "₹" + paidAmount.toFixed(2);
  var balEl = document.getElementById("summaryBalance");
  balEl.textContent = "₹" + balance.toFixed(2);
  balEl.style.color =
    balance < 0 ? "#d63031" : balance > 0 ? "#c62828" : "#2e7d32";
}

// ============================================================
// UPDATE PAYMENT HISTORY - WITH MODE AND NOTE
// ============================================================

window.updatePaymentHistory = async function () {
  var personId = document.getElementById("paymentPersonId")?.value;
  if (!personId) return;

  var container = document.getElementById("paymentHistoryContainer");

  // Get payments from IndexedDB
  var allRecords = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
  var personRecords = allRecords.filter(function (r) {
    return r.h == parseInt(String(personId).replace(/^P/, ""));
  });

  if (personRecords.length === 0) {
    container.innerHTML = '<small class="text-muted">No history</small>';
    return;
  }

  var typeLabels = {
    1: "Cash",
    2: "Cheque",
    3: "Card",
    4: "UPI",
    5: "Bank Transfer",
  };
  var transLabels = { 1: "📥 Received", 2: "💰 Payment" };

  var html =
    '<small class="fw-bold text-muted">📜 History (' +
    personRecords.length +
    ")</small>";
  html += '<div style="max-height:150px;overflow-y:auto;">';

  // Show last 10 records (newest first)
  var displayRecords = personRecords.slice(-10).reverse();

  for (var i = 0; i < displayRecords.length; i++) {
    var record = displayRecords[i];
    var typeLabel = typeLabels[record.i] || "?";
    var transLabel = transLabels[record.f] || "?";
    var amount = parseFloat(record.j) || 0;
    var noteDisplay = record.note ? " 📝 " + record.note : "";

    html +=
      '<div class="d-flex justify-content-between p-1" style="font-size:11px;border-bottom:1px solid #eee;">';
    html += "<span>" + (record.k || "?") + "</span>";
    html += "<span>" + transLabel + "</span>";
    html += "<strong>₹" + amount.toFixed(2) + "</strong>";
    html += "<small>(" + typeLabel + noteDisplay + ")</small>";
    html += "</div>";
  }
  html += "</div>";
  container.innerHTML = html;
};

// ============================================================
// SHOW FULL PAYMENT HISTORY (Modal) - WITH MODE AND NOTE
// ============================================================

window.showFullPaymentHistory = async function () {
  var personId = document.getElementById("paymentPersonId")?.value;
  if (!personId) {
    showMessageModal("Info", "⚠️ Please select a client first!", false);
    return;
  }

  var clientDisplay = document.getElementById("clientDisplay");
  var clientName = clientDisplay ? clientDisplay.value : "Unknown";

  // Get payments from IndexedDB
  var allRecords = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
  var payments = allRecords.filter(function (r) {
    return r.h == parseInt(String(personId).replace(/^P/, ""));
  });

  // Sort by date descending (newest first)
  payments.sort(function (a, b) {
    return new Date(b.k) - new Date(a.k);
  });

  // Build month/year/type filter options
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var monthOptions = "";
  var yearOptions = "";
  var currentYear = new Date().getFullYear();

  for (var m = 0; m < months.length; m++) {
    monthOptions +=
      '<option value="' + (m + 1) + '">' + months[m] + "</option>";
  }
  for (var y = currentYear - 5; y <= currentYear; y++) {
    yearOptions += '<option value="' + y + '">' + y + "</option>";
  }

  var typeLabels = {
    1: "Cash",
    2: "Cheque",
    3: "Card",
    4: "UPI",
    5: "Bank Transfer",
  };
  var transLabels = { 1: "Received", 2: "Payment" };

  var html = `
    <div id="paymentHistoryModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:99999; display:flex; align-items:center; justify-content:center; padding:20px;">
      <div style="background:var(--surface); border-radius:15px; max-width:900px; width:100%; max-height:85vh; overflow:hidden; display:flex; flex-direction:column;">
        <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:15px 20px; border-radius:15px 15px 0 0; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
          <h5 class="mb-0"><i class="fas fa-history me-2"></i>Payment History - ${clientName} (${payments.length})</h5>
          <button onclick="closeModal('paymentHistoryModal')" style="background:transparent; border:none; color:white; font-size:24px; cursor:pointer;">&times;</button>
        </div>
        <div style="padding:15px; overflow-y:auto; flex:1;">
          <div style="display:flex; gap:15px; margin-bottom:15px; flex-wrap:wrap;">
            <div>
              <label style="font-size:12px; font-weight:600;">📅 Month</label>
              <select class="form-select form-select-sm" id="historyFilterMonth" style="font-size:12px; padding:4px 8px; border-radius:4px; border:1px solid #ccc;">
                <option value="all">All Months</option>
                ${monthOptions}
              </select>
            </div>
            <div>
              <label style="font-size:12px; font-weight:600;">📅 Year</label>
              <select class="form-select form-select-sm" id="historyFilterYear" style="font-size:12px; padding:4px 8px; border-radius:4px; border:1px solid #ccc;">
                <option value="all">All Years</option>
                ${yearOptions}
              </select>
            </div>
            <div>
              <label style="font-size:12px; font-weight:600;">🏷️ Type</label>
              <select class="form-select form-select-sm" id="historyFilterType" style="font-size:12px; padding:4px 8px; border-radius:4px; border:1px solid #ccc;">
                <option value="all">All</option>
                <option value="2">Payment</option>
                <option value="1">Received</option>
              </select>
            </div>
            <div style="display:flex; align-items:flex-end;">
              <button class="btn btn-primary btn-sm" onclick="applyPaymentFilter()" style="background:#667eea; color:white; border:none; padding:5px 15px; border-radius:4px; font-size:12px; cursor:pointer;">
                <i class="fas fa-filter"></i> Apply
              </button>
            </div>
          </div>
          <div style="overflow-x:auto; -webkit-overflow-scrolling:touch;">
            <table style="width:100%; border-collapse:collapse; font-size:12px; min-width:750px;">
              <thead>
                <tr style="background:#667eea; color:white;">
                  <th style="padding:8px 6px; text-align:center; border:1px solid #5a6fd6;">Date</th>
                  <th style="padding:8px 6px; text-align:center; border:1px solid #5a6fd6;">Type</th>
                  <th style="padding:8px 6px; text-align:center; border:1px solid #5a6fd6;">Mode</th>
                  <th style="padding:8px 6px; text-align:center; border:1px solid #5a6fd6;">Amount</th>
                  <th style="padding:8px 6px; text-align:center; border:1px solid #5a6fd6;">Discount</th>
                  <th style="padding:8px 6px; text-align:center; border:1px solid #5a6fd6;">Note</th>
                  <th style="padding:8px 6px; text-align:center; border:1px solid #5a6fd6;">Actions</th>
                </tr>
              </thead>
              <tbody id="paymentHistoryBody">
  `;

  if (payments.length === 0) {
    html +=
      '<tr><td colspan="7" style="text-align:center;padding:30px;color:#999;">No payment records found for this client</td></tr>';
  } else {
    payments.forEach(function (record) {
      var typeLabel = transLabels[record.f] || "?";
      var modeLabel = typeLabels[record.i] || "?";
      var amount = parseFloat(record.j) || 0;

      html += `
        <tr>
          <td style="padding:6px 4px; text-align:center; border:1px solid #ddd;">${record.k || "-"}</td>
          <td style="padding:6px 4px; text-align:center; border:1px solid #ddd;">${typeLabel}</td>
          <td style="padding:6px 4px; text-align:center; border:1px solid #ddd;">${modeLabel}</td>
          <td style="padding:6px 4px; text-align:center; border:1px solid #ddd;">₹${amount.toFixed(2)}</td>
          <td style="padding:6px 4px; text-align:center; border:1px solid #ddd;">${parseFloat(record.td || 0).toFixed(2)}</td>
          <td style="padding:6px 4px; text-align:center; border:1px solid #ddd;">${record.note || "-"}</td>
          <td style="padding:6px 4px; text-align:center; border:1px solid #ddd; white-space:nowrap;">
            <button onclick="window.editPaymentRecord(${record.a})" style="background:#667eea; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px;">
              <i class="fas fa-edit"></i>
            </button>
          </td>
        </tr>
      `;
    });
  }

  html += `
              </tbody>
            </table>
          </div>
        </div>
        <div style="padding:12px 20px; border-top:1px solid #eee; text-align:center; flex-shrink:0;">
          <button class="btn btn-secondary btn-sm" onclick="closeModal('paymentHistoryModal')" style="padding:6px 20px; border-radius:6px; border:1px solid #ccc; background:#f5f5f5; color:#333; cursor:pointer;">Close</button>
        </div>
      </div>
    </div>
  `;

  var div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div.firstElementChild);
};

// ============================================================
// APPLY PAYMENT FILTER
// ============================================================

function applyPaymentFilter() {
  var month = document.getElementById("historyFilterMonth")?.value;
  var year = document.getElementById("historyFilterYear")?.value;
  var type = document.getElementById("historyFilterType")?.value;
  var tableBody = document.getElementById("paymentHistoryBody");
  if (!tableBody) return;

  var rows = tableBody.querySelectorAll("tr");
  if (rows.length === 0) return;

  rows.forEach(function (row) {
    var dateCell = row.querySelector("td:first-child");
    var typeCell = row.querySelector("td:nth-child(2)");
    if (!dateCell || !typeCell) return;

    var dateText = dateCell.textContent.trim();
    var parts = dateText.split("-");

    var rowMonth = parseInt(parts[1]);
    var rowYear = parseInt(parts[2]);
    var rowType = typeCell.textContent.trim();

    var show = true;
    if (month !== "all" && rowMonth != month) show = false;
    if (year !== "all" && rowYear != year) show = false;
    if (type !== "all" && rowType !== (type == "2" ? "Payment" : "Received"))
      show = false;

    row.style.display = show ? "" : "none";
  });
}

// ============================================================
// DUPLICATE CONFIRMATION MODAL (Yes/No)
// ============================================================

function showDuplicateConfirmModal(message) {
  return new Promise(function (resolve) {
    var mid = "dupConfirmModal_" + Date.now();

    var html = `
      <div class="modal fade" id="${mid}" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header" style="background:#ff9800;color:white;">
              <h6 class="modal-title">⚠️ Duplicate Entry Detected</h6>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" style="white-space:pre-wrap;font-size:14px;">
              ${message}
            </div>
            <div class="modal-footer" style="display:flex;gap:10px;justify-content:flex-end;">
              <button class="btn btn-success" id="${mid}_yesBtn" style="padding:8px 20px;font-weight:bold;">
                <i class="fas fa-check"></i> Yes, Add Entry
              </button>
              <button class="btn btn-secondary" id="${mid}_noBtn" style="padding:8px 20px;" data-bs-dismiss="modal">
                <i class="fas fa-times"></i> No, Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    var div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);

    var modalEl = document.getElementById(mid);
    var modal = new bootstrap.Modal(modalEl);
    modal.show();

    // ✅ Yes button - Proceed with incremented n
    document
      .getElementById(mid + "_yesBtn")
      .addEventListener("click", function () {
        modal.hide();
        resolve(true);
      });

    // ✅ No button / Close - Skip this entry
    document
      .getElementById(mid + "_noBtn")
      .addEventListener("click", function () {
        modal.hide();
        resolve(false);
      });

    // ✅ Also handle close button (X) and backdrop click
    var resolved = false;
    modalEl.addEventListener("hidden.bs.modal", function () {
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
      setTimeout(function () {
        if (modalEl.parentNode) {
          modalEl.remove();
        }
      }, 300);
    });
  });
}

// ============================================================
// SUBMIT ALL PAYMENTS - With Local + Server Duplicate Handling
// ============================================================

window.submitAllPayments = async function () {
  var paymentRadio = document.getElementById("radioPayment");
  var receivedRadio = document.getElementById("radioReceived");

  if (!paymentRadio.checked && !receivedRadio.checked) {
    showMessageModal("Validation", "❌ Select Transaction Type!", true);
    return;
  }
  if (!window._tempPayments || window._tempPayments.length === 0) {
    showMessageModal("Info", "📋 No payments to submit!", false);
    return;
  }

  var personId = document.getElementById("paymentPersonId").value;
  if (!personId) {
    showMessageModal("Validation", "❌ Please select a client first!", true);
    return;
  }

  // ✅ Fetch ALL existing records from local IndexedDB r table
  var allExistingRecords = [];
  try {
    allExistingRecords = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
  } catch (e) {
    console.warn("⚠️ Could not fetch existing records:", e.message);
  }

  var successCount = 0;
  var skippedCount = 0;

  for (var i = 0; i < window._tempPayments.length; i++) {
    var p = window._tempPayments[i];

    // ✅ Determine transaction type
    var transactionType = parseInt(p.transactionType); // 1=Received, 2=Payment
    var supplierId = parseInt(String(personId).replace(/^P/, ""));
    var amount = p.amount.toString();
    var date = p.date;

    // ============================================================
    // ✅ LOCAL DUPLICATE CHECK (in IndexedDB r table)
    // ============================================================
    
    var matchingRecords = allExistingRecords.filter(function (r) {
      return (
        parseInt(r.f) == transactionType &&
        parseInt(r.h) == supplierId &&
        String(r.j) == amount &&
        String(r.k) == date
      );
    });

    // Find max n from local records
    var maxN = 0;
    for (var m = 0; m < matchingRecords.length; m++) {
      var nVal = parseInt(matchingRecords[m].n) || 0;
      if (nVal > maxN) maxN = nVal;
    }

    var newN = maxN; // Start with current max n

    var sent = false;
    var maxRetries = 5; // Safety limit
    var retryCount = 0;

    while (!sent && retryCount < maxRetries) {
      var paymentObj = {
        f: transactionType,
        h: supplierId,
        i: p.paymentType || "",
        j: amount,
        k: date,
        td: p.discount || 0,
        tb: 31,
        su: 1,
        n: newN,
        note: p.note || "",
      };

      clearPayload0();

      payload0.p = null;
      payload0.r = paymentObj;
      payload0.vw = 1;
      payload0.fn = 23;
      payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "r" }]);

      try {
        if (typeof fnj3 !== "function") {
          showMessageModal("Error", "❌ Server connection not available!", true);
          return;
        }

        var response = await fnj3(
          "https://my1.in/2/b.php",
          payload0,
          1,
          true,
          null,
          20000,
          0,
          1,
          1,
        );
        console.log("📥 Server response:", response);

if (response && response.su == 1) {
          // ? SUCCESS - Server saved
          await handl_mi_rspons(response, 0);
          _submittedPayments.push(paymentObj);
          allExistingRecords.push({
            f: transactionType,
            h: supplierId,
            j: amount,
            k: date,
            n: newN,
          });
          successCount++;
          sent = true;
          console.log("✅ Entry saved successfully with n =", newN);
        } else {
          // ❌ SERVER REJECTED
          var errMsg = response ? (response.ms || "Server rejected the entry") : "Unknown error";
          
          // Check if it's a duplicate error from server
          if (errMsg && (
            errMsg.toLowerCase().indexOf("already been") > -1 ||
            errMsg.toLowerCase().indexOf("same date") > -1 ||
            errMsg.toLowerCase().indexOf("add 01 paise") > -1 ||
            errMsg.toLowerCase().indexOf("duplicate") > -1
          )) {
            // ✅ DUPLICATE ERROR - Show Yes/No modal
            var txnLabel = transactionType === 1 ? "Received" : "Payment";
            var txnIcon = transactionType === 1 ? "📥" : "💰";
            
            var dupMsg =
              "⚠️ Second Entry Detected!\n\n" +
              txnIcon + " " + txnLabel + " of ₹" + p.amount.toFixed(2) + "\n" +
              "📅 Date: " + date + "\n" +
              "👤 Supplier ID: " + supplierId + "\n\n" +
              "This " + txnLabel.toLowerCase() + " already exists " + (maxN + 1) + " time(s).\n" +
              "Current entry number (n): " + newN + "\n\n" +
              "Do you want to add another entry?\n" +
              "(New entry will have n = " + (newN + 1) + ")";

            var confirmed = await showDuplicateConfirmModal(dupMsg);

            if (confirmed) {
              // ✅ User clicked YES - increment n and retry
              newN = newN + 1;
              maxN = newN;
              retryCount++;
              console.log("🔄 Retrying with n =", newN);
            } else {
              // ❌ User clicked NO - skip this entry
              console.log("⏭️ User skipped duplicate entry");
              skippedCount++;
              sent = true; // Exit loop (skip this entry)
            }
          } else {
            // Some other error - show and stop
            showMessageModal(
              "Error",
              "❌ Entry " + (i + 1) + " failed!\n\n" + errMsg,
              true,
            );
            return;
          }
        }
      } catch (err) {
        showMessageModal(
          "Error",
          "❌ Server unreachable!\n\n" + err.message,
          true,
        );
        return;
      }
    }

    // Safety check - if we exhausted retries
    if (!sent && retryCount >= maxRetries) {
      showMessageModal(
        "Error",
        "❌ Too many retry attempts for entry " + (i + 1) + "!\n\nPlease try again later.",
        true,
      );
      return;
    }
  }

  // ============================================================
  // ✅ FINAL SUCCESS MESSAGE
  // ============================================================
  
  var finalMsg = "✅ " + successCount + " payment(s) submitted successfully!";
  if (skippedCount > 0) {
    finalMsg += "\n⏭️ " + skippedCount + " duplicate(s) skipped.";
  }
  
  showMessageModal("Success", finalMsg, false);

  // ✅ Reset form
  window._tempPayments = [];
  updateTempPaymentsUI();
  updateSummary();
  updateBalanceInfo();
  updatePaymentHistory();
  toggleSubmitBtn();
};

// ============================================================
// EXPOSE ALL FUNCTIONS TO GLOBAL SCOPE
// ============================================================

window.showMilkPaymentForm = showMilkPaymentForm;
window.loadPaymentFormFields = loadPaymentFormFields;
window.addTempPayment = addTempPayment;
window.submitAllPayments = window.submitAllPayments;
window.updateSummary = updateSummary;
window.updateBalanceInfo = updateBalanceInfo;
window.updateTempPaymentsUI = updateTempPaymentsUI;
window.removeTempPayment = removeTempPayment;
window.toggleSubmitBtn = toggleSubmitBtn;
window.checkAmountBalance = checkAmountBalance;
window.onTransactionTypeChange = onTransactionTypeChange;
window.clearTempPaymentsWithModal = clearTempPaymentsWithModal;
window.applyPaymentFilter = applyPaymentFilter;
window.showDuplicateConfirmModal = showDuplicateConfirmModal;
window.commonFnToRunAfter_op_ViewCall = commonFnToRunAfter_op_ViewCall;

console.log(
  "💵 Milk Payment Form loaded with local duplicate checking and Yes/No confirmation!",
);
