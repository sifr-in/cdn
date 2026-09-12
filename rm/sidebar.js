// sidebar.js - HT Royal Stay sidebar navigation

function toggleSidebar() {
  var sidebar = document.getElementById("appSidebar");
  var overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.classList.toggle("open");
  if (overlay) overlay.classList.toggle("visible");
}

function closeSidebar() {
  var sidebar = document.getElementById("appSidebar");
  var overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.classList.remove("visible");
}

window.handleMenuAction = function (action) {
  closeSidebar();
  if (typeof openAdminFromMenu === "function") {
    openAdminFromMenu(action).catch(function(err) {
      console.error("handleMenuAction error for", action, err);
    });
  }
};

console.log("📂 sidebar.js loaded");
