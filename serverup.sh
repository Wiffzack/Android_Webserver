 #!/system/bin/sh
iptables -F
ip="0.0.0.0"
default="192.168.43.1"

DOWNLINK="1000"
UPLINK="300"
UPLINKL="$((9*$UPLINK/10))"
DEV='rmnet0'
TC='tc'
 

function settingopt() {

hport="1024:6535"
lport="0:1023"
modemif=rmnet0
DOWNLINK=500
UPLINK=220
DEV=rmnet0
IPTABLES='iptables'


# Extra Rules
sysctl -w net.ipv4.conf.default.rp_filter=1
sysctl -w net.ipv4.icmp_echo_ignore_broadcasts=1
sysctl -w net.ipv4.conf.all.rp_filter=1
sysctl -w net.ipv4.conf.default.rp_filter=1
sysctl  -w net/netfilter/nf_conntrack_tcp_loose=0
echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_broadcasts
echo 1 > /proc/sys/net/ipv4/icmp_ignore_bogus_error_responses
sysctl -w net.ipv4.tcp_synack_retries=10
echo 0 > /proc/sys/net/ipv4/tcp_slow_start_after_idle
echo 3000000 > /proc/sys/fs/nr_open
echo 1 > /proc/sys/net/ipv4/ip_forward
echo 4096 > /proc/sys/net/ipv4/route/max_size
echo 2048 > /proc/sys/net/ipv4/route/gc_thresh
echo 100 >  /proc/sys/net/ipv4/neigh/default/unres_qlen
#echo 1 > /proc/sys/net/ipv4/tcp_delack_min
sysctl -w net.ipv4.tcp_max_syn_backlog=4096
# The maximum number of "backlogged sockets".  Default is 128.
sysctl -w net.core.somaxconn=1024

echo Normale Sicherheitsregeln wurden angewandt
iptables -m state --state INVALID -j DROP
iptables -A INPUT -m state --state INVALID -j DROP
iptables -A FORWARD -p tcp --syn -m limit --limit 5/s -j ACCEPT
iptables -A FORWARD -p tcp --tcp-flags SYN,ACK,FIN,RST RST -m limit --limit 1/s -j ACCEPT
iptables -A FORWARD -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT
iptables -A INPUT -p icmp -m limit --limit  1/s --limit-burst 1 -j ACCEPT
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
iptables -p tcp --syn --dport 80 -m connlimit --connlimit-above 20 --connlimit-mask 24 -j DROP
iptables -A INPUT -p tcp --syn -m limit --limit 5 /second --limit-burst 8 -j DROP
iptables -A INPUT -m state --state RELATED,ESTABLISHED -m limit --limit 100/second --limit-burst 100 -j ACCEPT
iptables -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS  --clamp-mss-to-pmtu

## TCP Xmas Tree Scan
### Action for packets
iptables -I FORWARD -p tcp --tcp-flags ALL URG,PSH,FIN -j REJECT --reject-with tcp-reset

#SSH
iptables -I INPUT -p tcp --dport 22 -i rmnet0 -m state --state NEW -m recent --set
iptables -I INPUT -p tcp --dport 22 -i rmnet0 -m state --state NEW -m recent  --update --seconds 60 --hitcount 4 -j DROP

### DROPspoofing packets
iptables -A INPUT -s 10.0.0.0/8 -j DROP 
iptables -A INPUT -s 169.254.0.0/16 -j DROP
iptables -A INPUT -s 172.16.0.0/12 -j DROP
iptables -A INPUT -s 127.0.0.0/8 -j DROP
#iptables -A INPUT -s 192.168.0.0/24 -j DROP

# Droping all invalid packets
iptables -A INPUT -m state --state INVALID -j DROP
#iptables -A FORWARD -m state --state INVALID -j DROP
iptables -A OUTPUT -m state --state INVALID -j DROP

# flooding of RST packets, smurf attack Rejection
iptables -A INPUT -p tcp -m tcp --tcp-flags RST RST -m limit --limit 2/second --limit-burst 2 -j ACCEPT

#DNS Limit
iptables -A INPUT -p udp --dport 53 --set --name dnslimit
iptables -A INPUT -p udp --dport 53 -m recent --update --seconds 2 --hitcount 2 --name dnslimit -j DROP
iptables -A OUTPUT -p udp --dport 53 -m recent --update --seconds 2 --hitcount 2 --name dnslimit -j DROP
iptables -A FORWARD -p udp --dport 53 -m recent --seconds 2 --hitcount 2 --name dnslimit --set -j DROP

iptables  -A INPUT -p tcp --syn --dport 53 -m connlimit --connlimit-above 20 -j DROP

iptables -A INPUT -p tcp --dport 53 -m state --state NEW -m limit --limit 2/second --limit-burst 2 -j ACCEPT
iptables -A INPUT -p udp --dport 53 -m state --state NEW -m limit --limit 2/second --limit-burst 2 -j ACCEPT

#String Filter

#Block Advertising
iptables -I INPUT -p tcp --dport 80 -m string --to 70 --algo bm --string 'GET /advertising' -j DROP

#Aktive FTP
iptables -A INPUT     -p tcp --sport 20 -m state --state ESTABLISHED,RELATED -j DROP
iptables -A OUTPUT -p tcp --dport 20 -m state --state ESTABLISHED -j DROP
 
#Drop Zero Packets
iptables -A INPUT -m length --length 0 -j DROP
iptables -A PREROUTING -p udp -m length --length 28:64 -j DROP
echo hi
}



