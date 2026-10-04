const tblsRequired = ["c", "f", "fp", "s", "s2", "p", "b", "be", "ba", "i", "r", "mr", "mp"];
const inTbls = ["dontCret:", "public:", "2/b-2~p,s", "2/b-3~c,b,i,r,ba,p,s,be", "2/b-4~c,b,i,r,ba,p,s,be", "2/b-7~c,b,i,r,ba,p,s,be", "2/1-9~b,be,r,i", "2/b-23~r", "2/b-25~p,s", "2/b-47~r,ba,p,s", "2/o-102~be", "2/p-103~r", "2/t-104~", "2/p-105~r"];//104 for .da
const moduLst = [
 { "a": ",2,3,4,7,9,25,104,", "b": "Dashboard", "c": "fa-plus-circle", "d": "mn_prods", "e": "#198754" }
];
const cust_const = [];// { "a": "paymentGatewayIntegrated", "b": 0, "c": "more customiztaion", "d": "if value is 1 payment gatewy will be shown, else manual booking", "u": "url-explaining-video" },
moduLst.hook = "onModuLstAllowed";
window[my1uzr.worknOnPg].moduLst = moduLst;
window[my1uzr.worknOnPg].onModuLstAllowed = function (allowedModules) {
 const menuItems = allowedModules.map(m => ({ icon: m.c, label: m.b, action: m.d, color: m.e }));
 window[my1uzr.worknOnPg].adminMenuItems = menuItems;
 // if (!Array.isArray(window.burgerMenuItems)) window.burgerMenuItems = [];
 // const actions = new Set(menuItems.map(i => i.action));
 // window.burgerMenuItems = window.burgerMenuItems.filter(i => !actions.has(i.action));
 // window.burgerMenuItems.push(...menuItems);
 // if (typeof createBurgerMenuElements === 'function') createBurgerMenuElements();
};
// const xtraFlds_fildsToNeeds = {
//   "k": {
//     "lbl": "additional info 1",
//     "type": "div",
//     "preProcess": "fnSeparateCowMhas",
//     "postProcess": "fnCombineCowMhas",
//     "x": {
//       "a": { "lbl": "Uniq cow", "type": "text", "placeholder": "Enter Id cow", "ptrn": "^[0-9]{0,2}$", "rq": 1 },
//       "b": { "lbl": "Uniq mhas", "type": "text", "placeholder": "Enter Id bafelo", "ptrn": "^[0-9]{0,3}$", "rq": 1 }
//     }
//   },

//   // "c1": {
//   //   "i": { "lbl": "Testing birth dt", "type": "text", "placeholder": "Enter birth date", "ptrn": "^[A-Za-z ]{2,50}$", "rq": 1 },
//   //   "c1": {
//   //     "lbl": "additional info 2",
//   //     "type": "div",
//   //     "x": {
//   //       "e": { "lbl": "Testing Full Name", "type": "text", "placeholder": "Enter full name", "ptrn": "^[\\s\\S]{2,50}$", "rq": 1 },
//   //       "f": { "lbl": "Testing Another contact no.", "type": "tel", "placeholder": "Enter 10-digit number", "ptrn": "^[0-9]{10}$" },
//   //       "g": { "lbl": "Testing Address", "type": "textarea", "placeholder": "Enter address", "ptrn": "^.{5,200}$", "rq": 1, "preProcess": "preAddress", "postProcess": "postAddress", "validate": "validateAddress" },
//   //       "h": { "lbl": "Testing Aadhaar Card", "type": "file", "ptrn": "image/*" },
//   //       "i": { "lbl": "Testing Email", "type": "email", "placeholder": "Enter email", "ptrn": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", "rq": 1 },
//   //       "j": { "lbl": "Testing Unique ID No.", "type": "text", "placeholder": "Enter Unique ID", "ptrn": "^[A-Za-z0-9 ]{2,50}$", "rq": 1, "maxlength": 8, "uppercase": true, "strip": "[^A-Z0-9]", "preProcess": "preUniqueId", "postProcess": "postUniqueId", "validate": "validateUniqueId" },
//   //       "n": { "lbl": "Gender", "type": "select", "placeholder": "Select Gender", "rq": 1, "opts": { "0": "Don't know", "1": "Male", "2": "Female" }, "preProcess": "preGender", "postProcess": "postGender", "validate": "validateGender" }
//   //     }
//   //   }
//   // },
//   // "j": {
//   //   "lbl": "Candidates Details",
//   //   "type": "div",
//   //   "x": {
//   //     "e": { "lbl": "Age", "type": "number", "placeholder": "Enter age", "ptrn": "^[0-9]{1,3}$", "rq": 1 },
//   //     "f": { "lbl": "Qualification", "type": "text", "placeholder": "Enter qualification", "ptrn": "^[\\s\\S]{2,100}$", "rq": 1 },
//   //     "g": { "lbl": "Photo ID", "type": "file", "ptrn": "image/*" },
//   //     "h": { "lbl": "Post", "type": "select", "placeholder": "Select Post", "rq": 1, "opts": "selectPostForCandidates" },
//   //     "i": {
//   //       "lbl": "Experience", "type": "div", "x": {
//   //         "a": { "lbl": "Company Name", "type": "text", "placeholder": "Enter company name" },
//   //         "b": { "lbl": "Years of Experience", "type": "text", "placeholder": "Enter years of experience" },
//   //         "c": { "lbl": "Projects", "type": "textarea", "placeholder": "Enter project details" }
//   //       }
//   //     }
//   //   }
//   // }
// };
// @Samir 
// ```
// 1. Title: "J";
// 2. Mobile number, name, age, qualification, photoId;
// 3. Post: select from ".da"(Temp.da);
// 4. Experience(where company name:, Years of Experience:, [
//     {
//         "proj":"billing software", "tecs":[{"a":"jqury"/*id*/, "b":"3 months"}, {"a":"bootstrap", "b":"2 months"},{"a":"html", "b":"1 months"},{"a":"css", "b":"3 months"},{"a":"Javascript", "b":"3 months"}], "note":"We/I had used custom frame work systeam that suted dynamic devlopment that requred in the company.", "url":"git / pit / sit.ghhdrjh"
//     },
// ])
// Make it dynamecally;
// ```
const showEyeMesuremetsTableInBill = 0;// 0 or undefiend const - don't show, 1 - show tables
const billingModule = 1;//0 or null = normal; 1= garge / services ; 2=laundry;
appcss = `
 :root { --primary-purple: #6f42c1; --secondary-gold: #ffd700; --light-purple: #e2d9f3; --dark-purple: #4a2d7e }
 body { background-color: var(--light-purple); animation: fadeIn 1s ease-in; min-height: 100vh; display: flex; flex-direction: column }
 .navbar { background-color: var(--primary-purple) !important; box-shadow: 0 2px 10px rgb(0 0 0 / .1) }
 .navbar-brand, .nav-link { color: var(--secondary-gold) !important }
 .nav-link:hover { color: white !important; transition: color 0.3s ease }
 .navbar-toggler { display: block !important; border: none; padding: .25rem }
 @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
 @keyframes pulse { 0% { transform: scale(1) } 50% { transform: scale(1.1) } 100% { transform: scale(1) } }
 .pulse:hover { animation: pulse 1s infinite }
 .content-container { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center }
 .main-icon { font-size: 4rem; color: var(--primary-purple); margin-bottom: 1.5rem; animation: pulse 2s infinite }
 .app-title { color: var(--dark-purple); font-weight: 700; margin-bottom: 1rem }
 .app-description { color: var(--dark-purple); max-width: 600px; margin-bottom: 2rem }
 .feature-icon { font-size: 2.5rem; color: var(--primary-purple); margin: 1rem }
 footer { background-color: var(--primary-purple); color: #fff; padding: .35rem; text-align: center }
 @media (max-width:768px) { .main-icon { font-size: 3rem } .feature-icon { font-size: 2rem } }
 .tempus-dominus-widget.show { position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; margin: 0 !important; z-index: 9999 !important; box-shadow: 0 .5rem 1rem rgba(0,0,0,.35); border-radius: 8px; max-height: 85vh; overflow-y: auto }
 .tempus-dominus-widget .arrow { display: none }
 .tempus-dominus-widget .toolbar [data-action="close"] { width: auto; height: auto; padding: .05rem .28rem; font-size: .72rem; line-height: 1; border-radius: .17rem; color: #fff }
 .tempus-dominus-widget .toolbar [data-action="close"]:hover, .tempus-dominus-widget .toolbar [data-action="close"]:focus { color: #fff }
 .tempus-dominus-widget .toolbar { display: grid !important; grid-template-columns: 1fr auto auto 1fr !important; grid-auto-rows: 40px !important; align-items: center !important }
 .tempus-dominus-widget .toolbar [data-action="today"] { order: 1 !important; justify-self: start !important; margin-left: .4rem !important }
 .tempus-dominus-widget .toolbar .td-zero-btn { order: 2 !important; position: static !important; transform: none !important; width: auto !important; height: auto !important; padding: .05rem .28rem; font-size: .72rem; line-height: 1; border-radius: .17rem; color: #fff }
 .tempus-dominus-widget .toolbar .td-ok-btn { order: 3 !important; position: static !important; transform: none !important }
 .tempus-dominus-widget .toolbar [data-action="togglePicker"] { order: 4 !important; justify-self: end !important; margin-right: .4rem !important }
`;

// ==================== Shared datetime picker (Bootstrap - Tempus Dominus) ====================
const PICKER_TD_VERSION = '6.10.4';
const PICKER_DATE_FORMAT = 'yyyy-MM-dd HH:mm';

let tdDepsPromise = null;
function loadDatePickerDependencies() {
 if (typeof tempusDominus !== 'undefined') return Promise.resolve();
 if (!tdDepsPromise) {
  tdDepsPromise = new Promise((resolve, reject) => {
   const link = document.createElement('link');
   link.rel = 'stylesheet';
   link.href = `https://cdn.jsdelivr.net/npm/@eonasdan/tempus-dominus@${PICKER_TD_VERSION}/dist/css/tempus-dominus.min.css`;
   link.onerror = () => reject(new Error('Failed to load Tempus Dominus CSS'));
   document.head.appendChild(link);

   const script = document.createElement('script');
   script.src = `https://cdn.jsdelivr.net/npm/@eonasdan/tempus-dominus@${PICKER_TD_VERSION}/dist/js/tempus-dominus.min.js`;
   script.onload = () => resolve();
   script.onerror = () => reject(new Error('Failed to load Tempus Dominus JS'));
   document.head.appendChild(script);
  });
  tdDepsPromise.catch(() => { tdDepsPromise = null; });
 }
 return tdDepsPromise;
}

