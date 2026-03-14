var tokenstr = "";
var gIndex = "1";
var gData;
var ssidIndexArray = new Array();
var login_user = -1;
var WPAEnListHtml = "<option value='TKIPandAESEncryption'>TKIP+AES</option>\
						<option value='TKIPEncryption'>TKIP</option>\
						<option value='AESEncryption'>AES</option>\
						<option value='WEP'>WEP</option>";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	showOrHideLoadingWindowFromIframe("show");
	XHR.get("get_login_user", null, function(data){
		if ( data )
		{
			login_user = data.login_user;
		}
	});
	initPage();
	customSwitchInit();
	customPasswordInit();

	$("#wlsecurity_SSID").bind("change", function(){
		gIndex = $("#wlsecurity_SSID").val();
		fillWlanFormByindex(gIndex, gData);
		checkShowHideElement("wlsecurity_NetworkWay");
	});

	$("#wlsecurity_NetworkWay").bind("change", function(){
		checkShowHideElement("wlsecurity_NetworkWay");
		customScrollBar("html");
	});

});


function initPage()
{
	gDebug = false;

	if(gDebug)
	{
		getDataByAjax("../fake/wlanAdvancedSettingsAll", fillData);
	}else{
		XHR.get("wlanAdvancedSettingsAll", null, fillData);
	}
}

function fillData(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	showOrHideLoadingWindowFromIframe("hide");

	if(data.success != 'true')
	{
		alert("get wlanAdvancedSettings failed!");
		return false;
	}
	gData = data;
	ssidNum = checkSSIDNumber(data, ssidIndexArray);
	
	generateIndexSelect(ssidIndexArray, ssidNum, data);
	fillWlanFormByindex(gIndex, gData);
	checkShowHideElement();
}

function generateIndexSelect(ssidNumArray, ssidNumber, data)
{
	var i = 1;
	//先清空所有的ssid
	$("#wlsecurity_SSID").html("");
	var number = ssidNumArray.length;
	for(; i <= number; i++)
	{
		if(i == 1)
		{
			$("#wlsecurity_SSID").append("<option value='" + i + "'>Root AP - " + (data["ssid"+i].SSID).replace(/\s/g,'&nbsp') + "</option>");
		}
		else
		{
			if(ssidNumArray[i-1] != '0' && data["ssid"+i].Enable == "1")
			{
				$("#wlsecurity_SSID").append("<option value='" + i + "'>AP" + eval(i-1) +" - " + (data["ssid"+i].SSID).replace(/\s/g,'&nbsp') + "</option>");
			}
		}
	}
	$("#wlsecurity_SSID").val(gIndex);
}


function fillWlanFormByindex(index, data)
{
	$("#wlsecurity_WPAEncryption").html(WPAEnListHtml);

	var dataFill = data["ssid"+index];
	$("#wlanAdv_settings_form").fill(dataFill);

	if(dataFill.BeaconType == "Basic")
	{
		hideItem("wlsecurity_WPAkeys");
		$("#wlsecurity_NetworkWay").val(dataFill.BasicAuthenticationMode);
		$("#wlsecurity_WPAEncryption").val("WEP").attr("disabled", true);
		$("#wlsecurity_WPAEncryption").find("option").each(function(){
			if($(this).val() != "WEP")
			{
				$(this).hide();
			}
		});
		show("wep_settings");
	}
}


function saveApply()
{
	//校验WEPkey
	if( $("#wlsecurity_WEP").is(":visible") &&
        false == checkAllWepKeyValid($("#wlsecurity_Keylength").val()))
    {
		// alert("wepkey无效，请重新填写！");
		return false;
	}
	
	if ( $("#wlsecurity_WPAkeys").is(":visible") )
	{
		var wpakeys = $("#wlsecurity_WPAkeys").val();
		if ( wpakeys.length < 8 || wpakeys.length > 64 )
		{
			alert("wifipwdcheckhint".i18n());
			return false;
		}
	}
	
	var WPAReauthTimeval = $("#WPAReauthTime_text").val();
	if ( ! isValidNumberRange(WPAReauthTimeval, 60, 86400) )
	{
		alert("wpareauthinvalid".i18n());
		return false;
	}

	var data = buildData();
	showOrHideLoadingWindowFromIframe("show");
	if(gDebug){
		postDataByAjax("../fake/wlanAdvancedAll", data);
	}else{
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		data.token = tokenstr;
		XHR.post("setWlanAdvancedCfgAll", data, reloadSaveData);
	}
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
	showOrHideLoadingWindowFromIframe("hide");
	if(responseData.success == "true")
	{
		ptweblog("post data success!");
		initPage();
	}
	else
	{
		alert("submitwifiadvparasfail".i18n());
	}
}

