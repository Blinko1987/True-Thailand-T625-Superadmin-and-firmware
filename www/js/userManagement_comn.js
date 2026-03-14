var tokenstr = "";
var gPwdStrength = 0;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	customPasswordInit();
	initValidate();
	$("#PwdNew_password").bind("keyup", function(){
		gPwdStrength = checkPasswordStrength($(this).val(), "password_tips");
	});
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
	}
	else
	{
		XHR.get("get_login_user", null, parseLoginUser);
	}
});

function parseLoginUser(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	if ( data && data.login_user != undefined && data.login_user == 0 ) //common user
	{
		$("#username option[value='admin']").remove();
		$(".main_header_hint").html("modifypwd_hint2".i18n());
	}
	else
	{
		$(".account").show();
	}
}

function saveApply()
{
	if (special_char_check($("#PwdNew_password").val()) == true)
	{
		alert("specialcharcheck".i18n());
		return false;
	}
	
	if ($("#username").val() == "admin")
	{
		if (($("#PwdNew_password").val()).length < 15)
		{
			alert("mustmixedcharnumpecialchar".i18n());
			return;
		}
		
		if (($("#PwdNew_password").val()).length > 85)
		{
			alert("pwdlengthmax".i18n());
			return;
		}
		
		var sValue = $("#PwdNew_password").val();
		
		//需要同时包含大小写字符，数字，特殊字符；
		if (!((/\d/.test(sValue)) && (/[a-z]/.test(sValue)) && (/[A-Z]/.test(sValue)) && (/\W/.test(sValue)))) 
		{
			alert("mustmixedcharnumpecialchar".i18n());
			return;
		}
	}
	
	if( ! $("#userManagementForm").valid())
	{
		alert("invalidrewrite".i18n());
		return;
	}else{
		var data = buildData();
		
		if(gDebug)
		{
			if(confirm("newpwdcheck".i18n()) == false)
			{
				return false;
			}
			postDataByAjax("../fake/post", JSON.stringify(data));
		}
		else
		{
			if(gPwdStrength <= 1)
			{
				if(confirm("newpwdcheck".i18n()) == false)
				{
					$("#PwdNew_password").focus();
					return false;
				}
				showOrHideLoadingWindowFromIframe("show");
				XHR.get("get_operator", null, function(data){
					if ( data )
					{
						tokenstr = data.token;
					}
				});
				data.token = tokenstr;
				XHR.post("userManagement", data, checkResult);
			}
			else
			{
				showOrHideLoadingWindowFromIframe("show");
				XHR.get("get_operator", null, function(data){
					if ( data )
					{
						tokenstr = data.token;
					}
				});
				data.token = tokenstr;
				XHR.post("userManagement", data, checkResult);
			}
			
		}
	}
}

function checkResult(responseData)
{
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	if(responseData.success == "true")
	{
		alert("modifypwdsucc".i18n());
		realLogout();
	}
	else
	{
		if(responseData.errorCode == "-4")
		{
			alert("oldpwderrreinput".i18n());
		}
		else
		{
			alert("modifypwdfail".i18n());
		}
	}
	$("input[type='password']").val("");
	$("#PwdCfm_password").focus();
}

function realLogout()
{
	var postdata = new Object();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("do_logout", postdata, function(data){
		top.location.href = ('https:' == document.location.protocol ? 'https://' : 'http://') + document.location.host;
	});
}
function initValidate()
{
	$("#userManagementForm").validate({
		debug: false,
		rules: {
			"password": {required: true, maxlength:85},
			"newPassword": {required: true, maxlength:85},
			"confirmPassword": {required: true, maxlength:85, equalTo: "#PwdNew_password"}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
			"password": { required: "pleaseinputoripwd".i18n()},
			"newPassword":{required: "pleaseinputnewpwd".i18n()},
			"confirmPassword":{required: "pleaseinputconfirmpwd".i18n(), equalTo: "confirmpwdisnotequaltonewpwd".i18n()}
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate user management settings ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate user management failed.....");
			return false;
		}
	}); 
}

function buildData()
{
	var data = new Object();
	data.username = $("#username").val();
	data.password = $("#PwdCfm_password").val();
	data.newPassword = $("#PwdNew_password").val();
	
	return data;
}