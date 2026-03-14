var tokenstr = "";
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
		$("#log_settings_form").fill(data.data);
		setCheckbox("LogEnable_checkbox_value", data.data.enable);
	}else{
		alert("get getLogSettings failed!");
	}
	
}

function saveApply()
{
	var data = buildData();
	
	if(gDebug)
	{
		postDataByAjax("../fake/post", JSON.stringify(data));
	}else{
		showOrHideLoadingWindowFromIframe("show");
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		data.token = tokenstr;
		setTimeout(function(){window.location.href="./logSettings_comn.html"}, 1000);
		XHR.post("setLogSettings", data, fillData);
	}
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