function buildData()
{
	var data = new Object();
	data.index = gIndex; 
	$("input,select").each(function(){
		if( $(this).attr("name") && $(this).is(":visible") )
		{
			var param = $(this).attr("name").substring("data.".length);
			if ( param == "BeaconType" ) //special handler for BeaconType
			{
				var selectType = $(this).val();
				if ( selectType == "SharedKey" || selectType == "Both" )
				{
					data.BeaconType = "Basic";
					data.BasicAuthenticationMode = selectType;
				}
				else
				{
					data.BeaconType = selectType;
				}
			}
			else
			{
				data[param] = $(this).val();
			}
		}
		
	});
	data.Enable = gData["ssid"+gIndex].Enable;

	return data;
}

function checkShowHideElement(elementId)
{
	var beaconType = $("#wlsecurity_NetworkWay").val();

	if(beaconType == "SharedKey" || beaconType == "Both")
	{
		hideItem("wlsecurity_WPAkeys");
		
		var selectMode = $("#wlsecurity_WPAEncryption").val();
		$("#wlsecurity_WPAEncryption").html(WPAEnListHtml);
		$("#wlsecurity_WPAEncryption").attr("disabled", true);
		$("#wlsecurity_WPAEncryption option").each(function(){
			if ( $(this).val() != "WEP" )
			{
				$(this).remove();
			}
		});
		$("#wlsecurity_WPAEncryption").val(selectMode);
		
		showItem("wlsecurity_WPAEncryption");
		show("wlsecurity_WEP");

	}else if(beaconType == "None"){
		hide("wlsecurity_WEP");
		hideItem("wlsecurity_WPAEncryption", "wlsecurity_WPAkeys");
	}else{
		hide("wlsecurity_WEP");
		showItem("wlsecurity_NetworkWay", "wlsecurity_WPAkeys");
		
		var selectMode = $("#wlsecurity_WPAEncryption").val();
		$("#wlsecurity_WPAEncryption").html(WPAEnListHtml);
		$("#wlsecurity_WPAEncryption").attr("disabled", false);
		
		if(beaconType == "11i")
		{
			$("#wlsecurity_WPAEncryption option").each(function(){
				if ( $(this).val() != "AESEncryption" )
				{
					$(this).remove();
				}
			});
		}
		
		if(beaconType == "WPA2PSKWPA3SAE")
		{
			$("#wlsecurity_WPAEncryption option").each(function(){
				if ( $(this).val() == "TKIPEncryption" || $(this).val() == "TKIPandAESEncryption")
				{
					$(this).remove();
				}
			});
		}
		
		$("#wlsecurity_WPAEncryption option").each(function(){
			if ( $(this).val() == "WEP" )
			{
				$(this).remove();
			}
		});
		$("#wlsecurity_WPAEncryption").val(selectMode);
		
		showItem("wlsecurity_WPAEncryption");
	}

}

function changeDisCondition(elementId)
{
	if($("#"+elementId).hasClass("switch_content_on"))
	{
		$("input:not([type='button']),select").attr("disabled", false);
		$(".password_content > .password_switch").css("background-color", "");
	}
	else
	{
		$("input:not([type='button']),select").attr("disabled", true);
		$(".password_content > .password_switch").css("background-color", $(".password_content > input[type='password']").css("background-color"));
	}
}


function checkSSIDNumber(data, array)
{
	array.splice(0, array.length);
	if((data == undefined) || (data == "")){
		return 0;
	}
	var number = 0;
	var sum = -1;
	if(login_user == 1){
		sum = 7;
	}else{
		sum = 4;
	}
	for(var i = 1; i <= sum; i++)
	{
		var ssidIndex = "ssid" + i;
		if((data[ssidIndex] != undefined) && (data[ssidIndex] != "")){
			number++;
			array.push("1");
		}else{
			array.push("0");
		}

	}
	return number;
}