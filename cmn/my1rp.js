var my1rpCfg = {};
var my1rpCashIds = [];
var my1rpRecs = [];
var my1rpAllRecs = [];
var my1rpCRecs = [];
var my1rpUidSeq = 0;
var my1rpModalId = null;
var my1rpModalInstance = null;
var my1rpEditingRec = null;
var my1rpPartyName = "";
var my1rpKPicker = null;
var my1rpMPicker = null;
var my1rpOnOk = null;

var my1rpModes = [
  { id: 1, label: "Cash" },
  { id: 2, label: "Cheque" },
  { id: 3, label: "Card" },
  { id: 4, label: "UPI" },
  { id: 5, label: "Bank Transfer" },
];

function my1rpEsc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}

function my1rpVal(id) {
  var el = document.getElementById(id);
  return el ? (el.value || "").trim() : "";
}

function my1rpLog(tag, payload) {
  try {
    console.log(tag, JSON.stringify(payload, null, 2));
  } catch (e) {
    console.log(tag, payload);
  }
}

/* ---- config helpers ---- */

function my1rpFlag(key) {
  if (my1rpCfg && Object.prototype.hasOwnProperty.call(my1rpCfg, key)) {
    return my1rpCfg[key] !== 0;
  }
  return true;
}

function my1rpLDefs() {
  var l = my1rpCfg && my1rpCfg.l;
  if (l && typeof l === "object" && Object.keys(l).length) return l;
  return null;
}

function my1rpTbDefault() {
  var tb = my1rpCfg && my1rpCfg.tb;
  return typeof tb === "number" ? tb : 41;
}

/* ---- lookups ---- */

function my1rpCashierLabel(id) {
  for (var i = 0; i < my1rpCRecs.length; i++) {
    var c = my1rpCRecs[i];
    if (String(c.a) === String(id)) {
      return c.h || c.i || ("#" + id);
    }
  }
  return "#" + id;
}

function my1rpPartyLabel(id) {
  if (id == null || id === "" || Number(id) === 0) return "(no party)";
  for (var i = 0; i < my1rpCRecs.length; i++) {
    var c = my1rpCRecs[i];
    if (String(c.a) === String(id)) {
      return c.h || c.i || ("#" + id);
    }
  }
  return "#" + id;
}

function my1rpModeLabel(id) {
  for (var i = 0; i < my1rpModes.length; i++) {
    if (String(my1rpModes[i].id) === String(id)) return my1rpModes[i].label;
  }
  return id || "-";
}

function my1rpRecId(rec) {
  if (!rec) return null;
  if (rec.a != null && String(rec.a) !== "" && Number(rec.a) !== 0)
    return String(rec.a);
  if (rec.uid != null && String(rec.uid) !== "") return String(rec.uid);
  return null;
}

function my1rpNextUid() {
  my1rpUidSeq++;
  return "u" + my1rpUidSeq + "_" + Date.now();
}

function my1rpTypeOf(rec) {
  return String(rec.f) === "1" || rec.f === 1 ? 1 : 0;
}

function my1rpCalcN(h, f, j, k, excludeA) {
  var hv = String(h == null ? "" : h);
  var fv = String(f == null ? "" : f);
  var jv = String(j == null ? "" : j);
  var kv = String(k == null ? "" : k);
  var cnt = 0;
  for (var r = 0; r < my1rpAllRecs.length; r++) {
var rec = my1rpAllRecs[r];
      if (excludeA != null && my1rpRecId(rec) === String(excludeA)) continue;
      var rjNum = parseFloat(rec.j);
      var jNum = parseFloat(j);
      if (
        String(rec.h == null ? "" : rec.h) === hv &&
        String(rec.f) === fv &&
        (!isNaN(rjNum) && !isNaN(jNum)
          ? rjNum === jNum
          : String(rec.j) === jv) &&
        String(rec.k) === kv
      ) {
      cnt++;
    }
  }
  return cnt;
}

function my1rpRecomputeAllN() {
  for (var r = 0; r < my1rpRecs.length; r++) {
    var rec = my1rpRecs[r];
    rec.n = my1rpCalcN(rec.h, rec.f, rec.j, rec.k, my1rpRecId(rec));
  }
}

// The server may return the duplicate list either as a plain array or wrapped
// under an object key "l" (e.g. { "l": [...] }). Normalize both to an array.
function my1rpDupArray(dup) {
  if (Array.isArray(dup)) return dup;
  if (dup && typeof dup === "object" && Array.isArray(dup.l)) return dup.l;
  return [];
}
window.my1rpDupArray = my1rpDupArray;

// Server table-r duplicate rejection (same party h, amount j, date k): render
// the returned dup rows and ask the user to confirm they really received the
// same amount again. Resolves true on Yes/OK.
window.my1rpShowDupConfirm = function (dups, ms) {
  var list = my1rpDupArray(dups);
  var rows = "";
  for (var i = 0; i < list.length; i++) {
    var d = list[i] || {};
    rows +=
      '<div style="display:flex;justify-content:space-between;gap:10px;padding:3px 0;border-bottom:1px dashed #ddd;font-size:13px;">' +
      '<span>' +
      my1rpEsc(my1rpPartyLabel(d.h)) +
      "</span>" +
      '<span>₹' +
      (d.j != null ? d.j : "") +
      " · " +
      (d.k != null ? d.k : "") +
      " · n:" +
      (d.n != null ? d.n : "") +
      "</span></div>";
  }
  var html =
    '<div>' +
    '<p class="mb-2">' +
    (ms ||
      "A receipt/payment with the same Party, Amount and Date already exists.") +
    "</p>" +
    '<p class="mb-2 fw-bold">Have you received the same amount from the party on this date again?</p>' +
    '<div style="max-height:180px;overflow-y:auto;">' +
    rows +
    "</div></div>";
  return showConfirmModal(html);
};

