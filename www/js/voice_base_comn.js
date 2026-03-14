var tokenstr = "";
var voicedata;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	
	$(".main_item_name").each(function (i){
		$(this).css('width', "210px");
	});
	
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	$("input:checkbox").bind("click", function(){
		displayControl();
	});
	
	$("#servicevoip_H248ConfigMethod").bind("click", function(){
		displayControl();
	});
	
	$("#ServerType_select").bind("change", function(){
		serverTypeChange();
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_base", initPage);
	}
	else
	{
		XHR.get("get_voice_base_info", null, initPage);
	}
});

function initValidate()
{
	$("#voice_base_form").validate({
		debug: true,
		rules: {
			"ProxyServer_text": {required: true},
			"RegistrarServer_text": {required: true},
			"OutboundProxy_text": {required: true},
			"StandbyProxyServer_text": {required: true},
			"StandbyRegistrarServer_text": {required: true},
			"StandbyOutboundProxy_text": {required: true},
			"ProxyServerPort_text": {required: true, range_int:[1025,65535]},
			"RegistrarServerPort_text": {required: true, range_int:[1025,65535]},
			"OutboundProxyPort_text": {required: true, range_int:[1025,65535]},
			"StandbyProxyServerPort_text": {required: true, range_int:[1025,65535]},
			"StandbyRegistrarServerPort_text": {required: true, range_int:[1025,65535]},
			"StandbyOutboundProxyPort_text": {required: true, range_int:[1025,65535]},
			"AuthUserName_text_1": {required: true},
			"AuthPassword_password_1": {required: true},
			"AuthUserName_text_2": {required: true},
			"AuthPassword_password_2": {required: true},
			"MediaGatewayPort_text": {range_int:[1,65535]},
			"MediaGatewayControlerPort_text": {range_int:[1,65535]},
			"StandbyMediaGatewayControlerPort_text": {range_int:[1,65535]},
			"MediaGatewayPort_text": {range_int:[1,65535]},
			"SipUserAgentDomain_text": {required: false}
			
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
	
	if ( getdata && getdata.voice_base )
	{
		voicedata = getdata.voice_base;
		$("#ServerType_select").val(voicedata.ServerType);
		if ( voicedata.ServerType == 2 )
		{
			$("#MediaGatewayPort_text").val(voicedata.MediaGatewayPort);
			$("#MediaGatewayControler_text").val(voicedata.MediaGatewayControler);
			$("#MediaGatewayControlerPort_text").val(voicedata.MediaGatewayControlerPort);
			$("#StandbyMediaGatewayControler_text").val(voicedata.StandbyMediaGatewayControler);
			$("#StandbyMediaGatewayControlerPort_text").val(voicedata.StandbyMediaGatewayControlerPort);
			$("#DeviceIDType_text").val(voicedata.DeviceIDType);
			$("#DeviceID_text").val(voicedata.DeviceID);
			$("#MessageEncodingType_text").val(voicedata.MessageEncodingType);
			$("#PhysicalTermIDPrefix_text").val(voicedata.PhysicalTermIDPrefix);
			$("#PhysicalTermIDStart_text").val(voicedata.PhysicalTermIDStart);
			$("#PhysicalTermIDAddLen_text").val(voicedata.PhysicalTermIDAddLen);
			$("#RTPPrefix_text").val(voicedata.RTPPrefix);
			$("#EphemeralTermIDStart_text").val(voicedata.EphemeralTermIDStart);
			$("#EphemeralTermIDAddLen_text").val(voicedata.EphemeralTermIDAddLen);
			$("#servicevoip_H248ConfigMethod").val(voicedata.PhysicalTermIDConfigMethod);
			for ( i=1; i<=voicedata.voice_port_num; i++ )
			{
				var eid = "FXSPortEnable_checkbox_" + i;
				setCheckbox(eid, eval("voicedata.Enable" + i));
				
				$("#PS_PortID_" + i).val( eval("voicedata.PhysicalTermID" + i) );
			}
		}
		else //sip, ims
		{
			$("#ProxyServer_text").val(voicedata.ProxyServer);
			$("#ProxyServerPort_text").val(voicedata.ProxyServerPort);
			$("#RegistrarServer_text").val(voicedata.RegistrarServer);
			$("#RegistrarServerPort_text").val(voicedata.RegistrarServerPort);
			$("#OutboundProxy_text").val(voicedata.OutboundProxy);
			$("#OutboundProxyPort_text").val(voicedata.OutboundProxyPort);
			
			$("#StandbyProxyServer_text").val(voicedata.StandbyProxyServer);
			$("#StandbyProxyServerPort_text").val(voicedata.StandbyProxyServerPort);
			$("#StandbyRegistrarServer_text").val(voicedata.StandbyRegistrarServer);
			$("#StandbyRegistrarServerPort_text").val(voicedata.StandbyRegistrarServerPort);
			$("#StandbyOutboundProxy_text").val(voicedata.StandbyOutboundProxy);
			$("#StandbyOutboundProxyPort_text").val(voicedata.StandbyOutboundProxyPort);

			$("#SipUserAgentDomain_text").val(voicedata.SipUserAgentDomain);
			
			for ( i=1; i<=voicedata.voice_port_num; i++ )
			{
				var eid = "line_enable_" + i;
				setCheckbox(eid, eval("voicedata.Enable" + i));
				$("#DirectoryNumber_text_" + i).val( eval("voicedata.DirectoryNumber" + i) );
				$("#AuthUserName_text_" + i).val( eval("voicedata.AuthUserName" + i) );
				$("#AuthPassword_password_" + i).val( eval("voicedata.AuthPassword" + i) );
			}
		}
	}
	
	displayControl();
}

function displayControl()
{
	if ( $("#ServerType_select").val() == 2 ) //H.248
	{
		$("#h248_div").show();
		$("#sip_div").hide();
		for ( i=1; i<=voicedata.voice_port_num; i++ )
		{
			$("#h248_line_" + i).show();
			if ( getCheckbox("FXSPortEnable_checkbox_" + i) == 0 )
			{
				$("#PS_PortID_" + i).attr("disabled", true);
			}
			else
			{
				$("#PS_PortID_" + i).attr("disabled", false);
			}
		}
		if ( $("#servicevoip_H248ConfigMethod").val() == 0 )
		{
			$("#physicalterm_div").show();
			$(".portid_div").hide();
		}
		else
		{
			$("#physicalterm_div").hide();
			$(".portid_div").show();
		}
	}
	else //sip ims
	{
		$("#h248_div").hide();
		$("#sip_div").show();
		for ( i=1; i<=voicedata.voice_port_num; i++ )
		{
			$("#line_div_" + i).show();
			if ( getCheckbox("line_enable_" + i) == 0 )
			{
				$("#DirectoryNumber_text_" + i).attr("disabled", true);
				$("#AuthUserName_text_" + i).attr("disabled", true);
				$("#AuthPassword_password_" + i).attr("disabled", true);
			}
			else
			{
				$("#DirectoryNumber_text_" + i).attr("disabled", false);
				$("#AuthUserName_text_" + i).attr("disabled", false);
				$("#AuthPassword_password_" + i).attr("disabled", false);
			}
		}
	}
}

function serverTypeChange()
{
	var postdata = new Object();
	postdata.action = "typechange";
	postdata.ServerType = $("#ServerType_select").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_voice_base_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function saveApply()
{
	if( ! $("#voice_base_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.action = "setvalue";
	postdata.ServerType = $("#ServerType_select").val();
	if ( $("#ServerType_select").val() == 2 )//h248
	{
		if (special_char_check($("#MediaGatewayControler_text").val()) == true || special_char_check($("#StandbyMediaGatewayControler_text").val()) == true
			|| special_char_check($("#DeviceID_text").val()) == true || special_char_check($("#RTPPrefix_text").val()) == true
			|| special_char_check($("#EphemeralTermIDStart_text").val()) == true || special_char_check($("#EphemeralTermIDAddLen_text").val()) == true)
		{
			alert("specialcharcheck".i18n());
			return false;
		}
	
		$("#MediaGatewayPort_text").val() == '' ? postdata.MediaGatewayPort = '0' : postdata.MediaGatewayPort = $("#MediaGatewayPort_text").val();
		$("#MediaGatewayControler_text").val() == '' ? postdata.MediaGatewayControler = '0.0.0.0' : postdata.MediaGatewayControler = $("#MediaGatewayControler_text").val();
		$("#MediaGatewayControlerPort_text").val() == '' ? postdata.MediaGatewayControlerPort = '0' : postdata.MediaGatewayControlerPort = $("#MediaGatewayControlerPort_text").val();
		$("#StandbyMediaGatewayControler_text").val() == '' ? postdata.StandbyMediaGatewayControler = '0.0.0.0' : postdata.StandbyMediaGatewayControler = $("#StandbyMediaGatewayControler_text").val();
		$("#StandbyMediaGatewayControlerPort_text").val() == '' ? postdata.StandbyMediaGatewayControlerPort = '0' : postdata.StandbyMediaGatewayControlerPort = $("#StandbyMediaGatewayControlerPort_text").val();
		$("#PhysicalTermIDPrefix_text").val() == '' ? postdata.PhysicalTermIDPrefix = 'NULL' : postdata.PhysicalTermIDPrefix = $("#PhysicalTermIDPrefix_text").val();
		$("#PhysicalTermIDStart_text").val() == '' ? postdata.PhysicalTermIDStart = 'NULL' : postdata.PhysicalTermIDStart = $("#PhysicalTermIDStart_text").val();
		$("#PhysicalTermIDAddLen_text").val() == '' ? postdata.PhysicalTermIDAddLen = '0' : postdata.PhysicalTermIDAddLen = $("#PhysicalTermIDAddLen_text").val();
		$("#RTPPrefix_text").val() == '' ? postdata.RTPPrefix = 'NULL' : postdata.RTPPrefix = $("#RTPPrefix_text").val();
		$("#EphemeralTermIDStart_text").val() == '' ? postdata.EphemeralTermIDStart = 'NULL' : postdata.EphemeralTermIDStart = $("#EphemeralTermIDStart_text").val();
		$("#EphemeralTermIDAddLen_text").val() == '' ? postdata.EphemeralTermIDAddLen = '0' : postdata.EphemeralTermIDAddLen = $("#EphemeralTermIDAddLen_text").val();
		
		postdata.DeviceIDType = $('#DeviceIDType_text').val();
		if ( $('#DeviceID_text').val() == '' )
		{
			if ('0' == $('#DeviceIDType_text').val() )
			{
				postdata.DeviceID = '0.0.0.0';
			}
			else
			{
				postdata.DeviceID = 'NULL';
			}
		}
		else
		{
			postdata.DeviceID = $('#DeviceID_text').val();
		}
		
		postdata.MessageEncodingType = $('#MessageEncodingType_text').val();
		postdata.PhysicalTermIDConfigMethod = $('#servicevoip_H248ConfigMethod').val();
		
		for ( i=1; i<=voicedata.voice_port_num; i++ )
		{
			if ( special_char_check($("#PS_PortID_" + i).val()) == true )
			{
				alert("specialcharcheck".i18n());
				return false;
			}
		
			if ( getCheckbox("FXSPortEnable_checkbox_" + i) )
			{
				postdata["Enable" + i] = "Enabled";
			}
			else
			{
				postdata["Enable" + i] = "Disabled";
			}
			postdata["PhysicalTermID" + i] = $("#PS_PortID_" + i).val();
		}
	}
	else //sip ims
	{
		if (special_char_check($("#ProxyServer_text").val()) == true || special_char_check($("#RegistrarServer_text").val()) == true
			|| special_char_check($("#OutboundProxy_text").val()) == true || special_char_check($("#StandbyProxyServer_text").val()) == true
			|| special_char_check($("#StandbyRegistrarServer_text").val()) == true || special_char_check($("#StandbyOutboundProxy_text").val()) == true
			|| special_char_check($("#SipUserAgentDomain_text").val()) == true )
		{
			alert("specialcharcheck".i18n());
			return false;
		}
	
		postdata.ProxyServer = $("#ProxyServer_text").val();
		postdata.ProxyServerPort = $("#ProxyServerPort_text").val();
		postdata.RegistrarServer = $("#RegistrarServer_text").val();
		postdata.RegistrarServerPort = $("#RegistrarServerPort_text").val();
		postdata.OutboundProxy = $("#OutboundProxy_text").val();
		postdata.OutboundProxyPort = $("#OutboundProxyPort_text").val();
		postdata.StandbyProxyServer = $("#StandbyProxyServer_text").val();
		postdata.StandbyProxyServerPort = $("#StandbyProxyServerPort_text").val();
		postdata.StandbyRegistrarServer = $("#StandbyRegistrarServer_text").val();
		postdata.StandbyRegistrarServerPort = $("#StandbyRegistrarServerPort_text").val();
		postdata.StandbyOutboundProxy = $("#StandbyOutboundProxy_text").val();
		postdata.StandbyOutboundProxyPort = $("#StandbyOutboundProxyPort_text").val();
		postdata.SipUserAgentDomain = $("#SipUserAgentDomain_text").val();
		
		for ( i=1; i<=voicedata.voice_port_num; i++ )
		{
			if (special_char_check($("#DirectoryNumber_text_" + i).val()) == true || special_char_check($("#AuthUserName_text_" + i).val()) == true
				|| special_char_check($("#AuthPassword_password_" + i).val()) == true )
			{
				alert("specialcharcheck".i18n());
				return false;
			}
		
			if ( getCheckbox("line_enable_" + i) )
			{
				postdata["Enable" + i] = "Enabled";
			}
			else
			{
				postdata["Enable" + i] = "Disabled";
			}
			postdata["DirectoryNumber" + i] = $("#DirectoryNumber_text_" + i).val();
			postdata["AuthUserName" + i] = $("#AuthUserName_text_" + i).val();
			postdata["AuthPassword" + i] = $("#AuthPassword_password_" + i).val();
		}
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_voice_base_info", postdata, reloadSaveData);
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


