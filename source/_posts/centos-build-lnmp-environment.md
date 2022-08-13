---
title: 如何搭建 LNMP 环境【编译版】
date: 2017-11-17 07:57:05
updated: 2022-08-14 1:00:08
tags:
- Linux
- Rocky
- PHP
- Nginx
- MySQL
categories:
- 操作系统
- Linux
---

## 本次教程使用的版本

- `Rocky-9.0`
- `Nginx-1.23.1`
- `PHP-8.1.9`
- `MySQL-8.0.30`

## 添加指定用户

添加用户（添加用户和用户组 `www` 和 `mysql`，并且禁止登录）。

`www` 用户主要是用来赋予 `Nginx` 和 `PHP` 执行权限，`mysql` 主要是赋予给 `MySQL` 权限，禁止登录是为了防止用户有权限去操作 `www` 和 `mysql`，一切为了安全。

````bash
useradd -s /sbin/nologin www
useradd -s /sbin/nologin mysql
````

## 添加预安装包

````bash
dnf install -y wget tar gcc gcc-c++ cmake pcre-devel openssl-devel zlib-devel libxml2-devel sqlite-devel libcurl-devel libpng-devel libwebp-devel libjpeg-devel freetype-devel libxslt-devel ncurses-devel libtirpc libudev-devel rpcgen
````

## 下载源码包

我一般都会将安装包放到 `/usr/local/src` 目录中，所以先执行下面的命令

````bash
cd /usr/local/src
````

首先我们先下载必需的安装包：

````bash
wget -c http://nginx.org/download/nginx-1.23.1.tar.gz
wget -c http://www.php.net/distributions/php-8.1.9.tar.gz
wget -c https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.30-linux-glibc2.17-x86_64-minimal.tar.xz
````

## 安装依赖

- `configure: error: Package requirements (oniguruma) were not met: `

```bash
wget -c https://github.com/kkos/oniguruma/releases/download/v6.9.8/onig-6.9.8.tar.gz
tar zxf onig-6.9.8.tar.gz
cd onig-6.9.8
./configure --libdir=/lib64
make && make install
cd ..
```

- `error: Package requirements (libsodium >= 1.0.8) were not met:`

```bash
wget -c https://github.com/jedisct1/libsodium/releases/download/1.0.18-RELEASE/libsodium-1.0.18.tar.gz
tar zxf libsodium-1.0.18.tar.gz
cd libsodium-1.0.18
./configure --libdir=/lib64
make && make install
cd ..
```

- `error: Package requirements (libzip >= 0.11 libzip != 1.3.1 libzip != 1.7.0) were not met:`

```bash
wget -c https://libzip.org/download/libzip-1.9.2.tar.gz
tar zxf libzip-1.9.2.tar.gz
cd libzip-1.9.2
mkdir build && cd build
cmake ..
make && make install
cd ../../
ln -sf /usr/local/lib64/libzip.so.5 /usr/local/lib/
ldconfig /usr/local/lib
```

- `Package 'libtirpc', required by 'virtual:world', not found`

```bash
rpm -hvi https://dl.rockylinux.org/pub/rocky/9/CRB/x86_64/os/Packages/l/libtirpc-devel-1.3.2-1.el9.x86_64.rpm
```

## 安装 PHP

````shell
tar zxf php-8.1.9.tar.gz
cd php-8.1.9
./configure --prefix=/usr/local/php --with-config-file-path=/usr/local/php/etc --with-config-file-scan-dir=/usr/local/php/conf.d --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv --with-freetype --with-jpeg --with-zlib --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --with-curl --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --enable-ftp --enable-gd --with-openssl --with-mhash --enable-pcntl --enable-sockets --with-zip --enable-soap --with-gettext --enable-opcache --with-xsl --with-pear --with-webp --enable-exif --with-sodium
make && make install
cd ../
````

## 配置 PHP

复制 `php.ini` 配置文件。下面的命令默认就是复制的开发模式的配置文件：

````bash
cp /usr/local/src/php-8.1.9/php.ini-development /usr/local/php/etc/php.ini
````

如果是复制生产模式的配置文件，则命令如下：

```bash
cp /usr/local/src/php-8.1.9/php.ini-production /usr/local/php/etc/php.ini
```

修改 FPM 的配置文件：

