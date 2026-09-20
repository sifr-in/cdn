// mlkCltFrm.js - Milk collection entry form with multiple animals

function isFieldRequired(fieldKey) {
  var colsToHide = window[my1uzr.worknOnPg].colsToHide || "";
  return colsToHide.indexOf(fieldKey) === -1;
}

// ============================================================
// GET MATCHING PRICING RECORD FROM mb TABLE
// ============================================================

window.getMatchingPricingRecord = async function (animal, fat, snf) {
  try {
    if (typeof dbDexieManager === "undefined" || typeof dbnm === "undefined") {
      console.warn("⚠️ dbDexieManager not available for pricing lookup");
      return { a: 0, i: 0 };
    }

    // Get all pricing records from mb table
    var allPricing = await dbDexieManager.getAllRecords(dbnm, "mb");

    if (!allPricing || allPricing.length === 0) {
      console.log("📋 No pricing records found in mb table");
      return { a: 0, i: 0 };
    }

    // Filter by animal type (f field: 1=Buffalo, 2=Cow)
    var animalPricing = allPricing.filter(function (record) {
      return record.f == animal;
    });

    if (animalPricing.length === 0) {
      console.log("📋 No pricing found for animal type:", animal);
      return { a: 0, i: 0 };
    }

    // Sort by date (newest first) so we get latest pricing
    animalPricing.sort(function (a, b) {
      return new Date(b.e) - new Date(a.e);
    });

    // Round input values to 3 decimal places for comparison
    var targetFat = parseFloat(parseFloat(fat).toFixed(3));
    var targetSnf = parseFloat(parseFloat(snf).toFixed(3));

    // Try to find EXACT match first
    var exactMatch = animalPricing.find(function (record) {
      var recordFat = parseFloat(parseFloat(record.g).toFixed(3));
      var recordSnf = parseFloat(parseFloat(record.h).toFixed(3));
      return recordFat === targetFat && recordSnf === targetSnf;
    });

    if (exactMatch) {
      console.log("✅ Exact pricing match found:", {
        id: exactMatch.a,
        animal: animal,
        fat: exactMatch.g,
        snf: exactMatch.h,
        price: exactMatch.i,
      });
      return exactMatch;
    }

    // If no exact match, find CLOSEST match by SNF and FAT difference
    var closestMatch = null;
    var smallestDiff = Infinity;

    animalPricing.forEach(function (record) {
      var recordFat = parseFloat(parseFloat(record.g).toFixed(3));
      var recordSnf = parseFloat(parseFloat(record.h).toFixed(3));

      // Calculate difference (weighted: SNF slightly more important)
      var fatDiff = Math.abs(recordFat - targetFat);
      var snfDiff = Math.abs(recordSnf - targetSnf);
      var totalDiff = fatDiff * 1 + snfDiff * 1.2;

      if (totalDiff < smallestDiff) {
        smallestDiff = totalDiff;
        closestMatch = record;
      }
    });

    if (closestMatch) {
      console.log("📋 Closest pricing match found:", {
        id: closestMatch.a,
        animal: animal,
        targetFat: targetFat,
        actualFat: closestMatch.g,
        targetSnf: targetSnf,
        actualSnf: closestMatch.h,
        price: closestMatch.i,
        diff: smallestDiff.toFixed(3),
      });
      return closestMatch;
    }

    // Fallback: return most recent pricing for this animal
    console.log("📋 Using latest pricing for animal:", animal);
    return animalPricing[0];
  } catch (error) {
    console.error("❌ Error getting matching pricing:", error);
    return { a: 0, i: 0 };
  }
};

// ============================================================
// SYNC PRICING FROM SERVER (if mb table is empty)
// ============================================================

window.syncPricingFromServer = async function (silent) {
  try {
    if (typeof fnj3 !== "function") {
      if (!silent) {
        showMessageModal(
          "Error",
          "❌ Cannot sync - server connection not available!",
          true,
        );
      }
      return false;
    }

    var syncPayload = {
      eo: "0.0000000000",
      ec: "z",
      fi: 0,
      fk: 0,
      mk: typeof my1uzr !== "undefined" && my1uzr.mk ? my1uzr.mk : "",
      la: [],
      vw: 1,
      fn: 72,
      p: {},
    };

    console.log("🔄 Syncing pricing from server...");

    var response = await fnj3(
      "https://my1.in/2/h.php",
      syncPayload,
      1,
      true,
      null,
      20000,
      0,
      1,
      1,
    );

    if (response && response.su == 1) {
      if (typeof handl_mi_rspons === "function") {
        await handl_mi_rspons(response, 0);
      }
      console.log("✅ Pricing synced from server");

      if (!silent) {
        showMessageModal(
          "Success",
          "✅ Pricing data synced successfully!",
          false,
        );
      }
      return true;
    } else {
      console.log("⚠️ Server sync failed or returned empty");
      return false;
    }
  } catch (error) {
    console.error("❌ Sync error:", error);
    return false;
  }
};

// =============================================
// CALLBACK FUNCTION - Runs after supplier selection from open_entind_crud
// =============================================
window.commonFnToRunAfter_op_ViewCall_Collection = function (selectedData) {
  console.log("✅ Supplier selected in COLLECTION form:", selectedData);

  if (selectedData && selectedData.a) {
    var personId = selectedData.a;

    var supplierIdField = document.getElementById("supplierId");
    var clientDisplay = document.getElementById("clientDisplay");
    var searchInput = document.getElementById("uniqueIdSearchInput");
    var openBtn = document.getElementById("openSupplierListBtn");
    var collectionDetails = document.getElementById("collectionDetails");

    if (supplierIdField && clientDisplay) {
      supplierIdField.value = personId;

      var persons = window.milk_persons || [];
      var person = persons.find(function (p) {
        return String(p.a) == String(personId);
      });

      if (person) {
        var name = person.h || person.i || person.e || "Unnamed";
        var phone = person.e || "";
        var uniqueId = person.k || "";

        // ✅ Display supplier (no Unique ID check)
        clientDisplay.value =
          (uniqueId ? "🆔 " + uniqueId + " | " : "") +
          name +
          (phone ? " | 📱 " + phone : "");
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

        // ✅ Show milk entry form
        if (collectionDetails) {
          collectionDetails.style.display = "block";
          setTimeout(function () {
            window.calculateTotal();
          }, 100);
        }

        // Store supplier data
        window._selectedSupplier = person;
      }

      window.loadSupplierDetails();
    }
  }
};

