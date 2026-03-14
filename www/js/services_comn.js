var tokenstr = "";
var data;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();

	showOrHideLoadingWindowFromIframe("show");
	
	$("input[type='radio']").bind("click", function(){
		saveApply(false, this);
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/services", initPage);
	}
	else
	{
		XHR.get("get_services", null, initPage);
	}
});

function initValidate()
{
	$("#services_form").validate({
		debug: true,
		rules: {
			"terminal_number": {required: true, range_int: [2,254]}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate loid ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate loid failed.....");
			return false;
		}
	}); 
}

function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	if ( getdata && getdata.services )
	{
		data = getdata.services;
		setRadio("ftp", data.ftp);
		setRadio("telnet", data.telnet);
		setRadio("dnsrelay", data.dnsrelay);
		setRadio("portal", data.portal);
		if ( getOperator() == "CM" )
			setRadio("scan", data.scan);
		//todo static/online
		setRadio("access", data.access);
		$("#terminal_number").val(data.terminal_number);
	}
}

function saveApply(isButtonClick, element)
{
	if( isButtonClick && ! $("#services_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	if ( isButtonClick )
	{
		postdata.terminal_number = $("#terminal_number").val();
		postdata.action = "terminal_number";
	}
	else
	{
		//if services value not change, do nothing
		if ( eval("data."+ element.name) == getRadio(element.name) )
		{
			return;
		}
		postdata.action = element.name;
		postdata[element.name] = getRadio(element.name);
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_services", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

