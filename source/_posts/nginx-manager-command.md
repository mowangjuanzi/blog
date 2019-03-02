---
title: nginx 设置管理命令
date: 2017-11-17 16:28:36
tags:
- nginx
- chkconfig
- service
- ubuntu
categories:
- web服务器
- nginx
---
## nginx管理命令：

> 我不是生产者，我只是大自然的搬运工。  
> 以下脚本来自[LNMP一键安装包](https://lnmp.org)中军哥的一键安装脚本。感谢军哥的辛勤劳动。

首先我们先用**vim**或者**vi**打开`/etc/init.d/nginx`;

````shell
vim /etc/init.d/nginx
````

然后按**i**进入编辑模式，将以下内容复制到该文件里面：

````shell
#! /bin/sh
# chkconfig: 2345 55 25
# Description: Startup script for nginx webserver on Debian. Place in /etc/init.d and
# run 'update-rc.d -f nginx defaults', or use the appropriate command on your
# distro. For CentOS/Redhat run: 'chkconfig --add nginx'

### BEGIN INIT INFO
# Provides:          nginx
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the nginx web server
# Description:       starts nginx using start-stop-daemon
### END INIT INFO

# Author:   licess
# website:  http://lnmp.org

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
NAME=nginx
NGINX_BIN=/usr/local/nginx/sbin/$NAME
CONFIGFILE=/usr/local/nginx/conf/$NAME.conf
PIDFILE=/usr/local/nginx/logs/$NAME.pid

case "$1" in
    start)
        echo -n "Starting $NAME... "

        if netstat -tnpl | grep -q nginx;then
            echo "$NAME (pid `pidof $NAME`) already running."
            exit 1
        fi

        $NGINX_BIN -c $CONFIGFILE

        if [ "$?" != 0 ] ; then
            echo " failed"
            exit 1
        else
            echo " done"
        fi
        ;;

    stop)
        echo -n "Stoping $NAME... "

        if ! netstat -tnpl | grep -q nginx; then
            echo "$NAME is not running."
            exit 1
        fi

        $NGINX_BIN -s stop

        if [ "$?" != 0 ] ; then
            echo " failed. Use force-quit"
            exit 1
        else
            echo " done"
        fi
        ;;

    status)
        if netstat -tnpl | grep -q nginx; then
            PID=`pidof nginx`
            echo "$NAME (pid $PID) is running..."
        else
            echo "$NAME is stopped"
            exit 0
        fi
        ;;

    force-quit)
        echo -n "Terminating $NAME... "

        if ! netstat -tnpl | grep -q nginx; then
            echo "$NAME is not running."
            exit 1
        fi

        kill `pidof $NAME`

        if [ "$?" != 0 ] ; then
            echo " failed"
            exit 1
        else
            echo " done"
        fi
        ;;

    restart)
        $0 stop
        sleep 1
        $0 start
        ;;

    reload)
        echo -n "Reload service $NAME... "

        if netstat -tnpl | grep -q nginx; then
            $NGINX_BIN -s reload
            echo " done"
        else
            echo "$NAME is not running, can't reload."
            exit 1
        fi
        ;;

    configtest)
        echo -n "Test $NAME configure files... "

        $NGINX_BIN -t
        ;;

    *)
        echo "Usage: $0 {start|stop|force-quit|restart|reload|status|configtest}"
        exit 1
        ;;

esac
````

然后保存退出。接着执行赋予执行权限命令：

````shell
chmod +x /etc/init.d/nginx
````

这样我们就可以执行管理命令了。比如：

````shell
service nginx start
service nginx stop
````

具体我们可以执行`service nginx`查看。

我们还可以设置开机启动：

````shell
chkconfig nginx on
````
