---
date: 2022-12-04
---
# PHP 密码函数

在我们技术开发的时候，我们不可避免的都会处理用户的密码存储问题。

以前的时候都是使用的md5，sha1等方法对密码进行存储，但是总是觉得不安全，因为现在已经出现了彩虹表了。

所以这个时候我们也要了解一下PHP最新内置的密码函数。

## 内置函数

从PHP >= 5.5.0 开始，该类库已经成为PHP核心的一部分了，所以你完全不需要担心是否需要安装的问题。

 该类库主要有四个函数，这里我们主要是讲解两个：[password_hash()](https://www.php.net/manual/zh/function.password-hash.php) 和 [password_verify()](https://www.php.net/manual/zh/function.password-verify.php)。

### password_hash()

该函数主要是对密码进行加密。并且该函数支持两种算法，分别是 `PASSWORD_BCRYPT` 和 `PASSWORD_ARGON2I，而` `PASSWORD_DEFAULT` 指的是 `PASSWORD_BCRYPT`。

首先我们对密码进行创建散列：

```php
echo password_hash("123456", PASSWORD_DEFAULT) . "\n"; // output $2y$10$9Hzmx.PMdqgGJDvGzQFco.AULvV73u0frLyXEB0914A0shHbZ6eUa
echo password_hash("123456", PASSWORD_DEFAULT) . "\n"; // output $2y$10$rJ3FAxaOG1P4x5SHDKzzKOiFDDgclVMPlUwXbcxylRuKWCG83n0Ka
```

可以看到同样的密码两次生成的密码值并不是相同的。对于类似MD5这种生成固定散列的情况，安全性提升了很多。

目前生成的散列长度固定是60字符，但是PHP并不保证以后永远是60字符，所以他推荐数据库的存储长度是255。

### password_verify

验证密码是否正确，我们需要使用该函数进行校验。使用方法如下：

```php
$hash = "$2y$10$9Hzmx.PMdqgGJDvGzQFco.AULvV73u0frLyXEB0914A0shHbZ6eUa";

var_dump(password_verify("123456", $hash)); // output true
var_dump(password_verify("123457", $hash)); // output false
```

这样我们再也不用担心被拖库了。