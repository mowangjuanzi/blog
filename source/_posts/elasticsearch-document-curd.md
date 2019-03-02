---
title: Elasticsearch 教程（3）文档CRUD操作
date: 2017-11-17 16:32:54
tags:
- elasticsearch
categories:
- 工具
- elasticsearch
---
## 简介
Elasticsearch 是面向文档的，这就意味着它可以像MongoDB一样存储整个对象或者文档。然而它不仅仅是存储，还会索引每个文档的内容使值可以被索引。我们也可以对文档进行索引，搜索，排序，过滤。

它存储的文档格式是JSON格式的。比如：

````json
{
    "email":      "john@smith.com",
    "first_name": "John",
    "last_name":  "Smith",
    "info": {
        "bio":         "Eco-warrior and defender of the weak",
        "age":         25,
        "interests": [ "dolphins", "whales" ]
    },
    "join_date": "2014/05/01"
}
````

## 理论

在Elasticsearch中存储数据的行为就叫做**索引**（**indexing**）。文档属于一种**类型**（**type**），而这些类型存储在**索引**（**index**）中。

我们可以使用下面这个图来简单解释一下：

````
MySQL           ->  Database    ->  Tables      -> Row       -> Columns
MongoDB         ->  Database    ->  Collections -> Documents -> Fields
Elasticsearch   ->  Indices     ->  Types       -> Documents -> Fields
````

Elasticsearch集群可以包含多个**索引**(**indices**)（数据库），每一个索引可以包含多个**类型**(**types**)（表），每一个类型包含多个**文档**(**documents**)（行），然后每个文档包含多个**字**段(**Fields**)（列）。

> ### [索引]含义的区分
> 你可能已经注意到**索引**(**index**)这个词在Elasticsearch中有着不同的含义，所以有必要在此做一下区分:
> - 索引（名词） 如上文所述，一个**索引**(**index**)就像是传统关系数据库中的**数据库**，它是相关文档存储的地方，index的复数是**indices**或**indexes**。
> - 索引（动词） **「索引一个文档」**表示把一个文档存储到**索引**（**名**词）里，以便它可以被检索或者查询。这很像SQL中的`INSERT`关键字，差别是，如果文档已经存在，新的文档将覆盖旧的文档。
> - 倒排索引 传统数据库为特定列增加一个索引，例如B-Tree索引来加速检索。Elasticsearch和Lucene使用一种叫做**倒排索引**(**inverted index**)的数据结构来达到相同目的。

## 操作

### 插入文档

单个插入：

````php
<?php
require_once './vendor/autoload.php';

$client = Elasticsearch\ClientBuilder::create();
$client->setHosts(['127.0.0.1']);
$client = $client->build();

$params = [
	'index' => 'megacorp', //索引
	'type' => 'employee', //类型
	'id' => 1, //ID 如果不加，则会自动生成
	'body' => [ //要添加的数据
		'first_name' => 'Join',
		'last_name' => 'Smith',
		'age' => 25,
		'about' => 'I love to go rock climbing',
		'interests' => ['sports', 'music'],
	]
];
$response = $client->index($params);
print_r($response);
?>
````

输出为：

````php
Array
(
    [_index] => megacorp
    [_type] => employee
    [_id] => 1
    [_version] => 1
    [result] => created
    [_shards] => Array
        (
            [total] => 2
            [successful] => 1
            [failed] => 0
        )
    [created] => 1
)
````

就表示已经插入成功了。

这里的插入的数组中有个字段为`id`，如果我们不对其进行填写的话，它会自动生成一个`id`。

这个自动生成的`_id`会有22个字符长。我们把它称作**UUIDs**。

### 批量插入

下面我们接着插入。我们需要插入同时插入两个：

````php
<?php
require_once './vendor/autoload.php';
$client = Elasticsearch\ClientBuilder::create();
$client->setHosts(['127.0.0.1']);
$client = $client->build();

$params = [];
$params['body'] = [
	[
		'index' => [
			'_index' => 'megacorp',
			'_type' => 'employee',
			'_id' => 2
		],
	],
	[
		"first_name" => "Jane",
	    "last_name" => "Smith",
	    "age" => 32,
	    "about" => "I like to collect rock albums",
	    "interests" => ["music"],
	],
	[
		'index' => [
			'_index' => 'megacorp',
			'_type' => 'employee',
			'_id' => 3
		],
	],
	[
		"first_name" => "Douglas",
	    "last_name" => "Fir",
	    "age" => 35,
	    "about" => "I like to build cabinets",
	    "interests" => [ "forestry" ]
	]
];
$responses = $client->bulk($params);
print_r($responses);
?>
````

