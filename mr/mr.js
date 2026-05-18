window["vlidFn62_63"] = { "g": { "cnv": "convertDateStrToGvn", "cnvo": { "currentFormat": window[my1uzr.worknOnPg].bdayFormat }, "ty": "dt", "mi": "1950", "ms": "enter correct birth date" }, "l": { "cnv": "handleAsString", "cnvo": { "prepn": "91." }, "patn": "91\\.[6-9]\\d{9}", "ms": "Contact no. to display, required" }, "j": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Marital status required" }, "m": { "cnv": "handleAsString", "patn": "^[A-Za-z]{2,}$", "ms": "First name required" }, "a5": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Please select whether you are 'Male' or 'Female'" } };
window["vlidFn68"] = { "a": { "cnv": "handleAsString", "patn": "^[1-9]\\d*$", "ms": "Profile id required" } };

const xtraj_payload = { "fn": 69, "fl": "https://my1.in/2/c.php" };

const fieldNameMap = { "a": "Id", "w": "unique ID", "e": "Mobile of registering customer", "g": "Birth date & time;", "h": "Height in feet . inch;", "i": "Package in lakhs;", "j": "Marital status", "k": "Religious", "k1": "caste;", "k2": "sub caste / type;", "l": "Contact no. to display", "a7": "Diplay contact no. is of:", "m": "First name in eng;", "n": "Surname in eng;", "o": "Father's name in eng;", "p": "Mother's name in eng;", "q": "Job type", "qa": "Designation / Position;", "qb": "Business form;", "qc": "Business type;", "r": "Education 10th, 12th, 15th, 17th", "s": "Degrees;", "t": "Qualifications e.g. Sci, Com, Be, M.tech, ...", "u": "DP Display Picture;", "ut": "Thumbnail;", "va": "Relative surnames (comma separated);", "x": "Siblings;", "z": "Blood group", "a1": "Weight (kg);", "a3": "Country currently working in;", "a2": "City currently working in;", "a4": "Diet", "a5": "Gender Male female", "a8": "No. of own Home / shop", "b1": "No. of own Vehicle", "a9": "Languages known", "b5": "Native country", "b4": "Native city", "b6": "Image Gallery", "b9": "Drinking habit", "c2": "Physically challenged?, blank if not.", "c3": "lives with family 1=yes, 2=no;", "c5": "Currently living in Country", "c6": "Currently living in City;", "c7": "Free profile count;", "c8": "Free chat count;", "c9": "Plan Id;", "d1": "Paid profile count", "d2": "Paid chat count", "h1": "Manglik status: 1=manglik, 2=non-manglik, 3=angshik (partial manglik)", "h2": "horoscope available 1=yes, 2=no;", "i1": "islamic sect 1=sunni,2=shia,127=other;", "i2": "islamic mazhab, school of thought 1=Hanafi,2=Shafi,3=Maliki,4=Hanbali,127=other;", "i3": "namaz practice 1,2,3,4,5,-1=occasional, -2=rarely;", "i4": "quran learning 1=basic,2=intermediate,3=hafiz,4=alim,", "i5": "quraan reciting: 1=daily, 2=occasionally, 3=rarely;", "i6": "burkha 1=yes, 2=no", "i7": "beard 1=yes, 2=no", "i8": "believe in dargah 1=yes, 2=no, 3=strictly yes, 4=strictly no", "x1": "Expectations (eng)", "x2": "Expectations", "x3": "partner's diet must be: 1=all, 2=veg, 3=non-veg, 4=occasion-non-veg, 5=eggetarain, 6=jain, 7=vegan;", "x4": "girl job though: 1=yes interested, 2=will do job compulsory, 3=may be, 4=if required, 5=no-wont do job", "x5": "girl currently doing job 1=yes, 2=no", "v": "relative surnames (comma separated) eng;", "ma": "name lolng;", "na": "surname lolng;", "oa": "fa name lolng;", "pa": "no name lolng;", "f": "Constraint no.;", "b": "Recorded", "c": "fn no", "d": "Status;" };

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
 //   
 //   { "a": 14, "u": "https://my1.in/0.0000000000/z/mr/mrb.js", "c": "set_mr_profile_innerHTML", "r": "set_mr_profile_innerHTML" },
 //   { "a": 25, "u": "https://my1.in/0.0000000000/z/mr/mrj.js", "c": "set_city_country_innerHTML", "r": "set_city_country_innerHTML" },
 //   { "a": 26, "u": "https://my1.in/0.0000000000/z/mr/mrk.js", "c": "prep_caste_religion_data", "r": "prep_caste_religion_data" },
 //   { "a": 29, "u": "https://my1.in/0.0000000000/z/mr/mrm.js", "c": "prep_languages_innerHTML", "r": "prep_languages_innerHTML" },
 //   { "a": 31, "u": "https://my1.in/0.0000000000/z/mr/mrn.js", "c": "prep_degrees_data", "r": "prep_degrees_data" },
 //   { "a": 33, "u": "https://my1.in/0.0000000000/z/mr/mro.js", "c": "prep_occupations_data", "r": "prep_occupations_data" },
 //   { "a": 34, "u": "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.css" },
 //   { "a": 35, "u": "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js" },
 //   { "a": 36, "u": "https://my1.in/0.0000000000/z/mr/mrq.js", "c": "set_mrq_disp_prof", "r": "set_mrq_disp_prof" },

 window[my1uzr.worknOnPg].csh = [
  { "a": 1, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@92f6756/cmn/my1e3.min.js" },
  { "a": 2, "u": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" },
  { "a": 3, "u": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" },
  { "a": 4, "u": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" },
  { "a": 5, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/cmn/my1lo.js", "c": "open_shoLgnO", "r": "open_shoLgnO" },
  { "a": 6, "u": "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
  { "a": 7, "u": "https://code.jquery.com/jquery-3.6.0.min.js" },
  { "a": 8, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@4d95515/cmn/my1ap.min.js" },
  { "a": 9, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@19fd73d/cmn/my1xi.min.js" },
  { "a": 10, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@24bf6ca/cmn/my1drv.min.js" },
  { "a": 11, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@fc84f58/cmn/my1dra.min.js", "c": "upldAnyFile2drv", "r": "upldAnyFile2drv" },
  { "a": 12, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/fltr.js", "c": "showFilterBox", "r": "showFilterBox" },
  { "a": 13, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/drwr.js", "c": "showDrawer", "r": "showDrawer" },
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
  { "a": 27, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/sbli.js", "c": "set_mr_x_sibling_details", "r": "set_mr_x_sibling_details" },
  { "a": 28, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@bd7e9e0/cmn/lng.da" },
  { "a": 30, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@666354f/cmn/degs.da" },
  { "a": 32, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@0208362/cmn/occu.da" },
  { "a": 37, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@3988bc6/cmn/ei.min.js", "c": "open_entind_crud", "r": "open_entind_crud" },
  { "a": 38, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8a1d5fe/mr/prfl.js", "c": "mra__main", "r": "mra__main" },
  { "a": 39, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/slkt.js", "c": "openCommonSelectionModal", "r": "openCommonSelectionModal" },
  { "a": 40, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/e.js" },
  { "a": 41, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/vldt.js", "c": "cmnVldet", "r": "cmnVldet" },
  { "a": 42, "u": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css" },
  { "a": 43, "u": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" },
  { "a": 44, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/drvphp.js", "c": "upld2drv", "r": "upld2drv" }
 ]

 async function showFlashImage() {
  return new Promise((resolve) => {
   // Get flash image URL and display time
   const flashImageUrl = window[my1uzr.worknOnPg].flshu;
   const minDisplayTime = window[my1uzr.worknOnPg].flsht || 3;

   // Create flash container
   const flashContainer = document.createElement('div');
   flashContainer.id = 'flash-container';
   flashContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        `;

   // Create flash image
   const flashImage = document.createElement('img');
   flashImage.src = flashImageUrl;
   flashImage.alt = 'Loading...';
   flashImage.style.cssText = `
            height: 100%;
            object-fit: contain;
        `;

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
   // Step 1: Load the main script (a==1)
   const mainScript = window[my1uzr.worknOnPg].csh.find(item => item.a === 1);

   if (!mainScript || !mainScript.u) {
    throw new Error('Main script configuration not found');
   }

   // Load the main script
   await loadScript(mainScript.u);

   // Check if my1e3.min.js functions are available
   if (typeof loadCshScriptsSequentially !== 'function') {
    throw new Error('Main script loaded but required functions not available');
   }

   console.log('Main script loaded successfully');

   let result1 = null;
   // Step 2: Load required scripts sequentially
   if (window[my1uzr.worknOnPg].usdInAndroWv && window[my1uzr.worknOnPg].usdInAndroWv === 1)
    result1 = await loadCshScriptsSequentially(42, 43, 44, 2, 3, 4, 6, 7, 9, 40, 15, 34, 35, 37, 39, 41, 8);
   else
    result1 = await loadCshScriptsSequentially(42, 43, 44, 2, 3, 4, 6, 7, 9, 40, 15, 34, 35, 37, 39, 41);

   if (!result1.success) {
    throw new Error('Failed to load required scripts: ' + result1.error);
   } else {
    const createResult = await dbDexieManager.handleNwTables("loader", dbnm, ["ma", "mr"]);
    tblFailureCount = createResult.failureCount;

    // Reset pagination variables
    currentPage = 0;
    hasMore = true;
    isFetching = false;

    cmn_prep_data_set_to_var("mr_desig_posis", 1, 32);
    cmn_prep_data_set_to_var("var_caste_rlgns", 1, 18);
    cmn_prep_data_set_to_var("var_degres", 1, 30);
    cmn_prep_data_set_to_var("var_ctco", 1, 19);
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
    <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #f8f9fa;
        font-family: Arial, sans-serif;
        color: #dc3545;
        padding: 20px;
        text-align: center;
    ">
        <div>
            <h2>Error Loading Application</h2>
            <p>${errorMessage}</p>
            <p style="color: #666; margin-top: 20px;">Error details: ${error.message}</p>
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
  navBar.className = 'navbar navbar-expand-lg navbar-light bg-light';
  navBar.style.cssText = `
            position: fixed;
            padding-top: 22px;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

  navBar.innerHTML = `
    <div class="container-fluid">
        <!-- Left: Hamburger Menu -->
        <button class="btn btn-link text-white" type="button" onclick="(async () => { await loadExe2Fn(13, [], [1]); })()">
            <span class="navbar-toggler-icon" style="filter: brightness(0) invert(1);"></span>
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
                <i class="fas fa-filter fa-lg"></i>
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
  mainContent.style.cssText = `
        margin-top: 66px;
        padding: 1%;
        min-height: calc(100vh - 66px);
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    `;

  try {
   if (profilesData.length === 0) {
    mainContent.innerHTML = `
    <div class="container text-center">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-lg border-0" style="border-radius: 20px;">
                    <div class="card-body p-5">
                        <div class="mb-4">
                            <i class="fas fa-user-friends text-secondary" style="font-size: 4rem;"></i>
                        </div>
                        <h2 class="card-title mb-3" style="color: var(--primary-color);">
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
    <div class="container" style="margin-top: 22px;">
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
  const address = profile.b4 || null;
  //   const religion = profile.k ? getReligionName(profile.k.toString()) : null;

  // Check for QA badge
  const showQaBadge = false;//window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].shoBadge === "qa" && profile.qa;
  const qaValue = profile.qa || '';

  // Create comma-separated details string
  const detailsArray = [];
  if (age !== 'Not specified') detailsArray.push(`${age} yrs`);
  //   if (religion) detailsArray.push(religion);
  if (height) detailsArray.push(height);
  if (packageAmount) detailsArray.push(packageAmount);
  if (address && address !== 'Not specified') detailsArray.push(address);

  const detailsString = detailsArray.length > 0
   ? detailsArray.join(', ')
   : 'Details not available';

  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';

  col.innerHTML = `
    <div class="card profile-card">
        <!-- Thumbnail Image -->
        <div class="profile-image-container" style="cursor: pointer;">
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
                <p class="mb-0" style="line-height: 1.4;">
                    ${detailsString}
                </p>
            </div>
            
<!-- CENTER ALIGNED TITLE WITH PRIMARY COLOR - Name and button on same line -->
<div class="card-title text-center" style="color: var(--primary-color); display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: nowrap;">
    <span style="white-space: nowrap;">${firstName}</span>
    <button class="btn btn-contact" style="width: auto; min-width: 40px; padding: 4px 8px; margin-top: 0;"
            onclick="showProfileDtls(${profileId})">
        <i class="fas fa-phone-alt"></i>
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
  loader.style.cssText = `
        width: 100%;
        text-align: center;
        padding: 20px;
        margin: 10px 0;
    `;

  loader.innerHTML = `
        <div class="spinner-border text-primary" role="status" style="color: var(--primary-color) !important;">
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
  footer.className = 'bg-dark text-white text-center py-3';
  footer.style.cssText = `
            position: relative;
            width: 100%;
            margin-top: auto;
        `;

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
    <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #f8f9fa;
        font-family: Arial, sans-serif;
        color: #dc3545;
        padding: 20px;
        text-align: center;
    ">
        <div>
            <h2>Application Error</h2>
            <p>Failed to initialize the application. Please try again.</p>
            <p style="color: #666; margin-top: 20px;">Error: ${error.message}</p>
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
  const style = document.createElement('style');
  style.textContent = `:root {--primary-color: #6f184d;--primary-light: #8a1f61;--primary-dark: #4d1035;--secondary-color: #00BFA5;--secondary-light: #26A69A;--secondary-dark: #00897B;--accent-color: #FFB300;--accent-light: #FFCA28;--accent-dark: #FF8F00;--success-color: #4CAF50;--info-color: #2196F3;--warning-color: #FF9800;--danger-color: #F44336;--light-color: #F5F5F5;--dark-color: #212121;--white-color: #FFFFFF;--black-color: #000000;--background-color: #FAFAFA;--card-bg-color: var(--white-color);--nav-bg-color: var(--primary-color);--footer-bg-color: var(--dark-color);--text-primary: #212121;--text-secondary: #757575;--text-light: #FAFAFA;--text-dark: #424242;--text-on-primary: var(--white-color);--border-color: #E0E0E0;--shadow-color: rgba(111, 24, 77, 0.1);--shadow-color-dark: rgba(111, 24, 77, 0.15);}body {background: linear-gradient(135deg, #FAFAFA 0%, #F5EDF3 100%) !important;}.card:hover {box-shadow: 0 8px 25px rgba(111, 24, 77, 0.2) !important;transform: translateY(-4px) !important;}.profile-card .profile-image-container {position: relative !important;height: 70% !important;overflow: hidden !important;}.profile-card .profile-id {position: absolute !important;top: 10px !important;right: 10px !important;z-index: 10 !important;font-size: 0.75rem !important;font-weight: 600 !important;text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;color: black !important;background: linear-gradient(135deg, var(--accent-color), var(--accent-dark)) !important;box-shadow: 0 2px 8px rgba(111, 24, 77, 0.3) !important;border-radius: 50px !important;padding: 4px 12px !important;min-width: 60px !important;text-align: center !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;}.profile-card .qa-badge {border: 1px solid black;position: absolute !important;top: 10px !important;left: 10px !important;z-index: 10 !important;font-size: 0.75rem !important;font-weight: 600 !important;text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;color: white !important;background: linear-gradient(135deg, var(--secondary-color), var(--secondary-dark)) !important;box-shadow: 0 2px 8px rgba(255, 179, 0, 0.3) !important;border-radius: 50px !important;padding: 4px 12px !important;min-width: 60px !important;text-align: center !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;}button:not(.btn-link):not(.btn-close):not(.navbar-toggler):not([class*="navbar"]):not([class*="nav-"]):not(.nav-link) {background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;border: none !important;color: var(--text-on-primary) !important;border-radius: 50px !important;padding: 10px 20px !important;font-weight: 600 !important;transition: all 0.3s ease !important;box-shadow: 0 4px 12px rgba(111, 24, 77, 0.25) !important;}button:not(.btn-link):not(.btn-close):not(.navbar-toggler):not([class*="navbar"]):not([class*="nav-"]):not(.nav-link):hover {transform: translateY(-2px) !important;box-shadow: 0 6px 18px rgba(111, 24, 77, 0.35) !important;}button:not(.btn-link):not(.btn-close):not(.navbar-toggler):not([class*="navbar"]):not([class*="nav-"]):not(.nav-link):active {transform: translateY(1px) !important;}.navbar .btn {border-radius: 8px !important;padding: 8px 16px !important;font-weight: normal !important;box-shadow: none !important;background: var(--primary-dark) !important;}.navbar .btn:hover {transform: none !important;background: var(--primary-color) !important;}.profile-overlay {background: linear-gradient(to bottom, transparent 50%, rgba(111, 24, 77, 0.1) 70%, rgba(111, 24, 77, 0.3) 90%, rgba(111, 24, 77, 0.6) 100%) !important;}.navbar {background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;}.navbar-toggler {border: 2px solid rgba(255, 255, 255, 0.5) !important;border-radius: 8px !important;padding: 6px 10px !important;}.navbar-toggler:focus {box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5) !important;}.profile-thumbnail.loading {background: linear-gradient(90deg, #F5EDF3 25%, #E8D0E0 50%, #F5EDF3 75%) !important;background-size: 200% 100%;animation: loading 1.5s infinite;}::selection {background-color: rgba(111, 24, 77, 0.3);color: var(--text-primary);}::-webkit-scrollbar {width: 8px;}::-webkit-scrollbar-track {background: #F5EDF3;}::-webkit-scrollbar-thumb {background: var(--primary-light);border-radius: 4px;}::-webkit-scrollbar-thumb:hover {background: var(--primary-color);}@media (prefers-color-scheme: dark) {:root {--background-color: #1A1A1A;--card-bg-color: #2D2D2D;--text-primary: #FFFFFF;--text-secondary: #B0B0B0;--border-color: #444444;--shadow-color: rgba(111, 24, 77, 0.15);--light-color: #2D2D2D;}body {background: linear-gradient(135deg, #1A1A1A 0%, #291A24 100%) !important;}.navbar {background: linear-gradient(135deg, var(--primary-dark), #3A1029) !important;}.navbar .btn {background: rgba(255, 255, 255, 0.1) !important;}.navbar .btn:hover {background: rgba(255, 255, 255, 0.2) !important;}}.navbar-nav .btn,.navbar-nav button,.navbar button:not(.navbar-toggler) {all: unset !important;color: white !important;padding: 8px 16px !important;border-radius: 6px !important;margin: 0 4px !important;cursor: pointer !important;transition: background-color 0.3s ease !important;}.navbar-nav .btn:hover,.navbar-nav button:hover,.navbar button:not(.navbar-toggler):hover {background: rgba(255, 255, 255, 0.25) !important;transform: none !important;box-shadow: none !important;}.profile-card {height: ${window[my1uzr.worknOnPg].cardHeight || 60}vh !important;display: flex !important;flex-direction: column !important;border-radius: 11px !important;box-shadow: 0 20px 40px rgba(111, 24, 77, 0.35), 0 10px 25px rgba(111, 24, 77, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.8), 0 0 20px rgba(111, 24, 77, 0.2) !important;}.profile-card .card-body {flex: 1 !important;display: flex !important;flex-direction: column !important;}.profile-card .profile-thumbnail {height: 100% !important;width: 100% !important;object-fit: cover !important;object-position: top center !important;border-radius: 11px;}.profile-card .btn {margin-top: auto !important;}.profile-card .card-title {text-align: center !important;font-weight: 600 !important;margin-bottom: 10px !important;}.profile-card .profile-details {text-align: center !important;flex-grow: 1 !important;display: flex !important;align-items: center !important;justify-content: center !important;}.text-theme-primary {color: var(--primary-color) !important;}.btn-contact {background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;border: none !important;color: var(--text-on-primary) !important;border-radius: 50px !important;padding: 8px 12px !important;font-weight: 600 !important;transition: all 0.3s ease !important;box-shadow: 0 4px 8px rgba(111, 24, 77, 0.25) !important;font-size: 0.85rem !important;}.btn-contact:hover {transform: translateY(-2px) !important;box-shadow: 0 6px 12px rgba(111, 24, 77, 0.35) !important;}.btn-contact:active {transform: translateY(1px) !important;}.btn-message {background: linear-gradient(135deg, var(--secondary-color), var(--secondary-dark)) !important;border: none !important;color: var(--text-on-primary) !important;border-radius: 50px !important;padding: 8px 12px !important;font-weight: 600 !important;transition: all 0.3s ease !important;box-shadow: 0 4px 8px rgba(0, 191, 165, 0.25) !important;font-size: 0.85rem !important;}.btn-message:hover {transform: translateY(-2px) !important;box-shadow: 0 6px 12px rgba(0, 191, 165, 0.35) !important;}.btn-message:active {transform: translateY(1px) !important;}.profile-card .btn-contact,.profile-card .btn-message {height: 38px !important;display: flex !important;align-items: center !important;justify-content: center !important;}#infinite-scroll-loader .spinner-border {width: 3rem;height: 3rem;color: var(--primary-color) !important;}#infinite-scroll-loader p {color: var(--text-secondary);font-size: 0.9rem;}@keyframes blink {0% {opacity: 1;} 50% {opacity: 0.3;} 100% {opacity: 1;}}`;
  document.head.appendChild(style);
 }
 async function checkUrlForIdParam() {
 }
 // Start the app when DOM is ready
 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
   addMobileStyles();
   await initializeApp();
   checkUrlForIdParam();
  });
 } else {
  // DOM already loaded
  addMobileStyles();
  initializeApp();
  checkUrlForIdParam();
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
 const t351mp = await chkIfLoggedIn();
 //  if (t351mp.su == 1)
 //   (async () => { await loadExe2Fn(36, [profileId], [1]); })();
 //  else
 //   (async () => { await loadExe2Fn(5, [], [1]); })();

 if (t351mp.su == 1) {

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
    profileData = { "d": 0, "e": 0, "g": "", "j": 0, "q": "", "qa": "", "qb": "", "qc": "", "x": "", "z": "", "a2": "", "b4": "", "c6": "", "a9": "", "a5": 0, "a7": 0, "b6": [], "u": "", "k": 0, "k1": 0, "k2": 0, "a3": 97, "b5": 97, "c5": 97 };
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
  required_data[0] = "mra_";//prefix
  required_data[1] = 1;//display modal;
  required_data[2] = fieldNameMap;//field labels;
  required_data[3] = profileData;//json-data
  required_data[4] = [{ "a": "d", "b": "setValByProprtyToElm", "c": "entryStatus", "canAdd": addingAllowed }, { "a": "e", "b": "set_mra_e", "canEdit": edtingAllowed, "params": [mono_fl_csh_no, [mono_loader_id, mono_show_modal, mono_dv_el_id, mono_callBackFn, mono_input_el_id], [1]] }, { "a": "g", "b": "set_dtt", "c": "yyyy-mm-dd HH:MM:SS", "d": window[my1uzr.worknOnPg].bdayFormat }, { "a": "j", "b": "setValByProprtyToElm", "c": "marital_status", "canAdd": addingAllowed }, { "a": "k", "b": "setValByProprtyToElm", "c": "var_caste_rlgns", "canAdd": addingAllowed }, { "a": "k1", "b": "setValByProprtyToElm", "c": "var_caste_rlgns,castes", "e": profileData.k, "g": "fn_setValToGvnInputs('" + required_data[0] + "','k')", "canAdd": addingAllowed }, { "a": "k2", "b": "setValByProprtyToElm", "c": "var_sub_caste_type", "canAdd": addingAllowed }, { "a": "a3", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": addingAllowed }, { "a": "a2", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.a3, "g": "fn_setValToGvnInputs('" + required_data[0] + "','a3')", "canAdd": addingAllowed }, { "a": "b5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": addingAllowed }, { "a": "b4", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.b5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','b5')", "canAdd": addingAllowed }, { "a": "c5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": addingAllowed }, { "a": "c6", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.c5, "g": "fn_setValToGvnInputs('" + required_data[0] + "','c5')", "canAdd": addingAllowed }, { "a": "q", "b": "setValByProprtyToElm", "c": "mr_job_types", "canAdd": addingAllowed }, { "a": "qa", "b": "setValByProprtyToElm", "c": "mr_desig_posis", "canAdd": addingAllowed }, { "a": "qb", "b": "setValByProprtyToElm", "c": "mr_bsns_forms", "canAdd": addingAllowed }, { "a": "qc", "b": "setValByProprtyToElm", "c": "mr_bsns_typs", "canAdd": addingAllowed }, { "a": "s", "b": "setValByProprtyToElm", "c": "var_degres", "canAdd": addMultAllowd }, { "a": "a9", "b": "setValByProprtyToElm", "c": "var_lngs", "canAdd": addMultAllowd }, {
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
  required_data[8] = window[my1uzr.worknOnPg].colsToHide;
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
  await loadExe2Fn(38, required_data, [1]);
 }
 else {
  (async () => { await loadExe2Fn(5, [], [1]); })();
 }
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
 header.className = 'modal-header';
 header.style.cssText = 'background: linear-gradient(135deg, #dc3545, #b02a37); color: white; border-bottom: none;';
 header.innerHTML = `<h5 class="modal-title" style="color: white;"><i class="fas fa-exclamation-triangle me-2"></i>Confirm Unlock</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>`;

 const body = document.createElement('div');
 body.className = 'modal-body text-center';
 body.style.cssText = 'padding: 2rem;';
 body.innerHTML = `
  <button type="button" class="btn btn-info" id="checkMyCountBtn" style="border-radius: 50px; padding: 8px 20px !important; margin-bottom: 33px !important; background: linear-gradient(135deg, #17a2b8, #138496) !important; color: white !important; border: none; box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);">
   <i class="fas fa-sync-alt me-2"></i>Check My New Count
  </button>
  <div style="font-size: 48px; margin-bottom: 15px;"><i class="fas fa-lock-open" style="color: #dc3545;"></i></div>
  <h4 style="margin-bottom: 15px;">Unlock Profile?</h4>
  <p style="color: #6c757d; margin-bottom: 5px;">
   You have purchased <strong style="font-size: 200%;">${profileUnlockCount}</strong> profile count<br>,
   You have unlocked <strong style="font-size: 175%;">${usedCount}</strong> profiles,<br>
   Your remaining unlock count is <strong style="font-size: 150%;">${remainingProflCnt > 0 ? remainingProflCnt : 0}</strong></p>
  <p style="color: #6c757d; font-size: 14px;">Are you sure you want to unlock this profile?</p>
  <div id="unlockWarningText" style="display: none; color: #dc3545; font-size: 14px; font-weight: 600; margin-top: 15px; animation: blink 1s infinite;">After unlocking, you can see only that information, which is filled by this party. Proceed with unlock?</div>
 `;

 const footer = document.createElement('div');
 footer.className = 'modal-footer d-flex justify-content-center gap-3 border-top-0';
 footer.style.cssText = 'border-top: none; padding-bottom: 1.5rem;';
 footer.innerHTML = `<button type="button" class="btn btn-secondary" id="cancelUnlockBtn" style="border-radius: 50px; padding: 8px 24px;"><i class="fas fa-times me-2"></i>Cancel</button><button type="button" class="btn btn-danger" id="confirmUnlockBtn" style="border-radius: 50px; padding: 8px 24px;"><i class="fas fa-check me-2"></i>Unlock</button>`;

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
