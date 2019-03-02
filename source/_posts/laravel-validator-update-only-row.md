---
title: Laravel Validator 更新时验证记录唯一的小技巧
date: 2017-11-17 16:34:33
tags:
- laravel
- php
- validator
categories:
- 编程语言
- php
- laravel
---
比如我们在新增一篇文章的时候，我们一般会写如下的表单验证。

````php
$this->validate($request, [
    'title' => 'required|unique:article|max:255',
]);
````

这样在新增的时候是没什么问题的，但是在更新的时候就出现了一个问题，就是当我们的title没有发生改变的时候，我们使用`unique`的时候，会将原来的记录行进行扫描，这样就会提示我们`该标题已经存在`。

这样就比较坑爹了，那么有没有什么办法可以解决呢。办法是有的，其实很简单，我们只需要跟下面那样写就好了：

````php
$id = $request->input("id", 0);
$this->validate($request, [
    'title' => "required|unique:article,id,{$id}|max:255",
]);
````

这样的话在验证唯一的时候就会不去验证id=`$id`的记录。这样就可以防止我们刚才碰到的问题了。

那么不管新增还是更新，套路就是这样了：

````php
$id = $request->input("id", 0);
$this->validate($request, [
    'title' => "required|unique:article,id,{$id}|max:255",
]);

if ($id < 1) { // 新增
    $info = new Article();
} else {
    $info = Article::where("id", $id)->first();
}

$info->title = $request->input("title");

if ($info->save()) {
    // 操作成功
} else {
    // 操作失败
}
````

Laravel真是最好的框架。

哈哈

> 参考网址：

https://stackoverflow.com/questions/23587833/laravel-validation-unique-on-update
