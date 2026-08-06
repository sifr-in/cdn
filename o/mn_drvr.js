// drv_pnl.js - Driver Panel for order status updates
(function () {
    'use strict';

    console.log('drv_pnl.js initializing...');

    let selectedDriver = null;
    let selectedDriverName = '';
    let driverOrders = [];
    let itemsToUpdateStatus = [];
    let currentViewId = null;

    const statusMap = {
        '2': { text: '<i class="fas fa-truck me-1" style="color:#055160;"></i>', class: 'badge bg-info text-dark', name: 'Out For Delivery' },
        '3': { text: '<i class="fas fa-check-circle me-1" style="color:#fff;"></i>', class: 'badge bg-success', name: 'Delivered' },
        '-2': { text: '<i class="fas fa-reply me-1" style="color:#ffffff;"></i>', class: 'badge bg-secondary', name: 'Out For Return' }
    };

    function getStatusBadge(status) {
        const s = String(parseInt(status) || 0);
        const info = statusMap[s] || { text: 'Unknown', class: 'badge bg-light text-dark', name: 'Unknown' };
        return `<span class="${info.class}">${info.text} ${info.name}</span>`;
    }

    function getProductByStockId(stockId) {
        if (!window.PRODUCT_MAP) return null;
        for (const key in window.PRODUCT_MAP) {
            const p = window.PRODUCT_MAP[key];
            if (p.S && String(p.S.a) === String(stockId)) return p;
            if (p.a && String(p.a) === String(stockId)) return p;
            if (p.pid && String(p.pid) === String(stockId)) return p;
        }
        if (window.PRODUCTS) {
            for (const p of window.PRODUCTS) {
                if (p.S && String(p.S.a) === String(stockId)) return p;
                if (p.a && String(p.a) === String(stockId)) return p;
                if (p.pid && String(p.pid) === String(stockId)) return p;
            }
        }
        return null;
    }

    function getUnitName(unitId) {
        if (!window.UNIT_DATA || !unitId) return unitId || '';
        const unit = window.UNIT_DATA.find(u => String(u.a) === String(unitId));
        return unit ? (unit.f || unit.e || unitId) : (unitId || '');
    }

    function getCustomerName(customerId, customers) {
        if (!customerId || !customers) return 'Customer #' + customerId;
        const customer = customers.find(c => String(c.a) === String(customerId));
        return customer ? (customer.h || customer.e || 'Unknown') : 'Customer #' + customerId;
    }

    function formatDate(dateValue) {
        if (!dateValue) return 'N/A';
        try {
            const d = new Date(dateValue.replace(' ', 'T'));
            if (isNaN(d.getTime())) return String(dateValue);
            return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
        } catch (e) { return String(dateValue); }
    }

    // Fetch orders assigned to a driver
    async function fetchDriverOrders(driverId) {
        try {
            const allOrders = await dbDexieManager.getAllRecords(dbnm, 'o');
            const customers = await dbDexieManager.getAllRecords(dbnm, 'c');

            // Filter orders: status 2 (Out For Delivery) and check if this driver is assigned
            // For now, filter by status 2 only (drivers see all Out For Delivery orders)
            const filtered = allOrders.filter(order => {
                const status = parseInt(order.d) || 0;
                return status === 2 || status === -2; // Out For Delivery or Out For Return
            });

            // Group by customer
            const groupedMap = {};
            filtered.forEach(order => {
                const customerId = order.e;
                const groupKey = String(customerId);
                if (!groupedMap[groupKey]) {
                    const customer = customers.find(c => String(c.a) === String(customerId));
                    groupedMap[groupKey] = {
                        customerId: customerId,
                        customerName: customer ? (customer.h || customer.e || 'Unknown') : 'Customer #' + customerId,
                        items: []
                    };
                }
                groupedMap[groupKey].items.push(order);
            });

            return Object.values(groupedMap);
        } catch (error) {
            console.error('Error fetching driver orders:', error);
            return [];
        }
    }

    // Show driver selection (like my1ctr.js)
    async function showDriverSelection() {
        if (typeof create_fullpage_view !== 'function') {
            if (typeof showToast === 'function') showToast('View system not available');
            return;
        }

        currentViewId = 'driverSelect_' + Date.now();
        const viewResult = create_fullpage_view(currentViewId);

        if (!viewResult) {
            if (typeof showToast === 'function') showToast('Failed to create view', { type: 'error', duration: 2000 });
            return;
        }

        const { contentElement, modalInstance, modalElement } = viewResult;
        window._mndrvModalInstance = modalInstance;
        window._mndrvModalElement = modalElement;
        window._mndrvContentElement = contentElement;

        modalElement.addEventListener('fp-close', function () {
            window._mndrvModalInstance = null;
            window._mndrvModalElement = null;
            window._mndrvContentElement = null;
        });

        itemsToUpdateStatus = [];
        selectedDriver = null;

        contentElement.innerHTML = `
            <div class="p-2">
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <h5 class="mb-0"><i class="fas fa-user-hard-hat me-2 text-primary"></i>Manage Driver</h5>
                    <button type="button" class="btn-close" onclick="document.getElementById('${currentViewId}').dispatchEvent(new Event('fp-close'))"></button>
                </div>
                <div class="text-center py-4">
                    <i class="fas fa-user-circle fa-4x text-primary mb-3" style="opacity:0.3;"></i>
                    <h6 class="mb-3">Select Driver</h6>
                    <div class="row justify-content-center">
                        <div class="col-md-6 col-lg-4">
                            <label class="form-label fw-bold small mb-1"><i class="fas fa-user me-1 text-info"></i>Select Driver</label>
                            <input id="mndrvDriverInput_${currentViewId}" class="form-control form-control-sm border border-dark mb-3"
                                readonly placeholder="Click to select Driver" value=""
                                onclick="window._openDriverForMNDrv('${currentViewId}')">
                            <input type="hidden" id="mndrvDriverId_${currentViewId}" value="">
                            <button class="btn btn-primary btn-lg w-70" id="mndrvLoadOrdersBtn_${currentViewId}" disabled>
                                <i class="fas fa-list-check me-2"></i>Load Driver Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

        modalInstance.show();

        setTimeout(() => {
            const loadBtn = document.getElementById('mndrvLoadOrdersBtn_' + currentViewId);
            if (loadBtn) {
                loadBtn.addEventListener('click', async function () {
                    const driverId = document.getElementById('mndrvDriverId_' + currentViewId)?.value;
                    if (!driverId) return;
                    selectedDriver = parseInt(driverId);
                    modalElement.dispatchEvent(new Event('fp-close'));
                    setTimeout(() => showDriverOrders(selectedDriver), 400);
                });
            }
        }, 100);
    }

    window._openDriverForMNDrv = function (viewId) {
        window._mndrvViewId = viewId;
        (async () => { await loadExe2Fn(22, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_op_DrvSelect_MNDrv', 1], [1]); })();
    };

    window.commonFnToRunAfter_op_DrvSelect_MNDrv = function (obj, swtch) {
        if (swtch !== 1) {
            if (typeof showToast === 'function') showToast('Please select a valid driver', { type: 'warning', duration: 2000 });
            return;
        }
        const driverId = obj.a;
        const driverName = obj.h || obj.i || '';
        const driverMobile = obj.e || '';
        const displayName = driverName || driverMobile || '';

        const viewId = window._mndrvViewId;
        if (!viewId) return;

        const driverInput = document.getElementById('mndrvDriverInput_' + viewId);
        const driverIdInput = document.getElementById('mndrvDriverId_' + viewId);
        const loadBtn = document.getElementById('mndrvLoadOrdersBtn_' + viewId);
        if (driverInput) driverInput.value = displayName;
        if (driverIdInput) driverIdInput.value = driverId;
        if (loadBtn) loadBtn.disabled = false;

        if (typeof removeAllBackdrops === 'function') removeAllBackdrops();

        setTimeout(function () {
            if (window._mndrvModalInstance) {
                try { window._mndrvModalInstance.show(); } catch (e) { }
            }
            if (window._mndrvModalElement) {
                window._mndrvModalElement.style.display = '';
                window._mndrvModalElement.classList.add('show');
            }
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            if (typeof removeAllBackdrops === 'function') removeAllBackdrops();
        }, 300);

        if (typeof showToast === 'function') {
            showToast('Driver selected: ' + displayName, { type: 'success', duration: 1500 });
        }
    };

    // Show driver orders
    async function showDriverOrders(driverId) {
        if (typeof create_fullpage_view !== 'function') return;

        var driver = null;
        try {
            var allC = await dbDexieManager.getAllRecords(dbnm, 'c');
            driver = allC.find(function (d) { return Number(d.a) === Number(driverId); });
        } catch (e) { driver = null; }
        var driverName = driver ? (driver.h || driver.e || 'Driver') : 'Driver';
        selectedDriverName = driverName;

        currentViewId = 'driverOrders_' + Date.now();
        const viewResult = create_fullpage_view(currentViewId);
        if (!viewResult) return;

        const { contentElement, modalInstance, modalElement } = viewResult;
        itemsToUpdateStatus = [];

        contentElement.innerHTML = `<div class="p-2 text-center"><div class="spinner-border text-primary mb-3"></div><p>Loading orders...</p></div>`;
        modalInstance.show();

        driverOrders = await fetchDriverOrders(driverId);

        if (driverOrders.length === 0) {
            contentElement.innerHTML = `
                <div class="p-2">
                    <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <h5 class="mb-0"><i class="fas fa-clipboard-list me-2 text-primary"></i>${driverName}'s Orders</h5>
                        <button type="button" class="btn-close" onclick="document.getElementById('${currentViewId}').dispatchEvent(new Event('fp-close'))"></button>
                    </div>
                    <div class="text-center py-5">
                        <i class="fas fa-box-open fa-4x text-muted mb-3" style="opacity:0.4;"></i>
                        <h6 class="text-muted">No Orders Assigned</h6>
                        <p class="text-muted small">No out-for-delivery orders found</p>
                        <button class="btn btn-primary btn-sm" onclick="document.getElementById('${currentViewId}').dispatchEvent(new Event('fp-close'))">Close</button>
                    </div>
                </div>`;
            return;
        }

        renderDriverOrdersHTML(contentElement, modalInstance, modalElement, driverName);
    }

    function renderDriverOrdersHTML(contentElement, modalInstance, modalElement, driverName) {
        const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="#f0f0f0"/><text x="25" y="30" text-anchor="middle" font-size="20" fill="#999">📦</text></svg>');

        let html = `<div class="p-3">
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <h5 class="mb-0">
                    <i class="fas fa-clipboard-list me-2 text-primary"></i>${driverName}'s Orders
                    <span class="badge bg-secondary ms-2">${driverOrders.length} customers</span>
                </h5>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.showDriverPanel()" title="Change Driver">
                        <i class="fas fa-exchange-alt me-1"></i>Change
                    </button>
                    <button type="button" class="btn-close" onclick="document.getElementById('${currentViewId}').dispatchEvent(new Event('fp-close'))"></button>
                </div>
            </div>
            <div class="orders-list" style="max-height:500px;overflow-y:auto;">`;

        driverOrders.forEach((group, groupIndex) => {
            const itemCount = group.items.length;
            let groupTotal = 0;
            group.items.forEach(item => {
                const priceInfo = item.priceInfo || { selling: 0, increment: 1 };
                const increment = Number(priceInfo.increment || 1);
                const selling = Number(priceInfo.selling || 0);
                groupTotal += (item.g / increment) * selling;
            });

            html += `<div class="oh-order-card mb-3 border rounded-3 shadow-sm" style="background:#fff;overflow:hidden;">
                <div class="d-flex justify-content-between align-items-center px-3 py-2" style="background:#f8f9fa;border-bottom:1px solid #eee;">
                    <div>
                        <strong>${group.customerName}</strong>
                        <small class="text-muted ms-2">${itemCount} item(s)</small>
                    </div>
                    <div class="fw-bold text-success">₹${groupTotal.toFixed(2)}</div>
                </div>`;

            group.items.forEach((item, idx) => {
                const product = getProductByStockId(item.f);
                const productName = product ? product.name : 'Product #' + item.f;
                const productImg = product && product.image ? (typeof getGoogleDriveImageUrl === 'function' ? getGoogleDriveImageUrl(product.image) : product.image) : '';
                const unitName = getUnitName(item.h);
                const qty = item.g || 1;
                const itemStatus = parseInt(item.d) || 0;
                const isMarkedForStatus = itemsToUpdateStatus.some(s => s.e == item.a);
                const uniqueId = 'drvItem_' + groupIndex + '_' + idx;
                const statusUniqueId = 'drvStatus_' + groupIndex + '_' + idx;

                // Only allow updating to Delivered (3) or Out For Return (-2)
                const availableActions = [];
                if (itemStatus === 2) {
                    availableActions.push({ value: 3, text: statusMap['3'].text, class: statusMap['3'].class, name: 'Delivered' });
                    availableActions.push({ value: -2, text: statusMap['-2'].text, class: statusMap['-2'].class, name: 'Out For Return' });
                }

                let actionButtons = '';
                if (availableActions.length > 0) {
                    availableActions.forEach(action => {
                        const isSelected = itemsToUpdateStatus.some(s => s.e == item.a && s.d == action.value);
                        actionButtons += `
                            <button class="btn btn-sm ${isSelected ? 'btn-success' : 'btn-outline-secondary'} ms-1" 
                                style="font-size:10px;padding:2px 6px;border-radius:4px;"
                                onclick="window.driverToggleStatus('${item.a}', ${action.value}, '${statusUniqueId}', '${currentViewId}')"
                                title="${action.name}">
                                <span class="${action.class}" style="font-size:10px;">${action.text}</span>
                                ${isSelected ? '<i class="fas fa-check ms-1"></i>' : ''}
                            </button>`;
                    });
                }

                html += `<div class="d-flex align-items-center gap-2 px-3 py-2 ${idx > 0 ? 'border-top' : ''}" style="border-color:#f0f0f0;" id="${uniqueId}">
                    ${productImg ? `<img src="${productImg}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;flex-shrink:0;" onerror="this.src='${PLACEHOLDER_IMG}'">` : `<div style="width:36px;height:36px;border-radius:6px;background:#e9ecef;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-box text-muted" style="font-size:12px;"></i></div>`}
                    <div class="flex-grow-1" style="min-width:0;">
                        <div class="fw-medium" style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${productName}</div>
                        <div style="font-size:11px;color:#6c757d;">${qty} × ${item.i || ''} ${unitName}</div>
                    </div>
                    <span id="${statusUniqueId}" style="flex-shrink:0;${isMarkedForStatus ? 'text-decoration:line-through;' : ''}">
                        ${getStatusBadge(itemStatus)}
                    </span>
                    <div class="d-flex flex-shrink-0">${actionButtons}</div>
                </div>`;
            });

            html += `</div>`;
        });

        html += `</div>
            ${itemsToUpdateStatus.length > 0 ? `
            <div class="border-top pt-3 mt-3">
                <button class="btn btn-primary btn-lg w-100" onclick="window.driverSubmitUpdates('${currentViewId}')">
                    <i class="fas fa-check-circle me-2"></i>Submit Updates (${itemsToUpdateStatus.length} items)
                </button>
            </div>` : ''}
        </div>`;

        contentElement.innerHTML = html;
    }

    // Toggle status for driver
    window.driverToggleStatus = function (itemId, newStatus, statusUniqueId, viewId) {
        const existingIndex = itemsToUpdateStatus.findIndex(s => s.e == itemId);

        if (existingIndex >= 0) {
            if (itemsToUpdateStatus[existingIndex].d === newStatus) {
                // Deselect
                itemsToUpdateStatus.splice(existingIndex, 1);
            } else {
                // Change status
                itemsToUpdateStatus[existingIndex].d = newStatus;
            }
        } else {
            itemsToUpdateStatus.push({ e: itemId, d: newStatus, drv: selectedDriver });
        }

        // Refresh view
        const viewEl = document.getElementById(viewId);
        if (viewEl) {
            const content = viewEl.querySelector('.fp-content') || viewEl.querySelector('.modal-body') || viewEl;
            if (content) {
                renderDriverOrdersHTML(content, null, viewEl, selectedDriverName || 'Driver');
            }
        }
    };

    // Submit driver updates
    window.driverSubmitUpdates = async function (viewId) {
        if (itemsToUpdateStatus.length === 0) return;

        // Show confirmation
        if (typeof create_modal_dynamically === 'function') {
            const confirmModalId = 'confirmDriverUpdate_' + Date.now();
            const confirmResult = create_modal_dynamically(confirmModalId);
            if (confirmResult) {
                const { contentElement, modalInstance } = confirmResult;

                let itemsListHtml = '';
                itemsToUpdateStatus.forEach(item => {
                    const statusName = statusMap[String(item.d)]?.name || 'Unknown';
                    itemsListHtml += `<div class="d-flex justify-content-between py-1 border-bottom">
                        <span style="font-size:12px;">Order #${item.e}</span>
                        <span class="badge bg-primary">→ ${statusName}</span>
                    </div>`;
                });

                contentElement.innerHTML = `
                    <div class="p-3">
                        <div class="mb-3 text-center"><i class="fas fa-info-circle text-primary" style="font-size:48px;"></i></div>
                        <h5 class="text-center mb-2">Confirm Updates</h5>
                        <p class="text-center text-muted small">Update ${itemsToUpdateStatus.length} order(s):</p>
                        <div class="mb-3" style="max-height:200px;overflow-y:auto;">${itemsListHtml}</div>
                        <div class="d-flex justify-content-center gap-2 mt-3 pt-2 border-top">
                            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                            <button class="btn btn-primary btn-sm" id="confirmDriverUpdateBtn_${confirmModalId}">
                                <i class="fas fa-check me-1"></i>Confirm
                            </button>
                        </div>
                    </div>`;

                document.getElementById('confirmDriverUpdateBtn_' + confirmModalId).addEventListener('click', async function () {
                    modalInstance.hide();
                    await sendDriverUpdates(viewId);
                });

                modalInstance.show();
            }
        }
    };

    async function sendDriverUpdates(viewId) {
        if (itemsToUpdateStatus.length === 0) return;
        if (typeof payload0 !== 'undefined') {
            payload0.vw = 1;
            payload0.fn = 0;
            payload0.o = [...itemsToUpdateStatus];
            payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'od' }]);

            var _ldId = 'mndr_ld_' + Date.now();
            var _ldDiv = document.createElement('div');
            _ldDiv.id = _ldId;
            _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
            _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
            document.body.appendChild(_ldDiv);

            try {
                const response = await fnj3("https://mydrv1.in/2/l.php", payload0, 1, true, null, 20000, 0, 2, 1);
                var _ldEl = document.getElementById(_ldId);
                if (_ldEl) _ldEl.remove();
                if (response && response.su == 1) {
                    handl_o_rspons(response, 1);
                    itemsToUpdateStatus = [];
                    window.showsuccessmodal(response.ms || "Status updated successfully!");

                    const viewEl = document.getElementById(viewId);
                    if (viewEl) viewEl.dispatchEvent(new Event('fp-close'));
                    setTimeout(() => window.showDriverPanel(), 600);
                } else {
                    window.showelsemodal(response?.ms || 'Failed to update status.');
                }
            } catch (error) {
                var _ldEl2 = document.getElementById(_ldId);
                if (_ldEl2) _ldEl2.remove();
                window.showelsemodal(error || 'Network Error');
            }
        }
    }

    // Main entry point
    window.showDriverPanel = async function () {
        selectedDriver = null;
        itemsToUpdateStatus = [];
        driverOrders = [];
        await showDriverSelection();
    };

    // Expose functions
    window.showDriverPanel = window.showDriverPanel;
    window.driverToggleStatus = window.driverToggleStatus;
    window.driverSubmitUpdates = window.driverSubmitUpdates;

    console.log('drv_pnl.js loaded successfully');

})();