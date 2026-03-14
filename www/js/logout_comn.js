$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
});


function doLogout()
{
	cleanPopWindowContentFromIframe();
	var parentObj = window.parent.document;
	//填充内容
	$("#pop_window_title", parentObj).html("logout_confirm".i18n());
	$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_help"></div>');
	$("#pop_window_message", parentObj).html("logout_hint".i18n());
	
	//更改确认操作函数
	var eid = parentObj.getElementById("confirm");
	eid.onclick = function() { realLogout() };
	
	showOrHidePopWindowFromIframe("show");
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
		top.location.href = ('https:' == document.location.protocol ? 'https://' : 'http://') + document.location.host;
	});
}

