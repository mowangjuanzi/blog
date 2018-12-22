---
title: ubuntu安装lrzsz
date: 2018-11-11 21:29:08
tags:
---
lrzsz命令是非常好用的一个命令。

这个命令可以支持我们在xshell中进行文件的上传和下载操作。

但是默认执行

```bash
$ sudo apt install lrzsz 
Reading package lists... Done
Building dependency tree       
Reading state information... Done
E: Unable to locate package lrzsz
```

出现了找不到包的错误。

发现解决的办法很简单。

```bash
sudo add-apt-repository universe
```

新增了这个源之后，我们重新执行安装命令之后就可以了。

```bash
sudo apt install lrzsz
```

end.
