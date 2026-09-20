// ============================================================
// SANGH MODULE — Simplified milk collection (liter only)
// ============================================================

function showSangh() {
  var container = document.getElementById("prdContent");
  if (!container) return;

  var now = new Date();
  var today = now.toISOString().split("T")[0];
  var currentTime =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");

  var savedSession = localStorage.getItem("milk_session_selected") || "1";
  var sessionMorningChecked = savedSession == "1" ? "checked" : "";
  var sessionEveningChecked = savedSession == "2" ? "checked" : "";

  var html = "";
  html += '<div class="milk-card">';

  // Header
  html +=
    '<div style="background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%); color: white; padding: 10px 15px; border-radius: 10px; margin-bottom: 15px; text-align: center;">' +
    '<h5 class="mb-0" style="font-size:16px;"><i class="fas fa-users me-2"></i>Sangh Entry</h5>' +
    "</div>";

  html +=
    '<form onsubmit="window.submitSanghEntry(event)" autocomplete="off">';

  // DATE, TIME & SESSION
  html +=
    '<div style="background: #f8f7ff; padding: 10px 12px; border-radius: 10px; border: 2px solid #667eea; margin-bottom: 12px;">';
  html +=
    '<div style="display: flex; gap: 10px; flex-wrap: wrap;">' +
    '<div style="flex: 1; min-width: 120px;">' +
    '<label style="color: #667eea; font-weight: bold; font-size: 11px; display: block; margin-bottom: 2px;">Date</label>' +
    '<input type="date" id="sanghDate" value="' +
    today +
    '" style="border: 2px solid #667eea; font-weight: bold; padding: 4px 8px; font-size: 14px; width: 100%; border-radius: 6px;">' +
    "</div>" +
    '<div style="flex: 1; min-width: 100px;">' +
    '<label style="color: #667eea; font-weight: bold; font-size: 11px; display: block; margin-bottom: 2px;">Time</label>' +
    '<input type="time" id="sanghTime" value="' +
    currentTime +
    '" style="border: 2px solid #667eea; font-weight: bold; padding: 4px 8px; font-size: 14px; width: 100%; border-radius: 6px;">' +
    "</div>" +
    '<div style="flex: 2; min-width: 180px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">' +
    '<span style="color: #667eea; font-weight: bold; font-size: 11px; white-space: nowrap;">Session</span>' +
    '<div style="display: flex; gap: 6px; flex-wrap: wrap;">' +
    '<label style="cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 4px; background: ' +
    (savedSession == "1" ? "#e8eaf6" : "#FFFDF6") +
    "; padding: 4px 12px; border-radius: 6px; border: 2px solid " +
    (savedSession == "1" ? "#667eea" : "#d1d5e0") +
    '; transition: all 0.2s; margin: 0;">' +
    '<input type="radio" name="sanghSession" value="1" onchange="localStorage.setItem(\'milk_session_selected\', this.value)" ' +
    sessionMorningChecked +
    ' style="accent-color: #667eea; margin: 0;"> Morning</label>' +
    '<label style="cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 4px; background: ' +
    (savedSession == "2" ? "#e8eaf6" : "#FFFDF6") +
    "; padding: 4px 12px; border-radius: 6px; border: 2px solid " +
    (savedSession == "2" ? "#667eea" : "#d1d5e0") +
    '; transition: all 0.2s; margin: 0;">' +
    '<input type="radio" name="sanghSession" value="2" onchange="localStorage.setItem(\'milk_session_selected\', this.value)" ' +
    sessionEveningChecked +
    ' style="accent-color: #667eea; margin: 0;"> Evening</label>' +
    "</div></div></div>";
  html += "</div>";

  // SESSION TOTALS PANEL (collected milk from "mi" table)
  html +=
    '<div style="background: #f1f8e9; padding: 10px 12px; border-radius: 10px; border: 2px solid #2e7d32; margin-bottom: 12px;">' +
    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">' +
    '<span style="color: #2e7d32; font-weight: bold; font-size: 12px;"><i class="fas fa-chart-bar me-1"></i> Collected Milk — <span id="sanghTotalsDate">' +
    formatDateDisplay(today) +
    '</span></span>' +
    '<button type="button" onclick="window.updateSanghSessionTotals()" style="background: #2e7d32; color: white; border: none; padding: 3px 10px; border-radius: 5px; font-size: 11px; font-weight: bold; cursor: pointer;">Refresh</button>' +
    "</div>" +
    '<div id="sanghTotalsPanel" style="font-size: 12px;"><div style="text-align:center; color:#888;">Loading...</div></div>' +
    "</div>";

  // SUPPLIER SELECTION
  html +=
    '<div style="margin-bottom: 12px;">' +
    '<label style="font-weight: bold; color: #e65100; font-size: 12px;"><i class="fas fa-user"></i> Supplier Name (Optional)</label>' +
    '<div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px;">' +
    '<div style="flex: 1;">' +
    '<input type="text" id="uniqueIdSearchInput" class="form-control form-control-sm" placeholder="Enter Unique ID, Name or Mobile..." style="border: 2px solid #667eea; padding: 6px 10px; border-radius: 6px; width: 100%; font-size: 14px;">' +
    "</div>" +
    '<button type="button" id="openSupplierListBtn" class="btn btn-success btn-sm" style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: bold; cursor: pointer; white-space: nowrap; display: none;">' +
    '<i class="fas fa-plus"></i> Add</button>' +
    "</div>" +
    '<div style="position:relative;">' +
    '<input id="clientDisplay" type="text" class="form-control form-control-sm client-input" readonly placeholder="No supplier selected..." style="border: 2px solid #ff9800; font-weight:500; cursor:default; background:#f5f5f5; padding:6px 10px; border-radius:6px; width:100%; font-size:14px; color:#666;">' +
    '<div id="supplierDropdown" style="display:none; position:absolute; top:100%; left:0; right:0; z-index:9999; background:white; border:2px solid #667eea; border-radius:8px; max-height:220px; overflow-y:auto; width:100%; box-shadow:0 4px 12px rgba(0,0,0,0.15);"></div>' +
    "</div>" +
    '<input type="hidden" id="supplierId" value="">' +
    '<input type="hidden" id="selectedUniqueId" value="">' +
    "</div>";

  // COLLECTION DETAILS (always visible — supplier is optional)
  html += '<div id="collectionDetails">';

  // Milk Details Header
  html +=
    '<div style="margin-bottom: 10px;">' +
    '<h6 style="color: #2e7d32; font-weight: bold; font-size: 14px; text-align: center; margin-bottom: 8px;"><i class="fas fa-tint"></i> Milk Details</h6>' +
    '<div class="milk-details-wrapper" style="overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 6px; scrollbar-width: thin;">' +
    '<div class="milk-details-container" style="display: flex; gap: 12px; min-width: auto;">';

  // BUFFALO COLUMN - liter only
  html +=
    '<div class="buffalo-column" style="flex: 1; min-width: auto; max-width: auto; background: #fff3e0; padding: 10px; border-radius: 8px; border: 2px solid #ff9800;">' +
    '<h6 style="color: #e65100; text-align: center; font-weight: bold; font-size: 13px; margin-bottom: 6px;">Buffalo</h6>' +
    '<div style="margin-bottom: 4px;"><label style="color: #e65100; font-weight: 600; font-size: 10px;">Qty (Ltr)</label>' +
    '<input type="text" class="form-control form-control-sm" id="buffaloQty" placeholder="0.00" step="0.01" min="0" oninput="window.keepMilk(this)" autocomplete="off" style="border: 2px solid #ff9800; font-size: 14px; font-weight: bold; text-align: center; padding: 3px 4px; border-radius: 6px; width: 100%;">' +
    "</div></div>";

  // COW COLUMN - liter only
  html +=
    '<div class="cow-column" style="flex: 1; min-width: auto; max-width: auto; background: #e3f2fd; padding: 10px; border-radius: 8px; border: 2px solid #2196f3;">' +
    '<h6 style="color: #1565c0; text-align: center; font-weight: bold; font-size: 13px; margin-bottom: 6px;">Cow</h6>' +
    '<div style="margin-bottom: 4px;"><label style="color: #1565c0; font-weight: 600; font-size: 10px;">Qty (Ltr)</label>' +
    '<input type="text" class="form-control form-control-sm" id="cowQty" placeholder="0.00" step="0.01" min="0" oninput="window.keepMilk(this)" autocomplete="off" style="border: 2px solid #2196f3; font-size: 14px; font-weight: bold; text-align: center; padding: 3px 4px; border-radius: 6px; width: 100%;">' +
    "</div></div>";

  html += "</div></div></div>";

  // BUTTONS
  html +=
    '<div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">' +
    '<button type="submit" class="btn" style="background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%); color: white; border: none; padding: 12px; font-size: 16px; font-weight: bold; border-radius: 10px; width: 100%; cursor: pointer;">' +
    '<i class="fas fa-save me-2"></i> Submit</button>' +
    '<button type="button" class="btn" style="background: #ff9800; color: white; border: none; padding: 12px; font-size: 16px; font-weight: bold; border-radius: 10px; width: 100%; cursor: pointer;" onclick="window.viewSanghHistory()">' +
    '<i class="fas fa-history me-2"></i> View History</button>' +
    "</div>";

  html += "</div>"; // collectionDetails
  html += "</form></div>";

  container.innerHTML = html;

  setupSanghEventListeners();

  window.updateSanghSessionTotals();
  window.autoFillSanghQty();
}

