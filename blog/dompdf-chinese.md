# DOMPDF 输出 PDF & 中文乱码

## 前言

我需要解决输出PDF的问题。并且现在使用的版本是：

- barryvdh/laravel-dompdf: v3.1.1
- dompdf/dompdf: v3.1.0

## 安装

```bash
composer require barryvdh/laravel-dompdf
```

## 运行

```php
use Barryvdh\DomPDF\Facade\Pdf;

Route::get("/demo", function () {
    return Pdf::loadView('demo')->stream();
});
```

## 避坑

- 不支持 flex 排版，及其相关 css。只能使用之前的 float 浮动布局。

## 中文乱码

- 下载你要用字体，放到 Laravel 根目录

仅能使用 ttf 或 otf 的字体后缀名。比如我用的就是：SourceHanSansSC-VF.ttf。

- 下载 [load_fonts.php](https://github.com/Link1515/dompdf-load-multiple-fonts/blob/master/load_fonts.php)，放到 Laravel 根目录
- 创建目录 `storage/fonts`。
- 进入 `load_fonts.php` 编辑文件。

    ```php
    // 2. [Optional] Set the path to your font directory
    //    By default dompdf loads fonts to dompdf/lib/fonts
    //    If you have modified your font directory set this
    //    variable appropriately.
    $fontDir = "storage/fonts"; // 这里改为设置的字体路径，我设置的就是 storage/fonts

    ```
- 执行命令：

```bash
php load_font.php "source_han_san" SourceHanSansSC-VF.ttf
```

会在 `storage/fonts` 生成对应的文件。

- 修改 `storage/fonts/installed-fonts.json`

    需要移除前缀 `storage\/fonts\/`

## 运行

编辑模板文件 `demo.blade.php`

```blade
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>

    <style>
        body {
            font-family: "source han san", serif;
        }
    </style>
</head>
<body>
    <h1>测试字体</h1>
</body>
</html>
```

然后在浏览器内访问即可。

enjoy!

## 清理

确认正常显示后，就可以删除根目录下的 `load_font.php` 和 `SourceHanSansSC-VF.ttf` 即可。

## 参考

- [Laravel 輸出中文 PDF](https://lynkishere.com/Backend/make-pdf-by-laravel/)
- [Undefined array key ""](https://github.com/barryvdh/laravel-dompdf/issues/1031)
