var tokenstr = "";
var error_hint_start_invalid = "startaddrinvalid".i18n();
var error_hint_end_invalid = "endaddrinvalid".i18n();
var error_hint_start_end = "startlessthanorequaltoend".i18n();
var error_hint_range = "notinstartingandendingiprange".i18n();
var splitchar = ".";
var old_ip = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	$("input:checkbox").bind("click", function(){
		checkDisableElement();
	});
	
	showOrHideLoadingWindowFromIframe("show");

	$('#LanIP_Address_text').bind('input', function() {
		changeIpHead();
	});
	$('#LanIP_Address_text').bind('propertychange', function() {
		changeIpHead();
	});
	
	$("#LanDNS_select").bind("click", function(){
		changednssetting();
	});
	
	//清除错误提示
	$(".main_item_error_hint").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipv4_lan_info", initPage);
	}
	else
	{
		XHR.get("get_ipv4_lan_info", null, initPage);
	}
});

function initValidate()
{
	$("#lan_ipv4_form").validate({
		debug: true,
		rules: {
			"LanIP_Address_text": {required: true, ipv4: true},
			"LanSubmask_text": {required: true, subnetMask: true},
			// "LanStartAddress_text": {required: true, ipv4: true},
			// "LanEndAddress_text": {required: true, ipv4: true},
			"LanDHCP_Submask_text": {required: true, subnetMask: true},
			"LanLeaseTime_select": {required: true, range_int:[1, 2592000]}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate lan ipv4 ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate lan ipv4 failed.....");
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
	if ( getdata != null && getdata.lan_ipv4 )
	{
		var landata = getdata.lan_ipv4;
		$("#LanIP_Address_text").val(landata.IPInterfaceIPAddress);
		old_ip = landata.IPInterfaceIPAddress;
		$("#LanSubmask_text").val(landata.IPInterfaceSubnetMask);
		$("#LanStartAddress_text").val(landata.MinAddress.split(splitchar)[3]);
		$("#LanEndAddress_text").val(landata.MaxAddress.split(splitchar)[3]);
		$("#LanDHCP_Submask_text").val(landata.SubnetMask);
		$("#LanLeaseTime_select").val(landata.DHCPLeaseTime);
		if (landata.DHCPServerEnable == '1')
		{
			$("#Lan_DHCP_checkbox").prop("checked", true);
		}
		else
		{
			$("#Lan_DHCP_checkbox").prop("checked", false);
		}
		if (landata.DNSProxyEnable == '1')
		{
			$("#LanDNS_select").val("Proxy");
			$("#LanPri_DNS_text").val("");
			$("#LanSec_DNS_text").val("");
		}
		else
		{
			if(landata.DNSManualEnable == '1')
			{
				$("#LanDNS_select").val("Static");
				
				var dns = landata.DNSServers;
				if ( dns.indexOf(',') >= 0 )
				{
					$("#LanPri_DNS_text").val(dns.split(',')[0]);
					$("#LanSec_DNS_text").val(dns.split(',')[1]);
				}
				else
				{
					$("#LanPri_DNS_text").val(dns);
					$("#LanSec_DNS_text").val("");
				}
			}
			else
			{
				$("#LanDNS_select").val("WANDNS");
				$("#LanPri_DNS_text").val("");
				$("#LanSec_DNS_text").val("");
			}
		}
		
		
	/*	$("#LanPC_StartAddress_text").val(landata.Computer_MinAddress.split(splitchar)[3]);
		$("#LanPC_EndAddress_text").val(landata.Computer_MaxAddress.split(splitchar)[3]);
		$("#LanSTB_StartAddress_text").val(landata.STB_MinAddress.split(splitchar)[3]);
		$("#LanSTB_EndAddress_text").val(landata.STB_MaxAddress.split(splitchar)[3]);
		$("#LanPhone_StartAddress_text").val(landata.Phone_MinAddress.split(splitchar)[3]);
		$("#LanPhone_EndAddress_text").val(landata.Phone_MaxAddress.split(splitchar)[3]);
		$("#LanCamera_StartAddress_text").val(landata.Camera_MinAddress.split(splitchar)[3]);
		$("#LanCamera_EndAddress_text").val(landata.Camera_MaxAddress.split(splitchar)[3]);*/
	}
	changednssetting();
	checkDisableElement();
	changeIpHead();
}

function changednssetting()
{
	if ($("#LanDNS_select").val() == "Static")
	{
		$("#staticdns").show();
	}
	else
	{
		$("#staticdns").hide();
	}
}


function saveApply()
{
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if( ! $("#lan_ipv4_form").valid() || ! extraValidCheck())
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	if ($("#LanDNS_select").val() == "Static")
	{
		if (!isValidIpAddress($("#LanPri_DNS_text").val()) && !isNullString($("#LanPri_DNS_text").val()))
		{
			alert("primarydnsinvalid".i18n());
			return false;
		}
		if (!isNullString($("#LanSec_DNS_text").val()) && !isValidIpAddress($("#LanSec_DNS_text").val()))
		{
			alert("seconddnsinvalid".i18n());
			return false;
		}
	}
	
	var ipArray = $("#LanIP_Address_text").val().split(splitchar);
	var ip_header = ipArray[0] + '.' + ipArray[1] + '.' + ipArray[2] + '.';
	
	var postdata = new Object();
	postdata.IPInterfaceIPAddress = $("#LanIP_Address_text").val();
	postdata.IPInterfaceSubnetMask = $("#LanSubmask_text").val();
	postdata.MinAddress = ip_header + $("#LanStartAddress_text").val();
	postdata.MaxAddress = ip_header + $("#LanEndAddress_text").val();
	postdata.SubnetMask = $("#LanDHCP_Submask_text").val();
	postdata.DHCPLeaseTime = $("#LanLeaseTime_select").val();
	postdata.DHCPServerEnable = $("#Lan_DHCP_checkbox").attr("checked") ? "1" : "0";
	
	if ($("#LanDNS_select").val() == "Proxy")
	{
		postdata.DNSProxyEnable = "1";
		postdata.DNSManualEnable = "0";
	}
	else if ($("#LanDNS_select").val() == "WANDNS")
	{
		postdata.DNSProxyEnable = "0";
		postdata.DNSManualEnable = "0";
	}
	else if ($("#LanDNS_select").val() == "Static")
	{
		postdata.DNSProxyEnable = "0";
		postdata.DNSManualEnable = "1";
		
		if ( $("#LanSec_DNS_text").val() == '' )
		{
			postdata.DNSServers = $("#LanPri_DNS_text").val();
		}
		else
		{
			postdata.DNSServers = $("#LanPri_DNS_text").val() + ',' + $("#LanSec_DNS_text").val();
		}
	}
	
/*	postdata.LanPCEnable = "1";
	postdata.LanSTBEnable = "1";
	postdata.LanPhoneEnable = "1";
	postdata.LanCameraEnable = "1";
	postdata.Computer_MinAddress = ip_header + $("#LanPC_StartAddress_text").val();
	postdata.Computer_MaxAddress = ip_header + $("#LanPC_EndAddress_text").val();
	postdata.STB_MinAddress = ip_header + $("#LanSTB_StartAddress_text").val();
	postdata.STB_MaxAddress = ip_header + $("#LanSTB_EndAddress_text").val();
	postdata.Phone_MinAddress = ip_header + $("#LanPhone_StartAddress_text").val();
	postdata.Phone_MaxAddress = ip_header + $("#LanPhone_EndAddress_text").val();
	postdata.Camera_MinAddress = ip_header + $("#LanCamera_StartAddress_text").val();
	postdata.Camera_MaxAddress = ip_header + $("#LanCamera_EndAddress_text").val();*/
	
	
	if ( $("#LanIP_Address_text").val() !=  old_ip )
	{
		postdata.ipchange = 1;
		
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		//填充内容
		$("#pop_window_title", parentObj).html("configmodifyconfirm".i18n());
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_help"></div>');
		$("#pop_window_message", parentObj).html("ipmodifyconfirm".i18n());
		
		//更改确认操作函数
		var eid = parentObj.getElementById("confirm");
		eid.onclick = function(){
			$("#pop_window_title", parentObj).html("configmodifyalert".i18n());
			$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
			$("#pop_window_message", parentObj).html("succandloginnewipaddr".i18n());
			$("#pop_window_option", parentObj).hide();
			XHR.get("get_operator", null, function(data){
				if ( data )
				{
					tokenstr = data.token;
				}
			});
			postdata.token = tokenstr;
			jumpToLoginPageNewIP($("#LanIP_Address_text").val());
			XHR.post("set_ipv4_lan", postdata, null);
		};
		
		showOrHidePopWindowFromIframe("show");
	}
	else
	{
		postdata.ipchange = 0;
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("set_ipv4_lan", postdata, reloadSaveData);
		showOrHideLoadingWindowFromIframe("show");
	}
}

function jumpToLoginPageNewIP(newip)
{
	var interval = window.setInterval(function() {
		var img = new Image();

		img.onload = function() {
			window.clearInterval(interval);
			window.parent.location = ('https:' == document.location.protocol ? 'https://' : 'http://') + newip + (document.location.port == '' ? '' : ':') + document.location.port;
		};

		img.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + newip + (document.location.port == '' ? '' : ':') + document.location.port + "/image/loading.gif?" + Math.random();
	}, 10000);
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

function extraValidCheck()
{
	var error_num = 0;
	
	var MinAddress = $("#LanStartAddress_text").val();
	var MaxAddress = $("#LanEndAddress_text").val();
	var SubnetMask = $("#LanDHCP_Submask_text").val();
	/*var pcMin = $("#LanPC_StartAddress_text").val();
	var pcMax = $("#LanPC_EndAddress_text").val();
	var stbMin = $("#LanSTB_StartAddress_text").val();
	var stbMax = $("#LanSTB_EndAddress_text").val();
	var phoneMin = $("#LanPhone_StartAddress_text").val();
	var phoneMax = $("#LanPhone_EndAddress_text").val();
	var cameraMin = $("#LanCamera_StartAddress_text").val();
	var cameraMax = $("#LanCamera_EndAddress_text").val();*/
	
	if ( ! isValidNumberRange(MinAddress, 1, 255) )
	{
		$("#LanStartAddress-error").html("startaddrinvalid".i18n());
		error_num ++;
	}
	if ( ! isValidNumberRange(MaxAddress, 1, 255) )
	{
		$("#LanEndAddress-error").html("endaddrinvalid".i18n());
		error_num ++;
	}
	
	/*if ( ! isValidNumberRange(pcMin, 1, 255) )
	{
		$("#LanPC-error").html(error_hint_start_invalid);
		error_num ++;
	}
	if ( ! isValidNumberRange(pcMax, 1, 255) )
	{
		$("#LanPC-error").html(error_hint_end_invalid);
		error_num ++;
	}
	
	if ( ! isValidNumberRange(stbMin, 1, 255) )
	{
		$("#LanSTB-error").html(error_hint_start_invalid);
		error_num ++;
	}
	if ( ! isValidNumberRange(stbMax, 1, 255) )
	{
		$("#LanSTB-error").html(error_hint_end_invalid);
		error_num ++;
	}

	if ( ! isValidNumberRange(phoneMin, 1, 255) )
	{
		$("#LanPhone-error").html(error_hint_start_invalid);
		error_num ++;
	}
	if ( ! isValidNumberRange(phoneMax, 1, 255) )
	{
		$("#LanPhone-error").html(error_hint_end_invalid);
		error_num ++;
	}
	
	if ( ! isValidNumberRange(cameraMin, 1, 255) )
	{
		$("#LanCamera-error").html(error_hint_start_invalid);
		error_num ++;
	}
	if ( ! isValidNumberRange(cameraMax, 1, 255) )
	{
		$("#LanCamera-error").html(error_hint_end_invalid);
		error_num ++;
	}*/
		
	if ( error_num > 0 )
	{
		return false;
	}
	
	//检查是否是有效的地址范围
	if ( parseInt(MinAddress) > parseInt(MaxAddress) )
	{
		$("#LanStartAddress-error").html("startlessthanorequaltoend".i18n());
		error_num ++;
	}
	
	if ( MinAddress == $("#LanIP_Address_text").val().split(splitchar)[3] )
	{
		$("#LanStartAddress-error").html("notsameasip".i18n());
		error_num ++;
	}
	if ( MaxAddress == $("#LanIP_Address_text").val().split(splitchar)[3] )
	{
		$("#LanEndAddress-error").html("notsameasip".i18n());
		error_num ++;
	}
	
	/*if ( parseInt(pcMin) > parseInt(pcMax) )
	{
		$("#LanPC-error").html(error_hint_start_end);
		error_num ++;
	}
	
	if ( parseInt(stbMin) > parseInt(stbMax) )
	{
		$("#LanSTB-error").html(error_hint_start_end);
		error_num ++;
	}
	
	if ( parseInt(phoneMin) > parseInt(phoneMax) )
	{
		$("#LanPhone-error").html(error_hint_start_end);
		error_num ++;
	}
	
	if ( parseInt(cameraMin) > parseInt(cameraMax) )
	{
		$("#LanCamera-error").html(error_hint_start_end);
		error_num ++;
	}
	
	if ( parseInt(pcMin) < parseInt(MinAddress) || parseInt(pcMax) > parseInt(MaxAddress) )
	{
		$("#LanPC-error").html(error_hint_range);
		error_num ++;
	}
	
	if ( parseInt(stbMin) < parseInt(MinAddress) || parseInt(stbMax) > parseInt(MaxAddress) )
	{
		$("#LanSTB-error").html(error_hint_range);
		error_num ++;
	}
	
	if ( parseInt(phoneMin) < parseInt(MinAddress) || parseInt(phoneMax) > parseInt(MaxAddress) )
	{
		$("#LanPhone-error").html(error_hint_range);
		error_num ++;
	}
	
	if ( parseInt(cameraMin) < parseInt(MinAddress) || parseInt(cameraMax) > parseInt(MaxAddress) )
	{
		$("#LanCamera-error").html(error_hint_range);
		error_num ++;
	}*/
	
	if ( error_num > 0 )
	{
		return false;
	}
	
	return true;
}

function checkDisableElement()
{
	if  ($("#Lan_DHCP_checkbox").attr("checked"))
	{
		$(".dhcp_set").attr("disabled", false);
	}
	else
	{
		$(".dhcp_set").attr("disabled", true);
	}
}

function changeIpHead()
{
	var lanip = $("#LanIP_Address_text").val();
	if ( isValidIpAddress(lanip) )
	{
		var ipArray = lanip.split('.');
		$(".network_segment").each(function(){
			$(this).html(ipArray[0] + '.' + ipArray[1] + '.' + ipArray[2] + '.');
		});
	}
}
