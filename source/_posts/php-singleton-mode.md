---
title: 单例模式
date: 2018-11-17 16:33:52
tags:
---
好久没发表文章了。今天说一下单例模式。

单例模式主要有以下几个关键点：

- 对象应该可以被系统中的任何对象使用。
- 对象不应该被存储在会被覆写的全局变量中。
- 系统中不应超过一个要单例的对象。



其实实现单例的方法很简单。比如我们现在声明一个类Config。

````php
class Config {
    private $configs = [];

    private function __construct() {}

    public function set($key, $value){
        $this->configs[$key] = $value;
    }

    public function get($key) {
        return $this->configs[$key];
    }
}
````

此时的类还是无法使用的。因为构造函数已经被私有化了。我们需要一个静态方法和静态变量来间接的实例化对象。代码如下：

````php
class Config {
    private $configs = [];
    private static $instacne;
    private function __construct() {}
    private function __clone() {}
    private function __sleep() {}
    private function __wakeup() {}

    /**
     * 获取实例化对象
     */
    public static function getInstance() {
        if (empty(self::$instacne)) {
            self::$instacne = new self;
        }

        return self::$instacne;
    }

    public function set($key, $value){
        $this->configs[$key] = $value;
    }

    public function get($key) {
        return $this->configs[$key];
    }
}
````

我们使用`Config::getInstanct()`来获取对象实例，并将其保存到`$instance`静态变量中。

接下来，我们写一个demo，来检测代码是否能够正常工作：

````php
$config = Config::getInstance();

$config->set("name", "matt");
unset($config);

$config = Config::getInstance();
var_dump($config->get("name"));
````

执行即可得出结果正是我们最早写入的值。 好了，单例模式就介绍完成了。
