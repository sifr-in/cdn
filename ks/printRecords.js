// printRecords.js - Premium Print Dashboard (prints what is displayed:
// respects date range, search, and advocate filter; mirrors current view)

var _printMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function printDashboard() {
  var fromVal = document.getElementById("dateFrom")?.value || "";
  var toVal = document.getElementById("dateTo")?.value || "";
  var searchTerm = (document.getElementById("searchBox")?.value || "")
    .toLowerCase()
    .trim();

  if (typeof window.getFlatCaseRecords !== "function" &&
      typeof window.buildDayboardItems !== "function") {
    showMessageModal("Info", "Print data helpers not ready. Try again.", false);
    return;
  }

  var grouped = [];
  var flatRows = [];
  var total = 0;

  var isAllCases = typeof currentView !== "undefined" && currentView === "allCases";

  if (isAllCases) {
    var flat = window.getFlatCaseRecords(searchTerm);
    total = flat.length;
    flatRows = flat.map(function (r) {
      var eff = getCaseDatesForRecord(r.a);
      var cdN = getCaseDateN(eff.current ? eff.current.n : null);
      return {
        record: r,
        prevDates: eff.previous ? [eff.previous.e] : [],
        nextDates: eff.current ? [eff.current.e] : [],
        stgName: stageMap[cdN.stg] || "-",
        isCs91Row: !!(eff.cs91),
      };
    });
  } else {
    var db = window.buildDayboardItems(fromVal, toVal, searchTerm);
    total = db.totalRecords;
    for (var gi = 0; gi < db.dateOrder.length; gi++) {
      var d = db.dateOrder[gi];
      var grp = db.dateGroups[d];
      if (!grp || grp.length === 0) continue;
      var dp = d.split("-");
      grouped.push({
        date: d,
        heading: dp[2] + " " + _printMonths[parseInt(dp[1]) - 1] + " " + dp[0],
        rows: grp,
      });
    }
  }

  if (total === 0) {
    showMessageModal("Info", "No records to print!", false);
    return;
  }

  var rowsHtml = "";
  var today = getLocalToday();

  if (isAllCases) {
    for (var fj = 0; fj < flatRows.length; fj++) {
      rowsHtml += buildPrintRow(
        flatRows[fj].record,
        flatRows[fj].prevDates,
        flatRows[fj].nextDates,
        flatRows[fj].stgName,
        flatRows[fj].isCs91Row,
        today,
        null,
        null,
      );
    }
  } else {
    for (var gj = 0; gj < grouped.length; gj++) {
      var g = grouped[gj];
      var inner = "";
      for (var rj = 0; rj < g.rows.length; rj++) {
        var it = g.rows[rj];
        var x = it.record;
        var cd = it.cd;
        var eff = getCaseDatesForRecord(x.a);
        var effCur = eff.current;
        var prevDates = it.isCs91Row
          ? it.cs91Prev
            ? [{ e: it.cs91Prev }]
            : []
          : it.prevDatesArr.slice();
        var nextDates = it.isCs91Row ? [] : it.nextDatesArr.slice();
        var hasNextDate =
          !it.isCs91Row &&
          (nextDates.length > 0 ||
            !!(effCur && effCur.e && effCur.e > today));
        var cdN = getCaseDateN(
          (hasNextDate && effCur && effCur.n) || (cd && cd.n) || null,
        );
        var stgName = stageMap[cdN.stg] || "-";
        inner += buildPrintRow(
          x,
          prevDates.map(function (p) { return p.e; }),
          nextDates.map(function (n) { return n.e; }),
          stgName,
          it.isCs91Row,
          today,
          null,
          g.heading,
        );
      }
      rowsHtml +=
        '<div class="day-group">' +
        '<div class="group-head">' +
        '<span class="group-date">' + escHtml(g.heading) + "</span>" +
        '<span class="group-count">' + g.rows.length + "</span>" +
        "</div>" +
        printTableHtml(inner) +
        "</div>";
    }
  }

  if (isAllCases) {
    rowsHtml = printTableHtml(rowsHtml);
  }

  var win = window.open("", "_blank");
  var headerNotes = '<div class="filter-line">' +
    'View: ' + escHtml(isAllCases ? "All Cases" : "Board (Home)") +
    (fromVal ? " &nbsp;|&nbsp; From: " + escHtml(fromVal) : "") +
    (toVal ? " &nbsp;|&nbsp; To: " + escHtml(toVal) : "") +
    (searchTerm ? " &nbsp;|&nbsp; Search: \"" + escHtml(searchTerm) + "\"" : "") +
    (window._ksAdvFilter ? " &nbsp;|&nbsp; Advocate: " + escHtml(window._ksAdvFilter.name) : "") +
    "</div>";

  var html =
    "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Case Dashboard - " +
    (window.shopName || "KS") +
    "</title>" +
    "<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',Arial,sans-serif;font-size:10px;color:#333;padding:8mm}" +
    ".header{border:2px solid #1B2A4A;border-radius:8px;padding:12px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}" +
    ".header h2{font-size:15px;color:#1B2A4A;margin:0}.header .total{font-size:12px;font-weight:700;color:#1B2A4A;background:#FDF8EE;padding:5px 14px;border-radius:20px;border:1px solid #C9A84C}" +
    ".filter-line{font-size:9px;color:#555;margin-bottom:10px;padding:6px 12px;background:#F5F5F5;border:1px solid #ddd;border-radius:6px}" +
    "table{width:100%;border-collapse:collapse;margin-top:2px}th{background:#1B2A4A;color:#C9A84C;font-size:9px;text-transform:uppercase;padding:7px 5px;border:1px solid #1B2A4A;font-weight:700}" +
    "td{padding:6px 5px;border:1px solid #ddd;font-size:9px}tr:nth-child(even){background:#fafafa}" +
    "tr.cs91{border-left:3px solid #87c1ff}td.cs91-bg{background:#D5E2F2}" +
    ".day-group{margin-bottom:10px;page-break-inside:avoid}" +
    ".group-head{display:flex;justify-content:space-between;align-items:center;background:#FDF8EE;border:1px solid #C9A84C;border-left:3px solid #C9A84C;border-radius:6px 6px 0 0;padding:6px 12px;margin-top:8px}" +
    ".group-date{font-weight:700;font-size:11px;color:#1B2A4A}.group-count{background:#C9A84C;color:#fff;font-weight:700;font-size:10px;padding:1px 10px;border-radius:20px}" +
    ".foot{margin-top:12px;font-size:8px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:8px}" +
    "@media print{@page{margin:6mm;size:landscape}}.page-break{page-break-before:auto}" +
    "</style></head><body>" +
    "<div class='header'><h2>Case Hearing Dashboard</h2><span class='total'>Total: " +
    total +
    "</span></div>" +
    headerNotes +
    rowsHtml +
    "<div class='foot'>Generated: " +
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

function printTableHtml(innerRows) {
  return (
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
    innerRows +
    "</tbody></table>"
  );
}

function buildPrintRow(record, prevDates, nextDates, stgName, isCs91Row, today, cs91PrevDates, groupHeading) {
  var r = record;
  var rv =
    typeof getCaseDisplayRecord === "function" ? getCaseDisplayRecord(r) : r;
  var prevList = (prevDates || []).slice();
  if (cs91PrevDates) {
    for (var pi = 0; pi < cs91PrevDates.length; pi++) {
      if (prevList.indexOf(cs91PrevDates[pi]) === -1)
        prevList.push(cs91PrevDates[pi]);
    }
  }
  var prevStr = prevList.map(formatDateShort).join(", ");
  var nextStr = (nextDates || []).map(formatDateShort).join(", ") || "-";
  return (
    "<tr" +
    (isCs91Row ? ' class="cs91"' : "") +
    ">" +
    (isColVisible("sr") ? "<td>" + r.a + "</td>" : "") +
    (isColVisible("pdate") ? "<td>" + escHtml(prevStr) + "</td>" : "") +
    (isColVisible("court")
      ? '<td' + (isCs91Row ? ' class="cs91-bg"' : "") + ">" + escHtml(rv.q) + "</td>"
      : "") +
    (isColVisible("adv") ? "<td>" + escHtml(rv.k || "-") + "</td>" : "") +
    (isColVisible("brief") ? "<td>" + escHtml(rv.l || "-") + "</td>" : "") +
    (isColVisible("caseType") ? "<td>" + escHtml(rv.g) + "</td>" : "") +
    (isColVisible("caseNo")
      ? "<td>" + escHtml((rv.h ? rv.h : "") + "/" + (rv.i ? rv.i : "")) + "</td>"
      : "") +
    (isColVisible("stg") ? "<td>" + escHtml(stgName) + "</td>" : "") +
    (isColVisible("ndate") ? "<td>" + escHtml(nextStr) + "</td>" : "") +
    (isColVisible("filer") ? "<td>" + escHtml(rv.n) + "</td>" : "") +
    (isColVisible("answerer") ? "<td>" + escHtml(rv.o) + "</td>" : "") +
    "</tr>"
  );
}

console.log("printRecords.js loaded");