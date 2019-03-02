---
title: ubuntu 16.10 支持ssh远程访问
date: 2017-11-17 15:21:26
tags:
- ubuntu
- linux
- ssh
categories:
- 操作系统
- ubuntu
---
hell
sudo apt-get install openssh-server
````

然后执行启动命令：

````shell
sudo systemctl start ssh
````

## 开机启动

我们打开`/etc/rc.local`，加入如下命令：

````shell
sudo systemctl enable ssh
````

> 注意：如果文件中如果有`exit 0`，一定要在其之前加入。

这样我们的ubuntu就能正常远程访问了。
