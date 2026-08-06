// ed_prod.js - Product & Category CRUD Management with Bootstrap styling
(function () {
    'use strict';

    // Global flags
    let isProcessing = false;
    let currentModalId = null;
    let isCategoryMode = false; // false = product mode, true = category mode
    let _fpListModalId = null;

    const PLACEHOLDER_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="#f0f0f0"/><text x="25" y="25" text-anchor="middle" dy=".3em" font-size="12" fill="#999" font-family="Arial">No</text></svg>');

    // Get image processing limits from global config
    const getImageLimits = function () {
        const config = window[my1uzr.worknOnPg] || {};
        return {
            prodDispMaxWidth: config.prodDispMaxWidth || 1080,
            prodDispMaxSize: config.prodDispMaxSize || 512,
            prodThmpMaxWidth: config.prodThmpMaxWidth || 300,
            prodThmpMaxSize: config.prodThmpMaxSize || 32
        };
    };

    window.allowFloat = function (el, decimals = 2) {
        let v = el.value;

        // Keep only numbers and .
        v = v.replace(/[^0-9.]/g, '').slice(0, 11);

        // Allow only one decimal point
        const parts = v.split('.');
        if (parts.length > 2) {
            v = parts.shift() + '.' + parts.join('');
        }

        // Limit digits after decimal
        if (v.includes('.')) {
            const p = v.split('.');
            p[1] = p[1].substring(0, decimals);
            v = p[0] + '.' + p[1];
        }

        el.value = v;
    };

    // ==================== PRICING ITEMS MANAGEMENT ====================

    // Store pricing items as data array instead of DOM elements
    let currentPricingItems = [];

    // Update sold-in preview
    function updateSoldInPreview() {
        const previewDiv = document.getElementById('soldInPreview');
        const previewText = document.getElementById('soldInPreviewText');

        if (!previewDiv || !previewText) return;

        const generatedString = generateSoldInString();
        if (generatedString) {
            previewDiv.style.display = 'block';
            previewText.textContent = generatedString;
        } else {
            previewDiv.style.display = 'none';
        }
    }

    // Add pricing item to the data array and refresh display
    function addPricingItem(data = null) {
        currentPricingItems.push({
            measuredIn: data?.measuredIn || '',
            sellingPrice: data?.sellingPrice || '',
            mrp: data?.mrp || '',
            packageSize: data?.packageSize || '',
            quantity: data?.quantity || '',
            minQty: data?.minQty || '1',
            maxQty: data?.maxQty || '10'
        });
        renderPricingItemsList();
    }

    // Remove pricing item by index
    function removePricingItem(index) {
        currentPricingItems.splice(index, 1);
        renderPricingItemsList();
    }

    // Update a pricing item's field
    function updatePricingItemField(index, field, value) {
        if (currentPricingItems[index]) {
            currentPricingItems[index][field] = value;

            // Validate min qty >= qty increment
            if (field === 'minQty' || field === 'quantity') {
                const qtyInc = parseInt(currentPricingItems[index].quantity) || 1;
                const minQty = parseInt(currentPricingItems[index].minQty) || 1;
                if (minQty < qtyInc) {
                    currentPricingItems[index].minQty = qtyInc;
                }
            }
            // Validate max qty >= min qty
            if (field === 'maxQty' || field === 'minQty') {
                const maxQty = parseInt(currentPricingItems[index].maxQty) || 1;
                const minQty = parseInt(currentPricingItems[index].minQty) || 1;
                if (maxQty < minQty) {
                    currentPricingItems[index].maxQty = minQty;
                }
            }
        }
        updateSoldInPreview();
    }

    // Render the pricing items list and the add form
    function renderPricingItemsList() {
        const container = document.getElementById('pricingItemsContainer');
        if (!container) return;

        let html = '';

        // Render add form (progressive reveal) - ALWAYS at the bottom
        html += `
            <div class="pricing-item-form mt-3" style="background:#f8f9fa;padding:12px;border-radius:8px;border:1px solid #dee2e6;">
                <h6 class="fw-bold small mb-2"><i class="fas fa-plus-circle text-success me-1"></i>Add New Pricing Item</h6>
                
                <!-- Step 1: Measured In (always visible) -->
                <div class="row g-2 mb-2" id="stepMeasuredIn">
                    <div class="col-12">
                        <label class="form-label fw-bold small mb-0" title="Select the unit of measurement">
                            <i class="fas fa-ruler me-1 text-info"></i>Measured In
                        </label>
                        <select class="form-select inputbox form-select-sm" id="newMeasuredIn" 
                                title="Unit of measurement for this pricing item">
                            <option value="">Select Unit</option>
                            ${window.UNIT_DATA.map(unit =>
            `<option value="${unit.a}">${unit.e} (${unit.f})</option>`
        ).join('')}
                        </select>
                    </div>
                </div>
                
                <!-- Step 2: Other fields (hidden initially) -->
                <div id="pricingFieldsContainer" style="display:none;">
                    <!-- Selling Price & MRP -->
                    <div class="row g-2 mb-2">
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Selling price per unit to customer">
                                <i class="fas fa-tag me-1 text-success"></i>Selling Price<span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm" id="newSellingPrice" oninput="window.allowFloat(this,2)"
                                placeholder="₹" min="0" step="0.01"
                                title="Price at which product will be sold to customer">
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Maximum Retail Price (printed price)">
                                <i class="fas fa-receipt me-1 text-warning"></i>Product MRP<span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm" id="newMrp" oninput="window.allowFloat(this,2)"
                                placeholder="₹" min="0" step="0.01"
                                title="Maximum Retail Price - the printed price on product">
                        </div>
                    </div>
                    
                    <!-- Package Size & Qty Increment -->
                    <div class="row g-2 mb-2">
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Size/weight of the package">
                                <i class="fas fa-box me-1 text-primary"></i>Package Size<span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm" id="newPackageSize" oninput="window.allowFloat(this,3)"
                                placeholder="" min="1"
                                title="Size of the package (e.g., 250 for 250gm)">
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Quantity to add per increment when purchasing">
                                <i class="fas fa-plus-circle me-1 text-info"></i>Qty Increment<span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm pricing-field" id="newQtyInc" 
                                placeholder="" min="1"
                                title="Increment quantity - each click adds this much (e.g., +2)">
                        </div>
                    </div>
                    
                    <!-- Min Qty & Max Qty -->
                    <div class="row g-2 mb-2">
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Minimum quantity that must be purchased (cannot be less than Qty Increment)">
                                <i class="fas fa-arrow-down me-1 text-danger"></i>Min Qty<span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm pricing-field" id="newMinQty" 
                                placeholder="" min="1" value=""
                                title="Minimum purchase quantity - must be >= Qty Increment and multiple of Qty Increment">
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-bold small mb-0" title="Maximum quantity that can be purchased (must be a multiple of Qty Increment)">
                                <i class="fas fa-arrow-up me-1 text-secondary"></i>Max Qty<span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control inputbox form-control-sm pricing-field" id="newMaxQty" 
                                placeholder="" min="1" value=""
                                title="Maximum purchase quantity limit">
                        </div>
                    </div>
                </div>
                
                <!-- Add button (hidden initially, shown when all valid) -->
                <button type="button" class="btn btn-sm btn-success mt-2" id="btnAddPricing" style="display:none;" onclick="window.saveNewPricingItem()">
                    <i class="fas fa-plus me-1"></i>Add This Pricing
                </button>
                <div id="pricingValidationMsg" class="text-danger small mt-1 ml-3" style="display:none;"></div>
            </div>`;


        // Render existing items first
        currentPricingItems.forEach((item, index) => {
            const unitName = window.UNIT_DATA.find(u => u.a == item.measuredIn)?.e || 'Not set';
            html += `
                    <div class="pricing-item-saved mb-2" style="background:#e8f5e9;padding:10px;border-radius:8px;border:1px solid #c8e6c9;">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="badge bg-primary me-2">${unitName}</span>
                                <strong>₹${item.sellingPrice}</strong> @ MRP ₹${item.mrp} | 
                                Size: ${item.packageSize} | Inc: ${item.quantity} | 
                                Min: ${item.minQty} | Max: ${item.maxQty}
                            </div>
                            <button type="button" class="btn btn-sm btn-outline-danger" 
                                    onclick="window.removePricingItem(${index})" title="Remove this pricing">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>`;
        });

        // Setup number-only inputs
        setTimeout(function () {
            const numberInputs = container.querySelectorAll('.pricing-field');
            numberInputs.forEach(input => {
                input.addEventListener('input', function () {
                    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
                });
            });
        }, 50);

        container.innerHTML = html;
        // ALWAYS re-setup handlers after rendering
        setTimeout(function () {
            setupPricingItemsHandlers();
        }, 150);

        updateSoldInPreview();
    }

    window.saveNewPricingItem = function () {
        const measuredIn = document.getElementById('newMeasuredIn')?.value || '';
        const sellingPrice = document.getElementById('newSellingPrice')?.value || '';
        const mrp = document.getElementById('newMrp')?.value || '';
        const packageSize = document.getElementById('newPackageSize')?.value || '';
        const quantity = document.getElementById('newQtyInc')?.value || '';
        const minQty = document.getElementById('newMinQty')?.value || '1';
        const maxQty = document.getElementById('newMaxQty')?.value || '10';

        if (!measuredIn) {
            if (typeof showToast === 'function') showToast('Please select Measured In', { type: 'warning', duration: 2000 });
            return;
        }
        if (!sellingPrice || !mrp || !packageSize || !quantity) {
            if (typeof showToast === 'function') showToast('Please fill all required fields', { type: 'warning', duration: 2000 });
            return;
        }

        const qtyInc = parseInt(quantity) || 1;
        const minQtyVal = parseInt(minQty) || 1;
        const maxQtyVal = parseInt(maxQty) || 10;

        if (minQtyVal < qtyInc) {
            if (typeof showToast === 'function') showToast('Min Qty cannot be less than Qty Increment', { type: 'warning', duration: 2000 });
            return;
        }
        if (maxQtyVal < minQtyVal) {
            if (typeof showToast === 'function') showToast('Max Qty cannot be less than Min Qty', { type: 'warning', duration: 2000 });
            return;
        }
        if (maxQtyVal % qtyInc !== 0) {
            if (typeof showToast === 'function') showToast('Max Qty must be a multiple of Qty Increment (' + qtyInc + ')', { type: 'warning', duration: 2000 });
            return;
        }
        if (minQtyVal % qtyInc !== 0) {
            if (typeof showToast === 'function') showToast('Min Qty must be a multiple of Qty Increment (' + qtyInc + ')', { type: 'warning', duration: 2000 });
            return;
        }

        addPricingItem({
            measuredIn: measuredIn,
            sellingPrice: sellingPrice,
            mrp: mrp,
            packageSize: packageSize,
            quantity: quantity,
            minQty: minQtyVal,
            maxQty: maxQtyVal
        });

        if (typeof showToast === 'function') showToast('Pricing item added', { type: 'success', duration: 1000 });
    };

    // Expose remove function globally
    window.removePricingItem = removePricingItem;

    // Generate sold-in string from pricing items
    function generateSoldInString() {
        const measuredInGroups = {};

        currentPricingItems.forEach(item => {
            if (!item.measuredIn) return;

            const sellingPrice = parseFloat(item.sellingPrice);
            const mrp = parseFloat(item.mrp);
            const packageSize = parseFloat(item.packageSize);
            const quantity = parseFloat(item.quantity);
            const minQty = parseFloat(item.minQty) || 1;
            const maxQty = parseFloat(item.maxQty) || 10;

            if (sellingPrice && mrp && packageSize && quantity) {
                if (!measuredInGroups[item.measuredIn]) {
                    measuredInGroups[item.measuredIn] = [];
                }
                measuredInGroups[item.measuredIn].push(
                    `${sellingPrice}@${mrp}~${packageSize}^${quantity}#${minQty}$${maxQty}`
                );
            }
        });

        const groupStrings = [];
        for (const [unitId, items] of Object.entries(measuredInGroups)) {
            if (items.length > 0) {
                groupStrings.push(`${unitId}-${items.join(',')}`);
            }
        }

        return groupStrings.length > 0 ? groupStrings.join('; ') : '';
    }

    // Initialize pricing items from saved string
    function initPricingItemsForEdit(soldInString) {
        currentPricingItems = [];
        if (!soldInString) {
            renderPricingItemsList();
            return;
        }

        try {
            const groups = soldInString.split(';').map(g => g.trim()).filter(Boolean);

            groups.forEach(group => {
                const parts = group.split('-');
                if (parts.length < 2) return;

                const unitId = parts[0];
                const itemsPart = parts.slice(1).join('-');
                const items = itemsPart.split(',');

                items.forEach(item => {
                    const match = item.match(/([\d.]+)@([\d.]+)~([\d.]+)\^([\d.]+)#([\d.]+)\$([\d.]+)/);
                    if (match) {
                        currentPricingItems.push({
                            measuredIn: unitId,
                            sellingPrice: parseFloat(match[1]),
                            mrp: parseFloat(match[2]),
                            packageSize: parseFloat(match[3]),
                            quantity: parseFloat(match[4]),
                            minQty: parseFloat(match[5]),
                            maxQty: parseFloat(match[6])
                        });
                    } else {
                        const oldMatch = item.match(/([\d.]+)@([\d.]+)~([\d.]+)\^([\d.]+)/);
                        if (oldMatch) {
                            currentPricingItems.push({
                                measuredIn: unitId,
                                sellingPrice: parseFloat(oldMatch[1]),
                                mrp: parseFloat(oldMatch[2]),
                                packageSize: parseFloat(oldMatch[3]),
                                quantity: parseFloat(oldMatch[4]),
                                minQty: 1,
                                maxQty: 10
                            });
                        }
                    }
                });
            });
        } catch (e) {
            console.warn('Error parsing sold-in string:', e);
        }
        renderPricingItemsList();
    }

    // Clear pricing items
    function clearPricingItems() {
        currentPricingItems = [];
        renderPricingItemsList();
    }

    // ==================== IMAGE PROCESSOR ====================

    class ImageProcessor {
        constructor() {
            const limits = getImageLimits();
            this.imgWidthForDisplay = limits.prodDispMaxWidth;
            this.imgWidthForThumbnail = limits.prodThmpMaxWidth;
            this.imgMaxSizeForDisplay = limits.prodDispMaxSize * 1024;
            this.imgMaxSizeForThumbnail = limits.prodThmpMaxSize * 1024;
        }

        async loadImage(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();

                if (url && !url.startsWith('data:') && !url.startsWith('blob:')) {
                    img.crossOrigin = 'anonymous';
                }

                const timeoutId = setTimeout(() => {
                    reject(new Error('Image loading timeout'));
                }, 30000);

                let corsError = false;

                img.onload = () => {
                    clearTimeout(timeoutId);
                    resolve(img);
                };

                img.onerror = () => {
                    clearTimeout(timeoutId);
                    if (!corsError && url && !url.startsWith('data:') && !url.startsWith('blob:')) {
                        corsError = true;
                        console.warn('CORS failed, trying without crossOrigin for:', url);
                        const img2 = new Image();
                        img2.onload = () => {
                            resolve(img2);
                        };
                        img2.onerror = () => {
                            reject(new Error('Failed to load image. The URL may be invalid or blocked.'));
                        };
                        img2.src = url + (url.includes('?') ? '&_=' : '?_=') + Date.now();
                        return;
                    }
                    reject(new Error('Failed to load image. The URL may be invalid or blocked by CORS.'));
                };

                if (url.startsWith('blob:') || url.startsWith('data:')) {
                    img.src = url;
                } else {
                    const cacheBuster = url.includes('?') ? '&_=' + Date.now() : '?_=' + Date.now();
                    img.src = url + cacheBuster;
                }
            });
        }

        getImageDetails(img, blob = null) {
            const details = {
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height,
                aspectRatio: ((img.naturalWidth || img.width) / (img.naturalHeight || img.height)).toFixed(2),
                type: 'Unknown',
                size: 'Unknown',
                sizeInBytes: 0
            };
            if (blob) {
                details.size = this.formatFileSize(blob.size);
                details.sizeInBytes = blob.size;
                details.type = blob.type || 'image/png';
            }
            return details;
        }

        formatFileSize(bytes) {
            if (!bytes || bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        calculateReduction(originalSize, compressedSize) {
            if (!originalSize || originalSize === 0) return 0;
            return ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
        }

        async compressImage(img, targetWidth, quality = 0.85) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const newWidth = Math.min(targetWidth, img.naturalWidth);
            const newHeight = newWidth / aspectRatio;
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    resolve({ blob: blob, dataUrl: canvas.toDataURL('image/jpeg', quality), width: newWidth, height: newHeight });
                }, 'image/jpeg', quality);
            });
        }

        async compressImageWithSizeLimit(img, targetWidth, maxSizeBytes, quality = 0.85) {
            let result = await this.compressImage(img, targetWidth, quality);
            let currentQuality = quality;
            while (result.blob.size > maxSizeBytes && currentQuality > 0.1) {
                currentQuality -= 0.05;
                result = await this.compressImage(img, targetWidth, currentQuality);
            }
            return result;
        }

        async processImage(url) {
            try {
                const originalImg = await this.loadImage(url);
                let originalBlob = null;
                try {
                    const response = await fetch(url, {
                        mode: 'cors',
                        cache: 'no-cache'
                    });
                    if (response.ok) {
                        originalBlob = await response.blob();
                    }
                } catch (e) {
                    console.warn('Could not fetch image as blob, using canvas fallback:', e);
                }

                if (!originalBlob) {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = originalImg.naturalWidth || originalImg.width || 200;
                        canvas.height = originalImg.naturalHeight || originalImg.height || 200;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(originalImg, 0, 0);
                        originalBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
                    } catch (canvasError) {
                        console.warn('Canvas fallback failed:', canvasError);
                        try {
                            const dataUrl = originalImg.src;
                            if (dataUrl && dataUrl.startsWith('data:')) {
                                const response = await fetch(dataUrl);
                                originalBlob = await response.blob();
                            }
                        } catch (finalError) {
                            console.warn('Final fallback failed:', finalError);
                        }
                    }
                }

                if (!originalBlob) {
                    const canvas = document.createElement('canvas');
                    canvas.width = originalImg.naturalWidth || originalImg.width || 200;
                    canvas.height = originalImg.naturalHeight || originalImg.height || 200;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(originalImg, 0, 0);
                    originalBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
                }

                const originalDetails = this.getImageDetails(originalImg, originalBlob);

                const displayResult = await this.compressImageWithSizeLimit(
                    originalImg,
                    this.imgWidthForDisplay,
                    this.imgMaxSizeForDisplay,
                    0.9
                );

                const thumbnailResult = await this.compressImageWithSizeLimit(
                    originalImg,
                    this.imgWidthForThumbnail,
                    this.imgMaxSizeForThumbnail,
                    0.8
                );

                return {
                    original: { img: originalImg, blob: originalBlob, details: originalDetails, dataUrl: url },
                    display: {
                        img: displayResult,
                        details: {
                            width: displayResult.width, height: displayResult.height,
                            aspectRatio: (displayResult.width / displayResult.height).toFixed(2),
                            size: this.formatFileSize(displayResult.blob.size),
                            sizeInBytes: displayResult.blob.size, type: 'image/jpeg',
                            reduction: this.calculateReduction(originalDetails.sizeInBytes, displayResult.blob.size)
                        },
                        dataUrl: displayResult.dataUrl, blob: displayResult.blob
                    },
                    thumbnail: {
                        img: thumbnailResult,
                        details: {
                            width: thumbnailResult.width, height: thumbnailResult.height,
                            aspectRatio: (thumbnailResult.width / thumbnailResult.height).toFixed(2),
                            size: this.formatFileSize(thumbnailResult.blob.size),
                            sizeInBytes: thumbnailResult.blob.size, type: 'image/jpeg',
                            reduction: this.calculateReduction(originalDetails.sizeInBytes, thumbnailResult.blob.size)
                        },
                        dataUrl: thumbnailResult.dataUrl, blob: thumbnailResult.blob
                    }
                };
            } catch (error) {
                throw new Error(`Image processing failed: ${error.message}`);
            }
        }
    }

    const imageProcessor = new ImageProcessor();

    // ==================== UTILITY FUNCTIONS ====================

    function getNextCategoryId() {
        const products = window.prod_cata || [];
        if (products.length === 0) return "101";
        return String(Math.max(...products.map(p => parseInt(p.a) || 0)) + 1);
    }

    function getNextProductId() {
        const products = window.prod_list || [];
        if (products.length === 0) return "1001";
        return String(Math.max(...products.map(p => parseInt(p.a) || 0)) + 1);
    }

    function getCurrentDateTime() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }

    function refreshUI() {
        if (typeof renderCategoryStrip === 'function') renderCategoryStrip();
        if (typeof window.refreshProductHandlers === 'function') window.refreshProductHandlers();
        setTimeout(() => { if (typeof attachClickHandlers === 'function') attachClickHandlers(); }, 100);
    }

    function disableBackdropClick(modalElement) {
        if (!modalElement) return;
        modalElement._backdropClickHandler = null;
        modalElement.addEventListener('click', function (e) {
            if (e.target === this) e.stopPropagation();
        });
    }

    function showItemForm(mode = 'product', item = null, index = null) {
        isCategoryMode = (mode === 'category');

        try {
            if (isProcessing) return;
            const isEdit = item !== null && index !== null;

            const modalId = 'cataPopItemFormModal_' + Date.now();
            currentModalId = modalId;

            if (typeof create_fullpage_view !== 'function') {
                if (typeof showToast === 'function') showToast('View system not available');
                return;
            }

            const modalResult = create_fullpage_view(modalId);
            if (!modalResult) {
                if (typeof showToast === 'function') showToast('Failed to create form');
                else alert('Failed to create form');
                return;
            }

            const { contentElement, modalInstance, modalElement } = modalResult;

            const title = isEdit
                ? (isCategoryMode ? 'Edit Category' : 'Edit Stock')
                : (isCategoryMode ? 'Add New Category' : 'Add New Product');
            const btnText = isEdit
                ? (isCategoryMode ? 'Update Category' : 'Update Product')
                : (isCategoryMode ? 'Save Category' : 'Save Product');

            const titleEl = document.getElementById(modalId + '_title');
            if (titleEl) titleEl.textContent = title;

            // Load categories - call the async function immediately
            (async function loadCategories() {
                let categories = [];
                try {
                    const allCategories = await dbDexieManager.getAllRecords(dbnm, 'p');
                    console.log('All categories from IndexedDB:', allCategories.length);

                    // Get category IDs from o.da config
                    const categoryIds = window[my1uzr.worknOnPg]?.categorys || [];
                    console.log('Category IDs from config:', categoryIds);

                    if (categoryIds.length > 0) {
                        // Build a map for quick lookup and preserve order
                        const cataMap = {};
                        allCategories.forEach(c => { cataMap[Number(c.a)] = c; });

                        // Map in the order of categoryIds to preserve sequence from o.da
                        categories = categoryIds
                            .map(id => cataMap[Number(id)])
                            .filter(c => c); // Remove any undefined
                        console.log('Filtered categories:', categories.length);
                    } else {
                        categories = allCategories;
                        console.log('Using all categories:', categories.length);
                    }

                    window.prod_cata = categories;
                } catch (e) {
                    console.warn('Error loading categories from IndexedDB:', e);
                    categories = window.prod_cata || [];
                }

                // Build category options
                const categoryOptions = categories.map(c =>
                    `<option value="${c.a}" ${(isEdit && item && String(item.f) === String(c.a)) ? 'selected' : ''}>${c.e || 'Unnamed Category'}</option>`
                ).join('');

                // If no categories, show a placeholder option
                const finalCategoryOptions = categoryOptions || '<option value="">No categories available</option>';

                // For edit mode, get stock details from prod_stock to pre-fill inputs
                let stockDetails = {};
                if (isEdit && !isCategoryMode) {
                    const stockRecords = window.prod_stock || [];

                    console.log('Looking for stock with sid:', item.sid, 'or stock_party_id:', item.stock_party_id);
                    console.log('Available stock records:', stockRecords.length);

                    // Match by sid (item.sid === s.a) or by party ID (item.stock_party_id === s.e)
                    stockDetails = stockRecords.find(s => {
                        // Match by stock ID (sid)
                        if (item.sid && String(s.a) === String(item.sid)) {
                            console.log('Found by sid:', item.sid);
                            return true;
                        }
                        // Match by party ID and product ID
                        if (item.stock_party_id && String(s.e) === String(item.stock_party_id) && String(s.g) === String(item.a)) {
                            console.log('Found by party+product:', item.stock_party_id, item.a);
                            return true;
                        }
                        // Match by product ID in stock record
                        if (item.a && String(s.g) === String(item.a)) {
                            console.log('Found by product ID:', item.a);
                            return true;
                        }
                        return false;
                    }) || {};

                    console.log('Stock details found for edit:', stockDetails);
                }

                // Get party name from c table for edit mode
                let partyName = '';
                if (isEdit && !isCategoryMode) {
                    const partyId = stockDetails.e || item.stock_party_id || '';
                    if (partyId) {
                        try {
                            const customers = await dbDexieManager.getAllRecords(dbnm, 'c');
                            const customer = customers.find(c => String(c.a) === String(partyId));
                            if (customer) {
                                partyName = customer.h || customer.i || customer.e || '';
                            }
                        } catch (e) {
                            console.warn('Error getting party name:', e);
                        }
                    }
                    // Also check if item already has party name stored
                    if (!partyName && item.stock_party_name) {
                        partyName = item.stock_party_name;
                    }
                }

                const fd = {
                    a: isEdit ? item.a : (isCategoryMode ? getNextCategoryId() : getNextProductId()),
                    b: isEdit ? item.b : getCurrentDateTime(),
                    c: isEdit ? item.c : "0",
                    d: isEdit ? item.d : "0",
                    e: isEdit ? item.e : "",
                    f: isCategoryMode ? "0" : (isEdit ? item.f : '0'),
                    g: isEdit ? (item.g || item.h || "") : "",
                    g1: isEdit ? (item.g1 || "") : "",
                    g2: isEdit ? (item.g2 || "") : "",
                    // Pre-fill from stockDetails first, then fallback to item properties
                    stock_party_id: !isCategoryMode && isEdit ? (stockDetails.e || item.stock_party_id || '') : '',
                    stock_party_name: !isCategoryMode && isEdit ? (partyName || item.stock_party_name || '') : '', bill_id: !isCategoryMode && isEdit ? (stockDetails.f || item.bill_id || '') : '',
                    product_id: !isCategoryMode && isEdit ? (stockDetails.g || item.product_id || '') : '',
                    purchase_price: !isCategoryMode && isEdit ? (stockDetails.h || item.purchase_price || '') : '',
                    quantity_received: !isCategoryMode && isEdit ? (stockDetails.i || item.quantity_received || '') : '',
                    measured_in: !isCategoryMode && isEdit ? (stockDetails.j || item.measured_in || '') : '',
                    sales_price: !isCategoryMode && isEdit ? (stockDetails.k || item.sales_price || '') : '',
                    sold_in: !isCategoryMode && isEdit ? (stockDetails.l || item.sold_in || '') : '',
                    notes: !isCategoryMode && isEdit ? (stockDetails.m || item.notes || '') : '',
                    global_product_id: !isCategoryMode && isEdit ? (stockDetails.n || item.n || '') : ''
                };

                contentElement.innerHTML = buildItemFormHTML(title, btnText, fd, isEdit, isCategoryMode, finalCategoryOptions, index);

                if (isEdit && fd.g) setTimeout(() => window.handleImageUrlInput(getGoogleDriveImageUrl(fd.g)), 500);

                modalInstance.show();

                window._uploadHandlersSetup = false;
                setTimeout(function () { setupAllUploadHandlers(); }, 500);

                if (!isCategoryMode) {
                    setTimeout(() => {
                        // For edit mode, use sold_in from stock details or fd
                        const soldInString = isEdit ? (fd.sold_in || stockDetails.l || item?.sold_in || '') : '';
                        initPricingItemsForEdit(soldInString);
                    }, 300);
                }

                const form = contentElement.querySelector('#cataPopItemForm');
                if (form) {
                    console.log('Form found, attaching submit handler. isEdit:', isEdit, 'isCategoryMode:', isCategoryMode);
                    form.onsubmit = async function (e) {
                        console.log('Form submit triggered!'); // ADD THIS DEBUG
                        e.preventDefault();
                        
                            if (isProcessing) return;
                            isProcessing = true;
                            const sb = this.querySelector('#cataPopSubmitBtn');
                            if (sb) { sb.disabled = true; sb.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Saving...'; }
                            try {
                                const fd2 = new FormData(this);
                                let nm = (fd2.get('e') || '').trim();

                                if (!nm && isEdit) {
                                    nm = item.e || '';
                                }
                                if (!nm) {
                                    if (typeof showToast === 'function') showToast((isCategoryMode ? 'Category' : 'Product') + ' name required', { type: 'error', duration: 2000 });
                                    isProcessing = false;
                                    if (sb) { sb.disabled = false; sb.innerHTML = '<i class="fas fa-save me-1"></i>' + btnText; }
                                    return;
                                }

                                // Image handling
                                const imageUrlInput = document.getElementById('cataPopImageUrlInput');
                                const finalImageInput = document.getElementById('cataPopFinalImageUrl');
                                const g1Input = document.getElementById('cataPopG1Input');
                                const g2Input = document.getElementById('cataPopG2Input');
                                const fileInput = document.getElementById('cataPopFileInput');
                                const urlInput = document.getElementById('cataPopImageUrlInput');

                                // Check if we have file upload or URL
                                const isFileUpload = fileInput && fileInput.files && fileInput.files.length > 0;
                                const isUrlInput = urlInput && urlInput.value && urlInput.value.trim() !== '';

                                let gValue = '';
                                let goValue = '';
                                let hoValue = '';

                                if (isFileUpload) {
                                    // File upload: g stays empty, g1 has display image, g2 has thumbnail
                                    gValue = '';
                                    goValue = g1Input ? (g1Input.value || '') : '';
                                    hoValue = g2Input ? (g2Input.value || '') : '';
                                    console.log('File upload mode - g1 length:', goValue.length, 'g2 length:', hoValue.length);
                                } else if (isUrlInput) {
                                    // URL input: g has URL, g1 has display, g2 has thumbnail
                                    const originalUrl = urlInput.value.trim();
                                    gValue = finalImageInput ? (finalImageInput.value || originalUrl) : originalUrl;

                                    // If g1/g2 are empty (processing failed), store the original URL in g1 as fallback
                                    goValue = g1Input ? (g1Input.value || originalUrl) : originalUrl;
                                    hoValue = g2Input ? (g2Input.value || originalUrl) : originalUrl;

                                    console.log('URL mode - g:', gValue.substring(0, 50), 'g1 length:', goValue.length, 'g2 length:', hoValue.length);
                                } else if (isEdit && fd.g) {
                                    // Edit mode: keep existing values
                                    gValue = fd.g || '';
                                    goValue = fd.g1 || fd.g || '';
                                    hoValue = fd.g2 || fd.g || '';
                                    console.log('Keep existing images - g:', gValue.substring(0, 50));
                                } else {
                                    // No image provided
                                    gValue = '';
                                    goValue = '';
                                    hoValue = '';
                                    console.log('No image provided');
                                }

                                // Build p object with proper image values
                                var p = {
                                    e: nm
                                };

                                // Only include image data for new items or if values changed
                                if (!isEdit) {
                                    p.g = gValue;
                                    p.g1 = goValue;
                                    p.g2 = hoValue;
                                } else {
                                    // For edit, only include if changed
                                    if (gValue && gValue !== fd.g) {
                                        p.g = gValue;
                                    }
                                    if (goValue && goValue !== fd.g1) {
                                        p.g1 = goValue;
                                    }
                                    if (hoValue && hoValue !== fd.g2) {
                                        p.g2 = hoValue;
                                    }
                                }

                                // Set category for non-category mode
                                if (!isCategoryMode) {
                                    p.f = fd2.get('f') || '0';
                                }

                                // For update, include the ID
                                if (isEdit && item && item.a) {
                                    p.a = item.a;
                                }

                                console.log('P object being sent:', {
                                    e: p.e,
                                    g: p.g ? p.g.substring(0, 30) + '...' : '(empty)',
                                    g1: p.g1 ? p.g1.substring(0, 30) + '...' : '(empty)',
                                    g2: p.g2 ? p.g2.substring(0, 30) + '...' : '(empty)',
                                    f: p.f,
                                    a: p.a
                                });
                                // Build new item object
                                const newItem = {
                                    a: isEdit && item ? item.a : (isCategoryMode ? getNextCategoryId() : getNextProductId()),
                                    b: fd2.get('b') || getCurrentDateTime(),
                                    c: fd2.get('c') || '0',
                                    d: fd2.get('d') || '0',
                                    e: nm,
                                    f: isCategoryMode ? "0" : (fd2.get('f') || '0'),
                                    g: gValue,
                                    h: gValue,
                                    g1: goValue,
                                    g2: hoValue
                                };

                                // Prepare payload
                                if (typeof payload0 !== 'undefined') {
                                    payload0.vw = 1;

                                    // For edit/update, use different endpoint and fn
                                    if (isEdit && !isCategoryMode) {
                                        payload0.fn = 82;
                                        // Don't send p for product updates - p is not needed for fn=82
                                        delete payload0.p; // Ensure p is removed if it exists from previous calls
                                    } else {
                                        payload0.p = p;
                                        payload0.fn = 72;
                                    }

                                    console.log('Submitting - isEdit:', isEdit, 'isCategoryMode:', isCategoryMode, 'fn:', payload0.fn);

                                    if (!isCategoryMode) {
                                        // Product mode: include S object
                                        const stockPartyId = document.getElementById('partyId')?.value || fd2.get('stock_party_id') || '';
                                        const billId = fd2.get('bill_id') || '0';
                                        const productId = fd2.get('product_id') || '0';
                                        const purchasePrice = parseFloat(fd2.get('purchase_price')) || 0;
                                        const quantityReceived = parseInt(fd2.get('quantity_received')) || 0;
                                        const salesPrice = parseFloat(fd2.get('sales_price')) || 0;
                                        const measuredInId = document.getElementById('measured_in_select')?.value || fd2.get('measured_in') || '';
                                        const soldIn = generateSoldInString();
                                        if (soldIn && soldIn.length > 256) {
                                            showToast('Sold in value is too long', { duration: 2000 });
                                            return;
                                        }
                                        const notes = fd2.get('notes') || '';
                                        const globalProductId = fd2.get('global_product_id') || '0';

                                        // For update, include S record ID
                                        let sRecordId = 0;
                                        if (isEdit && item && item.sid) {
                                            sRecordId = item.sid;
                                        }

                                        payload0.s = {
                                            e: parseInt(stockPartyId) || 0,
                                            f: parseInt(billId) || 0,
                                            g: parseInt(productId) || 0,
                                            h: purchasePrice,
                                            i: quantityReceived,
                                            j: parseInt(measuredInId) || 0,
                                            k: salesPrice,
                                            l: soldIn,
                                            m: notes || '',
                                            n: parseInt(globalProductId) || 0
                                        };

                                        // For update, include S record ID (stockDetails.a is the stock ID from s table)
                                        if (isEdit && stockDetails && stockDetails.a) {
                                            payload0.s.a = parseInt(stockDetails.a) || 0;
                                        }

                                        // Add product-specific fields to newItem
                                        newItem.stock_party_id = stockPartyId || '';
                                        newItem.stock_party_name = document.getElementById('c_dtls_party')?.value || '';
                                        newItem.bill_id = billId;
                                        newItem.product_id = productId;
                                        newItem.purchase_price = purchasePrice;
                                        newItem.quantity_received = quantityReceived;
                                        newItem.measured_in = measuredInId;
                                        newItem.sales_price = salesPrice;
                                        newItem.sold_in = soldIn;
                                        newItem.notes = notes;
                                        newItem.n = globalProductId;
                                        // Store S ID for update
                                        if (isEdit && item && item.sid) {
                                            newItem.sid = item.sid;
                                        }
                                    } else {
                                        // Category mode: S is minimal
                                        const quantityReceived = parseInt(fd2.get('quantity_received')) || 0;
                                        payload0.s = {
                                            e: 0, f: 0, g: 0, h: 0,
                                            i: quantityReceived,
                                            j: 0, k: 0, l: '', m: '', n: 0
                                        };
                                        newItem.f = quantityReceived;
                                    }
                                    if (!isCategoryMode) {
                                        p.f = fd2.get('f') || '0';
                                    }
                                    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
                                        { "tb": 'c', "col": 'b', "cl": "b" },
                                        { "tb": 'p', "col": 'b', "cl": "b" },
                                        { "tb": 's', "col": 'b', "cl": "b" }
                                    ]);
                                    payload0.drml = "sambodhisarang.in";

                                    console.log('Payload:', payload0);

                                    var _ldId = 'edpr_ld_' + Date.now();
                                    var _ldDiv = document.createElement('div');
                                    _ldDiv.id = _ldId;
                                    _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
                                    _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
                                    document.body.appendChild(_ldDiv);

                                    try {
                                        // Use different endpoint for updates
                                        const endpoint = (isEdit && !isCategoryMode) ? "https://my1.in/2/k.php" : "https://my1.in/2/i.php";
                                        const response = await fnj3(endpoint, payload0, 1, true, null, 20000, 0, 2, 1);
                                        var _ldEl = document.getElementById(_ldId);
                                        if (_ldEl) _ldEl.remove();

                                        // Check if response is successful
                                        if (response && response.su == 1) {
                                            if (!isCategoryMode) {
                                                handl_o_rspons(response, 1);
                                            }
                                            window.showsuccessmodal(response.ms || (isEdit ? 'Updated' : 'Saved'));

                                            // Save locally only on success
                                            if (isCategoryMode) {
                                                if (isEdit && index !== null) window.prod_cata[index] = newItem;
                                                else window.prod_cata.push(newItem);
                                            } else {
                                                if (isEdit && index !== null && window.prod_list[index]) {
                                                    window.prod_list[index] = { ...window.prod_list[index], ...newItem };
                                                } else {
                                                    window.prod_list.push(newItem);
                                                }
                                            }

                                            modalInstance.hide();
                                            refreshUI();
                                            if (typeof showToast === 'function') showToast(`"${nm}" ${isEdit ? 'updated' : 'added'}`, { type: 'success', duration: 2000 });
                                            //setTimeout(function () { location.reload(); }, 300);

                                        } else {
                                            // Re-enable submit button
                                            if (sb) { sb.disabled = false; sb.innerHTML = '<i class="fas fa-save me-1"></i>' + btnText; }
                                            isProcessing = false;
                                            // API returned error (su=0)
                                            window.showelsemodal(response?.ms || 'Failed to save. Please try again.');
                                            return;
                                        }

                                    } catch (apiErr) {
                                        var _ldEl4 = document.getElementById(_ldId);
                                        if (_ldEl4) _ldEl4.remove();
                                        // Re-enable submit button
                                        if (sb) { sb.disabled = false; sb.innerHTML = '<i class="fas fa-save me-1"></i>' + btnText; }
                                        isProcessing = false;
                                        window.showelsemodal(apiErr || '404');
                                        return;
                                    }
                                }

                            } catch (er) {
                                var _ldEl5 = document.getElementById(_ldId);
                                if (_ldEl5) _ldEl5.remove();
                                console.error(er);
                                if (typeof showToast === 'function') showToast('Error saving', { type: 'error', duration: 2000 });
                            }
                            finally {
                                isProcessing = false;
                                if (sb) {
                                    // Only re-enable if not already re-enabled by error flow
                                    if (!sb.disabled) {
                                        sb.disabled = false;
                                        sb.innerHTML = '<i class="fas fa-save me-1"></i>' + btnText;
                                    }
                                }
                            }
                        
                    };
                }
            })(); // END of loadCategories IIFE

        } catch (e) {
            console.error(e);
            isProcessing = false;
            if (typeof showToast === 'function') showToast('Error opening form', { type: 'error', duration: 2000 });
        }
    }

    function showCorsError(url) {
        for (let i = 1; i <= 3; i++) {
            const c = document.getElementById('cataPopImagePreviewContent' + i);
            const b = document.getElementById('cataPopImagePreviewBox' + i);
            if (c) {
                c.innerHTML = `
                <div class="text-center text-danger p-3">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <p class="mb-1 fw-bold">Unable to load image</p>
                    <p class="small mb-0">The image source is blocked by CORS policy or is not accessible.</p>
                    <p class="small text-muted mt-2">Try using a different image URL or upload a file instead.</p>
                </div>
            `;
            }
            if (b) {
                b.style.borderColor = '#dc3545';
                b.style.backgroundColor = '#fff5f5';
            }
        }

        for (let i = 1; i <= 3; i++) {
            const d = document.getElementById('cataPopImageDetails' + i);
            if (d) d.style.display = 'none';
        }

        const finalImageInput = document.getElementById('cataPopFinalImageUrl');
        const g1Input = document.getElementById('cataPopG1Input');
        const g2Input = document.getElementById('cataPopG2Input');
        // In the handleImageUrlInput function, make sure these are working:
        if (finalImageInput) {
            finalImageInput.value = url; // or displayImageData for file upload
            console.log('Set finalImageInput to:', url ? url.substring(0, 30) + '...' : 'empty');
        }
        if (g1Input) {
            g1Input.value = finalImageInput ? finalImageInput.value : '';
        }
        if (g2Input) {
            g2Input.value = finalImageInput ? finalImageInput.value : '';
        }

        if (typeof showToast === 'function') {
            showToast('Unable to load image. The source may be blocked by CORS.', {
                type: 'error',
                duration: 4000
            });
        }
    }

    function buildItemFormHTML(title, btnText, fd, isEdit, isCategoryMode, categoryOptions, itemIndex) {
        const limits = getImageLimits();
        return `
    <div class="p-2">
        <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h5 class="mb-0">
                <i class="fas ${isEdit ? 'fa-edit' : 'fa-plus-circle'} me-2 text-primary"></i>${title}
            </h5>
        </div>
        
        <form id="cataPopItemForm">
            <h6 class="text-primary mb-2"><i class="fas ${isCategoryMode ? 'fa-folder' : 'fa-box'} me-2"></i>${isCategoryMode ? 'Category' : 'Product'} Information</h6>
            
            <div class="row g-2 mb-3 inputbox2">
    <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
            <label class="form-label fw-bold small mb-1">${isCategoryMode ? 'Category' : 'Product'} Name <span class="text-danger">*</span></label>
            ${isEdit && !isCategoryMode ? `
            <button type="button" class="btn btn-sm btn-primary me-1" onclick="(async () => { await loadExe2Fn(27, [], [1]); window.showUpdateProduct('${fd.a}'); })();" title="Update Product">
                <i class="fas fa-pen me-1"></i>Product
            </button>
            <button type="button" class="btn btn-sm btn-danger" onclick="window.deleteProductItem('product', ${itemIndex}, '${(fd.e || 'Unnamed').replace(/'/g, "\\'")}');">
                <i class="fas fa-trash"></i>
            </button>
            ` : ''}
        </div>
        <input type="text" name="e" class="form-control inputbox form-control-sm" 
               value="${fd.e}" placeholder="Enter ${isCategoryMode ? 'category' : 'product'} name" 
               ${isEdit ? 'readonly disabled' : ''} 
               style="${isEdit ? 'background-color:#e9ecef;cursor:not-allowed;' : ''}" 
               required>
        ${isEdit ? '<small class="text-muted d-block">Name cannot be changed in edit mode</small>' : ''}
    </div>
    ${isCategoryMode ? `
    <div class="col-sm-6">
        <label class="form-label fw-bold small mb-1">Item Count</label>
        <input type="number" name="quantity_received" class="form-control inputbox form-control-sm" 
               value="${fd.quantity_received || fd.f || 0}" placeholder="Number of items" min="0">
        <small class="text-muted">Total items in this category</small>
    </div>` : ''}
</div>
            
            ${!isCategoryMode && !isEdit ? `
            <div class="mb-3 inputbox2">
                <label class="form-label fw-bold small mb-1">Category </label>
                <select name="f" class="form-select inputbox form-select-sm">
                    <option value="">Select Category</option>
                    ${categoryOptions}
                </select>
            </div>` : ''}
            ${!isCategoryMode && isEdit ? `
            <input type="hidden" name="f" value="${fd.f}">
            <div class="mb-3 inputbox2">
                <label class="form-label fw-bold small mb-1">Category</label>
                <input type="text" class="form-control inputbox form-control-sm" 
                       value="${categoryOptions.match(new RegExp('value=\"' + fd.f + '\"[^>]*>([^<]*)'))?.[1] || fd.f}" 
                       readonly disabled style="background-color:#e9ecef;cursor:not-allowed;">
                <small class="text-muted d-block">Category cannot be changed in edit mode</small>
            </div>
            ` : ''}
            
            <!-- Image Section -->
            ${!isEdit ? `
            <div class="mb-3 inputbox2">
                <label class="form-label fw-bold small mb-1">${isCategoryMode ? 'Category' : 'Product'} Image</label>
                <ul class="nav nav-pills mb-2" id="inputTabs" role="tablist" style="font-size: 12px;">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="url-tab" data-bs-toggle="pill" data-bs-target="#urlTab" type="button" role="tab">
                            <i class="fas fa-link me-1"></i>Image URL
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="upload-tab" data-bs-toggle="pill" data-bs-target="#uploadTab" type="button" role="tab">
                            <i class="fas fa-cloud-upload-alt me-1"></i>Upload File
                        </button>
                    </li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="urlTab" role="tabpanel">
                        <input type="url" name="h" id="cataPopImageUrlInput" 
                               class="form-control inputbox form-control-sm" 
                               value="${fd.g}" placeholder="https://example.com/image.jpg" 
                               oninput="if(this.value && !this.value.startsWith('data:')) { window.handleImageUrlInput(this.value); }">
                    </div>
                    <div class="tab-pane fade" id="uploadTab" role="tabpanel">
                        <input type="file" id="cataPopFileInput" accept="image/*" style="display: none;" onchange="window.handleFileUpload(this)">
                        <div class="border rounded p-3 text-center bg-light upload-zone" style="border-style: dashed !important;">
                            <div id="uploadZone">
                                <button type="button" class="btn btn-outline-primary" id="browseBtn">
                                    <i class="fas fa-folder-open me-2"></i>Browse Files
                                </button>
                                <p class="text-muted small mt-1 mb-0">or drag & drop image here</p>
                            </div>
                            <div id="fileInfo" style="display: none;">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-file-image text-primary me-2" style="font-size: 24px;"></i>
                                        <div class="text-start">
                                            <span id="fileName" class="fw-bold small"></span><br>
                                            <span id="fileSize" class="text-muted" style="font-size: 11px;"></span>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-outline-danger" id="removeFileBtn"><i class="fas fa-times"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <input type="hidden" id="cataPopFinalImageUrl" value="${fd.g}">
                <input type="hidden" id="cataPopG1Input" value="">
                <input type="hidden" id="cataPopG2Input" value="">
            </div>
            ` : `
            <!-- Hidden image fields for edit mode -->
            <input type="hidden" id="cataPopFinalImageUrl" value="${fd.g || ''}">
            <input type="hidden" id="cataPopG1Input" value="${fd.g1 || ''}">
            <input type="hidden" id="cataPopG2Input" value="${fd.g2 || ''}">
            <input type="hidden" name="h" value="${fd.g || ''}">
            `}
            
            <!-- Image Previews - Show for both new and edit -->
            <div class="mb-2 inputbox2">
                <h6 class="fw-bold small mb-1" id="originalImageHeader"><i class="fas fa-image me-1 text-primary"></i>Original Image</h6>
                <div id="cataPopImagePreviewBox1" class="border rounded p-2 bg-light text-center" style="min-height:140px;max-height:200px;overflow:hidden;border:2px dashed #000000bd !important">
                    <div id="cataPopImagePreviewContent1" class="text-muted small py-3">
                        ${fd.g ? `<img src="${getGoogleDriveImageUrl(fd.g) || window.PLACEHOLDER_IMG}" class="rounded" style="max-width:100%;max-height:200px;object-fit:contain;" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image fa-2x mb-1 d-block\\' style=\\'opacity:0.4\\'></i><span>Original image preview</span>'">` : `<i class="fas fa-image fa-2x mb-1 d-block" style="opacity:0.4"></i><span>Original image preview</span>`}
                    </div>
                </div>
                <div id="cataPopImageDetails1" class="small text-muted mt-1" style="display:none;font-size:11px;"></div>
            </div>
            <div class="mb-2 inputbox2">
                <h6 class="fw-bold small mb-1" id="displayImageHeader"><i class="fas fa-desktop me-1 text-success"></i>Display Size (${limits.prodDispMaxWidth}px / max-size: ${limits.prodDispMaxSize}KB)</h6>
                <div id="cataPopImagePreviewBox2" class="border rounded p-2 bg-light text-center" style="min-height:140px;max-height:200px;overflow:hidden;border:2px dashed #000000bd !important">
                    <div id="cataPopImagePreviewContent2" class="text-muted small py-3">
                        ${fd.g ? `<img src="${getGoogleDriveImageUrl(fd.g) || window.PLACEHOLDER_IMG}" class="rounded" style="max-width:100%;max-height:200px;object-fit:contain;" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-desktop fa-2x mb-1 d-block\\' style=\\'opacity:0.4\\'></i><span>Display size preview</span>'">` : `<i class="fas fa-desktop fa-2x mb-1 d-block" style="opacity:0.4"></i><span>Display size preview</span>`}
                    </div>
                </div>
                <div id="cataPopImageDetails2" class="small text-muted mt-1" style="display:none;font-size:11px;"></div>
            </div>
            <div class="mb-2 inputbox2">
                <h6 class="fw-bold small mb-1" id="thumbnailImageHeader"><i class="fas fa-th me-1 text-warning"></i>Thumbnail (${limits.prodThmpMaxWidth}px / max-size: ${limits.prodThmpMaxSize}KB)</h6>
                <div id="cataPopImagePreviewBox3" class="border rounded p-2 bg-light text-center" style="min-height:140px;max-height:200px;overflow:hidden;border:2px dashed #000000bd !important">
                    <div id="cataPopImagePreviewContent3" class="text-muted small py-3">
                        ${fd.g ? `<img src="${getGoogleDriveImageUrl(fd.g) || window.PLACEHOLDER_IMG}" class="rounded" style="max-width:100%;max-height:200px;object-fit:contain;" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-th fa-2x mb-1 d-block\\' style=\\'opacity:0.4\\'></i><span>Thumbnail preview</span>'">` : `<i class="fas fa-th fa-2x mb-1 d-block" style="opacity:0.4"></i><span>Thumbnail preview</span>`}
                    </div>
                </div>
                <div id="cataPopImageDetails3" class="small text-muted mt-1" style="display:none;font-size:11px;"></div>
            </div>
            
            ${!isCategoryMode ? `
            <hr>
            <h6 class="text-success mb-2"><i class="fas fa-truck me-2"></i>Stock & Party Details</h6>
            <div class="row g-2 mb-3 inputbox2">
                <div class="col-12">
                    <label class="form-label fw-bold small mb-1">Party (From whom received)</label>
                    <input id="c_dtls_party" name="stock_party_id" class="form-control inputbox form-control-sm" 
                        readonly onclick="(async () => { await loadExe2Fn(22, ['no-loader-element', 1, 'modalContentForEntInd', 'commonFnToRunAfter_op_ViewCall', 1], [1]); })()" 
                        placeholder="Click to select Party" value="${fd.stock_party_name || ''}">
                    <input type="hidden" id="partyId" value="${fd.stock_party_id || ''}">
                    <div id="dv_for_add_itm_btn" style="display:${fd.stock_party_id ? 'block' : 'none'};margin-top:5px;">
                        <small class="text-success"><i class="fas fa-check-circle"></i> Party selected</small>
                    </div>
                </div>
            </div>
            <div class="row g-2 mb-2">
                <div class="col-sm-4 inputbox2">
                    <label class="form-label fw-bold small mb-1">Purchase Price</label>
                    <input type="text" oninput="window.allowFloat(this,2)" name="purchase_price" class="form-control inputbox form-control-sm" 
                        value="${fd.purchase_price && fd.purchase_price != 0 ? fd.purchase_price : ''}" placeholder="" step="0.01">
                </div>
                <div class="col-sm-4 inputbox2">
                    <label class="form-label fw-bold small mb-1">Sales Price</label>
                    <input type="text" oninput="window.allowFloat(this,2)" autocorrect="off" name="sales_price" class="form-control inputbox form-control-sm" 
                        value="${fd.sales_price && fd.sales_price != 0 ? fd.sales_price : ''}" placeholder="" step="0.01" required>
                </div>
                <div class="col-sm-4 inputbox2">
                    <label class="form-label fw-bold small mb-1">Quantity Received</label>
                    <input type="text" oninput="this.value=this.value.replace(/[^0-9]/g,'').slice(0,7)" autocorrect="off" name="quantity_received" class="form-control inputbox form-control-sm" 
                        value="${fd.quantity_received && fd.quantity_received != 0 ? fd.quantity_received : ''}" placeholder="" required>
                </div>
            </div>
            <div class="row g-2 mb-3 inputbox2">
                <div class="col-12">
                    <label class="form-label fw-bold small mb-1">Sold In - Pricing Items</label>
                    <div id="pricingItemsContainer"></div>
                    <div id="soldInPreview" class="mt-2" style="display:none;">
                        <small class="text-success"><i class="fas fa-code me-1"></i>Generated: <span id="soldInPreviewText" style="font-family:monospace;font-size:12px;"></span></small>
                    </div>
                </div>
            </div>
            <div class="row g-2 mb-3 inputbox2">
                <div class="col-12">
                    <label class="form-label fw-bold small mb-1">Notes</label>
                    <textarea name="notes" class="form-control inputbox form-control-sm" rows="2" 
                              placeholder="Enter any additional notes">${fd.notes}</textarea>
                </div>
            </div>
            ` : ''}
            
            <input type="hidden" name="a" value="${fd.a}">
            <input type="hidden" name="b" value="${fd.b}">
            <input type="hidden" name="c" value="${fd.c}">
            <input type="hidden" name="d" value="${fd.d}">
            
            <div class="d-flex justify-content-end gap-2 pt-2 border-top mt-2">
                <button type="button" class="btn btn-sm btn-secondary" data-fp-close="1">
                    <i class="fas fa-times me-1"></i>Cancel
                </button>
                <button type="submit" class="btn btn-sm btn-primary" id="cataPopSubmitBtn">
                    <i class="fas fa-save me-1"></i>${btnText}
                </button>
            </div>
        </form>
    </div>`;
    }

    function showProductList(mode = 'product') {
        isCategoryMode = (mode === 'category');
        try {
            const modalId = 'cataPopEdProdListModal_' + Date.now();
            if (typeof create_fullpage_view !== 'function') {
                if (typeof showToast === 'function') showToast('View system not available');
                return;
            }
            const modalResult = create_fullpage_view(modalId);
            if (!modalResult) {
                if (typeof showToast === 'function') showToast('Failed to create view');
                return;
            }
            const { contentElement, modalInstance, modalElement } = modalResult;
            _fpListModalId = modalId;

            contentElement.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading ${mode}s...</p></div>`;

            (async () => {
                try {
                    const html = await buildProductListHTML(mode);
                    contentElement.innerHTML = html;
                    modalInstance.show();
                    window._uploadHandlersSetup = false;
                    setTimeout(function () { setupAllUploadHandlers(); }, 500);
                    attachListEventHandlers(contentElement, modalInstance, mode);
                } catch (err) {
                    console.error('Error building list:', err);
                    contentElement.innerHTML = `<div class="alert alert-danger m-3">Error loading ${mode}s: ${err.message}</div>`;
                    modalInstance.show();
                }
            })();

        } catch (error) {
            console.error('Error:', error);
            if (typeof showToast === 'function') showToast('Error loading list', { type: 'error', duration: 2000 });
        }
    }

    function setModalHeightAndPreventScroll(modalElement) {
        if (!modalElement) return;
        setTimeout(function () {
            const modalDialog = modalElement.querySelector('.modal-dialog');
            const modalContent = modalElement.querySelector('.modal-content');
            const modalBody = modalElement.querySelector('.modal-body');
            if (modalDialog) { modalDialog.style.maxHeight = '95vh'; modalDialog.style.marginTop = '60px'; modalDialog.style.marginBottom = '20px'; }
            if (modalContent) { modalContent.style.maxHeight = '90vh'; modalContent.style.height = '80vh'; modalContent.style.overflow = 'auto'; }
            if (modalBody) { modalBody.style.maxHeight = 'calc(90vh - 120px)'; modalBody.style.height = 'calc(80vh - 120px)'; modalBody.style.overflow = 'auto'; modalBody.style.padding = '15px 20px'; }
        }, 100);
    }

    async function buildProductListHTML(mode) {
        const isCatMode = (mode === 'category');
        const itemLabel = isCatMode ? 'Categories' : 'Products';
        const itemIcon = isCatMode ? 'fa-folder' : 'fa-box';
        const addBtnId = isCatMode ? 'cataPopAddCategoryBtn' : 'cataPopAddProductBtn';
        const editAction = isCatMode ? 'edit-category' : 'edit-product';
        const deleteAction = isCatMode ? 'delete-category' : 'delete-product';
        const titleIcon = isCatMode ? 'fa-folder' : 'fa-boxes';
        const titleText = isCatMode ? 'Manage Categories' : 'Manage Products';
        const targetMode = isCatMode ? 'category' : 'product';

        let categories = [];
        let products_stock = [];
        let products = [];

        try {
            if (typeof dbDexieManager !== 'undefined') {
                try {
                    products = await dbDexieManager.getAllRecords(dbnm, 'p');
                    products_stock = await dbDexieManager.getAllRecords(dbnm, 's');
                } catch (e) {
                    console.warn('Error fetching products from IndexedDB:', e);
                }
            }
        } catch (e) {
            console.warn('Error accessing IndexedDB, falling back to window variables:', e);
        }
        console.log('Products loaded:', products.length);

        window.prod_list = products;
        window.prod_stock = products_stock;

        const items = products;

        let itemsHTML = '';
        if (!items || items.length === 0) {
            itemsHTML = `<div class="text-center py-3 text-muted">
            <i class="fas ${itemIcon}-open fa-2x mb-2 text-secondary"></i>
            <p class="mb-0 small">No ${itemLabel.toLowerCase()} found</p>
            <p class="text-muted small">Try adding a new ${isCatMode ? 'category' : 'product'} or check your data</p>
        </div>`;
        } else {
            items.forEach((p, i) => {
                const img = getGoogleDriveImageUrl(p.g) || p.h || PLACEHOLDER_IMG;

                let subInfo = '';
                const category = categories.find(c => String(c.a) === String(p.f));
                const catName = category?.e || 'Uncategorized';
                const price = p.k || p.sales_price || '0';
                subInfo = `${catName} | ₹${price}`;

                const hasStockForProduct = products_stock.some(s => String(s.g) === String(p.a));

                itemsHTML += `<div class="card mb-2 border-0 shadow-sm">
                <div class="card-body d-flex align-items-center gap-3 p-3">
                    <img src="${img}" alt="${p.e}" class="rounded" style="width:50px;height:50px;object-fit:cover" onerror="this.src='${PLACEHOLDER_IMG}'">
                    <div class="flex-grow-1">
                        <div class="fw-bold">${p.e || 'Unnamed'}</div>
                        <div class="small text-muted">ID: ${p.a}</div>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-primary" onclick="window.editProductItem('${targetMode}', ${i});">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${hasStockForProduct ? `<button class="btn btn-sm btn-danger" onclick="window.deleteProductStock('${targetMode}', ${i}, '${(p.e || 'Unnamed').replace(/'/g, "\\'")}');"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                </div>
            </div>`;
            });
        }

        return `
        <div>
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <h5 class="mb-0"><i class="fas ${titleIcon} me-2 text-primary"></i>${titleText}</h5>
                <button class="btn btn-sm btn-outline-primary" id="cataPopRefreshBtn" title="Refresh list" onclick="refreshEd_prods()">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
            <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0 text-${isCatMode ? 'primary' : 'success'}"><i class="fas ${itemIcon} me-2"></i>${itemLabel} <small class="text-muted">(${items.length})</small></h6>
                    <button class="btn btn-success btn-sm" id="${addBtnId}">
                        <i class="fas fa-plus me-1"></i>Add ${isCatMode ? 'Category' : 'Product'}
                    </button>
                </div>
                <div style="max-height:60vh;overflow-y:auto">${itemsHTML}</div>
            </div>
        </div>`;
    }

    function refreshEd_prods(){
        if (_fpListModalId) {
            var el = document.getElementById(_fpListModalId);
            if (el) {
                var idx = (window._fpNavStack || []).indexOf(_fpListModalId);
                if (idx >= 0) window._fpNavStack.splice(idx, 1);
                el.dispatchEvent(new Event('fp-close'));
                el.remove();
            }
            _fpListModalId = null;
        }
        (async () => { await loadExe2Fn(17, ['product'], [1]); })();
    }

    function getGoogleDriveImageUrl(value, thumbnail = false) {
        if (!value) return '';

        value = String(value).trim();

        if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
            return value;
        }

        const parts = value.split(/\s+/);

        if (/^[A-Za-z0-9_-]{20,}$/.test(parts[0])) {
            const fileId = (thumbnail && parts[1]) ? parts[1] : parts[0];
            return `https://lh3.googleusercontent.com/d/${fileId}=s0?authuser=0`;
        }

        return '';
    }

    function attachListEventHandlers(el, mi, mode) {
        const isCatMode = (mode === 'category');
        const addBtnId = isCatMode ? 'cataPopAddCategoryBtn' : 'cataPopAddProductBtn';
        const targetMode = isCatMode ? 'category' : 'product';

        setTimeout(() => {
            const addBtn = el.querySelector('#' + addBtnId);
            if (addBtn) {
                const newBtn = addBtn.cloneNode(true);
                addBtn.parentNode.replaceChild(newBtn, addBtn);
                newBtn.addEventListener('click', function (e) {
                    e.preventDefault(); e.stopPropagation();
                    showItemForm(targetMode, null, null);
                });
            }

            const refreshBtn = el.querySelector('#cataPopRefreshBtn');
            if (refreshBtn) {
                const newRefreshBtn = refreshBtn.cloneNode(true);
                refreshBtn.parentNode.replaceChild(newRefreshBtn, refreshBtn);
                newRefreshBtn.addEventListener('click', async function (e) {
                    e.preventDefault();
                    await window.withRefreshAnimation(this, async function () {
                        const html = await buildProductListHTML(mode);
                        el.innerHTML = html;
                        attachListEventHandlers(el, mi, mode);
                    });
                    if (typeof showToast === 'function') showToast('Refreshed', { type: 'info', duration: 1000 });
                });
            }
        }, 100);
    }

    window.editProductItem = function (mode, index) {
        const dataArray = mode === 'category' ? 'prod_cata' : 'prod_list';
        const p = window[dataArray] && window[dataArray][index];
        console.log('editProductItem called - mode:', mode, 'index:', index, 'product:', p);
        if (p) {
            // show() will hide previous fullpage view via nav stack
            showItemForm(mode, p, index);
        }
    };

    // Delete product stock from s table
    window.deleteProductStock = async function (mode, index, name) {
        const isCatMode = (mode === 'category');
        if (isCatMode) {
            if (typeof showToast === 'function') showToast('Cannot delete stock for category', { type: 'warning', duration: 2000 });
            return;
        }

        const p = window.prod_list && window.prod_list[index];
        if (!p) {
            if (typeof showToast === 'function') showToast('Product not found', { type: 'error', duration: 2000 });
            return;
        }

        // Get stock ID - check multiple possible locations
        let stockId = null;

        if (p.S && p.S.a) {
            stockId = p.S.a;
        } else if (p.sid) {
            stockId = p.sid;
        } else {
            const stockRecords = window.prod_stock || [];
            const stockRecord = stockRecords.find(s => String(s.g) === String(p.a));
            if (stockRecord) {
                stockId = stockRecord.a;
            }
        }

        if (!stockId) {
            window.showelsemodal('Stock record not found for this product');
            return;
        }

        console.log('deleteProductStock called - product:', p.e, 'stockId:', stockId);

        // Show confirmation modal
        if (typeof create_modal_dynamically === 'function') {
            const confirmModalId = 'confirmDeleteStock_' + Date.now();
            const confirmResult = create_modal_dynamically(confirmModalId);

            if (confirmResult) {
                const { contentElement: confirmContent, modalInstance: confirmInstance, modalElement: confirmElement } = confirmResult;

                setTimeout(() => {
                    const d = confirmElement.querySelector('.modal-dialog');
                    if (d) { d.style.marginTop = '80px'; d.style.maxWidth = 'auto'; }
                }, 50);

                confirmContent.innerHTML = `
                <div class="p-4 text-center">
                    <div class="mb-3">
                        <i class="fas fa-exclamation-triangle text-danger" style="font-size:48px;"></i>
                    </div>
                    <h5 class="text-danger">Delete Stock</h5>
                    <p class="text-muted mb-1">Are you sure you want to delete stock for:</p>
                    <p class="fw-bold mb-1">"${(p.e || name).replace(/'/g, "&#39;")}"</p>
                    <p class="small text-muted mb-3">Stock ID: ${stockId}</p>
                    <p class="small text-danger mb-3">This action cannot be undone.</p>
                    <div class="d-flex justify-content-center gap-2 pt-2 border-top">
                        <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i>Cancel
                        </button>
                        <button class="btn btn-danger btn-sm" id="confirmDeleteStockBtn_${confirmModalId}">
                            <i class="fas fa-trash me-1"></i>Delete Stock
                        </button>
                    </div>
                </div>`;

                confirmInstance.show();

                // Attach delete handler
                document.getElementById('confirmDeleteStockBtn_' + confirmModalId).addEventListener('click', async function () {
                    confirmInstance.hide();
                    await executeDeleteStock(stockId, p.e || name, mode, index);
                });
            }
        }
    };

    // Execute stock deletion after confirmation
    async function executeDeleteStock(stockId, productName, mode, index) {
        if (parseInt(stockId) === 0) { window.showelsemodal("Stock ID not be 0"); return; }
        if (typeof payload0 === 'undefined') {
            if (typeof showToast === 'function') showToast('System error. Please try again.', { type: 'error', duration: 2000 });
            return;
        }

        try {
            payload0.vw = 1;
            payload0.fn = 86;
            payload0.x1 = "s";
            payload0.x2 = parseInt(stockId);

            console.log('Delete stock payload:', payload0);

            var _ldId = 'edst_ld_' + Date.now();
            var _ldDiv = document.createElement('div');
            _ldDiv.id = _ldId;
            _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
            _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
            document.body.appendChild(_ldDiv);

            const response = await fnj3("https://my1.in/2/l.php", payload0, 1, true, null, 20000, 0, 2, 1);
            var _ldEl = document.getElementById(_ldId);
            if (_ldEl) _ldEl.remove();

            if (response && response.su == 1) {
                const deletedCount = await deleteStockFromDB([{ a: stockId }]);

                // Update in-memory prod_stock to remove deleted record
                if (window.prod_stock && window.prod_stock.length > 0) {
                    window.prod_stock = window.prod_stock.filter(function (s) {
                        return String(s.a) !== String(stockId);
                    });
                }

                // Rebuild PRODUCT_MAP from updated prod_stock so hasStock check works
                if (typeof refreshProductsCache === 'function') {
                    await refreshProductsCache(window.prod_cata, window.prod_stock);
                }

                window.showsuccessmodal("Deleted Successfully: " + deletedCount);

                const fpEl = _fpListModalId ? document.getElementById(_fpListModalId) : null;
                if (fpEl) {
                    const modalBody = fpEl.querySelector('.modal-body');
                    if (modalBody) {
                        const html = await buildProductListHTML(mode);
                        modalBody.innerHTML = html;
                        attachListEventHandlers(modalBody, null, mode);
                    }
                }

                refreshUI();
            } else {
                window.showelsemodal(response?.ms || 'Failed to delete stock. Please try again.');
            }
        } catch (error) {
            var _ldEl2 = document.getElementById(_ldId);
            if (_ldEl2) _ldEl2.remove();
            window.showelsemodal(error || 'Network Error: 500/404');
        }
    }

    // Delete product from p table
    window.deleteProductItem = async function (mode, index, name) {
        const isCatMode = (mode === 'category');
        const dataArray = isCatMode ? 'prod_cata' : 'prod_list';
        const p = window[dataArray] && window[dataArray][index];

        console.log('deleteProductItem called - mode:', mode, 'index:', index, 'name:', name);

        if (!p) {
            if (typeof showToast === 'function') showToast('Product not found', { type: 'error', duration: 2000 });
            return;
        }

        const productId = p.a;
        const productName = p.e || name;

        // For products (not categories), check if stock exists first
        if (!isCatMode) {
            const stockRecords = window.prod_stock || [];

            // Check if any stock records exist for this product
            let hasStock = stockRecords.some(s => String(s.g) === String(productId));

            // Also check in PRODUCT_MAP
            if (!hasStock && window.PRODUCT_MAP) {
                for (const key in window.PRODUCT_MAP) {
                    const prod = window.PRODUCT_MAP[key];
                    if (prod.pid && String(prod.pid) === String(productId) && prod.S) {
                        hasStock = true;
                        break;
                    }
                }
            }

            if (hasStock) {
                // Show modal: Cannot delete product - stock exists
                if (typeof create_modal_dynamically === 'function') {
                    const warnModalId = 'warnDeleteProduct_' + Date.now();
                    const warnResult = create_modal_dynamically(warnModalId);
                    if (warnResult) {
                        const { contentElement: warnContent, modalInstance: warnInstance, modalElement: warnElement } = warnResult;
                        setTimeout(() => {
                            const d = warnElement.querySelector('.modal-dialog');
                            if (d) { d.style.marginTop = '80px'; d.style.maxWidth = 'auto'; }
                        }, 50);
                        warnContent.innerHTML = `
                        <div class="p-4 text-center">
                            <div class="mb-3">
                                <i class="fas fa-exclamation-triangle text-warning" style="font-size:48px;"></i>
                            </div>
                            <h5 class="text-warning">Cannot Delete Product</h5>
                            <p class="text-muted mb-1">Please delete all stock records first for:</p>
                            <p class="fw-bold mb-3">"${productName.replace(/'/g, "&#39;")}"</p>
                            <p class="small text-muted mb-3">Product ID: ${productId}</p>
                            <div class="d-flex justify-content-center gap-2 pt-2 border-top">
                                <button class="btn btn-primary btn-sm" data-bs-dismiss="modal">
                                    <i class="fas fa-check me-1"></i>OK
                                </button>
                            </div>
                        </div>`;
                        warnInstance.show();
                    }
                } else {
                    if (typeof showToast === 'function') {
                        showToast('Cannot delete product. Please delete its stock first.', { type: 'warning', duration: 3000 });
                    }
                }
                return;
            }
        }

        // Show confirmation modal
        if (typeof create_modal_dynamically === 'function') {
            const confirmModalId = 'confirmDeleteProduct_' + Date.now();
            const confirmResult = create_modal_dynamically(confirmModalId);

            if (confirmResult) {
                const { contentElement: confirmContent, modalInstance: confirmInstance, modalElement: confirmElement } = confirmResult;

                setTimeout(() => {
                    const d = confirmElement.querySelector('.modal-dialog');
                    if (d) { d.style.marginTop = '80px'; d.style.maxWidth = 'auto'; }
                }, 50);

                confirmContent.innerHTML = `
                <div class="p-4 text-center">
                    <div class="mb-3">
                        <i class="fas fa-exclamation-triangle text-danger" style="font-size:48px;"></i>
                    </div>
                    <h5 class="text-danger">Delete ${isCatMode ? 'Category' : 'Product'}</h5>
                    <p class="text-muted mb-1">Are you sure you want to delete this ${isCatMode ? 'category' : 'product'}?</p>
                    <p class="fw-bold mb-1">"${productName.replace(/'/g, "&#39;")}"</p>
                    <p class="small text-muted mb-3">ID: ${productId}</p>
                    <p class="small text-danger mb-3">This action cannot be undone.</p>
                    <div class="d-flex justify-content-center gap-2 pt-2 border-top">
                        <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i>Cancel
                        </button>
                        <button class="btn btn-danger btn-sm" id="confirmDeleteProductBtn_${confirmModalId}">
                            <i class="fas fa-trash me-1"></i>Delete ${isCatMode ? 'Category' : 'Product'}
                        </button>
                    </div>
                </div>`;

                confirmInstance.show();

                // Attach delete handler
                document.getElementById('confirmDeleteProductBtn_' + confirmModalId).addEventListener('click', async function () {
                    confirmInstance.hide();
                    await executeDeleteProduct(productId, productName, mode, index, isCatMode, dataArray);
                });
            }
        }
    };

    // Execute product deletion after confirmation
    async function executeDeleteProduct(productId, productName, mode, index, isCatMode, dataArray) {
        if (parseInt(productId) === 0) { window.showelsemodal("Product ID not be 0"); return; }
        if (typeof payload0 === 'undefined') {
            if (typeof showToast === 'function') showToast('System error. Please try again.', { type: 'error', duration: 2000 });
            return;
        }

        try {
            payload0.vw = 1;
            payload0.fn = 86;
            payload0.x1 = "p";
            payload0.x2 = parseInt(productId);

            console.log('Delete product payload:', payload0);

            var _ldId = 'edprd_ld_' + Date.now();
            var _ldDiv = document.createElement('div');
            _ldDiv.id = _ldId;
            _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
            _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
            document.body.appendChild(_ldDiv);

            const response = await fnj3("https://my1.in/2/l.php", payload0, 1, true, null, 20000, 0, 2, 1);
            var _ldEl = document.getElementById(_ldId);
            if (_ldEl) _ldEl.remove();

            if (response && response.su == 1) {

                const deletedCount = await deleteProductFromDB([{ a: productId }]);
                window.showsuccessmodal("Deleted Successfully: " + deletedCount);

                const fpEl = _fpListModalId ? document.getElementById(_fpListModalId) : null;
                if (fpEl) {
                    const modalBody = fpEl.querySelector('.modal-body');
                    if (modalBody) {
                        const html = await buildProductListHTML(mode);
                        modalBody.innerHTML = html;
                        attachListEventHandlers(modalBody, null, mode);
                    }
                }

                refreshUI();
                setTimeout(function () { location.reload(); }, 500);
            } else {
                window.showelsemodal(response?.ms || 'Failed to delete. Please try again.');
            }
        } catch (error) {
            var _ldEl2 = document.getElementById(_ldId);
            if (_ldEl2) _ldEl2.remove();
            window.showelsemodal(error || 'Network Error: 500/404');
        }
    }

    window.handleImageUrlInput = async function (url, prefix) {
        prefix = prefix || '';

        if (!url || !url.trim()) {
            clearAllPreviews(prefix);
            return;
        }
        showLoadingInAllBoxes(prefix);

        try {
            const result = await imageProcessor.processImage(url);
            const limits = getImageLimits();
            const displayImageData = result.display.dataUrl;
            const thumbnailImageData = result.thumbnail.dataUrl;

            const fileInput = document.getElementById(prefix + 'CataPopFileInput') || document.getElementById('cataPopFileInput');
            const isFileUploadContext = fileInput && fileInput.files && fileInput.files.length > 0;

            const finalImageInput = document.getElementById(prefix + 'CataPopFinalImageUrl') || document.getElementById('cataPopFinalImageUrl');
            const urlInputEl = document.getElementById(prefix + 'CataPopImageUrlInput') || document.getElementById('cataPopImageUrlInput');
            const g1Input = document.getElementById(prefix + 'CataPopG1Input') || document.getElementById('cataPopG1Input');
            const g2Input = document.getElementById(prefix + 'CataPopG2Input') || document.getElementById('cataPopG2Input');

            if (isFileUploadContext) {
                if (finalImageInput) finalImageInput.value = '';
                if (g1Input) g1Input.value = displayImageData;
                if (g2Input) g2Input.value = thumbnailImageData;
                console.log('File upload - Set g1 (display) length:', displayImageData.length, 'g2 (thumbnail) length:', thumbnailImageData.length);
            } else {
                // URL input
                if (finalImageInput) finalImageInput.value = url;
                if (g1Input) g1Input.value = displayImageData;
                if (g2Input) g2Input.value = thumbnailImageData;
                if (urlInputEl) urlInputEl.value = url;
                console.log('URL input - Set g:', url.substring(0, 50), 'g1 length:', displayImageData.length, 'g2 length:', thumbnailImageData.length);
            }

            updatePreviewBox(1, { dataUrl: result.original.dataUrl, width: result.original.details.width, height: result.original.details.height, size: result.original.details.size, sizeInBytes: result.original.details.sizeInBytes }, 'Original', false, prefix);
            updatePreviewBox(2, { dataUrl: result.display.dataUrl, width: result.display.details.width, height: result.display.details.height, size: result.display.details.size, sizeInBytes: result.display.details.sizeInBytes, reduction: result.display.details.reduction, maxSize: limits.prodDispMaxSize }, 'Display', true, prefix);
            updatePreviewBox(3, { dataUrl: result.thumbnail.dataUrl, width: result.thumbnail.details.width, height: result.thumbnail.details.height, size: result.thumbnail.details.size, sizeInBytes: result.thumbnail.details.sizeInBytes, reduction: result.thumbnail.details.reduction, maxSize: limits.prodThmpMaxSize }, 'Thumbnail', true, prefix);
            updatePreviewHeaders(result, prefix);

            const previewError = document.getElementById(prefix + 'CataPopPreviewError') || document.getElementById('cataPopPreviewError');
            if (previewError) previewError.style.display = 'none';

        } catch (e) {
            console.error('Preview error:', e, 'URL:', url);

            // Show error in preview boxes instead of broken image
            for (let i = 1; i <= 3; i++) {
                const c = document.getElementById(prefix + 'CataPopImagePreviewContent' + i) || document.getElementById('cataPopImagePreviewContent' + i);
                const b = document.getElementById(prefix + 'CataPopImagePreviewBox' + i) || document.getElementById('cataPopImagePreviewBox' + i);
                if (c) {
                    c.innerHTML = `
                    <div class="text-center text-danger p-3">
                        <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                        <p class="mb-0 small fw-bold">Unable to process image</p>
                    </div>
                `;
                }
                if (b) {
                    b.style.borderColor = '#dc3545';
                    b.style.backgroundColor = '#fff5f5';
                }
            }

            // Clear image data inputs
            const finalImageInput = document.getElementById(prefix + 'CataPopFinalImageUrl') || document.getElementById('cataPopFinalImageUrl');
            const g1Input = document.getElementById(prefix + 'CataPopG1Input') || document.getElementById('cataPopG1Input');
            const g2Input = document.getElementById(prefix + 'CataPopG2Input') || document.getElementById('cataPopG2Input');
            if (finalImageInput) finalImageInput.value = '';
            if (g1Input) g1Input.value = '';
            if (g2Input) g2Input.value = '';

            // Show a non-blocking warning
            if (typeof showToast === 'function') {
                showToast('Image processing failed. Please try a different image or URL.', { type: 'error', duration: 3000 });
            }
        }
    };

    // Fallback for prefixed image processing failures (up_prod.js etc.)
    function handleImageProcessingFallback(url, prefix) {
        const pf = prefix;

        // Show warning in all preview boxes
        for (let i = 1; i <= 3; i++) {
            const c = document.getElementById(pf + 'CataPopImagePreviewContent' + i);
            if (c) {
                c.innerHTML = `
                <div class="text-center p-3">
                    <i class="fas fa-exclamation-triangle text-danger mb-2" style="font-size:28px;"></i>
                    <p class="fw-bold small mb-1">Unable to process image</p>
                    <p class="small text-muted mb-0">The image source is blocked or not accessible.</p>
                </div>
            `;
            }
        }

        // Clear all image inputs
        const finalImg = document.getElementById(pf + 'CataPopFinalImageUrl');
        if (finalImg) finalImg.value = '';

        const g1Input = document.getElementById(pf + 'CataPopG1Input');
        if (g1Input) g1Input.value = '';

        const g2Input = document.getElementById(pf + 'CataPopG2Input');
        if (g2Input) g2Input.value = '';

        const urlInput = document.getElementById(pf + 'CataPopImageUrlInput');
        if (urlInput) urlInput.value = '';

        // Store flag that image processing failed (will be checked on submit)
        window._upProdImageFailed = true;

        if (typeof showToast === 'function') {
            showToast('Image processing failed. Please try a different image or upload a file.', { type: 'error', duration: 4000 });
        }
    }

    function updatePreviewHeaders(result, prefix) {
        prefix = prefix || '';
        const limits = getImageLimits();
        const originalHeader = document.getElementById(prefix + 'OriginalImageHeader') || document.getElementById('originalImageHeader');
        if (originalHeader && result.original.details) originalHeader.innerHTML = `<i class="fas fa-image me-1 text-primary"></i>Original Image <span class="badge bg-secondary ms-1" style="font-size:10px">${result.original.details.size}</span>`;

        const displayHeader = document.getElementById(prefix + 'DisplayImageHeader') || document.getElementById('displayImageHeader');
        if (displayHeader && result.display.details) {
            const reductionBadge = result.display.details.reduction > 0 ? `<span class="badge bg-success ms-1" style="font-size:10px">-${result.display.details.reduction}%</span>` : '';
            displayHeader.innerHTML = `<i class="fas fa-desktop me-1 text-success"></i>Display <span class="badge bg-secondary ms-1" style="font-size:10px">${result.display.details.size}</span>${reductionBadge}`;
        }

        const thumbnailHeader = document.getElementById(prefix + 'ThumbnailImageHeader') || document.getElementById('thumbnailImageHeader');
        if (thumbnailHeader && result.thumbnail.details) {
            const reductionBadge = result.thumbnail.details.reduction > 0 ? `<span class="badge bg-success ms-1" style="font-size:10px">-${result.thumbnail.details.reduction}%</span>` : '';
            thumbnailHeader.innerHTML = `<i class="fas fa-th me-1 text-warning"></i>Thumbnail <span class="badge bg-secondary ms-1" style="font-size:10px">${result.thumbnail.details.size}</span>${reductionBadge}`;
        }
    }

    function showDirectImagePreview(url) {
        for (let i = 1; i <= 3; i++) {
            const c = document.getElementById('cataPopImagePreviewContent' + i);
            if (c) {
                c.innerHTML = `
                <div class="text-center p-2">
                    <img src="${url}" class="rounded" style="max-width:100%;max-height:200px;object-fit:contain" 
                         onerror="this.parentElement.innerHTML='<div class=\\'text-center text-warning p-3\\'><i class=\\'fas fa-exclamation-triangle fa-2x mb-2\\'></i><p class=\\'small mb-0\\'>Unable to load image preview</p></div>'">
                    <small class="text-warning d-block mt-1">CORS blocked - showing original</small>
                </div>`;
            }
        }

        // Update headers
        for (let i = 1; i <= 3; i++) {
            const d = document.getElementById('cataPopImageDetails' + i);
            if (d) {
                d.style.display = 'block';
                d.innerHTML = '<span class="text-warning"><i class="fas fa-exclamation-triangle me-1"></i>Image processing skipped due to CORS</span>';
            }
        }
    }
    function updatePreviewBox(num, data, label, isCompressed, prefix) {
        prefix = prefix || '';

        const c =
            document.getElementById(prefix + 'cataPopImagePreviewContent' + num) ||
            document.getElementById(prefix + 'CataPopImagePreviewContent' + num);

        if (!c) return;

        c.innerHTML = `
        <img src="${data.dataUrl}"
             class="rounded"
             style="max-width:100%;max-height:200px;object-fit:contain;">
    `;
    }

    function clearAllPreviews(prefix) {
        prefix = prefix || '';
        for (let i = 1; i <= 3; i++) {
            const c =
                document.getElementById(prefix + 'cataPopImagePreviewContent' + i) ||
                document.getElementById(prefix + 'CataPopImagePreviewContent' + i);
            if (c) c.innerHTML = `<div class="text-center text-muted py-3"><i class="fas fa-image fa-2x mb-2" style="opacity:0.4"></i><p class="mb-0 small">Preview</p></div>`;
        }
    }

    function showLoadingInAllBoxes(prefix) {
        prefix = prefix || '';
        for (let i = 1; i <= 3; i++) {
            const c =
                document.getElementById(prefix + 'cataPopImagePreviewContent' + i) ||
                document.getElementById(prefix + 'CataPopImagePreviewContent' + i);
            if (c) c.innerHTML = '<div class="text-center text-muted py-2"><div class="spinner-border spinner-border-sm text-primary mb-1"></div><p class="mb-0 small">Loading...</p></div>';
        }
    }

    // In handleFileUpload, after processing:
    window.handleFileUpload = async function (input, prefix) {
        prefix = prefix || '';
        const file = input.files[0];
        if (!file) return;

        console.log('File selected:', file.name, file.size);
        const fileInfo = document.getElementById(prefix + 'FileInfo') || document.getElementById('fileInfo');
        const uploadZone = document.getElementById(prefix + 'UploadZone') || document.getElementById('uploadZone');
        const urlInput = document.getElementById(prefix + 'CataPopImageUrlInput') || document.getElementById('cataPopImageUrlInput');

        if (fileInfo && uploadZone) {
            const fileName = document.getElementById(prefix + 'FileName') || document.getElementById('fileName');
            const fileSize = document.getElementById(prefix + 'FileSize') || document.getElementById('fileSize');
            if (fileName) fileName.textContent = file.name;
            if (fileSize) fileSize.textContent = imageProcessor.formatFileSize(file.size);
            uploadZone.style.display = 'none';
            fileInfo.style.display = 'block';

            if (urlInput) urlInput.value = '';

            const reader = new FileReader();
            reader.onload = async function (e) {
                const dataUrl = e.target.result;
                try {
                    const result = await imageProcessor.processImage(dataUrl);

                    const finalImageInput = document.getElementById(prefix + 'CataPopFinalImageUrl') || document.getElementById('cataPopFinalImageUrl');
                    const g1Input = document.getElementById(prefix + 'CataPopG1Input') || document.getElementById('cataPopG1Input');
                    const g2Input = document.getElementById(prefix + 'CataPopG2Input') || document.getElementById('cataPopG2Input');

                    if (finalImageInput) finalImageInput.value = '';
                    if (g1Input) g1Input.value = result.display.dataUrl;
                    if (g2Input) g2Input.value = result.thumbnail.dataUrl;

                    await window.handleImageUrlInput(dataUrl, prefix);
                } catch (error) {
                    console.error('Error processing image:', error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    function setupAllUploadHandlers() {
        if (window._uploadHandlersSetup) return;
        window._uploadHandlersSetup = true;

        const browseBtn = document.getElementById('browseBtn');
        const fileInput = document.getElementById('cataPopFileInput');
        const fileInfo = document.getElementById('fileInfo');
        const uploadZone = document.getElementById('uploadZone');
        const urlInput = document.getElementById('cataPopImageUrlInput');

        if (browseBtn && fileInput) {
            const newBrowseBtn = browseBtn.cloneNode(true);
            browseBtn.parentNode.replaceChild(newBrowseBtn, browseBtn);
            newBrowseBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                fileInput.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', function () {
                if (this.files && this.files.length > 0) {
                    window.handleFileUpload(this);
                }
            });
        }

        const removeFileBtn = document.getElementById('removeFileBtn');
        if (removeFileBtn) {
            const newRemoveBtn = removeFileBtn.cloneNode(true);
            removeFileBtn.parentNode.replaceChild(newRemoveBtn, removeFileBtn);
            newRemoveBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (fileInput) fileInput.value = '';
                if (fileInfo) fileInfo.style.display = 'none';
                if (uploadZone) uploadZone.style.display = 'block';
                if (urlInput) urlInput.value = '';

                const finalImageInput = document.getElementById('cataPopFinalImageUrl');
                const g1Input = document.getElementById('cataPopG1Input');
                const g2Input = document.getElementById('cataPopG2Input');
                if (finalImageInput) finalImageInput.value = '';
                if (g1Input) g1Input.value = '';
                if (g2Input) g2Input.value = '';

                clearAllPreviews();

                if (typeof showToast === 'function') showToast('File removed', { type: 'info', duration: 1000 });
            });
        }

        const uploadZoneElement = document.querySelector('#uploadTab .upload-zone');
        if (uploadZoneElement) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadZoneElement.addEventListener(eventName, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                uploadZoneElement.addEventListener(eventName, function () {
                    this.style.borderColor = '#0d6efd';
                    this.style.backgroundColor = '#f0f7ff';
                });
            });

            ['dragleave', 'drop'].forEach(eventName => {
                uploadZoneElement.addEventListener(eventName, function () {
                    this.style.borderColor = '';
                    this.style.backgroundColor = '';
                });
            });

            uploadZoneElement.addEventListener('drop', function (e) {
                const dt = e.dataTransfer;
                const files = dt.files;

                if (files && files.length > 0) {
                    const file = files[0];

                    if (!file.type.startsWith('image/')) {
                        if (typeof showToast === 'function') showToast('Please drop an image file', { type: 'warning', duration: 2000 });
                        return;
                    }

                    if (fileInput) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        fileInput.files = dataTransfer.files;

                        const event = new Event('change', { bubbles: true });
                        fileInput.dispatchEvent(event);
                    }
                }
            });

            uploadZoneElement.addEventListener('click', function (e) {
                if (e.target === uploadZoneElement || e.target.closest('#uploadZone')) {
                    if (fileInput) fileInput.click();
                }
            });
        }

        const urlTab = document.getElementById('url-tab');
        const uploadTab = document.getElementById('upload-tab');

        if (urlTab) {
            urlTab.addEventListener('shown.bs.tab', function () { });
        }

        if (uploadTab) {
            uploadTab.addEventListener('shown.bs.tab', function () { });
        }

        if (urlInput) {
            const newUrlInput = urlInput.cloneNode(true);
            urlInput.parentNode.replaceChild(newUrlInput, urlInput);
            newUrlInput.addEventListener('input', function () {
                if (this.value && !this.value.startsWith('data:')) {
                    if (fileInput) fileInput.value = '';
                    if (fileInfo) fileInfo.style.display = 'none';
                    if (uploadZone) uploadZone.style.display = 'block';

                    // Clear error state before processing
                    window._upProdImageFailed = false;
                    // Call with empty prefix for default ed_prod.js IDs
                    window.handleImageUrlInput(this.value, '');
                } else if (!this.value) {
                    clearAllPreviews('');
                }
            });
        }
        setupPricingItemsHandlers();
    }

    function setupPricingItemsHandlers() {
        const container = document.getElementById('pricingItemsContainer');
        if (!container) return;

        const measuredInSelect = document.getElementById('newMeasuredIn');
        const fieldsContainer = document.getElementById('pricingFieldsContainer');
        const btnAdd = document.getElementById('btnAddPricing');
        const msgDiv = document.getElementById('pricingValidationMsg');

        if (!measuredInSelect) return;

        function checkFormValidity() {
            let valid = true;
            let msg = '';

            const sellingPrice = document.getElementById('newSellingPrice')?.value;
            const mrp = document.getElementById('newMrp')?.value;
            const packageSize = document.getElementById('newPackageSize')?.value;
            const qtyInc = document.getElementById('newQtyInc')?.value;
            const minQty = document.getElementById('newMinQty')?.value;
            const maxQty = document.getElementById('newMaxQty')?.value;
            const measuredIn = document.getElementById('newMeasuredIn')?.value;

            const minQtyInput = document.getElementById('newMinQty');
            const maxQtyInput = document.getElementById('newMaxQty');
            const btnAddBtn = document.getElementById('btnAddPricing');
            const msgDivEl = document.getElementById('pricingValidationMsg');
            const fieldsCont = document.getElementById('pricingFieldsContainer');

            if (minQtyInput) minQtyInput.style.borderColor = '';
            if (maxQtyInput) maxQtyInput.style.borderColor = '';

            if (!measuredIn) {
                valid = false;
                msg = 'Please select Measured In.';
            } else if (!sellingPrice || !mrp || !packageSize || !qtyInc || !minQty || !maxQty) {
                valid = false;
                msg = 'Please fill all required fields.';
            } else {
                const qtyIncNum = parseInt(qtyInc) || 1;
                const minQtyNum = parseInt(minQty) || 1;
                const maxQtyNum = parseInt(maxQty) || 10;

                if (minQtyNum < qtyIncNum) {
                    valid = false;
                    msg = 'Min Qty cannot be less than Qty Increment.';
                    if (minQtyInput) minQtyInput.style.borderColor = '#dc3545';
                } else if (maxQtyNum < minQtyNum) {
                    valid = false;
                    msg = 'Max Qty cannot be less than Min Qty.';
                    if (maxQtyInput) maxQtyInput.style.borderColor = '#dc3545';
                } else if (maxQtyNum % qtyIncNum !== 0) {
                    valid = false;
                    msg = 'Max Qty must be a multiple of Qty Increment (' + qtyIncNum + ').';
                    if (maxQtyInput) maxQtyInput.style.borderColor = '#dc3545';
                } else if (minQtyNum % qtyIncNum !== 0) {
                    valid = false;
                    msg = 'Min Qty must be a multiple of Qty Increment (' + qtyIncNum + ').';
                    if (minQtyInput) minQtyInput.style.borderColor = '#dc3545';
                }
            }

            if (btnAddBtn) {
                btnAddBtn.style.display = valid ? 'inline-block' : 'none';
            }
            if (msgDivEl) {
                if (fieldsCont && fieldsCont.style.display !== 'none') {
                    msgDivEl.style.display = valid ? 'none' : 'block';
                    if (!valid) msgDivEl.textContent = msg;
                } else {
                    msgDivEl.style.display = 'none';
                }
            }

            return valid;
        }

        const newMeasuredInSelect = measuredInSelect.cloneNode(true);
        measuredInSelect.parentNode.replaceChild(newMeasuredInSelect, measuredInSelect);

        newMeasuredInSelect.addEventListener('change', function () {
            const fieldsCont = document.getElementById('pricingFieldsContainer');
            const btnAddBtn = document.getElementById('btnAddPricing');
            const msgDivEl = document.getElementById('pricingValidationMsg');

            if (this.value) {
                if (fieldsCont) fieldsCont.style.display = 'block';
                checkFormValidity();
            } else {
                if (fieldsCont) fieldsCont.style.display = 'none';
                if (btnAddBtn) btnAddBtn.style.display = 'none';
                if (msgDivEl) msgDivEl.style.display = 'none';
            }
        });

        setTimeout(function () {
            const allFields = document.querySelectorAll('#pricingFieldsContainer .pricing-field');
            allFields.forEach(field => {
                const newField = field.cloneNode(true);
                field.parentNode.replaceChild(newField, field);

                newField.addEventListener('input', function () {
                    this.value = this.value.replace(/[^0-9]/g, '');
                    checkFormValidity();
                });
            });

            const qtyIncInput = document.getElementById('newQtyInc');
            if (qtyIncInput) {
                const newQtyInc = qtyIncInput.cloneNode(true);
                qtyIncInput.parentNode.replaceChild(newQtyInc, qtyIncInput);
                newQtyInc.addEventListener('input', function () {
                    this.value = this.value.replace(/[^0-9]/g, '');
                    checkFormValidity();
                });
            }
        }, 100);

        setTimeout(checkFormValidity, 200);
    }

    // Delete product records from p table after successful API response
    async function deleteProductFromDB(productIds) {
        try {
            let deletedCount = 0;

            // Ensure productIds is an array
            if (!Array.isArray(productIds)) {
                productIds = [productIds];
            }

            const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(dbnm);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });

            const transaction = db.transaction(['p'], 'readwrite');
            const store = transaction.objectStore('p');

            // Get all keys and records
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

            for (const productId of productIds) {
                const idToDelete = typeof productId === 'object' ? productId.a : productId;
                const index = allRecords.findIndex(r => String(r.a) === String(idToDelete));

                if (index >= 0 && allKeys[index] !== undefined) {
                    await new Promise((resolve) => {
                        const deleteRequest = store.delete(allKeys[index]);
                        deleteRequest.onsuccess = () => {
                            deletedCount++;
                            console.log('Deleted product from p table:', idToDelete);
                            resolve();
                        };
                        deleteRequest.onerror = () => {
                            console.warn('Failed to delete product:', idToDelete);
                            resolve();
                        };
                    });
                } else {
                    console.warn('Product not found in p table:', idToDelete);
                }
            }

            db.close();
            console.log('Total products deleted from p table:', deletedCount);
            return deletedCount;
        } catch (e) {
            console.error('Error deleting products from p table:', e);
            return 0;
        }
    }

    // Delete stock records from s table after successful API response
    async function deleteStockFromDB(stockIds) {
        try {
            let deletedCount = 0;

            // Ensure stockIds is an array
            if (!Array.isArray(stockIds)) {
                stockIds = [stockIds];
            }

            const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(dbnm);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });

            const transaction = db.transaction(['s'], 'readwrite');
            const store = transaction.objectStore('s');

            // Get all keys and records
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

            for (const stockId of stockIds) {
                const idToDelete = typeof stockId === 'object' ? stockId.a : stockId;
                const index = allRecords.findIndex(r => String(r.a) === String(idToDelete));

                if (index >= 0 && allKeys[index] !== undefined) {
                    await new Promise((resolve) => {
                        const deleteRequest = store.delete(allKeys[index]);
                        deleteRequest.onsuccess = () => {
                            deletedCount++;
                            console.log('Deleted stock from s table:', idToDelete);
                            resolve();
                        };
                        deleteRequest.onerror = () => {
                            console.warn('Failed to delete stock:', idToDelete);
                            resolve();
                        };
                    });
                } else {
                    console.warn('Stock not found in s table:', idToDelete);
                }
            }

            db.close();
            console.log('Total stocks deleted from s table:', deletedCount);
            return deletedCount;
        } catch (e) {
            console.error('Error deleting stocks from s table:', e);
            return 0;
        }
    }

    window.showProductList = showProductList;
    window.showItemForm = showItemForm;
    window.showProductForm = function (p, i) { showItemForm('product', p, i); };
    window.showCategoryForm = function (p, i) { showItemForm('category', p, i); };
    window.getNextCategoryId = getNextCategoryId;
    window.getNextProductId = getNextProductId;
    window.refreshUI = refreshUI;
    window.handleImageUrlInput = window.handleImageUrlInput;
    window.handleFileUpload = window.handleFileUpload;
    window.addPricingItem = addPricingItem;
    window.saveNewPricingItem = window.saveNewPricingItem;
    window.initPricingItemsForEdit = initPricingItemsForEdit;
    window.generateSoldInString = generateSoldInString;
    window.updateSoldInPreview = updateSoldInPreview;
    window.clearPricingItems = clearPricingItems;
    window.commonFnToRunAfter_op_ViewCall = commonFnToRunAfter_op_ViewCall;
    window.refreshEd_prods = refreshEd_prods;

    function commonFnToRunAfter_op_ViewCall(obj, swtch) {
        if (swtch === 1) {
            const partyInput = document.getElementById('c_dtls_party');
            const partyIdInput = document.getElementById('partyId');
            if (partyInput) partyInput.value = obj.i || obj.h || obj.e || 'Unknown';
            if (partyIdInput) partyIdInput.value = obj.a;
            const dvBtn = document.getElementById('dv_for_add_itm_btn');
            if (dvBtn) dvBtn.style.display = 'block';

            // Restore the item form fullpage view hidden by the party picker
            if (typeof removeAllBackdrops === 'function') removeAllBackdrops();
            if (window._fpNavStack && window._fpNavStack.length > 0) {
                var topId = window._fpNavStack[window._fpNavStack.length - 1];
                if (topId && topId.indexOf('entind_modal_') === 0) {
                    window._fpNavStack.pop();
                    var topEl = document.getElementById(topId);
                    if (topEl) { topEl.dispatchEvent(new Event('fp-close')); topEl.remove(); }
                }
                if (window._fpNavStack.length > 0) {
                    var prevId = window._fpNavStack[window._fpNavStack.length - 1];
                    var prevEl = document.getElementById(prevId);
                    if (prevEl) prevEl.style.display = 'block';
                }
            }

            if (typeof showToast === 'function') showToast(`Party selected: ${obj.h || obj.i || obj.e}`, { type: 'success', duration: 2000 });
        } else { alert("Please Select a valid option"); }
    }

    console.log('ed_prod.js loaded successfully');

    const uploadStyles = document.createElement('style');
    uploadStyles.textContent = `
        #uploadTab .upload-zone { transition: all 0.3s ease; cursor: pointer; }
        #uploadTab .upload-zone:hover { border-color: #0d6efd !important; background-color: #f8f9ff !important; }
        .pricing-item-row { transition: all 0.2s; }
        .pricing-item-row:hover { background: #e9ecef !important; }
        .pricing-item-saved { transition: all 0.2s; }
        .pricing-item-saved:hover { background: #c8e6c9 !important; }
        .inputbox{ border: 0.98px solid #000000dc; margin-top: 10px; margin-bottom: 8px; width: 100%; }
        .inputbox2{ border: 0.88px solid #1a1a1aa6; margin-top: 10px; padding: 20px; margin-bottom: 8px; }
        .mgtop{margin-top:58px;}
    `;
    document.head.appendChild(uploadStyles);

})();