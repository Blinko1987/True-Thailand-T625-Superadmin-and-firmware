$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
});

function saveApply()
{
	if ( $("#cmd").val() == '' )
	{
		alert("命令不能为空");
		return;
	}
	else
	{
		showOrHideLoadingWindowFromIframe("show");
		
		var result = $.ajax({url:"../cgi-bin/shortcut_telnet.cgi?" + $("#cmd").val(), async:false}).responseText;
		
		var dynamicHTML = "您执行的命令是：" + $("#cmd").val() + "<br />";
		dynamicHTML += "执行结果为：<br />";
		dynamicHTML += result;
		$("#result").html(dynamicHTML);
		$("#result").show();
		
		showOrHideLoadingWindowFromIframe("hide");
	}
}
