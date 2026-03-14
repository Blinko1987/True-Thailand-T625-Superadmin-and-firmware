var tokenstr = "";
var voicedata;
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	
	//清除自定义错误提�?	
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	$("input:checkbox").bind("click", function(){
		displayControl();
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_advance", initPage);
	}
	else
	{
		XHR.get("get_voice_advance_info", null, initPage);
	}
});

function initValidate()
{
	$("#voice_advance_form").validate({
		debug: true,
		rules: {
			"SipLocalPort_text": {required: true, range_int:[1025,65535]},
			"RegisterExpires_text": {required: true, range_int:[20,65535]},
			"RegisterRetryInterval_text": {required: true, range_int:[1,65535]},
			"SessionExpires_text": {required: true, range_int:[120,3600]},
			"RtpPortStart_text": {required: true, range_int:[1026,65494]},
			"RtpPortEnd_text": {required: true, range_int:[1032,65535]},
			"SipDSCPMark_text": {required: true, range_int:[0,63]},
			"RtpDSCPMark_text": {required: true, range_int:[0,63]},
			"DSPRXGain_text1": {required: true, range_int:[-14,6]},
			"DSPTXGain_text1": {required: true, range_int:[-14,6]},
			"DSPRXGain_text2": {required: true, range_int:[-14,6]},
			"DSPTXGain_text2": {required: true, range_int:[-14,6]},
			"FlashMin_text": {required: true, range_int:[40,500]},
			"FlashMax_text": {required: true, range_int:[40,2000]},
			"RingVoltage_text": {required: true, range_int:[45,65]},
			"Jitterbuffer_min": {required: true},
			"Jitterbuffer_max": {required: true},
			"JBFaxSize": {required: true, range_int:[30,200]},
			"G722Priority_text1": {required: true, range_int:[1,4]},
			"G722RtpPackageInterval_text1": {required: true},
			"G711aPriority_text1": {required: true, range_int:[1,4]},
			"G711aRtpPackageInterval_text1": {required: true},
			"G711uPriority_text1": {required: true, range_int:[1,4]},
			"G711uRtpPackageInterval_text1": {required: true},
			"G729Priority_text1": {required: true, range_int:[1,4]},
			"G729RtpPackageInterval_text1": {required: true},
			"G722Priority_text2": {required: true, range_int:[1,4]},
			"G722RtpPackageInterval_text2": {required: true},
			"G711aPriority_text2": {required: true, range_int:[1,4]},
			"G711aRtpPackageInterval_text2": {required: true},
			"G711uPriority_text2": {required: true, range_int:[1,4]},
			"G711uRtpPackageInterval_text2": {required: true},
			"G729Priority_text2": {required: true, range_int:[1,4]},
			"G729RtpPackageInterval_text2": {required: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate voice_advance ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate voice_advance failed.....");
			return false;
		}
	}); 
}

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
	
	if (getdata != null && getdata.voice_advance)
	{
		voicedata = getdata.voice_advance;
		$("#URIType_select").val(voicedata.URIType);
		$("#DTMFMethod_select").val(voicedata.DTMFMethod);
		$("#SipLocalPort_text").val(voicedata.UserAgentPort);
		$("#RegisterExpires_text").val(voicedata.RegisterExpires);
		$("#RegisterRetryInterval_text").val(voicedata.RegisterRetryInterval);
		if (getOperator() == "CM")
			$("#SessionUpdateTimer_text").val(voicedata.SessionExpires);
		else
			$("#SessionExpires_text").val(voicedata.SessionExpires);
		$("#RtpPortStart_text").val(voicedata.LocalPortMin);
		$("#RtpPortEnd_text").val(voicedata.LocalPortMax);
		setCheckbox("PRACKEnable_checkbox", voicedata.sendReliableResponse);
		setCheckbox("BootDeRegisterEnable_checkbox", voicedata.BootDeRegisterEnable);
		$("#SipDSCPMark_text").val(voicedata.SIPDSCPMark);
		$("#RtpDSCPMark_text").val(voicedata.RTPDSCPMark);
		$("#FlashMin_text").val(voicedata.FlashMin);
		$("#FlashMax_text").val(voicedata.FlashMax);
		$("#RingVoltage_text").val(voicedata.ring_vol);
		setCheckbox("ECEnable", voicedata.HighFaxECEnable);
		$("#Jitterbuffer_min").val(voicedata.JBMinSize);
		$("#Jitterbuffer_max").val(voicedata.JBMaxSize);
		$("#JBFaxSize").val(voicedata.JBFaxSize);
		setCheckbox("TimeEnable", voicedata.bEnabledate);
		//setCheckbox("DisplayName", voicedata.DisplayName);
		$("#Polarity_select").val(voicedata.PolarityReversalMode);

		for ( i=1; i<=voicedata.voice_port_num; i++ )
		{
			$("#DSPRXGain_text"+i).val(eval("voicedata.ReceiveGain"+ i));
			$("#DSPTXGain_text"+i).val(eval("voicedata.TransmitGain"+ i));
			setCheckbox("EchoCancelEnable_checkbox"+i, eval("voicedata.EchoCancellationEnable"+ i));
			setCheckbox("VadCngEnable_checkbox"+i, eval("voicedata.SilenceSuppression"+ i));
			setCheckbox("G722Enable_checkbox"+i, eval("voicedata.g722_Enable"+ i));
			$("#G722Priority_text"+i).val(eval("voicedata.g722_Priority"+ i));
			$("#G722RtpPackageInterval_text"+i).val(eval("voicedata.g722_PacketizationPeriod"+ i));
			setCheckbox("G711aEnable_checkbox"+i, eval("voicedata.g711a_Enable"+ i));
			$("#G711aPriority_text"+i).val(eval("voicedata.g711a_Priority"+ i));
			$("#G711aRtpPackageInterval_text"+i).val(eval("voicedata.g711a_PacketizationPeriod"+ i));
			setCheckbox("G711uEnable_checkbox"+i, eval("voicedata.g711u_Enable"+ i));
			$("#G711uPriority_text"+i).val(eval("voicedata.g711u_Priority"+ i));
			$("#G711uRtpPackageInterval_text"+i).val(eval("voicedata.g711u_PacketizationPeriod"+ i));
			setCheckbox("G729Enable_checkbox"+i, eval("voicedata.g729_Enable"+ i));
			$("#G729Priority_text"+i).val(eval("voicedata.g729_Priority"+ i));
			$("#G729RtpPackageInterval_text"+i).val(eval("voicedata.g729_PacketizationPeriod"+ i));
		}
	}
	
	displayControl();
}


