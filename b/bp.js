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

// ==================== HSN helper ====================
// Mirrors bgtiv.js allowHsnInput: digits only, maximum 8 characters.
function bpSanitizeHsn(raw) {
 return String(raw == null ? '' : raw).replace(/[^0-9]/g, '').slice(0, 8);
}
window.bpAllowHsnInput = function (input) {
 if (!input) return;
 const next = bpSanitizeHsn(input.value);
 if (input.value !== next) input.value = next;
};

// ==================== Tax 1 % / Tax 2 % helpers ====================
// Product rows keep the rates on p.j / p.k; stock rows carry the same values
// as tax1 / tax2 aliases. Legacy rows only have the tax amount in s.t.
function bpProductForStock(item) {
 const pid = item && item.g;
 const list = Array.isArray(window.prods) ? window.prods : [];
 return list.find(function (pr) { return pr && String(pr.a) === String(pid); }) || null;
}

async function bpGetProductForStock(item, forceReload) {
 let prod = forceReload ? null : bpProductForStock(item);
 if (prod) return prod;
 try {
  if (typeof dbDexieManager !== 'undefined' && dbDexieManager && typeof dbDexieManager.getAllRecords === 'function') {
   const databaseName = (typeof dbnm !== 'undefined') ? dbnm : window.dbnm;
   const rows = await dbDexieManager.getAllRecords(databaseName, 'p') || [];
   prod = rows.find(function (pr) { return String(pr && pr.a) === String(item && item.g); }) || null;
   if (prod) {
    window.prods = rows;
    if (typeof prods !== 'undefined') prods = rows;
   }
  }
 } catch (e) { /* ignore */ }
 return prod;
}

function bpTaxRates(item) {
 if (typeof window.productTaxRates === 'function') return window.productTaxRates(item);
 const tax1 = parseFloat(item && item.tax1);
 const tax2 = parseFloat(item && item.tax2);
 if (Number.isFinite(tax1) || Number.isFinite(tax2)) {
  return { tax1: Number.isFinite(tax1) ? tax1 : 0, tax2: Number.isFinite(tax2) ? tax2 : 0 };
 }
 return { tax1: 0, tax2: 0 };
}

function bpTaxLabel(rates) {
 const tax1 = Math.max(0, parseFloat(rates && rates.tax1) || 0);
 const tax2 = Math.max(0, parseFloat(rates && rates.tax2) || 0);
 if (tax1 > 0 && tax2 > 0) return tax1.toFixed(2) + '% + ' + tax2.toFixed(2) + '%';
 return (tax1 + tax2).toFixed(2) + '%';
}

// Read the selling price only from s.l (sold_in). Unlike the global helper in
// b.js, this never falls back to s.k (purchase price).
function bpSellingPriceFromL(item) {
 const raw = item && (item.l != null ? item.l : (item.sold_in != null ? item.sold_in : item.soldIn));
 const first = Array.isArray(raw) ? raw[0] : raw;
 const str = String(first == null ? '' : first).trim();
 if (!str) return 0;
 const parts = str.split('~');
 if (parts.length < 2) return 0;
 const m = parts[1].match(/^\s*([\d.]+)\s*-\s*([\d.]+)/);
 if (!m) return 0;
 const price = parseFloat(m[2]);
 return Number.isFinite(price) ? price : 0;
}

function bpEscapeAttr(raw) {
 return String(raw == null ? '' : raw)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
}

function bpStockRows() {
 if (Array.isArray(window.bpStockRowsCache)) return window.bpStockRowsCache;
 if (typeof items !== 'undefined' && Array.isArray(items)) return items;
 if (Array.isArray(window.items)) return window.items;
 return [];
}

// Resolve a clicked row by stable IDs. Numeric references are kept only for
// external callers that still pass an index into the unfiltered items array.
function bpResolveItem(ref) {
 const list = bpStockRows();
 if (ref == null) return null;
 if (typeof ref === 'object') {
  if (list.indexOf(ref) !== -1) return ref;
  const sid = ref.a != null && String(ref.a).trim() !== '' ? String(ref.a) : '';
  const pid = ref.g != null && String(ref.g).trim() !== '' ? String(ref.g) : '';
  if (!sid && !pid) return null;
  let match = null;
  if (sid && pid) match = list.find(function (row) { return row && String(row.a) === sid && String(row.g) === pid; }) || null;
  if (!match && sid) match = list.find(function (row) { return row && String(row.a) === sid; }) || null;
  if (!match && pid) match = list.find(function (row) { return row && String(row.g) === pid; }) || null;
  return match;
 }
 const text = String(ref).trim();
 if (!text) return null;
 const idx = Number(text);
 if (Number.isInteger(idx) && idx >= 0 && idx < list.length) return list[idx];
 return null;
}

