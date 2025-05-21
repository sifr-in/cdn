$('.toggle').on('click', function() {
  $('.container').stop().addClass('active');
});

$('.close').on('click', function() {
  $('.container').stop().removeClass('active');
});

var vap=0,vz=1,vzn="self / owner";
var vyc=91;
var vtk,vyo,vy,vyn;
$('#lgi').click(function(e){
    alert("this login system has been disabled;\n\nplease use new login;");
/*
e.preventDefault();
  if($("#yo").val().length==10){
  if($('#pi').val().length>3 && $('#pi').val().length<9){
  var foda={};
  foda['ap']=vap;
  foda['yc']=vyc;
  foda['yo']=$("#yo").val();
  foda['z']=vz;
  foda['pi']=$('#pi').val();
  $.ajax({
  url: "https://sifr.in/a/c/gt.php",
  type: "POST",
  dataType:'json',
  contentType: "application/json; charset=utf-8",
  traditional: true,
  data:JSON.stringify(foda),
  success:function(reda){
  // alert(JSON.stringify(reda));
  if(reda.suc===true){
  foda['y']=reda.y;
  foda['z']=reda.z;
  foda['tk']=reda.tk;
  var url = new URL("https://sifr.in/a/b.php");
  url.searchParams.set('ap','0');
  url.searchParams.set('y',reda.y);
  url.searchParams.set('z',reda.z);
  url.searchParams.set('yn',reda.yn);
  url.searchParams.set('tk',reda.tk);
  url.searchParams.set('yc',$("#yc option:selected").val());
  url.searchParams.set('yo',$("#yo").val());
  window.location.href = url.href;
  }else{alert('mis match;');}
  },
  error: function(XMLHttpRequest, textStatus, errorThrown) {
  alert('Status: ' + textStatus);
  alert('Error: ' + errorThrown);
  }
  });//end of ajax 
  }else{
  alert("password must be 4 to 8 characters.");
  }
  }else{
  alert("Mobile number must be 10 digits, you have entered "+$("#yo").val().length)+" digits.";
  }*/
});
$('#l2gi').click(function(e){
e.preventDefault();
  if($("#yo").val().length==10){
  if($('#pi').val().length>3 && $('#pi').val().length<9){
  var foda={};
  foda['ap']=vap;
  foda['yc']=vyc;
  foda['yo']=$("#yo").val();
  foda['z']=vz;
  foda['pi']=$('#pi').val();
  $.ajax({
  url: "https://sifr.in/a/c/gt.php",
  type: "POST",
  dataType:'json',
  contentType: "application/json; charset=utf-8",
  traditional: true,
  data:JSON.stringify(foda),
  success:function(reda){
  // alert(JSON.stringify(reda));
  if(reda.suc===true){
  foda['y']=reda.y;
  foda['z']=reda.z;
  foda['tk']=reda.tk;
  var url = new URL("https://sifr.in/c/c.php");
  url.searchParams.set('ap','0');
  url.searchParams.set('y',reda.y);
  url.searchParams.set('z',reda.z);
  url.searchParams.set('yn',reda.yn);
  url.searchParams.set('tk',reda.tk);
  url.searchParams.set('yc',$("#yc option:selected").val());
  url.searchParams.set('yo',$("#yo").val());
  window.location.href = url.href;
  }else{alert('mis match;');}
  },
  error: function(XMLHttpRequest, textStatus, errorThrown) {
  alert('Status: ' + textStatus);
  alert('Error: ' + errorThrown);
  }
  });//end of ajax 
  }else{
  alert("password must be 4 to 8 characters.");
  }
  }else{
  alert("Mobile number must be 10 digits, you have entered "+$("#yo").val().length)+" digits.";
  }
});


$('#dvsndotp').click(function(e){//send otp to mobile;
e.preventDefault();
if($('#trmr').prop('checked')===false){
alert('You must agree to terms and conditions before you register with us.');
}else{
alert("OTP sending is disabled for maintenance;\nOnly pre-registered people will be able to login;");

var vyn= $("#ynr").val();
if(vyn.trim().length<5){
alert('name cannot be less than 5 characters.');
}else{
if($("#yor").val().length==10){
var vyc=91;//logger ccode

var vtx="";//additional text message to append.
//alert('vyc:'+vyc+' vyw'+vyw);
//send by e Tax Solutions.\ntrhough\nwww.etaxsolutions.co.in
$.ajax({
type: "POST",
//url: "https://sifr.in/a/c/ot4web.php", //dataType not json;
url: "https://sifr.in/c/ot.php",
dataType:'json',
data: JSON.stringify({ap:vap,yc:vyc,yo:$("#yor").val()}),
success:function(data){
var obj=data;
var jmsg=obj.ms;
if(obj.su=="1"){
$('#dvsndotp').hide(1234);
$('#dvvrfotp').show(1234);
$('#lyor').hide();
$('#lynr').hide();
$('#dvotp').show(1234);
$('#yor').attr("disabled", true);
$("#ynr").attr("disabled", true);
alert(obj.ms);
}else{
    alert(obj.ms);
}
},
error: function(t){
alert("Problem sending OTP."+t);
}
});//end of ajax
}else{
alert("Number must be 10 digits.");
}
}



}
});//end of $('#dvsndotp').click

$('#dvvrfotp').click(function(e){//check whether otp is correct;
e.preventDefault();
var vyc=91;//logger ccode
var votp=$("#otp").val();
// alert(vap+'--'+vyc+'--'+$("#yor").val()+'--'+votp+'--'+vz);
if(votp.length==6){
$.ajax({
type: "POST",
url: "https://sifr.in/c/ov.php",
dataType:'json',
data: JSON.stringify({ap:vap,yc:vyc,yo:$("#yor").val(),ot:votp,z:vz}),
success:function(data){
var obj=data;
if(obj.su=="1"){
$('#dvvrfotp').hide(1234);
$('#dvsetpin').show(1234);
$('#dvpnr').show(1234);
$('#dvprr').show(1234);
// alert(data);
alert("verified. please set a password / pin to login, hence forth.");
}else{
alert(data.ms);
}
},
error: function(t){
alert("Otp doesn't match."+t);
}
});//end of ajax
}else{
alert("OTP must be exactly 6 characters.");
}
});//end of $('#oin').click


$('#dvsetpin').click(function(){
var vyc=91;//logger ccode
var votp=$("#otp").val();
//alert(ve+'--'+vm+'--'+vw+'--'+vyc+'--'+vyo+'--'+vz+'--'+votp);
if(votp.length==6){
var vyn=$("#ynr").val();
var vpw=$("#pnr").val();
if(vpw==$("#prr").val()){
if(vpw.length>3 && vpw.length<9){
$.ajax({
type: "POST",
// url: "https://sifr.in/a/c/ow.php",
url: "https://sifr.in/c/ow.php",
data: {ap:vap,yc:vyc,yo:$("#yor").val(),ot:votp,yn:vyn,z:vz,pi:vpw},
success:function(data){
var obj=data;
if(obj.suc){
alert(obj.msg);
alert("hence forth login with the password you have set.");
location.reload();
}else{
alert(data.msg);
}
},
error: function(t){
alert(t);
}
});//end of ajax

}else{
alert("password must be 4 to 8 characters.");
}
}else{
alert("password don't match.");
}
}else{
alert("OTP must be exactly 6 characters.");
}
});//end of $('#svp').click