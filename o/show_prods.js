// show_prods.js - Display products by category with IndexedDB support
(function () {
    'use strict';
    var currentCategoryId = null;
    var isInitialized = false;

    var PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="105" text-anchor="middle" font-size="40" fill="#999">📷</text></svg>');

    // Get the active product container (mobile or desktop)
    function getActivePrdContainer() {
        var mobileProducts = document.getElementById('prdContentMobile');
        var mobileLayout = document.getElementById('mobileLayout');
        if (mobileLayout && mobileLayout.style.display !== 'none' && mobileProducts) {
            return mobileProducts;
        }
        var desktopProducts = document.getElementById('prdContentDesktop');
        if (desktopProducts && desktopProducts.style.display !== 'none') {
            return desktopProducts;
        }
        return document.getElementById('prdContent');
    }

    function calculateDiscount(sellingPrice, mrp) {
        if (!mrp || mrp === 0) return 0;
        return Math.round(((mrp - sellingPrice) / mrp) * 100);
    }

    async function ensureProductsReady() {
        if (window.PRODUCTS && window.PRODUCTS.length) {
            return window.PRODUCTS;
        }
        if (typeof refreshProductsCache === "function") {
            await refreshProductsCache();
        }
        return window.PRODUCTS || [];
    }

    // In show_prods.js, update getProductsByCategoryId:
    function getProductsByCategoryId(categoryId) {
        const products = window.PRODUCTS || [];
        if (categoryId === "all") return products;

        // Filter products where product's category field matches categoryId
        return products.filter(function (product) {
            // Check multiple possible category field locations
            var productCategory = product.category ||
                product.f ||
                (product.P ? product.P.f : null);
            return String(productCategory) === String(categoryId);
        });
    }

    // Also update getCategoryName to handle missing categories:
    function getCategoryName(categoryId) {
        if (categoryId === 'all') return 'All Products';

        // Find category from prod_cata where f == 0 (categories) and a matches categoryId
        var category = (window.prod_cata || []).find(function (c) {
            return String(c.a) === String(categoryId) && Number(c.f) === 0;
        });

        if (category) {
            return category.e || 'Category ' + categoryId;
        }

        // If not found in prod_cata, return generic name
        return 'Category ' + categoryId;
    }

    // Also update showProductsByCategory to use this logic
    async function showProductsByCategory(categoryId) {
        currentCategoryId = categoryId;
        var prdContent = getActivePrdContainer();
        if (!prdContent) return;

        // Show loading
        prdContent.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

        await ensureProductsReady();

        var filteredProducts = null;
        if (categoryId !== 'all') {
            filteredProducts = window.PRODUCTS.filter(function (product) {
                // Product category is stored in multiple possible locations
                var productCategory = product.category ||
                    (product.P ? product.P.f : null) ||
                    product.f;
                return String(productCategory) === String(categoryId);
            });
        }

        renderProducts(categoryId, prdContent, filteredProducts);
    }

    function getGoogleDriveImageUrl(value, thumbnail) {
        if (!value) return '';
        value = String(value).trim();
        var parts = value.split(/\s+/);
        if (parts.length >= 1 && /^[A-Za-z0-9_-]{20,}$/.test(parts[0])) {
            var fileId = thumbnail && parts[1] ? parts[1] : parts[0];
            return 'https://lh3.googleusercontent.com/d/' + fileId + '=s0?authuser=0';
        }
        return value;
    }

    window.CART = window.CART || {};

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

    function getSelectedUnitId(productId, soldIn) {
        var unitIds = Object.keys(soldIn || {});
        if (unitIds.length === 0) return null;
        var selectedUnitId = window.SELECTED_UNIT ? window.SELECTED_UNIT[productId] : null;
        if (!selectedUnitId || !soldIn[selectedUnitId]) {
            selectedUnitId = unitIds[0];
            window.SELECTED_UNIT = window.SELECTED_UNIT || {};
            window.SELECTED_UNIT[productId] = selectedUnitId;
        }
        return selectedUnitId;
    }

    function getSelectedPrice(productId, unitId) {
        var product = window.PRODUCT_MAP ? window.PRODUCT_MAP[productId] : null;
        var prices = product && product.soldIn ? (product.soldIn[unitId] || []) : [];
        var packageIndex = getSelectedPackageIndex(productId, unitId);
        if (packageIndex >= prices.length) packageIndex = 0;
        return { packageIndex: packageIndex, priceInfo: prices[packageIndex] || prices[0] || null };
    }

    window.addToCart = function (productId, button) {
        console.log('show_prods addToCart called for:', productId);
        var product = window.PRODUCT_MAP ? window.PRODUCT_MAP[productId] : null;
        if (!product) { console.warn('Product not found:', productId); return; }
        var soldIn = product.soldIn || {};
        var selectedUnitId = getSelectedUnitId(productId, soldIn);
        var packageIndex = getSelectedPackageIndex(productId, selectedUnitId);
        var prices = soldIn[selectedUnitId] || [];
        var priceInfo = prices[packageIndex] || prices[0];
        var minQty = getPriceValue(priceInfo, 'min', 1) || 1;
        if (typeof window._addToCart === 'function') {
            window._addToCart(productId, selectedUnitId, minQty, button, packageIndex);
            return;
        }
        var cartKey = getCartKey(productId, selectedUnitId, packageIndex);
        window.CART = window.CART || {};
        window.CART_ITEMS = window.CART_ITEMS || {};
        window.CART[cartKey] = minQty;
        window.CART_ITEMS[cartKey] = { product: product, productId: productId, unitId: selectedUnitId, packageIndex: packageIndex, priceInfo: priceInfo, minQty: getPriceValue(priceInfo, 'min', 1) || 1, maxQty: getPriceValue(priceInfo, 'max', 0) > 0 ? getPriceValue(priceInfo, 'max', 0) : Infinity, increment: getPriceValue(priceInfo, 'increment', 1) || 1, packageSize: getPriceValue(priceInfo, 'package', '') };
        if (typeof window.updateQtyUI === 'function') window.updateQtyUI(productId);
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
    };

    window.changeQty = function (productId, change) {
        if (typeof window._cartChangeQty === 'function') { window._cartChangeQty(productId, change); return; }
        var product = window.PRODUCT_MAP[productId];
        if (!product) return;
        var soldIn = product.soldIn || {};
        var selectedUnitId = getSelectedUnitId(productId, soldIn);
        var packageIndex = getSelectedPackageIndex(productId, selectedUnitId);
        var prices = soldIn[selectedUnitId] || [];
        if (packageIndex >= prices.length) packageIndex = 0;
        var priceInfo = prices[packageIndex] || prices[0];
        var cartKey = getCartKey(productId, selectedUnitId, packageIndex);
        var currentQty = window.CART[cartKey] || 0;
        var minQty = getPriceValue(priceInfo, 'min', 1) || 1;
        var maxQty = getPriceValue(priceInfo, 'max', 0) > 0 ? getPriceValue(priceInfo, 'max', 0) : Infinity;
        var increment = getPriceValue(priceInfo, 'increment', 1) || 1;
        var newQty = currentQty + (change * increment);
        if (newQty < minQty && change < 0) { delete window.CART[cartKey]; delete window.CART_ITEMS[cartKey]; }
        else if (newQty < minQty) { newQty = minQty; window.CART[cartKey] = newQty; window.CART_ITEMS[cartKey] = { product: product, productId: productId, unitId: selectedUnitId, packageIndex: packageIndex, priceInfo: priceInfo, minQty: minQty, maxQty: maxQty, increment: increment, packageSize: getPriceValue(priceInfo, 'package', '') }; }
        else if (newQty > maxQty) { newQty = maxQty; window.CART[cartKey] = newQty; window.CART_ITEMS[cartKey] = { product: product, productId: productId, unitId: selectedUnitId, packageIndex: packageIndex, priceInfo: priceInfo, minQty: minQty, maxQty: maxQty, increment: increment, packageSize: getPriceValue(priceInfo, 'package', '') }; }
        else if (newQty > 0) { window.CART[cartKey] = newQty; window.CART_ITEMS[cartKey] = { product: product, productId: productId, unitId: selectedUnitId, packageIndex: packageIndex, priceInfo: priceInfo, minQty: minQty, maxQty: maxQty, increment: increment, packageSize: getPriceValue(priceInfo, 'package', '') }; }
        else { delete window.CART[cartKey]; delete window.CART_ITEMS[cartKey]; }
        updateQtyUI(productId);
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
        if (typeof window.updateCartModal === 'function') window.updateCartModal();
        if (typeof window.saveCart === 'function') window.saveCart();
    };

    window.changePackage = function (productId, unitId, packageIndex) {
        console.log('changePackage called:', productId, unitId, packageIndex);
        var product = window.PRODUCT_MAP[productId];
        if (!product) return;
        var soldIn = product.soldIn || {};
        var prices = soldIn[unitId] || [];
        var pkgIndex = parseInt(packageIndex, 10);
        if (isNaN(pkgIndex) || pkgIndex >= prices.length) pkgIndex = 0;
        var priceInfo = prices[pkgIndex] || prices[0];
        var oldPackageIndex = getSelectedPackageIndex(productId, unitId);
        window.SELECTED_PACKAGE = window.SELECTED_PACKAGE || {};
        window.SELECTED_PACKAGE[productId + '_' + unitId] = pkgIndex;
        updatePriceUI(productId);
        updateSizeUI(productId);
        updateQtyUI(productId);
        updateDiscountBadge(productId);
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
        if (typeof window.updateCartModal === 'function') window.updateCartModal();
        if (typeof window.saveCart === 'function') window.saveCart();
    };

    window.updateAllQtyUI = function () {
        var products = window.PRODUCTS || [];
        products.forEach(function (product) { if (product.pid) window.updateQtyUI(product.pid); });
    };

    window.updateQtyUI = function (productId) {
        var holder = document.getElementById("cart_" + productId);
        if (!holder) return;
        var product = window.PRODUCT_MAP ? window.PRODUCT_MAP[productId] : null;
        if (!product) { holder.innerHTML = '<button class="btn btn-primary btn-sm w-100" onclick="addToCart(\'' + productId + '\',this)">ADD</button>'; return; }
        var soldIn = product.soldIn || {};
        var unitIds = Object.keys(soldIn);
        if (unitIds.length === 0) { holder.innerHTML = '<button class="btn btn-primary btn-sm w-100" onclick="addToCart(\'' + productId + '\',this)">ADD</button>'; return; }
        var selectedUnitId = getSelectedUnitId(productId, soldIn);
        var packageIndex = getSelectedPackageIndex(productId, selectedUnitId);
        var cartKey = getCartKey(productId, selectedUnitId, packageIndex);
        var qty = window.CART ? (window.CART[cartKey] || 0) : 0;
        var priceInfo = getSelectedPrice(productId, selectedUnitId).priceInfo;
        var minQty = getPriceValue(priceInfo, 'min', 1) || 1;
        var maxQty = getPriceValue(priceInfo, 'max', 0) > 0 ? getPriceValue(priceInfo, 'max', 0) : Infinity;
        var increment = getPriceValue(priceInfo, 'increment', 1) || 1;

        // Get unit short name for bottom display
        var unitShort = "";
        if (window.UNIT_DATA && selectedUnitId) {
            var foundUnit = window.UNIT_DATA.find(function (u) { return String(u.a) === String(selectedUnitId); });
            if (foundUnit) unitShort = foundUnit.f || foundUnit.e || "";
        }

        if (qty === 0) {
            holder.innerHTML = '<button class="sp-add-btn" onclick="addToCart(\'' + productId + '\',this)">ADD' + (minQty > 1 ? ' (' + minQty + ')' : '') + '</button>';
        } else {
            holder.innerHTML = '<div class="sp-qty-control"><button class="sp-qty-btn" onclick="changeQty(\'' + productId + '\',-1)">−</button><span class="sp-qty-val">' + qty + '</span><button class="sp-qty-btn" onclick="changeQty(\'' + productId + '\',1)">+</button></div>';
        }
    };

    window.SELECTED_UNIT = window.SELECTED_UNIT || {};

    window.changeMeasure = function (productId, unitId) {
        console.log('changeMeasure called:', productId, unitId);
        var product = window.PRODUCT_MAP[productId];
        if (!product) return;
        var soldIn = product.soldIn || {};
        var oldUnitId = window.SELECTED_UNIT[productId];
        window.SELECTED_UNIT[productId] = unitId;
        var pkgKey = productId + '_' + unitId;
        if (!window.SELECTED_PACKAGE) window.SELECTED_PACKAGE = {};
        window.SELECTED_PACKAGE[pkgKey] = 0;
        var productCard = document.querySelector('[onclick*="showProductDetailModal(\'' + productId + '\')"]')?.closest('.col-6, .col-md-3, .col-lg-2');
        if (productCard) {
            var unitSelect = productCard.querySelector('select[onchange*="changeMeasure"]');
            if (unitSelect) unitSelect.value = unitId;
            var optionRow = productCard.querySelector('.product-option-row');
            var selectedUnitData = soldIn[unitId] || [];
            var hasMultiplePackages = selectedUnitData.length > 1;
            var unitShort = "";
            if (window.UNIT_DATA) { var fu = window.UNIT_DATA.find(function (u) { return String(u.a) === String(unitId); }); if (fu) unitShort = fu.f || ""; }
            var packageSelectContainer = null;
            if (optionRow) { var flexDivs = optionRow.querySelectorAll('.flex-fill'); if (flexDivs.length > 1) packageSelectContainer = flexDivs[1]; }
            if (hasMultiplePackages) {
                var packageSelectHtml = '<select class="form-select form-select-sm border border-secondary product-option-select" onchange="window.changePackage(\'' + productId + '\',\'' + unitId + '\',this.value)">';
                selectedUnitData.forEach(function (pkg, idx) {
                    var pkgSize = pkg.package || ''; var pkgPrice = pkg.selling || 0;
                    var isSelected = (idx === 0);
                    if (window.SELECTED_PACKAGE && window.SELECTED_PACKAGE[productId + '_' + unitId] !== undefined) isSelected = (idx === window.SELECTED_PACKAGE[productId + '_' + unitId]);
                    var displayText = pkgSize ? pkgSize + ' ' + unitShort + ' @ ₹' + pkgPrice : 'Package ' + (idx + 1) + ' @ ₹' + pkgPrice;
                    packageSelectHtml += '<option value="' + idx + '"' + (isSelected ? ' selected' : '') + '>' + displayText + '</option>';
                });
                packageSelectHtml += '</select>';
                if (packageSelectContainer) { packageSelectContainer.innerHTML = packageSelectHtml; packageSelectContainer.style.display = ''; }
                else if (optionRow) { var npc = document.createElement('div'); npc.className = 'flex-fill'; npc.innerHTML = packageSelectHtml; optionRow.appendChild(npc); }
            } else { if (packageSelectContainer) { packageSelectContainer.style.display = 'none'; packageSelectContainer.innerHTML = ''; } }
        }
        updatePriceUI(productId);
        updateSizeUI(productId);
        updateQtyUI(productId);
        updateDiscountBadge(productId);
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
        if (typeof window.updateCartModal === 'function') window.updateCartModal();
        if (typeof window.saveCart === 'function') window.saveCart();
    };

    window.updateDiscountBadge = function (productId) {
        var product = window.PRODUCT_MAP[productId];
        if (!product) return;
        var soldIn = product.soldIn || {};
        var selectedUnitId = getSelectedUnitId(productId, soldIn);
        var priceInfo = getSelectedPrice(productId, selectedUnitId).priceInfo;
        if (!priceInfo) return;
        var sellingPrice = getPriceValue(priceInfo, 'selling', 0);
        var mrp = getPriceValue(priceInfo, 'mrp', 0);
        var discount = calculateDiscount(Number(sellingPrice), Number(mrp));
        var productCard = document.querySelector('[onclick*="showProductDetailModal(\'' + productId + '\')"]')?.closest('.product-card');
        if (productCard) {
            var badge = productCard.querySelector('.product-card-discount-badge');
            if (badge) { if (discount > 0) { badge.textContent = discount + '% OFF'; badge.style.display = 'block'; } else { badge.style.display = 'none'; } }
        }
    };

    window.updatePriceUI = function (productId) {
        var container = document.getElementById("price_" + productId);
        if (!container) return;
        var product = window.PRODUCT_MAP[productId];
        if (!product || !product.soldIn) return;
        var soldIn = product.soldIn;
        var selectedUnitId = getSelectedUnitId(productId, soldIn);
        var prices = soldIn[selectedUnitId] || [];
        var packageIndex = getSelectedPackageIndex(productId, selectedUnitId);
        if (packageIndex >= prices.length) packageIndex = 0;
        var price = prices[packageIndex] || prices[0];
        if (!price) return;
        container.innerHTML = `
            <span class="sp-price">₹ ${price.selling}</span>
                ${price.mrp > price.selling
                ? `<span class="sp-mrp">₹ ${price.mrp}</span>`
                : `<span style="display:inline-block;width:4px;"> </span>`
            }
            `;
    };

    window.updateSizeUI = function (productId) {
        var sizeHolder = document.getElementById("size_" + productId);
        if (!sizeHolder) return;
        var product = window.PRODUCT_MAP[productId];
        if (!product || !product.soldIn) return;
        var soldIn = product.soldIn;
        var selectedUnitId = window.SELECTED_UNIT[productId] || Object.keys(soldIn)[0];
        var prices = soldIn[selectedUnitId] || [];
        if (prices.length === 0) { sizeHolder.innerHTML = ''; return; }
        var selectedPrice = getSelectedPrice(productId, selectedUnitId);
        var price = selectedPrice.priceInfo;
        var unit = null;
        if (window.UNIT_DATA) { unit = window.UNIT_DATA.find(function (u) { return String(u.a) === String(selectedUnitId); }); }
        var unitShort = unit ? unit.f : "";
        var packageSize = getPriceValue(price, 'package', '');
        sizeHolder.innerHTML = packageSize ? packageSize + " " + unitShort : '';
    };

    function getSelectedPackageIndex(productId, unitId) {
        var packageKey = productId + '_' + unitId;
        var packageIndex = 0;
        if (window.SELECTED_PACKAGE && window.SELECTED_PACKAGE[packageKey] !== undefined) packageIndex = parseInt(window.SELECTED_PACKAGE[packageKey], 10);
        if (isNaN(packageIndex) || packageIndex < 0) { packageIndex = 0; if (!window.SELECTED_PACKAGE) window.SELECTED_PACKAGE = {}; if (window.SELECTED_PACKAGE[packageKey] === undefined) window.SELECTED_PACKAGE[packageKey] = 0; }
        return packageIndex;
    }

    var BATCH_SIZE = 14;
    var _scrollObserver = null;
    var _scrollSentinel = null;

    function buildCardHtml(product, hideMeasure, hidePackage) {
        var catId = Number(product?.P.a);
        if ((window[my1uzr.worknOnPg]?.categorys || []).includes(catId)) return '';
        const productId = product.pid;
        const productName = product.name || 'Unnamed Product';
        var soldIn = product.soldIn || {};
        var unitIds = Object.keys(soldIn);
        if (unitIds.length === 0) { soldIn["30"] = [{ mrp: 0, selling: 0, package: 1, increment: 1, min: 1, max: 0 }]; unitIds = ["30"]; }
        if (!window.SELECTED_UNIT[productId]) window.SELECTED_UNIT[productId] = unitIds[0];
        var selectedUnitId = window.SELECTED_UNIT[productId];
        var selectedPrices = soldIn[selectedUnitId] || [];
        var selectedPackageIndex = getSelectedPackageIndex(productId, selectedUnitId);
        if (selectedPackageIndex >= selectedPrices.length) selectedPackageIndex = 0;
        var priceInfo = selectedPrices.length > 0 ? (selectedPrices[selectedPackageIndex] || selectedPrices[0]) : null;
        const sellingPrice = priceInfo ? priceInfo.selling : (product.salesPrice || 0);
        const mrp = priceInfo ? priceInfo.mrp : (product.salesPrice || 0);
        const discount = calculateDiscount(Number(sellingPrice), Number(mrp));
        const packageSize = priceInfo ? priceInfo.package : "";
        const minQty = priceInfo ? priceInfo.min : "";
        const maxQty = priceInfo ? priceInfo.max : "";
        const increment = priceInfo ? priceInfo.increment : "";
        const imgUrl = getGoogleDriveImageUrl(product.thumb) || getGoogleDriveImageUrl(product.image) || PLACEHOLDER_IMG;
        var unitShort = "";
        var unitFull = "";
        if (selectedUnitId && window.UNIT_DATA) {
            var foundUnit = window.UNIT_DATA.find(function (u) { return String(u.a) === String(selectedUnitId); });
            if (foundUnit) { unitFull = foundUnit.e || ""; unitShort = foundUnit.f || ""; }
        }
        var selectedUnitData = soldIn[selectedUnitId] || [];
        var hasMultiplePackages = selectedUnitData.length > 1;
        var unitSelectHtml = '';
        var packageSelectHtml = '';

        if (!hideMeasure) {
            unitSelectHtml = '<select class="form-select form-select-sm border border-dark product-option-select" onchange="window.changeMeasure(\'' + productId + '\',this.value)">';
            unitIds.forEach(function (uid) {
                var unit = window.UNIT_DATA ? window.UNIT_DATA.find(function (u) { return String(u.a) === String(uid); }) : null;
                var displayName = unit ? unit.e : uid;
                var isSel = window.SELECTED_UNIT[productId] == uid;
                if (!window.SELECTED_UNIT[productId] && uid === unitIds[0]) { isSel = true; window.SELECTED_UNIT[productId] = uid; }
                unitSelectHtml += '<option value="' + uid + '"' + (isSel ? ' selected' : '') + '>' + displayName + '</option>';
            });
            unitSelectHtml += '</select>';
        }
        if (!hidePackage && hasMultiplePackages) {
            var currentPackageIndex = getSelectedPackageIndex(productId, selectedUnitId);
            if (currentPackageIndex >= selectedUnitData.length) currentPackageIndex = 0;
            packageSelectHtml = '<select class="form-select form-select-sm border border-secondary product-option-select" onchange="window.changePackage(\'' + productId + '\',\'' + selectedUnitId + '\',this.value)">';
            selectedUnitData.forEach(function (pkg, idx) {
                var pkgSize = pkg.package || ''; var pkgPrice = pkg.selling || 0;
                var isSel = (idx === currentPackageIndex);
                if (!window.SELECTED_PACKAGE || !window.SELECTED_PACKAGE[productId + '_' + selectedUnitId]) isSel = (idx === 0);
                var displayText = pkgSize ? pkgSize + ' ' + unitShort + ' @ ₹' + pkgPrice : 'Package ' + (idx + 1) + ' @ ₹' + pkgPrice;
                packageSelectHtml += '<option value="' + idx + '"' + (isSel ? ' selected' : '') + '>' + displayText + '</option>';
            });
            packageSelectHtml += '</select>';
        }

        var selectorsRow = '';
        if (!hideMeasure || (!hidePackage && hasMultiplePackages)) {
            selectorsRow = '<div class="product-option-row">';
            if (!hideMeasure) selectorsRow += '<div class="flex-fill">' + unitSelectHtml + '</div>';
            if (!hidePackage && hasMultiplePackages) selectorsRow += '<div class="flex-fill">' + packageSelectHtml + '</div>';
            else if (hideMeasure) selectorsRow += '<div class="flex-fill" style="display:none;"></div>';
            selectorsRow += '</div>';
        }

        var cartKey = getCartKey(productId, selectedUnitId, selectedPackageIndex);
        var qty = window.CART[cartKey] || 0;

        var card = '<div class="sp-card" onclick="window.showProductDetailModal(\'' + productId + '\')">';
        if (discount > 0) card += '<span class="sp-discount">Margin ' + discount + '%</span>';
        card += '<div class="sp-img-wrap position-relative overflow-hidden"><img class="sp-qimg" data-src="' + imgUrl + '" alt="' + window.escapeHTML(productName) + '" onerror="this.src=\'' + PLACEHOLDER_IMG + '\'"></div>';
        card += '<h6 class="sp-name" title="' + window.escapeHTML(productName) + '">' + window.escapeHTML(productName) + '</h6>';
        card += '<div class="sp-info-row"><span class="sp-pkg" id="size_' + productId + '">' + (packageSize ? packageSize + ' ' + unitShort.toUpperCase() : '') + '</span><span class="sp-price-wrap" id="price_' + productId + '"><span class="sp-price">₹ ' + sellingPrice + '</span>' + (mrp > sellingPrice ? '<span class="text-secondary mrp-text fw-bold">MRP </span><span class="sp-mrp">₹ ' + mrp + '</span>' : '') + '</span></div>';
        card += selectorsRow;
        card += '<div class="sp-cart-wrap" id="cart_' + productId + '" onclick="event.stopPropagation();">';
        if (qty === 0) {
            var addBtnText = 'ADD';
            if (minQty && minQty > 1) addBtnText += ' (' + minQty + ')';
            card += '<button class="sp-add-btn" onclick="addToCart(\'' + productId + '\',this)">' + addBtnText + '</button>';
        } else {
            card += '<div class="sp-qty-control"><button class="sp-qty-btn" onclick="changeQty(\'' + productId + '\',-1)">−</button><span class="sp-qty-val">' + qty + '</span><button class="sp-qty-btn" onclick="changeQty(\'' + productId + '\',1)">+</button></div>';
        }
        card += '</div>';
        if (priceInfo?.min == null) { } else {
            card += '<div class="sp-bottom-row"><span class="sp-bottom-type">' + (packageSize || '') + ' ' + (unitFull || (unitShort ? unitShort.toUpperCase() : '')) + '</span><span class="sp-bottom-qty">' + (priceInfo?.min ? 'Min ' + priceInfo.min : '') + '</span></div>';
        }
        card += '</div>';
        return card;
    }

    function appendCards(gridEl, cardHtmls, start, count) {
        var frag = document.createDocumentFragment();
        var temp = document.createElement('div');
        var end = Math.min(start + count, cardHtmls.length);
        var newImgs = [];
        for (var i = start; i < end; i++) {
            if (!cardHtmls[i]) continue;
            temp.innerHTML = cardHtmls[i];
            while (temp.firstChild) {
                var node = temp.firstChild;
                frag.appendChild(node);
                if (node.querySelectorAll) {
                    node.querySelectorAll('.sp-qimg[data-src]').forEach(function (img) { newImgs.push(img); });
                } else if (node.classList && node.classList.contains('sp-qimg') && node.dataset.src) {
                    newImgs.push(node);
                }
            }
        }
        gridEl.appendChild(frag);
        if (typeof queuedImageLoad === 'function') {
            newImgs.forEach(function (img) { queuedImageLoad(img, img.dataset.src); });
        }
    }

    function renderProducts(categoryId, prdContent, filteredProducts) {
        const products = filteredProducts || getProductsByCategoryId(categoryId);
        var categoryName = getCategoryName(categoryId);

        prdContent = getActivePrdContainer();
        if (!prdContent) return;
        if (products.length === 0) {
            prdContent.innerHTML = '<div class="text-center py-5"><i class="fas fa-box-open fa-3x text-muted mb-3"></i><h5>No Products Found</h5><p class="text-muted">No products available in "' + categoryName + '"</p></div>';
            return;
        }

        const hideMeasure = window[my1uzr.worknOnPg]?.mesd_pkgSLCHide && window[my1uzr.worknOnPg].mesd_pkgSLCHide[0] == 1;
        const hidePackage = window[my1uzr.worknOnPg]?.mesd_pkgSLCHide && window[my1uzr.worknOnPg].mesd_pkgSLCHide[1] == 1;

        var allCards = [];
        for (var i = 0; i < products.length; i++) {
            allCards.push(buildCardHtml(products[i], hideMeasure, hidePackage));
        }

        prdContent.innerHTML = '<div class="sp-container"><div class="sp-grid" id="spGrid"></div><div id="spScrollSentinel" style="height:1px;"></div></div>';
        var gridEl = prdContent.querySelector('#spGrid');
        var initial = Math.min(BATCH_SIZE, allCards.length);
        appendCards(gridEl, allCards, 0, initial);

        if (_scrollObserver) { _scrollObserver.disconnect(); _scrollObserver = null; }
        if (initial >= allCards.length) return;

        var nextIdx = initial;
        _scrollSentinel = prdContent.querySelector('#spScrollSentinel');
        _scrollObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && nextIdx < allCards.length) {
                var batch = Math.min(BATCH_SIZE, allCards.length - nextIdx);
                appendCards(gridEl, allCards, nextIdx, batch);
                nextIdx += batch;
                if (nextIdx >= allCards.length && _scrollObserver) { _scrollObserver.disconnect(); _scrollObserver = null; }
            }
        }, { root: null, rootMargin: '200px', threshold: 0 });
        _scrollObserver.observe(_scrollSentinel);
    }

    function showProductDetailModal(productId) {
        // if (!window.PRODUCT_MAP) { showToast("Products not loaded"); return; }
        // var product = window.PRODUCT_MAP[productId];
        // if (!product) { showToast("Product not found"); return; }
        // if (typeof create_modal_dynamically !== "function") { showToast("Modal system not available"); return; }
        // var modalId = "productDetailModal_" + Date.now();
        // var modalResult = create_modal_dynamically(modalId);
        // if (!modalResult) { showToast("Failed to create modal"); return; }
        // var contentElement = modalResult.contentElement;
        // var modalInstance = modalResult.modalInstance;
        // var categoryName = getCategoryName(product.P ? product.P.f : '');
        // var soldIn = product.soldIn || {};
        // var unitIds = Object.keys(soldIn);
        // var firstUnitId = unitIds.length > 0 ? unitIds[0] : "30";
        // var firstPrices = soldIn[firstUnitId] || [];
        // var priceInfo = firstPrices.length > 0 ? firstPrices[0] : null;
        // var sellingPrice = priceInfo ? priceInfo.selling : (product.salesPrice || 0);
        // var mrp = priceInfo ? priceInfo.mrp : (product.salesPrice || 0);
        // var discount = calculateDiscount(Number(sellingPrice), Number(mrp));
        // var packageSize = priceInfo ? priceInfo.package : "";
        // var minQty = priceInfo ? priceInfo.min : "";
        // var maxQty = priceInfo ? priceInfo.max : "";
        // var qtyInc = priceInfo ? priceInfo.increment : "";
        // var unitName = "";
        // if (firstUnitId && window.UNIT_DATA) { var fu = window.UNIT_DATA.find(function (u) { return String(u.a) === String(firstUnitId); }); if (fu) unitName = fu.e || ""; }
        // var image = getGoogleDriveImageUrl(product.image) || PLACEHOLDER_IMG;
        // var pricingOptionsHTML = '';
        // if (unitIds.length > 0) {
        //     pricingOptionsHTML = '<h6 class="fw-bold mt-3">Pricing Options</h6><div class="table-responsive"><table class="table table-sm table-bordered"><thead class="table-light"><tr><th>Unit</th><th>Selling Price</th><th>MRP</th><th>Package</th><th>Min Qty</th><th>Max Qty</th></tr></thead><tbody>';
        //     unitIds.forEach(function (unitId) {
        //         var unit = window.UNIT_DATA ? window.UNIT_DATA.find(function (u) { return u.a === unitId; }) : null;
        //         var unitDisplayName = unit ? unit.e : unitId;
        //         var prices = soldIn[unitId] || [];
        //         prices.forEach(function (p) { pricingOptionsHTML += '<tr><td>' + unitDisplayName + '</td><td>₹' + p.selling + '</td><td>₹' + p.mrp + '</td><td>' + p.package + '</td><td>' + p.min + '</td><td>' + (p.max === 0 ? '∞' : p.max) + '</td></tr>'; });
        //     });
        //     pricingOptionsHTML += '</tbody></table></div>';
        // }
        // contentElement.innerHTML = '<div class="p-3"><div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom"><h5 class="mb-0"><i class="fas fa-box me-2 text-primary"></i>Product Details</h5></div><div class="row g-3"><div class="col-md-5"><img src="' + image + '" class="img-fluid rounded" style="max-height:300px;width:100%;object-fit:cover" onerror="this.src=\'' + PLACEHOLDER_IMG + '\'"></div><div class="col-md-7"><h4>' + product.name + '</h4><div class="product-detail-pricing mb-3"><span class="fs-4 fw-bold text-success">₹ ' + sellingPrice + '</span>' + (mrp > sellingPrice ? '<span class="text-decoration-line-through text-muted ms-2">₹ ' + mrp + '</span>' : "") + (discount > 0 ? '<span class="badge bg-danger ms-2">' + discount + '% OFF</span>' : "") + '</div><hr><dl class="row small"><dt class="col-sm-4">Product ID</dt><dd class="col-sm-8">' + product.pid + '</dd><dt class="col-sm-4">Category</dt><dd class="col-sm-8">' + categoryName + '</dd>' + (packageSize ? '<dt class="col-sm-4">Package Size</dt><dd class="col-sm-8">' + packageSize + ' ' + unitName + '</dd>' : "") + (minQty ? '<dt class="col-sm-4">Min Qty</dt><dd class="col-sm-8">' + minQty + '</dd>' : "") + (maxQty ? '<dt class="col-sm-4">Max Qty</dt><dd class="col-sm-8">' + (maxQty === 0 ? 'No Limit' : maxQty) + '</dd>' : "") + (qtyInc ? '<dt class="col-sm-4">Qty Increment</dt><dd class="col-sm-8">' + qtyInc + '</dd>' : "") + '<dt class="col-sm-4">Purchase Price</dt><dd class="col-sm-8">₹ ' + (product.purchasePrice || 0) + '</dd><dt class="col-sm-4">Stock</dt><dd class="col-sm-8">' + (product.quantityReceived || 0) + '</dd>' + (product.notes ? '<dt class="col-sm-4">Notes</dt><dd class="col-sm-8">' + product.notes + '</dd>' : "") + '</dl>' + pricingOptionsHTML + '</div></div><div class="d-flex justify-content-end gap-2 mt-3 pt-2 border-top"><button class="btn btn-secondary" data-fp-close="1">Close</button></div></div>';
        // var modalElement = document.getElementById(modalId);
        // setTimeout(function () { if (!modalElement) return; var dialog = modalElement.querySelector(".modal-dialog"); if (dialog) dialog.style.marginTop = "60px"; }, 50);
        // modalInstance.show();
    }

    window.showProductsByCategory = showProductsByCategory;
    window.showProductDetailModal = showProductDetailModal;
    window.getActivePrdContainer = getActivePrdContainer;
    window.getProductsByCategoryId = getProductsByCategoryId;
    window.getCategoryName = getCategoryName;
    window.calculateDiscount = calculateDiscount;

    console.log('show_prods.js loaded successfully');

    var styles = document.createElement('style');
    styles.textContent = `
    /* Container */
    .sp-container { width: auto; padding: 12px 8px; background: #EAF6FF; min-height: 100vh; margin-left:-2.8px; }
    .sp-header { display: flex; align-items: center; justify-content: space-between; padding: 0 4px 12px 4px; }
    .sp-cat-title { font-size: 18px; font-weight: 700; color: #2D3748; margin: 0; }
    .sp-count { background: #005F73; color: #fff; font-size: 12px; padding: 3px 10px; border-radius: 12px; margin-left: 8px; font-weight: 600; }

    /* Grid */
    .sp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    @media (min-width: 576px) { .sp-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; } }
    @media (min-width: 992px) { .sp-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; } }
    @media (min-width: 1200px) { .sp-grid { grid-template-columns: repeat(5, 1fr); gap: 16px; } }

    /* Card */
    .sp-card {
        background: #FFFFFF;
        border-radius: 18px;
        box-shadow: 0 4px 12px rgba(0,0,0,.08);
        border: 1px solid #006073be;
        padding: 14px 12px;
        position: relative;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        display: flex; flex-direction: column;
        overflow: hidden;
    }
    .sp-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,.12); }

    /* Discount badge */
    .sp-discount {
        position: absolute; top: 8px; left: 8px;
        background: #E53E3E; color: #fff; font-size: 10px; font-weight: 700;
        padding: 4px 6px; border-radius: 5px; z-index: 1;
    }

    /* Image */
    .sp-img-wrap { 
        width: calc(100% + 12px); 
        margin: 0 -6px 8px -6px;
        height: 150px; 
        text-align: center; 
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #f8f9fa;
    }
    .sp-img-wrap img { 
        width: 100%; 
        height: auto; 
        object-fit: contain;
    }

    /* Name */
    .sp-name {
        font-size: 14px; font-weight: 700; color: #27303f;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        overflow: hidden; line-height: 1.3; margin: 0 0 6px 0;
        min-height: 18px;
    }

    /* Info row */
    .sp-info-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .sp-pkg { font-size: 12px; color: #44484b; font-weight: 500; display: none; }
    .sp-price-wrap { display: flex; align-items: baseline; gap: 4px; }
    .sp-price { font-size: 12px; font-weight: 700; background: #28a76c; color: #fff; padding: 4px 6px; border-radius: 5px; z-index: 1; text-shadow: 1px 1px 2px rgba(0,0,0,0.45); box-shadow: 1px 3px 5px rgba(0,0,0,.74); }
    .sp-mrp { font-size: 11px; color: #ca0000d8; }
    .mrp-text { font-size: 10px; margin-left:3px; }

    /* Selectors row */
    .product-option-row { display: flex; gap: 4px; margin-bottom: 8px; min-height: 30px; }
    .product-option-row > .flex-fill { flex: 1 1 0; min-width: 0; }
    .product-option-select { width: 100%; height: 28px; font-size: 11px; padding: 2px 18px 2px 5px; line-height: 1.2; border-radius: 4px; background: #fff; }

    /* Cart wrap */
    .sp-cart-wrap { margin-top: auto; }

    /* Add button */
    .sp-add-btn {
        width: 100%; height: 34px; background: #005F73; color: #FFFFFF;
        border: none; border-radius: 12px; font-size: 14px; font-weight: 700;
        cursor: pointer; transition: background 0.2s ease;
    }
    .sp-add-btn:hover { background: #004A5A; }

    /* Quantity control */
    .sp-qty-control {
        display: flex; align-items: center; justify-content: space-between;
        background: #E8F4F8; border-radius: 12px; height: 34px; overflow: hidden;
    }
    .sp-qty-btn {
        width: 36px; height: 34px; border: none; background: #005F73; color: #fff;
        font-size: 18px; font-weight: 700; cursor: pointer; transition: background 0.2s;
        display: flex; align-items: center; justify-content: center;
    }
    .sp-qty-btn:hover { background: #004A5A; }
    .sp-qty-val { font-size: 15px; font-weight: 700; color: #2D3748; flex: 1; text-align: center; }

    /* Bottom row */
    .sp-bottom-row { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 4px; }
    .sp-bottom-type { font-size: 11px; color: #44484b; font-weight: 500; }
    .sp-bottom-qty { font-size: 11px; color: #44484b; font-weight: 500; }

    /* Mobile tweaks */
    @media (max-width: 576px) {
        .sp-container { padding: 8px 4px; }
        .sp-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
        .sp-card { padding: 8px 6px; border-radius: 12px; }
        .sp-img-wrap { height: 125px; margin: 0 -6px 4px -6px; }
        .sp-name { font-size: 12px; min-height: 12px; -webkit-line-clamp: 2; margin-bottom: 4px; }
        .sp-price { font-size: 11px; padding: 4px 6px; }
        .sp-mrp { font-size: 10px; }
        .sp-pkg { font-size: 10px; }
        .sp-add-btn { height: 30px; font-size: 13px; border-radius: 10px; }
        .sp-qty-control { height: 30px; border-radius: 10px; }
        .sp-qty-btn { width: 30px; height: 30px; font-size: 16px; }
        .sp-qty-val { font-size: 13px; }
        .product-option-select { font-size: 9px; height: 24px; }
        .sp-discount { font-size: 8px; padding: 2px 5px; top: 4px; left: 4px; }
        .sp-bottom-type, .sp-bottom-qty { font-size: 10px; }
    }

    @media (max-width: 400px) {
        .sp-grid { gap: 4px; }
        .sp-card { padding: 6px 4px; border-radius: 10px; }
        .sp-img-wrap { height: 105px; margin: 0 -5px 4px -5px; }
        .sp-img-wrap img{ width:100%; height:auto; object-fit:contain; }
        .sp-name { font-size: 12px; min-height: 7px; margin-left:2px; maring-top:4px; }
        .sp-price { font-size: 11px; padding: 4px 6px; }
        .sp-add-btn { height: 28px; font-size: 12px; }
        .sp-qty-control { height: 28px; }
        .sp-qty-btn { width: 28px; height: 28px; font-size: 14px; }
    }
`;
    document.head.appendChild(styles);

    setTimeout(async function () {
        await ensureProductsReady();
        showProductsByCategory("all");
    }, 300);

})();