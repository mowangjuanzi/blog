---
title: mysql 复制
date: 2017-11-17 16:24:36
tags:
---
## 概述

MySQL的复制功能是构建基于MySQL的大规模、高性能应用的基础。复制功能不仅有利于构建高性能的应用，同时也是高可用性、可扩展性、灾难恢复、备份以及数据仓库等工作的基础。

本文主要讲述复制如何工作，基本的复制如何搭建，复制的相关配置和优化复制服务器。

## 复制的工作原理：

简单来说，复制分为下面三个步骤：

1. 在主库上把数据更改记录到二进制日志中（这些记录被称为二进制日志事件）。
2. 备库将主库上的日志复制到自己的中继日志（relay log）中。
3. 备库读取中继日志中的事件，将其重放到备库数据之上。

## 配置复制

为MySQL服务器配置复制非常简单。最基本的场景是新安装的主库和备库，总的来说分为以下几步：

1. 在每台服务器上创建复制账号。
2. 配置主库和备库。
3. 通知备库连接到主库并从主库复制数据。
 
### 创建复制账号

MySQL 会赋予一个特殊的权限给复制线程。在备库运行的I/O线程会建立一个到主库的TCP/IP连接。这意味着必须在主库创建一个用户，并赋予一个合适的权限。

通过如下语句创建用户账号：

````shell
mysql> grant replication slave, replication client on *.* to repl@'10.55.160.%' identified by 'Pw12345.';
Query OK, 0 rows affected, 1 warning (0.00 sec)
````

请注意我们将这个账户限制在本地网络。因为这是一个特权账号。

复制账户只需要有主库上的 replication slave 权限，并不需要每一端都赋予 replication client 权限，为啥两端都要赋予呢：

- 用来监控和管理复制的账号需要 replication client 权限，并且针对两个目的使用同一个账号更加容易。
- 如果在主库上建立了账号，然后从主库将数据克隆到备库上时，备库也就设置了 ———— 变成主库所需要的角色，方便后续有需要进行转换角色。

### 配置文件

在主库的 `my.cnf` 文件中增加或者修改如下内容：

````ini
log_bin=mysql-bin
server_id=10
````

必须明确的指定一个唯一的服务器ID，默认服务器ID为1，使用默认值可能会导致和其它服务器的ID产生冲突，所以我们选择10来作为ID，一般的做法时使用服务器的末8位，但要保证它是不变且唯一的。最好选择一些有意义的约定并遵循。

如果之前没有在MySQL的配置中指定`log_bin`选项，需要重新启动MySQL。为了确认二进制日志文件是否已经创建，我们使用以下命令进行查看：

````sql
mysql> show master status\G
*************************** 1. row ***************************
             File: mysql-bin.000001
         Position: 154
     Binlog_Do_DB: 
 Binlog_Ignore_DB: 
Executed_Gtid_Set: 
1 row in set (0.00 sec)
````

需要在备库上的`my.cnf`文件中增加类似的配置，并且同样需要重启服务器：

````sql
log_bin=mysql-bin
server_id=11
relay_log=/var/lib/mysql/mysql-relay-bin
log_slave_updates=1
read_only=1
````

从技术上来说，这些选项都不是必须的。其中一些选项只是显式的列出了默认值。事实上只有`server_id`时必需的。

`log_bin`：默认情况下，它是根据机器名来命名的，但是如果机器名变化了可能会出现问题，为了简便起见，我们在主库和备库设置了同样的值。  
`relay_log`：指定中继日志的位置和命名。  
`slave_updates`：允许备库将其重放的事件也记录到自身的二进制日志中。
`read_only`：该选项会阻止没有任何特权权限的线程修改数据。所以最好不要给用户超出需要的权限。但是并不是很实用，特别是那些需要在备库建表的应用。

### 启动复制

下面我们告诉备库如何连接到主库并重放其二进制日志。这一步不要通过**my.cnf**来配置，而是使用 `change master to` 语句。因为该语句完全替代了**my.cnf**中相应的配置而且允许以后指向别的主库的时候无需重启备库。

````sql
mysql> change master to master_host='10.55.160.91', master_user='repl', master_password='Pw12345.', master_log_file='mysql-bin.000001', master_log_pos=0;
Query OK, 0 rows affected, 2 warnings (0.01 sec)
````

**master_log_pos**参数倍设置成0，因为要从日志的开头读起。我们可以通过`show slave status`语句来检查复制是否正确执行了。

