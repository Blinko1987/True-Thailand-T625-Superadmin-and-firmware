var tokenstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");

	showOrHideLoadingWindowFromIframe("show");
	customSwitchInit();

	initPage();

});


function initPage()
{
	if(gDebug)
	{
		getDataByAjax("../fake/wlanBasicSettings", reloadData);
	}else{
		XHR.get("get_easymesh_settings", null, reloadData);
	}
}


function saveApply()
{
	/* if( $("#Devicename_text").val().length == 0 )
	{
		alert("devicenamecannotempty".i18n());
		return false;
	}
	else */
	{
		var data = buildData();
		showOrHideLoadingWindowFromIframe("show");
		
		XHR.get("get_operator", null, function(data){
		if ( data )
			{
				tokenstr = data.token;
			}
		});
		data.token = tokenstr;
		XHR.post("set_easymesh_settings", data, reloadSaveData);
	} 
}

function reloadSaveData(data)
{
	if(data)
	{
		reloadData(data);
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}

function reloadData(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	$("#Devicename_text").val(data.DeviceName);
	$("#backhaul_sel").val(data.BackHaul)
	$("#curr_devrole").text("Controller");
	setRadio("easymesh_enable", data.Enable)
}

function buildData()
{
	var data = new Object();
	data.DeviceName = $("#Devicename_text").val();
	data.Role = "1";
	data.BackHaul = $("#backhaul_sel").val();
	if (getRadio("easymesh_enable") == "1")
	{
		data.Enable = "1";
	}
	else
	{
		data.Enable = "0";
	}
	
	return data;
}

function reseteasymeshtodefault()
{
	var data = new Object();
	showOrHideLoadingWindowFromIframe("show");
	XHR.get("get_operator", null, function(data){
		if ( data )
			{
				tokenstr = data.token;
			}
		});
	data.token = tokenstr;
	XHR.post("set_easymesh_todefault", data, reloadresetData);
}


function reloadresetData(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	if(data.success == "true")
	{
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
		
		initPage();
	}
	else
	{
		alert("setfailed".i18n());
	}
}

function triggerwifionbording()
{
	var data = new Object();
	showOrHideLoadingWindowFromIframe("show");
	XHR.get("get_operator", null, function(data){
		if ( data )
			{
				tokenstr = data.token;
			}
		});
	data.token = tokenstr;
	XHR.post("set_easymesh_wps", data, reloadData);
}
