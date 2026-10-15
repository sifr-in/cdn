/* ==========================================================================================
 * git/prfl.js - View Profile detail modal + unlock system (new design).
 * Ported from the old app's showProfileDtls / confirmUnlockProfile / useOrSetAsideProfile /
 * chkMyCount (git/mr.js), rebuilt on the regis.js (rg-) design and the new mr.da key layout.
 *
 * Server contract (unchanged from the old app):
 *   - fn 70 (chkMyCount)      -> response.mr.l[0] is the caller's own profile; .d1 = purchased
 *                                unlock count. Persisted to localStorage "<tn>_myEinMR".
 *   - fn 66 (unlock)          -> x1 = {a:<proflId>}, x2 = "mu"; response.mr.l carries the full
 *                                row which is written to the Dexie "mr" table.
 *   - Dexie "mr" table        -> holds ONLY full rows (own profile + unlocked profiles), so a
 *                                profile is "unlocked" when it is found there.
 * ========================================================================================== */
(function () {
    "use strict";

    var API = "https://my1.in/2/c.php";
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

    function P() {
        try { return window[window.my1uzr.worknOnPg] || {}; } catch (e) { return {}; }
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
        try { return !!(window.my1uzr && window.my1uzr.mk); } catch (e) { return false; }
    }

    /* ---- persistence -------------------------------------------------------------- */
    function loadStoredMyEinMR() {
        try {
            var tn = ownerTn();
            var stored = tn ? localStorage.getItem(tn + "_myEinMR") : null;
            if (stored && stored !== "undefined" && stored !== "null") myEinMR = JSON.parse(stored) || {};
        } catch (e) { myEinMR = {}; }
        profileUnlockCount = Number(myEinMR.d1) || 0;
        freeProfileCount = Number(myEinMR.c7) || 0;
    }
    function persistMyEinMR(row) {
        myEinMR = row || {};
        profileUnlockCount = Number(myEinMR.d1) || 0;
        freeProfileCount = Number(myEinMR.c7) || 0;
        try {
            var tn = ownerTn();
            if (row && tn) localStorage.setItem(tn + "_myEinMR", JSON.stringify(row));
        } catch (e) { }
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

    function computeCounts() {
        var used = (proflFullData || []).length;
        if (myEinMR && myEinMR.a) used = Math.max(0, used - 1);
        //free (c7) is consumed before paid (d1)
        var freeTotal = freeProfileCount;
        var paidTotal = profileUnlockCount;
        var freeUsed = Math.min(used, freeTotal);
        var freeRemaining = freeTotal - freeUsed;
        var paidUsed = Math.max(0, used - freeTotal);
        var paidRemaining = paidTotal - paidUsed;
        remainingProflCnt = freeRemaining + paidRemaining;
        return {
            freeTotal: freeTotal, paidTotal: paidTotal,
            freeUsed: freeUsed, paidUsed: paidUsed,
            freeRemaining: freeRemaining, paidRemaining: paidRemaining,
            used: used, remaining: remainingProflCnt
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
        if (String(profile.qa || "").trim()) badges += '<span class="mrd-badge mrd-badge--v"><i class="fas fa-circle-check"></i>Verified</span>';
        if (profile.i && parseFloat(profile.i) > 0) badges += '<span class="mrd-badge mrd-badge--p"><i class="fas fa-crown"></i>Premium</span>';
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
            ? window.mrParseGalleryImages(profile.b6) : [];
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
        if (typeof window.applyProfileImageData === "function") { try { window.applyProfileImageData(profileData); } catch (e) { } }

        var isMine = !!(myEinMR && myEinMR.a && String(myEinMR.a) === String(profileData.a));
        var fullAccess = unlocked || isMine;
        //detail rows come from colsToDispOnCard (+ colsToDispOnCardOnMoreBtn behind the
        //"more" button); locked and unlocked show the same fields - the lock only adds
        //the banner / unlock action
        var hideCsv = "";
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
    async function refreshCounts() {
        var ok = false;
        try {
            var resp = await window.fnj3(API, buildPayload(70), 1, true, null, 20000, 0, 1, 1, 1);
            if (resp && resp.su == 1) {
                ok = true;
                if (resp.mr && resp.mr.l && resp.mr.l.length) {
                    persistMyEinMR(resp.mr.l[0]);
                    try { await dbDexieManager.insertToDexie(window.dbnm, "mr", resp.mr.l, true, ["a"]); } catch (e) { }
                }
            }
        } catch (e) { console.warn("prfl: refreshCounts failed", e); }
        proflFullData = null;
        await getFullData(true);
        return ok ? computeCounts() : null;
    }

    //unlock confirmation: ask once with window.showConfirmModal, then spend a count.
    //The fnj3 (fn 66) endpoint call itself lives in doUnlock below.
    async function requestUnlock(profileId) {
        if (profileId == null || profileId === "") profileId = currentProfileId;
        if (profileId == null || profileId === "") { toast("Profile not found", "error"); return; }
        currentProfileId = profileId;

        var c = computeCounts();
        //if (!c || c.remaining <= 0) { toast("Your profile count limit is finished", "error"); return; }
        if (typeof window.showConfirmModal !== "function") { toast("Confirm modal is unavailable", "error"); return; }

        if(c.remaining > 0){
        var ok = await window.showConfirmModal(
            "Are you sure you want to unlock this profile?\n\n" +
            "After unlocking, you can see only the information filled by this member.\n" +
            "You have " + c.remaining + " profile view count(s) remaining."
        );
        if (!ok) return;
    }
        await doUnlock(profileId);
    }

    async function doUnlock(profileId) {
        var c = computeCounts();
        if(c.remaining > 0){
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
        }else{
            openPlansModal(0);
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
                //shared: persist the mr row(s) + refresh in-memory data
                if (resp.mr && resp.mr.l) {
                    try { await dbDexieManager.insertToDexie(window.dbnm, "mr", resp.mr.l, true, ["a"]); } catch (e) { }
                }
                proflFullData = null;
                try { await getFullData(true); } catch (e) { }

                //my1lo login "quick result": remember the member's own row + refresh the card list
                if (!isUnlock) {
                    var myRow = (resp.mr && Array.isArray(resp.mr.l) && resp.mr.l.length) ? resp.mr.l[0] : null;
                    if (myRow && myRow.a != null && typeof window.mrPersistMyEinMR === "function") {
                        try { window.mrPersistMyEinMR(myRow); } catch (eM) { }
                    }
                    if (typeof mrRenderList === "function") { try { await mrRenderList(true); } catch (eR) { } }
                    return;
                }

                //unlock only: re-render the open detail modal to view from the freshly stored row
                if (typeof window.showProfileDtls === "function") await window.showProfileDtls(id);
                //unlock only: server signals "count is finished / please subscribe" with a "5," in cd
                if (resp.cd && String(resp.cd).indexOf("5,") !== -1 && resp.ms) {
                    await window.showConfirmModal(resp.ms);
                    var c = computeCounts();
                    openPlansModal(c && c.remaining > 0 ? 0 : 1);
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
