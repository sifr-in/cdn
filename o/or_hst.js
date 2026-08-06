// orders_history.js - Order History Management
(function () {
    'use strict';

    console.log('orders_history.js initializing...');
    let itemsToCancel = [];
    let selectedItemIds = [];
    let selectedChosenStatus = null;
    let selectedDriverId = null;
    let selectedDriverName = '';
    let filterCustomerId = null;
    let currentStatusFilter = null;

    function getItemTotal(qty, priceInfo) {
        const increment = Number(priceInfo.increment || 1);
        const selling = Number(priceInfo.selling || 0);
        return (qty / increment) * selling;
    }

    function getPriceInfo(stockId, unitId, packageSize) {
        if (!window.PRODUCT_MAP) return { selling: 0, increment: 1, package: packageSize };
        for (const key in window.PRODUCT_MAP) {
            const product = window.PRODUCT_MAP[key];
            if (product.S && String(product.S.a) === String(stockId)) {
                const soldIn = product.soldIn || {};
                const unitPrices = soldIn[unitId] || [];
                for (const price of unitPrices) {
                    if (String(price.package) === String(packageSize) || parseFloat(price.package) === parseFloat(packageSize)) {
                        return { selling: price.selling || 0, increment: price.increment || 1, package: price.package || packageSize };
                    }
                }
                if (unitPrices.length > 0) {
                    return { selling: unitPrices[0].selling || 0, increment: unitPrices[0].increment || 1, package: unitPrices[0].package || packageSize };
                }
            }
        }
        return { selling: 0, increment: 1, package: packageSize };
    }

    async function getAllOrderItems(customerId) {
        try {
            let allOrders = [];
            try { allOrders = await dbDexieManager.getAllRecords(dbnm, 'o'); } catch (e) { }
            if (!allOrders || allOrders.length === 0) {
                try {
                    const db = await new Promise((resolve, reject) => { const r = indexedDB.open(dbnm); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
                    const tx = db.transaction(['o'], 'readonly'); const st = tx.objectStore('o'); const req = st.getAll();
                    allOrders = await new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result || []); req.onerror = () => reject(req.error); });
                    db.close();
                } catch (e2) { }
            }
            if (!allOrders || allOrders.length === 0) return [];

            if (customerId) {
                allOrders = allOrders.filter(order => String(order.e) === String(customerId));
            }

            return groupOrdersByDate(allOrders);
        } catch (error) { console.error('Error getting orders:', error); return []; }
    }

    function groupOrdersByDate(items) {
        const ordersMap = {};
        items.forEach(item => {
            const orderKey = item.b || 'unknown';
            if (!ordersMap[orderKey]) {
                ordersMap[orderKey] = {
                    dateTime: item.b || '',
                    items: [],
                    totalAmount: 0,
                    customerId: item.e
                };
            }
            const priceInfo = getPriceInfo(item.f, item.h, item.i);
            const correctAmount = getItemTotal(item.g, priceInfo);
            ordersMap[orderKey].items.push({
                id: item.a, dateTime: item.b, status: item.d,
                customerId: item.e,
                stockId: item.f, qty: item.g, unitId: item.h,
                packageSize: item.i, amount: correctAmount, _rawItem: item
            });
            ordersMap[orderKey].totalAmount += correctAmount;
        });
        return Object.values(ordersMap).sort((a, b) => {
            if (!a.dateTime || a.dateTime === 'unknown') return 1;
            if (!b.dateTime || b.dateTime === 'unknown') return -1;
            const dateA = new Date(a.dateTime.replace(' ', 'T'));
            const dateB = new Date(b.dateTime.replace(' ', 'T'));
            return dateB - dateA;
        });
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

    async function getCustomerName(customerId) {
        if (!customerId) return '';
        try {
            const customers = await dbDexieManager.getAllRecords(dbnm, 'c');
            const customer = customers.find(c => String(c.a) === String(customerId));
            return customer ? (customer.h || customer.i || customer.e || 'Unknown') : 'Customer #' + customerId;
        } catch (e) {
            return 'Customer #' + customerId;
        }
    }

    function getUnitName(unitId) {
        if (!window.UNIT_DATA || !unitId) return unitId || '';
        const unit = window.UNIT_DATA.find(u => String(u.a) === String(unitId));
        return unit ? (unit.f || unit.e || unitId) : (unitId || '');
    }

    function formatDate(dateValue) {
        if (!dateValue) return 'N/A';
        try {
            const d = new Date(dateValue.replace(' ', 'T'));
            if (isNaN(d.getTime())) return String(dateValue);
            return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
        } catch (e) { return String(dateValue); }
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
        const info = statusMap[s] || { text: 'Unknown', class: 'badge bg-light text-dark', name: 'Unknown' };
        return `<span class="${info.class}">${info.text}</span>`;
    }

    function getStatusText(status) {
        const s = String(parseInt(status) || 0);
        return statusMap[s] ? statusMap[s].name : 'Unknown';
    }

    function getProductImageUrl(product) {
        if (!product) return '';
        if (product.image) {
            if (typeof getGoogleDriveImageUrl === 'function') return getGoogleDriveImageUrl(product.image);
            return product.image;
        }
        return '';
    }

    async function deleteOrderItemsFromDB(itemIds) {
        try {
            let deletedCount = 0;
            const allOrders = await dbDexieManager.getAllRecords(dbnm, 'o');
            const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(dbnm);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
            const transaction = db.transaction(['o'], 'readwrite');
            const store = transaction.objectStore('o');

            for (const itemId of itemIds) {
                const record = allOrders.find(o => String(o.a) === String(itemId));
                if (record) {
                    try {
                        const allKeys = await new Promise((resolve) => {
                            const keyRequest = store.getAllKeys();
                            keyRequest.onsuccess = () => resolve(keyRequest.result);
                            keyRequest.onerror = () => resolve([]);
                        });
                        const allRecords = await new Promise((resolve) => {
                            const req = store.getAll();
                            req.onsuccess = () => resolve(req.result);
                            req.onerror = () => resolve([]);
                        });
                        const index = allRecords.findIndex(r => String(r.a) === String(itemId));
                        if (index >= 0 && allKeys[index] !== undefined) {
                            await new Promise((resolve) => {
                                const deleteRequest = store.delete(allKeys[index]);
                                deleteRequest.onsuccess = () => { deletedCount++; resolve(); };
                                deleteRequest.onerror = () => { resolve(); };
                            });
                        }
                    } catch (e) { console.error('Error:', itemId, e); }
                }
            }
            db.close();
            return deletedCount;
        } catch (e) { console.error('Error:', e); return 0; }
    }

    function updateHeaderButtons(modalId, isFromManageOrders) {
        const toolbar = document.getElementById('ohToolbar_' + modalId);
        if (!toolbar) return;

        const existingCancelBtn = document.getElementById('ohCancelSelectedBtn_' + modalId);
        const existingStatusBtn = document.getElementById('ohUpdateStatusBtn_' + modalId);
        const existingClearBtn = document.getElementById('ohClearBtn_' + modalId);
        if (existingCancelBtn) existingCancelBtn.remove();
        if (existingStatusBtn) existingStatusBtn.remove();
        if (existingClearBtn) existingClearBtn.remove();

        if (isFromManageOrders && selectedItemIds.length > 0) {
            const statusBtn = document.createElement('button');
            statusBtn.id = 'ohUpdateStatusBtn_' + modalId;
            statusBtn.className = 'btn btn-sm btn-primary';
            statusBtn.innerHTML = `<i class="fas fa-check-circle me-1"></i>Update Status (${selectedItemIds.length})`;
            statusBtn.addEventListener('click', function () { window.openStatusSelectModal(modalId); });
            toolbar.appendChild(statusBtn);

            const clearBtn = document.createElement('button');
            clearBtn.id = 'ohClearBtn_' + modalId;
            clearBtn.className = 'btn btn-sm btn-outline-secondary';
            clearBtn.innerHTML = `<i class="fas fa-times me-1"></i>Clear`;
            clearBtn.addEventListener('click', function () { window.clearSelection(modalId); });
            toolbar.appendChild(clearBtn);
        }

        if (!isFromManageOrders && itemsToCancel.length > 0) {
            const cancelBtn = document.createElement('button');
            cancelBtn.id = 'ohCancelSelectedBtn_' + modalId;
            cancelBtn.className = 'btn btn-sm btn-danger';
            cancelBtn.innerHTML = `<i class="fas fa-trash me-1"></i>Cancel Selected (${itemsToCancel.length})`;
            cancelBtn.addEventListener('click', function () { window.confirmCancelItems(modalId); });
            toolbar.appendChild(cancelBtn);
        }
    }

    window.howOrderHistoryModal = async function (customerId) {
        filterCustomerId = customerId || window._selectedOrderCustomerId || null;
        currentStatusFilter = window._selectedOrderCustomerId ? true : false;

        if (window._selectedOrderCustomerId) {
            window._selectedOrderCustomerId = null;
        }

        itemsToCancel = [];
        selectedItemIds = [];
        selectedChosenStatus = null;
        selectedDriverId = null;
        selectedDriverName = '';

        if (typeof create_fullpage_view !== 'function') {
            if (typeof showToast === 'function') showToast('View system not available');
            return;
        }

        const modalId = 'orderHistoryModal_' + Date.now();
        const modalResult = create_fullpage_view(modalId);
        if (!modalResult) return;

        const { contentElement, modalInstance, modalElement } = modalResult;

        contentElement.innerHTML = `<div class="p-2 text-center"><div class="spinner-border text-primary mb-3"></div><p>Loading orders...</p></div>`;
        modalInstance.show();

        const orders = await getAllOrderItems(filterCustomerId);

        let customerName = '';
        if (filterCustomerId) {
            customerName = await getCustomerName(filterCustomerId);
        }

        if (orders.length === 0) {
            contentElement.innerHTML = `
            <div class="p-2">
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <h5 class="mb-0"><i class="fas fa-clock me-2 text-primary"></i>Order History</h5>
                </div>
                <div class="text-center py-5">
                    <i class="fas fa-receipt fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No orders found${filterCustomerId ? ' for ' + customerName : ''}</p>
                    <button class="btn btn-primary btn-sm" data-fp-close="1">Close</button>
                </div>
            </div>`;
            return;
        }

        const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="#f0f0f0"/><text x="25" y="30" text-anchor="middle" font-size="20" fill="#999">📦</text></svg>');
        const isFromManageOrders = !!currentStatusFilter;

        let html = `<div class="p-2">
        <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <h5 class="mb-0">
                <i class="fas fa-clock me-2 text-primary"></i>Order History
                ${filterCustomerId ? `<span class="badge bg-info ms-2" style="font-size:12px;">${customerName}</span>` : ''}
            </h5>
        </div>
        <div id="ohToolbar_${modalId}" class="d-flex gap-2 mb-2"></div>
        <div class="orders-list" style="max-height:500px;overflow-y:auto;">`;

        orders.forEach((order, orderIndex) => {
            const orderDate = formatDate(order.dateTime);
            const items = order.items || [];
            const totalAmount = order.totalAmount !== undefined ? order.totalAmount : items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
            const itemCount = items.length;

            html += `<div class="oh-order-card mb-3 border rounded-3 shadow-sm" style="background:#fff;overflow:hidden;">
            <div class="d-flex justify-content-between align-items-center px-3 py-2" style="background:#f8f9fa;border-bottom:1px solid #eee;">
                <div style="font-size:13px;color:#6c757d;"><i class="far fa-calendar-alt me-1"></i>${orderDate}</div>
                <div style="font-size:12px;color:#6c757d;">${itemCount} item(s) | <strong>₹${totalAmount.toFixed(2)}</strong></div>
            </div>`;

            items.forEach((item, idx) => {
                const product = getProductByStockId(item.stockId);
                const productName = product ? product.name : 'Product #' + item.stockId;
                const productImg = getProductImageUrl(product);
                const unitName = getUnitName(item.unitId);
                const packageSize = item.packageSize || '';
                const qty = item.qty || 1;
                const itemAmount = parseFloat(item.amount) || 0;
                const itemStatus = item.status !== undefined ? item.status : 0;
                const isMarkedForCancel = itemsToCancel.some(c => c.a == item.id);
                const isMarkedForStatus = selectedItemIds.includes(String(item.id));
                const uniqueItemId = 'cancelItem_' + orderIndex + '_' + idx;

                if (isFromManageOrders) {
                    html += `<div class="d-flex align-items-center gap-2 px-3 py-2 ${idx > 0 ? 'border-top' : ''} ${isMarkedForStatus ? 'oh-selected' : ''}" style="border-color:#f0f0f0;cursor:pointer;" id="${uniqueItemId}"
                        onclick="window.toggleItemSelection('${window.escapeHTML(item.id)}', '${uniqueItemId}', '${modalId}')">
                    <input type="checkbox" class="form-check-input oh-item-checkbox" ${isMarkedForStatus ? 'checked' : ''} style="flex-shrink:0;display:${isMarkedForStatus ? 'block' : 'none'};pointer-events:none;" onclick="event.stopPropagation();">
                    ${productImg ? `<img src="${productImg}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;flex-shrink:0;" onerror="this.src='${PLACEHOLDER_IMG}'">` : `<div style="width:36px;height:36px;border-radius:6px;background:#e9ecef;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-box text-muted" style="font-size:12px;"></i></div>`}
                    <div class="flex-grow-1" style="min-width:0;">
                        <div class="fw-medium" style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${productName}</div>
                        <div style="font-size:11px;color:#6c757d;">${qty} × ${packageSize} ${unitName}</div>
                    </div>
                    <div class="fw-bold" style="font-size:13px;color:#198754;flex-shrink:0;min-width:55px;text-align:right;">₹${itemAmount.toFixed(2)}</div>
                    <span style="flex-shrink:0;">${getStatusBadge(itemStatus)}</span>
                </div>`;
                } else {
                    html += `<div class="d-flex align-items-center gap-2 px-3 py-2 ${idx > 0 ? 'border-top' : ''} ${isMarkedForCancel ? 'oh-cancel-marked' : ''}" style="border-color:#f0f0f0;" id="${uniqueItemId}">
                    ${productImg ? `<img src="${productImg}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;flex-shrink:0;opacity:${isMarkedForCancel ? '0.6' : '1'};" onerror="this.src='${PLACEHOLDER_IMG}'">` : `<div style="width:40px;height:40px;border-radius:8px;background:#e9ecef;display:flex;align-items:center;justify-content:center;flex-shrink:0;opacity:${isMarkedForCancel ? '0.6' : '1'};"><i class="fas fa-box text-muted" style="font-size:14px;"></i></div>`}
                    <div class="d-flex align-items-center flex-grow-1" style="font-size:13px;min-width:0;text-decoration:${isMarkedForCancel ? 'line-through' : 'none'};text-decoration-thickness:${isMarkedForCancel ? '2px' : '0'};">
                        <div style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${productName}
                        </div>
                        <span style="margin-left:8px;flex-shrink:0;">
                            ${getStatusBadge(itemStatus)}
                        </span>
                    </div>
                    <div class="text-end" style="flex-shrink:0;text-decoration:${isMarkedForCancel ? 'line-through' : 'none'};text-decoration-thickness:${isMarkedForCancel ? '2px' : '0'};">
                        <div class="fw-bold" style="font-size:13px;color:#198754;">₹${itemAmount.toFixed(2)}</div>
                    </div>
                    ${parseInt(itemStatus) === 0 ? `<button class="btn btn-sm ${isMarkedForCancel ? 'btn-outline-secondary' : 'btn-outline-danger'} ms-2 oh-cancel-btn" style="font-size:10px;padding:2px 8px;border-radius:6px;flex-shrink:0;" onclick="event.stopPropagation();window.toggleCancelItem(${orderIndex}, ${idx}, '${window.escapeHTML(modalId)}', '${uniqueItemId}')"><i class="fas ${isMarkedForCancel ? 'fa-undo' : 'fa-times'}"></i> ${isMarkedForCancel ? 'Keep' : 'Cancel'}</button>` : ''}
                </div>`;
                }
            });

            html += `</div>`;
        });

        html += `</div></div>`;
        contentElement.innerHTML = html;
        contentElement._ordersData = orders;
        contentElement._isFromManageOrders = isFromManageOrders;
        modalElement._ordersData = orders;
        modalElement._isFromManageOrders = isFromManageOrders;
        updateHeaderButtons(modalId, isFromManageOrders);
    };

    window.toggleItemSelection = function (itemId, uniqueItemId, modalId) {
        const strId = String(itemId);
        const idx = selectedItemIds.indexOf(strId);
        if (idx >= 0) {
            selectedItemIds.splice(idx, 1);
        } else {
            selectedItemIds.push(strId);
        }

        const el = document.getElementById(uniqueItemId);
        if (el) {
            const cb = el.querySelector('.oh-item-checkbox');
            const isSelected = selectedItemIds.includes(strId);
            if (cb) { cb.checked = isSelected; cb.style.display = isSelected ? 'block' : 'none'; }
            if (isSelected) {
                el.classList.add('oh-selected');
            } else {
                el.classList.remove('oh-selected');
            }
        }

        updateHeaderButtons(modalId, true);
    };

    window.clearSelection = function (modalId) {
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
            const rows = modalEl.querySelectorAll('[id^="cancelItem_"]');
            rows.forEach(function (row) {
                const cb = row.querySelector('.oh-item-checkbox');
                if (cb) { cb.checked = false; cb.style.display = 'none'; }
                row.classList.remove('oh-selected');
            });
        }
        selectedItemIds = [];
        updateHeaderButtons(modalId, true);
    };

    function getSelectedItemDetails() {
        const modalEl = document.querySelector('[id^="orderHistoryModal_"]');
        const orders = modalEl ? (modalEl._ordersData || []) : [];
        const details = [];
        const allItems = [];
        orders.forEach(function (order) { (order.items || []).forEach(function (item) { allItems.push(item); }); });
        selectedItemIds.forEach(function (id) {
            const item = allItems.find(function (it) { return String(it.id) === String(id); });
            if (item) {
                const product = getProductByStockId(item.stockId);
                details.push({
                    id: item.id,
                    name: product ? product.name : 'Item #' + item.stockId,
                    status: item.status !== undefined ? item.status : 0
                });
            }
        });
        return details;
    }

    window.openStatusSelectModal = function (modalId) {
        if (selectedItemIds.length === 0) return;

        if (typeof create_modal_dynamically !== 'function') return;

        const selectModalId = 'selectStatus_' + Date.now();
        const selectResult = create_modal_dynamically(selectModalId);
        if (!selectResult) return;

        const { contentElement: selectContent, modalInstance: selectInstance, modalElement: selectElement } = selectResult;

        const selectedDetails = getSelectedItemDetails();

        const statuses = [
            { value: 0, needsDriver: false },
            { value: 1, needsDriver: false },
            { value: 2, needsDriver: true },
            { value: 3, needsDriver: false },
            { value: -1, needsDriver: false },
            { value: -2, needsDriver: true },
            { value: -3, needsDriver: false }
        ];

        function renderStatusModal(chosenStatus) {
            const needsDriver = (chosenStatus === 2 || chosenStatus === -2);

            const statusCounts = {};
            selectedDetails.forEach(function (d) {
                const s = String(parseInt(d.status) || 0);
                statusCounts[s] = (statusCounts[s] || 0) + 1;
            });
            let currentStatusHtml = '';
            for (const s in statusCounts) {
                const info = statusMap[s] || { text: 'Unknown', class: 'badge bg-light text-dark', name: 'Unknown' };
                currentStatusHtml += `<span class="${info.class} me-1 mb-1" style="font-size:11px;">${statusCounts[s]}x ${info.name}</span>`;
            }

            const currentStatusKeys = Object.keys(statusCounts);
            const sameCurrentStatus = currentStatusKeys.length === 1 ? currentStatusKeys[0] : null;

            let optionsHtml = '';
            statuses.forEach(function (status) {
                if (String(status.value) === sameCurrentStatus) return;
                const info = statusMap[String(status.value)];
                const isActive = chosenStatus === status.value;
                optionsHtml += `
                <div class="mb-1">
                    <button class="btn btn-sm w-100 text-start d-flex align-items-center ${isActive ? 'btn-primary' : 'btn-outline-secondary'}" 
                            style="border-color:#dee2e6;padding:8px 10px;"
                            onclick="window._onStatusOptionClick(${status.value}, '${selectModalId}', '${modalId}')">
                        <span class="${info.class}" style="font-size:11px;min-width:110px;">${info.text} ${info.name}</span>
                        <span class="ms-auto">${isActive ? '<i class="fas fa-check-circle text-white"></i>' : '<i class="fas fa-chevron-right" style="font-size:10px;color:#999;"></i>'}</span>
                    </button>
                </div>`;
            });

            let driverInputHtml = '';
            if (needsDriver) {
                let driverDisplay = selectedDriverName || '';
                driverInputHtml = `
                <div class="mt-2 pt-2 border-top" id="ohDriverInputSection_${selectModalId}">
                    <label class="form-label fw-bold small mb-1"><i class="fas fa-user me-1 text-info"></i>Select Driver</label>
                    <input id="ohDriverInput_${selectModalId}" class="form-control form-control-sm border border-dark" 
                        readonly placeholder="Click to select Driver" value="${driverDisplay}"
                        onclick="window._openDriverForOH('${selectModalId}')">
                    <input type="hidden" id="ohDriverId_${selectModalId}" value="${selectedDriverId || ''}">
                </div>`;
            }

            const chosenInfo = chosenStatus !== null ? statusMap[String(chosenStatus)] : null;

            selectContent.innerHTML = `
            <div style="padding:12px 16px;">
                <h6 class="mb-1 text-center fw-bold"><i class="fas fa-exchange-alt me-1 text-primary"></i>Update Status</h6>
                
                <div class="text-center mb-2">
                    <small class="text-muted">${selectedItemIds.length} item(s) selected</small>
                </div>

                <div class="mb-2 p-2 rounded" style="background:#f8f9fa;">
                    <div class="fw-bold small mb-1"><i class="fas fa-info-circle me-1 text-secondary"></i>Current Status:</div>
                    <div>${currentStatusHtml || '<span class="text-muted small">N/A</span>'}</div>
                </div>

                ${chosenInfo ? '<div class="text-center mb-2"><small class="text-primary fw-bold"><i class="fas fa-arrow-down me-1"></i>Change to: ' + chosenInfo.name + '</small></div>' : ''}

                <div class="mb-2">${optionsHtml}</div>
                ${driverInputHtml}
                <div class="d-flex justify-content-center gap-2 mt-2 pt-2 border-top">
                    <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal"><i class="fas fa-times me-1"></i>Cancel</button>
                    <button class="btn btn-primary btn-sm" id="ohConfirmStatusBtn_${selectModalId}"
                        ${chosenStatus === null ? 'disabled' : ''}>
                        <i class="fas fa-check me-1"></i>Confirm
                    </button>
                </div>
            </div>`;

            const confirmBtn = document.getElementById('ohConfirmStatusBtn_' + selectModalId);
            if (confirmBtn) {
                confirmBtn.addEventListener('click', async function () {
                    selectInstance.hide();
                    selectedChosenStatus = chosenStatus;
                    await window.sendStatusUpdate(modalId);
                });
            }

            setTimeout(function () {
                const d = selectElement.querySelector('.modal-dialog');
                if (d) { d.style.marginTop = '80px'; d.style.maxWidth = '400px'; }
            }, 50);
        }

        window._onStatusOptionClick = function (statusValue, sModalId, mainModalId) {
            selectedChosenStatus = statusValue;
            renderStatusModal(statusValue);
        };

        window._openDriverForOH = function (sModalId) {
            window._ohSelectInstance = selectInstance;
            window._ohSelectElement = selectElement;
            window._ohSelectId = sModalId;
            const bsModal = bootstrap.Modal.getInstance(selectElement);
            if (bsModal) bsModal.hide();
            setTimeout(function () {
                (async () => { await loadExe2Fn(22, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_op_DrvSelect_OH', 1], [1]); })();
            }, 300);
        };

        renderStatusModal(selectedChosenStatus);
        selectElement.style.zIndex = '10003';
        selectInstance.show();
    };

    window.commonFnToRunAfter_op_DrvSelect_OH = function (obj, swtch) {
        if (swtch === 1) {
            const driverId = obj.a;
            const driverName = obj.h || obj.i || '';
            const driverMobile = obj.e || '';
            const displayName = driverName || driverMobile || '';

            selectedDriverId = parseInt(driverId);
            selectedDriverName = displayName;

            const driverInput = document.getElementById('ohDriverInput_' + window._ohSelectId);
            const driverIdInput = document.getElementById('ohDriverId_' + window._ohSelectId);
            if (driverInput) driverInput.value = displayName;
            if (driverIdInput) driverIdInput.value = driverId;

            if (typeof removeAllBackdrops === 'function') removeAllBackdrops();

            // Close entity picker fullpage view: pop from nav stack, remove DOM
            if (window._fpNavStack && window._fpNavStack.length > 0) {
                var topId = window._fpNavStack[window._fpNavStack.length - 1];
                if (topId && topId.indexOf('entind_modal_') === 0) {
                    window._fpNavStack.pop();
                    var topEl = document.getElementById(topId);
                    if (topEl) { topEl.dispatchEvent(new Event('fp-close')); topEl.remove(); }
                }
            }
            // Show order history fullpage view back
            if (window._fpNavStack && window._fpNavStack.length > 0) {
                var prevId = window._fpNavStack[window._fpNavStack.length - 1];
                var prevEl = document.getElementById(prevId);
                if (prevEl) prevEl.style.display = 'block';
            }

            setTimeout(function () {
                if (window._ohSelectInstance) {
                    try { window._ohSelectInstance.show(); } catch (e) { }
                }
                if (window._ohSelectElement) {
                    window._ohSelectElement.style.display = '';
                    window._ohSelectElement.classList.add('show');
                }
            }, 100);

            if (typeof showToast === 'function') {
                showToast('Driver assigned: ' + displayName, { type: 'success', duration: 1500 });
            }
        }
    };

    window.sendStatusUpdate = async function (modalId) {
        if (selectedItemIds.length === 0 || selectedChosenStatus === null) return;
        if (typeof payload0 === 'undefined') return;

        payload0.vw = 1;
        payload0.fn = 88;
        payload0.o = selectedItemIds.map(id => ({ e: id, d: selectedChosenStatus }));
        if (selectedDriverId) payload0.drvr = selectedDriverId;
        payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'os' },{ "tb": 'od' }]);

        console.log('Status update payload:', payload0);

        var _ohLoaderId = 'ohLoader_' + Date.now();
        var _ohLoaderDiv = document.createElement('div');
        _ohLoaderDiv.id = _ohLoaderId;
        _ohLoaderDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
        _ohLoaderDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
        document.body.appendChild(_ohLoaderDiv);

        try {
            const response = await fnj3("https://my1.in/2/l.php", payload0, 1, true, null, 20000, 0, 2, 1, 0);
            var _ld = document.getElementById(_ohLoaderId);
            if (_ld) _ld.remove();
            if (response && response.su == 1) {
                handl_o_rspons(response, 1);
                selectedItemIds = [];
                selectedChosenStatus = null;
                window.showsuccessmodal(response.ms || "Status updated successfully!", function () {
                    var idx = (window._fpNavStack || []).indexOf(modalId);
                    if (idx >= 0) {
                        window._fpNavStack.splice(idx, 1);
                        var el = document.getElementById(modalId);
                        if (el) {
                            el.dispatchEvent(new Event('fp-close'));
                            el.remove();
                        }
                    }
                    setTimeout(function () {
                        if (window[my1uzr.worknOnPg]) window.showOrderHistoryForCustomer(window[my1uzr.worknOnPg].showHstfrmMO);
                    }, 300);
                });
            } else {
                window.showelsemodal(response?.ms || 'Failed to update status.');
            }
        } catch (error) {
            var _ld2 = document.getElementById(_ohLoaderId);
            if (_ld2) _ld2.remove();
            window.showelsemodal(error || 'Network Error');
        }
    };

    window.toggleCancelItem = function (orderIndex, itemIndex, modalId, uniqueItemId) {
        const modalEl = document.getElementById(modalId);
        if (!modalEl) return;
        const orders = (modalEl.querySelector('.modal-body') || modalEl)._ordersData;
        if (!orders || !orders[orderIndex]) return;
        const item = orders[orderIndex].items[itemIndex];
        if (!item) return;
        const existingIndex = itemsToCancel.findIndex(c => c.a == item.id);
        if (existingIndex >= 0) { itemsToCancel.splice(existingIndex, 1); }
        else { itemsToCancel.push({ a: item.id }); }
        const el = document.getElementById(uniqueItemId);
        if (el) {
            const isMarked = itemsToCancel.some(c => c.a == item.id);
            if (isMarked) {
                el.classList.add('oh-cancel-marked');
                const textDivs = el.querySelectorAll('.flex-grow-1, .text-end');
                textDivs.forEach(d => { d.style.textDecoration = 'line-through'; d.style.textDecorationThickness = '2px'; });
                const img = el.querySelector('img');
                if (img) img.style.opacity = '0.6';
                const cancelBtn = el.querySelector('.oh-cancel-btn');
                if (cancelBtn) { cancelBtn.className = 'btn btn-sm btn-outline-secondary ms-2 oh-cancel-btn'; cancelBtn.style.cssText = 'font-size:10px;padding:2px 8px;border-radius:6px;flex-shrink:0;'; cancelBtn.innerHTML = '<i class="fas fa-undo"></i> Keep'; }
            } else {
                el.classList.remove('oh-cancel-marked');
                const textDivs = el.querySelectorAll('.flex-grow-1, .text-end');
                textDivs.forEach(d => { d.style.textDecoration = 'none'; });
                const img = el.querySelector('img');
                if (img) img.style.opacity = '1';
                const cancelBtn = el.querySelector('.oh-cancel-btn');
                if (cancelBtn) { cancelBtn.className = 'btn btn-sm btn-outline-danger ms-2 oh-cancel-btn'; cancelBtn.style.cssText = 'font-size:10px;padding:2px 8px;border-radius:6px;flex-shrink:0;'; cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel'; }
            }
        }
        updateHeaderButtons(modalId, (modalEl.querySelector('.modal-body') || modalEl)._isFromManageOrders);
    };

    window.confirmCancelItems = function (modalId) {
        if (itemsToCancel.length === 0) return;
        if (typeof create_modal_dynamically === 'function') {
            const confirmModalId = 'confirmBulkCancel_' + Date.now();
            const confirmResult = create_modal_dynamically(confirmModalId);
            if (confirmResult) {
                const { contentElement: confirmContent, modalInstance: confirmInstance, modalElement: confirmElement } = confirmResult;
                let itemsListHtml = '';
                const orders = (document.getElementById(modalId)?.querySelector('.modal-body') || document.getElementById(modalId))?._ordersData || [];
                itemsToCancel.forEach(cancelItem => {
                    let foundName = 'Item #' + cancelItem.a;
                    for (const order of orders) { const found = order.items.find(it => it.id == cancelItem.a); if (found) { const product = getProductByStockId(found.stockId); foundName = product ? product.name : foundName; break; } }
                    itemsListHtml += `<div class="d-flex align-items-center justify-content-between py-1 border-bottom"><span style="font-size:12px;">${foundName}</span><button class="btn btn-sm btn-outline-secondary" style="font-size:10px;padding:1px 6px;" onclick="window.removeFromCancelList(${window.escapeHTML(cancelItem.a)}, '${window.escapeHTML(confirmModalId)}', '${window.escapeHTML(modalId)}')"><i class="fas fa-undo"></i> Keep</button></div>`;
                });
                confirmContent.innerHTML = `<div class="p-3"><div class="mb-3 text-center"><i class="fas fa-exclamation-triangle text-warning fa-3x"></i></div><h5 class="text-center mb-2">Confirm Cancellation</h5><p class="text-center text-muted small">You are about to cancel ${itemsToCancel.length} item(s):</p><div class="mb-3" style="max-height:200px;overflow-y:auto;">${itemsListHtml}</div><div class="d-flex justify-content-center gap-2 mt-3 pt-2 border-top"><button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button><button class="btn btn-danger btn-sm" id="confirmBulkCancelBtn_${confirmModalId}"><i class="fas fa-check me-1"></i>Confirm Cancel (${itemsToCancel.length})</button></div></div>`;
                setTimeout(() => { const d = confirmElement.querySelector('.modal-dialog'); if (d) { d.style.marginTop = '80px'; d.style.maxWidth = 'auto'; } }, 50);
                document.getElementById('confirmBulkCancelBtn_' + confirmModalId).addEventListener('click', async function () { confirmInstance.hide(); await window.sendBulkCancellation(modalId); });
                confirmInstance.show();
            }
        }
    };

    window.removeFromCancelList = function (itemId, confirmModalId, historyModalId) {
        itemsToCancel = itemsToCancel.filter(c => c.a != itemId);
        const confirmModal = document.getElementById(confirmModalId);
        if (confirmModal) { const bsModal = bootstrap.Modal.getInstance(confirmModal); if (bsModal) bsModal.hide(); }
        if (itemsToCancel.length > 0) { setTimeout(() => { window.confirmCancelItems(historyModalId); }, 300); }
        else { updateHeaderButtons(historyModalId, false); window.howOrderHistoryModal(filterCustomerId); }
    };

    window.sendBulkCancellation = async function (modalId) {
        if (itemsToCancel.length === 0) return;
        if (typeof payload0 !== 'undefined') {
            payload0.vw = 1; payload0.fn = 84; payload0.p = [...itemsToCancel];

            var _ldId = 'ohBlk_ld_' + Date.now();
            var _ldDiv = document.createElement('div');
            _ldDiv.id = _ldId;
            _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
            _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
            document.body.appendChild(_ldDiv);

            try {
                const response = await fnj3("https://my1.in/3/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
                var _ldEl = document.getElementById(_ldId);
                if (_ldEl) _ldEl.remove();
                if (response && response.su == 1) {
                    handl_o_rspons(response, 0);//backen la must be handled
                    const deletedCount = await deleteOrderItemsFromDB(response.ok || []);
                    itemsToCancel = [];

                    const modalEl = document.getElementById(modalId);
                    if (modalEl) {
                        const bsModal = bootstrap.Modal.getInstance(modalEl);
                        if (bsModal) bsModal.hide();
                    }

                    setTimeout(() => {
                        window.showsuccessmodal("Deleted Successfully: " + deletedCount, function () {
                            var idx = window._fpNavStack ? window._fpNavStack.indexOf(modalId) : -1;
                            if (idx >= 0) {
                                window._fpNavStack.splice(idx, 1);
                                var el = document.getElementById(modalId);
                                if (el) {
                                    el.dispatchEvent(new Event('fp-close'));
                                    el.remove();
                                }
                            }
                            setTimeout(function () {
                                window.howOrderHistoryModal(filterCustomerId);
                            }, 300);
                        });
                    }, 500);
                } else {
                    window.showelsemodal(response?.ms || 'Failed to save.');
                }
            } catch (error) {
                var _ldEl2 = document.getElementById(_ldId);
                if (_ldEl2) _ldEl2.remove();
                window.showelsemodal(error || 'Network Error');
            }
        }
    };

    function addStyles() {
        if (document.getElementById('orderHistoryStyles')) return;
        const style = document.createElement('style');
        style.id = 'orderHistoryStyles';
        style.textContent = `
            .oh-order-card { transition: box-shadow 0.2s ease; }
            .oh-order-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important; }
            .orders-list::-webkit-scrollbar { width: 4px; }
            .orders-list::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
            .orders-list::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
            .oh-cancel-marked { background: #fff5f5 !important; opacity: 0.85; }
            .oh-cancel-marked .flex-grow-1,
            .oh-cancel-marked .text-end { text-decoration: line-through !important; text-decoration-thickness: 2px !important; }
            .oh-cancel-marked img { opacity: 0.5 !important; }
            .oh-selected { background: #e8f4fd !important; }
        `;
        document.head.appendChild(style);
    }

    addStyles();
    console.log('orders_history.js loaded successfully');

})();
