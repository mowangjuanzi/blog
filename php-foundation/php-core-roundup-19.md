---
outline: deep
commit-id: 40749f047e504786023457871deef9f2fa0d2ec8
---

# PHP 核心综述 #19

欢迎回到 PHP 核心综述系列，我们介绍 PHP 中的新内容和变化，并提供最近的变更提案及其周围讨论的更新。

我们上次更新已经是将近一年前了，那是因为我们觉得 PHP 核心综述相关文章已经过时，并且我们以前的格式重复并且有很多变化，导致帖子过长。

## 新版 PHP 核心综述系列

今天，我们尝试了一种新编排格式，摆脱了看起来像是单纯的变更日志，转而发布一篇强调 PHP 开发总体势头的帖子。这也意味着我们可能无法像在以前的帖子中那样庆祝和提及 PHP 基金会成员和其他贡献者的所有贡献。

维护一种成熟、可靠且广泛使用的编程语言，并在近 30 年内不断获得新功能和改进，需要做大量工作！维护 PHP 文档、php.net 基础设施、翻译、分类问题和安全报告、错误修复、邮件列表、审查 RFC 和打包 PHP 等等，我们有 PHP 贡献者和 PHP 基金会成员为改进 PHP 付出了巨大的努力！

虽然这些 PHP 核心综述系列可能不会经常写这些贡献，因为我们希望这些帖子保持令人兴奋和资源丰富，但我们希望向 PHP 生态系统的所有贡献者传播爱💜。

## PHP 发布周期更新

