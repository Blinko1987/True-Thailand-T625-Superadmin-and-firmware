$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	$('#upload_button').click(function(){
		//valid check
		if ( $('form')[0].uploadfile.value == '' || $('form')[0].uploadfile.value == undefined )
		{
			alert("请选择文件");
			return false;
		}
		
		if ( $("#path").val() == '' )
		{
			alert("上传路径不能为空");
			return false;
		}
		
		$("#file_form").attr("action", "../cgi-bin/ajax?method=upload&action=commonfile&path=" + $("#path").val());
		showOrHideLoadingWindowFromIframe("show");
	});
	
	var options = {
		success:completeHandler
	};
	$("#file_form").submit( function(){  
		$(this).ajaxSubmit(options);  
		return false;//阻止表单默认提交
	});
});


// 默认升级成功
var upgrade_result = 1;
var resultshowed = false;
var parentObj = window.parent.document;
function completeHandler(returnData, statusText)
{
	if ( statusText != "success" )
	{
		errorHandler();
		return;
	}
	returnData = JSON.parse(returnData);
	
	// enum
	// {
		// UNSUPPORT_CONTENTTYPE = -2,
		// BEGIN_STATUS = -1,
		// UPLOADCGI_SUCCESS = 0,            //0
		// UPLOADCGI_GENERAL_ERROR,
		// INIT_MODULE_ERROR,
		// DESTROY_MODULE_ERROR,
		// REQUEST_METHOD_ERROR,
		// CONTENT_TYPE_ERROR,         //5
		// CONTENT_LENGTH_ERROR,
		// INVALID_VARIABLE_ERROR,
		// NO_VARIABLE_ERROR,
		// MIN_CONTENT_LENGTH_ERROR,
		// MAX_CONTENT_LENGTH_ERROR,   //10
		// FOPEN_LOG_ERROR,
		// FOPEN_FW_ERROR,
		// OPERATE_FW_ERROR,
		// FILE_TYPE_ERROR,
		// FILE_SIZE_ERROR,            //15
		// FILE_PRODUCT_ERROR,
		// FILE_CRC_ERROR,
		// FILE_UPLOAD_ERROR,
		// PATH_NOT_EXIST_ERROR,
		// PATH_READONLY_ERROR, //20
		// END_STATUS
	// };
	
	var uploadsuccess = false;
	var errmsg = "";
	if ( returnData )
	{
		if ( returnData.error_code != null && returnData.error_code != undefined )
		{
			if ( returnData.error_code == 19 )
			{
				errmsg = "路径" + $("#path").val() + "不存在";
			}
			else if ( returnData.error_code == 20 )
			{
				errmsg = "路径" + $("#path").val() + "是只读的";
			}
		}
		
		if ( returnData.uploadStatus != null
			&& returnData.uploadStatus != undefined
			&& returnData.uploadStatus == 1 )
		{
			uploadsuccess = true;
		}
	}

	if ( false == uploadsuccess )
	{
		errorHandler(errmsg);
	}
	else
	{
		showOrHideLoadingWindowFromIframe("hide");
		alert("上传成功");
	}
	return;
}


function errorHandler(msg)
{
	var showmessage = "文件上传出错，请重试";
	
	if ( msg != undefined && msg != "" )
	{
		showmessage = msg;
	}
	
	ptweblog("upload error");
	showOrHideLoadingWindowFromIframe("hide");
	alert(showmessage);
}
