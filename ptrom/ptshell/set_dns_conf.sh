#!/bin/sh

COMMON_CONF=/etc/fh_common.conf
#DHCP6S=`grep "APP_PATH_DHCP6S=" $COMMON_CONF | cut -d = -f 2 ` 
#DHCP6S_CONF=`grep "APP_CONF_PATH_DHCPV6_DHCP6S=" $COMMON_CONF | cut -d = -f 2 `
GETCFG=`grep "MISC_SHELL_PATH_GETCFG=" $COMMON_CONF | cut -d = -f 2 `
UDHCPD_LAN_CONF=`grep "APP_CONF_PATH_UDHCPD_LAN=" $COMMON_CONF | cut -d = -f 2 `
dnsrelayen=0
dns=`echo $1 | sed 's/;//'`
emuinfo_file=/var/pppoeemuinfo6
if [ -f $emuinfo_file ];then
setcfgx $emuinfo_file "WANIPv6DNSServers" $dns
	exit
fi
echo "12143k"$1
echo "233333"$2
if [ "x$dns" = "x" ]
then
exit 0
fi
. /var/WEB-GUI/hgcxml.conf
. /etc/net_interface.conf
set_ipv6_dns(){
	count=`echo $dns |cut -d " " -f 2 |awk -F  "," '{ print NF}'`
	if [ $count = 2 ]          
	then    
	dns1=`echo $dns |cut -d " " -f 2 |awk -F  "," '{ print $1 }'`
	dns2=`echo $dns |cut -d " " -f 2 |awk -F  "," '{ print $2 }'`
		if grep $dns1 $RESOLV_CONF
		then
			echo "The dns info is existed!!!"
		else
			echo nameserver $dns1 >> $RESOLV_CONF
			if grep rotate $RESOLV_CONF
			then
				echo "option rotate is existed"
			else	
				echo options rotate	>> $RESOLV_CONF
			fi	
		fi
		
		if grep $dns2 $RESOLV_CONF
		then
			echo "The dns info is existed!!!"
		else
			echo nameserver $dns2 >> $RESOLV_CONF
			if grep rotate $RESOLV_CONF
			then
				echo "option rotate is existed"
			else	
				echo options rotate	>> $RESOLV_CONF
			fi	
		fi	
	else	
		if grep $dns $RESOLV_CONF
		then
			echo "The dns info is existed!!!"
		else
			echo nameserver $dns >> $RESOLV_CONF
			if grep rotate $RESOLV_CONF
			then
				echo "option rotate is existed"
			else	
				echo options rotate	>> $RESOLV_CONF
			fi	
		fi
	fi
}
pid=$3
vid=`ps |grep $pid|grep dhcp6c|cut -d . -f 2`
echo "vid $vid"
if [ "x${vid}" = "x4093" ]
then
	vid=0
fi
for i in 1 2 3 4 5 6 7 8
do
	eval vid_seq="\${IGD_WAND_1_WANCD_${i}_XCTCOMWANELC_VLANIDMark}"
	vid_xml=`inter_web get $vid_seq`
