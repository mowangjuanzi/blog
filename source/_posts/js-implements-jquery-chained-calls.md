---
title: 原生JS实现jQuery的链式调用
date: 2018-07-07 22:37:52
tags:
---
其实在我们学习使用jQuery的过程中，我们经常是这样使用的：

```js
$("html").css();
$.get("/abc", function(){})
```

发现特别好用，而我在前段时间处理webview的时候，也多次使用到js，并且对于使用原生JS感到稍有不便。所以想到将其封装成类库，然后供以后进行重复使用或者优化。

那么如何去实现如何jQuery的方法呢。

其实代码很简单，我也是门外汉，记录下来也是为我自己做一个学习的方式，希望如果有更好的方式可以跟我说。

```js
function gc() {
    return new gc.fn.abc();
}

gc.fn = gc.prototype = {
    abc: function () {
        this.__proto__ = gc.fn;
        return this;
    },
    de: function () {
        console.log('def');
    }
}
gc.aaa = function () {
    console.log('aaa');
}

gc();
gc().de();
gc.aaa();
```
