#!/bin/sh

#添加规则
#Usage: route_set.sh add [index] 
#		route_set.sh add 1
#删除规则
#Usage: route_set.sh delete [index] 
#		route_set.sh delete 1

#WAN连接up
#Usage: route_set.sh wanup [devname] 
#		route_set.sh wanup wan.10
#WAN连接down
#Usage: route_set.sh wandown [devname] 
#		route_set.sh wandown wan.10

ipaddress=""
netmask=""
gateway=""
intf=""

tmplogfile="/var/route_setv4_sh_log"


getcfgx()
{
	[ -z "$1" -o -z "$2" ] && echo "getcfgx param is null" >> $tmplogfile  && exit 0
	param1=${1//./_}
	param2=${2//./_}
	filepath=${param1%/*}
	filename=${param1##/*/}

	res=`uci get -c $filepath "$filename"."$param2".value 2>/dev/null`
	echo $res
}

setcfgx()
{
	[ -z "$1" -o -z "$2" ] && echo "setcfgx param is null" >> $tmplogfile && exit 0
	param1=${1//./_}
	param2=${2//./_}

	cfg_cmd setuci $param1 $param2 $3 0 2>/dev/null
}

ip_calc_get_net()
{
	[ -z "$1" -o -z "$2" ] && echo "ip_calc_get_net param is null" >> $tmplogfile  && exit 0
	net=`ipcalc.sh $1 $2 | grep NETWORK | cut -d = -f 2`
	len=`ipcalc.sh $1 $2 | grep PREFIX | cut -d = -f 2`

	[ -n "$net" ] && [ -n "$len" ] && echo "$net/$len"
}

fun_getconf() 
{
	configfile=$1
	echo "---------"$configfile
	ipaddress=`getcfgx $configfile destip`
	netmask=`getcfgx $configfile destsubnetmask`
	gateway=`getcfgx $configfile gatewayip`
	intf=`getcfgx $configfile interface`
	if [ "$intf" = "NULL" -o "$intf" = "" ]; then
		echo "failed: wan intf is NULL"
		exit 1	
	fi
	if [ "$ipaddress" = "NULL" -o "$ipaddress" = "" ]; then
		echo "failed: dest ipaddress is NULL"
		exit 1	
	fi
	if [ "$netmask" = "" ]; then
		netmask="NULL"
	fi
	if [ "$gateway" = "" ]; then
		gateway="NULL"
	fi

	#echo "ipaddress=" $ipaddress
	#echo "netmask=" $netmask
	#echo "gateway=" $gateway
	#echo "devname=" $devname
	#echo "intf=" $intf
}

fun_add_route() 
{
	#host route
	if [ "$netmask" = "NULL" -a "$gateway" = "NULL" ]; then
		ip route add $ipaddress dev $intf
		if [ $? -ne 0 ]; then
			echo "failed: ip route add $ipaddress dev $intf"
			exit 1
		fi
		echo "ip route add $ipaddress dev $intf"
	elif [ "$netmask" = "NULL" -a "$gateway" != "NULL" ]; then
		ip route add $ipaddress via $gateway dev $intf
		if [ $? -ne 0 ]; then
			echo "failed: ip route add $ipaddress via $gateway dev $intf"
			exit 1
		fi
		echo "ip route add $ipaddress via $gateway dev $intf"
	
	#network route
	elif [ "$netmask" != "NULL" -a "$gateway" = "NULL" ]; then
		net=`ip_calc_get_net $ipaddress $netmask`
		ip route add $net dev $intf
		if [ $? -ne 0 ]; then
			echo "failed: ip route add $net dev $intf"
			exit 1
		fi
		echo "ip route add $net dev $intf"
	
	else
		net=`ip_calc_get_net $ipaddress $netmask`
		ip route add $net via $gateway dev $intf
		if [ $? -ne 0 ]; then
			echo "failed: ip route add $net via $gateway dev $intf"
			exit 1
		fi
		echo "ip route add $net via $gateway dev $intf"
	fi
	
	ip route flush cache
	echo "ip route flush cache"	
}

fun_delete_route()
{
	#host route
	if [ "$netmask" = "NULL" -a "$gateway" = "NULL" ]; then
		ip route delete $ipaddress dev $intf
		if [ $? -ne 0 ]; then
			echo "failed: ip route delete $ipaddress dev $intf"
			exit 1
		fi
		echo "ip route delete $ipaddress dev $intf"
	elif [ "$netmask" = "NULL" -a "$gateway" != "NULL" ]; then
		ip route delete $ipaddress via $gateway dev $intf
		if [ $? -ne 0 ]; then
			echo "failed: ip route delete $ipaddress via $gateway dev $intf"
			exit 1
		fi
		echo "ip route delete $ipaddress via $gateway dev $intf"

	#network route
	elif [ "$netmask" != "NULL" -a "$gateway" = "NULL" ]; then
		net=`ip_calc_get_net $ipaddress $netmask`
		ip route delete $net dev $intf
		if [ $? -ne 0 ]; then
			echo "failed: ip route delete $net dev $intf"
			exit 1
		fi
		echo "ip route delete $net dev $intf"
	else
		net=`ip_calc_get_net $ipaddress $netmask`
		ip route delete $net via $gateway dev $intf
		if [ $? -ne 0 ]; then
			echo "failed: ip route delete $net via $gateway dev $intf"
			exit 1
		fi
		echo "ip route delete $net via $gateway dev $intf"
	fi
	
	ip route flush cache
	echo "ip route flush cache"
}

fun_wanup_route()
{
	files=`ls /ptconf/staticroute_ipv4_*`
	for filename in $files; do
		devname=`getcfgx $filename interface`
		if [ "$devname" = "$1" ]; then
			fun_getconf $filename
			fun_add_route
		fi
	done  
}

fun_wandown_route()
{
	files=`ls /ptconf/staticroute_ipv4_*`
	for filename in $files; do
		devname=`getcfgx $filename interface`
		if [ "$devname" = "$1" ]; then
			fun_getconf $filename
			fun_delete_route
		fi
	done  
}

if [ "$1" = "add" ]; then	
	fun_getconf /ptconf/staticroute_ipv4_${2}_conf
	fun_add_route
elif [ "$1" = "delete" ]; then
	fun_getconf /ptconf/staticroute_ipv4_${2}_conf
	fun_delete_route
elif [ "$1" = "wanup" ]; then
	fun_wanup_route $2
elif [ "$1" = "wandown" ]; then
	fun_wandown_route $2
else
	echo -e "Usage:\troute_setv4.sh add [index] "
	echo -e "\troute_setv4.sh delete [index] "
	echo -e "Usage:\troute_setv4.sh wanup [interface] "
	echo -e "\troute_setv4.sh wandown [interface] "
	exit 1
fi

exit 0
