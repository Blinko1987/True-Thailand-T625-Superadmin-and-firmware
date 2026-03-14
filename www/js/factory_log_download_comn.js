var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	$("#logname").bind("change", function(){
		//prepareLog();
	});
	$('#download').click(function(){
		prepareLog();
	});
});

function prepareLog()
{
	var postdata = new Object();
	postdata.logname = $("#logname").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("prepare_log", postdata, parseResult);
	showOrHideLoadingWindowFromIframe("show");
}

function parseResult(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	if ( data )
	{
		if ( data.prepare != undefined && data.prepare == '0' )
		{
			window.location="../cgi-bin/download?" + $("#logname").val();
		}
		else
		{
			alert("log_download.notexsit".i18n());
		}
	}
	else
	{
		alert("log_download.geterror".i18n());
		
	}
	//$("#download").attr("onclick", action);
}

