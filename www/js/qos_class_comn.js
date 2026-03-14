var tokenstr = "";
var typeHTML = "<option value=''>&nbsp;</option>";
typeHTML += "<option value='SMAC'>"+ "smacaddr".i18n() +"</option>";
typeHTML += "<option value='8021P'>8021P</option>";
typeHTML += "<option value='SIP'>"+ "sipaddr".i18n() +"</option>";
typeHTML += "<option value='DIP'>"+ "dipaddr".i18n() +"</option>";
typeHTML += "<option value='SPORT'>"+ "sport".i18n() +"</option>";
typeHTML += "<option value='DPORT'>"+ "dport".i18n() +"</option>";
typeHTML += "<option value='TOS'>TOS</option>";
typeHTML += "<option value='DSCP'>DSCP</option>";
typeHTML += "<option value='WANInterface'>"+ "networkconn".i18n() +"</option>";
typeHTML += "<option value='LANInterface'>"+ "laninterface".i18n() +"</option>";
typeHTML += "<option value='TC'>TC</option>";
typeHTML += "<option value='FL'>FL</option>";

var protocolListHTML = "<option value='NULL'>&nbsp;</option>";
protocolListHTML += "<option value='TCP'>TCP</option>";
protocolListHTML += "<option value='UDP'>UDP</option>";
protocolListHTML += "<option value='ICMP'>ICMP</option>";
protocolListHTML += "<option value='TCP,UDP' >TCP,UDP</option>";
protocolListHTML += "<option value='TCP,ICMP'>TCP,ICMP</option>";
protocolListHTML += "<option value='ICMP,UDP'>ICMP,UDP</option>";
protocolListHTML += "<option value='TCP,UDP,ICMP'>TCP,UDP,ICMP</option>";

//todo, judge lan port num and wifi port num
var laninterfaceListHTML = "<option value='" + gLanPortHead + "1'>LAN1</option>";
laninterfaceListHTML += "<option value='" + gLanPortHead + "2'>LAN2</option>";
laninterfaceListHTML += "<option value='" + gLanPortHead + "3'>LAN3</option>";
laninterfaceListHTML += "<option value='" + gLanPortHead + "4'>LAN4</option>";
/*laninterfaceListHTML += "<option value='" + gWifiPortHead + "1'>SSID1</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "2'>SSID2</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "3'>SSID3</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "4'>SSID4</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "5'>SSID5</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "6'>SSID6</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "7'>SSID7</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "7'>SSID8</option>";*/

var qosdata = '';
var addindex = '';
var queue_num = 8;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	$(".type_select").each(function(){
		// ptweblog(this.id);
		$(this).html(typeHTML);
	});
	
	if(gDebug)
	{
		getDataByAjax("../fake/vlanbind", constructlaninterfaceListHtml);
	}else{
		XHR.get("vlanbind", null, constructlaninterfaceListHtml);
	}
	
	$(".laninterface_select").each(function(){
		$(this).html(laninterfaceListHTML);
	});
	
	XHR.get("get_allwan_info", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
		var all_wan_info = '';
		if ( getdata != null )
		{
			all_wan_info = getdata;
			
			var wan_num = 0;
			var dynamicHtml = '';
			if ( all_wan_info != '' && all_wan_info.wan )
			{
				wan_num = all_wan_info.wan.length;
			}
			if ( wan_num > 0 )
			{
				for ( var i=0; i< wan_num; i++ )
				{
					var single_wan = all_wan_info.wan[i];
					
					var iporppptype;
					
					if (single_wan.iporppp == 1)
					{
						iporppptype = "WANIPConnection";
					}
					else
					{
						iporppptype = "WANPPPConnection";
					}
					
					dynamicHtml += '<option value="InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.' + iporppptype + '.' + single_wan.wan_session_index +'">' + single_wan.Name + '</option>';
				}
			}
			$(".waninterface_select").each(function(){
				$(this).html(dynamicHtml);
			});
		}	
	});	
	
	$(".type_select").bind("change", function(){
		displayControl();
		protocolListControl(this);
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/qos_class", initPage);
	}
	else
	{
		XHR.get("get_qos_class", null, initPage);
	}
});


