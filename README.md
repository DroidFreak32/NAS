# NAS Setup
This repo contains alls the files/configs I use for my DIY Nas.
While serving as a reference for myself in the future, I also plan on documenting the entire process here.

This includes
- Debian bookworm installation with BTRFS partition layout
- Setting up snapper for OS Snapshots
- Setting up my media drives with the help of SnapRAID and mergerfs
- Installing Proxmox, Docker with IPv6 support

##### Hardware:
Motherboard:
- TOPTON Mini ITX Motherboard

CPU:
- Jasper Lake - Intel Pentium N6005

Storage:
- 2x1.0TB M.2 NVMe SSDs as Boot drive
- 3x16TB WD Ultrastar HDDs
- 1x20TB WD Ultrastar HDD

Case:
- Fractal Design Node 304

#### Setup/Configs

##### `/etc/fstab`
```fstab
LABEL=BTRFS_ROOTFS   /                       btrfs   defaults,noatime,compress=zstd,subvol=@           0   0
LABEL=BTRFS_ROOTFS   /.snapshots             btrfs   defaults,noatime,compress=zstd,subvol=@snapshots  0   0
LABEL=BTRFS_ROOTFS   /home                   btrfs   defaults,noatime,compress=zstd,subvol=@home       0   0
LABEL=BTRFS_ROOTFS   /opt                    btrfs   defaults,noatime,compress=zstd,subvol=@opt        0   0
LABEL=BTRFS_ROOTFS   /storage/downloads      btrfs   defaults,noatime,subvol=@downloads                0   0
LABEL=BTRFS_ROOTFS   /var/cache              btrfs   defaults,noatime,compress=zstd,subvol=@cache      0   0
LABEL=BTRFS_ROOTFS   /var/crash              btrfs   defaults,noatime,compress=zstd,subvol=@crash      0   0
LABEL=BTRFS_ROOTFS   /var/lib/containers     btrfs   defaults,noatime,compress=zstd,subvol=@containers 0   0
LABEL=BTRFS_ROOTFS   /var/lib/docker         btrfs   defaults,noatime,compress=zstd,subvol=@docker     0   0
LABEL=BTRFS_ROOTFS   /var/lib/jellyfin       btrfs   defaults,noatime,compress=zstd,subvol=@jellyfin   0   0
LABEL=BTRFS_ROOTFS   /var/lib/libvirt/images btrfs   defaults,noatime,compress=zstd,subvol=@images     0   0
LABEL=BTRFS_ROOTFS   /var/log                btrfs   defaults,noatime,compress=zstd,subvol=@log        0   0
LABEL=BTRFS_ROOTFS   /var/spool              btrfs   defaults,noatime,compress=zstd,subvol=@spool      0   0
LABEL=BTRFS_ROOTFS   /var/tmp                btrfs   defaults,noatime,compress=zstd,subvol=@tmp        0   0
LABEL=BTRFS_ROOTFS   /var/www                btrfs   defaults,noatime,compress=zstd,subvol=@www        0   0

# Publicly exposed content
LABEL=publicdrive /srv/http                     btrfs noatime,nofail,subvol=@http          0   0
LABEL=publicdrive /srv/http/mirror/archlinux    btrfs noatime,nofail,subvol=@archmirror    0   0
LABEL=publicdrive /srv/transfer                 btrfs noatime,nofail,subvol=@transfer      0   0

# MergerFS data drives
LABEL=data_d1 /storage/disk1                     btrfs defaults,noatime,nofail          0   0
LABEL=data_d2 /storage/disk2                     btrfs defaults,noatime,nofail,x-systemd.requires-mounts-for=/storage/disk1    0   0

# SnapRAID Parity drive
LABEL=parity1 /storage/parity1                   btrfs defaults,noatime,nofail,x-systemd.requires-mounts-for=/storage/disk2     0   0

# MergerFS Pool
/storage/disk* /storage/pool fuse.mergerfs defaults,noatime,nofail,x-systemd.requires-mounts-for=/storage/disk2,nonempty,noatime,cache.files=off,moveonenospc=true,category.create=mfs,minfreespace=250G,nfsopenhack=all,fsname=mergerfs 0 0

# /boot/efi was on /dev/nvme0n1p1 during installation
UUID=9536-141A  /boot/efi       vfat    umask=0077      0       1
```

