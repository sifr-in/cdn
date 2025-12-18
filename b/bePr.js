async function sho_bepr_mdl(...params) {
 const result1 = await loadCshScriptsSequentially(6, 7);
 const modalId = 'beprModal';
 // Create and show loader
 const loader = createDynamicLoader('Loading invoice data...');

 try {
  // Create modal dynamically
  const { contentElement, modalInstance, modalElement } = create_modal_dynamically(modalId);

  // Set modal size to fullscreen for better preview
  modalElement.querySelector('.modal-dialog').classList.add('modal-fullscreen');

  // Create modal content structure
  contentElement.innerHTML = `
<style>
/* Preview system */
.preview-system {
display: flex;
flex-direction: column;
height: 100%;
}

.preview-controls {
background: white;
padding: 15px;
border-bottom: 1px solid #dee2e6;
z-index: 100;
flex-shrink: 0;
display: flex;
justify-content: space-between;
align-items: center;
}

.controls-left, .controls-right {
display: flex;
align-items: center;
gap: 10px;
}

.preview-display {
flex: 1;
overflow: auto;
padding: 20px;
display: flex;
justify-content: center;
align-items: flex-start;
background: #f8f9fa;
/* Add these for horizontal scrolling */
overflow-x: auto;
overflow-y: auto;
-webkit-overflow-scrolling: touch;
/* Enable pinch zoom on mobile */
touch-action: manipulation;
-webkit-user-scalable: yes;
user-scalable: yes;
}

.preview-container {
background: white;
border: 1px solid #ddd;
box-shadow: 0 4px 20px rgba(0,0,0,0.1);
overflow: auto;
transition: all 0.3s ease;
/* Paper background */
background-image: 
linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
background-size: 20px 20px;
background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

/* Single preview container */
#previewMain {
display: block;
position: relative;
}

.paper-background {
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
border: 1px dashed #ccc;
pointer-events: none;
}

.print-content-area {
position: absolute;
background: white;
border: 2px solid #0d6efd;
box-shadow: 0 0 10px rgba(13, 110, 253, 0.3);
box-sizing: border-box;
overflow: hidden;
}

.invoice-preview {
font-family: Arial, sans-serif;
color: #000;
width: 100%;
height: 100%;
box-sizing: border-box;
background: white;
overflow: auto;
padding: 15px;
}

/* Control buttons */
.action-btn {
display: flex;
align-items: center;
gap: 6px;
padding: 8px 12px;
}

/* Config modal styles */
.config-form-group {
margin-bottom: 20px;
}

.config-form-group label {
display: block;
margin-bottom: 8px;
font-weight: 500;
}

.config-form-group select,
.config-form-group input {
width: 100%;
padding: 10px;
border: 1px solid #ddd;
border-radius: 6px;
font-size: 14px;
}

.dimensions-row {
display: flex;
gap: 15px;
}

.dimensions-row .form-group {
flex: 1;
position: relative;
}

.unit-label {
position: absolute;
right: 10px;
top: 50%;
transform: translateY(-50%);
color: #666;
font-size: 12px;
pointer-events: none;
}

.paper-info {
font-size: 12px;
color: #666;
margin-top: 5px;
font-style: italic;
}

.position-grid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 8px;
margin-top: 10px;
}

.position-btn {
padding: 12px;
border: 2px solid #dee2e6;
background: #f8f9fa;
cursor: pointer;
text-align: center;
border-radius: 6px;
transition: all 0.2s;
font-size: 12px;
}

.position-btn:hover {
background: #e9ecef;
border-color: #adb5bd;
}

.position-btn.active {
background: #0d6efd;
color: white;
border-color: #0d6efd;
}

.config-section {
background: #f8f9fa;
padding: 15px;
border-radius: 8px;
margin-bottom: 20px;
}

.config-section h6 {
margin-bottom: 15px;
color: #495057;
border-bottom: 1px solid #dee2e6;
padding-bottom: 8px;
}

.dimension-option {
display: flex;
gap: 10px;
margin-bottom: 10px;
}

.dimension-option input[type="radio"] {
width: auto;
margin-top: 2px;
}

.dimension-inputs {
margin-top: 10px;
}

.dimension-field {
margin-bottom: 15px;
}

.dimension-field.disabled input {
background-color: #e9ecef;
cursor: not-allowed;
opacity: 0.6;
}

.calculate-btn {
margin-top: 10px;
}
</style>

<div class="preview-system">
<div class="preview-controls">
<div class="controls-left">
<h5 class="mb-0">Invoice Preview & Export</h5>
</div>
</div>
<div class="preview-controls">
<div class="controls-right">
<button class="btn btn-outline-primary action-btn" id="configBtn">
<i class="fas fa-cog"></i>
</button>

<button class="btn btn-outline-secondary action-btn" id="styleConfigBtn">
<i class="fas fa-palette"></i>
</button>

<button class="btn btn-success action-btn" id="downloadCurrentImage">
<i class="fas fa-image"></i>
</button>

<a id="modalWhatsappLink" href="#" target="_blank" class="btn btn-success action-btn">
<i class="fab fa-whatsapp"></i>
</a>
</div>
</div>

<div class="preview-display">
<!-- Single preview container with paper background and print area -->
<div id="previewMain" class="preview-container">
<div class="paper-background" id="paperBackground"></div>
<div class="print-content-area" id="printContentArea">
<div class="invoice-preview" id="invoiceContentMain"></div>
</div>
</div>
</div>

<div class="preview-controls border-top">
<div class="container-fluid">
<div class="row">
<div class="col-12 text-center">
<button type="button" class="btn btn-secondary btn-lg" data-bs-dismiss="modal">
<i class="fas fa-times"></i> Close
</button>
</div>
</div>
</div>
</div>
</div>
`;

  // Initialize modal
  modalInstance.show();

  // Remove loader
  loader.removeLoader();

  // Load invoice data into preview container
  await loadInvoiceData(params[0], modalElement);

  // Initialize preview system
  initializePreviewSystem(modalElement, modalInstance);

  // Apply initial paper settings
  applyPaperSettings(modalElement);

  return modalInstance;

 } catch (error) {
  console.error("Error in sho_bepr_mdl:", error);
  loader.removeLoader();
  throw error;
 }
}

// Helper function to load invoice data into preview container
async function loadInvoiceData(billId, modalElement) {
 try {
  const stored_bill = await dbDexieManager.getAllRecords(dbnm, "b") || [];
  if (!stored_bill.length) throw new Error("No bills data available");

  const curr_bill_info = stored_bill.find(c => c.a == billId);
  if (!curr_bill_info) throw new Error("Bill info not found");
  if (!curr_bill_info.g) throw new Error("Bill information incomplete");

  // Get all data
  const clientReferrerArray = await dbDexieManager.getAllRecords(dbnm, "c") || [];
  const info = clientReferrerArray.find(i => i.a == curr_bill_info.e);
  const name_client = info ? ensureUTF(info.h + " " + info.i) : null;
  const mob_client = info ? info.e : null;
  const addr_client = info ? ensureUTF(info.m) : null;
  const items = await dbDexieManager.getAllRecords(dbnm, "s") || [];
  const stored_eye_msrmnt = await dbDexieManager.getAllRecords(dbnm, "be") || [];
  const eye_selected_msrmnt = stored_eye_msrmnt.find(item => item.ea == billId);
  const stored_bill_items = await dbDexieManager.getAllRecords(dbnm, "i") || [];
  const sCurrItems = stored_bill_items.filter(item => item.e == billId);
  const stored_bill_cash_info = await dbDexieManager.getAllRecords(dbnm, "r") || [];
  const sCurrCashInfo = stored_bill_cash_info.filter(item => item.td == billId && item.tb == 7);

  // Get referrer name
  let name_referrer = "";
  if (eye_selected_msrmnt) {
   const objReferrer = clientReferrerArray.find(i => i.a == eye_selected_msrmnt.ef);
   name_referrer = objReferrer ? ensureUTF(objReferrer.h + " " + objReferrer.i) : "";
  }

  // Calculate totals
  let quanTotal = 0;
  let t_itms_otal = 0;
  const advanceAmt = getTotalAmtRcvd(sCurrCashInfo);

  sCurrItems.forEach(item => {
   quanTotal += parseInt(item.h);
   t_itms_otal += parseFloat(item.g);
  });

  // Handle discount
  let discountAmt = 0.0;
  if (curr_bill_info.k && parseFloat(curr_bill_info.k)) {
   discountAmt = parseFloat(curr_bill_info.k);
  }
  const dueAmt = (t_itms_otal - discountAmt - advanceAmt).toFixed(2);

  // Handle remarks and delivery date
  let t1682 = null;
  let deliveryDate = "";
  if (curr_bill_info.i) {
   try {
    let jsonString = curr_bill_info.i;
    jsonString = jsonString.replace(/^"+|"+$/g, '');
    jsonString = jsonString.replace(/\\"/g, '"');
    jsonString = jsonString.replace(/\\\\/g, '\\');

    try {
     t1682 = JSON.parse(jsonString);
     if (t1682.dldt) {
      deliveryDate = convertDateFormatToIndia(new Date(t1682.dldt.slice(0, 10)));
     }
    } catch {
     t1682 = { rmrk: jsonString };
    }
   } catch (e) {
    const dateMatch = curr_bill_info.i.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
     deliveryDate = convertDateFormatToIndia(new Date(dateMatch[0]));
     const remainingText = curr_bill_info.i.replace(/\d{4}-\d{2}-\d{2}.*?(\s|$)/, '').trim();
     if (remainingText) {
      t1682 = { rmrk: ensureUTF(remainingText) };
     }
    } else {
     t1682 = { rmrk: ensureUTF(curr_bill_info.i) };
    }
   }
  }

  // Format numbers for WhatsApp
  let whatsAppLnkTxt = mob_client?.replace(".", "") + "&text=" + "Hello, *" + name_client?.trim() + "*\n";
  whatsAppLnkTxt += "Details of your voucher no.*" + curr_bill_info.g + "*\n";

  /*if (clientConfig.show_all_receipts == 1 && sCurrCashInfo && sCurrCashInfo.length > 0) {
   whatsAppLnkTxt += `\n*Receipts:*\n`;

   sCurrCashInfo.forEach(receipt => {
    const date = receipt.k ? convertDateFormatToIndia(new Date(receipt.k)) : 'No Date';
    const amount = parseFloat(receipt.j || 0);
    whatsAppLnkTxt += `${date}: \`${amount.toFixed(2)}\`\n`;
   });

   whatsAppLnkTxt += `*Total Received: \`${advanceAmt.toFixed(2)}\`*\n`;
  } else*/ {
   let formattedArray;
   if (discountAmt != 0) {
    formattedArray = formatNumbersForWhatsApp([t_itms_otal.toFixed(2), discountAmt.toFixed(2), advanceAmt.toFixed(2), dueAmt]);
    whatsAppLnkTxt += `\`${formattedArray[0]}\` Total\n`;
    whatsAppLnkTxt += `\`${formattedArray[1]}\` Discount\n`;
    whatsAppLnkTxt += `\`${formattedArray[2]}\` Received\n`;
    whatsAppLnkTxt += `\`${formattedArray[3]}\` Balance`;
   } else {
    formattedArray = formatNumbersForWhatsApp([t_itms_otal.toFixed(2), advanceAmt.toFixed(2), dueAmt]);
    whatsAppLnkTxt += `\`${formattedArray[0]}\` Total\n`;
    whatsAppLnkTxt += `\`${formattedArray[1]}\` Received\n`;
    whatsAppLnkTxt += `\`${formattedArray[2]}\` Balance`;
   }
  }
  whatsAppLnkTxt += `\n\n*${ensureUTF(clientConfig.printCompNm)}*\nThank you for choosing us.`;

  // Set WhatsApp link
  const whatsappLink = modalElement.querySelector("#modalWhatsappLink");
  whatsappLink.href = `https://api.whatsapp.com/send?phone=${encodeURI(whatsAppLnkTxt)}`;

  // Store data for later use
  modalElement.dataset.invoiceData = JSON.stringify({
   clientConfig,
   curr_bill_info,
   name_client,
   mob_client,
   addr_client,
   name_referrer,
   items,
   sCurrItems,
   sCurrCashInfo, // Add this line to store for detailed display
   quanTotal,
   t_itms_otal,
   advanceAmt,
   discountAmt,
   dueAmt,
   t1682,
   deliveryDate,
   eye_selected_msrmnt,
   billDate: convertDateFormatToIndia(new Date(curr_bill_info.f.slice(0, 10))),
   filename: (name_client?.trim() || "invoice") + "_" + curr_bill_info.g + "_" + convertDateFormatToIndia(new Date(curr_bill_info.f.slice(0, 10)))
  });

  // Generate invoice HTML for preview
  generateInvoiceHTML(modalElement);

 } catch (error) {
  console.error("Error loading invoice data:", error);
  throw error;
 }
}

