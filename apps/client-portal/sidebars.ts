import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import client from './client.json';
import {
  assertTenantConfig,
  buildTenantSidebarItems,
  type TenantConfig,
} from '../../packages/tenant-config/src/index';

function buildSidebar(): SidebarsConfig {
  assertTenantConfig(client);
  const tenantConfig: TenantConfig = client;
  return {defaultSidebar: buildTenantSidebarItems(tenantConfig)};
}

export default buildSidebar();
