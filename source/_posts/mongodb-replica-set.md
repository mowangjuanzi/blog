---
title: MongoDB副本集
date: 2017-11-17 16:25:18
tags:
- mongodb
- 复制
categories:
- 数据库
- mongodb
---

关于副本集的理论我就不介绍了。下面说下如何实现副本集的操作。

## 前提
1. 首先就是要安装mongoDB服务器了。我建议按照我之前写的[这篇文章](https://segmentfault.com/a/1190000005176288)进行安装。
2. 准备三台以上的服务器。然后同时安装MongoDB。我们三台服务器的IP分别是（10.55.160.91，10.55.160.92，10.55.160.93）

## 部署一个副本集
1. 修改配置文件。
    首先我们打开配置文件。
    ````shell
    vim /etc/mongod.conf
    ````
    找到`bindIp: 127.0.0.1`这行，我们需要对这行进行注释。变成如下这样：
    ````ini
    #bindIp: 127.0.0.1  # Listen to local interface only, comment to listen on all interfaces.
    ````
    因为这个`bindIp`代表只允许本机进行连接，然后不允许其他服务器进行连接，那么，下面就没有办法继续执行了。
    
    找到`#replication:`这行我们将其注释去掉，然后下面增加一行，变成下面这样：
    ````ini
    replication:
      replSetName: test
    ````
    `replSetName`表示副本集组的名字(`test`是我自己写的，你们也可以写你们自己的喜欢的名字)，比如，我们要将三台服务器进行关联，那么我们就要将三台服务器都设置为相同的名字。
    
    然后如果三台服务器的MongoDB都已经启动了，那么就执行以下命令：
    ````shell
    service mongod restart
    ````
    如果没有启动就执行以下命令：
    ````shell
    service mongod start
    ````

2. 链接到任意一台服务器。
    我选择的是链接到`10.55.160.91`。也就是我现在正在操作的这一台服务器。然后登录：
    ````shell
    mongo
    ````
3. 初始化副本集。
    初始化副本集，我们需要使用[`rs.initiate()`](https://docs.mongodb.com/manual/reference/method/rs.initiate/#rs.initiate)方法。
    我现在需要添加的是三台服务器，我们可以执行以下方法：
    ````js
    rs.initiate({
        _id: "test",
        version: 1,
        members: [
            { _id: 0, host : "10.55.160.91:27017" },
            { _id: 1, host : "10.55.160.92:27017" },
            { _id: 2, host : "10.55.160.93:27017" }
        ]
    })
    ````
    当返回值显示为如下的时候，就代表成功了：
    ````js
    { "ok" : 1 }
    ````
4. 这样就完成了，是不是很简单。哈哈。

然后你就发现你的输入命令的标题就变了。变成如下这样了：
````js
test:OTHER>
````
不管它，我们继续执行操作，执行[`rs.status()`](https://docs.mongodb.com/manual/reference/method/rs.status/#rs.status)，查看当前状态。
````js
rs.status()
````
查看返回值：
````js
{
	"set" : "test",
	"date" : ISODate("2016-09-22T08:08:36.607Z"),
	"myState" : 1,
	"term" : NumberLong(1),
	"heartbeatIntervalMillis" : NumberLong(2000),
	"members" : [
		{
			"_id" : 0,
			"name" : "10.55.160.91:27017",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 154,
			"optime" : {
				"ts" : Timestamp(1474531710, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2016-09-22T08:08:30Z"),
			"infoMessage" : "could not find member to sync from",
			"electionTime" : Timestamp(1474531709, 1),
			"electionDate" : ISODate("2016-09-22T08:08:29Z"),
			"configVersion" : 1,
			"self" : true
		},
		{
			"_id" : 1,
			"name" : "10.55.160.92:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 17,
			"optime" : {
				"ts" : Timestamp(1474531710, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2016-09-22T08:08:30Z"),
			"lastHeartbeat" : ISODate("2016-09-22T08:08:35.966Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-22T08:08:32.078Z"),
			"pingMs" : NumberLong(0),
			"syncingTo" : "10.55.160.91:27017",
			"configVersion" : 1
		},
		{
			"_id" : 2,
			"name" : "10.55.160.93:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 17,
			"optime" : {
				"ts" : Timestamp(1474531710, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2016-09-22T08:08:30Z"),
			"lastHeartbeat" : ISODate("2016-09-22T08:08:35.966Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-22T08:08:32.078Z"),
			"pingMs" : NumberLong(0),
			"syncingTo" : "10.55.160.91:27017",
			"configVersion" : 1
		}
	],
	"ok" : 1
}
````
我们主要是看`members`字段里面的`stateStr`的值。

很幸运，我当前执行命令的服务器被推举为主服务器。

如果你们现在服务器显示当前的服务器的状态是:`SECONDARY`。表示该服务器是从服务器，我们需要查看哪台服务器为主服务器，也就是`"stateStr" : "PRIMARY"`。我们需要在主服务器才进行进行操作，当然，也有强行在从服务器进行操作的办法。这里先不说。

这样我们就可以在主服务器进行操作了。比如存储数据。

## 添加成员
比如现在又有了一台服务器(10.55.160.94)需要加入到这个副本集中。我们可以使用[`rs.add()`](https://docs.mongodb.com/manual/reference/method/rs.add/#rs.add)进行添加服务器。

首先我们还是别忘了修改配置文件的步骤。。。。。。修改完成配置文件之后重启Mongod，然后在主服务器执行如下命令：
````js
rs.add("10.55.160.94:27017")
````
在执行该命令之后，可能会出现主服务器的选择，我们要注意主服务器是否已经变成了别的服务器。我们可以使用[`rs.status()`](https://docs.mongodb.com/manual/reference/method/rs.status/#rs.status)查看新的主服务器是什么。
````js
{
	"set" : "test",
	"date" : ISODate("2016-09-22T09:28:53.913Z"),
	"myState" : 1,
	"term" : NumberLong(6),
	"heartbeatIntervalMillis" : NumberLong(2000),
	"members" : [
		{
			"_id" : 0,
			"name" : "10.55.160.91:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 1202,
			"optime" : {
				"ts" : Timestamp(1474536460, 1),
				"t" : NumberLong(6)
			},
			"optimeDate" : ISODate("2016-09-22T09:27:40Z"),
			"lastHeartbeat" : ISODate("2016-09-22T09:28:52.089Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-22T09:28:52.095Z"),
			"pingMs" : NumberLong(0),
			"syncingTo" : "10.55.160.93:27017",
			"configVersion" : 6
		},
		{
			"_id" : 1,
			"name" : "10.55.160.92:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 1202,
			"optime" : {
				"ts" : Timestamp(1474536460, 1),
				"t" : NumberLong(6)
			},
			"optimeDate" : ISODate("2016-09-22T09:27:40Z"),
			"lastHeartbeat" : ISODate("2016-09-22T09:28:52.089Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-22T09:28:52.095Z"),
			"pingMs" : NumberLong(0),
			"syncingTo" : "10.55.160.93:27017",
			"configVersion" : 6
		},
		{
			"_id" : 2,
			"name" : "10.55.160.93:27017",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 1207,
			"optime" : {
				"ts" : Timestamp(1474536460, 1),
				"t" : NumberLong(6)
			},
			"optimeDate" : ISODate("2016-09-22T09:27:40Z"),
			"electionTime" : Timestamp(1474536383, 1),
			"electionDate" : ISODate("2016-09-22T09:26:23Z"),
			"configVersion" : 6,
			"self" : true
		},
		{
			"_id" : 3,
			"name" : "10.55.160.94:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 71,
			"optime" : {
				"ts" : Timestamp(1474536460, 1),
				"t" : NumberLong(6)
			},
			"optimeDate" : ISODate("2016-09-22T09:27:40Z"),
			"lastHeartbeat" : ISODate("2016-09-22T09:28:52.089Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-22T09:28:52.059Z"),
			"pingMs" : NumberLong(0),
			"configVersion" : 6
		}
	],
	"ok" : 1
}
````
## 修改服务器的优先级
比如我们新添加的服务器(10.55.160.94)，这个服务器的配置较高。我希望优先让它成为主服务器。我们可以通过如下方式进行修改：

首先我们可以通过[`rs.conf`](https://docs.mongodb.com/manual/reference/method/rs.conf/#rs.conf)来查看是第几个游标。
````js
rs.conf()
````
返回值如下：
````js
{
	"_id" : "test",
	"version" : 6,
	"protocolVersion" : NumberLong(1),
	"members" : [
		{
			"_id" : 0,
			"host" : "10.55.160.91:27017",
			"arbiterOnly" : false,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 1,
			"tags" : {
				
			},
			"slaveDelay" : NumberLong(0),
			"votes" : 1
		},
		{
			"_id" : 1,
			"host" : "10.55.160.92:27017",
			"arbiterOnly" : false,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 1,
			"tags" : {
				
			},
			"slaveDelay" : NumberLong(0),
			"votes" : 1
		},
		{
			"_id" : 2,
			"host" : "10.55.160.93:27017",
			"arbiterOnly" : false,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 1,
			"tags" : {
				
			},
			"slaveDelay" : NumberLong(0),
			"votes" : 1
		},
		{
			"_id" : 3,
			"host" : "10.55.160.94:27017",
			"arbiterOnly" : false,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 1,
			"tags" : {
				
			},
			"slaveDelay" : NumberLong(0),
			"votes" : 1
		}
	],
	"settings" : {
		"chainingAllowed" : true,
		"heartbeatIntervalMillis" : 2000,
		"heartbeatTimeoutSecs" : 10,
		"electionTimeoutMillis" : 10000,
		"getLastErrorModes" : {
			
		},
		"getLastErrorDefaults" : {
			"w" : 1,
			"wtimeout" : 0
		},
		"replicaSetId" : ObjectId("57e391736b7581c82cc75a83")
	}
}
````
我们可以看到它的游标是第3个(从0开始计算)。
我们可以这样进行修改：
````js
cfg = rs.conf()
cfg.members[3].priority = 10
rs.reconfig(cfg)
````
过了一会，我们就看到主服务器变成(10.55.160.94)了。
````js
{
	"set" : "test",
	"date" : ISODate("2016-09-22T10:18:48.348Z"),
	"myState" : 2,
	"term" : NumberLong(7),
	"syncingTo" : "10.55.160.94:27017",
	"heartbeatIntervalMillis" : NumberLong(2000),
	"members" : [
		{
			"_id" : 0,
			"name" : "10.55.160.91:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 4197,
			"optime" : {
				"ts" : Timestamp(1474539241, 2),
				"t" : NumberLong(7)
			},
			"optimeDate" : ISODate("2016-09-22T10:14:01Z"),
			"lastHeartbeat" : ISODate("2016-09-22T10:18:46.676Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-22T10:18:46.535Z"),
			"pingMs" : NumberLong(0),
			"syncingTo" : "10.55.160.94:27017",
			"configVersion" : 7
		},
		{
			"_id" : 1,
			"name" : "10.55.160.92:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 4197,
			"optime" : {
				"ts" : Timestamp(1474539241, 2),
				"t" : NumberLong(7)
			},
			"optimeDate" : ISODate("2016-09-22T10:14:01Z"),
			"lastHeartbeat" : ISODate("2016-09-22T10:18:46.676Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-22T10:18:46.674Z"),
			"pingMs" : NumberLong(0),
			"syncingTo" : "10.55.160.94:27017",
			"configVersion" : 7
		},
		{
			"_id" : 2,
			"name" : "10.55.160.93:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 4202,
			"optime" : {
				"ts" : Timestamp(1474539241, 2),
				"t" : NumberLong(7)
			},
			"optimeDate" : ISODate("2016-09-22T10:14:01Z"),
			"syncingTo" : "10.55.160.94:27017",
			"configVersion" : 7,
			"self" : true
		},
		{
			"_id" : 3,
			"name" : "10.55.160.94:27017",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 3066,
			"optime" : {
				"ts" : Timestamp(1474539241, 2),
				"t" : NumberLong(7)
			},
			"optimeDate" : ISODate("2016-09-22T10:14:01Z"),
			"lastHeartbeat" : ISODate("2016-09-22T10:18:46.676Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-22T10:18:47.546Z"),
			"pingMs" : NumberLong(0),
			"electionTime" : Timestamp(1474539241, 1),
			"electionDate" : ISODate("2016-09-22T10:14:01Z"),
			"configVersion" : 7
		}
	],
	"ok" : 1
}

````

## 添加仲裁者服务器
仲裁者服务器只参与投票，而不是进行数据的存储。别忘了定义副本集名称。

我们可以使用[`rs.addArb()`](https://docs.mongodb.com/manual/reference/method/rs.addArb/#rs.addArb)来进行添加一台新的服务器（10.55.160.95）为仲裁服务器。

命令如下：
````js
rs.addArb('10.55.160.95')
````
返回`{ "ok" : 1 }`就正常执行了。这时我们通过[`rs.status()`](https://docs.mongodb.com/manual/reference/method/rs.status/#rs.status)来看一下服务器的状态。
````js
{
	"set" : "test",
	"date" : ISODate("2016-09-23T02:54:44.854Z"),
	"myState" : 2,
	"term" : NumberLong(9),
	"syncingTo" : "10.55.160.94:27017",
	"heartbeatIntervalMillis" : NumberLong(2000),
	"members" : [
		{
			"_id" : 0,
			"name" : "10.55.160.91:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 141,
			"optime" : {
				"ts" : Timestamp(1474599221, 1),
				"t" : NumberLong(9)
			},
			"optimeDate" : ISODate("2016-09-23T02:53:41Z"),
			"syncingTo" : "10.55.160.94:27017",
			"configVersion" : 8,
			"self" : true
		},
		{
			"_id" : 1,
			"name" : "10.55.160.92:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 95,
			"optime" : {
				"ts" : Timestamp(1474599221, 1),
				"t" : NumberLong(9)
			},
			"optimeDate" : ISODate("2016-09-23T02:53:41Z"),
			"lastHeartbeat" : ISODate("2016-09-23T02:54:43.113Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-23T02:54:44.091Z"),
			"pingMs" : NumberLong(0),
			"syncingTo" : "10.55.160.94:27017",
			"configVersion" : 8
		},
		{
			"_id" : 2,
			"name" : "10.55.160.93:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 86,
			"optime" : {
				"ts" : Timestamp(1474599221, 1),
				"t" : NumberLong(9)
			},
			"optimeDate" : ISODate("2016-09-23T02:53:41Z"),
			"lastHeartbeat" : ISODate("2016-09-23T02:54:43.113Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-23T02:54:43.121Z"),
			"pingMs" : NumberLong(0),
			"syncingTo" : "10.55.160.94:27017",
			"configVersion" : 8
		},
		{
			"_id" : 3,
			"name" : "10.55.160.94:27017",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 83,
			"optime" : {
				"ts" : Timestamp(1474599221, 1),
				"t" : NumberLong(9)
			},
			"optimeDate" : ISODate("2016-09-23T02:53:41Z"),
			"lastHeartbeat" : ISODate("2016-09-23T02:54:43.113Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-23T02:54:43.134Z"),
			"pingMs" : NumberLong(0),
			"electionTime" : Timestamp(1474599220, 1),
			"electionDate" : ISODate("2016-09-23T02:53:40Z"),
			"configVersion" : 8
		},
		{
			"_id" : 4,
			"name" : "10.55.160.95:27017",
			"health" : 1,
			"state" : 7,
			"stateStr" : "ARBITER",
			"uptime" : 79,
			"lastHeartbeat" : ISODate("2016-09-23T02:54:43.113Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-23T02:54:42.775Z"),
			"pingMs" : NumberLong(0),
			"configVersion" : 8
		}
	],
	"ok" : 1
}
````
我们可以看到IP为`10.55.160.95`这台服务器，它的`stateStr`的值是`ARBITER`。这个就代表是仲裁者的角色。

## 移除成员
移除成员我们使用[`rs.remove()`](https://docs.mongodb.com/manual/reference/method/rs.remove/#rs.remove)方法就可以了。

比如我们要移除10.55.160.93。我们可以使用如下命令:
````js
rs.remove('10.55.160.93:27017')
````
我们可以使用`rs.status()`查看一下返回值：
````js
{
	"set" : "test",
	"date" : ISODate("2016-09-23T03:15:21Z"),
	"myState" : 2,
	"term" : NumberLong(9),
	"syncingTo" : "10.55.160.94:27017",
	"heartbeatIntervalMillis" : NumberLong(2000),
	"members" : [
		{
			"_id" : 0,
			"name" : "10.55.160.91:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 1377,
			"optime" : {
				"ts" : Timestamp(1474600512, 1),
				"t" : NumberLong(9)
			},
			"optimeDate" : ISODate("2016-09-23T03:15:12Z"),
			"syncingTo" : "10.55.160.94:27017",
			"configVersion" : 9,
			"self" : true
		},
		{
			"_id" : 1,
			"name" : "10.55.160.92:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 1331,
			"optime" : {
				"ts" : Timestamp(1474600512, 1),
				"t" : NumberLong(9)
			},
			"optimeDate" : ISODate("2016-09-23T03:15:12Z"),
			"lastHeartbeat" : ISODate("2016-09-23T03:15:20.593Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-23T03:15:20.592Z"),
			"pingMs" : NumberLong(0),
			"syncingTo" : "10.55.160.94:27017",
			"configVersion" : 9
		},
		{
			"_id" : 3,
			"name" : "10.55.160.94:27017",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 1319,
			"optime" : {
				"ts" : Timestamp(1474600512, 1),
				"t" : NumberLong(9)
			},
			"optimeDate" : ISODate("2016-09-23T03:15:12Z"),
			"lastHeartbeat" : ISODate("2016-09-23T03:15:20.595Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-23T03:15:20.582Z"),
			"pingMs" : NumberLong(0),
			"electionTime" : Timestamp(1474599220, 1),
			"electionDate" : ISODate("2016-09-23T02:53:40Z"),
			"configVersion" : 9
		},
		{
			"_id" : 4,
			"name" : "10.55.160.95:27017",
			"health" : 1,
			"state" : 7,
			"stateStr" : "ARBITER",
			"uptime" : 1315,
			"lastHeartbeat" : ISODate("2016-09-23T03:15:20.596Z"),
			"lastHeartbeatRecv" : ISODate("2016-09-23T03:15:17.585Z"),
			"pingMs" : NumberLong(0),
			"configVersion" : 9
		}
	],
	"ok" : 1
}
````
发现10.55.160.93这个服务器已经从副本集中消失了。

## 更换副本集成员
我们可以使用如下办法进行快速更换成员：
````js
cfg = rs.conf()
cfg.members[0].host = "10.55.160.93"
rs.reconfig(cfg)
````
我们看之前被替换走的成员，它的状态已经变成这样了：
````js
{
	"state" : 10,
	"stateStr" : "REMOVED",
	"uptime" : 3162,
	"optime" : {
		"ts" : Timestamp(1474602195, 1),
		"t" : NumberLong(9)
	},
	"optimeDate" : ISODate("2016-09-23T03:43:15Z"),
	"ok" : 0,
	"errmsg" : "Our replica set config is invalid or we are not a member of it",
	"code" : 93
}

````
