#！/bin/sh
wantype=`uci  get -c /var deviceinfo.pon_mode.value`
if [ $wantype = "0" -o $wantype = "2"  -o $wantype = "3" ];then
/ptrom/bin/ptoam &
else
taskset 2 /ptrom/bin/ptomci -m -o /var/ptomci &
fi
