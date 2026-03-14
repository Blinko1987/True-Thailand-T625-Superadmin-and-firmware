var tokenstr = "";
var login_user = "1";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata )
		{
			tokenstr = getdata.token;
			login_user = getdata.login_user;
		}
		
		if (login_user == 0)
		{
			$("#venderid_text").attr("disabled",true);
			$("#savebtn").attr("disabled",true);
		}
		else
		{
			$("#venderid_text").attr("disabled",false);
			$("#savebtn").attr("disabled",false);
		}
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/omci", initPage);
	}
	else
	{
		XHR.get("get_omci_info", null, initPage);
	}
});

function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata)
	{
		$("#venderid_text").val(getdata.VendorId);
	}
}

function saveApply()
{
	if( $("#venderid_text").val() == "" )
	{
		alert("omcivenderidcannotempty".i18n());
		return;
	}
	
	if ( special_char_check($("#venderid_text").val()) == true )
	{
		alert("specialcharcheck".i18n());
		return false;
	}
	
	var postdata = new Object();
	postdata.VendorId = $("#venderid_text").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_omci_info", postdata, reloadSaveData);
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

