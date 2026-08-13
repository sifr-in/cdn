// printRecords.js - Premium Print Dashboard
function printDashboard() {
  var fromVal = document.getElementById("dateFrom")?.value || "";
  var toVal = document.getElementById("dateTo")?.value || "";
  var searchTerm = (document.getElementById("searchBox")?.value || "")
    .toLowerCase()
    .trim();

  var filteredCaseDates = caseDates.filter(function (cd) {
    if (fromVal && cd.e < fromVal) return false;
    if (toVal && cd.e > toVal) return false;
    return true;
  });

  filteredCaseDates.sort(function (a, b) { return a.e < b.e ? -1 : a.e > b.e ? 1 : 0; });

  var items = [];
  for (var i = 0; i < filteredCaseDates.length; i++) {
    var cd = filteredCaseDates[i];
    var rec = null;
    for (var j = 0; j < caseRecords.length; j++) {
      if (caseRecords[j].a === cd.td) { rec = caseRecords[j]; break; }
    }
    if (!rec) continue;
    if (searchTerm && !matchesSearch(rec, searchTerm)) continue;
    var pDate = "";
    if (cd.f) {
      for (var k = 0; k < caseDates.length; k++) {
        if (caseDates[k].a == cd.f) { pDate = caseDates[k].e; break; }
      }
    }
    items.push({ record: rec, caseDate: cd, pDate: pDate });
  }

  if (typeof getCaseCs91Record === "function") {
    for (var ci = 0; ci < caseRecords.length; ci++) {
      var rec2 = caseRecords[ci];
      var cr = getCaseCs91Record(rec2);
      if (!cr || !cr.p) continue;
      if (fromVal && cr.p < fromVal) continue;
      if (toVal && cr.p > toVal) continue;
      if (searchTerm && !matchesSearch(rec2, searchTerm)) continue;
      items.push({
        record: rec2,
        caseDate: { td: rec2.a, e: cr.p },
        pDate: cr.o || "",
        cs91: true,
      });
    }
  }

  items.sort(function (a, b) {
    return a.caseDate.e < b.caseDate.e ? -1 : a.caseDate.e > b.caseDate.e ? 1 : 0;
  });

  if (items.length === 0) {
    showMessageModal("Info", "No records to print!", false);
    return;
  }

  var rowsHtml = "";
  for (var j = 0; j < items.length; j++) {
    var r = items[j].record;
    var rv = typeof getCaseDisplayRecord === "function" ? getCaseDisplayRecord(r) : r;
    var cd = items[j].caseDate;
    var pd = items[j].pDate;
    var cdN = getCaseDateN(cd.n);
    var stgName = stageMap[cdN.stg] || '-';
    rowsHtml +=
      "<tr" +
      (items[j].cs91 ? ' style="background:#D5E2F2;"' : "") +
      ">" +
      (isColVisible("sr") ? "<td>" + r.a + "</td>" : "") +
      (isColVisible("pdate") ? "<td>" + formatDate(pd) + "</td>" : "") +
      (isColVisible("court") ? "<td>" + escHtml(rv.q) + "</td>" : "") +
      (isColVisible("adv") ? "<td>" + escHtml(r.k || "-") + "</td>" : "") +
      (isColVisible("brief") ? "<td>" + escHtml(r.l || "-") + "</td>" : "") +
      (isColVisible("caseType") ? "<td>" + escHtml(rv.g) + "</td>" : "") +
      (isColVisible("caseNo") ? "<td>" + escHtml(rv.h + "/" + rv.i) + "</td>" : "") +
      (isColVisible("stg") ? "<td>" + escHtml(stgName) + "</td>" : "") +
      (isColVisible("ndate") ? "<td>" + formatDate(cd.e) + "</td>" : "") +
      (isColVisible("filer") ? "<td>" + escHtml(rv.n) + "</td>" : "") +
      (isColVisible("answerer") ? "<td>" + escHtml(rv.o) + "</td>" : "") +
      "</tr>";
  }

  var win = window.open("", "_blank");
  var html =
    "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Case Dashboard - " +
    (window.shopName || "KS") +
    "</title>" +
    "<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',Arial,sans-serif;font-size:10px;color:#333;padding:8mm}" +
    ".header{border:2px solid #1B2A4A;border-radius:8px;padding:12px 16px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}" +
    ".header h2{font-size:15px;color:#1B2A4A;margin:0}.header .total{font-size:12px;font-weight:700;color:#1B2A4A;background:#FDF8EE;padding:5px 14px;border-radius:20px;border:1px solid #C9A84C}" +
    "table{width:100%;border-collapse:collapse;margin-top:4px}th{background:#1B2A4A;color:#C9A84C;font-size:9px;text-transform:uppercase;padding:9px 5px;border:1px solid #1B2A4A;font-weight:700}" +
    "td{padding:6px 5px;border:1px solid #ddd;font-size:9px}tr:nth-child(even){background:#fafafa}" +
    ".footer{margin-top:12px;font-size:8px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:8px}" +
    "@media print{@page{margin:6mm;size:landscape}}</style></head><body>" +
    "<div class='header'><h2>Case Hearing Dashboard</h2><span class='total'>Total: " +
    items.length +
    "</span></div>" +
    "<table><thead><tr>" +
    (isColVisible("sr") ? "<th>SR</th>" : "") +
    (isColVisible("pdate") ? "<th>PDate</th>" : "") +
    (isColVisible("court") ? "<th>Court</th>" : "") +
    (isColVisible("adv") ? "<th>Adv</th>" : "") +
    (isColVisible("brief") ? "<th>Brief</th>" : "") +
    (isColVisible("caseType") ? "<th>Type</th>" : "") +
    (isColVisible("caseNo") ? "<th>Case No.</th>" : "") +
    (isColVisible("stg") ? "<th>STG</th>" : "") +
    (isColVisible("ndate") ? "<th>NDate</th>" : "") +
    (isColVisible("filer") ? "<th>Filer</th>" : "") +
    (isColVisible("answerer") ? "<th>Answerer</th>" : "") +
    "</tr></thead><tbody>" +
    rowsHtml +
    "</tbody></table>" +
    "<div class='footer'>Generated: " +
    new Date().toLocaleString("en-IN") +
    " — " +
    (window.shopName || "KS") +
    "</div>" +
    "</body></html>";

  win.document.write(html);
  win.document.close();
  setTimeout(function () {
    win.print();
  }, 500);
}

console.log("printRecords.js loaded");