// Generate invoice HTML for preview
function generateInvoiceHTML(modalElement) {
 const data = JSON.parse(modalElement.dataset.invoiceData);

 // Generate HTML for main preview container
 const container = modalElement.querySelector('#invoiceContentMain');
 if (container) {
  container.innerHTML = createInvoiceHTML(data);

  // Apply style settings after generating HTML
  setTimeout(() => applyStyleSettings(modalElement), 100);
 }
}

// Create invoice HTML structure with INLINE CSS
function createInvoiceHTML(data) {
 const { clientConfig, curr_bill_info, name_client, mob_client, addr_client, name_referrer, items, sCurrItems, sCurrCashInfo, quanTotal, t_itms_otal, advanceAmt, discountAmt, dueAmt, t1682, deliveryDate, eye_selected_msrmnt, billDate } = data;

 // Calculate amount in words
 const amountInWords = price_in_words(t_itms_otal.toFixed(0));
 const showAllReceipts = clientConfig.show_all_receipts == 1;

 // Create items HTML
 let itemsHTML = '';
 let serial = 1;

 sCurrItems.forEach((item) => {
  const foundITM = items.find(c => c.a == item.f);
  let itemName = '';

  if (foundITM?.gn && foundITM.gn != ".") {
   itemName = ensureUTF(foundITM.gn)
    .replace(/\n/g, '<br>')
    .replace(/\r/g, '')
    .replace(/\\n/g, '<br>');
  }

  if (item.i && item.i.length > 0) {
   let additionalText = ensureUTF(item.i)
    .replace(/\n/g, '<br>')
    .replace(/\r/g, '')
    .replace(/\\n/g, '<br>');

   itemName = itemName ? itemName + "<br>" + additionalText : additionalText;
  }

  const price = item.g / item.h;

  itemsHTML += `
<tr>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${serial++}</td>
<td style="padding: 4px; border: 1px solid #000; text-align: left; font-family: Arial, sans-serif;">${itemName}</td>
<td style="text-align: right; padding: 4px; border: 1px solid #000;">${item.h}</td>
<td style="text-align: right; padding: 4px; border: 1px solid #000;">${parseFloat(price).toFixed(2)}</td>
<td style="text-align: right; padding: 4px; border: 1px solid #000;">${parseFloat(item.g).toFixed(2)}</td>
</tr>
`;
 });

 // Helper function to format eye measurement values
 function formatEyeValue(value) {
  if (!value && value !== 0) return ''; // Return empty if null/undefined
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return value; // Return original if not a number
  if (numValue > 0) return '+' + value;
  return value.toString();
 }

 // Create eye measurements tables - FIXED PROPERTY NAMES
 let eyeTablesHTML = '';
 if (eye_selected_msrmnt) {
  // Map the properties from eye_selected_msrmnt to the expected property names
  // Right eye:
  // ra = rDvSph, rb = rDvCyl, rc = rDvAxis, rd = rDvV/n
  // re = rNvSph, rf = rNvCyl, rg = rNvAxis, rh = rNvV/n
  // ri = rAdd, rj = ?, rk = rPd
  // Left eye:
  // la = lDvSph, lb = lDvCyl, lc = lDvAxis, ld = lDvV/n
  // le = lNvSph, lf = lNvCyl, lg = lNvAxis, lh = lNvV/n
  // li = lAdd, lj = ?, lk = lPd

  // Check if tbl_disp is 2 to determine layout
  const isVerticalLayout = clientConfig.tbl_disp == 2;

  if (isVerticalLayout) {
   // Vertical layout: Right table above, Left table below (separate rows)
   eyeTablesHTML = `
<div class="eye-measurements-container" style="margin: 15px 0;">
<!-- Right Eye Table (Above) -->
<div class="right-eye-table" style="border: 1px solid #000; margin-bottom: 15px;">
<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
<thead>
<tr>
<th style="background: #f0f0f0; padding: 4px; border: 1px solid #000; text-align: center;"><i class="fa-solid fa-r"></i></th>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">SPH</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">CYL</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">AXIS</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">V/N</td>
</tr>
</thead>
<tbody>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">DV</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.ra)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.rb)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.rc || ''}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">6/${eye_selected_msrmnt.rd || ''}</td>
</tr>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">NV</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.re)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.rf)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.rg || ''}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">N/${eye_selected_msrmnt.rh || ''}</td>
</tr>
</tbody>
<tfoot>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">ADD</td>
<td colspan="4" style="padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.ri)}</td>
</tr>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">PD</td>
<td colspan="4" style="padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.rk || ''}</td>
</tr>
</tfoot>
</table>
</div>

<!-- Left Eye Table (Below) -->
<div class="left-eye-table" style="border: 1px solid #000;">
<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
<thead>
<tr>
<th style="background: #f0f0f0; padding: 4px; border: 1px solid #000; text-align: center;"><i class="fa-solid fa-l"></i></th>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">SPH</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">CYL</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">AXIS</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">V/N</td>
</tr>
</thead>
<tbody>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">DV</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.la)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.lb)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.lc || ''}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">6/${eye_selected_msrmnt.ld || ''}</td>
</tr>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">NV</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.le)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.lf)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.lg || ''}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">N/${eye_selected_msrmnt.lh || ''}</td>
</tr>
</tbody>
<tfoot>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">ADD</td>
<td colspan="4" style="padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.li)}</td>
</tr>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">PD</td>
<td colspan="4" style="padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.lk || ''}</td>
</tr>
</tfoot>
</table>
</div>
</div>
`;
  } else {
   // Original horizontal layout (side-by-side)
   eyeTablesHTML = `
<div class="eye-measurements-container" style="display: flex; justify-content: space-between; margin: 15px 0; gap: 20px;">
<div class="right-eye-table" style="flex: 1; border: 1px solid #000;">
<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
<thead>
<tr>
<th style="background: #f0f0f0; padding: 4px; border: 1px solid #000; text-align: center;"><i class="fa-solid fa-r"></i></th>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">SPH</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">CYL</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">AXIS</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">V/N</td>
</tr>
</thead>
<tbody>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">DV</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.ra)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.rb)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.rc || ''}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.rd || ''}</td>
</tr>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">NV</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.re)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.rf)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.rg || ''}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.rh || ''}</td>
</tr>
</tbody>
<tfoot>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">ADD</td>
<td colspan="4" style="padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.ri)}</td>
</tr>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">PD</td>
<td colspan="4" style="padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.rk || ''}</td>
</tr>
</tfoot>
</table>
</div>

<div class="left-eye-table" style="flex: 1; border: 1px solid #000;">
<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
<thead>
<tr>
<th style="background: #f0f0f0; padding: 4px; border: 1px solid #000; text-align: center;"><i class="fa-solid fa-l"></i></th>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">SPH</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">CYL</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">AXIS</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">V/N</td>
</tr>
</thead>
<tbody>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">DV</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.la)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.lb)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.lc || ''}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.ld || ''}</td>
</tr>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">NV</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.le)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.lf)}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.lg || ''}</td>
<td style="text-align: center; padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.lh || ''}</td>
</tr>
</tbody>
<tfoot>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">ADD</td>
<td colspan="4" style="padding: 4px; border: 1px solid #000;">${formatEyeValue(eye_selected_msrmnt.li)}</td>
</tr>
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: center;">PD</td>
<td colspan="4" style="padding: 4px; border: 1px solid #000;">${eye_selected_msrmnt.lk || ''}</td>
</tr>
</tfoot>
</table>
</div>
</div>
`;
  }
 }

 // Create detailed receipts HTML if enabled
 let receiptsHTML = '';
 if (showAllReceipts && sCurrCashInfo && sCurrCashInfo.length > 0) {
  // Create HTML for each receipt entry separately
  const receiptsRows = sCurrCashInfo.map((receipt, index) => {
   const receiptDate = receipt.k ? convertDateFormatToIndia(new Date(receipt.k)) : 'No Date';
   const receiptAmount = parseFloat(receipt.j || 0);

   return `
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: left; font-size: 11px;">
${receiptDate}
</td>
<td style="padding: 4px; border: 1px solid #000; text-align: right; font-size: 11px;">
${receiptAmount.toFixed(2)}
</td>
</tr>
`;
  }).join('');

  receiptsHTML = `
<tr>
<td colspan="3" style="padding: 8px; border: none; text-align: left; vertical-align: top;">
<span style="font-size: 75%;">${amountInWords}</span>
</td>
<td colspan="2" style="padding: 0; border: none;">
<table style="width: 100%; border-collapse: collapse; font-size: 11px;">
<thead>
<tr>
<th style="background: #f0f0f0; padding: 4px; border: 1px solid #000; text-align: left;">Receipt Date</th>
<th style="background: #f0f0f0; padding: 4px; border: 1px solid #000; text-align: right;">Amount</th>
</tr>
</thead>
<tbody>
${receiptsRows}
<tr>
<td style="padding: 4px; border: 1px solid #000; text-align: left; font-weight: bold;">
Total Received
</td>
<td style="padding: 4px; border: 1px solid #000; text-align: right; font-weight: bold;">
${advanceAmt.toFixed(2)}
</td>
</tr>
</tbody>
</table>
</td>
</tr>
`;
 } else {
  // Original single row for total received (when showAllReceipts is disabled)
  receiptsHTML = `
<tr>
<td colspan="3" style="padding: 8px; border: none; text-align: left; vertical-align: top;">
<span style="font-size: 75%;">${amountInWords}</span>
</td>
<td class="received-label" style="padding: 8px; border: none; text-align: right;"><b>${ensureUTF(clientConfig.printAdvAmtTtl)}</b></td>
<td class="received-amount" style="padding: 8px; border: 2px solid #000; text-align: right;">${advanceAmt.toFixed(2)}</td>
</tr>
`;
 }

 // Create remarks HTML
 let remarksHTML = '';
 if (t1682?.rmrk) {
  let remarkText = ensureUTF(t1682.rmrk);
  remarkText = remarkText.replace(/^"+|"+$/g, '').replace(/\\"/g, '"');
  // Clean up JSON remnants
  const textMatch = remarkText.match(/"rmrk"\s*:\s*"([^"]*)"/);
  if (textMatch?.[1]) {
   remarkText = textMatch[1];
  }
  remarksHTML = `<div style="width: 75%;"><b>Note: </b>${remarkText}</div>`;
 }

 // Return the HTML structure - Note: NO fixed dimensions here
 return `
<!-- Header -->
<div class="header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
<div>
<img src="${clientConfig.print_logo}" alt="Logo" style="width: 150px; height: auto;">
</div>
<div style="text-align: center; flex: 1; padding: 0 10px;">
<p style="font-size: 75%; margin: 2px 0;">${ensureUTF(clientConfig.printInvoice)}</p>
<h2 style="font-size: 18px; margin: 5px 0;">${ensureUTF(clientConfig.printCompNm)}</h2>
<p style="font-size: 80%; margin: 2px 0;">${ensureUTF(clientConfig.printAdrs)}</p>
<p style="margin: 5px 0; font-size: 80%;">${ensureUTF(clientConfig.printMo)}</p>
<p style="font-size: 75%; margin: 2px 0;">${ensureUTF(clientConfig.printSubjectTo)}</p>
</div>
<div style="width: 150px; text-align: right;"></div>
</div>

<!-- Client Details -->
<div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
<div style="width: 70%;">
<p class="client-name"><b>${ensureUTF(clientConfig.printPartyTtl)}</b> ${name_client}</p>
<p class="client-mobile"><b>${ensureUTF(clientConfig.printMobTtl)}</b> ${mob_client}</p>
<p><b>${ensureUTF(clientConfig.printAdrsTtl)}</b> ${addr_client}</p>
</div>
<div style="width: 30%; text-align: right;">
<p class="invoice-number"><b>${ensureUTF(clientConfig.printPavtiTtl)}</b> ${curr_bill_info.g}</p>
<p><b>${ensureUTF(clientConfig.printBilDtTtl)}</b> ${billDate}</p>
${deliveryDate ? `<p style="font-size: 80%;"><b>${ensureUTF(clientConfig.printDeliveryDtTtl)}</b> ${deliveryDate}</p>` : ''}
</div>
</div>

<!-- Eye Measurements -->
${eyeTablesHTML}

<!-- Referred By -->
${name_referrer ? `<p style="font-size: 75%; margin: 10px 0;"><b>${ensureUTF(clientConfig.printRefByTtl)}</b> ${name_referrer}</p>` : ''}

<!-- Items Table -->
<div style="margin: 15px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
<thead>
<tr>
<th style="background: #f0f0f0; padding: 6px; border: 1px solid #000; text-align: center;">Sn.</th>
<th style="background: #f0f0f0; padding: 6px; border: 1px solid #000; text-align: center;">Details</th>
<th style="background: #f0f0f0; padding: 6px; border: 1px solid #000; text-align: center;">Qty</th>
<th style="background: #f0f0f0; padding: 6px; border: 1px solid #000; text-align: center;">Price</th>
<th style="background: #f0f0f0; padding: 6px; border: 1px solid #000; text-align: center;">Amt</th>
</tr>
</thead>
<tbody>
${itemsHTML}
</tbody>
<tfoot>
<tr>
<td colspan="3" style="padding: 8px; border: none; text-align: left; vertical-align: top;">
<span style="font-size: 75%;">${amountInWords}</span>
</td>
<td class="total-label" style="padding: 8px; border: none; text-align: right;"><b>${ensureUTF(clientConfig.printTxAmtTtl)}</b></td>
<td class="total-amount" style="padding: 8px; border: 2px solid #000; text-align: right; font-weight: bold;">${t_itms_otal.toFixed(2)}</td>
</tr>
${discountAmt != 0 ? `
<tr>
<td colspan="${showAllReceipts ? '3' : '4'}" style="padding: 8px; border: none; text-align: ${showAllReceipts ? 'left' : 'right'};">
<b>Discount</b>
</td>
<td ${showAllReceipts ? 'colspan="2"' : ''} style="padding: 8px; border: 2px solid #000; text-align: right;">
${discountAmt.toFixed(2)}
</td>
</tr>
` : ''}
${showAllReceipts ?
   receiptsHTML :
   `<tr>
<td colspan="3" style="padding: 8px; border: none;"></td>
<td class="received-label" style="padding: 8px; border: none; text-align: right;"><b>${ensureUTF(clientConfig.printAdvAmtTtl)}</b></td>
<td class="received-amount" style="padding: 8px; border: 2px solid #000; text-align: right;">${advanceAmt.toFixed(2)}</td>
</tr>`
  }
<tr>
<td colspan="${showAllReceipts ? '3' : '3'}" style="padding: 8px; border: none;"></td>
<td style="padding: 8px; border: none; text-align: right;"><b>Due Amt:</b></td>
<td style="padding: 8px; border: 2px solid #000; text-align: right; font-weight: bold;">${dueAmt}</td>
</tr>
</tfoot>
</table>
</div>

<!-- Footer -->
<div style="display: flex; justify-content: space-between; margin-top: 20px;">
${remarksHTML}
<div style="width: 24%; text-align: right;">${ensureUTF(clientConfig.printForTtl)}</div>
</div>
`;
}

