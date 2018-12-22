---
title: mac 登录阿里云
date: 2018-11-15 11:03:51
tags:
---
在windows环境中，我们都是可以通过xshell实现证书登录的。

但是在mac中却没有相关的设置，那么如何使用mac进行证书登录呢。

首先，我们需要有一个私钥文件。

比如我的是aliyun.pem.

我将其存放在`/home/baoguoxiao/aliyun.pem`。

登录的命令则是如下这条:

```bash
ssh -i /home/baoguoxiao/aliyun.pem root@ip
```

执行该命令的时候可能会提示如下错误:

```bash
Permissions 0755 for '/home/baoguoxiao/aliyun.pem' are too open.
```

这个表示我们给与这个文件的权限太大了，所以需要对其设置只读权限。

执行如下命令：

```bash
chmod 400 /home/baoguoxiao/aliyun.pem
```

然后再次使用如上的`ssh`命令，就可以顺利的登录阿里云服务器了。

这样真的好棒。妈妈再也不用担心我的学习。

## 参考

- https://stackoverflow.com/questions/9270734/ssh-permissions-are-too-open-error
