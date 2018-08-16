#!/system/bin/sh
echo "kill httpd"
khttp=$(busybox pidof httpd)
busybox kill $khttp
kine=$(busybox pidof inetd)
busybox kill $kine
