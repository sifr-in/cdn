/* =====================================================================
   bePr3.js - Invoice print / preview module (new theme)
   ---------------------------------------------------------------------
   Public API (unchanged):
     window.sho_bepr_mdl(billId)        // loaded via csh item 22

   Visual theme ported from newtest.js (A4 GST-style invoice sheet) and
   driven by the same settings that the earlier modules used.

   Dependencies already available globally in this app:
     loadCshScriptsSequentially, create_modal_dynamically,
     createDynamicLoader, dbDexieManager, dbnm, bootstrap

   Optional CDN (only for image export): html2canvas  (csh item 7)

   Storage keys kept backward compatible:
     localStorage.paperSettings
     localStorage.styleSettings

   Theme hooks:
     window.BILL_THEME_PRESETS
     window.BILL_THEME_MAP      // 0 / undefined => default look
     window.getBillThemeSettings(n)
   ===================================================================== */
(function () {
 'use strict';

 /* ============================ 1. CONFIG ============================ */

 const MM_TO_PX = 96 / 25.4; // CSS pixels per millimetre at 96 dpi
 const PAPER_MM = { A4: { w: 210, h: 297 }, A5: { w: 148, h: 210 } };

 // Below this available preview width the sheet switches to its mobile
 // flow layout. The printed/exported invoice always keeps the paper size.
 const MOBILE_PREVIEW_BREAKPOINT = 640;

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

 const DEFAULT_STYLE = {
  logoHeaderGap: '20',
  fullHeadLogoHeight: '52',
  footerPadding: '6',
  clientDetailsGap: '0',
  eyeTablesGap: '10',
  billItemsGap: '0',
  tdSpacing: '1',
  nameMobileFontSize: '14',
  inkColor: '#26385e',
  brandColor: '#31558f',
  accentColor: '#319bd4',
  grandTotalColor: '#9c2e3b',
  nameBgColor: '#f0f0f0',
  mobileBgColor: '#f0f0f0',
  invoiceNoBgColor: '#f0f0f0',
  totalAmtBgColor: '#f0f0f0',
  receivedAmtBgColor: '#f0f0f0',
  leftEyeTableBgColor: '#ffffff',
  rightEyeTableBgColor: '#ffffff',
  footerBgColor: '#626cf7',
  footerTextColor: '#ffffff'
 };

 const THEME_PRESETS = {
  default: {
   logoHeaderGap: '20', fullHeadLogoHeight: '52', clientDetailsGap: '0', eyeTablesGap: '10', billItemsGap: '0',
   tdSpacing: '1', nameMobileFontSize: '14',
   inkColor: '#26385e', brandColor: '#31558f', accentColor: '#319bd4', grandTotalColor: '#9c2e3b',
   nameBgColor: '#f0f0f0', mobileBgColor: '#f0f0f0', invoiceNoBgColor: '#f0f0f0',
   totalAmtBgColor: '#f0f0f0', receivedAmtBgColor: '#f0f0f0',
   leftEyeTableBgColor: '#ffffff', rightEyeTableBgColor: '#ffffff', footerPadding: '6', footerBgColor: '#626cf7', footerTextColor: '#ffffff'
  },
  blue: {
   logoHeaderGap: '30', fullHeadLogoHeight: '52', clientDetailsGap: '5', eyeTablesGap: '10', billItemsGap: '5',
   tdSpacing: '2', nameMobileFontSize: '16',
   inkColor: '#1e3a8a', brandColor: '#1d4ed8', accentColor: '#38bdf8', grandTotalColor: '#b91c1c',
   nameBgColor: '#e3f2fd', mobileBgColor: '#e3f2fd', invoiceNoBgColor: '#bbdefb',
   totalAmtBgColor: '#90caf9', receivedAmtBgColor: '#64b5f6',
   leftEyeTableBgColor: '#f3f9ff', rightEyeTableBgColor: '#f3f9ff', footerPadding: '6', footerBgColor: '#626cf7', footerTextColor: '#ffffff'
  },
  yellow: {
   logoHeaderGap: '40', fullHeadLogoHeight: '52', clientDetailsGap: '8', eyeTablesGap: '15', billItemsGap: '8',
   tdSpacing: '3', nameMobileFontSize: '18',
   inkColor: '#713f12', brandColor: '#a16207', accentColor: '#eab308', grandTotalColor: '#b91c1c',
   nameBgColor: '#fff8e1', mobileBgColor: '#fff8e1', invoiceNoBgColor: '#ffecb3',
   totalAmtBgColor: '#ffe082', receivedAmtBgColor: '#ffd54f',
   leftEyeTableBgColor: '#fffde7', rightEyeTableBgColor: '#fffde7', footerPadding: '6', footerBgColor: '#626cf7', footerTextColor: '#ffffff'
  },
  redGrey: {
   logoHeaderGap: '25', fullHeadLogoHeight: '52', clientDetailsGap: '6', eyeTablesGap: '12', billItemsGap: '6',
   tdSpacing: '1', nameMobileFontSize: '16',
   inkColor: '#3f3f46', brandColor: '#7f1d1d', accentColor: '#dc2626', grandTotalColor: '#9c2e3b',
   nameBgColor: '#ffebee', mobileBgColor: '#ffebee', invoiceNoBgColor: '#f5f5f5',
   totalAmtBgColor: '#ffcdd2', receivedAmtBgColor: '#ef9a9a',
   leftEyeTableBgColor: '#fafafa', rightEyeTableBgColor: '#f5f5f5', footerPadding: '6', footerBgColor: '#626cf7', footerTextColor: '#ffffff'
  }
 };

 // 0 / undefined = current default look. Add your own numbers later, e.g. 1:'blue'.
 const THEME_MAP = { 0: 'default' };

 const STYLE_RANGES = [
  { key: 'logoHeaderGap', label: 'Header gap' },
  { key: 'fullHeadLogoHeight', label: 'Full-head logo height' },
  { key: 'footerPadding', label: 'Footer padding' },
  { key: 'clientDetailsGap', label: 'Client details gap' },
  { key: 'eyeTablesGap', label: 'Eye tables gap' },
  { key: 'billItemsGap', label: 'Bill items gap' },
  { key: 'tdSpacing', label: 'Table cell spacing' },
  { key: 'nameMobileFontSize', label: 'Name / Mobile font size' }
 ];

 const STYLE_COLORS = [
  { key: 'inkColor', label: 'Border / ink' },
  { key: 'brandColor', label: 'Brand text' },
  { key: 'accentColor', label: 'Brand accent' },
  { key: 'grandTotalColor', label: 'Grand total text' },
  { key: 'nameBgColor', label: 'Name background' },
  { key: 'mobileBgColor', label: 'Mobile background' },
  { key: 'invoiceNoBgColor', label: 'Invoice no. background' },
  { key: 'totalAmtBgColor', label: 'Total amount background' },
  { key: 'receivedAmtBgColor', label: 'Received amount background' },
  { key: 'leftEyeTableBgColor', label: 'Left eye table background' },
  { key: 'rightEyeTableBgColor', label: 'Right eye table background' },
  { key: 'footerBgColor', label: 'Footer background' },
  { key: 'footerTextColor', label: 'Footer text' }
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

 // Plain, readable text out of config values that may contain HTML.
 function plainText(value) {
  const raw = String(value == null ? '' : value)
   .replace(/<br\s*\/?>/gi, ' ')
   .replace(/<[^>]*>/g, ' ');
  return ensureUTF(raw).replace(/\s+/g, ' ').trim();
 }

 function labelOf(value, fallback) {
  return plainText(value) || fallback;
 }

 function initialsOf(name) {
  const words = (plainText(name) || 'C').split(/\s+/).slice(0, 2);
  return words.map(w => w.charAt(0).toUpperCase()).join('');
 }

 function brandParts(name) {
  const raw = plainText(name) || 'Company';
  const words = raw.split(/\s+/);
  if (words.length < 2) return { main: raw, accent: '' };
  const accent = words.pop();
  return { main: words.join(' '), accent: accent };
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

 // Tax stored on a bill row (`i`).
 // Split layout (billItemTaxSplit=1): j/tax1 amount, k/tax2 amount, t/sub-name.
 // Legacy layout: j/sub-name, t/tax amount.
 function billItemTaxTotal(billItem, cfg) {
  const c = cfg || (typeof clientConfig !== 'undefined' && clientConfig) || {};
  const splitOn = Number(c.billItemTaxSplit) === 1;
  const kPresent = billItem && billItem.k !== undefined && billItem.k !== null && String(billItem.k).trim() !== '';
  const jNumeric = Number.isFinite(parseFloat(billItem && billItem.j));
  const tNumeric = Number.isFinite(parseFloat(billItem && billItem.t));
  if (splitOn && (kPresent || (jNumeric && !tNumeric))) {
   return (parseFloat(billItem.j) || 0) + (parseFloat(billItem.k) || 0);
  }
  return parseFloat(billItem && billItem.t) || 0;
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
  const toastId = 'bepr3-toast-' + Date.now();
  const toastHtml = '<div id="' + toastId + '" class="toast align-items-center text-bg-' + type + ' border-0" role="alert" aria-live="assertive" aria-atomic="true">' +
   '<div class="d-flex"><div class="toast-body">' + message + '</div>' +
   '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
   '</div></div>';
  const toastContainer = (() => {
   let container = document.getElementById('bepr3-toast-container');
   if (!container) {
    container = document.createElement('div');
    container.id = 'bepr3-toast-container';
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
  try {
   localStorage.setItem(PAPER_STORE, JSON.stringify(next));
  } catch (e) {
   console.warn('bePr3: could not save paper settings', e);
  }
  return next;
 }

 function saveStyle(patch) {
  const next = Object.assign({}, styleSettings(), patch || {});
  try {
   localStorage.setItem(STYLE_STORE, JSON.stringify(next));
  } catch (e) {
   console.warn('bePr3: could not save style settings', e);
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
  const sCurrItems = billItemRows.filter(item => item.e == billId);
  const stored_bill_cash_info = await dbDexieManager.getAllRecords(dbnm, 'r') || [];
  const sCurrCashInfo = stored_bill_cash_info.filter(item => item.td == billId && item.tb == 7);

  let name_referrer = '';
  if (eye_selected_msrmnt) {
   const objReferrer = clients.find(c => c.a == eye_selected_msrmnt.ef);
   name_referrer = objReferrer ? ensureUTF(objReferrer.h + ' ' + objReferrer.i) : '';
  }

  let quanTotal = 0;
  let subtotal = 0;
  let taxTotal = 0;
  sCurrItems.forEach(item => {
   quanTotal += parseInt(item.h) || 0;
   subtotal += parseFloat(item.g) || 0;
   taxTotal += billItemTaxTotal(item);
  });
  taxTotal = Math.round(taxTotal * 100) / 100;
  const t_itms_otal = Math.round((subtotal + taxTotal) * 100) / 100;

  const discountAmt = (bill.k && parseFloat(bill.k)) ? parseFloat(bill.k) : 0;
  const advanceAmt = getTotalAmtRcvd(sCurrCashInfo);
  const dueAmt = (t_itms_otal - discountAmt - advanceAmt).toFixed(2);

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
  const cls = side === 'r' ? 'inv-right-eye' : 'inv-left-eye';

  return '<div class="inv-eye-card ' + cls + '">' +
   '<table class="inv-eye-table"><thead><tr>' +
   '<th class="inv-eye-corner">' + label + '</th>' +
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
  return '<section class="inv-eyes" data-layout="' + (vertical ? 'vertical' : 'horizontal') + '">' +
   eyeTableHTML('r', eye, vertical) +
   eyeTableHTML('l', eye, vertical) +
   '</section>';
 }

 function itemNameOf(d, item) {
  const foundITM = d.items.find(c => c.a == item.f);
  let itemName = '';
  if (foundITM && foundITM.gn && foundITM.gn != '.') itemName = multiline(foundITM.gn);
  if (item.i && item.i.length > 0) {
   const additionalText = multiline(item.i);
   itemName = itemName ? itemName + '<br>' + additionalText : additionalText;
  }
  return itemName;
 }

 function renderItems(d) {
  if (!d.sCurrItems.length) {
   return '<tr><td colspan="5" class="inv-empty">No items</td></tr>';
  }
  return d.sCurrItems.map((item, index) => {
   const qty = parseFloat(item.h) || 0;
   const amount = parseFloat(item.g) || 0;
   const price = qty ? amount / qty : 0;
   return '<tr>' +
    '<td class="inv-c">' + (index + 1) + '</td>' +
    '<td class="inv-item-name">' + itemNameOf(d, item) + '</td>' +
    '<td class="inv-r">' + item.h + '</td>' +
    '<td class="inv-r">' + price.toFixed(2) + '</td>' +
    '<td class="inv-r">' + amount.toFixed(2) + '</td>' +
    '</tr>';
  }).join('');
 }

 function receiptsTable(d) {
  const rows = d.sCurrCashInfo.map(receipt => {
   const date = receipt.k ? convertDateFormatToIndia(new Date(receipt.k)) : 'No Date';
   const amount = parseFloat(receipt.j || 0);
   return '<tr><td class="inv-l">' + date + '</td><td class="inv-r">' + amount.toFixed(2) + '</td></tr>';
  }).join('');
  return '<table class="inv-receipts"><thead><tr>' +
   '<th class="inv-l">Receipt Date</th><th class="inv-r">Amount</th>' +
   '</tr></thead><tbody>' + rows +
   '<tr class="inv-receipts-total"><td class="inv-l">Total Received</td><td class="inv-r">' + d.advanceAmt.toFixed(2) + '</td></tr>' +
   '</tbody></table>';
 }

 function detailRow(label, valueHTML) {
  return '<div class="inv-details-row"><label>' + label + '</label><span class="inv-value inv-detail-value">' + valueHTML + '</span></div>';
 }

 function renderInvoice(d, opts) {
  opts = opts || {};
  const c = d.clientConfig || {};
  const showAllReceipts = c.show_all_receipts == 1;
  const hasReceipts = showAllReceipts && d.sCurrCashInfo.length > 0;
  const verticalEyes = c.tbl_disp == 2;
  const amountInWords = price_in_words(d.t_itms_otal.toFixed(0));

  const company = plainText(c.printCompNm) || 'Company';
  const brand = brandParts(company);
  const tagline = plainText(c.printInvoice);
  const slogan = plainText(c.printSubjectTo);
  const address = plainText(c.printAdrs);
  const contact = plainText(c.printMo);

  const fullHeadLogo = c['logo-0_FullHead-1'] == 1 && !!c.print_logo;

  const logoHTML = c.print_logo
   ? '<div class="inv-logo"><img src="' + c.print_logo + '" alt="Logo"></div>'
   : '<div class="inv-logo"><span>' + initialsOf(company) + '</span></div>';

  const logoBandHTML = fullHeadLogo
   ? '<div class="inv-logo-band"><img src="' + c.print_logo + '" alt="Logo"></div>'
   : '';

  const headerHTML = fullHeadLogo
   ? logoBandHTML
   : '<header class="inv-header">' +
     logoHTML +
     (slogan ? '<div class="inv-slogan">' + slogan + '</div>' : '') +
     '<div class="inv-brand">' + brand.main + (brand.accent ? ' <span>' + brand.accent + '</span>' : '') + '</div>' +
     (tagline ? '<div class="inv-tagline">' + tagline + '</div>' : '') +
     (address ? '<div class="inv-address">' + address + '</div>' : '') +
     (contact ? '<div class="inv-contact"><div>' + contact + '</div></div>' : '') +
     '<div class="inv-title">INVOICE</div>' +
     '<div class="inv-copy">Original for Recipient</div>' +
     '</header>';

  const nameHTML = d.name_client
   ? '<span class="inv-hl inv-hl-name">' + d.name_client + '</span>'
   : '';
  const mobileHTML = d.mob_client
   ? '<span class="inv-hl inv-hl-mobile">' + d.mob_client + '</span>'
   : '';

  const receiverHTML = '<section class="inv-meta">' +
   '<div class="inv-party">' +
   '<div class="inv-section-title">Details of Receiver (Billed to &amp; Shipped to)</div>' +
   '<div class="inv-field"><label>' + labelOf(c.printPartyTtl, 'Name :') + '</label><span class="inv-value">' + nameHTML + '</span></div>' +
   (d.mob_client ? '<div class="inv-field"><label>' + labelOf(c.printMobTtl, 'Mobile :') + '</label><span class="inv-value">' + mobileHTML + '</span></div>' : '') +
   (d.addr_client ? '<div class="inv-field inv-address-fields"><label>' + labelOf(c.printAdrsTtl, 'Address :') + '</label><span class="inv-value">' + d.addr_client + '</span></div>' : '') +
   (d.name_referrer ? '<div class="inv-field"><label>' + labelOf(c.printRefByTtl, 'Referred by :') + '</label><span class="inv-value">' + d.name_referrer + '</span></div>' : '') +
   '</div>' +
   '<div class="inv-details">' +
   detailRow(labelOf(c.printPavtiTtl, 'Invoice no. :'), '<span class="inv-no">' + d.curr_bill_info.g + '</span>') +
   detailRow(labelOf(c.printBilDtTtl, 'Date :'), d.billDate) +
   (d.deliveryDate ? detailRow(labelOf(c.printDeliveryDtTtl, 'Delivery :'), d.deliveryDate) : '') +
   '</div></section>';

  const eyeHTML = renderEyeSection(d.eye_selected_msrmnt, verticalEyes);

  const itemsHTML = '<div class="inv-items-wrap">' +
   '<table class="inv-items">' +
   '<colgroup><col class="inv-c-sr"><col class="inv-c-desc"><col class="inv-c-qty"><col class="inv-c-rate"><col class="inv-c-amt"></colgroup>' +
   '<thead><tr>' +
   '<th class="inv-c">Sr. No.</th>' +
   '<th class="inv-l">Description of Goods / Services</th>' +
   '<th class="inv-c">Qty.</th>' +
   '<th class="inv-c">Rate</th>' +
   '<th class="inv-c">Amount</th>' +
   '</tr></thead>' +
   '<tbody>' + renderItems(d) + '</tbody>' +
   '<tfoot><tr class="inv-filler"><td colspan="5"><div class="inv-filler-box"></div></td></tr></tfoot>' +
   '</table></div>';

  const discountRow = d.discountAmt != 0
   ? '<div class="inv-total-row"><div class="inv-total-label">Discount</div><div class="inv-total-value">' + d.discountAmt.toFixed(2) + '</div></div>'
   : '';

  const receivedRow = hasReceipts
   ? ''
   : '<div class="inv-total-row"><div class="inv-total-label">' + labelOf(c.printAdvAmtTtl, 'Received') + '</div><div class="inv-total-value inv-received-bg">' + d.advanceAmt.toFixed(2) + '</div></div>';

  const taxRow = d.taxTotal > 0
   ? '<div class="inv-total-row"><div class="inv-total-label">Tax</div><div class="inv-total-value">' + d.taxTotal.toFixed(2) + '</div></div>'
   : '';

  const totalsHTML = '<div class="inv-totals">' +
   (hasReceipts ? receiptsTable(d) : '') +
   taxRow +
   '<div class="inv-total-row"><div class="inv-total-label">' + labelOf(c.printTxAmtTtl, 'Total') + '</div><div class="inv-total-value inv-total-bg">' + d.t_itms_otal.toFixed(2) + '</div></div>' +
   discountRow +
   receivedRow +
   '<div class="inv-total-row inv-grand-total"><div class="inv-total-label">Due Amt :</div><div class="inv-total-value">' + d.dueAmt + '</div></div>' +
   '</div>';

  const terms = [
   'This invoice is valid only when duly signed and/or stamped by an authorised representative of ' + company + '.',
   'Please verify the amount in words and figures before making payment.',
   'Any correction, alteration or overwriting must be authenticated by the authorised signatory.',
   'Goods/services once supplied are subject to the agreed terms of the order/work confirmation.',
   'Any dispute relating to this invoice shall be subject to the mutually agreed terms and applicable law.'
  ];
  const termsHTML = terms.map(t => '<li>' + t + '</li>').join('');

  const bottomHTML = '<section class="inv-bottom">' +
   '<div class="inv-bottom-left">' +
   '<div class="inv-words"><div>Rs. in Words :</div><div class="inv-words-value">' + amountInWords + '</div></div>' +
   '<div class="inv-terms"><div class="inv-terms-title">Terms &amp; Condition :</div><ol>' + termsHTML + '</ol></div>' +
   '</div>' +
   totalsHTML +
   '</section>';

  const remarksHTML = d.remark
   ? '<div class="inv-remarks"><b>Note: </b>' + d.remark + '</div>'
   : '';

  const footerLeft = plainText(c.printFooterLeft) || 'Received Signature';
  const footerCertification = plainText(c.printFooterCertification) || 'Certified that the particulars given above are true and correct.';
  const footerAuthorised = plainText(c.printFooterAuthorised) || 'Authorised Signatory';
  const footerFor = plainText(c.printForTtl) || ('For ' + company);

  const footerHTML = '<footer class="inv-footer">' +
   '<div class="inv-signature">' + footerLeft + '</div>' +
   '<div class="inv-signature">' +
   '<div class="inv-certification">' + footerCertification + '</div>' +
   '<div class="inv-company-sign">' + footerFor + '</div>' +
   footerAuthorised +
   '</div>' +
   '</footer>';

  // Returns the inner content only; the shell already provides the single
  // #beprDoc element, which is styled as the invoice page.
  return headerHTML + receiverHTML + eyeHTML + itemsHTML + bottomHTML + remarksHTML + footerHTML;
 }

 /* ============================ 6. THEME ============================ */

 const RANGE_LIMITS = {
  logoHeaderGap: [0, 60],
  fullHeadLogoHeight: [20, 200],
  footerPadding: [0, 20],
  clientDetailsGap: [0, 40],
  eyeTablesGap: [0, 40],
  billItemsGap: [0, 40],
  tdSpacing: [0, 10],
  nameMobileFontSize: [8, 28]
 };

 function applyTheme(doc, style) {
  const s = Object.assign({}, DEFAULT_STYLE, style || {});
  const set = (k, v) => doc.style.setProperty(k, v);
  set('--inv-gap-logo', px(s.logoHeaderGap));
  set('--inv-logo-height', px(s.fullHeadLogoHeight));
  set('--inv-footer-pad', px(s.footerPadding));
  set('--inv-gap-client', px(s.clientDetailsGap));
  set('--inv-gap-eyes', px(s.eyeTablesGap));
  set('--inv-gap-items', px(s.billItemsGap));
  set('--inv-cell-pad', px(s.tdSpacing));
  set('--inv-name-size', px(s.nameMobileFontSize));
  set('--inv-ink', s.inkColor);
  set('--inv-brand', s.brandColor);
  set('--inv-accent', s.accentColor);
  set('--inv-grand', s.grandTotalColor);
  set('--inv-name-bg', s.nameBgColor);
  set('--inv-mobile-bg', s.mobileBgColor);
  set('--inv-no-bg', s.invoiceNoBgColor);
  set('--inv-total-bg', s.totalAmtBgColor);
  set('--inv-received-bg', s.receivedAmtBgColor);
  set('--inv-left-eye-bg', s.leftEyeTableBgColor);
  set('--inv-right-eye-bg', s.rightEyeTableBgColor);
  set('--inv-footer-bg', s.footerBgColor);
  set('--inv-footer-ink', s.footerTextColor);
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

 function previewAvailableWidth(refs) {
  const viewport = refs.viewport;
  if (!viewport || viewport.clientWidth < 60) return 0;
  const cs = getComputedStyle(viewport);
  const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
  return Math.max(80, viewport.clientWidth - padX);
 }

 // Sizes the sheet for the current preview mode.
 //  - desktop: fixed paper size (mm -> px); the sheet is scaled to fit.
 //  - mobile : the sheet reflows to the preview width at readable type sizes.
 // The mobile class lives on #beprPaper (preview only); print/export clones
 // #beprDoc, so the printed invoice always keeps the real paper dimensions.
 function layoutPaper(refs, settings, mobile, avail) {
  const paper = resolvePaper(settings);
  const paperW = mmToPx(paper.w);
  const paperH = mmToPx(paper.h);
  const fit = settings.fitToPage !== false;

  refs.previewMode = mobile ? 'mobile' : 'desktop';
  refs.paper.classList.toggle('bepr-mobile', mobile);

  if (mobile) {
   refs.paper.style.width = avail + 'px';
   refs.paper.style.height = 'auto';
   refs.content.style.width = '100%';
   refs.content.style.height = 'auto';
   refs.content.style.overflow = 'visible';
   refs.doc.style.height = 'auto';
   refs.doc.style.minHeight = '0';
   refs.doc.style.overflow = 'visible';
  } else {
   refs.paper.style.width = paperW + 'px';
   refs.paper.style.height = paperH + 'px';
   refs.content.style.width = '';
   refs.content.style.height = '';

   if (fit) {
    refs.content.style.width = '100%';
    refs.content.style.height = '100%';
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
   }
   refs.content.style.overflow = 'hidden';
   refs.doc.style.height = fit ? '100%' : 'auto';
   refs.doc.style.minHeight = fit ? '100%' : '0';
   refs.doc.style.overflow = '';
  }

  applyPosition(refs.stage, settings.position);

  const eyeSection = refs.doc.querySelector('.inv-eyes');
  if (eyeSection) eyeSection.style.display = settings.printEyeMeasurements === false ? 'none' : '';

  const remarks = refs.doc.querySelector('.inv-remarks');
  if (remarks) remarks.style.display = settings.showRemarks === false ? 'none' : '';
 }

 function applyPaper(refs, settings) {
  refs.settings = settings;
  const avail = previewAvailableWidth(refs);
  const mobile = avail > 0 && avail < MOBILE_PREVIEW_BREAKPOINT;
  layoutPaper(refs, settings, mobile, avail);
  fitPreview(refs);
 }

 function fitPreview(refs) {
  if (!refs.viewport || !refs.paper) return;
  const avail = previewAvailableWidth(refs);
  if (!avail) return;

  const mobile = avail < MOBILE_PREVIEW_BREAKPOINT;
  const settings = refs.settings || paperSettings();
  const currentWidth = parseFloat(refs.paper.style.width) || 0;

  // Re-layout when the mode changes or the available width moved enough to
  // matter in mobile flow mode.
  if (!refs.previewMode || mobile !== (refs.previewMode === 'mobile') || (mobile && Math.abs(currentWidth - avail) > 0.5)) {
   layoutPaper(refs, settings, mobile, avail);
  }

  const paperW = refs.paper.offsetWidth || 1;
  const paperH = refs.paper.offsetHeight || 1;
  const zoom = refs.zoom || 1;

  if (mobile) {
   // Mobile flow layout is already at readable size: Fit = 100% width.
   refs.paper.style.transform = zoom === 1 ? '' : 'scale(' + zoom + ')';
   refs.paper.style.transformOrigin = 'top left';
   refs.spacer.style.width = (paperW * zoom) + 'px';
   refs.spacer.style.height = (paperH * zoom) + 'px';
   return;
  }

  // Desktop: fit the sheet to the viewport, never enlarge past natural size.
  const MAX_FIT_SCALE = 1;
  const fitScale = Math.min(avail / paperW, MAX_FIT_SCALE);
  let scale = fitScale * zoom;
  scale = Math.max(0.1, Math.min(scale, 6));

  refs.paper.style.transform = 'scale(' + scale + ')';
  refs.paper.style.transformOrigin = 'top left';
  refs.spacer.style.width = (paperW * scale) + 'px';
  refs.spacer.style.height = (paperH * scale) + 'px';
 }

 /* ========================= 8. SHELL HTML ========================= */

 const SHELL_HTML = '<div class="bepr-shell">' +
  '<div class="bepr-toolbar">' +
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
   instance.hide();
   createToast('Style settings saved', 'success');
  });

  modal.modalElement.addEventListener('hidden.bs.modal', () => {
   if (!saved) applyTheme(refs.doc, refs.currentStyle || styleSettings());
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
  const dim = num(s.printDimension, 100);
  let wmm, hmm;

  if (fit) {
   wmm = paper.w;
   hmm = paper.h;
  } else {
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
  wrap.style.cssText = 'position:fixed;top:0;left:0;width:' + wmm + 'mm;min-height:' + hmm + 'mm;background:#ffffff;z-index:-1;pointer-events:none;';

  const clone = refs.doc.cloneNode(true);
  clone.style.width = '100%';
  clone.style.height = 'auto';
  clone.style.minHeight = hmm + 'mm';
  clone.style.overflow = 'visible';
  clone.style.boxSizing = 'border-box';

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
     console.log('bePr3: share failed, falling back to download', shareError);
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
   console.error('bePr3: image export failed', err);
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
.bepr-viewport { flex:1; min-height:0; overflow:auto; padding:16px; display:flex; align-items:flex-start; justify-content:flex-start; background:#eef1f5; }
.bepr-spacer { position:relative; flex:0 0 auto; margin:0 auto; }
.bepr-paper { position:absolute; top:0; left:0; background:#fff; box-shadow:0 6px 28px rgba(0,0,0,.18); transform-origin:top left; }
.bepr-stage { position:absolute; inset:0; display:flex; overflow:hidden; }
.bepr-content { background:#fff; overflow:hidden; }

/* ------------------- mobile preview (preview only) -------------------
   Below the readability breakpoint the sheet reflows to the viewport
   width with readable type instead of being shrunk. This class is applied
   to the preview paper only; print/export clones #beprDoc and keeps A4. */
.bepr-paper.bepr-mobile { position:relative; top:auto; left:auto; height:auto; min-height:0; box-shadow:0 4px 16px rgba(0,0,0,.16); }
.bepr-paper.bepr-mobile .bepr-stage { position:relative; inset:auto; display:block; overflow:visible; }
.bepr-paper.bepr-mobile .bepr-content { width:100%; height:auto; overflow:visible; }
.bepr-paper.bepr-mobile #beprDoc { width:100%; height:auto; min-height:0; overflow:visible; padding:10px 12px; font-size:10px; overflow-wrap:anywhere; }

.bepr-paper.bepr-mobile #beprDoc .inv-header { padding-bottom:calc(4px + var(--inv-gap-logo,0px)); }
.bepr-paper.bepr-mobile #beprDoc .inv-brand { font-size:clamp(17px,5vw,20px); }
.bepr-paper.bepr-mobile #beprDoc .inv-tagline { font-size:8.5px; letter-spacing:2px; }
.bepr-paper.bepr-mobile #beprDoc .inv-slogan { width:94px; max-width:40%; padding:4px; font-size:7px; }
.bepr-paper.bepr-mobile #beprDoc .inv-logo { width:42px; height:42px; font-size:6px; }
.bepr-paper.bepr-mobile #beprDoc .inv-address { margin-top:4px; font-size:9px; }
.bepr-paper.bepr-mobile #beprDoc .inv-contact { font-size:7.5px; gap:6px; margin-top:4px; }
.bepr-paper.bepr-mobile #beprDoc .inv-title { font-size:14px; }
.bepr-paper.bepr-mobile #beprDoc .inv-copy { position:static; display:inline-block; margin-top:4px; font-size:7.5px; }

.bepr-paper.bepr-mobile #beprDoc .inv-section-title { padding:4px; font-size:9px; }
.bepr-paper.bepr-mobile #beprDoc .inv-field { min-height:22px; padding:3px 4px; gap:3px; }
.bepr-paper.bepr-mobile #beprDoc .inv-value { min-height:13px; }
.bepr-paper.bepr-mobile #beprDoc .inv-address-fields .inv-value { min-height:22px; }
.bepr-paper.bepr-mobile #beprDoc .inv-details-row { min-height:26px; padding:3px 4px; gap:4px; }
.bepr-paper.bepr-mobile #beprDoc .inv-hl { font-size:calc(var(--inv-name-size,14px) * 0.85); }

.bepr-paper.bepr-mobile #beprDoc .inv-eyes { gap:5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-eye-table { font-size:7.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-eye-table th,
.bepr-paper.bepr-mobile #beprDoc .inv-eye-table td { padding:calc(1px + var(--inv-cell-pad,1px)) 1px; }
.bepr-paper.bepr-mobile #beprDoc .inv-eye-corner { width:16%; }

.bepr-paper.bepr-mobile #beprDoc .inv-items-wrap { min-height:0; }
.bepr-paper.bepr-mobile #beprDoc .inv-items { font-size:8.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-items th { font-size:8.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-items th,
.bepr-paper.bepr-mobile #beprDoc .inv-items td { padding:3px 2px; }
.bepr-paper.bepr-mobile #beprDoc .inv-items .inv-filler-box { min-height:18mm; }

.bepr-paper.bepr-mobile #beprDoc .inv-words { min-height:28px; padding:4px 5px; font-size:8.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-words-value { min-height:12px; margin-top:3px; }
.bepr-paper.bepr-mobile #beprDoc .inv-terms { padding:4px 5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-terms-title { font-size:8.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-terms ol { font-size:7px; padding-left:11px; }
.bepr-paper.bepr-mobile #beprDoc .inv-total-row { min-height:20px; }
.bepr-paper.bepr-mobile #beprDoc .inv-total-label,
.bepr-paper.bepr-mobile #beprDoc .inv-total-value { padding:3px; }
.bepr-paper.bepr-mobile #beprDoc .inv-grand-total { min-height:28px; }
.bepr-paper.bepr-mobile #beprDoc .inv-receipts { font-size:7.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-remarks { padding:3px 5px; font-size:7.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-footer { min-height:48px; }
.bepr-paper.bepr-mobile #beprDoc .inv-signature { padding:4px; font-size:8px; }
.bepr-paper.bepr-mobile #beprDoc .inv-certification { font-size:6.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-company-sign { font-size:9px; margin-bottom:6px; }

/* ------------------------- invoice sheet ------------------------- */
#beprDoc {
 position:relative;
 width:100%;
 box-sizing:border-box;
 padding:4.2%;
 background:#fff;
 color:#17213e;
 font-family:Arial,Helvetica,sans-serif;
 font-size:11px;
 line-height:1.35;
 display:flex;
 flex-direction:column;
 overflow:auto;
}
#beprDoc .inv-header { position:relative; text-align:center; border-bottom:1px solid var(--inv-ink,#26385e); padding:2px 4px calc(6px + var(--inv-gap-logo,0px)); flex:0 0 auto; }
#beprDoc .inv-brand { color:var(--inv-brand,#31558f); font-size:24px; font-weight:900; line-height:1.12; overflow-wrap:anywhere; }
#beprDoc .inv-brand span { color:var(--inv-accent,#319bd4); }
#beprDoc .inv-tagline { margin-top:2px; color:var(--inv-brand,#31558f); font-size:10.5px; font-weight:700; letter-spacing:3px; text-transform:uppercase; }
#beprDoc .inv-slogan { position:absolute; top:0; right:0; width:33%; max-width:150px; padding:5px; background:var(--inv-ink,#17213e); color:#fff; font-size:7.5px; font-weight:700; line-height:1.3; text-align:right; clip-path:polygon(0 0,100% 0,100% 100%); }
#beprDoc .inv-logo { position:absolute; left:0; top:2px; width:52px; height:52px; border:2px solid var(--inv-brand,#31558f); border-radius:50%; display:flex; align-items:center; justify-content:center; text-align:center; padding:4px; color:var(--inv-brand,#31558f); font-size:8px; font-weight:700; overflow:hidden; }
#beprDoc .inv-logo img { width:100%; height:100%; object-fit:contain; border-radius:50%; }
#beprDoc .inv-logo-band { flex:0 0 auto; width:100%; height:var(--inv-logo-height,52px); margin:0; box-sizing:border-box; overflow:hidden; border:2px solid var(--inv-brand,#31558f); border-radius:2px; display:flex; align-items:center; justify-content:center; text-align:center; color:var(--inv-brand,#31558f); font-size:10px; font-weight:700; }
#beprDoc .inv-logo-band img { display:block; width:100%; height:100%; object-fit:contain; }
#beprDoc .inv-logo-band + .inv-meta { border-top:1px solid var(--inv-ink,#26385e); margin-top:4px; }
#beprDoc .inv-address { margin-top:5px; font-size:9.5px; }
#beprDoc .inv-contact { display:flex; justify-content:space-between; gap:8px; margin-top:5px; color:var(--inv-brand,#31558f); font-size:8px; }
#beprDoc .inv-title { margin:2px 0 0; font-size:15px; font-weight:900; letter-spacing:1px; }
#beprDoc .inv-copy { position:absolute; right:0; bottom:24px; border:1px solid var(--inv-ink,#26385e); padding:2px 4px; font-size:7px; text-align:left; line-height:1.3; }

#beprDoc .inv-meta { display:grid; grid-template-columns:1.05fr 1fr; border:1px solid var(--inv-ink,#26385e); border-top:0; flex:0 0 auto; }
#beprDoc .inv-party { border-right:1px solid var(--inv-ink,#26385e); min-width:0; }
#beprDoc .inv-section-title { padding:4px 6px; font-weight:700; font-size:9.5px; border-bottom:1px solid var(--inv-ink,#26385e); }
#beprDoc .inv-field { display:flex; align-items:flex-end; gap:4px; min-height:calc(18px + var(--inv-gap-client,0px)); padding:3px 6px; }
#beprDoc .inv-field label { flex-shrink:0; white-space:nowrap; }
#beprDoc .inv-value { flex:1; min-width:0; min-height:14px; border-bottom:1px solid var(--inv-ink,#26385e); overflow-wrap:anywhere; padding-bottom:1px; }
#beprDoc .inv-address-fields { align-items:flex-start; }
#beprDoc .inv-address-fields .inv-value { min-height:26px; }
#beprDoc .inv-details { min-width:0; }
#beprDoc .inv-details-row { display:flex; align-items:center; gap:6px; min-height:calc(30px + var(--inv-gap-client,0px)); padding:4px 6px; border-bottom:1px solid var(--inv-ink,#26385e); }
#beprDoc .inv-details-row:last-child { border-bottom:0; }
#beprDoc .inv-details-row label { flex-shrink:0; }
#beprDoc .inv-detail-value { min-height:0; border-bottom:0; }
#beprDoc .inv-no { display:inline-block; padding:0 4px; border-radius:2px; background:var(--inv-no-bg,#f0f0f0); font-weight:700; }
#beprDoc .inv-hl { display:inline-block; padding:0 4px; border-radius:2px; font-size:var(--inv-name-size,14px); line-height:1.25; }
#beprDoc .inv-hl-name { background:var(--inv-name-bg,#f0f0f0); }
#beprDoc .inv-hl-mobile { background:var(--inv-mobile-bg,#f0f0f0); }

#beprDoc .inv-eyes { display:grid; gap:6px; margin:var(--inv-gap-eyes,0px) 0; flex:0 0 auto; }
#beprDoc .inv-eyes[data-layout="horizontal"] { grid-template-columns:1fr 1fr; }
#beprDoc .inv-eyes[data-layout="vertical"] { grid-template-columns:1fr; }
#beprDoc .inv-eye-card { border:1px solid var(--inv-ink,#26385e); min-width:0; }
#beprDoc .inv-left-eye { background:var(--inv-left-eye-bg,#fff); }
#beprDoc .inv-right-eye { background:var(--inv-right-eye-bg,#fff); }
#beprDoc .inv-eye-table { width:100%; border-collapse:collapse; font-size:8.5px; table-layout:fixed; }
#beprDoc .inv-eye-table th, #beprDoc .inv-eye-table td { border:1px solid var(--inv-ink,#26385e); padding:calc(1px + var(--inv-cell-pad,1px)) 2px; text-align:center; overflow-wrap:anywhere; }
#beprDoc .inv-eye-table thead th, #beprDoc .inv-eye-table tfoot th { background:#eef3fb; color:var(--inv-brand,#31558f); font-weight:600; }
#beprDoc .inv-eye-corner { width:14%; }

#beprDoc .inv-items-wrap { flex:1 1 auto; min-height:40px; margin-top:var(--inv-gap-items,0px); display:flex; }
#beprDoc .inv-items { width:100%; border-collapse:collapse; table-layout:fixed; font-size:9.5px; height:100%; }
#beprDoc .inv-items th, #beprDoc .inv-items td { border:1px solid var(--inv-ink,#26385e); padding:calc(2px + var(--inv-cell-pad,1px)) 3px; overflow-wrap:anywhere; }
#beprDoc .inv-items th { color:var(--inv-brand,#31558f); font-size:9.5px; text-align:center; vertical-align:middle; }
#beprDoc .inv-items td { vertical-align:top; }
#beprDoc .inv-items .inv-c-sr { width:6%; }
#beprDoc .inv-items .inv-c-desc { width:52%; }
#beprDoc .inv-items .inv-c-qty { width:9%; }
#beprDoc .inv-items .inv-c-rate { width:14%; }
#beprDoc .inv-items .inv-c-amt { width:19%; }
#beprDoc .inv-items .inv-filler { height:100%; }
#beprDoc .inv-items .inv-filler td { padding:0; }
#beprDoc .inv-items .inv-filler-box { min-height:24mm; }
#beprDoc .inv-item-name { text-align:left; }
#beprDoc .inv-empty { padding:8px !important; text-align:center; color:#666; }

#beprDoc .inv-c { text-align:center; }
#beprDoc .inv-r { text-align:right; }
#beprDoc .inv-l { text-align:left; }

#beprDoc .inv-bottom { display:grid; grid-template-columns:59% 41%; border:1px solid var(--inv-ink,#26385e); border-top:0; flex:0 0 auto; }
#beprDoc .inv-bottom-left { border-right:1px solid var(--inv-ink,#26385e); min-width:0; }
#beprDoc .inv-words { min-height:34px; padding:5px 6px; border-bottom:1px solid var(--inv-ink,#26385e); font-size:9px; }
#beprDoc .inv-words-value { margin-top:4px; min-height:13px; border-bottom:1px solid var(--inv-ink,#26385e); font-style:italic; overflow-wrap:anywhere; }
#beprDoc .inv-terms { padding:5px 6px; }
#beprDoc .inv-terms-title { font-size:9px; font-weight:700; margin-bottom:2px; }
#beprDoc .inv-terms ol { margin:0; padding-left:12px; font-size:6.8px; line-height:1.45; }
#beprDoc .inv-totals { min-width:0; }
#beprDoc .inv-total-row { display:grid; grid-template-columns:55% 45%; min-height:22px; border-bottom:1px solid var(--inv-ink,#26385e); }
#beprDoc .inv-total-row:last-child { border-bottom:0; }
#beprDoc .inv-total-label, #beprDoc .inv-total-value { padding:4px; text-align:center; overflow-wrap:anywhere; }
#beprDoc .inv-total-label { border-right:1px solid var(--inv-ink,#26385e); }
#beprDoc .inv-total-value { text-align:right; padding-right:8px; font-weight:700; }
#beprDoc .inv-grand-total { min-height:36px; align-items:center; color:var(--inv-grand,#9c2e3b); font-weight:700; }
#beprDoc .inv-total-bg { background:var(--inv-total-bg,#f0f0f0); }
#beprDoc .inv-received-bg { background:var(--inv-received-bg,#f0f0f0); }
#beprDoc .inv-receipts { width:100%; border-collapse:collapse; font-size:8px; }
#beprDoc .inv-receipts th, #beprDoc .inv-receipts td { border:1px solid var(--inv-ink,#26385e); padding:2px 3px; }
#beprDoc .inv-receipts th { background:#eef3fb; color:var(--inv-brand,#31558f); }
#beprDoc .inv-receipts-total td { font-weight:700; }

#beprDoc .inv-remarks { border:1px solid var(--inv-ink,#26385e); border-top:0; padding:3px 6px; font-size:8px; flex:0 0 auto; }

#beprDoc .inv-footer { display:grid; grid-template-columns:50% 50%; box-sizing:border-box; border:1px solid var(--inv-ink,#26385e); border-top:0; min-height:58px; flex:0 0 auto; background-color:var(--inv-footer-bg,#626cf7); color:var(--inv-footer-ink,#fff); padding:var(--inv-footer-pad,6px); text-align:center; }
#beprDoc .inv-signature { display:flex; flex-direction:column; justify-content:flex-end; align-items:center; padding:5px; font-size:9px; font-weight:700; text-align:center; }
#beprDoc .inv-certification { text-align:center; font-size:7.2px; font-weight:400; margin-bottom:3px; }
#beprDoc .inv-company-sign { color:var(--inv-footer-ink,#fff); font-size:10.5px; font-weight:900; margin-bottom:9px; text-transform:uppercase; }

/* ------------------------- modals ------------------------- */
.bepr-modal-body { padding:16px; }
.bepr-modal-title { margin:0 0 10px; font-size:14px; }
.bepr-fields { display:grid; gap:10px; }
.bepr-field { display:flex; flex-direction:column; gap:4px; font-size:12px; color:#495057; margin:0 0 10px; }
.bepr-field input[type="number"], .bepr-field select { width:100%; padding:7px 9px; border:1px solid #ced4da; border-radius:6px; font-size:13px; }
.bepr-field input[type="range"] { width:100%; }
.bepr-out { color:#0d6efd; }
.bepr-color-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:10px; }
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
  if (document.getElementById('bepr3-styles')) return;
  const style = document.createElement('style');
  style.id = 'bepr3-styles';
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
    console.warn('bePr3: html2canvas could not be loaded; image export may be unavailable.', loadErr);
   }

   ensureStyles();
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
   console.error('bePr3: sho_bepr_mdl failed', error);
   createToast('Could not open invoice: ' + error.message, 'danger');
   throw error;
  } finally {
   loader.removeLoader();
  }
 }

 /* ============================ 14. EXPOSE ============================ */

 // Keep any mappings/presets registered before this file loaded.
 if (window.BILL_THEME_MAP) Object.assign(THEME_MAP, window.BILL_THEME_MAP);
 if (window.BILL_THEME_PRESETS) Object.assign(THEME_PRESETS, window.BILL_THEME_PRESETS);

 window.sho_bepr_mdl = sho_bepr_mdl;
 window.BILL_THEME_PRESETS = THEME_PRESETS;
 window.BILL_THEME_MAP = THEME_MAP;
 window.getBillThemeSettings = themeFor;

})();
