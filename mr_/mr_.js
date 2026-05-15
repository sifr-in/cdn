window["vlidFn62_63"] = {"g":{"cnv":"convertDateStrToGvn","cnvo":{"currentFormat":window[my1uzr.worknOnPg].bdayFormat},"ty":"dt","mi":"1950","ms":"enter correct birth date"},"l":{"cnv":"handleAsString","cnvo":{"prepn":"91."},"patn":"91\\.[6-9]\\d{9}","ms":"Contact no. to display, required"},"e":{"cnv":"handleAsString","patn":"^[1-9]\\d*$","ms":"Mobile of registering customer, is compulsory"},"j":{"cnv":"handleAsString","patn":"^[1-9]\\d*$","ms":"Marital status required"},"m": { "cnv": "handleAsString", "patn": "^[A-Za-z]{2,}$", "ms": "First name required" },"a5":{"cnv":"handleAsString","patn":"^[1-9]\\d*$","ms":"Please select whether you are 'Male' or 'Female'"}};

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
  { "a": 23, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@3988bc6/cmn/ei.min.js", "c":"open_entind_crud", "r":"open_entind_crud"},
  { "a": 24, "u": "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.css" },
  { "a": 25, "u": "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js" },
  { "a": 26, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6a12ce/cmn/caste.da" },
  { "a": 27, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b39a4af/cmn/ctco.da" },
  { "a": 30, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/sbli.js", "c":"set_mr_x_sibling_details", "r":"set_mr_x_sibling_details"},
  { "a": 31, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@bd7e9e0/cmn/lng.da" },
  { "a": 33, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@666354f/cmn/degs.da" },
  { "a": 35, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@0208362/cmn/occu.da" },
  { "a": 37, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/slkt.js", "c":"openCommonSelectionModal", "r":"openCommonSelectionModal"},
  { "a": 38, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/e.js" },
  { "a": 39, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/vldt.js", "c":"cmnVldet", "r":"cmnVldet"},
  { "a": 40, "u": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css" },
  { "a": 41, "u": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" }
 ];

let required_data = [];

const fieldNameMap = {"a":"Id","w":"unique ID","b":"Recorded","c":"fn no","d":"Status;","e":"Mobile of registering customer","f":"Constraint no.;","g":"Birth date & time;","h":"Height in feet . inch;","i":"Package in lakhs;","j":"Marital status","k":"Religious","k1":"caste;","k2":"sub caste / type;","l":"Contact no. to display","m":"First name in eng;","n":"Surname in eng;","o":"Father's name in eng;","p":"Mother's name in eng;","ma":"name lolng;","na":"surname lolng;","oa":"fa name lolng;","pa":"no name lolng;","q":"Job type","qa":"Designation / Position;","qb":"Business form;","qc":"Business type;","r":"Education 10th, 12th, 15th, 17th","s":"Degrees;","t":"Qualifications e.g. Sci, Com, Be, M.tech, ...","u":"DP Display Picture;","ut":"Thumbnail;","v":"relative surnames (comma separated) eng;","va":"Relative surnames (comma separated);","x":"Siblings;","z":"Blood group","a1":"Weight (kg);","a2":"City currently working in;","a3":"Country currently working in;","a4":"Diet","a5":"Gender Male female","a6":"Skin color","a7":"Above no. is of:","a8":"No. of own Home / shop","a9":"Languages known","b1":"No. of own Vehicle","b4":"Native city","b5":"Native country","b6":"Image Gallery","b9":"Drinking habit","c2":"Physically challenged","c3":"lives with family 1=yes, 2=no;","c5":"Current residential Country","c6":"Current residential City;","c7":"Free profile count;","c8":"Free chat count;","c9":"Plan Id;","d1":"Paid profile count","d2":"Paid chat count","h1":"Manglik status: 1=manglik, 2=non-manglik, 3=angshik (partial manglik)","h2":"horoscope available 1=yes, 2=no;","i1":"islamic sect 1=sunni,2=shia,127=other;","i2":"islamic mazhab, school of thought 1=Hanafi,2=Shafi,3=Maliki,4=Hanbali,127=other;","i3":"namaz practice 1,2,3,4,5,-1=occasional, -2=rarely;","i4":"quran learning 1=basic,2=intermediate,3=hafiz,4=alim,","i5":"quraan reciting: 1=daily, 2=occasionally, 3=rarely;","i6":"burkha 1=yes, 2=no","i7":"beard 1=yes, 2=no","i8":"believe in dargah 1=yes, 2=no, 3=strictly yes, 4=strictly no","x1":"Expectations (eng)","x2":"Expectations","x3":"partner's diet must be: 1=all, 2=veg, 3=non-veg, 4=occasion-non-veg, 5=eggetarain, 6=jain, 7=vegan;","x4":"girl job though: 1=yes interested, 2=will do job compulsory, 3=may be, 4=if required, 5=no-wont do job","x5":"girl currently doing job 1=yes, 2=no"};
window.var_sub_caste_type = [{"a":0,"e":"-"},{"a":1,"e":"Jamati"},{"a":2,"e":"Ahle hadees"},{"a":3,"e":"Devbandi"}];
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

function sendInfoToAddProfile(id_of_update_button, object_of_key_value_of_each_field, null1ByDefa, null2ByDefa, fullObject){
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
  if (t351mp.su != 1){
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


cmn_prep_data_set_to_var("mr_desig_posis",1,35);
cmn_prep_data_set_to_var("var_caste_rlgns",1,26);
cmn_prep_data_set_to_var("var_degres",1,33);
cmn_prep_data_set_to_var("var_ctco",1,27);
cmn_prep_data_set_to_var("var_lngs",1,31);



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
   let imageUrl = null;let originalUrl = null;
   try {
    if (typeof data === 'string' && data.trim().startsWith('{')) { const parsed = JSON.parse(data); if (parsed && typeof parsed === 'object') { imageUrl = parsed.b || parsed.a;originalUrl = parsed.a || parsed.b; } else { imageUrl = data;originalUrl = data; } }
    else if (typeof data === 'object') { imageUrl = data.b || data.a;originalUrl = data.a || data.b; }
    else { imageUrl = data;originalUrl = data; }
   } catch (e) { imageUrl = data;originalUrl = data; }
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
 $('.paginate_button.current').css({'background': 'linear-gradient(135deg, #7B1FA2, #4A148C)','color': 'white','border': 'none'});
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

required_data[4] = [{ "a": "d", "b": "setValByProprtyToElm", "c": "entryStatus", "canAdd": 1 }, { "a": "e", "b": "set_mra_e", "canEdit": 1, "params": [mono_fl_csh_no, [mono_loader_id, mono_show_modal, mono_dv_el_id, mono_callBackFn, mono_input_el_id], [1]] }, { "a": "g", "b": "set_dtt", "c": "yyyy-mm-dd HH:MM:SS", "d": window[my1uzr.worknOnPg].bdayFormat }, { "a": "j", "b": "setValByProprtyToElm", "c": "marital_status" , "canAdd": 1}, { "a": "k", "b": "setValByProprtyToElm", "c": "var_caste_rlgns", "canAdd": 1 }, { "a": "k1", "b": "setValByProprtyToElm", "c": "var_caste_rlgns,castes", "e": profileData.k, "g": "fn_setValToGvnInputs('" + required_data[0] + "','k')", "canAdd": 1 }, { "a": "k2", "b": "setValByProprtyToElm", "c": "var_sub_caste_type" , "canAdd": 1}, { "a": "a3", "b": "setValByProprtyToElm", "c": "var_ctco" , "canAdd": 1}, { "a": "a2", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.a3, "g":"fn_setValToGvnInputs('"+required_data[0]+"','a3')", "canAdd": 1 }, { "a": "b5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "b4", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.b5, "g":"fn_setValToGvnInputs('"+required_data[0]+"','b5')", "canAdd": 1 }, { "a": "c5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "c6", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.c5, "g":"fn_setValToGvnInputs('"+required_data[0]+"','c5')", "canAdd": 1 }, { "a": "q", "b": "setValByProprtyToElm", "c": "mr_job_types", "canAdd": 1 }, { "a": "qa", "b": "setValByProprtyToElm", "c": "mr_desig_posis", "canAdd": 1 }, { "a": "qb", "b": "setValByProprtyToElm", "c": "mr_bsns_forms", "canAdd": 1 }, { "a": "qc", "b": "setValByProprtyToElm", "c": "mr_bsns_typs", "canAdd": 1 }, { "a": "s", "b": "setValByProprtyToElm", "c": "var_degres", "canAdd": 2 }, { "a": "a9", "b": "setValByProprtyToElm", "c": "var_lngs", "canAdd": 2 }, {
    "a": "b6", "b": "setGalleryImages", "canAdd": 1, "driveMl": window[my1uzr.worknOnPg].driveMl,
    "thumbnailSize": 600,  // Add thumbnail size
    "resizeBy": 0
}, { "a": "x", "b": "setSiblingTags", "canAdd": 1, "params": [sibling_fl_csh_no, [sibling_loader_id, sibling_dv_el_id, sibling_show_modal, sibling_callBackFn, sibling_input_el_id], [1]]}, { "a": "z", "b": "setValByProprtyToElm", "c": "bloodGroups", "canAdd": 1 }, { "a": "a5", "b": "setValByProprtyToElm", "c": "var_genders", "canAdd": 1 }, { "a": "a7", "b": "setValByProprtyToElm", "c": "relation_with_regr", "d": "string1", "e": -1, "canAdd": 1 }, {
    "a": "u",
    "b": "prepImgByURL", "driveMl": window[my1uzr.worknOnPg].driveMl,
    "canEdit": true,
    "thumbnailSize": 600,  // Add thumbnail size
    "resizeBy": 0         // 0 = resize by width, 1 = resize by height
    //"folderName": "my1_mr" // optional folder name
}];;
required_data[5] = [];
const fun2DeleteAsClient=67;
required_data[6] = [{"a":"Share profile","e":"shareProfl"}];
if(profileData.d>-1){
 required_data[6].push({"a":"Delete profile","e":"confirmLeaveProfile","runFnOnOk": "useLeaveCount","runFnOnCancel": "showCancelToastAndCloseModal","fnNo2Del":fun2DeleteAsClient});
}
required_data[7] = window[my1uzr.worknOnPg].seqnce;//sequence
required_data[8] = window[my1uzr.worknOnPg].colsToHide;
const functionNumber = 63;const update1New0 = 1;
required_data[9] = [{"a":"Update profile","e":"saveProfileChanges","f":"a,"+window[my1uzr.worknOnPg].colsToSubmit,"g":functionNumber,"h":update1New0}];

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

async function addNewProfile(){
window[my1uzr.worknOnPg].defaFieldVals

profileData = {"d":0,"e":0,"g":"","j":0,"q":"","qa":"","qb":"","qc":"","s":"","x":"","z":"","a2":"","b4":"","c6":"","a9":"","a5":0,"a7":0,"b6":[],"u":"","k":13,"k1":9,"k2":0,"a3":97,"b5":97,"c5":97};
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
required_data[4] = [{ "a": "d", "b": "setValByProprtyToElm", "c": "entryStatus", "canAdd": 1 }, { "a": "e", "b": "set_mra_e", "canEdit": 1, "params": [mono_fl_csh_no, [mono_loader_id, mono_show_modal, mono_dv_el_id, mono_callBackFn, mono_input_el_id], [1]] }, { "a": "g", "b": "set_dtt", "c": "yyyy-mm-dd HH:MM:SS", "d": window[my1uzr.worknOnPg].bdayFormat }, { "a": "j", "b": "setValByProprtyToElm", "c": "marital_status" , "canAdd": 1}, { "a": "k", "b": "setValByProprtyToElm", "c": "var_caste_rlgns", "canAdd": 1 }, { "a": "k1", "b": "setValByProprtyToElm", "c": "var_caste_rlgns,castes", "e": profileData.k, "g": "fn_setValToGvnInputs('" + required_data[0] + "','k')", "canAdd": 1 }, { "a": "k2", "b": "setValByProprtyToElm", "c": "var_sub_caste_type" , "canAdd": 1}, { "a": "a3", "b": "setValByProprtyToElm", "c": "var_ctco" , "canAdd": 1}, { "a": "a2", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.a3, "g":"fn_setValToGvnInputs('"+required_data[0]+"','a3')", "canAdd": 1 }, { "a": "b5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "b4", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.b5, "g":"fn_setValToGvnInputs('"+required_data[0]+"','b5')", "canAdd": 1 }, { "a": "c5", "b": "setValByProprtyToElm", "c": "var_ctco", "canAdd": 1 }, { "a": "c6", "b": "setValByProprtyToElm", "c": "var_ctco,cities", "e": profileData.c5, "g":"fn_setValToGvnInputs('"+required_data[0]+"','c5')", "canAdd": 1 }, { "a": "q", "b": "setValByProprtyToElm", "c": "mr_job_types", "canAdd": 1 }, { "a": "qa", "b": "setValByProprtyToElm", "c": "mr_desig_posis", "canAdd": 1 }, { "a": "qb", "b": "setValByProprtyToElm", "c": "mr_bsns_forms", "canAdd": 1 }, { "a": "qc", "b": "setValByProprtyToElm", "c": "mr_bsns_typs", "canAdd": 1 }, { "a": "s", "b": "setValByProprtyToElm", "c": "var_degres", "canAdd": 2 }, { "a": "a9", "b": "setValByProprtyToElm", "c": "var_lngs", "canAdd": 2 }, {
    "a": "b6", "b": "setGalleryImages", "canAdd": 1, "driveMl": window[my1uzr.worknOnPg].driveMl,
    "thumbnailSize": 600,  // Add thumbnail size
    "resizeBy": 0
}, { "a": "x", "b": "setSiblingTags", "canAdd": 1, "params": [sibling_fl_csh_no, [sibling_loader_id, sibling_dv_el_id, sibling_show_modal, sibling_callBackFn, sibling_input_el_id], [1]]}, { "a": "z", "b": "setValByProprtyToElm", "c": "bloodGroups", "canAdd": 1 }, { "a": "a5", "b": "setValByProprtyToElm", "c": "var_genders", "canAdd": 1 }, { "a": "a7", "b": "setValByProprtyToElm", "c": "relation_with_regr", "d": "string1", "e": -1, "canAdd": 1 }, {
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
required_data[8] = "a,"+window[my1uzr.worknOnPg].colsToHide;
const functionNumber = 62;const update1New0 = 0;
required_data[9] = [{"a":"Add new","e":"saveProfileChanges","f":window[my1uzr.worknOnPg].colsToSubmit,"g":functionNumber,"h":update1New0}];

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
  }, {rootMargin: '50px'});
  lazyImages.forEach(img => imageObserver.observe(img));
 } else {
  // Fallback for browsers without IntersectionObserver
  lazyImages.forEach(img => { img.src = img.dataset.src; img.classList.remove('lazy-load-img'); img.removeAttribute('data-src'); });
 }
}