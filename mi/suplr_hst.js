// ============================================================
// Helper Functions
// ============================================================

function formatDateDisplay(dateStr) {
  if (!dateStr) return "-";
  var d = new Date(dateStr);
  return (
    String(d.getDate()).padStart(2, "0") +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getFullYear())
  );
}

function formatDateYYYYMMDD(date) {
  var d = new Date(date);
  var year = d.getFullYear();
  var month = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function normalizePhone(phone) {
  if (!phone) return "";
  return String(phone)
    .replace(/^91\.?/, "")
    .replace(/^\+91/, "")
    .replace(/^0+/, "")
    .replace(/\./g, "")
    .replace(/\s/g, "")
    .replace(/-/g, "")
    .trim();
}

// ============================================================
// TOGGLE SECTION
// ============================================================

window.toggleSection = function (contentId, headerEl) {
  var content = document.getElementById(contentId);
  var arrow = headerEl.querySelector('.collapsible-arrow');
  if (!content || !arrow) return;
  if (content.style.display === 'none') {
    content.style.display = '';
    arrow.classList.remove('collapsed');
  } else {
    content.style.display = 'none';
    arrow.classList.add('collapsed');
  }
};

// ============================================================
// SHOW SUPPLIER COLLECTION HISTORY - e = mobile, f = relation
// ============================================================

window.showSupplierCollectionHistory = async function (e, f) {
  var supplierId = null;
  var clientName = "All Suppliers";
  var clientPhone = "";
  var uniqueId = "";
  var isAdminView = false;

  // Load local data first so the logged-in supplier can be resolved the same
  // way reports do: prefer the cached workspace currentSupplier, else resolve
  // via getCurrentSupplier(allRecords) so the fallback id matches mi.e.
  var allRecords = await dbDexieManager.getAllRecords(dbnm, "mi");
  var allPricingRecords = await dbDexieManager.getAllRecords(dbnm, "mb");
  var allPaymentRecords = await dbDexieManager.getAllRecords(dbnm, "r");

  if (!e || !f) {
    isAdminView = true;
    clientName = "All Suppliers";
    supplierId = null;
  } else {
    var mobile = normalizePhone(e);

    var supplier =
      (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].currentSupplier) ||
      null;
    if (supplier && normalizePhone(supplier.e || "") !== mobile) {
      supplier = null;
    }

    if (!supplier && typeof window.getCurrentSupplier === "function") {
      supplier = (await window.getCurrentSupplier(allRecords)) || null;
    }

    if (!supplier) {
      showMessageModal(
        "Info",
        "⚠️ No supplier account found. Please click Refresh to sync data.",
        false,
      );
      return;
    }

    supplierId = supplier.a;
    clientName = supplier.h || supplier.i || my1uzr.mn || "Unknown";
    clientPhone = supplier.e || "";
    uniqueId = supplier.k || "";
  }

  var pricingMap = {};
  allPricingRecords.forEach(function (p) {
    pricingMap[p.a] = p;
  });

  var personRecords = [];
  var personPayments = [];

  if (isAdminView) {
    personRecords = allRecords;
    personPayments = allPaymentRecords;
  } else {
    personRecords = allRecords.filter(function (record) {
      return parseInt(record.e) === parseInt(supplierId);
    });
    personPayments = allPaymentRecords.filter(function (record) {
      return parseInt(record.h) === parseInt(supplierId);
    });
  }

  personRecords.sort(function (a, b) {
    var dateDiff = new Date(b.f) - new Date(a.f);
    if (dateDiff !== 0) return dateDiff;
    return (parseInt(b.g) || 0) - (parseInt(a.g) || 0);
  });

  personPayments.sort(function (a, b) {
    return new Date(b.k) - new Date(a.k);
  });

  var currentYear = new Date().getFullYear();
  var currentMonth = new Date().getMonth() + 1;
  var firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  var lastDayOfMonth = new Date(currentYear, currentMonth, 0);

  var supplierDisplayName = isAdminView ? "📊 All Suppliers" : clientName;
  if (!isAdminView && uniqueId) {
    supplierDisplayName = "🆔 " + uniqueId + " | " + clientName;
  }

  var monthMilkCount = personRecords.filter(function (record) {
    var d = new Date(record.f);
    return (
      d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth
    );
  }).length;

  var monthPaymentCount = personPayments.filter(function (record) {
    var d = new Date(record.k);
    return (
      d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth
    );
  }).length;

  var html = `
    <div id="collectionHistoryModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,15,35,0.6); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:20px; animation:cmFadeIn 0.25s ease;" onclick="if(event.target===this)window.closeModal('collectionHistoryModal')">
      <style>
        #collectionHistoryModal, #collectionHistoryModal * { box-sizing: border-box; }
        @keyframes cmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cmZoomIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        #collectionHistoryModal .cm-modal { background: #fff; border-radius: 18px; max-width: 1100px; width: 100%; max-height: 95vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 70px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.15); animation: cmZoomIn 0.3s ease; }
        #collectionHistoryModal .cm-head { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        #collectionHistoryModal .cm-title { display: flex; align-items: center; gap: 10px; min-width: 0; }
        #collectionHistoryModal .cm-title-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        #collectionHistoryModal .cm-title-main { font-size: 15px; font-weight: 700; line-height: 1.2; }
        #collectionHistoryModal .cm-title-sub { font-size: 11px; font-weight: 600; opacity: 0.95; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
        #collectionHistoryModal .cm-count-badge { font-size: 10px; font-weight: 700; background: rgba(255,255,255,0.22); padding: 2px 8px; border-radius: 10px; margin-left: 6px; white-space: nowrap; }
        #collectionHistoryModal .cm-close { width: 38px; height: 38px; border: none; border-radius: 50%; background: rgba(255,255,255,0.15); color: #fff; font-size: 22px; line-height: 1; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        #collectionHistoryModal .cm-close:hover { background: rgba(255,255,255,0.3); transform: rotate(90deg); }
        #collectionHistoryModal .cm-body { padding: 16px 18px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 10px; }
        #collectionHistoryModal .cm-sec-header { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 10px; cursor: pointer; user-select: none; background: #f4f5fb; border: 1.2px solid #444; transition: background 0.2s; }
        #collectionHistoryModal .cm-sec-header:hover { background: #eceef9; }
        #collectionHistoryModal .cm-sec-left { display: flex; align-items: center; gap: 9px; min-width: 0; }
        #collectionHistoryModal .cm-sec-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #fff; flex-shrink: 0; }
        #collectionHistoryModal .cm-sec-title { font-size: 13px; font-weight: 700; color: #2c3154; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        #collectionHistoryModal .cm-sec-count { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; background: #e3e6f5; color: #4a4f7a; white-space: nowrap; }
        #collectionHistoryModal .collapsible-arrow { font-size: 12px; color: #8a8fb8; transition: transform 0.3s; font-weight: 700; flex-shrink: 0; }
        #collectionHistoryModal .collapsible-arrow.collapsed { transform: rotate(-90deg); }
        #collectionHistoryModal .cm-filter-box { background: #f8f7ff; padding: 10px; border-radius: 10px; border: 1.5px solid #667eea; }
        #collectionHistoryModal .cm-filter-row { display: flex; gap: 8px; margin-bottom: 8px; }
        #collectionHistoryModal .cm-filter-row-end { align-items: flex-end; }
        #collectionHistoryModal .cm-field { flex: 1; min-width: 0; }
        #collectionHistoryModal .cm-label { display: block; font-size: 11px; font-weight: 700; color: #5c6bc0; margin-bottom: 3px; }
        #collectionHistoryModal .cm-input { width: 100%; font-size: 12px; padding: 6px 8px; border: 1.5px solid #c3c8ea; border-radius: 8px; background: #fff; color: #333; min-width: 0; }
        #collectionHistoryModal .cm-input:focus { border-color: #667eea; outline: none; box-shadow: 0 0 0 3px rgba(102,126,234,0.15); }
        #collectionHistoryModal .cm-btn { border: none; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 5px; }
        #collectionHistoryModal .cm-btn-apply { background: #667eea; color: #fff; }
        #collectionHistoryModal .cm-btn-reset { background: #6c757d; color: #fff; }
        #collectionHistoryModal .cm-btn:hover { filter: brightness(0.95); }
        #collectionHistoryModal .cm-range-chip { text-align: center; font-size: 11px; color: #555; margin-top: 2px; padding: 5px 8px; background: #e8eaf6; border-radius: 8px; }
        #collectionHistoryModal .cm-summary-box { background: linear-gradient(135deg, #f8f7ff 0%, #e8eaf6 100%); padding: 12px; border-radius: 12px; border: 2px solid #667eea; }
        #collectionHistoryModal .cm-summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; text-align: center; }
        #collectionHistoryModal .cm-stat { background: #fff; border-radius: 10px; padding: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); transition: transform 0.2s; }
        #collectionHistoryModal .cm-stat:hover { transform: translateY(-2px); }
        #collectionHistoryModal .cm-stat-icon { width: 34px; height: 34px; border-radius: 50%; color: #fff; font-size: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; }
        #collectionHistoryModal .cm-stat-label { font-size: 10px; font-weight: 700; margin-bottom: 3px; }
        #collectionHistoryModal .cm-stat-value { font-size: 18px; font-weight: 700; }
        #collectionHistoryModal .cm-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid #e3e6f2; border-radius: 10px; }
        #collectionHistoryModal .cm-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 650px; }
        #collectionHistoryModal .cm-table thead th { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; padding: 8px 6px; text-align: center; font-weight: 600; white-space: nowrap; border-bottom: 2px solid #5a6fd6; }
        #collectionHistoryModal .cm-table-purple thead th { background: linear-gradient(135deg, #6a1b9a, #764ba2); border-bottom-color: #8a5fc7; }
        #collectionHistoryModal .cm-table tbody td { padding: 7px 6px; text-align: center; border-bottom: 1px solid #eee; }
        #collectionHistoryModal .cm-table tbody tr:nth-child(even) { background: #f8f9fd; }
        #collectionHistoryModal .cm-table tbody tr:hover { background: #eef0fa; }
        #collectionHistoryModal .cm-total-strip { text-align: center; font-size: 12px; font-weight: 700; color: #1a237e; background: #e8eaf6; border: 1.5px solid #667eea; border-radius: 8px; padding: 6px 8px; margin-bottom: 8px; }
        #collectionHistoryModal .cm-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
        #collectionHistoryModal .history-card { transition: transform 0.2s, box-shadow 0.2s; }
        #collectionHistoryModal .history-card:hover { transform: translateY(-3px); box-shadow: 0 8px 18px rgba(0,0,0,0.12) !important; }
        #collectionHistoryModal .cm-summary-bar { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; padding: 10px 8px; background: linear-gradient(135deg, #e8eaf6, #f3e5f5); border-radius: 10px; border: 1.5px solid #667eea; margin-top: 2px; }
        #collectionHistoryModal .cm-summary-pill { font-size: 12px; font-weight: 700; }
        #collectionHistoryModal .cm-pill-received { color: #1b5e20; }
        #collectionHistoryModal .cm-pill-payment { color: #d32f2f; }
        #collectionHistoryModal .cm-pill-balance { color: #1a237e; }
        #collectionHistoryModal .cm-pay-summary { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; padding: 8px; background: #f3e5f5; border-radius: 8px; margin-top: 8px; }
        #collectionHistoryModal .cm-pay-pill { font-size: 12px; }
        #collectionHistoryModal .cm-foot { padding: 12px 20px; border-top: 1px solid #eee; text-align: center; flex-shrink: 0; background: #fafbfe; }
        #collectionHistoryModal .cm-btn-close { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; padding: 8px 28px; font-size: 13px; border-radius: 8px; display: inline-flex; }
      </style>
      <div class="cm-modal">
        <div class="cm-head">
          <div class="cm-title">
            <div class="cm-title-icon"><i class="fas fa-history"></i></div>
            <div style="min-width:0;">
              <div class="cm-title-main">Milk Collection History</div>
              <div class="cm-title-sub">${supplierDisplayName}<span class="cm-count-badge">${monthMilkCount + monthPaymentCount} This Month</span></div>
            </div>
          </div>
          <button class="cm-close" onclick="window.closeModal('collectionHistoryModal')" title="Close">&times;</button>
        </div>
        <div class="cm-body">

          <!-- ========== FILTERS ========== -->
          <div class="collapsible-content" id="filterContent">
            <div class="cm-filter-box">
              <div class="cm-filter-row">
                <div class="cm-field">
                  <label class="cm-label">📅 From</label>
                  <input type="date" id="historyFromDate" class="cm-input" value="${formatDateYYYYMMDD(firstDayOfMonth)}">
                </div>
                <div class="cm-field">
                  <label class="cm-label">📅 To</label>
                  <input type="date" id="historyToDate" class="cm-input" value="${formatDateYYYYMMDD(lastDayOfMonth)}">
                </div>
              </div>
              <div class="cm-filter-row cm-filter-row-end">
                <div class="cm-field">
                  <label class="cm-label">🏷️ Type</label>
                  <select id="historyPaymentFilterType" class="cm-input">
                    <option value="all">All</option>
                    <option value="1">💰 Payment</option>
                    <option value="2">📥 Received</option>
                  </select>
                </div>
                <button class="cm-btn cm-btn-apply" onclick="window.suplrApplyHistoryFilter()"><i class="fas fa-filter"></i> Apply</button>
                <button class="cm-btn cm-btn-reset" onclick="window.suplrResetHistoryFilter()"><i class="fas fa-undo"></i> Reset</button>
              </div>
              <div class="cm-filter-row">
                <div class="cm-field">
                  <label class="cm-label">🐄 Animal</label>
                  <div style="display:flex; gap:12px; padding:6px 0;">
                    <label style="display:flex; align-items:center; gap:4px; font-size:12px; cursor:pointer;">
                      <input type="radio" name="historyAnimalFilter" value="all" checked> All
                    </label>
                    <label style="display:flex; align-items:center; gap:4px; font-size:12px; cursor:pointer;">
                      <input type="radio" name="historyAnimalFilter" value="1"> 🐃 Buffalo
                    </label>
                    <label style="display:flex; align-items:center; gap:4px; font-size:12px; cursor:pointer;">
                      <input type="radio" name="historyAnimalFilter" value="2"> 🐄 Cow
                    </label>
                  </div>
                </div>
              </div>
              <div id="dateRangeDisplay" class="cm-range-chip">📌 <span id="displayFromDate">${formatDateDisplay(firstDayOfMonth)}</span> → <span id="displayToDate">${formatDateDisplay(lastDayOfMonth)}</span></div>
            </div>
          </div>

          <!-- ========== SUPPLIER SUMMARY ========== -->
          <div class="cm-sec-header" onclick="window.toggleSection('summaryContent', this)">
            <div class="cm-sec-left">
              <div class="cm-sec-icon" style="background:linear-gradient(135deg, #5c6bc0, #764ba2);"><i class="fas fa-chart-pie"></i></div>
              <span class="cm-sec-title">Supplier Summary</span>
            </div>
            <span class="collapsible-arrow collapsed">&#9660;</span>
          </div>
          <div class="collapsible-content" id="summaryContent" style="display:none;">
            <div class="cm-summary-box">
              <div class="cm-summary-grid">
                <div class="cm-stat" style="border-top:3px solid #4caf50;">
                  <div class="cm-stat-icon" style="background:linear-gradient(135deg, #43a047, #66bb6a);">🥛</div>
                  <div class="cm-stat-label" style="color:#2e7d32;">Milk Total</div>
                  <div class="cm-stat-value" style="color:#1b5e20;" id="summaryMilkTotal">₹0.00</div>
                </div>
                <div class="cm-stat" style="border-top:3px solid #e65100;">
                  <div class="cm-stat-icon" style="background:linear-gradient(135deg, #ef6c00, #ff9800);">📥</div>
                  <div class="cm-stat-label" style="color:#e65100;">Received</div>
                  <div class="cm-stat-value" style="color:#e65100;" id="summaryReceived">₹0.00</div>
                </div>
                <div class="cm-stat" style="border-top:3px solid #667eea;">
                  <div class="cm-stat-icon" style="background:linear-gradient(135deg, #5c6bc0, #7986cb);">💰</div>
                  <div class="cm-stat-label" style="color:#5c6bc0;">Payment</div>
                  <div class="cm-stat-value" style="color:#1a237e;" id="summaryPayments">₹0.00</div>
                </div>
                <div class="cm-stat" style="border-top:3px solid #9c27b0;">
                  <div class="cm-stat-icon" style="background:linear-gradient(135deg, #8e24aa, #ab47bc);">⚖️</div>
                  <div class="cm-stat-label" style="color:#6a1b9a;">Outstanding</div>
                  <div class="cm-stat-value" style="color:#6a1b9a;" id="summaryOutstanding">₹0.00</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========== MILK COLLECTION TABLE / CARDS ========== -->
          <div class="cm-sec-header" onclick="window.toggleSection('milkCollectionContent', this)">
            <div class="cm-sec-left">
              <div class="cm-sec-icon" style="background:linear-gradient(135deg, #2e7d32, #4caf50);"><i class="fas fa-tint"></i></div>
              <span class="cm-sec-title">Milk Collection History</span>
              <span class="cm-sec-count">${monthMilkCount} Entries</span>
            </div>
            <span class="collapsible-arrow">&#9660;</span>
          </div>
          <div class="collapsible-content" id="milkCollectionContent">
            <div id="milkTableView">
              <div class="cm-table-wrap">
                <table class="cm-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Session</th>
                      <th>Animal</th>
                      <th>Qty</th>
                      <th>SNF</th>
                      <th>Fat</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody id="historyTableBody">
                  </tbody>
                </table>
              </div>
            </div>

            <div id="milkCardsView" style="display:none;">
              <div id="milkCardsTotal" class="cm-total-strip">TOTAL: ₹0.00</div>
              <div id="milkCardsGrid" class="cm-cards-grid">
              </div>
            </div>

            <div id="milkSummaryBar" class="cm-summary-bar">
              <span class="cm-summary-pill cm-pill-received">📥 Received: <span id="msReceived">₹0.00</span></span>
              <span class="cm-summary-pill cm-pill-payment">💰 Payment: <span id="msPayment">₹0.00</span></span>
              <span class="cm-summary-pill cm-pill-balance">⚖️ Balance: <span id="msBalance">₹0.00</span></span>
            </div>
          </div>

          <!-- ========== PAYMENT & RECEIVED HISTORY ========== -->
          <div class="cm-sec-header" onclick="window.toggleSection('paymentContent', this)">
            <div class="cm-sec-left">
              <div class="cm-sec-icon" style="background:linear-gradient(135deg, #6a1b9a, #764ba2);"><i class="fas fa-money-bill-wave"></i></div>
              <span class="cm-sec-title">Payment & Received History</span>
              <span class="cm-sec-count">${monthPaymentCount} Entries</span>
            </div>
            <span class="collapsible-arrow collapsed">&#9660;</span>
          </div>
          <div class="collapsible-content" id="paymentContent" style="display:none;">
            <div class="cm-table-wrap">
              <table class="cm-table cm-table-purple">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Mode</th>
                    <th>Amount</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody id="paymentHistoryBody">
                </tbody>
              </table>
            </div>
            <div id="paymentSummary" class="cm-pay-summary">
              <span class="cm-pay-pill">💰 <strong>Payment:</strong> <span id="paymentTotalPayments">₹0.00</span></span>
              <span class="cm-pay-pill">📥 <strong>Received:</strong> <span id="paymentTotalReceived">₹0.00</span></span>
              <span class="cm-pay-pill">⚖️ <strong>Net:</strong> <span id="paymentNetBalance">₹0.00</span></span>
            </div>
          </div>

        </div>
        <div class="cm-foot">
          <button class="cm-btn cm-btn-close" onclick="window.closeModal('collectionHistoryModal')"><i class="fas fa-times"></i> Close</button>
        </div>
      </div>
    </div>
  `;

  var div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div.firstElementChild);

  var modalRoot = document.getElementById("collectionHistoryModal");
  if (modalRoot) {
    modalRoot._escHandler = function (ev) {
      if (
        ev.key === "Escape" &&
        document.getElementById("collectionHistoryModal")
      ) {
        window.closeModal("collectionHistoryModal");
      }
    };
    document.addEventListener("keydown", modalRoot._escHandler);
  }

  var initialView =
    window[my1uzr.worknOnPg] &&
    window[my1uzr.worknOnPg].clientConfig?.colsToHideSupplierDetails === "1"
      ? "cards"
      : "table";

  populateMilkTable(personRecords, pricingMap, personPayments);
  populateMilkCards(personRecords, pricingMap);
  populatePaymentTable(personPayments);

  setTimeout(function () {
    window.suplrApplyHistoryFilter();
    window.setCollectionView(initialView);
  }, 100);
};

