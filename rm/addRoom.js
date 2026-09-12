// addRoom.js - HT Royal Stay Add Room (admin)
// Single scrollable, mobile-responsive form. Sections are dropdown
// pickers with "+Add" and one final Add Room button.

// ════════════════════════════════════════════════════════════════════
//  ADMIN CONSTANTS  (edit ids / prices / labels to match server master)
// ════════════════════════════════════════════════════════════════════

const imgObjDimensRqd = ["1920x1080px~1-250kb", "320x180px~2-64kb"];

// Room constants (htRoomTypes, htRoomBeds, htRoomStatus, htRoomAmenities,
// htRoomFacilities, htRoomRules, htRoomPackages,
// htRoomAddons) now live in modules/cfgMt.js — single shared source.

window.pendingImageSlot = -1;

window.openImagePicker = function (slot) {
  if (slot < 0) {
    for (var i = 0; i < 5; i++) {
      if (!addRoomState.images[i]) {
        slot = i;
        break;
      }
    }
  }
  if (slot < 0 || slot > 4) return;
  window.pendingImageSlot = slot;
  (async function () {
    await loadExe2Fn(35, [window.afterimagesetcallrun, imgObjDimensRqd], [1]);
  })();
};

window.afterimagesetcallrun = function (obj_imgssss) {
  const imageAdd = obj_imgssss;
  var display = (imageAdd && (imageAdd.g1 || imageAdd.url)) || "";
  if (!display || window.pendingImageSlot < 0) return;
  var slot = window.pendingImageSlot;
  window.pendingImageSlot = -1;
  addRoomState.images[slot] = {
    g1: display,
    g2: (imageAdd && imageAdd.g2) || display,
  };
  renderImageSection();
  showMessageModal("Info", "✓ Image added!", false);
};

// ════════════════════════════════════════════════════════════════════
//  IMAGE SOURCE — via the my1img picker (modules/my1img.js).
//  afterimagesetcallrun(obj) receives {url, g1, g2, ...}; the chosen
//  display URL (g1) and thumbnail URL (g2) are stored per slot in
//  addRoomState.images[slot] as {g1, g2} and used for hero (f) and
//  gallery (g) in the publish payload.
// ════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════
//  DRAFT STATE
// ════════════════════════════════════════════════════════════════════
function freshAddRoomState() {
  return {
    roomNumber: "",
    name: "",
    tagline: "",
    rate: "",
    dimensions: "",
    hasAc: false,
    acRate: "",
    weekDays: htWeekendDays(),
    weekRates: {},
    roomType: 1,
    status: 1,
    beds: [],
    adults: 2,
    children: 1,
    freeAge: 8,
    description: "",
    images: ["", "", "", "", ""],
    facilities: [],
    amenities: [],
    rules: [],
    packages: [],
    addons: [],
    editId: null,
  };
}
var addRoomState = freshAddRoomState();

// ════════════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════════════
function getById(list, id) {
  for (var i = 0; i < list.length; i++) {
    if (String(list[i].id) === String(id)) return list[i];
  }
  return null;
}

var HT_WEEKDAY_NAMES = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

// Weekend/day-with-special-rates list from rm.da `xtr_chrgs_weekDa`.
// JS getDay(): 0=Sun..6=Sat. Returns [] when not configured.
function htWeekendDays() {
  try {
    var cfg =
      typeof window !== "undefined" &&
      typeof my1uzr !== "undefined" &&
      my1uzr &&
      window[my1uzr.worknOnPg] &&
      window[my1uzr.worknOnPg].clientConfig;
    cfg = cfg || {};
    var list = cfg.xtr_chrgs_weekDa;
    if (!Array.isArray(list)) return [];
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var d = parseInt(list[i]);
      if (d >= 0 && d <= 6 && out.indexOf(d) < 0) out.push(d);
    }
    return out;
  } catch (e) {
    return [];
  }
}

function htWeekdayName(day) {
  return HT_WEEKDAY_NAMES[day] || "Day " + day;
}

function getNextRoomNumber() {
  var max = 100;
  for (var i = 0; i < adminRoomRecords.length; i++) {
    var r = adminRoomRecords[i];
    var v = parseInt(r.e) || parseInt(r.a) || 0;
    if (v > max) max = v;
  }
  return max + 1;
}

function getNextRmId() {
  var cfg = window[my1uzr.worknOnPg].clientConfig || {};
  var rooms = cfg.rm || [];
  var maxId = 0;
  for (var i = 0; i < rooms.length; i++) {
    var n = parseInt(rooms[i].a) || 0;
    if (n > maxId) maxId = n;
  }
  return maxId + 1;
}

function sectionHead(num, icon, title, sub) {
  return (
    '<div class="d-flex align-items-center gap-2 mb-3 flex-wrap">' +
    '<span class="badge-premium badge-premium-gold">' +
    num +
    "</span>" +
    '<i class="fas ' +
    icon +
    ' text-gold" style="font-size:15px;"></i>' +
    '<span class="fw-bold text-emr-dark" style="font-size:15px;">' +
    title +
    "</span>" +
    (sub ? '<span class="text-gray text-sm">' + escHtml(sub) + "</span>" : "") +
    "</div>"
  );
}

function formGroup(label, type, id, value, extra) {
  return (
    '<div class="form-group-premium">' +
    '<label class="form-label-premium">' +
    label +
    "</label>" +
    '<input type="' +
    type +
    '" id="' +
    id +
    '" class="form-control-premium" value="' +
    escAttr(value === undefined || value === null ? "" : value) +
    '" ' +
    extra +
    "></div>"
  );
}

function selectGroup(label, id, list, textKey, selected) {
  var opts = "";
  for (var i = 0; i < list.length; i++) {
    opts +=
      '<option value="' +
      list[i].id +
      '"' +
      (String(selected) === String(list[i].id) ? " selected" : "") +
      ">" +
      escHtml(list[i][textKey]) +
      "</option>";
  }
  return (
    '<div class="form-group-premium">' +
    '<label class="form-label-premium">' +
    label +
    '</label><select id="' +
    id +
    '" class="form-select-premium">' +
    opts +
    "</select></div>"
  );
}

function acControlGroup() {
  return (
    '<div class="form-group-premium">' +
    '<label class="form-label-premium">AC</label>' +
    '<div class="ht-ac-wrap">' +
    '<label class="ht-ac-check">' +
    '<input type="checkbox" id="arHasAc"' +
    (addRoomState.hasAc ? " checked" : "") +
    ' onchange="toggleArAc()">' +
    '<span>Room has AC</span>' +
    "</label>" +
    '<input type="text" id="arAcRate" class="form-control-premium ht-ac-rate"' +
    (addRoomState.hasAc ? "" : ' style="display:none;"') +
    ' value="' +
    escAttr(addRoomState.acRate || "") +
    '" oninput="updateRoomAbout()" min="0" step="0.01" placeholder="AC ₹">' +
    "</div></div>"
  );
}

