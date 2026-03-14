var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/preconfig", initPage);
	}
	else
	{
		XHR.get("get_preconfig", null, initPage);
	}
});

var operatorArray = [
	["CT", "中国电信"],
	["CU", "中国联通"],
	["CM", "中国移动"],
	["Trunk", "其他"]
];

var provinceArray = [
	["trunk", "基线"],
	["hubei", "湖北"],
	["jiangsu", "江苏"],
	["anhui", "安徽"],
	["zhejiang", "浙江"],
	["shanghai", "上海"],
	["fujian", "福建"],
	["hainan", "海南"],
	["guangdong", "广东"],
	["guangxi", "广西"],
	["hunan", "湖南"],
	["gansu", "甘肃"],
	["jiangxi", "江西"],
	["qinghai", "青海"],
	["xinjiang", "新疆"],
	["chongqing", "重庆"],
	["beijing", "北京"],
	["tianjin", "天津"],
	["heilongjiang", "黑龙江"],
	["jilin", "吉林"],
	["liaoning", "辽宁"],
	["hebei", "河北"],
	["henan", "河南"],
	["shanxi", "山西"],
	["shandong", "山东"],
	["neimeng", "内蒙"],
	["ningxia", "宁夏"],
	["shan_xi", "陕西"],
	["sichuan", "四川"],
	["yunnan", "云南"],
	["guizhou", "贵州"],
	["xizang", "西藏"]
];

var provinceList = '';
function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( getdata )
	{
		if ( getdata.preconfig_list != undefined && getdata.preconfig_list != '' )
		{
			provinceList = getdata.preconfig_list.replace(/ {1,}/g, " ");
			provinceList = provinceList.replace(/\n/g, " ");
		}
		generateProvinceSelect();
		var currentOperator = '';
		var currentProvince = '';
		if ( getdata.area_code != undefined )
		{
			currentProvince = getdata.area_code;
		}
		if ( getdata.operators_code != undefined )
		{
			currentOperator = getdata.operators_code;
		}
		$("#current_province").html(getcurrentOperatorStr(currentOperator)+"&nbsp;&nbsp;"+getProvinceStr(currentProvince));
	}
}


function generateProvinceSelect()
{
	var dynamicHTML = '';
	var currentOperator = $("#operator").find("option:selected").val();
	var provinceListArray = provinceList.split(" ");
	for ( var i=0; i<provinceListArray.length; i++ )
	{
		if ( provinceListArray[i] != undefined && provinceListArray[i] != "" && provinceListArray[i].indexOf('_') > -1)
		{
			var nameAarry = provinceListArray[i].split("_");
			if(nameAarry[2] == currentOperator)
			{
				if ( nameAarry.length == 5 )
				{
					dynamicHTML += "<option value='" + nameAarry[nameAarry.length-2] + "'>" + getProvinceStr(provinceListArray[i]) + "</option>";
				}
				else if( nameAarry.length > 5 )
				{
					dynamicHTML += "<option value='" + nameAarry[nameAarry.length-3] + "_" + nameAarry[nameAarry.length-2] + "'>" + getProvinceStr(provinceListArray[i]) + "</option>";
				}
				else
				{
					dynamicHTML += "<option value='" + nameAarry[nameAarry.length-2]+ "'>" + getProvinceStr(provinceListArray[i]) + "</option>";
				}
			}
		}
	}
	
	$("#province").html(dynamicHTML);
	
}

function getcurrentOperatorStr(input)
{
	var returnstr = input; //if not found, use input string
	for ( var j=0; j<operatorArray.length; j++ )
	{
		if ( input == operatorArray[j][0] )
		{
			returnstr = operatorArray[j][1];
			break;
		}
	}
	
	return returnstr;
}

function getProvinceStr(input)
{
	var returnstr = input; //if not found, use input string
	for ( var j=0; j<provinceArray.length; j++ )
	{
		if ( input.toLowerCase().indexOf(provinceArray[j][0]) >= 0 )
		{
			returnstr = provinceArray[j][1];
			break;
		}
	}
	
	return returnstr;
}
function changeOperator()
{
	$("#province").html('');
	generateProvinceSelect();
}
function saveApply()
{
	if ( confirm("确定导入" + $("#province").find("option:selected").text() + "预配置？该操作会导致设备重启。") )
	{
		var postdata = new Object();
		postdata.operator = $("#operator").val();
		postdata.province = $("#province").val();
		
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		
		//填充内容
		$("#pop_window_title", parentObj).html("预配置导入提醒");
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("设备正在导入预配置，该过程持续2-3分钟<br/>请勿断电，请耐心等待");
		$("#pop_window_option", parentObj).hide();
		showOrHidePopWindowFromIframe("show");
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("set_preconfig", postdata, function(data){
			if ( data && data.success == 'true' )
			{	
				var postdata = new Object();
				XHR.get("get_operator", null, function(data){
					if ( data )
					{
						tokenstr = data.token;
					}
				});
				postdata.token = tokenstr;
				jumpToLoginPage(true);
				XHR.post("reboot", postdata, null);
			}
			else
			{
				showOrHidePopWindowFromIframe("hide");
				errorHandler();
			}
		});
	}
}

function errorHandler()
{
	alert("导入预配置失败，请重试");
}
