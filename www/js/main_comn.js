var gHash;
var isIE7 = false;
var lastSubMenuName, lastSubSecondMenuName, lastSubThirdMenuName;
var lastMainMenuName;
var gLastOperateTime; //记录上一次有效操作的时间，用来完成一段时间无操作自动退出功能
var gSessionMaxTime = 300; //default 300s
var gMeshMode = "ap";//default ap
var tokenstr = "";

// typedef enum
// {
	// LOGIN_USER_COMMON = 0,
	// LOGIN_USER_ADMIN,
	// LOGIN_USER_FIBER,
// }LOGIN_USER_TYPE;
var mainMenuJsonObject,subMenuJsonObject;

var login_user = '1'; //use admin as default
var garea_code = 'Trunk'; //Trunk as default

$(document).ready(function(){
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
	}
	else
	{
		XHR.get("get_login_user", null, parseLoginUser);
	}
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/router_mode", parseRouterMode);
	}
	else
	{
		XHR.get("get_meshmode_info", null, parseRouterMode);
	}
	
	XHR.get("get_area_code", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
		if ( getdata.area_code != undefined )
		{
			garea_code = getdata.area_code;
		}
	});
	
	constructMenuObj();
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/device_info", parseDeviceInfo);
		getDataByAjax("../fake/web_config", parseWebConfig);
	}
	else
	{
		XHR.get("show_device_info", null, parseDeviceInfo);
		XHR.get("get_web_config", null, parseWebConfig);
	}
	bodyLoad();
	
	document.onmouseup = function(e){
    var e = e || window.event;
    var target = e.target || e.srcElement;
    var _con = $("#dropdownMenuLink")//获取你的目标元素
    //1. 点击事件的对象不是目标区域本身
    //2. 事件对象同时也不是目标区域的子元素
    if(!_con.is(e.target) && _con.has(e.target).length === 0){
        $("#dropdown_menu").hide();
    }
}
	setTimeout("checkSessionTimeout();", 15000);
});


function resizeIframe(obj) 
{
	obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
	//document.getElementById("main_footer").style.top = eval(obj.contentWindow.document.body.scrollHeight + 180) + 'px';
	//document.getElementById("main_footer").style.display = "block";
}

function parseWebConfig(data)
{
	if ( data )
	{
		tokenstr = data.token;
		if ( data.SessionMaxTime != undefined )
		{
			gSessionMaxTime = data.SessionMaxTime;
		}
	}
}

function parseRouterMode(data)
{
	if ( data )
	{
		tokenstr = data.token;
		if ( data.MeshMode != undefined )
		{
			gMeshMode = data.MeshMode;
		}
	}
}

function parseLoginUser(data)
{
	if ( data )
	{
		tokenstr = data.token;
		login_user = data.login_user;
	}
}

//根据登录的用户构建不同的菜单对象
function constructMenuObj()
{
	var user,operators_code;
	var operator_seg = "";
	if ( login_user == 2 ) //bfwuser
	{
		user = "bfw";
		$("#dropdownMenuLink").text("Admin");
	}
	else if ( login_user == 1 ) //admin user
	{
		user = "admin";
		$("#dropdownMenuLink").text("Superadmin");
	}
	else //default as common user
	{
		user = "common";
		$("#dropdownMenuLink").text("Admin");
	}
	//todo, get operators_code, add operators_code
	if ( gOperator != undefined && gOperator != '' )
	{
		operators_code = gOperator;
	}
	else
	{
		if (gDebug)
		{
			getDataByAjax("../fake/operator", function(data){
				if ( data )
				{
					operators_code = data.operators_code;
				}
			});
		}
		else
		{
			XHR.get("get_operator", null, function(data){
				if ( data )
				{
					tokenstr = data.token;
					operators_code = data.operators_code;
				}
			});
		}
	}
	
	operator_seg = "_ct";
	
	mainMenuJsonObject = JSON.parse( $.ajax({url:"../menu/main_menu_" + user + operator_seg, async:false}).responseText );
	subMenuJsonObject = JSON.parse( $.ajax({url:"../menu/sub_menu_" + user + operator_seg, async:false}).responseText );
}

