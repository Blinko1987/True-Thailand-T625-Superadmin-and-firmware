var tokenstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	//initValidate();
	
	//$("#DDNSWANInterface_select").bind("change", function(){
	//	displayControl();
	//});
	
	$("#DDNSCfgEnabled").bind("click", function(){
		displayControl();
	});
	
	XHR.get("get_allwan_info", null, function(data){
		if ( data && data.wan )
		{
			var wan_num = 0;
			var dynamicHtml = '';
			
			if ( data.wan != '' )
			{
				wan_num = data.wan.length;
			}
			if ( wan_num > 0 )
			{
				for ( i=0; i< wan_num; i++ )
				{
					var single_wan = data.wan[i];
					
					if(single_wan.wan_index == 3 && single_wan.wan_session_index == 1 && single_wan.Name == "THSi")//true custom wan, cannot show
					{
						continue;
					}
					
					if ( single_wan.Name.indexOf('INTERNET') >= 0 && single_wan.Name.indexOf('_R_') >= 0 )
					{
						dynamicHtml += '<option value="' + single_wan.wan_index + '_' + single_wan.wan_session_index + '_' + single_wan.iporppp + '">' + single_wan.Name + '</option>';
					}
				}
			}
			
			$("#DDNSWANInterface_select").html(dynamicHtml);
		}
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ddns", initPage);
	}
	else
	{
		XHR.get("get_ddns_info", null, initPage);
	}
});

function checkDDNSCfgFields()
{
	if (special_char_check($("#DDNSUsername_text").val()) == true || special_char_check($("#DDNSPassword_password").val()) == true || special_char_check($("#DDNSDomainName_text").val()) == true)
	{
		alert("specialcharcheck".i18n());
		return false;
	}

	if(($('#DDNSUsername_text').val().length == 0)
	||($('#DDNSPassword_password').val().length == 0) ||($('#DDNSDomainName_text').val().length == 0))
	{
		alert("paramcannotempty".i18n());
		return false;
	}	
		
	return true;
}


function initValidate()
{
	$("#ddns_form").validate({
		debug: true,
		rules: {
			"DDNSUsername_text": {required: true, nocn: true},
			"DDNSPassword_password": {required: true, nocn: true},
			"DDNSDomainName_text": {required: true, nocn: true}
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
	
	if (getdata != null && getdata.ddns)
	{
		//ddns list
		var dynamicHTML = '';
		addindex = '';
		var k = 0;
		
		var wanddns_num = getdata.ddns.length;
		
		if ( wanddns_num > 0 )
		{
			for (var i=1; i<= getdata.ddns.length; i++ )
			{
				var single_wan_ddns = getdata.ddns[i-1];
				
				for (var j=1; j<=single_wan_ddns.maxnum; j++)
				{
					if (single_wan_ddns.singlewanddns != undefined)
					{
						single_ddns = single_wan_ddns.singlewanddns[j-1];
						
						if ( single_ddns != '' && single_ddns != undefined)
						{
							k = k + 1;
							if (k%2 == 1)
							{
								dynamicHTML += '<tr class="oddtr">';
							}
							else
							{
								dynamicHTML += '<tr class="eventr">';
							}
						
							dynamicHTML += '<td><span value="0">' + single_wan_ddns.wanname + '</span></td>';
							dynamicHTML += '<td><span value="0">' + single_ddns.DDNSProvider + '</span></td>';
							dynamicHTML += '<td><span value="0">' + single_ddns.DDNSUsername + '</span></td>';
							dynamicHTML += '<td><span value="0">' + single_ddns.DDNSDomainName + '</span></td>';
							if (single_ddns.DDNSStatus == "1")
							{
								dynamicHTML += '<td><span value="0">' + "Successfully Updated" + '</span></td>';
							}
							else
							{
								dynamicHTML += '<td><span value="0">' + "Fail Updated" + '</span></td>';
							}
							
							dynamicHTML += '<td width="10%"><input type="button" class="input_button_small input_button_heightwidth_unset" id="delete_' + single_wan_ddns.wan_index + '_' + single_wan_ddns.wan_session_index + '_' + single_wan_ddns.iporppp + '_' + single_ddns.ddns_index + '" onclick="doDelete(this.id)" value="'+ "delete".i18n() +'"></td>';
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
				}
			}
		}
		
		if (k == 0)
		{
			dynamicHTML += '<tr><td colspan="6" align="center">' + "nodata".i18n() + '</td></td>';
		}
		
		$("#ddns_list").html(dynamicHTML);
		
		setCheckbox("DDNSCfgEnabled", 0);
		$("#DDNSUsername_text").val('');
		$("#DDNSPassword_password").val('');
		$("#DDNSDomainName_text").val('');
		
		displayControl();
	}
}

function displayControl()
{
	if ( getCheckbox("DDNSCfgEnabled") == 0 )
	{
		$("#DDNSProvider_select").attr("disabled", true);
		$("#DDNSUsername_text").attr("disabled", true);
		$("#DDNSPassword_password").attr("disabled", true);
		$("#DDNSDomainName_text").attr("disabled", true);
	}
	else
	{
		$("#DDNSProvider_select").attr("disabled", false);
		$("#DDNSUsername_text").attr("disabled", false);
		$("#DDNSPassword_password").attr("disabled", false);
		$("#DDNSDomainName_text").attr("disabled", false);
	}
/*	
	if ( addindex == '' )
	{
		$("#add_div").hide();
	}
	else
	{
		$("#add_div").show();
	}*/
}

function doDelete(eid)
{
	//var index = eid.split('_')[1];
	
	var postdata = new Object();
	postdata.action = "delete";
	postdata.wan_index = eid.split("_")[1];
	postdata.wan_session_index = eid.split("_")[2];
	postdata.wan_iporppp = eid.split("_")[3];
	postdata.index = eid.split("_")[4];
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_ddns_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function doAdd()
{
/*	if( ! $("#ddns_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	*/
	if ($("#DDNSWANInterface_select").val() == undefined)
	{
		alert("Please add a internet route WAN");
		return false;
	}
	
	if( !checkDDNSCfgFields() )
	{
		return false;
	}
	var postdata = new Object();
	postdata.action = "add";
	postdata.index = addindex;
	postdata.wan_index = $("#DDNSWANInterface_select").val().split("_")[0];
	postdata.wan_session_index = $("#DDNSWANInterface_select").val().split("_")[1];
	postdata.wan_iporppp = $("#DDNSWANInterface_select").val().split("_")[2];
	postdata.DDNSCfgEnabled = getCheckbox("DDNSCfgEnabled");
	postdata.DDNSProvider = $("#DDNSProvider_select").val();
	postdata.DDNSUsername = $("#DDNSUsername_text").val();
	postdata.DDNSdwp = $("#DDNSPassword_password").val();
	postdata.DDNSDomainName = $("#DDNSDomainName_text").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_ddns_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}


