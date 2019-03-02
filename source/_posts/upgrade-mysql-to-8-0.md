---
title: 数据库升级
date: 2018-08-22 22:55:19
tags:
- mysql
- 升级
categories:
- 数据库
- mysql
---
今天晚上去看服务器，发现数据库的版本是5.7的，看起来挺新的。但是MySQL已经出了8.0了，受不了心中的渴望，所以就直接把源切到8.0新版本了。中国有一些坑，在此记录一下。

## 升级之后wordpress不能连接，提示Error establishing a database connection

原因是mysql在更新之后，因为密码验证规则的修改，导致密码已经变成新版验证的密码了，但是PHP目前并不支持这个新版验证方式。所以解决办法就是使用指定的SQL进行修改密码。修改模式如下:

```sql
ALTER USER 'user'@'host' IDENTIFIED WITH mysql_native_password BY 'password';
```

这样就可以了，不过执行之后出现了另外一个错误。。。

## 执行设置密码SQL出现错误：ERROR 1146 (42S02): Table 'mysql.role_edges' doesn't exist

原因就是升级数据库之后没有执行`mysql_upgrade`命令。

按照如下命令执行一下即可：

```bash
mysql_upgrade -uuser -p
```

执行完成之后，再次执行上面设置密码的命令，这样wordpress就可以正常访问了。
