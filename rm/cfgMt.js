// roomMeta.js - HT Royal Stay shared room constants & helpers
// Single source for room type / beds / status / amenities / facilities /
// rules / policies / packages / add-ons used by addRoom, rooms, booking,
// home and reviews. IDs are sent in the payload (j, h, q, u, o, p) and
// labels are resolved here.

// Room types  (→ payload j, display name = label)
var htRoomTypes = [];

// Room status (→ payload d: 1=available, 2=maintenance, 127=deleted)
// No config source exists in rm_.da, so this keeps the standard set as a
// default; applyRoomLists can still replace it if a source is ever added.
var htRoomStatus = [
  { id: 0, label: "Active" },
  { id: 1, label: "Available" },
  { id: 2, label: "maintenance" },
  { id: 127, label: "Deleted" },
];

// Bed types  (→ payload u csv of ids)
var htRoomBeds = [];

// Amenities  (→ payload h csv of ids)
var htRoomAmenities = [];

// Facilities  (local ht_ table + dropdown)
var htRoomFacilities = [];

// Room rules  (→ payload q csv of ids)
var htRoomRules = [];

// Hotel policies are part of the rules list (rmruls from rm_.da) and are
// rendered by menu/policies.js.

// Packages  (→ payload o: [{a:id, b:price}])
var htRoomPackages = [];

// Add-ons  (→ payload p: [{a:id, b:price}])
var htRoomAddons = [];

// ════════════════════════════════════════════════════════════════════
//  HELPERS  (id → label resolution)
// ════════════════════════════════════════════════════════════════════
function htGetById(list, id) {
  if (!list) return null;
  for (var i = 0; i < list.length; i++) {
    if (String(list[i].id) === String(id)) return list[i];
  }
  return null;
}

function htRoomTypeLabel(id) {
  var t = htGetById(htRoomTypes, id);
  if (!t) return "";
  if (t.folder === "Non-AC" || t.folder === "AC")
    return t.label + " (" + t.folder + ")";
  return t.label;
}

function htRoomStatusLabel(id) {
  var s = htGetById(htRoomStatus, id);
  return s ? s.label : "Active";
}

// Resolve a room image value to a displayable URL. Server-stored images are
// Google Drive file keys: "displayId thumbnailId" (space separated). Anything
// that is not a Drive key (http(s) URLs, data: URLs, etc.) passes through
// unchanged.
function htImgSrc(value, thumbnail) {
  if (!value) return "";
  value = String(value).trim();
  var parts = value.split(/\s+/);
  if (parts.length >= 1 && /^[A-Za-z0-9_-]{20,}$/.test(parts[0])) {
    var fileId = thumbnail && parts[1] ? parts[1] : parts[0];
    return "https://lh3.googleusercontent.com/d/" + fileId + "=s0?authuser=0";
  }
  return value;
}

// Local room images shipped in the "images" folder. The folder path per room
// type comes from rm_.da (rmtyPs.c); browsers cannot list directories, so the
// first image file of each folder is indexed here. All rooms of a room type
// share that folder (suites included).
var htRoomFirstImageFile = {};

// All local image files per room-type folder.
var htRoomTypeImageFiles = {};

// First local image for a room from the images/ folder. The folder is taken
// from the room's type (rm_.da rmtyPs.c) via htRoomTypes. Returns "" when the
// room type has no folder/known file so callers can show a placeholder.
function htRoomImage(room) {
  if (!room) return "";
  var typeId = room.i != null && typeof room.i !== "object" ? room.i : room.j;
  var type = htGetById(htRoomTypes, typeId);
  if (
    type &&
    type.folder &&
    typeof type.folder === "string" &&
    type.folder.indexOf("images/") === 0
  ) {
    var file = htRoomFirstImageFile[type.folder];
    if (file) return type.folder + file;
  }
  if (room.f && typeof room.f === "string" && !room.f.startsWith("{"))
    return htImgSrc(room.f);
  return "";
}

