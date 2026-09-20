// ============================================================
// history.js - Milk Collection History Viewer
// ============================================================
//
// WHAT HAS BEEN DONE:
// 1. showCollectionHistory(e, f) - e = mobile, f = relation
// 2. Finds supplier inside the function using e + f
// 3. Reuses existing filtering logic
// 4. Clean, single responsibility
// 5. Added Supplier Summary Card (Milk Total, Payments, Received, Outstanding)
// 6. Added Footer Total Row in Milk Collection Table
// 7. Added Payment & Received History Table with Footer Total
// 8. Added Payment Summary (Payments, Received, Net Balance)
// 9. Added Transaction Type Filter (All / Payment / Received)
// 10. Added Icons: 🌅 Morning, 🌙 Evening, 🐃 Buffalo, 🐄 Cow
// 11. Consistent Date Format: DD-MM-YYYY everywhere
// 12. Added Entry Count in section titles
// 13. Added Edit functionality for Payment & Received records
// 14. Added Empty state messages
// 15. All alerts replaced with modals
// ============================================================

// ============================================================

window.admnHistoryReady = function () {};

// ============================================================
// Helper Functions
// ============================================================

/**
 * Normalize phone number by removing country code and dots
 */
function normalizePhone(phone) {
  if (!phone) return "";
  return String(phone)
    .replace(/^91\.?/, "")
    .replace(/^\+91/, "")
    .replace(/\./g, "")
    .replace(/\s/g, "")
    .trim();
}

// ============================================================
// NOTE: window.getMatchingPricingRecord is defined in
// mlkCltFrm.js (loaded before this module) and
// shared by collection entry and history edit flows.
// ============================================================

// ============================================================
// SHOW COLLECTION HISTORY - e = mobile, f = relation
// ============================================================

// ============================================================
// SHOW COLLECTION HISTORY - e = mobile, f = relation
// ============================================================

/**
 * Show milk collection and payment history for a supplier.
 * Finds the supplier using e (mobile) and f (relation) from the c table.
 *
 * @param {string} e - Mobile number (or null for admin panel)
 * @param {string} f - Relation (currently always "1" for self, or null for admin panel)
 *
 * If e and f are null, shows all records (admin panel view).
 * If e and f are provided, shows only that supplier's records.
 */
