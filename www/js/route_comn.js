var tokenstr = "";
var wan_data = '';
var splitchar = '_';
var route_v4_str = '';
var deleteNum = 0;  
var maxRecordIndex = 1;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	//initValidate();
	
	/* $("#Interface_select").bind("change", function(){
		changeInterface();
	}); */
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/static_route", initPage);
	}
	else
	{
		XHR.get("get_static_route", null, initPage);
	}
});

function initValidate()
{
	$("#route_form").validate({
		debug: true,
		rules: {
			"DestIPAddress_text": {required: true, ipv4:true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate port mapping ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate port mapping failed.....");
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
	
	var routeListHTML = '', recordIndex = 1;
	var showlistnum = 0;
	if (getdata != null && (getdata.route_v4))
	{
		wan_data = getdata.route_v4.wan;
		routedata = getdata.route_v4.routing;
		//routedatav6 = getdata.route_v6.routing;
		
		if(getdata.route_v4.routing != null && getdata.route_v4.routing != "" )
		{
			for (var i=0; i<routedata.length; i++)
			{
				var routeParams = routedata[i];
				var InterfaceName = '';
				recordIndex++;
				showlistnum = showlistnum + 1;
				if (showlistnum%2 == 1)
				{
					routeListHTML += '<tr class="oddtr">';
				}
				else
				{
					routeListHTML += '<tr class="eventr">';
				}
				
				routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_1_table">IPv4</td>';
				if ('NULL' == routeParams.DestIPAddress)
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_2_table">&nbsp;</td>';
				}
				else
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_2_table">' + routeParams.DestIPAddress + '';
					if ('NULL' != routeParams.DestSubnetMask)
					{
						routeListHTML += '/' + routeParams.DestSubnetMask + '';
					}
					routeListHTML += '</td>';
				}
				if ('NULL' != routeParams.GatewayIPAddress)
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_3_table">' + routeParams.GatewayIPAddress + '</td>';
				}
				else
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_3_table">&nbsp;</td>';
				}
				
				for ( var j=0; j<wan_data.length; j++ )
				{
					var single = wan_data[j];
					if(!jQuery.isEmptyObject(wan_data[j]) && single.interface_name == routeParams.Interface)
					{
						InterfaceName = single.Name;
					}		
				}
				routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_4_table">' +InterfaceName + '</td>';
				routeListHTML += '<td><input type="button" class="input_button_small" value="'+ "delete".i18n() +'" id="StaticRouteInfo_' + recordIndex + '_5_table" onclick="deleteRoute(this.name)" name="SelectforDel_IPv4_' + routeParams.routeIndex + '"></td>';
				routeListHTML += '</tr>';
			}
		}
		/* if(getdata.route_v6.routing != null && getdata.route_v6.routing != "" )
		{
			for (var j=0; j<routedatav6.length; j++)
			{
				var routev6Params = routedatav6[j];

				recordIndex++;
				
				showlistnum = showlistnum + 1;
				if (showlistnum%2 == 1)
				{
					routeListHTML += '<tr class="oddtr">';
				}
				else
				{
					routeListHTML += '<tr class="eventr">';
				}
				
				routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_1_table">IPv6</td>';
				if ('NULL' == routev6Params.DestIPPrefix)
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_2_table">&nbsp;</td>';
				}
				else
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_2_table">' + routev6Params.DestIPPrefix + '';
					routeListHTML += '</td>';
				}
				if ('NULL' != routev6Params.GatewayIPAddress)
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_3_table">' + routev6Params.GatewayIPAddress + '</td>';
				}
				else
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_3_table">&nbsp;</td>';
				}
				
				for ( var k=0; k<wan_data.length; k++ )
				{
					var single = wan_data[k];
					if(!jQuery.isEmptyObject(wan_data[k]) && single.interface_name == routev6Params.Interface)
					{
						InterfaceName = single.Name;
					}		
				}
				routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_4_table">' +InterfaceName + '</td>';
				routeListHTML += '<td><input type="button" class="input_button_small" value="'+ "delete".i18n() +'" id="StaticRouteInfo_' + recordIndex + '_5_table" onclick="deleteRoute(this.name)" name="SelectforDel_IPv6_' + routev6Params.routeIndex + '"></td>';
				routeListHTML += '</tr>';
			}
		} */
		maxRecordIndex = recordIndex;
		
		if (routeListHTML == 0)
		{
			routeListHTML += '<tr><td colspan="5" align="center">' + "nodata".i18n() + '</td></td>';
		}
		
		$("#routeList").html(routeListHTML);
		initWanName();
		changeInterface();
		$("#DestIPAddress_text").val('');
		$("#DestSubnetMask_text").val('');
		$("#GatewayIPAddress_text").val('');
	}
}

