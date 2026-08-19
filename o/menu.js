// menu.js - Burger menu with navigation items
(function () {
    'use strict';

    console.log('menu.js initializing...');

    // Menu items configuration
    window.burgerMenuItems = [
        //{ "icon": "fa-home", "label": "Manage Category", "action": "newproductcate", "color": "#0d6efd" },
        //{ "icon": "fa-plus-circle", "label": "Manage Products", "action": "mn_prods", "color": "#198754" },
        //{ "icon": "fa-users", "label": "Manage Parties", "action": "parties", "color": "#6f42c1" },
        //{ "icon": "fa-percent", "label": "Manage Orders", "action": "mn_or", "color": "#dc3545" },
        //{ "icon": "fa-star", "label": "Best Sellers", "action": "bestsellers", "color": "#ffc107" },
        //{ "icon": "fa-clock", "label": "Recent Orders", "action": "recent", "color": "#0dcaf0" },
        //{ "icon": "fa-heart", "label": "Favorites", "action": "favorites", "color": "#d63384" },
        { "icon": "fa-broom", "label": "Clear Cache", "action": "clr_cache", "color": "#dc3545" },
        { "icon": "fa-cog", "label": "Settings", "action": "settings", "color": "#6c757d" },
        { "icon": "fa-info-circle", "label": "About", "action": "about", "color": "#6610f2" },
        { "icon": "fa-phone", "label": "Contact", "action": "contact", "color": "#fd7e14" },
        { "icon": "fa-sign-in-alt", "label": "Special Login", "action": "home", "color": "#0d6efd" },
    ];

    // Add admin menu items from config if they exist (at the top)
    if (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].adminMenuItems && Array.isArray(window[my1uzr.worknOnPg].adminMenuItems)) {
        window[my1uzr.worknOnPg].adminMenuItems.forEach(function (item) {
            window.burgerMenuItems.push(item);
        });
    }

    // Create burger menu elements
    function createBurgerMenuElements() {
        console.log('Creating burger menu elements...');

        // Remove existing if any
        const existingOverlay = document.getElementById('burgerMenuOverlay');
        const existingPanel = document.getElementById('burgerMenuPanel');
        if (existingOverlay) existingOverlay.remove();
        if (existingPanel) existingPanel.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'burgerMenuOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: none;
        `;
        overlay.onclick = closeBurgerMenu;
        document.body.appendChild(overlay);

        // Create panel
        const panel = document.createElement('div');
        panel.id = 'burgerMenuPanel';
        panel.style.cssText = `
            position: fixed;
            top: 0;
            left: -300px;
            width: 280px;
            height: 100%;
            background: #fff;
            z-index: 10001;
            transition: left 0.3s ease;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 25px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            position: relative;
        `;

        // Get shop name from appInfo if available
        const shopName = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].appInfo && window[my1uzr.worknOnPg].appInfo.business)
            ? window[my1uzr.worknOnPg].appInfo.business
            : 'Bay Products';

        header.innerHTML = `
            <i class="fas fa-times" style="position:absolute;top:15px;right:15px;color:white;font-size:20px;cursor:pointer;opacity:0.8;" onclick="closeBurgerMenu()"></i>
            <h5 style="margin:0 0 5px 0;font-size:18px;font-weight:600;"><i class="fas fa-store-alt me-2"></i>${shopName}</h5>
            <small style="opacity:0.9;font-size:12px;">Your one-stop shop</small>
        `;
        panel.appendChild(header);

        // Menu items container
        const menuItemsContainer = document.createElement('div');
        menuItemsContainer.style.cssText = `
            flex: 1;
            padding: 10px 0;
        `;

        // Get menu items
        const menuItems = window.burgerMenuItems || [];

        // Add menu items
        menuItems.forEach((item) => {
            const menuItem = document.createElement('div');
            menuItem.style.cssText = `
                display: flex;
                align-items: center;
                padding: 15px 20px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.2s ease;
            `;

            menuItem.innerHTML = `
                <i class="fas ${item.icon}" style="
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    margin-right: 15px;
                    color: white;
                    background: ${item.color};
                    flex-shrink: 0;
                "></i>
                <span style="font-size:15px;color:#333;font-weight:500;flex:1;">${item.label}</span>
                <i class="fas fa-chevron-right" style="color:#adb5bd;font-size:14px;"></i>
            `;

            menuItem.onmouseover = function () {
                this.style.background = '#f8f9fa';
            };
            menuItem.onmouseout = function () {
                this.style.background = '';
            };
            menuItem.onclick = function () {
                handleMenuAction(item.action, item.label);
            };

            menuItemsContainer.appendChild(menuItem);
        });

        panel.appendChild(menuItemsContainer);

        // Footer
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 15px 20px;
            border-top: 1px solid #f0f0f0;
            text-align: center;
            font-size: 12px;
            color: #adb5bd;
        `;
        footer.innerHTML = `
            <small>Version 1.0.0</small><br>
            <small>Made with ❤️</small>
        `;
        panel.appendChild(footer);

        document.body.appendChild(panel);

        console.log('Burger menu elements created successfully');
    }

    // Open burger menu
    function openBurgerMenu() {
        console.log('Opening burger menu...');

        // Make sure elements exist
        if (!document.getElementById('burgerMenuOverlay') || !document.getElementById('burgerMenuPanel')) {
            createBurgerMenuElements();
        }

        const overlay = document.getElementById('burgerMenuOverlay');
        const panel = document.getElementById('burgerMenuPanel');

        if (overlay) overlay.style.display = 'block';
        if (panel) panel.style.left = '0';

        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';

        console.log('Burger menu opened');
    }

    // Close burger menu
    function closeBurgerMenu() {
        console.log('Closing burger menu...');

        const overlay = document.getElementById('burgerMenuOverlay');
        const panel = document.getElementById('burgerMenuPanel');

        if (overlay) overlay.style.display = 'none';
        if (panel) panel.style.left = '-300px';

        // Restore body scroll
        document.body.style.overflow = '';

        console.log('Burger menu closed');
    }

    // Handle menu item click
    function handleMenuAction(action, label) {
        // Close menu first
        closeBurgerMenu();

        // Small delay for smooth close animation
        setTimeout(async () => {
            // Handle different actions
            switch (action) {

                case 'home':
                    const t351mp = await chkIfLoggedIn();
                    if (t351mp.su == 1)
                        window.showsuccessmodal("Massage:" + t351mp.ms);
                    else
                        (async () => { await loadExe2Fn(31, [], [1]); })();
                    break;

                case 'mn_prods':
                    try {

                        (async () => { await loadExe2Fn(17, ['product'], [1]); })();

                        if (typeof showProductList === 'function') {

                        } else {
                            if (typeof showToast === 'function') {
                                showToast('Product management loading...', { type: 'info', duration: 2000 });
                            }
                        }

                    } catch (error) {
                        console.error('Failed to load ed_prod.js:', error);
                        if (typeof showToast === 'function') {
                            showToast('Failed to load product management. Please try again.', { type: 'error', duration: 3000 });
                        }
                    }
                    break;

                case 'mn_or':
                    try {

                        (async () => { await loadExe2Fn(26, ['product'], [1]); })();

                        if (typeof showProductList === 'function') {

                        } else {
                            if (typeof showToast === 'function') {
                                showToast('Product management loading...', { type: 'info', duration: 2000 });
                            }
                        }

                    } catch (error) {
                        window.showelsemodal(error || "500");
                    }
                    break;

                case 'recent':
                    try {

                        (async () => { await loadExe2Fn(25, [], [1]); })();

                    } catch (error) {
                        window.showelsemodal(error || "500");
                    }
                    break;

                case 'mn_ct':
                    try {
                        (async () => { await loadExe2Fn(28, [], [1]); })();
                    } catch (error) {
                        window.showelsemodal(error || "500");
                    }
                    break;

                case 'settings':
                    if (typeof showToast === 'function') {
                        showToast('Opening settings...', { type: 'info', duration: 2000 });
                    }
                    break;

                case 'about':
                    if (typeof showToast === 'function') {
                        showToast('Bay Products - Your trusted store since 2024', { type: 'info', duration: 3000 });
                    }
                    break;

                case 'contact':
                    if (typeof showToast === 'function') {
                        showToast('Contact: support@bayproducts.com | +91 9960706060', { type: 'info', duration: 3000 });
                    }
                    break;
                case 'fav1':
                    try {
                        (async () => { await loadExe2Fn(14, [], [1]); })();
                    } catch (error) {
                        window.showelsemodal(error || "500");
                    }
                    break;
                case 'driver_panel':
                    try {
                        (async () => { await loadExe2Fn(29, [], [1]); })();
                    } catch (error) {
                        window.showelsemodal(error || "500");
                    }
                    break;

                case 'showMyDrvPanel':
                    try {
                        (async () => { await loadExe2Fn(32, [], [1]); })();
                    } catch (error) {
                        window.showelsemodal(error || "500");
                    }
                    break;

                case 'clr_cache':
                    try {
                        (async () => { await loadExe2Fn(30, [], [1]); })();
                    } catch (error) {
                        window.showelsemodal(error || "500");
                    }
                    break;

                default:
                    if (typeof showToast === 'function') {
                        showToast(`${label} - Coming soon!`, { type: 'info', duration: 2000 });
                    }
            }
        }, 300);

        console.log(`Menu action: ${action} - ${label}`);
    }

    // Expose functions globally
    window.openBurgerMenu = openBurgerMenu;
    window.closeBurgerMenu = closeBurgerMenu;
    window.createBurgerMenuElements = createBurgerMenuElements;
    window.handleMenuAction = handleMenuAction;

    console.log('menu.js loaded successfully');

})();
