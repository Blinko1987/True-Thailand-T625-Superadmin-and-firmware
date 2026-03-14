var tokenstr = "";
var gData;
var loginlevel = -1;
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");

	showOrHideLoadingWindowFromIframe("show");
	XHR.get("get_login_user", null, function(data){
		if ( data )
		{
			loginlevel = data.login_user;
		}
	});
	//validate and submit
	initPage();
	initValidate();

	$("input[name='vlanbind']").bind("click", function(){
		$("input[name='vlanbind']").attr("checked", false);
		$(this).attr("checked", true);
	});

});


function initPage()
{
	// gDebug = false;
	if(gDebug)
	{
		getDataByAjax("../fake/vlanbind", fillData);
	}else{
		XHR.get("vlanbind", null, fillData);
	}
	
	$(".delete-vlanbind").bind("click", function(){
		var deletePort = $(this).attr("data");
		var deleteVlanPart = $(this).parents("tr").find(".vlanPartTd").text();
		deleteApply(deletePort, deleteVlanPart);
	});
}


function deleteApply(port, vlanPart)
{
	var data = new Object;
	data.action = "delete";
	var portJsonObj;
	if(port.indexOf("eth") != -1){
		var arrayIndex = parseInt(port.charAt(3));
		portJsonObj = gData.lanVlanBindList[arrayIndex];
	}else if(port.indexOf("wl0") != -1){
		var str = port.split('.');
		var arrayIndex = parseInt(str[1]);
		portJsonObj = gData.wlanVlanBindList[arrayIndex];
	}else{
		alert("portselerr".i18n());
	}
		
	//dataStr += "&act_oid=" + portJsonObj.oid;
	//data.inst0=" + portJsonObj.inst0;
	data.IfName = port;
	data.vlanPart = vlanPart;
	//data += "&inst1=" + portJsonObj.inst1;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	data.token = tokenstr;
	XHR.post("setVlanBind", data, reloadData);
}

function saveApply()
{
	if( ! $("#vlan_bind_form").valid())
	{
		ptweblog("validate vlanbind error.");
		return false;
	}
	else
	{
		var data = buildData();
		showOrHideLoadingWindowFromIframe("show");
		if(gDebug)
		{
			postDataByAjax("../fake/post", JSON.stringify(data));
		}else{
			XHR.get("get_operator", null, function(data){
				if ( data )
				{
					tokenstr = data.token;
				}
			});
			data.token = tokenstr;
			XHR.post("setVlanBind", data, reloadData);
		}
	}
}

function reloadData(responseData)
{
	if(responseData.success == "true")
	{
		ptweblog("post data success!");
		initPage();
	}
	else
	{
		alert("submitvlanbindfail".i18n());
	}
}

function initValidate()
{
	$("#vlan_bind_form").validate({
		debug: false,
		rules: {
			"data.userVlan": {required: true, min: 1, max: 4094},
			"vlanbind": {required: true}
	    },
	    messages:{
	    	"vlanbind": "seloneport".i18n()
	    },
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		  submitHandler: function(form){//校验成功回调
		  	ptweblog("validate vlanbind settings ok.....");
		  },
		  invalidHandler: function(form, validator) {  //校验失败回调
	   		ptweblog("validate vlanbind settings failed.....");
	   		return false;
	   	  }
	}); 
}

