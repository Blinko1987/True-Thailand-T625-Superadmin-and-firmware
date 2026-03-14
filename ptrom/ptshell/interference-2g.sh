#!/bin/sh

wl -i wl1 frameburst 1
wl -i wl1 wme_ac ap be aifsn 1 ecwmin 2 ecwmax 3 txop 0x2f
wl -i wl1 wme_ac ap bk aifsn 1 ecwmin 2 ecwmax 3 txop 0x2f
wl -i wl1 wme_ac ap vi aifsn 1 ecwmin 2 ecwmax 3 txop 0x2f
wl -i wl1 wme_ac ap vo aifsn 1 ecwmin 2 ecwmax 3 txop 0x2f
wl -i wl1 interference_override 2
while true; 
do 
 wl -i wl1 phyreg 0x280 0x366d
 wl -i wl1 phyreg 0x283 0x366d
 wl -i wl1 phyreg 0x289 0xf6
 wl -i wl1 phy_ed_thresh -30
sleep 1;
echo "###############################";
done
