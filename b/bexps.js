// expenditures.js - Expenditure (Expences) voucher entry modal
// Loaded via csh id 32 (set_expenditures_innerHTML).

// TODO: set these to the values your server expects.
const EXP_FN_SAVE = 123;   // fn for creating a new expenditure voucher
const EXP_FN_UPDATE = -44; // fn for updating (0 = use EXP_FN_SAVE with x.a set)
const EXP_FN_DELETE = -43; // fn for deleting

let EXP_PAYMENTS = [];
let EXP_EDIT_ID = null;
let EXP_ACTIVE_MODAL_ID = '';
let EXP_CLIENTS = [];
let EXP_CASHIERS = [];
let EXP_PAYMENT_MODE = 1;

const EXP_LAST_CASHIER_KEY = 'expLastCashier';

function expGetStored(key, def) { try { return localStorage.getItem(key) || def; } catch (e) { return def; } }
function expSetStored(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

function expToast(msg, type) {
  if (typeof showToast === 'function') showToast(msg, { type: type || 'info', duration: 2500 });
  else console.log(msg);
}

async function expLoadClients() {
  try { EXP_CLIENTS = await dbDexieManager.getAllRecords(dbnm, 'c') || []; } catch (e) { EXP_CLIENTS = []; }
  try {
    const cfg = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig) || {};
    const ids = Array.isArray(cfg.cashiers) ? cfg.cashiers : [];
    EXP_CASHIERS = ids.map(function (id) {
      const c = EXP_CLIENTS.find(function (x) { return String(x.a) === String(id); });
      return { id: id, name: c ? (c.h || c.e || String(id)) : String(id) };
    });
  } catch (e) { EXP_CASHIERS = []; }
}

function expClientName(id) {
  const c = EXP_CLIENTS.find(function (x) { return String(x.a) === String(id); });
  if (!c) return (id == null || id === '' ? '-' : String(id));
  return c.e || c.h || String(id);
}

function expCashierById(id) {
  return EXP_CASHIERS.find(function (c) { return String(c.id) === String(id); });
}

function expPaymentTypeText(t) {
  const map = { '0': 'Select', '1': 'Cash', '2': 'Cheque', '3': 'Card', '4': 'UPI', '5': 'Bank' };
  return map[String(t)] || String(t);
}

// Billing-style letter icon (C/Q/A/U/B), same as getPaymentTypeIcon in b.js.
function expPaymentTypeIcon(t) {
  if (typeof window.getPaymentTypeIcon === 'function') {
    try { return window.getPaymentTypeIcon(String(t)); } catch (e) {}
  }
  const map = { '0': '*', '1': 'C', '2': 'Q', '3': 'A', '4': 'U', '5': 'B' };
  return map[String(t)] || '0';
}

// Overlaid select on a letter-icon button, exactly like the bill payment row.
function expPaymentTypePickerHTML(id, selected) {
  const opts = [
    ['0', 'Select'], ['1', 'C Cash'], ['2', 'Q Cheque'], ['3', 'A Card'], ['4', 'U UPI'], ['5', 'B Bank']
  ].map(function (o) {
    return '<option value="' + o[0] + '"' + (String(selected) === String(o[0]) ? ' selected' : '') + '>' + o[1] + '</option>';
  }).join('');
  return '<div class="d-inline-block position-relative" style="height:31px;">'
    + '<button class="btn btn-primary btn-sm" id="' + id + '_btn" type="button" tabindex="-1" style="pointer-events:none;">'
    + '<span id="' + id + '_ico">' + expPaymentTypeIcon(selected) + '</span>'
    + '</button>'
    + '<select id="' + id + '" onchange="this.blur();window.expUpdatePaymentTypeIcon(\'' + id + '\')" style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:3;">'
    + opts
    + '</select>'
    + '</div>';
}

window.expUpdatePaymentTypeIcon = function (id) {
  const sel = document.getElementById(id);
  const ico = document.getElementById(id + '_ico');
  if (sel && ico) ico.textContent = expPaymentTypeIcon(sel.value);
};

function expUpdateCashierButton(id) {
  const btn = document.getElementById('exp_receivedCashierBtn');
  if (!btn) return;
  const c = expCashierById(id);
  if (!c) {
    btn.innerHTML = '<i class="fas fa-user"></i>';
    btn.style.background = '';
    btn.style.color = '';
    btn.style.borderColor = '#212529';
    btn.title = 'Select Cashier';
    return;
  }
  const raw = String(c.name || ('#' + c.id));
  const firstName = raw.split(/\s+/)[0];
  btn.textContent = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : ('#' + c.id);
  btn.style.background = '#0d6efd';
  btn.style.color = '#fff';
  btn.style.borderColor = '#0d6efd';
  btn.title = raw;
}

