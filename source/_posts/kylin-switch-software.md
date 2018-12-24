---
title: 我的电脑系统换成了linux之系统选择和软件安装篇
date: 2017-11-25 09:41:21
tags:
---
我在公司的时候，无意中安装的优麒麟，觉得UI还是比较不错的，而且字体的显示我还是比较喜欢的。正好我也想尝试将我的电脑系统换成了linux，朋友说我这种行为就是在作死，还说祝我好运。嘿嘿，死不了的。

我想，其实是这样的，因为没有办法正常使用windows的一系列软件，比如QQ。其实也就是QQ了，其他的软件都有办法进行替代，但是通讯工具，只有这一个，你没办法换，我也挺好奇为啥QQ 就是不能出一个linux版的。如果出一个linux版的，估计会让中国的linux大幅度发展的。

吐嘈太多没用，还是记录一下我自己安装的情况把。

首先就是执行下面的命令将系统更新到最新。

```shell
sudo apt update
sudo apt upgrade
```

更新了之后，正常就是正常的安装安装软件环节了。

我安装了phpstorm。sublime，以及网易云音乐，至少这三个软件不用寻找替代版了。

同时寻找在linux上替代windows的软件。

首先是有道云笔记，因为我使用的是火狐浏览器，但是有道云笔记的web版结果只有老版的支持，结果我登录进去，发现保存的东西已经不是我最新的东西了。

所以逐而放弃，从而寻找新的工具，后来找到[Simplenote](https://simplenote.com/)，下载了一个尝试了一下，发现非常简洁，没有多余的功能，而且支持markdown。非常方便。

在此记录一下sublime的安装方式。非常简单。

```shell
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list
sudo apt-get update
sudo apt-get install sublime-text
```
执行上面的一套组合拳，嗖嗖的就能安装上sublime了。

sublime text 的 package control 安装可参考我 {% post_link sublime-text-3-install-package-control %i}。

好了，零散记录一下，先记录这些。