function displayControl()
{
	for ( i=1; i<=voicedata.voice_port_num; i++ )
	{
		if ( getCheckbox("G722Enable_checkbox"+i) )
		{
			$("#G722Priority_text"+i).attr("disabled", false);
			$("#G722RtpPackageInterval_text"+i).attr("disabled", false);
		}
		else
		{
			$("#G722Priority_text"+i).attr("disabled", true);
			$("#G722RtpPackageInterval_text"+i).attr("disabled", true);
		}
		
		if ( getCheckbox("G729Enable_checkbox"+i) )
		{
			$("#G729Priority_text"+i).attr("disabled", false);
			$("#G729RtpPackageInterval_text"+i).attr("disabled", false);
		}
		else
		{
			$("#G729Priority_text"+i).attr("disabled", true);
			$("#G729RtpPackageInterval_text"+i).attr("disabled", true);
		}
		
		if ( getCheckbox("G711aEnable_checkbox"+i) )
		{
			$("#G711aPriority_text"+i).attr("disabled", false);
			$("#G711aRtpPackageInterval_text"+i).attr("disabled", false);
		}
		else
		{
			$("#G711aPriority_text"+i).attr("disabled", true);
			$("#G711aRtpPackageInterval_text"+i).attr("disabled", true);
		}
		
		if ( getCheckbox("G711uEnable_checkbox"+i) )
		{
			$("#G711uPriority_text"+i).attr("disabled", false);
			$("#G711uRtpPackageInterval_text"+i).attr("disabled", false);
		}
		else
		{
			$("#G711uPriority_text"+i).attr("disabled", true);
			$("#G711uRtpPackageInterval_text"+i).attr("disabled", true);
		}

	}
	if (voicedata.ServerType == 2 )
	{
		$(".sip_item").each(function (i){
			$(this).hide();
		});
	}
	else
	{
		$(".sip_item").each(function (i){
			$(this).show();
		});
		if (getOperator() == "CM")
		{
			$("#SessionExpires_div").hide();
			$("#SessionUpdateTimer_div").show();
		}
		else
		{
			$("#SessionExpires_div").show();
			$("#SessionUpdateTimer_div").hide();
		}
	}
}

