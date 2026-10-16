/* active-filter dot on the nav's filter button: any non-empty entry in
 * P.activeFilters (set by git/fltr.js) marks the button. Ported from the old app. */
(function () {
    function u() {
        try {
            var btn = document.querySelector('.app-nav__filter');
            if (!btn) return;
            var wk = window[window.my1uzr && window.my1uzr.worknOnPg];
            var has = false;
            if (wk && wk.activeFilters) {
                var f = wk.activeFilters;
                for (var k in f) {
                    if (!Object.prototype.hasOwnProperty.call(f, k)) continue;
                    var v = f[k];
                    if (v === '' || v == null || v === undefined) continue;
                    if (Array.isArray(v)) { if (v.length > 0) { has = true; break; } }
                    else if (typeof v === 'object') { if (Object.keys(v).length > 0) { has = true; break; } }
                    else { has = true; break; }
                }
            }
            var b = document.getElementById('filterActiveBadge');
            if (has) {
                if (!b) {
                    b = document.createElement('span');
                    b.id = 'filterActiveBadge';
                    b.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
                    b.style.cssText = 'font-size:9px;padding:2px 6px;z-index:5;';
                    b.textContent = 'filter';
                    btn.style.position = 'relative';
                    btn.appendChild(b);
                }
            } else if (b) { b.remove(); }
        } catch (e) { }
    }
    window.__mrUpdateFilterBadge = u;
    setInterval(u, 1000);
    setTimeout(u, 500);
})();

const tblsRequired = ["f", "fp", "ma", "mr", "c", "mp", "mr_h", "mq", "mu"];
const moduLst = [
 { a: ",60,61,62,63,65,67,", b: "Dashboard", c: "fa-chart-line", d: "aminPnl", e: "#9c6f7fea", cid: 130 }
];
//67 admin margae buraro mark record as delete by amdin
//65 admin update given marage plan
//63 admin update specific marage profile entry
//62 admin add new profile
//61 admin get all marage plans
//60 admin get all mmarage recornes
//public 70 get all my profile on my mobile number
//public 66 short list (ma) and use count
//bubilc 64 get 50 in marage entrys
//pubilc 68 user update prorile
//public 69 delete profile by profile owner
const inTbls = ["dontCret~", "pubilc~64,66,67,68,69,70,118", "2/e-60~mr,c", "2/g-61~mp", "2/f-62~mr", "2/c-63~mr", "2/g-64~mr", "2/e-65~mp", "2/c-66~mu,mr,ma", "2/h-67~mr", "2/c-68~mr,mr_h,mq", "2/c-69~mr", "2/c-70~mr", "4/a-118~"];//118 for get image id
const cust_const = [
 { "a": "paymentGatewayIntegrated", "b": 0, "c": "more customiztaion", "d": "if value is 1 payment gatewy will be shown, else manual", "u": "url-explaining-video" },
 { "a": "paymentRequiresProfile", "b": 0, "c": "", "d": "if value is 1 & payment gatewy on then will be users registration or profile is requred to use gatway, else cotinue as is", "u": "url-explaining-video" },
 { "a": "freeCnt", "b": 0, "c": "", "d": "free count to be given when profile is created fn-68 or plan-check--1", "u": "url-explaining-video" }
];
moduLst.hook = "onModuLstAllowed2";
window[my1uzr.worknOnPg].moduLst = moduLst;
window[my1uzr.worknOnPg].onModuLstAllowed2 = function (allowedModules) {
 window[my1uzr.worknOnPg].allowedModulesMenuItems = allowedModules || [];
};

/* ==========================================================================================
 * SHARED INIT - single copy, used by BOTH the public and the admin app.
 * Everything that used to be declared twice (once per branch) lives here exactly once.
 * Only values that genuinely differ per app live in MR_MODE_CFG below.
 * ========================================================================================== */
const imgObjDimensRqd = ["1080x720px~1-124kb", "1920x1080px~1-250kb"];
window.imgObjDimensRqd = imgObjDimensRqd;
//shared constants
const sho_da_tkLimit = 1;
let appData = {};
const ids_of_views = [3];
let tblFailureCount = 1;
const cacheVersion = 1763390987;
const cacheStrategy = 1;
const dontShoLoginConfirmation = 1;
const dontRestartAfterLogin = 1;
let profilesData = [];
let __mrLocalProfilesMerged = false;
window[my1uzr.worknOnPg].flsht = 3;
window[my1uzr.worknOnPg].lodErrMs = "press back back & open the app again;";
window[my1uzr.worknOnPg].emptBodyMs = "welcome to 'sifr' matrimoney app;";
window[my1uzr.worknOnPg].cardHeight = 60;
window[my1uzr.worknOnPg].nonEditableFields = ['a', 'b', 'c', 'k', 'k1'];
window[my1uzr.worknOnPg].defaFieldVals = ['k1~9'];
window[my1uzr.worknOnPg].seqnce = "u,ut,b6,a5,l,a7,m,n";
window[my1uzr.worknOnPg].bdayFormat = "dd-mm-yyyy";

