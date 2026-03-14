//javascript for login.html
// var isEmpty = true;
var tokenstr = "";
var captchacode = "";
var glanipv4 = "";
var glanipv6 = "";
var lanorwan = "";

document.onkeydown=function mykeyDown(e){   
	e = e||event;		
	if(e.keyCode == 13) 
	{
		document.getElementById('login_btn').click();
	}    
	return;
}

function hostnamecheck()
{
	var hostnamestr = document.location.hostname;
	
	if ( -1 != glanipv4.indexOf(hostnamestr) || (-1 != glanipv6.indexOf((hostnamestr.replace('[', '').replace(']', ''))) && -1 != hostnamestr.indexOf("fe80")))//lan
	{
		$("#captcha").show();
		$("#refreshbtn").show();
		lanorwan = "lan";
	}
	else
	{
		$("#captcha").hide();
		$("#refreshbtn").hide();
		lanorwan = "wan";
	}
}


$(document).ready(function(){

	XHR.get("get_lanip_info", null, function(data){
		if (data)
		{
			tokenstr = data.token;
			if (data.lanipv4 && data.lanipv4 != undefined)
			{
				glanipv4 = data.lanipv4;
			}
			
			if (data.lanipv6 && data.lanipv6 != undefined)
			{
				glanipv6 = data.lanipv6;
			}
		}
	});

	hostnamecheck();
	
	if ( gDebug ) //检查是否为出厂模式
	{
		getDataByAjax("../fake/factorymode", showFactoryTip);
	}
	else if (lanorwan == "lan")
	{
		XHR.get("get_factory_mode", null, showFactoryTip);
	} 
});

function showFactoryTip(getdata)
{
	if ( getdata )
	{
		tokenstr = getdata.token;
		
		if ( getdata.defaultdwp != "" && getdata.defaultdwp != undefined )
		{
			captchacode = Base.decode(getdata.defaultdwp);
		}
		
		refreshCaptcha();
		
		/* if ( getdata.truegponsn != "" && getdata.truegponsn != undefined )
		{
			var gponsntext = "GPON SN ";
			var dsntext = "D-SN ";
			gponsntext += getdata.truegponsn;
			dsntext += getdata.dsn;
		
			$("#gponsn_text").text(gponsntext);
			$("#dsn_text").text(dsntext);
			
			//barcode
			var barcodeval = getdata.truegponsn;
			JsBarcode("#gponsncode", barcodeval, {format: "CODE39",width: 1,height: 50,displayValue: false});
		} */
	}
}

function onlogin() 
	{	
		if($("#user_name").val().length <= 0) {
			alert("login.alert_username".i18n());
			return false;
		}
		if($("#password").val().length <= 0) {
			alert("login.alert_pwd".i18n());
			return false;
		}
		
		doLoginRequest();	
	}

function doLoginRequest()
{
	var hostnamestr = document.location.hostname;
	
	var postdata = new Object();
	postdata.username = $("#user_name").val();
	postdata.dwp = Base.encode($("#password").val());
	
	if ( -1 != glanipv4.indexOf(hostnamestr) || (-1 != glanipv6.indexOf((hostnamestr.replace('[', '').replace(']', ''))) && -1 != hostnamestr.indexOf("fe80")))//lan
	{
		postdata.lanorwan = "lan";
	}
	else
	{
		postdata.lanorwan = "wan";
	}
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/logindata", parseLoginData);
	}
	else
	{
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("do_login", postdata, parseLoginData);
	}
}

function parseLoginData(data)
{
	if (data)
	{
		if ( data.login_result == 0 )//校验成功
		{
			window.location.href="/html/main.html";
			return;
		}
		else if ( data.login_result == 1 )
		{
			alert("login.alert_logined".i18n());
		}
		else if ( data.login_result == 2 )
		{
			alert("login.alert_threetimes".i18n());
		}
		else if ( data.login_result == 3 )
		{
			alert("login.alert_admindisable".i18n());
		}
		else if ( data.login_result == 4 )
		{
			alert("login.alert_userorpwderr".i18n());
		}
		else
		{
			alert("login.alert_unknownerror".i18n());
		}
	}
	else
	{
		alert("login.alert_unknownerror".i18n());
	}
	$("#password").val("");
}

function passwordToggle() 
{
	if ($("#password").attr('type') == 'text') 
	{
		$("#password").prop('type', 'password');
	} else 
	{
		$("#password").prop('type', 'text');
	}
}

function ranNum(min, max)
{
    return Math.random() * (max - min) + min;
}
function drawCircle(canvasId, canvasW, canvasH, num, r, min, max)
{
    for (var i = 0; i < num; i++)
    {
        canvasId.beginPath();
        canvasId.arc(ranNum(0, canvasW), ranNum(0, canvasH), r, 0, 2 * Math.PI);
        canvasId.fillStyle = ranColor(min, max);
        canvasId.fill();
        canvasId.closePath();
    }
}
function ranColor(min, max)
{
    var r = ranNum(min, max);
    var g = ranNum(min, max);
    var b = ranNum(min, max);
    var hex='#';
    var col=r<<16|g<<8|b;
    hex+=col.toString(16);
    return hex;
}
function drawBg(canvasId, canvasW, canvasH, min, max)
{
    canvasId.fillStyle = ranColor(min, max);
    canvasId.fillRect(0, 0, canvasW, canvasH);
}
function drawLine(canvasId, canvasW, canvasH, num, min, max)
{
        for (var i = 0; i < num; i++)
        {
            canvasId.beginPath();
            canvasId.moveTo(ranNum(0, canvasW), ranNum(0, canvasH));
            canvasId.lineTo(ranNum(0, canvasW), ranNum(0, canvasH));
            canvasId.strokeStyle = ranColor(min, max);
            canvasId.stroke();
            canvasId.closePath();
        }
 }
function drawText(canvasId, canvasW, canvasH, passwordDefault, fsMin, fsMax, frMin, frMax, min, max)
{
        var str = "";
        for (var i = 0; i < passwordDefault.length; i++) {
            var fs = ranNum(fsMin, fsMax);
            canvasId.font = fs + "px Verdana";
            canvasId.fillStyle = ranColor(min, max);
            canvasId.save();
            canvasId.translate((canvasW-20) / passwordDefault.length * i+ 10, 0);
            canvasId.rotate(ranNum(frMin, frMax) * Math.PI / 180);
            canvasId.fillText(passwordDefault[i], 0, (canvasH + fs) / 2.5, canvasW /(passwordDefault.length));
            canvasId.restore();
        }
 }
function drawPasswordCanva()
{
 var ctx = document.getElementById("captchaspan").getContext("2d");
        var ctxW = document.getElementById("captchaspan").clientWidth;
        var ctxH = document.getElementById("captchaspan").clientHeight;
        var passwordShown = captchacode;
        ctx.clearRect(0, 0, 180, 50);
        drawBg(ctx, ctxW, ctxH, 180, 255);
        drawCircle(ctx, ctxW, ctxH, 15, 5, 220, 255);
        drawLine(ctx, ctxW, ctxH, 10, 0, 255);
        drawText(ctx, ctxW, ctxH, passwordShown, 15, 28, -10, 10, 30, 80);
}
function refreshCaptcha()
{
 drawPasswordCanva();
}