// Before resending an accepted payload, set the Constraint No (n) of every
// receipt that matches a server-returned dup to (max matching dup n) + 1.
window.my1rpBumpDupN = function (paymentArray, dups) {
  var list = Array.isArray(paymentArray) ? paymentArray : [];
  var dupList = my1rpDupArray(dups);
  var bumped = 0;
  for (var i = 0; i < list.length; i++) {
    var r = list[i] || {};
    var rh = String(r.h == null ? "" : r.h);
    var rk = String(r.k == null ? "" : r.k);
    var matched = false;
    for (var j = 0; j < dupList.length; j++) {
      var d = dupList[j] || {};
      if (String(d.h == null ? "" : d.h) !== rh) continue;
      var djNum = parseFloat(d.j);
      var rjNum = parseFloat(r.j);
      if (isNaN(djNum) || isNaN(rjNum) || djNum !== rjNum) continue;
      if (String(d.k == null ? "" : d.k) !== rk) continue;
      matched = true;
      break;
    }
    if (matched) {
      r.n = (Number(r.n) || 0) + 1;
      bumped++;
    }
  }
  return bumped;
};

/* ---- payload build / validate ---- */

function my1rpIsEmptyVal(v) {
  if (v === "" || v === null || v === undefined) return true;
  return false;
}

function my1rpCompact(o) {
  var out = {};
  if (!o) return out;
  for (var key in o) {
    if (!Object.prototype.hasOwnProperty.call(o, key)) continue;
    var v = o[key];
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      var nested = my1rpCompact(v);
      if (Object.keys(nested).length) out[key] = nested;
    } else if (!my1rpIsEmptyVal(v)) {
      out[key] = v;
    }
  }
  return out;
}

function my1rpIsIdNone(v) {
  return (
    my1rpIsEmptyVal(v) ||
    v === 0 ||
    v === "0" ||
    v === "0.0" ||
    v === "0.00"
  );
}

function my1rpFSelected() {
  var chk = document.querySelector('input[name="my1rpF"]:checked');
  return chk ? (Number(chk.value) > 0 ? 1 : 0) : "";
}

function my1rpCollectL(rec) {
  var lObj = {};
  var lDefs = my1rpLDefs();
  if (lDefs) {
    for (var key in lDefs) {
      var el = document.getElementById("my1rpL_" + key);
      lObj[key] = el
        ? el.value.trim()
        : rec && rec.l && rec.l[key] != null
          ? rec.l[key]
          : "";
    }
  } else if (rec && rec.l && typeof rec.l === "object") {
    for (var k2 in rec.l) {
      if (Object.prototype.hasOwnProperty.call(rec.l, k2)) lObj[k2] = rec.l[k2];
    }
  }
  return lObj;
}

function my1rpBuildPayload(mode) {
  var rec = mode === "update" ? my1rpEditingRec : null;

  var e = my1rpFlag("e")
    ? my1rpVal("my1rpE")
    : rec && rec.e != null
      ? rec.e
      : "";
  var f = my1rpFlag("f") ? my1rpFSelected() : rec ? my1rpTypeOf(rec) : "";
  var g = my1rpFlag("g")
    ? Number(my1rpVal("my1rpG")) || 0
    : rec && rec.g != null
      ? rec.g
      : 0;
  var h = my1rpFlag("h")
    ? Number(my1rpVal("my1rpH")) || 0
    : rec && rec.h != null
      ? rec.h
      : 0;
  var i = my1rpFlag("i")
    ? my1rpVal("my1rpI")
    : rec && rec.i != null
      ? rec.i
      : "";
  var j = my1rpFlag("j")
    ? my1rpVal("my1rpJ")
    : rec && rec.j != null
      ? rec.j
      : "";
  var k = my1rpFlag("k")
    ? my1rpVal("my1rpK")
    : rec && rec.k
      ? rec.k
      : "";
  var m = my1rpFlag("m")
    ? my1rpVal("my1rpM")
    : rec && rec.m
      ? rec.m
      : "";
  if (m === "" && my1rpFlag("m")) m = "00:00";
  var o = my1rpFlag("o")
    ? my1rpVal("my1rpO") === "" ? "0.00" : my1rpVal("my1rpO")
    : rec && rec.o != null
      ? rec.o
      : "0.00";

  var lObj = my1rpCollectL(rec);
  var tb = my1rpVal("my1rpTB") || my1rpTbDefault();
  var td = my1rpVal("my1rpTD");
  var n = my1rpCalcN(h, f, j, k, my1rpRecId(rec));

  var payload = {
    e: e,
    f: f,
    g: g,
    h: h,
    i: String(i),
    j: j === "" ? "" : j,
    k: k,
    l: lObj,
    m: m,
    n: n,
    o: String(o),
    tb: tb,
    td: td,
  };
  if (mode === "update" && rec) payload.a = rec.a;
  payload = my1rpCompact(payload);
  if (my1rpIsIdNone(payload.g)) delete payload.g;
  if (my1rpIsIdNone(payload.h)) delete payload.h;
  return payload;
}

function my1rpValidate(payload) {
  if (my1rpFlag("e") && !payload.e) return "Voucher number is required";
  if (my1rpFlag("f") && payload.f !== 0 && payload.f !== 1)
    return "Type is required - choose Received or Payment";
  if (my1rpFlag("g") && !payload.g) return "Cashier is required";
  if (my1rpFlag("j") && (payload.j == null || payload.j === ""))
    return "Amount is required";
  if (my1rpFlag("k") && !payload.k) return "Transaction date is required";

  var lDefs = my1rpLDefs();
  if (lDefs) {
    for (var key in lDefs) {
      var d = lDefs[key] || {};
      var lbl = d.lbl || key;
      var v = payload.l != null ? payload.l[key] : "";
      if (v === undefined || v === null) v = "";
      if (d.rq === 1 && v === "") return lbl + " is required";
      if (d.pattern && v !== "") {
        var rx = null;
        try {
          rx = new RegExp(d.pattern);
        } catch (e) {
          console.warn("my1rp: invalid pattern for l." + key + " (ignored):", d.pattern);
        }
        if (rx) {
          var ptype = String(d.type || "text");
          if (ptype === "email" || ptype === "url") {
            if (!rx.test(v))
              return lbl + " has an invalid format";
          } else {
            if (!rx.test(v))
              console.warn("my1rp: advisory pattern mismatch for l." + key + ":", v);
          }
        }
      }
    }
  }
  return "";
}

