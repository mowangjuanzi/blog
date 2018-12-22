---
title: docker-compose安装
date: 2018-11-11 21:49:51
tags:
---
在安装docker-compose之前必须先检查是否已经安装好了docker。具体安装教程可阅读 {% post_link docker-study-notes-1-install%}。

运行此命令下载最新版本的docker-compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

可以看到我们上面下载的版本是1.23.1。这个可能很快就过期了，这个时候可以查看[Releases](https://github.com/docker/compose/releases)页面了解最新发布的版本，然后将最新发布的版本号替换上面命令中已知的版本号进行下载。

接下来我们对其设置执行权限

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

好了，这样就安装完成了。是不是非常简单。

最后我们检查看版本。

```bash
$ docker-compose --version
docker-compose version 1.23.1, build b02f1306
```

end.
