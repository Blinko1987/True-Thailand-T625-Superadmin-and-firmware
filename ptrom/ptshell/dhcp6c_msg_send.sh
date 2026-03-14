#!/bin/sh
echo "dhcp6c-msg-send-script start" > /dev/ttyAMA1
export PATH=/home/bin:/home/scripts:/opt/bin:/bin:/sbin:/usr/bin:/usr/local/jamvm/bin:/opt/scripts:/usr/sbin:/opt/bin:/opt/sbin:/opt/usr/bin:/opt/usr/sbin:/ptrom/bin:/userfs/bin
export LD_LIBRARY_PATH=/lib:/lib/gpl:/lib64/gpl:/lib64:/ptrom/lib

ubus call fh_svcmgr_dhcp6c fh_svcmgr_dhcp6c_notify  "{\"prefixAssigned\":\"$1\",\"addrAssigned\":\"$2\",\"dnsAssigned\":\"$3\",\"domainNameAssigned\":\"$4\",\"aftrAssigned\":\"$5\",\"sitePrefix\":\"$6\",\"prefixPltime\":\"$7\",\"prefixVltime\":\"$8\",\"prefixCmd\":\"$9\",\"ifname\":\"$10\",\"ipv6address\":\"$11\",\"pdIfAddress\":\"$12\",\"addrCmd\":\"$13\",\"dns1\":\"$14\",\"dns2\":\"$15\",\"domainName\":\"$16\",\"aftr\":\"$17\"}"

echo "dhcp6c-msg-send-script end" > /dev/ttyAMA1