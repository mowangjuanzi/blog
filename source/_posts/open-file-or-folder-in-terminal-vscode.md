---
title: 在终端中使用vscode打开文件或者文件夹
date: 2018-11-16 15:03:13
tags:
- vscode
categories:
- 工具
- vscode
---
在mac进行开发的时候，有时候项目的目录在访达中不好找到。在终端中进行查找的时候就比较方便，一个`cd`命令可以切到任何位置。

但是将项目目录从加入到编辑器中就比较费劲了。

目前发现了一个特别好玩的东西，就是vscode可以注入code命令，在终端使用code命令打开相应的目录或文件，非常方便。

<!-- more -->

首先打开vscode软件。

同时按住`shift + command + P`打开命令面板。

找到`Install ‘code' command in PATH`，并执行。

那么就可以在终端执行命令了。

比如我要打开nginx.conf。

那么就可以在终端执行：

```bash
code /usr/local/etc/nginx/nginx.conf
```

打开目录：

```bash
code .
```

code 还有其他命令选项：

| 参数 | 描述 |
|:---:|:---:|
| `-h` 或 `--help` | code使用说明 |
| `-v` 或 `--version` |VS Code版本（例如：0.10.10）|
| `-n` 或 `--new-window` | 打开一个VS Code新的版本替代默认版本 |
| `-r` 或 `--reuse-window` | 强制打开最后活动窗口的文件或文件夹 |
| `-g` 或 `--goto`| 当和 ``file:line:column?` 使用时 ，打开文件并定位到一个的特定行和可选的列位置的文件。 |
| file | 以一个文件名打开。如果文件不存在，此文件将被创建并标记为已编辑 |
| `file:line:column?` | 以文件的名称在指定行和可选的列的位置打开，你可以以这个方式指定多个文件。但是在使用 `file:line:column?` 之前必须使用 `-g` 参数。例如：`code -g file:10` |
| folder | 以一个文件夹名打开。你可以指定多个文件夹。例如：`code folder folder` |
| `-d` 或 `--diff` | 打开一个不同的编辑器。需要两个文件路径作为参数。例如：`code -d file file` |
| `--locale` | 为VS Code设置显示语言，支持语言环境有：`en-US` (英语) ，`zh-TW`（中文繁体），`zh-CN` (中文简体)，`fr` ，`de` ，`it` ，`ja` ，`ko` ，`ru` ，`es` 。例如：`code . --locale=en-US` 设置显示语言为英语 |
| `--disable-extensions` | 禁用所有安装的插件。下拉选 `Show installed Extensions` 后插件依然可见，但是永远不会被激活。 |
| `--list-extensions` | `code --list-extensions` 列出被安装的插件 |
| `--install-extension` | 安装一个插件。提供完整的扩展名 `publisher.extension` 作为参数。例如：`code --install-extension ms-vscode.cpptools` |
| `--uninstall-extension` | 卸载一个插件。提供完整的扩展名 `publisher.extension` 作为参数.例如 `code --uninstall-extension ms-vscode.csharp` |
|`-w` 或 `--wait` | 等待窗口返回之前关闭 |

## 参考

- https://www.jianshu.com/p/3dda4756eca5
- https://segmentfault.com/q/1010000005104983
