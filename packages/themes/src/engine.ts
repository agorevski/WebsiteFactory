import { themes, type ThemeName } from './themes';
import type { ThemeMode, ThemeOverrides, ThemeTokens, WebsiteTheme } from './types';

export const defaultThemeName: ThemeName = 'modern';

export function listThemes(): readonly WebsiteTheme<ThemeName>[] {
  return Object.values(themes) as readonly WebsiteTheme<ThemeName>[];
}

export function isThemeName(value: string): value is ThemeName {
  return Object.prototype.hasOwnProperty.call(themes, value);
}

export function getTheme(name: ThemeName = defaultThemeName): WebsiteTheme<ThemeName> {
  return themes[name] as WebsiteTheme<ThemeName>;
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

function flattenTokens(prefix: string, value: unknown, target: Record<string, string>): void {
  if (typeof value === 'string' || typeof value === 'number') {
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
  const tokenGroups: Omit<ThemeTokens, 'modes'> & { readonly colors: ThemeTokens['modes'][ThemeMode] } = {
    colors: theme.tokens.modes[resolvedMode],
    typography: theme.tokens.typography,
    spacing: theme.tokens.spacing,
    radius: theme.tokens.radius,
    elevation: theme.tokens.elevation,
    buttons: theme.tokens.buttons,
    animation: theme.tokens.animation,
    navigation: theme.tokens.navigation,
    footer: theme.tokens.footer
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
