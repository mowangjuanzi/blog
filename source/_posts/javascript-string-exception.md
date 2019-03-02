---
title: JS解析字符串异常的处理
date: 2018-06-29 12:06:05
tags:
- javascript
- android
categories:
- 编程语言
- javascript
---
我目前在做的webview渲染优化的事情。

目前碰到一个问题，就是说安卓APP请求服务器返回的字符串，然后调用参数传递内容。

但是在执行的时候，总是报错。

有一个不可见的字符，在编辑器中识别不出来，执行之后也看不到，但是查看上一条执行的命令的时候就可以看到一个红点。

![](/images/30bf6573ae356fbcebe10a74625c60ea.png)

然后使用unicode进行解析，发现unicode是\u2028。

经过百度发现了解决办法。

最后解决的办法很简单：

```php
/**
 * 替换字符串 处理Zp(\u2028)段落分隔符，Zl(\u2029)行分隔符
 *
 * @param $value
 */

function filterWord(&amp;$value) {
    if (is_string($value)) {
        $value =  preg_replace(&#039;/[\p{Zp}\p{Zl}]+/u&#039;,&#039;&#039;,$value);
    }
}
```

参考链接：

- http://www.yongxiang.me/2017/03/05/201703/special-character/
