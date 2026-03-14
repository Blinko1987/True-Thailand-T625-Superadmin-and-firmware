var tokenstr = "";
var glandata = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	getData();
});

function getData()
{
	XHR.get("get_smartant_info", null, function(data){
		showOrHideLoadingWindowFromIframe("hide");
		
		if ( data.token != undefined )
		{
			tokenstr = data.token;
		}
		
		if (data.SmartAntAuto != undefined)
		{
			if (data.SmartAntAuto == "1")//auto select
			{
				displayControl(data.SmartAntModeInUse);
				var tmpstr = antmodetostring(data.SmartAntModeInUse);
				$("#currentant").text(tmpstr);
				setRadio("mode_radio", "1");
				$("#detectperiod").val(data.SmartAntTime);
			}
			else  //manual select
			{
				displayControl(data.SmartAntMode);
				var tmpstr = antmodetostring(data.SmartAntMode);
				$("#currentant").text(tmpstr);
				setRadio("mode_radio", "0");
				
				$("#antmode_select").val(data.SmartAntMode);
				
				XHR.get("get_lan_status", null, function(data){
					if (data && data.lan_status)
					{
						glandata = data.lan_status;
						
						XHR.get("get_associated_deviceinfo", null, parseGetData);
					}
				});
			}
		}
		
		checkshoworhidediv();
		
	});
}

function antmodetostring(val)
{
	var tmpstr = "";
	switch(val)
	{
		case '1':
			tmpstr = "antmode1".i18n();
			break;
		case '2':
			tmpstr = "antmode2".i18n();
			break;
		default:
			tmpstr = "antmode2".i18n();
	}
	return tmpstr;
}

function parseGetData(data)
{
	ssidinfoHTML = '';
	var j = 0;
	
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	
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
				ssidinfoHTML += '<td>' + eval("associated_device_data.Olinetime" + i) + '</td>';
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

function displayControl(index)
{
	switch(index)
	{
		case "1":
			$("#antenna_logo_1").show();
			$("#antenna_logo_2").hide();
			break;
		case "2":
			$("#antenna_logo_1").hide();
			$("#antenna_logo_2").show();
			break;
		default:
			$("#antenna_logo_1").hide();
			$("#antenna_logo_2").show();
	}
}

function switchantennalogo()
{
	displayControl($("#antmode_select").val());
}

function checkshoworhidediv()
{
	if(getRadio("mode_radio") == "1")//auto select
	{
		$("#autosel_div").show();
		$("#manualsel_div").hide();
		$("#sta_tab").hide();
	}
	else
	{
		$("#autosel_div").hide();
		$("#manualsel_div").show();
		$("#sta_tab").show();
	}
}

function changeselectmode()
{
	var postdata = new Object();
	postdata.SmartAntAuto = getRadio("mode_radio");
	
	showOrHideLoadingWindowFromIframe("show");
	
	XHR.get("get_operator", null, function(data){
		if ( data )
		{
			tokenstr = data.token;
		}
	});
	postdata.token = tokenstr;
	XHR.post("set_smartant_switch", postdata, reloadSaveData);
	
}

function refreshApply()
{
	$("#currentant").text("");
	
	showOrHideLoadingWindowFromIframe("show");
	
	setTimeout(function(){XHR.get("get_smartant_info", null, function(data){
		showOrHideLoadingWindowFromIframe("hide");
		
		if ( data.token != undefined )
		{
			tokenstr = data.token;
		}
		
		if (data.SmartAntModeInUse != undefined)
		{
			var tmpstr = antmodetostring(data.SmartAntModeInUse);
			$("#currentant").text(tmpstr);
		}
	});}, 500);
}

function saveApply()
{
	var postdata = new Object();
	postdata.SmartAntAuto = getRadio("mode_radio");
	if(postdata.SmartAntAuto == "1")
	{
		postdata.SmartAntTime = $("#detectperiod").val();
	}
	else
	{
		postdata.SmartAntMode = $("#antmode_select").val();
	}
	
	showOrHideLoadingWindowFromIframe("show");
	if(gDebug){
		postDataByAjax("../fake/bandstrring", data, options)
	}else{
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("set_smartant_info", postdata, reloadSaveData);
	}
}

function reloadSaveData(data)
{
	if(data)
	{
		getData();
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}