//根据端口数、无线状态等裁剪要显示的菜单
function parseDeviceInfo(data)
{
	tokenstr = data.token;
	$.each(subMenuJsonObject, function(name, content){
		var secondindex = 0;
		$.each(content.secondmenus, function(secondname, secondcontent){
			var second_delete = false;
			if ( data.wifi_enable < 1 && secondcontent.name.indexOf("wifi") >= 0 ) //wifi disabled
			{
				// ptweblog("got one wifi! " + secondcontent.name );
				second_delete = true;
			}
			if ( data.voice_port_num < 1 && secondcontent.name.indexOf("voice") >= 0 ) // no voice port
			{
				// ptweblog("got one voice! " + secondcontent.name );
				second_delete = true;
			}
			if ( data.usb_port_num < 1 && secondcontent.name.indexOf("usb") >= 0 ) //no usb port
			{
				// ptweblog("got one usb! " + secondcontent.name );
				second_delete = true;
			}
			
			if ( second_delete ) //如果需要删除2级菜单，则执行删除动作
			{
				delete content.secondmenus[secondindex];
			}
			else //否则处理3级菜单
			{
				var thirdindex = 0;
				if ( secondcontent.thirdmenus != undefined )
				{
					$.each(secondcontent.thirdmenus, function(thirdname, thirdcontent){
						var third_delete = false;
						if ( data.wifi_enable != 1 && thirdcontent.name.indexOf("wifi") >= 0 ) //wifi disabled
						{
							// ptweblog("got one third wifi! " + thirdcontent.name );
							third_delete = true;
						}
						if ( data.wifi_enable == 1 && data.wifi_5g_enable != 1 )// 5g wifi disabled
						{
							if (thirdcontent.name.indexOf("wifi") >= 0 && thirdcontent.name.indexOf("5G") >= 0 )
							{
								// ptweblog("got one third 5g wifi! " + thirdcontent.name );
								third_delete = true;
							}
						}
						if ( gMeshMode != "Master AP" && (thirdcontent.name.indexOf("advance_wlan_mesh") >= 0)) 
						{
							third_delete = true;
						}
						if ( data.voice_port_num < 1 && thirdcontent.name.indexOf("voice") >= 0 ) // no voice port
						{
							// ptweblog("got one third voice! " + thirdcontent.name );
							third_delete = true;
						}
						if ( data.usb_port_num < 1 && thirdcontent.name.indexOf("usb") >= 0 ) //no usb port
						{
							// ptweblog("got one third usb! " + thirdcontent.name );
							third_delete = true;
						}
						if ( garea_code != 'Sichuan' && thirdcontent.name.indexOf("app_voice_map") >= 0 ) //no usb port
						{
							third_delete = true;
						}
						
						if ( third_delete ) //需要删除3级菜单
						{
							delete content.secondmenus[secondindex].thirdmenus[thirdindex];
						}
						
						thirdindex ++;
					});
				}
			}
			secondindex ++;
		});
　　});
}

function gotoWebpage(hash)
{
	var firstmenu;
	var secondmenu;
	var thirdmenu;
	var hashArray = hash.substring(1, hash.length).split("/");

	if ( hashArray.length == 1 )
	{
		changeMainMenu(document.getElementById("first_menu_" + hashArray[0]));
	}
	else if(hashArray.length == 2)
	{
		firstmenu = hashArray[0];
		secondmenu = firstmenu+"_"+hashArray[1];
		thirdmenu = secondmenu;
		constructSubMenuHTML(firstmenu);
		change_first_menu_bg(firstmenu);
		change_first_menu_arrow(firstmenu);
		changeMainMenuForIframe(firstmenu);
		//跳转页面
		changeSubSecondMenu(firstmenu, secondmenu);
	}
	else if(hashArray.length == 3)
	{
		firstmenu = hashArray[0];
		secondmenu = firstmenu+"_"+hashArray[1];
		thirdmenu = secondmenu+"_"+hashArray[2];
		constructSubMenuHTML(firstmenu);
		change_first_menu_bg(firstmenu);
		change_first_menu_arrow(firstmenu);
		changeMainMenuForIframe(firstmenu);
		//跳转页面
		changeSubSecondMenu(firstmenu, secondmenu);
		changeSubThirdMenu(firstmenu, secondmenu, thirdmenu);
	}
}

