var tokenstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	showOrHideLoadingWindowFromIframe("show");
	
	$("#BS_Enable_Chk").bind("click", function(){
		thresholdshoworhide();
	});
	
	initPage();
});


function initPage()
{
	if(gDebug)
	{
		getDataByAjax("../fake/bandsteering", fillData);
	}else{
		XHR.get("get_BandSteering", null, fillData);
	}
}


function fillData(data)
{
	if ( data.token != undefined )
	{
		tokenstr = data.token;
	}
	showOrHideLoadingWindowFromIframe("hide");
	if(data)
	{
		if(data.enable1 == "1" && data.enable5 == "1")
		{
			setCheckbox("BS_Enable_Chk", "1");
		}
		else
		{
			setCheckbox("BS_Enable_Chk", "0");
		}
		
		$("#BS_threshold_1").val(data.threshold1);
		$("#BS_threshold_5").val(data.threshold5);
	
		for (var i=1; i<=8; i++)
		{
			if(eval("data.active"+i) == "1")
			{
				$("#BS_active_"+i).text("active".i18n());
			}
			else
			{
				$("#BS_active_"+i).text("inactive".i18n());
			}
		}
		
		thresholdshoworhide();
	}
}


function saveApply()
{
	var postdata = new Object();
	
	postdata.enable = getCheckbox("BS_Enable_Chk");
	postdata.threshold1 = $("#BS_threshold_1").val();
	postdata.threshold5 = $("#BS_threshold_5").val();
	
	showOrHideLoadingWindowFromIframe("show");
	if(gDebug){
		postDataByAjax("../fake/bandstrring", data, options)
	}else{
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("set_BandSteering", postdata, reloadSaveData);
	}
}

function reloadSaveData(data)
{
	if(data)
	{
		fillData(data);
		
		$("#save_window_div", window.parent.document).fadeIn();
		$("#save_window_div", window.parent.document).fadeOut(2000);
	}
}

function thresholdshoworhide()
{
	if (getCheckbox("BS_Enable_Chk"))
	{
		$("#rssithreshold_div").show();
		$("#status_tab").show();
	}
	else
	{
		$("#rssithreshold_div").hide();
		$("#status_tab").hide();
	}
}