四月份时，我们投票并接受了一份 [RFC](https://wiki.php.net/rfc/release_cycle_update)，以更新我们的发布周期政策。

PHP 核心团队提供了两年的积极支持，随后只提供了一年的安全修复。我们现在有了新的发布周期，自 PHP 8.1（2021 年 11 月发布）起，所有
PHP 版本现在都获得**两年的安全修复，而不是一年**.。两年的积极支持期保持不变。

此外，我们已将积极支持和终止支持日期更改为与公历年的 12 月 31 日。这使得支持和终止支持日期更加可预测。

以下是当前 PHP 版本系列的最新积极支持和 EOL 日期。与之前设定的日期不同的日期以粗体显示。

|PHP 版本|发行日期|积极维护到|EOL 日期|
|:--:|:--:|:--:|:--:|
|PHP 8.1|2021-11-25|2023-11-25|**2025-12-31**|
|PHP 8.2|2022-12-08|**2024-12-31**|**2026-12-31**|
|PHP 8.3|2023-11-23|**2025-12-31**|**2027-12-31**|
|PHP 8.4|2024-11-21|2026-12-31|2028-12-31|
|PHP 8.5|2025-11|2027-12-31|2029-12-31|


## PHP 核心开发

几天前，PHP 8.4 功能冻结。PHP 8.4 预计将于今年 11 月 21 日发布。

PHP 8.4 的第一个 RC 版本已经发布 - 它们尚未生产，但可以通过从[源代码](https://github.com/php/php-src/tags)、使用 [Windows
二进制文件](https://windows.php.net/qa/)或在 [Docker 容器](https://hub.docker.com/_/php/tags?name=8.4-)中试用和测试 PHP 应用程序。

### PHP 8.4 的亮点

PHP 8.4 is an important release that brings major new features, several updates to the build dependencies and underlying libraries, and a fair bit of deprecations to iron out some of the legacy and undesirable behaviors and features in legacy PHP versions.

Using various approaches, each PHP version brings a lot of performance improvements and security tightening too. In PHP 8.4, we continue this in this direction with several minor internal improvements as well as noticeable improvements in JIT, and PHP extensions such as mbstring, BCMath, XML extensions, PCRE, and more.

Further, PHP 8.4 unbundles IMAP, Pspell, OCI, and pdo_oci extensions. It means if you wanted to continue using them, you'll have to install via PECL.

### 属性挂钩和不对称可见性

One of the most important features in PHP 8.4 is that you can now use [property hooks](https://wiki.php.net/rfc/property-hooks) and declare property [visibility separately](https://wiki.php.net/rfc/asymmetric-visibility-v2) for get and set operations. Both of these features are thanks to the collaborative efforts of Ilija Tovilo and Larry Garfield. Ilija, funded by the foundation 💜, focused on the implementation. Meanwhile, Larry, a frequent contributor, worked on the specification and authored the RFC text.
Property hooks allow declaring virtual properties with "hooks" that get executed when the properties are accessed or set, and the hooks get called with the object in context, to run their own logic.

```php
class User {
    public string $emailAddress {
		set {
			if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
				throw new ValueError('emailAddress property must be a valid email address');
			}
            $this->emailAddress = $value;
        }
	}
}

$user = new User();
$user->emailAddress = 'test@example.com'; // Allowed
$user->emailAddress = 'not an email address'; // Throws ValueError
```

Property hooks open up a vast possibilities to leading to less boilerplate code, improve readability, and make PHP classes and their APIs more intuitive.

The [Property Hooks RFC](https://wiki.php.net/rfc/property-hooks) is perhaps our longest RFC ever, detailing use cases and syntax such as short functions, using them in constructor-promoted class properties, how a subclass can override or call parent property hooks, how they work with other mechanics such as readonly, magic methods, references, arrays, etc.

We will be covering more about details and mechaniscs of Property Hooks soon in future posts.

### 不对称可见性

Another useful feature added in PHP 8.4 is the ability to set different visibility scopes for get and set operations. This comes in situations where exposing a class property to be _read_ is desired, but not to _write_.

```php
class User {
    public private(set) int $userId;

    public function __construct() {
        $this->userId = 42; // e.g. set from a database value
    }
}

$user = new User();
echo $user->userId; // 42

$user->userId = 16; // Not allowed
// Error: Cannot modify private(set) property User::$userId from global scope
```

### 改进的 HTML5 解析器

The DOM Extension in PHP 8.4 received a massive feature-update as well. Previously, the DOM extension only offered libxml2 to parse HTML, which has not kept up with HTML5. The DOM extension now offers new `Dom\HTMLDocument` and `Dom\XMLDocument` classes with the former supporting HTML5-compliant parsing support.

There are lots of new improvements in this space, including not only the [HTML5 parsing support](https://wiki.php.net/rfc/domdocument_html5_parser), but also [DOM spec compliance](https://wiki.php.net/rfc/opt_in_dom_spec_compliance) and several small [additions](https://wiki.php.net/rfc/dom_additions_84) including adding support for CSS selectors.

### BCMath extension getting `Number` class and new functions

The BCMath extension in PHP 8.4 now has classes with support for operator overloading support!

```php
use BcMath\Number;
  
$num1 = new Number('22');  
$num2 = new Number('7'); 
$num3 = new Number('100');
  
$result = ($num1 / $num2) + $num1 - $num2;
echo $result; // 18.1428571428
```

Now, instead of using BCMath functions such as `bcadd`, `bcsub`, `bcdiv`, etc, you can now simply use standard operators (`+`, `-`, `/`, etc.).

The new `BcMath\Number` class supports operator overloading, which cannot be done by userland PHP classes yet, but the BCMath extension implements it, so you can use them as if they were regular numbers.

The `BcMath\Number` class implements `Stringable` interface, so the objects can be used where a string is expected (like how the example above uses it with an `echo` call). Further, the class implements all `bc*` functions. For example, it's also possible to call `$num->add($num2)` or `$num->add('5')` and it returns a new `BcMath\Number` object without modifying the original object, which makes them immutable.

This comes from Saki Takamachi 💜, one of our new PHP Foundation members. She also made several new improvements including adding new `bcfloor`, `bcceil`, `bcround`, and `bcdivmod` functions.

### ... 还有更多！

PHP 8.4 is shaping up to be an impactful version, with features such as property hooks and asymmetric visibility we mentioned above, and a healthy amount of deprecations including deprecating [implicitly nullable parameter declarations](https://php.watch/versions/8.4/implicitly-marking-parameter-type-nullable-deprecated).

Further, PHP 8.4 will be released after some popular Linux distro versions in server space reach their EOL date (such as Ubuntu 18.04 and RHEL/CentOS 7), so we took this opportunity to bump the minimum required dependency versions for Curl (>= 7.61.0), OpenSSL (>= 1.1.1). The PHP 8.4 mbstring extension is also updated to with the latest Unicode Character Database version 16 data.

See the lengthy [`UPGRADING`](https://github.com/php/php-src/blob/PHP-8.4/UPGRADING) file for a complete list of changes, but we will also be covering the important ones in the upcoming PHP Core Roundup posts.

## 正在创作什么

On September 30th, PHP 8.4 reached its feature-freeze, which means PHP 8.4 syntax and features are now fixed; PHP 8.4 will get ironed out and the first GA release is scheduled for November 21st.

### PIE：PHP 扩展安装程序

PIE is a new initiative to be an eventual replacement for PECL. It's still under development, but it will be able to download, build, and install PIE-compatible extensions.

### 实时基准测试

Máté Kocsis 💜 [was](https://externals.io/message/116323) working on a real-time fully-automated and reproducible [benchmark](https://github.com/kocsismate/php-version-benchmarks?tab=readme-ov-file#introduction) for PHP. It is now active (with daily results available [here](https://github.com/php/real-time-benchmark-data)).

Using these test suits, we now have reliable data on the performance improvements or degradation in each PHP version.

---

## 支持 PHP 基金会

At The PHP Foundation, we support, promote, and advance the PHP language. We financially support ten PHP core developers to contribute to the PHP project. You can help support PHP Foundation on [OpenCollective](https://opencollective.com/phpfoundation) or via [GitHub Sponsors](https://github.com/sponsors/ThePHPF).

A big thanks to all our sponsors — PHP Foundation is all of us!

Follow us on Twitter/X [@ThePHPF](https://twitter.com/thephpf) or  [Mastodon](https://phpc.social/@thephpf) to get the latest updates from the Foundation.

💜️ 🐘

> PHP Roundup is prepared by Ayesh Karunaratne from **[PHP.Watch](https://php.watch)**, a source for PHP News, Articles, Upcoming Changes, and more.
