// reviews.js - HT Royal Stay reviews & ratings

var reviewBooking = null;
var reviewRating = 0;
var reviewModalId = null;

function renderStars(r) {
  var s = "";
  for (var i = 1; i <= 5; i++) {
    s += '<i class="fas fa-star ht-star' + (i <= r ? " filled" : "") + '"></i>';
  }
  return s;
}

function getInitial(name) {
  return (name || "G").trim().charAt(0).toUpperCase();
}

window.showReviews = function () {
  setView("reviews");
  var container = document.getElementById("htContainer");
  if (!container) return;

  var reviews = [];
  for (var i = 0; i < bookingRecords.length; i++) {
    var bk = bookingRecords[i];
    var rv = getBookingReview(bk);
    if (rv && parseInt(rv.r) > 0) {
      reviews.push({ bk: bk, r: parseInt(rv.r), v: rv.v || "" });
    }
  }
  reviews.sort(function (a, b) {
    return a.bk.f < b.bk.f ? 1 : a.bk.f > b.bk.f ? -1 : 0;
  });

  var sum = 0;
  var dist = [0, 0, 0, 0, 0];
  for (var j = 0; j < reviews.length; j++) {
    sum += reviews[j].r;
    if (reviews[j].r >= 1 && reviews[j].r <= 5) dist[reviews[j].r - 1]++;
  }
  var avg = reviews.length ? (sum / reviews.length).toFixed(1) : "0";

  var distHtml = "";
  for (var s = 5; s >= 1; s--) {
    var pct = reviews.length
      ? Math.round((dist[s - 1] / reviews.length) * 100)
      : 0;
    distHtml +=
      '<div class="d-flex align-items-center gap-2 mb-1">' +
      '<span class="text-sm fw-semibold text-gray-dark" style="width:34px;">' +
      s +
      " \u2605</span>" +
      '<div style="flex:1;height:8px;background:#E8E8E8;border-radius:99px;overflow:hidden;">' +
      '<div style="width:' +
      pct +
      '%;height:100%;background:var(--gold);border-radius:99px;"></div></div>' +
      '<span class="text-sm text-gray" style="width:26px;">' +
      dist[s - 1] +
      "</span></div>";
  }

  var listHtml = "";
  if (reviews.length === 0) {
    listHtml =
      '<div class="col-12">' +
      '<div class="ht-empty">' +
      '<i class="fas fa-star"></i>' +
      "<b>No reviews yet</b>" +
      "<p>Guest reviews will appear here once a checked-out stay is rated.</p>" +
      '<button class="btn-premium btn-premium-secondary btn-premium-sm mt-2" onclick="showDashboard()">' +
      '<i class="fas fa-home me-1"></i> Back to Home</button>' +
      "</div></div>";
  } else {
    for (var k = 0; k < reviews.length; k++) {
      var rev = reviews[k];
      var bk = rev.bk;
      var roomName =
        bk.s ||
        (getRoomById(bk.j) ? htRoomName(getRoomById(bk.j)) : "Hotel Stay");
      listHtml +=
        '<div class="col-12 col-md-6 col-lg-4">' +
        '<div class="ht-review-card animate-fade-in-up" style="animation-delay:' +
        k * 50 +
        'ms;">' +
        '<div class="d-flex align-items-center gap-2 mb-1">' +
        '<div class="rv-avatar">' +
        getInitial(bk.g) +
        "</div>" +
        '<div class="flex-grow-1">' +
        '<div class="rv-name">' +
        escHtml(bk.g || "Guest") +
        "</div>" +
        '<div class="rv-room">' +
        escHtml(roomName) +
        " \u00b7 " +
        escHtml(formatDate(bk.f)) +
        "</div></div>" +
        "<div>" +
        renderStars(rev.r) +
        "</div></div>" +
        '<div class="rv-text">' +
        escHtml(rev.v) +
        "</div>" +
        '<div class="mt-2 d-flex justify-content-end">' +
        '<button class="btn-premium btn-premium-secondary btn-premium-sm" onclick=\'deleteReviewRecord(' +
        JSON.stringify(bk).replace(/'/g, "&#39;") +
        ")'>" +
        '<i class="fas fa-times me-1"></i> Delete</button>' +
        "</div>" +
        "</div></div>";
    }
  }

  container.innerHTML =
    '<div class="ht-section-title">' +
    '<div class="bar"></div>' +
    "<h5>Guest Reviews</h5>" +
    '<span class="sub">Guest feedback &amp; moderation</span>' +
    "</div>" +
    '<div class="row g-3 px-3 px-md-4 pb-4">' +
    '<div class="col-12 col-md-4">' +
    '<div class="ht-rating-box animate-fade-in-up">' +
    '<div class="avg">' +
    avg +
    "</div>" +
    '<div class="lbl">Average Rating</div>' +
    '<div class="mt-2">' +
    renderStars(Math.round(parseFloat(avg))) +
    "</div>" +
    '<div class="lbl mt-2">' +
    reviews.length +
    " review" +
    (reviews.length === 1 ? "" : "s") +
    "</div></div>" +
    '<div class="card-premium p-3 mt-3">' +
    '<div class="fw-bold text-emr-dark mb-2" style="font-size:13px;">Rating Breakdown</div>' +
    distHtml +
    "</div>" +
    "</div>" +
    '<div class="col-12 col-md-8">' +
    '<div class="row g-3">' +
    listHtml +
    "</div></div></div>";
};

window.openReviewModal = function (bk) {
  reviewBooking = bk;
  reviewRating = 0;
  var mid = "reviewModal_" + Date.now();
  reviewModalId = mid;
  var roomName =
    bk.s || (getRoomById(bk.j) ? htRoomName(getRoomById(bk.j)) : "Hotel Stay");

  var html =
    '<div class="modal fade modal-premium" id="' +
    mid +
    '" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered">' +
    '<div class="modal-content animate-scale-in shadow-xl" style="border:3px solid var(--emr);border-radius:12px;overflow:hidden;">' +
    '<div class="modal-header bg-emr-gradient text-gold" style="padding:14px 18px;border-bottom:3px solid var(--gold);">' +
    '<h6 class="modal-title fw-bold" style="font-size:15px;"><i class="fas fa-star me-2 text-gold"></i>Record Guest Rating</h6>' +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
    '<div class="modal-body p-3">' +
    '<div class="card-premium p-3 mb-3" style="background:var(--gold-bg);border:1px solid var(--gold);">' +
    '<div class="text-sm text-gray-dark">' +
    escHtml(bk.g || "Guest") +
    " \u00b7 " +
    escHtml(roomName) +
    '</div><div class="text-xs text-gray">Stay: ' +
    escHtml(formatDate(bk.e)) +
    " \u2192 " +
    escHtml(formatDate(bk.f)) +
    "</div></div>" +
    '<div class="fw-bold text-emr-dark mb-1" style="font-size:13px;">Your Rating <span class="required">*</span></div>' +
    '<div id="' +
    mid +
    '_stars" style="font-size:26px;cursor:pointer;" class="mb-3">' +
    '<i class="fas fa-star ht-star" onclick="setReviewRating(1)"></i>' +
    '<i class="fas fa-star ht-star" onclick="setReviewRating(2)"></i>' +
    '<i class="fas fa-star ht-star" onclick="setReviewRating(3)"></i>' +
    '<i class="fas fa-star ht-star" onclick="setReviewRating(4)"></i>' +
    '<i class="fas fa-star ht-star" onclick="setReviewRating(5)"></i>' +
    "</div>" +
    '<div class="fw-bold text-emr-dark mb-1" style="font-size:13px;">Your Review <span class="required">*</span></div>' +
    '<textarea id="' +
    mid +
    '_text" rows="4" class="form-control-premium" placeholder="Share your experience..." maxlength="500"></textarea>' +
    '<div class="text-xs text-gray mt-1" style="text-align:right;"><span id="' +
    mid +
    '_count">0</span>/500</div>' +
    "</div>" +
    '<div class="modal-footer" style="padding:12px 18px;border-top:2px solid var(--gray-bg);">' +
    '<button type="button" class="btn-premium btn-premium-secondary btn-premium-sm" data-bs-dismiss="modal">Cancel</button>' +
    '<button type="button" id="' +
    mid +
    '_submit" class="btn-premium btn-premium-primary btn-premium-sm" onclick="submitReview()">' +
    '<i class="fas fa-paper-plane me-1"></i> Submit Review</button>' +
    "</div></div></div></div>";

  document.body.insertAdjacentHTML("beforeend", html);
  var modalEl = document.getElementById(mid);
  var m = new bootstrap.Modal(modalEl, { backdrop: "static" });
  m.show();

  var textEl = document.getElementById(mid + "_text");
  if (textEl) {
    textEl.addEventListener("input", function () {
      var c = document.getElementById(mid + "_count");
      if (c) c.textContent = textEl.value.length;
    });
  }

  modalEl.addEventListener("hidden.bs.modal", function () {
    this.remove();
    reviewBooking = null;
    reviewRating = 0;
    reviewModalId = null;
  });
};

window.setReviewRating = function (r) {
  reviewRating = r;
  var box = document.getElementById(reviewModalId + "_stars");
  if (box) box.innerHTML = renderStars(r);
};

window.submitReview = function () {
  if (!reviewBooking || !reviewModalId) return;
  if (reviewRating < 1) {
    showMessageModal("Info", "Please select a star rating!", false);
    return;
  }
  var textEl = document.getElementById(reviewModalId + "_text");
  var text = (textEl ? textEl.value : "").trim();
  if (!text) {
    showMessageModal("Info", "Please write a short review!", false);
    return;
  }
  var btn = document.getElementById(reviewModalId + "_submit");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Submitting...';
  }
  updateReview(reviewBooking, { r: reviewRating, v: text }, btn);
};

