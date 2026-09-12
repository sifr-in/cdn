// rm_da.js - RM Settings (direct save)
// Fetches rm.da directly, POSTs to 3/c.php (fn 104)
// Entry point: showPrintSettings() called from openAdminFromMenu("settings")

const SETTINGS_SAVE_URL = "https://my1.in/5/a.php";
const SETTINGS_SAVE_FN = 104;
const SETTINGS_DRML = "sambodhisarang.in";

(function () {
  "use strict";

  console.log("rm_da.js initializing...");

  async function loadSettings() {
    try {
      var resp = await fetch("rm.da");
      if (resp.ok) {
        var da = await resp.json();
        console.log("Loaded settings from rm.da:", da);
        return da;
      } else {
        console.warn("rm.da not found (" + resp.status + ")");
      }
    } catch (e) {
      console.warn("Could not load rm.da:", e);
    }
    return null;
  }

  function showMsgAbove(title, message, isError) {
    if (typeof window.showMessageModal !== "function") return;
    var el = window.showMessageModal(title, message, isError);
    if (!el || !el.style) return;
    el.style.zIndex = "1080";
    var sib = el.nextElementSibling;
    while (sib) {
      if (
        sib.classList &&
        sib.classList.contains("modal-backdrop") &&
        Number(getComputedStyle(sib).zIndex || 0) < 1080
      ) {
        sib.style.zIndex = "1070";
        break;
      }
      sib = sib.nextElementSibling;
    }
  }

  function confirmYesNo(message) {
    return new Promise(function (resolve) {
      try {
        if (typeof window.showModal === "function" && typeof bootstrap !== "undefined") {
          var mid = "rmConfirm_" + Date.now();
          var html =
            '<div class="modal fade" id="' +
            mid +
            '" tabindex="-1" aria-hidden="true">' +
            '<div class="modal-dialog modal-dialog-centered modal-sm">' +
            '<div class="modal-content shadow-lg" style="border:2px solid var(--gold);border-radius:12px;overflow:hidden;">' +
            '<div class="modal-header" style="background:var(--ember);color:#fff;padding:12px 16px;border-bottom:2px solid var(--gold);">' +
            '<h6 class="modal-title fw-bold" style="font-size:14px;">' +
            '<i class="fas fa-question-circle me-2"></i>Confirm Save</h6>' +
            '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
            "</div>" +
            '<div class="modal-body" style="padding:16px;font-size:14px;white-space:pre-line;">' +
            message +
            "</div>" +
            '<div class="modal-footer" style="padding:10px 16px;border-top:1px solid #E8E8E8;gap:8px;">' +
            '<button type="button" class="ht-btn ht-btn-ghost" data-bs-dismiss="modal">No</button>' +
            '<button type="button" class="ht-btn ht-btn-ember" id="' +
            mid +
            '_yesBtn">Yes</button>' +
            "</div>" +
            "</div></div></div>";

          document.body.insertAdjacentHTML("beforeend", html);
          var modalEl = document.getElementById(mid);
          var m = new bootstrap.Modal(modalEl, { backdrop: "static" });
          m.show();
          modalEl.style.zIndex = "1080";

          var settled = false;
          function settle(result) {
            if (settled) return;
            settled = true;
            resolve(result);
          }

          document.getElementById(mid + "_yesBtn").addEventListener("click", function () {
            settle(true);
            m.hide();
          });
          modalEl.querySelector('[data-bs-dismiss="modal"]').addEventListener("click", function () {
            settle(false);
          });
          modalEl.addEventListener("hidden.bs.modal", function () {
            settle(false);
            this.remove();
          });
          return;
        }
      } catch (e) {
        console.warn("confirm modal failed:", e);
      }
      resolve(confirm(message));
    });
  }

  async function showPrintSettings() {
    console.log("Opening settings...");

    var cfg = await loadSettings();
    if (!cfg || typeof cfg !== "object") {
      showMsgAbove("Info", "No config data loaded.", false);
      return;
    }

    window[my1uzr.worknOnPg].clientConfig = cfg;

    try {
      var rmRecs = (await dbDexieManager.getAllRecords(dbnm, "rm")) || [];
      cfg.rm = rmRecs;
    } catch (e) {
      console.warn("Failed to load rm records:", e);
    }

    payload0.vw = 1;
    payload0.fn = SETTINGS_SAVE_FN;
    payload0.drml = SETTINGS_DRML;
    payload0.appNm = "rm";
    payload0.prt_stng = cfg;

    var ok = await confirmYesNo(
      "Are you sure you want to save these settings?",
    );
    if (!ok) return;

    const rm_allRec = await dbDexieManager.getAllRecords(dbnm, 'rm');
    if(rm_allRec && rm_allRec.length == 0){
      showMessageModal("Error","No Recordes found: " + rm_allRec.length, true);
      return;
    }

    showMsgAbove("Info", "Saving settings...", false);

    try {
      var result = await fnj3(
        SETTINGS_SAVE_URL,
        payload0,
        1,
        true,
        null,
        20000,
        0,
        2,
        1,
      );
      if (result && result.su == 1) {
        if (typeof showsuccessmodal === "function")
          showsuccessmodal(result.ms || "Settings saved successfully!");
        else
          showMsgAbove(
            "Success",
            result.ms || "Settings saved successfully!",
            false,
          );
      } else {
        if (typeof showelsemodal === "function")
          showelsemodal(
            (result && result.ms) || "Failed to save settings.",
          );
        else
          showMsgAbove(
            "Error",
            (result && result.ms) || "Failed to save settings",
            true,
          );
      }
    } catch (error) {
      if (typeof showcatchmodal === "function")
        showcatchmodal(error || "Network Error");
      else showMsgAbove("Info", "Error: " + (error.message || error), false);
    }
  }

  window.showPrintSettings = showPrintSettings;

  console.log("rm_da.js loaded successfully");
})();
