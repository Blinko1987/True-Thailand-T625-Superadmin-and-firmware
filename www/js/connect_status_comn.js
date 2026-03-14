
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
	
	// inform_status
	if ( tr69_wan_exist == 1 )
	{
		if ( data.tr069ipstatus == 1 )
		{
			if ( data.tr69url == "" || data.tr69url.toUpperCase() == "NULL" )
			{
				$("#inform_status").html("notinformnoacs".i18n());
			}
			else
			{
				if ( data.informstatus == 8 )
				{
					$("#inform_status").html("informsucc".i18n());
				}
				else if ( data.informstatus >= 0 && data.informstatus <= 5 )
				{
					$("#inform_status").html("notinform".i18n());
				}
				else if ( data.informstatus == 6 )
				{
					if ( data.handlestatus == 0 )
					{
						$("#inform_status").html("notinformacsparseerr".i18n());
					}
					else
					{
						$("#inform_status").html("informnoresponse".i18n());
					}
				}
				else if ( data.informstatus == 7 )
				{
					$("#inform_status").html("informprocessinterrupt".i18n());
				}
				else
				{
					$("#inform_status").html("unknowstatus".i18n());
				}
			}
		}
		else
		{
			$("#inform_status").html("notinformawaninvalid".i18n());
		}
	}
	else
	{
		$("#inform_status").html("notinformanotr069".i18n());
	}
	
	if ( tr69_wan_exist == 1 )
	{
		if ( data.tr069ipstatus == 1 )
		{
			if ( data.connectionrequeststatus == 0 )
			{
				$("#request_status").html("noremoteconnreceive".i18n());
			}
			else if ( data.connectionrequeststatus == 1 )
			{
				$("#request_status").html("itmsremoteconnprocessinterrupt".i18n());
			}
			else if ( data.connectionrequeststatus == 2 )
			{
				$("#request_status").html("itmsremoteconnprocesssucc".i18n());
			}
			else
			{
				$("#request_status").html("unknowstatus".i18n());
			}
		}
		else
		{
			$("#inform_status").html("noremoteconnreceivewaninvalid".i18n());
		}
	}
	else
	{
		$("#request_status").html("noremoteconnreceivenotr069".i18n());
	}
}
