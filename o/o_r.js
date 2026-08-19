window.PRODUCTS = [];
window.PRODUCT_MAP = {};
function handl_o_rspons(response) {
    return (async () => {
        try {
            if (response.su == 1) {
                if (response.fn_lst_fp != null && response.fn_lst_fp.l != null) {
                    await dbDexieManager.insertToDexie(
                        dbnm,
                        "fn_lst_fp",
                        response.fn_lst_fp.l,
                        true,
                        ["a"]
                    );
                }
                if (response.fn_lst_f != null && response.fn_lst_f.l != null) {
                    await dbDexieManager.insertToDexie(
                        dbnm,
                        "fn_lst_f",
                        response.fn_lst_f.l,
                        true,
                        ["a"]
                    );
                }
                // Party
                if (response.c != null && response.c.l != null) {
                    await dbDexieManager.insertToDexie(
                        dbnm,
                        "c",
                        response.c.l,
                        true,
                        ["a"]
                    );
                }
                // Product Master
                if (response.p != null && response.p.l != null) {
                    await dbDexieManager.insertToDexie(
                        dbnm,
                        "p",
                        response.p.l,
                        true,
                        ["a"]
                    );
                }
                // Selling
                if (response.s != null && response.s.l != null) {
                    await dbDexieManager.insertToDexie(
                        dbnm,
                        "s",
                        response.s.l,
                        true,
                        ["a"]
                    );
                }
                if (response.os != null && response.os.l != null) {
                    await dbDexieManager.insertToDexie(
                        dbnm,
                        "os",
                        response.os.l,
                        true,
                        ["a"]
                    );
                }
                if (response.od != null && response.od.l != null) {
                    await dbDexieManager.insertToDexie(
                        dbnm,
                        "od",
                        response.od.l,
                        true,
                        ["a"]
                    );
                }
                if (response.o != null && response.o.l != null) {
                    await dbDexieManager.insertToDexie(
                        dbnm,
                        "o",
                        response.o.l,
                        true,
                        ["a"]
                    );
                }
                await refreshProductsCache();
                await refreshStatusCache();

            } else {

                if (response.ms != null) {
                    alert(response.ms);
                }
            }
        } catch (error) {

            console.error("Initialization failed:", error);

            if (typeof showToast === 'function') showToast("Initialization error - please refresh");
        }
    })();
}
async function refreshStatusCache() {
    const allOS = await dbDexieManager.getAllRecords(dbnm, 'os');
    const allOrders = await dbDexieManager.getAllRecords(dbnm, 'o');
    for (const osItem of allOS) {
        const orderId = osItem.e; // e = a (order id from o table)
        const newStatus = osItem.d; // new status value

        if (orderId && newStatus !== undefined) {
            try {
                const order = allOrders.find(o => String(o.a) === String(orderId));

                if (order) {
                    // Update the d field
                    order.d = newStatus;
                    console.log(order);
                    
                    await dbDexieManager.updateRecord(dbnm, 'o', order);

                } else {
                    console.log('Order not found in o table:', orderId);
                }
            } catch (updateErr) {
                console.log('Error updating order status for', orderId, ':', updateErr);
            }
        }
    }
}
dbDexieManager.updateRecord = async function (dbName, tableName, record, keyField = 'a') {
    try {
        // Try using Dexie first
        if (dbDexieManager.db && dbDexieManager.db.table) {
            const table = dbDexieManager.db.table(tableName);
            await table.put(record);
            console.log('Record updated (Dexie) in', tableName, ':', record[keyField]);
            return true;
        }
        
        // Fallback to raw IndexedDB
        const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        
        const transaction = db.transaction([tableName], 'readwrite');
        const store = transaction.objectStore(tableName);
        
        return new Promise((resolve, reject) => {
            const request = store.put(record);
            request.onsuccess = () => {
                console.log('Record updated (IDB) in', tableName, ':', record[keyField]);
                resolve(request.result);
            };
            request.onerror = () => {
                console.error('Error updating record:', request.error);
                reject(request.error);
            };
        }).finally(() => {
            db.close();
        });
    } catch (error) {
        console.error('Error in updateRecord:', error);
        throw error;
    }
};
async function refreshProductsCache(plist, slist) {
    try {
        // If data not provided, fetch from IndexedDB (for backward compatibility)
        if (!plist || !slist) {
            plist = await dbDexieManager.getAllRecords(dbnm, "p");
            slist = await dbDexieManager.getAllRecords(dbnm, "s");
        }

        const pMap = {};

        // Product master lookup
        plist.forEach(function (p) {
            pMap[p.a] = p;
        });

        const products = [];

        slist.forEach(function (s) {
            const p = pMap[s.g];
            if (!p) return;

            // Handle case where s.l might be undefined or null
            var soldInData = s.l || '';
            var _g = p.g ? p.g.trim().split(/\s+/) : [];

            const product = {
                // Original objects
                P: p,
                S: s,

                // IDs
                pid: p.a,
                sid: s.a,

                // Product
                name: p.e || 'Unnamed Product',
                image: _g[0] || '',
                thumb: _g[1] || p.h || '',

                // Selling
                stockPartyId: s.e || '',
                billId: s.f || '',
                purchasePrice: s.h || 0,
                quantityReceived: s.i || 0,
                measuredInId: s.j || '',
                salesPrice: s.k || 0,
                soldIn: decodeSoldIn(soldInData),
                notes: s.m || '',
                globalProductId: s.n || 0
            };

            // For backward compatibility
            product.prices = product.soldIn;

            products.push(product);
        });

        window.PRODUCTS = products;

        window.PRODUCT_MAP = {};

        products.forEach(function (item) {
            window.PRODUCT_MAP[item.pid] = item;
        });

        console.log("Products cache refreshed", products.length);

        preloadProductImages(products);

    } catch (err) {
        console.error("refreshProductsCache()", err);
    }
}

