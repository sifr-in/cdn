// mlkPricg.js - Milk Quality Check (SNF & Fat)

window.initMilkPricing = function () {
  console.log("✅ Milk Pricing module initialized");
};

window.showMilkPricing = function () {
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
  var dateTimeStr = currentDate + " " + currentTime;

  var html = "";

  html +=
    '<div class="milk-card">';

  html +=
    '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 15px; border-radius: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">';
  html +=
    '<h5 class="mb-0"><i class="fas fa-flask"></i> Milk Quality Check</h5>';
  html +=
    '<span style="font-size: 13px;"><i class="far fa-clock"></i> ' +
    dateTimeStr +
    "</span>";
  html += "</div>";

  html +=
    "<style>#pricingSNF::placeholder, #pricingFat::placeholder, #pricingPrice::placeholder { opacity: 0.4; font-weight: normal; }</style>";

  html +=
    '<form onsubmit="window.submitMilkPricing(event)" autocomplete="off">';

  // Date Input
  html +=
    '<div style="background: #e8eaf6; padding: 12px 15px; border-radius: 10px; border: 2px solid #5c6bc0; margin-bottom: 15px;">';
  html +=
    '<label class="form-label fw-bold" style="color: #5c6bc0; font-size: 12px;"><i class="fas fa-calendar"></i> Date *</label>';
  html +=
    '<input type="date" class="form-control" id="pricingDate" value="' +
    formatDateYYYYMMDD(new Date()) +
    '" required style="border: 2px solid #5c6bc0; border-radius: 8px; padding: 10px; font-size: 14px;">';
  html += "</div>";

  // Animal Selection
  html +=
    '<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; border: 2px solid #4caf50; margin-bottom: 15px;">';
  html +=
    '<label class="form-label fw-bold" style="color: #2e7d32;"><i class="fas fa-paw"></i> Select Animal *</label>';
  html += '<div style="display: flex; gap: 15px; flex-wrap: wrap;">';
  html +=
    '<label style="background: var(--surface-3); padding: 10px 15px; border-radius: 8px; border: 2px solid #c8e6c9; cursor: pointer;">';
  html +=
    '<input type="radio" value="1" name="pricingAnimal" required> 🐃 Buffalo</label>';
  html +=
    '<label style="background: var(--surface-3); padding: 10px 15px; border-radius: 8px; border: 2px solid #c8e6c9; cursor: pointer;">';
  html +=
    '<input type="radio" value="2" name="pricingAnimal" required> 🐄 Cow</label>';
  html += "</div></div>";

  // SNF, Fat, Price Per Liter Row
  html +=
    '<div style="background: #fce4ec; padding: 15px; border-radius: 10px; border: 2px solid #e91e63; margin-bottom: 15px;">';
  html += '<div class="row g-3">';
  html += '<div class="col-12 col-md-4">';
  html +=
    '<label class="form-label fw-bold" style="color: #764ba2; font-size: 12px;"><i class="fas fa-percent"></i> FAT *</label>';
  html +=
    '<input type="text" class="form-control text-center fw-bold" id="pricingFat" placeholder="0.000" step="0.001" min="0" oninput="window.keepFat(this)" required style="border: 2px solid #e91e63; font-size: 16px; padding: 8px;">';
  html += "</div>";
  html += '<div class="col-12 col-md-4">';
  html +=
    '<label class="form-label fw-bold" style="color: #764ba2; font-size: 12px;"><i class="fas fa-flask"></i> SNF *</label>';
  html +=
    '<input type="text" class="form-control text-center fw-bold" id="pricingSNF" placeholder="0.000" step="0.001" min="0" oninput="window.keepSnf(this)" required style="border: 2px solid #e91e63; font-size: 16px; padding: 8px;">';
  html += "</div>";
  html += '<div class="col-12 col-md-4">';
  html +=
    '<label class="form-label fw-bold" style="color: #764ba2; font-size: 12px;"><i class="fas fa-rupee-sign"></i> Price/Ltr *</label>';
  html +=
    '<input type="text" class="form-control text-center fw-bold" id="pricingPrice" placeholder="0.00" step="0.01" min="0" required style="border: 2px solid #e91e63; font-size: 16px; padding: 8px;">';
  html += "</div>";
  html += "</div></div>";

  // Note
  html += '<div class="mb-3">';
  html +=
    '<label class="form-label fw-bold" style="font-size: 12px; color: #555;">📝 Note</label>';
  html +=
    '<textarea class="form-control" id="pricingNote" rows="2" placeholder="Any remarks..." style="border: 2px solid #ddd; border-radius: 8px;"></textarea>';
  html += "</div>";

  // Buttons Row
  html += '<div class="row g-2 mb-3">';
  html += '<div class="col-4">';
  html +=
    '<button type="submit" class="btn w-100" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 10px; font-size: 14px; font-weight: bold; border-radius: 10px;">';
  html += '<i class="fas fa-save"></i> Save</button>';
  html += "</div>";
  html += '<div class="col-4">';
  html +=
    '<button type="button" class="btn w-100" style="background: #ff9800; color: white; border: none; padding: 10px; font-size: 14px; font-weight: bold; border-radius: 10px;" onclick="window.showPricingHistory()">';
  html += '<i class="fas fa-history"></i> History</button>';
  html += "</div>";
  html += '<div class="col-4">';
  html +=
    '<button type="button" class="btn w-100" style="background: #ff5722; color: white; border: none; padding: 10px; font-size: 14px; font-weight: bold; border-radius: 10px;" onclick="window.showImportPricing()">';
  html += '<i class="fas fa-file-import"></i> Import</button>';
  html += "</div>";
  html += "</div>";

  html += "</form></div>";

  container.innerHTML = html;
};

