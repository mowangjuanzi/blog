---
title: 计算机基础知识回顾
date: 2018-01-28 00:08:12
tags: 
- 计算机基础
- 转码
- 反码
- 补码
- 次方
- 进制
categories:
- 计算机基础
- 数学
---
## 次方

设定a为某数，n为负整数。那么a的n次方则就表示为 1除以 a的n次方。

$$
a ^ n = 1 / a ^ n
$$

举例：10的-2次方就等于1除以10的平方，那么值就等于1/100，结果为0.01。

## 进制转换

整数部分十进制转二进制（除以2逆向取余法）：

$$
108_{10} = 1 * 2^6 + 1 * 2^5 + 0 * 2^4 + 1 * 2^3 + 1 * 2^2 + 0 * 2^1 + 0 * 2^0
$$

计算方法：


108 / 2 = 54 ... 0  
54 / 2 = 27 ... 0  
27 / 2 = 13 ... 1  
13 / 2 = 6 ... 1  
6 / 2 = 3 ... 0  
3 / 2 = 1 ... 0  
1 / 2 = 0 ... 1  

然后我们将上面的余数按照从下往上进行取数。即可得出 $$ 108_{10} = 1001100_2 $$ 。

小数部分十进制转二进制（乘以2顺向取整法）：

0.875 * 2 = 1.75
0.75 * 2 = 1.5
0.5 * 2 = 1

我们可以查看以上的计算公式，对初始小数乘以2，当数值超过1时，继续将小数部分乘以2，一直到数值正好为1。

我们通过观察以上公式即可得出 $$ 0.875_{10} = 0.111_2 $$

## 原码，反码，补码

原码是一种计算机对二进制数字的表示方式。其中最高位为符号位。符号位0表示正数，符号位1表示负数。

反码是对原码进行取反。如果机器数是正数，那么反码与原码相同，如果是负数则对除符号位的其他位进行取反。

补码则是如果机器数整数则补码和原码相同，如果是负数，那么补码就是对除符号位的其他位进行取反，并且在末位+1。