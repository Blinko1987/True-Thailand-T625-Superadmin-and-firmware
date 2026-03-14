$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
});


function webreboot()
{
	cleanPopWindowContentFromIframe();
	var parentObj = window.parent.document;
	//填充内容
	$("#pop_window_title", parentObj).html("reboot_confirm".i18n());
	$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_help"></div>');
	$("#pop_window_message", parentObj).html("rebootdevconfirm".i18n());
	
	//更改确认操作函数
	var eid = parentObj.getElementById("confirm");
	eid.onclick = function(){
		$("#pop_window_title", parentObj).html("rebootdevicereminder".i18n());
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("isreboot_hint".i18n());
		$("#pop_window_option", parentObj).hide();
		var postdata = new Object();
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		jumpToLoginPage(true);
		XHR.post("reboot", postdata, null);
	};
	showOrHidePopWindowFromIframe("show");
}

function reloadDataReboot(responseData)
{
	if(responseData.success != "true")
	{
		alert("rebootdevicefail".i18n());
	}
	else
	{
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		//填充内容
		$("#pop_window_title", parentObj).html("rebootdevicereminder".i18n());
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("isreboot_hint".i18n());
		$("#pop_window_option", parentObj).hide();
		showOrHidePopWindowFromIframe("show");
		
		//XHR.post("reboot", null, null);
		jumpToLoginPage(true);
	}
}
