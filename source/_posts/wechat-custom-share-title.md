---
title: 微信公众号自定义分享标题遇到的坑
date: 2018-03-30 15:28:26
tags:
---
我们公司在微信认证服务号上开发一个小游戏。里面有个功能是用户分享到其他地方时使用自定义的标题和图标。我就这个功能记录一下中间遇到的坑。

首先，我因为之前没有开发过微信分享的功能，这个时候首先要读取一下微信的[分享文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)。

为了方便开发，我这边是使用的微信的公众测试号。具体的申请地址可点击这里：mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login

## 开发环境

JS-SDK使用权限需要签名，也就是wx.ready中的signature值，所以该值只能在服务器端实现签名的逻辑。我想了一个办法，就是该JS文件使用PHP生成，然后前端使用script元素引入该URL。这样就解决了签名需要在服务器端生成的问题。

具体到了签名生成的时候。appid和timestamp和nonceStr都好说。直接填写或者生成就好了。但是生成的signature这个值我中间碰到三个坑。第一个坑文章中正确介绍的签名的字符串的格式是这样的：

```
jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg&noncestr=Wm3WZYTPz0wzccnW×tamp=1414587457&url=http://mp.weixin.qq.com?params=value
```

但是我这边是使用的数组。然后先排序然后使用http_build_query方法生成的参与签名的字符串。这样就不对了。所以对于该参与校验的值只能进行赋值。类似这样：

```
jsapi_ticket={$ticker}&noncestr={$nonceStr}&timestamp={$timestamp}&url={$url}
```

直接对其中的值进行赋值，进行签名即可。

下面说第二个坑。比如我们的活动地址是https://m.abc.com/Activity/index 但是在微信中访问的时候，会在后面自定义添加参数。比如有时候地址会变成这样：https://m.abc.com/Activity/index.html?from=singlemessage&isappinstalled=0。对于这种签名的规则，微信是需要把这种自带参数也带入签名。

所以我想了这么一个办法。就是说把该JS文件携带URL地址请求我，我这边获取URL，并将URL加入到签名中。这样的话，前端将引入脚本写死就不好了。所以我和前端一块将加载js脚本给换成了下面这样:

```html
<script type="text/javascript">
	var script =document.createElement("script");
	var url = window.location.href;
	script.src="/Static/wxShare?url=" + encodeURIComponent(url);
	document.getElementsByTagName(&#039;body&#039;)[0].appendChild(script);
</script>
```

第三个坑，获取jsapi_ticket票据的值是JAVA实现的。但是在获取的时候并不能获取成功，经过跟JAVA沟通，发现是之前开发设置的测试的appid已经过期了。所以，失效了，重新设置了一下，就正常了。

至此，开发联调就结束了。下面就提测进行测试阶段了。

## 测试环境。

测试环境一直分享失败。然后开启debug模式。发现也是提示sign值不可用。排查这个问题，遇到了两个坑。

第一个坑，是请求JAVA的服务器获取jsapi_ticket票据，提示操作失败。经过JAVA排查，发现是少设置了一个参数。好了，经过修改，能够正常获取jsapi_ticket了。

第二个坑，则是测试这边换了JAVA配置中的appid的值的配置，结果access_token因为缓存起来了，结果还是存的之前的appid的access_token。接着获取的jsapi_ticket也是根据之前的access_token进行获取的。所以一直不成功，后来经过清除缓存。然后测试就ok了。

好了。其实这个并没有按照教程的形式来介绍一下我的开发工作。主要是把我中间遇到的坑给解释一下。
