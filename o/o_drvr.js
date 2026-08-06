// o_drvr.js - Driver Panel (read-only orders view with refresh)
(async function () {
    let fn100Records;

    window[my1uzr.worknOnPg].csh = [
        { "a": 1, "u": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" },
        { "a": 2, "u": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" },
        { "a": 3, "u": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" },
        { "a": 4, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@e92aafb/cmn/my1lo.js", "c": "open_shoLgnO", "r": "open_shoLgnO" },
        { "a": 5, "u": "https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js" },
        { "a": 8, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/cmn/my1xi.min.js" },
        { "a": 9, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@efd30b6/mr/andro.js" },
        { "a": 16, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@91f00c3/o/menu.js", "c": "openBurgerMenu,closeBurgerMenu,createBurgerMenuElements", "r": "createBurgerMenuElements" },
        { "a": 23, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@91f00c3/o/o_r.js", "c": "handl_o_rspons", "r": "handl_o_rspons" },
        { "a": 30, "u": "https://cdn.jsdelivr.net/gh/sifr-in/cdn@1236a32/cmn/clrChe.js", "c": "showClearCacheModal", "r": "showClearCacheModal" },
    ];

    window.showelsemodal = function (errorMsg) {
        if (typeof create_modal_dynamically === 'function') {
            const errorModalId = 'errorModal_' + Date.now();
            const errorModalResult = create_modal_dynamically(errorModalId);
            if (errorModalResult) {
                const { contentElement: errorContent, modalInstance: errorModalInstance, modalElement: errorModalElement } = errorModalResult;
                setTimeout(() => { const md = errorModalElement.querySelector('.modal-dialog'); if (md) { md.style.marginTop = '120px'; md.style.maxWidth = 'auto'; } }, 50);
                errorContent.innerHTML = `<div class="p-4 text-center"><div class="mb-3"><i class="fas fa-exclamation-triangle text-danger" style="font-size:48px;"></i></div><h5 class="text-danger">Error</h5><p class="text-muted">${errorMsg}</p><button class="btn btn-primary btn-sm mt-2" data-bs-dismiss="modal"><i class="fas fa-check me-1"></i>OK</button></div>`;
                errorModalInstance.show(); return false;
            }
        }
    };

    window.showsuccessmodal = function (successMsg, callback) {
        if (typeof create_modal_dynamically === 'function') {
            const successModalId = 'successModal_' + Date.now();
            const successModalResult = create_modal_dynamically(successModalId);
            if (successModalResult) {
                const { contentElement: successContent, modalInstance: successModalInstance, modalElement: successModalElement } = successModalResult;
                setTimeout(() => { const md = successModalElement.querySelector('.modal-dialog'); if (md) { md.style.marginTop = '120px'; md.style.maxWidth = 'auto'; } }, 50);
                successContent.innerHTML = `<div class="p-4 text-center"><div class="mb-3"><i class="fas fa-check-circle text-success" style="font-size:48px;"></i></div><h5 class="text-success">Success</h5><p class="text-muted">${successMsg}</p><button class="btn btn-success btn-sm mt-2" data-bs-dismiss="modal"><i class="fas fa-check me-1"></i>OK</button></div>`;
                if (callback) { successModalElement.addEventListener('hidden.bs.modal', callback, { once: true }); }
                successModalInstance.show(); return false;
            }
        }
    };

    var PLACEHOLDER_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e9ecef"/><text x="50" y="55" text-anchor="middle" font-size="40" fill="#adb5bd">?</text></svg>');
    window.PLACEHOLDER_IMG = PLACEHOLDER_IMG;

    function getGoogleDriveImageUrl(value, thumbnail) {
        if (!value) return '';
        value = String(value).trim();
        var parts = value.split(/\s+/);
        if (parts.length >= 1 && /^[A-Za-z0-9_-]{20,}$/.test(parts[0])) {
            var fileId = thumbnail && parts[1] ? parts[1] : parts[0];
            return 'https://lh3.googleusercontent.com/d/' + fileId + '=s0?authuser=0';
        }
        if (/^https?:\/\//i.test(value)) return value;
        return '';
    }

    const statusMap = {
        '-3': { text: '<i class="fas fa-undo-alt me-1" style="color:#ffffff;"></i>', class: 'badge bg-secondary', name: 'Returned' },
        '-2': { text: '<i class="fas fa-reply me-1" style="color:#ffffff;"></i>', class: 'badge bg-secondary', name: 'Out For Return' },
        '-1': { text: '<i class="fas fa-times-circle me-1" style="color:#ffffff;"></i>', class: 'badge bg-danger', name: 'Cancelled' },
        '0': { text: '<i class="fas fa-clock me-1" style="color:#664d03;"></i>', class: 'badge bg-warning text-dark', name: 'Pending' },
        '1': { text: '<i class="fas fa-cog me-1" style="color:#fff;"></i>', class: 'badge bg-primary', name: 'Processing' },
        '2': { text: '<i class="fas fa-truck me-1" style="color:#055160;"></i>', class: 'badge bg-info text-dark', name: 'Out For Delivery' },
        '3': { text: '<i class="fas fa-check-circle me-1" style="color:#fff;"></i>', class: 'badge bg-success', name: 'Delivered' }
    };

    function getStatusBadge(status) {
        const s = String(parseInt(status) || 0);
        const info = statusMap[s] || { text: '', class: 'badge bg-light text-dark', name: 'Unknown' };
        return `<span class="${info.class}">${info.text} ${info.name}</span>`;
    }

    function getProductInfo(prId) {
        if (!prId) return null;
        if (window.PRODUCT_MAP && window.PRODUCT_MAP[prId]) return window.PRODUCT_MAP[prId];
        if (window.prods_) {
            for (var i = 0; i < window.prods_.length; i++) {
                if (String(window.prods_[i].a) === String(prId)) return window.prods_[i];
            }
        }
        if (window.PRODUCTS) {
            for (var i = 0; i < window.PRODUCTS.length; i++) {
                if (String(window.PRODUCTS[i].pid) === String(prId)) return window.PRODUCTS[i];
            }
        }
        return null;
    }

    function getProductName(item) {
        var p = getProductInfo(item.pr);
        if (p) return p.e || p.name || p.b || ('Product #' + item.pr);
        return 'Product #' + item.pr;
    }

    function getProductImage(item) {
        var p = getProductInfo(item.pr);
        if (p) {
            var raw = p.g || p.image || '';
            if (raw) return getGoogleDriveImageUrl(raw) || '';
        }
        return '';
    }

    function getCustomerLabel(item) {
        if (item.enm) return item.enm;
        if (item.enl) return item.enl;
        if (item.eno) return item.eno;
        return 'Customer #' + item.e;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            var d = new Date(String(dateStr).replace(' ', 'T'));
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) { return dateStr; }
    }

    try {
        let result1;
        if (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].usdInAndroWv === 1)
            result1 = await loadCshScriptsSequentially(1, 2, 3, 4, 5, 8, 16, 23);
        else
            result1 = await loadCshScriptsSequentially(1, 2, 3, 4, 5, 8, 9, 16, 23);

        if (!result1.success) {
            throw new Error('Failed to load required scripts: ' + result1.error);
        } else {
            const createResult = await dbDexieManager.handleNwTables("loader", dbnm, ["p", "fn100"]);

            const st = document.createElement("style");
            st.innerHTML = `
                * { box-sizing: border-box; }
                body { margin: 0; padding: 0; padding-top: 56px; background: #EAF6FF; font-family: 'Segoe UI', Roboto, Arial, sans-serif; min-height: 100vh; }

                .topnav {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
                    background: #005F73; height: 56px;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 15px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
                }
                .topnav i { font-size: 22px; cursor: pointer; color: white; transition: transform 0.2s; }
                .topnav i:hover { transform: scale(1.1); }
                .shopname {
                    font-size: 24px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; font-weight: bold;
                    color: #fff; text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 45%;
                }

                .drv-refresh-btn { margin-left: 1px; margin-right: 10px; border: 0.7px solid #d1d5db; border-radius: 4px; padding: 4px 5px 2px 5px; }
                .drv-refresh-btn.spinning i { animation: drvSpin 0.8s linear infinite; }
                @keyframes drvSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .drv-order-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 12px; }
                .drv-cust-header { background: #f8f9fa; padding: 10px 14px; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center; }
                .drv-item-row { display: flex; align-items: center; gap: 10px; padding: 10px 14px; }
                .drv-item-row + .drv-item-row { border-top: 1px solid #f0f0f0; }
                .drv-item-img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; flex-shrink: 0; background: #e9ecef; }
                .drv-item-img-placeholder { width: 40px; height: 40px; border-radius: 8px; background: #e9ecef; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .drv-empty-state { text-align: center; padding: 60px 20px; }
                .drv-empty-state i { font-size: 48px; opacity: 0.3; }
                .bbm { margin-left: 8px; font-size: 12px; margin-top: 8px; }

                @media (max-width: 768px) {
                    .topnav { height: 50px; padding: 0 10px; }
                    body { padding-top: 50px; }
                    .topnav i { font-size: 18px; }
                    .shopname { font-size: 20px; }
                }
                @media (max-width: 480px) {
                    .topnav { height: 44px; padding: 0 6px; }
                    body { padding-top: 44px; }
                    .shopname { font-size: 18px; }
                }
            `;
            document.head.appendChild(st);

            const shopNameFromAppInfo = window[my1uzr.worknOnPg].appInfo.business;
            const mainBody = document.getElementById("main_body");
            mainBody.innerHTML = `
                <div class="topnav">
                    <div id="burgerBtn"><i class="fas fa-bars bbm"></i></div>
                    <div class="shopname">${shopNameFromAppInfo}</div>
                    <div id="drvRefreshBtn" class="drv-refresh-btn" title="Refresh Orders"><i class="fas fa-sync-alt"></i></div>
                </div>
                <div id="mainContent" style="padding:16px;">
                    <div class="drv-empty-state">
                        <div class="spinner-border text-primary mb-3"></div>
                        <p class="text-muted">Loading orders...</p>
                    </div>
                </div>
            `;

            document.getElementById('drvRefreshBtn').addEventListener('click', fetchAndDisplayOrders);
            setupBurgerMenu();

            window.prods_ = await dbDexieManager.getAllRecords(dbnm, 'p');

            if (window.prods_.length === 0) {
                fetchAndDisplayOrders();
            }
            fn100Records = await dbDexieManager.getAllRecords(dbnm, 'fn100');
            renderDriverOrders(fn100Records);
        }
    } catch (e) {
        console.error(e);
        document.getElementById("main_body").innerHTML = `<div class="alert alert-danger m-3">${e.message || e}</div>`;
    }

    //call fn:100 endpoint 2/o.php
    // {"a":id,"b":date,"c":fn,"d":status,"e":party id,"f":stock id,"g":qty,"h":mesured in,"i":pakage size,"j":total amount,"pr":product id,//custormes//"eno":mobile number-(91.7020376749),"enm":name in english,"enl":name in local lang..}
    // fn100:[
    // {"a":"109","b":"2026-07-28 06:33:34","c":"0","d":"0","e":"62","f":"7","g":"6","h":"30","i":"3.000","j":"150.00","pr":"1","eno":"91.8745847544","enm":"","enl":""},
    // {"a":"111","b":"2026-07-28 06:33:34","c":"0","d":"0","e":"62","f":"6","g":"4","h":"4","i":"250.000","j":"80.00","pr":"2","eno":"91.8745847544","enm":"","enl":""},
    // {"a":"107","b":"2026-07-24 13:31:54","c":"0","d":"0","e":"53","f":"11","g":"4","h":"22","i":"2.000","j":"185.00","pr":"3","eno":"91.7020376749","enm":"","enl":""}
    // ]

    function setupBurgerMenu() {
        var burgerBtn = document.getElementById('burgerBtn');
        if (burgerBtn) {
            burgerBtn.onclick = function () {
                if (window.burgerMenuItems) {
                    window.burgerMenuItems = window.burgerMenuItems.filter(function (item) {
                        return item.action !== 'recent';
                    });
                }
                if (typeof openBurgerMenu === 'function') {
                    openBurgerMenu();
                } else {
                    loadExe2Fn(16, [], [1]).then(function () {
                        if (window.burgerMenuItems) {
                            window.burgerMenuItems = window.burgerMenuItems.filter(function (item) {
                                return item.action !== 'recent';
                            });
                        }
                        if (typeof openBurgerMenu === 'function') openBurgerMenu();
                    }).catch(function (err) { console.error('Failed to load menu:', err); });
                }
            };
        }
    }

    async function fetchAndDisplayOrders() {
        var mainContent = document.getElementById('mainContent');
        var refreshBtn = document.getElementById('drvRefreshBtn');

        if (refreshBtn) refreshBtn.classList.add('spinning');

        try {
            var payload = { ...payload0, vw: 1, fn: 100 };
            payload.la = await dbDexieManager.getMaxDateRecords(dbnm, [
                { tb: 'p', col: 'b', cl: 'b' },
                { tb: 'fn100', col: 'b', cl: 'b' }
            ]);

            var _ldId = 'odrv_ld_' + Date.now();
            var _ldDiv = document.createElement('div');
            _ldDiv.id = _ldId;
            _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
            _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
            document.body.appendChild(_ldDiv);

            var response = await fnj3("https://my1.in/2/o.php", payload, 1, true, null, 20000, 0, 2, 1);
            var _ldEl = document.getElementById(_ldId);
            if (_ldEl) _ldEl.remove();

            if (response && response.su == 1) {
                await handl_o_drvr_rspons(response, 1);

                if (response.p != null && response.p.l != null) {
                    window.prods_ = await dbDexieManager.getAllRecords(dbnm, 'p');
                    if (typeof refreshProductsCache === 'function') {
                        await refreshProductsCache(window.prods_, window.prods_);
                    }
                }

                fn100Records = await dbDexieManager.getAllRecords(dbnm, 'fn100');
                renderDriverOrders(fn100Records);

                if (fn100Records.length === 0) {
                    window.showelsemodal(response.ms || 'No orders assigned');
                }
            } else {
                window.showelsemodal(response?.ms || 'No orders assigned');
            }
        } catch (err) {
            var _ldEl2 = document.getElementById(_ldId);
            if (_ldEl2) _ldEl2.remove();
            window.showelsemodal(err || 'Network Error');
        }

        var refreshBtn2 = document.getElementById('drvRefreshBtn');
        if (refreshBtn2) refreshBtn2.classList.remove('spinning');
    }
    window.fetchAndDisplayOrders = fetchAndDisplayOrders;

    function renderDriverOrders(items) {
        var mainContent = document.getElementById('mainContent');

        if (!items || items.length === 0) {
            mainContent.innerHTML = `
                <div class="drv-empty-state">
                    <i class="fas fa-box-open text-muted drv-empty-state i"></i>
                    <h5 class="text-muted mt-3">No Orders</h5>
                    <p class="text-muted small">No orders assigned to you</p>
                </div>`;
            return;
        }

        var grouped = {};
        var groupOrder = [];
        items.forEach(function (item) {
            var key = String(item.e);
            if (!grouped[key]) {
                grouped[key] = {
                    customerId: item.e,
                    customerName: getCustomerLabel(item),
                    mobile: item.eno || '',
                    items: [],
                    total: 0
                };
                groupOrder.push(key);
            }
            grouped[key].items.push(item);
            grouped[key].total += parseFloat(item.j) || 0;
        });

        var html = '<div style="padding-bottom:20px;">';

        groupOrder.forEach(function (key) {
            var group = grouped[key];
            var itemCount = group.items.length;

            html += `<div class="drv-order-card">
                <div class="drv-cust-header">
                    <div>
                        <strong>${group.customerName}</strong>
                        ${group.mobile ? '<small class="text-muted ms-2">' + group.mobile + '</small>' : ''}
                        <span class="badge bg-secondary ms-2">${itemCount} item${itemCount > 1 ? 's' : ''}</span>
                    </div>
                    <div class="fw-bold text-success" style="font-size:14px;">&#8377;${group.total.toFixed(2)}</div>
                </div>`;

            group.items.forEach(function (item) {
                var img = getProductImage(item);
                var name = getProductName(item);
                var qty = item.g || 1;
                var pkgSize = item.i || '';
                var status = parseInt(item.d) || 0;

                html += `<div class="drv-item-row">
                    ${img
                        ? `<img src="${img}" class="drv-item-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
                        : ''}
                    <div class="drv-item-img-placeholder" ${img ? 'style="display:none"' : ''}>
                        <i class="fas fa-box text-muted" style="font-size:14px;"></i>
                    </div>
                    <div class="flex-grow-1" style="min-width:0;">
                        <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
                        <div style="font-size:11px;color:#6c757d;">${qty} × ${pkgSize}</div>
                    </div>
                    <div style="flex-shrink:0;">
                        ${getStatusBadge(status)}
                    </div>
                </div>`;
            });

            html += `</div>`;
        });

        html += '</div></div>';
        mainContent.innerHTML = html;
    }

    function handl_o_drvr_rspons(response, reload = 0) {
        return (async () => {
            try {
                if (response.su == 1) {
                    if (response.p != null && response.p.l != null) {
                        await dbDexieManager.insertToDexie(dbnm, "p", response.p.l, true, ["a"]);
                    }
                    if (Array.isArray(response.fn100)) {
                        await dbDexieManager.insertToDexie(dbnm, "fn100", response.fn100, true, ["a"]);
                    } else if (response.fn100 != null && response.fn100.l != null) {
                        await dbDexieManager.insertToDexie(dbnm, "fn100", response.fn100.l, true, ["a"]);
                    }
                } else {
                    if (response.ms != null) {
                        console.error(response.ms);
                    }
                }
            } catch (error) {
                console.error("Handler failed:", error);
            }
        })();
    }
})();
