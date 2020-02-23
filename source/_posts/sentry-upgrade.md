---
title: 纪录一次sentry升级历史
date: 2019-08-07 00:00:00
updated: 2020-02-09 08:01:39
tags:
- sentry
categories:
- 工具
- sentry
---

## 起因

IOS同事说他发现了sentry的一个bug。说是因为9.0.0的bug导致debug file 提示上传成功，但是上网站却发现根本没有上传。所以就开始了我的升级之路。

<!-- more -->

## 调研

因为我的sentry不仅仅用在了服务器端，而且还用在了客户端上。所以我需要解决如果sentry停止了，那么如何解决请求等待的问题。

## Nginx

那么我首先想到的就是修改nginx的配置文件。

下面是我更新的相关内容

```conf
server {
    listen       80;
    server_name  track.example.com;

    set_real_ip_from 127.0.0.1;
    real_ip_header X-Forwarded-For;
    real_ip_recursive on;

    location / {
        // 添加这两行
        default_type text/html; // 设置 content-type 表示这是一个网页
        return 202; # 返回 202 表示已经接收，但是并不处理
        client_max_body_size    100M;
        proxy_set_header X-Real-IP  $remote_addr;
        proxy_set_header Host-Real-IP  $http_host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-Pcol http;
        proxy_pass http://localhost:10000;
    }
}
```

使用这两行，就可以保证客户端正常请求了数据，但是我却把它给抛弃了。保证客户端的正常浏览。

## sentry 升级

接下来就是对sentry进行升级了。

首先，进入到指定目录

```bash
cd /data/
```

对相关目录进行备份(备份是个好习惯，千万不要丢弃)

```bash
cp -r onpremise onpremise2
```

然后进入目录

```bash
cd onpremise
```

停止sentry的运行

```
docker-compose down
```

拉取最新代码

```bash
git pull
```

这个时候可能会提示以下错误：

```bash
error: Your local changes to the following files would be overwritten by merge:
	docker-compose.yml
Please commit your changes or stash them before you merge.
```

首先我们先对内容进行diff，查看修改的部分：

```bash
git diff docker-compose.yml
```

将输出记录下来，以便更新代码之后对该文件进行还原。

这是因为你对该文件进行了修改。但是该文件是被追踪的，所以说需要先还原，然后再次拉取，执行以下代码：

```bash
git checkout docker-compose.yml
git pull
```

执行完成后就表示拉取最新版本库成功了。

现在就要把配置的`docker-compse.yml`内容给还原回来。

接下来就是设置环境变量了：

```bash
export SENTRY_IMAGE='sentry:9.1.2'
```

为什么要这么设置呢。因为通过阅读`Dockerfile`文件可得知，该文件需要读取环境变量`SENTRY_IMAGE`来拉取相关的docker文件。

再次构建我们的服务

```bash
docker-compose build --pull
```

运行中可能会提示：

```bash
09:31:05 [WARNING] sentry.utils.geo: settings.GEOIP_PATH_MMDB not configured.
```

这个提示应该没有配置GEO数据库的地址。先不管，等以后以后机会可以再去研究它。

现在就是要执行迁移了：

```bash
docker-compose run --rm web upgrade
```

在迁移中可能会提示如下消息：

```info
The following content types are stale and need to be deleted:

    sentry | dsymapp
    sentry | versiondsymfile
    sentry | projectdsymfile
    sentry | grouphashtombstone

Any objects related to these content types by a foreign key will also
be deleted. Are you sure you want to delete these content types?
If you're unsure, answer 'no'.

    Type 'yes' to continue, or 'no' to cancel:
```

因为我也不清楚发生了什么。所以我的回答是`no`。

迁移完成就是剩下启动服务了：

```bash
docker-compose up -d
```

一切正常。

最后我们就是把我们的nginx 202响应给注销掉，然后重启nginx就ok了。

## 总结

再次进入之后，发现了UI有一些变化。并且IOS大哥的问题也解决了。但是也产生了一些问题，就是统计的bug统计数据都没了。这不重要，只要bug数据还在，那就可以。

通过这次的升级，了解了很多的东西，对我的成长很有帮助。