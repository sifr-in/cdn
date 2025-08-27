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

function createDynamicLoader() {
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
  loader.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
  return loader;
}

function loadPromiseScript(url) {
 return new Promise((resolve, reject) => {
  var script = document.createElement("script");
  script.type = "text/javascript";

  script.onload = resolve;
  script.onerror = reject;

  script.src = url;
  document.head.appendChild(script);
 });
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
    resolve({ su: 0, ms: "Login again." });
   } else {
    const longNumber = parseInt(my1uzr.mk.slice(-10), 10);
    resolve({ su: 1, ms: "Session expired" });
   }
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
 });
}

async function fnj3(url, jsonPayload, loginRequired_0_1, async_1 = true, loaderId = null, timeout = 20000, maxRetries = 0, shoLoginByOas2orByPas1 = 0, registerAtOwnerIfNotRegistered = 1) {
 try {
  const t343mp = await chkIfLoggedIn();

  if (t343mp.su == 2) {
   return Promise.reject(new Error("first accept login"));
  } else if (t343mp.su == 0) {
   if (shoLoginByOas2orByPas1 > 0) {
    await chkLoadLoginExists(shoLoginByOas2orByPas1);
    return Promise.reject(new Error("Login required"));
   } else {
    return Promise.reject(new Error(JSON.stringify(t343mp)));
   }
  }

  let xhr = null;
  let isAborted = false;

  const executeRequest = () => {
   return new Promise((resolve, reject) => {
    if (loaderId) {
     document.getElementById(loaderId).style.display = "flex";
    }

    xhr = new XMLHttpRequest();
    xhr.open('POST', url, async_1);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = timeout;

    xhr.onload = function () {
     if (isAborted) return;

     if (loaderId) {
      document.getElementById(loaderId).style.display = "none";
     }

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
     if (loaderId) {
      document.getElementById(loaderId).style.display = "none";
     }
     reject(new Error("Network error - request failed to complete"));
    };

    xhr.ontimeout = function () {
     if (isAborted) return;
     if (loaderId) {
      document.getElementById(loaderId).style.display = "none";
     }
     reject(new Error("Request timed out"));
    };

    xhr.onabort = function () {
     if (loaderId) {
      document.getElementById(loaderId).style.display = "none";
     }
     reject(new Error("Request was aborted"));
    };

    try {
     xhr.send(JSON.stringify(jsonPayload));
    } catch (e) {
     if (loaderId) {
      document.getElementById(loaderId).style.display = "none";
     }
     reject(new Error(`Failed to send request: ${e.message}`));
    }
   });
  };

  const cancel = () => {
   isAborted = true;
   if (xhr) {
    xhr.abort();
   }
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

  let lognScrptUrl = "https://cdn.jsdelivr.net/gh/sifr-in/cdn/cmn/my1lp.js";
  if (shoLoginByOas2orByPas1 == 2) lognScrptUrl = "https://cdn.jsdelivr.net/gh/sifr-in/cdn/cmn/my1lo.js";

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

  const modalTitle = document.createElement('h2');
  modalTitle.className = 'modal-title';
  modalTitle.textContent = 'Login Information';
  modalTitle.style.marginTop = '0';

addLongPressListener(modalTitle, function() {
 if (confirm('Are you sure you want to log out?')) {
  my1uzr = null;
  localStorage.setItem('my1uzr', null);
  location.reload();
 }
}, 3000);
  
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
 if (typeof showMyControls !== 'function') {
  loadScript("https://cdn.jsdelivr.net/gh/sifr-in/cdn@d98ecc7/cmn/my1ctr.js", () => {
   if (typeof showMyControls === 'function') {
    showMyControls();
   } else {
    reject(new Error("Login system loaded but required functions not found"));
   }
  });
 } else {
  showMyControls();
 }
}

function chkLoadLoginExists(shoLoginByOas2orByPas1) {
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




