#!/bin/sh
echo "rastatus-script start" > /dev/ttyAMA1
export PATH=/home/bin:/home/scripts:/opt/bin:/bin:/sbin:/usr/bin:/usr/local/jamvm/bin:/opt/scripts:/usr/sbin:/opt/bin:/opt/sbin:/opt/usr/bin:/opt/usr/sbin:/ptrom/bin:/userfs/bin:
export LD_LIBRARY_PATH=/lib:/lib/gpl:/lib64/gpl:/lib64:/ptrom/lib
sleep 1
ubus call fh_svcmgr_dhcp6c fh_svcmgr_rastatus_notify  "{\"pio_prefix\":\"$1\",\"pio_prefixLen\":\"$2\",\"pio_plt\":\"$3\",\"pio_vlt\":\"$4\",\"pio_L_flag\":\"$5\",\"pio_A_flag\":\"$6\",\"dns1\":\"$7\",\"dns2\":\"$8\",\"dns_lifetime\":\"$9\",\"domainName\":\"$10\",\"domainName_lifetime\":\"$11\",\"router\":\"$12\",\"router_lifetime\":\"$13\",\"router_M_flags\":\"$14\",\"router_O_flags\":\"$15\",\"ifName\":\"$16\"}"

echo "rastatus-script end" > /dev/ttyAMA1