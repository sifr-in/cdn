// ks.js - Court Case Register
const tblsRequired = ["f", "fp", "mi", "r", "mb", "c"];//mb:milk Prices, mi:Milk collection, r: payments
const moduLst = [
 { a: ",89,", b: "Dashboard", c: "fa-chart-line", d: "window.toggleAdminPanel()", e: "#0d6efd" },
 { a: ",23,", b: "Milk Payment Form", c: "fa-money-bill-wave", d: "window.toggleAdminPanel(7)", e: "#0d6efd" },
 { a: ",72,73,", b: "Milk Collection Form", c: "fa-cow", d: "window.toggleAdminPanel(1)", e: "#198754" },
 { a: ",74,71,", b: "Milk Pricing", c: "fa-tags", d: "window.toggleAdminPanel(6)", e: "#ffc107" },
 { a: ",  71,", b: "Import Pricing", c: "fa-file-import", d: "window.toggleAdminPanel(6)", e: "#fd7e14" },
 { a: ",75,87,", b: "History", c: "fa-clock-rotate-left", d: "window.toggleAdminPanel(3)", e: "#6c757d" },
 { a: ",-11,-12,", b: "Milk Sangha Form", c: "fa-users", d: "window.toggleAdminPanel(9)", e: "#6f42c1" }
];
const cust_const = [
 {
  "a": "showClntReckonInTbl", "b": 1, "c": "more customiztaion", "d": "show milk reckonning to milker in table view", "u": "url-explaining-video"
 },
 {
  "a": "milkDeci", "b": 2, "c": "more cust", "d": "show milk collection in given digits", "u": "url"
 },
 {
  "a": "fatDeci", "b": 1, "c": "", "d": "show fat in given digits", "u": "url"
 },
 {
  "a": "snfDeci", "b": 1, "c": "", "d": "show snf in given digits", "u": "url"
 },
 {
  "a": "rfrshAfternoonTT", "b": 15, "c": "", "d": "restriction to refresh collection afternoon-data after given time", "u": "url"
 },
 {
  "a": "rfrshNightTT", "b": 21, "c": "", "d": "restriction to refresh collection night-data after given time", "u": "url"
 },
 {
  "a": "reptsDrpdnOrFT", "b": 1, "c": "", "d": "at bill/reports modal show dropdown or From-To fillter", "u": "url"
 },
 {
  "a": "reptsTB", "b": 31, "c": "", "d": "at bill/reports dropdown condition for tb by ", "u": "url"
 },
 {
  "a": "seprateIdCowBuffelo", "b": 1, "c": "", "d": "when adding a party if his cow & bufellow code is separate, this is used; 2 unique ids can be created", "u": "url"
 }
];
if (typeof window.closeModal !== "function") {
 window.closeModal = function (modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
   if (modal._escHandler) document.removeEventListener("keydown", modal._escHandler);
   modal.remove();
  }
 };
}

moduLst.hook = "onModuLstAllowed";
window[my1uzr.worknOnPg].moduLst = moduLst;
window[my1uzr.worknOnPg].onModuLstAllowed = function (allowedModules) {
 window[my1uzr.worknOnPg].allowedModulesMenuItems = allowedModules || [];
 delete allowedModules.hook;
 if (allowedModules?.length > 0) {
  var mc = document.getElementById("milkContent");
  if (mc) mc.style.display = "block";
  var dash = document.getElementById("supplierDashboard");
  if (dash) dash.style.display = "block";
  if (
   typeof window.checkAndLoadSupplierData === "function" &&
   !window[my1uzr.worknOnPg]._supPortalDataLoaded
  ) {
   window[my1uzr.worknOnPg]._supPortalDataLoaded = 1;
   window.checkAndLoadSupplierData();
  }
  if (typeof window.initAutoRefresh === "function") {
   window.initAutoRefresh();
  }
 }
};

const sho_da_tkLimit = 1;
let appData = {};
const ids_of_views = [3];
let tblFailureCount = 1;
const cacheStrategy = 1;
const dontShoLoginConfirmation = 1;
const dontRestartAfterLogin = 1;
let seprateIdCowBuffelo = 0;
window[my1uzr.worknOnPg].changeToView = "";
window[my1uzr.worknOnPg].colsToHide = "n,";
window[my1uzr.worknOnPg].colsToHidePartyDetails = "";
window.fnCombineCowBuffalo = function (...obj) {
  const tsrrh = obj[0];
  const tsrrfpay = obj[1];
  console.log(obj);
  const result = "," + Object.values(tsrrh).join(",") + ",";
  return result;
};

window.fnSeparateCowBuffalo = function (storedVal) {
 if (!storedVal || typeof storedVal !== "string") return {};
 var parts = storedVal.split(",").filter(function (v) { return v !== ""; });
 return { a: parts[0] || "", b: parts[1] || "" };
};

window.showSupplierDropdown = function (suppliers, onSelect) {
 var dropdown = document.getElementById("supplierDropdown");
 if (!dropdown) return;
 dropdown.innerHTML = "";
 for (var di = 0; di < suppliers.length; di++) {
  var s = suppliers[di];
  var sName = s.h || s.i || "Unnamed";
  var sPhone = s.e || "";
  var sK = s.k || "";
  var row = document.createElement("div");
  row.style.cssText = "padding:8px 12px; cursor:pointer; border-bottom:1px solid #e0e0e0; font-size:13px; display:flex; align-items:center; gap:8px;";
  row.onmouseenter = function () { this.style.background = "#e8f5e9"; };
  row.onmouseleave = function () { this.style.background = ""; };
  row.innerHTML =
   '<span style="font-weight:bold; color:#1a237e; min-width:40px;">#' + (s.a || "") + "</span>" +
   '<span style="flex:1;">' + sName + (sPhone ? ' <span style="color:#666;">📱 ' + sPhone + "</span>" : "") + "</span>" +
   '<span style="font-size:11px; color:#888;">' + (sK ? sK : "") + "</span>";
  (function (supplier) {
   row.addEventListener("click", function () {
    dropdown.style.display = "none";
    if (typeof onSelect === "function") onSelect(supplier);
   });
  })(s);
  dropdown.appendChild(row);
 }
 dropdown.style.display = "block";
};

window.closeSupplierDropdown = function () {
 var dropdown = document.getElementById("supplierDropdown");
 if (dropdown) dropdown.style.display = "none";
};

window.parseAnimalIds = function (kField) {
 if (!kField) return [];
 var parts = kField.toString().split(",");
 var result = [];
 for (var pi = 0; pi < parts.length; pi++) {
  var trimmed = parts[pi].trim();
  if (trimmed === "") continue;
  var num = parseInt(trimmed);
  if (isNaN(num)) continue;
  result.push({ id: trimmed, type: num <= 500 ? "buffalo" : "cow" });
 }
 return result;
};

window.showAnimalIdDropdown = function (allSuppliers, searchTerm, onSelect) {
 var dropdown = document.getElementById("supplierDropdown");
 if (!dropdown) return 0;
 dropdown.innerHTML = "";

 var matches = [];
 for (var ai = 0; ai < allSuppliers.length; ai++) {
  var supplier = allSuppliers[ai];
  var animals = window.parseAnimalIds(supplier.k);
  for (var aj = 0; aj < animals.length; aj++) {
   if (animals[aj].id.indexOf(searchTerm) !== -1) {
    matches.push({ supplier: supplier, animalId: animals[aj].id, animalType: animals[aj].type });
   }
  }
 }

 for (var mi = 0; mi < matches.length; mi++) {
  var m = matches[mi];
  var sName = m.supplier.h || m.supplier.i || "Unnamed";
  var sPhone = m.supplier.e || "";
  var isBuffalo = m.animalType === "buffalo";
  var bgColor = isBuffalo ? "#fff3e0" : "#e3f2fd";
  var borderColor = isBuffalo ? "#ff9800" : "#2196f3";
  var textColor = isBuffalo ? "#e65100" : "#1565c0";
  var emoji = isBuffalo ? "🐃" : "🐄";
  var typeLabel = isBuffalo ? "Buffalo" : "Cow";

  var row = document.createElement("div");
  row.style.cssText = "padding:10px 12px; cursor:pointer; border-bottom:1px solid #e0e0e0; font-size:13px; display:flex; align-items:center; gap:8px; background:" + bgColor + "; border-left:4px solid " + borderColor + ";";
  row.onmouseenter = function () { this.style.opacity = "0.85"; };
  row.onmouseleave = function () { this.style.opacity = "1"; };
  row.innerHTML =
   '<span style="flex:1; font-weight:bold; color:#1a237e;">' + sName + (sPhone ? ' <span style="font-weight:normal; color:#666; font-size:11px;">📱 ' + sPhone + "</span>" : "") + "</span>" +
   '<span style="font-size:12px; font-weight:700; color:' + textColor + "; background:" + bgColor + "; padding:3px 8px; border-radius:6px; border:1px solid " + borderColor + ';">' + emoji + " " + m.animalId + " " + typeLabel + "</span>";

  (function (supplier) {
   row.addEventListener("click", function () {
    dropdown.style.display = "none";
    if (typeof onSelect === "function") onSelect(supplier);
   });
  })(m.supplier);
  dropdown.appendChild(row);
 }

 if (matches.length > 0) {
  dropdown.style.display = "block";
 }
 return matches.length;
};

document.addEventListener("click", function (e) {
 var dropdown = document.getElementById("supplierDropdown");
 var searchInput = document.getElementById("uniqueIdSearchInput");
 if (dropdown && dropdown.style.display !== "none") {
  if (!dropdown.contains(e.target) && e.target !== searchInput) {
   dropdown.style.display = "none";
  }
 }
});

function formatDateYYYYMMDD(date) {
 var d = new Date(date);
 var year = d.getFullYear();
 var month = String(d.getMonth() + 1).padStart(2, "0");
 var day = String(d.getDate()).padStart(2, "0");
 return year + "-" + month + "-" + day;
}

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

window.formatDateYYYYMMDD = formatDateYYYYMMDD;
window.formatDateDisplay = formatDateDisplay;

// ============================================================
// CONFIG-DRIVEN DECIMALS - milk qty / fat / snf
// ============================================================
function _custDeci(key, dflt) {
 var cfg = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig;
 var v = cfg && cfg.cust_da_const && cfg.cust_da_const[key];
 return isFinite(Number(v)) ? Number(v) : dflt;
}

window.milkDeci = function () {
 return _custDeci("milkDeci", 2);
};
window.fatDeci = function () {
 return _custDeci("fatDeci", 1);
};
window.snfDeci = function () {
 return _custDeci("snfDeci", 1);
};
window.fmtMilk = function (n) {
 return (parseFloat(n) || 0).toFixed(window.milkDeci());
};
window.fmtFat = function (n) {
 return (parseFloat(n) || 0).toFixed(window.fatDeci());
};
window.fmtSnf = function (n) {
 return (parseFloat(n) || 0).toFixed(window.snfDeci());
};
window.keepDec = function (el, deci) {
 if (!el) return;
 var v = String(el.value || "");
 var i = v.indexOf(".");
 if (i !== -1 && v.length - i - 1 > deci) el.value = v.slice(0, i + 1 + deci);
};
window.keepMilk = function (el) {
 window.keepDec(el, window.milkDeci());
};
window.keepFat = function (el) {
 window.keepDec(el, window.fatDeci());
};
window.keepSnf = function (el) {
 window.keepDec(el, window.snfDeci());
};

window.openSupplierList = function (callbackName, xtraFlds) {
 if (typeof open_entind_crud === "function") {
  var args = [
   "no-loader-element",
   1,
   "modalContentForEntInd",
   callbackName || "commonFnToRunAfter_op_ViewCall",
   1,
  ];
  if (xtraFlds) args.push(xtraFlds);
  open_entind_crud.apply(null, args);
 } else {
  showMessageModal("Info", "Supplier list is not available", false);
 }
};

