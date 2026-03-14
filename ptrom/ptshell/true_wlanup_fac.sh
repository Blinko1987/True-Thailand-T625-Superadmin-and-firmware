#!/bin/sh
mac_2g=`uci -c /ptdata/ get factory_conf.APMAC_1.value`
mac_5g=`uci -c /ptdata/ get factory_conf.APMAC_2.value`
echo "2g mac $mac_2g, 5g mac $mac_5g"
setcfgx /etc/Wireless/RT2860AP_AC/RT2860AP.dat  MacAddress $mac_5g
setcfgx /etc/Wireless/RT2860AP/RT2860AP.dat  MacAddress $mac_2g

ifconfig ra0 up
ifconfig rai0 up
echo "2.4G and 5G wifi up finish"

