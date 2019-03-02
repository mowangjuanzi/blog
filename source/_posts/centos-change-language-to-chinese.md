---
title: CentOS修改语言包为中文
date: 2017-11-17 16:29:20
tags:
- centos
- linux
categories:
- 操作系统
- centos
---
## 临时办法

在命令行执行以下命令：

````shell
LANG="zh_CN.UTF-8"
````

## 开机生效的办法：

修改配置文件`vim /etc/locale.conf`，

将：

````ini
LANG=en_US.UTF-8
````

修改为：

````ini
LANG=zh_CN.UTF-8
````

> 参考：http://blog.csdn.net/ysm_sd/article/details/51144975
