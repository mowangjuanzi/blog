---
title: sudo 免密码
date: 2018-07-14 18:58:31
tags:
---
使用ubuntu时间长了经常会使用sodo，发现这样非常麻烦，那如何让sudo免密码呢？

其实方法很简单。首先执行以下命令：

```bash
sudo visudo
```

我这边是使用nano打开了一个配置文件，然后找到下面这行：

```ini
%sudo   ALL=(ALL:ALL) ALL
```

在最后ALL的前面加上`NOPASSWD:`就可以了。i加入是这样的：

```ini
%sudo   ALL=(ALL:ALL) NOPASSWD:ALL
```

然后同时按住`Ctrl+X`，退出保存就好了。