// Initialize preview system
function initializePreviewSystem(modalElement, modalInstance) {
 const configBtn = modalElement.querySelector('#configBtn');
 const downloadImageBtn = modalElement.querySelector('#downloadCurrentImage');
 const styleConfigBtn = modalElement.querySelector('#styleConfigBtn');

 // Configuration button click handler
 configBtn.addEventListener('click', async () => {
  await showPaperConfigModal(modalElement);
 });

 // Style configuration button click handler
 styleConfigBtn.addEventListener('click', async () => {
  await showStyleConfigModal(modalElement);
 });

 // Download image button click handler
 downloadImageBtn.addEventListener('click', async () => {
  await downloadCurrentImage(modalElement);
 });
}

// Apply style settings to the invoice
function applyStyleSettings(modalElement) {
 const styleSettings = JSON.parse(localStorage.getItem('styleSettings') || '{}');

 // If no settings, use defaults
 if (Object.keys(styleSettings).length === 0) return;

 const invoiceContent = modalElement.querySelector('#invoiceContentMain');
 if (!invoiceContent) return;

 // Apply logo & header gap
 const headerSection = invoiceContent.querySelector('.header');
 if (headerSection && styleSettings.logoHeaderGap) {
  const logoDiv = headerSection.querySelector('div:first-child');
  const headerDiv = headerSection.querySelector('div:nth-child(2)');
  const emptyDiv = headerSection.querySelector('div:last-child');

  if (logoDiv) {
   logoDiv.style.paddingRight = styleSettings.logoHeaderGap + 'px';
  }

  if (headerDiv) {
   headerDiv.style.paddingLeft = styleSettings.logoHeaderGap + 'px';
   headerDiv.style.paddingRight = styleSettings.logoHeaderGap + 'px';
  }

  if (emptyDiv) {
   emptyDiv.style.paddingLeft = styleSettings.logoHeaderGap + 'px';
  }
 }

 // Apply client details gaps
 const clientDetailParagraphs = invoiceContent.querySelectorAll('div:nth-child(2) p');
 clientDetailParagraphs.forEach(p => {
  p.style.marginBottom = (parseInt(styleSettings.clientDetailsGap) || 0) + 'px';
 });

 // Apply eye tables gap
 const eyeTablesContainer = invoiceContent.querySelector('.eye-measurements-container');
 if (eyeTablesContainer && styleSettings.eyeTablesGap) {
  eyeTablesContainer.style.marginBottom = styleSettings.eyeTablesGap + 'px';
 }

 // Apply bill items row gaps
 const billItemRows = invoiceContent.querySelectorAll('table tbody tr');
 billItemRows.forEach(row => {
  row.style.marginBottom = styleSettings.billItemsGap + 'px';
 });

 // Apply table cell spacing
 const tables = invoiceContent.querySelectorAll('table');
 tables.forEach(table => {
  table.style.borderCollapse = 'separate';
  table.style.borderSpacing = (styleSettings.tdSpacing || '1') + 'px';
 });

 // Apply font size and background to name
 const nameElement = invoiceContent.querySelector('.client-name');
 if (nameElement) {
  const nameContent = nameElement.innerHTML;
  const nameParts = nameContent.split('</b>');
  if (nameParts.length > 1) {
   nameElement.innerHTML = `${nameParts[0]}</b> <span style="background-color: ${styleSettings.nameBgColor}; padding: 2px 5px; border-radius: 3px; font-size: ${styleSettings.nameMobileFontSize}px;">${nameParts[1]}</span>`;
  }
 }

 // Apply font size and background to mobile
 const mobileElement = invoiceContent.querySelector('.client-mobile');
 if (mobileElement) {
  const mobileContent = mobileElement.innerHTML;
  const mobileParts = mobileContent.split('</b>');
  if (mobileParts.length > 1) {
   mobileElement.innerHTML = `${mobileParts[0]}</b> <span style="background-color: ${styleSettings.mobileBgColor}; padding: 2px 5px; border-radius: 3px; font-size: ${styleSettings.nameMobileFontSize}px;">${mobileParts[1]}</span>`;
  }
 }

 // Apply background to invoice number
 const invoiceNoElement = invoiceContent.querySelector('.invoice-number');
 if (invoiceNoElement) {
  invoiceNoElement.style.backgroundColor = styleSettings.invoiceNoBgColor;
  invoiceNoElement.style.padding = '2px 5px';
  invoiceNoElement.style.borderRadius = '3px';
  invoiceNoElement.style.display = 'inline-block';
 }

 // Apply background to total amount
 const totalAmountCell = invoiceContent.querySelector('.total-amount');
 if (totalAmountCell) {
  totalAmountCell.style.backgroundColor = styleSettings.totalAmtBgColor;
 }

 // Apply background to received amount
 const receivedAmountCell = invoiceContent.querySelector('.received-amount');
 if (receivedAmountCell) {
  receivedAmountCell.style.backgroundColor = styleSettings.receivedAmtBgColor;
 }

 // Apply eye table backgrounds
 const leftEyeTable = invoiceContent.querySelector('.left-eye-table');
 const rightEyeTable = invoiceContent.querySelector('.right-eye-table');

 if (leftEyeTable) {
  leftEyeTable.style.backgroundColor = styleSettings.leftEyeTableBgColor;
 }

 if (rightEyeTable) {
  rightEyeTable.style.backgroundColor = styleSettings.rightEyeTableBgColor;
 }
}

