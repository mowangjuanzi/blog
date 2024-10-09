---
outline: deep
---

# PHP 基金会

- [博客](https://thephp.foundation/blog/)

## PHP 基金会团队

<VPTeamPage>
  <VPTeamPageSection>
    <template #title>理事会</template>
    <template #lead>理事会由资深 PHP 核心开发人员、PHP 社区领导者、创始公司代表和其他主要利益相关者组成。</template>
    <template #members>
      <VPTeamMembers size="small" :members="board" />
    </template>
  </VPTeamPageSection>

</VPTeamPage>

<script setup>
import { 
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
 } from 'vitepress/theme'

const board = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/25218?s=200&v=4',
    name: 'Sebastian Bergmann',
    desc: "理事会成员",
    links: [
      { icon: 'github', link: 'https://github.com/sebastianbergmann' },
      { icon: 'mastodon', link: 'https://phpc.social/@sebastian' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/2236138?s=200&v=4',
    name: 'Joe Watkins',
    desc: "理事会成员",
    links: [
      { icon: 'github', link: 'https://github.com/krakjoe' },
      { icon: 'twitter', link: 'https://twitter.com/krakjoe' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/154844?s=200&v=4',
    name: 'Nils Adermann',
    org: "Private Packagist",
    desc: "理事会成员",
    links: [
      { icon: 'github', link: 'https://github.com/naderman' },
      { icon: 'twitter', link: 'https://twitter.com/naderman' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/26936?s=200&v=4',
    name: 'Benjamin Eberlei',
    org: "Tideways",
    desc: "理事会成员",
    links: [
      { icon: 'github', link: 'https://github.com/beberlei' },
      { icon: 'twitter', link: 'https://twitter.com/beberlei' }
    ]
  },
  {
    avatar: 'https://2.gravatar.com/avatar/b1384df9e94641211dd00e4e8203d80c?s=200',
    name: 'Josepha Haden',
    org: "Automattic",
    desc: "理事会成员",
    links: [
      { icon: 'twitter', link: 'https://twitter.com/JosephaHaden' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/1196825?s=200&v=4',
    name: 'Roman Pronskiy',
    org: "JetBrains",
    desc: "理事会成员，运营经理",
    links: [
      { icon: 'github', link: 'https://github.com/pronskiy' },
      { icon: 'twitter', link: 'https://twitter.com/pronskiy' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/243674?s=200&v=4',
    name: 'Nicolas Grekas',
    org: "Symfony",
    desc: "理事会成员",
    links: [
      { icon: 'github', link: 'https://github.com/nicolas-grekas' },
      { icon: 'twitter', link: 'https://twitter.com/nicolasgrekas' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/812538?s=200&v=4',
    name: 'Sara Golemon',
    desc: "理事会成员",
    links: [
      { icon: 'github', link: 'https://github.com/sgolemon' },
      { icon: 'mastodon', link: 'https://phpc.social/@pollita' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/216080?s=200&v=4',
    name: 'Nikita Popov',
    desc: "理事会成员",
    links: [
      { icon: 'github', link: 'https://github.com/nikic' },
      { icon: 'twitter', link: 'https://twitter.com/nikita_ppv' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/25943?s=200&v=4',
    name: 'Matthew Weier O\'Phinney',
    org: "Perforce",
    desc: "理事会成员",
    links: [
      { icon: 'github', link: 'https://github.com/weierophinney' },
      { icon: 'mastodon', link: 'https://phpc.social/@mwop' }
    ]
  },
];
</script>