var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	$("input:[name='enable']").bind("click", function(){
		displayControl();
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/web_log", initPage);
	}
	else
	{
		XHR.get("get_web_log", null, initPage);
	}
	displayControl();
});

function displayControl()
{
	if ( getRadio("enable") == 1 )
	{
		$("#loglevel").show();
	}
	else
	{
		$("#loglevel").hide();
	}
}

function initPage(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( data )
	{
		setRadio("enable", data.LogEnable);
		$("#level").val(data.LogLevel);
	}
}

function saveApply()
{
	var postdata = new Object();
	postdata.LogEnable = getRadio("enable");
	postdata.LogLevel = $("#level").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_web_log", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

