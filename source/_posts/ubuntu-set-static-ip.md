---
title: ubuntu 17.10 设置固态IP
date: 2018-01-02 13:04:13
tags:
---
设置了基本的环境之后，需要设置固定的ip，要不然每次启动都变IP，我每次调整IP都得疯了。

在Ubuntu 17.10 中，使用了一种新的命令来配置静态IP。

对此，我们需要修改的是**vim /etc/netplan/01-netcfg.yaml**

我们先看看该文件的内容和格式：

````yaml
# This file describes the network interfaces available on your system
# For more information, see netplan(5).
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      dhcp4: yes
````

我们可以看到这里设置的**dhcp4**为**yes**。表示是**dhcp**模式。

好了，下面我们要进行修改了。下面是改好的格式：

````yaml
# This file describes the network interfaces available on your system
# For more information, see netplan(5).
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      dhcp4: no
      dhcp6: no
      addresses: [192.168.110.231/24]
      gateway4: 192.168.110.1
      nameservers:
          addresses: [114.114.114.114, 8.8.8.8]
````

现在我们解释一下修改的内容：

- **dhcp4**：ipv4的自动分配，设置为**no**表示不进行ipv4地址的自动分配
- **dhcp6**：ipv6的自动分配，设置为**no**表示不进行ipv6地址的自动分配
- **addresses**：设置固定的ip。这里有个**/24**，我们需要对这一块单独说下。
- **gateway4**：网关地址。
- **nameservers**: DNS服务器。**addresses**的数组表示可以设置多个。

如果有人设置过windows的静态IP或者说之前的版本的ubuntu的静态ip的，可能会觉得少了一个东西，没错，就是子网掩码。

这里就是说的**/24**了。它其实就是设置的子网掩码。下面有前缀对应的ip，我们可以通过这个来进行响应的设置了。

| 前缀大小 | 子网掩码 |
|:---:|:---:|
| /24 | 255.255.255.0  |
| /25 | 255.255.255.128 |
| /26 | 255.255.255.192 |
| /27 | 255.255.255.224 |
| /28 | 255.255.255.240 |
| /29 | 255.255.255.248 |
| /30 | 255.255.255.252 |

好了，我们把配置文件的内容按照实际情况修改好了之后。执行以下命令进行部署：

````bash
sudo netplan apply
````

如果没有问题，固态ip就设置成功了。然后我们重新配置我们xshell登录的ip，重新就进行登录就可以了。

好了，是不是非常简单呢？