// Calculate content dimensions based on aspect ratio
function calculateContentDimensions(modalElement) {
 // Get the invoice content to calculate natural size
 const invoiceContent = modalElement.querySelector('#invoiceContentMain');
 if (!invoiceContent) return { width: 100, height: 200 };

 // Create a temporary container to measure natural size
 const tempContainer = document.createElement('div');
 tempContainer.style.cssText = `
position: fixed;
top: -9999px;
left: -9999px;
width: auto;
height: auto;
padding: 15px;
background: white;
`;

 const clone = invoiceContent.cloneNode(true);
 tempContainer.appendChild(clone);
 document.body.appendChild(tempContainer);

 // Get natural dimensions
 const naturalWidth = tempContainer.scrollWidth;
 const naturalHeight = tempContainer.scrollHeight;

 document.body.removeChild(tempContainer);

 return { naturalWidth, naturalHeight };
}

// Apply paper settings to preview
function applyPaperSettings(modalElement) {
 const paperSettings = JSON.parse(localStorage.getItem('paperSettings') || '{}');

 // Default settings
 const {
  paperSize = 'A4',
  orientation = 'portrait',
  dimensionType = 'width', // 'width' or 'height'
  printDimension = '100', // value in mm
  position = 'top-left'
 } = paperSettings;

 // Get natural content dimensions (in pixels)
 const naturalDims = calculateContentDimensions(modalElement);
 const aspectRatio = naturalDims.naturalWidth / naturalDims.naturalHeight;

 // Calculate content dimensions based on selected dimension type
 let contentWidth = 0;
 let contentHeight = 0;

 if (dimensionType === 'width') {
  // Set width, calculate height based on aspect ratio
  contentWidth = parseFloat(printDimension);
  contentHeight = contentWidth / aspectRatio;
 } else {
  // Set height, calculate width based on aspect ratio
  contentHeight = parseFloat(printDimension);
  contentWidth = contentHeight * aspectRatio;
 }

 // Paper dimensions in mm (for display purposes)
 const paperDimensions = {
  'A4': { width: 210, height: 297 },
  'A5': { width: 148, height: 210 },
  'Custom': { width: paperSettings.customPaperWidth || 210, height: paperSettings.customPaperHeight || 297 }
 };

 const dim = paperDimensions[paperSize];
 const isLandscape = orientation === 'landscape';

 // For display in preview, we'll use a scale factor to fit on screen
 const scaleFactor = 1.5; // mm to px (approximate)
 const paperDisplayWidth = (isLandscape ? dim.height : dim.width) * scaleFactor;
 const paperDisplayHeight = (isLandscape ? dim.width : dim.height) * scaleFactor;

 // Content display dimensions (converted from mm to pixels for display)
 const contentDisplayWidth = contentWidth * scaleFactor;
 const contentDisplayHeight = contentHeight * scaleFactor;

 // Calculate position
 let top = 0, left = 0;
 switch (position) {
  case 'top-left':
   top = 0;
   left = 0;
   break;
  case 'top-center':
   top = 0;
   left = (paperDisplayWidth - contentDisplayWidth) / 2;
   break;
  case 'top-right':
   top = 0;
   left = paperDisplayWidth - contentDisplayWidth;
   break;
  case 'center-left':
   top = (paperDisplayHeight - contentDisplayHeight) / 2;
   left = 0;
   break;
  case 'center':
   top = (paperDisplayHeight - contentDisplayHeight) / 2;
   left = (paperDisplayWidth - contentDisplayWidth) / 2;
   break;
  case 'center-right':
   top = (paperDisplayHeight - contentDisplayHeight) / 2;
   left = paperDisplayWidth - contentDisplayWidth;
   break;
  case 'bottom-left':
   top = paperDisplayHeight - contentDisplayHeight;
   left = 0;
   break;
  case 'bottom-center':
   top = paperDisplayHeight - contentDisplayHeight;
   left = (paperDisplayWidth - contentDisplayWidth) / 2;
   break;
  case 'bottom-right':
   top = paperDisplayHeight - contentDisplayHeight;
   left = paperDisplayWidth - contentDisplayWidth;
   break;
 }

 // Apply styles to preview elements
 const previewMain = modalElement.querySelector('#previewMain');
 const paperBackground = modalElement.querySelector('#paperBackground');
 const printContentArea = modalElement.querySelector('#printContentArea');

 if (previewMain && paperBackground && printContentArea) {
  // Set paper background size
  previewMain.style.width = paperDisplayWidth + 'px';
  previewMain.style.height = paperDisplayHeight + 'px';

  // Set print content area size and position
  printContentArea.style.top = top + 'px';
  printContentArea.style.left = left + 'px';

  // Store calculated dimensions for download
  printContentArea.dataset.contentWidth = contentWidth;
  printContentArea.dataset.contentHeight = contentHeight;
 }
}

