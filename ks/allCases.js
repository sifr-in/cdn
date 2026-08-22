// allCases.js - Table rendering, search, date formatting, view switching
// Extracted from ks.js for modular loading

var caseTypeMap = {
  1: "Civil",
  2: "Commercial",
  3: "Family",
  4: "Constitutional",
  5: "Labour",
  6: "Tax",
};

var stageMap = {
  1: "Filing/Registration",
  2: "Notice Issued",
  3: "Appearance",
  4: "Written Statement",
  5: "Issues Framed",
  6: "Evidence-Plaintiff",
  7: "Evidence-Defendant",
  8: "Cross Examination",
  9: "Arguments",
  10: "Judgment Reserved",
  11: "Judgment Pronounced",
  12: "Execution",
  13: "Adjourned",
  14: "Settlement",
  15: "Dismissed",
  16: "Withdrawn",
};

function getCaseDateN(nField) {
  if (!nField) return { n: "", stg: 0 };
  if (typeof nField === "string") {
    try {
      return JSON.parse(nField);
    } catch (e) {
      return { n: nField, stg: 0 };
    }
  }
  return nField;
}

function getCaseCs91Record(record) {
  if (!record || record.f == null || record.f === "") return null;
  var recs = window.caseRecords91 || [];
  for (var i = 0; i < recs.length; i++) {
    if (recs[i].a == record.f) return recs[i];
  }
  return null;
}

function getCaseCs91DatesForRecord(record) {
  var cr = getCaseCs91Record(record);
  if (!cr) return null;
  var current = cr.p ? { e: cr.p } : null;
  var previous = cr.o ? { e: cr.o } : null;
  return { current: current, previous: previous, cs91: cr };
}

function isCs91Record(record) {
  if (!record) return false;
  var recs = window.caseRecords91 || [];
  for (var i = 0; i < recs.length; i++) {
    if (recs[i].a == record.a) return true;
  }
  return false;
}

function getCaseCs91Fallback(record) {
  if (!record) return null;
  var linked = getCaseCs91Record(record);
  if (linked) return linked;
  return isCs91Record(record) ? record : null;
}

function getCaseDisplayRecord(record) {
  if (!record) return record;
  var cr = getCaseCs91Fallback(record);
  if (!cr) return record;
  var r = {};
  for (var key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) r[key] = record[key];
  }
  if (!r.q) r.q = cr.j;
  if (!r.g) r.g = cr.k;
  if (!r.h) r.h = cr.g;
  if (!r.i) r.i = cr.s;
  if (!r.n) r.n = cr.l;
  if (!r.o) r.o = cr.m;
  return r;
}

function getCaseDatesForRecord(recordA) {
  var rec = null;
  for (var i = 0; i < caseRecords.length; i++) {
    if (caseRecords[i].a == recordA) {
      rec = caseRecords[i];
      break;
    }
  }
  var all = caseDates.filter(function (cd) {
    return cd.td === recordA;
  });
  if (all.length === 0) {
    var cs91Dates = getCaseCs91DatesForRecord(rec);
    if (cs91Dates) {
      return {
        current: cs91Dates.current,
        previous: cs91Dates.previous,
        cs91: cs91Dates.cs91,
      };
    }
    return { current: null, previous: null };
  }
  all.sort(function (a, b) {
    return a.e > b.e ? -1 : a.e < b.e ? 1 : 0;
  });
  var current = all[0];
  var previous = null;
  if (current.f) {
    for (var i = 0; i < caseDates.length; i++) {
      if (caseDates[i].a == current.f) {
        previous = caseDates[i];
        break;
      }
    }
  }
  if (!previous) {
    var crRoot = getCaseCs91Fallback(rec);
    if (crRoot && current.e && crRoot.o && crRoot.o < current.e) {
      previous = { e: crRoot.o };
    }
  }
  return { current: current, previous: previous, cs91: null };
}

