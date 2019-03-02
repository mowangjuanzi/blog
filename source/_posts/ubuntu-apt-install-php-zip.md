---
title: ubuntu安装php-zip扩展失败
date: 2018-10-10 23:10:25
tags:
- ubuntu
- php
- php-zip
categories:
- 编程语言
- php
---
我在安装php-zip扩展的时候提示以下错误消息：

```bash
$ sudo apt install php-zip
Reading package lists... Done
Building dependency tree       
Reading state information... Done
Some packages could not be installed. This may mean that you have
requested an impossible situation or if you are using the unstable
distribution that some required packages have not yet been created
or been moved out of Incoming.
The following information may help to resolve the situation:

The following packages have unmet dependencies:
 php-zip : Depends: php7.2-zip but it is not going to be installed
E: Unable to correct problems, you have held broken packages.
```

通过谷歌，发现解决错误的方式很简单。

首先打开`vi /etc/apt/sources.list`，然后修改里面的内容如下所示：

```ini
deb http://archive.ubuntu.com/ubuntu bionic main universe
deb http://archive.ubuntu.com/ubuntu bionic-security main universe
deb http://archive.ubuntu.com/ubuntu bionic-updates main universe
```

执行：

```bash
sudo apt update 
```

然后执行安装命令就好了。

```bash
$ sudo apt install php-zip
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following additional packages will be installed:
  libzip4 php7.2-zip
The following NEW packages will be installed:
  libzip4 php-zip php7.2-zip
0 upgraded, 3 newly installed, 0 to remove and 0 not upgraded.
Need to get 63.9 kB of archives.
After this operation, 204 kB of additional disk space will be used.
Do you want to continue? [Y/n] y
Get:1 http://archive.ubuntu.com/ubuntu bionic/universe amd64 libzip4 amd64 1.1.2-1.1 [37.8 kB]
Get:2 http://ppa.launchpad.net/ondrej/php/ubuntu bionic/main amd64 php7.2-zip amd64 7.2.10-1+ubuntu18.04.1+deb.sury.org+1 [20.3 kB]
Get:3 http://ppa.launchpad.net/ondrej/php/ubuntu bionic/main amd64 php-zip all 1:7.2+62+ubuntu18.04.1+deb.sury.org+3 [5,840 B]
Fetched 63.9 kB in 2s (39.4 kB/s)   
Selecting previously unselected package libzip4:amd64.
(Reading database ... 102709 files and directories currently installed.)
Preparing to unpack .../libzip4_1.1.2-1.1_amd64.deb ...
Unpacking libzip4:amd64 (1.1.2-1.1) ...
Selecting previously unselected package php7.2-zip.
Preparing to unpack .../php7.2-zip_7.2.10-1+ubuntu18.04.1+deb.sury.org+1_amd64.deb ...
Unpacking php7.2-zip (7.2.10-1+ubuntu18.04.1+deb.sury.org+1) ...
Selecting previously unselected package php-zip.
Preparing to unpack .../php-zip_1%3a7.2+62+ubuntu18.04.1+deb.sury.org+3_all.deb ...
Unpacking php-zip (1:7.2+62+ubuntu18.04.1+deb.sury.org+3) ...
Processing triggers for php7.2-fpm (7.2.10-1+ubuntu18.04.1+deb.sury.org+1) ...
Setting up libzip4:amd64 (1.1.2-1.1) ...
Processing triggers for libc-bin (2.27-3ubuntu1) ...
Setting up php7.2-zip (7.2.10-1+ubuntu18.04.1+deb.sury.org+1) ...

Creating config file /etc/php/7.2/mods-available/zip.ini with new version
Setting up php-zip (1:7.2+62+ubuntu18.04.1+deb.sury.org+3) ...
Processing triggers for php7.2-fpm (7.2.10-1+ubuntu18.04.1+deb.sury.org+1) ...
```

## 参考

- https://askubuntu.com/questions/1064634/unable-to-install-php-mbstring