(async function () {
 // Initialize csh array with only required scripts
 if (!window[my1uzr.worknOnPg].csh) {
  window[my1uzr.worknOnPg].csh = [
   {
    a: 1,
    u: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
   },
   {
    a: 2,
    u: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
   },
   {
    a: 3,
    u: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
   },
   {
    a: 4,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/cmn/my1lo.js",
    c: "open_shoLgnO",
    r: "open_shoLgnO"
   },
   { a: 5, u: "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
   { a: 6, u: "https://code.jquery.com/jquery-3.6.0.min.js" },
   {
    a: 7,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/cmn/my1ap.min.js"
   },
   {
    a: 8,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/my1xi.min.js"
   },
   {
    a: 9,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/mr/andro.js"
   },
   {
    a: 24,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/mi_hr.js"
   },
   {
    a: 25,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/suplr_hst.js",
    c: "showSupplierCollectionHistory",
    r: "showSupplierCollectionHistory"
   },
   {
    a: 26,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1236a32/cmn/clrChe.js",
    c: "showClearCacheModal",
    r: "showClearCacheModal"
   },
   {
    a: 27,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@a813e1f/cmn/my1ctr.js",
    c: "open_my1ctr",
    r: "open_my1ctr"
   },
   {
    a: 28,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fbf62ad/cmn/my1lp.js",
    c: "open_shoLgnP",
    r: "open_shoLgnP"
   },
   {
    a: 29,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/suplr_repts.js",
    c: "showCollectionReports",
    r: "showCollectionReports"
   },
   {
    a: 30,
    u: "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"
   },
   {
    a: 31,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/mr/noti.js",
    c: "showNotifications",
    r: "showNotifications"
   },
   {
    a: 32,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/admn_hst.js",
    c: "showCollectionHistory,editCollectionRecord,editPaymentRecord",
    r: "admnHistoryReady"
   },
   {
    a: 33,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/mlkPrsnLst.js",
    c: "showPersonList,initPersonList,filterPersonsByCategory,showSupplierPaymentModal,submitSupplierPayment",
    r: "initPersonList"
   },
   {
    a: 34,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/mlkCltFrm.js",
    c: "showMilkCollectionForm,initMilkCollectionForm,calculateTotal",
    r: "initMilkCollectionForm"
   },
   {
    a: 35,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/mlkPricg.js",
    c: "showMilkPricing,initMilkPricing,submitMilkPricing",
    r: "initMilkPricing"
   },
   {
    a: 36,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/imptPricg.js",
    c: "showImportPricing,initImportPricing",
    r: "initImportPricing"
   },
   {
    a: 37,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/cmn/ei.min.js",
    c: "open_entind_crud",
    r: "open_entind_crud"
   },
   {
    a: 38,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/mlkPaymtFrm.js",
    c: "showMilkPaymentForm,initMilkPaymentForm,loadPaymentFormFields,addTempPayment,submitAllPayments",
    r: "initMilkPaymentForm"
   },
   {
    a: 39,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/daryRgstr.js",
    c: "showDairyRegister,applyDairyRegisterFilter,printDairyRegister,initDairyRegister",
    r: "initDairyRegister"
   },
   {
    a: 40,
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/mi/mlkShgFrm.js",
    c: "showSangh,initSangh,submitSanghEntry,updateSanghEntry,viewSanghHistory",
    r: "initSangh"
   },
  ];
 }

 if (!window.milk_categories || !window.milk_categories.length) {
  window.milk_categories = [
   { a: "1", b: "2025-06-15 09:00:00", c: "0", d: "0", e: "New Entry", f: "25", g: "https://cdn-icons-png.flaticon.com/128/1828/1828919.png", h: "https://cdn-icons-png.flaticon.com/128/1828/1828919.png", type: "form" },
   { a: "3", b: "2025-06-15 09:00:00", c: "0", d: "0", e: "Suppliers", f: "40", g: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png", h: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png", type: "person" },
   { a: "7", b: "2025-06-15 09:00:00", c: "0", d: "0", e: "Payment & Receivables", f: "10", g: "https://cdn-icons-png.flaticon.com/128/1042/1042399.png", h: "https://cdn-icons-png.flaticon.com/128/1042/1042399.png", type: "payment" },
   { a: "6", b: "2025-06-15 09:00:00", c: "0", d: "0", e: "Pricing", f: "10", g: "https://cdn-icons-png.flaticon.com/128/3135/3135746.png", h: "https://cdn-icons-png.flaticon.com/128/3135/3135746.png", type: "pricing" },
   { a: "8", b: "2025-06-15 09:00:00", c: "0", d: "0", e: "Dairy Register", f: "10", g: "https://cdn-icons-png.flaticon.com/128/2917/2917125.png", h: "https://cdn-icons-png.flaticon.com/128/2917/2917125.png", type: "register" },
   { a: "9", e: "Sangh", g: "https://cdn-icons-png.flaticon.com/128/3134/3134140.png", h: "https://cdn-icons-png.flaticon.com/128/3134/3134140.png", type: "sangh" }
  ];
 }

 window.loadMilkCollectConfig = async function () {
  try {
   var resp = await fetch("mi.da");
   if (!resp.ok) throw new Error("HTTP " + resp.status);
   var cfg = await resp.json();
   if (!cfg || typeof cfg !== "object") throw new Error("bad config");
   window[my1uzr.worknOnPg].clientConfig = cfg;
  } catch (err) {
   console.error("Failed to load mi.da:", err);
   window[my1uzr.worknOnPg].clientConfig = {};
  }
 };

 try {
  console.log("🚀 Starting Supplier Portal...");
  let result1 = null;

  if (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].usdInAndroWv === 1)
   result1 = await loadCshScriptsSequentially(1, 2, 3, 5, 6, 8, 24, 30);
  else
   result1 = await loadCshScriptsSequentially(1, 2, 3, 5, 6, 8, 9, 24, 30);

  if (!result1.success) {
   throw new Error("Failed to load required scripts: " + result1.error);
  } else {
   if (!localStorage.getItem("_fix_c_table_done")) {
    try {
     await new Promise(function (resolve) {
      var req = indexedDB.deleteDatabase(dbnm);
      req.onsuccess = function () {
       resolve();
      };
      req.onerror = function () {
       resolve();
      };
      req.onblocked = function () {
       resolve();
      };
     });
    } catch (e) { }
    localStorage.removeItem("my1_in_indexedDBs");
    localStorage.setItem("_fix_c_table_done", "1");
   }
   // ✅ Only create tables that exist - NO 'c' table
   const createResult = await dbDexieManager.handleNwTables("loader", dbnm, tblsRequired);
   tblFailureCount = createResult.failureCount;
   if (!window.milk_persons || !window.milk_persons.length) {
    try {
     window.milk_persons = await dbDexieManager.getAllRecords(dbnm, "c");
    } catch (e) {
     window.milk_persons = [];
    }
   }
  }


  console.log("✅ Framework dependencies loaded");
  await loadMilkCollectConfig();
  seprateIdCowBuffelo = window[my1uzr.worknOnPg].clientConfig?.cust_da_const?.seprateIdCowBuffelo;
  await recomputeAllowedModules();

  // ✅ Self-contained "Clear All Data" modal (replaces CDN clrChe.js modal
  // which relied on create_modal_dynamically and failed to render the dialog)
  window.clearAllCache = async function () {
   var errors = [];

   if ("caches" in window) {
    try {
     var cacheNames = await caches.keys();
     await Promise.all(
      cacheNames.map(function (name) {
       return caches.delete(name);
      }),
     );
    } catch (e) {
     errors.push("Cache API: " + e.message);
    }
   }

   if ("serviceWorker" in navigator) {
    try {
     var registrations = await navigator.serviceWorker.getRegistrations();
     await Promise.all(
      registrations.map(function (reg) {
       return reg.unregister();
      }),
     );
    } catch (e) {
     errors.push("Service Worker: " + e.message);
    }
   }

   if ("indexedDB" in window) {
    try {
     var dbs = await indexedDB.databases();
     await Promise.all(
      dbs.map(function (db) {
       return new Promise(function (resolve) {
        var req = indexedDB.deleteDatabase(db.name);
        req.onsuccess = function () {
         resolve();
        };
        req.onerror = function () {
         resolve();
        };
        req.onblocked = function () {
         resolve();
        };
       });
      }),
     );
    } catch (e) {
     errors.push("IndexedDB: " + e.message);
    }
   }

   try {
    localStorage.clear();
   } catch (e) {
    errors.push("localStorage: " + e.message);
   }
   try {
    sessionStorage.clear();
   } catch (e) {
    errors.push("sessionStorage: " + e.message);
   }

   return errors;
  };

  window.showClearCacheModal = function () {
   var modalId = "clearCacheModal_" + Date.now();
   var div = document.createElement("div");
   div.className = "modal fade";
   div.id = modalId;
   div.setAttribute("tabindex", "-1");
   div.style.zIndex = "100000";
   div.innerHTML =
    '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">' +
    '<div class="modal-content">' +
    '<div class="modal-header" style="background:' +
    theme().dangerBs +
    ";color:" +
    theme().onBrand +
    ';">' +
    '<h6 class="modal-title"><i class="fas fa-broom"></i> Clear Cache Memory</h6>' +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>' +
    "</div>" +
    '<div class="modal-body" style="white-space:pre-wrap;">' +
    "This will clear all cached data including Cache API, Service Workers, IndexedDB, localStorage, and sessionStorage. You will be logged out and may need to log in again." +
    "</div>" +
    '<div class="modal-footer">' +
    '<button class="btn btn-secondary" id="' +
    modalId +
    '_cancel">Cancel</button>' +
    '<button class="btn btn-danger" id="' +
    modalId +
    '_confirm"><i class="fas fa-trash me-1"></i>Clear All</button>' +
    "</div>" +
    "</div></div></div>";
   document.body.appendChild(div);

   var modalInstance = new bootstrap.Modal(div);
   modalInstance.show();

   // ✅ Stack above collectionHistoryModal (z-index 99999)
   var backdrops = document.querySelectorAll(".modal-backdrop");
   var backdrop = backdrops[backdrops.length - 1];
   if (backdrop) backdrop.style.zIndex = "99999";

   document
    .getElementById(modalId + "_cancel")
    .addEventListener("click", function () {
     modalInstance.hide();
    });

   document
    .getElementById(modalId + "_confirm")
    .addEventListener("click", async function () {
     var btn = this;
     btn.disabled = true;
     btn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-1"></i>Clearing...';

     var errors = await window.clearAllCache();

     modalInstance.hide();

     if (errors.length > 0) {
      if (typeof showToast === "function")
       showToast(
        "Cache cleared with some errors: " + errors.join(", "),
        {
         type: "warning",
         duration: 4000,
        },
       );
     } else {
      if (typeof showToast === "function")
       showToast("All cache cleared successfully!", {
        type: "success",
        duration: 2000,
       });
     }

     setTimeout(function () {
      location.reload();
     }, 1000);
    });

   div.addEventListener("hidden.bs.modal", function () {
    div.remove();
   });
  };

  // Add styles
  const st = document.createElement("style");
  st.innerHTML = appcss;
  document.head.appendChild(st);

  // Keep the browser chrome / meta theme-color in sync with the palette
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta && theme() && theme().brand) {
   themeColorMeta.setAttribute("content", theme().brand);
  }

  const mainBody = document.getElementById("main_body");
  mainBody.innerHTML = `
  <div class="topnav">
    <div class="shopname">
    <div class="brand-logo"
    onclick="(async () => {
         await loadExe2Fn(27, ['dv_to_set_open_my1ctr_processed', 0, 1, 2], [1]);
     })();"> <i class="fas fa-glass-whiskey"></i> </div>
      ${window.shopName || "Supplier Portal"}
    </div>
    <div class="nav-icons">
      <button class="nav-btn" id="backToSupplierBtn" title="Back to Supplier" onclick="window.showSupplierMode()" style="display:none;"><i class="fas fa-arrow-left"></i></button>
    </div>
  </div>
  <div id="catStrip" class="cat-strip" style="display:none;"></div>
  <div class="page-wrap" id="milkContent">
    <div id="prdContent"></div>
  </div>
`;
  showSupplierPortal();  // Show initial message
  if (typeof window.initAutoRefresh === "function") {
   window.initAutoRefresh();
  }

  // Auto-open history if milk collection records already exist
  try {
   var justCheckforRun_openSupplierHistory = await dbDexieManager.getAllRecords(dbnm, "mi");
   if (justCheckforRun_openSupplierHistory && justCheckforRun_openSupplierHistory.length > 0) {
    if (my1uzr && (my1uzr.mo || my1uzr.phone)) {
     await window.openSupplierHistory();
    }
   }
  } catch (err) {
   console.warn("Auto-open supplier history skipped:", err);
  }

  console.log("✅ Supplier Portal initialized successfully");
 } catch (e) {
  console.error("❌ App initialization error:", e);
  document.getElementById("main_body").innerHTML = `
      <div class="alert alert-danger m-3">
        <h5>Error Loading App</h5>
        <p>${e.message || e}</p>
        <button class="btn btn-primary mt-2" onclick="location.reload()">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>
    `;
 }
})();

async function recomputeAllowedModules() {
 var hook = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg][moduLst.hook];
 var existing = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].allowedModulesMenuItems;
 var missing =
  typeof existing === "undefined" ||
  existing === null ||
  existing === "" ||
  (Array.isArray(existing) && existing.length === 0);
 if (typeof hook === "function" && missing) {
  try {
   var permitted = await chkModuLstAgainstFNF(moduLst);
   hook(permitted);
  } catch (e) {
   console.warn("failed to resolve allowed modules menu items", e);
  }
 }
}

// ============================================================
// GLOBAL VARIABLES
// ============================================================

var _supplierDataFetched = false;

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Normalize phone number by removing country code and dots
 */
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

/**
 * Resolve the logged-in supplier from my1uzr (read-only login identity) using
 * the local Dexie "c" (supplier master) table, matched by mobile + relation "1".
 * The resolved object is cached on the per-user page workspace so nothing is
 * stored on a bare global or mutated on my1uzr.
 */
window.getCurrentSupplier = async function (alRecords) {
 var ws = window[my1uzr.worknOnPg];
 var mobile = normalizePhone(my1uzr.mo || my1uzr.phone || "");
 var cached = ws && ws.currentSupplier;

 // A cached REAL c-table record for this mobile is final.
 if (cached && !cached.__fb && mobile && normalizePhone(cached.e) === mobile) {
  return cached;
 }

 if (!mobile) return null;

 var real = null;
 try {
  var suppliersMaster = (await dbDexieManager.getAllRecords(dbnm, "c")) || [];
  var rec = suppliersMaster.find(function (s) {
   return s && s.e && normalizePhone(s.e) === mobile && String(s.f) === "1";
  }) || null;
  if (rec) {
   real = {
    a: parseInt(rec.a),
    h: rec.h || rec.i || my1uzr.mn || "Supplier",
    e: rec.e || my1uzr.mo || "Unknown",
    f: String(rec.f || "1"),
    k: rec.k || "",
   };
  }
 } catch (err) {
  console.warn("getCurrentSupplier: c table lookup failed", err);
 }

 if (real) {
  if (ws) ws.currentSupplier = real;
  return real;
 }

 // Fallback: no c table or no matching row -> build from my1uzr (previous
 // behaviour), marked __fb so a real record replaces it once c syncs on Refresh.
 var fbId = null;
 if (alRecords && alRecords.length) {
  for (var i = 0; i < alRecords.length; i++) {
   var n = parseInt(alRecords[i] && alRecords[i].e);
   if (!isNaN(n)) {
    fbId = n;
    break;
   }
  }
 }

 var fb = {
  a: fbId,
  h: my1uzr.mn || my1uzr.mu || "Supplier",
  e: my1uzr.mo || my1uzr.phone || "Unknown",
  f: "1",
  k: "",
  __fb: true,
 };
 if (ws) ws.currentSupplier = fb;
 return fb;
};

/**
 * Format date for display (DD-MM-YYYY)
 */
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

// ============================================================
// SHOW SUPPLIER PORTAL
// ============================================================

