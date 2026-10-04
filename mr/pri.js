/* ============================================================================
 * marriage plan  -  ONE script for BOTH apps.
 *
 * The public app and the admin app used to load two different files that each
 * declared set_marriage_plan_innerHTML:
 *   public -> git/pri.js    plans fetched from the server, read-only cards
 *   admin  -> git_/pri.js   plans read from the local IndexedDB "mp" table, with
 *                           pullPlans / updatePlan / refreshPlanData
 * Both are kept below, byte-for-byte, so neither app changes behaviour. Now that
 * both apps live on ONE page, both installers run and the shared export picks the
 * right one per call: window.set_marriage_plan_innerHTML is the "c"/"r" hook named
 * by the csh row, plus window.pullPlans because the admin modal title uses an
 * inline onclick="pullPlans()".
 * __mrActivePanel() comes from git/mr.js and answers "public" | "admin".
 * ============================================================================ */

const __mrAdminPlans = installAdminMarriagePlan();
const __mrPublicPlans = installPublicMarriagePlan();

function __mrPlanInstaller() {
 const panel = (typeof __mrActivePanel === 'function') ? __mrActivePanel() : "public";
 return (panel === "admin") ? __mrAdminPlans : __mrPublicPlans;
}

window.set_marriage_plan_innerHTML = function () {
 return __mrPlanInstaller().set_marriage_plan_innerHTML.apply(this, arguments);
};
window.pullPlans = function () {//the admin modal title's inline onclick="pullPlans()"
 return __mrAdminPlans.pullPlans.apply(this, arguments);
};

