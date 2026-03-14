#!/bin/sh
echo "Pre_initialization script"
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/userfs/bin/
export PATH


mount -a
/bin/busybox cp -a /usr/etc /tmp
/ptrom/ptshell/udevinit.sh

mknod /dev/pon c 190 0
mknod /dev/ponvlan c 215 0
mknod /dev/ponmacfilter c 216 0

mknod /dev/qdma_lan c 119 0
mknod /dev/qdma_wan c 120 0
mknod /dev/fe c 226 0
mknod /dev/xponmap c 210 0
mknod /dev/hwnat0 c 220 0
mknod /dev/acl0 c 230 0
mknod /dev/ac0 c 240 0
mknod /dev/mtr0 c 250 0
mknod /dev/gpon_flow c 184 0
mknod /dev/ifc c 241 0
mknod /dev/cpu_interrupt c 224 0

#voip dev
mknod /dev/vdsp c 232 0
mknod /dev/slic c 231 0
mknod /dev/spi c 233 0

/userfs/bin/ubiattach /dev/ubi_ctrl -O 2048 -m 11 -d 2
if [ ! -d /sys/class/ubi/ubi2 ]
then                              
    /userfs/bin/flash_erase /dev/mtd11 0 0 
	/userfs/bin/ubiattach /dev/ubi_ctrl -O 2048 -m 11 -d 2 
fi 
if [ ! -c /dev/ubi2 ]
then
	MAJOR1=`awk -F ':' '{print $1}' /sys/class/ubi/ubi2/dev`
	MINOR1=`awk -F ':' '{print $2}' /sys/class/ubi/ubi2/dev` 
	mknod /dev/ubi2 c $MAJOR1 $MINOR1
fi
	VOLUMES_COUNT=`cat /sys/class/ubi/ubi2/volumes_count`
if [ $VOLUMES_COUNT -eq 0 ]
then
	/userfs/bin/ubimkvol /dev/ubi2 -N ptdata -m
fi
if [ ! -c /dev/ubi2_0 ]
then
	MAJOR2=`awk -F ':' '{print $1}' /sys/class/ubi/ubi2_0/dev`
	MINOR2=`awk -F ':' '{print $2}' /sys/class/ubi/ubi2_0/dev` 
	mknod /dev/ubi2_0 c $MAJOR2 $MINOR2
fi
mount -t ubifs -o sync, ubi2:ptdata /ptdata

/userfs/bin/ubiattach /dev/ubi_ctrl -O 2048 -m 10 -d 3
if [ ! -d /sys/class/ubi/ubi3 ]
then                              
    /userfs/bin/flash_erase /dev/mtd10 0 0 
	/userfs/bin/ubiattach /dev/ubi_ctrl -O 2048 -m 10 -d 3
fi 
if [ ! -c /dev/ubi3 ]
then
	MAJOR1=`awk -F ':' '{print $1}' /sys/class/ubi/ubi3/dev`
	MINOR1=`awk -F ':' '{print $2}' /sys/class/ubi/ubi3/dev` 
	mknod /dev/ubi3 c $MAJOR1 $MINOR1
fi
    VOLUMES_COUNT=0
	VOLUMES_COUNT=`cat /sys/class/ubi/ubi3/volumes_count`
if [ $VOLUMES_COUNT -eq 0 ]
then
	/userfs/bin/ubimkvol /dev/ubi3 -N ptconf -m
fi
if [ ! -c /dev/ubi3_0 ]
then
	MAJOR2=`awk -F ':' '{print $1}' /sys/class/ubi/ubi3_0/dev`
	MINOR2=`awk -F ':' '{print $2}' /sys/class/ubi/ubi3_0/dev` 
	mknod /dev/ubi3_0 c $MAJOR2 $MINOR2
fi
if [ ! -f /ptdata/nand_enable ]
then
mount -t ubifs -o sync,rw ubi3:ptconf /ptconf
else
mount -r -o sync -t ubifs ubi3:ptconf /ptconf
fi

# exec /bin/init
# exec /linuxrc
exec /sbin/init
