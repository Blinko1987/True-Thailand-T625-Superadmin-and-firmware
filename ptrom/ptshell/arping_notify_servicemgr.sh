#!/bin/sh
#This shell script is using for arping process call method in servicemgr.

usage()
{
	echo "usage: $0 interfacename,need only one input parameter!"
}

if [ $# -ne 1 ] && [ "x$1" == "x" ]
then
	usage
	exit 1
else
	interface=$1
	echo " interface name:$interface"	
	ubus call fh_svcmgr_dhcpc fh_svcmgr_arping_notify "{\"interface\":\"$interface\"}"

	exit 0
fi	

