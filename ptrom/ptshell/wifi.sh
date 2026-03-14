#!/bin/bash
file="/ptdata/factorymodeflag"
if [ -f "$file" ]
then
	echo "$file found."
else
	wifictl &
	wifimgr &
fi