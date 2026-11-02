// barcodes.js - Stock Barcode Printing Modal
// Loaded via csh id 31 (set_barcodes_innerHTML).

const BC_SIZE_KEY = 'barcodeSize';
const BC_PAPER_KEY = 'barcodePaper';
const BC_CUSTOM_KEY = 'barcodeCustom';
const BC_QUICK_KEY = 'barcodeQuickPrint';

function bcClampNum(v, min, max, def) {
  const n = parseFloat(v);
  return isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
}

function bcNormaliseCustom(raw) {
  raw = raw || {};
  const c = Object.assign({}, window[my1uzr.worknOnPg].clientConfig?.BC_CUSTOM_DEFAULT, raw);
  return {
    mode: c.mode === 'sheet' ? 'sheet' : 'roll',
    lw: bcClampNum(c.lw, 10, 300, 50),
    lh: bcClampNum(c.lh, 10, 300, 25),
    gapX: bcClampNum(c.gapX, 0, 50, 0),
    gapY: bcClampNum(c.gapY, 0, 50, 0),
    cols: Math.round(bcClampNum(c.cols, 1, 8, 1)),
    pw: bcClampNum(c.pw, 50, 500, 210),
    ph: bcClampNum(c.ph, 50, 500, 297),
    sCols: Math.round(bcClampNum(c.sCols, 1, 10, 4)),
    sRows: Math.round(bcClampNum(c.sRows, 1, 20, 8)),
    sGapX: bcClampNum(c.sGapX, 0, 50, 2),
    sGapY: bcClampNum(c.sGapY, 0, 50, 2),
    mx: bcClampNum(c.mx, 0, 50, 0),
    my: bcClampNum(c.my, 0, 50, 0)
  };
}

/* Resolve the selected preset (or the custom form) into a real paper object. */
function bcResolvePaper(value, custom) {
  const preset = window[my1uzr.worknOnPg].clientConfig?.BC_PAPER_OPTIONS.find(o => o.v === value);
  if (preset && !preset.custom) return preset;
  const c = bcNormaliseCustom(custom);
  if (c.mode === 'sheet') {
    return { v: 'custom', label: 'Custom sheet', mode: 'sheet', pw: c.pw, ph: c.ph,
      cols: c.sCols, rows: c.sRows, gapX: c.sGapX, gapY: c.sGapY, mx: c.mx, my: c.my };
  }
  return { v: 'custom', label: 'Custom roll', mode: 'roll', lw: c.lw, lh: c.lh,
    cols: c.cols, gapX: c.gapX, gapY: c.gapY };
}

/* Physical layout: page size + label cell size, all in mm. */
function bcResolveLayout(paper) {
  const cols = Math.max(1, Math.min(8, Math.round(paper.cols || 1)));
  if (paper.mode === 'sheet') {
    const pw = paper.pw;
    const ph = paper.ph;
    const gapX = Math.max(0, paper.gapX || 0);
    const gapY = Math.max(0, paper.gapY || 0);
    const mx = Math.max(0, paper.mx || 0);
    const my = Math.max(0, paper.my || 0);
    const rows = Math.max(1, Math.min(20, Math.round(paper.rows || 1)));
    // 0.5 mm slack keeps the last row from spilling onto a second sheet.
    const usableW = Math.max(10, pw - mx * 2 - gapX * (cols - 1));
    const usableH = Math.max(10, ph - my * 2 - gapY * (rows - 1) - 0.5);
    return { mode: 'sheet', pageW: pw, pageH: ph, cols: cols, rows: rows,
      gapX: gapX, gapY: gapY, mx: mx, my: my, labelW: usableW / cols, labelH: usableH / rows };
  }
  const lw = paper.lw;
  const lh = paper.lh;
  const gapX = Math.max(0, paper.gapX || 0);
  const gapY = Math.max(0, paper.gapY || 0);
  return { mode: 'roll', pageW: lw * cols + gapX * (cols - 1), pageH: lh + gapY,
    cols: cols, rows: 0, gapX: gapX, gapY: gapY, mx: 0, my: 0, labelW: lw, labelH: lh };
}

function bcEsc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