// ============================================================
// SETUP EVENT LISTENERS
// ============================================================

function setupSanghEventListeners() {
  var searchInput = document.getElementById("uniqueIdSearchInput");
  var openBtn = document.getElementById("openSupplierListBtn");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchSupplierForSangh();
    });
  }

  // DATE change -> refresh totals + auto-fill quantities
  var dateInput = document.getElementById("sanghDate");
  if (dateInput) {
    var onDateChange = function () {
      window.updateSanghSessionTotals();
      window.autoFillSanghQty();
    };
    dateInput.addEventListener("change", onDateChange);
    dateInput.addEventListener("input", onDateChange);
  }

  // SESSION radio change -> auto-fill quantities for that session
  var sessionRadios = document.querySelectorAll('input[name="sanghSession"]');
  for (var i = 0; i < sessionRadios.length; i++) {
    sessionRadios[i].addEventListener("change", function () {
      window.autoFillSanghQty();
    });
  }
}

// ============================================================
// SESSION TOTALS FROM "mi" TABLE (all persons, both animals)
// ============================================================

// Normalize any stored date value to "YYYY-MM-DD"
function normalizeSanghDate(value) {
  if (value === null || value === undefined || value === "") return null;

  var s = String(value).trim();

  // "YYYY-MM-DD..." (with or without time part)
  var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) {
    return (
      m[1] + "-" + m[2].padStart(2, "0") + "-" + m[3].padStart(2, "0")
    );
  }

  // Compact "YYYYMMDD"
  m = s.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m) return m[1] + "-" + m[2] + "-" + m[3];

  // "DD-MM-YYYY" / "DD/MM/YYYY"
  m = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
  if (m) {
    return (
      m[3] + "-" + m[2].padStart(2, "0") + "-" + m[1].padStart(2, "0")
    );
  }

  // Epoch seconds / milliseconds
  var n = Number(s);
  if (!isNaN(n) && n > 0 && String(n) === s.replace(/\D/g, "")) {
    if (n >= 1e12 || n >= 1e9) {
      var ed = new Date(n >= 1e12 ? n : n * 1000);
      if (!isNaN(ed.getTime())) return formatDateYYYYMMDD(ed);
    }
  }

  // Last resort: any Date-parseable string
  var parsed = new Date(s);
  if (!isNaN(parsed.getTime())) return formatDateYYYYMMDD(parsed);

  return null;
}