window.expRestoreCashier = function () {
  const hidden = document.getElementById('exp_receivedCashier');
  const saved = expGetStored(EXP_LAST_CASHIER_KEY, '');
  if (hidden && saved && expCashierById(saved)) hidden.value = String(saved);
  expUpdateCashierButton(hidden ? hidden.value : '');
};

function expRenderCashierDropdown(dd) {
  const cur = (document.getElementById('exp_receivedCashier') || {}).value || '';
  if (!EXP_CASHIERS.length) {
    dd.innerHTML = '<div class="p-2 text-muted small">No cashiers available</div>';
  } else {
    dd.innerHTML = EXP_CASHIERS.map(function (c) {
      const sel = String(c.id) === String(cur);
      return '<div data-a="' + c.id + '" onclick="window.expPickCashier(' + c.id + ')" style="padding:6px 10px;cursor:pointer;border-bottom:1px solid #eee;' + (sel ? 'background:#0d6efd;color:#fff;' : '') + '"><div style="font-weight:600;font-size:.85rem;">' + (sel ? '<i class="fas fa-check me-1"></i>' : '') + (c.name || ('Cashier ' + c.id)) + '</div></div>';
    }).join('') + '<div onclick="window.expClearCashier()" style="padding:6px 10px;cursor:pointer;text-align:center;color:#dc3545;font-size:.8rem;border-top:1px solid #eee;"><i class="fas fa-times me-1"></i>Clear cashier</div>';
  }
  dd.style.display = 'block';
}

window.expToggleCashierDropdown = async function (e) {
  if (e) e.stopPropagation();
  const dd = document.getElementById('exp_receivedCashierDropdown');
  if (!dd) return;
  if (dd.style.display !== 'none') { dd.style.display = 'none'; return; }
  if (!EXP_CASHIERS.length) { try { await expLoadClients(); } catch (err) {} }
  expRenderCashierDropdown(dd);
};

window.expPickCashier = function (a) {
  const hidden = document.getElementById('exp_receivedCashier');
  if (hidden) hidden.value = String(a);
  expSetStored(EXP_LAST_CASHIER_KEY, String(a));
  expUpdateCashierButton(a);
  const dd = document.getElementById('exp_receivedCashierDropdown');
  if (dd) dd.style.display = 'none';
};

window.expClearCashier = function () {
  const hidden = document.getElementById('exp_receivedCashier');
  if (hidden) hidden.value = '';
  expUpdateCashierButton('');
  const dd = document.getElementById('exp_receivedCashierDropdown');
  if (dd) dd.style.display = 'none';
};

function expPaymentTotal() {
  return EXP_PAYMENTS.reduce(function (s, p) { return s + (parseFloat(p.amount) || 0); }, 0);
}

function expUpdatePaymentBase() {
  const el = document.getElementById('exp_paymentBase');
  if (el) el.textContent = expPaymentTotal().toFixed(2);
}

function expCalcDiscountFromPercentage() {
  const pct = parseFloat((document.getElementById('exp_discountPercentage') || {}).value) || 0;
  const base = expPaymentTotal();
  const amt = (base * pct) / 100;
  const el = document.getElementById('exp_discountAmount');
  if (el) el.value = amt.toFixed(2);
}

function expCalcDiscountFromAmount() {
  const amt = parseFloat((document.getElementById('exp_discountAmount') || {}).value) || 0;
  const base = expPaymentTotal();
  const pct = base > 0 ? (amt / base * 100) : 0;
  const el = document.getElementById('exp_discountPercentage');
  if (el) el.value = pct.toFixed(2);
}

function expRenderPayments() {
  const container = document.getElementById('exp_addedPaymentsContainer');
  if (!container) return;
  if (!EXP_PAYMENTS.length) { container.innerHTML = '<p class="text-muted small mb-0">No payments added.</p>'; return; }
  container.innerHTML = EXP_PAYMENTS.map(function (p, idx) {
    const nBadge = (p.n && p.n > 0) ? '<span class="badge bg-warning text-dark ms-1" title="Constraint counter: ' + p.n + '" style="font-size:0.7rem;">#' + p.n + '</span>' : '';
    return '<div class="d-flex align-items-center justify-content-between border rounded px-2 py-1 mb-1" style="font-size:0.85rem;">'
      + '<div><strong>₹' + Number(p.amount).toFixed(2) + '</strong> <small class="text-muted">' + (p.date || '') + '</small>' + nBadge + '</div>'
      + '<div class="text-muted small">'
      + '<span class="badge bg-primary me-1" title="' + expPaymentTypeText(p.type) + '" style="font-size:0.75rem;">' + expPaymentTypeIcon(p.type) + '</span>'
      + expClientName(p.cashier)
      + '</div>'
      + '<button class="btn btn-sm btn-outline-danger py-0 px-1" onclick="window.expRemovePayment(' + idx + ')"><i class="fas fa-times"></i></button>'
      + '</div>';
  }).join('');
  expUpdatePaymentBase();
  // refresh discount amount from current %
  const pctEl = document.getElementById('exp_discountPercentage');
  if (pctEl && pctEl.value && parseFloat(pctEl.value) > 0) expCalcDiscountFromPercentage();
}