// Show paper configuration modal
async function showPaperConfigModal(modalElement) {
 // Get current settings from localStorage
 const currentSettings = JSON.parse(localStorage.getItem('paperSettings') || '{}');

 // Calculate natural content dimensions for aspect ratio
 const naturalDims = calculateContentDimensions(modalElement);
 const aspectRatio = naturalDims.naturalWidth / naturalDims.naturalHeight;

 // Create config modal
 const { contentElement, modalInstance, modalElement: configModalElement } = create_modal_dynamically('paperConfigModal');

 contentElement.innerHTML = `
<style>
.config-modal .modal-dialog {
max-width: 600px;
}

.config-form-group {
margin-bottom: 20px;
}

.config-form-group label {
display: block;
margin-bottom: 8px;
font-weight: 500;
}

.config-form-group select,
.config-form-group input {
width: 100%;
padding: 10px;
border: 1px solid #ddd;
border-radius: 6px;
font-size: 14px;
}

.dimensions-row {
display: flex;
gap: 15px;
}

.dimensions-row .form-group {
flex: 1;
position: relative;
}

.unit-label {
position: absolute;
right: 10px;
top: 50%;
transform: translateY(-50%);
color: #666;
font-size: 12px;
pointer-events: none;
}

.paper-info {
font-size: 12px;
color: #666;
margin-top: 5px;
font-style: italic;
}

.position-grid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 8px;
margin-top: 10px;
}

.position-btn {
padding: 12px;
border: 2px solid #dee2e6;
background: #f8f9fa;
cursor: pointer;
text-align: center;
border-radius: 6px;
transition: all 0.2s;
font-size: 12px;
}

.position-btn:hover {
background: #e9ecef;
border-color: #adb5bd;
}

.position-btn.active {
background: #0d6efd;
color: white;
border-color: #0d6efd;
}

.config-section {
background: #f8f9fa;
padding: 15px;
border-radius: 8px;
margin-bottom: 20px;
}

.config-section h6 {
margin-bottom: 15px;
color: #495057;
border-bottom: 1px solid #dee2e6;
padding-bottom: 8px;
}

.dimension-option {
display: flex;
gap: 10px;
margin-bottom: 10px;
align-items: center;
}

.dimension-option input[type="radio"] {
width: auto;
margin: 0;
}

.dimension-option label {
margin: 0;
font-weight: normal;
cursor: pointer;
}

.dimension-inputs {
margin-top: 15px;
}

.dimension-field {
margin-bottom: 15px;
transition: all 0.3s;
}

.dimension-field.disabled {
opacity: 0.6;
}

.dimension-field.disabled input {
background-color: #e9ecef;
cursor: not-allowed;
}

.calculated-dimension {
background-color: #e7f1ff;
padding: 8px 12px;
border-radius: 4px;
margin-top: 5px;
font-size: 12px;
color: #0a58ca;
}

.calculate-btn {
margin-top: 10px;
width: 100%;
}

.natural-size-info {
font-size: 11px;
color: #6c757d;
margin-top: 5px;
font-style: italic;
}
</style>

<div class="container-fluid">
<div class="row">
<div class="col-12">
<h5 class="mb-4">Print Settings</h5>

<div class="config-section">
<h6>Paper Settings</h6>

<div class="config-form-group">
<label>Paper Size:</label>
<select id="paperSize" class="form-select">
<option value="A4" ${currentSettings.paperSize === 'A4' ? 'selected' : ''}>A4 (210mm × 297mm)</option>
<option value="A5" ${currentSettings.paperSize === 'A5' ? 'selected' : ''}>A5 (148mm × 210mm)</option>
<option value="Custom" ${currentSettings.paperSize === 'Custom' ? 'selected' : ''}>Custom Paper Size</option>
</select>
</div>

<div class="config-form-group" id="customPaperDimensions" style="${currentSettings.paperSize === 'Custom' ? '' : 'display: none;'}">
<label>Custom Paper Dimensions (mm):</label>
<div class="dimensions-row">
<div class="form-group">
<input type="number" id="customPaperWidth" class="form-control" 
value="${currentSettings.customPaperWidth || '210'}" 
min="50" max="500" step="1" placeholder="Width">
<span class="unit-label">mm</span>
</div>
<div class="form-group">
<input type="number" id="customPaperHeight" class="form-control" 
value="${currentSettings.customPaperHeight || '297'}" 
min="50" max="500" step="1" placeholder="Height">
<span class="unit-label">mm</span>
</div>
</div>
</div>

<div class="config-form-group">
<label>Paper Orientation:</label>
<select id="orientation" class="form-select">
<option value="portrait" ${(!currentSettings.orientation || currentSettings.orientation === 'portrait') ? 'selected' : ''}>Portrait</option>
<option value="landscape" ${currentSettings.orientation === 'landscape' ? 'selected' : ''}>Landscape</option>
</select>
<div class="paper-info">Note: Landscape swaps width and height</div>
</div>
</div>

<div class="config-section">
<h6>Print Content Settings</h6>

<div class="config-form-group">
<label>Set Content by:</label>
<div class="dimension-option">
<input type="radio" id="dimensionWidth" name="dimensionType" value="width" ${(!currentSettings.dimensionType || currentSettings.dimensionType === 'width') ? 'checked' : ''}>
<label for="dimensionWidth">Width</label>
</div>
<div class="dimension-option">
<input type="radio" id="dimensionHeight" name="dimensionType" value="height" ${currentSettings.dimensionType === 'height' ? 'checked' : ''}>
<label for="dimensionHeight">Height</label>
</div>

<div class="dimension-inputs">
<div class="dimension-field" id="widthField" style="${(!currentSettings.dimensionType || currentSettings.dimensionType === 'width') ? '' : 'display: none;'}">
<label for="printWidth">Content Width (mm):</label>
<input type="number" id="printWidth" class="form-control" 
value="${currentSettings.printDimension || '100'}" 
min="10" max="500" step="1" placeholder="Width in mm">
<span class="unit-label">mm</span>
<div id="heightCalculation" class="calculated-dimension" style="display: none;">
Calculated Height: <span id="calculatedHeight">0</span> mm
</div>
</div>

<div class="dimension-field" id="heightField" style="${currentSettings.dimensionType === 'height' ? '' : 'display: none;'}">
<label for="printHeight">Content Height (mm):</label>
<input type="number" id="printHeight" class="form-control" 
value="${currentSettings.printDimension || '200'}" 
min="10" max="500" step="1" placeholder="Height in mm">
<span class="unit-label">mm</span>
<div id="widthCalculation" class="calculated-dimension" style="display: none;">
Calculated Width: <span id="calculatedWidth">0</span> mm
</div>
</div>
</div>

<div class="natural-size-info">
Natural content aspect ratio: ${aspectRatio.toFixed(2)} (W:H)
</div>
</div>

<div class="config-form-group">
<label>Print Position on Paper:</label>
<div class="position-grid">
<button type="button" class="position-btn ${currentSettings.position === 'top-left' ? 'active' : ''}" data-position="top-left">Top Left</button>
<button type="button" class="position-btn ${(!currentSettings.position || currentSettings.position === 'top-center') ? 'active' : ''}" data-position="top-center">Top Center</button>
<button type="button" class="position-btn ${currentSettings.position === 'top-right' ? 'active' : ''}" data-position="top-right">Top Right</button>
<button type="button" class="position-btn ${currentSettings.position === 'center-left' ? 'active' : ''}" data-position="center-left">Center Left</button>
<button type="button" class="position-btn ${currentSettings.position === 'center' ? 'active' : ''}" data-position="center">Center</button>
<button type="button" class="position-btn ${currentSettings.position === 'center-right' ? 'active' : ''}" data-position="center-right">Center Right</button>
<button type="button" class="position-btn ${currentSettings.position === 'bottom-left' ? 'active' : ''}" data-position="bottom-left">Bottom Left</button>
<button type="button" class="position-btn ${currentSettings.position === 'bottom-center' ? 'active' : ''}" data-position="bottom-center">Bottom Center</button>
<button type="button" class="position-btn ${currentSettings.position === 'bottom-right' ? 'active' : ''}" data-position="bottom-right">Bottom Right</button>
</div>
</div>
</div>

<div class="config-footer">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
<button type="button" class="btn btn-primary" id="saveConfig">Save Settings</button>
</div>
</div>
</div>
</div>
`;

 // Show modal
 modalInstance.show();

 // Event handlers for config modal
 const paperSizeSelect = configModalElement.querySelector('#paperSize');
 const orientationSelect = configModalElement.querySelector('#orientation');
 const customPaperDimensionsDiv = configModalElement.querySelector('#customPaperDimensions');
 const customPaperWidthInput = configModalElement.querySelector('#customPaperWidth');
 const customPaperHeightInput = configModalElement.querySelector('#customPaperHeight');
 const dimensionWidthRadio = configModalElement.querySelector('#dimensionWidth');
 const dimensionHeightRadio = configModalElement.querySelector('#dimensionHeight');
 const widthField = configModalElement.querySelector('#widthField');
 const heightField = configModalElement.querySelector('#heightField');
 const printWidthInput = configModalElement.querySelector('#printWidth');
 const printHeightInput = configModalElement.querySelector('#printHeight');
 const heightCalculationDiv = configModalElement.querySelector('#heightCalculation');
 const widthCalculationDiv = configModalElement.querySelector('#widthCalculation');
 const calculatedHeightSpan = configModalElement.querySelector('#calculatedHeight');
 const calculatedWidthSpan = configModalElement.querySelector('#calculatedWidth');
 const positionButtons = configModalElement.querySelectorAll('.position-btn');
 const saveBtn = configModalElement.querySelector('#saveConfig');

 let selectedPosition = currentSettings.position || 'top-left';
 let currentDimensionType = currentSettings.dimensionType || 'width';
 let currentDimensionValue = currentSettings.printDimension || '100';

 // Calculate and show other dimension
 function calculateOtherDimension() {
  const value = parseFloat(currentDimensionType === 'width' ? printWidthInput.value : printHeightInput.value);

  if (currentDimensionType === 'width') {
   const calculatedHeight = value / aspectRatio;
   calculatedHeightSpan.textContent = calculatedHeight.toFixed(1);
   heightCalculationDiv.style.display = 'block';
  } else {
   const calculatedWidth = value * aspectRatio;
   calculatedWidthSpan.textContent = calculatedWidth.toFixed(1);
   widthCalculationDiv.style.display = 'block';
  }
 }

 // Toggle custom paper dimensions visibility
 paperSizeSelect.addEventListener('change', function () {
  if (this.value === 'Custom') {
   customPaperDimensionsDiv.style.display = 'block';
  } else {
   customPaperDimensionsDiv.style.display = 'none';
  }
 });

 // Dimension type radio button change
 dimensionWidthRadio.addEventListener('change', function () {
  if (this.checked) {
   currentDimensionType = 'width';
   widthField.style.display = 'block';
   heightField.style.display = 'none';
   heightCalculationDiv.style.display = 'block';
   widthCalculationDiv.style.display = 'none';
   calculateOtherDimension();
  }
 });

 dimensionHeightRadio.addEventListener('change', function () {
  if (this.checked) {
   currentDimensionType = 'height';
   widthField.style.display = 'none';
   heightField.style.display = 'block';
   heightCalculationDiv.style.display = 'none';
   widthCalculationDiv.style.display = 'block';
   calculateOtherDimension();
  }
 });

 // Update calculations when dimension value changes
 printWidthInput.addEventListener('input', calculateOtherDimension);
 printHeightInput.addEventListener('input', calculateOtherDimension);

 // Position button selection
 positionButtons.forEach(btn => {
  btn.addEventListener('click', function () {
   positionButtons.forEach(b => b.classList.remove('active'));
   this.classList.add('active');
   selectedPosition = this.dataset.position;
  });
 });

 // Initial calculation
 setTimeout(calculateOtherDimension, 100);

 // Save configuration
 saveBtn.addEventListener('click', async function () {
  const paperSettings = {
   paperSize: paperSizeSelect.value,
   orientation: orientationSelect.value,
   customPaperWidth: customPaperWidthInput.value,
   customPaperHeight: customPaperHeightInput.value,
   dimensionType: currentDimensionType,
   printDimension: currentDimensionType === 'width' ? printWidthInput.value : printHeightInput.value,
   position: selectedPosition
  };

  // Get calculated dimensions
  const value = parseFloat(paperSettings.printDimension);
  let contentWidth, contentHeight;

  if (paperSettings.dimensionType === 'width') {
   contentWidth = value;
   contentHeight = value / aspectRatio;
  } else {
   contentHeight = value;
   contentWidth = value * aspectRatio;
  }

  // Validate content dimensions don't exceed paper dimensions
  const paperWidth = paperSettings.paperSize === 'Custom' ?
   parseFloat(paperSettings.customPaperWidth) :
   (paperSettings.paperSize === 'A4' ? 210 : 148);

  const paperHeight = paperSettings.paperSize === 'Custom' ?
   parseFloat(paperSettings.customPaperHeight) :
   (paperSettings.paperSize === 'A4' ? 297 : 210);

  const effectivePaperWidth = paperSettings.orientation === 'portrait' ? paperWidth : paperHeight;
  const effectivePaperHeight = paperSettings.orientation === 'portrait' ? paperHeight : paperWidth;

  if (contentWidth > effectivePaperWidth) {
   createToast(`Content width (${contentWidth.toFixed(1)}mm) exceeds paper width (${effectivePaperWidth}mm)!`, 'error');
   return;
  }

  if (contentHeight > effectivePaperHeight) {
   createToast(`Content height (${contentHeight.toFixed(1)}mm) exceeds paper height (${effectivePaperHeight}mm)!`, 'error');
   return;
  }

  // Save to localStorage
  localStorage.setItem('paperSettings', JSON.stringify(paperSettings));

  // Close config modal
  modalInstance.hide();

  // Apply new settings to preview
  applyPaperSettings(modalElement);

  // Show success message
  createToast('Print settings saved successfully!', 'success');
 });

 // Auto-switch to custom if current values don't match A4/A5
 if (currentSettings.customPaperWidth && currentSettings.customPaperHeight) {
  const isA4 = currentSettings.customPaperWidth === '210' && currentSettings.customPaperHeight === '297';
  const isA5 = currentSettings.customPaperWidth === '148' && currentSettings.customPaperHeight === '210';

  if (!isA4 && !isA5) {
   paperSizeSelect.value = 'Custom';
   customPaperDimensionsDiv.style.display = 'block';
  }
 }
}

