// sidebar.js - Shared sidebar navigation

function toggleSidebar() {
  var sidebar = document.getElementById("appSidebar");
  var overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.classList.toggle("open");
  if (overlay) overlay.classList.toggle("visible");
}

window.handleMenuAction = function (action) {
  toggleSidebar();
  if (action === "addNew")
    setTimeout(function () {
      showAddCaseModal();
    }, 300);
  else if (action === "allCases")
    setTimeout(function () {
      showAllCases();
    }, 300);
};

console.log("📂 sidebar.js loaded");
