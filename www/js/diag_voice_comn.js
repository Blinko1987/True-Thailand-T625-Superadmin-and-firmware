var tokenstr = "";
var voip_wan_exist = 0;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	XHR.get("get_allwan_name", null, function(data){
		if ( data.token != undefined )
		{
			tokenstr = data.token;
		}
		showOrHideLoadingWindowFromIframe("hide");
		if ( data && data.wan )
		{
			for (var i=0; i< data.wan.length; i++ )
			{
				var singlename = data.wan[i].Name.toUpperCase();
				if ( singlename.indexOf("VOIP") >= 0 || singlename.indexOf("VOICE") >= 0 )
				{
					voip_wan_exist = 1;
					break;
				}
			}
		}
	});
});

function  initPage(data)
{	
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	showOrHideLoadingWindowFromIframe("hide");

	if (data && data.DIAGPING)
	{
		var dynamicResultHTML = '';
		var dynamicConResultHTML = '';
	
		if (data.DIAGPING.voice_Conresult == "0")
		{
			document.getElementById('resultDiv3').style.display = 'none';
			document.getElementById('resultDiv4').style.display = 'none';
			
			if (data.DIAGPING.voice_result == "0")
			{
				document.getElementById('resultDiv1').style.display = 'none';
				document.getElementById('resultDiv2').style.display = 'none';
			}	
			else if (data.DIAGPING.voice_result == "1" && voip_wan_exist == 1)
			{	
				document.getElementById('resultDiv1').style.display = '';
				document.getElementById('resultDiv2').style.display = 'none';
				dynamicResultHTML = "diagnosingwait".i18n();
				$("#Ping_result_iframe").html(dynamicResultHTML);
				if ( gDebug ) //调试模式读取本地数据
				{
					setTimeout(function(){getDataByAjax("../fake/diag_voice_info", initPage);},2000);
				}
				else
				{
					setTimeout(function(){XHR.get("get_diag_voice_info", null, initPage);},2000);
				}
			}
			else if (data.DIAGPING.voice_result == "1" && voip_wan_exist != 1)
			{	
				document.getElementById('resultDiv1').style.display = '';
				document.getElementById('resultDiv2').style.display = 'none';
				dynamicResultHTML = "novoicewan".i18n();
				$("#Ping_result_iframe").html(dynamicResultHTML);
			}	
			else if (data.DIAGPING.voice_result == "2")
			{
				$("#voice_Voltage").val(data.DIAGPING.ABACVoltage+ "mV");
				$("#voice_Resistance").val(data.DIAGPING.ABInsulationResistance+ "Ohm");
		
				document.getElementById('resultDiv1').style.display = 'none';	
				document.getElementById('resultDiv2').style.display = '';
			}
		}
	
		if (data.DIAGPING.voice_RegStatus != "Online")
		{
			$("#voice_number").attr("disabled",true); 
			$("#voice_test").attr("disabled",true); 
			document.getElementById('resultDiv5').style.display = '';	
		}	
		else
		{
			$("#voice_number").attr("disabled",false); 
			$("#voice_test").attr("disabled",false); 
			document.getElementById('resultDiv5').style.display = 'none';	
			if (data.DIAGPING.voice_Conresult == "0")
			{
				document.getElementById('resultDiv3').style.display = 'none';
				document.getElementById('resultDiv4').style.display = 'none';
			}	
			else if (data.DIAGPING.voice_Conresult == "1")
			{
				if (data.DIAGPING.Status == "Idle")
				{
					document.getElementById('voice_result1').style.display = '';
					document.getElementById('voice_result2').style.display = 'none';
					document.getElementById('voice_result3').style.display = 'none';
					document.getElementById('voice_result4').style.display = 'none';
					document.getElementById('voice_result5').style.display = 'none';
					document.getElementById('voice_result6').style.display = 'none';
					document.getElementById('voice_result7').style.display = 'none';
					document.getElementById('voice_result8').style.display = 'none';
					document.getElementById('conclusion').style.display = 'none';
					document.getElementById('failreason').style.display = 'none';
					document.getElementById('resultDiv4').style.display = '';
					if ( gDebug ) //调试模式读取本地数据
					{
						setTimeout(function(){getDataByAjax("../fake/diag_voice_info", initPage);},2000);
					}
					else
					{
						setTimeout(function(){XHR.get("get_diag_voice_info", null, initPage);},2000);
					}
					//XHR.get("get_diag_voice_info", null, initPage);
				}
				else if (data.DIAGPING.Status == "Off-hook")
				{
					document.getElementById('voice_result1').style.display = '';
					document.getElementById('voice_result2').style.display = '';
					document.getElementById('voice_result3').style.display = 'none';
					document.getElementById('voice_result4').style.display = 'none';
					document.getElementById('voice_result5').style.display = 'none';
					document.getElementById('voice_result6').style.display = 'none';
					document.getElementById('voice_result7').style.display = 'none';
					document.getElementById('voice_result8').style.display = 'none';
					document.getElementById('conclusion').style.display = 'none';
					document.getElementById('failreason').style.display = 'none';
					document.getElementById('resultDiv4').style.display = '';
					if ( gDebug ) //调试模式读取本地数据
					{
						setTimeout(function(){getDataByAjax("../fake/diag_voice_info", initPage);},2000);
					}
					else
					{
						setTimeout(function(){XHR.get("get_diag_voice_info", null, initPage);},2000);
					}			
				}
				else if (data.DIAGPING.Status == "Dialtone")
				{
					document.getElementById('voice_result1').style.display = '';
					document.getElementById('voice_result2').style.display = '';
					document.getElementById('voice_result3').style.display = '';
					document.getElementById('voice_result4').style.display = 'none';
					document.getElementById('voice_result5').style.display = 'none';
					document.getElementById('voice_result6').style.display = 'none';
					document.getElementById('voice_result7').style.display = 'none';
					document.getElementById('voice_result8').style.display = 'none';
					document.getElementById('conclusion').style.display = 'none';
					document.getElementById('failreason').style.display = 'none';
					document.getElementById('resultDiv4').style.display = '';
					if ( gDebug ) //调试模式读取本地数据
					{
						setTimeout(function(){getDataByAjax("../fake/diag_voice_info", initPage);},2000);
					}
					else
					{
						setTimeout(function(){XHR.get("get_diag_voice_info", null, initPage);},2000);
					}
				}
				else if (data.DIAGPING.Status == "Receiving")
				{
					document.getElementById('voice_result1').style.display = '';
					document.getElementById('voice_result2').style.display = '';
					document.getElementById('voice_result3').style.display = '';
					document.getElementById('voice_result4').style.display = '';
					document.getElementById('voice_result5').style.display = 'none';
					document.getElementById('voice_result6').style.display = 'none';
					document.getElementById('voice_result7').style.display = 'none';
					document.getElementById('voice_result8').style.display = 'none';
					document.getElementById('conclusion').style.display = 'none';
					document.getElementById('failreason').style.display = 'none';
					document.getElementById('resultDiv4').style.display = '';
					if ( gDebug ) //调试模式读取本地数据
					{
						setTimeout(function(){getDataByAjax("../fake/diag_voice_info", initPage);},2000);
					}
					else
					{
						setTimeout(function(){XHR.get("get_diag_voice_info", null, initPage);},2000);
					}
				}
				else if (data.DIAGPING.Status == "ReceiveEnd")
				{
					document.getElementById('voice_result1').style.display = '';
					document.getElementById('voice_result2').style.display = '';
					document.getElementById('voice_result3').style.display = '';
					document.getElementById('voice_result4').style.display = '';
					document.getElementById('voice_result5').style.display = '';
					document.getElementById('voice_result6').style.display = 'none';
					document.getElementById('voice_result7').style.display = 'none';
					document.getElementById('voice_result8').style.display = 'none';
					document.getElementById('conclusion').style.display = 'none';
					document.getElementById('failreason').style.display = 'none';
					document.getElementById('resultDiv4').style.display = '';
					if ( gDebug ) //调试模式读取本地数据
					{
						setTimeout(function(){getDataByAjax("../fake/diag_voice_info", initPage);},2000);
					}
					else
					{
						setTimeout(function(){XHR.get("get_diag_voice_info", null, initPage);},2000);
					}
				}
				else if (data.DIAGPING.Status == "Ringing-back")
				{
					document.getElementById('voice_result1').style.display = '';
					document.getElementById('voice_result2').style.display = '';
					document.getElementById('voice_result3').style.display = '';
					document.getElementById('voice_result4').style.display = '';
					document.getElementById('voice_result5').style.display = '';
					document.getElementById('voice_result6').style.display = '';
					document.getElementById('voice_result7').style.display = 'none';
					document.getElementById('voice_result8').style.display = 'none';
					document.getElementById('conclusion').style.display = 'none';
					document.getElementById('failreason').style.display = 'none';					
					document.getElementById('resultDiv4').style.display = '';					
					if ( gDebug ) //调试模式读取本地数据
					{
						setTimeout(function(){getDataByAjax("../fake/diag_voice_info", initPage);},2000);
					}
					else
					{
						setTimeout(function(){XHR.get("get_diag_voice_info", null, initPage);},2000);
					}
				}
				else if (data.DIAGPING.Status == "Connected")
				{
					document.getElementById('voice_result1').style.display = '';
					document.getElementById('voice_result2').style.display = '';
					document.getElementById('voice_result3').style.display = '';
					document.getElementById('voice_result4').style.display = '';
					document.getElementById('voice_result5').style.display = '';
					document.getElementById('voice_result6').style.display = '';
					document.getElementById('voice_result7').style.display = '';
					document.getElementById('voice_result8').style.display = 'none';
					document.getElementById('conclusion').style.display = 'none';
					document.getElementById('failreason').style.display = 'none';
					document.getElementById('resultDiv4').style.display = '';
					if ( gDebug ) //调试模式读取本地数据
					{
						setTimeout(function(){getDataByAjax("../fake/diag_voice_info", initPage);},2000);
					}
					else
					{
						setTimeout(function(){XHR.get("get_diag_voice_info", null, initPage);},2000);
					}
				}
				else if (data.DIAGPING.Status == "Testend")
				{
					document.getElementById('voice_result1').style.display = '';
					document.getElementById('voice_result2').style.display = '';
					document.getElementById('voice_result3').style.display = '';
					document.getElementById('voice_result4').style.display = '';
					document.getElementById('voice_result5').style.display = '';
					document.getElementById('voice_result6').style.display = '';
					document.getElementById('voice_result7').style.display = '';
					document.getElementById('voice_result8').style.display = '';
					document.getElementById('conclusion').style.display = 'none';
					document.getElementById('failreason').style.display = 'none';					
					document.getElementById('resultDiv4').style.display = '';
					if ( gDebug ) //调试模式读取本地数据
					{
						setTimeout(function(){getDataByAjax("../fake/diag_voice_info", initPage);},2000);
					}
					else
					{
						setTimeout(function(){XHR.get("get_diag_voice_info", null, initPage);},2000);
					}
				}
				else
				{
					document.getElementById('resultDiv4').style.display = 'none';
					if ( gDebug ) //调试模式读取本地数据
					{
						setTimeout(function(){getDataByAjax("../fake/diag_voice_info", initPage);},2000);
					}
					else
					{
						setTimeout(function(){XHR.get("get_diag_voice_info", null, initPage);},2000);
					}
				}
				dynamicConResultHTML = "diagnosingwait".i18n();
				$("#Conclusion_result_iframe").html(dynamicConResultHTML);
				
				document.getElementById('resultDiv3').style.display = '';
				
			}
			else if (data.DIAGPING.voice_Conresult == "2")
			{
				document.getElementById('conclusion').style.display = '';
				if (data.DIAGPING.Conclusion == "Success")
				{
					$("#voice_Conresult").html("success".i18n());
					document.getElementById('failreason').style.display = 'none';	
				}
				else if (data.DIAGPING.Conclusion == "Fail")
				{
					$("#voice_Conresult").html("fail".i18n());
					document.getElementById('failreason').style.display = '';	
					if (data.DIAGPING.Callerfailreason == "NoDailTone")
					{
						$("#voice_reason").html("callernodailtone".i18n());
					}
					else if (data.DIAGPING.Callerfailreason == "OffhookRelease")
					{
						$("#voice_reason").html("calleroffhookrelease".i18n());
					}
					else if (data.DIAGPING.Callerfailreason == "DialingRelease")
					{
						$("#voice_reason").html("releasewhencallerdail".i18n());
					}
					else if (data.DIAGPING.Callerfailreason == "AfterDialRelease")
					{
						$("#voice_reason").html("releaseaftercallerdail".i18n());
					}
					else if (data.DIAGPING.Callerfailreason == "NoAnswer")
					{
						$("#voice_reason").html("callerdidnotcallafterdialing".i18n());
					}
					else if (data.DIAGPING.Callerfailreason == "key error")
					{
						$("#voice_reason").html("pushbtnandtestsetinconsistent".i18n());
					}				
				}			
				document.getElementById('resultDiv3').style.display = 'none';	
				document.getElementById('resultDiv4').style.display = '';
			}			
		}
	}
}

function startPing(a)
{
	var b = a;
	var postdata = buildData(b);
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("do_diag_voice", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}


function buildData(b)
{
	var data = new Object();
    if (b == "1")
    {	
		data.action = 'start';
	}
	else if (b == "2")
    {	
		data.action = 'Conclusion';
		data.voice_number = $("#voice_number").val();
	} 
    return data;
}