var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();

	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/factory_h248_preconfig", initPage);
	}
	else
	{
		XHR.get("get_factory_h248_preconfig", null, initPage);
	}
});

function initValidate()
{
	$("#voice_form").validate({
		debug: true,
		rules: {
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate loid ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate loid failed.....");
			return false;
		}
	}); 
}

var data;
function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( getdata && getdata.voice )
	{
		data = getdata.voice;
		$("#DeviceID").val(data.DeviceID);
		$("#DeviceIDType").val(data.DeviceIDType);
		for ( var i=1; i<=data.voice_port_num; i++ )
		{
			$("#PhysicalTermID" + i).val(eval("data.PhysicalTermID" + i));
			$(".line" + i).show();
		}
		$("#PhysicalTermIDPrefix").val(data.PhysicalTermIDPrefix);
		$("#StartDigitTimer").val(data.StartDigitTimer);
		$("#InterDigitTimerShort").val(data.InterDigitTimerShort);
		$("#InterDigitTimerLong").val(data.InterDigitTimerLong);
		$("#DigitTimerLong").val(data.InterDigitTimerLong);
		$("#NoAnswerTimer").val(data.NoAnswerTimer);
		$("#BusyToneTimer").val(data.BusyToneTimer);
		$("#HangingReminderToneTimer").val(data.HangingReminderToneTimer);
		$("#Howller_TimeOut").val(data.HangingReminderToneTimer);
		$("#DailToneTimer").val(data.DailToneTimer);
		$("#WaitToneTimer").val(data.WaitToneTimer);
		$("#RingToneTimer").val(data.RingToneTimer);
		$("#HeartbeatMode").val(data.HeartbeatMode);
		$("#HeartbeatCycle").val(data.HeartbeatCycle);
		$("#HeartbeatCount").val(data.HeartbeatCount);
		$("#AuditValueEnable").val(data.AuditValueEnable);
		$("#auditvalueSilenceInterval").val(data.auditvalueSilenceInterval);
		$("#RTPPrefix").val(data.RTPPrefix);
		$("#EphemeralTermIDStart").val(data.EphemeralTermIDStart);
		$("#XFIBEphemeralTermIDEnd").val(data.XFIBEphemeralTermIDEnd);
		$("#SendDigitImmediately").val(data.SendDigitImmediately);
		$("#faxControl").val(data.faxControl);
		$("#CodecControl").val(data.CodecControl);
		$("#CountryRegion").val(data.CountryRegion);
	}
	
}

function saveApply()
{
	if( ! $("#voice_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	postdata.DeviceID = $("#DeviceID").val();
	postdata.DeviceIDType = $("#DeviceIDType").val();
	for ( var i=1; i<=data.voice_port_num; i++ )
	{
		postdata["PhysicalTermID" + i] = $("#PhysicalTermID" + i).val();
	}
	postdata.PhysicalTermIDPrefix = $("#PhysicalTermIDPrefix").val();
	postdata.StartDigitTimer = $("#StartDigitTimer").val();
	postdata.InterDigitTimerShort = $("#InterDigitTimerShort").val();
	postdata.InterDigitTimerLong = $("#InterDigitTimerLong").val();
	postdata.NoAnswerTimer = $("#NoAnswerTimer").val();
	postdata.BusyToneTimer = $("#BusyToneTimer").val();
	postdata.HangingReminderToneTimer = $("#HangingReminderToneTimer").val();
	postdata.DailToneTimer = $("#DailToneTimer").val();
	postdata.WaitToneTimer = $("#WaitToneTimer").val();
	postdata.RingToneTimer = $("#RingToneTimer").val();
	postdata.HeartbeatMode = $("#HeartbeatMode").val();
	postdata.HeartbeatCycle = $("#HeartbeatCycle").val();
	postdata.HeartbeatCount = $("#HeartbeatCount").val();
	postdata.AuditValueEnable = $("#AuditValueEnable").val();
	postdata.auditvalueSilenceInterval = $("#auditvalueSilenceInterval").val();
	postdata.RTPPrefix = $("#RTPPrefix").val();
	postdata.EphemeralTermIDStart = $("#EphemeralTermIDStart").val();
	postdata.XFIBEphemeralTermIDEnd = $("#XFIBEphemeralTermIDEnd").val();
	postdata.SendDigitImmediately = $("#SendDigitImmediately").val();
	postdata.faxControl = $("#faxControl").val();
	postdata.CodecControl = $("#CodecControl").val();
	postdata.CountryRegion = $("#CountryRegion").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_factory_h248_preconfig", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

