var tokenstr = "";
var gpwdmodifyflag;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	XHR.get("get_pwdmodify_flag", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
		
		if ( getdata.pwdmodifyflag != undefined )
		{
			if (getdata.pwdmodifyflag == 1)
			{
				gpwdmodifyflag = 1;
			}
			else
			{
				gpwdmodifyflag = 0;
			}
		}
	});
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/statslan", parseGetData);
	}
	else
	{
		XHR.get("get_remotemanage_info", null, parseGetData);
	}
	
}

function parseGetData(data)
{
	showOrHideLoadingWindowFromIframe("hide");

	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	
	if (data != null && data.remotemanage)
	{
		setCheckbox("httpenable_checkbox", data.remotemanage.HttpWanEnable);
		$("#httpwanport_text").val(data.remotemanage.HttpWanPort);
		$("#sessiontimeout_text").val(data.remotemanage.SessionMaxTime/60);
	}
	//controlenordisable2();
}


function saveApply()
{
	if(gpwdmodifyflag == 0)
	{
		alert("httpenablecannotmodifyhint".i18n());
		return;
	}

	var postdata = new Object();
	
	if ( ! isValidNumberRange($("#httpwanport_text").val(), 0, 65535) )
	{
		alert("portcheck".i18n());
		return false;
	}
	
	if ( ! isValidNumberRange($("#sessiontimeout_text").val(), 1, 1440) )
	{
		alert("sessiontimeoutcheckinvalid".i18n());
		return false;
	}
	
	postdata.HttpWanEnable = getCheckbox("httpenable_checkbox");
	postdata.HttpWanPort = $("#httpwanport_text").val();
	postdata.SessionMaxTime = $("#sessiontimeout_text").val()*60;
	
	XHR.get("get_operator", null, function(data){
		if ( data )
		{
			tokenstr = data.token;
		}
	});
	postdata.token = tokenstr;
	XHR.post("set_remotemanage_info", postdata, reloadSaveData);
	showOrHideLoadingWindowFromIframe("show");
}

function reloadSaveData(data)
{
	if(data)
	{
		parseGetData(data);
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}


/* function controlenordisable2()
{
	if($("#httpenable_checkbox").attr("checked") && gpwdmodifyflag == 0)
	{
		//alert("httpenablecannotmodifyhint".i18n());
		setCheckbox("httpenable_checkbox", "0");

		$("#httpwanport_text").attr("disabled", true);
		$("#sessiontimeout_text").attr("disabled", true);
		return;
	}
	
	if($("#httpenable_checkbox").attr("checked"))
	{
		$("#httpwanport_text").attr("disabled", false);
		$("#sessiontimeout_text").attr("disabled", false);
	}
	else
	{
		$("#httpwanport_text").attr("disabled", true);
		$("#sessiontimeout_text").attr("disabled", true);
	}
}

function controlenordisable()
{
	if($("#httpenable_checkbox").attr("checked") && gpwdmodifyflag == 0)
	{
		alert("httpenablecannotmodifyhint".i18n());
		setCheckbox("httpenable_checkbox", "0");

		$("#httpwanport_text").attr("disabled", true);
		$("#sessiontimeout_text").attr("disabled", true);
		return;
	}
	
	if($("#httpenable_checkbox").attr("checked"))
	{
		$("#httpwanport_text").attr("disabled", false);
		$("#sessiontimeout_text").attr("disabled", false);
	}
	else
	{
		$("#httpwanport_text").attr("disabled", true);
		$("#sessiontimeout_text").attr("disabled", true);
	}
} */