// Race-guard tokens (avoid stale async results overwriting newer ones)
var _sanghTotalsReq = 0;
var _sanghFillReq = 0;

async function getSanghSessionTotals(dateStr) {
  var totals = {
    1: { buffalo: 0, cow: 0 },
    2: { buffalo: 0, cow: 0 },
  };
  if (!dateStr) return totals;

  var allRecords = [];
  try {
    allRecords = (await dbDexieManager.getAllRecords(dbnm, "mi")) || [];
  } catch (e) {
    console.warn("Sangh totals: failed to read 'mi' table:", e);
    return totals;
  }

  var matched = 0;

  for (var i = 0; i < allRecords.length; i++) {
    var rec = allRecords[i];
    if (!rec) continue;

    var recDate = normalizeSanghDate(rec.f);
    if (!recDate || recDate !== dateStr) continue;

    var session = parseInt(rec.g);
    var animal = parseInt(rec.h);
    if (session !== 1 && session !== 2) continue;
    if (animal !== 1 && animal !== 2) continue;

    totals[session][animal === 1 ? "buffalo" : "cow"] +=
      parseFloat(rec.i) || 0;
    matched++;
  }

  console.log(
    "Sangh totals [" +
      dateStr +
      "]: scanned " +
      allRecords.length +
      " 'mi' records, matched " +
      matched +
      " | Morning B/C: " +
window.fmtMilk(totals[1].buffalo) +
      "/" +
      window.fmtMilk(totals[1].cow) +
      " | Evening B/C: " +
      window.fmtMilk(totals[2].buffalo) +
      "/" +
      window.fmtMilk(totals[2].cow)
  );

  return totals;
}

