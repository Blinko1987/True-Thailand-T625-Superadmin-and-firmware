#!/bin/sh
echo -e "Content-type: text/plain\n"

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
   gstr3=$(echo $upstr | grep "AND")
   gstr4=$(echo $upstr | grep "OR")
   gstr5=$(echo $upstr | grep "%27")
   gstr6=$(echo $upstr | grep "%2B")
   gstr7=$(echo $upstr | grep "%2D")
   gstr8=$(echo $upstr | grep "%0D%0A")
   if [ -n "$gstr2" ] || [ -n "$gstr0" ] || [ -n "$gstr3" ] || [ -n "$gstr4" ] || [ -n "$gstr5" ] || [ -n "$gstr6" ] || [ -n "$gstr7" ] || [ -n "$gstr8" ]; then
	exit 0
   fi
fi

/bin/sh ./refresh_session.cgi 2>/dev/null

PLUGINLOG="/tmp/plugin.log"
TEMPFILE="/var/smartapp.temp"
CMD="dbus-send --system --print-reply --dest=com.ctc.cloudclient1 /com/ctc/cloudclient1 com.ctc.cloudclient1.GetPlatformServers"
RET=`$CMD > ${TEMPFILE} 2>/dev/null`

smartNameStr1=`cat /var/smartapp.temp | grep "BSS" | sed -e 's/\"//g' | sed 's/}//g' | awk -F ',' '{print $1}'| awk -F 'Server' '{print $2}'`
smartNameStr2=`cat /var/smartapp.temp | grep "BSS" | sed -e "s/\"//g" | sed 's/}//g' | awk -F ',' '{print $2}' | awk -F 'Status' '{print $2}' | awk -F ':' '{print $2}'`
smartNameStr3=`cat /var/smartapp.temp | grep "BSS" | sed -e "s/\"//g" | sed 's/}//g' | awk -F ',' '{print $3}'| awk -F 'Server' '{print $2}'`
smartNameStr4=`cat /var/smartapp.temp | grep "BSS" | sed -e "s/\"//g" | sed 's/}//g' | awk -F ',' '{print $4}' | awk -F 'Status' '{print $2}' | awk -F ':' '{print $2}'`

smartNameStr1=${smartNameStr1:1}				
smartNameStr3=${smartNameStr3:1}					
					
echo "
{
   \"smartNameStr1\":\"$smartNameStr1\",
   \"smartNameStr2\":\"$smartNameStr2\",
   \"smartNameStr3\":\"$smartNameStr3\",
   \"smartNameStr4\":\"$smartNameStr4\"
}"