function my1rpNotify(title, msg) {
  if (typeof window.showModal === "function") {
    window.showModal({ title: title, message: msg, type: "message" });
  } else if (typeof window.showelsemodal === "function") {
    window.showelsemodal(title + " - " + msg);
  }
}

/* ---- actions ---- */

window.my1rpDoAdd = async function () {
  try {
    if (my1rpEditingRec) return;
    var payload = my1rpBuildPayload("add");
    var err = my1rpValidate(payload);
    if (err) {
      my1rpNotify("Info", "⚠️ " + err);
      return;
    }
    var dupN = my1rpCalcN(payload.h != null ? payload.h : 0, payload.f, payload.j, payload.k, null);
    if (dupN > 0) {
      var ok = await showConfirmModal(
        "⚠️ A receipt/payment with the same Party, Type, Amount (₹" +
          payload.j +
          ") and Date (" +
          payload.k +
          ") already exists (×" +
          dupN +
          "). Add anyway?"
      );
      if (!ok) return;
    }
    my1rpLog("🧾 my1rp ADD payload", payload);
    var copy = {};
    for (var key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key))
        copy[key] = payload[key];
    }
    copy.uid = my1rpNextUid();
    copy.pname = my1rpPartyName || "";
    my1rpRecs.push(copy);
    my1rpRecs.sort(function (a, b) {
      return (Number(b.a) || 0) - (Number(a.a) || 0);
    });
    my1rpRecomputeAllN();
    my1rpHideForm();
    my1rpClearPartyState();
    //my1rpNotify("Success", "✅ Receipt/Payment prepared. See console for payload.");
  } catch (e) {
    console.error("my1rp add error:", e);
    alert("Add failed: " + (e && e.message ? e.message : e));
  }
};

window.my1rpDoUpdate = async function () {
  try {
    if (!my1rpEditingRec) return;
    var payload = my1rpBuildPayload("update");
    var err = my1rpValidate(payload);
    if (err) {
      my1rpNotify("Info", "⚠️ " + err);
      return;
    }
    var dupN = my1rpCalcN(
      payload.h != null ? payload.h : 0,
      payload.f,
      payload.j,
      payload.k,
      my1rpRecId(my1rpEditingRec)
    );
    if (dupN > 0) {
      var ok = await showConfirmModal(
        "⚠️ A receipt/payment with the same Party, Type, Amount (₹" +
          payload.j +
          ") and Date (" +
          payload.k +
          ") already exists (×" +
          dupN +
          "). Update anyway?"
      );
      if (!ok) return;
    }
    my1rpLog("✏️ my1rp UPDATE payload", payload);
    var rid = my1rpRecId(my1rpEditingRec);
    for (var i = 0; i < my1rpRecs.length; i++) {
      if (my1rpRecId(my1rpRecs[i]) === rid) {
        payload.uid = my1rpEditingRec.uid;
        payload.pname = my1rpPartyName || "";
        my1rpRecs[i] = payload;
        break;
      }
    }
    my1rpRecomputeAllN();
    my1rpHideForm();
    my1rpClearPartyState();
    //my1rpNotify("Success", "✅ Updated. See console for payload.");
  } catch (e) {
    console.error("my1rp update error:", e);
    alert("Update failed: " + (e && e.message ? e.message : e));
  }
};

window.my1rpDoDelete = async function (a) {
  var rec = null;
  for (var i = 0; i < my1rpRecs.length; i++) {
    if (my1rpRecId(my1rpRecs[i]) === String(a)) {
      rec = my1rpRecs[i];
      break;
    }
  }
  if (!rec) return;

  var constraintInfo =
    rec.n != null && rec.n > 0 ? " (Constraint no.: ×" + rec.n + ")" : "";
  var ok = await showConfirmModal(
    "Delete voucher #" +
      my1rpEsc(rec.e || rec.a) +
      " of ₹" +
      my1rpEsc(rec.j || "0") +
      constraintInfo +
      "?"
  );
  if (!ok) return;

  var hasServerA =
    rec.a != null && String(rec.a) !== "" && Number(rec.a) !== 0;
  if (!hasServerA) {
    my1rpRecs = my1rpRecs.filter(function (r) {
      return r !== rec;
    });
    my1rpRecomputeAllN();
    my1rpRenderList("");
    return;
  }

  try {
    payload0.vw = 1;
    payload0.fn = 105;
    payload0.x1 = rec.a;
    var response = await fnj3(
      "https://my1.in/2/p.php",
      payload0,
      1,
      true,
      null,
      20000,
      0,
      1,
      1,
      1
    );
    if (response.su == 1) {
      await dbDexieManager.deleteRecords(dbnm, "r", rec.a);
      my1rpRecs = my1rpRecs.filter(function (r) {
        return r !== rec;
      });
      my1rpRecomputeAllN();
      my1rpRenderList("");
    } else {
      window.showelsemodal(response.ms);
    }
  } catch (error) {
    window.showelsemodal("failed:" + error);
  }
};

window.my1rpHideForm = function () {
  var wrap = document.getElementById("my1rpFormWrap");
  if (wrap) wrap.classList.add("d-none");
  var cards = document.getElementById("my1rpCards");
  if (cards) cards.style.display = "";
  var se = document.getElementById("my1rpSearch");
  if (se) se.value = "";
  var okBtn = document.getElementById("my1rpOkBtn");
  if (okBtn) okBtn.style.display = "inline-flex";
  my1rpRenderList("");
  my1rpDropStrayBackdrops();
  my1rpBringToFront();
};