window.toggleArAc = function () {
  var box = document.getElementById("arHasAc");
  var inp = document.getElementById("arAcRate");
  if (!box) return;
  var on = box.checked;
  if (inp) inp.style.display = on ? "" : "none";
  var days = addRoomState.weekDays || [];
  for (var i = 0; i < days.length; i++) {
    var ac = document.getElementById("arWk" + days[i] + "Ac");
    if (ac) ac.style.display = on ? "" : "none";
  }
  updateRoomAbout();
};

function weekRateSection() {
  var days = addRoomState.weekDays || [];
  if (days.length === 0) return "";
  var html = '<div class="ht-wk-row ht-occ-row mb-0">';
  for (var i = 0; i < days.length; i++) {
    var day = days[i];
    var r = addRoomState.weekRates[day] || {};
    html +=
      '<div class="ht-wk-day form-group-premium">' +
      '<label class="form-label-premium">' +
      escHtml(htWeekdayName(day)) +
      "</label>" +
      '<div class="ht-wk-pair">' +
      formGroup(
        "Normal rate",
        "text",
        "arWk" + day + "Norm",
        r.a != null ? r.a : "",
        'oninput="updateRoomAbout()" min="0" step="0.01" placeholder="Normal ₹"',
      ) +
      '<input type="text" id="arWk' +
      day +
      'Ac" class="form-control-premium ht-wk-ac"' +
      (addRoomState.hasAc ? "" : ' style="display:none;"') +
      ' value="' +
      escAttr(r.b != null ? r.b : "") +
      '" oninput="updateRoomAbout()" min="0" step="0.01" placeholder="AC ₹">' +
      "</div>" +
      "</div>";
  }
  html += "</div>";
  return html;
}

function checkChip(it, set, iconKey) {
  var on = addRoomState[set].indexOf(it.id) >= 0;
  return (
    '<label class="ht-check-chip">' +
    '<input type="checkbox" value="' +
    it.id +
    '" data-arset="' +
    set +
    '"' +
    (on ? " checked" : "") +
    ">" +
    '<span class="ck-ico"><i class="fas ' +
    (it[iconKey] || "fa-check") +
    '"></i></span>' +
    '<span class="ck-lbl">' +
    escHtml(it.label) +
    "</span></label>"
  );
}

function chip(icon, text) {
  return (
    '<span class="ht-chip"><i class="fas ' +
    icon +
    '"></i>' +
    escHtml(text) +
    "</span>"
  );
}

// ════════════════════════════════════════════════════════════════════
//  SECTIONS
// ════════════════════════════════════════════════════════════════════
function thumbSlot(i) {
  var img = addRoomState.images[i];
  var src = htImgSrc((img && img.g1) || "", false);
  return (
    '<div class="col-6 col-md-4 col-lg text-center mb-2">' +
    '<div class="ht-thumb' +
    (i === 0 ? " active" : "") +
    '" onclick="openImagePicker(' +
    i +
    ')">' +
    '<img alt="img' +
    i +
    '" src="' +
    escAttr(src) +
    '">' +
    '<span class="thumb-badge">' +
    (i === 0 ? "Hero" : "img" + i) +
    "</span>" +
    '<span class="thumb-act" title="Remove" onclick="event.stopPropagation();removeImg(' +
    i +
    ')"><i class="fas fa-times"></i></span>' +
    (i !== 0
      ? '<span class="thumb-hero" title="Set as main photo" onclick="event.stopPropagation();setAddRoomHero(' +
        i +
        ')"><i class="fas fa-star"></i></span>'
      : "") +
    "</div>" +
    "</div>"
  );
}

function addSlot() {
  return (
    '<div class="col-6 col-md-4 col-lg text-center mb-2">' +
    '<button type="button" class="ht-thumb ht-add-tile" onclick="openImagePicker(-1)">' +
    '<i class="fas fa-plus"></i><small>Add image</small></button>' +
    "</div>"
  );
}

function heroSection() {
  var hero = htImgSrc(
    (addRoomState.images[0] && addRoomState.images[0].g1) || "",
    false,
  );
  var thumbs = "";
  var shown = 0;
  for (var i = 0; i < 5; i++) {
    if (addRoomState.images[i]) {
      thumbs += thumbSlot(i);
      shown++;
    }
  }
  if (shown < 5) thumbs += addSlot();
  return (
    '<div class="card-premium mx-3 mx-md-4 p-3 mb-3" id="htImagesCard">' +
    sectionHead(
      "1",
      "fa-images",
      "Hero Images",
      "Main photo + gallery thumbnails",
    ) +
    '<div class="ht-hero-main mb-2">' +
    (hero
      ? '<img id="gHero" alt="hero" src="' + escAttr(hero) + '">'
      : '<button type="button" class="ht-add-main" onclick="openImagePicker(0)">' +
        '<i class="fas fa-plus"></i><small>Add main photo</small></button>') +
    "</div>" +
    '<div class="text-sm text-gray mb-2"><i class="fas fa-info-circle me-1 text-emr"></i>Tap a photo to replace it. Star = main photo, × = remove.</div>' +
    '<div class="row g-2">' +
    thumbs +
    "</div>" +
    "</div>"
  );
}

function renderImageSection() {
  var el = document.getElementById("htImagesCard");
  if (el) el.outerHTML = heroSection();
}

// ════════════════════════════════════════════════════════════════════
//  DROPDOWN / COMBOBOX HELPERS  (multi-select with "+Add")
// ════════════════════════════════════════════════════════════════════
function nextId(list) {
  var m = 0;
  for (var i = 0; i < list.length; i++) if (list[i].id > m) m = list[i].id;
  return m + 1;
}

function ddToggle(num, icon, label, key) {
  return (
    '<button type="button" class="ht-dd-toggle" onclick="toggleDD(\'' +
    key +
    "')\">" +
    '<span class="badge-premium badge-premium-gold">' +
    num +
    "</span>" +
    '<i class="fas ' +
    icon +
    ' ht-dd-ico"></i>' +
    '<span class="ht-dd-lbl">' +
    label +
    "</span>" +
    '<span class="ht-dd-count" id="arDDCount_' +
    key +
    '"></span>' +
    '<i class="fas fa-chevron-down ht-dd-arrow"></i></button>'
  );
}

function ddPanel(key, bodyHtml) {
  return (
    '<div class="ht-dd-panel" id="arDDPanel_' +
    key +
    '" style="display:none;">' +
    bodyHtml +
    "</div>"
  );
}

window.toggleDD = function (key) {
  var panel = document.getElementById("arDDPanel_" + key);
  if (!panel) return;
  if (panel.style.display !== "none") {
    panel.style.display = "none";
    window._openDD = null;
    return;
  }
  if (window._openDD && window._openDD !== key) {
    var other = document.getElementById("arDDPanel_" + window._openDD);
    if (other) other.style.display = "none";
  }
  window._openDD = key;
  panel.style.display = "";
  refreshDDCount(key);
};

