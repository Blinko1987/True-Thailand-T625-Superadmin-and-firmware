var tokenstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	customPasswordInit();
	showOrHideLoadingWindowFromIframe("show");
	
	initPage();
});

function initPage()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/rpcapinfo", fillData);
	}
	else
	{
		XHR.get("get_rpcap_info", null, fillData);
	}
}

function fillData(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata)
	{
		setCheckbox("Enable_checkbox", getdata.Enable);
	}
}

function saveApply()
{
	var postdata = new Object();
	postdata.Enable = getCheckbox("Enable_checkbox");
	
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	setTimeout(function(){window.location.href="./rpcapture_comn.html"}, 1000);
	XHR.post("set_rpcap_info", postdata, reloadSaveData);
	showOrHideLoadingWindowFromIframe("show");
}

function reloadSaveData(data)
{
	if(data)
	{
		fillData(data);
	}
}



