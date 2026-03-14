#!/bin/sh
echo "Pre_initialization script"
PATH=/bin:/sbin:/usr/bin:/usr/sbin
export PATH

#case $(uname -r) in
#    2.6*|2.7*)	;;
#    *)		exit 0;;
#esac

udev_root=/dev
# Check for missing binaries
UDEV_BIN=/sbin/udevd
test -x $UDEV_BIN || echo "test -x $UDEV_BIN" || exit 5
UDEVSTART_BIN=/sbin/udevstart
test -x $UDEVSTART_BIN || echo "test -x $UDEVSTART_BIN" || exit 5

# Check for config file and read it
UDEV_CONFIG=/etc/udev/udev.conf
test -r $UDEV_CONFIG || echo "test -r $UDEV_CONFIG" || exit 6
. $UDEV_CONFIG

# /bin/mount -t proc proc /proc
# /bin/mount -t tmpfs tmpfs /tmp
# Directory where sysfs is mounted
SYSFS_DIR=/sys

# mount sysfs if it's not yet mounted
if [ ! -d $SYSFS_DIR ]; then
echo "${0}: SYSFS_DIR \"$SYSFS_DIR\" not found"
#exit 1
fi
grep -q "^sysfs $SYSFS_DIR" /proc/mounts || mount -t sysfs sys /sys 
#|| exit 1

# mount $udev_root as ramfs if it's not yet mounted
# we know 2.6 kernels always support ramfs
if [ ! -d $udev_root ]; then
echo "${0}: udev_root \"$udev_root\" not found"
#exit 1
fi
grep -q "^udev $udev_root" /proc/mounts || mount -t ramfs udev $udev_root || exit 1
mknod /dev/ttyS0 c 4 64
mkdir $udev_root/pts $udev_root/shm
mknod -m 0666 /dev/null c 1 3
mknod -m 0666 /dev/zero c 1 5
mknod -m 0600 /dev/console c 5 1

# populate /dev (normally)
echo -n "Populating $udev_root using udev: "
echo -e '\000\000\000\000' > /proc/sys/kernel/hotplug
$UDEV_BIN -d || (echo "FAIL" && exit 1)
$UDEVSTART_BIN || (echo "FAIL" && exit 1)
mount -t devpts /dev/pts /dev/pts || (echo "FAIL" && exit 1)
echo "done"		