document.addEventListener("click", function (e) {
  var t = e && e.target;
  if (!t || !t.closest) return;
  if (
    t.closest(".ht-dd") ||
    t.closest(".ht-combo") ||
    t.closest(".ht-type-list")
  )
    return;
  var panels = document.querySelectorAll(".ht-dd-panel");
  for (var i = 0; i < panels.length; i++) panels[i].style.display = "none";
  var list = document.getElementById("arRoomTypeList");
  if (list) list.style.display = "none";
  window._openDD = null;
});

function ddItem(it, set, iconKey) {
  var on = addRoomState[set].indexOf(it.id) >= 0;
  return (
    '<label class="ht-dd-item">' +
    '<input type="checkbox" value="' +
    it.id +
    '" data-arset="' +
    set +
    '"' +
    (on ? " checked" : "") +
    " onchange=\"refreshDDCount('" +
    set +
    "')\">" +
    '<span class="ck-ico"><i class="fas ' +
    (it[iconKey] || "fa-check") +
    '"></i></span>' +
    "<span>" +
    escHtml(it.label) +
    "</span></label>"
  );
}

function ddChecks(list, set, iconKey) {
  var out = "";
  for (var i = 0; i < list.length; i++) out += ddItem(list[i], set, iconKey);
  return out;
}

function ddSelectAll(key) {
  return (
    '<label class="ht-dd-auto">' +
    '<input type="checkbox" data-arset-all="' +
    key +
    '" onchange="toggleSelectAll(\'' +
    key +
    "')\">" +
    '<i class="fas fa-check-double"></i> Select All</label>'
  );
}

function ddAddRow(onAdd, placeholder, key) {
  return (
    '<div class="ht-dd-add">' +
    '<input type="text" id="arAddInput_' +
    key +
    '" class="form-control-premium" placeholder="' +
    placeholder +
    '" maxlength="60">' +
    '<button type="button" class="btn-premium btn-premium-secondary btn-premium-sm" onclick="' +
    onAdd +
    '"><i class="fas fa-plus me-1"></i>Add</button>' +
    "</div>"
  );
}

function ddSection(num, icon, label, key, listHtml, addHtml) {
  return (
    '<div class="card-premium mx-3 mx-md-4 p-3 mb-3">' +
    '<div class="ht-dd">' +
    ddToggle(num, icon, label, key) +
    ddPanel(
      key,
      ddSelectAll(key) +
        '<div class="ht-dd-list">' +
        listHtml +
        "</div>" +
        (addHtml || ""),
    ) +
    "</div>" +
    '<div class="ht-dd-chips mt-2" id="arDDChips_' +
    key +
    '"></div>' +
    "</div>"
  );
}

function ddChip(label) {
  return (
    '<span class="ht-chip"><i class="fas fa-check me-1"></i>' +
    escHtml(label) +
    "</span>"
  );
}

function renderDDChips(key, ids) {
  var wrap = document.getElementById("arDDChips_" + key);
  if (!wrap) return;
  var list = null;
  if (key === "facilities") list = htRoomFacilities;
  else if (key === "amenities") list = htRoomAmenities;
  else if (key === "addons") list = htRoomAddons;
  if (!list) return;
  var h = "";
  for (var i = 0; i < ids.length; i++) {
    var it = htGetById(list, ids[i]);
    if (it) h += ddChip(it.label || it.name);
  }
  wrap.innerHTML = h;
}

function renderBedChips() {
  var wrap = document.getElementById("arDDChips_beds");
  if (!wrap) return;
  var h = "";
  var ids = addRoomState.beds || [];
  for (var i = 0; i < ids.length; i++) {
    var b = htGetById(htRoomBeds, ids[i]);
    if (b) h += ddChip(b.label);
  }
  wrap.innerHTML = h;
}

function refreshRulesCount() {
  var n = document.querySelectorAll('input[data-arset="rules"]:checked').length;
  var c = document.getElementById("arDDCount_rules");
  if (c) c.textContent = n ? String(n) : "";
  var wrap = document.getElementById("arDDChips_rules");
  if (wrap) {
    var h = "";
    var rs = addRoomState.rules || [];
    for (var i = 0; i < rs.length; i++) {
      var r = htGetById(htRoomRules, rs[i]);
      if (r) h += ddChip(r.label);
    }
    wrap.innerHTML = h;
  }
}

window.toggleSelectAll = function (key) {
  var master = document.querySelector('input[data-arset-all="' + key + '"]');
  if (!master) return;
  var items = document.querySelectorAll('input[data-arset="' + key + '"]');
  for (var i = 0; i < items.length; i++) items[i].checked = master.checked;
  refreshDDCount(key);
};

window.refreshDDCount = function (key) {
  var nodes = document.querySelectorAll(
    'input[data-arset="' + key + '"]:checked',
  );
  var ids = [];
  for (var i = 0; i < nodes.length; i++) ids.push(parseInt(nodes[i].value));
  addRoomState[key] = ids;
  var all = document.querySelectorAll('input[data-arset="' + key + '"]');
  var master = document.querySelector('input[data-arset-all="' + key + '"]');
  if (master) master.checked = all.length > 0 && ids.length === all.length;
  if (key === "rules") {
    refreshRulesCount();
  } else {
    var c = document.getElementById("arDDCount_" + key);
    if (c) c.textContent = ids.length ? String(ids.length) : "";
    renderDDChips(key, ids);
    if (key === "beds") renderBedChips();
  }
  updateRoomChips();
};

function addSimple(list, set, iconKey, inputId) {
  var inp = document.getElementById(inputId);
  var v = inp ? inp.value.trim() : "";
  if (!v) return;
  var id = nextId(list);
  list.push({ id: id, icon: iconKey, label: v });
  var wrap = document.getElementById("arList_" + set);
  if (wrap) wrap.innerHTML = ddChecks(list, set, iconKey);
  addRoomState[set].push(id);
  var cb = document.querySelector(
    'input[data-arset="' + set + '"][value="' + id + '"]',
  );
  if (cb) cb.checked = true;
  refreshDDCount(set);
}

window.addFacility = function () {
  addSimple(
    htRoomFacilities,
    "facilities",
    "fa-broom",
    "arAddInput_facilities",
  );
};
window.addAmenity = function () {
  addSimple(
    htRoomAmenities,
    "amenities",
    "fa-check-circle",
    "arAddInput_amenities",
  );
};
window.addRule = function () {
  addSimple(htRoomRules, "rules", "fa-gavel", "arAddInput_rules");
};

function addonChecks() {
  var out = "";
  for (var i = 0; i < htRoomAddons.length; i++) {
    var ad = htRoomAddons[i];
    var on = addRoomState.addons.indexOf(ad.id) >= 0;
    var priceTxt =
      "₹" +
      ad.price +
      (ad.unit === "perNight"
        ? "<small>/night</small>"
        : "<small>/stay</small>");
    out +=
      '<label class="ht-dd-item ht-dd-item-price">' +
      '<input type="checkbox" value="' +
      ad.id +
      '" data-arset="addons"' +
      (on ? " checked" : "") +
      " onchange=\"refreshDDCount('addons')\">" +
      '<span class="ck-ico"><i class="fas ' +
      ad.icon +
      '"></i></span>' +
      "<span>" +
      escHtml(ad.name) +
      "</span>" +
      '<span class="ht-dd-price">' +
      priceTxt +
      "</span></label>";
  }
  return out;
}

