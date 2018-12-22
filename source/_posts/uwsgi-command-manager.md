---
title: uwsgi 命令管理
date: 2017-11-17 16:30:00
tags:
---
## 启动命令

首先先看看我的`mysite.ini`文件内容:

````ini
[uwsgi]
chdir=/data/custom/mysite
module=mysite.wsgi:application
master=True
pidfile=/tmp/project-mysite.pid
vacuum=True
max-requests=5000
#daemonize=/var/log/uwsgi/project-mysite.log
http=0.0.0.0:8002
stats=127.0.0.1:8000
processes=1
````

我们主要看`pidfile`，它指定的位置是：**/tmp/project-mysite.pid**

然后启动命令就是：

````shell
uwsgi --ini mysite.ini
````

## 重启命令

> 下面命令的`pid`文件就是我们启动时指定的`pid`文件。

````shell
uwsgi --reload /tmp/project-mysite.pid
````

## 停止命令

> 下面命令的`pid`文件就是我们启动时指定的`pid`文件。

````shell
uwsgi --stop /tmp/project-mysite.pid
````

> 参考：https://uwsgi-docs.readthedocs.io/en/latest/Management.html
