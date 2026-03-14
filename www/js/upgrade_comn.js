var tokenstr = "";
var bartimer;

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
			alert("pleaseselfile".i18n());
			return false;
		}
	});
	
	var options = {
		success:null
	};
	
	$("#upgrade_form").submit( function(){
		$("#upgrade_form").hide();
		$("#progress_div").show();
		setTimeout(function(){
			//check upgrade result every 2 seconds
			checkUpgradeResult();
			bartimer = window.setInterval(function(){checkUpgradeResult();},2000);
			},2000
		);
		showOrHideLoadingWindowFromIframe("show");
		$(this).ajaxSubmit(options);
		return false;//阻止表单默认提交
	});
});

function checkUpgradeResult()
{
	XHR.get("get_upgrade_result", null, parseUpgradeData);
}

function parseUpgradeData(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	if ( data )
	{
		if (data.status == "upgrading")
		{
			var processbar = document.getElementById("progress_bar");
			processbar.style.width = data.percent + "%";
			processbar.innerHTML = processbar.style.width;
			
			$("#progress_hint").html("upgradinghint".i18n());
		}
		else if (data.status == "complete")
		{
			var processbar = document.getElementById("progress_bar");
			processbar.style.width = "100%";
			processbar.innerHTML = processbar.style.width;
		
			$("#progress_hint").html("upgradesuccrebooting_hint".i18n());
			
			window.clearInterval(bartimer);
			
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
		else if (data.status == "failed")
		{
			showOrHideLoadingWindowFromIframe("hide");
			$("#progress_hint").html("upgradefail".i18n());
			$("#progress_hint").css("color", "red");
			window.clearInterval(bartimer);
			$("#retry_div").show();
		}
	}
}

function retryUpgrade()
{
	$('form')[0].upgradefile.value = "";
	window.location.reload();
}


