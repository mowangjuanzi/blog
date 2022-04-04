---
title: Ubuntu 下安装 PHP
date: 2021-03-28 18:06:19
updated: 2021-03-28 18:06:19
tags:
- ubuntu
- php
categories:
- 操作系统
- ubuntu
excerpt: '在 Ubuntu 20.10 中使用 ppa:ondrej/php 安装 PHP 8.1 的记录'
---

![](/images/bing/2021-03-28.jpg)

## 安装所需依赖

首先我们先安装一些依赖的包，以便后期进行安装处理：

```
sudo apt install ca-certificates apt-transport-https software-properties-common
```

首先我们执行以下命令安装PPA：

```
sudo add-apt-repository ppa:ondrej/php
```

这里有个注意事项，就是执行到一半，出现以下文字是需要一个回车才可以继续执行的。

```
Press [ENTER] to continue or Ctrl-c to cancel adding it.
```

执行完成后，我们看下目前的PHP的默认版本变成了多少

```
$ sudo apt show php
Package: php
Version: 2:8.0+85+ubuntu21.10.1+deb.sury.org+1
Priority: optional
Section: php
Source: php-defaults (85+ubuntu21.10.1+deb.sury.org+1)
Maintainer: Debian PHP Maintainers <team+pkg-php@tracker.debian.org>
Installed-Size: 13.3 kB
Depends: php8.0
Download-Size: 6,926 B
APT-Sources: http://ppa.launchpad.net/ondrej/php/ubuntu impish/main amd64 Packages
Description: server-side, HTML-embedded scripting language (default)
 PHP (递归缩写：Hypertext Preprocessor，超文本预处理器)，是一种广泛应用的 开源通用脚本语言，特别适用于网络开发并可嵌入
 HTML 中。
 .
 This package is a dependency package, which depends on latest stable PHP
 version (currently 8.0).

N: 有 1 条附加记录。请加上 ‘-a’ 参数来查看它们
```

可以看到默认的PHP版本已经从系统自带的7.4变成8.0了。

## 安装PHP

但是我们可以安装最新的8.1。因为跟默认版本不相符，所以每次都要指定版本。

执行以下命令安装8.1的PHP：

```
sudo apt install php8.1-fpm
```

安装成功后可以执行命令查看下目前的版本：

```
$ php -v
PHP 8.1.0RC5 (cli) (built: Nov  4 2021 14:58:40) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.1.0-dev, Copyright (c) Zend Technologies
    with Zend OPcache v8.1.0RC5, Copyright (c), by Zend Technologies
```

## 可执行命令

常用的有以下命令：

- php
- php-fpm
- pecl
- phpize
- php-config
- pear
- 等等

## 路径

日志路径:

```
$ ls /var/log/php*
/var/log/php8.1-fpm.log
```

## 管理命令

启动：

```
sudo systemctl start php8.1-fpm
```

停止：

```
sudo systemctl stop php8.1-fpm
```

重新启动：

```
sudo systemctl restart php8.1-fpm
```

设置开机启动（默认已经设置）：

```
sudo systemctl enable php8.1-fpm
```

取消开机启动

```
sudo systemctl disable php8.1-fpm
```

查看运行状态

```
sudo systemctl status php8.1-fpm
```

## apt 安装扩展

安装扩展可以执行以下命令：

```
sudo apt install php8.1-mbstring php8.1-dom php8.1-mysql
```

通过这种方式可以安装一些扩展。

我们可以通过执行以下命令来查看可以安装那些扩展：

```
sudo apt search php8.1-*
```

## 手动安装扩展

首先我们先安装PHP的编译依赖包

```
sudo apt install php8.1-dev
```

比如说安装一个 apt 不存在的包，可以执行如下命令：

```
sudo pecl install seaslog
```

这样就安装完成了。

## 配置文件

这里要介绍一下安装扩展的情况。因为PHP有两种运行方式，一种是FPM，一种是CLI。所以它可以控制一个扩展只在FPM加载，而不在CLI加载的方式。

首先看下它的目录

```
$ ls /etc/php/8.1/
cli  fpm  mods-available
```

首先我们扩展的管理是存储到 `mods-available` 中的。

然后如果我们要控制FPM加载这个某个配置，那么就要进行创建软链。

我们查看下面的命令就了解了：

```
$ ll /etc/php/8.1/fpm/conf.d/10-opcache.ini 
lrwxrwxrwx 1 root root 39 11月  6 19:57 /etc/php/8.1/fpm/conf.d/10-opcache.ini -> /etc/php/8.1/mods-available/opcache.ini
```

好了。基本上介绍就是这样了。

## 安装 Composer

首先执行如下命令获取安装脚本：

```bash
curl -L "https://getcomposer.org/installer" -o composer-setup.php
```

执行安装命令：

```bash
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
```

最后对其赋予执行权限：

```bash
sudo chmod +x /usr/local/composer
```

这样 Composer 就安装完成了。下面看下安装的版本：

```bash
$ composer -V
Composer version 2.1.11 2021-11-02 12:10:25
```

## 与 Nginx 配合

首先是需要安装 Nginx。这里可以参考我的[Ubuntu 安装 Nginx](/_posts/ubuntu-install-nginx.md)。

首先我们先写入一个可以输出 `phpinfo()` 的文件。

```bash
echo -e "<?php\nphpinfo();" | sudo tee /usr/share/nginx/html/index.php
```

这里我们修改 `/etc/nginx/conf.d/default.conf` 为如下的内容：

```nginx
server {
    listen       80;
    server_name  localhost;

    root   /usr/share/nginx/html;
    index  index.php index.html;

    location ~ \.php$ {
        fastcgi_pass   unix:/run/php/php8.1-fpm.sock;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```

最后重启下 `Nginx`，然后就可以访问 http://localhost 就可以看到 phpinfo 的相关信息了。