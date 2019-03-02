---
title: docker安装mysql
date: 2018-09-19 10:53:16
tags:
- docker
- mysql
categories:
- 工具
- docker
---
记录一下自己使用docker安装mysql的过程。

首先我找到两个:

- https://hub.docker.com/r/mysql/mysql-server/
- https://hub.docker.com/_/mysql/

我对比了一下。发现第一个是mysql官方推出的，而第二是docker自带library推出的。那么我肯定选择mysql官方推出的mysql了。

既然确定了要安装的包，那么就要开始拉取了。

- MySQL Server 5.5 (tag: 5.5, 5.5.61, 5.5.61-1.1.7) (mysql-server/5.5/Dockerfile)
- MySQL Server 5.6 (tag: 5.6, 5.6.41, 5.6.41-1.1.7) (mysql-server/5.6/Dockerfile)
- MySQL Server 5.7 (tag: 5.7, 5.7.23, 5.7.23-1.1.7) (mysql-server/5.7/Dockerfile)
- MySQL Server 8.0, the latest GA (tag: 8.0, 8.0.12, 8.0.12-1.1.7, latest) (mysql-server/8.0/Dockerfile)
- MySQL Server 8.0 for AArch64 (ARM64) (tag: 8.0-aarch64, 8.0.12-aarch64)

上面是可以安装的版本。那么我肯定是安装latest的。

## 安装

那么执行代码如下:

```bash
docker pull mysql/mysql-server
```

如果想要安装5.7版本的，可以执行以下命令：

```bash
docker pull mysql/mysql-server:5.7
```

好了等待之后，就安装成功了，接下来，我们看看我们在本地存储的镜像。

```bash
$ docker image ls
REPOSITORY                                      TAG                 IMAGE ID            CREATED             SIZE
mysql/mysql-server                              latest              1fdf3806e715        5 weeks ago         309MB
```

接下来执行创建容器的命令。

```bash
docker run --name mysql1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql/mysql-server:latest
```

在这里要注意的是最后的`:latest`，这个是可省略的。如果刚才安装的是指定版本，比如5.7，那么我们就需要执行以下命令了：

```bash
docker run --name mysql1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql/mysql-server:5.7
```

好了，安装完成，就可以使用PHP进行连接测试了。

```php
$pdo = new \PDO("mysql:host=127.0.0.1;dbname=mysql", "root", "123456");
$data = $pdo->query("select version()");
foreach($data as $item) {
    var_dump($item);
}
```

会提示如下错误：

```
Host '172.17.0.1' is not allowed to connect to this MySQL server
```

那么我们只能登录mysql进行修改数据了，首先是登录mysql，密码就是我们设置的123456：

```bash
$ docker exec -it mysql1 mysql -uroot -p
Enter password:
```

然后执行如下命令：

```sql
use mysql;
update user set host = '%' where user = "root";
flush privileges;
```

我们继续测试PHP脚本，发现链接就正常了：

```bash
$ php ./demo.php
/Users/baoguoxiao/demo.php:5:
array(2) {
  'version()' =>
  string(6) "8.0.12"
  [0] =>
  string(6) "8.0.12"
}
```

##  查询日志

```bash
docker logs mysql1
```

## 登录shell

```bash
docker exec -it mysql1 bash
```

## 停止容器

```bash
docker stop mysql1
```

## 开启容器

```bash
docker start mysql1
```

## 重启容器

```bash
docker restart mysql1
```

## 删除容器

```bash
docker stop mysql1
docker rm mysql1
```

## 从另外的容器中连接mysql

暂无

## Docker 环境变量

其实我们在创建container的时候就已经用了一个环境变量了，就是`MYSQL_ROOT_PASSWORD`，现在我们来介绍一些其他的环境变量

- MYSQL_RANDOM_ROOT_PASSWD

    该值默认为ture（除非`MYSQL_ROOT_PASSWORD`设置了或者`MYSQL_ALLOW_EMPTY_PASSWORD`设置为true了），意思是在启动docker容器时随机生成root密码。密码打印到日志中。查看随机密码的方式如下：
    
    ```bash
    $ docker logs mysql1 2>&1 | grep GENERATED
    GENERATED ROOT PASSWORD: Axegh3kAJyDLaRuBemecis&EShOs
    ```
- MYSQL_ONETIME_PASSWORD 

    默认为ture（除非`MYSQL_ROOT_PASSWORD`设置了或者`MYSQL_ALLOW_EMPTY_PASSWORD`设置为true了）root用户的密码设置为expired，必须先修改密码才能使用。

- MYSQL_DATABSE

    指定在容器创建时同时创建数据库的名称。如果启动参数也有`MYSQL_USER`和`MSQL_PASSWORD`，则会创建用户并授予该数据库对应的用户权限。如果指定的数据库已经存在了，则该变量无效。
    
- MYSQL_USER和MYSQL_PASSWORD

    该变量用户创建用户名和密码，并为该用户授予`MYSQL_DATABASE`变量指定的数据库的超级用户权限。如果两个变量没有设置，则其他会被忽略。如果两个变量都已设置但是没有设置`MYSQL_DATABASE`，则创建的用户没有任何权限。

- MYSQL_ROOT_HOST

    默认情况下，MySQL会设置"root@localhost"账户，此账户只能从内部进行连接。要允许其他主机的根连接，就需要设置此变量了。例如，该值`172.17.0.1`(默认的docker网关IP)允许来自运行容器的主机的连接。但是该选项仅接受一条记录，但是允许使用通配符（例如，MYSQL_ROOT_HOST=172.*.*.*或MYSQL_ROOT_HOST=%）。
    
- MYSQL_LOG_CONSOLE

    当变量为true时（MySQL8.0服务器容器的默认状态）,MySQL服务器的错误日志被重定向到stderr，以便错误日志进入docker容器的日志，并且可以使用`docker logs mysqld-container`进行查看。
    
- MYSQL_ROOT_PASSWORD

    此变量指定为MySQL root账户设置的密码。在命令行上设置MySQL root密码是不安全的，因为可以通过`history`查看命令历史从而获取创建的密码。所以最好是试用默认设置。
    
- MYSQL_ALLOW_EMPTY_PASSWORD

    默认为false，如果将其设置为true，则表示允许root用户使用空密码启动。但是在非开发环境设置此变量为true是不安全的，因为他会让MySQL实例完全不受保护，从而允许任何人都可以获得弯针的超级用户访问权限。最好试用默认设置。
