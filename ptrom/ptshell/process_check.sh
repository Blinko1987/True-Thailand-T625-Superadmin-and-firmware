#!/bin/sh

export PATH=/userfs/bin:/ptrom/ptshell:/usr/bin:/usr/sbin:/bin:/sbin:/ptrom/bin
export LD_LIBRARY_PATH=/lib:/usr/lib:/ptrom/lib:/usr/lib/glib-2.0

hgcsip_count=0
hgcmegaco_count=0
gdecms_count=0
saf_count=0

smart_switch=`uci get -c /ptdata sysinfo_conf.SmartSwitch.value`


hgcsip_check()
{
    if [ -f /var/voip_0 ] || [ -f /var/voip_1 ]
    then
                
                PROC_ID=`pidof sip`		
                if [ -z "$PROC_ID" ] && [ -f /var/VOIP_RUN ]; then
				
					sleep 5
					
					PROC_ID_ONE=`pidof sip`
					
					if [ -z "$PROC_ID_ONE" ] && [ -f /var/VOIP_RUN ]; then
					
						echo "no sip 1"
					
						sleep 5
					
						PROC_ID_TWO=`pidof sip`
					
						if [ -z "$PROC_ID_TWO" ] && [ -f /var/VOIP_RUN ]; then
						
							echo "no sip 2"
					
							sleep 5
							
							PROC_ID_THREE=`pidof sip`
					
							if [ -z "$PROC_ID_THREE" ] && [ -f /var/VOIP_RUN ]; then
					
								echo "hgcsip apprently not Exist,at:`date`,Will Restart Auto."
								
								hgcsip_count=$((hgcsip_count+1))
								
								if test $hgcsip_count -ge 3
								then
								
									killall sip
									/usr/bin/cli /home/cli/voice/voip/kdeinitial
									sip &
									hgcsip_count=0
								fi								
							else
								hgcsip_count=0		
							fi
						
						fi
					
					fi
				
				fi	
	else
		hgcsip_count=0
			
    fi
}

hgcmegaco_check()
{
	if [ -f /var/voip_2 ]
	then
				PROC_ID=`pidof h248`
				
				if [ -z "$PROC_ID" ] && [ -f /var/VOIP_RUN ]; then
				
					sleep 5
					
					PROC_ID_ONE=`pidof h248`
					
					if [ -z "$PROC_ID_ONE" ] && [ -f /var/VOIP_RUN ]; then
					
						echo "no h248 1"
					
						sleep 5
					
						PROC_ID_TWO=`pidof h248`
					
						if [ -z "$PROC_ID_TWO" ] && [ -f /var/VOIP_RUN ]; then
						
							echo "no h248 2"
					
							sleep 5
							
							PROC_ID_THREE=`pidof h248`
					
							if [ -z "$PROC_ID" ] && [ -f /var/VOIP_RUN ]; then
								echo "h248 apprently not Exist,at:`date`,Will Restart Auto."
								
								
								hgcmegaco_count=$((hgcmegaco_count+1))
								
								if test $hgcmegaco_count -ge 3
								then
								
									killall sip
									sip &
									hgcmegaco_count=0
								fi	
								
								
								killall h248
								/usr/bin/cli /home/cli/voice/voip/kdeinitial
								h248 &
							fi	
						else	
							hgcmegaco_count=0
						fi
					
					fi
				
				fi
	else
		hgcmegaco_count=0
	
    fi
}

tr069_check()
{
	PROC_ID=`pidof tr069`
	if [ -z "$PROC_ID" ]
	then
		echo "tr069 not exist" > /var/process.log
		/ptrom/bin/tr069 -F /ptconf/ -M 1 -L 5 -S 2000 -X 1 >/dev/null 2>&1 &
	fi
}

lancc_check()
{
    PROC_ID=`pidof lanmgr`
    if [ -z "$PROC_ID" ]
    then
        echo "$(date): lanmgr exit" >> /var/process.log
        logger -p 8 "lanmgr exit"
        /ptrom/bin/lanmgr >/dev/null 2>&1 &
    fi
}

wifi_check()
{
	file="/ptdata/factorymodeflag"
	if [ -f "$file" ]
	then
		echo "$file found."
	else
		PROC_ID=`pidof wifimgr`
		if [ -z "$PROC_ID" ]
		then
			echo "wifimgr not exist" > /var/process.log
			/ptrom/bin/wifimgr >/dev/null 2>&1 &
		fi
		PROC_ID_ONE=`pidof wifictl`
		if [ -z "$PROC_ID_ONE" ]
		then
			echo "wifictl not exist" > /var/process.log
			/ptrom/bin/wifictl >/dev/null 2>&1 &
		fi
	fi
}

daemon_check()
{
	PROC_ID=`pidof dbus-daemon`
	if [ -z "$PROC_ID" ]; then
		killall dbus-daemon
		killall igdmgr
		ps | grep saf | grep -v grep | awk '{print $1}' | xargs kill -9
		ps | grep dbuscheck | grep -v grep | awk '{print $1}' | xargs kill -9
		rm -f /var/run/dbus.pid
		mkdir -m 0755 -p /var/lib/dbus
		mkdir -m 0755 -p /var/run/dbus
		[ -x /usr/bin/dbus-uuidgen ] && /usr/bin/dbus-uuidgen --ensure
		/usr/sbin/dbus-daemon --system
		sleep 2
		/ptrom/bin/igdmgr &
		sleep 1
		if [ "$smart_switch" == "1" ]; then
			saf service 4 5 3 &
		fi
		/ptrom/bin/dbuscheck &
	fi
}

gdecms_check()
{
	PROC_ID=`pidof igdmgr`
	DBUS_PROC=`pidof dbus-daemon`
	if [ -z "$PROC_ID" ] && [ -n "$DBUS_PROC" ]; then
		if test $gdecms_count -ge 3
		then
			killall igdmgr
			/ptrom/bin/igdmgr &
			gdecms_count=0
			sleep 1
		else
			gdecms_count=$((gdecms_count+1))			
		fi
	else
		gdecms_count=0
	fi
}

saf_check()
{
	PROC_ID=`pidof saf`
	SAF_PROC=`echo $PROC_ID | grep " "`
	DBUS_PROC=`pidof dbus-daemon`
	if [ -z "$PROC_ID" ] || [ -z "$SAF_PROC" ] && [ -n "$DBUS_PROC" ]; then
		if test $saf_count -ge 3
		then
			ps | grep saf | grep -v grep | awk '{print $1}' | xargs kill -9
			saf service 4 5 3 &
			saf_count=0
			sleep 1
		else
			saf_count=$((saf_count+1))			
		fi
	else
		saf_count=0
	fi
}

dyg_check()
{
	DYG_HAPPEN=`cat /sys/module/xpon/parameters/dying_gasp_happen`
	if [ "$DYG_HAPPEN" == "1" ];then
		led_cmd set power_led  blk
	else
		led_cmd set power_led  on
	fi
}

eventmgr_check()
{
	PROC_ID=`pidof eventmgr`
	if [ -z "$PROC_ID" ]
	then
		echo "eventmgr not exist" > /var/process.log
		eventmgr &
	fi
}

main()
{
	while :
	do
		sleep 13
		# daemon_check
		tr069_check
		lancc_check
		wifi_check
		dyg_check
		eventmgr_check
		#hgcsip_check
		#hgcmegaco_check
		# gdecms_check
		# if [ "$smart_switch" == "1" ]; then
			# saf_check
		# fi
	done
}

main

