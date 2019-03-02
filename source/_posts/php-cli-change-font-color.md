---
title: php-cli 改变输出的字体颜色
date: 2017-11-17 16:33:01
tags:
- php
- bash
- cli
categories:
- 编程语言
- php
---
> 我只会用，不清楚原理。  
>
> 再次感谢军哥的[一键linux](https://lnmp.org/)安装包，我是从它的安装包中借鉴的代码

直接上代码，大家自行测试即可。

````php
function color_red($str = ''){
	echo "\e[0;31m{$str}\e[0m" . "\n";
}
function color_green($str = ''){
	echo "\e[0;32m{$str}\e[0m" . "\n";
}
function color_yellow($str = ''){
	echo "\e[0;33m{$str}\e[0m" . "\n";
}
function color_blue($str = ''){
	echo "\e[0;34m{$str}\e[0m" . "\n";
}
color_red('red');
color_green('green');
color_yellow('yellow');
color_blue('blue');
````

注意，以上代码请在shell环境中执行。
