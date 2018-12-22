---
title: 虚拟机安装ubuntu
date: 2018-01-02 12:00:25
tags:
---
公司的电脑是windows的。因为平常要用到linux的独有特性。比如swoole等等。所以，我在虚拟机中安装ubuntu。

好了，废话不多说，我是使用的自动安装，在安装之前就已经设定了登录的账号密码。安装完成是没有安装ssh服务的。

## 开启ssh服务

首先执行以下命令安装openssh

````bash
sudo apt install openssh-server -y
````

启动服务并且设置开机启动

````bash
sudo systemctl start ssh
sudo systemctl enable ssh
````

## 查看IP，并使用xshell连接

查看ip

````bash
ip addr
````

查看你的网卡信息，发现我的IP是192.168.110.128.

因为直接使用虚拟机内部的终端并不好用，不能够进行复制粘贴啥的，所以我使用外部的终端程序。我在这里使用的是xshell。

新建会话属性，输入主机ip（就是刚才我们获得的），在用户身份验证输入用户名和密码。

然后点击最下面的连接。会出现一个弹出框，选择“接口并保存”。

## 修改源



进入后第一件事就是修改**apt**源。

在修改源之前，我们先安装VIM编辑器：

````bash
sudo apt install vim -y
````

安装完成之后，我们要编辑**apt**源文件去除cd源。

````bash
sudo vi /etc/apt/sources.list
````

将第5行的配置进行注释：

````ini
# deb cdrom:[Ubuntu-Server 17.10 _Artful Aardvark_ - Release amd64 (20171017.1)]/ artful main restricted
````

## 修改源为阿里源

这是我从阿里云的帮助文件中复制到的源的内容。

````ini
deb http://mirrors.aliyun.com/ubuntu/ quantal main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ quantal-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ quantal-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ quantal-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ quantal-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ quantal main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ quantal-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ quantal-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ quantal-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ quantal-backports main restricted universe multiverse
````

首先我们需要对该内容进行修改。


我们查看版本信息：

````bash
baoguoxiao@ubuntu:~$ sudo lsb_release -a
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 17.10
Release:	17.10
Codename:	artful
````

可以看到**codename**的值是**artful**

我们可以把上面**quantal**全部替换为**artful**，替换完成如下：

````ini
deb http://mirrors.aliyun.com/ubuntu/ artful main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ artful-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ artful-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ artful-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ artful-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ artful main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ artful-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ artful-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ artful-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ artful-backports main restricted universe multiverse
````

然后将替换好的内容添加到**/etc/apt/sources.list**开头。

这样就可以**:x**进行保存了。

## 更新包

其实很简单。首先更新源：

````bash
sudo apt update 
````

在输出的消息的最后一行会输出以下内容：

````bash
46 packages can be upgraded. Run 'apt list --upgradable' to see them.
````

这就表示我有46个包需要更新。那么就执行运行以下命令进行更新吧：

````bash
sudo apt upgrade -y
````

好了，最开始的安装环境就已经搭建完成了。
