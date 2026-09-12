// allCases.js - Table rendering, search, date formatting, view switching
// Extracted from ks.js for modular loading

// Advocate dashboard filter (list sourced from ks.da advOnBoard)
window._ksAdvFilter = null;
try {
  var _savedAdvFilter = JSON.parse(
    localStorage.getItem("ks_advFilter") || "null",
  );
  if (_savedAdvFilter && _savedAdvFilter.id != null)
    window._ksAdvFilter = {
      id: Number(_savedAdvFilter.id),
      name: String(_savedAdvFilter.name || ""),
    };
} catch (e) {}

function recordMatchesAdvFilter(rec) {
  if (!window._ksAdvFilter) return true;
  var fid = String(window._ksAdvFilter.id);
  var s = String((rec && rec.k) == null ? "" : rec.k).trim();
  if (s) {
    var tokens = s.split(/[|,]/);
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i].trim();
      if (/^\d+$/.test(t)) return t === fid;
    }
    if (/^\d+$/.test(s)) return s === fid;
  }
  if (rec && rec.x2 != null && String(rec.x2) === fid) return true;
  return false;
}

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
  if (record.tmt === undefined && String(record.e) !== "91") return null;
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
  return record.tmt !== undefined;
}

function getCaseCs91Fallback(record) {
  if (!record) return null;
  var linked = getCaseCs91Record(record);
  if (linked) return linked;
  return isCs91Record(record) ? record : null;
}

function findCsByCs91Link(cs91Id) {
  if (cs91Id == null || cs91Id === "") return null;
  for (var i = 0; i < caseRecords.length; i++) {
    var rec = caseRecords[i];
    if (rec && rec.e == 91 && rec.f == cs91Id && !isCs91Record(rec)) return rec;
  }
  return null;
}

function findTableADisplayForCase(csId, date) {
  if (csId == null || !date) return null;
  for (var i = 0; i < caseDates.length; i++) {
    var cd = caseDates[i];
    if (cd.tb == 36 && cd.td == csId && cd.e == date) return cd;
  }
  return null;
}

function cs91CaseNoPrefix(s) {
  return String(s == null ? "" : s).substring(0, 8);
}