function isHashValid(hash)
{
	var hashArray = hash.substring(1, hash.length).split("/");
	
	//step 1, is first menu in hash valid
	if ( typeof(subMenuJsonObject[hashArray[0]]) != "object" )
	{
		return false;
	}
	if ( hashArray.length >= 2 )
	{
		//step 2, is second menu in hash valid
		if ( subMenuJsonObject[hashArray[0]]["secondmenus"] == undefined )
		{
			return false;
		}
		var find_second = false;
		var second_name = hashArray[0] + '_' + hashArray[1];
		var second_obj;
		$.each(subMenuJsonObject[hashArray[0]]["secondmenus"], function(name, content){
			if ( content != undefined && content.name == second_name )
			{
				find_second = true;
				second_obj = this;
			}
		});
		
		if ( ! find_second )
		{
			return false;
		}
		
		if ( hashArray.length >= 3 )
		{
			//step 3, is third menu in hash valid
			if ( second_obj["thirdmenus"] == undefined )
			{
				return false;
			}
			var find_third = false;
			var third_name = hashArray[0] + '_' + hashArray[1] + '_' + hashArray[2];
			$.each(second_obj["thirdmenus"], function(name, content){
				if ( content != undefined && content.name == third_name )
				{
					find_third = true;
				}
			});
			if ( ! find_third )
			{
				return false;
			}
		}
	}
	
	return true;
}

function bodyLoad()
{
	if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7.") 
	{
		isIE7 = true;
	}
	
	constructFirstMenuHTML();
	constructMainBodyDivHTML();
	
	//记录hash值，刷新则跳转到记录的页面

	gHash = window.location.hash; 
	if((gHash != null) && (gHash != "") && (gHash != undefined) && isHashValid(gHash))
	{
		gotoWebpage(gHash);
	}
	else
	{
		//模拟一级菜单点击，自动获取第一个
		var first_menu_name = '';
		$.each(mainMenuJsonObject, function(name, content){
			if ( first_menu_name == '' )
			{
				first_menu_name = name;
			}
		});
		changeMainMenu(document.getElementById("first_menu_" + first_menu_name));
	}

	
	window.onresize = function()
	{
		change_first_menu_arrow(lastMainMenuName);
	};
}

function changeMainMenu(element)
{
	XHR.get("check_session_timeout", null, null);

	var name = element.id.split("_")[2];
	
	if (name == "home")
	{
		$("#home_main_div").show();
		$("#main_body_div").hide();
	}
	else
	{
		$("#home_main_div").hide();
		$("#main_body_div").show();
	}
	
	gHash = name;
	window.location.hash = gHash;
	
	var mainobj = eval("mainMenuJsonObject." + name);
	//$("#LocationDisplay").html(mainobj.title.i18n());
	constructSubMenuHTML(name);
	change_first_menu_bg(name);
	change_first_menu_arrow(name);
	changeMainMenuForIframe(name);
	
	gLastOperateTime = new Date().getTime();
}

function doLogout()
{
	cleanPopWindowContent();
	
	//填充内容
	$("#pop_window_title").html("logout_confirm".i18n());
	$("#pop_window_icon").html('<div class="pop_window_icon_help"></div>');
	$("#pop_window_message").html("logout_hint".i18n());
	
	//更改确认操作函数
	var eid = document.getElementById("confirm");
	eid.onclick = function() { realLogout() };
	
	showOrHidePopWindow("show");
}

