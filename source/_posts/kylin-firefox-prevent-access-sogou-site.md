---
title: 我的电脑系统换成了linux之解决火狐浏览器首页按钮强制访问sogou主页的问题
date: 2017-11-25 11:37:27
tags:
- ubuntu
- firefox
- nginx
- hosts
categories:
- 操作系统
- ubuntu
---
我的火狐浏览器默认主页是123.sogou.com 但是，我希望把我的首页变成百度。

然后我按照以前的习惯，在设置里面将主页的链接设置成了baidu.com

结果发现，后来还是会偷偷的给改成搜狗主页。

居然这么流氓！！！

这个时候我就发挥我的程序员能力了。

我想到一个办法，就是将这个域名绑定到127.0.0.1，这样就不会给搜狗做推广了。

然后发现还是有问题，就是不能直接访问网页，还需要输入一次。

所以使用nginx的rewrite功能来重写URL，发现重写之后会带着get参数，这个时候，百度会自动跳转到错误页面，还是不行。

于是我就想到编写一个php文件，当请求的时候，就使用header进行重定向。

尝试了之后，发现非常ok。

下面提供以下操作方法：

首先修改**hosts**文件，增加以下内容:

```ini
127.0.0.1	123.sogou.com
```

然后在**/etc/nginx/conf.d/**增加**123.sogou.conf**，文件内容如下：

```ini
server {
    listen       80;
    server_name  123.sogou.com;

    charset utf-8;
    #access_log  logs/host.access.log  main;
    root   html;
    index  sogou.php;

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```

然后在**/usr/share/html/**新增**sogou.php**文件，内容如下：

````php
<?php
header("Location: https://www.baidu.com");
````

然后重启nginx。

最后我们测试一下，在浏览器里面点击主页图标。我这里就直接跳转到baidu
首页了。

完美！