function initValidate()
{
	$("#qos_form").validate({
		debug: true,
		rules: {
			"ClassQueue": {required: true},
			"DSCPMarkValue": {required: true, range_int:[0,63]},
			"P8021Value": {required: true, range_int:[0,7]},
			"Min1": {required: true},
			"Max1": {required: true},
			"Min2": {required: true},
			"Max2": {required: true},
			"Min3": {required: true},
			"Max3": {required: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate qos ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate qos failed.....");
			return false;
		}
	}); 
}

//Construct  Wifi Port Html
function constructlaninterfaceListHtml(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	if(data.success != 'true')
	{
		alert("get wifi port failed!");	
		return false;
	}
	
	var i = 0;
	for (i=0; i<8; i++)
	{
		var singlewlanvlanbind = data.wlanVlanBindList[i];
		if(eval("singlewlanvlanbind.ssid" + eval(i+1)) == 1)//wifi 实例存在
		{
			laninterfaceListHTML += '<option value="' + gWifiPortHead + eval(i+1) + '">SSID' + eval(i+1) + '</option>';
		}
		continue;
	}
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
	
	// 清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	// 重置添加选项
	resetAddOption();
	
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata && getdata.qos)
	{
		qosdata = getdata.qos;
		$("#class_type_num").html(qosdata.class_type_num);
		$("#class_num").html(qosdata.class_num);
		
		var dynamicHTMLQUEUE = '';
		
		for (var i=1; i<=queue_num; i++ )
		{
			if ( eval("qosdata.Q" + i) == 1)
			{
				dynamicHTMLQUEUE += '<option value="'+ eval(i) +'">Q'+ eval(i) +'</option>';
			}
		}
		$("#ClassQueue").html(dynamicHTMLQUEUE);
		
		addindex = ''; //init addindex
		
		var dynamicHTML = '';
		var k = 0;
		for (var i=1; i<= qosdata.class_num; i++ )
		{
			if ( eval("qosdata.ClassQueue" + i) != '' && eval("qosdata.ClassQueue" + i) != 0 )
			{
				var dynamicTypeHTML = '';
				var typecount = 0;
				for ( var j=1; j<= qosdata.class_type_num; j++ )
				{
					if ( eval("qosdata.type" + i + "Type" + j) != '' && eval("qosdata.type" + i + "Type" + j) != undefined)
					{
						typecount ++;
					}
				}
				if ( typecount > 0 )
				{
					k = k + 1;
					
					if (k%2 == 1)
					{
						var trclass = "oddtr";
					}
					else
					{
						var trclass = "eventr";
					}
				
					dynamicHTML += '<tr class="'+ trclass +'">';
					dynamicHTML += '<td rowspan=' + typecount + '>' + i + '</td>';
					dynamicHTML += '<td rowspan=' + typecount + '>Q' + eval("qosdata.ClassQueue" + i) + '</td>';
					dynamicHTML += '<td rowspan=' + typecount + '>' + eval("qosdata.DSCPMarkValue" + i) + '</td>';
					dynamicHTML += '<td rowspan=' + typecount + '>' + eval("qosdata.P8021Value" + i) + '</td>';
					var firstrowindex = '';
					for ( var j=1; j<=qosdata.class_type_num; j++ )
					{
						if ( eval("qosdata.type" + i + "Type" + j) != '' && eval("qosdata.type" + i + "Type" + j) != undefined && firstrowindex == '' )
						{
							dynamicHTML += '<td>' + transferType(eval("qosdata.type" + i + "Type" + j)) + '</td>';
							dynamicHTML += '<td>' + eval("qosdata.type" + i + "Min" + j) + '</td>';
							dynamicHTML += '<td>' + eval("qosdata.type" + i + "Max" + j) + '</td>';
							dynamicHTML += '<td>' + eval("qosdata.type" + i + "ProtocolList" + j) + '</td>';
							firstrowindex = j;
						}
					}
					dynamicHTML += '<td rowspan=' + typecount + '><input type="button" class="input_button_small input_button_heightwidth_unset" value="'+ "delete".i18n() +'" onclick="deleteClass(' + i + ')" /></td>';
					dynamicHTML += '</tr>';
					for ( var j=1; j<=qosdata.class_type_num; j++ )
					{
						if ( eval("qosdata.type" + i + "Type" + j) != '' && eval("qosdata.type" + i + "Type" + j) != undefined && j != firstrowindex )
						{
							dynamicHTML += '<tr class="'+ trclass +'">';
							dynamicHTML += '<td>' + transferType(eval("qosdata.type" + i + "Type" + j)) + '</td>';
							dynamicHTML += '<td>' + eval("qosdata.type" + i + "Min" + j) + '</td>';
							dynamicHTML += '<td>' + eval("qosdata.type" + i + "Max" + j) + '</td>';
							dynamicHTML += '<td>' + eval("qosdata.type" + i + "ProtocolList" + j) + '</td>';
							dynamicHTML += '</tr>';
						}
					}
				}
				else
				{
					if ( addindex == '' )
					{
						addindex = i;
					}
				}
			}
			else
			{
				if ( addindex == '' )
				{
					addindex = i;
				}
			}
		}
		var reg = new RegExp(gLanPortHead.replace(/\./g, "\\."), "g");
		dynamicHTML = dynamicHTML.replace(reg, "LAN");
		reg = new RegExp(gWifiPortHead.replace(/\./g, "\\."), "g");
		dynamicHTML = dynamicHTML.replace(reg, "SSID");
		var reg = new RegExp(gWANIPConnectionHead.replace(/\./g, "\\."), "g");
		dynamicHTML = dynamicHTML.replace(reg, "WANIP");
		var reg = new RegExp(gWANPPPConnectionHead.replace(/\./g, "\\."), "g");
		dynamicHTML = dynamicHTML.replace(reg, "WANPPP");
		
		if (k == 0)
		{
			dynamicHTML += '<tr><td colspan="9" align="center">' + "nodata".i18n() + '</td></td>';
		}
		
		$("#Classification").html(dynamicHTML);
	}
	
	displayControl();
}
// function isValidLanFullPath(path)
// {
	// return /InternetGatewayDevice\.LANDevice\.1\.LANEthernetInterfaceConfig\.[1-4]/.test(path);
	           // InternetGatewayDevice\.LANDevice\.1\.LANEthernetInterfaceConfig\.
			     // /InternetGatewayDevice\.LANDevice\.1\.LANEthernetInterfaceConfig\.
