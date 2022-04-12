---
title: redis-start
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

下面介绍以下如何使用 apt 安装 redis 官方源

<!-- more -->

安装证书：

```bash
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
```

写入 apt 配置文件：

```bash
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
```

安装命令：

```bash
sudo apt update
sudo apt install redis
```

## 管理命令

启动：

```
sudo systemctl start redis-server
```

停止：

```
sudo systemctl stop redis-server
```

重新启动：

```
sudo systemctl restart redis-server
```

设置开机启动：

```
sudo systemctl enable redis-server
```

取消开机启动

```
sudo systemctl disable redis-server
```

查看运行状态

```
sudo systemctl status redis-server
```

## 目录

配置文件目录：`/etc/redis/redis.conf`

日志目录：`/var/log/redis/redis-server.log`

PID 位置：`/run/redis/redis-server.pid`

DB 目录：`/var/lib/redis`

## 在不停机的情况下升级 Redis

1. 将新的 Redis 实例设置为当前 Redis 实例的副本。这里需要注意的是，需要有一台不同的服务器，或者当只有一台服务器的时候，需要内存足够大，以保证两台 Redis 可以同时运行。
2. 如果是使用的单台服务器，需要确保副本与主实例在不同的端口启动，否则副本实例则不能正常启动。
3. 等待复制初始化同步完成（检查副本集的日志文件）
4. TODO https://redis.io/docs/manual/admin/