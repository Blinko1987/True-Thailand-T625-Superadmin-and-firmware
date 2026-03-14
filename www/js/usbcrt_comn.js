var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	$("#anonymity_checkbox").bind("click", function(){
		checkDisableElement();
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/usb_device", initPage);
	}
	else
	{
		XHR.get("get_usb_device", null, initPage);
	}

	checkDisableElement();
});

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
	
	$("#DownloadState_text").html("");
	
	var usb_device = getdata.usb.split("\n");
	
	if ( undefined != usb_device[0] && '' != usb_device[0] )
	{
		$("#SaveAsPath_button").html(usb_device[0]);
		$("#SaveAsPath_button").attr('value', usb_device[0]);
		$("#SaveAsPath_suffix").html('/xdown');
	}
	else
	{
		$("#SaveAsPath_button").html("nousbdevice".i18n());
		$("#SaveAsPath_button").attr('value', '0');
		$("#SaveAsPath_suffix").html('');
	}
}

function checkDisableElement()
{
	if ( $("#anonymity_checkbox").attr('checked') )
	{
		$("#user_text").attr("disabled", true);
		$("#pwd_text").attr("disabled", true);
	}
	else
	{
		$("#user_text").removeAttr("disabled");
		$("#pwd_text").removeAttr("disabled");
	}
}

function checkUsbcrtFields()
{
	if (0 == $('#SaveAsPath_text').val())
	{
		alert("nousbdevice".i18n());
		return false;
	}
	
	if (special_char_check($("#ServerUrl_text").val()) == true || special_char_check($("#ServerPort_text").val()) == true 
		|| special_char_check($("#user_text").val()) == true || special_char_check($("#pwd_text").val()) == true 
		|| special_char_check($("#downloadpath_text").val()) == true)
	{
		alert("specialcharcheck".i18n());
		return false;
	}
	
	if (!isValidURL($('#ServerUrl_text').val()) && !isValidIpAddress($('#ServerUrl_text').val()) && !isValidIpAddress6($('#ServerUrl_text').val()))
	{
		alert("serveraddrinvalid".i18n());
		return false;
	}
	
	return true;
}

function startdownload()
{
	var test = checkUsbcrtFields();
	
	if (test)
	{  
		var postdata = usbcrtPrepareJSON();
		//setPageInfo(usbcrtJSON, usbcrtInfoReceived, 'cgi-bin/usbcrt.cgi');
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("setusbcrt", postdata, initPage);
		showOrHideLoadingWindowFromIframe("show");
	}
}

function refreshdownload()
{
	var postdata = new Object();
	postdata.func = 'refresh';
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("setusbcrt", postdata, refreshDownloadReceived);
	showOrHideLoadingWindowFromIframe("show");
	//setPageInfo(null, refreshDownloadReceived, 'cgi-bin/usbdownload.cgi');
}

function cancledownload()
{
	var postdata = new Object();
	postdata.func = 'stop';
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("setusbcrt", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");

	//setPageInfo(usbcrtJSON, usbcrtInfoReceived, 'cgi-bin/usbcrt.cgi');
}

function refreshDownloadReceived(getdata)
{	
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata.usb_download)
	{
		$("#DownloadState_text").html(getdata.usb_download);
	}
	else
	{
		alert("get data failed");
		return;
	}
}

function usbcrtPrepareJSON()
{
	var usbcrtdata = new Object();
  
	usbcrtdata.func = 'start'; 
	usbcrtdata.protocol = $("#protocal").val();
	usbcrtdata.remoteUrl = $("#ServerUrl_text").val();
	usbcrtdata.port = $("#ServerPort_text").val();
	if ( $("#user_text").val() == "" || $('#anonymity_checkbox').attr('checked'))
	{
		usbcrtdata.username = "anonymous";
	}
	else
	{
		usbcrtdata.username = $("#user_text").val();
	}
	usbcrtdata.dwp = $("#pwd_text").val();
	usbcrtdata.path = $("#downloadpath_text").val();
	var index = usbcrtdata.path.lastIndexOf('/');
	usbcrtdata.filename = usbcrtdata.path.substr(index+1);
	
	usbcrtdata.localdev = $("#SaveAsPath_text").val();
  
    return usbcrtdata;
}


