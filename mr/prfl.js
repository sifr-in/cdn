/* ==========================================================================================
 * git/prfl.js - View Profile detail modal + unlock system (new design).
 * Ported from the old app's showProfileDtls / confirmUnlockProfile / useOrSetAsideProfile /
 * chkMyCount (git/mr.js), rebuilt on the regis.js (rg-) design and the new mr.da key layout.
 *
 * Server contract (new mr key layout):
 *   - fn 70 (chkMyCount)      -> response.mr.l[0] is the caller's own profile;
 *                                .d1 = paid profile count, .d2 = free profile count (totals);
 *                                -1 = unlimited. Persisted to localStorage "<tn>_myEinMR".
 *   - fn 66 (unlock)          -> x1 = {a:<proflId>}, x2 = "mu"; response.mr.l carries the full
 *                                row which is written to the Dexie "mr" table.
 *   - Dexie "mr" table        -> holds ONLY full rows (own profile + unlocked profiles), so a
 *                                profile is "unlocked" when it is found there.
 *
 * Count rule (mr.da adjustD1D2Locally = 1):
 *   used = "mr" rows - own row; free (d2) is spent first, then paid (d1).
 *   remaining = max(0, d2 - used) + max(0, d1 - max(0, used - d2))
 *   adjustD1D2Locally = 0 keeps the server-only behaviour (d1 + d2 as usable).
 * ========================================================================================== */
