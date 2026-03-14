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
	initValidate();
	initPage();
});


function initValidate()
{
	$("#dsp_form").validate({
		debug: true,
		rules: {
			"gatewayip": {required: true, ipv4: true},
			"pcip": {required: true, ipv4: true},
			"gatewayport": {required: true, range_int:[1,65535]},
			"pcport": {required: true, range_int:[1,65535]}
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

function initPage()
{
	$("#gatewayip").val("192.168.1.1");
	$("#gatewayport").val("51000");
	$("#pcip").val("");
	$("#pcport").val("52000");
}

function saveApply( isTrunOn )
{
	var postdata = new Object();
	if ( isTrunOn )
	{
		postdata.action = "trunon";
		if( ! $("#dsp_form").valid() )
		{
			alert("某些项的值无效，请重新填写");
			return;
		}
		
		postdata.voiceport = $("#voiceport").val();
		postdata.gatewayip = $("#gatewayip").val();
		postdata.gatewayport = $("#gatewayport").val();
		postdata.pcip = $("#pcip").val();
		postdata.pcport = $("#pcport").val();
		
		$("#trunon").attr("disabled", true);
		$("#trunon").addClass("input_button_disabled");
		$("#trunoff").attr("disabled", false);
		$("#trunoff").removeClass("input_button_disabled");
		
	}
	else
	{
		postdata.action = "trunoff";
		postdata.voiceport = $("#voiceport").val();
		$("#trunon").attr("disabled", false);
		$("#trunon").removeClass("input_button_disabled");
		$("#trunoff").attr("disabled", true);
		$("#trunoff").addClass("input_button_disabled");
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_dsp", postdata, null);
}
function parseSetResult(data)
{
	
}

