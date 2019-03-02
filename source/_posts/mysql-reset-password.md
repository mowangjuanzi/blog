---
title: mysql 重置密码
date: 2017-11-17 16:25:49
tags:
- mysql
categories:
- 数据库
- mysql
---
当我们安装了mysql或者mariadb的时候，一不小心，就把密码给忘记了。这个时候，我们不管怎么尝试密码，都是错误的，都会显示如下错误：

```bash
[root@iZ28zkjw87oZ ~]# mysql -uroot -p
Enter password: 
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)
```

这个问题特别的头疼。
但是如果我们用如下方法就可以迎刃而解了。
首先我们先修改配置文件：

```bash
vim /etc/my.cnf
```

然后在`mysqld`节中增加下面一行代码：

```ini
[mysqld]
skip-grant-tables # 这个是要加入的内容
```

然后重启mysql/mariadb之后，就可以不用密码而直接进去了。
这个时候我们就可以执行命令：

```sql
UPDATE mysql.user SET Password=PASSWORD(&#039;your password&#039;) WHERE User=&#039;root&#039;;
```
这样就把密码给修改了。修改之后。然后我们将`my.cnf`中的这行注释掉：
```ini
[mysqld]
#skip-grant-tables
```
然后重启就可以了。
这样就实现了我们mysql/mariadb的重置密码功能了。
