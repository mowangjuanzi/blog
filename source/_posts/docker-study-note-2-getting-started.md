---
title: docker学习笔记之二 起步和入门
date: 2018-02-07 22:37:29
tags:
---
docker学习笔记之二 起步和入门

## 测试Docker版本

```bash
$ docker --version
Docker version 17.12.0-ce, build c97c6d6
```

运行**docker version**(不带**--**)或者**docker info**来获取docker安装的更多信息。

```bash
$ sudo docker version
Client:
 Version:	17.12.0-ce
 API version:	1.35
 Go version:	go1.9.2
 Git commit:	c97c6d6
 Built:	Wed Dec 27 20:11:14 2017
 OS/Arch:	linux/amd64

Server:
 Engine:
  Version:	17.12.0-ce
  API version:	1.35 (minimum version 1.12)
  Go version:	go1.9.2
  Git commit:	c97c6d6
  Built:	Wed Dec 27 20:09:47 2017
  OS/Arch:	linux/amd64
  Experimental:	false
```

## 测试已安装的Docker

如果运行简单的Docker 镜像(hello-world)来测试你的安装。

```bash
$ docker run hello-world

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://cloud.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/engine/userguide/
```

列出已经下载到你的机器中的hello-world镜像：

```bash
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
hello-world         latest              f2a91732366c        2 months ago        1.85kB
```

列出由镜像产生的**hello-world**容器，当显示消息后就会退出。如果它在运行中，你不需要使用**--all**选项：

```bash
$ docker container ls --all
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES
65fbaf599670        hello-world         "/hello"            23 minutes ago      Exited (0) 23 minutes ago                       silly_mclean
419dce2f6ec9        hello-world         "/hello"            2 hours ago         Exited (0) 2 hours ago                          eloquent_visvesvaraya
```
## 命令总结

```bash
## 列出 Docker CLI 命令
docker
docker container --help

## 显示 Docker 版本和信息
docker --version
docker version
docker info

## 执行 Docker 镜像
docker run hello-world

## 列出 Docker 镜像
docker image ls

## 理出 Docker 容器 (running, all, all in quiet mode)
docker container ls
docker container ls -all
docker container ls -a -q
```