##### `/etc/snapraid.conf`
```bash
# SnapRAID configuration file

# Parity location(s)
1-parity /storage/parity1/snapraid.parity
# 2-parity /mnt/parity2/snapraid.parity

# Content file location(s)
content /var/snapraid.content
content /storage/disk1/.snapraid.content
content /storage/disk2/.snapraid.content

# Data disks
data d1 /storage/disk1
data d2 /storage/disk2

# Excludes hidden files and directories
exclude *.!sync
exclude *.unrecoverable
exclude ._.DS_Store
exclude ._AppleDouble
exclude .AppleDB
exclude .AppleDouble
exclude .DS_Store
exclude .fseventsd
exclude .nfo
exclude .Spotlight-V100
exclude .TemporaryItems
exclude .Thumbs.db
exclude .Trashes
exclude /lost+found/
exclude /tmp/
exclude appdata/
```

#### Installing Cockpit
https://cockpit-project.org/running.html#debian

```bash
# Exporting NFS Shares
# Grab the latest cockpit debs
wget https://repo.45drives.com/debian/pool/main/c/cockpit-identities/"$(curl -s https://repo.45drives.com/debian/pool/main/c/cockpit-identities/ | grep -o -P 'cock.*?deb' | tail -n1)"
wget https://repo.45drives.com/debian/pool/main/c/cockpit-file-sharing/"$(curl -s https://repo.45drives.com/debian/pool/main/c/cockpit-file-sharing/ | grep -o -P 'cock.*?deb' | tail -n1)"

sudo apt install ./cockpit-file-sharing_3.3.4-1focal_all.deb ./cockpit-identities_0.1.12-1focal_all.deb
```

### Networking Setup
#### `/etc/network/interfaces` Interface configuration
```bash
source /etc/network/interfaces.d/*

auto lo
iface lo inet loopback

iface enp4s0 inet manual

iface enp5s0 inet manual

iface enp7s0 inet manual

iface enp6s0 inet manual

auto vmbr0
iface vmbr0 inet static
   address 192.168.1.100/24
   gateway 192.168.1.1
   bridge-ports enp6s0
   bridge-stp on
   bridge-vlan-aware yes
   bridge-vids 2-4094
   metric 2048
   pre-up echo 2 > /proc/sys/net/ipv6/conf/vmbr0/accept_ra
   post-up echo 2 > /proc/sys/net/ipv6/conf/vmbr0/accept_ra
#LAN

auto vmbr1
iface vmbr1 inet static
   address 192.168.0.2/24
   bridge-ports enp4s0
   bridge-stp off
   bridge-fd 0
   bridge-vlan-aware yes
   bridge-vids 2-4094
#VMNet

auto ppp0
iface ppp0 inet ppp
   provider dsl-provider
# Use PPPoE for direct internet access
```

#### PPPoE Setup

##### Allow IPv6 option for ppp
```bash
printf "debug\n+ipv6\nipv6 ,\n" | sudo tee -a /etc/ppp/options
```

##### `/etc/ppp/peers/dsl-provider`
```bash
defaultroute6
nic-vmbr0
user "<PPP_Username>"
```
##### `/etc/ppp/ip-up.d/1accept_ra`
```bash
#!/bin/sh
# Ensure accept_ra = 2 so that we slaac our ppp interface.
sysctl -w net.ipv6.conf."$PPP_IFACE".accept_ra=2
# Prioritize PPP connection as the default route
ip route add default dev $PPP_IFACE
```

##### `/etc/ppp/ipv6-up.d/1accept_ra`
```bash
#!/bin/sh
# Ensure accept_ra = 2 so that we slaac our ppp interface.
# sysctl -w net.ipv6.conf."$PPP_IFACE".accept_ra=2

# Start the wide-dhcpv6-client to get IPv6 IP from ISP
systemctl start wide-dhcpv6-client.service

# Prioritize PPP connection as the default route
ip -6 route del default dev $PPP_IFACE
ip -6 route add default dev $PPP_IFACE metric 1
```

##### Configure `wide-dhcpv6-client` to give us a public IPv6 address on the `ppp0` interface
##### `/etc/wide-dhcpv6/dhcp6c.conf`
```bash
interface ppp0 {
        send ia-na 0;
        send ia-pd 1;
};
id-assoc na 0 { };
id-assoc pd 1 { };
```

#### Docker IPv6 Support
##### `/etc/docker/daemon.json`
```json
{
  "ipv6": true,
  "fixed-cidr-v6": "fd00:bad:c0de::/48",
  "experimental": true,
  "ip6tables": true
}
```

#### Firewall Setup
##### First we will need to create [IPSets](https://wiki.archlinux.org/title/Ipset). Example:
```bash
sudo ipset create lan hash:net
sudo ipset add lan 192.168.1.0/24
```

