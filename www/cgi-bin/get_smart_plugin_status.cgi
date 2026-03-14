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
TEMPFILE="/var/plugin.temp.web"
CMD="dbus-send --system --print-reply --dest=com.ctc.appframework1 /com/ctc/appframework1 com.ctc.appframework1.AppAgent.List"
RET=`$CMD > ${TEMPFILE} 2>/dev/null`

PlugNum=`grep "dict entry" ${TEMPFILE} | wc -l`
PlugNameStr=""
PlugStatusStr=""
PlugVersionStr=""

i=1
while [ $i -le $PlugNum ]; do
	TempNumber=`expr $i \* 3`
	TempNumber=`expr $TempNumber - 1`
	
	PlugName=`grep "string" ${TEMPFILE} | sed -n "${TempNumber}p"  | awk '{print $2}' | sed -e "s/\"//g"`
	PlugNameStr="$PlugNameStr"`grep "string" ${TEMPFILE} | sed -n "${TempNumber}p"  | awk '{print $2}' | sed -e "s/\"//g"`"&"
	
	TempNumber=`expr $i \* 3`
	PlugVersionStr="$PlugVersionStr"`grep "string" ${TEMPFILE} | sed -n "${TempNumber}p"  | awk '{print $2}' | sed -e "s/\"//g"`"&"
	
	TempNumber=`grep -n "$PlugName" ${TEMPFILE} | awk '{print $1}' | sed -e "s/\://g"`
	TempNumber=`expr $TempNumber + 2`
	PlugStatusStr="$PlugStatusStr"`sed -n "${TempNumber}p" ${TEMPFILE}|grep "uint32" | awk '{print $2}' | sed -e "s/\"//g"`"&"
	#PlugStatusStr="$PlugStatusStr"`grep "uint32" ${TEMPFILE} | sed -n "${i}p"  | awk '{print $2}' | sed -e "s/\"//g"`"&"
	i=$((i+1))
done


if [ -f ${PLUGINLOG} ]; then
	while read line
	do
		if [ "$line" != "" ]; then
			PlugLogStr="${PlugLogStr}""${line}""&"
		fi
	done < ${PLUGINLOG}
fi

echo "{
\"PlugNum\": \"$PlugNum\",
\"PlugNameStr\": \"$PlugNameStr\",
\"PlugVersionStr\": \"$PlugVersionStr\",
\"PlugStatusStr\": \"$PlugStatusStr\",
\"PlugLogStr\": \"$PlugLogStr\"
}"
