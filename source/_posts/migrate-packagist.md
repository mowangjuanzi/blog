---
title: 依托illuminate组件实现数据库迁移(后续)
date: 2019-11-24 00:00:00
updated: 2020-02-08 22:15:18
tags:
- laravel
- php
category:
- 编程语言
- php
- laravel
---

这段时间一直在思考，想着把迁移功能给独立出来。所以还是按照Laravel的模式重新写了一版并提交到了 [GitHub](https://github.com/mowangjuanzi/migrate) 中，另外 [Packagist](https://packagist.org/packages/wowangjuanzi/migrate) 也发布了。

下面简单介绍一下。

<!-- more -->

首先创建项目使用如下命令：

```bash
composer create-project wowangjuanzi/migrate
```

创建好后查看文件目录

```bash
$ tree ./migrate/ -L 3
./migrate/
├── README.md
├── artisan -> console.php
├── composer.json
├── composer.lock
├── config
│   ├── app.php
│   └── database.php
├── console.php
├── database
│   └── migrations
├── helper.php
└── vendor
    ├── autoload.php
    ├── bin
    │   ├── carbon -> ../nesbot/carbon/bin/carbon
    │   └── var-dump-server -> ../symfony/var-dumper/Resources/bin/var-dump-server
    ├── composer
    │   ├── ClassLoader.php
    │   ├── LICENSE
    │   ├── autoload_classmap.php
    │   ├── autoload_files.php
    │   ├── autoload_namespaces.php
    │   ├── autoload_psr4.php
    │   ├── autoload_real.php
    │   ├── autoload_static.php
    │   └── installed.json
    ├── doctrine
    │   └── inflector
    ├── illuminate
    │   ├── config
    │   ├── console
    │   ├── container
    │   ├── contracts
    │   ├── database
    │   ├── events
    │   ├── filesystem
    │   └── support
    ├── nesbot
    │   └── carbon
    ├── phpoption
    │   └── phpoption
    ├── psr
    │   ├── container
    │   └── simple-cache
    ├── symfony
    │   ├── console
    │   ├── finder
    │   ├── polyfill-ctype
    │   ├── polyfill-mbstring
    │   ├── polyfill-php72
    │   ├── polyfill-php73
    │   ├── process
    │   ├── service-contracts
    │   ├── translation
    │   ├── translation-contracts
    │   └── var-dumper
    └── vlucas
        └── phpdotenv

38 directories, 20 files
```

`config`文件夹包含的是相关配置文件，比如`app.php`中就是指定运行的环境。`database.php`指定的是数据库的相关配置信息。

`console.php`是我自己定义的，类似`Laravel`中的`artisan`，不过我也创建了一个软链`artisan`->`console.php`。方便进行适应。

还有一个文件是`.env`，该文件内容如下：

```ini
APP_NAME=Migrate
APP_ENV=local

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

这里的配置跟Laravel相同，这里我就不过多描述了。

操作命令主要如下：

```bash
$ php artisan 
Migrate 0.0.3

Usage:
  command [options] [arguments]

Options:
  -h, --help            Display this help message
  -q, --quiet           Do not output any message
  -V, --version         Display this application version
      --ansi            Force ANSI output
      --no-ansi         Disable ANSI output
  -n, --no-interaction  Do not ask any interactive question
      --env[=ENV]       The environment the command should run under
  -v|vv|vvv, --verbose  Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug

Available commands:
  help              Displays help for a command
  list              Lists commands
  migrate           Run the database migrations
 db
  db:wipe           Drop all tables, views, and types
 make
  make:migration    Create a new migration file
 migrate
  migrate:fresh     Drop all tables and re-run all migrations
  migrate:install   Create the migration repository
  migrate:refresh   Reset and re-run all migrations
  migrate:reset     Rollback all database migrations
  migrate:rollback  Rollback the last database migration
```

比如创建迁移文件：

```bash
$ php artisan make:migration create_users_table
Created Migration: 2019_11_24_135530_create_users_table
```

具体其他的可以参考Laravel文档：

- [官网 - 数据库迁移](https://laravel.com/docs/6.x/migrations)
- [LearnKu - 数据库迁移](https://learnku.com/docs/laravel/6.x/migrations/5173)
- [学院君 - 数据库迁移](https://xueyuanjun.com/post/19972.html)

## 最后

欢迎大家来尝试我写的这个工具，如果有什么疑问，可以跟我留言提issus。