function initWanName()
{
	var dynamicHTML = '';
	if ( wan_data.length >0 )
	{
		for ( i=0; i<wan_data.length; i++ )
		{
			var single = wan_data[i];
			
			if(single.wan_index == 3 && single.wan_session_index == 1 && single.Name == "THSi")//true custom wan, cannot show
			{
				continue;
			}
			
			if(!jQuery.isEmptyObject(wan_data[i]))
			{
				if (single.IPMode == '1' || single.IPMode == '3')
				{
					dynamicHTML += '<option value="' + single.interface_name+ '">' + single.Name + '</option>';
				}
			}
		}
	}
	$("#Interface_select").html(dynamicHTML);
	if ( $("#Interface_select option").size() == 0 )
	{
		$("#RouteApply_button").addClass("input_button_disabled");
		$("#RouteApply_button").attr("disabled", true);
	}
	else
	{
		$("#RouteApply_button").removeClass("input_button_disabled");
		$("#RouteApply_button").attr("disabled", false);
	}
}

function changeInterface()
{
	//var selectedwanvalue = $("#Interface_select").val();
	var dynamicHTML = '';
	/* if ( wan_data.length >0 )
	{
		for (var i=0; i<wan_data.length; i++ )
		{
			var single = wan_data[i];
			if(!jQuery.isEmptyObject(wan_data[i]))
			{
				if (selectedwanvalue == single.interface_name)
				{ 
					if (single.IPMode == '1')
					{ */
						dynamicHTML = '<option value="1">IPv4</option>';
					/*}
					else if (single.IPMode == '2')
					{
						dynamicHTML = '<option value="2">IPv6</option>';
					}
					else
					{
						dynamicHTML = '<option value="1">IPv4</option><option value="2">IPv6</option>';
					} */
					$("#IpVersion_select").html(dynamicHTML);
				//}
			//}	
		//}	
	//}
}

function deleteRoute(elementName)
{
	var postdata = new Object();
	postdata.action = "delete";
	
	var ipversion = 1;
	var routeIndex = -1;
	if (0 == elementName.indexOf('SelectforDel_IPv4_'))
	{
		routeIndex = parseInt(elementName.replace(/SelectforDel_IPv4_/g, ''));
		ipversion = 1;
	}
	else if (0 == elementName.indexOf('SelectforDel_IPv6_'))
	{
		routeIndex = parseInt(elementName.replace(/SelectforDel_IPv6_/g, ''));
		ipversion = 2;
	}
	
	postdata.version = ipversion;
	postdata.routeIndex = routeIndex;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_static_route", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function checkAddRouteFields()
{
	var dest = $("#DestIPAddress_text").val(), mask = $("#DestSubnetMask_text").val(), gateway = $("#GatewayIPAddress_text").val();
	
	if ( isNullString(dest) && isNullString(gateway))
	{
		alert("dipaddrgwaddrcannotempty".i18n());
		return false;
		
	}
	if ($("#IpVersion_select").val() == 2) //IPv6
	{
		if (!isNullString(dest) && !isValidIpv6Address(dest))
		{
			alert("invaliddipaddr".i18n());
			return false;
		}
		if (!isNullString(mask) && !isValidPrefixLength(mask))
		{
			alert("invalidprefixlength".i18n());
			return false;
		}
		if (!isNullString(gateway) && !isValidIpv6Address(gateway))
		{
			alert("invalidgwaddr".i18n());
			return false;
		}
	}
	else
	{
		if (!isNullString(dest) && !isValidIpAddress(dest))
		{
			alert("invaliddipaddr".i18n());
			return false;
		}
		if (!isNullString(mask) && !isValidSubnetMask(mask))
		{
			alert("invalidsubnetmask".i18n());
			return false;
		}
		if (!isNullString(gateway) && !isValidIpAddress(gateway))
		{
			alert("invalidgwaddr".i18n());
			return false;
		}
	}
	return true;
}

function addStaticRoute()
{
	var test = checkAddRouteFields();
	
	if (test)
	{
		var postdata = new Object();
		postdata.action = "add";
		postdata.version = $("#IpVersion_select").val();
		if ( $("#Interface_select option").size() > 0 )
		{
			postdata.Enable = 1;
			postdata.DestIPAddress = $("#DestIPAddress_text").val();//ipv6对应prefix
			postdata.DestSubnetMask = $("#DestSubnetMask_text").val();//ipv6对应len
			//ipv6时，len与prefix组合成目的ip前缀，格式为prefix/len
			postdata.GatewayIPAddress = $("#GatewayIPAddress_text").val();//ipv6对应下一跳地址
			postdata.Interface = $("#Interface_select").val();
		}
		else
		{
			return;
		}
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("set_static_route", postdata, initPage);
		showOrHideLoadingWindowFromIframe("show");
	}
}