````bash
cp /usr/local/php/etc/php-fpm.conf.default /usr/local/php/etc/php-fpm.conf
cp /usr/local/php/etc/php-fpm.d/www.conf.default /usr/local/php/etc/php-fpm.d/www.conf
````

接下来就是配置 PHP-FPM 服务并启动。

首先以下内容保存在 `/etc/systemd/system/php-fpm.service` 文件中：

```bash
[Unit]
Description=The PHP FastCGI Process Manager
After=network.target

[Service]
Type=simple
PIDFile=/usr/local/php/var/run/php-fpm.pid
ExecStart=/usr/local/php/sbin/php-fpm --nodaemonize --fpm-config /usr/local/php/etc/php-fpm.conf
ExecReload=/bin/kill -USR2 $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=false

[Install]
WantedBy=multi-user.target
```

这样就可以通过如下命令来控制 FPM：

- 查看当前运行状态

```bash
systemctl status php-fpm
```

- 启动

```bash
systemctl start php-fpm
```

- 停止 

```bash
systemctl stop php-fpm
```

- 重启

```bash
systemctl restart php-fpm
```

- 重载

```bash
systemctl reload php-fpm
```

## 安装 Nginx

````bash
tar zxf nginx-1.23.1.tar.gz
cd nginx-1.23.1
./configure --user=www --group=www --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-http_v2_module --with-http_gzip_static_module --with-http_sub_module --with-stream --with-stream_ssl_module --with-stream_ssl_preread_module --with-pcre --with-pcre-jit
make && make install 
cd ../
````

## 配置 Nginx

首先以下内容保存在 `/etc/systemd/system/nginx.service` 文件中：

```bash
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=false

[Install]
WantedBy=multi-user.target
```

这样就可以通过如下命令来控制 FPM：

- 查看当前运行状态

```bash
systemctl status nginx
```

- 启动

```bash
systemctl start nginx
```

- 停止 

```bash
systemctl stop nginx
```

- 重启

```bash
systemctl restart nginx
```

- 重载

```bash
systemctl reload nginx
```

安装完成后，编译形成的配置文件，都在 `nginx.conf` 里，会显得杂乱与臃肿，扩展起来也不方便，所以这里我建议对其进行分拆。

## Nginx 分拆

主要是将 `http` 中的每个 `server` 都作为一个单独文件进行保存。

修改如下，首先是 `nginx.conf` 的修改：

```nginx

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    # 注意这里 `server` 已经移动到其他的文件，后面会进行介绍

    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

    include vhost/*.conf; # 注意添加了这行
}
```

这里对拆分出来的 `server` 保存到 `/usr/local/nginx/conf/vhost/default.conf` 中。

```nginx
 server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }
```

## 配置 Nginx 与 PHP-FPM 进行网络通信

这里需要指定项目地址。我已经默认访问的目录地址是 `/home/www/default`。

```bash
sudo -u www mkdir /home/www/default
```

然后再里面填充以下内容：

```bash
echo -e "<?php\nphpinfo();" | sudo -u www tee /home/www/default/index.php
```

这里还是要进行修改 `/usr/local/nginx/conf/vhost/default.conf`。修改后的内容如下：

```nginx
 server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        root   /home/www/default; # 这里设置访问的目录
        index  index.html index.php; # 这里设置默认入口文件

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        # 这里这一段都开发
        location ~ \.php$ {
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name; # 这里注意替换 $document_root
            include        fastcgi_params;
        }

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }
```

修改完成之后，先执行 Nginx 配置检测命令，如果没有错误就执行重新加载配置文件的命令：

````bash
/usr/local/nginx/sbin/nginx -t # 配置检测命令
/usr/local/nginx/sbin/nginx -s reload # 动态加载配置命令
````

在访问的时候你就会发现，如果你使用非本机操作（例如虚拟机），则会出现访问无响应的情况，这是因为 Rocky 更换了防火墙工具，所以需要使用下列命令进行放开端口：

```bash
firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --reload
```

如果不出问题，访问 http://localhost 就可以看到经典的 `phpinfo` 相关信息了。

如果有任何问题，可以联系我。

## 安装 MySQL

MySQL 5.7.5 之后版本都要安装 `boost` 包。这里选择的是已自带 `boost` 安装包的 MySQL 安装包：