显示如下就表示插入成功了：

````php
Array
(
    [took] => 217
    [errors] => 
    [items] => Array
        (
            [0] => Array
                (
                    [index] => Array
                        (
                            [_index] => megacorp
                            [_type] => employee
                            [_id] => 2
                            [_version] => 1
                            [result] => created
                            [_shards] => Array
                                (
                                    [total] => 2
                                    [successful] => 1
                                    [failed] => 0
                                )
                            [created] => 1
                            [status] => 201
                        )
                )
            [1] => Array
                (
                    [index] => Array
                        (
                            [_index] => megacorp
                            [_type] => employee
                            [_id] => 3
                            [_version] => 1
                            [result] => created
                            [_shards] => Array
                                (
                                    [total] => 2
                                    [successful] => 1
                                    [failed] => 0
                                )
                            [created] => 1
                            [status] => 201
                        )
                )
        )
)
````

## 获取文档

现在我们尝试获取文档。获取文档可以获取指定文档的全部字段或者指定字段。我们分开来讲解：

### 获取单个文档

#### 获取全部字段

比如我们现在要获取`id=2`的文档。

````php
<?php
require_once './vendor/autoload.php';
$client = Elasticsearch\ClientBuilder::create();
$client->setHosts(['127.0.0.1']);
$client = $client->build();

$params = [
	'index' => 'megacorp', 
	'type' => 'employee',
	'id' => 2,
];

print_r($client->get($params));
?>
````

运行之后输出的结果就是：

````php
Array
(
    [_index] => megacorp
    [_type] => employee
    [_id] => 2
    [_version] => 1
    [found] => 1
    [_source] => Array
        (
            [first_name] => Jane
            [last_name] => Smith
            [age] => 32
            [about] => I like to collect rock albums
            [interests] => Array
                (
                    [0] => music
                )
        )
)
````

这里我们可以看到`_source`字段包含的就是我们插入的内容。而`found`字段为**1**表示文档已经找到，如果我们请求一个不存在的文档，也会返回一个json，只不过`found`就会变成**0**了。

#### 获取指定字段

比如我们这里用不到这么多的字段。我们仅仅需要`first_name`, `last_name`和`age`。我们可以这么请求：

````php
<?php
require_once './vendor/autoload.php';
$client = Elasticsearch\ClientBuilder::create();
$client->setHosts(['127.0.0.1']);
$client = $client->build();

$params = [
	'index' => 'megacorp', 
	'type' => 'employee',
	'id' => 2,
	'_source' => ['first_name', 'last_name', 'age']
];

print_r($client->get($params));
?>
````

返回的结果仅仅是：

````php
Array
(
    [_index] => megacorp
    [_type] => employee
    [_id] => 2
    [_version] => 1
    [found] => 1
    [_source] => Array
        (
            [last_name] => Smith
            [first_name] => Jane
            [age] => 32
        )
)
````

### 检查文档是否存在

如果我们不需要返回指定文档的内容，而仅仅是想知道文档是否存在，我们可以这样：

````php
<?php
require_once './vendor/autoload.php';
$client = Elasticsearch\ClientBuilder::create();
$client->setHosts(['127.0.0.1']);
$client = $client->build();

$params = [
	'index' => 'megacorp', 
	'type' => 'employee',
	'id' => 2,
];

var_dump($client->exists($params));
?>
````

返回的结果不是数组了。而是一个bool值：

````php
bool(true)
````

### 获取多个文档

#### 获取全部的字段：

````php
暂无
````

## 更新文档

## 部分文档更新

此处的更新只适合修改现有字段或者增加新的字段。我们需要在`body`字段中指定`doc`字段。
比如我说现在要修改`id`为2的员工。

首先我们先看看2号员工的信息：

````php
Array
(
    [_index] => megacorp
    [_type] => employee
    [_id] => 2
    [_version] => 1
    [found] => 1
    [_source] => Array
        (
            [first_name] => Jane
            [last_name] => Smith
            [age] => 32
            [about] => I like to collect rock albums
            [interests] => Array
                (
                    [0] => music
                )
        )
)
````

