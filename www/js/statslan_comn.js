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
		getDataByAjax("../fake/statslan", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_laneth_info", null, parseGetData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	var portHTML = '';
	var hostHTML = '';
	//var showhostnum = 0;
	var showportnum = 0;
	
	if ( data && data.lan_status )
	{
		var landata = data.lan_status;
		/* for (i=1; i<=landata.max_lan_host_num; i++)
		{
			if ( eval('landata.MACAddress' + i) && eval('landata.IPAddress' + i) && eval('landata.Active' + i) == 1)
			{
				showhostnum = showhostnum + 1;
				
				if (showhostnum%2 == 1)
				{
					hostHTML += '<tr class="oddtr">';
				}
				else
				{
					hostHTML += '<tr>';
				}
			
				var lan_mac = eval('landata.MACAddress' + i);
				hostHTML += '<td>' + eval('landata.IPAddress' + i) + '</td>';
				if(lan_mac.length == 12)
				{
					hostHTML += '<td>' + macaddcolon(lan_mac) + '</td>';
				}
				else
				{
					hostHTML += '<td>' + lan_mac + '</td>';
				}
				hostHTML += '<td>' + eval('landata.DeviceType' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.HostName' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.DevName' + i) + '</td>';
				var portid = eval('landata.portid' + i);
				var place;
				if ( portid.indexOf(gLanPortHead) >= 0 )
				{
					portid = "LAN" + portid.substr(gLanPortHead.length,1);
				}
				else if ( portid.indexOf(gWifiPortHead) >= 0 )
				{
					portid = "SSID" + portid.substr(gWifiPortHead.length,1);
				}
				hostHTML += '<td>' + portid + '</td>';
				
				var day = parseInt(eval('landata.LeaseTimeRemaining' + i)/86400);
				var day2 = eval('landata.LeaseTimeRemaining' + i)%86400;
				var hours = parseInt(day2/3600);
				var hours2 = day2%3600;
				var minutes = parseInt(hours2/60);
				var minutes2 = hours2%60;
				var second = eval('landata.LeaseTimeRemaining' + i)%60;
				hostHTML += '<td>' + day + "day".i18n() + hours + "hour".i18n() + minutes + "minute".i18n() + second + "second".i18n() +'</td>';
				//hostHTML += '<td>' + eval('landata.Brand' + i) + '</td>';
				//hostHTML += '<td>' + eval('landata.OS' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.RxBytes' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.TxBytes' + i) + '</td>';
				if ( eval('landata.Active' + i) == 1 )
				{
					hostHTML += '<td>' + "online".i18n() + '</td>';
				}
				else
				{
					hostHTML += '<td>' + "offline".i18n() + '</td>';
				}
				hostHTML += '</tr>';
			}
		} */
		
		for (i=1; i<=landata.lan_port_num; i++)
		{
			showportnum = showportnum + 1;
				
			if (showportnum%2 == 1)
			{
				portHTML += '<tr class="oddtr">';
			}
			else
			{
				portHTML += '<tr>';
			}
			
			portHTML += '<td>' + i + '</td>';
			if ( eval('landata.Status' + i) == "Up" )
			{
				if ( eval('landata.LinkDuplex' + i) == "Full" )
				{
					portHTML += '<td>' + "fullduplex".i18n() + '</td>';
				}
				else if ( eval('landata.LinkDuplex' + i) == "Half" )
				{
					portHTML += '<td>' + "halfduplex".i18n() + '</td>';
				}
				else
				{
					portHTML += '<td>' + "auto_negotiation".i18n() + '</td>';
				}
				portHTML += '<td>' + eval('landata.LinkSpeed' + i) + '</td>';
				portHTML += '<td>' + "conn_dev".i18n() + '</td>';
				portHTML += '<td>' + eval('landata.BytesReceived' + i) + '</td>';
				portHTML += '<td>' + eval('landata.PacketsReceived' + i) + '</td>';
				portHTML += '<td>' + eval('landata.BytesSent' + i) + '</td>';
				portHTML += '<td>' + eval('landata.PacketsSent' + i) + '</td>';
			}
			else
			{
				portHTML += '<td></td>';
				portHTML += '<td></td>';
				portHTML += '<td>' + "unconn_dev".i18n() + '</td>';
				portHTML += '<td></td>';
				portHTML += '<td></td>';
				portHTML += '<td></td>';
				portHTML += '<td></td>';
			}
			portHTML += '</tr>';
		}
	}
	
	/* if (showhostnum == 0)
	{
		hostHTML += '<tr><td colspan="10" align="center">' + "nodata".i18n() + '</td></td>';
	} */
	
	if (showportnum == 0)
	{
		portHTML += '<tr><td colspan="8" align="center">' + "nodata".i18n() + '</td></td>';
	}
	
	$("#port_info").html(portHTML);
	//$("#lan_host").html(hostHTML);
}
