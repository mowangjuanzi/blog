---
title: parallel-request-testing
date: 2019-10-29 00:00:00
updated: 2020-02-08 22:22:13
tags:
- php
- swoole
- curl
- golang
- nodejs
- golang
category:
- 编程语言
---

# 并行请求测试

因为我们想要做底层服务，那么肯定会有一个对外的接口中会有好几个调用底层的接口。按照传统做法，就只能是串行请求。下面我做了一个测试。测试使用各种方法连续请求10次，看看总的统计时间，来确定使用哪种方案。

<!-- more -->

## 使用版本：

- PHP: 7.3.8
- PHP-Swoole: 4.4.8
- PHP-cURL: 7.65.3
- Node.js:
- GoLang: 

## 串行读取

首先呢，就是PHP的默认串行读取了。接下来直接看脚本吧：

```php
$urls = [
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
];

foreach($urls as $item) {
    geturl($item);
}
	
function geturl($url){
       
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS      => 5,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL => "http://" . $url,
        ]);
        
        $output = curl_exec($ch);
        curl_close($ch);
 
        var_dump(strlen($output));
}
```

执行时间：

```bash
real    0m1.150s
user    0m0.045s
sys     0m0.040s
```

## CURL并发请求

```php
$urls = [
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
];

$rolling_window = count($urls);
 
$master   = curl_multi_init();
$curl_arr = array();
 
$std_options = array(
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 5,
    CURLOPT_RETURNTRANSFER => true,
);

$options = $std_options;
 
for ($i = 0; $i < $rolling_window; $i++) {
    $ch                   = curl_init();
    $options[CURLOPT_URL] = "http://" . $urls[$i];
    curl_setopt_array($ch, $options);
    curl_multi_add_handle($master, $ch);
}

$result = [];

do {
    while (($execrun = curl_multi_exec($master, $running)) == CURLM_CALL_MULTI_PERFORM);
    if ($execrun != CURLM_OK) {
        break;
    }

    while ($done = curl_multi_info_read($master)) {
        $info = curl_getinfo($done['handle']);
        $output = curl_multi_getcontent($done['handle']);
        var_dump(strlen($output));
        curl_multi_remove_handle($master, $done['handle']);
    }
} while ($running);
 
curl_multi_close($master);
```

执行时间：

```bash
real    0m0.246s
user    0m0.081s
sys     0m0.173s
```

## Swoole 协程请求

```php
Swoole\Runtime::enableCoroutine();

$urls = [
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
    "cn.bing.com",
];

$chan = new chan(count($urls));

go(function() use($chan, $urls) {
    foreach($urls as $item) {
        var_dump($chan->pop());
    }
});

foreach($urls as $url) {
    go(function() use($chan, $url) {
        $cli = new Swoole\Coroutine\Http\Client('cn.bing.com', 80);
        $ret = $cli->get('/');

        $chan->push([$url => strlen($cli->getBody())]);
    });
}
```

执行时间：

```bash
real    0m0.140s
user    0m0.019s
sys     0m0.031s
```

## Golang协程

```golang
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	ch := make(chan string)

	urls := []string{
		"https://www.baidu.com",
		"https://www.baidu.com",
		"https://www.baidu.com",
		"https://www.baidu.com",
		"https://www.baidu.com",
		"https://www.baidu.com",
		"https://www.baidu.com",
		"https://www.baidu.com",
		"https://www.baidu.com",
		"https://www.baidu.com",
	};

	for _, url := range urls {
		go fetch(url, ch) // start a goroutine
	}
	for range urls {
		<-ch
	}
}

func fetch(url string, ch chan<- string) {
	resp, err := http.Get(url)
	if err != nil {
		ch <- fmt.Sprint(err) // send to channel ch
		return
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	resp.Body.Close()
	ch <- string(len(body))
}
```

执行时间：0.185s

## NodeJS

```js
const axiso = require('axios');
const urls = [
    "https://www.baidu.com",
    "https://www.baidu.com",
    "https://www.baidu.com",
    "https://www.baidu.com",
    "https://www.baidu.com",
    "https://www.baidu.com",
    "https://www.baidu.com",
    "https://www.baidu.com",
    "https://www.baidu.com",
    "https://www.baidu.com",
];

async function fetchAll() {
  const promiseAll=[];
  urls.forEach(url => {
      promiseAll.push(fetch(url));
  });
  const res = await Promise.all(promiseAll);
  res.forEach(val=>{
    //   console.log(val.data.length);
  })
}

async function fetch(url) {
  return axiso.get(url)
}

fetchAll();
```

运行时间 0.344s
