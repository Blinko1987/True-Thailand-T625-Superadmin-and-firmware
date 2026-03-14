var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	$('#Table_wan1_2_table').html("unconfigured".i18n());
	$('#Table_wan2_2_table').html("unconfigured".i18n());
	$('#Table_wan3_2_table').html("unconfigured".i18n());		
	$('#Table_wan4_2_table').html("unconfigured".i18n());
	$('#Table_wan5_2_table').html("unconfigured".i18n());
	$('#Table_wan6_2_table').html("unconfigured".i18n());

	XHR.get("get_login_user", null, parseLoginUser);
	
	getData();
});

var wifinameobj;
var lanportnum;

function parseLoginUser(getdata){
	if ( getdata )
	{
		tokenstr = getdata.token;
		if(getdata.login_user == 1){
           $("#cumulativeuptimetr").show();
		}else{
		   $("#cumulativeuptimetr").hide();
		}
	}	
}

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/base_info", parseBaseInfo);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_base_info", null, parseBaseInfo);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseBaseInfo(data)
{
	tokenstr = data.token;
	var tr69_wan_exist = 0;

	XHR.get("get_allwan_name", null, function(data){
		if ( data && data.wan )
		{
			tokenstr = data.token;
			for (var i=0; i< data.wan.length; i++ )
			{
				var singlename = data.wan[i].Name.toUpperCase();
				if ( singlename.indexOf("TR069") >= 0 )
				{
					tr69_wan_exist = 1;
					break;
				}
			}
		}
	});
	
	//wan, todo
	XHR.get("get_allwan_info", null, function(data){
		if ( data != null )
		{
			tokenstr = data.token;
			wifinameobj = data.wifi_obj_enable;
			
			var wan_num = 0;
			lanportnum = data.lan_port_num;
			all_wan_info = data;
			if ( all_wan_info != '' && all_wan_info.wan )
			{
				wan_num = all_wan_info.wan.length;
			}
			if ( wan_num > 0 )
			{
				for (var i=0; i< wan_num; i++)
				{
					var single_wan = all_wan_info.wan[i];
					var singlename = single_wan.Name.toUpperCase();
					
					if(single_wan.wan_index == 3 && single_wan.wan_session_index == 1 && single_wan.Name == "THSi")//true custom wan, cannot show
					{
						continue;
					}
					
					//INTERNET WAN
					if ( singlename.indexOf("INTERNET") >= 0 )
					{
						var internetport="";
						if(single_wan.LanInterface != "")
						{
							internetport=PORTBAND(single_wan.LanInterface);
						}
						if (single_wan.IPMode != 2)//ipv4
						{
							if(single_wan.ConnectionStatus == "Connected")
							{
								$('#Table_wan1_2_table').html("available".i18n());
							}
							else
							{
								$('#Table_wan1_2_table').html("unavailable".i18n());
							}			
							if(singlename.indexOf('INTERNET_B') >0)
							{
								$('#Table_wan1_3_table').html("IPv4");
								$('#Table_wan1_4_table').html("bridge_pcdail".i18n());
								$('#Table_wan1_5_table').html("&nbsp" + internetport);
								$('#Table_wan1_6_table').html(single_wan.Name);
							}
							else if(singlename.indexOf('INTERNET_R') >0 && single_wan.ConnectionType == "IP_Routed" && single_wan.iporppp == '2')
							{
								$('#Table_wan1_3_table').html("IPv4");
								$('#Table_wan1_4_table').html("router_gwdail".i18n());
								$('#Table_wan1_5_table').html("&nbsp" + internetport);			
								$('#Table_wan1_6_table').html(single_wan.Name);
							}
							else if(singlename.indexOf('INTERNET_R') >0 && single_wan.ConnectionType == "IP_Routed" && single_wan.iporppp == '1')
							{
								$('#Table_wan1_3_table').html("IPv4");
								$('#Table_wan1_4_table').html("route".i18n());
								$('#Table_wan1_5_table').html("&nbsp" + internetport);			
								$('#Table_wan1_6_table').html(single_wan.Name);
							}
							else
							{
								//document.getElementById('Table_wan1_2_table').key = "Return_unconfig";
								$('#Table_wan1_2_table').html("unconfigured".i18n());
							}
						}
						if (single_wan.IPMode != 1)//ipv6
						{
							if(single_wan.IPv6ConnStatus == "Connected")
							{
								$('#Table_wan2_2_table').html("available".i18n());
							}
							else
							{
								$('#Table_wan2_2_table').html("unavailable".i18n());
							}		
							if(singlename.indexOf('INTERNET_B') >0)
							{
								$('#Table_wan2_3_table').html("IPv6");
								$('#Table_wan2_4_table').html("bridge_pcdail".i18n());
								$('#Table_wan2_5_table').html("&nbsp" + internetport);			
								$('#Table_wan2_6_table').html(single_wan.Name);
							}
							else if(singlename.indexOf('INTERNET_R') >0 && single_wan.ConnectionType == "IP_Routed" && single_wan.iporppp == '2')
							{
								$('#Table_wan2_3_table').html("IPv6");
								$('#Table_wan2_4_table').html("router_gwdail".i18n());				
								$('#Table_wan2_5_table').html("&nbsp" + internetport);				
								$('#Table_wan2_6_table').html(single_wan.Name);
							}
							else if(singlename.indexOf('INTERNET_R') >0 && single_wan.ConnectionType == "IP_Routed" && single_wan.iporppp == '1')
							{
								$('#Table_wan2_3_table').html("IPv6");
								$('#Table_wan2_4_table').html("route".i18n());
								$('#Table_wan2_5_table').html("&nbsp" + internetport);			
								$('#Table_wan2_6_table').html(single_wan.Name);
							}
							else
							{
								$('#Table_wan2_2_table').html("unconfigured".i18n());				
							}
						}
					}
					
					//ITV WAN
					if ( singlename.indexOf("OTHER") >= 0 )
					{
						var itvport="";
						if(single_wan.LanInterface != "")
						{
							itvport=PORTBAND(single_wan.LanInterface);
						}
						
						if(single_wan.IPMode != 2)//ipv4
						{
							if(single_wan.ConnectionStatus == "Connected")
							{
								$('#Table_wan3_2_table').html("available".i18n());	
							}
							else
							{
								$('#Table_wan3_2_table').html("unavailable".i18n());	
							}
							if(singlename.indexOf('OTHER_B') >0)
							{
								$('#Table_wan3_3_table').html("IPv4");
								$('#Table_wan3_4_table').html("bridge".i18n());	
								$('#Table_wan3_5_table').html("&nbsp" + itvport);		
								$('#Table_wan3_6_table').html(single_wan.Name);	
							}
							else if(singlename.indexOf('OTHER_R') >0)
							{
								$('#Table_wan3_3_table').html("IPv4");
								$('#Table_wan3_4_table').html("route".i18n());	
								$('#Table_wan3_5_table').html("&nbsp" + itvport);		
								$('#Table_wan3_6_table').html(single_wan.Name);	
							}
							else
							{
								$('#Table_wan3_2_table').html("unconfigured".i18n());				
							}  
						}
						if(single_wan.IPMode != 1)//ipv6
						{
							if(single_wan.IPv6ConnStatus == "Connected")
							{
								$('#Table_wan4_2_table').html("available".i18n());	
							}
							else
							{
								$('#Table_wan4_2_table').html("unavailable".i18n());
							}
							if(singlename.indexOf('OTHER_B') >0)
							{
								$('#Table_wan4_3_table').html("IPv6");
								$('#Table_wan4_4_table').html("bridge".i18n());	
								$('#Table_wan4_5_table').html("&nbsp" + itvport);		
								$('#Table_wan4_6_table').html(single_wan.Name);	
							}
							else if(singlename.indexOf('OTHER_R') >0)
							{
								$('#Table_wan4_3_table').html("IPv6");
								$('#Table_wan4_4_table').html("route".i18n());	
								$('#Table_wan4_5_table').html("&nbsp" + itvport);		
								$('#Table_wan4_6_table').html(single_wan.Name);	
							}
							else
							{
								$('#Table_wan4_2_table').html("unconfigured".i18n());				
							}			    
						}
					}
					
					//VOICE WAN
					if ( singlename.indexOf("VOICE") >= 0 )
					{
						if(single_wan.IPMode == 1)
						{
							$('#Table_wan5_3_table').html("IPv4");
							if(single_wan.ConnectionStatus == "Connected")
							{
								$('#Table_wan5_2_table').html("available".i18n());	
							}
							else
							{
								$('#Table_wan5_2_table').html("unavailable".i18n());
							}			
						}
						else if(single_wan.IPMode == 2)
						{
							$('#Table_wan5_3_table').html("IPv6");
							if(single_wan.IPv6ConnStatus == "Connected")
							{
								$('#Table_wan5_2_table').html("available".i18n());	
							}
							else
							{
								$('#Table_wan5_2_table').html("unavailable".i18n());
							}			
						}
						else if(single_wan.IPMode == 3)
						{
							$('#Table_wan5_3_table').html("IPv4&IPv6");
							if(single_wan.ConnectionStatus == "Connected")
							{
								$('#Table_wan5_2_table').html("available".i18n());	
							}
							else
							{
								$('#Table_wan5_2_table').html("unavailable".i18n());
							}			
						}
						$('#Table_wan5_4_table').html("route".i18n());
						$('#Table_wan5_5_table').html("phone".i18n());
						$('#Table_wan5_6_table').html(single_wan.Name);
					}
					
					//TR069 WAN
					if ( singlename.indexOf("TR069") >= 0 )
					{
						if(single_wan.IPMode == 1)
						{
							$('#Table_wan6_3_table').html("IPv4");
							if(single_wan.ConnectionStatus == "Connected")
							{
								$('#Table_wan6_2_table').html("available".i18n());	
							}
							else
							{
								$('#Table_wan6_2_table').html("unavailable".i18n());
							}			
						}
						else if(single_wan.IPMode == 2)
						{
							$('#Table_wan6_3_table').html("IPv6");
							if(single_wan.IPv6ConnStatus == "Connected")
							{
								$('#Table_wan6_2_table').html("available".i18n());	
							}
							else
							{
								$('#Table_wan6_2_table').html("unavailable".i18n());
							}			
						}
						else if(single_wan.IPMode == 3)
						{
							$('#Table_wan6_3_table').html("IPv4&IPv6");
							if(single_wan.ConnectionStatus == "Connected")
							{
								$('#Table_wan6_2_table').html("available".i18n());	
							}
							else
							{
								$('#Table_wan6_2_table').html("unavailable".i18n());
							}			
						}
						$('#Table_wan6_4_table').html("route".i18n());
						$("#Table_wan6_6_table").html(single_wan.Name);
					}
				}
			}
		}
	});
	
	//wifi, todo
	XHR.get("wlanBasicSettings", null, function(data){
		if ( data && data.success == 'true' )
		{
			tokenstr = data.token;
			$("#wifiname").html(data.data.SSID);
			$("#wifipwd").html(data.data.PreSharedKey);
			if (data.data.Enable == '1')
			{
				$("#wifistatus").html("turnon".i18n());
			}
			else
			{
				$("#wifistatus").html("turnoff".i18n());
			}
			if (data.data.BeaconType == "None")
			{
				$("#wifisecurity").html("turnoff".i18n());
			}
			else
			{
				$("#wifisecurity").html("turnon".i18n());
			}
		}
	});
	

	//base
	//$("#pontype").html(data.WANAccessType);
	
	/* if (data.ponmode == 0)
	{
		$("#pontype").html("type_epon".i18n());
	}
	else if(data.ponmode == 5)
	{
		$("#pontype").html("type_xgspon".i18n());
	}
	else if(data.ponmode == 4)
	{
		$("#pontype").html("type_xgpon".i18n());
	}
	else if(data.ponmode == 3)
	{
		$("#pontype").html("type_epon10gs".i18n());
	}
	else if(data.ponmode == 2)
	{
		$("#pontype").html("type_epon10g".i18n());
	}
	else if(data.ponmode == 1)
	{
		$("#pontype").html("type_gpon".i18n());
	}
 */
	$("#pontype").html("GPON ONU");
	
	$("#Manufacturer").html(data.Manufacturer);
	$("#HardwareVersion").html(data.HardwareVersion);
	$("#SoftwareVersion").html(data.SoftwareVersion);
	$("#SerialNumber").html(data.SerialNumber);
	$("#ModelName").html(data.ModelName);
	$("#MicroAgent").html(data.MicroAgent);
	
	$("#CPUTemp").html(data.CPUTemp);
	
	if (data.CPURate != undefined)
	{
		var tmpstr = data.CPURate;
		tmpstr += "%";
		$("#CPURate").html(tmpstr);
	}
	
	if (data.MemRate != undefined)
	{
		var tmpstr = data.MemRate;
		tmpstr += "%";
		$("#MemRate").html(tmpstr);
	}
	if (data.uptime != undefined)
	{
		var uptime = timemm(data.uptime);
		$("#uptime").html(uptime);
	}
	if (data.cumulativeuptime != undefined)
	{
		var currentcumulativeuptime = timemm(data.cumulativeuptime);
		$("#cumulativeuptime").html(currentcumulativeuptime);
	}
	
	//pon
	$("#pon_protocol").html(data.WANAccessType);
	if ( data.isLos == 1 )
	{
		$("#pon_link_state").html("fiber_linked".i18n());
	}
	else
	{
		$("#pon_link_state").html("fiber_unlink".i18n());
	}
	//todo, pon_linktime
	if ( data.regSuccTime > 0 )
	{
		$("#pon_linktime").html(parseInt(data.uptime) - parseInt(data.regSuccTime));
	}
	else
	{
		$("#pon_linktime").html('');
	}
	// $("#pon_linktime").html(data.pon_linktime);
	
	$("#power_send").html(data.txpower);
	$("#power_receive").html(data.rxpower);
	//register info
	$("#loid").html(data.loid);
	if ( data.isLos == 1 )
	{
		if ( data.authStatus == 1 )
		{
			$("#olt_status").html("reg_unauth".i18n());
		}
		else if ( data.authStatus == 2 )
		{
			$("#olt_status").html("reg_auth".i18n());
		}
		else
		{
			$("#olt_status").html("unreg_unauth".i18n());
		}
	}
	else
	{
		$("#olt_status").html("fiber_unlink".i18n());
	}
	
	if ( tr69_wan_exist == 1 )
	{
		// if ( data.loid_result == 99 )
		// {
		// 	$("#itms_status").html("unregister".i18n());
		// }
		// else if ( data.loid_result == 1 )
		// {
			if (data.tr069ipstatus == 1 && data.informstatus == 8)
			{
				$("#itms_status").html("reg_succ".i18n());
			}
			else
			{
				$("#itms_status").html("unregister".i18n());
			}
		// }
		// else
		// {
		// 	$("#itms_status").html("reg_fail".i18n());
		// }
	}
	else
	{
		$("#itms_status").html("unreg_notr69".i18n());
	}
	

	XHR.get("get_laneth_info", null, function(data){
            var dynamicHTML = '';

			dynamicHTML += '<tr class="table-header"><th colspan="3">'+ "user_ethport_info".i18n() +'</th></tr>';

			// lanport_info
			for ( i=1; i<=data.lan_status.lan_port_num; i++ )
			{

				var lan_status = eval('data.lan_status.Status' + i);
				//var lan_mac = eval('data.lan_status.MACAddress' + i);
				if (i%2 == 1)
				{
					trclass = "oddtr";
				}
				else
				{
					trclass = "eventr";
				}
							
				dynamicHTML += '<tr class="'+ trclass +'">';
				dynamicHTML += '<td class="table_title" width="38%">' + "lan".i18n() + i + '</td>';
				if ( lan_status == 'Up' )
				{
					dynamicHTML += '<td width="31%">' + "conn_dev".i18n() + '</td>';
					// if (lan_mac.length == 12)
					// {
					// 	dynamicHTML += '<td width="31%">' + macaddcolon(lan_mac) + '</td>';
					// }
					// else
					// {
					// 	dynamicHTML += '<td width="31%">' + lan_mac + '</td>';
					// }
				}
				else
				{
					dynamicHTML += '<td width="31%">' + "unconn_dev".i18n() + '</td>';
					// dynamicHTML += '<td width="31%">&nbsp;</td>';
				}
				dynamicHTML += '</tr>';
			}
			$("#lanport_info").html(dynamicHTML);
	});
	//lanport
}