window.updateSanghSessionTotals = async function () {
  var panel = document.getElementById("sanghTotalsPanel");
  if (!panel) return;

  var reqId = ++_sanghTotalsReq;

  var dateStr = document.getElementById("sanghDate")?.value;
  var dateLabel = document.getElementById("sanghTotalsDate");
  if (dateLabel)
    dateLabel.textContent = dateStr ? formatDateDisplay(dateStr) : "-";

  panel.innerHTML =
    '<div style="text-align:center; color:#888;">Loading...</div>';

  var totals = await getSanghSessionTotals(dateStr);

  if (reqId !== _sanghTotalsReq) return; // stale result — ignore

  function totalsRow(label, t) {
    var total = t.buffalo + t.cow;
    return (
      '<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; background:#ffffff; border-radius:6px; padding:5px 8px; margin-bottom:4px;">' +
      '<span style="font-weight:bold; min-width:58px;">' + label + "</span>" +
      '<span style="color:#e65100; font-weight:bold;">Buffalo: ' + window.fmtMilk(t.buffalo) + " L</span>" +
      '<span style="color:#1565c0; font-weight:bold;">Cow: ' + window.fmtMilk(t.cow) + " L</span>" +
      '<span style="margin-left:auto; font-weight:bold; color:#2e7d32;">Total: ' + window.fmtMilk(total) + " L</span>" +
      "</div>"
    );
  }

  panel.innerHTML =
    totalsRow("Morning", totals[1]) + totalsRow("Evening", totals[2]);
};

window.autoFillSanghQty = async function () {
  var dateStr = document.getElementById("sanghDate")?.value;
  var sessionRadio = document.querySelector(
    'input[name="sanghSession"]:checked'
  );
  var sessionNumber = sessionRadio ? parseInt(sessionRadio.value) : 0;
  if (!dateStr || !sessionNumber) return;

  var reqId = ++_sanghFillReq;

  var totals = await getSanghSessionTotals(dateStr);

  if (reqId !== _sanghFillReq) return; // stale result — ignore

  var s = totals[sessionNumber];

  var buffaloField = document.getElementById("buffaloQty");
  var cowField = document.getElementById("cowQty");
  if (buffaloField) buffaloField.value = window.fmtMilk(s.buffalo);
  if (cowField) cowField.value = window.fmtMilk(s.cow);
};

// ============================================================
// SEARCH SUPPLIER
// ============================================================

async function searchSupplierForSangh() {
  var searchInput = document.getElementById("uniqueIdSearchInput");
  var clientDisplay = document.getElementById("clientDisplay");
  var supplierIdField = document.getElementById("supplierId");
  var collectionDetails = document.getElementById("collectionDetails");
  var openBtn = document.getElementById("openSupplierListBtn");

  var searchTerm = searchInput?.value?.trim() || "";

  closeSupplierDropdown();

  // If empty, reset
  if (!searchTerm) {
    clientDisplay.value = "No supplier selected...";
    clientDisplay.style.color = "#666";
    clientDisplay.style.background = "#f5f5f5";
    clientDisplay.style.borderColor = "#ff9800";
    supplierIdField.value = "";
    document.getElementById("selectedUniqueId").value = "";
    window._selectedSupplier = null;
    if (collectionDetails) collectionDetails.style.display = "none";
    if (openBtn) openBtn.style.display = "none";
    return;
  }

  var allSuppliers = window.milk_persons || [];
  if (!allSuppliers.length) return;

  // COMMA SEPARATED SEARCH
  if (searchTerm.indexOf(",") !== -1) {
    var parts = searchTerm.split(",");
    var searchValues = [];
    for (var ci = 0; ci < parts.length; ci++) {
      var v = parts[ci].trim();
      if (v !== "") searchValues.push(v);
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
      fillSanghSupplier(matchedSuppliers[0]);
      return;
    } else if (matchedSuppliers.length > 1) {
      clientDisplay.value =
        "Found " + matchedSuppliers.length + " parties — tap to select";
      clientDisplay.style.color = "#1a237e";
      clientDisplay.style.fontWeight = "bold";
      clientDisplay.style.background = "#e3f2fd";
      clientDisplay.style.borderColor = "#2196f3";
      supplierIdField.value = "";
      document.getElementById("selectedUniqueId").value = "";
      window._selectedSupplier = null;
      if (collectionDetails) collectionDetails.style.display = "none";
      if (openBtn) openBtn.style.display = "none";
      showSupplierDropdown(matchedSuppliers, function (supplier) {
        fillSanghSupplier(supplier);
      });
      return;
    }
  }

  // PARTIAL ANIMAL ID SEARCH (numeric, no comma)
  if (!isNaN(parseInt(searchTerm)) && searchTerm.indexOf(",") === -1) {
    var animalMatchCount = window.showAnimalIdDropdown(
      allSuppliers,
      searchTerm,
      function (supplier) {
        fillSanghSupplier(supplier);
      }
    );
    if (animalMatchCount > 0) {
      clientDisplay.value =
        "Found " + animalMatchCount + " parties — tap to select";
      clientDisplay.style.color = "#1a237e";
      clientDisplay.style.fontWeight = "bold";
      clientDisplay.style.background = "#e3f2fd";
      clientDisplay.style.borderColor = "#2196f3";
      supplierIdField.value = "";
      document.getElementById("selectedUniqueId").value = "";
      window._selectedSupplier = null;
      if (collectionDetails) collectionDetails.style.display = "none";
      if (openBtn) openBtn.style.display = "none";
      return;
    }
  }

  // STANDARD SEARCH
  var foundSupplier = null;
  for (var j = 0; j < allSuppliers.length; j++) {
    var s = allSuppliers[j];
    if (
      s.k &&
      s.k.toString().toUpperCase() === searchTerm.toUpperCase()
    ) {
      foundSupplier = s;
      break;
    } else if (
      s.h &&
      s.h.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      foundSupplier = s;
      break;
    } else if (
      s.i &&
      s.i.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      foundSupplier = s;
      break;
    } else if (s.e) {
      var cleanMobile = s.e
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
        foundSupplier = s;
        break;
      } else if (
        searchMobile.length >= 6 &&
        cleanMobile.endsWith(searchMobile)
      ) {
        foundSupplier = s;
        break;
      }
    }
  }

  if (foundSupplier) {
    fillSanghSupplier(foundSupplier);
  } else {
    clientDisplay.value = "No supplier found for: " + searchTerm;
    clientDisplay.style.color = "#d32f2f";
    clientDisplay.style.fontWeight = "bold";
    clientDisplay.style.background = "#ffebee";
    clientDisplay.style.borderColor = "#d32f2f";
    supplierIdField.value = "";
    document.getElementById("selectedUniqueId").value = "";
    window._selectedSupplier = null;
    if (collectionDetails) collectionDetails.style.display = "none";
    if (openBtn) {
      openBtn.style.display = "inline-block";
      openBtn.innerHTML =
        '<i class="fas fa-plus"></i> Add "' + searchTerm + '"';
    }
  }
}

