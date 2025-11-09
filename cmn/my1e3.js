const monthFullNms = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthShortNms = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let modalStack = [];
let modalZIndexCounter = 1050;

// Add these with your other global variables at the top
let wakeLock = null;
let isWakeLockSupported = 'wakeLock' in navigator;

// Back button press counter
let backButtonPressCount = 0;
let backButtonTimeout = null;

// Screen Wake Lock functions - Common utility for all scripts
async function requestWakeLock() {
 if (!isWakeLockSupported) {
  console.log('Screen Wake Lock API not supported');
  return;
 }

 try {
  wakeLock = await navigator.wakeLock.request('screen');
  console.log('Screen Wake Lock acquired');

  wakeLock.addEventListener('release', () => {
   console.log('Screen Wake Lock released');
  });
 } catch (err) {
  console.error(`Error acquiring Wake Lock: ${err.message}`);
 }
}

async function releaseWakeLock() {
 if (wakeLock) {
  try {
   await wakeLock.release();
   wakeLock = null;
   console.log('Screen Wake Lock released');
  } catch (err) {
   console.error(`Error releasing Wake Lock: ${err.message}`);
  }
 }
}

// Handle visibility change to reacquire wake lock when page becomes visible again
function setupWakeLockVisibilityHandler() {
 if (!isWakeLockSupported) return;

 document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'hidden') {
   // Don't release immediately, wait a bit in case user comes back
   setTimeout(() => {
    if (document.visibilityState === 'hidden' && typeof releaseWakeLock === 'function') {
     console.log('Releasing wake lock after 30 seconds in background');
     releaseWakeLock();
    }
   }, 30000); // Release after 30 seconds of being hidden
  } else if (document.visibilityState === 'visible') {
   await requestWakeLock();
   console.log('Page visible - wake lock can be reacquired if needed');
  }
 });
}

function attachModalListeners() {
 // Listen for Bootstrap modal show events
 document.addEventListener('show.bs.modal', function (event) {
  const modal = event.target;
  const modalId = modal.id;

  if (!modalStack.includes(modalId)) {
   // Set increasing z-index for proper stacking
   modal.style.zIndex = modalZIndexCounter++;
   modalStack.push(modalId);

   // Push state to history when modal opens
   history.pushState({
    modalOpen: true,
    modalId: modalId,
    modalStack: [...modalStack]
   }, '');
  }
 });

 // Listen for Bootstrap modal hide events
 document.addEventListener('hide.bs.modal', function (event) {
  const modalId = event.target.id;
  removeModalFromStack(modalId);
 });
}

function removeModalFromStack(modalId) {
 const index = modalStack.indexOf(modalId);
 if (index !== -1) {
  modalStack.splice(index, 1);

  // Update history state when modal closes
  history.replaceState({
   modalOpen: modalStack.length > 0,
   modalStack: [...modalStack]
  }, '');
 }
}

function getNumArrayFromObjArr(jsonArray, key) {
 return jsonArray
  .map(obj => {
   const val = obj[key];
   // Convert to number if it's a string representation
   const num = typeof val === 'string' ? parseFloat(val) : Number(val);
   return isNaN(num) ? null : num; // handle non-numeric values
  })
  .filter(num => num !== null); // remove null values
}

function createDynamicLoader(message = 'Loading...', countdown = null) {
 //const loader = createDynamicLoader();const loader = createDynamicLoader('wait ...');const loader = createDynamicLoader('wait ...', 5);
 //loader.removeLoader();
 //loader.updateCountdown(10); // Changes countdown to 10 seconds
 const loader = document.createElement('div');
 loader.style.position = 'fixed';
 loader.style.top = '0';
 loader.style.left = '0';
 loader.style.width = '100%';
 loader.style.height = '100%';
 loader.style.backgroundColor = 'rgba(0,0,0,0.5)';
 loader.style.display = 'flex';
 loader.style.justifyContent = 'center';
 loader.style.alignItems = 'center';
 loader.style.zIndex = '9999';
 loader.style.flexDirection = 'column';

 // Create spinner container
 const spinnerContainer = document.createElement('div');
 spinnerContainer.style.position = 'relative';
 spinnerContainer.style.display = 'flex';
 spinnerContainer.style.justifyContent = 'center';
 spinnerContainer.style.alignItems = 'center';
 spinnerContainer.style.width = '4rem';
 spinnerContainer.style.height = '4rem';

 // Create spinner
 const spinner = document.createElement('div');
 spinner.style.width = '100%';
 spinner.style.height = '100%';
 spinner.style.border = '4px solid #f3f3f3';
 spinner.style.borderTop = '4px solid #007bff';
 spinner.style.borderRadius = '50%';
 spinner.style.animation = 'spin 1s linear infinite';

 // Add CSS for spinner animation
 if (!document.querySelector('#loader-spin-style')) {
  const style = document.createElement('style');
  style.id = 'loader-spin-style';
  style.textContent = `
     @keyframes spin {
       0% { transform: rotate(0deg); }
       100% { transform: rotate(360deg); }
     }
   `;
  document.head.appendChild(style);
 }

 spinnerContainer.appendChild(spinner);

 // Create countdown element if countdown is provided
 let countdownElement = null;
 let countdownInterval = null;

 if (countdown !== null) {
  countdownElement = document.createElement('div');
  countdownElement.style.position = 'absolute';
  countdownElement.style.fontSize = '1.2rem';
  countdownElement.style.fontWeight = 'bold';
  countdownElement.style.color = '#007bff';
  countdownElement.textContent = countdown;
  spinnerContainer.appendChild(countdownElement);

  // Start countdown if it's a number
  if (typeof countdown === 'number' && countdown > 0) {
   let timeLeft = countdown;
   countdownInterval = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;

    if (timeLeft <= 0) {
     clearInterval(countdownInterval);
    }
   }, 1000);
  }
 }

 // Create message element
 const messageElement = document.createElement('div');
 messageElement.style.marginTop = '1rem';
 messageElement.style.color = 'white';
 messageElement.style.fontSize = '1.1rem';
 messageElement.textContent = message;

 // Create loader content container
 const loaderContent = document.createElement('div');
 loaderContent.style.display = 'flex';
 loaderContent.style.flexDirection = 'column';
 loaderContent.style.alignItems = 'center';
 loaderContent.appendChild(spinnerContainer);
 loaderContent.appendChild(messageElement);

 loader.appendChild(loaderContent);

 // Add method to remove loader and clean up interval
 loader.removeLoader = function () {
  if (countdownInterval) {
   clearInterval(countdownInterval);
  }
  if (document.body.contains(this)) {
   document.body.removeChild(this);
  }
 };

 // Add method to update countdown
 loader.updateCountdown = function (newCountdown) {
  if (countdownElement && typeof newCountdown === 'number') {
   clearInterval(countdownInterval);
   let timeLeft = newCountdown;
   countdownElement.textContent = timeLeft;

   countdownInterval = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;

    if (timeLeft <= 0) {
     clearInterval(countdownInterval);
    }
   }, 1000);
  }
 };

 document.body.appendChild(loader);
 return loader;
}

function loadPromiseScript(url) {
 return new Promise((resolve, reject) => {
  // Optional: Check for duplicates (from my version)
  const existingScript = document.querySelector(`script[src="${url}"]`);
  if (existingScript) {
   resolve();
   return;
  }

  // Your clean implementation
  const script = document.createElement("script");
  script.onload = resolve;
  script.onerror = reject;
  script.src = url;
  document.head.appendChild(script);
 });
}

