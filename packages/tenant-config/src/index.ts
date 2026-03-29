export type EngagementType =
  | 'cohort-coaching'
  | 'individual-coaching'
  | 'team-coaching'
  | 'consulting'
  | string;

export interface TenantPhase {
  id: string;
  label: string;
  slug: string;
}

export interface ContractTerms {
  duration?: string;
  pricingModel?: string;
  rate?: number;
  totalHours?: number;
  totalValue?: number;
  sessions?: number;
  participants?: number;
  paymentSchedule?: string;
}

export interface TenantConfig {
  orgName: string;
  slug: string;
  primaryContact?: string;
  primaryColor: string;
  secondaryColor: string;
  logoPath: string;
  tagline: string;
  engagementType: EngagementType;
  engagementScope?: string;
  clientPathway?: string;
  phases: TenantPhase[];
  components?: string[];
  frameworks?: string[];
  tools?: string[];
  contractTerms?: ContractTerms;
}

const COACHING_TYPES = new Set(['cohort-coaching', 'individual-coaching']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeHex(hex: string): string {
  const normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    return normalized
      .split('')
      .map((char) => char + char)
      .join('');
  }
  return normalized;
}

export function adjustHex(hex: string, amount: number): string {
  const value = normalizeHex(hex);
  const channels = [0, 2, 4].map((start) =>
    Math.max(
      0,
      Math.min(255, parseInt(value.slice(start, start + 2), 16) + amount),
    ),
  );

  return `#${channels
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function isCoachingEngagement(engagementType: EngagementType): boolean {
  return COACHING_TYPES.has(engagementType);
}

export function assertTenantConfig(config: unknown): asserts config is TenantConfig {
  if (!isRecord(config)) {
    throw new Error('Tenant config must be an object.');
  }

  const requiredStrings = [
    'orgName',
    'slug',
    'primaryColor',
    'secondaryColor',
    'logoPath',
    'tagline',
    'engagementType',
  ] as const;

  for (const key of requiredStrings) {
    if (typeof config[key] !== 'string' || config[key].trim() === '') {
      throw new Error(`Tenant config field "${key}" must be a non-empty string.`);
    }
  }

  if (!Array.isArray(config.phases)) {
    throw new Error('Tenant config field "phases" must be an array.');
  }

  for (const [index, phase] of config.phases.entries()) {
    if (!isRecord(phase)) {
      throw new Error(`Tenant phase at index ${index} must be an object.`);
    }

    for (const key of ['id', 'label', 'slug'] as const) {
      if (typeof phase[key] !== 'string' || phase[key].trim() === '') {
        throw new Error(
          `Tenant phase field "${key}" at index ${index} must be a non-empty string.`,
        );
      }
    }
  }
}

export function createTenantAccentCss(config: TenantConfig): string {
  return `
:root {
  --ifm-color-primary: ${config.primaryColor};
  --ifm-color-primary-dark: ${adjustHex(config.primaryColor, -18)};
  --ifm-color-primary-darker: ${adjustHex(config.primaryColor, -28)};
  --ifm-color-primary-darkest: ${adjustHex(config.primaryColor, -52)};
  --ifm-color-primary-light: ${adjustHex(config.primaryColor, 18)};
  --ifm-color-primary-lighter: ${adjustHex(config.primaryColor, 30)};
  --ifm-color-primary-lightest: ${adjustHex(config.primaryColor, 54)};
  --tkb-accent-secondary: ${config.secondaryColor};
  --tkb-accent-secondary-light: ${adjustHex(config.secondaryColor, 64)};
}

[data-theme='dark'] {
  --ifm-color-primary: ${adjustHex(config.primaryColor, 20)};
  --ifm-color-primary-dark: ${config.primaryColor};
  --ifm-color-primary-darker: ${adjustHex(config.primaryColor, -12)};
  --ifm-color-primary-darkest: ${adjustHex(config.primaryColor, -28)};
  --ifm-color-primary-light: ${adjustHex(config.primaryColor, 42)};
  --ifm-color-primary-lighter: ${adjustHex(config.primaryColor, 58)};
  --ifm-color-primary-lightest: ${adjustHex(config.primaryColor, 76)};
  --tkb-accent-secondary: ${adjustHex(config.secondaryColor, 24)};
  --tkb-accent-secondary-light: ${adjustHex(config.secondaryColor, 78)};
}
`;
}
