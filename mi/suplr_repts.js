(function () {
  if (typeof window.closeModal !== "function") {
   window.closeModal = function (modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
     if (modal._escHandler) document.removeEventListener("keydown", modal._escHandler);
     modal.remove();
    }
   };
  }
  var T = {
    en: {
      billTitle: "Milk Bill",
      branch: "Branch",
      producer: "Producer",
      center: "Collection Center",
      milkType: "Milk Type",
      billNo: "Bill No.",
      from: "From",
      to: "To",
      period: "Period",
      date: "Date",
      morning: "Morning",
      evening: "Evening",
      qty: "Qty (L)",
      fat: "Fat",
      snf: "SNF",
      rate: "Rate",
      amount: "Amount",
      deductTitle: "Deductions",
      deductName: "Name",
      openBal: "Old Bal.",
      current: "Current",
      totalBal: "Total Bal.",
      deducted: "Deducted",
      remaining: "Remaining",
      totMilk: "Total Milk",
      totAmount: "Total Amount",
      totDeduct: "Total Deduction",
      netPayable: "Net Payable",
      print: "Print Bill",
      close: "Close",
      language: "मराठी",
      buffalo: "Buffalo",
      cow: "Cow",
    },
    mr: {
      billTitle: "दूध बिल",
      branch: "शाखा",
      producer: "उत्पादक",
      center: "दूध संकलन केंद्र",
      milkType: "दूध प्रकार",
      billNo: "बिल नं.",
      from: "पासून",
      to: "पर्यंत",
      period: "कालावधी",
      date: "दिनांक",
      morning: "सकाळ",
      evening: "सायंकाळ",
      qty: "दूध",
      fat: "फॅट",
      snf: "SNF",
      rate: "दर",
      amount: "रक्कम",
      deductTitle: "कपात",
      deductName: "कपात नाव",
      openBal: "मा. बाकी",
      current: "चालू",
      totalBal: "ए. बाकी",
      deducted: "कपात",
      remaining: "ये. बाकी",
      totMilk: "एकूण दूध",
      totAmount: "एकूण रक्कम",
      totDeduct: "एकूण कपात",
      netPayable: "निव्वळ अदा",
      print: "बिल छापा",
      close: "बंद",
      language: "English",
      buffalo: "म्हैस",
      cow: "गाय",
    },
  };

  var state = { lang: "mr" };
  var dataStore = null;
  var supplier = null;

  function fmtDateYYYYMMDD(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + dd;
  }

  function fmtDateDisplay(dateStr) {
    if (!dateStr) return "-";
    var d = new Date(dateStr);
    return (
      String(d.getDate()).padStart(2, "0") +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      d.getFullYear()
    );
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function money(n) {
    return n.toFixed(2);
  }

  function dec3(n) {
    return n.toFixed(3);
  }

  function currentMonthRange() {
    var now = new Date();
    var first = new Date(now.getFullYear(), now.getMonth(), 1);
    var last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: fmtDateYYYYMMDD(first), to: fmtDateYYYYMMDD(last) };
  }

  function custConst(key, dflt) {
    var ws = window[my1uzr.worknOnPg] || {};
    var cust = (ws.clientConfig && ws.clientConfig.cust_da_const) || {};
    var v = cust[key];
    return v === undefined || v === null ? dflt : v;
  }

  function replsDrpdnMode() {
    return custConst("reptsDrpdnOrFT", 0) == 1;
  }

  function replsTB() {
    return parseInt(custConst("reptsTB", 31), 10) || 31;
  }

  function fmtShortDDMM(dateStr) {
    if (!dateStr) return "-";
    var d = new Date(dateStr + "T00:00:00");
    return (
      String(d.getDate()).padStart(2, "0") +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0")
    );
  }

  function periodDateFull(ddmm, refDateStr) {
    var parts = String(ddmm).trim().split("-");
    var d = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var ref = new Date(refDateStr + "T00:00:00");
    return fmtDateYYYYMMDD(new Date(ref.getFullYear(), m - 1, d));
  }

  function repRangeOptions() {
    var tb = replsTB();
    var list = [];
    dataStore.r.forEach(function (rec) {
      if (parseInt(rec.tb, 10) !== tb) return;
      if (!rec.k || !rec.l) return;
      var rng = null;
      try {
        rng = JSON.parse(rec.l);
      } catch (e) {
        rng = null;
      }
      if (!rng || !rng.f || !rng.t) return;
      list.push({ k: rec.k, f: rng.f, t: rng.t, label: fmtShortDDMM(rec.k) });
    });
    list.sort(function (a, b) {
      return b.k < a.k ? -1 : b.k > a.k ? 1 : 0;
    });
    return list;
  }

  function animalOf(r, pricingMap) {
    if (r.k) return parseInt(r.h) || 0;
    var p = pricingMap[r.h];
    return p ? parseInt(p.f) || 0 : 0;
  }

  function pricingOf(r, pricingMap) {
    var id = r.k || r.h;
    return pricingMap[id] || {};
  }

  function billLabel() {
    return T[state.lang] || T.mr;
  }

  window.showCollectionReports = async function () {
    try {
      var allRecords = (await dbDexieManager.getAllRecords(dbnm, "mi")) || [];
      var allPricing = (await dbDexieManager.getAllRecords(dbnm, "mb")) || [];
      var allPayments = (await dbDexieManager.getAllRecords(dbnm, "r")) || [];
      var allSuppliers = [];
      try {
        allSuppliers =
          (await dbDexieManager.getAllRecords(dbnm, "c")) || [];
      } catch (err) {
        allSuppliers = [];
      }
      dataStore = {
        mi: allRecords,
        mb: allPricing,
        r: allPayments,
        c: allSuppliers,
      };
    } catch (err) {
      console.error("Reports data load error:", err);
      showMessageModal(
        "Error",
        "❌ " + (err.message || "Failed to load data"),
        true,
      );
      return;
    }

    // ✅ Resolve the logged-in supplier from my1uzr (mobile) + c table.
    //    Prefer the per-user workspace copy (set after login / refresh);
    //    otherwise find it here so reports stay on the right supplier.
    supplier =
      (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].currentSupplier) ||
      null;
    if (!supplier) {
      var supMobile = normalizePhone(my1uzr.mo || my1uzr.phone || "");
      var supRec =
        (dataStore.c || []).find(function (x) {
          return (
            x &&
            x.e &&
            normalizePhone(x.e) === supMobile &&
            String(x.f) === "1"
          );
        }) || null;
      if (supRec) {
        supplier = {
          a: parseInt(supRec.a),
          h: supRec.h || supRec.i || my1uzr.mn || "Supplier",
          e: supRec.e || my1uzr.mo || "Unknown",
          f: String(supRec.f || "1"),
          k: supRec.k || "",
        };
        if (window[my1uzr.worknOnPg]) {
          window[my1uzr.worknOnPg].currentSupplier = supplier;
        }
      }
    }

    if (!supplier) {
      showMessageModal(
        "Info",
        state.lang === "en"
          ? "⚠️ No supplier account found. Please click Refresh to sync data."
          : "⚠️ खाता आढळले नाही. डेटा सिंक करण्यासाठी कृपया Refresh वर क्लिक करा.",
        false,
      );
      return;
    }

    var range = currentMonthRange();
    state.from = range.from;
    state.to = range.to;
    state.billNo =
      "BILL-" + (supplier.a || "") + "-" + state.from.substr(0, 7).replace("-", "");
    state.animal = "1";

    buildModal();
  };

  function appMeta() {
    return {
      business: window[my1uzr.worknOnPg].clientConfig?.business || "शाखा",
      city: window[my1uzr.worknOnPg].clientConfig?.city || "",
    };
  }

  function hideRepCols() {
    return (
      window[my1uzr.worknOnPg] &&
      window[my1uzr.worknOnPg].clientConfig?.colsToHideSupplierReports === "1"
    );
  }

  function supplierCode() {
    var sk = supplier.k;
    if (!sk && dataStore.c.length) {
      var rec = dataStore.c.find(function (x) {
        return parseInt(x.a) === parseInt(supplier.a);
      });
      if (rec) sk = rec.k || "";
    }
    return sk || String(supplier.a || "");
  }

  function supplierName() {
    return supplier.h || my1uzr.mn || "उत्पादक";
  }

  function supplierPhone() {
    return supplier.e || my1uzr.mo || my1uzr.phone || "";
  }

  function animalName(a) {
    var l = billLabel();
    return a == 1 ? l.buffalo : a == 2 ? l.cow : "-";
  }

  function buildModal() {
    var modalId = "collectionReportModal";
    var existing = document.getElementById(modalId);
    if (existing) existing.remove();
    ["repPrintFrame", "supplierPrintFrame", "printBillArea"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });

    var l = billLabel();

    var rangeCtrls = "";
    if (replsDrpdnMode()) {
      var ropts = repRangeOptions();
      var selIdx =
        state.rngIdx !== undefined && state.rngIdx >= 0 && state.rngIdx < ropts.length
          ? state.rngIdx
          : 0;
      if (ropts.length) {
        var def = ropts[selIdx];
        state.from = periodDateFull(def.f, def.k);
        state.to = periodDateFull(def.t, def.k);
      }
      var optsHtml = "";
      if (ropts.length) {
        ropts.forEach(function (o, i) {
          optsHtml +=
            '<option value="' +
            i +
            '"' +
            (i === selIdx ? " selected" : "") +
            ">" +
            o.label +
            "</option>";
        });
      } else {
        optsHtml = '<option value="-1">-</option>';
      }
      rangeCtrls =
        '<div class="rep-field">' +
        '<span class="rep-label">📅 ' +
        l.period +
        "</span>" +
        '<select class="rep-input rep-select" id="repRngDrp" onchange="repSetRange(this.value)">' +
        optsHtml +
        "</select>" +
        "</div>";
    } else {
      rangeCtrls =
        '<div class="rep-field">' +
        '<span class="rep-label">📅 ' +
        l.from +
        "</span>" +
        '<input type="date" class="rep-input" id="repFrom" value="' +
        state.from +
        '" onchange="repRender()">' +
        "</div>" +
        '<div class="rep-field">' +
        '<span class="rep-label">📅 ' +
        l.to +
        "</span>" +
        '<input type="date" class="rep-input" id="repTo" value="' +
        state.to +
        '" onchange="repRender()">' +
        "</div>";
    }

    var html =
      '<div id="' +
      modalId +
      '" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,15,35,0.6);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;animation:repFadeIn 0.25s ease;" onclick="if(event.target===this)window.closeModal(\'' +
      modalId +
      '\')">' +
      "<style>" +
      "@keyframes repFadeIn{from{opacity:0}to{opacity:1}}" +
      "@keyframes repZoomIn{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}" +
      "#" +
      modalId +
      ",#" +
      modalId +
      " *{box-sizing:border-box}" +
      "#" +
      modalId +
      " .rep-modal{background:#fff;border-radius:18px;max-width:1120px;width:100%;max-height:96vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 25px 70px rgba(0,0,0,0.35),0 4px 12px rgba(0,0,0,0.15);animation:repZoomIn 0.3s ease}" +
      "#" +
      modalId +
      " .rep-head{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;gap:10px}" +
      "#" +
      modalId +
      " .rep-head-title{font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
      "#" +
      modalId +
      " .rep-close{width:36px;height:36px;border:none;border-radius:50%;background:rgba(255,255,255,0.15);color:#fff;font-size:20px;line-height:1;cursor:pointer;flex-shrink:0}" +
      "#" +
      modalId +
      " .rep-controls{padding:12px 16px;background:#f4f5fb;border-bottom:1px solid #e4e6f2;flex-shrink:0}" +
      "#" +
      modalId +
      " .rep-control-row{display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end}" +
      "#" +
      modalId +
      " .rep-field{display:flex;flex-direction:column;gap:3px;min-width:0}" +
      "#" +
      modalId +
      " .rep-label{font-size:10px;font-weight:700;color:#5c6bc0}" +
      "#" +
      modalId +
      " .rep-input{border:1.5px solid #c3c8ea;border-radius:8px;padding:6px 8px;font-size:12px;min-width:110px;background:#fff}" +
      " .rep-select{min-width:110px;width:100%}" +
      "#" +
      modalId +
      " .rep-seg{display:flex;border:1.5px solid #5c6bc0;border-radius:8px;overflow:hidden;background:#fff;width:100%}" +
      "#" +
      modalId +
      " .rep-seg-btn{border:none;background:transparent;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;color:#5c6bc0;flex:1}" +
      "#" +
      modalId +
      " .rep-seg-btn.on{background:#667eea;color:#fff}" +
      "#" +
      modalId +
      " .rep-btn{flex:1;border:none;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap}" +
      "#" +
      modalId +
      " .rep-btn-print{background:#2e7d32;color:#fff}" +
      "#" +
      modalId +
      " .rep-actions{display:flex;gap:6px}" +
      "#" +
      modalId +
      " .rep-scroll{overflow-y:auto;flex:1;display:flex;flex-direction:column}" +
      "#" +
      modalId +
      " .rep-body{padding:16px;overflow:visible}" +
      "#" +
      modalId +
      " .rep-paper{max-width:720px;margin:0 auto;background:#fff;border:1px solid #e3e3e3;box-shadow:0 3px 14px rgba(0,0,0,0.12);padding:0 14px 14px}" +
      "#" +
      modalId +
      " .bill-table{width:100%;border-collapse:collapse;font-size:11px}" +
      "#" +
      modalId +
      " .bill-table th,.bill-table td{border:1px solid #000;padding:4px 3px;text-align:center;vertical-align:middle}" +
      "#" +
      modalId +
      " .bill-table thead th{background:#f0f0f0;font-weight:700}" +
      "#" +
      modalId +
      " .rep-red{color:#d32f2f;font-weight:700}" +
      "#" +
      modalId +
      " .rep-tot-label{text-align:left!important;font-weight:700}" +
      "#" +
      modalId +
      " .rep-net{font-size:14px;font-weight:800}" +
      "#" +
      modalId +
      " .rep-left{text-align:left!important}" +
      "@media (max-width:600px){" +
      "#" +
      modalId +
      " .rep-paper{padding:0 6px 8px;font-size:10px}" +
      "#" +
      modalId +
      " .bill-table{font-size:9px}" +
      "#" +
      modalId +
      " .rep-input{min-width:90px}" +
      "#" +
      modalId +
      " .rep-select{min-width:90px;width:100%}" +
      "#" +
      modalId +
      " .rep-control-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));align-items:end}" +
      "#" +
      modalId +
      " .rep-actions{grid-column:1/-1}" +
      "#" +
      modalId +
      " .rep-actions .rep-btn{flex:1}" +
      "}" +
      "@media (max-width:380px){" +
      "#" +
      modalId +
      " .rep-control-row{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}" +
      "}" +
      "@media print{" +
      "#" +
      modalId +
      "{background:#fff!important;backdrop-filter:none;padding:0;align-items:flex-start}" +
      "#" +
      modalId +
      " .rep-head,#" +
      modalId +
      " .rep-controls{display:none!important}" +
      "#" +
      modalId +
      " .rep-modal{max-width:100%;max-height:none;border-radius:0;box-shadow:none;overflow:visible}" +
      "#" +
      modalId +
      " .rep-scroll{overflow:visible}" +
      "#" +
      modalId +
      " .rep-body{padding:0;overflow:visible}" +
      "#" +
      modalId +
      " .rep-paper{box-shadow:none;border:none;max-width:100%}" +
      "#" +
      modalId +
      " .bill-table th,#" +
      modalId +
      " .bill-table td{border-color:#000;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
      "}" +
      "</style>" +
      '<div class="rep-modal">' +
      '<div class="rep-head">' +
      '<div class="rep-head-title">📊 ' +
      l.billTitle +
      " — " +
      esc(supplierName()) +
      "</div>" +
      '<button class="rep-close" onclick="window.closeModal(\'' +
      modalId +
      '\')" title="Close">&times;</button>' +
      "</div>" +
      '<div class="rep-scroll">' +
      '<div class="rep-controls no-print">' +
      '<div class="rep-control-row">' +
      '<div class="rep-field">' +
      '<span class="rep-label">' +
      l.milkType +
      "</span>" +
      '<div class="rep-seg" id="repAnimalSeg">' +
      '<button class="rep-seg-btn on" data-a="1" onclick="repSetAnimal(1)">' +
      l.buffalo +
      "</button>" +
      '<button class="rep-seg-btn" data-a="2" onclick="repSetAnimal(2)">' +
      l.cow +
      "</button>" +
      "</div>" +
      "</div>" +
      '<div class="rep-field">' +
      '<span class="rep-label">🌐 ' +
      l.language +
      "</span>" +
      '<div class="rep-seg" id="repLangSeg">' +
      '<button class="rep-seg-btn on" data-l="mr" onclick="repSetLang(\'mr\')">मराठी</button>' +
      '<button class="rep-seg-btn" data-l="en" onclick="repSetLang(\'en\')">EN</button>' +
      "</div>" +
      "</div>" +
      (hideRepCols()
        ? ""
        : '<div class="rep-field">' +
          '<span class="rep-label">' +
          l.billNo +
          "</span>" +
          '<input class="rep-input" id="repBillNo" value="' +
          esc(state.billNo) +
          '" oninput="repRender()" style="min-width:130px;">' +
          "</div>") +
      (rangeCtrls) +
      '<div class="rep-field rep-actions">' +
      '<button class="rep-btn rep-btn-print" onclick="repPrint()"><i class="fas fa-print"></i> ' +
      l.print +
      "</button>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="rep-body">' +
      '<div class="rep-paper" id="repBillPaper"></div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    var div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div.firstElementChild);

    var modalRoot = document.getElementById(modalId);
    modalRoot._escHandler = function (ev) {
      if (ev.key === "Escape" && document.getElementById(modalId)) {
        window.closeModal(modalId);
      }
    };
    document.addEventListener("keydown", modalRoot._escHandler);

    syncSegActive();
    repRender();
  }

  function deducGroups() {
    var supplierId = parseInt(supplier.a);
    var groups = {};
    dataStore.r.forEach(function (rec) {
      if (parseInt(rec.h) !== supplierId) return;
      var dStr = rec.k || "";
      var key = rec.note && rec.note.trim ? rec.note.trim() : "";
      if (!key) key = parseInt(rec.f) === 2 ? "B" : "A";
      if (!groups[key]) {
        groups[key] = { name: key, before: 0, current: 0 };
      }
      var amt = parseFloat(rec.j) || 0;
      if (dStr && dStr < state.from) groups[key].before += amt;
      else if (dStr && dStr >= state.from && dStr <= state.to)
        groups[key].current += amt;
    });

    var rows = [];
    for (var k in groups) {
      var g = groups[k];
      var nm =
        g.name === "B"
          ? "Payment"
          : g.name === "A"
          ? "Received"
          : g.name;
      var totalBal = g.before + g.current;
      rows.push({
        name: nm,
        before: g.before,
        current: g.current,
        total: totalBal,
        deducted: g.current,
        remaining: totalBal - g.current,
      });
    }

    rows.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    var totCurrent = 0;
    rows.forEach(function (r) {
      totCurrent += r.current;
    });

    return { rows: rows, total: totCurrent };
  }

  function repRender() {
    var l = billLabel();
    var paper = document.getElementById("repBillPaper");
    if (!paper) return;

    var fromEl = document.getElementById("repFrom");
    var toEl = document.getElementById("repTo");
    var from = fromEl && fromEl.value ? fromEl.value : state.from;
    var to = toEl && toEl.value ? toEl.value : state.to;
    var billNoEl = document.getElementById("repBillNo");
    var billNo = billNoEl ? billNoEl.value : state.billNo;
    var animal = parseInt(state.animal) || 1;

    state.from = from;
    state.to = to;
    state.billNo = billNo;

    var supplierId = parseInt(supplier.a);
    var pricingMap = {};
    dataStore.mb.forEach(function (p) {
      pricingMap[p.a] = p;
    });

    var fromDate = new Date(from + "T00:00:00");
    var toDate = new Date(to + "T23:59:59");

    var rowsMap = {};
    dataStore.mi.forEach(function (r) {
      if (parseInt(r.e) !== supplierId) return;
      if (animalOf(r, pricingMap) !== animal) return;
      var dObj = new Date(r.f + "T00:00:00");
      if (dObj < fromDate || dObj > toDate) return;

      var dStr = r.f;
      var session = parseInt(r.g) === 2 ? "ev" : "mo";
      if (!rowsMap[dStr]) {
        rowsMap[dStr] = { date: dStr, mo: null, ev: null };
      }
      var slot = rowsMap[dStr][session];
      var p = pricingOf(r, pricingMap);
      var qty = parseFloat(r.i) || 0;
      var rate = parseFloat(p.i) || 0;
      var amount = parseFloat(r.j) || qty * rate;
      if (!slot) {
        rowsMap[dStr][session] = {
          qty: qty,
          amount: amount,
          fat: parseFloat(p.g) || 0,
          snf: parseFloat(p.h) || 0,
          rate: rate,
        };
      } else {
        slot.qty += qty;
        slot.amount += amount;
        slot.rate = rate;
        slot.fat = slot.fat ? (slot.fat + parseFloat(p.g) || 0) / 2 : parseFloat(p.g) || 0;
        slot.snf = slot.snf ? (slot.snf + parseFloat(p.h) || 0) / 2 : parseFloat(p.h) || 0;
      }
    });

    var dates = Object.keys(rowsMap).sort();

    var totMoQty = 0,
      totEvQty = 0,
      totMoAmt = 0,
      totEvAmt = 0;

    var bodyRows = "";
    var sessCells = function (s) {
      if (!s) return "<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>";
      return (
        "<td>" +
        window.fmtMilk(s.qty) +
        "</td><td>" +
        window.fmtFat(s.fat) +
        "</td><td>" +
        window.fmtSnf(s.snf) +
        "</td><td>" +
        money(s.rate) +
        "</td><td>" +
        money(s.amount) +
        "</td>"
      );
    };
    dates.forEach(function (d) {
      var row = rowsMap[d];
      var mo = row.mo || null;
      var ev = row.ev || null;
      totMoQty += mo ? mo.qty : 0;
      totEvQty += ev ? ev.qty : 0;
      totMoAmt += mo ? mo.amount : 0;
      totEvAmt += ev ? ev.amount : 0;
      bodyRows +=
        "<tr>" +
        "<td>" +
        fmtDateDisplay(d) +
        "</td>" +
        sessCells(mo) +
        sessCells(ev) +
        "</tr>";
    });

    if (!bodyRows) {
      bodyRows =
        '<tr><td colspan="11" style="text-align:center;color:#999;padding:18px;">No records</td></tr>';
    }

    var deduc = deducGroups();
    var dedRows = "";
    deduc.rows.forEach(function (g) {
      dedRows +=
        "<tr>" +
        '<td class="rep-left">' +
        esc(g.name) +
        "</td>" +
        "<td>" +
        money(g.before) +
        "</td>" +
        "<td>" +
        money(g.current) +
        "</td>" +
        "<td>" +
        money(g.total) +
        "</td>" +
        '<td class="rep-red">' +
        money(g.deducted) +
        "</td>" +
        "<td>" +
        money(g.remaining) +
        "</td>" +
        "</tr>";
    });
    if (!dedRows) {
      dedRows =
        '<tr><td colspan="6" style="text-align:center;color:#999;padding:14px;">-</td></tr>';
    }

    var totQty = totMoQty + totEvQty;
    var totAmt = totMoAmt + totEvAmt;
    var netPayable = totAmt - deduc.total;

    var meta = appMeta();
    var aLabel = animalName(animal);

    var mainTable =
      '<table class="bill-table">' +
      "<thead>" +
      '<tr><th rowspan="2" style="min-width:74px;">' +
      l.date +
      "</th>" +
      '<th colspan="5" style="border-bottom:1px solid #000;">' +
      l.morning +
      "</th>" +
      '<th colspan="5" style="border-bottom:1px solid #000;">' +
      l.evening +
      "</th></tr>" +
      "<tr>" +
      "<th>" +
      l.qty +
      "</th><th>" +
      l.fat +
      "</th><th>" +
      l.snf +
      "</th><th>" +
      l.rate +
      "</th><th>" +
      l.amount +
      "</th>" +
      "<th>" +
      l.qty +
      "</th><th>" +
      l.fat +
      "</th><th>" +
      l.snf +
      "</th><th>" +
      l.rate +
      "</th><th>" +
      l.amount +
      "</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody>" +
      bodyRows +
      "</tbody>" +
      "</table>";

    var dedTable =
      '<table class="bill-table" style="margin-top:14px;">' +
      "<thead><tr>" +
      "<th>" +
      l.deductName +
      "</th><th>" +
      l.openBal +
      "</th><th>" +
      l.current +
      "</th><th>" +
      l.totalBal +
      "</th><th>" +
      l.deducted +
      "</th><th>" +
      l.remaining +
      "</th>" +
      "</tr></thead><tbody>" +
      dedRows +
      "</tbody></table>";

    var html =
      '<div style="text-align:center;padding:8px 0 2px;border-bottom:2px solid #000;margin-bottom:8px;">' +
      '<div style="font-size:13px;font-weight:800;">' +
      esc(meta.business) +
      (meta.city ? ", " + esc(meta.city) : "") +
      "</div>" +
      '<div style="font-size:11px;margin-top:2px;">' +
      l.billTitle +
      "</div>" +
      "</div>" +
      '<table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px;">' +
      "<tbody>" +
      (hideRepCols()
        ? ""
        : '<tr><td style="padding:2px;">' +
          l.branch +
          ": <strong>" +
          esc(meta.business) +
          "</strong></td>" +
          (hideRepCols()
            ? ""
            : '<td style="padding:2px;">' +
              l.billNo +
              ": <strong>" +
              esc(billNo) +
              "</strong></td>") +
          "</tr>") +
      '<tr><td style="padding:2px;">' +
      l.producer +
      ": <strong>" +
      esc(supplierName()) +
      " (" +
      esc(supplierCode()) +
      ")</strong></td>" +
      '<td style="padding:2px;">' +
      l.milkType +
      ": <strong>" +
      aLabel +
      "</strong></td></tr>" +
      '<tr><td style="padding:2px;">' +
      l.center +
      ": <strong>" +
      esc(meta.business) +
      "</strong></td>" +
      '<td style="padding:2px;">' +
      l.from +
      ": " +
      fmtDateDisplay(from) +
      " &nbsp;→&nbsp; " +
      l.to +
      ": " +
      fmtDateDisplay(to) +
      "</td></tr>" +
      "</tbody>" +
      "</table>" +
      mainTable +
      '<div style="text-align:center;font-weight:800;margin:10px 0 6px;text-decoration:underline;">' +
      l.deductTitle +
      "</div>" +
      dedTable +
      '<table style="width:100%;border-collapse:collapse;font-size:11px;margin-top:12px;">' +
      "<tbody>" +
      '<tr><td style="padding:3px;">' +
      l.totMilk +
      ': <strong>' +
      window.fmtMilk(totQty) +
      " L</strong></td><td style=\"padding:3px;text-align:right;\">" +
      l.totAmount +
      ': <strong>₹' +
      money(totAmt) +
      "</strong></td></tr>" +
      '<tr><td style="padding:3px;">' +
      l.totDeduct +
      ': <strong style="color:#d32f2f;">₹' +
      money(deduc.total) +
      "</strong></td><td style=\"padding:3px;text-align:right;\">" +
      l.netPayable +
      ': <strong class="rep-red rep-net">₹' +
      money(netPayable) +
      "</strong></td></tr>" +
      "</tbody>" +
      "</table>" +
      '<div style="text-align:right;font-size:9px;color:#999;margin-top:10px;border-top:1px solid #ccc;padding-top:4px;">' +
      (supplierPhone() ? "📱 " + esc(supplierPhone()) + " &nbsp;·&nbsp; " : "") +
      fmtDateDisplay(fmtDateYYYYMMDD(new Date())) +
      "</div>";

    paper.innerHTML = html;
  }

  window.repSetAnimal = function (a) {
    state.animal = String(a);
    syncSegActive();
    repRender();
  };

  window.repSetLang = function (l) {
    if (l !== "en" && l !== "mr") return;
    state.lang = l;
    buildModal();
  };

  window.repSetRange = function (idx) {
    idx = parseInt(idx, 10);
    if (isNaN(idx) || idx < 0) return;
    var opts = repRangeOptions();
    var o = opts[idx];
    if (!o) return;
    state.rngIdx = idx;
    state.from = periodDateFull(o.f, o.k);
    state.to = periodDateFull(o.t, o.k);
    repRender();
  };

  window.repPrint = function () {
    var paper = document.getElementById("repBillPaper");
    if (!paper) return;
    var printFrame = document.createElement("iframe");
    printFrame.id = "repPrintFrame";
    printFrame.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;border:none;";
    document.body.appendChild(printFrame);
    var doc = printFrame.contentWindow.document;
    doc.open();
    doc.write(
      "<html><head><title>Milk Bill</title><style>" +
        "body{font-family:'Noto Sans Devanagari',Arial,sans-serif;margin:14px;}" +
        ".bill-table{width:100%;border-collapse:collapse;font-size:11px;}" +
        ".bill-table th,.bill-table td{border:1px solid #000;padding:4px 3px;text-align:center;}" +
        ".bill-table thead th{background:#f0f0f0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}" +
        ".rep-red{color:#d32f2f;font-weight:700;}" +
        ".rep-left{text-align:left!important;}" +
        "@media print{body{margin:8px;}}.rep-tot-label{text-align:left!important;font-weight:700}.rep-net{font-size:14px;font-weight:800}" +
        "</style></head><body>" +
        paper.innerHTML +
        "</body></html>"
    );
    doc.close();
    var cleanup = function () {
      if (printFrame && printFrame.parentNode) printFrame.parentNode.removeChild(printFrame);
    };
    printFrame.contentWindow.addEventListener("afterprint", cleanup);
    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();
    setTimeout(cleanup, 2000);
  };

  function syncSegActive() {
    var seg = document.getElementById("repAnimalSeg");
    if (seg) {
      var btns = seg.querySelectorAll(".rep-seg-btn");
      btns.forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-a") === state.animal);
      });
    }
    var lseg = document.getElementById("repLangSeg");
    if (lseg) {
      var lbl = lseg.querySelectorAll(".rep-seg-btn");
      lbl.forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-l") === state.lang);
      });
    }
  }
})();