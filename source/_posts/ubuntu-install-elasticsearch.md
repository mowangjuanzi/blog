---
title: ubuntu 安装 elasticsearch
date: 2018-06-03 09:31:48
tags:
---
## 前置条件

本安装仅支持Ubuntu。CentOS安装请参考[这里](https://www.baoguoxiao.com/安装【centos】/)。

> 本环境默认是在Ubuntu18.04上操作的。

我们首先要配置java环境，这个需要Java8或者更新的包。一般执行以下命令时可以看看Java版本是否符合：

````shell
sudo apt install default-jdk
````

## Elasticsearch PGP公钥

在安装之前我们需要下载和安装公钥，否则没有办法使用apt安装Elasticsearch。

```bash
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
```

## 安装Elasticsearch

首先添加源：

```bash
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/6.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-6.x.list
```

接下来，我们就可以更新源毕竟切装Es了：

```bash
sudo apt-get update && sudo apt-get install elasticsearch
```

这样就安装好了。

## Elasticsearch命令管理

我们可以使用`systemd`方式进行Elasticsearch进行管理

### `systemd`

设置开机启动：

````bash
sudo systemctl daemon-reload
sudo systemctl enable elasticsearch
````

启动：

````bash
sudo systemctl start elasticsearch
````

关闭：

````bash
sudo systemctl stop elasticsearch
````

## 检测是否安装成功：

首先我们要执行命令将其启动（如果已经启动了，那就不用执行下面的启动命令了）：

````bash
sudo systemctl start elasticsearch
````

然后执行以下命令：

````bash
curl -XGET '127.0.0.1:9200/?pretty'
````

如果返回的数据如下所示，即表示安装成功了：

````json
{
  "name" : "NLJug1O",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "hVZpdHvgT9CeE1ywsNt16w",
  "version" : {
    "number" : "6.2.4",
    "build_hash" : "ccec39f",
    "build_date" : "2018-04-12T20:37:28.497551Z",
    "build_snapshot" : false,
    "lucene_version" : "7.2.1",
    "minimum_wire_compatibility_version" : "5.6.0",
    "minimum_index_compatibility_version" : "5.0.0"
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
|JAVA_HOME|设置要使用的自定义Java路径|
|MAX_OPEN_FILES|打开文件的最大数量，默认**65536**|
|MAX_LOCKED_MEMORY|最大锁内存大小。如果你在**elasticsearch.yml**中使用**bootstrap.memory_lock**选项，请设置**unlimited**|
|MAX_MAP_COUNT|进程可能拥有的内存映射区域的最大值。如果使用 mmapfs 作为索引存储类型，请确认将其设置为较高的值。请检查[linux内核文档](https://github.com/torvalds/linux/blob/master/Documentation/sysctl/vm.txt)关于**max_map_count**的更多信息。这是在elasticsearch启动之前通过**sysctl**设置的。默认是**262144**|
|ES_PATH_CONF|配置文件目录（需要包含**elasticsearch.yml**和**log4j2.properties**文件），默认路径是：**/etc/elasticsearch**|
|ES_JAVA_OPTS|Any additional JVM system properties you may want to apply.|
|RESTART_ON_UPGRADE|配置软件包升级时将会重新启动，默认是**false**。这意味着你在安装软件包之后手动重启elasticsearch实例。这样做的原因是为了保障, 在集群中更新时，在高流量网络和减少你集群的响应时间的情况下导致分片的重新分配。|

## 包的目录布局

|类型|描述|默认路径|设置|
|:--:|:--:|:--:|:--:|
|home|Elasticsearch家目录或者**$ES_HOME** |**/usr/share/elasticsearch**|&nbsp;|
|bin|二进制脚本，包括elasticsearch去启动一个节点和elasticsearch-plugin安装插件|**/usr/share/elasticsearch/bin**|&nbsp;|
|conf|配置文件，包含**elasticsearch.yml** | **/etc/elasticsearch** | **ES_PATH_CONF** |
|conf|环境变量，包含 heap 大小，文件描述符。|**/etc/default/elasticsearch**|&nbsp;|
|data|在节点上分配的每个索引/分片的数据文件的位置。可以容纳多个位置。|**/var/lib/elasticsearch**|**path.data**|
|logs|日志文件位置。|**/var/log/elasticsearch** | **path.logs** |
|plugins|插件文件位置. 每个插件将包含在一个子目录中.|**/usr/share/elasticsearch/plugins**|&nbsp;|
|repo|共享文件系统存储库位置。可以容纳多个位置。文件系统存储库可以放置在指定目录中任何子目录中。|Not configured|**path.repo**|