// All local images for a room's type: "folder/file" paths. [] when the room
// type has no local folder (callers then fall back to stored record images).
function htRoomImages(room) {
  if (!room) return [];
  var typeId = room.i != null && typeof room.i !== "object" ? room.i : room.j;
  var type = htGetById(htRoomTypes, typeId);
  if (
    type &&
    type.folder &&
    typeof type.folder === "string" &&
    type.folder.indexOf("images/") === 0 &&
    htRoomTypeImageFiles[type.folder]
  ) {
    var out = [];
    var files = htRoomTypeImageFiles[type.folder];
    for (var i = 0; i < files.length; i++) out.push(type.folder + files[i]);
    return out;
  }
  return [];
}

// Display name for a room: the room type label (from rm_.da rmtyPs) takes
// priority so names stay consistent everywhere, then payload j (persisted
// name) for custom typed names, then the room number.
// Room type id lives in payload i as a number (legacy: i was an object
// and the id lived in j).
function htRoomName(room) {
  if (!room) return "Room";
  var typeId = room.i != null && typeof room.i !== "object" ? room.i : room.j;
  var label = htRoomTypeLabel(typeId);
  if (label) return label;
if (room.e) return String(room.e);
  return "Room #" + (room.a != null ? room.a : "");
}

function htBedLabels(room) {
  var csv = room && room.h && room.h.g != null ? room.h.g : room.p; // bed ids csv (payload h.g, legacy p)
  var ids = csv != null && csv !== "" ? String(csv).split(",") : [];
  var out = [];
  for (var i = 0; i < ids.length; i++) {
    var b = htGetById(htRoomBeds, ids[i]);
    if (b) out.push(b.label);
  }
  return out;
}

// Dimensions from payload h.b (legacy: i.b object or n string).
function htRoomDimensions(room) {
  if (!room) return "";
  if (room.h && room.h.b) return room.h.b;
  if (room.i && room.i.b) return room.i.b; // legacy
  return room.n && typeof room.n === "string" ? room.n : "";
}

function htAmenityLabels(room) {
  if (!room) return [];
  var raw = room.h;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    raw = raw.d; // amenity ids csv (payload h.d)
  }
  if (!raw) return [];
  if (Array.isArray(raw)) return raw; // legacy label arrays
  var ids = String(raw).split(",");
  var out = [];
  for (var i = 0; i < ids.length; i++) {
    var t = String(ids[i]).trim();
    if (!t) continue;
    var am = htGetById(htRoomAmenities, t);
    out.push(am ? am.label : t);
  }
  return out;
}

// In-room facilities from payload h.h: facility-id csv resolved against the
// config's fclts list (htRoomFacilities = [{id, label, icon}]) into
// {icon, label} objects for the public detail page. Icons come from the
// facility entry (resolved via htIconForLabel), defaulting to fa-check.
function htFacilityItems(room) {
  if (!room) return [];
  var csv = room.h && room.h.h != null ? room.h.h : "";
  var ids = csv != null && csv !== "" ? String(csv).split(",") : [];
  var out = [];
  for (var i = 0; i < ids.length; i++) {
    var t = String(ids[i]).trim();
    if (!t) continue;
    var f = htGetById(htRoomFacilities, t);
    out.push({ icon: (f && f.icon) || "fa-check", label: f ? f.label : t });
  }
  return out;
}

// Occupancy from payload h.e: "maxAdults-maxChildren~freeAge" (legacy: m)
function htRoomOccupancy(room) {
  var s = room && room.h && room.h.e != null ? room.h.e : room.m;
  s = s != null ? String(s) : "";
  var adults = 0;
  var children = 0;
  var freeAge = 0;
  if (s) {
    var freePart = s.split("~")[1];
    var main = s.split("~")[0];
    var parts = main.split("-");
    adults = parseInt(parts[0]) || 0;
    children = parseInt(parts[1]) || 0;
    freeAge = parseInt(freePart) || 0;
  }
  return { adults: adults, children: children, freeAge: freeAge };
}

// Nightly rate from merged local config _rate (legacy: payload l: [{a: rate, b: amenities}])
function htRoomRate(room) {
  if (!room) return 0;
  if (room._rate != null) return room._rate;
  if (room.k != null) return room.k; // server-persisted nightly rate
  if (room.j != null && !isNaN(parseFloat(room.j))) return parseFloat(room.j);
  if (room.l && room.l.length) {
    var r = room.l[0];
    if (r && r.a != null) return r.a;
  }
  return typeof room.f === "number" ? room.f : 0; // legacy
}