async function updateReview(record, review, btn) {
  try {
    if (typeof fnj3 !== "function") {
      showMessageModal("Info", "Server communication not available", false);
      return;
    }

    var upd = {};
    for (var key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key))
        upd[key] = record[key];
    }
    upd.u = JSON.stringify(review);

    payload0.x1 = record.a;
    payload0.p = upd;
    payload0.vw = 1;
    payload0.fn = 98;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
      { tb: "rb" },
      { tb: "rm" },
      { tb: "c" },
    ]);

    var resp = await fnj3(
      "https://my1.in/2/ht.php",
      payload0,
      1,
      true,
      null,
      20000,
      0,
      1,
      1,
    );
    if (resp && resp.su == 1) {
      await handl_rm_rspons(resp);
      var modalEl = document.getElementById(reviewModalId);
      if (modalEl) {
        var inst = bootstrap.Modal.getInstance(modalEl);
        if (inst) inst.hide();
      }
      await adminLoadDataFromDB();
      showDashboard();
      showMessageModal("Success", "✅ Thank you for your review!", false);
    } else {
      showMessageModal("Error", resp?.ms || "Failed to submit review", true);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane me-1"></i> Submit Review';
      }
    }
  } catch (err) {
    showMessageModal("Info", "Error: " + err.message, false);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane me-1"></i> Submit Review';
    }
  }
}

window.deleteReviewRecord = async function (record) {
  if (!record) return;
  if (!window.confirm("Delete this review? This cannot be undone.")) return;
  try {
    if (typeof fnj3 !== "function") {
      showMessageModal("Info", "Server communication not available", false);
      return;
    }

    var upd = {};
    for (var key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key))
        upd[key] = record[key];
    }
    upd.u = null;

    payload0.x1 = record.a;
    payload0.p = upd;
    payload0.vw = 1;
    payload0.fn = 98;
    payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [
      { tb: "rb" },
      { tb: "rm" },
      { tb: "c" },
    ]);

    var resp = await fnj3(
      "https://my1.in/2/ht.php",
      payload0,
      1,
      true,
      null,
      20000,
      0,
      1,
      1,
    );
    if (resp && resp.su == 1) {
      await handl_rm_rspons(resp);
      await adminLoadDataFromDB();
      if (typeof showReviews === "function") showReviews();
      showMessageModal("Success", "✅ Review deleted!", false);
    } else {
      showMessageModal("Error", resp?.ms || "Failed to delete review", true);
    }
  } catch (err) {
    showMessageModal("Info", "Error: " + err.message, false);
  }
};

console.log("⭐ reviews.js loaded");
