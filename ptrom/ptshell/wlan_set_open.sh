#!/bin/sh

if [  -n "$1" ] ;then
	ifname=$1
else
	ifname=wl0
fi
flag=`nvram get ${ifname}_akm`

if [ "$flag" == "" ];then
	echo "already open exit!"
	exit 0
fi

killall nas
nvram unset ${ifname}_akm
wl -i ${ifname} down
wlconf ${ifname} up
wlconf ${ifname} security
wlconf ${ifname} start
nas &

