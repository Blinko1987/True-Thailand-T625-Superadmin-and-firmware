#!/bin/ash
bs /b/n ingress_class/dir=ds,index=0,cfg={type=generic_filter,fields=dst_mac+ip_protocol}

internetmac=`cfg_cmd getuci /ptdata/factory_conf internetmac 64 | grep "get success!value" | awk -F "=" '{print $2}'`
echo "internetmac=$internetmac"

cmd="bs /bdmf/attr/add ingress_class/dir=ds,index=0 flow string key={dst_mac=$internetmac,protocol=17},result={qos_method=flow,vlan_action=null,action=host,forw_mode=flow,trap_reason=ic_trap0}"
echo "cmd=$cmd"

shell_cmd=`$cmd`
echo "shell_cmd=$shell_cmd"

bs /b/c cpu/index=host meter_cfg[{dir=ds,index=5}]={sir=1000,burst_size=2000}

bs /b/c cpu/index=host reason_cfg[{dir=ds,reason=udef_0}]={meter=5}