function preloadProductImages(products) {
    var urls = [];
    products.forEach(function (product) {
        if (product.image) {
            var url = typeof getGoogleDriveImageUrl === 'function' ? getGoogleDriveImageUrl(product.image) : product.image;
            if (url) urls.push(url);
        }
        if (product.thumb) {
            var thumbUrl = typeof getGoogleDriveImageUrl === 'function' ? getGoogleDriveImageUrl(product.thumb, true) : product.thumb;
            if (thumbUrl && thumbUrl !== urls[urls.length - 1]) urls.push(thumbUrl);
        }
    });

    if (typeof queuedPreload === 'function') {
        urls.forEach(function (url) { queuedPreload(url); });
        console.log("Images queued for preload:", urls.length);
        return;
    }

    Promise.all(urls.map(function (url) {
        return new Promise(function (resolve) {
            var img = new Image();
            img.onload = function () { resolve(); };
            img.onerror = function () { resolve(); };
            img.src = url;
        });
    })).then(function () {
        console.log("Images preloaded:", urls.length);
    });
}
function decodeSoldIn(str) {
    if (!str || str.trim() === '') {
        return {
            "30": [
                {
                    "mrp": 0,
                    "selling": 0,
                    "package": 1,
                    "increment": 1,
                    "min": 1,
                    "max": 0
                }
            ]
        };
    }

    var result = {};
    var groups = str.split(';').map(function (g) { return g.trim(); }).filter(Boolean);
    groups.forEach(function (group) {
        var dashIndex = group.indexOf('-');
        if (dashIndex === -1) return;

        var unitId = group.substring(0, dashIndex);
        var itemsPart = group.substring(dashIndex + 1);
        var items = itemsPart.split(',').map(function (item) { return item.trim(); }).filter(Boolean);

        var prices = items.map(function (item) {
            var match = item.match(/([\d.]+)@([\d.]+)~([\d.]+)\^([\d.]+)#([\d.]+)(?:\$([\d.]+))?/);
            if (!match) return null;

            return {
                "mrp": Number(match[2]),
                "selling": Number(match[1]),
                "package": Number(match[3]),
                "increment": Number(match[4]),
                "min": Number(match[5]),
                "max": match[6] !== undefined ? Number(match[6]) : 0
            };
        }).filter(Boolean);

        if (prices.length > 0) {
            result[unitId] = prices;
        }
    });
    if (Object.keys(result).length === 0) {
        return {
            "30": [
                {
                    "mrp": 0,
                    "selling": 0,
                    "package": 1,
                    "increment": 1,
                    "min": 1,
                    "max": 0
                }
            ]
        };
    }
    return result;
}