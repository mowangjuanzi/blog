---
title: 查看本机IP
date: 2018-11-15 11:08:12
tags:
---
有时候，在登录到云服务器之后，可能需要在终端查询该服务器的ip。

之前我都是用的 ip.cn ，但是感觉不行了。

现在提供一些其他的可选择项：

```bash
$ curl ipinfo.io
{
  "ip": "60.205.205.243",
  "city": "",
  "region": "",
  "country": "CN",
  "loc": "34.7725,113.7270",
  "org": "AS37963 Hangzhou Alibaba Advertising Co.,Ltd."
}
$ curl cip.cc
IP	: 60.205.205.243
地址	: 中国  北京
运营商	: 阿里云/电信/联通/移动/铁通/教育网

数据二	: 北京市 | 阿里云BGP服务器

数据三	: 中国北京北京市 | 阿里云

URL	: http://www.cip.cc/60.205.205.243
$ curl myip.ipip.net
当前 IP：60.205.205.243  来自于：中国 北京 北京  阿里云/电信/联通/移动/铁通/教育网
# curl ifconfig.me
60.205.205.243
$ curl http://members.3322.org/dyndns/getip
60.205.205.243
```

相信还有这么多的URL。估计哪一个不行了，都能找到可替代的了。
