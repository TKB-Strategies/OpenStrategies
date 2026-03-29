import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import client from './client.json';
import {
  assertTenantConfig,
  createTenantAccentCss,
  type TenantConfig,
} from '../../packages/tenant-config/src/index';

assertTenantConfig(client);
const tenantConfig: TenantConfig = client;
const clientAccentCss = createTenantAccentCss(tenantConfig);

const config: Config = {
  title: tenantConfig.orgName,
  tagline: tenantConfig.tagline,
  favicon: 'img/favicon.ico',
  future: {
    v4: true,
  },
  url: `https://${tenantConfig.slug}.tkbstrategies.com`,
  baseUrl: '/',
  organizationName: 'TKB-Strategies',
  projectName: 'client-site-template',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  stylesheets: [
    `data:text/css;charset=utf-8,${encodeURIComponent(clientAccentCss)}`,
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          exclude: ['**/CLAUDE.md'],
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: tenantConfig.orgName,
      logo: {
        alt: 'Client Site Template Logo',
        src: tenantConfig.logoPath,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'defaultSidebar',
          position: 'left',
          label: 'Engagement',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright:
        'Powered by <a href="https://tkbstrategies.com" target="_blank" rel="noopener noreferrer">TKB Strategies</a>',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