// ════════════════════════════════════════════════════════════════════
//  MASTER LIST LOADER  (from rm_.da config)
// ════════════════════════════════════════════════════════════════════
// The business config (rm_.da) ships the hotel's own room types,
// amenities, facilities, rules and beds as [{a: id, b: label}, ...].
// These replace the hardcoded defaults above at runtime; if the config
// is missing/broken the defaults remain in place.
function htApplyList(target, entries, withIcons, folderField) {
  if (!target || !Array.isArray(entries) || !entries.length) return;
  var mapped = [];
  for (var i = 0; i < entries.length; i++) {
    var it = entries[i];
    if (it && it.a != null && it.b != null) {
      var obj = { id: Number(it.a), label: String(it.b) };
      if (withIcons) obj.icon = htIconForLabel(obj.label);
      if (folderField && it[folderField] != null) obj.folder = String(it[folderField]);
      mapped.push(obj);
    }
  }
  if (!mapped.length) return;
  target.splice(0, target.length);
  for (var j = 0; j < mapped.length; j++) target.push(mapped[j]);
}

var htIconKeywords = [
  ["fa-wifi", ["wifi"]],
  ["fa-tv", ["tv"]],
  ["fa-mug-hot", ["coffee", "tea"]],
  ["fa-snowflake", ["air", "ac"]],
  ["fa-concierge-bell", ["service"]],
  ["fa-broom", ["housekeep"]],
  ["fa-headset", ["desk"]],
  ["fa-bed", ["pillow", "bed"]],
  ["fa-shield-halved", ["safe"]],
];

function htIconForLabel(label) {
  var l = String(label || "").toLowerCase();
  for (var i = 0; i < htIconKeywords.length; i++) {
    for (var j = 0; j < htIconKeywords[i][1].length; j++) {
      if (l.indexOf(htIconKeywords[i][1][j]) !== -1) return htIconKeywords[i][0];
    }
  }
  return "fa-check";
}

window.applyRoomLists = function (cfg) {
  if (!cfg || typeof cfg !== "object") return;
  htApplyList(htRoomTypes, cfg.rmtyPs, false, "c");
  htApplyList(htRoomAmenities, cfg.amnit, true);
  htApplyList(htRoomFacilities, cfg.fclts, true);
  htApplyList(htRoomRules, cfg.rmruls, false);
  htApplyList(htRoomBeds, cfg.bds, false);
  if (Array.isArray(cfg.adons) && cfg.adons.length) {
    var mapped = [];
    for (var i = 0; i < cfg.adons.length; i++) {
      var it = cfg.adons[i];
      if (it && it.a != null && it.b != null) {
        mapped.push({
          id: Number(it.a),
          icon: "fa-plus-circle",
          name: String(it.b),
          price: Number(it.c) || 0,
          unit: "flat",
        });
      }
    }
    if (mapped.length) {
      htRoomAddons.splice(0, htRoomAddons.length);
      for (var j = 0; j < mapped.length; j++) htRoomAddons.push(mapped[j]);
    }

    // Extra Particulars for the admin booking form's combobox
    // (menu/adminBooking.js htExtraListHTML) live on window.htExtras as
    // {a, e, g, h}. They are driven by the `adtnolChrgs` array
    // (facility id → name + default price), each charged at its flat custom
    // amount once selected (not per-night / per-hour).
    // Always (re)fill them so script-vs-config load order can never leave the
    // list empty.
    var adtnol = Array.isArray(cfg.adtnolChrgs) ? cfg.adtnolChrgs : [];
    if (typeof window.htExtras === "undefined") window.htExtras = [];
    window.htExtras.splice(0, window.htExtras.length);
    if (adtnol.length) {
      for (var i = 0; i < adtnol.length; i++) {
        var xr = adtnol[i];
        if (!xr || xr.a == null) continue;
        window.htExtras.push({
          a: Number(xr.a),
          e: xr.b != null ? String(xr.b) : "",
          g: xr.c != null ? Number(xr.c) || 0 : 0,
          h: "perStay",
        });
      }
    } else if (mapped.length) {
      for (var j = 0; j < mapped.length; j++) {
        var m = mapped[j];
        window.htExtras.push({
          a: m.id,
          e: m.name,
          g: m.price,
          h: "perStay",
        });
      }
    }
  }
};

console.log("🏷️ roomMeta.js loaded");