````bash
tar zxvf mysql-boost-8.0.30.tar.gz
mkdir mysql-8.0.30/build
cd mysql-8.0.30/build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DSYSCONFDIR=/etc -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DWITH_FEDERATED_STORAGE_ENGINE=1 -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DWITH_EMBEDDED_SERVER=1 -DENABLED_LOCAL_INFILE=1 -DWITH_BOOST=/usr/local/src -DDOWNLOAD_BOOST=1
make && make install
chown -R mysql:mysql /usr/local/mysql #对mysql目录进行赋予权限
cd ../../
````

> 在国内下载 `bootst` 通常都会失败，比如说看我这里的安装错误日志：
>
> ```bash
> -- Downloading boost_1_77_0.tar.bz2 to /usr/local/src
> -- [download 0% complete]
> -- [download 1% complete]
> -- [download 2% complete]
> -- Download failed, error: 28;"Timeout was reached"
> CMake Error at cmake/boost.cmake:226 (MESSAGE):
>   You can try downloading
>   https://boostorg.jfrog.io/artifactory/main/release/1.77.0/source/boost_1_77_0.tar.bz2
>   manually using curl/wget or a similar tool, or increase the value of
>   DOWNLOAD_BOOST_TIMEOUT (which is now 600 seconds)
> Call Stack (most recent call first):
>   CMakeLists.txt:1543 (INCLUDE)
> 
> 
> -- Configuring incomplete, errors occurred!
> See also "/usr/local/src/mysql-8.0.30/build/CMakeFiles/CMakeOutput.log".
> See also "/usr/local/src/mysql-8.0.30/build/CMakeFiles/CMakeError.log".
> ```
> 
> 可以看到这里已经提示了下载地址。那么可以通过开启 VPN 下载完成后，就可以通过 FTP 软件或者 `scp` 命令将其同步到指定位置。这里就提供一个 `scp` 同步命令：
>
> ```bash
> scp D:\迅雷下载\boost_1_77_0.tar.bz2 root@192.168.1.8:/usr/local/src
> ```

MySQL `configure` 安装参数解释：

| 配置项 | 值 | 注释 |
|:---:|:---:|:---:|
| `-DCMAKE_INSTALL_PREFIX` | `/usr/local/mysql` | 指定安装路径 |
| `-DSYSCONFDIR` | `/etc` | 默认 `my.cnf` 选项文件的目录 |
| `-DWITH_MYISAM_STORAGE_ENGINE` | `1` | 开启 `MyISAM` 存储引擎 |
| `DWITH_INNOBASE_STORAGE_ENGINE` | `1` |  开启 `innobase` 存储引擎|
| `DWITH_PARTITION_STORAGE_ENGINE` | `1` |开启分区存储引擎 |
| `DWITH_FEDERATED_STORAGE_ENGINE` | `1` | 开启 `Federated` 存储引擎 |
| `DEXTRA_CHARSETS` | `all` | 安装所有扩展字符集 |
| `DDEFAULT_CHARSET` | `utf8mb4` | 设置字符集 |
| `DDEFAULT_COLLATION` | `utf8mb4_general_ci` | 设置字符排序规则 |
| `DWITH_EMBEDDED_SERVER` | `1` | 是否构建 `libmysqld` 嵌入式服务器库 |
| `DENABLED_LOCAL_INFILE` | `1` | 是否允许使用 `LOAD DATA LOCAL INFILE` 命令导入存放于客户端的数据文件 |
| `DWITH_BOOST` | `/usr/local/src` | 设置下载 `boost` 要存放的位置。可以提前使用其它方式下载该文件，然后安装程序就会直接使用，而不会再次下载 |
| `DDOWNLOAD_BOOST` | `1`| 是否要下载 `boost`。 |

## MySQL 配置

创建 MySQL 配置文件：

````bash
cat > /etc/my.cnf<<EOF
[client]
port=3306
socket=/tmp/mysql.sock

[mysqld]
port=3306
socket=/tmp/mysql.sock
key_buffer_size=16M
max_allowed_packet=128M
pid-file=/usr/local/mysql/var/mysqld.pid

[mysqldump]
quick
EOF
````

更改数据库相关目录权限

```bash
chown -R mysql:mysql /usr/local/mysql
```

对数据库进行初始化：

````shell
/usr/local/mysql/bin/mysqld --initialize --user=mysql
````

