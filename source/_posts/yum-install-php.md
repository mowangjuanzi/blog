---
title: DNF 安装 PHP
date: 2017-11-17 16:33:10
updated: 
tags:
- PHP
- DNF
- Linux
- Rocky
categories:
- 操作系统
- Linux
---

> 本教程是在 Rocky 9.0 系统下执行的。

## 启用 CRB 仓储库

```bash
dnf config-manager --set-enabled crb
```

## 安装 EPEL 和 Remi

EPEL：

```bash
dnf install epel-release
```


Remi：

```bash
dnf install https://rpms.remirepo.net/enterprise/remi-release-9.rpm
```

## 设置默认使用版本

查看目前可以启用的版本都有哪些：

```bash
# dnf module list php
Last metadata expiration check: 0:36:18 ago on Thu Aug 18 07:57:35 2022.
Remi's Modular repository for Enterprise Linux 9 - x86_64
Name                Stream                 Profiles                                 Summary
php                 remi-7.4               common [d], devel, minimal               PHP scripting language
php                 remi-8.0               common [d], devel, minimal               PHP scripting language
php                 remi-8.1               common [d], devel, minimal               PHP scripting language

Hint: [d]efault, [e]nabled, [x]disabled, [i]nstalled
```

这样就设置默认安装的 PHP 版本为 8.1

```bash
dnf module reset php
dnf module install php:remi-8.1
```

更新资源包：

```bash
dnf update
```

这样就会安装上了 PHP 了。

这里看下安装的情况：

```bash
# php -v
PHP 8.1.9 (cli) (built: Aug  2 2022 13:02:24) (NTS gcc x86_64)
Copyright (c) The PHP Group
Zend Engine v4.1.9, Copyright (c) Zend Technologies
# php -m
[PHP Modules]
bz2
calendar
Core
ctype
curl
date
dom
exif
fileinfo
filter
ftp
gettext
hash
iconv
json
libxml
mbstring
openssl
pcntl
pcre
Phar
readline
Reflection
session
SimpleXML
sockets
SPL
standard
tokenizer
xml
xmlreader
xmlwriter
xsl
zlib

[Zend Modules]
```

## php支持的扩展

我们可以通过以下命令查看支持安装的php扩展：

