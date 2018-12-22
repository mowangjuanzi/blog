---
title: vim设置tab为四个空格
date: 2018-01-06 00:06:08
tags:
---
其实非常简单。

首先我们编辑**~/.vimrc**文件。新增以下内容：

````
set ts=4
set expandtab
````

然后保存。

重启之后使用tab就是四个空格了。