window.showCollectionHistory = async function (e, f) {
  console.log("======================================");
  console.log("SHOW COLLECTION HISTORY");
  console.log("Mobile (e):", e);
  console.log("Relation (f):", f);
  console.log("======================================");

  var supplierId = null;
  var clientName = "All Suppliers";
  var clientPhone = "";
  var uniqueId = "";
  var isAdminView = false;

  // ============================================================
  // STEP 1: IDENTIFY SUPPLIER OR ADMIN VIEW
  // ============================================================

  // ✅ If e and f are null/undefined, show ALL records (Admin View)
  if (!e || !f) {
    console.log("🔍 Admin View: Showing all records (e and f are null)");
    isAdminView = true;
    clientName = "All Suppliers";
    supplierId = null;
    window[my1uzr.worknOnPg].currentAdminPerson = { e: null, f: null };
  } else {
    window[my1uzr.worknOnPg].currentAdminPerson = { e: e, f: f };
    // ✅ Find supplier using e + f
    var allSuppliers = (await dbDexieManager.getAllRecords(dbnm, "c")) || [];
    var mobile = normalizePhone(e);

    console.log(
      "🔍 Searching for supplier with mobile:",
      mobile,
      "relation:",
      f,
    );

    var supplier = allSuppliers.find(function (item) {
      if (!item.e) return false;
      var supplierMobile = normalizePhone(item.e);
      return supplierMobile === mobile && String(item.f) === String(f);
    });

    if (!supplier) {
      console.error(
        "❌ Supplier not found for mobile:",
        mobile,
        "relation:",
        f,
      );
      showMessageModal(
        "Info",
        "⚠️ Supplier not found! Please contact the administrator.",
        false,
      );
      return;
    }

    supplierId = supplier.a;
    clientName = supplier.h || supplier.i || "Unknown";
    clientPhone = supplier.e || "";
    uniqueId = supplier.k || "";

    console.log("✅ Supplier found:", clientName);
    console.log("   Supplier ID:", supplierId);
    console.log("   Unique ID:", uniqueId || "Not set");
  }

  // ============================================================
  // STEP 2: FETCH ALL RECORDS
  // ============================================================

  var allRecords = await dbDexieManager.getAllRecords(dbnm, "mi");
  var allPricingRecords = await dbDexieManager.getAllRecords(dbnm, "mb");
  var allPaymentRecords = await dbDexieManager.getAllRecords(dbnm, "r");

  // Build pricing map
  var pricingMap = {};
  allPricingRecords.forEach(function (p) {
    pricingMap[p.a] = p;
  });

  // ============================================================
  // STEP 3: FILTER RECORDS (ALL or BY SUPPLIER)
  // ============================================================

  var personRecords = [];
  var personPayments = [];

  if (isAdminView) {
    // ✅ Admin View: Show ALL records
    personRecords = allRecords;
    personPayments = allPaymentRecords;
    console.log(
      "📊 Showing ALL records:",
      personRecords.length,
      "milk records,",
      personPayments.length,
      "payment records",
    );
  } else {
    // ✅ Supplier View: Filter by supplier ID
    personRecords = allRecords.filter(function (record) {
      return parseInt(record.e) === parseInt(supplierId);
    });

    personPayments = allPaymentRecords.filter(function (record) {
      return parseInt(record.h) === parseInt(supplierId);
    });
    console.log("📊 Showing records for supplier:", supplierId);
  }

  // ============================================================
  // STEP 4: SORT RECORDS
  // ============================================================

  personRecords.sort(function (a, b) {
    return new Date(b.f) - new Date(a.f);
  });

  personPayments.sort(function (a, b) {
    return new Date(b.k) - new Date(a.k);
  });

  // ============================================================
  // STEP 5: BUILD FILTER OPTIONS
  // ============================================================

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
  var currentMonth = new Date().getMonth() + 1;
  var firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  var lastDayOfMonth = new Date(currentYear, currentMonth, 0);

  for (var m = 0; m < months.length; m++) {
    var selected = m + 1 === currentMonth ? "selected" : "";
    monthOptions +=
      '<option value="' +
      (m + 1) +
      '" ' +
      selected +
      ">" +
      months[m] +
      "</option>";
  }
  for (var y = currentYear - 5; y <= currentYear; y++) {
    var selected = y === currentYear ? "selected" : "";
    yearOptions +=
      '<option value="' + y + '" ' + selected + ">" + y + "</option>";
  }

  // ============================================================
  // STEP 6: BUILD HTML
  // ============================================================

  var supplierDisplayName = isAdminView ? "📊 All Suppliers" : clientName;
  if (!isAdminView && uniqueId) {
    supplierDisplayName = "🆔 " + uniqueId + " | " + clientName;
  }

  var html = `
    <div id="collectionHistoryModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:99999; display:flex; align-items:center; justify-content:center; padding:20px;">
      <div style="background:var(--surface); border-radius:15px; max-width:1100px; width:100%; max-height:95vh; overflow:hidden; display:flex; flex-direction:column;">
        <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:12px 18px; border-radius:15px 15px 0 0; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
          <h5 class="mb-0" style="font-size:15px;"><i class="fas fa-history me-2"></i>Milk Collection History - ${supplierDisplayName} (${personRecords.length} Entries)</h5>
          <button onclick="window.closeModal('collectionHistoryModal')" style="background:transparent; border:none; color:white; font-size:22px; cursor:pointer;">&times;</button>
        </div>
        <div style="padding:12px 16px; overflow-y:auto; flex:1;">

          <!-- ========== FILTERS ========== -->
          <div style="background:#f8f7ff; padding:8px 10px; border-radius:8px; border:1.5px solid #667eea; margin-bottom:10px;">
            
            <!-- Row 1: Month, Year, Animal -->
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:5px; margin-bottom:6px;">
              <div style="min-width:0;">
                <label style="font-size:9px; font-weight:700; color:#5c6bc0; display:block; margin-bottom:1px;">📅 Month</label>
                <select class="form-select form-select-sm" id="historyFilterMonth" style="font-size:11px; padding:2px 4px; border:1.5px solid #5c6bc0; border-radius:4px; width:100%; min-width:0;">
                  <option value="all">All</option>
                  ${monthOptions}
                </select>
              </div>

              <div style="min-width:0;">
                <label style="font-size:9px; font-weight:700; color:#5c6bc0; display:block; margin-bottom:1px;">📅 Year</label>
                <select class="form-select form-select-sm" id="historyFilterYear" style="font-size:11px; padding:2px 4px; border:1.5px solid #5c6bc0; border-radius:4px; width:100%; min-width:0;">
                  <option value="all">All</option>
                  ${yearOptions}
                </select>
              </div>

              <div style="min-width:0;">
                <label style="font-size:9px; font-weight:700; color:#5c6bc0; display:block; margin-bottom:1px;">🐄 Animal</label>
                <select class="form-select form-select-sm" id="historyFilterAnimal" style="font-size:11px; padding:2px 4px; border:1.5px solid #5c6bc0; border-radius:4px; width:100%; min-width:0;">
                  <option value="all">All</option>
                  <option value="1">🐃</option>
                  <option value="2">🐄</option>
                </select>
              </div>
            </div>

            <!-- Row 2: From Date, To Date -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-bottom:6px;">
              <div style="min-width:0;">
                <label style="font-size:9px; font-weight:700; color:#5c6bc0; display:block; margin-bottom:1px;">📅 From</label>
                <input type="date" id="historyFromDate" class="form-control form-control-sm" style="font-size:10px; padding:2px 4px; border:1.5px solid #5c6bc0; border-radius:4px; width:100%; min-width:0; max-width:100%;" value="${formatDateYYYYMMDD(firstDayOfMonth)}">
              </div>

              <div style="min-width:0;">
                <label style="font-size:9px; font-weight:700; color:#5c6bc0; display:block; margin-bottom:1px;">📅 To</label>
                <input type="date" id="historyToDate" class="form-control form-control-sm" style="font-size:10px; padding:2px 4px; border:1.5px solid #5c6bc0; border-radius:4px; width:100%; min-width:0; max-width:100%;" value="${formatDateYYYYMMDD(lastDayOfMonth)}">
              </div>
            </div>

            <!-- Row 3: Type, Apply, Reset -->
            <div style="display:grid; grid-template-columns: 1fr auto auto; gap:5px; align-items:end;">
              <div style="min-width:0;">
                <label style="font-size:9px; font-weight:700; color:#5c6bc0; display:block; margin-bottom:1px;">🏷️ Type</label>
                <select class="form-select form-select-sm" id="historyPaymentFilterType" style="font-size:11px; padding:2px 4px; border:1.5px solid #5c6bc0; border-radius:4px; width:100%; min-width:0;">
                  <option value="all">All</option>
                  <option value="2">💰</option>
                  <option value="1">📥</option>
                </select>
              </div>

              <div style="min-width:32px;">
                <button class="btn btn-primary btn-sm" onclick="window.applyHistoryFilter()" style="background:#667eea; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer; white-space:nowrap; width:100%;">
                  <i class="fas fa-filter"></i>
                </button>
              </div>

              <div style="min-width:32px;">
                <button class="btn btn-secondary btn-sm" onclick="window.resetHistoryFilter()" style="background:#6c757d; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer; white-space:nowrap; width:100%;">
                  <i class="fas fa-undo"></i>
                </button>
              </div>
            </div>

            <div id="dateRangeDisplay" style="text-align:center;font-size:10px;color:#666;margin-top:4px;padding:3px 6px;background:#e8eaf6;border-radius:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
              📌 <span id="displayFromDate">${formatDateDisplay(firstDayOfMonth)}</span> → <span id="displayToDate">${formatDateDisplay(lastDayOfMonth)}</span>
            </div>
          </div>

          <!-- ========== SUPPLIER SUMMARY ========== -->
          <div style="background:linear-gradient(135deg, #f8f7ff 0%, #e8eaf6 100%); padding:12px 16px; border-radius:10px; border:2px solid #667eea; margin-bottom:12px;">
            <h6 style="font-size:13px; font-weight:700; color:#1a237e; text-align:center; margin-bottom:10px;"><i class="fas fa-chart-pie me-2"></i>Supplier Summary</h6>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap:8px; text-align:center;">
              <div style="background:var(--surface); padding:8px 10px; border-radius:8px; border:2px solid #4caf50;">
                <div style="font-size:10px; color:#2e7d32; font-weight:600;">🥛 Milk Total</div>
                <div style="font-size:16px; font-weight:700; color:#1b5e20;" id="summaryMilkTotal">₹0.00</div>
              </div>
              <div style="background:var(--surface); padding:8px 10px; border-radius:8px; border:2px solid #667eea;">
                <div style="font-size:10px; color:#5c6bc0; font-weight:600;">💰 Payments</div>
                <div style="font-size:16px; font-weight:700; color:#1a237e;" id="summaryPayments">₹0.00</div>
              </div>
              <div style="background:var(--surface); padding:8px 10px; border-radius:8px; border:2px solid #ff9800;">
                <div style="font-size:10px; color:#e65100; font-weight:600;">📥 Received</div>
                <div style="font-size:16px; font-weight:700; color:#e65100;" id="summaryReceived">₹0.00</div>
              </div>
              <div style="background:var(--surface); padding:8px 10px; border-radius:8px; border:2px solid #9c27b0;">
                <div style="font-size:10px; color:#6a1b9a; font-weight:600;">⚖️ Outstanding</div>
                <div style="font-size:16px; font-weight:700; color:#6a1b9a;" id="summaryOutstanding">₹0.00</div>
              </div>
            </div>
          </div>

          <!-- ========== MILK COLLECTION TABLE ========== -->
          <div style="margin-bottom:12px;">
            <h6 style="font-size:13px; font-weight:700; color:#2e7d32; margin-bottom:6px;"><i class="fas fa-tint me-2"></i>Milk Collection History (${personRecords.length} Entries)</h6>
            <div style="overflow-x:auto; -webkit-overflow-scrolling:touch;">
              <table style="width:100%; border-collapse:collapse; font-size:12px; min-width:650px;">
                <thead>
                  <tr style="background:#667eea; color:white;">
                    <th style="padding:5px 4px; text-align:center; border:1px solid #5a6fd6;">Date</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #5a6fd6;">Session</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #5a6fd6;">Animal</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #5a6fd6;">Qty</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #5a6fd6;">SNF</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #5a6fd6;">Fat</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #5a6fd6;">Amount</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #5a6fd6;">Actions</th>
                  </tr>
                </thead>
                <tbody id="historyTableBody">
                </tbody>
                <tfoot id="historyTableFooter" style="display:none;">
                  <tr style="background:#e8eaf6; font-weight:700; border-top:2px solid #667eea;">
                    <td colspan="3" style="padding:5px 4px; text-align:right;">TOTAL</td>
                    <td style="padding:5px 4px; text-align:center;" id="footerTotalQty">0.00</td>
                    <td colspan="2" style="padding:5px 4px; text-align:center;"></td>
                    <td style="padding:5px 4px; text-align:center; color:#1a237e;" id="footerTotalAmt">₹0.00</td>
                    <td style="padding:5px 4px; text-align:center;"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- ========== PAYMENT & RECEIVED HISTORY ========== -->
          <div style="margin-bottom:6px;">
            <h6 style="font-size:13px; font-weight:700; color:#6a1b9a; margin-bottom:6px;"><i class="fas fa-money-bill-wave me-2"></i>Payment & Received History (${personPayments.length} Entries)</h6>
            <div style="overflow-x:auto; -webkit-overflow-scrolling:touch;">
              <table style="width:100%; border-collapse:collapse; font-size:12px; min-width:600px;">
                <thead>
                  <tr style="background:#764ba2; color:white;">
                    <th style="padding:5px 4px; text-align:center; border:1px solid #8a5fc7;">Date</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #8a5fc7;">Type</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #8a5fc7;">Mode</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #8a5fc7;">Amount</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #8a5fc7;">Note</th>
                    <th style="padding:5px 4px; text-align:center; border:1px solid #8a5fc7;">Actions</th>
                  </tr>
                </thead>
                <tbody id="paymentHistoryBody">
                </tbody>
                <tfoot id="paymentHistoryFooter" style="display:none;">
                  <tr style="background:#f3e5f5; font-weight:700; border-top:2px solid #764ba2;">
                    <td colspan="2" style="padding:5px 4px; text-align:right;">TOTAL</td>
                    <td style="padding:5px 4px; text-align:center;"></td>
                    <td style="padding:5px 4px; text-align:center; color:#1a237e;" id="footerPaymentTotal">₹0.00</td>
                    <td colspan="2" style="padding:5px 4px; text-align:center;"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div id="paymentSummary" style="display:flex; gap:20px; flex-wrap:wrap; justify-content:center; padding:8px; background:#f3e5f5; border-radius:8px; margin-top:6px;">
              <span style="font-size:12px;">💰 <strong>Payments:</strong> <span id="paymentTotalPayments">₹0.00</span></span>
              <span style="font-size:12px;">📥 <strong>Received:</strong> <span id="paymentTotalReceived">₹0.00</span></span>
              <span style="font-size:12px;">⚖️ <strong>Net:</strong> <span id="paymentNetBalance">₹0.00</span></span>
            </div>
          </div>

        </div>
        <div style="padding:10px 20px; border-top:1px solid #eee; text-align:center; flex-shrink:0;">
          <button class="btn btn-secondary btn-sm" onclick="window.closeModal('collectionHistoryModal')" style="padding:5px 20px; border-radius:6px; border:1px solid #ccc; background:#f5f5f5; color:#333; cursor:pointer;">Close</button>
        </div>
      </div>
    </div>
  `;

  var div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div.firstElementChild);

  // Populate milk table
  populateMilkTable(personRecords, pricingMap);

  // Populate payment table
  populatePaymentTable(personPayments);

  // ✅ Apply initial filter
  setTimeout(function () {
    window.applyHistoryFilter();
  }, 100);
};
// ============================================================
// POPULATE MILK TABLE
// ============================================================

