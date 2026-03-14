var tokenstr = "";
var inOutValue = new Array(Math.pow(2, 0), Math.pow(2, 1), Math.pow(2, 2), Math.pow(2, 3), Math.pow(2, 9), Math.pow(2,12));
var inOutName = new Array("LAN1", "LAN2", "LAN3", "LAN4", "PON", "CPU");

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	constructPage();
	
	$("input:[name='switch']").bind("click", function(){
		displayControl();
	});
	
	showOrHideLoadingWindowFromIframe("show");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/port_mirror", initPage);
	}
	else
	{
		XHR.get("get_port_mirror", null, initPage);
	}
});

function displayControl()
{
	if ( getRadio("switch") == 1 )
	{
		$("#mirrordiv").show();
		$("#directiondiv").show();
		$("#catchdiv").show();
	}
	else
	{
		$("#mirrordiv").hide();
		$("#directiondiv").hide();
		$("#catchdiv").hide();
	}
}

function constructPage()
{
	var dynamicMirrorHTML = '';
	for( var i=0; i<inOutValue.length; i++ )
	{
		dynamicMirrorHTML += "<input type='checkbox' name='mirrorport' id='mirrorport" + i + "' value=" + inOutValue[i] + " />" + inOutName[i] + "&nbsp;&nbsp;";
	}
	$("#mirror").html(dynamicMirrorHTML);
}

function initPage(getdata)
{
	if ( getdata.token != undefined )
	{
		tokenstr = getdata.token;
	}
	//清除上次的数据
	$("input[name='mirrorport']").each(function(){
		setCheckbox(this.id, 0);
	});
	$("#direction").val();
	$("#catch").val();
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( getdata )
	{
		if (getdata.mirrorValue != '' && getdata.mirrorValue != undefined)
		{
			var mirrorArray = parseInt(getdata.mirrorValue,10).toString(2).split("").reverse();
			for ( var i=0; i<mirrorArray.length; i++ )
			{
				if ( mirrorArray[i] != '' && mirrorArray[i] != undefined && mirrorArray[i] != '0')
				{	
					$("input[name='mirrorport']").each(function(){
						if ( $(this).val() == Math.pow(2,i) )
						{
							setCheckbox(this.id, 1);
						}
					});
				}
			}
		}
		setRadio("switch", getdata.enable);
		$("#direction").val(getdata.directionValue);
		$("#catch").val(getdata.catchValue);
	}
	displayControl();
}


function saveApply()
{	
	var postdata = new Object();
	
	var mirrorValue = 0;
	$("input[name='mirrorport']").each(function(){
		if ( getCheckbox(this.id) )
		{
			mirrorValue = parseInt(mirrorValue) + parseInt($(this).val());
		}
	});
	
	//postdata.mirrorValue = parseInt(mirrorValue,10).toString(2);
	postdata.mirrorValue = parseInt(mirrorValue,10);
	postdata.directionValue = $("#direction").val();
	postdata.catchValue = $("#catch").val();
	postdata.enable = getRadio("switch");
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_port_mirror", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

