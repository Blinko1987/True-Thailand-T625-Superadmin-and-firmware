#!/bin/sh
echo 0 > /proc/sys/net/ipv6/conf/$1/forwarding
echo 1 > /proc/sys/net/ipv6/conf/$1/accept_ra
echo 30 > /proc/sys/net/ipv6/conf/$1/router_solicitation_delay
echo 30 > /proc/sys/net/ipv6/conf/$1/router_solicitation_interval
echo 10000 > /proc/sys/net/ipv6/conf/$1/router_solicitations
ifconfig $1 down
#20110131, remove by wangjian07@bfw-solutions.com.cn
ifconfig $1 up