function realLogout()
{
	var postdata = new Object();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("do_logout", postdata, function(data){
		window.location = ('https:' == document.location.protocol ? 'https://' : 'http://') + document.location.host;
	});
}
function doRestart()
{
	cleanPopWindowContent();
	
	//填充内容
	$("#pop_window_title").html("reboot_confirm".i18n());
	$("#pop_window_icon").html('<div class="pop_window_icon_help"></div>');
	$("#pop_window_message").html("reboot_confirm_hint".i18n());
	
	//更改确认操作函数
	var eid = document.getElementById("confirm");
	eid.onclick = function(){
		$("#pop_window_title").html("reboot_hint".i18n());
		$("#pop_window_icon").html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message").html("rebooting_hint".i18n());
		$("#pop_window_option").hide();
		var postdata = new Object();
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		jumpToLoginPage(false);
		XHR.post("reboot", postdata, null);
	};
	
	showOrHidePopWindow("show");
}
function cleanPopWindowContent()
{
	$("#pop_window_icon").html('');
	$("#pop_window_title").html('');
	$("#pop_window_message").html('');
	//$("#pop_window_option").html('');
}
function showOrHidePopWindow(action)
{
	if ( action == "show" )
	{
		$("#pop_bg_layer").show();
		$("#pop_window_div").show();
	}
	else
	{
		$("#pop_bg_layer").hide();
		$("#pop_window_div").hide();
	}
}

// function cleanPopWindowContentFromIframe()
// {
	// $("#pop_window_icon", window.parent.document).html('');
	// $("#pop_window_title", window.parent.document).html('');
	// $("#pop_window_message", window.parent.document).html('');
// }

// function showOrHidePopWindowFromIframe(action)
// {
	// if ( action == "show" )
	// {
		// $("#pop_window_div", window.parent.document).show();
	// }
	// else
	// {
		// $("#pop_window_div", window.parent.document).hide();
	// }
// }


function dropdownmenudisplayctl()
{
	$("#dropdown_menu").toggle();
}

function doConfirm()
{
	showOrHidePopWindow("hide");
}
function doCancel()
{
	showOrHidePopWindow("hide");
} 
function changeMainMenuForIframe(newMainMenuName)
{
	var lastMenuObj = eval("mainMenuJsonObject." + lastMainMenuName);
	//1.先对上次显示的菜单做处理
	if ( lastMainMenuName != undefined && lastMenuObj != undefined && lastMainMenuName != name )
	{
		//1.1 隐藏div
		if (lastMenuObj.mainDivId != undefined)
		{
			document.getElementById(lastMenuObj.mainDivId).style.display = 'none';
		}
		//1.2 清除iframe内容
		if (document.getElementById(lastMainMenuName + "_iframe") != undefined)
		{
			document.getElementById(lastMainMenuName + "_iframe").src = '';
		}
	}
	
	var newMenuObj = eval("mainMenuJsonObject." + newMainMenuName);
	if (newMenuObj != undefined)   
	{
		//2.再对即将显示的菜单做处理
		//2.1 显示div
		if (newMenuObj.mainDivId != undefined)
			document.getElementById(newMenuObj.mainDivId).style.display = '';
		//2.2 对二、三级菜单处理，设置相应iframe的src
		if (newMenuObj.hasChildMenu != undefined && newMenuObj.hasChildMenu)
		{
			//如有二级菜单，则模拟首次点击
			var subMenuObj = eval("subMenuJsonObject." + newMainMenuName);
			if (subMenuObj != undefined)
			{
				// changeSubSecondMenu(newMainMenuName, subMenuObj.secondmenus[0].name);
				for (var i=0; i<subMenuObj.secondmenus.length; i++) //二级菜单
				{
					if ( subMenuObj.secondmenus[i] != undefined )
					{
						changeSubSecondMenu(newMainMenuName, subMenuObj.secondmenus[i].name);
						break;
					}
				}
			}
		}
		else if (newMenuObj.src != undefined)
		{
			document.getElementById(newMainMenuName + "_iframe").src = newMenuObj.src;
		}
	}
	//2.3 更新lastMainMenuName
	lastMainMenuName = newMainMenuName;
}

function change_first_menu_bg(name)
{
	var new_obj = eval("mainMenuJsonObject." + name);
	var last_obj = eval("mainMenuJsonObject." + lastMainMenuName);
	
	if ( last_obj != undefined )
	{
		$("#first_menu_" + lastMainMenuName).removeClass("first_menu_primary_select");
		$("#first_menu_" + lastMainMenuName).removeClass("first_menu_more_select");
		$("#first_menu_select_arrow_div").removeClass("first_menu_" + lastMainMenuName + "_select_arrow");
	}
	if ( new_obj != undefined )
	{
		$("#first_menu_" + name).addClass(new_obj.selectClass);
	}
	$("#first_menu_select_arrow_div").css("visibility", "visible");
}

