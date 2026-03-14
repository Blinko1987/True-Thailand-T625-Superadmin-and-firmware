var tokenstr = "";
var gallData;
var gallData5g;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	XHR.get("getWlanBasicSettingsAllssid_5G", null, function(data){
		if (data)
		{
			gallData5g = data;
		}
	});

	XHR.get("get_login_user", null, function(data){
		if ( data )
		{
			if ( data.login_user == 1 ) 
			{
				document.getElementById("ssid7").style.display = "";
			}
			else 
			{
				document.getElementById("ssid4").style.display = "none";
				document.getElementById("ssid5").style.display = "none";
				document.getElementById("ssid6").style.display = "none";
				document.getElementById("ssid7").style.display = "none";
			}
		}
	});
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wifi_info", parseGetData);
	}
	else
	{
		XHR.get("wlanBasicSettingsAll", null, parseGetData);
	}
}

function parseGetData(data)
{
	showOrHideLoadingWindowFromIframe("hide");

	if ( data )
	{
		if(data.success != 'true')
		{
			alert("get wlanBasicSettings failed!");
			return;
		}
		
		gallData = data;

		for (i = 2; i <= 8; i++)
		{
			fillWlanFormByIndex(i, data);
			if(i != 8){
                enableordisable(i);
			}else{
				
			}
		}
	}
}


function fillWlanFormByIndex(index, data)
{
	var j = index - 1;
	var dataObj = data["ssid"+index];
	
	var enablechkidstr = "WlanEnable_checkbox_ap" + j;
	
	setCheckbox(enablechkidstr, dataObj.Enable);
	$("#WlanSsid_text"+ j).val(dataObj.SSID);
	$("#wlcfg_wlgMode"+ j).val(dataObj.wlanMode);
	$("#wlcfg_wlRate"+ j).val(dataObj.rate802);
	$("#wlcfg_hide_ssid"+ j).val(dataObj.ssidHide);
	$("#wlcfg_wmm"+ j).val(dataObj.wmmEnable);
	$("#wlcfg_guestnetwork"+ j).val(dataObj.guestnetworkEnable);
}

function enableordisable(index)
{
	var j = index - 1;
	if ($("#WlanEnable_checkbox_ap" + j).attr("checked"))
	{
		$("#WlanSsid_text" + j).attr("disabled",false);
		$("#wlcfg_wlgMode" + j).attr("disabled",false);
		$("#wlcfg_wlRate" + j).attr("disabled",false);
		$("#wlcfg_hide_ssid" + j).attr("disabled",false);
		if (j==1 || j==2)
		{
			$("#wlcfg_guestnetwork" + j).attr("disabled",false);
		}
		else
		{
			$("#wlcfg_guestnetwork" + j).attr("disabled",true);
		}
	}
	else
	{
		$("#WlanSsid_text" + j).attr("disabled",true);
		$("#wlcfg_wlgMode" + j).attr("disabled",true);
		$("#wlcfg_wlRate" + j).attr("disabled",true);
		$("#wlcfg_hide_ssid" + j).attr("disabled",true);
		$("#wlcfg_guestnetwork" + j).attr("disabled",true);
	}
}

