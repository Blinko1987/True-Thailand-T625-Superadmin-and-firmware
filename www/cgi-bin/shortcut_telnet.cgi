#!/bin/sh
echo -e "Content-type: text/plain\n"

CMDFILE="/var/fiberweb_telnet.sh"
RESULTFILE="/var/fiberweb_telnet.log"
CMD=`../cgi-bin/urldecode.cgi $QUERY_STRING`

if [ "$CMD" == "top" ]; then
	CMD="top -n 1"
fi

echo "#/bin/sh" > $CMDFILE
echo "" >> $CMDFILE
echo "$CMD" >>$CMDFILE
chmod +x $CMDFILE
`/bin/sh $CMDFILE >${RESULTFILE} 2>&1`

# `${CMD} >${RESULTFILE} 2>&1`

RESULT=""
while read line; do
	RESULT=${RESULT}${line}"<br />"
done < $RESULTFILE

rm $CMDFILE $RESULTFILE 2>/dev/null

echo "$RESULT"