/* Measure a JsBarcode SVG in real mm (its viewBox is the exact source). */
function bcMeasureSvg(svg) {
  const vb = svg.getAttribute('viewBox');
  let w = 0;
  let h = 0;
  if (vb) {
    const p = vb.trim().split(/\s+/).map(Number);
    w = p[2] || 0;
    h = p[3] || 0;
  }
  if (!w || !h) {
    w = parseFloat(svg.getAttribute('width')) || 0;
    h = parseFloat(svg.getAttribute('height')) || 0;
  }
  return { wPx: w, hPx: h, wMm: w * window[my1uzr.worknOnPg].clientConfig?.BC_MM_PER_PX, hMm: h * window[my1uzr.worknOnPg].clientConfig?.BC_MM_PER_PX };
}

/* Build one CODE128 SVG at its true physical size. It is never blown up to
   fill the label; it only shrinks when the code would not fit. The returned
   barMm is the final physical bar width, so callers can warn when it drops
   below the 0.25 mm scanning limit. */
function bcBuildSvg(code, sizeOpt, maxWMm, maxHMm) {
  let barMm = sizeOpt.barMm;
  let barHMm = sizeOpt.hMm;
  let svg = null;
  let m = { wPx: 0, hPx: 0, wMm: 0, hMm: 0 };
  let tooWide = false;

  for (let i = 0; i < 10; i++) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    try {
      JsBarcode(svg, String(code), {
        format: 'CODE128',
        // Fractional px keeps the module width exact: 1 px = 25.4/96 mm.
        width: barMm * window[my1uzr.worknOnPg].clientConfig?.BC_PX_PER_MM,
        height: barHMm * window[my1uzr.worknOnPg].clientConfig?.BC_PX_PER_MM,
        displayValue: window[my1uzr.worknOnPg].clientConfig?.barCode_displayValue,
        fontSize: Math.max(6, sizeOpt.fontPt * 96 / 72),
        margin: 0,
        textMargin: 1
      });
    } catch (e) {
      svg.textContent = String(code);
      return { html: svg.outerHTML, wMm: 0, hMm: 0, barMm: barMm, warn: true };
    }

    m = bcMeasureSvg(svg);
    let changed = false;

    if (m.wMm > maxWMm + 0.05) {
      const next = Math.max(window[my1uzr.worknOnPg].clientConfig?.BC_MIN_BAR_MM, barMm * (maxWMm / m.wMm));
      if (next < barMm - 0.001) { barMm = next; changed = true; }
      else { tooWide = true; }
    }
    if (m.hMm > maxHMm + 0.05) {
      const textMm = Math.max(2, m.hMm - barHMm);
      const next = Math.max(6, maxHMm - textMm);
      if (next < barHMm - 0.001) { barHMm = next; changed = true; }
    }
    if (!changed) break;
  }

  const scale = Math.min(1, maxWMm / (m.wMm || 1), maxHMm / (m.hMm || 1));
  const outW = m.wMm * scale;
  const outH = m.hMm * scale;
  if (outW > 0) {
    svg.setAttribute('width', outW.toFixed(3) + 'mm');
    svg.setAttribute('height', outH.toFixed(3) + 'mm');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }

  const effBarMm = barMm * scale;
  const warn = tooWide || scale < 0.98 || effBarMm < window[my1uzr.worknOnPg].clientConfig?.BC_MIN_BAR_MM - 0.005;
  return { html: svg.outerHTML, wMm: outW, hMm: outH, barMm: effBarMm, warn: warn };
}

/* One label: product name above a barcode that fits the cell. */
function bcBuildLabel(lab, layout, sizeOpt) {
  const labelH = layout.labelH;
  const namePt = Math.max(6, Math.min(sizeOpt.fontPt, labelH >= 30 ? sizeOpt.fontPt : 8));
  const nameLines = labelH >= 30 ? 2 : 1;
  const nameBlockMm = (namePt * 25.4 / 72) * 1.15 * nameLines + 0.6;
  const maxBarcodeH = Math.max(6, labelH - 1.2 - nameBlockMm - 0.4);
  // CODE128 wants a quiet zone of 10x the module width on both sides.
  const quietMm = Math.max(2, Math.min(3.5, sizeOpt.barMm * 10));
  const maxW = Math.max(8, layout.labelW - quietMm * 2 - 0.8);
  const bc = bcBuildSvg(lab.code, sizeOpt, maxW, maxBarcodeH);
  const nameStyle = 'font-size:' + namePt.toFixed(1) + 'pt;max-height:' + (nameLines * 1.18).toFixed(2) + 'em;';

  return {
    html: '<div class="bc-label">'
      + '<div class="bc-name" style="' + nameStyle + '">' + bcEsc(lab.name) + '</div>'
      + bc.html
      + '</div>',
    warn: bc.warn
  };
}

