#!/bin/sh
echo Content-type: text/html
echo

if [ -n "$QUERY_STRING" ]; then
	for paramIndex in 1
	do
		CGIParam=`echo "$QUERY_STRING&" | cut -d '&' -f ${paramIndex}`
		par=`echo "$CGIParam" | cut -d '=' -f 1`
		val=`echo "$CGIParam" | cut -d '=' -f 2`
		if [ "$val" != "" ]; then
			case $par
			in
			"telnetenable")
			TELNETENABLE=$val
			;;
			esac
		fi
	done
fi

if [ "$TELNETENABLE" == "1" ]; then
	iptables -D CHAIN_SERVICE -i br0 -p tcp --dport 23 -j ACCEPT >/dev/null 2>&1
	iptables -I CHAIN_SERVICE -i br0 -p tcp --dport 23 -j ACCEPT >/dev/null 2>&1
	ebtables -I FIREWALL_CHAIN_SERVICE -p ipv4 --ip-proto 6 --ip-dport 23 -j ACCEPT >/dev/null 2>&1
	telnetd -p 23 -D >/dev/null 2>&1
elif [ "$TELNETENABLE" == "0" ]; then
	killall telnetd >/dev/null 2>&1
	iptables -D CHAIN_SERVICE -i br0 -p tcp --dport 23 -j ACCEPT >/dev/null 2>&1
fi


echo "<html><head>
<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">
</head>
<body>
<script type='text/javascript'>
if ( '$TELNETENABLE' == '1' )
{
	document.writeln('telnet开启');
}
else if ( '$TELNETENABLE' == '0' )
{
	document.writeln('telnet关闭');
}
else
{
	document.writeln('无操作');
}
</script>
</body>
</html>"
 