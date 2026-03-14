//do access control before load DOM elements
(function(){
	//登录用户0:普通用户 1:管理员用户 2:隐藏用户
	/*页面接入权限列表，多用户可见相加
		-1:无需登录即可见
		1:普通用户可见
		2:管理员用户可见
		4:隐藏用户可见
	*/
	var accessLevelArray = new Array(
			["acs_config_status.html", "2"],
			["adminWlanAdvancedSettings.html", "4"],
			["adminWlanAdvancedSettings_5G.html", "4"],
			["adminWlanBasicSettings.html", "4"],
			["adminWlanBasicSettings_5G.html", "4"],
			["alg.html", "2"],
			["baseinfoSet.html", "4"],
			["broadband.html", "2"],
			["checkpreconfig.html", "-1"],
			["connect_status.html", "2"],
			["ddns.html", "3"],
			["dmz.html", "3"],
			["dsp.html", "4"],
			["factory_h248_preconfig.html", "4"],
			["factory_log.html", "4"],
			["factory_log_download.html", "4"],
			["factory_sip_preconfig.html", "4"],
			["factory_voice_base.html", "4"],
			["factory_voicecommon_preconfig.html", "4"],
			["file_upload.html", "4"],
			["file_download.html", "4"],
			["firewall.html", "3"],
			["igmp.html", "2"],
			["ipconInfo.html", "3"],
			["lan_ipv4.html", "3"],
			["lan_ipv6.html", "3"],
			["logSettings.html", "2"],
			["logView.html", "2"],
			["login_ct.html", "-1"],
			["logoffaccount.html", "-1"],
			["factoryinfoCheck.html", "2"],
			["mac_filter.html", "3"],
			["main_ipfilter.html", "2"],
			["main.html", "7"],
			["main_demo.html", "7"],
			["maintenance.html", "2"],
			["manual_inform.html", "2"],
			["diag_voice.html", "2"],
			["ntp.html", "2"],
			["usbcrt.html", "2"],
			["route.html", "2"],
			["oltauth.html", "3"],
			["option16.html", "4"],
			["option60.html", "4"],
			["ping.html", "2"],
			["pon_link_info.html", "3"],
			["port_mirror.html", "4"],
			["portmapping.html", "3"],
			["preconfig.html", "4"],
			["qos_app.html", "2"],
			["qos_base.html", "2"],
			["qos_class.html", "2"],
			["qos_queue.html", "2"],
			["register.html", "-1"],
			["restoreDefault.html", "3"],
			["restore_factory.html", "4"],
			["services.html", "4"],
			["shortcut_onekey.html", "4"],
			["shortcut_telnet.html", "4"],
			["smart_framework_pause.html", "2"],
			["smart_framework_reboot.html", "2"],
			["smart_platform_status.html", "2"],
			["smart_plugin_status.html", "3"],
			["stateOverview.html", "3"],
			["statslan.html", "3"],
			["tr69.html", "2"],
			["traceroute.html", "2"],
			["upgrade.html", "4"],
			["upgrade_preconfig.html", "4"],
			["broadband_factory.html", "4"],
			["upnp.html", "2"],
			["url_filter.html", "3"],
			["usbinfo.html", "3"],
			["userManagement.html", "3"],
			["vlanbind.html", "2"],
			["full_routing.html", "2"],
			["domain.html", "2"],
			["voice_add.html", "2"],
			["voice_advance.html", "2"],
			["voice_base.html", "2"],
			["voice_dial.html", "2"],
			["voice_fax.html", "2"],
			["voice_map.html", "2"],
			["voice_info.html", "3"],
			["web_log.html", "4"],
			["wifi_info.html", "3"],
			["wlanAdvancedSettings.html", "3"],
			["wlanAdvancedSettings_5G.html", "3"],
			["wlanBasicSettings.html", "3"],
			["wlanBasicSettings_5G.html", "3"],
			["wlanMultiSettings.html", "3"]
		);
		
	//未登陆时直接访问html应跳入登录页面
	function htmlAccessControl()
	{
		if ( gDebug == true )
		{
			return;
		}
		var herfArray = window.location.pathname.split("/");
		var htmlName = herfArray[herfArray.length - 1];
		var singleAccessLevel = -1; //default
		var factorymodeflag = "";
		
		XHR.get("get_factory_mode_flag", null, function(data){
			if ( data )
			{
				factorymodeflag = data.factory_mode;
			}
		});
		
		for (var i=0; i<accessLevelArray.length; i++)
		{
			if ( htmlName == accessLevelArray[i][0] )
			{
				if (factorymodeflag == "1" && accessLevelArray[i][0] == "factoryinfoCheck.html")
				{
					singleAccessLevel = "-1";
					break;
				}
				else
				{
					singleAccessLevel = accessLevelArray[i][1];
					break;
				}
			}
		}
		
		if ( singleAccessLevel >= 0 )
		{
			//需要检查访问页面的ip是否登录且在有效期内
			var requestURL = '../cgi-bin/is_logined.cgi?_=' + Math.random();
			requestURL += '&tkagent=' + navigator.userAgent;
			$.ajax({
				url : requestURL,
				dataType : 'json',
				type : "GET",
				async: false,
				success : function(returndata, textStatus, jqXHR){
					if ( returndata.result == 0 ) //未登录
					{
						window.parent.location = "../index.html";
					}
					else
					{
						var userAccessLevel = Math.pow(2, parseInt(returndata.user));
						if ( userAccessLevel != (userAccessLevel & singleAccessLevel) )
						{
							window.parent.location = "../index.html";
						}
						//else do nothing
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {  
					ptweblog("do is_logined.cgi failed");
				}
			});
		}
		//else do nothing
	}
	htmlAccessControl();
})(jQuery);