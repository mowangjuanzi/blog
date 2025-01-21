# Ubuntu 安装 PHP

本文章用于阿里云等云服务器的配置使用。

## 安装

安装源

```bash
sudo add-apt-repository ppa:ondrej/php
```

安装 PHP

```bash
sudo apt install php8.4-fpm php8.4-mbstring php8.4-mysql php8.4-gd php8.4-curl php8.4-zip
```

## 管理 PHP

```bash
# 查看状态
sudo systemctl status php8.4-fpm

# 启动
sudo systemctl start php8.4-fpm

# 重启
sudo systemctl restart php8.4-fpm

# 设置开机启动（默认已开启）
sudo systemctl enable php8.4-fpm

# 取消开机启动
sudo systemctl disable php8.4-fpm

## 自行编译扩展

安装编译扩展所必须的文件

```bash
sudo apt install php8.4-dev
```

传统的编译扩展方式：

```bash
sudo pecl install seaslog
```

最新版的扩展安装方式是 PIE。

官方文档：https://github.com/php/pie

## Composer

安装

```bash
sudo curl -o /usr/local/bin/composer https://getcomposer.org/download/latest-stable/composer.phar
sudo chmod +x /usr/local/bin/composer
```

## 相关路径

| 英文名称 | 路径 | 说明 |
|:---:|:---:|:---:|
| config | /etc/php/8.4 | 配置文件路径 |
| log | /var/log/php8.4-fpm.log | FPM 日志 |

## 配置

编辑 `/etc/php/8.4/fpm/pool.d/www.conf`

里面主要是修改三个配置：

```ini
user = www-data
group = www-data
```

这里主要是指定运行 FPM worker 的用户和用户组。我比较喜欢用 `www-data`。

```ini
listen = 127.0.0.1:900
```

listen 监听的方式，有端口和 unix 域两种，我喜欢修改为端口的方式。

# 结尾

以上就是我一些常在服务器上进行配置的相关命令。
