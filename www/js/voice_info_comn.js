
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_status", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_voice_status", null, parseGetData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	var dynamicHTML = '';
	var voip_wan_exist = 0;

	XHR.get("get_allwan_name", null, function(data){
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
	
	if ( data && data.voice_status && data.voice_status.voice_port_num > 0 )
	{
		for (i=1; i<=data.voice_status.voice_port_num; i++)
		{
			if(i%2 == 1)
			{
				dynamicHTML += '<tr class="oddtr">';
			}
			else
			{
				dynamicHTML += '<tr>';
			}
			dynamicHTML += '<td>' + i + '</td>';
			if ( data.voice_status.ServerType == 2 )
			{
				dynamicHTML += '<td>' + eval("data.voice_status.AuthUserName" + i) + '(' + ')' + '</td>';
			}
			else
			{
				dynamicHTML += '<td>' + eval("data.voice_status.AuthUserName" + i) + '(' + eval("data.voice_status.DirectoryNumber" + i) + ')' + '</td>';
			}
			
			if ( voip_wan_exist == 1 )
			{
				var lineenable = eval('data.voice_status.EnableLine' + i);
				if ( lineenable == "Disabled" )
				{
					dynamicHTML += '<td>' + "unregister".i18n() + '</td>';
					dynamicHTML += '<td></td>';
				}
				else
				{
					var regstatus = eval('data.voice_status.RegStatus' + i);
					if ( regstatus == "Unconfig" )
					{
						dynamicHTML += '<td>' + "unconfig".i18n() + '</td>';
						dynamicHTML += '<td></td>';
					}
					else if ( regstatus == "Disabled" )
					{
						dynamicHTML += '<td>' + "disable".i18n() + '</td>';
						dynamicHTML += '<td></td>';
					}
					else if ( regstatus == "Registering" )
					{
						dynamicHTML += '<td>' + "registering".i18n() + '</td>';
						dynamicHTML += '<td></td>';
					}
					else if ( regstatus == "Online" )
					{
						dynamicHTML += '<td>' + "reg_succ".i18n() + '</td>';
						dynamicHTML += '<td></td>';
					}
					else
					{
						dynamicHTML += '<td>' + "reg_fail".i18n() + '</td>';
						if ( data.voice_status.ServerType == 2 ) //ServerType 0:IMS 1:SIP 2:H248
						{
							var reason248 = eval("data.voice_status.RegStatusReason" + i);
							if ( reason248 == 716 )
							{
								dynamicHTML += '<td>' + "config_err".i18n() + '</td>';
							}
							else if ( reason248 == 702 )
							{
								dynamicHTML += '<td>' + "servernoresponding".i18n() + '</td>';
							}
							else
							{
								dynamicHTML += '<td>' + "unknown_err".i18n() + '</td>';
							}
							
						}
						else
						{
							var reason = eval("data.voice_status.RegStatusReason" + i);
							if ( reason == 710 )
							{
								dynamicHTML += '<td>' + "olt_reg_fail".i18n() + '</td>';
							}
							else if ( reason == 711 )
							{
								dynamicHTML += '<td>' + "novoicewan".i18n() + '</td>';
							}
							else if ( reason == 712 )
							{
								dynamicHTML += '<td>' + "voicegetiperr".i18n() + '</td>';
							}
							else if ( reason == 702 )
							{
								dynamicHTML += '<td>' + "servernoresponding".i18n() + '</td>';
							}
							else if ( reason == 713 )
							{
								dynamicHTML += '<td>' + "incompleteconfiginfo".i18n() + '</td>';
							}
							else if ( reason == 714 )
							{
								dynamicHTML += '<td>' + "userdisable".i18n() + '</td>';
							}
							else if ( reason == 403 )
							{
								dynamicHTML += '<td>' + "reg_auth_fail".i18n() + '</td>';
							}
							else if ( reason == 715 )
							{
								dynamicHTML += '<td>' + "reg_timeout".i18n() + '</td>';
							}
							else if ( reason >= 300 && reason <= 600)
							{
								dynamicHTML += '<td>' + "servererrresponding".i18n() + '</td>';
							}
							else
							{
								dynamicHTML += '<td>' + "unknown_err".i18n() + '</td>';
							}
						}
					}
				}
			}
			else
			{
				dynamicHTML += '<td>' + "reg_fail".i18n() + '</td>';
				dynamicHTML += '<td>' + "novoiceconn".i18n() + '</td>';
			}
			
			dynamicHTML += '</tr>';
		}
	}

	$("#voice_info").html(dynamicHTML);
}
