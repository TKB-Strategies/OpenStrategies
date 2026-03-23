// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TKB Strategies',
  tagline: 'Open frameworks for mission-driven organizations',
  favicon: 'img/favicon.ico',

  url: 'https://tkb-strategies.github.io',
  baseUrl: '/OpenStrategies/',

  organizationName: 'TKB-Strategies',
  projectName: 'OpenStrategies',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/TKB-Strategies/OpenStrategies/tree/main/site/',
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'Building in Public',
          blogDescription:
            'Notes from building an open consulting company — strategy, tools, and methodology in the open.',
          blogSidebarTitle: 'Recent entries',
          blogSidebarCount: 8,
          editUrl:
            'https://github.com/TKB-Strategies/OpenStrategies/tree/main/site/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'TKB Strategies',
        hideOnScroll: true,
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'frameworksSidebar',
            position: 'left',
            label: 'Frameworks',
          },
          {
            to: '/blog',
            label: 'Journal',
            position: 'left',
          },
          {
            href: 'https://tkbstrategies.com',
            label: 'Main Site',
            position: 'right',
          },
          {
            href: 'https://github.com/TKB-Strategies/OpenStrategies',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Frameworks',
            items: [
              {
                label: 'Compassionate Agility',
                to: '/docs/frameworks/compassionate-agility',
              },
              {
                label: 'Liberation Mapping',
                to: '/docs/frameworks/liberation-mapping',
              },
              {
                label: "Steward's Manual",
                to: '/docs/frameworks/stewards-manual',
              },
            ],
          },
          {
            title: 'Tools & Resources',
            items: [
              {
                label: 'Workplace Patterns Quiz',
                to: '/docs/tools/quiz',
              },
              {
                label: 'Workshop Templates',
                to: '/docs/workshops',
              },
              {
                label: 'Project Roadmap',
                to: '/docs/project/roadmap',
              },
            ],
          },
          {
            title: 'Connect',
            items: [
              {
                label: 'TKB Strategies',
                href: 'https://tkbstrategies.com',
              },
              {
                label: 'Work with Me',
                href: 'https://tkbstrategies.com/work-with-me/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/TKB-Strategies/OpenStrategies',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} TKB Strategies. Frameworks and tools licensed under MIT.`,
      },
    }),
};

export default config;
