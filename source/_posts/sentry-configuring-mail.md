---
title: sentry配置邮件
date: 2018-10-30 09:57:20
tags:
- sentry
- email
categories:
- 工具
- sentry
---
sentry一个最大的好处就是可以使用邮件通知功能，如果没有邮件通知，那么我们自己上去看的话就非常麻烦了。

进行邮件推送需要我们提供邮件服务器。这里的话，我就用的是腾讯企业邮箱。

好了，下面说具体配置。

首先接上一篇文章 {% post_link sentry-install %}，我们将代码拉取到的目录是`/data/sentry`。

接下来我们就要里面这个文件夹里面的`docker-compose.yml`文件。

```yaml
x-defaults: &defaults
  restart: unless-stopped
  build: .
  depends_on:
    - redis
    - postgres
    - memcached
    - smtp
  env_file: .env
  environment:
    SENTRY_MEMCACHED_HOST: memcached
    SENTRY_REDIS_HOST: redis
    SENTRY_POSTGRES_HOST: postgres
    # 从这里开始
    SENTRY_EMAIL_HOST: smtp.exmail.qq.com
    SENTRY_EMAIL_USER: example@mail.com
    SENTRY_SERVER_EMAIL: example@mail.com
    SENTRY_EMAIL_PASSWORD: password
    SENTRY_EMAIL_USE_TLS: true
    SENTRY_EMAIL_PORT: 587
    # 这里结束
  volumes:
    - sentry-data:/var/lib/sentry/files
```

这里介绍一下每个配置项的作用：

| 配置项 | 作用 | 腾讯企业邮 |
|:---:|:---:|:---:|
| SENTRY_EMAIL_HOST | SMTP服务器地址 | smtp.exmail.qq.com |
| SENTRY_EMAIL_USER | 登录的邮箱账号 | example@mail.com |
| SENTRY_EMAIL_PASSWORD | 登录的邮箱密码 | password |
| SENTRY_EMAIL_PORT | 登录的端口 | 587 |
| SENTRY_EMAIL_USE_TLS | 是否使用ssl连接 | true |
| SENTRY_SERVER_EMAIL | 发送的账户，跟**SENTRY_EMAIL_USER**相同 |  example@mail.com |

配置完成之后，需要重建服务。具体可以执行以下命令:

```bash
docker-compose down
docker-composer up -d
```

然后稍等一分钟就可以正常访问web页面了。

现在来测试一下。

进入页面，在左上角的你的昵称位置单击，选择Admin。

然后在左侧选择**Mail**，然后在最下面有一个测试设置。点击“向example@mail.com发送一封测试邮件”。如果收到的话，那么说明就配置成功了。

在配置问题中，如果有什么问题，可以过来跟我留言。

毕竟这个邮件通知我折腾了一下午才搞定。

哈哈
