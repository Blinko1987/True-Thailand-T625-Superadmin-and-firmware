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
	$('#download_button').click(function(){
		//valid check
		if ( $("#path").val() == '' )
		{
			alert("要下载的文件不能为空");
			return false;
		}
		
		var postdata = new Object();
		postdata.path = $("#path").val();
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("prepare_download_file", postdata, parseResult);
	});
});

function parseResult(data)
{
	if ( data )
	{
		if (data.prepare == "true")
		{
			window.location = "../cgi-bin/download?" + $("#path").val();
		}
		else
		{
			alert("您要下载的文件不存在");
		}
	}
}

