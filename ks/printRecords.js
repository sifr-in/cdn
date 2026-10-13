// printRecords.js - Premium Print Dashboard (prints what is displayed:
// respects date range, search, and advocate filter; mirrors current view)

var _printMonths = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Print column visibility (ks.js: separate preference in localStorage "ks_printCols").
// Falls back to on-screen visibility when the print preference is unavailable.
function _pcv(k) {
  if (typeof isPrintColVisible === 'function') return isPrintColVisible(k);
  return typeof isColVisible === 'function' ? isColVisible(k) : true;
}

// Per-column print settings (ks.js: localStorage "ks_printCols" -> cfg).
// Each: { w: width%, ff: fontFamily, fs: fontSizePx, hide: clip overflow }.
function _pcs(k) {
  if (typeof window.getPrintColSettings === 'function') {
    return window.getPrintColSettings(k) || { w: 0, ff: '', fs: 0, hide: false };
  }
  return { w: 0, ff: '', fs: 0, hide: false };
}

// Column order + header labels (must match ks.js visible columns).
var _printColOrder = [
  'sr', 'pdate', 'court', 'adv', 'brief', 'caseType',
  'caseNo', 'stg', 'ndate', 'filer', 'answerer',
];
var _printColLabels = {
  sr: 'SR', pdate: 'PDate', court: 'Court', adv: 'Adv', brief: 'Brief',
  caseType: 'Type', caseNo: 'Case No.', stg: 'STG', ndate: 'NDate',
  filer: 'Filer', answerer: 'Answerer',
};

function _printColKeys() {
  return _printColOrder.filter(function (k) { return _pcv(k); });
}

function _printColCls(k) {
  var s = _pcs(k);
  return 'pc-' + k + (s.hide ? ' pc-hide' : '');
}

// cs.r emphasis for print: base = per-column font size (or default 9px), +2 = next step.
function _printPartyEmphStyle(rv, which) {
  if (typeof ksCasePartyEmph !== 'function' || !ksCasePartyEmph(rv, which)) return '';
  var base = parseFloat(_pcs(which).fs) || 9;
  return ' style="font-weight:700;font-size:' + (base + 2) + 'px;"';
}

