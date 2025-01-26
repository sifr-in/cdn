
const d_v_login_modal = document.getElementById('dv_login_modal');
const s_p_login_close_modal = document.getElementById('sp_login_close_modal');
const i_n_mo_2lgi = document.getElementById('in_mo_2lgi');
const l_b_tx_otp2lgi = document.getElementById('lb_tx_otp2lgi');
l_b_tx_otp2lgi.style.display = 'none';
const i_n_tx_otp2lgi = document.getElementById('in_tx_otp2lgi');
i_n_tx_otp2lgi.style.display = 'none';
const b_t_lgi = document.getElementById('bt_lgi');
b_t_lgi.style.display = 'none';


const b_t_get_otp = document.getElementById('bt_get_otp');
b_t_get_otp.addEventListener('click', function () {
  if (i_n_mo_2lgi.value.trim() == "") {
    alert('Mobile no. or Name is not entered');
  } else if (!validateMobileNumber(i_n_mo_2lgi.value.trim())) {
    alert('mobile number is invalid');
  } else {

    var t87 = { "yo": i_n_mo_2lgi.value.trim(), "yc": 91 }
    var tTxt = postCall_Json("https://my1.in/5z/o.php", t87, 0, false);
    var response = JSON.parse(tTxt);
    if (response.su == 1) {
      i_n_mo_2lgi.readOnly = true;
      l_b_tx_otp2lgi.style.display = 'block';
      i_n_tx_otp2lgi.style.display = 'block';
      b_t_lgi.style.display = 'block';
      b_t_get_otp.style.display = 'none';
      //function2runAfterOTPsentSuccessfully();
    } else {
      alert(response.ms);
    }
  }

});

b_t_lgi.addEventListener('click', function () {
  var data = { "yc": 91, "yo": i_n_mo_2lgi.value.trim(), "mp": i_n_tx_otp2lgi.value.trim() };
  if (data.yo != null && data.yo.length == 10) {
    if (validateMobileNumber(data.yo)) {
      if (data.mp != null && data.mp.length > 5) {
        var tTxt = postCall_Json("https://my1.in/5z/k.php", data, 0, false);
        var response = JSON.parse(tTxt);
        if (response.su == 1) {
          if (response.uzr.mk.length > 10) {
            localStorage.setItem('my1uzr', JSON.stringify(response.uzr));
            payload0.mk = response.uzr.mk;
            d_v_login_modal.style.display = 'none';
            function2runAfterLogin();
            location.reload();
          } else
            alert(response.ms);
        } else
          alert(response.ms);
      } else {
        alert("password must be minimum 6 characters;");
      }
    } else {
      alert("mobile no. is invalid;");
    }
  } else {
    alert("mobile no. must be 10 digits;");
  }
});

function show_login_modal() { d_v_login_modal.style.display = 'flex'; }