function caseHasDateRows(caseA) {
  if (caseA == null) return false;
  for (var i = 0; i < caseDates.length; i++) {
    if (caseDates[i].td == caseA) return true;
  }
  return false;
}

function getCaseNextDate(caseId, today) {
  var best = null;
  for (var i = 0; i < caseDates.length; i++) {
    var cd = caseDates[i];
    if (cd.td == caseId && cd.e > today && (!best || cd.e > best.e)) {
      best = cd;
    }
  }
  return best;
}

function matchesSearch(x, s) {
  return (
    (x.q && x.q.toLowerCase().includes(s)) ||
    (x.g && x.g.toLowerCase().includes(s)) ||
    (x.n && x.n.toLowerCase().includes(s)) ||
    (x.o && x.o.toLowerCase().includes(s)) ||
    (x.h + "/" + x.i).toLowerCase().includes(s)
  );
}

function hasCaseData(x) {
  return (
    (x.q && String(x.q).trim()) ||
    (x.n && String(x.n).trim()) ||
    (x.g && String(x.g).trim()) ||
    (x.h && String(x.h).trim())
  );
}

function getLocalToday() {
  var d = new Date();
  var mm = String(d.getMonth() + 1).padStart(2, "0");
  var dd = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mm + "-" + dd;
}

function formatDate(d) {
  if (!d) return "";
  var p = d.split("-");
  if (p.length !== 3) return d;
  return p[2] + "-" + p[1] + "-" + p[0];
}

function formatDateShort(d) {
  if (!d) return "";
  var p = d.split("-");
  if (p.length !== 3) return d;
  return p[2] + "-" + p[1];
}

