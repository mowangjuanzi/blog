---
title: yum 安装 php
date: 2017-11-17 16:33:10
tags:
---
> 本教程是在CentOS7系统下执行的。

## 安装epel

````shell
yum install epel-release -y
````

接下来我们需要安装remi源：

````shell
rpm -ivh https://mirrors.tuna.tsinghua.edu.cn/remi/enterprise/remi-release-7.rpm
````

## 设置默认安装的PHP版本

首先我们先看看我们能选择安装的版本：

````shell
[root@localhost ~]# yum repolist all | grep php
remi-php54                       Remi's PHP 5.4 RPM repository for  禁用
remi-php55                       Remi's PHP 5.5 RPM repository for  禁用
remi-php55-debuginfo/x86_64      Remi's PHP 5.5 RPM repository for  禁用
remi-php56                       Remi's PHP 5.6 RPM repository for  禁用
remi-php56-debuginfo/x86_64      Remi's PHP 5.6 RPM repository for  禁用
remi-php70                       Remi's PHP 7.0 RPM repository for  禁用
remi-php70-debuginfo/x86_64      Remi's PHP 7.0 RPM repository for  禁用
remi-php70-test                  Remi's PHP 7.0 test RPM repository 禁用
remi-php70-test-debuginfo/x86_64 Remi's PHP 7.0 test RPM repository 禁用
remi-php71                       Remi's PHP 7.1 RPM repository for  禁用
remi-php71-debuginfo/x86_64      Remi's PHP 7.1 RPM repository for  禁用
remi-php71-test                  Remi's PHP 7.1 test RPM repository 禁用
remi-php71-test-debuginfo/x86_64 Remi's PHP 7.1 test RPM repository 禁用
````

现在我们发现全部都是禁用的，这样需要我们手动启动一个，比如现在我们需要使用最新版本PHP7.1的。那么我们就可以执行以下命令：

````shell
[root@localhost ~]# yum-config-manager --enable remi-php71
-bash: yum-config-manager: 未找到命令
````

提示命令没有安装，执行以下命令安装Yum管理工具：

````shell
yum install -y yum-utils
````

我们再继续执行命令：

````shell
yum-config-manager --enable remi-php71
````

现在在重新查看当前remi源的状态：

````shell
[root@localhost ~]# yum repolist all | grep php
 * remi-php71: mirrors.tuna.tsinghua.edu.cn
remi-php54                       Remi's PHP 5.4 RPM repository for  禁用
remi-php55                       Remi's PHP 5.5 RPM repository for  禁用
remi-php55-debuginfo/x86_64      Remi's PHP 5.5 RPM repository for  禁用
remi-php56                       Remi's PHP 5.6 RPM repository for  禁用
remi-php56-debuginfo/x86_64      Remi's PHP 5.6 RPM repository for  禁用
remi-php70                       Remi's PHP 7.0 RPM repository for  禁用
remi-php70-debuginfo/x86_64      Remi's PHP 7.0 RPM repository for  禁用
remi-php70-test                  Remi's PHP 7.0 test RPM repository 禁用
remi-php70-test-debuginfo/x86_64 Remi's PHP 7.0 test RPM repository 禁用
remi-php71                       Remi's PHP 7.1 RPM repository for  启用:    318
remi-php71-debuginfo/x86_64      Remi's PHP 7.1 RPM repository for  禁用
remi-php71-test                  Remi's PHP 7.1 test RPM repository 禁用
remi-php71-test-debuginfo/x86_64 Remi's PHP 7.1 test RPM repository 禁用
````

## 安装PHP

````shell
yum install php 
````

这样php就会安装成功了，因为依赖的关系，我们也会顺便安装上了apache。不过我们可以不用管它。

## php支持的扩展

我们可以通过以下命令查看支持安装的php扩展：

````shell
[root@localhost conf.d]# yum search php71-php-
已加载插件：fastestmirror
Loading mirror speeds from cached hostfile
 * base: mirrors.btte.net
 * epel: ftp.jaist.ac.jp
 * extras: mirrors.btte.net
 * remi-php71: nl.mirror.babylon.network
 * remi-safe: nl.mirror.babylon.network
 * updates: mirrors.zju.edu.cn