// =============================================
// INIT FUNCTION
// =============================================

function initMilkCollectionForm() {
  console.log("✅ initMilkCollectionForm called");
  if (!localStorage.getItem("milk_price_history")) {
    var defaultHistory = [
      { a: 1, e: "2026-jan-16", f: 1, g: 54 },
      { a: 2, e: "2026-jan-16", f: 2, g: 40 },
      { a: 1, e: "2026-feb-16", f: 1, g: 56 },
      { a: 2, e: "2026-feb-16", f: 2, g: 42 },
      { a: 1, e: "2026-jun-16", f: 1, g: 59.4 },
      { a: 2, e: "2026-jun-16", f: 2, g: 44.2 },
    ];
    localStorage.setItem("milk_price_history", JSON.stringify(defaultHistory));
  }
}

// ✅ Helper function to get supplier e and f
function getSupplierEF() {
  var supplierId = document.getElementById("supplierId")?.value;
  if (!supplierId) return null;

  var persons = window.milk_persons || [];
  var person = persons.find(function (p) {
    return String(p.a) == String(supplierId);
  });

  if (person && person.e && person.f) {
    return { e: person.e, f: person.f };
  }
  return null;
}

function showMilkCollectionForm() {
  var container = document.getElementById("prdContent");
  if (!container) return;

  var showRemarks = isFieldRequired("l");

  var now = new Date();
  var today = now.toISOString().split("T")[0];
  var currentTime =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");
  var currentDate = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // ✅ Get saved session from localStorage
  var savedSession = localStorage.getItem("milk_session_selected") || "1";
  var sessionMorningChecked = savedSession == "1" ? "checked" : "";
  var sessionEveningChecked = savedSession == "2" ? "checked" : "";

  var html = "";
  html +=
    '<div class="milk-card">';

  // Header
  html +=
    '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 15px; border-radius: 10px; margin-bottom: 15px; text-align: center;">' +
    '<h5 class="mb-0" style="font-size:16px;"><i class="fas fa-plus-circle me-2"></i>Milk Collection Entry</h5>' +
    "</div>";

  html +=
    '<form onsubmit="window.submitMilkCollection(event)" autocomplete="off">';

  // ============================================================
  // DATE, TIME & SESSION
  // ============================================================
  html +=
    '<div style="background: #f8f7ff; padding: 10px 12px; border-radius: 10px; border: 2px solid #667eea; margin-bottom: 12px;">';

  // Row 1: Date and Time
  html +=
    '<div style="display: flex; gap: 10px; flex-wrap: wrap;">' +
    '<div style="flex: 1; min-width: 120px;">' +
    '<label style="color: #667eea; font-weight: bold; font-size: 11px; display: block; margin-bottom: 2px;">📅 Date</label>' +
    '<input type="date" class="form-control form-control-sm" id="collectionDate" value="' +
    today +
    '" style="border: 2px solid #667eea; font-weight: bold; padding: 4px 8px; font-size: 14px; width: 100%; border-radius: 6px;">' +
    "</div>" +
    '<div style="flex: 1; min-width: 100px;">' +
    '<label style="color: #667eea; font-weight: bold; font-size: 11px; display: block; margin-bottom: 2px;">🕐 Time</label>' +
    '<input type="time" class="form-control form-control-sm" id="collectionTime" value="' +
    currentTime +
    '" style="border: 2px solid #667eea; font-weight: bold; padding: 4px 8px; font-size: 14px; width: 100%; border-radius: 6px;">' +
    "</div>" +
    '<div style="flex: 2; min-width: 180px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; border-top: none;">' +
    '<span style="color: #667eea; font-weight: bold; font-size: 11px; white-space: nowrap;">🕐 Session</span>' +
    '<div style="display: flex; gap: 6px; flex-wrap: wrap;">' +
    '<label style="cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 4px; background: ' +
    (savedSession == "1" ? "#e8eaf6" : "#FFFDF6") +
    "; padding: 4px 12px; border-radius: 6px; border: 2px solid " +
    (savedSession == "1" ? "#667eea" : "#d1d5e0") +
    '; transition: all 0.2s; margin: 0;">' +
    '<input type="radio" name="session" value="1" onchange="window.saveSession(this.value)" ' +
    sessionMorningChecked +
    ' style="accent-color: #667eea; margin: 0;"> 🌅 Morning</label>' +
    '<label style="cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 4px; background: ' +
    (savedSession == "2" ? "#e8eaf6" : "#FFFDF6") +
    "; padding: 4px 12px; border-radius: 6px; border: 2px solid " +
    (savedSession == "2" ? "#667eea" : "#d1d5e0") +
    '; transition: all 0.2s; margin: 0;">' +
    '<input type="radio" name="session" value="2" onchange="window.saveSession(this.value)" ' +
    sessionEveningChecked +
    ' style="accent-color: #667eea; margin: 0;"> 🌆 Evening</label>' +
    "</div></div></div>";
  html += "</div>";

  // ============================================================
  // SUPPLIER SELECTION - AUTO-SEARCH ON INPUT
  // ============================================================
  html +=
    '<div style="margin-bottom: 12px;">' +
    '<label style="font-weight: bold; color: #e65100; font-size: 12px;"><i class="fas fa-user"></i> Supplier Name *</label>' +
    // ✅ Search Row - Auto-search on input
    '<div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px;">' +
    '<div style="flex: 1;">' +
    '<input type="text" id="uniqueIdSearchInput" class="form-control form-control-sm" placeholder="🔍 Enter Unique ID, Name or Mobile..." style="border: 2px solid #667eea; padding: 6px 10px; border-radius: 6px; width: 100%; font-size: 14px;">' +
    "</div>" +
    // ✅ + Button - Hidden by default, shows only when supplier NOT found
    '<button type="button" id="openSupplierListBtn" class="btn btn-success btn-sm" style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: bold; cursor: pointer; white-space: nowrap; display: none;">' +
    '<i class="fas fa-plus"></i> Add' +
    "</button>" +
    "</div>" +
    // ✅ Display selected supplier
    '<div style="position:relative;">' +
    '<input id="clientDisplay" type="text" class="form-control form-control-sm client-input" readonly placeholder="No supplier selected..." style="border: 2px solid #ff9800; font-weight:500; cursor:default; background:#f5f5f5; padding:6px 10px; border-radius:6px; width:100%; font-size:14px; color:#666;">' +
    '<div id="supplierDropdown" style="display:none; position:absolute; top:100%; left:0; right:0; z-index:9999; background:white; border:2px solid #667eea; border-radius:8px; max-height:220px; overflow-y:auto; width:100%; box-shadow:0 4px 12px rgba(0,0,0,0.15);"></div>' +
    "</div>" +
    '<input type="hidden" id="supplierId" value="">' +
    '<input type="hidden" id="selectedUniqueId" value="">' +
    "</div>";

  // ✅ Milk Details - Hidden until supplier selected
  html += '<div id="collectionDetails" style="display:none;">';

  // ============================================================
  // MILK DETAILS - Responsive (Desktop: side by side, Mobile: compact)
  // ============================================================
  html +=
    '<div style="margin-bottom: 10px;">' +
    '<h6 style="color: #2e7d32; font-weight: bold; font-size: 14px; text-align: center; margin-bottom: 8px;"><i class="fas fa-tint"></i> Milk Details</h6>' +
    '<div class="milk-details-wrapper" style="overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 6px; scrollbar-width: thin;">' +
    '<div class="milk-details-container" style="display: flex; gap: 12px; min-width: auto;">';

  // ============================================================
  // BUFFALO COLUMN (REDUCED WIDTH FOR MOBILE)
  // ============================================================
  html +=
    '<div class="buffalo-column" style="flex: 1; min-width: auto; max-width: auto; background: #fff3e0; padding: 10px; border-radius: 8px; border: 2px solid #ff9800;">' +
    '<h6 style="color: #e65100; text-align: center; font-weight: bold; font-size: 13px; margin-bottom: 6px;">🐃 Buffalo</h6>' +
    '<div style="margin-bottom: 4px;"><label style="color: #e65100; font-weight: 600; font-size: 10px;">Qty (Ltr)</label>' +
    '<input type="text" class="form-control form-control-sm" id="buffaloQty" placeholder="0.00" step="0.01" min="0" oninput="window.keepMilk(this)" onchange="window.calculateTotal()" onkeyup="window.calculateTotal()" autocomplete="off" style="border: 2px solid #ff9800; font-size: 14px; font-weight: bold; text-align: center; padding: 3px 4px; border-radius: 6px; width: 100%;">' +
    "</div>" +
    '<div style="margin-bottom: 4px;"><label style="color: #e65100; font-weight: 600; font-size: 10px;">Fat (%)</label>' +
    '<input type="text" class="form-control form-control-sm" id="buffaloFat" placeholder="0.000" step="0.001" min="0" max="100" oninput="window.keepFat(this)" onchange="window.calculateTotal()" onkeyup="window.calculateTotal()" autocomplete="off" style="border: 2px solid #ff9800; font-size: 13px; font-weight: bold; text-align: center; padding: 3px 4px; border-radius: 6px; width: 100%;">' +
    "</div>" +
    '<div style="margin-bottom: 4px;"><label style="color: #e65100; font-weight: 600; font-size: 10px;">SNF (%)</label>' +
    '<input type="text" class="form-control form-control-sm" id="buffaloSnf" placeholder="0.000" step="0.001" min="0" max="100" oninput="window.keepSnf(this)" onchange="window.calculateTotal()" onkeyup="window.calculateTotal()" autocomplete="off" style="border: 2px solid #ff9800; font-size: 13px; font-weight: bold; text-align: center; padding: 3px 4px; border-radius: 6px; width: 100%;">' +
    "</div>" +
    '<div style="background: #e8f5e9; padding: 4px; border-radius: 6px; text-align: center; border: 2px solid #4caf50;">' +
    '<label style="color: #2e7d32; font-weight: bold; font-size: 10px;">Amount</label>' +
    '<div style="font-size: 15px; font-weight: bold; color: #1b5e20;" id="buffaloAmount">₹0.00</div>' +
    "</div></div>";

  // ============================================================
  // COW COLUMN (REDUCED WIDTH FOR MOBILE)
  // ============================================================
  html +=
    '<div class="cow-column" style="flex: 1; min-width: auto; max-width: auto; background: #e3f2fd; padding: 10px; border-radius: 8px; border: 2px solid #2196f3;">' +
    '<h6 style="color: #1565c0; text-align: center; font-weight: bold; font-size: 13px; margin-bottom: 6px;">🐄 Cow</h6>' +
    '<div style="margin-bottom: 4px;"><label style="color: #1565c0; font-weight: 600; font-size: 10px;">Qty (Ltr)</label>' +
    '<input type="text" class="form-control form-control-sm" id="cowQty" placeholder="0.00" step="0.01" min="0" oninput="window.keepMilk(this)" onchange="window.calculateTotal()" onkeyup="window.calculateTotal()" autocomplete="off" style="border: 2px solid #2196f3; font-size: 14px; font-weight: bold; text-align: center; padding: 3px 4px; border-radius: 6px; width: 100%;">' +
    "</div>" +
    '<div style="margin-bottom: 4px;"><label style="color: #1565c0; font-weight: 600; font-size: 10px;">Fat (%)</label>' +
    '<input type="text" class="form-control form-control-sm" id="cowFat" placeholder="0.000" step="0.001" min="0" max="100" oninput="window.keepFat(this)" onchange="window.calculateTotal()" onkeyup="window.calculateTotal()" autocomplete="off" style="border: 2px solid #2196f3; font-size: 13px; font-weight: bold; text-align: center; padding: 3px 4px; border-radius: 6px; width: 100%;">' +
    "</div>" +
    '<div style="margin-bottom: 4px;"><label style="color: #1565c0; font-weight: 600; font-size: 10px;">SNF (%)</label>' +
    '<input type="text" class="form-control form-control-sm" id="cowSnf" placeholder="0.000" step="0.001" min="0" max="100" oninput="window.keepSnf(this)" onchange="window.calculateTotal()" onkeyup="window.calculateTotal()" autocomplete="off" style="border: 2px solid #2196f3; font-size: 13px; font-weight: bold; text-align: center; padding: 3px 4px; border-radius: 6px; width: 100%;">' +
    "</div>" +
    '<div style="background: #e8f5e9; padding: 4px; border-radius: 6px; text-align: center; border: 2px solid #4caf50;">' +
    '<label style="color: #2e7d32; font-weight: bold; font-size: 10px;">Amount</label>' +
    '<div style="font-size: 15px; font-weight: bold; color: #1b5e20;" id="cowAmount">₹0.00</div>' +
    "</div></div>";

  html += "</div></div></div>";

  // ============================================================
  // TOTAL AMOUNT
  // ============================================================
  html +=
    '<div style="background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%); padding: 14px; border-radius: 10px; text-align: center; margin-bottom: 12px; border: 3px solid #4caf50;">' +
    '<label id="totalAmountLabel" style="color: #a5d6a7; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block;">Total Amount (Buffalo + Cow)</label>' +
    '<div style="color: white; font-size: 28px; font-weight: bold;" id="totalAmount">₹0.00</div>' +
    "</div>";

  // ============================================================
  // NOTES
  // ============================================================
  if (showRemarks) {
    html +=
      '<div style="margin-bottom: 10px;">' +
      '<label style="font-weight: 600; font-size: 11px; color: #555;"><i class="fas fa-pencil-alt"></i> Notes</label>' +
      '<textarea class="form-control form-control-sm" id="notes" rows="2" placeholder="Notes / Remarks..." autocomplete="off" style="border: 2px solid #90a4ae; font-size: 14px; padding: 6px 10px; border-radius: 6px; width: 100%;"></textarea>' +
      "</div>";
  }

  // ============================================================
  // BUTTONS
  // ============================================================
  html +=
    '<div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">' +
    '<button type="submit" class="btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px; font-size: 16px; font-weight: bold; border-radius: 10px; width: 100%; cursor: pointer;">' +
    '<i class="fas fa-save me-2"></i> Save Entry</button>' +
    // ✅ View History Button - Calls showCollectionHistory with e and f
    '<button type="button" class="btn" style="background: #ff9800; color: white; border: none; padding: 12px; font-size: 16px; font-weight: bold; border-radius: 10px; width: 100%; cursor: pointer;" onclick="window.viewSupplierHistory()">' +
    '<i class="fas fa-history me-2"></i> View History</button>' +
    "</div>";

  html += "</div>"; // collectionDetails
  html += "</form></div>";

  container.innerHTML = html;

  // ✅ Setup event listeners
  setupCollectionEventListeners();

  // Auto-calculate on load
  setTimeout(function () {
    window.calculateTotal();
  }, 100);
}

