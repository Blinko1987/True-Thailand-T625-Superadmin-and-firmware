#!/bin/sh
echo "Content-type: text/html"

if [ "${REQUEST_METHOD}" == "POST" ]; then
 LINE=`./cgi-bin/getpostdata.cgi $CONTENT_LENGTH`
 [ "x$LINE" == "x" ] && READERR=1
 [ "x$LINE" != "x" ] && QUERY_STRING=$LINE
 [ "x$LINE" != "x" ] && LINE=`./cgi-bin/urldecode.cgi $LINE`
 upstr=$(echo $LINE | busybox tr '[a-z]' '[A-Z]')
 gstr1=$(echo $upstr | grep "<SCRIPT>")
 gstr0=$(echo $upstr | grep "ALERT")
 if [ -n "$gstr1" ] || [ -n "$gstr0" ]; then
	exit 0
 fi
fi 
if [ "${REQUEST_METHOD}" == "GET" ]; then
   upstr=$(echo $QUERY_STRING | busybox tr '[a-z]' '[A-Z]') 
   gstr2=$(echo $upstr | grep "<SCRIPT>")
   gstr0=$(echo $upstr | grep "ALERT")
   if [ -n "$gstr2" ] || [ -n "$gstr0" ]; then
	exit 0
   fi
fi

paramIndex="1"
CGIParam=`echo "$LINE&" | cut -d '&' -f $paramIndex`
while [ "$CGIParam" != "" ]; do
	par=`echo "$CGIParam" | cut -d '=' -f 1`
	val=`echo "$CGIParam" | cut -d '=' -f 2`
	if [ "$val" != "" ]; then
		case $par
			in
			"username")
			USERNAME=$val
			;;
			"psd")
			PASSWORD=$val
			;;
		esac
	fi
	paramIndex=$((paramIndex+1))
	CGIParam=`echo "$LINE&" | cut -d '&' -f $paramIndex`
done
 
RETURNDATA=`./cgi-bin/ajax "jump_login" $USERNAME $PASSWORD`

echo "
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset=\"utf-8\">
		<script src=\"./js/jquery.js\"></script>
		<script src=\"./js/xhr_comn.js\"></script>
		<script>
/*			
			var postdata = new Object();
			postdata.username = \"${USERNAME}\";
			postdata.password = \"${PASSWORD}\";
			postdata.sessionid = \"${SESSIONIDSTR}\";
			postdata.token = navigator.userAgent;
			XHR.post(\"do_login\", postdata, parseLoginData);
*/
            parseLoginData($RETURNDATA);
			function parseLoginData(data)
			{
				var login = false;
				if (data)
				{
					if ( data.login_result == 0 )//校验成功
					{
						login = true;
					}
					else if ( data.login_result == 1 )
					{
						alert(\"当前已有用户在别处登录，请稍后登录\");
					}
					else if ( data.login_result == 2 )
					{
						alert(\"您的连续错误登陆次数已经达到3次，请1分钟后再试\");
					}
					else if ( data.login_result == 3 )
					{
						alert(\"电信维护帐号已被禁用，请另选帐号登录\");
					}
					else if ( data.login_result == 4 )
					{
						alert(\"用户名或密码错误，请重试\");
					}
					else
					{
						alert(\"未知错误\");
					}
				}
				else
				{
					alert(\"未知错误\");
				}
				
				if ( login == true )
				{
					window.location.href=\"./html/main.html\";
				}
				else
				{
					window.location.href=\"./index.html\";
				}
			}
		</script>
	</head>
	<body>
	</body>
	</html>
"
