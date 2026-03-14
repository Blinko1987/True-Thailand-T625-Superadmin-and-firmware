var tokenstr = "";
var gpwdmodifyflag;
var gHttpWanPort = "";
var gSessionMaxTime = "";

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
	
	XHR.get("get_remotemanage_info", null, function(data){
		if ( data.token != undefined )
		{
			tokenstr = data.token;
		}
		gHttpWanPort = data.remotemanage.HttpWanPort;
		gSessionMaxTime = data.remotemanage.SessionMaxTime;
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
		XHR.get("get_remoteaccess_info", null, parseGetData);
	}
	
}

function parseGetData(data)
{
	showOrHideLoadingWindowFromIframe("hide");

	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	
	if (data != null && data.remoteaccess)
	{
		if ( data.remoteaccess.WANACL_Mode == 1 )
		{
			setCheckbox("wanaclenable_checkbox", 0);
		}
		else
		{
			setCheckbox("wanaclenable_checkbox", 1);
		}
	
		//setCheckbox("wanaclenable_checkbox", data.remoteaccess.WANACL_Mode);
	
		setCheckbox("TelnetLanEnable", data.remoteaccess.TelnetLanEnable);
		setCheckbox("TelnetWanEnable", data.remoteaccess.TelnetWanEnable);
		//$("#TelnetLanPort").val(data.remoteaccess.TelnetLanPort);
		//$("#TelnetWanPort").val(data.remoteaccess.TelnetWanPort);
		
		setCheckbox("FtpLanEnable", data.remoteaccess.FtpLanEnable);
		setCheckbox("FtpWanEnable", data.remoteaccess.FtpWanEnable);
		//$("#FtpLanPort").val(data.remoteaccess.FtpLanPort);
		//$("#FtpWanPort").val(data.remoteaccess.FtpWanPort);
		
		setCheckbox("TftpLanEnable", data.remoteaccess.TftpLanEnable);
		setCheckbox("TftpWanEnable", data.remoteaccess.TftpWanEnable);
		//$("#TftpLanPort").val(data.remoteaccess.TftpLanPort);
		//$("#TftpWanPort").val(data.remoteaccess.TftpWanPort);
		
		setCheckbox("HttpLanEnable", data.remoteaccess.HttpLanEnable);
		setCheckbox("HttpWanEnable", data.remoteaccess.HttpWanEnable);
		//$("#HttpLanPort").val(data.remoteaccess.HttpLanPort);
		//$("#HttpWanPort").val(data.remoteaccess.HttpWanPort);
		
		setCheckbox("HttpsLanEnable", data.remoteaccess.HttpsLanEnable);
		setCheckbox("HttpsWanEnable", data.remoteaccess.HttpsWanEnable);
		//$("#HttpsLanPort").val(data.remoteaccess.HttpsLanPort);
		//$("#HttpsWanPort").val(data.remoteaccess.HttpsWanPort);
		
		setCheckbox("PingLanEnable", data.remoteaccess.PingLanEnable);
		setCheckbox("PingWanEnable", data.remoteaccess.PingWanEnable);		
	}
	
	controlenordisable2();
}


