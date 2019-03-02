---
title: 如何搭建LNMP环境【编译版】
date: 2017-11-17 07:57:05
tags:
- linux
- centos
- php
- nginx
- mysql
categories:
- 操作系统
- centos
---
## 使用的版本

- `centos-7.4`
- `nginx-1.12.1`
- `php-7.1.9`
- `mysql-5.7.19`

> 注意：MySQL5.7的安装需要1G的内存！！！否则会安装失败。

## 安装流程

添加用户(添加用户和用户组 www 和 mysql，并且禁止登录)。

www用户主要是用来赋予nginx和php执行权限，mysql主要是赋予给mysql权限，禁止登录是为了防止用户有权限去操作www和mysql，一切为了安全：

````shell
groupadd www
useradd -s /sbin/nologin -g www www
groupadd mysql
useradd -s /sbin/nologin -g mysql mysql
````

### 添加预安装包

````shell
yum -y install wget gcc gcc-c++ pcre-devel openssl-devel libxml2-devel libcurl-devel libjpeg-devel libpng-devel freetype-devel ncurses-devel libicu-devel libxslt-devel autoconf cmake 
````

我一般都会将安装包放到/usr/local/src目录中，所以先执行下面的命令

````shell
cd /usr/local/src
````

首先我们先下载必需的安装包：

````shell
wget -c http://nginx.org/download/nginx-1.12.1.tar.gz
wget -c http://cn2.php.net/distributions/php-7.1.9.tar.gz
wget -c http://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-boost-5.7.19.tar.gz
````

安装 nginx

````shell
tar zxf nginx-1.12.1.tar.gz
cd nginx-1.12.1
./configure --user=www --group=www --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-http_v2_module --with-http_gzip_static_module --with-http_sub_module
make && make install 
cd ../
````

这样nginx就安装完成了，接下来我们安装PHP：

````shell
tar zxf php-7.1.6.tar.gz
cd php-7.1.6
./configure --prefix=/usr/local/php --with-config-file-path=/usr/local/php/etc --with-config-file-scan-dir=/usr/local/php/conf.d --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --enable-ftp --with-gd --enable-gd-native-ttf --with-openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-soap --with-gettext --disable-fileinfo --enable-opcache --with-xsl
make && make install
cd ../
````

> `mcrypt`扩展已经过时了大约10年，并且用起来很复杂，所以将在PHP7.1中废弃，并且在PHP7.2中将被从核心代码中移除。所以本次并没有启用`mcrypt`扩展。

这样php就安装完成了。然后接下来创建软连接：

````shell
ln -sf /usr/local/php/bin/php /usr/local/bin/php
````

复制php.ini配置文件

````shell
cp /usr/local/src/php-7.1.6/php.ini-production /usr/local/php/etc/php.ini
````

这时候php就已经安装完成了。接下来就是启用php-fpm服务了。

首先生成配置文件

````shell
mv /usr/local/php/etc/php-fpm.conf.default /usr/local/php/etc/php-fpm.conf
mv /usr/local/php/etc/php-fpm.d/www.conf.default /usr/local/php/etc/php-fpm.d/www.conf
````

启动php-fpm的准备工作

````shell
cp /usr/local/src/php-7.1.6/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
chmod +x /etc/init.d/php-fpm
chkconfig php-fpm on
````

这个时候，使用如下命令就可以启动php-fpm了

````shell
service php-fpm start
````

启动起来之后，编辑nginx配置文件，实现nginx的代理访问，找到如下代码：

````shell
vim /usr/local/nginx/conf/nginx.conf
````

````ini
  #location ~ \.php$ {
  #   root           html;
  #  fastcgi_pass   127.0.0.1:9000;
  #  fastcgi_index  index.php;
  #  fastcgi_param  SCRIPT_FILENAME  /script$fastcgi_script_name;
  #  include        fastcgi_params;
  #}
````
把前面的#注释符号去掉，把script改成$document_root，第二行 html 改成你的项目路径，这里我设置的`/home/www/default`，你也可以设置自己喜欢的目录 最终代码如下：

````ini
location ~ \.php$ {
    root           /home/www/default;
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  /$document_root$fastcgi_script_name;
    include        fastcgi_params;
}
````

修改完成之后，先执行nginx配置检测命令，如果没有错误就执行重新加载配置文件的命令：

````shell
/usr/local/nginx/sbin/nginx -t #配置检测命令
/usr/local/nginx/sbin/nginx -s reload #动态加载配置命令
````

我们去`/home/www/default`目录下创建一个php文件。浏览一下是否正常：

````php
<?php
phpinfo();
?>
````

记得对`/home/www/default`进行赋予 **www.www** 权限:

````shell
chown www.www /home/www/default -R
````

如果能正确的显示php的当前信息，就说明我们工作已经完成了一大半了。下面接下来安装mysql：

mysql5.7.5之后版本都要安装boost包。所以我选择是下载已经自带boost安装包的mysql安装包：

````shell
tar zxvf mysql-boost-5.7.18.tar.gz
cd mysql-5.7.18/
cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DSYSCONFDIR=/etc -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DWITH_FEDERATED_STORAGE_ENGINE=1 -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DWITH_EMBEDDED_SERVER=1 -DENABLED_LOCAL_INFILE=1 -DWITH_BOOST=boost -DENABLE_DOWNLOADS=1
make && make install
chown -R mysql:mysql /usr/local/mysql #对mysql目录进行赋予权限
cd ../
````

mysql configure 安装参数解释：

````
-DCMAKE_INSTALL_PREFIX=/usr/local/mysql #指定安装路径
-DDEFAULT_CHARSET=utf8mb4 #默认使用utf8mb4字符
-DDEFAULT_COLLATION=utf8mb4_general_ci #校验字符
-DWITH_INNOBASE_STORAGE_ENGINE=1 #安装innodb引擎 
-DWITH_BOOST=boost #指定boost的安装位置
-DENABLE_DOWNLOADS #是否要下载可选的文件。例如，启用此选项（设置为1），cmake将下载谷歌所使用的测试套件运行单元测试。
````

生成mysql配置文件

````shell
cp /usr/local/mysql/support-files/my-default.cnf /etc/my.cnf
````

对数据库进行初始化，这个时候初始化的时候，屏幕上会出现初始化的密码，记下来，如果错过了，可以通过查看`/root/.mysql_secret`来查看之前的初始化密码：

````shell
/usr/local/mysql/bin/mysqld --initialize --user=mysql
````

复制文件mysql.server 可以使用service 命令进行控制

````shell
cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql
service mysql start #启动mysql
````

登录数据库修改密码

````shell
/usr/local/mysql/bin/mysql -u root -p
````

输入密码回车。登录成功后，输入以下字符，来修改密码，比如我要修改密码为`root`：

````sql
set password = password('root');
````

写一个php程序，来测试mysql是否能否正常连上MySQL：

````php
<?php
$pdo = new PDO("mysql:host=127.0.0.1;dbname=sys;port=3306", 'root', 'root', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'set names utf8mb4', PDO::ATTR_TIMEOUT => 1));
var_dump($pdo);
?>
````

如果连接正常。那就表示我们的环境已经搭建完成了。