async function showSupplierPortal() {
 var container = document.getElementById("prdContent");
 if (!container) return;

 var html = "";

 // Dashboard (always shown in supplier flow)
 html += '<div id="supplierDashboard">';

 // Supplier Hero Info
 html += '<div class="hero-card">';
 html += '<div class="hero-avatar"><i class="fas fa-user"></i></div>';
 html += '<div style="min-width:0; flex:1;">';
 html += '<div class="hero-chip">🥛 Supplier Account</div>';
 html += '<div class="hero-name" id="supplierName">-</div>';
 html += '<div class="hero-sub" id="supplierDetails">-</div>';
 html += "</div>";
 html += "</div>";

 // Summary Cards
 html += '<div class="stats-row">';
 html += '<div class="stat-card border-bottom border-1 border-secondary">';
 html +=
  '<div class="stat-icon" style="background:linear-gradient(135deg,' +
  theme().success +
  "," +
  theme().successBright +
  ');"><i class="fas fa-tint"></i></div>';
 html += '<div class="stat-label">Total Milk</div>';
 html += '<div class="stat-value" id="totalMilk">0.00 Ltr</div>';
 html += "</div>";
 html += '<div class="stat-card border-bottom border-1 border-secondary">';
 html +=
  '<div class="stat-icon" style="background:linear-gradient(135deg,' +
  theme().secondary +
  "," +
  theme().brand +
  ');"><i class="fas fa-rupee-sign"></i></div>';
 html += '<div class="stat-label">Total Amount</div>';
 html += '<div class="stat-value" id="totalAmount">₹0.00</div>';
 html += "</div>";
 html += '<div class="stat-card border-bottom border-1 border-secondary">';
 html +=
  '<div class="stat-icon" style="background:linear-gradient(135deg,' +
  theme().warning +
  "," +
  theme().warningBright +
  ');"><i class="fas fa-arrow-down"></i></div>';
 html += '<div class="stat-label">Received</div>';
 html += '<div class="stat-value" id="supplierReceived">₹0.00</div>';
 html += "</div>";
 html += "</div>";

 // ✅ View History + Print Bill Buttons
 html += '<div class="actions-grid">';
 html += '<div style="display:flex; gap:8px; margin-bottom:11px;">';
 html +=
  '<button class="action-btn action-primary" onclick="window.openSupplierHistory()" style="flex:1; margin-bottom:0; min-width:0;">';
 html += '<i class="fas fa-history"></i> History</button>';
 if (window[my1uzr.worknOnPg].clientConfig?.cust_da_const?.showClntReckonInTbl == 1) {
  html += '<button class="action-btn action-primary" onclick="(async () => { await loadExe2Fn(29, [], [1]); })();" style="flex:1; margin-bottom:0; min-width:0;">';
  html += '<i class="fas fa-chart-line"></i> Report</button>';
 } else {
  html += '<button class="action-btn action-primary" onclick="window.printSupplierBill()" style="flex:1; margin-bottom:0; min-width:0;">';
  html += '<i class="fas fa-print"></i> Print Bill</button>';
 }
 html += '</div>';

 // Refresh button
 html +=
  '<button class="action-btn action-secondary border-bottom border-1 border-secondary" onclick="window.refreshSupplierData()">';
 html += '<i class="fas fa-sync-alt"></i> Refresh Data</button>';

 // Clear All Data button (hidden when colsToHideButtons contains "cad")
 var _hideBtns = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig?.colsToHideButtons) || "";
 if (_hideBtns.indexOf("cad") === -1) {
  html +=
   '<button class="action-btn action-secondary" onclick="window.showClearCacheModal()">';
  html += '<i class="fas fa-trash-alt"></i> Clear All Data</button>';
 }

 html += "</div>";
 html += "</div>"; // end dashboard

 container.innerHTML = html;

 // Always show the supplier flow (milkContent + dashboard) on open
 var milkContent = document.getElementById("milkContent");
 if (milkContent) milkContent.style.display = "block";
 var dashboard = document.getElementById("supplierDashboard");
 if (dashboard) dashboard.style.display = "block";
 window[my1uzr.worknOnPg]._supPortalDataLoaded = 1;
 await window.checkAndLoadSupplierData();

 // Show today's manual-refresh restriction status on open
 if (typeof getManualRefreshBlockReason === "function") {
  var _blkMsg = getManualRefreshBlockReason();
  if (_blkMsg && typeof showToast === "function") {
   showToast("Manual refresh restricted: " + _blkMsg.replace(/\n/g, " "), {
    type: "info",
    duration: 5000,
   });
  }
 }
}

// ============================================================
// CHECK AND LOAD SUPPLIER DATA - Using mi table only
// ============================================================

window.checkAndLoadSupplierData = async function () {
 console.log("🔍 Checking supplier data from mi table...");

 // ✅ Get all mi records
 var allRecords = await dbDexieManager.getAllRecords(dbnm, "mi") || [];
 console.log("📊 Total records in mi table:", allRecords.length);

 if (allRecords.length === 0) {
  console.error(
   "Info",
   "⚠️ No milk records found, Please Try Again Later."
  );
  return false;
 }

 // ✅ Get unique supplier IDs from mi records
 var supplierIds = new Set();
 allRecords.forEach(function (record) {
  if (record.e) supplierIds.add(record.e);
 });

 console.log("📊 Unique supplier IDs found in mi table:", supplierIds.size);

 if (supplierIds.size === 0) {
  showelsemodal("⚠️ No supplier records found. Please click Refresh to sync data from server.");
  return false;
 }

 var mobile = my1uzr.mo || my1uzr.phone || "";

 // ✅ Resolve the logged-in supplier from my1uzr (mobile) via the supplier
 //    master "c" table. The resolved object is cached on the per-user page
 //    workspace (window[my1uzr.worknOnPg].currentSupplier), never a bare global.
 var supplier = await window.getCurrentSupplier(allRecords);

 if (!supplier) {
  console.log("⚠️ No supplier account found for:", mobile);
  showMessageModal(
   "Info",
   "⚠️ No supplier account found. Please click Refresh to sync data.",
   false,
  );
  return false;
 }

 console.log("✅ Supplier found:", window[my1uzr.worknOnPg].currentSupplier);

 var dashboard = document.getElementById("supplierDashboard");

 if (dashboard) dashboard.style.display = "block";

 updateSupplierInfo();
 await loadSupplierHistory(allRecords);
 return true;
};

// ============================================================
// UPDATE SUPPLIER INFO
// ============================================================

function updateSupplierInfo() {
 var supplier = window[my1uzr.worknOnPg].currentSupplier;
 if (!supplier) return;

 var nameEl = document.getElementById("supplierName");
 var detailsEl = document.getElementById("supplierDetails");
 if (nameEl) nameEl.textContent = supplier.h || "Supplier";
 if (detailsEl) detailsEl.textContent = "📱 " + (supplier.e || "");
}

// ============================================================
// LOAD SUPPLIER HISTORY (Dashboard Summary)
// ============================================================

window.loadSupplierHistory = async function (preFetchedMiRecords, supplierOverride) {
 console.log("🔄 Loading supplier history...");

 var supplier = supplierOverride || window[my1uzr.worknOnPg].currentSupplier;
 if (!supplier) {
  console.log("⚠️ No supplier found");
  return;
 }

 var month = new Date().getMonth() + 1;
 var year = new Date().getFullYear();

 // Get data from mi and r tables. When called from checkAndLoadSupplierData,
 // the mi records are already fetched -> avoid a duplicate full-table read.
 var allRecordsPromise = preFetchedMiRecords
  ? Promise.resolve(preFetchedMiRecords)
  : dbDexieManager.getAllRecords(dbnm, "mi");
 var allPaymentsPromise = dbDexieManager.getAllRecords(dbnm, "r");

 var settled = await Promise.all([allRecordsPromise, allPaymentsPromise]);
 var allRecords = settled[0] || [];
 var allPayments = settled[1] || [];

 var supplierId = parseInt(supplier.a);

 // Filter mi records for this supplier (current month)
 var filtered = allRecords.filter(function (record) {
  if (record.e != supplierId) return false;
  var dateObj = new Date(record.f);
  var recordMonth = dateObj.getMonth() + 1;
  var recordYear = dateObj.getFullYear();
  if (recordMonth != month || recordYear != year) return false;
  return true;
 });

 var totalQty = 0;
 var totalAmt = 0;

 filtered.forEach(function (record) {
  var qty = parseFloat(record.i) || 0;
  var amt = parseFloat(record.j) || 0;
  totalQty += qty;
  totalAmt += amt;
 });

 var tmEl = document.getElementById("totalMilk");
 if (tmEl) tmEl.textContent = window.fmtMilk(totalQty) + " Ltr";
 var taEl = document.getElementById("totalAmount");
 if (taEl) taEl.textContent = "₹" + totalAmt.toFixed(2);

 // ============================================================
 // LOAD PAYMENT HISTORY (all time)
 // ============================================================

 var paymentRecords = allPayments.filter(function (p) {
  return parseInt(p.h) === supplierId;
 });

 var totalReceived = 0;

 paymentRecords.forEach(function (record) {
  var amt = parseFloat(record.j) || 0;
  if (record.f == 2) {
   var dateObj = new Date(record.k);
   var recordMonth = dateObj.getMonth() + 1;
   var recordYear = dateObj.getFullYear();
   if (recordMonth == month && recordYear == year) {
    totalReceived += amt;
   }
  }
 });

 var srEl = document.getElementById("supplierReceived");
 if (srEl) srEl.textContent = "₹" + totalReceived.toFixed(2);
};

// ============================================================
// OPEN SUPPLIER HISTORY - Calls showCollectionHistory with e and f
// ============================================================

window.openSupplierHistory = async function () {
 if (!(my1uzr && (my1uzr.mo || my1uzr.phone))) {
  showMessageModal("Info", "⚠️ Please login first!", false);
  return;
 }

 // ✅ Get mobile (e) and relation (f)
 var userPhone = my1uzr.mo || my1uzr.phone;
 var relation = "1";

 if (!userPhone) {
  showMessageModal("Info", "⚠️ Mobile number not found!", false);
  return;
 }

 console.log("📜 Opening history for supplier:");
 console.log("   Mobile (e):", userPhone);
 console.log("   Relation (f):", relation);
 // ✅ Load the supplier history module (csh id 25) which runs
 //  showSupplierCollectionHistory with e and f.
 await loadExe2Fn(25, [userPhone, relation], [1]);
};

// ============================================================
// PRINT SUPPLIER BILL - Date range selection + table print
// ============================================================

window.printSupplierBill = function () {
 var supplier = window[my1uzr.worknOnPg].currentSupplier;
 if (!supplier) {
  showMessageModal("Info", "⚠️ Please login first!", false);
  return;
 }

 var now = new Date();
 var currentYear = now.getFullYear();
 var currentMonth = now.getMonth() + 1;
 var firstDay = new Date(currentYear, currentMonth - 1, 1);
 var lastDay = new Date(currentYear, currentMonth, 0);

 function fmtDate(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var dd = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + dd;
 }

 function fmtDisplay(d) {
  var dd = String(d.getDate()).padStart(2, "0");
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var y = d.getFullYear();
  return dd + "-" + m + "-" + y;
 }

 var modalId = "printBillModal_" + Date.now();
 ["repPrintFrame", "supplierPrintFrame", "printBillArea"].forEach(function (id) {
  var el = document.getElementById(id);
  if (el && el.parentNode) el.parentNode.removeChild(el);
 });
 var div = document.createElement("div");
 div.id = modalId;
 div.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,15,35,0.6);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;";
 div.innerHTML =
  '<div style="background:#fff;border-radius:14px;max-width:400px;width:100%;box-shadow:0 25px 70px rgba(0,0,0,0.35);animation:pbZoomIn 0.25s ease;">' +
  '<style>@keyframes pbZoomIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}</style>' +
  '<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:14px 18px;border-radius:14px 14px 0 0;display:flex;justify-content:space-between;align-items:center;">' +
  '<span style="font-size:15px;font-weight:700;"><i class="fas fa-print"></i> Print Bill</span>' +
  '<button onclick="window.closeModal(\'' + modalId + '\')" style="background:rgba(255,255,255,0.15);border:none;color:#fff;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer;">&times;</button>' +
  '</div>' +
  '<div style="padding:18px;">' +
  '<div style="margin-bottom:12px;">' +
  '<label style="display:block;font-size:11px;font-weight:700;color:#5c6bc0;margin-bottom:4px;">📅 From</label>' +
  '<input type="date" id="printBillFrom" value="' + fmtDate(firstDay) + '" style="width:100%;font-size:13px;padding:8px 10px;border:1.5px solid #c3c8ea;border-radius:8px;box-sizing:border-box;">' +
  '</div>' +
  '<div style="margin-bottom:16px;">' +
  '<label style="display:block;font-size:11px;font-weight:700;color:#5c6bc0;margin-bottom:4px;">📅 To</label>' +
  '<input type="date" id="printBillTo" value="' + fmtDate(lastDay) + '" style="width:100%;font-size:13px;padding:8px 10px;border:1.5px solid #c3c8ea;border-radius:8px;box-sizing:border-box;">' +
  '</div>' +
  '<div style="display:flex;gap:10px;">' +
  '<button onclick="window.closeModal(\'' + modalId + '\')" style="flex:1;padding:10px;border:none;border-radius:8px;background:#6c757d;color:#fff;font-size:13px;font-weight:700;cursor:pointer;">Cancel</button>' +
  '<button id="' + modalId + '_printBtn" style="flex:1;padding:10px;border:none;border-radius:8px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:13px;font-weight:700;cursor:pointer;"><i class="fas fa-print"></i> Print</button>' +
  '</div>' +
  '</div>' +
  '</div>';
 document.body.appendChild(div);

 document.getElementById(modalId + "_printBtn").addEventListener("click", async function () {
  var fromDateStr = document.getElementById("printBillFrom").value;
  var toDateStr = document.getElementById("printBillTo").value;
  if (!fromDateStr || !toDateStr) {
   showMessageModal("Info", "⚠️ Please select both dates!", false);
   return;
  }

  var fromDateObj = new Date(fromDateStr);
  var toDateObj = new Date(toDateStr);
  toDateObj.setHours(23, 59, 59, 999);

  if (fromDateObj > toDateObj) {
   showMessageModal("Info", "⚠️ From date must be before To date!", false);
   return;
  }

  var btn = this;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

  try {
   var supplierId = supplier.a;
   var allRecords = await dbDexieManager.getAllRecords(dbnm, "mi");
   var allPricing = await dbDexieManager.getAllRecords(dbnm, "mb");

   var pricingMap = {};
   allPricing.forEach(function (p) { pricingMap[p.a] = p; });

   var records = allRecords.filter(function (r) {
    return parseInt(r.e) === parseInt(supplierId);
   });

   records = records.filter(function (r) {
    var d = new Date(r.f);
    return d >= fromDateObj && d <= toDateObj;
   });

   records.sort(function (a, b) {
    var dateDiff = new Date(a.f) - new Date(b.f);
    if (dateDiff !== 0) return dateDiff;
    return (parseInt(a.g) || 0) - (parseInt(b.g) || 0);
   });

   var supplierName = supplier.h || my1uzr.mn || "Supplier";
   var totalQty = 0;
   var totalAmt = 0;

   var rows = "";
   records.forEach(function (r) {
    var pricing = pricingMap[r.h] || {};
    var animalName = pricing.f == 1 ? "Buffalo" : pricing.f == 2 ? "Cow" : "-";
    var sessionName = r.g == 1 ? "Morning" : r.g == 2 ? "Evening" : "-";
    var qty = parseFloat(r.i) || 0;
    var rate = parseFloat(pricing.i) || 0;
    var fat = parseFloat(pricing.g) || 0;
    var snf = parseFloat(pricing.h) || 0;
    var amt = qty * rate;
    totalQty += qty;
    totalAmt += amt;

    var d = new Date(r.f);
    var dateDisplay = String(d.getDate()).padStart(2, "0") + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + d.getFullYear();

    rows +=
     '<tr>' +
     '<td>' + dateDisplay + '</td>' +
     '<td>' + sessionName + '</td>' +
     '<td>' + animalName + '</td>' +
     '<td>' + window.fmtMilk(qty) + '</td>' +
     '<td>' + window.fmtFat(fat) + '</td>' +
     '<td>' + window.fmtSnf(snf) + '</td>' +
     '<td>₹' + rate.toFixed(2) + '</td>' +
     '<td style="font-weight:700;">₹' + amt.toFixed(2) + '</td>' +
     '</tr>';
   });

   var billHtml =
    '<html><head><title>Milk Bill - ' + supplierName + '</title>' +
    '<style>' +
    'body{font-family:Arial,sans-serif;margin:20px;color:#333;}' +
    'h2{text-align:center;margin:0 0 4px;color:#1a237e;}' +
    '.sub{text-align:center;font-size:12px;color:#666;margin-bottom:16px;}' +
    'table{width:100%;border-collapse:collapse;font-size:12px;}' +
    'th{background:#667eea;color:#fff;padding:8px 6px;text-align:center;font-weight:600;}' +
    'td{padding:7px 6px;text-align:center;border-bottom:1px solid #eee;}' +
    'tr:nth-child(even){background:#f8f9fd;}' +
    '.total-row{background:#e8eaf6;font-weight:700;border-top:2px solid #667eea;}' +
    '.footer{text-align:center;margin-top:20px;font-size:11px;color:#999;}' +
    '@media print{body{margin:10px;}' +
    'table{font-size:11px;}' +
    'th{padding:6px 4px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' +
    '}' +
    '</style></head><body>' +
    '<h2>🥛 Milk Bill</h2>' +
    '<div class="sub"><strong>' + supplierName + '</strong> &nbsp;|&nbsp; ' + fmtDisplay(fromDateObj) + ' → ' + fmtDisplay(toDateObj) + '</div>' +
    '<table><thead><tr>' +
    '<th>Date</th><th>Session</th><th>Animal</th><th>Qty</th><th>Fat</th><th>SNF</th><th>Rate</th><th>Amount</th>' +
    '</tr></thead><tbody>' +
    (rows || '<tr><td colspan="8" style="padding:20px;color:#999;">No records found for selected dates</td></tr>') +
    '<tr class="total-row"><td colspan="3">TOTAL</td><td>' + window.fmtMilk(totalQty) + '</td><td colspan="3"></td><td style="font-weight:700;">₹' + totalAmt.toFixed(2) + '</td></tr>' +
    '</tbody></table>' +
    '<div class="footer">Generated on ' + fmtDisplay(new Date()) + '</div>' +
    '</body></html>';

   var printFrame = document.createElement("iframe");
   printFrame.id = "supplierPrintFrame";
   printFrame.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999999;border:none;";
   document.body.appendChild(printFrame);

   var frameDoc = printFrame.contentWindow.document;
   frameDoc.open();
   frameDoc.write(billHtml);
   frameDoc.close();

   var cleanup = function () {
    if (printFrame && printFrame.parentNode) printFrame.parentNode.removeChild(printFrame);
   };
   printFrame.contentWindow.addEventListener("afterprint", cleanup);
   printFrame.contentWindow.focus();
   printFrame.contentWindow.print();
   setTimeout(cleanup, 2000);

  } catch (err) {
   console.error("Print bill error:", err);
   showMessageModal("Error", "❌ Failed to generate bill: " + err.message, true);
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-print"></i> Print';
  window.closeModal(modalId);
 });
};

