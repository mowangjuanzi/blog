---
title: docker学习笔记之三 容器
date: 2018-02-21 20:20:10
tags:
---
docker学习笔记之三 容器

现在我们根据教程创建一个容器。

## 使用**Dockerfile**定义一个容器

首先我们先创建一个文件夹。我创建的文件夹的路径如下：

```bash
$ pwd
/home/baoguoxiao/docker
```

我们使用**cd**命令进入到该文件夹。然后我们创建一个叫做**Dockerfile**的文件。把以下内容复制并粘贴到刚才创建的文件中并保存。

```ini
# 使用官方的python作为父镜像
FROM python:2.7-slim

# 设置工作目录为 /app
WORKDIR /app

# 复制当前文件夹的内容到容器的 /app目录
ADD . /app

# 安装在requirements.txt中指定的所必须的包
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# 定义80端口对容器外可用
EXPOSE 80

# 定义环境变量
ENV NAME World

# 当容器启动时运行 app.py
CMD ["python", "app.py"]
```

这个文件提到了我们两个没有创建的文件，**requirements.txt**和**app.py**，下面我将会给出两个文件的内容，将以下内容复制并粘贴到相应的文件中，并且这两个文件和**Dockerfile**一样，属于同级目录。

**requirements.txt**

```
Flask
Redis
```

**app.py**

```python
from flask import Flask
from redis import Redis, RedisError
import os
import socket

# Connect to Redis
redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)

app = Flask(__name__)

@app.route("/")
def hello():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"

    html = "<h3>Hello {name}!</h3>" \
           "<b>Hostname:</b> {hostname}<br/>" \
           "<b>Visits:</b> {visits}"
    return html.format(name=os.getenv("NAME", "world"), hostname=socket.gethostname(), visits=visits)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
```
可以看到我们安装了Flask和Redis库，但是我们并没有安装Redis数据库，所以我们期望在完成的时候能够提示错误信息。

## 构建应用程序

我们准备要构建我们的程序了，首先我们要保证我们处于原来的目录。现在我们看下我们目前的目录的内容：

```bash
$ ls
app.py  Dockerfile  requirements.txt
```

现在我们执行命令，它会创建一个镜像。使用**-t**设定一个更加友好的名字：

```bash
docker build -t friendlyhello .
```

现在我们查看一下我们的镜像列表：

```bash
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
friendlyhello       latest              bc24eaee5b6d        10 minutes ago      148MB
python              2.7-slim            4fd30fc83117        8 weeks ago         138MB
hello-world         latest              f2a91732366c        2 months ago        1.85kB
```

## 运行APP

运行APP，我们使用机器的4000端口跟发布的容器的80端口进行映射：

```bash
docker run -p 4000:80 friendlyhello
```

启动之后，我们就可以访问 http://localhost:4000 来访问了。

我们这里是使用真实系统的4000端口来映射到我们生成的镜像的80端口。

按<kbd>Ctrl+C</kbd>强制退出。

现在我们用后台守护进程运行程序。

```bash
docker run -d -p 4000:80 friendlyhello
```

现在我们使用以下命令查看目前正在运行的容器。

```bash
$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                  NAMES
27d94a4c5481        friendlyhello       "python app.py"     7 minutes ago       Up 7 minutes        0.0.0.0:4000->80/tcp   vigilant_easley
```

现在我们将我们运行的docker停止。

```bash
docker container stop 27d94a4c5481
```

**27d94a4c5481**是我运行的容器ID。每台机器的容器ID是不同，在运行此命令时请自主替换相关容器ID。

## 分享镜像

首先我们需要执行以下命令进行登陆，期间会要求输入docker ID以及密码，如果没有账号，可点击[此处](https://cloud.docker.com/)进行账号注册。

首先我们推荐设定一个tag，这样才能方便对镜像进行管理。首先我们先看看语法格式：

```bash
docker tag image username/repository:tag
```

例如：

```bash
docker tag mowangjuanzi/get-started:part2
```

然后我们将这个镜像进行上传：

```bash
docker push mowangjuanzi/get-started:part2
```

## 命令总结

```bash
docker build -t friendlyhello .  # 使用目录的Dockerfile文件创建镜像
docker run -p 4000:80 friendlyhello  # 运行"friendlyname"映射端口4000到80
docker run -d -p 4000:80 friendlyhello         # 同上，但是是后台运行模式
docker container ls                                # 列出所有运行的容器
docker container ls -a             # 列出所有容器，甚至那些不运行的
docker container stop <hash>           # 优雅的停止指定容器
docker container kill <hash>         # 强制关闭指定容器
docker container rm <hash>        # 从这个机器中移除指定容器
docker container rm $(docker container ls -a -q)         # 移除全部容器
docker image ls -a                             # 列出这个机器中所有的镜像
docker image rm <image id>            # 从这个机器中移除指定镜像
docker image rm $(docker image ls -a -q)   # 从这个机器中移除所有镜像
docker login             # 使用你的docker证书进行登陆
docker tag <image> username/repository:tag  # tag要上传到存储库的<image>
docker push username/repository:tag            # 上传标记的镜像到docker光放存储库
docker run username/repository:tag                   # 从存储库运行镜像
```
