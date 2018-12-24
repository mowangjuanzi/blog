---
title: ubuntu 16.10 设置固定ip
date: 2017-11-17 16:31:57
tags:
---
> 最新版可参考：{% post_link ubuntu-set-static-ip %}

首先我们打开网卡配置文件：

```bash
sudo vim /etc/network/interfaces
```

默认内容如下：

```ini
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
auto ens33
iface ens33 inet dhcp
```

我们改成如下：

```ini
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
auto ens33
iface ens33 inet static # 将dhcp改为static
address 10.0.0.101 # 静态ip
netmask 255.255.255.0 # 网关地址
network 10.0.0.1 # 子网掩码
```

然后重启网卡服务：

```bash
systemctl restart networking
```

然后我们打开DNS文件：

```bash
sudo vim /etc/resolvconf/resolv.conf.d/base
```

添加如下内容：

```ini
nameserver 180.76.76.76
```

刷新DNS配置：

```shell
sudo resolvconf -u
```
