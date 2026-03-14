var tokenstr = "";
var channelListHTML = "<option value='0'>自动</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option><option value='11'>11</option><option value='12'>12</option><option value='13'>13</option>";
var gIndex = 1;
var gData;
var ssidNum = 1;
var ssidIndexArray = new Array();
var wlanCountryArray = [
	["CN", 	"China"],
	["ET", 	"European Union"],
	["ES", 	"Spain"],
	["JP", 	"Japan"],
	["US", 	"United States"]
];

var wlanModeArray = [
	["b", 		"802.11b"],
	["g", 		"802.11g"],
	["b,g", 	"802.11bg Mixed"],
	["n", 		"802.11n"],
	["n,g", 	"802.11gn Mixed"],
	["b,g,n", 	"802.11bgn Mixed"],
	["n,ax", 	"802.11bgn/ax Mixed"]
];
	
var wlanChannelArray = [
	["0", "Auto"]
];	


var wlanRateArray = [
	["0", "Auto"],
	["1", "1 Mbps"],
	["2", "2 Mbps"],
	["3", "5.5 Mbps"],
	["4", "6 Mbps"],
	["5", "9 Mbps"],
	["6", "11 Mbps"],
	["7", "12 Mbps"],
	["8", "18 Mbps"],
	["9", "24 Mbps"],
	["10", "36 Mbps"],
	["11", "48 Mbps"],
	["12", "54 Mbps"]
];

var wlan802RateArray = [
	["77", "Auto"]
];

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");

	showOrHideLoadingWindowFromIframe("show");
	customSwitchInit();
	customPasswordInit();
	//validate and submit
	generatHtml();
	initPage();
	initValidate();

	$("#wlcfg_ssid").bind("change", function(){
		gIndex = $(this).val();

		if((gIndex == '1') || (gIndex == '0')){
			changeDisAbledByIndex(gIndex, "delete");
			if(gIndex == '0'){
				addApply();
			}else if(gIndex == '1'){
				changeDisAbledByIndex(gIndex, "delete");
				fillWlanFormByIndex(gIndex, gData);
			}
		}else{
			changeDisAbledByIndex(gIndex, "delete");
			fillWlanFormByIndex(gIndex, gData);
		}
	});

	// $("input[type!='button'], select").change(function(){
		// checkShowHideElement();
	// });
	$("#wlcfg_domain, #wlcfg_wlgMode, #wlcfg_channelwidth, #secondaryChannel").bind("change", function(){
		checkShowHideElement();
	});
});

function changeDisAbledByIndex(index, elementId)
{
	if((index == '1') || (index == '0')){
		$("#"+elementId).attr("disabled", "disabled");
	}else{
		$("#"+elementId).attr("disabled", false);
	}
}

function initPage()
{
	if(gDebug)
	{
		getDataByAjax("../fake/wlanBasicSettingsAll", fillData);
	}else{
		XHR.get("wlanBasicSettingsAll", null, fillData);
	}
}

function saveApply()
{
	if( ! $("#wlan_basic_settings").valid())
	{
		ptweblog("validate wlanBasicSettings_5G error.");
		return false;
	}
	else
	{
		var data = buildData();
		
		if (data.Enable == "1")
		{
			data.ConfigActive = "1";
		}
		else
		{
			data.ConfigActive = "0";
		}
		
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
			XHR.post("setWlanBasicCfgAll", data, reloadData);
		}
	}
}

function addApply()
{
	showOrHideLoadingWindowFromIframe("show");
	var data = new Object();
	data.action = "add";
	data.index = getPostIndex(ssidIndexArray);
	gIndex = data.index;
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
		XHR.post("setWlanBasicCfgAll", data, reloadData);
	}
}

function deleteApply()
{
	showOrHideLoadingWindowFromIframe("show");
	var data = new Object();
	data.action = "delete";
	data.index = gIndex;

	if(gDebug)
	{
		postDataByAjax("../fake/post", JSON.stringify(data));
		gIndex = 1;
	}else{
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		data.token = tokenstr;
		XHR.post("setWlanBasicCfgAll", data, reloadData);
		gIndex = 1;
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
		alert("提交wifi基础设置参数失败！");
	}
}

function initValidate()
{
	$("#wlan_basic_settings").validate({
		rules: {
			"data.SSID": {required: true, maxlength:32}
	    },
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
					  "data.SSID": { required: ssidRequiredHint, maxlength:maxLength32}
				  },
		  submitHandler: function(form){//校验成功回调
		  	ptweblog("validate wifi basic settings ok.....");
		  },
		  invalidHandler: function(form, validator) {  //校验失败回调
	   		ptweblog("validate wifi basic settings failed.....");
	   		return false;
	   	  }
	}); 
}

function generatHtml()
{
	generateSelect("wlcfg_domain", wlanCountryArray);
	generateSelect("wlcfg_wlgMode", wlanModeArray);

	$("#wlcfg_wlChannel").html(channelListHTML);
	generateSelect("wlcfg_wlRate", wlanRateArray);
	
	for(var i = 0; i <= 15; i++)
	{
		var singleArray = new Array();
		singleArray.push(""+i+"");
		singleArray.push("MCS"+i+"");
		wlan802RateArray.push(singleArray);
	}
	generateSelect("wlcfg_802rate", wlan802RateArray);
}

