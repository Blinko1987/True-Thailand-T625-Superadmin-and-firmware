var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/dmz", initPage);
	}
	else
	{
		XHR.get("get_dmz_info", null, initPage);
	}
});

function initValidate()
{
	$("#dmz_form").validate({
		debug: true,
		rules: {
			"DMZ_text": {ipv4: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate dmz ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate dmz failed.....");
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
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.dmz)
	{
		setCheckbox("DMZEnable_checkbox", getdata.dmz.Enable);
		$("#DMZ_text").val(getdata.dmz.DMZIP);
	}
	
	controlenordisable();
}

function controlenordisable()
{
	if($("#DMZEnable_checkbox").attr("checked"))
	{
		$("#DMZ_text").attr("disabled", false);
	}
	else
	{
		$("#DMZ_text").attr("disabled", true);
	}
}

function saveApply()
{
	if( ! $("#dmz_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.Enable = getCheckbox("DMZEnable_checkbox");
	postdata.DMZIP = $("#DMZ_text").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_dmz_info", postdata, reloadSaveData);
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

