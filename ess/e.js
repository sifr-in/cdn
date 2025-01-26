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
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

function postCall_Json(rURL, jsonData, tkrq, syncOrNo) {
  var retTxt = "";
  if (tkrq == 1) {
    if (my1uzr.mk.length < 1)
      showLogIn();
    else {
      const longNumber = parseInt(my1uzr.mk.slice(-10), 10);
      checkExpiry(longNumber);
    }
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", rURL, syncOrNo);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      retTxt = xhr.responseText;
      loader.style.display = 'none';
    }
  };
  loader.style.display = 'flex';
  xhr.send(JSON.stringify(jsonData));
  return retTxt;
}
