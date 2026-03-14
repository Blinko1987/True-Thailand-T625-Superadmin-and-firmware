#!/bin/sh

#####创建/var/fhsys.info文件
SYS_INFO_FILE=/var/fhsys_info
if [ ! -f $SYS_INFO_FILE ]; then  
	touch $SYS_INFO_FILE
fi

##1.读取area_code
AREA_CODE=`uci get -c /ptconf sysinfo_conf.area_code.value`

##2.组装软件版本号
if [ "$AREA_CODE" == "Sichuan" ];then
	##3.版本号+厂家代号+设备型号
	DEFAULT_SV="40FHC4"
	
	##4.软件版本
	SUB_SV=`uci get -c /ptrom SoftwareVersionTable_conf.${AREA_CODE}.value`
	
	##5.四川版本号
	SW_VERSION=$DEFAULT_SV$SUB_SV
	
else
	##6.读取统一版本号，/ptrom/ptconf/sysinfo_conf文件中的统一软件版本号	
	SW_VERSION=`uci get -c /ptrom/ptconf sysinfo_conf.SoftwareVersion.value`
fi

##7.生成软件版本号
uci set -c /var fhsys_info.SoftwareVersion=key
uci set -c /var fhsys_info.SoftwareVersion.value=$SW_VERSION
uci set -c /var fhsys_info.SoftwareVersion.encryflag=0
uci commit -c /var/ fhsys_info

echo "exit creat_fhsys_info"
