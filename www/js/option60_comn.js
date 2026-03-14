var tokenstr = "";
var vlan_data = '';
var splitchar = '_';

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();

	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/option60", initPage);
	}
	else
	{
		XHR.get("get_option60", null, initPage);
	}
});

function initValidate()
{
	$("#option_form").validate({
		debug: true,
		rules: {
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
	
	if ( getdata && getdata.option )
	{
		var data = getdata.option;
		
		//data.option60_encry_enable == "no" ? setCheckbox("option60_encry_enable", 0):setCheckbox("option60_encry_enable", 1);
		//data.option_125_enable == "no" ? setCheckbox("option_125_enable", 0):setCheckbox("option_125_enable", 1);
		//$("#option_125_value").val(data.vlan[0].option125Value);
		
		$("#SerialNumber").val(data.SerialNumber);
		
	}
	vlan_data = getdata.option.vlan;
	//alert(vlan_data[0].Name);
	initWanName();
	selectWanChange();
}
function selectWanChange()
{
	if ( $("#wan_select option").size() > 0 )
	{
		var select_wan_index = $("#wan_select").val().split(splitchar)[0];
		var select_wan_session_index = $("#wan_select").val().split(splitchar)[1];
		if ( vlan_data.length >0 )
		{
			for ( i=0; i<vlan_data.length; i++ )
			{
				var single = vlan_data[i];
				if ( single.wan_index == select_wan_index && single.wan_session_index == select_wan_session_index )
				{
					single.option60Enable == "0" ? setCheckbox("option60_encry_enable", 0):setCheckbox("option60_encry_enable", 1);
					single.option125Enable == "0" ? setCheckbox("option_125_enable", 0):setCheckbox("option_125_enable", 1);				
				
					$("#option_125_value").val(single.option125Value);
					break;
				}
			}
		}
	}
}
function initWanName()
{
	var dynamicHTML = '';
	//alert(vlan_data);
	//alert(single.Name.toUpperCase());
	if ( vlan_data.length >0 )
	{
		for ( i=0; i<vlan_data.length; i++ )
		{
			var single = vlan_data[i];

				dynamicHTML += '<option value="' + single.wan_index + splitchar + single.wan_session_index + splitchar + single.iporppp + '">' + single.Name + '</option>';
				
			
		}
	}
	$("#wan_select").html(dynamicHTML);
}


function saveApply()
{
	if( ! $("#option_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	
	postdata.SerialNumber = $("#SerialNumber").val();
	if ( $("#wan_select option").size() > 0 )
	{
		postdata.option125Value = $("#option_125_value").val();
		postdata.wan_index = $("#wan_select").val().split(splitchar)[0];
		postdata.wan_session_index = $("#wan_select").val().split(splitchar)[1];
		postdata.wan_iporppp = $("#wan_select").val().split(splitchar)[2];
		getCheckbox("option60_encry_enable") == 1 ? postdata.option60Enable = "1" : postdata.option60Enable = "0";
		getCheckbox("option_125_enable") == 1 ? postdata.option125Enable = "1" : postdata.option125Enable = "0";

	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_option60", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