function saveApply()
{
	// if (($("#WlanSsid_text1").val() != "" && ($("#WlanSsid_text1").val() == gallData["ssid1"].SSID || $("#WlanSsid_text1").val() == $("#WlanSsid_text2").val() || $("#WlanSsid_text1").val() == $("#WlanSsid_text3").val() || $("#WlanSsid_text1").val() == $("#WlanSsid_text4").val()
	// 	|| $("#WlanSsid_text1").val() == $("#WlanSsid_text5").val() || $("#WlanSsid_text1").val() == $("#WlanSsid_text6").val() || $("#WlanSsid_text1").val() == $("#WlanSsid_text7").val()))
	// 	|| ($("#WlanSsid_text2").val() != "" && ($("#WlanSsid_text2").val() == gallData["ssid1"].SSID || $("#WlanSsid_text2").val() == $("#WlanSsid_text1").val() || $("#WlanSsid_text2").val() == $("#WlanSsid_text3").val() || $("#WlanSsid_text2").val() == $("#WlanSsid_text4").val()
	// 	|| $("#WlanSsid_text2").val() == $("#WlanSsid_text5").val() || $("#WlanSsid_text2").val() == $("#WlanSsid_text6").val() || $("#WlanSsid_text2").val() == $("#WlanSsid_text7").val()))
	// 	|| ($("#WlanSsid_text3").val() != "" && ($("#WlanSsid_text3").val() == gallData["ssid1"].SSID || $("#WlanSsid_text3").val() == $("#WlanSsid_text1").val() || $("#WlanSsid_text3").val() == $("#WlanSsid_text2").val() || $("#WlanSsid_text3").val() == $("#WlanSsid_text4").val()
	// 	|| $("#WlanSsid_text3").val() == $("#WlanSsid_text5").val() || $("#WlanSsid_text3").val() == $("#WlanSsid_text6").val() || $("#WlanSsid_text3").val() == $("#WlanSsid_text7").val()))
		// || ($("#WlanSsid_text4").val() != "" && ($("#WlanSsid_text4").val() == gallData["ssid1"].SSID || $("#WlanSsid_text4").val() == $("#WlanSsid_text1").val() || $("#WlanSsid_text4").val() == $("#WlanSsid_text2").val() || $("#WlanSsid_text4").val() == $("#WlanSsid_text3").val()
		// || $("#WlanSsid_text4").val() == $("#WlanSsid_text5").val() || $("#WlanSsid_text4").val() == $("#WlanSsid_text6").val() || $("#WlanSsid_text4").val() == $("#WlanSsid_text7").val()))
		// || ($("#WlanSsid_text5").val() != "" && ($("#WlanSsid_text5").val() == gallData["ssid1"].SSID || $("#WlanSsid_text5").val() == $("#WlanSsid_text1").val() || $("#WlanSsid_text5").val() == $("#WlanSsid_text2").val() || $("#WlanSsid_text5").val() == $("#WlanSsid_text3").val()
		// || $("#WlanSsid_text5").val() == $("#WlanSsid_text4").val() || $("#WlanSsid_text5").val() == $("#WlanSsid_text6").val() || $("#WlanSsid_text5").val() == $("#WlanSsid_text7").val()))
		// || ($("#WlanSsid_text6").val() != "" && ($("#WlanSsid_text6").val() == gallData["ssid1"].SSID || $("#WlanSsid_text6").val() == $("#WlanSsid_text1").val() || $("#WlanSsid_text6").val() == $("#WlanSsid_text2").val() || $("#WlanSsid_text6").val() == $("#WlanSsid_text3").val()
		// || $("#WlanSsid_text6").val() == $("#WlanSsid_text4").val() || $("#WlanSsid_text6").val() == $("#WlanSsid_text5").val() || $("#WlanSsid_text6").val() == $("#WlanSsid_text7").val()))
		// || ($("#WlanSsid_text7").val() != "" && ($("#WlanSsid_text7").val() == gallData["ssid1"].SSID || $("#WlanSsid_text7").val() == $("#WlanSsid_text1").val() || $("#WlanSsid_text7").val() == $("#WlanSsid_text2").val() || $("#WlanSsid_text7").val() == $("#WlanSsid_text3").val()
		// || $("#WlanSsid_text7").val() == $("#WlanSsid_text4").val() || $("#WlanSsid_text7").val() == $("#WlanSsid_text5").val() || $("#WlanSsid_text7").val() == $("#WlanSsid_text6").val()))
	if (($("#WlanSsid_text1").val() != "" && ($("#WlanSsid_text1").val() == gallData["ssid1"].SSID || $("#WlanSsid_text1").val() == $("#WlanSsid_text2").val() || $("#WlanSsid_text1").val() == $("#WlanSsid_text3").val()))
		|| ($("#WlanSsid_text2").val() != "" && ($("#WlanSsid_text2").val() == gallData["ssid1"].SSID || $("#WlanSsid_text2").val() == $("#WlanSsid_text1").val() || $("#WlanSsid_text2").val() == $("#WlanSsid_text3").val()))
		|| ($("#WlanSsid_text3").val() != "" && ($("#WlanSsid_text3").val() == gallData["ssid1"].SSID || $("#WlanSsid_text3").val() == $("#WlanSsid_text1").val() || $("#WlanSsid_text3").val() == $("#WlanSsid_text2").val()))
	)
	{
		alert("ssidnotsameforsameband".i18n());
		return false;
	}
	
	//2.4G和5G只能有一对ssid相同；
	var samessidnum = 0;
	
	if ( gallData["ssid1"].SSID != "" && (gallData["ssid1"].SSID == gallData5g.ssid1 || gallData["ssid1"].SSID == gallData5g.ssid2 || gallData["ssid1"].SSID == gallData5g.ssid3 || gallData["ssid1"].SSID == gallData5g.ssid4))
	{
		samessidnum = samessidnum + 1;
	}
	
	if ( $("#WlanSsid_text1").val() != "" && ($("#WlanSsid_text1").val() == gallData5g.ssid1 || $("#WlanSsid_text1").val() == gallData5g.ssid2 || $("#WlanSsid_text1").val() == gallData5g.ssid3 || $("#WlanSsid_text1").val() == gallData5g.ssid4))
	{
		samessidnum = samessidnum + 1;
	}
	
	if ( samessidnum < 2 && $("#WlanSsid_text2").val() != "" && ($("#WlanSsid_text2").val() == gallData5g.ssid1 || $("#WlanSsid_text2").val() == gallData5g.ssid2 || $("#WlanSsid_text2").val() == gallData5g.ssid3 || $("#WlanSsid_text2").val() == gallData5g.ssid4))
	{
		samessidnum = samessidnum + 1;
	}
	
	if ( samessidnum < 2 && $("#WlanSsid_text3").val() != "" && ($("#WlanSsid_text3").val() == gallData5g.ssid1 || $("#WlanSsid_text3").val() == gallData5g.ssid2 || $("#WlanSsid_text3").val() == gallData5g.ssid3 || $("#WlanSsid_text3").val() == gallData5g.ssid4))
	{
		samessidnum = samessidnum + 1;
	}

	// if ( samessidnum < 2 && $("#WlanSsid_text4").val() != "" && ($("#WlanSsid_text4").val() == gallData5g.ssid1 || $("#WlanSsid_text4").val() == gallData5g.ssid2 || $("#WlanSsid_text4").val() == gallData5g.ssid3 || $("#WlanSsid_text4").val() == gallData5g.ssid4 || $("#WlanSsid_text4").val() == gallData5g.ssid5
	// 	|| $("#WlanSsid_text4").val() == gallData5g.ssid6 || $("#WlanSsid_text4").val() == gallData5g.ssid7 || $("#WlanSsid_text4").val() == gallData5g.ssid8))
	// {
	// 	samessidnum = samessidnum + 1;
	// }

	// if ( samessidnum < 2 && $("#WlanSsid_text5").val() != "" && ($("#WlanSsid_text5").val() == gallData5g.ssid1 || $("#WlanSsid_text5").val() == gallData5g.ssid2 || $("#WlanSsid_text5").val() == gallData5g.ssid3 || $("#WlanSsid_text5").val() == gallData5g.ssid4 || $("#WlanSsid_text5").val() == gallData5g.ssid5
	// 	|| $("#WlanSsid_text5").val() == gallData5g.ssid6 || $("#WlanSsid_text5").val() == gallData5g.ssid7 || $("#WlanSsid_text5").val() == gallData5g.ssid8))
	// {
	// 	samessidnum = samessidnum + 1;
	// }

	// if ( samessidnum < 2 && $("#WlanSsid_text6").val() != "" && ($("#WlanSsid_text6").val() == gallData5g.ssid1 || $("#WlanSsid_text6").val() == gallData5g.ssid2 || $("#WlanSsid_text6").val() == gallData5g.ssid3 || $("#WlanSsid_text6").val() == gallData5g.ssid4 || $("#WlanSsid_text6").val() == gallData5g.ssid5
	// 	|| $("#WlanSsid_text6").val() == gallData5g.ssid6 || $("#WlanSsid_text6").val() == gallData5g.ssid7 || $("#WlanSsid_text6").val() == gallData5g.ssid8))
	// {
	// 	samessidnum = samessidnum + 1;
	// }

	// if ( samessidnum < 2 && $("#WlanSsid_text7").val() != "" && ($("#WlanSsid_text7").val() == gallData5g.ssid1 || $("#WlanSsid_text7").val() == gallData5g.ssid2 || $("#WlanSsid_text7").val() == gallData5g.ssid3 || $("#WlanSsid_text7").val() == gallData5g.ssid4 || $("#WlanSsid_text7").val() == gallData5g.ssid5
	// 	|| $("#WlanSsid_text7").val() == gallData5g.ssid6 || $("#WlanSsid_text7").val() == gallData5g.ssid7 || $("#WlanSsid_text7").val() == gallData5g.ssid8))
	// {
	// 	samessidnum = samessidnum + 1;
	// }
	
	if (samessidnum >= 2)
	{
		alert("onesetssidsamefordiffband".i18n());
		return false;
	}
	
	if (special_char_check($("#WlanSsid_text1").val()) == true || special_char_check($("#WlanSsid_text2").val()) == true || special_char_check($("#WlanSsid_text3").val()) == true)
	{
		alert("specialcharcheck".i18n());
		return false;
	}

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
		XHR.post("setMutiSSID_2G", data, reloadSaveData);
	}
}

