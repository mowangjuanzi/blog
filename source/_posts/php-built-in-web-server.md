---
title: PHP之内置web服务器
date: 2019-05-18 16:20:49
updated: 2019-05-18 16:20:49
tags:
- web server
- php
categories:
- 编程语言
- php
---

## 前言
PHP从5.4开始，就提供了一个内置的web服务器。

这个主要是用来做本地的开发用的。不能用于线上环境。现在我就介绍一下这个工具如何使用。

<!-- more -->

## 基础应用

首先我们假定项目目录是`/home/baoguoxiao/www/php/demo`，外界可访问的目录是`/home/baoguoxiao/www/php/demo/public`。然后访问的端口是`8000`，入口文件是`index.php`和`index.html`。那么我们可以执行如下命令：

```bash
cd /home/baoguoxiao/www/php/demo/public
php -S localhost:8000
```

然后这个时候就可以正常访问了。

那么现在有个问题，就是难道每次必须要进入`public`文件夹才能启动web服务器吗，其实我们可以指定根目录的，那么可以使用如下命令：

```bash
cd /home/baoguoxiao/www/php/demo
php -S localhost:8000 -t public/
```

那么现在有一个问题就是说，如果我们使用了单入口，而且还是用了PATHINFO模式。那么上面的可能就有问题了。

对此，我们可以使用如下方案：

```bash
cd /home/baoguoxiao/www/php/demo
php -S localhost:8000 router.php
```

router.php 文件的代码

```php
/**
 * 对URL进行解析，并获取请求的文件名
 */
$uri = urldecode(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH));

/**
 * 判断是否存在该文件，如果不存在，则直接继续加载入口文件
 */
if ($uri !== "/" && file_exists(__DIR__ . "$uri")) {
    return false;
}

/**
 * 加载入口文件
 */
require_once "./index.php";
```

通过这个路由文件，我们就可以支持目前常用的开发情况了。

## 框架参考

上面的方式是我们自己的实现，那么我们也可以看看相关知名框架的实现方法。

比如 Laravel 和 Symfony。

### Laravel

