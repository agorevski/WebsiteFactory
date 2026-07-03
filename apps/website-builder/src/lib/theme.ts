import {
  isThemeName,
  resolveTheme as resolveRegisteredTheme,
  themeClassNames,
  themeCssText,
  type ThemeMode,
  type ThemeName,
  type WebsiteTheme,
} from '@website-factory/themes';
import type { UniversalSite } from './schema.ts';

const templateThemeByPalette = {
  clinic: 'clinic-showcase',
  trade: 'trade-pro',
  hospitality: 'hospitality-editorial',
  professional: 'professional-trust',
} as const satisfies Record<UniversalSite['theme']['palette'], ThemeName>;

const themeModeByUniversalMode = {
  light: 'light',
  dark: 'dark',
} as const satisfies Record<UniversalSite['theme']['mode'], ThemeMode>;

export type TemplateTheme = (typeof templateThemeByPalette)[keyof typeof templateThemeByPalette];

function normalizeThemeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveThemeName(site: UniversalSite): ThemeName {
  const themeName = site.theme.name.trim();

  if (isThemeName(themeName)) {
    return themeName;
  }

  const normalizedName = normalizeThemeName(themeName);
  return isThemeName(normalizedName) ? normalizedName : templateThemeByPalette[site.theme.palette];
}

export function resolveTemplateTheme(site?: UniversalSite): TemplateTheme {
  return site ? templateThemeByPalette[site.theme.palette] : 'professional-trust';
}

export function templateThemeClassName(site?: UniversalSite): `template-${TemplateTheme}` {
  return `template-${resolveTemplateTheme(site)}`;
}

export function resolveUniversalTheme(site?: UniversalSite): WebsiteTheme {
  return resolveRegisteredTheme(site ? resolveThemeName(site) : templateThemeByPalette.professional);
}

export function resolveUniversalThemeMode(site?: UniversalSite): ThemeMode {
  return site ? themeModeByUniversalMode[site.theme.mode] : 'light';
}

export function siteThemeCssText(site?: UniversalSite): string {
  return themeCssText(resolveUniversalTheme(site), resolveUniversalThemeMode(site));
}

export function siteThemeClassNames(site?: UniversalSite): string {
  const theme = resolveUniversalTheme(site);
  const mode = resolveUniversalThemeMode(site);
  const paletteClass = site ? `theme-${site.theme.palette}` : 'theme-professional';

  return [...themeClassNames(theme, mode), paletteClass, templateThemeClassName(site)].join(' ');
}