window.my1rpShowForm = function (rec) {
  my1rpEditingRec = rec || null;
  my1rpPartyName = "";
  var wrap = document.getElementById("my1rpFormWrap");
  if (!wrap) return;
  var cards = document.getElementById("my1rpCards");
  if (cards) cards.style.display = "none";
  wrap.classList.remove("d-none");

  if (my1rpFlag("e")) {
    var eEl = document.getElementById("my1rpE");
    if (eEl) eEl.value = rec && rec.e != null ? rec.e : "";
  }
  if (my1rpFlag("f")) {
    var radios = document.querySelectorAll('input[name="my1rpF"]');
    var selF = rec ? String(my1rpTypeOf(rec)) : "";
    for (var r = 0; r < radios.length; r++) {
      radios[r].checked = radios[r].value === selF;
    }
  }
  if (my1rpFlag("g")) {
    var gEl = document.getElementById("my1rpG");
    if (gEl) gEl.value = rec && rec.g != null ? String(rec.g) : "";
  }
  if (my1rpFlag("h")) {
    var hEl = document.getElementById("my1rpH");
    var hVal = rec && rec.h != null ? String(rec.h) : "";
    var hShown = hVal && hVal !== "0" ? hVal : "";
    if (hEl) hEl.value = hShown;
    my1rpPartyName = hShown ? my1rpPartyLabel(hShown) : "";
    var pShow = document.getElementById("my1rpPartyShow");
    if (pShow) pShow.textContent = my1rpPartyName || "(none)";
  }
  if (my1rpFlag("i")) {
    var iEl = document.getElementById("my1rpI");
    if (iEl) iEl.value = rec && rec.i != null ? String(rec.i) : "";
  }
  if (my1rpFlag("j")) {
    var jEl = document.getElementById("my1rpJ");
    if (jEl) jEl.value = rec && rec.j != null ? rec.j : "";
  }
  if (my1rpFlag("k")) {
    var kEl = document.getElementById("my1rpK");
    if (kEl) {
      var kv = rec && rec.k != null ? String(rec.k) : "";
      if (my1rpKPicker && my1rpKPicker.setCommitted) {
        my1rpKPicker.setCommitted(kv);
      } else {
        kEl.value = kv;
      }
    }
  }
  if (my1rpFlag("m")) {
    var mEl = document.getElementById("my1rpM");
    if (mEl) {
      var mv = rec && rec.m != null ? String(rec.m) : "";
      if (my1rpMPicker && my1rpMPicker.setCommitted) {
        my1rpMPicker.setCommitted(mv);
      } else {
        mEl.value = mv;
      }
    }
  }
  if (my1rpFlag("o")) {
    var oEl = document.getElementById("my1rpO");
    if (oEl) oEl.value = rec && rec.o != null ? rec.o : "0.00";
  }

  var lDefs = my1rpLDefs();
  if (lDefs) {
    for (var key in lDefs) {
      var lel = document.getElementById("my1rpL_" + key);
      if (lel)
        lel.value =
          rec && rec.l && rec.l[key] != null ? rec.l[key] : "";
    }
  }

  var tbEl = document.getElementById("my1rpTB");
  if (tbEl)
    tbEl.value =
      rec && rec.tb != null ? rec.tb : my1rpTbDefault();
  var tdEl = document.getElementById("my1rpTD");
  if (tdEl) tdEl.value = rec && rec.td != null ? rec.td : "";

  var sBtn = document.getElementById("my1rpSaveBtn");
  var uBtn = document.getElementById("my1rpUpdateBtn");
  if (rec) {
    if (sBtn) sBtn.style.display = "none";
    if (uBtn) uBtn.style.display = "inline-flex";
  } else {
    if (sBtn) sBtn.style.display = "inline-flex";
    if (uBtn) uBtn.style.display = "none";
  }
  var okBtn = document.getElementById("my1rpOkBtn");
  if (okBtn) okBtn.style.display = rec ? "inline-flex" : "none";
  my1rpDropStrayBackdrops();
  my1rpBringToFront();
};

window.my1rpClearParty = function () {
  var hEl = document.getElementById("my1rpH");
  if (hEl) hEl.value = "";
  my1rpPartyName = "";
  var el = document.getElementById("my1rpPartyShow");
  if (el) el.textContent = "(none)";
};

window.my1rpPickParty = async function () {
  if (typeof open_entind_crud === "function") {
    open_entind_crud(null, null, "htGuestCrud", "my1rpSelectParty", null);
    return;
  }
  try {
    if (typeof loadExe2Fn === "function") {
      await loadExe2Fn(36);
    }
    if (typeof open_entind_crud === "function") {
      open_entind_crud(null, null, "htGuestCrud", "my1rpSelectParty", null);
    } else {
      window.showelsemodal("Info", "Guest selector not available.", false);
    }
  } catch (e) {
    window.showelsemodal("Info", "Guest selector not available.", false);
  }
};

window.my1rpSelectParty = function (record) {
  if (!record || !record.a) return;
  var hEl = document.getElementById("my1rpH");
  if (hEl) hEl.value = String(record.a);
  my1rpPartyName = record.h || record.i || ("#" + record.a);
  var showEl = document.getElementById("my1rpPartyShow");
  if (showEl) showEl.textContent = my1rpPartyName;
};

function my1rpClearPartyState() {
  my1rpEditingRec = null;
  my1rpPartyName = "";
}

function my1rpBringToFront() {
  var modal = document.getElementById(my1rpModalId);
  if (modal) modal.style.zIndex = "99990";
  var body = document.body;
  var backdrops = body.querySelectorAll(
    ".modal-backdrop, .modal-backdrop.fade, .modal-backdrop.show"
  );
  for (var bi = 0; bi < backdrops.length; bi++) {
    backdrops[bi].style.zIndex = "99989";
  }
}

