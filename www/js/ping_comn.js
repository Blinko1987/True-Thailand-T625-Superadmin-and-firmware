var tokenstr = "";
var all_wan_info;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	$("#wan_connect").bind("change", function(){
		displayControl();
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wan_info", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initPage);
	}
});

function initValidate()
{
	$("#ping_form").validate({
		debug: true,
		rules: {
			"address": {required: true, nocn: true},
			"count": {required: true , range_int:[1,10]}
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


function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( getdata )
	{
		all_wan_info = getdata;
	}
	
	var wan_num = 0;
	var dynamicHtml = '';

	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}
	if ( wan_num > 0 )
	{
		for ( i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];
			
			if(single_wan.wan_index == 3 && single_wan.wan_session_index == 1 && single_wan.Name == "THSi")//true custom wan, cannot show
			{
				continue;
			}
			
			if ( single_wan.Name.indexOf('_R_') >= 0 )
			{
				dynamicHtml += '<option value="' + single_wan.wan_index + '_' + single_wan.wan_session_index + '_' + single_wan.IPMode + '">' + single_wan.Name + '</option>';
			}
		}
	}
	$("#wan_connect").html(dynamicHtml);
	
	displayControl();
}

function displayControl()
{
	if ( $("#wan_connect option").size() > 0 )
	{
		var select_wan_ip_version = $("#wan_connect").val().split("_")[2];
		var dynamicHtml = '';
		if ( select_wan_ip_version == 1 || select_wan_ip_version == 3 )
		{
			dynamicHtml += "<option value='4'>IPv4</option>"; 
		}
		if ( select_wan_ip_version == 2 || select_wan_ip_version == 3 )
		{
			dynamicHtml += "<option value='6'>IPv6</option>"; 
		}
		$("#ip_version").html(dynamicHtml);
		
		$(".main_save").show();
	}
	else
	{
		$(".main_save").hide();
	}
}

function isValidURL(ipAddress)
{
    var urlPat=/^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/i;
    var matchArray=ipAddress.match(urlPat);
    if( matchArray != null )
    {
        return true;
    } 
    else 
    {
        return false;
    } 
}

function saveApply()
{
	if( ! $("#ping_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	if ( $("#ip_version").val() == 4 && false == isValidIpAddress($("#address").val()) && false == isValidURL($("#address").val()))
	{
		alert("ipv4invalidretry".i18n());
		return;
	}
	else if ( $("#ip_version").val() == 6 && false == isValidIpAddress6($("#address").val()) && false == isValidURL($("#address").val()))
	{
		alert("ipv6invalidretry".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.address = $("#address").val();
	postdata.count = $("#count").val();
	postdata.ipversion = $("#ip_version").val();
	
	var select_wan_info = getSingleWanInfo($("#wan_connect").val());
	
	var selectname = select_wan_info.Name.toUpperCase();
	if ( selectname.indexOf("INTERNET") >=0 )
	{
		postdata.wantype = 2;
	}
	else if ( selectname.indexOf("VOIP") >=0 || selectname.indexOf("VOICE") >=0 )
	{
		postdata.wantype = 1;
	}
	else if ( selectname.indexOf("TR069") >=0 )
	{
		postdata.wantype = 0;
	}
	else
	{
		postdata.wantype = 2;
	}
	
	if ( $("#ip_version").val() == 4 )
	{
		/* if ( select_wan_info.ConnectionStatus == "Connected" )
		{
			postdata.iface_ip = select_wan_info.ExternalIPAddress;
		}
		else
		{ */
			if ( select_wan_info.vlanid > 0 )
			{
				postdata.iface_ip = select_wan_info.X_PT_IfName;
			}
			else
			{
				postdata.iface_ip = select_wan_info.X_PT_IfName;
			}
		//}
	}
	else if ( $("#ip_version").val() == 6 )
	{
        // hardy-,2018-10-8, when in IPv6, do not use IP Address, just use interface name.
        /*
		if ( select_wan_info.IPv6ConnStatus == "Connected" )
		{
			postdata.iface_ip = select_wan_info.IPv6IPAddress;
		}
		else
		{
        */
			if ( select_wan_info.vlanid > 0 )
			{
				postdata.iface_ip = select_wan_info.X_PT_IfName;
			}
			else
			{
				postdata.iface_ip = select_wan_info.X_PT_IfName;
			}
		//}
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("do_ping", postdata, showPingResult);
	showOrHideLoadingWindowFromIframe("show");
}

function showPingResult(data)
{
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	var dynamicHtml = data.result.split('\n').join('<br/>');
	$("#result").html(dynamicHtml);
}

function getSingleWanInfo(selectwan_index)
{
	var select_wan_index = selectwan_index.split('_')[0];
	var select_wan_session_index = selectwan_index.split('_')[1];
	var wan_num = all_wan_info.wan.length;
	var select_wan_info = '';
	
	if ( wan_num > 0 )
	{
		for ( i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];
			if ( single_wan.wan_index == select_wan_index 
				&& single_wan.wan_session_index == select_wan_session_index )
				{
					select_wan_info = single_wan;
					break;
				}
		}
	}
	
	return select_wan_info;
}