window.addCustomAddon = function () {
  var nm = document.getElementById("arAddAddonName");
  var pr = document.getElementById("arAddAddonPrice");
  var name = nm ? nm.value.trim() : "";
  var price = parseFloat(pr ? pr.value : "") || 0;
  if (!name) return;
  var id = nextId(htRoomAddons);
  htRoomAddons.push({
    id: id,
    icon: "fa-plus-circle",
    name: name,
    desc: "Custom add-on",
    price: price,
    unit: "flat",
  });
  var wrap = document.getElementById("arList_addons");
  if (wrap) wrap.innerHTML = addonChecks();
  addRoomState.addons.push(id);
  var cb = document.querySelector(
    'input[data-arset="addons"][value="' + id + '"]',
  );
  if (cb) cb.checked = true;
  refreshDDCount("addons");
};

// ─── Room name combobox (type or type a custom name) ───
function roomNameCombo() {
  return (
    '<div class="form-group-premium ht-combo">' +
    '<label class="form-label-premium">Room name</label>' +
    '<div class="ht-combo-wrap">' +
    '<input type="text" id="arRoomName" class="form-control-premium" value="' +
    escAttr(addRoomState.name) +
    '" placeholder="Enter room name" autocomplete="off" oninput="onRoomNameInput()" onblur="commitRoomName()" onkeydown="roomNameKey(event)">' +
    '<button type="button" class="ht-combo-btn" tabindex="-1" onclick="toggleRoomTypeList()" title="Choose a room type"><i class="fas fa-chevron-down"></i></button>' +
    "</div>" +
    '<div class="ht-type-list" id="arRoomTypeList" style="display:none;"></div>' +
    "</div>"
  );
}

window.toggleRoomTypeList = function () {
  var box = document.getElementById("arRoomTypeList");
  if (!box) return;
  if (box.style.display !== "none") {
    box.style.display = "none";
    return;
  }
  var h = "";
  for (var i = 0; i < htRoomTypes.length; i++) {
    var t = htRoomTypes[i];
    h +=
      '<button type="button" class="ht-type-item' +
      (String(t.id) === String(addRoomState.roomType) ? " sel" : "") +
      '" onclick="pickRoomType(' +
      t.id +
      ')"><i class="fas fa-door-open"></i>' +
      escHtml(t.label) +
      " (" +
      escHtml(t.folder === "Non-AC" ? "Non-AC" : "AC") +
      ")</button>";
  }
  box.innerHTML = h;
  box.style.display = "";
};

window.pickRoomType = function (id) {
  var t = htGetById(htRoomTypes, id);
  if (!t) return;
  addRoomState.roomType = id;
  addRoomState.name = t.label;
  var inp = document.getElementById("arRoomName");
  if (inp) inp.value = t.label;
  var box = document.getElementById("arRoomTypeList");
  if (box) box.style.display = "none";
  updateRoomAbout();
};

window.onRoomNameInput = function () {
  var inp = document.getElementById("arRoomName");
  if (!inp) return;
  addRoomState.name = inp.value.trim();
  updateRoomAbout();
};

window.roomNameKey = function (ev) {
  if (!ev || ev.key !== "Enter") return;
  ev.preventDefault();
  var box = document.getElementById("arRoomTypeList");
  if (box) box.style.display = "none";
  commitRoomName();
};

window.commitRoomName = function () {
  var inp = document.getElementById("arRoomName");
  if (!inp) return;
  var box = document.getElementById("arRoomTypeList");
  if (box && box.style.display !== "none") {
    updateRoomAbout();
    return;
  }
  var v = inp.value.trim();
  if (!v) {
    updateRoomAbout();
    return;
  }
  for (var i = 0; i < htRoomTypes.length; i++) {
    if (String(htRoomTypes[i].label).toLowerCase() === v.toLowerCase()) {
      addRoomState.roomType = htRoomTypes[i].id;
      addRoomState.name = htRoomTypes[i].label;
      inp.value = htRoomTypes[i].label;
      updateRoomAbout();
      return;
    }
  }
  var id = nextId(htRoomTypes);
  htRoomTypes.push({ id: id, label: v });
  addRoomState.roomType = id;
  addRoomState.name = v;
  updateRoomAbout();
  updateRoomChips();
};

function bedTypeField() {
  var bedCount = (addRoomState.beds || []).length;
  return (
    '<div class="form-group-premium ht-dd">' +
    '<label class="form-label-premium">Bed Type</label>' +
    '<button type="button" class="ht-dd-toggle" onclick="toggleDD(\'beds\')">' +
    '<i class="fas fa-bed ht-dd-ico"></i>' +
    '<span class="ht-dd-lbl">Select beds</span>' +
    '<span class="ht-dd-count" id="arDDCount_beds">' +
    (bedCount ? String(bedCount) : "") +
    "</span>" +
    '<i class="fas fa-chevron-down ht-dd-arrow"></i></button>' +
    ddPanel(
      "beds",
      ddSelectAll("beds") +
        '<div class="ht-dd-list" id="arList_beds">' +
        ddChecks(htRoomBeds, "beds", "") +
        "</div>",
    ) +
    "</div>" +
    '<div class="ht-dd-chips mt-1" id="arDDChips_beds"></div>'
  );
}

function occRow() {
  return (
    '<div class="ht-occ-row">' +
    formGroup(
      "Max Adults",
      "number",
      "arMaxAdults",
      addRoomState.adults,
      'oninput="updateRoomChips()" min="0"',
    ) +
    formGroup(
      "Max Children",
      "number",
      "arMaxChildren",
      addRoomState.children,
      'oninput="updateRoomChips()" min="0"',
    ) +
    formGroup(
      "Free Age",
      "number",
      "arFreeAge",
      addRoomState.freeAge,
      'oninput="updateRoomChips()" min="0"',
    ) +
    "</div>"
  );
}