// Format as "YYYY-MM-DD HH:mm" (the storage/validation format used everywhere)
function formatForPicker(date) {
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2, '0');
 const day = String(date.getDate()).padStart(2, '0');
 const hours = String(date.getHours()).padStart(2, '0');
 const minutes = String(date.getMinutes()).padStart(2, '0');
 return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function parsePickerValue(val) {
 if (!val) return null;
 const parts = String(val).trim().split(/[\sT]+/);
 const d = parts[0].split('-').map(Number);
 const t = (parts[1] || '00:00').split(':').map(Number);
 if (!d[0] || !d[1] || !d[2]) return null;
 // Tempus Dominus DateTime extends native Date -> month is 0-based
 return new tempusDominus.DateTime(d[0], d[1] - 1, d[2], t[0] || 0, t[1] || 0, t[2] || 0);
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function isDesktopView() {
 return window.innerWidth > 768;
}

function formatLongDisplay(val) {
 if (!val) return '';
 const parts = String(val).trim().split(/[\sT]+/);
 const d = (parts[0] || '').split('-');
 if (d.length < 3) return val;
 const month = MONTH_FULL[Number(d[1]) - 1] || d[1];
 const day = String(d[2]).padStart(2, '0');
 const base = `${day}/${month}/${d[0]}`;
 const t = (parts[1] || '').split(':').map(Number);
 if (!t.length || isNaN(t[0])) return base;
 let h = t[0] % 24;
 const ampm = h >= 12 ? 'pm' : 'am';
 h = h % 12;
 if (h === 0) h = 12;
 const min = String(t[1] || 0).padStart(2, '0');
 return `${base} ${String(h).padStart(2, '0')}:${min}${ampm}`;
}

function formatShortDisplay(val) {
 if (!val) return '';
 if (isDesktopView()) return formatLongDisplay(val);
 const parts = String(val).trim().split(/[\sT]+/);
 const d = (parts[0] || '').split('-');
 if (d.length < 3) return val;
 return String(d[2]).padStart(2, '0') + '/' + (MONTH_SHORT[Number(d[1]) - 1] || d[1]);
}

// Global datetime picker initializer - one function for all date/time fields.
// options:
//   initialValue - pre-set value ("YYYY-MM-DD HH:mm")
//   autoNow      - default true; set false to leave empty instead of auto-filling current date & time
//   scrollable   - cap widget height with vertical scroll
(async function () {
 // window["xtraj_payload"] = {};
 // xtraj_payload.fl = "https://my1.in/2/b.php";
 // xtraj_payload.vw = 1;
 // xtraj_payload.fn = 4;
 // xtraj_payload.chkSuOfFn = -1;
 // xtraj_payload.regme = 1;
 //keep this all commenst at it is:-

 window[my1uzr.worknOnPg].csh = [
  { "a": 1, "u": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" },
  { "a": 2, "u": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" },
  { "a": 3, "u": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" },
  { "a": 4, "u": "https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js" },
  { "a": 5, "u": "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
  { "a": 6, "u": "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" },
  { "a": 7, "u": "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" },
  { "a": 8, "u": "https://code.jquery.com/jquery-3.6.0.min.js" },
  { "a": 9, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@asdf2e1/b/b.min.js", "c": "set_bill_innerHTML", "r": "set_bill_innerHTML" },
  //{ "a": 9, "u": "git/b.js", "c": "set_bill_innerHTML", "r": "set_bill_innerHTML" },
  { "a": 10, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@14002e4/b/ba.min.js", "c": "open_bil_inward", "r": "open_bil_inward" },
  //{ "a": 11, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@bc0a572/b/bn.min.js", "c": "set_add_itm_nw_innerHTML", "r": "set_add_itm_nw_innerHTML" },
  { "a": 11, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@cc71958/b/bn.js", "c": "set_add_itm_nw_innerHTML", "r": "set_add_itm_nw_innerHTML" },
  { "a": 12, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e2e6e7/b/bp.min.js", "c": "set_deup_prod_innerHTML", "r": "set_deup_prod_innerHTML" },
  //{ "a": 12, "u": "bp.js", "c": "set_deup_prod_innerHTML", "r": "set_deup_prod_innerHTML" },
  { "a": 13, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@a30ac23/b/bPrOp.min.css" },
  { "a": 14, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/ei.min.js", "c": "open_entind_crud", "r": "open_entind_crud" },
  //{ "a": 14, "u": "ei.js", "c": "open_entind_crud", "r": "open_entind_crud" },
  { "a": 15, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/my1lp.js", "c": "open_shoLgnP", "r": "open_shoLgnP" },
  { "a": 16, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@4d95515/cmn/my1ap.min.js" },
  { "a": 17, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/cmn/my1xi.min.js" },
  { "a": 18, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@24bf6ca/cmn/my1drv.min.js" },
  { "a": 19, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/my1e3.min.js", "c": "fileUploadTesting", "r": "fileUploadTesting" },
  { "a": 20, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fc84f58/cmn/my1dra.min.js", "c": "upldAnyFile2drv", "r": "upldAnyFile2drv" },
  { "a": 21, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@cc71958/b/be.js", "c": "set_be_innerHTML", "r": "set_be_innerHTML" },
  { "a": 22, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@31fba32/b/bePr.min.js", "c": "sho_bepr_mdl", "r": "sho_bepr_mdl" },
  { "a": 23, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e2e6e7/b/be_da.js", "c": "showPrintSettings", "r": "showPrintSettings" },
  //{ "a": 23, "u": "be_da.js", "c": "showPrintSettings", "r": "showPrintSettings" },
  { "a": 24, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/my1img.js", "c": "open_addimage", "r": "open_addimage" },
  //{ "a": 24, "u": "my1img.js", "c": "open_addimage", "r": "open_addimage" },
  { "a": 25, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1236a32/cmn/clrChe.js", "c": "showClearCacheModal", "r": "showClearCacheModal" },
  { "a": 26, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e2e6e7/mr/bi.js", "c": "set_bill_Inverd_innerHTML", "r": "set_bill_Inverd_innerHTML" },
  { "a": 27, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e2e6e7/mr/get_data.js", "c": "set_get_data_innerHTML", "r": "set_get_data_innerHTML" },
  { "a": 28, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e2e6e7/mr/rep_coll.js", "c": "set_rep_coll_innerHTML", "r": "set_rep_coll_innerHTML" },
  { "a": 29 },
  { "a": 30, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/my1ctr.js", "c": "open_my1ctr", "r": "open_my1ctr" },
 ];

 let item1 = null;
 const csh1 = window[my1uzr.worknOnPg].csh;
 if (typeof billingModule === 'undefined' || billingModule === 0 || billingModule == null) {
  item1 = csh1.find(x => x.a === 29);
  if (item1) {
   Object.assign(item1, {
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e2e6e7/mr/shoRegItm.js",
    c: "showAddNormalItemModal",
    r: "showAddNormalItemModal"
   });
  }
 } else if (billingModule === 1) {
  item1 = csh1.find(x => x.a === 29);
  if (item1) {
   Object.assign(item1, {
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e2e6e7/mr/shoCarwork.js",
    c: "showAddCarWorkModal",
    r: "showAddCarWorkModal"
   });
  }
 } else if (billingModule === 2) {
  item1 = csh1.find(x => x.a === 29);
  if (item1) {
   Object.assign(item1, {
    u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e2e6e7/mr/shoCarwork.js",
    c: "showAddCarWorkModal",
    r: "showAddCarWorkModal"
   });
  }
 }

 // Ensure UNIT_DATA is available
 if (typeof window.UNIT_DATA === 'undefined' || !window.UNIT_DATA || window.UNIT_DATA.length === 0) {
  window.UNIT_DATA = [
   { "a": "32", "e": "adult", "f": "adl" }, { "a": "28", "e": "bags", "f": "bag" }, { "a": "22", "e": "box", "f": "box" },
   { "a": "27", "e": "brass", "f": "brass" }, { "a": "5", "e": "centimeter", "f": "cm" }, { "a": "33", "e": "child", "f": "chi" },
   { "a": "23", "e": "cubic feet", "f": "cft" }, { "a": "13", "e": "cubic meter", "f": "cum" }, { "a": "19", "e": "days", "f": "day" },
   { "a": "10", "e": "dozen", "f": "dz" }, { "a": "2", "e": "foot", "f": "ft" }, { "a": "35", "e": "full ticket", "f": "ftk" },
   { "a": "4", "e": "gram", "f": "gm" }, { "a": "36", "e": "half ticket", "f": "htk" }, { "a": "18", "e": "hours", "f": "hr" },
   { "a": "3", "e": "kilogram", "f": "kg" }, { "a": "8", "e": "kilometer", "f": "km" }, { "a": "1", "e": "liter", "f": "ltr" },
   { "a": "6", "e": "meter", "f": "m" }, { "a": "26", "e": "metric tonne", "f": "mt" }, { "a": "7", "e": "milligram", "f": "mg" },
   { "a": "9", "e": "millilitre", "f": "ml" }, { "a": "37", "e": "millimeter", "f": "mm" }, { "a": "17", "e": "minutes", "f": "min" },
   { "a": "20", "e": "month", "f": "month" }, { "a": "29", "e": "numbers", "f": "no" }, { "a": "11", "e": "pieces", "f": "pcs" },
   { "a": "31", "e": "plate", "f": "pl" }, { "a": "25", "e": "running foot", "f": "rft" }, { "a": "15", "e": "running meter", "f": "rmt" },
   { "a": "16", "e": "seconds", "f": "sec" }, { "a": "12", "e": "service", "f": "srv" }, { "a": "34", "e": "special ticket", "f": "stk" },
   { "a": "24", "e": "square feet", "f": "sqft" }, { "a": "14", "e": "square meter", "f": "sqm" }, { "a": "30", "e": "units", "f": "ut" },
   { "a": "21", "e": "year", "f": "year" }
  ];
 }

 window.fnCombineCowMhas = function (...objj) { console.log(objj); }

 window.UNIT_MAP = {};
 window.UNIT_DATA.forEach(function (unit) { window.UNIT_MAP[unit.a] = unit; });
 window[my1uzr.worknOnPg].reqyTableInBills = 1;

 window[my1uzr.worknOnPg].confg = {};
 window[my1uzr.worknOnPg].confg.calcStock = 1;
 window[my1uzr.worknOnPg].confg.canSaleIfStock = 0;
 window[my1uzr.worknOnPg].confg.itmNameMxLength = 32;
 window[my1uzr.worknOnPg].confg.addByQR = 1;
 window[my1uzr.worknOnPg].confg.scanDelayQR = 3000;
 //window[my1uzr.worknOnPg].confg.shodateofberthForEi = 1;
 const shoEyeMsrmntTbl =
  typeof showEyeMesuremetsTableInBill !== "undefined"
   ? showEyeMesuremetsTableInBill == 1
   : null;

 window.allowFloat = function (el, decimals = 2) {
  let v = el.value;

  // Keep only numbers and .
  v = v.replace(/[^0-9.]/g, '');

  // Allow only one decimal point
  const dotIndex = v.indexOf('.');
  if (dotIndex !== -1) {
   v = v.slice(0, dotIndex + 1) + v.slice(dotIndex + 1).replace(/\./g, '');
  }

  // Limit digits before and after the decimal point
  const parts = v.split('.');
  const intPart = parts[0].slice(0, 7);
  const decPart = parts[1] !== undefined ? parts[1].slice(0, decimals) : '';

  el.value = v.includes('.') ? intPart + '.' + decPart : intPart;
 };

 window.closeModal = function (modalId, modalInstance) {
  if (!modalInstance) {
   const modalEl = document.getElementById(modalId);
   if (modalEl) {
    modalInstance = bootstrap.Modal.getInstance(modalEl);
   }
  }
  if (modalInstance) {
   modalInstance.hide();
  }
  const modal = document.getElementById(modalId);
  if (modal) {
   modal.addEventListener('hidden.bs.modal', function () {
    if (modalInstance) modalInstance.dispose();
    modal.remove();
   }, { once: true });
  }
 };

 var PLACEHOLDER_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23e9ecef"/><text x="50" y="55" text-anchor="middle" font-size="40" fill="%23adb5bd">?</text></svg>');
 window.PLACEHOLDER_IMG = PLACEHOLDER_IMG;
 function getMaxDateTables() {
  const t = [{ "tb": 'c' }, { "tb": 'b' }, { "tb": 'i' }, { "tb": 'r' }, { "tb": 'ba' }, { "tb": 'p' }, { "tb": 's' }];
  if (shoEyeMsrmntTbl) t.splice(4, 0, { "tb": 'be', "col": 'eb', "cl": "eb" });
  return t;
 }

 window.items = [];
 window.prods = [];
 let clientReferrerArray = [];
 let stored_bill = [];
 let stored_eye_msrmnt = [];
 let stored_bill_items = [];
 let stored_bill_cash_info = [];

 let mostUsedItems = {}; // Track item usage
 let receivedAmounts = []; // Track received payments

 let receiptDatePicker = null, deliveryDatePicker = null, receivedDateTimePicker = null;

 function getGoogleDriveImageUrl(value, thumbnail) {
  if (!value) return '';
  value = String(value).trim();
  var parts = value.split(/\s+/);
  if (parts.length >= 1 && /^[A-Za-z0-9_-]{20,}$/.test(parts[0])) {
   var fileId = thumbnail && parts[1] ? parts[1] : parts[0];
   return 'https://lh3.googleusercontent.com/d/' + fileId + '=s0?authuser=0';
  }
  return value;
 }
 window.getGoogleDriveImageUrl = getGoogleDriveImageUrl;

 async function billingRequisit_be() { await loadExe2Fn(21, ['blankDivSection1'], [1]); }

 var cssLinks = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
 ];
 cssLinks.forEach(function (href) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
 });

 var styleEl = document.createElement('style');
 styleEl.innerHTML = appcss;
 document.head.appendChild(styleEl);

 document.body.innerHTML = `
<nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #6f42c1 !important; box-shadow: 0 2px 10px rgb(0 0 0 / .1);">
 <div class="container-fluid">
  <button class="navbar-brand btn btn-link" style="border: none; background: none; text-decoration: none; color: #ffd700 !important;"
   onclick="(async () => { await loadExe2Fn(30, ['dv_to_set_open_my1ctr_processed', 0, 1, 2], [1]); })()">
   <i class="fa-solid fa-user"></i>Billing Software
  </button>
  <button class="btn" style="margin-left:-18px;background:rgba(255, 255, 255, 0.12);border:1px solid rgba(255,255,255,.2);" type="button" onclick="location.reload()">
   <span class="text-white"><i class="fas fa-plus"></i> New Bill</span>
  </button>
<button class="navbar-toggler" type="button"
    onclick="toggleNavMenu()">
    <span style="color:#ffd700;font-size:1.5rem;">
        <i class="fas fa-bars"></i>
    </span>
</button>
  <div class="collapse" id="navbarNav">
    <div class="menu-popup">

        <div class="menu-grid">

            <div class="menu-item" id="sync_all_info">
                <i class="fas fa-sync"></i>
                <span>Update Data</span>
            </div>

            <div class="menu-item" onclick="(async()=>{await loadExe2Fn(12,[],[1]);})()">
                <i class="fas fa-info-circle"></i>
                <span>Manage Products</span>
            </div>

            <div class="menu-item" onclick="(async()=>{await loadExe2Fn(26,[],[1]);})()">
                <i class="fas fa-square-plus"></i>
                <span>Bill Inward</span>
            </div>

            <div class="menu-item" onclick="(async()=>{await loadExe2Fn(28,[],[1]);})()">
                <i class="fas fa-chart-bar"></i>
                <span>Reports</span>
            </div>

            <div class="menu-item menu-sub-toggle" id="settings_toggle" onclick="toggleNavSubMenu()">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
            </div>

        </div>

        <div class="menu-sub-dropdown" id="menuSubDropdown">
            <div class="menu-item menu-sub-item" onclick="setDefaRmrk()">
                <i class="fas fa-comment"></i>
                <span>Default Remark</span>
            </div>
            <div class="menu-item menu-sub-item" id="bt_clr_locl_db">
                <i class="fas fa-trash"></i>
                <span>Clear Local DB</span>
            </div>
            <div class="menu-item menu-sub-item" onclick="(async()=>{await loadExe2Fn(23,[],[1]);})()">
                <i class="fas fa-store"></i>
                <span>Shop Info</span>
            </div>
        </div>

    </div>
</div>
 </div>
</nav>
<div id="container_blank_main" class="content-container mt-2 mb-2" style="flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center;"></div>
<footer style="background-color: #6f42c1; color: #fff; text-align: center;">
 <p class="mb-0">© <span id="currentYear">${new Date().getFullYear()}</span> Billing Software by sifr</p>
</footer>`;

 try {
  let result1;
  try {
   if (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].usdInAndroWv === 1)
    result1 = await loadCshScriptsSequentially(2, 4, 5, 17, 16);
   else
    result1 = await loadCshScriptsSequentially(2, 4, 5, 17, 16);
  } catch (loadErr) {
   console.warn('Some scripts failed, continuing with available ones');
   result1 = { success: true };
  }

  if (result1 && !result1.success) {
   console.warn('Script load issue, proceeding with form render');
  }
  //const result1 = await loadCshScriptsSequentially(2, 4, 5, 17, 16,);

  // Simple deterministic nav menu toggle (no Bootstrap Collapse state machine,
  // so the menu always hides even if a click lands mid-transition)
  window.toggleNavSubMenu = function () {
   const sub = document.getElementById('menuSubDropdown');
   const toggle = document.getElementById('settings_toggle');
   if (!sub) return;
   const open = sub.classList.toggle('menu-open');
   if (toggle) toggle.classList.toggle('menu-open', open);
  };
  window.closeNavSubMenu = function () {
   const sub = document.getElementById('menuSubDropdown');
   const toggle = document.getElementById('settings_toggle');
   if (sub) sub.classList.remove('menu-open');
   if (toggle) toggle.classList.remove('menu-open');
  };
  window.toggleNavMenu = function () {
   const el = document.getElementById('navbarNav');
   if (el) el.classList.toggle('show');
   if (el && !el.classList.contains('show')) {
    window.closeNavSubMenu();
   }
  };
  window.hideNavMenu = function () {
   const el = document.getElementById('navbarNav');
   if (el) el.classList.remove('show');
   window.closeNavSubMenu();
  };
  const navCollapseEl = document.getElementById('navbarNav');
  if (navCollapseEl) {
   // Hide the nav menu when a menu-item is clicked so it doesn't stay
   // on top of the modal that opens after the click
   navCollapseEl.addEventListener('click', function (e) {
    if (e.target.closest('.menu-item') && !e.target.closest('.menu-sub-toggle')) {
     hideNavMenu();
    }
   });
  }

  if (result1.success) {

   console.log('SUCCESS:', result1.message);
   const createResult = await dbDexieManager.handleNwTables("loader", dbnm, tblsRequired);
   tblFailureCount = createResult.failureCount;
   const result2 = await loadCshScriptsSequentially(18);

   window[my1uzr.worknOnPg].csh.push({ a: getNextCshId(), u: `https://i.postimg.cc/gJ62yjJf/my1.jpg` });
   window[my1uzr.worknOnPg].csh.push({ a: getNextCshId(), u: `https://my1.in/${appOwner.eo}/my1.js` });
   window[my1uzr.worknOnPg].csh.push({ a: getNextCshId(), u: `https://my1.in/${appOwner.eo}/${appOwner.ec}/b/index.html` });
   window[my1uzr.worknOnPg].csh.push({ a: getNextCshId(), u: `https://my1.in/${appOwner.eo}/${appOwner.ec}/b/b.mn` });

   await set_bill_innerHTML('container_blank_main', 0, 1, 0);
  } else {
   console.error('FAILED:', result1.error);
   console.log(`Only ${result1.loadedCount}/${result1.totalScripts} scripts loaded`);
  }

  window[my1uzr.worknOnPg].clientConfig = {};
  fetch('b.da')
   .then(response => response.json())
   .then(config => {
    if (config && config.print_logo) {
     config.print_logo = getGoogleDriveImageUrl(config.print_logo) || 'https://i.postimg.cc/gJ62yjJf/my1.jpg';
    }
    window[my1uzr.worknOnPg].clientConfig = config;
   })
   .catch(err => {
    console.error('Failed to load b.da:', err);
    window[my1uzr.worknOnPg].clientConfig = {};
   });

  document
   .getElementById("sync_all_info")
   .addEventListener("click", function () {
    (async () => {
     try {
      payload0.vw = 1;
      payload0.fn = 4;
      payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, getMaxDateTables());
      const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 1, 1, 1);
      if (response && response.su == 1) {
       hndlRspo4(response, 1);
      } else {
       window.showelsemodal(response?.ms || 'Try Again!');
      }
     } catch (error) {
      console.error("Initlization failed:", error);
     }
    })();
   });
  document
   .getElementById("bt_clr_locl_db")
   .addEventListener("click", function () {
    (async () => { await loadExe2Fn(25, [], [1]); })();
   });
 } catch (error) {
  console.error("Initialization failed:", error);
  showToast("Initialization error - please refresh");
 }

 window.hndlRspo4 = async function (response) {
  handl_op_rspons(response, 1);
 };

 // ==================== FUNCTIONS ====================

 let blurTimeout = null;
 let dropdownClicked = false;

 // Global variables for bill management
 let billTableRowId = 0;
 Object.defineProperty(window, 'billTableRowId', {
  get() { return billTableRowId; },
  set(v) { billTableRowId = v; }
 });
 let billSelectedToUpdate = null;
 window.refreshStoredEyeMeasurements = async function () {
  if (shoEyeMsrmntTbl) stored_eye_msrmnt = await dbDexieManager.getAllRecords(dbnm, "be") || [];
 };
 let globalBill = {};
 let globalItems = [];
 let globalCashInfo = [];

 // QR Scanner variables
 let continuousQRMode = false;
 let qrScannerActive = false;
 let currentQRScanner = null;
 let html5QrcodeScanner = null;

 // QR Scanner state
 let qrScannerState = {
  isPaused: false,
  shouldResume: false,
  scanner: null
 };

 // Helper function to play sounds
 function playSound(url) {
  const audio = new Audio(url);
  audio.play().catch(e => console.log('Audio play failed:', e));
 }

 // Scoped modern styles for the bill-form container-fluid (bill-modern theme)
 function addBillModernStyles() {
  if (window.__bmStylesInjected) return;
  window.__bmStylesInjected = true;
  const st = document.createElement('style');
  st.textContent = `
.bm-scope{max-width:900px;margin:0 auto;padding:6px 10px 20px;--bm-control-height:38px}
.bm-scope .bm-card{background:#fff;border:1px solid #6c757d;border-radius:14px;box-shadow:0 2px 12px rgba(36,27,69,.07);padding:16px;margin-bottom:14px}
.bm-scope .bm-head{display:flex;align-items:center;gap:10px;font-weight:700;font-size:.95rem;color:#4a2d7e;margin-bottom:12px}
.bm-scope .bm-chip{width:32px;height:32px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:#efe9f9;color:#6f42c1;font-size:.85rem;flex-shrink:0}
.bm-scope .bm-input{border:1.1px solid #525455;border-radius:10px;background:#fbfaff;transition:border-color .2s,box-shadow .2s}
.bm-scope .bm-input:focus{outline:none;border-color:#8f5fd6;box-shadow:0 0 0 .22rem rgba(111,66,193,.14)}
.bm-scope .bm-input[readonly]{cursor:pointer;background:#f6f2fd}
.bm-scope .input-group-text{background:#efe9f9;border-color:#6c757d;color:#4a2d7e;font-size:.85rem}
.bm-scope .bm-pre{font-weight:800}
.bm-scope .input-group .bm-input:focus{z-index:0}
.bm-scope .input-group{min-width:0}
.bm-scope .input-group .form-control{min-width:0}
@media(max-width:576px){.bm-scope{padding:4px 6px 16px}.bm-scope .bm-card{padding:12px}.bm-scope .input-group-text{padding:.375rem .5rem;font-size:.78rem}}
.bm-scope .bm-iconbtn{border:1.5px solid #343a40;background:#fff;color:#6f42c1;border-radius:10px;padding:.48rem .7rem;transition:.2s}
.bm-scope .bm-iconbtn:hover{background:#efe9f9;border-color:#8f5fd6;color:#4a2d7e}
.bm-scope .bm-badge{background:#efe9f9;color:#4a2d7e;border-radius:999px;padding:2px 10px;font-size:.78rem;font-weight:700}
.bm-scope .bm-pill{flex:1 1 0;background:#fff;border:1px solid #6c757d;border-radius:12px;padding:4px .2px;text-align:center;display:flex;align-items:center;justify-content:center;gap:.35rem;white-space:nowrap;min-width:0}
.bm-scope .bm-pill small{display:inline;color:#7a7492;font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.4px}
.bm-scope .bm-pill b{font-size:1rem}
.bm-scope .bm-label{font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#7a7492;display:block;margin-bottom:3px}
.bm-scope .bm-amt{background:#fffbeb;border-color:#f1df9a;font-weight:700}
.bm-scope .bm-innerbox{border:1px dashed #6c757d;border-radius:12px;padding:10px;background:#fdfcff;margin-bottom:12px}
.bm-scope .bm-subhead{font-weight:800;font-size:.8rem;letter-spacing:.5px;text-transform:uppercase;color:#7a7492;margin:14px 0 8px}
.bm-scope .bm-banner{background:linear-gradient(135deg,#6f42c1,#4a2d7e);border-radius:12px;color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;margin-top:14px}
.bm-scope .bm-banner .text-success{color:#7cfca0 !important}
.bm-scope .bm-banner .text-warning{color:#ffd700 !important}
.bm-scope .bm-banner .text-danger{color:#ffb3bc !important}
.bm-scope .bm-btn{border:none;border-radius:11px;padding:.62rem 1.1rem;font-weight:700;color:#fff;box-shadow:0 4px 12px rgba(36,27,69,.18)}
.bm-scope .bm-save{background:linear-gradient(135deg,#22c55e,#15803d)}
.bm-scope .bm-updt{background:linear-gradient(135deg,#fbbf24,#d97706)}
.bm-scope .bm-print,.bm-scope .bm-add{background:linear-gradient(135deg,#8f5fd6,#6f42c1)}
.bm-scope .bm-inv-row{width:100%;min-width:0}
.bm-scope .bm-inv-eye{display:flex;gap:.4rem;flex:0 0 auto}
.bm-scope .bm-inv-eye .bm-iconbtn{width:var(--bm-control-height);min-width:var(--bm-control-height);height:var(--bm-control-height);padding:0;display:inline-flex;align-items:center;justify-content:center}
.bm-scope .bm-inv-row>.bm-inv-bill{flex:0 1 180px;width:180px;min-width:130px}
.bm-scope .bm-inv-row>.bm-inv-date{flex:1 1 0;width:0;min-width:125px}
.bm-scope .bm-inv-row .bm-iconbtn,.bm-scope .bm-inv-row .input-group,.bm-scope .bm-inv-row .input-group-text,.bm-scope .bm-inv-row .form-control{height:var(--bm-control-height);min-height:var(--bm-control-height)}
.bm-scope .bm-inv-row .input-group{min-width:0}
.bm-scope .bm-inv-row .input-group-text{flex:0 0 auto;padding:0 .55rem;display:inline-flex;align-items:center;justify-content:center}
.bm-scope .bm-inv-row .form-control{min-width:0;padding-top:0;padding-bottom:0}
.bm-scope .bm-inv-date .form-control{border-top-left-radius:0;border-bottom-left-radius:0}
.bm-scope .bm-inv-row .bm-date-wrap{position:relative;flex:1 1 0;min-width:0;height:var(--bm-control-height)}
.bm-scope .bm-date-wrap .bm-date-disp{position:absolute;inset:0;display:flex;align-items:center;padding:0 .6rem;pointer-events:none;white-space:nowrap;overflow:hidden;color:#212529;font-size:.8rem}
@media(max-width:576px){.bm-scope .bm-inv-row{gap:.35rem !important}.bm-scope .bm-inv-eye .bm-iconbtn{font-size:.75rem}.bm-scope .bm-inv-row>.bm-inv-bill{width:95px;flex-basis:95px;min-width:90px}.bm-scope .bm-inv-row>.bm-inv-date{min-width:80px}.bm-scope .bm-inv-row .input-group-text{padding:0 .4rem;font-size:.72rem}.bm-scope .bm-inv-row .form-control{font-size:.72rem;padding-left:.3rem;padding-right:.3rem}.bm-scope .bm-date-wrap .bm-date-disp{padding:0 .35rem;font-size:.7rem}.bm-scope .bm-pre{font-size:.7rem}}
.bm-scope .added-item-card{border-color:#6c757d;border-left:4px solid #28a745 !important;border-radius:12px;box-shadow:0 2px 10px rgba(36,27,69,.06)}
.bm-scope .added-item-image{width:64px;height:64px}
.bm-scope .bm-date-wrap{position:relative;flex:1 1 0;min-width:0}
.bm-scope .bm-date-wrap.has-val .form-control{color:transparent;caret-color:transparent}
.bm-scope .bm-date-wrap .bm-date-disp{position:absolute;inset:0;display:flex;align-items:center;padding:0 .75rem;pointer-events:none;color:#212529;font-size:.95rem}
.bm-scope .bm-date-wrap .form-control-sm~.bm-date-disp{font-size:.875rem;padding:0 .5rem}
.bm-scope .bm-date-wrap.text-center .bm-date-disp{justify-content:center}
`;
  document.head.appendChild(st);
 }

 async function set_bill_innerHTML(...params) {
  try {
   items = await dbDexieManager.getAllRecords(dbnm, "s") || [];
   prods = await dbDexieManager.getAllRecords(dbnm, "p") || [];
   clientReferrerArray = [];
   stored_bill = await dbDexieManager.getAllRecords(dbnm, "b") || [];
   if (shoEyeMsrmntTbl) stored_eye_msrmnt = await dbDexieManager.getAllRecords(dbnm, "be") || [];
   stored_bill_items = await dbDexieManager.getAllRecords(dbnm, "i") || [];
   stored_bill_cash_info = await dbDexieManager.getAllRecords(dbnm, "r") || [];
   window.billSaved = false;
  } catch (error) {
   console.error("Initialization failed:", error);
   showToast("Initialization error - please refresh");
  }

  addBillModernStyles();

  const c_ontainer_blank_main = document.getElementById(params[0]);
  c_ontainer_blank_main.innerHTML = `
<div class="container-fluid bm-scope">
<div class="bm-card">
<!-- Invoice Row -->
<div class="d-flex align-items-center gap-2 flex-nowrap bm-inv-row mb-3 pb-2 mt-2">
<div class="bm-inv-eye flex-shrink-0">
<button class="btn bm-iconbtn fs-5" onclick="showBillCards()">
<i class="fas fa-eye"></i>
</button>
<button id="fileUploadTesting" class="btn bm-iconbtn fs-6" onclick="temporary()" style="display:none;">
<i class="fas fa-eye"></i>
</button>
</div>
<div class="input-group bm-inv-bill flex-shrink-0">
<span class="input-group-text bm-pre fs-6">Bill:</span>
<input type="text" class="form-control fs-6 fw-bold bm-input" placeholder="Invoice Number" id="invoiceNumber">
</div>
<div class="input-group bm-inv-date">
<span class="input-group-text fs-6"><i class="far fa-calendar"></i></span>
<div class="bm-date-wrap">
<input type="text" class="form-control bm-input" id="receiptDate" placeholder="Select Date">
<span class="bm-date-disp" id="receiptDate_disp"></span>
</div>
</div>
<div class="input-group bm-inv-date">
<span class="input-group-text fs-6"><i class="fas fa-sync-alt"></i></span>
<div class="bm-date-wrap">
<input type="text" class="form-control bm-input" id="deliveryDate" placeholder="Select Date">
<span class="bm-date-disp" id="deliveryDate_disp"></span>
</div>
</div>
</div>

<!-- Customer & Referrer Row -->
<div class="row g-2 pt-1" style="border-top:1px solid #6c757d;">
<div class="col-7 col-sm-8">
<div class="input-group">
<span class="input-group-text fs-6"><i class="fas fa-user"></i></span>
<input id="c_dtls_lient" type="text" class="form-control bm-input" readonly onclick="(async () => { await loadExe2Fn(14, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_op_ViewCall', 1, typeof window[my1uzr.worknOnPg].clientConfig.xtraEiFlds_forCust !== 'undefined' ? window[my1uzr.worknOnPg].clientConfig.xtraEiFlds_forCust : null], [1]); })()" placeholder="Customer Details">
</div>
<input type="hidden" id="clientId">
</div>
<div class="col-5 col-sm-4">
<div class="input-group">
<span class="input-group-text fs-6"><i class="fas fa-handshake"></i></span>
<input id="r_dtls_eferrer" type="text" class="form-control bm-input" readonly onclick="(async () => { await loadExe2Fn(14, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_op_ViewCall', 2, typeof window[my1uzr.worknOnPg].clientConfig.xtraEiFlds_forRef !== 'undefined' ? window[my1uzr.worknOnPg].clientConfig.xtraEiFlds_forRef : null], [1]); })()" placeholder="Referrer">
</div>
<input type="hidden" id="referrerId">
</div>
</div>

<!-- Items Container -->
<div id="billItemsContainer" class="mb-3">
<!-- Items will be added here dynamically -->
</div>

<!-- Added Items -->
<div class="bm-subhead" style="margin-top:16px;">Added Items</div>
<div id="addedItemsContainer">
<!-- Added items will appear here -->
</div>
<div id="dv_for_add_itm_btn" class="text-center mt-2" style="display:none;">
<!--keep this as comment: button class="btn btn-primary" onclick="showAddItemModal()"-->
<button class="btn bm-btn bm-add mb-3" style="font-size:.85rem;" onclick="(async () => { await loadExe2Fn(29, [], [1]); })();">
<i class="fas fa-plus-circle me-2"></i>Add Item to Bill
</button>
</div>

<!-- Items Summary Pills -->
<div class="row g-2" id="itemsSummaryRow">
<div class="col-3"><div class="bm-pill w-100"><small>Itms:</small><b id="totalItems">0</b></div></div>
<div class="col-3"><div class="bm-pill w-100"><small>Qty:</small><b id="totalQuantity">0</b></div></div>
<div class="col-6"><div class="bm-pill w-100"><small>Total:</small><b style="color:#198754;">₹<span id="totalPrice">0.00</span></b></div></div>
</div>

<!-- Payments -->
<div id="rcvd_amts_dv">
<div class="bm-subhead" style="margin-top:16px;">Payments</div>

<!-- Discount Row -->
<div class="row g-2 mb-3" style="flex-wrap:nowrap;">
<div class="col-6" style="min-width:0;">
<label class="bm-label">Discount %</label>
<input type="number" class="form-control bm-input bm-amt" id="discountPercentage" style="font-size:1.05rem;border:2px solid #000080;" min="0" max="100" step="0.1" placeholder="0.00" value="0">
</div>
<div class="col-6" style="min-width:0;">
<label class="bm-label">Discount ₹</label>
<input type="number" class="form-control bm-input bm-amt" id="discountAmount" style="font-size:1.05rem;border:2px solid #000080;" min="0" step="1" placeholder="0.00" value="0">
</div>
</div>

<!-- Total Row -->
<div class="d-flex justify-content-between align-items-center mb-2">
<label class="form-label mb-0 fw-bold">Total:</label>
<span class="fw-bold fs-5" style="color:#198754;">₹<span id="grandBillTotal">0.00</span></span>
</div>

<!-- Add Received Amount Box -->
<div class="bm-subhead">Received Amounts</div>
<div class="bm-innerbox" id="addReceivedAmountCard">
<div class="row g-1 align-items-center">
<div class="col-3">
<div class="bm-date-wrap text-center">
<input type="text" class="form-control form-control-sm bm-input text-center" id="receivedDateTime" placeholder="Date">
<span class="bm-date-disp" id="receivedDateTime_disp"></span>
</div>
</div>
<div class="col">
<div class="input-group input-group-sm">
<span class="input-group-text bg-white p-1" style="border:2px solid #000080;border-right:2px solid #6c757d;">₹</span>
<input type="text" class="form-control form-control-sm bm-input bm-amt" oninput="window.allowFloat(this,2)" placeholder="Amount" id="receivedAmount" inputmode="decimal" autocomplete="off" style="font-size:1.05rem;border:2px solid #000080;border-left:2px solid #6c757d;margin-left:-2px;">
</div>
<input type="hidden" id="receivedCashier" value="">
</div>
<div class="col-auto">
<div class="position-relative d-inline-block">
<button class="btn btn-outline-secondary btn-sm" type="button" tabindex="-1" id="receivedCashierBtn" title="Select Cashier" onclick="toggleReceivedCashierDropdown(event)" style="border:1px solid #212529;border-radius:.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;"><i class="fas fa-user"></i></button>
<div id="receivedCashierDropdown" style="display:none;position:absolute;left:0;right:auto;top:100%;bottom:auto;z-index:20;width:max-content;min-width:220px;max-width:calc(100vw - 20px);max-height:200px;overflow-y:auto;background:#fff;border:1px solid #212529;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.15);"></div>
</div>
</div>
<div class="col-auto text-center">
<div class="d-inline-block position-relative" style="height:31px;">
<button class="btn btn-primary btn-sm" id="paymentTypeBtn" type="button" tabindex="-1" style="pointer-events:none;">
<i class="fas fa-credit-card"></i>
</button>
<select id="paymentType" onchange="this.blur();updatePaymentTypeIcon()" style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:3;">
<option value="0">Select</option>
<option value="1">C Cash</option>
<option value="2">Q Cheque</option>
<option value="3">A Card</option>
<option value="4">U UPI</option>
<option value="5">B Bank Transfer</option>
</select>
</div>
</div>
<div class="col-auto text-end ml-2">
<button class="btn btn-primary btn-sm" id="addReceivedAmountBtn" onclick="addReceivedAmount()">
<i class="fas fa-plus"></i>
</button>
</div>
</div>
<div class="row mt-2" id="receivedPaymentUpdateBtnWrap" style="display:none;">
<div class="col-12 text-center">
</div>
</div>
</div>

<!-- Added Received Amounts -->
<div id="addedReceivedAmountsContainer">
<!-- Received amounts will appear here -->
</div>

<!-- Received Total Row -->
<div class="d-flex justify-content-between align-items-center mt-2 mb-1">
<label class="form-label mb-0 fw-bold">Received:</label>
<span class="fw-bold fs-5" style="color:#2563eb;">₹<span id="grandTotalReceived">0.00</span></span>
</div>

<!-- Total Due Banner -->
<div class="bm-banner">
<h5 class="mb-0 fw-bolder">Total due:</h5>
<h4 class="mb-0 fw-bolder">₹<span id="grandBalance">0.00</span></h4>
</div>
</div>

<div class="row mt-4">
<div class="col-12">
<div id="blankDivSection1">
<!-- This div is intentionally left blank for future use -->
</div>
</div>
</div>

<!-- Notes + Actions -->
<div class="bm-subhead" style="margin-top:16px;">Notes &amp; Actions</div>
<textarea class="form-control bm-input" id="billNotes" rows="3" placeholder="Set comment/note for this bill.\nWhile generating 'bill-print', u can decide whether to print this 'note' in bill;"></textarea>
<div class="row g-2 mt-1">
<div class="col-4">
<button id="saveBtn" class="btn bm-btn bm-save w-100" onclick="crUpBill(3)">
<i class="fas fa-save me-2"></i>Save
</button>
</div>
<div class="col-4">
<button class="btn bm-btn bm-updt w-100" id="updateBtn" onclick="crUpBill(7)" disabled>
<i class="fas fa-edit me-2"></i>Updt
</button>
</div>
<div class="col-4">
<button class="btn bm-btn bm-print w-100" id="printBtn" disabled onclick='playSound("https://bigsoundbank.com/UPLOAD/mp3/1417.mp3"); sho_bl_modal(billTableRowId)'>
<i class="fas fa-print me-2"></i>Print
</button>
</div>
</div>
</div>
</div>
`;

  if (window.__bmItemsObserver) {
   window.__bmItemsObserver.disconnect();
  }
  const _aicEl = document.getElementById('addedItemsContainer');
  if (_aicEl) {
   window.__bmItemsObserver = new MutationObserver(function () {
    updateBillSectionsVisibility();
   });
   window.__bmItemsObserver.observe(_aicEl, { childList: true });
  }
  updateBillSectionsVisibility();

  // Initialize dates with current date and time
  initializeDatePickers();

  // Add event listeners for discount calculations
  document.getElementById('discountPercentage').addEventListener('input', calculateDiscountFromPercentage);
  document.getElementById('discountAmount').addEventListener('input', calculateDiscountFromAmount);

  // Add select all on focus for discount inputs
  document.getElementById('discountPercentage').addEventListener('focus', function () {
   this.select();
  });

  document.getElementById('discountAmount').addEventListener('focus', function () {
   this.select();
  });

  // Delegated fallback: keep discount inputs working even if the elements are
  // re-rendered or the direct listeners above were attached to replaced DOM.
  document.addEventListener('input', function (e) {
   const el = e.target;
   if (!el || !el.id) return;
   if (el.id === 'discountPercentage') calculateDiscountFromPercentage();
   else if (el.id === 'discountAmount') calculateDiscountFromAmount();
  });

  // Initialize received amount form
  initializeReceivedAmountForm();

  // Add dynamic styles for the dropdown
  addDropdownStyles();

  // Set max bill number
  setMaxBillNo();

  disablePrintButton();
  disableUpdateButton();
  enableSaveBtn();

  if (typeof billingRequisit_be === 'function' && shoEyeMsrmntTbl) {
   await billingRequisit_be();
  }

  const urlParams = new URLSearchParams(window.location.search);
  const monoValue = urlParams.get('mono');

  if (monoValue) {
   await show_client_bills(monoValue);
  }

  // Load default remark from localStorage
  setTimeout(() => {
   const defaultRemark = localStorage.getItem('defaultBillRemark');
   if (defaultRemark) {
    document.getElementById('billNotes').value = defaultRemark;
    updateBillSectionsVisibility();
   }
  }, 500);
  setTimeout(() => {
   updateBillSectionsVisibility();
  }, 700);
 }

 function showAddItemModal() {
  // Create a modal
  const modal = create_modal_dynamically('addItemModal');
  const modalContent = modal.contentElement;
  const modalInstance = modal.modalInstance;

  // ✅ FIX: Add modal-lg class for larger modal and handle body absence
  const modalDialog = modal.modalElement.querySelector('.modal-dialog');
  if (modalDialog) {
   modalDialog.classList.add('modal-lg');
  }
  const modalBody = modalContent.querySelector('.modal-body');
  if (!modalBody) {
   modalContent.style.maxHeight = '85vh';
   modalContent.style.overflowY = 'auto';
   modalContent.style.backgroundColor = '#e2d9f3';
  }

  // Create a clean modal form
  const modalHTML = `
<div class="modal-header">
<h5 class="modal-title">Add Item to Bill</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body border border-dark">
<div class="row">
<!-- Left side - Image (fixed 3 columns) -->
<div class="col-3">
<div class="text-center">
<input type="text" 
class="form-control form-control-sm mb-2 border border-dark" 
placeholder="Scan or type item ID" 
id="modalItemIdInput"
style="font-size: 0.8rem;">

<!-- Continuous QR Mode Switch -->
<div class="form-check form-switch mt-2 mb-2" style="font-size: 0.8rem;">
<input class="form-check-input" type="checkbox" id="modalContinuousQRMode">
<label class="form-check-label" for="modalContinuousQRMode">Continuous Scan</label>
</div>

<div id="modalItemImageContainer" class="text-center">
<i class="fas fa-image fa-3x text-muted"></i>
<div class="mt-2">
<small class="text-muted">No Image</small>
</div>
</div>
</div>
</div>

<!-- Right side - Details (fixed 9 columns) -->
<div class="col-9">
<!-- Row 1 - Item Name with Add New Button -->
<div class="row mb-2 g-0">
<div class="col-12">
<div style="position:relative;">
<input type="text" class="form-control border border-dark" placeholder="Item Name" id="modalItemName">
</div>
</div>
</div>

<!-- Row 2 - Quantity, Rate, Price (fixed 4-4-4 columns) -->
<div class="row mb-2 g-0">
<div class="col-4">
<input type="number" class="form-control border border-dark" placeholder="Qty" id="modalItemQty" min="1" value="" onfocus="this.select();">
</div>
<div class="col-4">
<input type="number" class="form-control border border-dark" placeholder="Rate" id="modalItemRate" min="0" step="1" onfocus="this.select();">
</div>
<div class="col-4">
<input type="number" class="form-control border border-dark" placeholder="Price" id="modalItemPrice" min="0" step="1" readonly>
</div>
</div>

<!-- Row 3 - Description and Add Button -->
<div class="row g-0">
<div class="col-12">
<textarea class="form-control border border-dark" placeholder="Description" id="modalItemDescription" rows="2"></textarea>
</div>
</div>
</div>
</div>
</div>
<div class="modal-footer">
<button id="modalAddNewItemBtn" class="btn btn-warning w-100" onclick="handleAddNewItemInModal()" style="display: none;"><i class="fas fa-plus"></i> in inventory</button>
&emsp;&emsp;
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
&emsp;
<button class="btn btn-success h-100" id="modalAddItemBtn" onclick="addItemFromModal()" disabled><i class="fas fa-plus"></i> in bill</button>
</div>
`;

  modalContent.innerHTML = modalHTML;

  // Initialize event listeners for the modal - pass the entire modal object
  initializeModalEventListeners(modal);

  // Show the modal
  modalInstance.show();

  // Focus on the item name field
  setTimeout(() => {
   const modalItemName = document.getElementById('modalItemName');
   if (modalItemName) {
    modalItemName.focus();
   }
  }, 100);
 }

 function initializeModalEventListeners(modalResult) {
  // Get elements from the modal
  const modalItemQty = document.getElementById('modalItemQty');
  const modalItemRate = document.getElementById('modalItemRate');
  const modalItemName = document.getElementById('modalItemName');
  const modalItemIdInput = document.getElementById('modalItemIdInput');
  const modalContinuousQRMode = document.getElementById('modalContinuousQRMode');
  const modalAddNewItemBtn = document.getElementById('modalAddNewItemBtn');
  const modalAddItemBtn = document.getElementById('modalAddItemBtn');

  // Safely add modal close event listener
  if (modalResult && modalResult.modalElement) {
   modalResult.modalElement.addEventListener('hidden.bs.modal', function () {
    // Clear any blur timeout
    if (blurTimeout) {
     clearTimeout(blurTimeout);
     blurTimeout = null;
    }
    // Remove any remaining dropdown
    const hidDropdown = document.querySelector('.item-dropdown');
    if (hidDropdown) {
     hidDropdown.remove();
    }
   });
  }

  if (modalItemQty && modalItemRate) {
   modalItemQty.addEventListener('input', calculateModalPrice);
   modalItemRate.addEventListener('input', calculateModalPrice);
  }

  if (modalItemName) {
   modalItemName.addEventListener('input', function (e) {
    showItemDropdown(this);

    // Show/hide Add New Item button based on search
    const searchValue = this.value.trim();
    if (modalAddNewItemBtn) {
     if (searchValue) {
      const matchedItems = items.filter(item => {
       if (!item || !item.gn) return false;
       return item.gn.toLowerCase().includes(searchValue.toLowerCase());
      });

      if (matchedItems.length === 0) {
       modalAddNewItemBtn.style.display = 'block';
      } else {
       modalAddNewItemBtn.style.display = 'none';
      }
     } else {
      modalAddNewItemBtn.style.display = 'none';
     }
    }
   });

   modalItemName.addEventListener('focus', function (e) {
    showItemDropdown(this);
   });

   modalItemName.addEventListener('blur', function (e) {
    const inputElement = this;

    if (blurTimeout) {
     clearTimeout(blurTimeout);
    }

    dropdownClicked = false;

    blurTimeout = setTimeout(() => {
     if (dropdownClicked) {
      dropdownClicked = false;
      return;
     } else {
      handleModalItemNameBlur(inputElement);
     }
    }, 200);
   });
  }

  if (modalItemIdInput) {
   modalItemIdInput.addEventListener('input', handleModalItemIdInput);
   modalItemIdInput.addEventListener('click', async function () {
    if (modalContinuousQRMode && modalContinuousQRMode.checked && qrScannerActive) {
     showToast('Continuous scan already active');
     return;
    }
    await openQRScannerModal();
   });
  }

  if (modalContinuousQRMode) {
   modalContinuousQRMode.addEventListener('change', function (e) {
    continuousQRMode = e.target.checked;
    localStorage.setItem('continuousQRMode', continuousQRMode ? 'true' : 'false');

    if (continuousQRMode) {
     showToast('Continuous scan mode enabled');
    }
   });
  }

  // Enable/disable add button based on form validity
  if (modalItemName && modalAddItemBtn) {
   modalItemName.addEventListener('input', function () {
    updateModalAddButtonState();
   });

   modalItemRate.addEventListener('input', function () {
    updateModalAddButtonState();
   });
  }

  if (modalItemRate) {
   modalItemRate.addEventListener('input', function () {
    calculateModalPrice();
    updateModalAddButtonState(); // Add this line
   });
  }
 }

 function calculateModalPrice() {
  const qty = parseFloat(document.getElementById('modalItemQty').value) || 1;
  const rate = parseFloat(document.getElementById('modalItemRate').value) || 0;
  const price = qty * rate;
  document.getElementById('modalItemPrice').value = price.toFixed(2);

  // Update add button state
  updateModalAddButtonState();
 }

 function updateModalAddButtonState() {
  const modalAddItemBtn = document.getElementById('modalAddItemBtn');
  if (!modalAddItemBtn) return;

  const name = document.getElementById('modalItemName').value.trim();
  const price = parseFloat(document.getElementById('modalItemPrice').value) || 0;
  const itemId = document.getElementById('modalItemName').getAttribute('data-item-id');

  // Check if item exists in inventory
  const itemExistsInInventory = checkIfItemExists(name);

  // Enable button only if:
  // 1. Name is not empty
  // 2. Price > 0
  // 3. Item exists in inventory OR we have a valid item ID
  // 4. Item has a valid ID (either from existing item or newly created)
  if (name && price > 0 && (itemExistsInInventory || itemId)) {
   modalAddItemBtn.disabled = false;
  } else {
   modalAddItemBtn.disabled = true;
  }
 }

 // Helper function to check if item exists in inventory
 function checkIfItemExists(itemName) {
  if (!itemName.trim()) return false;

  const searchName = itemName.toLowerCase().trim();

  // Check if exact match exists in items array
  const matchedItems = items.filter(item => {
   if (!item || !item.gn) return false;
   return item.gn.toLowerCase() === searchName;
  });

  return matchedItems.length > 0;
 }

 function handleModalItemNameBlur(inputElement) {
  const itemName = inputElement.value.trim();
  const modalAddNewItemBtn = document.getElementById('modalAddNewItemBtn');

  if (itemName === '') {
   clearModalItemForm();
   if (modalAddNewItemBtn) modalAddNewItemBtn.style.display = 'none';
   // Update button state
   updateModalAddButtonState();
   return;
  }

  const matchedItems = items.filter(item => {
   if (!item || !item.gn) return false;
   return item.gn.toLowerCase() === itemName.toLowerCase();
  });

  if (matchedItems.length !== 1) {
   // Clear the data-item-id attribute since item doesn't exist
   inputElement.removeAttribute('data-item-id');
   if (modalAddNewItemBtn) modalAddNewItemBtn.style.display = 'block';
  } else {
   // Exactly one match found
   if (modalAddNewItemBtn) modalAddNewItemBtn.style.display = 'none';
   // Set the item ID attribute
   inputElement.setAttribute('data-item-id', matchedItems[0].a);
  }

  // Always update button state after name blur
  updateModalAddButtonState();
 }

 function clearModalItemForm() {
  document.getElementById('modalItemName').value = '';
  document.getElementById('modalItemName').removeAttribute('data-item-id');
  document.getElementById('modalItemQty').value = '';
  document.getElementById('modalItemRate').value = '';
  document.getElementById('modalItemPrice').value = '';
  document.getElementById('modalItemDescription').value = '';
  document.getElementById('modalItemIdInput').value = '';

  const imageContainer = document.getElementById('modalItemImageContainer');
  if (imageContainer) {
   imageContainer.innerHTML = `
<i class="fas fa-image fa-3x text-muted"></i>
<div class="mt-2">
<small class="text-muted">No Image</small>
</div>
`;
  }

  const modalAddItemBtn = document.getElementById('modalAddItemBtn');
  if (modalAddItemBtn) {
   modalAddItemBtn.disabled = true;
  }
 }

 function handleModalItemIdInput(event) {
  const itemId = event.target.value.trim();

  if (itemId === '') {
   const existingDropdown = document.querySelector('.item-id-dropdown');
   if (existingDropdown) {
    existingDropdown.remove();
   }
   return;
  }

  const matchedItems = items.find((c) => c.a.toString() == itemId);

  const existingDropdown = document.querySelector('.item-id-dropdown');
  if (existingDropdown) {
   existingDropdown.remove();
  }

  if (!matchedItems) {
   showToast('No items found with this ID');

   if (continuousQRMode && qrScannerActive) {
    event.target.value = '';
   }
  } else {
   if (window[my1uzr.worknOnPg]?.confg?.addByQR == 1) {
    addItemDirectlyFromQR(matchedItems);
    event.target.value = '';

    window.lastQRScannedItemAdded = true;
    window.lastQRScannedItemId = matchedItems.a;

    // Close the modal after adding via QR
    const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
    if (modal) {
     modal.hide();
    }
   } else {
    selectModalItem(matchedItems);
    event.target.value = '';

    window.lastQRScannedItemAdded = true;
    window.lastQRScannedItemId = matchedItems.a;
   }
  }
 }

 function selectModalItem(item) {
  document.getElementById('modalItemName').value = item.gn;
  document.getElementById('modalItemRate').value = item.k;
  document.getElementById('modalItemQty').value = '';

  // Set the data-item-id attribute
  document.getElementById('modalItemName').setAttribute('data-item-id', item.a);

  calculateModalPrice();

  const imageContainer = document.getElementById('modalItemImageContainer');
  if (imageContainer && item.gu) {
   imageContainer.innerHTML = `
<img src="${getGoogleDriveImageUrl(item.gu)}" 
class="img-fluid rounded" 
alt="Item Image"
style="max-width: 100%; height: auto; max-height: 120px; object-fit: cover;"
onerror="this.style.display='none'; document.getElementById('modalItemImageContainer').innerHTML = '<i class=\\'fas fa-image fa-3x text-muted\\'></i><div class=\\'mt-2\\'><small class=\\'text-muted\\'>No Image</small></div>'">
`;
  }

  mostUsedItems[item.a] = (mostUsedItems[item.a] || 0) + 1;

  const modalAddNewItemBtn = document.getElementById('modalAddNewItemBtn');
  if (modalAddNewItemBtn) modalAddNewItemBtn.style.display = 'none';

  // Update button state
  updateModalAddButtonState();

  setTimeout(() => {
   document.getElementById('modalItemQty').focus();
  }, 10);
 }

 async function handleAddNewItemInModal(nwProdNm = '') {
  // Get the value from modal if not provided
  if (!nwProdNm) {
   nwProdNm = document.getElementById('modalItemName').value.trim();
  }

  // Close the dropdown in modal
  const dropdown = document.querySelector('.item-dropdown');
  if (dropdown) {
   dropdown.remove();
  }

  // Then open the add item modal
  await loadExe2Fn(11, [nwProdNm, "handleNewItmAddedToInventory"], [1]);
 }
 function handleNewItmAddedToInventory(nwItmNm) {
  try {
   const itemName = nwItmNm.trim();
   // 2. Find the item in items array (case-insensitive)
   const findItem = () => {
    return items.find(item => {
     if (!item || !item.gn) return false;
     return item.gn.toLowerCase() === itemName.toLowerCase();
    });
   };

   let foundItem = findItem();

   if (!foundItem) {
    // If not found immediately, wait a bit and try again (item might have just been added)
    setTimeout(() => {
     // Refresh items array if needed
     if (typeof dbDexieManager !== 'undefined') {
      dbDexieManager.getAllRecords(dbnm, "s").then(refreshedItems => {
       items = refreshedItems || [];
       const retryItem = findItem();

       if (retryItem) {
        // Simulate a dropdown click event to add the item
        selectModalItem(retryItem);
        addItemFromModal();
       } else {
        showToast(`Item "${itemName}" not found in inventory`);
       }
      }).catch(error => {
       console.error('Error refreshing items:', error);
       showToast('Error searching for item');
      });
     }
    }, 1000);
    return;
   }

   // 3. Use the existing function to add the item
   selectModalItem(foundItem);
   addItemFromModal();
   updateBillSectionsVisibility();

  } catch (error) {
   console.error('Error in handleNewItmAddedToInventory:', error);
   showToast('Error adding new inventory item to bill');
  }
 }

 function addItemFromModal() {
  // Get values from modal
  const name = document.getElementById('modalItemName').value.trim();
  const qty = parseInt(document.getElementById('modalItemQty').value) || 1;
  const rate = parseFloat(document.getElementById('modalItemRate').value) || 0;
  const price = parseFloat(document.getElementById('modalItemPrice').value) || 0;
  const description = document.getElementById('modalItemDescription').value;
  const itemId = document.getElementById('modalItemName').getAttribute('data-item-id');
  const imageUrl = document.querySelector('#modalItemImageContainer img')?.src || '';

  // Validation
  if (!name) {
   showToast('Please enter item name');
   document.getElementById('modalItemName').focus();
   return;
  }

  if (!price || parseFloat(price) <= 0) {
   showToast('Please enter a valid price');
   document.getElementById('modalItemRate').focus();
   return;
  }

  // Check if item already exists in sale list with same rate
  const existingItem = findExistingItemInSaleList(itemId, rate);

  if (existingItem) {
   // Item exists with same rate - increment quantity
   incrementItemQuantity(existingItem, qty);
   showToast(`Quantity increased for ${name}`);

   // Close the modal
   const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
   if (modal) {
    modal.hide();
   }

   // Play sound for item addition
   playSound('https://cdn.pixabay.com/download/audio/2025/10/21/audio_3880ed67e2.mp3');
   return;
  }

  // Add new item
  const addedItemsContainer = document.getElementById('addedItemsContainer');
  const uniqueItemId = Date.now();

  const itemHTML = `
<div class="card mb-3 added-item-card" id="invoiceItem-${uniqueItemId}" data-item-id="${itemId}" data-item-rate="${rate}">
<div class="card-body">
<div class="row">
<!-- Left side - Image (fixed 3 columns) -->
<div class="col-3">
<div class="text-center">
${`<img src="${imageUrl || 'https://cdn-icons-png.freepik.com/512/13543/13543330.png'}" class="added-item-image" alt="Item Image" 
onerror="this.src='https://cdn-icons-png.freepik.com/512/13543/13543330.png'">`}
</div>
</div>

<!-- Right side - Details (fixed 9 columns) -->
<div class="col-9">
<!-- Row 1 - Item Name -->
<div class="row mb-2 g-0">
<div class="col-10">
<strong>${name}</strong>
</div>
<div class="col-2 d-flex align-items-center justify-content-end">
<button class="btn btn-outline-danger btn-sm" onclick="removeItemFromInvoice(${uniqueItemId})">
<i class="fas fa-trash"></i>
</button>
</div>
</div>

<!-- Row 2 - Quantity, Rate, Price (fixed 4-4-4 columns) -->
<div class="row mb-2 g-0">
<div class="col-4">
<strong>Qty:</strong> 
<input type="number" 
class="form-control form-control-sm d-inline-block w-auto" 
value="${qty}" 
min="1" 
step="1"
style="width: 70px; display: inline-block;"
onchange="updateItemQuantity(${uniqueItemId}, parseFloat(this.value))"
onblur="updateItemQuantity(${uniqueItemId}, parseFloat(this.value))">
</div>
<div class="col-4">
<strong>Rate:</strong> 
<input type="number" 
class="form-control form-control-sm d-inline-block w-auto" 
value="${rate.toFixed(2)}" 
min="0" 
step="0.01"
style="width: 80px; display: inline-block;"
onchange="updateItemRate(${uniqueItemId}, this.value)"
onblur="updateItemRate(${uniqueItemId}, this.value)">
</div>
<div class="col-4">
<strong>Price:</strong> ₹<span id="itemPrice-${uniqueItemId}">${price.toFixed(2)}</span>
</div>
</div>

<!-- Row 3 - Description -->
<div class="row g-0">
<div class="col-12">
<small class="text-muted">${description || ''}</small>
</div>
</div>
</div>
</div>
</div>
</div>
`;

  addedItemsContainer.insertAdjacentHTML('beforeend', itemHTML);

  // Update bill summary
  updateBillSummary();

  // Close the modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
  if (modal) {
   modal.hide();
  }

  // Play sound for item addition
  playSound('https://cdn.pixabay.com/download/audio/2025/10/21/audio_3880ed67e2.mp3');
  setTimeout(() => {
   updateBillSectionsVisibility();
  }, 1111);
 }

 // Enable drag-to-scroll on a scrollable element
 function enableDragScroll(element, scrollTarget) {
  if (!element) return;

  const target = scrollTarget || element;

  let isDown = false;
  let dragged = false;
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let startScrollTop = 0;

  element.style.cursor = 'grab';

  element.addEventListener('pointerdown', function (e) {

   // Only left mouse button
   if (e.pointerType === 'mouse' && e.button !== 0) return;

   // Don't drag when clicking controls
   if (e.target.closest(
    'input, select, textarea, button, a, label'
   )) return;

   isDown = true;
   dragged = false;

   startX = e.clientX;
   startY = e.clientY;

   startScrollLeft = target.scrollLeft;
   startScrollTop = target.scrollTop;

   element.style.cursor = 'grabbing';
   element.style.userSelect = 'none';

   // Keep receiving pointer events
   element.setPointerCapture?.(e.pointerId);
  });


  element.addEventListener('pointermove', function (e) {

   if (!isDown) return;

   const dx = e.clientX - startX;
   const dy = e.clientY - startY;

   // Small movement = click
   if (!dragged && (
    Math.abs(dx) > 4 ||
    Math.abs(dy) > 4
   )) {
    dragged = true;
   }

   if (dragged) {
    target.scrollLeft = startScrollLeft - dx;
    target.scrollTop = startScrollTop - dy;
   }
  });


  function stopDrag(e) {

   if (!isDown) return;

   isDown = false;

   element.style.cursor = 'grab';
   element.style.userSelect = '';

   if (e?.pointerId !== undefined) {
    element.releasePointerCapture?.(e.pointerId);
   }
  }


  element.addEventListener('pointerup', stopDrag);
  element.addEventListener('pointercancel', stopDrag);


  // Prevent card click after dragging
  element.addEventListener('click', function (e) {

   if (dragged) {
    e.preventDefault();
    e.stopPropagation();

    dragged = false;
   }

  }, true);
 }

 async function showBillCards() {
  const modal = create_modal_dynamically('bill_cards_container');
  const b_ill_cards_container = modal.contentElement;
  const m_odalInstance = modal.modalInstance;
  modal.modalElement.querySelector('.modal-dialog').classList.add('modal-xl');
  // Only the inner bill list should scroll - prevent the outer body from showing a second scrollbar
  b_ill_cards_container.style.overflowY = 'hidden';
  b_ill_cards_container.innerHTML = `
<div class="modal-header">
<h5 class="modal-title">Search Bills</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
 </div>
   <div class="modal-body overflow-y-auto" id="billCardsScrollArea" style="max-height: calc(100vh - 170px);">
<div class="input-group mb-3">
 <input type="text" class="form-control border border-dark" id="bill_op_search" placeholder="Search by bill no, Mobile, Name...">
<span class="input-group-text p-0 border border-dark"><i class="fa-solid fa-magnifying-glass px-2"></i></span>
<span class="input-group-text p-0 border border-dark">
<button id="billDateToggleBtn" class="btn p-0 px-2 border-0">
    <i class="fa-solid fa-angle-right text-primary"></i>
</button>
</span>
  </div>
  <small id="billDateError" class="text-danger d-none">From date cannot be after To date</small>
<div id="billDateFilterSection" class="row g-2 mb-3" style="display:none;">
    <div class="col-6">
        <div class="d-flex align-items-center gap-2">
            <label class="mb-0 text-nowrap">From</label>
            <input type="date" class="form-control form-control-sm border border-dark" style="max-width: 65%;" id="billFilterFromDate">
        </div>
    </div>

    <div class="col-6">
        <div class="d-flex align-items-center gap-2">
            <label class="mb-0 text-nowrap">To</label>
            <input type="date" class="form-control form-control-sm border border-dark" style="max-width: 65%;" id="billFilterToDate">
        </div>
    </div>
</div>
 <div id="billCardsContainer" class="row g-3 border"></div>
</div>
`;

  // Enable drag-to-scroll for the big bill list
  const billListScrollArea = b_ill_cards_container.querySelector('#billCardsScrollArea');
  enableDragScroll(billListScrollArea);
  billListScrollArea.style.touchAction = 'pan-y';

  // Create a variable to store the filtered bills
  let filteredBills = stored_bill;

  // Search + Date filter combined
  const performSearch = (searchTerm) => {
   let results = stored_bill;

   // Text filter
   if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    results = results.filter(bill => {
     return (
      (bill.g && bill.g.toString().toLowerCase().includes(term)) ||
      (bill.ee && bill.ee.toString().toLowerCase().includes(term)) ||
      (bill.eh && bill.eh.toLowerCase().includes(term)) ||
      (bill.ei && bill.ei.toLowerCase().includes(term)) ||
      (bill.em && bill.em.toString().toLowerCase().includes(term))
     );
    });
   }

   // Date filter
   const fromDate = document.getElementById('billFilterFromDate')?.value;
   const toDate = document.getElementById('billFilterToDate')?.value;
   if (fromDate || toDate) {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate + 'T23:59:59') : null;
    results = results.filter(bill => {
     if (!bill.b) return false;
     const billDate = new Date(bill.b);
     if (from && billDate < from) return false;
     if (to && billDate > to) return false;
     return true;
    });
   }

   filteredBills = results;
   renderBillCards(filteredBills);
  };

  // Add search event listener
  document.getElementById('bill_op_search').addEventListener('input', function (e) {
   performSearch(e.target.value);
  });

  // Date toggle button
  const dateToggleBtn = document.getElementById('billDateToggleBtn');
  const dateFilterSection = document.getElementById('billDateFilterSection');
  dateToggleBtn.addEventListener('click', function () {
   const isHidden = dateFilterSection.style.display === 'none';
   dateFilterSection.style.display = isHidden ? '' : 'none';
   const icon = this.querySelector('i');
   if (isHidden) {
    icon.classList.remove('fa-angle-right');
    icon.classList.add('fa-angle-down');
   } else {
    icon.classList.remove('fa-angle-down');
    icon.classList.add('fa-angle-right');
    // Clear dates when hiding
    document.getElementById('billFilterFromDate').value = '';
    document.getElementById('billFilterToDate').value = '';
    performSearch(document.getElementById('bill_op_search').value);
   }
  });

  // Date filter inputs
  const fromDateEl = document.getElementById('billFilterFromDate');
  const toDateEl = document.getElementById('billFilterToDate');
  const billDateError = document.getElementById('billDateError');
  const validateDates = () => {
   fromDateEl.classList.remove('border-danger');
   toDateEl.classList.remove('border-danger');
   const isInvalid = fromDateEl.value && toDateEl.value && new Date(fromDateEl.value) > new Date(toDateEl.value);
   fromDateEl.classList.toggle('border-danger', isInvalid);
   toDateEl.classList.toggle('border-danger', isInvalid);
   billDateError.classList.toggle('d-none', !isInvalid);
  };
  fromDateEl.addEventListener('input', function () {
   validateDates();
   performSearch(document.getElementById('bill_op_search').value);
  });
  toDateEl.addEventListener('input', function () {
   validateDates();
   performSearch(document.getElementById('bill_op_search').value);
  });

  // Make sure we have client data
  if (!clientReferrerArray || clientReferrerArray.length === 0) {
   try {
    clientReferrerArray = await dbDexieManager.getAllRecords(dbnm, "c") || [];
   } catch (error) {
    console.error("Error loading client data:", error);
    showToast("Error loading client data");
    b_ill_cards_container.innerHTML = "<p class='text-danger'>Error loading client data</p>";
    modal_bill_cards.style.display = "block";
    return;
   }
  }

  stored_bill.sort((a, b) => {
   const dateA = new Date(a.b);
   const dateB = new Date(b.b);
   return dateB - dateA;
  });

  // Create a map for faster client lookup
  const clientMap = new Map();
  clientReferrerArray.forEach(client => {
   clientMap.set(client.a, client);
  });

  // Join client data to bills
  stored_bill.forEach(bill => {
   const client = clientMap.get(bill.e) || {};

   // Add client fields to bill object
   bill.ee = client.e; // phone
   bill.ef = client.f; // ?
   bill.eh = client.h; // first name
   bill.ei = client.i; // last name
   bill.el = client.l; // ?
   bill.em = client.m; // ?
  });

  // Function to render bill cards
  function renderBillCards(billsToRender) {
   const container = document.getElementById('billCardsContainer');
   container.innerHTML = '';

   if (billsToRender.length === 0) {
    container.innerHTML = "<p class='text-muted text-center py-4'>No bills match your search</p>";
    return;
   }

   billsToRender.forEach(bill => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 border border-dark rounded-2";

    const card = document.createElement("div");
    card.className = "card bill-card h-100";
    card.dataset.billId = bill.a;

    // Format bill date and time
    const billDate = bill.b ? new Date(bill.b) : null;
    const formattedDateTime = billDate ?
     `${billDate.toLocaleDateString()} ${billDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` :
     'No date';

    // Format client name and mobile
    const clientName = `${bill.eh || ''} ${bill.ei || ''}`.trim() || '';
    const clientMobile = bill.ee || 'No phone';

    // Count items for this bill
    const billItemCount = stored_bill_items.filter(item => item.e == bill.a).length;

    // Card header with dropdown
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header d-flex justify-content-between align-items-center";
    cardHeader.innerHTML = `
    <div>
    <span class="fw-bold me-3">${bill.g}<span class="bg-secondary text-white rounded-2 ps-2 pe-2 ms-2">${billItemCount}</span></span>
    <small class="text-muted">${formattedDateTime}</small>
    </div>
    <div class="dropdown">
    <button class="btn btn-sm btn-outline-secondary dropdown-toggle text-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    <i class="bi bi-gear"></i>
    </button>
    <ul class="dropdown-menu border border-dark">
    <li><button class="dropdown-item text-success" style="border-bottom:2px solid #0d6dfd8e;" data-action="rcpt"><i class="bi bi-cash-coin"></i> Amount Received</button></li>
    <li><button class="dropdown-item" style="border-bottom:2px solid #0d6dfd8e;" data-action="view"><i class="bi bi-eye"></i> View Details</button></li>
    <li><button class="dropdown-item" style="border-bottom:2px solid #0d6dfd8e;" data-action="print"><i class="bi bi-printer"></i> Print Bill</button></li>
    <li><hr class="dropdown-divider"></li>
    <li><button class="dropdown-item text-danger" data-action="del"><i class="bi bi-trash"></i> Delete Bill</button></li>
    </ul>
    </div>
    `;

    // Card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerHTML = `
    <div class="mb-2">
    <div class="d-flex align-items-center">
    <h6 class="card-title mb-1">
    ${clientName}
    <small class="ms-2">
        <a href="tel:${clientMobile}" class="text-decoration-none text-muted">
            <i class="fa-solid fa-phone"></i> ${clientMobile}
        </a>
    </small>
    </h6>
    </div>
    </div>
    `;

    // Add click event to card body for temporary alert
    cardBody.addEventListener("click", function (e) {
     // Don't trigger if clicking on dropdown or buttons
     if (!e.target.closest('.dropdown') && !e.target.closest('button')) {
      temporaryAlertFunction(bill.a);
     }
    });

    // Add event listeners to dropdown actions
    const dropdownButtons = cardHeader.querySelectorAll('.dropdown-item');
    dropdownButtons.forEach(button => {
     button.addEventListener("click", function (e) {
      e.stopPropagation();
      const action = this.dataset.action;
      handleBillAction(m_odalInstance, action, bill.a);
     });
    });

    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
   });
  }

  // Initial render
  renderBillCards(filteredBills);
  m_odalInstance.show();
 }
 window.showBillCards = showBillCards;

 async function handleBillAction(m_odalInstance, action, b346illID) {
  billTableRowId = b346illID;
  switch (action) {
   case 'rcpt':
    let s594CurrItems = stored_bill_items.filter(item => item.e == b346illID);
    let c594ashInfo = stored_bill_cash_info.filter(cash => cash.tb == 7 && cash.td == b346illID);
    showAlreadyReceivedAmts(b346illID, s594CurrItems, c594ashInfo);
    break;
   case 'view':
    // Find the selected bill
    let sCurrBill = stored_bill.find(bill => bill.a == b346illID);

    if (!sCurrBill) {
     showToast('Bill not found');
     return;
    }

    // Set global bill ID
    billTableRowId = b346illID;
    billSelectedToUpdate = sCurrBill;

    // Find related items
    let sCurrItems = stored_bill_items.filter(item => item.e == b346illID);

    // Find cash info
    let sCurrCashInfo = stored_bill_cash_info.filter(cash =>
     cash.tb == 7 && cash.td == b346illID
    );

    // Set global variables
    globalBill = sCurrBill;
    globalItems = sCurrItems;
    globalCashInfo = sCurrCashInfo;

    if (typeof billingRequisit_be === 'function' && shoEyeMsrmntTbl) {
     if (typeof setEyeMeasurement === 'function') {
      let sCurrEyeMsrmnt = stored_eye_msrmnt.find(eye => eye.ea == b346illID) || {};
      setEyeMeasurement(sCurrEyeMsrmnt);
      if (typeof lockAllEyeInputs === 'function') lockAllEyeInputs();
     } else {
      window.showelsemodal("setEyeMeasurement function not found; contact admin;");
     }
    }
    // Load the bill data into the form
    loadBillIntoForm(sCurrBill, sCurrItems, sCurrCashInfo);

    if (m_odalInstance)
     m_odalInstance.hide();

    break;
   case 'del':
    const billData = stored_bill.find((c) => c.a == b346illID);
    if (billData && billData.a > 0) {
     if (confirm(`Are you sure you want to delete this bill & it's data?`)) {
      if (confirm(`this cannot be undone?`)) {
       payload0.fn = 9;
       payload0.vw = 1;
       payload0.b = billData;
       var tTxt = postCall_Json("https://my1.in/2/1.php", payload0, 0, false);
       var response = JSON.parse(tTxt);
       if (response && response.su == 1) {
        await delBillByID(billTableRowId);
       } else {
        window.showelsemodal(response.ms);
       }
      }
     }
    } else {
     window.showelsemodal("bill not found");
    }
    break;
   case 'print':
    playSound('https://bigsoundbank.com/UPLOAD/mp3/1417.mp3');
    sho_bl_modal(billTableRowId);
    break;
  }
 }
 async function sho_bl_modal(billTableRowId) {
  // Play print sound
  playSound('https://bigsoundbank.com/UPLOAD/mp3/1417.mp3');

  await loadExe2Fn(22, [billTableRowId], []);
 }
 function showAlreadyReceivedAmts(b346illID, s594CurrItems, c594ashInfo) {
  const modal = create_modal_dynamically('received_amount_modal');
  const modalContent = modal.contentElement;
  const modalInstance = modal.modalInstance;

  //content not scrolling got resolved after adding below;
  modal.modalElement.querySelector('.modal-dialog').classList.add('modal-lg');
  const modalBody = modalContent.querySelector('.modal-body');
  if (!modalBody) {
   modalContent.style.maxHeight = '85vh';
   modalContent.style.overflowY = 'auto';
  }

  // Calculate bill total from items
  const billTotal = s594CurrItems.reduce((sum, item) => sum + parseFloat(item.g || 0), 0);

  // Find the bill to get discount information
  const currentBill = stored_bill.find(bill => bill.a == b346illID);
  const discountAmount = parseFloat(currentBill?.k || 0);

  // Calculate final amount after discount
  const finalAmount = billTotal - discountAmount;

  // Calculate totals from existing payments
  const totalReceived = c594ashInfo.reduce((sum, payment) => sum + parseFloat(payment.j || 0), 0);
  const balance = finalAmount - totalReceived;

  // Store bill total and discount info globally for this modal
  window.modalBillTotal = billTotal;
  window.modalFinalAmount = finalAmount;
  window.modalDiscountAmount = discountAmount;
  window.modalExistingPaymentsTotal = totalReceived;

  // Set modal title and content
  modalContent.innerHTML = `
<div class="modal-header">
<h5 class="modal-title">Add Received Amount - Bill ${b346illID}</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body" style="background-color: #d4c7ec;">
<!-- Bill Summary Section -->
<div class="card mb-3">
<div class="card-header bg-light">
<h6 class="mb-0">Bill Summary</h6>
</div>
<div class="card-body">
<div class="row text-center">
<div class="col-4">
<small class="text-muted">Items Total</small>
<div class="fw-bold">₹${billTotal.toFixed(2)}</div>
</div>
<div class="col-4">
<small class="text-muted">Discount</small>
<div class="fw-bold text-danger">-₹${discountAmount.toFixed(2)}</div>
</div>
<div class="col-4">
<small class="text-muted">Final Amount</small>
<div class="fw-bold text-primary">₹${finalAmount.toFixed(2)}</div>
</div>
</div>
</div>
</div>

<!-- Add Received Amount Card -->
<div class="card mb-3" id="addReceivedAmountCard">
<div class="card-header bg-light">
<h6 class="mb-0">Add New Payment</h6>
</div>
<div class="card-body">
<div class="row align-items-end g-2">
<!-- Date & Time - col-4 -->
<div class="col-4">
<label class="form-label small text-muted mb-1">Date</label>
<div class="position-relative">
<input type="text" class="form-control form-control-sm" id="receivedDateTimeModal" placeholder="Select Date & Time" style="border:1px solid #212529;color:transparent;caret-color:transparent;">
<span id="receivedDateTimeModal_disp" style="position:absolute;inset:0;display:flex;align-items:center;padding:0 .75rem;pointer-events:none;color:#212529;font-size:.875rem;"></span>
</div>
</div>

<!-- Amount - col-4 -->
<div class="col-4">
<label class="form-label small text-muted mb-1">Rcvd Amt.</label>
<input type="text" class="form-control form-control-sm" placeholder="Amount" id="receivedAmountModal" inputmode="decimal" autocomplete="off" oninput="window.allowFloat(this,2)" style="border:1px solid #212529;">
</div>

<!-- Payment Type - col-2 -->
<div class="col-2">
<label class="form-label small text-muted mb-1">Type</label>
<div class="d-inline-block position-relative" style="height:31px;">
<button class="btn btn-primary btn-sm" id="paymentTypeBtnModal" type="button" tabindex="-1" style="pointer-events:none;">
<i class="fas fa-credit-card"></i>
</button>
<select id="paymentTypeModal" onchange="this.blur();updatePaymentTypeIcon('paymentTypeModal','paymentTypeBtnModal')" style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:3;border:1px solid #212529;">
<option value="0">Select</option>
<option value="1">Cash</option>
<option value="2">Cheque</option>
<option value="3">Card</option>
<option value="4">UPI</option>
<option value="5">Bank Transfer</option>
</select>
</div>
</div>

<!-- Add Button - col-2 -->
<div class="col-2">
<button class="btn btn-primary btn-sm" onclick="addTempReceivedAmount(${b346illID})">
<i class="fas fa-plus"></i>
</button>
</div>
</div>
</div>
</div>

<!-- Temporary payments container (hidden) -->
<div id="tempPaymentsContainer" style="display: none;"></div>

<!-- Grand Total Summary -->
<div class="row mt-4">
<div class="col-12">
<div class="card border-success">
<div class="card-body bg-light">
<div class="row text-center">
<div class="col-4">
<h6>Final Amount</h6>
<h4 class="text-primary">₹<span id="modalGrandBillTotal">${finalAmount.toFixed(2)}</span></h4>
</div>
<div class="col-4">
<h6>Rcvd</h6>
<h4 class="text-success">₹<span id="modalGrandTotalReceived">${totalReceived.toFixed(2)}</span></h4>
</div>
<div class="col-4">
<h6>Bal</h6>
<h4 class="text-danger">₹<span id="modalGrandBalance">${balance.toFixed(2)}</span></h4>
</div>
</div>
</div>
</div>
</div>
</div>

<!-- Existing Received Amounts -->
<div id="addedReceivedAmountsContainerModal">
<h6>Existing Payments</h6>
${renderExistingPayments(c594ashInfo)}
</div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
<button type="button" class="btn btn-success" onclick="submitAllPayments(${b346illID})">Submit new Payments</button>
</div>
`;

  // Also update the updateModalTotals function to use final amount
  window.updateModalTotals = function () {
   // Get existing payments total and final amount from stored values
   const existingPaymentsTotal = window.modalExistingPaymentsTotal || 0;
   const tempPaymentsTotal = window.tempReceivedAmounts.reduce((sum, payment) => sum + payment.amount, 0);
   const totalReceived = existingPaymentsTotal + tempPaymentsTotal;
   const finalAmount = window.modalFinalAmount || 0;
   const balance = finalAmount - totalReceived;

   document.getElementById('modalGrandTotalReceived').textContent = totalReceived.toFixed(2);
   document.getElementById('modalGrandBalance').textContent = balance.toFixed(2);

   // Update balance color based on amount
   const balanceElement = document.getElementById('modalGrandBalance');
   if (balance === 0) {
    balanceElement.className = 'text-success';
   } else if (balance > 0) {
    balanceElement.className = 'text-warning';
   } else {
    balanceElement.className = 'text-danger';
   }
  };

  initializeModalDatePicker();

  // Store temporary payments array for this modal
  window.tempReceivedAmounts = [];
  modalInstance.show();
 }
 async function submitAllPayments(billId) {
  if (window.tempReceivedAmounts.length === 0) {
   showToast('No new payments to submit');
   return;
  }
  if (window.tempReceivedAmounts.length > 1) {
   window.showelsemodal('only 1 amount entry allowed at a time;');
   return;
  }

  try {
   // Find the bill data
   const billData = stored_bill.find((c) => c.a == billId);
   if (!billData) {
    window.showelsemodal("Bill not found, refresh all data");
    return false;
   }

   // Show confirmation with all payment details
   let paymentDetails = window.tempReceivedAmounts.map(payment => {
    return `₹${payment.amount} (${getPaymentTypeText(payment.paymentType)}) on ${formatDateTime(payment.dateTime)}`;
   }).join('\n');

   if (!(await showConfirmModal(`Submit the following payments for bill ${billId}:\n\n${paymentDetails}`))) {
    return;
   }

   // Prepare payload for each payment
   payload0.vw = 1;
   payload0.fn = 23; // Use the same function number as your existing code

   // Process all payments
   for (const payment of window.tempReceivedAmounts) {
    let paymentPayload = {
     h: billData.e, // Client ID from bill
     i: payment.paymentType, // Payment type (1=Cash, 2=Cheque, etc.)
     j: payment.amount.toString(), // Amount received
     k: payment.dateTime.split(' ')[0], // Date only (YYYY-MM-DD format)
     td: billData.a, // Bill ID
     n: payment.constraintCounter || 0
    };

    payload0.r = paymentPayload;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, getMaxDateTables());

    // Make the API call for each payment
    const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 2, 1);

    if (response.su !== 1) {
     window.showelsemodal(`Failed to save payment: ${extractMessages(response)}`);
     return;
    } else {
     handl_op_rspons(response, 0);
     showToast('All payments submitted successfully!');
     setTimeout(() => {
      window.tempReceivedAmounts = [];
     }, 1000);
    }
   }
   stored_bill_cash_info = await dbDexieManager.getAllRecords(dbnm, "r") || [];

   const modal = bootstrap.Modal.getInstance(document.getElementById('received_amount_modal'));
   if (modal) {
    modal.hide();
   }

  } catch (error) {
   console.error('Error submitting payments:', error);
   showToast('Error submitting payments: ' + error.message);
  }
 }
 async function addTempReceivedAmount(billId) {
  const dateTime = document.getElementById('receivedDateTimeModal').value;
  const amount = parseFloat(document.getElementById('receivedAmountModal').value) || 0;
  const paymentType = document.getElementById('paymentTypeModal').value;

  // Validation
  if (!dateTime) {
   showToast('Please select date and time');
   return;
  }

  if (amount <= 0) {
   showToast('Please enter a valid amount');
   return;
  }

  // Extract date part
  const paymentDate = dateTime.split(' ')[0];

  // Get client ID from bill data
  const currentBill = stored_bill.find(bill => bill.a == billId);
  if (!currentBill) {
   showToast('Bill not found');
   return;
  }

  const clientId = currentBill.e;
  const paymentTypeInt = parseInt(paymentType) || 0;

  // Collect all matching payments - ONLY for same date
  const matchingPayments = [];

  // Check in temporary payments - ONLY same date
  window.tempReceivedAmounts.forEach(payment => {
   const existingDate = payment.dateTime.split(' ')[0];
   const existingAmount = parseFloat(payment.amount) || 0;

   if (payment.clientId === clientId &&
    Math.abs(existingAmount - amount) < 0.001 &&
    existingDate === paymentDate && // Same date
    payment.paymentType === paymentType) {
    matchingPayments.push({
     constraintCounter: payment.constraintCounter || 0,
     date: existingDate,
     source: 'temp'
    });
   }
  });

  // Check in stored payments for this client - ONLY same date
  stored_bill_cash_info.forEach(payment => {
   const existingDate = payment.k || '';
   const existingAmount = parseFloat(payment.j) || 0;
   const existingPaymentType = payment.i || '0';

   if (payment.f === 0 &&
    payment.h === clientId &&
    Math.abs(existingAmount - amount) < 0.001 &&
    existingDate === paymentDate && // Same date
    parseInt(existingPaymentType) === paymentTypeInt) {
    matchingPayments.push({
     constraintCounter: payment.n || 0,
     date: existingDate,
     source: 'stored'
    });
   }
  });

  // Calculate constraint counter
  let constraintCounter = 0; // Default to 1 for first payment on this date

  if (matchingPayments.length > 0) {
   // Find the highest constraint counter for this date
   const constraintCounters = matchingPayments.map(p => p.constraintCounter || 0);
   const maxCounter = Math.max(...constraintCounters);

   // Ask user for confirmation
   let message = `Same amount (₹${amount.toFixed(2)}) on same date (${paymentDate}) already exists.\n\n`;

   if (matchingPayments.length === 1) {
    message += `Current constraint counter: ${maxCounter}\n\n`;
   } else {
    message += `Current constraint counters: 0 to ${maxCounter}\n\n`;
   }

   const nextCounter = maxCounter + 1;
   message += `Do you want to add another payment with constraint counter ${nextCounter}?`;

   const userResponse = await showConfirmModal(message);

   if (!userResponse) {
    return;
   }

   constraintCounter = nextCounter;
  } else {
   constraintCounter = 0;
  }

  // Add to temporary array with constraint counter
  const tempPayment = {
   id: Date.now(),
   dateTime: dateTime,
   amount: amount,
   paymentType: paymentType,
   constraintCounter: constraintCounter || 0,
   clientId: clientId,
   timestamp: new Date().toISOString()
  };

  window.tempReceivedAmounts.push(tempPayment);
  renumberConstraintCounters(window.tempReceivedAmounts || []);

  // Update UI to show temporary payments
  updateTempPaymentsUI();

  // Clear the form
  document.getElementById('receivedAmountModal').value = '';
  document.getElementById('paymentTypeModal').value = '0';
  updatePaymentTypeIcon('paymentTypeModal', 'paymentTypeBtnModal');

  // Update the totals in the modal
  updateModalTotals();

  // Show success message with constraint counter info
  if (constraintCounter > 0) {
   showToast(`Payment added to temporary list with constraint counter: ${constraintCounter}. Click "Submit All Payments" to save.`);
  } else {
   showToast('Payment added to temporary list. Click "Submit All Payments" to save.');
  }
 }
 function updateModalTotals() {
  // Get existing payments total and bill total from stored values
  const existingPaymentsTotal = window.modalExistingPaymentsTotal || 0;
  const tempPaymentsTotal = window.tempReceivedAmounts.reduce((sum, payment) => sum + payment.amount, 0);
  const totalReceived = existingPaymentsTotal + tempPaymentsTotal;
  const billTotal = window.modalBillTotal || 0;
  const balance = billTotal - totalReceived;

  document.getElementById('modalGrandTotalReceived').textContent = totalReceived.toFixed(2);
  document.getElementById('modalGrandBalance').textContent = balance.toFixed(2);

  // Update balance color based on amount
  const balanceElement = document.getElementById('modalGrandBalance');
  if (balance === 0) {
   balanceElement.className = 'text-success';
  } else if (balance > 0) {
   balanceElement.className = 'text-warning';
  } else {
   balanceElement.className = 'text-danger';
  }
 }
 function updateTempPaymentsUI() {
  const container = document.getElementById('tempPaymentsContainer');

  if (window.tempReceivedAmounts.length === 0) {
   container.style.display = 'none';
   return;
  }

  container.style.display = 'block';
  container.innerHTML = '<h6 class="mt-4">New Payments to be Added</h6>';

  window.tempReceivedAmounts.forEach((payment, index) => {
   const paymentTypeIcon = getPaymentTypeIcon(payment.paymentType);
   const formattedDate = formatDateTime(payment.dateTime);

   // Show constraint counter if it exists and is greater than 0
   const constraintCounterBadge = payment.constraintCounter > 0 ?
    `<span class="badge bg-${getConstraintCounterColor(payment.constraintCounter)} ms-1" title="Constraint counter: ${payment.constraintCounter}">${payment.constraintCounter}</span>` : '';

   const paymentHTML = `
<div class="card mb-2 received-amount-card" style="border-left: 4px solid #ffc107 !important;">
<div class="card-body py-2">
<div class="row align-items-center">
<div class="col-4">
<small class="text-muted"><i class="far fa-calendar me-1"></i>${formattedDate}</small>
</div>
<div class="col-6">
<strong>${paymentTypeIcon} ₹${payment.amount.toFixed(2)}${constraintCounterBadge}</strong>
</div>
<div class="col-2 text-end">
<button class="btn btn-outline-danger btn-sm" onclick="removeTempPayment(${payment.id})">
<i class="fas fa-times"></i>
</button>
</div>
</div>
</div>
</div>
`;

   container.insertAdjacentHTML('beforeend', paymentHTML);
  });
 }
 function removeTempPayment(paymentId) {
  window.tempReceivedAmounts = window.tempReceivedAmounts.filter(payment => payment.id !== paymentId);
  renumberConstraintCounters(window.tempReceivedAmounts || []);
  updateTempPaymentsUI();
  updateModalTotals();
  showToast('Payment removed from temporary list');
 }
 function addAmountToBill(billId) {
  const dateTime = document.getElementById('receivedDateTimeModal').value;
  const amount = parseFloat(document.getElementById('receivedAmountModal').value) || 0;
  const paymentType = document.getElementById('paymentTypeModal').value;

  // Validation
  if (!dateTime) {
   showToast('Please select date and time');
   return;
  }

  if (amount <= 0) {
   showToast('Please enter a valid amount');
   return;
  }

  if (paymentType === '0') {
   showToast('Please select payment type');
   return;
  }

  // Show alert as requested
  window.showsuccessmodal(`Adding amount to bill ${billId}\nAmount: ₹${amount}\nPayment Type: ${getPaymentTypeText(paymentType)}\nDate: ${dateTime}`);

  // Here you would typically make an API call to save the payment
  // For now, just show success message
  showToast(`₹${amount} added to bill ${billId}`);

  // Clear the form
  document.getElementById('receivedAmountModal').value = '';
  document.getElementById('paymentTypeModal').value = '0';
  updatePaymentTypeIcon('paymentTypeModal', 'paymentTypeBtnModal');

  // Note: In a real implementation, you would:
  // 1. Make API call to save the payment
  // 2. Update the UI with the new payment
  // 3. Possibly refresh the payments list
 }
 async function initializeModalDatePicker() {
  try {
   await window.initDateTimePicker('receivedDateTimeModal', { displayFormatter: window.formatLongDisplay });
  } catch (error) {
   console.error('Failed to initialize modal date picker:', error);
   // Fallback: set current datetime manually
   document.getElementById('receivedDateTimeModal').value = formatForPicker(new Date());
  }
 }
 function renderExistingPayments(payments) {
  if (!payments || payments.length === 0) {
   return `
<div class="text-center text-muted py-3">
<i class="fas fa-receipt fa-2x mb-2"></i>
<p>No payments recorded yet</p>
</div>
`;
  }

  let html = '';
  payments.forEach(payment => {
   const paymentTypeIcon = getPaymentTypeIcon(payment.i);
   const paymentTypeText = getPaymentTypeText(payment.i);
   const formattedDate = payment.k ? formatDateTime(payment.k) : 'No date';

   // Show constraint counter (n field) if it exists and is greater than 0
   const constraintCounterBadge = payment.n > 0 ?
    `<span class="badge bg-${getConstraintCounterColor(payment.n)} ms-1" title="Constraint counter for same amount on same date"> ${payment.n}</span>` : '';

   html += `
<div class="card mb-2 received-amount-card">
<div class="card-body py-2">
<div class="row align-items-center">
<div class="col-6">
<small class="text-muted"><i class="far fa-calendar me-1"></i>${formattedDate}</small>
</div>
<div class="col-4">
<strong>${paymentTypeIcon} ₹${parseFloat(payment.j || 0).toFixed(2)}${constraintCounterBadge}</strong>
<br>
<small class="text-muted">${paymentTypeText}</small>
</div>
<div class="col-2 text-end">
<small class="text-muted">${payment.a}</small>
</div>
</div>
</div>
</div>
`;
  });

  return html;
 }
 function loadBillIntoForm(bill, billItems, cashInfo) {
  try {
   window.billSaved = false;
   const addBtn = document.getElementById('addReceivedAmountBtn');
   if (addBtn) {
    addBtn.disabled = false;
    addBtn.classList.remove('btn-secondary');
    addBtn.classList.add('btn-primary');
   }
   // Populate basic bill information
   document.getElementById('invoiceNumber').value = bill.g || '';
   const receiptDateValue = normalizeFullDateTime(bill.f || '');
   if (receiptDatePicker) receiptDatePicker.setCommitted(receiptDateValue);
   document.getElementById('receiptDate').value = receiptDateValue;
   document.getElementById('billNotes').value = bill.i || '';
   document.getElementById('discountAmount').value = bill.k || 0;
   const discountAmount = parseFloat(bill.k) || 0;
   if (discountAmount > 0) {
    setTimeout(() => {
     calculateDiscountFromAmount();
    }, 100);
   }


   // Set delivery date from bill.i.dldt if available, leave empty if optional
   let deliveryValue = (bill.i && bill.i.dldt) ? normalizeFullDateTime(bill.i.dldt) : '';
   if (deliveryDatePicker) deliveryDatePicker.setCommitted(deliveryValue);
   document.getElementById('deliveryDate').value = deliveryValue;

   // Set client information
   if (bill.e) {
    document.getElementById('clientId').value = bill.e;
    // Fetch and display client name
    loadClientName(bill.e);
   }

   // Clear existing items
   document.getElementById('addedItemsContainer').innerHTML = '';

   // Add bill items to the form
   billItems.forEach(item => {
    addBillItemToForm(item);
   });

   updateBillSectionsVisibility();
   // Clear and populate received amounts
   receivedAmounts = [];
   if (cashInfo && cashInfo.length > 0) {
    cashInfo.forEach(payment => {
     receivedAmounts.push({
      id: payment.a,
      clientId: bill.e,
      dateTime: payment.k || new Date().toISOString().split('T')[0] + ' 00:00',
      amount: parseFloat(payment.j) || 0,
      paymentType: payment.i || '0',
      constraintCounter: payment.n || 0,
      timestamp: payment.b || new Date().toISOString()
     });
    });
   }
   updateNewPaymentsUI();

   // Update bill summary
   updateBillSummary();
   updateGrandTotalsForUpdate();

   // Enable update and print buttons
   enableUpdateButton();
   enablePrintButton();
   disableSaveBtn();

   // Scroll to top of form
   window.scrollTo({ top: 0, behavior: 'smooth' });

   showToast('Bill loaded successfully');

  } catch (error) {
   console.error('Error loading bill into form:', error);
   showToast('Error loading bill data');
  }
 }

 function addBillItemToForm(item) {
  // This function adds an item directly to the added items container
  // without going through the form entry process

  const addedItemsContainer = document.getElementById('addedItemsContainer');
  const uniqueItemId = Date.now();
  updateBillSectionsVisibility();

  // Find item details from items array
  const itemDetails = items.find(i => i.a == item.f) || {};
  const savedRate = (parseFloat(item.g) || 0) / (parseFloat(item.h) || 1);
  const rateToShow = savedRate > 0 ? savedRate : (parseFloat(itemDetails.k || 0) || 0);

  const itemHTML = `
<div class="card mb-3 added-item-card" id="invoiceItem-${uniqueItemId}" data-item-id="${item.f}" data-item-rate="${rateToShow}">
<div class="card-body">
<div class="row">
<!-- Left side - Image -->
<div class="col-3">
<div class="text-center">
${`<img src="${getGoogleDriveImageUrl(itemDetails.gu) || 'https://cdn-icons-png.freepik.com/512/13543/13543330.png'}" class="added-item-image" alt="Item Image" 
onerror="this.src='https://cdn-icons-png.freepik.com/512/13543/13543330.png'">`}
</div>
</div>

<!-- Right side - Details -->
<div class="col-9">
<!-- Row 1 - Item Name -->
<div class="row mb-2 g-0">
<div class="col-10">
<strong>${itemDetails.gn || 'Unknown Item'}</strong>
</div>
<div class="col-2 d-flex align-items-center justify-content-end">
<button class="btn btn-outline-danger btn-sm" onclick="removeItemFromInvoice(${uniqueItemId})">
<i class="fas fa-trash"></i>
</button>
</div>
</div>

<!-- Row 2 - Quantity, Rate, Price -->
<div class="row mb-2 g-0">
<div class="col-4">
<strong>Qty:</strong> 
<input type="number" 
class="form-control form-control-sm d-inline-block w-auto" 
value="${item.h || '1'}" 
min="1" 
step="1"
style="width: 70px; display: inline-block;"
onchange="updateItemQuantity(${uniqueItemId}, parseFloat(this.value))"
onblur="updateItemQuantity(${uniqueItemId}, parseFloat(this.value))">
</div>
<div class="col-4">
<strong>Rate:</strong> 
<input type="number" 
class="form-control form-control-sm d-inline-block w-auto" 
 value="${rateToShow.toFixed(2)}" 
 min="0" 
 step="0.01"
 style="width: 80px; display: inline-block;"
 onchange="updateItemRate(${uniqueItemId}, this.value)"
 onblur="updateItemRate(${uniqueItemId}, this.value)">
</div>
<div class="col-4">
<strong>Price:</strong> ₹<span id="itemPrice-${uniqueItemId}">${parseFloat(item.g || 0).toFixed(2)}</span>
</div>
</div>

<!-- Row 3 - Description -->
<div class="row g-0">
<div class="col-12">
<small class="text-muted">${item.i || ''}</small>
</div>
</div>
</div>
</div>
</div>
</div>
`;

  addedItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
 }

 async function loadClientName(clientId) {
  try {
   // Try to find client in existing array first
   let client = clientReferrerArray.find(c => c.a == clientId);

   // If not found, try to fetch from database
   if (!client && clientReferrerArray.length === 0) {
    clientReferrerArray = await dbDexieManager.getAllRecords(dbnm, "c") || [];
    client = clientReferrerArray.find(c => c.a == clientId);
   }

   if (client) {
    const clientName = `${client.i || ''} ${client.h || ''}`.trim();
    const clientMobile = client.e || '';
    document.getElementById('c_dtls_lient').value = clientName || clientMobile || 'Unknown Client';
   } else {
    document.getElementById('c_dtls_lient').value = 'Client ID: ' + clientId;
   }
  } catch (error) {
   console.error('Error loading client name:', error);
   document.getElementById('c_dtls_lient').value = 'Client ID: ' + clientId;
  }
 }

 async function delBillByID(b426illID) {
  try {
   let t1999mp = await dbDexieManager.deleteRecords(dbnm, 'b', b426illID);
   let itemsToDelete = (await dbDexieManager.getAllRecords(dbnm, 'i')).filter(o => o.e === b426illID);
   for (let o of itemsToDelete) {
    await dbDexieManager.deleteRecords(dbnm, 'i', o.a);
   }
   let t2001mp = await dbDexieManager.deleteRecords(dbnm, 'be', { ea: b426illID }, ['ea']);
   let cashInfoToDelete = (await dbDexieManager.getAllRecords(dbnm, 'r')).filter(o => o.tb === 7 && o.td === b426illID);
   for (let o of cashInfoToDelete) {
    await dbDexieManager.deleteRecords(dbnm, 'r', o.a);
   }
   await setMaxBillNo();
  } catch (error) {
   window.showelsemodal("Initialization error - please refresh");
  }
 }

 // Ensure a date string has a full "YYYY-MM-DD HH:mm" format (append time if missing)
 function normalizeFullDateTime(val) {
  if (!val) return '';
  return val.includes(' ') && val.split(' ')[1].length === 5 ? val : val + ' 00:00';
 }

 // Initialize pickers for all datetime fields
 async function initializeDatePickers() {
  try {
   receiptDatePicker = await window.initDateTimePicker('receiptDate');
   deliveryDatePicker = await window.initDateTimePicker('deliveryDate');
   receivedDateTimePicker = await window.initDateTimePicker('receivedDateTime', { scrollable: true });

  } catch (error) {
   console.error('Failed to initialize date pickers:', error);
   showToast('Date picker initialization failed - using basic input');
   // Fallback: set current datetime manually
   initializeBasicDates();
  }
 }

 // Fallback function if the picker library fails to load
 function initializeBasicDates() {
  const nowStr = formatForPicker(new Date());
  document.getElementById('receiptDate').value = nowStr;
  document.getElementById('deliveryDate').value = nowStr;
  document.getElementById('receivedDateTime').value = nowStr;
 }

 // Validation function that scrolls to invalid field
 function validateAndScrollToField(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (field) {
   // Scroll to the field
   const fieldRect = field.getBoundingClientRect();
   const scrollTopPosition = window.pageYOffset + fieldRect.top - 100;
   window.scrollTo({ top: scrollTopPosition, behavior: 'smooth' });

   // Focus on the field
   field.focus();

   // Highlight the field with red border
   field.style.borderColor = '#dc3545';
   field.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';

   // Remove highlight after 3 seconds
   setTimeout(() => {
    field.style.borderColor = '';
    field.style.boxShadow = '';
   }, 3000);
  }

  if (message) {
   showToast(message);
  }

  return false;
 }

 function handleUploadedFile(fileUrl, fileName, fileType, fileId) {
  console.log('File uploaded:', fileName, fileUrl);
  // Update your form fields or UI here
  document.getElementById('itemDescription').value = fileUrl;
 }
 async function temporary() {
  await loadExe2Fn(20, ['fileUploadTesting', 'loader', null, '*', 'handleUploadedFile'], [1]);
 }
 function enableSaveBtn() {
  const updateBtn = document.getElementById('saveBtn');
  updateBtn.disabled = false;
  updateBtn.classList.remove('btn-secondary');
  updateBtn.classList.add('btn-success');
 }

 function disableSaveBtn() {
  const updateBtn = document.getElementById('saveBtn');
  updateBtn.disabled = true;
  updateBtn.classList.remove('btn-success');
  updateBtn.classList.add('btn-secondary');
 }
 function enableUpdateButton() {
  const updateBtn = document.getElementById('updateBtn');
  updateBtn.disabled = false;
  updateBtn.classList.remove('btn-secondary');
  updateBtn.classList.add('btn-warning');
 }

 function disableUpdateButton() {
  const updateBtn = document.getElementById('updateBtn');
  updateBtn.disabled = true;
  updateBtn.classList.remove('btn-warning');
  updateBtn.classList.add('btn-secondary');
 }

 function enablePrintButton() {
  const printBtn = document.getElementById('printBtn');
  printBtn.disabled = false;
  printBtn.classList.remove('btn-secondary');
  printBtn.classList.add('btn-info');
 }

 function disablePrintButton() {
  const printBtn = document.getElementById('printBtn');
  printBtn.disabled = true;
  printBtn.classList.remove('btn-info');
  printBtn.classList.add('btn-secondary');
 }

 // Save Bill Function with enhanced validation
 async function crUpBill(fnNumber) {
  try {
   // Validate required fields
   const invoiceNumber = document.getElementById('invoiceNumber').value.trim();
   const receiptDateValue = document.getElementById('receiptDate').value;
   const deliveryDateValue = document.getElementById('deliveryDate').value;
   const clientId = document.getElementById('clientId').value;
   const r_eferrerId = parseInt(document.getElementById('referrerId').value);

   if (!invoiceNumber) {
    return validateAndScrollToField('invoiceNumber', 'Please enter invoice number');
   }

   if (!receiptDateValue) {
    return validateAndScrollToField('receiptDate', 'Please select receipt date and time');
   }

   // Validate clientId - cannot be blank or 0
   if (!clientId || clientId === '0') {
    return validateAndScrollToField('c_dtls_lient', 'Please select a customer');
   }

   // Validate date formats and ensure time is included
   if (!receiptDateValue.includes(' ') || receiptDateValue.split(' ')[1].length !== 5) {
    return validateAndScrollToField('receiptDate', 'Please select both date and time for receipt');
   }

   // Parse the date strings (format: "YYYY-MM-DD HH:mm")
   const receiptDate = receiptDateValue;
   const deliveryDate = deliveryDateValue;

   // Get added items
   const addedItems = document.querySelectorAll('#addedItemsContainer .added-item-card');
   if (addedItems.length === 0) {
    return validateAndScrollToField('itemName', 'Please add at least one item to the bill');
   }

   if (typeof billingRequisit_be === 'function' && shoEyeMsrmntTbl) {
    const eyeMeasurement = getEyeMeasurement();
    if (eyeMeasurement !== null) {
     payload0.be = eyeMeasurement;
     payload0.be.ef = r_eferrerId;
    } else {
     const confirmed = confirm("Save without eye measurement?");
     if (!confirmed) {
      return;
     }
    }
   }

   // Prepare bill items array
   const billItems = Array.from(addedItems).map(item => {
    const itemId = item.getAttribute('data-item-id') || '';
    const name = item.querySelector('strong').textContent;
    const qtyInput = item.querySelector('input[type="number"]');
    const rateInput = item.querySelectorAll('input[type="number"]')[1];
    const priceElement = item.querySelector('span[id^="itemPrice-"]');
    const descriptionElement = item.querySelector('.text-muted');

    const qty = parseInt(qtyInput.value) || 0;
    const price = parseFloat(priceElement.textContent) || 0;
    const description = descriptionElement.textContent === '' ? '' : descriptionElement.textContent;

    return {
     "h": qty.toString(), // Quantity
     "f": itemId, // Item ID
     "g": price, // Price
     "i": description, // Description
     "j": item.getAttribute('data-item-subname') || '' // Sub Name (laundry operation)
    };
   });

   const receivedPayments = receivedAmounts.map(payment => {
    const paymentDateTime = payment.dateTime;
    return {
     "i": payment.paymentType, // Payment type
     "j": payment.amount.toFixed(2), // Amount
     "k": paymentDateTime.split(' ')[0], // Date only (YYYY-MM-DD)
     "n": payment.constraintCounter || 0, // Constraint counter (default to 1 if not set)
     "g": payment.g || '' // Cashier c.a
    };
   });

   if (receivedPayments.length == 0) {
    const confirmed = confirm("Continue without money?");
    if (!confirmed) {
     return;
    }
   }

   payload0.i = billItems;
   payload0.b = {
    "e": clientId, // Client ID (validated above)
    "f": receiptDate.split(' ')[0], // Receipt date only (YYYY-MM-DD)
    "g": invoiceNumber, // Invoice number
    "i": document.getElementById('billNotes').value.trim(),
    "k": document.getElementById('discountAmount').value || 0,
    "l": r_eferrerId
   };
   if (fnNumber == 7) {
    const hasChanges = checkChangeInSoldItems();
    if (!hasChanges) {
     window.showelsemodal("Nothing updated, as no changes are made;");
     return;
    }
    payload0.b.a = billSelectedToUpdate.a;
   }
   payload0.r = receivedPayments;

   payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, getMaxDateTables());
   payload0.vw = 1;
   payload0.fn = fnNumber;//3=save new bill,7=update bill
   const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
   if (response.su == 1) {
    if (fnNumber == 7) {
     let t1999mp = await dbDexieManager.deleteRecords(dbnm, 'b', billSelectedToUpdate.a);
     let t2000mp = (await dbDexieManager.getAllRecords(dbnm, 'i')).filter(o => o.e === billSelectedToUpdate.a).forEach(o => dbDexieManager.deleteRecords(dbnm, 'i', o.a));
     let t2001mp = await dbDexieManager.deleteRecords(dbnm, 'be', { ea: billSelectedToUpdate.a }, ['ea']);
     let t2002mp = (await dbDexieManager.getAllRecords(dbnm, 'r')).filter(o => o.tb === 7 && o.td === billSelectedToUpdate.a).forEach(o => dbDexieManager.deleteRecords(dbnm, 'r', o.a));
    }
    handl_op_rspons(response, 0);
    disableSaveBtn();
    disableUpdateButton();
    enablePrintButton();

    if (fnNumber == 3) {
     window.billSaved = true;
     const addBtn = document.getElementById('addReceivedAmountBtn');
     if (addBtn) {
      addBtn.disabled = true;
      addBtn.classList.remove('btn-primary');
      addBtn.classList.add('btn-secondary');
     }
     updateReceivedAmountsUI();
     refreshGrandTotals();
    } else if (fnNumber == 7) {
     updateNewPaymentsUI();
     refreshGrandTotals();
    }

    if (response?.b?.l && Array.isArray(response.b.l)) {
     for (let item of response.b.l) {
      if (item?.g.toString() === invoiceNumber) {
       billTableRowId = item.a;
       break;
      }
     }
    }
    showToast('Bill saved successfully!');

    // Play success sound
    playSound('https://cdn.uppbeat.io/audio-files/550fafd5d5403a2f6e11b6feefd0899e/ca847a02644164ab90c3d80471e5ac23/57f3eeed9ce661826b31f4cf857e3afe/STREAMING-ui-double-digital-beep-gfx-sounds-1-1-00-00.mp3');
   } else {
    let t1848mp = extractMessages(response);
    if (t1848mp.length == 0) t1848mp = response.ms;
    window.showelsemodal(t1848mp);
   }
  } catch (error) {
   console.error('Error saving bill:', error);
   showToast('Error saving bill: ' + error.message);
  }
 }
 function extractMessages(data) {
  if (!data.fn3 || !data.fn3.r || !Array.isArray(data.fn3.r)) {
   return "";
  }

  return data.fn3.r
   .map(obj => obj.ms || "") // Extract ms property or empty string if not present
   .filter(ms => ms !== "")  // Remove empty messages
   .join('\n');              // Join with line breaks
 }

 function calculateDiscountFromPercentage() {
  const totalPrice = parseFloat(document.getElementById('totalPrice').textContent) || 0;
  const discountPercentage = parseFloat(document.getElementById('discountPercentage').value) || 0;

  if (totalPrice <= 0) return;

  // Calculate discount amount
  const discountAmount = (totalPrice * discountPercentage) / 100;
  document.getElementById('discountAmount').value = discountAmount.toFixed(2);

  // No need to set finalAmount element as it doesn't exist
  // Just update grand totals directly
  refreshGrandTotals();
 }

 function calculateDiscountFromAmount() {
  const totalPrice = parseFloat(document.getElementById('totalPrice').textContent) || 0;
  const discountAmount = parseFloat(document.getElementById('discountAmount').value) || 0;

  if (totalPrice <= 0) return;

  // Calculate discount percentage
  const discountPercentage = totalPrice > 0 ? (discountAmount / totalPrice) * 100 : 0;
  document.getElementById('discountPercentage').value = discountPercentage.toFixed(2);

  // No need to set finalAmount element as it doesn't exist
  // Just update grand totals directly
  refreshGrandTotals();
 }

 async function loadQRScanner() {
  return new Promise((resolve, reject) => {
   if (window.Html5QrcodeScanner) {
    resolve('QR Scanner already loaded');
    return;
   }

   const script = document.createElement('script');
   script.src = QR_SCANNER_CDN;
   script.async = true;

   let loaded = false;

   script.onload = () => {
    if (!loaded) {
     loaded = true;
     // Additional check to ensure the library is properly loaded
     if (typeof Html5QrcodeScanner !== 'undefined') {
      resolve('QR Scanner loaded successfully');
     } else {
      reject(new Error('QR Scanner library not properly initialized'));
     }
    }
   };

   script.onerror = () => {
    if (!loaded) {
     loaded = true;
     reject(new Error('Failed to load QR Scanner from CDN'));
    }
   };

   // Add timeout to handle hanging requests
   setTimeout(() => {
    if (!loaded) {
     loaded = true;
     reject(new Error('QR Scanner loading timeout'));
    }
   }, 10000); // 10 second timeout

   document.head.appendChild(script);
  });
 }

 // Helper function to stop QR scanner
 function stopQRScanner(scanner, container, overlay) {
  // Reset flags
  qrScannerState.isPaused = false;
  qrScannerState.shouldResume = false;

  if (scanner) {
   scanner.clear().then(() => {
    // Wait a bit to ensure scanner is fully stopped
    setTimeout(() => {
     if (container && container.parentNode) {
      document.body.removeChild(container);
     }
     if (overlay && overlay.parentNode) {
      document.body.removeChild(overlay);
     }
     currentQRScanner = null;
     qrScannerActive = false;
     html5QrcodeScanner = null;

     // Remove event listeners
     window.removeEventListener('beforeunload', handleBackButton);
     window.removeEventListener('popstate', handleBackButton);
    }, 500);
   }).catch(error => {
    console.log('Scanner stop error:', error);
    // Force cleanup even if scanner fails to clear
    if (container && container.parentNode) {
     document.body.removeChild(container);
    }
    if (overlay && overlay.parentNode) {
     document.body.removeChild(overlay);
    }
    currentQRScanner = null;
    qrScannerActive = false;
    html5QrcodeScanner = null;

    window.removeEventListener('beforeunload', handleBackButton);
    window.removeEventListener('popstate', handleBackButton);
   });
  }
 }

 // Handle back button press
 function handleBackButton() {
  if (qrScannerActive && currentQRScanner) {
   // Find and close the scanner
   const container = document.getElementById('qr-reader');
   const overlay = document.querySelector('div[style*="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7)"]');

   if (container && overlay) {
    stopQRScanner(currentQRScanner, container, overlay);

    // Prevent default back navigation if scanner is active
    if (continuousQRMode) {
     // Create a new history entry to prevent going back
     history.pushState(null, null, location.href);
     return false;
    }
   }
  }
 }

 // QR Scanner Modal Functions
 async function openQRScannerModal() {
  try {
   // Load QR scanner library first
   await loadQRScanner();

   // Create modal for QR scanner
   const modal = create_modal_dynamically('qr_scanner_modal');
   const modalContent = modal.contentElement;
   const modalInstance = modal.modalInstance;

   // Set modal content
   modalContent.innerHTML = `
<div class="modal-header">
<h5 class="modal-title">QR Code Scanner</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body">
<div id="qr-reader-container" class="text-center">
<div id="qr-reader" style="width: 100%"></div>
<div id="qr-scanner-status" class="mt-3">
<div class="spinner-border text-primary" role="status" id="qr-scanner-loading">
<span class="visually-hidden">Loading...</span>
</div>
<p class="text-muted mt-2" id="qr-scanner-message">Initializing camera...</p>
</div>
</div>
<div class="text-center mt-3">
<button class="btn btn-danger btn-sm" id="stopScannerBtn">
<i class="fas fa-stop me-1"></i> Stop Scanner
</button>
</div>
</div>
`;

   modalInstance.show();

   // Add scanner container style
   const scannerContainer = document.getElementById('qr-reader-container');
   scannerContainer.style.minHeight = '300px';

   // Initialize scanner after modal is shown
   modal.modalElement.addEventListener('shown.bs.modal', async function () {
    await initializeQRScannerInModal(modalInstance, modalContent);
   });

   // Handle stop button
   document.getElementById('stopScannerBtn').addEventListener('click', function () {
    stopQRScanner(html5QrcodeScanner, document.getElementById('qr-reader'), modal.modalElement);
    modalInstance.hide();
   });

  } catch (error) {
   console.error('QR Scanner modal failed:', error);
   showToast('QR Scanner failed to load. Please try again.');
  }
 }

 async function initializeQRScannerInModal(modalInstance, modalContent) {
  try {
   // Check camera permissions
   const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
   });
   stream.getTracks().forEach(track => track.stop());

   // Reset scanner state
   qrScannerState.isPaused = false;
   qrScannerState.shouldResume = false;

   // Initialize scanner
   html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader",
    {
     fps: 10,
     qrbox: { width: 250, height: 250 }
    },
    false
   );

   currentQRScanner = html5QrcodeScanner;
   qrScannerActive = true;

   // Hide loading indicator
   document.getElementById('qr-scanner-loading').style.display = 'none';
   document.getElementById('qr-scanner-message').textContent = 'Ready to scan...';

   html5QrcodeScanner.render(
    async (decodedText) => {
     // Check if we should resume scanning
     if (qrScannerState.shouldResume) {
      qrScannerState.isPaused = false;
      qrScannerState.shouldResume = false;
     }

     // If scanning is paused, ignore this scan
     if (qrScannerState.isPaused) {
      console.log('Scanning paused, ignoring scan');
      return;
     }

     // Pause scanning temporarily
     qrScannerState.isPaused = true;

     // Show scanning status
     document.getElementById('qr-scanner-message').textContent = 'Processing QR code...';
     document.getElementById('qr-scanner-message').className = 'text-info mt-2';

     // Play scan sound immediately when QR is detected
     playSound('https://assets.mixkit.co/active_storage/sfx/1082/1082.wav');

     // Check if item exists
     const matchedItems = items.find((c) => c.a.toString() == decodedText);

     if (!matchedItems) {
      // Item not found - show confirmation modal
      // Keep scanning paused until user decides

      // Update status message
      document.getElementById('qr-scanner-message').textContent = 'Item not found in database';
      document.getElementById('qr-scanner-message').className = 'text-danger mt-2';

      // Show confirmation modal
      const confirmModal = create_modal_dynamically('item_not_found_modal');
      const confirmContent = confirmModal.contentElement;
      const confirmInstance = confirmModal.modalInstance;

      confirmContent.innerHTML = `
<div class="modal-header">
<h5 class="modal-title">Item Not Found</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body">
<p>Scanned QR code: <strong>${decodedText}</strong></p>
<p>This item ID was not found in the database.</p>
<p>Do you want to continue scanning?</p>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="handleItemNotFoundNo()">No, Stop</button>
<button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="handleItemNotFoundYes()">Yes, Continue</button>
</div>
`;

      confirmInstance.show();

      return;
     }

     // Item found - process it
     document.getElementById('modalItemIdInput').value = decodedText;

     // Process the scanned item
     handleModalItemIdInput({ target: { value: decodedText } });

     // Clear the input
     document.getElementById('modalItemIdInput').value = '';

     // Show success message
     document.getElementById('qr-scanner-message').textContent = 'Item found! Checking if added to sale list...';
     document.getElementById('qr-scanner-message').className = 'text-success mt-2';

     // Wait for a moment to allow the item to be processed and added
     setTimeout(() => {
      // Check if item was successfully added to sale list
      const itemWasAdded = verifyItemAddedToSaleList(matchedItems.a);

      if (itemWasAdded) {
       document.getElementById('qr-scanner-message').textContent = 'Item added successfully!';

       // If not in continuous mode, close the scanner modal after successful addition
       if (!continuousQRMode) {
        setTimeout(() => {
         // Clear the scanner
         if (html5QrcodeScanner) {
          html5QrcodeScanner.clear().then(() => {
           qrScannerActive = false;
           currentQRScanner = null;
           html5QrcodeScanner = null;
          });
         }

         // Close the modal
         const modal = bootstrap.Modal.getInstance(modalInstance.modalElement);
         if (modal) {
          modal.hide();
         }

         showToast('Item added to sale list successfully!');
        }, 1000);
       } else {
        // In continuous mode, just show success and continue
        showToast('Item added to sale list successfully!');

        const scanDelay = window[my1uzr.worknOnPg]?.confg?.scanDelayQR || 3000;

        setTimeout(() => {
         qrScannerState.isPaused = false;
         qrScannerState.shouldResume = false;

         // Reset status message after delay
         setTimeout(() => {
          if (document.getElementById('qr-scanner-message')) {
           document.getElementById('qr-scanner-message').textContent = 'Ready to scan...';
           document.getElementById('qr-scanner-message').className = 'text-muted mt-2';
          }
         }, 500);

        }, scanDelay);
       }
      } else {
       // Item was not added for some reason
       document.getElementById('qr-scanner-message').textContent = 'Item found but could not be added. Please try again.';
       document.getElementById('qr-scanner-message').className = 'text-warning mt-2';

       // Resume scanning after delay
       setTimeout(() => {
        qrScannerState.isPaused = false;
        qrScannerState.shouldResume = false;
        document.getElementById('qr-scanner-message').textContent = 'Ready to scan...';
        document.getElementById('qr-scanner-message').className = 'text-muted mt-2';
       }, 2000);
      }
     }, 500);
    },
    (errorMessage) => {
     // Don't show error messages for normal camera operation
     // Only log for debugging, but don't display to user
     if (!errorMessage.includes('NotFoundException') && !errorMessage.includes('No QR code')) {
      console.log(`QR Scan: ${errorMessage}`);
     }

     // Don't update the UI with error messages
     // The message stays as "Ready to scan..."
    }
   );

   // Handle modal close
   modalInstance.modalElement.addEventListener('hidden.bs.modal', function () {
    // Reset scanner state
    qrScannerState.isPaused = false;
    qrScannerState.shouldResume = false;

    if (html5QrcodeScanner) {
     // Stop the scanner first
     html5QrcodeScanner.clear().then(() => {
      qrScannerActive = false;
      currentQRScanner = null;
      html5QrcodeScanner = null;

      // Remove the scanner DOM element
      const scannerElement = document.getElementById('qr-reader');
      if (scannerElement) {
       scannerElement.innerHTML = '';
      }
     }).catch(error => {
      console.log('Scanner cleanup error:', error);
      qrScannerActive = false;
      currentQRScanner = null;
      html5QrcodeScanner = null;
     });
    }
   });

  } catch (error) {
   console.error('QR Scanner initialization failed:', error);

   // Update status message
   if (document.getElementById('qr-scanner-message')) {
    document.getElementById('qr-scanner-message').textContent =
     'Camera access denied or not available. Please check permissions.';
    document.getElementById('qr-scanner-message').className = 'text-danger mt-2';
   }

   // Hide loading indicator
   if (document.getElementById('qr-scanner-loading')) {
    document.getElementById('qr-scanner-loading').style.display = 'none';
   }

   showToast('QR scanner is currently unavailable. Please enter the item ID manually.');
  }
 }

 function handleItemNotFoundYes() {
  // Set flag to resume scanning
  qrScannerState.shouldResume = true;

  // Reset status message
  setTimeout(() => {
   if (document.getElementById('qr-scanner-message')) {
    document.getElementById('qr-scanner-message').textContent = 'Ready to scan...';
    document.getElementById('qr-scanner-message').className = 'text-muted mt-2';
   }
  }, 100);

  // Close the item not found modal
  const itemNotFoundModal = bootstrap.Modal.getInstance(document.getElementById('item_not_found_modal'));
  if (itemNotFoundModal) {
   itemNotFoundModal.hide();
  }
 }

 function handleItemNotFoundNo() {
  // Reset scanner state
  qrScannerState.isPaused = false;
  qrScannerState.shouldResume = false;

  if (html5QrcodeScanner) {
   html5QrcodeScanner.clear().then(() => {
    qrScannerActive = false;
    currentQRScanner = null;
    html5QrcodeScanner = null;

    // Close the scanner modal
    const scannerModal = bootstrap.Modal.getInstance(document.getElementById('qr_scanner_modal'));
    if (scannerModal) {
     scannerModal.hide();
    }

    // Close the item not found modal
    const itemNotFoundModal = bootstrap.Modal.getInstance(document.getElementById('item_not_found_modal'));
    if (itemNotFoundModal) {
     itemNotFoundModal.hide();
    }

    showToast('QR scanning stopped');
   });
  }
 }

 async function openQRScanner() {
  try {
   // Check if continuous mode is enabled
   continuousQRMode = document.getElementById('modalContinuousQRMode').checked;

   if (continuousQRMode) {
    // Use the existing continuous scanning implementation
    await openContinuousQRScanner();
   } else {
    // Use the new modal-based scanner
    await openQRScannerModal();
   }

  } catch (error) {
   console.error('QR Scanner failed:', error);

   // Provide specific user feedback based on the error
   if (error.name === 'NotAllowedError') {
    showToast('Camera access was denied. Please allow camera permissions in your browser settings.');
   } else if (error.name === 'NotFoundError') {
    showToast('No camera found on this device.');
   } else {
    showToast('QR scanner is currently unavailable. Please enter the item ID manually.');
   }

   document.getElementById('modalItemIdInput').focus();
  }
 }

 async function openContinuousQRScanner() {
  // This is the existing implementation for continuous scanning
  // Keep your existing code for continuous mode here

  try {
   // Check camera permissions and availability first
   const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
   stream.getTracks().forEach(track => track.stop());

   // Create UI elements for the scanner
   const overlay = document.createElement('div');
   overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999;`;

   const scannerContainer = document.createElement('div');
   scannerContainer.id = 'qr-reader';
   scannerContainer.style.cssText = `position: fixed !important; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10000; width: 90%; max-width: 500px;`;

   scannerContainer.classList.add('scanner-container');

   // Add a close button for continuous mode
   scannerContainer.innerHTML += `
<div class="text-center mt-3">
<button class="btn btn-danger btn-sm" id="stopContinuousScan">
<i class="fas fa-stop me-1"></i> Stop Scanning
</button>
<div class="small text-muted mt-2">
Continuous mode: Items will be added automatically. Click stop or press back button to exit.
</div>
</div>
`;

   document.body.appendChild(overlay);
   document.body.appendChild(scannerContainer);

   // Initialize the scanner
   const html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader",
    {
     fps: 10,
     qrbox: { width: 250, height: 250 }
    },
    false
   );

   currentQRScanner = html5QrcodeScanner;
   qrScannerActive = true;

   // Flag to prevent multiple scans during delay
   let isScanningPaused = false;

   html5QrcodeScanner.render(
    (decodedText) => {
     // If scanning is paused, ignore this scan
     if (isScanningPaused) {
      return;
     }

     // Pause scanning temporarily
     isScanningPaused = true;

     // Populate the input and process the item
     document.getElementById('modalItemIdInput').value = decodedText;

     // Play QR scan sound
     playSound('https://assets.mixkit.co/active_storage/sfx/1082/1082.wav');

     // Process the scanned item
     handleModalItemIdInput({ target: { value: decodedText } });

     // Clear the input
     document.getElementById('modalItemIdInput').value = '';

     // Wait for the configured delay before resuming scanning
     const scanDelay = window[my1uzr.worknOnPg]?.confg?.scanDelayQR || 3000;

     setTimeout(() => {
      isScanningPaused = false;
     }, scanDelay);

    },
    (errorMessage) => {
     // Don't log normal camera operation errors
     if (!errorMessage.includes('NotFoundException') && !errorMessage.includes('No QR code')) {
      console.log(`QR Scan: ${errorMessage}`);
     }
    }
   );

   // Add stop button handler for continuous mode
   document.getElementById('stopContinuousScan').addEventListener('click', () => {
    stopQRScanner(html5QrcodeScanner, scannerContainer, overlay);
   });

   // Close scanner when clicking the overlay
   overlay.addEventListener('click', () => {
    stopQRScanner(html5QrcodeScanner, scannerContainer, overlay);
   });

   // Listen for back button press
   if ('onbeforeunload' in window) {
    window.addEventListener('beforeunload', handleBackButton);
   }

   // Also listen for popstate (browser back button)
   window.addEventListener('popstate', handleBackButton);

  } catch (error) {
   console.error('Continuous QR Scanner failed:', error);
   throw error;
  }
 }

 // Function to directly add item from QR scan
 function addItemDirectlyFromQR(item) {
  const itemId = item.a;
  const currentRate = parseFloat(item.k || 0);
  const quantity = 1; // Default quantity for QR scan

  // Check if item already exists in sale list with same rate
  const existingItem = findExistingItemInSaleList(itemId, currentRate);

  if (existingItem) {
   // Item exists with same rate - increment quantity
   incrementItemQuantity(existingItem);
   showToast(`Quantity increased for ${item.gn || 'Item'}`);

   // Play sound for item addition
   playSound('https://cdn.pixabay.com/download/audio/2025/10/21/audio_3880ed67e2.mp3');
  } else {
   // Item doesn't exist - add new item to sale list
   addItemToSaleList(item, quantity, currentRate);
   showToast(`${item.gn || 'Item'} added to sale list`);

   // Play sound for item addition
   playSound('https://cdn.pixabay.com/download/audio/2025/10/21/audio_3880ed67e2.mp3');
  }
 }

 // Find existing item in sale list with same ID and rate
 function findExistingItemInSaleList(itemId, rate) {
  const addedItems = document.querySelectorAll('#addedItemsContainer .added-item-card');
  for (const itemCard of addedItems) {
   const cardItemId = itemCard.getAttribute('data-item-id');
   let cardRate = parseFloat(itemCard.getAttribute('data-item-rate') || '');
   if (!(cardRate >= 0)) {
    const rateInput = itemCard.querySelectorAll('input[type="number"]')[1];
    cardRate = rateInput ? (parseFloat(rateInput.value) || 0) : 0;
   }

   if (cardItemId == itemId && Math.abs(cardRate - rate) < 0.01) { // Compare with tolerance for floating point
    return itemCard;
   }
  }
  return null;
 }

 // Increment quantity of existing item - SIMPLIFIED AND FIXED
 function incrementItemQuantity(itemCard, qtyToAdd = 1) {
  // Get all required elements
  const qtyInput = itemCard.querySelector('input[type="number"]');
  const rateInput = itemCard.querySelectorAll('input[type="number"]')[1];
  const priceElement = itemCard.querySelector('span[id^="itemPrice-"]');

  if (!qtyInput || !rateInput || !priceElement) {
   console.error('Could not find required elements in item card');
   return;
  }

  // Get current values
  const currentQty = parseInt(qtyInput.value) || 1;
  const currentRate = parseFloat(rateInput.value) || 0;

  // Calculate new values
  const newQty = currentQty + qtyToAdd;
  const newPrice = newQty * currentRate;

  // Update the UI
  qtyInput.value = newQty;
  priceElement.textContent = newPrice.toFixed(2);

  // Update bill summary
  updateBillSummary();
  updateBillSectionsVisibility();

  console.log(`Quantity increased: ${currentQty} → ${newQty}, Price: ${newPrice.toFixed(2)}`);
 }

 // Get the unique ID of an item card
 function getItemCardId(itemCard) {
  const idMatch = itemCard.id.match(/invoiceItem-(\d+)/);
  return idMatch ? parseInt(idMatch[1]) : null;
 }

 // Add item directly to sale list (without using the form)
 function addItemToSaleList(item, quantity, rate) {
  const itemId = item.a;
  const name = item.gn || 'Unknown Item';
  const imageUrl = getGoogleDriveImageUrl(item.gu) || '';
  const description = item.ba_f || '';
  const price = quantity * rate;
  const uniqueItemId = Date.now();

  const addedItemsContainer = document.getElementById('addedItemsContainer');
  updateBillSectionsVisibility();

  const itemHTML = `
<div class="card mb-3 added-item-card" id="invoiceItem-${uniqueItemId}" data-item-id="${itemId}" data-item-rate="${rate}">
<div class="card-body">
<div class="row">
<!-- Left side - Image (fixed 3 columns) -->
<div class="col-3">
<div class="text-center">
${`<img src="${imageUrl || 'https://cdn-icons-png.freepik.com/512/13543/13543330.png'}" class="added-item-image" alt="Item Image" 
onerror="this.src='https://cdn-icons-png.freepik.com/512/13543/13543330.png'">`}
</div>
</div>

<!-- Right side - Details (fixed 9 columns) -->
<div class="col-9">
<!-- Row 1 - Item Name -->
<div class="row mb-2 g-0">
<div class="col-10">
<strong>${name}</strong>
</div>
<div class="col-2 d-flex align-items-center justify-content-end">
<button class="btn btn-outline-danger btn-sm" onclick="removeItemFromInvoice(${uniqueItemId})">
<i class="fas fa-trash"></i>
</button>
</div>
</div>

<!-- Row 2 - Quantity, Rate, Price (fixed 4-4-4 columns) -->
<div class="row mb-2 g-0">
<div class="col-4">
<strong>Qty:</strong> 
<input type="number" 
class="form-control form-control-sm d-inline-block w-auto" 
value="${quantity}" 
min="1" 
step="1"
style="width: 70px; display: inline-block;"
onchange="updateItemQuantity(${uniqueItemId}, parseFloat(this.value))"
onblur="updateItemQuantity(${uniqueItemId}, parseFloat(this.value))">
</div>
<div class="col-4">
<strong>Rate:</strong> 
<input type="number" 
class="form-control form-control-sm d-inline-block w-auto" 
value="${rate.toFixed(2)}" 
min="0" 
step="0.01"
style="width: 80px; display: inline-block;"
onchange="updateItemRate(${uniqueItemId}, this.value)"
onblur="updateItemRate(${uniqueItemId}, this.value)">
</div>
<div class="col-4">
<strong>Price:</strong> ₹<span id="itemPrice-${uniqueItemId}">${price.toFixed(2)}</span>
</div>
</div>

<!-- Row 3 - Description -->
<div class="row g-0">
<div class="col-12">
<small class="text-muted">${description || ''}</small>
</div>
</div>
</div>
</div>
</div>
</div>
`;

  addedItemsContainer.insertAdjacentHTML('beforeend', itemHTML);

  // Update bill summary
  updateBillSummary();
  updateBillSectionsVisibility();

  // Play sound for item addition
  playSound('https://cdn.pixabay.com/download/audio/2025/10/21/audio_3880ed67e2.mp3');
 }

 function showItemDropdown(inputElement) {
  hideNavMenu();

  const existingDropdown = document.querySelector('.item-dropdown');
  if (existingDropdown) existingDropdown.remove();

  const dropdown = document.createElement('div');
  dropdown.className = 'item-dropdown dropdown-menu show';

  const rect = inputElement.getBoundingClientRect();
  const isMobile = window.innerWidth <= 768;

  dropdown.style.position = 'fixed';
  dropdown.style.top = rect.bottom + 'px';
  dropdown.style.left = isMobile ? '10px' : rect.left + 'px';
  dropdown.style.width = isMobile ? 'calc(100vw - 20px)' : rect.width + 'px';
  dropdown.style.maxHeight = isMobile ? '50vh' : '40vh';
  dropdown.style.zIndex = '99999';
  dropdown.style.overflowY = 'auto';
  document.body.appendChild(dropdown);

  const renderDropdownList = () => {
   dropdown.querySelectorAll('.dropdown-item, .item-dropdown-no-results').forEach(el => el.remove());
   const searchValue = inputElement.value.toLowerCase().trim();
   let filteredItems = items;

   if (searchValue) {
    filteredItems = items.filter(item => {
     if (!item || !item.gn) return false;
     if (window[my1uzr.worknOnPg].confg.canSaleIfStock == 1 && item.d != 111) {
      if (!item.qAvlb || item.qAvlb <= 0) return false;
     }
     const itemName = item.gn.toLowerCase();
     const itemId = item.a ? item.a.toString().toLowerCase() : '';
     const itemDescription = item.ba_f ? item.ba_f.toLowerCase() : '';
     return itemName.includes(searchValue) || itemId.includes(searchValue) || itemDescription.includes(searchValue);
    }).sort((a, b) => {
     const aName = a.gn.toLowerCase();
     const bName = b.gn.toLowerCase();
     const aExactMatch = aName === searchValue;
     const bExactMatch = bName === searchValue;
     if (aExactMatch && !bExactMatch) return -1;
     if (!aExactMatch && bExactMatch) return 1;
     const aIndex = aName.indexOf(searchValue);
     const bIndex = bName.indexOf(searchValue);
     if (aIndex !== bIndex) return aIndex - bIndex;
     return (mostUsedItems[b.a] || 0) - (mostUsedItems[a.a] || 0);
    });
   } else {
    filteredItems = items.filter(item => {
     if (!item || !item.gn) return false;
     if (window[my1uzr.worknOnPg].confg.canSaleIfStock == 1 && item.d != 111) {
      return item.qAvlb && item.qAvlb > 0;
     }
     return true;
    }).sort((a, b) => (mostUsedItems[b.a] || 0) - (mostUsedItems[a.a] || 0));
   }

   filteredItems = filteredItems.slice(0, 20);

   if (filteredItems.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'dropdown-item item-dropdown-no-results text-center text-muted py-3';
    noResults.innerHTML = '<i class="fas fa-search me-2"></i>No items found';
    dropdown.appendChild(noResults);
   } else {
    filteredItems.forEach(item => {
     const itemElement = document.createElement('div');
     itemElement.className = 'dropdown-item d-flex align-items-center py-2';

     let prefixText = '';
     let stockIndicator = '';

     if (item.hasOwnProperty('qAvlb')) {
      prefixText = `[${item.qAvlb}] `;
      if (item.qAvlb <= 5 && item.qAvlb > 0) {
       stockIndicator = '<span class="badge bg-warning ms-1">Low Stock</span>';
      } else if (item.qAvlb === 0) {
       stockIndicator = '<span class="badge bg-danger ms-1">Out of Stock</span>';
      }
     } else if (item.i) {
      prefixText = `[${item.i}] `;
     }

     itemElement.innerHTML = `
<img src="${getGoogleDriveImageUrl(item.gu) || 'https://cdn-icons-png.freepik.com/512/13543/13543330.png'}" 
onerror="this.src='https://cdn-icons-png.freepik.com/512/13543/13543330.png'">
<div class="item-name">
<strong>${prefixText}${item.gn || 'Unnamed Item'}</strong>
${stockIndicator}
<br>
<small class="text-muted">${item.ba_f || ''}</small>
</div>
<div class="item-price">
<small class="text-muted">₹${item.k || '0'}</small>
</div>
`;

     if (window[my1uzr.worknOnPg].confg.canSaleIfStock == 1 &&
      item.d != 111 &&
      (!item.qAvlb || item.qAvlb <= 0)) {
      itemElement.classList.add('disabled');
      itemElement.style.opacity = '0.6';
      itemElement.style.cursor = 'not-allowed';
      itemElement.title = 'Out of stock - cannot be sold';
     } else {
      itemElement.addEventListener('click', () => {
       dropdownClicked = true;
       if (blurTimeout) { clearTimeout(blurTimeout); blurTimeout = null; }
       if (inputElement.id === 'modalItemName') selectModalItem(item);
       dropdown.remove();
       setTimeout(() => {
        if (inputElement.id === 'modalItemName') {
         const q = document.getElementById('modalItemQty');
         if (q) q.focus();
        }
       }, 10);
      });
     }

     dropdown.appendChild(itemElement);
    });
   }
  };

  const clickHandler = (e) => {
   if (!dropdown.contains(e.target) && e.target !== inputElement) {
    dropdown.remove();
    document.removeEventListener('click', clickHandler);
   }
  };

  setTimeout(() => document.addEventListener('click', clickHandler), 100);
  renderDropdownList();
 }

 // Inline Edit Functions for Quantity and Rate
 function updateItemQuantity(itemId, newQuantity) {
  const itemElement = document.getElementById(`invoiceItem-${itemId}`);
  if (!itemElement) return;

  // Validate quantity
  newQuantity = parseInt(newQuantity) || 1;
  if (newQuantity < 1) {
   newQuantity = 1;
   const qtyInput = itemElement.querySelector('input[type="number"]');
   if (qtyInput) qtyInput.value = 1;
  }

  // Get current rate
  const rateInput = itemElement.querySelectorAll('input[type="number"]')[1];
  const currentRate = parseFloat(rateInput.value) || 0;

  // Calculate new price
  const newPrice = newQuantity * currentRate;

  // Update price display
  const priceElement = document.getElementById(`itemPrice-${itemId}`);
  if (priceElement) {
   priceElement.textContent = newPrice.toFixed(2);
  }

  // Update bill summary
  updateBillSummary();
 }

 function updateItemRate(itemId, newRate) {
  const itemElement = document.getElementById(`invoiceItem-${itemId}`);
  if (!itemElement) return;

  // Validate rate
  newRate = parseFloat(newRate) || 0;
  if (newRate < 0) {
   newRate = 0;
   const rateInput = itemElement.querySelectorAll('input[type="number"]')[1];
   if (rateInput) rateInput.value = 0;
  }

  itemElement.setAttribute('data-item-rate', newRate);

  // Get current quantity
  const qtyInput = itemElement.querySelector('input[type="number"]');
  const currentQuantity = parseInt(qtyInput.value) || 1;

  // Calculate new price
  const newPrice = currentQuantity * newRate;

  // Update price display
  const priceElement = document.getElementById(`itemPrice-${itemId}`);
  if (priceElement) {
   priceElement.textContent = newPrice.toFixed(2);
  }

  // Update bill summary
  updateBillSummary();
 }

 // Remove Item Function
 function removeItemFromInvoice(itemId) {
  const itemElement = document.getElementById(`invoiceItem-${itemId}`);
  if (itemElement && confirm('Are you sure you want to remove this item?')) {
   itemElement.remove();
   updateBillSummary();

   updateBillSectionsVisibility();
  }
 }

 // Bill Summary Calculations
 function calculateBillSummary() {
  const addedItems = document.querySelectorAll('#addedItemsContainer .added-item-card');
  let totalItems = 0;
  let totalQuantity = 0;
  let totalPrice = 0;

  addedItems.forEach(item => {
   totalItems++;

   const qtyInput = item.querySelector('input[type="number"]');
   const rateInput = item.querySelectorAll('input[type="number"]')[1];
   const priceElement = item.querySelector('span[id^="itemPrice-"]');

   if (qtyInput && rateInput && priceElement) {
    const qty = parseInt(qtyInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const price = parseFloat(priceElement.textContent) || 0;

    totalQuantity += qty;
    totalPrice += price;
   }
  });

  // Update summary
  document.getElementById('totalItems').textContent = totalItems;
  document.getElementById('totalQuantity').textContent = totalQuantity;
  document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);

  // Recalculate discount and grand totals. Guard each step so a failure in
  // discount recalculation can never freeze the grand totals refresh.
  try {
   calculateDiscountFromPercentage();
  } catch (e) {
   console.warn('calculateBillSummary: discount recalc failed', e);
  }
  refreshGrandTotals();
 }

 function calculateLoadedBillTotals() {
  const addedItems = document.querySelectorAll('#addedItemsContainer .added-item-card');
  let totalItems = 0;
  let totalQuantity = 0;
  let totalPrice = 0;

  addedItems.forEach(item => {
   totalItems++;

   const qtyInput = item.querySelector('input[type="number"]');
   const rateInput = item.querySelectorAll('input[type="number"]')[1];
   const priceElement = item.querySelector('span[id^="itemPrice-"]');

   if (qtyInput && rateInput && priceElement) {
    const qty = parseInt(qtyInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const price = parseFloat(priceElement.textContent) || 0;

    totalQuantity += qty;
    totalPrice += price;
   }
  });

  // Update summary
  document.getElementById('totalItems').textContent = totalItems;
  document.getElementById('totalQuantity').textContent = totalQuantity;
  document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);

  // No need to set finalAmount as it doesn't exist
  // Just update grand totals
  refreshGrandTotals();
 }

 function updateBillSummary() {
  // Check if we're viewing an existing bill or creating a new one
  if (billTableRowId && billTableRowId > 0) {
   calculateLoadedBillTotals();
  } else {
   calculateBillSummary();
  }
 }

 // Received Amount Functions with validation
 function getPaymentTypeIcon(type) {
  const paymentTypeIcons = {
   '0': '*', // Unknown
   '1': 'C', // Cash
   '2': 'Q', // Cheque
   '3': 'A', // Card
   '4': 'U', // UPI
   '5': 'B'  // Bank Transfer
  };
  return paymentTypeIcons[type] || '0';
 }
 function getPaymentTypeText(type) {
  const paymentTypes = {
   '0': 'Unknown',
   '1': 'Cash',
   '2': 'Cheque',
   '3': 'Card',
   '4': 'UPI',
   '5': 'Bank Transfer'
  };
  return paymentTypes[type] || 'Unknown';
 }
 function updatePaymentTypeIcon(selId, btnId) {
  const sel = document.getElementById(selId || 'paymentType');
  const btn = document.getElementById(btnId || 'paymentTypeBtn');
  if (!sel || !btn) return;
  const map = { '0': '', '1': 'C', '2': 'Q', '3': 'A', '4': 'U', '5': 'B' };
  const txt = map[sel.value];
  btn.innerHTML = txt ? txt : '<i class=\"fas fa-credit-card\"></i>';
 }
 function initializeReceivedAmountForm() {
  // Date picker already handles the initial value
 }
 function receivedCashierMatches() {
  const ids = (window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.cashiers) || [];
  if (!ids || !ids.length) return [];
  const cArr = clientReferrerArray && clientReferrerArray.length ? clientReferrerArray : [];
  const idSet = ids.map(Number);
  return cArr.filter(function (r) { return idSet.indexOf(Number(r.a)) !== -1; });
 }
 function toggleReceivedCashierDropdown(e) {
  if (e) e.stopPropagation();
  const dd = document.getElementById('receivedCashierDropdown');
  if (!dd) return;
  const cb = document.getElementById('receivedCashierBtn');
  const ptb = document.getElementById('paymentTypeBtn');
  if (cb && ptb && !cb.dataset.synced) {
   cb.style.height = ptb.offsetHeight + 'px';
   cb.style.minWidth = ptb.offsetWidth + 'px';
   cb.style.padding = '0 .5rem';
   cb.dataset.synced = '1';
  }
  if (dd.style.display !== 'none') { dd.style.display = 'none'; return; }
  if (clientReferrerArray && !clientReferrerArray.length) {
   dbDexieManager.getAllRecords(dbnm, "c").then(function (arr) {
    clientReferrerArray = arr || [];
    renderReceivedCashierDropdown(dd);
   }).catch(function (err) { console.warn('load c for cashiers failed', err); renderReceivedCashierDropdown(dd); });
  } else {
   renderReceivedCashierDropdown(dd);
  }
 }
 function renderReceivedCashierDropdown(dd) {
  const matches = receivedCashierMatches();
  if (!matches.length) {
   dd.innerHTML = '<div class="p-2 text-muted small">No cashiers available</div>';
  } else {
   const cur = document.getElementById('receivedCashier') ? document.getElementById('receivedCashier').value : '';
   dd.innerHTML = matches.map(function (r) {
    const name = String(r.i || '') + (r.h ? ' ' + r.h : '');
    const num = r.e || '';
    const a = r.a;
    const sel = String(a) === String(cur);
    return '<div data-a="' + a + '" onclick="pickReceivedCashier(' + a + ')" style="padding:6px 10px;cursor:pointer;border-bottom:1px solid #eee;' + (sel ? 'background:#0d6efd;color:#fff;' : '') + '"><div style="font-weight:600;font-size:.85rem;">' + (sel ? '<i class="fas fa-check me-1"></i>' : '') + (name || ('Cashier ' + a)) + '</div><div style="font-size:.75rem;opacity:.85;">' + (num || '') + '</div></div>';
   }).join('') + '<div onclick="clearReceivedCashier()" style="padding:6px 10px;cursor:pointer;text-align:center;color:#dc3545;font-size:.8rem;border-top:1px solid #eee;"><i class="fas fa-times me-1"></i>Clear cashier</div>';
  }
  dd.style.display = 'block';
  clampReceivedCashierDropdown();
 }
 function clampReceivedCashierDropdown() {
  const dd = document.getElementById('receivedCashierDropdown');
  const btn = document.getElementById('receivedCashierBtn');
  if (!dd || !btn || dd.style.display === 'none') return;
  const r = btn.getBoundingClientRect();
  const m = 8;
  if (r.left + dd.offsetWidth > window.innerWidth - m) {
   dd.style.left = 'auto';
   dd.style.right = '0';
  } else {
   dd.style.left = '0';
   dd.style.right = 'auto';
  }
  if (r.bottom + dd.offsetHeight > window.innerHeight - m) {
   dd.style.top = 'auto';
   dd.style.bottom = '100%';
  } else {
   dd.style.top = '100%';
   dd.style.bottom = 'auto';
  }
 }
 function pickReceivedCashier(a) {
  const hf = document.getElementById('receivedCashier');
  if (hf) hf.value = String(a);
  const btn = document.getElementById('receivedCashierBtn');
  if (btn) {
   const r = (clientReferrerArray || []).find(function (x) { return Number(x.a) === Number(a); });
   const rawName = r && String(r.i || '').trim() ? String(r.i).trim() : ('#' + a);
   const firstName = rawName.split(/\s+/)[0];
   btn.innerHTML = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : ('#' + a);
   btn.style.background = '#0d6efd';
   btn.style.color = '#fff';
   btn.style.borderColor = '#0d6efd';
  }
  const dd = document.getElementById('receivedCashierDropdown');
  if (dd) dd.style.display = 'none';
 }
 function clearReceivedCashier() {
  const hf = document.getElementById('receivedCashier');
  if (hf) hf.value = '';
  const btn = document.getElementById('receivedCashierBtn');
  if (btn) {
   btn.innerHTML = '<i class="fas fa-user"></i>';
   btn.style.background = '';
   btn.style.color = '';
   btn.style.borderColor = '#212529';
  }
  const dd = document.getElementById('receivedCashierDropdown');
  if (dd) dd.style.display = 'none';
 }
 window.toggleReceivedCashierDropdown = toggleReceivedCashierDropdown;
 window.pickReceivedCashier = pickReceivedCashier;
 window.clearReceivedCashier = clearReceivedCashier;
 if (typeof document !== 'undefined') {
  document.addEventListener('click', function (e) {
   const dd = document.getElementById('receivedCashierDropdown');
   if (!dd) return;
   const btn = document.getElementById('receivedCashierBtn');
   if (e.target.closest && ((btn && e.target.closest('#receivedCashierBtn')) || (dd && dd.contains(e.target)))) return;
   dd.style.display = 'none';
  });
 }
 function addReceivedAmount() {
  const hasChanges = checkChangeInSoldItems();
  if (billSelectedToUpdate && !hasChanges) {
   let sCurrItems = stored_bill_items.filter(item => item.e == billSelectedToUpdate.a);
   let cCashInfo = stored_bill_cash_info.filter(cash => cash.tb == 7 && cash.td == billSelectedToUpdate.a);
   showAlreadyReceivedAmts(billSelectedToUpdate.a, sCurrItems, cCashInfo);
   return;
  }

  const dateTime = document.getElementById('receivedDateTime').value;
  const amount = parseFloat(document.getElementById('receivedAmount').value) || 0;
  const paymentType = document.getElementById('paymentType').value;
  const clientId = parseInt(document.getElementById('clientId').value) || 0;

  // Validation
  if (!dateTime) {
   return validateAndScrollToField('receivedDateTime', 'Please select date and time');
  }

  if (amount <= 0) {
   return validateAndScrollToField('receivedAmount', 'Please enter a valid amount');
  }

  if (!clientId || clientId === 0) {
   return validateAndScrollToField('c_dtls_lient', 'Please select a customer first');
  }

  // Extract date part (YYYY-MM-DD)
  const paymentDate = dateTime.split(' ')[0];

  // Validate payment uniqueness
  (async () => {
   const validationResult = await validatePaymentUniqueness(clientId, amount, dateTime, paymentType);

   let constraintCounter = 0; // Default to 1 for first payment on this date
   let didCrossBillIncrement = false;

   console.log('Validation result:', validationResult);

   if (validationResult.matchingCount > 0) {
    // Same amount/date payments exist for THIS SPECIFIC DATE
    let message = `Same amount (₹${amount.toFixed(2)}) on same date (${paymentDate}) already exists.\n\n`;

    if (validationResult.matchingCount === 1) {
     message += `Existing constraint counter: ${validationResult.existingConstraint}`;
    } else {
     message += `Existing constraint counters: 0 to ${validationResult.existingConstraint}`;
    }

    const nextCounter = validationResult.nextConstraint;
    message += `\n\nDo you want to add another payment with constraint counter ${nextCounter}?`;

    console.log('Asking user:', message);

    const userResponse = await showConfirmModal(message);

    if (!userResponse) {
     console.log('User cancelled');
     return;
    }

    // Set constraint counter to the next available one (existing payments untouched)
    constraintCounter = validationResult.nextConstraint;
    didCrossBillIncrement = true;
    console.log('Setting constraint counter to:', constraintCounter);
   } else {
    // No matching payments for this date
    console.log('No matching payments for date', paymentDate, '- using constraint counter 0');
    constraintCounter = 0;
   }

   // Create received amount object with constraint counter
   const receivedAmount = {
    id: -Date.now(),
    dateTime: dateTime,
    amount: amount,
    paymentType: paymentType,
    constraintCounter: constraintCounter || 0,
    clientId: clientId,
    timestamp: new Date().toISOString(),
    g: (document.getElementById('receivedCashier') ? document.getElementById('receivedCashier').value : '') || ''
   };

   console.log('Adding payment with constraint counter:', constraintCounter, receivedAmount);

   // Add to array
   receivedAmounts.push(receivedAmount);

   // Update UI
   updateReceivedAmountsUI();

   // Clear form
   clearReceivedAmountForm();

   // Update grand totals
   refreshGrandTotals();

   // Show success message with constraint counter info
   if (constraintCounter > 0) {
    showToast(`Payment added successfully! Constraint counter: ${constraintCounter}`);
   } else {
    showToast('Payment added successfully!');
   }
  })();
 }
 function updateReceivedAmountsUI() {
  const container = document.getElementById('addedReceivedAmountsContainer');

  if (receivedAmounts.length === 0) {
   container.innerHTML = `
<div class="text-center text-muted py-3">
<i class="fas fa-receipt fa-2x mb-2"></i>
<p>No received amounts added yet</p>
</div>
`;
   return;
  }

  let html = '<h6>Payment History</h6>';

  receivedAmounts.forEach((payment, index) => {
   const paymentTypeIcon = getPaymentTypeIcon(payment.paymentType);
   const formattedDate = formatDateTime(payment.dateTime);

   // Only show constraint counter badge if > 1
   const constraintCounterBadge = payment.constraintCounter > 0 ?
    `<span class="badge bg-${getConstraintCounterColor(payment.constraintCounter)} ms-1" title="Constraint counter: ${payment.constraintCounter}">${payment.constraintCounter}</span>` : '';

   // After saving a new bill, hide the per-payment actions dropdown
   const actionsHtml = window.billSaved ? '' : `
<div class="col-2 text-end">
<div class="dropdown">
<button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
<i class="fas fa-ellipsis-v"></i>
</button>
<ul class="dropdown-menu dropdown-menu-end">
<!--li><button class="dropdown-item" onclick="updatePayment(${payment.id})"><i class="fas fa-edit me-2"></i>Update</button></li-->
<li><hr class="dropdown-divider"><hr class="dropdown-divider"></li>
<li><button class="dropdown-item text-danger" onclick="removeReceivedAmount(${payment.id})"><i class="fas fa-trash me-2"></i>Delete</button></li>
</ul>
</div>
</div>
`;

   html += `
<div class="card mb-2 received-amount-card" id="receivedAmount-${payment.id}">
<div class="card-body py-1">
<div class="row align-items-center">
<div class="col-4">
<small class="text-muted"><i class="far fa-calendar me-1"></i>${formattedDate}</small>
</div>
<div class="col-6">
<strong>${paymentTypeIcon} ₹${payment.amount.toFixed(2)}${constraintCounterBadge}</strong>
</div>
${actionsHtml}
</div>
</div>
</div>
`;
  });

  container.innerHTML = html;
 }

 // ===== NEW: update-mode only payments flow (old functions are left untouched) =====

 async function addNewReceivedAmount() {
  if (!billSelectedToUpdate) {
   showToast('No bill selected for update');
   return;
  }

  const dateTime = document.getElementById('receivedDateTime').value;
  const amount = parseFloat(document.getElementById('receivedAmount').value) || 0;
  const paymentType = document.getElementById('paymentType').value;

  if (!dateTime) {
   return validateAndScrollToField('receivedDateTime', 'Please select date and time');
  }

  if (amount <= 0) {
   return validateAndScrollToField('receivedAmount', 'Please enter a valid amount');
  }

  const paymentDate = dateTime.split(' ')[0];
  const billId = billSelectedToUpdate.a;
  const clientId = parseInt(billSelectedToUpdate.e) || 0;
  const paymentTypeInt = parseInt(paymentType) || 0;

  // Collect all matching payments - ONLY same date
  const matchingPayments = [];

  window.newUpdatePayments = window.newUpdatePayments || [];
  window.newUpdatePayments.forEach(payment => {
   const existingDate = payment.dateTime.split(' ')[0];
   const existingAmount = parseFloat(payment.amount) || 0;

   if (payment.billId === billId &&
    payment.clientId === clientId &&
    Math.abs(existingAmount - amount) < 0.001 &&
    existingDate === paymentDate &&
    payment.paymentType === paymentType) {
    matchingPayments.push(payment.constraintCounter || 0);
   }
  });

  receivedAmounts.forEach(payment => {
   const existingDate = payment.dateTime.split(' ')[0];
   const existingAmount = parseFloat(payment.amount) || 0;

   if (parseInt(payment.clientId) === clientId &&
    Math.abs(existingAmount - amount) < 0.001 &&
    existingDate === paymentDate &&
    String(payment.paymentType) === paymentType) {
    matchingPayments.push(payment.constraintCounter || 0);
   }
  });

  const existingReceivedIds = new Set(receivedAmounts.map(p => p.id));
  stored_bill_cash_info.forEach(payment => {
   if (existingReceivedIds.has(payment.a)) return;
   const existingDate = payment.k || '';
   const existingAmount = parseFloat(payment.j) || 0;
   const existingPaymentType = payment.i || '0';

   if (payment.f === 0 &&
    parseInt(payment.h) === clientId &&
    Math.abs(existingAmount - amount) < 0.001 &&
    existingDate === paymentDate &&
    parseInt(existingPaymentType) === paymentTypeInt) {
    matchingPayments.push(payment.n || 0);
   }
  });

  // Calculate constraint counter
  let constraintCounter = 0;
  let didCrossBillIncrement = false;

  if (matchingPayments.length > 0) {
   const maxCounter = Math.max(...matchingPayments);
   const nextCounter = maxCounter + 1;

   let message = `Same amount (₹${amount.toFixed(2)}) on same date (${paymentDate}) already exists.\n\n`;

   if (matchingPayments.length === 1) {
    message += `Current constraint counter: ${maxCounter}\n\n`;
   } else {
    message += `Current constraint counters: 0 to ${maxCounter}\n\n`;
   }

   message += `Do you want to add another payment with constraint counter ${nextCounter}?`;

   if (!(await showConfirmModal(message))) {
    return;
   }

   constraintCounter = maxCounter + 1;
   didCrossBillIncrement = true;
  } else {
   constraintCounter = 0;
  }

  // Add to new payments array
  const tempPayment = {
   id: Date.now(),
   billId: billId,
   dateTime: dateTime,
   amount: amount,
   paymentType: paymentType,
   constraintCounter: constraintCounter || 0,
   clientId: clientId,
   timestamp: new Date().toISOString(),
   g: (document.getElementById('receivedCashier') ? document.getElementById('receivedCashier').value : '') || ''
  };

  window.newUpdatePayments.push(tempPayment);

  // Update UI to show new payments + "Update Payments" button
  updateNewPaymentsUI();
  clearReceivedAmountForm();
  updateGrandTotalsForUpdate();

  if (constraintCounter > 0) {
   showToast(`Payment added with constraint counter: ${constraintCounter}. Click "Update Payments" to save.`);
  } else {
   showToast('Payment added. Click "Update Payments" to save.');
  }
 }

 function updateNewPaymentsUI() {
  const container = document.getElementById('addedReceivedAmountsContainer');
  if (!container) return;

  // Old renderer draws the Payment History part (unchanged behaviour)
  updateReceivedAmountsUI();

  window.newUpdatePayments = window.newUpdatePayments || [];
  const billId = billSelectedToUpdate ? billSelectedToUpdate.a : null;
  const newPayments = billId ? window.newUpdatePayments.filter(p => p.billId === billId) : [];

  if (newPayments.length === 0) return;

  let newSection = '<h6>New Payments to be Added</h6>';

  newPayments.forEach(payment => {
   const paymentTypeIcon = getPaymentTypeIcon(payment.paymentType);
   const formattedDate = formatDateTime(payment.dateTime);

   const constraintCounterBadge = payment.constraintCounter > 0 ?
    `<span class="badge bg-${getConstraintCounterColor(payment.constraintCounter)} ms-1" title="Constraint counter: ${payment.constraintCounter}">${payment.constraintCounter}</span>` : '';

   newSection += `
<div class="card mb-2 received-amount-card" style="border-left: 4px solid #ffc107 !important;">
<div class="card-body py-2">
<div class="row align-items-center">
<div class="col-4">
<small class="text-muted"><i class="far fa-calendar me-1"></i>${formattedDate}</small>
</div>
<div class="col-6">
<strong>${paymentTypeIcon} ₹${payment.amount.toFixed(2)}${constraintCounterBadge}</strong>
</div>
<div class="col-2 text-end">
<button class="btn btn-outline-danger btn-sm" onclick="removeNewUpdatePayment(${payment.id})">
<i class="fas fa-times"></i>
</button>
</div>
</div>
</div>
</div>
`;
  });

  newSection += `
<div class="text-center my-3">
<button class="btn btn-success" onclick="updateBillPayments()">
<i class="fas fa-money-check-alt me-2"></i>Update Payments
</button>
</div>
`;

  container.innerHTML = newSection + container.innerHTML;
 }

 async function removeNewUpdatePayment(paymentId) {
  window.newUpdatePayments = window.newUpdatePayments || [];
  const payment = window.newUpdatePayments.find(p => p.id === paymentId);

  if (payment && !(await showConfirmModal(`Remove payment of ₹${payment.amount.toFixed(2)}?`))) {
   return;
  }

  window.newUpdatePayments = window.newUpdatePayments.filter(p => p.id !== paymentId);
  updateNewPaymentsUI();
  updateGrandTotalsForUpdate();
  showToast('Payment removed from new payments list');
 }

 function updateGrandTotalsForUpdate() {
  const totalPrice = parseFloat(document.getElementById('totalPrice').textContent) || 0;
  const discountAmount = parseFloat(document.getElementById('discountAmount').value) || 0;
  const finalAmount = totalPrice - discountAmount;

  const billId = billSelectedToUpdate ? billSelectedToUpdate.a : null;
  const newPaymentsTotal = (billId && (window.newUpdatePayments || []))
   .filter(p => p.billId === billId)
   .reduce((sum, payment) => sum + payment.amount, 0);

  const totalReceived = receivedAmounts.reduce((sum, payment) => sum + payment.amount, 0) + newPaymentsTotal;
  const balance = finalAmount - totalReceived;

  document.getElementById('grandBillTotal').textContent = finalAmount.toFixed(2);
  document.getElementById('grandTotalReceived').textContent = totalReceived.toFixed(2);
  document.getElementById('grandBalance').textContent = balance.toFixed(2);

  const balanceElement = document.getElementById('grandBalance');
  if (balance === 0) {
   balanceElement.className = 'text-success';
  } else if (balance > 0) {
   balanceElement.className = 'text-warning';
  } else {
   balanceElement.className = 'text-danger';
  }
 }

 async function updateBillPayments() {
  if (!billSelectedToUpdate) {
   showToast('No bill selected');
   return;
  }
  window.newUpdatePayments = window.newUpdatePayments || [];
  const newPayments = window.newUpdatePayments.filter(p => p.billId === billSelectedToUpdate.a);
  if (newPayments.length === 0) {
   showToast('No new payments to update');
   return;
  }

  const billData = billSelectedToUpdate;

  const paymentDetails = newPayments.map(payment => {
   return `₹${payment.amount} (${getPaymentTypeText(payment.paymentType)}) on ${formatDateTime(payment.dateTime)}`;
  }).join('\n');

  // if (!(await showConfirmModal(`Update the following payments for bill ${billData.a}:\n\n${paymentDetails}`))) {
  //   return;
  //  }

  try {
   const paymentArray = newPayments.map(payment => {
    return {
     h: billData.e,
     i: payment.paymentType,
     j: payment.amount.toString(),
     k: payment.dateTime.split(' ')[0],
     td: billData.a,
     n: payment.constraintCounter || 0,
     g: payment.g || '' // Cashier c.a
    };
   });

   payload0.vw = 1;
   payload0.fn = 103;
   payload0.r = paymentArray;
   payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, getMaxDateTables());

   const response = await fnj3("https://my1.in/2/p.php", payload0, 1, true, null, 20000, 0, 2, 1);

   if (response.su == 1) {
    await handl_op_rspons(response, 0);
    stored_bill_cash_info = await dbDexieManager.getAllRecords(dbnm, "r") || [];
    const freshCashInfo = stored_bill_cash_info.filter(cash => cash.tb == 7 && cash.td == billData.a);
    receivedAmounts = freshCashInfo.map(payment => {
     return {
      id: payment.a,
      clientId: billData.e,
      dateTime: payment.k || new Date().toISOString().split('T')[0] + ' 00:00',
      amount: parseFloat(payment.j) || 0,
      paymentType: payment.i || '0',
      constraintCounter: payment.n || 0,
      timestamp: payment.b || new Date().toISOString()
     };
    });

    const echoPayments = (response.r && Array.isArray(response.r.l)) ? response.r.l.filter(c => String(c.td) === String(billData.a)) : [];
    const alreadyInHistory = (np) => receivedAmounts.some(ra =>
     ra.dateTime.split(' ')[0] === np.dateTime.split(' ')[0] &&
     ra.amount === np.amount &&
     String(ra.paymentType) === String(np.paymentType)
    );
    newPayments.forEach(np => {
     if (alreadyInHistory(np)) return;
     const echo = echoPayments.find(c =>
      String(c.td) === String(billData.a) &&
      String(c.i) === String(np.paymentType) &&
      parseFloat(c.j) === np.amount &&
      (c.k || '').split(' ')[0] === np.dateTime.split(' ')[0]
     );
     if (echo) {
      receivedAmounts.push({
       id: echo.a,
       clientId: billData.e,
       dateTime: echo.k || np.dateTime,
       amount: parseFloat(echo.j) || 0,
       paymentType: echo.i || np.paymentType,
       constraintCounter: np.constraintCounter || 0,
       timestamp: echo.b || new Date().toISOString()
      });
     }
    });

    window.newUpdatePayments = window.newUpdatePayments.filter(p => p.billId !== billData.a);
    updateNewPaymentsUI();
    updateGrandTotalsForUpdate();
    const stillMissing = newPayments.filter(np => !alreadyInHistory(np));
    if (stillMissing.length > 0) {
     console.log('updateBillPayments: payments missing from history, response=', response);
     showToast(stillMissing.length + ' payment(s) not visible in history — check console');
    } else {
     showToast('Payments updated successfully!');
    }
   } else {
    const errMsg = extractMessages(response) || response.ms || 'Failed to update payments';
    window.showelsemodal(errMsg);
   }
  } catch (error) {
   console.error('Error updating payments:', error);
   showToast('Error updating payments: ' + error.message);
  }
 }

 // Intercept the "+" add-payments button: in update mode it adds inline (new flow),
 // otherwise the original addReceivedAmount() keeps working exactly as before.
 document.addEventListener('click', function (e) {
  const btn = e.target.closest('button[onclick="addReceivedAmount()"]');
  if (btn && billSelectedToUpdate) {
   e.preventDefault();
   e.stopPropagation();
   addNewReceivedAmount();
  }
 }, true);
 function updatePayment(paymentId) {
  // Find the payment to update
  const paymentIndex = receivedAmounts.findIndex(payment => payment.id === paymentId);
  if (paymentIndex === -1) return;

  const payment = receivedAmounts[paymentIndex];

  // Store original values
  const originalPayment = { ...payment };

  // Populate the form with existing payment data
  document.getElementById('receivedDateTime').value = payment.dateTime;
  if (receivedDateTimePicker) receivedDateTimePicker.setCommitted(payment.dateTime);
  document.getElementById('receivedAmount').value = payment.amount;
  document.getElementById('paymentType').value = payment.paymentType;
  updatePaymentTypeIcon();

  // Store original payment data in a global variable for validation
  window.paymentBeingEdited = originalPayment;

  // Remove the payment from the array temporarily
  receivedAmounts.splice(paymentIndex, 1);

  // Update UI
  updateNewPaymentsUI();
  updateGrandTotalsForUpdate();

  // Scroll to the payment form
  const fieldRect = document.getElementById('receivedDateTime').getBoundingClientRect();
  const scrollTopPosition = window.pageYOffset + fieldRect.top - 100;
  window.scrollTo({ top: scrollTopPosition, behavior: 'smooth' });
  document.getElementById('receivedAmount').focus();

  // Show a temporary "Update Payment" button at the bottom of the form
  const updateBtnWrap = document.getElementById('receivedPaymentUpdateBtnWrap');
  if (updateBtnWrap) {
   updateBtnWrap.style.display = 'block';
   updateBtnWrap.innerHTML = '<button class="btn btn-warning btn-sm w-100" onclick="validateAndUpdatePayment(' + paymentId + ')"><i class="fas fa-save me-2"></i>Update Payment</button>';
  }

  showToast('Payment loaded for editing. Update the details and click "Update Payment" to save.');
 }
 async function validateAndUpdatePayment(paymentId) {
  const dateTime = document.getElementById('receivedDateTime').value;
  const amount = parseFloat(document.getElementById('receivedAmount').value) || 0;
  const paymentType = document.getElementById('paymentType').value;
  const clientId = parseInt(document.getElementById('clientId').value) || 0;

  // Validation
  if (!dateTime) {
   return validateAndScrollToField('receivedDateTime', 'Please select date and time');
  }

  if (amount <= 0) {
   return validateAndScrollToField('receivedAmount', 'Please enter a valid amount');
  }

  if (!clientId || clientId === 0) {
   return validateAndScrollToField('c_dtls_lient', 'Please select a customer');
  }

  // Get original payment data
  const originalPayment = window.paymentBeingEdited;
  if (!originalPayment) {
   showToast('Error: Original payment data not found');
   return;
  }

  // Extract date parts
  const paymentDate = dateTime.split(' ')[0];
  const originalPaymentDate = originalPayment.dateTime.split(' ')[0];

  // Check if values have changed
  const hasChanged = Math.abs(amount - originalPayment.amount) > 0.001 ||
   paymentDate !== originalPaymentDate ||
   paymentType !== originalPayment.paymentType;

  let constraintCounter = originalPayment.constraintCounter || 0;

  if (hasChanged) {
   // Values have changed, need to validate uniqueness
   // First, exclude the original payment from validation
   const tempValidationArray = receivedAmounts.filter(p => p.id !== paymentId);
   const originalReceivedAmounts = [...receivedAmounts];

   // Temporarily remove the original payment for validation
   receivedAmounts = tempValidationArray;

   const validationResult = await validatePaymentUniqueness(clientId, amount, dateTime, paymentType);

   // Restore the original array
   receivedAmounts = originalReceivedAmounts;

   if (validationResult.matchingCount > 0) {
    // Same amount/date payments exist
    let message = `Same amount (₹${amount.toFixed(2)}) on same date (${paymentDate}) already exists.\n\n`;

    if (validationResult.matchingCount === 1) {
     message += `Existing constraint counter: ${validationResult.existingConstraint}\n\n`;
    } else {
     message += `Existing constraint counters: 0 to ${validationResult.existingConstraint}\n\n`;
    }

    message += `Do you want to update with constraint counter ${validationResult.nextConstraint}?`;

    const userResponse = await showConfirmModal(message);

    if (!userResponse) {
     // Restore original payment
     receivedAmounts.push(originalPayment);
     updateNewPaymentsUI();
     updateGrandTotalsForUpdate();
     clearReceivedPaymentUpdateBtn();
     return;
    }
    constraintCounter = validationResult.nextConstraint;
   } else {
    constraintCounter = 0;
   }
  }

  // Create updated payment object
  const updatedPayment = {
   id: paymentId,
   dateTime: dateTime,
   amount: amount,
   paymentType: paymentType,
   constraintCounter: constraintCounter || 0,
   clientId: clientId,
   timestamp: new Date().toISOString(),
   g: (document.getElementById('receivedCashier') ? document.getElementById('receivedCashier').value : '') || ''
  };

  // Add to array
  receivedAmounts.push(updatedPayment);

  // Update UI
  updateNewPaymentsUI();
  updateGrandTotalsForUpdate();

  // Clear form
  clearReceivedAmountForm();

  // Clear the editing state
  window.paymentBeingEdited = null;

  // Remove the temporary "Update Payment" button
  clearReceivedPaymentUpdateBtn();

  // Show success message
  if (constraintCounter > 0) {
   showToast(`Payment updated successfully! Constraint counter: ${constraintCounter}`);
  } else {
   showToast('Payment updated successfully!');
  }
 }
 async function removeReceivedAmount(id) {
  // Find the payment to get its details
  const payment = receivedAmounts.find(p => p.id === id);

  if (payment) {
   // Show confirmation with constraint counter info
   const constraintInfo = payment.constraintCounter > 0 ?
    ` (Constraint counter: ${payment.constraintCounter})` : '';

   if (!(await showConfirmModal(`Remove payment of ₹${payment.amount.toFixed(2)}${constraintInfo}?`))) {
    return;
   }
  }
  if (!billSelectedToUpdate) {
   receivedAmounts = receivedAmounts.filter(p => p.id !== id);
   updateNewPaymentsUI();
   updateGrandTotalsForUpdate();
   return;
  }
  try {
   payload0.vw = 1;
   payload0.fn = 105;
   payload0.x1 = id;
   const response = await fnj3("https://my1.in/2/p.php", payload0, 1, true, null, 20000, 0, 1, 1, 1);
   if (response.su == 1) {
    await dbDexieManager.deleteRecords(dbnm, 'r', id);
    receivedAmounts = receivedAmounts.filter(payment => payment.id !== id);
    updateNewPaymentsUI();
    updateGrandTotalsForUpdate();
   } else {
    window.showelsemodal(response.ms);
   }
  } catch (error) {
   window.showelsemodal("failed:" + error);
  }
 }
 function refreshGrandTotals() {
  if (billSelectedToUpdate) {
   updateGrandTotalsForUpdate();
  } else {
   updateGrandTotals();
  }
 }
 function renumberConstraintCounters(...lists) {
  let billId = null;
  if (lists.length > 0 && !Array.isArray(lists[0])) {
   billId = lists.shift();
  }
  const payments = lists.flat().filter(p => p && p.dateTime);
  const groups = new Map();
  payments.forEach(p => {
   const pBill = (p.billId != null ? p.billId : billId);
   const key = (pBill != null ? String(pBill) : '') + '|' + (p.clientId || '') + '|' + p.dateTime.split(' ')[0] + '|' + (parseFloat(p.amount) || 0);
   if (!groups.has(key)) groups.set(key, []);
   groups.get(key).push(p);
  });
  groups.forEach(list => {
   list.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));
   list.forEach((p, i) => p.constraintCounter = i);
  });
 }
 function formatDateTime(dateTimeString) {
  if (isDesktopView()) return formatLongDisplay(dateTimeString);
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_SHORT[date.getMonth()];
  const hasTime = String(dateTimeString).includes(':');
  return `${day}/${month} ${date.getFullYear()}` + (hasTime ? `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '');
 }

 function clearReceivedAmountForm() {
  document.getElementById('receivedAmount').value = '';
  document.getElementById('paymentType').value = '0';
  updatePaymentTypeIcon();
  // Auto-set the payment date back to current date & time for the next entry
  if (receivedDateTimePicker) receivedDateTimePicker.setCommitted(new Date());
  else document.getElementById('receivedDateTime').value = formatForPicker(new Date());
 }
 function clearReceivedPaymentUpdateBtn() {
  const updateBtnWrap = document.getElementById('receivedPaymentUpdateBtnWrap');
  if (updateBtnWrap) {
   updateBtnWrap.style.display = 'none';
   updateBtnWrap.innerHTML = '';
  }
 }

 function updateGrandTotals() {
  // Get total price from items
  const totalPrice = parseFloat(document.getElementById('totalPrice').textContent) || 0;

  // Get discount amount
  const discountAmount = parseFloat(document.getElementById('discountAmount').value) || 0;

  // Calculate final amount after discount
  const finalAmount = totalPrice - discountAmount;

  // Get total received
  const totalReceived = receivedAmounts.reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate balance
  const balance = finalAmount - totalReceived;

  // Update display elements
  document.getElementById('grandBillTotal').textContent = finalAmount.toFixed(2);
  document.getElementById('grandTotalReceived').textContent = totalReceived.toFixed(2);
  document.getElementById('grandBalance').textContent = balance.toFixed(2);

  // Add visual indicators
  const balanceElement = document.getElementById('grandBalance');
  if (balance === 0) {
   balanceElement.className = 'text-success';
  } else if (balance > 0) {
   balanceElement.className = 'text-warning';
  } else {
   balanceElement.className = 'text-danger';
  }
 }

 function showToast(message) {
  // Simple toast implementation
  const toast = document.createElement('div');
  toast.style.cssText = `
position: fixed;
top: 20px;
right: 20px;
background: #333;
color: white;
padding: 12px 20px;
border-radius: 4px;
z-index: 3000;
font-size: 14px;
`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
   document.body.removeChild(toast);
  }, 3000);
 }

 function addDropdownStyles() {
  const style = document.createElement('style');
  style.textContent = `
.button-color:{
background-color: #6e42c16e;
}
#modalItemImageContainer{
max-width: 100px;
margin: 0 auto;
}

#modalItemImageContainer img{
max-width: 100%;
height: auto;
border-radius: 4px;
}

.item-dropdown.dropdown-menu{
padding: 0;
}

.item-dropdown .dropdown-item{
display: flex;
align-items: center;
padding: 10px 14px;
white-space: normal;
}

.item-dropdown .dropdown-item img{
width: 40px;
height: 40px;
object-fit: cover;
border-radius: 4px;
margin-right: 12px;
flex-shrink: 0;
}

.item-dropdown .dropdown-item .item-name{
flex: 1;
font-weight: 500;
line-height: 1.2;
min-width: 0;
overflow-wrap: break-word;
}

.item-dropdown .dropdown-item .item-name small{
display: block;
white-space: normal;
overflow: hidden;
text-overflow: ellipsis;
max-height: 2.4em;
line-height: 1.2em;
}

.item-dropdown .dropdown-item .item-price{
text-align: right;
color: #28a745;
font-weight: 500;
flex-shrink: 0;
margin-left: 8px;
}

#navbarNav{
    position:fixed;
    top:60px;
    right:10px;
    left:10px;
    z-index:1040;
}

.menu-popup{
    background:linear-gradient(135deg,var(--primary-purple),var(--dark-purple));
    border-radius:12px;
    padding:12px;
    box-shadow:0 8px 25px rgba(0,0,0,.35);
    border:1px solid rgba(255,255,255,.15);
}

.menu-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:8px;
}

.menu-item{
    min-height:65px;
    background:rgba(255, 255, 255, 0.12);
    border:1px solid rgba(255,255,255,.2);
    border-radius:8px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    font-size:.75rem;
    text-align:center;
    color:#fff;
    transition:all .25s ease;
}

.menu-item i{
    font-size:1.3rem;
    margin-bottom:5px;
    color:var(--secondary-gold);
}

.menu-item:hover{
    background:rgba(255,215,0,.15);
    border-color:var(--secondary-gold);
    transform:translateY(-2px);
    box-shadow:0 4px 12px rgba(0,0,0,.3);
}

.menu-sub-toggle.menu-open{
    background:rgba(255,215,0,.2);
    border-color:var(--secondary-gold);
}

.menu-sub-dropdown{
    display:none;
    grid-template-columns:repeat(3,1fr);
    gap:8px;
    margin-top:10px;
    padding:10px;
    background:linear-gradient(135deg,#8a4fe0,#6a2f9e);
    border:1px solid rgba(255,215,0,.35);
    border-radius:10px;
}

.menu-sub-dropdown.menu-open{ display:grid; }

.menu-sub-item{ min-height:56px; }

.menu-sub-item span{ color:var(--secondary-gold); }

.menu-sub-item i.fa-comment{ color:#4dd0e1; }
.menu-sub-item i.fa-trash{ color:#ff7043; }
.menu-sub-item i.fa-store{ color:#ffd700; }

@media (min-width:992px){
    .menu-grid{ grid-template-columns:repeat(7,1fr); }
}

/* Inline dropdown styles */



.row.g-0>[class*="col-"]{
padding-left: 5px;
padding-right: 5px;
}

.row.g-0 .input-group{
margin-bottom: 0;
}

.added-item-card{
border-left: 4px solid #28a745 !important;
}

.added-item-image{
max-width: 80px;
max-height: 80px;
object-fit: cover;
border-radius: 4px;
}

.added-item-card .form-control-sm{
display: inline-block !important;
height: 24px;
padding: 0 4px;
font-size: .875rem;
margin-left: 4px;
}

.added-item-card .form-control-sm:focus{
border-color: #007bff;
box-shadow: 0 0 0 .2rem rgba(0, 123, 255, .25);
}

.added-item-card .btn-outline-danger.btn-sm{
padding: 2px 6px;
font-size: .75rem;
border-width: 1px;
}

.added-item-card .btn-outline-danger.btn-sm:hover{
background-color: #dc3545;
color: #fff;
}

.added-item-card strong{
font-size: .9rem;
margin-right: 4px;
}

[id^="itemPrice-"]{
font-weight: 700;
color: #28a745;
}

.qr-scanner-modal{
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.8);
z-index: 2000;
display: flex;
justify-content: center;
align-items: center;
}

.qr-scanner-content{
background: #fff;
padding: 20px;
border-radius: 8px;
text-align: center;
max-width: 90%;
max-height: 90%;
}

#qr-reader.scanner-container{
position: fixed !important;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.received-amount-card{
border-left: 4px solid #007bff !important;
transition: all 0.3s ease;
}

.received-amount-card:hover{
transform: translateY(-2px);
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.badge.bg-secondary{
font-size: .75rem;
padding: 4px 8px;
}

.card.border-success{
border-width: 2px !important;
}

.bg-light{
background-color: #f8f9fa !important;
}

.btn-success, .btn-warning, .btn-info{
font-weight: 600;
padding: 10px 16px;
}

.btn:disabled{
opacity: .6;
cursor: not-allowed;
transform: none !important;
}

.btn-secondary:disabled{
background-color: #6c757d !important;
border-color: #6c757d !important;
}

.btn:disabled:hover{
transform: none !important;
box-shadow: none !important;
}

.input-group-sm{
margin-bottom: .5rem;
}

.input-group-sm .form-control{
font-size: .875rem;
}

.input-group-sm .input-group-text{
font-size: .875rem;
padding: .25rem .5rem;
}

.btn-success.btn-sm{
padding: .25rem .5rem;
font-size: .75rem;
height: 38px;
}

.form-switch .form-check-input{
height: 1.2rem;
width: 2.4rem;
cursor: pointer;
}

.form-switch .form-check-input:checked{
background-color: #28a745;
border-color: #28a745;
}

.form-switch .form-check-label{
font-size: .8rem;
color: #495057;
cursor: pointer;
}

.alert-success{
padding: .5rem 1rem;
font-size: .8rem;
animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn{
from{ opacity: 0; }
to{ opacity: 1; }
}

#stopContinuousScan{
margin-top: 10px;
}

#qr-scanner_modal .modal-dialog{
max-width: 500px;
}

#qr-reader-container{
min-height: 300px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
}

#qr-scanner-status{
text-align: center;
}

#qr-scanner-loading{
width: 3rem;
height: 3rem;
}

#qr-scanner-message{
font-size: .9rem;
margin-top: 10px;
}

#item_not_found_modal .modal-dialog{
max-width: 400px;
}

@media (max-width: 576px){
.row.g-2>[class*="col-"]{
margin-bottom: .5rem;
}

.input-group-sm{
margin-bottom: .25rem;
}

.btn-success, .btn-warning, .btn-info{
padding: 8px 12px;
font-size: .9rem;
}

.btn-success.btn-sm{
height: 36px;
}

.added-item-card .form-control-sm{
width: 60px !important;
font-size: .8rem;
}

#qr-scanner_modal .modal-dialog{
margin: 10px;
}

@media (min-width: 576px){
.row.g-2.align-items-end{
align-items: end !important;
}

.input-group-sm{
margin-bottom: 0;
}
}

.dropdown-menu{
z-index: 9999 !important;
}

.received-amount-card, .card, .modal-body{
position: static !important;
}

#received_amount_modal .modal-dialog{
max-width: 600px;
}

#addedReceivedAmountsContainerModal{
max-height: 400px;
overflow-y: auto;
}

.received-amount-card{
border-left: 4px solid #007bff !important;
}

.badge{
font-size: .6rem;
padding: 2px 4px;
}

.bg-warning{
background-color: #ffc107 !important;
color: #000 !important;
}

.bg-danger{
background-color: #dc3545 !important;
color: #fff !important;
}



/* Ensure dropdown works in modal */
.modal {
overflow: visible !important;
}

/* Make modal-xl use full width below Bootstrap's 992px breakpoint */
@media (max-width: 991.98px) {
.modal-xl {
max-width: calc(100% - 1rem);
}
}

/* For mobile dropdowns */
@media (max-width: 768px) {
.item-dropdown .dropdown-item {
padding: 12px 16px;
}

.item-dropdown .dropdown-item img {
width: 50px;
height: 50px;
}

#addItemModal .modal-dialog,
#addItemModal2 .modal-dialog {
margin-top: 70px;
}
}
`;
  document.head.appendChild(style);
 }



 function function2runAfter_O_Login() {
  //location.reload();
 }
 function function2runAfter_P_Login() {
  //location.reload();
 }

 function handl_op_rspons(response, reload = 0) {
  return (async () => {
   try {
    if (response.su == 1) {
     let t3032mp = null;
     if (response.be != null) {
      if (response.be.l != null) {
       const t3776mp = await dbDexieManager.insertToDexie(dbnm, "be", response.be.l, true, ["ea"]);
       reye_msrmnt = response.be.l;
      }
     }
     if (response.ba != null) {
      if (response.ba.l != null) {
       const t3776mp = await dbDexieManager.insertToDexie(dbnm, "ba", response.ba.l, true, ["a"]);
      }
     }
     if (response.i != null) {
      if (response.i.l != null) {
       const t3782mp = await dbDexieManager.insertToDexie(dbnm, "i", response.i.l, true, ["a"]);
       t3032mp = JSON.parse(JSON.stringify(response.i.l));
       ritem_info = JSON.parse(JSON.stringify(response.i.l)); // Deep clone
      }
     }
     if (response.r != null) {
      if (response.r.l != null) {
       const t3782mp = await dbDexieManager.insertToDexie(dbnm, "r", response.r.l, true, ["a"]);
      }
     }
     if (response.c != null) {
      if (response.c.l != null) {
       const t3793mp = await dbDexieManager.insertToDexie(dbnm, "c", response.c.l, true, ["a"]);
      }
     }
     if (response.p != null) {
      if (response.p.l != null) {
       const t3663mp = await dbDexieManager.insertToDexie(dbnm, "p", response.p.l, true, ["a"]);
      }
     }
     if (response.fp != null) {
      if (response.fp.l != null) {
       const t3663mp = await dbDexieManager.insertToDexie(dbnm, "fp", response.fp.l, true, ["a"]);
      }
     }
     if (response.f != null) {
      if (response.f.l != null) {
       const t3663mp = await dbDexieManager.insertToDexie(dbnm, "f", response.f.l, true, ["a"]);
      }
     }
     if (response.b != null) {
      if (response.b.l != null) {
       const t3764mp = await dbDexieManager.insertToDexie(dbnm, "b", response.b.l, true, ["g"]);//chk by index=g because id=a can change but g=bill number creates problem;
       if (t3764mp && t3764mp.success) {
        rbill_info = response.b.l;
       }

       await setMaxBillNo();

      }
     }

     if (response.s != null) {
      if (response.s.l != null) {

       let t_p_mp = await dbDexieManager.getAllRecords(dbnm, "p") || [];
       let t_ba_mp = await dbDexieManager.getAllRecords(dbnm, "ba") || [];
       let t3667mp = response.s.l.map(item => {
        const matchingProd = t_p_mp.find(prod => prod.a === item.g);
        if (matchingProd) {
         item.gn = matchingProd.e;
         item.gu = matchingProd.g;
         item.hu = matchingProd.h;
        } else {
         item.gn = "no name";
         item.gu = "https://cdn-icons-png.freepik.com/512/13543/13543330.png";
         item.hu = "https://cdn-icons-png.freepik.com/512/13543/13543330.png";
        }
        const m_ba_atching = t_ba_mp.find(i3762tm => i3762tm.a === item.f);
        if (m_ba_atching) {
         item.ba_f = m_ba_atching.f;
         item.ba_g = m_ba_atching.g;
        } else {
         item.ba_f = "0000-00-00 00:00:00";
         item.ba_g = "0";
        }
        return item;
       });
       const t3793mp = await dbDexieManager.insertToDexie(dbnm, "s", t3667mp, true, ["a"]);
      }
     }
     if (t3032mp != null) {
      if (window[my1uzr.worknOnPg].confg.calcStock == 1) {
       await update_qty_sold(response);
      }
     }
     items = await dbDexieManager.getAllRecords(dbnm, "s") || [];
     prods = await dbDexieManager.getAllRecords(dbnm, "p") || [];
     stored_bill = await dbDexieManager.getAllRecords(dbnm, "b") || [];
     if (shoEyeMsrmntTbl) stored_eye_msrmnt = await dbDexieManager.getAllRecords(dbnm, "be") || [];
     stored_bill_items = await dbDexieManager.getAllRecords(dbnm, "i") || [];
     stored_bill_cash_info = await dbDexieManager.getAllRecords(dbnm, "r") || [];
     clientReferrerArray = await dbDexieManager.getAllRecords(dbnm, "c") || [];


     // Process bills array to update
     let bills_array_to_update = [];

     // Process items (response.i.l)
     if (response.i && response.i.l && response.i.l.length > 0) {
      // Create unique_by_item_array based on response.i.l.e
      const uniqueItemsByE = [...new Map(response.i.l.map(item => [item.e, item])).values()];

      for (const uniqueItem of uniqueItemsByE) {
       // Find all stored_bill_items with matching e
       const matchingItems = stored_bill_items.filter(item => item.e == uniqueItem.e);

       // Calculate total of stored_bill_items.g
       const i_tot = matchingItems.reduce((sum, item) => {
        return sum + (parseFloat(item.g) || 0);
       }, 0);

       // Find stored_bill with matching a
       const matchingBill = stored_bill.find(bill => bill.a == uniqueItem.e);

       if (matchingBill) {
        // Check if this bill is already in bills_array_to_update
        const existingBillIndex = bills_array_to_update.findIndex(bill => bill.g === matchingBill.g);

        if (existingBillIndex === -1) {
         // Create a copy of the bill with i_tot property
         const billToUpdate = { ...matchingBill, i_tot: i_tot.toFixed(2) };
         bills_array_to_update.push(billToUpdate);
        } else {
         // Update existing entry
         bills_array_to_update[existingBillIndex].i_tot = i_tot.toFixed(2);
        }
       }
      }
     }

     // Process cash info (response.r.l)
     if (response.r && response.r.l && response.r.l.length > 0) {
      // Filter for tb == 7 and create unique array by td
      const rpItems = response.r.l.filter(item => item.tb == 7);
      const uniqueByRpArray = [...new Map(rpItems.map(item => [item.td, item])).values()];

      for (const uniqueRp of uniqueByRpArray) {
       // Find all stored_bill_cash_info with matching tb and td
       const matchingCashInfos = stored_bill_cash_info.filter(info =>
        info.tb == 7 && info.td == uniqueRp.td
       );

       // Calculate total of stored_bill_cash_info.j
       const r_tot = matchingCashInfos.reduce((sum, info) => {
        return sum + (parseFloat(info.j) || 0);
       }, 0);

       // First try to find in bills_array_to_update
       const existingBillIndex = bills_array_to_update.findIndex(bill => bill.a == uniqueRp.td);

       if (existingBillIndex !== -1) {
        // Update existing entry
        bills_array_to_update[existingBillIndex].r_tot = r_tot.toFixed(2);
       } else {
        // Find in stored_bill
        const matchingBill = stored_bill.find(bill => bill.a == uniqueRp.td);

        if (matchingBill) {
         // Check if this bill is already in bills_array_to_update by g
         const existingByGIndex = bills_array_to_update.findIndex(bill => bill.g === matchingBill.g);

         if (existingByGIndex === -1) {
          // Create a copy of the bill with r_tot property
          const billToUpdate = { ...matchingBill, r_tot: r_tot.toFixed(2) };
          bills_array_to_update.push(billToUpdate);
         } else {
          // Update existing entry
          bills_array_to_update[existingByGIndex].r_tot = r_tot.toFixed(2);
         }
        }
       }
      }
     }

     // Ensure uniqueness by g and calculate remaining amount
     if (bills_array_to_update.length > 0) {
      // Create unique array by g
      const uniqueBillsArray = [];
      const seenGValues = new Set();

      for (const bill of bills_array_to_update) {
       if (!seenGValues.has(bill.g)) {
        seenGValues.add(bill.g);
        uniqueBillsArray.push(bill);
       } else {
        // Merge duplicate entries
        const existingIndex = uniqueBillsArray.findIndex(b => b.g === bill.g);
        if (existingIndex !== -1) {
         // Merge i_tot
         if (bill.i_tot) {
          uniqueBillsArray[existingIndex].i_tot = bill.i_tot;
         }
         // Merge r_tot
         if (bill.r_tot) {
          uniqueBillsArray[existingIndex].r_tot = bill.r_tot;
         }
        }
       }
      }

      // Calculate remaining amount for each bill
      for (const bill of uniqueBillsArray) {
       let rTot = parseFloat(bill.r_tot) || 0;
       let iTot = parseFloat(bill.i_tot) || 0;
       let kAmount = parseFloat(bill.k) || 0;

       bill.rem = (iTot - kAmount - rTot).toFixed(2);

       // Ensure i_tot and r_tot are strings with 2 decimal places
       bill.i_tot = (parseFloat(bill.i_tot) || 0).toFixed(2);
       bill.r_tot = (parseFloat(bill.r_tot) || 0).toFixed(2);
      }

      if (uniqueBillsArray.length > 0) {
       const t3574mp = await dbDexieManager.insertToDexie(dbnm, "b", uniqueBillsArray, true, ["g"]);
       stored_bill = await dbDexieManager.getAllRecords(dbnm, "b") || [];
      }
     }
     if (response.fp == null || response.f == null)
      window.showsuccessmodal("stored successfully");

     if (reload == 1) {
      //location.reload();
     }
    } else {
     if (response.ms != null) { window.showelsemodal(response.ms); }
     if (response.fn3 != null) {
      if (response.fn3.r != null) {
       for (let i7 = 0; i7 < response.fn3.r.length; i7++) {
        if (response.fn3.r[i7].ms != null)
         window.showelsemodal(response.fn3.r[i7].ms);
       }
      }
     }
     if (
      response.su == 2 &&
      response.ba != null &&
      response.ba.mx != null
     ) {
      var t55 = parseInt(invoice.hNum.value);
      var t15 = parseInt(response.ba.mx);
      if (t55 > t15) t15 = t55;
      t15 = t15 + 1;
      billAlreadyExistsObject = t15;
      m_odal_msg_tell_bill_exists.innerText =
       "if you want to save with latest bill no, '" +
       t15 +
       "', click button below;";
      m_odal_tell_bill_exists.style.display = "block";
     } else {
      window.showelsemodal(response.ms);
     }
    }
    payload0.go = 0;
   } catch (error) {
    console.error("Initialization failed:", error);
    showToast("Initialization error - please refresh");
   }
  })();
 }
 async function update_qty_sold(resp3206onse) {
  setTimeout(async () => {
   // Calculate total quantity sold for each stock item
   const stockSales = {};

   let t_i_mp = await dbDexieManager.getAllRecords(dbnm, "i") || [];
   let t_s_mp = await dbDexieManager.getAllRecords(dbnm, "s") || [];

   t_i_mp.forEach(soldItem => {
    const stockId = soldItem.f;
    const quantity = soldItem.h;

    if (stockSales[stockId]) {
     stockSales[stockId] += quantity;
    } else {
     stockSales[stockId] = quantity;
    }
   });

   // Add qSold column to stock items, excluding items where d == 111
   t_s_mp.forEach(stockItem => {
    stockItem.qSold = stockSales[stockItem.a] || 0;
    stockItem.qAvlb = stockItem.i - stockItem.qSold;
   });
   const t3025mp = await dbDexieManager.insertToDexie(dbnm, "s", t_s_mp, true, ["a"]);
   console.log('Updated stock items with qSold:', t_s_mp);

  }, 1000); // 1 second delay
 }
 async function setMaxBillNo() {
  var t55 = await getMaxBillNo();
  t55 = parseFloat(t55) + 1;
  localStorage.setItem("lastInvoiNum", t55);
  document.getElementById('invoiceNumber').value = t55;
 }
 async function getMaxBillNo() {
  let arr41 = await dbDexieManager.getAllRecords(dbnm, "b") || [];
  var t4642 = 0;
  if (arr41.length > 0) {
   let maxNum = arr41.reduce(
    (max, item) =>
     parseFloat(item["g"]) > max ? parseFloat(item["g"]) : max,
    arr41[0]["g"]
   );
   // Ensure both dates are valid and compare
   if (maxNum > t4642) t4642 = maxNum;
  }
  return t4642;
 }

 function temporaryAlertFunction(billId) {
  // Implement temporary alert functionality
  console.log('Temporary alert for bill:', billId);
 }

 // Function to verify if item was successfully added to sale list
 function verifyItemAddedToSaleList(itemId) {
  // Get current rate from the matched item
  const matchedItem = items.find(item => item.a == itemId);
  if (!matchedItem) return false;

  const currentRate = parseFloat(matchedItem.k || 0);

  // Check if item exists in sale list with same ID and rate
  const addedItems = document.querySelectorAll('#addedItemsContainer .added-item-card');

  for (const itemCard of addedItems) {
   const cardItemId = itemCard.getAttribute('data-item-id');
   const cardRate = parseFloat(itemCard.getAttribute('data-item-rate') || 0);

   if (cardItemId == itemId && Math.abs(cardRate - currentRate) < 0.01) {
    // Item found in sale list - verify quantity
    const qtyInput = itemCard.querySelector('input[type="number"]');
    const quantity = parseInt(qtyInput.value) || 0;

    if (quantity > 0) {
     return true; // Item successfully added to sale list
    }
   }
  }

  return false; // Item not found in sale list
 }
 function getBillRemarks(billI) {
  if (!billI && billI !== 0) return '';

  try {
   // Try to parse JSON
   const parsed = JSON.parse(billI);

   // Check if it has rmrk property
   if (parsed && typeof parsed === 'object' && 'rmrk' in parsed) {
    return parsed.rmrk || '';
   }

   // If it's an object without rmrk, stringify it
   if (parsed && typeof parsed === 'object') {
    return JSON.stringify(parsed);
   }

   // If it's a string after parsing (unlikely but possible)
   return String(parsed);
  } catch (e) {
   // Not valid JSON, return as string
   return String(billI);
  }
 }
 async function show_client_bills(mono) {
  if (clientReferrerArray.length === 0) {
   clientReferrerArray = await dbDexieManager.getAllRecords(dbnm, "c") || [];
  }

  // Filter to get ALL clients with this mobile number
  const clients = clientReferrerArray.filter(client => client.e.toString() == mono);

  if (clients.length === 0) {
   window.showelsemodal("No clients found with this mobile number");
   return;
  }

  // Create modal
  const modalResult = create_modal_dynamically('clientBillsModal');
  const modalContent = modalResult.contentElement;
  const modalInstance = modalResult.modalInstance;

  let totalOverallDue = 0;
  let hasDueBillsOverall = false;
  let allBillsHTML = "";
  let allClientsBills = [];

  // Process each client
  for (const client of clients) {
   // Get all bills for this client
   const clientBills = stored_bill.filter(bill => bill.e == client.a);

   // Sort bills by date (most recent first)
   clientBills.sort((a, b) => new Date(b.f) - new Date(a.f));

   let clientTotalDue = 0;
   let clientHasDueBills = false;
   let clientBillsHTML = "";

   // Create HTML for each bill of this client
   for (const bill of clientBills) {
    // Parse amounts
    const rem = parseFloat(bill.rem) || 0;
    const iTot = parseFloat(bill.i_tot) || 0;
    const rTot = parseFloat(bill.r_tot) || 0;
    const kAmount = parseFloat(bill.k) || 0;

    clientTotalDue += rem;
    totalOverallDue += rem;

    // Extract date (first 10 characters)
    const billDate = bill.f ? bill.f.substring(0, 10) : "";

    // Determine card color based on due status
    const cardClass = rem === 0 ? "border-success" : "border-danger";

    // Create HTML card for this bill
    clientBillsHTML += `
<div class="card mb-1 ${cardClass}">
<div class="card-body p-2">
<!-- Header row -->
<div class="row align-items-center mb-2">
<!-- Column 1: Bill Number -->
<button type="button" class="col-3 btn btn-primary" style="font-weight: bold; font-size: 125%;" data-bill-action="view" data-bill-id="${bill.a}">${bill.g || ''}</button>

<!-- Column 2: Date -->
<div class="col-4 text-end">
<span class="text-muted">${billDate}</span>
</div>

<!-- Column 3: Due Amount -->
<div class="col-5 text-end">
<span style="font-weight: bold; font-size: 125%; color: ${rem > 0 ? '#dc3545' : '#28a745'}">
₹${rem.toFixed(2)}
</span>
</div>
</div>

<!-- Amount details row -->
<div class="row align-items-center">
<!-- Column 1: Total Amount -->
<div class="col-4">
<small class="text-muted">Total</small><br>
<strong>₹${iTot.toFixed(2)}</strong>
</div>

<!-- Column 2: Discount -->
<div class="col-4 text-center">
<small class="text-muted">Discount</small><br>
<strong>₹${kAmount.toFixed(2)}</strong>
</div>

<!-- Column 3: Received Amount -->
<div class="col-4 text-end">
<small class="text-muted">Received</small><br>
<strong>₹${rTot.toFixed(2)}</strong>
</div>
</div>

<!-- Remarks row (if available) -->
${bill.i ? `
<div class="row mt-2">
<div class="col-12">
<small class="text-muted">Remarks:</small>
<div class="small">${getBillRemarks(bill.i)}</div>
</div>
</div>` : ''}
</div>
</div>`;

    if (rem !== 0) {
     clientHasDueBills = true;
     hasDueBillsOverall = true;
    }
   }

   // Track client's bills for summary
   allClientsBills.push({
    client: client,
    bills: clientBills,
    totalDue: clientTotalDue,
    hasDueBills: clientHasDueBills,
    billsCount: clientBills.length
   });

   // Add client header to the HTML
   if (clientBills.length > 0) {
    const clientName = client.i + "<br>" + client.h || "";
    allBillsHTML += `
<div class="mb-4" style="background-color:brown">
<!-- Client header -->
<div class="card bg-light mb-2">
<div class="card-body py-2">
<div class="row align-items-center">
<div class="col-8">
<h6 class="mb-1">
<strong>${clientName}</strong>
<small class="text-muted d-block">Client ID: ${client.a}</small>
</h6>
</div>
<div class="col-4 text-end">
<div class="fw-bold ${clientTotalDue > 0 ? 'text-danger' : 'text-success'}">
₹${clientTotalDue.toFixed(2)}
</div>
<small class="text-muted">${clientBills.length} bill(s)</small>
</div>
</div>
</div>
</div>

<!-- Client's bills -->
${clientBillsHTML}
</div>
<hr class="my-3">`;
   }
  }

  // Prepare modal content
  const modalHTML = `
<div class="modal-header">
<h5 class="modal-title">
Bills for Mobile: ${mono}
<span class="badge bg-secondary ms-2">${clients.length} client(s)</span>
</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
<!-- Overall summary -->
<div class="alert ${hasDueBillsOverall ? 'alert-warning' : 'alert-success'} p-2 mb-3">
<div class="row align-items-center">
<div class="col-8">
<strong>Mobile: ${mono}</strong><br>
<small class="text-muted">
${clients.length} client(s) • 
${allClientsBills.reduce((sum, cb) => sum + cb.billsCount, 0)} total bills
</small>
</div>
<div class="col-4 text-end">
<div style="font-weight: bold; font-size: 150%; color: ${totalOverallDue > 0 ? '#dc3545' : '#28a745'}">
₹${totalOverallDue.toFixed(2)}
</div>
<small>Total ${totalOverallDue > 0 ? 'Due' : 'Balance'}</small>
</div>
</div>
</div>

<!-- Clients list summary -->
<div class="mb-3">
<div class="row row-cols-1 row-cols-md-2 g-2" style="background-color:aquamarine">
${allClientsBills.map(clientData => {
   const clientName = clientData.client.i + "<br>" + clientData.client.h || "";
   const statusClass = clientData.hasDueBills ? 'bg-danger' : 'bg-success';
   const statusText = clientData.hasDueBills ? 'Has Due' : 'All Paid';

   return `
<div class="col">
<div class="card h-100">
<div class="card-body p-2">
<div class="row align-items-center">
<div class="col-8">
<small class="fw-bold">${clientName}</small><br>
<small class="text-muted">ID: ${clientData.client.a}</small>
</div>
<div class="col-4 text-end">
<div class="fw-bold ${clientData.totalDue > 0 ? 'text-danger' : 'text-success'}">
₹${clientData.totalDue.toFixed(2)}
</div>
<small class="badge ${statusClass}">${statusText}</small>
</div>
</div>
</div>
</div>
</div>`;
  }).join('')}
</div>
</div>

<!-- All bills -->
${allClientsBills.reduce((sum, cb) => sum + cb.billsCount, 0) > 0 ? allBillsHTML :
    '<div class="alert alert-info text-center">No bills found for any client with this mobile number</div>'}
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
${hasDueBillsOverall ?
    `<button type="button" class="btn btn-primary" onclick="sendPaymentReminder('${mono}', '${clients.map(c => c.i).join(", ")}')">
<i class="fas fa-bell me-1"></i> Send Reminder to All
</button>` : ''}
</div>`;

  // Set modal content
  modalContent.innerHTML = modalHTML;

  modalContent.addEventListener('click', function (e) {
   const billActionElement = e.target.closest('[data-bill-action]');
   if (billActionElement) {
    const action = billActionElement.getAttribute('data-bill-action');
    const billId = billActionElement.getAttribute('data-bill-id');

    // Call your handler with modalInstance
    handleBillAction(modalInstance, action, billId);
   }
  });

  // Show the modal
  modalInstance.show();
  // Return modal instance for further control
  return modalInstance;
 }

 function sendPaymentReminder(mobile, clientName) {
  const cleanMobile = mobile.replace(/[^\d+]/g, '');
  const message = `Payment Reminder: Dear ${clientName}, you have pending bills. Please make the payment at your earliest convenience.`;
  window.open(`https://wa.me/${cleanMobile}?text=${encodeURIComponent(message)}`, '_blank');
  // For SMS integration:
  // window.open(`sms:${mobile}?body=${encodeURIComponent(message)}`, '_blank');
 }
 function setDefaRmrk() {
  const modal = create_modal_dynamically('defaultRemarkModal');
  const modalContent = modal.contentElement;
  const modalInstance = modal.modalInstance;

  // Get existing default remark from localStorage
  const existingRemark = localStorage.getItem('defaultBillRemark') || '';

  // Set modal content
  modalContent.innerHTML = `
<div class="modal-header">
<h5 class="modal-title">Set Default Bill Remark</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body">
<div class="mb-3">
<label for="defaultRemarkInput" class="form-label">Default Remark:</label>
<textarea class="form-control" id="defaultRemarkInput" rows="4" placeholder="Enter default remark to be auto-filled for all new bills...">${existingRemark}</textarea>
</div>
<div class="form-text">
This remark will be automatically filled in the bill notes section for new bills.
</div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
<button type="button" class="btn btn-primary" onclick="saveDefaultRemark()">Save Default Remark</button>
</div>
`;

  modalInstance.show();
 }

 function saveDefaultRemark() {
  const remarkInput = document.getElementById('defaultRemarkInput');
  const remark = remarkInput.value.trim();

  // Save to localStorage
  localStorage.setItem('defaultBillRemark', remark);

  // Close the modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('defaultRemarkModal'));
  if (modal) {
   modal.hide();
  }

  // Show success message
  showToast('Default remark saved successfully!');
 }
 function checkChangeInSoldItems() {
  try {
   // Get current bill ID
   if (!billTableRowId || billTableRowId <= 0) {
    console.log('No bill selected for update');
    return false;
   }

   // Find the original bill
   const originalBill = stored_bill.find(bill => bill.a == billTableRowId);
   if (!originalBill) {
    console.log('Original bill not found');
    return true; // If can't find original, assume changes exist
   }

   // ========== CHECK 1: Bill-level fields ==========

   // Check bill notes/remarks
   const currentNotes = document.getElementById('billNotes')?.value?.trim() || '';
   const originalNotes = originalBill.i || '';
   if (currentNotes !== originalNotes) {
    console.log('Bill notes changed:', originalNotes, '→', currentNotes);
    return true;
   }

   // Check discount amount
   const currentDiscount = document.getElementById('discountAmount')?.value || '0';
   const originalDiscount = originalBill.k?.toString() || '0';
   if (parseFloat(currentDiscount) !== parseFloat(originalDiscount)) {
    console.log('Discount changed:', originalDiscount, '→', currentDiscount);
    return true;
   }

   // Check invoice number
   const currentInvoice = document.getElementById('invoiceNumber')?.value?.trim() || '';
   const originalInvoice = originalBill.g?.toString() || '';
   if (currentInvoice !== originalInvoice) {
    console.log('Invoice number changed:', originalInvoice, '→', currentInvoice);
    return true;
   }

   // Check client ID
   const currentClientId = document.getElementById('clientId')?.value || '';
   const originalClientId = originalBill.e?.toString() || '';
   if (currentClientId !== originalClientId) {
    console.log('Client changed:', originalClientId, '→', currentClientId);
    return true;
   }

   // Check referrer ID
   const currentReferrerId = document.getElementById('referrerId')?.value || '0';
   const originalReferrerId = originalBill.l?.toString() || '0';
   if (currentReferrerId !== originalReferrerId) {
    console.log('Referrer changed:', originalReferrerId, '→', currentReferrerId);
    return true;
   }

   // ========== CHECK 2: Bill items ==========

   // Get the current bill items from stored data
   const storedBillItems = stored_bill_items.filter(item => item.e == billTableRowId);

   // Get current items from the form
   const currentItems = getCurrentFormItems();

   // If number of items changed
   if (storedBillItems.length !== currentItems.length) {
    console.log('Number of items changed:', storedBillItems.length, '→', currentItems.length);
    return true;
   }

   // Create a map of stored items by item ID for easy comparison
   const storedItemsMap = new Map();
   storedBillItems.forEach(item => {
    const key = `${item.f}_${item.g}`; // item ID + price
    storedItemsMap.set(key, {
     id: item.f,
     quantity: parseFloat(item.h) || 0,
     price: parseFloat(item.g) || 0,
     description: item.i || '',
     originalItem: item
    });
   });

   // Check each current item against stored items
   for (const currentItem of currentItems) {
    const key = `${currentItem.itemId}_${currentItem.price}`;

    if (!storedItemsMap.has(key)) {
     // Item with this ID and price doesn't exist in stored items
     console.log('New item found or price changed:', currentItem);
     return true;
    }

    const storedItem = storedItemsMap.get(key);

    // Compare quantity
    if (Math.abs(storedItem.quantity - currentItem.quantity) > 0.01) {
     console.log('Quantity changed:', storedItem.quantity, '→', currentItem.quantity);
     return true;
    }

    // Compare description
    if (storedItem.description !== currentItem.description) {
     console.log('Description changed:', storedItem.description, '→', currentItem.description);
     return true;
    }

    // Remove from map to track unmatched items
    storedItemsMap.delete(key);
   }

   // If there are items left in storedItemsMap, they were removed from the form
   if (storedItemsMap.size > 0) {
    console.log('Items removed from form:', Array.from(storedItemsMap.keys()));
    return true;
   }

   // ========== CHECK 3: Eye measurements (if applicable) ==========
   if (typeof billingRequisit_be === 'function' && typeof getEyeMeasurement === 'function' && shoEyeMsrmntTbl) {
    const currentEyeMeasurement = getEyeMeasurement();
    const originalEyeMeasurement = stored_eye_msrmnt.find(eye => eye.ea == billTableRowId) || null;

    // If one has measurement and other doesn't
    if ((currentEyeMeasurement === null) !== (originalEyeMeasurement === null)) {
     console.log('Eye measurement presence changed');
     return true;
    }

    // If both have measurements, compare them
    if (currentEyeMeasurement !== null && originalEyeMeasurement !== null) {
     // Compare key fields of eye measurement
     const fieldsToCheck = ['eb', 'ec', 'ed', 'ee', 'ef', 'eg', 'eh', 'ei', 'ej'];
     for (const field of fieldsToCheck) {
      const currentVal = currentEyeMeasurement[field] || '';
      const originalVal = originalEyeMeasurement[field] || '';
      if (String(currentVal) !== String(originalVal)) {
       console.log(`Eye measurement field ${field} changed:`, originalVal, '→', currentVal);
       return true;
      }
     }
    }
   }

   // ========== CHECK 4: Received payments ==========
   // Get original payments for this bill
   const originalPayments = stored_bill_cash_info.filter(cash => cash.tb == 7 && cash.td == billTableRowId);

   // Compare number of payments
   if (receivedAmounts.length !== originalPayments.length) {
    console.log('Number of payments changed:', originalPayments.length, '→', receivedAmounts.length);
    return true;
   }

   // Compare each payment
   for (let i = 0; i < receivedAmounts.length; i++) {
    const currentPayment = receivedAmounts[i];
    const originalPayment = originalPayments[i];

    if (!originalPayment) {
     console.log('New payment added');
     return true;
    }

    // Compare amount
    if (Math.abs(parseFloat(currentPayment.amount) - parseFloat(originalPayment.j || 0)) > 0.01) {
     console.log('Payment amount changed');
     return true;
    }

    // Compare payment type
    if (String(currentPayment.paymentType) !== String(originalPayment.i || '0')) {
     console.log('Payment type changed');
     return true;
    }

    // Compare date
    const currentDate = currentPayment.dateTime?.split(' ')[0] || '';
    const originalDate = originalPayment.k || '';
    if (currentDate !== originalDate) {
     console.log('Payment date changed');
     return true;
    }
   }

   console.log('No changes detected in bill');
   return false;

  } catch (error) {
   console.error('Error checking changes in sold items:', error);
   // In case of error, assume there are changes to be safe
   return true;
  }
 }
 function getCurrentFormItems() {
  const currentItems = [];
  const addedItems = document.querySelectorAll('#addedItemsContainer .added-item-card');

  addedItems.forEach(item => {
   try {
    const itemId = item.getAttribute('data-item-id') || '';
    const qtyInput = item.querySelector('input[type="number"]');
    const rateInput = item.querySelectorAll('input[type="number"]')[1];
    const priceElement = item.querySelector('span[id^="itemPrice-"]');
    const descriptionElement = item.querySelector('.text-muted');

    const quantity = parseFloat(qtyInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const price = parseFloat(priceElement.textContent) || 0;
    const description = descriptionElement?.textContent || '';

    currentItems.push({
     itemId: itemId,
     quantity: quantity,
     rate: rate,
     price: price,
     description: description
    });
   } catch (error) {
    console.error('Error parsing item:', error);
   }
  });

  return currentItems;
 }

 function formatNameMobile(i, h, e) {
  const name = `${i || ''} ${h || ''}`.trim();
  const mobile = e || '';
  return name ? (mobile ? `${name} ${mobile}` : name) : mobile;
 }

 function commonFnToRunAfter_op_ViewCall(obj, swtch) {
  if (swtch === 1) {
   // Set values to client
   document.getElementById('c_dtls_lient').value = formatNameMobile(obj.i, obj.h, obj.e);
   document.getElementById('clientId').value = obj.a;
   document.getElementById('dv_for_add_itm_btn').style.display = "block";
  } else if (swtch === 2) {
   // Set values to referrer
   document.getElementById('r_dtls_eferrer').value = formatNameMobile(obj.i, obj.h, obj.e);
   document.getElementById('referrerId').value = obj.a;
  }
 }

 function updateBillSectionsVisibility() {
  const addedItemsContainer = document.getElementById('addedItemsContainer');
  const itemsSummaryRow = document.getElementById('itemsSummaryRow');
  const receivedAmountsSection = document.getElementById('rcvd_amts_dv');
  const blankDivSection1 = document.querySelector('#blankDivSection1')?.closest('.row');

  const hasItems = addedItemsContainer && addedItemsContainer.children.length > 0;

  // Show/hide Add Item button when a customer is selected
  const addItemBtn = document.getElementById('dv_for_add_itm_btn');
  const hasClient = !!(document.getElementById('clientId')?.value);
  if (addItemBtn) {
   addItemBtn.style.display = hasClient ? 'block' : 'none';
  }

  // Show/hide items summary section
  if (itemsSummaryRow) {
   itemsSummaryRow.style.display = hasItems ? 'flex' : 'none';
  }

  // Show/hide received amounts section
  if (receivedAmountsSection) {
   receivedAmountsSection.style.display = hasItems ? 'block' : 'none';
  }

  // Show/hide blank div section
  if (blankDivSection1) {
   blankDivSection1.style.display = (!shoEyeMsrmntTbl || hasItems) ? 'block' : 'none';
  }

  // Safety net: refresh grand totals whenever item visibility changes
  // (called by the #addedItemsContainer MutationObserver on every item
  // add/remove/qty/rate change), so Total / Total Due always stay in sync.
  try {
   refreshGrandTotals();
  } catch (e) {
   console.warn('updateBillSectionsVisibility: refreshGrandTotals failed', e);
  }
 }
 // Helper function to check if a payment already exists in receivedAmounts array
 function checkDuplicateInReceivedAmounts(clientId, amount, date, paymentType = '0', constraintCounter = 0) {
  return receivedAmounts.some(payment => {
   const paymentDate = payment.dateTime.split(' ')[0]; // Extract date part
   const paymentAmount = parseFloat(payment.amount) || 0;
   const paymentClientId = parseInt(document.getElementById('clientId').value) || 0;
   const paymentConstraint = payment.constraintCounter || 0;

   return paymentClientId === clientId &&
    Math.abs(paymentAmount - amount) < 0.001 &&
    paymentDate === date &&
    payment.paymentType === paymentType &&
    paymentConstraint === constraintCounter;
  });
 }

 // Helper function to check if a payment exists in stored_bill_cash_info
 function checkDuplicateInStoredCashInfo(clientId, amount, date, paymentType = '0', constraintCounter = 0) {
  return stored_bill_cash_info.some(payment => {
   // Filter only payments for the current bill if we're in bill context
   if (billTableRowId && payment.td !== billTableRowId) {
    return false;
   }

   const paymentAmount = parseFloat(payment.j) || 0;
   const paymentDate = payment.k || '';
   const paymentTypeInt = parseInt(payment.i) || 0;

   return payment.f === 0 &&
    payment.h === clientId &&
    Math.abs(paymentAmount - amount) < 0.001 &&
    paymentDate === date &&
    paymentTypeInt === parseInt(paymentType) &&
    (payment.n || 0) === constraintCounter;
  });
 }

 // Helper function to get next constraint counter
 function getNextConstraintCounter(clientId, amount, date, paymentType = '0') {
  let maxCounter = 0;

  // Check in receivedAmounts array
  receivedAmounts.forEach(payment => {
   const paymentDate = payment.dateTime.split(' ')[0];
   const paymentAmount = parseFloat(payment.amount) || 0;
   const paymentClientId = parseInt(document.getElementById('clientId').value) || 0;

   if (paymentClientId === clientId &&
    Math.abs(paymentAmount - amount) < 0.001 &&
    paymentDate === date &&
    payment.paymentType === paymentType) {
    maxCounter = Math.max(maxCounter, payment.constraintCounter || 0);
   }
  });

  // Check in stored_bill_cash_info
  stored_bill_cash_info.forEach(payment => {
   // Only check payments for current bill if we're in bill context
   if (billTableRowId && payment.td !== billTableRowId) {
    return;
   }

   const paymentAmount = parseFloat(payment.j) || 0;
   const paymentDate = payment.k || '';
   const paymentTypeInt = parseInt(payment.i) || 0;

   if (payment.f === 0 &&
    payment.h === clientId &&
    Math.abs(paymentAmount - amount) < 0.001 &&
    paymentDate === date &&
    paymentTypeInt === parseInt(paymentType)) {
    maxCounter = Math.max(maxCounter, payment.n || 0);
   }
  });

  return maxCounter + 1;
 }
 /*async function validatePaymentUniqueness(clientId, amount, dateTime, paymentType = '0') {
 const paymentDate = dateTime.split(' ')[0]; // Get only YYYY-MM-DD part
 const paymentTypeInt = parseInt(paymentType) || 0;
 
 // DEBUG: Log what we're checking
 console.log('Validating payment uniqueness:', {
 clientId,
 amount,
 dateTime,
 paymentDate,
 paymentType
 });
 
 // Arrays to collect matching payments (ONLY same date)
 const matchingPayments = [];
 
 // Check in receivedAmounts (pending payments) - ONLY for same date
 receivedAmounts.forEach(payment => {
 const paymentDatePart = payment.dateTime.split(' ')[0]; // Get only date part
 const paymentAmount = parseFloat(payment.amount) || 0;
 const paymentClientId = parseInt(payment.clientId) || 0;
 const paymentTypeVal = payment.paymentType || '0';
 
 // Check if same date, amount, client, and payment type
 if (paymentClientId === clientId &&
 Math.abs(paymentAmount - amount) < 0.001 &&
 paymentDatePart === paymentDate && // IMPORTANT: Same date
 paymentTypeVal === paymentType) {
 matchingPayments.push({
 constraintCounter: payment.constraintCounter || 0,
 date: paymentDatePart,
 source: 'pending'
 });
 
 console.log('Found matching pending payment:', {
 date: paymentDatePart,
 amount: paymentAmount,
 constraintCounter: payment.constraintCounter || 0
 });
 }
 });
 
 // Check in stored_bill_cash_info (saved payments) for this client - ONLY for same date
 stored_bill_cash_info.forEach(payment => {
 // Only check payments for current client
 if (payment.h !== clientId) return;
 
 const paymentAmount = parseFloat(payment.j) || 0;
 const paymentDatePart = payment.k || ''; // Already just date
 const paymentTypeVal = payment.i || '0';
 
 // Check if same date, amount, client, and payment type
 if (payment.f === 0 &&
 Math.abs(paymentAmount - amount) < 0.001 &&
 paymentDatePart === paymentDate && // IMPORTANT: Same date
 parseInt(paymentTypeVal) === paymentTypeInt) {
 matchingPayments.push({
 constraintCounter: payment.n || 0,
 date: paymentDatePart,
 source: 'saved'
 });
 
 console.log('Found matching saved payment:', {
 date: paymentDatePart,
 amount: paymentAmount,
 constraintCounter: payment.n || 0
 });
 }
 });
 
 console.log('Total matching payments for date', paymentDate + ':', matchingPayments.length);
 
 if (matchingPayments.length === 0) {
 // No matching payments for this date
 console.log('No matching payments found for date', paymentDate);
 return {
 isDuplicate: false,
 existingConstraint: 0,
 nextConstraint: 1, // First payment on this date gets constraint 1
 location: 'none',
 matchingCount: 0
 };
 }
 
 // Find all constraint counters for this specific date
 const constraintCounters = matchingPayments.map(p => p.constraintCounter || 0);
 const maxCounter = Math.max(...constraintCounters);
 
 console.log('Constraint counters for date', paymentDate + ':', constraintCounters);
 console.log('Max constraint counter:', maxCounter);
 
 return {
 isDuplicate: matchingPayments.length > 0,
 existingConstraint: maxCounter,
 nextConstraint: maxCounter + 1, // Next available constraint counter for this date
 location: 'mixed',
 matchingCount: matchingPayments.length
 };
 }*/
 async function validatePaymentUniqueness(clientId, amount, dateTime) {
  const paymentDate = dateTime.split(' ')[0]; // Get only YYYY-MM-DD part

  // DEBUG: Log what we're checking
  console.log('Validating payment uniqueness:', {
   clientId,
   amount,
   dateTime,
   paymentDate
  });

  // Arrays to collect matching payments (ONLY same date)
  const matchingPayments = [];

  // Check in receivedAmounts (pending payments) - ONLY for same date
  receivedAmounts.forEach(payment => {
   const paymentDatePart = payment.dateTime.split(' ')[0]; // Get only date part
   const paymentAmount = parseFloat(payment.amount) || 0;
   const paymentClientId = parseInt(payment.clientId) || 0;

   // Check if same date, amount, and client (payment type removed)
   if (paymentClientId === clientId &&
    Math.abs(paymentAmount - amount) < 0.001 &&
    paymentDatePart === paymentDate) { // IMPORTANT: Same date
    matchingPayments.push({
     constraintCounter: payment.constraintCounter || 0,
     date: paymentDatePart,
     source: 'pending'
    });

    console.log('Found matching pending payment:', {
     date: paymentDatePart,
     amount: paymentAmount,
     constraintCounter: payment.constraintCounter || 0
    });
   }
  });

  // Check in stored_bill_cash_info (saved payments) for this client - ONLY for same date
  stored_bill_cash_info.forEach(payment => {
   // Only check payments for current client
   if (payment.h !== clientId) return;

   const paymentAmount = parseFloat(payment.j) || 0;
   const paymentDatePart = payment.k || ''; // Already just date

   // Check if same date, amount, client (payment type removed, f=0 always)
   if (payment.f === 0 && // Always require f = 0
    Math.abs(paymentAmount - amount) < 0.001 &&
    paymentDatePart === paymentDate) { // IMPORTANT: Same date
    matchingPayments.push({
     constraintCounter: payment.n || 0,
     date: paymentDatePart,
     source: 'saved'
    });

    console.log('Found matching saved payment:', {
     date: paymentDatePart,
     amount: paymentAmount,
     constraintCounter: payment.n || 0
    });
   }
  });

  console.log('Total matching payments for date', paymentDate + ':', matchingPayments.length);

  if (matchingPayments.length === 0) {
   // No matching payments for this date
   console.log('No matching payments found for date', paymentDate);
   return {
    isDuplicate: false,
    existingConstraint: 0,
    nextConstraint: 1, // First payment on this date gets constraint 1
    location: 'none',
    matchingCount: 0
   };
  }

  // Find all constraint counters for this specific date
  const constraintCounters = matchingPayments.map(p => p.constraintCounter || 0);
  const maxCounter = Math.max(...constraintCounters);

  console.log('Constraint counters for date', paymentDate + ':', constraintCounters);
  console.log('Max constraint counter:', maxCounter);

  return {
   isDuplicate: matchingPayments.length > 0,
   existingConstraint: maxCounter,
   nextConstraint: maxCounter + 1, // Next available constraint counter for this date
   location: 'mixed',
   matchingCount: matchingPayments.length
  };
 }
 function shouldShowConstraintCounter(clientId, amount, dateTime, paymentType = '0') {
  const paymentDate = dateTime.split(' ')[0];

  // Check if there are any other payments with same amount on same date
  let hasSameDatePayments = false;

  // Check in receivedAmounts
  receivedAmounts.forEach(payment => {
   const paymentDatePart = payment.dateTime.split(' ')[0];
   const paymentAmount = parseFloat(payment.amount) || 0;
   const paymentClientId = parseInt(payment.clientId) || 0;

   if (paymentClientId === clientId &&
    Math.abs(paymentAmount - amount) < 0.001 &&
    paymentDatePart === paymentDate) {
    hasSameDatePayments = true;
   }
  });

  // Check in stored_bill_cash_info
  stored_bill_cash_info.forEach(payment => {
   const paymentDatePart = payment.k || '';
   const paymentAmount = parseFloat(payment.j) || 0;

   if (payment.f === 0 &&
    payment.h === clientId &&
    Math.abs(paymentAmount - amount) < 0.001 &&
    paymentDatePart === paymentDate) {
    hasSameDatePayments = true;
   }
  });

  return hasSameDatePayments;
 }
 // Add this function near the top with other helper functions
 function getConstraintCounterColor(counter) {
  const colorMap = {
   0: 'secondary',    // Counter 0
   1: 'primary',      // Counter 1
   2: 'success',      // Counter 2
   3: 'warning',      // Counter 3
   4: 'danger',       // Counter 4
  };
  return colorMap[counter] || 'info'; // Default for counters > 4
 }

 window.showelsemodal = window.showelsemodal;
 window.closeModal = window.closeModal;
 window.set_bill_innerHTML = set_bill_innerHTML;
 window.showAddItemModal = showAddItemModal;
 window.handleAddNewItemInModal = handleAddNewItemInModal;
 window.handleNewItmAddedToInventory = handleNewItmAddedToInventory;
 window.addItemFromModal = addItemFromModal;
 window.selectModalItem = selectModalItem;
 window.showBillCards = showBillCards;
 window.handleBillAction = handleBillAction;
 window.sho_bl_modal = sho_bl_modal;
 window.showAlreadyReceivedAmts = showAlreadyReceivedAmts;
 window.submitAllPayments = submitAllPayments;
 window.updateBillPayments = updateBillPayments;
 window.addNewReceivedAmount = addNewReceivedAmount;
 window.updateNewPaymentsUI = updateNewPaymentsUI;
 window.removeNewUpdatePayment = removeNewUpdatePayment;
 window.updateGrandTotalsForUpdate = updateGrandTotalsForUpdate;
 window.updatePaymentTypeIcon = updatePaymentTypeIcon;
 window.updatePayment = updatePayment;
 window.validateAndUpdatePayment = validateAndUpdatePayment;
 window.handleItemNotFoundYes = handleItemNotFoundYes;
 window.handleItemNotFoundNo = handleItemNotFoundNo;
 window.addReceivedAmount = addReceivedAmount;
 window.addTempReceivedAmount = addTempReceivedAmount;
 window.removeTempPayment = removeTempPayment;
 window.removeReceivedAmount = removeReceivedAmount;
 window.removeItemFromInvoice = removeItemFromInvoice;
 window.updateItemQuantity = updateItemQuantity;
 window.updateItemRate = updateItemRate;
 window.updateBillSummary = updateBillSummary;
 window.updateBillSectionsVisibility = updateBillSectionsVisibility;
 window.updateGrandTotals = updateGrandTotals;
 window.calculateBillSummary = calculateBillSummary;
 window.calculateDiscountFromPercentage = calculateDiscountFromPercentage;
 window.calculateDiscountFromAmount = calculateDiscountFromAmount;
 window.crUpBill = crUpBill;
 window.delBillByID = delBillByID;
 window.show_client_bills = show_client_bills;
 window.showAlreadyReceivedAmts = showAlreadyReceivedAmts;
 window.setDefaRmrk = setDefaRmrk;
 window.saveDefaultRemark = saveDefaultRemark;
 window.sendPaymentReminder = sendPaymentReminder;
 window.temporary = temporary;
 window.temporaryAlertFunction = temporaryAlertFunction;
 window.showToast = showToast;
 window.playSound = playSound;
 window.checkChangeInSoldItems = checkChangeInSoldItems;
 window.getCurrentFormItems = getCurrentFormItems;
 window.showItemDropdown = showItemDropdown;
 window.addItemDirectlyFromQR = addItemDirectlyFromQR;
 window.handl_op_rspons = handl_op_rspons;
 window.commonFnToRunAfter_op_ViewCall = commonFnToRunAfter_op_ViewCall;
 window.function2runAfter_O_Login = function2runAfter_O_Login;
 window.function2runAfter_P_Login = function2runAfter_P_Login;
 window.handleUploadedFile = handleUploadedFile;

})();