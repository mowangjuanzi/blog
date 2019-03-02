---
title: javascript将html实体转回
date: 2018-11-13 18:11:06
tags:
- javascript
- html
categories:
- 编程语言
- javascript
---
有时候我们可能需要向html中传递html代码。但是因为我们的后台框架使用了laravel。所以我们在赋值的时候就会变成:

```html
{{$username}}
```

虽然我们使用自带的非转义的赋值方法：

```html
{!! $username !!}
```

但是我的需求却是不能使用后面的这类方法。

通过谷歌，我了解到一种完美的办法，可以将转义后的代码再次转回来。

代码如下：

```javascript
function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}
```

我们只需要调用该方法就可以完美执行反转义了：

```javascript
htmlDecode("&lt;img src='myimage.jpg'&gt;"); 
// returns "<img src='myimage.jpg'>"
```

## 参考

- https://css-tricks.com/snippets/javascript/unescape-html-in-js/
