#!/bin/sh

# echo "Proccess to kill is $1"
PROC_ID=`pidof dnsmasq` 
if [ -z "$PROC_ID" ]
then    
	echo "No proccess to kill"
else
	while [ "x$PROC_ID" != "x" ]
	do
		kill -9 $PROC_ID
		sleep 2      
		PROC_ID=`pidof $1`
	done
fi

/ptrom/bin/dnsmasq -k -u root &


