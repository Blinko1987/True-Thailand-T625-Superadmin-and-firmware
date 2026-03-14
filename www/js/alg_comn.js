var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/alg", initPage);
	}
	else
	{
		XHR.get("get_alg_info", null, initPage);
	}
});

function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.alg)
	{
		setCheckbox("H323Enable_checkbox", getdata.alg.H323Enable);
		setCheckbox("SIPEnable_checkbox", getdata.alg.SIPEnable);
		setCheckbox("RTSPEnable_checkbox", getdata.alg.RTSPEnable);
		setCheckbox("L2TPEnable_checkbox", getdata.alg.L2TPEnable);
		setCheckbox("IPSECEnable_checkbox", getdata.alg.IPSECEnable);
		setCheckbox("FTPEnable_checkbox", getdata.alg.FTPEnable);
		setCheckbox("PPTPEnable_checkbox", getdata.alg.PPTPEnable);
	}
}

function saveApply()
{
	var postdata = new Object();
	postdata.H323Enable = getCheckbox("H323Enable_checkbox");
	postdata.SIPEnable = getCheckbox("SIPEnable_checkbox");
	postdata.RTSPEnable = getCheckbox("RTSPEnable_checkbox");
	postdata.L2TPEnable = getCheckbox("L2TPEnable_checkbox");
	postdata.IPSECEnable = getCheckbox("IPSECEnable_checkbox");
	postdata.FTPEnable = getCheckbox("FTPEnable_checkbox");
	postdata.PPTPEnable = getCheckbox("PPTPEnable_checkbox");
	XHR.get("get_operator", null, function(data){
		if ( data )
		{
			tokenstr = data.token;
		}
	});
	postdata.token = tokenstr;
	XHR.post("set_alg_info", postdata, reloadSaveData);
	showOrHideLoadingWindowFromIframe("show");
}

function reloadSaveData(data)
{
	if(data)
	{
		initPage(data);
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}

