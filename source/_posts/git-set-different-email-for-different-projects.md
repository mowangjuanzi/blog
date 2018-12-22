---
title: git为不同的项目设置不同的邮箱
date: 2018-07-01 12:01:35
tags:
---
在我们使用Git开发项目的时候，可能经常会碰到个人和公司开发的项目都在一台机器上的情况。不管你们有没有，反正我是碰到了。因为公司有公司自己分配的邮箱，而我自己喜欢用自己的邮箱开发自己的项目。这样可能会导致邮箱混用的情况。

比如我们之前设置的命令是：

```bash
git config --global user.name &quot;aaa&quot;
git config --global user.email &quot;a@b.com&quot;
```

这样的话，就会像是上面说的不同的项目使用一个邮箱。

但是如果我应该如何为不同的项目设置不同的用户呢。其实很简单，就是把命令中的`--global`给去掉就好了。因为`--global`代表的就是全局化的意思。命令如下：

```bash
git config user.name &quot;aaa&quot;
git config user.email &quot;a@b.com&quot;
```

是不是很简单？