> 执行初始化命令时，如果日志提示：
>
> ```bash
> 2022-08-13T13:04:11.920018Z 0 [ERROR] [MY-010457] [Server] --initialize specified but the data directory has files in it. Aborting.
> 2022-08-13T13:04:11.920038Z 0 [ERROR] [MY-013236] [Server] The designated data directory /usr/local/mysql/var/ is unusable. You can remove all files that the server added to it.
> ```
> 
> 原因是存在空目录 `/usr/local/mysql/var/lib/mysqlrouter/`，原因暂时未知。可以使用如下方式解决：
>
> ```bash
> rm -rf /usr/local/mysql/var/*
> ```

执行完成后注意看最后一条日志信息：

```bash
2022-08-13T15:39:52.858029Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: r?u3kx1jr+!E
```

这里已经出现了生成的密码。

接下来就是配置 MySQL 服务并启动。

- `mysql_safe` 服务管理

```bash
# /usr/local/mysql/support-files/mysql.server
Usage: mysql.server  {start|stop|restart|reload|force-reload|status}  [ MySQL server options ]
```

- Systemctl 服务管理

首先以下内容保存在 `/etc/systemd/system/mysql.service` 文件中：

```bash
[Unit]
Description=MySQL Community Server
After=network.target syslog.target
Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html
Documentation=man:mysqld(8)

[Service]
User=mysql
Group=mysql

# Have mysqld write its state to the systemd notify socket
Type=notify

# Disable service start and stop timeout logic of systemd for mysqld service.
TimeoutSec=0

# Start main service
ExecStart=/usr/local/mysql/bin/mysqld --defaults-file=/etc/my.cnf $MYSQLD_OPTS 

# Use this to switch malloc implementation
EnvironmentFile=-/etc/sysconfig/mysql

# Sets open_files_limit
LimitNOFILE = 10000

Restart=on-failure

RestartPreventExitStatus=1

# Set environment variable MYSQLD_PARENT_PID. This is required for restart.
Environment=MYSQLD_PARENT_PID=1

PrivateTmp=false

[Install]
WantedBy=multi-user.target
```

这样就可以通过如下命令来控制 MySQL：

- 查看当前运行状态

```bash
systemctl status mysql
```

- 启动

```bash
systemctl start mysql
```

- 停止 

```bash
systemctl stop mysql
```

- 重启

```bash
systemctl restart mysql
```

- 重载

```bash
systemctl reload mysql
```

## 修改数据库密码

在创建数据库时生成的密码实际上已经标记为过期。需要先登录数据库修改密码。

首先使用 `mysql` 命令登录账户：

```bash
/usr/local/mysql/bin/mysql -uroot -p
```

然后执行以下 SQL 命令修改密码（这里我图省事，就设置为 `root`）：

```sql
SET PASSWORD = 'root';
```

其实在生产环境，最好使用随机密码，该 SQL 会生成随机密码设置后并返回明文密码：

```sql
mysql> SET PASSWORD TO RANDOM;
+------+-----------+----------------------+-------------+
| user | host      | generated password   | auth_factor |
+------+-----------+----------------------+-------------+
| root | localhost | nOS5+yD:zoPQBXp,mN++ |           1 |
+------+-----------+----------------------+-------------+
1 row in set (0.00 sec)
```

## PHP 测试连接 MySQL

编辑 PHP 脚本，测试是否能否正常连上 MySQL：

````php
<?php
$pdo = new PDO("mysql:host=127.0.0.1;dbname=sys;port=3306", 'root', 'nOS5+yD:zoPQBXp,mN++', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'set names utf8mb4', PDO::ATTR_TIMEOUT => 1));
var_dump($pdo);
?>
````

如果没有任何错误。那就表示 PHP 能够正常连接 MySQL。

## 感想

如果不是为了更新这篇文章，打死我也不想编译环境了。太麻烦了。强烈推荐使用第三方别人预编译的包进行安装使用。

后续我也会对相关内容进行更新。

## 参考

- [LNMP.org 一键安装包](https://lnmp.org/)
- [php依赖 libzip依赖 libzip.so.5: cannot open shared object file](https://www.jianshu.com/p/9293ff079ab0)
- [Chapter 5 Post Installation Setup](https://dev.mysql.com/doc/mysql-secure-deployment-guide/8.0/en/secure-deployment-post-install.html#secure-deployment-startup-options)
- [13.7.1.10 SET PASSWORD Statement](https://dev.mysql.com/doc/refman/8.0/en/set-password.html)