function change_first_menu_arrow(name)
{
	var new_obj = eval("mainMenuJsonObject." + name);

	if ( new_obj != undefined )
	{
		var selectLeftWidth = document.getElementById("first_menu_" + name ).offsetLeft;
		var arrowWidth = $("#first_menu_select_arrow_div").width();
		var selectWidth = $("#first_menu_" + name).width();
		var leftWidth = parseInt(selectLeftWidth + (selectWidth-arrowWidth)/2);
		
		
		if ( isIE7 )
		{
			if ($("#tianyi_logo_div").length > 0)
			{
				var logWidth = $("#tianyi_logo_div").width();
				var logLeftWidth = document.getElementById("tianyi_logo_div" ).parentElement.offsetLeft;
				leftWidth += logWidth + logLeftWidth;
			}
		}
		$("#first_menu_select_arrow_div").css("margin-left", leftWidth);
	}
}

function constructSubMenuHTML(name)
{
	var subMenuObj = eval("subMenuJsonObject." + name);
	
	if (subMenuObj != undefined)
	{
		var dynamicConfigSubMenuHTML = "";
		var position = subMenuObj.childMenuPosition;
		if ( position == "both" ) //既有二级菜单也有三级菜单
		{
			var partSecondMenuHTML = "";
			for (var i=0; i<subMenuObj.secondmenus.length; i++) //二级菜单
			{
				if ( subMenuObj.secondmenus[i] != undefined )
				{
					partSecondMenuHTML += "<div id='sub_second_menu_" + name + "_" + subMenuObj.secondmenus[i].name + "' class='sub_second_menu_" + position + "_second' onclick='changeSubSecondMenu(\"" + name + "\", \"" + subMenuObj.secondmenus[i].name + "\")'>";
					partSecondMenuHTML += subMenuObj.secondmenus[i].title.i18n();
					partSecondMenuHTML += "</div>";
				}
			}
			
			$("#" + name + "_sub_second_menu_div").html(partSecondMenuHTML);
		}
		else
		{
			if ( position == "top" )
			{
				dynamicConfigSubMenuHTML += "<div class='sub_second_menu_top_blank'></div>";
			}
			for (var i=0; i<subMenuObj.secondmenus.length; i++) //二级菜单
			{
				var partSecondMenuHTML = "";
				if ( subMenuObj.secondmenus[i] != undefined )
				{
					if(subMenuObj.secondmenus[i].name == "status_usb")
					{
						partSecondMenuHTML += "<div id='sub_second_menu_" + name + "_" + subMenuObj.secondmenus[i].name + "' class='sub_second_menu_" + position + "_second menu_disable' onclick='changeSubSecondMenu(\"" + name + "\", \"" + subMenuObj.secondmenus[i].name + "\")'>";
					}
					else
					{
						partSecondMenuHTML += "<div id='sub_second_menu_" + name + "_" + subMenuObj.secondmenus[i].name + "' class='sub_second_menu_" + position + "_second' onclick='changeSubSecondMenu(\"" + name + "\", \"" + subMenuObj.secondmenus[i].name + "\")'>";
					}
					partSecondMenuHTML += subMenuObj.secondmenus[i].title.i18n();
					partSecondMenuHTML += "</div>";

					var partThirdMenuHTML = "";
					//二级菜单在左侧时构建三级菜单
					if ( position == "left"
						&& subMenuObj.secondmenus[i].thirdmenus != undefined
						&& subMenuObj.secondmenus[i].thirdmenus.length > 0)
					{
						partThirdMenuHTML += "<div id='sub_third_menu_" + name + "_" + subMenuObj.secondmenus[i].name + "' style='display: none;'>";
						for (var j=0; j<subMenuObj.secondmenus[i].thirdmenus.length; j++)
						{
							if ( subMenuObj.secondmenus[i].thirdmenus[j] != undefined )
							{
							partThirdMenuHTML += "<div id='sub_third_menu_" + name + "_" + subMenuObj.secondmenus[i].name + "_" + subMenuObj.secondmenus[i].thirdmenus[j].name + "' class='sub_second_menu_left_third' onclick='changeSubThirdMenu(\"" + name + "\", \"" + subMenuObj.secondmenus[i].name + "\", \"" + subMenuObj.secondmenus[i].thirdmenus[j].name + "\")'>";
							partThirdMenuHTML += subMenuObj.secondmenus[i].thirdmenus[j].title.i18n();
							partThirdMenuHTML += "</div>";
							}
						}
						partThirdMenuHTML += "<div class='sub_third_menu_left_blank'></div>";
						partThirdMenuHTML += "</div>";
					}
					dynamicConfigSubMenuHTML += partSecondMenuHTML;
					dynamicConfigSubMenuHTML += partThirdMenuHTML;
				}
			}
			$("#" + name + "_sub_second_menu_div_" + position).html(dynamicConfigSubMenuHTML);
		}
	}
}