// ============================================================
// FILL SUPPLIER INTO SANGH FORM
// ============================================================

function fillSanghSupplier(supplier) {
  var clientDisplay = document.getElementById("clientDisplay");
  var supplierIdField = document.getElementById("supplierId");
  var collectionDetails = document.getElementById("collectionDetails");
  var openBtn = document.getElementById("openSupplierListBtn");

  var name = supplier.h || supplier.i || supplier.e || "Unnamed";
  var phone = supplier.e || "";
  var uniqueId = supplier.k || "";

  clientDisplay.value =
    (uniqueId || "N/A") + " | " + name + (phone ? " | " + phone : "");
  clientDisplay.style.color = "#1a237e";
  clientDisplay.style.fontWeight = "bold";
  clientDisplay.style.background = "#e8f5e9";
  clientDisplay.style.borderColor = "#4caf50";

  supplierIdField.value = supplier.a;
  document.getElementById("selectedUniqueId").value = uniqueId || "";

  if (openBtn) openBtn.style.display = "none";
  closeSupplierDropdown();

  window._selectedSupplier = supplier;

  if (collectionDetails) {
    collectionDetails.style.display = "block";
  }
}

// ============================================================
// SUBMIT SANGH ENTRY
// ============================================================

window.submitSanghEntry = async function (event) {
  event.preventDefault();

  var collectionDate = document.getElementById("sanghDate")?.value;
  var collectionTime = document.getElementById("sanghTime")?.value;
  var sessionRadio = document.querySelector('input[name="sanghSession"]:checked');
  var sessionNumber = sessionRadio ? parseInt(sessionRadio.value) : 0;
  var supplierId = document.getElementById("supplierId")?.value;
  var clientDisplay = document.getElementById("clientDisplay");
  var supplierName =
    supplierId && clientDisplay ? clientDisplay.value : "Sangh (All Collected Milk)";

  var buffaloQty =
    parseFloat(document.getElementById("buffaloQty")?.value) || 0;
  var cowQty = parseFloat(document.getElementById("cowQty")?.value) || 0;

  if (!sessionNumber) {
    showMessageModal("Validation", "Please select a session!", true);
    return;
  }
  if (buffaloQty <= 0 && cowQty <= 0) {
    showMessageModal(
      "Validation",
      "Please enter quantity for at least one animal type!",
      true
    );
    return;
  }

  var now;
  if (collectionDate) {
    var dateTimeStr = collectionDate + "T" + (collectionTime || "00:00");
    now = new Date(dateTimeStr);
  } else {
    now = new Date();
  }

  var payloadEntries = [];
  var savedEntries = [];

  if (buffaloQty > 0) {
    payloadEntries.push({
      e: parseInt(supplierId) || 0,
      f: formatDateYYYYMMDD(now),
      g: sessionNumber,
      h: 1,
      i: parseFloat(buffaloQty.toFixed(2)),
    });
    savedEntries.push(
      "Buffalo: " + window.fmtMilk(buffaloQty) + " Ltr"
    );
  }

  if (cowQty > 0) {
    payloadEntries.push({
      e: parseInt(supplierId) || 0,
      f: formatDateYYYYMMDD(now),
      g: sessionNumber,
      h: 2,
      i: parseFloat(cowQty.toFixed(2)),
    });
    savedEntries.push(
      "Cow: " + window.fmtMilk(cowQty) + " Ltr"
    );
  }

  clearPayload0();

  payload0.p = payloadEntries;
  payload0.vw = 1;
  payload0.fn = -11;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
    { tb: "mi" },
  ]);

  var serverSaved = false;
  var serverMessage = "";

  try {
    if (typeof fnj3 === "function") {
      var response = await fnj3(
        "https://my1.in/2sang.php",
        payload0,
        1,
        true,
        null,
        20000,
        0,
        1,
        1
      );
      console.log("Sangh Server:", response);

      if (response && response.su == 1) {
        // Save to local Dexie "sg" table
        if (response.sg != null && response.sg.l != null) {
          await dbDexieManager.insertToDexie(
            dbnm,
            "sg",
            response.sg.l,
            true,
            ["a"]
          );
        }
        // Also save entries we sent
        await dbDexieManager.insertToDexie(
          dbnm,
          "sg",
          payloadEntries,
          true,
          ["a"]
        );
        serverSaved = true;
        serverMessage = response.ms || "Saved successfully!";
      } else if (response) {
        serverMessage = response.ms || "Server rejected the entry.";
      }
    } else {
      // No server — save locally only
      await dbDexieManager.insertToDexie(
        dbnm,
        "sg",
        payloadEntries,
        true,
        ["a"]
      );
      serverSaved = true;
      serverMessage = "Saved locally (server not available).";
    }
  } catch (err) {
    // Server unreachable — save locally
    try {
      await dbDexieManager.insertToDexie(
        dbnm,
        "sg",
        payloadEntries,
        true,
        ["a"]
      );
      serverSaved = true;
      serverMessage = "Saved locally (server unreachable: " + err.message + ")";
    } catch (localErr) {
      serverMessage = "Save failed: " + localErr.message;
    }
  }

  if (serverSaved) {
    var successMsg =
      "Sangh entry saved!\n\n" +
      supplierName +
      "\nDate: " +
      formatDateYYYYMMDD(now) +
      "\nSession: " +
      (sessionNumber == 1 ? "Morning" : "Evening") +
      "\n\n" +
      savedEntries.join("\n");

    showMessageModal("Success", successMsg, false);

    // Reset liter fields
    if (document.getElementById("buffaloQty"))
      document.getElementById("buffaloQty").value = "";
    if (document.getElementById("cowQty"))
      document.getElementById("cowQty").value = "";
  } else {
    showMessageModal("Error", "Failed to save: " + serverMessage, true);
  }
};

