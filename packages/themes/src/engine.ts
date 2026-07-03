import { themes, type ThemeName } from './themes.js';
import type { ThemeMode, ThemeOverrides, ThemeTokens, WebsiteTheme } from './types.js';

export const defaultThemeName: ThemeName = 'modern';

export function listThemes(): readonly WebsiteTheme<ThemeName>[] {
  return Object.values(themes);
}

export function isThemeName(value: string): value is ThemeName {
  return Object.prototype.hasOwnProperty.call(themes, value);
}

export function getTheme(name: ThemeName = defaultThemeName): WebsiteTheme<ThemeName> {
  return themes[name];
}

export function resolveTheme(name?: string): WebsiteTheme<ThemeName> {
  return name && isThemeName(name) ? getTheme(name) : getTheme(defaultThemeName);
}

export function resolveThemeMode(theme: WebsiteTheme, requestedMode?: ThemeMode): ThemeMode {
  if (requestedMode && theme.supportedModes.includes(requestedMode)) {
    return requestedMode;
  }

  return theme.defaultMode;
}

export function mergeTheme<TId extends string>(theme: WebsiteTheme<TId>, overrides: ThemeOverrides): WebsiteTheme<TId> {
  return {
    ...theme,
    ...overrides,
    id: theme.id,
    tokens: {
      ...theme.tokens,
      ...overrides.tokens
    }
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const radiusRoles = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'pill', 'full'];
const elevationRoles = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const containerRoles = ['narrow', 'content', 'wide', 'full', 'prose'];

function resolveReferencedValue(prefix: string, value: string): string {
  if (radiusRoles.includes(value) && prefix.endsWith('-radius')) {
    return `var(--wf-radius-${value})`;
  }

  if (elevationRoles.includes(value) && (prefix.endsWith('-shadow') || prefix.endsWith('-hover-shadow'))) {
    return `var(--wf-elevation-${value})`;
  }

  if (containerRoles.includes(value) && (prefix.endsWith('-container') || prefix.endsWith('-max-width'))) {
    return `var(--wf-containers-${value})`;
  }

  return value;
}

function flattenTokens(prefix: string, value: unknown, target: Record<string, string>): void {
  if (typeof value === 'string') {
    target[prefix] = resolveReferencedValue(prefix, value);
    return;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    target[prefix] = String(value);
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    flattenTokens(`${prefix}-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, nestedValue, target);
  }
}

export function themeToCssVariables(theme: WebsiteTheme, mode: ThemeMode = theme.defaultMode): Record<string, string> {
  const resolvedMode = resolveThemeMode(theme, mode);
  const variables: Record<string, string> = {};
  const { modes, ...sharedTokens } = theme.tokens;
  const tokenGroups: Omit<ThemeTokens, 'modes'> & { readonly colors: ThemeTokens['modes'][ThemeMode] } = {
    colors: modes[resolvedMode],
    ...sharedTokens
  };

  for (const [group, value] of Object.entries(tokenGroups)) {
    flattenTokens(`--wf-${group}`, value, variables);
  }

  return variables;
}

export function themeCssText(theme: WebsiteTheme, mode: ThemeMode = theme.defaultMode): string {
  return Object.entries(themeToCssVariables(theme, mode))
    .map(([property, value]) => `${property}: ${value};`)
    .join('\n');
}

export function themeClassNames(theme: WebsiteTheme, mode: ThemeMode = theme.defaultMode): readonly string[] {
  return [`theme-${theme.id}`, `theme-mode-${resolveThemeMode(theme, mode)}`];
}
