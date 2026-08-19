// cart.js - Shopping Cart Management
(function () {
    'use strict';

    var PLACEHOLDER_IMG = window.PLACEHOLDER_IMG || 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="105" text-anchor="middle" font-size="40" fill="#999">📷</text></svg>');
    console.log('cart.js initializing...');

    // Cart data structure
    window.CART = window.CART || {};
    window.CART_ITEMS = window.CART_ITEMS || {};
    window.CART_TOTAL = 0;
    let isCartModalOpen = false;

    // Customer selection for checkout (when showInputCst === 1)
    window._checkoutCustomerId = window._checkoutCustomerId || '';
    window._checkoutCustomerName = window._checkoutCustomerName || '';

    window.commonFnToRunAfter_op_CstCheckout = function (obj, swtch) {
        if (swtch === 1) {
            window._checkoutCustomerId = obj.a || '';
            window._checkoutCustomerName = obj.h || obj.i || obj.e || 'Unknown';
            const nameInput = document.getElementById('cst_checkout_name');
            const idInput = document.getElementById('cst_checkout_id');
            const statusDiv = document.getElementById('cst_checkout_status');
            if (nameInput) nameInput.value = window._checkoutCustomerName;
            if (idInput) idInput.value = window._checkoutCustomerId;
            if (statusDiv) statusDiv.style.display = 'block';
            if (typeof showToast === 'function') showToast('Customer selected: ' + window._checkoutCustomerName, { type: 'success', duration: 2000 });
        }
    };

    // Save cart to localStorage
    function saveCart() {
        try {
            var data = {
                cart: window.CART,
                items: window.CART_ITEMS,
                selectedUnit: window.SELECTED_UNIT,
                selectedPackage: window.SELECTED_PACKAGE,
                timestamp: Date.now()
            };
            localStorage.setItem('cart_data', JSON.stringify(data));
            console.log('Cart saved to localStorage');
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    }

    // Load cart from localStorage
    function loadCart() {
        try {
            var stored = localStorage.getItem('cart_data');
            if (stored) {
                var data = JSON.parse(stored);
                window.CART = data.cart || {};
                window.CART_ITEMS = data.items || {};
                window.SELECTED_UNIT = data.selectedUnit || {};
                window.SELECTED_PACKAGE = data.selectedPackage || {};
                normalizeCartKeys();
                console.log('Cart loaded from localStorage');
                return true;
            }
        } catch (e) {
            console.error('Error loading cart:', e);
        }
        return false;
    }

    function getCartKey(productId, unitId, packageIndex) {
        return productId + '_' + unitId + '_' + (packageIndex || 0);
    }

    function getSelectedPackageIndex(productId, unitId) {
        var packageKey = productId + '_' + unitId;
        var packageIndex = 0;
        if (window.SELECTED_PACKAGE && window.SELECTED_PACKAGE[packageKey] !== undefined) {
            packageIndex = parseInt(window.SELECTED_PACKAGE[packageKey], 10);
        }
        if (isNaN(packageIndex) || packageIndex < 0) {
            packageIndex = 0;
            if (!window.SELECTED_PACKAGE) window.SELECTED_PACKAGE = {};
            if (window.SELECTED_PACKAGE[packageKey] === undefined) window.SELECTED_PACKAGE[packageKey] = 0;
        }
        return packageIndex;
    }

    function getPriceValue(priceInfo, field, fallback) {
        if (!priceInfo) return fallback;
        if (priceInfo[field] !== undefined && priceInfo[field] !== null) return priceInfo[field];
        if (field === 'selling' && priceInfo.sellingPrice !== undefined) return priceInfo.sellingPrice;
        if (field === 'package' && priceInfo.packageSize !== undefined) return priceInfo.packageSize;
        if (field === 'min' && priceInfo.minQty !== undefined) return priceInfo.minQty;
        if (field === 'max' && priceInfo.maxQty !== undefined) return priceInfo.maxQty;
        return fallback;
    }

    function getNumberValue(value, fallback) {
        var numberValue = Number(value);
        return isFinite(numberValue) && numberValue > 0 ? numberValue : fallback;
    }

    function getPriceQty(priceInfo, item) {
        var packageSize = getNumberValue(getPriceValue(priceInfo, 'package', 0), 0);
        var increment = getNumberValue(item && item.increment, 0);
        var minQty = getNumberValue(item && item.minQty, 0);
        return packageSize || increment || minQty || 1;
    }

    function getItemTotal(qty, priceInfo) {
        const increment = Number(priceInfo.increment || 1);
        const selling = Number(priceInfo.selling || 0);
        return (qty / increment) * selling;
    }

    function customRound(value) {
        if (value % 1 >= 0.40) return Math.ceil(value);
        return Math.floor(value);
    }

    function normalizeCartKeys() {
        var newCart = {};
        var newItems = {};
        Object.keys(window.CART || {}).forEach(function (oldKey) {
            var item = window.CART_ITEMS[oldKey];
            if (!item || !item.productId || !item.unitId) {
                newCart[oldKey] = window.CART[oldKey];
                if (item) newItems[oldKey] = item;
                return;
            }
            var packageIndex = item.packageIndex || 0;
            var newKey = getCartKey(item.productId, item.unitId, packageIndex);
            if (newCart[newKey]) {
                newCart[newKey] += (window.CART[oldKey] || 0);
            } else {
                newCart[newKey] = window.CART[oldKey] || 0;
                newItems[newKey] = item;
            }
        });
        window.CART = newCart;
        window.CART_ITEMS = newItems;
    }

    // Create cart icon in navbar
    function createCartIcon() {
        console.log('Creating cart icon...');
        if (document.getElementById('cartIcon')) return document.getElementById('cartIcon');
        let container = document.getElementById('cartContainer');
        if (!container) container = document.getElementById('cartIconContainer');
        if (!container) {
            console.warn('Cart container not found, creating one...');
            const searchBtn = document.getElementById('searchBtn');
            if (searchBtn) {
                const parent = searchBtn.parentNode;
                const newContainer = document.createElement('div');
                newContainer.id = 'cartContainer';
                newContainer.style.display = 'inline-block';
                newContainer.style.marginLeft = '10px';
                parent.insertBefore(newContainer, searchBtn);
                container = newContainer;
            } else {
                console.error('Could not find searchBtn');
                return null;
            }
        }
        return createCartIconElement(container);
    }

    function createCartIconElement(container) {
        container.innerHTML = `
            <div id="cartIcon" style="position:relative;display:inline-block;cursor:pointer;padding:4px;font-size:28px;color:white;transition:transform 0.2s ease;" onclick="window.openCartModal()">
                🛒
                <span id="cartBadge">0</span>
            </div>
        `;
        console.log('Cart icon created successfully');
        return container.querySelector('#cartIcon');
    }

    // Update cart badge
    window.updateCartBadge = function () {
        const badge = document.getElementById('cartBadge');
        if (!badge) return;
        const productTypes = Object.keys(window.CART).length;
        if (productTypes > 0) {
            badge.textContent = productTypes;
            badge.style.display = 'block';
            const newBadge = badge.cloneNode(true);
            badge.parentNode.replaceChild(newBadge, badge);
            const updatedBadge = document.getElementById('cartBadge');
            if (!updatedBadge) return;
            void updatedBadge.offsetHeight;
            updatedBadge.style.animation = 'cartBounce 0.4s ease';
        } else {
            badge.style.display = 'none';
            badge.style.animation = 'none';
        }
        let totalItems = 0;
        for (const key in window.CART) totalItems += window.CART[key] || 0;
        window.CART_TOTAL = totalItems;
    };

    // Animate to cart
    function animateToCart(button, qty) {
        if (!button) return;
        const cart = document.getElementById("cartIcon");
        if (!cart) return;
        const start = button.getBoundingClientRect();
        const end = cart.getBoundingClientRect();
        const bubble = document.createElement("div");
        bubble.innerHTML = qty;
        bubble.style.cssText = `
            position:fixed;left:${start.left + start.width / 2}px;top:${start.top + start.height / 2}px;
            width:32px;height:32px;border-radius:50%;background:#ff5722;color:#fff;
            display:flex;align-items:center;justify-content:center;font-weight:bold;
            z-index:999999;pointer-events:none;
            transition:left .6s cubic-bezier(.22,.61,.36,1),top .6s cubic-bezier(.22,.61,.36,1),transform .6s;
        `;
        document.body.appendChild(bubble);
        requestAnimationFrame(function () {
            bubble.style.left = end.left + end.width / 2 + "px";
            bubble.style.top = end.top + end.height / 2 + "px";
            bubble.style.transform = "scale(.2)";
        });
        bubble.addEventListener("transitionend", function () {
            bubble.remove();
            cart.style.animation = "cartBounce .4s";
            setTimeout(function () { cart.style.animation = ""; }, 400);
        });
    }

    window._addToCart = function (productId, unitId, qty, button, packageIndex) {
        let product = window.PRODUCT_MAP ? window.PRODUCT_MAP[productId] : null;
        if (!product && window.PRODUCTS) product = window.PRODUCTS.find(function (p) { return String(p.pid) === String(productId); });
        if (!product) { if (typeof showToast === 'function') showToast('Product not found', { type: 'error', duration: 2000 }); return; }
        const soldIn = product.soldIn || {};
        var pkgIndex = parseInt(packageIndex, 10);
        if (isNaN(pkgIndex)) pkgIndex = 0;
        window.SELECTED_PACKAGE = window.SELECTED_PACKAGE || {};
        window.SELECTED_PACKAGE[productId + '_' + unitId] = pkgIndex;
        const unitPrices = soldIn[unitId] || [];
        const priceInfo = unitPrices[pkgIndex] || unitPrices[0];
        const minQty = getPriceValue(priceInfo, 'min', 1) || 1;
        const qtyToAdd = qty || minQty;
        const cartKey = getCartKey(productId, unitId, pkgIndex);
        var maxQty = getPriceValue(priceInfo, 'max', 0) > 0 ? getPriceValue(priceInfo, 'max', 0) : Infinity;
        var newQty = (window.CART[cartKey] || 0) + qtyToAdd;
        window.CART[cartKey] = newQty > maxQty ? maxQty : newQty;
        window.CART_ITEMS[cartKey] = {
            product: product, productId: productId, unitId: unitId, packageIndex: pkgIndex,
            priceInfo: priceInfo, minQty: getPriceValue(priceInfo, 'min', 1) || 1,
            maxQty: maxQty, increment: getPriceValue(priceInfo, 'increment', 1) || 1,
            packageSize: getPriceValue(priceInfo, 'package', '')
        };
        window.updateCartBadge();
        animateToCart(button, qtyToAdd);
        if (typeof showToast === 'function') showToast(`${qtyToAdd} × ${product.name || 'Product'} added!`, { type: 'success', duration: 1500 });
        if (typeof window.updateQtyUI === 'function') window.updateQtyUI(productId);
        saveCart();
    };

    window.changeQty = function (productId, change) {
        var product = window.PRODUCT_MAP ? window.PRODUCT_MAP[productId] : null;
        if (!product) return;
        var selectedUnitId = window.SELECTED_UNIT ? window.SELECTED_UNIT[productId] : null;
        if (!selectedUnitId) { var soldIn = product.soldIn || {}; var unitIds = Object.keys(soldIn); selectedUnitId = unitIds.length > 0 ? unitIds[0] : null; }
        if (!selectedUnitId) return;
        var packageIndex = getSelectedPackageIndex(productId, selectedUnitId);
        var cartKey = getCartKey(productId, selectedUnitId, packageIndex);
        var item = window.CART_ITEMS[cartKey];
        var currentQty = window.CART[cartKey] || 0;
        if (!item) {
            var soldIn = product.soldIn || {}; var prices = soldIn[selectedUnitId] || [];
            var priceInfo = prices[packageIndex] || prices[0];
            if (!priceInfo) return;
            item = { product: product, productId: productId, unitId: selectedUnitId, packageIndex: packageIndex, priceInfo: priceInfo, minQty: getPriceValue(priceInfo, 'min', 1) || 1, maxQty: getPriceValue(priceInfo, 'max', 0) > 0 ? getPriceValue(priceInfo, 'max', 0) : Infinity, increment: getPriceValue(priceInfo, 'increment', 1) || 1, packageSize: getPriceValue(priceInfo, 'package', '') };
            window.CART_ITEMS[cartKey] = item;
        }
        var minQty = item.minQty || 1; var maxQty = item.maxQty || Infinity; var increment = item.increment || 1;
        var newQty = currentQty + (change * increment);
        if (change < 0 && currentQty <= minQty) newQty = 0;
        else if (newQty < minQty) newQty = minQty;
        if (newQty > maxQty) newQty = maxQty;
        if (newQty <= 0) { delete window.CART[cartKey]; delete window.CART_ITEMS[cartKey]; }
        else { window.CART[cartKey] = newQty; window.CART_ITEMS[cartKey] = item; }
        window.updateCartBadge(); updateCartModal();
        if (typeof window.updateQtyUI === 'function') window.updateQtyUI(productId);
        saveCart();
    };

    window.removeFromCart = function (productId, unitId, packageIndex) {
        var cartKey = getCartKey(productId, unitId, packageIndex);
        delete window.CART[cartKey]; delete window.CART_ITEMS[cartKey];
        window.updateCartBadge(); updateCartModal();
        if (typeof window.updateQtyUI === 'function') window.updateQtyUI(productId);
        if (typeof showToast === 'function') showToast('Item removed from cart', { type: 'info', duration: 1500 });
        saveCart();
    };

    window.clearCart = function () {
        Object.keys(window.CART).forEach(function (cartKey) { delete window.CART[cartKey]; delete window.CART_ITEMS[cartKey]; });
        window.updateCartBadge(); updateCartModal();
        if (typeof showToast === 'function') showToast('Cart cleared', { type: 'info', duration: 1500 });
        saveCart();
    };

    window.getCartTotal = function () {
        let total = 0;
        for (const key in window.CART) { const item = window.CART_ITEMS[key]; if (item && item.priceInfo) total += getItemTotal(window.CART[key], item.priceInfo); }
        return customRound(total);
    };

    // Open cart modal - using create_fullpage_view
    window.openCartModal = function () {
        if (typeof create_fullpage_view !== 'function') {
            if (typeof showToast === 'function') showToast('View system not available');
            return;
        }

        const viewId = 'cartView_' + Date.now();
        const viewResult = create_fullpage_view(viewId);
        if (!viewResult) {
            if (typeof showToast === 'function') showToast('Failed to create view');
            return;
        }

        const { contentElement, modalInstance, modalElement } = viewResult;
        isCartModalOpen = true;

        window._cartViewInstance = modalInstance;
        window._cartViewContent = contentElement;
        window._cartViewElement = modalElement;

        modalElement.addEventListener('fp-close', function () {
            isCartModalOpen = false;
            window._cartViewElement = null;
            window._cartViewContent = null;
            window._cartViewInstance = null;
        });

        contentElement.innerHTML = buildCartHTML();
        modalInstance.show();
    };

    // Build cart HTML with -/+ buttons
    function buildCartHTML() {
        const cartItems = window.CART || {};
        const cartDetails = window.CART_ITEMS || {};
        const itemKeys = Object.keys(cartItems);

        let html = `
            <div class="p-2">
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <h5 class="mb-0">
                        <i class="fas fa-shopping-cart me-2 text-primary"></i>
                        Your Cart (${itemKeys.length} items)
                    </h5>
                    <!--button type="button" class="btn-close" data-fp-close="1"></button-->
                </div>
        `;

        if (itemKeys.length === 0) {
            html += `
                <div class="text-center py-5">
                    <i class="fas fa-cart-plus fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Your cart is empty</p>
                    <button class="btn btn-primary btn-sm" data-fp-close="1">Start Shopping</button>
                </div>
            `;
        } else {
            html += `<div class="cart-items-list" style="max-height:400px;overflow-y:auto;">`;
            let grandTotal = 0;
            const viewElementId = window._cartViewElement?.id || '';

            itemKeys.forEach(function (cartKey) {
                const qty = cartItems[cartKey] || 0;
                const item = cartDetails[cartKey];
                if (!item) return;
                const product = item.product;
                const priceInfo = item.priceInfo;
                const unitId = item.unitId;
                const packageIndex = item.packageIndex || 0;
                const minQty = item.minQty || 1;
                const maxQty = item.maxQty || Infinity;
                const increment = item.increment || 1;
                let unitName = '', unitShort = '';
                if (window.UNIT_DATA) { var foundUnit = window.UNIT_DATA.find(function (u) { return String(u.a) === String(unitId); }); if (foundUnit) { unitName = foundUnit.e || ''; unitShort = foundUnit.f || ''; } }
                const sellingPrice = getPriceValue(priceInfo, 'selling', 0);
                const mrp = getPriceValue(priceInfo, 'mrp', 0);
                const packageSize = getPriceValue(priceInfo, 'package', '');
                const itemTotal = getItemTotal(qty, priceInfo);
                grandTotal += itemTotal;
                const imgUrl = product.image ? (typeof getGoogleDriveImageUrl === 'function' ? getGoogleDriveImageUrl(product.image) : product.image) : PLACEHOLDER_IMG;

                html += `
                    <div class="cart-item mb-2 p-2 border rounded" style="background:#f8f9fa;">
                        <div class="d-flex align-items-center gap-3">
                            <img src="${imgUrl}" alt="${product.name}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;" onerror="this.src='${PLACEHOLDER_IMG}'">
                            <div class="flex-grow-1">
                                <div class="fw-bold" style="font-size:14px;">${product.name}</div>
                                <div class="small text-muted">${item.packageSize ? item.packageSize + ' ' + unitShort : packageSize + ' ' + unitShort} <span class="badge bg-info text-dark ms-1" style="font-size:9px;">Min: ${minQty} | Max: ${maxQty === Infinity ? '∞' : maxQty}</span></div>
                                <div class="d-flex align-items-center gap-2 mt-1">
                                    <span class="fw-bold text-success" style="font-size:14px;">₹${sellingPrice}</span>
                                    ${mrp > sellingPrice ? `<span class="text-muted text-decoration-line-through" style="font-size:12px;">₹${mrp}</span>` : ''}
                                </div>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <button class="btn btn-sm btn-outline-secondary" onclick="window.changeCartQty('${product.pid}','${unitId}',${packageIndex},-1)" style="width:28px;height:28px;padding: 0 0 .6px 0;border-radius:50%;">−</button>
                                <span class="fw-bold" style="min-width:30px;text-align:center;">${qty}</span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="window.changeCartQty('${product.pid}','${unitId}',${packageIndex},1)" style="width:28px;height:28px;padding: 0 0 .6px 0;border-radius:50%;">+</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="window.removeFromCart('${product.pid}','${unitId}',${packageIndex})" style="width:28px;height:28px;padding: 0 0 .6px 0;border-radius:50%;"><i class="fas fa-times" style="font-size:12px;"></i></button>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
            const totalAfterDiscount = customRound(grandTotal);
            const showCstInput = window[my1uzr.worknOnPg]?.showInputCst === 1;
            html += `
                <div class="border-top pt-3 mt-3">
                    <div class="d-flex justify-content-between mb-3">
                        <span class="fw-bold">Total</span>
                        <span class="fw-bold text-primary fs-5">₹${totalAfterDiscount}</span>
                    </div>
                    ${showCstInput ? `
                    <div class="mb-3" style="background:#f0f7fa;padding:10px;border-radius:8px;border:1px solid #b8daff;">
                        <label class="form-label fw-bold small mb-1">
                            <i class="fas fa-user me-1 text-primary"></i>Customer (optional)
                        </label>
                        <input id="cst_checkout_name" class="form-control form-control-sm" readonly
                            onclick="(async () => { await loadExe2Fn(22, ['no-loader-element', 1, 'cstCheckoutModalDiv', 'commonFnToRunAfter_op_CstCheckout', 1], [1]); })()"
                            placeholder="Click to select Customer" value="${window._checkoutCustomerName || ''}" style="cursor:pointer;background:#fff;">
                        <input type="hidden" id="cst_checkout_id" value="${window._checkoutCustomerId || ''}">
                        <div id="cst_checkout_status" style="display:${window._checkoutCustomerId ? 'block' : 'none'};margin-top:5px;">
                            <small class="text-success"><i class="fas fa-check-circle"></i> Customer selected</small>
                        </div>
                    </div>
                    ` : ''}
                    <div class="d-flex gap-2">
                        <button class="btn btn-danger btn-sm" onclick="window.clearCart()"><i class="fas fa-trash me-1"></i>Clear</button>
                        <button class="btn btn-success btn-sm flex-grow-1" onclick="window.checkoutCart()"><i class="fas fa-check me-1"></i>Checkout</button>
                    </div>
                </div>
            `;
        }
        html += `</div>`;
        return html;
    }

    // Update cart modal
    window.updateCartModal = function () {
        const content = window._cartViewContent;
        if (content && isCartModalOpen) content.innerHTML = buildCartHTML();
        window.updateCartBadge();
    };

    window.changeCartQty = function (productId, unitId, packageIndex, change) {
        if (change === undefined) { change = packageIndex; packageIndex = 0; }
        var cartKey = getCartKey(productId, unitId, packageIndex);
        var item = window.CART_ITEMS[cartKey];
        var currentQty = window.CART[cartKey] || 0;
        if (!item) {
            var product = window.PRODUCT_MAP ? window.PRODUCT_MAP[productId] : null;
            if (!product) return;
            var soldIn = product.soldIn || {}; var prices = soldIn[unitId] || [];
            var priceInfo = prices[packageIndex] || prices[0];
            if (!priceInfo) return;
            item = { product: product, productId: productId, unitId: unitId, packageIndex: packageIndex, priceInfo: priceInfo, minQty: getPriceValue(priceInfo, 'min', 1) || 1, maxQty: getPriceValue(priceInfo, 'max', 0) > 0 ? getPriceValue(priceInfo, 'max', 0) : Infinity, increment: getPriceValue(priceInfo, 'increment', 1) || 1, packageSize: getPriceValue(priceInfo, 'package', '') };
        }
        var minQty = item.minQty || 1; var maxQty = item.maxQty || Infinity; var increment = item.increment || 1;
        var newQty = currentQty + (change * increment);
        if (change < 0 && currentQty <= minQty) newQty = 0;
        else if (newQty < minQty) newQty = minQty;
        if (newQty > maxQty) newQty = maxQty;
        if (newQty <= 0) { delete window.CART[cartKey]; delete window.CART_ITEMS[cartKey]; }
        else { window.CART[cartKey] = newQty; window.CART_ITEMS[cartKey] = item; }
        window.updateCartBadge(); updateCartModal();
        if (typeof window.updateQtyUI === 'function') window.updateQtyUI(productId);
        saveCart();
    };

    // Checkout - unchanged logic, just close via fp-close
    window.checkoutCart = async function () {
        try {
            if (Object.keys(window.CART).length === 0) return;
            var confirmMessage = 'Confirm your order:\n\n';
            var totalItems = 0; var grandTotal = 0;
            Object.keys(window.CART).forEach(function (cartKey) {
                var qty = window.CART[cartKey] || 0;
                var item = window.CART_ITEMS[cartKey];
                if (!item || qty <= 0) return;
                var product = item.product; var productName = product.name || 'Product';
                var unitId = item.unitId; var packageSize = item.packageSize || '';
                var unitShort = '';
                if (window.UNIT_DATA) { var foundUnit = window.UNIT_DATA.find(function (u) { return String(u.a) === String(unitId); }); if (foundUnit) unitShort = foundUnit.f || ''; }
                var packageText = packageSize ? packageSize + ' ' + unitShort : '';
                confirmMessage += '• ' + productName + ' - Qty: ' + qty + (packageText ? ' (' + packageText + ')' : '') + '\n';
                totalItems += qty;
                var priceInfo = item.priceInfo;
                if (priceInfo) { var increment = Number(priceInfo.increment || 1); var selling = Number(priceInfo.selling || 0); grandTotal += (qty / increment) * selling; }
            });
            grandTotal = customRound(grandTotal);
            confirmMessage += '\nTotal Items: ' + totalItems + '\nTotal Amount: ₹' + grandTotal + '\n\nNeeds any thing else?, Proceed with order?';

            if (typeof create_modal_dynamically === 'function') {
                var modalId = 'confirmOrderModal_' + Date.now();
                var modalResult = create_modal_dynamically(modalId);
                if (modalResult) {
                    var contentElement = modalResult.contentElement;
                    var modalInstance = modalResult.modalInstance;
                    var modalElement = document.getElementById(modalId);
                    contentElement.innerHTML = `
                            <div class="p-2">
                                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <h5 class="mb-0"><i class="fas fa-check-circle me-2 text-success"></i>Confirm Order</h5>
                                </div>
                                <div class="mb-3"><pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;background:#f8f9fa;padding:12px;border-radius:8px;">${confirmMessage.replace(/\n/g, '<br>')}</pre></div>
                                <div class="d-flex justify-content-end gap-2 pt-2 border-top">
                                    <button class="btn btn-secondary" data-fp-close="1">Cancel</button>
                                    <button class="btn btn-success" id="confirmOrderBtn_${modalId}"><i class="fas fa-check me-1"></i>Confirm Order</button>
                                </div>
                            </div>`;
                    setTimeout(function () {
                        var dialog = modalElement.querySelector('.modal-dialog');
                        if (dialog) { dialog.style.marginTop = '60px'; dialog.style.maxWidth = 'auto'; }
                    }, 50);
                    var confirmBtn = document.getElementById('confirmOrderBtn_' + modalId);
                    if (confirmBtn) {
                        confirmBtn.addEventListener('click', function () {
                            modalInstance.hide();
                            if (window._cartViewInstance) window._cartViewInstance.hide();
                            isCartModalOpen = false;
                            processOrder();
                        });
                    }
                    modalInstance.show();
                    return;
                }
            }
            if (confirm(confirmMessage)) processOrder();
        } catch (error) { window.showelsemodal(error || "500"); }
    };

    async function processOrder() {
        if (typeof payload0 !== 'undefined') {
            payload0.vw = 1; payload0.fn = 77;
            var now = new Date();
            var dateTime = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
            var items = [];
            Object.keys(window.CART).forEach(function (cartKey) {
                var qty = window.CART[cartKey] || 0;
                var item = window.CART_ITEMS[cartKey];
                if (!item || qty <= 0) return;
                var product = item.product;
                var stockId = product.S?.a || product.sid || '';
                items.push({ f: stockId, g: qty, h: item.unitId || '', i: item.packageSize || '', j: item.priceInfo?.selling || '', s: window._checkoutCustomerId || '' });
            });
            payload0.p = items;
            payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'o' }, { "tb": 'os' }]);

            var _ldId = 'cart_ld_' + Date.now();
            var _ldDiv = document.createElement('div');
            _ldDiv.id = _ldId;
            _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
            _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
            document.body.appendChild(_ldDiv);

            try {
                const response = await fnj3("https://my1.in/3/a.php", payload0, 1, true, null, 20000, 0, 2, 1);
                var _ldEl = document.getElementById(_ldId);
                if (_ldEl) _ldEl.remove();

                if (response && response.su == 1) {
                    hndlRspo77(response);
                } else { window.showelsemodal(response?.ms || 'Failed to save.'); }
            } catch (error) { var _ldEl2 = document.getElementById(_ldId); if (_ldEl2) _ldEl2.remove(); window.showelsemodal(error || '404'); }
        }
    }
    async function hndlRspo77(response) {
        await handl_o_rspons(response, 1); //handle la in backend
        if (typeof create_modal_dynamically === 'function') showResponseModal('success', response.ms || 'Order placed successfully! 🎉', response);
        else if (typeof showToast === 'function') showToast(response.ms || 'Order placed successfully!', { type: 'success', duration: 3000 });
        setTimeout(function () { window.clearCart(); window._checkoutCustomerId = ''; window._checkoutCustomerName = ''; }, 500);
        //setTimeout(function () { location.reload(); }, 2000);
    }
    function showResponseModal(type, message, data) {
        var modalId = 'responseModal_' + Date.now();
        var modalResult = create_modal_dynamically(modalId);
        if (!modalResult) { if (typeof showToast === 'function') showToast(message, { type: type === 'success' ? 'success' : 'error', duration: 3000 }); return; }
        var contentElement = modalResult.contentElement;
        var modalInstance = modalResult.modalInstance;
        var iconHtml = type === 'success' ? '<i class="fas fa-check-circle text-success fa-3x"></i>' : '<i class="fas fa-times-circle text-danger fa-3x"></i>';
        var titleText = type === 'success' ? 'Order Successful!' : 'Order Failed';
        var titleColor = type === 'success' ? 'text-success' : 'text-danger';
        var additionalInfo = '';
        if (data && data.tn) additionalInfo += '<div class="mt-2"><strong>Transaction ID:</strong> ' + data.tn + '</div>';
        if (data && data.yza) additionalInfo += '<div class="mt-1"><strong>Reference:</strong> ' + data.yza + '</div>';
        contentElement.innerHTML = `<div class="p-3 text-center"><div class="mb-3">${iconHtml}</div><h5 class="${titleColor} mb-2">${titleText}</h5><p class="mb-3">${message}</p>${additionalInfo}<div class="d-flex justify-content-center gap-2 mt-3 pt-2 border-top"><button class="btn btn-primary" data-bs-dismiss="modal">OK</button></div></div>`;
        setTimeout(function () { var dialog = document.getElementById(modalId)?.querySelector('.modal-dialog'); if (dialog) { dialog.style.marginTop = '80px'; dialog.style.maxWidth = 'auto'; } }, 50);
        if (type === 'success') setTimeout(function () { if (modalInstance) modalInstance.hide(); }, 3000);
        modalInstance.show();
    }

    function addStyles() {
        if (document.getElementById('cartStyles')) return;
        const style = document.createElement('style');
        style.id = 'cartStyles';
        style.textContent = `
            @keyframes cartBounce { 0%{transform:scale(1)}30%{transform:scale(1.5)}50%{transform:scale(.9)}70%{transform:scale(1.2)}100%{transform:scale(1)} }
            .cart-item{transition:all .2s ease}.cart-item:hover{background:#f0f0f0!important}
            .cart-items-list::-webkit-scrollbar{width:4px}.cart-items-list::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}.cart-items-list::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:4px}
            #cartContainer,#cartIconContainer{display:inline-block}
            #cartIcon{position:relative;display:inline-block;cursor:pointer;padding:4px;font-size:28px;color:#fff;transition:transform .2s ease}
            #cartIcon:hover{transform:scale(1.1)}
            #cartBadge{position:absolute;top:28px;right:3px;background:#dc3545;color:#fff;border-radius:50%;padding:2.75px 7px;font-size:11px;font-weight:700;display:none;min-width:18px;height:18px;text-align:center;line-height:1.2;box-shadow:0 2px 4px rgba(0,0,0,.3);animation:none}
        `;
        document.head.appendChild(style);
    }

    function initCart() {
        console.log('Initializing cart...');
        addStyles();
        loadCart();
        const existingIcon = document.getElementById('cartIcon');
        if (existingIcon) existingIcon.remove();
        const icon = createCartIcon();
        if (icon) { window.updateCartBadge(); if (typeof window.updateAllQtyUI === 'function') window.updateAllQtyUI(); }
        else setTimeout(function () { const retryIcon = createCartIcon(); if (retryIcon) { window.updateCartBadge(); } }, 500);
    }

    window.initCartIcon = initCart;
    window.updateCartBadge = window.updateCartBadge;
    window.updateCartModal = window.updateCartModal;
    window.openCartModal = window.openCartModal;
    window.getCartTotal = window.getCartTotal;
    window._addToCart = window._addToCart;
    window.changeQty = window.changeQty;
    window._cartChangeQty = window.changeQty;
    window.removeFromCart = window.removeFromCart;
    window.clearCart = window.clearCart;
    window.changeCartQty = window.changeCartQty;
    window.checkoutCart = window.checkoutCart;
    window.createCartIcon = createCartIcon;
    window.getCartKey = getCartKey;
    window.saveCart = saveCart;
    window.hndlRspo77 = hndlRspo77;

    console.log('cart.js loaded successfully');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(initCart, 500); });
    } else {
        setTimeout(initCart, 500);
    }
})();