function renderFlatTable() {
  var container = document.getElementById("casesContainer");
  var bdg = document.getElementById("totalBadge");
  if (!container) return;
  var s = (document.getElementById("searchBox")?.value || "")
    .toLowerCase()
    .trim();
  var r = caseRecords.filter(hasCaseData);
  if (s) {
    r = r.filter(function (x) {
      return matchesSearch(x, s);
    });
  }
  if (bdg) bdg.textContent = r.length;
  if (r.length === 0) {
    container.innerHTML =
      '<div class="text-center py-4">' +
      '<i class="fas fa-check-circle text-gold" style="font-size:28px;"></i><br>' +
      '<span class="fw-bold text-navy" style="font-size:14px;">No records found</span>' +
      "</div>";
    return;
  }
  var h =
    '<div class="table-container-premium animate-fade-in-up">' +
    '<div class="table-scroll-premium">' +
    '<table class="table-premium table table-bordered table-sm mb-0">' +
    "<thead><tr>" +
    (isColVisible("sr") ? "<th>SR</th>" : "") +
    (isColVisible("pdate") ? "<th>PDate</th>" : "") +
    (isColVisible("court") ? "<th>Court</th>" : "") +
    (isColVisible("adv") ? "<th>Adv</th>" : "") +
    (isColVisible("brief") ? "<th>Brief</th>" : "") +
    (isColVisible("caseType") ? "<th>Case Type</th>" : "") +
    (isColVisible("caseNo") ? "<th>Case No.</th>" : "") +
    (isColVisible("stg") ? "<th>STG</th>" : "") +
    (isColVisible("ndate") ? "<th>NDate</th>" : "") +
    (isColVisible("filer") ? "<th>Filer</th>" : "") +
    (isColVisible("answerer") ? "<th>Answerer</th>" : "") +
    (isColVisible("edit") ? "<th>Edit</th>" : "") +
    (isColVisible("del") ? "<th>Del</th>" : "") +
    "</tr></thead><tbody>";
  for (var i = 0; i < r.length; i++) {
    var x = r[i];
    var dv = getCaseDisplayRecord(x);
    var cd = getCaseDatesForRecord(x.a);
    var pDate = cd.previous ? cd.previous.e : "";
    var nDate = cd.current ? cd.current.e : "";
    var today = getLocalToday();
    var hasNextDate = nDate && nDate > today;
    var cdN = getCaseDateN(cd.current ? cd.current.n : null);
    var stgName = stageMap[cdN.stg] || "-";
    h +=
      '<tr class="animate-fade-in' +
      (cd.cs91 ? " cs91-date-row" : "") +
      '" style="animation-delay:' +
      i * 30 +
      "ms;" +
      (hasNextDate ? "background:#D4EDDA;" : "") +
      '">' +
      (isColVisible("sr")
        ? '<td class="fw-bold text-navy">' + x.a + "</td>"
        : "") +
      (isColVisible("pdate")
        ? '<td class="fw-semibold" style="color:#c62828;">' +
          escHtml(formatDateShort(pDate)) +
          "</td>"
        : "") +
      (isColVisible("court")
        ? '<td class="text-navy fw-semibold text-start truncate" style="max-width:180px;" title="' +
          escAttr(dv.q) +
          '">' +
          escHtml(dv.q) +
          "</td>"
        : "") +
      (isColVisible("adv")
        ? '<td class="text-gray">' + escHtml(x.k || "-") + "</td>"
        : "") +
      (isColVisible("brief")
        ? '<td class="text-start">' + escHtml(x.l || "-") + "</td>"
        : "") +
      (isColVisible("caseType") ? "<td>" + escHtml(dv.g) + "</td>" : "") +
      (isColVisible("caseNo")
        ? '<td class="fw-semibold font-mono text-navy">' +
          escHtml(dv.h + "/" + dv.i) +
          "</td>"
        : "") +
      (isColVisible("stg")
        ? '<td class="text-start text-gray-dark truncate" style="max-width:120px;" title="' +
          escAttr(stgName) +
          '">' +
          escHtml(stgName) +
          "</td>"
        : "") +
      (isColVisible("ndate")
        ? '<td style="text-align:center;cursor:pointer;' +
          (hasNextDate ? "background:#C8E6C9;" : "") +
          '"' +
          " onclick='" +
          (hasNextDate
            ? "openEditCaseModal(" +
              JSON.stringify(x).replace(/'/g, "\\'") +
              "," +
              JSON.stringify(cd.current).replace(/'/g, "\\'") +
              ")"
            : "openNextHearingModal(" +
              JSON.stringify(x).replace(/'/g, "\\'") +
              "," +
              (cd.current
                ? JSON.stringify(cd.current).replace(/'/g, "\\'")
                : "null") +
              ")") +
          ")'" +
          ' title="' +
          (hasNextDate ? escHtml(formatDateShort(nDate)) : "Click to add") +
          '">' +
          (hasNextDate ? escHtml(formatDateShort(nDate)) : "+") +
          "</td>"
        : "") +
      (isColVisible("filer")
        ? '<td class="text-start text-gray-dark truncate" style="max-width:150px;" title="' +
          escAttr(dv.n) +
          '">' +
          escHtml(dv.n) +
          "</td>"
        : "") +
      (isColVisible("answerer")
        ? '<td class="text-start text-gray-dark truncate" style="max-width:150px;" title="' +
          escAttr(dv.o) +
          '">' +
          escHtml(dv.o) +
          "</td>"
        : "") +
      (isColVisible("edit")
        ? '<td><button class="btn btn-sm" style="color:var(--gold);border:1px solid var(--gold);padding:2px 8px;font-size:12px;cursor:pointer;" onclick=\'openEditCaseModal(' +
          JSON.stringify(x).replace(/'/g, "&#39;") +
          "," +
          JSON.stringify(cd.current).replace(/'/g, "&#39;") +
          ')\' title="Edit Case">✏️</button></td>'
        : "") +
      (isColVisible("del")
        ? '<td><button class="btn btn-sm" style="color:#dc3545;border:1px solid #dc3545;padding:2px 8px;font-size:12px;cursor:pointer;" onclick=\'deleteCaseRecord(' +
          JSON.stringify(x).replace(/'/g, "&#39;") +
          ')\' title="Delete Case"><i class="fas fa-trash-alt"></i></button></td>'
        : "") +
      "</tr>";
  }
  h += "</tbody></table></div></div>";
  container.innerHTML = h;
}

function buildHomeRow(
  x,
  disp,
  hasNextDate,
  ndDate,
  stgName,
  j,
  nxt,
  pDateOverride,
  rowClass,
) {
  var dv = getCaseDisplayRecord(x);
  var pDate = pDateOverride || "";
  if (!pDate && disp && disp.f) {
    for (var k = 0; k < caseDates.length; k++) {
      if (caseDates[k].a == disp.f) {
        pDate = caseDates[k].e;
        break;
      }
    }
  }
  return (
    '<tr class="animate-fade-in' +
    (rowClass ? " " + rowClass : "") +
    '" style="animation-delay:' +
    (j || 0) * 30 +
    "ms;" +
    (hasNextDate ? "background:#D4EDDA;" : "") +
    '">' +
    (isColVisible("sr")
      ? '<td class="fw-bold text-navy">' + x.a + "</td>"
      : "") +
    (isColVisible("pdate")
      ? '<td class="fw-semibold" style="color:#c62828;">' +
        escHtml(formatDateShort(pDate)) +
        "</td>"
      : "") +
    (isColVisible("court")
      ? '<td class="text-navy fw-semibold text-start truncate" style="max-width:180px;" title="' +
        escAttr(dv.q) +
        '">' +
        escHtml(dv.q) +
        "</td>"
      : "") +
    (isColVisible("adv")
      ? '<td class="text-gray">' + escHtml(x.k || "-") + "</td>"
      : "") +
    (isColVisible("brief")
      ? '<td class="text-start">' + escHtml(x.l || "-") + "</td>"
      : "") +
    (isColVisible("caseType") ? "<td>" + escHtml(dv.g) + "</td>" : "") +
    (isColVisible("caseNo")
      ? '<td class="fw-semibold font-mono text-navy">' +
        escHtml(dv.h + "/" + dv.i) +
        "</td>"
      : "") +
    (isColVisible("stg")
      ? '<td class="text-start text-gray-dark truncate" style="max-width:120px;" title="' +
        escAttr(stgName) +
        '">' +
        escHtml(stgName) +
        "</td>"
      : "") +
    (isColVisible("ndate")
      ? '<td style="text-align:center;cursor:pointer;' +
        (hasNextDate ? "background:#9bea9d;" : "") +
        '"' +
        " onclick='" +
        (hasNextDate
          ? "openEditCaseModal(" +
            JSON.stringify(x).replace(/'/g, "\\'") +
            "," +
            JSON.stringify(nxt).replace(/'/g, "\\'") +
            ")"
          : "openNextHearingModal(" +
            JSON.stringify(x).replace(/'/g, "\\'") +
            "," +
            JSON.stringify(disp).replace(/'/g, "\\'") +
            ")") +
        "'" +
        ' title="' +
        (hasNextDate ? escHtml(formatDateShort(ndDate)) : "Click to add") +
        '">' +
        (hasNextDate ? escHtml(formatDateShort(ndDate)) : "+") +
        "</td>"
      : "") +
    (isColVisible("filer")
      ? '<td class="text-start text-gray-dark truncate" style="max-width:150px;" title="' +
        escAttr(dv.n) +
        '">' +
        escHtml(dv.n) +
        "</td>"
      : "") +
    (isColVisible("answerer")
      ? '<td class="text-start text-gray-dark truncate" style="max-width:150px;" title="' +
        escAttr(dv.o) +
        '">' +
        escHtml(dv.o) +
        "</td>"
      : "") +
    (isColVisible("edit")
      ? '<td><button class="btn btn-sm" style="color:var(--gold);border:1px solid var(--gold);padding:2px 8px;font-size:12px;cursor:pointer;" onclick=\'openEditCaseModal(' +
        JSON.stringify(x).replace(/'/g, "&#39;") +
        "," +
        JSON.stringify(disp).replace(/'/g, "&#39;") +
        ')\' title="Edit Case">✏️</button></td>'
      : "") +
    (isColVisible("del")
      ? '<td><button class="btn btn-sm" style="color:#dc3545;border:1px solid #dc3545;padding:2px 8px;font-size:12px;cursor:pointer;" onclick=\'deleteCaseRecord(' +
        JSON.stringify(x).replace(/'/g, "&#39;") +
        ')\' title="Delete Case"><i class="fas fa-trash-alt"></i></button></td>'
      : "") +
    "</tr>"
  );
}

function renderTable() {
  if (currentView === "allCases") {
    renderFlatTable();
    return;
  }
  var today = getLocalToday();
  var farFuture = "2099-12-31";
  var f = document.getElementById("dateFrom")?.value || today,
    t = document.getElementById("dateTo")?.value || farFuture,
    s = (document.getElementById("searchBox")?.value || "")
      .toLowerCase()
      .trim();
  var bdg = document.getElementById("totalBadge");
  var container = document.getElementById("casesContainer");
  if (!container) return;

  var filteredCaseDates = caseDates.filter(function (cd) {
    return cd.e >= f && cd.e <= t;
  });

  filteredCaseDates.sort(function (a, b) {
    return a.e < b.e ? -1 : a.e > b.e ? 1 : 0;
  });

  var dateGroups = {};
  var dateOrder = [];

  for (var i = 0; i < filteredCaseDates.length; i++) {
    var cd = filteredCaseDates[i];
    var rec = null;
    for (var j = 0; j < caseRecords.length; j++) {
      if (caseRecords[j].a == cd.td) {
        rec = caseRecords[j];
        break;
      }
    }
    if (!rec) {
      continue;
    }
    if (s && !matchesSearch(rec, s)) continue;
    if (!dateGroups[cd.e]) {
      dateGroups[cd.e] = [];
      dateOrder.push(cd.e);
    }
    dateGroups[cd.e].push({ record: rec, caseDate: cd });
  }

  for (var ci = 0; ci < caseRecords.length; ci++) {
    var rec2 = caseRecords[ci];
    var cr91 = getCaseCs91Record(rec2);
    if (!cr91 || !cr91.p) continue;
    if (caseHasDateRows(rec2.a) || caseHasDateRows(cr91.a)) continue;
    if (cr91.p < f || cr91.p > t) continue;
    if (s && !matchesSearch(rec2, s)) continue;
    if (!dateGroups[cr91.p]) {
      dateGroups[cr91.p] = [];
      dateOrder.push(cr91.p);
    }
    dateGroups[cr91.p].push({
      record: rec2,
      caseDate: { td: rec2.a, e: cr91.p },
      cs91: true,
      cs91Prev: cr91.o || "",
    });
  }

  dateOrder.sort();

  var totalRecords = 0;
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var h = "";

  for (var i = 0; i < dateOrder.length; i++) {
    var d = dateOrder[i];
    var items = dateGroups[d];
    if (!items || items.length === 0) continue;
    totalRecords += items.length;

    var dp = d.split("-");
    var displayDate = dp[2] + " " + months[parseInt(dp[1]) - 1] + " " + dp[0];

    h +=
      '<div class="table-container-premium mb-3" style="border-left:3px solid var(--gold);">' +
      '<div class="p-2" style="background:var(--gold-bg);border-bottom:1px solid var(--gold);">' +
      '<i class="fas fa-calendar-day text-gold me-2"></i>' +
      '<span class="fw-bold text-navy" style="font-size:13px;">' +
      displayDate +
      "</span>" +
      '<span class="badge-premium badge-premium-gold ms-2" style="font-size:11px;">' +
      items.length +
      "</span>" +
      "</div>" +
      '<div class="table-scroll-premium">' +
      '<table class="table-premium table table-bordered table-sm mb-0">' +
      "<thead><tr>" +
      (isColVisible("sr") ? "<th>SR</th>" : "") +
      (isColVisible("pdate") ? "<th>PDate</th>" : "") +
      (isColVisible("court") ? "<th>Court</th>" : "") +
      (isColVisible("adv") ? "<th>Adv</th>" : "") +
      (isColVisible("brief") ? "<th>Brief</th>" : "") +
      (isColVisible("caseType") ? "<th>Case Type</th>" : "") +
      (isColVisible("caseNo") ? "<th>Case No.</th>" : "") +
      (isColVisible("stg") ? "<th>STG</th>" : "") +
      (isColVisible("ndate") ? "<th>NDate</th>" : "") +
      (isColVisible("filer") ? "<th>Filer</th>" : "") +
      (isColVisible("answerer") ? "<th>Answerer</th>" : "") +
      (isColVisible("edit") ? "<th>Edit</th>" : "") +
      (isColVisible("del") ? "<th>Del</th>" : "") +
      "</tr></thead><tbody>";

    for (var j = 0; j < items.length; j++) {
      var x = items[j].record;
      var cd = items[j].caseDate;
      var eff = getCaseDatesForRecord(x.a);
      var effCur = eff.current;
      var target =
        effCur && effCur.a ? effCur : cd && cd.a ? cd : effCur || null;
      var hasNextDate = !!(effCur && effCur.e && effCur.e > today);
      var ndDate = hasNextDate ? effCur.e : "";
      var cdN = getCaseDateN((hasNextDate && effCur && effCur.n) || cd.n || null);
      var stgName = stageMap[cdN.stg] || "-";
      h += buildHomeRow(
        x,
        target,
        hasNextDate,
        ndDate,
        stgName,
        j,
        target,
        eff.previous ? eff.previous.e : "",
        items[j].cs91 ? "cs91-date-row" : "",
      );
    }
    h += "</tbody></table></div></div>";
  }

  if (bdg) bdg.textContent = totalRecords;

  if (totalRecords === 0) {
    container.innerHTML =
      '<div class="text-center py-4">' +
      '<i class="fas fa-check-circle text-gold" style="font-size:28px;"></i><br>' +
      '<span class="fw-bold text-navy" style="font-size:14px;">No cases for today</span><br>' +
      '<span class="text-sm text-gray">Enjoy your free day!</span>' +
      "</div>";
    return;
  }
  container.innerHTML = h;
}

window.showAllCases = function () {
  currentView = "allCases";
  var titleEl = document.getElementById("headerTitle");
  if (titleEl) {
    titleEl.innerHTML =
      '<button class="btn-premium-icon" id="menuBtn" onclick="toggleSidebar()" aria-label="Open menu">' +
      '<i class="fas fa-bars"></i>' +
      "</button>" +
      getHeaderTitle();
  }
  renderTable();
};

window.showHome = function () {
  currentView = "home";
  var today = getLocalToday();
  var dateFrom = document.getElementById("dateFrom");
  var dateTo = document.getElementById("dateTo");
  if (dateFrom) dateFrom.value = today;
  if (dateTo) dateTo.value = "";
  var searchInput = document.getElementById("searchBox");
  if (searchInput) searchInput.value = "";
  var titleEl = document.getElementById("headerTitle");
  if (titleEl) {
    titleEl.innerHTML =
      '<button class="btn-premium-icon" id="menuBtn" onclick="toggleSidebar()" aria-label="Open menu">' +
      '<i class="fas fa-bars"></i>' +
      "</button>" +
      getHeaderTitle();
  }
  renderTable();
};

console.log("📊 allCases.js loaded");
