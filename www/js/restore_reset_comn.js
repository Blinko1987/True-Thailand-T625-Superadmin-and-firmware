$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
});

function restore_factory()
{
	cleanPopWindowContentFromIframe();
	var parentObj = window.parent.document;
	//填充内容
	$("#pop_window_title", parentObj).html("恢复出厂设置确认");
	$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_help"></div>');
	$("#pop_window_message", parentObj).html("该操作会导致您的设备恢复到出厂配置，确定要恢复出厂配置吗？");
	
	//更改确认操作函数
	var eid = parentObj.getElementById("confirm");
	eid.onclick = function(){
		$("#pop_window_title", parentObj).html("恢复出厂配置提醒");
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("设备正在恢复出厂，此过程持续2分钟左右<br/>请勿断电，请耐心等待");
		$("#pop_window_option", parentObj).hide();
		jumpToLoginPage(true);
		XHR.post("restore_short", null, null);
	};
	
	showOrHidePopWindowFromIframe("show");
}

function reloadData(responseData)
{
	if ( responseData.success != "true")
	{
		alert("恢复出厂配置失败！");
	}
	else
	{
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		//填充内容
		$("#pop_window_title", parentObj).html("恢复出厂配置提醒");
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("设备正在恢复出厂，此过程持续2分钟左右<br/>请勿断电，请耐心等待");
		$("#pop_window_option", parentObj).hide();
		showOrHidePopWindowFromIframe("show");
		
		//XHR.post("reboot", null, null);
		jumpToLoginPage(true);
	}
}
