#!/bin/sh

#添加规则
#Usage: ipforward.sh add [interface] [gateway] 
#		ipforward.sh add pon0.50  10.180.24.1 
#删除规则
#Usage: ipforward.sh del [interface] 
#		ipforward.sh del pon0.50  

tmplogfile="/var/ipforward_sh_log"

echo -e "\n---------------`date`---------------" >> $tmplogfile
echo "$0 $1 $2 $3" >> $tmplogfile
devname=$2
gateway=$3
#voipflag=$4
#tr069flag=$5

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
	[ -z "$1" ] && [ -z "$2" ] && [ -z "$3" ] && echo "setcfgx param is null" >> $tmplogfile && exit 0
	param1=${1//./_}
	param2=${2//./_}

	cfg_cmd setuci $param1 $param2 $3 0 2>/dev/null
}

configfile=/var/wanconf/${devname}_wan.conf
Enable_flag=`getcfgx /var/IPForwardModeEnable mode`
 
# wanindex  msk(10)          msk(16)                 msk(2)
# i         (16-i+32)<<2      
# 16~1       128~188         0x80~0xbc (/0xfc)    1000 0000 ~ 1011 1100 (/1111 1100)

if [ "$1" = "add" ] 
  then 
	if [ "$Enable_flag" == "1" ]
	then
		#add network route
		echo $configfile  >> $tmplogfile
		intf=`getcfgx $configfile intf`
		
		if [ "x$intf" != "x" ]
			then
			if [ "x$gateway" = "x" ] || [ "x$gateway" = "xNULL" ]
				then
				echo " gateway is null "  >> $tmplogfile
			else
				#if [ -f /var/IPForwardList_${devname}.info ]
				#	then
					i=`getcfgx $configfile index`
					# 1000 0000 - 1011 1100 
					msk=$(printf "%x" $(((16-$i+32)<<2)))
					mi=$((16-$i))
					echo $mi  >> $tmplogfile
					n=1
					eflag=0
					while [ $n -le 64 ]
						do
						ipmin=`getcfgx $configfile ip${n}min`
						ipmax=`getcfgx $configfile ip${n}max`
						echo $ipmin $ipmax  >> $tmplogfile
						if [ "x$ipmin" = "xNULL" ] || [ "x$ipmin" = "x" ]
							then
							# no rule 
							break;
						else
							n=$(($n+1))
							if echo $ipmin|grep -q :
								then
								continue;
							else
								# have rule
								eflag=$(($eflag+1));
								if [ "x$ipmax" = "xNULL" ] || [ "x$ipmax" = "x" ]
								then										
									iptables -A PREROUTING -t mangle -d ${ipmin} -j MARK --set-mark 0x${msk}000000/0xfc000000
									echo "iptables -A PREROUTING -t mangle -d ${ipmin} -j MARK --set-mark 0x${msk}000000/0xfc000000" >> $tmplogfile
								else
						
									iptables -A PREROUTING -t mangle -m iprange --dst-range  ${ipmin}-${ipmax} -j MARK --set-mark 0x${msk}000000/0xfc000000
									echo "iptables -A PREROUTING -t mangle -m iprange --dst-range  ${ipmin}-${ipmax} -j MARK --set-mark 0x${msk}000000/0xfc000000" >> $tmplogfile
								fi
							fi
						fi
					done
					if [ "$eflag" != "0" ] 
						then 
						echo "ip route add default via $gateway dev $intf table ${mi} pri ${mi} " >> $tmplogfile
						ip route add default via $gateway dev $intf table ${mi} pri ${mi}			
						if [ $? -ne 0 ]; then
							#voipflag=`getcfgx $configfile index | grep ${name}_voip`
							#tr069flag=`ls /var/wan_info/ | grep ${name}_tr069`
							voipflag=`getcfgx $configfile servicelist | grep VOIP`							
							tr069flag=`getcfgx $configfile servicelist | grep TR069`							
							
							if [ "x${voipflag}" != "x" ] && [ "x${tr069flag}" != "x" ] 
								then
								tableid=190
								#add route table
								ip  rule add iif br0 fwmark 0x${msk}000000/0xfc000000 table ${tableid} 
								echo "ip  rule add iif br0 fwmark 0x${msk}000000/0xfc000000 table ${tableid}" >> $tmplogfile
								tableid=201
								ip  rule add iif br0 fwmark 0x${msk}000000/0xfc000000 table ${tableid} 
								echo "ip  rule add iif br0 fwmark 0x${msk}000000/0xfc000000 table ${tableid} " >> $tmplogfile

							elif [ "x${voipflag}" != "x" ] 
								then
								tableid=190
								#add route table
								ip  rule add iif br0 fwmark 0x${msk}000000/0xfc000000 table ${tableid} 
								echo "ip  rule add iif br0 fwmark 0x${msk}000000/0xfc000000 table ${tableid} " >> $tmplogfile
								
							elif [ "x${tr069flag}" != "x" ] 
								then
								tableid=201
								ip  rule add iif br0 fwmark 0x${msk}000000/0xfc000000 table ${tableid} 
								echo "ip  rule add iif br0 fwmark 0x${msk}000000/0xfc000000 table ${tableid}" >> $tmplogfile
							else 
								echo "ip rule add  table failed "
							fi
						else
							#add route table
							ip rule add iif br0 fwmark 0x${msk}000000/0xfc000000 table ${mi} pri ${mi}
							echo "ip rule add iif br0 fwmark 0x${msk}000000/0xfc000000 table ${mi} pri ${mi}" >> $tmplogfile
		
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
			echo $mi  >> $tmplogfile
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
						continue;
					else
						if [ "x$ipmax" = "xNULL" ] || [ "x$ipmax" = "x" ]
						then
							iptables -D PREROUTING -t mangle -d ${ipmin} -j MARK --set-mark 0x${msk}000000/0xfc000000
							echo "iptables -D PREROUTING -t mangle -d ${ipmin} -j MARK --set-mark 0x${msk}000000/0xfc000000" >> $tmplogfile
						else
							
							#add default route
							iptables -D PREROUTING -t mangle -m iprange --dst-range  ${ipmin}-${ipmax} -j MARK --set-mark 0x${msk}000000/0xfc000000
							echo "iptables -D PREROUTING -t mangle -m iprange --dst-range  ${ipmin}-${ipmax} -j MARK --set-mark 0x${msk}000000/0xfc000000" >> $tmplogfile
						fi	
					fi
				fi
			done
			
			echo "ip route del  table ${mi}" >> $tmplogfile
			ip route del  table ${mi} 
			
			if [ $? -ne 0 ]; then
				ip rule del iif br0 fwmark 0x${msk}000000/0xfc000000 table 190 
				ip rule del iif br0 fwmark 0x${msk}000000/0xfc000000 table 201 
				echo "ip rule del iif br0 fwmark 0x${msk}000000/0xfc000000 table 190" >> $tmplogfile
				echo "ip rule del iif br0 fwmark 0x${msk}000000/0xfc000000 table 201" >> $tmplogfile
			else
				ip rule del iif br0 fwmark 0x${msk}000000/0xfc000000 table ${mi}
				echo "ip rule del iif br0 fwmark 0x${msk}000000/0xfc000000 table ${mi}" >> $tmplogfile
			
			fi
		#fi
		
		ip route flush cache
		echo "ip route flush cache" >> $tmplogfile
	
else
	echo -e "Usage:\tipforward.sh.sh add [interface] [gateway]"
	echo -e "\tipforward.sh.sh del [interface] "
fi

exit 0
