const bpNoImage = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
 '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">' +
 '<rect width="200" height="200" fill="#f8f9fa"/>' +
 '<g fill="none" stroke="#adb5bd" stroke-width="6">' +
 '<rect x="45" y="55" width="110" height="90" rx="8"/>' +
 '<circle cx="110" cy="85" r="10"/>' +
 '<path d="M45 130l35-28 25 20 30-25 30 33"/>' +
 '</g>' +
 '<text x="100" y="170" font-family="Arial, sans-serif" font-size="14" fill="#adb5bd" text-anchor="middle">No Image</text>' +
 '</svg>'
);

// ==================== Product image picker (my1img / open_addimage) ====================
// Dims: [0] = display image, [1] = thumbnail. open_addimage returns g1 (display) and
// g2 (thumbnail) to the callback. The product stores them space-separated in `gu`
// (see getGoogleDriveImageUrl), and `hu` is left empty.
const bpImgDims = ["1920x1080px~1-511kb", "400x300px~1-31kb"];
let bpPickedImg1 = '';
let bpPickedImg2 = '';
let bpImageRemoved = false;

function bpImageValue() {
 return [bpPickedImg1, bpPickedImg2].filter(Boolean).join(' ');
}

// Reset state each time the Update Product modal opens (no stale pick from a
// previously opened product).
window.bpResetImageState = function () {
 bpPickedImg1 = '';
 bpPickedImg2 = '';
 bpImageRemoved = false;
};

// Callback passed to open_addimage (global so inline handlers can reach it).
window.bpAfterImageSet = function (img) {
 bpPickedImg1 = (img && (img.g1 || img.url)) || '';
 bpPickedImg2 = (img && img.g2) || '';
 bpImageRemoved = false;
 const disp = bpPickedImg1 || bpPickedImg2 || '';
 const preview = document.getElementById('bpImagePreview');
 const removeBtn = document.getElementById('bpRemoveImageBtn');
 if (preview) {
  preview.src = disp ? (typeof getGoogleDriveImageUrl === 'function' ? getGoogleDriveImageUrl(disp) : disp) : bpNoImage;
 }
 if (removeBtn) removeBtn.style.display = disp ? '' : 'none';
};

window.bpClearImage = function () {
 bpPickedImg1 = '';
 bpPickedImg2 = '';
 bpImageRemoved = true;
 const preview = document.getElementById('bpImagePreview');
 const removeBtn = document.getElementById('bpRemoveImageBtn');
 if (preview) preview.src = bpNoImage;
 if (removeBtn) removeBtn.style.display = 'none';
};

// Opens the my1img picker (csh item 24). Tabs: URL + Upload + Camera (default URL).
// Server-vs-local flow comes from b.da (`getDirectIdFromServer`); when off/absent the
// picker uses the local flow.
window.bpOpenImagePicker = function (existing) {
 if (typeof loadExe2Fn !== 'function') {
  if (typeof showToast === 'function') showToast('Image picker is unavailable');
  return;
 }
 const cc = (typeof my1uzr !== 'undefined' && window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].clientConfig) || {};
 return loadExe2Fn(24, [window.bpAfterImageSet, bpImgDims, { s: [1, 2, 3], de: 1 }, existing || '', cc.getDirectIdFromServer], [1]);
};