// ============================================================
// REFRESH SUPPLIER DATA
// ============================================================

// Shift a stored date one day back so an incremental sync also
// pulls records entered on the local maximum date (same-day entries).
function shiftDateBackOneDay(dateStr) {
 if (!dateStr) return null;
 var iso = String(dateStr).replace(" ", "T");
 var d = new Date(iso);
 if (isNaN(d.getTime())) return null;
 d.setDate(d.getDate() - 1);
 var y = d.getFullYear();
 var m = String(d.getMonth() + 1).padStart(2, "0");
 var dd = String(d.getDate()).padStart(2, "0");
 return y + "-" + m + "-" + dd;
}

async function buildRefreshDelta(dbName) {
 var rows =
  (await dbDexieManager.getMaxDateRecords(dbName, [
   { tb: "mi", col: "f", cl: "f" },
   { tb: "r", col: "k", cl: "k" },
   { tb: "mb", col: "e", cl: "e" },
  ])) || [];
 return rows.map(function (row) {
  if (!row || typeof row.la !== "string") return row;
  var shifted = shiftDateBackOneDay(row.la);
  var epoch = new Date("1970-01-01T00:00:00");
  var dt = new Date(row.la.replace(" ", "T"));
  if (shifted === null || isNaN(dt.getTime()) || dt.getTime() <= epoch.getTime()) {
   return row;
  }
  return { tb: row.tb, cl: row.cl || "b", la: shifted };
 });
}

window.refreshSupplierData = async function (opts) {
 var isAuto = opts === "auto" || (opts && opts.src === "auto");
 if (!isAuto) {
  if (window._manualRfrshInFlight) {
   showMessageModal("Refresh Restricted", "A refresh is already running. Please wait.", false);
   return false;
  }
  var _cfg = getAutoRefreshConfig();
  var _blockMsg = getManualRefreshBlockReason(_cfg);
  if (_blockMsg) {
   showMessageModal("Refresh Restricted", _blockMsg, false);
   return false;
  }
  window._manualRfrshInFlight = true;
  showMessageModal(
   "Info",
   "Data auto-refreshes daily at " +
   formatHour12(_cfg.aftHour) +
   " & " +
   formatHour12(_cfg.ngtHour) +
   ".\n\nRefreshing data now...",
   false,
  );
 }
 try {
  clearPayload0();
  payload0.vw = 1;
  payload0.fn = 76;
  payload0.la = await buildRefreshDelta(dbnm);

  var response = await fnj3(
   "https://my1.in/3/a.php",
   payload0,
   1,
   true,
   null,
   20000,
   0,
   2,
   1,
  );

  console.log("📥 Server refresh response:", response);

  if (response && response.su == 1) {
   await window.hndlRspo76(response);
   if (!isAuto) {
    await recordManualRefreshState();
   }
   markAutoRefreshSlotsDone(
    getPendingAutoRefreshPeriods(getAutoRefreshConfig()),
   );
   window.openSupplierHistory();
   return true;
  } else {
   await pageLoader(false);
   var errMsg = response ? response.ms || "Refresh failed" : "Server error";
   if (isAuto) {
    console.warn("Auto refresh failed:", errMsg);
    if (typeof showToast === "function")
     showToast("Auto refresh failed: " + errMsg, {
      type: "error",
      duration: 4000,
     });
   } else {
    showMessageModal("Error", "❌ Refresh failed!\n\n" + errMsg, true);
   }
   return false;
  }
 } catch (err) {
  await pageLoader(false);
  if (isAuto) {
   console.warn("Auto refresh error:", err);
   if (typeof showToast === "function")
    showToast("Auto refresh error: " + err.message, {
     type: "error",
     duration: 4000,
    });
  } else {
   console.error("Error refreshing:", err);
   showMessageModal("Error", "❌ Server error: " + err.message, true);
  }
  return false;
 } finally {
  if (!isAuto) window._manualRfrshInFlight = false;
 }
};

window.hndlRspo76 = async function (response) {
 await pageLoader(true);

 // Wait until the downloaded records are actually committed to the local
 // DB so every read (dashboard, history, reports) sees the fresh data.
 if (typeof handl_mi_rspons === "function") {
  await handl_mi_rspons(response, 1);
 }

 if (typeof window.checkAndLoadSupplierData === "function") {
  var ok = await window.checkAndLoadSupplierData();
  if (ok === false) {
   await pageLoader(false);
   return;
  }
 }

 if (typeof showToast === "function") {
  showToast(response && response.ms ? response.ms : "✅ Data updated successfully!", {
   type: "success",
   duration: 3000,
  });
 }

 await pageLoader(false);
}

// ============================================================
// AUTO REFRESH - Twice daily (afternoon + night) data sync.
// Times come from mi.da -> cust_da_const.rfrshAfternoonTT /
// rfrshNightTT (24h hour-of-day, e.g. 15 = 3 PM, 21 = 9 PM).
// A successful refresh (auto or manual) marks today's pending
// slots done so the same slot is not refreshed again.
// ============================================================

const AUTO_REFRESH_STORAGE_KEY = "mi_auto_rfrsh";

function getAutoRefreshConfig() {
 var ws = window[my1uzr.worknOnPg] || {};
 var cust = (ws.clientConfig && ws.clientConfig.cust_da_const) || {};
 return {
  aftHour: parseInt(cust.rfrshAfternoonTT, 10) || 15,
  ngtHour: parseInt(cust.rfrshNightTT, 10) || 21,
 };
}

function formatHour12(h) {
 h = parseInt(h, 10);
 if (isNaN(h)) return "";
 var period = h >= 12 ? "PM" : "AM";
 var hh = h % 12;
 if (hh === 0) hh = 12;
 return hh + ":00 " + period;
}

function formatTimeHM(dt) {
 if (!dt) return "";
 var h = dt.getHours();
 var m = dt.getMinutes();
 var period = h >= 12 ? "PM" : "AM";
 var hh = h % 12;
 if (hh === 0) hh = 12;
 return hh + ":" + String(m).padStart(2, "0") + " " + period;
}

function todayKey(dt) {
 return formatDateYYYYMMDD(dt || new Date());
}

function getAutoRefreshState() {
 try {
  var raw = JSON.parse(localStorage.getItem(AUTO_REFRESH_STORAGE_KEY) || "null");
  if (raw && typeof raw === "object" && raw.d) return raw;
 } catch (e) { }
 return { d: "", a: 0, n: 0 };
}

function markAutoRefreshSlotsDone(periods) {
 if (!periods || !periods.length) return;
 var today = todayKey();
 var st = getAutoRefreshState();
 if (st.d !== today) st = { d: today, a: 0, n: 0 };
 for (var i = 0; i < periods.length; i++) {
  if (periods[i] === "afternoon") st.a = 1;
  else if (periods[i] === "night") st.n = 1;
 }
 st.d = today;
 try {
  localStorage.setItem(AUTO_REFRESH_STORAGE_KEY, JSON.stringify(st));
 } catch (e) { }
}

function getPendingAutoRefreshPeriods(cfg, today) {
 if (!cfg) cfg = getAutoRefreshConfig();
 if (!today) today = todayKey();
 var st = getAutoRefreshState();
 var periodDone = function (key) {
  return st.d === today && st[key] === 1;
 };
 var hr = new Date().getHours();
 var pending = [];
 if (hr >= cfg.aftHour && !periodDone("a")) pending.push("afternoon");
 if (hr >= cfg.ngtHour && !periodDone("n")) pending.push("night");
 return pending;
}

function autoRefreshReady() {
 if (my1uzr && my1uzr.mk) return true;
 var ws = window[my1uzr.worknOnPg] || {};
 if ((ws.allowedModulesMenuItems || []).length > 0) return true;
 return ws._supPortalDataLoaded === 1;
}

window._autoRfrshRunning = false;

async function autoRefreshTick() {
 if (window._autoRfrshRunning) return;
 if (!autoRefreshReady()) return;
 var cfg = getAutoRefreshConfig();
 var today = todayKey();
 var pending = getPendingAutoRefreshPeriods(cfg, today);
 if (!pending.length) return;
 window._autoRfrshRunning = true;
 try {
  var ok = await window.refreshSupplierData({ src: "auto" });
  if (ok === false) {
   console.warn("Auto refresh not completed for:", pending);
  }
 } catch (e) {
  console.warn("Auto refresh error:", e);
 } finally {
  window._autoRfrshRunning = false;
 }
}

window.initAutoRefresh = function () {
 if (window._autoRfrshInited) return;
 window._autoRfrshInited = 1;
 autoRefreshTick();
 setInterval(autoRefreshTick, 60000);
};

// ============================================================
// MANUAL REFRESH POLICY
// - Manual refresh is allowed at most once per hour.
// - Once a fetch received today's entry (any mi record dated
//   today for the logged-in supplier), manual refresh is blocked
//   during [rfrshAfternoonTT -> rfrshNightTT) e.g. 15:00-21:00.
// - Scheduled auto-refresh at 15:00 / 21:00 is never blocked.
// ============================================================

const MANUAL_REFRESH_STORAGE_KEY = "mi_manual_rfrsh";
const ONE_HOUR_MS = 3600000;

function getManualRefreshState() {
 try {
  var raw = JSON.parse(localStorage.getItem(MANUAL_REFRESH_STORAGE_KEY) || "null");
  if (raw && typeof raw === "object" && raw.d) return raw;
 } catch (e) { }
 return { d: "", ts: 0, got: 0 };
}

async function doesSupplierHaveTodayEntry() {
 try {
  var ws = window[my1uzr.worknOnPg] || {};
  var supplier = ws.currentSupplier;
  if (!supplier) return false;
  var sid = parseInt(supplier.a);
  if (isNaN(sid)) return false;
  var records = (await dbDexieManager.getAllRecords(dbnm, "mi")) || [];
  var today = todayKey();
  return records.some(function (r) {
   if (!r || !r.f) return false;
   if (parseInt(r.e) !== sid) return false;
   var d = new Date(r.f);
   if (isNaN(d.getTime())) return false;
   return formatDateYYYYMMDD(d) === today;
  });
 } catch (e) {
  return false;
 }
}

