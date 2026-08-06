// fn_mng.js - Function Permission Management Modal
(function () {
    'use strict';

    console.log('fn_mng.js initializing...');

    // Function definitions with names
    var FUNCTION_NAMES = {
        1: 'View Dashboard',
        2: 'Manage Products',
        3: 'Manage Categories',
        4: 'View Reports',
        5: 'Manage Users',
        7: 'View Orders',
        8: 'Manage Orders',
        9: 'View Inventory',
        10: 'Manage Inventory',
        11: 'View Customers',
        12: 'Manage Customers',
        13: 'View Suppliers',
        14: 'Manage Suppliers',
        15: 'View Finance',
        16: 'Manage Finance',
        17: 'View Settings',
        18: 'Manage Settings',
        23: 'Export Data',
        25: 'Bulk Operations',
        26: 'Delete Records',
        27: 'Archive Data',
        29: 'View Analytics',
        30: 'Manage Analytics',
        31: 'API Access',
        33: 'Manage Notifications',
        34: 'View Logs',
        35: 'Manage Logs',
        40: 'File Upload',
        41: 'File Download',
        43: 'Manage Permissions',
        44: 'System Config'
    };

    function getFunctionName(funcId) {
        return FUNCTION_NAMES[funcId] || ('Function #' + funcId);
    }

    function formatDateTime(dateStr) {
        if (!dateStr) return 'N/A';
        try {
            var d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) { return dateStr; }
    }

    // Load data from IndexedDB
    async function loadPermissionsFromDB() {
        try {
            var fnfpRecords = await dbDexieManager.getAllRecords(dbnm, 'fn_lst_fp');
            var fnfRecords = await dbDexieManager.getAllRecords(dbnm, 'fn_lst_f');

            // Store in global for easy access
            if (!window[my1uzr.worknOnPg]) window[my1uzr.worknOnPg] = {};
            window[my1uzr.worknOnPg].fnfp = fnfpRecords || [];
            window[my1uzr.worknOnPg].fnf = fnfRecords || [];

            console.log('Permissions loaded from DB - fnfp:', fnfpRecords.length, 'fnf:', fnfRecords.length);
            return { fnfp: fnfpRecords || [], fnf: fnfRecords || [] };
        } catch (e) {
            console.error('Error loading permissions from DB:', e);
            return { fnfp: [], fnf: [] };
        }
    }

    function getPermissionCounts() {
        var fnfp = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].fnfp) || [];
        var fnf = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].fnf) || [];

        var usedCounts = {};
        fnf.forEach(function (rec) {
            var h = rec.h;
            if (!usedCounts[h]) usedCounts[h] = 0;
            usedCounts[h]++;
        });

        var result = {};
        fnfp.forEach(function (rec) {
            var h = rec.h;
            if (h === 0) return;
            result[h] = {
                limit: parseInt(rec.k) || 0,
                used: usedCounts[h] || 0,
                remaining: Math.max(0, (parseInt(rec.k) || 0) - (usedCounts[h] || 0)),
                permittedTill: rec.j || null,
                fnfpRecord: rec
            };
        });

        return result;
    }

    function getAlreadyPermittedFunctions() {
        var fnf = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].fnf) || [];
        var permitted = {};
        fnf.forEach(function (rec) {
            if (!permitted[rec.h]) permitted[rec.h] = [];
            permitted[rec.h].push(rec);
        });
        return permitted;
    }

    var currentFpId = null;

    function removeAllBackdrops() {
        document.querySelectorAll('.modal-backdrop').forEach(function (b) { b.remove(); });
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    async function showFunctionManager() {
        if (typeof showToast === 'function') {
            showToast('Loading permissions...', { type: 'info', duration: 1500 });
        }

        await loadPermissionsFromDB();

        if (typeof create_fullpage_view !== 'function') {
            if (typeof showToast === 'function') showToast('View system not available');
            return;
        }

        currentFpId = 'fnMngModal_' + Date.now();
        var modalResult = create_fullpage_view(currentFpId);

        if (!modalResult) {
            if (typeof showToast === 'function') showToast('Failed to create view', { type: 'error', duration: 2000 });
            return;
        }

        var contentElement = modalResult.contentElement;
        var modalInstance = modalResult.modalInstance;
        var modalElement = modalResult.modalElement;

        modalElement.addEventListener('fp-close', function () {
            currentFpId = null;
            window._fnMngModalInstance = null;
            window._fnMngModalElement = null;
            window._fnMngContentElement = null;
            removeAllBackdrops();
        });

        var titleEl = document.getElementById(currentFpId + '_title');
        if (titleEl) titleEl.textContent = 'Function Permissions';

        window._fnMngModalInstance = modalInstance;
        window._fnMngModalElement = modalElement;
        window._fnMngContentElement = contentElement;

        renderFunctionList(contentElement, modalInstance);
        modalInstance.show();
    }

    function renderFunctionList(contentElement, modalInstance) {
        var permissionCounts = getPermissionCounts();
        var alreadyPermitted = getAlreadyPermittedFunctions();
        var fnfp = (window[my1uzr.worknOnPg] && window[my1uzr.worknOnPg].fnfp) || [];

        var uniqueFuncIds = [];
        var seen = {};
        fnfp.forEach(function (rec) {
            if (rec.h !== 0 && !seen[rec.h]) {
                seen[rec.h] = true;
                uniqueFuncIds.push(rec.h);
            }
        });
        uniqueFuncIds.sort(function (a, b) { return a - b; });

        var tableRows = '';
        var hasAvailablePerms = false;

        uniqueFuncIds.forEach(function (funcId) {
            var permInfo = permissionCounts[funcId];
            var existingPerms = alreadyPermitted[funcId] || [];
            var funcName = getFunctionName(funcId);
            var limit = permInfo ? permInfo.limit : 0;
            var used = permInfo ? permInfo.used : 0;
            var remaining = permInfo ? permInfo.remaining : 0;
            var permTill = permInfo ? permInfo.permittedTill : null;
            var isAvailable = remaining > 0;

            if (isAvailable) hasAvailablePerms = true;

            var existingPermsHTML = '';
            if (existingPerms.length > 0) {
                existingPermsHTML = '<div style="font-size:11px;color:#6c757d;margin-top:3px;">';
                existingPerms.forEach(function (ep, epIdx) {
                    var labelClass = 'bg-light text-dark';
                    var now = new Date();
                    var tillDate = new Date(ep.j);
                    if (tillDate < now) {
                        labelClass = 'bg-danger text-white';
                    } else if (tillDate < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
                        labelClass = 'bg-warning text-dark';
                    }
                    existingPermsHTML += '<span class="badge ' + labelClass + ' me-1 mb-1" style="border:1px solid #ddd;cursor:pointer;" title="ID: ' + ep.a + ' | Given by: ' + ep.l + ' | Till: ' + formatDateTime(ep.j) + '">' +
                        (ep.e || 'User') + ': till ' + formatDateTime(ep.j) + '</span>';
                });
                existingPermsHTML += '</div>';
            }

            tableRows += '<div class="card mb-2 fn-card" data-fn-card="' + funcId + '" style="cursor:pointer;' + (!isAvailable ? 'opacity:0.5;' : '') + 'border:2px solid transparent;">' +
                '<div class="card-body p-2">' +
                '<div class="d-flex align-items-center justify-content-between">' +
                '<div class="d-flex align-items-center">' +
                '<input type="checkbox" class="fn-checkbox me-2" data-func-id="' + funcId + '" ' +
                'data-remaining="' + remaining + '" data-perm-till="' + (permTill || '') + '" ' +
                'style="width:18px;height:18px;cursor:pointer;pointer-events:none;" ' +
                (!isAvailable ? 'disabled' : '') + '>' +
                '<span class="fw-bold" style="font-size:14px;">' + funcName + '</span>' +
                '</div>' +
                '<span class="badge ' + (remaining > 0 ? 'bg-success' : 'bg-danger') + '">' + used + '/' + limit + '</span>' +
                '</div>' +
                existingPermsHTML +
                '<div class="mt-1 d-flex justify-content-between align-items-center">' +
                '<small class="' + (remaining > 0 ? 'text-success' : 'text-danger') + ' fw-bold">' + remaining + ' remaining</small>' +
                '<small class="text-muted">' + (permTill ? 'Till: ' + formatDateTime(permTill) : 'N/A') + '</small>' +
                '</div>' +
                '</div>' +
                '</div>';
        });

        if (!hasAvailablePerms && uniqueFuncIds.length === 0) {
            tableRows = '<div class="text-center py-4 text-muted">' +
                '<i class="fas fa-info-circle fa-2x mb-2"></i>' +
                '<p class="mb-0">No permissions available to assign</p>' +
                '<small>Click Refresh to load permissions from server</small>' +
                '</div>';
        }

        var bottomControls = '';
        if (hasAvailablePerms) {
            bottomControls = '<div class="border-top pt-3">' +
                '<div class="row g-3 align-items-end">' +
                '<div class="col-md-6">' +
                '<label class="form-label fw-bold small mb-1">' +
                '<i class="fas fa-calendar-alt me-1 text-primary"></i>Permission Valid Till' +
                '</label>' +
                '<input type="datetime-local" id="fnPermTill" class="form-control form-control-sm" ' +
                'min="' + new Date().toISOString().slice(0, 16) + '" ' +
                'value="' + getDefaultPermTill() + '">' +
                '<small class="text-muted">Select until when permission should be valid</small>' +
                '</div>' +
                '<div class="col-md-6 text-end">' +
                '<div id="fnSelectedInfo" class="small text-muted mb-2"></div>' +
                '<button class="btn btn-primary" id="fnAllowBtn">' +
                '<i class="fas fa-check-circle me-1"></i>Allow Selected' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        contentElement.innerHTML = '<div class="p-2">' +
            '<div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">' +
            '<h5 class="mb-0">' +
            '<i class="fas fa-shield-alt me-2 text-primary"></i>Function Permissions' +
            '</h5>' +
            '<div class="d-flex gap-2">' +
            '<button class="btn btn-sm btn-outline-primary" id="fnRefreshBtn" title="Refresh from server">' +
            '<i class="fas fa-sync-alt"></i>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '<div class="col-12 mb-2">' +
            '<label class="form-label fw-bold small mb-1">Select Driver</label>' +
            '<input id="c_dtls_party" name="stock_party_id" class="form-control inputbox form-control-sm border border-dark" ' +
            'readonly onclick="(async () => { await loadExe2Fn(22, [\'no-loader-element\', 1, \'modalContentForEntInd\', \'commonFnToRunAfter_DriverSelect\', 1], [1]); })()" ' +
            'placeholder="Click to select Driver" value="">' +
            '<input type="hidden" id="partyId" value="">' +
            '<input type="hidden" id="driverMobile" value="">' +
            '<div id="dv_for_add_itm_btn" style="display:none;margin-top:5px;">' +
            '<small class="text-success"><i class="fas fa-check-circle"></i> Driver selected</small>' +
            '</div>' +
            '</div>' +
            '<div id="fnCardsSection" style="display:none;">' +
            '<div class="alert alert-info py-2 mb-2" style="font-size:13px;">' +
            '<i class="fas fa-info-circle me-1"></i>' +
            'Select functions to allow. Green badge = available, Red = exhausted.' +
            '</div>' +
            '<div style="max-height:45vh;overflow-y:auto;margin-bottom:15px;">' +
            tableRows +
            '</div>' +
            bottomControls +
            '</div>' +
            '</div>';

        attachFunctionManagerEvents(contentElement, modalInstance, permissionCounts);
    }

    function getDefaultPermTill() {
        var d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().slice(0, 16);
    }

    function attachFunctionManagerEvents(contentElement, modalInstance, permissionCounts) {
        // Refresh button - fetch from server and reload
        var refreshBtn = contentElement.querySelector('#fnRefreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async function () {
                var btn = this;

                if (typeof showToast === 'function') {
                    showToast('Fetching permissions from server...', { type: 'info', duration: 1500 });
                }

                await window.withRefreshAnimation(btn, async function () {
                    try {
                        if (typeof payload0 !== 'undefined') {
                            payload0.fn = 95;
                            payload0.vw = 1;
                            payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'fn_lst_fp' }, { "tb": 'fn_lst_f' }]);

                            var _ldId = 'myct_ld_' + Date.now();
                            var _ldDiv = document.createElement('div');
                            _ldDiv.id = _ldId;
                            _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
                            _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
                            document.body.appendChild(_ldDiv);

                            var response = await fnj3("https://my1.in/3/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
                            var _ldEl = document.getElementById(_ldId);
                            if (_ldEl) _ldEl.remove();

                            if (response && response.su == 1) {
                                handl_o_rspons(response, 1);
                                await new Promise(function (resolve) { setTimeout(resolve, 500); });
                                await loadPermissionsFromDB();
                                renderFunctionList(contentElement, modalInstance);
                                window.showsuccessmodal('Permissions refreshed from server');
                            } else {
                                window.showelsemodal(response.ms || 'No success to refresh');
                            }
                        }
                    } catch (err) {
                        var _ldEl2 = document.getElementById(_ldId);
                        if (_ldEl2) _ldEl2.remove();
                        window.showelsemodal(err);
                    }
                });
            });
        }

        // Checkbox change handlers
        var checkboxes = contentElement.querySelectorAll('.fn-checkbox');
        checkboxes.forEach(function (cb) {
            cb.addEventListener('change', function () {
                updateCardHighlight(this);
                updateSelectedInfo(contentElement);
            });
        });

        // Card click to toggle checkbox
        var cards = contentElement.querySelectorAll('.fn-card');
        cards.forEach(function (card) {
            card.addEventListener('click', function (e) {
                var cb = card.querySelector('.fn-checkbox');
                if (!cb || cb.disabled) return;
                cb.checked = !cb.checked;
                cb.dispatchEvent(new Event('change'));
            });
        });

        // Allow button
        var allowBtn = contentElement.querySelector('#fnAllowBtn');
        if (allowBtn) {
            allowBtn.addEventListener('click', function () {
                handleAllowPermissions(contentElement, modalInstance, permissionCounts);
            });
        }

        // PermTill input - prevent parent card click handlers from interfering
        var permTillInput = contentElement.querySelector('#fnPermTill');
        if (permTillInput) {
            permTillInput.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            permTillInput.addEventListener('touchend', function (e) {
                e.stopPropagation();
            });
        }

        updateSelectedInfo(contentElement);
    }

    function updateSelectedInfo(contentElement) {
        var selectedInfo = contentElement.querySelector('#fnSelectedInfo');
        if (!selectedInfo) return;

        var checkedBoxes = contentElement.querySelectorAll('.fn-checkbox:checked');
        var count = checkedBoxes.length;

        if (count === 0) {
            selectedInfo.textContent = 'No functions selected';
        } else {
            var names = [];
            checkedBoxes.forEach(function (cb) {
                names.push(getFunctionName(parseInt(cb.dataset.funcId)));
            });
            selectedInfo.innerHTML = '<span class="text-success fw-bold">' + count + '</span> selected: ' + names.join(', ');
        }
    }

    function updateCardHighlight(checkbox) {
        var card = checkbox.closest('.fn-card');
        if (!card) return;
        if (checkbox.checked) {
            card.style.borderColor = '#0d6efd';
            card.style.background = '#f0f7ff';
        } else {
            card.style.borderColor = 'transparent';
            card.style.background = '';
        }
    }

    window.commonFnToRunAfter_DriverSelect = function (obj, swtch) {
        if (swtch !== 1) {
            if (typeof showToast === 'function') showToast('Please select a valid driver', { type: 'warning', duration: 2000 });
            return;
        }
        var partyInput = document.getElementById('c_dtls_party');
        var partyIdInput = document.getElementById('partyId');
        var mobileInput = document.getElementById('driverMobile');
        if (partyInput) {
            var driverName = obj.h || obj.i || 'Unknown';
            var driverMobile = obj.e || '';
            partyInput.value = driverName + (driverMobile ? ' (' + driverMobile + ')' : '');
        }
        if (partyIdInput) partyIdInput.value = obj.a;
        if (mobileInput) mobileInput.value = obj.e || '';
        var dvBtn = document.getElementById('dv_for_add_itm_btn');
        if (dvBtn) dvBtn.style.display = 'block';
        var fnSection = document.getElementById('fnCardsSection');
        if (fnSection) fnSection.style.display = '';

        removeAllBackdrops();

        setTimeout(function () {
            if (window._fnMngModalInstance) {
                try { window._fnMngModalInstance.show(); } catch (e) { }
            }
            if (window._fnMngModalElement) {
                window._fnMngModalElement.style.display = '';
                window._fnMngModalElement.classList.add('show');
            }
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            removeAllBackdrops();
        }, 300);

        if (typeof showToast === 'function') showToast('Driver selected: ' + (obj.h || obj.i || obj.e), { type: 'success', duration: 2000 });
    };

    async function handleAllowPermissions(contentElement, modalInstance, permissionCounts) {
        var mobileInput = document.getElementById('driverMobile');
        var driverMobile = mobileInput ? mobileInput.value : '';
        if (!driverMobile) {
            if (typeof showToast === 'function') {
                showToast('Please select a driver first', { type: 'warning', duration: 2000 });
            }
            return;
        }

        var checkedBoxes = contentElement.querySelectorAll('.fn-checkbox:checked');
        var permTillInput = contentElement.querySelector('#fnPermTill');
        var permTill = permTillInput ? permTillInput.value : '';

        if (checkedBoxes.length === 0) {
            if (typeof showToast === 'function') {
                showToast('Please select at least one function', { type: 'warning', duration: 2000 });
            }
            return;
        }

        if (!permTill) {
            if (typeof showToast === 'function') {
                showToast('Please select permission validity date', { type: 'warning', duration: 2000 });
            }
            return;
        }

        var selectedDate = new Date(permTill);
        var now = new Date();
        if (selectedDate <= now) {
            if (typeof showToast === 'function') {
                showToast('Permission date must be in the future', { type: 'warning', duration: 2000 });
            }
            return;
        }

        var funcIds = [];
        checkedBoxes.forEach(function (cb) {
            funcIds.push(parseInt(cb.dataset.funcId));
        });

        if (typeof showToast === 'function') {
            showToast('Processing ' + funcIds.length + ' permission(s)...', { type: 'info', duration: 2000 });
        }

        if (typeof payload0 !== 'undefined') {
            payload0.fn = 97;
            payload0.vw = 1;
            payload0.b = driverMobile;
            payload0.p = funcIds;
            payload0.d = permTill;

            var _ldId = 'myct2_ld_' + Date.now();
            var _ldDiv = document.createElement('div');
            _ldDiv.id = _ldId;
            _ldDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10500;display:flex;justify-content:center;align-items:center;';
            _ldDiv.innerHTML = '<div class="spinner-border text-light" role="status"></div>';
            document.body.appendChild(_ldDiv);

            try {
                var response = await fnj3("https://my1.in/3/b.php", payload0, 1, true, null, 20000, 0, 2, 1);
                var _ldEl = document.getElementById(_ldId);
                if (_ldEl) _ldEl.remove();
                if (response && response.su == 1) {
                    window.showsuccessmodal('Permissions granted successfully');
                    modalInstance.hide();
                } else {
                        window.showelsemodal(response.ms || 'No success to grant permissions');

                }
            } catch (err) {
                var _ldEl2 = document.getElementById(_ldId);
                if (_ldEl2) _ldEl2.remove();
                window.showelsemodal(err);
            }
        }
    }

    // Expose globally
    window.showFunctionManager = showFunctionManager;
    window.loadPermissionsFromDB = loadPermissionsFromDB;
    window.getPermissionCounts = getPermissionCounts;
    window.getAlreadyPermittedFunctions = getAlreadyPermittedFunctions;

    console.log('fn_mng.js loaded successfully');

})();