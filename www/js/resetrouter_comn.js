var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	
	/* showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/usb_device", initPage);
	}
	else
	{
		XHR.get("get_usb_device", null, initPage);
	} */
});



/* function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	setCheckbox("restore_checkbox", getdata.restore);
	
	var usb_device = getdata.usb.split("\n");
	
	var dynamicHTML = '';
	for ( var i=0; i<usb_device.length; i++ )
	{
		if ( undefined != usb_device[i] && '' != usb_device[i] )
		{
			dynamicHTML += '<option value="' + usb_device[i] + '">' + usb_device[i] + '</option>';
		}
	}
	
	$("#usb_device").html(dynamicHTML);
}


function saveApply()
{
	var select_usb = $("#usb_device").val();
	if( undefined == select_usb || '' == select_usb )
	{
		alert("pleaseconnusbdevice".i18n());
		return;
	}
	
	if (getCheckbox("restore_checkbox") == 1)
	{
		if (confirm("fastrecovery_hint".i18n()) == false)
		{
			return;
		}
	}
	
	var postdata = new Object();
	postdata.restore = getCheckbox("restore_checkbox");
	postdata.usb = select_usb;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("usb_backup", postdata, function(returndata){
		showOrHideLoadingWindowFromIframe("hide");
		if ( returndata.ret == 0 )
		{
			alert("backupsucc".i18n());
		}
		else
		{
			alert("backupfail".i18n());
		}
	});
	showOrHideLoadingWindowFromIframe("show");
} */

function restore_factory()
{
	cleanPopWindowContentFromIframe();
	var parentObj = window.parent.document;
	//填充内容
	$("#pop_window_title", parentObj).html("restorefacconfirm".i18n());
	$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_help"></div>');
	$("#pop_window_message", parentObj).html("restorefacconfirm_hint".i18n());
	
	//更改确认操作函数
	var eid = parentObj.getElementById("confirm");
	eid.onclick = function(){
		$("#pop_window_title", parentObj).html("restorefactoryreminder".i18n());
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("isrestorefactory_hint".i18n());
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
		XHR.post("restore_long", postdata, null);
	};
	
	showOrHidePopWindowFromIframe("show");
}

function reloadData(responseData)
{
	if ( responseData.success != "true")
	{
		alert("restorefactoryfail".i18n());
	}
	else
	{
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		//填充内容
		$("#pop_window_title", parentObj).html("restorefactoryreminder".i18n());
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("isrestorefactory_hint".i18n());
		$("#pop_window_option", parentObj).hide();
		showOrHidePopWindowFromIframe("show");
		
		//XHR.post("reboot", null, null);
		jumpToLoginPage(true);
	}
}


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