This can be used later in our IPTables Rules instead of specifying the IPaddresses manually.
Current Filewall Rules:

- IPv4 Rules:

##### `/etc/iptables/rules.v4`
```bash
*filter
# Setting up a "deny all-accept all" policy
# Allow all outgoing, but deny/drop all incoming and forwarding traffic
:INPUT DROP [0:0]
:FORWARD DROP [0:0]
:OUTPUT ACCEPT [0:0]

# Add custom Docker chain to prevent unexpected firewall bypass [1/2]
# https://old.reddit.com/r/selfhosted/comments/ocqg1j/psa_docker_bypasses_ufw/h3w6tec/
:DOCKER-USER - [0:0]

# Custom per-protocol chains
# Defining custom rules for UDP protocol.
:UDP - [0:0]
# Defining custom rules for TCP protocol.
:TCP - [0:0]
# Defining custom rules for ICMP protocol.
:ICMP - [0:0]

# Defining custom chain to Log and ACCEPT/DROP
# https://stackoverflow.com/a/29544353/6437140
:LOG_ACCEPT - [0:0]
:LOG_DROP - [0:0]
-A LOG_ACCEPT -j LOG --log-level 6 --log-prefix "INPUT:ACCEPT: "
-A LOG_ACCEPT -j ACCEPT
-A LOG_DROP -j LOG --log-level 6 --log-prefix "INPUT:DROP: "
-A LOG_DROP -j DROP

# Allowing packets through the loopback interface, which is used for local connections
-A INPUT -i lo -j ACCEPT

# https://forums.gentoo.org/viewtopic-t-991502-start-0.html
-A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu

# Allow established sessions to receive traffic
-A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow DHCP requests
-A INPUT -p udp --dport 67:68 --sport 67:68 -j ACCEPT

#  Accept all established inbound connections
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT

#  Allow ping
-A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# Allow mDNS
-A INPUT -d 224.0.0.251/32 -p udp -m udp --dport 5353 -j ACCEPT


# ----------------------------------------------------------------------------------------
# Custom rules go here
#
# iptables -A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
# ----------------------------------------------------------------------------------------

# Allow forwarding on LAN and PPP interface.
-A FORWARD -i ppp0 -j ACCEPT
-A FORWARD -i vmbr0 -j ACCEPT

# Add custom Docker chain to prevent unexpected firewall bypass [2/2]
## https://old.reddit.com/r/selfhosted/comments/ocqg1j/psa_docker_bypasses_ufw/h3w6tec/
-A DOCKER-USER -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

## This will only expose the containers that listen on port 80 & 443.
## Rest all the containers will not be accessible from the internet even no matter if they port-forward
### Update: Not needed here as I am only using IPv6 to expose - this should be done under ip6tables rules
-A DOCKER-USER -p tcp -m multiport --dports 80,443,9001 -j ACCEPT

## Allow "docker-ipv4" ipset to query DNS & wireguard server's UDP port
## This fixes wgproxy unable to resolve & connect to domains.
# ## sudo ipset create docker-ipv4 hash:net; sudo ipset add docker-ipv4 172.16.0.0/12
# -A DOCKER-USER -m set --match-set docker-ipv4 src -p udp -m multiport --dports 53,80,443 -j LOG_ACCEPT
# ## Same but also allow incoming requests from docker containers to connect to HTTP/HTTPS sites
# -A DOCKER-USER -m set --match-set docker-ipv4 src -p tcp -m multiport --dports 80,443 -j LOG_ACCEPT
## Alternatively, allow containers to access everything
-A DOCKER-USER -m set --match-set docker-ipv4 src -j ACCEPT
-A DOCKER-USER -j DROP

# Allow full access for my trusted IPSet
-A INPUT -m set --match-set trusted src -j ACCEPT

# Allow full access for LAN IPSet
-A INPUT -m set --match-set lan src -j ACCEPT

# Allow tailscale CGNAT Subnet
-A INPUT -i tailscale0 -s 100.64.0.0/10 -j ACCEPT

# Allow only LAN devices to access known internal services
-A INPUT -s 192.168.0.0/16 -p tcp -m multiport --dports 53,80,443,1080,1714:1764,2209,5900,9090,19999 -j ACCEPT -m comment --comment "Allows LAN devices to access to known services (DNS, HTTP(s), Dispatch-Proxy, KDEConnect, SSH, VNC, Cockpit, Netdata)"
-A INPUT -s 192.168.0.0/16 -p udp -m multiport --dports 53,80,443,1080,1714:1764,2209,5900,9090,19999 -j ACCEPT -m comment --comment "Allows LAN devices to access to known services (DNS, HTTP(s), Dispatch-Proxy, KDEConnect, SSH, VNC, Cockpit, Netdata)"

# Expose WireGuard & Torrent port
-A INPUT -p udp -m multiport --dports 47111,47112,47963:47969 -j ACCEPT -m comment --comment "Allow WireGuard & Torrent ports"
-A INPUT -p tcp -m multiport --dports 47111,47112,47963:47969 -j ACCEPT -m comment --comment "Allow WireGuard & Torrent ports"


# Reject anything at this point. And print out rejection message with its specific protocol.
# Issuing an ICMP "port unreachable" message to any new incoming UDP packets, rejecting them.
-A INPUT -p udp -j REJECT --reject-with icmp-port-unreachable
# Issuing a "tcp-reset" message to any new incoming TCP packets, rejecting them.
-A INPUT -p tcp -j REJECT --reject-with tcp-reset
# Issuing an "icmp-proto-unreachable" message to any new incoming TCP packets, dropping all other incoming packets.
-A INPUT -j REJECT --reject-with icmp-proto-unreachable

COMMIT

*raw
# Allowing packets in the PREROUTING chain
:PREROUTING ACCEPT [0:0]
# Allows packets in the OUTPUT chain, which is used for locally generated packets
:OUTPUT ACCEPT [0:0]
# Commits the changes to the kernel
COMMIT

*nat
:PREROUTING ACCEPT [0:0]
# Allowing packets in the INPUT chains for NAT
:INPUT ACCEPT [0:0]
# Allowing packets in the OUTPUT chains for NAT
:OUTPUT ACCEPT [0:0]
# Allowing packets in the POSTROUTING chains for NAT
:POSTROUTING ACCEPT [0:0]

# https://github.com/docker/for-linux/issues/690#issuecomment-529319051
# -A POSTROUTING ! -o docker0 -s 172.16.0.0/12 -j MASQUERADE


# Allow AP clients to access the outside world
# -A POSTROUTING -s 192.168.4.0/24 -o br0 -m comment --comment "JioFi Support" -j MASQUERADE
# -A POSTROUTING -s 192.168.4.0/24 -o ppp0 -m comment --comment "JioFi Support" -j MASQUERADE

# Commits the changes to the kernel
COMMIT

*security
# Allowing packets in the INPUT chains for security
:INPUT ACCEPT [0:0]
# Allowing packets in the FORWARD chains for security
:FORWARD ACCEPT [0:0]
# Allowing packets in the OUTPUT chains for security
:OUTPUT ACCEPT [0:0]
# Commits the changes to the kernel
COMMIT

*mangle
# Allowing packets in the PREROUTING chains for mangle
:PREROUTING ACCEPT [0:0]
# Allowing packets in the INPUT chains for mangle
:INPUT ACCEPT [0:0]
# Allowing packets in the FORWARD chains for mangle
:FORWARD ACCEPT [0:0]
# Allowing packets in the OUTPUT chains for mangle
:OUTPUT ACCEPT [0:0]
# Allowing packets in the POSTROUTING chains for mangle
:POSTROUTING ACCEPT [0:0]
# Commits the changes to the kernel
COMMIT
```