function changeSubSecondMenu(newSubMenuName, newSubSecondMenuName, params)
{
	XHR.get("check_session_timeout", null, null);
	
	var newSubMenuJsonObj = eval("subMenuJsonObject." + newSubMenuName);
	var lastSubMenuJsonObj = eval("subMenuJsonObject." + lastSubMenuName);
	var lastSecondMenuObj, newSecondMenuObj;
	
	if (lastSubMenuJsonObj != undefined)
	{
		if (lastSubSecondMenuName != undefined)
		{
			for (var j=0; j<lastSubMenuJsonObj.secondmenus.length; j++)
			{
				if ( lastSubMenuJsonObj.secondmenus[j] != undefined
					&& lastSubSecondMenuName == lastSubMenuJsonObj.secondmenus[j].name)
				{
					lastSecondMenuObj = lastSubMenuJsonObj.secondmenus[j];
					//清除样式
					$("#sub_second_menu_" + lastSubMenuName + "_" + lastSubSecondMenuName).removeClass("sub_second_menu_" + lastSubMenuJsonObj.childMenuPosition + "_second_select");
					
					//如果有3级菜单，则隐藏
					if (lastSecondMenuObj.thirdmenus != undefined && lastSecondMenuObj.thirdmenus.length > 0)
					{
						if ( lastSubMenuJsonObj.childMenuPosition != "both" )
						{
							document.getElementById("sub_third_menu_" + lastSubMenuName + "_" + lastSubSecondMenuName).style.display = "none";
						}
						//清除3级菜单样式
						var lastThirdMenuElement = document.getElementById("sub_third_menu_" + newSubMenuName + "_" + lastSubSecondMenuName + "_" + lastSubThirdMenuName);
						if (lastThirdMenuElement != undefined)
						{
							$("#sub_third_menu_" + lastSubMenuName + "_" + lastSubSecondMenuName + "_" + lastSubThirdMenuName).removeClass("sub_second_menu_" + lastSubMenuJsonObj.childMenuPosition + "_third_select");
						}
					}
					break;
				}
			}
		}
	}

	if ( newSubMenuJsonObj.childMenuPosition == "both" )
	{
		consturctThirdMenuHTML(newSubMenuName, newSubSecondMenuName);
	}
	
	for (var i=0; i<newSubMenuJsonObj.secondmenus.length; i++)
	{
		if ( newSubMenuJsonObj.secondmenus[i] != undefined 
			&& newSubSecondMenuName == newSubMenuJsonObj.secondmenus[i].name)
		{
			newSecondMenuObj = newSubMenuJsonObj.secondmenus[i];
			break;
		}
	}
	//设置样式
	$("#sub_second_menu_" + newSubMenuName + "_" + newSubSecondMenuName).addClass("sub_second_menu_" + newSubMenuJsonObj.childMenuPosition + "_second_select");
	
	//如果有3级菜单则显示，并模拟首次点击
	if (newSecondMenuObj.thirdmenus != undefined && newSecondMenuObj.thirdmenus.length > 0)
	{
		//alert("has third");
		for ( var i=0; i<newSecondMenuObj.thirdmenus.length ; i++ )
		{
			if ( newSecondMenuObj.thirdmenus[i] != undefined )
			{
				changeSubThirdMenu(newSubMenuName, newSubSecondMenuName, newSecondMenuObj.thirdmenus[i].name, params);
				break;
			}
		}
		if ( newSubMenuJsonObj.childMenuPosition != "both" )
		{
			document.getElementById("sub_third_menu_" + newSubMenuName + "_" + newSubSecondMenuName).style.display = "";
		}
	}
	else //如果没有3级菜单，更新iframe内容
	{
		gHash = newSubMenuName;
		if((newSubSecondMenuName != undefined) && (newSubSecondMenuName.split("_").length > 1))
		{
			gHash += "/" + newSubSecondMenuName.split("_")[1];
		}
		window.location.hash = gHash;
		
		// ptweblog('params ' + params);
		if ( params == '' || params == undefined)
		{
			document.getElementById(newSubMenuName + "_iframe").src = newSecondMenuObj.src;
		}
		else
		{
			document.getElementById(newSubMenuName + "_iframe").src = newSecondMenuObj.src + '?' + params;
		}
	}
	//更新lastSubSecondMenuName lastSubMenuName
	lastSubSecondMenuName = newSubSecondMenuName;
	lastSubMenuName = newSubMenuName;
}