/* Group labels into rows (HTML strings). On a roll every row is its own page;
   on a sheet the rows are chunked into pages by the caller. */
function bcBuildRows(labels, layout, sizeOpt) {
  const rows = [];
  let warn = false;
  for (let i = 0; i < labels.length; i += layout.cols) {
    let cells = '';
    labels.slice(i, i + layout.cols).forEach(function (lab) {
      const one = bcBuildLabel(lab, layout, sizeOpt);
      if (one.warn) warn = true;
      cells += one.html;
    });
    rows.push('<div class="bc-row">' + cells + '</div>');
  }
  return { rows: rows, warn: warn };
}

/* Full print document: exact @page size, preview toolbar, no trailing page. */
function bcBuildPrintHtml(labels, paper, sizeOpt, title) {
  const layout = bcResolveLayout(paper);
  const built = bcBuildRows(labels, layout, sizeOpt);

  const pageW = layout.pageW.toFixed(2);
  const pageH = layout.pageH.toFixed(2);
  const labelW = layout.labelW.toFixed(2);
  const labelH = layout.labelH.toFixed(2);
  const gapX = layout.gapX.toFixed(2);
  const gapY = layout.gapY.toFixed(2);
  // 0.2 mm slack on a roll page prevents a hairline extra page.
  const rowH = Math.max(1, layout.labelH - (layout.mode === 'roll' ? 0.2 : 0)).toFixed(2);
  const paperLabel = layout.mode === 'roll'
    ? labelW + ' x ' + labelH + ' mm'
    : pageW + ' x ' + pageH + ' mm sheet';

  let body;
  if (layout.mode === 'sheet') {
    // One .bc-sheet block per physical sheet; break after each except the last.
    const sheetH = Math.max(10, layout.pageH - 0.3).toFixed(2);
    const perSheet = Math.max(1, layout.rows);
    let blocks = '';
    for (let i = 0; i < built.rows.length; i += perSheet) {
      blocks += '<div class="bc-sheet" style="height:' + sheetH + 'mm">'
        + built.rows.slice(i, i + perSheet).join('')
        + '</div>';
    }
    body = blocks;
  } else {
    body = '<div class="bc-rows">'
      + built.rows.map(function (r) { return r.replace('class="bc-row"', 'class="bc-row pagebreak"'); }).join('')
      + '</div>';
  }

  const html = '<!DOCTYPE html><html><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<title>' + bcEsc(title || 'Barcode Labels') + '</title>'
    + '<style>'
    + '@page { size: ' + pageW + 'mm ' + pageH + 'mm; margin: 0; }'
    + 'html,body { margin:0; padding:0; background:#fff; }'
    + 'body { font-family: Arial, Helvetica, sans-serif; -webkit-print-color-adjust:exact; print-color-adjust:exact; }'
    + '.bc-toolbar { position:sticky; top:0; z-index:9; display:flex; flex-wrap:wrap; align-items:center; gap:8px; padding:8px 12px; background:#fff8e1; border-bottom:1px solid #e6d68a; font:12.5px Arial, sans-serif; }'
    + '.bc-tip { flex:1 1 320px; line-height:1.35; }'
    + '.bc-btn { padding:6px 12px; border:1px solid #0d6efd; background:#fff; color:#0d6efd; border-radius:4px; cursor:pointer; font:600 12.5px Arial, sans-serif; }'
    + '.bc-btn-primary { background:#0d6efd; color:#fff; }'
    + '@media print { .bc-toolbar { display:none !important; } body { padding:0 !important; background:#fff !important; } }'
    + '.bc-page { width:' + pageW + 'mm; margin:0 auto; background:#fff; }'
    + '.bc-sheet { padding:' + layout.my.toFixed(2) + 'mm ' + layout.mx.toFixed(2) + 'mm; box-sizing:border-box; display:flex; flex-direction:column; gap:' + gapY + 'mm; break-after:page; page-break-after:always; }'
    + '.bc-sheet:last-child { break-after:auto; page-break-after:auto; }'
    + '.bc-rows { display:flex; flex-direction:column; }'
    + '.bc-row { display:flex; gap:' + gapX + 'mm; width:100%; height:' + rowH + 'mm; box-sizing:border-box; break-inside:avoid; page-break-inside:avoid; }'
    + '.bc-row.pagebreak { break-after:page; page-break-after:always; }'
    + '.bc-row.pagebreak:last-child { break-after:auto; page-break-after:auto; }'
    + '.bc-label { width:' + labelW + 'mm; height:100%; box-sizing:border-box; padding:0.4mm; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; }'
    + '.bc-name { font-weight:600; line-height:1.15; text-align:center; width:100%; max-height:2.36em; overflow:hidden; word-break:break-word; margin:0 0 0.4mm; }'
    + '.bc-label svg { display:block; flex:0 0 auto; max-width:100%; }'
    + '@media screen {'
    +   'body { padding:16px 12px 40px; background:#eef1f5; }'
    +   '.bc-page { box-shadow:0 4px 20px rgba(0,0,0,.16); }'
    +   '.bc-rows .bc-row + .bc-row { margin-top:10px; border-top:1px dashed #c9ced6; }'
    +   '.bc-sheet + .bc-sheet { margin-top:14px; border-top:1px dashed #c9ced6; }'
    + '}'
    + '</style></head><body>'
    + '<div class="bc-toolbar">'
    +   '<div class="bc-tip"><strong>Before printing:</strong> choose your label printer, Paper <b>' + bcEsc(paperLabel) + '</b>, Margins <b>None</b>, Scale <b>100%</b> (not "Fit to page").</div>'
    +   '<button type="button" class="bc-btn bc-btn-primary" id="bcPrintNow">Print</button>'
    +   '<button type="button" class="bc-btn" id="bcClosePreview">Close</button>'
    + '</div>'
    + '<div class="bc-page">' + body + '</div>'
    + '</body></html>';

  return { html: html, warn: built.warn, layout: layout, paperLabel: paperLabel };
}

