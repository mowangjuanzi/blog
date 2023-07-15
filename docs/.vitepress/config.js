import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "魔王卷子",
  description: "魔王卷子，包含技术博客和相关笔记等",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    footer: {
      message: '<a href="https://beian.miit.gov.cn/">鲁ICP备13027795号-1</a>',
      copyright: 'Copyright © 2015-2023 魔王卷子'
    },

    sidebar: {
      "/blog/": [
        {
          text: "博客",
          link: "/blog/",
          items: [{
              text: "2023",
              items: [{
                text: "APP webview 加载优化", link: "/blog/app-webview-optimization",
              }]
            }, {
              text: "2022",
              items: [{
                text: "Linux 下安装 Node.js", link: "/blog/linux-install-nodejs"
              }]
            }, {
              text: "2019",
              items: [{
                text: "PHP 之内置 Web 服务器", link: "/blog/php-built-in-web-server"
              }]
            }]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mowangjuanzi/blog' }
    ]
  }
})
