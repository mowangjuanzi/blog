---
title: lumen安装Horizon
date: 2018-08-14 11:10:23
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
昨天领导告诉我，要安装Horizon。但是我们使用的是lumen，官方的Horizon并不支持lumen。所以又去找第三方，结果发现已经八个月没有更新了。无奈尝试自己维护。发现一堆坑。根本填不完。今天早上想着去[packagist](https://packagist.org/)去淘淘。还真让我发现了一个正在维护的:[horizon-lumen](https://packagist.org/packages/kinsolee/horizon-lumen)。

一切安装就按照README.md上面的步骤进行安装就好了。

再此说下，中间碰到的坑。

在执行如下命令：

```bash
php artisan vendor:publish --provider="Laravel\Horizon\HorizonServiceProvider"
```

出现如下错误：

```php
In Facade.php line 218:

  A facade root has not been set.
```

经过查询发现解决方案是在boorstrap/app.php中的注释：

```php
$app->withFacades(); // 去掉这一行的注释
```

我发现这一行已经开启了，但是还是出现这个错误。然后我发现这一块的代码几乎放在了该文件的最后，所以我将其提到了文件的最前面，如下所示：

```php
$app->withEloquent(); // 这一行的下面

$app->withFacades(true,[
    'Tymon\JWTAuth\Facades\JWTAuth'             => 'JWTAuth',
    'Tymon\JWTAuth\Facades\JWTFactory'          => 'JWTFactory',
    'ZanySoft\Zip\ZipFacade' => 'Zip',
    App\Providers\RongCloudServiceProvider::class =>  'RongCloud',
]);
```

这样就能正常安装上了。

还有一个问题是在访问仪表盘的时候，结果html代码是以文本来显示的。并没有使用html的方式展示内容。

经过分析，发现返回的header中没有`Content-type`选项。

所以写了一个中间件。代码如下：

```php
<?php
/**
 * file path: app/Http/Middleware/HtmlMiddleware.php
 */
namespace App\Http\Middleware;
use Closure;

class HtmlMiddleware
{
    /**
     * 运行请求过滤器
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        if (is_null($response->headers->get("Content-Type"))) { // 当为空的时候才会添加header
            $response->header("Content-Type", "text/html; charset=UTF-8");
        }

        return $response;
    }
}
```

因为我这边使用了dingo，所以加上如上判断。

最后修改bootstrap/app.php中的一处：

```php
$app->middleware([
    \App\Http\Middleware\HtmlMiddleware::class,
]);
```

一切大功告成。

后记：

在分享给同事使用的时候，同事说出现这么一个错误：

```text
The Mix manifest does not exist
```

在我本地是正常啊，为啥同事就是不行呢。研究了半天。发现原因了。

因为在public文件夹里面有vendor文件夹。但是正好.gitignore中有一条规则将vendor/给忽略了。所以需要执行以下命令：

```bash
git add public/vendor -f # 强制加入git版本追踪
```

提交之后，让同事拉取代码，再去执行就可以了。