let bcJsBarcodeLoaded = false;
async function bcLoadJsBarcode() {
  if (bcJsBarcodeLoaded || (typeof JsBarcode !== 'undefined')) { bcJsBarcodeLoaded = true; return; }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
    s.onload = () => { bcJsBarcodeLoaded = true; resolve(); };
    s.onerror = () => reject(new Error('Failed to load JsBarcode'));
    document.head.appendChild(s);
  });
}

function bcGetStored(key, def) {
  try { return localStorage.getItem(key) || def; } catch (e) { return def; }
}
function bcSetStored(key, val) {
  try { localStorage.setItem(key, val); } catch (e) {}
}

async function set_barcodes_innerHTML(...params) {
  return new Promise(async (resolve) => {
    if (typeof create_modal_dynamically !== 'function') {
      console.warn('create_modal_dynamically not available');
      resolve(false);
      return;
    }
    if (window.suppressModals) {
      window.suppressModals = false;
      resolve(false);
      return;
    }
    try {
      const modalId = 'barcodesModal_' + Date.now();
      const modalResult = create_modal_dynamically(modalId);
      if (!modalResult) { resolve(false); return; }
      const { contentElement, modalInstance, modalElement } = modalResult;

      setTimeout(() => {
        const md = modalElement.querySelector('.modal-dialog');
        if (md) { md.classList.remove('modal-dialog-centered'); md.style.marginTop = '40px'; md.style.maxWidth = '100vw'; md.style.maxHeight = '90vh'; }
        modalElement.style.zIndex = '1051';
      }, 50);

      let stock = [];
      try { stock = await dbDexieManager.getAllRecords(dbnm, 's') || []; } catch (e) { console.error('barcodes: load s failed', e); stock = []; }

      // sort by name then date
      stock = [...stock].sort(function (a, b) {
        const na = (a.gn || '').toLowerCase();
        const nb = (b.gn || '').toLowerCase();
        if (na !== nb) return na < nb ? -1 : 1;
        return String(b.b || '').localeCompare(String(a.b || ''));
      });

      const sizeVal = bcGetStored(BC_SIZE_KEY, 'medium');
      const paperVal = bcGetStored(BC_PAPER_KEY, 'label50x25');
      let customVal;
      try { customVal = bcNormaliseCustom(JSON.parse(bcGetStored(BC_CUSTOM_KEY, '{}'))); }
      catch (e) { customVal = bcNormaliseCustom({}); }
      const quickVal = bcGetStored(BC_QUICK_KEY, '0') === '1';

      contentElement.innerHTML = `
        <div class="modal-header" style="padding:0.4rem 0.75rem;">
          <h5 class="modal-title"><i class="fas fa-barcode me-2"></i>Stock Barcodes</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="padding:0.4rem 0.75rem;">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <small class="text-muted">Select products and set how many labels to print for each.</small>
            <div class="form-check form-check-inline mb-0">
              <input class="form-check-input border border-dark" type="checkbox" id="bcSelectAll">
              <label class="form-check-label small" for="bcSelectAll">Select all</label>
            </div>
          </div>
          <div id="bcStockList" style="max-height: calc(100vh - 300px); overflow-y: auto; border:1px solid #dee2e6; border-radius:6px;">
            ${stock.length ? stock.map(function (it, idx) {
              const name = it.gn || 'Product';
              const date = it.b || '';
              const rate = (it.k != null && it.k !== '') ? Number(it.k).toFixed(2) : '';
              const avail = (it.qAvlb != null) ? it.qAvlb : '';
              return '<div class="d-flex align-items-center gap-2 px-2 py-1 border-bottom bc-row" data-idx="' + idx + '" style="font-size:0.85rem;">'
                + '<input type="checkbox" class="form-check-input bc-chk border border-dark" data-idx="' + idx + '">'
                + '<input type="number" class="form-control form-control-sm bc-cnt border border-dark" data-idx="' + idx + '" min="1" value="1" disabled style="width:60px;">'
                + '<div class="flex-grow-1" style="min-width:0;">'
                + '<div class="fw-bold text-truncate" title="' + name + '">' + name + '</div>'
                + '<small class="text-muted">' + date + (rate ? ' · Rate ₹' + rate : '') + (avail !== '' ? ' · Avail: ' + avail : '') + '</small>'
                + '</div>'
                + '</div>';
            }).join('') : '<p class="text-muted text-center py-3 mb-0">No stock found</p>'}
          </div>
        </div>
        <div class="modal-footer barcode-footer">
          <div class="barcode-footer-controls">
            <div class="barcode-field">
              <label for="bcBarcodeSize" class="barcode-label">Barcode</label>
              <select id="bcBarcodeSize" class="form-select form-select-sm border border-dark">
                ${window[my1uzr.worknOnPg].clientConfig?.BC_SIZE_OPTIONS.map(o => '<option value="' + o.v + '"' + (o.v === sizeVal ? ' selected' : '') + '>' + o.label + '</option>').join('')}
              </select>
            </div>
            <div class="barcode-field">
              <label for="bcPaperSize" class="barcode-label">Paper</label>
              <select id="bcPaperSize" class="form-select form-select-sm border border-dark">
                ${window[my1uzr.worknOnPg].clientConfig?.BC_PAPER_OPTIONS.map(o => '<option value="' + o.v + '"' + (o.v === paperVal ? ' selected' : '') + '>' + o.label + '</option>').join('')}
              </select>
            </div>
            <div class="form-check form-check-inline barcode-quick mb-0">
              <input class="form-check-input border border-dark" type="checkbox" id="bcQuickPrint" ${quickVal ? 'checked' : ''}>
              <label class="form-check-label small" for="bcQuickPrint">Print without preview</label>
            </div>
            <small class="barcode-hint" id="bcPrintHint"></small>
          </div>
          <button id="bcPrintBtn" class="btn btn-primary btn-sm barcode-print-btn" disabled>
            <i class="fas fa-print me-1"></i>Print
          </button>
          <div id="bcCustomBox" class="barcode-custom" hidden>
            <div class="barcode-custom-head">
              <label for="bcCustomMode" class="barcode-label">Size type</label>
              <select id="bcCustomMode" class="form-select form-select-sm">
                <option value="roll">Roll label</option>
                <option value="sheet">Sticker sheet</option>
              </select>
            </div>
            <div class="barcode-custom-fields" data-mode="roll">
              <label>Label W <input id="bcLw" class="form-control form-control-sm" type="number" step="0.1" min="10" max="300"></label>
              <label>Label H <input id="bcLh" class="form-control form-control-sm" type="number" step="0.1" min="10" max="300"></label>
              <label>Column gap <input id="bcGapX" class="form-control form-control-sm" type="number" step="0.1" min="0" max="50"></label>
              <label>Feed gap <input id="bcGapY" class="form-control form-control-sm" type="number" step="0.1" min="0" max="50"></label>
              <label>Columns <input id="bcCols" class="form-control form-control-sm" type="number" step="1" min="1" max="8"></label>
            </div>
            <div class="barcode-custom-fields" data-mode="sheet" hidden>
              <label>Paper W <input id="bcSPw" class="form-control form-control-sm" type="number" step="0.1" min="50" max="500"></label>
              <label>Paper H <input id="bcSPh" class="form-control form-control-sm" type="number" step="0.1" min="50" max="500"></label>
              <label>Columns <input id="bcSCols" class="form-control form-control-sm" type="number" step="1" min="1" max="10"></label>
              <label>Rows <input id="bcSRows" class="form-control form-control-sm" type="number" step="1" min="1" max="20"></label>
              <label>Gap X <input id="bcSGapX" class="form-control form-control-sm" type="number" step="0.1" min="0" max="50"></label>
              <label>Gap Y <input id="bcSGapY" class="form-control form-control-sm" type="number" step="0.1" min="0" max="50"></label>
              <label>Margin X <input id="bcSMx" class="form-control form-control-sm" type="number" step="0.1" min="0" max="50"></label>
              <label>Margin Y <input id="bcSMy" class="form-control form-control-sm" type="number" step="0.1" min="0" max="50"></label>
            </div>
          </div>
        </div>
      `;

      const sizeSel = contentElement.querySelector('#bcBarcodeSize');
      const paperSel = contentElement.querySelector('#bcPaperSize');
      const printBtn = contentElement.querySelector('#bcPrintBtn');
      const selectAll = contentElement.querySelector('#bcSelectAll');
      const customBox = contentElement.querySelector('#bcCustomBox');
      const hint = contentElement.querySelector('#bcPrintHint');
      const quickChk = contentElement.querySelector('#bcQuickPrint');

      function numField(id, def) {
        const el = contentElement.querySelector('#' + id);
        const n = el ? parseFloat(el.value) : NaN;
        return isFinite(n) ? n : def;
      }

      function readCustom() {
        return bcNormaliseCustom({
          mode: (contentElement.querySelector('#bcCustomMode') || {}).value || 'roll',
          lw: numField('bcLw', 50), lh: numField('bcLh', 25),
          gapX: numField('bcGapX', 0), gapY: numField('bcGapY', 0), cols: numField('bcCols', 1),
          pw: numField('bcSPw', 210), ph: numField('bcSPh', 297),
          sCols: numField('bcSCols', 4), sRows: numField('bcSRows', 8),
          sGapX: numField('bcSGapX', 2), sGapY: numField('bcSGapY', 2),
          mx: numField('bcSMx', 0), my: numField('bcSMy', 0)
        });
      }

      function fillCustom(c) {
        const set = function (id, v) {
          const el = contentElement.querySelector('#' + id);
          if (el) el.value = v;
        };
        set('bcCustomMode', c.mode);
        set('bcLw', c.lw); set('bcLh', c.lh); set('bcGapX', c.gapX); set('bcGapY', c.gapY); set('bcCols', c.cols);
        set('bcSPw', c.pw); set('bcSPh', c.ph); set('bcSCols', c.sCols); set('bcSRows', c.sRows);
        set('bcSGapX', c.sGapX); set('bcSGapY', c.sGapY); set('bcSMx', c.mx); set('bcSMy', c.my);
      }

      function saveCustom() {
        try { bcSetStored(BC_CUSTOM_KEY, JSON.stringify(readCustom())); } catch (e) { /* ignore */ }
      }

      function syncHint() {
        if (!hint) return;
        const p = bcResolvePaper(paperSel ? paperSel.value : 'label50x25', readCustom());
        const l = bcResolveLayout(p);
        hint.textContent = l.mode === 'roll'
          ? 'Label printer: paper ' + l.labelW.toFixed(1) + ' x ' + l.labelH.toFixed(1) + ' mm, margins None, scale 100%.'
          : 'Sheet: paper ' + l.pageW.toFixed(0) + ' x ' + l.pageH.toFixed(0) + ' mm, margins None, scale 100%.';
      }

      function syncCustom() {
        if (customBox) customBox.hidden = !(paperSel && paperSel.value === 'custom');
        const mode = (contentElement.querySelector('#bcCustomMode') || {}).value || 'roll';
        contentElement.querySelectorAll('.barcode-custom-fields').forEach(function (el) {
          el.hidden = el.getAttribute('data-mode') !== mode;
        });
        syncHint();
      }

      fillCustom(customVal);
      syncCustom();

      function refreshPrintBtn() {
        const any = Array.from(contentElement.querySelectorAll('.bc-chk')).some(c => c.checked);
        if (printBtn) printBtn.disabled = !any;
      }

      // checkbox <-> count input
      contentElement.querySelectorAll('.bc-chk').forEach(function (chk) {
        chk.addEventListener('change', function () {
          const idx = chk.getAttribute('data-idx');
          const cnt = contentElement.querySelector('.bc-cnt[data-idx="' + idx + '"]');
          if (cnt) {
            if (chk.checked) { cnt.disabled = false; if (!cnt.value || Number(cnt.value) < 1) cnt.value = '1'; }
            else { cnt.disabled = true; cnt.value = ''; }
          }
          refreshPrintBtn();
        });
      });
      contentElement.querySelectorAll('.bc-cnt').forEach(function (cnt) {
        cnt.addEventListener('input', function () {
          if (cnt.value !== '' && Number(cnt.value) < 1) cnt.value = '1';
        });
      });
      refreshPrintBtn();

      if (selectAll) {
        selectAll.addEventListener('change', function () {
          contentElement.querySelectorAll('.bc-chk').forEach(function (chk) {
            chk.checked = selectAll.checked;
            chk.dispatchEvent(new Event('change'));
          });
        });
      }

      if (sizeSel) sizeSel.addEventListener('change', function () { bcSetStored(BC_SIZE_KEY, sizeSel.value); syncHint(); });
      if (paperSel) paperSel.addEventListener('change', function () { bcSetStored(BC_PAPER_KEY, paperSel.value); syncCustom(); });
      const customModeSel = contentElement.querySelector('#bcCustomMode');
      if (customModeSel) customModeSel.addEventListener('change', function () { syncCustom(); saveCustom(); });
      contentElement.querySelectorAll('.barcode-custom input, .barcode-custom select').forEach(function (el) {
        el.addEventListener('input', function () { syncHint(); saveCustom(); });
        el.addEventListener('change', function () { syncHint(); saveCustom(); });
      });
      if (quickChk) quickChk.addEventListener('change', function () { bcSetStored(BC_QUICK_KEY, quickChk.checked ? '1' : '0'); });

      async function doPrint() {
        console.log('[barcode print] start');
        const sizeOpt = window[my1uzr.worknOnPg].clientConfig?.BC_SIZE_OPTIONS.find(o => o.v === (sizeSel ? sizeSel.value : 'medium')) || window[my1uzr.worknOnPg].clientConfig?.BC_SIZE_OPTIONS[1];
        const custom = readCustom();
        const paperOpt = bcResolvePaper(paperSel ? paperSel.value : 'label50x25', custom);
        bcSetStored(BC_SIZE_KEY, sizeOpt.v);
        bcSetStored(BC_PAPER_KEY, paperSel ? paperSel.value : paperOpt.v);
        bcSetStored(BC_CUSTOM_KEY, JSON.stringify(custom));

        // ---- collect selected rows -------------------------------------------
        const selected = [];
        contentElement.querySelectorAll('.bc-chk').forEach(function (chk) {
          if (!chk.checked) return;
          const idx = chk.getAttribute('data-idx');
          const cnt = contentElement.querySelector('.bc-cnt[data-idx="' + idx + '"]');
          const n = Math.max(1, parseInt(cnt && cnt.value, 10) || 1);
          const it = stock[parseInt(idx, 10)];
          if (it) selected.push({ item: it, count: n });
        });
        if (!selected.length) {
          if (typeof showToast === 'function') showToast('Select at least one product.', { type: 'warning', duration: 2000 });
          return;
        }

        // ---- ensure JsBarcode is available -----------------------------------
        try {
          await bcLoadJsBarcode();
        } catch (e) {
          if (typeof showToast === 'function') showToast('Failed to load barcode library.', { type: 'error', duration: 3000 });
          return;
        }

        // ---- expand labels ----------------------------------------------------
        const labels = [];
        selected.forEach(function (sel) {
          const it = sel.item;
          const name = it.gn || 'Product';
          const code = String(it.a);
          for (let i = 0; i < sel.count; i++) {
            labels.push({ name: name, code: code });
          }
        });
        if (!labels.length) {
          if (typeof showToast === 'function') showToast('Nothing to print.', { type: 'warning', duration: 2000 });
          return;
        }

        // ---- build the exact-size print document -----------------------------
        const doc = bcBuildPrintHtml(labels, paperOpt, sizeOpt, 'Barcode Labels ' + paperOpt.label);
        if (doc.warn && typeof showToast === 'function') {
          showToast('Some barcodes are tight for this label. Check the preview or use a larger label.', { type: 'warning', duration: 4500 });
        }

        // ---- open the preview window -----------------------------------------
        const win = window.open('', '_blank');
        if (!win) {
          if (typeof showToast === 'function') showToast('Popup blocked. Allow popups to print.', { type: 'warning', duration: 3000 });
          return;
        }
        win.document.open();
        win.document.write(doc.html);
        win.document.close();

        const printNow = win.document.getElementById('bcPrintNow');
        if (printNow) printNow.addEventListener('click', function () { try { win.focus(); win.print(); } catch (e) { /* ignore */ } });
        const closePreview = win.document.getElementById('bcClosePreview');
        if (closePreview) closePreview.addEventListener('click', function () { try { win.close(); } catch (e) { /* ignore */ } });

        // The preview is the default. "Print without preview" still opens the
        // browser dialog, but only after the document has fully rendered.
        const quick = bcGetStored(BC_QUICK_KEY, '0') === '1';
        const go = function () {
          if (!quick) return;
          try { win.focus(); win.print(); } catch (e) { /* ignore */ }
        };
        const ready = function () {
          try {
            if (win.document.fonts && win.document.fonts.ready) {
              win.document.fonts.ready.then(function () { setTimeout(go, 80); });
            } else {
              setTimeout(go, 120);
            }
          } catch (e) {
            setTimeout(go, 120);
          }
        };
        if (win.document.readyState === 'complete') ready();
        else win.addEventListener('load', ready, { once: true });
        console.log('[barcode print] preview opened');
      }
      if (printBtn) printBtn.addEventListener('click', doPrint);

      /* Sync the enabled/disabled state of the Print button at open. */
      refreshPrintBtn();

      modalInstance.show();
      resolve(true);
    } catch (e) {
      console.error('barcodes modal failed:', e);
      resolve(false);
    }
  });
}

