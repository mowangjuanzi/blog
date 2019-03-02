---
title: laravel中表单提交获取字段会将空值转换为null的解决方案
date: 2018-09-08 07:26:37
tags:
- php
- laravel
categories:
- 编程语言
- php
- laravel
---
## 问题

今天在进行Laravel开发的时候，发现了比较坑的一点。
按照默认情况来说，比如表单提交，如果我们提交了这个字段，但是这个字段为空字符串。在Laravel中会自动转义成Null。这个为什么呢？

原来Laravel有个全局中间件，代码如下图：

```php
<?php

namespace Illuminate\Foundation\Http\Middleware;

class ConvertEmptyStringsToNull extends TransformsRequest
{
    /**
     * Transform the given value.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return mixed
     */
    protected function transform($key, $value)
    {
        return is_string($value) && $value === '' ? null : $value;
    }
}
```

该中间件就会将空的参数值自动转为null。

那么对于这种问题应该如何解决呢？

## 方法1

我们再写一个中间件，替换之前的中间件，里面可以排除指定字段不转为null。里面的数组可以更改成你需要不转的字段。

```php
// app/Http/Middleware/NinjaAuther.php 新增文件

namespace App\Http\Middleware;

class NinjaAuther extends TransformsRequest
{

/**
 * Transform the given value.
 *
 * @param  string  $key
 * @param  mixed  $value
 * @return mixed
 */
protected function transform($key, $value)
{
        if(is_string($value) && !in_array($key,  ['abc'], true)) {
            $value = $value === '' ? null : $value;
        }

    return $value;
    }
}
```

```php
// app/Http/Kernel.php 部分代码

protected $middleware = [
        \App\Http\Middleware\CheckForMaintenanceMode::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        // \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class, // 这一条注释掉
        \app/Http/Middleware/NinjaAuther.class, // 新增的记录
        \App\Http\Middleware\TrustProxies::class,
    ];
```

但是该中间件是全句性质的，所以我个人则更加倾向于第二种方法。

```php
// app/Http/Controllers/StoreController.php

<?php

namespace App\Http\Controllers;

use App\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function save(Request $request) {
        $store = new Store();
        $store->title = strval($request->input("title")); // 对获取的字段进行格式转换
        $store->address = strval($request->input("address"));
        $store->longitude = doubleval($request->input("longitude"));
        $store->latitude = doubleval($request->input("latitude"));
        $store->introduction = strval($request->input("introduction"));
        $store->text = strval($request->input("text"));
        $store->status = intval($request->input("status"));
        $store->save();
    }
}
```

如上面这样，对指定格式进行显示转换。写的多了，可能会显得繁琐一些。不过感觉比较看的明白。

上面这种方案如何解决，就看大家的喜好了。

## 参考

- [How to ignore specific attributes in Laravel's ConvertEmptyStringsToNull?](https://stackoverflow.com/questions/46244438/how-to-ignore-specific-attributes-in-laravels-convertemptystringstonull)
