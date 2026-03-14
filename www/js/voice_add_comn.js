var tokenstr = "";
var voicedata = '';

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
		getDataByAjax("../fake/voice_add", initPage);
	}
	else
	{
		XHR.get("get_voice_add_info", null, initPage);
	}
});

function initValidate()
{
	$("#voice_add_form").validate({
		debug: true,
		rules: {
			"conferenceuri1": {required: true},
			"hotlineuri1": {required: true},
			"HotlineTimer1": {required: true, min:0},
			"conferenceuri2": {required: true},
			"hotlineuri2": {required: true},
			"HotlineTimer2": {required: true, min:0},
			"HeartbeatCycle": {required: true, min:0},
			"HeartbeatCount": {required: true, min:0}
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
	
	if (getdata != null && getdata.voice_add)
	{
		voicedata = getdata.voice_add;
		
		$("#TimeSyncMode").val(voicedata.TimeSyncMode);
		$("#CountryRegion").val(voicedata.CountryRegion);
		if ( voicedata.ServerType == 0 )
		{
			setCheckbox("PolarityReversalMode", voicedata.PolarityReversalMode);
			setCheckbox("EnableSubsAfterReg", voicedata.EnableSubsAfterReg);
			$("#ThreePartyInIMS").val(voicedata.ThreePartyInIMS);
			for ( i=1; i<=voicedata.voice_port_num; i++ )
			{
				$("#conferenceuri"+i).val(eval("voicedata.conferenceuri"+ i));
				$("#hotlineuri"+i).val(eval("voicedata.hotlineuri"+i));
			}
		}
		else if ( voicedata.ServerType == 1 )
		{
			setCheckbox("PolarityReversalMode", voicedata.PolarityReversalMode);
			for ( i=1; i<=voicedata.voice_port_num; i++ )
			{
				$("#HotlineTimer"+i).val(eval("voicedata.HotlineTimer"+ i));
				$("#hotlineuri"+i).val(eval("voicedata.HotlineNumber"+i));
				setCheckbox("HotlineEnable"+i, eval("voicedata.HotlineEnable"+i));
				setCheckbox("ThreeWayCallingEnable"+i, eval("voicedata.ThreeWayCallingEnable"+i));
				setCheckbox("CallWaitingEnable"+i, eval("voicedata.CallWaitingEnable"+i));
			}
		}
		else if ( voicedata.ServerType == 2 )
		{
			setCheckbox("HeartbeatMode", voicedata.HeartbeatMode);
			$("#HeartbeatCycle").val(voicedata.HeartbeatCycle);
			$("#HeartbeatCount").val(voicedata.HeartbeatCount);
		}
	}
	
	displayControl();
}



function extraValidCheck()
{
	var error_num = 0;

	
	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}

function displayControl()
{
	$(".sip_item,.h248_item,.ims_item").each(function (i){
		$(this).hide();
	});
	if ( voicedata.ServerType == 0 )
	{
		$(".ims_item").each(function (i){
			$(this).show();
		});
	}
	else if ( voicedata.ServerType == 1 )
	{
		$(".sip_item").each(function (i){
			$(this).show();
		});
		for ( i=1; i<=voicedata.voice_port_num; i++ )
		{
			if ( getCheckbox("HotlineEnable"+i) == 0 )
			{
				$("#HotlineTimer"+i).attr("disabled", true);
				$("#hotlineuri"+i).attr("disabled", true);
			}
			else
			{
				$("#HotlineTimer"+i).attr("disabled", false);
				$("#hotlineuri"+i).attr("disabled", false);
			}
		}
	}
	else if ( voicedata.ServerType == 2 )
	{
		$(".h248_item").each(function (i){
			$(this).show();
		});
		if ( getCheckbox("HeartbeatMode") == 0 )
		{
			$("#HeartbeatCycle").attr("disabled", true);
			$("#HeartbeatCount").attr("disabled", true);
		}
		else
		{
			$("#HeartbeatCycle").attr("disabled", false);
			$("#HeartbeatCount").attr("disabled", false);
		}
	}
}

function saveApply()
{
	if( ! $("#voice_add_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.ServerType = voicedata.ServerType;
	postdata.TimeSyncMode = $("#TimeSyncMode").val();
	postdata.CountryRegion = $("#CountryRegion").val();
	if ( voicedata.ServerType == 0 )
	{
		postdata.PolarityReversalMode = getCheckbox("PolarityReversalMode");
		postdata.EnableSubsAfterReg = getCheckbox("EnableSubsAfterReg");
		postdata.ThreePartyInIMS = $("#ThreePartyInIMS").val();
		for ( i=1; i<=voicedata.voice_port_num; i++ )
		{
			postdata["conferenceuri"+i] = $("#conferenceuri"+i).val();
			postdata["hotlineuri"+i] = $("#hotlineuri"+i).val();
		}
	}
	else if ( voicedata.ServerType == 1 )
	{
		postdata.PolarityReversalMode = getCheckbox("PolarityReversalMode");
		for ( i=1; i<=voicedata.voice_port_num; i++ )
		{
			postdata["HotlineTimer"+i] =$("#HotlineTimer"+i).val();
			postdata["HotlineNumber"+i] = $("#hotlineuri"+i).val();
			postdata["HotlineEnable"+i] = getCheckbox("HotlineEnable"+i);
			postdata["ThreeWayCallingEnable"+i] = getCheckbox("ThreeWayCallingEnable"+i);
			postdata["CallWaitingEnable"+i] = getCheckbox("CallWaitingEnable"+i);
		}
	}
	else if ( voicedata.ServerType == 2 )
	{
		postdata.HeartbeatMode = getCheckbox("HeartbeatMode");
		postdata.HeartbeatCycle = $("#HeartbeatCycle").val();
		postdata.HeartbeatCount = $("#HeartbeatCount").val();
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_voice_add_info", postdata, reloadSaveData);
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

