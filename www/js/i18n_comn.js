var i18nResource = '';
// getDataByAjax("../language/i18n_zh-cn", runI18n);

var gI18n = "";
if ( gI18n == '' )
{
	if ( parent.gI18n != '' )
	{
		gI18n = parent.gI18n;
	}
	else
	{
		if ( gDebug ) //调试模式读取本地数据
		{
			getDataByAjax("../fake/web_config", parseI18n);
		}
		else
		{
			XHR.get("get_web_config", null, parseI18n);
		}
	}
}
function parseI18n(data)
{
	if ( data && data.i18n != undefined )
	{
		gI18n = data.i18n;
	}
	
	if ( gI18n == '' ) // if get i18n failed or i18n null, set to default
	{
		gI18n = "en_gb"; //default
	}
}

//get i18n resource
if ( i18nResource == '' )
{
	if ( parent.i18nResource != '' )
	{
		i18nResource = parent.i18nResource;
	}
	else
	{
		$.ajax({
			url : '../language/i18n_' + gI18n,
			dataType : 'json',
			type : "GET",
			async: false,
			success : function(returndata, textStatus, jqXHR){
				i18nResource = returndata;
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {  
				ptweblog("get i18n resource failed");
			}
		});
	}
}

$(document).ready(function(){
	runI18n(); //handle html
});

/**
 * 替换国际化消息
 * @param ms 消息对象
 */
function runI18n(){
	$("*[i18n]").each(function(){
		var o = $(this);
		var key = o.attr("i18n");//获取key
		var setTarget = o.attr("i18n-set");//获取消息设置目标
		var message = _getI18n(key);//取得消息
		switch(setTarget){//根据不同目标设置到不同的地方
			case undefined:
				o.html(message);
				break;
			case "append":
				o.html(o.html() + message);
				break;
			case "html":
				o.html(message);
				break;
			case "value":
				o.val(message);
				break;
			default:
				o.attr(val, message);
				break;
		}
		o.removeAttr("i18n");//移除属性，避免二次处理
		o.removeAttr("i18n-set");
	});
}

/**
 * 获取多语言值
 * @param key 多语言key
 * @returns value 多语言值
 */
function _getI18n(key){
	var message = '';
	
	if ( i18nResource[key] != undefined && i18nResource[key] != '' )
	{
		message = i18nResource[key];
	}
	else
	{
		message = key;
	}
	
	return message;
}

/**
 * 为String提供i18n方法获取多语言消息
 * @return value 多语言值
 */
String.prototype.i18n = function(){
	return _getI18n(String(this));
}