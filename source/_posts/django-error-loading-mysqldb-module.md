---
title: django 报错：Error loading MySQLdb module：No module named 'MySQLdb'
date: 2017-11-17 16:29:11
tags:
---
居然提示不存在mysql扩展。那我就安装呗。

我通过查阅[文档](https://docs.djangoproject.com/en/1.10/ref/databases/#mysql-db-api-drivers)，说python3需要安装的包已经不是`MySQLdb`了，而是`mysqlclient`。那我们就安装这个包了。

执行下面的命令：

````shell
pip3 install mysqlclient
````

居然报错了：

````
OSError: mysql_config not found
````

因为我是使用[Yum 安装 MySQL](http://baoguoxiao.com/detail/4)的方式来安装MySQL的。所有我需要安装开发包。如果你是编译安装的，就不会出现这个问题。

好了，现在安装开发包：

````shell
yum install mysql-devel -y
````

好了。安装成功了。那么就反过头来继续安装之前的mysql包：

````shell
pip3 install mysqlclient
````

好了，我们继续执行一下django，看看是否已经正常了：

````shell
python3 manage.py runserver 0.0.0.0:8001
````

显示信息如下：

````
Django version 1.10.5, using settings 'blog_python.settings'
Starting development server at http://0.0.0.0:8001/
Quit the server with CONTROL-C.
````

这样就表示已经正常了。我们可以继续往下开发了。
