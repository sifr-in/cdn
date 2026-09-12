/* ============================================================
   HT - messageModal.js
   ------------------------------------------------------------
   Unified modal (milk/KS pattern, Bootstrap implementation).
   Supports: opts.type = "message" | "confirm".
   Colored with the HT ember/gold theme.
   ============================================================ */

window.showModal = function (opts) {
  var title = opts.title || "";
  var message = opts.message || "";
  var isError = !!opts.isError;
  var type = opts.type || "message";
  var onConfirm = typeof opts.onConfirm === "function" ? opts.onConfirm : null;
  var onCancel = typeof opts.onCancel === "function" ? opts.onCancel : null;
  var onClose = typeof opts.onClose === "function" ? opts.onClose : null;
  var isConfirm = type === "confirm";

  var mid = "msgModal_" + Date.now();
  var bgColor = isError ? "#dc3545" : "var(--ember)";
  var borderColor = isError ? "#dc3545" : "var(--gold)";
  var icon = isError
    ? "fa-exclamation-circle"
    : isConfirm
      ? "fa-question-circle"
      : "fa-check-circle";

  var footerHtml = "";
  if (isConfirm) {
    footerHtml =
      '<div class="modal-footer" style="padding:10px 16px;border-top:1px solid #E8E8E8;gap:8px;">' +
      '<button type="button" class="ht-btn ht-btn-ghost" data-bs-dismiss="modal">Cancel</button>' +
      '<button type="button" class="ht-btn ht-btn-ember" id="' +
      mid +
      '_confirmBtn">Confirm</button>' +
      "</div>";
  } else {
    footerHtml =
      '<div class="modal-footer" style="padding:10px 16px;border-top:1px solid #E8E8E8;">' +
      '<button type="button" class="ht-btn ht-btn-ember" data-bs-dismiss="modal">OK</button>' +
      "</div>";
  }

  var html =
    '<div class="modal fade" id="' +
    mid +
    '" tabindex="-1" aria-hidden="true" style="z-index:99999;">' +
    '<div class="modal-dialog modal-dialog-centered modal-sm">' +
    '<div class="modal-content shadow-lg" style="border:2px solid ' +
    borderColor +
    ";border-radius:12px;overflow:hidden;\">" +
    '<div class="modal-header" style="background:' +
    bgColor +
    ";color:#fff;padding:12px 16px;border-bottom:2px solid " +
    borderColor +
    ';">' +
    '<h6 class="modal-title fw-bold" style="font-size:14px;">' +
    '<i class="fas ' +
    icon +
    ' me-2"></i>' +
    title +
    "</h6>" +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
    "</div>" +
    '<div class="modal-body" style="padding:16px;font-size:14px;white-space:pre-line;">' +
    message +
    "</div>" +
    footerHtml +
    "</div></div></div>";

  document.body.insertAdjacentHTML("beforeend", html);
  var modalEl = document.getElementById(mid);
  var m = new bootstrap.Modal(modalEl, { backdrop: "static" });
  m.show();

  if (isConfirm && onConfirm) {
    var confirmBtn = document.getElementById(mid + "_confirmBtn");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        m.hide();
        onConfirm();
      });
    }
  }

  modalEl.addEventListener("hidden.bs.modal", function () {
    this.remove();
    if (onClose) onClose();
  });

  return modalEl;
};

// Backward-compatible wrapper - all existing showMessageModal calls keep working
window.showMessageModal = function (title, message, isError, onClose) {
  return window.showModal({
    title: title,
    message: message,
    isError: isError,
    type: "message",
    onClose: onClose,
  });
};

console.log("✅ messageModal.js loaded");