(function () {
    "use strict";

    var API = "https://my1.in/3/d.php";
    var MODAL_ID = "mrProfileDtlsModal";
    var IMGVIEW_ID = "mrImageViewer";
    var CSS_ID = "mrPrflCss";

    /* ---- unlock state (mirrors the old public app) -------------------------------- */
    var proflFullData = null;
    var myEinMR = {};
    var profileUnlockCount = 0;
    var freeProfileCount = 0;
    var remainingProflCnt = 0;
    var currentProfileId = null;
    //number of unlocked profiles found in the local "mr" table (own row excluded).
    //Used by the sound check before the async count calculation runs.
    var cachedUsedCount = 0;

    function P() {
        try { return window[window.my1uzr.worknOnPg] || {}; } catch (e) { return {}; }
    }
    //mr.da.wajiw lookup by key (e.g. "unlk" = "unlock: when using count")
    function soundRaw(key) {
        var C = window.da_mr || (P().clientConfig || {});
        var wj = C.wajiw;
        if (!Array.isArray(wj)) return "";
        for (var i = 0; i < wj.length; i++) {
            if (wj[i] && String(wj[i].a) === String(key)) return wj[i].e || "";
        }
        return "";
    }
    //boolean mr.da switch (same source as soundRaw): Number(...) === 1
    function cfgOn(key) {
        try {
            var C = window.da_mr || (P().clientConfig || {});
            return Number(C && C[key]) === 1;
        } catch (e) { return false; }
    }
    //a registered member = has an own profile row (same rule plans.js uses for
    //"Get Free" vs "All free count Used"), so pgf/pga always match the plans modal
    function isRegisteredMember() {
        var me = myEinMR;
        return !!(me && me.a != null && me.a !== "");
    }
    function ownerTn() {
        try { return window.appOwner && window.appOwner.tn; } catch (e) { return null; }
    }
    function esc(v) {
        if (v === null || v === undefined) return "";
        return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function el(html) {
        var d = document.createElement("div");
        d.innerHTML = String(html).trim();
        return d.firstChild;
    }
    function toast(msg, type) {
        if (typeof window.showToast === "function") {
            window.showToast(msg, { type: type || "info", duration: 3000, position: "top", dismissible: true });
        } else { console.log(msg); }
    }
    function isLoggedIn() {
        try {
            if (window.my1uzr && window.my1uzr.mk) return true;
            //the logged-in token is copied into payload0 by my1e3; either place counts
            return !!(window.payload0 && window.payload0.mk);
        } catch (e) { return false; }
    }

    /* ---- persistence -------------------------------------------------------------- */
    //fn 70 own row uses the new keys: d1 = paid profile count, d2 = free profile count.
    //-1 is the server's "unlimited" sentinel and must keep its sign, so it is never
    //flattened to 0 (which would wrongly send the member to the plans modal).
    function countNum(v) {
        var n = Number(v);
        return isFinite(n) ? n : 0;
    }
    function applyOwnCounts() {
        profileUnlockCount = countNum(myEinMR && myEinMR.d1);
        freeProfileCount = countNum(myEinMR && myEinMR.d2);
        //d1/d2 are totals, not remaining values. The real remaining count needs the
        //unlocked "mr" rows, so computeCounts() updates remainingProflCnt before any
        //unlock decision; this mirror just keeps the -1 unlimited sentinel intact.
        remainingProflCnt = (profileUnlockCount < 0 || freeProfileCount < 0)
            ? -1
            : Math.max(0, profileUnlockCount + freeProfileCount);
    }
    function hasCount(row, key) {
        return !!(row && row[key] !== undefined && row[key] !== null && row[key] !== "");
    }
    function localAdjKey() {
        var tn = ownerTn();
        return tn ? tn + "_myEinMR_localAdj" : "";
    }
    //One-time migration from the earlier local method, which decremented the stored
    //d1/d2 and kept the server totals in "<tn>_myEinMR_localAdj". Restore those totals
    //so the record-based count starts from the member's real allowance, then drop the
    //marker. A genuinely changed server row is kept as authority.
    function restoreLegacyTotals(row) {
        var k = localAdjKey();
        if (!k || !row) return row;
        //config may not be loaded yet at startup: keep the marker for a later server
        //row instead of discarding the only copy of the real totals
        if (!cfgOn("adjustD1D2Locally")) {
            var cfgReady = false;
            try { cfgReady = !!(window.da_mr || (P().clientConfig)); } catch (eC) { cfgReady = false; }
            //flag really off -> local method disabled, drop any adjustment left behind
            if (cfgReady) { try { localStorage.removeItem(k); } catch (eD0) { } }
            return row;
        }
        var raw = null;
        try { raw = localStorage.getItem(k); } catch (eR) { raw = null; }
        if (!raw || raw === "undefined" || raw === "null") return row;
        try {
            var o = JSON.parse(raw);
            if (o &&
                isFinite(Number(o.baseD1)) && isFinite(Number(o.baseD2)) &&
                (o.a == null || (row.a != null && String(o.a) === String(row.a)))) {
                var baseD1 = Number(o.baseD1);
                var baseD2 = Number(o.baseD2);
                var spentFree = Math.max(0, countNum(o.spentFree));
                var spentPaid = Math.max(0, countNum(o.spentPaid));
                var localD1 = baseD1 < 0 ? -1 : Math.max(0, baseD1 - spentPaid);
                var localD2 = baseD2 < 0 ? -1 : Math.max(0, baseD2 - spentFree);
                var rowHasD1 = hasCount(row, "d1");
                var rowHasD2 = hasCount(row, "d2");
                var isBase = rowHasD1 && rowHasD2 &&
                    countNum(row.d1) === baseD1 && countNum(row.d2) === baseD2;
                var isLocal = rowHasD1 && rowHasD2 &&
                    countNum(row.d1) === localD1 && countNum(row.d2) === localD2;
                if (isBase || isLocal || (!rowHasD1 && !rowHasD2)) {
                    var restored = {};
                    for (var kk in row) if (Object.prototype.hasOwnProperty.call(row, kk)) restored[kk] = row[kk];
                    restored.d1 = baseD1;
                    restored.d2 = baseD2;
                    row = restored;
                    try {
                        var tn = ownerTn();
                        if (tn) localStorage.setItem(tn + "_myEinMR", JSON.stringify(row));
                    } catch (eW) { }
                }
            }
        } catch (e) { }
        try { localStorage.removeItem(k); } catch (eD) { }
        return row;
    }
    //config or the stored own row may arrive after startup: retry the one-time marker
    //migration before any count is read or shown
    function migrateLegacyTotalsIfNeeded() {
        var k = localAdjKey();
        if (!k) return;
        var raw = null;
        try { raw = localStorage.getItem(k); } catch (e) { return; }
        if (raw == null) return;
        myEinMR = restoreLegacyTotals(myEinMR);
        applyOwnCounts();
    }
    function loadStoredMyEinMR() {
        try {
            var tn = ownerTn();
            var stored = tn ? localStorage.getItem(tn + "_myEinMR") : null;
            if (stored && stored !== "undefined" && stored !== "null") myEinMR = JSON.parse(stored) || {};
        } catch (e) { myEinMR = {}; }
        myEinMR = restoreLegacyTotals(myEinMR);
        applyOwnCounts();
    }
    function persistMyEinMR(row) {
        //a marker left by the earlier local method is restored here too: this runs when
        //the first server row arrives (login / fn 70), after mr.da config is available
        row = restoreLegacyTotals(row || {});
        var next = {};
        var src = row || {};
        for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k)) next[k] = src[k];
        //quick-result / partial server rows may carry no counts: keep the stored totals,
        //but never carry them over to a different logged-in member
        var sameMember = (myEinMR.a == null || next.a == null || String(myEinMR.a) === String(next.a));
        if (sameMember && !hasCount(next, "d1") && hasCount(myEinMR, "d1")) next.d1 = myEinMR.d1;
        if (sameMember && !hasCount(next, "d2") && hasCount(myEinMR, "d2")) next.d2 = myEinMR.d2;
        myEinMR = next;
        applyOwnCounts();
        //a server row changed (login / registration / purchase): force the next unlock
        //to re-read fn 70.
        lastCountsAt = 0;
        try {
            var tn = ownerTn();
            if (tn) localStorage.setItem(tn + "_myEinMR", JSON.stringify(next));
        } catch (e) { }
        return myEinMR;
    }
    function findOwnRowInResp(resp) {
        var meId = myEinMR && myEinMR.a;
        if (meId == null || meId === "") return null;
        var rows = (resp && resp.mr && Array.isArray(resp.mr.l)) ? resp.mr.l : null;
        if (!rows) return null;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i] && String(rows[i].a) === String(meId)) return rows[i];
        }
        return null;
    }

    /* expose the closure values the way the old app did (drawer/other modules read them) */
    Object.defineProperty(window, "myEinMR", {
        configurable: true, get: function () { return myEinMR; },
        set: function (v) { persistMyEinMR(v); }
    });
    Object.defineProperty(window, "profileUnlockCount", {
        configurable: true, get: function () { return profileUnlockCount; },
        set: function (v) { profileUnlockCount = Number(v) || 0; }
    });
    Object.defineProperty(window, "freeProfileCount", {
        configurable: true, get: function () { return freeProfileCount; },
        set: function (v) { freeProfileCount = Number(v) || 0; }
    });
    Object.defineProperty(window, "remainingProflCnt", {
        configurable: true, get: function () { return remainingProflCnt; },
        set: function (v) { remainingProflCnt = Number(v) || 0; }
    });
    Object.defineProperty(window, "proflFullData", {
        configurable: true, get: function () { return proflFullData; },
        set: function (v) { proflFullData = v; }
    });

    async function getFullData(force) {
        if (!proflFullData || force) {
            try { proflFullData = (await dbDexieManager.getAllRecords(window.dbnm, "mr")) || []; }
            catch (e) { console.warn("prfl: could not read mr table", e); proflFullData = []; }
        }
        return proflFullData;
    }

    //adjustD1D2Locally method: the "mr" table holds the member's own row plus one row
    //per unlocked profile (fn 66 writes the unlocked row there). So
    //used = rows - own row; the own row is excluded by id, so a missing own row never
    //skews the count.
    async function readUsedCount() {
        if (!proflFullData) { try { await getFullData(); } catch (e) { } }
        var me = myEinMR || {};
        var meId = (me.a != null && me.a !== "") ? String(me.a) : "";
        var rows = proflFullData || [];
        var used = 0;
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            if (!r) continue;
            if (meId && r.a != null && String(r.a) === meId) continue;
            used++;
        }
        cachedUsedCount = used;
        return used;
    }

    async function computeCounts() {
        migrateLegacyTotalsIfNeeded();
        var freeTotal = countNum(freeProfileCount);
        var paidTotal = countNum(profileUnlockCount);
        //-1 on either key means unlimited: never let it turn into a 0 allowance
        var unlimited = (freeTotal < 0 || paidTotal < 0);
        if (unlimited) {
            remainingProflCnt = -1;
            return {
                freeTotal: freeTotal, paidTotal: paidTotal,
                freeUsed: 0, paidUsed: 0,
                freeRemaining: -1, paidRemaining: -1,
                usable: Infinity, used: 0, remaining: Infinity,
                unlimited: true, canUnlock: true
            };
        }
        var freeAvail = Math.max(0, freeTotal);
        var paidAvail = Math.max(0, paidTotal);
        var used = 0;
        var freeUsed = 0;
        var paidUsed = 0;
        var freeRemaining = freeAvail;
        var paidRemaining = paidAvail;
        if (cfgOn("adjustD1D2Locally")) {
            //free (d2) is consumed first, then paid (d1)
            used = await readUsedCount();
            freeUsed = Math.min(used, freeAvail);
            freeRemaining = Math.max(0, freeAvail - used);
            paidUsed = Math.min(paidAvail, Math.max(0, used - freeAvail));
            paidRemaining = Math.max(0, paidAvail - paidUsed);
        }
        var remaining = freeRemaining + paidRemaining;
        remainingProflCnt = remaining;
        return {
            freeTotal: freeTotal, paidTotal: paidTotal,
            freeUsed: freeUsed, paidUsed: paidUsed,
            freeRemaining: freeRemaining, paidRemaining: paidRemaining,
            usable: remaining, used: used, remaining: remaining,
            unlimited: false, canUnlock: remaining > 0
        };
    }

    function buildPayload(fn) {
        var p = (typeof window.payload0 !== "undefined" && window.payload0) ? window.payload0 : (window.payload0 = {});
        p.vw = 4; p.fn = fn;
        return p;
    }

    /* ---- small CSS on top of the regis (rg-) design -------------------------------- */
    //Loads git/regis.js for its rg- styles + read-only renderer WITHOUT opening its modal.
    //prfl.js can be reached before the registration modal was ever opened, so this makes
    //the detail view carry the same design instead of falling back to unstyled markup.
    async function ensureRegis() {
        if (typeof window.mrRenderProfileReadonly === "function" && typeof window.mrRegisEnsureCss === "function") return;
        try {
            var conf = P();
            var row = (Array.isArray(conf.csh) ? conf.csh : []).find(function (r) { return r && r.a === 14; });
            if (row && row.u && typeof window.loadPromiseScript === "function") await window.loadPromiseScript(row.u);
        } catch (e) { console.warn("prfl: could not load regis.js", e); }
    }

    function ensureCss() {
        if (typeof window.mrRegisEnsureCss === "function") window.mrRegisEnsureCss();
        if (document.getElementById(CSS_ID)) return;
        var css = [
            ".mrd-hero{position:relative;border-radius:14px;overflow:hidden;background:var(--rg-cream,#faf4e6);}",
            ".mrd-hero img{width:100%;height:220px;object-fit:cover;object-position:top;display:block;cursor:pointer;}",
            ".mrd-hero--empty{height:150px;display:flex;align-items:center;justify-content:center;color:var(--rg-muted,#6f6656);font-size:34px;}",
            ".mrd-badges{position:absolute;top:10px;left:10px;display:flex;gap:6px;flex-wrap:wrap;}",
            ".mrd-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;color:#fff;background:rgba(36,29,18,.62);}",
            ".mrd-badge--v{background:linear-gradient(135deg,#2e7d5b,#1f5a41);}",
            ".mrd-badge--p{background:linear-gradient(135deg,#c9a45c,#b8914b);}",
            ".mrd-badge--id{background:linear-gradient(135deg,#8B1E3F,#6E1733);}",
            ".mrd-lock{margin-top:14px;display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:12px;background:var(--rg-cream,#faf4e6);border:1px solid rgba(201,164,92,.5);color:var(--rg-ink,#241d12);font-size:13px;line-height:1.45;}",
            ".mrd-lock i{color:var(--rg-ember,#8B1E3F);font-size:18px;margin-top:1px;}",
            ".mrd-section{margin:16px 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--rg-muted,#6f6656);}",
            ".mrd-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:8px;margin-top:8px;}",
            ".mrd-gallery img{width:100%;height:64px;object-fit:cover;border-radius:10px;border:1px solid rgba(201,164,92,.45);cursor:pointer;}",
            ".mrd-viewer{position:fixed;inset:0;z-index:1060;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(12,9,4,.88);opacity:0;transition:opacity .22s ease;box-sizing:border-box;}",
            ".mrd-viewer.open{opacity:1;}",
            ".mrd-viewer img{max-width:94vw;max-height:88vh;border-radius:12px;box-shadow:0 24px 60px rgba(0,0,0,.5);display:block;}",
            ".mrd-viewer .mrd-viewer-x{position:absolute;top:14px;right:16px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.14);color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;}",
            ".mrd-viewer .mrd-viewer-x:hover{background:rgba(255,255,255,.3);}"
        ].join("");
        var s = document.createElement("style");
        s.id = CSS_ID;
        s.textContent = css;
        document.head.appendChild(s);
    }

    /* ---- modal plumbing ------------------------------------------------------------ */
    function closeModalById(id) {
        var ov = document.getElementById(id);
        if (!ov) return;
        ov.classList.remove("open");
        setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 260);
    }
    function closeDetail() { closeModalById(MODAL_ID); }
    function closeImageViewer() { closeModalById(IMGVIEW_ID); }

    function openImageViewer(src) {
        if (!src) return;
        ensureCss();
        closeImageViewer();
        var ov = el('<div class="mrd-viewer" id="' + IMGVIEW_ID + '">' +
            '<button type="button" class="mrd-viewer-x" data-vclose aria-label="Close"><i class="fas fa-xmark"></i></button>' +
            '<img src="' + esc(src) + '" alt="Photo">' +
            '</div>');
        document.body.appendChild(ov);
        requestAnimationFrame(function () { ov.classList.add("open"); });
        ov.addEventListener("click", function (e) { if (e.target === ov) closeImageViewer(); });
        ov.querySelector("[data-vclose]").addEventListener("click", closeImageViewer);
    }

    document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        if (document.getElementById(IMGVIEW_ID)) closeImageViewer();
        else if (document.getElementById(MODAL_ID)) closeDetail();
    });

    /* ---- detail modal -------------------------------------------------------------- */
    function heroHtml(profile, unlocked) {
        var thumb = profile.thumbnail || "";
        var badges = "";
        //if (String(profile.qa || "").trim()) badges += '<span class="mrd-badge mrd-badge--v"><i class="fas fa-circle-check"></i>Verified</span>';
        //if (profile.i && parseFloat(profile.i) > 0) badges += '<span class="mrd-badge mrd-badge--p"><i class="fas fa-crown"></i>Premium</span>';
        if (profile.w) badges += '<span class="mrd-badge mrd-badge--id">ID: ' + esc(profile.w) + '</span>';
        var inner = thumb
            ? '<img id="mrdHeroImg" data-src="' + esc(thumb) + '" data-lazy="' + esc(thumb) + '" decoding="async" alt="' + esc(profile.m || "Profile") + '">'
            : '<div class="mrd-hero--empty"><i class="fas fa-user"></i></div>';
        return '<div class="mrd-hero">' + inner + (badges ? '<div class="mrd-badges">' + badges + '</div>' : '') + '</div>';
    }

    function subtitle(profile) {
        var bits = [];
        try {
            if (typeof window.calculateAge === "function" && profile.g) {
                var age = window.calculateAge(profile.g);
                if (age && age !== "Unknown") bits.push(age + " yrs");
                else bits.push("-");
            }
        } catch (e) { }
        if (profile.j != null) {
            var rel = (window.marital_status || []).find(function (x) { return x.a == profile.j; });
            if (rel && rel.e && rel.e !== "-") bits.push(rel.e);
        }
        return bits.join(" \u00b7 ");
    }

    function galleryHtml(profile, unlocked) {
        if (!unlocked) return "";
        if (typeof window.mrResolveProfileImages !== "function") return "";
        var raw = (typeof window.mrParseGalleryImages === "function")
            ? window.mrParseGalleryImages(profile.u1) : [];
        var imgs = raw.map(function (raw) {
            var r = window.mrResolveProfileImages(raw);
            return r.display || r.thumbnail || null;
        }).filter(Boolean);
        if (!imgs.length) return "";
        return '<div class="mrd-section">Photos</div><div class="mrd-gallery">' +
            imgs.map(function (src) { return '<img data-src="' + esc(src) + '" data-lazy="' + esc(src) + '" loading="lazy" decoding="async" alt="Photo">'; }).join("") +
            '</div>';
    }

    async function openDetailModal(profileData, unlocked) {
        await ensureRegis();
        ensureCss();
        closeDetail();
        //remember which profile this modal shows (the unlock flow falls back to it)
        currentProfileId = profileData.a;
        if (typeof window.applyProfileImageData === "function") { try { window.applyProfileImageData(profileData); } catch (e) { } }

        var isMine = !!(myEinMR && myEinMR.a && String(myEinMR.a) === String(profileData.a));
        var fullAccess = unlocked || isMine;
        //detail rows come from colsToDispOnCard (+ colsToDispOnCardOnMoreBtn behind the
        //"more" button); locked and unlocked show the same fields - the lock only adds
        //the banner / unlock action
        var hideCsv = "";
        //mr.da.hideBirthDateTimeOnLocked: hide the birth date + time row ("g") while the
        //profile is locked; unlocked profiles (and my own) keep showing it
        if (!fullAccess && cfgOn("hideBirthDateTimeOnLocked")) hideCsv = "g";
        var gal = galleryHtml(profileData, fullAccess);
        var grid = (typeof window.mrRenderProfileReadonly === "function")
            ? window.mrRenderProfileReadonly(profileData, hideCsv, gal) : "";
        //"u" in the detail sequence toggles the hero DP (and its badges)
        var showDp = (typeof window.mrDetailShowDp === "function") ? window.mrDetailShowDp(hideCsv) : true;

        var name = [profileData.m, profileData.n].filter(Boolean).join(" ") || "Profile";
        var sub = subtitle(profileData);

        var lock = (!fullAccess)
            ? '<div class="mrd-lock"><i class="fas fa-lock"></i><div>Full details and contact information are hidden. Unlock this profile to view everything this member has shared.</div></div>'
            : "";

        var actions = "";
        if (!fullAccess && !isMine) actions += '<button type="button" class="rg-btn rg-btn-main" data-unlock><i class="fas fa-lock-open"></i>Unlock profile</button>';
        if (isMine) actions += '<button type="button" class="rg-btn rg-btn-main" data-edit><i class="fas fa-pen"></i>Edit profile</button>';

        var ov = el('<div class="rg-overlay" id="' + MODAL_ID + '"></div>');
        var box = el(
            '<div class="rg-box">' +
            '<div class="rg-head">' +
            '<div class="rg-ic"><i class="fas fa-id-card"></i></div>' +
            '<div class="rg-titles"><h3>' + esc(name) + '</h3>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>' +
            '<button type="button" class="rg-x" data-close aria-label="Close"><i class="fas fa-xmark"></i></button>' +
            '</div>' +
            '<div class="rg-body">' +
            (showDp ? heroHtml(profileData, fullAccess) : '') +
            lock +
            (grid ? grid : '') +
            '<div class="rg-actions">' + actions + '</div>' +
            '</div></div>'
        );
        ov.appendChild(box);
        document.body.appendChild(ov);
        requestAnimationFrame(function () { ov.classList.add("open"); });

        //view-profile introduction sound (mr.da wajiw "vewprfl") through the shared
        //button; a sound that is already playing is kept, never restarted. Only a
        //locked profile is an "introduction": an already unlocked profile and my own
        //profile never play it.
        var vsnd = fullAccess ? "" : soundRaw("vewprfl");
        if (vsnd && window.mrSoundBtn) {
            try {
                window.mrSoundBtn.show(vsnd);
                if (!(typeof window.mrSoundIsPlaying === "function" && window.mrSoundIsPlaying(vsnd))) {
                    if (typeof window.mrPlaySound === "function") window.mrPlaySound(vsnd);
                    else window.mrSoundBtn.play(vsnd);
                }
            } catch (eSnd) { }
        }

        if (window.mrImg) window.mrImg.hydrate(box);

        ov.addEventListener("click", function (e) { if (e.target === ov) closeDetail(); });
        box.querySelector("[data-close]").addEventListener("click", closeDetail);

        var ub = box.querySelector("[data-unlock]");
        if (ub) ub.addEventListener("click", function () { requestUnlock(profileData.a); });
        var eb = box.querySelector("[data-edit]");
        if (eb) eb.addEventListener("click", function () { closeDetail(); if (typeof window.mrOpenRegistration === "function") { window.mrOpenRegistration(profileData.a); } else { window.loadExe2Fn(14, [profileData.a], [1]); } });

        Array.prototype.forEach.call(box.querySelectorAll(".mrd-gallery img"), function (im) {
            im.addEventListener("click", function () {
                openImageViewer(im.getAttribute("data-src") || im.src);
            });
        });

        var heroImg = box.querySelector("#mrdHeroImg");
        if (heroImg) heroImg.addEventListener("click", function () { openImageViewer(heroImg.getAttribute("data-src") || heroImg.src); });
    }

    /* ---- unlock flow ---------------------------------------------------------------- */
    //counts may be missing or stale in the stored login row (the quick-result row does
    //not reliably carry d1/d2): fetch the latest own row (fn 70 chkMyCount) before
    //deciding anything, so the paid (d1) + free (d2) allowance is real
    var lastCountsAt = 0;
    async function refreshCounts() {
        var ok = false;
        try {
            var resp = await window.fnj3(API, buildPayload(70), 1, true, null, 20000, 0, 1, 1, 1);
            if (resp && resp.su == 1) {
                ok = true;
                if (resp.mr && resp.mr.l && resp.mr.l.length) {
                    var own = persistMyEinMR(resp.mr.l[0]);
                    var rows = resp.mr.l.slice();
                    if (own && own.a != null) {
                        for (var iR = 0; iR < rows.length; iR++) {
                            if (rows[iR] && String(rows[iR].a) === String(own.a)) rows[iR] = own;
                        }
                    }
                    try { await dbDexieManager.insertToDexie(window.dbnm, "mr", rows, true, ["a"]); } catch (e) { }
                }
                if (resp.mu && resp.mu.l) {
                    try { await dbDexieManager.insertToDexie(window.dbnm, "mu", resp.mu.l, true, ["a"]); } catch (eMu) { }
                }
            }
        } catch (e) { console.warn("prfl: refreshCounts failed", e); }
        proflFullData = null;
        await getFullData(true);
        if (ok) lastCountsAt = Date.now();
        return ok ? await computeCounts() : null;
    }

    var countsPending = null;
    async function ensureCounts(maxAgeMs) {
        var age = Date.now() - lastCountsAt;
        if (lastCountsAt && age < (maxAgeMs || 30000)) return;
        //a fast double-tap must not fire two fn 70 requests
        if (countsPending) { try { await countsPending; } catch (eP) { } return; }
        try {
            countsPending = refreshCounts();
            await countsPending;
        } catch (e) { } finally { countsPending = null; }
    }

    //sync "is any allowance stored" check for the click sound: it must run inside the
    //user gesture (before any await) so the browser keeps the autoplay permission
    function localCanUnlock() {
        if (!myEinMR) return false;
        migrateLegacyTotalsIfNeeded();
        var me = myEinMR;
        var hasD1 = (me.d1 !== undefined && me.d1 !== null && me.d1 !== "");
        var hasD2 = (me.d2 !== undefined && me.d2 !== null && me.d2 !== "");
        //a stale login row may carry neither count key: don't claim "no count left",
        //fn 70 below is the authority for this click
        if (!hasD1 && !hasD2) return true;
        if (profileUnlockCount < 0 || freeProfileCount < 0) return true;
        var total = Math.max(0, profileUnlockCount) + Math.max(0, freeProfileCount);
        //record-based method: the unlocked "mr" rows are already spent
        if (cfgOn("adjustD1D2Locally")) total -= Math.max(0, cachedUsedCount);
        return total > 0;
    }

    //unlock confirmation: ask once with window.showConfirmModal, then spend a count.
    //The fnj3 (fn 66) endpoint call itself lives in doUnlock below.
    async function requestUnlock(profileId) {
        if (profileId == null || profileId === "") profileId = currentProfileId;
        if (profileId == null || profileId === "") { toast("Profile not found", "error"); return; }
        currentProfileId = profileId;

        //a guest (or a logged-in user without an own profile row) must only see the
        //plans modal: running the count/unlock calls below would open the login modal,
        //and that login flow reloads the page.
        var readyMember = isLoggedIn() && isRegisteredMember();

        //unlock click sound: state decides which wajiw sound plays. This runs
        //synchronously inside the unlock tap, so the browser allows it.
        var sndKey = "";
        if (!readyMember)               sndKey = "pgf";  //not logged in/registered -> "Get Free"
        else if (localCanUnlock())      sndKey = "unlk"; //d1 + d2 left -> spend it
        else                            sndKey = "pga";  //already added, no count left
        var snd = soundRaw(sndKey);
        if (snd && window.mrSoundBtn) {
            window.mrSoundBtn.show(snd);
            if (typeof window.mrPlaySound === "function") window.mrPlaySound(snd);
            else window.mrSoundBtn.play(snd);
        }

        //guest path: open the plans modal as-is and stop before showConfirmModal /
        //ensureCounts (fn 70) / doUnlock (fn 66). No login prompt, no page reload.
        if (!readyMember) { openPlansModal(0); return; }

        if (typeof window.showConfirmModal !== "function") { toast("Confirm modal is unavailable", "error"); return; }

        //decide from the stored own row (d1 paid + d2 free). No network refresh just to
        //open the plans modal: only the login "quick result" row can miss both keys, and
        //only then is fn 70 read once to learn the allowance. doUnlock still re-checks
        //right before spending.
        var countsKnown = !!(myEinMR && (myEinMR.d1 !== undefined || myEinMR.d2 !== undefined));
        if (!countsKnown) await ensureCounts();
        var c = await computeCounts();
        if (!c || !c.canUnlock) { openPlansModal(0); return; }

        var ok = await window.showConfirmModal(
            "Are you sure you want to unlock this profile?\n\n" +
            "After unlocking, you can see only the information filled by this member.\n" +
            "You have " + (c.unlimited ? "unlimited" : c.usable) + " profile view count(s) remaining."
        );
        if (!ok) return;
        await doUnlock(profileId);
    }

    async function doUnlock(profileId) {
        //defensive: never let a guest reach fn 66 (loginRequired=1) and its reload
        if (!isLoggedIn() || !isRegisteredMember()) { openPlansModal(0); return; }
        await ensureCounts();
        var c = await computeCounts();
        if (!c || !c.canUnlock) { openPlansModal(0); return; }
        try {
            var p = buildPayload(66);
            p.x1 = { a: profileId };
            p.x2 = "mu";
            //last-access cursor for the mu table, so the server only sends the delta
            if (typeof dbDexieManager !== "undefined" && dbDexieManager &&
                typeof dbDexieManager.getMaxDateRecords === "function") {
                try { p.la = await dbDexieManager.getMaxDateRecords(window.dbnm, [{ tb: "mu" }]); } catch (eL) { }
            }
            var resp = await window.fnj3(API, p, 1, true, null, 20000, 0, 2, 1, 1);
            hndlRspo66(resp, profileId);
        } catch (e) {
            console.error("prfl: unlock failed", e);
            toast("Failed to unlock: " + ((e && e.message) || e), "error");
        }
    }

    //offer the paid plans (git/plans.js, csh 17) - used when an unlock consumes the last count
    function openPlansModal(needed) {
        if (typeof window.loadExe2Fn === "function") {
            try { window.loadExe2Fn(17, [needed], []); return; } catch (e) { }
        }
        if (typeof window.showMarriagePlans === "function") window.showMarriagePlans(needed);
    }

    /* shared fn-66 response handler.
     * Called two ways:
     *   - hndlRspo66(resp, id)  from doUnlock (the unlock flow) -> persist + re-render to view + unlock UI
     *   - hndlRspo66(resp)      from my1lo after login ("quick result") -> persist + refresh list, NO unlock UI
     * The unlock-only side effects (detail re-render, subscribe confirm, plans modal, success toast)
     * are gated on an explicit id so the login call is never disturbed. */
    window.hndlRspo66 = async function (resp, id) {
        var isUnlock = (id != null && id !== "");
        if (resp && resp.su == 1) {
            proflFullData = null;
            if (typeof handl_mr_rspons === "function") {
                try { await handl_mr_rspons(resp); await getFullData(true); } catch (eH) { console.error(eH); }
            }
            //my1lo login "quick result": remember the member's own row + refresh the card list
            if (!isUnlock) {
                var myRow = (resp.mr && Array.isArray(resp.mr.l) && resp.mr.l.length) ? resp.mr.l[0] : null;
                if (myRow && myRow.a != null && typeof window.mrPersistMyEinMR === "function") {
                    try { window.mrPersistMyEinMR(myRow); } catch (eM) { }
                }
                if (typeof mrRenderList === "function") { try { await mrRenderList(true); } catch (eR) { } }
                return;
            }
            //the unlocked profile row was just written to "mr", so the record-based
            //count drops by one. The fn 66 reply may also carry the member's own row
            //with updated totals.
            var own = findOwnRowInResp(resp);
            if (own) persistMyEinMR(own);
            lastCountsAt = Date.now();
            //unlock only: re-render the open detail modal to view from the freshly stored row
            if (typeof window.showProfileDtls === "function") await window.showProfileDtls(id);
            //unlock only: server signals "count is finished / please subscribe" with a "5," in cd
            if (resp.cd && String(resp.cd).indexOf("5,") !== -1 && resp.ms) {
                await window.showConfirmModal(resp.ms);
                var c = await computeCounts();
                openPlansModal(c && c.canUnlock ? 0 : 1);
            } else {
                toast("Profile count used successfully!", "success");
            }
        } else {
            window.showelsemodal((resp && (resp.ms || resp.m)) || "Unlock failed", "error");
        }
    }

    /* ---- entry point --------------------------------------------------------------- */
    async function showProfileDtls(profileId) {
        ensureCss();
        if (myEinMR === undefined || !Object.keys(myEinMR).length) loadStoredMyEinMR();
        await getFullData(true);
        //prime the sync used-count cache for the unlock sound
        try { await readUsedCount(); } catch (eU) { }

        var idStr = String(profileId);
        var profileData = (proflFullData || []).find(function (p) { return p && String(p.a) === idStr; });
        var unlocked = !!profileData;
        if (!profileData) {
            profileData = (typeof profilesData !== "undefined" && Array.isArray(profilesData) ? profilesData : [])
                .find(function (p) { return p && String(p.a) === idStr; });
        }
        if (!profileData) { toast("Profile not found", "error"); return; }
        await openDetailModal(profileData, unlocked);
    }

    loadStoredMyEinMR();

    /* re-expose on window: real showProfileDtls replaces the mr.js lazy stub, and the
     * loader row (csh a:55) uses mrPrflReady / mrShowProfileDtlsLazy to know when to run. */
    window.showProfileDtls = showProfileDtls;
    window.mrShowProfileDtlsLazy = showProfileDtls;
    window.mrPrflReady = function () { return true; };
    window.confirmUnlockProfile = requestUnlock;
    window.chkMyCount = refreshCounts;
    window.useOrSetAsideProfile = function (profileId) { return doUnlock(profileId == null ? currentProfileId : profileId); };
})();
