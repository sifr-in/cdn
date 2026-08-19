// mn_or.js - Manage Orders
(function () {
    'use strict';

    console.log('mn_or.js initializing...');

    let currentModalInstance = null;
    let currentModalElement = null;
    let currentContentElement = null;
    let currentModalId = null;
    let isLoading = false;
    let currentStatusFilter = '0'; // Default: Pending (0)

    // Calculate item total like cart.js does
    function getItemTotal(qty, priceInfo) {
        const increment = Number(priceInfo.increment || 1);
        const selling = Number(priceInfo.selling || 0);
        return (qty / increment) * selling;
    }

    // Get price info for a stock item
    function getPriceInfo(stockId, unitId, packageSize) {
        if (!window.PRODUCT_MAP) return { selling: 0, increment: 1, package: 1 };

        for (const key in window.PRODUCT_MAP) {
            const product = window.PRODUCT_MAP[key];
            if (product.S && String(product.S.a) === String(stockId)) {
                const soldIn = product.soldIn || {};
                const unitPrices = soldIn[unitId] || [];

                // Find matching package
                for (const price of unitPrices) {
                    if (String(price.package) === String(packageSize) ||
                        parseFloat(price.package) === parseFloat(packageSize)) {
                        return {
                            selling: price.selling || 0,
                            increment: price.increment || 1,
                            package: price.package || packageSize
                        };
                    }
                }

                // Return first price if no match
                if (unitPrices.length > 0) {
                    return {
                        selling: unitPrices[0].selling || 0,
                        increment: unitPrices[0].increment || 1,
                        package: unitPrices[0].package || packageSize
                    };
                }
            }
        }

        return { selling: 0, increment: 1, package: packageSize };
    }

    // Fetch orders from server
    async function fetchOrdersFromServer() {
        console.log('Fetching orders from server...');

        if (typeof payload0 === 'undefined') {
            console.error('payload0 not available');
            if (typeof showToast === 'function') {
                showToast('System error. Please try again.', { type: 'error', duration: 2000 });
            }
            return false;
        }

        try {
            await dbDexieManager.deleteRecords(dbnm, 'o');
            payload0.vw = 1;
            payload0.fn = 81;
            payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
                { "tb": 'o', "col": 'b', "cl": "b" },
                { "tb": 'os', "col": 'b', "cl": "b" },
                { "tb": 'c', "col": 'b', "cl": "b" }
            ]);

            console.log('Fetch orders payload:', payload0);

            var _ldId = 'mnor_ld_' + Date.now();
            var _ldDiv = document.createElement('div');
            _ldDiv.id = _ldId;
            _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
            _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
            document.body.appendChild(_ldDiv);

            const response = await fnj3("https://my1.in/2/j.php", payload0, 1, true, null, 20000, 0, 2, 1);

            var _ldEl = document.getElementById(_ldId);
            if (_ldEl) _ldEl.remove();

            if (response && response.su == 1) {
                await hndlRspo81(response);
            } else {
                window.showelsemodal(response?.ms || 'Failed to fetch orders. Please try again.');
                return false;
            }
        } catch (error) {
            var _ldEl2 = document.getElementById(_ldId);
            if (_ldEl2) _ldEl2.remove();
            window.showelsemodal(error || 'Network error');
            return false;
        }
    }
    async function hndlRspo81(response) {
        await handl_o_rspons(response, 1);
        window.showsuccessmodal('Orders fetched successfully');
        return true;
    }
    async function getGroupedOrders() {
        try {
            const allOrders = await dbDexieManager.getAllRecords(dbnm, 'o');
            const customers = await dbDexieManager.getAllRecords(dbnm, 'c');

            console.log('All orders:', allOrders.length);
            console.log('All customers:', customers.length);

            if (!allOrders || allOrders.length === 0) {
                return [];
            }

            const groupedMap = {};

            for (const order of allOrders) {
                const customerId = order.e;
                // Group only by customer ID
                const groupKey = String(customerId);

                if (!groupedMap[groupKey]) {
                    const customer = customers.find(c => String(c.a) === String(customerId));
                    const customerName = customer ? (customer.h || customer.e || 'Unknown') : 'Customer #' + customerId;

                    groupedMap[groupKey] = {
                        customerId: customerId,
                        customerName: customerName,
                        dateTime: order.b || '',
                        items: [],
                        status: order.d || 0,
                        totalAmount: 0
                    };
                }

                // Calculate correct amount using getItemTotal
                const priceInfo = getPriceInfo(order.f, order.h, order.i);
                const correctAmount = getItemTotal(order.g, priceInfo);

                groupedMap[groupKey].items.push({
                    ...order,
                    _calculatedAmount: correctAmount
                });
                groupedMap[groupKey].totalAmount += correctAmount;

                if (order.d !== undefined) groupedMap[groupKey].status = order.d;

                // Update to latest date/time
                if (order.b && order.b > groupedMap[groupKey].dateTime) {
                    groupedMap[groupKey].dateTime = order.b;
                }
            }

            const groupedOrders = Object.values(groupedMap).sort((a, b) => {
                const dateA = new Date(a.dateTime.replace(' ', 'T'));
                const dateB = new Date(b.dateTime.replace(' ', 'T'));
                return dateB - dateA;
            });

            console.log('Grouped orders:', groupedOrders.length);
            return groupedOrders;

        } catch (error) {
            console.error('Error getting grouped orders:', error);
            return [];
        }
    }

    // Rebuild modal content
    async function rebuildModalContent(modalId) {
        const modalElement = document.getElementById(modalId);
        if (!modalElement) {
            console.warn('Modal element not found for rebuild:', modalId);
            return;
        }

        const updatedOrders = await getGroupedOrders();
        const modalBody = modalElement.querySelector('.modal-body') || modalElement;
        modalBody.innerHTML = await buildManageOrdersHTML(modalId, updatedOrders);
        attachManageOrdersHandlers(modalBody, null, modalId, updatedOrders);
    }

    // Filter orders by status
    window.filterOrdersByStatus = async function (status, modalId) {
        currentStatusFilter = status;
        console.log('Filtering by status:', status);
        await rebuildModalContent(modalId);
    };

    // Show manage orders modal
    async function showManageOrders() {
        console.log('showManageOrders called');

        // Reset to default filter (Pending = '0')
        currentStatusFilter = '0';

        try {
            if (typeof create_fullpage_view !== 'function') {
                if (typeof showToast === 'function') {
                    showToast('View system not available');
                }
                return;
            }

            // Load orders from IndexedDB first (no loading modal)
            let orders = await getGroupedOrders();
            if (orders.length === 0) {
                const allOrders = await dbDexieManager.getAllRecords(dbnm, 'o');
                if (!allOrders || allOrders.length === 0) {
                    await fetchOrdersFromServer();
                    orders = await getGroupedOrders();
                }
            }

            // Create and show the manage orders view directly
            currentModalId = 'manageOrdersModal_' + Date.now();
            const modalResult = create_fullpage_view(currentModalId);

            if (!modalResult) {
                if (typeof showToast === 'function') {
                    showToast('Failed to create view');
                }
                return;
            }

            const { contentElement, modalInstance, modalElement } = modalResult;
            currentModalInstance = modalInstance;
            currentModalElement = modalElement;
            currentContentElement = contentElement;

            modalElement.addEventListener('fp-close', function () {
                currentModalInstance = null;
                currentModalElement = null;
                currentContentElement = null;
                currentModalId = null;
                removeAllBackdrops();
            });

            contentElement.innerHTML = await buildManageOrdersHTML(currentModalId, orders);
            attachManageOrdersHandlers(contentElement, modalInstance, currentModalId, orders);
            modalInstance.show();

            console.log('Manage Orders modal shown');

        } catch (error) {
            console.error('Error showing manage orders:', error);
            if (typeof showToast === 'function') {
                showToast('Error loading manage orders', { type: 'error', duration: 2000 });
            }
            removeAllBackdrops();
        }
    }

    // Remove all modal backdrops
    function removeAllBackdrops() {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    // Escape HTML
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;');
    }

    // Build the HTML for manage orders modal
    async function buildManageOrdersHTML(modalId, orders) {
        // Filter orders by status if filter is set
        let filteredOrders = orders;
        if (currentStatusFilter !== null && currentStatusFilter !== 'all') {
            // Filter groups that have at least one item with the target status
            filteredOrders = orders.filter(order => {
                return order.items.some(item => {
                    const itemStatus = String(item.status !== undefined ? item.status : item.d || 0);
                    return itemStatus === String(currentStatusFilter);
                });
            });
        }
        const filteredCount = filteredOrders.length;

        const statusMap = {
            '-3': { text: '<i class="fas fa-undo-alt me-1" style="color:#6c757d;"></i>', class: 'badge bg-secondary' },//Returned
            '-2': { text: '<i class="fas fa-reply me-1" style="color:#6c757d;"></i>', class: 'badge bg-secondary' },//Out For Return
            '-1': { text: '<i class="fas fa-times-circle me-1" style="color:#dc3545;"></i>', class: 'badge bg-danger' },//Cancelled
            '0': { text: '<i class="fas fa-clock me-1" style="color:#664d03;"></i>', class: 'badge bg-warning text-dark' },//Pending
            '1': { text: '<i class="fas fa-cog me-1" style="color:#fff;"></i>', class: 'badge bg-primary' },//Processing
            '2': { text: '<i class="fas fa-truck me-1" style="color:#055160;"></i>', class: 'badge bg-info text-dark' },//Out For Delivery
            '3': { text: '<i class="fas fa-check-circle me-1" style="color:#fff;"></i>', class: 'badge bg-success' }//Delivered
        };

        // Build status filter options
        const statusFilterOptions = `
        <option value="all">All Orders</option>
        <option value="0" ${currentStatusFilter === '0' ? 'selected' : ''}>Pending</option>
        <option value="1" ${currentStatusFilter === '1' ? 'selected' : ''}>Processing</option>
        <option value="2" ${currentStatusFilter === '2' ? 'selected' : ''}>Out For Delivery</option>
        <option value="3" ${currentStatusFilter === '3' ? 'selected' : ''}>Delivered</option>
        <option value="-1" ${currentStatusFilter === '-1' ? 'selected' : ''}>Cancelled</option>
        <option value="-2" ${currentStatusFilter === '-2' ? 'selected' : ''}>Out For Return</option>
        <option value="-3" ${currentStatusFilter === '-3' ? 'selected' : ''}>Returned</option>
    `;

        let ordersListHTML = '';

        if (filteredCount === 0) {
            ordersListHTML = `
            <div class="text-center py-5">
                <i class="fas fa-clipboard-list fa-4x text-muted mb-3" style="opacity:0.4;"></i>
                <h6 class="text-muted">No Orders Found</h6>
                <p class="text-muted small">Click "Refresh" to fetch latest orders from server.</p>
            </div>
        `;
        } else {
            ordersListHTML = `
            <div class="table-responsive" style="max-height:60vh;overflow-y:auto;">
                <table class="table table-sm table-hover">
                    <thead class="table-light sticky-top">
                        <tr>
                            <th>Customer</th>
                            <th>Date/Time</th>
                            <th style="width:140px;">Status</th>
                            <th style="width:100px;" class="text-end">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredOrders.map((order, index) => {
                // Count items by status for this customer's orders
                const statusCounts = {};
                order.items.forEach(item => {
                    const itemStatus = String(item.status !== undefined ? item.status : item.d || 0);
                    statusCounts[itemStatus] = (statusCounts[itemStatus] || 0) + 1;
                });

                // Build status breakdown - count with badge on same line
                let statusBreakdownHtml = '';
                const statusOrder = ['0', '1', '2', '3', '-1', '-2', '-3'];

                if (currentStatusFilter === 'all' || currentStatusFilter === null) {
                    // Show all status counts that exist
                    let hasAny = false;
                    statusOrder.forEach(st => {
                        if (statusCounts[st]) {
                            hasAny = true;
                            const stInfo = statusMap[st] || { text: 'Unknown', class: 'badge bg-light text-dark' };
                            statusBreakdownHtml += `<div class="mb-1" style="white-space:nowrap;">
                            <span style="font-size:12px;font-weight:600;">${statusCounts[st]}</span>
                            <span class="${stInfo.class} ms-1" style="font-size:10px;">${stInfo.text}</span>
                        </div>`;
                        }
                    });
                    if (!hasAny) {
                        statusBreakdownHtml = '<span style="font-size:11px;color:#6c757d;">-</span>';
                    }
                } else {
                    // Show only the filtered status count for this group
                    const stInfo = statusMap[String(currentStatusFilter)] || { text: 'Unknown', class: 'badge bg-light text-dark' };
                    const count = statusCounts[String(currentStatusFilter)] || 0;
                    if (count > 0) {
                        statusBreakdownHtml = `<div style="white-space:nowrap;">
                        <span style="font-size:12px;font-weight:600;">${count}</span>
                        <span class="${stInfo.class} ms-1" style="font-size:10px;">${stInfo.text}</span>
                    </div>`;
                    } else {
                        statusBreakdownHtml = '<span style="font-size:11px;color:#6c757d;">-</span>';
                    }
                }

                return `
                                <tr class="order-row" style="cursor:pointer;">
                                    <td onclick="window.showOrderHistoryForCustomer('${order.customerId}')"
                                    title="Click to view order details"><strong>${escapeHTML(order.customerName)}</strong></td>
                                    <td><small>${escapeHTML(order.dateTime)}</small></td>
                                    <td>${statusBreakdownHtml}</td>
                                    <td class="text-end fw-bold">₹${order.totalAmount.toFixed(2)}</td>
                                </tr>
                            `;
            }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        }

        return `
        <div>
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <h5 class="mb-0 d-flex align-items-center gap-2">
                    <i class="fas fa-clipboard-list me-1 text-primary"></i>
                    <select class="form-select form-select-sm fw-bold border-0 bg-transparent p-0" 
                            id="statusFilter_${modalId}" 
                            style="width:auto;min-width:180px;font-size:18px;color:#2D3748;cursor:pointer;box-shadow:none;background-image:url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e');background-repeat:no-repeat;background-position:right 4px center;background-size:12px;padding-right:20px !important;-webkit-appearance:none;-moz-appearance:none;appearance:none;" 
                            onchange="window.filterOrdersByStatus(this.value, '${modalId}')">
                        ${statusFilterOptions}
                    </select>
                    <span class="badge bg-secondary ms-1">${filteredCount}</span>
                </h5>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" id="manageOrdersRefreshBtn_${modalId}" title="Refresh orders from server">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
            
            ${ordersListHTML}
            
            <div class="d-flex justify-content-end gap-2 pt-2 border-top mt-3">
                <button type="button" class="btn btn-sm btn-secondary" data-fp-close="1">
                    <i class="fas fa-times me-1"></i>Close
                </button>
            </div>
        </div>
    `;
    }

    // Attach event handlers
    function attachManageOrdersHandlers(contentElement, modalInstance, modalId, orders) {
        const refreshBtn = document.getElementById('manageOrdersRefreshBtn_' + modalId);
        if (refreshBtn) {
            const newBtn = refreshBtn.cloneNode(true);
            refreshBtn.parentNode.replaceChild(newBtn, refreshBtn);

            newBtn.addEventListener('click', async function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (isLoading) return;

                isLoading = true;
                try {
                    await window.withRefreshAnimation(this, async function () {
                        await fetchOrdersFromServer();
                        if (typeof window.closeOrderHistoryModal === 'function') window.closeOrderHistoryModal(modalId, modalInstance);
                        setTimeout(() => (async () => { await loadExe2Fn(26, [], [1]); })(), 1000);
                    });
                } finally {
                    isLoading = false;
                }
            });
        }
    }

    // Set modal height
    function setModalHeight(modalElement) {
        if (!modalElement) return;
        setTimeout(function () {
            const modalDialog = modalElement.querySelector('.modal-dialog');
            const modalContent = modalElement.querySelector('.modal-content');
            const modalBody = modalElement.querySelector('.modal-body');
            if (modalDialog) {
                modalDialog.style.maxHeight = '95vh';
                modalDialog.style.marginTop = '60px';
                modalDialog.style.marginBottom = '20px';
            }
            if (modalContent) {
                modalContent.style.maxHeight = '90vh';
                modalContent.style.overflow = 'auto';
            }
            if (modalBody) {
                modalBody.style.maxHeight = 'calc(90vh - 120px)';
                modalBody.style.overflow = 'auto';
                modalBody.style.padding = '15px 20px';
            }
        }, 100);
    }

    // Add styles
    function addStyles() {
        if (document.getElementById('manageOrdersStyles')) return;
        const style = document.createElement('style');
        style.id = 'manageOrdersStyles';
        style.textContent = `
            .order-row:hover {
                background: #e3f2fd !important;
            }
            .order-row {
                transition: background 0.15s ease;
            }
            .form-select.fw-bold:focus {
                box-shadow: none !important;
                outline: none !important;
            }
            .form-select.fw-bold option {
                font-size: 14px;
                font-weight: auto;
                color: #333;
                padding: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    addStyles();

    // Expose functions globally
    window.hndlRspo81 = hndlRspo81;
    window.showManageOrders = showManageOrders;
    window.showOrderHistoryForCustomer = window.showOrderHistoryForCustomer;
    window.filterOrdersByStatus = window.filterOrdersByStatus;

    console.log('mn_or.js loaded successfully');

})();