window.expRemovePayment = function (idx) {
  EXP_PAYMENTS.splice(idx, 1);
  expRenderPayments();
};

window.expAddPayment = async function () {
  const date = (document.getElementById('exp_receivedDateTime') || {}).value || '';
  const amtRaw = (document.getElementById('exp_receivedAmount') || {}).value || '';
  const amount = parseFloat(amtRaw);
  const cashier = (document.getElementById('exp_receivedCashier') || {}).value || '';
  const type = (document.getElementById('exp_paymentType') || {}).value || '0';
  if (!date) { markInvalid(document.getElementById('exp_receivedDateTime')); expToast('Please select payment date.', 'warning'); return; }
  if (!amount || amount <= 0) { markInvalid(document.getElementById('exp_receivedAmount')); expToast('Please enter a valid amount.', 'warning'); return; }
  // cashier (g) and type (i) are optional; remember cashier if chosen
  if (cashier) expSetStored(EXP_LAST_CASHIER_KEY, cashier);

  // constraint counter: increments if same amount on same date (same person/party)
  let constraintCounter = 0;
  const matching = EXP_PAYMENTS.filter(function (p) {
    return String(p.date).split(' ')[0] === String(date).split(' ')[0] &&
           Number(p.amount) === Number(amount) &&
           String(p.type) === String(type);
  });
  if (matching.length > 0) {
    const maxCounter = Math.max.apply(null, matching.map(function (p) { return p.n || 0; }));
    const nextCounter = maxCounter + 1;
    const msg = 'Same amount (₹' + amount.toFixed(2) + ') on same date (' + date + ') already exists.\n\nDo you want to add another payment with constraint counter ' + nextCounter + '?';
    if (typeof showConfirmModal === 'function') {
      const ok = await showConfirmModal(msg);
      if (!ok) return;
    }
    constraintCounter = nextCounter;
  }

  EXP_PAYMENTS.push({ date: date, amount: amount, cashier: cashier, type: type, n: constraintCounter });
  // clear amount, date + type, keep the remembered cashier selected
  const aEl = document.getElementById('exp_receivedAmount'); if (aEl) aEl.value = '';
  const dEl = document.getElementById('exp_receivedDateTime'); if (dEl) dEl.value = '';
  const dDisp = document.getElementById('exp_receivedDateTime_disp'); if (dDisp) dDisp.textContent = '';
  const tEl = document.getElementById('exp_paymentType'); if (tEl) { tEl.value = '0'; window.expUpdatePaymentTypeIcon('exp_paymentType'); }
  expRenderPayments();
};



