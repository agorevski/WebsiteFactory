export type ThemeMode = 'light' | 'dark' | 'highContrast';
export type ThemeColorRole = 'background' | 'surface' | 'surfaceAlt' | 'text' | 'textMuted' | 'textInverse' | 'primary' | 'primaryForeground' | 'secondary' | 'secondaryForeground' | 'accent' | 'accentForeground' | 'border' | 'focus' | 'success' | 'warning' | 'danger' | 'link' | 'overlay';
export type TypographyRole = 'display' | 'heading' | 'body' | 'caption' | 'button';
export type SpacingRole = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'section' | 'container';
export type RadiusRole = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'full';
export type ElevationRole = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
export interface ThemeColorTokens extends Record<ThemeColorRole, string> {
}
export interface TypographyToken {
    readonly fontFamily: string;
    readonly fontSize: string;
    readonly lineHeight: string;
    readonly fontWeight: string;
    readonly letterSpacing?: string;
}
export interface ButtonToken {
    readonly background: string;
    readonly color: string;
    readonly border: string;
    readonly hoverBackground: string;
    readonly hoverColor: string;
    readonly radius: RadiusRole;
    readonly padding: string;
    readonly shadow: ElevationRole;
}
export interface AnimationTokens {
    readonly durationFast: string;
    readonly durationBase: string;
    readonly durationSlow: string;
    readonly easingStandard: string;
    readonly easingEmphasized: string;
}
export interface NavigationTokens {
    readonly layout: 'centered' | 'split' | 'stacked' | 'sidebar';
    readonly background: ThemeColorRole;
    readonly foreground: ThemeColorRole;
    readonly linkHover: ThemeColorRole;
    readonly border: ThemeColorRole;
    readonly sticky: boolean;
    readonly height: string;
    readonly blur: boolean;
}
export interface FooterTokens {
    readonly layout: 'simple' | 'columns' | 'centered' | 'rich';
    readonly background: ThemeColorRole;
    readonly foreground: ThemeColorRole;
    readonly link: ThemeColorRole;
    readonly border: ThemeColorRole;
    readonly density: 'compact' | 'comfortable' | 'spacious';
}
export interface ThemeTokens {
    readonly modes: Record<ThemeMode, ThemeColorTokens>;
    readonly typography: Record<TypographyRole, TypographyToken>;
    readonly spacing: Record<SpacingRole, string>;
    readonly radius: Record<RadiusRole, string>;
    readonly elevation: Record<ElevationRole, string>;
    readonly buttons: Record<ButtonVariant, ButtonToken>;
    readonly animation: AnimationTokens;
    readonly navigation: NavigationTokens;
    readonly footer: FooterTokens;
}
export interface WebsiteTheme<TId extends string = string> {
    readonly id: TId;
    readonly displayName: string;
    readonly description: string;
    readonly defaultMode: ThemeMode;
    readonly supportedModes: readonly ThemeMode[];
    readonly tokens: ThemeTokens;
    readonly tags: readonly string[];
}
export type ThemeOverrides = Partial<Omit<WebsiteTheme, 'id' | 'tokens'>> & {
    readonly tokens?: Partial<ThemeTokens>;
};
//# sourceMappingURL=types.d.ts.map