echo "vid_xml $vid_xml"
	if [ "$vid&" = "$vid_xml" ]
	then
		eval ppp_enable_seq="\${IGD_WAND_1_WANCD_${i}_WANPPPC_1_Enable}"
		ppp_enable=`inter_web get $ppp_enable_seq`	
		eval ip_enable_seq="\${IGD_WAND_1_WANCD_${i}_WANIPC_1_Enable}"
		ip_enable=`inter_web get $ip_enable_seq`
		
		if [ $ppp_enable = "1&" ]
		then
			for j in 1 2
			do
				eval ConnectionType_seq="\${IGD_WAND_1_WANCD_${i}_WANPPPC_${j}_ConnectionType}"
				ConnectionType=`inter_web get $ConnectionType_seq`
				eval mode_seq="\${IGD_WAND_1_WANCD_${i}_WANPPPC_${j}_X_CT_COM_IPMode}"
				mode=`inter_web get $mode_seq`
				if [ $ConnectionType = "IP_Routed&" ] && [ $mode != "1&" ]
				then
					eval dns_seq="\${IGD_WAND_1_WANCD_${i}_WANPPPC_${j}_X_CT_COM_IPv6DNSServers}"
					#inter_web set $dns_seq $dns
					eval service_seq="\${IGD_WAND_1_WANCD_${i}_WANPPPC_${j}_X_CT_COM_ServiceList}"
					service=`inter_web get $service_seq`
					break
				fi
			done
		fi
			eval ip_enable_seq="\${IGD_WAND_1_WANCD_${i}_WANIPC_1_Enable}"
			ip_enable=`inter_web get $ip_enable_seq`	
			if [ $ip_enable = "1&" ]
			then
				eval dns_seq="\${IGD_WAND_1_WANCD_${i}_WANIPC_1_X_CT_COM_IPv6DNSServers}"
				#inter_web set $dns_seq $dns
				eval service_seq="\${IGD_WAND_1_WANCD_${i}_WANIPC_1_X_CT_COM_ServiceList}"
				service=`inter_web get $service_seq`
			fi

	echo "ppp_enable $ppp_enable ip_enable $ip_enable dns_seq $dns_seq"
		break

	fi
	continue
done
interface_name=$WAN_INTERFACE.$vid
internet_flag=`echo $service |grep INTERNET`
voip_flag=`echo $service |grep VOIP`
tr069_flag=`echo $service |grep TR069`
inter_web set $dns_seq $dns

echo "dname"$interface_name"voip"${voip_flag}"tr069"$tr069_flag
		#	cp /var/dhcp6s.conf $DHCP6S_CONF
if [ "x$internet_flag" != "x" ]
then
RESOLV_CONF="/etc/resolv.conf"
	if [ -f $RESOLV_CONF ]
		then
			set_ipv6_dns
	else
		touch $RESOLV_CONF 
		set_ipv6_dns
	fi
fi
if [ "x$tr069_flag" != "x" ]
then
RESOLV_CONF="/var/resolv_v6_tr069.conf"
	if [ -f $RESOLV_CONF ]
		then
			set_ipv6_dns
	else
		touch $RESOLV_CONF 
		set_ipv6_dns
	fi
fi
if [ "x$voip_flag" != "x" ]
then
RESOLV_CONF="/var/resolv_v6_voip.conf"
	if [ -f $RESOLV_CONF ]
		then
			set_ipv6_dns
	else
		touch $RESOLV_CONF 
		set_ipv6_dns
	fi
fi
			#DHCP6S_STATE='ps aux | grep dhcp6s | grep -v "grep"'
			#if [ -n "$DHCP6S_STATE"]
			#then
				#killall dhcp6s
				#$DHCP6S -c $DHCP6S_CONF -d br0
			if [ "x$internet_flag" != "x" ]
			then
			cfg_cmd set $IGD_LAND_1_XCTCOMIP6C_IPv6DNSServers $1
			cfg_cmd set $IGD_LAND_1_XCTCOMIP6C_IPv6DNSWANConnection $interface_name
			cfg_cmd set $IGD_LAND_1_XCTCOMDHCP6S_Enable 1
			echo "the connect internet"
	cat /var/resolv.conf |grep :>/var/resolv.conf.v6
	cat /var/resolv.conf |grep -v :>/var/resolv.conf.v4
	> /var/resolv.conf
	cat /var/resolv.conf.v6 >>/var/resolv.conf
	cat /var/resolv.conf.v4 >>/var/resolv.conf
	
	#killall dnsmasq
	/rom/ptshell/misc_shell/stdaction killproc dnsmasq
	dnsmasq &
			fi

			#else
			#	echo "The dhcp6s is not started!!!"
			#fi
		# add ipv6 dns backup to avoid resolv.conf was replaced by SLOW dhcp ipv4 dns
		# update resolv.conf twice, make sure ipv6 dns exists
echo "set dns relay config success!!"