````sql
mysql> show slave status\G
*************************** 1. row ***************************
               Slave_IO_State: 
                  Master_Host: 10.55.160.91
                  Master_User: repl
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000001
          Read_Master_Log_Pos: 4
               Relay_Log_File: mysql-relay-bin.000001
                Relay_Log_Pos: 4
        Relay_Master_Log_File: mysql-bin.000001
             Slave_IO_Running: No
            Slave_SQL_Running: No
              Replicate_Do_DB: 
          Replicate_Ignore_DB: 
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 0
                   Last_Error: 
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 4
              Relay_Log_Space: 154
              Until_Condition: None
               Until_Log_File: 
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File: 
           Master_SSL_CA_Path: 
              Master_SSL_Cert: 
            Master_SSL_Cipher: 
               Master_SSL_Key: 
        Seconds_Behind_Master: NULL
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error: 
               Last_SQL_Errno: 0
               Last_SQL_Error: 
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 0
                  Master_UUID: 
             Master_Info_File: /var/lib/mysql/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: 
           Master_Retry_Count: 86400
                  Master_Bind: 
      Last_IO_Error_Timestamp: 
     Last_SQL_Error_Timestamp: 
               Master_SSL_Crl: 
           Master_SSL_Crlpath: 
           Retrieved_Gtid_Set: 
            Executed_Gtid_Set: 
                Auto_Position: 0
         Replicate_Rewrite_DB: 
                 Channel_Name: 
           Master_TLS_Version: 
1 row in set (0.00 sec)
````

`Slave_IO_State`、`Slave_IO_Running`、`Slave_SQL_Running`这三列显式当前备库尚未运行。

运行下面的命令进行复制：

````sql
mysql> start slave;
Query OK, 0 rows affected (0.00 sec)
````

执行该命令没有显示错误，我们再用`show slave status`命令检查一下：

````sql
mysql> show slave status\G
*************************** 1. row ***************************
               Slave_IO_State: 
                  Master_Host: 10.55.160.91
                  Master_User: repl
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000001
          Read_Master_Log_Pos: 4
               Relay_Log_File: mysql-relay-bin.000001
                Relay_Log_Pos: 4
        Relay_Master_Log_File: mysql-bin.000001
             Slave_IO_Running: No
            Slave_SQL_Running: Yes
              Replicate_Do_DB: 
          Replicate_Ignore_DB: 
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 0
                   Last_Error: 
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 4
              Relay_Log_Space: 154
              Until_Condition: None
               Until_Log_File: 
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File: 
           Master_SSL_CA_Path: 
              Master_SSL_Cert: 
            Master_SSL_Cipher: 
               Master_SSL_Key: 
        Seconds_Behind_Master: NULL
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 1593
                Last_IO_Error: Fatal error: The slave I/O thread stops because master and slave have equal MySQL server UUIDs; these UUIDs must be different for replication to work.
               Last_SQL_Errno: 0
               Last_SQL_Error: 
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 10
                  Master_UUID: 
             Master_Info_File: /var/lib/mysql/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind: 
      Last_IO_Error_Timestamp: 161114 15:28:07
     Last_SQL_Error_Timestamp: 
               Master_SSL_Crl: 
           Master_SSL_Crlpath: 
           Retrieved_Gtid_Set: 
            Executed_Gtid_Set: 
                Auto_Position: 0
         Replicate_Rewrite_DB: 
                 Channel_Name: 
           Master_TLS_Version: 
1 row in set (0.00 sec)
````

看到这里报出一个错误：`Fatal error: The slave I/O thread stops because master and slave have equal MySQL server UUIDs; these UUIDs must be different for replication to work.`，其实这是因为我是用的虚拟机，然后直接进行复制的，倒是UUID相同，解决办法就是删除`auto.cnf`就好了：

````shell
[root@localhost ~]# service mysqld stop
Redirecting to /bin/systemctl stop  mysqld.service
[root@localhost ~]# \rm /var/lib/mysql/auto.cnf 
[root@localhost ~]# service mysqld start
Redirecting to /bin/systemctl start  mysqld.service
````

然后我们继续上面的操作：

````sql
mysql> start slave;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> show slave status\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 10.55.160.91
                  Master_User: repl
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000001
          Read_Master_Log_Pos: 472
               Relay_Log_File: mysql-relay-bin.000003
                Relay_Log_Pos: 685
        Relay_Master_Log_File: mysql-bin.000001
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB: 
          Replicate_Ignore_DB: 
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 0
                   Last_Error: 
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 472
              Relay_Log_Space: 892
              Until_Condition: None
               Until_Log_File: 
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File: 
           Master_SSL_CA_Path: 
              Master_SSL_Cert: 
            Master_SSL_Cipher: 
               Master_SSL_Key: 
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error: 
               Last_SQL_Errno: 0
               Last_SQL_Error: 
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 10
                  Master_UUID: a901199b-aa23-11e6-862e-000c2943e6a3
             Master_Info_File: /var/lib/mysql/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind: 
      Last_IO_Error_Timestamp: 
     Last_SQL_Error_Timestamp: 
               Master_SSL_Crl: 
           Master_SSL_Crlpath: 
           Retrieved_Gtid_Set: 
            Executed_Gtid_Set: 
                Auto_Position: 0
         Replicate_Rewrite_DB: 
                 Channel_Name: 
           Master_TLS_Version: 
1 row in set (0.00 sec)
````

这样就正常了。Slave_IO_State 显示正在等待从主库传递过来的事件，这意味着I/O线程已经读取了主库所有的事件。


到此，一个全新的复制就搞定了。