async function set_expenditures_innerHTML(...params) {
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
      await expLoadClients();
      const modalId = 'expenditureModal_' + Date.now();
      const modalResult = create_modal_dynamically(modalId);
      if (!modalResult) { resolve(false); return; }
      const { contentElement, modalInstance, modalElement } = modalResult;
      EXP_ACTIVE_MODAL_ID = modalId;
      EXP_PAYMENTS = [];
      EXP_EDIT_ID = null;

      setTimeout(() => {
        const md = modalElement.querySelector('.modal-dialog');
        if (md) { md.classList.remove('modal-dialog-centered'); md.style.marginTop = '40px'; md.style.maxWidth = '100vw'; }
        modalElement.style.zIndex = '1051';
      }, 50);

      contentElement.innerHTML = `
        <div class="modal-header" style="padding:0.4rem 0.75rem;">
          <h5 class="modal-title"><i class="fas fa-file-invoice-dollar me-2"></i>Expences</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body bm-scope" style="padding:0.25rem 0.5rem;">
          <div class="row g-0 mb-2">
            <div class="col-2 d-flex align-items-center">
              <button class="btn btn-outline-secondary" onclick="window.expShowExpenditureList()" style="margin:0px;">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <div class="col-4">
              <div class="input-group border border-dark rounded-2">
                <input type="text" class="form-control" style="padding-left:6.5px;" placeholder="Voucher/Bill No" id="exp_voucherNo">
              </div>
            </div>
            <div class="col-6">
              <input type="text" class="form-control border border-dark" id="exp_dateTime" placeholder="Select Date & Time">
            </div>
          </div>

          <div class="row g-0 mb-3 mt-2">
            <div class="col-12">
              <input id="exp_p_dtls_lient" type="text" class="form-control border border-dark" readonly onclick="(async () => { await loadExe2Fn(14, ['no-loader-element', 1, 'modalContentForEntInd', 'expCommonFnToRunAfter_op_ViewCall', 1], [1]); })()" placeholder="Party Details">
              <input type="hidden" id="exp_partyId">
            </div>
          </div>

          <div class="bm-subhead" style="margin-top:12px;">Mode</div>
          <div class="d-flex gap-3 mb-2">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="expMode" id="expModePayment" value="1" checked>
              <label class="form-check-label" for="expModePayment">Payment</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="expMode" id="expModeReceived" value="0">
              <label class="form-check-label" for="expModeReceived">Received</label>
            </div>
          </div>

          <div class="row g-2 mb-3" style="flex-wrap:nowrap;">
            <div class="col-6" style="min-width:0;">
              <label class="bm-label">Discount %</label>
              <input type="text" inputmode="decimal" maxlength="5" autocomplete="off" class="form-control bm-input bm-amt" id="exp_discountPercentage" oninput="window.allowDiscountPct(this)" style="font-size:1.05rem;border:2px solid #000080;" placeholder="0.00" value="0">
            </div>
            <div class="col-6" style="min-width:0;">
              <label class="bm-label">Discount ₹</label>
              <input type="text" inputmode="decimal" maxlength="8" autocomplete="off" class="form-control bm-input bm-amt" id="exp_discountAmount" oninput="window.allowFloat(this,2,5)" style="font-size:1.05rem;border:2px solid #000080;" placeholder="0.00" value="0">
            </div>
          </div>

          <div class="text-muted small mb-2">Base (sum of payments): ₹<span id="exp_paymentBase">0.00</span></div>

          <div class="bm-subhead" style="margin-top:12px;">Payments</div>
          <div class="bm-innerbox" id="exp_addPaymentCard">
            <div class="row g-1 align-items-center">
              <div class="col-3">
                <div class="bm-date-wrap text-center">
                  <input type="text" class="form-control form-control-sm bm-input text-center" id="exp_receivedDateTime" placeholder="Date">
                  <span class="bm-date-disp" id="exp_receivedDateTime_disp"></span>
                </div>
              </div>
              <div class="col">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white p-1" style="border:2px solid #000080;border-right:2px solid #6c757d;">₹</span>
                  <input type="text" class="form-control form-control-sm bm-input bm-amt" oninput="window.allowFloat(this,2)" placeholder="Amount" id="exp_receivedAmount" inputmode="decimal" autocomplete="off" style="font-size:1.05rem;border:2px solid #000080;border-left:2px solid #6c757d;margin-left:-2px;">
                </div>
              </div>
              <div class="col-auto">
                <input type="hidden" id="exp_receivedCashier" value="">
                <div class="position-relative d-inline-block">
                  <button class="btn btn-outline-secondary btn-sm" type="button" tabindex="-1" id="exp_receivedCashierBtn" title="Select Cashier" onclick="window.expToggleCashierDropdown(event)" style="border:1px solid #212529;border-radius:.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;"><i class="fas fa-user"></i></button>
                  <div id="exp_receivedCashierDropdown" style="display:none;position:absolute;left:0;right:auto;top:100%;bottom:auto;z-index:20;width:max-content;min-width:220px;max-width:calc(100vw - 20px);max-height:200px;overflow-y:auto;background:#fff;border:1px solid #212529;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.15);"></div>
                </div>
              </div>
              <div class="col-auto text-center">
                ${expPaymentTypePickerHTML('exp_paymentType', '0')}
              </div>
              <div class="col-auto text-end">
                <button class="btn btn-primary btn-sm" id="exp_addPaymentBtn" onclick="window.expAddPayment()">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
          <div id="exp_addedPaymentsContainer" class="mt-2" style="max-height:160px;overflow-y:auto;"></div>

          <div class="bm-subhead" style="margin-top:12px;">Notes &amp; Actions</div>
          <div class="row mt-2">
            <div class="col-12 border">
              <div class="card border border-dark">
                <div class="card-body" style="padding:0.25rem;">
                  <textarea class="form-control" id="exp_notes" rows="3" placeholder="Notes / description for this expenditure."></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="padding:0.4rem 0.75rem; flex-wrap:nowrap; gap:4px; overflow-x:auto; -webkit-overflow-scrolling:touch;">
          <button id="exp_saveBtn" class="btn btn-success btn-sm" style="flex:1 1 0; min-width:0; white-space:nowrap; font-size:0.8rem;" onclick="window.expSaveExpenditure()">
            <i class="fas fa-save me-1"></i>Save
          </button>
          <button id="exp_updateBtn" class="btn btn-warning btn-sm" style="flex:1 1 0; min-width:0; white-space:nowrap; font-size:0.8rem;" onclick="window.expUpdateExpenditure()" disabled>
            <i class="fas fa-edit me-1"></i>Updt
          </button>
          <button id="exp_deleteBtn" class="btn btn-danger btn-sm" style="flex:1 1 0; min-width:0; white-space:nowrap; font-size:0.8rem;" onclick="window.expDeleteExpenditure()" disabled>
            <i class="fas fa-trash me-1"></i>Delete
          </button>
          <button type="button" class="btn btn-secondary btn-sm" style="flex:0 0 auto; white-space:nowrap; font-size:0.8rem;" data-bs-dismiss="modal">Close</button>
        </div>
      `;

      // discount linking
      const pctEl = contentElement.querySelector('#exp_discountPercentage');
      const amtEl = contentElement.querySelector('#exp_discountAmount');
      if (pctEl) pctEl.addEventListener('input', function () { expCalcDiscountFromPercentage(); });
      if (amtEl) amtEl.addEventListener('input', function () { expCalcDiscountFromAmount(); });

      // mode radio
      EXP_PAYMENT_MODE = 1;
      document.querySelectorAll('input[name="expMode"]').forEach(function (r) {
        r.addEventListener('change', function () { EXP_PAYMENT_MODE = parseInt(r.value, 10) || 0; });
      });
      const modePayment = document.getElementById('expModePayment');
      if (modePayment) modePayment.checked = true;

      // date pickers
      try {
        const apiDate = await window.initDateTimePicker('exp_dateTime', { autoNow: false });
        const elDate = document.getElementById('exp_dateTime');
        if (apiDate && apiDate.instance && elDate) {
          elDate.addEventListener('click', function () { try { apiDate.instance.show(); } catch (e) {} });
        }
      } catch (e) { console.error(e); }
      try {
        const apiPay = await window.initDateTimePicker('exp_receivedDateTime', { autoNow: false });
        const elPay = document.getElementById('exp_receivedDateTime');
        if (apiPay && apiPay.instance && elPay) {
          elPay.addEventListener('click', function () { try { apiPay.instance.show(); } catch (e) {} });
        }
      } catch (e) { console.error(e); }

      // restore last used cashier + close dropdown on outside click
      try { window.expRestoreCashier(); } catch (e) { console.error(e); }
      if (!window.__expCashierOutsideBound && typeof document.addEventListener === 'function') {
        window.__expCashierOutsideBound = true;
        document.addEventListener('click', function (ev) {
          const dd = document.getElementById('exp_receivedCashierDropdown');
          const btn = document.getElementById('exp_receivedCashierBtn');
          if (!dd || dd.style.display === 'none') return;
          if ((btn && btn.contains && btn.contains(ev.target)) || (dd.contains && dd.contains(ev.target))) return;
          dd.style.display = 'none';
        });
      }

      expRenderPayments();

      // Let the Tempus Dominus widget (mounted on <body>) keep focus while open.
      try { modalInstance._enforceFocus = function () {}; } catch (e) {}
      try {
        modalElement.addEventListener('shown.bs.modal', function () {
          if (modalInstance && typeof modalInstance._enforceFocus === 'function') {
            modalInstance._enforceFocus = function () {};
          }
        }, { once: true });
      } catch (e) {}

      modalInstance.show();
      resolve(true);
    } catch (e) {
      console.error('expenditure modal failed:', e);
      resolve(false);
    }
  });
}

