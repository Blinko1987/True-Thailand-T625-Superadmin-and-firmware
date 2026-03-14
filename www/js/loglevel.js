var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	customSwitchInit();

	showOrHideLoadingWindowFromIframe("show");
	initPage();
});

function refresh(){
   location.reload();
}

function initPage()
{
	gDebug = false;
	if(gDebug)
	{
		getDataByAjax("../fake/logSettings", fillData);
	}else{
		XHR.get("getLogSettings", null, fillData);
	}
}

function fillData(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	if(data.success == 'true')
	{
		// $("#log_settings_form").fill(data.data);
		setCheckbox("LogEnable_checkbox_value", data.data.logenable);
		setCheckbox("emergency_checkbox", data.data.Emergencyenable);
        setCheckbox("alert_checkbox", data.data.Alertenable);
        setCheckbox("error_checkbox", data.data.Errorenable);
        setCheckbox("warning_checkbox", data.data.Warningenable);
        setCheckbox("notice_checkbox", data.data.Noticeenable);
        setCheckbox("information_checkbox", data.data.Informationenable);
        setCheckbox("debug_checkbox", data.data.Debugenable);
        setCheckbox("remoteLogEnable_checkbox", data.data.remotelogenable);
        $("#tftpserveraddress").val(data.data.tftpaddress);
		$("#remotelogserveraddress").val(data.data.remotelogaddr);
	}else{
		alert("get getLogSettings failed!");
	}
}

function saveApply()
{
	var postdata = new Object();
	postdata.action = "remote";
    
	postdata.remotelogenable = getCheckbox("remoteLogEnable_checkbox");
	postdata.remoteaddress = $("#remotelogserveraddress").val();

	// if(postdata.remoteaddress == ''){
	// 	 alert("Remoteaddress Can not be empty");
	// 	 return;
	// }

	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("setLogSettings", postdata, fillData);
	showOrHideLoadingWindowFromIframe("show");
}

function gettftpaddress(data){
	showOrHideLoadingWindowFromIframe("hide");
	$("#tftpserveraddress").val(data.Tftpaddress);
	if(data.TFTPUpload == 2){
          alert("Upload Success");
	}else if(data.TFTPUpload == 3){
		  alert("Upload Fail");
	}
}

function tftpupload(){
	var postdata = new Object();
	postdata.action = "tftpupload";
	postdata.tftpaddress = $("#tftpserveraddress").val();
	if(postdata.tftpaddress == ''){
		 alert("TFTP address Can not be empty");
		 return;
	}

	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("logview", postdata, gettftpaddress);
	showOrHideLoadingWindowFromIframe("show");
}

function logsaveApply(){
	var postdata = new Object();
	postdata.action = "getenable";
	postdata.logenable = getCheckbox("LogEnable_checkbox_value");
	postdata.Emergencyenable = getCheckbox("emergency_checkbox");
	postdata.Alertenable = getCheckbox("alert_checkbox");
	postdata.Errorenable = getCheckbox("error_checkbox");
	postdata.Warningenable = getCheckbox("warning_checkbox");
	postdata.Noticeenable = getCheckbox("notice_checkbox");
	postdata.Informationenable = getCheckbox("information_checkbox");
	postdata.Debugenable = getCheckbox("debug_checkbox");

	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("setLogSettings", postdata, fillData);
	showOrHideLoadingWindowFromIframe("show");
}


function buildData()
{
	var data = new Object();
	data.enable = getCheckbox("LogEnable_checkbox_value");
	data.loglevel = $("#LevelLog_select").val();
	data.logviewlevel = $("#LevelDisplay_select").val();
	
	return data;
}

/*
function reloadData(responseData)
{
	if(responseData.success == "true")
	{
		ptweblog("post data success!");
		initPage();
	}
	else
	{
		alert("提交日志设置参数失败！");
	}
}*/

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
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	if ( data )
	{
		if ( data.action == "getenable" )
		{
			if ( data.logenable != undefined && data.logenable != "" && data.logenable == "1" )
			{
				//$("#logSwitch").html("日志已启用");
			}
			else
			{
				//$("#logSwitch").html("日志未启用");
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

function getclearresult(data){
	showOrHideLoadingWindowFromIframe("hide");
	if(data.clean_result == 2){
          alert("clear Success");
	}else if(data.clean_result == 3){
		  alert("clear Fail");
	}
}

function clearlog()
{
	var postdata = new Object();
	postdata.action = "cleanlog";
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("logview", postdata, getclearresult);
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
}

function loadLog(data)
{
	var dynamicHTML = "";
	var isEven; //是否是偶数行

	
	dynamicHTML += '<tr><td colspan="3">Manufacturer: ' + data.Manufacturer + '</td></tr>';
	dynamicHTML += '<tr class="even"><td colspan="3">ProductClass: ' + data.ProductClass + '</td></tr>';
	dynamicHTML += '<tr><td colspan="3">SerialNumber: ' + data.SerialNumber + '</td></tr>';
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


function downloadLog()
{
	window.location="../cgi-bin/download?" + "syslog";
}

function alllogs(){
	var postdata = new Object();
	XHR.get("get_operator", null, function(data){
		if ( data )
		{
			tokenstr = data.token;
		}
	});
	postdata.token = tokenstr;
	XHR.post("downloadlog_onekey", postdata, alllogreloadData);
	
	showOrHideLoadingWindowFromIframe("show");
}

function alllogreloadData(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( data.prepare == "true")
	{
		window.location="../cgi-bin/download?" + "allmodelog";
	}
	else
	{
		alert("downloadlogfailed".i18n());
	}
}






