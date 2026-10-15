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
      ".ht-modal-overlay{--gold:#c9a45c;--gold-dark:#b08a3c;--gold-light:#e6cf9b;--ember:#8B1E3F;--ink:#241d12;--muted:#6f6656;--charcoal:#2f2a20;--surface:#fffdf6;--radius-sm:10px;--radius-md:14px;position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(30,24,12,.55);backdrop-filter:blur(3px);opacity:0;transition:opacity .26s ease;}" +
      ".ht-modal-overlay.open{opacity:1;}" +
      ".ht-modal{background:#fff;border:1px solid rgba(201,164,92,.5);border-radius:18px;width:100%;max-width:460px;padding:22px 20px 20px;box-shadow:0 24px 60px rgba(0,0,0,.35);transform:translateY(14px);transition:transform .26s ease;position:relative;}" +
      ".ht-cont-x{position:absolute;top:10px;right:10px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(201,164,92,.55);border-radius:50%;background:transparent;color:var(--muted);font-size:16px;cursor:pointer;transition:background .2s ease,color .2s ease;}" +
      ".ht-cont-x:hover{background:var(--gold);color:#2a2010;}" +
      ".ht-modal-overlay.open .ht-modal{transform:translateY(0);}" +
      ".ht-modal .m-ic{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;margin-bottom:12px;background:linear-gradient(135deg,var(--gold-light),var(--gold));color:#2a2010;font-size:22px;box-shadow:0 8px 20px rgba(201,164,92,.45);}" +
      ".ht-modal h3{font-size:22px;margin:0 0 6px;color:var(--charcoal);}" +
      ".ht-cont-head{display:flex;align-items:center;gap:12px;margin-bottom:6px;}" +
      ".ht-cont-head .m-ic{margin-bottom:0;flex:0 0 auto;}" +
      ".ht-cont-head h3{margin:0;}" +
      ".ht-modal .m-sub{font-size:13.5px;color:var(--muted);line-height:1.5;margin-bottom:8px;}" +
      ".ht-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid transparent;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;transition:filter .2s ease;}" +
      ".ht-btn:hover{filter:brightness(1.05);}" +
      ".ht-btn:disabled{opacity:.65;cursor:not-allowed;}" +
      ".ht-btn-ghost{background:transparent;color:var(--muted);border-color:rgba(201,164,92,.55);}" +
      ".ht-btn-ember{background:linear-gradient(135deg,var(--gold),#b08a3c);color:#2a2010;}" +
      ".ht-cont-modal{max-width:460px!important;}" +
      ".ht-cont-form{display:flex;flex-direction:column;gap:14px;margin-top:10px;}" +
      ".ht-cont-field{display:flex;flex-direction:column;gap:5px;}" +
      ".ht-cont-field label{font-size:11px;text-transform:uppercase;letter-spacing:1.1px;color:var(--muted);}" +
      ".ht-cont-input,.ht-cont-textarea{width:100%;box-sizing:border-box;font-size:14px;color:var(--ink);background:var(--surface);border:1px solid var(--gold-dark);border-radius:var(--radius-sm);padding:10px 12px;outline:none;transition:border-color .2s ease,box-shadow .2s ease;}" +
      ".ht-cont-input:focus,.ht-cont-textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,164,92,.18);}" +
      ".ht-cont-textarea{resize:vertical;min-height:104px;line-height:1.5;}" +
      ".ht-cont-actions{display:flex;gap:10px;margin-top:2px;}" +
      ".ht-cont-actions .ht-btn{flex:1;padding:11px 14px;}" +
      ".ht-cont-status{border-radius:var(--radius-md);padding:11px 14px;font-size:13.5px;text-align:center;line-height:1.45;}" +
      ".ht-cont-status.ht-cont-err{color:var(--ember);background:rgba(139,30,63,.09);border:1px solid rgba(139,30,63,.25);}" +
      ".ht-cont-thanks{text-align:center;padding:8px 4px 4px;}" +
      ".ht-cont-thanks .ic{width:56px;height:56px;border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:22px;background:linear-gradient(135deg,var(--gold-light),var(--gold));color:#2a2010;box-shadow:0 8px 20px rgba(201,164,92,.45);}" +
      ".ht-cont-thanks h3{color:var(--charcoal);margin:0 0 6px;}" +
      ".ht-cont-thanks p{margin:0 0 16px;color:var(--muted);font-size:13.5px;}";

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

  function getContaUsInfo() {
    try {
      if (typeof my1uzr !== "undefined" && window[my1uzr.worknOnPg] &&
          window[my1uzr.worknOnPg].clientConfig &&
          window[my1uzr.worknOnPg].clientConfig.contaUsInfo &&
          typeof window[my1uzr.worknOnPg].clientConfig.contaUsInfo === "object") {
        return window[my1uzr.worknOnPg].clientConfig.contaUsInfo;
      }
    } catch (e) {}
    return {};
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
      '<button type="button" class="ht-cont-x" id="htContX" title="Close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
      '<div class="ht-cont-head">' +
      '<span class="m-ic"><i class="fa-solid fa-envelope-open-text"></i></span>' +
      "<h3>" + esc(getContaUsInfo().title || "Contact Us") + "</h3>" +
      "</div>" +
      '<div class="m-sub">' + esc(getContaUsInfo().sub || "We would love to hear from you. Drop us a message below.") + '</div>' +
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
    ov.querySelector("#htContX").addEventListener("click", close);
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

      var endpoint = getContaUsInfo().endPoint || "mel.php";

      fetch(endpoint, {
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