// Per-column CSS: width-independent font/clip rules + fixed layout when widths set.
function _printColCss() {
  var css = '';
  var hasWidth = false;
  for (var i = 0; i < _printColOrder.length; i++) {
    var k = _printColOrder[i];
    var s = _pcs(k);
    var w = parseFloat(s.w) || 0;
    if (w > 0) hasWidth = true;
    var rules = '';
    var ff = String(s.ff || '').replace(/[^A-Za-z0-9 ,'"-]/g, '');
    var fs = parseFloat(s.fs) || 0;
    if (ff) rules += 'font-family:' + ff + ';';
    if (fs > 0) rules += 'font-size:' + fs + 'px;';
    if (s.hide) rules += 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    if (rules) css += '.pc-' + k + (s.hide ? '.pc-hide' : '') + '{' + rules + '}';
  }
  if (hasWidth) css += 'table{table-layout:fixed;}';
  return css;
}

// <colgroup> for the currently visible columns (percent widths).
function _printColColgroup() {
  var keys = _printColKeys();
  var out = '';
  var hasWidth = false;
  for (var i = 0; i < keys.length; i++) {
    var w = parseFloat(_pcs(keys[i]).w) || 0;
    if (w > 0) {
      hasWidth = true;
      out += '<col style="width:' + w + '%">';
    } else {
      out += '<col>';
    }
  }
  return hasWidth ? '<colgroup>' + out + '</colgroup>' : '';
}

// Background color of closed-case rows (ks.da: closedCaseColor)
var _ksClosedRowColor = '#9EADBF';

function printDashboard() {
  var fromVal = document.getElementById('dateFrom')?.value || '';
  var toVal = document.getElementById('dateTo')?.value || '';
  var searchTerm = (document.getElementById('searchBox')?.value || '')
    .toLowerCase()
    .trim();

  if (typeof window.getAllCaseRecords !== 'function' &&
      typeof window.buildDayboardItems !== 'function') {
    showMessageModal('Info', 'Print data helpers not ready. Try again.', false);
    return;
  }

  var grouped = [];
  var flatRows = [];
  var total = 0;

  var isAllCases = typeof currentView !== 'undefined' && currentView === 'allCases';

  if (isAllCases) {
    var flat = window.getAllCaseRecords(searchTerm);
    total = flat.length;
    flatRows = flat.map(function (it) {
      var nSrc = it.stageRow || it.current;
      return {
        record: it.record,
        prevDates: it.pDate ? [it.pDate] : [],
        nextDates: it.nDate ? [it.nDate] : [],
        stgName:
          typeof getCaseStageText === 'function'
            ? getCaseStageText(it.record, nSrc)
            : stageMap[getCaseDateN(nSrc ? nSrc.n : null).stg] || '-',
        isCs91Row: !!it.isCs91Linked,
        isClosed:
          typeof isClosedCs91 === 'function' && isClosedCs91(it.cs91),
        advLabel: typeof getAdvGroupLabel === 'function'
          ? getAdvGroupLabel(it.record)
          : '-',
      };
    });
  } else {
    var db = window.buildDayboardItems(fromVal, toVal, searchTerm);
    total = db.totalRecords;
    for (var gi = 0; gi < db.dateOrder.length; gi++) {
      var d = db.dateOrder[gi];
      var grp = db.dateGroups[d];
      if (!grp || grp.length === 0) continue;
      var dp = d.split('-');
      grouped.push({
        date: d,
        heading: dp[2] + ' ' + _printMonths[parseInt(dp[1]) - 1] + ' ' + dp[0],
        rows: grp,
      });
    }
  }

  if (total === 0) {
    showMessageModal('Info', 'No records to print!', false);
    return;
  }

  var rowsHtml = '';
  var today = getLocalToday();

  // Config from ks.da (fetched into clientConfig by ks.js)
  var cfg = (window[window.my1uzr?.worknOnPg] || window).clientConfig || {};
  if (cfg && typeof cfg === 'object' && Object.keys(cfg).length === 0) {
    cfg = window.clientConfig || cfg;
  }
  // ks.da: closedCaseColor -> background of closed-case rows (screen & print)
  _ksClosedRowColor =
    typeof getClosedRowColor === 'function'
      ? getClosedRowColor()
      : String(cfg.closedCaseColor || "#9EADBF").trim() || '#9EADBF';
  // ks.da: printLabelGroupByJuNm == 1 -> label above each judge/court sub-group
  var showJuLabels = Number(cfg.printLabelGroupByJuNm) === 1;
  var visColCount = _printColKeys().length || 1;

  if (isAllCases) {
    if (window._ksGroupByAdv) {
      var advGroups = {};
      var advOrder = [];
      for (var fg = 0; fg < flatRows.length; fg++) {
        var aLbl = flatRows[fg].advLabel || '-';
        if (!advGroups[aLbl]) {
          advGroups[aLbl] = [];
          advOrder.push(aLbl);
        }
        advGroups[aLbl].push(flatRows[fg]);
      }
      advOrder.sort(function (a, b) { return a.localeCompare(b); });
      for (var ao = 0; ao < advOrder.length; ao++) {
        var aGrp = advGroups[advOrder[ao]];
        var aInner = '';
        for (var ar = 0; ar < aGrp.length; ar++) {
          aInner += buildPrintRow(
            aGrp[ar].record,
            aGrp[ar].prevDates,
            aGrp[ar].nextDates,
            aGrp[ar].stgName,
            aGrp[ar].isCs91Row,
            today,
            null,
            advOrder[ao],
            aGrp[ar].isClosed,
          );
        }
        rowsHtml +=
          '<div class="day-group">' +
          '<div class="group-head">' +
          '<span class="group-date">' + escHtml(advOrder[ao]) + '</span>' +
          '<span class="group-count">' + aGrp.length + '</span>' +
          '</div>' +
          printTableHtml(aInner) +
          '</div>';
      }
    } else {
      var flatInner = '';
      for (var fj = 0; fj < flatRows.length; fj++) {
        flatInner += buildPrintRow(
          flatRows[fj].record,
          flatRows[fj].prevDates,
          flatRows[fj].nextDates,
          flatRows[fj].stgName,
          flatRows[fj].isCs91Row,
          today,
          null,
          null,
          flatRows[fj].isClosed,
        );
      }
      rowsHtml = printTableHtml(flatInner);
    }
  } else {
    for (var gj = 0; gj < grouped.length; gj++) {
      var g = grouped[gj];
      var inner = '';
      var lastJuKey = null;
      for (var rj = 0; rj < g.rows.length; rj++) {
        var it = g.rows[rj];
        var x = it.record;
        var cd = it.cd;
        if (showJuLabels) {
          var dvJu =
            typeof getCaseDisplayRecord === 'function'
              ? getCaseDisplayRecord(x)
              : x;
          var juNm = String((dvJu && dvJu.q) || '').trim();
          var juKey = juNm.toLowerCase();
          if (juKey !== lastJuKey) {
            inner += buildJuLabelRow(juNm || '-', visColCount);
            lastJuKey = juKey;
          }
        }
        var eff = getCaseDatesForRecord(x.a);
        var effCur = eff.current;
        var prevDates = it.isCs91Row
          ? (it.cs91Prev ? [{ e: it.cs91Prev }] : [])
          : it.prevDatesArr.slice();
        var nextDates = it.isCs91Row ? [] : it.nextDatesArr.slice();
        var hasNextDate =
          !it.isCs91Row &&
          (nextDates.length > 0 ||
            !!(effCur && effCur.e && effCur.e > today));
        var stgName =
          typeof getCaseStageText === 'function'
            ? getCaseStageText(x, (hasNextDate && effCur) || cd || null)
            : stageMap[
                getCaseDateN(
                  (hasNextDate && effCur && effCur.n) || (cd && cd.n) || null,
                ).stg
              ] || '-';
        var isClosed =
          typeof isClosedCs91 === 'function' && isClosedCs91(it.cs91Rec);
        inner += buildPrintRow(
          x,
          prevDates.map(function (p) { return p.e; }),
          nextDates.map(function (n) { return n.e; }),
          stgName,
          it.isCs91Row,
          today,
          null,
          g.heading,
          isClosed,
        );
      }
      rowsHtml +=
        '<div class="day-group">' +
        '<div class="group-head">' +
        '<span class="group-date">' + escHtml(g.heading) + '</span>' +
        '<span class="group-count">' + g.rows.length + '</span>' +
        '</div>' +
        printTableHtml(inner) +
        '</div>';
    }
  }

  var win = window.open('', '_blank');
  var headerNotes = '<div class="filter-line">' +
    'View: ' + escHtml(isAllCases ? 'All Cases' : 'Board (Home)') +
    (fromVal ? ' &nbsp;|&nbsp; From: ' + escHtml(fromVal) : '') +
    (toVal ? ' &nbsp;|&nbsp; To: ' + escHtml(toVal) : '') +
    (searchTerm ? ' &nbsp;|&nbsp; Search: "' + escHtml(searchTerm) + '"' : '') +
    (window._ksAdvFilter ? ' &nbsp;|&nbsp; Advocate: ' + escHtml(window._ksAdvFilter.name) : '') +
    (isAllCases && window._ksGroupByAdv ? ' &nbsp;|&nbsp; Grouped by advocates' : '') +
    '</div>';

  // Build custom header from ks.da config
  var headerHtml = '';
  if (cfg) {
    var entNm = cfg?.entNm || 'e-court alternative by sifr';
    var entAdrs = cfg?.entAdrs || 'sifr website & app developer, kolhapur, maharashtra, india';
    var logoUrl = cfg?.entLogoUrl || 'https://i.postimg.cc/gJ62yjJf/my1.jpg';
    headerHtml =
      '<div class="header print-header">' +
      '<div class="header-left"><img src="' + escHtml(logoUrl) + '" alt="logo" /></div>' +
      '<div class="header-center">' +
      '<div class="header-entnm">' + escHtml(entNm) + '</div>' +
      (entAdrs ? '<div class="header-entadrs">' + escHtml(entAdrs) + '</div>' : '') +
      '</div>' +
      '<div class="header-right"><span class="total">Total: ' + total + '</span></div>' +
      '</div>';
  }

  var html =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Case Dashboard - ' +
    (window.shopName || 'KS') +
    '</title>' +
    '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:"Inter",Arial,sans-serif;font-size:10px;color:#333;padding:8mm}' +
    '.print-header{border:2px solid #1B2A4A;border-radius:8px;padding:10px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;justify-content:space-between}' +
    '.header-left img{max-height:40px;max-width:120px;object-fit:contain;display:block}' +
    '.header-center{flex:1;text-align:center;min-width:0}' +
    '.header-entnm{font-size:15px;color:#1B2A4A;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.header-entadrs{font-size:9px;color:#666;opacity:0.7;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.header-right .total{font-size:12px;font-weight:700;color:#1B2A4A;background:#FDF8EE;padding:5px 14px;border-radius:20px;border:1px solid #C9A84C;white-space:nowrap}' +
    '.filter-line{font-size:9px;color:#555;margin-bottom:10px;padding:6px 12px;background:#F5F5F5;border:1px solid #ddd;border-radius:6px}' +
    'table{width:100%;border-collapse:collapse;margin-top:2px}th{background:#1B2A4A;color:#C9A84C;font-size:9px;text-transform:uppercase;padding:7px 5px;border:1px solid #1B2A4A;font-weight:700}' +
    'td{padding:6px 5px;border:1px solid #ddd;font-size:9px}tr:nth-child(even){background:#fafafa}' +
    'tr.cs91{border-left:3px solid #87c1ff}td.cs91-bg{background:#D5E2F2}' +
    'tr.row-closed td{background:' + _ksClosedRowColor + '!important;}' +
    '.day-group{margin-bottom:10px;page-break-inside:avoid}' +
    '.group-head{display:flex;justify-content:space-between;align-items:center;background:#FDF8EE;border:1px solid #C9A84C;border-left:3px solid #C9A84C;border-radius:6px 6px 0 0;padding:6px 12px;margin-top:8px}' +
    '.group-date{font-weight:700;font-size:11px;color:#1B2A4A}.group-count{background:#C9A84C;color:#fff;font-weight:700;font-size:10px;padding:1px 10px;border-radius:20px}' +
    'tr.ju-label-row{page-break-after:avoid}tr.ju-label-row td{background:#FDF8EE;color:#1B2A4A;font-weight:700;font-size:10px;letter-spacing:.5px;text-transform:uppercase;padding:5px 8px;border:1px solid #C9A84C;text-align:left}' +
    '.foot{margin-top:12px;font-size:8px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:8px}' +
    '@media print{@page{margin:6mm;size:landscape}}.page-break{page-break-before:auto}' +
    _printColCss() +
    '</style></head><body>' +
    headerHtml +
    headerNotes +
    rowsHtml +
    '<div class="foot">Generated: ' +
    new Date().toLocaleString('en-IN') +
    ' � ' +
    (window.shopName || 'KS') +
    '</div>' +
    '</body></html>';

  win.document.write(html);
  win.document.close();
  setTimeout(function () {
    win.print();
  }, 500);
}

function printTableHtml(innerRows) {
  var keys = _printColKeys();
  var head = '';
  for (var i = 0; i < keys.length; i++) {
    head +=
      '<th class="' +
      _printColCls(keys[i]) +
      '">' +
      (_printColLabels[keys[i]] || keys[i]) +
      '</th>';
  }
  return (
    '<table>' +
    _printColColgroup() +
    '<thead><tr>' +
    head +
    '</tr></thead><tbody>' +
    innerRows +
    '</tbody></table>'
  );
}

function buildJuLabelRow(text, colCount) {
  return (
    '<tr class="ju-label-row">' +
    '<td colspan="' + (colCount || 1) + '">' + escHtml(text) + '</td>' +
    '</tr>'
  );
}

function buildPrintRow(record, prevDates, nextDates, stgName, isCs91Row, today, cs91PrevDates, groupHeading, isClosed) {
  var r = record;
  var rv =
    typeof getCaseDisplayRecord === 'function' ? getCaseDisplayRecord(r) : r;
  var prevList = (prevDates || []).slice();
  if (cs91PrevDates) {
    for (var pi = 0; pi < cs91PrevDates.length; pi++) {
      if (prevList.indexOf(cs91PrevDates[pi]) === -1)
        prevList.push(cs91PrevDates[pi]);
    }
  }
  var prevStr = prevList.map(formatDateShort).join(', ');
  var nextStr = (nextDates || []).map(formatDateShort).join(', ') || '-';
  var cls = [];
  if (isCs91Row) cls.push('cs91');
  if (isClosed) cls.push('row-closed');
  return (
    '<tr' +
    (cls.length ? ' class="' + cls.join(' ') + '"' : '') +
    (isClosed ? ' style="background:' + _ksClosedRowColor + '!important;"' : '') +
    '>' +
    (_pcv('sr') ? '<td class="' + _printColCls('sr') + '">' + r.a + '</td>' : '') +
    (_pcv('pdate') ? '<td class="' + _printColCls('pdate') + '">' + escHtml(prevStr) + '</td>' : '') +
    (_pcv('court')
      ? '<td class="' + _printColCls('court') + (isCs91Row ? ' cs91-bg' : '') + '">' + escHtml(rv.q) + '</td>'
      : '') +
    (_pcv('adv') ? '<td class="' + _printColCls('adv') + '">' + escHtml(rv.k || '-') + '</td>' : '') +
    (_pcv('brief') ? '<td class="' + _printColCls('brief') + '">' + escHtml(rv.l || '-') + '</td>' : '') +
    (_pcv('caseType') ? '<td class="' + _printColCls('caseType') + '">' + escHtml(rv.g) + '</td>' : '') +
    (_pcv('caseNo')
      ? '<td class="' + _printColCls('caseNo') + '">' + escHtml((rv.h ? rv.h : '') + '/' + (rv.i ? rv.i : '')) + '</td>'
      : '') +
    (_pcv('stg') ? '<td class="' + _printColCls('stg') + '">' + escHtml(stgName) + '</td>' : '') +
    (_pcv('ndate') ? '<td class="' + _printColCls('ndate') + '">' + escHtml(nextStr) + '</td>' : '') +
    (_pcv('filer') ? '<td class="' + _printColCls('filer') + '"' + _printPartyEmphStyle(rv, 'filer') + '>' + escHtml(rv.n) + '</td>' : '') +
    (_pcv('answerer') ? '<td class="' + _printColCls('answerer') + '"' + _printPartyEmphStyle(rv, 'answerer') + '>' + escHtml(rv.o) + '</td>' : '') +
    '</tr>'
  );
}

console.log('printRecords.js loaded');