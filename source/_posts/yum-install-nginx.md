---
title: yum 安装 nginx
date: 2017-11-17 16:32:19
updated: 2022-05-02 12:45:07
tags:
- nginx
- Web 服务器
categories:
- Web 服务器
- nginx
---

> 当前系统版本是 CentOS 8，其实该版本已经不维护了，我只是为了升级相关内容。

我之前在 nginx 的官方文档中看到使用 yum 安装 php 方法。觉得如果有嫌编译麻烦的。可以尝试使用 yum 快速安装 nginx 。减少搭建环境之苦。

## 添加 yum 源文件

将以下内容粘贴进入 `/etc/yum.repos.d/nginx.repo` 文件中：

````ini
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
````

默认安装的是稳定版本。如果是安装主线版本。需要执行如下命令：

```bash
sudo yum install yum-utils -y && sudo yum-config-manager --enable nginx-mainline
```

## 安装 nginx

````shell
sudo yum install nginx -y
````

## 禁止更新

我们在安装之后，为了能够正常运行，我们一般会禁止 Nginx 进行更新。因为在 yum 更新了 Nginx 之后，Nginx 会自动重启。这对于我们来说是没有必要的，所以我们可以屏蔽更新。我们可以这样，将下列指定放到你的 `/etc/yum.conf` 文件中：

````shell
exclude=nginx
````

## 更新 Nginx

一般在生产环境，我们都是禁用更新的。所以说，这里只是作为一个参考。
我们需要执行的命令就是：

````shell
sudo yum update nginx
````

> 注意： 在使用 yum 更新之后，Nginx 会自动重启。

## 命令管理：

### 启动

````shell
sudo systemctl start nginx
````

### 重启

````shell
sudo systemctl restart nginx
````

### 测试配置文件语法是否正确

````shell
sudo nginx -t
````

### 重载配置文件

````shell
sudo systemctl reload nginx
````

### 停止

````shell
sudo systemctl stop nginx
````

### 启动开机启动

````shell
sudo systemctl enable nginx
````

### 禁止开机启动

````shell
sudo systemctl diasble nginx
````

## 总结

上面实现了Nginx的安装，命令管理，屏蔽更新以及更新。希望能对大家有所帮助。
