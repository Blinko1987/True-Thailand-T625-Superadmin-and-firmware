#!/bin/sh

# udhcpc script edited by Tim Riker <Tim@Rikers.org>
[ -z "$1" ] && echo "Error: should be called from udhcpc" && exit 1
PROFILE_CFG=/userfs/profile.cfg
if [ -f $PROFILE_CFG ] ; then
	chmod 777 $PROFILE_CFG
	. $PROFILE_CFG
fi
if [ "$TCSUPPORT_DNSEACHPVC" != "" ] ;then
	RESOLV_CONF="/etc/resolv_"$interface".conf"
else
	RESOLV_CONF="/etc/resolv.conf"
fi
#GATEWAY_FILE="/etc/"$interface"_gateway.conf"
DNS_FILE="/var/run/"$interface"/dns"
GATEWAY_FILE="/var/run/"$interface"/gateway"
STATUS_FILE="/var/run/"$interface"/status"
IP_FILE="/var/run/"$interface"/ip"
NETMASK_FILE="/var/run/"$interface"/netmask"
VXLAN_IF="vxlan"

[ -n "$broadcast" ] && BROADCAST="broadcast $broadcast"
[ -n "$subnet" ] && NETMASK="netmask $subnet"

case "$1" in
	deconfig)
		#/sbin/ifconfig $interface down
		/sbin/ifconfig $interface 0.0.0.0
		
		echo "down" > $STATUS_FILE		
		
		if [ "$interface" = "br0" ] ; then
			/userfs/bin/tcapi set Lan_Entry IP $ip
			/userfs/bin/tcapi commit Lan	
		else
		if [ -f "/tmp/use_cfg_ng" ] ; then
			if [ "$TCSUPPORT_VXLAN" != "" ] ;then
				if [[ $interface == $VXLAN_IF* ]] ;then
					/userfs/bin/msg send_ext 7 241 $interface
				else
					if [ "$TCSUPPORT_NP_CMCC" != "" ] || [ "$TCSUPPORT_CT_UBUS" != "" ] ;then
						if [ "$interface" = "br0:1" ] ; then
							/userfs/bin/msg send_ext 1 14 $interface
						else
							/userfs/bin/msg send_ext 1 4 $interface
						fi
					else
						/userfs/bin/msg send_ext 1 4 $interface
					fi
				fi
			else

				if [ "$TCSUPPORT_NP_CMCC" != "" ] || [ "$TCSUPPORT_CT_UBUS" != "" ] ;then
					if [ "$interface" = "br0:1" ] ; then
						/userfs/bin/msg send_ext 1 14 $interface
					else
						/userfs/bin/msg send_ext 1 4 $interface
					fi
				else
					/userfs/bin/msg send_ext 1 4 $interface
				fi
			fi
		else
			/userfs/bin/tcapi commit WanInfo_Message_$interface/4
		fi		
		fi

		if [ -f $DNS_FILE ]; then
		rm $DNS_FILE
		fi
		if [ -f $GATEWAY_FILE ]; then 
		rm $GATEWAY_FILE
		fi
		if [ -f $NETMASK_FILE ]; then		
		rm $NETMASK_FILE
		fi
		if [ -f $IP_FILE ]; then		
		rm $IP_FILE
		fi
		;;

	renew|bound)
		/sbin/ifconfig $interface $ip $BROADCAST $NETMASK		
		echo $ip > $IP_FILE
		echo $subnet > $NETMASK_FILE		
		
		if [ -n "$router" ] ; then
			echo "writing routers to file"
			for i in $router ; do
				echo $i > $GATEWAY_FILE
			done
		fi
		
		echo -n > $RESOLV_CONF
		[ -n "$domain" ] && echo search $domain >> $RESOLV_CONF
		#for i in $dns ; do
		#	echo adding dns $i
		#	echo nameserver $i >> $RESOLV_CONF
		#done
		if [ -f $DNS_FILE ]; then
			rm $DNS_FILE
		fi
		for i in $dns ; do	
			echo $i >> $DNS_FILE
		done
		echo "up" > $STATUS_FILE
		#/userfs/bin/tcapi set WanInfo_Message Type Up
		#/userfs/bin/tcapi set WanInfo_Message Interface $interface
		
		if [ "$interface" = "br0" ] ; then
			/userfs/bin/tcapi set Lan_Entry IP $ip
			/userfs/bin/tcapi commit Lan	
		else		
		if [ -f "/tmp/use_cfg_ng" ] ; then
			if [ "$TCSUPPORT_VXLAN" != "" ] ;then
				if [[ $interface == $VXLAN_IF* ]] ;then
					/userfs/bin/msg send_ext 7 240 $interface
				else
					if [ "$TCSUPPORT_NP_CMCC" != "" ] || [ "$TCSUPPORT_CT_UBUS" != "" ] ;then
						if [ "$interface" = "br0:1" ] ; then
							/userfs/bin/msg send_ext 1 13 $interface
						else
							/userfs/bin/msg send_ext 1 3 $interface
						fi
					else
						/userfs/bin/msg send_ext 1 3 $interface
					fi
				fi
			else
				if [ "$TCSUPPORT_NP_CMCC" != "" ] || [ "$TCSUPPORT_CT_UBUS" != "" ] ;then
					if [ "$interface" = "br0:1" ] ; then
						/userfs/bin/msg send_ext 1 13 $interface
					else
						/userfs/bin/msg send_ext 1 3 $interface
					fi
				else
					/userfs/bin/msg send_ext 1 3 $interface
				fi
			fi
		else
			/userfs/bin/tcapi commit WanInfo_Message_$interface/4
		fi
		fi
		;;
		
esac

exit 0
