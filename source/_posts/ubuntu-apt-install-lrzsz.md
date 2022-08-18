---
title: Linux 终端上传下载文件
date: 2018-11-11 21:29:08
tags:
- Ubuntu
- Rocky
- Linux
categories:
- 操作系统
- Linux
---

Linux 与客户端之间进行文件互传是一个非常常见的功能。办法有很多，很多都是借助第三方功能，但是如果要求不使用第三方工具，那么可选项就很少了。下面介绍两种办法：

## `lrzsz`

其实我最钟意这个了。但是这个认终端。需要终端进行适配才可以。

> 该命令对文件大小有限制，最大不能超过 4GB。我想一般人碰到这么大的文件，早就去想其他办法了吧。

使用如下命令安装：

```bash
dnf install lrzsz
```

- 使用方法：

上传文件：

```
rz
```

下载文件：

```bash
sz /path/file
```

## `scp`

这个其实就比 `lrzsz` 比较通用了。但是问题是每次我都得查询一下命令是啥。一般想不起来。

下载文件从远程服务器到本地目录：

```bash
scp user@ip:/path/file /path
```

上传文件从本地目录到远程服务器：

```bash
scp /path/file user@ip:/path 
```

## 参考

- [WebSSH 画龙点睛之 lrzsz 上传下载文件](https://www.cnblogs.com/37Y37/p/12020603.html)
- [一文详解scp命令](https://cloud.tencent.com/developer/article/1849738)