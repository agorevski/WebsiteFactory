import { type ThemeName } from './themes';
import type { ThemeMode, ThemeOverrides, WebsiteTheme } from './types';
export declare const defaultThemeName: ThemeName;
export declare function listThemes(): readonly WebsiteTheme<ThemeName>[];
export declare function isThemeName(value: string): value is ThemeName;
export declare function getTheme(name?: ThemeName): WebsiteTheme<ThemeName>;
export declare function resolveTheme(name?: string): WebsiteTheme<ThemeName>;
export declare function resolveThemeMode(theme: WebsiteTheme, requestedMode?: ThemeMode): ThemeMode;
export declare function mergeTheme<TId extends string>(theme: WebsiteTheme<TId>, overrides: ThemeOverrides): WebsiteTheme<TId>;
export declare function themeToCssVariables(theme: WebsiteTheme, mode?: ThemeMode): Record<string, string>;
export declare function themeCssText(theme: WebsiteTheme, mode?: ThemeMode): string;
export declare function themeClassNames(theme: WebsiteTheme, mode?: ThemeMode): readonly string[];
//# sourceMappingURL=engine.d.ts.map