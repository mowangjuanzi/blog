---
title: jq将form 表单数据转为object
date: 2017-11-17 16:26:22
tags:
- javascript
- jquery
categories:
- 编程语言
- javascript
- jquery
---
我平常上传数据都是使用`$(this).serialize()`，但是这次我需要使用上传数据的对象。结果这个方法给我转成了字符串。特别不方便。于是找到一个插件。就可以实现，获取的时候，获取到的是对象而不是字符串了。

首先，我们先加载jquery;

````html
<script src="http://cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script>
````

然后在后面写一个js方法就好了：

````html
<script type="text/javascript">
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
</script>
````

这样我们直接就可以获取对象了：

````js
$(form).serializeObject();
````

这样我们获取到的数据直接就是对象了。

> 参考资料：

- http://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
- http://www.thinksaas.cn/topics/0/345/345610.html
