---
title: Ubuntu 支持 OneDrive
date: 2021-10-20 07:43:19
updated: 2022-08-26 07:55:05
tags:
- Linux
- Ubuntu
categories:
- 操作系统
- Linux
---

> 此文章使用的操作系统版本是 Ubuntu v22.04。

<!-- more -->

## 简介

关于包，使用的是 [abraunegg/onedrive](https://github.com/abraunegg/onedrive)。感谢前辈们的无私奉献。

首先要介绍一下，该包没有 GUI，所以只能在命令行操作，如果对命令行不熟悉的话可能操作起来还是有点费劲的。

## 安装

首先添加源：

```bash
wget -qO - https://download.opensuse.org/repositories/home:/npreining:/debian-ubuntu-onedrive/xUbuntu_22.04/Release.key | gpg --dearmor | sudo tee /usr/share/keyrings/obs-onedrive.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/obs-onedrive.gpg] https://download.opensuse.org/repositories/home:/npreining:/debian-ubuntu-onedrive/xUbuntu_22.04/ ./" | sudo tee /etc/apt/sources.list.d/onedrive.list
```

安装：

```
sudo apt update
sudo apt install onedrive
```

APT 就是如此的丝滑，这样就安装完成了。

## 使用

所以如果跟我一样可以直接按照下面的步骤操作，如果不同，请参考 [ubuntu-package-install.md](https://github.com/abraunegg/onedrive/blob/master/docs/ubuntu-package-install.md) 进行操作。

首先在命令行执行 `onedrive` 命令，会出现如下提示：

```
$ onedrive 
Authorize this app visiting:

https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=22c49a0d-d21c-4792-aed1-8f163c982546&scope=Files.ReadWrite%20Files.ReadWrite.all%20Sites.ReadWrite.All%20offline_access&response_type=code&redirect_uri=https://login.microsoftonline.com/common/oauth2/nativeclient

Enter the response uri: 
```

这里我们在浏览器访问上面的给出的 URL， 然后按照提示输入邮箱地址，密码，以及允许第三方应用使用token。通过这三步之后，浏览器会出现一个空白页。然后地址栏的URL地址如下：

```
https://login.microsoftonline.com/common/oauth2/nativeclient?code=<redacted>
```

这个时候我们把该地址复制到如上的命令行中，然后回车继续执行，那么执行如下：

```
$ onedrive 
Authorize this app visiting:

https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=22c49a0d-d21c-4792-aed1-8f163c982546&scope=Files.ReadWrite%20Files.ReadWrite.all%20Sites.ReadWrite.All%20offline_access&response_type=code&redirect_uri=https://login.microsoftonline.com/common/oauth2/nativeclient

Enter the response uri: https://login.microsoftonline.com/common/oauth2/nativeclient?code=<redacted>

Application has been successfully authorised, however no additional command switches were provided.

Please use --help for further assistance in regards to running this application.
```

这样 OneDrive 的访问 token 就设置完成了。

## 配置

我安装的 OneDrive 默认不带配置文件的。可以通过以下方式下载配置文件。

```bash
wget https://raw.githubusercontent.com/abraunegg/onedrive/master/config -O ~/.config/onedrive/config
```

这样，就可以对其进行定制化了。

执行以下命令查看相关配置：

```
$ onedrive --display-config
onedrive version                       = v2.4.10-1
Config path                            = /home/baoguoxiao/.config/onedrive
Config file found in config path       = false
Config option 'check_nosync'           = false
Config option 'sync_dir'               = /home/baoguoxiao/OneDrive
Config option 'skip_dir'               = 
Config option 'skip_file'              = ~*|.~*|*.tmp
Config option 'skip_dotfiles'          = false
Config option 'skip_symlinks'          = false
Config option 'monitor_interval'       = 300
Config option 'min_notify_changes'     = 5
Config option 'log_dir'                = /var/log/onedrive/
Config option 'classify_as_big_delete' = 1000
Config option 'upload_only'            = false
Config option 'no_remote_delete'       = false
Config option 'remove_source_files'    = false
Config option 'sync_root_files'        = false
Selective sync 'sync_list' configured  = false
Business Shared Folders configured     = false
```

如果对某些参数不了解，可以参考以下文档地址：

[Configuration](https://github.com/abraunegg/onedrive/blob/master/docs/USAGE.md#configuration)

如果对某些参数不合适，需要进行修改。那么可以在该配置文件 `~/.config/onedrive/config`中进行修改。

## 服务

设置开机启动：

```bash
sudo systemctl --user enable onedrive
```

启动服务：

```bash
systemctl --user start onedrive
```

这样设置成功后就可以不用管它了。后台作为一个服务自动处理。棒棒哒。

## OneDrive 更改密码

如果更改了 OneDrive 密码，那么客户端则不能继续进行同步，会提示如下错误：

```text
ERROR: OneDrive returned a 'HTTP 401 Unauthorized' - Cannot Initialize Sync Engine
```

要重新验证客户端，需要执行以下操作。

1. 停止正在运行的客户端程序，如果是服务，那么就停止服务。
2. 执行 `onedrive --logout` 命令，它将会清理之前的授权，并且按照提示进行重新授权。
3. 重新运行程序即可，如果是服务，则重新启动服务。

## Windows 跟 Linux 使用同一个目录

这里 Windows 的默认配置可能会导致 Linux 无法使用文件，因为 Windows 默认是按需下载，需要修改 Windows 的配置，让其完全下载，否则在 Linux 当前未下载的文件则无法使用。

## 总结

目前只是实现了初步的功能，后续我再观察一下使用情况如何。

## 参考

- [https://github.com/abraunegg/onedrive](https://github.com/abraunegg/onedrive)
- [Installing or Upgrading using Distribution Packages or Building the OneDrive Client for Linux from source](https://github.com/abraunegg/onedrive/blob/master/docs/INSTALL.md)
- [Configuration and Usage of the OneDrive Free Client](https://github.com/abraunegg/onedrive/blob/master/docs/USAGE.md)