function constructPortHtml()
{
	var i;
	var dynamicHTML;
	
	//lan port
	dynamicHTML = '';
	for (i=0; i<gData.lan_port_num; i++)
	{
		dynamicHTML += '<input type="radio" name="vlanbind" value="eth' + i + '">' + gLanPortDescribeArarry[i] + " ";
	}
	$("#lan_div").html(dynamicHTML);
	
	//wifi port
	if (gData.wifi_enable == 0)
	{
		$("#wifi_div").parent().hide();
		//$("#5g_wifi_div").parent().hide();
	}
	else
	{
		//var index2g = 1;
		//var index5g = 1;
		//var dynamicHTML2g = '';
		//var dynamicHTML5g = '';
		var wifinum = 0;
		var dynamicWifiHTML = '';
		var dynamicWifiHTML5G = '';
		for (i=0; i<16; i++)
		{
			var singlewlanvlanbind = gData.wlanVlanBindList[i];
			if(eval("singlewlanvlanbind.ssid" + eval(i+1)) == 1)//wifi 实例存在
			{
				wifinum++;
				var disablestr = '';
				if ( gData.wifi_obj_enable && eval("gData.wifi_obj_enable.ConfigActive" + eval(i+1)) == 0 )
				{
					disablestr = 'disabled';
				}
				if(wifinum == 5)
				{
					dynamicWifiHTML += '<br/>';
					if(loginlevel != 0){
						dynamicWifiHTML5G += '<br/>';
					}
				}

				// if(wifinum == 9)
				// {
				// 	dynamicWifiHTML += '<br/>';
				// }

			    if(wifinum == 12 && loginlevel != 0)
				{
					dynamicWifiHTML5G += '<br/>';
				}
				
				if (wifinum < 5 )
				{
					/* if (wifinum == 4)
					{
						dynamicWifiHTML += '<input style="display:none;" type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">';
					}
					else */
					{
						dynamicWifiHTML += '<input type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">2G-SSID' + eval(i+1) + " ";
					}
				}
				else if(wifinum > 8 && wifinum < 13 && loginlevel != 0)
				{
					 if (wifinum == 12)
					{
						dynamicWifiHTML += '<input style="display:none;" type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + eval(i-3) + '">';
					}
					else 
					{
						dynamicWifiHTML += '<input type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">2G-SSID' + eval(i-3) + " ";
					}
				}
				else if(wifinum > 4 && wifinum < 9)
				{
						/* if (wifinum == 4)
					{
						dynamicWifiHTML += '<input style="display:none;" type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">';
					}
					else */
					{
						dynamicWifiHTML5G += '<input type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">5G-SSID' + eval(i-3) + " ";
					}
				}
				else if(wifinum > 12 && loginlevel != 0)
				{
	                if (wifinum == 16)
					{
						dynamicWifiHTML5G += '<input style="display:none;" type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + eval(i-7) + '">';
					}
					else
					{
                        dynamicWifiHTML5G += '<input type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">5G-SSID' + eval(i-7) + " ";
					}
				}

				
			/*	if (singlewlanvlanbind.X_CT_COM_RFBand == "1")//5g
				{
					dynamicHTML5g += '<input type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">5G-' + index5g + " ";
					index5g++;
				}
				else //2.4g
				{
					dynamicHTML2g += '<input type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">2.4G-' + index2g + " ";
					index2g++;
				}*/

			}
			continue;
		}
		//$("#2g_wifi_div").html(dynamicHTML2g);
		var comprehensivehtml = dynamicWifiHTML + dynamicWifiHTML5G;
		$("#wifi_div").html(comprehensivehtml);
		if(loginlevel == 0){
			wifinum = 8; 
		}
		if (wifinum<=4)
		{
			document.getElementById('wifi_div2').style.height = 0 + 'px';
		}
		else if(wifinum<=8)
		{
			document.getElementById('wifi_div2').style.height = 50 + 'px';
		}
		else if(wifinum<=12)
		{
			document.getElementById('wifi_div2').style.height = 100 + 'px';
		}
		else
		{
			document.getElementById('wifi_div2').style.height = 150 + 'px';
		}
		/*
		if (gData.wifi_5g_enable == 1)
		{
			$("#5g_wifi_div").html(dynamicHTML5g);
		}
		else
		{
			$("#5g_wifi_div").parent().hide();
		}*/
	}
}


function fillData(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	if(data.success != 'true')
	{
		alert("get vlanbind failed!");	
		return false;
	}
	gData = data;
	constructPortHtml();
	if((data.lanVlanBindList == "") || (data.lanVlanBindList == ""))
	{
		ptweblog("nosetvlanbind".i18n());
	}else{
		var lanVlanBindNum = data.lanVlanBindList.length;
		$("table tbody tr").eq(0).nextAll().remove();
		var i = 0;
		for(; i < lanVlanBindNum; i++)
		{
			if(data.lanVlanBindList[i].X_CT_COM_Mode == '1'){
				var port = gLanPortDescribeArarry[parseInt(data.lanVlanBindList[i].IfName.substring(3))];
				fillTableByIndex(i, data.lanVlanBindList[i], port);
			}
			continue;
		}
		var wlanVlanBindNum = data.wlanVlanBindList.length;
		//var index2g = 1;
		//var index5g = 1;
		for(i = 0; i < wlanVlanBindNum; i++)
		{
			var portstr;
			var singlewlanvlanbind = data.wlanVlanBindList[i];
			if(eval("singlewlanvlanbind.ssid" + eval(i+1)) == 1)//wifi 实例存在
			{
				if (eval(i) < 4)
				{
					portstr = "2G-SSID" + eval(i+1);
				}
				else if (eval(i) > 3 && eval(i) < 8)
				{
					portstr = "5G-SSID" + eval(i-3);
				} 
				else if (eval(i+1) > 8 && eval(i+1) < 13)
				{
					portstr = "2G-SSID" + eval(i-3);
				}
				else if (eval(i+1) > 12 && eval(i+1) < 17)
				{
					portstr = "5G-SSID" + eval(i-7);
				}
				
				if(singlewlanvlanbind.X_CT_COM_Mode == '1')
				{
					fillTableByIndex(i, singlewlanvlanbind, portstr);
				}
				
				
				
				/*if (singlewlanvlanbind.X_CT_COM_RFBand == "1")//5g
				{
					portstr = "5G-" + index5g;
					if(singlewlanvlanbind.X_CT_COM_Mode == '1')
					{
						fillTableByIndex(i, singlewlanvlanbind, portstr);
					}
					index5g++;
					continue;
				}
				else //2.4g
				{
					portstr = "2.4G-" + index2g;
					if(singlewlanvlanbind.X_CT_COM_Mode == '1')
					{
						fillTableByIndex(i, singlewlanvlanbind, portstr);
					}
					index2g++;
					continue;
				}*/
			}
			continue;
		}
		var wanConnum = data.wanConnList.length;
		var showNum = 0;
		$("#Vlan_WanConnect_select").html("");
		for(i = 0; i < wanConnum; i++)
		{
			if(data.wanConnList[i].wan_index == 3 && data.wanConnList[i].wan_session_index == 1 && data.wanConnList[i].Name == "THSi")//true custom wan, cannot show
			{
				continue;
			}
		
			var single_wan_name = data.wanConnList[i].Name;
			if ( single_wan_name.toUpperCase().indexOf("INTERNET") >=0
				|| single_wan_name.toUpperCase().indexOf("OTHER") >= 0 )
			{
				var optionStr = "<option value='" + single_wan_name + "'>";
				optionStr += single_wan_name + "</option>";
				$("#Vlan_WanConnect_select").append(optionStr);
				showNum ++;
			}
		}
		if ( showNum <= 0 )
		{
			$("#vlan_bind_form").css("display", "none");
		}
	}
	
}


