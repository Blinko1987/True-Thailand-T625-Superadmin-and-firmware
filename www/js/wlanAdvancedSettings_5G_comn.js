var tokenstr = "";
var channelListHTML = "<option value='0'>Auto</option><option value='36'>36</option><option value='40'>40</option><option value='44'>44</option><option value='48'>48</option><option value='52'>52</option><option value='56'>56</option><option value='60'>60</option><option value='64'>64</option><option value='100'>100</option><option value='104'>104</option><option value='108'>108</option><option value='112'>112</option><option value='116'>116</option><option value='120'>120</option><option value='124'>124</option><option value='128'>128</option><option value='132'>132</option><option value='136'>136</option><option value='140'>140</option><option value='144'>144</option><option value='149'>149</option><option value='153'>153</option><option value='157'>157</option><option value='161'>161</option><option value='165'>165</option>";
var bandWidthListHtml = "<option value='0'>20MHz</option><option value='1'>40MHz</option><option value='2'>20MHz/40MHz</option><option value='3'>80MHz</option><option value='5'>160MHz</option><option value='6'>Auto</option>";
var IntervalListHtml = "<option value='0'>Short</option><option value='1'>Long</option>";
var TransmitListHtml = "<option value='1'>Standard</option><option value='2'>Medium</option><option value='3'>High</option>";
var TransmitListHtml_CU = "<option value='100'>100%</option><option value='75'>75%</option><option value='50'>50%</option><option value='25'>25%</option><option value='0'>0</option>";
// var wlanModeListHtml = "<option value='a'>802.11a</option><option value='n'>802.11n</option><option value='11ac'>802.11ac</option><option value='a,n'>802.11a/n</option><option value='a,n,ac'>802.11a/n/ac</option>";
//var wlanModeListHtml = "<option value='11ac'>802.11ac</option>";
var wlanModeListHtml = "<option value='a'>802.11a only</option><option value='a,n'>802.11a/n Mixed</option><option value='ac'>802.11 ac only</option><option value='n,ac'>802.11n/ac mixed</option><option value='11ac'>802.11a/n/ac Mixed</option><option value='11ax'>802.11a/n/ac/ax Mixed</option>";

var gData;
var gchannelWidth = "3";
var geasymeshenable = "1";
var geasymeshbackhaul = "5G";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	showOrHideLoadingWindowFromIframe("show");

	generateHtml();
	
	/* $("#BandSteering_checkbox").bind("click", function(){
		thresholdshoworhide();
	}); */
	
	XHR.get("get_easymesh_settings", null, function(data){
		if ( data.token != undefined )
		{
			tokenstr = data.token;
		}
	
		if ( data.Enable != undefined )
		{
			geasymeshenable = data.Enable;
		}
		
		if ( data.BackHaul != undefined )
		{
			geasymeshbackhaul = data.BackHaul;
		}
	});
	
	initPage();
	customSwitchInit();
	customPasswordInit();

	$("input[type!='button'], select").change(function(){
		var inputid = $(this).attr("id");
		if (inputid == "WlanBandWidth_select")
		{
			gchannelWidth = $("#WlanBandWidth_select").val();
		}
		checkShowHideElement();
	});
});

function generateHtml()
{
	$("#WlanChannel_select").html(channelListHTML);
	$("#WlanBandWidth_select").html(bandWidthListHtml);
	$("#WlanInterval_select").html(IntervalListHtml);
	if ( getOperator() == "CU" )
	{
		$("#WlanTransmit_select").html(TransmitListHtml_CU);
	}
	else
	{
		$("#WlanTransmit_select").html(TransmitListHtml);
	}
	$("#wlcfg_wlgMode").html(wlanModeListHtml);
}

