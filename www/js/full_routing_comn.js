var tokenstr = "";
var wan_data = '';
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
		getDataByAjax("../fake/full_routing", initPage);
	}
	else
	{
		XHR.get("get_full_routing", null, initPage);
	}
});

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
	
	if (getdata != null && getdata.routing)
	{
		setCheckbox("IPForwardModeEnabled", getdata.routing.IPForwardModeEnabled);
		wan_data = getdata.routing.wan;
		initWanName();
		selectWanChange();
	}
}

function initWanName()
{
	var dynamicHTML = '';
	if ( wan_data.length >0 )
	{
		for ( i=0; i<wan_data.length; i++ )
		{
			var single = wan_data[i];
			dynamicHTML += '<option value="' + single.wan_index + splitchar + single.wan_session_index + splitchar + single.iporppp + '">' + single.Name + '</option>';
		}
	}
	$("#wan_select").html(dynamicHTML);
	if ( $("#wan_select option").size() == 0 )
	{
		$("#wansave").addClass("input_button_disabled");
		$("#wansave").attr("disabled", true);
	}
	else
	{
		$("#wansave").removeClass("input_button_disabled");
		$("#wansave").attr("disabled", false);
	}
}

function selectWanChange()
{
	if ( $("#wan_select option").size() > 0 )
	{
		var select_wan_index = $("#wan_select").val().split(splitchar)[0];
		var select_wan_session_index = $("#wan_select").val().split(splitchar)[1];
		if ( wan_data.length >0 )
		{
			for ( i=0; i<wan_data.length; i++ )
			{
				var single = wan_data[i];
				if ( single.wan_index == select_wan_index && single.wan_session_index == select_wan_session_index )
				{
					$("#IPForwardList").val(single.IPForwardList);
					setCheckbox("UpstreamWAN", single.UpstreamWAN);
					break;
				}
			}
		}
	}
}

function saveApply(action)
{
	var postdata = new Object();
	postdata.action = action;
	
	if ( action == 'enable' )
	{
		postdata.IPForwardModeEnabled = getCheckbox("IPForwardModeEnabled");
	}
	else if ( action == "wan" )
	{
		if ( $("#wan_select option").size() > 0 )
		{
			if (special_char_check($("#IPForwardList").val()) == true)
			{
				alert("specialcharcheck".i18n());
				return false;
			}
		
			postdata.IPForwardList = $("#IPForwardList").val();
			postdata.UpstreamWAN = getCheckbox("UpstreamWAN");
			postdata.wan_index = $("#wan_select").val().split(splitchar)[0];
			postdata.wan_session_index = $("#wan_select").val().split(splitchar)[1];
			postdata.wan_iporppp = $("#wan_select").val().split(splitchar)[2];
		}
		else
		{
			return;
		}
	}
	else
	{
		return;
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_full_routing", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

