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
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	var hostHTML = '';
	if ( data && data.lan_status )
	{
		var landata = data.lan_status;
		var index = 0;
		for (i=1; i<=landata.max_lan_host_num; i++)
		{
			if(eval('landata.Active' + i) == "1")
			{
				if ( eval('landata.MACAddress' + i) )
				{
					var lan_mac = eval('landata.MACAddress' + i);
					index++;
					
					if (index%2 == 1)
					{
						hostHTML += '<tr class="oddtr">';
					}
					else
					{
						hostHTML += '<tr>';
					}
					
					hostHTML += '<td>' + eval(index) + '</td>';
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
					hostHTML += '<td>' + eval('landata.DeviceType' + i) + '</td>';
					hostHTML += '</tr>';
				}
			}
		}
	}
	
	$("#lan_host").html(hostHTML);
}