========================================================================================================================== N/S matched: php71-php- ===========================================================================================================================
php71-php-pecl-propro-devel.x86_64 : php71-php-pecl-propro developer files (header)
php71-php-pecl-raphf-devel.x86_64 : php71-php-pecl-raphf developer files (header)
php71-php-pecl-xmldiff-devel.x86_64 : php71-php-pecl-xmldiff developer files (header)
php71-php-pecl-yaconf-devel.x86_64 : php71-php-pecl-yaconf developer files (header)
php71-php-ast.x86_64 : Abstract Syntax Tree
php71-php-bcmath.x86_64 : A module for PHP applications for using the bcmath library
php71-php-cli.x86_64 : Command-line interface for PHP
php71-php-common.x86_64 : Common files for PHP
php71-php-dba.x86_64 : A database abstraction layer module for PHP applications
php71-php-dbg.x86_64 : The interactive PHP debugger
php71-php-devel.x86_64 : Files needed for building PHP extensions
php71-php-embedded.x86_64 : PHP library for embedding in applications
php71-php-enchant.x86_64 : Enchant spelling extension for PHP applications
php71-php-fpm.x86_64 : PHP FastCGI Process Manager
php71-php-gd.x86_64 : A module for PHP applications for using the gd graphics library
php71-php-geos.x86_64 : PHP module for GEOS
php71-php-gmp.x86_64 : A module for PHP applications for using the GNU MP library
php71-php-horde-horde-lz4.x86_64 : Horde LZ4 Compression Extension
php71-php-imap.x86_64 : A module for PHP applications that use IMAP
php71-php-interbase.x86_64 : A module for PHP applications that use Interbase/Firebird databases
php71-php-intl.x86_64 : Internationalization extension for PHP applications
php71-php-json.x86_64 : JavaScript Object Notation extension for PHP
php71-php-ldap.x86_64 : A module for PHP applications that use LDAP
php71-php-libvirt.x86_64 : PHP language binding for Libvirt
php71-php-libvirt-doc.noarch : Document of php-libvirt
php71-php-litespeed.x86_64 : LiteSpeed Web Server PHP support
php71-php-lz4.x86_64 : LZ4 Extension for PHP
php71-php-mbstring.x86_64 : A module for PHP applications which need multi-byte string handling
php71-php-mcrypt.x86_64 : Standard PHP module provides mcrypt library support
php71-php-mysqlnd.x86_64 : A module for PHP applications that use MySQL databases
php71-php-oci8.x86_64 : A module for PHP applications that use OCI8 databases
php71-php-odbc.x86_64 : A module for PHP applications that use ODBC databases
php71-php-opcache.x86_64 : The Zend OPcache
php71-php-pdo.x86_64 : A database access abstraction module for PHP applications
php71-php-pdo-dblib.x86_64 : PDO driver Microsoft SQL Server and Sybase databases
php71-php-pear.noarch : PHP Extension and Application Repository framework
php71-php-pecl-amqp.x86_64 : Communicate with any AMQP compliant server
php71-php-pecl-apcu.x86_64 : APC User Cache
php71-php-pecl-apcu-bc.x86_64 : APCu Backwards Compatibility Module
php71-php-pecl-apcu-devel.x86_64 : APCu developer files (header)
php71-php-pecl-apfd.x86_64 : Always Populate Form Data
php71-php-pecl-apm.x86_64 : Alternative PHP Monitor
php71-php-pecl-bitset.x86_64 : BITSET library
php71-php-pecl-cassandra.x86_64 : DataStax PHP Driver for Apache Cassandra
php71-php-pecl-couchbase2.x86_64 : Couchbase Server PHP extension
php71-php-pecl-crypto.x86_64 : Wrapper for OpenSSL Crypto Library
php71-php-pecl-dbase.x86_64 : dBase database file access functions
php71-php-pecl-dio.x86_64 : Direct I/O functions
php71-php-pecl-druid.x86_64 : A Druid driver for PHP
php71-php-pecl-ds.x86_64 : Data Structures for PHP
php71-php-pecl-eio.x86_64 : Provides interface to the libeio library
php71-php-pecl-env.x86_64 : Load environment variables
php71-php-pecl-ev.x86_64 : Provides interface to libev library
php71-php-pecl-event.x86_64 : Provides interface to libevent library
php71-php-pecl-fann.x86_64 : Wrapper for FANN Library
php71-php-pecl-gearman.x86_64 : PHP wrapper to libgearman
php71-php-pecl-gender.x86_64 : Gender Extension
php71-php-pecl-geoip.x86_64 : Extension to map IP addresses to geographic places
php71-php-pecl-geospatial.x86_64 : PHP Extension to handle common geospatial functions
php71-php-pecl-gmagick.x86_64 : Provides a wrapper to the GraphicsMagick library
php71-php-pecl-gnupg.x86_64 : Wrapper around the gpgme library
php71-php-pecl-hdr-histogram.x86_64 : PHP extension wrapper for the C hdrhistogram API
php71-php-pecl-hprose.x86_64 : Hprose for PHP
php71-php-pecl-hrtime.x86_64 : High resolution timing
php71-php-pecl-http.x86_64 : Extended HTTP support
php71-php-pecl-http-devel.x86_64 : Extended HTTP support developer files (header)
php71-php-pecl-igbinary.x86_64 : Replacement for the standard PHP serializer
php71-php-pecl-igbinary-devel.x86_64 : Igbinary developer files (header)
php71-php-pecl-imagick.x86_64 : Extension to create and modify images using ImageMagick
php71-php-pecl-imagick-devel.x86_64 : imagick extension developer files (header)
php71-php-pecl-inotify.x86_64 : Inotify
php71-php-pecl-json-post.x86_64 : JSON POST handler
php71-php-pecl-krb5.x86_64 : Kerberos authentification extension
php71-php-pecl-krb5-devel.x86_64 : Kerberos extension developer files (header)
php71-php-pecl-libsodium.x86_64 : Wrapper for the Sodium cryptographic library
php71-php-pecl-lua.x86_64 : Embedded lua interpreter
php71-php-pecl-lzf.x86_64 : Extension to handle LZF de/compression
php71-php-pecl-mailparse.x86_64 : PHP PECL package for parsing and working with email messages
php71-php-pecl-memcache.x86_64 : Extension to work with the Memcached caching daemon
php71-php-pecl-memcached.x86_64 : Extension to work with the Memcached caching daemon
php71-php-pecl-memprof.x86_64 : Memory usage profiler
php71-php-pecl-mogilefs.x86_64 : PHP client library to communicate with the MogileFS storage
php71-php-pecl-mongodb.x86_64 : MongoDB driver for PHP
php71-php-pecl-mosquitto.x86_64 : Extension for libmosquitto
php71-php-pecl-msgpack.x86_64 : API for communicating with MessagePack serialization
php71-php-pecl-msgpack-devel.x86_64 : MessagePack developer files (header)
php71-php-pecl-mysql.x86_64 : MySQL database access functions
php71-php-pecl-mysql-xdevapi.x86_64 : MySQL database access functions
php71-php-pecl-oauth.x86_64 : PHP OAuth consumer extension
php71-php-pecl-pcs.x86_64 : PHP Code Service
php71-php-pecl-pcs-devel.x86_64 : PHP Code Service (header)
php71-php-pecl-pdflib.x86_64 : Package for generating PDF files
php71-php-pecl-pq.x86_64 : PostgreSQL client library (libpq) binding
php71-php-pecl-propro.x86_64 : Property proxy
php71-php-pecl-radius.x86_64 : Radius client library
php71-php-pecl-raphf.x86_64 : Resource and persistent handles factory
php71-php-pecl-rdkafka.x86_64 : Kafka client based on librdkafka
php71-php-pecl-redis.x86_64 : Extension for communicating with the Redis key-value store
php71-php-pecl-ref.x86_64 : Soft and Weak references support in PHP
php71-php-pecl-request.x86_64 : Server-side request and response objects
php71-php-pecl-rrd.x86_64 : PHP Bindings for rrdtool
php71-php-pecl-scrypt.x86_64 : Scrypt hashing function
php71-php-pecl-seaslog.x86_64 : A effective,fast,stable log extension for PHP
php71-php-pecl-selinux.x86_64 : SELinux binding for PHP scripting language
php71-php-pecl-solr2.x86_64 : API orientée objet pour Apache Solr
php71-php-pecl-ssdeep.x86_64 : Wrapper for libfuzzy library
php71-php-pecl-ssh2.x86_64 : Bindings for the libssh2 library
php71-php-pecl-stats.x86_64 : Routines for statistical computation
php71-php-pecl-stomp.x86_64 : Stomp client extension
php71-php-pecl-swoole.x86_64 : PHP's asynchronous concurrent distributed networking framework
php71-php-pecl-swoole-serialize.x86_64 : Fast and Small serialize
php71-php-pecl-swoole2.x86_64 : PHP's asynchronous concurrent distributed networking framework
php71-php-pecl-sync.x86_64 : Named and unnamed synchronization objects
php71-php-pecl-taint.x86_64 : XSS code sniffer
php71-php-pecl-tcpwrap.x86_64 : Tcpwrappers binding
php71-php-pecl-termbox.x86_64 : A termbox wrapper for PHP
php71-php-pecl-trace.x86_64 : Trace is a low-overhead tracing tool for PHP
php71-php-pecl-trader.x86_64 : Technical Analysis for traders
php71-php-pecl-ui.x86_64 : UI API
php71-php-pecl-uopz.x86_64 : User Operations for Zend
php71-php-pecl-uploadprogress.x86_64 : An extension to track progress of a file upload
php71-php-pecl-uuid.x86_64 : Universally Unique Identifier extension for PHP
php71-php-pecl-uv.x86_64 : Libuv wrapper
php71-php-pecl-varnish.x86_64 : Varnish Cache bindings
php71-php-pecl-vips.x86_64 : PHP extension for interfacing with libvips
php71-php-pecl-vld.x86_64 : Dump the internal representation of PHP scripts
php71-php-pecl-weakref.x86_64 : Implementation of weak references
php71-php-pecl-xattr.x86_64 : Extended attributes
php71-php-pecl-xdebug.x86_64 : PECL package for debugging PHP scripts
php71-php-pecl-xdiff.x86_64 : File differences/patches
php71-php-pecl-xmldiff.x86_64 : XML diff and merge
php71-php-pecl-xxtea.x86_64 : XXTEA encryption algorithm extension for PHP
php71-php-pecl-yac.x86_64 : Lockless user data cache
php71-php-pecl-yaconf.x86_64 : Yet Another Configurations Container
php71-php-pecl-yaf.x86_64 : Yet Another Framework
php71-php-pecl-yaml.x86_64 : PHP Bindings for yaml
php71-php-pecl-yar.x86_64 : Light, concurrent RPC framework
php71-php-pecl-yaz.x86_64 : Z39.50/SRU client
php71-php-pecl-zip.x86_64 : Une extension de gestion des ZIP
php71-php-pecl-zmq.x86_64 : ZeroMQ messaging
php71-php-pgsql.x86_64 : A PostgreSQL database module for PHP
php71-php-phalcon3.x86_64 : Phalcon Framework
php71-php-phpiredis.x86_64 : Client extension for Redis
php71-php-pinba.x86_64 : Client extension for Pinba statistics server
php71-php-process.x86_64 : Modules for PHP script using system process interfaces
php71-php-pspell.x86_64 : A module for PHP applications for using pspell interfaces
php71-php-recode.x86_64 : A module for PHP applications for using the recode library
php71-php-smbclient.x86_64 : PHP wrapper for libsmbclient
php71-php-snappy.x86_64 : Snappy Extension for PHP
php71-php-snmp.x86_64 : A module for PHP applications that query SNMP-managed devices
php71-php-soap.x86_64 : A module for PHP applications that use the SOAP protocol
php71-php-sqlsrv.x86_64 : Microsoft Drivers for PHP for SQL Server
php71-php-tarantool.x86_64 : PHP driver for Tarantool/Box
php71-php-tidy.x86_64 : Standard PHP module provides tidy library support
php71-php-xml.x86_64 : A module for PHP applications which use XML
php71-php-xmlrpc.x86_64 : A module for PHP applications which use the XML-RPC protocol

  名称和简介匹配 only，使用“search all”试试。
````

比如我们现在想要安装php-fpm扩展，我们可以执行以下命令：

````shell
yum install php-fpm -y
````

其实如果不支持的话，我们也可以手动安装。但是需要执行以下命令：

````shell
yum install php-devel -y
````

## php-fpm 命令管理

````shell
# 启动
systemctl start php-fpm

# 停止
systemctl stop php-fpm

# 重载
systemctl reload php-fpm 

#设置开机启动
systemctl enable php-fpm 

#禁止开机启动
systemctl disable php-pfm
````

## 总结。

至此，我们的yum安装php已经讲解完毕。如果有什么问题，可以在下面给我留言，我会再进行补充。
