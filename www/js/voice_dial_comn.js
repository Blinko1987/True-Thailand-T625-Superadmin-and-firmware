var tokenstr = "";
var voicedata;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_dial", initPage);
	}
	else
	{
		XHR.get("get_voice_dial_info", null, initPage);
	}
});

function initValidate()
{
	$("#voice_dial_form").validate({
		debug: true,
		rules: {
			"StartDialingTimer_text": {required: true, range_int:[10,20]},
			"LongTimerValue_text": {required: true, min:0},
			"ShortTimerValue_text": {required: true, min:0}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate mac filter failed.....");
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
	
	if (getdata != null && getdata.voice_dial)
	{
		voicedata = getdata.voice_dial;
		if ( voicedata.ServerType != 2 )
		{
			setCheckbox("DigitMapEnable_checkbox", voicedata.DigitMapEnable);
			$("#DigitMap_text").val(voicedata.DigitMap);
			if (voicedata.DigitMapType == 0 || voicedata.DigitMapType == 1){
				$("#DigitMapMode_select").val("0");
			}
			if (voicedata.DigitMapType == 2 || voicedata.DigitMapType == 3){
				$("#DigitMapMode_select").val("2");
			}
			$("#TWaitTime_select").val(voicedata.TWaitTime);
			$("#DotWaitTime_select").val(voicedata.DotWaitTime);
			$("#OutNumberContainImmediateDialKey_select").val(voicedata.LocalRuleType);
			if ( getOperator() == "CM" )
			{
				$("#StartDialingTimer_text").val(voicedata.OffHookNoDailTimer);
				$("#ShortTimerValue_text").val(voicedata.InterDigitTimerStd);
			}
			else
			{
				$("#StartDialingTimer_text").val( parseInt(voicedata.OffHookNoDailTimer/1000));
				$("#ShortTimerValue_text").val( parseInt(voicedata.InterDigitTimerStd/1000) );
			}
			$("#LongTimerValue_text").val(voicedata.InterDigitTimerLong);
		}
		else
		{
			$("#StartDialingTimer_text").val(voicedata.StartDigitTimer);
			$("#ShortTimerValue_text").val(voicedata.InterDigitTimerShort);
			$("#LongTimerValue_text").val(voicedata.InterDigitTimerLong);
		}
	}
	
	displayControl();
}


function displayControl()
{
	if ( voicedata.ServerType != 2 )
	{
		$("#ims_sip_div").show();
	}
	else
	{
		$("#ims_sip_div").hide();
	}
}

function saveApply()
{
	if( ! $("#voice_dial_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	if ($("#DigitMap_text").val().length > 5119)
	{
		alert("dailrulelencannotgreater5119".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.ServerType = voicedata.ServerType;
	if ( voicedata.ServerType != 2 )
	{
		if ( special_char_check($("#DigitMap_text").val()) == true )
		{
			alert("specialcharcheck".i18n());
			return false;
		}
	
		postdata.DigitMapEnable = getCheckbox("DigitMapEnable_checkbox");
		postdata.DigitMap = $("#DigitMap_text").val();
		postdata.DigitMapType = $("#DigitMapMode_select").val();
		postdata.TWaitTime = $("#TWaitTime_select").val();
		postdata.DotWaitTime = $("#DotWaitTime_select").val();
		postdata.LocalRuleType = $("#OutNumberContainImmediateDialKey_select").val();
		if ( getOperator() == "CM" )
		{
			postdata.OffHookNoDailTimer = parseInt($("#StartDialingTimer_text").val());
			postdata.InterDigitTimerStd = parseInt($("#ShortTimerValue_text").val());
		}
		else
		{
			postdata.OffHookNoDailTimer = parseInt($("#StartDialingTimer_text").val())*1000;
			postdata.InterDigitTimerStd = parseInt($("#ShortTimerValue_text").val())*1000;
		}
		postdata.InterDigitTimerLong = $("#LongTimerValue_text").val();
	}
	else
	{
		postdata.StartDigitTimer = $("#StartDialingTimer_text").val();
		postdata.InterDigitTimerShort = $("#ShortTimerValue_text").val();
		postdata.InterDigitTimerLong = $("#LongTimerValue_text").val();
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_voice_dial_info", postdata, reloadSaveData);
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


