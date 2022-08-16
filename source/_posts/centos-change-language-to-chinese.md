---
title: Linux：定义区域和语言设置
date: 2017-11-17 16:29:20
updated: 2022-08-16 23:59:08
tags:
- Linux
- Rocky
- Ubuntu
categories:
- 操作系统
- Linux
---

Locale （区域）在 Linux 终端中定义语言和字符集设置。

从这篇文章中可以学到如何在 Linux 命令行中检测和修改当前区域和语言设置。

将会展示如何检测当前语言和区域设置以及如何获取有效的区域列表。

也可以学到如何针对当前会话设置临时区域和语言设置以及修改系统默认设置。

## 查看

执行 `locale` 命令获取当前区域和语言设置相关信息：

```bash
locale
```

运行以下命令查看所有启用的区域：

```bash
locale -a
```

区域使用下列格式定义：

```bash
<language>_<territory>.<codeset>[@<modifiers>]
```

| 标识符 | 注释 |
|:---:|:---:|
| language | [ISO 639-1](https://baike.baidu.com/item/ISO%20639-1) 语言代码。 |
| language | [ISO 3166-1](https://baike.baidu.com/item/ISO%203166-1) 国家代码。|
| codeset | [字符集](https://baike.baidu.com/item/%E5%AD%97%E7%AC%A6%E7%BC%96%E7%A0%81)或者编码标识符，像是 ISO-8859-1 或者 UTF-8 |

## 为当前会话设置区域

在命令行执行以下命令，就可以设置为中文 UTF-8 字符：

````bash
LANG="zh_CN.UTF-8"
````

但是有个问题，这样仅能用于当前会话，如果会话关闭了，那么又回到了开始的情况。

## 为用户设置区域

可以将以下代码加入到 `~/.bashrc` 或者 `~/.profile`。

````bash
export LANG="zh_CN.UTF-8"
````

默认退出会话并重新登录会话后才会生效。但是可以使用以下方法强制立即生效：

```bash
source ~/.profile
```

或者

```bash
source ~/.bashrc
```

## 设置为系统默认区域设置：

修改配置文件`vim /etc/locale.conf`，


修改 `LANG` 为：

````ini
LANG=zh_CN.UTF-8
````

## 参考

- [Linux: Define Locale and Language Settings](https://www.shellhacks.com/linux-define-locale-language-settings/)