function bpItemFromButton(btn) {
 if (!btn) return null;
 const item = bpResolveItem({
  a: btn.getAttribute('data-stock-id'),
  g: btn.getAttribute('data-product-id')
 });
 if (item) return item;
 const card = btn.closest ? btn.closest('[data-prod-name]') : null;
 const name = card && card.getAttribute('data-prod-name');
 if (name) {
  const byName = bpStockRows().find(function (row) {
   return String((row && row.gn) || '').toLowerCase() === String(name).toLowerCase();
  });
  if (byName) return byName;
 }
 return null;
}

function bpWarnItemNotFound() {
 if (typeof showToast === 'function') showToast('Product not found - please refresh the list', { type: 'error', duration: 2500 });
 else if (typeof window.showelsemodal === 'function') window.showelsemodal('Product not found - please refresh the list');
}

function bpCloseProductMenus() {
 try {
  if (window.bootstrap && bootstrap.Dropdown && typeof bootstrap.Dropdown.clearMenus === 'function') {
   bootstrap.Dropdown.clearMenus();
   return;
  }
 } catch (e) { /* ignore */ }
 // Older Bootstrap builds may not expose clearMenus(); dispose the product
 // toggles and remove any menu that was appended to <body>.
 document.querySelectorAll('#bpProductsList .dropdown-toggle').forEach(function (toggle) {
  try {
   const instance = (window.bootstrap && bootstrap.Dropdown) ? bootstrap.Dropdown.getInstance(toggle) : null;
   if (instance) { instance.hide(); instance.dispose(); }
  } catch (e) { /* ignore */ }
 });
 document.querySelectorAll('body > .bp-products-menu').forEach(function (menu) { menu.remove(); });
}

function bpSanitizeTaxText(raw) {
 let value = String(raw == null ? '' : raw).replace(/,/g, '.').replace(/[^0-9.]/g, '');
 const firstDot = value.indexOf('.');
 if (firstDot !== -1) {
  value = value.slice(0, firstDot + 1) + value.slice(firstDot + 1).replace(/\./g, '');
 }
 const parts = value.split('.');
 const intPart = (parts[0] || '').slice(0, 2);
 const decPart = parts.length > 1 ? parts[1].slice(0, 2) : '';
 return parts.length > 1 ? intPart + '.' + decPart : intPart;
}

function bpSanitizeTaxField(input) {
 if (!input) return;
 const next = bpSanitizeTaxText(input.value);
 if (input.value !== next) input.value = next;
}

function bpNormalizeTaxField(input) {
 if (!input) return;
 const number = parseFloat(input.value);
 const safe = Number.isFinite(number) ? Math.min(99.99, Math.max(0, number)) : 0;
 input.value = (Math.round(safe * 100) / 100).toFixed(2);
}

function bpReadTaxPercent(input) {
 if (!input) return 0;
 const number = parseFloat(input.value);
 if (!Number.isFinite(number) || number < 0) return 0;
 return Math.round(Math.min(99.99, number) * 100) / 100;
}

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
// Server-vs-local flow comes from 0.da (`cust_da_const.getDirectIdFromServer`);
// when off/absent the picker uses the local flow.
window.bpOpenImagePicker = function (existing) {
 if (typeof loadExe2Fn !== 'function') {
  if (typeof showToast === 'function') showToast('Image picker is unavailable');
  return;
 }
 const state = (typeof my1uzr !== 'undefined' && window[my1uzr.worknOnPg]) || {};
 const getDirectIdFromServer =
  state.clientConfigByAdm?.cust_da_const?.getDirectIdFromServer
  ?? state.clientConfig?.cust_da_const?.getDirectIdFromServer
  ?? 0;
 return loadExe2Fn(11, [window.bpAfterImageSet, bpImgDims, { s: [1, 2, 3], de: 1 }, existing || '', getDirectIdFromServer], [1]);
};

