---
title: ubuntu 不能启动 AppImage
date: 2022-04-12 22:26:57
updated: 2022-04-12 23:48:00
tags:
- redis
- 缓存
categories:
- 缓存
- 服务器端
- Redis
---

在终端执行 `AppImage` 文件时提示如下错误：

```bash
$ ./Trojan-Qt5-Linux.AppImage 
dlopen(): error loading libfuse.so.2

AppImages require FUSE to run. 
You might still be able to extract the contents of this AppImage 
if you run it with the --appimage-extract option. 
See https://github.com/AppImage/AppImageKit/wiki/FUSE 
for more information
```

就去访问了一下指定链接。现在记录下解决方案：

```bash
sudo apt install fuse libfuse2
sudo modprobe fuse
sudo groupadd fuse
user="$(whoami)"
sudo usermod -a -G fuse $user
```