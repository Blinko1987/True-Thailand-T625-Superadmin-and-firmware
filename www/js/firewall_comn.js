var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	$("#OverloadEnable_checkbox").bind("click", function(){
		overloadprotect();
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_firewall_info", null, initPage);
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
	
	XHR.get("get_overloadprotect", null, parseoverloadprotect);
	
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.firewall)
	{
		setCheckbox("FirewallEnable_checkbox", getdata.firewall.Enable);
		$("#Firewall_Level").val(getdata.firewall.LEVEL);
		setCheckbox("DosEnable_checkbox", getdata.firewall.DOSFEnable);
	}
	
	controlenordisable();
}

function controlenordisable()
{
	if($("#FirewallEnable_checkbox").attr("checked"))
	{
		$("#Firewall_Level").attr("disabled", false);
	}
	else
	{
		$("#Firewall_Level").attr("disabled", true);
	}
}


function saveApply()
{
	var postdata = new Object();
	
	postdata.Enable = getCheckbox("FirewallEnable_checkbox");
	postdata.LEVEL = $("#Firewall_Level").val();
	postdata.DOSFEnable = getCheckbox("DosEnable_checkbox");
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_firewall_info", postdata, reloadSaveData);
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

function overloadprotect()
{
	var postdata = new Object();
	postdata.OverloadEnable = getCheckbox("OverloadEnable_checkbox");
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_overloadprotect", postdata, parseoverloadprotect);
	showOrHideLoadingWindowFromIframe("show");
}

function parseoverloadprotect(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata.OverloadEnable != undefined)
	{
		setCheckbox("OverloadEnable_checkbox", getdata.OverloadEnable);
	}
}


