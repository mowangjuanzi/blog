---
title: xls数据导出会内存溢出
date: 2018-08-09 10:54:48
tags:
---
我们在后台开发的时候，经常会碰到数据导出。我们一般都是试用xls格式进行导出。但是有个问题，就是使用类库对内存的占用特别的大。结果稍微复杂一些的数据就会导致内存溢出。

那么应该如何解决呢？

其实换个思路。也就是说，如果格式不复杂的话，我们可以导出csv格式的数据。

PHP已经内置了对这个格式的处理。其中使用的函数就是：

- [fputcsv()](http://php.net/manual/zh/function.fputcsv.php)

其实使用方法很简单我就不用写范例了。就把php的示例搬过来吧。

```php
<?php

$list = array (
    array('aaa', 'bbb', 'ccc', 'dddd'),
    array('123', '456', '789'),
    array('"aaa"', '"bbb"')
);

$fp = fopen('file.csv', 'w');

foreach ($list as $fields) {
    fputcsv($fp, $fields);
}

fclose($fp);
?>
```

输出的内容如下：

```text
aaa,bbb,ccc,dddd
123,456,789
"""aaa""","""bbb"""

```

上面这种是写入文件的，评论第一的说的是如何直接进行输出。他的原理是写入到php的输出中。

```php
<?php
$out = fopen('php://output', 'w');
fputcsv($out, array('this','is some', 'csv "stuff", you know.'));
fclose($out);
?>
```

这么一看的话，导出xls是不是就简单了很多呢。