function my1rpDropStrayBackdrops() {
  var body = document.body;
  var keep = [];
  if (my1rpModalId) {
    var modalEl = document.getElementById(my1rpModalId);
    if (modalEl) {
      var bs = bootstrap && bootstrap.Modal ? bootstrap.Modal.getInstance(modalEl) : null;
      if (bs && bs._backdrop && bs._backdrop._element) {
        keep.push(bs._backdrop._element);
      }
    }
  }
  var backdrops = body.querySelectorAll(
    ".modal-backdrop, .modal-backdrop.fade, .modal-backdrop.show"
  );
  for (var bi = 0; bi < backdrops.length; bi++) {
    var bd = backdrops[bi];
    var isKeep = false;
    for (var ki = 0; ki < keep.length; ki++) {
      if (bd === keep[ki]) {
        isKeep = true;
        break;
      }
    }
    if (!isKeep) {
      bd.parentNode && bd.parentNode.removeChild(bd);
    }
  }
}

async function my1rpInitPickers() {
  if (typeof window.initDateTimePicker !== "function") return;
  try {
    my1rpKPicker = await window.initDateTimePicker("my1rpK", { autoNow: false, mode: "date" });
    my1rpMPicker = await window.initDateTimePicker("my1rpM", { autoNow: false, mode: "time" });
    [my1rpKPicker, my1rpMPicker].forEach(function (api) {
      var inst = api && api.instance;
      if (inst && typeof inst.subscribe === "function") {
        try {
          inst.subscribe(
            tempusDominus.Namespace.events.show,
            function () {
              var w = document.querySelector(".tempus-dominus-widget.show");
              if (w) w.style.setProperty("z-index", "99995", "important");
            }
          );
        } catch (e) {
          console.warn("my1rp: picker stack subscribe failed", e);
        }
      }
    });
  } catch (e) {
    console.warn("my1rp: date/time picker init failed", e);
  }
}

/* ---- form builders ---- */

function my1rpCol6(inner, shown) {
  return (
    '<div class="col-6" style="' +
    (shown ? "" : "display:none;") +
    '">' +
    inner +
    "</div>"
  );
}

function my1rpRadioF() {
  return (
    '<div class="d-flex gap-3 mt-1">' +
    '<label class="d-inline-flex align-items-center gap-2" style="font-weight:500;">' +
    '<input type="radio" name="my1rpF" value="0" required> Received (0)</label>' +
    '<label class="d-inline-flex align-items-center gap-2" style="font-weight:500;">' +
    '<input type="radio" name="my1rpF" value="1"> Payment (1)</label>' +
    "</div>"
  );
}

function my1rpModeOptions(cur) {
  var h = '<option value="0"' + (String(cur) === "0" ? " selected" : "") + '>— None (0) —</option>';
  for (var i = 0; i < my1rpModes.length; i++) {
    h +=
      '<option value="' +
      my1rpModes[i].id +
      '"' +
      (String(cur) === String(my1rpModes[i].id) ? " selected" : "") +
      ">" +
      my1rpModes[i].label +
      "</option>";
  }
  return h;
}

function my1rpCashierOptions(cur) {
  if (!my1rpCashIds.length) {
    return '<option value="">No cashiers configured</option>';
  }
  var h = '<option value="">Select cashier...</option>';
  var ids = my1rpCashIds.slice(0).sort(function (a, b) {
    return Number(a) - Number(b);
  });
  for (var i = 0; i < ids.length; i++) {
    h +=
      '<option value="' +
      ids[i] +
      '"' +
      (String(cur) === String(ids[i]) ? " selected" : "") +
      ">" +
      my1rpEsc(my1rpCashierLabel(ids[i])) +
      "</option>";
  }
  return h;
}

function my1rpLInputsHTML() {
  var lDefs = my1rpLDefs();
  if (!lDefs) return "";
  var out = "";
  for (var key in lDefs) {
    var d = lDefs[key] || {};
    var req = d.rq === 1;
    var ph = d.placeholder || "";
    var input =
      '<input type="text" id="my1rpL_' +
      key +
      '" class="form-control-premium" placeholder="' +
      my1rpEsc(ph) +
      '"' +
      (req ? " required" : "") +
      ">";
    out += my1rpCol6(
      '<label class="form-label-premium">' +
        my1rpEsc(d.lbl || key) +
        (req ? ' <span style="color:#dc3545;">*</span>' : "") +
        "</label>" +
        input,
      true
    );
  }
  return out;
}

function my1rpPartyHTML() {
  return (
    '<div class="input-group">' +
    '<input type="hidden" id="my1rpH">' +
    '<span id="my1rpPartyShow" class="form-control-premium" style="flex:1;background:#f8f9fa;">(none)</span>' +
    '<button type="button" class="btn btn-outline-secondary" style="white-space:nowrap;border-radius:8px;" onclick="my1rpPickParty()">' +
    '<i class="fas fa-user me-1"></i>Pick</button>' +
    '<button type="button" class="btn btn-outline-secondary" style="white-space:nowrap;border-radius:8px;" title="Clear party" onclick="my1rpClearParty()">' +
    '<i class="fas fa-times"></i></button>' +
    "</div>"
  );
}

