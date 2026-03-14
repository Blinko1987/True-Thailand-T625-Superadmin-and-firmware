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
		getDataByAjax("../fake/wifi_info", parseGetData);
	}
	else
	{
		XHR.get("get_wifineighbor_info_5g", null, parseGetData);
	}
	
}

function parseGetData(data)
{
	showOrHideLoadingWindowFromIframe("hide");

	neighborinfoHTML = '';
	var j = 0;
	
	if ( data && data.wifinerghbor_info )
	{
		var wifinerghbor_data = data.wifinerghbor_info;
		
		for ( var i=1; i<=wifinerghbor_data.maxnum; i++ )
		{
			if ( eval("wifinerghbor_data.SSID" + i) )
			{
				j = j + 1;
				
				if (j%2 == 1)
				{
					neighborinfoHTML += '<tr class="oddtr">';
				}
				else
				{
					neighborinfoHTML += '<tr class="eventr">';
				}

				neighborinfoHTML += '<td>' + eval("wifinerghbor_data.SSID" + i).replace(/\s/g,'&nbsp') + '</td>';
				neighborinfoHTML += '<td>' + eval("wifinerghbor_data.BSSID" + i) + '</td>';
				neighborinfoHTML += '<td>' + eval("wifinerghbor_data.Channel" + i) + '</td>';
				neighborinfoHTML += '<td>' + eval("wifinerghbor_data.Band" + i) + '</td>';
				neighborinfoHTML += '<td>' + eval("wifinerghbor_data.RSSI" + i) + '</td>';
				neighborinfoHTML += '<td>' + eval("wifinerghbor_data.EncryptMode" + i) + '</td>';
				neighborinfoHTML += '<td>' + eval("wifinerghbor_data.Signal" + i) + '</td>';
				neighborinfoHTML += '</tr>';
			}
		}
	}
	if (j == 0)
	{
		neighborinfoHTML += '<tr><td colspan="7" align="center">' + "nodata".i18n() + '</td></td>';
	}
	
	$("#wifineighborinfo").html(neighborinfoHTML);
}


function saveApply()
{
	var postdata = new Object();

	XHR.get("get_operator", null, function(data){
		if ( data )
		{
			tokenstr = data.token;
		}
	});
	postdata.token = tokenstr;
	XHR.post("set_wifineighbor_info_5g", postdata, parseGetData);
	showOrHideLoadingWindowFromIframe("show");
}



