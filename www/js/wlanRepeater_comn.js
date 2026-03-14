var tokenstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");

	showOrHideLoadingWindowFromIframe("show");
	customSwitchInit();
	customPasswordInit();
	//validate and submit
	XHR.get("get_repeater_status", null, parseResponsedata);
});

function parseResponsedata(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	if ( data )
	{
		tokenstr = data.token;
		
		if (data.status && data.status != undefined)
		{
			if(data.status.indexOf("connected") != -1)
			{
				$("#repeaterstatus").text("connected".i18n());
			}
			else
			{
				$("#repeaterstatus").text("connecting".i18n());
			}
		}
	}
}


function statusRefresh()
{
	window.location.href = "./wlanRepeater_comn.html";
}

function saveApply()
{
	var ssid = $("#WlanSsid_text").val();
	var key = $("#WlanPassword_password").val();
	if (ssid.length == 0)
	{
		alert("ssidcannotempty".i18n());
		return false;
	}

	var data = new Object();
	
	data.SSID = $("#WlanSsid_text").val();
	
	if (key.length == 0)
	{
		data.PreSharedKey = "open";
	}
	else
	{
		data.PreSharedKey = $("#WlanPassword_password").val();
	}
	
	showOrHideLoadingWindowFromIframe("show");
	XHR.get("get_operator", null, function(data){
	if ( data )
		{
			tokenstr = data.token;
		}
	});
	data.token = tokenstr;
	XHR.post("set_repeater_cfg", data, reloadData);
}

function reloadData(responseData)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	if(responseData.success == "true")
	{
		alert("setsuccessfully".i18n());
	}
	else
	{
		alert("setfailed".i18n());
	}
}