window[my1uzr.worknOnPg].csh = [
    { a: 1, u: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" },
    { a: 2, u: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" },
    { a: 3, u: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" },
    { a: 4, u: "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
    { a: 5, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1e1e550/cmn/my1xi.min.js" },
    { a: 6, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/cmn/my1lp.min.js", c: "open_shoLgnP", r: "open_shoLgnP" },
    { a: 7, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@12258e0/cmn/my1lo.min.js", c: "open_shoLgnO", r: "open_shoLgnO" },
    { a: 8, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/cmn/conta.min.js", c: "showContactModal", r: "showContactModal" },
    { a: 9, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/cmn/my1img.js", c: "open_addimage", r: "open_addimage" },
    { a: 10, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@a813e1f/cmn/my1ctr.js", c: "open_my1ctr", r: "open_my1ctr" },
    { a: 12, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/mr/fltr.js", c: "showFilterBox", r: "showFilterBox" },
    { a: 13, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/mr/drwr.js", c: "showDrawer", r: "showDrawer" },
    { a: 14, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/mr/regis.js", c: "showRegistrationModal", r: "showRegistrationModal" },
    { a: 17, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/mr/plans.js", c: "showMarriagePlans", r: "showMarriagePlans" },
    { a: 55, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/mr/prfl.js", c: "mrPrflReady", r: "mrShowProfileDtlsLazy" },
    { a: 15, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@555db4d/cmn/ei.min.js", c: "open_entind_crud", r: "open_entind_crud" },
    { a: 39, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/mr/slkt.js", c: "openCommonSelectionModal", r: "openCommonSelectionModal" },
    { a: 47, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/mr/slkt2.js", c: "setValByPrprtyDepthToElm", r: "setValByPrprtyDepthToElm" },
    { a: 48, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/mr/admr.js", c: "openMrAdmin", r: "openMrAdmin" },
    { a: 18, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6a12ce/cmn/caste.da" },
    { a: 19, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b39a4af/cmn/ctco.da" },
    { a: 20, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/abot.js", c: "set_abot_us_innerHTML", r: "set_abot_us_innerHTML" },
    { a: 24, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@b6da9c0/mr/chldpol.js", c: "set_child_safety_pol_innerHTML", r: "set_child_safety_pol_innerHTML" },
    { a: 31, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@666354f/cmn/degs.da" },
    { a: 33, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@0208362/cmn/occu.da" },
    { a: 45, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/cmn/intal.da" },
    { a: 22, u: "https://cdn.jsdelivr.net/gh/sifr-in/cdn@8ca71f7/cmn/my1ap.min.js" }
];

/* ------------------------------------------------------------------------------------------
 * PhonePe return: when the return page hands us window.ppPostData = { orderId }, post it to
 * fn 70 (chkMyCount) so the server credits the purchased unlock count, persist the response and
 * tell the member. Called on init; a no-op when window.ppPostData is absent.
 * ---------------------------------------------------------------------------------------- */
async function showPhonePePostData() {
    var data = window.ppPostData;
    if (!data) return false;
    window.ppPostData = null;
    try {
        history.replaceState({}, "", window.location.pathname + window.location.hash);
        if (typeof clearPayload0 === "function") clearPayload0();
        if (!window.payload0) window.payload0 = {};
        var p = window.payload0;
        p.vw = 4;
        p.fn = 70;                       //fn 70 = chkMyCount -> credits the paid unlock count
        p.x1 = data.orderId;
        if (typeof dbDexieManager !== "undefined" && dbDexieManager &&
            typeof dbDexieManager.getMaxDateRecords === "function") {
            try { p.la = await dbDexieManager.getMaxDateRecords(window.dbnm, [{ tb: "mr" }]); } catch (eL) { }
        }
        var resp = await fnj3("https://my1.in/2/c.php", p, 1, true, null, 20000, 0, 2, 1, 1);
        if (resp && resp.su == 1) {
            if (typeof handl_mr_rspons === "function") { await handl_mr_rspons(resp); }
            if (typeof window.showsuccessmodal === "function") {
                window.showsuccessmodal("Payment successful! Your profile unlock count has been added.");
            }
        } else if (typeof window.showelsemodal === "function") {
            window.showelsemodal((resp && (resp.ms || resp.m)) || "Could not confirm your payment. Please contact support.");
        }
        return true;
    } catch (err) {
        if (typeof window.showelsemodal === "function") {
            window.showelsemodal("Error: " + ((err && err.message) || err));
        }
        return false;
    }
}
window.showPhonePePostData = showPhonePePostData;

(async function initMr() {
try {
    let result1 = await loadCshScriptsSequentially(1, 2, 3, 4, 5);//here keep only that no have c, r other must used with loadExe2fn for call
    if (!result1.success) throw new Error("Failed to load required scripts: " + result1.error);

    console.log("ðŸ“¦ Creating database tables for:", dbnm);

    const createResult = await dbDexieManager.handleNwTables("loader", dbnm, tblsRequired);
    console.log("âœ… Database initialized:", dbnm, "| Failure count:", createResult.failureCount);

    var hook = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg][moduLst.hook];
    var existing = window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].allowedModulesMenuItems;
    var missing = typeof existing === 'undefined' || existing === null || existing === '' || (Array.isArray(existing) && existing.length === 0);

    if (typeof hook === 'function' && missing) {
        var permitted = await chkModuLstAgainstFNF(moduLst);
        hook(permitted);
    }

    var resp = await fetch("mr.da");
    if (!resp.ok) throw new Error("HTTP " + resp.status);

    var cfg = await resp.json();
    if (!cfg || typeof cfg !== "object") throw new Error("bad config");

    window[my1uzr.worknOnPg].clientConfig = cfg;
} catch (e) {
    console.error("Failed to initialize:", e);
    window[my1uzr.worknOnPg].clientConfig = {};
}
//background preload of all wajiw sounds (fire-and-forget) so playback is instant later
try {
    if (typeof preloadWajiwSounds === "function") {
        preloadWajiwSounds((window[my1uzr.worknOnPg].clientConfig || {}).wajiw || []);
    }
} catch (ePW) {
    console.error("wajiw preload failed:", ePW);
}
//runs on both paths: theme + shell must land even if mr.da fetch failed
try {
    var __cfg = window[my1uzr.worknOnPg].clientConfig || {};
    __mrApplyCardConfig(__cfg);
    __mrInjectAppCss();
    __mrRenderShell();
} catch (e2) {
    console.error("theme/shell render failed:", e2);
}
//payment return: the PhonePe return page may have handed us window.ppPostData -> credit the count
try { if (typeof showPhonePePostData === "function") showPhonePePostData(); } catch (ePP) { console.error("phonepe post failed:", ePP); }
//lookups must be on window before the first cards render, or the first paint
//prints blank religion/city/degree facts (localStorage hits resolve instantly)
try {
    await __mrPrepLookups();
} catch (e2b) {
    console.error("lookup load failed:", e2b);
}
//list render runs on both paths: it shows its own error state when the pull fails.
//mr.js is loaded from <head>, so the shell may still be waiting on DOMContentLoaded;
//poll for #main-content instead of rendering into nothing.
try {
    for (var __w = 0; __w < 100 && !document.getElementById('main-content'); __w++) {
        await new Promise(function (r) { setTimeout(r, 50); });
    }
    await mrRenderList();
} catch (e3) {
    console.error("list render failed:", e3);
}
})();

/* ==========================================================================================
 * STEP 1 - theme injection + shell view (navbar + footer).
 * The appcss string below is never injected by my1e3.js (my1e3 only sets it to null and
 * my1lp/my1lo read it for the login theme), so the page must inject it itself, after
 * Bootstrap (csh 1) is in the cascade, or none of the design reaches the document.
 * ========================================================================================== */
function __mrEscHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

var __mrAppCssTries = 0;
function __mrInjectAppCss() {
    if (document.getElementById('mr-appcss')) return;
    if (typeof appcss !== 'string' || !appcss) {
        //appcss is assigned later in this same file; retry a few times, then give up
        if (++__mrAppCssTries <= 100) setTimeout(__mrInjectAppCss, 50);
        return;
    }
    var st = document.createElement('style');
    st.id = 'mr-appcss';
    st.textContent = appcss;
    document.head.appendChild(st);
    try {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', '#8B1E3F');
    } catch (e) { }
}

function createNavigationBar(cfg) {
    var navBar = document.createElement('nav');
    navBar.id = 'mr-navbar';
    navBar.className = 'navbar app-navbar';
    navBar.innerHTML = `
        <div class="container-fluid app-nav">
            <div class="app-nav__left">
                <button class="app-nav__icon app-nav__menu" type="button" title="Menu"
                        aria-label="Open menu"
                        onclick="(async () => { await loadExe2Fn(13, [], [1]); })()">
                    <i class="fas fa-bars fa-lg"></i>
                </button>
                <button class="app-nav__brand" type="button" title="Account"
                        onclick="(async () => { await loadExe2Fn(10, ['dv_to_set_open_my1ctr_processed', 0, 1, 2], [1]); })()">
                    <span id="navbarBusinessName"></span>
                </button>
            </div>
            <div class="app-nav__right">
                <button class="app-nav__icon app-nav__filter" type="button" title="Filters" aria-label="Filters"
                        onclick="(async () => { await loadExe2Fn(12, [], [1]); })()">
                    <i class="fas fa-filter fa-lg"></i>
                </button>
            </div>
        </div>
    `;
    var nameEl = navBar.querySelector('#navbarBusinessName');
    if (nameEl) nameEl.textContent = (cfg && cfg.business) ? String(cfg.business) : '';
    return navBar;
}

function createFooter(cfg) {
    var business = (cfg && cfg.business) ? String(cfg.business) : 'Matrimony App';
    var prvcFl = (cfg && cfg.prvcFl) ? String(cfg.prvcFl) : 'privacy-policy.html';
    var trmsFl = (cfg && cfg.trmsFl) ? String(cfg.trmsFl) : 'terms-and-conditions.html';
    var rfndFl = (cfg && cfg.rfndFl) ? String(cfg.rfndFl) : 'refund-policy.html';
    var footer = document.createElement('footer');
    footer.id = 'mr-footer';
    footer.className = 'app-footer';
    footer.innerHTML = `
        <div class="container">
            <div class="app-footer__brand">${__mrEscHtml(business)}</div>
            <div class="app-footer__links">
                <a href="${__mrEscHtml(prvcFl)}">Privacy</a>
                <a href="${__mrEscHtml(trmsFl)}">Terms</a>
                <a href="${__mrEscHtml(rfndFl)}">Refund</a>
            </div>
            <p class="app-footer__copy">&copy; ${new Date().getFullYear()} ${__mrEscHtml(business)} by sifr. All rights reserved.</p>
        </div>
    `;
    return footer;
}

//nav -> empty #main-content (step 4 fills the grid) -> footer, exactly once.
function __mrRenderShell() {
    function render() {
        if (!document.body || document.getElementById('mr-navbar')) return;
        var cfg = window[my1uzr.worknOnPg].clientConfig || {};
        document.body.appendChild(createNavigationBar(cfg));
        var main = document.createElement('div');
        main.id = 'main-content';
        document.body.appendChild(main);
        document.body.appendChild(createFooter(cfg));
    }
    if (document.body) render();
    else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
}

/* ==========================================================================================
 * STEP 2 (minimal) - the keys the card list actually reads.
 * Full mr.da application (appInfo, cardAnim, colsToDispOnCard, validators...) comes later.
 * ========================================================================================== */
function __mrApplyCardConfig(cfg) {
    const P = window[my1uzr.worknOnPg];
    cfg = cfg || {};
    //mr.da is flat now (business/owner/mail/... at the top level), so the whole config is
    //the "appInfo" object the drawer's About/Child-Safety modules (csh 20/24) expect.
    P.appInfo = cfg;
    P.pullWhenCardsRemain = (cfg.pullWhenCardsRemain != null) ? cfg.pullWhenCardsRemain : 6;
    //detail-view keys: rows come from colsToDispOnCard / colsToDispOnCardOnMoreBtn,
    //read straight from clientConfig by git/regis.js
    P.showTableViewOnCardClick = (cfg.showTableViewOnCardClick != null) ? cfg.showTableViewOnCardClick : 1;
    P.fieldsOnCard = cfg.fieldsOnCard || "m~s~g,h,'budhdhist',k2,b4";
    P.cardExtras = cfg.cardExtras || { bio: "", online: "", match: "" };
    P.shoBadge = cfg.shoBadge || "qa";
    //Font Awesome icon suffix (after "fa-") per card meta chip, keyed by field token
    P.cardMetaIcons = cfg.cardMetaIcons || {};
    window.var_sub_caste_type = cfg.var_sub_caste_type || [
        { "a": 0, "e": "" }, { "a": 1, "e": "Jamati" },
        { "a": 2, "e": "Ahle hadees" }, { "a": 3, "e": "Devbandi" }
    ];
}

//default card meta-chip icons; mr.da "cardMetaIcons" (keyed by field token k/g/h/s) overrides
const __MR_DEFAULT_META_ICONS = { k: "mosque", g: "calendar-days", h: "ruler-vertical", s: "graduation-cap" };
//Font Awesome icon suffix for one card meta chip (rendered as "fas fa-<suffix>")
function __mrMetaIcon(token) {
    const P = window[my1uzr.worknOnPg] || {};
    const m = P.cardMetaIcons || {};
    return m[token] || __MR_DEFAULT_META_ICONS[token] || 'circle';
}

/* ==========================================================================================
 * LOOKUPS - the four .da lists the card facts read (religion/caste, degrees, city,
 * native state/district). Ported from git/e.js: cmn_prep_data_set_to_var fetches the
 * JSON whose URL sits in csh[identifier].u, caches it in localStorage (memory-only on
 * quota overflow) and assigns it to window[varNm]. URL-only csh rows, never loaded
 * by a script loader.
 * ========================================================================================== */
window.marital_status = [
    { "a": 0, "e": "-" }, { "a": 1, "e": "Never Married" }, { "a": 2, "e": "Divorced" },
    { "a": 3, "e": "Widow/er" }, { "a": 4, "e": "In Marriage" }, { "a": 5, "e": "Annulled" },
    { "a": 6, "e": "Awaiting Divorce" }
];

async function cmn_prep_data_set_to_var(varNm, mode, identifier) {
    if (!window[varNm]) window[varNm] = null;

    const getUrlFromCsh = () => {
        const cshItem = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].csh)
            ? window[my1uzr.worknOnPg].csh.find(item => item.a === identifier) : null;
        return cshItem ? cshItem.u : null;
    };

    const safeStoreToLocalStorage = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            if (error && error.name === 'QuotaExceededError') {
                if (typeof showToast === 'function') {
                    showToast('LocalStorage quota exceeded! Data will be kept in memory only.', {
                        duration: 5000, position: 'top', type: 'warning', dismissible: true
                    });
                }
                return false;
            }
            console.error('Error storing to localStorage:', error);
            return false;
        }
    };

    const fetchAndStoreData = async (url) => {
        if (!url) {
            console.error('No URL found for identifier:', identifier);
            return null;
        }
        try {
            const response = await fetch(url);
            const data = await response.json();
            safeStoreToLocalStorage(varNm, data);
            window[varNm] = data;
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            if (typeof showToast === 'function') {
                showToast('Error fetching data for ' + varNm + ': ' + error.message, {
                    duration: 5000, position: 'top', type: 'error', dismissible: true
                });
            }
            return null;
        }
    };

    if (mode === 1) {
        const storedData = localStorage.getItem(varNm);
        if (storedData) {
            let parsedData = null;
            try {
                parsedData = JSON.parse(storedData);
                const isEmpty = parsedData === null || parsedData === undefined ||
                    (Array.isArray(parsedData) && parsedData.length === 0) ||
                    (typeof parsedData === 'object' && !Array.isArray(parsedData) && Object.keys(parsedData).length === 0);
                if (!isEmpty) {
                    window[varNm] = parsedData;
                    return parsedData;
                }
            } catch (e) {
                console.error('Error parsing localStorage data:', e);
                localStorage.removeItem(varNm);
            }
        }
        return await fetchAndStoreData(getUrlFromCsh());
    }
    if (mode === 2) {
        return await fetchAndStoreData(getUrlFromCsh());
    }
    console.error('Invalid mode:', mode);
    return null;
}
window.cmn_prep_data_set_to_var = cmn_prep_data_set_to_var;

//all four in parallel; awaited by initMr before the first card render, or the
//religion/city/degree facts print blank on the first paint
async function __mrPrepLookups() {
    try {
        await Promise.all([
            cmn_prep_data_set_to_var('var_caste_rlgns', 1, 18),
            cmn_prep_data_set_to_var('var_degres', 1, 31),
            cmn_prep_data_set_to_var('var_ctco', 1, 19),
            cmn_prep_data_set_to_var('mr_desig_posis', 1, 33),
            cmn_prep_data_set_to_var('var_intal', 1, 45)
        ]);
        //the filter's city list reads P.cty; hand it the lookup so it skips its own fetch
        const P = window[my1uzr.worknOnPg];
        if (P && !P.cty && Array.isArray(window.var_ctco)) P.cty = window.var_ctco;
    } catch (e) {
        console.error('lookup load failed:', e);
    }
}

/* ==========================================================================================
 * DATA - the ONE "response.su == 1" handler. Global, as git/e.js and the login scripts
 * expect to find it: su==1 -> store every table the response carries in IndexedDB,
 * otherwise -> error modal (showelsemodal, alert fallback).
 * ========================================================================================== */
function handl_mr_rspons(response) {
    return (async () => {
        try {
            if (response.su == 1) {
                if (response.ma != null && response.ma.l != null) {
                    await dbDexieManager.insertToDexie(dbnm, "ma", response.ma.l, true, ["a"]);
                }
                if (response.f != null && response.f.l != null) {
                    await dbDexieManager.insertToDexie(dbnm, "f", response.f.l, true, ["a"]);
                }
                if (response.fp != null && response.fp.l != null) {
                    await dbDexieManager.insertToDexie(dbnm, "fp", response.fp.l, true, ["a"]);
                }
                if (response.mr != null && response.mr.l != null) {
                    await dbDexieManager.insertToDexie(dbnm, "mr", response.mr.l, true, ["a"]);
                }
                if (response.c != null && response.c.l != null) {
                    await dbDexieManager.insertToDexie(dbnm, "c", response.c.l, true, ["a"]);
                }
                if (response.mp != null && response.mp.l != null) {
                    await dbDexieManager.insertToDexie(dbnm, "mp", response.mp.l, true, ["a"]);
                }
            } else {
                if (typeof window.showelsemodal === "function") {
                    window.showelsemodal(response.ms || response.m || "Operation failed");
                } else {
                    alert(response.ms || "Error occurred");
                }
            }
        } catch (error) {
            console.error("handl_mr_rspons error:", error);
            if (typeof window.showelsemodal === "function") {
                window.showelsemodal(error && error.message ? error.message : "Operation failed");
            } else {
                alert(error);
            }
        }
    })();
}
window.handl_mr_rspons = handl_mr_rspons;

/* find a marriage plan in the live config by its id (the "pid" the server echoes back) */
function __mrPlanByPid(pid) {
    try {
        const P = window[window.my1uzr.worknOnPg] || {};
        const list = (P.clientConfig || P.appInfo || {}).marriagePlans;
        if (!Array.isArray(list)) return null;
        return list.find(function (p) { return p && String(p.a) === String(pid); }) || null;
    } catch (e) { return null; }
}

/* ==========================================================================================
 * fn 70 (chkMyCount) response handler - my own profile row. Two callers:
 *   - "Already Registered Member" (git/regis.js): rows come under response.mr.l
 *   - get-data / free plan      (git/plans.js, cd:2): rows come at top-level response.l
 * Both shapes are normalised to response.mr, every table is stored, the member's own row
 * (pid) is remembered locally, and the list is re-rendered. Returns the own row (or null).
 * ========================================================================================== */
async function hndlRspo70(resp) {
    if (!(resp && resp.su == 1)) {
        if (typeof window.showelsemodal === "function") {
            window.showelsemodal((resp && (resp.ms || resp.m)) || "No registered profile found for this number.");
        }
        return null;
    }
    //cd:2 returns the member row at top-level "l"; handl_mr_rspons expects it under "mr"
    const topShape = (!resp.mr && Array.isArray(resp.l));
    if (topShape) resp.mr = { l: resp.l };

    if (typeof handl_mr_rspons === "function") {
        try { await handl_mr_rspons(resp); } catch (eH) { console.error(eH); }
    }
    //save local (<tn>_myEinMR) + window.myEinMR (pid)
    const myRow = (resp.mr && Array.isArray(resp.mr.l) && resp.mr.l.length) ? resp.mr.l[0] : null;
    if (myRow && myRow.a != null && typeof window.mrPersistMyEinMR === "function") {
        try { window.mrPersistMyEinMR(myRow); } catch (eP) { console.error(eP); }
    }
    //the server echoes the selected plan id as resp.pid; 0/absent = free or no plan -> no payment
    if (resp.pid != null && Number(resp.pid) !== 0 && typeof window.mrPayForPlan === "function") {
        const plan = __mrPlanByPid(resp.pid);
        if (plan) { try { window.mrPayForPlan(plan); } catch (ePay) { console.error(ePay); } }
    }
    //the "Already Registered" flow keeps its welcome toast; the cd:2 flow is silent (caller messages)
    if (!topShape && typeof showToast === "function") {
        showToast("Welcome back!", { type: "success", duration: 3000, position: "top" });
    }
    if (typeof activeClose === "function") { try { activeClose(); } catch (eC) { console.error(eC); } }
    if (typeof mrRenderList === "function") { try { await mrRenderList(true); } catch (eR) { console.error(eR); } }
    return myRow;
}
window.hndlRspo70 = hndlRspo70;

function __mrLowestProfileCursor() {
    let lowest = null;
    (profilesData || []).forEach(function (p) {
        if (!p || !p.b) return;
        const d = new Date(p.b);
        if (isNaN(d.getTime())) return;
        if (!lowest || d < lowest) lowest = d;
    });
    if (!lowest) return '';
    const pad = function (n) { return String(n).padStart(2, '0'); };
    return lowest.getFullYear() + '-' + pad(lowest.getMonth() + 1) + '-' + pad(lowest.getDate())
        + ' ' + pad(lowest.getHours()) + ':' + pad(lowest.getMinutes()) + ':' + pad(lowest.getSeconds());
}

async function pullProfiles(whr, reset) {
    try {
        payload0.vw = 4;
        payload0.fn = 64;
        payload0.x1 = (reset) ? '' : (__mrLowestProfileCursor() || '');
        payload0.whr = whr || '';
        const response = await fnj3("https://my1.in/2/g.php", payload0, 0, true, null, 20000, 0, 1, 1, 0);
        if (!(response && response.su == 1)) {
            if (typeof window.showelsemodal === "function") {
                window.showelsemodal((response && (response.ms || response.m)) || "Request failed");
            } else { alert((response && response.ms) || "Request failed"); }
        }
        if (response.su == 1) {
            const rows = (response.mr && response.mr.l) ? response.mr.l : [];
            const profiles = rows.map(applyProfileImageData);
            if (profiles.length === 0) {
                console.warn("[mr] g.php su=1 but carried no rows. whr=" + JSON.stringify(payload0.whr)
                    + " x1=" + JSON.stringify(payload0.x1));
            }
            return {
                profiles: profiles,
                hasMore: !!((response.mr && response.mr.hasMore) || profiles.length > 0),
                ok: true
            };
        }
        return { profiles: [], hasMore: false, ok: false };
    } catch (error) {
        console.warn("g.php request failed:", error && error.message);
        if (typeof window.showelsemodal === "function") {
            window.showelsemodal(error && error.message ? error.message : "Request failed");
        } else {
            alert(error);
        }
        return { profiles: [], hasMore: false, ok: false };
    }
}

/* git/fltr.js compat: the old filter calls pullNwProfiles(whereClause, true) and
 * initLazyLoadImages(); the first is pullProfiles under its old name (identical
 * signature and return shape), the second is a no-op because every card image is
 * natively lazy-loaded. */
window.pullNwProfiles = pullProfiles;
window.initLazyLoadImages = function () { };

/* ==========================================================================================
 * HELPERS - image tokens, card value formatting, reload.
 * ========================================================================================== */
//Builds a Drive URL for one token of the `u` / `b6` value (the leading marker like
//"1_" is part of the stored id). Already-URL / data: values pass through.
window.mrDriveUrlFromToken = function (token) {
    if (token == null) return null;
    var t = String(token).trim();
    if (!t) return null;
    if (t.indexOf('://') !== -1 || t.indexOf('data:') === 0) return t;
    if (!/^[A-Za-z0-9_-]{20,}$/.test(t)) return null;
    return 'https://lh3.googleusercontent.com/d/' + t + '=s0?authuser=0';
};

//getGoogleDriveImageUrl hands back anything that is not a bare Drive id exactly as it
//came in, and every caller here puts the result straight into an img src - so an
//unrecognised value must become null, otherwise a half-written field is a broken image.
window.mrImgSrcOrNull = function (value) {
    if (value == null) return null;
    var v = String(value).trim();
    if (!v) return null;
    if (v.indexOf('://') !== -1 || v.indexOf('data:') === 0 || v.indexOf('blob:') === 0) { return v; }
    return null;
};

//getGoogleDriveImageUrl splits on whitespace and hands back the SECOND token when its
//second argument is set. This app stores `u` as "display thumbnail" - token 1 is the
//display copy, token 2 the thumbnail - which matches the {a,b} object form, so the
//isThumb flag is forwarded as-is. mrDriveUrlFromToken stays as the fallback for a
//my1e3.js too old to carry the helper; it ignores the second argument, which costs us
//pairs and nothing else.
window.mrUrlFromU = function (value, isThumb) {
    var fn = (typeof window.getGoogleDriveImageUrl === 'function')
        ? window.getGoogleDriveImageUrl
        : window.mrDriveUrlFromToken;
    return window.mrImgSrcOrNull(fn(value, isThumb));
};

//Resolves a raw `u` value into { display, thumbnail }. Four shapes are accepted:
//a bare Drive file id, two space separated ids ("display thumbnail" - token 1 is the
//display copy, token 2 the thumbnail), an already complete url or data url, and the
//{a: display, b: thumbnail} object as a real object or as a JSON string.
window.mrResolveProfileImages = function (value) {
    var out = { display: null, thumbnail: null };
    if (value == null) return out;

    if (typeof value === 'object') {
        out.display = window.mrUrlFromU(value.a, false);
        out.thumbnail = window.mrUrlFromU(value.b, true) || out.display;
        return out;
    }

    var raw = String(value).trim();
    if (!raw) return out;
    if (raw.charAt(0) === '{') {
        try { return window.mrResolveProfileImages(JSON.parse(raw)); } catch (e) { }
    }

    out.thumbnail = window.mrUrlFromU(raw, true);
    out.display = window.mrUrlFromU(raw, false) || out.thumbnail;
    return out;
};

//Normalises the `b6` gallery value into a flat array of image tokens. The stored
//shape has drifted between app versions, so accept all of them: a real array, a JSON
//string ("[...]"), a JSON string of objects, and a plain comma/space separated list.
//Each entry may itself be a bare token, a URL or the legacy {a,b} pair - callers run
//the result through mrResolveProfileImages, so the raw entry is returned untouched.
window.mrParseGalleryImages = function (value) {
    var out = [];
    function push(v) {
        if (v === null || v === undefined) return;
        if (typeof v === "object") {
            var src = (v.a != null && v.a !== "") ? v.a : ((v.b != null && v.b !== "") ? v.b : (v.url != null ? v.url : null));
            if (src != null) out.push(src);
            return;
        }
        var s = String(v).trim();
        if (s) out.push(s);
    }
    if (value === null || value === undefined || value === "") return out;
    if (Array.isArray(value)) { value.forEach(push); return out; }
    if (typeof value === "object") { push(value); return out; }
    var raw = String(value).trim();
    if (!raw) return out;
    if (raw.charAt(0) === "[") {
        try { return window.mrParseGalleryImages(JSON.parse(raw)); } catch (e) { }
    }
    if (raw.charAt(0) === "{") {
        try { push(JSON.parse(raw)); return out; } catch (e) { }
    }
    //comma / newline separated list of tokens, URLs or JSON object fragments
    raw.split(/[\n\r,]+/).forEach(function (part) {
        if (!part) return;
        if (part.charAt(0) === "{") {
            try { push(JSON.parse(part)); return; } catch (e) { }
        }
        push(part);
    });
    return out;
};

//Serialises the gallery tokens for storage. The app stores `b6` as a JSON array
//string, matching the hidden input the registration form submits.
window.mrSerializeGalleryImages = function (arr) {
    var list = window.mrParseGalleryImages(arr);
    return JSON.stringify(list);
};

//Stamps profile.thumbnail / profile.originalImage from `u`, falling back to `ut`
//and finally to an inline "Image Not Available" placeholder.
function applyProfileImageData(profile) {
    const imageData = window.mrResolveProfileImages(profile.u);
    if (imageData.thumbnail) {
        profile.thumbnail = imageData.thumbnail;
        profile.originalImage = imageData.display || imageData.thumbnail;
    } else if (profile.ut) {
        profile.thumbnail = profile.ut;
        profile.originalImage = profile.ut;
    } else {
        profile.thumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFMEUwRTAiLz48dGV4dCB4PSIxNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdDwvdGV4dD48dGV4dCB4PSIxNTAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
        profile.originalImage = null;
    }
    return profile;
}
window.applyProfileImageData = applyProfileImageData;

//Persistent image cache + lazy loader. The first load fetches once into the Cache
//Storage bucket "mr-img-v1"; later views (same session or after reload) are served from
//cache as an object URL. Falls back to the plain URL whenever the Cache API or CORS is
//unavailable, so a dead cache never breaks an image.
window.mrImg = (function () {
    var CACHE = "mr-img-v1", mem = Object.create(null), busy = Object.create(null);

    function load(url) {
        if (url == null) return Promise.resolve(url);
        url = String(url);
        if (!url || url.indexOf("data:") === 0 || url.indexOf("blob:") === 0) return Promise.resolve(url);
        if (mem[url]) return Promise.resolve(mem[url]);
        if (busy[url]) return busy[url];
        busy[url] = new Promise(function (resolve) {
            var open = (window.caches && typeof fetch === "function") ? caches.open(CACHE) : Promise.reject();
            open.then(function (c) {
                return c.match(url).then(function (hit) {
                    if (hit) return hit;
                    return fetch(url, { mode: "cors", credentials: "omit" }).then(function (res) {
                        if (res && res.ok) { try { c.put(url, res.clone()); } catch (e) { } }
                        return res;
                    });
                });
            }).then(function (res) {
                if (!res) throw new Error("no-response");
                return res.blob();
            }).then(function (blob) {
                if (!blob || !blob.size) throw new Error("empty-blob");
                mem[url] = URL.createObjectURL(blob);
                resolve(mem[url]);
            }).catch(function () { resolve(url); });
        });
        busy[url].then(function () { delete busy[url]; });
        return busy[url];
    }

    function reveal(im) {
        var url = im.getAttribute("data-lazy");
        if (!url) return;
        im.removeAttribute("data-lazy");
        load(url).then(function (u) { im.src = u; });
    }

    var io = null;
    function hydrate(root) {
        var imgs = (root || document).querySelectorAll("img[data-lazy]");
        if (!imgs.length) return;
        if (typeof IntersectionObserver !== "function") { Array.prototype.forEach.call(imgs, reveal); return; }
        if (!io) io = new IntersectionObserver(function (es) {
            es.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); reveal(en.target); } });
        }, { rootMargin: "300px 0px" });
        Array.prototype.forEach.call(imgs, function (im) { io.observe(im); });
    }

    return { load: load, hydrate: hydrate };
})();

function calculateAge(value) {
    try {
        if (value === null || value === undefined || value === '') return 'Unknown';
        var y, m, d;
        if (value instanceof Date) {
            if (isNaN(value.getTime())) return 'Unknown';
            y = value.getFullYear(); m = value.getMonth() + 1; d = value.getDate();
        } else if (typeof value === 'number') {
            var dn = new Date(value);
            if (isNaN(dn.getTime())) return 'Unknown';
            y = dn.getFullYear(); m = dn.getMonth() + 1; d = dn.getDate();
        } else {
            var s = String(value).trim();
            var a = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
            if (a) { y = +a[1]; m = +a[2]; d = +a[3]; }
            else {
                var b = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/);
                if (!b) return 'Unknown';
                d = +b[1]; m = +b[2]; y = +b[3];
            }
        }
        if (!y || m < 1 || m > 12 || d < 1 || d > 31) return 'Unknown';
        var today = new Date();
        var age = today.getFullYear() - y;
        var md = (today.getMonth() + 1) - m;
        if (md < 0 || (md === 0 && today.getDate() < d)) age--;
        return age < 1 ? 'Unknown' : age;
    } catch (e) {
        return 'Unknown';
    }
}

function formatHeight(height) {
    const feet = Math.floor(height);
    const inches = Math.round((height - feet) * 12);
    return feet + "' " + inches + '"';
}

function formatPackage(packageValue) {
    const n = parseFloat(packageValue);
    if (!n || n <= 0) return '';
    return "â‚¹" + packageValue + " Lakhs";
}

//name from a comma path ("id,id,id") against a nested list name
//("var_intal,dstrcts,thsls"): joins the matched level names with " / ".
//Empty string when any level misses.
function __mrPathName(listName, path) {
    const parts = String(listName || '').split(',').map(s => s.trim()).filter(Boolean);
    const top = parts.length ? window[parts[0]] : null;
    if (!Array.isArray(top)) { return ''; }
    const childKeys = parts.slice(1);
    const ids = String(path).split(',').map(s => s.trim()).filter(Boolean);
    if (!ids.length) { return ''; }
    const names = [];
    let arr = top;
    for (let i = 0; i < ids.length; i++) {
        const found = arr.find(it => it && String(it.a) === ids[i]);
        if (!found) { break; }
        names.push(found.e || found.n || '');
        arr = (i < childKeys.length) ? (found[childKeys[i]] || []) : [];
    }
    return names.filter(Boolean).join(' / ');
}

//which fields render their value as a tree/path. mr.da "showTreeView" (comma
//list) drives it; when that key is absent the legacy selectFields.<k>.depth
//flag decides (b4 = native city).
function __mrIsTreeField(token) {
    const C = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig) || {};
    const raw = C.showTreeView;
    if (raw === undefined || raw === null) {
        const sf = C.selectFields || {};
        return !!(sf[token] && Number(sf[token].depth) > 0);
    }
    return String(raw).split(',').map(s => s.trim()).filter(Boolean).indexOf(String(token)) >= 0;
}

//city/country name by id; var_ctco is a list of countries with nested `cities`
//(b5 = country, b4 = city within it). The name key in the .da files is `e`
//(`n` kept as a fallback for older shapes), so this may legitimately answer ''
//until the lookups land
function __mrCityName(id) {
    if (id === undefined || id === null || id === '') { return ''; }
    const C = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig) || {};
    if (__mrIsTreeField('b4')) {
        const b4arr = (C.selectFields && C.selectFields.b4 && C.selectFields.b4.arr) || 'var_intal,dstrcts,thsls';
        const depthNm = __mrPathName(b4arr, id);
        if (depthNm) { return depthNm; }
    }
    const list = window.var_ctco || [];
    for (let i = 0; i < list.length; i++) {
        if (list[i].a == id) {
            const nm = list[i].n || list[i].e;
            return nm ? String(nm) : '';
        }
        const cities = list[i].cities || [];
        for (let j = 0; j < cities.length; j++) {
            if (cities[j].a == id) {
                const cnm = cities[j].n || cities[j].e;
                return cnm ? String(cnm) : '';
            }
        }
    }
    return '';
}

//degree names for the comma separated `s` field ('' until the lookups arrive)
function __mrDegreeNames(value) {
    const ids = value ? String(value).split(',').map(id => id.trim()).filter(Boolean) : [];
    if (ids.length === 0) { return ''; }
    const names = ids.map(id => {
        const degree = (window.var_degres || []).find(item => item.a == id);
        return degree ? degree.e : null;
    }).filter(Boolean);
    return names.join(', ');
}

//reads one of the opt-in card fields the owner named in cardExtras
function __mrExtraRaw(profile, key) {
    if (!key || !profile) { return null; }
    const v = profile[key];
    if (v === undefined || v === null || v === '') { return null; }
    return v;
}
function __mrExtraText(profile, key) {
    const v = __mrExtraRaw(profile, key);
    if (v === null) { return ''; }
    return (typeof v === 'object') ? '' : String(v);
}
function __mrExtraFlag(profile, key) {
    const v = __mrExtraRaw(profile, key);
    if (v === null) { return false; }
    if (typeof v === 'boolean') { return v; }
    const s = String(v).trim().toLowerCase();
    return !(s === '' || s === '0' || s === 'false' || s === 'off' || s === 'null');
}
function __mrExtraNumber(profile, key) {
    const v = __mrExtraRaw(profile, key);
    if (v === null) { return null; }
    const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
    if (isNaN(n)) { return null; }
    return Math.max(0, Math.min(100, Math.round(n)));
}

//reload that also works inside the Android WebView
function safeReload() {
    try {
        if (typeof Android !== 'undefined' && Android.reloadPage) {
            Android.reloadPage();
        } else if (typeof Android !== 'undefined') {
            window.location.href = window.location.href.split('?')[0] + '?_t=' + Date.now();
        } else {
            location.reload();
        }
    } catch (e) {
        console.error('Reload failed:', e);
        window.location.href = window.location.href.split('?')[0] + '?_t=' + Date.now();
    }
}

/* ==========================================================================================
 * VIEW - profile list: loading -> grid / empty / error states, cards, infinite scroll.
 * ========================================================================================== */
let isFetching = false;
let hasMore = true;
let __mrScrollBound = false;

//lazy stub: loads git/prfl.js (csh 55) which replaces this with the real handler and
//then runs it (loader row c/r = mrPrflReady / mrShowProfileDtlsLazy)
window.showProfileDtls = function (profileId) {
    loadExe2Fn(55, [profileId], [1]);
};

//lazy stub: the my1ctr modal "Dashboard" module calls openAdminFromMenu (or the
//legacy aminPnl name); both load git/admr.js (csh 48) which opens the admin page
window.openAdminFromMenu = window.aminPnl = function (action) {
    try {
        loadExe2Fn(48, [], [1]);
    } catch (e) {
        console.error("Admin module load failed:", e);
        if (typeof showToast === "function") {
            showToast("Could not open admin.", { type: "error", duration: 3000, position: "top" });
        }
    }
};

function createLoader() {
    const loader = document.createElement('div');
    loader.id = 'infinite-scroll-loader';
    loader.innerHTML = `
        <div class="spinner-border app-state__spinner" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-2 mb-0">Loading more profiles...</p>
    `;
    return loader;
}

//value of one fieldsOnCard token on this profile; null = nothing to print
function __mrCardFactValue(profile, token) {
    if (token.startsWith("'") && token.endsWith("'")) { return token.slice(1, -1); }
    if (token.startsWith('"') && token.endsWith('"')) { return token.slice(1, -1); }
    if (token === 'm') return profile.m || null;
    if (token === 'g') {
        const age = profile.g ? calculateAge(profile.g) : null;
        return (age !== null && age !== 'Unknown') ? age + ' yrs' : '-';
    }
    if (token === 'h') return profile.h ? formatHeight(profile.h) : null;
    if (token === 'i') return profile.i ? formatPackage(profile.i) : null;
    if (token === 'k' || token === 'k1') {
        const rlgn = (window.var_caste_rlgns || []).find(item => item.a == profile.k);
        if (token === 'k') return rlgn ? rlgn.e : null;
        const caste = (rlgn && rlgn.castes) ? rlgn.castes.find(c => c.a == profile.k1) : null;
        return caste ? caste.e : null;
    }
    if (token === 'k2') {
        const subCaste = (window.var_sub_caste_type || []).find(item => item.a == profile.k2);
        return subCaste ? subCaste.e : null;
    }
    if (token === 's') return __mrDegreeNames(profile.s) || null;
    if (__mrIsTreeField(token)) {
        const tCfg = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig) || {};
        const tField = (tCfg.selectFields || {})[token];
        return __mrPathName(tField && tField.arr, profile[token]) || null;
    }
    if (token === 'b5') return __mrCityName(profile.b5) || null;
    return profile[token] || null;
}

//relation status label for a marital id (j); '' = no chip
function __mrRelationName(id) {
    if (id == null || id === '') return '';
    const s = (window.marital_status || []).find(x => x.a == id);
    return s ? (s.e || '') : '';
}

function createProfileCard(profile) {
    const uniqueProflID = profile.w || '';
    const profileId = profile.a;
    const firstName = profile.m || 'Unknown';

    const age = profile.g ? calculateAge(profile.g) : null;
    const ageTxt = (age !== null && age !== 'Unknown') ? (age + ' yrs') : '-';
    const height = profile.h ? formatHeight(profile.h) : '';
    const degreeTxt = __mrDegreeNames(profile.s);
    const packageAmount = null;//profile.i ? formatPackage(profile.i) : null;

    const qaValue = String(profile.qa || '').trim();
    //a non-empty shoBadge ("qa") value is the app's "verified" signal
    const isVerified = qaValue.length > 0;
    //a paid package is what marks a profile premium in this data model
    const isPremium = !!packageAmount;

    const religionTxt = __mrCardFactValue(profile, 'k') || '';
    const relationTxt = __mrRelationName(profile.j);

    const metaItem = (icon, text) => (text
        ? `<span class="app-card__meta-item"><i class="fas fa-${icon}"></i>${__mrEscHtml(text)}</span>`
        : '');
    const metaHtml = metaItem(__mrMetaIcon('k'), religionTxt)
        + metaItem(__mrMetaIcon('g'), ageTxt)
        + metaItem(__mrMetaIcon('h'), height)
        + metaItem(__mrMetaIcon('s'), degreeTxt);

    const col = document.createElement('div');
    //Bootstrap column classes stay so the grid works without our CSS
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4 app-card';
    col.dataset.profileId = String(profileId);

    col.innerHTML = `
        <div class="card profile-card">
            <div class="profile-image-container">
                <img data-lazy="${__mrEscHtml(profile.thumbnail || '')}"
                     alt="${__mrEscHtml(firstName)}"
                     class="profile-thumbnail"
                     loading="lazy" decoding="async">
                <div class="profile-overlay"></div>
                ${isPremium ? '<span class="app-card__premium"><i class="fas fa-crown"></i>Premium</span>' : ''}
                ${uniqueProflID ? `<span class="app-card__id">ID: ${__mrEscHtml(uniqueProflID)}</span>` : ''}
            </div>

            <div class="app-card__body">
                <div class="app-card__title">
                    <h3 class="app-card__name">${__mrEscHtml(firstName)}</h3>
                    ${relationTxt ? `<span class="app-detail-main">${__mrEscHtml(relationTxt)}</span>` : ''}
                </div>
                ${metaHtml ? `<div class="app-card__meta">${metaHtml}</div>` : ''}
                <div class="app-card__actions">
                    <button type="button" class="app-btn-primary"
                            onclick="showProfileDtls(${profileId})">
                        <i class="fas fa-eye"></i> View Profile
                    </button>
                </div>
            </div>
        </div>
    `;
    return col;
}

/* ---- first card: view-only mirror of the profile cards --------------------------------
 * Same shell, content slots and order as createProfileCard; the controls are read-only
 * and any click on the card opens the registration modal (git/regis.js via csh 14). */

//religion options from the lookup; built at render time (lookups load after this file)
function __mrNewCardReligionOpts() {
    const opts = [{ v: '', l: 'Religion' }];
    (window.var_caste_rlgns || []).forEach(r => {
        if (r && r.a != null && r.e) opts.push({ v: String(r.a), l: String(r.e) });
    });
    return opts;
}

//relation status options (same list the filter uses, minus the a:0 placeholder row)
function __mrNewCardStatusOpts() {
    const opts = [{ v: '', l: 'Status' }];
    (window.marital_status || []).forEach(s => {
        if (s && s.a != 0 && s.a != null && s.e) opts.push({ v: String(s.a), l: String(s.e) });
    });
    return opts;
}

//degree options from the lookup; built at render time (lookups load after this file)
function __mrNewCardDegreeOpts() {
    const opts = [{ v: '', l: 'Education' }];
    (window.var_degres || []).forEach(d => {
        if (d && d.a != null && d.e) opts.push({ v: String(d.a), l: String(d.e) });
    });
    return opts;
}

//store the member's own profile row in memory + localStorage "<tn>_myEinMR" so the
//registration modal reopens pre-filled and the app recognises the member's profile
function __mrPersistMyRow(row) {
    if (!row) return;
    try { window.myEinMR = row; } catch (e) { }
    try {
        var tn = window.appOwner && window.appOwner.tn;
        if (tn) localStorage.setItem(tn + "_myEinMR", JSON.stringify(row));
    } catch (e2) { }
}
window.mrPersistMyEinMR = __mrPersistMyRow;

//open the registration modal for the logged-in member: an explicit id (detail-view
//Edit) or the stored own id opens UPDATE pre-filled; with no id it opens ADD.
async function __mrOpenRegistration(explicitId) {
    var tn = window.appOwner && window.appOwner.tn;
    var id = (explicitId != null && explicitId !== "" && Number(explicitId) > 0) ? explicitId : null;
    if (!id) {
        try {
            var s = tn ? localStorage.getItem(tn + "_myEinMR") : null;
            if (s && s !== "undefined" && s !== "null") {
                var o = JSON.parse(s);
                if (o && Number(o.a) > 0) id = o.a;
            }
        } catch (e) { }
    }
    //re-read the latest full row from the local "mr" table so every field prefills
    if (id && typeof dbDexieManager !== 'undefined'
        && typeof dbDexieManager.getAllRecords === 'function' && dbnm) {
        try {
            var rows = await dbDexieManager.getAllRecords(dbnm, 'mr');
            var row = (rows || []).find(function (r) { return r && String(r.a) === String(id); });
            if (row) __mrPersistMyRow(row);
        } catch (eR) { }
    }
    loadExe2Fn(14, id ? [id] : [], [1]);
}
window.mrOpenRegistration = __mrOpenRegistration;

function mrOpenRegistrationForMe() { __mrOpenRegistration(); }

function createEmptyProfileCard() {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4 app-card app-card--new';
    //stay invisible until the local "mr" check resolves, so an async read can
    //never flash this card for a member who already has local records
    col.style.visibility = 'hidden';

    const optsHtml = (list) => list
        .map(o => `<option value="${__mrEscHtml(o.v)}">${__mrEscHtml(o.l)}</option>`)
        .join('');
    //view-only select: not focusable, clicks pass through to the card handler
    const vSel = (field, list, label, cls) => `
        <select class="app-card__select${cls ? ' ' + cls : ''}" data-mrfield="${field}"
                tabindex="-1" aria-label="${__mrEscHtml(label)}">
            ${optsHtml(list)}
        </select>`;
    //view-only input: readonly + not focusable, clicks pass through to the card handler
    const vInp = (field, attrs) => `
        <input class="app-card__input" data-mrfield="${field}" tabindex="-1" readonly ${attrs}>`;
    const metaItem = (icon, ctl) => `
        <span class="app-card__meta-item"><i class="fas fa-${icon}"></i>${ctl}</span>`;

    //title slots match createProfileCard: name + relation status (.app-detail-main)
    const titleHtml = `
        <div class="app-card__title">
            <h3 class="app-card__name">
                <input class="app-card__input app-card__input--name" type="text" data-mrfield="m"
                       tabindex="-1" readonly placeholder="Name" aria-label="Name">
            </h3>
            ${vSel('j', __mrNewCardStatusOpts(), 'Status', 'app-detail-main')}
        </div>`;

    //meta chips in the same order/icons as createProfileCard (no location-dot)
    const metaHtml = metaItem(__mrMetaIcon('k'), vSel('k', __mrNewCardReligionOpts(), 'Religion'))
        + metaItem(__mrMetaIcon('g'), vInp('g', `placeholder="Age" aria-label="Age"`))
        + metaItem(__mrMetaIcon('h'), vInp('h', `type="text" inputmode="decimal" placeholder="Height" aria-label="Height"`))
        + metaItem(__mrMetaIcon('s'), vSel('s', __mrNewCardDegreeOpts(), 'Education'));

    col.innerHTML = `
        <div class="card profile-card">
            <div class="profile-image-container profile-image-container--empty">
                <i class="fas fa-user-plus"></i>
                <div class="profile-overlay"></div>
            </div>

            <div class="app-card__body">
                ${titleHtml}
                <div class="app-card__meta">${metaHtml}</div>
                <div class="app-card__actions">
                    <button type="button" class="app-btn-primary app-btn-save">
                        <i class="fas fa-floppy-disk"></i> Save
                    </button>
                </div>
            </div>
        </div>
    `;

    //view-only card: any click (controls, Save, image area) opens the registration modal
    col.addEventListener('click', function () {
        //member's own saved profile (in-memory first, then localStorage fallback)
        function getSelfProfileLocal() {
            try {
                if (typeof getSelfProfile === 'function') {
                    const s = getSelfProfile();
                    if (s) return s;
                }
                if (typeof myEinMR !== 'undefined' && myEinMR && myEinMR.a) return myEinMR;
                const tn = window.appOwner && window.appOwner.tn;
                const ss = tn ? localStorage.getItem(tn + "_myEinMR") : null;
                if (ss && ss !== "undefined" && ss !== "null") {
                    const o = JSON.parse(ss);
                    if (o && o.a) return o;
                }
            } catch (e) {}
            return null;
        }

        const self = getSelfProfileLocal();

        //no profile yet -> this is a "Register Profile" action
        if (!self) {
            const poseTill = window[my1uzr.worknOnPg]?.clientConfig?.registrationPoseTill;

            //registrationPoseTill has content (not empty) -> BLOCK
            if (poseTill !== undefined && poseTill !== null && String(poseTill).trim().length > 0) {
                //show the message (e.g., "Coming soon")
                window.showConfirmModal(String(poseTill));
                return; //stop - do NOT proceed
            }
        }

        //profile exists -> proceed as-is
        mrOpenRegistrationForMe();
    });
    __mrHideAddCardIfLocalData(col);
    return col;
}

//the first add card is only for a member with no local data yet: if the "mr" IndexedDB
//(Dexie) table already holds any row, drop the card from the grid, else reveal it.
//NOTE: dbDexieManager is a top-level `const` in the CDN script, so it is a lexical
//global (bare) and NOT a window property - window.dbDexieManager is undefined.
function __mrHideAddCardIfLocalData(col) {
    var reveal = function () { col.style.visibility = ''; };
    try {
        if (typeof dbDexieManager === 'undefined' || typeof dbDexieManager.getAllRecords !== 'function') { reveal(); return; }
        Promise.resolve(dbDexieManager.getAllRecords(dbnm, 'mr'))
            .then(function (rows) {
                if (rows && rows.length > 0) { if (col.isConnected) col.remove(); }
                else reveal();
            })
            .catch(reveal);
    } catch (e) { reveal(); }
}

function __mrShowMainLoading() {
    const main = document.getElementById('main-content');
    if (!main) return;
    main.innerHTML = `
        <div class="container app-state">
            <div class="spinner-border app-state__spinner" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mt-3 mb-0">Loading profiles...</p>
        </div>
    `;
}

//grid / empty / error into #main-content; ok=false means the pull failed
function mrRenderMain(ok) {
    const main = document.getElementById('main-content');
    if (!main) return;

    if (!ok) {
        main.innerHTML = `
            <div class="container app-state">
                <div class="app-state__icon"><i class="fas fa-triangle-exclamation"></i></div>
                <div class="app-state__title">Error Loading Profiles</div>
                <p class="app-state__text">Something went wrong while fetching profiles. Please try again.</p>
                <button type="button" class="btn btn-primary" onclick="safeReload()">
                    <i class="fas fa-redo me-2"></i> Retry
                </button>
            </div>
        `;
        return;
    }

    if (profilesData.length === 0) {
        main.innerHTML = `
            <div class="container app-state">
                <div class="app-state__icon"><i class="fas fa-user-friends"></i></div>
                <div class="app-state__title">No Profiles Yet</div>
                <p class="app-state__text">Profiles will appear here when available. Check back soon!</p>
                <button type="button" class="btn btn-primary" onclick="mrRenderList()">
                    <i class="fas fa-rotate me-2"></i> Refresh
                </button>
            </div>
        `;
        return;
    }

    main.innerHTML = `
        <div class="container app-container">
            <div class="row" id="profiles-container"></div>
            <div id="loader-container"></div>
        </div>
    `;
    const container = main.querySelector('#profiles-container');
    const loaderContainer = main.querySelector('#loader-container');
    if (container) {
        container.appendChild(createEmptyProfileCard());
        profilesData.forEach(profile => container.appendChild(createProfileCard(profile)));
        if (hasMore && loaderContainer) loaderContainer.appendChild(createLoader());
        if (window.mrImg) window.mrImg.hydrate(container);
    }
}

//first pull + render; also used by the empty-state Refresh button and ?id= deep links
async function mrRenderList(forceReset) {
    const main = document.getElementById('main-content');
    if (!main) return;
    __mrShowMainLoading();

    const idParam = new URLSearchParams(window.location.search).get('id');
    const whr = idParam ? ("w = '" + String(idParam).replace(/'/g, '') + "'") : null;

    const result = await pullProfiles(whr, forceReset || !!idParam);
    profilesData = result.profiles;
    hasMore = result.hasMore;

    if (result.ok && !idParam && (forceReset || !__mrLocalProfilesMerged)) {
        try {
            if (typeof dbDexieManager !== 'undefined'
                && typeof dbDexieManager.getAllRecords === 'function' && dbnm) {
                __mrLocalProfilesMerged = true;
                const localRows = await dbDexieManager.getAllRecords(dbnm, 'mr');
                if (Array.isArray(localRows) && localRows.length) {
                    const seen = {};
                    profilesData.forEach(p => { if (p && p.a != null) seen[String(p.a)] = 1; });
                    const locals = [];
                    localRows.forEach(r => {
                        if (!r || r.a == null) return;
                        const id = String(r.a);
                        if (seen[id]) return;
                        seen[id] = 1;
                        locals.push(applyProfileImageData(r));
                    });
                    profilesData = locals.concat(profilesData);
                }
            }
        } catch (e) {
            console.warn('[mr] local mr merge failed:', e && e.message);
        }
    }

    mrRenderMain(result.ok);

    if (!__mrScrollBound) {
        window.addEventListener('scroll', handleScroll);
        __mrScrollBound = true;
    }
}

//load the next batch when the last visible card is within pullWhenCardsRemain
async function handleScroll() {
    if (isFetching || !hasMore) return;
    const container = document.getElementById('profiles-container');
    if (!container) return;
    const allCards = container.querySelectorAll('.profile-card');
    if (allCards.length === 0) return;

    let lastVisibleIndex = -1;
    for (let i = allCards.length - 1; i >= 0; i--) {
        if (allCards[i].getBoundingClientRect().top < window.innerHeight) {
            lastVisibleIndex = i;
            break;
        }
    }
    if (lastVisibleIndex >= 0) {
        const remainingCards = allCards.length - 1 - lastVisibleIndex;
        if (remainingCards <= (window[my1uzr.worknOnPg].pullWhenCardsRemain || 0)) {
            await loadMoreProfiles();
        }
    }
}

async function loadMoreProfiles() {
    if (isFetching) return;
    isFetching = true;
    try {
        const loaderContainer = document.getElementById('loader-container');
        if (loaderContainer) {
            loaderContainer.innerHTML = '';
            loaderContainer.appendChild(createLoader());
        }

        const result = await pullProfiles(null, false);
        if (result.ok && result.profiles.length > 0) {
            profilesData = profilesData.concat(result.profiles);
            const container = document.getElementById('profiles-container');
            if (container) {
                result.profiles.forEach(profile => container.appendChild(createProfileCard(profile)));
                if (window.mrImg) window.mrImg.hydrate(container);
            }
        }
        hasMore = result.ok ? result.hasMore : false;

        if (loaderContainer) {
            loaderContainer.innerHTML = '';
            if (hasMore && result.ok && result.profiles.length > 0) loaderContainer.appendChild(createLoader());
        }
    } finally {
        isFetching = false;
    }
}

/* ============================================================================
 * SIFR SIGNATURE - ROYAL GOLD & BURGUNDY DESIGN SYSTEM
 * Injected as the global appcss string.
 * The login scripts (my1lp/my1lo) auto-parse this and derive their theme:
 *   brand   -> #8B1E3F (--mr-primary, variable semantics score 3)
 *   lightBg -> #fffdf6 (--surface)
 *   ink     -> #241d12 (--ink)
 *   onBrand -> #ffffff (luminance of #8B1E3F)
 * ========================================================================== */
appcss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap');

:root{
  --mr-primary:#8B1E3F;
  --mr-primary-600:#A32A50;
  --mr-primary-700:#6E1733;
  --mr-primary-300:#B9607C;
  --mr-primary-50:#F9E9EE;
  --gold:#c9a45c;
  --gold-light:#e6cf9b;
  --gold-pale:#f3e7cd;
  --surface:#fffdf6;
  --cream:#faf4e6;
  --ink:#241d12;
  --muted:#6f6656;
  --charcoal:#2f2a20;
  --on-brand:#ffffff;
  --radius-sm:10px;
  --radius-md:16px;
  --radius-lg:22px;
  --radius-pill:999px;
  --font-display:'Playfair Display','Georgia',serif;
  --font-body:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  --shadow-sm:0 1px 2px rgba(36,29,18,.06),0 4px 12px rgba(36,29,18,.06);
  --shadow-md:0 6px 20px rgba(36,29,18,.10);
  --shadow-lg:0 24px 60px rgba(78,12,35,.24);
  --gold-ring:0 0 0 3px rgba(201,164,92,.28);
}

/* ---------------------------------------------------------------- base ---- */
html, body{
  height:100%;
  background-color:#fffdf6;
  color:#241d12;
  font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  font-size:15px;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}
body{
  display:flex;
  flex-direction:column;
  min-height:100vh;
  min-height:100dvh;
}
a{ color:var(--mr-primary); text-decoration:none; }
a:hover{ color:var(--mr-primary-700); }
h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6,.card-title,.modal-title{
  font-family:'Playfair Display','Georgia',serif;
  font-weight:700;
  letter-spacing:.2px;
  color:#2f2a20;
}
::selection{ background:rgba(201,164,92,.4); color:#241d12; }
:focus-visible{ outline:none; box-shadow:0 0 0 3px rgba(201,164,92,.35); border-radius:6px; }

/* scrollbars */
*{ scrollbar-width:thin; scrollbar-color:#c9a45c #faf4e6; }
*::-webkit-scrollbar{ width:10px; height:10px; }
*::-webkit-scrollbar-track{ background:#faf4e6; }
*::-webkit-scrollbar-thumb{ background:linear-gradient(180deg,#c9a45c,#a88a3f); border-radius:999px; border:2px solid #faf4e6; }
*::-webkit-scrollbar-thumb:hover{ background:var(--mr-primary); }

.text-primary,.text-primary:hover{ color:var(--mr-primary) !important; }
.text-muted{ color:#6f6656 !important; }
.text-success{ color:#2e7d5b !important; }
.text-danger{ color:#a33120 !important; }

/* ------------------------------------------------------------- buttons ---- */
.btn{
  font-family:'Inter',system-ui,sans-serif;
  font-weight:600;
  letter-spacing:.3px;
  border-radius:999px;
  padding:.55rem 1.25rem;
  border:1px solid transparent;
  transition:transform .18s ease, box-shadow .18s ease, background-color .18s ease, color .18s ease, border-color .18s ease;
  box-shadow:none;
  position:relative;
  white-space:nowrap;
}
.btn:hover{ transform:translateY(-1px); }
.btn:active{ transform:translateY(0) scale(.985); }
.btn:disabled,.btn.disabled{ opacity:.55; box-shadow:none; transform:none; }

.btn-primary{
  color:#ffffff;
  border-color:var(--mr-primary);
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  box-shadow:0 8px 20px rgba(78,12,35,.28);
}
.btn-primary:hover,.btn-primary:focus{
  color:#ffffff;
  border-color:var(--mr-primary);
  background-image:linear-gradient(135deg,#7a2317,#5c1a12 55%,#430f13);
  box-shadow:0 10px 26px rgba(78,12,35,.34);
}
.btn-primary:focus{ box-shadow:0 0 0 3px rgba(201,164,92,.4); }

.btn-outline-primary{
  color:var(--mr-primary);
  border-color:#c9a45c;
  background:transparent;
}
.btn-outline-primary:hover,.btn-outline-primary:focus{
  color:#ffffff;
  border-color:var(--mr-primary);
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600));
}
.btn-outline-primary:focus{ box-shadow:0 0 0 3px rgba(201,164,92,.4); }

.btn-secondary{
  color:#2f2a20;
  background-color:#f3e7cd;
  border-color:#d8bc86;
}
.btn-secondary:hover,.btn-secondary:focus{
  color:#2f2a20;
  background-color:#e6cf9b;
  border-color:#c9a45c;
}

.btn-success{
  color:#ffffff;
  background-image:linear-gradient(135deg,#2e7d5b,#1f5f44);
  border-color:#2e7d5b;
}
.btn-danger{
  color:#ffffff;
  background-image:linear-gradient(135deg,#a33120,#7a2317);
  border-color:#a33120;
}
.btn-warning{
  color:#3a2d10;
  background-image:linear-gradient(135deg,#e6cf9b,#c9a45c);
  border-color:#c9a45c;
}
.btn-sm{ padding:.35rem .9rem; font-size:.83rem; }
.btn-close{
  border-radius:999px;
  transition:transform .2s ease, opacity .2s ease;
}
.btn-close:hover{ transform:rotate(90deg); opacity:.9; }

/* --------------------------------------------------------------- cards ---- */
.card{
  background:#fffdf6;
  border:1px solid rgba(201,164,92,.55);
  border-radius:18px;
  box-shadow:0 1px 2px rgba(36,29,18,.05),0 10px 30px rgba(36,29,18,.08);
  overflow:hidden;
}
.card-header{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  border-bottom:1px solid rgba(201,164,92,.6);
  color:#ffffff;
  padding:1rem 1.35rem;
}
.card-header .card-title{ color:#ffffff; font-size:1.15rem; margin:0; }
.card-body{ background:#fffdf6; color:#241d12; }
.card-footer{
  background:#faf4e6;
  border-top:1px solid rgba(201,164,92,.4);
}

/* ------------------------------------------------------------- modals ---- */
.modal-backdrop{ background:rgba(43,22,14,.55); }
.modal-content{
  background:#fffdf6;
  border:1px solid rgba(201,164,92,.75);
  border-radius:22px;
  box-shadow:0 24px 60px rgba(78,12,35,.28);
  overflow:hidden;
}
.modal-header{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  border-bottom:1px solid rgba(201,164,92,.6);
  padding:1.15rem 1.5rem;
  color:#ffffff;
}
.modal-header .modal-title{ color:#ffffff; font-size:1.2rem; }
.modal-header .btn-close{ filter:invert(1); }
.modal-body{ background:#fffdf6; color:#241d12; padding:1.5rem; }
.modal-footer{
  background:#faf4e6;
  border-top:1px solid rgba(201,164,92,.4);
  padding:.9rem 1.5rem;
}

/* login modals (my1lp / my1lo build bootstrap .card inside .modal) */
.modal .card{ border:none; box-shadow:none; border-radius:0; }
.modal .card-header{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  background-color:var(--mr-primary);
  border-bottom:1px solid rgba(201,164,92,.6);
  border-radius:0;
  padding:1rem 1.35rem;
}
.modal .card-header .card-title{ color:#ffffff; }
.modal .card-body{
  background-color:#fffdf6;
  padding:1.5rem;
}
.modal .card-title{ font-size:1.15rem; }

/* ---------------------------------------------------------- navigation ---- */
.navbar{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 60%,var(--mr-primary-700));
  box-shadow:0 4px 20px rgba(78,12,35,.22);
}
.navbar-brand{
  font-family:'Playfair Display','Georgia',serif;
  font-weight:700;
  font-size:1.3rem;
  color:#ffffff !important;
  letter-spacing:.4px;
}
.navbar .nav-link{
  color:rgba(255,255,255,.82) !important;
  border-radius:999px;
  padding:.5rem .95rem;
  font-weight:500;
  transition:color .2s ease, background-color .2s ease, transform .2s ease;
}
.navbar .nav-link:hover{
  color:#ffffff !important;
  background:rgba(201,164,92,.22);
  transform:translateY(-1px);
}
.navbar .nav-link.active{
  color:#ffffff !important;
  background-image:linear-gradient(135deg,#c9a45c,#a88a3f);
  box-shadow:0 6px 16px rgba(78,12,35,.3);
}
.nav-pills .nav-link.active{ background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600)); color:#ffffff; }
.nav-link.active,.nav-link{ font-family:'Inter',system-ui,sans-serif; }

/* ------------------------------------------------- dropdown, list, table -- */
.dropdown-menu{
  background:#fffdf6;
  border:1px solid rgba(201,164,92,.55);
  border-radius:14px;
  box-shadow:0 16px 40px rgba(36,29,18,.16);
  padding:.45rem;
}
.dropdown-item{
  border-radius:9px;
  color:#2f2a20;
  font-weight:500;
  padding:.55rem .9rem;
}
.dropdown-item:hover,.dropdown-item:focus{
  background:#faf4e6;
  color:var(--mr-primary);
}
.dropdown-item:active{ background:var(--mr-primary); color:#ffffff; }
.dropdown-divider{ border-color:rgba(201,164,92,.4); }

.list-group-item{
  background:#fffdf6;
  border-color:rgba(201,164,92,.4);
  color:#2f2a20;
}
.list-group-item.active{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600));
  border-color:var(--mr-primary);
  color:#ffffff;
}

.table{ color:#2f2a20; }
.table thead th{
  background:#faf4e6;
  color:var(--mr-primary);
  font-size:.75rem;
  text-transform:uppercase;
  letter-spacing:1px;
  border-bottom:2px solid rgba(201,164,92,.6);
}
.table td,.table th{ border-color:rgba(201,164,92,.35); }

/* --------------------------------------------------------------- forms ---- */
.form-label{
  font-size:.72rem;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:1.1px;
  color:#6f6656;
  margin-bottom:.4rem;
}
.form-control,.form-select{
  background-color:#fffdf6;
  border:1px solid rgba(150,120,70,.45);
  border-radius:12px;
  color:#241d12;
  font-family:'Inter',system-ui,sans-serif;
  font-size:.95rem;
  padding:.6rem .9rem;
  transition:border-color .2s ease, box-shadow .2s ease, background-color .2s ease;
}
.form-control:focus,.form-select:focus{
  background-color:#ffffff;
  border-color:#c9a45c;
  box-shadow:0 0 0 3px rgba(201,164,92,.25);
  color:#241d12;
}
.form-control::placeholder{ color:#9c937f; opacity:1; }
.form-control:disabled,.form-control[readonly]{ background-color:#faf4e6; }
.form-select{ background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%238B1E3F' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3E%3C/svg%3E"); }
.input-group-text{
  background:#faf4e6;
  border:1px solid rgba(150,120,70,.45);
  color:#6f6656;
  border-radius:12px;
  font-weight:500;
}
.form-text{ color:#9c937f; }
.invalid-feedback{ color:#a33120; font-weight:500; }
input.form-control.is-invalid{ border-color:#a33120; }
input.form-control.is-invalid:focus{ box-shadow:0 0 0 3px rgba(163,49,32,.2); }

/* OTP / mobile digit boxes (login + register) */
#lp-mobileDigitsContainer input.form-control,
#lp-registerMobileDigitsContainer input.form-control,
#lp-otpDigitsContainer input.form-control,
#lo-mobileDigitsContainer input.form-control,
#lo-otpDigitsContainer input.form-control{
  border-radius:12px !important;
  font-family:'Inter',system-ui,sans-serif !important;
  font-weight:600 !important;
  letter-spacing:2px;
}
#lp-loginCountryCode.form-select,
#lp-registerCountryCode.form-select,
#lo-loginCountryCode.form-select{
  border-radius:12px !important;
  font-weight:600;
}

/* login action toggles & helper text */
#loginPasswordModal .card-header,
#loginPasswordModal .card,
#login-info-modal .modal-content{ border-radius:20px; }
#lp-termsLabel,#lo-acceptTerms + label{
  font-size:.83rem;
  color:#6f6656;
  line-height:1.5;
}
#switchToRegister,#switchToLogin,#lp-resendOtp,#lo-resendOtp{
  border-radius:999px;
  border-color:#c9a45c !important;
  color:var(--mr-primary) !important;
  background:#fffdf6 !important;
}
#switchToRegister:hover,#switchToLogin:hover,#lp-resendOtp:hover,#lo-resendOtp:hover{
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600)) !important;
  border-color:var(--mr-primary) !important;
  color:#ffffff !important;
}
#forgotPassword{ font-weight:600; }
#lp-otpTextToggle,#lo-otpTextToggle{
  color:var(--mr-primary);
  font-weight:700;
  border-radius:999px;
}
.blink-text{ color:var(--mr-primary) !important; }

/* ------------------------------------------------------------- badges ---- */
.badge{
  font-weight:600;
  letter-spacing:.5px;
  border-radius:999px;
  padding:.45em .8em;
}
.alert{
  border-radius:14px;
  border:1px solid transparent;
}
.alert-warning{
  background:#f3e7cd;
  border-color:#e6cf9b;
  color:#5c4a18;
}
.alert-info{
  background:rgba(201,164,92,.12);
  border-color:rgba(201,164,92,.4);
  color:#5c3f0e;
}
.alert-success{ background:rgba(46,125,91,.1); border-color:rgba(46,125,91,.35); color:#1f5f44; }

.spinner-border,.spinner-grow{ color:#c9a45c; }
.spinner-border.text-light{ color:#e6cf9b !important; }

/* ------------------------------------------------------ engine surfaces --- */
#commonPageLoader,
#loader{
  background:rgba(43,22,14,.5);
  backdrop-filter:blur(4px);
}
#dynamic-toast-container > div{
  background:#fffdf6 !important;
  color:#241d12 !important;
  border:1px solid rgba(201,164,92,.6) !important;
  border-left:4px solid #8B1E3F !important;
  border-radius:14px !important;
  box-shadow:0 12px 34px rgba(36,29,18,.22) !important;
  font-family:'Inter',system-ui,sans-serif !important;
}
#login-info-modal .modal-content{ overflow:hidden; }
#login-info-modal .user-info {
  background:#fffdf6;
  border:1px solid rgba(201,164,92,.4);
  border-radius:14px;
  padding:1rem;
}
#login-info-modal .logout-button{
  background-image:linear-gradient(135deg,#a33120,#7a2317);
  color:#ffffff;
  border-radius:999px;
  border:none;
  padding:.5rem 1.1rem;
  font-weight:600;
}

/* login gate placeholder shown before app loads */
#dyna_dv_1{
  background:#fffdf6;
  border-radius:18px;
  box-shadow:0 24px 60px rgba(78,12,35,.22);
}

/* ------------------------------------------------- micro-interactions ---- */
.card:not(.modal-content):hover{
  transform:translateY(-3px);
  box-shadow:0 14px 38px rgba(36,29,18,.12);
  border-color:#c9a45c;
}
.card,.btn,.nav-link,.dropdown-menu,.toast{ transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
.btn-primary::after,.btn-outline-primary::after{
  content:"";
  position:absolute;
  inset:0;
  border-radius:999px;
  background:linear-gradient(120deg,rgba(255,255,255,.0) 30%,rgba(255,255,255,.22) 50%,rgba(255,255,255,.0) 70%);
  transform:translateX(-120%);
  transition:transform .7s ease;
  pointer-events:none;
}
.btn-primary:hover::after,.btn-outline-primary:hover::after{ transform:translateX(120%); }

@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{
    animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
  }
}
@media (max-width:576px){
  .modal-content{ border-radius:16px; }
  .modal-body{ padding:1.1rem; }
  .btn{ padding:.5rem 1rem; }
}

/* legacy token aliases â€” git/drwr.js and git/fltr.js read these exact names in
   their inline styles and injected rules; mapping them here re-skins them for free */
:root{
  --primary-color:var(--mr-primary);
  --primary-light:var(--mr-primary-600);
  --primary-dark:var(--mr-primary-700);
  --accent-color:var(--gold);
  --accent-light:var(--gold-pale);
  --accent-dark:var(--gold);
  --white-color:#FFFFFF;
  --text-on-primary:#FFFFFF;
  --background-color:var(--surface);
  --card-bg-color:var(--surface);
  --text-primary:var(--ink);
  --text-secondary:var(--muted);
  --text-dark:var(--ink);
  --light-color:var(--cream);
  --border-color:rgba(36,29,18,.16);
  --mr-border:rgba(36,29,18,.16);
  --mr-primary-050:#F9E9EE;
}
.drawer-menu-item{ font-size:.92rem; transition:background-color .2s ease, transform .2s ease; }
.drawer-menu-item:hover{ background:var(--mr-primary-050) !important; }

/* ======================================== view: shell (nav + main + footer) ============ */
#mr-navbar{
  flex-shrink:0;
  position:sticky; top:0; z-index:1030;
  padding:.55rem 1rem;
}
.app-nav{ display:flex; align-items:center; justify-content:space-between; gap:.75rem; }
.app-nav__left{ display:flex; align-items:center; gap:.45rem; flex:1 1 auto; min-width:0; }
.app-nav__right{ display:flex; align-items:center; gap:.35rem; flex:0 0 auto; }
.app-nav__brand{
  display:inline-flex; align-items:center; gap:.55rem;
  background:transparent; border:none;
  padding:.35rem .6rem;
  color:#fffdf6;
  font-family:'Playfair Display','Georgia',serif;
  font-weight:700; font-size:1.12rem; letter-spacing:.4px;
  border-radius:999px; cursor:pointer;
  flex:0 1 auto; min-width:0;
  max-width:70vw; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.app-nav__brand:hover{ background:rgba(201,164,92,.18); color:#ffffff; }
.app-nav__brand-gem{ color:var(--gold); font-size:.95rem; flex:0 0 auto; }
.app-nav__icon{
  position:relative;
  width:42px; height:42px; padding:0 !important; border-radius:50%;
  display:inline-flex; align-items:center; justify-content:center;
  color:#fffdf6 !important; text-decoration:none !important;
  background:rgba(255,255,255,.10);
  border:1px solid rgba(201,164,92,.45);
  flex:0 0 auto;
  transition:background-color .2s ease, border-color .2s ease, transform .2s ease, box-shadow .2s ease;
}
.app-nav__icon:hover{
  background:rgba(201,164,92,.22) !important; color:#ffffff !important;
  border-color:var(--gold); transform:translateY(-1px);
  box-shadow:0 6px 16px rgba(36,29,18,.25);
}
.app-nav__icon:focus-visible{ box-shadow:0 0 0 3px rgba(201,164,92,.45); }

@media (max-width:480px){
  #mr-navbar{ padding:.5rem .6rem; }
  .app-nav{ gap:.4rem; }
  .app-nav__left{ gap:.35rem; }
  .app-nav__icon{ width:38px; height:38px; }
  .app-nav__brand{ font-size:1rem; padding:.3rem .45rem; gap:.4rem; }
}

#main-content{ flex:1 0 auto; min-height:55vh; padding-bottom:2rem; }

#mr-footer{
  flex-shrink:0;
  background-image:linear-gradient(135deg,#2f2a20 0%,#241d12 55%,#17120c 100%);
  border-top:3px solid var(--gold);
  color:rgba(255,253,246,.82);
  text-align:center; padding:1.6rem 1rem 1.4rem;
}
.app-footer__brand{
  font-family:'Playfair Display','Georgia',serif;
  font-weight:700; font-size:1.15rem; color:var(--gold-light);
  margin-bottom:.6rem; letter-spacing:.3px;
}
.app-footer__links{ display:flex; flex-wrap:wrap; justify-content:center; gap:.5rem; margin-bottom:.7rem; }
.app-footer__links a{
  color:#f3e7cd; font-size:.85rem; font-weight:600;
  border:1px solid rgba(201,164,92,.5); border-radius:999px;
  padding:.3rem .85rem; text-decoration:none;
  transition:background-color .2s ease, color .2s ease, border-color .2s ease;
}
.app-footer__links a:hover{ background:var(--gold); color:#241d12; border-color:var(--gold); }
.app-footer__copy{ margin:0; font-size:.8rem; color:rgba(255,253,246,.6); }

/* splash screen (created by step 4's showFlashImage) */
#flash-container{
  position:fixed; inset:0; z-index:20000;
  display:flex; align-items:center; justify-content:center;
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-700));
  transition:opacity .5s ease;
}
.app-flash-img{
  max-width:92vw; max-height:82vh;
  border-radius:18px; object-fit:contain;
  box-shadow:0 24px 60px rgba(0,0,0,.45);
}

/* ======================================== view: profile list + cards ================= */
.app-container{ padding-top:1.25rem; }

.app-card > .card{
  display:flex; flex-direction:column;
  height:100%;
  max-height:60vh;
  transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}
.app-card > .card:hover{
  transform:translateY(-4px);
  box-shadow:0 18px 44px rgba(78,12,35,.16);
  border-color:var(--gold);
}

.profile-image-container{
  position:relative;
  aspect-ratio:4 / 5;
  overflow:hidden;
  background:#f3e7cd;
}
.profile-thumbnail{
  width:100%; height:100%;
  object-fit:cover; object-position:center top;
  display:block;
  transition:transform .35s ease;
}
.profile-card:hover .profile-thumbnail{ transform:scale(1.045); }
.profile-overlay{
  position:absolute; inset:0;
  background:linear-gradient(180deg,rgba(36,29,18,0) 55%,rgba(36,29,18,.35) 100%);
  pointer-events:none;
}

.app-card__premium,
.app-card__verified{
  position:absolute; z-index:2;
  display:inline-flex; align-items:center; gap:.35rem;
  font-size:.7rem; font-weight:700; letter-spacing:.6px;
  text-transform:uppercase;
  padding:.32em .7em; border-radius:999px;
  box-shadow:0 4px 12px rgba(0,0,0,.25);
}
.app-card__premium{
  top:.6rem; left:.6rem;
  background:linear-gradient(135deg,var(--gold-light),var(--gold));
  color:#241d12;
}
.app-card__verified{
  top:.6rem; right:.6rem;
  background:linear-gradient(135deg,#2e7d5b,#1f5f44);
  color:#ffffff;
}

.app-card__body{
  display:flex; flex-direction:column; gap:.4rem;
  padding:.95rem 1rem 1.1rem;
  flex:1 1 auto;
}
.app-card__title{
  display:flex; align-items:baseline; gap:.5rem;
  min-width:0;
}
.app-card__name{
  margin:0;
  font-size:1.2rem; line-height:1.25;
  color:#2f2a20;
  flex:0 1 auto; min-width:0;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.app-card__meta{
  display:flex; flex-wrap:wrap; gap:.35rem .85rem;
  font-size:.85rem; font-weight:600; color:var(--muted);
}
.app-card__meta-item{ display:inline-flex; align-items:center; gap:.35rem; }
.app-card__meta-item i{ color:var(--mr-primary); font-size:.78rem; }

.app-card__role{
  display:flex; align-items:center; gap:.4rem;
  font-size:.85rem; font-weight:600; color:#5c4a18;
  background:rgba(201,164,92,.14);
  border:1px solid rgba(201,164,92,.4);
  border-radius:999px;
  padding:.25rem .7rem;
  width:fit-content; max-width:100%;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.app-card__role i{ color:var(--gold); font-size:.75rem; flex:0 0 auto; }

.app-detail-main{
  margin-left:auto;
  max-width:55%;
  font-size:.88rem; font-weight:600; color:var(--muted);
  text-align:right;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}

.app-card__id{
  position:absolute; top:.6rem; right:.6rem; z-index:2;
  display:inline-flex; align-items:center; gap:.35rem;
  font-size:.7rem; font-weight:700; letter-spacing:.6px;
  text-transform:uppercase;
  padding:.32em .7em; border-radius:999px;
  background:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  color:#ffffff;
  border:1px solid rgba(255,255,255,.35);
  box-shadow:0 4px 12px rgba(0,0,0,.35);
  max-width:60%;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.app-card__id i{ font-size:.65rem; color:#ffffff; flex:0 0 auto; }

.app-card__actions{ margin-top:auto; padding-top:.75rem; }
.app-btn-primary{
  display:inline-flex; align-items:center; justify-content:center; gap:.45rem;
  width:100%;
  font-family:'Inter',system-ui,sans-serif;
  font-weight:600; font-size:.88rem; letter-spacing:.3px;
  color:#ffffff;
  background-image:linear-gradient(135deg,var(--mr-primary),var(--mr-primary-600) 55%,var(--mr-primary-700));
  border:1px solid transparent; border-radius:999px;
  padding:.55rem 1rem;
  cursor:pointer;
  box-shadow:0 8px 20px rgba(78,12,35,.24);
  transition:transform .18s ease, box-shadow .18s ease, background-color .18s ease;
}
.app-btn-primary:hover{
  transform:translateY(-1px);
  box-shadow:0 10px 26px rgba(78,12,35,.32);
  background-image:linear-gradient(135deg,#7a2317,#5c1a12 55%,#430f13);
}
.app-btn-primary:active{ transform:translateY(0) scale(.985); }

/* view-only first card inputs */
.app-card__input{
  min-width:0; flex:1 1 6rem; max-width:100%;
  font-size:.85rem; font-weight:600; color:#2f2a20;
  background:#fffdf6;
  border:1px solid rgba(139,30,63,.35); border-radius:.5rem;
  padding:.2rem .5rem;
}
.app-card__input:focus{
  border-color:var(--mr-primary);
  box-shadow:0 0 0 .15rem rgba(139,30,63,.15);
  outline:none;
}

/* view-only first card: controls render like the values on the other cards
 * (plain, compact, muted); non-interactive, any click opens registration modal */
.app-card--new{ cursor:pointer; }
.app-card--new .app-card__title{ flex-wrap:wrap; align-items:center; }
.app-card--new .app-card__input,
.app-card--new .app-card__select{
  pointer-events:none;
  background:transparent; border:0; border-radius:0;
  padding:0; margin:0;
  height:auto; line-height:1.4;
  font:inherit;
  color:var(--muted);
  appearance:none; -webkit-appearance:none;
  flex:0 1 auto;
  max-width:100%;
}
.app-card--new .app-card__input:focus,
.app-card--new .app-card__select:focus{ border:0; box-shadow:none; outline:none; }
.app-card--new .app-card__input::placeholder{ color:var(--muted); opacity:1; }
.app-card--new .app-card__name{ flex:1 1 0; min-width:0; }
.app-card--new .app-detail-main{ flex:0 0 auto; }
.app-card--new .app-card__input--name{
  font-size:1.2rem; font-weight:700; color:#2f2a20;
  width:100%; border:0; background:transparent; padding:0;
}
@media (max-width:576px){ .app-card--new .app-card__input--name{ font-size:1.12rem; } }

/* add-card meta: fixed ch-width controls so labels show in full (no "..."),
 * never shrink, and wrap like the values on the other cards */
.app-card--new .app-card__meta .app-card__input,
.app-card--new .app-card__meta .app-card__select{ max-width:none; flex:0 0 auto; }
.app-card--new select[data-mrfield="k"]{ width:8ch; }   /* Religion */
.app-card--new input[data-mrfield="g"]{ width:4ch; }    /* Age */
.app-card--new input[data-mrfield="h"]{ width:6ch; }    /* Height */
.app-card--new select[data-mrfield="s"]{ width:9ch; }   /* Education */
.app-card--new select[data-mrfield="j"]{ width:7ch; max-width:none; } /* Status, hugs right */
.app-card__select{
  min-width:0; max-width:48%;
  font-size:.85rem; font-weight:600; color:#2f2a20;
  background:#fffdf6;
  border:1px solid rgba(139,30,63,.35); border-radius:.5rem;
  padding:.2rem .5rem;
  cursor:pointer;
  transition:border-color .18s ease, box-shadow .18s ease;
}
.app-card__select:focus{
  border-color:var(--mr-primary);
  box-shadow:0 0 0 .15rem rgba(139,30,63,.15);
  outline:none;
}

/* empty card: image corner */
.app-card--new .profile-image-container{ border-radius:18px 18px 0 0; }

/* Save = different color from the burgundy primary */
.app-btn-save{
  background-image:linear-gradient(135deg,#2e7d5b,#1f7a4d 55%,#155f3c);
  box-shadow:0 8px 20px rgba(31,122,77,.28);
}
.app-btn-save:hover{
  background-image:linear-gradient(135deg,#256a4c,#1a6a45 55%,#114f31);
  box-shadow:0 10px 26px rgba(31,122,77,.36);
}

.profile-image-container--empty{
  display:flex; align-items:center; justify-content:center;
}
.profile-image-container--empty > i{
  font-size:3.2rem; color:rgba(139,30,63,.3);
}

/* loading / empty / error states + infinite scroll */
.app-state{
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:.6rem; text-align:center;
  padding:4rem 1rem;
}
.app-state__icon{
  font-size:2.6rem; color:var(--gold);
  background:rgba(201,164,92,.14);
  border:1px solid rgba(201,164,92,.4);
  border-radius:50%;
  width:84px; height:84px;
  display:flex; align-items:center; justify-content:center;
}
.app-state__title{
  font-family:'Playfair Display','Georgia',serif;
  font-weight:700; font-size:1.3rem; color:#2f2a20;
}
.app-state__text{ max-width:420px; color:var(--muted); margin:0; }
.app-state__spinner{ width:2.4rem; height:2.4rem; color:var(--mr-primary); }

#infinite-scroll-loader{
  display:flex; flex-direction:column; align-items:center;
  padding:1.5rem 0 2.5rem;
}
#infinite-scroll-loader .spinner-border{ color:var(--mr-primary); }

@media (max-width:576px){
  .app-card__name{ font-size:1.12rem; }
  .app-state{ padding:3rem 1rem; }
}

#profiles-container{
  overflow-y:auto;
}
`;

/* ---- body scroll lock while any popup/drawer is open --------------------------------
 * Watches the document for the app's overlay layers (.rg-overlay - regis/prfl modals,
 * .mrd-viewer - image viewer, .ht-modal-overlay - contact, .mrp-overlay - Membership
 * Plans, #drawerBackdrop/#mobileDrawer)
 * and freezes the page scroll underneath while any of them is open. Overlays remove
 * themselves on close (prfl/regis keep them ~260ms for the fade, so the lock releases
 * after that), but the drawer only toggles inline display:none when it closes, so we
 * also watch style/class attribute changes on the drawer/overlay elements. Bootstrap
 * .modal is left to Bootstrap, which locks body itself. Unlock is debounced 80ms and
 * re-verified so a nested/replaced layer (e.g. child viewer over a modal, or closing
 * a modal that another one replaces) never flashes the background scroll. */
(function () {
    var SEL = '.rg-overlay, .mrd-viewer, .ht-modal-overlay, .mrp-overlay';
    var SEL_OBS = SEL + ', #drawerBackdrop, #mobileDrawer';
    var lockedByUs = false;
    var unlockTimer = null;
    var savedScrollY = 0;
    function hasOverlay() {
        try { if (document.querySelector(SEL)) return true; } catch (e) { }
        var db = document.getElementById('drawerBackdrop');
        return !!(db && db.offsetWidth > 0);
    }
    //Pin the body off-screen by its current offset instead of setting
    //overflow:hidden. With html/body{height:100%} the overflow trick collapses the
    //document's scrollable area, so the window is clamped to scrollTop 0 and the
    //profile list jumps to the top when the modal closes. Pinning keeps the visible
    //background exactly where it was, still blocks background scrolling, and the
    //offset is re-applied with scrollTo on unlock.
    function lockBody() {
        if (lockedByUs) return;
        savedScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var b = document.body.style;
        b.position = 'fixed';
        b.top = (-savedScrollY) + 'px';
        b.left = '0';
        b.right = '0';
        b.width = '100%';
    }
    function unlockBody() {
        var y = savedScrollY;
        savedScrollY = 0;
        var b = document.body.style;
        b.position = '';
        b.top = '';
        b.left = '';
        b.right = '';
        b.width = '';
        if (!y) return;
        //Bootstrap's reboot sets :root{scroll-behavior:smooth}, which would turn this
        //restore into an animated scroll. Override it for the jump, then put it back.
        var de = document.documentElement;
        var prev = de.style.scrollBehavior;
        de.style.scrollBehavior = 'auto';
        window.scrollTo(0, y);
        if (prev) de.style.scrollBehavior = prev; else de.style.removeProperty('scroll-behavior');
    }
    function syncLock() {
        if (!document.body) return;
        if (hasOverlay()) {
            if (unlockTimer) { clearTimeout(unlockTimer); unlockTimer = null; }
            lockBody();
            lockedByUs = true;
        } else if (lockedByUs && !unlockTimer) {
            unlockTimer = setTimeout(function () {
                unlockTimer = null;
                if (!hasOverlay() && lockedByUs) {
                    lockedByUs = false;
                    unlockBody();
                }
            }, 80);
        }
    }
    function scheduleSync() {
        if (window.__mrScrollLockScheduled) return;
        window.__mrScrollLockScheduled = true;
        (typeof requestAnimationFrame === 'function' ? requestAnimationFrame : setTimeout)(function () {
            window.__mrScrollLockScheduled = false;
            syncLock();
        }, 16);
    }
    if (typeof MutationObserver === 'undefined') return;
    var startObserving = function () {
        if (!document.body) return;
        new MutationObserver(function (muts) {
            var relevant = false;
            for (var i = 0; i < muts.length; i++) {
                var m = muts[i];
                if (m.type === 'childList') { relevant = true; break; }
                if (m.type === 'attributes' && m.target && m.target.matches &&
                    typeof m.target.matches === 'function' && m.target.matches(SEL_OBS)) {
                    relevant = true;
                    break;
                }
            }
            if (relevant) scheduleSync();
        }).observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        syncLock();
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving, { once: true });
    } else {
        startObserving();
    }
})();
