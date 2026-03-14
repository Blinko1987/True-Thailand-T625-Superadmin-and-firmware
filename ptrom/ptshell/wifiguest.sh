#!/bin/sh

#添加规则
#Usage: wifi_gueset.sh add [interface] [type] 

#Usage: wifi_gueset.sh del [interface] [type] 
GUEST_FILE=/var/guest_table
#COMMON_CONF=/etc/fh_common.conf
#MISC_SHELL_PATH_GETCFG=`grep "MISC_SHELL_PATH_GETCFG=" $COMMON_CONF | cut -d = -f 2`
LAN_IPv4=`ifconfig br0 | egrep "inet addr:" | sed -e 's/^.*inet addr:\([0-9.][0-9.]*\) .*/\1/'`
LAN_IPv6=`ifconfig br0 | grep "inet6 addr" | sed -n "2p" | awk '{printf $3}' | cut -d "/" -f 1`
SEPATATOR=","  
COUNTER=0
#USHARE_PORT=`$MISC_SHELL_PATH_GETCFG "/etc/ushare.conf" USHARE_PORT`
USHARE_PORT=2468
CHAIN_PRE="WIFI_GUEST_"
CHAIN_PRE_INPUT="WIFI_GUEST_INPUT_"
echo "LAN_IPv4:${LAN_IPv4}" >> $GUEST_FILE
echo "LAN_IPV6:${LAN_IPv6}" >> $GUEST_FILE
echo "USHARE_PORT:${USHARE_PORT}" >> $GUEST_FILE
echo "$0 $1 $2 $3"  >> $GUEST_FILE
if [ "$1" = "add" ]; then
	if [ "$3" != "1" ] && ["$3" != "2"];then
		exit 0
	fi
	
	ebtables -t broute -L $CHAIN_PRE$2 1>/dev/null 2>&1
	if [ $? == 0 ];then
		ebtables -t broute -F $CHAIN_PRE$2
	else
		ebtables -t broute -N $CHAIN_PRE$2
		ebtables -t broute -I BROUTING -j $CHAIN_PRE$2
	fi
	
	ebtables -t filter -L $CHAIN_PRE$2 1>/dev/null 2>&1
	if [ $? == 0 ];then
		ebtables -t filter -F $CHAIN_PRE$2
		ebtables -t filter -F $CHAIN_PRE_INPUT$2
	else
		ebtables -t filter -N $CHAIN_PRE$2
		ebtables -t filter -I FORWARD -j $CHAIN_PRE$2
		ebtables -t filter -N $CHAIN_PRE_INPUT$2
		ebtables -t filter -I INPUT -j $CHAIN_PRE_INPUT$2
	fi
	
	if [ "$3" = "1" ]; then
		ebtables -t broute -A $CHAIN_PRE$2 -p 0x0800 -i $2 --ip-proto 2 -j DROP #组播协议
		ebtables -t broute -A $CHAIN_PRE$2 -j RETURN
		ebtables -A $CHAIN_PRE$2 -p 0x0800 -o $2 -j DROP # 桥内接口隔离
		ebtables -A $CHAIN_PRE$2 -p 0x0806 -o $2 -j DROP # 桥内接口arp隔离
		ebtables -A $CHAIN_PRE$2 -j RETURN
		#21,23,80,8080,445,2468,4361 ftp telnet web samba dlna
		#ipv4 TCP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 21 -j DROP 	
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 23 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 80 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 8080 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 445 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 2468 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 4361 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 137 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 138 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport ${USHARE_PORT} -j DROP
	
		#ipv4 udp
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dst ${LAN_IPv4} --ip-dport 137 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dst ${LAN_IPv4} --ip-dport 138 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dport 1900 -j DROP  
	
		#ipv6 tcp
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 21 -j DROP 	
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 23 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 80 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 8080 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 445 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 2468 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 4361 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 137 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 138 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport ${USHARE_PORT} -j DROP
	
		#ipv6 udp
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 17 --ip6-dst ${LAN_IPv6} --ip6-dport 137 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 17 --ip6-dst ${LAN_IPv6} --ip6-dport 138 -j DROP
		ebtables -t broute -I $CHAIN_PRE$2 -i $2 -p 0x86DD --ip6-proto 17 --ip6-dport 1900 -j DROP
		
		ebtables  -A $CHAIN_PRE_INPUT$2 -p 0x0800 -i $2 --ip-proto 2 -j DROP #组播协议
		ebtables  -A $CHAIN_PRE_INPUT$2 -j RETURN

		#21,23,80,8080,445,2468,4361 ftp telnet web samba dlna
		#ipv4 TCP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 21 -j DROP 	
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 23 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 80 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 8080 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 445 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 2468 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 4361 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 137 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport 138 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${LAN_IPv4} --ip-dport ${USHARE_PORT} -j DROP
	
		#ipv4 udp
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dst ${LAN_IPv4} --ip-dport 137 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dst ${LAN_IPv4} --ip-dport 138 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dport 1900 -j DROP  
	
		#ipv6 tcp
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 21 -j DROP 	
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 23 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 80 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 8080 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 445 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 2468 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 4361 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 137 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport 138 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 6 --ip6-dst ${LAN_IPv6} --ip6-dport ${USHARE_PORT} -j DROP
	
		#ipv6 udp
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 17 --ip6-dst ${LAN_IPv6} --ip6-dport 137 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 17 --ip6-dst ${LAN_IPv6} --ip6-dport 138 -j DROP
		ebtables  -I $CHAIN_PRE_INPUT$2 -i $2 -p 0x86DD --ip6-proto 17 --ip6-dport 1900 -j DROP

	elif [ "$3" = "2" ]; then
		ebtables -t broute -A $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dport 67:68 -j ACCEPT
		ebtables -t broute -A $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dport 53 -j ACCEPT
		ebtables -t broute -A $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dport 53 -j ACCEPT
		ebtables -A $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dport 67:68 -j ACCEPT
		ebtables -A $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dport 53 -j ACCEPT
		ebtables -A $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dport 53 -j ACCEPT
		uciname=`echo $2 | sed  "s/\./\_/g"`
		AllowedIPPortList=`uci get -c /var wifi_allowedIPPort.$uciname.value`
		if [ -n "$AllowedIPPortList" ]; then
			`echo "$AllowedIPPortList" | grep -q "${SEPATATOR}"`
			if [ $? -eq 0 ]; then
				while [ 1 ]
				do	
					COUNTER=`expr $COUNTER + 1`
					s=`echo $AllowedIPPortList | cut -d ${SEPATATOR} -f ${COUNTER}`
					if [ -z "$s" ]; then
						break;
					fi
					echo "add ip:port: $s"
					
					port=`echo $s | cut -d ':' -f 2`
					ip=`echo $s | cut -d ':' -f 1`
					
					ebtables -t broute -A $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${ip} --ip-dport ${port} -j ACCEPT
					ebtables -t broute -A $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dst ${ip} --ip-dport ${port} -j ACCEPT
					ebtables -A $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${ip} --ip-dport ${port} -j ACCEPT
					ebtables -A $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dst ${ip} --ip-dport ${port} -j ACCEPT					
				done
			else
				port=`echo $AllowedIPPortList | cut -d ':' -f 2`
				ip=`echo $AllowedIPPortList | cut -d ':' -f 1`
				
				ebtables -t broute -A $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${ip} --ip-dport ${port} -j ACCEPT
				ebtables -t broute -A $CHAIN_PRE$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dst ${ip} --ip-dport ${port} -j ACCEPT
				ebtables -A $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 6 --ip-dst ${ip} --ip-dport ${port} -j ACCEPT
				ebtables -A $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 --ip-proto 17 --ip-dst ${ip} --ip-dport ${port} -j ACCEPT				
			fi
		fi
		ebtables -t broute -A $CHAIN_PRE$2 -i $2 -p 0x0800 -j DROP
		ebtables -t broute -A $CHAIN_PRE$2 -j RETURN
		ebtables -A $CHAIN_PRE_INPUT$2 -i $2 -p 0x0800 -j DROP
		ebtables -A $CHAIN_PRE_INPUT$2 -j RETURN
		ebtables -A $CHAIN_PRE$2 -o $2 -p 0x0800 -j DROP
		ebtables -A $CHAIN_PRE$2 -o $2 -p 0x0806 -j DROP
		ebtables -A $CHAIN_PRE$2 -j RETURN
	fi
elif [ "$1" = "del" ]; then
	if [ "$3" = "1" ] || [ "$3" = "2" ]; then
		ebtables -t broute -F $CHAIN_PRE$2
		ebtables -F $CHAIN_PRE$2
		ebtables -A $CHAIN_PRE$2 -j RETURN
		ebtables -F $CHAIN_PRE_INPUT$2
		ebtables -A $CHAIN_PRE_INPUT$2 -j RETURN
	else
		exit 0
	fi
else
	echo -e "Usage: wifi_gueset.sh add [interface] 1 "
	echo -e "\twifi_gueset.sh add [interface] 2 ssidindex "
	echo -e "\twifi_gueset.sh del [interface] 1 "
	echo -e "\twifi_gueset.sh del [interface] 2 ssidindex "
fi
