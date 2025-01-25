const d_v_login_modal = document.getElementById('dv_login_modal');
const s_p_login_close_modal = document.getElementById('sp_login_close_modal');
const d_v_register_close_modal = document.getElementById('dv_register_modal');
const s_p_register_close_modal = document.getElementById('sp_register_close_modal');
const i_n_tx_otp = document.getElementById('in_tx_otp');
const i_n_nu_mo_no = document.getElementById('in_nu_mo_no');
const i_n_tx_en_nm = document.getElementById('in_tx_en_nm');
const i_n_tx_lo_nm = document.getElementById('in_tx_lo_nm');
const i_n_pw_psw = document.getElementById('in_pw_psw');
const i_n_pw_cnfrm_psw = document.getElementById('in_pw_cnfrm_psw');
const i_n_mo_2lgi = document.getElementById('in_mo_2lgi');
const i_n_pw_psw2lgi = document.getElementById('in_pw_psw2lgi');

const b_t_sho_reg_modal = document.getElementById('bt_sho_reg_modal');
const b_t_snd_otp = document.getElementById('bt_snd_otp');
const b_t_vrfy_otp = document.getElementById('bt_vrfy_otp');
const b_t_set_psw = document.getElementById('bt_set_psw');
const b_t_lgi = document.getElementById('bt_lgi');

s_p_register_close_modal.addEventListener('click', function () {
  closeAllDivs();
  d_v_register_close_modal.style.display = 'none';
});

b_t_lgi.addEventListener('click', function () {
  var data = { "yc": 91, "yo": i_n_mo_2lgi.value.trim(), "pw": i_n_pw_psw2lgi.value.trim() };
  if (data.yo != null && data.yo.length == 10) {
    if (validateMobileNumber(data.yo)) {
      if (data.pw != null && data.pw.length > 5) {
        var tTxt = postCall_Json("https://my1.in/5z/g.php", data, 0, false);
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

s_p_login_close_modal.addEventListener('click', function () {
  d_v_login_modal.style.display = 'none';
});

b_t_sho_reg_modal.addEventListener('click', function () {
  i_n_nu_mo_no.value = '';
  i_n_tx_en_nm.value = '';
  i_n_tx_lo_nm.value = '';
  i_n_tx_otp.value = '';
  document.getElementById('tc').checked = false;
  i_n_pw_psw.value = '';
  i_n_pw_cnfrm_psw.value = '';
  d_v_register_close_modal.style.display = 'flex';
  b_t_snd_otp.style.display = 'block';
  b_t_vrfy_otp.style.display = 'none';
  i_n_tx_en_nm.style.display = 'none';
  i_n_tx_lo_nm.style.display = 'none';
  b_t_set_psw.style.display = 'none';
  i_n_tx_otp.style.display = 'none';
  i_n_pw_psw.style.display = 'none';
  i_n_pw_cnfrm_psw.style.display = 'none';
});

b_t_snd_otp.addEventListener('click', function () {
  if (i_n_nu_mo_no.value.trim() == "" && (i_n_tx_en_nm.value.trim() == "" || i_n_tx_lo_nm.value.trim() == "")) {
    alert('Mobile no. or Name is not entered');
  } else if (!validateMobileNumber(i_n_nu_mo_no.value.trim())) {
    alert('mobile number is invalid');
  } else {
    if (!(document.getElementById('tc').checked)) {
      alert('accept terms and conditions');
    } else {
      var t87 = { "yo": i_n_nu_mo_no.value.trim(), "yc": 91, "mn": i_n_tx_en_nm.value.trim(), "mu": i_n_tx_lo_nm.value.trim() }
      var tTxt = postCall_Json("https://my1.in/5z/o.php", t87);
      var response = JSON.parse(tTxt);
      if (response.su == 1) {
        i_n_tx_otp.style.display = 'block';
        b_t_snd_otp.style.display = 'none';
        b_t_vrfy_otp.style.display = 'block';
        //function2runAfterOTPsentSuccessfully();
      } else {
        alert(response.ms);
      }
    }
  }
});

b_t_vrfy_otp.addEventListener('click', function () {
  if (i_n_tx_otp.value.trim() == "") {
    alert("Enter otp first");
  } else {
    var t87 = { "yo": i_n_nu_mo_no.value.trim(), "yc": 91, "mn": i_n_tx_en_nm.value.trim(), "mu": i_n_tx_lo_nm.value.trim(), "mp": i_n_tx_otp.value.trim() };
    var tTxt = postCall_Json("https://my1.in/5z/v.php", t87, 0, false);
    var response = JSON.parse(tTxt);
    if (response.su == 1) {
      i_n_pw_psw.style.display = 'block';
      i_n_pw_cnfrm_psw.style.display = 'block';
      b_t_vrfy_otp.style.display = 'none';
      b_t_set_psw.style.display = 'block';
      i_n_tx_en_nm.style.display = 'block';
      i_n_tx_lo_nm.style.display = 'block';
      //function2runAfterOTPverifiedSuccessfully();
    } else {
      alert(response.ms);
    }
  }
});

b_t_set_psw.addEventListener('click', function () {
  if (i_n_pw_psw.value.trim() == "" || i_n_pw_cnfrm_psw.value.trim() == "") {
    alert('Password is not entered');
  } else if (i_n_pw_psw.value != i_n_pw_cnfrm_psw.value) {
    alert('password mismatched');
  } else if (i_n_pw_psw.value.length < 6) {
    alert('password must be at least 6 characters');
  } else if (i_n_tx_en_nm.value.length < 2) {
    alert('Name Should be at least 2 characters');
  } else {
    // var formData = new FormData();
    // formData.append('yo', i_n_nu_mo_no.value.trim());
    // formData.append('yn', i_n_tx_en_nm.value.trim());
    // formData.append('ot', i_n_tx_otp.value.trim());
    // formData.append('pi', i_n_pw_psw.value.trim());
    // var tTxt = callPostWithKeys("https://sifr.in/c/ow.php", t87, 0, false);
    var t87 = { "yo": i_n_nu_mo_no.value.trim(), "yc": 91, "mn": i_n_tx_en_nm.value.trim(), "mu": i_n_tx_lo_nm.value.trim(), "mp": i_n_tx_otp.value.trim(), "pw": i_n_pw_psw.value.trim() };
    var tTxt = postCall_Json("https://my1.in/5z/s.php", t87, 0, false);
    var response = JSON.parse(tTxt);
    if (response.su == 1) {
      document.getElementById('tc').style.display = 'none';
      i_n_pw_psw.style.display = 'none';
      i_n_pw_cnfrm_psw.style.display = 'none';
      b_t_set_psw.style.display = 'none';
      d_v_register_close_modal.style.display = 'none';
      hiddenForm.style.display = 'none';
      //function2runAfterPasswordSettedSuccessfully();
    }
    alert(response.ms);
  }
});

function show_login_modal() { d_v_login_modal.style.display = 'flex'; d_v_register_close_modal.style.display = 'none'; }