// ============================================================
// POPULATE MILK TABLE
// ============================================================

function populateMilkTable(personRecords, pricingMap, personPayments) {
  var tableBody = document.getElementById("historyTableBody");
  if (!tableBody) return;

  if (personRecords.length === 0 && (!personPayments || personPayments.length === 0)) {
    tableBody.innerHTML =
      '<tr><td colspan="7" style="text-align:center;padding:20px;color:#999;">No records found</td></tr>';
    return;
  }

  var html = "";
  personRecords.forEach(function (record) {
    var pricing = pricingMap[record.k || record.h] || {};
    var animalType = record.k
      ? parseInt(record.h) || 0
      : parseInt(pricing.f) || 0;
    var animalName =
      animalType == 1 ? "🐃 Buffalo" : animalType == 2 ? "🐄 Cow" : "-";
    var sessionName =
      record.g == 1 ? "🌅 Morning" : record.g == 2 ? "🌙 Evening" : "-";
    var qty = parseFloat(record.i) || 0;
    var rate = parseFloat(pricing.i) || 0;
    var amount = parseFloat(record.j) || qty * rate;

    html += `
      <tr data-date="${record.f}" data-animal="${animalType}">
        <td>${formatDateDisplay(record.f)}</td>
        <td>${sessionName}</td>
        <td>${animalName}</td>
        <td>${window.fmtMilk(qty)}</td>
        <td>${window.fmtSnf(parseFloat(pricing.h || 0))}</td>
        <td>${window.fmtFat(parseFloat(pricing.g || 0))}</td>
        <td style="font-weight:700; color:#1a237e;">₹${amount.toFixed(2)}</td>
      </tr>
    `;
  });

  if (personPayments && personPayments.length > 0) {
    html += '<tr style="background:#e8eaf6; font-weight:700;"><td id="milkTotalSeparator" colspan="7" style="padding:6px; text-align:center; font-size:12px; color:#1a237e; border-top:2px solid #667eea;">TOTAL</td></tr>';
    personPayments.forEach(function (record) {
      var amount = parseFloat(record.j) || 0;
      var isReceived = record.f == 2;
      var amountText = isReceived ? "+₹" + amount.toFixed(2) : "-₹" + amount.toFixed(2);
      var amountColor = isReceived ? "#1b5e20" : "#d32f2f";
      var rowBg = isReceived ? "rgba(76,175,80,0.08)" : "rgba(244,67,54,0.08)";

      html += `
        <tr data-date="${record.k}" data-row-type="payment" style="background:${rowBg};">
          <td>${formatDateDisplay(record.k)}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style="font-weight:700; color:${amountColor};">${amountText}</td>
        </tr>
      `;
    });
  }
  tableBody.innerHTML = html;
}