接下来我们要修改它的信息，我们要将他的年龄修改成33，并且增加一个信息，`mobile_phone`为`1234567890`。

````php
<?php
require_once './vendor/autoload.php';
$client = Elasticsearch\ClientBuilder::create();
$client->setHosts(['127.0.0.1']);
$client = $client->build();

$response = $client->update([
	'index' => 'megacorp',
	'type' => 'employee',
	'id' => 2,
	'body' => [
		'doc' => [
			'age' => 33,
			'mobile_phone' => '1234567890'
		]
	]
]);
print_r($response);
?>
````

结果如下：

````php
Array
(
    [_index] => megacorp
    [_type] => employee
    [_id] => 2
    [_version] => 2
    [result] => updated
    [_shards] => Array
        (
            [total] => 2
            [successful] => 1
            [failed] => 0
        )
)
````

我们再来看一下之前的员工的信息：

````php
Array
(
    [_index] => megacorp
    [_type] => employee
    [_id] => 2
    [_version] => 2
    [found] => 1
    [_source] => Array
        (
            [first_name] => Jane
            [last_name] => Smith
            [age] => 33
            [about] => I like to collect rock albums
            [interests] => Array
                (
                    [0] => music
                )
            [mobile_phone] => 1234567890
        )
)
````

### 脚本更新文档

有时候我们需要执行计数器更新，或者向数组中添加新值。我们就可以使用脚本式更新。

````php
$params = [
	'index' => 'megacorp',
	'type' => 'employee',
	'id' => 2,
	'body' => [
		'script' => 'ctx._source.interests.add("sports")';
	]
]; // 数组中添加新值

$params = [
	'index' => 'megacorp',
	'type' => 'employee',
	'id' => 2,
	'body' => [
		'script' => 'ctx._source.age += 2';
	]
]; // 计数器更新 
````

### upsert

upsert 其实是更新或者插入操作，这意味着upsert将尝试更新操作，如果文档不存在，那么将插入默认值。

### 更新和冲突

为了避免更新数据，`update`API在解锁阶段检索文档当前的`_version`，然后在重建索引阶段通过`index`请求提交，如果其它进程在检索和重建索引阶段修改了文档，`_version`将不能被匹配，然后更新失败。

对于这种情况，我们只需要重新尝试更新就好了，其实这些我们可以通过`retry_on_conflict`参数设置重试次数来自动完成，这样`update`操作将会在发生错误前重试——这个值默认为0。

### 总结

其实`update`这个操作似乎允许你修改文档的局部，但实际上还是遵循先查后改的过程，步骤如下：

1. 从旧文档中检索JSON
2. 修改它
3. 删除旧文档
4. 索引新文档

唯一的不同是`update`这个操作只需要一个客户端请求就好，不需要`get`和`index`请求了。

## 删除

比如我们要删除`id`为3的员工：

我们先查询一下这个员工：

````php
Array
(
    [_index] => megacorp
    [_type] => employee
    [_id] => 3
    [_version] => 1
    [found] => 1
    [_source] => Array
        (
            [first_name] => Douglas
            [last_name] => Fir
            [age] => 35
            [about] => I like to build cabinets
            [interests] => Array
                (
                    [0] => forestry
                )
        )
)
````

下面我们来执行操作：

````php
print_r($client->delete([
	'index' => 'megacorp',
	'type' => 'employee',
	'id' => 3,
]));
````

返回结果为：

````php
Array
(
    [found] => 1
    [_index] => megacorp
    [_type] => employee
    [_id] => 3
    [_version] => 2
    [result] => deleted
    [_shards] => Array
        (
            [total] => 2
            [successful] => 1
            [failed] => 0
        )
)
````

注意看`found`为1，并且`_version`相比之前，已经变为2了。

当我们再次执行一下之前的删除操作，我们再看一下返回结果：

````json
{"found":false,"_index":"megacorp","_type":"employee","_id":"3","_version":1,"result":"not_found","_shards":{"total":2,"successful":1,"failed":0}}
````

````json
{
  "found": false,
  "_index": "megacorp",
  "_type": "employee",
  "_id": "3",
  "_version": 2,
  "result": "not_found",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
````

删除不存在的文档的时候，抛出了一个错误。我们可以看到`found`的值是`false`，且`_version`也有记录值。这是内部记录的一部分，它确保再多节点不同操作可以有正确的顺序。