```bash
# dnf search php81-
Last metadata expiration check: 0:37:25 ago on Thu Aug 18 07:57:35 2022.
============================================ Name & Summary Matched: php81- ============================================
php81-php-pecl-http-message-devel.x86_64 : php81-php-pecl-http-message developer files (headers)
php81-php-pecl-pcsc-devel.x86_64 : php81-php-pecl-pcsc developer files (header)
php81-php-pecl-psr-devel.x86_64 : php81-php-pecl-psr developer files (header)
php81-php-pecl-raphf-devel.x86_64 : php81-php-pecl-raphf developer files (header)
php81-php-pecl-xmldiff-devel.x86_64 : php81-php-pecl-xmldiff developer files (header)
php81-php-pecl-yaconf-devel.x86_64 : php81-php-pecl-yaconf developer files (header)
php81-php-zephir-parser-devel.x86_64 : php81-php-zephir-parser developer files (headers)
php81-php-zstd-devel.x86_64 : php81-php-zstd developer files (header)
================================================= Name Matched: php81- =================================================
php81-build.x86_64 : Package shipping basic build configuration
php81-php.x86_64 : PHP scripting language for creating dynamic web sites
php81-php-ast.x86_64 : Abstract Syntax Tree
php81-php-bcmath.x86_64 : A module for PHP applications for using the bcmath library
php81-php-brotli.x86_64 : Brotli Extension for PHP
php81-php-cli.x86_64 : Command-line interface for PHP
php81-php-common.x86_64 : Common files for PHP
php81-php-dba.x86_64 : A database abstraction layer module for PHP applications
php81-php-dbg.x86_64 : The interactive PHP debugger
php81-php-devel.x86_64 : Files needed for building PHP extensions
php81-php-embedded.x86_64 : PHP library for embedding in applications
php81-php-enchant.x86_64 : Enchant spelling extension for PHP applications
php81-php-ffi.x86_64 : Foreign Function Interface
php81-php-fpm.x86_64 : PHP FastCGI Process Manager
php81-php-gd.x86_64 : A module for PHP applications for using the gd graphics library
php81-php-geos.x86_64 : PHP module for GEOS
php81-php-gmp.x86_64 : A module for PHP applications for using the GNU MP library
php81-php-imap.x86_64 : A module for PHP applications that use IMAP
php81-php-intl.x86_64 : Internationalization extension for PHP applications
php81-php-ioncube-loader.x86_64 : Loader for ionCube Encoded Files with ionCube 24 support
php81-php-ldap.x86_64 : A module for PHP applications that use LDAP
php81-php-libvirt.x86_64 : PHP language binding for Libvirt
php81-php-libvirt-doc.noarch : Document of php-libvirt
php81-php-litespeed.x86_64 : LiteSpeed Web Server PHP support
php81-php-lz4.x86_64 : LZ4 Extension for PHP
php81-php-maxminddb.x86_64 : MaxMind DB Reader extension
php81-php-mbstring.x86_64 : A module for PHP applications which need multi-byte string handling
php81-php-mysqlnd.x86_64 : A module for PHP applications that use MySQL databases
php81-php-oci8.x86_64 : A module for PHP applications that use OCI8 databases
php81-php-odbc.x86_64 : A module for PHP applications that use ODBC databases
php81-php-opcache.x86_64 : The Zend OPcache
php81-php-pdo.x86_64 : A database access abstraction module for PHP applications
php81-php-pdo-dblib.x86_64 : PDO driver for Microsoft SQL Server and Sybase databases
php81-php-pdo-firebird.x86_64 : PDO driver for Interbase/Firebird databases
php81-php-pear.noarch : PHP Extension and Application Repository framework
php81-php-pecl-ahocorasick.x86_64 : Effective Aho-Corasick string pattern matching algorithm
php81-php-pecl-amqp.x86_64 : Communicate with any AMQP compliant server
php81-php-pecl-apcu.x86_64 : APC User Cache
php81-php-pecl-apcu-devel.x86_64 : APCu developer files (header)
php81-php-pecl-apfd.x86_64 : Always Populate Form Data
php81-php-pecl-awscrt.x86_64 : AWS Common Runtime PHP bindings
php81-php-pecl-base58.x86_64 : Encode and decode data with base58
php81-php-pecl-bitset.x86_64 : BITSET library
php81-php-pecl-cassandra.x86_64 : DataStax PHP Driver for Apache Cassandra
php81-php-pecl-couchbase3.x86_64 : Couchbase Server PHP extension
php81-php-pecl-couchbase4.x86_64 : Couchbase Server PHP extension
php81-php-pecl-crypto.x86_64 : Wrapper for OpenSSL Crypto Library
php81-php-pecl-csv.x86_64 : CSV PHP extension
php81-php-pecl-datadog-trace.x86_64 : APM and distributed tracing for PHP
php81-php-pecl-dbase.x86_64 : dBase database file access functions
php81-php-pecl-decimal.x86_64 : Arbitrary-precision floating-point decimal
php81-php-pecl-dio.x86_64 : Direct I/O functions
php81-php-pecl-ds.x86_64 : Data Structures for PHP
php81-php-pecl-eio.x86_64 : Provides interface to the libeio library
php81-php-pecl-env.x86_64 : Load environment variables
php81-php-pecl-ev.x86_64 : Provides interface to libev library
php81-php-pecl-event.x86_64 : Provides interface to libevent library
php81-php-pecl-excimer.x86_64 : Interrupting timer and low-overhead sampling profiler
php81-php-pecl-fann.x86_64 : Wrapper for FANN Library
php81-php-pecl-gearman.x86_64 : PHP wrapper to libgearman
php81-php-pecl-geoip.x86_64 : Extension to map IP addresses to geographic places
php81-php-pecl-geospatial.x86_64 : PHP Extension to handle common geospatial functions
php81-php-pecl-gmagick.x86_64 : Provides a wrapper to the GraphicsMagick library
php81-php-pecl-gnupg.x86_64 : Wrapper around the gpgme library
php81-php-pecl-grpc.x86_64 : General RPC framework
php81-php-pecl-hdr-histogram.x86_64 : PHP extension wrapper for the C hdrhistogram API
php81-php-pecl-http.x86_64 : Extended HTTP support
php81-php-pecl-http-devel.x86_64 : Extended HTTP support developer files (header)
php81-php-pecl-http-message.x86_64 : PSR-7 HTTP Message implementation
php81-php-pecl-ice.x86_64 : Simple and fast PHP framework
php81-php-pecl-igbinary.x86_64 : Replacement for the standard PHP serializer
php81-php-pecl-igbinary-devel.x86_64 : Igbinary developer files (header)
php81-php-pecl-imagick-im6.x86_64 : Extension to create and modify images using ImageMagick 6
php81-php-pecl-imagick-im6-devel.x86_64 : imagick extension developer files (header)
php81-php-pecl-imagick-im7.x86_64 : Extension to create and modify images using ImageMagick 7
php81-php-pecl-imagick-im7-devel.x86_64 : imagick extension developer files (header)
php81-php-pecl-inotify.x86_64 : Inotify
php81-php-pecl-ion.x86_64 : Amazon ION support
php81-php-pecl-ip2location.x86_64 : Get geo location information of an IP address
php81-php-pecl-ip2proxy.x86_64 : Get proxy information of an IP address
php81-php-pecl-json-post.x86_64 : JSON POST handler
php81-php-pecl-jsonpath.x86_64 : Extract data using JSONPath notation
php81-php-pecl-krb5.x86_64 : Kerberos authentification extension
php81-php-pecl-krb5-devel.x86_64 : Kerberos extension developer files (header)
php81-php-pecl-leveldb.x86_64 : LevelDB PHP bindings
php81-php-pecl-luasandbox.x86_64 : Lua interpreter with limits and safe environment
php81-php-pecl-lzf.x86_64 : Extension to handle LZF de/compression
php81-php-pecl-mailparse.x86_64 : PHP PECL package for parsing and working with email messages
php81-php-pecl-mcrypt.x86_64 : Bindings for the libmcrypt library
php81-php-pecl-memcache.x86_64 : Extension to work with the Memcached caching daemon
php81-php-pecl-memcached.x86_64 : Extension to work with the Memcached caching daemon
php81-php-pecl-memprof.x86_64 : Memory usage profiler
php81-php-pecl-mongodb.x86_64 : MongoDB driver for PHP
php81-php-pecl-msgpack.x86_64 : API for communicating with MessagePack serialization
php81-php-pecl-msgpack-devel.x86_64 : MessagePack developer files (header)
php81-php-pecl-mustache.x86_64 : Mustache templating language
php81-php-pecl-mysql.x86_64 : MySQL database access functions
php81-php-pecl-mysql-xdevapi.x86_64 : MySQL database access functions
php81-php-pecl-nsq.x86_64 : PHP extension for NSQ client
php81-php-pecl-oauth.x86_64 : PHP OAuth consumer extension
php81-php-pecl-opencensus.x86_64 : A stats collection and distributed tracing framework
php81-php-pecl-openswoole.x86_64 : PHP's asynchronous concurrent distributed networking framework
php81-php-pecl-pam.x86_64 : PAM integration
php81-php-pecl-parle.x86_64 : Parsing and lexing
php81-php-pecl-pcov.x86_64 : Code coverage driver
php81-php-pecl-pcsc.x86_64 : An extension for PHP using the winscard PC/SC API
php81-php-pecl-pkcs11.x86_64 : PHP Bindings for PKCS11 modules
php81-php-pecl-pq.x86_64 : PostgreSQL client library (libpq) binding
php81-php-pecl-protobuf.x86_64 : Mechanism for serializing structured data
php81-php-pecl-ps.x86_64 : An extension to create PostScript files
php81-php-pecl-psr.x86_64 : PSR interfaces
php81-php-pecl-quickhash.x86_64 : Set of specific strongly-typed classes for sets and hashing
php81-php-pecl-raphf.x86_64 : Resource and persistent handles factory
php81-php-pecl-rar.x86_64 : PHP extension for reading RAR archives
php81-php-pecl-rdkafka5.x86_64 : Kafka client based on librdkafka
php81-php-pecl-rdkafka6.x86_64 : Kafka client based on librdkafka
php81-php-pecl-redis5.x86_64 : Extension for communicating with the Redis key-value store
php81-php-pecl-rpminfo.x86_64 : RPM information
php81-php-pecl-rrd.x86_64 : PHP Bindings for rrdtool
php81-php-pecl-runkit7.x86_64 : For all those things you... shouldn't have been doing anyway... but surely do!
php81-php-pecl-scoutapm.x86_64 : Native Extension Component for ScoutAPM's PHP Agent
php81-php-pecl-scrypt.x86_64 : Scrypt hashing function
php81-php-pecl-sdl.x86_64 : Simple DirectMedia Layer for PHP
php81-php-pecl-sdl-image.x86_64 : SDL_image bindings for PHP
php81-php-pecl-sdl-mixer.x86_64 : Binding of SDL_mixer for PHP
php81-php-pecl-sdl-ttf.x86_64 : SDL_ttf bindings for PHP
php81-php-pecl-seaslog.x86_64 : An effective, fast, stable log extension for PHP
php81-php-pecl-seassnowflake.x86_64 : PHP Extension for Distributed unique ID generator
php81-php-pecl-selinux.x86_64 : SELinux binding for PHP scripting language
php81-php-pecl-simple-kafka-client.x86_64 : Kafka client based on librdkafka
php81-php-pecl-skywalking.x86_64 : The PHP instrument agent for Apache SkyWalking
php81-php-pecl-solr2.x86_64 : API orientée objet pour Apache Solr
php81-php-pecl-ssdeep.x86_64 : Wrapper for libfuzzy library
php81-php-pecl-ssh2.x86_64 : Bindings for the libssh2 library
php81-php-pecl-stats.x86_64 : Routines for statistical computation
php81-php-pecl-stomp.x86_64 : Stomp client extension
php81-php-pecl-swoole4.x86_64 : PHP's asynchronous concurrent distributed networking framework
php81-php-pecl-swoole5.x86_64 : PHP's asynchronous concurrent distributed networking framework
php81-php-pecl-sync.x86_64 : Named and unnamed synchronization objects
php81-php-pecl-teds.x86_64 : Tentative Extra Data Structures
php81-php-pecl-tensor.x86_64 : Objects for scientific computing in PHP
php81-php-pecl-trader.x86_64 : Technical Analysis for traders
php81-php-pecl-translit.x86_64 : Transliterates non-latin character sets to latin
php81-php-pecl-trie.x86_64 : PHP Trie extension
php81-php-pecl-uopz.x86_64 : User Operations for Zend
php81-php-pecl-uploadprogress.x86_64 : An extension to track progress of a file upload
php81-php-pecl-uuid.x86_64 : Universally Unique Identifier extension for PHP
php81-php-pecl-var-representation.x86_64 : var_representation extension
php81-php-pecl-varnish.x86_64 : Varnish Cache bindings
php81-php-pecl-vips.x86_64 : PHP extension for interfacing with libvips
php81-php-pecl-vld.x86_64 : Dump the internal representation of PHP scripts
php81-php-pecl-wddx.x86_64 : Web Distributed Data Exchange
php81-php-pecl-xattr.x86_64 : Extended attributes
php81-php-pecl-xdebug3.x86_64 : Provides functions for function traces and profiling
php81-php-pecl-xdiff.x86_64 : File differences/patches
php81-php-pecl-xhprof.x86_64 : PHP extension for XHProf, a Hierarchical Profiler
php81-php-pecl-xlswriter.x86_64 : An efficient and fast xlsx file extension
php81-php-pecl-xmldiff.x86_64 : XML diff and merge
php81-php-pecl-xmlrpc.x86_64 : Functions to write XML-RPC servers and clients
php81-php-pecl-xxtea.x86_64 : XXTEA encryption algorithm extension for PHP
php81-php-pecl-yac.x86_64 : Lockless user data cache
php81-php-pecl-yaconf.x86_64 : Yet Another Configurations Container
php81-php-pecl-yaf.x86_64 : Yet Another Framework
php81-php-pecl-yaml.x86_64 : PHP Bindings for yaml
php81-php-pecl-yar.x86_64 : Light, concurrent RPC framework
php81-php-pecl-yaz.x86_64 : Z39.50/SRU client
php81-php-pecl-zip.x86_64 : A ZIP archive management extension
php81-php-pecl-zmq.x86_64 : ZeroMQ messaging
php81-php-pgsql.x86_64 : A PostgreSQL database module for PHP
php81-php-phalcon5.x86_64 : Phalcon Framework
php81-php-phpiredis.x86_64 : Client extension for Redis
php81-php-process.x86_64 : Modules for PHP script using system process interfaces
php81-php-pspell.x86_64 : A module for PHP applications for using pspell interfaces
php81-php-realpath-turbo.x86_64 : Use realpath cache despite open_basedir restriction
php81-php-smbclient.x86_64 : PHP wrapper for libsmbclient
php81-php-snappy.x86_64 : Snappy Extension for PHP
php81-php-snmp.x86_64 : A module for PHP applications that query SNMP-managed devices
php81-php-snuffleupagus.x86_64 : Security module for PHP
php81-php-soap.x86_64 : A module for PHP applications that use the SOAP protocol
php81-php-sodium.x86_64 : Wrapper for the Sodium cryptographic library
php81-php-sqlsrv.x86_64 : Microsoft Drivers for PHP for SQL Server
php81-php-tidy.x86_64 : Standard PHP module provides tidy library support
php81-php-xml.x86_64 : A module for PHP applications which use XML
php81-php-xz.x86_64 : XZ (LZMA2) compression/decompression
php81-php-zephir-parser.x86_64 : Zephir code parser
php81-php-zstd.x86_64 : Zstandard extension
php81-runtime.x86_64 : Package that handles php81 Software Collection.
php81-scldevel.x86_64 : Package shipping development files for php81
php81-syspaths.x86_64 : System-wide wrappers for the php81 package
php81-unit-php.x86_64 : PHP module for NGINX Unit
php81-uwsgi-plugin-php.x86_64 : uWSGI - Plugin for PHP support
php81-xhprof.noarch : A Hierarchical Profiler for PHP - Web interface
```

比如可以通过执行如下命令安装 FPM 扩展：

```bash
dnf install php-mysqlnd
```

其实如果不支持的话，我们也可以手动安装。但是需要执行以下命令：

```bash
dnf install php-devel
```

## PHP-FPM 命令管理

- 启动

```bash
systemctl start php-fpm
```

- 停止

```bash
systemctl stop php-fpm
```

- 重载

```bash
systemctl reload php-fpm
```

- 运行状态

```bash
systemctl status php-fpm
```

- 设置开机启动

```bash
systemctl enable php-fpm 
```

- 取消开机启动

```bash
systemctl disable php-fpm
```

## 总结

至此，`dnf` 安装 PHP 已经结束。如果有什么问题，可以在 GitHub 给我留言，我会再进行补充。

## 参考

- [Remi's RPM repository](https://rpms.remirepo.net/wizard/)