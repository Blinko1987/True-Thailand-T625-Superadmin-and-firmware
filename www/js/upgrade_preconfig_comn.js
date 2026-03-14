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
	$(':submit').click(function(){
		if ( $('form')[0].upgradefile.value == '' || $('form')[0].upgradefile.value == undefined )
		{
			alert("请选择升级文件");
			return false;
		}
		
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		
		//填充内容
		$("#pop_window_title", parentObj).html("升级提醒");
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("设备正在预配置升级，升级过程持续3-4分钟<br/>请勿断电，请耐心等待");
		$("#pop_window_option", parentObj).hide();
		showOrHidePopWindowFromIframe("show");

	});
	
	var options = {
		success:completeHandler
	};
	
	$("#upgrade_form").submit( function(){
		$(this).ajaxSubmit(options);
		return false;//阻止表单默认提交
	});
});

function completeHandler(returnData, statusText)
{
	if ( statusText != "success" )
	{
		errorHandler();
		return;
	}
	//returnData = JSON.parse(returnData);
	
	//if ( returnData && returnData.uploadStatus != null && returnData.uploadStatus != undefined && returnData.uploadStatus == 1 )
	if ( returnData &&  returnData.indexOf("UPLOADSUCCESS") >= 0 )
	{	
		var postdata = new Object();
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		jumpToLoginPage(true);
		XHR.post("reboot", postdata, null);
	}
	else
	{
		showOrHidePopWindowFromIframe("hide");
		errorHandler();
	}
}

function errorHandler()
{
	ptweblog("upload error");
	alert("文件升级失败，请重试");
}
