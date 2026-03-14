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
});

function onekey(action)
{
	var postdata = new Object();
	postdata.action = action;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("shortcut_onekey", postdata, parse_return_data);
}

function parse_return_data(data)
{
	if ( data )
	{
		if ( data.action == "disable_all_log" )
		{
			alert("关闭日志成功");
		}
		else if ( data.action == "enable_all_log" )
		{
			alert("开启日志成功");
		}
		else if ( data.action == "download_logs" )
		{
			window.location = "../cgi-bin/download?/var/logs.tar";
		}
		else if ( data.action == "download_var" )
		{
			window.location = "../cgi-bin/download?/var/var.tar";
		}
		else if ( data.action == "download_flash" )
		{
			window.location = "../cgi-bin/download?/var/flash.tar";
		}
	}
	else
	{
		alert("未知错误");
	}
}