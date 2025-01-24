
var hide_d_v_disp_container = 0;
const l_b_logger_nm = document.getElementById('lb_logger_nm');
const d_v_for_login_contents = document.getElementById('dv_for_login_contents');
const d_v_sho_login_modal = document.getElementById('dv_sho_login_modal');
d_v_sho_login_modal.addEventListener('click', function () {
  if (d_v_for_login_contents.innerHTML.length == 0) {
    // Fetch and load the external page
    fetch('https://cdn.jsdelivr.net/gh/sifr-in/cdn/ess/l')
      .then(response => response.text())
      .then(html => {
        // Insert the fetched HTML into the div
        d_v_for_login_contents.innerHTML = html;
        loadScript('https://cdn.jsdelivr.net/gh/sifr-in/cdn/ess/l.js', function () {
          show_login_modal();
        });
      })
      .catch(error => console.error('Error loading the page:', error));
  } else {
    show_login_modal();
  }
});
function showLogInDv() {
  d_v_do_logot.style.display = 'none';
  d_v_sho_login_modal.style.display = 'block';
  hide_d_v_disp_container = 0;
  const d_v_disp_container = document.getElementById('dv_disp_container');
  if (d_v_disp_container != null)
    d_v_disp_container.style.display = 'block';
}
function showLogOutDv() {
  d_v_do_logot.style.display = 'block';
  d_v_sho_login_modal.style.display = 'none';
  hide_d_v_disp_container = 1;
  const d_v_disp_container = document.getElementById('dv_disp_container');
  if (d_v_disp_container != null)
    d_v_disp_container.style.display = 'none';
}
const d_v_do_logot = document.getElementById('dv_do_logot');
d_v_do_logot.addEventListener('click', function () {
  my1uzr = null;
  localStorage.setItem('my1uzr', null);
  location.reload();
});
var str_my1uzr = localStorage.getItem('my1uzr');
if (str_my1uzr != null && str_my1uzr.length > 5) {
  my1uzr = JSON.parse(str_my1uzr);
  // doel_uzrDP.style.display='block';
  if (my1uzr != null) {
    if (my1uzr.mk != null) {
      payload0.mk = my1uzr.mk;
      l_b_logger_nm.innerHTML = my1uzr.mn + "<br>" + my1uzr.mu;
      showLogOutDv();
      checkExpiry();
    } else {
      showLogInDv();
    }
  } else {
    showLogInDv();
  }
} else {
  my1uzr = {};
  showLogInDv();
  // doel_uzrDP.style.display='none';
}

if (my1uzr.mk != null) {
  d_v_sho_login_modal.style.display = 'none';
  d_v_do_logot.style.display = 'block';
} else {
  d_v_sho_login_modal.style.display = 'block';
  d_v_do_logot.style.display = 'none';
}

function checkExpiry() {
  var longNumber = parseInt(my1uzr.mk.slice(-10), 10) * 1000;
  longNumber = longNumber + 302400 * 1000;//302400 seconds = 5 days
  var date = new Date(longNumber);
  const now = new Date();
  var temp = now.getTime();
  //   if (longNumber < now.getTime()) {
  //     console.log("The long number represents a date in the past.");
  //     showLogInDv();
  //   } else if (longNumber > now.getTime()) {
  //     console.log("The long number represents a date in the future.");
  //   } else {
  //     console.log("The long number represents the current time.");
  //   }
}