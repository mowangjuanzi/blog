---
title: 依托illuminate组件实现数据库迁移
date: 2019-11-07 00:00:00
updated: 2020-02-08 22:18:04
tags:
- laravel
- php
category:
- php
- laravel
---

## 前言

因为一些原因，我准备选用`yaf`框架作为我们的主力开发框架，但是我还想要将`Laravel`的数据库迁移功能给挪过来。所以就研究了一天相关功能。终于让我实现了。

<!-- more -->

## 文件简介

首先看一下项目目录：

```bash
yaf-base/
├── app
│   ├── Bootstrap.php
│   ├── controllers
│   │   └── Index.php
│   └── Models
│       └── UserBase.php
├── app.ini
├── bin
│   └── migrate.php
├── composer.json
├── composer.lock
├── migrations
│   └── 2014_10_12_000000_create_users_table.php
├── public
│   └── index.php
├── README.md
└── vendor
```

这里是`composer.json`文件的内容：

```json
{
    "require":{
        "php":">=7.2",
        "illuminate/database":"^6.4",
        "illuminate/filesystem":"^6.4",
        "illuminate/events":"^6.4",
        "illuminate/config":"^6.4",
        "illuminate/console":"^6.4"
    },
    "repositories":{
        "packagist":{
            "type":"composer",
            "url":"https://mirrors.aliyun.com/composer/"
        }
    }
}
```

然后下面是`migrations/2014_10_12_000000_create_users_table.php`

```php
<?php

use Illuminate\Container\Container;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
```

可以看到这个跟Laravel的迁移文件是一样的。


第三个文件就是`bin/migrate.php`

```php
<?php

use Illuminate\Config\Repository;
use Illuminate\Console\OutputStyle;
use Illuminate\Container\Container;
use Illuminate\Database\Connectors\ConnectionFactory;
use Illuminate\Database\Console\Migrations\TableGuesser;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Migrations\DatabaseMigrationRepository;
use Illuminate\Database\Migrations\MigrationCreator;
use Illuminate\Database\Migrations\Migrator;
use Illuminate\Database\Schema\Builder;
use Illuminate\Events\Dispatcher;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Str;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;

define("ROOT_PATH", realpath(__DIR__ . "/../"));

require ROOT_PATH . "/vendor/autoload.php";

if (!isset($argv[1])) {
    $argv[1] = null;
}

$container = new Container();

$config = new Repository();

$config->set("database", [
    "default" => "mysql",
    "connections" => [
        "mysql" => [
            'driver' => 'mysql',
            'url' => "",
            'host' => "127.0.0.1",
            'port' => "3306",
            'database' => "test",
            'username' => "root",
            'password' => "baoguoxiao",
            'unix_socket' => '',
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => [],
        ]
    ]
]);

$container->instance("config", $config);

$file = new Filesystem();

$container->singleton("db", function ($container) {
    $db = new DatabaseManager($container, new ConnectionFactory($container));
    $db->connection("mysql");
    return $db;
});

Facade::setFacadeApplication($container);

Container::setInstance($container);

/**
 * 执行迁移命令如果出现 SQLSTATE[42000]: Syntax error or access violation: 1071 Specified key was too long; max key length is 767 bytes 错误则开启此行代码即可解决问题
 */
//Builder::defaultStringLength(191);

$repository = new DatabaseMigrationRepository($container["db"], "migrations");

$event = new Dispatcher($container);

$migrator = new Migrator($repository, $container["db"], $file, $event);

$output = new OutputStyle(new ArgvInput(), new ConsoleOutput());

if ($argv[1] == "create") {
    $creator = new MigrationCreator($file);
    $name = Str::snake($argv[2]);

    [$table, $create] = TableGuesser::guess($name);

    try {
        $file_path = $creator->create($name, ROOT_PATH . "/migrations", $table, $create);
        $file_path = pathinfo($file_path, PATHINFO_FILENAME);

        $output->success("Created Migration: {$file_path}");
    } catch (\InvalidArgumentException $exception) {
        $output->error($exception->getMessage());
    }
} elseif ($argv[1] == "up") {
    if (!$migrator->repositoryExists()) { // migrate:install
        $repository->createRepository();
    }

    $migrator->setOutput($output)->run(ROOT_PATH . "/migrations", [
        "pretend" => false,
        "step" => false
    ]);
} elseif ($argv[1] == "down") {
    if (!$migrator->repositoryExists()) { // migrate:install
        $repository->createRepository();
    }

    $migrator->setOutput($output)->rollback(ROOT_PATH . "/migrations", [
        "pretend" => false,
        "step" => 0
    ]);
}else {
    $output->text(<<<EOF
操作方法：
php bin/migrate.php create {xxx} 创建迁移，命名规则为Laravel
php bin/migrate.php up 执行迁移
php bin/migrate.php down 回滚迁移
EOF
);
}
```

## 执行操作

执行迁移命令：

```bash
$ php bin/migrate.php up
Migrating: 2014_10_12_000000_create_users_table
Migrated:  2014_10_12_000000_create_users_table (0.11 seconds)
```

迁移回滚：

```bash
$ php bin/migrate.php down
Rolling back: 2014_10_12_000000_create_users_table
Rolled back:  2014_10_12_000000_create_users_table (0.03 seconds)
```

创建表：

```bash
$ php bin/migrate.php create create_demo_table

 [OK] Created Migration: 2019_11_06_220957_create_demo_table
```

查看一下目录：

```bash
$ tree -L 2 ./yaf-base/
./yaf-base/
├── app
│   ├── Bootstrap.php
│   ├── controllers
│   └── Models
├── app.ini
├── bin
│   └── migrate.php
├── composer.json
├── composer.lock
├── migrations
│   ├── 2014_10_12_000000_create_users_table.php
│   └── 2019_11_06_220957_create_demo_table.php
├── public
│   └── index.php
├── README.md
└── vendor
```

可以看到多了一个`2019_11_06_220957_create_demo_table.php`

查看以下里面的内容:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDemoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('demo', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('demo');
    }
}
```

跟`Laravel`丝毫不差。


## 总结

通过此次的重现，我对于`Laravel`的容器理解更加深刻了。对于`Laravel`的所有都注入到容器中的想法表示敬佩。

同时对于提取了这一套迁移方法表示可以同样用在基础框架中，非常实用。