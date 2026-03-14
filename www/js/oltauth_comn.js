var tokenstr = "";
var bartimer;
// var register_timeout_time = 600; //register overtime, seconds, 10min
var register_timeout_time = 120; //register overtime, seconds, 10min
var register_starttime;
var isCu=false;
var isCM =false;
var loid_result;
var loid_status;
var ponauthstatus;
var loid_reged_flag;
var login_user;

$(document).ready(function(){
	$("#loid").val('');
	$("#password").val('');
	
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
		if ( getdata.login_user != undefined )
		{
			login_user = getdata.login_user;
		}
	});
	
	XHR.get("get_loid_info", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
		
		if (getdata != null && getdata.loid)
		{
			$("#loid").val(getdata.loid.UserName);
			$("#password").val(getdata.loid.UserId);
			loid_result = getdata.loid.Result;
			loid_status = getdata.loid.Status;
			
			loid_reged_flag = getdata.loid.loid_reged_flag;
			ponauthstatus = getdata.loid.ponauthstatus;
			
			if((loid_reged_flag == 1) && (login_user == 0))
			{
				$("#loid").attr("disabled", true);
				$("#password").attr("disabled", true);
				$("#reg_button").attr("disabled", true);
				$("#main_header_hint2").show();
			}
			else
			{
				$("#loid").attr("disabled", false);
				$("#password").attr("disabled", false);
				$("#reg_button").attr("disabled", false);
				$("#main_header_hint2").hide();
			}
		}
	});
	
	XHR.get("get_factory_mode", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
		
		if (getdata != null)
		{
			/*if(getdata.truegponsn != undefined || getdata.truegponsn != "")
			{
				var gponsnstr = getdata.truegponsn;
				var gponsnstr11 ="0x" + gponsnstr.substring(0, 2);
				var gponsnstr12 ="0x" +  gponsnstr.substring(2, 4);
				var gponsnstr13 ="0x" +  gponsnstr.substring(4, 6);
				var gponsnstr14 ="0x" +  gponsnstr.substring(6, 8);
				var gponsnstr2 = gponsnstr.substring(8);
				var gponsnstr1 = String.fromCharCode(gponsnstr11.toString(10),gponsnstr12.toString(10),gponsnstr13.toString(10),gponsnstr14.toString(10)); 
			
				gponsnstr1 += gponsnstr2;
			}*/
		
			$("#gponsn_text").val(getdata.truegponsn);
			$("#dsn_text").val(getdata.dsn);
			$("#truesn_text").val(getdata.truesn);
		}
	});
	
	$(".return_tologin").bind("click", function(){
		window.location.reload();
	});
	
	$("#reg_button").bind("click", function(){
		if ( validCheck() )
		{
			if ( special_char_check($("#loid").val()) == true || special_char_check($("#password").val()) == true )
			{
				alert("specialcharcheck".i18n());
				return false;
			}
			
			if(( loid_status == 0 ||  loid_status == 99 ) && ( loid_result == 1 ))
			{
				if(confirm("regedsucciscontinue".i18n()) == false)
				{
					return;
				}
			}
			
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
			
			XHR.post("do_loidregister", postdata, reloadSaveData);
			
			//register_starttime = new Date().getTime(); //millisecond
			
			//showRegisterResult();
		}
	});
});

function reloadSaveData(data)
{
	if(data)
	{
		initPage();
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}

function initPage()
{
	XHR.get("get_loid_info", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
		
		if (getdata != null && getdata.loid)
		{
			$("#loid").val(getdata.loid.UserName);
			$("#password").val(getdata.loid.UserId);
			loid_result = getdata.loid.Result;
			loid_status = getdata.loid.Status;
			
			loid_reged_flag = getdata.loid.loid_reged_flag;
			ponauthstatus = getdata.loid.ponauthstatus;
			
			if((loid_reged_flag == 1) && (login_user == 0))
			{
				$("#loid").attr("disabled", true);
				$("#password").attr("disabled", true);
				$("#reg_button").attr("disabled", true);
				$("#main_header_hint2").show();
			}
			else
			{
				$("#loid").attr("disabled", false);
				$("#password").attr("disabled", false);
				$("#reg_button").attr("disabled", false);
				$("#main_header_hint2").hide();
			}
		}
	});

}

function showRegisterResult()
{
	//show progress bar
	$("#register_div22").hide();
	$("#progress_div22").show();
	
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
		$("#progress_hint").css("color", "red");
		window.clearInterval(bartimer);
		$("#progress_div22 .return_tologin").show();
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
		
		$("#progress_hint").css("color", "red");
		$(".progress_container").hide();
	}
	
	if ( next_process_width >= current_process_width )
	{
		doProcessIncreas(current_process_width, next_process_width, data);
	}
	
	
	if( parseInt(processbar.style.width) >= 100 || data.progress_stop == 1 || data.is_error == 1 )
	{
		window.clearInterval(bartimer);
		$("#progress_div22 .return_tologin").show();
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
