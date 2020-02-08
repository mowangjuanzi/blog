---
title: CORS的一点事
date: 2020-02-08 21:35:52
updated: 2020-02-08 21:35:52
tags:
- http
- cors
categories:
- http 
---

## 背景介绍

我们公司有个 `m` 域名，主要是用来访问前端编译文件。然后有一个 `api` 域名，用来提供接口请求。我发现我们的接口每次访问都会请求两次。第一次是 `OPTION` 请求。第二次才是真实的请求。

<!-- more -->

## 原因分析

我对此表示困惑，通过查询相关文档，了解到我们是用的JWT作为我们的token验证方式。然后我们在传递token的时候是将其放到 `header` 中的 `Authorization` 中。

因为不符合CORS简单请求的规则，所以触发了预检请求。

可通过以下两个规则来查看简单请求和预检请求的区别：
- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#简单请求
- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#预检请求

## 解决方案

通过查询[JWT-AUTH的文档](https://jwt-auth.readthedocs.io/en/develop/quick-start/#authenticated-requests)可以知道解决方案很简单。

将`Authorization header`请求更改为`Query string parameter`请求即可。

## 更多

CORS 配置，我们是在PHP这一层实现的。我觉得还是在nginx 实现比较好。 下面是我按照网上写好的格式copy的。等上班了去实际环境测试先。

```nginx
server {
    set $allow_origin "";
    if ( $http_origin ~ '^https?://m(.(dev|test))?.example.com' ) {
        set $allow_origin $http_origin;
    }
    
    location / {
        add_header 'Access-Control-Allow-Origin' $allow_origin;
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Token,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,X_Requested_With,If-Modified-Since,Cache-Control,Content-Type';
        add_header 'Access-Control-Max-Age' '1728000';
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

## 相关连接

- https://jwt-auth.readthedocs.io/en/develop/quick-start/
- https://www.ruanyifeng.com/blog/2016/04/cors.html
- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS
