var tokenstr = "";
var bartimer;
// var register_timeout_time = 600; //register overtime, seconds, 10min
var register_timeout_time = 120; //register overtime, seconds, 10min
var register_starttime;
var isCu=false;
var isCM =false;
$(document).ready(function(){
	$("#loid").val('');
	$("#password").val('');
	
	XHR.get("get_factory_mode", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
		if ( getdata != null && getdata != undefined && getdata.area_code != null && getdata.area_code != undefined )
		{
			if ( getdata.area_code == "Sichuan" )
			{
				$("#reg_button").val("confirm".i18n());
				if ( getdata.loid_result == "1" )
				{
					$(".input_button2").css("background-color", "#333333");
					$("#reg_button").attr("disabled", true);
				}
				document.getElementById('restore_button').style.display = "";
				$("#restore_button").bind("click", function(){
					window.location.href = "../html/restore_Sichuan_ct.html";
				});	
				$("#loid_text").html("LOID");
				$("#pass_text").html("Password");			
			}
			else
			{
				document.getElementById('restore_button').style.display = "none";
				$("#loid_text").html("inputloid".i18n());
				$("#pass_text").html("inputlopwd".i18n());				
			}
		}
		else
		{
			document.getElementById('restore_button').style.display = "none";
		}
	});
	
	$(".return_tologintd").bind("click", function(){
		window.location.href = ('https:' == document.location.protocol ? 'https://' : 'http://') + document.location.host;
	});
	
	$("#reg_button").bind("click", function(){
		if ( validCheck() )
		{
			//check ok, do register
			var postdata = new Object();
			postdata.loid = $("#loid").val();
			postdata.userid = $("#password").val();
			XHR.get("get_operator", null, function(data){
				if ( data )
				{
					tokenstr = data.token;
				}
			});
			postdata.token = tokenstr;	
			XHR.post("do_loidregister", postdata, null);
			
			register_starttime = new Date().getTime(); //millisecond
			
			showRegisterResult();
		}
	});
	
	$("#cancel_button").bind("click", function(){
		$("#loid").val('');
		$("#password").val('');	
	});
});

function showRegisterResult()
{
	//show progress bar
	$("#register_div").hide();
	$("#progress_div").show();
	
	//初始几秒钟使用假数据模拟注册到OLT的状态，以便后台进行处理。
	showFakeResultAtBegin();
	
	setTimeout(function(){
		//check register result every 2 seconds
		checkRegisterResult();
		bartimer = window.setInterval(function(){checkRegisterResult();},2000);
		},5000
	);
}

function showFakeResultAtBegin()
{
	var fakedata = {
		"progress_stop":0,
		"progress_value":20,
		"is_error":0,
		"error_type":-1,
		"stage":0,
		"services":"",
		"data_type":-1
	}
	
	parseRegisterData(fakedata);
}

function validCheck()
{
	if ( isCu != undefined && isCu == true )
	{
		return validCheckCu();
	}
	if ( isCM != undefined && isCM == true )
	{
		return validCheckCM();
	}
	if ( $("#loid").val() == '' )
	{
		$("#loid_hint").html("hint.empty".i18n());
		return false;
	}
	if ( isCnInclude($("#loid").val()) )
	{
		$("#loid_hint").html("cannotcontainchinese".i18n());
		return false;
	}
	if ( $("#password").val() != '' && isCnInclude($("#password").val()) )
	{
		$("#password_hint").html("cannotcontainchinese".i18n());
		return false;
	}
	
	$("#loid_hint").html("");
	$("#password_hint").html("nopwdleaveblank".i18n());
	return true;
}

function validCheckCu()
{
	if ( $("#loid").val() == '' )
	{
		alert("loidcannotempty".i18n());
		return false;
	}
	if ( isCnInclude($("#loid").val()) )
	{
		alert("loidcannotcontainchinese".i18n());
		return false;
	}
	if ( $("#password").val() != '' && isCnInclude($("#password").val()) )
	{
		alert("pwdcannotcontainchinese".i18n());
		return false;
	}
	return true;
}

function validCheckCM()
{
	if ( $("#password").val() != '' && isCnInclude($("#password").val()) )
	{
		alert("pwdcannotcontainchinese".i18n());
		return false;
	}
	return true;
}

var gDoCheckRegisterResult = true;
function checkRegisterResult()
{
	if ( ! gDoCheckRegisterResult )
	{
		return;
	}
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/register_result", parseRegisterData);
	}
	else
	{
		XHR.get("get_register_result", null, parseRegisterData);
	}
}

function parseRegisterData(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	if ( data )
	{
		setProcess( data );
	}
}

