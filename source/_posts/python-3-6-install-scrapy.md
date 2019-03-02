---
title: python3.6 安装scrapy
date: 2017-11-17 16:30:32
tags:
- python
- scrapy
- centos
categories:
- 编程语言
- python
---
我首先执行pip安装命令：

````shell
pip3 install scrapy
````

结果提示以下错误：

````shell
  Could not find a version that satisfies the requirement Twisted>=13.1.0 (from scrapy) (from versions: )
No matching distribution found for Twisted>=13.1.0 (from scrapy)
````

因为pip3 暂时还没有Twisted，所以我们需要手动安装：

````shell
cd /usr/local/src
wget -c https://twistedmatrix.com/Releases/Twisted/16.6/Twisted-16.6.0.tar.bz2
````

这个包国内下载有些慢，我建议使用迅雷进行下载，然后通过`rz`命令进行上传。


下面我们进行解压

````shell
tar jxf Twisted-16.6.0.tar.bz2
````

提示下列错误：

````shell
tar (child): bzip2：无法 exec: 没有那个文件或目录
tar (child): Error is not recoverable: exiting now
tar: Child returned status 2
tar: Error is not recoverable: exiting now
````

说明我们缺少bzip2这个类文件，我们需要进行安装类库：

````shell
yum install bzip2 -y
````

我们回过头去继续执行刚才的解压命令，解压成功后：

```shell
cd Twisted-16.6.0
python3 setup.py install
````

提示：

````shell
Using /usr/local/python3/lib/python3.6/site-packages
Finished processing dependencies for Twisted==16.6.0
````

这样就表示安装成功了。现在我们开始执行最开始安装`scrapy`的命令：

````shell
pip3 install scrapy
````

如果显示如下信息：

```shell
Successfully installed PyDispatcher-2.0.5 attrs-16.3.0 cffi-1.9.1 cryptography-1.7.2 cssselect-1.0.1 idna-2.2 lxml-3.7.2 parsel-1.1.0 pyOpenSSL-16.2.0 pyasn1-0.1.9 pyasn1-modules-0.0.8 pycparser-2.17 queuelib-1.4.2 scrapy-1.3.0 service-identity-16.0.0 six-1.10.0 w3lib-1.16.0
```

则表示已经安装成功了。

我们测试一下：

````shell
[root@iZ28zkjw87oZ ~]# scrapy version
-bash: scrapy: 未找到命令
````

这个很奇怪，我们使用`find`命令找一下：

````shell
[root@iZ28zkjw87oZ Twisted-16.6.0]# find / -name scrapy
/usr/local/python3/bin/scrapy
/usr/local/python3/lib/python3.6/site-packages/scrapy
````

我们创建一个软连接：

````shell
ln -sf /usr/local/python3/bin/scrapy /usr/local/bin/scrapy
````

然后我们继续执行一下刚才查看版本的命令：

````shell
[root@iZ28zkjw87oZ ~]# scrapy version
Scrapy 1.3.0
````

这样就表示安装成功了。