function reloadSaveData(data)
{
	if(data)
	{
		parseGetData(data);
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}

function buildData()
{
	var data = new Object();
	
	data.Enable1 = getCheckbox("WlanEnable_checkbox_ap1");
	data.SSID1 = $("#WlanSsid_text1").val();
	data.wlanMode1 = $("#wlcfg_wlgMode1").val();
	data.rate1 = $("#wlcfg_wlRate1").val();
	data.ssidHide1 = $("#wlcfg_hide_ssid1").val();
	data.guestnetwork1 = $("#wlcfg_guestnetwork1").val();
	
	data.Enable2 = getCheckbox("WlanEnable_checkbox_ap2");
	data.SSID2 = $("#WlanSsid_text2").val();
	data.wlanMode2 = $("#wlcfg_wlgMode2").val();
	data.rate2 = $("#wlcfg_wlRate2").val();
	data.ssidHide2 = $("#wlcfg_hide_ssid2").val();
	data.guestnetwork2 = $("#wlcfg_guestnetwork2").val();
	
	data.Enable3 = getCheckbox("WlanEnable_checkbox_ap3");
	data.SSID3 = $("#WlanSsid_text3").val();
	data.wlanMode3 = $("#wlcfg_wlgMode3").val();
	data.rate3 = $("#wlcfg_wlRate3").val();
	data.ssidHide3 = $("#wlcfg_hide_ssid3").val();
	data.guestnetwork3 = $("#wlcfg_guestnetwork3").val();
	
	 data.Enable4 = getCheckbox("WlanEnable_checkbox_ap4");
	data.SSID4 = $("#WlanSsid_text4").val();
	data.wlanMode4 = $("#wlcfg_wlgMode4").val();
	data.rate4 = $("#wlcfg_wlRate4").val();
	data.ssidHide4 = $("#wlcfg_hide_ssid4").val();
	data.guestnetwork4 = $("#wlcfg_guestnetwork4").val();
	
	data.Enable5 = getCheckbox("WlanEnable_checkbox_ap5");
	data.SSID5 = $("#WlanSsid_text5").val();
	data.wlanMode5 = $("#wlcfg_wlgMode5").val();
	data.rate5 = $("#wlcfg_wlRate5").val();
	data.ssidHide5 = $("#wlcfg_hide_ssid5").val();
	data.guestnetwork5 = $("#wlcfg_guestnetwork5").val();
	
	data.Enable6 = getCheckbox("WlanEnable_checkbox_ap6");
	data.SSID6 = $("#WlanSsid_text6").val();
	data.wlanMode6 = $("#wlcfg_wlgMode6").val();
	data.rate6 = $("#wlcfg_wlRate6").val();
	data.ssidHide6 = $("#wlcfg_hide_ssid6").val();
	data.guestnetwork6 = $("#wlcfg_guestnetwork6").val();
	
	data.Enable7 = getCheckbox("WlanEnable_checkbox_ap7");
	data.SSID7 = $("#WlanSsid_text7").val();
	data.wlanMode7 = $("#wlcfg_wlgMode7").val();
	data.rate7 = $("#wlcfg_wlRate7").val();
	data.ssidHide7 = $("#wlcfg_hide_ssid7").val(); 
	data.guestnetwork7 = $("#wlcfg_guestnetwork7").val();
	
	return data;
}