// }
function transferType(type)
{
	var returnstr = type;
	
	if ( type == "SMAC" )
	{
		returnstr = "smacaddr".i18n();
	}
	else if ( type == "SIP" )
	{
		returnstr = "sipaddr".i18n();
	}
	else if ( type == "DIP" )
	{
		returnstr = "dipaddr".i18n();
	}
	else if ( type == "SPORT" )
	{
		returnstr = "sport".i18n();
	}
	else if ( type == "DPORT" )
	{
		returnstr = "dport".i18n();
	}
	else if ( type == "LANInterface" )
	{
		returnstr = "laninterface".i18n();
	}
	else if ( type == "WANInterface" )
	{
		returnstr = "networkconn".i18n();
	}
	else if ( type == "TC" )
	{
		returnstr = "TC";
	}
	else if ( type == "FL" )
	{
		returnstr = "FL";
	}
	
	return returnstr;
}
function resetAddOption()
{
	$("#ClassQueue").val('');
	$("#DSCPMarkValue").val('');
	$("#P8021Value").val('');
	$("#Type_1").val('');
	$("#Type_2").val('');
	$("#Type_3").val('');
	$("#Min1").val('');
	$("#Max1").val('');
	$("#ProtocolList1").val('');
	$("#Min2").val('');
	$("#Max2").val('');
	$("#ProtocolList2").val('');
	$("#Min3").val('');
	$("#Max3").val('');
	$("#ProtocolList3").val('');
}

