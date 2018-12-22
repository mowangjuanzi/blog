---
title: 实现一个最简单的模板分离
date: 2017-11-17 16:28:51
tags:
---
今天看到以前知乎上别人提问的关于模板和逻辑进行分离的问题。

一直都没有回答过。

今天终于回答了。我来记录以下：

首先是模板文件，我定义他为`index.html`，内容如下（**本来想放代码的，结果显示有问题**）:

![](https://www.baoguoxiao.com/wp-content/uploads/2018/08/f853ba71e72bc20f4b4149b85f9c0edf.png)

这里我们就不用自定义标签啊，之类的等等，我相信鸟哥的那句话，PHP本身就是一个非常好的模板引擎，我们没有必要再去造一个轮子。

所以，我们直接来写PHP的解析：

````php
<?php
/**
 * 模板解析
 */
class View{
	protected $path;
	protected $vars;
	public function __construct($path, $vars = []){
		if (is_file($path)) {
			$this->path = $path;
		}
		$this->vars = $vars;
	}

	public function fetch(){
		ob_start();
		ob_implicit_flush(0);
		extract($this->vars, EXTR_OVERWRITE);
		require_once $this->path;
		return ob_get_clean();
	}
}

$view = new View('./index.html', ['title' => 'test', 'list' => ['a', 'b', 'c']]);
echo $view->fetch();
?>
````

好了。直接运行一下，就能看到结果了。

不写了。太晚了。晚安。
