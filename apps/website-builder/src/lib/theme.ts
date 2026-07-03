import type { UniversalSite } from './schema';

const templateThemeByPalette = {
  clinic: 'clinic-showcase',
  trade: 'trade-pro',
  hospitality: 'hospitality-editorial',
  professional: 'professional-trust',
} as const;

export type TemplateTheme = (typeof templateThemeByPalette)[keyof typeof templateThemeByPalette];

export function resolveTemplateTheme(site?: UniversalSite): TemplateTheme {
  return site ? templateThemeByPalette[site.theme.palette] : 'professional-trust';
}

export function templateThemeClassName(site?: UniversalSite): `template-${TemplateTheme}` {
  return `template-${resolveTemplateTheme(site)}`;
}
