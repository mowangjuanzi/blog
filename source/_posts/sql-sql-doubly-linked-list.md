---
title: SPL标准库之SplDoublyLinkedList（双向链表）
date: 2017-11-17 16:28:13
tags:
- php
- sql
- SplDoublyLinkedList
categories:
- 编程语言
- php
---
双向链表其实就是数据本身具备了左边和右边的双向指针。类似Redis的列表，它就是双向链表。

我们现在就学习一下SPL内置的SplDoublyLinkedList类。

首先介绍一下这个类都有哪些方法：

````php
// 实例化方法
$dll = new SplDoublyLinkedList();

//尾部增加数据,类似array_push()方法
$dll->push($value);
//开头插入数据,类似array_unshift()方法
$dll->unshift($value);

//检测指定位置是否存在值,类似array_key_exists()方法
$dll->offsetExists($key);
//获取指定位置的值,类似$dll[$key]
$dll->offsetGet($key);
//修改指定位置的值,类似$dll[$key] = $value
$dll->offsetSet($key, $value);
//删除指定位置的值,类似unset($dll[$key])
$dll->offsetUnset($key);

//获取双向链表中值的数量
$dll->count();
//检测双向链表是否为空
$dll->isEmpty();

//序列化存储,类似serialize()
$dll->serialize();
//存储反序列化类似unserialize()
$dll->unserialize($str);

//设置迭代器模式
$dll->setIteratorMode($mode);
//获取迭代器模式
$dll->getIteratorMode();

//初始化链表,只有先执行此方法，才能使用操作游标的方法
$dll->rewind();
//获取当前游标的索引
$dll->key();
//获取当前游标的值
$dll->current();
//将游标移动到下一个节点
$dll->next();
//将游标移动到上一个节点
$dll->prev();
//检测当前游标后面是否还有节点
$dll->valid();

//返回第一个节点的值
$dll->bottom();
//返回最后一个节点的值
$dll->top();

//将双向链表中的最后一个节点弹出,类似array_pop()
$dll->pop();
//将双向链表中的第一个节点弹出,类似array_shift()
$dll->shift();

//在双向链表的指定位置插入值
$dll->add($index, $value);
````

## Iterator 模式

- 迭代的方向：
    - `SplDoublyLinkedList::IT_MODE_LIFO` (堆栈 style)
    - `SplDoublyLinkedList::IT_MODE_FIFO` (队列 style)
- 迭代器的行为
    - `SplDoublyLinkedList::IT_MODE_DELETE` (元素由迭代器删除)
    - `SplDoublyLinkedList::IT_MODE_KEEP` (元素由迭代器遍历)

默认模式是：`SplDoublyLinkedList::IT_MODE_FIFO | SplDoublyLinkedList::IT_MODE_KEEP`
