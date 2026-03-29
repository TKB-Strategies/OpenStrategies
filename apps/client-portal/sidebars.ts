import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import client from './client.json';
import {
  assertTenantConfig,
  type TenantConfig,
} from '../../packages/tenant-config/src/index';
import { buildClientPortalSidebarItems } from '../../packages/workflow-engine/src/clientPortal.js';

function buildSidebar(): SidebarsConfig {
  assertTenantConfig(client);
  const tenantConfig: TenantConfig = client;
  return {defaultSidebar: buildClientPortalSidebarItems(tenantConfig)};
}

export default buildSidebar();