async function loadAllScriptsSequentially(scriptsToLoad) {
 let loadedCount = 0;
 const totalScripts = scriptsToLoad.reduce((count, scriptInfo) => {
  return count + (scriptInfo.fls ? scriptInfo.fls.length : 1);
 }, 0);

 for (const scriptInfo of scriptsToLoad) {
  try {
   if (scriptInfo.fls) {
    for (const fileInfo of scriptInfo.fls) {
     const scriptUrl = scriptInfo.url
      .replace('__', fileInfo.h)
      .replace('__', fileInfo.f);

     await loadPromiseScript(scriptUrl);
     loadedCount++;
     console.log(`Loaded: ${scriptUrl} (${loadedCount}/${totalScripts})`);
    }
   } else {
    await loadPromiseScript(scriptInfo.url);
    loadedCount++;
    console.log(`Loaded: ${scriptInfo.url} (${loadedCount}/${totalScripts})`);
   }
  } catch (error) {
   console.error('Failed to load script:', error);
   return {
    success: false,
    error: error,
    loadedCount: loadedCount,
    totalScripts: totalScripts
   };
  }
 }

 return {
  success: true,
  loadedCount: loadedCount,
  totalScripts: totalScripts,
  message: `All ${loadedCount} scripts loaded successfully`
 };
}

async function loadAndExeFn(functionName, params = [], idOfLoader, scriptUrl) {
 const loader = document.getElementById(idOfLoader);
 if (loader) loader.style.display = 'block'; // Show loader

 try {
  // Check if function exists
  if (typeof window[functionName] === 'function') {
   window[functionName](...params); // Spread params correctly
  } else {
   await loadPromiseScript(scriptUrl); // Assume this loads the script
   if (typeof window[functionName] === 'function') {
    window[functionName](...params); // Spread params
   } else {
    throw new Error(`Function "${functionName}" not found after loading script.`);
   }
  }
 } catch (e) {
  console.error('Error:', e.message);
  alert(`Error: ${e.message}. Please retry or contact support.`);
 } finally {
  if (loader) loader.style.display = 'none'; // Hide loader
 }
}

async function loadExecFn(fnsToChk, fnsToRun, pFNarams = [], idOfLoader, scriptUrl, pSCRParams = []) {
 const loader = document.getElementById(idOfLoader);
 if (loader) loader.style.display = 'block'; // Show loader

 try {
  // Split comma-separated function names and trim whitespace
  const functionsToCheck = fnsToChk.split(',').map(fn => fn.trim());
  const missingFunctions = [];

  // Check if all functions exist
  for (const fnName of functionsToCheck) {
   if (typeof window[fnName] !== 'function') {
    missingFunctions.push(fnName);
   }
  }

  if (missingFunctions.length === 0) {
   // All functions exist, execute fnsToRun if provided
   if (fnsToRun && fnsToRun.trim() !== '') {
    const functionsToRun = fnsToRun.split(',').map(fn => fn.trim());

    // Execute functions sequentially and wait for each to complete
    for (const fnName of functionsToRun) {
     if (typeof window[fnName] === 'function') {
      const result = window[fnName](...pFNarams);
      // If function returns a Promise, wait for it
      if (result instanceof Promise) {
       await result;
      }
     } else {
      console.warn(`Function "${fnName}" not found for execution.`);
     }
    }
   }
  } else {
   // Some functions are missing, load the script
   await loadPromiseScript(scriptUrl);

   // Check again after loading the script
   const stillMissing = [];
   for (const fnName of functionsToCheck) {
    if (typeof window[fnName] !== 'function') {
     stillMissing.push(fnName);
    }
   }

   if (stillMissing.length === 0) {
    // All functions now exist, execute fnsToRun if provided
    if (fnsToRun && fnsToRun.trim() !== '') {
     const functionsToRun = fnsToRun.split(',').map(fn => fn.trim());

     // Execute functions sequentially and wait for each to complete
     for (const fnName of functionsToRun) {
      if (typeof window[fnName] === 'function') {
       const result = window[fnName](...pFNarams);
       // If function returns a Promise, wait for it
       if (result instanceof Promise) {
        await result;
       }
      } else {
       console.warn(`Function "${fnName}" not found for execution.`);
      }
     }
    }
   } else {
    throw new Error(`Functions "${stillMissing.join(', ')}" not found after loading script.`);
   }
  }
 } catch (e) {
  console.error('loadExecFn params:', { fnsToChk, fnsToRun, pFNarams, idOfLoader, scriptUrl, pSCRParams });
  console.error('Error:', e.message);
  alert(`Error: ${e.message}. Please retry or contact support.`);
 } finally {
  if (loader) loader.style.display = 'none'; // Hide loader
 }
}

function loadScript(url, callback) {
 var script = document.createElement("script")
 script.type = "text/javascript";
 if (script.readyState) {  // only required for IE <9
  script.onreadystatechange = function () {
   if (script.readyState === "loaded" || script.readyState === "complete") {
    script.onreadystatechange = null;
    callback();
   }
  };
 } else {  //Others
  script.onload = function () {
   if (callback)
    callback();
  };
 }

 script.src = url;
 document.getElementsByTagName("head")[0].appendChild(script);
}

function setStatusOfThisPageAsLoggedIn() {
 localStorage.setItem(my1uzr.worknOnPg, 1);
 let tmpElm = document.getElementById('dyna_dv_1');
 if (typeof tmpElm !== 'undefined')
  tmpElm.style.display = "none";
}

function close_dyna_dv_1() {
 let tmpElm = document.getElementById('dyna_dv_1');
 if (typeof tmpElm !== 'undefined')
  tmpElm.style.display = "none";
}

function postCall_Json(rURL, jsonData, tkrq, syncOrNo) {
 var retTxt = "";
 if (tkrq == 1) {
  if (my1uzr != null && localStorage.getItem(my1uzr.worknOnPg) == 1) {
   if (my1uzr.mk.length < 1)
    showLogIn();
   else {
    const longNumber = parseInt(my1uzr.mk.slice(-10), 10);
    checkExpiry(longNumber);
   }
  } else {
   let tmpElm = document.getElementById('dyna_dv_1');
   tmpElm.classList.add("modal");
   tmpElm.innerHTML = '<div class="modal-content"><h2 style="text-align:center;">This page requires login for selected entind.<br>Do u want to login on this page?<br>Click yes to continue;</h2><br><br><br><button onClick="setStatusOfThisPageAsLoggedIn()" style="background-color:green;">yes</button><br><br><button onClick="close_dyna_dv_1()" style="background-color:red;">reject</button></div>';
   tmpElm.style.display = "block";
  }
 }
 var xhr = new XMLHttpRequest();
 xhr.open("POST", rURL, syncOrNo);
 xhr.setRequestHeader("Content-Type", "application/json");

 xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
   retTxt = xhr.responseText;
   if (typeof loader !== 'undefined')
    loader.style.display = 'none';
  } else if (xhr.status == 500) {
   alert("err calling API. status: 500");
  }
 };
 if (typeof loader !== 'undefined')
  loader.style.display = 'flex';
 xhr.send(JSON.stringify(jsonData));
 return retTxt;
}

function checkExpiry() {
 if (my1uzr != null && my1uzr.mk != null) {
  var longNumber = parseInt(my1uzr.mk.slice(-10), 10) * 1000;
  longNumber = longNumber + 302400 * 1000;//302400 seconds = 5 days
  var date = new Date(longNumber);
  const now = new Date();
  var temp = now.getTime();
 }
}

function getMaxDtt(arr, key) {
 var dtt34 = "1970-01-01 00:00:00"; // Use a valid date here
 if (arr != null && arr.length > 0) {
  let maxDate = arr.reduce((max, item) =>
   new Date(item[key]) > new Date(max) ? item[key] : max, arr[0][key]);

  // Ensure both dates are valid and compare
  if (new Date(maxDate) > new Date(dtt34)) dtt34 = maxDate;
 }
 return dtt34;
}

function setMaxDtOfGivenTbls(path, str) {
 const myArr94 = str.split(",");//e.g. "tdo_jarray~t,msg_jarray~m,group_jarray~g"
 for (const itm95 of myArr94) {
  const ar96 = itm95.split("~");
  const tblNm = path + "_" + ar96[0];
  payload0["la_" + ar96[1]] = getMaxDtt(window[tblNm], ar96[2]);
 }
}

