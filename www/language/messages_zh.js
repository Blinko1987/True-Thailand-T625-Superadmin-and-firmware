(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "../jquery.validate"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
$.extend($.validator.messages, {
	required: "必须填写",
	remote: "请修正此栏位",
	email: "请输入有效的电子邮件",
	ipv4: "请输入有效的IPv4地址",
	subnetMask: "请输入有效的子网掩码",
	nocn: "不能包含中文",
	ipv6: "请输入有效的IPv6地址",
	mac: "请输入有效的MAC地址",
	url: "请输入有效的网址",
	date: "请输入有效的日期",
	dateISO: "请输入有效的日期 (YYYY-MM-DD)",
	number: "请输入正确的数字",
	digits: "只可输入数字",
	creditcard: "请输入有效的信用卡号码",
	equalTo: "你的输入不相同",
	extension: "请输入有效的后缀",
	maxlength: $.validator.format("最多 {0} 个字"),
	minlength: $.validator.format("最少 {0} 个字"),
	rangelength: $.validator.format("请输入长度为 {0} 至 {1} 之间的字串"),
	range: $.validator.format("请输入 {0} 至 {1} 之间的数值"),
	range_int: $.validator.format("请输入 {0} 至 {1} 之间的整数"),
	max: $.validator.format("请输入不大于 {0} 的数值"),
	min: $.validator.format("请输入不小于 {0} 的数值")
});

}));

var ssidRequiredHint = "请输入SSID";
var passwordRequiredHint = "请输入密码";

//common error message
var maxLength32 = "最长32位";
var maxLength31 = "最长31位";