// ============================================================
// SHOW PRICING HISTORY
// ============================================================

window.showPricingHistory = async function () {
  try {
    var allRecords = await dbDexieManager.getAllRecords(dbnm, "mb");

    allRecords.sort(function (a, b) {
      return new Date(b.e) - new Date(a.e);
    });

    var html = `
      <div id="pricingHistoryModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;">
        <div style="background:var(--surface); border-radius:15px; max-width:750px; width:100%; max-height:80vh; overflow:hidden; display:flex; flex-direction:column;">
          <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:15px 20px; border-radius:15px 15px 0 0; display:flex; justify-content:space-between; align-items:center;">
            <h5 class="mb-0"><i class="fas fa-history me-2"></i>Pricing History (${allRecords.length})</h5>
            <button onclick="window.closeModal('pricingHistoryModal')" style="background:transparent; border:none; color:white; font-size:24px; cursor:pointer;">&times;</button>
          </div>
          <div style="padding:15px; overflow-y:auto; flex:1;">
    `;

    if (allRecords.length === 0) {
      html += `<p style="text-align:center;color:#999;padding:30px;">No pricing records found</p>`;
    } else {
      html += `
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th style="padding:8px 6px; text-align:center; border-bottom:2px solid #667eea;">Date</th>
                <th style="padding:8px 6px; text-align:center; border-bottom:2px solid #667eea;">Animal</th>
                <th style="padding:8px 6px; text-align:center; border-bottom:2px solid #667eea;">SNF</th>
                <th style="padding:8px 6px; text-align:center; border-bottom:2px solid #667eea;">FAT</th>
                <th style="padding:8px 6px; text-align:center; border-bottom:2px solid #667eea;">Price</th>
                <th style="padding:8px 6px; text-align:center; border-bottom:2px solid #667eea;">Action</th>
              </tr>
            </thead>
            <tbody>
      `;

      allRecords.forEach(function (record) {
        var dateObj = new Date(record.e);
        var formattedDate =
          String(dateObj.getDate()).padStart(2, "0") +
          "-" +
          String(dateObj.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(dateObj.getFullYear());
        var animalName = record.f == 1 ? "Buffalo" : "Cow";

        html += `
          <tr>
            <td style="padding:6px 4px; text-align:center; border-bottom:1px solid #eee;">${formattedDate}</td>
            <td style="padding:6px 4px; text-align:center; border-bottom:1px solid #eee;">${animalName}</td>
            <td style="padding:6px 4px; text-align:center; border-bottom:1px solid #eee;">${window.fmtSnf(parseFloat(record.h || "0"))}</td>
            <td style="padding:6px 4px; text-align:center; border-bottom:1px solid #eee;">${window.fmtFat(parseFloat(record.g || "0"))}</td>
            <td style="padding:6px 4px; text-align:center; border-bottom:1px solid #eee;">₹${record.i ? parseFloat(record.i).toFixed(2) : "0.00"}</td>
            <td style="padding:6px 4px; text-align:center; border-bottom:1px solid #eee;">
              <button onclick="window.editPricingRecord(${record.a})" style="background:#667eea; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:11px;">
                <i class="fas fa-edit"></i> Edit
              </button>
            </td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;
    }

    html += `
          </div>
        </div>
      </div>
    `;

    var div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div.firstElementChild);
  } catch (error) {
    console.error("Error loading pricing history:", error);
    showMessageModal(
      "Error",
      "❌ Failed to load history: " + error.message,
      true,
    );
  }
};

// ============================================================
// EDIT PRICING RECORD
// ============================================================

window.editPricingRecord = function (recordId) {
  var historyModal = document.getElementById("pricingHistoryModal");
  if (historyModal) historyModal.remove();

  dbDexieManager.getAllRecords(dbnm, "mb").then(function (records) {
    var record = records.find(function (r) {
      return r.a == recordId;
    });
    if (!record) {
      showMessageModal("Error", "❌ Record not found!", true);
      return;
    }

    var html = `
      <div id="editPricingModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:99999; display:flex; align-items:center; justify-content:center; padding:20px;">
        <div style="background:var(--surface); border-radius:15px; max-width:500px; width:100%; max-height:90vh; overflow-y:auto;">
          <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:15px 20px; border-radius:15px 15px 0 0; display:flex; justify-content:space-between; align-items:center;">
            <h5 class="mb-0"><i class="fas fa-edit me-2"></i>Edit Pricing Record</h5>
            <button onclick="window.closeModal('editPricingModal')" style="background:transparent; border:none; color:white; font-size:24px; cursor:pointer;">&times;</button>
          </div>
          <div style="padding:20px;">
            <form id="editPricingForm" onsubmit="window.updatePricingRecord(event, ${record.a})">
              <div class="mb-3">
                <label style="font-weight:600; font-size:12px;">📅 Date *</label>
                <input type="date" class="form-control" id="editPricingDate" value="${record.e}" required>
              </div>
              <div class="mb-3">
                <label style="font-weight:600; font-size:12px;">🐄 Animal *</label>
                <select class="form-select" id="editPricingAnimal" required>
                  <option value="1" ${record.f == 1 ? "selected" : ""}>🐃 Buffalo</option>
                  <option value="2" ${record.f == 2 ? "selected" : ""}>🐄 Cow</option>
                </select>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-4">
                  <label style="font-weight:600; font-size:12px;">SNF *</label>
                  <input type="text" class="form-control" id="editPricingSNF" value="${window.fmtSnf(parseFloat(record.h || "0"))}" step="0.001" oninput="window.keepSnf(this)" required>
                </div>
                <div class="col-4">
                  <label style="font-weight:600; font-size:12px;">FAT *</label>
                  <input type="text" class="form-control" id="editPricingFat" value="${window.fmtFat(parseFloat(record.g || "0"))}" step="0.001" oninput="window.keepFat(this)" required>
                </div>
                <div class="col-4">
                  <label style="font-weight:600; font-size:12px;">Price/Ltr *</label>
                  <input type="text" class="form-control" id="editPricingPrice" value="${record.i ? parseFloat(record.i).toFixed(2) : "0.00"}" step="0.01" required>
                </div>
              </div>
              <div class="mb-3">
                <label style="font-weight:600; font-size:12px;">📝 Note</label>
                <textarea class="form-control" id="editPricingNote" rows="2">${record.j || ""}</textarea>
              </div>
              <div class="row g-2">
                <div class="col-6">
                  <button type="button" class="btn btn-secondary w-100" onclick="window.closeModal('editPricingModal')">Cancel</button>
                </div>
                <div class="col-6">
                  <button type="submit" class="btn w-100" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border:none; padding:10px; font-weight:bold; border-radius:8px;">
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
// UPDATE PRICING RECORD - Send ALL fields (no _70 suffix)
// ============================================================

window.updatePricingRecord = async function (event, recordId) {
  event.preventDefault();

  var allRecords = await dbDexieManager.getAllRecords(dbnm, "mb");
  var originalRecord = allRecords.find(function (r) {
    return r.a == recordId;
  });
  if (!originalRecord) {
    showMessageModal("Error", "❌ Record not found!", true);
    return;
  }

  var newDate = document.getElementById("editPricingDate").value;
  var newAnimal = parseInt(document.getElementById("editPricingAnimal").value);
  var newSnf = parseFloat(document.getElementById("editPricingSNF").value) || 0;
  var newFat = parseFloat(document.getElementById("editPricingFat").value) || 0;
  var newPrice =
    parseFloat(document.getElementById("editPricingPrice").value) || 0;
  var newNote = document.getElementById("editPricingNote").value || "";

  if (!newDate) {
    showMessageModal("Validation", "❌ Please select a date!", true);
    return;
  }
  if (!newAnimal) {
    showMessageModal("Validation", "❌ Please select an animal!", true);
    return;
  }
  if (newSnf <= 0) {
    showMessageModal("Validation", "❌ Please enter valid SNF!", true);
    return;
  }
  if (newFat <= 0) {
    showMessageModal("Validation", "❌ Please enter valid FAT!", true);
    return;
  }
  if (newPrice <= 0) {
    showMessageModal("Validation", "❌ Please enter valid Price!", true);
    return;
  }

  // ============================================================
  // Send ALL fields (no _70 suffix) - Same as insert format
  // ============================================================
  var endpointData = {
    a: recordId,
    e: newDate,
    f: newAnimal,
    g: parseFloat(newFat.toFixed(3)),
    h: parseFloat(newSnf.toFixed(3)),
    i: parseFloat(newPrice.toFixed(2)),
    j: newNote,
  };

  console.log(
    "📤 Update Payload (ALL fields):",
    JSON.stringify(endpointData, null, 2),
  );

  clearPayload0();

  payload0.p = endpointData;
  payload0.vw = 1;
  payload0.fn = 74;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "mb" }]);

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
      console.log("📥 Server response:", response);

      if (response && response.su == 1) {
        // ✅ Server success - update local database
        await handl_mi_rspons(response, 0);

        window.closeModal("editPricingModal");

        showMessageModal(
          "Success",
          "✅ Pricing record updated successfully!",
          false,
        );

        var historyModal = document.getElementById("pricingHistoryModal");
        if (historyModal) {
          window.showPricingHistory();
        }
      } else {
        // ❌ Server rejected (su = 0) - DO NOT update local
        var errMsg = response
          ? response.ms || "Server rejected the update."
          : "Unknown error";
        showMessageModal("Error", "❌ Update failed!\n\n" + errMsg, true);
        // IMPORTANT: Return here to stop execution
        return;
      }
    } else {
      showMessageModal("Error", "❌ fnj3 function not available!", true);
      return;
    }
  } catch (err) {
    console.error("Error updating:", err);
    showMessageModal("Error", "❌ Server error: " + err.message, true);
    // IMPORTANT: Return here to stop execution
    return;
  }
};
// ============================================================
// SUBMIT NEW PRICING RECORD
// ============================================================

window.submitMilkPricing = async function (event) {
  event.preventDefault();

  var animalRadio = document.querySelector(
    'input[name="pricingAnimal"]:checked',
  );
  var animal = animalRadio ? parseInt(animalRadio.value) : 0;
  var snf = parseFloat(document.getElementById("pricingSNF").value) || 0;
  var fat = parseFloat(document.getElementById("pricingFat").value) || 0;
  var price = parseFloat(document.getElementById("pricingPrice").value) || 0;
  var note = document.getElementById("pricingNote").value || "";
  var pricingDate =
    document.getElementById("pricingDate").value ||
    formatDateYYYYMMDD(new Date());

  if (!animal) {
    showMessageModal("Validation", "❌ Please select an animal!", true);
    return;
  }
  if (!snf || snf <= 0) {
    showMessageModal("Validation", "❌ Please enter valid SNF!", true);
    return;
  }
  if (!fat || fat <= 0) {
    showMessageModal("Validation", "❌ Please enter valid FAT!", true);
    return;
  }
  if (!price || price <= 0) {
    showMessageModal(
      "Validation",
      "❌ Please enter valid Price per Liter!",
      true,
    );
    return;
  }
  if (!pricingDate) {
    showMessageModal("Validation", "❌ Please select a date!", true);
    return;
  }

  // Insert uses normal field names (no _70 suffix)
  var endpointData = {
    e: pricingDate,
    f: animal,
    g: parseFloat(fat.toFixed(3)),
    h: parseFloat(snf.toFixed(3)),
    i: parseFloat(price.toFixed(2)),
    j: note || "",
  };

  clearPayload0();

  payload0.p = [endpointData];
  payload0.vw = 1;
  payload0.fn = 71;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "mb" }]);

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
      console.log("📥 Server response:", response);

      if (response && response.su == 1) {
        await handl_mi_rspons(response, 0);

        var animalName = animal === 1 ? "Buffalo" : "Cow";
        showMessageModal(
          "Success",
          "✅ Pricing record saved!\n\n" +
            "Animal: " +
            animalName +
            "\nSNF: " +
            snf.toFixed(3) +
            "\nFAT: " +
            fat.toFixed(3) +
            "\nPrice: ₹" +
            price.toFixed(2),
          false,
        );
        window.showMilkPricing();
      } else {
        var errMsg = response
          ? response.ms || "Server rejected"
          : "Unknown error";
        showMessageModal("Error", "❌ Save failed!\n\n" + errMsg, true);
      }
    } else {
      showMessageModal(
        "Error",
        "❌ Cannot save: Server connection not available.",
        true,
      );
    }
  } catch (err) {
    console.error("Error saving:", err);
    showMessageModal("Error", "❌ Server error: " + err.message, true);
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

console.log("💰 Milk Quality Check loaded");
