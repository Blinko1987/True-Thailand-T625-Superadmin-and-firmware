#!/bin/sh

mount -o remount rw /ptdata

cp -f /etc/Wireless/RT2860AP_AC/RT30xxEEPROM.bin /ptdata/RT30xxEEPROM.bin

mount -o remount,ro  /dev/ubi2_0 /ptdata

echo "save wlan cali file finished"

