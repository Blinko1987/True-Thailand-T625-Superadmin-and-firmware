#!/bin/sh

#-----lqu modify 2012081
. /var/WEB-GUI/hgcxml.conf
#COMMON_CONF=/etc/fh_common.conf
#FHBOX_PATH=`grep "FHBOX_BIN_PATH=" $COMMON_CONF | cut -d = -f 2 `
#RADVD=`grep "APP_PATH_RADVD=" $COMMON_CONF | cut -d = -f 2 `
#RADVD_CONF=`grep "APP_CONF_PATH_RADVD_CONF=" $COMMON_CONF | cut -d = -f 2 `
echo "set radvd">>/var/aa
echo "$1 $2 $3 $4 $5">>/var/aa
pid=$5
emuinfo_file=/var/pppoeemuinfo6
if [ -f $emuinfo_file ];then
	setcfgx $emuinfo_file "LANIPv6Prefix" $1 
	exit
fi
vid=`ps |grep $pid|grep dhcp6c|cut -d . -f 2`
if [ "x${vid}" = "x4093" ]
then
vid=0
fi

for i in 1 2 3 4 5 6 7 8
	do
		eval vid_seq="\${IGD_WAND_1_WANCD_${i}_XCTCOMWANGLC_VLANIDMark}"
		echo "vid_seq=$vid_seq"
		vid_xml=`inter_web get $vid_seq`
		echo "vid_xml ${vid_xml}"
		if [ "${vid}&" = "${vid_xml}" ]
		then
			echo "vid_seqqqq=$vid_seq"
			
			eval ppp_enable_seq="\${IGD_WAND_1_WANCD_${i}_WANPPPC_1_Enable}"
			ppp_enable=`inter_web get $ppp_enable_seq`
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
					#eval dns_seq="\${IGD_WAND_1_WANCD_${i}_WANPPPC_${j}_X_CT_COM_IPv6DNSServers}"
					#inter_web set $dns_seq $dns
					eval service_seq="\${IGD_WAND_1_WANCD_${i}_WANPPPC_${j}_X_CT_COM_ServiceList}"
					service=`inter_web get $service_seq`
					eval wan_prefix_seq="\${IGD_WAND_1_WANCD_${i}_WANPPPC_${j}_X_CT_COM_IPv6Prefix}"
					break
				fi
			done
			

			fi
			
			eval ip_enable_seq="\${IGD_WAND_1_WANCD_${i}_WANIPC_1_Enable}"
			ip_enable=`inter_web get ${ip_enable_seq}`	
			if [ $ip_enable = "1&" ]
			then
				eval service_seq="\${IGD_WAND_1_WANCD_${i}_WANIPC_1_X_CT_COM_ServiceList}"
				service=`inter_web get $service_seq`
				eval wan_prefix_seq="\${IGD_WAND_1_WANCD_${i}_WANIPC_1_X_CT_COM_IPv6Prefix}"
			fi

		echo "ppp_enable $ppp_enable ip_enable $ip_enable"
			break

		fi
		continue
	done
	
	eval prefix_mode_sq="\${IGD_LAND_1_XCTCOMIP6C_PI_1_Mode}"
	prefix_mode=`inter_web get $prefix_mode_sq`
	echo "$prefix_mode"
	if [ "$prefix_mode" == "WANDelegated&" ];then
			inter_web set $wan_prefix_seq $4
			inter_web set $IGD_LAND_1_XCTCOMIP6C_PI_1_Prefix $1
			inter_web set $IGD_LAND_1_XCTCOMIP6C_PI_1_PreferredLifeTime $2
			inter_web set $IGD_LAND_1_XCTCOMIP6C_PI_1_ValidLifeTime $3

			#$FHBOX_PATH/setcfgx $RADVD_CONF prefix $1
			#killall radvd
			#chmod 755 $RADVD_CONF
			chmod 755 /var/radvd.conf
			inter_web set $IGD_LAND_1_XCTCOMRA_Enable 1
			#$RADVD -C $RADVD_CONF -m logfile
			echo "restart radvd success!"

	fi

setcfgx /var/dslite_result.conf  dslite_result START_DSLITE