// up_prod.js - Update Product (Name, Category, Image only)
(function () {
    'use strict';

    console.log('up_prod.js initializing...');

    let isProcessing = false;
    const PLACEHOLDER_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="#f0f0f0"/><text x="25" y="25" text-anchor="middle" dy=".3em" font-size="12" fill="#999" font-family="Arial">No</text></svg>');

    function getGoogleDriveImageUrl(value, thumbnail) {
        if (!value) return '';
        value = String(value).trim();
        if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value;
        const parts = value.split(/\s+/);
        if (/^[A-Za-z0-9_-]{20,}$/.test(parts[0])) {
            const fileId = (thumbnail && parts[1]) ? parts[1] : parts[0];
            return `https://lh3.googleusercontent.com/d/${fileId}=s0?authuser=0`;
        }
        return '';
    }

    // Show update product modal
    window.showUpdateProduct = async function (productId) {
        console.log('showUpdateProduct called for:', productId);

        window._upProdImageFailed = false;

        const product = window.prod_list ? window.prod_list.find(p => String(p.a) === String(productId)) : null;
        if (!product) {
            if (typeof showToast === 'function') showToast('Product not found', { type: 'error', duration: 2000 });
            return;
        }

        // Get categories filtered by o.da config
        let categories = [];
        try {
            const allCategories = await dbDexieManager.getAllRecords(dbnm, 'p');
            window.prod_cata = allCategories;

            // Get category IDs from config (same as o.da)
            const categoryIds = window[my1uzr.worknOnPg]?.categorys || [];

            if (categoryIds.length > 0) {
                // Build a map for quick lookup
                const cataMap = {};
                allCategories.forEach(c => { cataMap[Number(c.a)] = c; });

                // Map in the order of categoryIds to preserve sequence
                categories = categoryIds
                    .map(id => cataMap[Number(id)])
                    .filter(c => c);
            } else {
                categories = allCategories;
            }
        } catch (e) {
            console.warn('Error loading categories:', e);
            categories = window.prod_cata || [];
        }

        const categoryOptions = categories.map(c =>
            `<option value="${c.a}" ${String(product.f) === String(c.a) ? 'selected' : ''}>${c.e || 'Unnamed Category'}</option>`
        ).join('') || '<option value="">No categories available</option>';

        const imgUrl = getGoogleDriveImageUrl(product.g || product.h || '');
        const productName = product.e || '';
        const limits = window[my1uzr.worknOnPg] || {};

        if (typeof create_fullpage_view === 'function') {
            const modalId = 'upProdModal_' + Date.now();
            const modalResult = create_fullpage_view(modalId);
            if (!modalResult) return;

            const { contentElement, modalInstance, modalElement } = modalResult;

            const titleEl = document.getElementById(modalId + '_title');
            if (titleEl) titleEl.textContent = 'Update Product';

            contentElement.innerHTML = `
                <div class="p-2">
                    <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <h5 class="mb-0"><i class="fas fa-edit me-2 text-primary"></i>Update Product</h5>
                    </div>
                    <form id="upProdForm">
                        <h6 class="text-primary mb-2"><i class="fas fa-box me-2"></i>Product Information</h6>
                        
                        <div class="row g-2 mb-3 inputbox2">
                            <div class="col-12">
                                <label class="form-label fw-bold small mb-1">Product Name <span class="text-danger">*</span></label>
                                <input type="text" name="e" id="upProdName" class="form-control inputbox form-control-sm" 
                                    value="${productName}" placeholder="Enter product name" required>
                            </div>
                        </div>
                        
                        <div class="mb-3 inputbox2">
                            <label class="form-label fw-bold small mb-1">Category</label>
                            <select name="f" id="upProdCategory" class="form-select inputbox form-select-sm">
                                <option value="">Select Category</option>
                                ${categoryOptions}
                            </select>
                        </div>
                        
                        <div class="mb-3 inputbox2">
                            <label class="form-label fw-bold small mb-1">Product Image</label>
                            <ul class="nav nav-pills mb-2" id="upInputTabs" role="tablist" style="font-size:12px;">
                                <li class="nav-item"><button class="nav-link active" data-bs-toggle="pill" data-bs-target="#upUrlTab" type="button"><i class="fas fa-link me-1"></i>Image URL</button></li>
                                <li class="nav-item"><button class="nav-link" data-bs-toggle="pill" data-bs-target="#upUploadTab" type="button"><i class="fas fa-cloud-upload-alt me-1"></i>Upload File</button></li>
                            </ul>
                            <div class="tab-content">
                                <div class="tab-pane fade show active" id="upUrlTab">
                                    <input type="url" name="h" id="upCataPopImageUrlInput" class="form-control inputbox form-control-sm" 
                                        value="${imgUrl}" placeholder="https://example.com/image.jpg" 
                                        oninput="if(this.value && !this.value.startsWith('data:')) { window.handleImageUrlInput(this.value, 'up'); }">
                                </div>
                                <div class="tab-pane fade" id="upUploadTab">
                                    <input type="file" id="upCataPopFileInput" accept="image/*" style="display:none;" onchange="window.handleFileUpload(this, 'up')">
                                    <div class="border rounded p-3 text-center bg-light upload-zone" style="border-style:dashed!important;">
                                        <div id="upUploadZone"><button type="button" class="btn btn-outline-primary" id="upBrowseBtn"><i class="fas fa-folder-open me-2"></i>Browse Files</button><p class="text-muted small mt-1 mb-0">or drag & drop image here</p></div>
                                        <div id="upFileInfo" style="display:none;"><div class="d-flex align-items-center justify-content-between"><div><i class="fas fa-file-image text-primary me-2" style="font-size:24px;"></i><span id="upFileName" class="fw-bold small"></span><br><span id="upFileSize" class="text-muted" style="font-size:11px;"></span></div><button type="button" class="btn btn-sm btn-outline-danger" id="upRemoveFileBtn"><i class="fas fa-times"></i></button></div></div>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" name="g" id="upCataPopFinalImageUrl" value="${imgUrl}">
                            <input type="hidden" name="g1" id="upCataPopG1Input" value="">
                            <input type="hidden" name="g2" id="upCataPopG2Input" value="">
                        </div>
                        
                        <div class="mb-2 inputbox2"><h6 class="fw-bold small mb-1" id="upOriginalImageHeader"><i class="fas fa-image me-1 text-primary"></i>Original Image</h6><div class="border rounded p-2 bg-light text-center" style="min-height:140px;max-height:200px;overflow:hidden;border:2px dashed #000000bd!important"><div id="upCataPopImagePreviewContent1" class="text-muted small py-3">${imgUrl ? `<img src="${imgUrl}" class="rounded" style="max-width:100%;max-height:200px;object-fit:contain;" onerror="this.src='${PLACEHOLDER_IMG}'">` : '<i class="fas fa-image fa-2x mb-1 d-block" style="opacity:0.4"></i><span>Original image preview</span>'}</div></div></div>
                        <div class="mb-2 inputbox2"><h6 class="fw-bold small mb-1" id="upDisplayImageHeader"><i class="fas fa-desktop me-1 text-success"></i>Display Size (${limits.prodDispMaxWidth || 1080}px)</h6><div class="border rounded p-2 bg-light text-center" style="min-height:140px;max-height:200px;overflow:hidden;border:2px dashed #000000bd!important"><div id="upCataPopImagePreviewContent2" class="text-muted small py-3">${imgUrl ? `<img src="${imgUrl}" class="rounded" style="max-width:100%;max-height:200px;object-fit:contain;" onerror="this.src='${PLACEHOLDER_IMG}'">` : '<i class="fas fa-desktop fa-2x mb-1 d-block" style="opacity:0.4"></i><span>Display size preview</span>'}</div></div></div>
                        <div class="mb-2 inputbox2"><h6 class="fw-bold small mb-1" id="upThumbnailImageHeader"><i class="fas fa-th me-1 text-warning"></i>Thumbnail (${limits.prodThmpMaxWidth || 300}px)</h6><div class="border rounded p-2 bg-light text-center" style="min-height:140px;max-height:200px;overflow:hidden;border:2px dashed #000000bd!important"><div id="upCataPopImagePreviewContent3" class="text-muted small py-3">${imgUrl ? `<img src="${imgUrl}" class="rounded" style="max-width:100%;max-height:200px;object-fit:contain;" onerror="this.src='${PLACEHOLDER_IMG}'">` : '<i class="fas fa-th fa-2x mb-1 d-block" style="opacity:0.4"></i><span>Thumbnail preview</span>'}</div></div></div>
                        
                        <input type="hidden" name="a" value="${product.a}">
                        
                        <div class="d-flex justify-content-end gap-2 pt-2 border-top mt-2">
                            <button type="button" class="btn btn-sm btn-secondary" data-fp-close="1">Cancel</button>
                            <button type="submit" class="btn btn-sm btn-primary" id="upProdSubmitBtn"><i class="fas fa-save me-1"></i>Update Product</button>
                        </div>
                    </form>
                </div>
            `;

            // Setup upload handlers
            setTimeout(() => {
                const browseBtn = document.getElementById('upBrowseBtn');
                const fileInput = document.getElementById('upCataPopFileInput');

                // ========== ADD THE URL INPUT FIX HERE ==========
                const urlInput = document.getElementById('upCataPopImageUrlInput');
                if (urlInput) {
                    const newUrlInput = urlInput.cloneNode(true);
                    urlInput.parentNode.replaceChild(newUrlInput, urlInput);
                    newUrlInput.addEventListener('input', function () {
                        if (this.value && !this.value.startsWith('data:')) {
                            window._upProdImageFailed = false;
                            for (let i = 1; i <= 3; i++) {
                                const c = document.getElementById('upCataPopImagePreviewContent' + i);
                                if (c) c.innerHTML = '<div class="text-center text-muted py-2"><div class="spinner-border spinner-border-sm text-primary mb-1"></div><p class="mb-0 small">Processing...</p></div>';
                            }
                            window.handleImageUrlInput(this.value, 'up');
                        }
                    });
                }
                if (browseBtn && fileInput) browseBtn.addEventListener('click', e => { e.preventDefault(); fileInput.click(); });
                if (fileInput) {
                    fileInput.addEventListener('change', function () {
                        if (this.files && this.files.length > 0) {
                            document.getElementById('upFileInfo').style.display = 'block';
                            document.getElementById('upUploadZone').style.display = 'none';
                            document.getElementById('upFileName').textContent = this.files[0].name;
                            document.getElementById('upFileSize').textContent = (this.files[0].size / 1024).toFixed(2) + ' KB';
                            if (typeof window.handleFileUpload === 'function') window.handleFileUpload(this, 'up');
                        }
                    });
                }
                const removeBtn = document.getElementById('upRemoveFileBtn');
                if (removeBtn && fileInput) {
                    removeBtn.addEventListener('click', e => {
                        e.preventDefault(); fileInput.value = '';
                        document.getElementById('upFileInfo').style.display = 'none';
                        document.getElementById('upUploadZone').style.display = 'block';
                        document.getElementById('upCataPopImageUrlInput').value = '';
                    });
                }
                const uploadZone = document.querySelector('#upUploadTab .upload-zone');
                if (uploadZone && fileInput) {
                    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => uploadZone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); }));
                    uploadZone.addEventListener('drop', function (e) {
                        const files = e.dataTransfer.files;
                        if (files.length > 0 && files[0].type.startsWith('image/')) {
                            const dt = new DataTransfer(); dt.items.add(files[0]);
                            fileInput.files = dt.files;
                            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    });
                }
            }, 200);

            if (imgUrl) {
                setTimeout(() => { if (typeof window.handleImageUrlInput === 'function') window.handleImageUrlInput(imgUrl, 'up'); }, 600);
            }

            // Define submit function with access to product and modalId
            async function submitProductForm() {
                isProcessing = true;
                const sb = document.getElementById('upProdSubmitBtn');
                if (sb) { sb.disabled = true; sb.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Updating...'; }
                try {
                    const form = document.getElementById('upProdForm');
                    const fd2 = new FormData(form);
                    const nm = (fd2.get('e') || '').trim();
                    if (!nm) {
                        if (typeof showToast === 'function') showToast('Product name required', { type: 'error', duration: 2000 });
                        isProcessing = false;
                        if (sb) { sb.disabled = false; sb.innerHTML = '<i class="fas fa-save me-1"></i>Update Product'; }
                        return;
                    }
                    const finalImageUrl = document.getElementById('upCataPopFinalImageUrl')?.value || '';
                    const g1Value = document.getElementById('upCataPopG1Input')?.value || '';
                    const g2Value = document.getElementById('upCataPopG2Input')?.value || '';
                    const imageUrlInput = document.getElementById('upCataPopImageUrlInput')?.value || '';
                    const fileInput = document.getElementById('upCataPopFileInput');
                    const isFileUpload = fileInput && fileInput.files && fileInput.files.length > 0;
                    const isUrlInput = imageUrlInput && !imageUrlInput.startsWith('data:');
                    const p = { e: nm, a: product.a };
                    if (isFileUpload || isUrlInput) {
                        if (isFileUpload) { p.g = ''; p.g1 = g1Value; p.g2 = g2Value; }
                        else { p.g = finalImageUrl; p.g1 = g1Value; p.g2 = g2Value; }
                    }
                    const newCategory = fd2.get('f') || '';
                    if (newCategory && String(newCategory) !== String(product.f)) p.f = newCategory;
                    if (typeof payload0 !== 'undefined') {
                        payload0.p = p; payload0.vw = 1; payload0.fn = 83;
                        payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'p', "col": 'b', "cl": "b" }]);
                        payload0.drml = "sambodhisarang.in";
                        console.log('Update product payload:', payload0);

                        var _ldId = 'uppr_ld_' + Date.now();
                        var _ldDiv = document.createElement('div');
                        _ldDiv.id = _ldId;
                        _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
                        _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
                        document.body.appendChild(_ldDiv);

                        const response = await fnj3("https://my1.in/2/k.php", payload0, 1, true, null, 20000, 0, 2, 1);
                        var _ldEl = document.getElementById(_ldId);
                        if (_ldEl) _ldEl.remove();
                        if (response && response.su == 1) {
                            hndlRspo83(response);
                        } else {
                            isProcessing = false;
                            if (sb) { sb.disabled = false; sb.innerHTML = '<i class="fas fa-save me-1"></i>Update Product'; }
                            window.showelsemodal(response?.ms || 'Failed to update.');
                        }
                    }
                } catch (er) {
                    var _ldEl2 = document.getElementById(_ldId);
                    if (_ldEl2) _ldEl2.remove();
                    console.error(er);
                    isProcessing = false;
                    if (sb) { sb.disabled = false; sb.innerHTML = '<i class="fas fa-save me-1"></i>Update Product'; }
                    window.showelsemodal(er || 'Error updating product');
                } finally {
                    isProcessing = false;
                    if (sb && sb.disabled) { sb.disabled = false; sb.innerHTML = '<i class="fas fa-save me-1"></i>Update Product'; }
                }
            }

            // Form submit handler
            const form = contentElement.querySelector('#upProdForm');
            if (form) {
                form.onsubmit = async function (e) {
                    e.preventDefault();
                    if (isProcessing) return;

                    if (window._upProdImageFailed) {
                        if (typeof create_modal_dynamically === 'function') {
                            const confirmModalId = 'confirmNoImageModal_' + Date.now();
                            const confirmResult = create_modal_dynamically(confirmModalId);
                            if (confirmResult) {
                                const { contentElement: confirmContent, modalInstance: confirmInstance, modalElement: confirmElement } = confirmResult;
                                setTimeout(() => {
                                    const md = confirmElement.querySelector('.modal-dialog');
                                    if (md) { md.style.marginTop = '120px'; md.style.maxWidth = 'auto'; }
                                }, 50);
                                confirmContent.innerHTML = `
                                    <div class="p-4 text-center">
                                        <div class="mb-3"><i class="fas fa-exclamation-triangle text-warning" style="font-size:48px;"></i></div>
                                        <h5 class="text-warning">Image Not Updated</h5>
                                        <p class="text-muted">Image processing failed. Continue without updating the image?</p>
                                        <div class="d-flex justify-content-center gap-2 mt-3 pt-2 border-top">
                                            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                                            <button class="btn btn-primary btn-sm" id="confirmNoImageBtn_${confirmModalId}"><i class="fas fa-check me-1"></i>Continue Anyway</button>
                                        </div>
                                    </div>`;
                                document.getElementById('confirmNoImageBtn_' + confirmModalId).addEventListener('click', async function () {
                                    confirmInstance.hide();
                                    window._upProdImageFailed = false;
                                    await submitProductForm();
                                });
                                confirmInstance.show();
                                return;
                            }
                        }
                        if (!confirm('Image processing failed. Continue without updating the image?')) return;
                        window._upProdImageFailed = false;
                    }
                    await submitProductForm();
                };
            }

            modalInstance.show();
        }
    };

    const st = document.createElement('style');
    st.textContent = `.inputbox{ border: 0.98px solid #000000dc; margin-top: 10px; margin-bottom: 8px; width: 100%; } .inputbox2{ border: 0.88px solid #1a1a1aa6; margin-top: 10px; padding: 20px; margin-bottom: 8px; }`;
    document.head.appendChild(st);

    console.log('up_prod.js loaded successfully');
    function hndlRspo83(response) {
        handl_o_rspons(response, 1);
        window.showsuccessmodal(response.ms || 'Product updated');
        modalInstance.hide();
        //setTimeout(() => location.reload(), 300);
    }
    window.hndlRspo83 = hndlRspo83;

})();