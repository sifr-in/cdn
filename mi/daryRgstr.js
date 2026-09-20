// dairy_register.js - Dairy Register (grouped header table, live from IndexedDB)

function initDairyRegister() {}

window.showDairyRegister = function () {
  var container = document.getElementById("prdContent");
  if (!container) return;

  var now = new Date();
  var firstDay = formatDateYYYYMMDD(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  var lastDay = formatDateYYYYMMDD(
    new Date(now.getFullYear(), now.getMonth() + 1, 0),
  );

  var html = "";

  html += "<style>";
  html +=
    ".dr-card { background:var(--surface); border-radius:12px; padding:14px; border:1px solid var(--border); box-shadow:0 2px 10px rgba(0,0,0,0.06); }";
  html +=
    ".dr-header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px 12px; background:linear-gradient(135deg,#1a237e 0%,#283593 100%); color:#fff; padding:10px 16px; border-radius:10px; margin-bottom:12px; }";
  html +=
    ".dr-header-title { font-size:16px; font-weight:800; letter-spacing:0.5px; display:flex; align-items:center; gap:8px; }";
  html +=
    ".dr-header-range { font-size:12px; font-weight:600; opacity:0.95; }";
  html +=
    ".dr-header-society { font-size:13px; font-weight:700; letter-spacing:0.3px; }";
  html +=
    ".dr-filters { display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end; background:var(--surface-2); padding:10px; border-radius:10px; border:1px solid var(--border); margin-bottom:12px; }";
  html += ".dr-filter-item { flex:1; min-width:110px; }";
  html +=
    ".dr-label { font-size:11px; font-weight:700; color:#37474f; display:block; margin-bottom:3px; }";
  html +=
    ".dr-input { font-size:12px; padding:5px 8px; border:1.5px solid #90a4ae; border-radius:6px; width:100%; background:var(--surface-3); }";
  html +=
    ".dr-input:focus { outline:none; border-color:#1a237e; box-shadow:0 0 0 3px rgba(26,35,126,0.15); }";
  html +=
    ".dr-btn { background:#1a237e; color:#fff; border:none; padding:7px 20px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; transition:background 0.2s; }";
  html += ".dr-btn:hover { background:#283593; }";
  html +=
    ".dr-btn-print { background:#ff9800; } .dr-btn-print:hover { background:#e65100; }";
  html +=
    ".dr-scroll { overflow:auto; max-height:62vh; border:1px solid var(--border); border-radius:10px; }";
  html +=
    ".dr-table { width:100%; border-collapse:collapse; font-family:'Inter','Poppins','Segoe UI',Arial,sans-serif; font-size:11px; background:var(--surface); min-width:1180px; }";
  html +=
    ".dr-table th, .dr-table td { border:1px solid var(--border); padding:6px 7px; white-space:nowrap; }";
  html +=
    ".dr-table thead th { background:var(--surface-2); color:#1a237e; font-weight:700; text-align:center; position:sticky; top:0; z-index:2; }";
  html +=
    ".dr-table tbody tr:nth-child(even) { background:var(--surface-2); }";
  html += ".dr-table tbody tr:hover { background:#EFEAFF; }";
  html += ".dr-table td.num { text-align:right; font-variant-numeric:tabular-nums; }";
  html += ".dr-table td.ctr { text-align:center; }";
  html +=
    ".dr-table .grp-sep, .dr-table .grp-sep th { border-left:2px solid #90a4ae; }";
  html +=
    ".dr-table .grp-head { background:var(--surface-2); color:#1a237e; letter-spacing:1px; }";
  html += ".dr-table td.inc-pos { color:#2e7d32; font-weight:700; }";
  html += ".dr-table td.inc-neg { color:#c62828; font-weight:700; }";
  html += ".dr-empty { text-align:center; color:#999; padding:26px; font-size:13px; }";
  html +=
    "@media (max-width:768px){ .dr-table{ font-size:10px; } .dr-table th,.dr-table td{ padding:4px 5px; } .dr-filters{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; align-items:end; } .dr-filter-item{ min-width:0 !important; } .dr-filter-item:nth-child(1){ grid-column:1 / 3; } .dr-filter-item:nth-child(2){ grid-column:3; } .dr-filter-item:nth-child(3){ grid-column:1; } .dr-filter-item:nth-child(4){ grid-column:2; } .dr-filter-item:nth-child(5){ grid-column:3; } }";
  html += "@media print { .no-print { display:none !important; } }";
  html += "</style>";

  html += '<div class="dr-card">';

  html += '<div class="dr-header">';
  html +=
    '<div class="dr-header-title"><i class="fas fa-book"></i>DAIRY REGISTER</div>';
  html +=
    '<div class="dr-header-range" id="drHeaderRange">From: ' +
    formatDateDisplay(firstDay) +
    " &nbsp; To: " +
    formatDateDisplay(lastDay) +
    "</div>";
  html +=
    '<div class="dr-header-society">Dairy Cooperative Society</div>';
  html += "</div>";

  html += '<div class="dr-filters no-print">';

  html += '<div class="dr-filter-item">';
  html += '<label class="dr-label">📅 From</label>';
  html +=
    '<input type="date" id="drFromDate" class="dr-input" value="' +
    firstDay +
    '">';
  html += "</div>";

  html += '<div class="dr-filter-item">';
  html += '<label class="dr-label">📅 To</label>';
  html +=
    '<input type="date" id="drToDate" class="dr-input" value="' +
    lastDay +
    '">';
  html += "</div>";

  html += '<div class="dr-filter-item" style="flex:0.55; min-width:92px;">';
  html += '<label class="dr-label">🐄 Animal</label>';
  html +=
    '<select id="drAnimal" class="dr-input"><option value="all">All</option><option value="1">🐃 Buffalo</option><option value="2">🐄 Cow</option></select>';
  html += "</div>";

  html += '<div class="dr-filter-item" style="flex:0.6; min-width:100px;">';
  html +=
    '<button class="dr-btn" onclick="window.applyDairyRegisterFilter()"><i class="fas fa-filter"></i> Apply</button>';
  html += "</div>";

  html += '<div class="dr-filter-item" style="flex:0.5; min-width:90px;">';
  html +=
    '<button class="dr-btn dr-btn-print" onclick="window.printDairyRegister()"><i class="fas fa-print"></i> Print</button>';
  html += "</div>";

  html += "</div>";

  html += '<div class="dr-scroll" id="drScroll">';
  html += '<table class="dr-table" id="drTable">';
  html += "<thead>";
  html += "<tr>";
  html += '<th colspan="2">ANIMAL TYPE</th>';
  html += "<th>MEMBERS</th>";
  html += "<th>MILK</th>";
  html += "<th>AMOUNT</th>";
  html += '<th colspan="2" class="grp-sep">LOCAL</th>';
  html += '<th colspan="2">PREMIUM</th>';
  html += '<th colspan="2">LOW GRADE</th>';
  html += '<th colspan="2">REJECTED</th>';
  html += '<th colspan="2" class="grp-sep">TOTAL SALES</th>';
  html += '<th class="grp-sep">PROFIT</th>';
  html += '<th class="grp-sep">INCREASE</th>';
  html += "</tr>";
  html += "<tr>";
  html += "<th>DATE</th>";
  html += "<th>SESSION</th>";
  html += "<th>Count</th>";
  html += "<th>Liters</th>";
  html += "<th>₹</th>";
  html += '<th class="grp-sep">Liters</th>';
  html += "<th>₹</th>";
  html += "<th>Liters</th>";
  html += "<th>₹</th>";
  html += "<th>Liters</th>";
  html += "<th>₹</th>";
  html += "<th>Liters</th>";
  html += "<th>₹</th>";
  html += '<th class="grp-sep">Liters</th>';
  html += "<th>₹</th>";
  html += '<th class="grp-sep">₹</th>';
  html += '<th class="grp-sep">Liters</th>';
  html += "</tr>";
  html += "</thead>";
  html += '<tbody id="drBody">';
  html +=
    '<tr><td colspan="17" class="dr-empty">Loading register...</td></tr>';
  html += "</tbody>";
  html += "</table>";
  html += "</div>";

  html += "</div>";

  container.innerHTML = html;

  buildDairyRegisterTable();
};

window.applyDairyRegisterFilter = function () {
  var fromDate = document.getElementById("drFromDate")?.value;
  var toDate = document.getElementById("drToDate")?.value;

  if (!fromDate || !toDate) {
    showMessageModal("Info", "⚠️ Please select both From and To dates!", false);
    return;
  }

  if (new Date(fromDate) > new Date(toDate)) {
    showMessageModal("Info", "⚠️ From date cannot be after To date!", false);
    return;
  }

  var rangeEl = document.getElementById("drHeaderRange");
  if (rangeEl) {
    rangeEl.innerHTML =
      "From: " +
      formatDateDisplay(fromDate) +
      " &nbsp; To: " +
      formatDateDisplay(toDate);
  }

  buildDairyRegisterTable();
};

function buildDairyRegisterTable() {
  var body = document.getElementById("drBody");
  if (!body) return;

  var fromDate = document.getElementById("drFromDate")?.value;
  var toDate = document.getElementById("drToDate")?.value;
  var animal = document.getElementById("drAnimal")?.value || "all";

  if (!fromDate || !toDate) {
    body.innerHTML =
      '<tr><td colspan="17" class="dr-empty">Please select both From and To dates.</td></tr>';
    return;
  }

  var fromObj = new Date(fromDate + "T00:00:00");
  var toObj = new Date(toDate + "T23:59:59.999");

  dbDexieManager
    .getAllRecords(dbnm, "mi")
    .then(function (allRecords) {
      var groups = {};

      allRecords.forEach(function (rec) {
        if (!rec.f) return;

        var dateStr = String(rec.f);
        var m = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
        if (m) {
          if (m[1] < fromDate || m[1] > toDate) return;
        } else {
          var dRaw = new Date(dateStr);
          if (isNaN(dRaw) || dRaw < fromObj || dRaw > toObj) return;
        }

        var recAnimal = parseInt(rec.h);
        if (animal !== "all" && recAnimal !== parseInt(animal)) return;

        var session = parseInt(rec.g) || 0;
        var dateKey = m ? m[1] : formatDateYYYYMMDD(new Date(dateStr));
        var key = dateKey + "|" + session;

        if (!groups[key]) {
          groups[key] = {
            date: dateKey,
            session: session,
            members: {},
            milk: 0,
            amount: 0,
          };
        }
        groups[key].members[String(rec.e)] = true;
        groups[key].milk += parseFloat(rec.i) || 0;
        groups[key].amount += parseFloat(rec.j) || 0;
      });

      var keys = Object.keys(groups).sort(function (a, b) {
        var pa = a.split("|");
        var pb = b.split("|");
        if (pa[0] !== pb[0]) return pa[0] < pb[0] ? -1 : 1;
        return (parseInt(pa[1]) || 0) - (parseInt(pb[1]) || 0);
      });

      if (keys.length === 0) {
        body.innerHTML =
          '<tr><td colspan="17" class="dr-empty">No collection data for this period.</td></tr>';
        return;
      }

      var rows = keys.map(function (key) {
        var g = groups[key];
        return {
          date: g.date,
          session: g.session,
          members: Object.keys(g.members).length,
          milk: g.milk,
          amount: g.amount,
          increase: null,
        };
      });

      for (var i = 0; i < rows.length; i++) {
        rows[i].increase = i === 0 ? null : rows[i].milk - rows[i - 1].milk;
      }

      var html = "";

      rows.forEach(function (r) {
        var dateLabel = formatDateDisplay(r.date);
        var sessionLabel =
          r.session === 1
            ? "Morning"
            : r.session === 2
              ? "Evening"
              : "-";

        var incCell;
        if (r.increase === null) {
          incCell = '<td class="ctr">---</td>';
        } else {
          var incCls = r.increase >= 0 ? "inc-pos" : "inc-neg";
          var incStr =
            (r.increase >= 0 ? "+" : "") + window.fmtMilk(r.increase);
          incCell = '<td class="num ' + incCls + '">' + incStr + "</td>";
        }

        html += "<tr>";
        html += '<td class="ctr"><strong>' + dateLabel + "</strong></td>";
        html += '<td class="ctr">' + sessionLabel + "</td>";
        html += '<td class="ctr">' + r.members + "</td>";
        html += '<td class="num">' + window.fmtMilk(r.milk) + "</td>";
        html += '<td class="num">₹' + r.amount.toFixed(2) + "</td>";
        html += '<td class="ctr grp-sep">---</td><td class="ctr">---</td>';
        html += '<td class="ctr">---</td><td class="ctr">---</td>';
        html += '<td class="ctr">---</td><td class="ctr">---</td>';
        html += '<td class="ctr">---</td><td class="ctr">---</td>';
        html += '<td class="ctr grp-sep">---</td><td class="ctr">---</td>';
        html += '<td class="ctr grp-sep">---</td>';
        html += incCell;
        html += "</tr>";
      });

      body.innerHTML = html;
    })
    .catch(function (err) {
      body.innerHTML =
        '<tr><td colspan="17" class="dr-empty" style="color:#d63031;">❌ Error loading data: ' +
        (err && err.message ? err.message : err) +
        "</td></tr>";
    });
}

window.printDairyRegister = function () {
  var fromDate = document.getElementById("drFromDate")?.value;
  var toDate = document.getElementById("drToDate")?.value;
  var animal = document.getElementById("drAnimal")?.value || "all";

  if (!fromDate || !toDate) {
    showMessageModal("Info", "⚠️ Please select both From and To dates!", false);
    return;
  }

  var tableHtml = document.getElementById("drTable")?.outerHTML || "";
  var animalLabel =
    animal === "all" ? "All" : animal === "1" ? "Buffalo" : "Cow";

  var printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dairy Register</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        @page { size: landscape; margin: 10mm; }
        body { padding: 10px; background: #fff; font-family: 'Inter','Poppins','Segoe UI',Arial,sans-serif; }
        .dr-phead { text-align: center; border-bottom: 3px double #1a237e; padding-bottom: 10px; margin-bottom: 14px; }
        .dr-phead h2 { margin: 0 0 4px 0; font-size: 22px; color: #1a237e; font-weight: 800; letter-spacing: 1px; }
        .dr-phead .sub { font-size: 14px; color: #444; }
        .dr-phead .range { font-size: 12px; color: #666; margin-top: 4px; }
        .dr-table { width: 100%; border-collapse: collapse; font-size: 10px; min-width: 0; }
        .dr-table th, .dr-table td { border: 1px solid #dcdcdc; padding: 4px 5px; white-space: nowrap; }
        .dr-table thead th { background: #f8f9fa !important; color: #1a237e; font-weight: 700; text-align: center; position: static !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .dr-table .grp-sep { border-left: 2px solid #90a4ae; }
        .dr-table td.num { text-align: right; }
        .dr-table td.ctr { text-align: center; }
        .dr-table td.inc-pos { color: #2e7d32; font-weight: 700; }
        .dr-table td.inc-neg { color: #c62828; font-weight: 700; }
        .dr-pfoot { text-align: center; margin-top: 16px; font-size: 10px; color: #999; border-top: 1px solid #dcdcdc; padding-top: 8px; }
      </style>
    </head>
    <body>
      <div class="dr-phead">
        <h2><i class="fas fa-book"></i> Dairy Register</h2>
        <div class="sub">Dairy Cooperative Society</div>
        <div class="range">From: ${formatDateDisplay(fromDate)} &nbsp; To: ${formatDateDisplay(toDate)} &nbsp; | &nbsp; Animal: ${animalLabel}</div>
      </div>
      ${tableHtml}
      <div class="dr-pfoot"><i class="far fa-clock"></i> Printed on: ${new Date().toLocaleString()}</div>
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
    showMessageModal("Info", "Please allow popups to print the register.", false);
  }
};

window.showDairyRegister = showDairyRegister;
window.applyDairyRegisterFilter = applyDairyRegisterFilter;
window.printDairyRegister = printDairyRegister;

console.log("📒 Dairy Register module loaded!");
