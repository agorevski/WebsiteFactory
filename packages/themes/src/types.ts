export type ThemeMode = 'light' | 'dark' | 'highContrast';

export type ThemeColorRole =
  | 'background'
  | 'surface'
  | 'surfaceAlt'
  | 'text'
  | 'textMuted'
  | 'textInverse'
  | 'primary'
  | 'primaryForeground'
  | 'secondary'
  | 'secondaryForeground'
  | 'accent'
  | 'accentForeground'
  | 'border'
  | 'focus'
  | 'success'
  | 'warning'
  | 'danger'
  | 'link'
  | 'overlay';

export type TypographyRole = 'display' | 'heading' | 'body' | 'caption' | 'button' | 'mono';
export type SpacingRole = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'section' | 'container';
export type RadiusRole = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill' | 'full';
export type ElevationRole = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
export type CardVariant = 'standard' | 'feature' | 'testimonial' | 'pricing';
export type BreakpointRole = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ContainerRole = 'narrow' | 'content' | 'wide' | 'full' | 'prose';
export type SectionRole = 'services' | 'proof' | 'process' | 'testimonials' | 'faq' | 'content';
export type PageTemplateRole = 'landing' | 'standard' | 'article' | 'directory' | 'docs' | 'checkout';
export type MotionPresetRole = 'instant' | 'subtle' | 'standard' | 'expressive' | 'entrance';

export interface ThemeColorTokens extends Record<ThemeColorRole, string> {}

export interface TypographyToken {
  readonly fontFamily: string;
  readonly fontSize: string;
  readonly lineHeight: string;
  readonly fontWeight: string;
  readonly letterSpacing?: string;
  readonly textTransform?: string;
}

export interface ButtonToken {
  readonly background: string;
  readonly color: string;
  readonly border: string;
  readonly hoverBackground: string;
  readonly hoverColor: string;
  readonly hoverBorder: string;
  readonly radius: RadiusRole;
  readonly padding: string;
  readonly minHeight: string;
  readonly shadow: ElevationRole;
  readonly hoverShadow: ElevationRole;
  readonly transform: string;
}

export interface CardToken {
  readonly background: string;
  readonly foreground: string;
  readonly border: string;
  readonly radius: RadiusRole;
  readonly padding: string;
  readonly gap: string;
  readonly shadow: ElevationRole;
  readonly hoverShadow: ElevationRole;
  readonly mediaRadius: RadiusRole;
}

export interface AnimationTokens {
  readonly durationFast: string;
  readonly durationBase: string;
  readonly durationSlow: string;
  readonly easingStandard: string;
  readonly easingEmphasized: string;
}

export interface MotionPresetToken {
  readonly duration: string;
  readonly easing: string;
  readonly translateY: string;
  readonly scale: string;
  readonly opacity: string;
}

export interface ResponsiveTokens {
  readonly breakpoints: Record<BreakpointRole, string>;
  readonly containerPadding: Record<BreakpointRole, string>;
  readonly sectionSpacing: Record<BreakpointRole, string>;
  readonly gridColumns: Record<BreakpointRole, string>;
}

export interface HeroTokens {
  readonly layout: 'split' | 'centered' | 'media' | 'editorial' | 'app' | 'docs';
  readonly background: string;
  readonly foreground: string;
  readonly eyebrowColor: string;
  readonly mediaShape: 'rounded' | 'circle' | 'arch' | 'device' | 'bleed' | 'none';
  readonly minHeight: string;
  readonly contentWidth: string;
  readonly gap: string;
  readonly overlay: string;
}

export interface FormTokens {
  readonly background: string;
  readonly foreground: string;
  readonly border: string;
  readonly focusBorder: string;
  readonly fieldBackground: string;
  readonly fieldForeground: string;
  readonly fieldBorder: string;
  readonly radius: RadiusRole;
  readonly padding: string;
  readonly labelTransform: string;
  readonly shadow: ElevationRole;
}

export interface NavigationTokens {
  readonly layout: 'centered' | 'split' | 'stacked' | 'sidebar';
  readonly background: string;
  readonly foreground: string;
  readonly linkHover: string;
  readonly border: string;
  readonly sticky: boolean;
  readonly height: string;
  readonly blur: boolean;
  readonly shadow: ElevationRole;
  readonly activeIndicator: 'underline' | 'pill' | 'dot' | 'block' | 'none';
}

export interface FooterTokens {
  readonly layout: 'simple' | 'columns' | 'centered' | 'rich';
  readonly background: string;
  readonly foreground: string;
  readonly link: string;
  readonly border: string;
  readonly density: 'compact' | 'comfortable' | 'spacious';
  readonly divider: boolean;
  readonly socialIconStyle: 'plain' | 'outlined' | 'filled' | 'soft';
}

export interface PageTemplateToken {
  readonly maxWidth: ContainerRole;
  readonly background: string;
  readonly surface: string;
  readonly headerSpacing: string;
  readonly bodySpacing: string;
  readonly sidebarWidth: string;
  readonly grid: string;
}