// ============================================================
// VIEW SANGH HISTORY
// ============================================================

window.viewSanghHistory = async function () {
  var supplierId = document.getElementById("supplierId")?.value;

  var allRecords = await dbDexieManager.getAllRecords(dbnm, "sg");
  var supplierRecords = supplierId
    ? allRecords.filter(function (r) {
        return r.e == supplierId;
      })
    : allRecords;

  if (!supplierRecords || supplierRecords.length === 0) {
    showMessageModal(
      "Sangh History",
      supplierId
        ? "No Sangh entries found for this supplier."
        : "No Sangh entries found.",
      false
    );
    return;
  }

  // Sort by date descending
  supplierRecords.sort(function (a, b) {
    return (b.f || "").localeCompare(a.f || "");
  });

  var clientDisplay = document.getElementById("clientDisplay");
  var supplierName = supplierId
    ? clientDisplay
      ? clientDisplay.value
      : "Supplier"
    : "All Entries";

  var html =
    '<div style="max-height:400px; overflow-y:auto;">' +
    '<table style="width:100%; border-collapse:collapse; font-size:12px;">' +
    "<thead><tr>" +
    '<th style="padding:6px 4px; border-bottom:2px solid #667eea; color:#667eea; text-align:left;">Date</th>' +
    '<th style="padding:6px 4px; border-bottom:2px solid #667eea; color:#667eea; text-align:center;">Session</th>' +
    '<th style="padding:6px 4px; border-bottom:2px solid #667eea; color:#667eea; text-align:center;">Type</th>' +
    '<th style="padding:6px 4px; border-bottom:2px solid #667eea; color:#667eea; text-align:right;">Ltr</th>' +
    '<th style="padding:6px 4px; border-bottom:2px solid #667eea; color:#667eea; text-align:center;">Edit</th>' +
    "</tr></thead><tbody>";

  for (var i = 0; i < supplierRecords.length; i++) {
    var r = supplierRecords[i];
    var animalType = r.h == 1 ? "Buffalo" : "Cow";
    var typeColor = r.h == 1 ? "#e65100" : "#1565c0";
    var sessionLabel = r.g == 1 ? "M" : r.g == 2 ? "E" : "-";

    html +=
      "<tr>" +
      '<td style="padding:5px 4px; border-bottom:1px solid #eee;">' +
      (r.f || "-") +
      "</td>" +
      '<td style="padding:5px 4px; border-bottom:1px solid #eee; text-align:center; font-weight:bold;">' +
      sessionLabel +
      "</td>" +
      '<td style="padding:5px 4px; border-bottom:1px solid #eee; text-align:center; color:' +
      typeColor +
      "; font-weight:bold;\">" +
      animalType +
      "</td>" +
      '<td style="padding:5px 4px; border-bottom:1px solid #eee; text-align:right; font-weight:bold;">' +
      (r.i || 0) +
      "</td>" +
      '<td style="padding:5px 4px; border-bottom:1px solid #eee; text-align:center;">' +
      '<button onclick="window.editSanghRecord(\'' +
      r.a +
      "')" +
      ' style="background:#667eea; color:white; border:none; padding:3px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Edit</button>' +
      "</td></tr>";
  }

  html += "</tbody></table></div>";

  var mid = "sanghHistory_" + Date.now();
  var div = document.createElement("div");
  div.innerHTML =
    '<div class="modal fade" id="' +
    mid +
    '" tabindex="-1">' +
    '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' +
    '<div class="modal-header" style="background:linear-gradient(135deg, #2e7d32, #66bb6a); color:white;">' +
    '<h6 class="modal-title">Sangh History — ' +
    supplierName +
    "</h6>" +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>' +
    '<div class="modal-body" style="padding:10px;">' +
    html +
    "</div></div></div>";
  document.body.appendChild(div);

  var modalEl = document.getElementById(mid);
  var m = new bootstrap.Modal(modalEl);
  m.show();
  modalEl.addEventListener("hidden.bs.modal", function () {
    this.remove();
  });
};