function populateMilkTable(personRecords, pricingMap) {
  var tableBody = document.getElementById("historyTableBody");
  if (!tableBody) return;

  if (personRecords.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;padding:20px;color:#999;">No collection records found</td></tr>';
    return;
  }

  var html = "";
  personRecords.forEach(function (record) {
    // ✅ Get pricing record using record.k (pricing ID)
    var pricing = pricingMap[record.k] || {};
    
    // ✅ Animal type is in record.h (mi table), NOT pricing.h
    var animalType = record.h;  // 1 = Buffalo, 2 = Cow
    var animalName = animalType == 1 ? "🐃 Buffalo" : animalType == 2 ? "🐄 Cow" : "-";
    
    // ✅ Session is in record.g
    var sessionName = record.g == 1 ? "🌅 Morning" : record.g == 2 ? "🌙 Evening" : "-";
    
    // ✅ Quantity is record.i
    var qty = parseFloat(record.i) || 0;
    
    // ✅ Amount is record.j
    var amount = parseFloat(record.j) || 0;
    
    // ✅ SNF is in pricing.h (mb table)
    var snf = parseFloat(pricing.h) || 0;
    
    // ✅ FAT is in pricing.g (mb table)
    var fat = parseFloat(pricing.g) || 0;
    
    // ✅ Rate is in pricing.i (mb table)
    var rate = parseFloat(pricing.i) || 0;

    html += `
      <tr data-date="${record.f}" data-animal="${animalType}">
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">${formatDateDisplay(record.f)}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">${sessionName}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">${animalName}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">${window.fmtMilk(qty)}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">${window.fmtSnf(snf)}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">${window.fmtFat(fat)}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">₹${amount.toFixed(2)}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd; white-space:nowrap;">
          <button onclick="window.editCollectionRecord(${record.a})" style="background:#667eea; color:white; border:none; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:11px;">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      </tr>
    `;
  });
  tableBody.innerHTML = html;
}

