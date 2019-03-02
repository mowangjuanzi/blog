---
title: 我的电脑系统换成了linux之WEB 环境搭建
date: 2017-11-25 10:56:57
tags:
- ubuntu
- nginx
- mysql
- php
categories:
- 操作系统
- ubuntu
---
我的系统使用的优麒麟。它跟ubuntu是一个派系的。

所以都是使用**apt**命令。

首先是安装**nginx**

```bash
sudo apt install nginx
```

非常简单，**nginx**就安装完成了。

接下来会安装**php**，

```bashe
sudo apt install php php-fpm
```

这个时候默认安装是php7.1的，不得不说，ubuntu对于php的更新还是比较频繁的，因为我之前用的centos7.4使用的php版本好像还是5.4的，无语了。

这个时候可能会提示，apache不能启动的错误，这是因为**nginx**已经把**80**端口给占用了，而后面apache再去绑定端口的时候，就会提示绑定失败了。不用管他。因为这次是实现LNMP环境。

接着就是安装mysql了。也是一条命令：

```bash
sudo apt-get install mysql-server-5.7
```

中间会提示让你输入密码。

接下来就是环境的配置了。

首先我们使用以下命令打开fpm的配置文件：

```bash
sudo vim /etc/php/7.1/fpm/pool.d/www.conf
```

将**listen**参数改为监听端口的。（个人习惯，也可以使用socket）

```ini
listen = 127.0.0.1:9000
````

然后执行以下命令重启**php-fpm**

```bash
sudo systemctl reload php7.1-fpm
```

接下来就是配置nginx了。

首先我们查看目录下的配置文件:

```bash
ls /etc/nginx/conf.d/
```

发现目录为为空，之前在centos 之后yum安装的时候还有一个default.conf文件呢，这个直接没了，也不知道是不是忘了给加上。[偷笑]

我们可以将以下文件放入**/etc/nginx/conf.d/default.conf**:

```ini
server {
    listen       80;
    server_name  localhost;

    charset utf-8;

    #access_log  logs/host.access.log  main;
    
    root   html;
    index  index.html index.php;

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```
然后使用以下命令重启nginx

```bash
sudo systemctl reload nginx
```

然后我们在浏览器访问**localhost**，就可以看到我们期待已久的ningx默认页面了。




