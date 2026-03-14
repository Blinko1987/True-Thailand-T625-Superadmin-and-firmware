var tokenstr = "";
var voicedata;
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/factory_voicecommon_preconfig", initPage);
	}
	else
	{
		XHR.get("get_factory_voicecommon_preconfig", null, initPage);
	}
});


function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	if (getdata && getdata.voice)
	{
		voicedata = getdata.voice;
		$("#SIPDSCPMark").val(voicedata.SIPDSCPMark);
		$("#RTPDSCPMark").val(voicedata.RTPDSCPMark);
		$("#FaxT38Enable").val(voicedata.FaxT38Enable);
		$("#FaxPassThroughEnable").val(voicedata.FaxPassThroughEnable);
		$("#G711FAXControlType").val(voicedata.G711FAXControlType);
		$("#DTMFMethod").val(voicedata.DTMFMethod);
		$("#TelephoneEventPayloadType").val(voicedata.TelephoneEventPayloadType);
		$("#staticJutterBufferEnable").val(voicedata.staticJutterBufferEnable);
		$("#staticJutterBufferTime").val(voicedata.staticJutterBufferTime);
		$("#adaptiveJutterBufferEnable").val(voicedata.adaptiveJutterBufferEnable);
		$("#FlashMin").val(voicedata.FlashMin);
		$("#FlashMax").val(voicedata.FlashMax);
		$("#bEnabledate").val(voicedata.bEnabledate);
		for ( var i=1; i<=voicedata.voice_port; i++ )
		{
			$("#Enable" + i).val( eval("voicedata.Enable" + i) );
			$("#G711UPriority" + i).val( eval("voicedata.G711UPriority" + i) );
			$("#G711APriority" + i).val( eval("voicedata.G711APriority" + i) );
			$("#G729Priority" + i).val( eval("voicedata.G729Priority" + i) );
			$("#G726Priority" + i).val( eval("voicedata.G726Priority" + i) );
			$("#G723Priority" + i).val( eval("voicedata.G723Priority" + i) );
			$("#G722Priority" + i).val( eval("voicedata.G722Priority" + i) );
			$("#TransmitGain" + i).val( eval("voicedata.TransmitGain" + i) );
			$("#ReceiveGain" + i).val( eval("voicedata.ReceiveGain" + i) );
			$("#EchoCancellationEnable" + i).val( eval("voicedata.EchoCancellationEnable" + i) );
			$("#SilenceSuppression" + i).val( eval("voicedata.SilenceSuppression" + i) );
			$("#CNGEnable" + i).val( eval("voicedata.CNGEnable" + i) );
			$("#L" + i + "_dialmode").val( eval("voicedata.L" + i + "_dialmode") );
		}
	}
	displayControl();
}

function displayControl()
{
	$(".line2_item").hide();
	if (voicedata.voice_port > 1 )
	{
		$(".line2_item").show();
	}
}


function saveApply()
{

	var postdata = new Object();
	postdata.SIPDSCPMark = $("#SIPDSCPMark").val();
	postdata.RTPDSCPMark = $("#RTPDSCPMark").val();
	postdata.FaxT38Enable = $("#FaxT38Enable").val();
	postdata.FaxPassThroughEnable = $("#FaxPassThroughEnable").val();
	postdata.G711FAXControlType = $("#G711FAXControlType").val();
	postdata.DTMFMethod = $("#DTMFMethod").val();
	postdata.TelephoneEventPayloadType = $("#TelephoneEventPayloadType").val();
	postdata.staticJutterBufferEnable = $("#staticJutterBufferEnable").val();
	postdata.staticJutterBufferTime = $("#staticJutterBufferTime").val();
	postdata.adaptiveJutterBufferEnable = $("#adaptiveJutterBufferEnable").val();
	postdata.FlashMin = $("#FlashMin").val();
	postdata.FlashMax = $("#FlashMax").val();
	postdata.bEnabledate = $("#bEnabledate").val();
	for ( var i=1; i<=voicedata.voice_port; i++ )
	{
		postdata["Enable" + i] = $("#Enable" + i).val();
		postdata["G711UPriority" + i] = $("#G711UPriority" + i).val();
		postdata["G711APriority" + i] = $("#G711APriority" + i).val();
		postdata["G729Priority" + i] = $("#G729Priority" + i).val();
		postdata["G726Priority" + i] = $("#G726Priority" + i).val();
		postdata["G723Priority" + i] = $("#G723Priority" + i).val();
		postdata["G722Priority" + i] = $("#G722Priority" + i).val();
		postdata["TransmitGain" + i] = $("#TransmitGain" + i).val();
		postdata["ReceiveGain" + i] = $("#ReceiveGain" + i).val();
		postdata["EchoCancellationEnable" + i] = $("#EchoCancellationEnable" + i).val();
		postdata["SilenceSuppression" + i] = $("#SilenceSuppression" + i).val();
		postdata["CNGEnable" + i] = $("#CNGEnable" + i).val();
		postdata["L" + i + "_dialmode"] = $("#L" + i + "_dialmode").val();
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_factory_voicecommon_preconfig", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