function generateSelect(selectId, optionArray)
{
	for(var i = 0; i < optionArray.length; i++)
	{
		$("#" + selectId).append("<option value='"+ optionArray[i][0] +"'>"+ optionArray[i][1] + "</option>");
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
		alert("get wlanBasicSettings failed!");
		return;
	}
	gData = data;
	ssidNum = checkSSIDNumber(data, ssidIndexArray);
	generateIndexSelect(ssidIndexArray, ssidNum);

	fillWlanFormByIndex(gIndex, data);
	checkShowHideElement();
}

function generateIndexSelect(ssidNumArray, ssidNumber)
{
	var i = 1;
	//先清空所有的ssid
	$("#wlcfg_ssid").html("");
	var number = ssidNumArray.length;
	for(; i <= number; i++)
	{
		if(ssidNumArray[i-1] != '0'){
			$("#wlcfg_ssid").append("<option value='" + i + "'>" + "ssid" + i + "</option>");
		}
	}
	$("#wlcfg_ssid").append("<option value='0'>增加</option>");
	if(ssidNumber >= 4){
		$("#wlcfg_ssid").find("option:[value='0']").remove();
	}
	$("#wlcfg_ssid").val(gIndex);
}

function checkSSIDNumber(data, array)
{
	array.splice(0, array.length);
	if((data == undefined) || (data == "")){
		return 0;
	}
	var number = 0;
	for(var i = 1; i <= 4; i++)
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

function fillWlanFormByIndex(index, data)
{
	$("#wlcfg_domain").val(data.country);
	index = ((index == '0') ? '1' : index);
	if((data["ssid"+index] == "") || (data["ssid"+index] == undefined)){
		index = 1;
		gIndex = 1;
	}
	changeDisAbledByIndex(index, "delete");

	var dataObj = data["ssid"+index];
	$("#wlan_basic_settings").fill(dataObj);
	setSwitchValue("wlcfg_WMMEnable_checkbox", dataObj.wmmEnable);
	setSwitchValue("wlcfg_APSDEnable_checkbox", dataObj.wmmAPSD);
	setSwitchValue("wlcfg_sgi", dataObj.sgiEnable);
	setSwitchValue("wlcfg_open", dataObj.Enable);
	setSwitchValue("wlcfg_hidden", dataObj.ssidHide);
	setCheckbox("OFDMAEnable_checkbox_value", dataObj.OFDMAEnable);
}

function checkShowHideElement()
{
	var wlanMode = $("#wlcfg_wlgMode").val();
	if( wlanMode.indexOf("n") != -1 )
	{
		$("#wlcfg_wlRate").attr("disabled",true);
		$("#wlcfg_wlRate").val(wlanRateArray[0][0]);
		$("#block_80211n").css("display", "");
	}else{
		$("#block_80211n").css("display", "none");
		$("#wlcfg_wlRate").attr("disabled", false);
		if(wlanMode == "b")
		{
			var wlanRate = 0;
			$("#wlcfg_wlRate option").each(function(){
				wlanRate = parseInt($(this).val());
				if((7 <= wlanRate) && (12 >= wlanRate)){
					$(this).css("display", "none");
				}
			});
		}else
		{
			$("#wlcfg_wlRate option").each(function(){
				$(this).css("display", "");
			});
		}
	}
	
	if($("#wlcfg_wlgMode").val() == 'n,ax')
	{
		showItem("OFDMAEnable_checkbox_value");
	}
	else
	{
		hideItem("OFDMAEnable_checkbox_value");
	}
	
	var channel = $("#wlcfg_wlChannel").val();
	
	$("#wlcfg_wlChannel").html(channelListHTML);
	
	if ( $("#block_80211n").is(":visible") )
	{
		if ( $("#wlcfg_channelwidth").val() == 1 || $("#wlcfg_channelwidth").val() == 2)
		{
			showItem("secondaryChannel");
			/*
			var showValueArray;
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
	
	if($("#wlcfg_domain").val() == "ET" || $("#wlcfg_domain").val() == "CN")
	{
		var showValueArray;
		showValueArray = new Array(0,1,2,3,4,5,6,7,8,9,10,11,12,13);
		handleChannel(showValueArray);
	}
	else
	{
		var showValueArray;
		showValueArray = new Array(0,1,2,3,4,5,6,7,8,9,10,11);
		handleChannel(showValueArray);
	}
	
	$("#wlcfg_wlChannel").val(channel);
}

function handleChannel(showValueArray)
{
	$("#wlcfg_wlChannel option").each(function(){
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
			$("#wlcfg_wlChannel option[value='" + singlevalue + "']").remove();
		}
	});
}

function buildData()
{
	var data = new Object();
	if($("#wlcfg_ssid").val() != '0'){
		data.action = "modify";
		data.index = gIndex;
	}

	$("input,select").each(function(){
	if($(this).attr("name") && ( $(this).parent().is(":visible")))
		{
			var param = $(this).attr("name").substring("data.".length);
			data[param] = $(this).val();
		}
		
	});
	
	if ( $("#ofdmaenable_div").is(":visible") )
	{
		data.OFDMAEnable = getCheckbox("OFDMAEnable_checkbox_value");
	}
	return data;
}


function getPostIndex(ssidArray)
{
	var i = 0;
	var ssidArrayNum = ssidArray.length;
	for(; i < ssidArrayNum; i++)
	{
		if(ssidArray[i] == "0"){
			return i+1;
		}else{
			continue;
		}
	}
}

