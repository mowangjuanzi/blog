---
title: bind9的初步使用（2）
date: 2018-12-17 00:22:00
tags:
---
## 设置局域网访问

比如我的windows 10的ip地址是192.168.1.230。那么我们可以添加如下内容到`/etc/bind/named.conf.options`文件中。

```conf
    listen-on {
        192.168.1.230;
        192.168.1.231;
    };
```

填写完成后打开`/etc/bind/named.conf.options`内容如下：

```bash
$ cat /etc/bind/named.conf.options 
options {
	directory "/var/cache/bind";

	// If there is a firewall between you and nameservers you want
	// to talk to, you may need to fix the firewall to allow multiple
	// ports to talk.  See http://www.kb.cert.org/vuls/id/800113

	// If your ISP provided one or more IP addresses for stable 
	// nameservers, you probably want to use them as forwarders.  
	// Uncomment the following block, and insert the addresses replacing 
	// the all-0's placeholder.

	// forwarders {
	//	114.114.114.114;
	// };

	//========================================================================
	// If BIND logs error messages about the root key being expired,
	// you will need to update your keys.  See https://www.isc.org/bind-keys
	//========================================================================
	dnssec-validation auto;

	listen-on-v6 { any; };
    
    listen-on {
        192.168.1.230;
        192.168.1.231;
    };
};
```

重启bind9。

然后在windows 10 上设置DNS为`192.168.1.231`和`114.114.114.114`。

这样我们打开cmd，查看域名是否获取到了正确的ip。

```bash
PS C:\Users\baogu> ping www.baoguoxiao.pro

正在 Ping www.baoguoxiao.pro [192.168.1.231] 具有 32 字节的数据:
来自 192.168.1.231 的回复: 字节=32 时间<1ms TTL=64
来自 192.168.1.231 的回复: 字节=32 时间<1ms TTL=64
来自 192.168.1.231 的回复: 字节=32 时间<1ms TTL=64
来自 192.168.1.231 的回复: 字节=32 时间=1ms TTL=64

192.168.1.231 的 Ping 统计信息:
    数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 0ms，最长 = 1ms，平均 = 0ms
```

但是如果我们这边手机要连怎么办。不能每次都加ip吧。所以这里有个简单的办法。直接将上面的配置修改如下：

```bash
$ cat /etc/bind/named.conf.options 
options {
	directory "/var/cache/bind";

	// If there is a firewall between you and nameservers you want
	// to talk to, you may need to fix the firewall to allow multiple
	// ports to talk.  See http://www.kb.cert.org/vuls/id/800113

	// If your ISP provided one or more IP addresses for stable 
	// nameservers, you probably want to use them as forwarders.  
	// Uncomment the following block, and insert the addresses replacing 
	// the all-0's placeholder.

	// forwarders {
	// 	0.0.0.0;
	// };

	//========================================================================
	// If BIND logs error messages about the root key being expired,
	// you will need to update your keys.  See https://www.isc.org/bind-keys
	//========================================================================
	dnssec-validation auto;

	listen-on-v6 { any; };

    listen-on {
        any;
    };
};
```

这样直接将ip列表修改为any。就可以接收所有的ip了。

这个时候我们将bind9再次重启。

首先安装一个nginx。具体的安装教程可查看我的另外一篇文章 {% post_link apt-install-nginx %}

安装之后，如果访问192.168.1.231，就能看到默认的nginx页面了。

## 手机测试

每个手机是设置是不同的。我这里是iphone，版本是12.1.1。

进入设置->无线局域网->在已连接的WIFI右边点击带圈的感叹号->配置DNS->选择手动。

最后点击添加服务器，输入我们虚拟机的地址：192.168.1.231。

这个时候我们在手机的浏览器里面输入我们之前设置的域名 www.baoguoxiao.pro 。就能看到我们经典的nginx主页了。

这样我们就可以使用手机访问我们的电脑页面了。在调试某些情况的时候，是不是感觉会非常方便呢。

## 泛域名设置

在开发的时候，可能会出现使用多个域名的情况，但是如果每次添加域名都要设置bind9，还要重启，非常麻烦，那么有没有简单的办法呢？有，就是使用泛域名设置。

废话不多说，请看如下配置：

```bash
$ cat /etc/bind/zones/baoguoxiao.pro.db 
; BIND data file for baoguoxiao.pro
;
$TTL 14400
@ IN SOA ns1.baoguoxiao.pro. host.baoguoxiao.pro. (
201006601 ; Serial
7200 ; Refresh
120 ; Retry
2419200 ; Expire
604800) ; Default TTL
;
baoguoxiao.pro. IN NS ns1.baoguoxiao.pro.
 
;baoguoxiao.pro. IN A 192.168.1.231
 
ns1 IN A 192.168.1.231
www IN A 192.168.1.231
```

这个是我们之前{% post_link bind9-use-1 %}对其的设置。那么如果要设置泛域名，只需要把最后一行的`www`更改为`*`就可以了。

那么切换后的配置如下：

```bash
$ cat /etc/bind/zones/baoguoxiao.pro.db 
; BIND data file for baoguoxiao.pro
;
$TTL 14400
@ IN SOA ns1.baoguoxiao.pro. host.baoguoxiao.pro. (
201006601 ; Serial
7200 ; Refresh
120 ; Retry
2419200 ; Expire
604800) ; Default TTL
;
baoguoxiao.pro. IN NS ns1.baoguoxiao.pro.
 
;baoguoxiao.pro. IN A 192.168.1.231
 
ns1 IN A 192.168.1.231
* IN A 192.168.1.231
```

最后重启一下，那么泛域名设置就成功了。

不早了，要去睡觉了。

晚安。