async function recordManualRefreshState() {
 var got = (await doesSupplierHaveTodayEntry()) ? 1 : 0;
 var st = { d: todayKey(), ts: Date.now(), got: got };
 try {
  localStorage.setItem(MANUAL_REFRESH_STORAGE_KEY, JSON.stringify(st));
 } catch (e) { }
 return st;
}

function getManualRefreshBlockReason(cfg, now) {
 if (!cfg) cfg = getAutoRefreshConfig();
 if (!now) now = new Date();
 var st = getManualRefreshState();
 if (!st || st.d !== todayKey(now)) return null;
 var hr = now.getHours();
 if (st.got === 1 && hr >= cfg.aftHour && hr < cfg.ngtHour) {
  return (
   "Today's data has already been received.\n\n" +
   "Manual refresh is restricted from " +
   formatHour12(cfg.aftHour) +
   " to " +
   formatHour12(cfg.ngtHour) +
   ". You can fetch again after " +
   formatHour12(cfg.ngtHour) +
   "."
  );
 }
 if (now.getTime() - st.ts < ONE_HOUR_MS) {
  var next = new Date(st.ts + ONE_HOUR_MS);
  return (
   "Manual refresh is allowed only once per hour.\n\n" +
   "Next refresh available at " +
   formatTimeHM(next) +
   "."
  );
 }
 return null;
}

window._manualRfrshInFlight = false;

// ============================================================
// AFTER LOGIN - Reload dashboard data automatically
// ============================================================

// window.function2runAfter_O_Login = async function (result) {
//  try {
//   var loginSection = document.getElementById("loginSection");
//   var dashboard = document.getElementById("supplierDashboard");
//   if (loginSection) loginSection.style.display = "none";
//   if (dashboard) dashboard.style.display = "block";

//   if (typeof window.checkAndLoadSupplierData === "function") {
//    await window.checkAndLoadSupplierData();
//   }

//   var loginMsg = "Login successful";
//   if (result && result.xtra && result.xtra.ms) {
//    loginMsg += ": " + result.xtra.ms;
//   }
//  } catch (err) {
//   console.error("After-login data load error:", err);
//  }
// };

window.openLogin = function () {
 try {
  if (typeof loadExe2Fn === "function") {
   loadExe2Fn(4, [], [1]);
   return;
  }
 } catch (e) { }
 showMessageModal("Info", "⚠️ Login is not available right now.", false);
};

// ============================================================
// GLOBAL HELPERS
// ============================================================

window.showMessageModal = function (title, message, isError, onClose) {
 if (window.suppressModals) {
  window.suppressModals = false;
  return false;
 }
 var mid = "msgModal_" + Date.now();
 var div = document.createElement("div");
 div.innerHTML =
  '<div class="modal fade" id="' +
  mid +
  '" tabindex="-1">' +
  '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' +
  '<div class="modal-header" style="background:' +
  (isError ? theme().dangerBs : theme().successBs) +
  ";color:" +
  theme().onBrand +
  ';">' +
  '<h6 class="modal-title">' +
  title +
  "</h6>" +
  '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>' +
  '<div class="modal-body" style="white-space:pre-wrap;">' +
  message +
  "</div>" +
  '<div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">OK</button></div>' +
  "</div></div></div>";
 document.body.appendChild(div);
 var modalEl = document.getElementById(mid);
 modalEl.style.zIndex = "100001";
 var m = new bootstrap.Modal(modalEl);
 m.show();
 var bsBackdrop = document.querySelector(".modal-backdrop:last-of-type");
 if (bsBackdrop) bsBackdrop.style.zIndex = "100000";
 modalEl.addEventListener("hidden.bs.modal", function () {
  this.remove();
  if (typeof onClose === "function") onClose();
 });
};

// ============================================================
// EXPOSE FUNCTIONS
// ============================================================

window.showSupplierPortal = showSupplierPortal;
window.checkAndLoadSupplierData = checkAndLoadSupplierData;
window.openLogin = openLogin;
window.loadSupplierHistory = loadSupplierHistory;
window.refreshSupplierData = refreshSupplierData;
window.showMessageModal = showMessageModal;
window.openSupplierHistory = openSupplierHistory;
window.normalizePhone = normalizePhone;
window.formatDateDisplay = formatDateDisplay;

// ============================================================
// ADMIN PANEL (merged from AdminPanel/mi.js)
// Admin is a second view inside this same supplier page/flow.
//   showAdminPanel()   -> switch to the Admin panel
//   showSupplierMode() -> switch back to the Supplier portal
// The entry button is not decided yet, so no visible button is
// added here yet - these functions are exposed on window only.
// Both designs/views stay intact: supplier appcss stays the base
// theme, the admin css is injected only while the admin panel is
// active so the two style systems never clash.
// ============================================================

const adminAppCss = `
      * { box-sizing: border-box; }

      :root {
        --surface: #FFF8ED;
        --surface-2: #FDF4E3;
        --surface-3: #FFFDF6;
        --border: #EADFC8;
        --ink: #37474F;
        --ink-head: #1A237E;
        --primary: #667EEA;
        --primary-dark: #764BA2;
        --accent: #FF9800;
        --bs-table-bg: var(--surface);
        --bs-table-striped-bg: var(--surface-2);
        --bs-table-hover-bg: #F4EDDC;
      }

      body {
        margin: 0; padding: 0;
        background: linear-gradient(135deg, #1a237e 0%, #4a148c 50%, #880e4f 100%);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        min-height: 100vh;
      }
      .topnav {
        position: sticky; top: 0; z-index: 9999;
        background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
        height: 60px; display: flex; align-items: center;
        justify-content: space-between; padding: 0 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.18);
        border-bottom: 2px solid rgba(255,255,255,0.08);
      }
      .shopname {
        font-size: 20px; font-weight: bold; color: white;
        display: flex; align-items: center; gap: 8px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      }
      .shopname i { font-size: 24px; color: #ffd54f; }
      .nav-icons { display: flex; gap: 10px; }
      .nav-icons i {
        font-size: 20px; cursor: pointer; transition: all 0.3s;
      }
      .nav-icons i:hover { transform: scale(1.1); }

      .cat-strip {
        display: flex; overflow-x: auto; gap: 10px; padding: 12px;
        background: rgba(255,255,255,0.07); backdrop-filter: blur(10px);
        margin: 10px; border-radius: 15px;
        scrollbar-width: none; cursor: grab;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .cat-strip::-webkit-scrollbar { display: none; }
      .cat-strip.active { cursor: grabbing; }

      .cat-card {
        min-width: 85px; text-align: center; cursor: pointer;
        transition: all 0.3s; padding: 8px 5px;
        border-radius: 12px;
      }
      .cat-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.07); }
      .cat-card.active { background: rgba(255,255,255,0.14); }
      .cat-card.active .cat-img {
        border-color: #ffd54f;
        box-shadow: 0 4px 15px rgba(255,213,79,0.25);
      }
      .cat-img {
        width: 55px; height: 55px; border-radius: 50%;
        object-fit: cover; border: 3px solid rgba(255,255,255,0.24);
        transition: all 0.3s; background: var(--surface-3); padding: 2px;
      }
      .cat-name {
        font-size: 10px; margin-top: 5px; color: white;
        font-weight: 500; overflow: hidden;
        text-overflow: ellipsis; white-space: nowrap;
      }

      .content-area { padding: 10px; min-height: 400px; }

      .milk-card {
        background: #FFFFFF; color: var(--ink); border-radius: 16px; padding: 20px;
        margin-bottom: 12px;
        box-shadow: 0 1px 3px rgba(102,126,234,0.08), 0 4px 12px rgba(0,0,0,0.04);
        border: 1px solid var(--border);
        border-left: 4px solid #667eea;
        animation: fadeIn 0.3s ease;
        transition: box-shadow 0.3s ease, transform 0.2s ease;
      }
      .milk-card:hover {
        box-shadow: 0 2px 6px rgba(102,126,234,0.12), 0 8px 24px rgba(0,0,0,0.06);
        transform: translateY(-1px);
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .form-label { font-size: 13px; margin-bottom: 4px; color: var(--ink); }
      .form-control, .form-select {
        border-radius: 10px; padding: 10px 12px;
        border: 2px solid #e0e0e0; transition: all 0.3s;
        background-color: var(--surface-3); color: var(--ink);
      }
      .form-control:focus, .form-select:focus {
        border-color: #667eea; box-shadow: 0 0 0 0.2rem rgba(102,126,234,0.25);
      }

      .btn {
        border-radius: 10px; padding: 10px 20px;
        font-weight: 600; transition: all 0.3s;
      }
      .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }

      .badge-milk {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white; padding: 5px 12px; border-radius: 20px;
        font-size: 11px; font-weight: 600;
      }

      .total-box {
        background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
        padding: 20px; border-radius: 12px; text-align: center;
        color: white; border: 2px solid #4caf50;
      }
      .total-box .amount {
        font-size: 36px; font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }

      .section-box {
        padding: 15px; border-radius: 12px; margin-bottom: 12px;
        border: 1px solid var(--border); background: var(--surface-2);
      }

      .add-btn {
        position: fixed; bottom: 25px; right: 25px;
        width: 60px; height: 60px; border-radius: 50%;
        background: linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%);
        color: white; border: none; font-size: 28px;
        cursor: pointer; box-shadow: 0 8px 25px rgba(255,111,0,0.4);
        transition: all 0.3s; z-index: 999;
        display: flex; align-items: center; justify-content: center;
      }
      .add-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 35px rgba(255,111,0,0.6);
      }
          table { border-radius: 10px; overflow: hidden; }
      table th { font-size: 11px; text-transform: uppercase; }
      table td { font-size: 13px; }

      /* Remove number input spinners */
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }

      /* ===== RESPONSIVE GRID HELPERS ===== */
      .row-mobile { display: flex; flex-wrap: wrap; }
      .col-mobile-12 { flex: 0 0 100%; max-width: 100%; }

      /* ===== MOBILE RESPONSIVE ===== */
      @media (max-width: 767px) {
        .topnav { height: auto; min-height: 56px; padding: 8px 12px; }
        .shopname { font-size: 16px; }
        .shopname i { font-size: 18px; }
        .nav-icons i { font-size: 17px; }

        .cat-strip { gap: 6px; padding: 8px 10px; margin: 6px; }
        .cat-card { min-width: 65px; padding: 6px 4px; }
        .cat-img { width: 42px; height: 42px; }
        .cat-name { font-size: 9px; }

        .content-area { padding: 8px; }
        .milk-card { padding: 14px; border-radius: 12px; }

        .add-btn { width: 50px; height: 50px; font-size: 22px; bottom: 15px; right: 15px; }

        .modal-dialog { margin: 8px; }
        .modal-dialog.modal-lg { max-width: calc(100vw - 16px); }
        .modal-body { max-height: 70vh !important; }

        .row.g-2 > [class*="col-"] { padding-left: 4px; padding-right: 4px; }

        input, select, textarea, .form-control, .form-select { font-size: 16px !important; }

        .table-responsive table { font-size: 11px !important; }
        .table-responsive table th,
        .table-responsive table td { padding: 4px !important; white-space: nowrap; }

        .total-box .amount { font-size: 26px; }

        /* Form layouts - override inline styles */
        [style*="display: flex"][style*="gap: 20px"] { flex-wrap: wrap !important; gap: 10px !important; }
        [style*="display: flex"][style*="gap: 15px"] { gap: 8px !important; }

        /* Make col-6 full width on mobile in forms */
        .row > .col-6 { flex: 0 0 100% !important; max-width: 100% !important; }

        /* Payment modal grid */
        #supplierPaymentModal .col-4,
        #supplierPaymentModal .col-5,
        #supplierPaymentModal .col-3,
        #supplierPaymentModal .col-2 { flex: 0 0 50% !important; max-width: 50% !important; }
        #supplierPaymentModal .col-6 { flex: 0 0 100% !important; max-width: 100% !important; }
        #supplierPaymentModal .row.text-center .col-4 { flex: 0 0 33.33% !important; max-width: 33.33% !important; }

        /* Person detail - payment modal layout */
        .modal-body .row.align-items-end.g-2 .col-5 { flex: 0 0 50% !important; max-width: 50% !important; }
        .modal-body .row.align-items-end.g-2 .col-3,
        .modal-body .row.align-items-end.g-2 .col-2 { flex: 0 0 33.33% !important; max-width: 33.33% !important; }

        /* Wrapping for radio groups */
        [style*="display: flex"][style*="flex-wrap: wrap"] { gap: 8px !important; }
        [style*="display: flex"][style*="flex-wrap: wrap"] > label { flex: 1 1 auto !important; min-width: 0 !important; padding: 8px 10px !important; }

        /* KPI cards - 2x2 on mobile */
        .row.g-2.mb-3 > .col-3 { flex: 0 0 50% !important; max-width: 50% !important; }

        /* Receivables grid - 2 columns on mobile */
        [style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
        [style*="grid-template-columns: 1fr 1fr"] { gap: 6px !important; }

        /* Person detail cards */
        [style*="min-width: 130px"] { min-width: 100% !important; }

        /* Animal detail: col-6 stacks */
        .milk-info { grid-template-columns: 1fr 1fr !important; }

        /* Add item modal */
        #addItemModal .col-3,
        #addItemModal .col-4,
        #addItemModal .col-9,
        #addItemModal .col-10,
        #addItemModal .col-2 { flex: 0 0 100% !important; max-width: 100% !important; }
        #addItemModal .col-3 { text-align: center !important; }
        #addItemModal .row.mb-2.g-0 > .col-4 { flex: 0 0 33.33% !important; max-width: 33.33% !important; }

        /* 3-column grids stack on mobile */
        [style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 6px !important; }
      }


      @media (max-width: 575px) {
        .shopname { font-size: 14px; }
        .nav-icons { gap: 4px; }
        .nav-icons i { font-size: 15px; }

        .cat-card { min-width: 56px; padding: 4px 3px; }
        .cat-img { width: 36px; height: 36px; }
        .cat-name { font-size: 8px; }

        .milk-card { padding: 10px; }

        .add-btn { width: 44px; height: 44px; font-size: 18px; bottom: 12px; right: 12px; }

        .total-box .amount { font-size: 22px; }

        .modal-dialog { margin: 4px; }
        .modal-content { border-radius: 10px; }

        .btn { font-size: 14px; padding: 8px 14px; }
        h5 { font-size: 15px; }
        h4 { font-size: 17px; }
      }

      @media (max-width: 400px) {
        .cat-card { min-width: 50px; }
        .cat-img { width: 32px; height: 32px; }
        .cat-name { font-size: 7px; }
      }

 // ✅ ADD THE PLACEHOLDER STYLES HERE
  ::placeholder {
    color: #bbb !important;
    opacity: 1.8 !important;
    font-weight: normal !important;
  }

  #buffaloQty::placeholder,
  #buffaloSnf::placeholder,
  #buffaloFat::placeholder,
  #cowQty::placeholder,
  #cowSnf::placeholder,
  #cowFat::placeholder {
    color: #bbb !important;
    opacity: 1.8 !important;
    font-weight: 300 !important;
  }

  ::-moz-placeholder {
    color: #bbb !important;
    opacity: 1.8 !important;
  }

  :-ms-input-placeholder {
    color: #bbb !important;
    opacity: 1.8 !important;
  }

  ::-ms-input-placeholder {
    color: #bbb !important;
    opacity: 1.8 !important;
  }
/* ============================================================
   RESPONSIVE MILK COLLECTION FORM
   ============================================================ */

/* Desktop: Side by side */
.milk-details-container {
  display: flex;
  gap: 12px;
  min-width: 480px;
}

.buffalo-column,
.cow-column {
  flex: 1;
  min-width: 220px;
  padding: 10px;
}

/* Mobile: Compact */
@media (max-width: 768px) {
  .milk-details-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
  }

  .milk-details-container {
    min-width: 380px;
    gap: 8px;
  }

  .buffalo-column,
  .cow-column {
    min-width: 175px;
    max-width: 200px;
    padding: 8px;
  }

  .buffalo-column h6,
  .cow-column h6 {
    font-size: 12px !important;
    margin-bottom: 4px !important;
  }

  .buffalo-column label,
  .cow-column label {
    font-size: 9px !important;
  }

  .buffalo-column input,
  .cow-column input {
    font-size: 13px !important;
    padding: 2px 4px !important;
  }

  .buffalo-column .amount-display,
  .cow-column .amount-display {
    font-size: 14px !important;
  }

  /* Date/Time/Session on mobile */
  .date-time-session {
    flex-direction: column;
    gap: 6px;
  }

  .date-time-session > div {
    width: 100%;
    min-width: unset !important;
  }

  .session-radio-group {
    justify-content: center;
  }

  /* Total Amount on mobile */
  .total-amount {
    font-size: 22px !important;
    padding: 10px !important;
  }

  /* Buttons on mobile */
  .btn-submit,
  .btn-history {
    font-size: 14px !important;
    padding: 10px !important;
  }
}

/* Very small mobile */
@media (max-width: 480px) {
  .milk-details-container {
    min-width: 320px;
  }

  .buffalo-column,
  .cow-column {
    min-width: 145px;
    max-width: 170px;
    padding: 6px;
  }

  .buffalo-column h6,
  .cow-column h6 {
    font-size: 10px !important;
  }

  .buffalo-column input,
  .cow-column input {
    font-size: 12px !important;
    padding: 2px 3px !important;
  }

  .buffalo-column label,
  .cow-column label {
    font-size: 8px !important;
  }

  .buffalo-column .amount-display,
  .cow-column .amount-display {
    font-size: 12px !important;
  }
}

/* ===== CREAM + INDIGO THEME OVERRIDES ===== */
:root {
  --surface: #FFFCF7;
  --surface-2: #F5F0FA;
  --surface-3: #FEFCFF;
  --border: #D8D0E8;
  --ink: #37474F;
  --ink-head: #1A237E;
}
.milk-card,
.modal-content,
.modal-body,
.modal-footer,
.dr-card,
.dr-table,
.dr-input,
#tempPaymentsContainer,
.client-input,
.fixed-col,
.day-card,
.report-table,
.card,
.table,
thead,
[style*="background:white"],
[style*="background: white"],
[style*="background:#fff"],
[style*="background: #fff"],
[style*="background-color:white"],
[style*="background-color: white"],
[style*="background-color:#fff"],
[style*="background-color: #fff"],
.bg-white { background-color: var(--surface) !important; color: var(--ink) !important; }
.modal-content { border: 1px solid var(--border); box-shadow: 0 12px 40px rgba(0,0,0,0.25); }
.modal-header, .modal-footer { border-color: var(--border); }
.form-control, .form-select, .form-check-input, .input-group-text {
  background-color: var(--surface-3) !important;
  color: var(--ink);
}
.table { --bs-table-bg: var(--surface); }
.table-striped tbody tr:nth-of-type(odd) { --bs-table-bg: var(--surface-2); }
.table-hover tbody tr:hover { --bs-table-bg: #F4EDDC; }
::placeholder { color: #A89E88 !important; }

    `;

