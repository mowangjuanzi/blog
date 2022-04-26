---
title: Laravel执行npm install失败
date: 2018-08-19 00:16:13
updated: 2018-08-19 00:16:13
tags:
- php
- nodejs
- laravel
- npm
categories:
- 编程语言
- php
- laravel
---
首先介绍一下我的环境。

我是在Windows10上进行开发。然后windows共享文件夹，ubuntu 18.04挂载共享文件夹。

环境：

- Laravel 5.6
- PHP 7.2.7
- NodeJS 8.10.0
- npm 3.5.2

还原场景：

在linux环境中执行`npm install`方法。会出现如下错误：

```bash
npm WARN optional Skipping failed optional dependency /chokidar/fsevents:
npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.2.4
npm WARN ajv-keywords@3.2.0 requires a peer of ajv@^6.0.0 but none was installed.
npm ERR! Linux 4.15.0-30-generic
npm ERR! argv "/usr/bin/node" "/usr/bin/npm" "install"
npm ERR! node v8.10.0
npm ERR! npm  v3.5.2
npm ERR! path ../acorn/bin/acorn
npm ERR! code ENOTSUP
npm ERR! errno -95
npm ERR! syscall symlink

npm ERR! nospc ENOTSUP: operation not supported on socket, symlink '../acorn/bin/acorn' -> '/home/baoguoxiao/windows/food/node_modules/.bin/acorn'
npm ERR! nospc This is most likely not a problem with npm itself
npm ERR! nospc and is related to insufficient space on your system.

npm ERR! Please include the following file with any support request:
npm ERR!     /home/baoguoxiao/windows/food/npm-debug.log
```

经过查询，发现是创建不能创建链接。经过查询，发现解决方法很简单。只要加上一个参数就好了。执行命令如下：

```bash
npm install -no-bin-links
```

错误很复杂，解决的办法却是很简单。

## 参考

- [node.js - npm syscall symlink error -95 when installing node-sass on Docker for Windows - Stack Overflow](https://stackoverflow.com/questions/37062847/npm-syscall-symlink-error-95-when-installing-node-sass-on-docker-for-windows)
