var glandata = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	XHR.get("get_lan_status", null, function(data){
		if (data && data.lan_status)
		{
			glandata = data.lan_status;
		}
	});
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wifi_info", parseGetData);
	}
	else
	{
		XHR.get("get_associated_deviceinfo", null, parseGetData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	ssidinfoHTML = '';
	var j = 0;
	
	if ( data && data.associated_deviceinfo )
	{
		var associated_device_data = data.associated_deviceinfo;
		
		for ( var i=1; i<=associated_device_data.maxnum; i++ )
		{
			if ( eval("associated_device_data.MACAddress" + i) && eval("associated_device_data.Olinetime" + i) != 0)
			{
				j = j + 1;
				
				if (j%2 == 1)
				{
					ssidinfoHTML += '<tr class="oddtr">';
				}
				else
				{
					ssidinfoHTML += '<tr class="eventr">';
				}
				
				var found = 0;
				for (k=1; k<=glandata.max_lan_host_num; k++)
				{
					
					if( eval('glandata.MACAddress' + k) && eval('glandata.portid' + k) != "MeshSlaveAP" )
					{
						var tmp_mac = "";
						var lan_mac = eval('glandata.MACAddress' + k);
						if(lan_mac.length == 12)
						{
							tmp_mac = macaddcolon(lan_mac);
						}
						else
						{
							tmp_mac = lan_mac;
						}
					
						if (tmp_mac.toUpperCase() == eval("associated_device_data.MACAddress" + i).toUpperCase())
						{
							found = 1;
							ssidinfoHTML += '<td>' + eval('glandata.HostName' + k) + '</td>';
							ssidinfoHTML += '<td>' + eval('glandata.IPAddress' + k) + '</td>';
							break;
						}
					}
				}
				
				if (found != 1)
				{
					ssidinfoHTML += '<td> </td>';
					ssidinfoHTML += '<td> </td>';
				}
				
				ssidinfoHTML += '<td>' + eval("associated_device_data.MACAddress" + i) + '</td>';
				ssidinfoHTML += '<td>' + eval("associated_device_data.Mode" + i) + '</td>';
				ssidinfoHTML += '<td>' + eval("associated_device_data.TXRate" + i) + '</td>';
				ssidinfoHTML += '<td>' + eval("associated_device_data.RXRate" + i) + '</td>';
				ssidinfoHTML += '<td>' + eval("associated_device_data.RSSI" + i) + '</td>';
				ssidinfoHTML += '<td>' + eval("associated_device_data.SNR" + i) + '</td>';
				ssidinfoHTML += '<td>' + eval("associated_device_data.Signalstrength" + i) + '</td>';
				ssidinfoHTML += '<td>' + formatTime2(eval('associated_device_data.Olinetime' + i)) + '</td>';
				ssidinfoHTML += '</tr>';
			}
		}
	}
	if (j == 0)
	{
		ssidinfoHTML += '<tr><td colspan="10" align="center">' + "nodata".i18n() + '</td></td>';
	}
	
	$("#associateddeviceinfo").html(ssidinfoHTML);
}

function refreshApply()
{
	if ( parent && parent.gLastOperateTime != undefined )
	{
		parent.gLastOperateTime = new Date().getTime();
	}
	window.location.reload();
}