/* ------------------------------- admin app ------------------------------- */
function installAdminMarriagePlan() {
  let marrege_plan_data = [];

  async function set_marriage_plan_innerHTML() {
   marrege_plan_data = await dbDexieManager.getAllRecords(dbnm, "mp") || [];

   // Check if modal already exists
   let marriagePlanModal = document.getElementById('marriage_plan');

   if (!marriagePlanModal) {
    // Create modal dynamically
    const modalResult = create_modal_dynamically("marriage_plan");

    // Set modal title
    const modalTitle = document.createElement('h4');
    modalTitle.className = 'modal-title text-center mb-4';
    modalTitle.innerHTML = `<i class="fas fa-heart me-2 text-danger"></i>Marriage Plan Subscription
  <button class="btn btn-light" onclick="pullPlans()" style="border-radius: 50px; padding: 8px 16px; box-shadow: 0 4px 12px rgba(123, 31, 162, 0.2);">
  <i class="fas fa-sync-alt"></i> pull plans
  </button>`;
    modalTitle.style.color = 'var(--primary-color)';
    modalTitle.style.fontWeight = '600';

    // Create container for plan cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'container-fluid';
    cardsContainer.id = 'marriage_plan_cards_container';

    // Insert title and container into modal body
    const modalBody = modalResult.contentElement;
    modalBody.appendChild(modalTitle);
    modalBody.appendChild(cardsContainer);

    // Generate plan cards
    generatePlanCards();

    // Show the modal
    modalResult.modalInstance.show();

    // Add some custom CSS for the modal
    addPlanModalStyles();
   } else {
    // Modal exists, show it using Bootstrap
    const modalInstance = bootstrap.Modal.getInstance(marriagePlanModal) ||
     new bootstrap.Modal(marriagePlanModal);
    modalInstance.show();
   }
  }

  function pullPlans() {
   (async () => {
    try {
     // Clear any active filters
     if (currentStatusFilter !== null) {
      filterByStatus(null);
     }

     payload0.vw = 4;
     payload0.fn = 61; // get all plans;
     payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'mp' }]);
     const response = await fnj3("https://my1.in/2/g.php", payload0, 1, true, null, 20000, 0, 1, 1);
     if (response.su == 1) {
      hndl_mr_rspo(response, 1, null, null);
     } else {
      alert(response.ms);
     }
    } catch (error) {
     console.error("Initialization failed:", error);
     showToast("Initialization error - please refresh");
    }
   })();
  }

  function generatePlanCards() {
   const container = document.getElementById('marriage_plan_cards_container');
   if (!container) return;

   // Clear container
   container.innerHTML = '';

   // Generate color schemes dynamically based on plan count
   const planColors = generateColorSchemes(marrege_plan_data.length);

   // Create a row for cards
   const row = document.createElement('div');
   row.className = 'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';

   // Loop through marriage plans and create cards
   marrege_plan_data.forEach((plan, index) => {
    const col = document.createElement('div');
    col.className = 'col';

    // Get color scheme for this plan
    const colorScheme = planColors[index % planColors.length];

    // Create card
    const card = document.createElement('div');
    card.className = 'card h-100 shadow-lg border-0 plan-card';
    card.style.backgroundColor = colorScheme.bg;
    card.style.border = `2px solid ${colorScheme.border}`;
    card.style.borderRadius = '15px';
    card.style.transition = 'all 0.3s ease';

    // Card header with plan name (editable)
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header bg-transparent border-bottom-0 pt-4';
    cardHeader.style.backgroundColor = `${colorScheme.border}20`;

    const planNameDiv = document.createElement('div');
    planNameDiv.className = 'd-flex justify-content-between align-items-center';

    const planNameInput = document.createElement('input');
    planNameInput.type = 'text';
    planNameInput.className = 'form-control border-0 bg-transparent text-center plan-name-input';
    planNameInput.value = plan.e ? plan.e.toUpperCase() : '';
    planNameInput.style.color = colorScheme.text;
    planNameInput.style.fontWeight = '700';
    planNameInput.style.fontSize = '1.5rem';
    planNameInput.dataset.field = 'e'; // Field name for update

    const planIDBadge = document.createElement('span');
    planIDBadge.className = 'badge bg-secondary ms-2';
    planIDBadge.textContent = `ID: ${plan.a}`;
    planIDBadge.style.fontSize = '0.8rem';

    planNameDiv.appendChild(planNameInput);
    planNameDiv.appendChild(planIDBadge);
    cardHeader.appendChild(planNameDiv);

    // Card body with editable features
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column p-4';

    // Create editable features list
    const featuresList = document.createElement('ul');
    featuresList.className = 'list-unstyled mb-4 flex-grow-1';

    // Editable Mobile Unlocks feature
    if (plan.f !== undefined) {
     const mobileItem = createEditableFeatureItem(
      'fas fa-mobile-alt',
      'Mobile Unlocks:',
      plan.f,
      'f',
      'Enter number (-1 for unlimited)'
     );
     featuresList.appendChild(mobileItem);
    }

    // Editable Chatting feature
    if (plan.g !== undefined) {
     const chatItem = createEditableFeatureItem(
      'fas fa-comments',
      'Chats Allowed:',
      plan.g,
      'g',
      'Enter number (-1 for unlimited)'
     );
     featuresList.appendChild(chatItem);
    }

    // Editable Profile Browsing feature
    if (plan.i !== undefined) {
     const profileItem = createEditableFeatureItem(
      'fas fa-user-friends',
      'Profile Browsing:',
      plan.i,
      'i',
      'Enter number (-1 for unlimited)'
     );
     featuresList.appendChild(profileItem);
    }

    // Editable Views feature
    if (plan.h !== undefined) {
     const viewsItem = createEditableFeatureItem(
      'fas fa-eye',
      'Profile Views:',
      plan.h,
      'h',
      'Enter number'
     );
     featuresList.appendChild(viewsItem);
    }

    // Editable Price feature
    if (plan.j !== undefined) {
     const priceItem = createEditableFeatureItem(
      'fas fa-rupee-sign',
      'Monthly Price:',
      plan.j,
      'j',
      'Enter price'
     );
     featuresList.appendChild(priceItem);
    }

    cardBody.appendChild(featuresList);

    // Update button section
    const updateSection = document.createElement('div');
    updateSection.className = 'mt-auto pt-3 border-top';

    const updateButton = document.createElement('button');
    updateButton.className = 'btn w-100 py-3 fw-bold update-plan-btn';
    updateButton.style.backgroundColor = colorScheme.text;
    updateButton.style.color = 'white';
    updateButton.style.border = 'none';
    updateButton.style.borderRadius = '50px';
    updateButton.style.transition = 'all 0.3s ease';
    updateButton.innerHTML = `<i class="fas fa-save me-2"></i>Update Plan`;
    updateButton.dataset.planId = plan.a; // Store plan ID
    updateButton.onmouseover = () => {
     updateButton.style.transform = 'translateY(-2px)';
     updateButton.style.boxShadow = `0 5px 15px ${colorScheme.text}40`;
    };
    updateButton.onmouseout = () => {
     updateButton.style.transform = 'translateY(0)';
     updateButton.style.boxShadow = 'none';
    };

    // Add click handler for plan update
    updateButton.onclick = () => updatePlan(plan.a, card);

    updateSection.appendChild(updateButton);
    cardBody.appendChild(updateSection);

    // Assemble card
    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    // Add data-plan-id attribute to card
    card.dataset.planId = plan.a;

    // Add hover effect
    card.onmouseover = () => {
     card.style.transform = 'translateY(-5px)';
     card.style.boxShadow = `0 10px 30px ${colorScheme.border}40`;
    };
    card.onmouseout = () => {
     card.style.transform = 'translateY(0)';
     card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
    };

    col.appendChild(card);
    row.appendChild(col);
   });

   container.appendChild(row);

   // Add comparison section only if there are multiple plans
   if (marrege_plan_data.length > 1) {
    addComparisonSection(container, planColors);
   }
  }

  function generateColorSchemes(planCount) {
   // Base colors from your theme
   const baseColors = [
    { bg: 'rgba(123, 31, 162, 0.1)', border: '#7B1FA2', text: '#4A148C' },      // Violet
    { bg: 'rgba(0, 191, 165, 0.1)', border: '#00BFA5', text: '#00897B' },       // Teal
    { bg: 'rgba(255, 179, 0, 0.1)', border: '#FFB300', text: '#FF8F00' },       // Amber
    { bg: 'rgba(76, 175, 80, 0.1)', border: '#4CAF50', text: '#388E3C' },       // Green
    { bg: 'rgba(33, 150, 243, 0.1)', border: '#2196F3', text: '#1976D2' },      // Blue
    { bg: 'rgba(156, 39, 176, 0.1)', border: '#9C27B0', text: '#7B1FA2' },      // Purple
    { bg: 'rgba(244, 67, 54, 0.1)', border: '#F44336', text: '#D32F2F' },       // Red
    { bg: 'rgba(255, 152, 0, 0.1)', border: '#FF9800', text: '#F57C00' }        // Orange
   ];

   // If we have more plans than base colors, generate additional colors
   if (planCount <= baseColors.length) {
    return baseColors.slice(0, planCount);
   }

   // Generate additional colors by adjusting hue of base colors
   const colorSchemes = [...baseColors];

   for (let i = baseColors.length; i < planCount; i++) {
    // Take a base color and adjust its hue
    const baseIndex = i % baseColors.length;
    const baseColor = baseColors[baseIndex];

    // Create variations by adjusting opacity and brightness
    const hueAdjust = (i * 30) % 360; // Adjust hue by 30 degrees for each extra color

    colorSchemes.push({
     bg: `hsla(${hueAdjust}, 70%, 80%, 0.1)`,
     border: `hsl(${hueAdjust}, 70%, 50%)`,
     text: `hsl(${hueAdjust}, 70%, 30%)`
    });
   }

   return colorSchemes;
  }

  function createEditableFeatureItem(iconClass, label, value, fieldName, placeholder) {
   const li = document.createElement('li');
   li.className = 'd-flex align-items-center mb-3';

   const icon = document.createElement('i');
   icon.className = `${iconClass} me-3`;
   icon.style.color = 'var(--primary-color)';
   icon.style.width = '20px';
   icon.style.textAlign = 'center';

   const labelSpan = document.createElement('span');
   labelSpan.className = 'me-2';
   labelSpan.textContent = label;
   labelSpan.style.minWidth = '120px';
   labelSpan.style.fontSize = '0.95rem';
   labelSpan.style.color = 'var(--text-dark)';

   const input = document.createElement('input');
   input.type = 'text';
   input.className = 'form-control form-control-sm editable-feature-input';
   input.value = value || '';
   input.placeholder = placeholder;
   input.dataset.field = fieldName;
   input.style.maxWidth = '100px';
   input.style.display = 'inline-block';

   // Add validation for unlimited value
   if (fieldName === 'f' || fieldName === 'g' || fieldName === 'i') {
    input.onblur = function () {
     const val = this.value.trim();
     if (val === '-1') {
      this.classList.add('unlimited-input');
      this.classList.remove('limited-input');
     } else if (!isNaN(val) && parseInt(val) >= 0) {
      this.classList.add('limited-input');
      this.classList.remove('unlimited-input');
     } else {
      this.classList.remove('unlimited-input', 'limited-input');
     }
    };

    // Trigger validation on initial load
    setTimeout(() => {
     input.dispatchEvent(new Event('blur'));
    }, 0);
   }

   li.appendChild(icon);
   li.appendChild(labelSpan);
   li.appendChild(input);

   return li;
  }

  function createFeatureItem(iconClass, text, badgeClass = 'feature-text') {
   const li = document.createElement('li');
   li.className = 'd-flex align-items-center mb-3';

   const icon = document.createElement('i');
   icon.className = `${iconClass} me-3`;
   icon.style.color = 'var(--primary-color)';
   icon.style.width = '20px';
   icon.style.textAlign = 'center';

   const textSpan = document.createElement('span');
   textSpan.className = badgeClass;
   textSpan.textContent = text;
   textSpan.style.fontSize = '0.95rem';

   li.appendChild(icon);
   li.appendChild(textSpan);

   return li;
  }

  function updatePlan(planId, cardElement) {
   // Get all editable inputs from the card
   const inputs = cardElement.querySelectorAll('.editable-feature-input, .plan-name-input');

   // Prepare update data
   const updateData = {
    plan_id: planId
   };

   // Collect all field values
   inputs.forEach(input => {
    const field = input.dataset.field;
    const value = input.value.trim();

    // Validate numeric fields
    if (field === 'f' || field === 'g' || field === 'i' || field === 'h' || field === 'j') {
     if (value === '-1' || (!isNaN(value) && value !== '')) {
      updateData[field] = value;
     } else {
      showToast(`Invalid value for ${field}. Please enter a number or -1 for unlimited.`, {
       type: 'error',
       duration: 3000
      });
      input.focus();
      return; // Stop execution if invalid
     }
    } else if (field === 'e') {
     // Plan name validation
     if (value.length > 0) {
      updateData[field] = value;
     } else {
      showToast('Plan name cannot be empty', {
       type: 'error',
       duration: 3000
      });
      input.focus();
      return;
     }
    }
   });

   // Check if we have data to update
   if (Object.keys(updateData).length > 1) { // More than just plan_id
    // Show confirmation dialog
    if (confirm(`Update plan ID: ${planId}?\n\nChanges:\n${JSON.stringify(updateData, null, 2)}`)) {
     // Call your update function
     sendPlanUpdate(updateData);
    }
   } else {
    showToast('No changes to update', {
     type: 'info',
     duration: 2000
    });
   }
  }

  async function sendPlanUpdate(updateData) {
   try {

    payload0.vw = 4;
    payload0.fn = 65; // update given plan;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{ "tb": 'mp' }]);
    payload0.x1 = updateData.plan_id;
    payload0.x2 = updateData;
    const response = await fnj3("https://my1.in/2/e.php", payload0, 1, true, null, 20000, 0, 1, 1);
    if (response.su == 1) {
     hndl_mr_rspo(response, 1, null, null);
     // Refresh the plan data
     await refreshPlanData();
    } else {
     alert(response.ms);
    }
   } catch (error) {
    console.error('Update error:', error);
    showToast('Update failed. Please try again.', { type: 'error', duration: 3000 });
   }
  }

  async function refreshPlanData() {
   try {
    // Refresh data from database
    marrege_plan_data = await dbDexieManager.getAllRecords(dbnm, "mp") || [];

    // Regenerate cards
    generatePlanCards();

    showToast('Plan data refreshed', { type: 'success', duration: 2000 });
   } catch (error) {
    console.error('Refresh error:', error);
    showToast('Failed to refresh data', { type: 'error', duration: 3000 });
   }
  }

  function selectPlan(plan) {
   console.log('Plan selected:', plan);
   // You can implement payment integration or plan selection logic here
   showToast(`Selected ${plan.e.toUpperCase()} plan for ₹${plan.j}`, {
    type: 'success',
    duration: 3000
   });

   // Close modal after selection
   const modal = document.getElementById('marriage_plan');
   if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
     modalInstance.hide();
    }
   }
  }

  function addComparisonSection(container, planColors) {
   const comparisonDiv = document.createElement('div');
   comparisonDiv.className = 'mt-5 pt-4 border-top';

   const comparisonTitle = document.createElement('h5');
   comparisonTitle.className = 'text-center mb-4';
   comparisonTitle.style.color = 'var(--primary-dark)';
   comparisonTitle.innerHTML = '<i class="fas fa-chart-bar me-2"></i>Plan Comparison';

   // Create comparison table
   const table = document.createElement('table');
   table.className = 'table table-borderless table-hover';
   table.style.backgroundColor = 'rgba(123, 31, 162, 0.05)';
   table.style.borderRadius = '10px';

   // Table header
   const thead = document.createElement('thead');
   const headerRow = document.createElement('tr');

   // Features column header
   const featuresTh = document.createElement('th');
   featuresTh.scope = 'col';
   featuresTh.className = 'text-muted';
   featuresTh.textContent = 'Features';
   headerRow.appendChild(featuresTh);

   // Plan name headers with their respective colors
   marrege_plan_data.forEach((plan, index) => {
    const planTh = document.createElement('th');
    planTh.scope = 'col';
    planTh.className = 'text-center fw-bold';
    planTh.style.color = planColors[index].text;
    planTh.textContent = plan.e ? plan.e.toUpperCase() : '';
    headerRow.appendChild(planTh);
   });

   thead.appendChild(headerRow);

   // Table body
   const tbody = document.createElement('tbody');

   // Add rows for each feature
   const features = [
    { name: 'Mobile Unlocks', key: 'f' },
    { name: 'Chatting', key: 'g' },
    { name: 'Profile Browsing', key: 'i' },
    { name: 'Profile Views', key: 'h' },
    { name: 'Monthly Price', key: 'j', prefix: '₹' }
   ];

   features.forEach(feature => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.className = 'fw-bold';
    nameCell.textContent = feature.name;
    nameCell.style.borderRight = '1px solid var(--border-color)';

    row.appendChild(nameCell);

    marrege_plan_data.forEach(plan => {
     const valueCell = document.createElement('td');
     valueCell.className = 'text-center';

     let value = plan[feature.key];
     if (value === '-1') {
      valueCell.innerHTML = '<i class="fas fa-infinity text-success"></i>';
      valueCell.title = 'Unlimited';
     } else if (value === '0') {
      valueCell.innerHTML = '<i class="fas fa-times text-danger"></i>';
      valueCell.title = 'Not included';
     } else {
      valueCell.textContent = feature.prefix ? `${feature.prefix}${value}` : value;
     }

     row.appendChild(valueCell);
    });

    tbody.appendChild(row);
   });

   table.appendChild(thead);
   table.appendChild(tbody);

   comparisonDiv.appendChild(comparisonTitle);
   comparisonDiv.appendChild(table);
   container.appendChild(comparisonDiv);
  }

  function addPlanModalStyles() {
   const styleId = 'marriage-plan-modal-styles';
   if (document.getElementById(styleId)) return;

   const style = document.createElement('style');
   style.id = styleId;
   style.textContent = `
  .plan-card {
  min-height: 450px;
  overflow: hidden;
  }

  .plan-card:hover {
  transform: translateY(-5px) !important;
  }

  .unlimited-badge {
  background: linear-gradient(135deg, var(--success-color), #2E7D32);
  color: white !important;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.85rem !important;
  font-weight: 600;
  display: inline-block;
  }

  .feature-text {
  color: var(--text-dark);
  flex-grow: 1;
  }

  #marriage_plan .modal-dialog {
  max-width: 1200px;
  }

  #marriage_plan .modal-body {
  max-height: 80vh;
  overflow-y: auto;
  }

  .editable-feature-input {
  transition: all 0.3s ease;
  border: 1px solid #ddd;
  }

  .editable-feature-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(123, 31, 162, 0.25);
  }

  .unlimited-input {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: #4CAF50;
  color: #2E7D32;
  font-weight: bold;
  }

  .limited-input {
  background-color: rgba(33, 150, 243, 0.1);
  border-color: #2196F3;
  color: #1976D2;
  }

  .plan-name-input {
  background: transparent;
  border: none;
  text-align: center;
  font-weight: bold;
  width: 100%;
  }

  .plan-name-input:focus {
  background: white;
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  }

  .update-plan-btn {
  position: relative;
  overflow: hidden;
  }

  .update-plan-btn:active {
  transform: scale(0.98);
  }

  .update-plan-btn.loading {
  opacity: 0.7;
  pointer-events: none;
  }

  .update-plan-btn.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  }

  @keyframes spin {
  to { transform: rotate(360deg); }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
  .plan-card {
  min-height: 400px;
  }

  #marriage_plan .modal-dialog {
  margin: 10px;
  }

  .plan-card h3 {
  font-size: 1.3rem !important;
  }

  .display-5 {
  font-size: 2rem !important;
  }

  .plan-name-input {
  font-size: 1.3rem !important;
  }
  }

  @media (max-width: 576px) {
  .plan-card {
  min-height: 380px;
  }

  .feature-text {
  font-size: 0.9rem !important;
  }

  .editable-feature-input {
  max-width: 80px !important;
  }

  .plan-name-input {
  font-size: 1.1rem !important;
  }
  }
      `;

   document.head.appendChild(style);
  }

  return {
   set_marriage_plan_innerHTML: set_marriage_plan_innerHTML,
   pullPlans: pullPlans,//the modal title's inline onclick="pullPlans()" needs this
  };
}

