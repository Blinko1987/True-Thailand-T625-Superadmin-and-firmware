var tokenstr = "";
var ntpServerNameArray = new Array("No Configuration", "clock.fmt.he.net", "clock.nyc.he.net", "clock.sjc.he.net", "clock.via.net", "ntp1.tummy.com", "time.cachenetworks.com", "time.nist.gov", "time.windows.com", "other");
var ntpServerValueArray = new Array("NULL", "clock.fmt.he.net", "clock.nyc.he.net", "clock.sjc.he.net", "clock.via.net", "ntp1.tummy.com", "time.cachenetworks.com", "time.nist.gov", "time.windows.com", "other");
var ntpServerNumber = 5;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	initTimeInnerHTML();
	
	$("select").bind("change", function(){
		checkDisableDisplayElement();
	});
	$("input:checkbox").bind("change", function(){
		checkDisableDisplayElement();
	});
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	showOrHideLoadingWindowFromIframe("show");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ntp_info", initPage);
	}
	else
	{
		XHR.get("get_ntp_info", null, initPage);
	}
});

function initValidate()
{
	$("#ntp_form").validate({
		debug: true,
		rules: {
			"Server1Other_text": {required: true},
			"Server2Other_text": {required: true},
			"Server3Other_text": {required: true},
			"Server4Other_text": {required: true},
			"Server5Other_text": {required: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate ntp ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate ntp failed.....");
			return false;
		}
	}); 
}

function initTimeInnerHTML()
{
	var i;
	$("[name=server]").each(function (index){
		if ( index == 0 )//第一时间服务器不能选择“不配置”
		{
			i = 1;
		}
		else
		{
			i = 0;
		}
		var dynamicHTML = '';
		for ( i; i<ntpServerNameArray.length; i++ )
		{
			dynamicHTML += "<option value='" + ntpServerValueArray[i] + "'>" + ntpServerNameArray[i] + "</option>";
		}
		
		$("#" + this.id).html(dynamicHTML);
		// ptweblog(this.id);
	});
}

function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.ntp)
	{
		$("#SystemTime_label").html(getdata.ntp.date.replace("UTC",""));
		if (getdata.ntp.Enable == '1')
		{
			$("#NtpEnable_checkbox").prop("checked", true);
		}
		else
		{
			$("#NtpEnable_checkbox").prop("checked", false);
		}
		
		$("#TimeZone_select").val(getdata.ntp.LocalTimeZone);
		$("#NtpType_select").val(getdata.ntp.NTPServerType);
		$("#NtpInterval_text").val(getdata.ntp.NTPInterval);
		
		var i;
		for (i=1; i<=ntpServerNumber; i++)
		{
			var server = eval("getdata.ntp.NTPServer" + i);
			var isOther = 1;
			if ( server == '' )
			{
				$("#SntpServer" + i + "_select").val(ntpServerValueArray[0]); //不配置
				isOther = 0;
			}
			else
			{
				for ( var j=1; j<ntpServerValueArray.length; j++)
				{
					if ( ntpServerValueArray[j] == server )
					{
						$("#SntpServer" + i + "_select").val(ntpServerValueArray[j]);
						isOther = 0;
					}
				}
			}
			
			if ( isOther == 1 )
			{
				$("#SntpServer" + i + "_select").val(ntpServerValueArray[ntpServerValueArray.length - 1]);
				$("#Server" + i + "Other_text").val(server);
			}
		}
	}
	checkDisableDisplayElement();
}

function extraValidCheck()
{
	var error_num = 0;
	if ( $("#NtpInterval_text").val() != '0' && !isValidNumberRange($("#NtpInterval_text").val(), 3600, 604800) )
	{
		error_num ++;
		$("#NtpInterval_error").html("ntpintervalinvalid".i18n());
	}
	
	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}

function saveApply()
{
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if( ! $("#ntp_form").valid() || ! extraValidCheck())
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	if ( special_char_check($("#Server1Other_text").val()) == true || special_char_check($("#Server2Other_text").val()) == true 
		|| special_char_check($("#Server3Other_text").val()) == true || special_char_check($("#Server4Other_text").val()) == true 
		|| special_char_check($("#Server5Other_text").val()) == true )
	{
		alert("specialcharcheck".i18n());
		return false;
	}
	
	var postdata = new Object();
	postdata.Enable = $("#NtpEnable_checkbox").attr("checked") ? "1" : "0";
	
	postdata.LocalTimeZone = $("#TimeZone_select").val();
	postdata.NTPServerType = $("#NtpType_select").val();
	postdata.NTPInterval = $("#NtpInterval_text").val();
	var i;
	for (i=1; i<=ntpServerNumber; i++)
	{
		if ($("#SntpServer" + i + "_select").val() == ntpServerValueArray[ntpServerValueArray.length - 1] )
		{
			postdata["NTPServer" + i] = $("#Server" + i + "Other_text").val();
		}
		else
		{
			postdata["NTPServer" + i] = $("#SntpServer" + i + "_select").val();
		}
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_ntp_info", postdata, reloadSaveData);
	showOrHideLoadingWindowFromIframe("show");
}

function reloadSaveData(data)
{
	if(data)
	{
		initPage(data);
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}

function checkDisableDisplayElement()
{
	if ( $("#NtpEnable_checkbox").attr("checked") )
	{
		$("#setting_div").show();
	}
	else
	{
		$("#setting_div").hide();
	}
	
	var i;
	for (i=1; i<=ntpServerNumber; i++)
	{
		if ( $("#SntpServer" + i + "_select").val() == ntpServerValueArray[ntpServerValueArray.length - 1] )
		{
			$("#Server" + i + "Other_text").attr("disabled", false);
		}
		else
		{
			$("#Server" + i + "Other_text").attr("disabled", true);
		}
	}
}
