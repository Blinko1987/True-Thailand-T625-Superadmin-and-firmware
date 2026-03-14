#!/bin/sh

#添加规则
#Usage: ipforwardv6.sh add [interface]  [gate6way]
#		ipforwardv6.sh add pon0.50   2000::1
#删除规则
#Usage: ipforwardv6.sh del [interface] 
#		ipforwardv6.sh del pon0.50  

tmplogfile="/var/ipforwardv6_sh_log"
echo -e "\n---------------`date`---------------" >> $tmplogfile
echo "$0 $1 $2 $3" >> $tmplogfile
devname=$2
gate6way=$3

getcfgx()
{
	[ -z "$1" ] && [ -z "$2" ] && echo "getcfgx param is null" >> $tmplogfile  && exit 0
	param1=${1//./_}
	param2=${2//./_}
	filepath=${param1%/*}
	filename=${param1##/*/}

	res=`uci get -c $filepath "$filename"."$param2".value 2>/dev/null`
	echo $res
}

setcfgx()
{
	[ -z "$1" ] && [ -z "$2" ] && [ -z "$3" ] && echo "setcfgx param is null"  >> $tmplogfile && exit 0
	param1=${1//./_}
	param2=${2//./_}

	cfg_cmd setuci $param1 $param2 $3 0
}

configfile=/var/wanconf/${devname}_wan.conf
Enable_flag=`getcfgx /var/IPForwardModeEnable mode`

if [ "$1" = "add" ] 
  then
	if [ "$Enable_flag" == "1" ]
	then
		#add network route
		echo $configfile  >> $tmplogfile
		intf=`getcfgx $configfile intf`
		if [ "x$intf" != "x" ]
			then
			if [ "x$gate6way" = "x" ] || [ "x$gate6way" = "xNULL" ]
			  then
				gate6way=` route -A inet6 2>&1| grep 'UG' |grep $intf |cut -d ' ' -f 41 `
			fi
			if [ "x$gate6way" = "x" ] || [ "x$gate6way" = "xNULL" ]
				then
				echo " gate6way is null"  >> $tmplogfile
			
			else
				#if [ -f /var/IPForwardList_${intf}.info ]
				#	then
						n=1
						i=`getcfgx $configfile index`
						msk=$(printf "%x" $(((16-$i+32)<<2)))
						mi=$((16-$i))
						eflag=0
					while [ $n -le 64 ]
						do
						ipmin=`getcfgx $configfile ip${n}min`
						ipmax=`getcfgx $configfile ip${n}max`
						echo $ipmin $ipmax  >> $tmplogfile
						if [ "x$ipmin" = "xNULL" ] || [ "x$ipmin" = "x" ]
							then
							#no rule;
							break;
						else
							n=$(($n+1))
							if echo $ipmin|grep -q :
								then
								# have rule
								eflag=$(($eflag+1));
								if [ "x$gate6way" = "x" ] || [ "x$gate6way" = "xNULL" ]
									then
									echo "no gateway no network segment route"  >> $tmplogfile
								else
									if [ "x$ipmax" = "xNULL" ] || [ "x$ipmax" = "x" ]
										then
								
										ip6tables -A PREROUTING -t mangle -d ${ipmin} -j MARK --set-mark 0x${msk}000000/0xfc000000 
										echo "ip6tables -A PREROUTING -t mangle -d ${ipmin} -j MARK --set-mark 0x${msk}000000/0xfc000000 " >> $tmplogfile
								
									else
									
										ip6tables -A PREROUTING -t mangle -m iprange --dst-range  ${ipmin}-${ipmax} -j MARK --set-mark 0x${msk}000000/0xfc000000 
										echo "ip6tables -A PREROUTING -t mangle -m iprange --dst-range  ${ipmin}-${ipmax} -j MARK --set-mark 0x${msk}000000/0xfc000000 " >> $tmplogfile
									fi	
									
								fi
							fi
						fi
					done
					if [ "$eflag" != "0" ]		
						then
							echo "ip -6 route add default via $gate6way dev $intf table ${mi} pri ${mi}" >> $tmplogfile
							ip -6 route add default via $gate6way dev $intf table ${mi} pri ${mi}	
							
							if [ $? -ne 0 ]; then
								#voipflag=`ls /var/wan_info/ | grep ${name}_voip`
								#tr069flag=`ls /var/wan_info/ | grep ${name}_tr069`
								voipflag=`getcfgx $configfile servicelist | grep VOIP`							
								tr069flag=`getcfgx $configfile servicelist | grep TR069`							
								if [ "x${voipflag}" != "x" ] && [ "x${tr069flag}" != "x" ] 
									then
									tableid=502
									#add route table
									ip -6 rule add iif br0 fwmark 0x${msk}000000/0xfc000000  table ${tableid} 
									echo "ip -6 rule add iif br0 fwmark 0x${msk}000000/0xfc000000  table ${tableid}" >> $tmplogfile
										tableid=501
									ip -6 rule add iif br0 fwmark 0x${msk}000000/0xfc000000  table ${tableid} 
									echo "ip -6 rule add iif br0 fwmark 0x${msk}000000/0xfc000000  table ${tableid} " >> $tmplogfile
								elif [ "x${voipflag}" != "x" ] 
									then
									tableid=502
									#add route table
									ip -6 rule add iif br0 fwmark 0x${msk}000000/0xfc000000  table ${tableid} 
									echo "ip -6 rule add iif br0 fwmark 0x${msk}000000/0xfc000000  table ${tableid}" >> $tmplogfile

								elif [ "x${tr069flag}" != "x" ] 
									then
									tableid=501
									ip -6 rule add iif br0 fwmark 0x${msk}000000/0xfc000000  table ${tableid} 
									echo "ip -6 rule add iif br0 fwmark 0x${msk}000000/0xfc000000  table ${tableid} " >> $tmplogfile

								else 
									echo "ip rule add  table failed "
								fi
							else
									#add route table
								ip -6 rule add iif br0 fwmark 0x${msk}000000/0xfc000000  table ${mi} pri ${mi} 
								echo "ip -6 rule add iif br0 fwmark 0x${msk}000000/0xfc000000  table ${mi} pri ${mi} " >> $tmplogfile
							fi		
					fi
				#fi
			fi
		fi
	fi
	ip route flush cache
	echo "ip route flush cache" >> $tmplogfile
elif [ "$1" = "del" ]; then
	#del network route
		echo $configfile  >> $tmplogfile
		intf=`getcfgx $configfile intf`
		
		#if [ -f /flash/cfg/app_conf/wancc/${intf}_forwardlist.conf ]
		#if [ -f /var/IPForwardList_${devname}.info ]
		#	then
			n=1
			i=`getcfgx $configfile index`
			msk=$(printf "%x" $(((16-$i+32)<<2)))
			mi=$((16-$i))
			while [ $n -le 64 ] 
				do
				ipmin=`getcfgx $configfile ip${n}min`
				ipmax=`getcfgx $configfile ip${n}max`
				if [ "x$ipmin" = "xNULL" ] || [ "x$ipmin" = "x" ]
					then
					break;
				else
					n=$(($n+1))
					if echo $ipmin|grep -q :
						then
							if [ "x$ipmax" = "xNULL" ] || [ "x$ipmax" = "x" ]
							then
								ip6tables -D PREROUTING -t mangle -d  ${ipmin} -j MARK --set-mark 0x${msk}000000/0xfc000000 
								echo "ip6tables -D PREROUTING -t mangle -d  ${ipmin} -j MARK --set-mark 0x${msk}000000/0xfc000000 " >> $tmplogfile
							
							else				
								ip6tables -D PREROUTING -t mangle -m iprange --dst-range  ${ipmin}-${ipmax} -j MARK --set-mark 0x${msk}000000/0xfc000000 
								echo "ip6tables -D PREROUTING -t mangle -m iprange --dst-range  ${ipmin}-${ipmax} -j MARK --set-mark 0x${msk}000000/0xfc000000 " >> $tmplogfile
							fi
					fi
				fi
			done

			echo "ip -6 route del  table ${mi} " >> $tmplogfile
			ip -6 route del  table ${mi} 
			
				#del route table
			if [ $? -ne 0 ]; then
				ip -6 rule del iif br0 fwmark 0x${msk}000000/0xfc000000  table 501
				echo "ip -6 rule del iif br0 fwmark 0x${msk}000000/0xfc000000  table 501" >> $tmplogfile
				ip -6 rule del iif br0 fwmark 0x${msk}000000/0xfc000000  table 502
				echo "ip -6 rule del iif br0 fwmark 0x${msk}000000/0xfc000000  table 502" >> $tmplogfile
			else
				ip -6 rule del iif br0 fwmark 0x${msk}000000/0xfc000000  table ${mi} 
				echo "ip -6 rule del iif br0 fwmark 0x${msk}000000/0xfc000000  table ${mi}" >> $tmplogfile

			fi
		#fi
		ip route flush cache
		echo "ip route flush cache"
else
	echo -e "Usage:\tipforwardv6.sh add [interface] [gateway]"
	echo -e "\tipforwardv6.sh del [interface] "
fi

exit 0