// Show style configuration modal
async function showStyleConfigModal(modalElement) {
 // Get current settings from localStorage
 const currentSettings = JSON.parse(localStorage.getItem('styleSettings') || '{}');

 // Create style config modal
 const { contentElement, modalInstance, modalElement: styleModalElement } = create_modal_dynamically('styleConfigModal');

 contentElement.innerHTML = `
<style>
.style-config-modal .modal-dialog {
max-width: 600px;
max-height: 90vh;
}

.style-config-modal .modal-body {
max-height: 70vh;
overflow-y: auto;
padding-right: 10px;
}

.style-config-modal .modal-body::-webkit-scrollbar {
width: 8px;
}

.style-config-modal .modal-body::-webkit-scrollbar-track {
background: #f1f1f1;
border-radius: 4px;
}

.style-config-modal .modal-body::-webkit-scrollbar-thumb {
background: #888;
border-radius: 4px;
}

.style-config-modal .modal-body::-webkit-scrollbar-thumb:hover {
background: #555;
}

.style-form-group {
margin-bottom: 20px;
}

.style-form-group label {
display: block;
margin-bottom: 8px;
font-weight: 500;
}

.style-form-group select,
.style-form-group input {
width: 100%;
padding: 10px;
border: 1px solid #ddd;
border-radius: 6px;
font-size: 14px;
}

.gap-controls {
display: flex;
gap: 15px;
align-items: center;
}

.gap-controls .form-group {
flex: 1;
position: relative;
}

.unit-label {
position: absolute;
right: 10px;
top: 50%;
transform: translateY(-50%);
color: #666;
font-size: 12px;
pointer-events: none;
}

.color-controls {
display: grid;
grid-template-columns: repeat(1, 1fr);
gap: 15px;
margin-top: 10px;
}

.color-control {
display: flex;
align-items: center;
gap: 10px;
}

.color-preview {
width: 30px;
height: 30px;
border: 1px solid #ddd;
border-radius: 4px;
cursor: pointer;
}

.color-label {
font-size: 14px;
min-width: 150px;
flex-grow: 1;
}

.config-section {
background: #f8f9fa;
padding: 15px;
border-radius: 8px;
margin-bottom: 20px;
}

.config-section h6 {
margin-bottom: 15px;
color: #495057;
border-bottom: 1px solid #dee2e6;
padding-bottom: 8px;
}

.preset-buttons {
display: flex;
gap: 10px;
margin-top: 15px;
flex-wrap: wrap;
}

.reset-btn {
margin-left: auto;
}

.font-size-control {
display: flex;
align-items: center;
gap: 15px;
}

.font-size-preview {
font-size: 16px;
padding: 8px 12px;
background: #f8f9fa;
border-radius: 4px;
border: 1px solid #dee2e6;
min-width: 100px;
text-align: center;
}

.range-value {
min-width: 40px;
text-align: center;
font-weight: 500;
}

.table-spacing-preview {
margin-top: 10px;
padding: 10px;
background: white;
border: 1px solid #dee2e6;
border-radius: 4px;
display: flex;
justify-content: center;
align-items: center;
}

.table-preview-table {
border-collapse: separate;
border-spacing: ${currentSettings.tdSpacing || 1}px;
}

.table-preview-cell {
width: 30px;
height: 20px;
border: 1px solid #999;
text-align: center;
font-size: 10px;
}

.logo-gap-preview {
display: flex;
align-items: center;
justify-content: space-between;
padding: 10px;
background: white;
border: 1px solid #dee2e6;
border-radius: 4px;
margin-top: 10px;
}

.logo-preview-img {
width: 50px;
height: 50px;
background: #0d6efd;
border-radius: 4px;
}

.logo-preview-header {
flex: 1;
text-align: center;
padding: 5px;
background: #f8f9fa;
border-radius: 4px;
margin: 0 ${currentSettings.logoHeaderGap || 20}px;
}
</style>

<div class="container-fluid">
<div class="row">
<div class="col-12">
<h5 class="mb-4">Invoice Style Settings</h5>

<div class="config-section">
<h6>Spacing & Gaps</h6>

<div class="style-form-group">
<label>Logo & Header Gap (px):</label>
<div class="gap-controls">
<div class="form-group">
<input type="range" id="logoHeaderGap" class="form-range" 
min="0" max="100" step="1" 
value="${currentSettings.logoHeaderGap || '20'}">
</div>
<div class="range-value" id="logoHeaderGapValue">${currentSettings.logoHeaderGap || '20'}px</div>
</div>
<div class="logo-gap-preview">
<div class="logo-preview-img"></div>
<div class="logo-preview-header">Company Header</div>
<div class="logo-preview-img" style="background: #6c757d;"></div>
</div>
</div>

<div class="style-form-group">
<label>Client Details Row Gap (px):</label>
<div class="gap-controls">
<div class="form-group">
<input type="range" id="clientDetailsGap" class="form-range" 
min="0" max="30" step="1" 
value="${currentSettings.clientDetailsGap || '0'}">
</div>
<div class="range-value" id="clientDetailsGapValue">${currentSettings.clientDetailsGap || '0'}px</div>
</div>
</div>

<div class="style-form-group">
<label>Eye Tables Row Gap (px):</label>
<div class="gap-controls">
<div class="form-group">
<input type="range" id="eyeTablesGap" class="form-range" 
min="0" max="30" step="1" 
value="${currentSettings.eyeTablesGap || '0'}">
</div>
<div class="range-value" id="eyeTablesGapValue">${currentSettings.eyeTablesGap || '0'}px</div>
</div>
</div>

<div class="style-form-group">
<label>Bill Items Row Gap (px):</label>
<div class="gap-controls">
<div class="form-group">
<input type="range" id="billItemsGap" class="form-range" 
min="0" max="30" step="1" 
value="${currentSettings.billItemsGap || '0'}">
</div>
<div class="range-value" id="billItemsGapValue">${currentSettings.billItemsGap || '0'}px</div>
</div>
</div>

<div class="style-form-group">
<label>Table Cell Spacing (px):</label>
<div class="gap-controls">
<div class="form-group">
<input type="range" id="tdSpacing" class="form-range" 
min="0" max="20" step="1" 
value="${currentSettings.tdSpacing || '1'}">
</div>
<div class="range-value" id="tdSpacingValue">${currentSettings.tdSpacing || '1'}px</div>
</div>
<div class="table-spacing-preview">
<table class="table-preview-table">
<tr>
<td class="table-preview-cell">A1</td>
<td class="table-preview-cell">B1</td>
<td class="table-preview-cell">C1</td>
</tr>
<tr>
<td class="table-preview-cell">A2</td>
<td class="table-preview-cell">B2</td>
<td class="table-preview-cell">C2</td>
</tr>
</table>
</div>
<div style="font-size: 12px; color: #666; margin-top: 5px;">
Default: 1px spacing between table cells
</div>
</div>
</div>

<div class="config-section">
<h6>Font Sizes</h6>

<div class="style-form-group">
<label>Name & Mobile Font Size (px):</label>
<div class="font-size-control">
<div class="form-group" style="flex: 1;">
<input type="range" id="nameMobileFontSize" class="form-range" 
min="12" max="24" step="1" 
value="${currentSettings.nameMobileFontSize || '14'}">
</div>
<div class="range-value" id="nameMobileFontSizeValue">${currentSettings.nameMobileFontSize || '14'}px</div>
<div class="font-size-preview" id="nameMobileFontSizePreview" style="font-size: ${currentSettings.nameMobileFontSize || '14'}px;">
Preview
</div>
</div>
</div>
</div>

<div class="config-section">
<h6>Background Colors</h6>

<div class="color-controls">
<div class="color-control">
<div class="color-preview" id="nameBgColorPreview" 
style="background-color: ${currentSettings.nameBgColor || '#f0f0f0'};"></div>
<span class="color-label">Name Background</span>
<input type="color" id="nameBgColor" class="form-control form-control-color" 
value="${currentSettings.nameBgColor || '#f0f0f0'}">
</div>

<div class="color-control">
<div class="color-preview" id="mobileBgColorPreview" 
style="background-color: ${currentSettings.mobileBgColor || '#f0f0f0'};"></div>
<span class="color-label">Mobile Background</span>
<input type="color" id="mobileBgColor" class="form-control form-control-color" 
value="${currentSettings.mobileBgColor || '#f0f0f0'}">
</div>

<div class="color-control">
<div class="color-preview" id="invoiceNoBgColorPreview" 
style="background-color: ${currentSettings.invoiceNoBgColor || '#f0f0f0'};"></div>
<span class="color-label">Invoice No Background</span>
<input type="color" id="invoiceNoBgColor" class="form-control form-control-color" 
value="${currentSettings.invoiceNoBgColor || '#f0f0f0'}">
</div>

<div class="color-control">
<div class="color-preview" id="totalAmtBgColorPreview" 
style="background-color: ${currentSettings.totalAmtBgColor || '#f0f0f0'};"></div>
<span class="color-label">Total Amount Background</span>
<input type="color" id="totalAmtBgColor" class="form-control form-control-color" 
value="${currentSettings.totalAmtBgColor || '#f0f0f0'}">
</div>

<div class="color-control">
<div class="color-preview" id="receivedAmtBgColorPreview" 
style="background-color: ${currentSettings.receivedAmtBgColor || '#f0f0f0'};"></div>
<span class="color-label">Received Amount Background</span>
<input type="color" id="receivedAmtBgColor" class="form-control form-control-color" 
value="${currentSettings.receivedAmtBgColor || '#f0f0f0'}">
</div>

<div class="color-control">
<div class="color-preview" id="leftEyeTableBgColorPreview" 
style="background-color: ${currentSettings.leftEyeTableBgColor || '#ffffff'};"></div>
<span class="color-label">Left Eye Table Background</span>
<input type="color" id="leftEyeTableBgColor" class="form-control form-control-color" 
value="${currentSettings.leftEyeTableBgColor || '#ffffff'}">
</div>

<div class="color-control">
<div class="color-preview" id="rightEyeTableBgColorPreview" 
style="background-color: ${currentSettings.rightEyeTableBgColor || '#ffffff'};"></div>
<span class="color-label">Right Eye Table Background</span>
<input type="color" id="rightEyeTableBgColor" class="form-control form-control-color" 
value="${currentSettings.rightEyeTableBgColor || '#ffffff'}">
</div>
</div>

<div class="preset-buttons">
<button type="button" class="btn btn-sm btn-outline-primary" id="applyDefaultPreset">
Default Preset
</button>
<button type="button" class="btn btn-sm btn-outline-success" id="applyBluePreset">
Blue Theme
</button>
<button type="button" class="btn btn-sm btn-outline-warning" id="applyYellowPreset">
Yellow Theme
</button>
<button type="button" class="btn btn-sm btn-outline-danger" id="applyRedGreyPreset">
Red & Grey Theme
</button>
<button type="button" class="btn btn-sm btn-outline-danger reset-btn" id="resetStyles">
Reset All
</button>
</div>
</div>

<div class="config-footer mt-4">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
<button type="button" class="btn btn-primary" id="saveStyleConfig">Save Settings</button>
</div>
</div>
</div>
</div>
`;

 // Show modal
 modalInstance.show();

 // Event handlers for style config modal
 const clientDetailsGapInput = styleModalElement.querySelector('#clientDetailsGap');
 const clientDetailsGapValue = styleModalElement.querySelector('#clientDetailsGapValue');
 const eyeTablesGapInput = styleModalElement.querySelector('#eyeTablesGap');
 const eyeTablesGapValue = styleModalElement.querySelector('#eyeTablesGapValue');
 const billItemsGapInput = styleModalElement.querySelector('#billItemsGap');
 const billItemsGapValue = styleModalElement.querySelector('#billItemsGapValue');
 const logoHeaderGapInput = styleModalElement.querySelector('#logoHeaderGap');
 const logoHeaderGapValue = styleModalElement.querySelector('#logoHeaderGapValue');
 const tdSpacingInput = styleModalElement.querySelector('#tdSpacing');
 const tdSpacingValue = styleModalElement.querySelector('#tdSpacingValue');
 const nameMobileFontSizeInput = styleModalElement.querySelector('#nameMobileFontSize');
 const nameMobileFontSizeValue = styleModalElement.querySelector('#nameMobileFontSizeValue');
 const nameMobileFontSizePreview = styleModalElement.querySelector('#nameMobileFontSizePreview');

 // Color inputs
 const nameBgColorInput = styleModalElement.querySelector('#nameBgColor');
 const nameBgColorPreview = styleModalElement.querySelector('#nameBgColorPreview');
 const mobileBgColorInput = styleModalElement.querySelector('#mobileBgColor');
 const mobileBgColorPreview = styleModalElement.querySelector('#mobileBgColorPreview');
 const invoiceNoBgColorInput = styleModalElement.querySelector('#invoiceNoBgColor');
 const invoiceNoBgColorPreview = styleModalElement.querySelector('#invoiceNoBgColorPreview');
 const totalAmtBgColorInput = styleModalElement.querySelector('#totalAmtBgColor');
 const totalAmtBgColorPreview = styleModalElement.querySelector('#totalAmtBgColorPreview');
 const receivedAmtBgColorInput = styleModalElement.querySelector('#receivedAmtBgColor');
 const receivedAmtBgColorPreview = styleModalElement.querySelector('#receivedAmtBgColorPreview');
 const leftEyeTableBgColorInput = styleModalElement.querySelector('#leftEyeTableBgColor');
 const leftEyeTableBgColorPreview = styleModalElement.querySelector('#leftEyeTableBgColorPreview');
 const rightEyeTableBgColorInput = styleModalElement.querySelector('#rightEyeTableBgColor');
 const rightEyeTableBgColorPreview = styleModalElement.querySelector('#rightEyeTableBgColorPreview');

 // Preset buttons
 const applyDefaultPresetBtn = styleModalElement.querySelector('#applyDefaultPreset');
 const applyBluePresetBtn = styleModalElement.querySelector('#applyBluePreset');
 const applyYellowPresetBtn = styleModalElement.querySelector('#applyYellowPreset');
 const applyRedGreyPresetBtn = styleModalElement.querySelector('#applyRedGreyPreset');
 const resetStylesBtn = styleModalElement.querySelector('#resetStyles');
 const saveStyleConfigBtn = styleModalElement.querySelector('#saveStyleConfig');

 // Get preview elements
 const logoGapPreview = styleModalElement.querySelector('.logo-preview-header');
 const tablePreviewTable = styleModalElement.querySelector('.table-preview-table');

 // Update range value displays
 function updateRangeDisplay(inputElement, valueElement) {
  valueElement.textContent = inputElement.value + 'px';
 }

 function updateFontSizePreview() {
  const size = nameMobileFontSizeInput.value;
  nameMobileFontSizeValue.textContent = size + 'px';
  nameMobileFontSizePreview.style.fontSize = size + 'px';
 }

 function updateColorPreview(colorInput, previewElement) {
  previewElement.style.backgroundColor = colorInput.value;
 }

 function updateLogoGapPreview() {
  const gap = logoHeaderGapInput.value;
  logoGapPreview.style.marginLeft = gap + 'px';
  logoGapPreview.style.marginRight = gap + 'px';
 }

 function updateTdSpacingPreview() {
  const spacing = tdSpacingInput.value;
  tablePreviewTable.style.borderSpacing = spacing + 'px';
 }

 // Initialize displays
 updateRangeDisplay(clientDetailsGapInput, clientDetailsGapValue);
 updateRangeDisplay(eyeTablesGapInput, eyeTablesGapValue);
 updateRangeDisplay(billItemsGapInput, billItemsGapValue);
 updateRangeDisplay(logoHeaderGapInput, logoHeaderGapValue);
 updateRangeDisplay(tdSpacingInput, tdSpacingValue);
 updateFontSizePreview();
 updateLogoGapPreview();
 updateTdSpacingPreview();

 // Event listeners for range inputs
 clientDetailsGapInput.addEventListener('input', () => updateRangeDisplay(clientDetailsGapInput, clientDetailsGapValue));
 eyeTablesGapInput.addEventListener('input', () => updateRangeDisplay(eyeTablesGapInput, eyeTablesGapValue));
 billItemsGapInput.addEventListener('input', () => updateRangeDisplay(billItemsGapInput, billItemsGapValue));
 logoHeaderGapInput.addEventListener('input', () => {
  updateRangeDisplay(logoHeaderGapInput, logoHeaderGapValue);
  updateLogoGapPreview();
 });
 tdSpacingInput.addEventListener('input', () => {
  updateRangeDisplay(tdSpacingInput, tdSpacingValue);
  updateTdSpacingPreview();
 });
 nameMobileFontSizeInput.addEventListener('input', updateFontSizePreview);

 // Event listeners for color inputs
 nameBgColorInput.addEventListener('input', () => updateColorPreview(nameBgColorInput, nameBgColorPreview));
 mobileBgColorInput.addEventListener('input', () => updateColorPreview(mobileBgColorInput, mobileBgColorPreview));
 invoiceNoBgColorInput.addEventListener('input', () => updateColorPreview(invoiceNoBgColorInput, invoiceNoBgColorPreview));
 totalAmtBgColorInput.addEventListener('input', () => updateColorPreview(totalAmtBgColorInput, totalAmtBgColorPreview));
 receivedAmtBgColorInput.addEventListener('input', () => updateColorPreview(receivedAmtBgColorInput, receivedAmtBgColorPreview));
 leftEyeTableBgColorInput.addEventListener('input', () => updateColorPreview(leftEyeTableBgColorInput, leftEyeTableBgColorPreview));
 rightEyeTableBgColorInput.addEventListener('input', () => updateColorPreview(rightEyeTableBgColorInput, rightEyeTableBgColorPreview));

 // Preset functions
 function applyPreset(preset) {
  const presets = {
   default: {
    logoHeaderGap: '20',
    clientDetailsGap: '0',
    eyeTablesGap: '0',
    billItemsGap: '0',
    tdSpacing: '1',
    nameMobileFontSize: '14',
    nameBgColor: '#f0f0f0',
    mobileBgColor: '#f0f0f0',
    invoiceNoBgColor: '#f0f0f0',
    totalAmtBgColor: '#f0f0f0',
    receivedAmtBgColor: '#f0f0f0',
    leftEyeTableBgColor: '#ffffff',
    rightEyeTableBgColor: '#ffffff'
   },
   blue: {
    logoHeaderGap: '30',
    clientDetailsGap: '5',
    eyeTablesGap: '10',
    billItemsGap: '5',
    tdSpacing: '2',
    nameMobileFontSize: '16',
    nameBgColor: '#e3f2fd',
    mobileBgColor: '#e3f2fd',
    invoiceNoBgColor: '#bbdefb',
    totalAmtBgColor: '#90caf9',
    receivedAmtBgColor: '#64b5f6',
    leftEyeTableBgColor: '#f3f9ff',
    rightEyeTableBgColor: '#f3f9ff'
   },
   yellow: {
    logoHeaderGap: '40',
    clientDetailsGap: '8',
    eyeTablesGap: '15',
    billItemsGap: '8',
    tdSpacing: '3',
    nameMobileFontSize: '18',
    nameBgColor: '#fff8e1',
    mobileBgColor: '#fff8e1',
    invoiceNoBgColor: '#ffecb3',
    totalAmtBgColor: '#ffe082',
    receivedAmtBgColor: '#ffd54f',
    leftEyeTableBgColor: '#fffde7',
    rightEyeTableBgColor: '#fffde7'
   },
   redGrey: {
    logoHeaderGap: '25',
    clientDetailsGap: '6',
    eyeTablesGap: '12',
    billItemsGap: '6',
    tdSpacing: '1',
    nameMobileFontSize: '16',
    nameBgColor: '#ffebee',
    mobileBgColor: '#ffebee',
    invoiceNoBgColor: '#f5f5f5',
    totalAmtBgColor: '#ffcdd2',
    receivedAmtBgColor: '#ef9a9a',
    leftEyeTableBgColor: '#fafafa',
    rightEyeTableBgColor: '#f5f5f5'
   }
  };

  const selectedPreset = presets[preset];

  // Apply to inputs
  logoHeaderGapInput.value = selectedPreset.logoHeaderGap;
  clientDetailsGapInput.value = selectedPreset.clientDetailsGap;
  eyeTablesGapInput.value = selectedPreset.eyeTablesGap;
  billItemsGapInput.value = selectedPreset.billItemsGap;
  tdSpacingInput.value = selectedPreset.tdSpacing;
  nameMobileFontSizeInput.value = selectedPreset.nameMobileFontSize;
  nameBgColorInput.value = selectedPreset.nameBgColor;
  mobileBgColorInput.value = selectedPreset.mobileBgColor;
  invoiceNoBgColorInput.value = selectedPreset.invoiceNoBgColor;
  totalAmtBgColorInput.value = selectedPreset.totalAmtBgColor;
  receivedAmtBgColorInput.value = selectedPreset.receivedAmtBgColor;
  leftEyeTableBgColorInput.value = selectedPreset.leftEyeTableBgColor;
  rightEyeTableBgColorInput.value = selectedPreset.rightEyeTableBgColor;

  // Update displays
  updateRangeDisplay(logoHeaderGapInput, logoHeaderGapValue);
  updateRangeDisplay(clientDetailsGapInput, clientDetailsGapValue);
  updateRangeDisplay(eyeTablesGapInput, eyeTablesGapValue);
  updateRangeDisplay(billItemsGapInput, billItemsGapValue);
  updateRangeDisplay(tdSpacingInput, tdSpacingValue);
  updateFontSizePreview();
  updateLogoGapPreview();
  updateTdSpacingPreview();
  updateColorPreview(nameBgColorInput, nameBgColorPreview);
  updateColorPreview(mobileBgColorInput, mobileBgColorPreview);
  updateColorPreview(invoiceNoBgColorInput, invoiceNoBgColorPreview);
  updateColorPreview(totalAmtBgColorInput, totalAmtBgColorPreview);
  updateColorPreview(receivedAmtBgColorInput, receivedAmtBgColorPreview);
  updateColorPreview(leftEyeTableBgColorInput, leftEyeTableBgColorPreview);
  updateColorPreview(rightEyeTableBgColorInput, rightEyeTableBgColorPreview);
 }

 // Preset button event listeners
 applyDefaultPresetBtn.addEventListener('click', () => applyPreset('default'));
 applyBluePresetBtn.addEventListener('click', () => applyPreset('blue'));
 applyYellowPresetBtn.addEventListener('click', () => applyPreset('yellow'));
 applyRedGreyPresetBtn.addEventListener('click', () => applyPreset('redGrey'));

 resetStylesBtn.addEventListener('click', () => {
  localStorage.removeItem('styleSettings');
  applyPreset('default');
  createToast('Styles reset to default!', 'info');
 });

 // Save configuration
 saveStyleConfigBtn.addEventListener('click', async function () {
  const styleSettings = {
   logoHeaderGap: logoHeaderGapInput.value,
   clientDetailsGap: clientDetailsGapInput.value,
   eyeTablesGap: eyeTablesGapInput.value,
   billItemsGap: billItemsGapInput.value,
   tdSpacing: tdSpacingInput.value,
   nameMobileFontSize: nameMobileFontSizeInput.value,
   nameBgColor: nameBgColorInput.value,
   mobileBgColor: mobileBgColorInput.value,
   invoiceNoBgColor: invoiceNoBgColorInput.value,
   totalAmtBgColor: totalAmtBgColorInput.value,
   receivedAmtBgColor: receivedAmtBgColorInput.value,
   leftEyeTableBgColor: leftEyeTableBgColorInput.value,
   rightEyeTableBgColor: rightEyeTableBgColorInput.value
  };

  // Save to localStorage
  localStorage.setItem('styleSettings', JSON.stringify(styleSettings));

  // Close modal
  modalInstance.hide();

  // Apply styles to current invoice
  applyStyleSettings(modalElement);

  // Show success message
  createToast('Style settings saved successfully!', 'success');
 });
}

