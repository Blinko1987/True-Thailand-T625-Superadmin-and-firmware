#!/bin/sh
INPUT_PASSWD=$1

[ -z ${INPUT_PASSWD} ] && echo "root passwd cannot be null" && exit 0

echo "root:${INPUT_PASSWD}:0:0:Telnet user:/var:/bin/ash" > /var/tel_passwd