function setProcess( data )
{
	var processbar = document.getElementById("progress_bar");
	var current_process_width = parseInt(processbar.style.width);
	var next_process_width = data.progress_value;
	
	//if register timeout
	var timenow = new Date().getTime();
	if ( parseInt(timenow - register_starttime)/1000 > register_timeout_time )
	{
		if ( current_process_width <= 20 )//still register to olt
		{
			if (isCM == true)
			{
				$("#progress_hint").html("在OLT上注册失败，请检查光纤是否已正常连接、宽带识别码和密码是否正确，如无法解决请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progress_hint").html("在OLT上注册失败，请检查光纤是否已正常连接、宽带识别码和密码是否正确，如无法解决请联系客户经理或拨打10010");
			}
			else
			{
				$("#progress_hint").html("regoltfailcheckfiberloidpwd".i18n());
			}
		}
		else if ( current_process_width <= 30 )// getting ip
		{
			if (isCM == true)
			{
				$("#progress_hint").html("到ITMS的通道不通，请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progress_hint").html("到ITMS的通道不通，请联系客户经理或拨打10010");
			}
			else
			{
				$("#progress_hint").html("accessitmsisnotavailible".i18n());
			}
		}
		else if ( current_process_width <= 40 )// connecting to itms
		{
			if (isCM == true)
			{
				$("#progress_hint").html("到ITMS的通道不通，请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progress_hint").html("到ITMS的通道不通，请联系客户经理或拨打10010");
			}
			else
			{
				$("#progress_hint").html("accessitmsisnotavailible".i18n());
			}
		}
		else if ( current_process_width >= 50 || current_process_width <= 99 )// getting data form itms
		{
			if (isCM == true)
			{
				$("#progress_hint").html("ITMS下发业务异常，请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progress_hint").html("ITMS下发业务异常，请联系客户经理或拨打10010");
			}
			else
			{
				$("#progress_hint").html("itmsdownfailconnmanager".i18n());
			}
		}
		else
		{
			$("#progress_hint").html("regtimeout".i18n());
		}
		$("#progress_hint").addClass("progress_hint_red");
		window.clearInterval(bartimer);
		$("#progress_div .return_tologin").show();
		return;
	}
	//if error, show result, hide progress bar
	if ( data.is_error == 1 )
	{
		// typedef enum
		// {
			// ERROR_OLT_REG_FAIL = 0,
			// ERROR_CANNOT_ACCESS_ITMS = 1,
			// ERROR_ITMS_REG_FIAL = 2,
			// ERROR_ITMS_REG_LIMIT = 3,
			// ERROR_ITMS_REG_TIMEOUT = 4,
			// ERROR_ITMS_ALREADY_REGED = 5,
			// ERROR_ITMS_SERVICE_UNUSUAL = 6,
			// ERROR_UNKNOWN = 7,
		// }ERROR_TYPE;
		if ( data.error_type == 7 )
		{
			$("#progress_hint").html("unknownerror".i18n());
		}
		else if ( data.error_type == 2 )
		{
			if (isCM == true)
			{
				$("#progress_hint").html("在ITMS上注册失败！请检查宽带识别码和密码是否正确，如无法解决请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progress_hint").html("在ITMS上注册失败！请检查宽带识别码和密码是否正确，如无法解决请联系客户经理或拨打10010");
			}
			else
			{
				$("#progress_hint").html("itmsregfailcheckloidpwd".i18n());
			}
		}
		else if ( data.error_type == 3 )
		{
			if (isCM == true)
			{
				$("#progress_hint").html("在ITMS上注册失败！请3分钟后重试，如无法解决请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progress_hint").html("在ITMS上注册失败！请3分钟后重试，如无法解决请联系客户经理或拨打10010");
			}
			else
			{
				$("#progress_hint").html("itmsregfail3minutstry".i18n());
			}
		}
		else if ( data.error_type == 4 )
		{
			if (isCM == true)
			{
				$("#progress_hint").html("在ITMS上注册超时！请检查线路后重试，如无法解决请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progress_hint").html("在ITMS上注册超时！请检查线路后重试，如无法解决请联系客户经理或拨打10010");
			}
			else
			{
				$("#progress_hint").html("itmsregtimeoutcheckline".i18n());
			}
		}
		else if ( data.error_type == 5 )
		{
			$("#progress_hint").html("itmsregsuccdonotreg".i18n());
		}
		else if ( data.error_type == 6 )
		{
			if (isCM == true)
			{
				$("#progress_hint").html("ITMS下发业务异常！请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progress_hint").html("ITMS下发业务异常！请联系客户经理或拨打10010");
			}
			else
			{
				$("#progress_hint").html("itmsdownerrpleaseusermanger".i18n());
			}
		}
		
		$("#progress_hint").addClass("progress_hint_red");
		$(".progress_container").hide();
	}
	
	if ( next_process_width >= current_process_width )
	{
		doProcessIncreas(current_process_width, next_process_width, data);
	}
	
	
	if( parseInt(processbar.style.width) >= 100 || data.progress_stop == 1 || data.is_error == 1 )
	{
		window.clearInterval(bartimer);
		$("#progress_div .return_tologin").show();
	}
}

