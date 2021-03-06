---
title: Lumen 实现 SQL 监听
date: 2019-07-12 00:00:00
updated: 2020-02-09 08:08:45
tags:
- laravel
- lumen
- php
- git
categories:
- 编程语言
- php
- lumen
---

之前 `Lumen` 框架从 `5.6` 升级到 `5.7`。发现 `laravel-sql-logger` 包不能正常记录日志了。进行排查，发现是 `Lumen` 框架没有对 `DB` 类型注入 `event` 对象，导致不能正常对其进行SQL监听。

那么解决方案也非常简单。

<!-- more -->

```php
// file: bootstrap/app.php
$app["db"]->connection()->setEventDispatcher($app["events"]); // 在下面的注册前加入这一行即可
$app->register(Mnabialek\LaravelSqlLogger\Providers\ServiceProvider::class);
```

但是这也让我对如何实现SQL记录产生了兴趣。接下来，我们就具体了解一下如何实现SQL监听。

我们知道在`Larvel`上非常简单。只需要如下方法即可对其进行SQL监听：

```php
namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 启动应用服务
     *
     * @return void
     */
    public function boot()
    {
        DB::listen(function ($query) {
            // $query->sql
            // $query->bindings
            // $query->time
        });
    }
    
    //...
}
```

但是在 `Lumen` 上这种办法是没有办法使用的。`Lumen`有一些自己的调试SQL的方法，但是这些并不是我们想要的。所以我们只能自己写监听事件。

具体的解决方案是，我们首先创建一个Listener文件。

```php
// file: app\Listeners\QueryListener.php

namespace App\Listeners;

use Illuminate\Database\Events\QueryExecuted;

class QueryListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ExampleEvent  $event
     * @return void
     */
    public function handle(QueryExecuted $event)
    {
        dd($event); // 此处直接对其进行打印
    }
}
```

接下来我们直接对其进行注册

```php
// file: app/Providers/EventServiceProvider.php
namespace App\Providers;

use App\Listeners\QueryListener;
use Illuminate\Database\Events\QueryExecuted;
use Laravel\Lumen\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        QueryExecuted::class => [  // 这行
            QueryListener::class, // 还有这行
        ],
    ];
}
```

别忘了注册 `Service Providers`

```php
// file: bootstrap/app.php'

/*
|--------------------------------------------------------------------------
| Register Service Providers
|--------------------------------------------------------------------------
|
| Here we will register all of the application's service providers which
| are used to bind services into the container. Service providers are
| totally optional, so you are not required to uncomment this line.
|
*/

// $app->register(App\Providers\AppServiceProvider::class);
// $app->register(App\Providers\AuthServiceProvider::class);
$app->register(App\Providers\EventServiceProvider::class); // 取消对这一行的注释
```

接下来就是实操了。首先我们创建一个控制器

```php
//file: app/Http/Controllers/UserController.php
namespace App\Http\Controllers;

use App\User;

class UserController extends Controller
{
    public function one() {
        return User::where("id", 1)->first(); // 在控制器执行查询方法
    }
}
```

注册路由

```php
// file: routes/web.php
$router->get('/one', "UserController@one"); // 定义访问路由
```

最后别忘了开启DB功能以及填写数据库配置(这一段大家肯定都会，我就不贴代码了)。

那么我们来尝试运行一下：

```php
QueryExecuted {#65 ▼
  +sql: "select * from `users` where `id` = ? limit 1"
  +bindings: array:1 [▶]
  +time: 2.06
  +connection: MySqlConnection {#66 ▶}
  +connectionName: "mysql"
}
```

发现已经成功了。那么就可以执行日志记录了。

我们修改一下代码：

```php
// file: app/Listeners/QueryListener.php
namespace App\Listeners;

use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\Log;

class QueryListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ExampleEvent  $event
     * @return void
     */
    public function handle(QueryExecuted $event)
    {
        $query = $event->sql; // 获取SQL语句
        foreach ($event->bindings as $bind) {
            $query = preg_replace('/\?/', (is_numeric($bind) ? $bind : '\'' . $bind . '\''), $query, 1); // 将SQL中的?替换为实际的值
        }
        Log::info("query: {$query} time: {$event->time}ms"); // 将SQL和执行时间打印到日志
    }
}
```

虽然已经实现了SQL记录，但是这并不是我们想要的，因为将SQL和错误日志放在一起。阅读起来非常难受。那么我就需要放到一个单独的文件里面去就好了。

```php
// file: app/Listeners/QueryListener.php
namespace App\Listeners;

use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Http\Request;

class QueryListener
{
    /**
     * 写入的文件路径
     * @var string
     */
    protected $writeFile;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        $this->writeFile = storage_path() . DIRECTORY_SEPARATOR . "logs" . DIRECTORY_SEPARATOR . "sql-" . date("Ymd") . ".log"; // 定义输出的日志路径ß
    }

    /**
     * Handle the event.
     *
     * @param  QueryExecuted  $event
     * @param Request $request
     * @return void
     */
    public function handle(QueryExecuted $event)
    {
        $query = $event->sql;
        foreach ($event->bindings as $bind) {
            $query = preg_replace('/\?/', (is_numeric($bind) ? $bind : '\'' . $bind . '\''), $query, 1);
        }

        file_put_contents($this->writeFile, "query: {$query} time: {$event->time}ms", FILE_APPEND); // 直接使用 file_put_contents 对内容进行输入。并且注意 FILE_APPEND 如果不加就变成覆盖了，这个常量的作用是对文件进行追加写入。
    }
}
```

接下来继续改进，就是说我们目前是在所有的环境中进行打印的，但是我们仅仅需要在开发环境进行调试。所以我们可以进行如下修改：

```php
// file: app/Providers/EventServiceProvider.php
namespace App\Providers;

use App\Listeners\QueryListener;
use Illuminate\Database\Events\QueryExecuted;
use Laravel\Lumen\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [];

    public function register()
    {
        if (env("APP_ENV") == "local") { // 判断环境
            $events = app('events');

            $events->listen(QueryExecuted::class, QueryListener::class); // 手动注册监听器
        }
    }
}
```

那么SQL监听功能就实现了。

其实 `laravel-sql-logger`还有一些高级的显示功能。比如说打印日志的时候会顺带着打印请求URL。打印请求时间等。这些我就不这里具体完善了。如果大家有兴趣，可以自己想办法实现。很简单的。
