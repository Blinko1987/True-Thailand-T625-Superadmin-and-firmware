var tokenstr = "";
var voicedata = '';

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_fax", initPage);
	}
	else
	{
		XHR.get("get_voice_fax_info", null, initPage);
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
	
	if (getdata != null && getdata.voice_fax)
	{
		voicedata = getdata.voice_fax;
		if ( voicedata.FaxT38Enable == 1 )
		{
			$("#FaxMode_select").val("T38");
		}
		else if ( voicedata.FaxPassThroughEnable == 1 )
		{
			$("#FaxMode_select").val("T30");
		}
		$("#T30NegotiateMode_select").val(voicedata.ControlType);
	}
	
}

function saveApply()
{
	var postdata = new Object();
	
	
	if ( $("#FaxMode_select").val() == "T38" )
	{
		postdata.FaxT38Enable = 1;
		postdata.FaxPassThroughEnable = 0;
	}
	else
	{
		postdata.FaxT38Enable = 0;
		postdata.FaxPassThroughEnable = 1;
	}
	postdata.ControlType = $("#T30NegotiateMode_select").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_voice_fax_info", postdata, reloadSaveData);
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


