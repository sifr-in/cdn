(function () {
  "use strict";

  var CSS_ID = "htContaCss";
  var MODAL_ID = "htContactModal";

  if (typeof injectHTStyles === "function") {
    try {
      injectHTStyles();
    } catch (e) {}
  }

  function ensureCss() {
    if (document.getElementById(CSS_ID)) return;
    var s = document.createElement("style");
    s.id = CSS_ID;
    s.textContent =
      ".ht-cont-modal{max-width:460px!important;}" +
      ".ht-cont-form{display:flex;flex-direction:column;gap:14px;margin-top:10px;}" +
      ".ht-cont-field{display:flex;flex-direction:column;gap:5px;}" +
      ".ht-cont-field label{font-size:11px;text-transform:uppercase;letter-spacing:1.1px;color:var(--muted);}" +
      ".ht-cont-input,.ht-cont-textarea{width:100%;box-sizing:border-box;font-family:'Inter',-apple-system,'Segoe UI',Roboto,sans-serif;font-size:14px;color:var(--ink);background:var(--surface,#fffdf6);border:1px solid rgba(201,164,92,0.45);border-radius:var(--radius-sm,10px);padding:10px 12px;outline:none;transition:border-color .2s ease,box-shadow .2s ease;}" +
      ".ht-cont-input:focus,.ht-cont-textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,164,92,0.18);}" +
      ".ht-cont-textarea{resize:vertical;min-height:104px;line-height:1.5;}" +
      ".ht-cont-actions{display:flex;gap:10px;margin-top:2px;}" +
      ".ht-cont-actions .ht-btn{flex:1;padding:11px 14px;}" +
      ".ht-cont-status{border-radius:var(--radius-md,14px);padding:11px 14px;font-size:13.5px;text-align:center;line-height:1.45;}" +
      ".ht-cont-status.ht-cont-err{color:var(--ember,#8a2a1b);background:rgba(138,42,27,0.09);border:1px solid rgba(138,42,27,0.25);}" +
      ".ht-cont-status.ht-cont-ok{color:#3f6212;background:rgba(122,160,60,0.12);border:1px solid rgba(90,128,40,0.3);}" +
      ".ht-cont-thanks{text-align:center;padding:8px 4px 4px;}" +
      ".ht-cont-thanks .ic{width:56px;height:56px;border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:22px;background:linear-gradient(135deg,var(--gold-light),var(--gold));color:#2a2010;box-shadow:0 8px 20px rgba(201,164,92,0.45);}" +
      ".ht-cont-thanks h3{font-family:'Playfair Display',Georgia,serif;color:var(--charcoal);margin:0 0 6px;}" +
      ".ht-cont-thanks p{margin:0 0 16px;color:var(--muted);font-size:13.5px;}" +
      ".ht-footer-contact-btn{padding:6px 12px !important;font-size:12px !important;border-radius:9px !important;}";

    document.head.appendChild(s);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  window.showContactModal = function () {
    ensureCss();

    var old = document.getElementById(MODAL_ID);
    if (old) old.parentNode.removeChild(old);

    var ov = document.createElement("div");
    ov.className = "ht-modal-overlay";
    ov.id = MODAL_ID;

    var close = function () {
      ov.classList.remove("open");
      setTimeout(function () {
        var node = document.getElementById(MODAL_ID);
        if (node) node.parentNode.removeChild(node);
      }, 260);
    };

    ov.innerHTML =
      '<div class="ht-modal ht-cont-modal">' +
      '<span class="m-ic"><i class="fa-solid fa-envelope-open-text"></i></span>' +
      "<h3>Contact Us</h3>" +
      '<div class="m-sub">We would love to hear from you. Drop us a message below.</div>' +
      '<form class="ht-cont-form" id="htContForm" novalidate>' +
      '<div class="ht-cont-field"><label for="htContNm">Name</label><input class="ht-cont-input" id="htContNm" name="nm" type="text" autocomplete="name" placeholder="Your name" required></div>' +
      '<div class="ht-cont-field"><label for="htContNu">Email</label><input class="ht-cont-input" id="htContNu" name="nu" type="email" autocomplete="email" placeholder="you@example.com" required></div>' +
      '<div class="ht-cont-field"><label for="htContMs">Subject</label><textarea class="ht-cont-textarea" id="htContMs" name="ms" placeholder="Write your message..." required></textarea></div>' +
      '<div id="htContStatus"></div>' +
      '<div class="ht-cont-actions">' +
      '<button type="button" class="ht-btn ht-btn-ghost" id="htContClose">Close</button>' +
      '<button type="submit" class="ht-btn ht-btn-ember" id="htContSend"><i class="fa-solid fa-paper-plane"></i><span>Send</span></button>' +
      "</div>" +
      "</form>" +
      "</div>";

    document.body.appendChild(ov);

    var form = ov.querySelector("#htContForm");
    var sendBtn = ov.querySelector("#htContSend");
    var statusEl = ov.querySelector("#htContStatus");

    function showStatus(kind, msg) {
      statusEl.innerHTML = '<div class="ht-cont-status ht-cont-' + kind + '">' + esc(msg) + "</div>";
    }

    function setSending(on) {
      sendBtn.disabled = on;
      if (on) {
        sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Sending...</span>';
      } else {
        sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i><span>Send</span>';
      }
    }

    ov.addEventListener("click", function (e) {
      if (e.target === ov) close();
    });
    ov.querySelector("#htContClose").addEventListener("click", close);
    document.addEventListener("keydown", function hk(e) {
      if (e.key === "Escape" && document.getElementById(MODAL_ID) === ov) {
        close();
        document.removeEventListener("keydown", hk);
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.innerHTML = "";

      var nm = form.nm.value.trim();
      var nu = form.nu.value.trim();
      var ms = form.ms.value.trim();

      if (!nm || !nu || !ms) {
        showStatus("err", "Name, email, and a message are required.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nu)) {
        showStatus("err", "Please enter a valid email address.");
        return;
      }

      var body =
        "nm=" + encodeURIComponent(nm) +
        "&nu=" + encodeURIComponent(nu) +
        "&ms=" + encodeURIComponent(ms);

      setSending(true);

      fetch("mel.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: body
      })
        .then(function (res) {
          return res.text().then(function (txt) {
            return { ok: res.ok, txt: txt };
          });
        })
        .then(function (data) {
          setSending(false);
          if (data.ok) {
            form.innerHTML =
              '<div class="ht-cont-thanks">' +
              '<div class="ic"><i class="fa-solid fa-check"></i></div>' +
              "<h3>Submitted successfully</h3>" +
              "<p>Thank you for reaching out. We will get back to you soon.</p>" +
              '<button type="button" class="ht-btn ht-btn-ember" id="htContDone">Done</button>' +
              "</div>";
            ov.querySelector("#htContDone").addEventListener("click", close);
          } else {
            showStatus("err", data.txt || "Please try again. Email sending failed.");
          }
        })
        .catch(function () {
          setSending(false);
          showStatus("err", "Connection error. Please try again.");
        });
    });

    requestAnimationFrame(function () {
      ov.classList.add("open");
    });
  };
})();