// Download current preview as Image
async function downloadCurrentImage(modalElement) {
 try {
  const data = JSON.parse(modalElement.dataset.invoiceData);
  const filename = data.filename;
  const printContentArea = modalElement.querySelector('#printContentArea');

  if (!printContentArea) {
   createToast('No print content available!', 'error');
   return;
  }

  const loadingToast = createToast('Generating image...', 'info');

  // Get content dimensions from dataset (calculated based on aspect ratio)
  const contentWidth = parseFloat(printContentArea.dataset.contentWidth || '100');
  const contentHeight = parseFloat(printContentArea.dataset.contentHeight || '200');

  // Get the invoice content
  const invoiceContent = printContentArea.querySelector('.invoice-preview');

  if (!invoiceContent) {
   loadingToast.remove();
   createToast('Invoice content not found!', 'error');
   return;
  }

  // Create a temporary div with the HTML content
  const tempDiv = document.createElement('div');

  // Use calculated content dimensions
  const width = `${contentWidth}mm`;
  const height = `${contentHeight}mm`;

  tempDiv.style.cssText = `
position: fixed;
top: 0;
left: 0;
width: ${width};
min-height: ${height};
background: white;
padding: 15px;
z-index: 9999;
box-sizing: border-box;
`;

  // Clone the content WITH styles
  const clone = invoiceContent.cloneNode(true);

  // Apply inline styles directly to the clone
  applyInlineStylesToClone(clone);

  tempDiv.appendChild(clone);
  document.body.appendChild(tempDiv);

  // Wait for images
  const images = clone.querySelectorAll('img');
  await Promise.all(Array.from(images).map(img => {
   if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
   return new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = resolve;
   });
  }));

  const canvas = await html2canvas(tempDiv, {
   scale: 2,
   useCORS: true,
   allowTaint: true,
   backgroundColor: '#ffffff',
   logging: false,
   width: tempDiv.offsetWidth,
   height: tempDiv.offsetHeight
  });

  document.body.removeChild(tempDiv);
  loadingToast.remove();

  // Convert canvas to blob
  const blob = await new Promise(resolve => {
   canvas.toBlob(resolve, 'image/jpeg', 0.95);
  });

  // Try to use Web Share API for mobile devices
  if (navigator.share) {
   try {
    const file = new File([blob], `${filename}.jpg`, { type: 'image/jpeg' });

    // Prepare share data
    const shareData = {
     title: 'Invoice',
     text: `Invoice ${data.curr_bill_info.g} from ${ensureUTF(data.clientConfig.printCompNm)}`,
     files: [file],
    };

    // Check if sharing is supported
    if (navigator.canShare && navigator.canShare(shareData)) {
     // Give user option to share or download
     const userChoice = confirm('Share invoice image via mobile apps or Download? Click OK to Share, Cancel to Download.');

     if (userChoice) {
      await navigator.share(shareData);
      createToast('Image shared successfully!', 'success');
      return;
     }
    }
   } catch (shareError) {
    console.log('Web Share API failed, falling back to download:', shareError);
    // Continue to download fallback
   }
  }

  // Fallback to download
  const link = document.createElement('a');
  link.download = filename + '.jpg';
  link.href = URL.createObjectURL(blob);
  link.click();

  // Clean up
  setTimeout(() => URL.revokeObjectURL(link.href), 100);

  createToast('Image downloaded successfully!', 'success');

 } catch (error) {
  console.error('Image download failed:', error);
  createToast('Error: ' + error.message, 'error');
 }
}