window.set_barcodes_innerHTML = set_barcodes_innerHTML;

/* ---- barcode modal footer styles (idempotent) ---- */
(function bcInjectFooterStyles() {
  if (document.getElementById('bc-footer-styles')) return;
  const css = `
    .barcode-footer {
      display:flex; flex-wrap:wrap; align-items:center;
      justify-content:space-between; gap:8px 12px;
      padding:8px 12px;
    }
    .barcode-footer-controls {
      display:flex; flex-wrap:wrap; align-items:center;
      gap:8px 12px; flex:1 1 auto; min-width:0;
    }
    .barcode-field { display:flex; align-items:center; gap:6px; min-width:0; }
    .barcode-field .barcode-label {
      font-size:.8rem; color:#6c757d; white-space:nowrap; margin:0;
    }
    .barcode-field .form-select {
      flex:1 1 auto; min-width:0; max-width:170px;
    }
    .barcode-print-btn { flex:0 0 auto; white-space:nowrap; }
    .barcode-quick .form-check-label { font-size:.78rem; color:#495057; white-space:nowrap; }
    .barcode-hint {
      flex:1 1 100%; font-size:.72rem; color:#6c757d;
      margin:2px 0 0; line-height:1.3;
    }
    .barcode-custom {
      flex:1 1 100%; border-top:1px solid #e9ecef;
      padding-top:6px; margin-top:2px; min-width:0;
    }
    .barcode-custom[hidden], .barcode-custom-fields[hidden] { display:none !important; }
    .barcode-custom-head { display:flex; align-items:center; gap:8px; font-size:.78rem; }
    .barcode-custom-head .barcode-label { color:#6c757d; white-space:nowrap; margin:0; }
    .barcode-custom-head .form-select { max-width:170px; }
    .barcode-custom-fields { display:flex; flex-wrap:wrap; gap:6px 10px; margin-top:6px; }
    .barcode-custom-fields label {
      display:flex; align-items:center; gap:4px;
      font-size:.74rem; color:#6c757d; margin:0; white-space:nowrap;
    }
    .barcode-custom-fields input { width:72px; }
    @media (max-width: 420px) {
      .barcode-footer { flex-direction:column; align-items:stretch; }
      .barcode-footer-controls { flex-direction:column; align-items:stretch; gap:6px; }
      .barcode-field { justify-content:space-between; }
      .barcode-field .form-select { max-width:none; }
      .barcode-print-btn { width:100%; }
      .barcode-custom-head { justify-content:space-between; }
      .barcode-custom-head .form-select { max-width:none; }
      .barcode-custom-fields label { justify-content:space-between; }
      .barcode-custom-fields input { flex:1 1 auto; max-width:120px; }
    }
  `;
  const style = document.createElement('style');
  style.id = 'bc-footer-styles';
  style.textContent = css;
  document.head.appendChild(style);
})();