function aboutSection() {
  return (
    '<div class="card-premium mx-3 mx-md-4 p-3 mb-3">' +
    sectionHead(
      "2",
      "fa-door-open",
      "Room / About",
      "Room identity & description",
    ) +
    '<div class="ht-occ-row mb-0">' +
    formGroup(
      "Room Number",
      "text",
      "arRoomNumber",
      addRoomState.roomNumber,
      'oninput="updateRoomAbout()"',
    ) +
    selectGroup(
      "Status",
      "arStatus",
      htRoomStatus, // 1=available, 2=maintenance, 127=deleted
      "label",
      addRoomState.status,
    ) +
    formGroup(
      "Nightly Rate (₹)",
      "text",
      "arRate",
      addRoomState.rate,
      'oninput="updateRoomAbout()" min="0" step="0.01" placeholder="e.g. 5500"',
    ) +
    acControlGroup() +
    "</div>" +
    weekRateSection() +
    '<h2 class="fw-bold text-emr-dark mb-1" id="arNamePreview">' +
    escHtml(addRoomState.name || "Room Name") +
    "</h2>" +
    '<div class="text-gray mb-3" id="arTaglinePreview" style="font-size:13px;">' +
    escHtml(addRoomState.tagline || "Refined comfort at an honest price") +
    "</div>" +
    '<div class="form-row-premium mb-0">' +
    roomNameCombo() +
    formGroup(
      "Tagline",
      "text",
      "arTagline",
      addRoomState.tagline,
      'oninput="updateRoomAbout()" placeholder="e.g. Refined comfort"',
    ) +
    "</div>" +
    '<div class="form-row-premium mb-0">' +
    formGroup(
      "Dimensions",
      "text",
      "arDimensions",
      addRoomState.dimensions,
      'oninput="updateRoomAbout()" placeholder="e.g. 26 m²"',
    ) +
    "</div>" +
    bedTypeField() +
    occRow() +
    '<div class="form-group-premium">' +
    '<label class="form-label-premium">Description</label>' +
    '<textarea id="arDescription" class="form-control-premium" rows="4" placeholder="Room description...">' +
    escHtml(addRoomState.description) +
    "</textarea></div>" +
    '<div class="d-flex flex-wrap gap-2 mt-2" id="arChips"></div>' +
    "</div>"
  );
}

function facilitiesSection() {
  return ddSection(
    "3",
    "fa-broom",
    "Facilities",
    "facilities",
    '<div id="arList_facilities">' +
      ddChecks(htRoomFacilities, "facilities", "icon") +
      "</div>",
    ddAddRow("addFacility()", "Add a facility…", "facilities"),
  );
}

function amenitiesSection() {
  return ddSection(
    "4",
    "fa-check-circle",
    "Included Amenities",
    "amenities",
    '<div id="arList_amenities">' +
      ddChecks(htRoomAmenities, "amenities", "icon") +
      "</div>",
    ddAddRow("addAmenity()", "Add an amenity…", "amenities"),
  );
}

function rulesSection() {
  var body =
    '<div class="fw-semibold text-emr-dark text-sm mb-1"><i class="fas fa-gavel me-1 text-gold-dark"></i>Room Rules</div>' +
    '<div id="arList_rules">' +
    ddChecks(htRoomRules, "rules", "") +
    "</div>";
  return ddSection(
    "5",
    "fa-scroll",
    "Room Rules & Policies",
    "rules",
    body,
    ddAddRow("addRule()", "Add a rule or policy…", "rules"),
  );
}

function packagesSection() {
  var body = "";
  for (var i = 0; i < htRoomPackages.length; i++) {
    var pk = htRoomPackages[i];
    var on = addRoomState.packages.indexOf(pk.id) >= 0;
    var priceTxt =
      pk.price === 0
        ? "Included"
        : "₹" +
          pk.price +
          (pk.unit === "perNight" ? " <small>/night</small>" : "");
    body +=
      '<label class="ht-check-chip">' +
      '<input type="checkbox" value="' +
      pk.id +
      '" data-arset="packages"' +
      (on ? " checked" : "") +
      " onchange=\"refreshDDCount('packages')\">" +
      '<span class="ck-ico"><i class="fas fa-gem"></i></span>' +
      "<span>" +
      '<div class="ck-lbl">' +
      escHtml(pk.name) +
      '</div><div class="ck-sub">' +
      escHtml(pk.desc) +
      "</div></span>" +
      '<span class="ck-price">' +
      priceTxt +
      "</span></label>";
  }
  return (
    '<div class="card-premium mx-3 mx-md-4 p-3 mb-3">' +
    sectionHead(
      "6",
      "fa-boxes-stacked",
      "Choose Your Package",
      "Tick the packages this room offers",
    ) +
    '<div class="d-flex flex-wrap gap-2">' +
    body +
    "</div>" +
    '<div class="text-sm text-gray mt-2"><i class="fas fa-info-circle me-1 text-emr"></i>Selected packages are kept with the room config.</div>' +
    "</div>"
  );
}

function addonsSection() {
  return ddSection(
    "7",
    "fa-plus-circle",
    "Add-on Services",
    "addons",
    '<div id="arList_addons">' + addonChecks() + "</div>",
    '<div class="ht-dd-add">' +
      '<input type="text" id="arAddAddonName" class="form-control-premium" placeholder="Add-on name…" maxlength="60">' +
      '<input type="number" id="arAddAddonPrice" class="form-control-premium" placeholder="₹ price" min="0" style="max-width:110px;">' +
      '<button type="button" class="btn-premium btn-premium-secondary btn-premium-sm" onclick="addCustomAddon()"><i class="fas fa-plus me-1"></i>Add</button>' +
      "</div>",
  );
}

function publishBar() {
  var editing = !!addRoomState.editId;
  return (
    '<div class="mx-3 mx-md-4 mb-4 d-flex flex-column flex-sm-row gap-2">' +
    '<button id="arPublishBtn" class="btn-premium btn-premium-primary btn-premium-lg flex-fill" onclick="publishAddRoom()">' +
    '<i class="fas ' +
    (editing ? "fa-save" : "fa-rocket") +
    ' me-1"></i> ' +
    (editing ? "Update Room" : "Add Room") +
    "</button>" +
    '<button class="btn-premium btn-premium-secondary btn-premium-lg flex-fill" onclick="resetAddRoomForm()">' +
    '<i class="fas fa-undo me-1"></i> Reset</button></div>'
  );
}

