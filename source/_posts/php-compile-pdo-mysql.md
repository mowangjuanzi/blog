---
title: php编译pdo_mysql扩展记录
date: 2017-11-17 16:28:44
tags:
- php
- centos
- linux
- pdo
categories:
- 操作系统
- centos
---
这次作死，直接用默认配置安装了php。什么扩展都没有添加。结果一直在编译缺失的各种扩展。但是最后还是失败了，仅用做记录用。

在编译到pdo_mysql扩展的时候，就搞不定了。

在进行`make`操作的时候，出现了如下错误：

````
/usr/local/src/php-7.0.14/ext/pdo_mysql/php_pdo_mysql_int.h:27:34: 致命错误：ext/mysqlnd/mysqlnd.h：没有那个文件或目录
 # include "ext/mysqlnd/mysqlnd.h"
                                  ^
编译中断。
make: *** [pdo_mysql.lo] 错误 1
````

## 这是走的弯路

我以为是mysqlnd没有编译，我接着去编译mysqlnd扩展了。

然后在`./configure`的时候，结果又提示我：

````
configure: error: Cannot find OpenSSL's <evp.h>
````

我以为是openssl-devel没有安装，我接着安装openssl-devel:

````shell
[root@bogon mysqlnd]# yum install openssl openssl-devel
已加载插件：fastestmirror
Loading mirror speeds from cached hostfile
 * base: mirror.bit.edu.cn
 * epel: mirrors.tuna.tsinghua.edu.cn
 * extras: mirror.bit.edu.cn
 * updates: mirror.bit.edu.cn
软件包 1:openssl-1.0.1e-60.el7.x86_64 已安装并且是最新版本
软件包 1:openssl-devel-1.0.1e-60.el7.x86_64 已安装并且是最新版本
无须任何处理
````

结果提示我已经安装了，那我强行指定路径吧：

````shell
[root@bogon mysqlnd]# ./configure --with-openssl=/usr/include/openssl
configure: WARNING: unrecognized options: --with-openssl
checking for grep that handles long lines and -e... /usr/bin/grep
checking for egrep... /usr/bin/grep -E
checking for a sed that does not truncate output... /usr/bin/sed
checking for cc... cc
checking whether the C compiler works... yes
checking for C compiler default output file name... a.out
checking for suffix of executables... 
checking whether we are cross compiling... no
checking for suffix of object files... o
checking whether we are using the GNU C compiler... yes
checking whether cc accepts -g... yes
checking for cc option to accept ISO C89... none needed
checking how to run the C preprocessor... cc -E
checking for icc... no
checking for suncc... no
checking whether cc understands -c and -o together... yes
checking for system library directory... lib
checking if compiler supports -R... no
checking if compiler supports -Wl,-rpath,... yes
checking build system type... x86_64-unknown-linux-gnu
checking host system type... x86_64-unknown-linux-gnu
checking target system type... x86_64-unknown-linux-gnu
checking for PHP prefix... /usr/local/php
checking for PHP includes... -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib
checking for PHP extension directory... /usr/local/php/lib/php/extensions/no-debug-non-zts-20151012
checking for PHP installed headers prefix... /usr/local/php/include/php
checking if debug is enabled... no
checking if zts is enabled... no
checking for re2c... no
configure: WARNING: You will need re2c 0.13.4 or later if you want to regenerate PHP parsers.
checking for gawk... gawk
checking whether to enable mysqlnd... yes, shared
checking whether to disable compressed protocol support in mysqlnd... yes
checking for the location of libz... no
checking for DSA_get_default_method in -lssl... no
checking for X509_free in -lcrypto... yes
checking for pkg-config... /usr/bin/pkg-config
configure: error: Cannot find OpenSSL's <evp.h>
````

结果还是不行，这下两边路都走不通了，我就去网上查询了。结果还是查询不到什么有用的资料

## 转回正道

我后来想，我直接改源码试试看呢，把`include`加载文件写成绝对目录。

说干就干

我先看看这个报错的地方。

文件在**/usr/local/src/php-7.0.14/ext/pdo_mysql/php_pdo_mysql_int.h:27:34**

我打开该文件，修改第27行的内容：

