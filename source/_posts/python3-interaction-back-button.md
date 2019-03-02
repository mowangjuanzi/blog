---
title: centos上Python3交互模式无法使用后退键
date: 2017-11-17 16:25:04
tags:
- pip
- python
- centos
categories:
- 编程语言
- python
- pip
---
最近在CentOS（7.2）上安装了Python3用来学习，在进入交互模式之后，发现无法使用后退键。这特别的不方便。可以使用以下方法来解决问题：

首先安装一个包：

````shell
yum install patch ncurses ncurses-devel
````

然后使用pip安装包：

````shell
pip3 install readline
````

安装完成以后，我们就可以正常使用python了。也可以使用后退键和方向键了。
