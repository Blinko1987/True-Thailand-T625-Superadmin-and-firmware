var tokenstr = "";
var url_filter_data;
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
		getDataByAjax("../fake/url_filter", initPage);
	}
	else
	{
		XHR.get("get_url_filter_info", null, initPage);
	}
});

function initValidate()
{
	$("#url_filter_list_form").validate({
		debug: true,
		rules: {
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate url filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate url filter failed.....");
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
	
	if (getdata != null && getdata.url_filter)
	{
		url_filter_data = getdata.url_filter;
		$("#maxnum").html(url_filter_data.maxnum);
		setCheckbox("enable_checkbox", url_filter_data.URLFEnable);
		$("#mode_select").val(url_filter_data.URLFMode);
		
		//url list
		var dynamicHTML = '';
		var j = 0;
		addindex = '';
		for (var i=1; i<=url_filter_data.maxnum; i++ )
		{
			var single = eval("url_filter_data." + url_filter_data.URLFMode + i);
			if ( single != '' && single != undefined)
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
				dynamicHTML += '<td><span id="span_' + i + '" value="0">' + single + '</span></td>';
				// dynamicHTML += '<td width="20%"><input type="button" id="modify_' + i + '" onclick="doModify(this.id)" value="编辑"></td>';
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
		
		$("#url_list").html(dynamicHTML);
	}
	$("#add_text").val('');
	displayControl();
}
//todo
function doModify(eid)
{
	ptweblog(eid);
	var index = eid.split('_')[2];
	
	if ( $("#span_" + index).attr("value") == 0 )
	{
		$("#span_" + index).attr("value", 1);
	}
	else
	{
		$("#span_" + index).attr("value", 0);
	}
}

function doDelete(eid)
{
	var index = eid.split('_')[1];
	
	var postdata = new Object();
	postdata.action = "delete";
	postdata.URLFMode = url_filter_data.URLFMode;
	postdata.index = index;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_url_filter_info", postdata, initPage);
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
		alert("urlinvalid".i18n());
		return;
	}
	
	if( $("#add_text").val().length >= 256 )
	{
		alert("urllengthcheck".i18n());
		$("#add_text").val("");
		return;
	}
	
	var postdata = new Object();
	postdata.action = "add";
	postdata.URLFMode = url_filter_data.URLFMode;
	postdata.url = $("#add_text").val();
	postdata.index = addindex;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_url_filter_info", postdata, initPage);
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
		for (var i=1; i<=url_filter_data.maxnum; i++ )
		{
			var single = eval("url_filter_data." + url_filter_data.URLFMode + i);
			if ( $("#add_text").val() ==  single )
			{
				error_num ++;
				$("#add_text_error").html("urlexist".i18n());
			}
		}
		
		var add_text = $("#add_text").val();
		for ( var i=0; i<add_text.length; i++ )
		{
			if ( /[0-9a-zA-Z.]/.test(add_text[i]) == false )
			{
				error_num ++;
				$("#add_text_error").html("enterhostname".i18n());
				break;
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
	
	if ( url_filter_data.URLFEnable == '1' )
	{
		$("#url_filter_list_form").show();
	}
	else
	{
		$("#url_filter_list_form").hide();
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
	if( ! $("#url_filter_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.action = "mode";
	postdata.URLFEnable = getCheckbox("enable_checkbox");
	postdata.URLFMode = $("#mode_select").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_url_filter_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

