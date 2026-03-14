var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/factory_voice_base", initPage);
	}
	else
	{
		XHR.get("get_factory_voice_base", null, initPage);
	}
	$("input[name='h248EnableModem'], input[name='sipEnableModem']").bind("click", function(){
		//h248和sip的MoIP使用同一个管理量，保持显示一致
		if ( this.name == "h248EnableModem" )
		{
			setRadio("sipEnableModem", getRadio("h248EnableModem"));
		}
		else
		{
			setRadio("h248EnableModem", getRadio("sipEnableModem"));
		}
	});
});


function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( getdata && getdata.voice )
	{
		var data = getdata.voice;
		setRadio("ServerType", data.ServerType);
		setRadio("ThreePartyInIMS", data.ThreePartyInIMS);
		setRadio("sipEnableModem", data.EnableModem);
		setRadio("h248EnableModem", data.EnableModem);
		setRadio("transferSharp", data.transferSharp);
		setRadio("EnableSubsAfterReg", data.EnableSubsAfterReg);
		setRadio("EnableAKAV1MD5", data.EnableAKAV1MD5);
		setRadio("EnableAttendedTransfer", data.EnableAttendedTransfer);
		setRadio("gainControl", data.gainControl);
		$("#SendDigitImmediately").val(data.SendDigitImmediately);
		$("#PhysicalTermIDConfigMethod").val(data.PhysicalTermIDConfigMethod);
	}
	
	displayControl();
}

function displayControl()
{
}


function saveApply()
{
	var postdata = new Object();
	postdata.ServerType = getRadio("ServerType");
	postdata.ThreePartyInIMS = getRadio("ThreePartyInIMS");
	// postdata.EnableModem = getRadio("sipEnableModem");
	postdata.EnableModem = getRadio("h248EnableModem");
	postdata.transferSharp = getRadio("transferSharp");
	postdata.EnableSubsAfterReg = getRadio("EnableSubsAfterReg");
	postdata.EnableAKAV1MD5 = getRadio("EnableAKAV1MD5");
	postdata.EnableAttendedTransfer = getRadio("EnableAttendedTransfer");
	postdata.gainControl = getRadio("gainControl");
	postdata.SendDigitImmediately = $("#SendDigitImmediately").val();
	postdata.PhysicalTermIDConfigMethod = $("#PhysicalTermIDConfigMethod").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_factory_voice_base", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

