---
title: 控制 nginx【译】
date: 2019-12-29 09:00:00
updated: 2022-05-02 14:43:19
tags:
- nginx
- 信号
categories:
- Web 服务器
- nginx
---

> 原文地址：[Controlling nginx](http://nginx.org/en/docs/control.html)

nginx 可以用信号来控制。默认 master 进程的进程 ID 写入到 `/usr/local/nginx/logs/nginx.pid` 文件。这个文件名称可以在配置时或者在 `nginx.conf` 中使用 [pid](http://nginx.org/en/docs/ngx_core_module.html#pid) 指令更改。master 进程支持以下信号：

<!-- more -->

| 信号 | 描述 |
| :---: | :---: |
| `TERM`，`INT` | 快速关闭 |
| `QUIT` | 平滑关闭 |
| `HUP` | 更改配置, 保持已改变的时区 (仅限于 FreeBSD 和 Linux)，使用新配置启动新的 worker 进程，平滑关闭旧的 worker 进程 |
| `USR1` | 重新打开日志文件 |
| `USR2` | 升级可执行文件 |
| `WINCH` | 平滑关闭 worker 进程 |


个别 worker 进程也可以用信号来控制, 尽管这不是必须的. 支持的信号有:

| 信号 | 描述 |
| :---: | :---: |
| `TERM`，`INT` | 快速关闭 |
| `QUIT` | 平滑关闭 |
| `USR1` | 重新打开日志文件 |
| `WINCH` | 调试异常终止 (需要启用 [debug_points](http://nginx.org/en/docs/ngx_core_module.html#debug_points) ) |

## 更改配置

为了让 nginx 重新读取配置文件，应将 `HUP` 信号发送到 master 进程。master 进程首先检查语法的有效性，然后尝试应用新配置，即打开日志文件和新的 listen 套接字。如果失败，将回滚更改并继续使用旧配置。如果成功，它开始新的 worker 进程，并发消息到旧的 worker 进程, 要求它们平滑关闭。旧的 worker 进程关闭 listen 套接字然后继续服务旧的客户端。旧的 worker 进程在为所有的客户端提供服务后将会关闭。

让我们举例说明。想象一下 nginx 在 FreeBSD 上运行，并且执行命令

```bash
ps axw -o pid,ppid,user,%cpu,vsz,wchan,command | egrep '(nginx|PID)'
```

生成以下输出：

```bash
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
33127 33126 nobody   0.0  1380 kqread nginx: worker process (nginx)
33128 33126 nobody   0.0  1364 kqread nginx: worker process (nginx)
33129 33126 nobody   0.0  1364 kqread nginx: worker process (nginx)
```

如果 `HUP` 发送到 master 进程，输出则变为：

```bash
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
33129 33126 nobody   0.0  1380 kqread nginx: worker process is shutting down (nginx)
33134 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
33135 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
33136 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
```

一个旧的 PID 为 33129 的 worker 进程仍然可以继续工作。一段时间后，它将会退出：

```bash
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
33134 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
33135 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
33136 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
```

## 轮换日志文件

为了切换日志文件，首先需要将其重命名。之后，应发送 `USR1` 信号到 master 进程。master 进程将重新打开所有当前打开的日志文件，并将这些文件分配给非特权用户，该用户作为所有者运行工作进程。成功重新打开后，master 进程将关闭所有打开的文件并发送消息给 worker 进程，要求它们重新打开文件。worker 进程会立即重新打开新文件并关闭旧文件。最后，旧的日志文件几乎可以立即用于压缩等后期处理。

## 在线升级可执行文件

正在运行的服务器升级，新的可执行文件应该首先取代旧的文件。然后发送 `USR2` 信号到 master 进程。master 进程首先将带有进程 ID 的文件重命名带有 `.oldbin` 后缀的新文件，例如 `/usr/local/nginx/logs/nginx.pid.oldbin`，然后启动一个新的可执行文件，该文件又启动新的 worker 进程：

```bash
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
33134 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
33135 33126 nobody   0.0  1380 kqread nginx: worker process (nginx)
33136 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
36264 33126 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
```

之后所有的 worker 进程 (旧的和新的) 继续接受请求。如果发送 `WINCH` 信号到第一个 master 进程，它将会向其 worker 进程发送消息，请求它们平滑关闭，然后将开始退出：

```bash
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
33135 33126 nobody   0.0  1380 kqread nginx: worker process is shutting down (nginx)
36264 33126 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
```

一段时间后，只有新的 worker 进程将会处理请求：

```bash
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
36264 33126 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
```

需要注意的是，旧的 master 进程没有关闭它的 listen 套接字，如果需要，它会重新启动它的 worker 进程。如果由于某种原因，新的可执行文件运行难以接受，可以选择下面之一进行操作：

- 发送 `HUP` 信号给旧的 master 进行。旧的 master 进程将会启动新的 worker 进程而无需重新读取配置。然后，发送 `QUIT` 信号到新的 master 进程，可以优平滑关闭所有的新进程。
- 向新 master 进程发送 `TERM` 信号。它将向 worker 进程发送一条消息，请求它们立即退出，随即他们将会全部退出。（如果新的进程因为某种原因不能退出，将会发送 `KILL` 并强制退出。）当新的 master 进程退出时，旧的 master 进程将会自动启动新的 worker 进程。

如果新的 master 进程退出然后旧的 master 进程会从带有进程 ID 的文件名中丢弃 `.oldbin` 后缀。

如果升级成功，然后 `QUIT` 信号则发送到旧的 master 进程，只有新的进程将会保留：

```bash
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
36264     1 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
```
