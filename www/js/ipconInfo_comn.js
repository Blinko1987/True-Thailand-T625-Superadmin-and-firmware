var tokenstr = "";

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
		getDataByAjax("../fake/wan_info", parseWanData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_allwan_info", null, parseWanData);
	}
}

function parseWanData(getdata)
{
	showOrHideLoadingWindowFromIframe("hide");
	var ipv4HTML = '';
	var ipv4wannum = 0;
	var ipv6HTML = '';
	var ipv6wannum = 0;
	var paltresult = -1;
	
	if ( getdata && getdata.wan )
	{
		var wanAarry = getdata.wan;
		
		paltresult = getdata.plat_result; //0-omici;1-tr069
		
		if ( wanAarry.length > 0 )
		{
			for (var i=0; i<wanAarry.length; i++ )
			{
				var singleWan = wanAarry[i];
				
				if(singleWan.wan_index == 3 && singleWan.wan_session_index == 1 && singleWan.Name == "THSi")//true custom wan, cannot show
				{
					continue;
				}
	
				if(paltresult != 'undefined' && paltresult == 0 && singleWan.ServiceList.indexOf('VOIP') > -1)
				{
					continue;
				}
				else
				{
				if ( singleWan.IPMode == 1 || singleWan.IPMode == 3 ) //ipv4
				{
					ipv4wannum = ipv4wannum + 1;
				
					if (ipv4wannum%2 == 1)
					{
						ipv4HTML += '<tr class="oddtr">';
					}
					else
					{
						ipv4HTML += '<tr>';
					}
				
					// 连接名称
					ipv4HTML += '<td>' + singleWan.Name + '</td>';
					// 使能状态
					if ( singleWan.Enable == 1 )
					{
						ipv4HTML += '<td>' + "turnon".i18n() + '</td>';
						
						//// 地址获取方式
						if ( singleWan.AddressingType.toUpperCase() == "PPPOE" )
						{
							// 连接状态
							if ( singleWan.ConnectionTrigger == "Manual" || singleWan.ConnectionTrigger == "AlwaysOn" )//手动连接或者自动连接
							{
								if ( singleWan.ConnectionStatus == 'Connected' )
								{
									if ( singleWan.ConnectionType == "IP_Routed" && singleWan.iporppp == '2')
									{
										ipv4HTML += '<td>up ' + formatTime2(singleWan.Uptime) + '<br/><input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_0_v4" onclick="manualconn(this.id)" value="'+ "disconnect".i18n() +'"></td>';
									}
									else
									{
										ipv4HTML += '<td>up <br/><input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_0_v4" onclick="manualconn(this.id)" value="'+ "disconnect".i18n() +'"></td>';
									}
								}
								else
								{
									if ( singleWan.ConnectionType == "IP_Routed" && singleWan.iporppp == '2')
									{
										ipv4HTML += '<td>' + "down 0sec" + '<br/><input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_1_v4" onclick="manualconn(this.id)" value="'+ "connect".i18n() +'"></td>';
									}
									else
									{
										ipv4HTML += '<td>' + "down " + '<br/><input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_1_v4" onclick="manualconn(this.id)" value="'+ "connect".i18n() +'"></td>';
									}
								}
							}
							else
							{
								if ( singleWan.ConnectionStatus == 'Unconfigured' )
								{
									ipv4HTML += '<td>' + "disconnect".i18n() + '</td>';
								}
								else if ( singleWan.ConnectionStatus == 'Connecting' || singleWan.ConnectionStatus == 'Authenticating')
								{
									ipv4HTML += '<td>' + "connecting".i18n() + '</td>';
								}
								else if ( singleWan.ConnectionStatus == 'Connected' )
								{
									if ( singleWan.ConnectionType == "IP_Routed" && singleWan.iporppp == '2')
									{
										ipv4HTML += '<td>up ' + formatTime2(singleWan.Uptime) + '</td>';
									}
									else
									{
										ipv4HTML += '<td>up </td>';
									}
								}
								else if ( singleWan.ConnectionStatus == 'Disconnected' )
								{
									ipv4HTML += '<td>' + "connectionfailed".i18n() + '</td>';
								}
								else
								{
									ipv4HTML += '<td>' + "disconnect".i18n() + '</td>';
								}
							}
							ipv4HTML += '<td>PPPoE</td>';
						}
						else
						{
							// 连接状态
							if ( singleWan.ConnectionStatus == 'Unconfigured' )
							{
								ipv4HTML += '<td>' + "disconnect".i18n() + '</td>';
							}
							else if ( singleWan.ConnectionStatus == 'Connecting' || singleWan.ConnectionStatus == 'Authenticating')
							{
								ipv4HTML += '<td>' + "connecting".i18n() + '</td>';
							}
							else if ( singleWan.ConnectionStatus == 'Connected' )
							{
								if ( singleWan.ConnectionType == "IP_Routed" && singleWan.iporppp == '1')
								{
									ipv4HTML += '<td>up ' + formatTime2(singleWan.Uptime) + '</td>';
								}
								else
								{
									ipv4HTML += '<td>up </td>';
								}
							}
							else if ( singleWan.ConnectionStatus == 'Disconnected' )
							{
								ipv4HTML += '<td>' + "connectionfailed".i18n() + '</td>';
							}
							else
							{
								ipv4HTML += '<td>' + "disconnect".i18n() + '</td>';
							}
							ipv4HTML += '<td>' + singleWan.AddressingType + '</td>';
						}
						
						if ( singleWan.ConnectionType == 'PPPoE_Bridged' )
						{
							ipv4HTML += '<td></td>';
							ipv4HTML += '<td></td>';
							ipv4HTML += '<td></td>';
							ipv4HTML += '<td></td>';
							ipv4HTML += '<td></td>';
						}
						else
						{
							if ( singleWan.ConnectionStatus == 'Connected' || singleWan.AddressingType == 'Static' )
							{
								ipv4HTML += '<td>' + singleWan.ExternalIPAddress + '</td>';
								if ( singleWan.AddressingType.toUpperCase() == 'PPPOE' )
								{
									ipv4HTML += '<td>255.255.255.255</td>';
									ipv4HTML += '<td>' + singleWan.RemoteIPAddress + '</td>';
								}
								else
								{
									ipv4HTML += '<td>' + singleWan.SubnetMask + '</td>';
									ipv4HTML += '<td>' + singleWan.DefaultGateway + '</td>';
								}
								if ( singleWan.DNSSevers == '' )
								{
									ipv4HTML += '<td></td>';
									ipv4HTML += '<td></td>';
								}
								else
								{
									var dns = singleWan.DNSServers + ',';
									ipv4HTML += '<td>' + dns.split(',')[0] + '</td>';
									ipv4HTML += '<td>' + dns.split(',')[1] + '</td>';
								}
							}
							else
							{
								ipv4HTML += '<td></td>';
								ipv4HTML += '<td></td>';
								ipv4HTML += '<td></td>';
								ipv4HTML += '<td></td>';
								ipv4HTML += '<td></td>';
							}
						}
						ipv4HTML += '</tr>';
					}
					else
					{
						ipv4HTML += '<td>' + "turnoff".i18n() + '</td>';
						
						//// 地址获取方式
						if ( singleWan.AddressingType.toUpperCase() == "PPPOE" )
						{
							// 连接状态
							if ( singleWan.ConnectionTrigger == "Manual" || singleWan.ConnectionTrigger == "AlwaysOn" )//手动连接或者自动连接
							{
								ipv4HTML += '<td>' + "down 0sec" + '<br/><input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_1_v4" onclick="manualconn(this.id)" value="'+ "connect".i18n() +'"></td>';
							}
							else
							{
								ipv4HTML += '<td>' + "disconnect".i18n() + '</td>';
							}
							ipv4HTML += '<td>PPPoE</td>';
						}
						else
						{
							ipv4HTML += '<td>' + "disconnect".i18n() + '</td>';
							ipv4HTML += '<td>' + singleWan.AddressingType + '</td>';
						}

						ipv4HTML += '<td></td>';
						ipv4HTML += '<td></td>';
						ipv4HTML += '<td></td>';
						ipv4HTML += '<td></td>';
						ipv4HTML += '<td></td>';
						ipv4HTML += '</tr>';	
					}
				}
				
				if ( singleWan.IPMode == 2 || singleWan.IPMode == 3 ) //ipv6
				{
					ipv6wannum = ipv6wannum + 1;
				
					if (ipv6wannum%2 == 1)
					{
						ipv6HTML += '<tr class="oddtr">';
					}
					else
					{
						ipv6HTML += '<tr>';
					}
				
					// 连接名称
					ipv6HTML += '<td>' + singleWan.Name + '</td>';
					// 使能状态
					if ( singleWan.Enable == 1 )
					{
						ipv6HTML += '<td>' + "turnon".i18n() + '</td>';
						
						//// 地址获取方式
						if ( singleWan.AddressingType.toUpperCase() == "PPPOE" )
						{
							// 连接状态
							if ( singleWan.ConnectionTrigger == "Manual" || singleWan.ConnectionTrigger == "AlwaysOn" )//手动连接或者自动连接
							{
								if ( singleWan.IPv6ConnStatus == 'Connected' )
								{
									if ( singleWan.ConnectionType == "IP_Routed" && singleWan.iporppp == '2')
									{
										ipv6HTML += '<td>up ' + formatTime2(singleWan.Uptime) + '<input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_0_v6" onclick="manualconn(this.id)" value="'+ "disconnect".i18n() +'"></td>';
									}
									else
									{
										ipv6HTML += '<td>up <input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_0_v6" onclick="manualconn(this.id)" value="'+ "disconnect".i18n() +'"></td>';
									}						
								}
								else
								{
									if ( singleWan.ConnectionType == "IP_Routed" && singleWan.iporppp == '2')
									{
										ipv6HTML += '<td>' + "down 0sec" + '<input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_1_v6" onclick="manualconn(this.id)" value="'+ "connect".i18n() +'"></td>';
									}
									else
									{
										ipv6HTML += '<td>' + "down " + '<input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_1_v6" onclick="manualconn(this.id)" value="'+ "connect".i18n() +'"></td>';
									}
								}
							}
							else
							{
								if ( singleWan.IPv6ConnStatus == 'Unconfigured' )
								{
									ipv6HTML += '<td>' + "disconnect".i18n() + '</td>';
								}
								else if ( singleWan.IPv6ConnStatus == 'Connecting' || singleWan.IPv6ConnStatus == 'Authenticating')
								{
									ipv6HTML += '<td>' + "connecting".i18n() + '</td>';
								}
								else if ( singleWan.IPv6ConnStatus == 'Connected' )
								{
									if ( singleWan.ConnectionType == "IP_Routed" && singleWan.iporppp == '2')
									{
										ipv6HTML += '<td>up ' + formatTime2(singleWan.Uptime) + '</td>';
									}
									else
									{
										ipv6HTML += '<td>up </td>';
									}
								}
								else if ( singleWan.IPv6ConnStatus == 'Disconnected' )
								{
									ipv6HTML += '<td>' + "connectionfailed".i18n() + '</td>';
								}
								else
								{
									ipv6HTML += '<td>' + "disconnect".i18n() + '</td>';
								}
							}
						}
						else
						{
							// 连接状态
							if ( singleWan.IPv6ConnStatus == 'Unconfigured' )
							{
								ipv6HTML += '<td>' + "disconnect".i18n() + '</td>';
							}
							else if ( singleWan.IPv6ConnStatus == 'Connecting' || singleWan.IPv6ConnStatus == 'Authenticating')
							{
								ipv6HTML += '<td>' + "connecting".i18n() + '</td>';
							}
							else if ( singleWan.IPv6ConnStatus == 'Connected' )
							{
								if ( singleWan.ConnectionType == "IP_Routed" && singleWan.iporppp == '1')
								{
									ipv6HTML += '<td>up ' + formatTime2(singleWan.Uptime) + '</td>';
								}
								else
								{
									ipv6HTML += '<td>up </td>';
								}
							}
							else if ( singleWan.IPv6ConnStatus == 'Disconnected' )
							{
								ipv6HTML += '<td>' + "connectionfailed".i18n() + '</td>';
							}
							else
							{
								ipv6HTML += '<td>' + "disconnect".i18n() + '</td>';
							}
						}

						if ( singleWan.ConnectionType == 'PPPoE_Bridged' )
						{
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
						}
						else
						{
							// 前缀获取方式
							ipv6HTML += '<td>' + singleWan.IPv6PrefixOrigin + '</td>';
							// IP获取方式
							// ipv6HTML += '<td>' + singleWan.AddressingType + '</td>';
							if(singleWan.IPv6IPAddressOrigin == "AutoConfigured")
							{
								ipv6HTML += '<td>' + "SLAAC" + '</td>';
							}
							else
							{
								ipv6HTML += '<td>' + singleWan.IPv6IPAddressOrigin + '</td>';
							}
							
							// IP地址状态
							if ( singleWan.MFlag == 1 )
							{
								ipv6HTML += '<td>' + "stateful".i18n() + '</td>';
							}
							else
							{
								ipv6HTML += '<td>' + "stateless".i18n() + '</td>';
							}
							if ( singleWan.IPv6ConnStatus == 'Connected' || singleWan.IPv6IPAddressOrigin == 'Static' )
							{
								ipv6HTML += '<td>' + singleWan.IPv6Prefix + '</td>';
								ipv6HTML += '<td>' + singleWan.IPv6IPAddress + '</td>';
								if ( singleWan.IPv6DNSServers == '' )
								{
									ipv6HTML += '<td></td>';
									ipv6HTML += '<td></td>';
								}
								else
								{
									var v6dns = singleWan.IPv6DNSServers + ',';
									ipv6HTML += '<td>'+ v6dns.split(',')[0] +'</td>';
									ipv6HTML += '<td>'+ v6dns.split(',')[1] +'</td>';
								}
							}
							else
							{
								ipv6HTML += '<td></td>';
								ipv6HTML += '<td></td>';
								ipv6HTML += '<td></td>';
								ipv6HTML += '<td></td>';
							}
						}
					}
					else
					{
						ipv6HTML += '<td>' + "turnoff".i18n() + '</td>';
						
						//// 地址获取方式
						if ( singleWan.AddressingType.toUpperCase() == "PPPOE" )
						{
							// 连接状态
							if ( singleWan.ConnectionTrigger == "Manual" || singleWan.ConnectionTrigger == "AlwaysOn" )//手动连接或者自动连接
							{
								if (singleWan.ConnectionType == "IP_Routed" && singleWan.iporppp == '2')
								{
									ipv6HTML += '<td>' + "down 0sec" + '<input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_1_v6" onclick="manualconn(this.id)" value="'+ "connect".i18n() +'"></td>';
								}
								else
								{
									ipv6HTML += '<td>' + "down" + '<input type="button" class="input_button_small input_button_heightwidth_unset" id="' + singleWan.wan_index + '_' + singleWan.wan_session_index + '_1_v6" onclick="manualconn(this.id)" value="'+ "connect".i18n() +'"></td>';
								}
							}
							else
							{
								ipv6HTML += '<td>' + "disconnect".i18n() + '</td>';
							}
						}
						else
						{
							ipv6HTML += '<td>' + "disconnect".i18n() + '</td>';
						}

						ipv6HTML += '<td></td>';
						ipv6HTML += '<td></td>';
						ipv6HTML += '<td></td>';
						ipv6HTML += '<td></td>';
						ipv6HTML += '<td></td>';
						ipv6HTML += '<td></td>';
						ipv6HTML += '<td></td>';
					}

				}
			}
			}
		}
	}
	if (ipv4wannum == 0)
	{
		ipv4HTML += '<tr><td colspan="9" align="center">' + "nodata".i18n() + '</td></td>';
	}
	
	if (ipv6wannum == 0)
	{
		ipv6HTML += '<tr><td colspan="10" align="center">' + "nodata".i18n() + '</td></td>';
	}
	
	$("#wancfgv4").html(ipv4HTML);
	$("#wancfgv6").html(ipv6HTML);
}


function manualconn(eid)
{
	var postdata = new Object();
	postdata.wan_index = eid.split('_')[0];
	postdata.wan_session_index = eid.split('_')[1];
	postdata.Enable = eid.split('_')[2];
	
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("pppmanualconn", postdata, parseWanData);
	showOrHideLoadingWindowFromIframe("show");
}