// ============================================================
// POPULATE PAYMENT TABLE
// ============================================================

function populatePaymentTable(personPayments) {
  var tableBody = document.getElementById("paymentHistoryBody");
  if (!tableBody) return;

  if (personPayments.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" style="text-align:center;padding:20px;color:#999;">No payment records found</td></tr>';
    return;
  }

  var modeLabels = {
    1: "Cash",
    2: "Cheque",
    3: "Card",
    4: "UPI",
    5: "Bank Transfer",
  };
  var transLabels = { 1: "📥 Received", 2: "💰 Payment" };

  var html = "";
  personPayments.forEach(function (record) {
    var typeLabel = transLabels[record.f] || "?";
    var modeLabel = modeLabels[record.i] || "-";
    var amount = parseFloat(record.j) || 0;

    html += `
      <tr data-date="${record.k}" data-type="${record.f}">
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">${formatDateDisplay(record.k)}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">${typeLabel}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">${modeLabel}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">₹${amount.toFixed(2)}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd;">${record.note || "-"}</td>
        <td style="padding:5px 4px; text-align:center; border:1px solid #ddd; white-space:nowrap;">
          <button onclick="window.editPaymentRecord(${record.a})" style="background:#667eea; color:white; border:none; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:11px;">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      </tr>
    `;
  });
  tableBody.innerHTML = html;
}

// ============================================================
// APPLY HISTORY FILTER - Including Date Range
// ============================================================

window.applyHistoryFilter = function () {
  var month = document.getElementById("historyFilterMonth")?.value;
  var year = document.getElementById("historyFilterYear")?.value;
  var animal = document.getElementById("historyFilterAnimal")?.value;
  var fromDate = document.getElementById("historyFromDate")?.value;
  var toDate = document.getElementById("historyToDate")?.value;
  var paymentType = document.getElementById("historyPaymentFilterType")?.value;

  var tableBody = document.getElementById("historyTableBody");
  var tableFooter = document.getElementById("historyTableFooter");
  var paymentBody = document.getElementById("paymentHistoryBody");
  var paymentFooter = document.getElementById("paymentHistoryFooter");
  var displayFrom = document.getElementById("displayFromDate");
  var displayTo = document.getElementById("displayToDate");

  // ✅ Update date range display
  if (fromDate && displayFrom) {
    displayFrom.textContent = formatDateDisplay(fromDate);
  }
  if (toDate && displayTo) {
    displayTo.textContent = formatDateDisplay(toDate);
  }

  // ✅ Calculate totals
  var totalMilkQty = 0;
  var totalMilkAmt = 0;
  var totalPayments = 0;
  var totalReceived = 0;

  // ========== FILTER MILK RECORDS ==========
  var fromDateObj = fromDate ? new Date(fromDate) : null;
  var toDateObj = toDate ? new Date(toDate) : null;
  if (toDateObj) toDateObj.setHours(23, 59, 59, 999);

  if (tableBody) {
    var milkRows = tableBody.querySelectorAll("tr");
    var filteredMilkRows = [];
    milkRows.forEach(function (row) {
      var dateCell = row.querySelector("td:first-child");
      if (!dateCell) return;

      var dateText = dateCell.textContent.trim();
      var parts = dateText.split("-");
      if (parts.length !== 3) return;

      var rowMonth = parseInt(parts[1]);
      var rowYear = parseInt(parts[2]);
      var rowAnimal = row.getAttribute("data-animal") || "";
      var rowDate = row.getAttribute("data-date") || "";

      var show = true;

      if (month !== "all" && rowMonth != month) show = false;
      if (year !== "all" && rowYear != year) show = false;
      if (animal !== "all" && rowAnimal != animal) show = false;
      if (show && fromDateObj && toDateObj && rowDate) {
        var recordDate = new Date(rowDate);
        if (recordDate < fromDateObj || recordDate > toDateObj) {
          show = false;
        }
      }

      if (show) {
        var qtyCell = row.querySelector("td:nth-child(4)");
        var amtCell = row.querySelector("td:nth-child(7)");
        if (qtyCell) totalMilkQty += parseFloat(qtyCell.textContent) || 0;
        if (amtCell)
          totalMilkAmt += parseFloat(amtCell.textContent.replace("₹", "")) || 0;
        filteredMilkRows.push(row);
      }

      row.style.display = show ? "" : "none";
    });

    if (tableFooter) {
      tableFooter.style.display =
        filteredMilkRows.length > 0 && totalMilkQty > 0 ? "" : "none";
      var footerQty = document.getElementById("footerTotalQty");
      var footerAmt = document.getElementById("footerTotalAmt");
      if (footerQty) footerQty.textContent = window.fmtMilk(totalMilkQty);
      if (footerAmt) footerAmt.textContent = "₹" + totalMilkAmt.toFixed(2);
    }
  }

  // ========== FILTER PAYMENT RECORDS ==========
  if (paymentBody) {
    var paymentRows = paymentBody.querySelectorAll("tr");
    var filteredPaymentRows = [];
    paymentRows.forEach(function (row) {
      var dateCell = row.querySelector("td:first-child");
      if (!dateCell) return;

      var dateText = dateCell.textContent.trim();
      var parts = dateText.split("-");
      if (parts.length !== 3) return;

      var rowMonth = parseInt(parts[1]);
      var rowYear = parseInt(parts[2]);
      var rowType = row.getAttribute("data-type") || "";
      var rowDate = row.getAttribute("data-date") || "";

      var show = true;

      if (month !== "all" && rowMonth != month) show = false;
      if (year !== "all" && rowYear != year) show = false;
      if (paymentType !== "all" && rowType != paymentType) show = false;
      if (show && fromDateObj && toDateObj && rowDate) {
        var recordDate = new Date(rowDate);
        if (recordDate < fromDateObj || recordDate > toDateObj) {
          show = false;
        }
      }

      if (show) {
        var amtCell = row.querySelector("td:nth-child(4)");
        if (amtCell) {
          var amt = parseFloat(amtCell.textContent.replace("₹", "")) || 0;
          if (rowType == "2") {
            totalPayments += amt;
          } else if (rowType == "1") {
            totalReceived += amt;
          }
        }
        filteredPaymentRows.push(row);
      }

      row.style.display = show ? "" : "none";
    });

    if (paymentFooter) {
      paymentFooter.style.display =
        filteredPaymentRows.length > 0 ? "" : "none";
      var footerPayment = document.getElementById("footerPaymentTotal");
      if (footerPayment)
        footerPayment.textContent =
          "₹" + (totalPayments + totalReceived).toFixed(2);
    }

    var payTotal = document.getElementById("paymentTotalPayments");
    var recTotal = document.getElementById("paymentTotalReceived");
    var netTotal = document.getElementById("paymentNetBalance");
    if (payTotal) payTotal.textContent = "₹" + totalPayments.toFixed(2);
    if (recTotal) recTotal.textContent = "₹" + totalReceived.toFixed(2);
    if (netTotal) {
      var net = totalPayments - totalReceived;
      netTotal.textContent = "₹" + net.toFixed(2);
      netTotal.style.color = net < 0 ? "#d63031" : "#1a237e";
    }
  }

  // ========== UPDATE SUMMARY ==========
  var summaryMilk = document.getElementById("summaryMilkTotal");
  var summaryPay = document.getElementById("summaryPayments");
  var summaryRec = document.getElementById("summaryReceived");
  var summaryOut = document.getElementById("summaryOutstanding");

  if (summaryMilk) summaryMilk.textContent = "₹" + totalMilkAmt.toFixed(2);
  if (summaryPay) summaryPay.textContent = "₹" + totalPayments.toFixed(2);
  if (summaryRec) summaryRec.textContent = "₹" + totalReceived.toFixed(2);
  if (summaryOut) {
    var outstanding = totalMilkAmt - totalPayments;
    summaryOut.textContent = "₹" + outstanding.toFixed(2);
    summaryOut.style.color = outstanding < 0 ? "#d63031" : "#6a1b9a";
  }
};