在Laravel中的[安装](https://laravel.com/docs/5.8/installation#installing-laravel)一节中介绍了一个命令可以使用PHP内置web服务器实现外部访问的命令。实现的命令是：

```bash
php artisan serve
```

我们可以看一下相关代码：

具体的文件路径为：vendor/laravel/framework/src/Illuminate/Foundation/Console/ServeCommand.php

```php
/**
 * 执行命令.
 *
 * @return int
 *
 * @throws \Exception
 */
public function handle()
{
    // 切换路径到 public 目录
    chdir(public_path());

    // 在命令台进行输出相关内容
    $this->line("<info>Laravel development server started:</info> <http://{$this->host()}:{$this->port()}>");

    // 执行外部程序，并且 $status 为系统的返回状态
    passthru($this->serverCommand(), $status);

    // $status 为0 表示执行正常, 为其他大于0的数字表示出现了错误，有可能是端口被抢占了，这个时候就会接着判断是否进行再次尝试
    if ($status && $this->canTryAnotherPort()) {
        // 对绑定的端口号加1 默认是8000, 如果失败则重试端口号为8001，再次失败重试端口号为8002，以此类推。
        $this->portOffset += 1;
        // 再次调用此程序
        return $this->handle();
    }
    // 返回状态值
    return $status;
}

/**
 * 获取完整的 server 命令.
 *
 * @return string
 */
protected function serverCommand()
{
    return sprintf('%s -S %s:%s %s',
        
        // 获取PHP可执行命令的路径
        ProcessUtils::escapeArgument((new PhpExecutableFinder)->find(false)),
        
        // 获取需要绑定的host
        $this->host(),

        // 获取需要绑定的端口
        $this->port(),

        // 对需要执行的参数进行转义处理。这里的 server 就是我们之前说的路由文件，它在项目的根路径下
        ProcessUtils::escapeArgument(base_path('server.php'))
    );
}
```

对上面的命令进行翻译一下，实际上就是执行的

```bash
cd ./public
php -S 0.0.0.0:8000 ../server.php
```

> note:
>
> 这里我们可以看到一个区别就是之前我自己写的代码，host 都是 localhost, 但是这里写的是 0.0.0.0。这两个有什么区别呢？
>
> 其实区别很简单，比如我之前写的 localhost 绑定的ip 是 127.0.0.1, 这个相当于一个回环地址，那么我们就只允许本机的IP进行访问。而 0.0.0.0，则表示我们对ip不进行限制，所有的IP都可以进行访问。

那我们接着再来看看项目根目录下面的`server.php`:

```php
/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// 这个文件允许我们从内置 PHP web 服务器中模拟 Apache 的 "mod_rewrite" 功能.
// 这提供了一种测试 Laravel 应用程序的便捷方法,
// 而无需在此安装"真正的" web 服务器软件。
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

require_once __DIR__.'/public/index.php';
```

发现跟我之前写的路由文件相同。没错，我就是从这里抄过来的。

基本上 Larvel 的实现方法就是这样了。

### Symfony

如果你在使用 Symfony 框架话，发现Symfony有一个组件叫做[web-server-bundle](https://github.com/symfony/web-server-bundle)，这个组件的作用跟Laravel相同，也是不借助web服务器，实现通过浏览器访问应用程序。

基本的操作可以参考[该页面](https://symfony.com/doc/current/setup/built_in_web_server.html)

我在这里主要说一下Symfony是如何实现的.

在Symfony中有一段代码是这样的:

```php
public function start(WebServerConfig $config, $pidFile = null)
{
    // 获取默认的PID文件位置
    $pidFile = $pidFile ?: $this->getDefaultPidFile();

    // 判断是否在运行，如果运行则提示已经在监听了
    if ($this->isRunning($pidFile)) {
        throw new \RuntimeException(sprintf('A process is already listening on http://%s.', $config->getAddress()));
    }

    // fork了一个子进程，如果成功，会有两个进程进行同时执行下面的文件，父进程，也就是当前执行的进程会返回子进程的PID，而子进程则返回的PID为0，
    // 如果失败，则子进程不会创建，并且父进程会返回的pid为-1。更多内容可查看 https://www.php.net/manual/zh/function.pcntl-fork.php
    $pid = pcntl_fork();

    // 表示fork进程失败
    if ($pid < 0) {
        throw new \RuntimeException('Unable to start the server process.');
    }

    // 进入这个判断，表示执行的是父进程，表示不用继续向下执行
    if ($pid > 0) {
        return self::STARTED;
    }

    // 从此往后是子进程运行，首先通过 posix_setsid 变为守护进程，意思是使其脱离终端的管理，自立门户，谁也没办法管理这个进程，除了PID。
    if (posix_setsid() < 0) {
        throw new \RuntimeException('Unable to set the child process as session leader.');
    }

    // 创建命令，命令类似Laravel，不过这里的路由文件跟Laravel类似。也是处理加载规则，并加载入口文件。具体的router.php 路径为：
    // vendor\symfony\web-server-bundle/Resources/router.php
    // 下面是禁用输出并且开始运行
    $process = $this->createServerProcess($config);
    $process->disableOutput();
    $process->start();

    // 判断是否运行成功
    if (!$process->isRunning()) {
        throw new \RuntimeException('Unable to start the server process.');
    }

    // 写入PID文件
    file_put_contents($pidFile, $config->getAddress());

    // 检测PID文件，如果PID文件删除了，那么进程就立即退出。
    while ($process->isRunning()) {
        if (!file_exists($pidFile)) {
            $process->stop();
        }

        sleep(1);
    }

    // 返回停止的状态
    return self::STOPPED;
}

/**
 * 启动PHP内置web服务器
 * @return Process The process
 */
private function createServerProcess(WebServerConfig $config)
{
    // 查找PHP的可执行程序
    $finder = new PhpExecutableFinder();
    if (false === $binary = $finder->find(false)) {
        throw new \RuntimeException('Unable to find the PHP binary.');
    }

    $xdebugArgs = ini_get('xdebug.profiler_enable_trigger') ? ['-dxdebug.profiler_enable_trigger=1'] : [];

    // 实例化PHP要执行的命令 php_path -dvariables_order=EGPCS -S 127.0.0.1:8000 vendor\symfony\web-server-bundle/Resources/router.php
    $process = new Process(array_merge([$binary], $finder->findArguments(), $xdebugArgs, ['-dvariables_order=EGPCS', '-S', $config->getAddress(), $config->getRouter()]));
    // 设置工作目录
    $process->setWorkingDirectory($config->getDocumentRoot());
    // 设置超时时间
    $process->setTimeout(null);

    // 设置环境变量
    if (\in_array('APP_ENV', explode(',', getenv('SYMFONY_DOTENV_VARS')))) {
        $process->setEnv(['APP_ENV' => false]);
        $process->inheritEnvironmentVariables();
    }

    // 返回相关变量
    return $process;
}
```

我在上面的代码中进行了注释, 描述了Symfony是如何启动的.

里面有一个问题就是使用[`pcntl_fork`](https://www.php.net/manual/zh/function.pcntl-fork.php), 该扩展在Windows中是不受支持的. 所以 Symfony框架会提示使用`php bin/console server:run`命令运行程序.

## 未来展望

其实还有一个方式, 就是 Workman 是通过自身的实现的web服务器，它并没有借助`php -S`命令。这一块的代码我还没有吃透，并且我觉得这个也可以单独拎几章出来讲。希望以后有这个机会。

## 总结

通过我们学习 PHP 命令实现web服务器访问以及对 Laravel 和 Symfony 框架的分析, 让我了解到在Windows的开发过程中,我们完全可以借助该方式来摆脱对web服务器的依赖.既能方便我们在Windows环境进行开发并且学习了PHP一个技巧.感觉挺好的.

大家如果对此有什么疑问可以评论进行交流.


## 参考

- [PHP: 内置Web Server - Manual ](https://www.php.net/manual/zh/features.commandline.webserver.php)
- [Laravel](https://laravel.com/)
- [How to Use PHP's built-in Web Server](https://symfony.com/doc/current/setup/built_in_web_server.html)
- [PHP: pcntl_fork - Manual](https://www.php.net/manual/zh/function.pcntl-fork.php)
- [PHP: posix_setsid - Manual](https://www.php.net/manual/zh/function.posix-setsid.php)