function addInitialsColumn(item, sourceCol, colToAdd) {
 if (item[sourceCol] != null) {
  item[colToAdd] = item[sourceCol].split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
  if (item[colToAdd].length < 3)
   item[colToAdd] = item[sourceCol].substring(0, 3);
 }
 return item;
}

//https://stackoverflow.com/a/19539548/2173890
let longPressDelay = 1500; // Duration in milliseconds of how long you have to hold click.
let isLongPressActive = false;
let longPressTimer;

function fn_start_LongClk(e, strFnNm) {
 isLongPressActive = true;
 longPressTimer = setTimeout(makeChange(strFnNm), longPressDelay);
 // In case you want to prevent Default functionality on mouse down.
 if (e.preventDefault) {
  e.preventDefault();
 } else {
  e.returnValue = false;
 }
}

function makeChange(strFnNm) {
 if (longPressTimer) {
  clearTimeout(longPressTimer);
 }
 if (isLongPressActive) {
  window[strFnNm]();
  console.log("long click detected");
 }
}

function fn_revert_LongClk() {
 isLongPressActive = false;
}

function fn_dblClk_LongClk() {
 console.log("doubleclick detected");
}

function joinData(item, srcCol2match, arrayName1945, destiCol2match, lstOfcolsToAppend) {
 var tmpArray = window[arrayName1945];
 const tmpItem1950 = tmpArray.find(tmp => tmp[destiCol2match] == item[srcCol2match]);
 const tmpAr1951 = lstOfcolsToAppend.split(",");
 for (i = 0; i < tmpAr1951.length; i++) {
  const tmpAr1953 = tmpAr1951[i].split("~");
  if (tmpItem1950 != null)
   Object.keys(tmpItem1950).forEach(function (key, index) {
    if (tmpAr1953[0] == key) {
     item[tmpAr1953[1]] = tmpItem1950[key];
    }
   });
 }
 return item;
}

function joinMultipleData(item, srcCol2match, arrayName1945, destiCol2match, lstOfcolsToAppend) {
 var tmpArray = window[arrayName1945];
 const tmpItem1950 = tmpArray.find(tmp => tmp[destiCol2match] == item[srcCol2match]);
 const tmpAr1951 = lstOfcolsToAppend.split(",");
 for (i = 0; i < tmpAr1951.length; i++) {
  const tmpAr1953 = tmpAr1951[i].split("~");
  if (tmpItem1950 != null)
   Object.keys(tmpItem1950).forEach(function (key, index) {
    if (tmpAr1953[0] == key) {
     item[tmpAr1953[1]] = tmpItem1950[key];
    }
   });
 }
 return item;
}

function padTo2Digits(num) {
 return num.toString().padStart(2, '0');
}

function convertDateFormatToIndia(date) {//ddmmyy
 return [
  padTo2Digits(date.getDate()),
  padTo2Digits(date.getMonth() + 1),
  date.getFullYear()
 ].join('-');
}

function convertToIndianDateTime(dateStr) {
 let d258ate = new Date(dateStr);
 const year = d258ate.getFullYear();
 const month = String(d258ate.getMonth() + 1).padStart(2, '0');
 const day = String(d258ate.getDate()).padStart(2, '0');
 const hours = String(d258ate.getHours()).padStart(2, '0');
 const minutes = String(d258ate.getMinutes()).padStart(2, '0');

 return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function convertToDateTimeWithT(date) {
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2, '0');
 const day = String(date.getDate()).padStart(2, '0');
 const hours = String(date.getHours()).padStart(2, '0');
 const minutes = String(date.getMinutes()).padStart(2, '0');

 return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function convertDateFormatToComputer(date) {//yymmdd
 return [
  date.getFullYear(),
  padTo2Digits(date.getMonth() + 1),
  padTo2Digits(date.getDate())
 ].join('-');
}

function updateOrInsert_2_GivenArray(nwArray, keyInNwArray, keyInAlreadyArray, lostr_nm) {
 let tmpArray = JSON.parse(localStorage.getItem(lostr_nm)) || [];
 for (item of nwArray) {
  var add = 1;
  for (i = 0; i < tmpArray.length; i++) {
   if (tmpArray[i][keyInAlreadyArray] == item[keyInNwArray]) {
    tmpArray[i] = item;
    add = 0;
   }
  }
  if (add == 1) {
   tmpArray.push(item);
  }
 }
 localStorage.setItem(lostr_nm, JSON.stringify(tmpArray));
 return tmpArray;
}

function validateMobileNumber(mobileNumber) {
 mobileNumber = mobileNumber.trim();
 if (mobileNumber === '0000000000') {
  return true;
 } else {
  if (mobileNumber.length == 10) {
   mobileNumber = 91 + "." + mobileNumber;
  }
  const regex = /^\d+(\.\d+)?$/;
  if (mobileNumber > 91.4999999999 && mobileNumber.length == 13 && mobileNumber < 92)
   return regex.test(mobileNumber);
  else
   return false;
 }
}

function findByMultipleKeys(arr, criteria) {
 return arr.filter((item) => {
  return Object.keys(criteria).every((key) => {
   return item[key] === criteria[key];
  });
 });
}

function filterByDateRange(arrayObj, strtDtObj, endDtObj, key) {
 var ar267 = arrayObj.filter(a => {
  var date = new Date(a[key]);
  return (date >= strtDtObj && date <= endDtObj);
 });
 return ar267;
}

function isASCII(str) {
 return /^[\x00-\x7F]*$/.test(str);
}

function sort_by_key(array, key) {
 return array.sort(function (a, b) {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}

function getWorkPathNm() {
 const pathParts = window.location.pathname.split('/').filter(part => part !== '');
 if (pathParts.length >= 2) {
  return `${pathParts[0]}_${pathParts[1].replace('.html', '')}`;
 }
 return `root`;
}

async function fechJsonOfUrl(daFileUrl) {
 try {
  const response = await fetch(daFileUrl);
  if (!response.ok) throw new Error('Failed to fetch app data');
  const data = await response.json();
  return data;
 } catch (error) {
  console.error('Error fetching app data:', error);
  return {};
 }
}

function showOKmodal(message) {
 const modalOverlay = document.createElement('div');
 const modal = document.createElement('div');
 const modalContent = document.createElement('div');
 const modalMessage = document.createElement('p');
 const okButton = document.createElement('button');
 const closeButton = document.createElement('button');
 const buttonContainer = document.createElement('div');

 modalMessage.textContent = message;
 okButton.textContent = 'OK';
 closeButton.innerHTML = '&times;';

 modalOverlay.style.position = 'fixed';
 modalOverlay.style.top = '0';
 modalOverlay.style.left = '0';
 modalOverlay.style.width = '100%';
 modalOverlay.style.height = '100%';
 modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
 modalOverlay.style.display = 'flex';
 modalOverlay.style.justifyContent = 'center';
 modalOverlay.style.alignItems = 'center';
 modalOverlay.style.zIndex = '1000';

 modal.style.backgroundColor = 'white';
 modal.style.color = "black";
 modal.style.padding = '20px';
 modal.style.borderRadius = '5px';
 modal.style.width = '300px';
 modal.style.maxWidth = '80%';
 modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
 modal.style.position = 'relative';

 closeButton.style.position = 'absolute';
 closeButton.style.top = '5px';
 closeButton.style.right = '10px';
 closeButton.style.background = 'none';
 closeButton.style.border = 'none';
 closeButton.style.fontSize = '20px';
 closeButton.style.cursor = 'pointer';

 buttonContainer.style.marginTop = '20px';
 buttonContainer.style.textAlign = 'right';

 okButton.style.padding = '8px 16px';
 okButton.style.backgroundColor = '#4CAF50';
 okButton.style.color = 'white';
 okButton.style.border = 'none';
 okButton.style.borderRadius = '4px';
 okButton.style.cursor = 'pointer';

 modal.appendChild(closeButton);
 modal.appendChild(modalMessage);
 buttonContainer.appendChild(okButton);
 modal.appendChild(buttonContainer);
 modalOverlay.appendChild(modal);

 document.body.appendChild(modalOverlay);

 function closeModal() {
  document.body.removeChild(modalOverlay);
 }

 okButton.addEventListener('click', closeModal);
 closeButton.addEventListener('click', closeModal);
 modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
   closeModal();
  }
 });

 modal.addEventListener('click', (e) => {
  e.stopPropagation();
 });
}

