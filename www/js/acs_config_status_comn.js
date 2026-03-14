
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/base_info", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_acs_status", null, parseGetData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	var tr69_wan_exist = 0;

	XHR.get("get_allwan_name", null, function(data){
		if ( data && data.wan )
		{
			for (var i=0; i< data.wan.length; i++ )
			{
				var singlename = data.wan[i].Name.toUpperCase();
				if ( singlename.indexOf("TR069") >= 0 )
				{
					tr69_wan_exist = 1;
					break;
				}
			}
		}
	});
	
	if ( tr69_wan_exist == 1 )
	{
		if ( data.loid_result == 1 )
		{
			$("#status").html("serviceconfigsucc".i18n());
		}
		else if ( data.loid_result == 2 )
		{
			$("#status").html("serviceconfigfail".i18n());
		}
		else if ( data.loid_result == 99 )
		{
			$("#status").html("noitmsservicedownload".i18n());
		}
		else
		{
			$("#status").html("unknowstatus".i18n());
		}
	}
	else
	{
		$("#status").html("notr69conn".i18n());
	}
}
