var tokenstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/schedule_reboot_info", initPage);
	}
	else
	{
		XHR.get("get_schedule_reboot", null, initPage);
	}
});

function initPage(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	
	setCheckbox("Enable_checkbox", "0");
	setCheckbox("everyday_checkbox", "0");
	for (let i=0; i<=6; i++)
	{
		$("#checkbox_" + i).prop("checked", false);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
	
	if (data.Enable == "1")
	{
		setCheckbox("Enable_checkbox", "1");
	}
	else
	{
		setCheckbox("Enable_checkbox", "0");
	}
	
	if (data.weekDays == "*")
	{
		setCheckbox("everyday_checkbox", "1");
		for (let i=0; i<=6; i++)
		{
			$("#checkbox_" + i).prop("checked", true);
		}
	}
	else
	{
		setCheckbox("everyday_checkbox", "0");
		
		let weekdayarr = data.weekDays.split(',');
		for (let i=0; i<weekdayarr.length; i++)
		{
			$("#checkbox_" + weekdayarr[i]).prop("checked", true);
		}
	}
	$("#hour_select").val(data.hour);
	$("#minute_select").val(data.minute);	
	
	clickenable();
}

function clickenable()
{
	if ($("#Enable_checkbox").attr("checked"))
	{
		$("#setting_div").show();
	}
	else
	{
		$("#setting_div").hide();
	}
}

function clickeveryday()
{
	if ($("#everyday_checkbox").attr("checked"))
	{
		for (let i=0; i<=6; i++)
		{
			$("#checkbox_" + i).prop("checked", true);
		}
	}
	else
	{
		for (let i=0; i<=6; i++)
		{
			$("#checkbox_" + i).prop("checked", false);
		}
	}
}

function clickweekday()
{
	let num = 0;
	for (let i=0; i<=6; i++)
	{
		if($("#checkbox_" + i).attr("checked"))
		{
			num++;
		}
	}
	
	if (num == 7)
	{
		setCheckbox("everyday_checkbox", "1");
	}
	else
	{
		setCheckbox("everyday_checkbox", "0");
	}
}


function saveApply()
{
	var postdata = new Object();
	postdata.Enable = $("#Enable_checkbox").attr("checked") ? "1" : "0";
	
	if ($("#everyday_checkbox").attr("checked"))
	{
		postdata.weekDays  = "*";
	}
	else
	{
		let i=0;
		let weekdaystr = "";
		for (i=0; i<=6; i++)
		{
			if ($("#checkbox_" + i).attr("checked"))
			{
				if (weekdaystr == "")
				{
					weekdaystr += i;
				}
				else
				{
					weekdaystr += ",";
					weekdaystr += i;
				}
			}
		}
		postdata.weekDays  = weekdaystr;
	}
	
	if (postdata.Enable == "1" && postdata.weekDays == "")
	{
		alert("pleaseselectdays".i18n());
		return;
	}
	
	postdata.hour  = $("#hour_select").val();
	postdata.minute  = $("#minute_select").val();
	
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_schedule_reboot", postdata, reloadSaveData);
	showOrHideLoadingWindowFromIframe("show");
}

function reloadSaveData(data)
{
	if(data)
	{
		initPage(data);
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}

function cancelApply()
{
	window.location.href = "./schedulereboot_comn.html";
}
