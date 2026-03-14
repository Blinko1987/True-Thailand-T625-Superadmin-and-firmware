var tokenstr = "";
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
	 ["a", 		"802.11a only"],
	 ["a,n", 	"802.11a/n Mixed"],
	 ["ac", 	"802.11 ac only"],
	 ["n,ac", 	"802.11n/ac mixed"],
	 ["11ac",  "802.11a/n/ac Mixed"],
	 ["11ax",  "802.11a/n/ac/ax Mixed"]
];
	
var wlanChannelArray = [
	["0", "Auto"],
	["36", "36"],
	["40", "40"],
	["44", "44"],
	["48", "48"],
	["52", "52"],
	["56", "56"],
	["60", "60"],
	["64", "64"],
	["100", "100"],
	["104", "104"],
	["108", "108"],
	["112", "112"],
	["116", "116"],
	["120", "120"],
	["124", "124"],
	["128", "128"],
	["132", "132"],
	["136", "136"],
	["140", "140"],
	["144", "144"],
	["149", "149"],
	["153", "153"],
	["157", "157"],
	["161", "161"],
	["165", "165"]
];		


var wlanRateArray = [
	["0", "Auto"],
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


var channelWidthArray = [
	["0",		"20MHZ"],
	["1",		"40MHZ"],
	["2",	"20/40MHZ"],
	["3",		"80MHZ"],
	["5",		"160MHZ"],
	["6",		"Auto"]
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

	$("input[type!='button'], select").change(function(){
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
		getDataByAjax("../fake/wlanBasicSettingsAll_5G", fillData);
	}else{
		XHR.get("wlanBasicSettingsAll_5G", null, fillData);
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
			XHR.post("setWlanBasicCfgAll_5G", data, reloadData);
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
		XHR.post("setWlanBasicCfgAll_5G", data, reloadData);
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
		XHR.post("setWlanBasicCfgAll_5G", data, reloadData);
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
	generateSelect("wlcfg_channelwidth", channelWidthArray);
	generateSelect("wlcfg_wlChannel", wlanChannelArray);
	generateSelect("wlcfg_wlRate", wlanRateArray);
	
	for(var i = 0; i <= 8; i++)
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
	index = (index == '0' ? '1' : index);
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
	
	//DFSArgs
	if (dataObj.DFSArgs)
	{
		var dfsargsarr = dataObj.DFSArgs.split("");
		
		for (var i=1; i<=8; i++)
		{
			$("#DFSArgs_select" + i).val(dfsargsarr[i-1]);
		}
	}
}



function checkShowHideElement(elementId)
{
	var wlanMode = $("#wlcfg_wlgMode").val();
	
	if ( wlanMode == "11ac" || wlanMode == "11ax") //11ac单独处理，显示频宽但不显示80211n速率
	{
		$("#block_80211n").show();
		hideItem("wlcfg_802rate");
	}
	else
	{
		showItem("wlcfg_802rate");
		if( wlanMode.indexOf("n") < 0 )
		{
			$("#block_80211n").hide();
		}
		else
		{
			$("#block_80211n").show();
		}
	}
	
	if(wlanMode == '11ax')
	{
		showItem("OFDMAEnable_checkbox_value");
	}
	else
	{
		hideItem("OFDMAEnable_checkbox_value");
	}
	
	var bandWidth = $("#wlcfg_channelwidth").val();
	$("#wlcfg_channelwidth").html('');
	generateSelect("wlcfg_channelwidth", channelWidthArray);
	if ( wlanMode.indexOf('ac') < 0 && wlanMode.indexOf('11ax') < 0) //只有ac模式可选80M频宽
	{
		$("#wlcfg_channelwidth option[value='3']").remove();
		$("#wlcfg_channelwidth option[value='5']").remove();
	}
	$("#wlcfg_channelwidth").val(bandWidth);
	// console.log(bandWidth);
	
	//处理信道
	var channel = $("#wlcfg_wlChannel").val();
	$("#wlcfg_wlChannel").html('');
	generateSelect("wlcfg_wlChannel", wlanChannelArray);
	
	var showValueArray;
	
	if ( $("#wlcfg_channelwidth").val() == '5' )
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
		$("#dfsargs").hide();
		showValueArray = new Array(0,36,40,44,48,149,153,157,161);
	}
	else
	{
		$("#dfsargs").show();
		if ( $("#wlcfg_channelwidth").is(":visible") )
		{
			if ( $("#wlcfg_channelwidth").val() == '0' )
			{
				showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165);
			}
			else if ( $("#wlcfg_channelwidth").val() == '3' )
			{
				showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161);
			}
			else if ( $("#wlcfg_channelwidth").val() == '2' ||  $("#wlcfg_channelwidth").val() == '1' )
			{
				// console.log( "secondaryChannel " + $("#secondaryChannel").val() );
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
			else if ( $("#wlcfg_channelwidth").val() == '5' )
			{
				showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128);
			}
			else if ( $("#wlcfg_channelwidth").val() == '6' )
			{
				showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165);
			}
		}
		else
		{
			showValueArray = new Array(0,36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165);
		}
	}
	// console.log(showValueArray);
	handleChannel(showValueArray);
	// console.log(showValueArray);
	$("#wlcfg_wlChannel").val(channel);
	
	// 处理旁信道
	if ( $("#wlcfg_channelwidth").is(":visible") && $("#wlcfg_channelwidth").val().indexOf('40') >= 0 )
	{
		showItem("secondaryChannel");
	}
	else
	{
		hideItem("secondaryChannel");
	}
}

function buildData()
{
	var data = new Object();
	if($("#wlcfg_ssid").val() != '0'){
		data.action = "modify";
		data.index = gIndex;
	}

	$("input,select").each(function(){
		if($(this).attr("name"))
		{
			var param = $(this).attr("name").substring("data.".length);
			data[param] = $(this).val();
		}
		
	});
	
	if ( $("#ofdmaenable_div").is(":visible") )
	{
		data.OFDMAEnable = getCheckbox("OFDMAEnable_checkbox_value");
	}
	
	var dfsargsstr = "";
	for (var i=1; i<=8; i++)
	{
		dfsargsstr += $("#DFSArgs_select" + i).val();
	}
	
	data.DFSArgs = dfsargsstr;
	
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