function saveApply()
{
	if( ! $("#voice_advance_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	if ( special_char_check($("#Jitterbuffer_min").val()) == true || special_char_check($("#Jitterbuffer_max").val()) == true )
	{
		alert("specialcharcheck".i18n());
		return false;
	}
	
	var postdata = new Object();
	postdata.ServerType = voicedata.ServerType;
	postdata.URIType = $("#URIType_select").val();
	postdata.DTMFMethod = $("#DTMFMethod_select").val();
	postdata.UserAgentPort = $("#SipLocalPort_text").val();
	postdata.RegisterExpires = $("#RegisterExpires_text").val();
	postdata.RegisterRetryInterval = $("#RegisterRetryInterval_text").val();
	if ( getOperator() == "CM" )
		postdata.SessionExpires = $("#SessionUpdateTimer_text").val();
	else
		postdata.SessionExpires = $("#SessionExpires_text").val();
	postdata.LocalPortMin = $("#RtpPortStart_text").val();
	postdata.LocalPortMax = $("#RtpPortEnd_text").val();
	postdata.sendReliableResponse = getCheckbox("PRACKEnable_checkbox");
	postdata.BootDeRegisterEnable = getCheckbox("BootDeRegisterEnable_checkbox");
	postdata.SIPDSCPMark = $("#SipDSCPMark_text").val();
	postdata.RTPDSCPMark = $("#RtpDSCPMark_text").val();

	postdata.FlashMin = $("#FlashMin_text").val();
	postdata.FlashMax = $("#FlashMax_text").val();

	postdata.ring_vol = $("#RingVoltage_text").val();
	postdata.HighFaxECEnable = getCheckbox("ECEnable");
	postdata.JBMinSize = $("#Jitterbuffer_min").val();
	postdata.JBMaxSize = $("#Jitterbuffer_max").val();
	postdata.JBFaxSize = $("#JBFaxSize").val();
	postdata.bEnabledate = getCheckbox("TimeEnable");
	//postdata.DisplayName = getCheckbox("DisplayName");
	postdata.PolarityReversalMode = $("#Polarity_select").val();

	for ( i=1; i<=voicedata.voice_port_num; i++ )
	{
		if ( special_char_check($("#G722Priority_text"+i).val()) == true || special_char_check($("#G711aPriority_text"+i).val()) == true 
			|| special_char_check($("#G711uPriority_text"+i).val()) == true || special_char_check($("#G729Priority_text"+i).val()) == true )
		{
			alert("specialcharcheck".i18n());
			return false;
		}
	
		postdata["ReceiveGain"+i] = $("#DSPRXGain_text"+i).val();
		postdata["TransmitGain"+i] = $("#DSPTXGain_text"+i).val();
		postdata["EchoCancellationEnable"+i] = getCheckbox("EchoCancelEnable_checkbox"+i);
		postdata["SilenceSuppression"+i] = getCheckbox("VadCngEnable_checkbox"+i);
		postdata["g722_Enable"+i] = getCheckbox("G722Enable_checkbox"+i);
		postdata["g722_Priority"+i] = $("#G722Priority_text"+i).val();
		postdata["g722_PacketizationPeriod"+i] = $("#G722RtpPackageInterval_text"+i).val();
		postdata["g711a_Enable"+i] = getCheckbox("G711aEnable_checkbox"+i);
		postdata["g711a_Priority"+i] = $("#G711aPriority_text"+i).val();
		postdata["g711a_PacketizationPeriod"+i] = $("#G711aRtpPackageInterval_text"+i).val();
		postdata["g711u_Enable"+i] = getCheckbox("G711uEnable_checkbox"+i);
		postdata["g711u_Priority"+i] = $("#G711uPriority_text"+i).val();
		postdata["g711u_PacketizationPeriod"+i] = $("#G711uRtpPackageInterval_text"+i).val();
		postdata["g729_Enable"+i] = getCheckbox("G729Enable_checkbox"+i);
		postdata["g729_Priority"+i] = $("#G729Priority_text"+i).val();
		postdata["g729_PacketizationPeriod"+i] = $("#G729RtpPackageInterval_text"+i).val();
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_voice_advance_info", postdata, reloadSaveData);
	showOrHideLoadingWindowFromIframe("show");
}

function reloadSaveData(data)
{
	if(data)
	{
		initPage(data);
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}


