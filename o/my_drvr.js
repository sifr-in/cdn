// my_drvr.js - Driver Orders Panel (modal-based, for use in main menu)
(function () {
    'use strict';

    console.log('my_drvr.js initializing...');

    let fn100Records = [];
    let currentViewId = null;

    const statusMap = {
        '-3': { text: '<i class="fas fa-undo-alt me-1"></i>', class: 'badge bg-secondary', name: 'Returned' },
        '-2': { text: '<i class="fas fa-reply me-1"></i>', class: 'badge bg-secondary', name: 'Out For Return' },
        '-1': { text: '<i class="fas fa-times-circle me-1"></i>', class: 'badge bg-danger', name: 'Cancelled' },
        '0': { text: '<i class="fas fa-clock me-1"></i>', class: 'badge bg-warning text-dark', name: 'Pending' },
        '1': { text: '<i class="fas fa-cog me-1"></i>', class: 'badge bg-primary', name: 'Processing' },
        '2': { text: '<i class="fas fa-truck me-1"></i>', class: 'badge bg-info text-dark', name: 'Out For Delivery' },
        '3': { text: '<i class="fas fa-check-circle me-1"></i>', class: 'badge bg-success', name: 'Delivered' }
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
            if (raw) return (typeof getGoogleDriveImageUrl === 'function' ? getGoogleDriveImageUrl(raw) : raw) || '';
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

    async function fetchAndDisplayOrders(contentElement, modalElement) {
        var refreshBtn = document.getElementById('myDrvRefreshBtn_' + currentViewId);
        if (refreshBtn) refreshBtn.classList.add('spinning');

        var ldId = 'mydrv_ld_' + Date.now();
        var ldDiv = document.createElement('div');
        ldDiv.id = ldId;
        ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
        ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
        document.body.appendChild(ldDiv);

        try {
            var payload = { ...payload0, vw: 1, fn: 100 };
            payload.la = await dbDexieManager.getMaxDateRecords(dbnm, [
                { tb: 'p', col: 'b', cl: 'b' },
                { tb: 'fn100', col: 'b', cl: 'b' }
            ]);

            var response = await fnj3("https://my1.in/2/o.php", payload, 1, true, null, 20000, 0, 2, 1);
            var ldEl = document.getElementById(ldId);
            if (ldEl) ldEl.remove();

            if (response && response.su == 1) {
                await handl_o_drvr_rspons(response, 1);

                if (response.p != null && response.p.l != null) {
                    window.prods_ = await dbDexieManager.getAllRecords(dbnm, 'p');
                    if (typeof refreshProductsCache === 'function') {
                        await refreshProductsCache(window.prods_, window.prods_);
                    }
                }

                fn100Records = await dbDexieManager.getAllRecords(dbnm, 'fn100');
                renderDriverOrders(contentElement, fn100Records);

                if (fn100Records.length === 0) {
                    window.showConfirmModal('No orders assigned');
                }
            } else {
                window.showelsemodal(response?.ms || 'No orders assigned');
            }
        } catch (err) {
            var ldEl2 = document.getElementById(ldId);
            if (ldEl2) ldEl2.remove();
            window.showelsemodal(err || 'Network Error');
        }

        var refreshBtn2 = document.getElementById('myDrvRefreshBtn_' + currentViewId);
        if (refreshBtn2) refreshBtn2.classList.remove('spinning');
    }

    function renderDriverOrders(contentElement, items) {
        if (!items || items.length === 0) {
            contentElement.innerHTML = `
                <div class="p-3">
                    <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <h5 class="mb-0"><i class="fas fa-truck me-2 text-primary"></i>Driver Orders</h5>
                        <div id="myDrvRefreshBtn_${currentViewId}" class="drv-refresh-btn" title="Refresh Orders" style="cursor:pointer;"><i class="fas fa-sync-alt"></i></div>
                    </div>
                    <div class="text-center py-5">
                        <i class="fas fa-box-open fa-3x text-muted mb-3" style="opacity:0.3;"></i>
                        <h5 class="text-muted">No Orders</h5>
                        <p class="text-muted small">No orders assigned to you</p>
                    </div>
                </div>`;
            var emptyRefreshBtn = document.getElementById('myDrvRefreshBtn_' + currentViewId);
            if (emptyRefreshBtn) {
                emptyRefreshBtn.onclick = function () {
                    fetchAndDisplayOrders(contentElement, null);
                };
            }
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
                    date: item.b || '',
                    items: [],
                    total: 0
                };
                groupOrder.push(key);
            }
            grouped[key].items.push(item);
            grouped[key].total += parseFloat(item.j) || 0;
        });

        var html = `
            <div class="p-3">
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <h5 class="mb-0">
                        <i class="fas fa-truck me-2 text-primary"></i>Driver Orders
                        <span class="badge bg-primary ms-2">${items.length} items</span>
                    </h5>
                    <div class="d-flex gap-2 align-items-center">
                        <div id="myDrvRefreshBtn_${currentViewId}" class="drv-refresh-btn" title="Refresh" style="cursor:pointer;">
                            <i class="fas fa-sync-alt"></i>
                        </div>
                        <button type="button" class="btn-close" data-fp-close="1"></button>
                    </div>
                </div>
                <div class="my-drv-order-list" style="max-height:calc(100vh - 130px);overflow-y:auto;">`;

        groupOrder.forEach(function (key) {
            var group = grouped[key];
            var itemCount = group.items.length;

            html += `
                <div class="card mb-3 border-0 shadow-sm">
                    <div class="card-header bg-light d-flex justify-content-between align-items-center py-2">
                        <div>
                            <strong>${group.customerName}</strong>
                            ${group.mobile ? '<small class="text-muted ms-2"><i class="fas fa-phone me-1"></i>' + group.mobile + '</small>' : ''}
                            <span class="badge bg-secondary ms-2">${itemCount} item${itemCount > 1 ? 's' : ''}</span>
                        </div>
                        <div class="fw-bold text-success">&#8377;${group.total.toFixed(2)}</div>
                    </div>
                    <div class="card-body p-0">`;

            group.items.forEach(function (item, idx) {
                var img = getProductImage(item);
                var name = getProductName(item);
                var qty = item.g || 1;
                var pkgSize = item.i || '';
                var status = parseInt(item.d) || 0;
                var itemDate = formatDate(item.b);

                html += `
                    <div class="d-flex align-items-center gap-2 px-3 py-2 ${idx > 0 ? 'border-top' : ''}" style="border-color:#f0f0f0 !important;">
                        ${img
                            ? `<img src="${img}" class="rounded" style="width:40px;height:40px;object-fit:cover;flex-shrink:0;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
                            : ''}
                        <div class="rounded d-flex align-items-center justify-content-center flex-shrink-0" ${img ? 'style="display:none;width:40px;height:40px;background:#e9ecef;"' : 'style="width:40px;height:40px;background:#e9ecef;"'}>
                            <i class="fas fa-box text-muted" style="font-size:14px;"></i>
                        </div>
                        <div class="flex-grow-1" style="min-width:0;">
                            <div class="fw-medium" style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
                            <div style="font-size:11px;color:#6c757d;">${qty} &times; ${pkgSize}${itemDate ? ' &middot; ' + itemDate : ''}</div>
                        </div>
                        <div class="flex-shrink-0">
                            ${getStatusBadge(status)}
                        </div>
                    </div>`;
            });

            html += `</div></div>`;
        });

        html += `</div></div>`;
        contentElement.innerHTML = html;

        var refreshBtnEl = document.getElementById('myDrvRefreshBtn_' + currentViewId);
        if (refreshBtnEl) {
            refreshBtnEl.onclick = function () {
                fetchAndDisplayOrders(contentElement, null);
            };
        }
    }

    async function handl_o_drvr_rspons(response, reload) {
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
                if (response.ms != null) console.error(response.ms);
            }
        } catch (error) {
            console.error("Handler failed:", error);
        }
    }

    window.showMyDrvPanel = async function () {
        if (typeof create_fullpage_view !== 'function') {
            if (typeof showToast === 'function') showToast('View system not available');
            return;
        }

        currentViewId = 'myDrv_' + Date.now();
        var viewResult = create_fullpage_view(currentViewId);
        if (!viewResult) {
            if (typeof showToast === 'function') showToast('Failed to create view', { type: 'error', duration: 2000 });
            return;
        }

        var contentElement = viewResult.contentElement;
        var modalInstance = viewResult.modalInstance;
        var modalElement = viewResult.modalElement;

        window._myDrvModalInstance = modalInstance;
        window._myDrvModalElement = modalElement;
        window._myDrvContent = contentElement;

        modalElement.addEventListener('fp-close', function () {
            window._myDrvModalInstance = null;
            window._myDrvModalElement = null;
            window._myDrvContent = null;
        });

        contentElement.innerHTML = `
            <div class="p-3 text-center">
                <div class="spinner-border text-primary mb-3" role="status"></div>
                <p class="text-muted">Loading orders...</p>
            </div>`;
        modalInstance.show();

        if (window.prods_ == null || window.prods_.length === 0) {
            try {
                window.prods_ = await dbDexieManager.getAllRecords(dbnm, 'p');
            } catch (e) {
                window.prods_ = [];
            }
        }

        fn100Records = await dbDexieManager.getAllRecords(dbnm, 'fn100');
        if (fn100Records.length > 0) {
            renderDriverOrders(contentElement, fn100Records);
        }

        fetchAndDisplayOrders(contentElement, modalElement);
    };

    window.showMyDrvPanel = window.showMyDrvPanel;

    var style = document.createElement('style');
    style.textContent = `
        .drv-refresh-btn { margin-left: 1px; margin-right: 10px; border: 0.7px solid #d1d5db; border-radius: 4px; padding: 4px 5px 2px 5px; cursor: pointer; }
        .drv-refresh-btn.spinning i { animation: myDrvSpin 0.8s linear infinite; }
        @keyframes myDrvSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    console.log('my_drvr.js loaded successfully');
})();
