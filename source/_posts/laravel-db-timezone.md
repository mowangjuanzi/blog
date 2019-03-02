---
title: laravel中DB_TIIMEZONE中的坑
date: 2018-09-18 10:57:58
tags:
- php
- laravel
- mysql
- orm
categories:
- 编程语言
- php
- laravel
---
首先介绍一下环境。

数据库：RDS(阿里云)-5.6
PHP：PHP7.2 + Lumen
系统：Ubuntu

```php
$time = date('Ymd');
$pdo = new PDO("dns", "user", "password");
$data = $pdo->query("select * from table where date_format(from_unixtime(addtime),'%Y%m%d') = '{$time}'");
foreach($data as $item) {
    var_dump($data);
}
```

我们有一条上面的查询语句。在开发的时候没有任何问题，但是代码在上线后，突然爆出不能正确的查出相应的数据。但是数据确实存在。

当时我们处理这个问题是凌晨1点，并且是在家里。考虑可能是时区问题，但是因为太晚了，所以我们使用了另外一种方式去避免这个问题。并没有追查这个事情的具体原因。

正好白天有一点空闲，所以准备排查一下这个问题。

我的第一考虑就是时区的问题，但是我自己执行以下的查询语句，却是发现没有问题。

```php
$pdo = new PDO("dns", "user", "password");
$data = $pdo->queru("select now()");
foreach($data as $item) {
    var_dump($data);
}
```

所以我把目标转向了lumen这个框架，我通过查询源码，发现有这么一段源码：

```php
// file_path: vendor/illuminate/database/Connectors/MySqlConnector.php
/**
 * Set the timezone on the connection.
 *
 * @param  \PDO  $connection
 * @param  array  $config
 * @return void
 */
protected function configureTimezone($connection, array $config)
{
    if (isset($config['timezone'])) {
        $connection->prepare('set time_zone="'.$config['timezone'].'"')->execute();
    }
}
```

然后我就去看我的数据配置，找到这里：

```php
// file path: config/database.php
'mysql' => [
    'driver'    => 'mysql',
    'host'      => env('DB_HOST', 'localhost'),
    'port'      => env('DB_PORT', 3306),
    'database'  => env('DB_DATABASE', 'forge'),
    'username'  => env('DB_USERNAME', 'forge'),
    'password'  => env('DB_PASSWORD', ''),
    'charset'   => env('DB_CHARSET', 'utf8mb4'),
    'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
    'prefix'    => env('DB_PREFIX', ''),
    'timezone'  => env('DB_TIMEZONE', '+00:00'), // 注意看这里
    'strict'    => env('DB_STRICT_MODE', false),
],
```

然后再次修改自己的SQL进行尝试：

```php
$time = date('Ymd');
$pdo = new PDO("dns", "user", "password");
$data = $pdo->query("set time_zone= '+00:00'; select * from table where date_format(from_unixtime(addtime),'%Y%m%d') = '{$time}'");
foreach($data as $item) {
    var_dump($data);
}
```

发现时间就会变成CST时间了。

这样在该框架的路由中增加了该方法：

```php
Route::get("/test", function() {
    return \DB::select("select now()")->toArray();
});
```

发现返回的时间也是CST时间了。所以真相大白了。

我们上班的时间是白天十点以后，这样当天的时间减去八个小时候再去计算，最上面写的SQL中的where条件还是成立的，但是凌晨一点去计算的时候，却是查询的昨天的数据，所以where条件就不查询不到正确的数据了。

这个事情让我明白，要仔细了解一个框架，说不定一个小小的细节被遗漏，就会造成不可预料的后果。