function initPage()
{
	if(gDebug)
	{
		getDataByAjax("../fake/wlanAdvanced5G", fillData);
	}else{
		XHR.get("wlanAdvancedSettings_5G", null, fillData);
	}
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
		$("#wlanAdv_settings_form").fill(data.data);
		
		// setRadio("data.AutoChannelScanEnable","data.data.AutoChannelScanEnable");

		if(data.data.AutoChannelScanEnable == "1"){
			$("#AutoChannelScanEnable_select_1").prop("checked","checked");
			$("#CSScanTime_div").show();
		}else{
			$("#AutoChannelScanEnable_select_0").prop("checked","checked");
			$("#CSScanTime_div").hide();
		}
		/* if(data.data.bandsteering == "1")
		{
			setCheckbox("BandSteering_checkbox", "1");
		}
		else
		{
			setCheckbox("BandSteering_checkbox", "0");
		}
		$("#rssithreshold_2g").val(data.data.threshold2g);
		$("#rssithreshold_5g").val(data.data.threshold5g); */
		
		setRadio("data.RadarDetect","data.data.RadarDetect");
		
		/* if(data.data.samessid == "1")
		{
			setCheckbox("smartconnect_checkbox", "1");
		}
		else
		{
			setCheckbox("smartconnect_checkbox", "0");
		} */
		
		setCheckbox("WlanMUMIMO_checkbox", data.data.mufeature);
		//setCheckbox("WlanHide_checkbox", data.data.ssidHide);
		setCheckbox("OFDMAEnable_checkbox_value", data.data.OFDMAEnable);
		if (data.data.AutoChannelEnable == "1")
		{
			$("#WlanChannel_select").val("0");
			$("#currentchannel").text(data.data.channel);
		}
		else
		{
			$("#WlanChannel_select").val(data.data.channel);
			$("#currentchannel").text(data.data.channel);
		}
		gchannelWidth = data.data.channelWidth;
		checkShowHideElement();
		//thresholdshoworhide();
	}else{
		alert("get wlanAdvancedSettings failed!");
	}
}


function saveApply()
{
	var ChannelScanTime = $("#CSScanTime_text").val();
	if ( ! isValidNumberRange(ChannelScanTime, 300, 86400) )
	{
		alert("channelscantimeinvalid".i18n());
		return;
	}

	var postdata = buildData();
	showOrHideLoadingWindowFromIframe("show");
	if(gDebug){
		postDataByAjax("../fake/wlanAdvanced_5G", data, options)
	}else{
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("setWlanAdvancedCfg_5G", postdata, reloadSaveData);
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
		alert("submit5gwifiadvparasfail".i18n());
	}
}