window.expCommonFnToRunAfter_op_ViewCall = function (obj, swtch) {
  if (swtch === 1) {
    const name = (obj.h || '').trim();
    const mobile = obj.e || '';
    const el = document.getElementById('exp_p_dtls_lient');
    if (el) el.value = name ? (mobile ? (name + ' ' + mobile) : name) : mobile;
    const hid = document.getElementById('exp_partyId');
    if (hid) hid.value = obj.a;
  }
};

window.expSaveExpenditure = async function () {
  ['exp_voucherNo','exp_dateTime','exp_p_dtls_lient','exp_receivedAmount','exp_receivedDateTime'].forEach(function (id) { clearInvalid(document.getElementById(id)); });
  const voucherNo = (document.getElementById('exp_voucherNo') || {}).value || '';
  const date = (document.getElementById('exp_dateTime') || {}).value || '';
  const partyId = (document.getElementById('exp_partyId') || {}).value || '';
  const notes = (document.getElementById('exp_notes') || {}).value || '';
  const discPct = (document.getElementById('exp_discountPercentage') || {}).value || '0';
  const discAmt = (document.getElementById('exp_discountAmount') || {}).value || '0';

  if (!voucherNo.trim()) { markInvalid(document.getElementById('exp_voucherNo')); expToast('Please enter Voucher/Bill Number.', 'warning'); return; }
  if (!date.trim()) { markInvalid(document.getElementById('exp_dateTime')); expToast('Please select Date & Time.', 'warning'); return; }
  if (!partyId) { markInvalid(document.getElementById('exp_p_dtls_lient')); expToast('Please select Party.', 'warning'); return; }

  if (!EXP_PAYMENTS.length) {
    markInvalid(document.getElementById('exp_receivedAmount'));
    expToast('Please add at least one payment.', 'warning');
    return;
  }
  for (let i = 0; i < EXP_PAYMENTS.length; i++) {
    const p = EXP_PAYMENTS[i];
    if (!p || !p.date || !p.amount) {
      markInvalid(document.getElementById('exp_receivedAmount'));
      expToast('A payment is missing required fields (date/amount).', 'warning');
      return;
    }
  }

  if (!EXP_FN_SAVE) {
    expToast('Set EXP_FN_SAVE in expenditures.js before saving.', 'error');
    return;
  }

  try {
    await clearPayload0();
    const payload0 = window.payload0 || {};
    payload0.x = {
      d: partyId || 0,
      f: voucherNo.trim(),
      g: EXP_PAYMENT_MODE === 0 ? 0 : (discPct || 0),
      h: EXP_PAYMENT_MODE === 0 ? 0 : (discAmt || 0),
      i: date,
      x1: notes.trim() ? { n: notes.trim() } : null
    };
    payload0.r = EXP_PAYMENTS.map(function (p) {
      return {
        f: EXP_PAYMENT_MODE,
        h: partyId || 0,
        i: p.type || '0',
        j: Number(p.amount).toFixed(2),
        k: String(p.date || ''),
        g: p.cashier || 0,
        n: p.n || 0
      };
    });
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ tb: 'x' }, { tb: 'r' }, { tb: 'c' }]);
    payload0.vw = 1;
    payload0.ul = "2/00.php";
    payload0.gt = 2;
    payload0.fn = EXP_FN_SAVE;
    const response = await fnj4(null, payload0, 1, 1, null, 20000, 2, 1);
    if (response && response.su == 1) {
      if (typeof window.handl_op_rspons === 'function') window.handl_op_rspons(response, 0);
      expToast('Expenditure saved successfully!', 'success');
      const modalEl = document.getElementById(EXP_ACTIVE_MODAL_ID);
      const inst = modalEl ? bootstrap.Modal.getInstance(modalEl) : null;
      if (inst) inst.hide();
    } else {
      let msg = (response && response.ms) || '';
      if (!msg && response && response.fn3 && response.fn3.r && Array.isArray(response.fn3.r) && response.fn3.r.length > 0) {
        msg = response.fn3.r[0].ms || '';
      }
      if (typeof window.showelsemodal === 'function') window.showelsemodal(msg || 'Failed to save expenditure.');
      else expToast(msg || 'Failed to save expenditure.', 'error');
    }
  } catch (e) {
    console.error('expenditure save error:', e);
    expToast('Error saving expenditure: ' + e.message, 'error');
  }
};

