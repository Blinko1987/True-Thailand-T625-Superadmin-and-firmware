var splitString = "&";
var login_user = '1'; //use admin as default
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
		getDataByAjax("../fake/smart_plugin_status", parseGetData);
	}
	else
	{
		XHR.get("get_login_user", null, parseLoginUser);
		getdata();
	}
});

function parseLoginUser(data)
{
	if ( data )
	{
		login_user = data.login_user;
		if ( login_user == 1 )
		{
			$("#b1").text("smartplugin_hint2".i18n());
			document.getElementById("log").style.display = '';
			document.getElementById("b2").style.display = '';
		}
	}
}

function getdata()
{
	$.ajax({
		url: "../cgi-bin/get_smart_plugin_status.cgi",
		method: "GET",
		dataType: 'json',
		cache: false,
		async: false,
		success: function(data){
			parseGetData(data);
		}
	});
}

function parseGetData(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	var statusHTML = '';
	if ( data && data.PlugNum != undefined && data.PlugNum >= 1 )
	{
		var nameArray = data.PlugNameStr.split(splitString);
		var versionArray = data.PlugVersionStr.split(splitString);
		var statusArray = data.PlugStatusStr.split(splitString);
		
		statusHTML = "<tr class='table_title'><td width='70%'>" + "pluginname".i18n() + "</td><td width='15%'>"+ "version".i18n() +"</td><td width='15%'>"+ "status".i18n() +"</td></tr>";
		for (var i=0; i<data.PlugNum; i++ )
		{
			statusHTML += "<tr>";
			statusHTML += "<td>" + nameArray[i] + "</td>";
			statusHTML += "<td>" + versionArray[i] + "</td>";
			if ( statusArray[i] !="" && statusArray[i] == 0 )
			{
				statusHTML += "<td>" + "stop".i18n() + "</td>";
			}
			else
			{
				statusHTML += "<td>" + "running".i18n() + "</td>";
			}
			statusHTML += "</tr>";
		}
	}
	else
	{
		statusHTML = "<tr><td>" + "noinstalledplugin".i18n() + "</td></tr>"
	}
	$("#status").html(statusHTML);
	
	var logHTML = '';
	if ( data && data.PlugLogStr != undefined && data.PlugLogStr != "" )
	{
		var logArray = data.PlugLogStr.split(splitString);
		logHTML = "<tr class='table_title'><td width='50%'>" + "time".i18n() + "</td><td width='50%'>" + "operate".i18n() + "</td></tr>";
		for (var i=0; i<logArray.length; i++ )
		{
			if ( logArray !=undefined && logArray[i] != "" )
			{
				var singleLog = logArray[i].replace(/ {1,}/g, " ").split(" ");
				logHTML += "<tr>";
				logHTML += "<td>" + singleLog[0] + " " + singleLog[1] + "</td>";
				logHTML += "<td>" + singleLog[2] + "</td>";
				logHTML += "</tr>";
			}
		}
	}
	else
	{
		logHTML = "<tr><td>" + "nopluginstatus".i18n() + "</td></tr>"
	}
	$("#log").html(logHTML);
	
	setTimeout("getdata()", 5000);
}
