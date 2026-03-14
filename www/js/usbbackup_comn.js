
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/usb_device", initPage);
	}
	else
	{
		XHR.get("get_usb_device", null, initPage);
	}
});



function initPage(getdata)
{
	showOrHideLoadingWindowFromIframe("hide");
	var usb_device = getdata.usb.split("\n");
	
	var dynamicHTML = '';
	for ( var i=0; i<usb_device.length; i++ )
	{
		if ( undefined != usb_device[i] && '' != usb_device[i] )
		{
			dynamicHTML += '<option value="' + usb_device[i] + '">' + usb_device[i] + '</option>';
		}
	}
	
	$("#usb_device").html(dynamicHTML);
}


function saveApply()
{
	var select_usb = $("#usb_device").val();
	if( undefined == select_usb || '' == select_usb )
	{
		alert("请连接USB设备");
		return;
	}
	
	var postdata = new Object();
	postdata.usb = select_usb;
	
	XHR.post("usb_backup", postdata, function(returndata){
		showOrHideLoadingWindowFromIframe("hide");
		if ( returndata.ret == 0 )
		{
			alert("备份成功");
		}
		else
		{
			alert("备份失败");
		}
	});
	showOrHideLoadingWindowFromIframe("show");
}

