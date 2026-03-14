var tokenstr = "";
var gData;
var gallData;
var gallData2g;
var authModeListHtml = "<option value='WPA2PSKWPA3SAE'>WPA2/WPA3 Mixed</option>\
						<option value='WPAand11i'>WPA/WPA2 Mixed</option>\
						<option value='WPA'>WPA</option>\
						<option value='11i'>WPA2</option>\
						<option value='SharedKey'>SHARED</option>\
						<option value='Both'>BOTH</option>\
						<option value='None'>NONE</option>";
var authModeListHtml_CU = "<option value='WPAand11i'>WPA-PSK/WPA2-PSK</option>\
						<option value='WPA'>WPA-PSK</option>\
						<option value='11i'>WPA2-PSK</option>\
						<option value='SharedKey'>SHARED</option>\
						<option value='Both'>BOTH</option>\
						<option value='None'>NONE</option>";
var pwdModeListHtml =  "<option value='TKIPandAESEncryption'>TKIP+AES</option>\
						<option value='TKIPEncryption'>TKIP</option>\
				        <option value='AESEncryption'>AES</option>\
				        <option value='WEP'>WEP</option>";
var pwdModeListHtml_CU =  "<option value='TKIPandAESEncryption'>TKIP+AES</option>\
						<option value='TKIPEncryption'>TKIP</option>\
				        <option value='AESEncryption'>AES</option>\
				        <option value='WEP'>WEP</option>";
var wepPwdListHtml = "  <option value='Both'>OPEN+SHARE</option>\
						<option value='OpenSystem'>OPEN</option>\
						<option value='SharedKey'>SHARE</option>";
var keyBitListHtml = "  <option value='40-bit'>64-bit</option>\
						<option value='104-bit'>128-bit</option>";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");

	showOrHideLoadingWindowFromIframe("show");
	customSwitchInit();
	//customPasswordInit();
	//validate and submit
	//generatHtml();
	
	XHR.get("getWlanBasicSettingsAllssid_5G", null, function(data){
		if (data)
		{
			gallData = data;
		}
	});
	
	XHR.get("getWlanBasicSettingsAllssid", null, function(data){
		if (data)
		{
			gallData2g = data;
		}
	});
	
	initPage();
	//initValidate();

	//bind WIFI switch click event
	$("#WlanEnable_checkbox_value").bind("click", function(){
		changeDisCondition($(this).attr("id"));
	});

	//WlanAuthMode_select

	/* $("#WlanAuthMode_select").change(function(){
		checkShowHideElement();
	}); */

});


function changeDisCondition(elementId)
{
	/* if($("#"+elementId).attr("checked"))
	{
		$("input:not([type='button'],[type='checkbox']),select").attr("disabled", false);
		$(".password_content > .password_switch").css("background-color", "");
	}
	else
	{
		$("input:not([type='button'],[type='checkbox']),select").attr("disabled", true);
		$(".password_content > .password_switch").css("background-color", $(".password_content > input[type='password']").css("background-color"));
	} */
	
	if($("#"+elementId).attr("checked"))
	{
		$("#WlanHide_checkbox").attr("disabled", false);
		$("#WlanSsid_text").attr("disabled", false);
	}
	else
	{
		$("#WlanHide_checkbox").attr("disabled", true);
		$("#WlanSsid_text").attr("disabled", true);
	} 
}

function initPage()
{
	if(gDebug)
	{
		getDataByAjax("../fake/wlancfg5G", fillData);
	}else{
		XHR.get("wlanBasicSettings_5G", null, fillData);
	}
}


function saveApply()
{
	if( !checkWlanCommonFields() )
	{
		return false;
	}
	else
	{
		//表单校验完成再做WEPkey校验
		/* if ( $("#wep_settings").is(":visible")
				&& false == checkAllWepKeyValid($("#WlanKeyBit_select").val()) )
		{
			return false;
		} */
		
		var data = buildData();
		showOrHideLoadingWindowFromIframe("show");
		if(gDebug)
		{
			postDataByAjax("../fake/post", JSON.stringify(data));
		}else{
			XHR.get("get_operator", null, function(data){
				if ( data )
				{
					tokenstr = data.token;
				}
			});
			data.token = tokenstr;
			XHR.post("setWlanBasicCfg_5G", data, reloadSaveData);
		}
	}
}

