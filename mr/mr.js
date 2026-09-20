window.__mrMode = "public";
try {
 if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("mr_mode") === "admin") { window.__mrMode = "admin"; }
} catch (e) {}
var __mrMiddlePageHTML = `<div id="mrMidPg" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#7B1FA2,#4A148C);">
  <div style="text-align:center;color:#fff;font-family:Arial,Helvetica,sans-serif;">
    <div style="width:64px;height:64px;margin:0 auto 22px;border:5px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:mrMidPgSpin 1s linear infinite;"></div>
    <div style="font-size:22px;font-weight:700;letter-spacing:1px;">Loading Admin Panel...</div>
  </div>
  <style>@keyframes mrMidPgSpin{to{transform:rotate(360deg)}}</style>
</div>`;
function __mrShowMiddlePage() {
 document.body.innerHTML = __mrMiddlePageHTML;
}

if (window.__mrMode !== "admin") {
//================== BEGIN PUBLIC APP  (git/mr.js) ==================
const tblsRequired = ["f", "fp", "ma", "mr"];
const moduLst = [
 { a: ",60,61,65", b: "Dashboard", c: "fa-chart-line", d: "aminPnl", e: "#9c6f7fea", cid: 130 }
];
const cust_const = [];
moduLst.hook = "onModuLstAllowed2";
window[my1uzr.worknOnPg].moduLst = moduLst;
window[my1uzr.worknOnPg].onModuLstAllowed2 = function (allowedModules) {
 window[my1uzr.worknOnPg].allowedModulesMenuItems = allowedModules || [];
};

//comman:
const sho_da_tkLimit = 1;
let appData = {};
const ids_of_views = [3];
let tblFailureCount = 1;
const cacheVersion = 1763390987;
const cacheStrategy = 1;
const dontShoLoginConfirmation = 1;
const dontRestartAfterLogin = 1;
window[my1uzr.worknOnPg].flsht = 3;
window[my1uzr.worknOnPg].lodErrMs = "press back back & open the app again;";
window[my1uzr.worknOnPg].emptBodyMs = "welcome to 'sifr' matrimoney app;";
window[my1uzr.worknOnPg].cardHeight = 60;
window[my1uzr.worknOnPg].nonEditableFields = ['a', 'b', 'c', 'k', 'k1'];
window[my1uzr.worknOnPg].defaFieldVals = ['k~13', 'k1~9'];


//public:
window[my1uzr.worknOnPg].usdInAndroWv = 0;//1 = used in android web view;, this will load back button handling for android;
window[my1uzr.worknOnPg].shoBadge = "qa";
window[my1uzr.worknOnPg].pullWhenCardsRemain = 6;
window[my1uzr.worknOnPg].colsToHide = "w,e,     a,a1,a2,a3,a4,a6,a7,a8,a9,b,b1,b5,b9,c,c1,c3,c5,c6,c7,c8,c9,d2,f,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,k1,k2,ma,na,oa,pa,t,ut,v,x1,x3,x4,x5,z";
window[my1uzr.worknOnPg].colsOfOthersHide = "w,x,e,l,n,o,p,r,va,b4,c2,d,d1,     a,a1,a2,a3,a4,a6,a7,a8,a9,b,b1,b5,b9,c,c1,c3,c5,c6,c7,c8,c9,d2,f,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,k1,k2,ma,na,oa,pa,t,ut,v,x1,x3,x4,x5,z";
window[my1uzr.worknOnPg].colsHideOnFullDetails = "w,x,e,r,va,b4,c2,d,d1,     a,a1,a2,a3,a4,a6,a7,a8,a9,b,b1,b5,b9,c,c1,c3,c5,c6,c7,c8,c9,d2,f,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,k1,k2,ma,na,oa,pa,t,ut,v,x1,x3,x4,x5,z";
//   window[my1uzr.worknOnPg].colsToHide = "d1,   a,w,b,e,f,t,c,ut,v,ma,na,oa,pa,a4,a6,b9,c1,c3,c7,c8,c9,d2,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,x1,x3,x4,x5";//t column in mysql must be used for something else;
window[my1uzr.worknOnPg].seqnce = "u,ut,b6,a5,l,a7,m,n";
window[my1uzr.worknOnPg].colsToSubmit = "a7,u,b6,l,m,n,d,g,h,i,j,k,k1,o,p,q,qa,qb,qc,r,s,va,x,z,a1,a2,a3,a5,a8,a9,b1,b4,b5,c2,c5,c6,d1,x2";
window[my1uzr.worknOnPg].bdayFormat = "dd-mm-yyyy";
window[my1uzr.worknOnPg].driveMl = "sambodhisarang.in";//sambodhisarang.in
window[my1uzr.worknOnPg].fieldsOnCard = "m~s~g,h,'budhdhist',k2,b4";
//if below line is commented, it takes 19 as default;
window[my1uzr.worknOnPg].fileToUseForSelectingNativeCity = 45;//45 for state,dist,talkua(fnUsed->setValByPrprtyDepthToElm) ~ 19 for city[in state] (fnUsed->setValByProprtyToElm);
window[my1uzr.worknOnPg].showTableViewOnCardClick = 1;
window[my1uzr.worknOnPg].forceSibling = 0;


const driveFolderIdForOriginalFile = "1girKhqCDlqYhhowYNpxllUPZz4kRiyTg";
const driveFolderIdForThumbnailFile = "1wIVeMuQyK77-mFp9obCnI85Naqu61OdL";
window[my1uzr.worknOnPg].flshu = "https://static.vecteezy.com/system/resources/previews/075/188/415/large_2x/couple-holds-hands-at-traditional-celebration-free-photo.jpg";


window[my1uzr.worknOnPg].appInfo = {
 "business": "Sifr Matrimony Match Makers",
 "owner": "masoom nazir sanadi",
 "city": "kolhapur",
 "tagline": "Aapke Saath, Behtar Saath ke liye",
 "mail": "sifr.matrimony@gmail.com",
 "mob": "+91 9960706060",

 "experience": "10+ years",
 "focus": "Exclusive matchmaking for Buddhist community",
 "verified": "Yes, verified profiles are provided",
 "privacy": "100% privacy guarantee",
 "comparison": "Advanced matchmaking engine delivering better compatibility than typical matrimonial platforms",
 "family_meeting": "Family meeting arrangements are provided",

 "styles": "Traditional & cultural, Modern & professional, Emotional & family oriented",
 "premium": "Premium / luxury matchmaking services available",
 "emailEndPoint": "https://my1.in/0.0000000000/z/mr/mel.php"
};









window["vlidFn62_63"] = { "g": { "cnv": "convertDateStrToGvn", "cnvo": { "currentFormat": window[my1uzr.worknOnPg].bdayFormat }, "ty": "dt", "mi": "1950", "ms": "enter correct birth date" }, "l": { "cnv": "handleAsString", "cnvo": { "prepn": "91." }, "patn": "91\\.[6-9]\\d{9}", "ms": "Contact no. to display, required" }, "j": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Marital status required" }, "m": { "cnv": "handleAsString", "patn": "^[A-Za-z]{2,}$", "ms": "First name required" }, "a5": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Please select whether you are 'Male' or 'Female'" } };
window["vlidFn68"] = { "a": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Profile id required" } };

xtraj_payload = { "fn": 69, "fl": "https://my1.in/2/c.php" };

const fieldNameMap = { "a": "Id", "w": "unique ID", "e": "Mobile of registering customer", "g": "Birth date", "h": "Height", "i": "Package Lk", "j": "Status", "k": "Religious", "k1": "caste;", "k2": "sub caste / type;", "l": "Contact no. to display", "a7": "Diplay contact no. is of:", "m": "First name", "n": "Surname in eng;", "o": "Father's name in eng;", "p": "Mother's name in eng;", "q": "Job type", "qa": "Position", "qb": "Business", "qc": "Business", "r": "Education 10th, 12th, 15th, 17th", "s": "Degrees", "t": "Qualifications e.g. Sci, Com, Be, M.tech, ...", "u": "DP Display Picture;", "ut": "Thumbnail;", "va": "Relative surnames (comma separated);", "x": "Siblings;", "z": "Blood group", "a1": "Weight (kg);", "a3": "Country currently working in;", "a2": "City currently working in;", "a4": "Diet", "a5": "Gender", "a8": "No. of own Home / shop", "b1": "No. of own Vehicle", "a9": "Languages known", "b5": "Native country", "b4": "Native city", "b6": "Image Gallery", "b9": "Drinking habit", "c2": "Physically challenged?, blank if not.", "c3": "lives with family 1=yes, 2=no;", "c5": "Currently living in Country", "c6": "Currently living in City;", "c7": "Free profile count;", "c8": "Free chat count;", "c9": "Plan Id;", "d1": "Paid profile count", "d2": "Paid chat count", "h1": "Manglik status: 1=manglik, 2=non-manglik, 3=angshik (partial manglik)", "h2": "horoscope available 1=yes, 2=no;", "i1": "islamic sect 1=sunni,2=shia,127=other;", "i2": "islamic mazhab, school of thought 1=Hanafi,2=Shafi,3=Maliki,4=Hanbali,127=other;", "i3": "namaz practice 1,2,3,4,5,-1=occasional, -2=rarely;", "i4": "quran learning 1=basic,2=intermediate,3=hafiz,4=alim,", "i5": "quraan reciting: 1=daily, 2=occasionally, 3=rarely;", "i6": "burkha 1=yes, 2=no", "i7": "beard 1=yes, 2=no", "i8": "believe in dargah 1=yes, 2=no, 3=strictly yes, 4=strictly no", "x1": "Expectations (eng)", "x2": "Expect", "x3": "partner's diet must be: 1=all, 2=veg, 3=non-veg, 4=occasion-non-veg, 5=eggetarain, 6=jain, 7=vegan;", "x4": "girl job though: 1=yes interested, 2=will do job compulsory, 3=may be, 4=if required, 5=no-wont do job", "x5": "girl currently doing job 1=yes, 2=no", "v": "relative surnames (comma separated) eng;", "ma": "name lolng;", "na": "surname lolng;", "oa": "fa name lolng;", "pa": "no name lolng;", "f": "Constraint no.;", "b": "Recorded", "c": "fn no", "d": "Status;" };

window.var_sub_caste_type = [{ "a": 0, "e": "" }, { "a": 1, "e": "Jamati" }, { "a": 2, "e": "Ahle hadees" }, { "a": 3, "e": "Devbandi" }];

// load_marriage_page.js
let proflFullData;
let profilesData = [];
let isFetching = false;      // Track if we're currently fetching
let hasMore = true;          // Track if there are more records to fetch
let currentPage = 0;         // Track current page
window.selectedDegrees = [];
window.selectedOccupations = [];
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

function function2runAfter_O_Login(rs16lt) {
 if (rs16lt.su == 1) {
  if (rs16lt.fn69 && rs16lt.fn69.mr && rs16lt.fn69.mr.l)
   localStorage.setItem(appOwner.tn + '_myEinMR', JSON.stringify(rs16lt.fn69.mr.l[0]));
  safeReload();
 }
}

(function () {
 'use strict';
 window[my1uzr.worknOnPg].csh = [
  { "a": 1, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@92f6756/cmn/my1e3.min.js" },
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
  { "a": 17, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/pri.js", "c": "set_marriage_plan_innerHTML", "r": "set_marriage_plan_innerHTML" },
  { "a": 18, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6a12ce/cmn/caste.da" },
  { "a": 19, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b39a4af/cmn/ctco.da" },
  { "a": 20, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/abot.js", "c": "set_abot_us_innerHTML", "r": "set_abot_us_innerHTML" },
  { "a": 21, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/conta.js", "c": "set_conta_us_innerHTML", "r": "set_conta_us_innerHTML" },
  { "a": 22, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/prvc.js", "c": "set_privcy_polc_innerHTML", "r": "set_privcy_polc_innerHTML" },
  { "a": 23, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/trms.js", "c": "set_terms_condi_innerHTML", "r": "set_terms_condi_innerHTML" },
  { "a": 24, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/chldpol.js", "c": "set_child_safety_pol_innerHTML", "r": "set_child_safety_pol_innerHTML" },
  { "a": 27, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7e9444c/mr/sbli.js", "c": "set_mr_x_sibling_details", "r": "set_mr_x_sibling_details" },
  { "a": 28, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@bd7e9e0/cmn/lng.da" },
  { "a": 30, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@666354f/cmn/degs.da" },
  { "a": 32, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@0208362/cmn/occu.da" },
  { "a": 37, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@3988bc6/cmn/ei.min.js", "c": "open_entind_crud", "r": "open_entind_crud" },
  { "a": 38, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7e9444c/mr/prfl.js", "c": "mra__main", "r": "mra__main" },
  { "a": 39, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/slkt.js", "c": "openCommonSelectionModal", "r": "openCommonSelectionModal" },
  { "a": 40, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7e9444c/mr/e.js" },
  { "a": 41, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/vldt.js", "c": "cmnVldet", "r": "cmnVldet" },
  { "a": 42, "u": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css" },
  { "a": 43, "u": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" },
  { "a": 44, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/drvphp.js", "c": "upld2drv", "r": "upld2drv" },
  { "a": 45, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/cmn/intal.da" },
  { "a": 46, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7e9444c/mr/prfle.js", "c": "mr_e__main", "r": "mr_e__main" },
  { "a": 47, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@ef526ee/mr/slkt2.js", "c": "setValByPrprtyDepthToElm", "r": "setValByPrprtyDepthToElm" },
  { "a": 48, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7e9444c/mr/prflt.js", "c": "mr_t__main", "r": "mr_t__main" },
  { "a": 49, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fbf62ad/cmn/my1lp.js", "c": "open_shoLgnP", "r": "open_shoLgnP" },
  { "a": 50, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b7740c3/cmn/my1ctr.js", "c": "open_my1ctr", "r": "open_my1ctr" }
 ];

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
       resolve();
      }, 500);
     } else {
      resolve();
     }
    }, remainingTime);
   }

   // Always call removeFlash to ensure flash disappears after minDisplayTime
   removeFlash();
  });
 }
 // Function to load background scripts
 async function loadBackgroundScripts() {
  try {
   let result1 = null;
   if (window[my1uzr.worknOnPg].usdInAndroWv && window[my1uzr.worknOnPg].usdInAndroWv === 1)
    result1 = await loadCshScriptsSequentially(42, 43, 44, 2, 3, 4, 6, 7, 9, 40, 15, 34, 35, 37, 39, 47, 41, 8);
   else
    result1 = await loadCshScriptsSequentially(42, 43, 44, 2, 3, 4, 6, 7, 9, 40, 15, 34, 35, 37, 39, 47, 41);

   if (!result1.success) {
    throw new Error('Failed to load required scripts: ' + result1.error);
   } else {
    const createResult = await dbDexieManager.handleNwTables("loader", dbnm, tblsRequired);
    tblFailureCount = createResult.failureCount;

    var hook = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg][moduLst.hook];
    var existing = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].allowedModulesMenuItems;
    var missing =
     typeof existing === 'undefined' ||
     existing === null ||
     existing === '' ||
     (Array.isArray(existing) && existing.length === 0);
    if (typeof hook === 'function' && missing) {
     try {
      var permitted = await chkModuLstAgainstFNF(moduLst);
      hook(permitted);
     } catch (e) {
      console.warn('failed to resolve allowed modules menu items', e);
     }
    }

    // Reset pagination variables
    currentPage = 0;
    hasMore = true;
    isFetching = false;

    cmn_prep_data_set_to_var("mr_desig_posis", 1, 32);
    cmn_prep_data_set_to_var("var_caste_rlgns", 1, 18);
    cmn_prep_data_set_to_var("var_degres", 1, 30);
    if (window[my1uzr.worknOnPg]?.fileToUseForSelectingNativeCity) {
     cmn_prep_data_set_to_var("var_ctco", 1, window[my1uzr.worknOnPg].fileToUseForSelectingNativeCity);
    } else {
     cmn_prep_data_set_to_var("var_ctco", 1, 19);
    }
    cmn_prep_data_set_to_var("var_lngs", 1, 28);

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

    // Create and add footer
    const footer = createFooter();
    document.body.appendChild(footer);


    //  const emptyStringSibling = ""; const emptyDivSibling = ""; const shoModalSibling = 0; const noCallbackSiblingFn = null;
    //  await loadExe2Fn(27, [emptyStringSibling, emptyDivSibling, shoModalSibling, noCallbackSiblingFn], [1]);//siblings file;
    //  const prepLangData = 1; const shoLangModal = 0; const current_langs = ""; const call_back_fn = ""; const container_dv = "";
    //  await loadExe2Fn(29, [prepLangData, shoLangModal, current_langs, call_back_fn, container_dv, 28], [1]);//Languages file;
    //  await loadExe2Fn(31, [1, 0, null, null, "", "", 30], [1]);//degree file;
    //  await loadExe2Fn(33, [1, 0, null, null, "", "", 32], [1]);//Occupation file;
    //  const prep475CasteReligionData = 1; const sho477CasteReligionModal = 0; const current_religion_id = 0; const current_caste_id = 0;
    //  await loadExe2Fn(26, [prep475CasteReligionData, sho477CasteReligionModal, current_religion_id, current_caste_id, null, 18], [1]);

   }

   console.log(`Loaded ${result1.loadedCount} of ${result1.totalScripts} required scripts`);

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

 // Function to load a script
 function loadScript(url) {
  return new Promise((resolve, reject) => {
   const script = document.createElement('script');
   script.src = url;
   script.onload = () => resolve();
   script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
   document.head.appendChild(script);
  });
 }

 // Function to create navigation bar
 function createNavigationBar() {
   const navBar = document.createElement('nav');
   navBar.className = 'navbar navbar-expand-lg navbar-light bg-light app-navbar';


  navBar.innerHTML = `
    <div class="container-fluid">
        <!-- Left: Hamburger Menu -->
        <button class="btn btn-link text-white" type="button" onclick="(async () => { await loadExe2Fn(13, [], [1]); })()">
            <span class="navbar-toggler-icon fs-5 fw-bold app-toggler-icon"></span>
        </button>

        <button
            class="btn btn-link text-white text-decoration-none fw-bold text-center flex-grow-1" type="button" onclick="(async () => { await loadExe2Fn(50, [\'dv_to_set_open_my1ctr_processed\', 0, 1, 2], [1]); })();">
            <span id="navbarBusinessName" class="fs-5 fw-bold"></span>
        </button>
        
        <!-- Right: Icons -->
        <div class="d-flex">
            <!-- Notification Icon -->
            <!-- <button class="btn btn-link text-white me-3" onclick="(async () => { await loadExe2Fn(16, [], [1]); })()">
                <i class="fas fa-bell fa-lg"></i>
            </button>
            -->
            
            <!-- Filter Icon -->
            <button class="btn btn-link text-white" onclick="(async () => { await loadExe2Fn(12, [], [1]); })()">
                <i class="fas fa-filter fa-lg fs-5 fw-bold"></i>
            </button>
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
        <div class="row" id="profiles-container">
            <!-- Profile cards will be dynamically inserted here -->
        </div>
        <div id="loader-container"></div>
    </div>
`;

    // Insert profile cards dynamically
    const container = mainContent.querySelector('#profiles-container');
    const loaderContainer = mainContent.querySelector('#loader-container');

    if (container) {
     profilesData.forEach(profile => {
      const profileCard = createProfileCard(profile);
      container.appendChild(profileCard);
     });

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

 window.createProfileCard = function (profile) {
  const uniqueProflID = profile.w || 'save profl again';
  const profileId = profile.a || 'N/A';
  const firstName = profile.m || 'Unknown';
  const thumbnail = profile.thumbnail;

  // Calculate age from birth date
  const age = profile.g ? calculateAge(profile.g) : 'Not specified';
  const height = profile.h ? formatHeight(profile.h) : null;
  const packageAmount = profile.i ? formatPackage(profile.i) : null;
  const natv_ct = profile.b4 !== undefined && profile.b4 !== null ? profile.b4 : null;
  //   const religion = profile.k ? getReligionName(profile.k.toString()) : null;

  // Check for QA badge
  const showQaBadge = false;//window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].shoBadge === "qa" && profile.qa;
  const qaValue = profile.qa || '';

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

  const detailsString = lineValues.length > 0 ? `<div><div class="app-detail-main">${lineValues[0] || '—'}</div>${lineValues.length > 1 && lineValues[1] ? `<div class="app-detail-sub">${lineValues[1]}</div>` : ''}${lineValues.length > 2 && lineValues[2] ? `<div class="app-detail-sub2">${lineValues[2]}</div>` : ''}</div>` : 'Details not available';

  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';

  col.innerHTML = `
    <div class="card profile-card">
        <!-- Thumbnail Image -->
        <div class="profile-image-container app-profile-img-ctr">
            <img src="${thumbnail}" 
                 alt="${firstName}" 
                 class="profile-thumbnail w-100"
                 onclick="showProfileDtls(${profileId})"
                 loading="lazy">
            <div class="profile-overlay"></div>
            
            <!-- Profile ID badge - Top Right -->
            <span class="profile-id" onclick="shareProfl(null, '${uniqueProflID}', null, null, null)">
                ID: ${uniqueProflID}
            </span>
            
            <!-- QA Badge - Top Left - conditionally displayed -->
            ${showQaBadge ? `
            <span class="qa-badge">${qaValue}</span>
            ` : ''}
        </div>
        
        <!-- Profile Info -->
        <div class="card-body d-flex flex-column">
            
            <!-- CENTER ALIGNED COMMA-SEPARATED DETAILS -->
            <div class="profile-details text-center mb-3">
                    ${detailsString}
            </div>
            
<!-- CENTER ALIGNED TITLE WITH PRIMARY COLOR - Name and button on same line -->
<div class="card-title text-center app-card-title-theme">
    <button class="btn btn-contact app-btn-contact-compact"
            onclick="showProfileDtls(${profileId})">CONTACT &emsp;<i class="fas fa-phone-alt"></i>
    </button>
</div>
            
            <!-- DUAL BUTTONS: CONTACT & MESSAGE
            <div class="row g-2 mt-auto">
                <div class="col-6">
                    <button class="btn btn-contact w-100"
                            onclick="showProfileDtls(${profileId})">
                        <i class="fas fa-phone-alt me-1"></i> Contact
                    </button>
                </div>
                <div class="col-6">
                    <button class="btn btn-message w-100"
                            onclick="showProfileDtls(${profileId})">
                        <i class="fas fa-comment me-1"></i> Message
                    </button>
                </div>
            </div>
            -->
        </div>
    </div>
`;

  return col;
 }

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
     newProfiles.forEach(profile => {
      const profileCard = createProfileCard(profile);
      container.appendChild(profileCard);
     });
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
  footer.className = 'bg-dark text-white text-center py-3 app-footer';

  footer.innerHTML = `
            <div class="container">
                <p class="mb-2">
                    &copy; ${new Date().getFullYear()} ${appOwner.en || 'Matrimony App'} 
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

 function addMobileStyles() {
  if (typeof window.appcss !== 'string' || window.appcss.length === 0) {
   return;
  }
  let style = document.getElementById('appcss-style');
  if (!style) {
   style = document.createElement('style');
   style.id = 'appcss-style';
   document.head.appendChild(style);
  }
  style.textContent = window.appcss;
 }
 window.addMobileStyles = addMobileStyles;

 async function checkUrlForIdParam() {
 }
 // Start the app when DOM is ready
 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
   await initializeApp();
   checkUrlForIdParam();
  });
 } else {
  // DOM already loaded - defer so appcss styles are injected first
  setTimeout(() => {
   initializeApp();
   checkUrlForIdParam();
  }, 0);
 }

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

window.appcss = `:root {--primary-color: #7B1E3E;--primary-light: #8F2B4D;--primary-dark: #561634;--secondary-color: #C8914A;--secondary-light: #D4A45F;--secondary-dark: #A97638;--accent-color: #D9A441;--accent-light: #E6BB68;--accent-dark: #B07F2E;--success-color: #5B9D6F;--info-color: #5B8DB8;--warning-color: #D9803E;--danger-color: #C0392B;--light-color: #FBF9F5;--dark-color: #2A1F24;--white-color: #FFFFFF;--black-color: #000000;--background-color: #FAF7F2;--card-bg-color: var(--white-color);--nav-bg-color: var(--primary-color);--footer-bg-color: var(--primary-dark);--text-primary: #33261F;--text-secondary: #6D665E;--text-light: #FBF9F5;--text-dark: #4A3A33;--text-on-primary: var(--white-color);--border-color: #EAE3DA;--shadow-color: rgba(123, 30, 62, 0.12);--shadow-color-dark: rgba(123, 30, 62, 0.18);}body {background: linear-gradient(135deg, #FBF9F5 0%, #F3EBE0 100%) !important;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;}.card {border: 1px solid rgba(196, 176, 150, 0.25) !important;}.card:hover {box-shadow: 0 12px 32px rgba(123, 30, 62, 0.16) !important;transform: translateY(-4px) !important;}.profile-card .profile-image-container {position: relative !important;height: 70% !important;overflow: hidden !important;}.profile-card .profile-id {position: absolute !important;top: 12px !important;right: 12px !important;z-index: 10 !important;font-size: 0.72rem !important;font-weight: 700 !important;letter-spacing: 0.4px !important;text-shadow: 0 1px 2px rgba(0,0,0,0.25) !important;color: #3B2A12 !important;background: linear-gradient(135deg, #E6BB68, #C8914A) !important;box-shadow: 0 4px 12px rgba(123, 30, 62, 0.25) !important;border-radius: 50px !important;padding: 5px 13px !important;min-width: 60px !important;text-align: center !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;}.profile-card .qa-badge {border: none !important;position: absolute !important;top: 12px !important;left: 12px !important;z-index: 10 !important;font-size: 0.72rem !important;font-weight: 700 !important;letter-spacing: 0.4px !important;text-shadow: 0 1px 2px rgba(0,0,0,0.25) !important;color: white !important;background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;box-shadow: 0 4px 12px rgba(123, 30, 62, 0.3) !important;border-radius: 50px !important;padding: 5px 13px !important;min-width: 60px !important;text-align: center !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;}button:not(.btn-link):not(.btn-close):not(.navbar-toggler):not([class*="navbar"]):not([class*="nav-"]):not(.nav-link) {background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;border: none !important;color: var(--text-on-primary) !important;border-radius: 50px !important;padding: 11px 22px !important;font-weight: 600 !important;transition: all 0.3s ease !important;box-shadow: 0 6px 16px rgba(123, 30, 62, 0.24) !important;}button:not(.btn-link):not(.btn-close):not(.navbar-toggler):not([class*="navbar"]):not([class*="nav-"]):not(.nav-link):hover {transform: translateY(-2px) !important;box-shadow: 0 10px 24px rgba(123, 30, 62, 0.32) !important;}button:not(.btn-link):not(.btn-close):not(.navbar-toggler):not([class*="navbar"]):not([class*="nav-"]):not(.nav-link):active {transform: translateY(1px) !important;}.navbar .btn {border-radius: 10px !important;padding: 8px 16px !important;font-weight: normal !important;box-shadow: none !important;background: rgba(255, 255, 255, 0.12) !important;}.navbar .btn:hover {transform: none !important;background: rgba(255, 255, 255, 0.2) !important;}.profile-overlay {background: linear-gradient(to bottom, transparent 50%, rgba(86, 22, 52, 0.1) 70%, rgba(86, 22, 52, 0.35) 90%, rgba(56, 15, 34, 0.65) 100%) !important;}.navbar {background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;box-shadow: 0 4px 24px rgba(86, 22, 52, 0.35) !important;}.navbar-toggler {border: 2px solid rgba(255, 255, 255, 0.45) !important;border-radius: 10px !important;padding: 6px 10px !important;}.navbar-toggler:focus {box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.45) !important;}.profile-thumbnail.loading {background: linear-gradient(90deg, #F3EBE0 25%, #E9DCCB 50%, #F3EBE0 75%) !important;background-size: 200% 100%;animation: loading 1.5s infinite;}::selection {background-color: rgba(123, 30, 62, 0.25);color: var(--text-primary);}::-webkit-scrollbar {width: 8px;}::-webkit-scrollbar-track {background: #F3EBE0;}::-webkit-scrollbar-thumb {background: var(--primary-light);border-radius: 4px;}::-webkit-scrollbar-thumb:hover {background: var(--primary-color);}@media (prefers-color-scheme: dark) {:root {--primary-color: #8F2B4D;--primary-light: #A03A5C;--primary-dark: #6B1E3C;--background-color: #1C1618;--card-bg-color: #2B2226;--text-primary: #F4ECE4;--text-secondary: #C9BEB4;--border-color: #4A3E42;--shadow-color: rgba(0, 0, 0, 0.4);--light-color: #2B2226;--text-on-primary: var(--white-color);}body {background: linear-gradient(135deg, #1C1618 0%, #2A1B21 100%) !important;}body .card {background: #2B2226 !important;border-color: #4A3E42 !important;color: #F4ECE4 !important;}body .card .card-title, body .card .app-detail-main, body .card .app-detail-sub, body .card .app-detail-sub2 {color: #F4ECE4 !important;}.navbar {background: linear-gradient(135deg, var(--primary-dark), #3A1226) !important;}.navbar .btn {background: rgba(255, 255, 255, 0.1) !important;}.navbar .btn:hover {background: rgba(255, 255, 255, 0.18) !important;}}.navbar-nav .btn,.navbar-nav button,.navbar button:not(.navbar-toggler) {all: unset !important;color: white !important;padding: 8px 16px !important;border-radius: 6px !important;margin: 0 4px !important;cursor: pointer !important;transition: background-color 0.3s ease !important;}.navbar-nav .btn:hover,.navbar-nav button:hover,.navbar button:not(.navbar-toggler):hover {background: rgba(255, 255, 255, 0.22) !important;transform: none !important;box-shadow: none !important;}.profile-card {height: ${window[my1uzr.worknOnPg].cardHeight || 60}vh !important;display: flex !important;flex-direction: column !important;border-radius: 18px !important;box-shadow: 0 1px 2px rgba(123, 30, 62, 0.06), 0 8px 24px rgba(123, 30, 62, 0.10), 0 24px 48px rgba(123, 30, 62, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.85) !important;overflow: hidden !important;}.profile-card .card-body {flex: 1 !important;display: flex !important;flex-direction: column !important;}.profile-card .profile-thumbnail {height: 100% !important;width: 100% !important;object-fit: cover !important;object-position: top center !important;border-radius: 18px 18px 0 0;}.profile-card .btn {margin-top: auto !important;}.profile-card .card-title {text-align: center !important;font-weight: 600 !important;margin-bottom: 10px !important;}.profile-card .profile-details {text-align: center !important;flex-grow: 1 !important;display: flex !important;align-items: center !important;justify-content: center !important;}.text-theme-primary {color: var(--primary-color) !important;}.btn-contact {background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;border: none !important;color: var(--text-on-primary) !important;border-radius: 50px !important;padding: 8px 12px !important;font-weight: 600 !important;transition: all 0.3s ease !important;box-shadow: 0 4px 10px rgba(123, 30, 62, 0.22) !important;font-size: 0.85rem !important;}.btn-contact:hover {transform: translateY(-2px) !important;box-shadow: 0 8px 18px rgba(123, 30, 62, 0.32) !important;}.btn-contact:active {transform: translateY(1px) !important;}.btn-message {background: linear-gradient(135deg, var(--accent-color), var(--accent-dark)) !important;border: none !important;color: #3B2A12 !important;border-radius: 50px !important;padding: 8px 12px !important;font-weight: 600 !important;transition: all 0.3s ease !important;box-shadow: 0 4px 10px rgba(176, 127, 46, 0.24) !important;font-size: 0.85rem !important;}.btn-message:hover {transform: translateY(-2px) !important;box-shadow: 0 8px 18px rgba(176, 127, 46, 0.32) !important;}.btn-message:active {transform: translateY(1px) !important;}.profile-card .btn-contact,.profile-card .btn-message {height: 38px !important;display: flex !important;align-items: center !important;justify-content: center !important;}#infinite-scroll-loader .spinner-border {width: 3rem;height: 3rem;color: var(--primary-color) !important;}#infinite-scroll-loader p {color: var(--text-secondary);font-size: 0.9rem;}@keyframes blink {0% {opacity: 1;} 50% {opacity: 0.3;} 100% {opacity: 1;}}
#flash-container {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 9999; display: flex; justify-content: center; align-items: center; overflow: hidden;}
#flash-container .app-flash-img {height: 100%; object-fit: contain;}
.app-navbar {position: fixed; padding-top: 14px; top: 0; left: 0; width: 100%; z-index: 1000; box-shadow: 0 2px 4px rgba(0,0,0,0.1);}
#main-content {margin-top: 66px; padding: 1%; min-height: calc(100vh - 66px); background: linear-gradient(135deg, #FBF9F5 0%, #F3EBE0 100%);}
#infinite-scroll-loader {width: 100%; text-align: center; padding: 20px; margin: 10px 0;}
.app-footer {position: relative; width: 100%; margin-top: auto;}
.app-error-page {display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #FBF9F5 0%, #F3EBE0 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #7B1E3E; padding: 20px; text-align: center;}
.app-error-details {color: #6D665E; margin-top: 20px;}
.app-toggler-icon {filter: brightness(0) invert(1);}
.app-empty-card {border-radius: 20px;}
.app-empty-icon {font-size: 4rem;}
.app-card-title-primary {color: var(--primary-color);}
.app-container {margin-top: 4px;}
.app-detail-main {font-weight: 600; font-size: 1.1rem;}
.app-detail-sub {font-size: 0.9rem; margin-top: 2px;}
.app-detail-sub2 {font-size: 0.8rem; margin-top: 2px;}
.app-profile-img-ctr {cursor: pointer;}
.app-card-title-theme {color: var(--primary-color); display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: nowrap;}
.app-btn-contact-compact {width: auto; min-width: 40px; padding: 4px 8px; margin-top: 0;}
.app-spinner-primary {color: var(--primary-color) !important;}
.modal-title.app-modal-title {color: white;}
.app-unlock-header {background: linear-gradient(135deg, #7B1E3E, #561634); color: white; border-bottom: none;}
.app-unlock-body {padding: 2rem;}
.app-btn-check-count {border-radius: 50px; padding: 8px 20px !important; margin-bottom: 33px !important; background: linear-gradient(135deg, #C8914A, #A97638) !important; color: #3B2A12 !important; border: none; box-shadow: 0 4px 12px rgba(176, 127, 46, 0.3);}
.app-unlock-icon {font-size: 48px; margin-bottom: 15px;}
.app-lock-open {color: #7B1E3E;}
.app-unlock-title {margin-bottom: 15px;}
.app-unlock-text {color: #6D665E; margin-bottom: 5px;}
.app-count-200 {font-size: 200%;}
.app-count-175 {font-size: 175%;}
.app-count-150 {font-size: 150%;}
.app-unlock-note {color: #6D665E; font-size: 14px;}
.app-unlock-warning {display: none; color: #C0392B; font-size: 14px; font-weight: 600; margin-top: 15px; animation: blink 1s infinite;}
.app-unlock-footer {border-top: none; padding-bottom: 1.5rem;}
.app-btn-unlock-opt {border-radius: 50px; padding: 8px 24px;}
@media (max-width: 575.98px) {body {font-size: 0.95rem;}#main-content {margin-top: 60px;padding: 0.75rem;}.app-container {margin-top: 12px;}.profile-card {border-radius: 16px !important;}.profile-card .profile-thumbnail {border-radius: 16px 16px 0 0;}.app-btn-check-count {width: 100%;}.modal-dialog {margin: 0.5rem;}.app-unlock-body {padding: 1.25rem;}.navbar-brand {font-size: 1.05rem;}}
@media (min-width: 576px) and (max-width: 767.98px) {#main-content {padding: 0.75rem;}.app-container {margin-top: 16px;}}
@media (min-width: 768px) and (max-width: 991.98px) {#main-content {padding: 1%;}.app-container {margin-top: 18px;}}
@media (min-width: 1200px) {#main-content {padding: 1.25%;}}
@media (prefers-color-scheme: dark) {.app-error-page {background: linear-gradient(135deg, #1C1618 0%, #2A1B21 100%);color: #E6BB68;}.app-error-details {color: #C9BEB4;}.app-footer {background: #2A1F24 !important;}}
`;

// Inject the collected appcss styles into the page
if (typeof window.addMobileStyles === 'function') {
 window.addMobileStyles();
}

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
  if (whrStr.trim() === '' && myEinMR && myEinMR.w && myEinMR.w.length > 0 && payload0.x1 === '') {
   payload0.whr = "w = '" + myEinMR.w + "'";
  } else {
   payload0.whr = whrStr;
  }
  const response = await fnj3("https://my1.in/2/g.php", payload0, 0, true, null, 20000, 0, 1, 1, 0);

  if (response.su == 1) {
   // Process profiles to extract thumbnail from u field
   const profiles = (response.mr.l || []).map(profile => {
    let imageData = null;

    // Handle u field - could be object, string, or already processed
    if (profile.u) {
     if (typeof profile.u === 'object') {
      imageData = profile.u;
     } else if (typeof profile.u === 'string') {
      try {
       imageData = JSON.parse(profile.u);
      } catch (e) {
       imageData = { a: profile.u, b: profile.u };
      }
     }
    }

    // Extract thumbnail and original image
    if (imageData && imageData.b) {
     profile.thumbnail = imageData.b;
     profile.originalImage = imageData.a || imageData.b;
    } else if (profile.ut) {
     profile.thumbnail = profile.ut;
     profile.originalImage = profile.ut;
    } else {
     profile.thumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFMEUwRTAiLz48dGV4dCB4PSIxNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdDwvdGV4dD48dGV4dCB4PSIxNTAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
     profile.originalImage = null;
    }

    return profile;
   });

   return {
    profiles: profiles,
    hasMore: response.mr.hasMore || (profiles.length > 0 || false)
   };
  } else {
   return {
    profiles: [],
    hasMore: false
   };
  }
 } catch (error) {
  return {
   profiles: [],
   hasMore: false
  };
 }
}

const mono_fl_csh_no = 37;
const mono_loader_id = null;
const mono_show_modal = 1;
const mono_callBackFn = 'callBck_mra_e';
const mono_input_el_id = "mra__e";
const mono_dv_el_id = "---------";//the ei.min.js removes given div if found "mra__e_div" & adds new one with that id;

const sibling_fl_csh_no = 27;
const sibling_loader_id = null;
const sibling_show_modal = 1;
const sibling_callBackFn = null;
const sibling_input_el_id = "mra__x";
const sibling_dv_el_id = "mra__x_div";

async function showProfileDtls(profileId) {
 //  const t351mp = await chkIfLoggedIn();
 //  if (t351mp.su == 1)
 //   (async () => { await loadExe2Fn(36, [profileId], [1]); })();
 //  else
 //   (async () => { await loadExe2Fn(5, [], [1]); })();

 //  if (t351mp.su == 1) {

 //thus below code to create modal every time;

 // Get the modal element
 const modalElement = document.getElementById("mra_");
 if (modalElement) {
  // Get Bootstrap modal instance
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) {
   modal.hide(); // Hide the modal first
  }
  // Remove from DOM
  modalElement.remove();
  // Remove from modal stack if you're using it
  if (typeof removeModalFromStack === 'function') {
   removeModalFromStack("abc");
  }
 }


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
  "thumbnailSize": 600,  // Add thumbnail size
  "resizeBy": 0
 }, { "a": "x", "b": "setSiblingTags", "canAdd": addingAllowed, "params": [sibling_fl_csh_no, [sibling_loader_id, sibling_dv_el_id, sibling_show_modal, sibling_callBackFn, sibling_input_el_id], [1]] }, { "a": "z", "b": "setValByProprtyToElm", "c": "bloodGroups", "canAdd": addingAllowed }, { "a": "a5", "b": "setValByProprtyToElm", "c": "var_genders", "canAdd": addingAllowed }, { "a": "a7", "b": "setValByProprtyToElm", "c": "relation_with_regr", "d": "string1", "e": -1, "canAdd": addingAllowed }, {
  "a": "u",
  "b": "prepImgByURL", "driveMl": window[my1uzr.worknOnPg].driveMl,
  "canEdit": edtOldAllowed,
  "thumbnailSize": 600,  // Add thumbnail size
  "resizeBy": 0         // 0 = resize by width, 1 = resize by height
  //"folderName": "my1_mr" // optional folder name
 }];
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
    if (!unlockClickedOnce) { unlockClickedOnce = true; const warningText = document.getElementById('unlockWarningText'); if (warningText) { warningText.style.display = 'block'; } confirmBtn.textContent = 'Confirm Unlock'; confirmBtn.style.background = 'linear-gradient(135deg, #c82333, #a71d2a)'; }
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
  if (typeof showToast === 'function') {
   showToast("your profile count limit is finished", {
    type: 'error',
    duration: 5000,
    position: 'top'
   });
  } else {
   alert("your profile count limit is finished");
  }
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
    if (typeof showToast === 'function') {
     showToast(validationResult.ms, {
      type: 'error',
      duration: 5000,
      position: 'top'
     });
    } else {
     alert(validationResult.ms);
    }
    return;
   }
  }

  // Prepare payload (assuming payload0 exists globally)
  payload0.vw = 4;
  payload0.fn = fn;
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
    if (typeof showToast === 'function') {
     showToast('Profile count used successfully!', {
      type: 'success',
      duration: 3000,
      position: 'top'
     });
    } else {
     alert('Profile count used successfully!');
    }
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

  if (typeof showToast === 'function') {
   showToast('Failed to save changes: ' + error.message, {
    type: 'error',
    duration: 5000,
    position: 'top'
   });
  } else {
   alert('Error saving changes: ' + error.message);
  }
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
   if (typeof showToast === 'function') {
    showToast('Count checked successfully!', { type: 'success', duration: 3000, position: 'top' });
   } else {
    alert('Count updated successfully!');
   }
  } else {
   throw new Error(response.ms || 'Check failed');
  }
 } catch (error) {
  console.error('Error checking count:', error);
  const ldr = document.getElementById(loaderId);
  if (ldr) ldr.style.display = 'none';
  if (typeof showToast === 'function') {
   showToast('Failed to check count: ' + error.message, { type: 'error', duration: 5000, position: 'top' });
  } else {
   alert('Error checking count: ' + error.message);
  }
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

function hndl_mrrspo(response, reload = 0, fnToRunOnAllOk, fnToRunOnErr, rqst) {
 (async () => {
  try {
   //this function is called when response.su == 1
   if (response.ma != null) {
    if (response.ma.l != null) {
     const t3776mp = await dbDexieManager.insertToDexie(dbnm, "ma", response.ma.l, true, ["a"]);
    }
   }
   if (response.f != null) {
    if (response.f.l != null) {
     const t3776mp = await dbDexieManager.insertToDexie(dbnm, "f", response.f.l, true, ["a"]);
    }
   }
   if (response.fp != null) {
    if (response.fp.l != null) {
     const t3776mp = await dbDexieManager.insertToDexie(dbnm, "fp", response.fp.l, true, ["a"]);
    }
   }
   if (response.mr != null) {
    if (response.mr.l != null && response.mr.l.length > 0) {
     const t3776mp = await dbDexieManager.insertToDexie(dbnm, "mr", response.mr.l, true, ["a"]);
     //additional
     proflFullData = null;
     if (rqst && (rqst.fn == 68 || rqst.fn == 69 || rqst.fn == 70)) {
      localStorage.setItem(appOwner.tn + '_myEinMR', JSON.stringify(response.mr.l[0]));
      profileUnlockCount = response.mr.l[0].d1;

      if (rqst && rqst.fn == 69 && response.mr.l[0].d < 0)
       localStorage.removeItem(appOwner.tn + '_myEinMR');
     }
    }
   }
   if (fnToRunOnAllOk != null && typeof fnToRunOnAllOk === 'function') {
    fnToRunOnAllOk(response);
   }
   if (reload == 1) {
    safeReload();
   }
  } catch (error) {
   alert("err: ", error);
   if (fnToRunOnErr != null && typeof fnToRunOnErr === 'function') {
    fnToRunOnErr(response);
   }
  }
 })();
}
//------------------ END PUBLIC APP  (git/mr.js) ------------------
// ---- re-expose public top-level names to global scope (mirrors the original separate-script flow) ----
if (typeof function2runAfter_O_Login !== "undefined") { window.function2runAfter_O_Login = function2runAfter_O_Login; }
if (typeof pullNwProfiles !== "undefined") { window.pullNwProfiles = pullNwProfiles; }
if (typeof showProfileDtls !== "undefined") { window.showProfileDtls = showProfileDtls; }
if (typeof confirmUnlockProfile !== "undefined") { window.confirmUnlockProfile = confirmUnlockProfile; }
if (typeof useOrSetAsideProfile !== "undefined") { window.useOrSetAsideProfile = useOrSetAsideProfile; }
if (typeof chkMyCount !== "undefined") { window.chkMyCount = chkMyCount; }
if (typeof showCancelToastAndCloseModal !== "undefined") { window.showCancelToastAndCloseModal = showCancelToastAndCloseModal; }
if (typeof hndl_mrrspo !== "undefined") { window.hndl_mrrspo = hndl_mrrspo; }
Object.defineProperty(window, "appData", { configurable: true, get: function () { return appData; }, set: function (v) { appData = v; } });
Object.defineProperty(window, "tblFailureCount", { configurable: true, get: function () { return tblFailureCount; }, set: function (v) { tblFailureCount = v; } });
Object.defineProperty(window, "proflFullData", { configurable: true, get: function () { return proflFullData; }, set: function (v) { proflFullData = v; } });
Object.defineProperty(window, "profilesData", { configurable: true, get: function () { return profilesData; }, set: function (v) { profilesData = v; } });
Object.defineProperty(window, "isFetching", { configurable: true, get: function () { return isFetching; }, set: function (v) { isFetching = v; } });
Object.defineProperty(window, "hasMore", { configurable: true, get: function () { return hasMore; }, set: function (v) { hasMore = v; } });
Object.defineProperty(window, "currentPage", { configurable: true, get: function () { return currentPage; }, set: function (v) { currentPage = v; } });
Object.defineProperty(window, "myEinMR", { configurable: true, get: function () { return myEinMR; }, set: function (v) { myEinMR = v; } });
Object.defineProperty(window, "profileUnlockCount", { configurable: true, get: function () { return profileUnlockCount; }, set: function (v) { profileUnlockCount = v; } });
Object.defineProperty(window, "remainingProflCnt", { configurable: true, get: function () { return remainingProflCnt; }, set: function (v) { remainingProflCnt = v; } });
Object.defineProperty(window, "currentUnlockModal", { configurable: true, get: function () { return currentUnlockModal; }, set: function (v) { currentUnlockModal = v; } });
Object.defineProperty(window, "tblsRequired", { configurable: true, get: function () { return tblsRequired; } });
Object.defineProperty(window, "moduLst", { configurable: true, get: function () { return moduLst; } });
Object.defineProperty(window, "sho_da_tkLimit", { configurable: true, get: function () { return sho_da_tkLimit; } });
Object.defineProperty(window, "ids_of_views", { configurable: true, get: function () { return ids_of_views; } });
Object.defineProperty(window, "cacheVersion", { configurable: true, get: function () { return cacheVersion; } });
Object.defineProperty(window, "cacheStrategy", { configurable: true, get: function () { return cacheStrategy; } });
Object.defineProperty(window, "dontShoLoginConfirmation", { configurable: true, get: function () { return dontShoLoginConfirmation; } });
Object.defineProperty(window, "dontRestartAfterLogin", { configurable: true, get: function () { return dontRestartAfterLogin; } });
Object.defineProperty(window, "driveFolderIdForOriginalFile", { configurable: true, get: function () { return driveFolderIdForOriginalFile; } });
Object.defineProperty(window, "driveFolderIdForThumbnailFile", { configurable: true, get: function () { return driveFolderIdForThumbnailFile; } });
Object.defineProperty(window, "fieldNameMap", { configurable: true, get: function () { return fieldNameMap; } });
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
// ---- admin entry hook: consumed by readonly my1ctr.js (admPpRenderModMenu->openAdminFromMenu) ----
// Switches to admin at the SAME url (no ?adm=1): remember mode in sessionStorage,
// show the middle page, then reload so the admin branch initialises cleanly.
window.openAdminFromMenu = function (action) {
 if (action !== "aminPnl") { return; }
 try { sessionStorage.setItem("mr_mode", "admin"); } catch (e) {}
 if (typeof __mrShowMiddlePage === "function") { __mrShowMiddlePage(); }
 setTimeout(function () { window.location.reload(); }, 400);
};
} else {
//================== ADMIN MODE SETUP ==================
// index_.html used to provide the #container_mr__main div the admin app renders into.
// Middle page: pre-fill the container so the user sees it while admin scripts load.
function __mrEnsureAdminContainer() {
 var __c = document.getElementById("container_mr__main");
 if (!__c) {
  __c = document.createElement("div");
  __c.id = "container_mr__main";
  __c.className = "content-container";
  document.body.appendChild(__c);
 }
 if (typeof __mrMiddlePageHTML === "string") { __c.innerHTML = __mrMiddlePageHTML; }
}
if (document.readyState === "loading") {
 document.addEventListener("DOMContentLoaded", __mrEnsureAdminContainer);
} else {
 __mrEnsureAdminContainer();
}
//================== BEGIN ADMIN APP  (git_/mr_.js) ==================
const sho_da_tkLimit = 1;
let appData = {};
const ids_of_views = [3];
let tblFailureCount = 1;
const driveFolderIdForOriginalFile = "18_axqbA4fQaE1X0m0lurfEekS8Mdx6gF";
const driveFolderIdForThumbnailFile = "1fp8zaSDqDJSgghApRAU5D7492Frxse4l";
const cacheVersion = 1763390987;
const cacheStrategy = 1;
const dontShoLoginConfirmation = 1;
const dontRestartAfterLogin = 1;
window[my1uzr.worknOnPg].flsht = 3;
window[my1uzr.worknOnPg].flshu = "/91.9823425404/z/mr/sambodhi-sarang-matrimony-flash.jpeg";
window[my1uzr.worknOnPg].lodErrMs = "press back back & open the app again;";
window[my1uzr.worknOnPg].emptBodyMs = "welcome to 'sifr' matrimoney app;";
window[my1uzr.worknOnPg].t46mp = "https://images.pexels.com/photos/17379008/pexels-photo-17379008.jpeg";
window[my1uzr.worknOnPg].t47mp = "manikarnika";
window[my1uzr.worknOnPg].t48mp = "91.9823425404";
window[my1uzr.worknOnPg].usdInAndroWv = 1;//1 = used in android web view;, this will load back button handling for android;
window[my1uzr.worknOnPg].cardHeight = 60;
window[my1uzr.worknOnPg].seqnce = "u,ut,b6,a5,l,a7,m,n";
//   window[my1uzr.worknOnPg].colsToHide = "a,b,f,t,c,ut,v,ma,na,oa,pa,a2,a3,a4,a6,a7,b9,c1,c3,c5,c6,c7,c8,c9,d2,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,x1,x3,x4,x5,z,a1,a8,a9,b1,k1,k2";//t column in mysql must be used for something else;
window[my1uzr.worknOnPg].colsToHide = "a,a1,a2,a3,a4,a6,a7,a8,a9,b,b1,b5,b9,c,c1,c3,c5,c6,c7,c8,c9,d2,f,h1,h2,i1,i2,i3,i4,i5,i6,i7,i8,k1,k2,ma,na,oa,pa,t,ut,v,x1,x3,x4,x5,z";
window[my1uzr.worknOnPg].colsToSubmit = "a7,u,b6,l,m,n,d,e,f,g,h,i,j,k,k1,o,p,q,qa,qb,qc,r,s,va,x,z,a1,a2,a3,a5,a8,a9,b1,b4,b5,c2,c5,c6,d1,x2";
window[my1uzr.worknOnPg].bdayFormat = "dd-mm-yyyy";
window[my1uzr.worknOnPg].driveMl = "sambodhisarang.in";

window[my1uzr.worknOnPg].nonEditableFields = ['a', 'b', 'c', 'k', 'k1'];
window[my1uzr.worknOnPg].defaFieldVals = ['k~13', 'k1~9'];
window[my1uzr.worknOnPg].colsToShowInTbl = "w,l,u,m,n,ma,d1,e";
window[my1uzr.worknOnPg].thumbnailSize = 600;
window[my1uzr.worknOnPg].thmbnSizeBy = 1;//1=height;
window[my1uzr.worknOnPg].shoThmbNel = 0;

window["vlidFn62_63"] = { "g": { "cnv": "convertDateStrToGvn", "cnvo": { "currentFormat": window[my1uzr.worknOnPg].bdayFormat }, "ty": "dt", "mi": "1950", "ms": "enter correct birth date" }, "l": { "cnv": "handleAsString", "cnvo": { "prepn": "91." }, "patn": "91\\.[6-9]\\d{9}", "ms": "Contact no. to display, required" }, "e": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Mobile of registering customer, is compulsory" }, "j": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Marital status required" }, "m": { "cnv": "handleAsString", "patn": "^[A-Za-z]{2,}$", "ms": "First name required" }, "a5": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Please select whether you are 'Male' or 'Female'" } };

let profileData;
window[my1uzr.worknOnPg].csh = [
 { "a": 1, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@71b250a/cmn/my1e3.min.js" },
 { "a": 2, "u": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" },
 { "a": 3, "u": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" },
 { "a": 4, "u": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" },
 { "a": 5, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@90c6519/cmn/my1lo.js", "c": "open_shoLgnO", "r": "open_shoLgnO" },
 { "a": 6, "u": "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
 { "a": 7, "u": "https://code.jquery.com/jquery-3.6.0.min.js" },
 { "a": 8, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@4d95515/cmn/my1ap.min.js" },
 { "a": 9, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@19fd73d/cmn/my1xi.min.js" },
 { "a": 10, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/drvphp.js", "c": "upld2drv", "r": "upld2drv" },
 { "a": 11, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fc84f58/cmn/my1dra.min.js", "c": "upldAnyFile2drv", "r": "upldAnyFile2drv" },
 { "a": 12, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/fltr.js", "c": "showFilterBox", "r": "showFilterBox" },
 { "a": 13, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/drwr.js", "c": "showDrawer", "r": "showDrawer" },
 { "a": 15, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/andro.js" },
 { "a": 16, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/noti.js", "c": "showNotifications", "r": "showNotifications" },
 { "a": 17, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/prfl.js", "c": "mra__main", "r": "mra__main" },
 { "a": 18, "u": "https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js" },
 { "a": 19, "u": "https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css" },
 { "a": 20, "u": "https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js" },
 { "a": 21, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr_/pri.js", "c": "set_marriage_plan_innerHTML", "r": "set_marriage_plan_innerHTML" },
 { "a": 22, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@cd13b93/cmn/my1lp.js", "c": "open_shoLgnP", "r": "open_shoLgnP" },
 { "a": 23, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@3988bc6/cmn/ei.min.js", "c": "open_entind_crud", "r": "open_entind_crud" },
 { "a": 24, "u": "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.css" },
 { "a": 25, "u": "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js" },
 { "a": 26, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6a12ce/cmn/caste.da" },
 { "a": 27, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b39a4af/cmn/ctco.da" },
 { "a": 30, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/sbli.js", "c": "set_mr_x_sibling_details", "r": "set_mr_x_sibling_details" },
 { "a": 31, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@bd7e9e0/cmn/lng.da" },
 { "a": 33, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@666354f/cmn/degs.da" },
 { "a": 35, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@0208362/cmn/occu.da" },
 { "a": 37, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/slkt.js", "c": "openCommonSelectionModal", "r": "openCommonSelectionModal" },
 { "a": 38, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/e.js" },
 { "a": 39, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/vldt.js", "c": "cmnVldet", "r": "cmnVldet" },
 { "a": 40, "u": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css" },
 { "a": 41, "u": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" }
];

let required_data = [];

const fieldNameMap = { "a": "Id", "w": "unique ID", "b": "Recorded", "c": "fn no", "d": "Status;", "e": "Mobile of registering customer", "f": "Constraint no.;", "g": "Birth date & time;", "h": "Height in feet . inch;", "i": "Package in lakhs;", "j": "Marital status", "k": "Religious", "k1": "caste;", "k2": "sub caste / type;", "l": "Contact no. to display", "m": "First name in eng;", "n": "Surname in eng;", "o": "Father's name in eng;", "p": "Mother's name in eng;", "ma": "name lolng;", "na": "surname lolng;", "oa": "fa name lolng;", "pa": "no name lolng;", "q": "Job type", "qa": "Designation / Position;", "qb": "Business form;", "qc": "Business type;", "r": "Education 10th, 12th, 15th, 17th", "s": "Degrees;", "t": "Qualifications e.g. Sci, Com, Be, M.tech, ...", "u": "DP Display Picture;", "ut": "Thumbnail;", "v": "relative surnames (comma separated) eng;", "va": "Relative surnames (comma separated);", "x": "Siblings;", "z": "Blood group", "a1": "Weight (kg);", "a2": "City currently working in;", "a3": "Country currently working in;", "a4": "Diet", "a5": "Gender Male female", "a6": "Skin color", "a7": "Above no. is of:", "a8": "No. of own Home / shop", "a9": "Languages known", "b1": "No. of own Vehicle", "b4": "Native city", "b5": "Native country", "b6": "Image Gallery", "b9": "Drinking habit", "c2": "Physically challenged", "c3": "lives with family 1=yes, 2=no;", "c5": "Current residential Country", "c6": "Current residential City;", "c7": "Free profile count;", "c8": "Free chat count;", "c9": "Plan Id;", "d1": "Paid profile count", "d2": "Paid chat count", "h1": "Manglik status: 1=manglik, 2=non-manglik, 3=angshik (partial manglik)", "h2": "horoscope available 1=yes, 2=no;", "i1": "islamic sect 1=sunni,2=shia,127=other;", "i2": "islamic mazhab, school of thought 1=Hanafi,2=Shafi,3=Maliki,4=Hanbali,127=other;", "i3": "namaz practice 1,2,3,4,5,-1=occasional, -2=rarely;", "i4": "quran learning 1=basic,2=intermediate,3=hafiz,4=alim,", "i5": "quraan reciting: 1=daily, 2=occasionally, 3=rarely;", "i6": "burkha 1=yes, 2=no", "i7": "beard 1=yes, 2=no", "i8": "believe in dargah 1=yes, 2=no, 3=strictly yes, 4=strictly no", "x1": "Expectations (eng)", "x2": "Expectations", "x3": "partner's diet must be: 1=all, 2=veg, 3=non-veg, 4=occasion-non-veg, 5=eggetarain, 6=jain, 7=vegan;", "x4": "girl job though: 1=yes interested, 2=will do job compulsory, 3=may be, 4=if required, 5=no-wont do job", "x5": "girl currently doing job 1=yes, 2=no" };
window.var_sub_caste_type = [{ "a": 0, "e": "-" }, { "a": 1, "e": "Jamati" }, { "a": 2, "e": "Ahle hadees" }, { "a": 3, "e": "Devbandi" }];
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
let profilesData = []; // Store all profile data
let c_table = [];
let filteredProfilesData = null; // Store filtered data
let currentStatusFilter = null; // Track current filter

function sendInfoToAddProfile(id_of_update_button, object_of_key_value_of_each_field, null1ByDefa, null2ByDefa, fullObject) {
 console.log('testing ln 82');
}

function hndl_mr_rspo(response, reload = 0, fnToRunOnAllOk, fnToRunOnErr) {
 (async () => {
  try {
   //this function is called when response.su == 1
   if (response.c != null) {
    if (response.c.l != null) {
     const t3776mp = await dbDexieManager.insertToDexie(dbnm, "c", response.c.l, true, ["a"]);
    }
   }
   if (response.mr != null) {
    if (response.mr.l != null) {
     const t3776mp = await dbDexieManager.insertToDexie(dbnm, "mr", response.mr.l, true, ["a"]);
    }
   }
   if (response.ma != null) {
    if (response.ma.l != null) {
     const t3776mp = await dbDexieManager.insertToDexie(dbnm, "ma", response.ma.l, true, ["a"]);
    }
   }
   if (response.mp != null) {
    if (response.mp.l != null) {
     const t3776mp = await dbDexieManager.insertToDexie(dbnm, "mp", response.mp.l, true, ["a"]);
    }
   }
   if (fnToRunOnAllOk != null && typeof fnToRunOnAllOk === 'function') {
    fnToRunOnAllOk(response);
   }
   if (reload == 1) {
    location.reload();
   }
  } catch (error) {
   alert("err: ", error);
   if (fnToRunOnErr != null && typeof fnToRunOnErr === 'function') {
    fnToRunOnErr(response);
   }
  }
 })();
}

function addMobileStyles() {
 const style = document.createElement('style');
 style.textContent = `
/* === CSS VARIABLES - VIOLET THEME === */
:root {
    /* Primary Colors - Violet Theme */
    --primary-color: #7B1FA2;          /* Violet */
    --primary-light: #9C27B0;          /* Lighter Violet */
    --primary-dark: #4A148C;           /* Darker Violet */
    
    /* Secondary Colors - Teal/Accent */
    --secondary-color: #00BFA5;        /* Teal */
    --secondary-light: #26A69A;        /* Lighter Teal */
    --secondary-dark: #00897B;         /* Darker Teal */
    
    /* Tertiary Color - Amber/Accent */
    --accent-color: #FFB300;           /* Amber/Gold */
    --accent-light: #FFCA28;           /* Lighter Amber */
    --accent-dark: #FF8F00;            /* Darker Amber */
    
    /* Status Colors */
    --success-color: #4CAF50;
    --info-color: #2196F3;
    --warning-color: #FF9800;
    --danger-color: #F44336;
    
    /* Neutral Colors */
    --light-color: #F5F5F5;
    --dark-color: #212121;
    --white-color: #FFFFFF;
    --black-color: #000000;
    
    /* Background Colors */
    --background-color: #FAFAFA;       /* Very light gray */
    --card-bg-color: var(--white-color);
    --nav-bg-color: var(--primary-color);
    --footer-bg-color: var(--dark-color);
    
    /* Text Colors */
    --text-primary: #212121;
    --text-secondary: #757575;
    --text-light: #FAFAFA;
    --text-dark: #424242;
    --text-on-primary: var(--white-color);
    
    /* Border & Shadow */
    --border-color: #E0E0E0;
    --shadow-color: rgba(123, 31, 162, 0.1);  /* Violet tinted shadow */
    --shadow-color-dark: rgba(123, 31, 162, 0.15);
}

/* Optional: Violet Gradient Background */
body {
    background: linear-gradient(135deg, #FAFAFA 0%, #F3E5F5 100%) !important;
}

/* Card hover with violet shadow */
.card:hover {
    box-shadow: 0 8px 25px rgba(123, 31, 162, 0.2) !important;
    transform: translateY(-4px) !important;
}

/* Profile ID badge with gradient */
.profile-id {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;
    box-shadow: 0 2px 8px rgba(123, 31, 162, 0.3);
}

/* Button enhancements - EXCLUDE NAVBAR BUTTONS */
button:not(.btn-link):not(.navbar-toggler):not([class*="navbar"]):not([class*="nav-"]):not(.nav-link) {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;
    border: none !important;
    color: var(--text-on-primary) !important;
    border-radius: 50px !important;
    padding: 10px 20px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 12px rgba(123, 31, 162, 0.25) !important;
}

button:not(.btn-link):not(.navbar-toggler):not([class*="navbar"]):not([class*="nav-"]):not(.nav-link):hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 18px rgba(123, 31, 162, 0.35) !important;
}

button:not(.btn-link):not(.navbar-toggler):not([class*="navbar"]):not([class*="nav-"]):not(.nav-link):active {
    transform: translateY(1px) !important;
}

/* More specific navbar button styling */
.navbar .btn {
    border-radius: 8px !important; /* Different from pill buttons */
    padding: 8px 16px !important;
    font-weight: normal !important;
    box-shadow: none !important;
    background: var(--primary-dark) !important; /* Solid color instead of gradient */
}

.navbar .btn:hover {
    transform: none !important;
    background: var(--primary-color) !important;
}

/* Active filter button styling */
.active-filter {
    background: linear-gradient(135deg, #00BFA5, #00897B) !important;
    color: white !important;
    box-shadow: 0 4px 12px rgba(0, 191, 165, 0.3) !important;
}

.active-filter:hover {
    background: linear-gradient(135deg, #00BFA5, #00897B) !important;
    box-shadow: 0 6px 18px rgba(0, 191, 165, 0.4) !important;
}

/* Profile overlay with violet gradient */
.profile-overlay {
    background: linear-gradient(to bottom, 
        transparent 50%, 
        rgba(123, 31, 162, 0.1) 70%,
        rgba(123, 31, 162, 0.3) 90%,
        rgba(123, 31, 162, 0.6) 100%
    ) !important;
}

/* Navbar with gradient - ensure this stays */
.navbar {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;
}

/* Navbar toggler button (hamburger menu) specific styling */
.navbar-toggler {
    border: 2px solid rgba(255, 255, 255, 0.5) !important;
    border-radius: 8px !important;
    padding: 6px 10px !important;
}

.navbar-toggler:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5) !important;
}

/* Violet loading animation */
.profile-thumbnail.loading {
    background: linear-gradient(90deg, 
        #F3E5F5 25%, 
        #E1BEE7 50%, 
        #F3E5F5 75%
    ) !important;
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

/* Selection color */
::selection {
    background-color: rgba(123, 31, 162, 0.3);
    color: var(--text-primary);
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #F3E5F5;
}

::-webkit-scrollbar-thumb {
    background: var(--primary-light);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
}

/* Status filter dropdown */
.status-filter-dropdown .dropdown-item {
    border-radius: 8px !important;
    margin: 2px 8px !important;
    transition: all 0.3s ease !important;
}

.status-filter-dropdown .dropdown-item:hover {
    background: linear-gradient(135deg, rgba(123, 31, 162, 0.1), rgba(123, 31, 162, 0.05)) !important;
    transform: translateX(5px);
}

/* DARK MODE - Violet variation */
@media (prefers-color-scheme: dark) {
    :root {
        --background-color: #1A1A1A;
        --card-bg-color: #2D2D2D;
        --text-primary: #FFFFFF;
        --text-secondary: #B0B0B0;
        --border-color: #444444;
        --shadow-color: rgba(123, 31, 162, 0.15);
        --light-color: #2D2D2D;
    }
    
    body {
        background: linear-gradient(135deg, #1A1A1A 0%, #2A1A32 100%) !important;
    }
    
    /* Dark mode navbar */
    .navbar {
        background: linear-gradient(135deg, var(--primary-dark), #311B5C) !important;
    }
    
    .navbar .btn {
        background: rgba(255, 255, 255, 0.1) !important;
    }
    
    .navbar .btn:hover {
        background: rgba(255, 255, 255, 0.2) !important;
    }
}

/* Add this to target common navbar button patterns */
.navbar-nav .btn,
.navbar-nav button,
.navbar button:not(.navbar-toggler) {
    all: unset !important; /* Reset all styles */
    color: white !important;
    padding: 8px 16px !important;
    border-radius: 6px !important;
    margin: 0 4px !important;
    cursor: pointer !important;
    transition: background-color 0.3s ease !important;
}

.navbar-nav .btn:hover,
.navbar-nav button:hover,
.navbar button:not(.navbar-toggler):hover {
    background: rgba(255, 255, 255, 0.25) !important;
    transform: none !important;
    box-shadow: none !important;
}

.profile-card {
    height: \${window[my1uzr.worknOnPg].cardHeight || 60}vh !important;
    display: flex !important;
    flex-direction: column !important;
    border-radius: 11px !important;
    box-shadow: 0 20px 40px rgba(123, 31, 162, 0.35), 0 10px 25px rgba(123, 31, 162, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.8), 0 0 20px rgba(123, 31, 162, 0.2) !important;
}

.profile-card .card-body {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
}

.profile-card .profile-image-container {
    height: 70% !important;
    overflow: hidden !important;
    position: relative !important;
}

.profile-card .profile-thumbnail {
    object-fit: cover !important;
    border-radius: 11px;
}

.profile-card .btn {
    margin-top: auto !important;
}

.profile-card .card-title {
    text-align: center !important;
    font-weight: 600 !important;
    margin-bottom: 10px !important;
}

.profile-card .profile-details {
    text-align: center !important;
    flex-grow: 1 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* Ensure primary color is used for titles */
.text-theme-primary {
    color: var(--primary-color) !important;
}

/* Image thumbnail styles for DataTable */
.image-thumbnail-container {
    position: relative;
    display: inline-block;
}

.image-thumbnail-container img {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-thumbnail-container img:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(123, 31, 162, 0.3);
}

/* DataTable custom styles */
.dataTables_wrapper .dataTables_filter input {
    border-radius: 20px !important;
    border: 1px solid var(--primary-light) !important;
    padding: 6px 12px !important;
}

.dataTables_wrapper .dataTables_filter input:focus {
    box-shadow: 0 0 0 3px rgba(123, 31, 162, 0.1) !important;
    border-color: var(--primary-color) !important;
}

.dataTables_wrapper .dataTables_length select {
    border-radius: 10px !important;
    border: 1px solid var(--primary-light) !important;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
    .dataTables_wrapper .dataTables_length,
    .dataTables_wrapper .dataTables_filter {
        text-align: center !important;
        margin-bottom: 10px !important;
    }
    
    .card-header h3 {
        font-size: 1.2rem !important;
    }
    
    #recordCount {
        font-size: 0.8rem !important;
        padding: 4px 8px !important;
    }
}
.upload_preview_container {
    z-index: 10000 !important;
    position: relative !important;
}
.form_group {
    z-index: auto;
    position: relative;
}

.mra_-add-image-item,
.mra_-add-image-item * {
    pointer-events: auto !important;
    cursor: pointer !important;
}
`;

 document.head.appendChild(style);
}

// Filter functions
function filterByStatus(statusValue) {
 if (!window.matrimonyDataTable) {
  console.error('DataTable not initialized');
  return;
 }

 const table = window.matrimonyDataTable;

 if (statusValue === null || statusValue === undefined) {
  // Clear filter - show all data
  if (filteredProfilesData) {
   table.clear().rows.add(profilesData).draw();
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
  // Filter the profilesData array
  const filtered = profilesData.filter(profile => {
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
  const count = profilesData.filter(p => p.d === statusValue).length;

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
  : (profilesData ? profilesData.length : 0);

 recordCountElement.textContent = count;
}

// Function to update status counts in dropdown
function updateStatusCounts() {
 const counts = { 0: 0, 1: 0, 2: 0 };
 profilesData.forEach(item => {
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
  // Step 1: Check if container exists
  const container = document.getElementById('container_mr__main');
  if (!container) {
   throw new Error('Container element not found');
  }

  // Step 2: Load the first script (my1e3.min.js)
  const firstScript = window[my1uzr.worknOnPg].csh.find(item => item.a === 1);
  if (!firstScript) {
   throw new Error('First script (a=1) not found in csh array');
  }

  console.log('Loading first script:', firstScript.u);

  await new Promise((resolve, reject) => {
   const script = document.createElement('script');
   script.src = firstScript.u;
   script.onload = () => resolve();
   script.onerror = () => reject(new Error(`Failed to load script: ${firstScript.u}`));
   document.head.appendChild(script);
  });

  const t351mp = await chkIfLoggedIn();
  if (t351mp.su != 1) {
   const result1 = await loadCshScriptsSequentially(2, 3);
   (async () => { await loadExe2Fn(22, [], [1]); })();
  }
  else {
   // Step 3: Load other required scripts sequentially
   console.log('Loading other required scripts...');
   const result1 = await loadCshScriptsSequentially(6, 9);

   if (result1.success) {
    const createResult = await dbDexieManager.handleNwTables("loader", dbnm, ["c", "mr", "mp", "ma"]);
    tblFailureCount = createResult.failureCount;
    console.log(`Loaded ${result1.loadedCount}/${result1.totalScripts} scripts successfully`);
    const result2 = await loadCshScriptsSequentially(38, 39, 2, 3, 4, 7, 37, 40, 41, 10, 18, 19, 20, 24, 25);
    if (result2.success) {
     const prepCasteReligionData = 1;
     //   await loadExe2Fn(29, [prepCasteReligionData], [1]);
     await loadExe2Fn(37, [], [1]);
     //initDriveUploader();//to use my1drv.
     // Step 4: Add violet theme styles
     addMobileStyles();


     cmn_prep_data_set_to_var("mr_desig_posis", 1, 35);
     cmn_prep_data_set_to_var("var_caste_rlgns", 1, 26);
     cmn_prep_data_set_to_var("var_degres", 1, 33);
     cmn_prep_data_set_to_var("var_ctco", 1, 27);
     cmn_prep_data_set_to_var("var_lngs", 1, 31);



     // Clear container
     container.innerHTML = '';

     // Create responsive container with violet theme
     const tableContainer = document.createElement('div');
     tableContainer.className = 'container-fluid mt-3';
     tableContainer.innerHTML = `
      <div class="card shadow-lg border-0" style="border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(123, 31, 162, 0.15), 0 10px 25px rgba(123, 31, 162, 0.1) !important;">
        <div class="card-header text-white d-flex justify-content-between align-items-center" style="background: linear-gradient(135deg, #7B1FA2, #4A148C) !important; padding: 1rem 1.5rem;">
          <h3 class="mb-0">
            <i class="fas fa-users me-2"></i>
            Matrimony Profiles
          </h3>
          <div class="d-flex align-items-center">

<!-- <button class="btn btn-light"  onclick="(async () => { await loadExe2Fn(17, [0], [1]); })()"><i class="fa-solid fa-plus"></i> ad new</button> -->
<button class="btn btn-light"  onclick="addNewProfile()"><i class="fa-solid fa-plus"></i> ad new</button>
<button class="btn btn-light"  onclick="(async () => { await loadExe2Fn(21, [], [1]); })()" style="border-radius: 50px; padding: 8px 16px; box-shadow: 0 4px 12px rgba(123, 31, 162, 0.2);">
<i class="fas fa-eye"></i> view plans
</button>

            <!-- Status Filter Dropdown -->
            <div class="dropdown me-3 status-filter-dropdown">
              <button class="btn btn-light dropdown-toggle d-flex align-items-center" 
                      type="button" 
                      id="statusFilterDropdown" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                      style="border-radius: 20px; padding: 8px 16px; box-shadow: 0 4px 12px rgba(123, 31, 162, 0.2);">
                <i class="fas fa-filter me-2"></i>
                <span>Status Filter</span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="statusFilterDropdown" style="border-radius: 15px; overflow: hidden; box-shadow: 0 10px 25px rgba(123, 31, 162, 0.2);">
                <li>
                  <button class="dropdown-item d-flex align-items-center" onclick="filterByStatus(null)">
                    <i class="fas fa-times-circle me-2 text-secondary"></i>
                    Clear Filter
                  </button>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item d-flex align-items-center" onclick="filterByStatus(0)">
                    <span class="badge bg-warning me-2" style="width: 10px; height: 10px; border-radius: 50%;"></span>
                    Entry (${statusMap[0]})
                  </button>
                </li>
                <li>
                  <button class="dropdown-item d-flex align-items-center" onclick="filterByStatus(1)">
                    <span class="badge bg-success me-2" style="width: 10px; height: 10px; border-radius: 50%;"></span>
                    Accepted (${statusMap[1]})
                  </button>
                </li>
                <li>
                  <button class="dropdown-item d-flex align-items-center" onclick="filterByStatus(2)">
                    <span class="badge bg-danger me-2" style="width: 10px; height: 10px; border-radius: 50%;"></span>
                    Denied (${statusMap[2]})
                  </button>
                </li>
              </ul>
            </div>
            
            <span class="badge bg-light text-dark me-3 px-3 py-2" id="recordCount" style="border-radius: 20px; box-shadow: 0 4px 12px rgba(123, 31, 162, 0.2);">
              <i class="fas fa-database me-1"></i>
              <span id="recordCountNumber">0</span> records
            </span>
            <button class="btn btn-light" id="refreshBtn" style="border-radius: 50px; padding: 8px 16px; box-shadow: 0 4px 12px rgba(123, 31, 162, 0.2);">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table id="matrimonyTable" class="table table-hover w-100 mb-0" style="border-collapse: separate; border-spacing: 0;">
              <thead style="position: sticky; top: 0; z-index: 10; background: linear-gradient(135deg, #e8b1ff, #7882ff) !important;">
                <!-- Column headers will be generated dynamically by DataTables -->
              </thead>
              <tbody style="background-color: #FAFAFA;">
                <!-- Data will be populated by DataTables -->
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer text-muted d-flex justify-content-between align-items-center" style="background: #F5F5F5; border-top: 1px solid #E0E0E0; padding: 1rem 1.5rem;">
          <small class="text-secondary">
            <i class="fas fa-info-circle me-1"></i>
            Click the <i class="fas fa-ellipsis-v text-primary"></i> button to view/edit profile
          </small>
          <small class="text-primary">
            <i class="fas fa-palette me-1"></i>
            Violet Theme | Showing ${columnsToShow.length} columns
          </small>
        </div>
      </div>
    `;

     container.appendChild(tableContainer);

     // Create modal for JSON display with violet theme
     const jsonModalHtml = `
      <div class="modal fade" id="jsonRecordModal" tabindex="-1" aria-labelledby="jsonRecordModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content" style="border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(123, 31, 162, 0.2);">
            <div class="modal-header text-white" style="background: linear-gradient(135deg, #7B1FA2, #4A148C) !important;">
              <h5 class="modal-title" id="jsonRecordModalLabel">
                <i class="fas fa-code me-2"></i>
                Complete Record Details
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0">
              <pre id="jsonRecordContent" style="margin: 0; padding: 20px; max-height: 60vh; overflow: auto; background-color: #F8F9FA; font-family: 'Courier New', monospace;"></pre>
            </div>
            <div class="modal-footer" style="background: #F5F5F5; border-top: 1px solid #E0E0E0;">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="border-radius: 50px; padding: 8px 20px;">
                <i class="fas fa-times me-1"></i> Close
              </button>
              <button type="button" class="btn btn-primary" id="copyJsonBtn" style="border-radius: 50px; padding: 8px 20px; background: linear-gradient(135deg, #7B1FA2, #4A148C) !important; border: none;">
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
      profilesData = await dbDexieManager.getAllRecords(dbnm, "mr") || [];
      profilesData.sort((a, b) => new Date(b.b) - new Date(a.b));

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
       width: '100px',
       className: 'dt-center',
       orderable: true,
       render: function (data, type, row, meta) {
        // Check if status (d) is negative
        const isDeleted = row.d < 0;
        const idColor = isDeleted ? '#dc3545' : '#7B1FA2';  // red for deleted, violet for normal
        const badgeText = isDeleted ? ' (Deleted)' : '';

        // Display ID with vertical ellipsis button
        return `
      <div class="d-flex align-items-center justify-content-between">
        <span class="fw-bold" style="color: ${idColor};">
          ${data}${badgeText}
        </span>
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
         className: 'dt-center',
         orderable: true,
         render: function (data, type, row) {
          if (data === null || data === undefined) {
           return '<span class="text-muted">—</span>';
          }

          const statusText = statusMap[data] || 'Unknown';
          const statusColor = statusColors[data] || 'secondary';
          const isActive = currentStatusFilter === data;

          return `
           <span class="badge bg-${statusColor} px-3 py-2 ${isActive ? 'border border-2 border-white' : ''}" 
                 style="border-radius: 20px; font-weight: 600; cursor: pointer; box-shadow: ${isActive ? '0 0 0 3px rgba(123, 31, 162, 0.3)' : 'none'};"
                 onclick="filterByStatus(${data})"
                 title="Click to ${isActive ? 'clear' : 'filter by'} ${statusText}">
             ${statusText}
             ${isActive ? '<i class="fas fa-times ms-1"></i>' : ''}
           </span>
         `;
         }
        });
       } else if (fieldKey === 'u' || fieldKey === 'ut') {
        columnDefs.push({
         data: fieldKey,
         title: fieldTitle,
         width: '120px',
         className: 'dt-center',
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
          const isImageUrl = imageExtensions.some(ext => imageUrl.toLowerCase().includes(ext) || imageUrl.includes('pexels.com') || imageUrl.includes('photobucket') || imageUrl.includes('imgur') || imageUrl.includes('cloudinary'));
          if (isImageUrl) {
           return `<div class="image-thumbnail-container" style="position: relative;"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%23E3E3E3' rx='6'%3E%3C/rect%3E%3C/svg%3E" data-src="${imageUrl.replace(/'/g, "\\'")}" data-original="${originalUrl.replace(/'/g, "\\'")}" alt="${fieldTitle}" class="img-thumbnail rounded lazy-load-img" style="width: 50px; height: 50px; object-fit: cover; cursor: pointer;" onclick="openImageModal('${originalUrl.replace(/'/g, "\\'")}', '${fieldTitle}')" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNFM0UzRTMiIHJ4PSI2Ij48L3JlY3Q+PHBhdGggZD0iTTMxLjI1IDIwLjVMMzMuNzUgMjNMMjYuMjUgMzAuNUwyMC4yNSAyNC41TDE1LjUgMjkuMjVMMTYuNzUgMzAuNUwyMC4yNSAyN0wzMS4yNSAyMC41WiIgZmlsbD0iI0YwRjBGMSIvPjxwYXRoIGQ9Ik0xOC41IDE4LjVDMTkuNjA0NiAxOC41IDIwLjUgMTcuNjA0NiAyMC41IDE2LjVDMjAuNSAxNS4zOTU0IDE5LjYwNDYgMTQuNSAxOC41IDE0LjVDMTcuMzk1NCAxNCAxNi41IDE0Ljg5NTQgMTYuNSAxNkMxNi41IDE3LjEwNDYgMTcuMzk1NCAxOCAxOC41IDE4WiIgZmlsbD0iI0YwRjBGMSIvPjwvc3ZnPg=='; this.alt='Image failed to load';"><div class="badge bg-primary position-absolute top-0 start-0 translate-middle" style="font-size: 8px; padding: 2px 4px; z-index: 1;">${fieldKey === 'u' ? 'Main' : 'Thumb'}</div></div>`;
          } else { return `<a href="${imageUrl}" target="_blank" class="text-truncate d-inline-block" style="max-width: 100px;" title="${imageUrl}">Link</a>`; }
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
                  <span class="text-truncate" style="max-width: 100px;" title="${data}">${data}</span>
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
         className: 'dt-left',
         render: function (data, type, row) {
          if (data === null || data === undefined || data === '' || data === 'null') {
           return '<span class="text-muted">—</span>';
          }

          // Truncate long text
          if (type === 'display' && data && data.length > 20) {
           return `<span class="text-truncate d-inline-block" style="max-width: 150px;" title="${data.replace(/"/g, '&quot;')}">${data.substring(0, 20)}...</span>`;
          }
          return data;
         }
        });
       }
      });

      // Initialize the DataTable with violet theme
      const table = $('#matrimonyTable').DataTable({
       data: profilesData,
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
              <div class="modal-content" style="border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(123, 31, 162, 0.3);">
                <div class="modal-header text-white" style="background: linear-gradient(135deg, #7B1FA2, #4A148C) !important;">
                  <h5 class="modal-title" id="imageModalLabel">${title || 'Image Preview'}</h5>
                  <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0 d-flex justify-content-center align-items-center" style="min-height: 400px; background: #000;">
                  <img src="${imageUrl}" 
                       alt="${title || 'Image'}" 
                       class="img-fluid" 
                       style="max-height: 70vh; object-fit: contain;"
                       onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMyQjJCMkIiIHJ4PSIxNSI+PC9yZWN0PjxwYXRoIGQ9Ik0xNDAgMjAwTDE4MCAyNDBMMjYwIDE2MEwzMjAgMjIwTDI0MCAzMDBMMTQwIDIwMFoiIGZpbGw9IiNGRjgiLz48L3N2Zz4='; this.alt='Image failed to load';">
                </div>
                <div class="modal-footer" style="background: #F5F5F5; border-top: 1px solid #E0E0E0;">
                  <a href="${imageUrl}" target="_blank" class="btn btn-primary" style="border-radius: 50px; padding: 8px 20px; background: linear-gradient(135deg, #7B1FA2, #4A148C) !important; border: none;">
                    <i class="fas fa-external-link-alt me-1"></i> Open in New Tab
                  </a>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="border-radius: 50px; padding: 8px 20px;">
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

       const modalElement = document.getElementById("mra_");
       if (modalElement) {
        // Get Bootstrap modal instance
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
         modal.hide(); // Hide the modal first
        }
        // Remove from DOM
        modalElement.remove();
        // Remove from modal stack if you're using it
        if (typeof removeModalFromStack === 'function') {
         removeModalFromStack("abc");
        }
       }


       const recordId = $(this).data('record-id');
       //   const rowIndex = $(this).data('row-index');
       //   await loadExe2Fn(17, [recordId, rowIndex], [1]);
       profileData = profilesData.find(item => item.a === recordId);
       required_data[0] = "mra_";//prefix
       required_data[1] = 1;//display modal;
       required_data[2] = fieldNameMap;//field labels;
       required_data[3] = profileData;//json-data

       required_data[4] = [{ "a": "d", "b": "setValByProprtyToElm", "c": "entryStatus", "canAdd": 1 }, { "a": "e", "b": "set_mra_e", "canEdit": 1, "params": [mono_fl_csh_no, [mono_loader_id, mono_show_modal, mono_dv_el_id, mono_callBackFn, mono_input_el_id], [1]] }, { "a": "g", "b": "set_dtt", "c": "yyyy-mm-dd HH:MM:SS", "d": window[my1uzr.worknOnPg].bdayFormat }, { "a": "j", "b": "setValByProprtyToElm", "c": "marital_status", "canAdd": 1 }, { "a": "k", "b": "setValByProprtyToElm", "c": "var_caste_rlgns", "canAdd": 1 }, { "a": "k1", "b": "setValByProprtyToElm", "c": "var_caste_rlgns,castes", "e": profileData.k, "g": "fn_setValToGvnInputs('" + required_data[0] + "','k')", "canAdd": 1 }, { "a": "k2", "b": "setValByProprtyToElm", "c": "var_sub_caste_type", "canAdd": 1 }, { "a": "a3", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "a2", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.a3, "g": "fn_setValToGvnInputs('" + required_data[0] + "','a3')", "canAdd": 1 }, { "a": "b5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "b4", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.b5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','b5')", "canAdd": 1 }, { "a": "c5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "c6", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.c5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','c5')", "canAdd": 1 }, { "a": "q", "b": "setValByProprtyToElm", "c": "mr_job_types", "canAdd": 1 }, { "a": "qa", "b": "setValByProprtyToElm", "c": "mr_desig_posis", "canAdd": 1 }, { "a": "qb", "b": "setValByProprtyToElm", "c": "mr_bsns_forms", "canAdd": 1 }, { "a": "qc", "b": "setValByProprtyToElm", "c": "mr_bsns_typs", "canAdd": 1 }, { "a": "s", "b": "setValByProprtyToElm", "c": "var_degres", "canAdd": 2 }, { "a": "a9", "b": "setValByProprtyToElm", "c": "var_lngs", "canAdd": 2 }, {
        "a": "b6", "b": "setGalleryImages", "canAdd": 1, "driveMl": window[my1uzr.worknOnPg].driveMl,
        "thumbnailSize": 600,  // Add thumbnail size
        "resizeBy": 0
       }, { "a": "x", "b": "setSiblingTags", "canAdd": 1, "params": [sibling_fl_csh_no, [sibling_loader_id, sibling_dv_el_id, sibling_show_modal, sibling_callBackFn, sibling_input_el_id], [1]] }, { "a": "z", "b": "setValByProprtyToElm", "c": "bloodGroups", "canAdd": 1 }, { "a": "a5", "b": "setValByProprtyToElm", "c": "var_genders", "canAdd": 1 }, { "a": "a7", "b": "setValByProprtyToElm", "c": "relation_with_regr", "d": "string1", "e": -1, "canAdd": 1 }, {
        "a": "u",
        "b": "prepImgByURL", "driveMl": window[my1uzr.worknOnPg].driveMl,
        "canEdit": true,
        "thumbnailSize": 600,  // Add thumbnail size
        "resizeBy": 0         // 0 = resize by width, 1 = resize by height
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

       await loadExe2Fn(17, required_data, [1]);
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
          if (typeof showToast === 'function') {
           showToast('JSON copied to clipboard', {
            type: 'success',
            position: 'top',
            duration: 2000
           });
          } else {
           alert('JSON copied to clipboard');
          }
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
              <div class="alert alert-warning" style="border-radius: 15px; box-shadow: 0 10px 25px rgba(123, 31, 162, 0.1);">
                <i class="fas fa-exclamation-triangle fa-2x mb-3" style="color: #7B1FA2;"></i>
                <h4 class="text-dark">Unable to load advanced table features</h4>
                <p class="text-secondary">Please check your internet connection or try refreshing the page.</p>
                <button class="btn mt-2" onclick="location.reload()" style="border-radius: 50px; padding: 10px 25px; background: linear-gradient(135deg, #7B1FA2, #4A148C) !important; color: white; border: none;">
                  <i class="fas fa-redo me-1"></i> Refresh Page
                </button>
              </div>
            </td>
          </tr>
        `;
      }
     }
    } else {
     alert("error creating tables;")
    }
   } else {
    throw new Error(`Failed to load required scripts: ${result1.error}`);
   }
  }
 } catch (error) {
  console.error('Error in container_mr__main:', error);

  // Show error message in container with violet theme
  const container = document.getElementById('container_mr__main');
  if (container) {
   container.innerHTML = `
        <div class="alert alert-danger m-4" role="alert" style="border-radius: 15px; box-shadow: 0 10px 25px rgba(123, 31, 162, 0.1); border-left: 4px solid #7B1FA2;">
          <h4 class="alert-heading d-flex align-items-center">
            <i class="fas fa-exclamation-triangle me-2" style="color: #7B1FA2;"></i>
            Error Loading Content
          </h4>
          <p>${error.message}</p>
          <hr>
          <p class="mb-0">
            <button class="btn" onclick="location.reload()" style="border-radius: 50px; padding: 8px 20px; background: linear-gradient(135deg, #7B1FA2, #4A148C) !important; color: white; border: none;">
              <i class="fas fa-redo me-1"></i> Reload Page
            </button>
          </p>
        </div>
      `;
  }

  if (typeof showToast === 'function') {
   showToast(`Error: ${error.message}`, {
    type: 'error',
    duration: 5000,
    position: 'top'
   });
  }
 }
}

// Make functions globally available
window.container_mr__main = container_mr__main;
window.filterByStatus = filterByStatus;

// Auto-initialization
if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', async () => {
  await container_mr__main();
 });
} else {
 // DOM already loaded
 container_mr__main();
}



const mono_fl_csh_no = 23;
const mono_loader_id = null;
const mono_show_modal = 1;
const mono_callBackFn = 'callBck_mra_e';
const mono_input_el_id = "mra__e";
const mono_dv_el_id = "---------";//the ei.min.js removes given div if found "mra__e_div" & adds new one with that id;

const sibling_fl_csh_no = 30;
const sibling_loader_id = null;
const sibling_show_modal = 1;
const sibling_callBackFn = null;
const sibling_input_el_id = "mra__x";
const sibling_dv_el_id = "mra__x_div";

async function addNewProfile() {
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
     "thumbnailSize": 600,  // Add thumbnail size
     "resizeBy": 0,
     "g": "handleDriveUploadComplete",  // callbackFunctionName (optional)
     "i": "1",                          // showThumb
     "j": "1",                          // autoExecute
     "k": "loader"                     // loaderId
 }
 ,{"a":"x","b":"setSiblingTags"},{"a":"z","b":"setValByProprtyToElm","c":"bloodGroups"},{"a":"a5","b":"setValByProprtyToElm","c":"var_genders"},{"a":"a7","b":"setValByProprtyToElm","c":"relation_with_regr","d":"string1","e":-1},{"a":"u","b":"prepImgByURL","canEdit": true,"driveMl": window[my1uzr.worknOnPg].driveMl,
     "thumbnailSize": 600,  // Add thumbnail size
     "resizeBy": 0}];
 required_data[5] = [];// Click handlers
 required_data[6] = [];*/
 required_data[4] = [{ "a": "d", "b": "setValByProprtyToElm", "c": "entryStatus", "canAdd": 1 }, { "a": "e", "b": "set_mra_e", "canEdit": 1, "params": [mono_fl_csh_no, [mono_loader_id, mono_show_modal, mono_dv_el_id, mono_callBackFn, mono_input_el_id], [1]] }, { "a": "g", "b": "set_dtt", "c": "yyyy-mm-dd HH:MM:SS", "d": window[my1uzr.worknOnPg].bdayFormat }, { "a": "j", "b": "setValByProprtyToElm", "c": "marital_status", "canAdd": 1 }, { "a": "k", "b": "setValByProprtyToElm", "c": "var_caste_rlgns", "canAdd": 1 }, { "a": "k1", "b": "setValByProprtyToElm", "c": "var_caste_rlgns,castes", "e": profileData.k, "g": "fn_setValToGvnInputs('" + required_data[0] + "','k')", "canAdd": 1 }, { "a": "k2", "b": "setValByProprtyToElm", "c": "var_sub_caste_type", "canAdd": 1 }, { "a": "a3", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "a2", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.a3, "g": "fn_setValToGvnInputs('" + required_data[0] + "','a3')", "canAdd": 1 }, { "a": "b5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "b4", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.b5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','b5')", "canAdd": 1 }, { "a": "c5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "c6", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.c5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','c5')", "canAdd": 1 }, { "a": "q", "b": "setValByProprtyToElm", "c": "mr_job_types", "canAdd": 1 }, { "a": "qa", "b": "setValByProprtyToElm", "c": "mr_desig_posis", "canAdd": 1 }, { "a": "qb", "b": "setValByProprtyToElm", "c": "mr_bsns_forms", "canAdd": 1 }, { "a": "qc", "b": "setValByProprtyToElm", "c": "mr_bsns_typs", "canAdd": 1 }, { "a": "s", "b": "setValByProprtyToElm", "c": "var_degres", "canAdd": 2 }, { "a": "a9", "b": "setValByProprtyToElm", "c": "var_lngs", "canAdd": 2 }, {
  "a": "b6", "b": "setGalleryImages", "canAdd": 1, "driveMl": window[my1uzr.worknOnPg].driveMl,
  "thumbnailSize": 600,  // Add thumbnail size
  "resizeBy": 0
 }, { "a": "x", "b": "setSiblingTags", "canAdd": 1, "params": [sibling_fl_csh_no, [sibling_loader_id, sibling_dv_el_id, sibling_show_modal, sibling_callBackFn, sibling_input_el_id], [1]] }, { "a": "z", "b": "setValByProprtyToElm", "c": "bloodGroups", "canAdd": 1 }, { "a": "a5", "b": "setValByProprtyToElm", "c": "var_genders", "canAdd": 1 }, { "a": "a7", "b": "setValByProprtyToElm", "c": "relation_with_regr", "d": "string1", "e": -1, "canAdd": 1 }, {
  "a": "u",
  "b": "prepImgByURL", "driveMl": window[my1uzr.worknOnPg].driveMl,
  "canEdit": true,
  "thumbnailSize": 600,  // Add thumbnail size
  "resizeBy": 0         // 0 = resize by width, 1 = resize by height
  //"folderName": "my1_mr" // optional folder name
 }];;
 required_data[5] = [];
 required_data[6] = [];
 required_data[7] = window[my1uzr.worknOnPg].seqnce;//sequence
 required_data[8] = "a," + window[my1uzr.worknOnPg].colsToHide;
 const functionNumber = 62; const update1New0 = 0;
 required_data[9] = [{ "a": "Add new", "e": "saveProfileChanges", "f": window[my1uzr.worknOnPg].colsToSubmit, "g": functionNumber, "h": update1New0 }];

 await loadExe2Fn(17, required_data, [1]);
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
if (typeof sendInfoToAddProfile !== "undefined") { window.sendInfoToAddProfile = sendInfoToAddProfile; }
if (typeof hndl_mr_rspo !== "undefined") { window.hndl_mr_rspo = hndl_mr_rspo; }
if (typeof addMobileStyles !== "undefined") { window.addMobileStyles = addMobileStyles; }
if (typeof filterByStatus !== "undefined") { window.filterByStatus = filterByStatus; }
if (typeof updateFilterButtonState !== "undefined") { window.updateFilterButtonState = updateFilterButtonState; }
if (typeof updateRecordCount !== "undefined") { window.updateRecordCount = updateRecordCount; }
if (typeof updateStatusCounts !== "undefined") { window.updateStatusCounts = updateStatusCounts; }
if (typeof container_mr__main !== "undefined") { window.container_mr__main = container_mr__main; }
if (typeof addNewProfile !== "undefined") { window.addNewProfile = addNewProfile; }
if (typeof initLazyLoadImages !== "undefined") { window.initLazyLoadImages = initLazyLoadImages; }
Object.defineProperty(window, "appData", { configurable: true, get: function () { return appData; }, set: function (v) { appData = v; } });
Object.defineProperty(window, "tblFailureCount", { configurable: true, get: function () { return tblFailureCount; }, set: function (v) { tblFailureCount = v; } });
Object.defineProperty(window, "profileData", { configurable: true, get: function () { return profileData; }, set: function (v) { profileData = v; } });
Object.defineProperty(window, "required_data", { configurable: true, get: function () { return required_data; }, set: function (v) { required_data = v; } });
Object.defineProperty(window, "profilesData", { configurable: true, get: function () { return profilesData; }, set: function (v) { profilesData = v; } });
Object.defineProperty(window, "c_table", { configurable: true, get: function () { return c_table; }, set: function (v) { c_table = v; } });
Object.defineProperty(window, "filteredProfilesData", { configurable: true, get: function () { return filteredProfilesData; }, set: function (v) { filteredProfilesData = v; } });
Object.defineProperty(window, "currentStatusFilter", { configurable: true, get: function () { return currentStatusFilter; }, set: function (v) { currentStatusFilter = v; } });
Object.defineProperty(window, "sho_da_tkLimit", { configurable: true, get: function () { return sho_da_tkLimit; } });
Object.defineProperty(window, "ids_of_views", { configurable: true, get: function () { return ids_of_views; } });
Object.defineProperty(window, "driveFolderIdForOriginalFile", { configurable: true, get: function () { return driveFolderIdForOriginalFile; } });
Object.defineProperty(window, "driveFolderIdForThumbnailFile", { configurable: true, get: function () { return driveFolderIdForThumbnailFile; } });
Object.defineProperty(window, "cacheVersion", { configurable: true, get: function () { return cacheVersion; } });
Object.defineProperty(window, "cacheStrategy", { configurable: true, get: function () { return cacheStrategy; } });
Object.defineProperty(window, "dontShoLoginConfirmation", { configurable: true, get: function () { return dontShoLoginConfirmation; } });
Object.defineProperty(window, "dontRestartAfterLogin", { configurable: true, get: function () { return dontRestartAfterLogin; } });
Object.defineProperty(window, "fieldNameMap", { configurable: true, get: function () { return fieldNameMap; } });
Object.defineProperty(window, "statusMap", { configurable: true, get: function () { return statusMap; } });
Object.defineProperty(window, "statusColors", { configurable: true, get: function () { return statusColors; } });
Object.defineProperty(window, "columnsToShow", { configurable: true, get: function () { return columnsToShow; } });
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
// ---- Home button at the right side of the admin nav refresh button ----
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
   try { sessionStorage.removeItem("mr_mode"); } catch (e) {}
   window.location.reload();
  });
 } catch (e) { setTimeout(__mrInjectHomeButton, 500); }
}
setTimeout(__mrInjectHomeButton, 100);
}