function showToast(message, options = {}) {
 const defaults = {
  duration: 3000,
  position: 'bottom',
  type: 'info',
  dismissible: true,
  animation: 'fade'
 };
 const settings = { ...defaults, ...options };

 let container = document.getElementById('dynamic-toast-container');
 if (!container) {
  container = document.createElement('div');
  container.id = 'dynamic-toast-container';
  Object.assign(container.style, {
   position: 'fixed',
   top: '0',
   left: '0',
   width: '100%',
   height: '0',
   overflow: 'visible',
   zIndex: '9999',
   pointerEvents: 'none'
  });
  document.body.appendChild(container);
 }

 const toast = document.createElement('div');
 Object.assign(toast.style, {
  position: 'absolute',
  left: '50%',
  padding: '12px 24px',
  borderRadius: '4px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  opacity: '0',
  maxWidth: '80%',
  textAlign: 'center',
  wordBreak: 'break-word',
  transition: 'opacity 0.3s ease',
  willChange: 'opacity',
  backfaceVisibility: 'hidden',
  pointerEvents: 'auto'
 });

 switch (settings.position) {
  case 'top':
   toast.style.top = '20px';
   toast.style.transform = 'translateX(-50%)';
   break;
  case 'middle':
   toast.style.top = '50%';
   toast.style.transform = 'translate(-50%, -50%)';
   break;
  default: // bottom
   toast.style.bottom = '20px';
   toast.style.transform = 'translateX(-50%)';
 }

 const typeColors = {
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336'
 };
 toast.style.backgroundColor = typeColors[settings.type] || typeColors.info;
 toast.style.color = '#ffffff';
 toast.textContent = message;

 container.appendChild(toast);

 setTimeout(() => {
  toast.style.opacity = '1';
 }, 10);

 let timeoutId;
 const dismiss = () => {
  clearTimeout(timeoutId);
  toast.style.opacity = '0';
  setTimeout(() => toast.remove(), 300);
 };

 if (settings.dismissible) {
  toast.addEventListener('click', dismiss);
 }

 timeoutId = setTimeout(dismiss, settings.duration);

 return { dismiss };
}

function chkIfLoggedIn() {
 return new Promise((resolve) => {
  if (my1uzr != null && localStorage.getItem(my1uzr.worknOnPg)) {
   if (!my1uzr.mk || my1uzr.mk.length < 1) {
    if (typeof dontShoLoginConfirmation !== 'undefined' && null !== dontShoLoginConfirmation && 1 == dontShoLoginConfirmation) {
     localStorage.setItem(my1uzr.worknOnPg, 'true');
    }
    resolve({ su: 0, ms: "Login again." });
   } else {
    const longNumber = parseInt(my1uzr.mk.slice(-10), 10);
    resolve({ su: 1, ms: "Session expired" });
   }
  } else {
   if (typeof dontShoLoginConfirmation !== 'undefined' && null !== dontShoLoginConfirmation && 1 == dontShoLoginConfirmation) {
    localStorage.setItem(my1uzr.worknOnPg, 'true');
    resolve({ su: 1, ms: "u must be logged in" });
   } else {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = 'white';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '5px';
    dialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    dialog.style.zIndex = '1000';

    dialog.innerHTML = `
                <p style="color:black;">Do you want to login on this page?</p>
                <div style="display: flex; justify-content: center; gap: 10px; margin-top: 15px;">
                    <button id="dialogYes">Yes</button>
                    <button id="dialogNo">No</button>
                </div>
            `;

    document.body.appendChild(dialog);

    document.getElementById('dialogYes').addEventListener('click', () => {
     if (my1uzr) {
      localStorage.setItem(my1uzr.worknOnPg, 'true');
      resolve({ su: 1, ms: "u must be logged in" });
     }
     dialog.remove();
    });

    document.getElementById('dialogNo').addEventListener('click', () => {
     dialog.remove();
     resolve({ su: 2, ms: "u must be logged in" });
    });
   }
  }
 });
}

async function fnj3(url, jsonPayload, loginRequired_0_1, async_1 = true, loaderId = null, timeout = 20000, maxRetries = 0, shoLoginByOas2orByPas1 = 0, registerAtOwnerIfNotRegistered = 1) {
 try {
  const t343mp = await chkIfLoggedIn();

  if (t343mp.su == 2) {
   return Promise.reject(new Error("first accept login"));
  } else if (t343mp.su == 0) {
   if (shoLoginByOas2orByPas1 > 0) {
    if (shoLoginByOas2orByPas1 == 2) {
     await loadExecFn('open_shoLgnO', 'open_shoLgnO', ['dv_to_set_open_shoLgnO_processed', 0, 1, 2], 'loader', 'https://cdn.jsdelivr.net/gh/sifr-in/cdn@90c6519/cmn/my1lo.js', []);
    } else {
     await loadExecFn('open_shoLgnP', 'open_shoLgnP', ['dv_to_set_open_shoLgnP_processed', 0, 1, 2], 'loader', 'https://cdn.jsdelivr.net/gh/sifr-in/cdn@c68ab18/cmn/my1lp.js', []);
    }
    return Promise.reject(new Error("Login required"));
   } else {
    return Promise.reject(new Error(JSON.stringify(t343mp)));
   }
  }

  let xhr = null;
  let isAborted = false;
  let dynamicLoaderId = null;

  const executeRequest = () => {
   return new Promise((resolve, reject) => {
    // Create loader if loaderId is null
    if (loaderId === null) {
     dynamicLoaderId = 'loader-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
     const loaderHtml = `
      <div id="${dynamicLoaderId}" class="d-flex justify-content-center align-items-center" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999;">
       <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
       </div>
      </div>
     `;
     document.body.insertAdjacentHTML('beforeend', loaderHtml);
    } else if (loaderId) {
     document.getElementById(loaderId).style.display = "flex";
    }

    xhr = new XMLHttpRequest();
    xhr.open('POST', url, async_1);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = timeout;

    xhr.onload = function () {
     if (isAborted) return;
     cleanupLoader();

     try {
      if (xhr.status >= 200 && xhr.status < 300) {
       const response = JSON.parse(xhr.responseText);
       if (response) {
        if (response.ms && response.ms.includes("not registered") && registerAtOwnerIfNotRegistered == 1) {
         const registrationUrl = "https://my1.in/2/0.php";
         let registrationPayload = JSON.parse(JSON.stringify(jsonPayload));
         registrationPayload.tn = appOwner.tn;
         registrationPayload.fn = 37;

         return fnj3(registrationUrl, registrationPayload, loginRequired_0_1, async_1, loaderId, timeout, maxRetries, 0, 0)
          .then(registrationResponse => {
           if (registrationResponse && registrationResponse.su == 1) {
            return fnj3(url, jsonPayload, loginRequired_0_1, async_1, loaderId, timeout, maxRetries, 0, 0);
           } else {
            throw new Error(`Registration failed. contact admin`);
           }
          })
          .then(resolve)
          .catch(reject);
        }
        resolve(response);
       } else {
        reject(new Error(response.ms || "API call was not successful"));
       }
      } else {
       let errorMsg = `HTTP error ${xhr.status}`;
       try {
        const errorResponse = JSON.parse(xhr.responseText);
        if (errorResponse.message) {
         errorMsg += `: ${errorResponse.message}`;
        }
       } catch (e) {
        errorMsg += `: ${xhr.statusText}`;
       }
       reject(new Error(errorMsg));
      }
     } catch (e) {
      reject(new Error(`Failed to parse response: ${e.message}`));
     }
    };

    xhr.onerror = function () {
     if (isAborted) return;
     cleanupLoader();
     reject(new Error("Network error - request failed to complete"));
    };

    xhr.ontimeout = function () {
     if (isAborted) return;
     cleanupLoader();
     reject(new Error("Request timed out"));
    };

    xhr.onabort = function () {
     cleanupLoader();
     reject(new Error("Request was aborted"));
    };

    try {
     xhr.send(JSON.stringify(jsonPayload));
    } catch (e) {
     cleanupLoader();
     reject(new Error(`Failed to send request: ${e.message}`));
    }
   });
  };

  // Helper function to cleanup loader
  const cleanupLoader = () => {
   if (dynamicLoaderId) {
    const loaderElement = document.getElementById(dynamicLoaderId);
    if (loaderElement) {
     loaderElement.remove();
    }
    dynamicLoaderId = null;
   } else if (loaderId) {
    document.getElementById(loaderId).style.display = "none";
   }
  };

  const cancel = () => {
   isAborted = true;
   if (xhr) {
    xhr.abort();
   }
   cleanupLoader();
  };

  const requestPromise = executeRequest();
  requestPromise.cancel = cancel;
  return requestPromise;
 } catch (error) {
  return Promise.reject(error);
 }
}