function doProcessIncreas(current_process_width, next_process_width, data)
{
	var dvalue = parseInt(next_process_width - current_process_width);
	var processbar = document.getElementById("progress_bar");
	
	if ( dvalue > 0 )
	{
		gDoCheckRegisterResult = false;
		current_process_width = current_process_width + 1;
		if ( parseInt(document.getElementById("progress_bar").style.width) < current_process_width )
		{
			processbar.style.width = current_process_width + "%";
			processbar.innerHTML = processbar.style.width;
		}
		setTimeout(function(){doProcessIncreas(current_process_width, next_process_width, data);},200);
	}
	else //when progress bar when to next_process_width, refresh progress_hint
	{
		gDoCheckRegisterResult = true;
		if ( data.is_error == 0 )
		{
			// typedef enum
			// {
				// STAGE_REGGING_OLT = 0,
				// STAGE_GETTING_IP = 1,
				// STAGE_CONNECTING_ITMS = 2,
				// STAGE_WATTING_ITMS_DATA = 3,
				// STAGE_ITMS_SENDING_DATA = 4,
				// STAGE_ITMS_DATA_SUCCESS_NEEDREBOOT = 5,
				// STAGE_ITMS_DATA_SUCCESS_NONEEDREBOOT = 6,
			// }STAGE_TYPE;
			if ( data.stage == 0 )
			{
				$("#progress_hint").html("registingolt".i18n());
			}
			else if ( data.stage == 1 )
			{
				$("#progress_hint").html("regoltsuccgetingmanageip".i18n());
			}
			else if ( data.stage == 2 )
			{
				$("#progress_hint").html("getipaddrconnectingtoitms".i18n());
			}
			else if ( data.stage == 3 )
			{
				$("#progress_hint").html("regitmssuccandwaitdownservice".i18n());
			}
			else if ( data.stage == 4 )
			{
				// typedef enum
				// {
					// ITMS_DATA_INTERNET = 0,
					// ITMS_DATA_IPTV,
					// ITMS_DATA_VOICE,
					// ITMS_DATA_OTHER,
				// }ITMS_DATA_TYPE;
				if ( data.data_type > -1 )
				{
					var data_str = '';
					if ( data.data_type == 0 )
					{
						data_str = "internet".i18n();
					}
					else if ( data.data_type == 1 )
					{
						data_str = "itv".i18n();
					}
					else if ( data.data_type == 2 )
					{
						data_str = "voice".i18n();
					}
					else if ( data.data_type == 3 )
					{
						data_str = "other".i18n();
					}
					$("#progress_hint").html("itmsisdowning".i18n() + data_str + "servicedonotpoweroff".i18n());
				}
				else
				{
					$("#progress_hint").html("itmsisdowningdonotpoweroff".i18n());
				}
			}
			else if ( data.stage == 5 || data.stage == 6 )
			{
				var servicelist = '';
				var servicenum = 0;
				var reboothint = '';
				if ( data.stage == 5 )
				{
					reboothint = "gwneedrebootandwait".i18n();
				}
				if ( data.services != '' )
				{
					if ( data.services.toUpperCase().indexOf("INTERNET") >= 0 )
					{
						servicenum = servicenum + 1;
						if (servicelist == "")
						{
							servicelist = "broadband".i18n();
						}
						else
						{
							servicelist = servicelist + ", ";
							servicelist = servicelist + "broadband".i18n();
						}
					}
					if ( data.services.toUpperCase().indexOf("VOIP") >= 0 )
					{
						servicenum = servicenum + 1;
						if (servicelist == "")
						{
							servicelist = "voice".i18n();
						}
						else
						{
							servicelist = servicelist + ", ";
							servicelist = servicelist + "voice".i18n();
						}
					}
					if ( data.services.toUpperCase().indexOf("IPTV") >= 0 )
					{
						servicenum = servicenum + 1;
						if (servicelist == "")
						{
							servicelist = "itv".i18n();
						}
						else
						{
							servicelist = servicelist + ", ";
							servicelist = servicelist + "itv".i18n();
						}
					}
					if ( data.services.toUpperCase().indexOf("OTHER") >= 0 )
					{
						servicenum = servicenum + 1;
						if (servicelist == "")
						{
							servicelist = "other".i18n();
						}
						else
						{
							servicelist = servicelist + ", ";
							servicelist = servicelist + "other".i18n();
						}
					}
				}
				if ( servicenum == 0 )
				{
					$("#progress_hint").html("itmsservicedownsucc".i18n() + reboothint);
				}
				else
				{
					$("#progress_hint").html("itmsservicedownsuccandnum".i18n() + servicelist + servicenum + "numservice".i18n() + reboothint);
				}
				
			}
		}
	}
}
