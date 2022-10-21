---
title: Linux 下安装 MySQL
date: 2022-10-21 22:40:36
tags:
- Linux
- MySQL
categories:
- 操作系统
- Linux
---

编译安装 MySQL 需要很久的时间，这样太浪费时间了。还不如直接用 MySQL 官方提供的源。几乎是秒安装成功。

<!-- more -->

## 添加源

首先去下载 [MySQL APT 仓库](https://dev.mysql.com/downloads/repo/apt/)。下载完成后执行如下命令安装：

```bash
sudo dpkg -i mysql-apt-config_0.8.24-1_all.deb
```

安装过程中会弹出询问框，询问需要配置的 MySQL 产品。我的建议是直接选择下面的 `OK` 即可。

执行如下命令更新资源：

```bash
sudo apt-get update
```

这样源就安装完成了。

## 安装

执行如下命令即可安装：

```bash
sudo apt-get install mysql-server
```

安装过程中会弹出询问框，要求输入登录密码。直接输入即可。第三步会要求选择密码存储类型，直接选择推荐的密码类型即可。

这样就安装完成了。是不是很简单。

## 开始/停止

执行如下命令查看运行情况：

```bash
sudo systemctl status mysql
```

其它命令有：

- 启动

```bash
sudo systemctl start mysql
```

- 停止

```bash
sudo systemctl stop mysql
```

- 重载

```bash
sudo systemctl reload mysql
```

- 设置开机启动

```bash
sudo systemctl enable mysql 
```

- 取消开机启动

```bash
sudo systemctl disable mysql
```

## 移除

执行如下命令：

```bash
sudo apt-get remove mysql-server
```

然后执行命令移除下列依赖：

```bash
sudo apt-get autoremove
```

可以通过如下命令查看都是安装了那些组件：

```bash
dpkg -l | grep mysql | grep ii
```

## 文件夹结构

所有的配置文件，比如 `my.cnf` `/etc/mysql` 下。

所有的二进制文件，库，header 等文件都在 `/usr/bin` and `/usr/sbin`。

数据目录在 `/var/lib/mysql` 下。