// ════════════════════════════════════════════════════════════════════
//  PAGE RENDER
// ════════════════════════════════════════════════════════════════════
var ADDR_STYLES = `
#htContainer .card-premium{overflow:visible;}
.ht-check-chip{display:flex;align-items:center;gap:8px;border:1.5px solid var(--gray-bg);border-radius:10px;padding:8px 12px;cursor:pointer;background:var(--surface);transition:all .2s;}
.ht-check-chip:hover{border-color:var(--gold);}
.ht-check-chip input{position:absolute;opacity:0;pointer-events:none;}
.ht-check-chip:has(input:checked){border-color:var(--emr);background:var(--gold-bg);box-shadow:0 2px 8px rgba(201,164,92,.25);}
.ck-ico{width:28px;height:28px;border-radius:8px;background:var(--gold-bg);color:var(--gold-dark);display:flex;align-items:center;justify-content:center;font-size:12px;flex:0 0 auto;}
.ck-lbl{font-size:13px;font-weight:600;color:var(--ember-deep);}
.ck-sub{font-size:11px;color:var(--gray);}
.ck-price{margin-left:auto;font-size:13px;font-weight:700;color:var(--emr-bright);white-space:nowrap;}
.ck-price small{font-size:10px;color:var(--gray);}
.ht-chip{display:inline-flex;align-items:center;gap:6px;background:var(--gold-bg);border:1px solid rgba(201,164,92,.45);color:var(--ember-deep);font-size:12px;font-weight:600;padding:5px 10px;border-radius:20px;}
.ht-chip i{color:var(--gold-dark);font-size:11px;}
.ht-hero-main{position:relative;border-radius:14px;overflow:hidden;border:2px solid var(--gray-bg);background:var(--surface);aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;}
.ht-hero-main img{width:100%;height:100%;object-fit:cover;}
.ht-thumb{position:relative;border-radius:10px;overflow:hidden;border:2px solid var(--gray-bg);cursor:pointer;aspect-ratio:4/3;background:var(--surface);display:flex;align-items:center;justify-content:center;transition:all .2s;}
.ht-thumb img{width:100%;height:100%;object-fit:cover;}
.ht-thumb.active,.ht-thumb:hover{border-color:var(--gold);box-shadow:0 0 0 2px rgba(201,164,92,.35);}
.thumb-badge{position:absolute;top:5px;left:5px;background:rgba(87,22,12,.85);color:#fff;font-size:10px;padding:2px 7px;border-radius:6px;}
.thumb-act{position:absolute;top:5px;right:5px;width:20px;height:20px;border-radius:50%;background:rgba(31,27,21,.78);color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;z-index:2;}
.thumb-act:hover{background:var(--emr-bright);}
.thumb-hero{position:absolute;bottom:5px;right:5px;width:20px;height:20px;border-radius:50%;background:rgba(201,164,92,.92);color:#57160C;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;z-index:2;}
.thumb-hero:hover{background:var(--gold);}
.ht-add-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border:2px dashed var(--gray-bg);color:var(--gray);background:var(--surface);font-family:inherit;}
.ht-add-tile i{font-size:22px;color:var(--gold);}
.ht-add-tile small{font-size:11px;}
.ht-add-tile:hover{border-color:var(--gold);box-shadow:none;}
.ht-add-main{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border:none;background:var(--surface);color:var(--gray);cursor:pointer;width:100%;height:100%;font-family:inherit;}
.ht-add-main i{font-size:30px;color:var(--gold);}
.ht-add-main:hover{background:var(--gold-bg);}
.ht-ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:var(--gray-light);font-size:11px;background:var(--surface);}
.ht-ph i{font-size:22px;}
.ht-occ-row{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-md);}
.ht-occ-row .form-group-premium{margin-bottom:0;}
.ht-ac-wrap{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.ht-ac-check{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--brown);cursor:pointer;white-space:nowrap;}
.ht-ac-check input{accent-color:var(--gold);width:16px;height:16px;cursor:pointer;}
.ht-ac-rate{min-width:90px;}
.ht-wk-row{margin-top:var(--spacing-md);}
.ht-wk-day .ht-wk-pair{display:flex;gap:8px;flex-wrap:wrap;}
.ht-wk-day .ht-wk-pair .form-group-premium{flex:1;min-width:110px;}
.ht-wk-ac{flex:1;min-width:110px;}
.ht-dd{position:relative;}
.ht-dd-toggle{display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px;border:2px solid rgba(201,164,92,.45);border-radius:var(--radius-md);background:var(--surface);color:var(--ink);font-family:var(--font-family);font-size:var(--font-size-base);cursor:pointer;text-align:left;transition:all var(--transition-base);}
.ht-dd-toggle:hover{border-color:var(--gold);}
.ht-dd-toggle .ht-dd-lbl{flex:1;}
.ht-dd-ico{color:var(--gold-dark);font-size:14px;}
.ht-dd-count{background:var(--gold-bg);color:var(--ember-deep);font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;min-width:20px;text-align:center;}
.ht-dd-arrow{color:var(--gray);font-size:12px;}
.ht-dd-panel{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:60;background:var(--surface);border:2px solid var(--gray-bg);border-radius:var(--radius-md);box-shadow:0 8px 24px rgba(0,0,0,.14);max-height:300px;overflow:auto;padding:8px;}
.ht-dd-list{display:flex;flex-direction:column;gap:2px;}
.ht-dd-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:var(--ink);}
.ht-dd-item:hover{background:var(--gold-bg);}
.ht-dd-item input{position:absolute;opacity:0;pointer-events:none;}
.ht-dd-item:has(input:checked){background:var(--gold-bg);color:var(--ember-deep);font-weight:600;}
.ht-dd-item-price .ht-dd-price{margin-left:auto;font-size:12px;font-weight:700;color:var(--emr-bright);white-space:nowrap;}
.ht-dd-item-price .ht-dd-price small{font-size:10px;color:var(--gray);}
.ht-dd-add{display:flex;gap:8px;align-items:center;padding-top:8px;margin-top:8px;border-top:1px solid var(--gray-bg);}
.ht-dd-add input{flex:1;}
.ht-dd-add .btn-premium-sm{white-space:nowrap;}
.ht-dd-auto{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:12px;font-weight:600;color:var(--brown);cursor:pointer;}
.ht-dd-auto input{accent-color:var(--gold);}
.ht-dd-chips{display:flex;flex-wrap:wrap;gap:6px;}
.ht-combo{position:relative;}
.ht-combo-wrap{position:relative;}
.ht-combo .form-control-premium{padding-right:44px;}
.ht-combo-btn{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:32px;height:32px;border:none;background:var(--gold-bg);color:var(--gold-dark);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;}
.ht-combo-btn:hover{background:var(--gold);}
.ht-type-list{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:60;background:var(--surface);border:2px solid var(--gray-bg);border-radius:var(--radius-md);box-shadow:0 8px 24px rgba(0,0,0,.14);max-height:260px;overflow:auto;padding:6px;display:flex;flex-direction:column;gap:2px;}
.ht-type-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:9px 10px;border:none;border-radius:8px;background:transparent;color:var(--ink);font-family:var(--font-family);font-size:13px;cursor:pointer;}
.ht-type-item:hover{background:var(--gold-bg);}
.ht-type-item.sel{background:var(--gold-bg);color:var(--ember-deep);font-weight:600;}
.ht-type-item i{color:var(--gold-dark);width:16px;text-align:center;}
`;

window.showAddRoom = function () {
  setView("addRoom");
  var container = document.getElementById("htContainer");
  if (!container) return;
  if (!addRoomState.roomNumber) addRoomState.roomNumber = getNextRoomNumber();
  addRoomState.weekDays = htWeekendDays();

  var editing = !!addRoomState.editId;
  container.innerHTML =
    "<style>" +
    ADDR_STYLES +
    "</style>" +
    '<div class="ht-section-title">' +
    '<div class="bar"></div>' +
    (editing ? "<h5>Edit Room</h5>" : "<h5>Add Room</h5>") +
    (editing
      ? '<span class="sub">Update the room details below</span>'
      : '<span class="sub">Fill the details below and add a new room</span>') +
    "</div>" +
    heroSection() +
    aboutSection() +
    facilitiesSection() +
    amenitiesSection() +
    rulesSection() +
    (bpColHidden("cyp") ? "" : packagesSection()) +
    addonsSection() +
    publishBar();

  updateRoomChips();
  toggleArAc();
  refreshDDCount("beds");
  refreshDDCount("facilities");
  refreshDDCount("amenities");
  refreshDDCount("rules");
  refreshDDCount("addons");
};