function loadLoginSystem(shoLoginByOas2orByPas1, fnNmToCreateLoginModal) {
 return new Promise((resolve, reject) => {
  if (typeof window[fnNmToCreateLoginModal] === 'function' && typeof setupL3EventListeners === 'function') {
   resolve();
   return;
  }

  let lognScrptUrl = "https://cdn.jsdelivr.net/gh/sifr-in/cdn@59ed0c0/cmn/my1lp.js";
  if (shoLoginByOas2orByPas1 == 2) lognScrptUrl = "https://cdn.jsdelivr.net/gh/sifr-in/cdn@7c51d7f/cmn/my1lo.js";

  loadScript(lognScrptUrl, () => {
   if (typeof window[fnNmToCreateLoginModal] === 'function' && typeof setupL3EventListeners === 'function') {
    resolve();
   } else {
    reject(new Error("Login system loaded but required functions not found"));
   }
  });
 });
}

function showLoginInfo(shoLogOut, showLoginModalDirectly, shoLoginByOas2orByPas1, dontShoThisLoginModal) {
 let loginInfoModal = document.getElementById('login-info-modal');

 if (!loginInfoModal) {
  loginInfoModal = document.createElement('div');
  loginInfoModal.id = 'login-info-modal';
  loginInfoModal.className = 'modal';
  loginInfoModal.style.display = 'none';
  loginInfoModal.style.position = 'fixed';
  loginInfoModal.style.zIndex = '1000';
  loginInfoModal.style.left = '0';
  loginInfoModal.style.top = '0';
  loginInfoModal.style.width = '100%';
  loginInfoModal.style.height = '100%';
  loginInfoModal.style.backgroundColor = 'rgba(0,0,0,0.7)';
  loginInfoModal.style.justifyContent = 'center';
  loginInfoModal.style.alignItems = 'center';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.backgroundColor = '#fff';
  modalContent.style.padding = '20px';
  modalContent.style.color = '#000';
  modalContent.style.borderRadius = '8px';
  modalContent.style.maxWidth = '400px';
  modalContent.style.maxHeight = '85%';
  modalContent.style.width = '90%';
  modalContent.style.position = 'relative';

  const closeButton = document.createElement('span');
  closeButton.className = 'close-modal';
  closeButton.innerHTML = '&times;';
  closeButton.style.position = 'absolute';
  closeButton.style.right = '15px';
  closeButton.style.top = '5px';
  closeButton.style.fontSize = '28px';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
   loginInfoModal.style.display = 'none';
  });

  const span_lgot = document.createElement('span');
  span_lgot.style.cursor = 'pointer';
  span_lgot.textContent = ' _';
  span_lgot.addEventListener('click', () => {
   if (confirm('Are you sure you want to log out?')) {
    my1uzr = null;
    localStorage.setItem('my1uzr', null);
    location.reload();
   }
  });

  const modalTitle = document.createElement('h2');
  modalTitle.className = 'modal-title';
  modalTitle.textContent = 'Login Information';
  modalTitle.style.marginTop = '0';
  modalTitle.appendChild(span_lgot);

  /*addLongPressListener(modalTitle, function() {
   if (confirm('Are you sure you want to log out?')) {
    my1uzr = null;
    localStorage.setItem('my1uzr', null);
    location.reload();
   }
  }, 3000);*/

  const infoContainer = document.createElement('div');
  infoContainer.id = 'login-info-container';

  modalContent.appendChild(closeButton);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(infoContainer);
  loginInfoModal.appendChild(modalContent);

  document.body.appendChild(loginInfoModal);
 }

 const infoContainer = document.getElementById('login-info-container');
 infoContainer.innerHTML = '';

 if (typeof my1uzr !== 'undefined' && my1uzr !== null && my1uzr.mk) {
  dontShoThisLoginModal = 0;
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';

  const details = [
   { label: 'Name: ', value: my1uzr.mn || 'Not provided' },
   { label: 'Local nm: ', value: my1uzr.mu || 'Not provided' },
   { label: 'Mobile: ', value: my1uzr.mo || 'Not provided' },
   { label: 'Constraint: ', value: my1uzr.mc || 'Not selected' }
  ];

  details.forEach(detail => {
   const detailRow = document.createElement('p');
   detailRow.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
   userInfo.appendChild(detailRow);
  });
  infoContainer.appendChild(userInfo);

  const logoutButton = document.createElement('button');
  logoutButton.className = 'logout-button';
  logoutButton.textContent = 'Logout';
  logoutButton.style.marginTop = '50px';
  logoutButton.addEventListener('click', () => {
   my1uzr = null;
   localStorage.setItem('my1uzr', null);
   location.reload();
  });
  if (shoLogOut === 1)
   infoContainer.appendChild(logoutButton);

  const b_tn_callShoMyCtr = document.createElement('button');
  b_tn_callShoMyCtr.className = 'button';
  b_tn_callShoMyCtr.textContent = 'my';
  b_tn_callShoMyCtr.style.marginTop = '50px';
  b_tn_callShoMyCtr.addEventListener('click', () => {
   chkMyControlExists();
  });
  infoContainer.appendChild(b_tn_callShoMyCtr);
 } else {
  if (showLoginModalDirectly && showLoginModalDirectly == 1) {
   chkLoadLoginExists(shoLoginByOas2orByPas1);
  } else {
   const loginMessage = document.createElement('p');
   loginMessage.textContent = 'You are not logged in.';
   loginMessage.style.marginBottom = '15px';

   const loginButton = document.createElement('button');
   loginButton.textContent = 'Login';
   loginButton.style.padding = '8px 16px';
   loginButton.style.backgroundColor = '#4CAF50';
   loginButton.style.color = 'white';
   loginButton.style.border = 'none';
   loginButton.style.borderRadius = '4px';
   loginButton.style.cursor = 'pointer';
   loginButton.addEventListener('click', () => {
    loginInfoModal.style.display = 'none';
    chkLoadLoginExists(shoLoginByOas2orByPas1);
   });

   infoContainer.appendChild(loginMessage);
   infoContainer.appendChild(loginButton);
  }
 }

 if (dontShoThisLoginModal == 0)
  loginInfoModal.style.display = 'flex';

 loginInfoModal.addEventListener('click', (e) => {
  if (e.target === loginInfoModal) {
   loginInfoModal.style.display = 'none';
  }
 });
}

