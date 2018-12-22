---
title: awk中执行mv命令
date: 2018-02-03 09:40:30
tags:
---
我现在有一个thinkphp文件夹，我需要将文件夹下面所有的**.class.php**修改为**.php**

我的执行方法是：

```bash
find ./thinkphp2 -name *.class.php | awk -F "class." '{print "mv "$0 " " $1$2}' | sh
```

这句话的作用就是首先我们先找出所有文件夹里面后缀名为**.class.php**的文件，执行结果如下：

```bash
baoguoxiao@192:~/windows$ find ./thinkphp2 -name *.class.php
./thinkphp2/ThinkPHP/Library/Behavior/AgentCheckBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/BorisBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/BrowserCheckBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/BuildLiteBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/CheckActionRouteBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/CheckLangBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/ChromeShowPageTraceBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/ContentReplaceBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/CronRunBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/FireShowPageTraceBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/ParseTemplateBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/ReadHtmlCacheBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/RobotCheckBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/ShowPageTraceBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/ShowRuntimeBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/TokenBuildBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/UpgradeNoticeBehavior.class.php
./thinkphp2/ThinkPHP/Library/Behavior/WriteHtmlCacheBehavior.class.php
./thinkphp2/ThinkPHP/Library/Org/Net/Http.class.php
./thinkphp2/ThinkPHP/Library/Org/Net/IpLocation.class.php
./thinkphp2/ThinkPHP/Library/Org/Util/ArrayList.class.php
./thinkphp2/ThinkPHP/Library/Org/Util/CodeSwitch.class.php
./thinkphp2/ThinkPHP/Library/Org/Util/Date.class.php
./thinkphp2/ThinkPHP/Library/Org/Util/Rbac.class.php
./thinkphp2/ThinkPHP/Library/Org/Util/Stack.class.php
./thinkphp2/ThinkPHP/Library/Org/Util/String.class.php
./thinkphp2/ThinkPHP/Library/Think/App.class.php
./thinkphp2/ThinkPHP/Library/Think/Auth.class.php
./thinkphp2/ThinkPHP/Library/Think/Behavior.class.php
./thinkphp2/ThinkPHP/Library/Think/Build.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Apachenote.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Apc.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Db.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Eaccelerator.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/File.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Memcache.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Memcached.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Memcachesae.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Redis.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Shmop.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Sqlite.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Wincache.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Xcache.class.php
./thinkphp2/ThinkPHP/Library/Think/Cache.class.php
./thinkphp2/ThinkPHP/Library/Think/Controller/HproseController.class.php
./thinkphp2/ThinkPHP/Library/Think/Controller/JsonRpcController.class.php
./thinkphp2/ThinkPHP/Library/Think/Controller/RestController.class.php
./thinkphp2/ThinkPHP/Library/Think/Controller/RpcController.class.php
./thinkphp2/ThinkPHP/Library/Think/Controller/YarController.class.php
./thinkphp2/ThinkPHP/Library/Think/Controller.class.php
./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Base64.class.php
./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Crypt.class.php
./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Des.class.php
./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Think.class.php
./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Xxtea.class.php
./thinkphp2/ThinkPHP/Library/Think/Crypt.class.php
./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Firebird.class.php
./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Mongo.class.php
./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Mysql.class.php
./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Oracle.class.php
./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Pgsql.class.php
./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Sqlite.class.php
./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Sqlsrv.class.php
./thinkphp2/ThinkPHP/Library/Think/Db/Driver.class.php
./thinkphp2/ThinkPHP/Library/Think/Db/Lite.class.php
./thinkphp2/ThinkPHP/Library/Think/Db.class.php
./thinkphp2/ThinkPHP/Library/Think/Dispatcher.class.php
./thinkphp2/ThinkPHP/Library/Think/Exception.class.php
./thinkphp2/ThinkPHP/Library/Think/Hook.class.php
./thinkphp2/ThinkPHP/Library/Think/Image/Driver/Gd.class.php
./thinkphp2/ThinkPHP/Library/Think/Image/Driver/GIF.class.php
./thinkphp2/ThinkPHP/Library/Think/Image/Driver/Imagick.class.php
./thinkphp2/ThinkPHP/Library/Think/Image.class.php
./thinkphp2/ThinkPHP/Library/Think/Log/Driver/File.class.php
./thinkphp2/ThinkPHP/Library/Think/Log/Driver/Sae.class.php
./thinkphp2/ThinkPHP/Library/Think/Log.class.php
./thinkphp2/ThinkPHP/Library/Think/Model/AdvModel.class.php
./thinkphp2/ThinkPHP/Library/Think/Model/MergeModel.class.php
./thinkphp2/ThinkPHP/Library/Think/Model/MongoModel.class.php
./thinkphp2/ThinkPHP/Library/Think/Model/RelationModel.class.php
./thinkphp2/ThinkPHP/Library/Think/Model/ViewModel.class.php
./thinkphp2/ThinkPHP/Library/Think/Model.class.php
./thinkphp2/ThinkPHP/Library/Think/Page.class.php
./thinkphp2/ThinkPHP/Library/Think/Route.class.php
./thinkphp2/ThinkPHP/Library/Think/Session/Driver/Db.class.php
./thinkphp2/ThinkPHP/Library/Think/Session/Driver/Memcache.class.php
./thinkphp2/ThinkPHP/Library/Think/Session/Driver/Mysqli.class.php
./thinkphp2/ThinkPHP/Library/Think/Storage/Driver/File.class.php
./thinkphp2/ThinkPHP/Library/Think/Storage/Driver/Sae.class.php
./thinkphp2/ThinkPHP/Library/Think/Storage.class.php
./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Ease.class.php
./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Lite.class.php
./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Mobile.class.php
./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Smart.class.php
./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Smarty.class.php
./thinkphp2/ThinkPHP/Library/Think/Template/TagLib/Cx.class.php
./thinkphp2/ThinkPHP/Library/Think/Template/TagLib/Html.class.php
./thinkphp2/ThinkPHP/Library/Think/Template/TagLib.class.php
./thinkphp2/ThinkPHP/Library/Think/Template.class.php
./thinkphp2/ThinkPHP/Library/Think/Think.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs/bcs.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs/mimetypes.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs/requestcore.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Ftp.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Local.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Qiniu/QiniuStorage.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Qiniu.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Sae.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Upyun.class.php
./thinkphp2/ThinkPHP/Library/Think/Upload.class.php
./thinkphp2/ThinkPHP/Library/Think/Verify.class.php
./thinkphp2/ThinkPHP/Library/Think/View.class.php
./thinkphp2/ThinkPHP/Library/Vendor/Smarty/Smarty.class.php
./thinkphp2/ThinkPHP/Library/Vendor/Smarty/SmartyBC.class.php
./thinkphp2/ThinkPHP/Mode/Api/App.class.php
./thinkphp2/ThinkPHP/Mode/Api/Controller.class.php
./thinkphp2/ThinkPHP/Mode/Api/Dispatcher.class.php
./thinkphp2/ThinkPHP/Mode/Lite/App.class.php
./thinkphp2/ThinkPHP/Mode/Lite/Controller.class.php
./thinkphp2/ThinkPHP/Mode/Lite/Dispatcher.class.php
./thinkphp2/ThinkPHP/Mode/Lite/Model.class.php
./thinkphp2/ThinkPHP/Mode/Lite/View.class.php
```