async function set_deup_prod_innerHTML(...params) {
 // Create modal using existing function
 const { contentElement, modalInstance } = create_modal_dynamically('productsModal');

 // Pagination variables
 let currentPage = 1;
 const itemsPerPage = 10;

 // Function to render products for current page
 function renderProducts() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return `
            <div class="row g-3" id="productsGrid">
                ${currentItems.map((item, index) => {
   const actualIndex = startIndex + index;
   return `
                    <div class="col-12 product-card" data-prod-name="${item.gn.toLowerCase()}">
                        <div class="card product-card-item h-100 border border-dark" data-prod-id="${item.a}" tabindex="0">
                            <div class="row g-0 h-100">
                                <!-- Image on left - 25% width -->
                                <div class="col-3">
                                    <div class="h-100 d-flex align-items-center bg-light" style="min-height: 120px;">
                                        <img src="${getGoogleDriveImageUrl(item.gu) || bpNoImage}" 
                                             alt="${item.gn}" 
                                             class="img-fluid rounded" 
                                             style="max-width: 100%; height: auto; max-height: 120px; object-fit: cover;"
                                             onerror="this.src=bpNoImage">
                                    </div>
                                </div>
                                <!-- Content on right - 75% width -->
                                <div class="col-9">
                                    <div class="card-body h-100 d-flex flex-column p-3">
                                        <div class="d-flex justify-content-between align-items-start h-100">
                                            <div class="flex-grow-1 me-3 d-flex flex-column justify-content-between h-100 w-100">
                                                <div>
                                                    <h6 class="card-title mb-2 text-truncate" title="${item.gn}">id:${item.g} ${item.gn}</h6>
                                                    <div class="text-muted small">
                                                        <!-- First row: ID, Category ID, and Stock in one line -->
                                                        <div class="mb-1 d-flex justify-content-between">
                                                            <span><strong>Stok ID:</strong> ${item.a}</span>
                                                            <span><strong>Qty:</strong> ${item.i}</span>
                                                        </div>
                                                        <!-- Second row: Purchase Price, Sales Price, and Dropdown in one line -->
                                                        <div class="mb-1 d-flex justify-content-between align-items-center">
                                                            <span><strong>p.pr:</strong> ₹${item.h}</span>
                                                            <span><strong>s.pr:</strong> ₹${item.k}</span>
                                                            <!-- Vertical ellipsis dropdown -->
                                                            <div class="dropdown">
                                                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                                                        type="button" 
                                                                        data-bs-toggle="dropdown" 
                                                                        aria-expanded="false">
                                                                    <i class="fas fa-ellipsis-v"></i>
                                                                </button>
                                                                <ul class="dropdown-menu dropdown-menu-end">
                                                                    <li>
                                                                        <button class="dropdown-item update-btn" data-index="${actualIndex}">
                                                                            <i class="fas fa-edit me-2"></i>Update
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button class="dropdown-item delete-btn text-danger" data-index="${actualIndex}">
                                                                            <i class="fas fa-trash me-2"></i>Delete
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `}).join('')}
            </div>
            ${currentItems.length === 0 ? '<div class="text-center text-muted py-4">No products found</div>' : ''}
            
            <!-- Pagination -->
            ${totalPages > 1 ? `
            <div class="d-flex justify-content-between align-items-center mt-4">
                <div class="text-muted small">
                    Showing ${startIndex + 1}-${Math.min(endIndex, items.length)} of ${items.length} products
                </div>
                <nav aria-label="Products pagination">
                    <ul class="pagination pagination-sm mb-0">
                        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                            <button class="page-link" data-page="${currentPage - 1}">Previous</button>
                        </li>
                        
                        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
                            <li class="page-item ${page === currentPage ? 'active' : ''}">
                                <button class="page-link" data-page="${page}">${page}</button>
                            </li>
                        `).join('')}
                        
                        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                            <button class="page-link" data-page="${currentPage + 1}">Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
            ` : ''}
        `;
 }

 // Set modal content with fixed header and footer, scrollable body
 contentElement.innerHTML = `
        <!-- Fixed Header -->
        <div class="modal-header border-bottom bg-light sticky-top" style="z-index: 1055;">
            <h5 class="modal-title fw-bold">Products Management</h5>
            <div class="d-flex gap-2 w-50">
                <input type="text" class="form-control border border-dark" id="productSearch" placeholder="Search products by name..." aria-label="Search products">
                <button class="btn btn-outline-secondary" type="button" id="clearSearch">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <!-- Scrollable Body -->
        <div class="modal-body" style="overflow-y: auto; max-height: calc(100vh - 200px);">
            ${renderProducts()}
        </div>
        
        <!-- Fixed Footer -->
        <div class="modal-footer border-top bg-light sticky-bottom">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    `;

 // Use event delegation for all interactions
 contentElement.addEventListener('input', function (e) {
  if (e.target && e.target.id === 'productSearch') {
   const searchTerm = e.target.value.toLowerCase().trim();
   const productCards = contentElement.querySelectorAll('.product-card');

   productCards.forEach(card => {
    const productName = card.getAttribute('data-prod-name');
    if (productName.includes(searchTerm)) {
     card.style.display = 'block';
    } else {
     card.style.display = 'none';
    }
   });
  }
 });

 contentElement.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'clearSearch') {
   const searchInput = contentElement.querySelector('#productSearch');
   const productCards = contentElement.querySelectorAll('.product-card');

   if (searchInput) {
    searchInput.value = '';
    productCards.forEach(card => {
     card.style.display = 'block';
    });
    searchInput.focus();
   }
  }

  // Handle pagination clicks
  if (e.target && e.target.classList.contains('page-link')) {
   e.preventDefault();
   const page = parseInt(e.target.getAttribute('data-page'));
   const totalPages = Math.ceil(items.length / itemsPerPage);

   if (page >= 1 && page <= totalPages && page !== currentPage) {
    currentPage = page;
    const modalBody = contentElement.querySelector('.modal-body');
    modalBody.innerHTML = renderProducts();

    // Focus first card of new page
    const firstCard = modalBody.querySelector('.product-card-item');
    if (firstCard) {
     firstCard.focus();
    }
   }
  }

  // Handle update button clicks using event delegation
  if (e.target && (e.target.classList.contains('update-btn') || e.target.closest('.update-btn'))) {
   const btn = e.target.classList.contains('update-btn') ? e.target : e.target.closest('.update-btn');
   const index = btn.getAttribute('data-index');
   updateProduct(index);
  }

  // Handle delete button clicks using event delegation
  if (e.target && (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn'))) {
   const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
   const index = btn.getAttribute('data-index');
   deleteProduct(index);
  }
 });

 // Add keyboard navigation to the modal itself
 const modalElement = document.getElementById('productsModal');
 if (modalElement) {
  modalElement.addEventListener('keydown', handleKeyboardNavigation);

  // Focus first card when modal is shown
  modalElement.addEventListener('shown.bs.modal', function () {
   const firstCard = contentElement.querySelector('.product-card-item');
   if (firstCard) {
    firstCard.focus();
   }
  });
 }

 function handleKeyboardNavigation(e) {
  const modalBody = contentElement.querySelector('.modal-body');
  const cards = modalBody.querySelectorAll('.product-card-item');
  const currentCard = document.activeElement.closest('.product-card-item');

  if (!currentCard) return;

  const currentIndex = Array.from(cards).indexOf(currentCard);

  switch (e.key) {
   case 'ArrowUp':
    e.preventDefault();
    if (currentIndex > 0) {
     cards[currentIndex - 1].focus();
     // Scroll into view if needed
     cards[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    break;
   case 'ArrowDown':
    e.preventDefault();
    if (currentIndex < cards.length - 1) {
     cards[currentIndex + 1].focus();
     // Scroll into view if needed
     cards[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    break;
   case 'Enter':
    e.preventDefault();
    if (document.activeElement.classList.contains('product-card-item')) {
     const card = document.activeElement;
     const dropdownBtn = card.querySelector('.dropdown-toggle');
     if (dropdownBtn) {
      dropdownBtn.click();
     }
    }
    break;
   case 'Delete':
    e.preventDefault();
    if (document.activeElement.classList.contains('product-card-item')) {
     const card = document.activeElement;
     const deleteBtn = card.querySelector('.delete-btn');
     if (deleteBtn) {
      const index = deleteBtn.getAttribute('data-index');
      deleteProduct(index);
     }
    }
    break;
   case 'Home':
    e.preventDefault();
    if (cards.length > 0) {
     cards[0].focus();
     cards[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    break;
   case 'End':
    e.preventDefault();
    if (cards.length > 0) {
     cards[cards.length - 1].focus();
     cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    break;
  }
 }

 function updateProduct(index) {
  const item = items[index];
  const { contentElement: updateModalContent, modalInstance: updateModalInstance } = create_modal_dynamically('updateProductModal');

  // Clear any previous pick so the picker starts fresh for this product
  bpResetImageState();

  updateModalContent.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Update Product</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form id="updateProductForm">
                <div class="row">
                    <div class="col-12 mb-4">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Product Image; Stock id ${item.a}</label>
                            <div class="border border-dark rounded p-3 text-center bg-light mb-2">
                                <img src="${getGoogleDriveImageUrl(item.gu) || bpNoImage}"
                                     alt="Product Image"
                                     class="img-fluid rounded"
                                     style="max-width: 100%; height: auto; max-height: 200px; object-fit: cover;"
                                     onerror="this.src=bpNoImage"
                                     id="bpImagePreview">
                            </div>
                            <div class="d-flex gap-2">
                                <button type="button" class="btn btn-outline-primary flex-grow-1"
                                    onclick="bpOpenImagePicker('')">
                                    <i class="fas fa-image me-1"></i> Add / Change Image
                                </button>
                                <button type="button" class="btn btn-outline-danger" id="bpRemoveImageBtn"
                                    onclick="bpClearImage()"
                                    style="${item.gu ? '' : 'display:none'}">Remove</button>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="productName" class="form-label fw-bold">Prod Nm (gn) ID ${item.g}</label>
                                <input type="text" class="form-control border border-dark" id="productName" value="${item.gn}" required>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-6 mb-3">
                                        <label for="productStock" class="form-label fw-bold">Stock Q (i)</label>
                                        <input type="number" class="form-control border border-dark" id="productStock" value="${item.i}" required>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label for="productPrice" class="form-label fw-bold">Price (k)</label>
                                        <input type="number" class="form-control border border-dark" id="productPrice" value="${item.k}" step="0.01" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ADD THIS NEW CHECKBOX SECTION -->
                    <div class="col-12">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="allowSaleWithoutStock" 
                                   ${item.d === 111 ? 'checked' : ''}>
                            <label class="form-check-label" for="allowSaleWithoutStock">
                                Allow sale without stock
                            </label>
                        </div>
                        <div class="form-text text-muted small">
                            When enabled, this product can be sold even when stock quantity is zero or negative.
                        </div>
                    </div>
                    <!-- END OF NEW CHECKBOX SECTION -->
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="saveUpdateBtn">Save Changes</button>
        </div>
    `;

  if (updateModalInstance) {
   updateModalInstance.show();
  } else {
   // Fallback: get the modal and show it manually
   const modalElement = document.getElementById('updateProductModal');
   if (modalElement) {
    const bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();
   }
  }

  async function saveProductChanges() {
   const nameInput = updateModalContent.querySelector('#productName');
   const stockInput = updateModalContent.querySelector('#productStock');
   const priceInput = updateModalContent.querySelector('#productPrice');
   const allowSaleCheckbox = updateModalContent.querySelector('#allowSaleWithoutStock');

   if (nameInput && stockInput && priceInput) {
    const itemName = nameInput.value.trim();
    const itemStock = parseInt(stockInput.value.trim());
    const itemPrice = parseFloat(priceInput.value.trim());
    // Image comes from the my1img picker: `gu` = "displayId thumbnailId".
    // If nothing was picked, keep the existing value; if Remove was pressed, clear it.
    const pickedImage = bpImageValue();
    const itemUrl = pickedImage || (bpImageRemoved ? '' : (item.gu || ''));
    const allowSaleWithoutStock = allowSaleCheckbox ? allowSaleCheckbox.checked : false;

    // Validation
    if (!itemName || isNaN(itemPrice) || itemPrice <= -1 || isNaN(itemStock)) {
     alert("Please enter valid product details.");
     return;
    }
    // Validation
    if (itemName.length > 32) {
     alert("Name cannot be more than 32 chars.");
     return;
    }

    try {
     // Create payload as per your structure (gu = combined image ids, hu left empty)
     var p = { e: itemName, g: itemUrl, h: '' };
     var s = { k: itemPrice, i: itemStock };
     if (allowSaleWithoutStock) { s.d = 111; }
     payload0.p = p;
     payload0.s = s;
     payload0.x1 = item.a; // stock id
     payload0.x2 = item.g; // product id
     payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'c' }, { "tb": 'b' }, { "tb": 'i' }, { "tb": 'r' }, { "tb": 'be', "col": 'eb', "cl": "eb" }, { "tb": 'ba' }, { "tb": 'p' }, { "tb": 's' }]);

     payload0.vw = 1;
     payload0.fn = 25;
     const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
     if (response.su == 1) {
      handl_op_rspons(response, 0);
      setTimeout(async () => {
       items = await dbDexieManager.getAllRecords(dbnm, "s") || [];
       // Refresh the main modal
       const modalBody = contentElement.querySelector('.modal-body');
       modalBody.innerHTML = renderProducts();
      }, 1000);

      // Close the update modal
      bootstrap.Modal.getInstance(document.getElementById('updateProductModal')).hide();
     } else {
      alert(response.ms);
     }
    } catch (error) {
     console.error("Update failed:", error);
     showToast("Update error - please try again");
    }
   }
  }

  updateModalContent.addEventListener('click', function (e) {
   if (e.target && e.target.id === 'saveUpdateBtn') {
    saveProductChanges();
   }
  });

  // Also allow Enter key in form fields to save
  updateModalContent.addEventListener('keypress', function (e) {
   if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
    saveProductChanges();
   }
  });
 }

 function deleteProduct(index) {
  const item = items[index];
  const { contentElement: deleteModalContent, modalInstance: deleteModalInstance } = create_modal_dynamically('deleteProductModal');

  deleteModalContent.innerHTML = `
            <div class="modal-header">
                <h5 class="modal-title">Delete Product</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-3 border border-dark rounded p-3 bg-light">
                    <img src="${getGoogleDriveImageUrl(item.gu) || bpNoImage}" 
                         alt="${item.gn}" 
                         class="img-fluid rounded" 
                         style="max-width: 100%; height: auto; max-height: 100px; object-fit: cover;"
                         onerror="this.src=bpNoImage">
                </div>
                <p>Are you sure you want to delete product?</p>
                <p><strong>"${item.gn}"</strong></p>
                <p class="text-danger">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete Product</button>
            </div>
        `;

  if (deleteModalInstance) {
   deleteModalInstance.show();
  } else {
   // Fallback: get the modal and show it manually
   const modalElement = document.getElementById('deleteProductModal');
   if (modalElement) {
    const bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();
   }
  }

  deleteModalContent.addEventListener('click', function (e) {
   if (e.target && e.target.id === 'confirmDeleteBtn') {
    // Implement actual delete logic here
    // For now, just remove from local array and refresh
    items.splice(index, 1);
    bootstrap.Modal.getInstance(document.getElementById('deleteProductModal')).hide();

    // Refresh the main modal
    const modalBody = contentElement.querySelector('.modal-body');
    modalBody.innerHTML = renderProducts();
   }
  });
 }

 if (modalInstance) {
  modalInstance.show();
 } else {
  // Fallback: get the modal and show it manually
  const modalElement = document.getElementById('productsModal');
  if (modalElement) {
   const bsModal = new bootstrap.Modal(modalElement);
   bsModal.show();
  }
 }
}