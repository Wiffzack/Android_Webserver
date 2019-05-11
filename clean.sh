#!/system/bin/sh

ip route flush table 1
ip route flush table 2
i=1

iptables -F
count=$(iptables -t nat -L --line-number | grep DNAT | wc -l)

while[[$count != $i]] 
do
  #echo $i
  iptables -t nat -D PREROUTING $i 
  ((i++))
done