/* ------------------------------ public app ------------------------------- */
function installPublicMarriagePlan() {
  let marrege_plan_data = [];
  async function set_marriage_plan_innerHTML() {

   try {
    payload0.vw = 4;
    payload0.fn = 61; // get all plans;
    payload0.la = [{ "tb": "mp", "cl": "b", "la": "2025-12-31 23:59:59" }];
    const response = await fnj3("https://my1.in/2/g.php", payload0, 0, true, null, 20000, 0, 1, 1, 0);
    if (response.su == 1) {
     marrege_plan_data = response.mp.l;
    } else {
     alert(response.ms);
    }
   } catch (error) {
    console.error("Initialization failed:", error);
    showToast("Initialization error - please refresh");
   }

   // Check if modal already exists
   let marriagePlanModal = document.getElementById('marriage_plan');

   if (!marriagePlanModal) {
    // Create modal dynamically
    const modalResult = create_modal_dynamically("marriage_plan");

    // Set modal title
    const modalTitle = document.createElement('h4');
    modalTitle.className = 'modal-title text-center mb-4';
    modalTitle.innerHTML = `<i class="fas fa-heart me-2 text-danger"></i>Subscription Plans`;
    modalTitle.style.color = 'var(--primary-color)';
    modalTitle.style.fontWeight = '600';

    // Create container for plan cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'container-fluid';
    cardsContainer.id = 'marriage_plan_cards_container';

    // Insert title and container into modal body with scrollable layout
    const modalBody = modalResult.contentElement;
    modalBody.style.cssText = `
              display: flex;
              flex-direction: column;
              height: 100%;
              padding: 0;
          `;

    // Create title container (static)
    const titleContainer = document.createElement('div');
    titleContainer.className = 'modal-title-container';
    titleContainer.style.cssText = `
              flex-shrink: 0;
              padding: 20px;
              background: white;
              border-bottom: 1px solid var(--border-color);
              position: sticky;
              top: 0;
              z-index: 10;
          `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close plan-modal-close';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.innerHTML = 'x';
    closeButton.style.cssText = `
              position: absolute;
              top: 20px;
              right: 20px;
              background: rgba(123, 31, 162, 0.1);
              border-radius: 50%;
              padding: 8px;
              opacity: 0.7;
              transition: all 0.3s ease;
          `;

    closeButton.addEventListener('mouseenter', () => {
     closeButton.style.background = 'rgba(123, 31, 162, 0.2)';
     closeButton.style.opacity = '1';
     closeButton.style.transform = 'scale(1.1)';
    });

    closeButton.addEventListener('mouseleave', () => {
     closeButton.style.background = 'rgba(123, 31, 162, 0.1)';
     closeButton.style.opacity = '0.7';
     closeButton.style.transform = 'scale(1)';
    });

    titleContainer.appendChild(modalTitle);
    titleContainer.appendChild(closeButton);

    // Create content container (scrollable)
    const contentContainer = document.createElement('div');
    contentContainer.className = 'modal-content-container';
    contentContainer.style.cssText = `
              flex: 1;
              overflow-y: auto;
              padding: 20px;
          `;

    contentContainer.appendChild(cardsContainer);

    modalBody.appendChild(titleContainer);
    modalBody.appendChild(contentContainer);

    // Generate plan cards
    generatePlanCards();

    // Show the modal
    modalResult.modalInstance.show();

    // Add some custom CSS for the modal
    addPlanModalStyles();
   } else {
    // Modal exists, show it using Bootstrap
    const modalInstance = bootstrap.Modal.getInstance(marriagePlanModal) ||
     new bootstrap.Modal(marriagePlanModal);
    modalInstance.show();
   }
  }

  function generatePlanCards() {
   const container = document.getElementById('marriage_plan_cards_container');
   if (!container) return;

   // Clear container
   container.innerHTML = '';

   // Generate color schemes dynamically based on plan count
   const planColors = generateColorSchemes(marrege_plan_data.length);

   // Define icon classes for features
   const featureIcons = {
    mobile: 'fas fa-mobile-alt',
    chat: 'fas fa-comments',
    profile: 'fas fa-user-friends',
    unlimited: 'fas fa-infinity',
    price: 'fas fa-rupee-sign'
   };

   // Create a row for cards
   const row = document.createElement('div');
   row.className = 'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';

   // Loop through marriage plans and create cards
   marrege_plan_data.forEach((plan, index) => {
    const col = document.createElement('div');
    col.className = 'col';

    // Get color scheme for this plan
    const colorScheme = planColors[index % planColors.length];

    // Create card
    const card = document.createElement('div');
    card.className = 'card h-100 shadow-lg border-0 plan-card';
    card.style.backgroundColor = colorScheme.bg;
    card.style.border = `2px solid ${colorScheme.border}`;
    card.style.borderRadius = '15px';
    card.style.transition = 'all 0.3s ease';

    // Card header with plan name
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header bg-transparent border-bottom-0 pt-4';
    cardHeader.style.backgroundColor = `${colorScheme.border}20`; // 20% opacity

    const planName = document.createElement('h3');
    planName.className = 'card-title text-center mb-0';
    planName.style.color = colorScheme.text;
    planName.style.fontWeight = '700';
    planName.style.fontSize = '1.5rem';
    planName.textContent = plan.e.toUpperCase();

    cardHeader.appendChild(planName);

    // Card body with features
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column p-4';

    // Create features list
    const featuresList = document.createElement('ul');
    featuresList.className = 'list-unstyled mb-4 flex-grow-1';

    // Mobile unlock feature
    if (plan.f && plan.f !== '0') {
     const mobileItem = createFeatureItem(
      featureIcons.mobile,
      plan.f === '-1' ? 'Unlimited Mobile Unlocks' : `${plan.f} Mobile Unlocks`,
      plan.f === '-1' ? 'unlimited-badge' : 'feature-text'
     );
     featuresList.appendChild(mobileItem);
    }

    // Chatting feature
    if (plan.g && plan.g !== '0') {
     const chatItem = createFeatureItem(
      featureIcons.chat,
      plan.g === '-1' ? 'Unlimited Chatting' : `${plan.g} Chats Allowed`,
      plan.g === '-1' ? 'unlimited-badge' : 'feature-text'
     );
     featuresList.appendChild(chatItem);
    }

    // Profile browsing feature
    if (plan.i && plan.i !== '0') {
     const profileItem = createFeatureItem(
      featureIcons.profile,
      plan.i === '-1' ? 'Unlimited Profile Browsing' : `${plan.i} Profiles`,
      plan.i === '-1' ? 'unlimited-badge' : 'feature-text'
     );
     featuresList.appendChild(profileItem);
    }

    // Views (from h property)
    if (plan.h && plan.h !== '0') {
     const viewsItem = createFeatureItem(
      'fas fa-eye',
      `${plan.h} Profile Views`,
      'feature-text'
     );
     viewsItem.style.color = colorScheme.text;
     featuresList.appendChild(viewsItem);
    }

    cardBody.appendChild(featuresList);

    // Price section
    const priceSection = document.createElement('div');
    priceSection.className = 'mt-auto pt-3 border-top';

    const priceDiv = document.createElement('div');
    priceDiv.className = 'd-flex justify-content-center align-items-center mb-3';

    const priceIcon = document.createElement('i');
    priceIcon.className = `${featureIcons.price} me-2`;
    priceIcon.style.color = colorScheme.text;
    priceIcon.style.fontSize = '1.2rem';

    const priceValue = document.createElement('span');
    priceValue.className = 'display-5 fw-bold';
    priceValue.style.color = colorScheme.text;
    priceValue.textContent = `₹${plan.j}`;

    const pricePeriod = document.createElement('span');
    pricePeriod.className = 'text-muted ms-1';
    pricePeriod.textContent = '/month';
    pricePeriod.style.fontSize = '0.9rem';

    priceDiv.appendChild(priceIcon);
    priceDiv.appendChild(priceValue);
    priceDiv.appendChild(pricePeriod);

    // Select button
    const selectButton = document.createElement('button');
    selectButton.className = 'btn w-100 py-3 fw-bold';
    selectButton.style.backgroundColor = colorScheme.text;
    selectButton.style.color = 'white';
    selectButton.style.border = 'none';
    selectButton.style.borderRadius = '50px';
    selectButton.style.transition = 'all 0.3s ease';
    selectButton.innerHTML = `<i class="fas fa-check-circle me-2"></i>Select Plan`;
    selectButton.onmouseover = () => {
     selectButton.style.transform = 'translateY(-2px)';
     selectButton.style.boxShadow = `0 5px 15px ${colorScheme.text}40`;
    };
    selectButton.onmouseout = () => {
     selectButton.style.transform = 'translateY(0)';
     selectButton.style.boxShadow = 'none';
    };

    // Add click handler for plan selection
    selectButton.onclick = () => selectPlan(plan);

    priceSection.appendChild(priceDiv);
    priceSection.appendChild(selectButton);
    cardBody.appendChild(priceSection);

    // Assemble card
    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    // Add hover effect
    card.onmouseover = () => {
     card.style.transform = 'translateY(-5px)';
     card.style.boxShadow = `0 10px 30px ${colorScheme.border}40`;
    };
    card.onmouseout = () => {
     card.style.transform = 'translateY(0)';
     card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
    };

    col.appendChild(card);
    row.appendChild(col);
   });

   container.appendChild(row);

   // Add comparison section only if there are multiple plans
   if (marrege_plan_data.length > 1) {
    addComparisonSection(container, planColors);
   }
  }

  function generateColorSchemes(planCount) {
   // Base colors from your theme
   const baseColors = [
    { bg: 'rgba(123, 31, 162, 0.1)', border: '#7B1FA2', text: '#4A148C' },      // Violet
    { bg: 'rgba(0, 191, 165, 0.1)', border: '#00BFA5', text: '#00897B' },       // Teal
    { bg: 'rgba(255, 179, 0, 0.1)', border: '#FFB300', text: '#FF8F00' },       // Amber
    { bg: 'rgba(76, 175, 80, 0.1)', border: '#4CAF50', text: '#388E3C' },       // Green
    { bg: 'rgba(33, 150, 243, 0.1)', border: '#2196F3', text: '#1976D2' },      // Blue
    { bg: 'rgba(156, 39, 176, 0.1)', border: '#9C27B0', text: '#7B1FA2' },      // Purple
    { bg: 'rgba(244, 67, 54, 0.1)', border: '#F44336', text: '#D32F2F' },       // Red
    { bg: 'rgba(255, 152, 0, 0.1)', border: '#FF9800', text: '#F57C00' }        // Orange
   ];

   // If we have more plans than base colors, generate additional colors
   if (planCount <= baseColors.length) {
    return baseColors.slice(0, planCount);
   }

   // Generate additional colors by adjusting hue of base colors
   const colorSchemes = [...baseColors];

   for (let i = baseColors.length; i < planCount; i++) {
    // Take a base color and adjust its hue
    const baseIndex = i % baseColors.length;
    const baseColor = baseColors[baseIndex];

    // Create variations by adjusting opacity and brightness
    const hueAdjust = (i * 30) % 360; // Adjust hue by 30 degrees for each extra color

    colorSchemes.push({
     bg: `hsla(${hueAdjust}, 70%, 80%, 0.1)`,
     border: `hsl(${hueAdjust}, 70%, 50%)`,
     text: `hsl(${hueAdjust}, 70%, 30%)`
    });
   }

   return colorSchemes;
  }

  function createFeatureItem(iconClass, text, badgeClass = 'feature-text') {
   const li = document.createElement('li');
   li.className = 'd-flex align-items-center mb-3';

   const icon = document.createElement('i');
   icon.className = `${iconClass} me-3`;
   icon.style.color = 'var(--primary-color)';
   icon.style.width = '20px';
   icon.style.textAlign = 'center';

   const textSpan = document.createElement('span');
   textSpan.className = badgeClass;
   textSpan.textContent = text;
   textSpan.style.fontSize = '0.95rem';

   li.appendChild(icon);
   li.appendChild(textSpan);

   return li;
  }

  function selectPlan(plan) {
   console.log('Plan selected:', plan);
   // You can implement payment integration or plan selection logic here
   showToast(`Selected ${plan.e.toUpperCase()} plan for ₹${plan.j}`, {
    type: 'success',
    duration: 3000
   });

   // Handle localStorage profile management
   const profilesKey = appOwner.eo + appOwner.ec + "profiles";
   let profiles = JSON.parse(localStorage.getItem(profilesKey) || '[]');

   const profileObject = {
    "eoo": my1uzr.mo,
    "eoc": my1uzr.mc,
    "eoh": "belwalkar",
    "eoi": "utf",
    "a": "9",
    "b": "2026-02-25 12:51:41",
    "c": "0",
    "d": "0",
    "e": "18",
    "f": "1",
    "g": "2006-11-29 12:00:00",
    "h": "0.00",
    "i": "0.00",
    "j": "0",
    "k": "4",
    "k1": "2",
    "l": "91.9766537391",
    "m": "",
    "n": "",
    "o": "",
    "p": "",
    "ma": "",
    "na": "",
    "oa": "",
    "pa": "",
    "q": "0",
    "qa": "",
    "qb": "0",
    "qc": "",
    "r": "0",
    "s": "2,103",
    "t": "",
    "u": "https:\/\/lh3.googleusercontent.com\/d\/154fwnyWYz9RRRdKynnjprvqa1CnOuoYY=s0?authuser=0",
    "ut": "https:\/\/lh3.googleusercontent.com\/d\/154fwnyWYz9RRRdKynnjprvqa1CnOuoYY=s0?authuser=0",
    "v": "",
    "va": "",
    "x": "",
    "z": "0",
    "a1": "0.00",
    "a2": "97",
    "a3": "255",
    "a4": "0",
    "a5": "0",
    "a6": "0.0",
    "a7": "0",
    "a8": "",
    "a9": "9,20,35,62",
    "b1": "",
    "b4": "97",
    "b5": "255",
    "b6": "",
    "b9": "0",
    "c1": "0",
    "c2": "",
    "c3": "0",
    "c5": "97",
    "c6": "773",
    "c7": "0",
    "c8": "0",
    "c9": "0",
    "d1": "0",
    "d2": "0",
    "h1": "0",
    "h2": "0",
    "i1": "0",
    "i2": "0",
    "i3": "0",
    "i4": "0",
    "i5": "0",
    "i6": "0",
    "i7": "0",
    "i8": "0",
    "x1": "",
    "x2": "",
    "x3": "0",
    "x4": "0",
    "x5": "0"
   };

   if (profiles.length === 0) {
    // Array is empty, add the object
    profiles.push(profileObject);
    console.log('Added new profile to empty array');
   } else {
    // Check if eoo already exists
    const existingProfileIndex = profiles.findIndex(profile => profile.eoo === my1uzr.mo);

    if (existingProfileIndex !== -1) {
     // Update existing profile
     profiles[existingProfileIndex] = profileObject;
     console.log('Updated existing profile with eoo:', my1uzr.mo);
    } else {
     // Add new profile
     profiles.push(profileObject);
     console.log('Added new profile with eoo:', my1uzr.mo);
    }
   }

   // Save updated profiles back to localStorage
   localStorage.setItem(profilesKey, JSON.stringify(profiles));
   console.log('Profiles saved to localStorage with key:', profilesKey);

   // Close modal after selection
   const modal = document.getElementById('marriage_plan');
   if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
     modalInstance.hide();
    }
   }
  }

  function addComparisonSection(container, planColors) {
   const comparisonDiv = document.createElement('div');
   comparisonDiv.className = 'mt-5 pt-4 border-top';

   const comparisonTitle = document.createElement('h5');
   comparisonTitle.className = 'text-center mb-4';
   comparisonTitle.style.color = 'var(--primary-dark)';
   comparisonTitle.innerHTML = '<i class="fas fa-chart-bar me-2"></i>Plan Comparison';

   // Create scrollable wrapper for table
   const tableWrapper = document.createElement('div');
   tableWrapper.style.cssText = `
          overflow-x: auto;
          border-radius: 10px;
          background: rgba(123, 31, 162, 0.05);
          padding: 10px;
          margin: 0 -10px;
      `;

   // Create comparison table
   const table = document.createElement('table');
   table.className = 'table table-borderless table-hover mb-0 comparison-table';
   table.style.minWidth = '600px'; // Minimum width for good visibility
   table.style.width = '100%';

   // Table header
   const thead = document.createElement('thead');
   const headerRow = document.createElement('tr');

   // Features column header
   const featuresTh = document.createElement('th');
   featuresTh.scope = 'col';
   featuresTh.className = 'text-muted';
   featuresTh.style.cssText = `
          background: rgba(123, 31, 162, 0.1);
          border: 1px solid var(--border-color);
          min-width: 150px;
          left: 0;
          z-index: 1;
      `;
   featuresTh.textContent = 'Features';
   headerRow.appendChild(featuresTh);

   // Plan name headers with their respective colors - MATCHING CARD COLORS
   marrege_plan_data.forEach((plan, index) => {
    const planTh = document.createElement('th');
    planTh.scope = 'col';
    planTh.className = 'text-center fw-bold';
    planTh.style.cssText = `
              color: ${planColors[index].text};
              background: ${planColors[index].bg};
              border: 1px solid ${planColors[index].border}30;
              min-width: 120px;
          `;
    planTh.textContent = plan.e.toUpperCase();
    headerRow.appendChild(planTh);
   });

   thead.appendChild(headerRow);

   // Table body
   const tbody = document.createElement('tbody');

   // Add rows for each feature
   const features = [
    { name: 'Mobile Unlocks', key: 'f' },
    { name: 'Chatting', key: 'g' },
    { name: 'Profile Browsing', key: 'i' },
    { name: 'Profile Views', key: 'h' },
    { name: 'Monthly Price', key: 'j', prefix: '₹' }
   ];

   features.forEach(feature => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.className = 'fw-bold';
    nameCell.textContent = feature.name;
    nameCell.style.cssText = `
              border-right: 1px solid var(--border-color);
              background: rgba(123, 31, 162, 0.05);
              left: 0;
              z-index: 1;
              min-width: 150px;
          `;

    row.appendChild(nameCell);

    marrege_plan_data.forEach((plan, planIndex) => {
     const valueCell = document.createElement('td');
     valueCell.className = 'text-center';
     valueCell.style.cssText = `
                  background: ${planColors[planIndex].bg};
                  border: 1px solid ${planColors[planIndex].border}30;
                  min-width: 120px;
              `;

     let value = plan[feature.key];
     if (value === '-1') {
      valueCell.innerHTML = '<i class="fas fa-infinity text-success"></i>';
      valueCell.title = 'Unlimited';
     } else if (value === '0') {
      valueCell.innerHTML = '<i class="fas fa-times text-danger"></i>';
      valueCell.title = 'Not included';
     } else {
      valueCell.textContent = feature.prefix ? `${feature.prefix}${value}` : value;
     }

     row.appendChild(valueCell);
    });

    tbody.appendChild(row);
   });

   table.appendChild(thead);
   table.appendChild(tbody);

   tableWrapper.appendChild(table);
   comparisonDiv.appendChild(comparisonTitle);
   comparisonDiv.appendChild(tableWrapper);
   container.appendChild(comparisonDiv);
  }

  function addPlanModalStyles() {
   const styleId = 'marriage-plan-modal-styles';
   if (document.getElementById(styleId)) return;

   const style = document.createElement('style');
   style.id = styleId;
   style.textContent = `
  .plan-card {
  min-height: 450px;
  overflow: hidden;
  }

  .plan-card:hover {
  transform: translateY(-5px) !important;
  }

  .unlimited-badge {
  background: linear-gradient(135deg, var(--success-color), #2E7D32);
  color: white !important;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.85rem !important;
  font-weight: 600;
  display: inline-block;
  }

  .feature-text {
  color: var(--text-dark);
  flex-grow: 1;
  }

  #marriage_plan .modal-dialog {
  max-width: 1200px;
  max-height: 90vh;
  }

  #marriage_plan .modal-content {
  height: 90vh;
  max-height: 90vh;
  border-radius: 15px;
  overflow: hidden;
  }

  #marriage_plan .modal-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  }

  .modal-title-container {
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  z-index: 10;
  }

  .modal-content-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px !important;
  }

  .plan-modal-close {
  position: absolute !important;
  top: 20px !important;
  right: 20px !important;
  background: rgba(123, 31, 162, 0.1) !important;
  border-radius: 50% !important;
  padding: 8px !important;
  opacity: 0.7 !important;
  }

  .plan-modal-close:hover {
  background: rgba(123, 31, 162, 0.2) !important;
  opacity: 1 !important;
  transform: scale(1.1) !important;
  }

  /* Table styling with matching colors */
  .comparison-table th,
  .comparison-table td {
  transition: all 0.3s ease;
  vertical-align: middle;
  }

  .comparison-table th:hover,
  .comparison-table td:hover {
  filter: brightness(1.05);
  }

  /* First column for better comparison */
  .comparison-table th:first-child,
  .comparison-table td:first-child {
  left: 0;
  z-index: 1;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
  .plan-card {
  min-height: 400px;
  }

  #marriage_plan .modal-dialog {
  margin: 10px;
  max-height: 95vh;
  }

  #marriage_plan .modal-content {
  height: 95vh;
  max-height: 95vh;
  }

  .plan-card h3 {
  font-size: 1.3rem !important;
  }

  .display-5 {
  font-size: 2rem !important;
  }

  .modal-title-container {
  padding: 15px !important;
  }

  .modal-content-container {
  padding: 15px !important;
  }

  .plan-modal-close {
  top: 15px !important;
  right: 15px !important;
  padding: 6px !important;
  }

  .comparison-table {
  min-width: 700px;
  }
  }

  @media (max-width: 576px) {
  .plan-card {
  min-height: 380px;
  }

  .feature-text {
  font-size: 0.9rem !important;
  }

  #marriage_plan .modal-dialog {
  margin: 5px;
  }

  .modal-title-container,
  .modal-content-container {
  padding: 10px !important;
  }
  }

  /* Custom scrollbar for content container */
  .modal-content-container::-webkit-scrollbar {
  width: 8px;
  }

  .modal-content-container::-webkit-scrollbar-track {
  background: rgba(123, 31, 162, 0.05);
  border-radius: 4px;
  }

  .modal-content-container::-webkit-scrollbar-thumb {
  background: var(--primary-light);
  border-radius: 4px;
  }

  .modal-content-container::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
  }

  /* Custom scrollbar for table wrapper */
  .comparison-table-wrapper::-webkit-scrollbar {
  height: 8px;
  }

  .comparison-table-wrapper::-webkit-scrollbar-track {
  background: rgba(123, 31, 162);
  border-radius: 4px;
  margin: 0 10px;
  }

  .comparison-table-wrapper::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
  }

  .comparison-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
  }
  `;

   document.head.appendChild(style);
  }

  return {
   set_marriage_plan_innerHTML: set_marriage_plan_innerHTML,
  };
}
