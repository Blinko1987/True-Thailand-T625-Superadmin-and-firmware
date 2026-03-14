var tokenstr = "";
var modeArray = new Array('TR069', 'VOIP', 'IPTV', 'INTERNET', 'OTHER'); //1 2 4 8 16
var modeListHTML = "<option value='16'>OTHER</option><option value='9'>TR069,INTERNET</option><option value='11'>TR069,VOIP,INTERNET</option><option value='13'>TR069,IPTV,INTERNET</option><option value='15'>TR069,VOIP,IPTV,INTERNET</option>";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	initDynamicHTML();
	
	$("input:checkbox").bind("change", function(){
		checkDisableDisplayElement();
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/qos_base", initPage);
	}
	else
	{
		XHR.get("get_qos_base_info", null, initPage);
	}
});

function initValidate()
{
	$("#qos_base_form").validate({
		debug: true,
		rules: {
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate qos_base ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate qos_base failed.....");
			return false;
		}
	}); 
}

function initDynamicHTML()
{
	$("#qoscfg_template").html(modeListHTML);
}

function checkDisableDisplayElement()
{
	if ( $("#QoSEnable_checkbox").attr("checked") )
	{
		$("#mode_div").show();
	}
	else
	{
		$("#mode_div").hide();
	}
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
	
	if (getdata != null && getdata.qos)
	{
		var qosdata = getdata.qos;
		setCheckbox("QoSEnable_checkbox", qosdata.Enable);
		$("#qoscfg_template").val(parseValueByString(qosdata.Mode, modeArray));
	}
	checkDisableDisplayElement();
}

function saveApply()
{
	if( ! $("#qos_base_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.Enable = getCheckbox("QoSEnable_checkbox");
	postdata.Mode = parseStringByValue($("#qoscfg_template").val(), modeArray);
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_qos_base_info", postdata, reloadSaveData);
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

