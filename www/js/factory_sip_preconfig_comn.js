var tokenstr = "";
var data;
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	initValidate();

	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/factory_sip_preconfig", initPage);
	}
	else
	{
		XHR.get("get_factory_sip_preconfig", null, initPage);
	}
});

function initValidate()
{
	$("#voice_form").validate({
		debug: true,
		rules: {
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
	
	if ( getdata && getdata.voice )
	{
		data = getdata.voice;
		$("#RegisterExpires").val(data.RegisterExpires);
		$("#RegisterRetryInterval").val(data.RegisterRetryInterval);
		$("#RegPercent").val(data.RegPercent);
		$("#OffHookNoDailTimer").val(data.OffHookNoDailTimer);
		$("#InterDigitTimerStd").val(data.InterDigitTimerStd);
		$("#InterDigitTimerLong").val(data.InterDigitTimerLong);
		$("#RingNoAnswerTimer").val(data.RingNoAnswerTimer);
		$("#BusyToneTimer").val(data.BusyToneTimer);
		$("#HowlerToneTimer").val(data.HowlerToneTimer);
		$("#TestLinkFlag").val(data.TestLinkFlag);
		$("#TestLinkTime").val(parseInt(data.TestLinkTime)*1000);
		$("#DigitMapType").val(data.DigitMapType);
		$("#UseLongInterDigitTimer").val(data.UseLongInterDigitTimer);
		$("#MinimumNumberOfDigits").val(data.MinimumNumberOfDigits);
		$("#MaximumNumberOfDigits").val(data.MaximumNumberOfDigits);
		$("#CountryRegion").val(data.CountryRegion);
		$("#PolarityReversalMode").val(data.PolarityReversalMode);
		$("#transferSharp").val(data.transferSharp);
		$("#ThreePartyInIMS").val(data.ThreePartyInIMS);
		$("#bEnableThreeConfToTwo").val(data.bEnableThreeConfToTwo);
		$("#NotPraseExplicitCallTransfer").val(data.NotPraseExplicitCallTransfer);
		$("#PANInfo").val(data.PANInfo);
		$("#EnableUserPhone").val(data.EnableUserPhone);
		$("#LocalRuleType").val(data.LocalRuleType);
		$("#UseURIIndependent").val(data.UseURIIndependent);
		for ( var index=1; index <= data.voice_port; index++ )
		{
			$("#hotlineuri" + index).val(eval("data.hotlineuri" + index));
			$("#conferenceuri" + index).val(eval("data.conferenceuri" + index));
			$(".line" + index).show();
		}
	}
	
}

function saveApply()
{
	if( ! $("#voice_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	postdata.RegisterExpires = $("#RegisterExpires").val();
	postdata.RegisterRetryInterval = $("#RegisterRetryInterval").val();
	postdata.RegPercent = $("#RegPercent").val();
	postdata.OffHookNoDailTimer = $("#OffHookNoDailTimer").val();
	postdata.InterDigitTimerStd = $("#InterDigitTimerStd").val();
	postdata.InterDigitTimerLong = $("#InterDigitTimerLong").val();
	postdata.RingNoAnswerTimer = $("#RingNoAnswerTimer").val();
	postdata.BusyToneTimer = $("#BusyToneTimer").val();
	postdata.HowlerToneTimer = $("#HowlerToneTimer").val();
	postdata.TestLinkFlag = $("#TestLinkFlag").val();
	postdata.TestLinkTime = parseInt($("#TestLinkTime").val()/1000);
	postdata.DigitMapType = $("#DigitMapType").val();
	postdata.UseLongInterDigitTimer = $("#UseLongInterDigitTimer").val();
	postdata.MinimumNumberOfDigits = $("#MinimumNumberOfDigits").val();
	postdata.MaximumNumberOfDigits = $("#MaximumNumberOfDigits").val();
	postdata.CountryRegion = $("#CountryRegion").val();
	postdata.PolarityReversalMode = $("#PolarityReversalMode").val();
	postdata.transferSharp = $("#transferSharp").val();
	postdata.ThreePartyInIMS = $("#ThreePartyInIMS").val();
	postdata.bEnableThreeConfToTwo = $("#bEnableThreeConfToTwo").val();
	postdata.NotPraseExplicitCallTransfer = $("#NotPraseExplicitCallTransfer").val();
	postdata.PANInfo = $("#PANInfo").val();
	postdata.EnableUserPhone = $("#EnableUserPhone").val();
	postdata.LocalRuleType = $("#LocalRuleType").val();
	postdata.UseURIIndependent = $("#UseURIIndependent").val();
	for ( var index=1; index <= data.voice_port; index++ )
	{
		postdata["hotlineuri" + index] = $("#hotlineuri" + index).val();
		postdata["conferenceuri" + index] = $("#conferenceuri" + index).val();
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_factory_sip_preconfig", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