function chkMyControlExists() {
 if (typeof showMyProxyModal !== 'function') {
  loadScript("https://cdn.jsdelivr.net/gh/sifr-in/cdn@df5010e/cmn/my1ctr.js", () => {
   if (typeof showMyProxyModal === 'function') {
    showMyProxyModal();
   } else {
    reject(new Error("Login system loaded but required functions not found"));
   }
  });
 } else {
  showMyProxyModal();
 }
}

function chkLoadLoginExists(shoLoginByOas2orByPas1) {
 const existingModal = document.getElementById('loginModalBackdrop');

 if (existingModal && existingModal.style.display !== 'none') {
  console.log('Login modal already open, skipping reload');
  return Promise.resolve({
   __loginRequired: true,
   ms: "Login modal already open and visible"
  });
 }

 if (shoLoginByOas2orByPas1 === 2) {
  if (typeof createLoginByOModal !== 'function') {
   return loadLoginSystem(shoLoginByOas2orByPas1, "createLoginByOModal").then(() => {
    createLoginByOModal();
    return { __loginRequired: true, ms: "login-modal loaded;" };
   }).catch(err => {
    alert("Failed to load login system: " + err.message);
    return { __loginRequired: true, __ignored: true };
   });
  } else {
   createLoginByOModal();
   return { __loginRequired: true, ms: "showing already loaded login-modal;" };
  }
 } else if (shoLoginByOas2orByPas1 === 1) {
  if (typeof createLoginByPModal !== 'function') {
   return loadLoginSystem(shoLoginByOas2orByPas1, "createLoginByPModal").then(() => {
    createLoginByPModal();
    return { __loginRequired: true, ms: "login-modal loaded;" };
   }).catch(err => {
    alert("Failed to load login system: " + err.message);
    return { __loginRequired: true, __ignored: true };
   });
  } else {
   createLoginByPModal();
   return { __loginRequired: true, ms: "showing already loaded login-modal;" };
  }
 } else showToast("contact admin");
}

function isEven(number) {
 return number % 2 === 0;
}

function isOdd(number) {
 return number % 2 !== 0;
}

async function validateImageUrl(url) {
 if (!url) return false;

 try {
  const response = await fetch(url, { method: 'HEAD' });
  if (response.ok) {
   const contentType = response.headers.get('Content-Type');
   if (contentType && contentType.startsWith('image/')) {
    return true;
   }
  }
 } catch (e) {
  console.log("HEAD request failed, falling back to other methods");
 }

 const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
 const lowerUrl = url.toLowerCase();

 return imageExtensions.some(ext => {
  const extIndex = lowerUrl.indexOf(ext);
  if (extIndex === -1) return false;
  return extIndex === lowerUrl.length - ext.length ||
   ['?', '#'].includes(lowerUrl.charAt(extIndex + ext.length));
 });
}

function filterRecordsByDate(records, dateColumn, minDate, maxDate) {
 if (!records || !Array.isArray(records)) return [];
 if (!dateColumn) return records;

 // Parse dates only once
 const min = minDate ? new Date(minDate) : null;
 const max = maxDate ? new Date(maxDate) : null;

 // Validate dates
 if ((minDate && isNaN(min.getTime())) || (maxDate && isNaN(max.getTime()))) {
  console.error('Invalid date parameters');
  return [];
 }

 return records.filter(record => {
  if (!record[dateColumn]) return false;

  try {
   const recordDate = new Date(record[dateColumn]);
   if (isNaN(recordDate.getTime())) return false;

   // Check if record is within range
   const afterMin = !min || recordDate >= min;
   const beforeMax = !max || recordDate <= max;

   return afterMin && beforeMax;
  } catch {
   return false;
  }
 });

}

function addLongPressListener(element, callback, duration = 500) {
 let timer;

 function startTimer() {
  timer = setTimeout(callback, duration);
 }

 function clearTimer() {
  clearTimeout(timer);
 }

 // Mouse events
 element.addEventListener('mousedown', startTimer);
 element.addEventListener('mouseup', clearTimer);
 element.addEventListener('mouseleave', clearTimer);

 // Touch events
 element.addEventListener('touchstart', startTimer);
 element.addEventListener('touchend', clearTimer);
 element.addEventListener('touchcancel', clearTimer);

 // Prevent context menu
 element.addEventListener('contextmenu', (e) => e.preventDefault());
}

function createAdContainer() {
 const adContainer = document.createElement('div');

 // Create the ins element
 const insElement = document.createElement('ins');
 insElement.className = 'adsbygoogle';
 insElement.style.display = 'inline-block';
 insElement.style.width = '320px';
 insElement.style.height = '50px';
 insElement.dataset.adClient = 'ca-pub-5594579046538353';
 insElement.dataset.adSlot = '1287000278';

 adContainer.appendChild(insElement);

 // Create and append the script if needed
 if (!window.adsbygoogle) {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  adContainer.appendChild(script);
 }

 return adContainer;
}
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
 currentYearElement.textContent = new Date().getFullYear();
}