function getCaseDisplayRecord(record) {
  if (!record) return record;
  var cr = getCaseCs91Fallback(record);
  if (!cr) return record;
  if (isCs91Record(record)) {
    var r91 = {
      a: record.a,
      b: record.b,
      c: record.c,
      d: record.d,
      e: record.e,
      f: record.f,
    };
    var cs = findCsByCs91Link(record.a);
    if (cs) {
      r91.k = cs.k;
      r91.l = cs.l;
      r91.m = cs.m;
      r91.p = cs.p;
      r91.r = cs.r;
      r91.s = cs.s;
      r91.t = cs.t;
      r91.u = cs.u;
      r91.j = cs.j || cr.j;
      if (cs.g) r91.g = cs.g;
      else if (cr.k) r91.g = cr.k;
      if (cs.h) r91.h = cs.h;
      else if (cr.g) r91.h = cs91CaseNoPrefix(cr.g);
      if (cs.i) r91.i = cs.i;
      else if (cr.s) r91.i = cr.s;
      if (cs.q) r91.q = cs.q;
      else if (cr.j) r91.q = cr.j;
      if (cs.n) r91.n = cs.n;
      else if (cr.l) r91.n = cr.l;
      if (cs.o) r91.o = cs.o;
      else if (cr.m) r91.o = cr.m;
    } else {
      r91.g = cr.k;
      r91.h = cr.g ? cs91CaseNoPrefix(cr.g) : "";
      r91.i = cr.s;
      r91.q = cr.j;
      r91.n = cr.l;
      r91.o = cr.m;
    }
    return r91;
  }
  var r = {};
  for (var key2 in record) {
    if (Object.prototype.hasOwnProperty.call(record, key2))
      r[key2] = record[key2];
  }
  if (!r.q && cr.j) r.q = cr.j;
  if (!r.g && cr.k) r.g = cr.k;
  if (!r.h && cr.g) r.h = cs91CaseNoPrefix(cr.g);
  if (!r.i && cr.s) r.i = cr.s;
  if (!r.n && cr.l) r.n = cr.l;
  if (!r.o && cr.m) r.o = cr.m;
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

function findDateRecordById(dateId) {
  if (dateId == null) return null;
  for (var i = 0; i < caseDates.length; i++) {
    if (caseDates[i].a == dateId) return caseDates[i];
  }
  return null;
}

function collectPrevDates(dispDateRecord) {
  var result = [];
  if (!dispDateRecord || !dispDateRecord.f) return result;
  var found = findDateRecordById(dispDateRecord.f);
  if (found) result.unshift(found);
  return result;
}

function collectNextDates(dispDateRecord) {
  var result = [];
  if (!dispDateRecord || dispDateRecord.a == null) return result;
  for (var i = 0; i < caseDates.length; i++) {
    if (caseDates[i].f == dispDateRecord.a) {
      result.push(caseDates[i]);
      break;
    }
  }
  return result;
}

function formatMultiDateHtml(dates, cssClass) {
  if (!dates || dates.length === 0) return "";
  var h = "";
  for (var i = 0; i < dates.length; i++) {
    var de = typeof dates[i] === "string" ? dates[i] : dates[i].e;
    if (!de) continue;
    h +=
      '<span class="db-date-badge ' +
      (cssClass || "db-date-primary") +
      '">' +
      escHtml(formatDateShort(de)) +
      "</span>";
  }
  return h;
}

function matchesSearch(x, s) {
  var d = getCaseDisplayRecord(x) || x;
  return (
    (d.q && d.q.toLowerCase().includes(s)) ||
    (d.g && d.g.toLowerCase().includes(s)) ||
    (d.n && d.n.toLowerCase().includes(s)) ||
    (d.o && d.o.toLowerCase().includes(s)) ||
    ((d.h + "/" + d.i).toLowerCase().includes(s))
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

window.getFlatCaseRecords = function (searchText) {
  var r = caseRecords.filter(hasCaseData);
  r = r.filter(function (x) {
    return recordMatchesAdvFilter(x);
  });
  var s = (searchText || "").toLowerCase().trim();
  if (s) {
    r = r.filter(function (x) {
      return matchesSearch(x, s);
    });
  }
  return r;
};

function renderFlatTable() {
  var container = document.getElementById("casesContainer");
  var bdg = document.getElementById("totalBadge");
  if (!container) return;
  var s = (document.getElementById("searchBox")?.value || "")
    .toLowerCase()
    .trim();
  var r = getFlatCaseRecords(s);
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
        ? '<td class="text-gray">' + escHtml(dv.k || "-") + "</td>"
        : "") +
      (isColVisible("brief")
        ? '<td class="text-start">' + escHtml(dv.l || "-") + "</td>"
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
  rowClass,
  prevDatesArr,
  nextDatesArr,
) {
  var dv = getCaseDisplayRecord(x);
  var pDateHtml = "";
  if (prevDatesArr && prevDatesArr.length > 0) {
    pDateHtml = formatMultiDateHtml(prevDatesArr, "db-date-prev");
  }
  var nDateHtml = "";
  var nClickAction = "";
  if (nextDatesArr && nextDatesArr.length > 0) {
    nDateHtml = formatMultiDateHtml(nextDatesArr, "db-date-next");
    nClickAction =
      "openEditCaseModal(" +
      JSON.stringify(x).replace(/'/g, "\\'") +
      "," +
      JSON.stringify(nxt).replace(/'/g, "\\'") +
      ")";
  } else {
    nDateHtml = "+";
    nClickAction =
      "openNextHearingModal(" +
      JSON.stringify(x).replace(/'/g, "\\'") +
      "," +
      JSON.stringify(disp).replace(/'/g, "\\'") +
      ")";
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
        pDateHtml +
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
        ? '<td class="text-gray">' + escHtml(dv.k || "-") + "</td>"
        : "") +
      (isColVisible("brief")
        ? '<td class="text-start">' + escHtml(dv.l || "-") + "</td>"
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
        nClickAction +
        "'" +
        ' title="' +
        (hasNextDate ? "See dates" : "Click to add") +
        '">' +
        nDateHtml +
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
    "</tr>"
  );
}

window.buildSource2DisplayRecord = function (rec) {
  if (!rec) return rec;
  var cr = getCaseCs91Record(rec);
  if (!cr) return rec;
  var r = {};
  for (var key2 in rec) {
    if (Object.prototype.hasOwnProperty.call(rec, key2))
      r[key2] = rec[key2];
  }
  if (r.g === "" || r.g == null) {
    r.g = cr.k;
    var gn = String(cr.g == null ? "" : cr.g);
    if (gn.length >= 4) {
      var year = gn.substring(gn.length - 4);
      var no = gn.substring(0, gn.length - 4);
      r.h = no;
      r.i = year;
    }
    if (r.n === "" || r.n == null) r.n = cr.l;
    if (r.o === "" || r.o == null) r.o = cr.m;
  }
  return r;
};

window.buildDayboardItems = function (dateFrom, dateTo, searchText) {
  var f = dateFrom || getLocalToday();
  var t = dateTo || "2099-12-31";
  var s = (searchText || "").toLowerCase().trim();

  var dateGroups = {};
  var dateOrder = [];
  var itemKeyMap = {};

  function addPrevBadge(item, dateVal) {
    if (!dateVal) return;
    var has = item.prevDatesArr.some(function (p) {
      return p.e === dateVal;
    });
    if (!has) item.prevDatesArr.push({ e: dateVal });
  }

  function addNextBadge(item, dateVal) {
    if (!dateVal) return;
    var has = item.nextDatesArr.some(function (n) {
      return n.e === dateVal;
    });
    if (!has) item.nextDatesArr.push({ e: dateVal });
  }

  function mergeDayboardItem(target, incoming) {
    var tRec = target.record;
    var iRec = incoming.record;
    if (isCs91Record(tRec) && !isCs91Record(iRec)) target.record = iRec;
    if (!target.cd && incoming.cd) target.cd = incoming.cd;
    if (incoming.cs91Rec) {
      target.cs91Rec = incoming.cs91Rec;
      if (incoming.cs91Prev) target.cs91Prev = incoming.cs91Prev;
      target.isCs91Row = true;
    }
    for (var i = 0; i < incoming.prevDatesArr.length; i++) {
      addPrevBadge(target, incoming.prevDatesArr[i].e);
    }
    for (var j = 0; j < incoming.nextDatesArr.length; j++) {
      addNextBadge(target, incoming.nextDatesArr[j].e);
    }
  }

  function ensureGroup(date, key, item) {
    if (!dateGroups[date]) {
      dateGroups[date] = [];
      dateOrder.push(date);
    }
    var existing = itemKeyMap[key];
    if (existing) {
      mergeDayboardItem(existing, item);
      return existing;
    }
    itemKeyMap[key] = item;
    dateGroups[date].push(item);
    return item;
  }

  // Source 2: table-a driven (a.tb=36, a.e in [from,to])
  var filteredCaseDates = caseDates.filter(function (cd) {
    return cd.e >= f && cd.e <= t;
  });
  filteredCaseDates.sort(function (a, b) {
    return a.e < b.e ? -1 : a.e > b.e ? 1 : 0;
  });

  for (var i = 0; i < filteredCaseDates.length; i++) {
    var cd2 = filteredCaseDates[i];
    var rec2 = null;
    for (var j = 0; j < caseRecords.length; j++) {
      if (caseRecords[j].a == cd2.td) {
        rec2 = caseRecords[j];
        break;
      }
    }
    if (!rec2) continue;
    if (s && !matchesSearch(rec2, s)) continue;
    if (!recordMatchesAdvFilter(rec2)) continue;
    var dispRec2 = buildSource2DisplayRecord(rec2);
    var item2 = {
      record: dispRec2,
      cd: cd2,
      cs91Rec: null,
      cs91Prev: "",
      isCs91Row: false,
      prevDatesArr: collectPrevDates(cd2).slice(),
      nextDatesArr: collectNextDates(cd2).slice(),
    };
    ensureGroup(cd2.e, cd2.e + "|" + rec2.a, item2);
  }

  // Source 1: cs91 driven (cs91.p in [from,to], tied to cs where cs.e=91 &
  // cs.f=cs91.a; cs info takes precedence over cs91-info)
  for (var ci = 0; ci < caseRecords91.length; ci++) {
    var cr91 = caseRecords91[ci];
    if (!cr91 || !cr91.p) continue;
    if (cr91.p < f || cr91.p > t) continue;
    var csRec = findCsByCs91Link(cr91.a);
    var dispRec = csRec || cr91;
    if (s && !matchesSearch(dispRec, s)) continue;
    if (!recordMatchesAdvFilter(dispRec)) continue;
    var bridge = findTableADisplayForCase(dispRec.a, cr91.p);
    var item1 = {
      record: dispRec,
      cd: bridge,
      cs91Rec: cr91,
      cs91Prev: cr91.o || "",
      isCs91Row: true,
      prevDatesArr: [],
      nextDatesArr: [],
    };
    ensureGroup(cr91.p, cr91.p + "|" + dispRec.a, item1);
  }

  dateOrder.sort();

  var totalRecords = 0;
  for (var di = 0; di < dateOrder.length; di++) {
    var grpItems = dateGroups[dateOrder[di]];
    if (grpItems && grpItems.length) totalRecords += grpItems.length;
  }

  return {
    dateOrder: dateOrder,
    dateGroups: dateGroups,
    totalRecords: totalRecords,
  };
};

function renderTable() {
  updateAdvFilterLabel();
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

  var dbData = window.buildDayboardItems(f, t, s);
  var dateGroups = dbData.dateGroups;
  var dateOrder = dbData.dateOrder;
  var totalRecords = dbData.totalRecords;

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
      "</tr></thead><tbody>";

    for (var j = 0; j < items.length; j++) {
      var x = items[j].record;
      var cd = items[j].cd;
      var eff = getCaseDatesForRecord(x.a);
      var effCur = eff.current;
      var target =
        effCur && effCur.a ? effCur : cd && cd.a ? cd : effCur || null;
      var isCs91Row = !!items[j].isCs91Row;
      var prevDatesArr = isCs91Row
        ? items[j].cs91Prev
          ? [{ e: items[j].cs91Prev }]
          : []
        : items[j].prevDatesArr.slice();
      var nextDatesArr = items[j].nextDatesArr.slice();
      var hasNextDate =
        !isCs91Row &&
        (nextDatesArr.length > 0 ||
          !!(effCur && effCur.e && effCur.e > today));
      var ndDate = hasNextDate
        ? nextDatesArr.length > 0
          ? nextDatesArr[nextDatesArr.length - 1].e
          : effCur.e
        : "";
      var cdN = getCaseDateN(
        (hasNextDate && effCur && effCur.n) || (cd && cd.n) || null,
      );
      var stgName = stageMap[cdN.stg] || "-";
      h += buildHomeRow(
        x,
        target,
        hasNextDate,
        ndDate,
        stgName,
        j,
        target,
        items[j].isCs91Row ? "cs91-date-row" : "",
        prevDatesArr,
        nextDatesArr,
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

window.toggleAdvFilterMenu = function () {
  var menu = document.getElementById("advFilterMenu");
  if (!menu) return;
  if (menu.style.display === "block") {
    menu.style.display = "none";
    return;
  }
  buildAdvFilterMenu();
  menu.style.display = "block";
};

async function buildAdvFilterMenu() {
  var menu = document.getElementById("advFilterMenu");
  if (!menu) return;
  var items = [{ id: null, name: "All Advocates" }];
  try {
    var da = JSON.parse(await (await fetch("ks.da")).text());
    var ids = ((da && da.advOnBoard) || [])
      .map(Number)
      .filter(function (v) {
        return !isNaN(v);
      });
    var persons =
      typeof dbDexieManager !== "undefined" && typeof dbnm !== "undefined"
        ? await dbDexieManager.getAllRecords(dbnm, "c")
        : [];
    var seenNames = {};
    for (var i = 0; i < ids.length; i++) {
      var p = null;
      for (var j = 0; j < persons.length; j++) {
        if (Number(persons[j].a) === ids[i]) {
          p = persons[j];
          break;
        }
      }
      var nm = p ? String(p.h || p.i || "").trim() : "";
      if (!nm || seenNames[nm.toLowerCase()]) continue;
      seenNames[nm.toLowerCase()] = 1;
      items.push({ id: ids[i], name: nm });
    }
  } catch (e) {
    console.warn("Advocate filter list load failed:", e);
  }
  window._ksAdvFilterItems = items;
  var h = "";
  for (var k = 0; k < items.length; k++) {
    var active =
      items[k].id == null
        ? !window._ksAdvFilter
        : window._ksAdvFilter &&
          Number(window._ksAdvFilter.id) === Number(items[k].id);
    h +=
      '<div onclick="setAdvFilterItem(' +
      k +
      ')" style="padding:8px 12px;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:8px;' +
      (active
        ? "background:var(--gold-bg);font-weight:600;color:var(--navy);"
        : "") +
      '" data-act="' +
      (active ? "1" : "") +
      '" onmouseover="this.style.background=\'var(--gold-bg)\'" onmouseout="if(!this.dataset.act)this.style.background=\'\'">' +
      '<i class="fas fa-' +
      (items[k].id == null ? "list-ul" : "user-tie") +
      '" style="color:var(--gold);width:14px;"></i>' +
      '<span style="flex:1;">' +
      escHtml(items[k].name) +
      "</span>" +
      (active ? '<i class="fas fa-check" style="color:var(--gold);"></i>' : "") +
      "</div>";
  }
  menu.innerHTML = h;
}

function setAdvFilterItem(idx) {
  var it = (window._ksAdvFilterItems || [])[idx];
  if (!it) return;
  if (it.id == null) {
    window._ksAdvFilter = null;
    localStorage.removeItem("ks_advFilter");
  } else {
    window._ksAdvFilter = { id: Number(it.id), name: String(it.name || "") };
    localStorage.setItem("ks_advFilter", JSON.stringify(window._ksAdvFilter));
  }
  updateAdvFilterLabel();
  var menu = document.getElementById("advFilterMenu");
  if (menu) menu.style.display = "none";
  renderTable();
}

function updateAdvFilterLabel() {
  var lbl = document.getElementById("advFilterLabel");
  var btn = document.getElementById("advFilterBtn");
  var txt = window._ksAdvFilter ? window._ksAdvFilter.name : "All Advocates";
  if (lbl) lbl.textContent = txt;
  if (btn) {
    btn.title = txt;
    btn.style.borderColor = window._ksAdvFilter ? "var(--gold)" : "";
    btn.style.background = window._ksAdvFilter
      ? "var(--gold-bg)"
      : "#FFFFFF";
  }
}

document.addEventListener("click", function (e) {
  var menu = document.getElementById("advFilterMenu");
  if (!menu || menu.style.display !== "block") return;
  if (menu.contains(e.target)) return;
  var btn = e.target.closest ? e.target.closest("#advFilterBtn") : null;
  if (btn) return;
  menu.style.display = "none";
});

console.log("📊 allCases.js loaded");