async function bpEnrichStockItems(list, forceReload) {
 const arr = Array.isArray(list) ? list : [];
 let products = forceReload ? [] : (Array.isArray(window.prods) ? window.prods : (typeof prods !== 'undefined' && Array.isArray(prods) ? prods : []));
 if ((forceReload || !products.length) && typeof dbDexieManager !== 'undefined' && dbDexieManager && typeof dbDexieManager.getAllRecords === 'function') {
  try {
   const databaseName = (typeof dbnm !== 'undefined') ? dbnm : window.dbnm;
   products = await dbDexieManager.getAllRecords(databaseName, 'p') || [];
   if (typeof prods !== 'undefined') prods = products;
   window.prods = products;
  } catch (e) { /* ignore */ }
 }
 const byId = new Map();
 products.forEach(function (p) { if (p && p.a != null) byId.set(String(p.a), p); });
 arr.forEach(function (item) {
  if (!item) return;
  const prod = byId.get(String(item.g));
  // The product row matched by s.g is authoritative for display name/image.
  if (prod) {
   if (prod.e != null && String(prod.e).trim() !== '') item.gn = String(prod.e);
   if (prod.g != null && String(prod.g).trim() !== '') item.gu = String(prod.g);
   const prodTax1 = parseFloat(prod.j);
   const prodTax2 = parseFloat(prod.k);
   if (Number.isFinite(prodTax1)) item.tax1 = prodTax1;
   if (Number.isFinite(prodTax2)) item.tax2 = prodTax2;
  }
  if (item.gn == null || String(item.gn).trim() === '') item.gn = '';
  if (item.gu == null || String(item.gu).trim() === '') item.gu = '';
 });
 return arr;
}