window.expUpdateExpenditure = async function () {
  if (!EXP_EDIT_ID) { expToast('No expenditure selected for update.', 'warning'); return; }
  if (!EXP_FN_UPDATE && !EXP_FN_SAVE) { expToast('Set EXP_FN_UPDATE in expenditures.js.', 'error'); return; }
  // placeholder: reuse save path with x.a set
  expToast('Update flow not yet wired (set EXP_FN_UPDATE).', 'info');
};

window.expDeleteExpenditure = async function () {
  if (!EXP_EDIT_ID) { expToast('No expenditure selected for delete.', 'warning'); return; }
  if (!EXP_FN_DELETE) { expToast('Set EXP_FN_DELETE in expenditures.js.', 'error'); return; }
  expToast('Delete flow not yet wired (set EXP_FN_DELETE).', 'info');
};

window.expShowExpenditureList = async function () {
  const modalId = 'expBilledList_' + Date.now();
  if (typeof create_modal_dynamically !== 'function') {
    expToast('Modal system not available.', 'error');
    return;
  }
  const modalResult = create_modal_dynamically(modalId);
  if (!modalResult) return;
  const { contentElement, modalInstance, modalElement } = modalResult;

  setTimeout(() => {
    const md = modalElement.querySelector('.modal-dialog');
    if (md) { md.classList.remove('modal-dialog-centered'); md.style.marginTop = '80px'; md.style.maxWidth = '760px'; }
    modalElement.style.zIndex = '1051';
  }, 50);

  let rows = [], clients = [];
  try { rows = await dbDexieManager.getAllRecords(dbnm, 'x') || []; } catch (e) { console.error('exp list x:', e); }
  try { clients = await dbDexieManager.getAllRecords(dbnm, 'c') || []; } catch (e) { console.error('exp list c:', e); }
  EXP_CLIENTS = clients.length ? clients : EXP_CLIENTS;

  const sorted = [...rows].sort(function (a, b) { return new Date(b.f || 0) - new Date(a.f || 0); });

  contentElement.innerHTML = `
    <div class="modal-header" style="padding:0.4rem 0.75rem;">
      <h5 class="modal-title"><i class="fas fa-list me-2"></i>Expenditures</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body" style="padding:0.4rem 0.75rem;">
      <div class="input-group mb-2">
        <input type="text" class="form-control border border-dark" id="expBilledSearch" placeholder="Search by voucher, party, notes...">
        <span class="input-group-text p-0 border border-dark"><i class="fa-solid fa-magnifying-glass px-2"></i></span>
        <span class="input-group-text p-0 border border-dark">
          <button id="expBilledDateToggle" class="btn p-0 px-2 border-0" type="button"><i class="fa-solid fa-angle-right text-primary"></i></button>
        </span>
      </div>
      <div id="expBilledDateFilter" class="row g-2 mb-2" style="display:none;">
        <div class="col-6">
          <div class="d-flex align-items-center gap-2">
            <label class="mb-0 text-nowrap small">From</label>
            <input type="date" class="form-control form-control-sm border border-dark" id="expBilledFrom">
          </div>
        </div>
        <div class="col-6">
          <div class="d-flex align-items-center gap-2">
            <label class="mb-0 text-nowrap small">To</label>
            <input type="date" class="form-control form-control-sm border border-dark" id="expBilledTo">
          </div>
        </div>
      </div>
      <div id="expBilledList" style="max-height: calc(100vh - 260px); overflow-y: auto;"></div>
    </div>
    <div class="modal-footer" style="padding:0.4rem 0.75rem;">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
  `;

  const listEl = contentElement.querySelector('#expBilledList');
  const searchEl = contentElement.querySelector('#expBilledSearch');
  const fromEl = contentElement.querySelector('#expBilledFrom');
  const toEl = contentElement.querySelector('#expBilledTo');
  const toggleBtn = contentElement.querySelector('#expBilledDateToggle');
  const filterSec = contentElement.querySelector('#expBilledDateFilter');

  if (toggleBtn && filterSec) {
    toggleBtn.addEventListener('click', function () {
      const open = filterSec.style.display === 'none';
      filterSec.style.display = open ? 'flex' : 'none';
      const ic = toggleBtn.querySelector('i');
      if (ic) ic.className = open ? 'fa-solid fa-angle-down text-primary' : 'fa-solid fa-angle-right text-primary';
    });
  }

  function clientName(id) {
    const c = clients.find(function (x) { return String(x.a) === String(id); });
    if (!c) return (id == null || id === '' ? '-' : String(id));
    return c.e || c.h || String(id);
  }

  function renderList() {
    const q = (searchEl ? searchEl.value : '').toLowerCase().trim();
    const from = fromEl ? fromEl.value : '';
    const to = toEl ? toEl.value : '';
    const filtered = sorted.filter(function (r) {
      const vn = String(r.f || '').toLowerCase();
      const cn = clientName(r.d).toLowerCase();
      const nt = String((r.x1 && r.x1.n) || '').toLowerCase();
      const d = String(r.i || '').slice(0, 10);
      if (q && vn.indexOf(q) < 0 && cn.indexOf(q) < 0 && nt.indexOf(q) < 0) return false;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
    if (!filtered.length) {
      listEl.innerHTML = '<p class="text-muted text-center py-3 mb-0">No expenditures found.</p>';
      return;
    }
    listEl.innerHTML = filtered.map(function (r) {
      const d = String(r.i || '');
      const cn = clientName(r.d);
      const amt = (r.h != null ? r.h : '');
      const modeBadge = (String(r.f_mode || '') === '0') ? 'Received' : '';
      return '<div class="d-flex align-items-center justify-content-between border-bottom px-2 py-2 exp-row" style="cursor:pointer;" data-id="' + r.a + '">'
        + '<div style="min-width:0;">'
        + '<div class="fw-bold text-truncate">' + (r.f || '-') + '</div>'
        + '<small class="text-muted">' + cn + ' · ' + d + '</small>'
        + '</div>'
        + '<div class="text-end">'
        + '<div class="fw-bold text-danger">₹' + amt + '</div>'
        + '<button class="btn btn-sm btn-outline-secondary py-0 px-1 mt-1" data-view="' + r.a + '"><i class="fas fa-eye"></i></button>'
        + '</div>'
        + '</div>';
    }).join('');

    listEl.querySelectorAll('[data-view]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const id = btn.getAttribute('data-view');
        const row = rows.find(function (x) { return String(x.a) === String(id); });
        if (row) expShowExpenditureDetail(row, clients);
      });
    });
  }

  if (searchEl) searchEl.addEventListener('input', renderList);
  if (fromEl) fromEl.addEventListener('change', renderList);
  if (toEl) toEl.addEventListener('change', renderList);
  renderList();
  modalInstance.show();
};

