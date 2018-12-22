---
title: react-native首次运行项目
date: 2018-09-27 22:47:01
tags:
---
这两天一直在看react。今天正好想着安装 react-native ，看看传说中的用JS写APP能用嘛。

接下来就是介绍使用情况。首先就是搭建NodeJS和JAVA环境。

创建项目：

```bash
react-native init fiction
cd fiction
react-native run-android
```

当然中间第一次运行的时候会去谷歌下载一些包。这些就不表了。

接下来主要是表述一下中间遇到的坑。

## unable to load script from assets 'index.android.bundle'

其实解决的办法很简单：

首先在`android/app/src/main`创建`assets`文件夹，然后执行以下命令：

```bash
yarn add @babel/runtime --dev

react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

执行完成后，再次执行`react-native run-android`就能看到美丽的开机页面了。
