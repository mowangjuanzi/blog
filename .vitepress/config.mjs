import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "魔王卷子",
  description: "魔王卷子，包含技术博客和相关笔记等",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "PHP 基金会", link: "/php-foundation" },
      { text: "博客", link: "/blog" },
    ],

    sidebar: {
      "/php-foundation": {
        text: "PHP 基金会",
        link: "/php-foundation",
        items: [
          {text: "PHP 基金会祝您节日快乐！", link: "/php-foundation/2024-12-23-happy-holidays-from-the-php-foundation.md"},
          {text: "PHP 基金会支持开源承诺", link: "/php-foundation/open-source-pledge.md"},
          {text: "PHP 核心综述 #19", link: "/php-foundation/php-core-roundup-19.md"}
        ]
      },
      "/blog": {
        text: "博客",
        link: "/blog",
        items: [
          { text: "DOMPDF 输出 PDF & 中文乱码", link: "/blog/dompdf-chinese.md" },
          { text: "Ubuntu 安装 PHP", link: "/blog/ubuntu-apt-php.md" },
        ]
      }
    },

    footer: {
      message: '<a href="https://beian.miit.gov.cn/">鲁ICP备13027795号-1</a>',
      copyright: 'Copyright © 2015-2025 魔王卷子'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mowangjuanzi/blog' }
    ],

    editLink: {
      pattern: "https://github.com/mowangjuanzi/blog/edit/main/docs/:path"
    },

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  }
})
