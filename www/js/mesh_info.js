var refresh_interval = 5;
var gmasterapssid1mac = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	getData();
});


function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/mesh_info", parseMeshData);
	}
	else
	{
		XHR.poll(refresh_interval, "get_mesh_info", null, parseMeshData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}


function parseMeshData(getdata)
{
	var meshnetwkinfoHTML = '';
	var singleagenttab1HTML = '';
	var singleagenttab2HTML = '';

	if ( getdata )
	{
		var meshdata = getdata;
		
		if (meshdata.meshmode && meshdata.meshmode != undefined)
		{
			if (meshdata.apmac1 && meshdata.apmac1 != undefined)
			{
				gmasterapssid1mac = meshdata.apmac1;
			}
		
			if (meshdata.meshmode == "Master AP")
			{
				//root ap
				meshnetwkinfoHTML += '<tr class="eventr">';
				meshnetwkinfoHTML += '<td>'+ "rootap".i18n() +'</td>';
				meshnetwkinfoHTML += '<td>'+ meshdata.rootap.mac_br0 +'</td>';
				if (meshdata.rootap.ip_addr != "" && meshdata.rootap.ip_addr != undefined)
				{
					meshnetwkinfoHTML += '<td>'+ meshdata.rootap.ip_addr +'</td>';
				}
				else if (meshdata.rootap.ipv6_addr != "" && meshdata.rootap.ipv6_addr != undefined)
				{
					meshnetwkinfoHTML += '<td>'+ meshdata.rootap.ipv6_addr +'</td>';
				}
				else
				{
					meshnetwkinfoHTML += '<td> </td>';
				}
				meshnetwkinfoHTML += '<td>--</td>';
				meshnetwkinfoHTML += '<td>--</td>';
				meshnetwkinfoHTML += '<td>--</td>';
				//meshnetwkinfoHTML += '<td>--</td>';
				meshnetwkinfoHTML += '<td>--</td>';
				//meshnetwkinfoHTML += '<td>--</td>';
				meshnetwkinfoHTML += '<td>--</td>';
				meshnetwkinfoHTML += '</tr>';
				
				var slaveapnum = 0;
				
				//agent ap
				for (var i=0; i<4; i++)
				{
					var singleagent = meshdata.agentap[i];
					
					if (singleagent.active == 1)
					{
						slaveapnum = slaveapnum + 1;
					
						if (slaveapnum%2 == 1)
						{
							trclass = "oddtr";
						}
						else
						{
							trclass = "";
						}

						meshnetwkinfoHTML += '<tr class="' + trclass + '">';
						
						var agentmac1905str = "";
						if ( singleagent.mac1905 && singleagent.mac1905 != undefined )
						{
							agentmac1905str = singleagent.mac1905.replace(/:/g, '');
						}
						
						if (singleagent.ip_addr != "" && singleagent.ip_addr != undefined)
						{
							meshnetwkinfoHTML += '<td><a target="_blank" href="http://'+ singleagent.ip_addr +'/cgi-bin/login.cgi?username='+ agentmac1905str +'">'+ "extendap".i18n() + eval(i+1) +'</a></td>';
							meshnetwkinfoHTML += '<td>'+ singleagent.mac_br0 +'</td>';
							meshnetwkinfoHTML += '<td>'+ singleagent.ip_addr +'</td>';
						}
						else if (singleagent.ipv6_addr != "" && singleagent.ipv6_addr != undefined)
						{
							meshnetwkinfoHTML += '<td><a target="_blank" href="http://'+ singleagent.ipv6_addr +'/cgi-bin/login.cgi?username='+ agentmac1905str +'">'+ "extendap".i18n() + eval(i+1) +'</a></td>';
							meshnetwkinfoHTML += '<td>'+ singleagent.mac_br0 +'</td>';
							meshnetwkinfoHTML += '<td>'+ singleagent.ipv6_addr +'</td>';
						}
						else
						{
							meshnetwkinfoHTML += '<td>'+ "extendap".i18n() + eval(i+1) +'</td>';
							meshnetwkinfoHTML += '<td>'+ singleagent.mac_br0 +'</td>';
							meshnetwkinfoHTML += '<td> </td>';
						}
						if (singleagent.connect_type == "wired")//wired   
						{
							meshnetwkinfoHTML += '<td>'+ "wired".i18n() +'</td>';
							meshnetwkinfoHTML += '<td>'+ singleagent.throughput +'</td>';
							meshnetwkinfoHTML += '<td>--</td>';
						}
						else if (singleagent.connect_type == "wireless")//wireless
						{
							meshnetwkinfoHTML += '<td>'+ "wireless".i18n() +'</td>';
							meshnetwkinfoHTML += '<td>'+ singleagent.throughput +'</td>';
							meshnetwkinfoHTML += '<td>'+ singleagent.rssi +'</td>';
						}
						else
						{
							meshnetwkinfoHTML += '<td> </td>';
							meshnetwkinfoHTML += '<td> </td>';
							meshnetwkinfoHTML += '<td> </td>';
						}
						
						//meshnetwkinfoHTML += '<td>'+ singleagent.link_rate +'</td>';
						if (singleagent.online_status == 1)//1:online  0:offline
						{   
							if(singleagent.connect_type=="wireless"){
								if(parseInt(singleagent.rssi)>=-34){
									meshnetwkinfoHTML += '<td class= "td-bad-color">'+ "bad".i18n() +'</td>';
	
								}else if(parseInt(singleagent.rssi)>=-54 && parseInt(singleagent.rssi)<=-35){
									meshnetwkinfoHTML += '<td class="td-poor-color">'+ "poor".i18n() +'</td>';
	
								}else if(parseInt(singleagent.rssi)>=-59 && parseInt(singleagent.rssi)<=-55){
									meshnetwkinfoHTML += '<td class="td-fair-color">'+ "fair".i18n() +'</td>';
	
								}else if(parseInt(singleagent.rssi)>=-70 && parseInt(singleagent.rssi)<=-60){
									meshnetwkinfoHTML += '<td class="td-good-color">'+ "good".i18n() +'</td>';
	
								}else if(parseInt(singleagent.rssi)>=-75 && parseInt(singleagent.rssi)<=-71){
									meshnetwkinfoHTML += '<td class="td-fair1-color">'+ "fair_far".i18n() +'</td>';
	
								}else if(parseInt(singleagent.rssi)>=-85 && parseInt(singleagent.rssi)<=-76){
									meshnetwkinfoHTML += '<td  class="td-poor1-color">'+ "poor_far".i18n() +'</td>';
								}else {
									meshnetwkinfoHTML += '<td class="td-bad1-color">'+ "bad_far".i18n() +'</td>';
								}
							}else{
								meshnetwkinfoHTML += '<td>'+ "online".i18n() +'</td>';	
							}

							//meshnetwkinfoHTML += '<td>'+ "online".i18n() +'</td>';
							//meshnetwkinfoHTML += '<td>'+ formatTime2(eval(singleagent.online_time)) +'</td>';
						}
						else
						{
							meshnetwkinfoHTML += '<td>'+ "offline".i18n() +'</td>';
							//meshnetwkinfoHTML += '<td> </td>';
						}
						
						meshnetwkinfoHTML += '<td width="8%"><input type="button" class="input_button_small input_button_heightwidth_unset" id="reboot_' + singleagent.repeater_index + '" onclick="doReboot(this.id)" value="'+ "menu.reboot".i18n() +'"></td>';
					
						meshnetwkinfoHTML += '</tr>';
					}
				}
				$("#meshnetwkinfo").html(meshnetwkinfoHTML);
				
				document.getElementById("meshinfolist").style.display = "";
				document.getElementById("singleagent_tab1").style.display = "none";
				document.getElementById("singleagent_tab2").style.display = "none";
			}
			else if (meshdata.meshmode == "Slave AP")
			{
				
				if (meshdata.agentap.active == 1)
				{
					singleagenttab1HTML += '<tr>';
					singleagenttab1HTML += '<td>'+ meshdata.agentap.mac_br0 +'</td>';
					if (meshdata.agentap.ip_addr != "" && meshdata.agentap.ip_addr != undefined)
					{
						singleagenttab1HTML += '<td>'+ meshdata.agentap.ip_addr +'</td>';
					}
					else if (meshdata.agentap.ipv6_addr != "" && meshdata.agentap.ipv6_addr != undefined)
					{
						singleagenttab1HTML += '<td>'+ meshdata.agentap.ipv6_addr +'</td>';
					}
					else
					{
						singleagenttab1HTML += '<td> </td>';
					}
					if (meshdata.agentap.connect_type == "wired")//wired   
					{
						singleagenttab1HTML += '<td>'+ "wired".i18n() +'</td>';
						singleagenttab1HTML += '<td>'+ meshdata.agentap.throughput +'</td>';
						singleagenttab1HTML += '<td>--</td>';
					}
					else if (meshdata.agentap.connect_type == "wireless")//wireless
					{
						singleagenttab1HTML += '<td>'+ "wireless".i18n() +'</td>';
						singleagenttab1HTML += '<td>'+ meshdata.agentap.throughput +'</td>';
						singleagenttab1HTML += '<td>'+ meshdata.agentap.rssi +'</td>';
					}
					else
					{
						singleagenttab1HTML += '<td> </td>';
						singleagenttab1HTML += '<td> </td>';
						singleagenttab1HTML += '<td> </td>';
					}
					
					//singleagenttab1HTML += '<td>'+ meshdata.agentap.link_rate +'</td>';
					if (meshdata.agentap.online_status == 1)//1:online  0:offline
					{
						singleagenttab1HTML += '<td>'+ "online".i18n() +'</td>';
						//singleagenttab1HTML += '<td>'+ formatTime2(eval(meshdata.agentap.online_time)) +'</td>';
					}
					else
					{
						singleagenttab1HTML += '<td>'+ "offline".i18n() +'</td>';
						//singleagenttab1HTML += '<td> </td>';
					}
					singleagenttab1HTML += '</tr>';
					$("#singleagent_info1").html(singleagenttab1HTML);
					
					singleagenttab2HTML += '<tr>';
					singleagenttab2HTML += '<td>'+ meshdata.agentap.mac_br0 +'</td>';	
					singleagenttab2HTML += '<td>'+ meshdata.agentap.bssid_2g +'</td>';
					singleagenttab2HTML += '<td>'+ meshdata.agentap.FrontHualSSID_2G +'</td>';
					singleagenttab2HTML += '<td>'+ meshdata.agentap.bssid_5g +'</td>';
					singleagenttab2HTML += '<td>'+ meshdata.agentap.FrontHualSSID_5G +'</td>';
					singleagenttab2HTML += '</tr>';
					$("#singleagent_info2").html(singleagenttab2HTML);
				}
				else
				{
					singleagenttab1HTML = '<tr><td colspan="7">'+ "nodata".i18n() +'</td></tr>';
					$("#singleagent_info1").html(singleagenttab1HTML);
					
					singleagenttab2HTML = '<tr><td colspan="5">'+ "nodata".i18n() +'</td></tr>';
					$("#singleagent_info2").html(singleagenttab2HTML);
				}
				document.getElementById("meshinfolist").style.display = "none";
				document.getElementById("singleagent_tab1").style.display = "";
				document.getElementById("singleagent_tab2").style.display = "";
			}
		}	
	}
}


function doReboot(eid)
{	
	if(confirm("agentreboot_confirm_hint".i18n()) == false)
	{
		return false;
	}
	
	var postdata = new Object();
	postdata.repeater_index = eid.split("_")[1];
	
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	showOrHideLoadingWindowFromIframe("show");
	showOrHideLoadingWindowFromIframe("hide");
	XHR.post("do_reboot_repeater", postdata, parseResponse);
	
}

function parseResponse(data)
{
	if (data)
	{
		if ( data.success != "true" )
		{
			console.log("agent reboot fail");
		}
		else
		{
			console.log("agent reboot succeed");
		}
	}
}
