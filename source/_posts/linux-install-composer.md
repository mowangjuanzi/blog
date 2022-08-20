---
title: Linux 下安装 Composer
date: 2017-11-17 16:27:26
updated: 2022-08-20 16:28:10
tags:
- Linux
- PHP
- Composer
categories:
- 操作系统
- Linux
---

## 前置

使用 Composer 需要先安装 PHP。

可以参考如下几篇进行安装：

- [如何搭建 LNMP 环境【编译版】](/centos-build-lnmp-environment/)
- [DNF 安装 PHP](/yum-install-php/)

## 项目内

其实我们可以在项目根目录执行下列命令：

```bash
wget https://getcomposer.org/download/latest-stable/composer.phar
php composer.phar
```

## 全局手动安装

将文件下载到 `/usr/local/bin` 并修改名称为 `composer`

````shell
sudo wget -O /usr/local/bin/composer https://getcomposer.org/download/latest-stable/composer.phar
````

添加执行权限：

```bash
sudo chmod +x /usr/local/bin/composer
```

就可以直接通过如下方式执行了：

```bash
# composer -V
Composer version 2.4.0 2022-08-16 16:10:48
```

## 系统包管理安装

我个人不是很推荐，具体原因还是因为我使用 Ubuntu 的时候，会依赖一些 PHP 扩展，但是如果是使用第三方库安装的 PHP，那么安装 Composer 的扩展却不是自己能够控制的，以为很可能会依赖系统自带的 PHP 版本。

下面就列一下命令：

CentOS/Rocky/RedHat:

```bash
sudo dnf install composer
```

Debian/Ubuntu:

```bash
sudo apt install composer
```

## 升级

```bash
sudo composer self-update
```

> 此内容仅手动安装的可以使用，因为包管理没有该命令。

## 修改镜像

全局设置腾讯云镜像：

````bash
composer config -g repos.packagist composer https://mirrors.tencent.com/composer/
````

全局设置阿里云镜像：

```bash
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/
```

全局取消镜像：

```bash
composer config -g --unset repos.packagist
```

项目内设置腾讯云镜像：

````bash
composer config repos.packagist composer https://mirrors.tencent.com/composer/
````

项目内设置阿里云镜像：

```bash
composer config repo.packagist composer https://mirrors.aliyun.com/composer/
```

项目内取消镜像：

```bash
composer config -g --unset repos.packagist
```

## 碰到的问题

- `phar "/usr/local/bin/composer" has a broken signature` 错误:

````
PHP Fatal error:  Uncaught exception 'PharException' with message 'phar "/usr/local/bin/composer" has a broken signature' in /usr/local/bin/composer:23
Stack trace:
#0 /usr/local/bin/composer(23): Phar::mapPhar('composer.phar')
#1 {main}
  thrown in /usr/local/bin/composer on line 23
````

**解决办法**：删除文件包，重新安装。

- PHP 缺失 `openssl` 扩展:

````
Some settings on your machine make Composer unable to work properly.
Make sure that you fix the issues listed below and run this script again:

The openssl extension is missing, which means that secure HTTPS transfers are impossible.
If possible you should enable it or recompile php with --with-openssl
````

**解决办法**: PHP 安装 `openssl` 扩展。

- PHP 缺失 `zlib` 扩展:

````
The zlib extension is not loaded, this can slow down Composer a lot.
If possible, install it or recompile php with --with-zlib

The php.ini used by your command-line PHP is: /usr/local/php/etc/php.ini
If you can not modify the ini file, you can also run `php -d option=value` to modify ini values on the fly. You can use -d multiple times.
````

**解决办法**: PHP 安装 `zlib` 扩展。