// ════════════════════════════════════════════════════════════════════
//  LIVE PREVIEW / THUMBNAILS
// ════════════════════════════════════════════════════════════════════
window.updateThumb = function (n) {
  renderImageSection();
};

window.setAddRoomHero = function (n) {
  if (n < 1 || n > 4 || !addRoomState.images[n]) return;
  var t = addRoomState.images[0];
  addRoomState.images[0] = addRoomState.images[n];
  addRoomState.images[n] = t;
  renderImageSection();
};

window.removeImg = function (n) {
  addRoomState.images[n] = "";
  if (n === 0) {
    for (var i = 1; i < 5; i++) {
      if (addRoomState.images[i]) {
        addRoomState.images[0] = addRoomState.images[i];
        addRoomState.images[i] = "";
        break;
      }
    }
  }
  renderImageSection();
};

window.updateRoomAbout = function () {
  var nm = document.getElementById("arRoomName");
  var tg = document.getElementById("arTagline");
  var np = document.getElementById("arNamePreview");
  var tp = document.getElementById("arTaglinePreview");
  if (np) np.innerHTML = escHtml(nm ? nm.value || "Room Name" : "Room Name");
  if (tp)
    tp.innerHTML = escHtml(
      tg
        ? tg.value || "Refined comfort at an honest price"
        : "Refined comfort at an honest price",
    );
  updateRoomChips();
};

window.updateRoomChips = function () {
  var wrap = document.getElementById("arChips");
  if (!wrap) return;
  var g = function (id, def) {
    var el = document.getElementById(id);
    return el ? el.value : def;
  };
  var bedsTxt = "";
  var bedIds = addRoomState.beds || [];
  for (var i = 0; i < bedIds.length; i++) {
    var b = htGetById(htRoomBeds, bedIds[i]);
    if (b) bedsTxt += (bedsTxt ? " · " : "") + b.label;
  }
  var rate = g("arRate", addRoomState.rate);
  var acBox = document.getElementById("arHasAc");
  var hasAc = acBox ? acBox.checked : addRoomState.hasAc;
  var acRate = hasAc ? g("arAcRate", addRoomState.acRate) : 0;
  wrap.innerHTML =
    chip(
      "fa-user",
      (g("arMaxAdults", addRoomState.adults) || "0") + " Max Adults",
    ) +
    chip(
      "fa-baby",
      (g("arMaxChildren", addRoomState.children) || "0") + " Children",
    ) +
    chip(
      "fa-cake-candles",
      "Free under " + (g("arFreeAge", addRoomState.freeAge) || "0"),
    ) +
    chip(
      "fa-vector-square",
      g("arDimensions", addRoomState.dimensions) || "—",
    ) +
    chip("fa-bed", bedsTxt || "No beds") +
    (hasAc
      ? chip("fa-snowflake", "AC + ₹" + (acRate || 0) + "/night")
      : chip("fa-snowflake", "No AC")) +
    chip("fa-indian-rupee-sign", "₹" + (rate || 0) + "/night");
};

// ════════════════════════════════════════════════════════════════════
//  SAVE / PUBLISH
// ════════════════════════════════════════════════════════════════════
window.resetAddRoomForm = function () {
  addRoomState = freshAddRoomState();
  addRoomState.roomNumber = getNextRoomNumber();
  showAddRoom();
};

// Edit a room: prefill addRoomState from the saved room record and render the
// form in #htContainer (edit mode shows "Edit Room" + "Update Room" button).
window.editRoom = function (roomId) {
  var r = getRoomById(roomId);
  if (!r) {
    showMessageModal("Info", "Room not found!", false);
    return;
  }

  function csvIds(v) {
    var out = [];
    if (v == null || v === "") return out;
    var parts = String(v).split(",");
    for (var i = 0; i < parts.length; i++) {
      var n = parseInt(parts[i]);
      if (!isNaN(n)) out.push(n);
    }
    return out;
  }

  var occ = htRoomOccupancy(r);
  var typeId = r.i != null && typeof r.i !== "object" ? r.i : 1;

  // Prefill from the room's local images/ folder (matches the room card and
  // gallery). Fall back to the stored record images when there is no folder.
  var images = ["", "", "", "", ""];
  var local = htRoomImages(r);
  for (var li = 0; li < 5 && li < local.length; li++)
    images[li] = { g1: local[li], g2: local[li] };
  if (!local.length && r.f) {
    if (typeof r.f === "string") {
      var fParts = r.f.trim().split(/\s+/);
      images[0] = { g1: fParts[0] || "", g2: fParts[1] || fParts[0] || "" };
    } else if (r.f.f1) {
      images[0] = { g1: r.f.f1, g2: r.f.f2 || r.f.f1 };
    }
    if (Array.isArray(r.g)) {
      for (var gi = 0; gi < r.g.length && gi < 4; gi++) {
        var gm = r.g[gi];
        if (gm && gm.g1) images[gi + 1] = { g1: gm.g1, g2: gm.g2 || gm.g1 };
      }
    }
  }

  addRoomState = freshAddRoomState();
  addRoomState.editId = r.a;
  addRoomState.roomNumber = r.e;
  addRoomState.name = htRoomName(r);
  addRoomState.rate = htRoomRate(r);
  addRoomState.dimensions = htRoomDimensions(r);
  addRoomState.hasAc = !!(r.h && r.h.i && (r.h.i.b || r.h.i.b === 0));
  addRoomState.acRate = (r.h && r.h.i && r.h.i.b != null) ? r.h.i.b : "";
  addRoomState.roomType = typeId;
  addRoomState.status = r.d != null ? r.d : 1;
  addRoomState.beds = csvIds(r.h && r.h.g);
  addRoomState.adults = occ.adults || 2;
  addRoomState.children = occ.children || 0;
  addRoomState.freeAge = occ.freeAge || 0;
  addRoomState.description = (r.h && r.h.a) || "";
  addRoomState.images = images;
  addRoomState.amenities = csvIds(r.h && r.h.d);
  addRoomState.rules = csvIds(r.h && r.h.c);
  addRoomState.addons = csvIds(r.h && r.h.f);
  addRoomState.facilities = csvIds(r.h && r.h.h);
  addRoomState.weekRates = (r.h && r.h.j && typeof r.h.j === "object")
    ? r.h.j
    : {};
  showAddRoom();
};

