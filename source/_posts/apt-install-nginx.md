---
title: ubuntu 中使用 apt 安装 nginx
date: 2018-12-17 00:09:38
updated: 2019-12-08 18:00:00
tags: 
- nginx
- ubuntu
- linux
categories:
- web服务器
- nginx
---

使用 `apt` 安装 `nginx` ，方便快捷，省去了编译失败的可能。

## 支持平台

| Version | Codename | Supported Platforms |
|:---:|:---:|:---:|
| 16.04 | xenial | x86_64, i386, ppc64el, aarch64/arm64 |
| 18.04 | bionic | x86_64, aarch64/arm64 |
| 19.04 | disco | x86_64 |
| 19.10 | eoan | x86_64 |

我这里的ubuntu的环境是 `19.10` 。通过上面的表格可以了解到我这里是支持安装的。

## 安装

首先，我们安装key

```bash
curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
```

接下来添加 apt repository:

安装主线版本执行以下命令：

```bash
echo "deb http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
```

安装稳定版本执行以下命令：

```bash
echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
```

接下来执行如下命令：

```bash
sudo apt update
```

下面就可以进行安装了，只需执行以下命令：

```bash
sudo apt install nginx
```

执行完成之后，这样就安装完成了，是不是非常方便呢。

## 相关目录

下面看下配置文件夹的相关目录

```bash
$ tree /etc/nginx/
/etc/nginx/
├── conf.d
│   └── default.conf
├── fastcgi_params
├── koi-utf
├── koi-win
├── mime.types
├── modules -> /usr/lib/nginx/modules
├── nginx.conf
├── scgi_params
├── uwsgi_params
└── win-utf

2 directories, 9 files
```

日志相关：

```bash
$ tree /var/log/nginx/
/var/log/nginx/
├── access.log
└── error.log

0 directories, 2 files
```

缓存相关：

```bash
$ sudo tree /var/cache/nginx/
/var/cache/nginx/
├── client_temp
├── fastcgi_temp
├── proxy_temp
├── scgi_temp
└── uwsgi_temp

5 directories, 0 files
```

## 管理命令

下面看看支持的命令：

```bash
$ sudo /etc/init.d/nginx
Usage: /etc/init.d/nginx {start|stop|status|restart|reload|force-reload|upgrade|configtest|check-reload}
```

这里介绍几个常用的

启动：

```bash
$ sudo /etc/init.d/nginx start
[ ok ] Starting nginx (via systemctl): nginx.service.
```

重启：

```bash
$ sudo /etc/init.d/nginx restart
[ ok ] Restarting nginx (via systemctl): nginx.service.
```

状态：

```bash
$ sudo /etc/init.d/nginx status
● nginx.service - nginx - high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Sun 2019-12-08 09:51:20 UTC; 18s ago
     Docs: http://nginx.org/en/docs/
  Process: 15032 ExecStart=/usr/sbin/nginx -c /etc/nginx/nginx.conf (code=exited, status=0/SUCCESS)
 Main PID: 15033 (nginx)
    Tasks: 2 (limit: 4591)
   Memory: 1.7M
   CGroup: /system.slice/nginx.service
           ├─15033 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf
           └─15034 nginx: worker process

Dec 08 09:51:20 baoguoxiao systemd[1]: Starting nginx - high performance web server...
Dec 08 09:51:20 baoguoxiao systemd[1]: Started nginx - high performance web server.
```

停止:

```bash
$ sudo /etc/init.d/nginx stop
[ ok ] Stopping nginx (via systemctl): nginx.service.
```

检测配置：

```bash
$ sudo /etc/init.d/nginx configtest
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

其他的我就不列举了。大家可以自己去试验。