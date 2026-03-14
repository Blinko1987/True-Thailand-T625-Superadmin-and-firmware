var tokenstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/oltauth", initPage);
	}
	else
	{
		XHR.get("get_phy_pwd", null, initPage);
	}
});

function initValidate()
{
	$("#loid_form").validate({
		debug: true,
		rules: {
			"Pwd_password": {required: true, maxlength:10}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate loid ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate loid failed.....");
			return false;
		}
	}); 
}


function initPage(getdata)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata)
	{
		$("#Pwd_password").val(getdata.GPONPassWord);
	}
}

function saveApply()
{
	if( ! $("#loid_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	if ( special_char_check($("#Pwd_password").val()) == true )
	{
		alert("specialcharcheck".i18n());
		return false;
	}
	
	var postdata = new Object();
	
/*	if ($("#Pwd_password").val().length > 10)
	{
		alert("pwdlencheck".i18n());
		$("#Pwd_password").val("");
		return;
	}*/
	
	/* 把输入得密码转为对应ascii码值的16进制 */
	var pwdascii=new Array();
	for (var i = 0; i < $("#Pwd_password").val().length; i++ )
	{
		pwdascii.push($("#Pwd_password").val().charCodeAt(i).toString(16));
	}
	
	postdata.GPONPassWordAsciiHex = pwdascii.join("");
	postdata.GPONPassWord = $("#Pwd_password").val();
	
	XHR.get("get_operator", null, function(data){
		if ( data )
		{
			tokenstr = data.token;
		}
	});
	postdata.token = tokenstr;
	
	XHR.post("set_phy_pwd", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