function reloadSaveData(data)
{
	if(data)
	{
		reloadData(data);
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}

function checkAllWepKeyValid(WEPEncryptionLevel)
{
	var isValid = true;
	var wepKeyIdPrefix = "wlanWepKey";
	for(var i = 1; i <= 4; i++)
	{
		var id = wepKeyIdPrefix + i;
		var wepKey = $("#"+id).val();
		if(checkValidWEPKey(wepKey, WEPEncryptionLevel) == false){
            alert("wepkey".i18n() + i + "invalidreinput".i18n());
			isValid = false;
			break;
		}
	}
	return isValid;
}

function checkValidWEPKey(wepkey, WEPEncryptionLevel)
{
	if(WEPEncryptionLevel == "40-bit"){//64
		if (wepkey.length == 5)
		{
			if(isValidKey(wepkey, 5) == false){
				return false;
			}
		}
		else if (wepkey.length == 10)
		{
			if(isValidHex(wepkey, 10) == false){
				return false;
			}
		}
		else
		{
			return false;
		}
	}else if(WEPEncryptionLevel == "104-bit"){//128
		if (wepkey.length == 13)
		{
			if(isValidKey(wepkey, 13) == false){
				return false;
			}
		}
		else if (wepkey.length == 26)
		{
			if(isValidHex(wepkey, 26) == false){
				return false;
			}
		}
		else
		{
			return false;
		}
	}
}


function reloadData(responseData)
{
	if(responseData.success == "true")
	{
		ptweblog("post data success!");
		initPage();
	}
	else
	{
		alert("submit5gwifibasicparasfail".i18n());
	}
}

function checkWlanCommonFields()
{
	var ssid = $("#WlanSsid_text").val();
	//var key = $("#WlanPassword_password").val();
	if (isNullString(ssid) || ssid.length > 32)
	{
		alert("ssidcheckhint".i18n());
		return false;
	}
	
	if (ssid == gallData.ssid2 || ssid == gallData.ssid3 || ssid == gallData.ssid4)
	{
		alert("ssidnotsameforsameband".i18n());
		return false;
	}	
	
	//2.4G和5G只能有一对ssid相同；
	var samessid1 = 0;
	var samessid2 = 0;
	
	if (ssid == gallData2g.ssid1 || ssid == gallData2g.ssid2 || ssid == gallData2g.ssid3 || ssid == gallData2g.ssid4)
	{
		samessid1 = 1;
	}
	
	if (samessid1 == 1)
	{
		if ( (gallData.ssid2 != "" && (gallData.ssid2 == gallData2g.ssid1 || gallData.ssid2 == gallData2g.ssid2 || gallData.ssid2 == gallData2g.ssid3 || gallData.ssid2 == gallData2g.ssid4))
			|| (gallData.ssid3 != "" && (gallData.ssid3 == gallData2g.ssid1 || gallData.ssid3 == gallData2g.ssid2 || gallData.ssid3 == gallData2g.ssid3 || gallData.ssid3 == gallData2g.ssid4))
			|| (gallData.ssid4 != "" && (gallData.ssid4 == gallData2g.ssid1 || gallData.ssid4 == gallData2g.ssid2 || gallData.ssid4 == gallData2g.ssid3 || gallData.ssid4 == gallData2g.ssid4))
		)
		{
			samessid2 = 1;
		}
	}
	
	if (samessid1 == 1 && samessid2 == 1)
	{
		alert("onesetssidsamefordiffband".i18n());
		return false;
	}
	
	/* if (key.length < 8 || key.length > 31)
	{
		alert("wifipwdcheckhint".i18n());
		return false;
	} */
	
	/* if (special_char_check(ssid) == true || special_char_check(key) == true)
	{
		alert("specialcharcheck".i18n());
		return false;
	} */
	
	if (special_char_check(ssid) == true)
	{
		alert("specialcharcheck".i18n());
		return false;
	}
	
	/* var WPAReauthTimeval = $("#WPAReauthTime_text").val();
	if ( ! isValidNumberRange(WPAReauthTimeval, 60, 86400) )
	{
		alert("wpareauthinvalid".i18n());
		return false;
	} */
	return true;
}

/*
function initValidate()
{
	$("#wlan_basic_settings").validate({
		debug: false,
		rules: {
			"data.SSID": {required: true, maxlength:31},
	        "data.PreSharedKey": {required: true, maxlength:31, minlength:8}
	    },
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
					  "data.SSID": { required: ssidRequiredHint, maxlength:maxLength31},
	                  "data.PreSharedKey": { required: passwordRequiredHint, maxlength:maxLength31}
				  },
		  submitHandler: function(form){//校验成功回调
		  	ptweblog("validate wifi basic settings ok.....");
		  },
		  invalidHandler: function(form, validator) {  //校验失败回调
	   		ptweblog("validate wifi basic settings failed.....");
	   		return false;
	   	  }
	}); 
}*/

function generatHtml()
{
	if ( getOperator() == "CU" )
	{
		$("#WlanAuthMode_select").html(authModeListHtml_CU);
		$("#WlanPwdMode_select").html(pwdModeListHtml_CU);
	}
	else
	{
		$("#WlanAuthMode_select").html(authModeListHtml);
		$("#WlanPwdMode_select").html(pwdModeListHtml);
	}
	//$("#WlanWepPwd_select").html(wepPwdListHtml);
	$("#WlanKeyBit_select").html(keyBitListHtml);
}

function fillData(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	if(data.success == 'true')
	{
		gData = data.data;
		//$("#wlan_basic_settings").fill(data.data);
		setCheckbox("WlanEnable_checkbox_value", data.data.Enable);
		if (data.data.ssidHide == "1")
		{
			setCheckbox("WlanHide_checkbox", "0");
		}
		else
		{
			setCheckbox("WlanHide_checkbox", "1");
		}
		$("#WlanSsid_text").val(data.data.SSID);
		
		/* $("#WlanAuthMode_select").val(data.data.BeaconType);
		$("#WlanPwdMode_select").val(data.data.WPAEncryptionModes);
		$("#WlanKeyBit_select").val(data.data.WEPEncryptionLevel);
		$("#wlsecurity_KeyIndex").val(data.data.WEPKeyIndex);
		$("#wlanWepKey1").val(data.data.WEPKey1);
		$("#wlanWepKey2").val(data.data.WEPKey2);
		$("#wlanWepKey3").val(data.data.WEPKey3);
		$("#wlanWepKey4").val(data.data.WEPKey4);
		$("#WlanPassword_password").val(data.data.PreSharedKey);
		if(data.data.BeaconType == "Basic")
		{
			$("#WlanAuthMode_select").val(data.data.BasicAuthenticationMode);
		} */
		/* if(data.data.BeaconType == "11i")
		{
			$("#WlanAuthMode_select").val("WPA2");
		} */
		//$("#WPAReauthTime_text").val(data.data.WPAReauthTime);
	}else{
		alert("get wlanBasicSettings_5G failed!");
	}
	
	changeDisCondition("WlanEnable_checkbox_value");
	//checkShowHideElement();
}

function checkShowHideElement(elementId)
{
	var BeaconType = $("#WlanAuthMode_select").val();

	//认证模式
	switch(BeaconType){
		case "None":
			hide("wep_settings");
			if(getCheckbox("WlanEnable_checkbox_value"))
			{
				$("#WlanPwdMode_select").attr("disabled", false);//WEP
			}
			hideItem("WlanPwdMode_select", "WlanPassword_password");
			break;
		case "SharedKey":
		case "Both":
			var selectMode = $("#WlanPwdMode_select").val();
			if ( getOperator() == "CU" )
			{
				$("#WlanPwdMode_select").html(pwdModeListHtml_CU);
			}
			else
			{
				$("#WlanPwdMode_select").html(pwdModeListHtml);
			}
			if(getCheckbox("WlanEnable_checkbox_value"))
			{
				$("#WlanPwdMode_select").attr("disabled", true);
			}
			$("#WlanPwdMode_select option").each(function(){
				if ( $(this).val() != "WEP" )
				{
					$(this).remove();
				}
			});
			$("#WlanPwdMode_select").val(selectMode);
			
			showItem("WlanPwdMode_select");
			$("#wep_settings").show();
			hideItem("WlanPassword_password");
			break;
		default:
			var selectMode = $("#WlanPwdMode_select").val();
			if ( getOperator() == "CU" )
			{
				$("#WlanPwdMode_select").html(pwdModeListHtml_CU);
			}
			else
			{
				$("#WlanPwdMode_select").html(pwdModeListHtml);
			}
			if(getCheckbox("WlanEnable_checkbox_value"))
			{
				$("#WlanPwdMode_select").attr("disabled", false);
			}
			
			if(BeaconType == "11i")
			{
				$("#WlanPwdMode_select option").each(function(){
					if ( $(this).val() == "TKIPEncryption" )
					{
						$(this).remove();
					}
				});
			}
			
			if(BeaconType == "WPA2PSKWPA3SAE")
			{
				$("#WlanPwdMode_select option").each(function(){
					if ( $(this).val() == "TKIPEncryption" || $(this).val() == "TKIPandAESEncryption")
					{
						$(this).remove();
					}
				});
			}
			
			$("#WlanPwdMode_select option").each(function(){
				if ( $(this).val() == "WEP" )
				{
					$(this).remove();
				}
			});
			$("#WlanPwdMode_select").val(selectMode);
			
			hide("wep_settings");
			$("#WlanPwdMode_select").val(gData.WPAEncryptionModes);
			showItem("WlanPwdMode_select", "WlanPassword_password");
			if(getCheckbox("WlanEnable_checkbox_value"))
			{
				$("#WlanPwdMode_select").attr("disabled", false);//WEP
			}
			break;
	}
}


function buildData()
{
	var data = new Object();
	var postData = new Object();
	data.SSID = $("#WlanSsid_text").val();
	
	if (getCheckbox("WlanHide_checkbox") == 1)
	{
		data.ssidHide = 0;
	}
	else
	{
		data.ssidHide = 1;
	}
	
	/* var authMode = $("#WlanAuthMode_select").val();

	if(authMode == "SharedKey" || authMode == "Both"){
		data.BasicAuthenticationMode = authMode;
		data.BeaconType = "Basic";
		data.WEPEncryptionLevel = $("#WlanKeyBit_select").val();
		data.WEPKeyIndex = $("#wlsecurity_KeyIndex").val();
		data.WEPKey1 = $("#wlanWepKey1").val();
		data.WEPKey2 = $("#wlanWepKey2").val();
		data.WEPKey3 = $("#wlanWepKey3").val();
		data.WEPKey4 = $("#wlanWepKey4").val();
	}else if(authMode == "None"){
		//nothing
		data.BeaconType = authMode;
	}else{
		data.BeaconType = $("#WlanAuthMode_select").val();
		data.WPAEncryptionModes = $("#WlanPwdMode_select").val();
		data.PreSharedKey = $("#WlanPassword_password").val();
	}
	data.WPAReauthTime = $("#WPAReauthTime_text").val(); */
	
	data.Enable = getCheckbox("WlanEnable_checkbox_value");
	data.ConfigActive = getCheckbox("WlanEnable_checkbox_value");
	return data;
}

function jumptomultiaps()
{
	window.location.href = "wlan_multissid_info_5G_comn.html";
}