// Global modal animation style (injected once)
(function () {
 if (!document.getElementById("miModalAnimStyle")) {
  var s = document.createElement("style");
  s.id = "miModalAnimStyle";
  s.textContent =
   "@keyframes miSlideDown{from{transform:translateY(-50px);opacity:0}to{transform:translateY(0);opacity:1}}";
  document.head.appendChild(s);
 }
})();

// Unified modal function - handles message and confirm modes
window.showModal = function (opts) {
 var title = opts.title || "";
 var message = opts.message || "";
 var isError = !!opts.isError;
 var type = opts.type || "message";
 var onConfirm = typeof opts.onConfirm === "function" ? opts.onConfirm : null;
 var onCancel = typeof opts.onCancel === "function" ? opts.onCancel : null;
 var onClose = typeof opts.onClose === "function" ? opts.onClose : null;

 var mid = "miModal_" + Date.now();
 var headerBg = isError ? "#dc3545" : "#28a745";
 var isConfirm = type === "confirm";

 var buttonsHtml = "";
 if (isConfirm) {
  buttonsHtml =
   '<div style="padding:10px 20px 20px;display:flex;gap:10px;justify-content:center;">' +
   '<button id="' +
   mid +
   '_cancel" style="padding:10px 30px;border-radius:8px;font-weight:600;min-width:100px;border:1px solid var(--border);background:var(--surface-2);color:#333;cursor:pointer;">Cancel</button>' +
   '<button id="' +
   mid +
   '_confirm" style="padding:10px 30px;border-radius:8px;font-weight:600;min-width:100px;background:linear-gradient(135deg,#667eea,#764ba2);border:none;color:white;cursor:pointer;">Confirm</button>' +
   "</div>";
 } else {
  buttonsHtml =
   '<div style="padding:0 20px 20px;text-align:center;">' +
   '<button id="' +
   mid +
   '_ok" style="padding:8px 30px;border-radius:6px;border:none;background:#667eea;color:white;font-weight:bold;cursor:pointer;">OK</button>' +
   "</div>";
 }

 var html =
  '<div id="' +
  mid +
  '" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999999;display:flex;align-items:center;justify-content:center;padding:20px;">' +
  '<div style="background:var(--surface);border-radius:15px;max-width:450px;width:100%;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.3);animation:miSlideDown 0.3s ease;">' +
  '<div style="background:' +
  headerBg +
  ';color:white;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;">' +
  '<h6 style="margin:0;">' +
  title +
  "</h6>" +
  '<button id="' +
  mid +
  '_x" style="background:transparent;border:none;color:white;font-size:24px;cursor:pointer;padding:0 5px;">&times;</button>' +
  "</div>" +
  '<div style="padding:20px;white-space:pre-wrap;font-size:14px;max-height:60vh;overflow-y:auto;">' +
  message +
  "</div>" +
  buttonsHtml +
  "</div></div>";

 var div = document.createElement("div");
 div.innerHTML = html;
 var el = div.firstElementChild;
 document.body.appendChild(el);

 function closeModal() {
  el.remove();
  if (onClose) onClose();
 }

 el.querySelector("#" + mid + "_x").onclick = closeModal;

 if (isConfirm) {
  el.querySelector("#" + mid + "_confirm").onclick = function () {
   closeModal();
   if (onConfirm) onConfirm();
  };
  el.querySelector("#" + mid + "_cancel").onclick = function () {
   closeModal();
   if (onCancel) onCancel();
  };
 } else {
  el.querySelector("#" + mid + "_ok").onclick = closeModal;
 }

 return el;
};

// Fetch pricing records from server (independent of AdminPanel/mlkCltFrm.js)
window.fetchPricingData = async function () {
 try {
  if (typeof fnj3 !== "function") {
   showMessageModal(
    "Error",
    "Cannot fetch — server connection not available!",
    true,
   );
   return false;
  }
  clearPayload0();

  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: "mb" }]);
  payload0.fn = 89;
  payload0.p = {};

  var response = await fnj3(
   "https://my1.in/2/m.php",
   payload0,
   1,
   true,
   null,
   20000,
   0,
   1,
   1,
  );

  console.log("📦 Fetch pricing response:", response);

  if (response && response.su == 1) {
   var hasRecords = response.mb && response.mb.l && response.mb.l.length > 0;
   console.log(
    "📊 mb.l length:",
    response.mb && response.mb.l ? response.mb.l.length : 0,
    "→ hasRecords:",
    hasRecords,
   );
   if (hasRecords) {
    if (typeof handl_mi_rspons === "function") {
     await handl_mi_rspons(response, 0);
    }
    return true;
   }
   return "empty";
  }
  console.log("❌ Fetch pricing failed - response:", response);
  return false;
 } catch (error) {
  console.error("Fetch pricing error:", error);
  return false;
 }
};

// Custom modal with Fetch from Server + Import from Excel buttons
window.showPricingRequiredModal = function () {
 var mid = "pricingReq_" + Date.now();
 var html =
  '<div id="' +
  mid +
  '" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999999;display:flex;align-items:center;justify-content:center;padding:20px;">' +
  '<div style="background:var(--surface);border-radius:15px;max-width:450px;width:100%;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.3);animation:miSlideDown 0.3s ease;">' +
  '<div style="background:#dc3545;color:white;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;">' +
  '<h6 style="margin:0;">Pricing Data Required</h6>' +
  '<button id="' +
  mid +
  '_x" style="background:transparent;border:none;color:white;font-size:24px;cursor:pointer;padding:0 5px;">&times;</button>' +
  "</div>" +
  '<div style="padding:20px;font-size:14px;text-align:center;">' +
  "<p style='margin:0 0 10px;'>No pricing records found!</p>" +
  "<p style='margin:0 0 15px;color:#666;'>You must add pricing data before recording milk collections.</p>" +
  "<p style='margin:0 0 20px;font-weight:600;'>Choose an option below:</p>" +
  '<div style="display:flex;gap:12px;justify-content:center;">' +
  '<button id="' +
  mid +
  '_fetch" style="padding:12px 20px;border-radius:8px;font-weight:600;font-size:14px;min-width:140px;background:linear-gradient(135deg,#667eea,#764ba2);border:none;color:white;cursor:pointer;">' +
  "🔄 Fetch from Server</button>" +
  '<button id="' +
  mid +
  '_import" style="padding:12px 20px;border-radius:8px;font-weight:600;font-size:14px;min-width:140px;background:var(--surface-2);border:2px solid #667eea;color:#667eea;cursor:pointer;">' +
  "📥 Import from Excel</button>" +
  "</div>" +
  "</div></div></div>";

 var div = document.createElement("div");
 div.innerHTML = html;
 var el = div.firstElementChild;
 document.body.appendChild(el);

 function closeModal() {
  el.remove();
 }

 el.querySelector("#" + mid + "_x").onclick = closeModal;

 el.querySelector("#" + mid + "_fetch").onclick = async function () {
  var btn = this;
  if (typeof window.fetchPricingData !== "function") {
   showMessageModal(
    "Error",
    "Fetch pricing function is not available!",
    true,
   );
   return;
  }
  btn.disabled = true;
  btn.textContent = "\u23F3 Fetching...";

  try {
   var result = await window.fetchPricingData();
   if (result === true) {
    closeModal();
    if (typeof window.showMilkCollectionForm === "function") {
     setTimeout(function () {
      window.showMilkCollectionForm();
     }, 300);
    }
   } else if (result === "empty") {
    closeModal();
    showMessageModal(
     "No Records Found",
     "No pricing records found on server.\n\nPlease import pricing data from Excel.",
     true,
    );
   } else {
    btn.disabled = false;
    btn.textContent = "\uD83D\uDD04 Fetch from Server";
   }
  } catch (error) {
   console.error("Fetch pricing error:", error);
   btn.disabled = false;
   btn.textContent = "\uD83D\uDD04 Fetch from Server";
   showMessageModal(
    "Error",
    "Fetch failed: " + ((error && error.message) || error),
    true,
   );
  }
 };

 el.querySelector("#" + mid + "_import").onclick = async function () {
  closeModal();
  try {
   if (typeof window.showImportPricing !== "function") {
    await loadExe2Fn(36, [], [1]);
   }
  } catch (e) {
   console.warn("Import pricing module load failed:", e);
  }
  if (typeof window.showImportPricing === "function") {
   window.showImportPricing();
  } else {
   showMessageModal("Error", "Import pricing is not available!", true);
  }
 };

 return el;
};

function renderMilkCategoryStrip() {
 const strip = document.getElementById("catStrip");
 if (!strip) return;
 strip.innerHTML = "";

 if (window.milk_categories && window.milk_categories.length > 0) {
  window.milk_categories.forEach((cat, index) => {
   const d = document.createElement("div");
   d.className = "cat-card";
   if (index === 0) d.classList.add("active");
   d.setAttribute("data-type", cat.type);
   d.setAttribute("data-a", cat.a);
   d.innerHTML = `
        <img class="cat-img" src="${cat.g}" alt="${cat.e}" loading="lazy" decoding="async" width="55" height="55" onerror="this.onerror=null;this.src='data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2255%22%20height=%2255%22%3E%3Crect%20width=%2255%22%20height=%2255%22%20fill=%22%2344577e%22%20rx=%2228%22/%3E%3C/svg%3E'">
        <div class="cat-name">${cat.e}</div>
      `;
   d.onclick = function () {
    document
     .querySelectorAll(".cat-card")
     .forEach((c) => c.classList.remove("active"));
    this.classList.add("active");
    const type = this.getAttribute("data-type");

    if (type === "form") {
     if (typeof window.showMilkCollectionForm === "function")
      window.showMilkCollectionForm();
    } else if (type === "person") {
     if (typeof window.showPersonList === "function")
      window.showPersonList("all");
    } else if (type === "pricing") {
     if (typeof window.showMilkPricing === "function")
      window.showMilkPricing();
    } else if (type === "payment") {
     if (typeof window.showMilkPaymentForm === "function")
      window.showMilkPaymentForm();
    } else if (type === "register") {
     if (typeof window.showDairyRegister === "function")
      window.showDairyRegister();
    } else if (type === "sangh") {
     if (typeof window.showSangh === "function")
      window.showSangh();
    }
   };
   strip.appendChild(d);
  });
  enableDragScroll(strip);
 }
}

