var tokenstr = "";
var hostindex;
var gMeshMode = 0;
var gmeshslaveapArray=new Array();//active
var gmeshdata;
var hostnum = 0;
var geasymeshbackhaul = "5GH";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	XHR.get("get_meshmode_info", null, parseRouterMode);
	
	XHR.get("get_easymesh_settings", null, function(data){
		if ( data.token != undefined )
		{
			tokenstr = data.token;
		}
		
		if ( data.BackHaul != undefined )
		{
			geasymeshbackhaul = data.BackHaul;
		}
	});
	
	getData();
});

function parseRouterMode(data)
{
	if ( data )
	{
		tokenstr = data.token;
		if ( data.MeshMode != undefined )
		{
			gMeshMode = data.MeshMode;
		}
		if (gMeshMode == "Master AP")
		{
			XHR.get("get_mesh_info", null, parseMeshInfo);
		}
	}
}

function parseMeshInfo(data)
{
	if ( data )
	{
		gmeshdata = data;
		
		for (var i=0; i<4; i++)
		{
			if (gmeshdata.agentap[i].active == 1)
			{
				gmeshslaveapArray.push(i);
			}
		}
	}
}

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/statslan", parseGetData);
	}
	else
	{
		XHR.get("get_lan_status", null, parseGetData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	$("#modifyhostnamediv").hide();
	$("#lanhost_tab").show();

	var hostHTML = '';
	if ( data && data.lan_status )
	{
		var allslaveapArray=new Array();
		var slaveapArray1=new Array();//active
		var slaveapclientArray1=new Array();//active
		
		var landata = data.lan_status;
		
		//active device
		for (i=1; i<=landata.max_lan_host_num; i++)
		{
			if ( eval('landata.MACAddress' + i) )
			{
				if (eval('landata.portid' + i) == "MeshSlaveAP")
				{
					allslaveapArray.push(i);
				}
			}
		
			if ( eval('landata.Active' + i) == 1 && eval('landata.MACAddress' + i) && eval('landata.IPAddress' + i))
			{
				var portid = eval('landata.portid' + i);
				
				if (portid == "MeshSlaveAP")
				{
					slaveapArray1.push(i);
				}
				else if (portid == "MeshHost")
				{
					slaveapclientArray1.push(i);
				}
				else
				{
					var trclass = "";
					
					hostnum = hostnum + 1;
					
					if (hostnum%2 == 1)
					{
						trclass = "oddtr";
					}
					else
					{
						trclass = "";
					}
					
					var lan_mac = eval('landata.MACAddress' + i);
					hostHTML += '<tr class="' + trclass + '">';
					hostHTML += '<td>' + eval('landata.HostName' + i) + '</td>';
					hostHTML += '<td>' + eval('landata.IPAddress' + i) + '</td>';
					if(lan_mac.length == 12)
					{
						hostHTML += '<td>' + macaddcolon(lan_mac) + '</td>';
					}
					else
					{
						hostHTML += '<td>' + lan_mac + '</td>';
					}
					
					//var portid = eval('landata.portid' + i);
					var place;
					if ( portid.indexOf(gLanPortHead) >= 0 )
					{
						portid = "LAN" + (parseInt(portid.substr(gLanPortHead.length,1)));
					}
					else if ( portid.indexOf(gWifiPortHead) >= 0 )
					{
						if(portid.substr(gWifiPortHead.length,1) >= 1 && portid.substr(gWifiPortHead.length,1) <= 4 && portid.substr(gWifiPortHead.length,2) < 9  || portid.substr(gWifiPortHead.length,1) == 9)
						{
							portid = "SSID" + portid.substr(gWifiPortHead.length,1);
							portid += "--2G"; 
						}
						else if(portid.substr(gWifiPortHead.length,2) >= 9 && portid.substr(gWifiPortHead.length,2) <= 12){
							portid = "SSID" + portid.substr(gWifiPortHead.length,2);
							portid += "--2G"; 
						}
						else if (portid.substr(gWifiPortHead.length,1) >= 5 && portid.substr(gWifiPortHead.length,1) <= 8)
						{
							portid = "SSID" + portid.substr(gWifiPortHead.length,1);
							portid += "--5G";
						}
						else if (portid.substr(gWifiPortHead.length,2) >= 13 && portid.substr(gWifiPortHead.length,2) <= 16)
						{
							portid = "SSID" + portid.substr(gWifiPortHead.length,2);
							portid += "--5G";
						}
						else
						{
							portid = "SSID" + portid.substr(gWifiPortHead.length,1);
						}
					}
					hostHTML += '<td>' + portid + '</td>';
					
					if (eval('landata.Type' + i) == 1)
					{
						hostHTML += '<td>' + "wireless".i18n() + '</td>';
						hostHTML += '<td>' +  eval('landata.Band' + i) + '</td>';
					}
					else
					{
						hostHTML += '<td>' + "wired".i18n() + '</td>';
						hostHTML += '<td>--</td>';
					}
					
					hostHTML += '<td>' + formatTime2(eval('landata.OnlineTime' + i)) + '</td>';

					hostHTML += '</tr>';
				}
			}
		}
		
		//active slave ap hosts
		if (gmeshslaveapArray.length > 0)
		{
			for (var j=0; j<gmeshslaveapArray.length; j++)
			{
				var k = gmeshslaveapArray[j];
				var singleslaveap = gmeshdata.agentap[k];
				var singleslaveap_index = "none";
				var singleslaveap_hostname = "";
				var singleslaveap_onlinetime = "";
				
				var trclass = "";
		
				trclass = "oddtr2";
				
				var lan_mac = singleslaveap.mac_br0;
				var slaveapmac = "";
				hostHTML += '<tr><td style="border: 1px solid #ffffff; background-color: #ffffff;" colspan="7">&nbsp;</td></tr>';
				hostHTML += '<tr><td class="theme_color" style="border: 1px solid #ffffff; background-color: #ffffff;" colspan="7"><b>'+ "extendap".i18n() + eval(j+1) + "andhostsactive".i18n() +'</b></td></tr>';
				hostHTML += '<tr class="' + trclass + '">';
				
				if (allslaveapArray.length > 0)
				{
					for (var s=0; s<allslaveapArray.length; s++)
					{
						var t = allslaveapArray[s];
						
						var tmpmac = eval('landata.MACAddress' + t);
						
						if(tmpmac.length == 12)
						{
							tmpmac = macaddcolon(tmpmac);
						}	
						
						if (lan_mac.toLowerCase() == tmpmac.toLowerCase())
						{
							singleslaveap_index = t;
							singleslaveap_hostname = eval('landata.HostName' + t);
							singleslaveap_onlinetime = eval('landata.OnlineTime' + t);
							break;
						}
					}
				}
				
				if (singleslaveap_index != "none") //not found in lan hosts list
				{
					hostHTML += '<td>' + singleslaveap_hostname + '</td>';
				}
				else
				{
					hostHTML += '<td>' + "extendap".i18n() + '</td>';
				}
				
				if (singleslaveap.ip_addr != "" && singleslaveap.ip_addr != undefined)
				{
					hostHTML += '<td>' + singleslaveap.ip_addr + '</td>';
				}
				else if (singleslaveap.ipv6_addr != "" && singleslaveap.ipv6_addr != undefined)
				{
					hostHTML += '<td>' + singleslaveap.ipv6_addr + '</td>';
				}
				else
				{
					hostHTML += '<td>' + singleslaveap.ip_addr + '</td>';
				}	
				
				if(lan_mac.length == 12)
				{
					hostHTML += '<td>' + macaddcolon(lan_mac) + '</td>';
					slaveapmac = macaddcolon(lan_mac);
				}
				else
				{
					hostHTML += '<td>' + lan_mac + '</td>';
					slaveapmac = lan_mac;
				}
				
				//hostHTML += '<td>' + eval('landata.portid' + k) + '</td>';
				hostHTML += '<td>MeshAgent</td>';
				
				if (singleslaveap.connect_type == "wireless")
				{
					hostHTML += '<td>' + "wireless".i18n() + '</td>';
					hostHTML += '<td>' + geasymeshbackhaul + '</td>';
				}
				else
				{
					hostHTML += '<td>' + "wired".i18n() + '</td>';
					hostHTML += '<td>--</td>';
				}
				
				if (singleslaveap_index != "none") //not found in lan hosts list
				{
					hostHTML += '<td>' + formatTime2(eval(singleslaveap_onlinetime)) + '</td>';
				}
				else
				{
					hostHTML += '<td>--</td>';
				}

				hostHTML += '</tr>';
				
				if (slaveapclientArray1.length > 0)//active
				{
					var slaveapstanum = 0;
				
					for (var l=0; l<slaveapclientArray1.length; l++)
					{
						var n = slaveapclientArray1[l];
						
						var baseapmac = eval('landata.BaseAPMAC' + n);
						var meshhostbaseapmac = "";
						if(baseapmac.length == 12)
						{
							meshhostbaseapmac = macaddcolon(baseapmac);
						}
						else
						{
							meshhostbaseapmac = baseapmac;
						}
						
						if (meshhostbaseapmac.toLowerCase() == slaveapmac.toLowerCase())
						{
							var trclass = "";
							
							slaveapstanum = slaveapstanum + 1;
					
							if (slaveapstanum%2 == 1)
							{
								trclass = "oddtr";
							}
							else
							{
								trclass = "";
							}
							
							var lan_mac = eval('landata.MACAddress' + n);
							hostHTML += '<tr class="' + trclass + '">';
							hostHTML += '<td>' + eval('landata.HostName' + n) + '</td>';
							hostHTML += '<td>' + eval('landata.IPAddress' + n) + '</td>';
							if(lan_mac.length == 12)
							{
								hostHTML += '<td>' + macaddcolon(lan_mac) + '</td>';
							}
							else
							{
								hostHTML += '<td>' + lan_mac + '</td>';
							}
							
							hostHTML += '<td>' + eval('landata.portid' + n) + '</td>';
							
							if (eval('landata.Type' + n) == 1)
							{
								hostHTML += '<td>' + "wireless".i18n() + '</td>';
								hostHTML += '<td>' +  eval('landata.Band' + n) + '</td>';
							}
							else
							{
								hostHTML += '<td>' + "wired".i18n() + '</td>';
								hostHTML += '<td>--</td>';
							}
							
							hostHTML += '<td>' + formatTime2(eval('landata.OnlineTime' + n)) + '</td>';

							hostHTML += '</tr>';
						}
					}
				}
			}
		}	
	}
	
	$("#lan_host").html(hostHTML);
}


function refreshApply()
{
	if ( parent && parent.gLastOperateTime != undefined )
	{
		parent.gLastOperateTime = new Date().getTime();
	}
	window.location.reload();
}


