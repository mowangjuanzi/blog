---
title: apt 安装 nginx
date: 2018-12-17 00:09:38
tags: 
- nginx
- ubuntu
- linux
categories:
- web服务器
- nginx
---
使用apt安装nginx，方便快捷，省去了编译失败的可能。

## 支持平台

| Version | Codename | Supported Platforms |
|:---:|:---:|:---:|
| 14.04 | trusty | x86_64, i386, aarch64/arm64 |
| 16.04 | xenial | x86_64, i386, ppc64el, aarch64/arm64 |
| 18.04 | bionic | x86_64, aarch64/arm64 |
| 18.10 | cosmic | x86_64 |

我这里的ubuntu的环境是18.10。通过上面的表格可以了解到我这里是支持安装的。

## 安装

首先，我们安装key

```bash
curl -s http://nginx.org/keys/nginx_signing.key | sudo apt-key add -
```

首先先看一下下面的内容：

```conf
deb http://nginx.org/packages/ubuntu/ codename nginx
deb-src http://nginx.org/packages/ubuntu/ codename nginx
```

这里的codename需要替换，需要替换的值每个版本是不同的，具体可查看上面的表格，因为我的版本是18.10，所以我需要将codename替换为`cosmic`。替换完成的内容是：

```conf
deb http://nginx.org/packages/ubuntu/ cosmic nginx
deb-src http://nginx.org/packages/ubuntu/ cosmic nginx
```

现在将其追加到`/etc/apt/sources.list`文件的末尾：

```bash
$ cat /etc/apt/sources.list
...
deb http://mirrors.aliyun.com/ubuntu cosmic-security multiverse
# deb-src http://mirrors.aliyun.com/ubuntu cosmic-security multiverse

# 这里是重点
deb http://nginx.org/packages/ubuntu/ cosmic nginx
deb-src http://nginx.org/packages/ubuntu/ cosmic nginx
```

好了。添加完成之后，执行如下命令：

```bash
sudo apt update
```

下面就可以进行安装了，只需执行以下命令：

```bash
sudo apt install nginx
```

执行完成之后，这样就安装完成了，是不是非常方便呢。

## 管理命令

启动：

```bash
sudo systemctl start nginx
```

停止:

```bash
sudo systemctl stop nginx
```

重启：

```bash
sudo systemctl restart nginx
```

状态：

```bash
sudo systemctl status nginx
```