// ============================================================
// RESET HISTORY FILTER - Reset to current month
// ============================================================

window.resetHistoryFilter = function () {
  var now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth() + 1;
  var firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  var lastDayOfMonth = new Date(currentYear, currentMonth, 0);

  var monthSelect = document.getElementById("historyFilterMonth");
  var yearSelect = document.getElementById("historyFilterYear");
  var fromDateInput = document.getElementById("historyFromDate");
  var toDateInput = document.getElementById("historyToDate");
  var animalSelect = document.getElementById("historyFilterAnimal");
  var typeSelect = document.getElementById("historyPaymentFilterType");

  if (monthSelect) monthSelect.value = currentMonth;
  if (yearSelect) yearSelect.value = currentYear;
  if (animalSelect) animalSelect.value = "all";
  if (typeSelect) typeSelect.value = "all";
  if (fromDateInput) fromDateInput.value = formatDateYYYYMMDD(firstDayOfMonth);
  if (toDateInput) toDateInput.value = formatDateYYYYMMDD(lastDayOfMonth);

  var displayFrom = document.getElementById("displayFromDate");
  var displayTo = document.getElementById("displayToDate");
  if (displayFrom) displayFrom.textContent = formatDateDisplay(firstDayOfMonth);
  if (displayTo) displayTo.textContent = formatDateDisplay(lastDayOfMonth);

  window.applyHistoryFilter();

  showMessageModal(
    "Info",
    "✅ Reset to current month (" +
      months[currentMonth - 1] +
      " " +
      currentYear +
      ")",
    false,
  );
};

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

// ============================================================
// EDIT COLLECTION RECORD
// ============================================================

