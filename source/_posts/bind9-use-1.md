---
title: bind9的初步使用（1）
date: 2018-12-16 22:28:02
tags:
---
## 前言

周五把自己的电脑重装了一下，还是使用的经典的windows+vmware+ubuntu的经典方式（对我来说）。但是我不想每次都修改host文件来实现我的域名访问，所以我在想有没有一个更好的方式，可以让我实现域名映射。这个时候我想到了自己架设一个dns服务器。说干就干，我就准备用dns的开源系统[bind9](https://www.isc.org/downloads/bind/)来搞一番。

## 环境介绍

- Ubuntu: 18.10 (ip: 192.168.1.230)
- bind9: 9.11.4
- Windows 10 (ip: 192.168.1.230)

## 安装

其实安装非常简单，一条命令就搞定了

```bash
sudo apt install bind9
```

## 管理命令

启动：

```bash
sudo systemctl start bind9
```

停止:

```bash
sudo systemctl stop bind9
```

重启：

```bash
sudo systemctl restart bind9
```

状态：

```bash
sudo systemctl status bind9
```

## 配置域名

举个例子，比如现在我们有个域名是：baoguoxiao.pro。现在我们要对这个域名进行虚拟映射。

首先打开`/etc/bind/named.conf.local`，追加如下内容到文件尾部：

```conf
zone "baoguoxiao.pro" {
    type master;
    file "/etc/bind/zones/baoguoxiao.pro.db";
};
```

那么现在这个文件的内容完整如下：

```conf
//
// Do any local configuration here
//

// Consider adding the 1918 zones here, if they are not used in your
// organization
//include "/etc/bind/zones.rfc1918";

zone "baoguoxiao.pro" {
    type master;
    file "/etc/bind/zones/baoguoxiao.pro.db"; // 这个文件定义了文件地址
};
```

我们定义的地址是`/etc/bind/zones/baoguoxiao.pro.db`。但是我们的`/etc/bind/`并没有该目录。所以需要如下命令进行创建：

```bash
cd /etc/bind/
sudo mkdir zones
```

进入该目录：

```bash
cd zones
```

然后创建该文件`baoguoxiao.pro.db`，并追加如下命令：

```conf
; BIND data file for baoguoxiao.pro
;
$TTL 14400
@ IN SOA ns1.baoguoxiao.pro. host.baoguoxiao.pro. (
201006601 ; Serial
7200 ; Refresh
120 ; Retry
2419200 ; Expire
604800) ; Default TTL
;
baoguoxiao.pro. IN NS ns1.baoguoxiao.pro.
 
;baoguoxiao.pro. IN A 192.168.1.231
 
ns1 IN A 192.168.1.231
www IN A 192.168.1.231
```

这样就设置完成了。然后我们将bind9进行重启。

## 测试DNS效果

```bash
$ dig @192.168.1.231 www.baoguoxiao.pro

; <<>> DiG 9.11.4-3ubuntu5-Ubuntu <<>> @192.168.1.231 www.baoguoxiao.pro
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 35630
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 1, ADDITIONAL: 2

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
; COOKIE: f077ba72f04b75a1ac9b27275c16148f4732abac11c21ce8 (good)
;; QUESTION SECTION:
;www.baoguoxiao.pro.			IN	A

;; ANSWER SECTION:
www.baoguoxiao.pro.		14400	IN	A	192.168.1.231

;; AUTHORITY SECTION:
baoguoxiao.pro.			14400	IN	NS	ns1.baoguoxiao.pro.

;; ADDITIONAL SECTION:
ns1.baoguoxiao.pro.		14400	IN	A	192.168.1.231

;; Query time: 0 msec
;; SERVER: 192.168.1.231#53(192.168.1.231)
;; WHEN: Sun Dec 16 17:02:07 CST 2018
;; MSG SIZE  rcvd: 117
```

好了，这样就表示已经配置成功了

## 设置默认本机DNS可用

之前的设置我们需要指定本机的DNS服务器才可以使用，如果我们不指定的话，那么查询该域名是没有效果的：

```bash
$ dig baoguoxiao.pro

; <<>> DiG 9.11.4-3ubuntu5-Ubuntu <<>> baoguoxiao.pro
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 52385
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;baoguoxiao.pro.			IN	A

;; Query time: 274 msec
;; SERVER: 127.0.0.53#53(127.0.0.53)
;; WHEN: Sun Dec 16 17:03:59 CST 2018
;; MSG SIZE  rcvd: 43
```

在ubuntu17.10之后，网卡配置已经更新为netplan。该配置文件的目录是`/etc/netplan/`。不过里面的文件不一定是相同的名字。我的文件打开是这样的。

```bash
$ cat /etc/netplan/50-cloud-init.yaml 
# This file is generated from information provided by
# the datasource.  Changes to it will not persist across an instance.
# To disable cloud-init's network configuration capabilities, write a file
# /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg with the following:
# network: {config: disabled}
network:
    ethernets:
        ens33:
            addresses: [192.168.1.231/24]
            dhcp4: false
            dhcp6: false
            gateway4: 192.168.1.1
            nameservers:
                addresses: [192.168.1.231,114.114.114.114]
    version: 2
```

注意，我在倒数第二行的数组里面添加本机的服务器`192.168.1.231`。关于该文件的配置，可以查看我的另外一篇文章：{% post_link ubuntu-set-static-ip %}。

这样我们在本机就可以不指定dns服务器的基础上进行获取域名的ip了。

```bash
$ dig www.bgx.me

; <<>> DiG 9.11.4-3ubuntu5-Ubuntu <<>> www.baoguoxiao.pro
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 58219
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 1, ADDITIONAL: 2

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
; COOKIE: 15d0881d8eed3292569558cd5c1623fa33a2d05212e7e662 (good)
;; QUESTION SECTION:
;www.baoguoxiao.pro.			IN	A

;; ANSWER SECTION:
www.baoguoxiao.pro.		14400	IN	A	192.168.1.231

;; AUTHORITY SECTION:
baoguoxiao.pro.			14400	IN	NS	ns1.baoguoxiao.pro.

;; ADDITIONAL SECTION:
ns1.baoguoxiao.pro.		14400	IN	A	192.168.1.231

;; Query time: 0 msec
;; SERVER: 192.168.1.231#53(192.168.1.231)
;; WHEN: Sun Dec 16 18:07:54 CST 2018
;; MSG SIZE  rcvd: 117
```

本篇文章就说到这里。下一篇讲如何配置可局域网访问。