function my1rpRenderFormHTML() {
  var showE = my1rpFlag("e"),
    showF = my1rpFlag("f"),
    showG = my1rpFlag("g"),
    showH = my1rpFlag("h"),
    showI = my1rpFlag("i"),
    showJ = my1rpFlag("j"),
    showK = my1rpFlag("k"),
    showM = my1rpFlag("m"),
    showO = my1rpFlag("o");
  var tbVal = my1rpTbDefault();

  return (
    '<div id="my1rpFormWrap" class="d-none" style="flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;padding:2px;">' +
    '<div class="card-premium p-3 mb-3" style="background:#fff;border:1px solid #6c757d;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.06);">' +
    '<div class="add-form-title mb-3 pb-2" style="border-bottom:2px solid var(--ember, #c0392b);">' +
    '<i class="fas fa-receipt me-2" style="color:var(--ember, #c0392b);"></i>' +
    '<span class="fw-bold" style="color:var(--ember, #c0392b);font-size:16px;">Receipt / Payment</span>' +
    "</div>" +
    '<div class="row g-3">' +
    my1rpCol6(
      '<label class="form-label-premium">Voucher No. <span style="color:#dc3545;">*</span></label>' +
        '<input type="text" id="my1rpE" class="form-control-premium" placeholder="e.g. RCPT-101">',
      showE
    ) +
    my1rpCol6(
      '<label class="form-label-premium">Type <span style="color:#dc3545;">*</span></label>' + my1rpRadioF(),
      showF
    ) +
    my1rpCol6(
      '<label class="form-label-premium">Cashier <span style="color:#dc3545;">*</span></label>' +
        '<select id="my1rpG" class="form-select-premium">' +
        my1rpCashierOptions("") +
        "</select>",
      showG
    ) +
    my1rpCol6(
      '<label class="form-label-premium">Party</label>' + my1rpPartyHTML(),
      showH
    ) +
    my1rpCol6(
      '<label class="form-label-premium">Payment Mode</label>' +
        '<select id="my1rpI" class="form-select-premium">' +
        my1rpModeOptions("") +
        "</select>",
      showI
    ) +
    my1rpCol6(
      '<label class="form-label-premium">Amount ₹ <span style="color:#dc3545;">*</span></label>' +
        '<input type="number" id="my1rpJ" class="form-control-premium" min="0" step="1" placeholder="e.g. 200">',
      showJ
    ) +
    my1rpCol6(
      '<label class="form-label-premium">Date <span style="color:#dc3545;">*</span></label>' +
        '<input type="text" id="my1rpK" class="form-control-premium" placeholder="yyyy-mm-dd">',
      showK
    ) +
    my1rpCol6(
      '<label class="form-label-premium">Time</label>' +
        '<input type="text" id="my1rpM" class="form-control-premium" placeholder="HH:mm">',
      showM
    ) +
    my1rpCol6(
      '<label class="form-label-premium">Round Off ₹</label>' +
        '<input type="number" id="my1rpO" class="form-control-premium" step="0.01" value="0.00" placeholder="e.g. 0.50">',
      showO
    ) +
    my1rpLInputsHTML() +
    '<div class="col-12" style="display:none;">' +
    '<input type="hidden" id="my1rpTB" value="' +
    tbVal +
    '">' +
    '<input type="hidden" id="my1rpTD">' +
    "</div>" +
    "</div>" +
    '<div class="text-center mt-4">' +
    '<button type="button" class="btn-premium btn-premium-primary me-2" id="my1rpSaveBtn" onclick="my1rpDoAdd()">' +
    '<i class="fas fa-save me-1"></i> Add Payload</button>' +
    '<button type="button" class="btn-premium btn-premium-primary me-2" id="my1rpUpdateBtn" style="display:none;" onclick="my1rpDoUpdate()">' +
    '<i class="fas fa-edit me-1"></i> Update Payload</button>' +
    '<button type="button" class="btn-premium btn-premium-secondary" onclick="my1rpHideForm()">' +
    '<i class="fas fa-times me-1"></i> Cancel</button>' +
    "</div>" +
    '<div class="form-hint mt-2">Payload is prepared and printed to the console (no server send).</div>' +
    "</div></div>"
  );
}

function my1rpSyncOkBtn() {
  var btn = document.getElementById("my1rpOkBtn");
  if (!btn) return;
  var has = my1rpRecs.length > 0;
  btn.disabled = !has;
  btn.style.opacity = has ? "1" : "0.5";
  btn.style.cursor = has ? "pointer" : "not-allowed";
}

function my1rpResolveCallback(v) {
  if (typeof v === "function") return v;
  if (typeof v !== "string" || !v.trim()) return null;
  var s = v.trim().replace(/^window\?*\./, "");
  if (typeof window[s] === "function") return window[s];
  var i = s.lastIndexOf(".");
  if (i > -1) {
    var tail = s.slice(i + 1);
    if (typeof window[tail] === "function") return window[tail];
  }
  return null;
}

window.my1rpOkAndClose = function () {
  if (!my1rpRecs.length || !my1rpModalInstance) return;
  try {
    var list = [];
    for (var li = 0; li < my1rpRecs.length; li++) {
      var src = my1rpRecs[li];
      var clean = {};
      for (var lk in src) {
        if (!Object.prototype.hasOwnProperty.call(src, lk)) continue;
        if (lk === "uid" || lk === "pname") continue;
        clean[lk] = src[lk];
      }
      list.push(clean);
    }
    var fn = my1rpResolveCallback(my1rpOnOk);
    if (fn) {
      fn(list);
    } else {
      console.warn("my1rp: OK callback not found", my1rpOnOk);
    }
  } catch (e) {
    console.error("my1rp OK callback error:", e);
  }
  my1rpModalInstance.hide();
};

