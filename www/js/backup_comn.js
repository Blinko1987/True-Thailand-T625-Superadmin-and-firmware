var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	$(':submit').click(function(){
		if ( $('form')[0].upgradefile.value == '' || $('form')[0].upgradefile.value == undefined )
		{
			alert("pleaseselupdatefile".i18n());
			return false;
		}
		
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		
		//填充内容
		$("#pop_window_title", parentObj).html("updatereminder".i18n());
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("The device is being upload file....");
		$("#pop_window_option", parentObj).hide();
		showOrHidePopWindowFromIframe("show");

	});
	
	var options = {
		success:completeHandler
	};
	
	$("#upgrade_form").submit( function(){
		$(this).ajaxSubmit(options);
		return false;//阻止表单默认提交
	});
});

function completeHandler(returnData, statusText)
{
	if ( statusText != "success" )
	{
		errorHandler();
		return;
	}
	returnData = JSON.parse(returnData);
	
	if ( returnData && returnData.uploadStatus != null && returnData.uploadStatus != undefined && returnData.uploadStatus == "UPLOADSUCCESS" )
	//if ( returnData &&  returnData.indexOf("UPLOADSUCCESS") >= 0 )
	{	
	
		var parentObj = window.parent.document;
	
		$("#pop_window_message", parentObj).html("Upload file success, next is update....");
	
		var postdata = new Object();
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		postdata.action = "cfgrestore";
		postdata.filesavename = returnData.filesavename;
		XHR.post("set_cfg_retore", postdata, parseresponse);
		//jumpToLoginPage(true);
	}
	else
	{
		cleanPopWindowContentFromIframe();
		showOrHidePopWindowFromIframe("hide");
		alert("Upload file failed!");
	}
}

function errorHandler()
{
	ptweblog("upload error");
	alert("updatefail".i18n());
}

function parseresponse(getdata)
{	
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata)
	{
		if(getdata.result == "success")
		{
			var parentObj = window.parent.document;
			$("#pop_window_message", parentObj).html("Update settings succeed, the router is rebooting...");
			
			var postdata = new Object();
			XHR.get("get_operator", null, function(data){
				if ( data )
				{
					tokenstr = data.token;
				}
			});
			postdata.token = tokenstr;
			jumpToLoginPage(true);
			XHR.post("reboot", postdata, null);
		}
		else
		{
			cleanPopWindowContentFromIframe();
			showOrHidePopWindowFromIframe("hide");
			alert("Update settings failed!");
		}
	}
}


function reloadresponse(getdata)
{	
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata)
	{
		if(getdata.result == "success")
		{
			window.location="../cgi-bin/download?" + "bfwcfg";
		}
		else
		{
			alert("Backup Fail!");
		}
	}
}


function downloadsettings()
{
	var postdata = new Object();
	postdata.action = "cfgbackup";
	
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_cfg_backup", postdata, reloadresponse);
	showOrHideLoadingWindowFromIframe("show");
}


function restore_factory()
{
	cleanPopWindowContentFromIframe();
	var parentObj = window.parent.document;
	//填充内容
	$("#pop_window_title", parentObj).html("restorefacconfirm".i18n());
	$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_help"></div>');
	$("#pop_window_message", parentObj).html("restorefacconfirm_hint".i18n());
	
	showOrHidePopWindowFromIframe("show");
	
	//更改确认操作函数
	var eid = parentObj.getElementById("confirm");
	eid.onclick = function(){
		showOrHidePopWindowFromIframe("hide");
		
		showOrHideLoadingWindowFromIframe("show");
		$("#progress_div").show();
		
		var processbar = document.getElementById("progress_bar");
		processbar.style.width = "30%";
		processbar.innerHTML = processbar.style.width;
		$("#progress_hint").html("restorefactoryinghint".i18n());
		
		setTimeout(function(){ 
			processbar.style.width = "60%";
			processbar.innerHTML = processbar.style.width;
			
			setTimeout(function(){ 
				processbar.style.width = "100%";
				processbar.innerHTML = processbar.style.width;
				$("#progress_hint").html("restorefacsuccrebooting_hint".i18n());
				
				var postdata = new Object();
				XHR.get("get_operator", null, function(data){
					if ( data )
					{
						tokenstr = data.token;
					}
				});
				postdata.token = tokenstr;
				jumpToLoginPage(true);
				XHR.post("restore_long", postdata, null);
				
			}, 1000);
			
		}, 1000);

	};
}

function reloadData(responseData)
{
	if ( responseData.success != "true")
	{
		//alert("restorefactoryfail".i18n());
		$("#progress_hint").html("restorefactoryfail".i18n());
		$("#progress_hint").css("color", "red");
	}
	else
	{
		/* cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		//填充内容
		$("#pop_window_title", parentObj).html("restorefactoryreminder".i18n());
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
		$("#pop_window_message", parentObj).html("isrestorefactory_hint".i18n());
		$("#pop_window_option", parentObj).hide();
		showOrHidePopWindowFromIframe("show"); */
		
		//XHR.post("reboot", null, null);
		$("#progress_hint").html("restorefacsuccrebooting_hint".i18n());
		jumpToLoginPage(true);
	}
}