````c
#       include "ext/mysqlnd/mysqlnd.h"
#       include "ext/mysqlnd/mysqlnd_libmysql_compat.h"
````

我的源代码的目录是**/usr/local/src/php-7.0.14/**，于是我就改成如下所示：

````c
#       include "/usr/local/src/php-7.0.14/ext/mysqlnd/mysqlnd.h"
#       include "/usr/local/src/php-7.0.14/ext/mysqlnd/mysqlnd_libmysql_compat.h"
````

我再进行编译：

````shell
[root@bogon pdo_mysql]# make clean
find . -name \*.gcno -o -name \*.gcda | xargs rm -f
find . -name \*.lo -o -name \*.o | xargs rm -f
find . -name \*.la -o -name \*.a | xargs rm -f 
find . -name \*.so | xargs rm -f
find . -name .libs -a -type d|xargs rm -rf
rm -f libphp.la       modules/* libs/*
[root@bogon pdo_mysql]# make
/bin/sh /usr/local/src/php-7.0.14/ext/pdo_mysql/libtool --mode=compile cc -I/usr/local/php/include/php/ext -I -DZEND_ENABLE_STATIC_TSRMLS_CACHE=1 -I. -I/usr/local/src/php-7.0.14/ext/pdo_mysql -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib  -DHAVE_CONFIG_H  -g -O2   -c /usr/local/src/php-7.0.14/ext/pdo_mysql/pdo_mysql.c -o pdo_mysql.lo 
mkdir .libs
 cc -I/usr/local/php/include/php/ext -I -DZEND_ENABLE_STATIC_TSRMLS_CACHE=1 -I. -I/usr/local/src/php-7.0.14/ext/pdo_mysql -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib -DHAVE_CONFIG_H -g -O2 -c /usr/local/src/php-7.0.14/ext/pdo_mysql/pdo_mysql.c  -fPIC -DPIC -o .libs/pdo_mysql.o
In file included from /usr/local/src/php-7.0.14/ext/pdo_mysql/pdo_mysql.c:32:0:
/usr/local/src/php-7.0.14/ext/pdo_mysql/php_pdo_mysql_int.h:69:39: 致命错误：ext/mysqlnd/mysqlnd_debug.h：没有那个文件或目录
 #include "ext/mysqlnd/mysqlnd_debug.h"
                                       ^
编译中断。
make: *** [pdo_mysql.lo] 错误 1
````

发现有效果，报错的地方变了，我接着改，这里提示报错的地方还是：**/usr/local/src/php-7.0.14/ext/pdo_mysql/php_pdo_mysql_int.h:69:39**，但是行数编程69了，我把69行改成如下所示：

````c
#include "/usr/local/src/php-7.0.14/ext/mysqlnd/mysqlnd_debug.h"
````

继续，发现报错信息又变了：

````
[root@bogon pdo_mysql]# make clean
find . -name \*.gcno -o -name \*.gcda | xargs rm -f
find . -name \*.lo -o -name \*.o | xargs rm -f
find . -name \*.la -o -name \*.a | xargs rm -f 
find . -name \*.so | xargs rm -f
find . -name .libs -a -type d|xargs rm -rf
rm -f libphp.la       modules/* libs/*
[root@bogon pdo_mysql]# make 
/bin/sh /usr/local/src/php-7.0.14/ext/pdo_mysql/libtool --mode=compile cc -I/usr/local/php/include/php/ext -I -DZEND_ENABLE_STATIC_TSRMLS_CACHE=1 -I. -I/usr/local/src/php-7.0.14/ext/pdo_mysql -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib  -DHAVE_CONFIG_H  -g -O2   -c /usr/local/src/php-7.0.14/ext/pdo_mysql/pdo_mysql.c -o pdo_mysql.lo 
mkdir .libs
 cc -I/usr/local/php/include/php/ext -I -DZEND_ENABLE_STATIC_TSRMLS_CACHE=1 -I. -I/usr/local/src/php-7.0.14/ext/pdo_mysql -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib -DHAVE_CONFIG_H -g -O2 -c /usr/local/src/php-7.0.14/ext/pdo_mysql/pdo_mysql.c  -fPIC -DPIC -o .libs/pdo_mysql.o
/usr/local/src/php-7.0.14/ext/pdo_mysql/pdo_mysql.c:64:45: 致命错误：ext/mysqlnd/mysqlnd_reverse_api.h：没有那个文件或目录
 #include "ext/mysqlnd/mysqlnd_reverse_api.h"
                                             ^
编译中断。
make: *** [pdo_mysql.lo] 错误 1
````

我将文件**/usr/local/src/php-7.0.14/ext/pdo_mysql/pdo_mysql.c:64:45**改成如下所示：