// ============================================================
// VIEW SUPPLIER HISTORY - Calls showCollectionHistory with e and f
// ============================================================

window.viewSupplierHistory = function () {
  // ✅ Get supplier e and f
  var supplierEF = getSupplierEF();

  if (!supplierEF) {
    var supplierId = document.getElementById("supplierId")?.value;
    if (!supplierId) {
      showMessageModal("Info", "⚠️ Please select a client first!", false);
      return;
    }
    showMessageModal(
      "Info",
      "⚠️ Supplier data not found! Please try again.",
      false,
    );
    return;
  }

  console.log("📜 Viewing history for supplier:");
  console.log("   Mobile (e):", supplierEF.e);
  console.log("   Relation (f):", supplierEF.f);

  // ✅ Call showCollectionHistory with e and f
  if (typeof window.showCollectionHistory === "function") {
    window.showCollectionHistory(supplierEF.e, supplierEF.f);
  } else {
    showMessageModal("Error", "❌ History module not loaded!", true);
  }
};

// ============================================================
// SETUP COLLECTION EVENT LISTENERS
// ============================================================

function setupCollectionEventListeners() {
  var searchInput = document.getElementById("uniqueIdSearchInput");
  var openBtn = document.getElementById("openSupplierListBtn");

  // ✅ Auto-search on input (as user types)
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchSupplierByUniqueId();
    });
  }

  // ✅ Open supplier list on + button click (only visible when supplier NOT found)
  if (openBtn) {
    openBtn.addEventListener("click", function () {
      window.openSupplierList(
        "commonFnToRunAfter_op_ViewCall_Collection",
        typeof window[my1uzr.worknOnPg].clientConfig?.xtraEiFlds_ei_admin_srchGuest !== "undefined"
          ? window[my1uzr.worknOnPg].clientConfig?.xtraEiFlds_ei_admin_srchGuest
          : null,
      );
    });
  }
}