// ============================================================
// EDIT SANGH RECORD
// ============================================================

window.editSanghRecord = async function (recordId) {
  var allRecords = await dbDexieManager.getAllRecords(dbnm, "sg");
  var record = allRecords.find(function (r) {
    return r.a == recordId;
  });
  if (!record) {
    showMessageModal("Error", "Record not found!", true);
    return;
  }

  var mid = "sanghEdit_" + Date.now();
  var animalOptions =
    '<option value="1"' +
    (record.h == 1 ? " selected" : "") +
    '>Buffalo</option>' +
    '<option value="2"' +
    (record.h == 2 ? " selected" : "") +
    '>Cow</option>';
  var sessionOptions =
    '<option value="1"' +
    (record.g == 1 ? " selected" : "") +
    '>Morning</option>' +
    '<option value="2"' +
    (record.g == 2 ? " selected" : "") +
    '>Evening</option>';

  var div = document.createElement("div");
  div.innerHTML =
    '<div class="modal fade" id="' +
    mid +
    '" tabindex="-1">' +
    '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' +
    '<div class="modal-header" style="background:#667eea; color:white;">' +
    '<h6 class="modal-title">Edit Sangh Entry</h6>' +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>' +
    '<div class="modal-body">' +
    '<form id="editSanghForm" onsubmit="window.updateSanghEntry(event, ' +
    record.a +
    ')">' +
    '<div style="margin-bottom:10px;"><label style="font-weight:bold; font-size:12px;">Date</label>' +
    '<input type="date" id="editSanghDate" value="' +
    (record.f || "") +
    '" style="width:100%; padding:6px; border:2px solid #667eea; border-radius:6px;"></div>' +
    '<div style="margin-bottom:10px;"><label style="font-weight:bold; font-size:12px;">Session</label>' +
    '<select id="editSanghSession" style="width:100%; padding:6px; border:2px solid #667eea; border-radius:6px;">' +
    sessionOptions +
    "</select></div>" +
    '<div style="margin-bottom:10px;"><label style="font-weight:bold; font-size:12px;">Animal Type</label>' +
    '<select id="editSanghAnimal" style="width:100%; padding:6px; border:2px solid #667eea; border-radius:6px;">' +
    animalOptions +
    "</select></div>" +
    '<div style="margin-bottom:10px;"><label style="font-weight:bold; font-size:12px;">Qty (Ltr)</label>' +
    '<input type="text" id="editSanghQty" value="' +
    (record.i || "") +
    '" step="0.01" min="0" oninput="window.keepMilk(this)" style="width:100%; padding:6px; border:2px solid #667eea; border-radius:6px; font-weight:bold; text-align:center;"></div>' +
    '<div style="display:flex; gap:8px; margin-top:12px;">' +
    '<button type="submit" style="flex:1; background:linear-gradient(135deg, #2e7d32, #66bb6a); color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Update</button>' +
    '<button type="button" data-bs-dismiss="modal" style="flex:1; background:#9e9e9e; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Cancel</button>' +
    "</div></form></div></div></div>";
  document.body.appendChild(div);

  var modalEl = document.getElementById(mid);
  var m = new bootstrap.Modal(modalEl);
  m.show();
  modalEl.addEventListener("hidden.bs.modal", function () {
    this.remove();
  });
};