- IPv6 Rules:

##### `/etc/iptables/rules.v6`
```bash
# Generated by ip6tables-save v1.8.7 on Fri Aug 12 10:26:25 2022
*filter
:INPUT DROP [0:0]
:FORWARD DROP [0:0]
:OUTPUT ACCEPT [0:0]

# Add custom Docker chain to prevent unexpected firewall bypass [1/2]
# https://old.reddit.com/r/selfhosted/comments/ocqg1j/psa_docker_bypasses_ufw/h3w6tec/
:DOCKER-USER - [0:0]

# Defining custom chain to Log and ACCEPT/DROP
# https://stackoverflow.com/a/29544353/6437140
:LOG_ACCEPT - [0:0]
:LOG_DROP - [0:0]
-A LOG_ACCEPT -j LOG --log-level 6 --log-prefix "INPUT:ACCEPT: "
-A LOG_ACCEPT -j ACCEPT
-A LOG_DROP -j LOG --log-level 6 --log-prefix "INPUT:DROP: "
-A LOG_DROP -j DROP

# This accepts ongoing traffic for any existing connections that we've already accepted through other rule
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT

# Accept all ICMP packets. Unlike with IPv4, it's not a good idea to block ICMPv6 traffic as IPv6 is much more heavily dependent on it
-A INPUT -p ipv6-icmp -j ACCEPT

# Accept all traffic from/to the local interface:
-A INPUT -i lo -j ACCEPT

# Allow traffic for link-local addresses:
-A INPUT -s fe80::/10 -j ACCEPT

# Accept DHCPv6 traffic. If you use stateless autoconfiguration, or statically configure your machines, this is not necessary
-A INPUT -d fe80::/64 -p udp -m udp --dport 546 -m state --state NEW -j ACCEPT


# ----------------------------------------------------------------------------------------
# Custom rules go here
#
# ip6tables -A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
# ----------------------------------------------------------------------------------------

# Allow forwarding on LAN and PPP interface.
-A FORWARD -i ppp0 -j ACCEPT
-A FORWARD -i vmbr0 -j ACCEPT

# Add custom Docker chain to prevent unexpected firewall bypass [2/2]
## https://old.reddit.com/r/selfhosted/comments/ocqg1j/psa_docker_bypasses_ufw/h3w6tec/
-A DOCKER-USER -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

## This will only expose the containers that listen on port 80 & 443.
## Rest all the containers will not be accessible from the internet even no matter if they port-forward
### Update:  Needed here as I am only using IPv6 to expose - this should be done under ip6tables rules
-A DOCKER-USER -p tcp -m multiport --dports 80,443,9001 -j LOG_ACCEPT

## Allow "docker" ipset to query DNS & wireguard server's UDP port
## This fixes wgproxy unable to resolve & connect to domains.
## sudo ipset create docker-ipv6 hash:net; sudo ipset add docker-ipv6 fd00:bad:c0de::/48
# -A DOCKER-USER -m set --match-set docker-ipv6 src -p udp -m multiport --dports 53,80,443 -j ACCEPT
# ## Same but also allow incoming requests from docker containers to connect to HTTP/HTTPS sites
# -A DOCKER-USER -m set --match-set docker-ipv6 src -p tcp -m multiport --dports 80,443 -j ACCEPT
## Alternatively, allow containers to access everything
-A DOCKER-USER -m set --match-set docker-ipv6 src -j ACCEPT
-A DOCKER-USER -j DROP

# Allow full access for my trusted IPSet
-A INPUT -m set --match-set trusted-v6 src -j ACCEPT

# Allow full access for LAN IPSet
-A INPUT -m set --match-set lan-v6 src -j ACCEPT

-A INPUT -s fc00::/7 -p tcp -m multiport --dports 53,80,443,1080,1714:1764,2209,5900,9090,19999 -j ACCEPT -m comment --comment "Allows LAN devices to access to known services (DNS, HTTP(s), Dispatch-Proxy, KDEConnect, SSH, VNC, Cockpit, Netdata)"
-A INPUT -s fc00::/7 -p udp -m multiport --dports 53,80,443,1080,1714:1764,2209,5900,9090,19999 -j ACCEPT -m comment --comment "Allows LAN devices to access to known services (DNS, HTTP(s), Dispatch-Proxy, KDEConnect, SSH, VNC, Cockpit, Netdata)"

-A INPUT -p udp -m multiport --dports 443,9001,47111,47112,47963:47969 -j ACCEPT -m comment --comment "Allow HTTPS, IRC Relay, WireGuard & Torrent ports"
-A INPUT -p tcp -m multiport --dports 443,9001,47111,47112,47963:47969 -j ACCEPT -m comment --comment "Allow HTTPS, IRC Relay, WireGuard & Torrent ports"

# At the end of our rules, we reject all traffic that didn't match a rule, using "port unreachable".
# This results in the standard "Connection refused" message at the other end, and effectively hides the fact that we have a firewall.
# Tools such as nmap will report that all our ports are "closed" rather than "filtered"
# and have a much more difficult time determining that we even have a firewall.
-A INPUT -j REJECT --reject-with icmp6-adm-prohibited

COMMIT
# Completed on Fri Aug 12 10:26:25 2022
# Generated by ip6tables-save v1.8.7 on Fri Aug 12 10:26:25 2022
*nat
:PREROUTING ACCEPT [0:0]
:INPUT ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
:POSTROUTING ACCEPT [0:0]
# -A POSTROUTING -o br0 -m comment --comment "JioFi Support" -j MASQUERADE
COMMIT
# Completed on Fri Aug 12 10:26:25 2022
```