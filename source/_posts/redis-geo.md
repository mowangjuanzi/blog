---
title: Redis 的 GEO 特性
date: 2017-11-17 16:14:41
tags:
- geo
- redis
- 数据库
categories:
- 数据库
- redis
---
今天看文档，无意中发现了 Redis 的一个新功能。
Redis 在 3.2 版本实现了一个地理位置计算的特性。

## 版本要求

Redis 3.2 或者更新

## 添加和获取位置

### geoadd (添加位置)

这个命令对于经纬度是有要求的:

- 有效的经度从-180度到180度。
- 有效的纬度从-85.05112878度到85.05112878度。

如果超出返回，那么命令就会返回一个错误.

添加命令如下：

````shell
GEOADD location-set longitude latitude name [longitude latitude name ...]
````

这个可以同时添加多个位置。其中 **location-set** 是存储地理位置的集合名称，**longitude**，**latitude** 和 **name** 则是地理位置的精度、纬度、名字。

下面添加北京的地铁站的坐标：

添加单个位置如下:

````shell
127.0.0.1:6379> geoadd subways 116.404269 39.906543 qianmen
(integer) 1
````

添加多个位置

````shell
127.0.0.1:6379> geoadd subways 116.409465 39.939578 nanluoguxiang 116.402549 39.944163 shichahai 116.315934 40.005471 yuanmingyuan 116.399279 40.007208 aolinpikegongyuan
(integer) 4
````

将坐标记录到位置集合之后，我们使用 `geopos` 命令来获取位置的名字和具体经纬度

获取命令如下:

````shell
GEOPOS location-set name [name ...]
````

比如说，如果我们想要获取圆明园、前门的经纬度，那么我们就可以执行以下代码

````shell
127.0.0.1:6379> geopos subways yuanmingyuan qianmen
1) 1) "116.31593316793441772"
   2) "40.00546983911101506"
2) 1) "116.40426903963088989"
   2) "39.90654220698316834"
````

## 计算两个点之前的距离

命令如下：

````shell
GEODIST location-set location-x location-y [unit]
````

可选参数 `unit` 用于指定计算距离时的单位，它的值为下面的一个：

- m 表示单位为米。
- km 表示单位为千米。
- mi 表示单位为英里。
- ft 表示单位为英尺。

比如我们要计算奥林匹克公园和圆明园的距离：

````shell
127.0.0.1:6379> geodist subways yuanmingyuan aolinpikegongyuan
"7103.4924"
````

如果我们指定单位为 **km**：

````shell
127.0.0.1:6379> geodist subways yuanmingyuan aolinpikegongyuan km
"7.1035"
````

## 获取指定范围内的元素

Redis 提供了两种方式：

````shell
GEORADIUS location-set longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [ASC|DESC] [COUNT count]

GEORADIUSBYMEMBER location-set location radius m|km|ft|mi [WITHCOORD] [WITHDIST] [ASC|DESC] [COUNT count]
````

这两个命令都是用来查找特定范围地点的功能，但是指定中心点的方式不同：`georadius` 使用的是用户给定的经纬度，而 `georadiusbymember` 则使用存储在位置集合里面的某个地点作为中心点。

- m|km|ft|mi 指定的是计算范围时的单位；
- 如果给定了可选的 WITHCOORD ， 那么命令在返回匹配的位置时会将位置的经纬度一并返回；
- 如果给定了可选的 WITHDIST ， 那么命令在返回匹配的位置时会将位置与中心点之间的距离一并返回；
- 在默认情况下， GEORADIUS 和 GEORADIUSBYMEMBER 的结果是未排序的， ASC 可以让查找结果根据距离从近到远排序， 而 DESC 则可以让查找结果根据从远到近排序；
- COUNT 参数指定要返回的结果数量。

命令默认返回未排序的位置元素。 通过以下两个参数， 用户可以指定被返回位置元素的排序方式：
- ASC: 根据中心的位置， 按照从近到远的方式返回位置元素。
- DESC: 根据中心的位置， 按照从远到近的方式返回位置元素。

比如说我们要返回指定坐标的10km内的位置：

````shell
127.0.0.1:6379> georadius subways 116.403878 39.914942 10 km
1) "qianmen"
2) "nanluoguxiang"
3) "shichahai"
````

我们还需要获取位置与中心点的距离:

````shell
127.0.0.1:6379> georadius subways 116.403878 39.914942 10 km withdist
1) 1) "qianmen"
   2) "0.9349"
2) 1) "nanluoguxiang"
   2) "2.7812"
3) 1) "shichahai"
   2) "3.2521"
````

我们需要返回按照最远距离排序：

````shell
127.0.0.1:6379> georadius subways 116.403878 39.914942 10 km withdist desc
1) 1) "shichahai"
   2) "3.2521"
2) 1) "nanluoguxiang"
   2) "2.7812"
3) 1) "qianmen"
   2) "0.9349"
````

我们只需要两个就够了，三个太多了：

````shell
127.0.0.1:6379> georadius subways 116.403878 39.914942 10 km withdist desc count 2
1) 1) "shichahai"
   2) "3.2521"
2) 1) "nanluoguxiang"
   2) "2.7812"
127.0.0.1:6379> georadius subways 116.403878 39.914942 10 km withdist count 2
1) 1) "qianmen"
   2) "0.9349"
2) 1) "nanluoguxiang"
   2) "2.7812"
````

获取前门10km附近的位置：

````shell
127.0.0.1:6379> georadiusbymember subways qianmen 10 km
1) "qianmen"
2) "nanluoguxiang"
3) "shichahai"
````

我们只是需要将其坐标换成集合名称中的会员名称就好了，用法跟之前的`georadius`相同。

`georadius`和`georadiusbymember`执行的代价并不低，因此强烈建议为查询结果创建缓存。

## `geohash`

这个会返回一个11个字符的geohash字符串，使用内部52位表示。返回的geohashes具有以下特性:

- 他们可以缩短从右边的字符。它将失去精度，但仍将指向同一地区。
- 它可以在 geohash.org 网站使用，网址http://geohash.org/<geohash-string>。查询例子：http://geohash.org/sqdtr74hyu0.
- 与类似的前缀字符串是附近，但相反的是不正确的，这是可能的，用不同的前缀字符串附近。

命令格式如下：

````shell
GEOHASH key member [member ...]
````

例如我要查询前门的geohash:

````shell
127.0.0.1:6379> geohash subways qianmen
1) "wx4g0bg02n0"
````

完了。