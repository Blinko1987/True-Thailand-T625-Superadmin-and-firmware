var tokenstr = "";
var channelListHTML = "<option value='0'>Auto</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option><option value='11'>11</option><option value='12'>12</option><option value='13'>13</option>";
var bandWidthListHtml = "<option value='0'>20MHz</option><option value='1'>40MHz</option><option value='2'>Auto</option>";
var IntervalListHtml = "<option value='0'>Short</option><option value='1'>Long</option>";
var TransmitListHtml = "<option value='1'>Standard</option><option value='2'>Medium</option><option value='3'>High</option>";
var TransmitListHtml_CU = "<option value='100'>100%</option><option value='75'>75%</option><option value='50'>50%</option><option value='25'>25%</option><option value='0'>0</option>";
var gData;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	showOrHideLoadingWindowFromIframe("show");

	generateHtml();
	initPage();
	customSwitchInit();
	customPasswordInit();
	
	$("#WlanCountry_select, #wlcfg_wlgMode, #WlanChannel_select, #WlanBandWidth_select, #secondaryChannel").bind("change", function(){
		displayControl();
	});
	
	displayControl();
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
}

function initPage()
{
	if(gDebug)
	{
		getDataByAjax("../fake/wlanAdvanced", fillData);
	}else{
		XHR.get("wlanAdvancedSettings", null, fillData);
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
		postDataByAjax("../fake/wlanAdvanced", postdata, initPage);
	}else{
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("setWlanAdvancedCfg", postdata, reloadSaveData);
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
		alert("submitwifiadvparasfail".i18n());
	}
}

function buildData()
{
	var data = new Object();
	data.wlanMode = $("select[name='data.wlanMode']").val();
	if ( $("#ofdmaenable_div").is(":visible") )
	{
		data.OFDMAEnable = getCheckbox("OFDMAEnable_checkbox_value");
	}
	//data.ssidHide = getCheckbox("WlanHide_checkbox");
	data.country = $("#WlanCountry_select").val();
	data.channel = $("select[name='data.channel']").val();
	if (data.channel == 0)
	{
		data.AutoChannelEnable = 1;
	}
	else
	{
		data.AutoChannelEnable = 0;
	}
	if ( $("#secondaryChannel").is(":visible") )
	{
		data.secondaryChannel = $("#secondaryChannel").val();
	}
	if ( $("select[name='data.channelWidth']").is(":visible") )
	{
		data.channelWidth = $("select[name='data.channelWidth']").val();
	}
	data.CSScanTime = $("#CSScanTime_text").val();
	data.wlanSgi = $("select[name='data.wlanSgi']").val();
	data.powerLevel = $("select[name='data.powerLevel']").val();
	data.AutoChannelScanEnable = getRadio("data.AutoChannelScanEnable");
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

function displayControl()
{
	if($("#wlcfg_wlgMode").val() == 'n,ax')
	{
		showItem("OFDMAEnable_checkbox_value");
	}
	else
	{
		hideItem("OFDMAEnable_checkbox_value");
	}

	var channel = $("#WlanChannel_select").val();
	$("#WlanChannel_select").html(channelListHTML);
	if ( $("#wlcfg_wlgMode").val().indexOf("n") >=0 )
	{
		$(".mode_n").show();
		
		if ( $("#WlanBandWidth_select").val() == 1 || $("#WlanBandWidth_select").val() == 2 )
		{
			showItem("secondaryChannel");
			
			/*var showValueArray;
			if ( $("#secondaryChannel").val() == "upper" )
			{
				showValueArray = new Array(0,5,6,7,8,9,10,11);
			}
			else
			{
				showValueArray = new Array(0,1,2,3,4,5,6,7);
			}
			handleChannel(showValueArray);*/
		}
		else
		{
			hideItem("secondaryChannel");
		}
	}
	else
	{
		$(".mode_n").hide();
	}
	
	var showValueArray;
	if ( $("#WlanCountry_select").val() == "US" )
	{
		showValueArray = new Array(0,1,2,3,4,5,6,7,8,9,10,11);
	}
	else
	{
		showValueArray = new Array(0,1,2,3,4,5,6,7,8,9,10,11,12,13);
	}
	handleChannel(showValueArray);
	
	$("#WlanChannel_select").val(channel);
	
	if ($("#wlcfg_wlgMode").val() == "n,ax")
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