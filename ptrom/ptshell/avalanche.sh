#!/bin/sh

#insmod /lib/swnat.ko
#/rom/ptshell/misc_shell/throughput.sh &
case "$1" in
	1)
		mount -o remount rw /ptrom
		sleep 2
		cp -fr /ptrom/lib/epon_wifi1.ko /ptrom/lib/pt_epon_drv.ko
		cp -fr /ptrom/lib/gpon_wifi1.ko /ptrom/lib/pt_gpon_drv.ko
		sync
	;;
	
	0)
		mount -o remount rw /ptrom
		sleep 2
		cp -fr /ptrom/lib/epon_wifi0.ko /ptrom/lib/pt_epon_drv.ko
		cp -fr /ptrom/lib/gpon_wifi0.ko /ptrom/lib/pt_gpon_drv.ko
		sync
	;;
	
	*)
		echo "usage:avalanche 0|1"
	;;
	
esac