function PORTBAND(portband)
    {
        var aa = "Wired".i18n();
		
	    if(portband.indexOf('dev.eth.1') >=0)
	    {
		    aa += "lan1".i18n();
		    aa += ",";					
	    }
	    if((portband.indexOf('dev.eth.2') >=0) && (lanportnum >=2))
	    {	
			aa += "lan2".i18n();
			aa += ",";			
	    }
	    if((portband.indexOf('dev.eth.3') >=0) && (lanportnum >=3))
	    {
			aa += "lan3".i18n();
			aa += ",";				
	    }
	    if((portband.indexOf('dev.eth.4') >=0) && (lanportnum ==4))
	    {
		    aa += "lan4".i18n();				  
	    }
		aa += "<br>";
		aa += "wireless".i18n();
	    if(portband.indexOf('dev.wla.1') >=0)
	    {
		    aa += wifinameobj.ssid1
		    aa += ",";					
	    }
	    if(portband.indexOf('dev.wla.2') >=0)
	    {
		    aa += wifinameobj.ssid2;	
		    aa += ",";					
	    }
	    if(portband.indexOf('dev.wla.3') >=0)
	    {
		    aa += wifinameobj.ssid3;	
		    aa += ",";					
	    }
	    if(portband.indexOf('dev.wla.4') >=0)
	    {
		    aa += wifinameobj.ssid4;				  
	    }
		
	    if(portband.indexOf('dev.wla.5') >=0)
	    {
			aa += wifinameobj.ssid5;	
		    aa += ",";					
	    }
	    if(portband.indexOf('dev.wla.6') >=0)
	    {	
			aa += wifinameobj.ssid6;	
		    aa += ",";					
	    }
	    if(portband.indexOf('dev.wla.7') >=0)
	    {
			aa += wifinameobj.ssid7;	
		    aa += ",";					
	    }
	    if(portband.indexOf('dev.wla.8') >=0)
	    {
			aa += wifinameobj.ssid8;				
	    }
		if(portband.indexOf('dev.wla.9') >=0)
	    {
			aa += wifinameobj.ssid9;				
	    }
		if(portband.indexOf('dev.wla.10') >=0)
	    {
			aa += wifinameobj.ssid10;				
	    }
		if(portband.indexOf('dev.wla.11') >=0)
	    {	
			aa += wifinameobj.ssid11;				
	    }
		if(portband.indexOf('dev.wla.12') >=0)
	    {	
			aa += wifinameobj.ssid12;				
	    }
		if(portband.indexOf('dev.wla.13') >=0)
	    {	
			aa += wifinameobj.ssid13;				
	    }
		if(portband.indexOf('dev.wla.14') >=0)
	    {
			aa += wifinameobj.ssid14;				
	    }
		if(portband.indexOf('dev.wla.15') >=0)
	    {
			aa += wifinameobj.ssid15;				
	    }
		if(portband.indexOf('dev.wla.16') >=0)
	    {	
			aa += wifinameobj.ssid16;				
	    }
	    return aa;
    }
	
