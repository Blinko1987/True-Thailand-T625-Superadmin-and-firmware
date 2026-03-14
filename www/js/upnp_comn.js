var tokenstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	showOrHideLoadingWindowFromIframe("show");
	
	XHR.get("get_allwan_info", null, function(data){
		if ( data && data.wan )
		{
			var wan_num = 0;
			var dynamicHtml = '';
			
			if ( data.wan != '' )
			{
				wan_num = data.wan.length;
			}
			if ( wan_num > 0 )
			{
				for ( i=0; i< wan_num; i++ )
				{
					var single_wan = data.wan[i];
					
					if(single_wan.wan_index == 3 && single_wan.wan_session_index == 1 && single_wan.Name == "THSi")//true custom wan, cannot show
					{
						continue;
					}
					
					if ( single_wan.Name.indexOf('INTERNET') >= 0 && single_wan.Name.indexOf('_R_') >= 0 )
					{
						if (single_wan.iporppp == "1")
						{
							dynamicHtml += '<option value="InternetGatewayDevice.WANDevice.1.WANConnectionDevice.' + single_wan.wan_index + '.WANIPConnection.' + single_wan.wan_session_index + '.">' + single_wan.Name + '</option>';
						}
						else
						{
							dynamicHtml += '<option value="InternetGatewayDevice.WANDevice.1.WANConnectionDevice.' + single_wan.wan_index + '.WANPPPConnection.' + single_wan.wan_session_index + '.">' + single_wan.Name + '</option>';
						}
					}
				}
			}
			
			$("#Interface_select").html(dynamicHtml);
		}
	});
	
	initPage();
});

function initPage()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/upnp", fillData);
	}
	else
	{
		XHR.get("get_upnp_info", null, fillData);
	}
}

function fillData(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.upnp)
	{
		setCheckbox("Enable_checkbox", getdata.upnp.Enable);
		$("#Interface_select").val(getdata.upnp.Interface);
		var upnpportmapinfoHTML = '';
		
		for ( var i=0; i < getdata.upnp.num; i++ )
		{
			if ( eval("getdata.upnp.inaddr" + i) )
			{
				upnpportmapinfoHTML += '<tr>';
				upnpportmapinfoHTML += '<td>' + eval(i + 1) + '</td>';
				upnpportmapinfoHTML += '<td>' + eval("getdata.upnp.export" + i) + '</td>';
				upnpportmapinfoHTML += '<td>' + eval("getdata.upnp.protocol" + i) + '</td>';
				upnpportmapinfoHTML += '<td>' + eval("getdata.upnp.inaddr" + i) + '</td>';
				upnpportmapinfoHTML += '<td>' + eval("getdata.upnp.inport" + i) + '</td>';
				upnpportmapinfoHTML += '<td>' + eval("getdata.upnp.description" + i) + '</td>';
				upnpportmapinfoHTML += '</tr>';
	}
		}
		
		$("#upnpportmapinginfo").html(upnpportmapinfoHTML);
	}
	
	if(getdata.upnp.Enable == "1")
	{
		document.getElementById("upnpportmapinginfodiv").style.display = "";
	}
	else
	{
		document.getElementById("upnpportmapinginfodiv").style.display = "none";
	}
	
}

function saveApply()
{
	var postdata = new Object();
	postdata.Enable = getCheckbox("Enable_checkbox");
	postdata.Interface = $("#Interface_select").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_upnp_info", postdata, reloadSaveData);
	showOrHideLoadingWindowFromIframe("show");
}

function reloadSaveData(data)
{
	if(data)
	{
		reloadData(data);
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}


function reloadData(responseData)
{
	showOrHideLoadingWindowFromIframe("hide");
	if(responseData.success == "true")
	{
		ptweblog("post data success!");
		initPage();
	}
	else
	{
		//alert();
	}
}
