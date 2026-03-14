var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();

	showOrHideLoadingWindowFromIframe("show");
	
	$("input[name='pon_flag']").bind("click", function(){
		displayControl();
	});
	
	$("#ManufacturerOUI").keyup(function(){
		$("#sn_head").html($(this).val() + '-');
		$("#SerialNumber").width(230 - $("#sn_head").width());
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/baseinfoSet", initPage);
	}
	else
	{
		XHR.get("get_factory_baseinfo", null, initPage);
	}
});

function initValidate()
{
	$("#baseinfoset_form").validate({
		debug: true,
		rules: {
			"result": {required: true, range_int: [0,99]},
			"ManufacturerOUI": {required: true},
			"SerialNumber": {required: true},
			"admin_name": {required: true},
			"admin_password": {required: true},
			"user_name": {required: true},
			"usre_password": {required: true},
			"InternetMac": {required: true, mac:true},
			"Tr069Mac": {required: true, mac:true},
			"VoIPMac": {required: true, mac:true},
			"PriProtocolMac": {required: true, mac:true},
			"apmac": {required: true, mac:true},
			"brmac": {required: true, mac:true},
			"GponSN": {required: true},
			"GPONPassWord": {required: true},
			"PONMac": {required: true, mac:true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate failed.....");
			return false;
		}
	}); 
}

var factory_data;
var rebootflag = 0;
function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	if ( getdata && getdata.factory_data )
	{
		factory_data = getdata.factory_data;
		$("#SoftwareVersion").html(factory_data.SoftwareVersion);
		$("#HardwareVersion").html(factory_data.HardwareVersion);
		$("#ExternalNumber").html(factory_data.ExternalNumber);
		$("#HardwareDiskNumber").html(factory_data.HardwareDiskNumber);
		$("#result").val(factory_data.result);
		$("#ManufacturerOUI").val(factory_data.ManufacturerOUI);
		$("#sn_head").html(factory_data.ManufacturerOUI + '-');
		$("#SerialNumber").val(factory_data.SerialNumber);
		$("#admin_name").val(factory_data.admin_name);
		$("#admin_password").val(factory_data.admin_password);
		$("#user_name").val(factory_data.user_name);
		$("#usre_password").val(factory_data.usre_password);
		$("#InternetMac").val(factory_data.InternetMac.toUpperCase());
		$("#Tr069Mac").val(factory_data.Tr069Mac.toUpperCase());
		$("#VoIPMac").val(factory_data.VoIPMac.toUpperCase());
		$("#PriProtocolMac").val(factory_data.PriProtocolMac.toUpperCase());
		if ( factory_data.wifi_enable == 1 )
		{
			$("#apmac_1").val(factory_data.APMAC_1.toUpperCase());
			$("#apmac_2").val(factory_data.APMAC_2.toUpperCase());
		}
		setCheckbox("InternetMacEnable", factory_data.InternetMacEnable);
		setCheckbox("Tr069MacEnable", factory_data.Tr069MacEnable);
		setCheckbox("VoIPMacEnable", factory_data.VoIPMacEnable);
		setCheckbox("PriProtocolMacEnable", factory_data.PriProtocolMacEnable);
		
		$("#compile_time").html(factory_data.compiletime);
		$("#ImageID").html(factory_data.ImageID);
		$("#brmac").val(factory_data.brmac);
		$("#PONMac").val(factory_data.PONMac);
		$("#GponSN").val(factory_data.GponSN);
		$("#GPONPassWord").val(factory_data.GPONPassWord);
		setRadio("pon_flag", factory_data.pon_flag);
		//todo:预配置ID
		
		setRadio("pon_mode", factory_data.pon_mode); //sym对称，asym非对称
	}
	
	displayControl();
	
	if ( rebootflag )
	{
		rebootflag = 0;
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		//填充内容
		$("#pop_window_title", parentObj).html("重启提示");
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("设备正在重启，该过程持续1分钟左右，请耐心等待");
		$("#pop_window_option", parentObj).hide();
		var postdata = new Object();
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		jumpToLoginPage(true);
		XHR.post("reboot", postdata, null);
		showOrHidePopWindowFromIframe("show");
	}
}

function displayControl()
{
	var pon_flag = $("input[name='pon_flag']:checked").val();
	if ( pon_flag == "GPON" )
	{
		$(".gpon_item").show();
		$(".epon_item").hide();
	}
	else if ( pon_flag == "EPON" )
	{
		$(".epon_item").show();
		$(".gpon_item").hide();
	}
	
	if ( factory_data.factory_mode == 0 )// not in factory mode
	{
		$(".disabled_item").each(function (i){
			$(this).attr("disabled", "disabled");
		});
	}
	
	if ( factory_data.wifi_enable == 1 )
	{
		$(".wifi_item").each(function (i){
			$(this).show();
		});
		
		if (factory_data.wifi_5g_enable == 1)
		{
			$("#5gwifi").show();
		}
		else
		{
			$("#5gwifi").hide();
		}
	}
	else
	{
		$(".wifi_item").each(function (i){
			$(this).hide();
		});
	}
	$("#SerialNumber").width(230 - $("#sn_head").width());
}


function saveApply()
{
	if( ! $("#baseinfoset_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	postdata.result = $("#result").val();
	
	if ( factory_data.factory_mode == 1 )
	{
		// if ( getRadio("pon_mode") != factory_data.pon_mode )
		// {
			// if ( true == confirm("您修改了PON模式，这会导致设备重启，是否继续？") )
			// {
				// rebootflag = 1;
			// }
			// else
			// {
				// return;
			// }
		// }
		
		postdata.ManufacturerOUI = $("#ManufacturerOUI").val();
		postdata.SerialNumber = $("#SerialNumber").val();
		postdata.admin_name = $("#admin_name").val();
		postdata.admin_password = $("#admin_password").val();
		postdata.user_name = $("#user_name").val();
		postdata.usre_password = $("#usre_password").val();
		postdata.InternetMacEnable = getCheckbox("InternetMacEnable");
		postdata.Tr069MacEnable = getCheckbox("Tr069MacEnable");
		postdata.VoIPMacEnable = getCheckbox("VoIPMacEnable");
		postdata.PriProtocolMacEnable = getCheckbox("PriProtocolMacEnable");
		postdata.InternetMac = $("#InternetMac").val();
		postdata.Tr069Mac = $("#Tr069Mac").val();
		postdata.VoIPMac = $("#VoIPMac").val();
		postdata.PriProtocolMac = $("#PriProtocolMac").val();
		postdata.brmac = $("#brmac").val();
		
		if ( factory_data.wifi_enable == 1 )
		{
			postdata.APMAC_1 = $("#apmac_1").val();
			if ( factory_data.wifi_5g_enable == 1 )
			{
				postdata.APMAC_2 = $("#apmac_2").val();
			}
		}
		
		var pon_flag = $("input[name='pon_flag']:checked").val();
		if ( pon_flag == "GPON" )
		{
			postdata.GponSN = $("#GponSN").val();
			postdata.GPONPassWord = $("#GPONPassWord").val();
		}
		else if ( pon_flag == "EPON" )
		{
			postdata.PONMac = $("#PONMac").val();
		}
		postdata.pon_flag = pon_flag;
		
		postdata.pon_mode = getRadio("pon_mode");
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_factory_baseinfo", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