function saveApply()
{
	var postdata = new Object();
	
	if ( getCheckbox("wanaclenable_checkbox") == 1 )
	{
		postdata.WANACL_Mode = 0;
	}
	else
	{
		postdata.WANACL_Mode = 1;
	}
	
	
	//postdata.WANACL_Mode = getCheckbox("wanaclenable_checkbox");
	
	postdata.TelnetLanEnable = getCheckbox("TelnetLanEnable");
	postdata.TelnetWanEnable = getCheckbox("TelnetWanEnable");
	//postdata.TelnetLanPort = $("#TelnetLanPort").val();
	//postdata.TelnetWanPort = $("#TelnetWanPort").val();
	
	postdata.FtpLanEnable = getCheckbox("FtpLanEnable");
	postdata.FtpWanEnable = getCheckbox("FtpWanEnable");
	//postdata.FtpLanPort = $("#FtpLanPort").val();
	//postdata.FtpWanPort = $("#FtpWanPort").val();
	
	postdata.TftpLanEnable = getCheckbox("TftpLanEnable");
	postdata.TftpWanEnable = getCheckbox("TftpWanEnable");
	//postdata.TftpLanPort = $("#TftpLanPort").val();
	//postdata.TftpWanPort = $("#TftpWanPort").val();
	
	postdata.HttpLanEnable = getCheckbox("HttpLanEnable");
	postdata.HttpWanEnable = getCheckbox("HttpWanEnable");
	//postdata.HttpLanPort = $("#HttpLanPort").val();
	//postdata.HttpWanPort = $("#HttpWanPort").val();
	
	postdata.HttpsLanEnable = getCheckbox("HttpsLanEnable");
	postdata.HttpsWanEnable = getCheckbox("HttpsWanEnable");
	//postdata.HttpsLanPort = $("#HttpsLanPort").val();
	//postdata.HttpsWanPort = $("#HttpsWanPort").val()
	
	postdata.PingLanEnable = getCheckbox("PingLanEnable");
	postdata.PingWanEnable = getCheckbox("PingWanEnable");
	
	postdata.HttpWanPort = gHttpWanPort;
	postdata.SessionMaxTime = gSessionMaxTime;

	XHR.get("get_operator", null, function(data){
		if ( data )
		{
			tokenstr = data.token;
		}
	});
	postdata.token = tokenstr;
	XHR.post("set_remoteaccess_info", postdata, reloadSaveData);
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


function controlenordisable()
{
	if(gpwdmodifyflag == 0)
	{
		alert("wanaclcannotmodifyhint".i18n());
		
		if ( $("#wanaclenable_checkbox").attr('checked') )
		{
			setCheckbox("wanaclenable_checkbox", "0");
		}
		else
		{
			setCheckbox("wanaclenable_checkbox", "1");
		}

		$("#TelnetWanEnable").attr("disabled", true);
		$("#FtpWanEnable").attr("disabled", true);
		$("#TftpWanEnable").attr("disabled", true);
		$("#HttpWanEnable").attr("disabled", true);
		$("#HttpsWanEnable").attr("disabled", true);
		$("#PingWanEnable").attr("disabled", true);
		return;
	}

	if($("#wanaclenable_checkbox").attr("checked"))
	{
		$("#TelnetWanEnable").attr("disabled", false);
		$("#FtpWanEnable").attr("disabled", false);
		$("#TftpWanEnable").attr("disabled", false);
		$("#HttpWanEnable").attr("disabled", false);
		$("#HttpsWanEnable").attr("disabled", false);
		$("#PingWanEnable").attr("disabled", false);
	}
	else
	{
		$("#TelnetWanEnable").attr("disabled", true);
		$("#FtpWanEnable").attr("disabled", true);
		$("#TftpWanEnable").attr("disabled", true);
		$("#HttpWanEnable").attr("disabled", true);
		$("#HttpsWanEnable").attr("disabled", true);
		$("#PingWanEnable").attr("disabled", true);
	}
}


function controlenordisable2()
{
	if(gpwdmodifyflag == 0)
	{
		$("#TelnetWanEnable").attr("disabled", true);
		$("#FtpWanEnable").attr("disabled", true);
		$("#TftpWanEnable").attr("disabled", true);
		$("#HttpWanEnable").attr("disabled", true);
		$("#HttpsWanEnable").attr("disabled", true);
		$("#PingWanEnable").attr("disabled", true);
		return;
	}

	if($("#wanaclenable_checkbox").attr("checked"))
	{
		$("#TelnetWanEnable").attr("disabled", false);
		$("#FtpWanEnable").attr("disabled", false);
		$("#TftpWanEnable").attr("disabled", false);
		$("#HttpWanEnable").attr("disabled", false);
		$("#HttpsWanEnable").attr("disabled", false);
		$("#PingWanEnable").attr("disabled", false);
	}
	else
	{
		$("#TelnetWanEnable").attr("disabled", true);
		$("#FtpWanEnable").attr("disabled", true);
		$("#TftpWanEnable").attr("disabled", true);
		$("#HttpWanEnable").attr("disabled", true);
		$("#HttpsWanEnable").attr("disabled", true);
		$("#PingWanEnable").attr("disabled", true);
	}
}






