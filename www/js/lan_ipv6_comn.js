var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");

	$("#LanDHCPv6_checkbox").bind("click", function(){
		displayControl();
	});
	$("select").bind("change", function(){
		displayControl();
	});
	
	//清除错误提示
	$(".main_item_error_hint").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipv6_lan_info", initPage);
	}
	else
	{
		XHR.get("get_ipv6_lan", null, initPage);
	}
});

function initValidate()
{
	$("#lan_ipv6_form").validate({
		debug: true,
		rules: {
			"LanPri_DNS_text": {required: true, ipv6:true},
			"LanSec_DNS_text": {required: true, ipv6:true},
			"LanStartAddress_text": {required: true},
			"LanEndAddress_text": {required: true}, //isValidIPv6AddressRange
			"LanPrefix_text": {required: true}, //isValidIPv6AddressRange ipv6prefix
			"LanMaxRA_text": {required: true, range_int:[4,1800]},
			"LanMinRA_text": {required: true, range_int:[4,1800]} //max bigger than min
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
	if ( getdata != null && getdata.lan_ipv6 )
	{
		var data = getdata.lan_ipv6;
		$("#LanDNS_select").val(data.IPv6DNSConfigType);
		
		var dns = data.IPv6DNSServers;
		if ( dns.indexOf(',') >= 0 )
		{
			$("#LanPri_DNS_text").val(dns.split(',')[0]);
			$("#LanSec_DNS_text").val(dns.split(',')[1]);
		}
		else
		{
			$("#LanPri_DNS_text").val(dns);
			$("#LanSec_DNS_text").val('');
		}
		setCheckbox("LanDHCPv6_checkbox", data.DHCPv6ServerEnable);
		$("#LanStartAddress_text").val(data.DHCPv6ServerMinAddress);
		$("#LanEndAddress_text").val(data.DHCPv6ServerMaxAddress);
		$("#PreferredLifeTime_select").val(data.PreferredLifeTime);
		$("#ValidLifeTime_select").val(data.ValidLifeTime);
		$("#LanPrefix_select").val(data.PIMODE);
		$("#LanPrefix_text").val(data.PIPrefix);
		setCheckbox("LanAddressInfo_checkbox", data.RAAdvManagedFlag);
		setCheckbox("LanOtherInfo_checkbox", data.RAAdvOtherConfigFlag);
		$("#LanMaxRA_text").val(data.RAMaxRtrAdvInterval);
		$("#LanMinRA_text").val(data.RAMinRtrAdvInterval);
	}
	displayControl();
}

function saveApply()
{
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if( ! $("#lan_ipv6_form").valid() || ! extraValidCheck())
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	var postdata = new Object();
	
	postdata.IPv6DNSConfigType = $("#LanDNS_select").val();
	if ( $("#LanDNS_select").val() == "Static" )
	{
		if ( $("#LanSec_DNS_text").val() == '' )
		{
			postdata.IPv6DNSServers = $("#LanPri_DNS_text").val();
		}
		else
		{
			postdata.IPv6DNSServers = $("#LanPri_DNS_text").val() + ',' + $("#LanSec_DNS_text").val();
		}
	}
	
	
	postdata.DHCPv6ServerEnable = getCheckbox("LanDHCPv6_checkbox");
	if ( postdata.DHCPv6ServerEnable == 1 )
	{
		postdata.DHCPv6ServerMinAddress = $("#LanStartAddress_text").val();
		postdata.DHCPv6ServerMaxAddress = $("#LanEndAddress_text").val();
		postdata.PreferredLifeTime = $("#PreferredLifeTime_select").val();
		postdata.ValidLifeTime = $("#ValidLifeTime_select").val();
	}
	
	postdata.PIMODE = $("#LanPrefix_select").val();
	if ( $("#LanPrefix_select").val() == "Static" )
	{
		postdata.PIPrefix = $("#LanPrefix_text").val();
	}
	
	postdata.RAAdvManagedFlag = getCheckbox("LanAddressInfo_checkbox");
	postdata.RAAdvOtherConfigFlag = getCheckbox("LanOtherInfo_checkbox");
	postdata.RAMaxRtrAdvInterval = $("#LanMaxRA_text").val();
	postdata.RAMinRtrAdvInterval = $("#LanMinRA_text").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_ipv6_lan", postdata, reloadSaveData);
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

function extraValidCheck()
{
	var error_num = 0;
	
	if ( $("#LanStartAddress_text").is(":visible") && ! isValidIPv6AddressRange($("#LanStartAddress_text").val(), $("#LanEndAddress_text").val()) )
	{
		error_num ++;
		$("#address-error").html("invalidstartandendaddrinterval".i18n());
	}
	if ( $("#LanStartAddress_text").is(":visible") && (special_char_check($("#LanStartAddress_text").val()) == true || special_char_check($("#LanEndAddress_text").val()) == true) )
	{
		alert("specialcharcheck".i18n());
		return false;
	}
	if ( $("#LanPrefix_text").is(":visible") && ! isValidIpv6PrefixAddress($("#LanPrefix_text").val()) )
	{
		error_num ++;
		$("#prefix-error").html("invalidprefix".i18n());
	}
	
	if ( parseInt($("#LanMaxRA_text").val()) < parseInt($("#LanMinRA_text").val()) )
	{
		error_num ++;
		$("#RA-error").html("cannotbegreaterthanmaxtime".i18n());
	}
	
	if ( parseInt($("#PreferredLifeTime_select").val()) > parseInt($("#ValidLifeTime_select").val()) )
	{
		error_num ++;
		$("#lifetime-error").html("cannotbegreaterthanvalidlifetime".i18n());
	}
	
	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}

function displayControl()
{
	if ( $("#LanDNS_select").val() == "Static" )
	{
		$(".v6dns").show();
	}
	else
	{
		$(".v6dns").hide();
	}
	
	if ( getCheckbox("LanDHCPv6_checkbox") == 1 )
	{
		$(".v6address").show();
	}
	else
	{
		$(".v6address").hide();
	}
	
	if ( $("#LanPrefix_select").val() == "Static" )
	{
		$(".v6prefix").show();
	}
	else
	{
		$(".v6prefix").hide();
	}
}
