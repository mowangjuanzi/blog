---
title: 安卓适配
date: 2018-11-13 17:51:58
tags:
- android
- sentry
categories:
- 编程语言
- android
---
今天下午一直在跟安卓调试sentry适配问题。发现了两个问题。现在记录如下：

## 红米一直安装不上APP

在开发的时候，发现红米一直安装不上APP。经过百度查询，发现是在开发设置中打开了**启用MIUI优化**设置，将其关掉，然后重启，然后接着开启**USB安装**，之前因为一直没网，没有注意这个，导致一些隐性的bug没有展示出来，粗心啊。

## 安装页面没有DSN信息

一般在安装页面都会介绍DSN信息，但是安卓病没有提示，顿时不知道这个URL应该去哪找到了，在翻了好久之后，终于找到了位置。

路径为: Project details -> Settings -> Client Keys(DSN)

在这里面就可以拿到相关的DSN信息。

## 官网提供的SDK不可用

这个问题就非常坑了。官网提供的SDK根本不可用，最后我们各种谷歌之后，终于发现了问题，原来该SDK已经在2013年就不维护了，必须转而使用raven-java。

现在粘贴相关代码：

Gradle

```
compile 'com.getsentry.raven:raven-android:8.0.1' # 实测compile不可用，必须替换为 api
```

Permissions

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

实例化

```java
import com.getsentry.raven.android.Raven;

Context ctx = this.getApplicationContext();
Raven.init(ctx, "YOUR-SENTRY-DSN");
```

捕获错误

```java
try {
    String json = "['a']";
    JSONObject jsonObject = new JSONObject(json); // 示例错误
} catch (Exception e) {
    Sentry.capture(e);
}
```

在测试过程中发现，接收到的错误信息有时候很及时，有时候就非常慢。推测可能是因为APP崩溃退出了，导致错误信息没有及时发出，所以会在下一次APP启动的时候，将相关的错误数据送出， 这样导致sentry接收到错误消息的时间较晚。

## 参考URL

- https://www.rokkincat.com/blog/2017/05/01/sentry-android-deprecation
- https://docs.sentry.io/clients/java/modules/android/ 这个是官方地址，但是实际上该SDK不可用。
