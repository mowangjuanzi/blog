---
title: 记Python中一个编码的错误
date: 2017-11-17 16:31:09
tags:
---
> 提示：这个应该仅仅是在Python2中出现这个问题。因为Python2的默认编码是`ascii`，Python3的默认编码已经编程了`utf-8`。

我在Linux中使用make html的时候，提示：

````python
UnicodeDecodeError: 'ascii' codec can't decode byte 0xe5 in position 0: ordinal not in range(128)
````

一直不知道是什么原因，通过查阅一个资料，才知道，原来是编码问题。

字符串在进行unicode的时候，要使用什么编码格式进行转换呢？utf-8？gb2312？utf-16？这个时候就要根据 `sys.getdefaultencoding()`来确定了。而`sys.getdefaultencoding()`是`ascii`编码，在ascii字符表中不存在0xe5这种大于128的字符存在。所以当然会报错。

可以这样修改：

````python
#coding:utf-8
import sys 
reload(sys) 
sys.setdefaultencoding("utf-8")
````

而因为我是使用的make html，通过查找，发现是`/usr/bin/sphinx-build`这个文件在捣鬼。所以我修改这个文件就好了。

````python
#!/usr/bin/python

# -*- coding: utf-8 -*-
import re
import sys
reload(sys) #新添加的
sys.setdefaultencoding("utf-8") #新添加的
from sphinx import main

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw|\.exe)?$', '', sys.argv[0])
    sys.exit(main())
````

这样就正常了。

> http://my.oschina.net/leejun2005/blog/74430