function expShowExpenditureDetail(row, clients) {
  const modalId = 'expDetail_' + Date.now();
  if (typeof create_modal_dynamically !== 'function') return;
  const modalResult = create_modal_dynamically(modalId);
  if (!modalResult) return;
  const { contentElement, modalInstance, modalElement } = modalResult;
  setTimeout(() => {
    const md = modalElement.querySelector('.modal-dialog');
    if (md) { md.classList.remove('modal-dialog-centered'); md.style.marginTop = '80px'; md.style.maxWidth = '620px'; }
    modalElement.style.zIndex = '1051';
  }, 50);

  const client = (clients || []).find(function (c) { return String(c.a) === String(row.d); });
  const cname = client ? (client.e || client.h) : (row.e || '-');
  const payments = (typeof dbDexieManager !== 'undefined' ? [] : []);
  // load r rows linked to this expenditure
  (async function () {
    let allR = [];
    try { allR = await dbDexieManager.getAllRecords(dbnm, 'r') || []; } catch (e) { allR = []; }
    const linked = allR.filter(function (p) { return String(p.td) === String(row.a); });
    const payHtml = linked.length
      ? linked.map(function (p) {
          const cname2 = (clients || []).find(function (c) { return String(c.a) === String(p.g); });
          const payCashier = cname2 ? (cname2.e || cname2.h) : (p.g || '-');
          const modeTxt = (String(p.f) === '0') ? 'Received' : 'Payment';
          const nBadge = (p.n && Number(p.n) > 0) ? ' <span class="badge bg-warning text-dark" style="font-size:0.65rem;">#' + p.n + '</span>' : '';
          return '<tr><td>' + (p.k || '') + '</td><td class="text-end">' + Number(p.j || 0).toFixed(2) + nBadge + '</td><td>' + payCashier + '</td><td><span class="badge bg-primary" title="' + expPaymentTypeText(p.i) + '">' + expPaymentTypeIcon(p.i) + '</span></td><td>' + modeTxt + '</td></tr>';
        }).join('')
      : '<tr><td colspan="4" class="text-muted text-center">No payments</td></tr>';

    contentElement.innerHTML = `
      <div class="modal-header" style="padding:0.4rem 0.75rem;">
        <h5 class="modal-title"><i class="fas fa-receipt me-2"></i>Expenditure Detail</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" style="padding:0.4rem 0.75rem;">
        <div class="row mb-2">
          <div class="col-6"><strong>Voucher:</strong> ${row.f || '-'}</div>
          <div class="col-6"><strong>Date:</strong> ${row.i || '-'}</div>
        </div>
        <div class="row mb-2">
          <div class="col-12"><strong>Party:</strong> ${cname}</div>
        </div>
        <div class="row mb-2">
          <div class="col-6"><strong>Discount %:</strong> ${row.g || 0}</div>
          <div class="col-6"><strong>Discount ₹:</strong> ${row.h || 0}</div>
        </div>
        ${row.x1 && row.x1.n ? '<div class="mb-2"><strong>Notes:</strong> <span class="text-muted">' + row.x1.n + '</span></div>' : ''}
        <div class="bm-subhead" style="margin-top:8px;">Payments</div>
        <table class="table table-sm table-bordered mb-0">
          <thead><tr><th>Date</th><th class="text-end">Amount</th><th>Cashier</th><th>Type</th><th>Mode</th></tr></thead>
          <tbody>${payHtml}</tbody>
        </table>
      </div>
      <div class="modal-footer" style="padding:0.4rem 0.75rem;">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    `;
  })();
  modalInstance.show();
}

window.set_expenditures_innerHTML = set_expenditures_innerHTML;
window.expShowExpenditureList = expShowExpenditureList;
