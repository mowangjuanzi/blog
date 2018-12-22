---
title: mac搭建web环境
date: 2018-11-16 14:06:11
tags:
---
## homebrew

在centos上有yum，ubuntu上有apt，而mac则是brew。这个并不是内置的。需要在终端执行命令进行安装。命令如下：

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

安装之后就可以像是linux一样使用包管理了。包的列表可浏览 https://formulae.brew.sh/formula/ 。

## nginx

安装命令：

```bash
brew install nginx
```

启动nginx

```bash
brew services start nginx
```

重启nginx

```bash
brew services restart nginx
```

停止nginx

```bash
brew services stop nginx
```

## PHP

安装

```bash
brew install php
```

启动php

```bash
brew services start php
```

重启php

```bash
brew services restart php
```

停止php

```bash
brew services stop php
```

## MySQL

安装

```bash
brew install mysql
```

启动命令

```bash
brew services start mysql
```

重启命令

```bash
brew services restart mysql
```

停止命令

```bash
brew services stop mysql
```

### 设置密码

首先启动mysql服务器，然后执行

```bash
mysql_secure_installation
```

如果出现如下内容：

```bash
VALIDATE PASSWORD COMPONENT can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD component?

Press y|Y for Yes, any other key for No: 
```

表示询问你是否需要安装密码验证插件，这里我输入**y**允许安装了。

接下来

```bash
There are three levels of password validation policy:

LOW    Length >= 8
MEDIUM Length >= 8, numeric, mixed case, and special characters
STRONG Length >= 8, numeric, mixed case, special characters and dictionary                  file

Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG:
```

这里是要求制定密码强度，我这里选择是0，

接下来就是让我输入两边密码了，

因为我输入的密码比较简单，所以有了如下提示：

```bash
Estimated strength of the password: 50
Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) :
```

提示说这个密码的强度不高，询问是否真的使用这类强度的密码呢？我选择使用。

```bash
Remove anonymous users? (Press y|Y for Yes, any other key for No) :
```

是否移除匿名用户？肯定要移除啊。

```bash
Disallow root login remotely? (Press y|Y for Yes, any other key for No) :
```

是否禁用root远程登录呢？肯定要禁用啊。

```bash
Remove test database and access to it? (Press y|Y for Yes, any other key for No) :
```

是否要移除test数据库(这是一个测试数据库)呢？肯定要移除。

```
Reload privilege tables now? (Press y|Y for Yes, any other key for No) :
```

是否要重载权限表。嗯，要重载。

然后设置就完成了。

接下来我们就可以使用如下命令登录mysql了。

```bash
mysql -uroot -p
```

### 登录验证插件

这里有个小问题，就是mysql的身份验证插件从之前的`mysql_native_password`更新为`caching_sha2_password`。

目前的PHP并不支持更新后的插件，所以可以参考我如下的文章使用之前的身份验证插件创建用户密码。

具体可以参考我的这一篇文章《{% post_link upgrade-mysql-to-8-0 %}》.

## 组合

安装完成后，其实nginx并不能直接和php进行通信。一般通信的方式有两种，一种是通过监听端口(默认9000)，一种是监听socket。这里我们使用监听端口的方式。

因为php-fpm这边已经默认是监听127.0.0.1:9000端口了，所以这里只需要修改nginx配置即可。

首先打开`/usr/local/etc/nginx/nginx.conf`

修改后的配置文件如下：

```text
# server 部分修改如下
server {
    listen       80; # 修改端口为80
    server_name  localhost;

    charset utf-8; # 设置默认字符集为utf-8

    #access_log  logs/host.access.log  main;

    root   html;
    index  index.php index.html index.htm; # 新增index.php

    location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name; // 修改`/script`为`$document_root`，该值为root定义的路径
        include        fastcgi_params;
    }
}
```

然后打开`/usr/local/var/www`目录，新增`index.php`文件，内容如下:

```php
<?php
phpinfo();
```

使用如下命令重启nginx

```bash
brew services restart nginx
```

最后访问`localhost`就可以看到phpinfo正确显示的网页了。

## 参考

- https://brew.sh/
- https://formulae.brew.sh/formula/
- https://mysqlserverteam.com/upgrading-to-mysql-8-0-default-authentication-plugin-considerations/
