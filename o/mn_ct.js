// mn_ct.js - Manage Categories CRUD
(function () {
    'use strict';

    console.log('mn_ct.js initializing...');

    let currentModalInstance = null;
    let currentModalId = null;
    let selectedToRemove = [];
    let selectedToAdd = [];

    // Get category list from config
    function getCategoryList() {
        return window[my1uzr.worknOnPg]?.categorys || [];
    }

    // Save category list locally
    function saveCategoryListLocal(list) {
        if (window[my1uzr.worknOnPg]) window[my1uzr.worknOnPg].categorys = list;
        console.log('Categories saved locally:', list);
    }

    // Get all categories from p table
    async function getAllCategories() {
        try {
            return await dbDexieManager.getAllRecords(dbnm, 'p');
        } catch (e) {
            console.error('Error loading categories:', e);
            return window.prod_cata || [];
        }
    }

    // Get category name by ID
    function getCatName(catId) {
        const categories = window.prod_cata || [];
        const cat = categories.find(c => String(c.a) === String(catId));
        return cat ? (cat.e || 'Unnamed Category') : 'Category #' + catId;
    }

    // Get category image URL
    function getCatImage(catId) {
        const categories = window.prod_cata || [];
        const cat = categories.find(c => String(c.a) === String(catId));
        if (!cat) return '';
        if (cat.g) {
            if (typeof getGoogleDriveImageUrl === 'function') return getGoogleDriveImageUrl(cat.g);
            return cat.g;
        }
        return '';
    }

    // Send category update to server
    async function sendCategoryUpdate(categoryList) {
        if (typeof payload0 === 'undefined') {
            console.error('payload0 not available');
            return false;
        }

        payload0.vw = 1;
        payload0.fn = 85;
        payload0.cata = categoryList;

        console.log('Category update payload:', payload0);

        var _ldId = 'mnct_ld_' + Date.now();
        var _ldDiv = document.createElement('div');
        _ldDiv.id = _ldId;
        _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
        _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
        document.body.appendChild(_ldDiv);

        try {
            const response = await fnj3("https://my1.in/2/l.php", payload0, 1, true, null, 20000, 0, 2, 1);
            var _ldEl = document.getElementById(_ldId);
            if (_ldEl) _ldEl.remove();
            if (response && response.su == 1) {
                return true;
            } else {
                window.showelsemodal(response?.ms || 'Failed to save. Please try again.');
                return false;
            }
        } catch (error) {
            var _ldEl2 = document.getElementById(_ldId);
            if (_ldEl2) _ldEl2.remove();
            window.showelsemodal(error || '404');
            return false;
        }
    }

    // Show manage categories modal
    window.showManageCategories = async function () {
        console.log('showManageCategories called');

        try {
            if (typeof create_fullpage_view !== 'function') {
                if (typeof showToast === 'function') showToast('View system not available');
                return;
            }

            selectedToRemove = [];
            selectedToAdd = [];

            const allCategories = await getAllCategories();
            window.prod_cata = allCategories;

            currentModalId = 'manageCategoriesModal_' + Date.now();
            const modalResult = create_fullpage_view(currentModalId);
            if (!modalResult) return;

            const { contentElement, modalInstance, modalElement } = modalResult;
            currentModalInstance = modalInstance;

            contentElement.innerHTML = buildHTML(currentModalId);
            attachHandlers(contentElement, modalInstance, currentModalId);
            modalInstance.show();

        } catch (error) {
            console.error('Error showing manage categories:', error);
            if (typeof showToast === 'function') showToast('Error loading manage categories', { type: 'error', duration: 2000 });
        }
    };

    // Build HTML
    function buildHTML(modalId) {
        const categoryList = getCategoryList();
        const allCategories = window.prod_cata || [];
        const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="#f0f0f0"/><text x="25" y="30" text-anchor="middle" font-size="20" fill="#999">📁</text></svg>');

        // Build selected categories list
        let selectedHTML = '';
        if (categoryList.length === 0) {
            selectedHTML = `<div class="text-center py-4 text-muted"><i class="fas fa-folder-open fa-2x mb-2" style="opacity:0.4;"></i><p class="small mb-0">No categories selected</p><p class="small text-muted">Add categories from the list below</p></div>`;
        } else {
            categoryList.forEach(catId => {
                const catName = getCatName(catId);
                const catImg = getCatImage(catId);
                const isMarkedForRemove = selectedToRemove.includes(Number(catId));

                selectedHTML += `
                    <div class="d-flex align-items-center gap-2 p-2 mb-1 border rounded ${isMarkedForRemove ? 'ct-marked-remove' : ''}" style="background:#fff;transition:all 0.2s ease;">
                        ${catImg ? `<img src="${catImg}" style="width:36px;height:36px;object-fit:cover;border-radius:8px;" onerror="this.src='${PLACEHOLDER_IMG}'">` : `<div style="width:36px;height:36px;border-radius:8px;background:#e9ecef;display:flex;align-items:center;justify-content:center;"><i class="fas fa-folder text-muted"></i></div>`}
                        <div class="flex-grow-1" style="font-size:13px;font-weight:500;">${catName}</div>
                        <span class="badge bg-secondary" style="font-size:10px;">ID: ${catId}</span>
                        <button class="btn btn-sm ${isMarkedForRemove ? 'btn-outline-secondary' : 'btn-outline-danger'} ct-remove-toggle-btn" style="font-size:10px;padding:2px 8px;border-radius:6px;" data-cat-id="${catId}">
                            <i class="fas ${isMarkedForRemove ? 'fa-undo' : 'fa-times'}"></i> ${isMarkedForRemove ? 'Keep' : 'Remove'}
                        </button>
                    </div>`;
            });
        }

        // Build available categories list
        let availableHTML = '';
        const availableCategories = allCategories.filter(c => !categoryList.includes(Number(c.a)));
        if (availableCategories.length === 0) {
            availableHTML = `<div class="text-center py-3 text-muted small">All categories are added</div>`;
        } else {
            availableHTML = `<div style="max-height:200px;overflow-y:auto;">`;
            availableCategories.forEach(cat => {
                const catImg = cat.g ? (typeof getGoogleDriveImageUrl === 'function' ? getGoogleDriveImageUrl(cat.g) : cat.g) : '';
                const isMarkedForAdd = selectedToAdd.includes(Number(cat.a));

                availableHTML += `
                    <div class="d-flex align-items-center gap-2 p-2 mb-1 border rounded ${isMarkedForAdd ? 'ct-marked-add' : ''}" style="background:#fff;transition:all 0.2s ease;">
                        ${catImg ? `<img src="${catImg}" style="width:36px;height:36px;object-fit:cover;border-radius:8px;" onerror="this.src='${PLACEHOLDER_IMG}'">` : `<div style="width:36px;height:36px;border-radius:8px;background:#e9ecef;display:flex;align-items:center;justify-content:center;"><i class="fas fa-folder text-muted"></i></div>`}
                        <div class="flex-grow-1" style="font-size:13px;font-weight:500;">${cat.e || 'Unnamed'}</div>
                        <span class="badge bg-secondary" style="font-size:10px;">ID: ${cat.a}</span>
                        <button class="btn btn-sm ${isMarkedForAdd ? 'btn-outline-secondary' : 'btn-outline-success'} ct-add-toggle-btn" style="font-size:10px;padding:2px 8px;border-radius:6px;cursor:pointer;" data-cat-id="${cat.a}">
                            <i class="fas ${isMarkedForAdd ? 'fa-check' : 'fa-plus'}"></i> ${isMarkedForAdd ? 'Selected' : 'Add'}
                        </button>
                    </div>`;
            });
            availableHTML += `</div>`;
        }

        return `
            <div>
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom px-3 pt-3">
                    <h5 class="mb-0"><i class="fas fa-folder-tree me-2 text-primary"></i>Manage Categories</h5>
                </div>
                
                <!-- Selected Categories Section -->
                <div class="px-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0"><i class="fas fa-check-circle me-1 text-success"></i>Selected Categories <span class="badge bg-success ms-1">${categoryList.length}</span></h6>
                        ${selectedToRemove.length > 0 ? `
                            <button class="btn btn-sm btn-danger" id="ctRemoveSelectedBtn_${modalId}">
                                <i class="fas fa-trash me-1"></i>Remove Selected (${selectedToRemove.length})
                            </button>
                        ` : ''}
                    </div>
                    <div class="border rounded p-2" style="background:#f8f9fa;min-height:60px;max-height:300px;overflow-y:auto;">
                        ${selectedHTML}
                    </div>
                </div>

                <!-- Available Categories Section -->
                <div class="px-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-1"><i class="fas fa-list me-1 text-primary"></i>Available Products <span class="badge bg-primary ms-1">${availableCategories.length}</span></h6>
                        ${selectedToAdd.length > 0 ? `
                            <button class="btn btn-sm btn-success" id="ctAddSelectedBtn_${modalId}">
                                <i class="fas fa-plus me-1"></i>Add Selected (${selectedToAdd.length})
                            </button>
                        ` : ''}
                    </div>
                    <p class="text-muted small mb-2">Select categories and click "Add Selected" to include them</p>
                    <div class="border rounded p-2" style="background:#f8f9fa;">
                        ${availableHTML}
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-2 px-3 pb-3 pt-2 border-top mt-2">
                    <button type="button" class="btn btn-sm btn-secondary" data-fp-close="1">Close</button>
                </div>
            </div>
        `;
    }

    // Refresh modal content
    function refreshModal() {
        if (!currentModalId) return;
        const modalEl = document.getElementById(currentModalId);
        if (!modalEl) return;
        const contentEl = modalEl.querySelector('.modal-body') || modalEl;
        contentEl.innerHTML = buildHTML(currentModalId);
        attachHandlers(contentEl, currentModalInstance, currentModalId);
    }

    // Process remove selected
    async function processRemoveSelected() {
        const categoryList = getCategoryList();
        const updatedList = categoryList.filter(id => !selectedToRemove.includes(Number(id)));

        if (typeof showToast === 'function') showToast('Updating categories...', { type: 'info', duration: 1500 });
        const success = await sendCategoryUpdate(updatedList);

        if (success) {
            // Only save locally if server succeeded
            saveCategoryListLocal(updatedList);
            selectedToRemove = [];
            if (typeof showToast === 'function') showToast('Categories removed!', { type: 'success', duration: 2000 });
            if (typeof renderCategoryStrip === 'function') renderCategoryStrip();
            refreshModal();
        }
        // If failed, don't save locally - keep old list
    }

    // Process add selected
    async function processAddSelected() {
        const categoryList = getCategoryList();
        // Create updated list
        const updatedList = [...categoryList];
        selectedToAdd.forEach(catId => {
            if (!updatedList.includes(Number(catId))) {
                updatedList.push(Number(catId));
            }
        });

        if (typeof showToast === 'function') showToast('Updating categories...', { type: 'info', duration: 1500 });
        const success = await sendCategoryUpdate(updatedList);

        if (success) {
            // Only save locally if server succeeded
            saveCategoryListLocal(updatedList);
            selectedToAdd = [];
            if (typeof showToast === 'function') showToast('Categories added!', { type: 'success', duration: 2000 });
            if (typeof renderCategoryStrip === 'function') renderCategoryStrip();
            refreshModal();
        }
        // If failed, don't save locally - keep old list
    }

    // Attach event handlers
    function attachHandlers(contentElement, modalInstance, modalId) {
        // Remove Selected button
        const removeBtn = document.getElementById('ctRemoveSelectedBtn_' + modalId);
        if (removeBtn) {
            const newRemoveBtn = removeBtn.cloneNode(true);
            removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
            newRemoveBtn.addEventListener('click', async function () {
                await processRemoveSelected();
            });
        }

        // Add Selected button
        const addBtn = document.getElementById('ctAddSelectedBtn_' + modalId);
        if (addBtn) {
            const newAddBtn = addBtn.cloneNode(true);
            addBtn.parentNode.replaceChild(newAddBtn, addBtn);
            newAddBtn.addEventListener('click', async function () {
                await processAddSelected();
            });
        }

        // Toggle remove buttons (in selected list)
        contentElement.querySelectorAll('.ct-remove-toggle-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const catId = Number(this.getAttribute('data-cat-id'));
                const index = selectedToRemove.indexOf(catId);
                if (index >= 0) {
                    selectedToRemove.splice(index, 1);
                } else {
                    selectedToRemove.push(catId);
                }
                refreshModal();
            });
        });

        // Toggle add buttons (in available list)
        contentElement.querySelectorAll('.ct-add-toggle-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const catId = Number(this.getAttribute('data-cat-id'));
                const index = selectedToAdd.indexOf(catId);
                if (index >= 0) {
                    selectedToAdd.splice(index, 1);
                } else {
                    selectedToAdd.push(catId);
                }
                refreshModal();
            });
        });
    }

    // Set modal height
    function setModalHeight(modalElement) {
        if (!modalElement) return;
        setTimeout(() => {
            const modalDialog = modalElement.querySelector('.modal-dialog');
            const modalContent = modalElement.querySelector('.modal-content');
            const modalBody = modalElement.querySelector('.modal-body');
            if (modalDialog) { modalDialog.style.maxHeight = '95vh'; modalDialog.style.marginTop = '60px'; }
            if (modalContent) { modalContent.style.maxHeight = '90vh'; modalContent.style.overflow = 'auto'; }
            if (modalBody) { modalBody.style.maxHeight = 'calc(90vh - 120px)'; modalBody.style.overflow = 'auto'; padding: '0'; }
        }, 100);
    }

    // Add styles
    function addStyles() {
        if (document.getElementById('manageCategoriesStyles')) return;
        const style = document.createElement('style');
        style.id = 'manageCategoriesStyles';
        style.textContent = `
            .ct-marked-remove { background: #fff5f5 !important; text-decoration: line-through; opacity: 0.7; border-color: #dc3545 !important; }
            .ct-marked-add { background: #e8f5e9 !important; border-color: #28a745 !important; }
            .ct-available-item { transition: background 0.2s ease; }
            .ct-available-item:hover { background: #f0f7ff !important; }
        `;
        document.head.appendChild(style);
    }

    addStyles();

    console.log('mn_ct.js loaded successfully');

})();