function timemm(timedate){
	var hh,mm,dd = 0;
	var timestr = '';
    if(timedate < 60){
        timestr = '00 Day 00 Hour 00 Minute';
	}else{
	   mm = parseInt(timedate / 60);
	   if(mm > 24 * 60){
		  dd = parseInt(timedate / (3600 * 24));   
		  hh = parseInt(timedate / 3600 % 24);
		  mm = parseInt(timedate % 3600 / 60);  
	   }else{
		  hh = parseInt(timedate / 3600);
		  mm = parseInt(timedate % 3600 / 60);   
	   }

	   if(dd <= 1){
		  dd = "0" + dd + "dayss".i18n(); 
	   }else if(dd >= 1 && dd < 10){
		  dd = "0" + dd + "daysss".i18n();  
	   }else if(dd > 9){
		  dd = dd + "daysss".i18n();
	   }

       if(hh <= 1){
		  hh = "0" + hh + "hours".i18n(); 
	   }else if(hh >= 1 && hh < 10){
		  hh = "0" + hh + "hourss".i18n();  
	   }else if(hh > 9){
		  hh = hh + "hourss".i18n();
	   }

	   if(mm <= 1){
		   mm = "0" + mm + "minutes".i18n();
	   }else if(mm >= 1 && mm < 10){
		   mm = "0" + mm + "minutess".i18n()
	   } else if(mm > 9){
		   mm = mm + "minutess".i18n();
	   }

       timestr = dd + hh + mm ;
	}

	return timestr;
}
