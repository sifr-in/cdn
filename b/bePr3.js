/* =====================================================================
   bePr3.js - Invoice print / preview module (Mahi-Tech GST sheet style)
   ===================================================================== */
(function () {
 'use strict';

 /* ============================ 1. CONFIG ============================ */
 const MM_TO_PX = 96 / 25.4;
 const PAPER_MM = { A4: { w: 210, h: 297 }, A5: { w: 148, h: 210 } };
 const MOBILE_PREVIEW_BREAKPOINT = 640;
 const PAPER_STORE = 'paperSettings';
 const STYLE_STORE = 'styleSettings';

 const DEFAULT_PAPER = {
  paperSize: 'A4', orientation: 'portrait', fitToPage: true,
  dimensionType: 'width', printDimension: '100', position: 'top-left',
  customPaperWidth: 210, customPaperHeight: 297,
  printEyeMeasurements: true, showRemarks: true
 };

 const DEFAULT_STYLE = {
  logoHeaderGap: '10', footerPadding: '6',
  clientDetailsGap: '0', eyeTablesGap: '8', billItemsGap: '0',
  /* Selling details padding (receiver fields / invoice details) */
  clientFieldPaddingTop: '3', clientFieldPaddingBottom: '3',
  clientFieldPaddingStart: '6', clientFieldPaddingEnd: '6',
  clientDetailsPaddingTop: '4', clientDetailsPaddingBottom: '4',
  clientDetailsPaddingStart: '6', clientDetailsPaddingEnd: '6',
  /* Receiver (billed-to) party column padding */
  partyPaddingTop: '6', partyPaddingBottom: '6',
  partyPaddingStart: '8', partyPaddingEnd: '8',
  /* Section padding (top / bottom / start / end) */
  headerPaddingTop: '2', headerPaddingBottom: '16',
  headerPaddingStart: '4', headerPaddingEnd: '4',
  sectionTitlePaddingTop: '4', sectionTitlePaddingBottom: '4',
  sectionTitlePaddingStart: '6', sectionTitlePaddingEnd: '6',
  itemsCellPaddingTop: '0', itemsCellPaddingBottom: '0',
  itemsCellPaddingStart: '0', itemsCellPaddingEnd: '0',
  eyeCellPaddingTop: '0', eyeCellPaddingBottom: '0',
  eyeCellPaddingStart: '0', eyeCellPaddingEnd: '0',
  amtCellPaddingTop: '0', amtCellPaddingBottom: '0',
  amtCellPaddingStart: '0', amtCellPaddingEnd: '0',
  wordsPaddingTop: '6', wordsPaddingBottom: '6',
  wordsPaddingStart: '6', wordsPaddingEnd: '6',
  termsPaddingTop: '6', termsPaddingBottom: '6',
  termsPaddingStart: '6', termsPaddingEnd: '6',
  totalsPaddingTop: '4', totalsPaddingBottom: '4',
  totalsPaddingStart: '4', totalsPaddingEnd: '4',
  footerPaddingTop: '0', footerPaddingBottom: '0',
  footerPaddingStart: '0', footerPaddingEnd: '0',
  signaturePaddingTop: '6', signaturePaddingBottom: '6',
  signaturePaddingStart: '6', signaturePaddingEnd: '6',
  remarksPaddingTop: '3', remarksPaddingBottom: '3',
  remarksPaddingStart: '6', remarksPaddingEnd: '6',
  tdSpacing: '2', nameMobileFontSize: '13',
  /* Typography */
  fontFamily: "Arial, Helvetica, sans-serif",
  bodyFontSize: '11',
  companyNameFontSize: '22',
  headingFontSize: '16',
  tableFontSize: '9.5',
  termsFontSize: '6.8',
  lineHeight: '130',
  /* Layout */
  pageMargin: '8',
  contentWidth: '100',
  headerAlign: 'center',
  brandWeight: '900',
  logoWidth: '60',
  logoHeight: '60',
  footerGap: '0',
  /* Table */
  tableBorderWidth: '1',
  rowHeight: '0',
  colSr: '6', colDesc: '48', colHsn: '12', colQty: '8', colRate: '12', colAmt: '14',
  /* Optional header elements */
  showTagline: '1', showSlogan: '1', showPan: '1', showGstin: '1', showCopies: '1',
  inkColor: '#26385e', borderColor: '#000000', bodyTextColor: '#000000', headingColor: '#000000',
  brandColor: '#31558f', accentColor: '#319bd4',
  grandTotalColor: '#9c2e3b',
  nameBgColor: '#ffffff', mobileBgColor: '#ffffff',
  invoiceNoBgColor: '#ffffff', totalAmtBgColor: '#ffffff',
  receivedAmtBgColor: '#ffffff',
  leftEyeTableBgColor: '#ffffff', rightEyeTableBgColor: '#ffffff',
  tableHeaderBg: '#eef3fb', pageBgColor: '#ffffff',
  footerBgColor: '#ffffff', footerTextColor: '#26385e',
  headerBandBg: '#ffffff'
 };

 const THEME_PRESETS = {
  default: { ...DEFAULT_STYLE },
  blue: {
   ...DEFAULT_STYLE,
   inkColor:'#1e3a8a', brandColor:'#1d4ed8', accentColor:'#38bdf8',
   nameBgColor:'#e3f2fd', mobileBgColor:'#e3f2fd',
   invoiceNoBgColor:'#bbdefb', totalAmtBgColor:'#90caf9'
  },
  yellow: {
   ...DEFAULT_STYLE,
   inkColor:'#713f12', brandColor:'#a16207', accentColor:'#eab308',
   nameBgColor:'#fff8e1', mobileBgColor:'#fff8e1',
   invoiceNoBgColor:'#ffecb3', totalAmtBgColor:'#ffe082'
  },
  redGrey: {
   ...DEFAULT_STYLE,
   inkColor:'#3f3f46', brandColor:'#7f1d1d', accentColor:'#dc2626',
   nameBgColor:'#ffebee', mobileBgColor:'#ffebee',
   invoiceNoBgColor:'#f5f5f5', totalAmtBgColor:'#ffcdd2'
  }
 };

 const THEME_MAP = { 0: 'default' };

 const STYLE_RANGES = [
  { key:'logoHeaderGap', label:'Header gap' },
  { key:'headerPaddingTop', label:'Header padding top' },
  { key:'headerPaddingBottom', label:'Header padding bottom' },
  { key:'headerPaddingStart', label:'Header padding start' },
  { key:'headerPaddingEnd', label:'Header padding end' },
  { key:'sectionTitlePaddingTop', label:'Section title padding top' },
  { key:'sectionTitlePaddingBottom', label:'Section title padding bottom' },
  { key:'sectionTitlePaddingStart', label:'Section title padding start' },
  { key:'sectionTitlePaddingEnd', label:'Section title padding end' },
  { key:'clientFieldPaddingTop', label:'Receiver field padding top' },
  { key:'clientFieldPaddingBottom', label:'Receiver field padding bottom' },
  { key:'clientFieldPaddingStart', label:'Receiver field padding start' },
  { key:'clientFieldPaddingEnd', label:'Receiver field padding end' },
  { key:'clientDetailsPaddingTop', label:'Invoice details padding top' },
  { key:'clientDetailsPaddingBottom', label:'Invoice details padding bottom' },
  { key:'clientDetailsPaddingStart', label:'Invoice details padding start' },
  { key:'clientDetailsPaddingEnd', label:'Invoice details padding end' },
  { key:'partyPaddingTop', label:'Party column padding top' },
  { key:'partyPaddingBottom', label:'Party column padding bottom' },
  { key:'partyPaddingStart', label:'Party column padding start' },
  { key:'partyPaddingEnd', label:'Party column padding end' },
  { key:'eyeTablesGap', label:'Eye tables gap' },
  { key:'eyeCellPaddingTop', label:'Eye table cell padding top' },
  { key:'eyeCellPaddingBottom', label:'Eye table cell padding bottom' },
  { key:'eyeCellPaddingStart', label:'Eye table cell padding start' },
  { key:'eyeCellPaddingEnd', label:'Eye table cell padding end' },
  { key:'billItemsGap', label:'Bill items gap' },
  { key:'itemsCellPaddingTop', label:'Items cell padding top' },
  { key:'itemsCellPaddingBottom', label:'Items cell padding bottom' },
  { key:'itemsCellPaddingStart', label:'Items cell padding start' },
  { key:'itemsCellPaddingEnd', label:'Items cell padding end' },
  { key:'amtCellPaddingTop', label:'Amount cell padding top' },
  { key:'amtCellPaddingBottom', label:'Amount cell padding bottom' },
  { key:'amtCellPaddingStart', label:'Amount cell padding start' },
  { key:'amtCellPaddingEnd', label:'Amount cell padding end' },
  { key:'wordsPaddingTop', label:'Amount in words padding top' },
  { key:'wordsPaddingBottom', label:'Amount in words padding bottom' },
  { key:'wordsPaddingStart', label:'Amount in words padding start' },
  { key:'wordsPaddingEnd', label:'Amount in words padding end' },
  { key:'termsPaddingTop', label:'Terms padding top' },
  { key:'termsPaddingBottom', label:'Terms padding bottom' },
  { key:'termsPaddingStart', label:'Terms padding start' },
  { key:'termsPaddingEnd', label:'Terms padding end' },
  { key:'totalsPaddingTop', label:'Totals padding top' },
  { key:'totalsPaddingBottom', label:'Totals padding bottom' },
  { key:'totalsPaddingStart', label:'Totals padding start' },
  { key:'totalsPaddingEnd', label:'Totals padding end' },
  { key:'footerPaddingTop', label:'Footer padding top' },
  { key:'footerPaddingBottom', label:'Footer padding bottom' },
  { key:'footerPaddingStart', label:'Footer padding start' },
  { key:'footerPaddingEnd', label:'Footer padding end' },
  { key:'signaturePaddingTop', label:'Signature padding top' },
  { key:'signaturePaddingBottom', label:'Signature padding bottom' },
  { key:'signaturePaddingStart', label:'Signature padding start' },
  { key:'signaturePaddingEnd', label:'Signature padding end' },
  { key:'remarksPaddingTop', label:'Remarks padding top' },
  { key:'remarksPaddingBottom', label:'Remarks padding bottom' },
  { key:'remarksPaddingStart', label:'Remarks padding start' },
  { key:'remarksPaddingEnd', label:'Remarks padding end' },
  { key:'tdSpacing', label:'Table cell spacing' },
  { key:'nameMobileFontSize', label:'Name / Mobile font size' },
  { key:'bodyFontSize', label:'Body font size' },
  { key:'companyNameFontSize', label:'Company name font size' },
  { key:'headingFontSize', label:'Invoice title font size' },
  { key:'tableFontSize', label:'Table font size' },
  { key:'termsFontSize', label:'Terms font size' },
  { key:'lineHeight', label:'Line height (%)' },
  { key:'pageMargin', label:'Print margin (mm)' },
  { key:'contentWidth', label:'Content width (%)' },
  { key:'logoWidth', label:'Logo width' },
  { key:'logoHeight', label:'Logo height' },
  { key:'footerGap', label:'Footer gap' },
  { key:'tableBorderWidth', label:'Table border width' },
  { key:'rowHeight', label:'Min row height' },
  { key:'colSr', label:'Column width: Sr. No. (%)' },
  { key:'colDesc', label:'Column width: Description (%)' },
  { key:'colHsn', label:'Column width: HSN/SAC (%)' },
  { key:'colQty', label:'Column width: Qty (%)' },
  { key:'colRate', label:'Column width: Rate (%)' },
  { key:'colAmt', label:'Column width: Amount (%)' }
 ];

 const STYLE_SELECTS = [
  { key:'fontFamily', label:'Font family', options:[
   ['Arial, Helvetica, sans-serif','Arial'],
   ["'Segoe UI', Tahoma, sans-serif",'Segoe UI'],
   ["Georgia, 'Times New Roman', serif",'Georgia'],
   ["'Times New Roman', Times, serif",'Times New Roman'],
   ['system-ui, -apple-system, sans-serif','System UI']
  ]},
  { key:'headerAlign', label:'Header alignment', options:[
   ['center','Center'],['left','Left'],['right','Right']
  ]},
  { key:'brandWeight', label:'Company name weight', options:[
   ['400','Normal'],['600','Semi bold'],['700','Bold'],['900','Black']
  ]}
 ];

 const STYLE_TOGGLES = [
  { key:'showTagline', label:'Show tagline' },
  { key:'showSlogan', label:'Show slogan' },
  { key:'showPan', label:'Show PAN' },
  { key:'showGstin', label:'Show GSTIN' },
  { key:'showCopies', label:'Show invoice copies' }
 ];

 const STYLE_COLORS = [
  { key:'inkColor', label:'Border / ink' },
  { key:'borderColor', label:'Border color' },
  { key:'bodyTextColor', label:'Body text' },
  { key:'headingColor', label:'Headings' },
  { key:'brandColor', label:'Brand text' },
  { key:'accentColor', label:'Brand accent' },
  { key:'grandTotalColor', label:'Grand total text' },
  { key:'nameBgColor', label:'Name background' },
  { key:'mobileBgColor', label:'Mobile background' },
  { key:'invoiceNoBgColor', label:'Invoice no. background' },
  { key:'totalAmtBgColor', label:'Total amount background' },
  { key:'receivedAmtBgColor', label:'Received amount background' },
  { key:'leftEyeTableBgColor', label:'Left eye table background' },
  { key:'rightEyeTableBgColor', label:'Right eye table background' },
  { key:'tableHeaderBg', label:'Table header background' },
  { key:'pageBgColor', label:'Page background' },
  { key:'footerBgColor', label:'Footer background' },
  { key:'footerTextColor', label:'Footer text' },
  { key:'headerBandBg', label:'Header band background' }
 ];

 const POSITIONS = [
  ['top-left','Top Left'],['top-center','Top Center'],['top-right','Top Right'],
  ['center-left','Center Left'],['center','Center'],['center-right','Center Right'],
  ['bottom-left','Bottom Left'],['bottom-center','Bottom Center'],['bottom-right','Bottom Right']
 ];

 /* ============================ 2. UTILS ============================ */
 function num(v,d){ const n=parseFloat(v); return isNaN(n)?d:n; }
 function px(v){ return num(v,0)+'px'; }
 function mmToPx(mm){ return mm*MM_TO_PX; }
 function ensureUTF(text){
  if(!text) return '';
  const t=document.createElement('textarea'); t.innerHTML=text;
  return t.value.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
   .replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&#x2F;/g,'/');
 }
 function plainText(v){
  const raw=String(v==null?'':v).replace(/<br\s*\/?>/gi,' ').replace(/<[^>]*>/g,' ');
  return ensureUTF(raw).replace(/\s+/g,' ').trim();
 }
 function labelOf(v,f){ return plainText(v)||f; }
 function initialsOf(name){
  const w=(plainText(name)||'C').split(/\s+/).slice(0,2);
  return w.map(x=>x.charAt(0).toUpperCase()).join('');
 }
 function brandParts(name){
  const raw=plainText(name)||'Company'; const w=raw.split(/\s+/);
  if(w.length<2) return {main:raw,accent:''};
  const accent=w.pop(); return {main:w.join(' '),accent};
 }
 function convertDateFormatToIndia(date){
  if(!date) return ''; const d=new Date(date); if(isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric'});
 }
 function getTotalAmtRcvd(info){
  let t=0; for(const k in info) t+=parseFloat(info[k].j)||0; return t;
 }
 function billRound2(v){ return Math.round((Number(v)||0)*100)/100; }
 function billTaxLayout(items){
  items=items||[];
  const hasK=items.some(i=>i&&i.k!==undefined&&i.k!==null&&String(i.k).trim()!=='');
  if(hasK) return 'split';
  const splitish=items.some(i=>i&&Number.isFinite(parseFloat(i.j))&&!Number.isFinite(parseFloat(i.t)));
  return splitish?'split':'legacy';
 }
 function billItemTaxAmount(item,layout){
  if(!item) return 0;
  if(layout==='split') return (parseFloat(item.j)||0)+(parseFloat(item.k)||0);
  return parseFloat(item.t)||0;
 }
 function price_in_words(price){
  const sgl=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'],
   dbl=['Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'],
   tens=['','Ten','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'],
   ht=(d,p)=>d===0?'':' '+(d===1?dbl[p]:tens[d]),
   hu=(d,n,dn)=>(d!==0&&n!==1?' '+sgl[d]:'')+(n!==0||d>0?' '+dn:'');
  let str='',words=[]; price+='';
  if(isNaN(parseInt(price))) return '';
  if(parseInt(price)>0&&price.length<=10){
   for(let i=price.length-1;i>=0;i--){
    const d=price[i]-0,n=i>0?price[i-1]-0:0;
    switch(price.length-i-1){
     case 0: words.push(hu(d,n,'')); break;
     case 1: words.push(ht(d,price[i+1])); break;
     case 2: words.push(d!==0?' '+sgl[d]+' Hundred'+(price[i+1]!==0&&price[i+2]!==0?' and':''):''); break;
     case 3: words.push(hu(d,n,'Thousand')); break;
     case 4: words.push(ht(d,price[i+1])); break;
     case 5: words.push(hu(d,n,'Lakh')); break;
     case 6: words.push(ht(d,price[i+1])); break;
     case 7: words.push(hu(d,n,'Crore')); break;
     case 8: words.push(ht(d,price[i+1])); break;
     case 9: words.push(d!==0?' '+sgl[d]+' Hundred'+(price[i+1]!==0||price[i+2]!==0?' and':' Crore'):''); break;
    }
   }
   str=words.reverse().join('');
  }
  return str;
 }
 function formatEyeValue(v){
  if(v==null||v==='') return '';
  const n=parseFloat(v); if(isNaN(n)) return v;
  return n>0?'+'+v:v.toString();
 }
 function multiline(v){
  return ensureUTF(v).replace(/\n/g,'<br>').replace(/\r/g,'').replace(/\\n/g,'<br>');
 }
 function createToast(message,type='info'){
  const id='bepr3-toast-'+Date.now();
  const html='<div id="'+id+'" class="toast align-items-center text-bg-'+type+' border-0" role="alert">'+
   '<div class="d-flex"><div class="toast-body">'+message+'</div>'+
   '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>'+
   '</div></div>';
  let c=document.getElementById('bepr3-toast-container');
  if(!c){ c=document.createElement('div'); c.id='bepr3-toast-container';
   c.className='toast-container position-fixed top-0 end-0 p-3';
   c.style.zIndex='2147483000'; document.body.appendChild(c); }
  c.insertAdjacentHTML('beforeend',html);
  const el=document.getElementById(id);
  const t=new bootstrap.Toast(el,{delay:3000}); t.show();
  el.addEventListener('hidden.bs.toast',()=>el.remove());
  return { remove:()=>{t.hide();setTimeout(()=>el.remove(),300);} };
 }

 /* ============================ 3. STORAGE ============================ */
 function readStore(k,d){
  try{ const raw=JSON.parse(localStorage.getItem(k)||'{}'); return Object.assign({},d,raw||{}); }
  catch(e){ return Object.assign({},d); }
 }
 function paperSettings(){ return readStore(PAPER_STORE,DEFAULT_PAPER); }
 function styleSettings(){ return readStore(STYLE_STORE,DEFAULT_STYLE); }
 function hasStore(k){ try{ return localStorage.getItem(k)!==null; }catch(e){ return false; } }
 function savePaper(p){
  const n=Object.assign({},paperSettings(),p||{});
  try{ localStorage.setItem(PAPER_STORE,JSON.stringify(n)); }catch(e){}
  return n;
 }
 function saveStyle(p){
  const n=Object.assign({},styleSettings(),p||{});
  try{ localStorage.setItem(STYLE_STORE,JSON.stringify(n)); }catch(e){}
  return n;
 }
 function themeFor(n){
  const key=THEME_MAP[n]||'default';
  return Object.assign({},DEFAULT_STYLE,THEME_PRESETS[key]||THEME_PRESETS.default);
 }

 /* ============================ 4. DATA ============================ */
 async function loadBillData(billId){
  if(typeof dbDexieManager==='undefined'||!dbDexieManager) throw new Error('dbDexieManager unavailable');
  if(typeof dbnm==='undefined') throw new Error('dbnm unavailable');
  const bills=await dbDexieManager.getAllRecords(dbnm,'b')||[];
  if(!bills.length) throw new Error('No bills data available');
  const bill=bills.find(b=>b.a==billId);
  if(!bill) throw new Error('Bill info not found');
  if(!bill.g) throw new Error('Bill information incomplete');
  const clients=await dbDexieManager.getAllRecords(dbnm,'c')||[];
  const info=clients.find(c=>c.a==bill.e);
  const name_client=info?ensureUTF(info.h):null;
  const mob_client=info?info.e:null;
  const addr_client=info?ensureUTF(info.m):null;
  let state_client='', gstin_client='';
  if (info) {
   let c1 = info.c1;
   if (typeof c1 === 'string') { try { c1 = JSON.parse(c1); } catch (e) { c1 = {}; } }
   c1 = c1 || {};
   state_client = c1.g || info.g || '';
   gstin_client = c1.j || info.j || '';
  }
  const items=await dbDexieManager.getAllRecords(dbnm,'s')||[];
  const eyeRows=await dbDexieManager.getAllRecords(dbnm,'be')||[];
  const eye=eyeRows.find(x=>x.ea==billId);
  const billItemRows=await dbDexieManager.getAllRecords(dbnm,'i')||[];
  const sCurrItems=billItemRows.filter(i=>i.e==billId);
  const cashRows=await dbDexieManager.getAllRecords(dbnm,'r')||[];
  const sCurrCashInfo=cashRows.filter(i=>i.td==billId&&i.tb==7);
  let name_referrer='';
  if(eye){ const ref=clients.find(c=>c.a==eye.ef); name_referrer=ref?ensureUTF(ref.h+' '+ref.i):''; }
  let quanTotal=0,subtotal=0,taxTotal=0;
  const taxLayout=billTaxLayout(sCurrItems);
  sCurrItems.forEach(i=>{
   quanTotal+=parseInt(i.h)||0;
   subtotal+=parseFloat(i.g)||0;
   taxTotal+=billItemTaxAmount(i,taxLayout);
  });
  subtotal=billRound2(subtotal); taxTotal=billRound2(taxTotal);
  const t_itms_otal=billRound2(subtotal+taxTotal);
  const discountAmt=billRound2(parseFloat(bill.k)||0);
  const advanceAmt=billRound2(getTotalAmtRcvd(sCurrCashInfo));
  const dueValue=billRound2(t_itms_otal-discountAmt-advanceAmt);
  const dueAmt=(dueValue===0?0:dueValue).toFixed(2);
  let t1682=null,deliveryDate='';
  if(bill.i){
   try{
    let js=bill.i.replace(/^"+|"+$/g,'').replace(/\\"/g,'"').replace(/\\\\/g,'\\');
    try{ t1682=JSON.parse(js); if(t1682.dldt) deliveryDate=convertDateFormatToIndia(new Date(t1682.dldt.slice(0,10))); }
    catch(inner){ t1682={rmrk:js}; }
   }catch(outer){
    const m=bill.i.match(/\d{4}-\d{2}-\d{2}/);
    if(m){ deliveryDate=convertDateFormatToIndia(new Date(m[0]));
     const rem=bill.i.replace(/\d{4}-\d{2}-\d{2}.*?(\s|$)/,'').trim();
     if(rem) t1682={rmrk:ensureUTF(rem)};
    } else t1682={rmrk:ensureUTF(bill.i)};
   }
  }
  let remark='';
  if(t1682&&t1682.rmrk){
   remark=ensureUTF(t1682.rmrk).replace(/^"+|"+$/g,'').replace(/\\"/g,'"');
   const f=remark.match(/"rmrk"\s*:\s*"([^"]*)"/); if(f&&f[1]) remark=f[1];
  }
  const data={
   clientConfig:(typeof clientConfig!=='undefined'&&clientConfig)?clientConfig:{},
   curr_bill_info:bill, name_client, mob_client, addr_client, name_referrer, state_client, gstin_client,
   items, sCurrItems, sCurrCashInfo, quanTotal, subtotal, taxTotal, t_itms_otal,
   advanceAmt, discountAmt, dueAmt, t1682, remark, deliveryDate,
   eye_selected_msrmnt:eye,
   billDate:convertDateFormatToIndia(new Date(String(bill.f).slice(0,10))),
   filename:(name_client?.trim()||'invoice')+'_'+bill.g+'_'+convertDateFormatToIndia(new Date(String(bill.f).slice(0,10)))
  };
  data.whatsAppText=buildWhatsAppText(data);
  return data;
 }

 function buildWhatsAppText(d){
  const c=d.clientConfig||{};
  let txt=(d.mob_client||'').replace('.','')+'&text='+'Hello, *'+(d.name_client||'').trim()+'*\n';
  txt+='Details of your voucher no.*'+d.curr_bill_info.g+'*\n';
  const pad=a=>{ const m=Math.max(...a.map(s=>s.length)); return a.map(s=>'_'.repeat(m-s.length)+s); };
  if(d.discountAmt!=0){
   const a=pad([d.t_itms_otal.toFixed(2),d.discountAmt.toFixed(2),d.advanceAmt.toFixed(2),d.dueAmt]);
   txt+='`'+a[0]+'` Total\n`'+a[1]+'` Discount\n`'+a[2]+'` Received\n`'+a[3]+'` Balance';
  } else {
   const a=pad([d.t_itms_otal.toFixed(2),d.advanceAmt.toFixed(2),d.dueAmt]);
   txt+='`'+a[0]+'` Total\n`'+a[1]+'` Received\n`'+a[2]+'` Balance';
  }
  txt+='\n\n*'+ensureUTF(c.printCompNm)+'*\nThank you for choosing us.';
  return txt;
 }

 /* ============================ 5. RENDER ============================ */
 function eyeTableHTML(side,eye,vertical){
  const p=side, get=k=>(eye[p+k]==null?'':eye[p+k]);
  const dvVN=vertical?'6/'+get('d'):get('d');
  const nvVN=vertical?'N/'+get('h'):get('h');
  const label=side==='r'?'R':'L';
  const cls=side==='r'?'inv-right-eye':'inv-left-eye';
  return '<div class="inv-eye-card '+cls+'"><table class="inv-eye-table"><thead><tr>'+
   '<th class="inv-eye-corner">'+label+'</th><th>SPH</th><th>CYL</th><th>AXIS</th><th>V/N</th>'+
   '</tr></thead><tbody>'+
   '<tr><th>DV</th><td>'+formatEyeValue(get('a'))+'</td><td>'+formatEyeValue(get('b'))+'</td><td>'+get('c')+'</td><td>'+dvVN+'</td></tr>'+
   '<tr><th>NV</th><td>'+formatEyeValue(get('e'))+'</td><td>'+formatEyeValue(get('f'))+'</td><td>'+get('g')+'</td><td>'+nvVN+'</td></tr>'+
   '</tbody><tfoot>'+
   '<tr><th>ADD</th><td colspan="4">'+formatEyeValue(get('i'))+'</td></tr>'+
   '<tr><th>PD</th><td colspan="4">'+get('k')+'</td></tr>'+
   '</tfoot></table></div>';
 }
 function renderEyeSection(eye,vertical){
  if(!eye) return '';
  return '<section class="inv-eyes" data-layout="'+(vertical?'vertical':'horizontal')+'">'+
   eyeTableHTML('r',eye,vertical)+eyeTableHTML('l',eye,vertical)+'</section>';
 }
 function itemNameOf(d,item){
  const f=d.items.find(c=>c.a==item.f);
  let n='';
  if(f&&f.gn&&f.gn!='.') n=multiline(f.gn);
  // The invoice prints the item name only. The per-line description (item.i)
  // is kept in the record but not printed, so the name never wraps into a
  // second line under itself.
  if(!n && item.i) n=multiline(item.i);
  return n;
 }
 function renderItems(d){
  if(!d.sCurrItems.length) return '<tr><td colspan="6" class="inv-empty">No items</td></tr>';
  const hideTax=Number((d.clientConfig||{}).hideTax)===1;
  const layout=billTaxLayout(d.sCurrItems);
  return d.sCurrItems.map((item,index)=>{
   const qty=parseFloat(item.h)||0;
   const net=parseFloat(item.g)||0;
   const amt=hideTax?billRound2(net+billItemTaxAmount(item,layout)):net;
   const price=qty?amt/qty:0;
   const prod = d.items.find(c => c.a == item.f);
   const hsn = plainText(prod && prod.i);
   return '<tr>'+
    '<td class="inv-c">'+(index+1)+'</td>'+
    '<td class="inv-item-name">'+itemNameOf(d,item)+'</td>'+
    '<td class="inv-c">'+hsn+'</td>'+
    '<td class="inv-r">'+item.h+'</td>'+
    '<td class="inv-r">'+price.toFixed(2)+'</td>'+
    '<td class="inv-amt-cell"><span class="inv-amt-divider"></span><div class="inv-amt-inner"><span class="inv-amt-rs">'+amt.toFixed(2).split('.')[0]+'</span><span class="inv-amt-ps">'+(amt.toFixed(2).split('.')[1]||'00')+'</span></div></td>'+
    '</tr>';
  }).join('');
 }
 function receiptsTable(d){
  const rows=d.sCurrCashInfo.map(r=>{
   const dt=r.k?convertDateFormatToIndia(new Date(r.k)):'No Date';
   const amt=parseFloat(r.j||0);
   return '<tr><td class="inv-l">'+dt+'</td><td class="inv-r">'+amt.toFixed(2)+'</td></tr>';
  }).join('');
  return '<table class="inv-receipts"><colgroup><col style="width:55%"><col style="width:45%"></colgroup><thead><tr><th class="inv-l">Receipt Date</th><th class="inv-r">Amount</th></tr></thead>'+
   '<tbody>'+rows+'<tr class="inv-receipts-total"><td class="inv-l">Total Received</td><td class="inv-r">'+d.advanceAmt.toFixed(2)+'</td></tr></tbody></table>';
 }
 function detailRow(label,valueHTML){
  return '<div class="inv-details-row"><label>'+label+'</label><span class="inv-value inv-detail-value">'+valueHTML+'</span></div>';
 }

 /* ---- MAIN SHEET RENDER (Mahi-Tech GST layout) ---- */
 function renderInvoice(d,opts){
  opts=opts||{};
  const c=d.clientConfig||{};
  const showAllReceipts=c.show_all_receipts==1;
  const hasReceipts=showAllReceipts&&d.sCurrCashInfo.length>0;
  const verticalEyes=c.tbl_disp==2;
  const amountInWords=price_in_words(billRound2(d.t_itms_otal-d.discountAmt).toFixed(0));

  const company=plainText(c.printCompNm)||'Company';
  const brand=brandParts(company);
  const tagline=plainText(c.printInvoice)||'IT SERVICES & SOLUTIONS';
  const slogan=plainText(c.printSubjectTo)||'IT SOLUTIONS TODAY FOR A SMARTER TOMORROW';
  const address=plainText(c.printAdrs);
  const contact=plainText(c.printMo);
  const pan=c.printPAN||c.panNo||'';
  const gstin=c.printGSTIN||c.gstin||'';
  const state=c.printState||'Maharashtra';
  const codeNo=c.printCodeNo||c.codeNo||'';

  // Header element toggles live in the Style settings (localStorage).
  const st=(opts&&opts.style)||styleSettings();
  const on=(k)=>String(st[k]!==undefined?st[k]:DEFAULT_STYLE[k])==='1';
  const showTagline=on('showTagline');
  const showSlogan=on('showSlogan');
  const showPan=on('showPan');
  const showGstin=on('showGstin');
  const showCopies=on('showCopies');
  const panHTML=showPan&&pan?'<span class="inv-pan">PAN CARD NO.: '+pan+'</span>':'';
  const gstinHTML=showGstin&&gstin?'<span class="inv-gstin">GSTIN: '+gstin+'</span>':'';
  const copiesHTML=showCopies?'<div class="inv-copy">Original for Recipient<br>Duplicate for Transporter<br>Triplicate for Supplier</div>':'';

  const fullHeadLogo=c['logo-0_FullHead-1']==1&&!!c.print_logo;
  // When the full-head banner already contains the company details, hide the
  // text block that would otherwise print above the INVOICE title.
  const hideHeaderInfo=c['logo-0_HideInfo-1']==1;

  const brandBlock='<div class="inv-brand">'+brand.main+(brand.accent?' <span>'+brand.accent+'</span>':'')+'</div>'+
   (showTagline&&tagline?'<div class="inv-tagline">'+tagline+'</div>':'');

  const headerInfoHTML=
   brandBlock+
   (showSlogan&&slogan?'<div class="inv-slogan">'+slogan+'</div>':'')+
   (address?'<div class="inv-address">'+address+'</div>':'')+
   (panHTML||gstinHTML?'<div class="inv-idline">'+panHTML+gstinHTML+'</div>':'')+
   (contact?'<div class="inv-contact"><div>'+contact+'</div></div>':'');

  /* ---- HEADER ---- */
  let headerHTML='';
  if(fullHeadLogo){
   /* Full-head logo band: the banner image spans the full width and keeps its
      natural aspect ratio. Brand text sits below it unless the banner already
      carries the info. */
   headerHTML=
    '<header class="inv-header inv-header-full">'+
     '<div class="inv-logo-band">'+
      '<img src="'+c.print_logo+'" alt="Logo" loading="eager">'+
     '</div>'+
     (hideHeaderInfo?'':headerInfoHTML)+
     '<div class="inv-title-row"><div class="inv-title">INVOICE</div>'+copiesHTML+'</div>'+
    '</header>';
  } else {
   /* classic header with logo left, brand centre */
   const classicLogo=c.print_logo
    ?'<div class="inv-logo"><img src="'+c.print_logo+'" alt="Logo" loading="eager"></div>'
    :'<div class="inv-logo"><span>'+initialsOf(company)+'</span></div>';
   headerHTML=
    '<header class="inv-header">'+
     classicLogo+
     (showSlogan&&slogan?'<div class="inv-slogan">'+slogan+'</div>':'')+
     brandBlock+
     (address?'<div class="inv-address">'+address+'</div>':'')+
     (panHTML||gstinHTML?'<div class="inv-idline">'+panHTML+gstinHTML+'</div>':'')+
     (contact?'<div class="inv-contact"><div>'+contact+'</div></div>':'')+
     '<div class="inv-title-row"><div class="inv-title">INVOICE</div>'+copiesHTML+'</div>'+
    '</header>';
  }

  /* ---- RECEIVER + INVOICE DETAILS ---- */
  const nameHTML=d.name_client?'<span class="inv-hl inv-hl-name">'+d.name_client+'</span>':'';
  const mobileHTML=d.mob_client?'<span class="inv-hl inv-hl-mobile">'+d.mob_client+'</span>':'';

  const receiverHTML=
   '<section class="inv-meta">'+
    '<div class="inv-party">'+
     '<div class="inv-section-title">Details of Receiver (Billed to &amp; Shipped to)</div>'+
     '<div class="inv-field"><label>Name :</label><span class="inv-value">'+nameHTML+'</span></div>'+
     (d.mob_client?'<div class="inv-field"><label>Mobile :</label><span class="inv-value">'+mobileHTML+'</span></div>':'')+
     '<div class="inv-field inv-address-fields"><label>Address :</label><span class="inv-value">'+(d.addr_client||'')+'</span></div>'+
     (d.name_referrer?'<div class="inv-field"><label>Referred by :</label><span class="inv-value">'+d.name_referrer+'</span></div>':'')+
     '<div class="inv-field inv-field-inline"><label>State :</label><span class="inv-value inv-state-value">'+(d.state_client||state)+'</span>'+
      '<span class="inv-code-block"><label>code no.:</label><span class="inv-value inv-code-value">'+codeNo+'</span></span></div>'+
     '<div class="inv-field inv-gstin-row"><label>GSTIN No. :</label><span class="inv-value">'+(d.gstin_client||gstin)+'</span></div>'+
    '</div>'+
    '<div class="inv-details">'+
     '<div class="inv-details-row inv-serial-row"><label>Invoice Serial Number :</label>'+
      '<span class="inv-value inv-serial">'+d.curr_bill_info.g+'</span></div>'+
     '<div class="inv-details-row"><label>Invoice Date :</label><span class="inv-value inv-detail-value">'+d.billDate+'</span></div>'+
     (d.deliveryDate?'<div class="inv-details-row"><label>Delivery :</label><span class="inv-value">'+d.deliveryDate+'</span></div>':'')+
     '<div class="inv-details-row"><label>P.O. No. :</label><span class="inv-value" style="text-align:center;justify-content:center;"></span></div>'+
    '</div>'+
   '</section>';

  /* ---- EYES (optional) ---- */
  const eyeHTML=renderEyeSection(d.eye_selected_msrmnt,verticalEyes);

  /* ---- ITEMS TABLE (Mahi-Tech columns) ---- */
  // The empty grid lives in its own table so the item rows keep their natural
  // height. A single stretched table would spread the spare height across every
  // row, leaving big gaps between the items.
  const itemsColgroup='<colgroup><col class="inv-c-sr"><col class="inv-c-desc"><col class="inv-c-hsn"><col class="inv-c-qty"><col class="inv-c-rate"><col class="inv-c-amt"></colgroup>';
  const itemsHTML=
   '<div class="inv-items-wrap">'+
    '<table class="inv-items inv-items-main">'+
     itemsColgroup+
     '<thead><tr>'+
      '<th class="inv-c">Sr.<br>No.</th>'+
      '<th class="inv-l">Description of Goods / Services</th>'+
      '<th class="inv-c">HSN/SAC<br>Code</th>'+
      '<th class="inv-c">Qty.</th>'+
      '<th class="inv-c">Rate</th>'+
      '<th class="inv-c inv-amt-th"><div class="inv-amt-head"><div class="inv-amt-title">Amount</div><div class="inv-amt-sub"><span>Rs.</span><span>Ps.</span></div></div></th>'+
     '</tr></thead>'+
     '<tbody>'+renderItems(d)+'</tbody>'+
    '</table>'+
    '<table class="inv-items inv-items-filler" aria-hidden="true">'+
     itemsColgroup+
     '<tbody><tr class="inv-filler">'+
      '<td></td><td class="inv-filler-box-cell"><div class="inv-filler-box"></div></td><td></td><td></td><td></td><td class="inv-amt-cell"><span class="inv-amt-divider"></span></td>'+
     '</tr></tbody>'+
    '</table>'+
   '</div>';

  /* ---- BOTTOM: words + terms left, totals right ---- */
  const defaultTerms=[
   'This voucher is valid only when duly signed and/or stamped by an authorized representative of '+company+'.',
   'All payments and receipts shall be supported by the details mentioned on this voucher.',
   'The amount mentioned in words and figures should be verified before signing.',
   'Any correction, alteration or overwriting must be authenticated by the authorized signatory.',
   'Goods/services once supplied may be subject to the agreed terms of the order/work confirmation.',
   'Payment shall be made as per the agreed payment terms between the company and the customer/vendor.',
   'Applicable GST, taxes, TDS or other statutory deductions, wherever applicable, shall be dealt with as per prevailing law.',
   'GST invoice details should be maintained as applicable.',
   'This voucher does not constitute proof of payment unless the payment status is clearly marked and acknowledged by the authorized person.',
   'Any dispute relating to this voucher shall be subject to the mutually agreed terms and applicable law.',
   company+' reserves the right to verify and correct clerical or accounting errors.'
  ];
  // Optional custom terms from config: array or newline-separated string.
  let terms=defaultTerms;
  if(c.printTerms){
   const custom=Array.isArray(c.printTerms)
    ?c.printTerms.map(t=>plainText(t))
    :String(c.printTerms).split(/\r?\n/).map(t=>plainText(t));
   const cleaned=custom.filter(Boolean);
   if(cleaned.length) terms=cleaned;
  }
  const termsHTML=terms.map(t=>'<li>'+t+'</li>').join('');

  const totalRowHTML = (label, value) =>
   '<div class="inv-total-row"><div class="inv-total-label">'+label+'</div><div class="inv-total-value">'+value+'</div></div>';

  const discountRow = d.discountAmt != 0
   ? totalRowHTML('Discount', d.discountAmt.toFixed(2))
   : '';

  // Tax components. Config values win when provided; otherwise use the
  // per-item split amounts (j = tax 1, k = tax 2), which map to CGST/SGST.
  const taxSplit = billTaxLayout(d.sCurrItems) === 'split';
  const sumItemField = field => d.sCurrItems.reduce((sum, it) => sum + (parseFloat(it && it[field]) || 0), 0);
  let cgstAmt = c.cgstAmount != null ? (parseFloat(c.cgstAmount) || 0) : (taxSplit ? sumItemField('j') : 0);
  let sgstAmt = c.sgstAmount != null ? (parseFloat(c.sgstAmount) || 0) : (taxSplit ? sumItemField('k') : 0);
  let igstAmt = c.igstAmount != null ? (parseFloat(c.igstAmount) || 0) : 0;
  // Legacy layout stores one combined tax amount (t); split it evenly so the
  // invoice still shows the two tax lines instead of a generic "Add : Tax".
  if (!taxSplit && !cgstAmt && !sgstAmt && !igstAmt && d.taxTotal > 0) {
    cgstAmt = billRound2(d.taxTotal / 2);
    sgstAmt = billRound2(d.taxTotal - cgstAmt);
  }
  cgstAmt = billRound2(cgstAmt);
  sgstAmt = billRound2(sgstAmt);
  igstAmt = billRound2(igstAmt);

  // printHideTax controls only the printed invoice:
  //   1 -> hide the tax rows; 0/undefined -> show them (even when tax is 0).
  const printHideTax = Number(c.printHideTax) === 1;
  let taxRows = '';
  if (!printHideTax) {
    // The tax rows are always printed (even at 0.00). printHideTax is the only
    // switch that hides them, so the tax block never disappears from a bill.
    taxRows += totalRowHTML('Add : CGST', cgstAmt.toFixed(2));
    taxRows += totalRowHTML('Add : SGST', sgstAmt.toFixed(2));
    taxRows += totalRowHTML('Add : IGST', igstAmt.toFixed(2));
  }

  const totalsHTML=
   '<div class="inv-totals">'+
    (hasReceipts?receiptsTable(d):'')+
    totalRowHTML('Total', d.subtotal.toFixed(2))+
    taxRows +
    discountRow +
    '<div class="inv-total-row inv-grand-total"><div class="inv-total-label">TOTAL AMOUNT</div><div class="inv-total-value inv-total-bg">'+billRound2(d.t_itms_otal-d.discountAmt).toFixed(2)+'</div></div>'+
   '</div>';

     const bottomHTML = 
   '<section class="inv-bottom">' +
    '<div class="inv-bottom-left">' +
     '<div class="inv-words"><span>Rs. in Words :</span> <b class="inv-words-value">' + amountInWords + '</b></div>' +
     '<div class="inv-terms"><div class="inv-terms-title">Terms &amp; Condition :</div><ol>' + termsHTML + '</ol></div>' +
    '</div>' +
    totalsHTML +
   '</section>';

  const remarksHTML = d.remark
   ? '<div class="inv-remarks"><b>Note: </b>' + d.remark + '</div>'
   : '';

  const footerLeft = plainText(c.printFooterLeft) || 'Received Signature';
  const footerCertification = plainText(c.printFooterCertification) || 'Certified that the particulars given above are true and correct.';
  const footerFor = plainText(c.printForTtl) || ('FOR ' + company.toUpperCase());

  const footerHTML = 
   '<footer class="inv-footer">' +
    '<div class="inv-signature"><div class="inv-sign-line"></div>' + footerLeft + '</div>' +
    '<div class="inv-signature inv-signature-right">' +
     '<div class="inv-certification">' + footerCertification + '</div>' +
     '<div class="inv-company-sign">' + footerFor + '</div>' +
     '<div class="inv-sign-line"></div>' +
     '<div class="inv-auth-sign">Authorised Signatory</div>' +
    '</div>' +
   '</footer>';

  return headerHTML + receiverHTML + eyeHTML + itemsHTML + bottomHTML + remarksHTML + footerHTML;
 }

 /* ============================ 6. THEME ============================ */

 const RANGE_LIMITS = {
  logoHeaderGap: [0, 60],
  footerPadding: [0, 20],
  clientDetailsGap: [0, 40],
  clientFieldPaddingTop: [0, 40],
  clientFieldPaddingBottom: [0, 40],
  clientFieldPaddingStart: [0, 40],
  clientFieldPaddingEnd: [0, 40],
  clientDetailsPaddingTop: [0, 40],
  clientDetailsPaddingBottom: [0, 40],
  clientDetailsPaddingStart: [0, 40],
  clientDetailsPaddingEnd: [0, 40],
  partyPaddingTop: [0, 40],
  partyPaddingBottom: [0, 40],
  partyPaddingStart: [0, 40],
  partyPaddingEnd: [0, 40],
  eyeTablesGap: [0, 40],
  eyeCellPaddingTop: [0, 40],
  eyeCellPaddingBottom: [0, 40],
  eyeCellPaddingStart: [0, 40],
  eyeCellPaddingEnd: [0, 40],
  billItemsGap: [0, 40],
  itemsCellPaddingTop: [0, 40],
  itemsCellPaddingBottom: [0, 40],
  itemsCellPaddingStart: [0, 40],
  itemsCellPaddingEnd: [0, 40],
  amtCellPaddingTop: [0, 40],
  amtCellPaddingBottom: [0, 40],
  amtCellPaddingStart: [0, 40],
  amtCellPaddingEnd: [0, 40],
  wordsPaddingTop: [0, 40],
  wordsPaddingBottom: [0, 40],
  wordsPaddingStart: [0, 40],
  wordsPaddingEnd: [0, 40],
  termsPaddingTop: [0, 40],
  termsPaddingBottom: [0, 40],
  termsPaddingStart: [0, 40],
  termsPaddingEnd: [0, 40],
  totalsPaddingTop: [0, 40],
  totalsPaddingBottom: [0, 40],
  totalsPaddingStart: [0, 40],
  totalsPaddingEnd: [0, 40],
  footerPaddingTop: [0, 40],
  footerPaddingBottom: [0, 40],
  footerPaddingStart: [0, 40],
  footerPaddingEnd: [0, 40],
  signaturePaddingTop: [0, 40],
  signaturePaddingBottom: [0, 40],
  signaturePaddingStart: [0, 40],
  signaturePaddingEnd: [0, 40],
  remarksPaddingTop: [0, 40],
  remarksPaddingBottom: [0, 40],
  remarksPaddingStart: [0, 40],
  remarksPaddingEnd: [0, 40],
  headerPaddingTop: [0, 60],
  headerPaddingBottom: [0, 60],
  headerPaddingStart: [0, 60],
  headerPaddingEnd: [0, 60],
  sectionTitlePaddingTop: [0, 40],
  sectionTitlePaddingBottom: [0, 40],
  sectionTitlePaddingStart: [0, 40],
  sectionTitlePaddingEnd: [0, 40],
  tdSpacing: [0, 10],
  nameMobileFontSize: [8, 28],
  bodyFontSize: [7, 16],
  companyNameFontSize: [12, 40],
  headingFontSize: [10, 28],
  tableFontSize: [6, 16],
  termsFontSize: [5, 12],
  lineHeight: [100, 200],
  pageMargin: [0, 20],
  contentWidth: [70, 100],
  logoWidth: [24, 160],
  logoHeight: [24, 160],
  footerGap: [0, 40],
  tableBorderWidth: [0, 4],
  rowHeight: [0, 40],
  colSr: [4, 20],
  colDesc: [20, 70],
  colHsn: [6, 25],
  colQty: [5, 20],
  colRate: [6, 25],
  colAmt: [8, 30]
 };

 const RANGE_STEPS = {
  lineHeight: '5',
  tableBorderWidth: '0.5',
  pageMargin: '1',
  tableFontSize: '0.5',
  termsFontSize: '0.1'
 };

 function applyTheme(doc, style) {
  const s = Object.assign({}, DEFAULT_STYLE, style || {});
  const set = (k, v) => doc.style.setProperty(k, v);
  set('--inv-gap-logo', px(s.logoHeaderGap));
  /* Legacy single-value options kept for saved styles (no longer applied). */
  set('--inv-gap-client', px(s.clientDetailsGap));
  set('--inv-field-pad-top', px(s.clientFieldPaddingTop));
  set('--inv-field-pad-bottom', px(s.clientFieldPaddingBottom));
  set('--inv-field-pad-start', px(s.clientFieldPaddingStart));
  set('--inv-field-pad-end', px(s.clientFieldPaddingEnd));
  set('--inv-details-pad-top', px(s.clientDetailsPaddingTop));
  set('--inv-details-pad-bottom', px(s.clientDetailsPaddingBottom));
  set('--inv-details-pad-start', px(s.clientDetailsPaddingStart));
  set('--inv-details-pad-end', px(s.clientDetailsPaddingEnd));
  set('--inv-party-pad-top', px(s.partyPaddingTop));
  set('--inv-party-pad-bottom', px(s.partyPaddingBottom));
  set('--inv-party-pad-start', px(s.partyPaddingStart));
  set('--inv-party-pad-end', px(s.partyPaddingEnd));
  set('--inv-gap-eyes', px(s.eyeTablesGap));
  set('--inv-eye-pad-top', px(s.eyeCellPaddingTop));
  set('--inv-eye-pad-bottom', px(s.eyeCellPaddingBottom));
  set('--inv-eye-pad-start', px(s.eyeCellPaddingStart));
  set('--inv-eye-pad-end', px(s.eyeCellPaddingEnd));
  set('--inv-gap-items', px(s.billItemsGap));
  set('--inv-items-pad-top', px(s.itemsCellPaddingTop));
  set('--inv-items-pad-bottom', px(s.itemsCellPaddingBottom));
  set('--inv-items-pad-start', px(s.itemsCellPaddingStart));
  set('--inv-items-pad-end', px(s.itemsCellPaddingEnd));
  set('--inv-amt-pad-top', px(s.amtCellPaddingTop));
  set('--inv-amt-pad-bottom', px(s.amtCellPaddingBottom));
  set('--inv-amt-pad-start', px(s.amtCellPaddingStart));
  set('--inv-amt-pad-end', px(s.amtCellPaddingEnd));
  set('--inv-words-pad-top', px(s.wordsPaddingTop));
  set('--inv-words-pad-bottom', px(s.wordsPaddingBottom));
  set('--inv-words-pad-start', px(s.wordsPaddingStart));
  set('--inv-words-pad-end', px(s.wordsPaddingEnd));
  set('--inv-terms-pad-top', px(s.termsPaddingTop));
  set('--inv-terms-pad-bottom', px(s.termsPaddingBottom));
  set('--inv-terms-pad-start', px(s.termsPaddingStart));
  set('--inv-terms-pad-end', px(s.termsPaddingEnd));
  set('--inv-totals-pad-top', px(s.totalsPaddingTop));
  set('--inv-totals-pad-bottom', px(s.totalsPaddingBottom));
  set('--inv-totals-pad-start', px(s.totalsPaddingStart));
  set('--inv-totals-pad-end', px(s.totalsPaddingEnd));
  set('--inv-footer-pad-top', px(s.footerPaddingTop));
  set('--inv-footer-pad-bottom', px(s.footerPaddingBottom));
  set('--inv-footer-pad-start', px(s.footerPaddingStart));
  set('--inv-footer-pad-end', px(s.footerPaddingEnd));
  set('--inv-signature-pad-top', px(s.signaturePaddingTop));
  set('--inv-signature-pad-bottom', px(s.signaturePaddingBottom));
  set('--inv-signature-pad-start', px(s.signaturePaddingStart));
  set('--inv-signature-pad-end', px(s.signaturePaddingEnd));
  set('--inv-remarks-pad-top', px(s.remarksPaddingTop));
  set('--inv-remarks-pad-bottom', px(s.remarksPaddingBottom));
  set('--inv-remarks-pad-start', px(s.remarksPaddingStart));
  set('--inv-remarks-pad-end', px(s.remarksPaddingEnd));
  set('--inv-header-pad-top', px(s.headerPaddingTop));
  set('--inv-header-pad-bottom', px(s.headerPaddingBottom));
  set('--inv-header-pad-start', px(s.headerPaddingStart));
  set('--inv-header-pad-end', px(s.headerPaddingEnd));
  set('--inv-stitle-pad-top', px(s.sectionTitlePaddingTop));
  set('--inv-stitle-pad-bottom', px(s.sectionTitlePaddingBottom));
  set('--inv-stitle-pad-start', px(s.sectionTitlePaddingStart));
  set('--inv-stitle-pad-end', px(s.sectionTitlePaddingEnd));
  set('--inv-cell-pad', px(s.tdSpacing));
  set('--inv-name-size', px(s.nameMobileFontSize));
  /* Typography + layout */
  set('--inv-font-family', s.fontFamily || DEFAULT_STYLE.fontFamily);
  set('--inv-body-size', px(s.bodyFontSize));
  set('--inv-company-size', px(s.companyNameFontSize));
  set('--inv-heading-size', px(s.headingFontSize));
  set('--inv-table-size', px(s.tableFontSize));
  set('--inv-terms-size', px(s.termsFontSize));
  set('--inv-line-height', String(num(s.lineHeight, 130) / 100));
  set('--inv-page-margin', num(s.pageMargin, 8) + 'mm');
  set('--inv-content-width', num(s.contentWidth, 100) + '%');
  set('--inv-header-align', s.headerAlign || 'center');
  set('--inv-brand-weight', s.brandWeight || '900');
  set('--inv-logo-w', px(s.logoWidth));
  set('--inv-logo-h', px(s.logoHeight));
  set('--inv-footer-gap', px(s.footerGap));
  set('--inv-border-w', px(s.tableBorderWidth));
  set('--inv-row-h', num(s.rowHeight, 0) > 0 ? px(s.rowHeight) : '1px');
  set('--inv-col-sr', num(s.colSr, 6) + '%');
  set('--inv-col-desc', num(s.colDesc, 48) + '%');
  set('--inv-col-hsn', num(s.colHsn, 12) + '%');
  set('--inv-col-qty', num(s.colQty, 8) + '%');
  set('--inv-col-rate', num(s.colRate, 12) + '%');
  set('--inv-col-amt', num(s.colAmt, 14) + '%');
  set('--inv-ink', s.inkColor);
  set('--inv-border', s.borderColor);
  set('--inv-text', s.bodyTextColor);
  set('--inv-heading', s.headingColor);
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
  set('--inv-head-bg', s.tableHeaderBg);
  set('--inv-page-bg', s.pageBgColor);
  set('--inv-footer-bg', s.footerBgColor);
  set('--inv-footer-ink', s.footerTextColor);
  set('--inv-header-band-bg', s.headerBandBg);
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
  applyPrintPage(settings);
  const avail = previewAvailableWidth(refs);
  const mobile = avail > 0 && avail < MOBILE_PREVIEW_BREAKPOINT;
  layoutPaper(refs, settings, mobile, avail);
  fitPreview(refs);
  try { applyPrintFill(refs); } catch (e) { /* ignore */ }
 }

 // Keeps the printed paper size in sync with the Paper settings (A4/A5/custom, portrait/landscape).
 function applyPrintPage(settings) {
  const paper = resolvePaper(settings || {});
  let el = document.getElementById('bepr3-print-page');
  if (!el) {
   el = document.createElement('style');
   el.id = 'bepr3-print-page';
   document.head.appendChild(el);
  }
  el.textContent = '@media print { @page { size: ' + paper.w + 'mm ' + paper.h + 'mm; margin: ' + num(styleSettings().pageMargin, 8) + 'mm; } }';
  // Used by the .inv-fill-page min-height (paper height minus the page margins).
  document.documentElement.style.setProperty('--inv-page-h', paper.h + 'mm');
 }

 /* Pins the footer to the bottom of the page whenever the invoice fits on one
    page, and falls back to normal block flow for invoices that are taller than
    the page (so they paginate cleanly instead of overlapping).
    Called on preview layout, on style changes, on print, and inside the export
    node builder - the same measurement drives all three outputs. */
 function applyPrintFill(refs) {
  const doc = refs && refs.doc;
  if (!doc) return false;

  const style = refs.currentStyle || styleSettings();
  const paper = resolvePaper(refs.settings || paperSettings());
  const margin = num(style.pageMargin, 8);
  const padPx = mmToPx(margin) * 2;
  // 1mm slack: pixel rounding in print engines must not push a hairline over
  // the page and produce a blank trailing page.
  const availPx = mmToPx(paper.h - margin * 2) - mmToPx(1);

  // Measure a detached copy: exact printed width, natural block height, no
  // preview scaling, no page-fill class.
  const clone = doc.cloneNode(true);
  clone.classList.remove('inv-fill-page');
  clone.classList.add('inv-measuring');
  const wrap = document.createElement('div');
  wrap.style.cssText =
   'position:fixed;top:0;left:0;visibility:hidden;pointer-events:none;z-index:-1;' +
   'width:' + paper.w + 'mm;padding:0;margin:0;';
  wrap.appendChild(clone);
  document.body.appendChild(wrap);
  const measured = clone.scrollHeight;
  wrap.remove();

  const contentPx = Math.max(0, measured - padPx);
  const fits = contentPx <= availPx - 2;

  doc.style.setProperty('--inv-page-h', paper.h + 'mm');
  doc.style.setProperty('--inv-page-content-h', (paper.h - margin * 2) + 'mm');
  doc.style.setProperty('--inv-page-content-w', (paper.w - margin * 2) + 'mm');
  doc.classList.toggle('inv-fill-page', fits);
  doc.dataset.flow = fits ? 'fill' : 'flow';
  return fits;
 }

 function fitPreview(refs) {
  if (!refs.viewport || !refs.paper) return;
  const avail = previewAvailableWidth(refs);
  if (!avail) return;

  const mobile = avail < MOBILE_PREVIEW_BREAKPOINT;
  const settings = refs.settings || paperSettings();
  const currentWidth = parseFloat(refs.paper.style.width) || 0;

  if (!refs.previewMode || mobile !== (refs.previewMode === 'mobile') || (mobile && Math.abs(currentWidth - avail) > 0.5)) {
   layoutPaper(refs, settings, mobile, avail);
  }

  const paperW = refs.paper.offsetWidth || 1;
  const paperH = refs.paper.offsetHeight || 1;
  const zoom = refs.zoom || 1;

  if (mobile) {
   refs.paper.style.transform = zoom === 1 ? '' : 'scale(' + zoom + ')';
   refs.paper.style.transformOrigin = 'top left';
   refs.spacer.style.width = (paperW * zoom) + 'px';
   refs.spacer.style.height = (paperH * zoom) + 'px';
   return;
  }

  const MAX_FIT_SCALE = 1;
  const fitScale = Math.min(avail / paperW, MAX_FIT_SCALE);
  let scale = fitScale * zoom;
  scale = Math.max(0.1, Math.min(scale, 6));

  refs.paper.style.transform = 'scale(' + scale + ')';
  refs.paper.style.transformOrigin = 'top left';
  refs.spacer.style.width = (paperW * scale) + 'px';
  refs.spacer.style.height = (paperH * scale) + 'px';

  // Keep the page-fill decision in sync with the current paper settings so the
  // preview, print and PDF all use the same layout state.
  try { applyPrintFill(refs); } catch (e) { /* ignore measurement glitches */ }
 }

 /* ========================= 8. SHELL HTML ========================= */

 const SHELL_HTML = '<div class="bepr-shell">' +
  '<div class="bepr-toolbar">' +
  '<div class="bepr-toolbar-group"><h6 class="bepr-title">Invoice Preview</h6></div>' +
  '<div class="bepr-toolbar-group">' +
  '<button type="button" class="bepr-btn" id="beprPaperBtn" title="Paper settings"><i class="fas fa-cog"></i><span class="bepr-btn-label">Paper</span></button>' +
  '<button type="button" class="bepr-btn" id="beprStyleBtn" title="Style settings"><i class="fas fa-palette"></i><span class="bepr-btn-label">Style</span></button>' +
  '<button type="button" class="bepr-btn" id="beprPrintBtn" title="Print invoice"><i class="fas fa-print"></i><span class="bepr-btn-label">Print</span></button>' +
  '<button type="button" class="bepr-btn bepr-btn-pdf" id="beprPdfBtn" title="Show PDF"><i class="fas fa-file-pdf"></i><span class="bepr-btn-label">PDF</span></button>' +
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
   const step = RANGE_STEPS[r.key] || '1';
   const value = current[r.key] !== undefined ? current[r.key] : DEFAULT_STYLE[r.key];
   return '<label class="bepr-field">' +
    '<span>' + r.label + ' <b class="bepr-out" data-out="' + r.key + '">' + value + '</b></span>' +
    '<input type="range" data-style="' + r.key + '" min="' + limits[0] + '" max="' + limits[1] + '" step="' + step + '" value="' + value + '">' +
    '</label>';
  }).join('');

  const selectsHTML = STYLE_SELECTS.map(sel => {
   const value = current[sel.key] !== undefined ? current[sel.key] : DEFAULT_STYLE[sel.key];
   const opts = sel.options.map(o =>
    '<option value="' + o[0] + '"' + (String(o[0]) === String(value) ? ' selected' : '') + '>' + o[1] + '</option>'
   ).join('');
   return '<label class="bepr-field"><span>' + sel.label + '</span>' +
    '<select data-style="' + sel.key + '">' + opts + '</select></label>';
  }).join('');

  const togglesHTML = STYLE_TOGGLES.map(t => {
   const checked = String(current[t.key] !== undefined ? current[t.key] : DEFAULT_STYLE[t.key]) === '1';
   return '<label class="bepr-switch bepr-block"><input type="checkbox" data-style="' + t.key + '"' + (checked ? ' checked' : '') + '> <span>' + t.label + '</span></label>';
  }).join('');

  const colorsHTML = STYLE_COLORS.map(c => {
   const value = current[c.key] || DEFAULT_STYLE[c.key];
   return '<label class="bepr-color-field"><span>' + c.label + '</span>' +
    '<input type="color" data-style="' + c.key + '" value="' + value + '"></label>';
  }).join('');

  const html = '<div class="bepr-modal-body">' +
   '<h6 class="bepr-modal-title">Style settings</h6>' +
   '<div class="bepr-fields">' + rangesHTML + selectsHTML + '</div>' +
   '<h6 class="bepr-modal-title">Header elements</h6>' +
   '<div class="bepr-fields">' + togglesHTML + '</div>' +
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
    out[input.dataset.style] = input.type === 'checkbox' ? (input.checked ? '1' : '0') : input.value;
   });
   return out;
  };

  const setInputValue = (input, value) => {
   if (!input) return;
   if (input.type === 'checkbox') input.checked = String(value) === '1';
   else input.value = value;
  };

  const syncOutputs = () => {
   content.querySelectorAll('[data-out]').forEach(out => {
    const input = content.querySelector('[data-style="' + out.dataset.out + '"]');
    if (input) out.textContent = input.value;
   });
  };

  const applyLive = () => applyTheme(refs.doc, readForm());

  // Header element toggles change the markup, so re-render the sheet when they change.
  const rerender = (style) => {
   if (!refs.renderData) return;
   refs.doc.innerHTML = renderInvoice(refs.renderData, { style: style || readForm() });
   applyTheme(refs.doc, style || readForm());
   // Re-apply paper visibility choices (eye tables / remarks) after replacing the markup.
   if (refs.settings) applyPaper(refs, refs.settings);
  };

  content.addEventListener('input', event => {
   if (!event.target.dataset || !event.target.dataset.style) return;
   syncOutputs();
   if (event.target.type === 'checkbox') rerender();
   else applyLive();
  });

  content.querySelectorAll('[data-preset]').forEach(btn => {
   btn.addEventListener('click', () => {
    const preset = THEME_PRESETS[btn.dataset.preset];
    if (!preset) return;
    Object.keys(preset).forEach(key => {
     const input = content.querySelector('[data-style="' + key + '"]');
     setInputValue(input, preset[key]);
    });
    syncOutputs();
    rerender();
   });
  });

  content.querySelector('#beprStyleReset').addEventListener('click', () => {
   Object.keys(DEFAULT_STYLE).forEach(key => {
    const input = content.querySelector('[data-style="' + key + '"]');
    setInputValue(input, DEFAULT_STYLE[key]);
   });
   syncOutputs();
   rerender();
  });

  let saved = false;
  content.querySelector('#beprStyleSave').addEventListener('click', () => {
   const values = readForm();
   saveStyle(values);
   refs.currentStyle = values;
   saved = true;
   rerender(values);
   instance.hide();
   createToast('Style settings saved', 'success');
  });

  modal.modalElement.addEventListener('hidden.bs.modal', () => {
   if (!saved) rerender(refs.currentStyle || styleSettings());
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

 function pdfPageIsBlank(pdf, pageNo) {
  try {
   const pages = pdf.internal && pdf.internal.pages;
   if (!pages || !pages[pageNo]) return true;
   const content = (pages[pageNo] || []).join('');
   // html2pdf writes each page as one image. A trailing page that only holds a
   // hairline of that image (sub-pixel rounding) is effectively blank. Never
   // drop a page that still carries text or other drawing operators.
   const re = /([\d.]+)\s+0\s+0\s+([\d.]+)\s+[\d.-]+\s+[\d.-]+\s+cm\s*\/[A-Za-z0-9]+\s+Do/g;
   let match;
   let last = null;
   while ((match = re.exec(content))) last = match;
   if (!last) return content.trim().length < 50;
   if (/(?:\bTj\b|\bTJ\b)/.test(content)) return false;
   return parseFloat(last[2]) < 2;
  } catch (e) {
   return false;
  }
 }

 function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.onload = () => resolve(reader.result);
   reader.onerror = reject;
   reader.readAsDataURL(blob);
  });
 }

 /* html2canvas cannot capture a cross-origin logo unless the host sends CORS
    headers. Inline every export image as a data URL first, using a CORS image
    proxy only when the direct request is blocked. */
 async function inlineExportImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(imgs.map(async img => {
   const src = img.getAttribute('src');
   if (!src || /^(data|blob):/i.test(src)) return;

   let blob = null;
   try {
    const res = await fetch(src, { mode: 'cors', credentials: 'omit' });
    if (res.ok && /^image\//i.test(res.headers.get('content-type') || '')) blob = await res.blob();
   } catch (e) { /* CORS blocked; try the proxy below */ }

   if (!blob) {
    try {
     const res = await fetch('https://wsrv.nl/?url=' + encodeURIComponent(src));
     if (res.ok && /^image\//i.test(res.headers.get('content-type') || '')) blob = await res.blob();
    } catch (e) { /* leave the original src if the proxy also fails */ }
   }

   if (!blob) return;
   try {
    img.src = await blobToDataURL(blob);
    img.removeAttribute('crossorigin');
   } catch (e) { /* keep the original src */ }
  }));
 }

 function buildExportNode(refs, s, opts) {
  const paper = resolvePaper(s);
  const fit = s.fitToPage !== false;
  const dim = num(s.printDimension, 100);
  const bare = !!(opts && opts.bare);
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

  // Use the same content width and page margin as the print stylesheet so the
  // PDF canvas and the browser printout share one layout.
  let pageMargin = '8mm';
  let contentWidth = '100%';
  if (refs.doc) {
   const computed = getComputedStyle(refs.doc);
   pageMargin = computed.getPropertyValue('--inv-page-margin').trim() || pageMargin;
   contentWidth = computed.getPropertyValue('--inv-content-width').trim() || contentWidth;
  }

  const clone = refs.doc.cloneNode(true);
  // For PDF pagination the page margin is supplied by html2pdf/jsPDF, so every
  // page keeps it. Padding on the element would only apply to the first page.
  const marginMm = isNaN(parseFloat(pageMargin)) ? num(styleSettings().pageMargin, 8) : parseFloat(pageMargin);
  // Same 1 mm slack as applyPrintFill(): without it the footer's bottom border
  // lands exactly on the PDF page boundary and html2pdf pushes the whole footer
  // to the next page, leaving a blank band above it.
  const pageSlackMm = 1;
  const flow = !!(refs.doc && refs.doc.dataset && refs.doc.dataset.flow === 'flow');
  clone.style.width = contentWidth;
  clone.style.maxWidth = '100%';
  clone.style.height = 'auto';
  clone.style.minHeight = (bare ? Math.max(0, hmm - marginMm * 2 - pageSlackMm) : hmm) + 'mm';
  if (bare && flow) {
   // Tall invoice: let the content decide the height instead of pinning the
   // footer to the bottom of a full page.
   clone.style.minHeight = '0';
   clone.style.display = 'block';
  }
  clone.style.padding = bare ? '0' : pageMargin;
  clone.style.overflow = 'visible';
  clone.style.boxSizing = 'border-box';

  // Copy the live fill/flow state. When the invoice fits one page, the
  // min-height plus .inv-items-wrap flex:1 pin the footer to the bottom. When
  // it does not, data-flow="flow" switches the clone to block flow so it
  // paginates cleanly. This is what makes the PDF footer behave like print.
  if (refs.doc) {
   if (refs.doc.classList.contains('inv-fill-page')) clone.classList.add('inv-fill-page');
   if (refs.doc.dataset && refs.doc.dataset.flow) clone.dataset.flow = refs.doc.dataset.flow;
   // The paper content height lives on documentElement (applyPrintPage), so the
   // clone inherits it via CSS var - nothing else to copy.
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
   await inlineExportImages(node);
   await waitImages(node);

   const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    // Keep the canvas clean: a tainted canvas makes toBlob()/PDF export fail.
    allowTaint: false,
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

 async function showPdf(refs, data, button, targetWindow) {
  const toast = createToast('Generating PDF...', 'info');
  let node = null;
  let pdfUrl = null;
  if (button) button.disabled = true;
  try {
   if (typeof html2pdf !== 'function') throw new Error('PDF module is not loaded');
   if (typeof html2canvas !== 'function') throw new Error('html2canvas is not loaded');

   // Keep the PDF geometry in sync with print (fill vs flow, current page size).
   try { applyPrintFill(refs); } catch (e) { /* ignore measurement glitches */ }

   const s = paperSettings();
   const paper = resolvePaper(s);
   let marginMm = num(styleSettings().pageMargin, 8);
   if (refs.doc) {
    const fromCss = parseFloat(getComputedStyle(refs.doc).getPropertyValue('--inv-page-margin'));
    if (!isNaN(fromCss)) marginMm = fromCss;
   }
   node = buildExportNode(refs, s, { bare: true });
   document.body.appendChild(node);
   await inlineExportImages(node);
   await waitImages(node);

   const filename = String(data.filename || ('invoice_' + Date.now())).replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim();

   const exportEl = node.firstElementChild || node;

   const opt = {
    margin: marginMm,
    filename: filename + '.pdf',
    image: { type: 'jpeg', quality: 0.99 },
    html2canvas: {
     scale: 4,
     useCORS: true,
     // Keep the canvas clean: a tainted canvas makes toBlob()/PDF export fail.
     allowTaint: false,
     backgroundColor: '#ffffff',
     logging: false,
     // +2px prevents 1px borders on the content edge from being clipped by
     // html2canvas's pixel-rounded canvas (PDF only).

     width: Math.ceil((paper.w - 2 * marginMm) / 25.4 * 96) + 2,
     height: Math.ceil((paper.h - 2 * marginMm) / 25.4 * 96) + 2
    },
    jsPDF: { unit: 'mm', format: [paper.w, paper.h], orientation: paper.w > paper.h ? 'landscape' : 'portrait' },
    pagebreak: {
     mode: ['css', 'legacy'],
     avoid: ['.inv-items tr', '.inv-items thead', '.inv-meta', '.inv-header', '.inv-bottom', '.inv-footer']
    }
   };

   // Element mode lets html2pdf honour the page-break rules above, so a long
   // item row is moved to the next page instead of being sliced in half.
   const pdf = await html2pdf().set(opt).from(exportEl, 'element').toPdf().get('pdf');
   if (!pdf) throw new Error('Could not create PDF');

   node.remove();
   node = null;

   // Sub-pixel rounding can leave a hairline-only last page; drop it.
   try {
    while (pdf.getNumberOfPages() > 1 && pdfPageIsBlank(pdf, pdf.getNumberOfPages())) {
     pdf.deletePage(pdf.getNumberOfPages());
    }
   } catch (pageErr) {
    console.warn('bePr3: could not trim trailing PDF page', pageErr);
   }

   const blob = pdf.output('blob');
   if (!blob) throw new Error('Could not create PDF');
   pdfUrl = URL.createObjectURL(blob);

   if (targetWindow && !targetWindow.closed) {
    // The tab was opened synchronously from the click, so it is not popup-blocked.
    targetWindow.location.href = pdfUrl;
    createToast('PDF opened in a new tab', 'success');
   } else {
    // No tab available - download the PDF instead so the click still works.
    const link = document.createElement('a');
    link.download = filename + '.pdf';
    link.href = pdfUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
    createToast('PDF downloaded successfully!', 'success');
   }
   setTimeout(() => { try { URL.revokeObjectURL(pdfUrl); } catch (e) {} }, 60000);
  } catch (err) {
   console.error('bePr3: PDF export failed', err);
   if (targetWindow && !targetWindow.closed) targetWindow.close();
   createToast('Error: ' + err.message, 'danger');
  } finally {
   if (node) node.remove();
   if (button) button.disabled = false;
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
.bepr-btn-pdf { background:#dc3545; border-color:#dc3545; color:#fff; }
.bepr-btn-pdf:hover { background:#bb2d3b; color:#fff; }
.bepr-btn-pdf:disabled { opacity:.65; cursor:progress; }
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

/* ------------------- mobile preview (preview only) ------------------- */
.bepr-paper.bepr-mobile { position:relative; top:auto; left:auto; height:auto; min-height:0; box-shadow:0 4px 16px rgba(0,0,0,.16); }
.bepr-paper.bepr-mobile .bepr-stage { position:relative; inset:auto; display:block; overflow:visible; }
.bepr-paper.bepr-mobile .bepr-content { width:100%; height:auto; overflow:visible; }
.bepr-paper.bepr-mobile #beprDoc { width:100%; height:auto; min-height:0; overflow:visible; padding:10px 12px; font-size:10px; overflow-wrap:anywhere; }

.bepr-paper.bepr-mobile #beprDoc .inv-header { padding-bottom:var(--inv-header-pad-bottom,4px); }
.bepr-paper.bepr-mobile #beprDoc .inv-brand { font-size:clamp(17px,5vw,20px); }
.bepr-paper.bepr-mobile #beprDoc .inv-tagline { font-size:8.5px; letter-spacing:2px; }
.bepr-paper.bepr-mobile #beprDoc .inv-slogan { width:94px; max-width:40%; padding:4px; font-size:7px; }
.bepr-paper.bepr-mobile #beprDoc .inv-logo { width:42px; height:42px; font-size:6px; }
.bepr-paper.bepr-mobile #beprDoc .inv-address { margin-top:4px; font-size:9px; }
.bepr-paper.bepr-mobile #beprDoc .inv-contact { font-size:7.5px; gap:0; margin-top:4px; }
.bepr-paper.bepr-mobile #beprDoc .inv-title { font-size:14px; }
.bepr-paper.bepr-mobile #beprDoc .inv-copy { position:static; display:inline-block; margin-top:4px; font-size:7.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-title-row { grid-template-columns:1fr auto 1fr; gap:4px; margin-top:4px; }
.bepr-paper.bepr-mobile #beprDoc .inv-title-row .inv-title { margin:0; }
.bepr-paper.bepr-mobile #beprDoc .inv-title-row .inv-copy { margin:0; font-size:7px; }

.bepr-paper.bepr-mobile #beprDoc .inv-section-title { padding:var(--inv-stitle-pad-top,4px) var(--inv-stitle-pad-end,4px) var(--inv-stitle-pad-bottom,4px) var(--inv-stitle-pad-start,4px); font-size:9px; white-space:normal; margin-bottom:6px; }
.bepr-paper.bepr-mobile #beprDoc .inv-field { min-height:22px; padding:var(--inv-field-pad-top,3px) var(--inv-field-pad-end,4px) var(--inv-field-pad-bottom,3px) var(--inv-field-pad-start,4px); gap:0; }
.bepr-paper.bepr-mobile #beprDoc .inv-value { min-height:13px; }
.bepr-paper.bepr-mobile #beprDoc .inv-address-fields .inv-value { min-height:22px; }
.bepr-paper.bepr-mobile #beprDoc .inv-party { padding:var(--inv-party-pad-top,4px) var(--inv-party-pad-end,5px) var(--inv-party-pad-bottom,4px) var(--inv-party-pad-start,5px); }
.bepr-paper.bepr-mobile #beprDoc .inv-party .inv-gstin-row { padding-left:calc(var(--inv-party-pad-start,5px) + var(--inv-field-pad-start,4px)); padding-right:calc(var(--inv-party-pad-end,5px) + var(--inv-field-pad-end,4px)); }
.bepr-paper.bepr-mobile #beprDoc .inv-details-row { min-height:26px; padding:var(--inv-details-pad-top,3px) var(--inv-details-pad-end,4px) var(--inv-details-pad-bottom,3px) var(--inv-details-pad-start,4px); gap:0; }
.bepr-paper.bepr-mobile #beprDoc .inv-hl { font-size:calc(var(--inv-name-size,14px) * 0.85); }

.bepr-paper.bepr-mobile #beprDoc .inv-eyes { gap:5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-eye-table { font-size:7.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-eye-table th,
.bepr-paper.bepr-mobile #beprDoc .inv-eye-table td { padding:calc(1px + var(--inv-cell-pad,1px) + var(--inv-eye-pad-top,0px)) calc(1px + var(--inv-eye-pad-end,0px)) calc(1px + var(--inv-cell-pad,1px) + var(--inv-eye-pad-bottom,0px)) calc(1px + var(--inv-eye-pad-start,0px)); }
.bepr-paper.bepr-mobile #beprDoc .inv-eye-corner { width:16%; }

.bepr-paper.bepr-mobile #beprDoc .inv-items-wrap { min-height:0; }
.bepr-paper.bepr-mobile #beprDoc .inv-items { font-size:8.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-items th { font-size:8.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-items th,
.bepr-paper.bepr-mobile #beprDoc .inv-items td { padding:calc(3px + var(--inv-items-pad-top,0px)) calc(2px + var(--inv-items-pad-end,0px)) calc(3px + var(--inv-items-pad-bottom,0px)) calc(2px + var(--inv-items-pad-start,0px)); }
.bepr-paper.bepr-mobile #beprDoc .inv-items .inv-filler-box { min-height:18mm; }

.bepr-paper.bepr-mobile #beprDoc .inv-words { min-height:28px; padding:var(--inv-words-pad-top,4px) var(--inv-words-pad-end,5px) var(--inv-words-pad-bottom,4px) var(--inv-words-pad-start,5px); font-size:8.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-words-value { min-height:12px; margin-top:3px; }
.bepr-paper.bepr-mobile #beprDoc .inv-terms { padding:var(--inv-terms-pad-top,4px) var(--inv-terms-pad-end,5px) var(--inv-terms-pad-bottom,4px) var(--inv-terms-pad-start,5px); }
.bepr-paper.bepr-mobile #beprDoc .inv-terms-title { font-size:8.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-terms ol { font-size:7px; padding-left:11px; }
.bepr-paper.bepr-mobile #beprDoc .inv-total-row { min-height:20px; }
.bepr-paper.bepr-mobile #beprDoc .inv-total-label,
.bepr-paper.bepr-mobile #beprDoc .inv-total-value { padding:var(--inv-totals-pad-top,3px) var(--inv-totals-pad-end,3px) var(--inv-totals-pad-bottom,3px) var(--inv-totals-pad-start,3px); }
.bepr-paper.bepr-mobile #beprDoc .inv-grand-total { min-height:28px; }
.bepr-paper.bepr-mobile #beprDoc .inv-receipts { font-size:7.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-remarks { padding:var(--inv-remarks-pad-top,3px) var(--inv-remarks-pad-end,5px) var(--inv-remarks-pad-bottom,3px) var(--inv-remarks-pad-start,5px); font-size:7.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-footer { min-height:48px; }
.bepr-paper.bepr-mobile #beprDoc .inv-signature { padding:var(--inv-signature-pad-top,4px) var(--inv-signature-pad-end,4px) var(--inv-signature-pad-bottom,4px) var(--inv-signature-pad-start,4px); font-size:8px; }
.bepr-paper.bepr-mobile #beprDoc .inv-certification { font-size:6.5px; }
.bepr-paper.bepr-mobile #beprDoc .inv-company-sign { font-size:9px; margin-bottom:6px; }

/* ------------------------- invoice sheet (Mahi-Tech GST) ------------------------- */
#beprDoc {
 position:relative;
 width:var(--inv-content-width,100%);
 max-width:100%;
 margin:0 auto;
 box-sizing:border-box;
 padding:var(--inv-page-margin,8mm);
 background:var(--inv-page-bg,#fff);
 color:var(--inv-text,#000);
 font-family:var(--inv-font-family, Arial, Helvetica, sans-serif);
 font-size:var(--inv-body-size,11px);
 line-height:var(--inv-line-height,1.3);
 display:flex;
 flex-direction:column;
 /* Stretch to the printable page height so .inv-items-wrap can absorb the
    spare space and the footer touches the page bottom. When the content is
    taller than the page this min-height is simply exceeded and the content
    flows (and paginates) normally. */
 min-height:calc(var(--inv-page-content-h, 281mm) - 1mm);
}

/* Flow mode: content is taller than one page. Normal block flow keeps the
   preview, print, PDF and image export identical instead of pinning the
   footer to the bottom of a full-height flex column. */
#beprDoc[data-flow="flow"] { display:block !important; min-height:0 !important; }
#beprDoc[data-flow="flow"] .inv-items-wrap { flex:0 0 auto !important; }

/* Header */
#beprDoc .inv-header { position:relative; text-align:var(--inv-header-align,center); padding:var(--inv-header-pad-top,2px) var(--inv-header-pad-end,4px) var(--inv-header-pad-bottom,16px) var(--inv-header-pad-start,4px); flex:0 0 auto; }
/* Reserve room for the absolutely-positioned logo so long company names never overlap it. */
#beprDoc .inv-header:not(.inv-header-full) { padding-left:calc(var(--inv-logo-w,60px) + 12px); padding-right:calc(var(--inv-logo-w,60px) + 12px); }
/* Full-head banner reaches both page edges. */
#beprDoc .inv-header.inv-header-full { padding-left:0; padding-right:0; }
#beprDoc .inv-brand { color:var(--inv-brand,#31558f); font-size:var(--inv-company-size,22px); font-weight:var(--inv-brand-weight,900); line-height:1.1; overflow-wrap:anywhere; letter-spacing: 0.5px;}
#beprDoc .inv-brand span { color:var(--inv-accent,#319bd4); }
#beprDoc .inv-tagline { margin-top:2px; color:var(--inv-brand,#31558f); font-size:9px; font-weight:700; letter-spacing:1px; text-transform:uppercase; }
#beprDoc .inv-slogan { position:absolute; top:0; right:0; width:120px; padding:6px; background:var(--inv-brand,#1e3a8a); color:#fff; font-size:7px; font-weight:700; line-height:1.2; text-align:center; clip-path:polygon(0 0,100% 0,100% 100%); }
#beprDoc .inv-logo { position:absolute; left:0; top:5px; width:var(--inv-logo-w,60px); height:var(--inv-logo-h,60px); display:flex; align-items:center; justify-content:center; text-align:center; padding:4px; color:var(--inv-brand,#31558f); font-size:8px; font-weight:700; overflow:hidden; }
#beprDoc .inv-logo img { width:100%; height:100%; object-fit:contain; }
#beprDoc .inv-logo-band { width:100%; height:auto; margin:0 0 4px; box-sizing:border-box; overflow:hidden; position:relative; background:var(--inv-header-band-bg, #fff); }
#beprDoc .inv-logo-band img { display:block; width:100%; height:auto; }
#beprDoc .inv-address { margin-top:4px; font-size:var(--inv-table-size,9.5px); }
#beprDoc .inv-idline { margin-top:3px; display:flex; justify-content:center; gap:15px; font-size:8.5px; font-weight:700; }
#beprDoc .inv-contact { display:flex; justify-content:space-between; gap:0; margin-top:4px; color:var(--inv-text,#000); font-size:8px; padding:0 10px; }
#beprDoc .inv-title { margin:5px 0 0; font-size:var(--inv-heading-size,16px); font-weight:900; letter-spacing:1px; color:var(--inv-heading,#000); }
#beprDoc .inv-copy { margin:4px 0 0 auto; width:max-content; max-width:70%; border:var(--inv-border-w,1px) solid var(--inv-border,#000); padding:2px 4px; font-size:6.5px; text-align:left; line-height:1.3; }
/* Title + copy badges on a single line: INVOICE stays centred, copies sit at the right edge. */
#beprDoc .inv-title-row { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:8px; margin-top:5px; }
#beprDoc .inv-title-row .inv-title { grid-column:2; justify-self:center; margin:0; }
#beprDoc .inv-title-row .inv-copy { grid-column:3; justify-self:end; margin:0; }

/* Meta Section (Receiver + Details) */
#beprDoc .inv-meta { display:grid; grid-template-columns:1.1fr 0.9fr; border-top:var(--inv-border-w,1px) solid var(--inv-border,#000); border-bottom:0; flex:0 0 auto; }
/* Vertical borders live on the children: html2canvas does not reliably
   render left/right borders on a CSS grid container, so the frame's sides
   were showing as broken/dotted lines in the PDF. */
#beprDoc .inv-meta > :first-child { border-left:var(--inv-border-w,1px) solid var(--inv-border,#000); border-right:var(--inv-border-w,1px) solid var(--inv-border,#000); box-shadow:inset var(--inv-border-w,1px) 0 0 0 var(--inv-border,#000), inset calc(-1 * var(--inv-border-w,1px)) 0 0 0 var(--inv-border,#000); }
#beprDoc .inv-meta > :last-child { border-right:var(--inv-border-w,1px) solid var(--inv-border,#000); box-shadow:inset calc(-1 * var(--inv-border-w,1px)) 0 0 0 var(--inv-border,#000); }
#beprDoc .inv-party { border-right:var(--inv-border-w,1px) solid var(--inv-border,#000); min-width:0; padding:var(--inv-party-pad-top,6px) var(--inv-party-pad-end,8px) var(--inv-party-pad-bottom,6px) var(--inv-party-pad-start,8px); }
/* GSTIN row carries its separator on top, full width, so it stays a distinct
   row and lines up with the outer frame even when the party padding changes. */
#beprDoc .inv-party .inv-gstin-row { border-top:var(--inv-border-w,1px) solid var(--inv-border,#000); margin-left:calc(-1 * var(--inv-party-pad-start,8px)); margin-right:calc(-1 * var(--inv-party-pad-end,8px)); padding-left:calc(var(--inv-party-pad-start,8px) + var(--inv-field-pad-start,6px)); padding-right:calc(var(--inv-party-pad-end,8px) + var(--inv-field-pad-end,6px)); }
#beprDoc .inv-gstin-row .inv-value { border-bottom:0; }
#beprDoc .inv-section-title { padding:var(--inv-stitle-pad-top,4px) var(--inv-stitle-pad-end,6px) var(--inv-stitle-pad-bottom,4px) var(--inv-stitle-pad-start,6px); font-weight:700; font-size:var(--inv-table-size,9.5px); border-bottom:0; margin-bottom:8px; white-space:nowrap; color:var(--inv-heading,#000); }
#beprDoc .inv-field { display:flex; align-items:flex-end; gap:0; min-height:20px; padding:var(--inv-field-pad-top,3px) var(--inv-field-pad-end,6px) var(--inv-field-pad-bottom,3px) var(--inv-field-pad-start,6px); }
#beprDoc .inv-field label { flex-shrink:0; white-space:nowrap; min-width:52px; }
#beprDoc .inv-field-inline { display:flex; gap:0; align-items:flex-end; border-bottom:0; }
#beprDoc .inv-field-inline .inv-value { border-bottom:0; }
#beprDoc .inv-code-block { margin-left:auto; display:flex; align-items:flex-end; flex:0 0 auto; }
#beprDoc .inv-code-block label { min-width:0; }
#beprDoc .inv-code-value { flex:0 0 46px; min-width:0; }
#beprDoc .inv-value { flex:1; min-width:0; min-height:14px; border-bottom:var(--inv-border-w,1px) solid var(--inv-border,#000); overflow-wrap:anywhere; padding-bottom:1px; font-weight:600; }
#beprDoc .inv-address-fields { align-items:flex-start; }
#beprDoc .inv-address-fields .inv-value { min-height:26px; }
#beprDoc .inv-details { min-width:0; }
#beprDoc .inv-details-row { display:flex; align-items:center; gap:0; min-height:30px; padding:var(--inv-details-pad-top,4px) var(--inv-details-pad-end,6px) var(--inv-details-pad-bottom,4px) var(--inv-details-pad-start,6px); border-bottom:var(--inv-border-w,1px) solid var(--inv-border,#000); }
#beprDoc .inv-details-row:last-child { border-bottom:0; }
#beprDoc .inv-details-row label { flex-shrink:0; }
#beprDoc .inv-serial-row { min-height:50px; align-items:center; }
#beprDoc .inv-serial { color:var(--inv-grand,#9c2e3b); font-size:22px; font-family:serif; border-bottom:0; justify-content:center; text-align:center; }
#beprDoc .inv-detail-value { min-height:0; border-bottom:0; }
#beprDoc .inv-no { display:inline-block; padding:0 4px; border-radius:2px; background:var(--inv-no-bg,#ffffff); font-weight:700; }
#beprDoc .inv-hl { display:inline-block; padding:0 4px; border-radius:2px; font-size:var(--inv-name-size,13px); line-height:1.25; font-weight: 600;}
#beprDoc .inv-hl-name { background:var(--inv-name-bg,#ffffff); }
#beprDoc .inv-hl-mobile { background:var(--inv-mobile-bg,#ffffff); }

/* Eyes */
#beprDoc .inv-eyes { display:grid; gap:6px; margin:var(--inv-gap-eyes,0px) 0; flex:0 0 auto; }
#beprDoc .inv-eyes[data-layout="horizontal"] { grid-template-columns:1fr 1fr; }
#beprDoc .inv-eyes[data-layout="vertical"] { grid-template-columns:1fr; }
#beprDoc .inv-eye-card { border:var(--inv-border-w,1px) solid var(--inv-border,#000); min-width:0; }
#beprDoc .inv-left-eye { background:var(--inv-left-eye-bg,#fff); }
#beprDoc .inv-right-eye { background:var(--inv-right-eye-bg,#fff); }
#beprDoc .inv-eye-table { width:100%; border-collapse:collapse; font-size:8.5px; table-layout:fixed; }
#beprDoc .inv-eye-table th, #beprDoc .inv-eye-table td { border:var(--inv-border-w,1px) solid var(--inv-border,#000); padding:calc(1px + var(--inv-cell-pad,1px) + var(--inv-eye-pad-top,0px)) calc(2px + var(--inv-eye-pad-end,0px)) calc(1px + var(--inv-cell-pad,1px) + var(--inv-eye-pad-bottom,0px)) calc(2px + var(--inv-eye-pad-start,0px)); text-align:center; overflow-wrap:anywhere; }
#beprDoc .inv-eye-table thead th, #beprDoc .inv-eye-table tfoot th { background:var(--inv-head-bg,#eef3fb); color:var(--inv-brand,#31558f); font-weight:600; }
#beprDoc .inv-eye-corner { width:14%; }

/* Items Table */
/* The items area absorbs the page's spare space so the footer always sits on
   the bottom edge. It may grow (1) but must never shrink (0), otherwise a long
   item list gets squeezed into the page height and the rows overlap. */
/* The items wrap consumes the spare vertical space (when there is any) so the
   footer sits on the page's bottom edge. For long invoices the wrap's natural
   height exceeds the page and the flex:1 simply does nothing. */
#beprDoc .inv-items-wrap { flex:1 0 auto; min-height:40px; margin-top:var(--inv-gap-items,0px); display:flex; flex-direction:column; }
#beprDoc .inv-items { width:100%; border-collapse:collapse; table-layout:fixed; font-size:var(--inv-table-size,9.5px); }
#beprDoc .inv-items-main { flex:0 0 auto; }
/* Empty grid rows: a separate single-row table that grows into the spare space,
   so the real item rows keep their natural height. */
#beprDoc .inv-items-filler { flex:1 1 auto; min-height:0; }
#beprDoc .inv-items-filler td { border-top:0; }
#beprDoc .inv-items th, #beprDoc .inv-items td { border:var(--inv-border-w,1px) solid var(--inv-border,#000); padding:calc(2px + var(--inv-cell-pad,1px) + var(--inv-items-pad-top,0px)) calc(3px + var(--inv-items-pad-end,0px)) calc(2px + var(--inv-cell-pad,1px) + var(--inv-items-pad-bottom,0px)) calc(3px + var(--inv-items-pad-start,0px)); overflow-wrap:anywhere; }
#beprDoc .inv-items th { font-size:var(--inv-table-size,9.5px); text-align:center; vertical-align:middle; font-weight: 700; background:var(--inv-head-bg,#eef3fb); color:var(--inv-brand,#31558f); }
#beprDoc .inv-items td { vertical-align:top; }
#beprDoc .inv-items tbody tr { height:var(--inv-row-h,1px); }
#beprDoc .inv-items .inv-c-sr { width:var(--inv-col-sr,6%); }
#beprDoc .inv-items .inv-c-desc { width:var(--inv-col-desc,48%); }
#beprDoc .inv-items .inv-c-hsn { width:var(--inv-col-hsn,12%); }
#beprDoc .inv-items .inv-c-qty { width:var(--inv-col-qty,8%); }
#beprDoc .inv-items .inv-c-rate { width:var(--inv-col-rate,12%); }
#beprDoc .inv-items .inv-c-amt { width:var(--inv-col-amt,14%); }
/* Amount column: Rs. and Ps. are real sub-columns so the divider lines up. */
#beprDoc .inv-items .inv-amt-th,
#beprDoc .inv-items .inv-amt-cell { padding:0; }
#beprDoc .inv-amt-head { display:flex; flex-direction:column; height:100%; }
#beprDoc .inv-amt-title { flex:1; display:flex; align-items:center; justify-content:center; padding:calc(1px + var(--inv-cell-pad,1px) + var(--inv-amt-pad-top,0px)) calc(2px + var(--inv-amt-pad-end,0px)) calc(1px + var(--inv-cell-pad,1px) + var(--inv-amt-pad-bottom,0px)) calc(2px + var(--inv-amt-pad-start,0px)); }
#beprDoc .inv-amt-sub { display:flex; border-top:var(--inv-border-w,1px) solid var(--inv-border,#000); }
#beprDoc .inv-amt-sub span { padding:calc(1px + var(--inv-amt-pad-top,0px)) calc(2px + var(--inv-amt-pad-end,0px)) calc(1px + var(--inv-amt-pad-bottom,0px)) calc(2px + var(--inv-amt-pad-start,0px)); text-align:center; }
#beprDoc .inv-amt-sub span:first-child { flex:0 0 60%; border-right:var(--inv-border-w,1px) solid var(--inv-border,#000); }
#beprDoc .inv-amt-sub span:last-child { flex:1; }
#beprDoc .inv-amt-cell { position:relative; }
#beprDoc .inv-amt-divider { position:absolute; top:0; bottom:0; left:60%; border-left:var(--inv-border-w,1px) solid var(--inv-border,#000); pointer-events:none; }
#beprDoc .inv-amt-inner { display:flex; height:100%; }
#beprDoc .inv-amt-rs { flex:0 0 60%; text-align:right; padding:calc(1px + var(--inv-cell-pad,1px) + var(--inv-amt-pad-top,0px)) calc(3px + var(--inv-amt-pad-end,0px)) calc(1px + var(--inv-cell-pad,1px) + var(--inv-amt-pad-bottom,0px)) calc(3px + var(--inv-amt-pad-start,0px)); }
#beprDoc .inv-amt-ps { flex:1; text-align:left; padding:calc(1px + var(--inv-cell-pad,1px) + var(--inv-amt-pad-top,0px)) calc(3px + var(--inv-amt-pad-end,0px)) calc(1px + var(--inv-cell-pad,1px) + var(--inv-amt-pad-bottom,0px)) calc(3px + var(--inv-amt-pad-start,0px)); }
#beprDoc .inv-items .inv-filler { height:100%; }
#beprDoc .inv-items .inv-filler td { padding:0; }
#beprDoc .inv-items .inv-filler-box { min-height:0; }
#beprDoc .inv-item-name { text-align:left; }
#beprDoc .inv-empty { padding:8px !important; text-align:center; color:#666; }

#beprDoc .inv-c { text-align:center; }
#beprDoc .inv-r { text-align:right; }
#beprDoc .inv-l { text-align:left; }

/* Bottom Section (Words, Terms, Totals) */
#beprDoc .inv-bottom { display:grid; grid-template-columns:59% 41%; border-top:0; border-bottom:var(--inv-border-w,1px) solid var(--inv-border,#000); flex:0 0 auto; }
/* Vertical borders live on the children (see .inv-meta note). */
#beprDoc .inv-bottom-left { border-left:var(--inv-border-w,1px) solid var(--inv-border,#000); border-right:var(--inv-border-w,1px) solid var(--inv-border,#000); min-width:0; display:flex; flex-direction:column; box-shadow:inset var(--inv-border-w,1px) 0 0 0 var(--inv-border,#000), inset calc(-1 * var(--inv-border-w,1px)) 0 0 0 var(--inv-border,#000); }
#beprDoc .inv-words { padding:var(--inv-words-pad-top,6px) var(--inv-words-pad-end,6px) var(--inv-words-pad-bottom,6px) var(--inv-words-pad-start,6px); border-bottom:var(--inv-border-w,1px) solid var(--inv-border,#000); font-size:9px; display:flex; align-items:flex-start; gap:0; }
#beprDoc .inv-words-value { flex:1; border-bottom:var(--inv-border-w,1px) solid var(--inv-border,#000); font-style:italic; padding-bottom:2px; overflow-wrap:anywhere; font-weight:600; }
#beprDoc .inv-terms { padding:var(--inv-terms-pad-top,6px) var(--inv-terms-pad-end,6px) var(--inv-terms-pad-bottom,6px) var(--inv-terms-pad-start,6px); flex:1; }
#beprDoc .inv-terms-title { font-size:9px; font-weight:700; margin-bottom:3px; color:var(--inv-heading,#000); }
#beprDoc .inv-terms ol { margin:0; padding-left:12px; font-size:var(--inv-terms-size,6.8px); line-height:1.4; }
#beprDoc .inv-totals { min-width:0; display:flex; flex-direction:column; border-right:0; box-shadow:inset calc(-1 * var(--inv-border-w,1px)) 0 0 0 var(--inv-border,#000); }
/* Right border moved onto the children: CSS grid items drop their own outer
   right border in print engines (same fix already applied to .inv-meta and
   .inv-footer). */
#beprDoc .inv-totals > * { border-right:var(--inv-border-w,1px) solid var(--inv-border,#000); }
#beprDoc .inv-total-row { display:grid; grid-template-columns:50% 50%; min-height:22px; border-bottom:var(--inv-border-w,1px) solid var(--inv-border,#000); flex:1; }
#beprDoc .inv-total-row:last-child { border-bottom:var(--inv-border-w,1px) solid var(--inv-border,#000); }
#beprDoc .inv-total-label, #beprDoc .inv-total-value { padding:var(--inv-totals-pad-top,4px) var(--inv-totals-pad-end,4px) var(--inv-totals-pad-bottom,4px) var(--inv-totals-pad-start,4px); text-align:center; overflow-wrap:anywhere; display:flex; align-items:center; }
#beprDoc .inv-total-label { border-right:var(--inv-border-w,1px) solid var(--inv-border,#000); justify-content:center; font-weight: 700; }
#beprDoc .inv-total-value { text-align:right; padding-right:calc(var(--inv-totals-pad-end,4px) + 4px); font-weight:700; justify-content:flex-end; border-right:var(--inv-border-w,1px) solid var(--inv-border,#000); }
#beprDoc .inv-grand-total { min-height:36px; color:var(--inv-grand,#9c2e3b); font-weight:700; }
#beprDoc .inv-total-bg { background:var(--inv-total-bg,#ffffff); }
#beprDoc .inv-received-bg { background:var(--inv-received-bg,#ffffff); }
#beprDoc .inv-receipts { width:100%; border-collapse:collapse; font-size:8px; table-layout:fixed; }
#beprDoc .inv-receipts th, #beprDoc .inv-receipts td { border:var(--inv-border-w,1px) solid var(--inv-border,#000); padding:2px 3px; }
/* Only drop the double top border against the section's first row; every
   other side is drawn by the cells themselves (the parent grid does not
   reliably draw outer borders in print). */
#beprDoc .inv-receipts thead th { border-top:0; }
#beprDoc .inv-receipts th { background:var(--inv-head-bg,#eef3fb); font-weight:700; }
#beprDoc .inv-receipts-total td { font-weight:700; }

#beprDoc .inv-remarks { border:var(--inv-border-w,1px) solid var(--inv-border,#000); border-top:0; padding:var(--inv-remarks-pad-top,3px) var(--inv-remarks-pad-end,6px) var(--inv-remarks-pad-bottom,3px) var(--inv-remarks-pad-start,6px); font-size:8px; flex:0 0 auto; }

/* Footer */
#beprDoc .inv-footer { display:grid; grid-template-columns:1fr 1fr; box-sizing:border-box; border-top:0; border-bottom:var(--inv-border-w,1px) solid var(--inv-border,#000); min-height:70px; margin-top:var(--inv-footer-gap,0px); flex:0 0 auto; background-color:var(--inv-footer-bg,#ffffff); color:var(--inv-footer-ink,#000); padding:var(--inv-footer-pad-top,0px) var(--inv-footer-pad-end,0px) var(--inv-footer-pad-bottom,0px) var(--inv-footer-pad-start,0px); text-align:center; }
/* Vertical borders live on the children (see .inv-meta note). */
#beprDoc .inv-signature { display:flex; flex-direction:column; justify-content:flex-end; align-items:flex-start; padding:var(--inv-signature-pad-top,6px) var(--inv-signature-pad-end,6px) var(--inv-signature-pad-bottom,6px) calc(var(--inv-signature-pad-start,6px) + 8%); font-size:9px; font-weight:700; text-align:left; border-left:var(--inv-border-w,1px) solid var(--inv-border,#000); box-shadow:inset var(--inv-border-w,1px) 0 0 0 var(--inv-border,#000); }
#beprDoc .inv-signature-right { justify-content:flex-start; align-items:center; text-align:center; padding-left:var(--inv-signature-pad-start,6px); border-left:0; border-right:var(--inv-border-w,1px) solid var(--inv-border,#000); box-shadow:inset calc(-1 * var(--inv-border-w,1px)) 0 0 0 var(--inv-border,#000); }
#beprDoc .inv-sign-line { display:none; width:78%; border-top:var(--inv-border-w,1px) solid var(--inv-border,#000); margin:4px auto 3px; flex:0 0 auto; }
#beprDoc .inv-certification { text-align:center; font-size:7.2px; font-weight:400; margin-bottom:0; align-self:center; }
#beprDoc .inv-company-sign { color:var(--inv-accent,#319bd4); font-size:12px; font-weight:900; margin-bottom:auto; text-transform:uppercase; }
#beprDoc .inv-auth-sign { font-size:9px; font-weight:700; }

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

/* ------------------------------ Print ------------------------------ */
/* Off-screen measuring pass (applyPrintFill): natural, unscaled block height. */
#beprDoc.inv-measuring { display:block !important; height:auto !important; min-height:0 !important; max-height:none !important; }
#beprDoc.inv-measuring .inv-items-wrap { display:block !important; }
#beprDoc.inv-measuring .inv-items .inv-filler { height:auto !important; }

@media print {
 /* Paper size is injected at runtime by applyPrintPage() from the Paper settings. */

 html, body { background:#fff !important; margin:0 !important; padding:0 !important; }

 /* Only the invoice modal is printed; every other element (incl. panels/modals) is hidden. */
 body > * { display:none !important; }
 body > #beprModal.show { display:block !important; position:static !important; overflow:visible !important; }
 #beprModal .modal-dialog { max-width:none !important; width:auto !important; height:auto !important; margin:0 !important; padding:0 !important; }
 #beprModal .modal-content,
 #beprModal .modal-body { border:0 !important; box-shadow:none !important; background:#fff !important; margin:0 !important; padding:0 !important; max-height:none !important; height:auto !important; overflow:visible !important; }
 .modal-backdrop { display:none !important; }

 .bepr-toolbar, .bepr-subbar, .bepr-close { display:none !important; }
 .bepr-shell, .bepr-viewport { display:block !important; height:auto !important; overflow:visible !important; padding:0 !important; background:#fff !important; }
 .bepr-spacer { width:auto !important; height:auto !important; }
 .bepr-paper { position:static !important; top:auto !important; left:auto !important; width:auto !important; height:auto !important; transform:none !important; margin:0 !important; padding:0 !important; border:0 !important; box-shadow:none !important; }
 .bepr-stage, .bepr-content { position:static !important; inset:auto !important; display:block !important; width:auto !important; height:auto !important; overflow:visible !important; }

 #beprDoc {
  width:var(--inv-content-width,100%) !important;
  max-width:100% !important;
  margin:0 auto !important;
  height:auto !important;
  min-height:0 !important;
  max-height:none !important;
  padding:0 !important;
  overflow:visible !important;
  background:var(--inv-page-bg,#fff) !important;
  color:var(--inv-text,#000) !important;
  -webkit-print-color-adjust:exact !important;
  print-color-adjust:exact !important;
 }

 /* Keep sections whole across page breaks. */
 #beprDoc .inv-header,
 #beprDoc .inv-meta,
 #beprDoc .inv-items thead,
 #beprDoc .inv-bottom,
 #beprDoc .inv-totals,
 #beprDoc .inv-terms,
 #beprDoc .inv-remarks,
 #beprDoc .inv-footer { break-inside:avoid; page-break-inside:avoid; }
 #beprDoc .inv-items tr { break-inside:avoid; page-break-inside:avoid; }
 /* The flex-column layout is the default for every output (preview, print,
    PDF). Long invoices still paginate correctly because the min-height is
    simply exceeded. For invoices taller than one printed page, force block
    flow so the browser does not try to fit the whole flex column onto a
    single page. */
 #beprDoc { display:flex !important; flex-direction:column !important; min-height:calc(var(--inv-page-content-h, 281mm) - 1mm) !important; }

 /* Restore the outer borders that CSS grid containers drop in print. */
 #beprDoc .inv-total-value { border-right:var(--inv-border-w,1px) solid var(--inv-border,#000) !important; }
 #beprDoc .inv-totals > * { border-right:var(--inv-border-w,1px) solid var(--inv-border,#000) !important; }
 #beprDoc .inv-receipts thead th { border-top:var(--inv-border-w,1px) solid var(--inv-border,#000) !important; }
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
    // 6 = html2pdf bundle (html2canvas + jsPDF), 7 = html2canvas.
    await loadCshScriptsSequentially(7, 6);
   } catch (loadErr) {
    console.warn('bePr3: export libraries could not be loaded; image/PDF export may be unavailable.', loadErr);
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

   // Keep the loaded bill so the style modal can re-render header toggles live.
   refs.renderData = data;

   refs.doc.dataset.theme = 'default';

   // Saved style wins; otherwise bill_theme (0/undefined => current default).
   const hasSavedStyle = hasStore(STYLE_STORE);
   const initialStyle = hasSavedStyle ? styleSettings() : themeFor(data.clientConfig.bill_theme);
   refs.currentStyle = initialStyle;

   refs.doc.innerHTML = renderInvoice(data, { themeKey: 'default', style: initialStyle });
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
   contentElement.querySelector('#beprPrintBtn').addEventListener('click', async () => {
    // Let the logo finish downloading so it is included in the print preview.
    await waitImages(refs.doc);
    applyPrintFill(refs);
    window.print();
   });
   contentElement.querySelector('#beprPdfBtn').addEventListener('click', event => {
    // Open the tab during the click gesture so browsers do not treat it as a popup.
    const targetWindow = window.open('', '_blank');
    if (targetWindow) {
     try {
      targetWindow.document.write('<title>Generating PDF...</title><p style="font-family:system-ui,sans-serif;padding:24px;color:#495057">Generating PDF...</p>');
      targetWindow.document.close();
     } catch (e) { /* ignore cross-origin/style restrictions */ }
    }
    showPdf(refs, data, event.currentTarget, targetWindow);
   });
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

   // Browser print (Ctrl+P / menu) bypasses the toolbar button.
   const onBeforePrint = () => { try { applyPrintFill(refs); } catch (e) { /* ignore */ } };
   window.addEventListener('beforeprint', onBeforePrint);

   modalElement.addEventListener('hidden.bs.modal', () => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('beforeprint', onBeforePrint);
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