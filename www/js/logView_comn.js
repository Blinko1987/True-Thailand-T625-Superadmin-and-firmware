var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	// customScrollBar("html");
	
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	
	var postdata = new Object();
	postdata.action = "getenable";
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("logview", postdata, parseDate);
	showOrHideLoadingWindowFromIframe("show");
});

var loglevelArray = [
	["emerg", "0"],
	["alert", "1"],
	["crit", "2"],
	["err", "3"],
	["warn", "4"],
	["notice", "5"],
	["info", "6"],
	["debug", "7"]
];

function getloglevelStr(input)
{
	var returnstr = input; //if not found, use input string
	for ( var j=0; j<loglevelArray.length; j++ )
	{
		if ( input.toLowerCase().indexOf(loglevelArray[j][0]) >= 0 )
		{
			returnstr = loglevelArray[j][1];
			break;
		}
	}
	return returnstr;
}


function parseDate(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	if ( data )
	{
		if ( data.action == "getenable" )
		{
			if ( data.logenable != undefined && data.logenable != "" && data.logenable == "1" )
			{
				$("#logSwitch").html("logenabled".i18n());
			}
			else
			{
				$("#logSwitch").html("lognotenabled".i18n());
			}
		}
		else if ( data.action == "showlog" )
		{
			$("#logtable").html("");
			if ( data.fileok == 0 || data.logcount == 0 )
			{
				alert("currnolog".i18n());
				return;
			}
			loadLog(data);
			customScrollBar("html");
		}
		else if ( data.action == "clearlog" )
		{
			$("#logtable").html("");
			$("#logtable").hide();
			alert("clearlogsucc".i18n());
		}
	}
}

function clearLog()
{
	var postdata = new Object();
	postdata.action = "clearlog";
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("logview", postdata, parseDate);
	showOrHideLoadingWindowFromIframe("show");
}

function showLog()
{
	var postdata = new Object();
	postdata.action = "showlog";
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("logview", postdata, parseDate);
	showOrHideLoadingWindowFromIframe("show");
}

function loadLog(data)
{
	var dynamicHTML = "";
	var isEven; //是否是偶数行
	var tr069ip = "";
	
	//get tr069 wan ip
	XHR.get("get_allwan_info", null, function(getdata){
		
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}

	if ( getdata && getdata.wan )
	{
		var wanAarry = getdata.wan;
		if ( wanAarry.length > 0 )
		{
			for (var i=0; i<wanAarry.length; i++ )
			{
				var singleWan = wanAarry[i];
				if ( singleWan.Name.toUpperCase().indexOf("TR069") >=0 )
				{
					if ( singleWan.IPMode == 1 || singleWan.IPMode == 3 ) //ipv4
					{
						if ( singleWan.ConnectionType == 'PPPoE_Bridged' )
						{
							tr069ip = "";
						}
						else
						{
							if ( singleWan.ConnectionStatus == 'Connected' || singleWan.AddressingType == 'Static' )
							{
								tr069ip = singleWan.ExternalIPAddress;
							}
						}
					}
					
					if ( singleWan.IPMode == 2 ) //ipv6
					{
						if ( singleWan.ConnectionType == 'PPPoE_Bridged' )
						{
							tr069ip = "";
						}
						else
						{
							if ( singleWan.IPv6ConnStatus == 'Connected' || singleWan.IPv6IPAddressOrigin == 'Static' )
							{
								tr069ip = singleWan.IPv6IPAddress;
							}
						}
					}
				}
			}
		}
	}


	});
	
	dynamicHTML += '<tr><td colspan="3">Manufacturer: ' + data.Manufacturer + '</td></tr>';
	dynamicHTML += '<tr class="even"><td colspan="3">ProductClass: ' + data.ProductClass + '</td></tr>';
	dynamicHTML += '<tr><td colspan="3">SerialNumber: ' + data.SerialNumber + '</td></tr>';
	dynamicHTML += '<tr class="even"><td colspan="3">IP: ' + tr069ip + '</td></tr>';
	dynamicHTML += '<tr><td colspan="3">HWVer: ' + data.HWVer + '</td></tr>';
	dynamicHTML += '<tr class="even"><td colspan="3">SWVer: ' + data.SWVer + '</td></tr>';
	dynamicHTML += '<tr><td width="25%">'+ "time".i18n() +'</td><td width="15%">'+ "level".i18n() +'</td><td width="60%">'+ "content".i18n() +'</td></tr>';
	isEven = true;
	
	for( var i=1; i<=data.logcount; i++ )
	{
		//log format: YYYY-MM-DD HH:MM:SS [level] Message
		var singleLogArray1 = eval("data.log" + i).split(" (none) ");
		var singleLogArray = singleLogArray1[1].split(" ");

		var levelArray = singleLogArray[0].split(".");//level
		
		if ( levelArray[1] != undefined )
		{	
			if ( eval(getloglevelStr(levelArray[1])) <= data.logviewlevel )
			{
				if ( isEven )
				{
					dynamicHTML += "<tr class='even'>";
					isEven = false;
				}
				else
				{
					dynamicHTML += "<tr>";
					isEven = true;
				}
					
					
				//dynamicHTML += "<td colspan='3'>" + eval("data.log" + i) + "</td>";
				dynamicHTML += "<td>" + singleLogArray1[0] + "</td>"; //time
				dynamicHTML += "<td>" + levelArray[1] + "</td>"; //level
					
				//log message
				dynamicHTML += "<td>";
				for ( var j=1; j<singleLogArray.length; j++ )
				{
					if ( j > 1 )
					{
						dynamicHTML += " ";
					}
					dynamicHTML += singleLogArray[j];
				}
				dynamicHTML += "</td>";
				
				dynamicHTML += "</tr>";	
				//dynamicHTML += "</tr>";
			}
		}
	}
	
	$("#logtable").html(dynamicHTML);
	
	$("#logtable").show();
}