#echo 40 > /proc/sys/vm/swappiness
#ifconfig rmnet0 txqueuelen 500
#stty -F /dev/ttyHS0 115200 clocal cread -cstopb -parenb crtscts
#setserial -a /dev/ttyHS0 low_latency spd_warp
#setserial -a /dev/ttyGS0 low_latency spd_warp


settingopt
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
echo 1 | tee /proc/sys/net/ipv4/ip_forward
iptables -A INPUT -i rmnet0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT 

iptables -A INPUT -m state --state NEW -p tcp --dport 80 -j ACCEPT

if ping -c 1 192.168.43.109 &> /dev/null
then 
echo "forward Webserver"
iptables -A OUTPUT -p tcp --sport 80 -m conntrack --ctstate ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp --sport 5001 -m conntrack --ctstate ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp --sport 5000 -m conntrack --ctstate ESTABLISHED -j ACCEPT
iptables -A INPUT -p tcp --dport 8080  -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
iptables -A INPUT -m state --state NEW -p tcp --dport 8080 -j ACCEPT
iptables -A INPUT -m state --state NEW -p tcp --dport 5001 -j ACCEPT
iptables -A INPUT -m state --state NEW -p tcp --dport 5000 -j ACCEPT

iptables -A FORWARD -i rmnet0 -o wlan0 -p tcp --syn --dport 80 -m conntrack --ctstate NEW -j ACCEPT
iptables -A FORWARD -i rmnet0 -o wlan0 -p tcp --syn --dport 5001 -m conntrack --ctstate NEW -j ACCEPT
iptables -A FORWARD -i rmnet0 -o wlan0 -p tcp --syn --dport 5000 -m conntrack --ctstate NEW -j ACCEPT
iptables -A FORWARD -i rmnet0 -o wlan0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A FORWARD -i wlan0 -o rmnet0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -t nat -A PREROUTING -i rmnet0 -p tcp --dport 80 -j DNAT --to-destination 192.168.43.109
iptables -t nat -A PREROUTING -i rmnet0 -p tcp --dport 5001 -j DNAT --to-destination 192.168.43.109
iptables -t nat -A PREROUTING -i rmnet0 -p tcp --dport 5000 -j DNAT --to-destination 192.168.43.109
iptables -t nat -A POSTROUTING -o rmnet0 -p tcp --dport 80 -d $ip -j SNAT --to-source 192.168.43.1


iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to 192.168.43.109:80
iptables -A FORWARD -d 192.168.43.109 -p tcp --dport 80 -j ACCEPT
iptables -A FORWARD -i rmnet0 -o wlan0 -j ACCEPT
iptables -A FORWARD -i rmnet0 -o wlan0 -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A FORWARD -i rmnet0 -p tcp --dport 8080 -d 192.168.43.109 -j ACCEPT
iptables -A FORWARD -i rmnet0 -p tcp --dport 5000 -d 192.168.43.109 -j ACCEPT
iptables -A FORWARD -i rmnet0 -p tcp --dport 5001 -d 192.168.43.109 -j ACCEPT
iptables -A PREROUTING -t nat -i rmnet0 -p tcp --dport 8080 -j DNAT --to 192.168.43.109:80
iptables -A PREROUTING -t nat -i rmnet0 -p tcp --dport 5000 -j DNAT --to 192.168.43.109:5000
iptables -A PREROUTING -t nat -i rmnet0 -p tcp --dport 5001 -j DNAT --to 192.168.43.109:5001
iptables -A FORWARD -p tcp -d 192.168.43.109 --dport 8080 -j ACCEPT
iptables -A POSTROUTING -t nat -o wlan0 -j MASQUERADE
else
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
fi
echo roundx
sleep 200

done