// Helper function to apply inline styles to cloned elements
function applyInlineStylesToClone(element) {
 // Apply styles to the root element
 element.style.fontFamily = 'Arial, sans-serif';
 element.style.color = '#000';
 element.style.width = '100%';
 element.style.boxSizing = 'border-box';
 element.style.background = 'white';

 // Apply styles to all child elements
 const allElements = element.querySelectorAll('*');
 allElements.forEach(el => {
  // Preserve any existing inline styles
  const computedStyle = window.getComputedStyle(el);
  for (let i = 0; i < computedStyle.length; i++) {
   const prop = computedStyle[i];
   el.style[prop] = computedStyle.getPropertyValue(prop);
  }
 });
}

// Helper functions
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

function getTotalAmtRcvd(sCurrCashInfo, showAllReceipts = false) {
 if (showAllReceipts) {
  // Return the array for detailed display
  return sCurrCashInfo || [];
 }

 // Original total calculation
 let tot442 = 0;
 for (var k in sCurrCashInfo) {
  tot442 += parseFloat(sCurrCashInfo[k].j);
 }
 return tot442;
}

function price_in_words(price) {
 var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
  dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
  tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
  handle_tens = function (dgt, prevDgt) {
   return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
  },
  handle_utlc = function (dgt, nxtDgt, denom) {
   return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
  };

 var str = "",
  digitIdx = 0,
  digit = 0,
  nxtDigit = 0,
  words = [];
 if (price += "", isNaN(parseInt(price))) str = "";
 else if (parseInt(price) > 0 && price.length <= 10) {
  for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) switch (digit = price[digitIdx] - 0, nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0, price.length - digitIdx - 1) {
   case 0:
    words.push(handle_utlc(digit, nxtDigit, ""));
    break;
   case 1:
    words.push(handle_tens(digit, price[digitIdx + 1]));
    break;
   case 2:
    words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2] ? " and" : "") : "");
    break;
   case 3:
    words.push(handle_utlc(digit, nxtDigit, "Thousand"));
    break;
   case 4:
    words.push(handle_tens(digit, price[digitIdx + 1]));
    break;
   case 5:
    words.push(handle_utlc(digit, nxtDigit, "Lakh"));
    break;
   case 6:
    words.push(handle_tens(digit, price[digitIdx + 1]));
    break;
   case 7:
    words.push(handle_utlc(digit, nxtDigit, "Crore"));
    break;
   case 8:
    words.push(handle_tens(digit, price[digitIdx + 1]));
    break;
   case 9:
    words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : " Crore") : "")
  }
  str = words.reverse().join("")
 } else str = "";
 return str
}

function formatNumbersForWhatsApp(numbers) {
  // Convert to strings with 2 decimal places
  const formattedNumbers = numbers.map(num => {
    const numValue = parseFloat(num);
    if (isNaN(numValue)) return num.toString();
    return numValue.toFixed(2);
  });
  
  // Find max length
  const maxLength = Math.max(...formattedNumbers.map(str => str.length));
  
  return formattedNumbers.map(strNum => {
    // For monospace fonts, we can use regular spaces
    const spacesNeeded = maxLength - strNum.length;
    
    // Create left padding with non-breaking spaces or regular spaces
    const padding = '_'.repeat(Math.max(0, spacesNeeded)); // Using non-breaking spaces
    
    // Add spaces before negative sign for proper alignment
    return padding + strNum;
  });
}

function convertDateFormatToIndia(date) {
 if (!date) return '';
 const d = new Date(date);
 return d.toLocaleDateString('en-IN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
 });
}

// Helper function to create toast notifications
function createToast(message, type = 'info') {
 const toastId = 'toast-' + Date.now();
 const toastHtml = `
<div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
<div class="d-flex">
<div class="toast-body">
${message}
</div>
<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
</div>
</div>
`;

 const toastContainer = document.querySelector('.toast-container') || (() => {
  const container = document.createElement('div');
  container.className = 'toast-container position-fixed top-0 end-0 p-3';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  return container;
 })();

 toastContainer.insertAdjacentHTML('beforeend', toastHtml);
 const toastEl = document.getElementById(toastId);
 const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
 toast.show();

 toastEl.addEventListener('hidden.bs.toast', () => {
  toastEl.remove();
 });

 return {
  remove: () => {
   toast.hide();
   setTimeout(() => toastEl.remove(), 300);
  }
 };
}
