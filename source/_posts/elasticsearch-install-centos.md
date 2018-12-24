---
title: Elasticsearch 教程（1）安装【CentOS版】
date: 2017-11-17 16:27:54
tags:
---
## 前置条件

本安装支持 SUSE 11和CentOS5。如果在这或者更老的系统上安装，请参考[.zip或者.tar.gz安装Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/5.1/zip-targz.html)。


我们首先要配置java环境，这个需要Java8或者更新的包。一般执行以下命令时可以看看Java版本是否符合：

````shell
yum install java
````

## 安装Elasticsearch

首先编辑`/etc/yum.repos.d/elasticsearch.repo`文件：

将以下内容放入到上面打开的文件中：

````ini
[elasticsearch-5.x]
name=Elasticsearch repository for 5.x packages
baseurl=https://artifacts.elastic.co/packages/5.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
````

`:wq`保存，然后执行以下安装命令：

````shell
yum install elasticsearch
````

这样安装就完成了。

## Elasticsearch命令管理

我们可以使用两种命令方式进行Elasticsearch进行管理

### SysV `init`

设置开机启动：

````shell
chkconfig --add elasticsearch
chkconfig elasticsearch on
````

启动：

````shell
service elasticsearch start
````

关闭：

````shell
service elasticsearch stop
````

### `systemd`

设置开机启动：

````shell
systemctl daemon-reload
systemctl enable elasticsearch
````

启动：

````shell
systemctl start elasticsearch
````

关闭：

````shell
systemctl stop elasticsearch
````

## 记录的日志

日志消息记录位置是：**/var/log/elasticsearch/**。

## 检测是否安装成功：

首先我们要执行命令将其启动（如果已经启动了，那就不用执行下面的启动命令了）：

````shell
service elasticsearch start
````

然后执行以下命令：

````shell
curl -XGET '127.0.0.1:9200/?pretty'
````

如果返回的数据如下所示，即表示安装成功了：

````json
{
  "name" : "shcGs0R",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "k71Pk416RB6HTvdh9xuBFA",
  "version" : {
    "number" : "5.1.1",
    "build_hash" : "5395e21",
    "build_date" : "2016-12-06T12:36:15.409Z",
    "build_snapshot" : false,
    "lucene_version" : "6.3.0"
  },
  "tagline" : "You Know, for Search"
}
````

> 注意：Elasticsearch需要启动一会。如果启动完成立马执行上面的命令，可以会提示拒绝连接，多试几次就好了。

## 配置 Elasticsearch

Elasticsearch 默认情况下从 **/etc/elasticsearch/elasticsearch.yml** 文件中加载它的配置。

RPM也又一个系统配置文件（**/etc/sysconfig/elasticsearch**），它允许你设置以下参数：

|参数|解释|
|:--:|:--:|
|ES_USER|运行的用户，默认是**elasticsearch**|
|ES_GROUP|运行的组，默认是**elasticsearch**|
|JAVA_HOME|设置要使用的自定义Java路径|
|MAX_OPEN_FILES|打开文件的最大数量，默认**65536**|
|MAX_LOCKED_MEMORY|最大锁内存大小。如果你在**elasticsearch.yml**中使用**bootstrap.memory_lock**选项，请设置**unlimited**|
|MAX_MAP_COUNT|进程可能拥有的内存映射区域的最大值。如果使用 mmapfs 作为索引存储类型，请确认将其设置为较高的值。请检查[linux内核文档](https://github.com/torvalds/linux/blob/master/Documentation/sysctl/vm.txt)关于**max_map_count**的更多信息。这是在elasticsearch启动之前通过**sysctl**设置的。默认是**262144**|
|LOG_DIR|日志目录，默认为：**/var/log/elasticsearch**|
|DATA_DIR|数据目录，默认为：**/var/lib/elasticsearch**|
|CONF_DIR|配置文件目录（需要包含**elasticsearch.yml**和**log4j2.properties**文件），默认路径是：**/etc/elasticsearch**|
|ES_JAVA_OPTS|Any additional JVM system properties you may want to apply.|
|RESTART_ON_UPGRADE|配置软件包升级时将会重新启动，默认是**false**。这意味着你在安装软件包之后手动重启elasticsearch实例。这样做的原因是为了保障, 在集群中更新时，在高流量网络和减少你集群的响应时间的情况下导致分片的重新分配。|

## RPM的目录布局

|类型|描述|默认路径|设置|
|:--:|:--:|:--:|:--:|
|home|Elasticsearch家目录或者**$ES_HOME** |**/usr/share/elasticsearch**|&nbsp;|
|bin|二进制脚本，包括elasticsearch去启动一个节点和elasticsearch-plugin安装插件|**/usr/share/elasticsearch/bin**|&nbsp;|
|conf|配置文件，包含**elasticsearch.yml** | **/etc/elasticsearch** | **path.conf** |
|conf|环境变量，包含 heap 大小，文件描述符。|**/etc/sysconfig/elasticsearch**|&nbsp;|
|data|在节点上分配的每个索引/分片的数据文件的位置。可以容纳多个位置。|**/var/lib/elasticsearch**|**path.data**|
|logs|日志文件位置。|**/var/log/elasticsearch** | **path.logs** |
|plugins|插件文件位置. 每个插件将包含在一个子目录中.|**/usr/share/elasticsearch/plugins**|&nbsp;|
|repo|共享文件系统存储库位置。可以容纳多个位置。文件系统存储库可以放置在指定目录中任何子目录中。|Not configured|**path.repo**|
|script|脚本文件的位置。|**/etc/elasticsearch/scripts**|**path.scripts**|
