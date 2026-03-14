
var login_user = '0'; //use common as default

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	getData();
});

XHR.get("get_login_user", null, function(data){
        if ( data )
		{
			tokenstr = data.token;
			login_user = data.login_user;
		}
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wifi_info", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_wifi_status", null, parseGetData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	wlaninfoHTML = '';
	packinfoHTML = '';
	packinfoHTML_5G = '';
	ssidinfoHTML = '';
	ssidinfoHTML_5G = '';
	var showwifinum = 0;
	
	if ( data && data.wifi_status )
	{
		var wifidata = data.wifi_status;
		
		//2g wifi
		wlaninfoHTML += '<tr class="oddtr">';
		wlaninfoHTML += '<td>2G-1</td>';
		if ( wifidata.enable == 1 )
		{
			wlaninfoHTML += '<td>'+ "turnon".i18n() +'</td>';
		}
		else
		{
			wlaninfoHTML += '<td>'+ "turnoff".i18n() +'</td>';
		}
		
		if ( wifidata.channel == 0 )
		{
			wlaninfoHTML += '<td>Auto</td>';
		}
		else
		{
			wlaninfoHTML += '<td>' + eval("wifidata.channel") + '</td>';
		}
		
		wlaninfoHTML += '</tr>';
		
		//5g wifi
		wlaninfoHTML += '<tr>';
		wlaninfoHTML += '<td>5G-1</td>';
		if ( wifidata.enable5g == 1 )
		{
			wlaninfoHTML += '<td>'+ "turnon".i18n() +'</td>';
		}
		else
		{
			wlaninfoHTML += '<td>'+ "turnoff".i18n() +'</td>';
		}
		
		if ( wifidata.channel5g == 0 )
		{
			wlaninfoHTML += '<td>Auto</td>';
		}
		else
		{
			wlaninfoHTML += '<td>' + eval("wifidata.channel5g") + '</td>';
		}
		
		wlaninfoHTML += '</tr>';
		
		var wifinum = 0; 
		if (login_user == 1){
			wifinum = eval("wifidata.actual_wifi_num");
		}else{
			wifinum = 8;
		}

		for ( i=1; i<=wifinum; i++ )
		{
			if( i == 12 || i == 16){
				continue;
			}
			if ( eval("wifidata.Enable" + i) == 1)
			{
				showwifinum = showwifinum + 1;
				
				if (i==1 || i ==3 || i ==6 || i==8 || i==9 || i==11 || i ==14 )
				{
					trclass = "oddtr";
				}
				else
				{
					trclass = "eventr";
				}
		        if( i < 5 || i == 9 || i == 10 || i == 11){
		        	packinfoHTML += '<tr class="'+ trclass +'">';
		        }else{
		        	packinfoHTML_5G += '<tr class="'+ trclass +'">';
		        }

				// packinfoHTML += '<td>' + i + '</td>';
				if ( i <= 4 && i < 5) //2g wifi
				{
					packinfoHTML += '<td>2G-' + i + '</td>';
				}
				else if( i > 4 && i < 9)//5g wifi
				{
					packinfoHTML_5G += '<td>5G-' + (i-4) + '</td>';
				}
				else if( i > 8 && i < 12)
				{
					packinfoHTML += '<td>2G-' + (i-4) + '</td>';
				}
                else if( i > 12 && i< 16)
                {
                    packinfoHTML_5G += '<td>5G-' + (i-8) + '</td>';
                }
				
				if(i != 12 || i!= 16){
					if( i < 5 || i == 9 || i == 10 || i == 11){
						packinfoHTML += '<td>' + eval("wifidata.SSID" + i).replace(/\s/g,'&nbsp') + '</td>';
						packinfoHTML += '<td>' + eval("wifidata.TotalBytesReceived" + i) + '</td>';
						packinfoHTML += '<td>' + eval("wifidata.TotalPacketsReceived" + i) + '</td>';
						packinfoHTML += '<td>' + eval("wifidata.TotalBytesSent" + i) + '</td>';
						packinfoHTML += '<td>' + eval("wifidata.TotalPacketsSent" + i) + '</td>';
						packinfoHTML += '</tr>';
					}else{
						packinfoHTML_5G += '<td>' + eval("wifidata.SSID" + i).replace(/\s/g,'&nbsp') + '</td>';
						packinfoHTML_5G += '<td>' + eval("wifidata.TotalBytesReceived" + i) + '</td>';
						packinfoHTML_5G += '<td>' + eval("wifidata.TotalPacketsReceived" + i) + '</td>';
						packinfoHTML_5G += '<td>' + eval("wifidata.TotalBytesSent" + i) + '</td>';
						packinfoHTML_5G += '<td>' + eval("wifidata.TotalPacketsSent" + i) + '</td>';
						packinfoHTML_5G += '</tr>';
					}
				}

                if( i < 5 || i == 9 || i == 10 || i == 11){
		        	ssidinfoHTML += '<tr class="'+ trclass +'">';
		        }else{
		        	ssidinfoHTML_5G += '<tr class="'+ trclass +'">';
		        }
				// ssidinfoHTML += '<td>' + i + '</td>';
				if ( i <= 4 && i < 5) //2g wifi
				{
					ssidinfoHTML += '<td>2G-' + i + '</td>';
				}
				else if( i > 4 && i < 9)//5g wifi
				{
					ssidinfoHTML_5G += '<td>5G-' + (i-4) + '</td>';
				}
				else if( i > 8 && i < 12)
				{
					ssidinfoHTML += '<td>2G-' + (i-4) + '</td>';
				}
                else if( i > 12 && i< 16)
                {
                    ssidinfoHTML_5G += '<td>5G-' + (i-8) + '</td>';
                } 
				
				if( i < 5 || i == 9 || i == 10 || i == 11){
					ssidinfoHTML += '<td>' + eval("wifidata.SSID" + i).replace(/\s/g,'&nbsp') + '</td>';
					if ( eval("wifidata.BeaconType" + i) == "None" )
					{
						ssidinfoHTML += '<td>' + "unconfigured".i18n() + '</td>';
					}
					else
					{
						ssidinfoHTML += '<td>' + "configured".i18n() + '</td>';
					}
					
					if ( eval("wifidata.BasicAuthenticationMode" + i) == "OpenSystem" && eval("wifidata.BeaconType" + i) == "None" )
					{
						ssidinfoHTML += '<td>None</td>';
					}
					else if ( ( eval("wifidata.BasicAuthenticationMode" + i) == "OpenSystem" 
								|| eval("wifidata.BasicAuthenticationMode" + i) == "SharedKey"
								|| eval("wifidata.BasicAuthenticationMode" + i) == "Both" )
							&& eval("wifidata.BeaconType" + i) == "Basic" )
					{
						ssidinfoHTML += '<td>WEP</td>';
					}
					else if ( eval("wifidata.BeaconType" + i) == "WPA" )
					{
						ssidinfoHTML += '<td>WPA</td>';
					}
					else if ( eval("wifidata.BeaconType" + i) == "11i" || eval("wifidata.BeaconType" + i) == "WPA2")
					{
						ssidinfoHTML += '<td>WPA2</td>';
					}
					else if ( eval("wifidata.BeaconType" + i) == "WPA/WPA2" || eval("wifidata.BeaconType" + i) == "WPAand11i" )
					{
						ssidinfoHTML += '<td>WPA/WPA2 Mixed</td>';
					}
					else if ( eval("wifidata.BeaconType" + i) == "WPA2PSKWPA3SAE" )
					{
						ssidinfoHTML += '<td>WPA2/WPA3 Mixed</td>';
					}
					else
					{
						ssidinfoHTML += '<td></td>';
					}
					
					if ( eval("wifidata.WPAEncryptionModes" + i) == "AES" || eval("wifidata.WPAEncryptionModes" + i) == "AESEncryption" )
					{
						ssidinfoHTML += '<td>AES</td>';
					}
					else if ( eval("wifidata.WPAEncryptionModes" + i) == "TKIP" || eval("wifidata.WPAEncryptionModes" + i) == "TKIPEncryption")
					{
						ssidinfoHTML += '<td>TKIP</td>';
					}
					else if ( eval("wifidata.WPAEncryptionModes" + i) == "AES+TKIP" || eval("wifidata.WPAEncryptionModes" + i) == "TKIPandAESEncryption" || eval("wifidata.WPAEncryptionModes" + i) == "TKIP+AESEncryption")
					{
						ssidinfoHTML += '<td>TKIP&AES</td>';
					}
					else
					{
						ssidinfoHTML += '<td></td>';
					}
					ssidinfoHTML += '</tr>';
				}else{
					ssidinfoHTML_5G += '<td>' + eval("wifidata.SSID" + i).replace(/\s/g,'&nbsp') + '</td>';
					if ( eval("wifidata.BeaconType" + i) == "None" )
					{
						ssidinfoHTML_5G += '<td>' + "unconfigured".i18n() + '</td>';
					}
					else
					{
						ssidinfoHTML_5G += '<td>' + "configured".i18n() + '</td>';
					}
					
					if ( eval("wifidata.BasicAuthenticationMode" + i) == "OpenSystem" && eval("wifidata.BeaconType" + i) == "None" )
					{
						ssidinfoHTML_5G += '<td>None</td>';
					}
					else if ( ( eval("wifidata.BasicAuthenticationMode" + i) == "OpenSystem" 
								|| eval("wifidata.BasicAuthenticationMode" + i) == "SharedKey"
								|| eval("wifidata.BasicAuthenticationMode" + i) == "Both" )
							&& eval("wifidata.BeaconType" + i) == "Basic" )
					{
						ssidinfoHTML_5G += '<td>WEP</td>';
					}
					else if ( eval("wifidata.BeaconType" + i) == "WPA" )
					{
						ssidinfoHTML_5G += '<td>WPA</td>';
					}
					else if ( eval("wifidata.BeaconType" + i) == "11i" || eval("wifidata.BeaconType" + i) == "WPA2")
					{
						ssidinfoHTML_5G += '<td>WPA2</td>';
					}
					else if ( eval("wifidata.BeaconType" + i) == "WPA/WPA2" || eval("wifidata.BeaconType" + i) == "WPAand11i" )
					{
						ssidinfoHTML_5G += '<td>WPA/WPA2 Mixed</td>';
					}
					else if ( eval("wifidata.BeaconType" + i) == "WPA2PSKWPA3SAE" )
					{
						ssidinfoHTML_5G += '<td>WPA2/WPA3 Mixed</td>';
					}
					else
					{
						ssidinfoHTML_5G += '<td></td>';
					}
					
					if ( eval("wifidata.WPAEncryptionModes" + i) == "AES" || eval("wifidata.WPAEncryptionModes" + i) == "AESEncryption" )
					{
						ssidinfoHTML_5G += '<td>AES</td>';
					}
					else if ( eval("wifidata.WPAEncryptionModes" + i) == "TKIP" || eval("wifidata.WPAEncryptionModes" + i) == "TKIPEncryption")
					{
						ssidinfoHTML_5G += '<td>TKIP</td>';
					}
					else if ( eval("wifidata.WPAEncryptionModes" + i) == "AES+TKIP" || eval("wifidata.WPAEncryptionModes" + i) == "TKIPandAESEncryption" || eval("wifidata.WPAEncryptionModes" + i) == "TKIP+AESEncryption")
					{
						ssidinfoHTML_5G += '<td>TKIP&AES</td>';
					}
					else
					{
						ssidinfoHTML_5G += '<td></td>';
					}
					ssidinfoHTML_5G += '</tr>';
				}
			}
		}
	}
	
	if (showwifinum == 0)
	{
		packinfoHTML += '<tr><td colspan="6" align="center">' + "nodata".i18n() + '</td></td>';
		ssidinfoHTML += '<tr><td colspan="5" align="center">' + "nodata".i18n() + '</td></td>';
	}
	
	$("#wlaninfo").html(wlaninfoHTML);
	$("#packinfo").html(packinfoHTML + packinfoHTML_5G);
	$("#ssidinfo").html(ssidinfoHTML + ssidinfoHTML_5G);
}
