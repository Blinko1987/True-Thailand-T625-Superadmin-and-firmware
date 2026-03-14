#!/bin/sh

#echo "$0 $1 $2"

if [ "$1" = "status" ];then
	mode=`nvram get wl0_mode`
	if [ "$mode" = "ap" ];then
		echo "connecting"
		exit 1
	fi

	num=`wl -i wl0 status | wc -l`
	if [ $num -gt 10 ]; then
		echo "connected"
		exit 0
	else
		echo "connecting"
		exit 1
	fi
else
	nvram set wl0_bss_enabled=1
	#echo "nvram set wl0_bss_enabled=1"

	nvram unset wl0_map
	#echo "nvram unset wl0_map"

	nvram set wl0_mode=wet
	#echo "nvram set wl0_mode=wet"

	nvram set wl0_wep=disabled
	#echo "nvram set wl0_wep=disabled"

	nvram set wl0_auth=0
	#echo "nvram set wl0_auth=0"

	nvram set wl0_ssid="$1"
	#echo "nvram set wl0_ssid="$1""

	if [ "$2" = "open" ];then
		nvram unset wl0_akm
		#echo "nvram unset wl0_akm"
		
		nvram unset wl0_cypto
		#echo "nvram unset wl0_cypto"
		
		nvram unset wl0_wpa_psk
		#echo "nvram unset wl0_wpa_psk"
	else
		nvram set wl0_akm="psk psk2"
		#echo "nvram set wl0_akm=\"psk psk2\""
		
		nvram set wl0_cypto="aes+tkip"
		#echo "nvram set wl0_cypto=\"aes+tkip\""
		
		nvram set wl0_wpa_psk="$2"
		#echo "nvram set wl0_wpa_psk=\"$2\""
	fi

	nvram commit restart
	#echo "nvram commit restart"
fi