async function set_deup_prod_innerHTML(...params) {
 // Create modal using existing function
 const { contentElement, modalInstance } = create_modal_dynamically('productsModal');

 // Keep the products modal slightly below the top and tall enough to work with.
 const productsModalEl = document.getElementById('productsModal');
 if (productsModalEl) {
  const dialog = productsModalEl.querySelector('.modal-dialog');
  if (dialog) {
   dialog.style.margin = '8vh auto 0';
   dialog.style.height = 'auto';
   dialog.style.maxHeight = '84vh';
   dialog.style.minHeight = '80vh';
  }
  const outerBody = productsModalEl.querySelector('.modal-body');
  if (outerBody) outerBody.style.maxHeight = '84vh';
  const modalContent = productsModalEl.querySelector('.modal-content');
  if (modalContent) modalContent.style.minHeight = '80vh';
 }

 // Pagination variables
 let currentPage = 1;
 const itemsPerPage = 10;
 let productSearchTerm = '';

 async function bpReadFreshStockRows() {
  try {
   if (typeof dbDexieManager !== 'undefined' && dbDexieManager && typeof dbDexieManager.getAllRecords === 'function') {
    const databaseName = (typeof dbnm !== 'undefined') ? dbnm : window.dbnm;
    const rows = await dbDexieManager.getAllRecords(databaseName, 's') || [];
    window.bpStockRowsCache = rows;
    return rows;
   }
  } catch (e) { console.warn('Fresh stock read failed', e); }
  return bpStockRows();
 }

 function bpGetFilteredItems() {
  const rows = bpStockRows();
  return productSearchTerm
   ? rows.filter(function (it) { return String(it && it.gn || '').toLowerCase().includes(productSearchTerm); })
   : rows;
 }

 // Function to render products for current page
 function renderProducts() {
  window.renderProducts = renderProducts;
  const filteredItems = bpGetFilteredItems();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return `
            <div class="row g-3" id="productsGrid">
                ${currentItems.map((item, index) => {
   const taxRates = bpTaxRates(item);
   const stockIdAttr = bpEscapeAttr(item && item.a);
   const productIdAttr = bpEscapeAttr(item && item.g);
   const itemName = String(item && item.gn || '').trim() || 'Unnamed Product';
   const itemImg = getGoogleDriveImageUrl(item && item.gu) || bpNoImage;
   return `
                    <div class="col-12 product-card" data-prod-name="${itemName.toLowerCase().replace(/"/g, '&quot;')}">
                        <div class="card product-card-item h-100 border border-dark" data-prod-id="${item.a}" data-stock-id="${stockIdAttr}" data-product-id="${productIdAttr}" tabindex="0">
                            <div class="row g-0 h-100">
                                <!-- Image on left - 25% width -->
                                <div class="col-3">
                                    <div class="h-100 d-flex align-items-center bg-light" style="min-height: 120px;">
                                        <img src="${itemImg}" 
                                             alt="${itemName.replace(/"/g, '&quot;')}" 
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
                                                    <h6 class="card-title mb-2 text-truncate" title="${itemName.replace(/"/g, '&quot;')}">id:${item.g} ${itemName}</h6>
                                                    <div class="text-muted small">
                                                        <!-- First row: ID, Category ID, and Stock in one line -->
                                                        <div class="mb-1 d-flex justify-content-between">
                                                            <span><strong>Stok ID:</strong> ${item.a}</span>
                                                            <span><strong>Qty:</strong> ${item.i}</span>
                                                        </div>
                                                        <div class="mb-1 d-flex justify-content-between">
                                                            <span><strong>Tax:</strong> ${bpTaxLabel(taxRates)}</span>
                                                        </div>
                                                        <!-- Second row: Purchase Price, Sales Price, and Dropdown in one line -->
                                                        <div class="mb-1 d-flex justify-content-between align-items-center">
                                                            <span><strong>p.pr:</strong> ₹${item.k}</span>
                                                            <span><strong>s.pr:</strong> ₹${bpSellingPriceFromL(item)}</span>
                                                            <!-- Vertical ellipsis dropdown -->
                                                            <div class="dropdown">
                                                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                                                        type="button" 
                                                                        data-bs-toggle="dropdown" 
                                                                        data-bs-container="body" 
                                                                        data-bs-boundary="viewport" 
                                                                        aria-expanded="false">
                                                                    <i class="fas fa-ellipsis-v"></i>
                                                                </button>
                                                                <ul class="dropdown-menu dropdown-menu-end border border-dark bp-products-menu" style="z-index: 9999 !important;">
                                                                    <li>
                                                                        <button class="dropdown-item add-stock-btn" data-stock-id="${stockIdAttr}" data-product-id="${productIdAttr}">
                                                                            <i class="fas fa-boxes-stacked me-2"></i>Add stock
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button class="dropdown-item update-btn" data-stock-id="${stockIdAttr}" data-product-id="${productIdAttr}">
                                                                            <i class="fas fa-edit me-2"></i>Update Product
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button class="dropdown-item delete-btn text-danger" data-stock-id="${stockIdAttr}" data-product-id="${productIdAttr}">
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
                    Showing ${startIndex + 1}-${Math.min(endIndex, filteredItems.length)} of ${filteredItems.length} products
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

 const bpInitialRows = await bpReadFreshStockRows();
 await bpEnrichStockItems(bpInitialRows, true);

 // Set modal content with fixed header and footer, scrollable body
 contentElement.innerHTML = `
        <!-- Fixed Header -->
        <div class="modal-header border-bottom bg-light sticky-top" style="z-index: 1055;">
            <h5 class="modal-title fw-bold">Products Management</h5>
            <div class="d-flex gap-2 w-50">
                <input type="text" class="form-control me-2 border border-dark" id="productSearch" placeholder="Search products by name..." aria-label="Search products">
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <!-- Scrollable Body -->
        <div class="modal-body" style="overflow-y: auto; max-height: calc(80vh - 150px);">
            <div id="bpProductsList" style="height: auto; min-height: 50vh;">${renderProducts()}</div>
        </div>
        
        <!-- Fixed Footer -->
        <div class="modal-footer border-top bg-light sticky-bottom">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    `;

 function bpRenderProducts() {
  bpCloseProductMenus();
  const list = contentElement.querySelector('#bpProductsList');
  if (list) list.innerHTML = renderProducts();
 }

 const refreshProductsList = async function () {
  const rows = await bpReadFreshStockRows();
  await bpEnrichStockItems(rows, true);
  bpRenderProducts();
 };
 window.bpRefreshProductsList = refreshProductsList;

 // Use event delegation for all interactions
 contentElement.addEventListener('input', function (e) {
  if (e.target && e.target.id === 'productSearch') {
   productSearchTerm = e.target.value.toLowerCase().trim();
   currentPage = 1;
   bpRenderProducts();
   const inp = contentElement.querySelector('#productSearch');
   if (inp) { inp.focus(); try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (err) { } }
  }
 });

 contentElement.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'clearSearch') {
   productSearchTerm = '';
   currentPage = 1;
   const searchInput = contentElement.querySelector('#productSearch');
   if (searchInput) searchInput.value = '';
   bpRenderProducts();
   if (searchInput) searchInput.focus();
  }

  // Handle pagination clicks
  if (e.target && e.target.classList.contains('page-link')) {
   e.preventDefault();
   const page = parseInt(e.target.getAttribute('data-page'));
   const totalPages = Math.ceil(bpGetFilteredItems().length / itemsPerPage);

   if (page >= 1 && page <= totalPages && page !== currentPage) {
    currentPage = page;
    bpRenderProducts();

    // Focus first card of new page
    const firstCard = contentElement.querySelector('.product-card-item');
    if (firstCard) {
     firstCard.focus();
    }
   }
  }

 });

 function bpProductsActionHandler(e) {
  const btn = e.target && e.target.closest
   ? e.target.closest('.add-stock-btn, .update-btn, .delete-btn')
   : null;
  if (!btn || !btn.closest('.bp-products-menu')) return;
  const item = bpItemFromButton(btn);
  if (!item) { bpWarnItemNotFound(); return; }
  if (btn.classList.contains('add-stock-btn')) bpAddStock(item);
  else if (btn.classList.contains('update-btn')) updateProduct(item);
  else if (btn.classList.contains('delete-btn')) deleteProduct(item);
 }
 document.addEventListener('click', bpProductsActionHandler);

 // Add keyboard navigation to the modal itself
 const modalElement = document.getElementById('productsModal');
 if (modalElement) {
  modalElement.addEventListener('keydown', handleKeyboardNavigation);

  modalElement.addEventListener('hidden.bs.modal', function () {
   document.removeEventListener('click', bpProductsActionHandler);
   if (window.bpRefreshProductsList === refreshProductsList) window.bpRefreshProductsList = null;
   bpCloseProductMenus();
  }, { once: true });

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
     const item = bpItemFromButton(card);
     if (!item) { bpWarnItemNotFound(); return; }
     deleteProduct(item);
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

 async function updateProduct(itemRef) {
  const item = bpResolveItem(itemRef);
  if (!item) { bpWarnItemNotFound(); return; }
  const product = await bpGetProductForStock(item, true);
  const displayName = (product && String(product.e || '').trim()) ? String(product.e) : (item.gn || '');
  const displayImg = (product && String(product.g || '').trim()) ? String(product.g) : (item.gu || '');
  const productTax = bpTaxRates(item);
  const tax1 = Math.max(0, parseFloat(productTax.tax1) || parseFloat(product && product.j) || 0);
  const tax2 = Math.max(0, parseFloat(productTax.tax2) || parseFloat(product && product.k) || 0);
  const hsn = (product && product.i != null && String(product.i).trim() !== '')
   ? String(product.i)
   : (item.hsn || '');
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
                                <img src="${getGoogleDriveImageUrl(displayImg) || bpNoImage}"
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
                                    style="${displayImg ? '' : 'display:none'}">Remove</button>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="productName" class="form-label fw-bold">Prod Name ID: ${item.g}</label>
                                <input type="text" class="form-control border border-dark" id="productName" value="${displayName}" required>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-12 mb-3">
                                        <label for="productHsn" class="form-label fw-bold">HSN Code</label>
                                        <input type="text" inputmode="numeric" autocomplete="off" maxlength="8" class="form-control border border-dark" id="productHsn" value="${bpSanitizeHsn(hsn)}" placeholder="HSN code" title="HSN code" oninput="window.bpAllowHsnInput(this)">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12" id="bpTaxRow">
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label for="productTax1" class="form-label fw-bold">Tax 1 %</label>
                                <input type="text" inputmode="decimal" autocomplete="off" class="form-control border border-dark" id="productTax1" value="${tax1.toFixed(2)}">
                            </div>
                            <div class="col-6 mb-3">
                                <label for="productTax2" class="form-label fw-bold">Tax 2 %</label>
                                <input type="text" inputmode="decimal" autocomplete="off" class="form-control border border-dark" id="productTax2" value="${tax2.toFixed(2)}">
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

  // hideTax = 1 -> keep the tax values/math, just don't show the two inputs.
  if (typeof window.taxDisplayHidden === 'function' && window.taxDisplayHidden()) {
   const bpTaxRow = updateModalContent.querySelector('#bpTaxRow');
   if (bpTaxRow) bpTaxRow.style.display = 'none';
  }

  ['productTax1', 'productTax2'].forEach(function (id) {
   const input = updateModalContent.querySelector('#' + id);
   if (!input) return;
   input.addEventListener('input', function () { bpSanitizeTaxField(input); });
   input.addEventListener('blur', function () { bpNormalizeTaxField(input); });
   const selectValue = function () { try { input.select(); } catch (e) {} };
   input.addEventListener('click', selectValue);
   input.addEventListener('focus', selectValue);
  });

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
   const hsnInput = updateModalContent.querySelector('#productHsn');
   const tax1Input = updateModalContent.querySelector('#productTax1');
   const tax2Input = updateModalContent.querySelector('#productTax2');
   const allowSaleCheckbox = updateModalContent.querySelector('#allowSaleWithoutStock');

   if (nameInput) {
    bpNormalizeTaxField(tax1Input);
    bpNormalizeTaxField(tax2Input);
    const itemName = nameInput.value.trim();
    const itemHsn = bpSanitizeHsn(hsnInput ? hsnInput.value : '');
    const itemTax1 = bpReadTaxPercent(tax1Input);
    const itemTax2 = bpReadTaxPercent(tax2Input);
    // Image comes from the my1img picker: `gu` = "displayId thumbnailId".
    // If nothing was picked, keep the existing value; if Remove was pressed, clear it.
    const pickedImage = bpImageValue();
    const itemUrl = pickedImage || (bpImageRemoved ? '' : (displayImg || ''));
    const allowSaleWithoutStock = allowSaleCheckbox ? allowSaleCheckbox.checked : false;

    // Validation
    if (!itemName) {
     window.showelsemodal("Please enter valid product details.");
     return;
    }
    // Validation
    if (itemName.length > 32) {
     window.showelsemodal("Name cannot be more than 32 chars.");
     return;
    }

    try {
     // Product-only update (no stock/price sent).
     var p = { a: item.g, e: itemName, g: itemUrl, h: '', i: itemHsn, j: itemTax1, k: itemTax2 };
     if (allowSaleWithoutStock) { p.d = 111; }
     await clearPayload0();
     payload0.p = p;
     payload0.x1 = item.a; // stock id
     payload0.x2 = item.g; // product id
     payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'c' }, { "tb": 'b' }, { "tb": 'i' }, { "tb": 'r' }, { "tb": 'be', "col": 'eb', "cl": "eb" }, { "tb": 'ba' }, { "tb": 'p' }, { "tb": 's' }]);
     payload0.fn = 25;
     payload0.ul = '2/0b.php';
     payload0.gt = 2;
     const response = await fnj4(null, payload0, 1, 1, null, 20000, 2, 1);
     //const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
     if (response.su == 1) {
      try {
       if (typeof window.handl_op_rspons === 'function') await window.handl_op_rspons(response, 0);
      } catch (e) { console.warn('handl_op_rspons failed', e); }
      if (typeof window.bpRefreshProductsList === 'function') {
       try { await window.bpRefreshProductsList(); } catch (e) { console.warn('Products refresh failed', e); }
      }
      const updateBsModal = bootstrap.Modal.getInstance(document.getElementById('updateProductModal'));
      if (updateBsModal) updateBsModal.hide();
     } else {
      window.showelsemodal(response.ms);
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

 function deleteProduct(itemRef) {
  const item = bpResolveItem(itemRef);
  if (!item) { bpWarnItemNotFound(); return; }
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

  deleteModalContent.addEventListener('click', async function (e) {
   if (e.target && e.target.id === 'confirmDeleteBtn') {
    // Implement actual delete logic here
    // For now, just remove from local array and refresh
    const rows = bpStockRows();
    const itemIndex = rows.indexOf(item);
    if (itemIndex !== -1) rows.splice(itemIndex, 1);
    if (typeof items !== 'undefined' && Array.isArray(items) && items !== rows) {
     const globalIndex = items.indexOf(item);
     if (globalIndex !== -1) items.splice(globalIndex, 1);
    }
    if (Array.isArray(window.items) && window.items !== rows) {
     const winIndex = window.items.indexOf(item);
     if (winIndex !== -1) window.items.splice(winIndex, 1);
    }
    await bpEnrichStockItems(rows);
    bootstrap.Modal.getInstance(document.getElementById('deleteProductModal')).hide();

    // Refresh the main modal
    bpRenderProducts();
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
}// ==================== Add Stock via bgtiv ====================
window.bpAddStock = async function (itemRef) {
 const item = bpResolveItem(itemRef);
 if (!item) { bpWarnItemNotFound(); return; }
 const product = await bpGetProductForStock(item, true);
 const displayName = (product && String(product.e || '').trim()) ? String(product.e) : (item.gn || '');
 const displayImg = (product && String(product.g || '').trim()) ? String(product.g) : (item.gu || '');
 const productTax = bpTaxRates(item);
 const tax1 = Math.max(0, parseFloat(productTax.tax1) || parseFloat(product && product.j) || 0);
 const tax2 = Math.max(0, parseFloat(productTax.tax2) || parseFloat(product && product.k) || 0);
 const hsn = (product && product.i != null && String(product.i).trim() !== '')
  ? String(product.i)
  : (item.hsn || '');

 window.bpAddStockContext = { stockId: item.a, productId: item.g };

 const prefill = {
  p: {
   e: displayName,
   i: hsn,
   j: tax1,
   k: tax2,
   g: item.g || ''
  },
  s: {
   h: item.h || '',
   i: item.i || '',
   j: item.measuredIn || item.measured_in || '',
   k: item.k || '',
   l: (function () {
    const v = item.l != null ? item.l : (item.sold_in != null ? item.sold_in : item.soldIn);
    return Array.isArray(v) ? v : (v ? [v] : []);
   })(),
   gu: displayImg,
   o: 0
  },
  mode: 'addStock',
  stockId: item.a,
  productId: item.g
 };

 if (typeof loadExe2Fn !== 'function') {
  if (typeof showToast === 'function') showToast('Add stock unavailable', { type: 'error', duration: 2000 });
  return;
 }
 try {
  loadExe2Fn(27, [[1, 1], window.bpAddStockCallback, prefill], [1]);
 } catch (e) {
  console.error('bpAddStock: failed to open bgtiv', e);
  if (typeof showToast === 'function') showToast('Add stock unavailable', { type: 'error', duration: 2000 });
 }
};

window.bpAddStockCallback = async function (ob) {
 const payload = Array.isArray(ob) ? ob[0] : ob;
 if (!payload) return;
 const s = payload.s || {};
 const fallbackCtx = window.bpAddStockContext || {};
 const ctx = {
  stockId: s.a != null ? s.a : fallbackCtx.stockId,
  productId: s.g != null ? s.g : fallbackCtx.productId
 };
 if (ctx.stockId != null) s.a = ctx.stockId;
 if (ctx.productId != null) s.g = ctx.productId;

 try {
  await clearPayload0();
  payload0.s = s;
  payload0.x1 = ctx.stockId;
  payload0.x2 = ctx.productId;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'c' }, { "tb": 'b' }, { "tb": 'i' }, { "tb": 'r' }, { "tb": 'be', "col": 'eb', "cl": "eb" }, { "tb": 'ba' }, { "tb": 'p' }, { "tb": 's' }]);
  payload0.fn = 25;
  payload0.ul = '2/0b.php';
  payload0.gt = 2;
  const response = await fnj4(null, payload0, 1, 1, null, 20000, 2, 1);
  //const response = await fnj3("https://my1.in/2/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
  if (response && response.su == 1) {
   try {
    if (typeof window.handl_op_rspons === 'function') await window.handl_op_rspons(response, 0);
   } catch (e) { console.warn('handl_op_rspons failed', e); }
   if (typeof showToast === 'function') showToast('Stock added successfully', { type: 'success', duration: 2000 });
   if (typeof window.bpRefreshProductsList === 'function') {
    try { await window.bpRefreshProductsList(); } catch (e) { console.warn('Products refresh failed', e); }
   }
  } else {
   if (typeof window.showelsemodal === 'function') window.showelsemodal(response?.ms || 'Failed');
  }
 } catch (error) {
  console.error('Add stock failed', error);
  if (typeof showToast === 'function') showToast('Add stock error - please try again', { type: 'error', duration: 2000 });
 }
};