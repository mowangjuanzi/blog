# Laravel 广播，使用 Reverb

## 前言

本教程使用两个示例，一个是常规的，一个是需要私有频道。

## 要求

- Laravel >= 11

## 安装

此命令用于生成 `config/broadcasting.php` 和 `routes/channels.php`。

```bash
php artisan install:broadcasting
```

安装 reverb，此命令用于生成 `config/reverb.php` 及其相关 websocket 管理。

```bash
composer require laravel/reverb
```

## 配置私有频道（常规频道可跳过该章节）

### 路由配置

私有频道需要首先发起 http 请求，获取 token。默认注册的路由是 `broadcasting/auth`。使用默认的 web 中间件。所以如果使用自定义中间件或者有特殊需求的话，可以自己注册路由。

比如说我们自定义的路由地址是 `/api/broadcasting`。

注册路由：

```php
use App\Http\Controllers\Web\AuthenticationController;

Route::match(['GET', "POST"], 'broadcasting', [AuthenticationController::class, 'broadcasting'])->middleware(['tokenAuth:user']);
```

控制器：

```php
namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Broadcast;

class AuthenticationController extends Controller
{
    /**
     * Laravel Echo 私有频道认证
     */
    public function broadcasting(Request $request)
    {
        return Broadcast::auth($request);
    }
}
```

频道路由：

```php
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('resume.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
```

> `'resume.{id}'` 是频道名称。

## 后台启动

```bash
php artisan reverb:start # 常规

php artisan reverb:start --debug # 以调试模式启动
```

## 前台引入（常规频道和私有频道均可）

```bash
npm install --save-dev laravel-echo pusher-js
```

vue 项目引入，在 `src/main.js` 中

```javascript
// websocket 支持
window.Pusher = Pusher

// 用于调试，不用可删除
window.Pusher.logToConsole = true

window.Echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
  authEndpoint: `${import.meta.env.VITE_BASE_URL}broadcasting`,
  auth: {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }
})
```

- `authEndpoint` 设置自定义路由地址，用于替换前文中提出的 `broadcasting/auth`
- `auth` juwt 的方式的话，这里需要传入 `Authorization`

## 前台接收广播

常规频道

```javascript
window.Echo.on(`demo`).listen("demoAction", (data) => {
  console.log("listen", data)
})
```

私有频道

```javascript
window.Echo.private(`demo.${userStore.id}`).listen("demoAction", (data) => {
  console.log("listen", data)
})
```

## 后台推送广播

常规频道

```php
use Illuminate\Support\Facades\Broadcast;

Broadcast::private('demo')->as('demoAction')->with(['id' => 1])->sendNow();
```


私有频道

```php
use Illuminate\Support\Facades\Broadcast;

Broadcast::private('demo.1')->as('demoAction')->with(['id' => 1])->sendNow();
```

## 遗留问题

event 的方式我还没搞懂怎么发送。所以就先不写了。
