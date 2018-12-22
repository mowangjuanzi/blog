---
title: docker学习笔记之一 安装
date: 2018-02-07 21:47:40
tags:
---
## 系统要求

安装docker需要以下版本系统的64位系统：

- Artful 17.10 (Docker CE 17.11 Edge and higher only)
- Zesty 17.04
- Xenial 16.04 (LTS)
- Trusty 14.04 (LTS)

## 卸载老版本

老版本的docker叫做**docker**或者**docker-engine**，如果安装了，就使用以下命令进行卸载：

```bash
sudo apt-get remove docker docker-engine docker.io
```

## 设置使用源安装

- 更新源：

```bash
sudo apt-get update
```

-  使用**apt**使用HTTPS安装包

```bash
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
```

- 添加docker官方GPG密钥：

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

- 使用下列命令设置**stable**源

```bash
sudo add-apt-repository  &quot;deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable&quot;
```

## 安装 docker cc(社区版)

- 更新索引。

```bash
sudo apt-get update
```

- 安装

```bash
sudo apt-get install docker-ce
```

- 验证安装

```bash
sudo docker run hello-world
```

这个命令会下载一个测试镜像，然后在容器中运行它。当容器运行时，它会输出一个消息并退出。

## 卸载Docker CE

- 卸载Docker CE包

```bash
sudo apt-get purge docker-ce
```

- 镜像，容器，卷或者自定义配置文件不会自动移除。要删除所有的镜像，容器和卷，请执行以下命令：

```bash
sudo rm -rf /var/lib/docker
```

## 安装之后

免**sudo**执行**docker**命令，防止出现以下权限不足的错误提示：

```text
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/v1.35/version: dial unix /var/run/docker.sock: connect: permission denied
```

执行命令如下：

```bash
sudo gpasswd -a ${USER} docker
newgrp - docker
```