function buildData()
{
	var data = new Object();
	//data.bandsteering = getCheckbox("BandSteering_checkbox");
	//data.threshold2g = $("#rssithreshold_2g").val();
	//data.threshold5g = $("#rssithreshold_5g").val();
	//data.samessid = getCheckbox("smartconnect_checkbox");
	data.mufeature = getCheckbox("WlanMUMIMO_checkbox");
	//data.ssidHide = getCheckbox("WlanHide_checkbox");
	data.wlanMode = $("select[name='data.wlanMode']").val();
	if ( $("#ofdmaenable_div").is(":visible") )
	{
		data.OFDMAEnable = getCheckbox("OFDMAEnable_checkbox_value");
	}
	data.channel = $("select[name='data.channel']").val();
	if (data.channel == 0)
	{
		data.AutoChannelEnable = 1;
	}
	else
	{
		data.AutoChannelEnable = 0;
	}
	data.channelWidth = $("select[name='data.channelWidth']").val();
	data.CSScanTime = $("#CSScanTime_text").val();
	data.wlanSgi = $("select[name='data.wlanSgi']").val();
	data.powerLevel = $("select[name='data.powerLevel']").val();
	data.DFSEnable = $("select[name='data.DFSEnable']").val();
	data.RadarDetect = getRadio("data.RadarDetect");
	data.AutoChannelScanEnable = getRadio("data.AutoChannelScanEnable");
	if ( $("#secondaryChannel").is(":visible") )
	{
		data.secondaryChannel = $("select[name='data.secondaryChannel']").val();
	}
	data.Enable = gData.Enable;
	return data;
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

function checkShowHideElement()
{
	var wlanMode = $("#wlcfg_wlgMode").val();
	if(wlanMode == 'a')
	{
		hideItem("WlanBandWidth_select");
	}
	else
	{
		showItem("WlanBandWidth_select");
	}
	
	if(wlanMode == '11ax')
	{
		showItem("OFDMAEnable_checkbox_value");
	}
	else
	{
		hideItem("OFDMAEnable_checkbox_value");
	}
	
	var bandWidth = $("#WlanBandWidth_select").val();
	$("#WlanBandWidth_select").html(bandWidthListHtml);
	if ( wlanMode.indexOf('ac') < 0 && wlanMode.indexOf('11ax') < 0 ) //只有ac模式可选80M频宽
	{
		$("#WlanBandWidth_select option[value='3']").remove();
		$("#WlanBandWidth_select option[value='5']").remove();
		$("#WlanBandWidth_select").val(bandWidth);
	}
	else
	{
		$("#WlanBandWidth_select").val(gchannelWidth);
	}
	
	//处理信道
	var channel = $("#WlanChannel_select").val();
	$("#WlanChannel_select").html(channelListHTML);
	
	var showValueArray;
	
	if ( $("#WlanBandWidth_select").val() == '5' || $("#WlanBandWidth_select").val() == '6')
	{
		$("#DFS_select").val("1");
		$("#DFS_select").attr("disabled", true);
	}
	else
	{
		$("#DFS_select").attr("disabled", false);
	}
	
	if ( $("#DFS_select").val() != "1" )//Without DFS
	{
		showValueArray = new Array(0,36,40,44,48,149,153,157,161);
	}
	else
	{
		if ( $("#WlanBandWidth_select").is(":visible") )
		{
			if ( $("#WlanBandWidth_select").val() == '0' )
			{
				showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165);
			}
			else if ( $("#WlanBandWidth_select").val() == '3' )
			{
				showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161);
			}
			else if ( $("#WlanBandWidth_select").val() == '2' ||  $("#WlanBandWidth_select").val() == '1' )
			{
				/*if ( $("#secondaryChannel").val() == "upper" )
				{
					showValueArray = new Array(0,40,48,56,64,104,112,120,128,136,144,153,161);
				}
				else
				{
					showValueArray = new Array(0,36,44,52,60,100,108,116,124,132,140,149,157);
				}*/
				showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165);
			}
			else if ( $("#WlanBandWidth_select").val() == '5' )
			{
				showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128);
			}
			else if ( $("#WlanBandWidth_select").val() == '6' )
			{
				showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165);
			}
		}
		else
		{
			showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165);
		}
	}
	
	handleChannel(showValueArray);
	$("#WlanChannel_select").val(channel);
	
	if (geasymeshenable == "1")
	{
		if (geasymeshbackhaul == "5GL")
		{
			$("#WlanChannel_select option").each(function(){
				if ( $(this).val() >= 100 )
				{
					$(this).remove();
				}
			});
		}
		else if (geasymeshbackhaul == "5GH")
		{
			$("#WlanChannel_select option").each(function(){
				if ( $(this).val() < 100 && $(this).val() != 0)
				{
					$(this).remove();
				}
			});
		}
	}
	
	// 处理旁信道
	if ( $("#WlanBandWidth_select").is(":visible") && ($("#WlanBandWidth_select").val() == '1' || $("#WlanBandWidth_select").val() == '2') )
	{
		showItem("secondaryChannel");
	}
	else
	{
		hideItem("secondaryChannel");
	}
	
	if ($("#wlcfg_wlgMode").val() == "11ax")
	{
		document.getElementById("wlanmodehint").style.display = "block";
	}
	else
	{
		document.getElementById("wlanmodehint").style.display = "none";
	}
	
	if ($("#WlanChannel_select").val() != "0")
	{
		document.getElementById("channelhint").style.display = "";
	}
	else
	{
		document.getElementById("channelhint").style.display = "none";
	}
	
	if ($("#WlanBandWidth_select").val() != "6")
	{
		document.getElementById("bandwidthhint").style.display = "";
	}
	else
	{
		document.getElementById("bandwidthhint").style.display = "none";
	}
	
}

function handleChannel(showValueArray)
{
	$("#WlanChannel_select option").each(function(){
		var singlevalue = $(this).val();
		var found = false;
		for ( var i=0; i<showValueArray.length; i++ )
		{
			if ( singlevalue == showValueArray[i] )
			{
				found = true;
			}
		}
		if ( ! found )
		{
			$("#WlanChannel_select option[value='" + singlevalue + "']").remove();
		}
	});
}

function CSScanTime(num){
	if(num == 1){
		$("#CSScanTime_div").show();
	}else{
		$("#CSScanTime_div").hide();
	}
}

/* function thresholdshoworhide()
{
	if (getCheckbox("BandSteering_checkbox"))
	{
		$("#rssithreshold_div").show();
	}
	else
	{
		$("#rssithreshold_div").hide();
	}
} */