// ============================================================
// SEARCH SUPPLIER BY UNIQUE ID, NAME OR MOBILE (AUTO-SEARCH)
// ============================================================

async function searchSupplierByUniqueId() {
  var searchInput = document.getElementById("uniqueIdSearchInput");
  var clientDisplay = document.getElementById("clientDisplay");
  var supplierIdField = document.getElementById("supplierId");
  var collectionDetails = document.getElementById("collectionDetails");
  var openBtn = document.getElementById("openSupplierListBtn");

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
    applyAnimalColumnVisibility(null);
    if (collectionDetails) collectionDetails.style.display = "none";
    if (openBtn) openBtn.style.display = "none";
    return;
  }

  // ✅ MINIMUM CHARACTER REQUIREMENT - At least 2 characters for search
  if (searchTerm.length < 2 && searchTerm.indexOf(",") === -1) {
    // Just show typing indicator, don't search
    clientDisplay.value = "⏳ Type at least 2 characters to search...";
    clientDisplay.style.color = "#666";
    clientDisplay.style.background = "#f5f5f5";
    clientDisplay.style.borderColor = "#ff9800";
    supplierIdField.value = "";
    document.getElementById("selectedUniqueId").value = "";
    window._selectedSupplier = null;
    window._selectedAnimalTypes = null;
    applyAnimalColumnVisibility(null);
    if (collectionDetails) collectionDetails.style.display = "none";
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
      // ✅ Single match — fill directly
      foundSupplier = matchedSuppliers[0];
    } else if (matchedSuppliers.length > 1) {
      // ✅ Multiple matches — show dropdown
      var name = matchedSuppliers[0].h || matchedSuppliers[0].i || "Suppliers";
      clientDisplay.value = "📋 Found " + matchedSuppliers.length + " parties — tap to select";
      clientDisplay.style.color = "#1a237e";
      clientDisplay.style.fontWeight = "bold";
      clientDisplay.style.background = "#e3f2fd";
      clientDisplay.style.borderColor = "#2196f3";
      supplierIdField.value = "";
      document.getElementById("selectedUniqueId").value = "";
      window._selectedSupplier = null;
      if (collectionDetails) collectionDetails.style.display = "none";
      if (openBtn) openBtn.style.display = "none";
      window._commaMatchedSuppliers = matchedSuppliers;
      window._commaAnimalTypes = window._selectedAnimalTypes;
      showSupplierDropdown(matchedSuppliers, function (supplier) {
        var clientDisplay = document.getElementById("clientDisplay");
        var supplierIdField = document.getElementById("supplierId");
        var collectionDetails = document.getElementById("collectionDetails");
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
        var animalTypes = window._commaAnimalTypes || null;
        window._selectedAnimalTypes = animalTypes;
        if (collectionDetails) {
          collectionDetails.style.display = "block";
          applyAnimalColumnVisibility(animalTypes);
          setTimeout(function () { window.calculateTotal(); }, 100);
        }
        window._selectedSupplier = supplier;
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

      if (collectionDetails) {
        collectionDetails.style.display = "block";
        applyAnimalColumnVisibility(window._selectedAnimalTypes);
        setTimeout(function () {
          window.calculateTotal();
        }, 100);
      }

      window._selectedSupplier = foundSupplier;
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

      if (collectionDetails) collectionDetails.style.display = "none";
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
        var collectionDetails = document.getElementById("collectionDetails");
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
        if (collectionDetails) {
          collectionDetails.style.display = "block";
          applyAnimalColumnVisibility(null);
          setTimeout(function () {
            window.calculateTotal();
          }, 100);
        }
        window._selectedSupplier = supplier;
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
      if (collectionDetails) collectionDetails.style.display = "none";
      if (openBtn) openBtn.style.display = "none";
      return;
    }
  }

  // ✅ STANDARD SEARCH (Name, Unique ID, Mobile, Local Name)
  window._selectedAnimalTypes = null;

  for (var i = 0; i < allSuppliers.length; i++) {
    var item = allSuppliers[i];
    var isMatch = false;
    var matchType = "";

    // ✅ Check Unique ID (k) - EXACT match (case insensitive)
    if (
      item.k &&
      item.k.toString().toUpperCase() === searchTerm.toUpperCase()
    ) {
      isMatch = true;
      matchType = "Unique ID";
    }
    // ✅ Check Name (h) - STARTS WITH (case insensitive)
    else if (
      item.h &&
      item.h.toLowerCase().startsWith(searchTerm.toLowerCase())
    ) {
      isMatch = true;
      matchType = "Name";
    }
    // ✅ Check Local Name (i) - STARTS WITH (case insensitive)
    else if (
      item.i &&
      item.i.toLowerCase().startsWith(searchTerm.toLowerCase())
    ) {
      isMatch = true;
      matchType = "Local Name";
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
        matchType = "Mobile";
      } else if (
        searchMobile.length >= 6 &&
        cleanMobile.endsWith(searchMobile)
      ) {
        isMatch = true;
        matchType = "Mobile (last digits)";
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

    // ✅ Show milk entry form
    if (collectionDetails) {
      collectionDetails.style.display = "block";
      applyAnimalColumnVisibility(null);
      setTimeout(function () {
        window.calculateTotal();
      }, 100);
    }

    // ✅ Store supplier data for later use
    window._selectedSupplier = foundSupplier;
  } else {
    // ❌ Supplier NOT found - show + button
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

    // ✅ Hide milk entry form
    if (collectionDetails) {
      collectionDetails.style.display = "none";
    }
  }
}

// ============================================================
// APPLY ANIMAL COLUMN VISIBILITY
// ============================================================

function applyAnimalColumnVisibility(types) {
  var buffaloCol = document.querySelector(".buffalo-column");
  var cowCol = document.querySelector(".cow-column");
  var container = document.querySelector(".milk-details-container");
  var totalLabel = document.getElementById("totalAmountLabel");

  if (!types) {
    if (buffaloCol) { buffaloCol.style.display = ""; buffaloCol.style.flex = ""; buffaloCol.style.maxWidth = ""; }
    if (cowCol) { cowCol.style.display = ""; cowCol.style.flex = ""; cowCol.style.maxWidth = ""; }
    if (container) container.style.minWidth = "";
    if (totalLabel) totalLabel.textContent = "Total Amount (Buffalo + Cow)";
    return;
  }

  var showBoth = types.hasCow && types.hasBuffalo;

  if (buffaloCol) {
    buffaloCol.style.display = types.hasBuffalo ? "" : "none";
    buffaloCol.style.flex = types.hasBuffalo ? "1" : "";
    buffaloCol.style.maxWidth = (types.hasBuffalo && !showBoth) ? "100%" : "";
  }
  if (cowCol) {
    cowCol.style.display = types.hasCow ? "" : "none";
    cowCol.style.flex = types.hasCow ? "1" : "";
    cowCol.style.maxWidth = (types.hasCow && !showBoth) ? "100%" : "";
  }
  if (container) {
    container.style.minWidth = showBoth ? "" : "0";
  }
  if (totalLabel) {
    if (showBoth) {
      totalLabel.textContent = "Total Amount (Buffalo + Cow)";
    } else if (types.hasBuffalo) {
      totalLabel.textContent = "Total Amount (Buffalo)";
    } else if (types.hasCow) {
      totalLabel.textContent = "Total Amount (Cow)";
    }
  }
}

// ============================================================
// SAVE SESSION TO LOCALSTORAGE
// ============================================================

window.saveSession = function (value) {
  localStorage.setItem("milk_session_selected", value);
  console.log("✅ Session saved:", value == 1 ? "Morning" : "Evening");
};

// ============================================================
// OPEN SUPPLIER LIST (uses shared window.openSupplierList from mi.js)
// ============================================================

function loadSupplierDetails() {
  var supplierId = document.getElementById("supplierId")?.value;
  var collectionDetails = document.getElementById("collectionDetails");
  var clientDisplay = document.getElementById("clientDisplay");

  if (supplierId && collectionDetails) {
    collectionDetails.style.display = "block";
    setTimeout(function () {
      window.calculateTotal();
    }, 100);
  } else if (collectionDetails) {
    collectionDetails.style.display = "none";
  }
}

// ============================================================
// CALCULATE TOTAL - Buffalo + Cow (Always shows ₹ amount)
// ============================================================

// ============================================================
// CALCULATE TOTAL - Buffalo + Cow (Always shows ₹ amount)
// ============================================================

window.calculateTotal = async function () {
  // ✅ Check if elements exist before accessing
  var buffaloQtyEl = document.getElementById("buffaloQty");
  var buffaloSnfEl = document.getElementById("buffaloSnf");
  var buffaloFatEl = document.getElementById("buffaloFat");
  var cowQtyEl = document.getElementById("cowQty");
  var cowSnfEl = document.getElementById("cowSnf");
  var cowFatEl = document.getElementById("cowFat");
  var buffaloAmountEl = document.getElementById("buffaloAmount");
  var cowAmountEl = document.getElementById("cowAmount");
  var totalAmountEl = document.getElementById("totalAmount");

  // ✅ If any required element is missing, exit silently
  if (
    !buffaloQtyEl ||
    !buffaloSnfEl ||
    !buffaloFatEl ||
    !cowQtyEl ||
    !cowSnfEl ||
    !cowFatEl ||
    !buffaloAmountEl ||
    !cowAmountEl ||
    !totalAmountEl
  ) {
    console.log("⏳ calculateTotal: Form elements not ready yet, skipping...");
    return 0;
  }

  // Calculate Buffalo
  var buffaloQty = parseFloat(buffaloQtyEl.value) || 0;
  var buffaloSnf = parseFloat(buffaloSnfEl.value) || 0;
  var buffaloFat = parseFloat(buffaloFatEl.value) || 0;

  // Calculate Cow
  var cowQty = parseFloat(cowQtyEl.value) || 0;
  var cowSnf = parseFloat(cowSnfEl.value) || 0;
  var cowFat = parseFloat(cowFatEl.value) || 0;

  var buffaloAmount = 0;
  var cowAmount = 0;

  // ✅ Calculate Buffalo amount if qty > 0 and has SNF & Fat
  if (buffaloQty > 0 && buffaloSnf > 0 && buffaloFat > 0) {
    var buffaloPricing = await window.getMatchingPricingRecord(
      1,
      buffaloFat,
      buffaloSnf,
    );
    if (buffaloPricing && buffaloPricing.a > 0) {
      var buffaloPrice = parseFloat(buffaloPricing.i) || 0;
      buffaloAmount = buffaloQty * buffaloPrice;
      console.log("✅ Buffalo price found:", buffaloPrice);
    }
  }

  // ✅ Calculate Cow amount if qty > 0 and has SNF & Fat
  if (cowQty > 0 && cowSnf > 0 && cowFat > 0) {
    var cowPricing = await window.getMatchingPricingRecord(2, cowFat, cowSnf);
    if (cowPricing && cowPricing.a > 0) {
      var cowPrice = parseFloat(cowPricing.i) || 0;
      cowAmount = cowQty * cowPrice;
      console.log("✅ Cow price found:", cowPrice);
    }
  }

  var totalAmount = buffaloAmount + cowAmount;

  // ✅ Update UI - with null checks
  if (buffaloAmountEl) {
    buffaloAmountEl.textContent = "₹" + buffaloAmount.toFixed(2);
    buffaloAmountEl.style.color = "#1b5e20";
  }

  if (cowAmountEl) {
    cowAmountEl.textContent = "₹" + cowAmount.toFixed(2);
    cowAmountEl.style.color = "#1b5e20";
  }

  if (totalAmountEl) {
    totalAmountEl.textContent = "₹" + totalAmount.toFixed(2);
  }

  console.log("🧮 Calculation:");
  console.log("   Buffalo: ₹" + buffaloAmount.toFixed(2));
  console.log("   Cow: ₹" + cowAmount.toFixed(2));
  console.log("   Total: ₹" + totalAmount.toFixed(2));

  return totalAmount;
};
// ============================================================
// VALIDATE BEFORE SUBMIT - Shows Modal Popup
// ============================================================

window.validateAndSubmit = function () {
  // Get Buffalo fields
  var buffaloQtyEl = document.getElementById("buffaloQty");
  var buffaloSnfEl = document.getElementById("buffaloSnf");
  var buffaloFatEl = document.getElementById("buffaloFat");
  var cowQtyEl = document.getElementById("cowQty");
  var cowSnfEl = document.getElementById("cowSnf");
  var cowFatEl = document.getElementById("cowFat");

  // ✅ If elements don't exist, return false
  if (
    !buffaloQtyEl ||
    !buffaloSnfEl ||
    !buffaloFatEl ||
    !cowQtyEl ||
    !cowSnfEl ||
    !cowFatEl
  ) {
    return false;
  }

  var buffaloQty = parseFloat(buffaloQtyEl.value) || 0;
  var buffaloSnf = parseFloat(buffaloSnfEl.value) || 0;
  var buffaloFat = parseFloat(buffaloFatEl.value) || 0;

  var cowQty = parseFloat(cowQtyEl.value) || 0;
  var cowSnf = parseFloat(cowSnfEl.value) || 0;
  var cowFat = parseFloat(cowFatEl.value) || 0;

  // Check if at least one animal has quantity
  if (buffaloQty <= 0 && cowQty <= 0) {
    showMessageModal(
      "Validation",
      "❌ Please enter quantity for at least one animal!",
      true,
    );
    return false;
  }

  // Validate Buffalo
  if (buffaloQty > 0) {
    if (buffaloSnf <= 0) {
      showMessageModal(
        "Validation",
        "❌ Please enter SNF for Buffalo Milk!",
        true,
      );
      buffaloSnfEl.focus();
      return false;
    }
    if (buffaloFat <= 0) {
      showMessageModal(
        "Validation",
        "❌ Please enter Fat % for Buffalo Milk!",
        true,
      );
      buffaloFatEl.focus();
      return false;
    }
  }

  // Validate Cow
  if (cowQty > 0) {
    if (cowSnf <= 0) {
      showMessageModal("Validation", "❌ Please enter SNF for Cow Milk!", true);
      cowSnfEl.focus();
      return false;
    }
    if (cowFat <= 0) {
      showMessageModal(
        "Validation",
        "❌ Please enter Fat % for Cow Milk!",
        true,
      );
      cowFatEl.focus();
      return false;
    }
  }

  // Check supplier and session
  var supplierId = document.getElementById("supplierId")?.value;
  if (!supplierId) {
    showMessageModal("Validation", "❌ Please select a client!", true);
    var clientDisplay = document.getElementById("clientDisplay");
    if (clientDisplay) clientDisplay.focus();
    return false;
  }

  var sessionRadio = document.querySelector('input[name="session"]:checked');
  if (!sessionRadio) {
    showMessageModal("Validation", "❌ Please select a session!", true);
    return false;
  }

  return true;
};

// ============================================================
// SUBMIT NEW COLLECTION RECORD - Multiple Animals
// ============================================================

window.submitMilkCollection = async function (event) {
  event.preventDefault();
  // ✅ Use modal validation
  if (!window.validateAndSubmit()) {
    return;
  }

  // ✅ Ensure pricing data exists — sync from server if mb table is empty
  var pricingRecords = await dbDexieManager.getAllRecords(dbnm, "mb");
  if (!pricingRecords || pricingRecords.length === 0) {
    var hasPricing = await window.syncPricingFromServer(true);
    if (!hasPricing) {
      showMessageModal(
        "Pricing Required",
        "❌ No pricing records found!\n\nPlease add pricing first (Pricing tab → Save Entry) before recording milk collections.",
        true,
      );
      return;
    }
  }

  // Get common fields
  var collectionDate = document.getElementById("collectionDate")?.value;
  var collectionTime = document.getElementById("collectionTime")?.value;
  var sessionRadio = document.querySelector('input[name="session"]:checked');
  var sessionNumber = sessionRadio ? parseInt(sessionRadio.value) : 0;
  var supplierId = document.getElementById("supplierId").value;
  var clientDisplay = document.getElementById("clientDisplay");
  var supplierName = clientDisplay ? clientDisplay.value : "Unknown";

  // Get Buffalo fields
  var buffaloQty =
    parseFloat(document.getElementById("buffaloQty")?.value) || 0;
  var buffaloSnf =
    parseFloat(document.getElementById("buffaloSnf")?.value) || 0;
  var buffaloFat =
    parseFloat(document.getElementById("buffaloFat")?.value) || 0;

  // Get Cow fields
  var cowQty = parseFloat(document.getElementById("cowQty")?.value) || 0;
  var cowSnf = parseFloat(document.getElementById("cowSnf")?.value) || 0;
  var cowFat = parseFloat(document.getElementById("cowFat")?.value) || 0;

  // Get date
  var now;
  if (collectionDate) {
    var dateTimeStr = collectionDate + "T" + (collectionTime || "00:00");
    now = new Date(dateTimeStr);
  } else {
    now = new Date();
  }

  // ✅ BUILD PAYLOAD ARRAY - Only include animals with qty > 0
  var payloadEntries = [];
  var totalAllAmount = 0;
  var savedEntries = [];
  var hasValidEntry = false;

  // Process Buffalo
  if (buffaloQty > 0) {
    // Get pricing record
    var buffaloPricing = await window.getMatchingPricingRecord(
      1,
      buffaloFat,
      buffaloSnf,
    );

    if (!buffaloPricing || buffaloPricing.a === 0) {
      showMessageModal(
        "Validation",
        "❌ No pricing record found for Buffalo with SNF: " +
          buffaloSnf +
          " and Fat: " +
          buffaloFat +
          ". Please check the values.",
        true,
      );
      return;
    }

    var buffaloPricingId = buffaloPricing.a;
    var buffaloPricePerLiter = parseFloat(buffaloPricing.i) || 0;
    var buffaloAmount = buffaloQty * buffaloPricePerLiter;
    totalAllAmount += buffaloAmount;

    var buffaloEntry = {
      e: parseInt(supplierId) || 0,
      f: formatDateYYYYMMDD(now),
      g: sessionNumber,
      h: 1,
      i: parseFloat(buffaloQty.toFixed(2)),
      j: parseFloat(buffaloAmount.toFixed(2)),
      k: buffaloPricingId,
    };
    payloadEntries.push(buffaloEntry);
    savedEntries.push(
      "🐃 Buffalo: " +
        window.fmtMilk(buffaloQty) +
        " Ltr @ ₹" +
        buffaloPricePerLiter.toFixed(2) +
        " = ₹" +
        buffaloAmount.toFixed(2),
    );
    hasValidEntry = true;
  }

  // Process Cow
  if (cowQty > 0) {
    // Get pricing record
    var cowPricing = await window.getMatchingPricingRecord(2, cowFat, cowSnf);

    if (!cowPricing || cowPricing.a === 0) {
      showMessageModal(
        "Validation",
        "❌ No pricing record found for Cow with SNF: " +
          cowSnf +
          " and Fat: " +
          cowFat +
          ". Please check the values.",
        true,
      );
      return;
    }

    var cowPricingId = cowPricing.a;
    var cowPricePerLiter = parseFloat(cowPricing.i) || 0;
    var cowAmount = cowQty * cowPricePerLiter;
    totalAllAmount += cowAmount;

    var cowEntry = {
      e: parseInt(supplierId) || 0,
      f: formatDateYYYYMMDD(now),
      g: sessionNumber,
      h: 2,
      i: parseFloat(cowQty.toFixed(2)),
      j: parseFloat(cowAmount.toFixed(2)),
      k: cowPricingId,
    };
    payloadEntries.push(cowEntry);
    savedEntries.push(
      "🐄 Cow: " +
        window.fmtMilk(cowQty) +
        " Ltr @ ₹" +
        cowPricePerLiter.toFixed(2) +
        " = ₹" +
        cowAmount.toFixed(2),
    );
    hasValidEntry = true;
  }

  // ✅ If no valid entries, show message and return
  if (!hasValidEntry) {
    showMessageModal(
      "Validation",
      "❌ No entries to save. Please enter valid milk entries.",
      true,
    );
    return;
  }

  // ✅ SEND TO SERVER - payload0.p = ARRAY
  clearPayload0();
  payload0.p = payloadEntries;
  payload0.vw = 1;
  payload0.fn = 73;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "mi" }]);

  var serverSaved = false;
  var serverMessage = "";

  try {
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
      console.log("📥 Server:", response);

      if (response && response.su == 1) {
        await handl_mi_rspons(response, 0);
        serverSaved = true;
        serverMessage = response.ms || "Saved successfully!";
      } else if (response) {
        serverMessage = response.ms || "Server rejected the entry.";
        if (response.fn3 && response.fn3.r) {
          for (var ri = 0; ri < response.fn3.r.length; ri++) {
            if (response.fn3.r[ri].ms)
              serverMessage += "\n" + response.fn3.r[ri].ms;
          }
        }
      }
    } else {
      serverMessage = "fnj3 not available - saved locally only.";
    }
  } catch (err) {
    serverMessage = "Server unreachable: " + err.message;
  }

  if (serverSaved) {
    // Update local storage
    var collections = JSON.parse(
      localStorage.getItem("milk_collections") || "[]",
    );
    for (var j = 0; j < payloadEntries.length; j++) {
      collections.push(payloadEntries[j]);
    }
    localStorage.setItem("milk_collections", JSON.stringify(collections));

    // Update milk_persons
    if (window.milk_persons) {
      for (var k = 0; k < window.milk_persons.length; k++) {
        if (
          window.milk_persons[k].a == supplierId ||
          window.milk_persons[k].k == supplierId
        ) {
          // Calculate total quantity and amount from all entries
          var totalQty = 0;
          var totalAmt = 0;
          for (var m = 0; m < payloadEntries.length; m++) {
            totalQty += parseFloat(payloadEntries[m].i) || 0;
            totalAmt += parseFloat(payloadEntries[m].j) || 0;
          }
          window.milk_persons[k].totalMilk =
            (parseFloat(window.milk_persons[k].totalMilk) || 0) + totalQty;
          window.milk_persons[k].totalAmount =
            (parseFloat(window.milk_persons[k].totalAmount) || 0) + totalAmt;
          break;
        }
      }
    }

    var successMsg =
      "✅ Entry saved!\n\n" +
      supplierName +
      "\nDate: " +
      formatDateYYYYMMDD(now) +
      "\nSession: " +
      (sessionNumber == 1 ? "Morning" : "Evening") +
      "\n\n" +
      savedEntries.join("\n") +
      "\n\n" +
      "─".repeat(30) +
      "\nTotal Amount: ₹" +
      totalAllAmount.toFixed(2);

    showShareableModal("Success", successMsg, false);

    // Reset form but keep session and supplier
    if (document.getElementById("buffaloQty"))
      document.getElementById("buffaloQty").value = "";
    if (document.getElementById("buffaloSnf"))
      document.getElementById("buffaloSnf").value = "";
    if (document.getElementById("buffaloFat"))
      document.getElementById("buffaloFat").value = "";
    if (document.getElementById("buffaloAmount")) {
      document.getElementById("buffaloAmount").textContent = "₹0.00";
      document.getElementById("buffaloAmount").style.color = "#1b5e20";
    }
    if (document.getElementById("cowQty"))
      document.getElementById("cowQty").value = "";
    if (document.getElementById("cowSnf"))
      document.getElementById("cowSnf").value = "";
    if (document.getElementById("cowFat"))
      document.getElementById("cowFat").value = "";
    if (document.getElementById("cowAmount")) {
      document.getElementById("cowAmount").textContent = "₹0.00";
      document.getElementById("cowAmount").style.color = "#1b5e20";
    }
    if (document.getElementById("totalAmount"))
      document.getElementById("totalAmount").textContent = "₹0.00";
    if (document.getElementById("notes"))
      document.getElementById("notes").value = "";
  } else {
    showMessageModal(
      "Error",
      "❌ Entry NOT saved!\n\n" +
        serverMessage +
        "\n\nPlease check and try again.",
      true,
    );
  }
};