function my1rpRenderList(searchTerm) {
  var cont = document.getElementById("my1rpCards");
  if (!cont) return;
  my1rpSyncOkBtn();
  var raw = (searchTerm || "").trim().toLowerCase();
  var fd = my1rpRecs.slice();
  if (raw) {
    fd = fd.filter(function (rec) {
      return (
        (rec.e && String(rec.e).toLowerCase().includes(raw)) ||
        (rec.g != null && String(rec.g).includes(raw)) ||
        (rec.h != null && String(rec.h).includes(raw)) ||
        (rec.j != null && String(rec.j).includes(raw)) ||
        (rec.k && String(rec.k).toLowerCase().includes(raw))
      );
    });
  }
  cont.innerHTML = "";
  if (!fd.length) {
    cont.innerHTML =
      '<div class="text-center py-4" style="color:#adb5bd;">' +
      '<i class="fas fa-file-invoice-dollar mb-2 d-block" style="font-size:36px;"></i>No receipts / payments found</div>';
    return;
  }
  for (var i = 0; i < fd.length; i++) {
    var rec = fd[i];
    var fEmpty = rec.f === "" || rec.f == null;
    var typeBadge;
    if (fEmpty) {
      typeBadge =
        '<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;letter-spacing:.3px;background:#6c757d;color:#fff;">—</span>';
    } else {
      var isPay = my1rpTypeOf(rec) === 1;
      typeBadge =
        '<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;letter-spacing:.3px;' +
        (isPay
          ? "background:#f0b429;color:#fff;"
          : "background:#2e9e6b;color:#fff;") +
        ';"><i class="fas ' +
        (isPay ? "fa-arrow-up" : "fa-arrow-down") +
        '"></i>' +
        (isPay ? "Payment" : "Received") +
        "</span>";
    }
    var nBadge =
      rec.n != null && Number(rec.n) > 0
        ? '<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;letter-spacing:.3px;background:var(--ember,#c0392b);color:#fff;" title="Constraint no."><i class="fas fa-hashtag"></i>×' +
          rec.n +
          "</span>"
        : "";

    var recId = my1rpRecId(rec);
    var card = document.createElement("div");
    card.className = "col-12 mb-2";
    card.innerHTML =
      '<div class="card-premium" style="background:#fff;border:1px solid #6c757d;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.06);">' +
      '<div class="card-body p-3">' +
      '<div class="d-flex align-items-center gap-2 mb-2 flex-wrap">' +
      '<span class="badge" style="background:var(--ember,#c0392b);color:#fff;font-weight:700;">' +
      "#" +
      my1rpEsc(rec.e || rec.a) +
      "</span>" +
      typeBadge +
      nBadge +
      '<span class="fw-semibold ms-auto" style="color:var(--ember,#c0392b);font-size:16px;">₹' +
      my1rpEsc(rec.j == null ? "0" : rec.j) +
      "</span></div>" +
      '<div style="color:#343a40;font-size:13.5px;">' +
      '<div class="d-flex gap-3 flex-wrap">' +
      (rec.g != null && Number(rec.g) !== 0
        ? '<div><i class="fas fa-user-tie me-1" style="color:var(--gold,#c9a451);width:16px;"></i>Cashier: <b>' +
          my1rpEsc(my1rpCashierLabel(rec.g)) +
          "</b></div>"
        : "") +
      '<div><i class="fas fa-user me-1" style="color:var(--gold,#c9a451);width:16px;"></i>Party: <b>' +
      my1rpEsc(rec.pname || my1rpPartyLabel(rec.h)) +
      "</b> <span style=\"color:#adb5bd;\">(#" +
      my1rpEsc(rec.h == null ? "" : rec.h) +
      ")</span></div>" +
      "</div>" +
      '<div class="mt-1 d-flex gap-3 flex-wrap" style="color:#6c757d;">' +
      (rec.k ? '<span><i class="far fa-calendar me-1"></i>' + my1rpEsc(rec.k) + "</span>" : "") +
      (rec.m ? '<span><i class="far fa-clock me-1"></i>' + my1rpEsc(rec.m) + "</span>" : "") +
      '<span><i class="fas fa-credit-card me-1"></i>' +
      my1rpEsc(my1rpModeLabel(rec.i)) +
      "</span>" +
      (rec.l && rec.l.td
        ? '<span><i class="fas fa-hashtag me-1"></i>Txn: ' + my1rpEsc(rec.l.td) + "</span>"
        : "") +
      (rec.o
        ? '<span><i class="fas fa-circle-notch me-1"></i>Round off: ' + my1rpEsc(rec.o) + "</span>"
        : "") +
      "</div>" +
      "</div>" +
      '<div class="d-flex gap-2 mt-2">' +
      '<button class="btn-premium btn-premium-sm my1rp-edit" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:600;line-height:1.2;border:none;border-radius:8px;cursor:pointer;white-space:nowrap;font-size:12px;padding:5px 14px;background:linear-gradient(135deg,var(--ember,#c0392b),#7a1f14);color:#fff;" data-id="' +
      recId +
      '"><i class="fas fa-edit"></i> Edit</button>' +
      '<button class="btn-premium btn-premium-sm my1rp-del" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:600;line-height:1.2;border:none;border-radius:8px;cursor:pointer;white-space:nowrap;font-size:12px;padding:5px 14px;background:linear-gradient(135deg,#e35d6a,#dc3545);color:#fff;" data-id="' +
      recId +
      '"><i class="fas fa-trash"></i> Delete</button>' +
      "</div>" +
      "</div></div>";
    cont.appendChild(card);
  }

  var editBtns = cont.querySelectorAll(".my1rp-edit");
  for (var ei = 0; ei < editBtns.length; ei++) {
    editBtns[ei].addEventListener("click", function (e) {
      e.stopPropagation();
      var id = this.getAttribute("data-id");
      var rec = null;
      for (var ri = 0; ri < my1rpRecs.length; ri++) {
        if (my1rpRecId(my1rpRecs[ri]) === id) {
          rec = my1rpRecs[ri];
          break;
        }
      }
      if (rec) window.my1rpShowForm(rec);
    });
  }
  var delBtns = cont.querySelectorAll(".my1rp-del");
  for (var di = 0; di < delBtns.length; di++) {
    delBtns[di].addEventListener("click", function (e) {
      e.stopPropagation();
      window.my1rpDoDelete(this.getAttribute("data-id"));
    });
  }
}

function my1rpRenderCards() {
  var se = document.getElementById("my1rpSearch");
  my1rpRenderList(se ? se.value : "");
}

/* ---- entry ---- */

