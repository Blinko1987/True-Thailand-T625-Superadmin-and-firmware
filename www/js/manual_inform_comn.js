var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
});

function saveApply()
{
	var postdata = new Object();
	postdata.action = "inform";
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("do_moremgt", postdata, parseInformResult);
	showOrHideLoadingWindowFromIframe("show");
}

function parseInformResult(data)
{
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	var dynamicHTML;
	if (data)
	{
		if ( data.handlestatus == 0 )//-1:表示未手动上报，1：表示手动上报中，0：表示上报结束
		{
			switch(data.informstatus)
			{
				case '8':
					dynamicHTML = "resultinformsucc".i18n();
					break;
				case '7':
					dynamicHTML = "resultinforminterrupt".i18n();
					break;
				case '6':
					dynamicHTML = "resultinformnoresponse".i18n();
					break;
				default:
					dynamicHTML = "resultunreported".i18n();
					break;
			}
		}
		else
		{
			dynamicHTML = "resultunreported".i18n();
		}
	}
	else
	{
		dynamicHTML = "internalerr".i18n();
	}
	
	$("#result").html("<br/>" + dynamicHTML);
	$("#result").show();
}

