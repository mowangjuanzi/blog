---
title: Ubuntu 设置静态 IP
date: 2018-01-02 00:00:00
updated: 2020-07-10 16:16:56
tags:
- Linux
- Ubuntu
categories:
- 操作系统
- Linux
---

## 背景

因为启动虚拟机后，默认使用 DHCP 获取 IP。这样就会导致每次终端连接的时候，都需要查看服务器的地址是什么，并不方便。所以编写该文章记录如何设置为静态 IP。

## 配置

在 Ubuntu 22.04 中，使用 `netplan` 命令来配置静态 IP。

首先查看 `/etc/netplan` 下的文件都有什么：

```bash
$ ls /etc/netplan/
00-installer-config.yaml
```

这里，就会修改 `/etc/netplan/00-installer-config.yaml` 文件

我们先看看该文件的现有内容：

````yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    ens32:
      dhcp4: true
  version: 2
````

我们可以看到这里设置的 `dhcp4` 为 `yes`。表示是 `dhcp` 模式。

好了，下面我们要进行修改了。下面是改好的格式：

````yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    ens32:
      dhcp4: false
      dhcp6: false
      addresses:
        - 192.168.1.254/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 114.114.114.114
  version: 2
````

现在我们解释一下修改的内容：

- `dhcp4`：IPv4 的自动分配，设置为 `no` 表示不进行 IPv4 地址的自动分配。
- `dhcp6`：IPv6 的自动分配，设置为 `no` 表示不进行 IPv6 地址的自动分配。
- `addresses`：设置固定的 ip。这里有个 `/24`，我们需要对这一块单独说下。
- `routes`：指定网关地址，之前是 `gateway4`，如果继续使用，会提示：`` `gateway4` has been deprecated, use default routes instead``。
- `nameservers`: DNS 服务器。`addresses` 的数组表示可以设置多个。

## 子网掩码

如果有人设置过 Windows 的静态 IP 或者说之前的版本的 Ubuntu 的静态 ip 的，可能会觉得少了一个东西，没错，就是子网掩码。

这里就是说的 `/24` 了。它其实就是设置的子网掩码。下面有前缀对应的 ip，我们可以通过这个来进行响应的设置了。

| 前缀大小 |      子网掩码       |
|:----:|:---------------:|
| /24  |  255.255.255.0  |
| /25  | 255.255.255.128 |
| /26  | 255.255.255.192 |
| /27  | 255.255.255.224 |
| /28  | 255.255.255.240 |
| /29  | 255.255.255.248 |
| /30  | 255.255.255.252 |

## 执行命令

好了，我们把配置文件的内容按照实际情况修改好了之后。执行以下命令进行部署：

可以使用如下命令进行检测是否正确：

```bash
sudo netplan try
```

> 这里需要注意的一个事情就是不要使用远程终端执行此命令。因为它的解释是：`Try to apply a new netplan config to running system, with automatic rollback`。
````bash
sudo netplan apply
````

如果没有问题，固态ip就设置成功了。好了，是不是非常简单呢？