window.editCollectionRecord = function (recordId) {
  var historyModal = document.getElementById("collectionHistoryModal");
  if (historyModal) historyModal.remove();

  dbDexieManager.getAllRecords(dbnm, "mi").then(function (records) {
    var record = records.find(function (r) {
      return r.a == recordId;
    });
    if (!record) {
      showMessageModal("Error", "❌ Record not found!", true);
      return;
    }

    var pricingMap = {};
    dbDexieManager.getAllRecords(dbnm, "mb").then(function (pricingRecords) {
      pricingRecords.forEach(function (p) {
        pricingMap[p.a] = p;
      });
      var pricing = pricingMap[record.k] || {};

      var currentQty = parseFloat(record.i || 0);
      var currentSnf = parseFloat(pricing.h || 0);
      var currentFat = parseFloat(pricing.g || 0);
var currentAnimal = record.h || pricing.f || 1;

      var html = `
        <div id="editCollectionModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:99999; display:flex; align-items:center; justify-content:center; padding:20px;">
          <div style="background:var(--surface); border-radius:15px; max-width:650px; width:100%; max-height:90vh; overflow-y:auto;">
            <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:15px 20px; border-radius:15px 15px 0 0; display:flex; justify-content:space-between; align-items:center;">
              <h5 class="mb-0"><i class="fas fa-edit me-2"></i>Edit Milk Collection Entry</h5>
              <button onclick="window.closeModal('editCollectionModal')" style="background:transparent; border:none; color:white; font-size:24px; cursor:pointer;">&times;</button>
            </div>
            <div style="padding:20px;">
              <form id="editCollectionForm" onsubmit="window.updateCollectionRecord(event, ${record.a})">
                <div class="row g-2">
                  <div class="col-12 col-md-6">
                    <label style="font-weight:600; font-size:12px;">📅 Date *</label>
                    <input type="date" class="form-control form-control-sm" id="editCollectionDate" value="${record.f || ""}" required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label style="font-weight:600; font-size:12px;">🕐 Session *</label>
                    <select class="form-select form-select-sm" id="editCollectionSession" required>
                      <option value="1" ${record.g == 1 ? "selected" : ""}>🌅 Morning</option>
                      <option value="2" ${record.g == 2 ? "selected" : ""}>🌙 Evening</option>
                    </select>
                  </div>
                </div>
                <div class="row g-2 mt-1">
                  <div class="col-12 col-md-6">
                    <label style="font-weight:600; font-size:12px;">🐄 Animal *</label>
                    <select class="form-select form-select-sm" id="editCollectionAnimal" onchange="window.calcEditTotal()" required>
                      <option value="1" ${currentAnimal == 1 ? "selected" : ""}>🐃 Buffalo</option>
                      <option value="2" ${currentAnimal == 2 ? "selected" : ""}>🐄 Cow</option>
                    </select>
                  </div>
                  <div class="col-12 col-md-6">
                    <label style="font-weight:600; font-size:12px;">📦 Quantity (Ltr) *</label>
                    <input type="text" class="form-control form-control-sm" id="editCollectionQty" value="${window.fmtMilk(currentQty)}" step="0.01" oninput="window.keepMilk(this)" onkeyup="window.calcEditTotal()" onchange="window.calcEditTotal()" required>
                  </div>
                </div>
                <div class="row g-2 mt-1">
                  <div class="col-12 col-md-6">
                    <label style="font-weight:600; font-size:12px;">🧪 SNF *</label>
                    <input type="text" class="form-control form-control-sm" id="editCollectionSnf" value="${window.fmtSnf(currentSnf)}" step="0.001" oninput="window.keepSnf(this)" onkeyup="window.calcEditTotal()" onchange="window.calcEditTotal()" required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label style="font-weight:600; font-size:12px;">🧪 Fat % *</label>
                    <input type="text" class="form-control form-control-sm" id="editCollectionFat" value="${window.fmtFat(currentFat)}" step="0.001" oninput="window.keepFat(this)" onkeyup="window.calcEditTotal()" onchange="window.calcEditTotal()" required>
                  </div>
                </div>
                <div class="mt-2" style="background:#e8f5e9; padding:12px; border-radius:8px; border:2px solid #4caf50;">
                  <div style="text-align:center;">
                    <small style="color:#2e7d32; font-weight:600; font-size:12px;">💰 Total Amount</small>
                    <div style="font-size:24px; font-weight:700; color:#1b5e20;" id="editTotalAmount">₹0.00</div>
                  </div>
                </div>
                <div class="mt-2">
                  <label style="font-weight:600; font-size:12px;">📝 Remarks</label>
                  <textarea class="form-control form-control-sm" id="editCollectionRemarks" rows="2">${record.remarks || ""}</textarea>
                </div>
                <div class="row g-2 mt-3">
                  <div class="col-6">
                    <button type="button" class="btn btn-secondary w-100" onclick="window.closeModal('editCollectionModal')" style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f5f5f5; color:#333; cursor:pointer;">Cancel</button>
                  </div>
                  <div class="col-6">
                    <button type="submit" class="btn w-100" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border:none; padding:8px; border-radius:6px; font-weight:bold; cursor:pointer;">
                      <i class="fas fa-save"></i> Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;

      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div.firstElementChild);

      setTimeout(function () {
        window.calcEditTotal();
      }, 100);
    });
  });
};

// ============================================================
// CALCULATE EDIT TOTAL
// ============================================================

window.calcEditTotal = async function () {
  var animal =
    parseInt(document.getElementById("editCollectionAnimal").value) || 0;
  var qty = parseFloat(document.getElementById("editCollectionQty").value) || 0;
  var snf = parseFloat(document.getElementById("editCollectionSnf").value) || 0;
  var fat = parseFloat(document.getElementById("editCollectionFat").value) || 0;

  var totalEl = document.getElementById("editTotalAmount");
  if (!totalEl) return;

  if (animal === 0 || qty <= 0 || snf <= 0 || fat <= 0) {
    totalEl.textContent = "₹0.00";
    return;
  }

  var pricingRecord = await window.getMatchingPricingRecord(animal, fat, snf);
  var pricePerLiter = 0;

  if (pricingRecord && pricingRecord.a > 0) {
    pricePerLiter = parseFloat(pricingRecord.i) || 0;
  } else {
    var rate = getCurrentPriceForAnimal(animal);
    pricePerLiter = rate * (snf / 10) * (fat / 10);
  }

  var totalAmount = qty * pricePerLiter;
  totalEl.textContent = "₹" + totalAmount.toFixed(2);
};

// ============================================================
// GET CURRENT PRICE FOR ANIMAL (Helper for edit)
// ============================================================

function getCurrentPriceForAnimal(animalNumber) {
  var history = JSON.parse(localStorage.getItem("milk_price_history") || "[]");
  if (history.length === 0) return animalNumber == 1 ? 58.4 : 44.2;
  for (var i = history.length - 1; i >= 0; i--) {
    if (history[i].f == animalNumber) return parseFloat(history[i].g);
  }
  return animalNumber == 1 ? 58.4 : 44.2;
}

// ============================================================
// UPDATE COLLECTION RECORD
// ============================================================

window.updateCollectionRecord = async function (event, recordId) {
  event.preventDefault();

  var allRecords = await dbDexieManager.getAllRecords(dbnm, "mi");
  var originalRecord = allRecords.find(function (r) {
    return r.a == recordId;
  });
  if (!originalRecord) {
    showMessageModal("Error", "❌ Record not found!", true);
    return;
  }

  var newDate = document.getElementById("editCollectionDate").value;
  var newSession = parseInt(
    document.getElementById("editCollectionSession").value,
  );
  var newAnimal = parseInt(
    document.getElementById("editCollectionAnimal").value,
  );
  var newQty =
    parseFloat(document.getElementById("editCollectionQty").value) || 0;
  var newSnf =
    parseFloat(document.getElementById("editCollectionSnf").value) || 0;
  var newFat =
    parseFloat(document.getElementById("editCollectionFat").value) || 0;
  var newRemarks = document.getElementById("editCollectionRemarks").value || "";

  // Validation
  if (!newDate) {
    showMessageModal("Validation", "❌ Please select a date!", true);
    return;
  }
  if (!newAnimal) {
    showMessageModal("Validation", "❌ Please select an animal!", true);
    return;
  }
  if (!newSession) {
    showMessageModal("Validation", "❌ Please select a session!", true);
    return;
  }
  if (newQty <= 0) {
    showMessageModal("Validation", "❌ Please enter valid quantity!", true);
    return;
  }
  if (newSnf <= 0) {
    showMessageModal("Validation", "❌ Please enter valid SNF!", true);
    return;
  }
  if (newFat <= 0) {
    showMessageModal("Validation", "❌ Please enter valid Fat %!", true);
    return;
  }

  // Get pricing record
  var pricingRecord = await window.getMatchingPricingRecord(
    newAnimal,
    newFat,
    newSnf,
  );
  var pricingId = pricingRecord ? pricingRecord.a : 0;
  if (pricingId > 32000) pricingId = 0;

  var pricePerLiter = 0;
  if (pricingRecord && pricingRecord.a > 0) {
    pricePerLiter = parseFloat(pricingRecord.i) || 0;
  } else {
    var rate = getCurrentPriceForAnimal(newAnimal);
    pricePerLiter = rate * (newSnf / 10) * (newFat / 10);
  }

  var totalAmount = newQty * pricePerLiter;

  var endpointData = {
    a: recordId,
    e: parseInt(document.getElementById("supplierId").value) || 0,
    f: newDate,
    g: newSession,
    h: newAnimal,
    i: parseFloat(newQty.toFixed(2)),
    j: parseFloat(totalAmount.toFixed(2)),
    k: pricingId,
  };

  clearPayload0();

  payload0.p = endpointData;
  payload0.vw = 1;
  payload0.fn = 75;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "mi" }]);

  try {
    if (typeof fnj3 === "function") {
      var response = await fnj3(
        "https://my1.in/2/j.php",
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
        await handl_mi_rspons(response, 0);

        window.closeModal("editCollectionModal");

        window.showModal({
          title: "Success",
          message:
            "✅ " + (response.ms || "Collection record updated successfully!"),
          isError: false,
          onClose: function () {
            var oldHistoryModal = document.getElementById(
              "collectionHistoryModal",
            );
            if (oldHistoryModal) {
              oldHistoryModal.remove();
            }
            if (typeof window.showCollectionHistory === "function") {
              var currentSupplier =
                window[my1uzr.worknOnPg].currentAdminPerson || {};
              if (currentSupplier.e && currentSupplier.f) {
                window.showCollectionHistory(
                  currentSupplier.e,
                  currentSupplier.f,
                );
              } else {
                showMessageModal(
                  "Info",
                  "Please refresh the page to see updated history.",
                  false,
                );
              }
            }
          },
        });
      } else {
        var errMsg = response
          ? response.ms || "Server rejected the update."
          : "Unknown error";
        showMessageModal("Error", "❌ Update failed!\n\n" + errMsg, true);
        return;
      }
    } else {
      showMessageModal("Error", "❌ fnj3 function not available!", true);
      return;
    }
  } catch (err) {
    console.error("Error updating:", err);
    showMessageModal("Error", "❌ Server error: " + err.message, true);
    return;
  }
};

// ============================================================
// EDIT PAYMENT RECORD
// ============================================================

window.editPaymentRecord = function (recordId) {
  dbDexieManager.getAllRecords(dbnm, "r").then(function (records) {
    var record = records.find(function (r) {
      return r.a == recordId;
    });

    if (!record) {
      showMessageModal("Error", "❌ Record not found!", true);
      return;
    }

    var personId = record.h;
    if (!personId) {
      showMessageModal("Error", "❌ Supplier not found!", true);
      return;
    }

    var persons = window.milk_persons || [];
    var person = persons.find(function (p) {
      return String(p.a) == String(personId);
    });
    var supplierName = person ? person.h || person.i || "Unknown" : "Unknown";

    var modeLabels = {
      1: "Cash",
      2: "Cheque",
      3: "Card",
      4: "UPI",
      5: "Bank Transfer",
    };
    var transLabels = { 1: "Received", 2: "Payment" };

    var html = `
      <div id="editPaymentModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999999; display:flex; align-items:center; justify-content:center; padding:20px;">
        <div style="background:var(--surface); border-radius:15px; max-width:550px; width:100%; max-height:90vh; overflow-y:auto;">
          <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:15px 20px; border-radius:15px 15px 0 0; display:flex; justify-content:space-between; align-items:center;">
            <h5 class="mb-0"><i class="fas fa-edit me-2"></i>Edit Payment Entry</h5>
            <button onclick="window.closeModal('editPaymentModal')" style="background:transparent; border:none; color:white; font-size:24px; cursor:pointer;">&times;</button>
          </div>
          <div style="padding:20px;">
            <div style="margin-bottom:12px; padding:8px; background:#f8f7ff; border-radius:6px; border:1px solid #667eea; text-align:center;">
              <strong>Supplier:</strong> ${supplierName}
            </div>
            <form id="editPaymentForm" onsubmit="window.updatePaymentRecord(event, ${record.a})">
              <div class="row g-2">
                <div class="col-6">
                  <label style="font-weight:600; font-size:12px;">💰 Type</label>
                  <div style="display:flex; gap:15px; margin-top:4px; flex-wrap:wrap;">
                    <label><input type="radio" name="editTransType" value="2" ${record.f == 2 ? "checked" : ""}> 💰 Payment</label>
                    <label><input type="radio" name="editTransType" value="1" ${record.f == 1 ? "checked" : ""}> 📥 Received</label>
                  </div>
                </div>
                <div class="col-6">
                  <label style="font-weight:600; font-size:12px;">💳 Mode</label>
                  <select class="form-select form-select-sm" id="editPaymentMode" required style="font-size:13px; padding:4px 8px; border:1.5px solid #ddd; border-radius:6px;">
                    <option value="">Select</option>
                    <option value="1" ${record.i == 1 ? "selected" : ""}>💵 Cash</option>
                    <option value="2" ${record.i == 2 ? "selected" : ""}>📝 Cheque</option>
                    <option value="3" ${record.i == 3 ? "selected" : ""}>💳 Card</option>
                    <option value="4" ${record.i == 4 ? "selected" : ""}>📱 UPI</option>
                    <option value="5" ${record.i == 5 ? "selected" : ""}>🏦 Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div class="row g-2 mt-2">
                <div class="col-6">
                  <label style="font-weight:600; font-size:12px;">📅 Date *</label>
                  <input type="date" class="form-control form-control-sm" id="editPaymentDate" value="${record.k || ""}" required style="font-size:13px; padding:4px 8px; border:1.5px solid #ddd; border-radius:6px;">
                </div>
                <div class="col-6">
                  <label style="font-weight:600; font-size:12px;">💰 Amount *</label>
                  <input type="text" class="form-control form-control-sm" id="editPaymentAmount" value="${parseFloat(record.j || 0).toFixed(2)}" step="0.01" required style="font-size:14px; font-weight:bold; padding:4px 8px; border:1.5px solid #ddd; border-radius:6px; text-align:center;">
                </div>
              </div>
              <div class="row g-2 mt-2">
                <div class="col-6">
                  <label style="font-weight:600; font-size:12px;">💰 Round-UP ₹</label>
                  <input type="text" class="form-control form-control-sm" id="editPaymentDiscount" value="${parseFloat(record.td || 0).toFixed(2)}" step="0.01" style="font-size:13px; padding:4px 8px; border:1.5px solid #ddd; border-radius:6px;">
                </div>
                <div class="col-6">
                  <label style="font-weight:600; font-size:12px;">📝 Note</label>
                  <input type="text" class="form-control form-control-sm" id="editPaymentNote" value="${record.note || ""}" style="font-size:13px; padding:4px 8px; border:1.5px solid #ddd; border-radius:6px;">
                </div>
              </div>
              <div class="row g-2 mt-3">
                <div class="col-6">
                  <button type="button" class="btn btn-secondary w-100" onclick="window.closeModal('editPaymentModal')" style="padding:8px; border-radius:6px; border:1px solid var(--border); background:var(--surface-2); color:#333; cursor:pointer;">Cancel</button>
                </div>
                <div class="col-6">
                  <button type="submit" class="btn w-100" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border:none; padding:8px; border-radius:6px; font-weight:bold; cursor:pointer;">
                    <i class="fas fa-save"></i> Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    var div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div.firstElementChild);
  });
};

// ============================================================
// UPDATE PAYMENT RECORD
// ============================================================

window.updatePaymentRecord = async function (event, recordId) {
  event.preventDefault();

  var allRecords = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
  var originalRecord = allRecords.find(function (r) {
    return r.a == recordId;
  });

  if (!originalRecord) {
    showMessageModal("Error", "❌ Record not found in IndexedDB!", true);
    return;
  }

  var personId = originalRecord.h;
  if (!personId) {
    showMessageModal("Error", "❌ Supplier not found!", true);
    return;
  }

  var newDate = document.getElementById("editPaymentDate").value;
  var newAmount =
    parseFloat(document.getElementById("editPaymentAmount").value) || 0;
  var newMode = parseInt(document.getElementById("editPaymentMode").value);
  var newType =
    parseInt(
      document.querySelector('input[name="editTransType"]:checked')?.value,
    ) || 0;
  var newDiscount =
    parseFloat(document.getElementById("editPaymentDiscount").value) || 0;
  var newNote = document.getElementById("editPaymentNote").value || "";

  if (!newDate) {
    showMessageModal("Validation", "❌ Please select a date!", true);
    return;
  }
  if (newAmount <= 0) {
    showMessageModal("Validation", "❌ Please enter valid amount!", true);
    return;
  }
  if (!newMode) {
    showMessageModal("Validation", "❌ Please select payment mode!", true);
    return;
  }
  if (!newType) {
    showMessageModal("Validation", "❌ Please select transaction type!", true);
    return;
  }

  var endpointData = {
    a: recordId,
    f: newType,
    h: parseInt(String(personId).replace(/^P/, "")),
    i: newMode,
    j: newAmount.toString(),
    k: newDate,
    td: newDiscount,
    su: 1,
    n: 0,
    note: newNote,
  };

  clearPayload0();

  payload0.p = null;
  payload0.r = endpointData;
  payload0.vw = 1;
  payload0.fn = 87;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "r" }]);

  try {
    if (typeof fnj3 === "function") {
      var response = await fnj3(
        "https://my1.in/2/l.php",
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
        await handl_mi_rspons(response, 0);

        var updatedRecord = {
          a: recordId,
          f: newType,
          h: parseInt(String(personId).replace(/^P/, "")),
          i: newMode,
          j: newAmount.toString(),
          k: newDate,
          td: newDiscount,
          tb: 31,
          su: 1,
          n: 0,
          note: newNote,
        };
        console.log("✅ Updated payment in IndexedDB with ID:", recordId);

        window.closeModal("editPaymentModal");

        window.showModal({
          title: "Success",
          message: "✅ Payment record updated successfully!",
          isError: false,
          onClose: function () {
            var oldHistoryModal = document.getElementById(
              "collectionHistoryModal",
            );
            if (oldHistoryModal) {
              oldHistoryModal.remove();
            }
            if (typeof window.showCollectionHistory === "function") {
              var currentSupplier =
                window[my1uzr.worknOnPg].currentAdminPerson || {};
              if (currentSupplier.e && currentSupplier.f) {
                window.showCollectionHistory(
                  currentSupplier.e,
                  currentSupplier.f,
                );
              }
            }
          },
        });
      } else {
        var errMsg = response
          ? response.ms || "Server rejected the update."
          : "Unknown error";
        showMessageModal("Error", "❌ Update failed!\n\n" + errMsg, true);
        return;
      }
    } else {
      showMessageModal("Error", "❌ fnj3 function not available!", true);
      return;
    }
  } catch (err) {
    console.error("Error updating:", err);
    showMessageModal("Error", "❌ Server error: " + err.message, true);
    return;
  }
};

// ============================================================
console.log("📜 History module loaded successfully!");