var macErrorHint = "macaddrcheck".i18n();
var p8021ErrorHint = "8021pinvalid".i18n();
var minMaxErrorHint = "maxgreaterthanmini".i18n();
var ipErrorHint = "ipaddrinvalid".i18n();
var portErrorHint = "portcheck".i18n();
var tosErrorHint = "toscheck".i18n();
var dscpErrorHint = "dscpcheck".i18n();
function extraValidCheck()
{
	var error_num = 0;
	
	if ( $("#Type_1").val() == '' && $("#Type_2").val() == '' && $("#Type_3").val() == '' )
	{
		$("#selectType_error").html("atleastonematch".i18n());
		error_num ++;
	}
	
	for ( var i=1; i<=qosdata.class_type_num; i++ )
	{
		var typevalue = $("#Type_" + i).val();
		var protocolvalue = $("#ProtocolList" + i).val();
		if ( typevalue != '' )
		{
			var minvalue = $("#Min" + i).val();
			var maxvalue = $("#Max" + i).val();
			if ( typevalue == "SMAC" )
			{
				if ( ! isValidMacAddress(minvalue) )
				{
					$("#Min" + i + "_error").html(macErrorHint);
					error_num ++;
				}
				if ( ! isValidMacAddress(maxvalue) )
				{
					$("#Max" + i + "_error").html(macErrorHint);
					error_num ++;
				}
				//todo, 最大值大于最小值
			}
			else if ( typevalue == "8021P" )
			{
				if ( !isValidNumberRange(minvalue, 0, 7) )
				{
					$("#Min" + i + "_error").html(p8021ErrorHint);
					error_num ++;
				}
				if ( !isValidNumberRange(maxvalue, 0, 7) )
				{
					$("#Max" + i + "_error").html(p8021ErrorHint);
					error_num ++;
				}
				if ( maxvalue < minvalue )
				{
					$("#Max" + i + "_error").html(minMaxErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "SIP" || typevalue == "DIP" )
			{
				if ( !isValidIpAddress(minvalue) && !isValidIpAddress6(minvalue) )
				{
					$("#Min" + i + "_error").html(ipErrorHint);
					error_num ++;
				}
				if ( !isValidIpAddress(maxvalue) && !isValidIpAddress6(maxvalue) )
				{
					$("#Max" + i + "_error").html(ipErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "SPORT" || typevalue == "DPORT" )
			{
				if ( !isValidPort(minvalue) )
				{
					$("#Min" + i + "_error").html(portErrorHint);
					error_num ++;
				}
				if ( !isValidPort(maxvalue) )
				{
					$("#Max" + i + "_error").html(portErrorHint);
					error_num ++;
				}
				if ( maxvalue < minvalue )
				{
					$("#Max" + i + "_error").html(minMaxErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "TOS" )
			{
				if ( !isValidNumberRange(minvalue, 0, 30) || 0 != (minvalue % 2) )
				{
					$("#Min" + i + "_error").html(tosErrorHint);
					error_num ++;
				}
				if ( !isValidNumberRange(maxvalue, 0, 30) || 0 != (maxvalue % 2) )
				{
					$("#Max" + i + "_error").html(tosErrorHint);
					error_num ++;
				}
				if ( maxvalue < minvalue )
				{
					$("#Max" + i + "_error").html(minMaxErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "DSCP" )
			{
				if ( !isValidNumberRange(minvalue, 0, 63) )
				{
					$("#Min" + i + "_error").html(dscpErrorHint);
					error_num ++;
				}
				if ( !isValidNumberRange(maxvalue, 0, 63) )
				{
					$("#Max" + i + "_error").html(dscpErrorHint);
					error_num ++;
				}
				if ( maxvalue < minvalue )
				{
					$("#Max" + i + "_error").html(minMaxErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "WANInterface" )
			{
				//todo, 最大值大于最小值
			}
			else if ( typevalue == "LANInterface" )
			{
				//todo, 最大值大于最小值
			}
		}
	}

	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}

function protocolListControl(element)
{
	var index = element.id.split("_")[1];
	var typevalue = $(element).val();
	var protocolEle = "#ProtocolList" + index;
	var oldPortocolValue = $(protocolEle).val();
	
	$(protocolEle).html(protocolListHTML);
	
	if ( typevalue == "SPORT" || typevalue == "DPORT" )
	{
		// 匹配条件为SPORT或DPORT时，协议不能为空，且协议不能包含ICMP
		$(protocolEle + " option[value='NULL']").remove(); 
		$(protocolEle + " option[value='ICMP']").remove(); 
		$(protocolEle + " option[value='TCP,ICMP']").remove(); 
		$(protocolEle + " option[value='TCP,UDP,ICMP']").remove(); 
	}
	else if ( typevalue == "LANInterface" )
	{
		// 匹配条件为LANInterface时，协议必须为"TCP,UDP"
		$(protocolEle + " option[value!='TCP,UDP']").remove(); 
	}
	$(protocolEle).val(oldPortocolValue);
	
	if ( typevalue == "LANInterface" )
	{
		$(".waninterface" + index).hide();
		$(".laninterface" + index).show();
		$(".minmax" + index).hide();
	}
	else if ( typevalue == "WANInterface" )
	{
		$(".waninterface" + index).show();
		$(".laninterface" + index).hide();
		$(".minmax" + index).hide();
	}
	else
	{
		$(".waninterface" + index).hide();
		$(".laninterface" + index).hide();
		$(".minmax" + index).show();
	}
}

function displayControl()
{
	$(".type_select").each(function(){
		var index = this.id.split("_")[1];
		if ( $(this).val() == "" )
		{
			$(".type" + index).hide();
		}
		else
		{
			$(".type" + index).show();
		}
	});
	
	if ( addindex == '' )
	{
		$("#add_div").hide();
	}
	else
	{
		$("#add_div").show();
	}
}

function deleteClass(index)
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.index = index;
	/*
	postdata.ClassQueue = '0';
	postdata.DSCPMarkValue = '0';
	postdata.P8021Value = '0';
	for ( var i=1; i<=qosdata.class_type_num; i++ )
	{
		postdata["Type" + i] = "NULL";
		postdata["Min" + i] = "NULL";
		postdata["Max" + i] = "NULL";
		postdata["ProtocolList" + i] = "NULL";
	}*/
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_qos_class", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function addClass()
{
	// 清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if( ! $("#qos_form").valid() || ! extraValidCheck() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	var typenum = 0;
	var postdata = new Object();
	postdata.action = "add";
	//postdata.index = addindex;
	postdata.ClassQueue = $("#ClassQueue").val();
	postdata.DSCPMarkValue = $("#DSCPMarkValue").val();
	postdata.P8021Value = $("#P8021Value").val();
	for ( var i=1; i<=qosdata.class_type_num; i++ )
	{
		if ( $("#Type_" + i).val() == '' )
		{
			postdata["Type" + i] = "NULL";
			postdata["Min" + i] = "NULL";
			postdata["Max" + i] = "NULL";
			postdata["ProtocolList" + i] = "NULL";
		}
		else
		{
			typenum++;
			postdata["Type" + i] = $("#Type_" + i).val();
			if ( $("#Type_" + i).val() == "LANInterface" )
			{
				postdata["Min" + i] = $("#laninterfaceMin" + i).val();
				postdata["Max" + i] = $("#laninterfaceMax" + i).val();
			}
			else if ( $("#Type_" + i).val() == "WANInterface" )
			{
				postdata["Min" + i] = $("#waninterfaceMax" + i).val();
				postdata["Max" + i] = $("#waninterfaceMax" + i).val();
			}
			else
			{
				postdata["Min" + i] = $("#Min" + i).val();
				postdata["Max" + i] = $("#Max" + i).val();
			}
			postdata["ProtocolList" + i] = $("#ProtocolList" + i).val();
		}
	}
	postdata.typenum = typenum;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_qos_class", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

