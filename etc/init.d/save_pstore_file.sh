#!/bin/sh

pstoreFile="/sys/fs/pstore/dmesg-ramoops-0"
pstorePath="/ptconf/pstore"
pstorelogFile="/ptconf/pstore/pstoreLog.tar.gz"
file1="/var/pstoreLog/dmesg-ramoops-0"
file2="/var/pstoreLogold/pstoreLog/dmesg-ramoops-0"

if [[ ! -f "$pstoreFile" ]]; then
	echo "has no pstore file"
else
	echo "need to copy pstore file"
	if [[ ! -d "$pstorePath" ]]; then
	   mkdir /ptconf/pstore
	fi 
	if [[ ! -f "$pstorelogFile" ]]; then
	   echo "has no pstorelogFile"
	   mkdir /var/pstoreLog
	   cp -f /sys/fs/pstore/* /var/pstoreLog/
	   tar -zcvf /var/pstoreLog.tar.gz -C /var/ pstoreLog
	   cp -f /var/pstoreLog.tar.gz /ptconf/pstore/
	   echo "copy pstore file"
	else
	   echo "has pstorelogFile"
	   mkdir /var/pstoreLogold
	   mkdir /var/pstoreLog
	   cp -f /sys/fs/pstore/* /var/pstoreLog
	   tar -zcvf /var/pstoreLog.tar.gz -C /var/ pstoreLog
	   cp -f /ptconf/pstore/pstoreLog.tar.gz /var/pstoreLogold/
	   tar -zxvf /var/pstoreLogold/pstoreLog.tar.gz -C /var/pstoreLogold
	   value1=`md5sum ${file1} | awk '{ print $1 }'`
	   echo "md5value1:$value1"
	   value2=`md5sum ${file2} | awk '{ print $1 }'`
	   echo "md5value2:$value2"
       if [  "${value1}" != "${value2}" ];then
	      rm -rf /ptconf/pstore/pstoreLog.tar.gz
	      cp -f /var/pstoreLog.tar.gz /ptconf/pstore/
		  rm -f /sys/fs/pstore/*
		  echo "copy pstore file"
	   fi
    fi
fi	