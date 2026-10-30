/* =====================================================================
   bePr2.js - Invoice print / preview module (rebuilt)
   ---------------------------------------------------------------------
   Public API (unchanged):
     window.sho_bepr_mdl(billId)        // loaded via csh item 22

   Dependencies already available globally in this app:
     loadCshScriptsSequentially, create_modal_dynamically,
     createDynamicLoader, dbDexieManager, dbnm, bootstrap

   Optional CDN (only for image export): html2canvas  (csh item 7)

   Storage keys kept backward compatible with the old module:
     localStorage.paperSettings
     localStorage.styleSettings

   Theme hooks:
     window.BILL_THEME_PRESETS
     window.BILL_THEME_MAP      // 0 / undefined => current default
     window.getBillThemeSettings(n)
     Add 1,2,3... to BILL_THEME_MAP later.
   ===================================================================== */
(function () {
 'use strict';

 /* ============================ 1. CONFIG ============================ */

 const MM_TO_PX = 96 / 25.4; // CSS pixels per millimetre at 96 dpi
 const PAPER_MM = { A4: { w: 210, h: 297 }, A5: { w: 148, h: 210 } };
 const MAX_PREVIEW_W = 640; // desktop ceiling for the on-screen sheet

 const PAPER_STORE = 'paperSettings';
 const STYLE_STORE = 'styleSettings';

 const DEFAULT_PAPER = {
  paperSize: 'A4',
  orientation: 'portrait',
  fitToPage: true,
  dimensionType: 'width',
  printDimension: '100',
  position: 'top-left',
  customPaperWidth: 210,
  customPaperHeight: 297,
  printEyeMeasurements: true,
  showRemarks: true
 };

 // Defaults reproduce the original invoice look exactly when the user has
 // never opened Print Settings. Saved values still override them.
 const DEFAULT_STYLE = {
  logoHeaderGap: '10',
  fullHeadLogoHeight: '150',
  clientDetailsGap: '16',
  eyeTablesGap: '15',
  billItemsGap: '0',
  tdSpacing: '0',
  nameMobileFontSize: '16',
  nameBgColor: '#f0f0f0',
  mobileBgColor: '#f0f0f0',
  invoiceNoBgColor: '#f0f0f0',
  totalAmtBgColor: '#f0f0f0',
  receivedAmtBgColor: '#f0f0f0',
  leftEyeTableBgColor: '#ffffff',
  rightEyeTableBgColor: '#ffffff'
 };

 const THEME_PRESETS = {
  default: {
   logoHeaderGap: '10', fullHeadLogoHeight: '150', clientDetailsGap: '16', eyeTablesGap: '15', billItemsGap: '0',
   tdSpacing: '0', nameMobileFontSize: '16', nameBgColor: '#f0f0f0', mobileBgColor: '#f0f0f0',
   invoiceNoBgColor: '#f0f0f0', totalAmtBgColor: '#f0f0f0', receivedAmtBgColor: '#f0f0f0',
   leftEyeTableBgColor: '#ffffff', rightEyeTableBgColor: '#ffffff'
  },
  blue: {
   logoHeaderGap: '30', fullHeadLogoHeight: '150', clientDetailsGap: '5', eyeTablesGap: '10', billItemsGap: '5',
   tdSpacing: '2', nameMobileFontSize: '16', nameBgColor: '#e3f2fd', mobileBgColor: '#e3f2fd',
   invoiceNoBgColor: '#bbdefb', totalAmtBgColor: '#90caf9', receivedAmtBgColor: '#64b5f6',
   leftEyeTableBgColor: '#f3f9ff', rightEyeTableBgColor: '#f3f9ff'
  },
  yellow: {
   logoHeaderGap: '40', fullHeadLogoHeight: '150', clientDetailsGap: '8', eyeTablesGap: '15', billItemsGap: '8',
   tdSpacing: '3', nameMobileFontSize: '18', nameBgColor: '#fff8e1', mobileBgColor: '#fff8e1',
   invoiceNoBgColor: '#ffecb3', totalAmtBgColor: '#ffe082', receivedAmtBgColor: '#ffd54f',
   leftEyeTableBgColor: '#fffde7', rightEyeTableBgColor: '#fffde7'
  },
  redGrey: {
   logoHeaderGap: '25', fullHeadLogoHeight: '150', clientDetailsGap: '6', eyeTablesGap: '12', billItemsGap: '6',
   tdSpacing: '1', nameMobileFontSize: '16', nameBgColor: '#ffebee', mobileBgColor: '#ffebee',
   invoiceNoBgColor: '#f5f5f5', totalAmtBgColor: '#ffcdd2', receivedAmtBgColor: '#ef9a9a',
   leftEyeTableBgColor: '#fafafa', rightEyeTableBgColor: '#f5f5f5'
  }
 };

 // 0 / undefined = current default look. Add your own numbers later, e.g. 1:'blue'.
 const THEME_MAP = { 0: 'default' };

 const STYLE_RANGES = [
  { key: 'logoHeaderGap', label: 'Logo / Header gap' },
  { key: 'fullHeadLogoHeight', label: 'Full-head logo height' },
  { key: 'clientDetailsGap', label: 'Client details gap' },
  { key: 'eyeTablesGap', label: 'Eye tables gap' },
  { key: 'billItemsGap', label: 'Bill items gap' },
  { key: 'tdSpacing', label: 'Table cell spacing' },
  { key: 'nameMobileFontSize', label: 'Name / Mobile font size' }
 ];

 const STYLE_COLORS = [
  { key: 'nameBgColor', label: 'Name background' },
  { key: 'mobileBgColor', label: 'Mobile background' },
  { key: 'invoiceNoBgColor', label: 'Invoice no. background' },
  { key: 'totalAmtBgColor', label: 'Total amount background' },
  { key: 'receivedAmtBgColor', label: 'Received amount background' },
  { key: 'leftEyeTableBgColor', label: 'Left eye table background' },
  { key: 'rightEyeTableBgColor', label: 'Right eye table background' }
 ];

 const POSITIONS = [
  ['top-left', 'Top Left'], ['top-center', 'Top Center'], ['top-right', 'Top Right'],
  ['center-left', 'Center Left'], ['center', 'Center'], ['center-right', 'Center Right'],
  ['bottom-left', 'Bottom Left'], ['bottom-center', 'Bottom Center'], ['bottom-right', 'Bottom Right']
 ];

 /* ============================ 2. UTILS ============================ */

 function num(v, d) {
  const n = parseFloat(v);
  return isNaN(n) ? d : n;
 }

 function px(v) {
  return num(v, 0) + 'px';
 }

 function mmToPx(mm) {
  return mm * MM_TO_PX;
 }

 function ensureUTF(text) {
  if (!text) return '';
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  let decoded = textArea.value;
  decoded = decoded
   .replace(/&amp;/g, '&')
   .replace(/&lt;/g, '<')
   .replace(/&gt;/g, '>')
   .replace(/&quot;/g, '"')
   .replace(/&#039;/g, "'")
   .replace(/&#x2F;/g, '/');
  return decoded;
 }

 function convertDateFormatToIndia(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
 }

 function getTotalAmtRcvd(sCurrCashInfo) {
  let total = 0;
  for (const k in sCurrCashInfo) {
   total += parseFloat(sCurrCashInfo[k].j) || 0;
  }
  return total;
 }

 // Rounds a money value to 2 decimals.
 function billRound2(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
 }

 // Detects how tax was stored on this bill's rows (`i`): any row carrying `k`
 // means the split layout (j/tax1 amount, k/tax2 amount, t/sub-name); otherwise
 // the legacy layout keeps the sub-name on `j` and the tax amount on `t`.
 // Sniffing the rows (instead of only reading billItemTaxSplit) keeps old bills
 // correct when the flag is changed after they were saved.
 function billTaxLayout(items) {
  items = items || [];
  const hasK = items.some(function (item) {
   return item && item.k !== undefined && item.k !== null && String(item.k).trim() !== '';
  });
  if (hasK) return 'split';
  const splitish = items.some(function (item) {
   return item && Number.isFinite(parseFloat(item.j)) && !Number.isFinite(parseFloat(item.t));
  });
  return splitish ? 'split' : 'legacy';
 }

 function billItemTaxAmount(billItem, layout) {
  if (!billItem) return 0;
  if (layout === 'split') {
   return (parseFloat(billItem.j) || 0) + (parseFloat(billItem.k) || 0);
  }
  return parseFloat(billItem.t) || 0;
 }

 function price_in_words(price) {
  const sglDigit = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'],
   dblDigit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'],
   tensPlace = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'],
   handle_tens = function (dgt, prevDgt) {
    return 0 == dgt ? '' : ' ' + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt]);
   },
   handle_utlc = function (dgt, nxtDgt, denom) {
    return (0 != dgt && 1 != nxtDgt ? ' ' + sglDigit[dgt] : '') + (0 != nxtDgt || dgt > 0 ? ' ' + denom : '');
   };

  let str = '', digitIdx = 0, digit = 0, nxtDigit = 0;
  const words = [];
  price += '';
  if (isNaN(parseInt(price))) str = '';
  else if (parseInt(price) > 0 && price.length <= 10) {
   for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) {
    digit = price[digitIdx] - 0;
    nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0;
    switch (price.length - digitIdx - 1) {
     case 0: words.push(handle_utlc(digit, nxtDigit, '')); break;
     case 1: words.push(handle_tens(digit, price[digitIdx + 1])); break;
     case 2: words.push(0 != digit ? ' ' + sglDigit[digit] + ' Hundred' + (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2] ? ' and' : '') : ''); break;
     case 3: words.push(handle_utlc(digit, nxtDigit, 'Thousand')); break;
     case 4: words.push(handle_tens(digit, price[digitIdx + 1])); break;
     case 5: words.push(handle_utlc(digit, nxtDigit, 'Lakh')); break;
     case 6: words.push(handle_tens(digit, price[digitIdx + 1])); break;
     case 7: words.push(handle_utlc(digit, nxtDigit, 'Crore')); break;
     case 8: words.push(handle_tens(digit, price[digitIdx + 1])); break;
     case 9: words.push(0 != digit ? ' ' + sglDigit[digit] + ' Hundred' + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? ' and' : ' Crore') : ''); break;
    }
   }
   str = words.reverse().join('');
  } else str = '';
  return str;
 }

 function formatNumbersForWhatsApp(numbers) {
  const formattedNumbers = numbers.map(num => {
   const numValue = parseFloat(num);
   if (isNaN(numValue)) return num.toString();
   return numValue.toFixed(2);
  });
  const maxLength = Math.max(...formattedNumbers.map(str => str.length));
  return formattedNumbers.map(strNum => {
   const spacesNeeded = maxLength - strNum.length;
   const padding = '_'.repeat(Math.max(0, spacesNeeded));
   return padding + strNum;
  });
 }

 function formatEyeValue(value) {
  if (value === null || value === undefined || value === '') return '';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return value;
  if (numValue > 0) return '+' + value;
  return value.toString();
 }

 function multiline(value) {
  return ensureUTF(value)
   .replace(/\n/g, '<br>')
   .replace(/\r/g, '')
   .replace(/\\n/g, '<br>');
 }

 function createToast(message, type = 'info') {
  const toastId = 'bepr2-toast-' + Date.now();
  const toastHtml = '<div id="' + toastId + '" class="toast align-items-center text-bg-' + type + ' border-0" role="alert" aria-live="assertive" aria-atomic="true">' +
   '<div class="d-flex"><div class="toast-body">' + message + '</div>' +
   '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
   '</div></div>';
  const toastContainer = (() => {
   let container = document.getElementById('bepr2-toast-container');
   if (!container) {
    container = document.createElement('div');
    container.id = 'bepr2-toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '2147483000';
    document.body.appendChild(container);
   }
   return container;
  })();
  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  const toastEl = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  return {
   remove: () => {
    toast.hide();
    setTimeout(() => toastEl.remove(), 300);
   }
  };
 }

 /* ============================ 3. STORAGE ============================ */

 function readStore(key, defaults) {
  try {
   const raw = JSON.parse(localStorage.getItem(key) || '{}');
   return Object.assign({}, defaults, raw || {});
  } catch (e) {
   return Object.assign({}, defaults);
  }
 }

 function paperSettings() {
  return readStore(PAPER_STORE, DEFAULT_PAPER);
 }

 function styleSettings() {
  return readStore(STYLE_STORE, DEFAULT_STYLE);
 }

 function hasStore(key) {
  try {
   return localStorage.getItem(key) !== null;
  } catch (e) {
   return false;
  }
 }

 function savePaper(patch) {
  const next = Object.assign({}, paperSettings(), patch || {});
  // Marker: this save is post-migration, so the user's choice is final.
  next.beprFitDefault = 1;
  try {
   localStorage.setItem(PAPER_STORE, JSON.stringify(next));
  } catch (e) {
   console.warn('bePr2: could not save paper settings', e);
  }
  return next;
 }

 // One-time migration: earlier builds shipped fitToPage:false as the default,
 // so an old test save would keep the small column forever. Force fit on once,
 // then respect whatever the user picks in the Paper modal.
 function migratePaper() {
  if (!hasStore(PAPER_STORE)) return;
  try {
   const raw = JSON.parse(localStorage.getItem(PAPER_STORE) || '{}');
   if (!raw || raw.beprFitDefault === 1) return;
   raw.fitToPage = true;
   raw.beprFitDefault = 1;
   localStorage.setItem(PAPER_STORE, JSON.stringify(raw));
  } catch (e) {
   // malformed storage: defaults still apply
  }
 }

 function saveStyle(patch) {
  const next = Object.assign({}, styleSettings(), patch || {});
  try {
   localStorage.setItem(STYLE_STORE, JSON.stringify(next));
  } catch (e) {
   console.warn('bePr2: could not save style settings', e);
  }
  return next;
 }

 function themeFor(n) {
  const key = THEME_MAP[n] || 'default';
  return Object.assign({}, DEFAULT_STYLE, THEME_PRESETS[key] || THEME_PRESETS.default);
 }

 /* ============================ 4. DATA ============================ */

 async function loadBillData(billId) {
  if (typeof dbDexieManager === 'undefined' || !dbDexieManager) throw new Error('dbDexieManager unavailable');
  if (typeof dbnm === 'undefined') throw new Error('dbnm unavailable');

  const bills = await dbDexieManager.getAllRecords(dbnm, 'b') || [];
  if (!bills.length) throw new Error('No bills data available');

  const bill = bills.find(b => b.a == billId);
  if (!bill) throw new Error('Bill info not found');
  if (!bill.g) throw new Error('Bill information incomplete');

  const clients = await dbDexieManager.getAllRecords(dbnm, 'c') || [];
  const info = clients.find(c => c.a == bill.e);

  const name_client = info ? ensureUTF(info.h + ' ' + info.i) : null;
  const mob_client = info ? info.e : null;
  const addr_client = info ? ensureUTF(info.m) : null;

  const items = await dbDexieManager.getAllRecords(dbnm, 's') || [];
  const eyeRows = await dbDexieManager.getAllRecords(dbnm, 'be') || [];
  const eye_selected_msrmnt = eyeRows.find(x => x.ea == billId);

  const billItemRows = await dbDexieManager.getAllRecords(dbnm, 'i') || [];
  const sCurrItems = billItemRows.filter(x => x.e == billId);

  const cashRows = await dbDexieManager.getAllRecords(dbnm, 'r') || [];
  const sCurrCashInfo = cashRows.filter(x => x.td == billId && x.tb == 7);

  let name_referrer = '';
  if (eye_selected_msrmnt) {
   const objReferrer = clients.find(c => c.a == eye_selected_msrmnt.ef);
   name_referrer = objReferrer ? ensureUTF(objReferrer.h + ' ' + objReferrer.i) : '';
  }

  let quanTotal = 0;
  let subtotal = 0;
  let taxTotal = 0;
  const taxLayout = billTaxLayout(sCurrItems);
  sCurrItems.forEach(item => {
   quanTotal += parseInt(item.h) || 0;
   subtotal += parseFloat(item.g) || 0;
   taxTotal += billItemTaxAmount(item, taxLayout);
  });
  subtotal = billRound2(subtotal);
  taxTotal = billRound2(taxTotal);
  const t_itms_otal = billRound2(subtotal + taxTotal);

  const discountAmt = billRound2(parseFloat(bill.k) || 0);
  const advanceAmt = billRound2(getTotalAmtRcvd(sCurrCashInfo));
  const dueValue = billRound2(t_itms_otal - discountAmt - advanceAmt);
  const dueAmt = (dueValue === 0 ? 0 : dueValue).toFixed(2);

  // Remarks / delivery date (same tolerant parsing as the old module)
  let t1682 = null;
  let deliveryDate = '';
  if (bill.i) {
   try {
    let jsonString = bill.i;
    jsonString = jsonString.replace(/^"+|"+$/g, '');
    jsonString = jsonString.replace(/\\"/g, '"');
    jsonString = jsonString.replace(/\\\\/g, '\\');
    try {
     t1682 = JSON.parse(jsonString);
     if (t1682.dldt) deliveryDate = convertDateFormatToIndia(new Date(t1682.dldt.slice(0, 10)));
    } catch (inner) {
     t1682 = { rmrk: jsonString };
    }
   } catch (outer) {
    const dateMatch = bill.i.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
     deliveryDate = convertDateFormatToIndia(new Date(dateMatch[0]));
     const remainingText = bill.i.replace(/\d{4}-\d{2}-\d{2}.*?(\s|$)/, '').trim();
     if (remainingText) t1682 = { rmrk: ensureUTF(remainingText) };
    } else {
     t1682 = { rmrk: ensureUTF(bill.i) };
    }
   }
  }

  let remark = '';
  if (t1682 && t1682.rmrk) {
   remark = ensureUTF(t1682.rmrk);
   remark = remark.replace(/^"+|"+$/g, '').replace(/\\"/g, '"');
   const found = remark.match(/"rmrk"\s*:\s*"([^"]*)"/);
   if (found && found[1]) remark = found[1];
  }

  const data = {
   clientConfig: (typeof clientConfig !== 'undefined' && clientConfig) ? clientConfig : {},
   curr_bill_info: bill,
   name_client,
   mob_client,
   addr_client,
   name_referrer,
   items,
   sCurrItems,
   sCurrCashInfo,
   quanTotal,
   subtotal,
   taxTotal,
   t_itms_otal,
   advanceAmt,
   discountAmt,
   dueAmt,
   t1682,
   remark,
   deliveryDate,
   eye_selected_msrmnt,
   billDate: convertDateFormatToIndia(new Date(String(bill.f).slice(0, 10))),
   filename: (name_client?.trim() || 'invoice') + '_' + bill.g + '_' + convertDateFormatToIndia(new Date(String(bill.f).slice(0, 10)))
  };

  data.whatsAppText = buildWhatsAppText(data);
  return data;
 }

 function buildWhatsAppText(d) {
  const c = d.clientConfig || {};
  let txt = (d.mob_client || '').replace('.', '') + '&text=' + 'Hello, *' + (d.name_client || '').trim() + '*\n';
  txt += 'Details of your voucher no.*' + d.curr_bill_info.g + '*\n';

  let formattedArray;
  if (d.discountAmt != 0) {
   formattedArray = formatNumbersForWhatsApp([d.t_itms_otal.toFixed(2), d.discountAmt.toFixed(2), d.advanceAmt.toFixed(2), d.dueAmt]);
   txt += '`' + formattedArray[0] + '` Total\n';
   txt += '`' + formattedArray[1] + '` Discount\n';
   txt += '`' + formattedArray[2] + '` Received\n';
   txt += '`' + formattedArray[3] + '` Balance';
  } else {
   formattedArray = formatNumbersForWhatsApp([d.t_itms_otal.toFixed(2), d.advanceAmt.toFixed(2), d.dueAmt]);
   txt += '`' + formattedArray[0] + '` Total\n';
   txt += '`' + formattedArray[1] + '` Received\n';
   txt += '`' + formattedArray[2] + '` Balance';
  }
  txt += '\n\n*' + ensureUTF(c.printCompNm) + '*\nThank you for choosing us.';
  return txt;
 }

 /* ============================ 5. RENDER ============================ */

 function eyeTableHTML(side, eye, vertical) {
  const p = side; // 'r' or 'l'
  const get = (k) => (eye[p + k] === undefined || eye[p + k] === null) ? '' : eye[p + k];
  const dvVN = vertical ? '6/' + get('d') : get('d');
  const nvVN = vertical ? 'N/' + get('h') : get('h');
  const label = side === 'r' ? 'R' : 'L';
  const cls = side === 'r' ? 'bepr-right-eye' : 'bepr-left-eye';

  return '<div class="bepr-eye-card ' + cls + '">' +
   '<table class="bepr-eye-table"><thead><tr>' +
   '<th class="bepr-eye-corner">' + label + '</th>' +
   '<th>SPH</th><th>CYL</th><th>AXIS</th><th>V/N</th>' +
   '</tr></thead><tbody>' +
   '<tr><th>DV</th><td>' + formatEyeValue(get('a')) + '</td><td>' + formatEyeValue(get('b')) + '</td><td>' + get('c') + '</td><td>' + dvVN + '</td></tr>' +
   '<tr><th>NV</th><td>' + formatEyeValue(get('e')) + '</td><td>' + formatEyeValue(get('f')) + '</td><td>' + get('g') + '</td><td>' + nvVN + '</td></tr>' +
   '</tbody><tfoot>' +
   '<tr><th>ADD</th><td colspan="4">' + formatEyeValue(get('i')) + '</td></tr>' +
   '<tr><th>PD</th><td colspan="4">' + get('k') + '</td></tr>' +
   '</tfoot></table></div>';
 }

 function renderEyeSection(eye, vertical) {
  if (!eye) return '';
  return '<section class="bepr-eyes" data-layout="' + (vertical ? 'vertical' : 'horizontal') + '">' +
   eyeTableHTML('r', eye, vertical) +
   eyeTableHTML('l', eye, vertical) +
   '</section>';
 }

 function renderItems(d) {
  if (!d.sCurrItems.length) {
   return '<tr><td colspan="5" class="bepr-c bepr-empty">No items</td></tr>';
  }
  const hideTax = Number((d.clientConfig || {}).hideTax) === 1;
  const layout = billTaxLayout(d.sCurrItems);
  return d.sCurrItems.map((item, index) => {
   const foundITM = d.items.find(c => c.a == item.f);
   let itemName = '';
   if (foundITM && foundITM.gn && foundITM.gn != '.') itemName = multiline(foundITM.gn);
   if (item.i && item.i.length > 0) {
    const additionalText = multiline(item.i);
    itemName = itemName ? itemName + '<br>' + additionalText : additionalText;
   }
   const qty = parseFloat(item.h) || 0;
   const netAmount = parseFloat(item.g) || 0;
   // hideTax: keep the same Total/Due, show tax-inclusive line amounts so the
   // printed sheet still adds up without a tax row.
   const amount = hideTax ? billRound2(netAmount + billItemTaxAmount(item, layout)) : netAmount;
   const price = qty ? amount / qty : 0;
   return '<tr>' +
    '<td class="bepr-c">' + (index + 1) + '</td>' +
    '<td class="bepr-l bepr-item-name">' + itemName + '</td>' +
    '<td class="bepr-r">' + item.h + '</td>' +
    '<td class="bepr-r">' + price.toFixed(2) + '</td>' +
    '<td class="bepr-r">' + amount.toFixed(2) + '</td>' +
    '</tr>';
  }).join('');
 }

 function receiptsTable(d) {
  const rows = d.sCurrCashInfo.map(receipt => {
   const date = receipt.k ? convertDateFormatToIndia(new Date(receipt.k)) : 'No Date';
   const amount = parseFloat(receipt.j || 0);
   return '<tr><td class="bepr-l">' + date + '</td><td class="bepr-r">' + amount.toFixed(2) + '</td></tr>';
  }).join('');
  return '<table class="bepr-receipts"><thead><tr>' +
   '<th class="bepr-l">Receipt Date</th><th class="bepr-r">Amount</th>' +
   '</tr></thead><tbody>' + rows +
   '<tr class="bepr-receipts-total"><td class="bepr-l">Total Received</td><td class="bepr-r">' + d.advanceAmt.toFixed(2) + '</td></tr>' +
   '</tbody></table>';
 }

 function renderInvoice(d, opts) {
  opts = opts || {};
  const c = d.clientConfig || {};
  const showAllReceipts = c.show_all_receipts == 1;
  const hideTax = Number(c.hideTax) === 1;
  const hasReceipts = showAllReceipts && d.sCurrCashInfo.length > 0;
  const verticalEyes = c.tbl_disp == 2;
  const amountInWords = price_in_words(d.t_itms_otal.toFixed(0));

  const fullHeadLogo = c['logo-0_FullHead-1'] == 1 && !!c.print_logo;
  const hideBusinessInfo = fullHeadLogo && c['logo-0_HideInfo-1'] == 1;

  const logoHTML = c.print_logo
   ? '<img class="bepr-logo-img" src="' + c.print_logo + '" alt="Logo">'
   : '';

  const headHTML = '<header class="bepr-head' + (fullHeadLogo ? ' bepr-head-fullhead' : '') + '">' +
   '<div class="bepr-logo">' + logoHTML + '</div>' +
   (hideBusinessInfo ? '' :
    '<div class="bepr-biz">' +
    '<p class="bepr-invoice-type">' + ensureUTF(c.printInvoice) + '</p>' +
    '<h1 class="bepr-company">' + ensureUTF(c.printCompNm) + '</h1>' +
    '<p>' + ensureUTF(c.printAdrs) + '</p>' +
    '<p>' + ensureUTF(c.printMo) + '</p>' +
    '<p class="bepr-subject">' + ensureUTF(c.printSubjectTo) + '</p>' +
    '</div>') +
   '</header>';

  const deliveryHTML = d.deliveryDate
   ? '<p><b>' + ensureUTF(c.printDeliveryDtTtl) + '</b> ' + d.deliveryDate + '</p>'
   : '';

  const clientHTML = '<section class="bepr-client">' +
   '<div class="bepr-client-main">' +
   '<p class="bepr-client-name"><b>' + ensureUTF(c.printPartyTtl) + '</b> <span class="bepr-hl bepr-hl-name">' + (d.name_client || '') + '</span></p>' +
   '<p class="bepr-client-mobile"><b>' + ensureUTF(c.printMobTtl) + '</b> <span class="bepr-hl bepr-hl-mobile">' + (d.mob_client || '') + '</span></p>' +
   '<p><b>' + ensureUTF(c.printAdrsTtl) + '</b> ' + (d.addr_client || '') + '</p>' +
   '</div>' +
   '<div class="bepr-client-meta">' +
   '<p class="bepr-invoice-no"><b>' + ensureUTF(c.printPavtiTtl) + '</b> ' + d.curr_bill_info.g + '</p>' +
   '<p><b>' + ensureUTF(c.printBilDtTtl) + '</b> ' + d.billDate + '</p>' +
   deliveryHTML +
   '</div>' +
   '</section>';

  const eyeHTML = renderEyeSection(d.eye_selected_msrmnt, verticalEyes);

  const referrerHTML = d.name_referrer
   ? '<p class="bepr-referrer"><b>' + ensureUTF(c.printRefByTtl) + '</b> ' + d.name_referrer + '</p>'
   : '';

  const itemsHTML = '<table class="bepr-items">' +
   '<thead><tr>' +
   '<th class="bepr-c">Sn.</th><th class="bepr-c">Details</th><th class="bepr-c">Qty</th><th class="bepr-c">Price</th><th class="bepr-c">Amt</th>' +
   '</tr></thead><tbody>' + renderItems(d) + '</tbody></table>';

  const discountRow = d.discountAmt != 0
   ? '<tr><td class="bepr-lbl">Discount</td><td class="bepr-val">' + d.discountAmt.toFixed(2) + '</td></tr>'
   : '';

  const receivedRow = hasReceipts
   ? ''
   : '<tr><td class="bepr-lbl">' + ensureUTF(c.printAdvAmtTtl) + '</td><td class="bepr-val bepr-received-amount">' + d.advanceAmt.toFixed(2) + '</td></tr>';

  const taxRow = (!hideTax && d.taxTotal > 0)
   ? '<tr><td class="bepr-lbl">Tax</td><td class="bepr-val bepr-tax-amount">' + d.taxTotal.toFixed(2) + '</td></tr>'
   : '';

  const summaryHTML = '<section class="bepr-summary">' +
   '<div class="bepr-words">' + amountInWords + '</div>' +
   '<div class="bepr-summary-right">' +
   (hasReceipts ? receiptsTable(d) : '') +
   '<table class="bepr-totals-table">' +
   taxRow +
   '<tr><td class="bepr-lbl">' + ensureUTF(c.printTxAmtTtl) + '</td><td class="bepr-val bepr-total-amount">' + d.t_itms_otal.toFixed(2) + '</td></tr>' +
   discountRow +
   receivedRow +
   '<tr><td class="bepr-lbl">Due Amt:</td><td class="bepr-val bepr-due-amount">' + d.dueAmt + '</td></tr>' +
   '</table>' +
   '</div></section>';

  const remarksHTML = d.remark
   ? '<div class="bepr-remarks"><b>Note: </b>' + d.remark + '</div>'
   : '<div class="bepr-remarks"></div>';

  const footerHTML = '<footer class="bepr-foot">' +
   remarksHTML +
   '<div class="bepr-sign">' + ensureUTF(c.printForTtl) + '</div>' +
   '</footer>';

  // Returns the inner content only; the shell already provides the
  // single #beprDoc element carrying the .bepr-doc class.
  return headHTML + clientHTML + eyeHTML + referrerHTML + itemsHTML + summaryHTML + footerHTML;
 }

 /* ============================ 6. THEME ============================ */

 const RANGE_LIMITS = { fullHeadLogoHeight: [20, 400], tdSpacing: [0, 10], nameMobileFontSize: [8, 28] };

 function applyTheme(doc, style) {
  const s = Object.assign({}, DEFAULT_STYLE, style || {});
  const set = (k, v) => doc.style.setProperty(k, v);
  set('--bepr-header-pad', px(s.logoHeaderGap));
  set('--bepr-logo-height', px(s.fullHeadLogoHeight));
  set('--bepr-gap-client', px(s.clientDetailsGap));
  set('--bepr-gap-eyes', px(s.eyeTablesGap));
  set('--bepr-name-size', px(s.nameMobileFontSize));
  set('--bepr-name-bg', s.nameBgColor);
  set('--bepr-mobile-bg', s.mobileBgColor);
  set('--bepr-invoice-bg', s.invoiceNoBgColor);
  set('--bepr-total-bg', s.totalAmtBgColor);
  set('--bepr-received-bg', s.receivedAmtBgColor);
  set('--bepr-left-eye-bg', s.leftEyeTableBgColor);
  set('--bepr-right-eye-bg', s.rightEyeTableBgColor);

  // Old module kept collapsed borders unless the user saved a cell spacing.
  const spacing = num(s.tdSpacing, 0);
  const itemsTables = doc.querySelectorAll ? doc.querySelectorAll('.bepr-items') : [];
  itemsTables.forEach(table => {
   table.style.borderCollapse = spacing > 0 ? 'separate' : 'collapse';
   table.style.borderSpacing = spacing > 0 ? spacing + 'px' : '';
  });
 }

 /* ======================= 7. PAPER / LAYOUT ======================= */

 function resolvePaper(s) {
  const size = s.paperSize || 'A4';
  let w, h;
  if (size === 'Custom') {
   w = num(s.customPaperWidth, 210);
   h = num(s.customPaperHeight, 297);
  } else {
   const d = PAPER_MM[size] || PAPER_MM.A4;
   w = d.w;
   h = d.h;
  }
  if (s.orientation === 'landscape') {
   const t = w;
   w = h;
   h = t;
  }
  return { w, h };
 }

 function applyPosition(stage, position) {
  const p = position || 'top-left';
  const horizontal = p.includes('left') ? 'flex-start' : (p.includes('right') ? 'flex-end' : 'center');
  const vertical = p.indexOf('top') === 0 ? 'flex-start' : (p.indexOf('bottom') === 0 ? 'flex-end' : 'center');
  stage.style.justifyContent = horizontal;
  stage.style.alignItems = vertical;
 }

 function measureAspect(docEl) {
  const probe = docEl.cloneNode(true);
  probe.style.width = '800px';
  probe.style.height = 'auto';
  probe.style.minHeight = '0';
  probe.style.overflow = 'visible';
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;top:-10000px;left:-10000px;width:800px;visibility:hidden;';
  box.appendChild(probe);
  document.body.appendChild(box);
  const w = probe.offsetWidth || 800;
  const h = probe.offsetHeight || 1;
  box.remove();
  return w / h;
 }

 // Uniform scale that keeps the whole invoice inside the sheet.
 function computeFitScale(designW, designH, paperW, paperH) {
  if (!(designW > 0) || !(designH > 0) || !(paperW > 0) || !(paperH > 0)) return 1;
  return Math.min(paperW / designW, paperH / designH);
 }

 // Natural (unscaled) height of the invoice at a given design width.
 function measureBox(docEl, widthPx) {
  const probe = docEl.cloneNode(true);
  probe.style.width = widthPx + 'px';
  probe.style.height = 'auto';
  probe.style.minHeight = '0';
  probe.style.transform = 'none';
  probe.style.overflow = 'visible';
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;top:-10000px;left:-10000px;width:' + widthPx + 'px;visibility:hidden;';
  box.appendChild(probe);
  document.body.appendChild(box);
  const h = probe.offsetHeight || 1;
  box.remove();
  return h;
 }

 // A late logo/image changes the measured height, so refit once it decodes.
 function refitOnImageLoad(refs) {
  if (!refs || !refs.doc || !refs.doc.querySelectorAll) return;
  Array.from(refs.doc.querySelectorAll('img')).forEach(img => {
   if (img.complete) return;
   const once = () => applyPaper(refs, paperSettings());
   img.addEventListener('load', once, { once: true });
   img.addEventListener('error', once, { once: true });
  });
 }

 function applyPaper(refs, settings) {
  const paper = resolvePaper(settings);
  const paperW = mmToPx(paper.w);
  const paperH = mmToPx(paper.h);

  refs.paper.style.width = paperW + 'px';
  refs.paper.style.height = paperH + 'px';

  const fit = settings.fitToPage !== false;
  refs.fit = fit;

  // Reset everything either mode touches.
  refs.content.style.width = '';
  refs.content.style.height = '';
  refs.doc.style.width = '';
  refs.doc.style.height = '';
  refs.doc.style.minHeight = '';
  refs.doc.style.transform = '';
  refs.fitInfo = null;

  const eyeSection = refs.doc.querySelector('.bepr-eyes');
  if (eyeSection) eyeSection.style.display = settings.printEyeMeasurements === false ? 'none' : '';

  const remarks = refs.doc.querySelector('.bepr-remarks');
  if (remarks) remarks.style.display = settings.showRemarks === false ? 'none' : '';

  if (fit) {
   // Lay the invoice out at its saved width, then scale the whole block
   // uniformly so it sits fully on the sheet, nothing cropped.
   const designW = mmToPx(num(settings.printDimension, 100));
   refs.doc.style.width = designW + 'px';
   refs.doc.style.height = 'auto';
   const designH = measureBox(refs.doc, designW);
   const scale = computeFitScale(designW, designH, paperW, paperH);

   refs.doc.style.height = designH + 'px';
   refs.doc.style.transform = 'scale(' + scale + ')';
   refs.doc.style.transformOrigin = 'top left';
   refs.content.style.width = (designW * scale) + 'px';
   refs.content.style.height = (designH * scale) + 'px';
   refs.content.style.overflow = 'visible';
   refs.stage.style.overflow = 'hidden';
   refs.stage.style.justifyContent = 'center';
   refs.stage.style.alignItems = 'flex-start';
   refs.fitInfo = { designW: designW, designH: designH, scale: scale };
  } else {
   const dim = num(settings.printDimension, 100);
   if (settings.dimensionType === 'height') {
    const hpx = mmToPx(dim);
    const ratio = measureAspect(refs.doc) || (paper.w / paper.h);
    refs.content.style.height = hpx + 'px';
    refs.content.style.width = (hpx * ratio) + 'px';
   } else {
    refs.content.style.width = mmToPx(dim) + 'px';
    refs.content.style.height = 'auto';
   }
   // Old preview never clipped the invoice to the sheet.
   refs.content.style.overflow = 'visible';
   refs.stage.style.overflow = 'visible';
   refs.doc.style.height = 'auto';
   applyPosition(refs.stage, settings.position);
  }

  fitPreview(refs);
  refitOnImageLoad(refs);
 }

 function fitPreview(refs) {
  const viewport = refs.viewport;
  if (!viewport || !refs.paper) return;
  if (viewport.clientWidth < 60) return;

  const cs = getComputedStyle(viewport);
  const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
  const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
  const availW = Math.max(80, viewport.clientWidth - padX);
  const availH = Math.max(80, viewport.clientHeight - padY);

  const paperW = refs.paper.offsetWidth || 1;
  const paperH = refs.paper.offsetHeight || 1;

  // The whole page must stay visible: constrain by width, height and a
  // sane desktop ceiling so the sheet does not fill a wide monitor.
  const base = Math.min(availW / paperW, availH / paperH, MAX_PREVIEW_W / paperW);
  const zoom = refs.zoom || 1;
  const scale = Math.max(0.1, base * zoom);

  refs.paper.style.transform = 'scale(' + scale + ')';
  refs.paper.style.transformOrigin = 'top left';

  // In free (non-fit) mode the invoice can run past the sheet edge, exactly
  // like the old preview, so the scroll area must include that overflow.
  let visualW = paperW;
  let visualH = paperH;
  if (!refs.fit && refs.content) {
   const bottom = (refs.content.offsetTop || 0) + (refs.content.offsetHeight || 0);
   const right = (refs.content.offsetLeft || 0) + (refs.content.offsetWidth || 0);
   if (bottom > visualH) visualH = bottom;
   if (right > visualW) visualW = right;
  }

  const totalW = visualW * scale;
  const totalH = visualH * scale;
  refs.spacer.style.width = totalW + 'px';
  refs.spacer.style.height = totalH + 'px';

  // Centre the sheet while it fits; anchor top-left once zoomed past the edge.
  const fits = totalW <= availW + 0.5 && totalH <= availH + 0.5;
  viewport.style.justifyContent = fits ? 'center' : 'flex-start';
  viewport.style.alignItems = fits ? 'center' : 'flex-start';
 }

 /* ========================= 8. SHELL HTML ========================= */

 const SHELL_HTML = '<div class="bepr-shell">' +
  '<div class="bepr-toolbar mt-2">' +
  '<div class="bepr-toolbar-group"><h6 class="bepr-title">Invoice Preview</h6></div>' +
  '<div class="bepr-toolbar-group">' +
  '<button type="button" class="bepr-btn" id="beprPaperBtn" title="Paper settings"><i class="fas fa-cog"></i><span class="bepr-btn-label">Paper</span></button>' +
  '<button type="button" class="bepr-btn" id="beprStyleBtn" title="Style settings"><i class="fas fa-palette"></i><span class="bepr-btn-label">Style</span></button>' +
  '<button type="button" class="bepr-btn bepr-btn-primary" id="beprDownloadBtn" title="Download image"><i class="fas fa-image"></i><span class="bepr-btn-label">Image</span></button>' +
  '<a class="bepr-btn bepr-btn-wa" id="beprWhatsappLink" target="_blank" rel="noopener" title="Share on WhatsApp"><i class="fab fa-whatsapp"></i><span class="bepr-btn-label">WhatsApp</span></a>' +
  '<button type="button" class="bepr-close" data-bs-dismiss="modal" aria-label="Close">&times;</button>' +
  '</div>' +
  '</div>' +
  '<div class="bepr-subbar">' +
  '<label class="bepr-switch"><input type="checkbox" id="beprPrintRemarks"> <span>Print remark on bill</span></label>' +
  '<div class="bepr-zoom">' +
  '<button type="button" id="beprZoomOut" title="Zoom out"><i class="fas fa-minus"></i></button>' +
  '<button type="button" id="beprZoomReset" title="Fit to width">Fit</button>' +
  '<button type="button" id="beprZoomIn" title="Zoom in"><i class="fas fa-plus"></i></button>' +
  '</div>' +
  '</div>' +
  '<div class="bepr-viewport" id="beprViewport">' +
  '<div class="bepr-spacer" id="beprSpacer">' +
  '<div class="bepr-paper" id="beprPaper">' +
  '<div class="bepr-stage" id="beprStage">' +
  '<div class="bepr-content" id="beprContent">' +
  '<div class="bepr-doc" id="beprDoc"></div>' +
  '</div></div></div></div></div></div>';

 /* ====================== 9. STYLE CONFIG MODAL ====================== */

 function openStyleModal(refs) {
  const current = refs.currentStyle || styleSettings();

  const rangesHTML = STYLE_RANGES.map(r => {
   const limits = RANGE_LIMITS[r.key] || [0, 60];
   const value = current[r.key] !== undefined ? current[r.key] : DEFAULT_STYLE[r.key];
   return '<label class="bepr-field">' +
    '<span>' + r.label + ' <b class="bepr-out" data-out="' + r.key + '">' + value + '</b></span>' +
    '<input type="range" data-style="' + r.key + '" min="' + limits[0] + '" max="' + limits[1] + '" step="1" value="' + value + '">' +
    '</label>';
  }).join('');

  const colorsHTML = STYLE_COLORS.map(c => {
   const value = current[c.key] || DEFAULT_STYLE[c.key];
   return '<label class="bepr-color-field"><span>' + c.label + '</span>' +
    '<input type="color" data-style="' + c.key + '" value="' + value + '"></label>';
  }).join('');

  const html = '<div class="bepr-modal-body">' +
   '<h6 class="bepr-modal-title">Style settings</h6>' +
   '<div class="bepr-fields">' + rangesHTML + '</div>' +
   '<h6 class="bepr-modal-title">Colors</h6>' +
   '<div class="bepr-color-grid">' + colorsHTML + '</div>' +
   '<div class="bepr-preset-row">' +
   '<button type="button" class="bepr-btn" data-preset="default">Default</button>' +
   '<button type="button" class="bepr-btn" data-preset="blue">Blue</button>' +
   '<button type="button" class="bepr-btn" data-preset="yellow">Yellow</button>' +
   '<button type="button" class="bepr-btn" data-preset="redGrey">Red &amp; Grey</button>' +
   '<button type="button" class="bepr-btn" id="beprStyleReset">Reset</button>' +
   '</div>' +
   '<div class="bepr-modal-actions">' +
   '<button type="button" class="bepr-btn" data-bs-dismiss="modal">Cancel</button>' +
   '<button type="button" class="bepr-btn bepr-btn-primary" id="beprStyleSave">Save settings</button>' +
   '</div></div>';

  const modal = create_modal_dynamically('beprStyleModal');
  const content = modal.contentElement;
  const instance = modal.modalInstance;
  content.innerHTML = html;
  modal.modalElement.querySelector('.modal-dialog').classList.add('modal-lg');
  instance.show();

  const readForm = () => {
   const out = {};
   content.querySelectorAll('[data-style]').forEach(input => {
    out[input.dataset.style] = input.value;
   });
   return out;
  };

  const syncOutputs = () => {
   content.querySelectorAll('[data-out]').forEach(out => {
    const input = content.querySelector('[data-style="' + out.dataset.out + '"]');
    if (input) out.textContent = input.value;
   });
  };

  const applyLive = () => applyTheme(refs.doc, readForm());

  content.addEventListener('input', event => {
   if (!event.target.dataset || !event.target.dataset.style) return;
   syncOutputs();
   applyLive();
  });

  content.querySelectorAll('[data-preset]').forEach(btn => {
   btn.addEventListener('click', () => {
    const preset = THEME_PRESETS[btn.dataset.preset];
    if (!preset) return;
    Object.keys(preset).forEach(key => {
     const input = content.querySelector('[data-style="' + key + '"]');
     if (input) input.value = preset[key];
    });
    syncOutputs();
    applyLive();
   });
  });

  content.querySelector('#beprStyleReset').addEventListener('click', () => {
   Object.keys(DEFAULT_STYLE).forEach(key => {
    const input = content.querySelector('[data-style="' + key + '"]');
    if (input) input.value = DEFAULT_STYLE[key];
   });
   syncOutputs();
   applyLive();
  });

  let saved = false;
  content.querySelector('#beprStyleSave').addEventListener('click', () => {
   const values = readForm();
   saveStyle(values);
   refs.currentStyle = values;
   saved = true;
   applyTheme(refs.doc, values);
   applyPaper(refs, paperSettings());
   instance.hide();
   createToast('Style settings saved', 'success');
  });

  modal.modalElement.addEventListener('hidden.bs.modal', () => {
   if (!saved) {
    applyTheme(refs.doc, refs.currentStyle || styleSettings());
    applyPaper(refs, paperSettings());
   }
  }, { once: true });
 }

 /* ====================== 10. PAPER CONFIG MODAL ====================== */

 function openPaperModal(refs) {
  const s = paperSettings();

  const positionsHTML = POSITIONS.map(p =>
   '<button type="button" class="bepr-pos" data-pos="' + p[0] + '">' + p[1] + '</button>'
  ).join('');

  const html = '<div class="bepr-modal-body">' +
   '<h6 class="bepr-modal-title">Paper &amp; layout</h6>' +
   '<label class="bepr-field"><span>Paper size</span><select id="beprPaperSize">' +
   '<option value="A4">A4 (210 x 297 mm)</option>' +
   '<option value="A5">A5 (148 x 210 mm)</option>' +
   '<option value="Custom">Custom</option>' +
   '</select></label>' +
   '<div class="bepr-two" id="beprCustomWrap">' +
   '<label class="bepr-field"><span>Width (mm)</span><input type="number" id="beprPaperW" min="20" max="2000" step="1"></label>' +
   '<label class="bepr-field"><span>Height (mm)</span><input type="number" id="beprPaperH" min="20" max="2000" step="1"></label>' +
   '</div>' +
   '<label class="bepr-field"><span>Orientation</span><select id="beprOrientation">' +
   '<option value="portrait">Portrait</option><option value="landscape">Landscape</option>' +
   '</select></label>' +
   '<label class="bepr-switch bepr-block"><input type="checkbox" id="beprFitPage"> <span>Fit invoice to page</span></label>' +
   '<div id="beprSizeFields">' +
   '<label class="bepr-field"><span>Dimension type</span><select id="beprDimType">' +
   '<option value="width">By width</option><option value="height">By height</option>' +
   '</select></label>' +
   '<label class="bepr-field"><span>Size (mm)</span><input type="number" id="beprDimValue" min="10" max="2000" step="1"></label>' +
   '<div class="bepr-field"><span>Position on paper</span><div class="bepr-pos-grid" id="beprPosGrid">' +
   positionsHTML + '</div></div>' +
   '</div>' +
   '<label class="bepr-switch bepr-block"><input type="checkbox" id="beprEyeToggle"> <span>Print eye measurements</span></label>' +
   '<div class="bepr-modal-actions">' +
   '<button type="button" class="bepr-btn" data-bs-dismiss="modal">Cancel</button>' +
   '<button type="button" class="bepr-btn bepr-btn-primary" id="beprPaperSave">Save</button>' +
   '</div></div>';

  const modal = create_modal_dynamically('beprPaperModal');
  const content = modal.contentElement;
  const instance = modal.modalInstance;
  content.innerHTML = html;
  modal.modalElement.querySelector('.modal-dialog').classList.add('modal-lg');
  instance.show();

  const q = sel => content.querySelector(sel);
  let selectedPosition = s.position || 'top-left';

  q('#beprPaperSize').value = s.paperSize || 'A4';
  q('#beprPaperW').value = s.customPaperWidth || 210;
  q('#beprPaperH').value = s.customPaperHeight || 297;
  q('#beprOrientation').value = s.orientation || 'portrait';
  q('#beprFitPage').checked = s.fitToPage !== false;
  q('#beprDimType').value = s.dimensionType || 'width';
  q('#beprDimValue').value = s.printDimension || '100';
  q('#beprEyeToggle').checked = s.printEyeMeasurements !== false;

  const syncCustom = () => {
   q('#beprCustomWrap').style.display = q('#beprPaperSize').value === 'Custom' ? '' : 'none';
  };
  const syncFit = () => {
   const fit = q('#beprFitPage').checked;
   const fields = q('#beprSizeFields');
   fields.style.opacity = fit ? '0.45' : '1';
   fields.style.pointerEvents = fit ? 'none' : '';
  };
  const syncPosition = () => {
   content.querySelectorAll('[data-pos]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pos === selectedPosition);
   });
  };

  q('#beprPaperSize').addEventListener('change', syncCustom);
  q('#beprFitPage').addEventListener('change', syncFit);
  content.querySelectorAll('[data-pos]').forEach(btn => {
   btn.addEventListener('click', () => {
    selectedPosition = btn.dataset.pos;
    syncPosition();
   });
  });

  syncCustom();
  syncFit();
  syncPosition();

  q('#beprPaperSave').addEventListener('click', () => {
   const patch = {
    paperSize: q('#beprPaperSize').value,
    orientation: q('#beprOrientation').value,
    fitToPage: q('#beprFitPage').checked,
    dimensionType: q('#beprDimType').value,
    printDimension: q('#beprDimValue').value,
    position: selectedPosition,
    customPaperWidth: q('#beprPaperW').value,
    customPaperHeight: q('#beprPaperH').value,
    printEyeMeasurements: q('#beprEyeToggle').checked
   };
   const next = savePaper(patch);
   applyPaper(refs, next);
   instance.hide();
   createToast('Paper settings saved', 'success');
  });
 }

 /* ============================ 11. EXPORT ============================ */

 function waitImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  return Promise.all(imgs.map(img => {
   if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
   return new Promise(resolve => {
    img.onload = resolve;
    img.onerror = resolve;
    setTimeout(resolve, 4000);
   });
  }));
 }

 function buildExportNode(refs, s) {
  const paper = resolvePaper(s);
  const fit = s.fitToPage !== false;

  let wmm, hmm;
  if (fit) {
   wmm = paper.w;
   hmm = paper.h;
  } else {
   const dim = num(s.printDimension, 100);
   const ratio = measureAspect(refs.doc) || (paper.w / paper.h);
   if (s.dimensionType === 'height') {
    hmm = dim;
    wmm = dim * ratio;
   } else {
    wmm = dim;
    hmm = wmm / ratio;
   }
  }

  const wrap = document.createElement('div');
  wrap.className = 'bepr-export';
  wrap.style.cssText = fit
   ? 'position:fixed;top:0;left:0;width:' + wmm + 'mm;height:' + hmm + 'mm;background:#ffffff;z-index:-1;pointer-events:none;overflow:hidden;'
   : 'position:fixed;top:0;left:0;width:' + wmm + 'mm;min-height:' + hmm + 'mm;background:#ffffff;z-index:-1;pointer-events:none;';

  const clone = refs.doc.cloneNode(true);
  clone.style.boxSizing = 'border-box';
  clone.style.overflow = 'visible';

  if (fit) {
   // Reproduce the preview's uniform page-fit inside a paper-sized box.
   const info = refs.fitInfo || {};
   const paperPxW = mmToPx(paper.w);
   const paperPxH = mmToPx(paper.h);
   const designW = info.designW || mmToPx(num(s.printDimension, 100));
   const designH = info.designH || measureBox(refs.doc, designW);
   const scale = info.scale || computeFitScale(designW, designH, paperPxW, paperPxH);
   const left = Math.max(0, (paperPxW - designW * scale) / 2);

   clone.style.position = 'absolute';
   clone.style.left = left + 'px';
   clone.style.top = '0';
   clone.style.width = designW + 'px';
   clone.style.height = designH + 'px';
   clone.style.minHeight = '0';
   clone.style.transform = 'scale(' + scale + ')';
   clone.style.transformOrigin = 'top left';
  } else {
   clone.style.width = '100%';
   clone.style.height = 'auto';
   clone.style.minHeight = hmm + 'mm';
  }

  wrap.appendChild(clone);
  return wrap;
 }

 async function downloadImage(refs, data) {
  const toast = createToast('Generating image...', 'info');
  let node = null;
  try {
   if (typeof html2canvas !== 'function') throw new Error('html2canvas is not loaded');

   const s = paperSettings();
   node = buildExportNode(refs, s);
   document.body.appendChild(node);
   await waitImages(node);

   const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false
   });

   node.remove();
   node = null;

   const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
   if (!blob) throw new Error('Could not create image');

   const filename = String(data.filename || ('invoice_' + Date.now())).replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim();

   if (navigator.share && navigator.canShare) {
    try {
     const file = new File([blob], filename + '.jpg', { type: 'image/jpeg' });
     const shareData = {
      title: 'Invoice',
      text: 'Invoice ' + data.curr_bill_info.g + ' from ' + ensureUTF(data.clientConfig.printCompNm),
      files: [file]
     };
     if (navigator.canShare(shareData)) {
      await navigator.share(shareData);
      createToast('Image shared successfully!', 'success');
      return;
     }
    } catch (shareError) {
     console.log('bePr2: share failed, falling back to download', shareError);
    }
   }

   const link = document.createElement('a');
   link.download = filename + '.jpg';
   link.href = URL.createObjectURL(blob);
   document.body.appendChild(link);
   link.click();
   link.remove();
   setTimeout(() => URL.revokeObjectURL(link.href), 1000);
   createToast('Image downloaded successfully!', 'success');
  } catch (err) {
   console.error('bePr2: image export failed', err);
   createToast('Error: ' + err.message, 'danger');
   if (node) node.remove();
  } finally {
   toast.remove();
  }
 }

 /* ============================ 12. STYLES ============================ */

 const STYLES = `
#beprModal .modal-body { padding:0 !important; overflow:hidden !important; max-height:none !important; height:100%; display:flex; flex-direction:column; }
#beprModal .modal-content { height:100%; border-radius:0; }
#beprModal .modal-dialog.modal-fullscreen { height:100%; margin:0; max-width:none; }

.bepr-shell { display:flex; flex-direction:column; flex:1; min-height:0; background:#eef1f5; font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif; }
.bepr-toolbar { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 12px; background:#fff; border-bottom:1px solid #dee2e6; flex-wrap:wrap; flex-shrink:0; }
.bepr-toolbar-group { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.bepr-title { margin:0; font-size:15px; font-weight:600; color:#343a40; }
.bepr-btn { display:inline-flex; align-items:center; gap:6px; border:1px solid #ced4da; background:#fff; color:#343a40; padding:6px 10px; border-radius:6px; font-size:13px; line-height:1.2; cursor:pointer; text-decoration:none; white-space:nowrap; }
.bepr-btn:hover { background:#f1f3f5; color:#212529; }
.bepr-btn-primary { background:#0d6efd; border-color:#0d6efd; color:#fff; }
.bepr-btn-primary:hover { background:#0b5ed7; color:#fff; }
.bepr-btn-wa { background:#25d366; border-color:#25d366; color:#fff; }
.bepr-btn-wa:hover { background:#1ebe5b; color:#fff; }
.bepr-close { border:none; background:transparent; font-size:26px; line-height:1; padding:0 4px; color:#6c757d; cursor:pointer; }
.bepr-close:hover { color:#212529; }
.bepr-subbar { display:flex; align-items:center; gap:12px; padding:6px 12px; background:#fff; border-bottom:1px solid #e9ecef; flex-shrink:0; flex-wrap:wrap; }
.bepr-zoom { display:inline-flex; align-items:center; gap:4px; margin-left:auto; }
.bepr-zoom button { border:1px solid #ced4da; background:#fff; border-radius:6px; min-width:30px; height:28px; padding:0 8px; font-size:12px; line-height:1; color:#343a40; cursor:pointer; }
.bepr-zoom button:hover { background:#f1f3f5; }
.bepr-switch { display:inline-flex; align-items:center; gap:6px; font-size:12.5px; color:#495057; margin:0; cursor:pointer; }
.bepr-switch input { margin:0; }
.bepr-viewport { flex:1; min-height:0; overflow:auto; padding:16px; display:flex; align-items:flex-start; justify-content:center; background:#eef1f5; }
.bepr-spacer { position:relative; flex:0 0 auto; }
.bepr-paper { position:absolute; top:0; left:0; background:#fff; box-shadow:0 6px 28px rgba(0,0,0,.18); transform-origin:top left; }
.bepr-stage { position:absolute; inset:0; display:flex; overflow:hidden; }
.bepr-content { background:#fff; overflow:hidden; }

.bepr-doc { width:100%; box-sizing:border-box; padding:15px; background:#fff; color:#000; font-family:Arial,"Segoe UI",sans-serif; font-size:16px; line-height:1.15; display:block; overflow:visible; }
.bepr-head { display:grid; grid-template-columns:150px minmax(0,1fr); align-items:start; margin-bottom:15px; }
.bepr-logo { width:150px; min-width:0; }
.bepr-logo-img { display:block; width:150px; max-width:100%; height:auto; object-fit:contain; }
.bepr-head.bepr-head-fullhead { display:block; }
.bepr-head-fullhead .bepr-logo { width:100%; margin-bottom:10px; }
.bepr-head-fullhead .bepr-logo-img { display:block; width:100%; max-width:none; height:var(--bepr-logo-height,150px); object-fit:contain; }
.bepr-biz { min-width:0; padding:0 var(--bepr-header-pad,10px); text-align:center; }
.bepr-invoice-type { margin:2px 0; font-size:12px; }
.bepr-company { margin:5px 0; font-size:18px; line-height:1.15; font-weight:700; }
.bepr-biz p { margin:2px 0; font-size:12.8px; }
.bepr-subject { font-size:12px !important; }

.bepr-client { display:flex; justify-content:space-between; margin-bottom:15px; }
.bepr-client-main { width:70%; min-width:0; word-wrap:break-word; }
.bepr-client-meta { width:30%; text-align:right; }
.bepr-client p { margin:1em 0 var(--bepr-gap-client,16px); }
.bepr-hl { display:inline-block; padding:1px 5px; border-radius:3px; font-size:var(--bepr-name-size,16px); }
.bepr-hl-name { background:var(--bepr-name-bg,#f0f0f0); }
.bepr-hl-mobile { background:var(--bepr-mobile-bg,#f0f0f0); }
.bepr-invoice-no { display:inline-block; padding:1px 5px; border-radius:3px; background:var(--bepr-invoice-bg,#f0f0f0); }

.bepr-eyes { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:15px 0 var(--bepr-gap-eyes,15px); }
.bepr-eyes[data-layout="vertical"] { grid-template-columns:1fr; gap:var(--bepr-gap-eyes,15px); }
.bepr-eye-card { border:1px solid #000; min-width:0; }
.bepr-left-eye { background:var(--bepr-left-eye-bg,#fff); }
.bepr-right-eye { background:var(--bepr-right-eye-bg,#fff); }
.bepr-eye-table { width:100%; border-collapse:collapse; font-size:12px; table-layout:fixed; }
.bepr-eye-table th, .bepr-eye-table td { border:1px solid #000; padding:4px; text-align:center; }
.bepr-eye-table thead th { background:transparent; font-weight:400; }
.bepr-eye-table thead th.bepr-eye-corner { background:#f0f0f0; font-weight:700; }
.bepr-eye-table tbody th, .bepr-eye-table tfoot th { background:transparent; font-weight:400; }
.bepr-eye-corner { width:14%; }

.bepr-referrer { margin:10px 0; font-size:12px; }

.bepr-items { width:100%; border-collapse:collapse; font-size:12px; }
.bepr-items th, .bepr-items td { border:1px solid #000; padding:4px; vertical-align:top; word-wrap:break-word; }
.bepr-items th { background:#f0f0f0; padding:6px; font-weight:700; }
.bepr-item-name { font-family:Arial,sans-serif; }
.bepr-empty { padding:8px !important; text-align:center; color:#666; }

.bepr-c { text-align:center; }
.bepr-r { text-align:right; }
.bepr-l { text-align:left; }

.bepr-summary { display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:start; gap:0; margin:0; }
.bepr-words { font-size:12px; min-width:0; word-wrap:break-word; padding:8px 4px; }
.bepr-summary-right { min-width:0; }
.bepr-totals-table { border-collapse:collapse; font-size:16px; }
.bepr-totals-table td { padding:8px; }
.bepr-lbl { text-align:right; font-weight:700; }
.bepr-val { text-align:right; border:2px solid #000; font-weight:700; }
.bepr-total-amount { background:var(--bepr-total-bg,#f0f0f0); }
.bepr-received-amount { background:var(--bepr-received-bg,#f0f0f0); }

.bepr-receipts { width:100%; border-collapse:collapse; font-size:11px; margin-bottom:6px; }
.bepr-receipts th, .bepr-receipts td { border:1px solid #000; padding:4px; }
.bepr-receipts th { background:#f0f0f0; font-weight:700; }
.bepr-receipts-total td { font-weight:700; }

.bepr-foot { display:flex; justify-content:space-between; align-items:flex-start; margin-top:20px; }
.bepr-remarks { width:75%; font-size:16px; word-wrap:break-word; }
.bepr-sign { width:24%; text-align:right; font-size:16px; }

.bepr-modal-body { padding:16px; }
.bepr-modal-title { margin:0 0 10px; font-size:14px; }
.bepr-fields { display:grid; gap:10px; }
.bepr-field { display:flex; flex-direction:column; gap:4px; font-size:12px; color:#495057; margin:0 0 10px; }
.bepr-field input[type="number"], .bepr-field select { width:100%; padding:7px 9px; border:1px solid #ced4da; border-radius:6px; font-size:13px; }
.bepr-field input[type="range"] { width:100%; }
.bepr-out { color:#0d6efd; }
.bepr-color-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; }
.bepr-color-field { display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:12px; color:#495057; }
.bepr-color-field input[type="color"] { width:42px; height:28px; padding:0; border:1px solid #ced4da; border-radius:4px; background:#fff; }
.bepr-two { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.bepr-switch.bepr-block { display:flex; margin:8px 0; font-size:13px; }
.bepr-pos-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.bepr-pos { padding:9px 4px; border:1px solid #ced4da; background:#f8f9fa; border-radius:6px; font-size:11px; cursor:pointer; }
.bepr-pos:hover { background:#e9ecef; }
.bepr-pos.active { background:#0d6efd; border-color:#0d6efd; color:#fff; }
.bepr-preset-row { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0 14px; }
.bepr-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:8px; }

@media (min-width: 768px) {
 .bepr-viewport { padding:24px; }
}

@media (max-width: 576px) {
 .bepr-btn-label { display:none; }
 .bepr-toolbar { padding:6px 8px; }
 .bepr-subbar { padding:5px 8px; }
 .bepr-viewport { padding:8px; }
 .bepr-title { font-size:13px; }
 .bepr-btn { padding:6px 8px; }
}
`;

 function ensureStyles() {
  if (document.getElementById('bepr2-styles')) return;
  const style = document.createElement('style');
  style.id = 'bepr2-styles';
  style.textContent = STYLES;
  document.head.appendChild(style);
 }

 /* ============================ 13. ENTRY ============================ */

 async function sho_bepr_mdl(...params) {
  const billId = params[0];
  const loader = createDynamicLoader('Loading invoice...');

  try {
   try {
    await loadCshScriptsSequentially(7);
   } catch (loadErr) {
    console.warn('bePr2: html2canvas could not be loaded; image export may be unavailable.', loadErr);
   }

   ensureStyles();
   migratePaper();
   const data = await loadBillData(billId);

   const modal = create_modal_dynamically('beprModal');
   const contentElement = modal.contentElement;
   const modalInstance = modal.modalInstance;
   const modalElement = modal.modalElement;

   const dialog = modalElement.querySelector('.modal-dialog');
   if (dialog) dialog.classList.add('modal-fullscreen');
   const modalContent = modalElement.querySelector('.modal-content');
   if (modalContent) modalContent.style.border = 'none';

   contentElement.style.padding = '0';
   contentElement.style.overflow = 'hidden';
   contentElement.style.maxHeight = 'none';
   contentElement.style.height = '100%';
   contentElement.style.display = 'flex';
   contentElement.style.flexDirection = 'column';

   contentElement.innerHTML = SHELL_HTML;

   const refs = {
    modalElement,
    viewport: contentElement.querySelector('#beprViewport'),
    spacer: contentElement.querySelector('#beprSpacer'),
    paper: contentElement.querySelector('#beprPaper'),
    stage: contentElement.querySelector('#beprStage'),
    content: contentElement.querySelector('#beprContent'),
    doc: contentElement.querySelector('#beprDoc')
   };

   refs.doc.dataset.theme = 'default';
   refs.doc.innerHTML = renderInvoice(data, { themeKey: 'default' });

   // Saved style wins; otherwise bill_theme (0/undefined => current default).
   const hasSavedStyle = hasStore(STYLE_STORE);
   const initialStyle = hasSavedStyle ? styleSettings() : themeFor(data.clientConfig.bill_theme);
   refs.currentStyle = initialStyle;
   applyTheme(refs.doc, initialStyle);

   const paperNow = paperSettings();

   const remarksToggle = contentElement.querySelector('#beprPrintRemarks');
   remarksToggle.checked = paperNow.showRemarks !== false;
   remarksToggle.addEventListener('change', () => {
    savePaper({ showRemarks: remarksToggle.checked });
    applyPaper(refs, paperSettings());
   });

   // Zoom is relative to "fit to width" (1 = fit).
   refs.zoom = 1;
   const zoomReset = contentElement.querySelector('#beprZoomReset');
   const setZoom = (value) => {
    refs.zoom = Math.min(4, Math.max(0.3, value));
    zoomReset.textContent = refs.zoom === 1 ? 'Fit' : Math.round(refs.zoom * 100) + '%';
    fitPreview(refs);
   };
   contentElement.querySelector('#beprZoomIn').addEventListener('click', () => setZoom((refs.zoom || 1) * 1.25));
   contentElement.querySelector('#beprZoomOut').addEventListener('click', () => setZoom((refs.zoom || 1) / 1.25));
   zoomReset.addEventListener('click', () => setZoom(1));

   const wa = contentElement.querySelector('#beprWhatsappLink');
   wa.href = 'https://api.whatsapp.com/send?phone=' + encodeURI(data.whatsAppText);

   contentElement.querySelector('#beprPaperBtn').addEventListener('click', () => openPaperModal(refs));
   contentElement.querySelector('#beprStyleBtn').addEventListener('click', () => openStyleModal(refs));
   contentElement.querySelector('#beprDownloadBtn').addEventListener('click', () => downloadImage(refs, data));

   modalInstance.show();
   applyPaper(refs, paperNow);

   modalElement.addEventListener('shown.bs.modal', () => fitPreview(refs), { once: true });
   setTimeout(() => fitPreview(refs), 120);
   setTimeout(() => fitPreview(refs), 450);

   let resizeTimer = null;
   const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fitPreview(refs), 100);
   };
   window.addEventListener('resize', onResize);

   let ro = null;
   if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => fitPreview(refs));
    ro.observe(refs.viewport);
   }

   modalElement.addEventListener('hidden.bs.modal', () => {
    window.removeEventListener('resize', onResize);
    if (ro) ro.disconnect();
   }, { once: true });

   return modalInstance;
  } catch (error) {
   console.error('bePr2: sho_bepr_mdl failed', error);
   createToast('Could not open invoice: ' + error.message, 'danger');
   throw error;
  } finally {
   loader.removeLoader();
  }
 }

 /* ============================ 14. EXPOSE ============================ */

 // Keep any mappings/presets registered before this file loaded, and share
 // the same objects so later additions from Print Settings take effect.
 if (window.BILL_THEME_MAP) Object.assign(THEME_MAP, window.BILL_THEME_MAP);
 if (window.BILL_THEME_PRESETS) Object.assign(THEME_PRESETS, window.BILL_THEME_PRESETS);

 window.sho_bepr_mdl = sho_bepr_mdl;
 window.BILL_THEME_PRESETS = THEME_PRESETS;
 window.BILL_THEME_MAP = THEME_MAP;
 window.getBillThemeSettings = themeFor;

})();