function playAud(audioUrl, hiddenAudioPlayer = "hiddenIframeToPlayDriveAud") {
 try {
  // Extract file ID from various Google Drive URL formats
  const fileId = extractGoogleDriveFileId(audioUrl);

  if (!fileId) {
   // Fallback for non-Google Drive URLs
   const audio = new Audio(audioUrl);
   return audio.play().then(() => audio);
  }

  // Create or reuse hidden iframe
  let iframe = document.getElementById(hiddenAudioPlayer);
  if (!iframe) {
   iframe = createHiddenIframe();
  }

  // Use Google Drive's embed preview with autoplay
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview?autoplay=1`;
  iframe.src = embedUrl;

  console.log('Playing audio via hidden iframe:', embedUrl);
  return Promise.resolve(iframe);

 } catch (error) {
  console.error('Error playing audio:', error);
  return Promise.reject(error);
 }
}

function extractGoogleDriveFileId(url) {
 // Multiple patterns to extract file ID from different Google Drive URL formats
 const patterns = [
  /\/file\/d\/([^\/]+)/,           // Standard file URL
  /\/d\/([^\/]+)/,                 // Shortened format
  /id=([^&]+)/,                    // ID parameter format
  /open\?id=([^&]+)/,              // Open format
  /uc\?export=download&id=([^&]+)/ // Direct download format
 ];

 for (const pattern of patterns) {
  const match = url.match(pattern);
  if (match && match[1]) {
   return match[1];
  }
 }
 return null;
}

function createHiddenIframe(hiddenAudioPlayer) {
 const iframe = document.createElement('iframe');
 iframe.id = hiddenAudioPlayer;
 iframe.style.cssText = `
  position: fixed;
  top: -1000px;
  left: -1000px;
  width: 1px;
  height: 1px;
  border: none;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
 `;
 document.body.appendChild(iframe);
 return iframe;
}

// ================= UNIVERSAL BACK BUTTON HANDLER =================

let backButtonHandlerInitialized = false;

function initializeUniversalBackButtonHandler() {
 if (backButtonHandlerInitialized) return;

 console.log('Initializing Universal Back Button Handler...');

 // Method 1: History API approach
 initializeHistoryState();

 // Method 2: Direct back button interception
 window.addEventListener('popstate', function (event) {
  console.log('Back button detected via popstate');
  handleUniversalBackButton();
 });

 // Method 3: Fallback for PWA direct launch
 window.addEventListener('pagehide', function (event) {
  if (areAnyModalsOpen()) {
   console.log('Page hide with modals open - intercepting');
   event.preventDefault();
   handleUniversalBackButton();

   // Keep the page alive
   setTimeout(() => {
    window.history.pushState({ universalBackButton: true }, '');
   }, 100);
  }
 });

 // Method 4: Beforeunload as final safety net
 window.addEventListener('beforeunload', function (event) {
  if (typeof releaseWakeLock === 'function') {
   releaseWakeLock();
  }
  //used in sho.html
  if (typeof dontShowReloadConfirmation !== 'undefined' && dontShowReloadConfirmation === 1) {
   console.log('Reload confirmation suppressed by dontShowReloadConfirmation flag');
   return; // Exit without showing confirmation
  }
 });

 backButtonHandlerInitialized = true;
}

function initializeHistoryState() {
 // Ensure we have a managed state
 if (!history.state || !history.state.universalBackButton) {
  history.replaceState({ universalBackButton: true, modalCount: 0 }, '');
 }

 // Add an entry to prevent immediate exit
 history.pushState({ universalBackButton: true, preventExit: true }, '');
}

function handleUniversalBackButton() {
 console.log('Universal back button handler triggered');

 // Clear existing timeout
 if (backButtonTimeout) {
  clearTimeout(backButtonTimeout);
 }

 // Increment press count
 backButtonPressCount++;

 console.log(`Back button pressed ${backButtonPressCount} time(s), Modal stack: ${modalStack.length}`);

 // Set timeout to reset counter after 2 seconds
 backButtonTimeout = setTimeout(() => {
  console.log('Resetting back button counter');
  backButtonPressCount = 0;
 }, 500);

 // Handle based on press count and modal stack
 if (backButtonPressCount === 1) {
  return handleFirstBackPress();
 } else if (backButtonPressCount === 2) {
  return handleSecondBackPress();
 } else if (backButtonPressCount >= 3) {
  return handleThirdBackPress();
 }

 return true;
}

function handleFirstBackPress() {
 if (modalStack.length > 0) {
  // Close top modal
  const modalClosed = closeTopModalFromStack();

  if (modalClosed) {
   const remainingModals = modalStack.length;

   if (remainingModals > 0) {
    // Still more modals open
    if (remainingModals >= 2) {
     showToast(`2-close all modals, 3-exit`);
    } else {
     showToast(`2-close last, 3-exit`);
    }
   } else {
    // All modals closed
    showToast(`2-exit`);
   }
   return true;
  }
 } else {
  // No modals open
  showToast(`2-exit`);
  return true;
 }

 return false;
}

function handleSecondBackPress() {
 if (modalStack.length > 0) {
  // Close all remaining modals
  const modalsClosed = closeAllModalsUniversally();

  if (modalsClosed > 0) {
   showToast(`Closed all modals. Press back 3 times to exit`);
   backButtonPressCount = 2; // Set to 2 so next press will be third
   return true;
  }
 } else {
  // No modals, prepare for exit
  showToast(`Press back 3 times to exit`);
  backButtonPressCount = 2; // Set to 2 so next press will be third
  return true;
 }

 return false;
}

function handleThirdBackPress() {
 // Reset counter
 backButtonPressCount = 0;
 if (backButtonTimeout) {
  clearTimeout(backButtonTimeout);
  backButtonTimeout = null;
 }

 // Allow exit
 console.log('Third back press - allowing exit');
 return false; // Don't handle, let browser exit
}

function closeTopModalFromStack() {
 if (modalStack.length === 0) {
  console.log('No modals in stack to close');
  return false;
 }

 // Get the topmost modal (last in the stack - highest z-index)
 const topModalId = modalStack[modalStack.length - 1];
 console.log(`Closing top modal from stack: ${topModalId}`);

 const modalElement = document.getElementById(topModalId);

 if (modalElement) {
  return closeModalElement(modalElement);
 } else {
  // Modal element not found, remove from stack
  console.warn(`Modal element with id ${topModalId} not found, removing from stack`);
  modalStack.pop();
  return false;
 }
}

function closeAllModalsUniversally() {
 console.log('Closing ALL remaining modals');
 let closedCount = 0;

 // Close from top of stack to bottom (reverse order)
 const modalsToClose = [...modalStack].reverse();

 for (const modalId of modalsToClose) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
   if (closeModalElement(modalElement)) {
    closedCount++;
   }
  }
 }

 // Force cleanup
 cleanupModalArtifacts();
 modalStack = [];
 modalZIndexCounter = 1050;

 console.log(`Closed ${closedCount} modals`);
 return closedCount;
}

function closeModalElement(modal) {
 try {
  const modalId = modal.id || 'anonymous';
  console.log(`Attempting to close modal: ${modalId}`);

  // Method 1: Try Bootstrap modal API first
  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
   const bsModal = bootstrap.Modal.getInstance(modal);
   if (bsModal) {
    bsModal.hide();
    removeModalFromStack(modalId);
    console.log(`Closed via Bootstrap API: ${modalId}`);
    return true;
   }
  }

  // Method 2: Trigger hide event for Bootstrap
  const hideEvent = new Event('hide.bs.modal');
  modal.dispatchEvent(hideEvent);

  // Method 3: Direct Bootstrap class manipulation
  if (modal.classList.contains('show')) {
   modal.style.display = 'none';
   modal.classList.remove('show');

   // Remove backdrop if exists
   const backdrops = document.querySelectorAll('.modal-backdrop');
   if (backdrops.length > 0) {
    backdrops[backdrops.length - 1].remove();
   }

   // Reset body styles
   document.body.classList.remove('modal-open');
   document.body.style.overflow = '';
   document.body.style.paddingRight = '';

   removeModalFromStack(modalId);
   console.log(`Closed via class removal: ${modalId}`);
   return true;
  }

  // Method 4: Generic hide for any modal-like element
  modal.style.display = 'none';
  removeModalFromStack(modalId);
  console.log(`Closed via display none: ${modalId}`);
  return true;

 } catch (error) {
  console.error('Error closing modal:', error);
  // Last resort: just hide it and remove from stack
  modal.style.display = 'none';
  removeModalFromStack(modal.id);
  return true;
 }
}

function cleanupModalArtifacts() {
 console.log('Cleaning up modal artifacts...');

 // Remove modal backdrops
 const backdrops = document.querySelectorAll('.modal-backdrop, .modal-backdrop.fade.show');
 backdrops.forEach(backdrop => {
  backdrop.remove();
  console.log('Removed backdrop');
 });

 // Remove body modal classes
 document.body.classList.remove('modal-open');

 // Reset body styles
 document.body.style.overflow = '';
 document.body.style.paddingRight = '';

 // Remove any inline styles that might be blocking scroll
 document.body.style.removeProperty('overflow');
 document.body.style.removeProperty('padding-right');

 // Remove any custom overlay styles
 const overlays = document.querySelectorAll('body > div[style*="position: fixed"]');
 overlays.forEach(overlay => {
  if (overlay.style.backgroundColor === 'rgba(0, 0, 0, 0.5)' ||
   overlay.style.background === 'rgba(0, 0, 0, 0.5)') {
   overlay.remove();
   console.log('Removed overlay');
  }
 });
}

function areAnyModalsOpen() {
 const allElements = document.querySelectorAll('*');
 for (let element of allElements) {
  if (isModalElement(element)) {
   console.log('Found open modal:', element.id || 'anonymous');
   return true;
  }
 }
 return false;
}

function isModalElement(element) {
 // Skip if element is not visible
 const style = window.getComputedStyle(element);
 const isVisible = style.display !== 'none' &&
  element.offsetParent !== null &&
  style.visibility !== 'hidden';

 if (!isVisible) return false;

 // Check for modal characteristics with z-index consideration
 const hasModalClass = element.classList.contains('modal') ||
  element.classList.contains('show') ||
  element.getAttribute('role') === 'dialog';

 const hasModalStyle = style.position === 'fixed' ||
  style.position === 'absolute' ||
  parseInt(style.zIndex) >= 1000; // Lowered threshold to catch more modals

 const hasModalContent = element.textContent?.includes('modal') ||
  element.innerHTML?.includes('modal') ||
  element.id?.includes('modal') ||
  element.id?.includes('Modal') ||
  element.id?.includes('dialog') ||
  element.id?.includes('Dialog');

 const isOverlay = style.backgroundColor?.includes('rgba') ||
  style.background?.includes('rgba') ||
  element.style.backgroundColor === 'rgba(0, 0, 0, 0.5)' ||
  element.style.background === 'rgba(0, 0, 0, 0.5)';

 // Also consider elements with high z-index that might be overlays
 const hasHighZIndex = parseInt(style.zIndex) >= 1000;

 return hasModalClass || hasModalStyle || hasModalContent || isOverlay || hasHighZIndex;
}

// Enhanced function to create modal dynamically with proper z-index handling
function create_modal_dynamically(modalId = 'dynamicModal') {
 // Remove existing modal if present
 const existingModal = document.getElementById(modalId);
 if (existingModal) {
  existingModal.remove();
  removeModalFromStack(modalId);
 }

 // Create modal element
 const modal = document.createElement('div');
 modal.className = 'modal fade';
 modal.id = modalId;
 modal.setAttribute('tabindex', '-1');
 modal.setAttribute('aria-labelledby', `${modalId}Label`);
 modal.setAttribute('aria-hidden', 'true');

 // ✅ FIX: Set z-index for proper stacking (Bootstrap backdrop is 1040-1050)
 modal.style.zIndex = modalZIndexCounter + 10; // Ensure modal is above backdrop

 const modalContentId = `${modalId}_modal_content`;

 modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content" id="${modalContentId}">
                <!-- Modal content will be inserted here -->
            </div>
        </div>
    `;

 document.body.appendChild(modal);

 // Set random border color for the modal
 const modalContent = document.getElementById(modalContentId);
 const randomColor = getRandomColor();
 modalContent.style.border = `3px solid ${randomColor}`;

 // Initialize Bootstrap modal
 const modalInstance = new bootstrap.Modal(modal, {
  backdrop: true,
  keyboard: true
 });

 // ✅ FIX: Manually handle backdrop z-index
 modalInstance._config.backdrop = true;

 // Manually add to stack since we're creating dynamically
 if (!modalStack.includes(modalId)) {
  modalStack.push(modalId);
  history.pushState({
   modalOpen: true,
   modalId: modalId,
   modalStack: [...modalStack]
  }, '');
 }

 // Add event listener for when modal is actually shown
 modal.addEventListener('show.bs.modal', function () {
  if (!modalStack.includes(modalId)) {
   modalStack.push(modalId);
  }

  // ✅ FIX: Ensure modal z-index is properly set when shown
  modal.style.zIndex = modalZIndexCounter + 10;
 });

 // Add event listener for when modal is hidden
 modal.addEventListener('hidden.bs.modal', function () {
  removeModalFromStack(modalId);
  // ✅ FIX: Reset z-index counter if this was the topmost modal
  if (modalStack.length === 0) {
   modalZIndexCounter = 1050;
  }
 });

 // Return both content element and modal instance
 return {
  contentElement: modalContent,
  modalInstance: modalInstance,
  modalElement: modal
 };
}

function getRandomColor() {
 const colors = [
  '#0d6efd', '#6f42c1', '#198754', '#dc3545', '#fd7e14',
  '#ffc107', '#20c997', '#0dcaf0', '#6610f2', '#d63384',
  '#6c757d', '#0dcaf0', '#10b981', '#8b5cf6', '#ef4444',
  '#f59e0b', '#84cc16', '#06b6d4', '#8b5cf6', '#ec4899'
 ];
 return colors[Math.floor(Math.random() * colors.length)];
}

function makeDraggable(element) {
 let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
 let isDragging = false;

 element.onmousedown = dragMouseDown;
 element.ontouchstart = dragTouchStart;

 function dragMouseDown(e) {
  if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') {
   return; // Don't drag if clicking on button or icon
  }

  e.preventDefault();
  e.stopPropagation();

  isDragging = true;

  // Get the initial mouse cursor position
  pos3 = e.clientX;
  pos4 = e.clientY;

  // Change cursor to grabbing
  element.style.cursor = 'grabbing';

  // Call functions whenever the cursor moves
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;

  // Prevent text selection while dragging
  document.body.style.userSelect = 'none';
 }

 function dragTouchStart(e) {
  if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') {
   return; // Don't drag if touching on button or icon
  }

  e.preventDefault();
  e.stopPropagation();

  isDragging = true;

  const touch = e.touches[0];
  pos3 = touch.clientX;
  pos4 = touch.clientY;

  element.style.cursor = 'grabbing';

  document.ontouchend = closeDragElement;
  document.ontouchmove = elementTouchDrag;

  document.body.style.userSelect = 'none';
 }

 function elementDrag(e) {
  if (!isDragging) return;

  e.preventDefault();
  e.stopPropagation();

  // Calculate the new cursor position
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;

  updateElementPosition();
 }

 function elementTouchDrag(e) {
  if (!isDragging) return;

  e.preventDefault();
  e.stopPropagation();

  const touch = e.touches[0];
  pos1 = pos3 - touch.clientX;
  pos2 = pos4 - touch.clientY;
  pos3 = touch.clientX;
  pos4 = touch.clientY;

  updateElementPosition();
 }

 function updateElementPosition() {
  // Get current position
  const currentTop = parseInt(element.style.top) || (window.innerHeight - element.offsetHeight - 20);
  const currentLeft = parseInt(element.style.left) || (window.innerWidth - element.offsetWidth - 20);

  // Calculate new position
  const newTop = currentTop - pos2;
  const newLeft = currentLeft - pos1;

  // Keep within viewport bounds (accounting for scroll)
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  const maxTop = scrollY + viewportHeight - element.offsetHeight - 5;
  const minTop = scrollY + 5;
  const maxLeft = scrollX + viewportWidth - element.offsetWidth - 5;
  const minLeft = scrollX + 5;

  element.style.top = Math.max(minTop, Math.min(newTop, maxTop)) + 'px';
  element.style.left = Math.max(minLeft, Math.min(newLeft, maxLeft)) + 'px';
  element.style.bottom = 'auto';
  element.style.right = 'auto';
 }

 function closeDragElement() {
  if (!isDragging) return;

  isDragging = false;

  // Stop moving when mouse button is released
  document.onmouseup = null;
  document.onmousemove = null;
  document.ontouchend = null;
  document.ontouchmove = null;

  element.style.cursor = 'grab';

  // Restore text selection
  document.body.style.userSelect = '';
 }

 // Handle window resize to keep element in viewport
 window.addEventListener('resize', () => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  // Check if element is outside viewport after resize
  if (rect.bottom > viewportHeight || rect.right > viewportWidth || rect.top < 0 || rect.left < 0) {
   // Reposition to bottom right if out of bounds
   element.style.top = 'auto';
   element.style.left = 'auto';
   element.style.bottom = '20px';
   element.style.right = '20px';
  }
 });

 // Handle scroll to maintain position relative to viewport
 let scrollTimeout;
 window.addEventListener('scroll', () => {
  if (!isDragging) {
   // Debounce scroll events for performance
   clearTimeout(scrollTimeout);
   scrollTimeout = setTimeout(() => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // If element is fixed positioned, adjust for scroll
    if (element.style.position === 'fixed') {
     // For fixed elements, we don't need to adjust for scroll
     return;
    }

    // Check if element needs repositioning due to scroll
    if (rect.bottom > viewportHeight || rect.right > viewportWidth || rect.top < 0 || rect.left < 0) {
     // Calculate new position relative to current viewport
     const newTop = Math.max(5, Math.min(rect.top, viewportHeight - rect.height - 5));
     const newLeft = Math.max(5, Math.min(rect.left, viewportWidth - rect.width - 5));

     element.style.top = newTop + 'px';
     element.style.left = newLeft + 'px';
    }
   }, 50);
  }
 });
}

// Replace the existing DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', function () {
 console.log('Initializing Universal Back Button Handler');
 initializeUniversalBackButtonHandler();
 setupWakeLockVisibilityHandler();

 // Also initialize when dynamic content loads
 setTimeout(initializeUniversalBackButtonHandler, 1000);
});

// Export for global access
window.handleUniversalBackButton = handleUniversalBackButton;
window.closeAllModalsUniversally = closeAllModalsUniversally;

