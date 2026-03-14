var tokenstr = "";
var vlan_data = '';
var splitchar = '_';

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	$("#wan_select").bind("change", function(){
		selectWanChange();
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/igmp", initPage);
	}
	else
	{
		XHR.get("get_igmp_info", null, initPage);
	}
	initValidate();
});

function initValidate()
{
	$("#igmp_form").validate({
		debug: true,
		rules: {
			"MulticastSettings_tex": {required: $("#wan_select option").size()>0 , range_int:[-1,4095]}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			ptweblog("validate igmp ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			ptweblog("validate igmp failed.....");
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
	
	if (getdata != null && getdata.igmp)
	{
		setCheckbox("IGMPSnooping_checkbox", getdata.igmp.SnoopingEnable);
		setCheckbox("IGMPProxy_checkbox", getdata.igmp.ProxyEnable);
		setCheckbox("MLDSnooping_checkbox", getdata.igmp.X_PT_MldSnoopingEnable);
		setCheckbox("MLDProxy_checkbox", getdata.igmp.X_PT_MldProxyEnable);
		vlan_data = getdata.igmp.vlan;
		initWanName();
		selectWanChange();
	}
}

function initWanName()
{
	var dynamicHTML = '';
	if ( vlan_data.length >0 )
	{
		for ( i=0; i<vlan_data.length; i++ )
		{
			var single = vlan_data[i];
			if ( single.Name.toUpperCase().indexOf('INTERNET') >=0 || single.Name.toUpperCase().indexOf('OTHER') >=0 )
			{
				dynamicHTML += '<option value="' + single.wan_index + splitchar + single.wan_session_index + splitchar + single.iporppp + '">' + single.Name + '</option>';
			}
		}
	}
	$("#wan_select").html(dynamicHTML);
}

function selectWanChange()
{
	if ( $("#wan_select option").size() > 0 )
	{
		var select_wan_index = $("#wan_select").val().split(splitchar)[0];
		var select_wan_session_index = $("#wan_select").val().split(splitchar)[1];
		var select_iporppp = $("#wan_select").val().split(splitchar)[2];
		if ( vlan_data.length >0 )
		{
			for ( i=0; i<vlan_data.length; i++ )
			{
				var single = vlan_data[i];
				if ( single.wan_index == select_wan_index 
				&& single.wan_session_index == select_wan_session_index 
				&& single.iporppp == select_iporppp )
				{
					$("#MulticastSettings_tex").val(single.MulticastVlan);
					break;
				}
			}
		}
	}
}

function saveApply()
{
	if( ! $("#igmp_form").valid() )
	{
		alert("invalidrewrite".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.SnoopingEnable = getCheckbox("IGMPSnooping_checkbox");
	postdata.ProxyEnable = getCheckbox("IGMPProxy_checkbox");
	postdata.X_PT_MldSnoopingEnable = getCheckbox("MLDSnooping_checkbox");
	postdata.X_PT_MldProxyEnable = getCheckbox("MLDProxy_checkbox");
	if ( $("#wan_select option").size() > 0 )
	{
		postdata.Name = $("#wan_select option:selected").text();
		postdata.MulticastVlan = $("#MulticastSettings_tex").val();
		postdata.wan_index = $("#wan_select").val().split(splitchar)[0];
		postdata.wan_session_index = $("#wan_select").val().split(splitchar)[1];
		postdata.wan_iporppp = $("#wan_select").val().split(splitchar)[2];
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_igmp_info", postdata, reloadSaveData);
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

