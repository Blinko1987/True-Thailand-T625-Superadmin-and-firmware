
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/smart_platform_status", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_smart_platform_status", null, parseGetData);
	}
});

function parseGetData(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	$("#DistErrorMsgContent").hide();
	$("#OperErrorMsgContent").hide();
	$("#PluginErrorMsgContent").hide();
	
	$("#MgtURL").html(data.MgtURL);
	if (data.DistStatus == 1)
	{
		$("#DistStatus").html("disconnect".i18n());
	}
	else if (data.DistStatus == 2)
	{
		$("#DistStatus").html("tryingtoconn".i18n());
    }
	else if (data.DistStatus == 3)
	{
		$("#DistStatus").html("distplatconnecting".i18n());
    }
	else if (data.DistStatus == 4)
	{
		$("#DistStatus").html("distplatconnend".i18n());
    }
	else if (data.DistStatus == 5)
	{
		$("#DistStatus").html("tryconndistplatfail".i18n());
		$("#DistErrorMsgContent").show();
		$("#DistErrorMsg").html(data.DistErrorMsg);
    }
	
	$("#OperAddr").html(data.OperAddr);
	if (data.OperStatus == 1)
	{
		$("#OperStatus").html("disconnect".i18n());
	}
	else if (data.OperStatus == 2)
	{
		$("#OperStatus").html("tryingtoconn".i18n());
    }
	else if (data.OperStatus == 3)
	{
		$("#OperStatus").html("operplatreging".i18n());
    }
	else if (data.OperStatus == 4)
	{
		$("#OperStatus").html("operplatheartbeating".i18n());
    }
	else if (data.OperStatus == 5)
	{
		$("#OperStatus").html("operplatwaitnextbeating".i18n());
    }
	else if (data.OperStatus == 6)
	{
		$("#OperStatus").html("tryconnoperplatfail".i18n());
		$("#OperErrorMsgContent").show();
		$("#OperErrorMsg").html(data.OperErrorMsg);
    }
	
	$("#PluginAddr").html(data.PluginAddr);
	if (data.PluginStatus == 1)
	{
		$("#PluginStatus").html("disconnect".i18n());
	}
	else if (data.PluginStatus == 2)
	{
		$("#PluginStatus").html("tryingtoconn".i18n());
    }
	else if (data.PluginStatus == 3)
	{
		$("#PluginStatus").html("pluginplatreging".i18n());
    }
	else if (data.PluginStatus == 4)
	{
		$("#PluginStatus").html("pluginplatheartbeating".i18n());
    }
	else if (data.PluginStatus == 5)
	{
		$("#PluginStatus").html("pluginplatwaitnextbeating".i18n());
    }
	else if (data.PluginStatus == 6)
	{
		$("#PluginStatus").html("tryconnpluginplatfail".i18n());
		$("#PluginErrorMsgContent").show();
		$("#PluginErrorMsg").html(data.PluginErrorMsg);
    }
	
	$.ajax({
		url: "../cgi-bin/get_smart_platform_status.cgi",
		method: "GET",
		dataType: 'json',
		cache: false,
		async: false,
		success: function(data){
			if ( data )
			{
				$("#bssAddr").html(data.smartNameStr1);
				$("#bssStatus").html(data.smartNameStr2);
				$("#abilityAddr").html(data.smartNameStr3);
				$("#abilityStatus").html(data.smartNameStr4);
			}
		}
	});
}
