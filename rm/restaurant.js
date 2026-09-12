// restaurant.js - HT Royal Stay restaurant menu & dining

function htMenuSection(title, icon, items) {
  var rows = "";
  for (var i = 0; i < items.length; i++) {
    rows +=
      '<div class="ht-menu-item">' +
      '<span class="mi-name">' +
      escHtml(items[i].name) +
      "</span>" +
      '<span class="mi-price">₹' +
      items[i].price +
      "</span></div>";
  }
  return (
    '<div class="col-12 col-md-6 col-lg-4">' +
    '<div class="ht-menu-card animate-fade-in-up">' +
    '<div class="ht-menu-title"><i class="fas ' +
    icon +
    '"></i>' +
    escHtml(title) +
    "</div>" +
    rows +
    "</div></div>"
  );
}

window.showRestaurant = function () {
  setView("restaurant");
  var container = document.getElementById("htContainer");
  if (!container) return;

  container.innerHTML =
    '<div class="ht-section-title">' +
    '<div class="bar"></div>' +
    "<h5>Restaurant &amp; Dining</h5>" +
    '<span class="sub">In-room dining available 24/7</span>' +
    "</div>" +
    '<div class="ht-empty">' +
    '<i class="fas fa-utensils"></i>' +
    "<b>No menu data</b>" +
    "<p>Restaurant menu will appear here once configured.</p>" +
    "</div>";
};

console.log("🍽️ restaurant.js loaded");
