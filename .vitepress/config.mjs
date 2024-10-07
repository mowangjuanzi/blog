import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "魔王卷子",
  description: "魔王卷子，包含技术博客和相关笔记等",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [],

    footer: {
      message: '<a href="https://beian.miit.gov.cn/">鲁ICP备13027795号-1</a>',
      copyright: 'Copyright © 2015-2023 魔王卷子'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mowangjuanzi/blog' }
    ]
  }
})
