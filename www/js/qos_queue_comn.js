var tokenstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	$("#Plan").bind("click", function(){
		displayControl();
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/qos_queue", initPage);
	}
	else
	{
		XHR.get("get_qos_queue", null, initPage);
	}
});

var queue_num = 8;
var queuearray = new Array();

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
	
	var dynamicHTMLPQ = '';
	var dynamicHTMLWRR = '';
	
	if (getdata && getdata.qos )
	{
		var qosdata = getdata.qos;
		$("#Plan").val(qosdata.Plan);
		$("#Bandwidth").val(qosdata.Bandwidth);
		$("#Enable8021P").val(qosdata.Enable8021P);
		setCheckbox("EnableDSCPMark", qosdata.EnableDSCPMark);
		
		addindex = '';
		var j = 0;
		for (var i=1; i<=queue_num; i++ )
		{
			if ( eval("qosdata.Q" + i) == 1)
			{
				queuearray[i-1] = 1; 
			
				j = j + 1;
				
				if (j%2 == 1)
				{
					var trclass = "oddtr";
				}
				else
				{
					var trclass = "eventr";
				}
			
				//priority_table
				dynamicHTMLPQ += '<tr class="'+ trclass +'">';
				dynamicHTMLPQ += '<td>Q' + eval(i) + '</td>';
				dynamicHTMLPQ += '<td><select id="priority'+ eval(i) +'" class="select_in_table"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select></td>';
				dynamicHTMLPQ += '<td><input type="checkbox" id="priority_enable'+ eval(i) +'" style="margin-top:0;" /></td>';
				dynamicHTMLPQ += '<td><input type="button" class="input_button_small input_button_heightwidth_unset" value="'+ "delete".i18n() +'" onclick=deletequeue(' + i + ') /></td>';
				dynamicHTMLPQ += '</tr>';
				
				//weight_table
				dynamicHTMLWRR += '<tr class="'+ trclass +'">';
				dynamicHTMLWRR += '<td>Q' + eval(i) + '</td>';
				dynamicHTMLWRR += '<td><input type="text" class="input_short" id="weight'+ eval(i) +'"/></td>';
				dynamicHTMLWRR += '<td><input type="checkbox" id="weight_enable'+ eval(i) +'" style="margin-top:0;" /></td>';
				dynamicHTMLWRR += '<td><input type="button" class="input_button_small input_button_heightwidth_unset" value="'+ "delete".i18n() +'" onclick=deletequeue(' + i + ') /></td>';
				dynamicHTMLWRR += '</tr>';

			}
			else
			{
				queuearray[i-1] = 0; 
				
				if ( addindex == '' )
				{
					addindex = i;
				}
			}
		}
		
		if (j == 0)
		{
			dynamicHTMLPQ += '<tr><td colspan="4" align="center">' + "nodata".i18n() + '</td></td>';
			dynamicHTMLWRR += '<tr><td colspan="4" align="center">' + "nodata".i18n() + '</td></td>';
		}
		
		$("#priority_table2").html(dynamicHTMLPQ);
		$("#weight_table2").html(dynamicHTMLWRR);
		
		for (var i=1; i<=queue_num; i++ )
		{
			if ( eval("qosdata.Q" + i) == 1)
			{
				$("#priority" + i).val(eval("qosdata.Priority" + i));
				$("#weight" + i).val(eval("qosdata.Weight" + i));
				setCheckbox("priority_enable"+i, eval("qosdata.Enable" + i));
				setCheckbox("weight_enable"+i, eval("qosdata.Enable" + i));
			}
		}
	}
	
	displayControl();
}

function displayControl()
{
	if ($("#Plan").val() == "priority")
	{
		$("#priority_table").show();
		$("#priority_table2").show();
		$("#weight_table").hide();
		$("#weight_table2").hide();
	}
	else
	{
		$("#priority_table").hide();
		$("#priority_table2").hide();
		$("#weight_table").show();
		$("#weight_table2").show();
	}
	
	if ( addindex == '' )
	{
		$("#adddiv").hide();
	}
	else
	{
		$("#adddiv").show();
	}
}

function extraValidCheck()
{
	if ( $("#Bandwidth").val() == '' || ! isValidInteger($("#Bandwidth").val()) || $("#Bandwidth").val() < 0 )
	{
		alert("totalbandwidthcheck".i18n());
		return false;
	}
	
	if ($("#Plan").val() == "priority")
	{
		for ( var i=1; i<=queue_num; i++ )
		{
			if (queuearray[i-1] == 1)
			{
				for ( var j=1; j<=queue_num; j++ )
				{
					if (queuearray[j-1] == 1)
					{
						if ( j != i && $("#priority" + i).val() == $("#priority" + j).val() )
						{
							alert("queueproiritycheck".i18n());
							return false;
						}
					}
				}
			}
			
		}
	}
	else
	{
		var totalweight = 0;
		for ( var i=1; i<=queue_num; i++ )
		{
			if (queuearray[i-1] == 1)
			{
				if ( ! isInValidNumRange($("#weight" + i).val(), 0, 100) )
				{
					alert("singlequeueweightcheck".i18n());
					return false;
				}
				totalweight += parseInt($("#weight" + i).val());
			}
		}
		if ( totalweight != 100 )
		{
			alert("allqueueweightcheck".i18n());
			return false;
		}
	}
	return true;
}

function deletequeue(index)
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
	XHR.post("set_qos_queue", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
	
}

function addqueue()
{
	var postdata = new Object();
	postdata.action = "add";
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_qos_queue", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function saveApply()
{
	if ( ! extraValidCheck() )
	{
		return;
	}
	
	var postdata = new Object();
	postdata.action = "modify";
	postdata.Plan = $("#Plan").val();
	postdata.Bandwidth = $("#Bandwidth").val();
	postdata.Enable8021P = $("#Enable8021P").val();
	postdata.EnableDSCPMark = getCheckbox("EnableDSCPMark");
	for (var i=1; i<=8; i++ )
	{
		if (queuearray[i-1] == 1)
		{
			if ( $("#Plan").val() == "priority" )
			{
				postdata["Priority" + i] = $("#priority" + i).val();
				postdata["Enable" + i] = getCheckbox("priority_enable" + i);
			}
			else
			{
				postdata["Weight" + i] = $("#weight" + i).val();
				postdata["Enable" + i] = getCheckbox("weight_enable" + i);
			}
		}
	}
	XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
	postdata.token = tokenstr;
	XHR.post("set_qos_queue", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

