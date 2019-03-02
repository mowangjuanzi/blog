---
title: PHP汉字转拼音
date: 2018-10-08 10:36:25
tags:
- php
categories:
- 编程语言
- php
---
如果对多音字要求不高的话。可以使用如下方法：

```php
$id = 'Any-Latin; NFD; [:Nonspacing Mark:] Remove; NFC; [:Punctuation:] Remove; Lower();';
$transliterator = Transliterator::create($id);

$string = "garçon-étudiant-où-L'école";
echo $transliterator->transliterate($string); // garconetudiantoulecole
```

使用的什么原理，我还不清楚，具体可以等以后再去了解。

## 参考地址

- https://docs.phalconphp.com/en/3.4/i18n#transliteration
- http://userguide.icu-project.org/transforms/general