function enableDragScroll(element) {
 if (!element) return;
 let isDown = false,
  startX,
  scrollLeft;
 element.addEventListener("mousedown", (e) => {
  isDown = true;
  element.classList.add("active");
  startX = e.pageX - element.offsetLeft;
  scrollLeft = element.scrollLeft;
 });
 element.addEventListener("mouseleave", () => {
  isDown = false;
  element.classList.remove("active");
 });
 element.addEventListener("mouseup", () => {
  isDown = false;
  element.classList.remove("active");
 });
 element.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - element.offsetLeft;
  element.scrollLeft = scrollLeft - (x - startX) * 2;
 });
}

// ============================================================
// ADMIN PANEL CONTROLLERS
// ============================================================

var _adminPanelModulesStarted = false;

function _relocatePrdContent(targetParent) {
 var pc = document.getElementById("prdContent");
 if (!pc || pc.parentElement === targetParent) return;
 targetParent.appendChild(pc);
}

window.showAdminPanel = async function (catA) {
 if (typeof pageLoader === "function") pageLoader(true);
 try {
  var _targetA = catA;
  // Activate the admin theme only while the admin panel is open so
  // the supplier design is never affected.
  if (!document.getElementById("adminPanelCss")) {
   var st = document.createElement("style");
   st.id = "adminPanelCss";
   st.innerHTML = adminAppCss;
   document.head.appendChild(st);
  }

  var strip = document.getElementById("catStrip");
  if (strip) strip.style.display = "flex";

  // Hide the supplier wrapper and render admin forms into #prdContent
  // relocated outside of it.
  var _mainBody = document.getElementById("main_body");
  _relocatePrdContent(_mainBody);
  var _milkContentEl = document.getElementById("milkContent");
  if (_milkContentEl) _milkContentEl.style.display = "none";

  // Cap admin content width on desktop (loses page-wrap max-width when moved).
  var _pcWrap = document.getElementById("prdContent");
  if (_pcWrap) {
   _pcWrap.style.maxWidth = "1080px";
   _pcWrap.style.margin = "0 auto";
   _pcWrap.style.width = "100%";
  }

  // Hide supplier portal pieces so they don't leak into admin (esp. cat 0).
  var _sb = document.getElementById("supplierDashboard");
  if (_sb) _sb.style.display = "none";

  var _bk = document.getElementById("backToSupplierBtn");
  if (_bk) _bk.style.display = "";

  // Load the merged admin modules once (csh ids 33-40).
  if (!_adminPanelModulesStarted) {
   _adminPanelModulesStarted = true;
   var adminModuleIds = [32, 34, 33, 35, 37, 38, 39, 40, 36];
   for (var mi = 0; mi < adminModuleIds.length; mi++) {
    try {
     await loadExe2Fn(adminModuleIds[mi], [], [1]);
    } catch (e) {
     console.warn(
      "Admin module load failed (csh id " + adminModuleIds[mi] + "):",
      e,
     );
    }
   }
  }

  renderMilkCategoryStrip();

  // Open the category whose milk_categories.a === 1 (fall back to first).
  function _openMilkCategoryByA(aVal) {
   var strip = document.getElementById("catStrip");
   if (!strip) return;
   var cats = strip.querySelectorAll(".cat-card");
   var target = null;
   for (var ci = 0; ci < cats.length; ci++) {
    if (String(cats[ci].getAttribute("data-a")) === String(aVal)) {
     target = cats[ci];
     break;
    }
   }
   if (!target && cats.length > 0) target = cats[0];
   if (target) {
    setTimeout(function () {
     target.click();
     if (typeof pageLoader === "function") pageLoader(false);
    }, 300);
   } else if (typeof pageLoader === "function") {
    pageLoader(false);
   }
  }

  // Open the passed category (a value), or open nothing when absent/0.
  var _shouldOpen = _targetA != null && String(_targetA) !== "0";
  if (_shouldOpen) {
   if (typeof dbDexieManager !== "undefined" && typeof dbnm !== "undefined") {
    var mbRecords = await dbDexieManager.getAllRecords(dbnm, "mb");
    if (!mbRecords || mbRecords.length === 0) {
     if (typeof window.showPricingRequiredModal === "function") {
      window.showPricingRequiredModal();
     }
    }
    _openMilkCategoryByA(_targetA);
   } else {
    _openMilkCategoryByA(_targetA);
   }
  } else {
   document.querySelectorAll(".cat-card").forEach(function (c) {
    c.classList.remove("active");
   });
   if (typeof pageLoader === "function") pageLoader(false);
  }
 } catch (e) {
  if (typeof pageLoader === "function") pageLoader(false);
  console.error("Admin panel open error:", e);
  throw e;
 }
};

window.showSupplierMode = async function () {
 var st = document.getElementById("adminPanelCss");
 if (st) st.remove();

 var strip = document.getElementById("catStrip");
 if (strip) strip.style.display = "none";

 var _bk2 = document.getElementById("backToSupplierBtn");
 if (_bk2) _bk2.style.display = "none";

 // Restore prdContent inside milkContent and show the wrapper again.
 var _milkContentEl2 = document.getElementById("milkContent");
 if (_milkContentEl2) {
  _relocatePrdContent(_milkContentEl2);
  _milkContentEl2.style.display = "block";
 }

 // Clear the admin-only inline width caps.
 var _pcRestore = document.getElementById("prdContent");
 if (_pcRestore) {
  _pcRestore.style.maxWidth = "";
  _pcRestore.style.margin = "";
  _pcRestore.style.width = "";
 }

 await showSupplierPortal();
};

// Admin is entered from the my1ctr module menu (moduLst d values).
window.toggleAdminPanel = async function (catA) {
 var adminActive = !!document.getElementById("adminPanelCss");
 if (adminActive) {
  await window.showSupplierMode();
 } else {
  await window.showAdminPanel(catA);
 }
};

