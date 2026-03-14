var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	$("input[type='radio']").bind("click", function(){
		saveApply(this);
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/factory_log", initPage);
	}
	else
	{
		XHR.get("get_factory_log", null, initPage);
	}
});


var logdata;
function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( getdata && getdata.log )
	{
		logdata = getdata.log;
		/*setRadio("voicesip", logdata.voicesip);
		setRadio("voiceh248", logdata.voiceh248);
		setRadio("voicedriver", logdata.voicedriver);
		setRadio("fhcfg", logdata.fhcfg);
		setRadio("fhapi", logdata.fhapi);
		*/
		setRadio("voicesip", "1");
		setRadio("voiceh248", "1");
		setRadio("voicedriver", "1");
		setRadio("fhcfg", "1");
		setRadio("fhapi", "1");
	}
}

function saveApply(element)
{
	var postdata = new Object();

	if ( eval("logdata."+ element.name) == getRadio(element.name) )
	{
		return;
	}
	postdata.action = element.name;
	postdata[element.name] = getRadio(element.name);
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_factory_log", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

