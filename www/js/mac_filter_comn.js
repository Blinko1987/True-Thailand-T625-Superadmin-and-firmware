var tokenstr = "";
var mac_filter_data;
var addindex = '';

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
		getDataByAjax("../fake/mac_filter", initPage);
	}
	else
	{
		XHR.get("get_mac_filter_info", null, initPage);
	}
});

function initValidate()
{
	$("#mac_filter_list_form").validate({
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
	
	if (getdata != null && getdata.mac_filter)
	{
		mac_filter_data = getdata.mac_filter;
		$("#maxnum").html(mac_filter_data.maxnum);
		setCheckbox("enable_checkbox", mac_filter_data.MACFEnable);
		$("#mode_select").val(mac_filter_data.MACFMode);
		
		//mac list
		var dynamicHTML = '';
		addindex = '';
		var j = 0;
		for (var i=1; i<=mac_filter_data.maxnum; i++ )
		{
			var single = eval("mac_filter_data." + mac_filter_data.MACFMode + i);
			if ( single != '' && single != 'disable' && single != undefined )
			{
				j = j + 1;
				if (j%2 == 1)
				{
					dynamicHTML += '<tr class="oddtr">';
				}
				else
				{
					dynamicHTML += '<tr class="eventr">';
				}

				dynamicHTML += '<td><span id="span_' + i + '" value="0">' + single.toUpperCase() + '</span></td>';
				dynamicHTML += '<td width="40%"><input type="button" class="input_button_small input_button_heightwidth_unset" id="delete_' + i + '" onclick="doDelete(this.id)" value="'+ "delete".i18n() +'"></td>';
				dynamicHTML += '</tr>';
			}
			else
			{
				if ( addindex == '' )
				{
					addindex = i;
				}
			}
		}
		if (j == 0)
		{
			dynamicHTML += '<tr><td colspan="2" align="center">' + "nodata".i18n() + '</td></td>';
		}
		$("#mac_list").html(dynamicHTML);
	}
	$("#add_text").val('');
	displayControl();
}


function doDelete(eid)
{
	var index = eid.split('_')[1];
	
	var postdata = new Object();
	postdata.action = "delete";
	postdata.MACFMode = mac_filter_data.MACFMode;
	postdata.index = index;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_mac_filter_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function doAdd()
{
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if( ! extraValidCheck() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	var postdata = new Object();
	postdata.action = "add";
	postdata.MACFMode = mac_filter_data.MACFMode;
	postdata.mac = $("#add_text").val().toUpperCase();
	postdata.index = addindex;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_mac_filter_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function extraValidCheck()
{
	var error_num = 0;
	if ( $("#add_text").val() == '' )
	{
		error_num ++;
		$("#add_text_error").html("mustinput".i18n());
	}
	else
	{
		if ( ! isValidMacAddress($("#add_text").val()) )
		{
			error_num ++;
			$("#add_text_error").html("macaddrcheck".i18n());
		}
		for (var i=1; i<=mac_filter_data.maxnum; i++ )
		{
			var single = eval("mac_filter_data." + mac_filter_data.MACFMode + i);
			if (single != undefined)
			{
				if ( $("#add_text").val().toUpperCase() ==  single.toUpperCase() )
				{
					error_num ++;
					$("#add_text_error").html("macexist".i18n());
				}
			}
		}
	}
	
	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}

function displayControl()
{
	if ( $("#mode_select").val() == 'white' )
	{
		$("#white_hint").show();
		$("#black_hint").hide();
	}
	else
	{
		$("#white_hint").hide();
		$("#black_hint").show();
	}
	
	if ( mac_filter_data.MACFEnable == '1' )
	{
		$("#mac_filter_list_form").show();
	}
	else
	{
		$("#mac_filter_list_form").hide();
	}
	
	if ( addindex == '' )
	{
		$("#add_div").hide();
	}
	else
	{
		$("#add_div").show();
	}
}

function saveApply()
{
	if( ! $("#mac_filter_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.action = "mode";
	postdata.MACFEnable = getCheckbox("enable_checkbox");
	postdata.MACFMode = $("#mode_select").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_mac_filter_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}