function open_my1rp(rpCfg, cashiers, functionNameIStoRun, existingRParray, allexistingRParray, partyData) {
  my1rpCfg = rpCfg || {};
  my1rpEditingRec = null;
  my1rpPartyName = "";

  if (Array.isArray(cashiers)) {
    my1rpCashIds = cashiers.slice();
  } else {
    try {
      my1rpCashIds = (
        window[my1uzr.worknOnPg]?.clientConfig?.cashiers || []
      ).slice();
    } catch (e) {
      my1rpCashIds = [];
    }
  }

  var loadPromise = (async function () {
    if (Array.isArray(allexistingRParray)) {
      my1rpAllRecs = allexistingRParray.slice();
    } else {
      try {
        var allRows = await dbDexieManager.getAllRecords(dbnm, "r");
        my1rpAllRecs = Array.isArray(allRows) ? allRows : [];
      } catch (e) {
        my1rpAllRecs = [];
      }
    }
    if (Array.isArray(existingRParray)) {
      my1rpRecs = existingRParray.slice();
    } else {
      my1rpRecs = [];
    }
    try {
      var cRows = await dbDexieManager.getAllRecords(dbnm, "c");
      my1rpCRecs = Array.isArray(cRows) ? cRows : [];
    } catch (e) {
      my1rpCRecs = [];
    }
    for (var ur = 0; ur < my1rpRecs.length; ur++) {
      if (my1rpRecId(my1rpRecs[ur]) === null) {
        my1rpRecs[ur].uid = my1rpNextUid();
      }
    }
    my1rpRecs.sort(function (a, b) {
      return (Number(b.a) || 0) - (Number(a.a) || 0);
    });
    my1rpRecomputeAllN();
  })();

  loadPromise
    .then(function () {
      var mid =
        "my1rpModal_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substr(2, 9);
      var mr = create_modal_dynamically(mid),
        modal = mr.modalElement,
        mc = mr.contentElement;
      my1rpModalId = mid;
      my1rpModalInstance = mr.modalInstance;
      my1rpOnOk = functionNameIStoRun || null;

      var md = modal.querySelector(".modal-dialog");
      if (md) {
        md.classList.remove("modal-dialog-centered", "modal-dialog-scrollable");
        md.style.marginTop = "50px";
        md.style.maxWidth = "680px";
        md.style.height = "calc(100vh - 100px)";
        md.style.maxHeight = "calc(100vh - 100px)";
        md.style.display = "flex";
        md.style.flexDirection = "column";

        var oc = mc.parentElement;
        oc.style.height = "100%";
        oc.style.display = "flex";
        oc.style.flexDirection = "column";
        oc.style.minHeight = "0";

        mc.style.height = "100%";
        mc.style.maxHeight = "none";
        mc.style.flex = "1";
        mc.style.minHeight = "0";
        mc.style.overflow = "hidden";
      }
      mc.className = "modal-content h-100 d-flex flex-column";
      mc.innerHTML =
        "<div style='display:flex;flex-direction:column;height:100%;overflow:hidden;'>" +
        '<!-- ========== HEADER ========== -->' +
        '<div style="flex-shrink:0;padding:14px 20px;border-bottom:3px solid var(--gold,#c9a451);position:relative;background:linear-gradient(135deg,#7a1f14,var(--ember,#c0392b));">' +
        '<div class="d-flex align-items-center gap-3 w-100" style="padding-right:34px;flex-wrap:wrap;">' +
        '<h5 class="modal-title fw-bold" style="color:#fff;font-size:17px;white-space:nowrap;">' +
        '<i class="fas fa-money-bill-wave me-2" style="color:var(--gold,#c9a451);"></i>Receipts / Payments</h5>' +
        '<div class="d-flex gap-2" style="flex:1 1 320px;min-width:230px;">' +
        '<button type="button" class="btn-premium btn-premium-primary btn-premium-sm" style="flex-shrink:0;background:linear-gradient(135deg,var(--gold,#c9a451),#a97e2f);color:#fff;border:none;border-radius:8px;padding:7px 14px;font-weight:600;" onclick="my1rpShowForm(null)">' +
        '<i class="fas fa-plus"></i> Add</button>' +
        '<input type="text" class="form-control-premium" id="my1rpSearch" placeholder="🔍 Search voucher, party, amount..." style="flex:1 1 auto;min-width:120px;border:2px solid #6c757d;border-radius:10px;padding:8px 12px;font-size:14px;" oninput="my1rpRenderCards()">' +
        "</div>" +
        '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" style="position:absolute;top:14px;right:18px;"></button>' +
        "</div></div>" +
        '<!-- ========== BODY ========== -->' +
        '<div class="modal-body p-3" style="display:flex;flex-direction:column;overflow:hidden;flex:1;min-height:0;background:#f6f2e9;">' +
        my1rpRenderFormHTML() +
        '<div id="my1rpCards" style="flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;"></div>' +
        "</div>" +
        '<!-- ========== FOOTER ========== -->' +
        '<div class="modal-footer" style="flex-shrink:0;border-top:1px solid #dee2e6;border-bottom-left-radius:14px;border-bottom-right-radius:14px;padding:12px 20px;margin:0;background:#fff;display:flex;justify-content:flex-end;align-items:center;gap:10px;">' +
        '<button type="button" class="btn-premium btn-premium-primary" id="my1rpOkBtn" onclick="my1rpOkAndClose()" disabled style="display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:600;line-height:1.2;border:none;border-radius:8px;cursor:pointer;white-space:nowrap;font-size:14px;padding:9px 26px;background:linear-gradient(135deg,#7a1f14,var(--ember,#c0392b));color:#fff;opacity:.5;">OK</button>' +
        "</div>" +
        "</div>";

      mr.modalInstance.show();
      modal.style.zIndex = "99990";
      var modalBackdrops = document.querySelectorAll(
        ".modal-backdrop, .modal-backdrop.fade, .modal-backdrop.show"
      );
      for (var mbi = 0; mbi < modalBackdrops.length; mbi++) {
        modalBackdrops[mbi].style.zIndex = "99989";
      }
      modal.addEventListener("shown.bs.modal", function () {
        my1rpBringToFront();
        var s = document.getElementById("my1rpSearch");
        if (s) s.focus();
      });
      modal.addEventListener("hidden.bs.modal", function () {
        var mEl = document.getElementById(mid);
        if (mEl) mEl.remove();
        my1rpModalId = null;
        my1rpModalInstance = null;
        my1rpOnOk = null;
      });

      my1rpRenderList("");
      my1rpInitPickers();
    })
    .catch(function (e) {
      console.error("my1rp render error:", e);
      if (typeof window.showelsemodal === "function") {
        window.showelsemodal(
          "Info",
          "❌ " + (e && e.message ? e.message : e),
          false
        );
      }
    });
}

window.open_my1rp = open_my1rp;

console.log("🧾 my1rp.js loaded");