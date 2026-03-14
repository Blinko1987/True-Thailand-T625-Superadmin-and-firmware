
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
		XHR.poll(gStatusFreshInterval, "get_ponlink_info", null, parseGetData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	if ( data )
	{
		if ( data.isLos == 1 )
		{
			$("#pon_status").html("connected".i18n());
		}
		else
		{
			$("#pon_status").html("disconnect".i18n());
		}
		
		$("#onustate").html(data.onustate);
		
		if ( data.fecStatus == 2 )
		{
			$("#fec_status").html("turnon".i18n());
		}
		else
		{
			$("#fec_status").html("turnoff".i18n());
		}
		
		$("#pon_send_pack").html(data.ponPacketsSent);
		$("#pon_recv_pack").html(data.ponPacketsReceived);
		$("#pon_recv_byte").html(data.ponBytesReceived);
		$("#pon_send_byte").html(data.ponBytesSent);
		$("#send_power").html(data.txpower);
		$("#recv_power").html(data.rxpower);
		$("#votage").html(data.supplyvottage);
		$("#tempreature").html(data.transceivertemperature);
		$("#current").html(data.biascurrent);
		$("#rxpowercatv").html(data.rxpowercatv);
		$("#txpowercatv").html(data.txpowercatv);
	}
}