````c
#include "/usr/local/src/php-7.0.14/ext/mysqlnd/mysqlnd_reverse_api.h"
````

继续编译：

````shell
[root@bogon pdo_mysql]# make clean
find . -name \*.gcno -o -name \*.gcda | xargs rm -f
find . -name \*.lo -o -name \*.o | xargs rm -f
find . -name \*.la -o -name \*.a | xargs rm -f 
find . -name \*.so | xargs rm -f
find . -name .libs -a -type d|xargs rm -rf
rm -f libphp.la       modules/* libs/*
[root@bogon pdo_mysql]# make 
/bin/sh /usr/local/src/php-7.0.14/ext/pdo_mysql/libtool --mode=compile cc -I/usr/local/php/include/php/ext -I -DZEND_ENABLE_STATIC_TSRMLS_CACHE=1 -I. -I/usr/local/src/php-7.0.14/ext/pdo_mysql -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib  -DHAVE_CONFIG_H  -g -O2   -c /usr/local/src/php-7.0.14/ext/pdo_mysql/pdo_mysql.c -o pdo_mysql.lo 
mkdir .libs
 cc -I/usr/local/php/include/php/ext -I -DZEND_ENABLE_STATIC_TSRMLS_CACHE=1 -I. -I/usr/local/src/php-7.0.14/ext/pdo_mysql -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib -DHAVE_CONFIG_H -g -O2 -c /usr/local/src/php-7.0.14/ext/pdo_mysql/pdo_mysql.c  -fPIC -DPIC -o .libs/pdo_mysql.o
/bin/sh /usr/local/src/php-7.0.14/ext/pdo_mysql/libtool --mode=compile cc -I/usr/local/php/include/php/ext -I -DZEND_ENABLE_STATIC_TSRMLS_CACHE=1 -I. -I/usr/local/src/php-7.0.14/ext/pdo_mysql -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib  -DHAVE_CONFIG_H  -g -O2   -c /usr/local/src/php-7.0.14/ext/pdo_mysql/mysql_driver.c -o mysql_driver.lo 
 cc -I/usr/local/php/include/php/ext -I -DZEND_ENABLE_STATIC_TSRMLS_CACHE=1 -I. -I/usr/local/src/php-7.0.14/ext/pdo_mysql -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib -DHAVE_CONFIG_H -g -O2 -c /usr/local/src/php-7.0.14/ext/pdo_mysql/mysql_driver.c  -fPIC -DPIC -o .libs/mysql_driver.o
/bin/sh /usr/local/src/php-7.0.14/ext/pdo_mysql/libtool --mode=compile cc -I/usr/local/php/include/php/ext -I -DZEND_ENABLE_STATIC_TSRMLS_CACHE=1 -I. -I/usr/local/src/php-7.0.14/ext/pdo_mysql -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib  -DHAVE_CONFIG_H  -g -O2   -c /usr/local/src/php-7.0.14/ext/pdo_mysql/mysql_statement.c -o mysql_statement.lo 
 cc -I/usr/local/php/include/php/ext -I -DZEND_ENABLE_STATIC_TSRMLS_CACHE=1 -I. -I/usr/local/src/php-7.0.14/ext/pdo_mysql -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib -DHAVE_CONFIG_H -g -O2 -c /usr/local/src/php-7.0.14/ext/pdo_mysql/mysql_statement.c  -fPIC -DPIC -o .libs/mysql_statement.o
/bin/sh /usr/local/src/php-7.0.14/ext/pdo_mysql/libtool --mode=link cc -DPHP_ATOM_INC -I/usr/local/src/php-7.0.14/ext/pdo_mysql/include -I/usr/local/src/php-7.0.14/ext/pdo_mysql/main -I/usr/local/src/php-7.0.14/ext/pdo_mysql -I/usr/local/php/include/php -I/usr/local/php/include/php/main -I/usr/local/php/include/php/TSRM -I/usr/local/php/include/php/Zend -I/usr/local/php/include/php/ext -I/usr/local/php/include/php/ext/date/lib  -DHAVE_CONFIG_H  -g -O2   -o pdo_mysql.la -export-dynamic -avoid-version -prefer-pic -module -rpath /usr/local/src/php-7.0.14/ext/pdo_mysql/modules  pdo_mysql.lo mysql_driver.lo mysql_statement.lo 
cc -shared  .libs/pdo_mysql.o .libs/mysql_driver.o .libs/mysql_statement.o   -Wl,-soname -Wl,pdo_mysql.so -o .libs/pdo_mysql.so
creating pdo_mysql.la
(cd .libs && rm -f pdo_mysql.la && ln -s ../pdo_mysql.la pdo_mysql.la)
/bin/sh /usr/local/src/php-7.0.14/ext/pdo_mysql/libtool --mode=install cp ./pdo_mysql.la /usr/local/src/php-7.0.14/ext/pdo_mysql/modules
cp ./.libs/pdo_mysql.so /usr/local/src/php-7.0.14/ext/pdo_mysql/modules/pdo_mysql.so
cp ./.libs/pdo_mysql.lai /usr/local/src/php-7.0.14/ext/pdo_mysql/modules/pdo_mysql.la
PATH="$PATH:/sbin" ldconfig -n /usr/local/src/php-7.0.14/ext/pdo_mysql/modules
----------------------------------------------------------------------
Libraries have been installed in:
   /usr/local/src/php-7.0.14/ext/pdo_mysql/modules

If you ever happen to want to link against installed libraries
in a given directory, LIBDIR, you must either use libtool, and
specify the full pathname of the library, or use the `-LLIBDIR'
flag during linking and do at least one of the following:
   - add LIBDIR to the `LD_LIBRARY_PATH' environment variable
     during execution
   - add LIBDIR to the `LD_RUN_PATH' environment variable
     during linking
   - use the `-Wl,--rpath -Wl,LIBDIR' linker flag
   - have your system administrator add LIBDIR to `/etc/ld.so.conf'

See any operating system documentation about shared libraries for
more information, such as the ld(1) and ld.so(8) manual pages.
----------------------------------------------------------------------

Build complete.
Don't forget to run 'make test'.
````

这样就成功了。接下来我们就可以继续`make install`进行安装了。

````shell
[root@bogon pdo_mysql]# make install
Installing shared extensions:     /usr/local/php/lib/php/extensions/no-debug-non-zts-20151012/
````

我们修改一下配置文件，添加下面的内容到配置文件中：

````ini
extension=pdo_mysql.so
````

然后我们测试扩展是否安装成功了：

````shell
[root@bogon pdo_mysql]# php -m
PHP Warning:  Module 'PDO' already loaded in Unknown on line 0

Warning: Module 'PDO' already loaded in Unknown on line 0
PHP Warning:  PHP Startup: Unable to load dynamic library '/usr/local/php/lib/php/extensions/no-debug-non-zts-20151012/pdo_mysql.so' - /usr/local/php/lib/php/extensions/no-debug-non-zts-20151012/pdo_mysql.so: undefined symbol: mysqlnd_allocator in Unknown on line 0

Warning: PHP Startup: Unable to load dynamic library '/usr/local/php/lib/php/extensions/no-debug-non-zts-20151012/pdo_mysql.so' - /usr/local/php/lib/php/extensions/no-debug-non-zts-20151012/pdo_mysql.so: undefined symbol: mysqlnd_allocator in Unknown on line 0
````

报错了。看来我们还需要mysqlnd扩展：


然后还是提示找不到openssl的错误。

我接着去网上搜了一下。

还是找不到答案，我查了一下，这个好像是一个bug，一直没有修复。

解决办法只能是重装php来解决了。