function changeSubThirdMenu(newSubMenuName, newSubSecondMenuName, newSubThirdMenuName, params)
{
	XHR.get("check_session_timeout", null, null);

	var subMenuJsonObj = eval("subMenuJsonObject." + newSubMenuName);
	var newThirdMenuObj;
	
	for (var i=0; i<subMenuJsonObj.secondmenus.length; i++)
	{
		if ( subMenuJsonObj.secondmenus[i] != undefined
			&& newSubSecondMenuName == subMenuJsonObj.secondmenus[i].name
			&& subMenuJsonObj.secondmenus[i].thirdmenus != undefined 
			&& subMenuJsonObj.secondmenus[i].thirdmenus.length)
		{
			for (var j=0; j<subMenuJsonObj.secondmenus[i].thirdmenus.length; j++)
			{
				if ( subMenuJsonObj.secondmenus[i].thirdmenus[j] != undefined
					&& newSubThirdMenuName == subMenuJsonObj.secondmenus[i].thirdmenus[j].name)
				{
					newThirdMenuObj = subMenuJsonObj.secondmenus[i].thirdmenus[j];
					break;
				}
			}
			break;
		}
	}
	
	var lastThirdMenuElement = document.getElementById("sub_third_menu_" + newSubMenuName + "_" + lastSubSecondMenuName + "_" + lastSubThirdMenuName);
	//清除上一个被点击元素的样式
	if (lastThirdMenuElement != undefined)
	{
		$("#sub_third_menu_" + newSubMenuName + "_" + lastSubSecondMenuName + "_" + lastSubThirdMenuName).removeClass("sub_second_menu_" + subMenuJsonObj.childMenuPosition + "_third_select");
	}
	//设置新元素的样式
	$("#sub_third_menu_" + newSubMenuName + "_" + newSubSecondMenuName + "_" + newSubThirdMenuName).addClass("sub_second_menu_" + subMenuJsonObj.childMenuPosition + "_third_select");
	//更新iframe内容
	// ptweblog('params ' + params);
	if ( params == '' || params == undefined)
	{
		document.getElementById(newSubMenuName + "_iframe").src = newThirdMenuObj.src;
		gHash = newSubMenuName;
		if((newSubSecondMenuName != undefined) && (newSubSecondMenuName.split("_").length > 1))
		{
			gHash += "/" + newSubSecondMenuName.split("_")[1];
		}
		if((newSubThirdMenuName != undefined) && (newSubThirdMenuName.split("_").length > 2))
		{
			gHash += "/" + newSubThirdMenuName.split("_")[2];
		}
		window.location.hash = gHash;
	}
	else
	{
		document.getElementById(newSubMenuName + "_iframe").src = newThirdMenuObj.src + '?' + params;
	}
	
	lastSubThirdMenuName = newSubThirdMenuName;
	
	gLastOperateTime = new Date().getTime();
}

