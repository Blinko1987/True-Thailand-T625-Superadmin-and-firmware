var tokenstr = "";
var dhcpaddr_data;
var addindex = '';

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/dhcpaddr_reserve", initPage);
	}
	else
	{
		XHR.get("get_dhcpaddr_reserve_info", null, initPage);
	}
});


function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.dhcpaddr)
	{
		dhcpaddr_data = getdata.dhcpaddr;
		$("#maxnum").html(dhcpaddr_data.maxnum);
		
		//dhcpaddr list
		var dynamicHTML = '';
		addindex = '';
		var j = 0;
		for (var i=1; i<=dhcpaddr_data.maxnum; i++ )
		{
			if ( eval("dhcpaddr_data.macaddr" + i) )
			{
				j++;
				if(j%2 == 1)
				{
					dynamicHTML += '<tr class="oddtr">';
				}
				else
				{
					dynamicHTML += '<tr>';
				}
				
				dynamicHTML += '<td>' + eval(j) + '</td>';
				dynamicHTML += '<td>' + eval("dhcpaddr_data.macaddr" + i) + '</td>';
				dynamicHTML += '<td>' + eval("dhcpaddr_data.ipaddr" + i) + '</td>';
				dynamicHTML += '<td><input type="button" class="input_button_small input_button_heightwidth_unset" id="delete_' + i + '" onclick="doDelete(this.id)" value="'+ "delete".i18n() +'"></td>';
				dynamicHTML += '</tr>';
			}
			else
			{
				if ( addindex == '' )
				{
					addindex = i;
				}
			}
		}
		if (j == 0)
		{
			dynamicHTML += '<tr><td colspan="4" align="center">' + "nodata".i18n() + '</td></td>';
		}
		
		$("#dhcpaddr_list").html(dynamicHTML);
	}
	$("#add_mac_text").val('');
	$("#add_ip_text").val('');
	displayControl();
}

function doDelete(eid)
{
	var index = eid.split('_')[1];
	
	var postdata = new Object();
	postdata.action = "delete";
	postdata.index = index;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_dhcpaddr_reserve_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function doAdd()
{
	if( ! extraValidCheck() )
	{
		return;
	}
	
	var postdata = new Object();
	postdata.action = "add";
	postdata.macaddr = $("#add_mac_text").val();
	postdata.ipaddr = $("#add_ip_text").val();
	
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_dhcpaddr_reserve_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function extraValidCheck()
{
	var error_num = 0;
	if ( $("#add_mac_text").val() == '' )
	{
		error_num ++;
		alert("macaddrmustinput".i18n());
	}
	else
	{
		for (var i=1; i<=dhcpaddr_data.maxnum; i++ )
		{
			var single = eval("dhcpaddr_data.macaddr" + i);
			if (single != undefined)
			{
				if ( $("#add_mac_text").val().toUpperCase() ==  single.toUpperCase() )
				{
					error_num ++;
					alert("macaddralreadyexist".i18n());
				}
			}
		}
		
		if ( ! isValidMacAddress($("#add_mac_text").val()) )
		{
			error_num ++;
			alert("macaddrcheck".i18n());
		}
	}
	
	if ( $("#add_ip_text").val() == '' )
	{
		error_num ++;
		alert("ipaddrmustinput".i18n());
	}
	else
	{
		for (var i=1; i<=dhcpaddr_data.maxnum; i++ )
		{
			var single = eval("dhcpaddr_data.ipaddr" + i);
			if ( $("#add_ip_text").val() ==  single )
			{
				error_num ++;
				alert("ipaddrinvalid".i18n());
			}
		}
		
		var add_ip_text = $("#add_ip_text").val();
		
		if (!isValidIpAddress($("#add_ip_text").val()) && !isValidIpv6Address($("#add_ip_text").val()))
		{
			error_num ++;
			alert("ipaddrinvalid".i18n());
		}
	}
	
	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}


function displayControl()
{
	if ( addindex == '' )
	{
		$("#add_div").hide();
	}
	else
	{
		$("#add_div").show();
	}
}