// ============================================================
// SHAREABLE MODAL - Share (WhatsApp + SMS) + OK
// ============================================================

function showShareableModal(title, message, isError) {
  var mid = "shareModal_" + Date.now();
  var encodedMsg = encodeURIComponent(message);
  var whatsappUrl = "https://wa.me/?text=" + encodedMsg;
  var smsUrl = "sms:?body=" + encodedMsg;

  var sharePanelId = mid + "_sharePanel";

  var sharePanelHtml =
    '<div id="' +
    sharePanelId +
    '" style="display:none; background:#f0f4ff; border:2px solid #667eea; border-radius:10px; padding:10px; margin-bottom:10px; text-align:center;">' +
    '<label style="color:#667eea; font-weight:bold; font-size:12px; display:block; margin-bottom:8px;">Share via</label>' +
    '<div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">' +
    '<a href="' +
    whatsappUrl +
    '" target="_blank" style="background:#25d366; color:#fff; border:none; padding:8px 18px; border-radius:8px; font-weight:bold; text-decoration:none; font-size:14px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">' +
    '<i class="fab fa-whatsapp" style="font-size:16px;"></i> WhatsApp</a>' +
    '<a href="' +
    smsUrl +
    '" style="background:#2196f3; color:#fff; border:none; padding:8px 18px; border-radius:8px; font-weight:bold; text-decoration:none; font-size:14px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">' +
    '<i class="fas fa-sms" style="font-size:16px;"></i> SMS</a>' +
    "</div></div>";

  var footerHtml =
    '<div class="modal-footer" style="display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap;">' +
    '<button class="btn btn-sm" id="' +
    mid +
    '_shareBtn" style="background:#667eea; color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:bold; cursor:pointer;">' +
    '<i class="fas fa-share-alt me-1"></i> Share</button>' +
    '<button class="btn btn-secondary btn-sm" data-bs-dismiss="modal" style="padding:8px 16px; border-radius:8px; font-weight:bold; cursor:pointer;">OK</button>' +
    "</div>";

  var div = document.createElement("div");
  div.innerHTML =
    '<div class="modal fade" id="' +
    mid +
    '" tabindex="-1">' +
    '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' +
    '<div class="modal-header" style="background:' +
    (isError ? "#dc3545" : "#28a745") +
    ';color:#fff;">' +
    '<h6 class="modal-title">' +
    title +
    "</h6>" +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>' +
    '<div class="modal-body" style="white-space:pre-wrap;">' +
    message +
    "</div>" +
    sharePanelHtml +
    footerHtml +
    "</div></div></div>";
  document.body.appendChild(div);

  var modalEl = document.getElementById(mid);
  var m = new bootstrap.Modal(modalEl);
  m.show();

  document
    .getElementById(mid + "_shareBtn")
    .addEventListener("click", function () {
      var panel = document.getElementById(sharePanelId);
      if (panel.style.display === "none") {
        panel.style.display = "block";
      } else {
        panel.style.display = "none";
      }
    });

  modalEl.addEventListener("hidden.bs.modal", function () {
    this.remove();
  });
}

// ============================================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================

window.showMilkCollectionForm = showMilkCollectionForm;
window.loadSupplierDetails = loadSupplierDetails;
window.submitMilkCollection = submitMilkCollection;
window.showShareableModal = showShareableModal;

console.log("🥛 Milk collection form ready with multiple animal support!");