export interface SectionDefaultToken {
  readonly background: string;
  readonly foreground: string;
  readonly eyebrowColor: string;
  readonly alignment: 'start' | 'center' | 'end';
  readonly spacingBlock: string;
  readonly spacingInline: string;
  readonly container: ContainerRole;
  readonly cardVariant: CardVariant;
}

export interface IconTokens {
  readonly style: 'line' | 'solid' | 'duotone' | 'filled' | 'minimal';
  readonly size: string;
  readonly strokeWidth: string;
  readonly background: string;
  readonly foreground: string;
  readonly radius: RadiusRole;
}

export interface ThemeTokens {
  readonly modes: Record<ThemeMode, ThemeColorTokens>;
  readonly typography: Record<TypographyRole, TypographyToken>;
  readonly spacing: Record<SpacingRole, string>;
  readonly radius: Record<RadiusRole, string>;
  readonly elevation: Record<ElevationRole, string>;
  readonly buttons: Record<ButtonVariant, ButtonToken>;
  readonly cards: Record<CardVariant, CardToken>;
  readonly animation: AnimationTokens;
  readonly motion: Record<MotionPresetRole, MotionPresetToken>;
  readonly responsive: ResponsiveTokens;
  readonly containers: Record<ContainerRole, string>;
  readonly hero: HeroTokens;
  readonly forms: FormTokens;
  readonly navigation: NavigationTokens;
  readonly footer: FooterTokens;
  readonly pageTemplates: Record<PageTemplateRole, PageTemplateToken>;
  readonly sections: Record<SectionRole, SectionDefaultToken>;
  readonly icons: IconTokens;
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

export interface ThemeTokenOverrides {
  readonly modes?: {
    readonly light?: Partial<ThemeColorTokens>;
    readonly dark?: Partial<ThemeColorTokens>;
    readonly highContrast?: Partial<ThemeColorTokens>;
  };
  readonly typography?: {
    readonly display?: Partial<TypographyToken>;
    readonly heading?: Partial<TypographyToken>;
    readonly body?: Partial<TypographyToken>;
    readonly caption?: Partial<TypographyToken>;
    readonly button?: Partial<TypographyToken>;
    readonly mono?: Partial<TypographyToken>;
  };
  readonly spacing?: Partial<Record<SpacingRole, string>>;
  readonly radius?: Partial<Record<RadiusRole, string>>;
  readonly elevation?: Partial<Record<ElevationRole, string>>;
  readonly buttons?: {
    readonly primary?: Partial<ButtonToken>;
    readonly secondary?: Partial<ButtonToken>;
    readonly ghost?: Partial<ButtonToken>;
    readonly link?: Partial<ButtonToken>;
  };
  readonly cards?: {
    readonly standard?: Partial<CardToken>;
    readonly feature?: Partial<CardToken>;
    readonly testimonial?: Partial<CardToken>;
    readonly pricing?: Partial<CardToken>;
  };
  readonly animation?: Partial<AnimationTokens>;
  readonly motion?: {
    readonly instant?: Partial<MotionPresetToken>;
    readonly subtle?: Partial<MotionPresetToken>;
    readonly standard?: Partial<MotionPresetToken>;
    readonly expressive?: Partial<MotionPresetToken>;
    readonly entrance?: Partial<MotionPresetToken>;
  };
  readonly responsive?: {
    readonly breakpoints?: Partial<Record<BreakpointRole, string>>;
    readonly containerPadding?: Partial<Record<BreakpointRole, string>>;
    readonly sectionSpacing?: Partial<Record<BreakpointRole, string>>;
    readonly gridColumns?: Partial<Record<BreakpointRole, string>>;
  };
  readonly containers?: Partial<Record<ContainerRole, string>>;
  readonly hero?: Partial<HeroTokens>;
  readonly forms?: Partial<FormTokens>;
  readonly navigation?: Partial<NavigationTokens>;
  readonly footer?: Partial<FooterTokens>;
  readonly pageTemplates?: {
    readonly landing?: Partial<PageTemplateToken>;
    readonly standard?: Partial<PageTemplateToken>;
    readonly article?: Partial<PageTemplateToken>;
    readonly directory?: Partial<PageTemplateToken>;
    readonly docs?: Partial<PageTemplateToken>;
    readonly checkout?: Partial<PageTemplateToken>;
  };
  readonly sections?: {
    readonly services?: Partial<SectionDefaultToken>;
    readonly proof?: Partial<SectionDefaultToken>;
    readonly process?: Partial<SectionDefaultToken>;
    readonly testimonials?: Partial<SectionDefaultToken>;
    readonly faq?: Partial<SectionDefaultToken>;
    readonly content?: Partial<SectionDefaultToken>;
  };
  readonly icons?: Partial<IconTokens>;
}

export type ThemeOverrides = Partial<Omit<WebsiteTheme, 'id' | 'tokens'>> & {
  readonly tokens?: Partial<ThemeTokens>;
};
