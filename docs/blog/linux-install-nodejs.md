---
date: 2022-08-20 23:38:58
---
# Linux 下安装 Node.js

虽然名字说的是 JavaScript。但是实际上这里所所的是 Node.js 运行时。

Node.js® 是一个基于 Chrome V8 引擎 的 JavaScript 运行时环境。

## 安装 Node.js

因为 Ubuntu 自带的 Node.js 版本实在是太低了，因为使用的最低版本至少要追上 LTS。所以使用官方推荐的源进行安装。

首先添加源：

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
```

安装 NodeJS 和 Npm：

```bash
sudo apt install -y nodejs
```

查看版本：

```bash
$ node -v
v16.17.0
$ npm -v
8.15.0
```

可能你安装的时候 npm 不是最新版本，可以使用如下命令更新到最新版本：

```bash
sudo npm install --location=global npm
```

## 安装 pnpm 及其其他的包管理

> corepack 是包管理器的管理器。具体看[废宅阿斗 NPM 即将被 Node.js 官方抛弃 → Corepack](https://zhuanlan.zhihu.com/p/408122100)

直接执行如下命令即可：

```bash
sudo corepack enable
```

查看版本（这里需要等一下，因为需要下载包）：

```bash
$ pnpm -v
8.6.7
```

其实开启后不仅仅支持 pnpm。下面这些也都支持：

```bash
$ ls /usr/lib/node_modules/corepack/dist/
corepack.js  npm.js  npx.js  pnpm.js  pnpx.js  yarn.js  yarnpkg.js
```

## 设置镜像

这里需要注意的是，[淘宝镜像已停止解析](https://zhuanlan.zhihu.com/p/465424728) ，需要使用 [npmmirror](https://www.npmmirror.com/) 进行替换。

- npm

```bash
sudo npm config set registry https://registry.npmmirror.com
```

- pnpm

```bash
pnpm config set registry https://registry.npmmirror.com
```