// ============================================================
// POPULATE MILK CARDS
// ============================================================

function populateMilkCards(personRecords, pricingMap) {
  var grid = document.getElementById("milkCardsGrid");
  if (!grid) return;

  if (personRecords.length === 0) {
    grid.innerHTML =
      '<div style="grid-column:1/-1; text-align:center; padding:20px; color:#999; font-size:12px;">No records found</div>';
    return;
  }

  var html = "";
  personRecords.forEach(function (record) {
    var pricing = pricingMap[record.k || record.h] || {};
    var animalType = record.k
      ? parseInt(record.h) || 0
      : parseInt(pricing.f) || 0;
    var animalName =
      animalType == 1 ? "🐃 Buffalo" : animalType == 2 ? "🐄 Cow" : "🐄 -";
    var sessionName =
      record.g == 1 ? "🌅 Morning" : record.g == 2 ? "🌙 Evening" : "-";
    var sessionBadgeColor = record.g == 1 ? "#f9a825" : "#5c6bc0";
    var qty = parseFloat(record.i) || 0;
    var snf = parseFloat(pricing.h) || 0;
    var fat = parseFloat(pricing.g) || 0;
    var rate = parseFloat(pricing.i) || 0;
    var amount = parseFloat(record.j) || qty * rate;

    html += `
      <div class="history-card" data-date="${record.f}" data-animal="${animalType}" style="background:white; border-radius:12px; overflow:hidden; border:1.2px solid #444; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <div style="padding:8px 10px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; border-bottom:1px solid #f0f0f0;">
          <span style="font-size:10px; font-weight:700; color:#1a237e; background:#e8eaf6; border:1px solid #c5cae9; padding:3px 8px; border-radius:12px; white-space:nowrap;">${formatDateDisplay(record.f)}</span>
          <span style="font-size:10px; font-weight:700; color:white; background:${animalType == 1 ? '#e65100' : '#1565c0'}; padding:3px 8px; border-radius:12px; white-space:nowrap;">${animalName}</span>
          <span style="font-size:9px; font-weight:700; color:white; background:${sessionBadgeColor}; padding:3px 8px; border-radius:12px; white-space:nowrap;">${sessionName}</span>
        </div>
        <div style="padding:8px 10px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px 8px; background:#f8f9fa; border-radius:8px; padding:6px 8px; font-size:10px; color:#666;">
            <span>Liter <strong style="color:#1b5e20;">${window.fmtMilk(qty)}</strong></span>
            <span>Rate <strong style="color:#5c6bc0;">₹${rate.toFixed(2)}</strong></span>
            <span>Fat <strong style="color:#1565c0;">${window.fmtFat(fat)}</strong></span>
            <span>SNF <strong style="color:#e65100;">${window.fmtSnf(snf)}</strong></span>
          </div>
        </div>
        <div style="background:linear-gradient(135deg, #2e7d32, #4caf50); color:white; text-align:center; padding:8px; font-size:14px; font-weight:700;">Total - ₹${amount.toFixed(2)}</div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// ============================================================
// SET COLLECTION VIEW (TABLE / CARDS)
// ============================================================

window.setCollectionView = function (view) {
  var tableView = document.getElementById("milkTableView");
  var cardsView = document.getElementById("milkCardsView");
  var modal = document.getElementById("collectionHistoryModal");
  if (!tableView || !cardsView) return;

  if (view === "cards") {
    tableView.style.display = "none";
    cardsView.style.display = "";

    if (modal) {
      var summaryContent = document.getElementById("summaryContent");
      if (summaryContent && summaryContent.previousElementSibling) {
        summaryContent.previousElementSibling.style.display = "none";
      }
    }
  } else {
    tableView.style.display = "";
    cardsView.style.display = "none";

    if (modal) {
      var summaryContent = document.getElementById("summaryContent");
      if (summaryContent && summaryContent.previousElementSibling) {
        summaryContent.previousElementSibling.style.display = "";
      }
    }
  }
};

// ============================================================
// POPULATE PAYMENT TABLE
// ============================================================

function populatePaymentTable(personPayments) {
  var tableBody = document.getElementById("paymentHistoryBody");
  if (!tableBody) return;

  if (personPayments.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;padding:20px;color:#999;">No payment records found</td></tr>';
    return;
  }

  var modeLabels = {
    1: "Cash",
    2: "Cheque",
    3: "Card",
    4: "UPI",
    5: "Bank Transfer",
  };
  var transLabels = { 1: "💰 Payment", 2: "📥 Received" };

  var html = "";
  personPayments.forEach(function (record) {
    var typeLabel = transLabels[record.f] || "?";
    var modeLabel = modeLabels[record.i] || "-";
    var amount = parseFloat(record.j) || 0;

    html += `
      <tr data-date="${record.k}" data-type="${record.f}">
        <td>${formatDateDisplay(record.k)}</td>
        <td>${typeLabel}</td>
        <td>${modeLabel}</td>
        <td style="font-weight:700; color:#1a237e;">₹${amount.toFixed(2)}</td>
        <td>${record.note || "-"}</td>
      </tr>
    `;
  });
  tableBody.innerHTML = html;
}

// ============================================================
// APPLY HISTORY FILTER - Including Date Range
// ============================================================

window.suplrApplyHistoryFilter = function () {
  var fromDate = document.getElementById("historyFromDate")?.value;
  var toDate = document.getElementById("historyToDate")?.value;
  var paymentType = document.getElementById("historyPaymentFilterType")?.value;
  var animalFilterEl = document.querySelector('input[name="historyAnimalFilter"]:checked');
  var animalFilter = animalFilterEl ? animalFilterEl.value : "all";

  var tableBody = document.getElementById("historyTableBody");
  var paymentBody = document.getElementById("paymentHistoryBody");
  var displayFrom = document.getElementById("displayFromDate");
  var displayTo = document.getElementById("displayToDate");

  if (fromDate && displayFrom) {
    displayFrom.textContent = formatDateDisplay(fromDate);
  }
  if (toDate && displayTo) {
    displayTo.textContent = formatDateDisplay(toDate);
  }

  var totalMilkQty = 0;
  var totalMilkAmt = 0;
  var totalPayments = 0;
  var totalReceived = 0;
  var inlinePayments = 0;
  var inlineReceived = 0;

  var fromDateObj = fromDate ? new Date(fromDate) : null;
  var toDateObj = toDate ? new Date(toDate) : null;
  if (toDateObj) toDateObj.setHours(23, 59, 59, 999);

  if (tableBody) {
    var allRows = tableBody.querySelectorAll("tr");
    allRows.forEach(function (row) {
      var dateCell = row.querySelector("td:first-child");
      if (!dateCell) return;

      var dateText = dateCell.textContent.trim();
      var parts = dateText.split("-");
      if (parts.length !== 3) return;

      var rowDate = row.getAttribute("data-date") || "";
      var isPaymentRow = row.hasAttribute("data-row-type");

      var show = true;

      if (show && fromDateObj && toDateObj && rowDate) {
        var recordDate = new Date(rowDate);
        if (recordDate < fromDateObj || recordDate > toDateObj) {
          show = false;
        }
      }

      if (show && !isPaymentRow && animalFilter !== "all") {
        var rowAnimal = row.getAttribute("data-animal") || "";
        if (rowAnimal !== animalFilter) {
          show = false;
        }
      }

      if (show && !isPaymentRow) {
        var qtyCell = row.querySelector("td:nth-child(4)");
        var amtCell = row.querySelector("td:nth-child(7)");
        if (qtyCell) totalMilkQty += parseFloat(qtyCell.textContent) || 0;
        if (amtCell)
          totalMilkAmt += parseFloat(amtCell.textContent.replace("₹", "")) || 0;
      } else if (show && isPaymentRow) {
        var amtCell = row.querySelector("td:nth-child(7)");
        if (amtCell) {
          var amtText = amtCell.textContent.trim();
          var amt = parseFloat(amtText.replace("₹", "").replace("+", "").replace("-", "")) || 0;
          if (amtText.indexOf("+") !== -1) {
            inlineReceived += amt;
          } else {
            inlinePayments += amt;
          }
        }
      }

      row.style.display = show ? "" : "none";
    });
  }

  var cardsGrid = document.getElementById("milkCardsGrid");
  if (cardsGrid) {
    var cards = cardsGrid.querySelectorAll(".history-card");
    cards.forEach(function (card) {
      var rowDate = card.getAttribute("data-date") || "";
      var show = true;

      if (rowDate) {
        var recordDate = new Date(rowDate);
        if (!isNaN(recordDate.getTime())) {
          if (fromDateObj && toDateObj) {
            if (recordDate < fromDateObj || recordDate > toDateObj) {
              show = false;
            }
          }
        }
      }

      if (show && animalFilter !== "all") {
        var cardAnimal = card.getAttribute("data-animal") || "";
        if (cardAnimal !== animalFilter) {
          show = false;
        }
      }

      card.style.display = show ? "" : "none";
    });
  }

  var separatorEl = document.getElementById("milkTotalSeparator");
  if (separatorEl) separatorEl.textContent = "TOTAL: ₹" + totalMilkAmt.toFixed(2);

  var cardsTotal = document.getElementById("milkCardsTotal");
  if (cardsTotal)
    cardsTotal.textContent = "TOTAL: ₹" + totalMilkAmt.toFixed(2);

  var msRec = document.getElementById("msReceived");
  var msPay = document.getElementById("msPayment");
  var msBal = document.getElementById("msBalance");

  if (msRec) msRec.textContent = "+₹" + inlineReceived.toFixed(2);
  if (msPay) msPay.textContent = "-₹" + inlinePayments.toFixed(2);
  if (msBal) {
    var balance = totalMilkAmt - inlineReceived - inlinePayments;
    msBal.textContent = "₹" + balance.toFixed(2);
    msBal.style.color = balance < 0 ? "#d32f2f" : "#1a237e";
  }

  if (paymentBody) {
    var paymentRows = paymentBody.querySelectorAll("tr");
    paymentRows.forEach(function (row) {
      var dateCell = row.querySelector("td:first-child");
      if (!dateCell) return;

      var dateText = dateCell.textContent.trim();
      var parts = dateText.split("-");
      if (parts.length !== 3) return;

      var rowType = row.getAttribute("data-type") || "";
      var rowDate = row.getAttribute("data-date") || "";

      var show = true;

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
          if (rowType == "1") {
            totalPayments += amt;
          } else if (rowType == "2") {
            totalReceived += amt;
          }
        }
      }

      row.style.display = show ? "" : "none";
    });

    var payTotal = document.getElementById("paymentTotalPayments");
    var recTotal = document.getElementById("paymentTotalReceived");
    var netTotal = document.getElementById("paymentNetBalance");
    if (payTotal) payTotal.textContent = "₹" + totalPayments.toFixed(2);
    if (recTotal) recTotal.textContent = "₹" + totalReceived.toFixed(2);
    if (netTotal) {
      var net = totalReceived - totalPayments;
      netTotal.textContent = "₹" + net.toFixed(2);
      netTotal.style.color = net < 0 ? "#d63031" : "#1a237e";
    }
  }

  var summaryMilk = document.getElementById("summaryMilkTotal");
  var summaryPay = document.getElementById("summaryPayments");
  var summaryRec = document.getElementById("summaryReceived");
  var summaryOut = document.getElementById("summaryOutstanding");

  if (summaryMilk) summaryMilk.textContent = "₹" + totalMilkAmt.toFixed(2);
  if (summaryPay) summaryPay.textContent = "₹" + totalPayments.toFixed(2);
  if (summaryRec) summaryRec.textContent = "₹" + totalReceived.toFixed(2);
  if (summaryOut) {
    var outstanding = totalMilkAmt - totalReceived;
    summaryOut.textContent = "₹" + outstanding.toFixed(2);
    summaryOut.style.color = outstanding < 0 ? "#d63031" : "#6a1b9a";
  }

};

// ============================================================
// RESET HISTORY FILTER
// ============================================================

window.suplrResetHistoryFilter = function () {
  var now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth() + 1;
  var firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  var lastDayOfMonth = new Date(currentYear, currentMonth, 0);

  var fromDateInput = document.getElementById("historyFromDate");
  var toDateInput = document.getElementById("historyToDate");
  var typeSelect = document.getElementById("historyPaymentFilterType");

  if (typeSelect) typeSelect.value = "all";
  if (fromDateInput) fromDateInput.value = formatDateYYYYMMDD(firstDayOfMonth);
  if (toDateInput) toDateInput.value = formatDateYYYYMMDD(lastDayOfMonth);

  var animalAll = document.querySelector('input[name="historyAnimalFilter"][value="all"]');
  if (animalAll) animalAll.checked = true;

  var displayFrom = document.getElementById("displayFromDate");
  var displayTo = document.getElementById("displayToDate");
  if (displayFrom) displayFrom.textContent = formatDateDisplay(firstDayOfMonth);
  if (displayTo) displayTo.textContent = formatDateDisplay(lastDayOfMonth);

  window.suplrApplyHistoryFilter();

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
// CLOSE MODAL HELPER
// ============================================================

window.closeModal = function (modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    if (modal._escHandler) {
      document.removeEventListener("keydown", modal._escHandler);
    }
    modal.remove();
  }
};
