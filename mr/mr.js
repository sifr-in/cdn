(function(){function u(){try{var btn=document.querySelector(".app-nav__actions button[onclick*=`loadExe2Fn(12`]");if(!btn)return;var wk=window[window.my1uzr&&window.my1uzr.worknOnPg];var has=false;if(wk&&wk.activeFilters){var f=wk.activeFilters;for(var k in f){if(!Object.prototype.hasOwnProperty.call(f,k))continue;var v=f[k];if(v===""||v==null||v===undefined)continue;if(Array.isArray(v)){if(v.length>0){has=true;break;}}else if(typeof v==="object"&&v!==null){if(Object.keys(v).length>0){has=true;break;}}else{has=true;break;}}}var b=document.getElementById("filterActiveBadge");if(has){if(!b){b=document.createElement("span");b.id="filterActiveBadge";b.className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger";b.style.cssText="font-size:9px;padding:2px 6px;z-index:5;";b.textContent="•";btn.style.position="relative";btn.appendChild(b);}}else if(b){b.remove();}}catch(e){}}window.__mrUpdateFilterBadge=u;setInterval(u,1000);setTimeout(u,500);})();
(function(){try{if(!document.getElementById('mr-global-fix')){var st=document.createElement('style');st.id='mr-global-fix';st.textContent='html,body{overflow-x:hidden;max-width:100%;width:100%;} .container,.container-fluid{max-width:100%;} .row{margin-left:0;margin-right:0;} [class^=col-]{max-width:100%;} .table-responsive{overflow-x:auto;max-width:100%;}';document.head.appendChild(st);}}catch(e){}})();
const tblsRequired = ["f", "fp", "ma", "mr", "c", "mp"];
const moduLst = [
 { a: ",60,61,65", b: "Dashboard", c: "fa-chart-line", d: "aminPnl", e: "#9c6f7fea", cid: 130 }
];

const inTbls = ["dontCret~", "pubilc~", "60~mr,c", "61~mp", "2/f-62~mr", "63~mr", "64~mr", "65~mp", "66~mu,mr,ma", "2/h-67~mr", "2/c-68~mr", "2/c-69~mr", "70~mr"];
const cust_const = [];// { "a": "paymentGatewayIntegrated", "b": 0, "c": "more customiztaion", "d": "if value is 1 payment gatewy will be shown, else manual booking", "u": "url-explaining-video" },
moduLst.hook = "onModuLstAllowed2";
window[my1uzr.worknOnPg].moduLst = moduLst;
window[my1uzr.worknOnPg].onModuLstAllowed2 = function (allowedModules) {
 window[my1uzr.worknOnPg].allowedModulesMenuItems = allowedModules || [];
};

/* ==========================================================================================
 * SHARED INIT - single copy, used by BOTH the public and the admin app.
 * Everything that used to be declared twice (once per branch) lives here exactly once.
 * Only values that genuinely differ per app live in MR_MODE_CFG below.
 * ========================================================================================== */
//shared constants
const sho_da_tkLimit = 1;
let appData = {};
const ids_of_views = [3];
let tblFailureCount = 1;
const cacheVersion = 1763390987;
const cacheStrategy = 1;
const dontShoLoginConfirmation = 1;
const dontRestartAfterLogin = 1;
let profilesData = [];//the PUBLIC card list. the admin's DataTable uses adminProfilesData.

//TEMP DIAGNOSTIC (card list not rendering) - remove once cards render again.
//One greppable line per stage: [mr-diag]. Reports the row count, whether the grid
//exists, how many cards reached the DOM, and - once attached - the first card's
//computed box, so "no cards" and "cards present but invisible" cannot be confused.
function __mrCardDiag(stage, extra) {
  try {
   const grid = document.getElementById('profiles-container');
   const card = grid ? grid.querySelector('[data-profile-id]') : null;
   let vis = 'no-card-in-dom';
   if (card) {
    const cs = getComputedStyle(card);
    const r = card.getBoundingClientRect();
    vis = 'display=' + cs.display + ' opacity=' + cs.opacity
     + ' visibility=' + cs.visibility + ' anim=' + cs.animationName
     + ' box=' + Math.round(r.width) + 'x' + Math.round(r.height);
   }
   console.log('[mr-diag] ' + stage + ' | ' + extra
    + ' | profilesData=' + (Array.isArray(profilesData) ? profilesData.length : 'UNDEF')
    + ' | grid=' + (grid ? 'found' : 'NOT-IN-DOC')
    + ' | cards=' + (grid ? grid.querySelectorAll('[data-profile-id]').length : 0)
    + ' | firstCard[' + vis + ']');
  } catch (e) {
   console.log('[mr-diag] ' + stage + ' threw: ' + (e && e.message ? e.message : e));
  }
}

//shared window[my1uzr.worknOnPg] settings
//(assigned before MR_MODE_CFG because the vlidFn62_63 literal reads bdayFormat, as it always did)
window[my1uzr.worknOnPg].flsht = 3;
window[my1uzr.worknOnPg].lodErrMs = "press back back & open the app again;";
window[my1uzr.worknOnPg].emptBodyMs = "welcome to 'sifr' matrimoney app;";
window[my1uzr.worknOnPg].cardHeight = 60;
window[my1uzr.worknOnPg].nonEditableFields = ['a', 'b', 'c', 'k', 'k1'];
window[my1uzr.worknOnPg].defaFieldVals = ['k~13', 'k1~9'];
window[my1uzr.worknOnPg].seqnce = "u,ut,b6,a5,l,a7,m,n";
window[my1uzr.worknOnPg].bdayFormat = "dd-mm-yyyy";
//driveMl / thumbnailSize / thumbnailSizeBy come from mr.da and are applied by

//per-app values; both literals are kept verbatim - nothing here is generated.
//keyed by app now (was: `MR_IS_ADMIN ? {admin} : {public}`) because BOTH apps live on
//one page, so the settings are swapped around each app's work - see __mrWithFlowSettings.
const MR_MODE_CFG = {
 admin: {
  usdInAndroWv: 1, //1 = used in android web view;, this will load back button handling for android
  colsToHide: "a,a1,a2,a3,a4,a6,a7,a8,a9,b,b1,b5,b9,c,c1,c3,c5,c6,c7,c8,c9,d2,f,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,k1,k2,ma,na,oa,pa,t,ut,v,x1,x3,x4,x5,z",
  colsToSubmit: "a7,u,b6,l,m,n,d,e,f,g,h,i,j,k,k1,o,p,q,qa,qb,qc,r,s,va,x,z,a1,a2,a3,a5,a8,a9,b1,b4,b5,c2,c5,c6,d1,x2",
  flshu: "/91.9823425404/z/mr/sambodhi-sarang-matrimony-flash.jpeg",
  driveFolderIdForOriginalFile: "18_axqbA4fQaE1X0m0lurfEekS8Mdx6gF",
  driveFolderIdForThumbnailFile: "1fp8zaSDqDJSgghApRAU5D7492Frxse4l",
  fieldNameMap: { "a": "Id", "w": "unique ID", "b": "Recorded", "c": "fn no", "d": "Status;", "e": "Mobile of registering customer", "f": "Constraint no.;", "g": "Birth date & time;", "h": "Height in feet . inch;", "i": "Package in lakhs;", "j": "Marital status", "k": "Religious", "k1": "caste;", "k2": "sub caste / type;", "l": "Contact no. to display", "m": "First name in eng;", "n": "Surname in eng;", "o": "Father's name in eng;", "p": "Mother's name in eng;", "ma": "name lolng;", "na": "surname lolng;", "oa": "fa name lolng;", "pa": "no name lolng;", "q": "Job type", "qa": "Designation / Position;", "qb": "Business form;", "qc": "Business type;", "r": "Education 10th, 12th, 15th, 17th", "s": "Degrees;", "t": "Qualifications e.g. Sci, Com, Be, M.tech, ...", "u": "DP Display Picture;", "ut": "Thumbnail;", "v": "relative surnames (comma separated) eng;", "va": "Relative surnames (comma separated);", "x": "Siblings;", "z": "Blood group", "a1": "Weight (kg);", "a2": "City currently working in;", "a3": "Country currently working in;", "a4": "Diet", "a5": "Gender Male female", "a6": "Skin color", "a7": "Above no. is of:", "a8": "No. of own Home / shop", "a9": "Languages known", "b1": "No. of own Vehicle", "b4": "Native city", "b5": "Native country", "b6": "Image Gallery", "b9": "Drinking habit", "c2": "Physically challenged", "c3": "lives with family 1=yes, 2=no;", "c5": "Current residential Country", "c6": "Current residential City;", "c7": "Free profile count;", "c8": "Free chat count;", "c9": "Plan Id;", "d1": "Paid profile count", "d2": "Paid chat count", "h1": "Manglik status: 1=manglik, 2=non-manglik, 3=angshik (partial manglik)", "h2": "horoscope available 1=yes, 2=no;", "i1": "islamic sect 1=sunni,2=shia,127=other;", "i2": "islamic mazhab, school of thought 1=Hanafi,2=Shafi,3=Maliki,4=Hanbali,127=other;", "i3": "namaz practice 1,2,3,4,5,-1=occasional, -2=rarely;", "i4": "quran learning 1=basic,2=intermediate,3=hafiz,4=alim,", "i5": "quraan reciting: 1=daily, 2=occasionally, 3=rarely;", "i6": "burkha 1=yes, 2=no", "i7": "beard 1=yes, 2=no", "i8": "believe in dargah 1=yes, 2=no, 3=strictly yes, 4=strictly no", "x1": "Expectations (eng)", "x2": "Expectations", "x3": "partner's diet must be: 1=all, 2=veg, 3=non-veg, 4=occasion-non-veg, 5=eggetarain, 6=jain, 7=vegan;", "x4": "girl job though: 1=yes interested, 2=will do job compulsory, 3=may be, 4=if required, 5=no-wont do job", "x5": "girl currently doing job 1=yes, 2=no" },
  vlidFn62_63: { "g": { "cnv": "convertDateStrToGvn", "cnvo": { "currentFormat": window[my1uzr.worknOnPg].bdayFormat }, "ty": "dt", "mi": "1950", "ms": "enter correct birth date" }, "l": { "cnv": "handleAsString", "cnvo": { "prepn": "91." }, "patn": "91\\.[6-9]\\d{9}", "ms": "Contact no. to display, required" }, "e": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Mobile of registering customer, is compulsory" }, "j": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Marital status required" }, "m": { "cnv": "handleAsString", "patn": "^[A-Za-z]{2,}$", "ms": "First name required" }, "a5": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Please select whether you are 'Male' or 'Female'" } },
  var_sub_caste_type: [{ "a": 0, "e": "-" }, { "a": 1, "e": "Jamati" }, { "a": 2, "e": "Ahle hadees" }, { "a": 3, "e": "Devbandi" }],
 },
 public: {
  usdInAndroWv: 0, //1 = used in android web view;, this will load back button handling for android
  colsToHide: "w,e,     a,a1,a2,a3,a4,a6,a7,a8,a9,b,b1,b5,b9,c,c1,c3,c5,c6,c7,c8,c9,d2,f,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,k1,k2,ma,na,oa,pa,t,ut,v,x1,x3,x4,x5,z",
  colsToSubmit: "a7,u,b6,l,m,n,d,g,h,i,j,k,k1,o,p,q,qa,qb,qc,r,s,va,x,z,a1,a2,a3,a5,a8,a9,b1,b4,b5,c2,c5,c6,d1,x2",
  flshu: "https://static.vecteezy.com/system/resources/previews/075/188/415/large_2x/couple-holds-hands-at-traditional-celebration-free-photo.jpg",
  driveFolderIdForOriginalFile: "1girKhqCDlqYhhowYNpxllUPZz4kRiyTg",
  driveFolderIdForThumbnailFile: "1wIVeMuQyK77-mFp9obCnI85Naqu61OdL",
  fieldNameMap: { "a": "Id", "w": "unique ID", "e": "Mobile of registering customer", "g": "Birth date", "h": "Height", "i": "Package Lk", "j": "Status", "k": "Religious", "k1": "caste;", "k2": "sub caste / type;", "l": "Contact no. to display", "a7": "Diplay contact no. is of:", "m": "First name", "n": "Surname in eng;", "o": "Father's name in eng;", "p": "Mother's name in eng;", "q": "Job type", "qa": "Position", "qb": "Business", "qc": "Business", "r": "Education 10th, 12th, 15th, 17th", "s": "Degrees", "t": "Qualifications e.g. Sci, Com, Be, M.tech, ...", "u": "DP Display Picture;", "ut": "Thumbnail;", "va": "Relative surnames (comma separated);", "x": "Siblings;", "z": "Blood group", "a1": "Weight (kg);", "a3": "Country currently working in;", "a2": "City currently working in;", "a4": "Diet", "a5": "Gender", "a8": "No. of own Home / shop", "b1": "No. of own Vehicle", "a9": "Languages known", "b5": "Native country", "b4": "Native city", "b6": "Image Gallery", "b9": "Drinking habit", "c2": "Physically challenged?, blank if not.", "c3": "lives with family 1=yes, 2=no;", "c5": "Currently living in Country", "c6": "Currently living in City;", "c7": "Free profile count;", "c8": "Free chat count;", "c9": "Plan Id;", "d1": "Paid profile count", "d2": "Paid chat count", "h1": "Manglik status: 1=manglik, 2=non-manglik, 3=angshik (partial manglik)", "h2": "horoscope available 1=yes, 2=no;", "i1": "islamic sect 1=sunni,2=shia,127=other;", "i2": "islamic mazhab, school of thought 1=Hanafi,2=Shafi,3=Maliki,4=Hanbali,127=other;", "i3": "namaz practice 1,2,3,4,5,-1=occasional, -2=rarely;", "i4": "quran learning 1=basic,2=intermediate,3=hafiz,4=alim,", "i5": "quraan reciting: 1=daily, 2=occasionally, 3=rarely;", "i6": "burkha 1=yes, 2=no", "i7": "beard 1=yes, 2=no", "i8": "believe in dargah 1=yes, 2=no, 3=strictly yes, 4=strictly no", "x1": "Expectations (eng)", "x2": "Expect", "x3": "partner's diet must be: 1=all, 2=veg, 3=non-veg, 4=occasion-non-veg, 5=eggetarain, 6=jain, 7=vegan;", "x4": "girl job though: 1=yes interested, 2=will do job compulsory, 3=may be, 4=if required, 5=no-wont do job", "x5": "girl currently doing job 1=yes, 2=no", "v": "relative surnames (comma separated) eng;", "ma": "name lolng;", "na": "surname lolng;", "oa": "fa name lolng;", "pa": "no name lolng;", "f": "Constraint no.;", "b": "Recorded", "c": "fn no", "d": "Status;" },
  vlidFn62_63: { "g": { "cnv": "convertDateStrToGvn", "cnvo": { "currentFormat": window[my1uzr.worknOnPg].bdayFormat }, "ty": "dt", "mi": "1950", "ms": "enter correct birth date" }, "l": { "cnv": "handleAsString", "cnvo": { "prepn": "91." }, "patn": "91\\.[6-9]\\d{9}", "ms": "Contact no. to display, required" }, "j": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Marital status required" }, "m": { "cnv": "handleAsString", "patn": "^[A-Za-z]{2,}$", "ms": "First name required" }, "a5": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Please select whether you are 'Male' or 'Female'" } },
  var_sub_caste_type: [{ "a": 0, "e": "" }, { "a": 1, "e": "Jamati" }, { "a": 2, "e": "Ahle hadees" }, { "a": 3, "e": "Devbandi" }],
 },
};

/* ---- per-app settings swap ------------------------------------------------
 * BOTH apps now live on one page, so the per-app values cannot be assigned once
 * at load time any more. They are applied by __mrApplyFlowSettings("public" |
 * "admin") and swapped back automatically by __mrWithFlowSettings around the few
 * places that must see the other app's values (field labels, colsToHide,
 * colsToSubmit, drive folders, validators, sub-caste list).
 * driveMl / thumbnailSize / thumbnailSizeBy / appInfo are NOT per-app - they come
 * from mr.da via __mrApplyClientConfig() and are left alone here. */
const MR_FLOW_KEYS = [
 "usdInAndroWv", "colsToHide", "colsToSubmit", "flshu",
 "driveFolderIdForOriginalFile", "driveFolderIdForThumbnailFile",
];
let MR_ACTIVE_FLOW = "public";

//writes one app's settings onto window[my1uzr.worknOnPg] / window
function __mrApplyFlowSettings(flow) {
 const cfg = MR_MODE_CFG[flow];
 if (!cfg) throw new Error("__mrApplyFlowSettings: unknown flow '" + flow + "'");
 const P = window[my1uzr.worknOnPg];
 for (let i = 0; i < MR_FLOW_KEYS.length; i++) { P[MR_FLOW_KEYS[i]] = cfg[MR_FLOW_KEYS[i]]; }
 window["vlidFn62_63"] = cfg.vlidFn62_63;
 window.var_sub_caste_type = cfg.var_sub_caste_type;
 MR_ACTIVE_FLOW = flow;
 return cfg;
}

//public is the base state of the page; every admin call site wraps its work in this
async function __mrWithFlowSettings(flow, fn) {
 const prev = MR_ACTIVE_FLOW;
 __mrApplyFlowSettings(flow);
 try {
  return await fn();
 } finally {
  __mrApplyFlowSettings(prev);
 }
}

//shared mono_*/sibling_* settings
const mono_loader_id = null;
const mono_show_modal = 1;
const mono_callBackFn = 'callBck_mra_e';
const mono_input_el_id = "mra__e";
const mono_dv_el_id = "---------";//the ei.min.js removes given div if found "mra__e_div" & adds new one with that id;
const sibling_loader_id = null;
const sibling_show_modal = 1;
const sibling_callBackFn = null;
const sibling_input_el_id = "mra__x";
const sibling_dv_el_id = "mra__x_div";
const mono_fl_csh_no = 37; // ei.min.js   - same csh no. in both apps
const sibling_fl_csh_no = 27; // sbli.js - same csh no. in both apps

window[my1uzr.worknOnPg].csh = [
 //{ "a": 1, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@92f6756/cmn/my1e3.min.js" },
 { "a": 2, "u": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" },
 { "a": 3, "u": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" },
 { "a": 4, "u": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" },
 { "a": 5, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/cmn/my1lo.js", "c": "open_shoLgnO", "r": "open_shoLgnO" },
 { "a": 6, "u": "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
 { "a": 7, "u": "https://code.jquery.com/jquery-3.6.0.min.js" },
 { "a": 8, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@4d95515/cmn/my1ap.min.js" },
 { "a": 9, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/my1xi.min.js" },
 { "a": 10, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@24bf6ca/cmn/my1drv.min.js" },
 { "a": 11, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fc84f58/cmn/my1dra.min.js", "c": "upldAnyFile2drv", "r": "upldAnyFile2drv" },
 { "a": 12, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@50a7af2/mr/fltr.js", "c": "showFilterBox", "r": "showFilterBox" },
 { "a": 13, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@ef526ee/mr/drwr.js", "c": "showDrawer", "r": "showDrawer" },
 { "a": 15, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/andro.js" },
 { "a": 16, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/noti.js", "c": "showNotifications", "r": "showNotifications" },
 { "a": 17, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e2e6e7/mr/pri.js", "c": "set_marriage_plan_innerHTML", "r": "set_marriage_plan_innerHTML" },
 { "a": 18, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6a12ce/cmn/caste.da" },
 { "a": 19, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b39a4af/cmn/ctco.da" },
 { "a": 20, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/abot.js", "c": "set_abot_us_innerHTML", "r": "set_abot_us_innerHTML" },
 { "a": 21, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/conta.js", "c": "set_conta_us_innerHTML", "r": "set_conta_us_innerHTML" },
 { "a": 22, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/prvc.js", "c": "set_privcy_polc_innerHTML", "r": "set_privcy_polc_innerHTML" },
 { "a": 23, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/trms.js", "c": "set_terms_condi_innerHTML", "r": "set_terms_condi_innerHTML" },
 { "a": 24, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/chldpol.js", "c": "set_child_safety_pol_innerHTML", "r": "set_child_safety_pol_innerHTML" },
 { "a": 27, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7e9444c/mr/sbli.js", "c": "set_mr_x_sibling_details", "r": "set_mr_x_sibling_details" },
 { "a": 29, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@bd7e9e0/cmn/lng.da" },
 { "a": 31, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@666354f/cmn/degs.da" },
 { "a": 33, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@0208362/cmn/occu.da" },
 { "a": 37, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@3988bc6/cmn/ei.min.js", "c": "open_entind_crud", "r": "open_entind_crud" },
 { "a": 38, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7e9444c/mr/prfl.js", "c": "mra__main", "r": "mra__main" },
 { "a": 39, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/slkt.js", "c": "openCommonSelectionModal", "r": "openCommonSelectionModal" },
 { "a": 40, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e2e6e7/mr/e.js" },
 { "a": 41, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/vldt.js", "c": "cmnVldet", "r": "cmnVldet" },
 { "a": 42, "u": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css" },
 { "a": 43, "u": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" },
 { "a": 44, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/drvphp.js", "c": "upld2drv", "r": "upld2drv" },
 { "a": 45, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/cmn/intal.da" },
 { "a": 46, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7e9444c/mr/prfle.js", "c": "mr_e__main", "r": "mr_e__main" },
 { "a": 47, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@ef526ee/mr/slkt2.js", "c": "setValByPrprtyDepthToElm", "r": "setValByPrprtyDepthToElm" },
 { "a": 48, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7e9444c/mr/prflt.js", "c": "mr_t__main", "r": "mr_t__main" },
 { "a": 49, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fbf62ad/cmn/my1lp.js", "c": "open_shoLgnP", "r": "open_shoLgnP" },
 { "a": 50, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@a813e1f/cmn/my1ctr.js", "c": "open_my1ctr", "r": "open_my1ctr" },
 { "a": 51, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/my1img.js", "c": "open_addimage", "r": "open_addimage" },
 { "a": 52, "u": "https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js" },
 { "a": 53, "u": "https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css" },
 { "a": 54, "u": "https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js" },
 { "a": 55, "u": "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.css" },
 { "a": 56, "u": "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js" },
];

/* ---- the page theme: styles.css -------------------------------------------
 * One stylesheet now dresses both apps. It is appended AFTER Bootstrap (csh rows
 * 2 and 3, loaded by __mrInitPage) so our rules win the cascade, and it replaces
 * the two themes that used to live in this file - window.appcss for the public app
 * and injectAdminVioletThemeStyles for the admin one - plus __mrScopeCss, which
 * only existed to stop those two sheets from repainting each other. */
const MR_STYLESHEET_ID = "mr-styles";
const MR_THEME_KEY = "mr.theme";
const MR_SHORTLIST_KEY = "mr.shortlist";
const MR_CARD_EAGER_COUNT = 2;
const MR_NO_IMAGE_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFMEUwRTAiLz48dGV4dCB4PSIxNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdDwvdGV4dD48dGV4dCB4PSIxNTAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

//the app's cache-busting id. index.html and index_.html both pin appVrzns[0].a,
//and "?v=<id>" is how this project keeps a changed file off the stale-cache path.
function __mrAppVrz() {
 try {
  if (typeof appVrzns !== "undefined" && appVrzns && appVrzns[0] && appVrzns[0].a) { return String(appVrzns[0].a); }
 } catch (e) { }
 return "";
}

function __mrStylesheetHref() {
 var v = __mrAppVrz();
 return "styles.css" + (v ? "?v=" + encodeURIComponent(v) : "");
}

//appends styles.css exactly once; resolves once it is really in the cascade
function __mrLoadStylesheet() {
 if (window.__mrStylesheetPromise) { return window.__mrStylesheetPromise; }
 window.__mrStylesheetPromise = new Promise(function (resolve) {
  var link = document.getElementById(MR_STYLESHEET_ID);
  if (link) { resolve(true); return; }
  link = document.createElement("link");
  link.id = MR_STYLESHEET_ID;
  link.rel = "stylesheet";
  link.href = __mrStylesheetHref();
  link.addEventListener("load", function () { resolve(true); });
  link.addEventListener("error", function () {
   console.error("styles.css could not be loaded, the page keeps the Bootstrap look", link.href);
   resolve(false);
  });
  document.head.appendChild(link);
  //never let a stalled request hold the whole boot up
  setTimeout(function () { resolve(true); }, 6000);
 });
 return window.__mrStylesheetPromise;
}

/* ---- light / dark ----------------------------------------------------------
 * Dark mode is opt-in: [data-theme="dark"] on <html>, stored in localStorage. */
function __mrReadTheme() {
 try { return (localStorage.getItem(MR_THEME_KEY) === "dark") ? "dark" : "light"; } catch (e) { return "light"; }
}
function __mrApplyTheme(theme) {
 var dark = (theme === "dark");
 document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
 try { localStorage.setItem(MR_THEME_KEY, dark ? "dark" : "light"); } catch (e) { }
 try {
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) { meta.setAttribute("content", dark ? "#171114" : "#FFF8F3"); }
 } catch (e) { }
 return dark ? "dark" : "light";
}
function __mrIsDarkTheme() { return document.documentElement.getAttribute("data-theme") === "dark"; }
function __mrToggleTheme() { return __mrApplyTheme(__mrIsDarkTheme() ? "light" : "dark"); }

function __mrSyncThemeToggle(btn) {
 var dark = __mrIsDarkTheme();
 var icon = btn.querySelector(".app-theme-toggle__icon");
 var state = btn.querySelector(".app-theme-toggle__state");
 if (icon) { icon.className = (dark ? "fas fa-sun" : "fas fa-moon") + " app-theme-toggle__icon"; }
 if (state) { state.textContent = dark ? "On" : "Off"; }
 btn.setAttribute("aria-pressed", dark ? "true" : "false");
 btn.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
}

//git/drwr.js rebuilds #drawerMenuContainer on every open, so the switch is
//mounted by a watcher instead of once at load time.
function __mrMountThemeToggles() {
 var marked = document.querySelectorAll("[data-mr-theme-toggle]");
 for (var i = 0; i < marked.length; i++) { __mrSyncThemeToggle(marked[i]); }

 var menu = document.getElementById("drawerMenuContainer");
 if (!menu || document.getElementById("mrThemeToggleBtn")) { return; }
 var btn = document.createElement("button");
 btn.type = "button";
 btn.id = "mrThemeToggleBtn";
 btn.className = "drawer-menu-item app-theme-toggle";
 btn.setAttribute("data-mr-theme-toggle", "1");
 btn.innerHTML = '<i class="fas fa-moon app-theme-toggle__icon"></i>'
  + '<span class="app-theme-toggle__label">Dark mode</span>'
  + '<span class="app-theme-toggle__state"></span>';
 btn.addEventListener("click", function () {
  __mrToggleTheme();
  __mrMountThemeToggles();
 });
 menu.appendChild(btn);
 __mrSyncThemeToggle(btn);
}

function __mrWatchForThemeToggles() {
 if (window.__mrThemeObserver) { return; }
 var pending = false;
 var mo = new MutationObserver(function () {
  if (pending) { return; }
  pending = true;
  window.requestAnimationFrame(function () { pending = false; __mrMountThemeToggles(); });
 });
 mo.observe(document.documentElement, { childList: true, subtree: true });
 window.__mrThemeObserver = mo;
}

/* ---- shortlist (client side only) ------------------------------------------
 * The hearts live on the cards; the list is kept in localStorage so it survives
 * the in-place panel switches and the infinite scroll. */
function __mrReadShortlist() {
 try {
  var v = JSON.parse(localStorage.getItem(MR_SHORTLIST_KEY) || "[]");
  return Array.isArray(v) ? v : [];
 } catch (e) { return []; }
}
function __mrWriteShortlist(list) {
 try { localStorage.setItem(MR_SHORTLIST_KEY, JSON.stringify(list)); } catch (e) { }
}
function __mrIsShortlisted(id) { return __mrReadShortlist().indexOf(String(id)) >= 0; }

function __mrPaintHeart(btn, on) {
 btn.classList.toggle("is-shortlisted", on);
 btn.setAttribute("aria-pressed", on ? "true" : "false");
 btn.setAttribute("title", on ? "Remove from shortlist" : "Add to shortlist");
 var icon = btn.querySelector("i");
 if (icon) { icon.className = (on ? "fa-solid" : "fas") + " fa-heart"; }
}
function __mrToggleShortlist(btn) {
 var id = btn.getAttribute("data-mr-shortlist");
 if (!id) { return; }
 var list = __mrReadShortlist();
 var at = list.indexOf(id);
 if (at >= 0) { list.splice(at, 1); } else { list.push(id); }
 __mrWriteShortlist(list);
 __mrPaintHeart(btn, at < 0);
 try {
  if (typeof showToast === "function") {
   showToast(at < 0 ? "Added to your shortlist" : "Removed from your shortlist");
  }
 } catch (e) { }
}

/* ---- page chrome that has no markup of its own ------------------------------ */
function __mrInitPageChrome() {
 var nav = document.getElementById("mr-navbar");
 if (nav && !window.__mrScrollBound) {
  window.__mrScrollBound = true;
  var onScroll = function () { nav.classList.toggle("is-scrolled", (window.scrollY || window.pageYOffset || 0) > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
 }
 if (!document.getElementById("mrHearts")) {
  var hearts = document.createElement("div");
  hearts.id = "mrHearts";
  hearts.className = "app-hearts";
  hearts.setAttribute("aria-hidden", "true");
  hearts.innerHTML = "<span>&#10084;</span><span>&#10084;</span><span>&#10084;</span>"
   + "<span>&#10084;</span><span>&#10084;</span><span>&#10084;</span>";
  document.body.appendChild(hearts);
 }
 __mrWatchForThemeToggles();
 __mrMountThemeToggles();
}

//which app is on screen hides the other's roots through styles.css
//(body.mrAdminPanel), so no element needs an inline display value
function __mrSetAdminHidden(hidden) {
 var el = document.getElementById("container_mr__main");
 if (!el) { return; }
 if (hidden) { el.setAttribute("hidden", ""); } else { el.removeAttribute("hidden"); }
}

/* ---- client config (mr.da) -----------------------------------------------
 * One loader + one applier for both apps. mr.da used to be fetched by the
 * public branch ("mr.da") and, separately, by the admin branch ("../mr.da" with a
 * "mr.da" retry). Both apps now serve from the same url, so "mr.da" is tried
 * first and "../mr.da" is kept only as a fallback. */
const MR_CFG_URLS = ["mr.da", "../mr.da"];

/* Reads a CSS time from mr.da ("250ms", ".8s", "0.8 s" or a bare number = ms),
 * clamped to [minMs, maxMs]. Returns null when there is nothing usable, so the
 * caller can leave the styles.css default in place instead of writing garbage
 * into a custom property. A bare number or a wrong unit warns, because a card
 * that never finishes animating looks like a broken page. */
function __mrCssTimeMs(v, minMs, maxMs, key) {
 if (v === undefined || v === null) { return null; }
 const s = String(v).trim().toLowerCase();
 const m = /^(\d*\.?\d+)\s*(ms|s)?$/.exec(s);
 if (!m) { console.warn("mr.da " + key + ": '" + v + "' is not a CSS time, the stylesheet default is kept"); return null; }
 let ms = parseFloat(m[1]) * (m[2] === "s" ? 1000 : 1);
 if (!isFinite(ms)) { console.warn("mr.da " + key + ": '" + v + "' is not a number, the stylesheet default is kept"); return null; }
 if (ms < minMs || ms > maxMs) {
  const clamped = Math.min(maxMs, Math.max(minMs, ms));
  console.warn("mr.da " + key + ": " + v + " is outside " + minMs + "-" + maxMs + "ms, clamped to " + clamped + "ms");
  return clamped;
 }
 return ms;
}

/* mr.da on/off switches. Read as strict 0/1 (true/false also accepted) so a typo
 * such as "yes" or 2 can never quietly switch a mode on or off; anything unusable
 * warns and falls back to 0. An absent key means off. */
function __mrOnOff(v, key) {
 if (v === undefined || v === null || v === "") { return 0; }
 const s = String(v).trim().toLowerCase();
 if (s === "1" || s === "true") { return 1; }
 if (s === "0" || s === "false") { return 0; }
 console.warn("mr.da " + key + ": '" + v + "' is not 0 or 1, 0 is used");
 return 0;
}

/* mr.da "cardAnim" -> the card entrance tokens of styles.css section 11.
 * duration = how long one card's fadeInUp runs, firstDelay = how long the grid
 * waits before its first card starts (card i waits firstDelay + i * step).
 * oneAfterAnother = 1 makes that step a whole animation instead of the stagger,
 * so the cards run in sequence rather than overlapping. animateRandomly = 1
 * shuffles which card takes which slot in the sequence.
 * Only the keys mr.da actually has are written, so the :root defaults stay in
 * charge of the ones it leaves out. Everything it decided is reported: a timing
 * that does not show up is otherwise indistinguishable from a file that was
 * never read. */
function __mrApplyCardAnim(anim) {
 const root = document.documentElement;
 if (!root) { return; }
 const dur = __mrCssTimeMs(anim.duration, 0, 5000, "cardAnim.duration");
 if (dur !== null) { root.style.setProperty("--mr-card-anim-dur", dur + "ms"); }
 const first = __mrCssTimeMs(anim.firstDelay, 0, 10000, "cardAnim.firstDelay");
 if (first !== null) { root.style.setProperty("--mr-card-anim-first-delay", first + "ms"); }

 const chain = __mrOnOff(anim.oneAfterAnother, "cardAnim.oneAfterAnother");
 const shuffle = __mrOnOff(anim.animateRandomly, "cardAnim.animateRandomly");
 //normalised back onto the object, so the card builder reads one shape
 anim.oneAfterAnother = chain;
 anim.animateRandomly = shuffle;
 root.setAttribute("data-mr-card-anim-chain", String(chain));
 root.setAttribute("data-mr-card-anim-random", String(shuffle));

 const applied = root.style.getPropertyValue("--mr-card-anim-dur") + " / "
  + root.style.getPropertyValue("--mr-card-anim-first-delay") + " / "
  + (chain ? "oneAfterAnother" : "stagger") + (shuffle ? "+random" : "");
 //also on <html> as an attribute, so the Elements panel shows it without the console
 root.setAttribute("data-mr-card-anim", applied);
 console.info("[mr] cardAnim from " + (window[my1uzr.worknOnPg].clientConfigSource || "no mr.da")
  + " -> applied: " + applied
  + (dur === null && first === null ? " (neither time is in mr.da, the stylesheet defaults are in use)" : "")
  + (chain ? " -- cards run one after another, so card N starts N * duration after the first"
   + (shuffle ? ", in a shuffled order" : "") : ""));
 if (dur !== null || first !== null) {
  try {
   if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    console.warn("[mr] this browser/OS reports prefers-reduced-motion: reduce, so styles.css sets"
     + " animation:none on .profile-card and no entrance animation runs at all."
     + " Turn the OS animation effects back on to see the timing above.");
   }
  } catch (e) { }
 }
}

/* Pushes window[my1uzr.worknOnPg].clientConfig onto the settings both apps read.
 * Must run AFTER clientConfig is loaded - it used to run at file-init time, when
 * clientConfig was still empty, so the mr.da values were always dropped.
 * appInfo has no fallback: mr.da is the single source of truth for it. */
function __mrApplyClientConfig() {
 const P = window[my1uzr.worknOnPg];
 const cfg = (P && P.clientConfig) || {};
 const has = (v) => v !== undefined && v !== null;
 P.driveMl = cfg.driveMl || cfg.drml || "sambodhisarang.in";//sambodhisarang.in
 P.thumbnailSize = has(cfg.thumbnailSize) ? cfg.thumbnailSize : 600;
 P.thumbnailSizeBy = has(cfg.adminThumbnailSizeBy) ? cfg.adminThumbnailSizeBy : (has(cfg.thumbnailSizeBy) ? cfg.thumbnailSizeBy : 1);
 P.appInfo = (cfg.appInfo && typeof cfg.appInfo === "object") ? cfg.appInfo : {};
 //card entrance timing; applied to :root here so it is in place before
 //__mrLoadStylesheet() and long before the first card is built.
 P.cardAnim = (cfg.cardAnim && typeof cfg.cardAnim === "object") ? cfg.cardAnim : {};
 __mrApplyCardAnim(P.cardAnim);
}

/* mr.da is a hand-edited file that carries no version of its own, so a plain
 * fetch can hand back yesterday's copy and an edit to it looks like it did
 * nothing. It gets the same ?v=<appVrzns id> as the stylesheet, plus a
 * revalidating fetch, so a reload always sees what is on disk. */
function __mrCfgHref(base) {
 var v = __mrAppVrz();
 return base + (v ? "?v=" + encodeURIComponent(v) : "");
}

//reads mr.da into window[my1uzr.worknOnPg].clientConfig, then applies it.
//clientConfig is always left as an object so the later read sites need no guard.
async function __mrLoadClientConfig() {
 let cfg = null;
 let source = "";
 for (let i = 0; i < MR_CFG_URLS.length; i++) {
  const url = __mrCfgHref(MR_CFG_URLS[i]);
  try {
   const resp = await fetch(url, { cache: "no-cache" });
   if (!resp.ok) continue;
   const parsed = await resp.json();
   if (parsed && typeof parsed === "object") { cfg = parsed; source = url; break; }
  } catch (err) { /* try the next path */ }
 }
 if (!cfg) { console.warn("mr.da not found at: " + MR_CFG_URLS.join(" , ")); }
 window[my1uzr.worknOnPg].clientConfig = cfg || {};
 window[my1uzr.worknOnPg].clientConfigSource = source;
 __mrApplyClientConfig();
 return window[my1uzr.worknOnPg].clientConfig;
}

/* ---- shared init helpers -------------------------------------------------
 * Each of the blocks below was duplicated in the public and the admin branch
 * (or was trivially parameterisable), so it is now defined once, here. ---- */

//creates/updates the app's dexie tables and records how many failed


//builds the lookup vars (designation, caste/religion, degrees, city, languages)
//from the lookup data files. var_ctco follows fileToUseForSelectingNativeCity when
//the app sets one (public: 45), otherwise it falls back to 19 (admin).
function __mrPrepLookupVars() {
 cmn_prep_data_set_to_var("mr_desig_posis", 1, 33);
 cmn_prep_data_set_to_var("var_caste_rlgns", 1, 18);
 cmn_prep_data_set_to_var("var_degres", 1, 31);
 const nativeCitySrc = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].fileToUseForSelectingNativeCity;
 cmn_prep_data_set_to_var("var_ctco", 1, nativeCitySrc || 19);
 cmn_prep_data_set_to_var("var_lngs", 1, 29);
}

//hide + remove a bootstrap modal, then drop it from the modal stack
function __mrDestroyModal(modalId) {
 const el = document.getElementById(modalId);
 if (el) {
  // Get Bootstrap modal instance
  const inst = bootstrap.Modal.getInstance(el);
  if (inst) {
   inst.hide(); // Hide the modal first
  }
  // Remove from DOM
  el.remove();
  // Remove from modal stack if you're using it
  if (typeof removeModalFromStack === 'function') {
   removeModalFromStack("abc");
  }
 }
}

//toast, falling back to alert(); used by both apps.
//alertMsg defaults to msg (2 call sites toast one text and alert a different one).
function __mrToast(msg, type, duration, alertMsg) {
 if (typeof showToast === 'function') {
  showToast(msg, {
   type, duration,
   position: 'top'
  });
 } else {
  alert(alertMsg === undefined ? msg : alertMsg);
 }
}

//run fn() once the DOM is ready. defer=true runs it from a setTimeout when the DOM
//is already parsed, so the theme attribute is in place before the first paint.
function __mrOnReady(fn, defer) {
 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
   await fn();
  });
 } else if (defer) {
  setTimeout(() => {
   fn();
  }, 0);
 } else {
  fn();
 }
}

/* proflFullData / myEinMR / profileUnlockCount / remainingProflCnt used to be declared
 * in the public branch only, but __mrHandleSuResponse() below closes over them, so they
 * are initialised once here for both apps. appOwner is set by my1e3.js before mr.js runs. */
let proflFullData;
let myEinMR = {};
try {
 const stored = localStorage.getItem(appOwner.tn + '_myEinMR');
 if (stored && stored !== 'undefined' && stored !== 'null') {
  myEinMR = JSON.parse(stored);
 }
} catch (e) {
 console.error('Error parsing myEinMR:', e);
 myEinMR = {};
}
let profileUnlockCount = myEinMR.d1 || 0;
let remainingProflCnt = 0;

/* the dexie tables a "response.su == 1" reply can carry off (public: ma/f/fp/mr,
 * admin: c/mr/ma/mp). Both apps share one handler now, so every table is listed and
 * only the ones actually present in the reply are written - which keeps each app's
 * behaviour identical to when it ran alone. */
const MR_RSPO_TABLES = ["ma", "f", "fp", "mr", "c", "mp"];

/* the ONE "response.su == 1" handler for both apps. It used to be hndl_mrrspo in the
 * public branch and hndl_mr_rspo in the admin one; each app keeps its own global alias
 * because git/e.js tells the apps apart via `typeof hndl_mr_rspo`. */
function __mrHandleSuResponse(response, reload = 0, fnToRunOnAllOk, fnToRunOnErr, rqst) {
 (async () => {
  try {
   //this function is called when response.su == 1
   for (const tbl of MR_RSPO_TABLES) {
    if (response[tbl] != null && response[tbl].l != null) {
     await dbDexieManager.insertToDexie(dbnm, tbl, response[tbl].l, true, ["a"]);
      //additional (public app only - it owns the "my profile" localStorage copy)
      if (tbl === "mr" && !__mrIsAdminPanel()) {
       proflFullData = null;
       if (rqst && (rqst.fn == 68 || rqst.fn == 69 || rqst.fn == 70) && response.mr.l.length > 0) {
        localStorage.setItem(appOwner.tn + '_myEinMR', JSON.stringify(response.mr.l[0]));
        profileUnlockCount = response.mr.l[0].d1;

        if (rqst.fn == 69 && response.mr.l[0].d < 0)
         localStorage.removeItem(appOwner.tn + '_myEinMR');
       }
      }
     }
    }
    if (fnToRunOnAllOk != null && typeof fnToRunOnAllOk === 'function') {
     fnToRunOnAllOk(response);
    }
    if (reload == 1) {
     if (__mrIsAdminPanel()) location.reload();//the admin app always did a hard reload
     else if (typeof safeReload === 'function') safeReload();
     else location.reload();
    }
   } catch (error) {
    alert("err: ", error);
    if (fnToRunOnErr != null && typeof fnToRunOnErr === 'function') {
     fnToRunOnErr(response);
    }
   }
 })();
}

//re-exposes the file's top-level names on window, exactly as the two separate scripts
//used to. One block for both apps - the per-app entries read whichever flow is active.
function __mrExposeGlobals() {
 const P = window[my1uzr.worknOnPg];
 Object.defineProperty(window, "tblFailureCount", { configurable: true, get: function () { return tblFailureCount; }, set: function (v) { tblFailureCount = v; } });
 Object.defineProperty(window, "profilesData", { configurable: true, get: function () { return profilesData; }, set: function (v) { profilesData = v; } });
 Object.defineProperty(window, "adminProfilesData", { configurable: true, get: function () { return adminProfilesData; }, set: function (v) { adminProfilesData = v; } });
 Object.defineProperty(window, "appData", { configurable: true, get: function () { return appData; }, set: function (v) { appData = v; } });
 Object.defineProperty(window, "tblsRequired", { configurable: true, get: function () { return tblsRequired; } });
 Object.defineProperty(window, "sho_da_tkLimit", { configurable: true, get: function () { return sho_da_tkLimit; } });
 Object.defineProperty(window, "ids_of_views", { configurable: true, get: function () { return ids_of_views; } });
 Object.defineProperty(window, "cacheVersion", { configurable: true, get: function () { return cacheVersion; } });
 Object.defineProperty(window, "cacheStrategy", { configurable: true, get: function () { return cacheStrategy; } });
 Object.defineProperty(window, "dontShoLoginConfirmation", { configurable: true, get: function () { return dontShoLoginConfirmation; } });
 Object.defineProperty(window, "dontRestartAfterLogin", { configurable: true, get: function () { return dontRestartAfterLogin; } });
 //per-app: getter/setter pair so both this file and any CDN script see the same value
 Object.defineProperty(window, "driveFolderIdForOriginalFile", { configurable: true, get: function () { return P.driveFolderIdForOriginalFile; }, set: function (v) { P.driveFolderIdForOriginalFile = v; } });
 Object.defineProperty(window, "driveFolderIdForThumbnailFile", { configurable: true, get: function () { return P.driveFolderIdForThumbnailFile; }, set: function (v) { P.driveFolderIdForThumbnailFile = v; } });
 Object.defineProperty(window, "fieldNameMap", { configurable: true, get: function () { return MR_MODE_CFG[MR_ACTIVE_FLOW].fieldNameMap; }, set: function (v) { MR_MODE_CFG[MR_ACTIVE_FLOW].fieldNameMap = v; } });
 Object.defineProperty(window, "usdInAndroWv", { configurable: true, get: function () { return P.usdInAndroWv; }, set: function (v) { P.usdInAndroWv = v; } });
 Object.defineProperty(window, "mono_fl_csh_no", { configurable: true, get: function () { return mono_fl_csh_no; } });
 Object.defineProperty(window, "mono_loader_id", { configurable: true, get: function () { return mono_loader_id; } });
 Object.defineProperty(window, "mono_show_modal", { configurable: true, get: function () { return mono_show_modal; } });
 Object.defineProperty(window, "mono_callBackFn", { configurable: true, get: function () { return mono_callBackFn; } });
 Object.defineProperty(window, "mono_input_el_id", { configurable: true, get: function () { return mono_input_el_id; } });
 Object.defineProperty(window, "mono_dv_el_id", { configurable: true, get: function () { return mono_dv_el_id; } });
 Object.defineProperty(window, "sibling_fl_csh_no", { configurable: true, get: function () { return sibling_fl_csh_no; } });
 Object.defineProperty(window, "sibling_loader_id", { configurable: true, get: function () { return sibling_loader_id; } });
 Object.defineProperty(window, "sibling_show_modal", { configurable: true, get: function () { return sibling_show_modal; } });
 Object.defineProperty(window, "sibling_callBackFn", { configurable: true, get: function () { return sibling_callBackFn; } });
 Object.defineProperty(window, "sibling_input_el_id", { configurable: true, get: function () { return sibling_input_el_id; } });
 Object.defineProperty(window, "sibling_dv_el_id", { configurable: true, get: function () { return sibling_dv_el_id; } });
}

/* ---- the ONE boot for the whole page --------------------------------------
 * Both apps live on this page now, so the scripts are loaded once, the dexie
 * tables are created once and the lookup vars are built once - then each app
 * renders its own UI on top of that shared state. */
const MR_BOOT_CSHS = [
 2, 3, 4, 6, 7, 8, 9, 15, 37, 39, 40, 41, 42, 43, 44, 47, 52, 53, 54, 55, 56
];//union of the two apps' own boot lists (public's + admin's), in .csh table order.
 //34/35 were in both original lists but do not exist in the .csh table, so they are gone.
 //49 my1lp.js, 50 my1ctr.js and 51 my1img.js are NOT here - both apps loaded them on
 //demand (login prompt / my-control modal / image picker), so nothing changes here.

const MR_PANEL_PUBLIC = "public";
const MR_PANEL_ADMIN = "admin";
let MR_ACTIVE_PANEL = MR_PANEL_PUBLIC;//which app is on screen
let __mrBootPromise = null;//the single boot, shared by both apps
let __mrAdminRendered = false;//true once the admin DataTable exists
let __mrPublicAppStart = null;//set by the public app's IIFE below; run by __mrStartup

//public is the page's base state. Applied once here so every load-time reader
//(flashImageUrl, colsToHide, colsToSubmit, ...) still sees a value.
__mrApplyFlowSettings(MR_PANEL_PUBLIC);

//resolves the "which menu items are allowed" hook once; used to live inside the
//public app's loadBackgroundScripts(), which the admin never ran.
async function __mrResolveModuleHook() {
 var hook = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg][moduLst.hook];
 var existing = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].allowedModulesMenuItems;
 var missing =
  typeof existing === "undefined" ||
  existing === null ||
  existing === "" ||
  (Array.isArray(existing) && existing.length === 0);
 if (typeof hook === "function" && missing) {
  try {
   var permitted = await chkModuLstAgainstFNF(moduLst);
   hook(permitted);
  } catch (e) {
   console.warn("failed to resolve allowed modules menu items", e);
  }
 }
}

//loads everything the page needs, once. Safe to await from anywhere: the first
//caller starts it, everyone else waits for the same promise.
function __mrInitPage() {
 if (__mrBootPromise) return __mrBootPromise;
 __mrBootPromise = (async () => {
  console.log('Loading other required scripts...');
  const result1 = await loadCshScriptsSequentially.apply(null, MR_BOOT_CSHS);
  if (!result1.success) {
   throw new Error("Failed to load required scripts: " + result1.error);
  }
  const createResult = await dbDexieManager.handleNwTables("loader", dbnm, tblsRequired);
  tblFailureCount = createResult.failureCount;
  await __mrLoadClientConfig();
  __mrPrepLookupVars();
  await __mrResolveModuleHook();
 })().catch((err) => {
  __mrBootPromise = null;//let the next call retry
  throw err;
 });
 return __mrBootPromise;
}

/* ---- panel switching, in place (there is no reload any more) ---------------- */
function __mrSetBodyPanelClass(panel) {
 const isPublic = (panel === MR_PANEL_PUBLIC);
 document.body.classList.toggle("mrPublicPanel", isPublic);
 document.body.classList.toggle("mrAdminPanel", !isPublic);
}

//shows the admin panel (or the public app again) without touching the URL.
async function __mrShowPanel(panel) {
 const isAdmin = (panel === MR_PANEL_ADMIN);
 MR_ACTIVE_PANEL = isAdmin ? MR_PANEL_ADMIN : MR_PANEL_PUBLIC;

   //styles.css hides the public roots while body.mrAdminPanel is set and keeps the
   //admin container [hidden]; nothing here needs an inline display value.
   //The container is un-hidden by __mrSetAdminHidden(false) further down, once the
   //panel actually has content - see there.
   __mrSetBodyPanelClass(MR_ACTIVE_PANEL);


  //git/e.js tells the two apps apart by `typeof hndl_mr_rspo`: present -> admin
  //(full reload), absent -> public (in-place refresh). So this name follows the
  //panel that is on screen.
  if (isAdmin) {
   window.hndl_mr_rspo = __mrHandleSuResponse;
  } else {
   try { delete window.hndl_mr_rspo; } catch (e) { window.hndl_mr_rspo = undefined; }
  }

  if (!isAdmin) {
   __mrApplyFlowSettings(MR_PANEL_PUBLIC);
   __mrSetAdminHidden(true);
   window.scrollTo(0, 0);
   return;
  }
  //build the panel's markup on first open, then render it once
  await __mrInitPage();
  __mrEnsureAdminContainer();
  if (!__mrAdminRendered) {
   __mrAdminRendered = true;
   const ok = await container_mr__main();//false => render failed, let the next open retry
   __mrAdminRendered = (ok !== false);
  }
  //revealed last: the boot promise above is awaited, so showing the container any
  //earlier would paint an empty panel (and needs a placeholder loader to cover it)
  __mrSetAdminHidden(false);
  window.scrollTo(0, 0);
 }

//which app is on screen; used by the pieces both apps register on window
//(git/pri.js plan modal, the editor's "is admin" answers)
function __mrActivePanel() { return MR_ACTIVE_PANEL; }
function __mrIsAdminPanel() { return MR_ACTIVE_PANEL === MR_PANEL_ADMIN; }

//================== BEGIN PUBLIC APP  (git/mr.js) ==================

//the shared "response.su == 1" handler under this app's historical name
const hndl_mrrspo = __mrHandleSuResponse;
//comman:public
window[my1uzr.worknOnPg].shoBadge = "qa";
window[my1uzr.worknOnPg].pullWhenCardsRemain = 6;
window[my1uzr.worknOnPg].colsOfOthersHide = "w,x,e,l,n,o,p,r,va,b4,c2,d,d1,     a,a1,a2,a3,a4,a6,a7,a8,a9,b,b1,b5,b9,c,c1,c3,c5,c6,c7,c8,c9,d2,f,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,k1,k2,ma,na,oa,pa,t,ut,v,x1,x3,x4,x5,z";
window[my1uzr.worknOnPg].colsHideOnFullDetails = "w,x,e,r,va,b4,c2,d,d1,     a,a1,a2,a3,a4,a6,a7,a8,a9,b,b1,b5,b9,c,c1,c3,c5,c6,c7,c8,c9,d2,f,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,k1,k2,ma,na,oa,pa,t,ut,v,x1,x3,x4,x5,z";
//   window[my1uzr.worknOnPg].colsToHide = "d1,   a,w,b,e,f,t,c,ut,v,ma,na,oa,pa,a4,a6,b9,c1,c3,c7,c8,c9,d2,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,x1,x3,x4,x5";//t column in mysql must be used for something else;
window[my1uzr.worknOnPg].fieldsOnCard = "m~s~g,h,'budhdhist',k2,b4";
//name the profile field keys the card may read for the optional rows. Empty = the
//element is not rendered at all, so no field can leak onto the card by accident.
window[my1uzr.worknOnPg].cardExtras = window[my1uzr.worknOnPg].cardExtras || { bio: "", online: "", match: "" };
//if below line is commented, it takes 19 as default;
window[my1uzr.worknOnPg].fileToUseForSelectingNativeCity = 45;//45 for state,dist,talkua(fnUsed->setValByPrprtyDepthToElm) ~ 19 for city[in state] (fnUsed->setValByProprtyToElm);
window[my1uzr.worknOnPg].showTableViewOnCardClick = 1;
window[my1uzr.worknOnPg].forceSibling = 0;




//appInfo now lives in "mr.da" and is assigned by __mrApplyClientConfig()
//once __mrLoadClientConfig() has resolved.

window["vlidFn68"] = { "a": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Profile id required" } };

xtraj_payload = { "fn": 69, "fl": "https://my1.in/2/c.php" };



// load_marriage_page.js
let isFetching = false;      // Track if we're currently fetching
let hasMore = true;          // Track if there are more records to fetch
let currentPage = 0;         // Track current page
window.selectedDegrees = [];
window.selectedOccupations = [];

//  function function2runAfter_O_Login(rs16lt) {
//   if (rs16lt.su == 1) {
//    if (rs16lt.fn69 && rs16lt.fn69.mr && rs16lt.fn69.mr.l)
//     localStorage.setItem(appOwner.tn + '_myEinMR', JSON.stringify(rs16lt.fn69.mr.l[0]));
//    safeReload();
//   }
//  }

(function () {
 'use strict';

 // The splash owns the screen for the first seconds (flsht plus the fade), and
 // the cards are already in the DOM underneath it by then, so their entrance
 // would finish unseen. The grid carries .app-splash-held until this runs - see
 // the rule in styles.css section 11. animation:none only drops the animation,
 // so cards stay visible even if the splash never comes down.
 let __mrSplashUp = false;
function __mrReleaseCardAnim() {
   __mrSplashUp = false;
   const grid = document.getElementById('profiles-container');
   if (grid) { grid.classList.remove('app-splash-held'); }
   //the grid is on screen and no longer held, so a oneAfterAnother sequence can
   //start now - waiting here is what keeps it from playing out under the splash
   __mrCardChainStartOnce();
  }

 async function showFlashImage() {
  return new Promise((resolve) => {
   // Get flash image URL and display time
   const flashImageUrl = window[my1uzr.worknOnPg].flshu;
   const minDisplayTime = window[my1uzr.worknOnPg].flsht || 3;

   // Create flash container
   const flashContainer = document.createElement('div');
   flashContainer.id = 'flash-container';

   // Create flash image
   const flashImage = document.createElement('img');
   flashImage.src = flashImageUrl;
   flashImage.alt = 'Loading...';
   flashImage.className = 'app-flash-img';

   //   // Create loading text
   //   const loadingText = document.createElement('div');
   //   loadingText.innerHTML = 'loading ...<br>सारंग विवाह संस्था';
   //   loadingText.style.cssText = `
   //             position: absolute;
   //             bottom: 30px;
   //             left: 0;
   //             width: 100%;
   //             text-align: center;
   //             color: white;
   //             font-size: 18px;
   //             font-family: Arial, sans-serif;
   //             background: rgba(0,0,0,0.7);
   //             padding: 10px;
   //         `;

flashContainer.appendChild(flashImage);
   //   flashContainer.appendChild(loadingText);
    __mrSplashUp = true;
    document.body.appendChild(flashContainer);

   // Start timer for minimum display time
   const startTime = Date.now();

   // Function to remove flash and resolve promise
   function removeFlash() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, (minDisplayTime * 1000) - elapsedTime);

    setTimeout(() => {
     if (flashContainer.parentNode) {
      flashContainer.style.transition = 'opacity 0.5s ease';
      flashContainer.style.opacity = '0';

setTimeout(() => {
        if (flashContainer.parentNode) {
         flashContainer.parentNode.removeChild(flashContainer);
        }
        __mrReleaseCardAnim();//the splash is gone: let the grid animate in
        resolve();
       }, 500);
      } else {
       __mrReleaseCardAnim();
       resolve();
      }
    }, remainingTime);
   }

// Always call removeFlash to ensure flash disappears after minDisplayTime
    removeFlash();

    /* failsafe: the fade chain above is the normal path, but a stuck overlay would
     * hide the whole app, so the splash is force-removed and the grid un-held no
     * matter what. resolve() is idempotent, so a double call is harmless. */
    setTimeout(() => {
     if (flashContainer.parentNode) { flashContainer.parentNode.removeChild(flashContainer); }
     __mrReleaseCardAnim();
     resolve();
    }, (minDisplayTime * 1000) + 4000);
  });
 }
 // Function to load background scripts
 async function loadBackgroundScripts() {
  try {
   //scripts, dexie tables, mr.da and the lookup vars are shared by both apps and
   //are loaded exactly once by __mrInitPage()
   await __mrInitPage();

   // Reset pagination variables
   currentPage = 0;
   hasMore = true;
   isFetching = false;

   let initialResult = null;
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (idParam) {
     initialResult = await pullNwProfiles(`w = '${idParam}'`, true);
     /*// Check localStorage first
     const storageKey = appOwner.eo +"_"+ appOwner.ec +"_"+ idParam;
     const storedProfile = localStorage.getItem(storageKey);
     
     if (storedProfile) {
      try {
       const parsedProfile = JSON.parse(storedProfile);
       initialResult = {profiles: [parsedProfile],hasMore: false};
       console.log('Loaded profile from localStorage for ID:', idParam);
      } catch (e) {
       console.error('Error parsing stored profile:', e);
       // Fallback to server fetch
       initialResult = await pullNwProfiles(`w = '${idParam}'`, true);
       if (initialResult && initialResult.profiles && initialResult.profiles.length > 0) {
        const proflToStore = initialResult.profiles.find(item => item.w === idParam);
        localStorage.setItem(storageKey, JSON.stringify(proflToStore));
        console.log('Fetched from server and stored to localStorage');
       }
      }
     } else {
      // Not in localStorage, fetch from server
      initialResult = await pullNwProfiles(`w = '${idParam}'`, true);
      if (initialResult && initialResult.profiles && initialResult.profiles.length > 0) {
       localStorage.setItem(storageKey, JSON.stringify(initialResult.profiles[0]));
       console.log('Fetched from server and stored to localStorage');
      }
     }*/
    } else {
     initialResult = await pullNwProfiles();
    }
    profilesData = initialResult.profiles || [];
    hasMore = initialResult.hasMore;
    __mrCardDiag('afterPull', 'hasMore=' + hasMore);

    // Add viewport meta for mobile
    addViewportMeta();

    // Create and add navigation bar
    const navBar = createNavigationBar();
    const businessName = window[my1uzr.worknOnPg]?.appInfo?.business || "";
    navBar.querySelector("#navbarBusinessName").textContent = businessName;
    document.body.appendChild(navBar);

    // Create and add main content - NOW AWAITED
    const mainContent = await createMainContent(); // ADDED AWAIT HERE
    document.body.appendChild(mainContent);
    __mrCardDiag('mainContentAttached', 'bodyPanel=' + document.body.className
     + ' bodyChildren=' + document.body.children.length);
    //the splash can lift while mainContent was still detached, in which case
    //__mrReleaseCardAnim() had no grid to un-hold yet - catch that up here
    if (!__mrSplashUp) { __mrReleaseCardAnim(); }

    // Create and add footer
    const footer = createFooter();
    document.body.appendChild(footer);

    // navbar scroll shadow, floating hearts and the drawer theme switch
    __mrInitPageChrome();


    //  const emptyStringSibling = ""; const emptyDivSibling = ""; const shoModalSibling = 0; const noCallbackSiblingFn = null;
    //  await loadExe2Fn(27, [emptyStringSibling, emptyDivSibling, shoModalSibling, noCallbackSiblingFn], [1]);//siblings file;
    //  const prepLangData = 1; const shoLangModal = 0; const current_langs = ""; const call_back_fn = ""; const container_dv = "";
    //  await loadExe2Fn(29, [prepLangData, shoLangModal, current_langs, call_back_fn, container_dv, 29], [1]);//Languages file;
    //  await loadExe2Fn(31, [1, 0, null, null, "", "", 31], [1]);//degree file;
    //  await loadExe2Fn(33, [1, 0, null, null, "", "", 33], [1]);//Occupation file;
    //  const prep475CasteReligionData = 1; const sho477CasteReligionModal = 0; const current_religion_id = 0; const current_caste_id = 0;
    //  await loadExe2Fn(18, [prep475CasteReligionData, sho477CasteReligionModal, current_religion_id, current_caste_id, null, 18], [1]);
   return true;

  } catch (error) {
   console.error('Error loading background scripts:', error);

   // Show error message
   const errorMessage = window[my1uzr.worknOnPg].lodErrMs ||
    "Press back back & open the app again;";

   // Remove flash if exists
   const flashContainer = document.getElementById('flash-container');
   if (flashContainer) {
    flashContainer.remove();
   }

   // Show error
   document.body.innerHTML = `
   <div class="app-error-page">
       <div>
           <h2>Error Loading Application</h2>
           <p>${errorMessage}</p>
           <p class="app-error-details">Error details: ${error.message}</p>
           <!-- UPDATED BUTTON -->
           <button onclick="safeReload()" 
                   class="btn btn-pink-gradient mt-3 px-4">
               Reload Application
           </button>
       </div>
   </div>
`;

   return false;
  }
 }

  // Function to create navigation bar
  function createNavigationBar() {
   const navBar = document.createElement('nav');
   navBar.id = 'mr-navbar';
   navBar.className = 'navbar navbar-expand-lg navbar-light bg-light app-navbar';


   navBar.innerHTML = `
   <div class="container-fluid">
       <!-- Left: Hamburger Menu -->
       <button class="btn btn-link app-nav__icon" type="button" title="Menu"
               aria-label="Open menu"
               onclick="(async () => { await loadExe2Fn(13, [], [1]); })()">
           <span class="navbar-toggler-icon app-toggler-icon"></span>
       </button>

       <button class="btn btn-link app-nav-name" type="button"
               onclick="(async () => { await loadExe2Fn(50, ['dv_to_set_open_my1ctr_processed', 0, 1, 2], [1]); })();">
           <span id="navbarBusinessName"></span>
       </button>

       <!-- Right: Icons -->
       <div class="app-nav__actions">
           <!-- Notification Icon -->
           <!-- <button class="btn btn-link app-nav__icon" title="Notifications" onclick="(async () => { await loadExe2Fn(16, [], [1]); })()">
               <i class="fas fa-bell fa-lg"></i>
           </button>
           -->

           <!-- Filter Icon -->
           <button class="btn btn-link app-nav__icon" title="Filters" aria-label="Filters"
                   onclick="(async () => { await loadExe2Fn(12, [], [1]); })()">
               <i class="fas fa-filter fa-lg"></i>
           </button>

           <!-- <button type="button" class="btn btn-link app-nav__icon app-theme-toggle__icon-only"
                   data-mr-theme-toggle="1" title="Switch theme" aria-label="Switch theme">
               <i class="fas fa-moon app-theme-toggle__icon"></i>
           </button> -->
       </div>
   </div>
`;
   return navBar;
  }


 // Function to create main content with profile cards
 async function createMainContent() {
  const mainContent = document.createElement('div');
  mainContent.id = 'main-content';


  try {
   if (profilesData.length === 0) {
    mainContent.innerHTML = `
   <div class="container text-center">
       <div class="row justify-content-center">
           <div class="col-md-6">
               <div class="card shadow-lg border-0 app-empty-card">
                   <div class="card-body p-5">
                       <div class="mb-4">
                           <i class="fas fa-user-friends text-secondary app-empty-icon"></i>
                       </div>
                       <h2 class="card-title mb-3 app-card-title-primary">
                           No Profiles Yet
                       </h2>
                       <p class="card-text text-muted mb-4">
                           Profiles will appear here when available. Check back soon!
                       </p>
                       <!-- UPDATED BUTTON -->
                       <button class="btn btn-pink-gradient btn-lg px-5"
                               onclick="alert('coming soon...')">
                           <i class="fas fa-user-plus me-2"></i>
                           Create First Profile
                       </button>
                   </div>
               </div>
           </div>
       </div>
   </div>
`;
   } else {
    mainContent.innerHTML = `
<div class="container app-container">
        <div class="row${__mrSplashUp ? ' app-splash-held' : ''}" id="profiles-container">
            <!-- Profile cards will be dynamically inserted here -->
        </div>
       <div id="loader-container"></div>
   </div>
`;

    // Insert profile cards dynamically
    const container = mainContent.querySelector('#profiles-container');
    const loaderContainer = mainContent.querySelector('#loader-container');

    if (container) {
     const batch = [];
     profilesData.forEach((profile, idx) => {
      const profileCard = createProfileCard(profile, idx);
      container.appendChild(profileCard);
      batch.push(profileCard);
     });
     __mrCardSeqAssignOrRun(batch);
     __mrCardDiag('cardsBuilt', 'batch=' + batch.length + ' (grid still detached here)');

     // Add loader if there are more profiles
     if (hasMore && loaderContainer) {
      loaderContainer.appendChild(createLoader());
     }
    }

    // Setup infinite scroll
    setupInfiniteScroll();
   }

  } catch (error) {
   console.error('Error creating main content:', error);
   mainContent.innerHTML = `
   <div class="container">
       <div class="row justify-content-center">
           <div class="col-md-8">
               <div class="alert alert-danger" role="alert">
                   <h4 class="alert-heading">
                       <i class="fas fa-exclamation-triangle me-2"></i>
                       Error Loading Profiles
                   </h4>
                   <p>Failed to load profile data. Please try again later.</p>
                   <hr>
                   <p class="mb-0">Error: ${error.message}</p>
               </div>
               <div class="text-center mt-3">
                   <!-- UPDATED BUTTON -->
                   <button class="btn btn-pink-gradient px-4"
                           onclick="safeReload()">
                       <i class="fas fa-redo me-2"></i>
                       Retry Loading
                   </button>
               </div>
           </div>
       </div>
   </div>
`;
  }

  // ALWAYS return the mainContent element (not a Promise)
  return mainContent;
 }

  function __mrEscHtml(value) {
   if (value === null || value === undefined) { return ''; }
   return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  //city name for a b4 id; the country / city lookups arrive with the shared boot,
  //so this may legitimately answer '' on the very first pass
  function __mrCityName(cityId) {
   if (cityId === undefined || cityId === null || cityId === '') { return ''; }
   const country = (window.var_ctco || []).find(item => item.a == cityId);
   return (country && country.n) ? String(country.n) : '';
  }

  //degree names for the comma separated `s` field
  function __mrDegreeNames(value) {
   const ids = value ? String(value).split(',').map(id => id.trim()).filter(Boolean) : [];
   if (ids.length === 0) { return ''; }
   const names = ids.map(id => {
    const degree = (window.var_degres || []).find(item => item.a == id);
    return degree ? degree.e : null;
   }).filter(Boolean);
   return names.join(', ');
  }

  //reads one of the opt-in card fields the owner named in cardExtras
  function __mrExtraRaw(profile, key) {
   if (!key || !profile) { return null; }
   const v = profile[key];
   if (v === undefined || v === null || v === '') { return null; }
   return v;
  }
  function __mrExtraText(profile, key) {
   const v = __mrExtraRaw(profile, key);
   if (v === null) { return ''; }
   return (typeof v === 'object') ? '' : String(v);
  }
  function __mrExtraFlag(profile, key) {
   const v = __mrExtraRaw(profile, key);
   if (v === null) { return false; }
   if (typeof v === 'boolean') { return v; }
   const s = String(v).trim().toLowerCase();
   return !(s === '' || s === '0' || s === 'false' || s === 'off' || s === 'null');
  }
  function __mrExtraNumber(profile, key) {
   const v = __mrExtraRaw(profile, key);
   if (v === null) { return null; }
   const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
   if (isNaN(n)) { return null; }
   return Math.max(0, Math.min(100, Math.round(n)));
  }

/* ---- card entrance sequencing --------------------------------------------
 * Two modes, and mr.da "cardAnim" picks between them:
 *
 * stagger (default) - pure CSS. __mrCardSeqAssign() writes "--i" on each card and
 *   the rule in styles.css section 11 turns it into a delay. Nothing is scheduled
 *   in JS, which is why it survives a reload without any bookkeeping.
 *
 * oneAfterAnother - run here in JS, because the next card may only start once the
 *   previous one has really finished. Every card sits at animation:none until
 *   __mrCardChainRun() hands it its turn (the .is-mr-card-animating class), we wait
 *   for its animationend, and only then start the next. Nothing is pre-computed, so
 *   a card appended later by the infinite scroll never waits behind cards that
 *   animated minutes ago, and a duration edited in mr.da needs no index maths.
 */

function __mrCardAnimFlags() {
 const anim = (window[my1uzr.worknOnPg] || {}).cardAnim || {};
 return {
  chain: anim.oneAfterAnother === 1 || anim.oneAfterAnother === true,
  shuffle: anim.animateRandomly === 1 || anim.animateRandomly === true
 };
}

//a CSS time token as a number of ms, so JS can wait for exactly that long
function __mrCardTokenMs(name, fallbackMs) {
 try {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const s = String(raw).trim().toLowerCase();
  const m = /^(\d*\.?\d+)\s*(ms|s)?$/.exec(s);
  if (!m) { return fallbackMs; }
  const v = parseFloat(m[1]) * (m[2] === "s" ? 1000 : 1);
  return isFinite(v) ? v : fallbackMs;
 } catch (e) {
  return fallbackMs;
 }
}

function __mrShuffle(list) {
 for (let i = list.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  const tmp = list[i]; list[i] = list[j]; list[j] = tmp;
 }
 return list;
}

/* stagger: slot = position, capped at 12 so a long list never makes the last cards
 * wait seconds; everything past the cap shares the last delay. Shuffled when
 * animateRandomly is on, so even the stagger order follows no row order. */
function __mrCardSeqAssign(cards) {
 const n = cards.length;
 if (!n) { return; }
 const flags = __mrCardAnimFlags();
 const slots = new Array(n);
 for (let i = 0; i < n; i++) { slots[i] = Math.min(i, 12); }
 const order = flags.shuffle ? __mrShuffle(slots) : slots;
 for (let i = 0; i < n; i++) { cards[i].style.setProperty("--i", String(order[i])); }
}

/* ---- the oneAfterAnother runner -------------------------------------------
 * A run is identified by an id; starting a new run (a replay, or a page of new
 * cards) bumps the id, so the timers and listeners of the run before it notice
 * they are stale and hand over instead of starting a second, overlapping chain. */
let __mrCardChainQueue = [];
let __mrCardChainRunId = 0;
let __mrCardChainGrid = null;//the grid a sequence has already been started for

function __mrCardChainRun(cards, firstDelayMs) {
 const flags = __mrCardAnimFlags();
 /*a run that is still in flight may have a card mid-animation. Clear those markers
  * before the id moves on, so no card is left holding .is-mr-card-animating once a
  * new run owns the queue (its own next() still tidies up, but not the card that
  * was already shifted off the queue). */
 const marking = document.querySelectorAll(".profile-card.is-mr-card-animating");
 for (let i = 0; i < marking.length; i++) { marking[i].classList.remove("is-mr-card-animating"); }
 //cards of a grid that has since been replaced can never animate again
 __mrCardChainQueue = __mrCardChainQueue.filter(function (c) { return c.isConnected; });

 const runId = ++__mrCardChainRunId;
 const queue = flags.shuffle ? __mrShuffle(cards.slice()) : cards.slice();
 __mrCardChainQueue = __mrCardChainQueue.concat(queue);
 __mrCardChainStep(runId, firstDelayMs > 0 ? firstDelayMs : 0);
}

function __mrCardChainStep(runId, waitMs) {
 if (runId !== __mrCardChainRunId) { return; }//a newer run took over
 const card = __mrCardChainQueue.shift();
 if (!card) { return; }//the sequence is finished

 const go = function () {
  if (runId !== __mrCardChainRunId) { return; }
  if (!card.isConnected) { __mrCardChainStep(runId, 0); return; }//card was removed meanwhile
  card.classList.add("is-mr-card-animating");

  let done = false;
  const next = function () {
   if (done) { return; }
   done = true;
   card.classList.remove("is-mr-card-animating");
   //only the marker is unconditional; handing the queue on is up to the run that
   //still owns it
   if (runId !== __mrCardChainRunId) { return; }
   __mrCardChainStep(runId, 0);
  };
  card.addEventListener("animationend", next);
  //safety net: animationend never arrives when the animation is suppressed
  //(prefers-reduced-motion, or a display:none ancestor), and the rest of the grid
  //must not stay frozen behind it because of that
  setTimeout(next, __mrCardTokenMs("--mr-card-anim-dur", 700) + 400);
 };

 if (waitMs > 0) { setTimeout(go, waitMs); } else { go(); }
}

/* Entry point for every batch of cards. Stagger mode only needs the slot written,
 * which works while the cards are still detached from the document; the chain needs
 * a rendered element before an animation can run, so it is skipped here for a
 * detached batch and started by __mrCardChainStart() once the grid is on screen. */
function __mrCardSeqAssignOrRun(cards) {
 if (!cards || !cards.length) { return; }
 const flags = __mrCardAnimFlags();
 if (!flags.chain) { __mrCardSeqAssign(cards); return; }
 if (cards[0].isConnected) { __mrCardChainRun(cards, 0); }
}

/* Starts the sequence for a grid that is now in the document. mr.da firstDelay is
 * the wait before the very first card, honoured here so no card carries a CSS delay.
 * Skipped while the splash is still up: __mrReleaseCardAnim() starts it instead, so
 * the sequence cannot play out unseen underneath the splash. */
function __mrCardChainStart(cards) {
 if (!__mrCardAnimFlags().chain) { return; }
 const grid = document.getElementById("profiles-container");
 if (!grid || grid.classList.contains("app-splash-held")) { return; }
 const list = cards && cards.length ? cards : grid.querySelectorAll(".profile-card");
 if (!list.length) { return; }
 __mrCardChainRun(Array.prototype.slice.call(list), __mrCardTokenMs("--mr-card-anim-first-delay", 0));
}

/* Starts a sequence for a grid exactly once. The splash removes itself on its timer
 * AND through the failsafe, and both paths call __mrReleaseCardAnim(), so without
 * this the second one would restart the sequence half way through and every card
 * would play twice. A rebuilt grid is a new element, so it starts fresh again. */
function __mrCardChainStartOnce() {
 const grid = document.getElementById("profiles-container");
 if (!grid || __mrCardChainGrid === grid) { return; }
 __mrCardChainGrid = grid;
 __mrCardChainStart();
}

  /* Swaps a card photo from the shimmer to itself once its bytes land, and to the
   * "no photo" plate if they never do. Driven off the is-loading class the markup
   * just wrote, so a card with no src (or one already resolved from cache) is a
   * no-op here rather than something that can get stuck behind the shimmer. */
  function __mrWireCardImage(col) {
   const img = col.querySelector('.profile-thumbnail');
   if (!img || !img.classList.contains('is-loading')) { return; }
   const settle = () => { img.classList.remove('is-loading'); img.classList.add('is-loaded'); };
   img.addEventListener('load', settle, { once: true });
   img.addEventListener('error', () => {
    img.src = MR_NO_IMAGE_SVG;
    img.classList.add('is-failed');
    settle();
   }, { once: true });
   //a warm cache resolves before the listeners above are attached, and fires nothing
   if (img.complete && img.naturalWidth > 0) { settle(); }
  }

  window.createProfileCard = function (profile, cardIndex) {

  const uniqueProflID = profile.w || 'save profl again';
  const profileId = profile.a || 'N/A';
  const firstName = profile.m || 'Unknown';
  const thumbnail = profile.thumbnail;

  //the first row is the paint the user is actually waiting on, so it opts out of lazy loading
  const isFirstRow = typeof cardIndex === 'number' && cardIndex < MR_CARD_EAGER_COUNT;
  const imgLoading = isFirstRow ? 'eager' : 'lazy';
  const imgPriority = cardIndex === 0 ? ' fetchpriority="high"' : '';
  //with no src there is nothing to fade in, so the placeholder goes out already resolved
  const hasPhoto = !!thumbnail;
  const imgClass = hasPhoto ? 'profile-thumbnail is-loading' : 'profile-thumbnail is-loaded is-failed';
  const imgSrc = hasPhoto ? thumbnail : MR_NO_IMAGE_SVG;

  // Calculate age from birth date
  const age = profile.g ? calculateAge(profile.g) : 'Not specified';
  const height = profile.h ? formatHeight(profile.h) : null;
  const packageAmount = profile.i ? formatPackage(profile.i) : null;
  const natv_ct = profile.b4 !== undefined && profile.b4 !== null ? profile.b4 : null;
  //   const religion = profile.k ? getReligionName(profile.k.toString()) : null;

  // Check for QA badge
  const qaValue = (profile.qa || '').trim();
  //a non empty qa value is the app's "verified" signal (see shoBadge = "qa")
  const isVerified = qaValue.length > 0;
  //a paid package is what marks a profile premium / featured in this data model
  const isPremium = !!packageAmount;

  // Create comma-separated details string
  const fieldsOnCard = window[my1uzr.worknOnPg]?.fieldsOnCard || "m~s~g,h,k1,b4";
  const fieldLines = fieldsOnCard.split('~');
  const lineValues = fieldLines.map(line => {
   const fields = line.split(',');
   return fields.map(f => {
    const trimmed = f.trim();
    if (trimmed.startsWith("'") && trimmed.endsWith("'")) { return trimmed.slice(1, -1); }
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) { return trimmed.slice(1, -1); }
    if (trimmed === 'm') return firstName;
    if (trimmed === 'g') return age !== 'Not specified' ? `${age} yrs` : null;
    if (trimmed === 'h') return height;
    if (trimmed === 'i') return packageAmount;

    // Religion and Caste
    if (trimmed === 'k' || trimmed === 'k1') { const rlgn = window.var_caste_rlgns?.find(item => item.a == profile.k); if (trimmed === 'k') return rlgn ? rlgn.e : null; const caste = rlgn?.castes?.find(item => item.a == profile.k1); return caste ? caste.e : null; }
    // Sub-caste
    if (trimmed === 'k2') { const subCaste = window.var_sub_caste_type?.find(item => item.a == profile.k2); return subCaste ? subCaste.e : null; }
    if (trimmed === 's') {
     const degreeIds = profile.s ? String(profile.s).split(',').map(id => id.trim()) : [];
     if (degreeIds.length === 0) return null;
     const degreeNames = degreeIds.map(id => {
      const degree = window.var_degres?.find(item => item.a == id);
      return degree ? degree.e : null;
     }).filter(name => name !== null);
     return degreeNames.length > 0 ? degreeNames.join(', ') : null;
    }
    // Native country and city
    if (trimmed === 'b5' || trimmed === 'b4') { const country = window.var_ctco?.find(item => item.a == profile.b5); if (trimmed === 'b5') return country ? country.n : null; const city = country?.cities?.find(item => item.a == profile.b4); return city ? city.n : null; }

    return profile[trimmed] || null;
   }).filter(v => v !== null && v !== '').join(', ');
  });

  /* the structured rows below show name / age / height / city / education, so those
   * are dropped from the configurable facts block instead of being printed twice.
   * Everything else the owner put in fieldsOnCard still shows, unchanged. */
  const ageTxt = (age !== 'Not specified') ? `${age} yrs` : '';
  const cityTxt = __mrCityName(profile.b4);
  const degreeTxt = __mrDegreeNames(profile.s);
  const structured = [firstName, ageTxt, height, cityTxt, degreeTxt]
   .filter(Boolean).map(v => String(v).trim().toLowerCase());
  const facts = lineValues
   .map(line => (line || '').split(', ')
    .map(tok => tok.trim())
    .filter(tok => tok && structured.indexOf(tok.toLowerCase()) < 0)
    .join(', '))
   .filter(Boolean);

  const factsHtml = facts.length > 0
   ? `<div class="app-card__facts">${facts.map((line, idx) => `<div class="${idx === 0 ? 'app-detail-main' : (idx === 1 ? 'app-detail-sub' : 'app-detail-sub2')}">${__mrEscHtml(line)}</div>`).join('')}</div>`
   : '';

  /* meta row: age / height / city, only what we actually have */
  const metaItem = (icon, text) => (text
   ? `<span class="app-card__meta-item"><i class="fas fa-${icon}"></i>${__mrEscHtml(text)}</span>`
   : '');
  const metaHtml = metaItem('location-crosshairs', ageTxt)
   + metaItem('ruler-vertical', height)
   + metaItem('location-dot', cityTxt);

  const roleHtml = degreeTxt
   ? `<div class="app-card__role"><i class="fas fa-graduation-cap"></i>${__mrEscHtml(degreeTxt)}</div>`
   : '';

  /* bio / presence / match are opt-in: the owner names the field keys, and nothing
   * is rendered while they are empty (no public field holds free text today) */
  const extras = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].cardExtras) || {};
  const bioTxt = __mrExtraText(profile, extras.bio);
  const isOnline = __mrExtraFlag(profile, extras.online);
  const matchPct = __mrExtraNumber(profile, extras.match);

  const shortlisted = __mrIsShortlisted(uniqueProflID);

  const ringHtml = (matchPct === null) ? '' : `
      <div class="app-ring${matchPct >= 75 ? '' : ' app-ring--plain'}">
        <svg class="app-ring__svg" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
          <circle class="app-ring__track" cx="22" cy="22" r="19"></circle>
          <circle class="app-ring__bar" cx="22" cy="22" r="19"></circle>
        </svg>
        <span class="app-ring__val">${matchPct}%</span>
      </div>`;

  const col = document.createElement('div');
  //the Bootstrap column classes stay so the grid still works if styles.css 404s
  col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4 app-card';
  col.dataset.profileId = String(profileId);

  col.innerHTML = `
   <div class="card profile-card${isPremium ? ' is-featured' : ''}">
<div class="profile-image-container">
            <span class="app-thumb-ph" aria-hidden="true"></span>
            <img src="${__mrEscHtml(imgSrc)}"
                 alt="${__mrEscHtml(firstName)}"
                 class="${imgClass}"
                 onclick="showProfileDtls(${profileId})"
                 loading="${imgLoading}" decoding="async"${imgPriority}>
           <div class="profile-overlay"></div>

           ${!isPremium ? '<span class="app-sparkles"></span><span class="app-featured-ribbon">Featured</span>' : ''}
           ${isVerified ? `<span class="app-card__verified app-verified"><i class="fas fa-circle-check"></i>${__mrEscHtml(qaValue)}</span>` : ''}
           ${isPremium ? '<span class="app-card__premium app-premium"><i class="fas fa-crown"></i>Premium</span>' : ''}
           ${isOnline ? '<span class="app-card__presence app-presence is-online"></span>' : ''}
           ${ringHtml}

           <button type="button" class="app-card__heart${shortlisted ? ' is-shortlisted' : ''}"
                   data-mr-shortlist="${__mrEscHtml(uniqueProflID)}"
                   aria-pressed="${shortlisted}"
                   title="Add to shortlist" aria-label="Add to shortlist">
               <i class="${shortlisted ? 'fa-solid' : 'fas'} fa-heart"></i>
           </button>
       </div>

       <div class="app-card__body">
           <h3 class="app-card__name">${__mrEscHtml(firstName)}</h3>
           ${metaHtml ? `<div class="app-card__meta">${metaHtml}</div>` : ''}
           ${roleHtml}
           ${bioTxt ? `<p class="app-card__bio">${__mrEscHtml(bioTxt)}</p>` : ''}
           ${factsHtml}
           <span class="app-card__id app-chip" onclick="shareProfl(null, '${__mrEscHtml(uniqueProflID)}', null, null, null)">
               <i class="fas fa-hashtag"></i>${__mrEscHtml(uniqueProflID)}
           </span>
           <div class="app-card__actions">
               <button type="button" class="app-btn-primary"
                       onclick="showProfileDtls(${profileId})">
                   <i class="fas fa-eye"></i> View Profile
               </button>
           </div>
       </div>
   </div>
`;

if (matchPct !== null) {
   const ring = col.querySelector('.app-ring');
   if (ring) { ring.style.setProperty('--pct', String(matchPct / 100)); }
  }
  const heart = col.querySelector('.app-card__heart');
  if (heart) { heart.addEventListener('click', __mrToggleShortlist); }
  __mrWireCardImage(col);

  return col;
 }

 /* Re-runs the entrance on the cards that are already on screen, so the timing
  * from mr.da can be watched and tuned without a reload. Switches the animation
  * off, flushes the layout, then lets the stylesheet rule start it again from
  * each card's --i. Cards still held by the splash are skipped. */
 window.__mrReplayCardAnim = function () {
  const grid = document.getElementById('profiles-container');
  if (!grid) { console.warn('__mrReplayCardAnim: #profiles-container is not on the page'); return 0; }
  if (grid.classList.contains('app-splash-held')) {
   console.warn('__mrReplayCardAnim: the splash is still up, the grid is held back until it lifts');
   return 0;
  }
  const cards = grid.querySelectorAll('.profile-card');
  const flags = __mrCardAnimFlags();
  if (flags.chain) {
   /*the sequence is run by JS, so a replay is just a fresh run: dropping the queue
    * and bumping the run id cancels the chain in flight (its timers and listeners
    * see a stale id and hand over) and hands the first card its turn again. */
   for (let i = 0; i < cards.length; i++) { cards[i].classList.remove('is-mr-card-animating'); }
   __mrCardChainQueue = [];
   __mrCardChainStart(cards);
  } else {
   //stagger mode is pure CSS: switch it off, flush the layout, then let the rule
   //read --i again so every animation-delay is counted from now
   for (let i = 0; i < cards.length; i++) { cards[i].style.animation = 'none'; }
   void document.body.offsetHeight;//flush, so re-reading the rule restarts it
   for (let j = 0; j < cards.length; j++) { cards[j].style.animation = ''; }
  }
  console.info('[mr] replayed the card entrance on ' + cards.length + ' cards'
   + (flags.chain ? ' (one after another' + (flags.shuffle ? ', random order' : '')
    + ' - the last one starts when the one before it has finished)' : ' (stagger)'));
  return cards.length;
 };

 // Helper function to get religion name from code
 function getReligionName(religionCode) {
  const religionMap = {
   '1': 'Islam',
   '2': 'Christian',
   '3': 'Buddhism',
   '4': 'Hindu',
   '5': 'Jain',
   '6': 'Lingayat',
   '7': 'Unaffiliated',
   '8': 'Sikh',
   '9': 'Judaism'
  };

  return religionMap[religionCode] || null;
 }

 // Helper function to calculate age from birth date
 function calculateAge(dateString) {
  try {
   // Extract just the date part (before the space)
   const dateOnly = dateString.split(' ')[0];
   const birthDate = new Date(dateOnly);
   const today = new Date();

   let age = today.getFullYear() - birthDate.getFullYear();
   const monthDiff = today.getMonth() - birthDate.getMonth();

   // Adjust age if birthday hasn't occurred yet this year
   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
   }

   return age;
  } catch (e) {
   return 'Unknown';
  }
 }

 // Helper functions to format the data
 function formatDate(dateString) {
  try {
   // Extract just the date part (before the space)
   const dateOnly = dateString.split(' ')[0];
   const date = new Date(dateOnly);

   // Format as DD/MM/YYYY
   const day = date.getDate().toString().padStart(2, '0');
   const month = (date.getMonth() + 1).toString().padStart(2, '0');
   const year = date.getFullYear();

   return `${day}/${month}/${year}`;
  } catch (e) {
   return dateString; // Return original if parsing fails
  }
 }

 function formatHeight(height) {
  // Assuming height is in format like 5.10 (5 feet 10 inches)
  const feet = Math.floor(height);
  const inches = Math.round((height - feet) * 12);

  return `${feet}' ${inches}"`;
 }

 function formatPackage(packageValue) {
  // Assuming package is in lakhs like 1.2 (1.2 lakhs)
  return `₹${packageValue} Lakhs`;
 }

 // Function to create loader element
 function createLoader() {
  const loader = document.createElement('div');
  loader.id = 'infinite-scroll-loader';

  loader.innerHTML = `
       <div class="spinner-border text-primary app-spinner-primary" role="status">
           <span class="visually-hidden">Loading...</span>
       </div>
       <p class="text-muted mt-2">Loading more profiles...</p>
   `;

  return loader;
 }

 // Function to setup infinite scroll
 function setupInfiniteScroll() {
  window.addEventListener('scroll', handleScroll);
 }

 // Function to handle scroll events
 async function handleScroll() {
  // Don't fetch if already fetching or no more records
  if (isFetching || !hasMore) return;

  // Get the profiles container
  const container = document.getElementById('profiles-container');
  if (!container) return;

  // Get all profile cards
  const allCards = container.querySelectorAll('.profile-card');
  if (allCards.length === 0) return;

  // Find the last visible card
  let lastVisibleIndex = -1;
  for (let i = allCards.length - 1; i >= 0; i--) {
   const rect = allCards[i].getBoundingClientRect();
   if (rect.top < window.innerHeight) {
    lastVisibleIndex = i;
    break;
   }
  }

  // If we found a visible card
  if (lastVisibleIndex >= 0) {
   // Calculate how many cards remain after the last visible one
   const remainingCards = allCards.length - 1 - lastVisibleIndex;

   // Trigger load when 3 or fewer cards remain
   if (remainingCards <= window[my1uzr.worknOnPg].pullWhenCardsRemain) {
    await loadMoreProfiles();
   }
  }
 }

 // Function to load more profiles
 async function loadMoreProfiles() {
  if (isFetching) return;

  isFetching = true;
  currentPage++;

  try {
   // Show loader
   const loaderContainer = document.getElementById('loader-container');
   if (loaderContainer) {
    loaderContainer.innerHTML = '';
    loaderContainer.appendChild(createLoader());
   }

   // Fetch more profiles
   const result = await pullNwProfiles();
   const newProfiles = result.profiles || [];
   hasMore = result.hasMore;

   if (newProfiles.length > 0) {
    // Append to existing profiles
    profilesData = [...profilesData, ...newProfiles];

    // Append new cards to container
    const container = document.getElementById('profiles-container');
    if (container) {
     const batch = [];
     newProfiles.forEach(profile => {
      const profileCard = createProfileCard(profile);
      container.appendChild(profileCard);
      batch.push(profileCard);
     });
     //these cards are already on the page, so a oneAfterAnother run can start here
     __mrCardSeqAssignOrRun(batch);
    }
   }

   // Update loader
   if (loaderContainer) {
    if (hasMore && newProfiles.length > 0) {
     loaderContainer.innerHTML = '<div class="text-center text-muted p-3">Scroll down for more profiles...</div>';
    } else if (!hasMore) {
     loaderContainer.innerHTML = '<div class="text-center text-muted p-3">No more profiles to load</div>';
    } else {
     loaderContainer.innerHTML = '';
    }
   }

  } catch (error) {
   console.error('Error loading more profiles:', error);

   // Show error message
   const loaderContainer = document.getElementById('loader-container');
   if (loaderContainer) {
    loaderContainer.innerHTML = `
       <div class="text-center p-3">
         <p class="text-danger">Failed to load more profiles</p>
         <button onclick="retryLoadMore()" class="btn btn-sm btn-outline-primary">
           Retry
         </button>
       </div>
     `;
   }

   // Reset page counter on error
   currentPage--;
  } finally {
   isFetching = false;
  }
 }

 // Function to create footer
  function createFooter() {
   const footer = document.createElement('footer');
   footer.id = 'mr-footer';
   footer.className = 'bg-dark text-white text-center py-3 app-footer';

   footer.innerHTML = `
           <div class="container">
               <div class="app-footer__brand">${__mrEscHtml(appOwner.en || 'Matrimony App')}</div>
               <div class="app-footer__links">
                   <a href="#" onclick="return false;">Privacy</a>
                   <a href="#" onclick="return false;">Terms</a>
                   <a href="#" onclick="return false;">Report a profile</a>
               </div>
               <p class="mb-0">
                   &copy; ${new Date().getFullYear()} ${__mrEscHtml(appOwner.en || 'Matrimony App')}
                   by sifr. All rights reserved.
               </p>
           </div>
       `;

   return footer;
  }


 // Function to add meta viewport for mobile
 function addViewportMeta() {
  // Check if viewport meta already exists
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
   meta = document.createElement('meta');
   meta.name = 'viewport';
   meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
   document.head.appendChild(meta);
  }
 }

 // Main initialization function
 async function initializeApp() {
  try {
   // Show flash image
   showFlashImage();

   loadBackgroundScripts();
   console.log('Matrimony App initialized successfully');

  } catch (error) {
   console.error('Error initializing app:', error);

   // Show error in body
   document.body.innerHTML = `
   <div class="app-error-page">
       <div>
           <h2>Application Error</h2>
           <p>Failed to initialize the application. Please try again.</p>
           <p class="app-error-details">Error: ${error.message}</p>
           <!-- UPDATED BUTTON -->
           <button onclick="safeReload()" 
                   class="btn btn-pink-gradient mt-3 px-4">
               Reload Application
           </button>
       </div>
   </div>
`;
  }
 }


 async function checkUrlForIdParam() {
 }
 //the single start lives at the end of this file (__mrStartup). The public app's
 //half is published here, from inside its own IIFE, so that one entry runs both apps.
 __mrPublicAppStart = async function () {
  await initializeApp();
  checkUrlForIdParam();
 };

 // Expose some functions globally for debugging
 window.reloadApp = function () {
  safeReload();
 };

 window.showAppInfo = function () {
  alert(`App Owner: ${appOwner.en}\n` +
   `Entity: ${appOwner.eu}\n` +
   `Working on: ${my1uzr.worknOnPg}\n` +
   `Database: ${dbnm}`);
 };

 // Expose retry function globally
 window.retryLoadMore = async function () {
  await loadMoreProfiles();
 };

})();

//the public app's theme used to be this window.appcss literal, injected by
//addMobileStyles(); it now lives in styles.css (see __mrLoadStylesheet above).

// Builds a Drive URL for one token of the `u` / `b6` value.
// The token is used verbatim: the leading marker (e.g. "1_") is part of the
// stored id. Values that are already URLs or data URLs pass through.
window.mrDriveUrlFromToken = function mrDriveUrlFromToken(token) {
 if (token == null) return null;
 var t = String(token).trim();
 if (!t) return null;
 if (t.indexOf('://') !== -1 || t.indexOf('data:') === 0) return t;
 if (!/^[A-Za-z0-9_-]{20,}$/.test(t)) return null;
 return 'https://lh3.googleusercontent.com/d/' + t + '=s0?authuser=0';
}

/* getGoogleDriveImageUrl hands back anything that is not a bare Drive id exactly as it
   came in, and every caller here puts the result straight into an img src before
   falling back to profile.ut or the no-photo plate. So an unrecognised value has to
   stay null here, otherwise a half-written field turns into a broken image. */
window.mrImgSrcOrNull = function (value) {
  if (value == null) return null;
  var v = String(value).trim();
  if (!v) return null;
  if (v.indexOf('://') !== -1 || v.indexOf('data:') === 0 || v.indexOf('blob:') === 0) { return v; }
  return null;
}

/* getGoogleDriveImageUrl splits on whitespace and hands back the SECOND token when its
   second argument is set. This app's `u` runs the other way - token 1 is the thumbnail
   and token 2, when there is one, is the display copy - so the flag is passed inverted
   on purpose. mrDriveUrlFromToken stays as the fallback for a my1e3.js too old to carry
   the helper; it ignores the second argument, which costs us pairs and nothing else. */
window.mrUrlFromU = function (value, isThumb) {
  var fn = (typeof window.getGoogleDriveImageUrl === 'function')
   ? window.getGoogleDriveImageUrl
   : window.mrDriveUrlFromToken;
  return window.mrImgSrcOrNull(fn(value, !isThumb));
}

// Resolves a raw `u` value into { display, thumbnail }. Four shapes are accepted:
// a bare Drive file id, two space separated ids (token 1 is the thumbnail, token 2
// the display copy), an already complete url or data url, and the legacy
// {a: display, b: thumbnail} object as a real object or as a JSON string.
window.mrResolveProfileImages = function mrResolveProfileImages(value) {
  var out = { display: null, thumbnail: null };
  if (value == null) return out;

  if (typeof value === 'object') {
   out.display = window.mrUrlFromU(value.a, false);
   out.thumbnail = window.mrUrlFromU(value.b, true) || out.display;
   return out;
  }

  var raw = String(value).trim();
  if (!raw) return out;

  // A JSON string that holds the legacy object form.
  if (raw.charAt(0) === '{') {
   try { return window.mrResolveProfileImages(JSON.parse(raw)); } catch (e) { }
  }

  out.thumbnail = window.mrUrlFromU(raw, true);
  out.display = window.mrUrlFromU(raw, false) || out.thumbnail;
  return out;
}

// Resolves the `b6` gallery value into a list of
// { thumbnail, display, raw }. `raw` is the original element so a delete can
// re-serialize the array without changing the stored format.
window.mrResolveGalleryImages = function mrResolveGalleryImages(value) {
 var arr = [];
 if (value == null) return arr;

 if (typeof value === 'string') {
  try { value = JSON.parse(value); } catch (e) { return arr; }
 }
 if (!Array.isArray(value)) return arr;

 value.forEach(function (el) {
  if (el == null) return;
  var imgs = window.mrResolveProfileImages(el);
  if (!imgs.thumbnail && !imgs.display) return;
  arr.push({ thumbnail: imgs.thumbnail, display: imgs.display, raw: el });
 });
 return arr;
}

function applyProfileImageData(profile) {
 const imageData = window.mrResolveProfileImages(profile.u);

 // Extract thumbnail and original image
 if (imageData.thumbnail) {
  profile.thumbnail = imageData.thumbnail;
  profile.originalImage = imageData.display || imageData.thumbnail;
 } else if (profile.ut) {
  profile.thumbnail = profile.ut;
  profile.originalImage = profile.ut;
 } else {
  profile.thumbnail = MR_NO_IMAGE_SVG;
  profile.originalImage = null;
 }

 return profile;
}
window.applyProfileImageData = applyProfileImageData;

async function pullNwProfiles(whr = null, reset = false) {
 let tmp = [];
 try {
  payload0.vw = 4;
  payload0.fn = 64;

  // Get the lowest date-time from existing profiles for pagination
  let lowestDateTime = null;

  // ONLY use existing profiles for pagination if NOT resetting
  if (!reset) {
   const existingProfiles = profilesData || [];

   if (existingProfiles.length > 0) {
    // Convert date strings to Date objects and find the lowest
    const dateObjects = existingProfiles.map(p => new Date(p.b));
    const validDates = dateObjects.filter(d => !isNaN(d.getTime()));

    if (validDates.length > 0) {
     // Find the lowest (earliest) date
     lowestDateTime = validDates.reduce((earliest, current) =>
      current < earliest ? current : earliest
     );

     // Format back to string in "YYYY-MM-DD HH:MM:SS" format
     const year = lowestDateTime.getFullYear();
     const month = String(lowestDateTime.getMonth() + 1).padStart(2, '0');
     const day = String(lowestDateTime.getDate()).padStart(2, '0');
     const hours = String(lowestDateTime.getHours()).padStart(2, '0');
     const minutes = String(lowestDateTime.getMinutes()).padStart(2, '0');
     const seconds = String(lowestDateTime.getSeconds()).padStart(2, '0');

     lowestDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
   }
  }

  // Send the lowest date-time or null if no dates found or resetting
  payload0.x1 = (reset || !lowestDateTime) ? '' : lowestDateTime;
  const whrStr = whr || '';
  /*the localStorage copy of myEinMR also narrows the HOME page query down to that one
   * profile. __mrHandleSuResponse drops that copy as soon as the server marks the row
   * d < 0 (see the fn==69 branch), but nothing removes it if the profile was paid off or
   * deleted while the tab was closed - and then this query returns nothing at all, so the
   * whole card list silently disappears. A stored row we already know is not live must
   * not be allowed to hide every other profile: fall back to the normal query. */
   /* the narrowing value has to EXIST before it may be used. This used to read
    * "!myEinMR || !myEinMR.w || ..." which is true when there is no stored profile
    * at all (myEinMR is {} - see its declaration), so the branch below built
    * w = 'undefined', matched no row, and every visitor without a stored profile
    * got an empty card list. */
   const storedProflW = (myEinMR && typeof myEinMR.w === 'string') ? myEinMR.w.trim() : '';
   const storedProflUsable = storedProflW !== '' && (!myEinMR.d || myEinMR.d >= 0);
   if (whrStr.trim() === '' && storedProflUsable && payload0.x1 === '') {
    payload0.whr = "w = '" + storedProflW + "'";
   } else {
    payload0.whr = whrStr;
   }
const response = await fnj3("https://my1.in/2/g.php", payload0, 0, true, null, 20000, 0, 1, 1, 0);
   __mrCardDiag('pullNwProfiles', 'su=' + response.su
    + ' hasMr=' + (!!response.mr)
    + ' rows=' + (response.mr && response.mr.l ? response.mr.l.length : 'NO-mr.l')
    + ' whr=' + JSON.stringify(payload0.whr)
    + ' x1=' + JSON.stringify(payload0.x1));

   if (response.su == 1) {
   //hndl_mrrspo(response, 0, null, null, payload0);
   const profiles = (response.mr.l || []).map(applyProfileImageData);

   /*this path used to return an empty list with no trace at all, which is why a wrong
    * whr (see storedProflUsable above) looked identical to "there are no profiles". */
   if (profiles.length === 0) {
    console.warn("[mr] g.php answered su=1 but carried no rows. whr=\"" + payload0.whr
     + "\" x1=\"" + payload0.x1 + "\" storedMyEinMR=\""
     + ((myEinMR && myEinMR.w) || "none") + "\"");
   }

   return {
    profiles: profiles,
    hasMore: response.mr.hasMore || (profiles.length > 0 || false)
   };
  } else {
   console.warn("[mr] g.php did not answer su=1 (su=" + response.su
    + "). whr=\"" + payload0.whr + "\" - the card list falls back to empty");
   return {
    profiles: [],
    hasMore: false
   };
  }
 } catch (error) {
  console.warn("[mr] g.php request failed: "
   + (error && error.message ? error.message : error));
  return {
   profiles: [],
   hasMore: false
  };
 }
}



async function showProfileDtls(profileId) {
 //  const t351mp = await chkIfLoggedIn();
 //  if (t351mp.su == 1)
 //   (async () => { await loadExe2Fn(36, [profileId], [1]); })();
 //  else
 //   (async () => { await loadExe2Fn(5, [], [1]); })();

 //  if (t351mp.su == 1) {

 //thus below code to create modal every time;

 // Get the modal element, hide it and remove it from the DOM (shared helper)
 __mrDestroyModal("mra_");


 let profileData;
 let showUtilizeProfileButton = 0;

 let addingAllowed = 0;
 let addMultAllowd = 0;//2
 let edtingAllowed = 0;
 let edtOldAllowed = false;

 if (proflFullData == null)
  proflFullData = await dbDexieManager.getAllRecords(dbnm, "mr") || [];
 if (profileId == 0) {
  if (myEinMR && myEinMR.a > 0)
   profileData = myEinMR;
  else
   profileData = { "d": 0, "e": 0, "g": "", "j": 0, "q": "", "qa": "", "qb": "", "qc": "", "x": "", "z": "", "a2": "", "c6": "", "a9": "", "a5": 0, "a7": 0, "b6": [], "u": "", "k": 0, "k1": 0, "k2": 0, "a3": 97, "b4": "27", "b5": 97, "c5": 97 };
  addingAllowed = 1;
  addMultAllowd = 2;
  edtingAllowed = 1;
  edtOldAllowed = true;
  showUtilizeProfileButton = 2;
 } else {
  profileData = proflFullData.find(item => item.a === profileId);
  if (profileData == null) {
   profileData = profilesData.find(item => item.a === profileId);
   showUtilizeProfileButton = 1;
  }
 }
 let required_data = [];
 required_data[1] = 1;//display modal;
 required_data[2] = fieldNameMap;//field labels;
 required_data[3] = profileData;//json-data
 let fnToUse = "setValByProprtyToElm";
 let fnInsdeFileToUse = "fn_setValToGvnInputs('" + required_data[0] + "','b5')";
 let valOfC = "var_ctco,cities";
 if (window[my1uzr.worknOnPg]?.fileToUseForSelectingNativeCity) {
  fnToUse = "setValByPrprtyDepthToElm";
  fnInsdeFileToUse = "fn_setValToGvnInputs('" + required_data[0] + "','b5')";
  valOfC = "var_ctco,dstrcts,thsls";
 }
 let dpthComulsoryForNativeAddress = 0;
 if (window[my1uzr.worknOnPg]?.depthComulsoryForNativeAddress)
  dpthComulsoryForNativeAddress = window[my1uzr.worknOnPg]?.depthComulsoryForNativeAddress;
 required_data[4] = [{ "a": "e", "b": "set_mra_e", "canEdit": edtingAllowed, "params": [mono_fl_csh_no, [mono_loader_id, mono_show_modal, mono_dv_el_id, mono_callBackFn, mono_input_el_id], [1]] }, { "a": "g", "b": "set_dtt", "c": "yyyy-mm-dd HH:MM:SS", "d": window[my1uzr.worknOnPg].bdayFormat }, { "a": "j", "b": "setValByProprtyToElm", "c": "marital_status", "canAdd": addingAllowed }, { "a": "k", "b": "setValByProprtyToElm", "c": "var_caste_rlgns", "canAdd": addingAllowed }, { "a": "k1", "b": "setValByProprtyToElm", "c": "var_caste_rlgns,castes", "e": profileData.k, "g": "fn_setValToGvnInputs('" + required_data[0] + "','k')", "canAdd": addingAllowed }, { "a": "k2", "b": "setValByProprtyToElm", "c": "var_sub_caste_type", "canAdd": addingAllowed }, { "a": "a3", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": addingAllowed }, { "a": "a2", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.a3, "g": "fn_setValToGvnInputs('" + required_data[0] + "','a3')", "canAdd": addingAllowed }, { "a": "b5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": addingAllowed }, { "a": "b4", "b": fnToUse, "c": valOfC, "e": profileData.b5, "g": fnInsdeFileToUse, "canAdd": addingAllowed, "depthForNative": dpthComulsoryForNativeAddress }, { "a": "c5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": addingAllowed }, { "a": "c6", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.c5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','c5')", "canAdd": addingAllowed }, { "a": "q", "b": "setValByProprtyToElm", "c": "mr_job_types", "canAdd": addingAllowed }, { "a": "qa", "b": "setValByProprtyToElm", "c": "mr_desig_posis", "canAdd": addingAllowed }, { "a": "qb", "b": "setValByProprtyToElm", "c": "mr_bsns_forms", "canAdd": addingAllowed }, { "a": "qc", "b": "setValByProprtyToElm", "c": "mr_bsns_typs", "canAdd": addingAllowed }, { "a": "s", "b": "setValByProprtyToElm", "c": "var_degres", "canAdd": addMultAllowd }, { "a": "a9", "b": "setValByProprtyToElm", "c": "var_lngs", "canAdd": addMultAllowd }, {
  "a": "b6", "b": "setGalleryImages", "canAdd": addingAllowed, "driveMl": window[my1uzr.worknOnPg].driveMl,
  "thumbnailSize": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].thumbnailSize !== undefined && window[my1uzr.worknOnPg].thumbnailSize !== null) ? window[my1uzr.worknOnPg].thumbnailSize : ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== undefined && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== null) ? window[my1uzr.worknOnPg].clientConfig.thumbnailSize : 600)),  // Add thumbnail size
  "resizeBy": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.resizeBy !== undefined && window[my1uzr.worknOnPg].clientConfig.resizeBy !== null) ? window[my1uzr.worknOnPg].clientConfig.resizeBy : 0)
 }, { "a": "x", "b": "setSiblingTags", "canAdd": addingAllowed, "params": [sibling_fl_csh_no, [sibling_loader_id, sibling_dv_el_id, sibling_show_modal, sibling_callBackFn, sibling_input_el_id], [1]] }, { "a": "z", "b": "setValByProprtyToElm", "c": "bloodGroups", "canAdd": addingAllowed }, { "a": "a5", "b": "setValByProprtyToElm", "c": "var_genders", "canAdd": addingAllowed }, { "a": "a7", "b": "setValByProprtyToElm", "c": "relation_with_regr", "d": "string1", "e": -1, "canAdd": addingAllowed }, {
  "a": "u",
  "b": "prepImgByURL", "driveMl": window[my1uzr.worknOnPg].driveMl,
  "canEdit": edtOldAllowed,
  "thumbnailSize": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].thumbnailSize !== undefined && window[my1uzr.worknOnPg].thumbnailSize !== null) ? window[my1uzr.worknOnPg].thumbnailSize : ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== undefined && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== null) ? window[my1uzr.worknOnPg].clientConfig.thumbnailSize : 600)),  // Add thumbnail size
  "resizeBy": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.resizeBy !== undefined && window[my1uzr.worknOnPg].clientConfig.resizeBy !== null) ? window[my1uzr.worknOnPg].clientConfig.resizeBy : 0)         // 0 = resize by width, 1 = resize by height
  //"folderName": "my1_mr" // optional folder name
 }];
 // Image add / replace must work on the update flow too; both buttons open my1img (csh 51).
 // Overridden per field so the other addingAllowed / edtOldAllowed gated fields keep
 // their current behaviour (siblings, degrees, languages, lookups, ...).
 const imgCfgGallery = required_data[4].find(f => f && f.a === 'b6');
 if (imgCfgGallery) imgCfgGallery.canAdd = 1;
 const imgCfgDp = required_data[4].find(f => f && f.a === 'u');
 if (imgCfgDp) imgCfgDp.canEdit = true;

 required_data[5] = [];
 required_data[6] = [];
 if (profileData.d > -1) {
  required_data[6] = [{ "a": "Share profile", "e": "shareProfl" }];
 }
 const delSttts = (myEinMR && myEinMR.d) ? myEinMR.d : 0;
 if (profileId == 0 && delSttts > -1) {
  if (profileData.d > -1) {
   const fun2DeleteAsClient = 69;
   required_data[6].push({ "a": "Delete profile", "e": "confirmLeaveProfile", "runFnOnOk": "useLeaveCount", "runFnOnCancel": "showCancelToastAndCloseModal", "fnNo2Del": fun2DeleteAsClient });
  } else {
   required_data[6].push({ "a": "profile already submitted to delete", "e": "functionNotExisting" });
  }
 }

 required_data[7] = window[my1uzr.worknOnPg].seqnce;//sequence
 if (showUtilizeProfileButton == 1) {
  if (myEinMR?.a !== profileData.a) {
   const functionNumber = 66;
   required_data[9] = [{ "a": "Unlock profile", "e": "confirmUnlockProfile", "runFnOnOk": "useOrSetAsideProfile", "runFnOnCancel": "showCancelToastAndCloseModal", "colsToSubmit": "a", "fnNo": functionNumber, "functionParam": "mu" }];
  } else {
   //don't give here update, let client update from drawer menu;
  }
 } else if (showUtilizeProfileButton == 2) {
  const functionNumber = 68; const update1New0 = 0;
  required_data[9] = [{ "a": "Update your profile", "e": "saveProfileChanges", "f": window[my1uzr.worknOnPg].colsToSubmit, "g": functionNumber, "h": update1New0 }];
 }
 if (profileId == 0) {
  const t351mp = await chkIfLoggedIn();
  if (t351mp.su == 1) {
   required_data[0] = "mra_e_";//unique prefix for modal dialogue
   required_data[8] = window[my1uzr.worknOnPg].colsToHide;
   await loadExe2Fn(46, required_data, [1]);
  } else { (async () => { await loadExe2Fn(5, [], [1]); })(); }
 } else {
  required_data[0] = "mra_";//unique prefix for modal dialogue
  required_data[8] = window[my1uzr.worknOnPg].colsOfOthersHide;
  if (window[my1uzr.worknOnPg]?.showTableViewOnCardClick != 1)
   await loadExe2Fn(38, required_data, [1]);
  else {
   if (profileData?.l?.length > 0) {
    required_data[8] = window[my1uzr.worknOnPg].colsHideOnFullDetails;
    await loadExe2Fn(38, required_data, [1]);
   } else
    await loadExe2Fn(48, required_data, [1]);
  }
 }
 //  }
 //  else {
 //   (async () => { await loadExe2Fn(5, [], [1]); })();
 //  }
}
// Global variable to track unlock count (you can adjust as needed)
let currentUnlockModal = null;
// function confirmUnlockProfile(inputId, value, divId, key, fullObject) {
//  // Get the button element that was clicked
// //  const buttonElement = document.getElementById(divId);
// //  if (!buttonElement) return;

//  // Get the function names from fullObject
//  const onOkFunction = fullObject.originalItem.runFnOnOk;
//  const onCancelFunction = fullObject.originalItem.runFnOnCancel;

//  // Create modal dynamically
//  const modalId = 'confirm_unlock_modal';

//  // Remove existing modal if any
//  const existingModal = document.getElementById(modalId);
//  if (existingModal) {
//   const bsModal = bootstrap.Modal.getInstance(existingModal);
//   if (bsModal) bsModal.hide();
//   existingModal.remove();
//  }

//  // Create new modal
//  const modalObj = create_modal_dynamically(modalId);
//  const modalInstance = modalObj.modalInstance;
//  const modalElement = modalObj.modalElement;
//  const modalBody = modalObj.contentElement;

//  // Add custom class for styling
//  modalElement.classList.add('confirm-unlock-modal');

//  // Set modal size
//  const modalDialog = modalElement.querySelector('.modal-dialog');
//  modalDialog.classList.add('modal-sm');

//  // Create modal content
//  const modalContent = modalElement.querySelector('.modal-content');
//  modalContent.innerHTML = '';

//  // Create header
//  const header = document.createElement('div');
//  header.className = 'modal-header';
//  header.style.cssText = 'background: linear-gradient(135deg, #dc3545, #b02a37); color: white; border-bottom: none;';
//  header.innerHTML = `
//   <h5 class="modal-title" style="color: white;">
//   <i class="fas fa-exclamation-triangle me-2"></i>Confirm Unlock
//   </h5>
//   <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
//  `;

// // Create body
// const body = document.createElement('div');
// body.className = 'modal-body text-center';
// body.style.cssText = 'padding: 2rem;';
// body.innerHTML = `
//   <button type="button" class="btn btn-info" id="checkMyCountBtn" style="border-radius: 50px; padding: 8px 20px !important; margin-bottom: 33px !important; background: linear-gradient(135deg, #17a2b8, #138496) !important; color: white !important; border: none; box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);">
//   <i class="fas fa-sync-alt me-2"></i>Check My New Count
//   </button>
//   <div style="font-size: 48px; margin-bottom: 15px;">
//   <i class="fas fa-lock-open" style="color: #dc3545;"></i>
//   </div>
//   <h4 style="margin-bottom: 15px;">Unlock Profile?</h4>
//   <p style="color: #6c757d; margin-bottom: 5px;">
//   You have <strong>${profileUnlockCount}</strong> unlock attempts remaining.
//   </p>
//   <p style="color: #6c757d; font-size: 14px;">
//   Are you sure you want to unlock this profile?
//   </p>
//   <div id="unlockWarningText" style="display: none; color: #dc3545; font-size: 14px; font-weight: 600; margin-top: 15px; animation: blink 1s infinite;">
//   After unlocking, you can see only that information, which is filled by this party. Proceed with unlock?
//   </div>
// `;

//  // Create footer
//  const footer = document.createElement('div');
//  footer.className = 'modal-footer d-flex justify-content-center gap-3 border-top-0';
//  footer.style.cssText = 'border-top: none; padding-bottom: 1.5rem;';
//  footer.innerHTML = `
//   <button type="button" class="btn btn-secondary" id="cancelUnlockBtn" style="border-radius: 50px; padding: 8px 24px;">
//   <i class="fas fa-times me-2"></i>Cancel
//   </button>
//   <button type="button" class="btn btn-danger" id="confirmUnlockBtn" style="border-radius: 50px; padding: 8px 24px;">
//   <i class="fas fa-check me-2"></i>Unlock
//   </button>
//  `;

//  modalContent.appendChild(header);
//  modalContent.appendChild(body);
//  modalContent.appendChild(footer);

//  // Store references for event handlers
//  currentUnlockModal = {
//   modalInstance: modalInstance,
//   modalElement: modalElement,
//   onOkFunction: onOkFunction,
//   onCancelFunction: onCancelFunction,
//   inputId: inputId,
//   value: value,
//   divId: divId,
//   key: key,
//   fullObject: fullObject
//  };

//  // Add event listeners after modal is in DOM
//  setTimeout(() => {
//  const checkMyCountBtn = document.getElementById('checkMyCountBtn');
//  if (checkMyCountBtn) {
//   checkMyCountBtn.onclick = () => { chkMyCount(); };
//  }

//   const confirmBtn = document.getElementById('confirmUnlockBtn');
//   const cancelBtn = document.getElementById('cancelUnlockBtn');

//   if (confirmBtn) {
//   confirmBtn.onclick = () => {
// if (confirmBtn) {
//  let unlockClickedOnce = false;
//  confirmBtn.onclick = () => {
//   if (!unlockClickedOnce) {
//   unlockClickedOnce = true;
//   const warningText = document.getElementById('unlockWarningText');
//   if (warningText) { warningText.style.display = 'block'; }
//   confirmBtn.textContent = 'Confirm Unlock';
//   confirmBtn.style.background = 'linear-gradient(135deg, #c82333, #a71d2a)';
//   } else {
//   if (currentUnlockModal && currentUnlockModal.onOkFunction && typeof window[currentUnlockModal.onOkFunction] === 'function') {
//     window[currentUnlockModal.onOkFunction](currentUnlockModal.inputId,currentUnlockModal.value,currentUnlockModal.divId,currentUnlockModal.key,currentUnlockModal.fullObject);
//   }
//   if (currentUnlockModal && currentUnlockModal.modalInstance) { currentUnlockModal.modalInstance.hide(); }
//   }
//  };
// }
//     /*if (currentUnlockModal && currentUnlockModal.onOkFunction && typeof window[currentUnlockModal.onOkFunction] === 'function') {
//      window[currentUnlockModal.onOkFunction](
//       currentUnlockModal.inputId,
//       currentUnlockModal.value,
//       currentUnlockModal.divId,
//       currentUnlockModal.key,
//       currentUnlockModal.fullObject
//      );
//     }
//     if (currentUnlockModal && currentUnlockModal.modalInstance) {
//      currentUnlockModal.modalInstance.hide();
//     }*/
//   };
//   }

//   if (cancelBtn) {
//   cancelBtn.onclick = () => {
//     if (currentUnlockModal && currentUnlockModal.onCancelFunction && typeof window[currentUnlockModal.onCancelFunction] === 'function') {
//      window[currentUnlockModal.onCancelFunction](
//       currentUnlockModal.inputId,
//       currentUnlockModal.value,
//       currentUnlockModal.divId,
//       currentUnlockModal.key,
//       currentUnlockModal.fullObject
//      );
//     }
//     if (currentUnlockModal && currentUnlockModal.modalInstance) {
//      currentUnlockModal.modalInstance.hide();
//     }
//   };
//   }
//  }, 100);

//  // Handle modal close on backdrop click
//  modalElement.addEventListener('hidden.bs.modal', function () {
//   currentUnlockModal = null;
//  });

//  // Show modal
//  modalInstance.show();
// }
async function confirmUnlockProfile(inputId, value, divId, key, fullObject) {
 // Get the function names from fullObject
 const onOkFunction = fullObject.originalItem.runFnOnOk;
 const onCancelFunction = fullObject.originalItem.runFnOnCancel;

 // Get counts at start
 const profileRecs = await dbDexieManager.getAllRecords(dbnm, "mr") || [];
 let usedCount = profileRecs.length;
 if (myEinMR && myEinMR.a) { usedCount = usedCount - 1; }
 remainingProflCnt = profileUnlockCount - usedCount;

 // Create modal dynamically
 const modalId = 'confirm_unlock_modal';
 const existingModal = document.getElementById(modalId);
 if (existingModal) { const bsModal = bootstrap.Modal.getInstance(existingModal); if (bsModal) bsModal.hide(); existingModal.remove(); }

 const modalObj = create_modal_dynamically(modalId);
 const modalInstance = modalObj.modalInstance;
 const modalElement = modalObj.modalElement;
 const modalBody = modalObj.contentElement;
 modalElement.classList.add('confirm-unlock-modal');
 const modalDialog = modalElement.querySelector('.modal-dialog');
 modalDialog.classList.add('modal-sm');
 const modalContent = modalElement.querySelector('.modal-content');
 modalContent.innerHTML = '';

 const header = document.createElement('div');
 header.className = 'modal-header app-unlock-header';
 header.innerHTML = `<h5 class="modal-title app-modal-title"><i class="fas fa-exclamation-triangle me-2"></i>Confirm Unlock</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>`;

 const body = document.createElement('div');
 body.className = 'modal-body text-center app-unlock-body';
 body.innerHTML = `
 <button type="button" class="btn btn-info app-btn-check-count" id="checkMyCountBtn">
  <i class="fas fa-sync-alt me-2"></i>Check My New Count
 </button>
 <div class="app-unlock-icon"><i class="fas fa-lock-open app-lock-open"></i></div>
 <h4 class="app-unlock-title">Unlock Profile?</h4>
 <p class="app-unlock-text">
  You have purchased <strong class="app-count-200">${profileUnlockCount}</strong> profile count<br>,
  You have unlocked <strong class="app-count-175">${usedCount}</strong> profiles,<br>
  Your remaining unlock count is <strong class="app-count-150">${remainingProflCnt > 0 ? remainingProflCnt : 0}</strong></p>
 <p class="app-unlock-note">Are you sure you want to unlock this profile?</p>
 <div id="unlockWarningText" class="app-unlock-warning">After unlocking, you can see only that information, which is filled by this party. Proceed with unlock?</div>
`;

 const footer = document.createElement('div');
 footer.className = 'modal-footer d-flex justify-content-center gap-3 border-top-0 app-unlock-footer';
 footer.innerHTML = `<button type="button" class="btn btn-secondary app-btn-unlock-opt" id="cancelUnlockBtn"><i class="fas fa-times me-2"></i>Cancel</button><button type="button" class="btn btn-danger app-btn-unlock-opt" id="confirmUnlockBtn"><i class="fas fa-check me-2"></i>Unlock</button>`;

 modalContent.appendChild(header);
 modalContent.appendChild(body);
 modalContent.appendChild(footer);

 currentUnlockModal = { modalInstance: modalInstance, modalElement: modalElement, onOkFunction: onOkFunction, onCancelFunction: onCancelFunction, inputId: inputId, value: value, divId: divId, key: key, fullObject: fullObject };

 setTimeout(() => {
  const checkMyCountBtn = document.getElementById('checkMyCountBtn');
  if (checkMyCountBtn) { checkMyCountBtn.onclick = () => { chkMyCount(); }; }
  const confirmBtn = document.getElementById('confirmUnlockBtn');
  const cancelBtn = document.getElementById('cancelUnlockBtn');
  if (confirmBtn) {
   let unlockClickedOnce = false;
   confirmBtn.onclick = () => {
     if (!unlockClickedOnce) { unlockClickedOnce = true; const warningText = document.getElementById('unlockWarningText'); if (warningText) { warningText.classList.add('is-visible'); } confirmBtn.textContent = 'Confirm Unlock'; confirmBtn.classList.add('is-confirmed'); }

    else { if (currentUnlockModal && currentUnlockModal.onOkFunction && typeof window[currentUnlockModal.onOkFunction] === 'function') { window[currentUnlockModal.onOkFunction](currentUnlockModal.inputId, currentUnlockModal.value, currentUnlockModal.divId, currentUnlockModal.key, currentUnlockModal.fullObject); } if (currentUnlockModal && currentUnlockModal.modalInstance) { currentUnlockModal.modalInstance.hide(); } }
   };
  }
  if (cancelBtn) { cancelBtn.onclick = () => { if (currentUnlockModal && currentUnlockModal.onCancelFunction && typeof window[currentUnlockModal.onCancelFunction] === 'function') { window[currentUnlockModal.onCancelFunction](currentUnlockModal.inputId, currentUnlockModal.value, currentUnlockModal.divId, currentUnlockModal.key, currentUnlockModal.fullObject); } if (currentUnlockModal && currentUnlockModal.modalInstance) { currentUnlockModal.modalInstance.hide(); } }; }
 }, 100);

 modalElement.addEventListener('hidden.bs.modal', function () { currentUnlockModal = null; });
 modalInstance.show();
}
async function useOrSetAsideProfile(inputId, value, divId, key, fullObject) {
 if (remainingProflCnt > 0) {
  console.log('Profile unlocked. Remaining attempts:', profileUnlockCount);
 } else {
  __mrToast("your profile count limit is finished", 'error', 5000);
  return;
 }

 // Show loader
 const loaderId = 'save_profile_loader';
 let loader = document.getElementById(loaderId);
 if (!loader) {
  loader = createDynamicLoader2(loaderId, 'Saving changes...', null);
 } else {
  loader.style.display = 'flex';
 }

 try {
  // Get parameters from fullObject.originalItem
  const colsToSubmit = fullObject.originalItem.colsToSubmit;
  const fn = fullObject.originalItem.fnNo;

  // Collect form data
  let formData = {};

  if (colsToSubmit) {
   // Split the comma-separated string
   let fieldsArray = [];
   if (typeof colsToSubmit === 'string') {
    fieldsArray = colsToSubmit.split(',').map(f => f.trim());
   } else if (Array.isArray(colsToSubmit)) {
    fieldsArray = colsToSubmit;
   }

   // Collect values from form fields
   const allFields = window.mraFormFields || {};

   for (const fieldKey of fieldsArray) {
    if (allFields[fieldKey] && allFields[fieldKey].input) {
     formData[fieldKey] = allFields[fieldKey].input.value;
    } else {
     // Try to get element by ID directly
     const element = document.getElementById(`mra__${fieldKey}`);
     if (element) {
      formData[fieldKey] = element.value;
     } else {
      formData[fieldKey] = '';
     }
    }
   }
  }

  console.log('FormData collected:', formData);
  console.log('Function number:', fn);

  // Get validation rules for this function
  const validationRules = window["vlidFn" + fn];
  if (validationRules) {
   const validationResult = cmnVldet(formData, validationRules);

   if (validationResult.su !== 1) {
    // Hide loader
    if (loader && loader.hideLoader) {
     loader.hideLoader();
    } else {
     const ldr = document.getElementById(loaderId);
     if (ldr) ldr.style.display = 'none';
    }

    // Show validation error toast
    __mrToast(validationResult.ms, 'error', 5000);
    return;
   }
  }

  // Prepare payload (assuming payload0 exists globally)
  payload0.vw = 4;
  payload0.fn = fn;//66,68
  //   payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'mr' }]);

  // For unlock profile, x1 is not needed (update1New0 not applicable)
  payload0.x1 = formData;
  payload0.x2 = fullObject.originalItem.functionParam;

  console.log('Payload0:', payload0);

  // Make API call
  const response = await fnj3("https://my1.in/2/c.php", payload0, 1, true, null, 20000, 0, 1, 1, 0);

  // Hide loader
  if (loader && loader.hideLoader) {
   loader.hideLoader();
  } else {
   const ldr = document.getElementById(loaderId);
   if (ldr) ldr.style.display = 'none';
  }

  if (response.su == 1) {
   console.log('Save successful:', response);

   // Call the response handler if available
   hndl_mrrspo(response, 0, null, null, payload0);



   if (response.cd.includes("5,")) {
    alert(response.ms);
   } else {
    // Show success message
    __mrToast('Profile count used successfully!', 'success', 3000);
   }
   // Close the modal if modalInstance is available
   if (fullObject.modalInstance) {
    fullObject.modalInstance.hide();
   } else if (typeof mraModalInstance !== 'undefined' && mraModalInstance) {
    mraModalInstance.hide();
   }

  } else {
   throw new Error(response.ms || 'Save failed');
  }

 } catch (error) {
  console.error('Error:', error);

  // Hide loader on error
  const ldr = document.getElementById(loaderId);
  if (ldr) ldr.style.display = 'none';

  __mrToast('Failed to save changes: ' + error.message, 'error', 5000, 'Error saving changes: ' + error.message);
 }
}
async function chkMyCount() {
 // Show loader
 const loaderId = 'chk_count_loader';
 let loader = document.getElementById(loaderId);
 if (!loader) {
  loader = createDynamicLoader2(loaderId, 'Checking count...', null);
 } else {
  loader.style.display = 'flex';
 }

 try {
  payload0.vw = 4;
  payload0.fn = 70;

  const response = await fnj3("https://my1.in/2/c.php", payload0, 1, true, null, 20000, 0, 1, 1, 0);

  // Hide loader
  if (loader && loader.hideLoader) {
   loader.hideLoader();
  } else {
   const ldr = document.getElementById(loaderId);
   if (ldr) ldr.style.display = 'none';
  }

  if (response.su == 1) {
   hndl_mrrspo(response, 0, null, null, payload0);

   // Close the confirm unlock modal
   if (currentUnlockModal && currentUnlockModal.modalInstance) {
    currentUnlockModal.modalInstance.hide();
   }

   console.log('Count check response:', response);
   __mrToast('Count checked successfully!', 'success', 3000, 'Count updated successfully!');
  } else {
   throw new Error(response.ms || 'Check failed');
  }
 } catch (error) {
  console.error('Error checking count:', error);
  const ldr = document.getElementById(loaderId);
  if (ldr) ldr.style.display = 'none';
  __mrToast('Failed to check count: ' + error.message, 'error', 5000, 'Error checking count: ' + error.message);
 }
}
function showCancelToastAndCloseModal(inputId, value, divId, key, fullObject) {
 // Show cancel toast
 if (typeof showToast === 'function') {
  showToast('Unlock cancelled', {
   type: 'info',
   duration: 2000,
   position: 'top',
   dismissible: true
  });
 } else {
  console.log('Unlock cancelled');
 }

 // Close any open modal (handled by the confirmUnlockProfile function)
 // No additional action needed as the modal is already being closed
}

//the "response.su == 1" handler now lives once in the shared block (__mrHandleSuResponse);
//this app's own global name for it is set in the re-expose block below
//------------------ END PUBLIC APP  (git/mr.js) ------------------
// ---- re-expose public top-level names to global scope (mirrors the original separate-script flow) ----
//if (typeof function2runAfter_O_Login !== "undefined") { window.function2runAfter_O_Login = function2runAfter_O_Login; }
if (typeof pullNwProfiles !== "undefined") { window.pullNwProfiles = pullNwProfiles; }
if (typeof showProfileDtls !== "undefined") { window.showProfileDtls = showProfileDtls; }
if (typeof confirmUnlockProfile !== "undefined") { window.confirmUnlockProfile = confirmUnlockProfile; }
if (typeof useOrSetAsideProfile !== "undefined") { window.useOrSetAsideProfile = useOrSetAsideProfile; }
if (typeof chkMyCount !== "undefined") { window.chkMyCount = chkMyCount; }
if (typeof showCancelToastAndCloseModal !== "undefined") { window.showCancelToastAndCloseModal = showCancelToastAndCloseModal; }
window.hndl_mrrspo = __mrHandleSuResponse;
__mrExposeGlobals();
Object.defineProperty(window, "proflFullData", { configurable: true, get: function () { return proflFullData; }, set: function (v) { proflFullData = v; } });
Object.defineProperty(window, "isFetching", { configurable: true, get: function () { return isFetching; }, set: function (v) { isFetching = v; } });
Object.defineProperty(window, "hasMore", { configurable: true, get: function () { return hasMore; }, set: function (v) { hasMore = v; } });
Object.defineProperty(window, "currentPage", { configurable: true, get: function () { return currentPage; }, set: function (v) { currentPage = v; } });
Object.defineProperty(window, "myEinMR", { configurable: true, get: function () { return myEinMR; }, set: function (v) { myEinMR = v; } });
Object.defineProperty(window, "profileUnlockCount", { configurable: true, get: function () { return profileUnlockCount; }, set: function (v) { profileUnlockCount = v; } });
Object.defineProperty(window, "remainingProflCnt", { configurable: true, get: function () { return remainingProflCnt; }, set: function (v) { remainingProflCnt = v; } });
Object.defineProperty(window, "currentUnlockModal", { configurable: true, get: function () { return currentUnlockModal; }, set: function (v) { currentUnlockModal = v; } });
Object.defineProperty(window, "moduLst", { configurable: true, get: function () { return moduLst; } });
// ---- admin entry hook: consumed by readonly my1ctr.js (admPpRenderModMenu->openAdminFromMenu) ----
// Opens the admin panel IN PLACE: the admin app is already initialised on this page,
// so this only swaps panels - no sessionStorage, no reload.
window.openAdminFromMenu = function (action) {
 if (action !== "aminPnl") { return; }
 __mrShowPanel(MR_PANEL_ADMIN).catch(function (e) { console.error("could not open the admin panel", e); });
};
//================== ADMIN PANEL SETUP (hidden until opened) ==================
// index_.html used to provide the #container_mr__main div the admin app renders into.
// It is created here instead, so one html file serves both apps, and it starts hidden.
function __mrEnsureAdminContainer() {
 var __c = document.getElementById("container_mr__main");
 if (!__c) {
  __c = document.createElement("div");
   __c.id = "container_mr__main";
   __c.className = "content-container";
   __c.setAttribute("hidden", "");
   document.body.appendChild(__c);
  }

  //no placeholder markup is written here any more: __mrShowPanel keeps the panel
  //hidden until container_mr__main() has put the real content in, so an
  //opened-but-not-yet-rendered panel is never on screen - and a spinner left in
  //the container could not be removed by the render, which appends.
  return __c;
}
function __mrAdminPanelRequested() {
 try {
  if (window.MR_OPEN_ADMIN) { return true; }
  return /[?&]adm=1/.test(window.location.search);
 } catch (e) { return false; }
}
//the admin app initialises on this page too, but stays hidden until it is opened;
//the DataTable itself is rendered on first open (see __mrShowPanel). Both apps are
//started by the one entry at the end of this file (__mrStartup).
//================== BEGIN ADMIN APP  (git_/mr_.js) ==================

//the admin code below calls hndl_mr_rspo(...) bare, and that name is deliberately
//NOT declared here: a top-level `const hndl_mr_rspo` would be a global lexical
//binding that keeps `typeof hndl_mr_rspo === "function"` true in git/e.js even
//after __mrShowPanel deletes the window property, and every public save would then
//take the admin branch. It resolves to window.hndl_mr_rspo instead, which only
//exists while this panel is the one on screen.

window[my1uzr.worknOnPg].t46mp = "https://images.pexels.com/photos/17379008/pexels-photo-17379008.jpeg";
window[my1uzr.worknOnPg].t47mp = "manikarnika";
window[my1uzr.worknOnPg].t48mp = "91.9823425404";
//   window[my1uzr.worknOnPg].colsToHide = "a,b,f,t,c,ut,v,ma,na,oa,pa,a2,a3,a4,a6,a7,b9,c1,c3,c5,c6,c7,c8,c9,d2,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,x1,x3,x4,x5,z,a1,a8,a9,b1,k1,k2";//t column in mysql must be used for something else;

window[my1uzr.worknOnPg].colsToShowInTbl = "w,l,u,m,n,ma,d1,e";
//thumbnailSize / thumbnailSizeBy come from mr.da and are applied by
window[my1uzr.worknOnPg].shoThmbNel = 0;


let profileData;

let required_data = [];

// Status mapping objects
const statusMap = {
 "0": 'Entry',
 "1": 'Accepted',
 "2": 'Under process',
 "127": "denied"
};
const statusColors = {
 0: 'warning',    // Entry - yellow/orange
 1: 'success',    // Accepted - green
 2: 'danger'      // Denied - red
};

// Define columns to show from the configuration
const columnsToShow = window[my1uzr.worknOnPg]?.colsToShowInTbl?.split(",") || ["l", "u", "ut", "m", "n", "o", "p", "ma", "na", "oa", "pa", "e"];

// Global variables for filtering
let c_table = [];
let filteredProfilesData = null; // Store filtered data
let currentStatusFilter = null; // Track current filter
//the admin's own copy of the profile list. It used to be written straight into
//profilesData, which is the PUBLIC card list - on one page that wiped the cards.
let adminProfilesData = [];
//DataTables column definitions (built inside container_mr__main)
let columnDefs = [];

function sendInfoToAddProfile(id_of_update_button, object_of_key_value_of_each_field, null1ByDefa, null2ByDefa, fullObject) {
 console.log('testing ln 82');
}

//the "response.su == 1" handler is shared (__mrHandleSuResponse in the shared block);
//this app's own global name for it is set in the re-expose block near the end

//the admin app's violet theme used to be injected by injectAdminVioletThemeStyles();
//styles.css now styles this panel directly (see .app-admin* in section 18).

function filterByStatus(statusValue) {
 if (!window.matrimonyDataTable) {
  console.error('DataTable not initialized');
  return;
 }

 const table = window.matrimonyDataTable;

 if (statusValue === null || statusValue === undefined) {
  // Clear filter - show all data
  if (filteredProfilesData) {
   table.clear().rows.add(adminProfilesData).draw();
   filteredProfilesData = null;
  }
  currentStatusFilter = null;

  // Update UI
  updateFilterButtonState(null);
  showToast('Showing all profiles', {
   type: 'info',
   duration: 2000
  });
 } else {
  // Filter the adminProfilesData array
  const filtered = adminProfilesData.filter(profile => {
   return profile.d === statusValue;
  });

  // Update DataTable with filtered data
  table.clear().rows.add(filtered).draw();
  filteredProfilesData = filtered;
  currentStatusFilter = statusValue;

  // Update UI
  updateFilterButtonState(statusValue);
  showToast(`Showing ${filtered.length} ${statusMap[statusValue]} profiles`, {
   type: 'success',
   duration: 2000
  });
 }

 // Update record count
 updateRecordCount();
}

// Helper function to update filter button appearance
function updateFilterButtonState(statusValue) {
 const dropdownBtn = document.getElementById('statusFilterDropdown');
 if (!dropdownBtn) return;

 if (statusValue === null) {
  dropdownBtn.innerHTML = `
  <i class="fas fa-filter me-2"></i>
  <span>Status Filter</span>
 `;
  dropdownBtn.classList.remove('active-filter');
 } else {
  const statusText = statusMap[statusValue] || 'Unknown';
  const statusColor = statusColors[statusValue] || 'secondary';
  const count = adminProfilesData.filter(p => p.d === statusValue).length;

  dropdownBtn.innerHTML = `
  <i class="fas fa-filter me-2"></i>
  <span>${statusText}</span>
  <span class="badge bg-${statusColor} ms-2">${count}</span>
 `;
  dropdownBtn.classList.add('active-filter');
 }
}

// Helper to update record count
function updateRecordCount() {
 const recordCountElement = document.getElementById('recordCountNumber');
 if (!recordCountElement) return;

 const count = filteredProfilesData
  ? filteredProfilesData.length
  : (adminProfilesData ? adminProfilesData.length : 0);

 recordCountElement.textContent = count;
}

// Function to update status counts in dropdown
function updateStatusCounts() {
 const counts = { 0: 0, 1: 0, 2: 0 };
 adminProfilesData.forEach(item => {
  if (item.d !== undefined && item.d !== null) {
   counts[item.d] = (counts[item.d] || 0) + 1;
  }
 });

 // Update dropdown labels
 setTimeout(() => {
  const dropdownItems = document.querySelectorAll('[onclick^="filterByStatus"]');
  dropdownItems.forEach(item => {
   const match = item.getAttribute('onclick').match(/filterByStatus\((\d+)\)/);
   if (match) {
    const status = parseInt(match[1]);
    // Remove existing count if present
    const existingCount = item.querySelector('.filter-count');
    if (existingCount) {
     existingCount.remove();
    }
    // Add count next to status
    const countSpan = document.createElement('span');
    countSpan.className = 'filter-count ms-auto text-secondary fw-bold';
    countSpan.textContent = counts[status] || 0;
    item.appendChild(countSpan);
   }
  });
 }, 500);
}
//https://cdn.jsdelivr.net/gh/sifr-in/cdn@e35c140/cmn/my1drv.min.js
async function container_mr__main() {

 try {
  // Step 0: the page-wide boot (scripts + dexie tables + mr.da + lookups). It is
  // shared with the public app and already resolved by the time the panel opens,
  // so this is normally a no-op that just hands back the same promise.
  await __mrInitPage();

  // Step 1: Check if container exists
  const container = document.getElementById('container_mr__main');
  if (!container) {
   throw new Error('Container element not found');
  }

  // const t351mp = await chkIfLoggedIn();
  // if (t351mp.su != 1) {
  //  const result = await loadCshScriptsSequentially(2, 3);
  //  (async () => { await loadExe2Fn(49, [], [1]); })();
  // }
    // The ONE shared loader already ran (see Step 0): bootstrap, jquery, DataTables,
    // dexie + my1xi, e.js, slkt.js, vldt.js, datepicker, flatpickr and drvphp.js are
    // all in place. 39 (slkt.js) has no c/r pair, so it cannot be loaded on demand
    // here - it is part of the boot list instead.

    //initDriveUploader();//to use my1drv.
    // Step 4: styles.css (loaded by the one shared boot) already styles this panel.

    // the rest of this function reads the admin's own settings (colsToHide,
    // fieldNameMap, drive folders, ...) while the public app's are restored after
    await __mrWithFlowSettings(MR_PANEL_ADMIN, async () => {
     await __mrRenderAdminPanel(container);
    });
    return true;
   } catch (error) {
    console.error('Error loading admin panel:', error);

    container.innerHTML = `
    <div class="alert alert-danger m-3" role="alert">
      <h4 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i>Error Loading Admin Panel</h4>
      <p class="mb-0">Error: ${error.message}</p>
    </div>`;
    return false;
   }
  }

//the body of container_mr__main(), split out so it can run inside
//__mrWithFlowSettings("admin") - every line of it needs the admin's settings.
async function __mrRenderAdminPanel(container) {

   // Create responsive container with violet theme
   const tableContainer = document.createElement('div');
   tableContainer.className = 'container-fluid mt-3';
   tableContainer.innerHTML = `
   <div class="card shadow-lg border-0 app-admin-card">
     <div class="card-header text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
       <h3 class="mb-0 d-flex align-items-center">
         <i class="fas fa-users me-2"></i>
         Matrimony Profiles
       </h3>
       <div class="app-admin-toolbar">

<!-- <button class="btn btn-light"  onclick="(async () => { await loadExe2Fn(38, [0], [1]); })()"><i class="fa-solid fa-plus"></i> ad new</button> -->
<button class="app-admin-btn"  onclick="addNewProfile()"><i class="fa-solid fa-plus"></i> Add New</button>
<button class="app-admin-btn"  onclick="(async () => { await loadExe2Fn(17, [], [1]); })()">
<i class="fas fa-eye"></i> View Plans
</button>

         <!-- Status Filter Dropdown -->
         <div class="dropdown status-filter-dropdown">
           <button class="app-admin-btn dropdown-toggle" 
                   type="button" 
                   id="statusFilterDropdown" 
                   data-bs-toggle="dropdown" 
                   aria-expanded="false">
             <i class="fas fa-filter me-2"></i>
             <span>Status Filter</span>
           </button>
           <ul class="dropdown-menu filter-dropdown-menu" aria-labelledby="statusFilterDropdown">
             <li>
               <button class="dropdown-item d-flex align-items-center" onclick="filterByStatus(null)">
                 <i class="fas fa-times-circle me-2 text-secondary"></i>
                 Clear Filter
               </button>
             </li>
             <li><hr class="dropdown-divider"></li>
             <li>
               <button class="dropdown-item d-flex align-items-center" onclick="filterByStatus(0)">
                 <span class="badge bg-warning app-dot me-2"></span>
                 Entry (${statusMap[0]})
               </button>
             </li>
             <li>
               <button class="dropdown-item d-flex align-items-center" onclick="filterByStatus(1)">
                 <span class="badge bg-success app-dot me-2"></span>
                 Accepted (${statusMap[1]})
               </button>
             </li>
             <li>
               <button class="dropdown-item d-flex align-items-center" onclick="filterByStatus(2)">
                 <span class="badge bg-danger app-dot me-2"></span>
                 Denied (${statusMap[2]})
               </button>
             </li>
           </ul>
         </div>

         
          <span class="app-badge-count" id="recordCount">
           <i class="fas fa-database me-1"></i>
           <span id="recordCountNumber">0</span> records
         </span>
         <button class="app-admin-btn" id="refreshBtn" title="Refresh">
           <i class="fas fa-sync-alt"></i>
         </button>
       </div>
     </div>
     <div class="card-body p-0">
       <div class="table-responsive">
         <table id="matrimonyTable" class="table table-hover w-100 mb-0">
            <thead>
              <!-- Column headers will be generated dynamically by DataTables -->
            </thead>
           <tbody>
             <!-- Data will be populated by DataTables -->
           </tbody>
         </table>
       </div>
     </div>
     <div class="card-footer">
       <small>
         <i class="fas fa-info-circle me-1"></i>
         Click the <i class="fas fa-ellipsis-v app-icon-primary"></i> button to view/edit profile
       </small>
       <small>
         <i class="fas fa-palette me-1"></i>
         Showing ${columnsToShow.length} columns
       </small>
     </div>
   </div>
   `;


   //the container is rendered into, not added to: a retried render (the ok === false
   //path in container_mr__main) must replace the previous markup, never stack a
   //second copy of the panel under it
   container.innerHTML = "";
   container.appendChild(tableContainer);
   container.dataset.built = "1";

   // Create modal for JSON display
   const jsonModalHtml = `
   <div class="modal fade" id="jsonRecordModal" tabindex="-1" aria-labelledby="jsonRecordModalLabel" aria-hidden="true">
     <div class="modal-dialog modal-xl modal-dialog-scrollable">
       <div class="modal-content">
         <div class="modal-header text-white">
           <h5 class="modal-title" id="jsonRecordModalLabel">
             <i class="fas fa-code me-2"></i>
             Complete Record Details
           </h5>
           <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body p-0">
           <pre id="jsonRecordContent" class="app-json"></pre>
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">
             <i class="fas fa-times me-1"></i> Close
           </button>
           <button type="button" class="btn btn-primary" id="copyJsonBtn">
             <i class="fas fa-copy me-1"></i> Copy JSON
           </button>
         </div>
       </div>
     </div>
   </div>
   `;

   document.body.insertAdjacentHTML('beforeend', jsonModalHtml);

   // Initialize DataTable with the JSON data
   setTimeout(() => {
    if (typeof $ === 'function' && $.fn.DataTable) {
     initializeDataTable();
    } else {
     console.error('jQuery or DataTables not loaded');
     showFallbackTable();
    }
   }, 500);

   // Initialize DataTable function
   async function initializeDataTable() {
    c_table = await dbDexieManager.getAllRecords(dbnm, "c") || [];
    adminProfilesData = await dbDexieManager.getAllRecords(dbnm, "mr") || [];
    adminProfilesData.sort((a, b) => new Date(b.b) - new Date(a.b));

    // Create column definitions for ID column first
    /*const columnDefs = [{
     data: 'a',
     title: fieldNameMap['a'] || 'ID',
     width: '100px',
     className: 'dt-center',
     orderable: true,
     render: function (data, type, row, meta) {
      // Display ID with vertical ellipsis button - violet themed
      return `
          <div class="d-flex align-items-center justify-content-between">
            <span class="fw-bold" style="color: #7B1FA2;">${data}</span>
            <button class="btn btn-sm view-json" 
                    data-record-id="${data}" 
                    data-row-index="${meta.row}" 
                    title="View/Edit Profile"
                    style="background: linear-gradient(135deg, #7B1FA2, #4A148C) !important; 
                           color: white; 
                           border: none; 
                           border-radius: 20px; 
                           padding: 4px 12px;
                           box-shadow: 0 2px 8px rgba(123, 31, 162, 0.3);">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>
        `;
     }
    }];*/
    columnDefs = [{
     data: 'a',
     title: fieldNameMap['a'] || 'ID',
     width: '110px',
     className: 'dt-center align-middle',
     orderable: true,
     render: function (data, type, row, meta) {
      // Check if status (d) is negative
      const isDeleted = row.d < 0;
      const badgeText = isDeleted ? ' (Deleted)' : '';

      // Display ID with vertical ellipsis button
      return `
    <div class="d-flex align-items-center justify-content-between gap-2">
      <span class="fw-bold app-id-cell${isDeleted ? ' is-deleted' : ''}">
        ${data}${badgeText}
      </span>
      <button class="btn-icon app-view-json" 
              data-record-id="${data}" 
              data-row-index="${meta.row}" 
              title="View/Edit Profile"
              aria-label="View or edit profile ${data}">
        <i class="fas fa-ellipsis-v"></i>
      </button>
    </div>
   `;
     }
    }];

    // Add columns specified in colsToShowInTbl
    columnsToShow.forEach((key) => {
     if (key.trim() === 'a') return; // Skip ID as we already added it

     const fieldKey = key.trim();
     const fieldTitle = fieldNameMap[fieldKey] || fieldKey.toUpperCase();

     if (fieldKey === 'd') {
      // Status column with badge and filter
      columnDefs.push({
       data: fieldKey,
       title: fieldTitle,
       width: '120px',
       className: 'dt-center align-middle',
       orderable: true,
       render: function (data, type, row) {
        if (data === null || data === undefined) {
         return '<span class="text-muted">—</span>';
        }

        const statusText = statusMap[data] || 'Unknown';
        const isActive = currentStatusFilter === data;

        return `
         <span class="app-status-chip${isActive ? ' is-active' : ''}" 
               data-status="${data}"
               onclick="filterByStatus(${data})"
               role="button" tabindex="0"
               title="Click to ${isActive ? 'clear' : 'filter by'} ${statusText}">
           ${statusText}
         </span>
         `;
       }
      });
     } else if (fieldKey === 'u' || fieldKey === 'ut') {
      columnDefs.push({
       data: fieldKey,
       title: fieldTitle,
       width: '120px',
       className: 'dt-center align-middle',
       orderable: false,
       render: function (data, type, row) {
        if (!data || data === '' || data === 'null') { return '<span class="text-muted">No Image</span>'; }
        let imageUrl = null; let originalUrl = null;
        try {
         if (typeof data === 'string' && data.trim().startsWith('{')) { const parsed = JSON.parse(data); if (parsed && typeof parsed === 'object') { imageUrl = parsed.b || parsed.a; originalUrl = parsed.a || parsed.b; } else { imageUrl = data; originalUrl = data; } }
         else if (typeof data === 'object') { imageUrl = data.b || data.a; originalUrl = data.a || data.b; }
         else { imageUrl = data; originalUrl = data; }
        } catch (e) { imageUrl = data; originalUrl = data; }
        if (!imageUrl || imageUrl === '' || imageUrl === 'null') { return '<span class="text-muted">No Image</span>'; }
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', 'lh3.googleusercontent.com', 'drive.google.com'];
        const isImageUrl = imageExtensions.some(ext => String(imageUrl).toLowerCase().includes(ext) || String(imageUrl).includes('pexels.com') || String(imageUrl).includes('photobucket') || String(imageUrl).includes('imgur') || String(imageUrl).includes('cloudinary'));
        if (isImageUrl) {
         return `
           <a href="${originalUrl}" target="_blank" rel="noopener noreferrer">
             <img src="${imageUrl}" alt="Profile Image" class="img-thumbnail app-thumb" loading="lazy">
           </a>
          `;
        } else {
         return `<span class="text-muted" title="${imageUrl}">N/A</span>`;
        }
       }
      });
     } else if (fieldKey === 'l') {
      // Contact Number with click-to-call
      columnDefs.push({
       data: fieldKey,
       title: fieldTitle,
       width: '130px',
       className: 'dt-left',
       render: function (data, type, row) {
        if (!data || data === '' || data === 'null') {
         return '<span class="text-muted">—</span>';
        }

        const cleanNumber = data.replace(/[^\d+]/g, '');
        return `
             <div class="d-flex align-items-center">
               <a href="tel:${cleanNumber}" class="text-decoration-none text-primary me-2" title="Call ${cleanNumber}">
                 <i class="fas fa-phone"></i>
               </a>
               <span class="text-truncate app-truncate-xs" title="${data}">${data}</span>
             </div>
           `;
       }
      });
     } else {
      // Regular text columns
      columnDefs.push({
       data: fieldKey,
       title: fieldTitle,
       width: '150px',
       className: 'dt-left align-middle',
       render: function (data, type, row) {
        if (data === null || data === undefined || data === '' || data === 'null') {
         return '<span class="text-muted">—</span>';
        }

        // Truncate long text
        if (type === 'display' && data && String(data).length > 30) {
         const safe = String(data).replace(/"/g, '&quot;');
          return `<span class="text-truncate d-inline-block app-truncate" title="${safe}">${String(data).substring(0, 30)}...</span>`;

        }
        return data;
       }
      });
     }
    });

    // Initialize the DataTable with violet theme
    const table = $('#matrimonyTable').DataTable({
     data: adminProfilesData,
     columns: columnDefs,
     order: [],
     pageLength: 10,
     lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
     scrollX: true,
     scrollCollapse: true,
     fixedHeader: true,
     columnDefs: [
      {
       // Make all columns searchable
       targets: '_all',
       searchable: true
      }
     ],
     dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
     language: {
      search: "_INPUT_",
      searchPlaceholder: "Search across all columns...",
      lengthMenu: "Show _MENU_ entries",
      info: "Showing _START_ to _END_ of _TOTAL_ entries",
      infoEmpty: "Showing 0 to 0 of 0 entries",
      infoFiltered: "(filtered from _MAX_ total entries)",
      zeroRecords: "No matching records found",
      paginate: {
       first: "First",
       last: "Last",
       next: "Next",
       previous: "Previous"
      }
     },
     initComplete: function () {
      // Count visible rows (after filtering)
      const recordCount = this.api().data().count();
      document.getElementById('recordCountNumber').textContent = recordCount;

      // Update status counts in dropdown
      updateStatusCounts();
     },
     drawCallback: function () {
      const recordCount = this.api().data().count();
      document.getElementById('recordCountNumber').textContent = recordCount;
      $('.dataTables_length select').addClass('form-select-sm');
      $('.dataTables_filter input').addClass('form-control-sm');
      $('.paginate_button').addClass('btn-sm');
      $('.paginate_button.current').css({ 'background': 'linear-gradient(135deg, #7B1FA2, #4A148C)', 'color': 'white', 'border': 'none' });
      // Initialize lazy loading for images
      setTimeout(() => { initLazyLoadImages(); }, 100);
     },
     createdRow: function (row, data, dataIndex) {
      // Add hover effect to rows
      $(row).hover(
       function () {
        $(this).css('background-color', 'rgba(123, 31, 162, 0.05)');
       },
       function () {
        $(this).css('background-color', '');
       }
      );

      // Alternate row colors
      if (dataIndex % 2 === 0) {
       $(row).css('background-color', '#FFFFFF');
      } else {
       $(row).css('background-color', '#F9F5FC');
      }
     }
    });

    // Store the DataTable instance globally
    window.matrimonyDataTable = table;

    // Update initial record count
    updateRecordCount();

    // Add function to open image modal
    window.openImageModal = function (imageUrl, title) {
     const modalHtml = `
       <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
         <div class="modal-dialog modal-dialog-centered modal-lg">
           <div class="modal-content">
             <div class="modal-header text-white">
               <h5 class="modal-title" id="imageModalLabel">${title || 'Image Preview'}</h5>
               <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>
             <div class="modal-body p-0 d-flex justify-content-center align-items-center app-modal-media">
               <img src="${imageUrl}" 
                    alt="${title || 'Image'}" 
                    class="img-fluid"
                    onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMyQjJCMkIiIHJ4PSIxNSI+PC9yZWN0PjxwYXRoIGQ9Ik0xNDAgMjAwTDE4MCAyNDBMMjYwIDE2MEwzMjAgMjIwTDI0MCAzMDBMMTQwIDIwMFoiIGZpbGw9IiNGRjgiLz48L3N2Zz4='; this.alt='Image failed to load';">
             </div>
             <div class="modal-footer">
               <a href="${imageUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                 <i class="fas fa-external-link-alt me-1"></i> Open in New Tab
               </a>
               <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">
                 <i class="fas fa-times me-1"></i> Close
               </button>
             </div>
           </div>
         </div>
       </div>
     `;

     // Remove existing modal if any
     const existingModal = document.getElementById('imageModal');
     if (existingModal) {
      existingModal.remove();
     }

     // Add modal to DOM and show it
     document.body.insertAdjacentHTML('beforeend', modalHtml);
     const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
     imageModal.show();
    };

    // Event handler for ellipsis buttons
    $('#matrimonyTable').on('click', '.view-json', async function () {

     __mrDestroyModal("mra_");


     const recordId = $(this).data('record-id');
     //   const rowIndex = $(this).data('row-index');
     //   await loadExe2Fn(38, [recordId, rowIndex], [1]);
     // the editor must be built with the ADMIN settings (labels, colsToHide /
     // colsToSubmit, drive folders, sub-caste list), even though the panel
     // itself was rendered while the public app's settings were active
     await __mrWithFlowSettings(MR_PANEL_ADMIN, async () => {
      profileData = adminProfilesData.find(item => item.a === recordId);
      required_data[0] = "mra_";//prefix
      required_data[1] = 1;//display modal;
      required_data[2] = fieldNameMap;//field labels;
      required_data[3] = profileData;//json-data

      required_data[4] = [{ "a": "d", "b": "setValByProprtyToElm", "c": "entryStatus", "canAdd": 1 }, { "a": "e", "b": "set_mra_e", "canEdit": 1, "params": [mono_fl_csh_no, [mono_loader_id, mono_show_modal, mono_dv_el_id, mono_callBackFn, mono_input_el_id], [1]] }, { "a": "g", "b": "set_dtt", "c": "yyyy-mm-dd HH:MM:SS", "d": window[my1uzr.worknOnPg].bdayFormat }, { "a": "j", "b": "setValByProprtyToElm", "c": "marital_status", "canAdd": 1 }, { "a": "k", "b": "setValByProprtyToElm", "c": "var_caste_rlgns", "canAdd": 1 }, { "a": "k1", "b": "setValByProprtyToElm", "c": "var_caste_rlgns,castes", "e": profileData.k, "g": "fn_setValToGvnInputs('" + required_data[0] + "','k')", "canAdd": 1 }, { "a": "k2", "b": "setValByProprtyToElm", "c": "var_sub_caste_type", "canAdd": 1 }, { "a": "a3", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "a2", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.a3, "g": "fn_setValToGvnInputs('" + required_data[0] + "','a3')", "canAdd": 1 }, { "a": "b5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "b4", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.b5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','b5')", "canAdd": 1 }, { "a": "c5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "c6", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.c5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','c5')", "canAdd": 1 }, { "a": "q", "b": "setValByProprtyToElm", "c": "mr_job_types", "canAdd": 1 }, { "a": "qa", "b": "setValByProprtyToElm", "c": "mr_desig_posis", "canAdd": 1 }, { "a": "qb", "b": "setValByProprtyToElm", "c": "mr_bsns_forms", "canAdd": 1 }, { "a": "qc", "b": "setValByProprtyToElm", "c": "mr_bsns_typs", "canAdd": 1 }, { "a": "s", "b": "setValByProprtyToElm", "c": "var_degres", "canAdd": 2 }, { "a": "a9", "b": "setValByProprtyToElm", "c": "var_lngs", "canAdd": 2 }, {
       "a": "b6", "b": "setGalleryImages", "canAdd": 1, "driveMl": window[my1uzr.worknOnPg].driveMl,
       "thumbnailSize": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].thumbnailSize !== undefined && window[my1uzr.worknOnPg].thumbnailSize !== null) ? window[my1uzr.worknOnPg].thumbnailSize : ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== undefined && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== null) ? window[my1uzr.worknOnPg].clientConfig.thumbnailSize : 600)),  // Add thumbnail size
       "resizeBy": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.resizeBy !== undefined && window[my1uzr.worknOnPg].clientConfig.resizeBy !== null) ? window[my1uzr.worknOnPg].clientConfig.resizeBy : 0)
      }, { "a": "x", "b": "setSiblingTags", "canAdd": 1, "params": [sibling_fl_csh_no, [sibling_loader_id, sibling_dv_el_id, sibling_show_modal, sibling_callBackFn, sibling_input_el_id], [1]] }, { "a": "z", "b": "setValByProprtyToElm", "c": "bloodGroups", "canAdd": 1 }, { "a": "a5", "b": "setValByProprtyToElm", "c": "var_genders", "canAdd": 1 }, { "a": "a7", "b": "setValByProprtyToElm", "c": "relation_with_regr", "d": "string1", "e": -1, "canAdd": 1 }, {
       "a": "u",
       "b": "prepImgByURL", "driveMl": window[my1uzr.worknOnPg].driveMl,
       "canEdit": true,
       "thumbnailSize": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].thumbnailSize !== undefined && window[my1uzr.worknOnPg].thumbnailSize !== null) ? window[my1uzr.worknOnPg].thumbnailSize : ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== undefined && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== null) ? window[my1uzr.worknOnPg].clientConfig.thumbnailSize : 600)),  // Add thumbnail size
       "resizeBy": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.resizeBy !== undefined && window[my1uzr.worknOnPg].clientConfig.resizeBy !== null) ? window[my1uzr.worknOnPg].clientConfig.resizeBy : 0)         // 0 = resize by width, 1 = resize by height
       //"folderName": "my1_mr" // optional folder name
      }];;
      required_data[5] = [];
      const fun2DeleteAsClient = 67;
      required_data[6] = [{ "a": "Share profile", "e": "shareProfl" }];
      if (profileData.d > -1) {
       required_data[6].push({ "a": "Delete profile", "e": "confirmLeaveProfile", "runFnOnOk": "useLeaveCount", "runFnOnCancel": "showCancelToastAndCloseModal", "fnNo2Del": fun2DeleteAsClient });
      }
      required_data[7] = window[my1uzr.worknOnPg].seqnce;//sequence
      required_data[8] = window[my1uzr.worknOnPg].colsToHide;
      const functionNumber = 63; const update1New0 = 1;
      required_data[9] = [{ "a": "Update profile", "e": "saveProfileChanges", "f": "a," + window[my1uzr.worknOnPg].colsToSubmit, "g": functionNumber, "h": update1New0 }];

     });
      await loadExe2Fn(38, required_data, [1]);
    });

    // Event handler for refresh button
    document.getElementById('refreshBtn').addEventListener('click', function () {
     (async () => {
      try {
       // Clear any active filters
       if (currentStatusFilter !== null) {
        filterByStatus(null);
       }

       payload0.vw = 4;
       payload0.fn = 60;//get all marriage record;
       payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'c' }, { "tb": 'mr' }]);
       const response = await fnj3("https://my1.in/2/e.php", payload0, 1, true, null, 20000, 0, 1, 1);
       if (response.su == 1) {
        hndl_mr_rspo(response, 1, null, null);
       } else {
        alert(response.ms);
       }
      } catch (error) {
       console.error("Initialization failed:", error);
       showToast("Initialization error - please refresh");
      }
     })();
    });

    // Copy JSON functionality
    document.getElementById('copyJsonBtn')?.addEventListener('click', function () {
     const jsonContent = document.getElementById('jsonRecordContent')?.textContent;
     if (jsonContent) {
      navigator.clipboard.writeText(jsonContent)
       .then(() => {
        __mrToast('JSON copied to clipboard', 'success', 2000);
       })
       .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy JSON');
       });
     }
    });
   }

   // Simple JSON syntax highlighter
   function syntaxHighlight(json) {
    if (typeof json != 'string') {
     json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
     let cls = 'text-primary'; // Keys
     if (/^"/.test(match)) {
      if (/:$/.test(match)) {
       cls = 'text-danger'; // Key with colon
      } else {
       cls = 'text-success'; // String values
      }
     } else if (/true|false/.test(match)) {
      cls = 'text-warning'; // Booleans
     } else if (/null/.test(match)) {
      cls = 'text-secondary'; // Null
     } else if (/^-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?$/.test(match)) {
      cls = 'text-info'; // Numbers
     }
     return '<span class="' + cls + '">' + match + '</span>';
    });
   }

   // Fallback function if DataTables fails to load
   function showFallbackTable() {
    const table = document.querySelector('#matrimonyTable');
    if (table) {
     table.innerHTML = `
       <tr>
         <td colspan="71" class="text-center py-5">
             <div class="alert alert-warning app-error-card">
               <i class="fas fa-exclamation-triangle app-error-card__icon fa-2x mb-3"></i>
               <h4>Unable to load advanced table features</h4>
               <p class="text-secondary">Please check your internet connection or try refreshing the page.</p>
               <button class="btn btn-primary mt-2" onclick="location.reload()">
                 <i class="fas fa-redo me-1"></i> Refresh Page
               </button>
             </div>

         </td>
       </tr>
     `;
     }
    }

    return true;
   }

// Make functions globally available
window.container_mr__main = container_mr__main;
window.filterByStatus = filterByStatus;

// No auto-initialization here any more: the admin panel is rendered by
// __mrShowPanel(MR_PANEL_ADMIN) the first time it is opened on this page.





async function addNewProfile() {
 //same reason as the view/edit handler above: the editor needs the admin's settings
 return __mrWithFlowSettings(MR_PANEL_ADMIN, async () => {
  await __mrAddNewProfile();
 });
}
async function __mrAddNewProfile() {
 window[my1uzr.worknOnPg].defaFieldVals

 profileData = { "d": 0, "e": 0, "g": "", "j": 0, "q": "", "qa": "", "qb": "", "qc": "", "s": "", "x": "", "z": "", "a2": "", "b4": "", "c6": "", "a9": "", "a5": 0, "a7": 0, "b6": [], "u": "", "k": 13, "k1": 9, "k2": 0, "a3": 97, "b5": 97, "c5": 97 };
 // Apply defaults
 profileData = applyDefaultValues(profileData);
 required_data[0] = "mra_";//prefix
 required_data[1] = 1;//display modal;
 required_data[2] = fieldNameMap;//field labels;
 required_data[3] = profileData;
 /*required_data[4] = [{"a":"d","b":"setValByProprtyToElm","c":"entryStatus"},{"a":"g","b":"set_dtt","c":"yyyy-mm-dd HH:MM:SS","d":window[my1uzr.worknOnPg].bdayFormat},{"a":"j","b":"setValByProprtyToElm","c":"marital_status"},{"a":"k","b":"setValByProprtyToElm","c":"var_caste_rlgns"},{"a":"k1","b":"setValByProprtyToElm","c":"var_caste_rlgns,castes","e":profileData.k},{"a":"a3","b":"setValByProprtyToElm","c":"var_ctco"},{"a":"a2","b":"setValByProprtyToElm","c":"var_ctco,cities","e":profileData.a3},{"a":"b5","b":"setValByProprtyToElm","c":"var_ctco"},{"a":"b4","b":"setValByProprtyToElm","c":"var_ctco,cities","e":profileData.b5},{"a":"c5","b":"setValByProprtyToElm","c":"var_ctco"},{"a":"c6","b":"setValByProprtyToElm","c":"var_ctco,cities","e":profileData.c5},{"a":"q","b":"setValByProprtyToElm","c":"mr_job_types"},{"a":"qa","b":"setValByProprtyToElm","c":"mr_desig_posis"},{"a":"qb","b":"setValByProprtyToElm","c":"mr_bsns_forms"},{"a":"qc","b":"setValByProprtyToElm","c":"mr_bsns_typs"},{"a":"s","b":"setValByProprtyToElm","c":"var_degres"},{"a":"a9","b":"setValByProprtyToElm","c":"var_lngs"},
 {
     "a": "b6",
     "b": "setGalleryImages",
     "canAdd": true,                    // Enables Add button
     "driveMl": window[my1uzr.worknOnPg].driveMl,  // clientName
     "thumbnailSize": ((window[my1uzr.worknOnPg]&&window[my1uzr.worknOnPg].thumbnailSize!==undefined&&window[my1uzr.worknOnPg].thumbnailSize!==null)?window[my1uzr.worknOnPg].thumbnailSize:((window[my1uzr.worknOnPg]&&window[my1uzr.worknOnPg].clientConfig&&window[my1uzr.worknOnPg].clientConfig.thumbnailSize!==undefined&&window[my1uzr.worknOnPg].clientConfig.thumbnailSize!==null)?window[my1uzr.worknOnPg].clientConfig.thumbnailSize:600)),  // Add thumbnail size
     "resizeBy": ((window[my1uzr.worknOnPg]&&window[my1uzr.worknOnPg].clientConfig&&window[my1uzr.worknOnPg].clientConfig.resizeBy!==undefined&&window[my1uzr.worknOnPg].clientConfig.resizeBy!==null)?window[my1uzr.worknOnPg].clientConfig.resizeBy:0),
     "g": "handleDriveUploadComplete",  // callbackFunctionName (optional)
     "i": "1",                          // showThumb
     "j": "1",                          // autoExecute
     "k": "loader"                     // loaderId
 }
 ,{"a":"x","b":"setSiblingTags"},{"a":"z","b":"setValByProprtyToElm","c":"bloodGroups"},{"a":"a5","b":"setValByProprtyToElm","c":"var_genders"},{"a":"a7","b":"setValByProprtyToElm","c":"relation_with_regr","d":"string1","e":-1},{"a":"u","b":"prepImgByURL","canEdit": true,"driveMl": window[my1uzr.worknOnPg].driveMl,
     "thumbnailSize": ((window[my1uzr.worknOnPg]&&window[my1uzr.worknOnPg].thumbnailSize!==undefined&&window[my1uzr.worknOnPg].thumbnailSize!==null)?window[my1uzr.worknOnPg].thumbnailSize:((window[my1uzr.worknOnPg]&&window[my1uzr.worknOnPg].clientConfig&&window[my1uzr.worknOnPg].clientConfig.thumbnailSize!==undefined&&window[my1uzr.worknOnPg].clientConfig.thumbnailSize!==null)?window[my1uzr.worknOnPg].clientConfig.thumbnailSize:600)),  // Add thumbnail size
     "resizeBy": ((window[my1uzr.worknOnPg]&&window[my1uzr.worknOnPg].clientConfig&&window[my1uzr.worknOnPg].clientConfig.resizeBy!==undefined&&window[my1uzr.worknOnPg].clientConfig.resizeBy!==null)?window[my1uzr.worknOnPg].clientConfig.resizeBy:0)}];
 required_data[5] = [];// Click handlers
 required_data[6] = [];*/
 required_data[4] = [{ "a": "d", "b": "setValByProprtyToElm", "c": "entryStatus", "canAdd": 1 }, { "a": "e", "b": "set_mra_e", "canEdit": 1, "params": [mono_fl_csh_no, [mono_loader_id, mono_show_modal, mono_dv_el_id, mono_callBackFn, mono_input_el_id], [1]] }, { "a": "g", "b": "set_dtt", "c": "yyyy-mm-dd HH:MM:SS", "d": window[my1uzr.worknOnPg].bdayFormat }, { "a": "j", "b": "setValByProprtyToElm", "c": "marital_status", "canAdd": 1 }, { "a": "k", "b": "setValByProprtyToElm", "c": "var_caste_rlgns", "canAdd": 1 }, { "a": "k1", "b": "setValByProprtyToElm", "c": "var_caste_rlgns,castes", "e": profileData.k, "g": "fn_setValToGvnInputs('" + required_data[0] + "','k')", "canAdd": 1 }, { "a": "k2", "b": "setValByProprtyToElm", "c": "var_sub_caste_type", "canAdd": 1 }, { "a": "a3", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "a2", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.a3, "g": "fn_setValToGvnInputs('" + required_data[0] + "','a3')", "canAdd": 1 }, { "a": "b5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "b4", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.b5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','b5')", "canAdd": 1 }, { "a": "c5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "c6", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.c5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','c5')", "canAdd": 1 }, { "a": "q", "b": "setValByProprtyToElm", "c": "mr_job_types", "canAdd": 1 }, { "a": "qa", "b": "setValByProprtyToElm", "c": "mr_desig_posis", "canAdd": 1 }, { "a": "qb", "b": "setValByProprtyToElm", "c": "mr_bsns_forms", "canAdd": 1 }, { "a": "qc", "b": "setValByProprtyToElm", "c": "mr_bsns_typs", "canAdd": 1 }, { "a": "s", "b": "setValByProprtyToElm", "c": "var_degres", "canAdd": 2 }, { "a": "a9", "b": "setValByProprtyToElm", "c": "var_lngs", "canAdd": 2 }, {
  "a": "b6", "b": "setGalleryImages", "canAdd": 1, "driveMl": window[my1uzr.worknOnPg].driveMl,
  "thumbnailSize": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].thumbnailSize !== undefined && window[my1uzr.worknOnPg].thumbnailSize !== null) ? window[my1uzr.worknOnPg].thumbnailSize : ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== undefined && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== null) ? window[my1uzr.worknOnPg].clientConfig.thumbnailSize : 600)),  // Add thumbnail size
  "resizeBy": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.resizeBy !== undefined && window[my1uzr.worknOnPg].clientConfig.resizeBy !== null) ? window[my1uzr.worknOnPg].clientConfig.resizeBy : 0)
 }, { "a": "x", "b": "setSiblingTags", "canAdd": 1, "params": [sibling_fl_csh_no, [sibling_loader_id, sibling_dv_el_id, sibling_show_modal, sibling_callBackFn, sibling_input_el_id], [1]] }, { "a": "z", "b": "setValByProprtyToElm", "c": "bloodGroups", "canAdd": 1 }, { "a": "a5", "b": "setValByProprtyToElm", "c": "var_genders", "canAdd": 1 }, { "a": "a7", "b": "setValByProprtyToElm", "c": "relation_with_regr", "d": "string1", "e": -1, "canAdd": 1 }, {
  "a": "u",
  "b": "prepImgByURL", "driveMl": window[my1uzr.worknOnPg].driveMl,
  "canEdit": true,
  "thumbnailSize": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].thumbnailSize !== undefined && window[my1uzr.worknOnPg].thumbnailSize !== null) ? window[my1uzr.worknOnPg].thumbnailSize : ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== undefined && window[my1uzr.worknOnPg].clientConfig.thumbnailSize !== null) ? window[my1uzr.worknOnPg].clientConfig.thumbnailSize : 600)),  // Add thumbnail size
  "resizeBy": ((window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig && window[my1uzr.worknOnPg].clientConfig.resizeBy !== undefined && window[my1uzr.worknOnPg].clientConfig.resizeBy !== null) ? window[my1uzr.worknOnPg].clientConfig.resizeBy : 0)         // 0 = resize by width, 1 = resize by height
  //"folderName": "my1_mr" // optional folder name
 }];;
 required_data[5] = [];
 required_data[6] = [];
 required_data[7] = window[my1uzr.worknOnPg].seqnce;//sequence
 required_data[8] = "a," + window[my1uzr.worknOnPg].colsToHide;
 const functionNumber = 62; const update1New0 = 0;
 required_data[9] = [{ "a": "Add new", "e": "saveProfileChanges", "f": window[my1uzr.worknOnPg].colsToSubmit, "g": functionNumber, "h": update1New0 }];

 await loadExe2Fn(38, required_data, [1]);
}
// Add this function for lazy loading images
function initLazyLoadImages() {
 const lazyImages = document.querySelectorAll('.lazy-load-img[data-src]');
 if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
   entries.forEach(entry => {
    if (entry.isIntersecting) {
     const img = entry.target;
     img.src = img.dataset.src;
     img.classList.remove('lazy-load-img');
     img.removeAttribute('data-src');
     imageObserver.unobserve(img);
    }
   });
  }, { rootMargin: '50px' });
  lazyImages.forEach(img => imageObserver.observe(img));
 } else {
  // Fallback for browsers without IntersectionObserver
  lazyImages.forEach(img => { img.src = img.dataset.src; img.classList.remove('lazy-load-img'); img.removeAttribute('data-src'); });
 }
}
//------------------ END ADMIN APP  (git_/mr_.js) ------------------
// ---- re-expose admin top-level names to global scope (mirrors the original separate-script flow) ----
__mrExposeGlobals();
if (typeof sendInfoToAddProfile !== "undefined") { window.sendInfoToAddProfile = sendInfoToAddProfile; }
//window.hndl_mr_rspo is (re)set by __mrShowPanel while the admin panel is on screen - see there.
if (typeof filterByStatus !== "undefined") { window.filterByStatus = filterByStatus; }
if (typeof updateFilterButtonState !== "undefined") { window.updateFilterButtonState = updateFilterButtonState; }
if (typeof updateRecordCount !== "undefined") { window.updateRecordCount = updateRecordCount; }
if (typeof updateStatusCounts !== "undefined") { window.updateStatusCounts = updateStatusCounts; }
if (typeof container_mr__main !== "undefined") { window.container_mr__main = container_mr__main; }
if (typeof addNewProfile !== "undefined") { window.addNewProfile = addNewProfile; }
if (typeof initLazyLoadImages !== "undefined") { window.initLazyLoadImages = initLazyLoadImages; }
Object.defineProperty(window, "profileData", { configurable: true, get: function () { return profileData; }, set: function (v) { profileData = v; } });
Object.defineProperty(window, "required_data", { configurable: true, get: function () { return required_data; }, set: function (v) { required_data = v; } });
Object.defineProperty(window, "c_table", { configurable: true, get: function () { return c_table; }, set: function (v) { c_table = v; } });
Object.defineProperty(window, "filteredProfilesData", { configurable: true, get: function () { return filteredProfilesData; }, set: function (v) { filteredProfilesData = v; } });
Object.defineProperty(window, "currentStatusFilter", { configurable: true, get: function () { return currentStatusFilter; }, set: function (v) { currentStatusFilter = v; } });
Object.defineProperty(window, "statusMap", { configurable: true, get: function () { return statusMap; } });
Object.defineProperty(window, "statusColors", { configurable: true, get: function () { return statusColors; } });
Object.defineProperty(window, "columnsToShow", { configurable: true, get: function () { return columnsToShow; } });
// ---- Home button at the right side of the admin nav refresh button ----
// closes the admin panel and brings the public app back in place (no reload, so the
// public list keeps whatever it had loaded)
function __mrInjectHomeButton() {
 try {
  if (document.getElementById("mrHomeBtn")) { return; }
  var __rb = document.getElementById("refreshBtn");
  if (!__rb || !__rb.parentNode) { setTimeout(__mrInjectHomeButton, 200); return; }
  var __hb = document.createElement("button");
  __hb.id = "mrHomeBtn";
  __hb.className = __rb.className ? __rb.className : "btn btn-light";
  var __rs = (typeof __rb.getAttribute === "function") ? __rb.getAttribute("style") : null;
  __hb.setAttribute("style", __rs || "border-radius: 50px; padding: 8px 16px; box-shadow: 0 4px 12px rgba(123, 31, 162, 0.2);");
  __hb.title = "Back to Public App";
  __hb.innerHTML = '<i class="fas fa-home"></i>';
  __rb.parentNode.insertBefore(__hb, __rb.nextSibling);
  __hb.addEventListener("click", function () {
   __mrShowPanel(MR_PANEL_PUBLIC).catch(function (e) { console.error("could not go back to the public app", e); });
  });
 } catch (e) { setTimeout(__mrInjectHomeButton, 500); }
}
setTimeout(__mrInjectHomeButton, 100);

/* ==================== THE ONE START FOR THE WHOLE PAGE =====================
 * Both apps initialise from this single entry: the public app's own start (set by
 * its IIFE) plus the admin panel, which stays hidden until it is opened. Both share
 * one boot (__mrInitPage), so the scripts and the dexie tables are loaded once.
 * Order matters: the stored theme is applied before anything is built, then the
 * boot pulls in Bootstrap, then styles.css is appended so it lands after it. */
__mrOnReady(async () => {
 __mrSetBodyPanelClass(MR_PANEL_PUBLIC);
 __mrApplyTheme(__mrReadTheme());
 try {
  await __mrInitPage();
  await __mrLoadStylesheet();
 } catch (e) {
  console.error("shared boot failed", e);
 }
 try {
  if (__mrPublicAppStart) { await __mrPublicAppStart(); }
 } catch (e) {
  console.error("public app failed to start", e);
 }
 __mrInitPageChrome();
 try {
  __mrEnsureAdminContainer();
  __mrSetAdminHidden(true);
  if (__mrAdminPanelRequested()) { await __mrShowPanel(MR_PANEL_ADMIN); }
 } catch (e) {
  console.error("admin panel failed to initialise", e);
 }
}, true);
