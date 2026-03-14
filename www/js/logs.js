var tokenstr = "";
var loglevel = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	customSwitchInit();

	showOrHideLoadingWindowFromIframe("show");
	initPage();
});

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
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	if(data.success == 'true')
	{
		$("#LevelLog_select").val(data.data.loglevel);
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

	if(postdata.remoteaddress == null){
		 alert("Remoteaddress Can not be empty");
		 return;
	}

	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("setLogSettings", postdata, fillData);
}

function getclearresult(data){
	showOrHideLoadingWindowFromIframe("hide");
	if(data.clean_result == 2){
          alert("clear Success");
          $("#logview").val('');
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
	showOrHideLoadingWindowFromIframe("show");
}

function showLog()
{
	var postdata = new Object();
	postdata.action = "showlog";
	postdata.enable = "1";
	postdata.loglevel = $("#LevelLog_select").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("setLogSettings", postdata, showlogpage);
	showOrHideLoadingWindowFromIframe("show");
}

function showlogpage(data){
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	if(data.success == 'true')
	{
		loglevel = data.data.loglevel;
		$("#LevelLog_select").val(data.data.loglevel);
	}else{
		alert("get getLogSettings failed!");
	}
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

function downloadLog()
{
	window.location="../cgi-bin/download?" + "syslog";
}

var loglevelArray = [
	["emerg", "1"],
	["alert", "2"],
	// ["crit", "2"],
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
		var inputarray = input.split(":");
		if ( inputarray[2].toLowerCase().indexOf(loglevelArray[j][0]) >= 0 )
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
			// $("#logtable").html("");
			// $("#logtable").hide();
			// alert("clearlogsucc".i18n());
		}
	}
}

function loadLog(data)
{
	  $("#logview").text('');
      var i = 0;
      var logshtml = '';
      for(i=1;i<data.logcount+1;i++){
      	  var logcontent = eval("data.log" + i);
      	  if(getloglevelStr(logcontent) <= loglevel){
      	  	$("#logview").append(logcontent+"\n");
      	  }
      }
}

function refresh(){
   location.reload();
}






