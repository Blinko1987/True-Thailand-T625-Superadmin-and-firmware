var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/qos_app", initPage);
	}
	else
	{
		XHR.get("get_qos_app", null, initPage);
	}
});

var addindex = '';
var qos_app_num = 4;
var queue_num = 8;

function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.token != undefined )
		{
			tokenstr = getdata.token;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	var dynamicHTML = '';
	var dynamicHTMLQUEUE = '';
	
	if (getdata && getdata.qos)
	{
		addindex = '';
		var j = 0;
		qosdata = getdata.qos;
		
		for (var i=1; i<=queue_num; i++ )
		{
			if ( eval("qosdata.Q" + i) == 1)
			{
				dynamicHTMLQUEUE += '<option value="'+ eval(i) +'">Q'+ eval(i) +'</option>';
			}
		}
		$("#ClassQueue").html(dynamicHTMLQUEUE);
		
		for (var i=1; i<=qos_app_num; i++ )
		{
			if ( eval("qosdata.AppName" + i) != '' && eval("qosdata.AppName" + i) != undefined && eval("qosdata.ClassQueue" + i) != '' && eval("qosdata.ClassQueue" + i) != undefined)
			{
				j = j + 1;
				
				if (j%2 == 1)
				{
					var trclass = "oddtr";
				}
				else
				{
					var trclass = "eventr";
				}
			
				dynamicHTML += '<tr class="'+ trclass +'">';
				dynamicHTML += '<td>' + eval("qosdata.AppName" + i) + '</td>';
				dynamicHTML += '<td>Q' + eval("qosdata.ClassQueue" + i) + '</td>';
				dynamicHTML += '<td><input type="button" class="input_button_small input_button_heightwidth_unset" value="'+ "delete".i18n() +'" onclick=deleteApp(' + i + ') /></td>';
				dynamicHTML += '</tr>';
			}
			else
			{
				if ( addindex == '' )
				{
					addindex = i;
				}
			}
		}
	}
	
	if (j == 0)
	{
		dynamicHTML += '<tr><td colspan="3" align="center">' + "nodata".i18n() + '</td></td>';
	}
	
	$("#apps").html(dynamicHTML);
	
	displayControl();
}

function displayControl()
{
	if ( addindex == '' )
	{
		$("#adddiv").hide();
	}
	else
	{
		$("#adddiv").show();
	}
}

function deleteApp(index)
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.index = index;
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_qos_app", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
	
}
function addApp()
{
	var postdata = new Object();
	postdata.action = "add";
	postdata.AppName = $("#AppName").val();
	postdata.ClassQueue = $("#ClassQueue").val();
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_qos_app", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

