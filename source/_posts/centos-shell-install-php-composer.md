---
title: shell 安装 composer
date: 2017-11-17 16:27:26
tags:
- linux
- centos
- php
- composer
categories:
- 操作系统
- centos
---
安装composer，最好需要有php的软连接。

先执行一下以下命令查看是否`php`命令已经软连接好了。

````shell
[root@68 ~]# which php
/usr/bin/which: no php in (/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin)
````

如果是这样，表示并不能直接使用php。我们这个时候需要对`php`做软连接。

我的`php`的路径在**/usr/local/php/bin/php**。所以命令就是：

````shell
ln -sf /usr/local/php/bin/php /usr/local/bin/php
````

然后我再执行一下开头的命令：

````shell
[root@68 bin]# which php
/usr/local/bin/php
````

好了。这样就可以进行安装了。我们仅仅需要下面这一条命令就可以了。

````shell
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
````

当显示如下效果的时候，就表示安装完成了：

````shell
All settings correct for using Composer
Downloading...

Composer (version 1.3.0) successfully installed to: /usr/local/bin/composer
Use it: php /usr/local/bin/composer
````

这样我们就可以使用composer进行类库安装了。

## 修改为国内镜像

全局修改

````shell
composer config -g repo.packagist composer https://packagist.phpcomposer.com
````

## 碰到的问题

- `phar "/usr/local/bin/composer" has a broken signature` 错误:

````
PHP Fatal error:  Uncaught exception 'PharException' with message 'phar "/usr/local/bin/composer" has a broken signature' in /usr/local/bin/composer:23
Stack trace:
#0 /usr/local/bin/composer(23): Phar::mapPhar('composer.phar')
#1 {main}
  thrown in /usr/local/bin/composer on line 23
````

**解决办法**：删除文件包，重新安装。

- php缺失`openssl`扩展:

````
Some settings on your machine make Composer unable to work properly.
Make sure that you fix the issues listed below and run this script again:

The openssl extension is missing, which means that secure HTTPS transfers are impossible.
If possible you should enable it or recompile php with --with-openssl
````

**解决办法**: PHP安装`openssl`扩展。

- php缺失`zlib`扩展:

````
The zlib extension is not loaded, this can slow down Composer a lot.
If possible, install it or recompile php with --with-zlib

The php.ini used by your command-line PHP is: /usr/local/php/etc/php.ini
If you can not modify the ini file, you can also run `php -d option=value` to modify ini values on the fly. You can use -d multiple times.
````

**解决办法**: PHP安装`zlib`扩展。
