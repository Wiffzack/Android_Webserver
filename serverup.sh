 #!/system/bin/sh
 
iptables -F
ip="0.0.0.0"
default="192.168.43.1"

DOWNLINK="1000"
UPLINK="300"
UPLINKL="$((9*$UPLINK/10))"
DEV='rmnet0'
TC='tc'


#echo 40 > /proc/sys/vm/swappiness
#ifconfig rmnet0 txqueuelen 500
#stty -F /dev/ttyHS0 115200 clocal cread -cstopb -parenb crtscts
#setserial -a /dev/ttyHS0 low_latency spd_warp
#setserial -a /dev/ttyGS0 low_latency spd_warp


#settingopt()
#ipopt()

while [ 1 ]
do

oldip=$ip
ip=$(ifconfig rmnet0 |grep "inet addr:" | cut -d: -f2 | awk '{ print $1}'  )
ip2=$(ifconfig wlan0 |grep "inet addr:" | cut -d: -f2 | awk '{ print $1}'  )

if [ $ip != $oldip ]; then

if [ $ip2 != $default ]; then

ip route show table main | grep -Ev '^default'
while read ROUTE ; do 
echo $ROUTE
ip route add table ISP1 $ROUTE 
done
ip route add default via $ip table ISP1
ip route show table main | grep -Ev '^default' 
while read ROUTE ; do 
ip route add table ISP2 $ROUTE 
done
ip route add default via $ip2 table ISP2

iptables -t mangle -A PREROUTING -j CONNMARK --restore-mark 
iptables -t mangle -A PREROUTING -m mark ! --mark 0 -j ACCEPT
iptables -t mangle -A PREROUTING -j MARK --set-mark 10 
iptables -t mangle -A PREROUTING -m statistic --mode random --probability 0.5 -j MARK --set-mark 20
iptables -t mangle -A PREROUTING -j CONNMARK --save-mark 

iptables -t nat -A POSTROUTING -o rmnet0 -j MASQUERADE
iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE
echo "neue Route"
fi

khttp=$(busybox pidof httpd)
busybox kill $khttp
kine=$(busybox pidof inetd)
busybox kill $kine

sysctl -w net.ipv4.ip_forward=1 
iptables -A INPUT -i rmnet0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT 
iptables -A FORWARD -i rmnet0 -o wlan0 -m von traf --ctstate ESTABLISHED,RELATED -j ACCEPT 


iptables -A INPUT -m state --state NEW -p tcp --dport 80 -j ACCEPT

if ping -c 1 8.8.8.8 &> /dev/null
then
echo "Webserver"
  ip=$(ifconfig rmnet0 |grep "inet addr:" | cut -d: -f2 | awk '{ print $1}'  )
  iptables -A INPUT -p tcp -s 0/0 --sport 1024:65535 -d $ip --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT 
  iptables -A OUTPUT -p tcp -s $ip --sport 80 -d 0/0 --dport 1024:65535 -m state --state ESTABLISHED -j ACCEPT
 echo $ip
httpd -p $ip -c /storage/3830-3361/homepage/ -h /storage/3830-3361/homepage/      
else
  echo "no connection"
fi
fi
echo roundx
sleep 200

done









