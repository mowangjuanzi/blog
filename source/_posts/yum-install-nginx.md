---
title: yum 安装 nginx
date: 2017-11-17 16:32:19
tags:
- nginx
- yum
- centos
- linux
categories:
- web服务器
- nginx
---
> 以下操作都是在root账户下进行的。系统版本是CentOS7

我之前在nginx的官方文档中看到使用yum安装php方法。觉得如果有嫌编译麻烦的。可以尝试使用yum快速安装nginx。减少搭建环境之苦。

## 编辑yum源文件

比如我的系统是CentOS7，那么将以下内容粘贴进入`/etc/yum.repos.d/nginx.repo`文件中：

````ini
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/7/$basearch/
gpgcheck=0
enabled=1
````

## 安装nginx

````shell
yum install nginx -y
````

## 禁止更新
我们在安装之后，为了能够正常运行，我们一般会禁止Nginx进行更新。因为在yum更新了Nginx之后，Nginx会自动重启。这对于我们来说是没有必要的，所以我们可以屏蔽更新。我们可以这样，将下列指定放到你的`/etc/yum.conf`文件中：

````shell
exclude=nginx
````

## 更新Nginx
一般在生产环境，我们都是禁用更新的。所以说，这里只是作为一个参考。
我们需要执行的命令就是：

````shell
yum update nginx
````

> 注意： 在使用 yum 更新之后，Nginx会自动重启。

## 命令管理：

### 启动

````shell
systemctl start nginx
````

### 重启

````shell
systemctl restart nginx
````

### 测试配置文件语法是否正确

````shell
nginx -t
````

### 重载配置文件

````shell
systemctl reload nginx
````

### 停止

````shell
systemctl stop nginx
````

### 启动开机启动

````shell
systemctl enable nginx
````

### 禁止开机启动

````shell
systemctl diasble nginx
````

## 总结

上面实现了Nginx的安装，命令管理，屏蔽更新以及更新。希望能对大家有所帮助。
