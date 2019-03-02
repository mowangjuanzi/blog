---
title: sentry笔记整理
date: 2018-11-07 17:37:21
tags:
- sentry
categories:
- 工具
- sentry
---
## 简介

开源错误跟踪，帮助开发人员实时监控和修复崩溃。不断重复。提高效率。改善用户体验。

## 特性

- 相同错误合并
- 定制规则进行邮件通知
- 支持导入sourcemap自动解析和还原代码
- 多项目，多用户
- 友好的Web界面
- 支持主流的语言接口
- 权限管理
- 敏感信息过滤
- 受影响用户统计
- WEB可视化设置，功能强大
- ...

## 部署

使用docker-compose命令一键进行部署。减少部署的错误率。

具体部署程序可查看[getsentry/onpremise](https://github.com/getsentry/onpremise)

使用nginx接受请求并对其进行转发。并使用了`ngx_http_realip_module`模块转发真实请求IP。

## 流程

sentry分为客户端和服务端。客户端嵌入到App中，当应用发生异常的情况时，就会向服务器端发送异常通知，服务器端则将信息记录到数据库汇总，并提供web方式，方便对异常进行查看和分析，避免需要登录服务器后台查看生硬的log文件。

## 收集日志

- 客户端运行错误日志
	- Android
	- IOS
	- HTML
- 服务器端项目运行错误日志
	- PHP
- Web环境错误日志
	- PHP-fPM错误日志
	- Nginx错误日志

目前的日志捕获，都有相应的SDK，非常方便，不同的是客户端因为有代码混淆，所以，需要在sentry中上传相应sourcemap文件。

目前的PHP-FPM和Nginx错误日志没有现成的代码，这里需要一些时间进行编写代码处理相关错误。

## 适配

目前sentry有很多的SDK包。目前已经覆盖咱们产品线的有：

- Android
- Swift
- Objective-C
- JavaScript
- PHP
- Laravel
- ...

## 组织架构

**角色**

| 行为[Action] | 会员[Member] | 管理员[Admin] | 经理[Manager] | 所有者[Owner ] |
|:---:|:---:|:---:|:---:|:---:|
|Can view and act on issues, such as assigning/resolving/etc.|✔️|✔️|✔️|✔️|
|可以加入和离开团队[Can join and leave teams]|✔️|✔️|✔️|✔️|
|可以修改项目设置[Can change Project Settings]||✔️|✔️|✔️|
|可以添加/删除项目[Can add/remove projects]||✔️|✔️|✔️|
|可以编辑全局集成[Can edit Global Integrations]|||✔️|✔️|
|可以添加/删除/修改成员[Can add/remove/change members]|||✔️|✔️|
|可以添加/删除团队[Can add/remove teams]|||✔️|✔️|
|可以添加仓库[Can add Repositories]|||✔️|✔️|
|可以改变组织设置[Can change Organization Settings]|||✔️|✔️|
|可以移除一个组织[Can remove an Organization]||||✔️|

***归属关系***

一个组织对应多个团队
一个团队对应多个项目
一个团队对应多个会员
一个会员属于多个团队
一个项目属于一个团队

## 邮件通知

默认情况下，一旦异常发生，5分钟内就会有一封邮件发送到你的邮箱。包含了异常的大致描述。

目前的默认规则是当出现一个新的规则时候，30分钟内发送一次邮件通知。

对于发送邮件的规则可以进行新增/编辑/移除。

## 限制

- 不能作为日志的替代品。
sentry主要是为让我们专注于系统和程序的异常信息，提高排查效率，日志事件的量达到一个限制值的时候可能还会丢弃一些内容。官方也提倡正确设置sentry接收的日志level的等级时，也能继续旧的日志备份。
- 不是排查的万能工具
sentry是带有问题聚合功能的分析工具，所以如果样本提供的内容不全面。日志记录的质量不高的情况，对于错误的快速排查，可能没有实质性的帮助。
- 不能作为传统监控的替代品
与传统监控系统相比，sentry更依赖发出的日志报告，而另外一些隐藏的逻辑问题或者业务问题可能不会得到反馈的。
