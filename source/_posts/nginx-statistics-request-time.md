---
title: nginx 自定义日志记录请求时间
date: 2019-02-17 23:33:39
tags:
- nginx
- log
categories:
- web服务器
- nginx
---
## 前言

最近想要统计项目中的请求时间，来判断那些请求响应时间来进行优化对应的代码。

传统办法是使用PHP在项目的入口文件和输出的分别计算时间，然后计算时间差值。但是这种的话，非常麻烦，而且需要修改项目文件，改动较大。如果你对nginx比较了解的话，你就会发现nginx也有统计请求时间的功能，而且配置一下就能实现该功能。

<!-- more -->

下面就介绍一下nginx统计请求时间的方式。

## 环境介绍

- Linux环境：Ubuntu 18.10
- Nginx版本：1.15.5
- PHP版本：7.2.15

我为了能测试该功能，特意搭建了一个phpmyadmin项目来统计访问的请求时间。

## 定义log格式

对于记录请求时间，那么我们需要定义个log格式，来记录请求的URL以及请求处理时间。

该定义在`/etc/nginx/nginx.conf`中：

```nginx
http {
    ...
    
    # 注意这一行
    log_format statistics_time "$request $request_time";

    ...
}
```

下面介绍一下这行配置的意义：

- `log_format` 定义nginx log格式的指令
- `statistics_time` 定义log格式的名称
- `$request` 请求的URI和HTTP协议，如： "GET /article-10000.html HTTP/1.1"
- `$request_time` 整个请求的总时间，单位为分，精确到微秒。如：0.205

## 定义记录位置

下面打开`/etc/nginx/sites-enabled/pma`.

```nginx
server {
	listen 80;
	root /home/baoguoxiao/code/php/phpmyadmin;
	index index.php index.html;
	server_name pma.lvh.me;
	location / {

	}

    access_log /var/log/nginx/access_pma.log;
    access_log '/var/log/nginx/time_pma.log' statistics_time; # 注意这行

	location ~ \.php$ {
		include snippets/fastcgi-php.conf;
		fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
	}
}
```

下面解释一下这一行的指令：

- `access_log` nginx 设置访客log路径的指令
- `/var/log/nginx/time_pma.log` 定义访问日志的路径
- `statistics_time` log格式的名称，对应上面的自定义log格式

配置好之后，就可以重启nginx，查看效果了。下面就是我查看的日志的部分内容：

```log
GET / HTTP/1.1 0.037
POST /ajax.php HTTP/1.1 0.012
POST /navigation.php?ajax_request=1 HTTP/1.1 0.018
POST /ajax.php HTTP/1.1 0.019
POST /ajax.php HTTP/1.1 0.011
POST /version_check.php HTTP/1.1 0.008
GET /favicon.ico HTTP/1.1 0.000
GET /db_structure.php?server=1&db=mysql&ajax_request=true&ajax_page_request=true&_nocache=1550413689281586612&token=%3B%24*%5DFp%7BVsh%40~8%5D9t HTTP/1.1 0.126
```

## 实现按天区分

如何实现按天分配，网上介绍的方式都太重了。我感觉应该nginx是可以自己实现分天记录日志的。在我的不懈搜索之下，真让我找到了。

本次修改都是只需要修改一个文件就可以了：

```nginx
# /etc/nginx/sites-enabled/pma

server {
	...
	
    if ($time_iso8601 ~ "^(\d{4})-(\d{2})-(\d{2})") {
        set $date $1$2$3;
    }

    access_log /var/log/nginx/time_pma_$date.log statistics_time;
    
    ...
}
```

但是在实际运行中并不会出现对应的日志，通过查看`error.log`可以看到如下错误：

```log
2019/02/17 22:33:09 [crit] 54018#54018: *58 open() "/var/log/nginx/time_pma_20190217.log" failed (13: Permission denied) while logging request, client: 192.168.1.230, server: pma.lvh.me, request: "POST /navigation.php?ajax_request=1 HTTP/1.1", upstream: "fastcgi://unix:/var/run/php/php7.2-fpm.sock", host: "pma.lvh.me"
```

通过该日志可以明白是权限的问题导致的该情况。

所以执行以下命令对文件夹进行赋予权限

```bash
sudo chown www-data /var/log/nginx -R
```

这里我的`nginx`运行的用户是`www-data`，如果你的`nginx`用户是`www`，那么你就要将上面命令中的`www-data`修改为`www`再执行。

这样就可以看到生成的对应文件了。

```bash
$ ls
access.log  access_pma.log  error.log  time_pma_20190217.log  time_pma.log
```

## 下一步

下一步思考如何将nginx进行入库，然后实现各种查询和聚合查询。

## 总结

通过上面的方式通过nginx的配置可以做很多的事情。今天要多多加强对于nginx配置的了解。这样通过一些简单的配置，可以做更多的事情，从而减轻自己的工作量。

## 参考

- https://www.cnblogs.com/kevingrace/p/5893499.html
- http://wfsovereign.github.io/2018/05/10/NGINX%E6%8C%89%E5%A4%A9%E7%94%9F%E6%88%90%E6%97%A5%E5%BF%97%E6%96%87%E4%BB%B6%E7%9A%84%E7%AE%80%E6%98%93%E9%85%8D%E7%BD%AE/
- http://returnc.com/detail/3685
- http://nginx.org/en/docs/http/ngx_http_log_module.html