function constructFirstMenuHTML()
{
	var dynamicHTML = "";
	$.each(mainMenuJsonObject, function(name, content){
		// ptweblog(name);
		// ptweblog(content.title);
		dynamicHTML += '<div id="first_menu_' + name + '" ';
		dynamicHTML += 'class="first_menu_primary float_left" onclick="changeMainMenu(this)">' + content.title.i18n() + '</div>';
		$("#first_menu_primary_div").html(dynamicHTML);
　　})
}

function constructMainBodyDivHTML()
{
	var dynamicHTML = "";
	
	$.each(mainMenuJsonObject, function(name, content){
	
		if (name == "home")
		{
			$("#home_main_div").show();
			$("#main_body_div").hide();
		}
		else
		{
			$("#home_main_div").hide();
			$("#main_body_div").show();
	
			var subMenuObj = eval("subMenuJsonObject." + name);
			dynamicHTML += '';
		
			if (subMenuObj.childMenuPosition != undefined)
			{
				var position = subMenuObj.childMenuPosition;
				if ( position == "top" || position == "left" )
				{
					dynamicHTML += '<div id="' + name + '_main_div" style="display:none" class="main_div">';
					dynamicHTML += '<div id="' + name + '_sub_second_menu_div_' + position + '" class="sub_second_menu_' + position + '">';
					dynamicHTML += '</div>';
					dynamicHTML += '<div class="sub_second_iframe_' + position + '">';
					dynamicHTML += '<iframe id="' + name + '_iframe" name="' + name + '_iframe" align="middle" frameborder="0" scrolling="auto" class="main_iframe" src=""></iframe>';
					dynamicHTML += '</div>';
					dynamicHTML += '</div>';
				}
				else if (subMenuObj.childMenuPosition == "both")
				{
					dynamicHTML += '<div id="' + name + '_main_div" style="display:none" class="main_div">';
					dynamicHTML += '<div id="' + name + '_sub_second_menu_div" class="sub_second_menu_both"></div>';
					dynamicHTML += '<div class="content_top"></div>';
					dynamicHTML += '<div id="' + name + '_sub_third_menu_div" class="sub_third_menu_both"></div>';
					dynamicHTML += '<div class="content_left"></div>';
					dynamicHTML += '<div class="sub_iframe_both">';
					dynamicHTML += '<iframe id="' + name + '_iframe" name="' + name + '_iframe" align="middle" frameborder="0" scrolling="auto" class="main_iframe" src=""></iframe>';
					dynamicHTML += '</div>';
					dynamicHTML += '</div>';
					
				}
			}
		}
　　})
	$("#main_body_div").html(dynamicHTML);
}

function consturctThirdMenuHTML(firstmenu, secondmenu)
{
	var dynamicHTML = "";
	var firstMenuJsonObj = eval("subMenuJsonObject." + firstmenu);
	var secondMenuObj;
	
	for (var i=0; i<firstMenuJsonObj.secondmenus.length; i++)
	{
		if ( firstMenuJsonObj.secondmenus[i] != undefined
			&& secondmenu == firstMenuJsonObj.secondmenus[i].name )
		{
			secondMenuObj = firstMenuJsonObj.secondmenus[i];
			break;
		}
	}
	
	for (var i=0; i<secondMenuObj.thirdmenus.length; i++)
	{
		if ( secondMenuObj.thirdmenus[i] != undefined )
		{
			dynamicHTML += "<div id='sub_third_menu_" + firstmenu + "_" + secondmenu + "_" + secondMenuObj.thirdmenus[i].name + "' class='sub_second_menu_both_third' onclick='changeSubThirdMenu(\"" + firstmenu + "\", \"" + secondmenu + "\", \"" + secondMenuObj.thirdmenus[i].name + "\")'>";
			dynamicHTML += secondMenuObj.thirdmenus[i].title.i18n();
			dynamicHTML += "</div>";
		}
	}
	
	$("#" + firstmenu + "_sub_third_menu_div").html(dynamicHTML);
}

function checkSessionTimeout()
{
	if ( ! gDebug )
	{
		var currentTime = new Date().getTime();
		if ( parseInt(currentTime - gLastOperateTime) >= parseInt(gSessionMaxTime) * 1000 ) //无操作自动退出时间，默认5分钟
		{
			realLogout();
		}
		else
		{
			setTimeout("checkSessionTimeout();", 15000);
		}
	}
}