// ============================================================
// UPDATE SANGH ENTRY
// ============================================================

window.updateSanghEntry = async function (event, recordId) {
  event.preventDefault();

  var newDate = document.getElementById("editSanghDate")?.value;
  var newSession = parseInt(
    document.getElementById("editSanghSession")?.value
  );
  var newAnimal = parseInt(
    document.getElementById("editSanghAnimal")?.value
  );
  var newQty =
    parseFloat(document.getElementById("editSanghQty")?.value) || 0;

  if (!newDate) {
    showMessageModal("Validation", "Please select a date!", true);
    return;
  }
  if (newQty <= 0) {
    showMessageModal("Validation", "Please enter valid quantity!", true);
    return;
  }

  var endpointData = {
    a: recordId,
    e: parseInt(document.getElementById("supplierId")?.value) || 0,
    f: newDate,
    g: newSession,
    h: newAnimal,
    i: parseFloat(newQty.toFixed(2)),
  };

  clearPayload0();

  payload0.p = endpointData;
  payload0.vw = 1;
  payload0.fn = -12;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
    { tb: "mi" },
  ]);

  try {
    if (typeof fnj3 === "function") {
      var response = await fnj3(
        "https://my1.in/2/UpdateSangh.php",
        payload0,
        1,
        true,
        null,
        20000,
        0,
        1,
        1
      );

      if (response && response.su == 1) {
        // Update local record
        await dbDexieManager.insertToDexie(dbnm, "sg", [endpointData], true, [
          "a",
        ]);
        showMessageModal(
          "Success",
          "Sangh entry updated successfully!",
          false
        );
        // Close modal
        var modalEl = document.querySelector(".modal.show");
        if (modalEl) {
          var m = bootstrap.Modal.getInstance(modalEl);
          if (m) m.hide();
        }
      } else {
        showMessageModal(
          "Error",
          response?.ms || "Update rejected by server.",
          true
        );
      }
    } else {
      // No server — update locally
      await dbDexieManager.insertToDexie(dbnm, "sg", [endpointData], true, [
        "a",
      ]);
      showMessageModal(
        "Success",
        "Updated locally (server not available).",
        false
      );
      var modalEl = document.querySelector(".modal.show");
      if (modalEl) {
        var m = bootstrap.Modal.getInstance(modalEl);
        if (m) m.hide();
      }
    }
  } catch (err) {
    // Server unreachable — update locally
    try {
      await dbDexieManager.insertToDexie(dbnm, "sg", [endpointData], true, [
        "a",
      ]);
      showMessageModal(
        "Success",
        "Updated locally (server unreachable).",
        false
      );
      var modalEl = document.querySelector(".modal.show");
      if (modalEl) {
        var m = bootstrap.Modal.getInstance(modalEl);
        if (m) m.hide();
      }
    } catch (localErr) {
      showMessageModal("Error", "Update failed: " + localErr.message, true);
    }
  }
};

// ============================================================
// INIT
// ============================================================

window.initSangh = function () {
  console.log("Sangh module initialized");
};

window.showSangh = showSangh;

console.log("Sangh module ready!");