// Read the Add Room form and validate it. Returns the room payload object
// (same keys for Add and Update) or null after showing the error message.
// The duplicate room-number check is done by the caller (Add blocks any
// duplicate; Update only blocks if the number belongs to another room).
function buildRoomPayload() {
  function g(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  var roomNumber = parseInt(g("arRoomNumber")) || getNextRoomNumber();
  var name = g("arRoomName");
  var rate = parseFloat(g("arRate")) || 0;
  var dimensions = g("arDimensions");
  var status = parseInt(document.getElementById("arStatus")?.value) || 1;
  var hasAc = document.getElementById("arHasAc")
    ? document.getElementById("arHasAc").checked
    : addRoomState.hasAc;
  var acRate = hasAc ? parseFloat(g("arAcRate")) || 0 : 0;
  var days = addRoomState.weekDays || [];
  var weekRates = null;
  if (days.length) {
    weekRates = {};
    for (var wi = 0; wi < days.length; wi++) {
      var day = days[wi];
      var norm = parseFloat(g("arWk" + day + "Norm"));
      var ac = parseFloat(g("arWk" + day + "Ac"));
      weekRates["" + day] = {
        a: norm > 0 ? norm : rate,
        b: hasAc ? (ac > 0 ? ac : acRate) : 0,
      };
    }
  }
  var adults = parseInt(g("arMaxAdults")) || 1;
  var children = parseInt(g("arMaxChildren")) || 0;
  var freeAge = parseInt(g("arFreeAge")) || 0;
  var description = document.getElementById("arDescription")
    ? document.getElementById("arDescription").value
    : "";

  var images = addRoomState.images.slice(0, 5);

  var amenityIds = addRoomState.amenities || [];
  var ruleIds = addRoomState.rules || [];
  var addonIds = addRoomState.addons || [];
  var bedIds = addRoomState.beds || [];
  var facilityIds = addRoomState.facilities || [];

  if (!roomNumber) {
    showMessageModal("Info", "Room number is missing!", false);
    return null;
  }
  if (!name) {
    showMessageModal("Info", "Please enter the room name!", false);
    return null;
  }
  if (rate <= 0) {
    showMessageModal("Info", "Please enter a valid nightly rate!", false);
    return null;
  }
  var hasImage = false;
  for (var k = 0; k < 5; k++)
    if (images[k] && images[k].g1) {
      hasImage = true;
      break;
    }
  if (!hasImage) {
    showMessageModal("Info", "Please add at least one image!", false);
    return null;
  }
  if (adults < 1) {
    showMessageModal("Info", "Adults capacity must be at least 1!", false);
    return null;
  }
  if (!dimensions) {
    showMessageModal("Info", "Please enter room dimensions!", false);
    return null;
  }
  if (bedIds.length === 0) {
    showMessageModal("Info", "Please select at least one bed type!", false);
    return null;
  }
  if (addonIds.length === 0) {
    showMessageModal("Info", "Please select at least one add-on!", false);
    return null;
  }
  var gallery = [];
  for (var j = 1; j < 5; j++)
    if (images[j] && images[j].g1)
      gallery.push({ g1: images[j].g1, g2: images[j].g2 || images[j].g1 });

  var roomH = {
    a: description, // description
    b: dimensions, // dimensions e.g. "10x10"
    c: ruleIds.join(","), // rule ids csv
    d: amenityIds.join(","), // amenity ids csv
    e: adults + "-" + children + "~" + freeAge, // occupancy adults-children~freeAge
    f: addonIds.join(","), // add-on service ids csv
    g: bedIds.join(","), // bed ids csv
    h: facilityIds.join(","), // facility ids csv
    i: { a: rate, b: acRate }, // { base rate, AC rate }
  };
  if (weekRates) roomH.j = weekRates; // { day: { a: normal, b: AC } } weekend-day rates

  return {
    roomNumber: roomNumber,
    name: name,
    rate: rate,
    payload: {
      d: status, // room status: 1=available, 2=maintenance, 127=deleted
      e: roomNumber, // rm.a record id
      f: { f1: images[0].g1, f2: images[0].g2 || images[0].g1 }, // display image + thumbnail
      g: gallery, // gallery [{g1, g2}]
      h: roomH,
      i: addRoomState.roomType, // room type id
      j: rate, // room name (persisted display label)
    },
  };
}

window.publishAddRoom = async function () {
  var out = buildRoomPayload();
  if (!out) return;

  var editing = !!addRoomState.editId;
  var editId = addRoomState.editId;

  if (editing) {
    var dup = getRoomById(out.roomNumber);
    if (dup && String(dup.a) !== String(editId)) {
      showMessageModal(
        "Info",
        "Room number " +
          out.roomNumber +
          " already exists! Choose a different number.",
        false,
      );
      return;
    }

    window.showModal({
      title: "Update Room",
      message: "Are you sure you want to update this room?",
      type: "confirm",
      onConfirm: async function () {
        await doPublishRoom(out, editId);
      },
    });
    return;
  }

  var dup = getRoomById(out.roomNumber);
  if (dup) {
    showMessageModal(
      "Info",
      "Room number " +
        out.roomNumber +
        " already exists! Choose a different number.",
      false,
    );
    return;
  }

  await doPublishRoom(out, null);
};

async function doPublishRoom(out, editId) {
  var updating = !!editId;

  payload0.drml = "sambodhisarang.in";
  payload0.p = out.payload;
  if (updating) payload0.x1 = editId;
  payload0.fn = 106;
  payload0.vw = 1;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
    { tb: "rb" },
    { tb: "rm" },
    { tb: "c" },
    { tb: "r" },
  ]);

  var btn = document.getElementById("arPublishBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML =
      '<span class="spinner"></span> ' +
      (updating ? "Updating..." : "Adding...");
  }

  console.log(
    "📤 " + (updating ? "Update" : "Add") + " Room:",
    JSON.stringify(payload0.p, null, 2),
  );

  try {
    if (typeof fnj3 !== "function") {
      showMessageModal("Info", "Server communication not available", false);
      return;
    }
    var resp = await fnj3(
      "https://my1.in/2/q.php",
      payload0,
      1,
      true,
      null,
      20000,
      0,
      1,
      1,
    );
    console.log("📥 Server:", resp);
    if (resp && resp.su == 1) {
      var serverMsg = (resp.ms || "").toLowerCase();
      if (
        resp.ms &&
        (serverMsg.indexOf("already exists") !== -1 ||
          serverMsg.indexOf("error") !== -1)
      ) {
        showMessageModal("Info", resp.ms, true);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML =
            '<i class="fas ' +
            (updating ? "fa-save" : "fa-rocket") +
            ' me-1"></i> ' +
            (updating ? "Update Room" : "Add Room");
        }
        return;
      }
      await handl_rm_rspons(resp);
      await adminLoadDataFromDB();
      if (!updating) addRoomState = freshAddRoomState();
      showMessageModal(
        "Success",
        "✅ Room " +
          (updating ? "updated" : "added") +
          " successfully!\n\nRoom: " +
          out.name +
          "\nNumber: " +
          out.roomNumber +
          "\nRate: ₹" +
          out.rate +
          "/night",
        false,
      );
      showRooms();
    } else {
      showMessageModal("Info", resp?.ms || "Failed to save room", true);
    }
  } catch (err) {
    showMessageModal("Info", "Error: " + err.message, false);
  }

  if (btn) {
    btn.disabled = false;
    btn.innerHTML =
      '<i class="fas ' +
      (updating ? "fa-save" : "fa-rocket") +
      ' me-1"></i> ' +
      (updating ? "Update Room" : "Add Room");
  }
}

console.log("➕ addRoom.js loaded");
