---
title: centos修改文件的最大打开数量
date: 2017-11-17 16:32:39
tags:
- centos
- limit
categories:
- 操作系统
- centos
---
我的系统是`CentOS`。

我们首先先看一下我们现在的限制：

````shell
[root@bogon ~]# ulimit -n
1024
````

这肯定是不够的，所以我们要把这个数量给变成65535。

首先我们一般查询到的方法是这个：

````shell
ulimit –n 65535
````

但是这个只能在本次开机有效，重启之后就不行了。

所以我们要使用另外一种办法，来实现开机启动之后文件打开数量也是65535。

首先我们打开`/etc/security/limits.conf`：

````shell
vim /etc/security/limits.conf
````

然后添加如下内容到此文件的最后：

````ini
* soft nofile 65535
* hard nofile 65535
* soft nproc 65535
* hard nproc 65535
````

关闭文件之后，我们使用`reboot`对系统进行重新启动。

启动成功后我们再次使用查看连接数的命令：

````shell
[root@bogon ~]# ulimit -n
65535
````

这样我们就能看到文件最大打开数量已经从1024变成65535了。
