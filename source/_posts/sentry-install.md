---
title: 安装sentry
date: 2018-10-29 18:34:14
tags:
---
最近公司内部需要新增一个日志系统。目前可选择的就是sentry和阿里云日志系统。我通过两个对比之后，感觉sentry日志更加好用。所以在这里记录一下相关的笔记。首先这一篇就是安装系列了。

## 前置条件

- docker 
- docker-compose
- git

## 安装

接下来的安装命令就非常简单了。

首先我们先创建目录：

```bash
mkdir /data
```

然后拉取命令

```bash
git clone https://github.com/getsentry/onpremise sentry
```

然后进入目录

```bash
cd sentry
```

首先我们修改一下映射端口。因为默认绑定端口是9000，因为我这台电脑启动了php-fpm服务绑定了9000端口，所以我这里需要将9000改成10000。具体相关配置如下：

```yaml
# docker-compose.yml

  web:
    <<: *defaults
    ports:
      - '10000:9000' # 修改位置
```

好了，接下来就是创建volumn。

```bash
docker volume create --name=sentry-data && docker volume create --name=sentry-postgres
```

生成配置文件

```bash
cp -n  .env.example .env
```

创建服务

```bash
docker-compose build
```

生成秘钥

```bash
docker-compose run --rm web config generate-secret-key
```

将生成的秘钥添加到`.env`中的`SENTRY_SECRET_KEY`项。

构建数据库

```bash
docker-compose run --rm web upgrade
```

启动所有服务

```bash
docker-compose up -d
```

好了，这样sentry就安装完成了。

## Nginx转发

```conf
server {
    listen 80;
    server_name abc.example.com;

    location / {
          proxy_set_header X-Real-IP  $remote_addr;
          proxy_set_header Host-Real-IP  $http_host;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Real-Pcol http;
          proxy_pass http://localhost:10000;
   }
}
```

这样我们就可以使用绑定的域名进行访问了。

## 端口安全

使用netstat命令查询端口状态：

```bash
# netstat -ntlp | grep 10000
tcp6       0      0 :::10000                :::*                    LISTEN      22354/docker-proxy
```

发现这个并没有绑定127.0.0.1。这里我并没有研究好如何绑定127.0.0.1。这里可以通过防火墙进行端口控制。比如阿里云的入网端口管理，或者centos的firewalld命令都可以进行控制。具体就不展开了。

PS：明天具体写如何配置邮件发送。
