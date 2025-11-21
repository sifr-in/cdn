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
                        <div class="card product-card-item h-100" data-prod-id="${item.a}" tabindex="0">
                            <div class="row g-0 h-100">
                                <!-- Image on left - 25% width -->
                                <div class="col-3">
                                    <div class="h-100 d-flex align-items-center bg-light" style="min-height: 120px;">
                                        <img src="${item.gu || '/favicon.ico'}" 
                                             alt="${item.gn}" 
                                             class="img-fluid w-100 h-100" 
                                             style="object-fit: cover;"
                                             onerror="this.src='/favicon.ico'">
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
                        
                        ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
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
                <input type="text" class="form-control" id="productSearch" placeholder="Search products by name..." aria-label="Search products">
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
    contentElement.addEventListener('input', function(e) {
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

    contentElement.addEventListener('click', function(e) {
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
        modalElement.addEventListener('shown.bs.modal', function() {
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

        switch(e.key) {
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
                                <label class="form-label fw-bold">Current Main Image; Stock id ${item.a}</label>
                                <div class="border rounded p-3 text-center bg-light mb-2">
                                    <img src="${item.gu || '/favicon.ico'}" 
                                         alt="Current Main Image" 
                                         class="img-fluid rounded"
                                         style="max-height: 200px; object-fit: contain;"
                                         onerror="this.src='/favicon.ico'"
                                         id="currentMainImage">
                                    <div class="mt-2 text-muted small">
                                        ${item.gu || 'No main image URL set'}
                                    </div>
                                </div>
                                <label for="newMainImage" class="form-label">New Main Image URL (gu)</label>
                                <input type="url" class="form-control" id="newMainImage" value="${item.gu || ''}" placeholder="https://example.com/main-image.jpg">
                            </div>
                        </div>
                        
                        <div class="col-12 mb-4">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Current Thumbnail Image</label>
                                <div class="border rounded p-3 text-center bg-light mb-2">
                                    <img src="${item.hu || '/favicon.ico'}" 
                                         alt="Current Thumbnail" 
                                         class="img-fluid rounded"
                                         style="max-height: 150px; object-fit: contain;"
                                         onerror="this.src='/favicon.ico'"
                                         id="currentThumbImage">
                                    <div class="mt-2 text-muted small">
                                        ${item.hu || 'No thumbnail URL set'}
                                    </div>
                                </div>
                                <label for="newThumbImage" class="form-label">New Thumbnail URL (hu)</label>
                                <input type="url" class="form-control" id="newThumbImage" value="${item.hu || ''}" placeholder="https://example.com/thumbnail.jpg">
                            </div>
                        </div>
                        
                        <div class="col-12">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="productName" class="form-label fw-bold">Prod Nm (gn) ID ${item.g}</label>
                                    <input type="text" class="form-control" id="productName" value="${item.gn}" required>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-6 mb-3">
                                            <label for="productStock" class="form-label fw-bold">Stock Q (i)</label>
                                            <input type="number" class="form-control" id="productStock" value="${item.i}" required>
                                        </div>
                                        <div class="col-6 mb-3">
                                            <label for="productPrice" class="form-label fw-bold">Price (k)</label>
                                            <input type="number" class="form-control" id="productPrice" value="${item.k}" step="0.01" required>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
    const newMainImageInput = updateModalContent.querySelector('#newMainImage');
    const newThumbImageInput = updateModalContent.querySelector('#newThumbImage');
    const stockInput = updateModalContent.querySelector('#productStock');
    const priceInput = updateModalContent.querySelector('#productPrice');
    
    if (nameInput && stockInput && priceInput) {
        const itemName = nameInput.value.trim();
        const itemStock = parseInt(stockInput.value.trim());
        const itemPrice = parseFloat(priceInput.value.trim());
        const itemUrl = newMainImageInput ? newMainImageInput.value.trim() : '';
        const itemThumb = newThumbImageInput ? newThumbImageInput.value.trim() : '';

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
// Create payload as per your structure
var p = { e: itemName, g: itemUrl, h: itemThumb };
var s = { k: itemPrice };
payload0.p = p;
payload0.s = s;
payload0.x1 = item.a; // stock id
payload0.x2 = item.g; // product id
payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{"tb":'c'},{"tb":'b'},{"tb":'i'},{"tb":'r'},{"tb":'be',"col":'eb',"cl":"eb"},{"tb":'ba'},{"tb":'p'},{"tb":'s'}]);

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

        // Event listeners for real-time preview updates
        updateModalContent.addEventListener('input', function(e) {
            if (e.target && e.target.id === 'newMainImage') {
                const imagePreview = updateModalContent.querySelector('#currentMainImage');
                if (imagePreview && e.target.value) {
                    imagePreview.src = e.target.value;
                }
            }
            if (e.target && e.target.id === 'newThumbImage') {
                const imagePreview = updateModalContent.querySelector('#currentThumbImage');
                if (imagePreview && e.target.value) {
                    imagePreview.src = e.target.value;
                }
            }
        });

        updateModalContent.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'saveUpdateBtn') {
                saveProductChanges();
            }
        });

        // Also allow Enter key in form fields to save
        updateModalContent.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                saveProductChanges();
            }
        });
    }

    function deleteProduct(index) {
        const item = items[index];
        const { contentElement: deleteModalContent, deletemdlInstance: deleteModalInstance } = create_modal_dynamically('deleteProductModal');
        
        deleteModalContent.innerHTML = `
            <div class="modal-header">
                <h5 class="modal-title">Delete Product</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-3">
                    <img src="${item.gu || '/favicon.ico'}" 
                         alt="${item.gn}" 
                         class="img-fluid rounded" 
                         style="max-height: 100px;"
                         onerror="this.src='/favicon.ico'">
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

        deleteModalContent.addEventListener('click', function(e) {
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