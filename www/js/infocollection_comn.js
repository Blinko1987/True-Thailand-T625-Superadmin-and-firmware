var tokenstr = "";
var bartimer;

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	XHR.get("get_operator", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
});

function infocollect(type)
{
	cleanPopWindowContentFromIframe();
	var parentObj = window.parent.document;
	
	//填充内容
	$("#pop_window_title", parentObj).html("infocollection".i18n());
	$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
	$("#pop_window_message", parentObj).html("infoisbeingcollected".i18n());
	$("#pop_window_option", parentObj).hide();
	showOrHidePopWindowFromIframe("show");
	
	var postdata = new Object();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	postdata.type = type;
	XHR.post("start_infocollect_process", postdata, null);
	
	bartimer = window.setInterval(function(){checkInfoCollectStatus();},3000);
}


function checkInfoCollectStatus()
{
	XHR.get("get_infocollect_status", null, parseInfoCollectData);
}

function parseInfoCollectData(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	if ( data )
	{
		if (data.infocollect_status == "export_timeout")
		{
			window.clearInterval(bartimer);
			var parentObj = window.parent.document;
			$("#confirm", parentObj).hide();
			$("#cancel", parentObj).html("confirm".i18n());
			$("#cancel", parentObj).css("background-color","#3E6CA6");
			$("#cancel", parentObj).css("border-radius", "20px");
			$("#pop_window_option", parentObj).show();
			$("#pop_window_message", parentObj).html("infocollecttimeout".i18n());
		}
		else if (data.infocollect_status == "export_processing")
		{
			var parentObj = window.parent.document;
			$("#pop_window_message", parentObj).html("");
			setTimeout(function(){$("#pop_window_message", parentObj).html("infoisbeingcollected".i18n());}, 100);
		}
		else if (data.infocollect_status == "export_complete")
		{
			window.clearInterval(bartimer);
			var parentObj = window.parent.document;
			$("#confirm", parentObj).hide();
			$("#cancel", parentObj).html("confirm".i18n());
			$("#cancel", parentObj).css("background-color","#3E6CA6");
			$("#cancel", parentObj).css("border-radius", "20px");
			$("#pop_window_option", parentObj).show();
			$("#pop_window_message", parentObj).html("infocollectcomplete".i18n());
		}
		else if (data.infocollect_status == "export_start")
		{
			window.clearInterval(bartimer);
			var parentObj = window.parent.document;
			$("#pop_window_message", parentObj).html("");
			setTimeout(function(){$("#pop_window_message", parentObj).html("infoisbeingcollected".i18n());}, 100);
			
			downloadFile();
			
			setTimeout(function(){bartimer = window.setInterval(function(){checkInfoCollectStatus();},3000);}, 5000);
			
		}
	}
}


function downloadFile()
{
	window.location="../cgi-bin/download?" + "infocollect";
}



