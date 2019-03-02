---
title: yum 安装 mysql
date: 2017-11-17 16:23:11
tags:
- yum
- centos
- mysql
categories:
- 数据库
- mysql
---
> 提示：以下命令都是在 `root` 账户下执行的命令。

每次安装mysql的时候都非常痛苦。因为至少要编译半个小时，在想有没有什么简单的办法，我一查官方文档，真让我看到一个简单的yum的安装办法。现在步骤如下：

## 删除已经存在的mysql
我们执行以下命令：
````shell
rpm -qa|grep mysql
rpm -e mysql mysql-libs
yum -y remove mysql-server mysql mysql-libs
````

## 配置源

首先我们需要获取分发源的地址（[点击此处](http://dev.mysql.com/downloads/repo/yum/)）。我现在提供 Red Hat/Centos 连接如下：

````shell
#Red Hat7/CentOS7
http://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm

#Red Hat6/CentOS6
http://dev.mysql.com/get/mysql57-community-release-el6-9.noarch.rpm

#Red Hat5/CentOS5
http://dev.mysql.com/get/mysql57-community-release-el5-7.noarch.rpm

#Fedora 24
http://dev.mysql.com/get/mysql57-community-release-fc24-9.noarch.rpm

#Fedora 23
http://dev.mysql.com/get/mysql57-community-release-fc23-9.noarch.rpm

#Fedora 22
http://dev.mysql.com/get/mysql57-community-release-fc22-8.noarch.rpm
````

比如说我现在的系统是CentOS7，那么我就使用如下方法进行安装：

````shell
[root@localhost ~]# rpm -ivh http://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm
获取http://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm
警告：/var/tmp/rpm-tmp.yIWWrJ: 头V3 DSA/SHA1 Signature, 密钥 ID 5072e1f5: NOKEY
准备中...                          ################################# [100%]
正在升级/安装...
   1:mysql57-community-release-el7-9  ################################# [100%]
````

我们可以通过以下方法检测是否已经成功安装了rpm源：
````shell
[root@localhost ~]# yum repolist enabled | grep "mysql.*-community.*"
mysql-connectors-community/x86_64        MySQL Connectors Community           24
mysql-tools-community/x86_64             MySQL Tools Community                38
mysql57-community/x86_64                 MySQL 5.7 Community Server          146
````

出现最后一行内容就表示已经安装成功了。

## 选择安装版本

> 注意，默认安装源之后自动开启5.7系列的安装。如果你要安装的MySQL低于5.7那么可以通过本节来进行修改源，否则跳过本节即可。

当你使用此方法进行安装MySQL的时候，会默认安装mysql的最新稳定版本（在我现在安装的时候，最新版本为5.7.16）。如果这就是你想要安装的，那么你就可以忽略这步了。如果想要安装以前的版本，比如5.6或者5.5，那么就可以用下面的方法来配置了。

首先我们先查看MySQL的那些源被禁用或者启用了。

````shell
[root@localhost ~]# yum repolist all | grep mysql
mysql-connectors-community/x86_64 MySQL Connectors Community         启用:    24
mysql-connectors-community-source MySQL Connectors Community - Sourc 禁用
mysql-tools-community/x86_64      MySQL Tools Community              启用:    38
mysql-tools-community-source      MySQL Tools Community - Source     禁用
mysql-tools-preview/x86_64        MySQL Tools Preview                禁用
mysql-tools-preview-source        MySQL Tools Preview - Source       禁用
mysql55-community/x86_64          MySQL 5.5 Community Server         禁用
mysql55-community-source          MySQL 5.5 Community Server - Sourc 禁用
mysql56-community/x86_64          MySQL 5.6 Community Server         禁用
mysql56-community-source          MySQL 5.6 Community Server - Sourc 禁用
mysql57-community/x86_64          MySQL 5.7 Community Server         启用:   146
mysql57-community-source          MySQL 5.7 Community Server - Sourc 禁用
mysql80-community/x86_64          MySQL 8.0 Community Server         禁用
mysql80-community-source          MySQL 8.0 Community Server - Sourc 禁用
````

比如我们看到现在启用的是5.7版本系列的。我们需要安装的是5.6系列的。那么我们就可以执行以下命令：

````shell
[root@localhost ~]# yum-config-manager --disable mysql57-community
-bash: yum-config-manager: 未找到命令
````

提示没有找到命令，那么我们就需要安装执行以下命令来安装一个包：

````shell
yum install -y yum-utils 
````

执行成功之后就好了，那么我们继续执行上面的命令：

````shell
yum-config-manager --disable mysql57-community
yum-config-manager --enable mysql56-community
````

我们看看现在的系统配置：

````shell
[root@localhost ~]# yum repolist enabled | grep mysql
mysql-connectors-community/x86_64        MySQL Connectors Community           24
mysql-tools-community/x86_64             MySQL Tools Community                38
mysql56-community/x86_64                 MySQL 5.6 Community Server          289
````

好了。下面就可以进行安装MySQL了。

## 安装MySQL

我这里也是使用MySQL5.7来安装的。

我们只需要执行以下命令就OK了：

````shell
yum install mysql-community-server
````

#MySQL 管理命令

使用下面的命令启动MySQL：

````shell
[root@localhost ~]# service mysqld start
Redirecting to /bin/systemctl start  mysqld.service
````

只要没有错误信息就表示已经正常启动了。

现在我们看以下MySQL的状态：

````shell
[root@localhost ~]# service mysqld status
Redirecting to /bin/systemctl status  mysqld.service
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since 一 2016-11-14 12:34:44 CST; 5min ago
  Process: 35494 ExecStart=/usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid $MYSQLD_OPTS (code=exited, status=0/SUCCESS)
  Process: 35421 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 35498 (mysqld)
   CGroup: /system.slice/mysqld.service
           └─35498 /usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid

11月 14 12:34:39 localhost.localdomain systemd[1]: Starting MySQL Server...
11月 14 12:34:44 localhost.localdomain systemd[1]: Started MySQL Server.
````

这样表示已经正常启动了。

停止：
````shell
service mysqld stop
````

重启：
````shell
service mysqld restart
````

## 修改MySQL密码

我们首先查找一下MySQL的密码：

````shell
[root@localhost ~]# grep 'temporary password' /var/log/mysqld.log
2016-11-14T04:34:41.742516Z 1 [Note] A temporary password is generated for root@localhost: sNKz9yEdzw%/
````

我们就可以看到我们的密码就是： **sNKz9yEdzw%/**。

首先启动MySQL client:

````shell
[root@localhost ~]# mysql -uroot -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.16

Copyright (c) 2000, 2016, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
````

首先我们先查看一下数据库：

````sql
mysql> show databases;
ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.
````

这里提示我们需要修改密码：

这里MySQL安装了 [validate_password](http://dev.mysql.com/doc/refman/5.7/en/validate-password-plugin.html)。这个插件要求密码至少包含一个大写字母，一个小写字母，一个数字和一个特殊字符，并且密码长度至少8个字符。

比如我们定义密码为 **Pw12345.**。

````sql
mysql> set password = password('Pw12345.');
Query OK, 0 rows affected, 1 warning (0.00 sec)
````

然后我们就可以正常的执行SQL命令了：

````sql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.00 sec)
````

## 使用Yum 安装其它的MySQL产品和组件

我们查看一下有什么可以安装的MySQL产品和组件。

````shell
[root@localhost ~]# yum --disablerepo=\* --enablerepo='mysql*-community*' list available
已加载插件：fastestmirror
Loading mirror speeds from cached hostfile
可安装的软件包
mysql-community-bench.x86_64                                     5.6.34-2.el7                             mysql56-community         
mysql-community-client.i686                                      8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-client.x86_64                                    8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-common.i686                                      8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-common.x86_64                                    8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-devel.i686                                       8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-devel.x86_64                                     8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-embedded.i686                                    8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-embedded.x86_64                                  8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-embedded-compat.i686                             8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-embedded-compat.x86_64                           8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-embedded-devel.i686                              8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-embedded-devel.x86_64                            8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-libs.i686                                        8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-libs.x86_64                                      8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-libs-compat.i686                                 8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-libs-compat.x86_64                               8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-release.noarch                                   el7-7                                    mysql57-community         
mysql-community-server.x86_64                                    8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-community-test.x86_64                                      8.0.0-0.1.dmr.el7                        mysql80-community         
mysql-connector-odbc.x86_64                                      5.3.6-1.el7                              mysql-connectors-community
mysql-connector-odbc-debuginfo.x86_64                            5.3.6-1.el7                              mysql-connectors-community
mysql-connector-odbc-setup.x86_64                                5.3.6-1.el7                              mysql-connectors-community
mysql-connector-python.noarch                                    2.0.4-1.el7                              mysql-connectors-community
mysql-connector-python.x86_64                                    2.1.4-1.el7                              mysql-connectors-community
mysql-connector-python-cext.x86_64                               2.1.4-1.el7                              mysql-connectors-community
mysql-connector-python-debuginfo.x86_64                          2.1.4-1.el7                              mysql-connectors-community
mysql-router.x86_64                                              2.0.3-1.el7                              mysql-tools-community     
mysql-router-debuginfo.x86_64                                    2.0.3-1.el7                              mysql-tools-community     
mysql-utilities.noarch                                           1.6.4-1.el7                              mysql-tools-community     
mysql-utilities-extra.noarch                                     1.5.6-1.el7                              mysql-tools-community     
mysql-workbench-community.x86_64                                 6.3.8-1.el7                              mysql-tools-community     
mysql-workbench-community-debuginfo.x86_64                       6.3.8-1.el7                              mysql-tools-community
````

我们可以使用以下命令来安装任何一个软件包，替换 *package-name* 为你要安装的软件包的名字：

````shell
yum install package-name
````

例如：我们要安装 `mysql-community-libs`

````shell
yum install mysql-community-libs
````

## 禁止更新
我们在安装之后，为了能够正常运行，我们会禁止MySQL进行更新。因为在yum更新了MySQL之后，MySQL会自动重启。这对于我们来说是没有必要的，所以我们可以屏蔽更新。我们可以这样，将下列指定放到你的`/etc/yum.conf`文件中：

````shell
exclude=mysql-community-client,mysql-community-common,mysql-community-libs,mysql-community-server
````

## 更新MySQL
一般在生产环境，我们都是禁用更新的。所以说，这里只是作为一个参考。
我们需要执行的命令就是：

````shell
yum update mysql-server
````

> 注意： 在使用 yum 更新之后，MySQL服务器会自动重启。

## 更新单个组件

我们也可以指定更新单个组件。首先我们先运行以下命令来查看MySQL的组件列表

````shell
[root@baoguoxiao ~]# yum list installed | grep "^mysql"
mysql-community-client.x86_64    5.7.17-1.el7                   @mysql57-community
mysql-community-common.x86_64    5.7.17-1.el7                   @mysql57-community
mysql-community-libs.x86_64      5.7.17-1.el7                   @mysql57-community
mysql-community-server.x86_64    5.7.17-1.el7                   @mysql57-community
mysql57-community-release.noarch el7-9                          installed
````

我们可以使用以下命令来更新任何一个软件包，替换 *package-name* 为你要安装的软件包的名字：

````shell
yum update package-name
````

例如：我们要安装 `mysql-community-client`

````shell
yum update mysql-community-client
````

## 总结

上面实现了MySQL的默认安装，命令管理，修改密码，屏蔽更新以及更新。希望能对大家有所帮助。