接下来我们对文件内容进行拆分，然后组合成正确的文件。

```bash
baoguoxiao@192:~/windows$ find ./thinkphp2 -name *.class.php | awk -F ".class" '{print "mv " $0 " " $1$2}'
mv ./thinkphp2/ThinkPHP/Library/Behavior/AgentCheckBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/AgentCheckBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/BorisBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/BorisBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/BrowserCheckBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/BrowserCheckBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/BuildLiteBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/BuildLiteBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/CheckActionRouteBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/CheckActionRouteBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/CheckLangBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/CheckLangBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/ChromeShowPageTraceBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/ChromeShowPageTraceBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/ContentReplaceBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/ContentReplaceBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/CronRunBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/CronRunBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/FireShowPageTraceBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/FireShowPageTraceBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/ParseTemplateBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/ParseTemplateBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/ReadHtmlCacheBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/ReadHtmlCacheBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/RobotCheckBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/RobotCheckBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/ShowPageTraceBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/ShowPageTraceBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/ShowRuntimeBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/ShowRuntimeBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/TokenBuildBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/TokenBuildBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/UpgradeNoticeBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/UpgradeNoticeBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Behavior/WriteHtmlCacheBehavior.class.php ./thinkphp2/ThinkPHP/Library/Behavior/WriteHtmlCacheBehavior.php
mv ./thinkphp2/ThinkPHP/Library/Org/Net/Http.class.php ./thinkphp2/ThinkPHP/Library/Org/Net/Http.php
mv ./thinkphp2/ThinkPHP/Library/Org/Net/IpLocation.class.php ./thinkphp2/ThinkPHP/Library/Org/Net/IpLocation.php
mv ./thinkphp2/ThinkPHP/Library/Org/Util/ArrayList.class.php ./thinkphp2/ThinkPHP/Library/Org/Util/ArrayList.php
mv ./thinkphp2/ThinkPHP/Library/Org/Util/CodeSwitch.class.php ./thinkphp2/ThinkPHP/Library/Org/Util/CodeSwitch.php
mv ./thinkphp2/ThinkPHP/Library/Org/Util/Date.class.php ./thinkphp2/ThinkPHP/Library/Org/Util/Date.php
mv ./thinkphp2/ThinkPHP/Library/Org/Util/Rbac.class.php ./thinkphp2/ThinkPHP/Library/Org/Util/Rbac.php
mv ./thinkphp2/ThinkPHP/Library/Org/Util/Stack.class.php ./thinkphp2/ThinkPHP/Library/Org/Util/Stack.php
mv ./thinkphp2/ThinkPHP/Library/Org/Util/String.class.php ./thinkphp2/ThinkPHP/Library/Org/Util/String.php
mv ./thinkphp2/ThinkPHP/Library/Think/App.class.php ./thinkphp2/ThinkPHP/Library/Think/App.php
mv ./thinkphp2/ThinkPHP/Library/Think/Auth.class.php ./thinkphp2/ThinkPHP/Library/Think/Auth.php
mv ./thinkphp2/ThinkPHP/Library/Think/Behavior.class.php ./thinkphp2/ThinkPHP/Library/Think/Behavior.php
mv ./thinkphp2/ThinkPHP/Library/Think/Build.class.php ./thinkphp2/ThinkPHP/Library/Think/Build.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Apachenote.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Apachenote.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Apc.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Apc.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Db.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Db.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Eaccelerator.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Eaccelerator.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/File.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/File.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Memcache.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Memcache.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Memcached.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Memcached.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Memcachesae.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Memcachesae.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Redis.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Redis.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Shmop.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Shmop.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Sqlite.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Sqlite.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Wincache.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Wincache.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Xcache.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache/Driver/Xcache.php
mv ./thinkphp2/ThinkPHP/Library/Think/Cache.class.php ./thinkphp2/ThinkPHP/Library/Think/Cache.php
mv ./thinkphp2/ThinkPHP/Library/Think/Controller/HproseController.class.php ./thinkphp2/ThinkPHP/Library/Think/Controller/HproseController.php
mv ./thinkphp2/ThinkPHP/Library/Think/Controller/JsonRpcController.class.php ./thinkphp2/ThinkPHP/Library/Think/Controller/JsonRpcController.php
mv ./thinkphp2/ThinkPHP/Library/Think/Controller/RestController.class.php ./thinkphp2/ThinkPHP/Library/Think/Controller/RestController.php
mv ./thinkphp2/ThinkPHP/Library/Think/Controller/RpcController.class.php ./thinkphp2/ThinkPHP/Library/Think/Controller/RpcController.php
mv ./thinkphp2/ThinkPHP/Library/Think/Controller/YarController.class.php ./thinkphp2/ThinkPHP/Library/Think/Controller/YarController.php
mv ./thinkphp2/ThinkPHP/Library/Think/Controller.class.php ./thinkphp2/ThinkPHP/Library/Think/Controller.php
mv ./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Base64.class.php ./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Base64.php
mv ./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Crypt.class.php ./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Crypt.php
mv ./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Des.class.php ./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Des.php
mv ./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Think.class.php ./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Think.php
mv ./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Xxtea.class.php ./thinkphp2/ThinkPHP/Library/Think/Crypt/Driver/Xxtea.php
mv ./thinkphp2/ThinkPHP/Library/Think/Crypt.class.php ./thinkphp2/ThinkPHP/Library/Think/Crypt.php
mv ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Firebird.class.php ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Firebird.php
mv ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Mongo.class.php ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Mongo.php
mv ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Mysql.class.php ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Mysql.php
mv ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Oracle.class.php ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Oracle.php
mv ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Pgsql.class.php ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Pgsql.php
mv ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Sqlite.class.php ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Sqlite.php
mv ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Sqlsrv.class.php ./thinkphp2/ThinkPHP/Library/Think/Db/Driver/Sqlsrv.php
mv ./thinkphp2/ThinkPHP/Library/Think/Db/Driver.class.php ./thinkphp2/ThinkPHP/Library/Think/Db/Driver.php
mv ./thinkphp2/ThinkPHP/Library/Think/Db/Lite.class.php ./thinkphp2/ThinkPHP/Library/Think/Db/Lite.php
mv ./thinkphp2/ThinkPHP/Library/Think/Db.class.php ./thinkphp2/ThinkPHP/Library/Think/Db.php
mv ./thinkphp2/ThinkPHP/Library/Think/Dispatcher.class.php ./thinkphp2/ThinkPHP/Library/Think/Dispatcher.php
mv ./thinkphp2/ThinkPHP/Library/Think/Exception.class.php ./thinkphp2/ThinkPHP/Library/Think/Exception.php
mv ./thinkphp2/ThinkPHP/Library/Think/Hook.class.php ./thinkphp2/ThinkPHP/Library/Think/Hook.php
mv ./thinkphp2/ThinkPHP/Library/Think/Image/Driver/Gd.class.php ./thinkphp2/ThinkPHP/Library/Think/Image/Driver/Gd.php
mv ./thinkphp2/ThinkPHP/Library/Think/Image/Driver/GIF.class.php ./thinkphp2/ThinkPHP/Library/Think/Image/Driver/GIF.php
mv ./thinkphp2/ThinkPHP/Library/Think/Image/Driver/Imagick.class.php ./thinkphp2/ThinkPHP/Library/Think/Image/Driver/Imagick.php
mv ./thinkphp2/ThinkPHP/Library/Think/Image.class.php ./thinkphp2/ThinkPHP/Library/Think/Image.php
mv ./thinkphp2/ThinkPHP/Library/Think/Log/Driver/File.class.php ./thinkphp2/ThinkPHP/Library/Think/Log/Driver/File.php
mv ./thinkphp2/ThinkPHP/Library/Think/Log/Driver/Sae.class.php ./thinkphp2/ThinkPHP/Library/Think/Log/Driver/Sae.php
mv ./thinkphp2/ThinkPHP/Library/Think/Log.class.php ./thinkphp2/ThinkPHP/Library/Think/Log.php
mv ./thinkphp2/ThinkPHP/Library/Think/Model/AdvModel.class.php ./thinkphp2/ThinkPHP/Library/Think/Model/AdvModel.php
mv ./thinkphp2/ThinkPHP/Library/Think/Model/MergeModel.class.php ./thinkphp2/ThinkPHP/Library/Think/Model/MergeModel.php
mv ./thinkphp2/ThinkPHP/Library/Think/Model/MongoModel.class.php ./thinkphp2/ThinkPHP/Library/Think/Model/MongoModel.php
mv ./thinkphp2/ThinkPHP/Library/Think/Model/RelationModel.class.php ./thinkphp2/ThinkPHP/Library/Think/Model/RelationModel.php
mv ./thinkphp2/ThinkPHP/Library/Think/Model/ViewModel.class.php ./thinkphp2/ThinkPHP/Library/Think/Model/ViewModel.php
mv ./thinkphp2/ThinkPHP/Library/Think/Model.class.php ./thinkphp2/ThinkPHP/Library/Think/Model.php
mv ./thinkphp2/ThinkPHP/Library/Think/Page.class.php ./thinkphp2/ThinkPHP/Library/Think/Page.php
mv ./thinkphp2/ThinkPHP/Library/Think/Route.class.php ./thinkphp2/ThinkPHP/Library/Think/Route.php
mv ./thinkphp2/ThinkPHP/Library/Think/Session/Driver/Db.class.php ./thinkphp2/ThinkPHP/Library/Think/Session/Driver/Db.php
mv ./thinkphp2/ThinkPHP/Library/Think/Session/Driver/Memcache.class.php ./thinkphp2/ThinkPHP/Library/Think/Session/Driver/Memcache.php
mv ./thinkphp2/ThinkPHP/Library/Think/Session/Driver/Mysqli.class.php ./thinkphp2/ThinkPHP/Library/Think/Session/Driver/Mysqli.php
mv ./thinkphp2/ThinkPHP/Library/Think/Storage/Driver/File.class.php ./thinkphp2/ThinkPHP/Library/Think/Storage/Driver/File.php
mv ./thinkphp2/ThinkPHP/Library/Think/Storage/Driver/Sae.class.php ./thinkphp2/ThinkPHP/Library/Think/Storage/Driver/Sae.php
mv ./thinkphp2/ThinkPHP/Library/Think/Storage.class.php ./thinkphp2/ThinkPHP/Library/Think/Storage.php
mv ./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Ease.class.php ./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Ease.php
mv ./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Lite.class.php ./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Lite.php
mv ./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Mobile.class.php ./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Mobile.php
mv ./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Smart.class.php ./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Smart.php
mv ./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Smarty.class.php ./thinkphp2/ThinkPHP/Library/Think/Template/Driver/Smarty.php
mv ./thinkphp2/ThinkPHP/Library/Think/Template/TagLib/Cx.class.php ./thinkphp2/ThinkPHP/Library/Think/Template/TagLib/Cx.php
mv ./thinkphp2/ThinkPHP/Library/Think/Template/TagLib/Html.class.php ./thinkphp2/ThinkPHP/Library/Think/Template/TagLib/Html.php
mv ./thinkphp2/ThinkPHP/Library/Think/Template/TagLib.class.php ./thinkphp2/ThinkPHP/Library/Think/Template/TagLib.php
mv ./thinkphp2/ThinkPHP/Library/Think/Template.class.php ./thinkphp2/ThinkPHP/Library/Think/Template.php
mv ./thinkphp2/ThinkPHP/Library/Think/Think.class.php ./thinkphp2/ThinkPHP/Library/Think/Think.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs/bcs.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs/bcs.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs/mimetypes.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs/mimetypes.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs/requestcore.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs/requestcore.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Bcs.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Ftp.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Ftp.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Local.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Local.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Qiniu/QiniuStorage.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Qiniu/QiniuStorage.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Qiniu.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Qiniu.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Sae.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Sae.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Upyun.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload/Driver/Upyun.php
mv ./thinkphp2/ThinkPHP/Library/Think/Upload.class.php ./thinkphp2/ThinkPHP/Library/Think/Upload.php
mv ./thinkphp2/ThinkPHP/Library/Think/Verify.class.php ./thinkphp2/ThinkPHP/Library/Think/Verify.php
mv ./thinkphp2/ThinkPHP/Library/Think/View.class.php ./thinkphp2/ThinkPHP/Library/Think/View.php
mv ./thinkphp2/ThinkPHP/Library/Vendor/Smarty/Smarty.class.php ./thinkphp2/ThinkPHP/Library/Vendor/Smarty/Smarty.php
mv ./thinkphp2/ThinkPHP/Library/Vendor/Smarty/SmartyBC.class.php ./thinkphp2/ThinkPHP/Library/Vendor/Smarty/SmartyBC.php
mv ./thinkphp2/ThinkPHP/Mode/Api/App.class.php ./thinkphp2/ThinkPHP/Mode/Api/App.php
mv ./thinkphp2/ThinkPHP/Mode/Api/Controller.class.php ./thinkphp2/ThinkPHP/Mode/Api/Controller.php
mv ./thinkphp2/ThinkPHP/Mode/Api/Dispatcher.class.php ./thinkphp2/ThinkPHP/Mode/Api/Dispatcher.php
mv ./thinkphp2/ThinkPHP/Mode/Lite/App.class.php ./thinkphp2/ThinkPHP/Mode/Lite/App.php
mv ./thinkphp2/ThinkPHP/Mode/Lite/Controller.class.php ./thinkphp2/ThinkPHP/Mode/Lite/Controller.php
mv ./thinkphp2/ThinkPHP/Mode/Lite/Dispatcher.class.php ./thinkphp2/ThinkPHP/Mode/Lite/Dispatcher.php
mv ./thinkphp2/ThinkPHP/Mode/Lite/Model.class.php ./thinkphp2/ThinkPHP/Mode/Lite/Model.php
mv ./thinkphp2/ThinkPHP/Mode/Lite/View.class.php ./thinkphp2/ThinkPHP/Mode/Lite/View.php
```

**awk**中**-F**代表是分割符。这一段命令是我们使用分隔符将文件名拆开，然后打印是修改文件名的命令。

最后一步，我们就是将输出的内容导入到**sh**执行即可。

```sh
find ./thinkphp3 -name *.class.php | awk -F "class." '{print "mv "$0 " " $1$2}' | sh
```

参考资料：

- [Linux三剑客之awk命令](https://www.cnblogs.com/ginvip/p/6352157.html)
- [AWK 中运行MV命令](http://blog.csdn.net/limsai/article/details/8215134)