function fillTableByIndex(index, data, portstr)
{
	var vlanRulesArray = data.X_CT_COM_VLAN.split(',')
	var vlanRulesNum = vlanRulesArray.length;
	var htmlStr = "";
	for(var i = 0; i < vlanRulesNum; i++)
	{
		if (i%2 == 1)
		{
			htmlStr += "<tr class='oddtr'>";
		}
		else
		{
			htmlStr += "<tr class='eventr'>";
		}

		htmlStr += "<td>" + portstr +"</td>";
		
		htmlStr += "<td class='vlanPartTd'>" + vlanRulesArray[i] +"</td>";
		htmlStr += "<td>" + getBindWanConnName(data.X_CT_COM_VLAN) + "</td>";
		htmlStr += "<td><input class='delete-vlanbind input_button_small input_button_heightwidth_unset' type='button' value='" + "delete".i18n() + "' data='" + data.IfName +"'>" + "</td>";
		htmlStr += "</tr>";
	}

	$("tbody").append(htmlStr);
}


function getBindWanConnName(CUVLANStr)
{
	var bindWanNameStr = ",";
	
	if (/^\d+\/(\d+|-1)/.test(CUVLANStr))
	{
		var CUVlanParts = CUVLANStr.split(','), UVlan;
		
		for (var i=0; i<CUVlanParts.length; i++)
		{
			UVlan = CUVlanParts[i].split('/')[1];
			for (var j=0; j<gData.wanConnList.length; j++)
			{
				if (UVlan == gData.wanConnList[j].vlanid
				&& (/INTERNET/i.test(gData.wanConnList[j].Name) || /Other/i.test(gData.wanConnList[j].Name))
				&& -1 == bindWanNameStr.indexOf("," + gData.wanConnList[j].Name + ","))
				{
					bindWanNameStr += gData.wanConnList[j].Name + ",";
				}
			}
		}
	}
	
	return bindWanNameStr.substring(1, bindWanNameStr.length-1);
}



function buildData()
{
	var data = new Object();
	var bindPort = "";
	$("input[name='vlanbind']").each(function(){
		if($(this).attr("checked") == "checked"){
			bindPort = $(this).val();
		}
	});
	var portJsonObj;
	if(bindPort.indexOf("eth") != -1){
		var arrayIndex = parseInt(bindPort.charAt(3));
		portJsonObj = gData.lanVlanBindList[arrayIndex];
	}else if(bindPort.indexOf("wl0") != -1){
		var str = bindPort.split('.');
		var arrayIndex = parseInt(str[1]);
		portJsonObj = gData.wlanVlanBindList[arrayIndex];
	}else{
		alert("portselerr".i18n());
	}
		
	//data.act_oid = portJsonObj.oid;
	/*data.inst0 = portJsonObj.inst0;
	data.inst1 = portJsonObj.inst1;*/
	data.action = "add";
	data.IfName = portJsonObj.IfName;
	var userVlan = $("#Vlan_text").val();
	var wanSelect = $("#Vlan_WanConnect_select").val();
	var wanConnum = gData.wanConnList.length;
	var i = 0;
	for(; i < wanConnum; i++){
		if(gData.wanConnList[i].Name == wanSelect)
		{
			break;
		}
	}

	data.vlanPart = userVlan + "/" + gData.wanConnList[i].vlanid;
	data.token = tokenstr;
	return data;
}
