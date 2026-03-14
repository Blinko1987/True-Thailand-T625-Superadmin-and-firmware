var tokenstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	showOrHideLoadingWindowFromIframe("show");
	
	initPage();
});


function initPage()
{
	if(gDebug)
	{
		getDataByAjax("../fake/wlanHopping", fillData);
	}else{
		XHR.get("get_wlanHopping", null, fillData);
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
		if(data.wlanHopping2g == "1")
		{
			setCheckbox("WLANHopping_checkbox_2g", "1");
		}
		else
		{
			setCheckbox("WLANHopping_checkbox_2g", "0");
		}
		if(data.wlanHopping5g == "1")
		{
			setCheckbox("WLANHopping_checkbox_5g", "1");
		}
		else
		{
			setCheckbox("WLANHopping_checkbox_5g", "0");
		}
	}
}


function saveApply()
{
	var postdata = new Object();
	
	postdata.wlanHopping2g = getCheckbox("WLANHopping_checkbox_2g");
	postdata.wlanHopping5g = getCheckbox("WLANHopping_checkbox_5g");
	
	showOrHideLoadingWindowFromIframe("show");
	if(gDebug){
		postDataByAjax("../fake/wlanHopping", data, options)
	}else{
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				tokenstr = data.token;
			}
		});
		postdata.token = tokenstr;
		XHR.post("set_wlanHopping", postdata, reloadSaveData);
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





