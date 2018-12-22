---
title: Elasticsearch（2）PHP驱动
date: 2017-11-17 16:27:19
tags:
---
安装完成composer之后。我们需要安装php的类库来对Elasticsearch进行连接。

我们现在需要使用的是[elasticsearch/elasticsearch](https://packagist.org/packages/elasticsearch/elasticsearch)。

比如我们的项目目录在 **/data/project/elastic**。

我们就可以在这个目录下执行以下命令：

````shell
composer require elasticsearch/elasticsearch
````

如果出现如下内容：

````shell
Using version ^5.0 for elasticsearch/elasticsearch
./composer.json has been updated
Loading composer repositories with package information
Updating dependencies (including require-dev)
Package operations: 5 installs, 0 updates, 0 removals
  - Installing react/promise (v2.5.0) Downloading: 100%         
  - Installing guzzlehttp/streams (3.0.0) Downloading: 100%         
  - Installing guzzlehttp/ringphp (1.1.0) Downloading: 100%         
  - Installing psr/log (1.0.2) Downloading: 100%         
  - Installing elasticsearch/elasticsearch (v5.0.0) Downloading: 100%         
elasticsearch/elasticsearch suggests installing monolog/monolog (Allows for client-level logging and tracing)
Writing lock file
Generating autoload files
````

就表示已经安装成功了。

接下来我们编辑如下文件。

````php
<?php
require_once './vendor/autoload.php';

$client = Elasticsearch\ClientBuilder::create();
$client->setHosts(['127.0.0.1']);
$client = $client->build();
$info = $client->info();
var_dump($info);
?>
````

然后保存为**index.php**。我们可以通过访问该文件来确认是否请求成功了。

然后我们执行一下：

````shell
[root@68 elastic]# php index.php 
array(5) {
  ["name"]=>
  string(7) "ZQZ38Da"
  ["cluster_name"]=>
  string(13) "elasticsearch"
  ["cluster_uuid"]=>
  string(22) "FuPCyv2ZSimGYxAo_nLvpw"
  ["version"]=>
  array(5) {
    ["number"]=>
    string(5) "5.1.1"
    ["build_hash"]=>
    string(7) "5395e21"
    ["build_date"]=>
    string(24) "2016-12-06T12:36:15.409Z"
    ["build_snapshot"]=>
    bool(false)
    ["lucene_version"]=>
    string(5) "6.3.0"
  }
  ["tagline"]=>
  string(20) "You Know, for Search"
}
````

这样就表示我们的驱动已经安装并且连接完成了。

> 具体的文档我们可点击：https://www.elastic.co/guide/en/elasticsearch/client/php-api/current/index.html
