var voicedata = '';
var tokenstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_map", initPage);
	}
	else
	{
		XHR.get("get_voice_map_info", null, initPage);
	}
});

function initValidate()
{
	$("#voice_map_form").validate({
		debug: true,
		rules: {
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate mac filter failed.....");
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
	
	if (getdata != null && getdata.voice_map)
	{
		voicedata = getdata.voice_map;
		setCheckbox("SpecialMapEnable_checkbox",voicedata.DigitMapSpecialEnable);
		$("#SpecialMap_textarea").val(voicedata.DigitMapSpecial);
		setCheckbox("PBXMapEnable_checkbox",voicedata.PBXPrefixEnable);
		$("#PBXoutMap_textarea").val(voicedata.PBXPrefix);
		$("#PBXinMap_textarea").val(voicedata.PBXDigitMap);
		setCheckbox("DigitMapEnable_checkbox",voicedata.DigitMapEnable);
		$("#DigitMap_textarea").val(voicedata.DigitMap);
	}
}


function checkMapFields()
{
    var data = new Object();
	if($('#SpecialMapEnable_checkbox').attr('checked'))
	{
		if ($('#SpecialMap_textarea').val().length > "150")
		{
			alert("specificnumberlencheck".i18n());
			return false;
		}
	}
	if($('#PBXMapEnable_checkbox').attr('checked'))
	{
		if ($('#PBXoutMap_textarea').val().length > "20")
		{
			alert("externalprefixlencheck".i18n());
			return false;
		}
		if ($('#PBXinMap_textarea').val().length > "20")
		{
			alert("internalprefixlencheck".i18n());
			return false;
		}
	}
	if($('#DigitMapEnable_checkbox').attr('checked'))
	{
		if ($('#DigitMap_textarea').val().length > "1024")
		{
			alert("basicdigitmaplencheck".i18n());
			return false;
		}	
	}
	return true;
}


function saveApply()
{
	if( ! $("#voice_map_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	if(!checkMapFields())
	{
		return;
	}
	var postdata = new Object();
	postdata.DigitMapSpecialEnable = getCheckbox("SpecialMapEnable_checkbox");
	if ( postdata.DigitMapSpecialEnable == 1)
	{
		if (!isNullString($('#SpecialMap_textarea').val()))
		{
			postdata.DigitMapSpecial = $("#SpecialMap_textarea").val();
		}
		else
		{
			postdata.DigitMapSpecial = 'NULL';
		}
	}	
	
	postdata.PBXPrefixEnable = getCheckbox("PBXMapEnable_checkbox");
	if ( postdata.PBXPrefixEnable == 1)
	{
		if (!isNullString($('#PBXoutMap_textarea').val())) 
		{
			postdata.PBXPrefix = $("#PBXoutMap_textarea").val();
		}
		else
		{
			postdata.PBXPrefix = 'NULL';
		}
		if (!isNullString($('#PBXinMap_textarea').val())) 
		{
			postdata.PBXDigitMap = $("#PBXinMap_textarea").val();
		}
		else
		{
			postdata.PBXDigitMap = 'NULL';
		}
	}	
	
	postdata.DigitMapEnable = getCheckbox("DigitMapEnable_checkbox");
	
	if ( postdata.DigitMapEnable == 1)
	{
		if (!isNullString($('#DigitMap_textarea').val()))
		{
			postdata.DigitMap = $("#DigitMap_textarea").val();
		}
		else
		{
			postdata.DigitMap = 'NULL';
		}
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_voice_map_info", postdata, reloadSaveData);
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