// Executes a moduLst menu action from the my1ctr menu.
window.openAdminFromMenu = function (action) {
 try {
  var a = String(action || "").trim();
  if (/^window\.toggleAdminPanel\s*\(/.test(a)) {
   (0, eval)(a);
  } else if (a && typeof window[a] === "function") {
   window[a]();
  }
 } catch (e) {
  console.warn("Menu action failed:", action, e);
 }
};

appcss = `
:root {
  /* ============ BRAND ============ */
  --brand: #667eea;
  --brand-dark: #764ba2;
  --on-brand: #ffffff;
  --secondary: #5c6bc0;
  --brand-glow: rgba(102,126,234,0.4);
  --brand-glow-hero: rgba(102,126,234,0.38);
  --brand-glow-btn: rgba(102,126,234,0.32);
  --brand-glow-btn-hover: rgba(102,126,234,0.4);
  --brand-gradient: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);

  /* ============ PAGE BACKGROUND ============ */
  --bg-start: #dfe7ff;
  --bg-end: #eee5fb;
  --bg-gradient: linear-gradient(160deg, var(--bg-start) 0%, var(--bg-end) 100%);

  /* ============ TEXT ============ */
  --ink: #2c3154;
  --muted: #8a8fb8;
  --muted-strong: #5a5f8a;

  /* ============ SURFACES ============ */
  --surface: #f6f8ff;
  --surface-soft: #e9eefb;
  --surface-hover: #dce4f8;
  --surface-border: #dde3f5;
  --hint-bg: #eef0fb;
  --hint-border: #c3c8ea;

  /* ============ NAV ============ */
  --nav-bg: rgba(246,248,255,0.92);
  --nav-border: rgba(23,43,99,0.06);
  --shadow-color-05: rgba(23,43,99,0.05);
  --shadow-color-06: rgba(23,43,99,0.06);
  --shadow-color-07: rgba(23,43,99,0.07);
  --shadow-color-08: rgba(23,43,99,0.08);
  --shadow-color-10: rgba(23,43,99,0.1);

  /* ============ STATUS ============ */
  --success: #2e7d32;
  --success-bright: #4caf50;
  --success-bs: #28a745;
  --warning: #ef6c00;
  --warning-bright: #ff9800;
  --danger: #d63031;
  --danger-bs: #dc3545;
  --danger-soft-bg: #fff5f5;
  --danger-soft-border: #ffd4d4;
  --danger-soft-border-hover: #f39e9e;

  /* ============ ON-BRAND OVERLAYS ============ */
  --on-brand-08: rgba(255,255,255,0.08);
  --on-brand-20: rgba(255,255,255,0.2);
  --on-brand-22: rgba(255,255,255,0.22);
  --on-brand-55: rgba(255,255,255,0.55);

  /* ============ SHADOWS ============ */
  --shadow-nav: 0 2px 20px var(--shadow-color-08);
  --shadow-card: 0 4px 18px var(--shadow-color-07);
  --shadow-soft: 0 2px 8px var(--shadow-color-05);
  --shadow-login: 0 10px 34px var(--shadow-color-10);
  --shadow-brand-logo: 0 5px 14px var(--brand-glow);
  --shadow-brand-hero: 0 14px 34px var(--brand-glow-hero);
  --shadow-brand-btn: 0 8px 22px var(--brand-glow-btn);
  --shadow-brand-btn-hover: 0 12px 28px var(--brand-glow-btn-hover);
  --shadow-brand-xl: 0 12px 26px var(--brand-glow);

  /* ============ RADIUS ============ */
  --radius-sm: 8px;
  --radius-md: 13px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 22px;
  --radius-3xl: 24px;
  --radius-pill: 50%;

  /* ============ SPACING ============ */
  --space-1: 8px;
  --space-2: 10px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 18px;
  --space-6: 22px;

  /* ============ FONT SIZES ============ */
  --font-2xs: 10px;
  --font-xs: 12px;
  --font-sm: 13px;
  --font-md: 14px;
  --font-lg: 16px;
  --font-xl: 17px;
  --font-2xl: 18px;
  --font-3xl: 19px;
  --font-4xl: 20px;
  --font-5xl: 26px;
  --font-6xl: 30px;

  /* ============ TRANSITION ============ */
  --transition: all 0.2s;
}

* { box-sizing: border-box; }

body {
  margin: 0; padding: 0;
  background: var(--bg-gradient);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}

/* ============ TOP NAV ============ */
.topnav {
  position: sticky; top: 0; z-index: 9990;
  background: var(--nav-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  height: 64px; display: flex; align-items: center;
  justify-content: space-between; padding: 0 var(--space-5);
  box-shadow: var(--shadow-nav);
  border-bottom: 1px solid var(--nav-border);
}
.shopname {
  font-size: var(--font-xl); font-weight: 800; color: var(--ink);
  display: flex; align-items: center; gap: 11px;
  letter-spacing: 0.2px;
}
.brand-logo {
  width: 40px; height: 40px; border-radius: var(--radius-md);
  background: var(--brand-gradient);
  display: flex; align-items: center; justify-content: center;
  color: var(--on-brand); font-size: var(--font-3xl);
  box-shadow: var(--shadow-brand-logo);
}
.nav-icons { display: flex; gap: var(--space-2); }
.nav-btn {
  width: 42px; height: 42px; border-radius: var(--radius-pill);
  border: 2px solid var(--secondary); cursor: pointer;
  background: var(--surface-soft); color: var(--muted-strong);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-lg); transition: var(--transition);
}
.nav-btn:hover { background: var(--surface-hover); transform: scale(1.06); }
.nav-btn:active { transform: scale(0.95); }

/* ============ PAGE WRAP ============ */
.page-wrap {
  max-width: 660px; margin: 0 auto;
  padding: 20px 16px 50px;
}

/* ============ HERO ============ */
.hero-card {
  background: var(--brand-gradient);
  border-radius: var(--radius-xl); padding: var(--space-6);
  color: var(--on-brand); display: flex; align-items: center; gap: var(--space-4);
  box-shadow: var(--shadow-brand-hero);
  margin-bottom: var(--space-4);
  position: relative; overflow: hidden;
}
.hero-card::after {
  content: '';
  position: absolute; right: -40px; top: -40px;
  width: 150px; height: 150px;
  background: var(--on-brand-08);
  border-radius: var(--radius-pill);
}
.hero-avatar {
  width: 64px; height: 64px; border-radius: var(--radius-pill);
  background: var(--on-brand-20);
  border: 2px solid var(--on-brand-55);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-5xl); flex-shrink: 0;
}
.hero-chip {
  display: inline-block; font-size: var(--font-2xs); font-weight: 800;
  background: var(--on-brand-22); color: var(--on-brand);
  padding: 3px var(--space-2); border-radius: var(--radius-xl);
  letter-spacing: 0.6px; text-transform: uppercase;
}
.hero-name { font-size: var(--font-4xl); font-weight: 800; margin-top: 6px; word-break: break-word; }
.hero-sub { font-size: var(--font-sm); opacity: 0.92; margin-top: 2px; word-break: break-word; }

/* ============ STATS ============ */
.stats-row {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3); margin-bottom: var(--space-4);
}
.stat-card {
  background: var(--surface); border-radius: var(--radius-lg); padding: var(--space-4) var(--space-2);
  text-align: center;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--surface-border);
  transition: transform 0.2s;
}
.stat-card:hover { transform: translateY(-3px); }
.stat-icon {
  width: 42px; height: 42px; border-radius: var(--radius-md);
  margin: 0 auto 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-2xl); color: var(--on-brand);
}
.stat-label {
  font-size: var(--font-2xs); font-weight: 800; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.6px;
}
.stat-value { font-size: var(--font-xl); font-weight: 800; color: var(--ink); margin-top: 3px; }

/* ============ ACTION BUTTONS ============ */
.action-btn {
  display: flex; align-items: center; justify-content: center; gap: 9px;
  width: 100%; border: none; cursor: pointer;
  padding: 15px; border-radius: 14px;
  font-size: var(--font-md); font-weight: 700;
  transition: var(--transition); margin-bottom: 11px;
}
.action-btn:hover { transform: translateY(-2px); }
.action-primary {
  background: var(--brand-gradient);
  color: var(--on-brand);
  box-shadow: var(--shadow-brand-btn);
}
.action-primary:hover { box-shadow: var(--shadow-brand-btn-hover); }
.action-secondary {
  background: var(--surface); color: var(--ink);
  border: 1.5px solid var(--surface-border);
  box-shadow: var(--shadow-soft);
}
.action-secondary:hover { border-color: var(--brand); color: var(--brand); }
.action-logout {
  background: var(--surface); color: var(--danger);
  border: 1.5px solid var(--danger-soft-border);
}
.action-logout:hover { background: var(--danger-soft-bg); border-color: var(--danger-soft-border-hover); }

/* ============ ACTION GRID ============ */
.actions-grid {
  display: grid; grid-template-columns: 1fr;
  gap: 12px; margin-top: 2px;
}
.actions-grid .action-btn { margin-bottom: 0; }

/* ============ LOGIN CARD ============ */
.login-card {
  background: var(--surface); border-radius: var(--radius-2xl); padding: 40px 24px 32px;
  text-align: center;
  box-shadow: var(--shadow-login);
  border: 1px solid var(--shadow-color-05);
}
.login-icon {
  width: 76px; height: 76px; border-radius: var(--radius-3xl);
  background: var(--brand-gradient);
  color: var(--on-brand); font-size: var(--font-6xl);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto var(--space-5);
  box-shadow: var(--shadow-brand-xl);
}
.login-card h3 { margin: 0 0 var(--space-1); font-size: var(--font-4xl); font-weight: 800; color: var(--ink); }
.login-card p { margin: 0 0 var(--space-6); font-size: var(--font-md); color: var(--muted); line-height: 1.55; }

.hint-card {
  background: var(--hint-bg); border: 1px dashed var(--hint-border);
  border-radius: 14px; padding: 14px 16px;
  margin-top: var(--space-4); font-size: var(--font-xs); color: var(--muted-strong);
  display: flex; gap: var(--space-2); align-items: flex-start;
  line-height: 1.5; text-align: left;
}
.hint-card i { color: var(--brand); margin-top: 2px; }

/* ============ RESPONSIVE ============ */
@media (max-width: 767px) {
  .topnav { height: auto; min-height: 60px; padding: var(--space-1) 14px; }
  .shopname { font-size: 15px; }
  .brand-logo { width: 36px; height: 36px; font-size: var(--font-xl); }
  .nav-btn { width: 38px; height: 38px; font-size: 15px; }
  .page-wrap { padding: 14px 12px 40px; }
  .hero-card { padding: var(--space-5); }
  .hero-name { font-size: var(--font-xl); }
  .hero-avatar { width: 56px; height: 56px; font-size: 22px; }
  .stat-card { padding: 14px var(--space-1); }
}

@media (max-width: 420px) {
  .stats-row { gap: var(--space-1); }
  .stat-card { padding: var(--space-3) 6px; }
  .stat-value { font-size: 15px; }
  .login-card { padding: 30px var(--space-5) 24px; }
}

/* ============ DESKTOP ============ */
@media (min-width: 768px) {
  .page-wrap { max-width: 1080px; padding: 28px 32px 60px; }
  .hero-card { padding: 30px 28px; margin-bottom: var(--space-6); }
  .hero-avatar { width: 80px; height: 80px; font-size: 34px; }
  .hero-name { font-size: var(--font-5xl); }
  .hero-sub { font-size: 15px; }
  .stats-row { gap: 18px; margin-bottom: var(--space-6); }
  .stat-card { padding: 26px 20px; }
  .stat-icon { width: 54px; height: 54px; font-size: 22px; margin-bottom: 12px; }
  .stat-label { font-size: var(--font-sm); }
  .stat-value { font-size: 30px; }
  .actions-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .action-btn { padding: 16px; font-size: var(--font-lg); }
  .login-card { max-width: 460px; margin: 48px auto; }
}
`;

const __miTheme = (function () {
 function parseCss(cssText) {
  var vars = {};
  var re = /(--[\w-]+)\s*:\s*([^;{}]+);/g;
  var m;
  while ((m = re.exec(cssText))) {
   vars[m[1].trim()] = m[2].trim();
  }
  return { vars: vars };
 }

 function resolveVars(cssText, vars, depth) {
  if (vars === undefined) vars = parseCss(cssText).vars;
  if (depth === undefined) depth = 0;
  if (depth > 10) return cssText;
  return cssText.replace(
   /var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\s*\)/g,
   function (match, name, fallback) {
    var val = vars[name];
    if (val === undefined) {
     return fallback !== undefined ? fallback.trim() : match;
    }
    if (val.indexOf("var(") !== -1)
     return resolveVars(val, vars, depth + 1);
    return val;
   },
  );
 }

 function extractColors(value) {
  var colors = [];
  var seen = {};
  function push(type, raw, r, g, b, a) {
   var key = type + ":" + raw;
   if (seen[key]) return;
   seen[key] = true;
   colors.push({ type: type, raw: raw, r: r, g: g, b: b, a: a });
  }
  var hexRe =
   /#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;
  var m;
  while ((m = hexRe.exec(value))) {
   var hex = m[1];
   var r,
    g,
    b,
    a = 1;
   if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
   } else if (hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    a = parseInt(hex[3] + hex[3], 16) / 255;
   } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
   } else {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    a = parseInt(hex.slice(6, 8), 16) / 255;
   }
   push("hex", m[0], r, g, b, a);
  }
  var rgbRe =
   /rgba?\(\s*([\d.]+%?)\s*(?:,|\s)\s*([\d.]+%?)\s*(?:,|\s)\s*([\d.]+%?)\s*(?:[,\s/]\s*([\d.]+%?))?\s*\)/g;
  while ((m = rgbRe.exec(value))) {
   push(
    "rgb",
    m[0],
    parseFloat(m[1]),
    parseFloat(m[2]),
    parseFloat(m[3]),
    m[4] !== undefined
     ? m[4].indexOf("%") !== -1
      ? parseFloat(m[4]) / 100
      : parseFloat(m[4])
     : 1,
   );
  }
  var hslRe =
   /hsla?\(\s*([\d.]+)\s*(?:,|\s)\s*([\d.]+%?)\s*(?:,|\s)\s*([\d.]+%?)\s*(?:[,\s/]\s*([\d.]+%?))?\s*\)/g;
  while ((m = hslRe.exec(value))) {
   push(
    "hsl",
    m[0],
    parseFloat(m[1]),
    parseFloat(m[2]),
    parseFloat(m[3]),
    m[4] !== undefined
     ? m[4].indexOf("%") !== -1
      ? parseFloat(m[4]) / 100
      : parseFloat(m[4])
     : 1,
   );
  }
  return colors;
 }

 function analyzeTheme(cssText) {
  var parsed = parseCss(cssText);
  var vars = parsed.vars;
  var resolved = {};
  Object.keys(vars).forEach(function (name) {
   resolved[name] = resolveVars(vars[name], vars, 0);
  });

  var roles = [
   {
    name: "brandDark",
    keywords: ["brand-dark", "brand_dark", "branddark"],
   },
   { name: "onBrand", keywords: ["on-brand", "on_brand", "onbrand"] },
   { name: "glow", keywords: ["brand-glow", "brand_glow", "brandglow"] },
   { name: "brandGradient", keywords: ["brand-gradient", "brandgradient"] },
   {
    name: "background",
    keywords: [
     "bg-gradient",
     "background-gradient",
     "background",
     "page-bg",
     "pagebg",
     "bg",
    ],
   },
   { name: "bgStart", keywords: ["bg-start", "bgstart"] },
   { name: "bgEnd", keywords: ["bg-end", "bgend"] },
   { name: "successBright", keywords: ["success-bright"] },
   { name: "successBs", keywords: ["success-bs"] },
   { name: "warningBright", keywords: ["warning-bright"] },
   { name: "dangerBs", keywords: ["danger-bs"] },
   { name: "dangerSoftBg", keywords: ["danger-soft-bg"] },
   { name: "dangerSoftBorder", keywords: ["danger-soft-border"] },
   { name: "dangerSoftBorderHover", keywords: ["danger-soft-border-hover"] },
   { name: "surfaceSoft", keywords: ["surface-soft"] },
   { name: "surfaceHover", keywords: ["surface-hover"] },
   { name: "surfaceBorder", keywords: ["surface-border"] },
   { name: "hintBg", keywords: ["hint-bg"] },
   { name: "hintBorder", keywords: ["hint-border"] },
   { name: "navBg", keywords: ["nav-bg"] },
   { name: "navBorder", keywords: ["nav-border"] },
   { name: "shadowColor05", keywords: ["shadow-color-05"] },
   { name: "shadowColor06", keywords: ["shadow-color-06"] },
   { name: "shadowColor07", keywords: ["shadow-color-07"] },
   { name: "shadowColor08", keywords: ["shadow-color-08"] },
   { name: "shadowColor10", keywords: ["shadow-color-10"] },
   { name: "onBrand08", keywords: ["on-brand-08"] },
   { name: "onBrand20", keywords: ["on-brand-20"] },
   { name: "onBrand22", keywords: ["on-brand-22"] },
   { name: "onBrand55", keywords: ["on-brand-55"] },
   { name: "mutedStrong", keywords: ["muted-strong"] },
   { name: "muted", keywords: ["muted"] },
   { name: "brand", keywords: ["brand", "primary", "accent"] },
   { name: "secondary", keywords: ["secondary", "indigo"] },
   { name: "ink", keywords: ["ink", "text", "font-color", "fontcolor"] },
   { name: "surface", keywords: ["surface"] },
   { name: "lightBg", keywords: ["light-bg", "lightbg"] },
   { name: "success", keywords: ["success"] },
   { name: "warning", keywords: ["warning"] },
   { name: "danger", keywords: ["danger", "error"] },
  ];

  var assigned = {};
  var analysis = {};

  roles.forEach(function (role) {
   var best = null;
   var bestScore = 0;
   Object.keys(vars).forEach(function (name) {
    if (assigned[name]) return;
    var lower = name.toLowerCase().replace(/_/g, "-");
    var score = 0;
    role.keywords.forEach(function (kw) {
     if (lower.indexOf(kw) !== -1) score += kw.length;
    });
    if (score > bestScore) {
     bestScore = score;
     best = name;
    }
   });
   if (best && bestScore > 0) {
    analysis[role.name] = best;
    assigned[best] = true;
   } else {
    analysis[role.name] = null;
   }
  });

  // Heuristic fallback (keyword misses) using color-usage frequency.
  var bodyCss = cssText.replace(/:root\s*\{[\s\S]*?\}/, "");
  var freq = {};
  extractColors(resolveVars(bodyCss, vars, 0)).forEach(function (c) {
   var key = c.r + "," + c.g + "," + c.b;
   freq[key] = (freq[key] || 0) + 1;
  });
  var freqEntries = Object.keys(freq)
   .map(function (key) {
    var parts = key.split(",");
    return {
     key: key,
     count: freq[key],
     brightness:
      (parseInt(parts[0], 10) +
       parseInt(parts[1], 10) +
       parseInt(parts[2], 10)) /
      3,
    };
   })
   .sort(function (a, b) {
    return b.count - a.count || b.brightness - a.brightness;
   });

  var byColor = {};
  Object.keys(vars).forEach(function (name) {
   extractColors(resolved[name]).forEach(function (c) {
    var key = c.r + "," + c.g + "," + c.b;
    if (byColor[key] === undefined) byColor[key] = name;
   });
  });

  function pickByFrequency(index) {
   return freqEntries[index]
    ? byColor[freqEntries[index].key] || null
    : null;
  }
  function pickByBrightness(wantDarkest) {
   var sorted = freqEntries.slice().sort(function (a, b) {
    return wantDarkest
     ? a.brightness - b.brightness
     : b.brightness - a.brightness;
   });
   for (var i = 0; i < sorted.length; i++) {
    var tn = byColor[sorted[i].key];
    if (tn && !assigned[tn]) return tn;
   }
   return null;
  }
  if (!analysis.brand) {
   var b = pickByFrequency(0);
   if (b) {
    analysis.brand = b;
    assigned[b] = true;
   }
  }
  if (!analysis.secondary) {
   var s = pickByFrequency(1);
   if (s && !assigned[s]) {
    analysis.secondary = s;
    assigned[s] = true;
   }
  }
  if (!analysis.ink) {
   var i = pickByBrightness(true);
   if (i) {
    analysis.ink = i;
    assigned[i] = true;
   }
  }
  if (!analysis.background) {
   var bg = pickByBrightness(false);
   if (bg) {
    analysis.background = bg;
    assigned[bg] = true;
   }
  }
  if (!analysis.lightBg) analysis.lightBg = analysis.bgEnd;
  if (!analysis.surface) {
   var sf = pickByBrightness(false);
   if (sf && !assigned[sf]) {
    analysis.surface = sf;
    assigned[sf] = true;
   }
  }

  return analysis;
 }

 function camelize(name) {
  return name.replace(/^--/, "").replace(/-([a-z0-9])/g, function (m, c) {
   return c.toUpperCase();
  });
 }

 function resolvePalette(cssText) {
  var parsed = parseCss(cssText);
  var vars = parsed.vars;
  var resolved = {};
  Object.keys(vars).forEach(function (name) {
   resolved[name] = resolveVars(vars[name], vars, 0);
  });
  var analysis = analyzeTheme(cssText);
  var palette = {};
  Object.keys(analysis).forEach(function (role) {
   var tokenName = analysis[role];
   palette[role] = tokenName ? resolved[tokenName] : null;
  });
  Object.keys(resolved).forEach(function (name) {
   palette[camelize(name)] = resolved[name];
  });
  palette.tokens = resolved;
  return palette;
 }

 return {
  parseCss: parseCss,
  resolveVars: resolveVars,
  extractColors: extractColors,
  analyzeTheme: analyzeTheme,
  resolvePalette: resolvePalette,
 };
})();

window.__miTheme = __miTheme;
// Compute the palette lazily off the critical path so that parsing a few KB of
// CSS with regex passes does not block first paint. theme() below computes it
// on demand if it is needed before the deferred job runs.
var _palette = window.__palette || null;
if (!_palette) {
 if (typeof window.requestAnimationFrame === "function") {
  window.requestAnimationFrame(function () {
   _palette = __miTheme.resolvePalette(appcss);
  });
 } else {
  _palette = __miTheme.resolvePalette(appcss);
 }
}

function theme() {
 if (!_palette) {
  _palette = window.__palette || __miTheme.resolvePalette(appcss);
 }
 return _palette;
}

window.theme = theme;
window.__palette = _palette;

console.log("🥛 Supplier Portal loaded successfully!");
