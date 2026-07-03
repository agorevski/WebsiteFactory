import type {
  IconTokens,
  NavigationTokens,
  RadiusRole,
  ThemeColorRole,
  ThemeColorTokens,
  ThemeMode,
  ThemeTokenOverrides,
  ThemeTokens,
  WebsiteTheme
} from './types.js';

type NonModeTokenOverrides = Omit<ThemeTokenOverrides, 'modes'>;

interface ThemeConfig<TId extends string> {
  readonly id: TId;
  readonly displayName: string;
  readonly description: string;
  readonly defaultMode?: ThemeMode;
  readonly supportedModes?: readonly ThemeMode[];
  readonly tokens?: ThemeTokenOverrides;
  readonly tags: readonly string[];
}

function kebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function color(role: ThemeColorRole): string {
  return `var(--wf-colors-${kebabCase(role)})`;
}

function colorMix(role: ThemeColorRole, mix: string): string {
  return `color-mix(in srgb, ${color(role)}, ${mix})`;
}

const lightNeutral: ThemeColorTokens = {
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceAlt: '#eef2f7',
  text: '#0f172a',
  textMuted: '#475569',
  textInverse: '#ffffff',
  primary: '#2563eb',
  primaryForeground: '#ffffff',
  secondary: '#0f172a',
  secondaryForeground: '#ffffff',
  accent: '#f59e0b',
  accentForeground: '#111827',
  border: '#dbe3ef',
  focus: '#2563eb',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  link: '#1d4ed8',
  overlay: 'rgb(15 23 42 / 0.68)'
};

const darkNeutral: ThemeColorTokens = {
  background: '#080b12',
  surface: '#111827',
  surfaceAlt: '#1f2937',
  text: '#f8fafc',
  textMuted: '#cbd5e1',
  textInverse: '#020617',
  primary: '#60a5fa',
  primaryForeground: '#07111f',
  secondary: '#e2e8f0',
  secondaryForeground: '#0f172a',
  accent: '#fbbf24',
  accentForeground: '#111827',
  border: '#334155',
  focus: '#93c5fd',
  success: '#4ade80',
  warning: '#facc15',
  danger: '#f87171',
  link: '#93c5fd',
  overlay: 'rgb(2 6 23 / 0.78)'
};

const highContrast: ThemeColorTokens = {
  background: '#000000',
  surface: '#0b0b0b',
  surfaceAlt: '#1a1a1a',
  text: '#ffffff',
  textMuted: '#f5f5f5',
  textInverse: '#000000',
  primary: '#ffff00',
  primaryForeground: '#000000',
  secondary: '#00ffff',
  secondaryForeground: '#000000',
  accent: '#ff00ff',
  accentForeground: '#000000',
  border: '#ffffff',
  focus: '#00ffff',
  success: '#00ff66',
  warning: '#ffff00',
  danger: '#ff5555',
  link: '#00ffff',
  overlay: 'rgb(0 0 0 / 0.84)'
};

const baseTypography: ThemeTokens['typography'] = {
  display: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
    lineHeight: '0.95',
    fontWeight: '800',
    letterSpacing: '-0.06em'
  },
  heading: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: 'clamp(1.875rem, 4vw, 3.25rem)',
    lineHeight: '1.08',
    fontWeight: '750',
    letterSpacing: '-0.04em'
  },
  body: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '1rem',
    lineHeight: '1.7',
    fontWeight: '400'
  },
  caption: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: '500'
  },
  button: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '0.95rem',
    lineHeight: '1',
    fontWeight: '700',
    letterSpacing: '-0.01em'
  },
  mono: {
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
    fontSize: '0.925rem',
    lineHeight: '1.65',
    fontWeight: '500'
  }
};

const serifTypography: ThemeTokens['typography'] = {
  display: {
    fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    lineHeight: '1',
    fontWeight: '700',
    letterSpacing: '-0.035em'
  },
  heading: {
    fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
    fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
    lineHeight: '1.15',
    fontWeight: '700'
  },
  body: {
    fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
    fontSize: '1.0625rem',
    lineHeight: '1.75',
    fontWeight: '400'
  },
  caption: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '0.875rem',
    lineHeight: '1.45',
    fontWeight: '600',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  },
  button: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '0.9rem',
    lineHeight: '1',
    fontWeight: '700',
    letterSpacing: '0.02em'
  },
  mono: baseTypography.mono
};

const editorialTypography: ThemeTokens['typography'] = {
  ...serifTypography,
  display: {
    ...serifTypography.display,
    fontSize: 'clamp(3rem, 8vw, 6.5rem)',
    lineHeight: '0.92',
    letterSpacing: '-0.055em'
  },
  body: {
    ...serifTypography.body,
    fontSize: '1.1rem',
    lineHeight: '1.82'
  }
};

const friendlyTypography: ThemeTokens['typography'] = {
  ...baseTypography,
  display: {
    ...baseTypography.display,
    fontFamily: 'Nunito, Inter, ui-sans-serif, system-ui, sans-serif',
    letterSpacing: '-0.035em'
  },
  heading: {
    ...baseTypography.heading,
    fontFamily: 'Nunito, Inter, ui-sans-serif, system-ui, sans-serif',
    letterSpacing: '-0.025em'
  },
  body: {
    ...baseTypography.body,
    fontFamily: 'Nunito, Inter, ui-sans-serif, system-ui, sans-serif'
  }
};

const technicalTypography: ThemeTokens['typography'] = {
  ...baseTypography,
  display: {
    ...baseTypography.display,
    fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)',
    letterSpacing: '-0.05em'
  },
  heading: {
    ...baseTypography.heading,
    fontSize: 'clamp(1.6rem, 3vw, 2.75rem)'
  },
  body: {
    ...baseTypography.body,
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    lineHeight: '1.75'
  },
  mono: {
    fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    fontSize: '0.9rem',
    lineHeight: '1.7',
    fontWeight: '500'
  }
};

const baseSpacing: ThemeTokens['spacing'] = {
  none: '0',
  '2xs': '0.25rem',
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '5.5rem',
  section: 'clamp(4rem, 8vw, 7rem)',
  container: 'min(1120px, calc(100vw - 2rem))'
};

const baseRadius: ThemeTokens['radius'] = {
  none: '0',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  pill: '999px',
  full: '9999px'
};

const baseElevation: ThemeTokens['elevation'] = {
  none: 'none',
  xs: '0 1px 1px rgb(15 23 42 / 0.05)',
  sm: '0 1px 2px rgb(15 23 42 / 0.08)',
  md: '0 12px 30px rgb(15 23 42 / 0.12)',
  lg: '0 24px 60px rgb(15 23 42 / 0.16)',
  xl: '0 36px 90px rgb(15 23 42 / 0.22)',
  '2xl': '0 48px 120px rgb(15 23 42 / 0.28)'
};

const baseAnimation: ThemeTokens['animation'] = {
  durationFast: '120ms',
  durationBase: '180ms',
  durationSlow: '320ms',
  easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easingEmphasized: 'cubic-bezier(0.16, 1, 0.3, 1)'
};

const baseMotion: ThemeTokens['motion'] = {
  instant: {
    duration: '1ms',
    easing: 'linear',
    translateY: '0',
    scale: '1',
    opacity: '1'
  },
  subtle: {
    duration: '160ms',
    easing: baseAnimation.easingStandard,
    translateY: '0.25rem',
    scale: '1',
    opacity: '0.96'
  },
  standard: {
    duration: '220ms',
    easing: baseAnimation.easingStandard,
    translateY: '0.5rem',
    scale: '0.995',
    opacity: '0.92'
  },
  expressive: {
    duration: '420ms',
    easing: baseAnimation.easingEmphasized,
    translateY: '0.9rem',
    scale: '0.985',
    opacity: '0.9'
  },
  entrance: {
    duration: '560ms',
    easing: baseAnimation.easingEmphasized,
    translateY: '1.4rem',
    scale: '0.98',
    opacity: '0'
  }
};

const baseResponsive: ThemeTokens['responsive'] = {
  breakpoints: {
    xs: '360px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  containerPadding: {
    xs: '1rem',
    sm: '1.25rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
    '2xl': '3rem'
  },
  sectionSpacing: {
    xs: '3rem',
    sm: '4rem',
    md: '5rem',
    lg: '6rem',
    xl: '7rem',
    '2xl': '8rem'
  },
  gridColumns: {
    xs: '1',
    sm: '2',
    md: '6',
    lg: '12',
    xl: '12',
    '2xl': '12'
  }
};

const baseContainers: ThemeTokens['containers'] = {
  narrow: 'min(760px, calc(100vw - 2rem))',
  content: 'min(960px, calc(100vw - 2rem))',
  wide: 'min(1180px, calc(100vw - 2rem))',
  full: 'min(1440px, calc(100vw - 2rem))',
  prose: 'min(72ch, calc(100vw - 2rem))'
};

const baseButtons: ThemeTokens['buttons'] = {
  primary: {
    background: color('primary'),
    color: color('primaryForeground'),
    border: '1px solid transparent',
    hoverBackground: colorMix('primary', 'black 8%'),
    hoverColor: color('primaryForeground'),
    hoverBorder: '1px solid transparent',
    radius: 'pill',
    padding: '0.9rem 1.35rem',
    minHeight: '2.75rem',
    shadow: 'sm',
    hoverShadow: 'md',
    transform: 'translateY(-1px)'
  },
  secondary: {
    background: color('surface'),
    color: color('text'),
    border: `1px solid ${color('border')}`,
    hoverBackground: color('surfaceAlt'),
    hoverColor: color('text'),
    hoverBorder: `1px solid ${color('primary')}`,
    radius: 'pill',
    padding: '0.9rem 1.35rem',
    minHeight: '2.75rem',
    shadow: 'xs',
    hoverShadow: 'sm',
    transform: 'translateY(-1px)'
  },
  ghost: {
    background: 'transparent',
    color: color('text'),
    border: '1px solid transparent',
    hoverBackground: color('surfaceAlt'),
    hoverColor: color('primary'),
    hoverBorder: `1px solid ${color('border')}`,
    radius: 'pill',
    padding: '0.85rem 1.2rem',
    minHeight: '2.5rem',
    shadow: 'none',
    hoverShadow: 'none',
    transform: 'none'
  },
  link: {
    background: 'transparent',
    color: color('link'),
    border: '1px solid transparent',
    hoverBackground: 'transparent',
    hoverColor: color('primary'),
    hoverBorder: '1px solid transparent',
    radius: 'none',
    padding: '0',
    minHeight: 'auto',
    shadow: 'none',
    hoverShadow: 'none',
    transform: 'none'
  }
};

const baseCards: ThemeTokens['cards'] = {
  standard: {
    background: color('surface'),
    foreground: color('text'),
    border: `1px solid ${color('border')}`,
    radius: 'xl',
    padding: 'clamp(1.25rem, 3vw, 2rem)',
    gap: '1rem',
    shadow: 'sm',
    hoverShadow: 'md',
    mediaRadius: 'lg'
  },
  feature: {
    background: color('surfaceAlt'),
    foreground: color('text'),
    border: `1px solid ${color('border')}`,
    radius: '2xl',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    gap: '1.25rem',
    shadow: 'md',
    hoverShadow: 'lg',
    mediaRadius: 'xl'
  },
  testimonial: {
    background: color('background'),
    foreground: color('text'),
    border: `1px solid ${color('border')}`,
    radius: 'xl',
    padding: 'clamp(1.25rem, 3vw, 2rem)',
    gap: '1rem',
    shadow: 'xs',
    hoverShadow: 'sm',
    mediaRadius: 'full'
  },
  pricing: {
    background: color('surface'),
    foreground: color('text'),
    border: `1px solid ${color('primary')}`,
    radius: '2xl',
    padding: 'clamp(1.5rem, 4vw, 2.75rem)',
    gap: '1.5rem',
    shadow: 'lg',
    hoverShadow: 'xl',
    mediaRadius: 'lg'
  }
};

const baseHero: ThemeTokens['hero'] = {
  layout: 'split',
  background: color('background'),
  foreground: color('text'),
  eyebrowColor: color('primary'),
  mediaShape: 'rounded',
  minHeight: 'min(760px, calc(100vh - 4.75rem))',
  contentWidth: 'min(680px, 100%)',
  gap: 'clamp(2rem, 5vw, 5rem)',
  overlay: color('overlay')
};

const baseForms: ThemeTokens['forms'] = {
  background: color('surface'),
  foreground: color('text'),
  border: `1px solid ${color('border')}`,
  focusBorder: `1px solid ${color('focus')}`,
  fieldBackground: color('background'),
  fieldForeground: color('text'),
  fieldBorder: `1px solid ${color('border')}`,
  radius: 'lg',
  padding: '0.95rem 1rem',
  labelTransform: 'none',
  shadow: 'sm'
};

const baseNavigation: ThemeTokens['navigation'] = {
  layout: 'split',
  background: color('background'),
  foreground: color('text'),
  linkHover: color('primary'),
  border: color('border'),
  sticky: true,
  height: '4.75rem',
  blur: true,
  shadow: 'none',
  activeIndicator: 'underline'
};

const baseFooter: ThemeTokens['footer'] = {
  layout: 'columns',
  background: color('surfaceAlt'),
  foreground: color('text'),
  link: color('link'),
  border: color('border'),
  density: 'comfortable',
  divider: true,
  socialIconStyle: 'outlined'
};

const basePageTemplates: ThemeTokens['pageTemplates'] = {
  landing: {
    maxWidth: 'wide',
    background: color('background'),
    surface: color('surface'),
    headerSpacing: 'clamp(4rem, 8vw, 7rem)',
    bodySpacing: 'clamp(3rem, 7vw, 6rem)',
    sidebarWidth: '0',
    grid: 'repeat(12, minmax(0, 1fr))'
  },
  standard: {
    maxWidth: 'wide',
    background: color('background'),
    surface: color('surface'),
    headerSpacing: 'clamp(3rem, 6vw, 5rem)',
    bodySpacing: 'clamp(2.5rem, 5vw, 4.5rem)',
    sidebarWidth: '0',
    grid: 'repeat(12, minmax(0, 1fr))'
  },
  article: {
    maxWidth: 'prose',
    background: color('background'),
    surface: color('surface'),
    headerSpacing: 'clamp(3.5rem, 7vw, 6rem)',
    bodySpacing: 'clamp(2rem, 4vw, 3.5rem)',
    sidebarWidth: '0',
    grid: 'minmax(0, 1fr)'
  },
  directory: {
    maxWidth: 'full',
    background: color('background'),
    surface: color('surface'),
    headerSpacing: 'clamp(3rem, 6vw, 5rem)',
    bodySpacing: 'clamp(2rem, 4vw, 4rem)',
    sidebarWidth: '18rem',
    grid: 'minmax(16rem, 0.32fr) minmax(0, 1fr)'
  },
  docs: {
    maxWidth: 'full',
    background: color('background'),
    surface: color('surface'),
    headerSpacing: 'clamp(2.5rem, 5vw, 4rem)',
    bodySpacing: 'clamp(1.5rem, 3vw, 3rem)',
    sidebarWidth: '17rem',
    grid: 'minmax(15rem, 0.28fr) minmax(0, 1fr)'
  },
  checkout: {
    maxWidth: 'content',
    background: color('background'),
    surface: color('surface'),
    headerSpacing: 'clamp(2.5rem, 5vw, 4rem)',
    bodySpacing: 'clamp(2rem, 4vw, 3rem)',
    sidebarWidth: '22rem',
    grid: 'minmax(0, 1fr) minmax(18rem, 0.42fr)'
  }
};

const baseSections: ThemeTokens['sections'] = {
  services: {
    background: color('background'),
    foreground: color('text'),
    eyebrowColor: color('primary'),
    alignment: 'start',
    spacingBlock: 'var(--wf-spacing-section)',
    spacingInline: 'var(--wf-responsive-container-padding-md)',
    container: 'wide',
    cardVariant: 'standard'
  },
  proof: {
    background: color('surfaceAlt'),
    foreground: color('text'),
    eyebrowColor: color('secondary'),
    alignment: 'center',
    spacingBlock: 'clamp(2.5rem, 5vw, 4rem)',
    spacingInline: 'var(--wf-responsive-container-padding-md)',
    container: 'wide',
    cardVariant: 'testimonial'
  },
  process: {
    background: color('background'),
    foreground: color('text'),
    eyebrowColor: color('accent'),
    alignment: 'start',
    spacingBlock: 'var(--wf-spacing-section)',
    spacingInline: 'var(--wf-responsive-container-padding-md)',
    container: 'wide',
    cardVariant: 'feature'
  },
  testimonials: {
    background: color('surface'),
    foreground: color('text'),
    eyebrowColor: color('primary'),
    alignment: 'center',
    spacingBlock: 'var(--wf-spacing-section)',
    spacingInline: 'var(--wf-responsive-container-padding-md)',
    container: 'content',
    cardVariant: 'testimonial'
  },
  faq: {
    background: color('background'),
    foreground: color('text'),
    eyebrowColor: color('primary'),
    alignment: 'start',
    spacingBlock: 'clamp(3rem, 6vw, 5rem)',
    spacingInline: 'var(--wf-responsive-container-padding-md)',
    container: 'content',
    cardVariant: 'standard'
  },
  content: {
    background: color('background'),
    foreground: color('text'),
    eyebrowColor: color('primary'),
    alignment: 'start',
    spacingBlock: 'var(--wf-spacing-section)',
    spacingInline: 'var(--wf-responsive-container-padding-md)',
    container: 'prose',
    cardVariant: 'standard'
  }
};

const baseIcons: IconTokens = {
  style: 'line',
  size: '1.5rem',
  strokeWidth: '1.75',
  background: colorMix('primary', 'transparent 88%'),
  foreground: color('primary'),
  radius: 'lg'
};

const crispRadius: ThemeTokenOverrides['radius'] = {
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem'
};

const softRadius: ThemeTokenOverrides['radius'] = {
  md: '1rem',
  lg: '1.35rem',
  xl: '2rem',
  '2xl': '2.5rem'
};

const blockRadius: ThemeTokenOverrides['radius'] = {
  xs: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.375rem',
  xl: '0.5rem',
  '2xl': '0.75rem'
};

const compactSpacing: ThemeTokenOverrides['spacing'] = {
  section: 'clamp(3rem, 6vw, 5.5rem)',
  container: 'min(1080px, calc(100vw - 2rem))'
};

const spaciousSpacing: ThemeTokenOverrides['spacing'] = {
  section: 'clamp(5rem, 10vw, 9rem)',
  container: 'min(1200px, calc(100vw - 2rem))',
  '4xl': '6.5rem'
};

const editorialSpacing: ThemeTokenOverrides['spacing'] = {
  section: 'clamp(5rem, 9vw, 8rem)',
  container: 'min(1160px, calc(100vw - 2rem))'
};

const glassElevation: ThemeTokenOverrides['elevation'] = {
  sm: '0 12px 30px rgb(15 23 42 / 0.09)',
  md: '0 20px 55px rgb(15 23 42 / 0.13)',
  lg: '0 30px 80px rgb(15 23 42 / 0.18)',
  xl: '0 44px 110px rgb(15 23 42 / 0.24)'
};

const flatElevation: ThemeTokenOverrides['elevation'] = {
  xs: 'none',
  sm: 'none',
  md: 'none',
  lg: 'none',
  xl: 'none',
  '2xl': 'none'
};

const squaredButtons: ThemeTokenOverrides['buttons'] = {
  primary: {
    radius: 'md',
    shadow: 'xs',
    hoverShadow: 'sm'
  },
  secondary: {
    radius: 'md'
  },
  ghost: {
    radius: 'md'
  }
};

const luxuryButtons: ThemeTokenOverrides['buttons'] = {
  primary: {
    background: color('secondary'),
    color: color('secondaryForeground'),
    hoverBackground: colorMix('secondary', 'black 12%'),
    radius: 'sm',
    padding: '1rem 1.6rem',
    minHeight: '3rem',
    shadow: 'sm',
    hoverShadow: 'md'
  },
  secondary: {
    radius: 'sm',
    background: 'transparent'
  },
  ghost: {
    radius: 'sm'
  }
};

const lowMotion: ThemeTokenOverrides['motion'] = {
  subtle: {
    duration: '120ms',
    translateY: '0.125rem'
  },
  standard: {
    duration: '160ms',
    translateY: '0.25rem',
    scale: '1'
  },
  expressive: {
    duration: '220ms',
    translateY: '0.375rem',
    scale: '1'
  },
  entrance: {
    duration: '260ms',
    translateY: '0.5rem',
    scale: '1'
  }
};

const expressiveMotion: ThemeTokenOverrides['motion'] = {
  standard: {
    duration: '260ms',
    translateY: '0.75rem',
    scale: '0.99'
  },
  expressive: {
    duration: '520ms',
    translateY: '1.25rem',
    scale: '0.975'
  },
  entrance: {
    duration: '680ms',
    translateY: '1.75rem',
    scale: '0.965'
  }
};

const compactNavigation: Partial<NavigationTokens> = {
  height: '4rem',
  blur: false,
  activeIndicator: 'none'
};

const centeredNavigation: Partial<NavigationTokens> = {
  layout: 'centered',
  height: '5rem',
  blur: false,
  activeIndicator: 'dot'
};

const darkNavigation: Partial<NavigationTokens> = {
  background: color('secondary'),
  foreground: color('secondaryForeground'),
  linkHover: color('accent'),
  border: colorMix('secondary', 'white 16%'),
  blur: false,
  shadow: 'sm',
  activeIndicator: 'pill'
};

const richFooter: ThemeTokenOverrides['footer'] = {
  layout: 'rich',
  background: color('secondary'),
  foreground: color('secondaryForeground'),
  link: color('accent'),
  border: colorMix('secondary', 'white 14%'),
  density: 'spacious',
  divider: true,
  socialIconStyle: 'filled'
};

const minimalFooter: ThemeTokenOverrides['footer'] = {
  layout: 'simple',
  background: color('background'),
  foreground: color('textMuted'),
  link: color('text'),
  border: color('border'),
  density: 'compact',
  divider: false,
  socialIconStyle: 'plain'
};

const luxuryCards: ThemeTokenOverrides['cards'] = {
  standard: {
    radius: 'md',
    shadow: 'xs',
    hoverShadow: 'sm'
  },
  feature: {
    radius: 'lg',
    background: color('background')
  },
  testimonial: {
    radius: 'md'
  },
  pricing: {
    radius: 'lg'
  }
};

const flatCards: ThemeTokenOverrides['cards'] = {
  standard: {
    shadow: 'none',
    hoverShadow: 'none',
    radius: 'md'
  },
  feature: {
    shadow: 'none',
    hoverShadow: 'none',
    radius: 'lg'
  },
  testimonial: {
    shadow: 'none',
    hoverShadow: 'none',
    radius: 'md'
  },
  pricing: {
    shadow: 'none',
    hoverShadow: 'none',
    radius: 'lg'
  }
};

const serviceCards: ThemeTokenOverrides['cards'] = {
  standard: {
    radius: 'lg',
    shadow: 'md',
    hoverShadow: 'lg'
  },
  feature: {
    background: color('secondary'),
    foreground: color('secondaryForeground'),
    border: `1px solid ${colorMix('secondary', 'white 18%')}`,
    shadow: 'lg'
  }
};

const mediaHero: ThemeTokenOverrides['hero'] = {
  layout: 'media',
  mediaShape: 'bleed',
  minHeight: 'min(820px, calc(100vh - 4.75rem))'
};

const centeredHero: ThemeTokenOverrides['hero'] = {
  layout: 'centered',
  mediaShape: 'none',
  contentWidth: 'min(820px, 100%)'
};

const editorialHero: ThemeTokenOverrides['hero'] = {
  layout: 'editorial',
  mediaShape: 'arch',
  contentWidth: 'min(760px, 100%)',
  gap: 'clamp(2.5rem, 6vw, 6rem)'
};

const docsHero: ThemeTokenOverrides['hero'] = {
  layout: 'docs',
  mediaShape: 'none',
  minHeight: 'auto',
  contentWidth: 'min(880px, 100%)'
};

const appHero: ThemeTokenOverrides['hero'] = {
  layout: 'app',
  mediaShape: 'device',
  minHeight: 'min(780px, calc(100vh - 4.75rem))'
};

const softIcons: Partial<IconTokens> = {
  style: 'duotone',
  background: colorMix('primary', 'transparent 84%'),
  radius: 'xl'
};

const solidIcons: Partial<IconTokens> = {
  style: 'solid',
  background: color('primary'),
  foreground: color('primaryForeground'),
  radius: 'lg'
};

const minimalIcons: Partial<IconTokens> = {
  style: 'minimal',
  background: 'transparent',
  radius: 'none',
  strokeWidth: '1.4'
};

const centeredSections: ThemeTokenOverrides['sections'] = {
  services: {
    alignment: 'center'
  },
  content: {
    alignment: 'center'
  }
};

const editorialSections: ThemeTokenOverrides['sections'] = {
  services: {
    background: color('surface'),
    cardVariant: 'feature'
  },
  proof: {
    background: color('background')
  },
  testimonials: {
    background: color('surfaceAlt'),
    cardVariant: 'testimonial'
  },
  content: {
    container: 'prose'
  }
};

const compactResponsive: ThemeTokenOverrides['responsive'] = {
  sectionSpacing: {
    xs: '2.5rem',
    sm: '3.25rem',
    md: '4rem',
    lg: '5rem',
    xl: '5.5rem',
    '2xl': '6rem'
  }
};

const roomyResponsive: ThemeTokenOverrides['responsive'] = {
  containerPadding: {
    xs: '1.25rem',
    sm: '1.5rem',
    md: '2rem',
    lg: '2.75rem',
    xl: '3rem',
    '2xl': '3.5rem'
  },
  sectionSpacing: {
    xs: '4rem',
    sm: '5rem',
    md: '6rem',
    lg: '8rem',
    xl: '9rem',
    '2xl': '10rem'
  }
};

function mergeTypography(overrides?: ThemeTokenOverrides['typography']): ThemeTokens['typography'] {
  return {
    display: { ...baseTypography.display, ...overrides?.display },
    heading: { ...baseTypography.heading, ...overrides?.heading },
    body: { ...baseTypography.body, ...overrides?.body },
    caption: { ...baseTypography.caption, ...overrides?.caption },
    button: { ...baseTypography.button, ...overrides?.button },
    mono: { ...baseTypography.mono, ...overrides?.mono }
  };
}

function mergeButtons(overrides?: ThemeTokenOverrides['buttons']): ThemeTokens['buttons'] {
  return {
    primary: { ...baseButtons.primary, ...overrides?.primary },
    secondary: { ...baseButtons.secondary, ...overrides?.secondary },
    ghost: { ...baseButtons.ghost, ...overrides?.ghost },
    link: { ...baseButtons.link, ...overrides?.link }
  };
}

function mergeCards(overrides?: ThemeTokenOverrides['cards']): ThemeTokens['cards'] {
  return {
    standard: { ...baseCards.standard, ...overrides?.standard },
    feature: { ...baseCards.feature, ...overrides?.feature },
    testimonial: { ...baseCards.testimonial, ...overrides?.testimonial },
    pricing: { ...baseCards.pricing, ...overrides?.pricing }
  };
}

function mergeMotion(overrides?: ThemeTokenOverrides['motion']): ThemeTokens['motion'] {
  return {
    instant: { ...baseMotion.instant, ...overrides?.instant },
    subtle: { ...baseMotion.subtle, ...overrides?.subtle },
    standard: { ...baseMotion.standard, ...overrides?.standard },
    expressive: { ...baseMotion.expressive, ...overrides?.expressive },
    entrance: { ...baseMotion.entrance, ...overrides?.entrance }
  };
}

function mergeResponsive(overrides?: ThemeTokenOverrides['responsive']): ThemeTokens['responsive'] {
  return {
    breakpoints: { ...baseResponsive.breakpoints, ...overrides?.breakpoints },
    containerPadding: { ...baseResponsive.containerPadding, ...overrides?.containerPadding },
    sectionSpacing: { ...baseResponsive.sectionSpacing, ...overrides?.sectionSpacing },
    gridColumns: { ...baseResponsive.gridColumns, ...overrides?.gridColumns }
  };
}

function mergePageTemplates(overrides?: ThemeTokenOverrides['pageTemplates']): ThemeTokens['pageTemplates'] {
  return {
    landing: { ...basePageTemplates.landing, ...overrides?.landing },
    standard: { ...basePageTemplates.standard, ...overrides?.standard },
    article: { ...basePageTemplates.article, ...overrides?.article },
    directory: { ...basePageTemplates.directory, ...overrides?.directory },
    docs: { ...basePageTemplates.docs, ...overrides?.docs },
    checkout: { ...basePageTemplates.checkout, ...overrides?.checkout }
  };
}

function mergeSections(overrides?: ThemeTokenOverrides['sections']): ThemeTokens['sections'] {
  return {
    services: { ...baseSections.services, ...overrides?.services },
    proof: { ...baseSections.proof, ...overrides?.proof },
    process: { ...baseSections.process, ...overrides?.process },
    testimonials: { ...baseSections.testimonials, ...overrides?.testimonials },
    faq: { ...baseSections.faq, ...overrides?.faq },
    content: { ...baseSections.content, ...overrides?.content }
  };
}

function mergeModes(overrides?: ThemeTokenOverrides['modes']): ThemeTokens['modes'] {
  return {
    light: { ...lightNeutral, ...overrides?.light },
    dark: { ...darkNeutral, ...overrides?.dark },
    highContrast: { ...highContrast, ...overrides?.highContrast }
  };
}

function buttonWithRadius(radius: RadiusRole): NonNullable<ThemeTokenOverrides['buttons']> {
  return {
    primary: { radius },
    secondary: { radius },
    ghost: { radius }
  };
}

function buildTokens(overrides?: ThemeTokenOverrides): ThemeTokens {
  return {
    modes: mergeModes(overrides?.modes),
    typography: mergeTypography(overrides?.typography),
    spacing: { ...baseSpacing, ...overrides?.spacing },
    radius: { ...baseRadius, ...overrides?.radius },
    elevation: { ...baseElevation, ...overrides?.elevation },
    buttons: mergeButtons(overrides?.buttons),
    cards: mergeCards(overrides?.cards),
    animation: { ...baseAnimation, ...overrides?.animation },
    motion: mergeMotion(overrides?.motion),
    responsive: mergeResponsive(overrides?.responsive),
    containers: { ...baseContainers, ...overrides?.containers },
    hero: { ...baseHero, ...overrides?.hero },
    forms: { ...baseForms, ...overrides?.forms },
    navigation: { ...baseNavigation, ...overrides?.navigation },
    footer: { ...baseFooter, ...overrides?.footer },
    pageTemplates: mergePageTemplates(overrides?.pageTemplates),
    sections: mergeSections(overrides?.sections),
    icons: { ...baseIcons, ...overrides?.icons }
  };
}

function defineTheme<const TId extends string>(config: ThemeConfig<TId>): WebsiteTheme<TId> {
  return {
    id: config.id,
    displayName: config.displayName,
    description: config.description,
    defaultMode: config.defaultMode ?? 'light',
    supportedModes: config.supportedModes ?? ['light', 'dark', 'highContrast'],
    tokens: buildTokens(config.tokens),
    tags: config.tags
  };
}

function modes(light: Partial<ThemeColorTokens>, dark: Partial<ThemeColorTokens>): NonNullable<ThemeTokenOverrides['modes']> {
  return {
    light,
    dark
  };
}

function brandTokens(light: Partial<ThemeColorTokens>, dark: Partial<ThemeColorTokens>, overrides: NonModeTokenOverrides = {}): ThemeTokenOverrides {
  return {
    ...overrides,
    modes: modes(light, dark)
  };
}

const modernBlue = brandTokens(
  {
    background: '#f8fbff',
    surface: '#ffffff',
    surfaceAlt: '#eaf2ff',
    primary: '#2563eb',
    secondary: '#0f172a',
    accent: '#7c3aed',
    border: '#dbeafe',
    focus: '#2563eb',
    link: '#1d4ed8'
  },
  {
    background: '#030712',
    surface: '#0f172a',
    surfaceAlt: '#1e293b',
    primary: '#60a5fa',
    primaryForeground: '#07111f',
    secondary: '#dbeafe',
    secondaryForeground: '#07111f',
    accent: '#c4b5fd',
    border: '#334155',
    link: '#93c5fd'
  },
  {
    hero: appHero,
    elevation: glassElevation,
    icons: softIcons
  }
);

const classicWarm = brandTokens(
  {
    background: '#fbf7ef',
    surface: '#fffaf2',
    surfaceAlt: '#efe5d3',
    text: '#241a10',
    textMuted: '#6a5745',
    primary: '#7c2d12',
    secondary: '#1f2937',
    accent: '#b45309',
    border: '#d8c7ac',
    link: '#7c2d12'
  },
  {
    background: '#1a120c',
    surface: '#24190f',
    surfaceAlt: '#332418',
    primary: '#fbbf24',
    primaryForeground: '#1a120c',
    secondary: '#f5ead8',
    secondaryForeground: '#1a120c',
    accent: '#fdba74',
    border: '#5b4632',
    link: '#fbbf24'
  },
  {
    typography: serifTypography,
    navigation: centeredNavigation,
    sections: editorialSections
  }
);

const luxuryGold = brandTokens(
  {
    background: '#fbfaf7',
    surface: '#ffffff',
    surfaceAlt: '#f2eee7',
    text: '#15120d',
    textMuted: '#62594f',
    primary: '#8a6f35',
    secondary: '#18181b',
    accent: '#c7a75a',
    border: '#ded4c2',
    link: '#745a24'
  },
  {
    background: '#090806',
    surface: '#15120d',
    surfaceAlt: '#221d15',
    primary: '#d4af37',
    primaryForeground: '#090806',
    secondary: '#f5f0e6',
    secondaryForeground: '#090806',
    accent: '#f2d98d',
    border: '#4a3f2b',
    link: '#f2d98d'
  },
  {
    typography: editorialTypography,
    spacing: spaciousSpacing,
    radius: crispRadius,
    buttons: luxuryButtons,
    cards: luxuryCards,
    hero: editorialHero,
    footer: richFooter,
    responsive: roomyResponsive,
    sections: editorialSections,
    icons: minimalIcons
  }
);

const minimalMono = brandTokens(
  {
    surface: '#ffffff',
    surfaceAlt: '#f5f5f4',
    primary: '#111827',
    primaryForeground: '#ffffff',
    secondary: '#52525b',
    secondaryForeground: '#ffffff',
    accent: '#71717a',
    border: '#e7e5e4',
    link: '#111827'
  },
  {
    background: '#09090b',
    surface: '#111113',
    surfaceAlt: '#1d1d20',
    primary: '#f8fafc',
    primaryForeground: '#09090b',
    secondary: '#a1a1aa',
    secondaryForeground: '#09090b',
    accent: '#d4d4d8',
    border: '#27272a',
    link: '#f8fafc'
  },
  {
    radius: crispRadius,
    elevation: flatElevation,
    buttons: squaredButtons,
    cards: flatCards,
    navigation: compactNavigation,
    footer: minimalFooter,
    motion: lowMotion,
    icons: minimalIcons,
    responsive: compactResponsive
  }
);

const clinicColors = brandTokens(
  {
    background: '#f2fbfa',
    surface: '#ffffff',
    surfaceAlt: '#e3f4f2',
    text: '#142b3d',
    textMuted: '#526679',
    primary: '#2f7d78',
    primaryForeground: '#ffffff',
    secondary: '#17324a',
    secondaryForeground: '#ffffff',
    accent: '#a9d9d3',
    accentForeground: '#142b3d',
    border: '#c9e3df',
    focus: '#1f8b85',
    link: '#226d68'
  },
  {
    background: '#071719',
    surface: '#10282a',
    surfaceAlt: '#163639',
    text: '#eefcf9',
    textMuted: '#bedbd7',
    primary: '#7ccbc3',
    primaryForeground: '#071719',
    secondary: '#d7eef8',
    secondaryForeground: '#071719',
    accent: '#b9eee6',
    accentForeground: '#071719',
    border: '#2b5b5e',
    link: '#9fe6dd'
  },
  {
    typography: friendlyTypography,
    spacing: {
      section: 'clamp(4.5rem, 8vw, 7.5rem)',
      container: 'min(1160px, calc(100vw - 2rem))'
    },
    radius: softRadius,
    elevation: glassElevation,
    cards: serviceCards,
    navigation: {
      background: color('surface'),
      height: '5rem',
      activeIndicator: 'pill'
    },
    footer: richFooter,
    icons: softIcons,
    sections: centeredSections
  }
);

const tradeColors = brandTokens(
  {
    background: '#fff7ed',
    surface: '#ffffff',
    surfaceAlt: '#ffedd5',
    text: '#1c1917',
    textMuted: '#57534e',
    primary: '#c2410c',
    primaryForeground: '#ffffff',
    secondary: '#111827',
    secondaryForeground: '#ffffff',
    accent: '#f97316',
    accentForeground: '#1c1917',
    border: '#fed7aa',
    link: '#9a3412'
  },
  {
    background: '#160b05',
    surface: '#23140c',
    surfaceAlt: '#372013',
    primary: '#fb923c',
    primaryForeground: '#160b05',
    secondary: '#f8fafc',
    secondaryForeground: '#160b05',
    accent: '#fdba74',
    accentForeground: '#160b05',
    border: '#6b3b20',
    link: '#fdba74'
  },
  {
    spacing: compactSpacing,
    radius: blockRadius,
    buttons: squaredButtons,
    cards: serviceCards,
    navigation: darkNavigation,
    footer: richFooter,
    icons: solidIcons
  }
);

const hospitalityColors = brandTokens(
  {
    background: '#fff8ed',
    surface: '#fffdf7',
    surfaceAlt: '#f4e3ca',
    text: '#2b2017',
    textMuted: '#695846',
    primary: '#9a5a16',
    primaryForeground: '#ffffff',
    secondary: '#3a2a1c',
    secondaryForeground: '#fff8ed',
    accent: '#d9a441',
    accentForeground: '#2b2017',
    border: '#dfc39b',
    link: '#81470e'
  },
  {
    background: '#140e08',
    surface: '#21170d',
    surfaceAlt: '#332314',
    primary: '#f2b95d',
    primaryForeground: '#140e08',
    secondary: '#fff3d7',
    secondaryForeground: '#140e08',
    accent: '#f6d08a',
    accentForeground: '#140e08',
    border: '#5d4227',
    link: '#f2b95d'
  },
  {
    typography: editorialTypography,
    spacing: editorialSpacing,
    hero: mediaHero,
    cards: luxuryCards,
    footer: richFooter,
    sections: editorialSections,
    motion: expressiveMotion
  }
);

const professionalColors = brandTokens(
  {
    background: '#f6f8ff',
    surface: '#ffffff',
    surfaceAlt: '#e8edff',
    text: '#111827',
    textMuted: '#4b5563',
    primary: '#3730a3',
    primaryForeground: '#ffffff',
    secondary: '#172554',
    secondaryForeground: '#ffffff',
    accent: '#0ea5e9',
    accentForeground: '#06131f',
    border: '#dbe4ff',
    link: '#312e81'
  },
  {
    background: '#070a1c',
    surface: '#111633',
    surfaceAlt: '#1d2550',
    primary: '#a5b4fc',
    primaryForeground: '#070a1c',
    secondary: '#dbeafe',
    secondaryForeground: '#070a1c',
    accent: '#7dd3fc',
    accentForeground: '#070a1c',
    border: '#33407a',
    link: '#bfdbfe'
  },
  {
    radius: crispRadius,
    buttons: squaredButtons,
    cards: flatCards,
    navigation: {
      background: color('surface'),
      activeIndicator: 'block'
    },
    footer: richFooter,
    icons: minimalIcons
  }
);

export const themes = {
  modern: defineTheme({
    id: 'modern',
    displayName: 'Modern',
    description: 'Clean, conversion-focused theme with bold type, soft surfaces, and strong calls to action.',
    tags: ['saas', 'local-service', 'startup'],
    tokens: modernBlue
  }),
  classic: defineTheme({
    id: 'classic',
    displayName: 'Classic',
    description: 'Editorial serif typography and warm neutrals for established local businesses.',
    tags: ['professional', 'heritage', 'local-business'],
    tokens: classicWarm
  }),
  luxury: defineTheme({
    id: 'luxury',
    displayName: 'Luxury',
    description: 'Premium visual language with restrained gold accents and spacious sections.',
    tags: ['premium', 'hospitality', 'boutique'],
    tokens: luxuryGold
  }),
  minimal: defineTheme({
    id: 'minimal',
    displayName: 'Minimal',
    description: 'Quiet monochrome system that prioritizes content, whitespace, and fast loading.',
    tags: ['portfolio', 'one-page', 'content-first'],
    tokens: minimalMono
  }),
  corporate: defineTheme({
    id: 'corporate',
    displayName: 'Corporate',
    description: 'Trust-building blue palette, structured spacing, and restrained motion.',
    tags: ['b2b', 'professional-services', 'enterprise'],
    tokens: professionalColors
  }),
  dark: defineTheme({
    id: 'dark',
    displayName: 'Dark',
    description: 'Dark-first theme for high-impact launches, creative studios, and nightlife.',
    defaultMode: 'dark',
    supportedModes: ['dark', 'light', 'highContrast'],
    tags: ['creative', 'launch', 'nightlife'],
    tokens: brandTokens(
      {
        background: '#f8fafc',
        primary: '#7c3aed',
        secondary: '#111827',
        accent: '#06b6d4',
        link: '#6d28d9'
      },
      {
        background: '#030712',
        surface: '#0f172a',
        surfaceAlt: '#1e1b4b',
        primary: '#a78bfa',
        primaryForeground: '#160c2e',
        secondary: '#22d3ee',
        secondaryForeground: '#06202a',
        accent: '#f472b6',
        accentForeground: '#190914',
        link: '#c4b5fd'
      },
      {
        hero: mediaHero,
        navigation: {
          background: color('surface'),
          shadow: 'sm'
        },
        motion: expressiveMotion,
        icons: solidIcons
      }
    )
  }),
  elegant: defineTheme({
    id: 'elegant',
    displayName: 'Elegant',
    description: 'Soft rose and slate palette suited for wellness, beauty, and refined service brands.',
    tags: ['wellness', 'beauty', 'service'],
    tokens: brandTokens(
      {
        background: '#fff8f6',
        surface: '#ffffff',
        surfaceAlt: '#fdeeea',
        primary: '#be5b50',
        primaryForeground: '#ffffff',
        secondary: '#334155',
        secondaryForeground: '#ffffff',
        accent: '#c08497',
        accentForeground: '#2a1212',
        border: '#f2d3cc',
        link: '#a1463f'
      },
      {
        background: '#171111',
        surface: '#211818',
        surfaceAlt: '#332324',
        primary: '#f0a8a0',
        primaryForeground: '#2a1212',
        accent: '#f9c6d0',
        accentForeground: '#2a1212',
        border: '#5f3c3e',
        link: '#f0a8a0'
      },
      {
        typography: serifTypography,
        radius: softRadius,
        cards: luxuryCards,
        hero: editorialHero,
        icons: softIcons
      }
    )
  }),
  playful: defineTheme({
    id: 'playful',
    displayName: 'Playful',
    description: 'Energetic theme with friendly color, rounded UI, and upbeat interaction tokens.',
    tags: ['family', 'education', 'food'],
    tokens: brandTokens(
      {
        background: '#fff7ed',
        surface: '#ffffff',
        surfaceAlt: '#ffedd5',
        primary: '#f97316',
        primaryForeground: '#1c1917',
        secondary: '#7c3aed',
        secondaryForeground: '#ffffff',
        accent: '#22c55e',
        accentForeground: '#042713',
        border: '#fed7aa',
        link: '#c2410c'
      },
      {
        background: '#1b1025',
        surface: '#27183a',
        surfaceAlt: '#382150',
        primary: '#fb923c',
        primaryForeground: '#1b1025',
        secondary: '#c4b5fd',
        secondaryForeground: '#1b1025',
        accent: '#86efac',
        accentForeground: '#052e16',
        border: '#6d4c8d',
        link: '#fdba74'
      },
      {
        typography: friendlyTypography,
        radius: softRadius,
        motion: expressiveMotion,
        icons: softIcons,
        sections: centeredSections
      }
    )
  }),
  'clinic-showcase': defineTheme({
    id: 'clinic-showcase',
    displayName: 'Clinic Showcase',
    description: 'Polished healthcare theme with calm teal surfaces, generous spacing, image-led hero cards, and trust-first CTAs.',
    tags: ['clinic', 'medical', 'dental', 'wellness'],
    tokens: clinicColors
  }),
  'trade-pro': defineTheme({
    id: 'trade-pro',
    displayName: 'Trade Pro',
    description: 'High-contrast home-service theme with urgent CTAs, robust card treatments, and bold service-area sections.',
    tags: ['trade', 'home-services', 'plumbing', 'repair'],
    tokens: tradeColors
  }),
  'hospitality-editorial': defineTheme({
    id: 'hospitality-editorial',
    displayName: 'Hospitality Editorial',
    description: 'Warm editorial hospitality theme with serif headlines, layered imagery, and menu-friendly content rhythm.',
    tags: ['hospitality', 'restaurant', 'editorial', 'local-business'],
    tokens: hospitalityColors
  }),
  'professional-trust': defineTheme({
    id: 'professional-trust',
    displayName: 'Professional Trust',
    description: 'Structured professional-services theme with crisp hierarchy, deep blue trust colors, and credibility-first sections.',
    tags: ['professional', 'legal', 'consulting', 'trust'],
    tokens: professionalColors
  }),
  clinic: defineTheme({
    id: 'clinic',
    displayName: 'Clinic',
    description: 'Palette-compatible clinic theme for existing universal site examples.',
    tags: ['palette', 'clinic', 'healthcare'],
    tokens: clinicColors
  }),
  trade: defineTheme({
    id: 'trade',
    displayName: 'Trade',
    description: 'Palette-compatible trade theme for existing universal site examples.',
    tags: ['palette', 'trade', 'home-services'],
    tokens: tradeColors
  }),
  hospitality: defineTheme({
    id: 'hospitality',
    displayName: 'Hospitality',
    description: 'Palette-compatible hospitality theme for existing universal site examples.',
    tags: ['palette', 'hospitality', 'restaurant'],
    tokens: hospitalityColors
  }),
  professional: defineTheme({
    id: 'professional',
    displayName: 'Professional',
    description: 'Palette-compatible professional theme for existing universal site examples.',
    tags: ['palette', 'professional', 'services'],
    tokens: professionalColors
  }),
  modernSaaS: defineTheme({
    id: 'modernSaaS',
    displayName: 'Modern SaaS',
    description: 'High-polish SaaS system with app-style hero media, glassy cards, and crisp conversion tokens.',
    tags: ['saas', 'product', 'software'],
    tokens: modernBlue
  }),
  appleMinimal: defineTheme({
    id: 'appleMinimal',
    displayName: 'Apple Minimal',
    description: 'Premium minimalist system with low-noise surfaces, precise rhythm, and product-led whitespace.',
    tags: ['minimal', 'product', 'premium'],
    tokens: brandTokens(
      {
        background: '#fbfbfd',
        surface: '#ffffff',
        surfaceAlt: '#f5f5f7',
        text: '#1d1d1f',
        textMuted: '#6e6e73',
        primary: '#0071e3',
        primaryForeground: '#ffffff',
        secondary: '#1d1d1f',
        secondaryForeground: '#ffffff',
        accent: '#86868b',
        border: '#d2d2d7',
        link: '#0066cc'
      },
      {
        background: '#000000',
        surface: '#161617',
        surfaceAlt: '#242426',
        text: '#f5f5f7',
        textMuted: '#a1a1a6',
        primary: '#2997ff',
        primaryForeground: '#001d35',
        secondary: '#f5f5f7',
        secondaryForeground: '#000000',
        accent: '#6e6e73',
        border: '#424245',
        link: '#2997ff'
      },
      {
        spacing: spaciousSpacing,
        radius: softRadius,
        elevation: flatElevation,
        buttons: buttonWithRadius('pill'),
        cards: flatCards,
        hero: centeredHero,
        footer: minimalFooter,
        motion: lowMotion,
        icons: minimalIcons,
        sections: centeredSections,
        responsive: roomyResponsive
      }
    )
  }),
  stripeInspired: defineTheme({
    id: 'stripeInspired',
    displayName: 'Stripe Inspired',
    description: 'Gradient-ready fintech/product theme with energetic blues, violet accents, and angular depth.',
    tags: ['saas', 'fintech', 'payments'],
    tokens: brandTokens(
      {
        background: '#f6f9fc',
        surface: '#ffffff',
        surfaceAlt: '#edf2f7',
        text: '#0a2540',
        textMuted: '#425466',
        primary: '#635bff',
        primaryForeground: '#ffffff',
        secondary: '#0a2540',
        secondaryForeground: '#ffffff',
        accent: '#00d4ff',
        accentForeground: '#082332',
        border: '#d8e2ef',
        focus: '#635bff',
        link: '#635bff'
      },
      {
        background: '#0a1020',
        surface: '#10192d',
        surfaceAlt: '#17223a',
        primary: '#8c85ff',
        primaryForeground: '#0a1020',
        secondary: '#00d4ff',
        secondaryForeground: '#061522',
        accent: '#7a73ff',
        border: '#27344f',
        link: '#a7a2ff'
      },
      {
        radius: crispRadius,
        elevation: glassElevation,
        buttons: squaredButtons,
        hero: appHero,
        motion: expressiveMotion,
        icons: solidIcons
      }
    )
  }),
  startup: defineTheme({
    id: 'startup',
    displayName: 'Startup',
    description: 'Friendly launch theme with confident color, energetic motion, and early-stage credibility sections.',
    tags: ['startup', 'launch', 'marketing'],
    tokens: brandTokens(
      {
        background: '#fffbeb',
        surface: '#ffffff',
        surfaceAlt: '#fef3c7',
        text: '#1f2937',
        textMuted: '#5b6472',
        primary: '#e11d48',
        primaryForeground: '#ffffff',
        secondary: '#312e81',
        secondaryForeground: '#ffffff',
        accent: '#f59e0b',
        accentForeground: '#1f2937',
        border: '#fde68a',
        link: '#be123c'
      },
      {
        background: '#181014',
        surface: '#241820',
        surfaceAlt: '#332032',
        primary: '#fb7185',
        primaryForeground: '#2a0f16',
        secondary: '#c4b5fd',
        secondaryForeground: '#181014',
        accent: '#fbbf24',
        accentForeground: '#181014',
        border: '#5b3344',
        link: '#fda4af'
      },
      {
        typography: friendlyTypography,
        radius: softRadius,
        motion: expressiveMotion,
        hero: centeredHero,
        icons: softIcons,
        sections: centeredSections
      }
    )
  }),
  corporateEnterprise: defineTheme({
    id: 'corporateEnterprise',
    displayName: 'Corporate Enterprise',
    description: 'Conservative enterprise theme with crisp controls, governance-friendly contrast, and structured page templates.',
    tags: ['enterprise', 'b2b', 'corporate'],
    tokens: professionalColors
  }),
  healthcare: defineTheme({
    id: 'healthcare',
    displayName: 'Healthcare',
    description: 'Accessible healthcare theme with calm greens, trust-forward cards, and generous appointment CTAs.',
    tags: ['healthcare', 'medical', 'appointments'],
    tokens: brandTokens(
      {
        background: '#f3fbf7',
        surface: '#ffffff',
        surfaceAlt: '#e3f5eb',
        text: '#102a2a',
        textMuted: '#4f6762',
        primary: '#0f766e',
        primaryForeground: '#ffffff',
        secondary: '#164e63',
        secondaryForeground: '#ffffff',
        accent: '#99f6e4',
        accentForeground: '#0f2e2d',
        border: '#bfebdc',
        focus: '#0f766e',
        link: '#0f766e'
      },
      {
        background: '#061615',
        surface: '#0d2422',
        surfaceAlt: '#123632',
        primary: '#5eead4',
        primaryForeground: '#061615',
        secondary: '#a5f3fc',
        secondaryForeground: '#061615',
        accent: '#2dd4bf',
        accentForeground: '#061615',
        border: '#245c55',
        link: '#99f6e4'
      },
      {
        typography: friendlyTypography,
        radius: softRadius,
        cards: serviceCards,
        hero: centeredHero,
        footer: richFooter,
        icons: softIcons,
        sections: centeredSections
      }
    )
  }),
  dentalClinic: defineTheme({
    id: 'dentalClinic',
    displayName: 'Dental Clinic',
    description: 'Bright dental practice theme with clean cyan accents, soft patient-friendly cards, and approachable typography.',
    tags: ['dental', 'clinic', 'healthcare'],
    tokens: brandTokens(
      {
        background: '#f5fdff',
        surface: '#ffffff',
        surfaceAlt: '#e6f8fb',
        text: '#12313b',
        textMuted: '#4e6870',
        primary: '#0891b2',
        primaryForeground: '#ffffff',
        secondary: '#155e75',
        secondaryForeground: '#ffffff',
        accent: '#a7f3d0',
        accentForeground: '#064e3b',
        border: '#bae6fd',
        focus: '#0284c7',
        link: '#0369a1'
      },
      {
        background: '#04151a',
        surface: '#0b252d',
        surfaceAlt: '#123743',
        primary: '#67e8f9',
        primaryForeground: '#04151a',
        secondary: '#bae6fd',
        secondaryForeground: '#04151a',
        accent: '#86efac',
        accentForeground: '#04151a',
        border: '#255869',
        link: '#a5f3fc'
      },
      {
        typography: friendlyTypography,
        radius: softRadius,
        cards: serviceCards,
        icons: softIcons,
        hero: centeredHero,
        sections: centeredSections
      }
    )
  }),
  lawFirm: defineTheme({
    id: 'lawFirm',
    displayName: 'Law Firm',
    description: 'Authoritative legal theme with deep navy, classic serif hierarchy, and trust-building proof sections.',
    tags: ['legal', 'professional', 'trust'],
    tokens: brandTokens(
      {
        background: '#f8f7f4',
        surface: '#ffffff',
        surfaceAlt: '#ebe7df',
        text: '#101827',
        textMuted: '#596171',
        primary: '#1e3a5f',
        primaryForeground: '#ffffff',
        secondary: '#111827',
        secondaryForeground: '#ffffff',
        accent: '#b58b45',
        accentForeground: '#111827',
        border: '#d8d1c3',
        link: '#1e3a5f'
      },
      {
        background: '#070b12',
        surface: '#101827',
        surfaceAlt: '#1b2535',
        primary: '#93b5df',
        primaryForeground: '#070b12',
        secondary: '#f8f7f4',
        secondaryForeground: '#070b12',
        accent: '#d6b36a',
        accentForeground: '#070b12',
        border: '#344258',
        link: '#bfdbfe'
      },
      {
        typography: serifTypography,
        radius: crispRadius,
        buttons: luxuryButtons,
        cards: luxuryCards,
        footer: richFooter,
        sections: editorialSections,
        icons: minimalIcons
      }
    )
  }),
  financialAdvisor: defineTheme({
    id: 'financialAdvisor',
    displayName: 'Financial Advisor',
    description: 'Calm wealth-management theme with emerald accents, disciplined spacing, and credibility-first cards.',
    tags: ['finance', 'advisor', 'professional'],
    tokens: brandTokens(
      {
        background: '#f7fbf8',
        surface: '#ffffff',
        surfaceAlt: '#eaf4ee',
        text: '#102016',
        textMuted: '#53615a',
        primary: '#047857',
        primaryForeground: '#ffffff',
        secondary: '#0f172a',
        secondaryForeground: '#ffffff',
        accent: '#c4a35a',
        accentForeground: '#102016',
        border: '#d6e7dc',
        link: '#065f46'
      },
      {
        background: '#06120d',
        surface: '#0d1f17',
        surfaceAlt: '#173226',
        primary: '#6ee7b7',
        primaryForeground: '#06120d',
        secondary: '#f8fafc',
        secondaryForeground: '#06120d',
        accent: '#f4d77a',
        accentForeground: '#06120d',
        border: '#2a5742',
        link: '#a7f3d0'
      },
      {
        radius: crispRadius,
        buttons: squaredButtons,
        cards: flatCards,
        hero: centeredHero,
        icons: minimalIcons
      }
    )
  }),
  restaurant: defineTheme({
    id: 'restaurant',
    displayName: 'Restaurant',
    description: 'Warm hospitality theme for restaurants with appetizing color, image-first hero defaults, and menu-friendly cards.',
    tags: ['restaurant', 'hospitality', 'food'],
    tokens: hospitalityColors
  }),
  fineDining: defineTheme({
    id: 'fineDining',
    displayName: 'Fine Dining',
    description: 'Elegant restaurant theme with editorial typography, dark-luxury footer, and restrained gold details.',
    tags: ['fine-dining', 'restaurant', 'luxury'],
    tokens: luxuryGold
  }),
  coffeeShop: defineTheme({
    id: 'coffeeShop',
    displayName: 'Coffee Shop',
    description: 'Cozy cafe theme with warm neutrals, friendly type, rounded cards, and local-community rhythm.',
    tags: ['coffee', 'cafe', 'hospitality'],
    tokens: brandTokens(
      {
        background: '#fff8ed',
        surface: '#ffffff',
        surfaceAlt: '#f4dfc4',
        text: '#2f2118',
        textMuted: '#715f51',
        primary: '#8b4513',
        primaryForeground: '#ffffff',
        secondary: '#3b2416',
        secondaryForeground: '#fff8ed',
        accent: '#d97706',
        accentForeground: '#2f2118',
        border: '#e7c9a6',
        link: '#7c2d12'
      },
      {
        background: '#160d08',
        surface: '#24160e',
        surfaceAlt: '#3a2518',
        primary: '#f59e0b',
        primaryForeground: '#160d08',
        secondary: '#fed7aa',
        secondaryForeground: '#160d08',
        accent: '#fdba74',
        accentForeground: '#160d08',
        border: '#664326',
        link: '#fbbf24'
      },
      {
        typography: friendlyTypography,
        radius: softRadius,
        hero: mediaHero,
        cards: luxuryCards,
        icons: softIcons,
        sections: centeredSections
      }
    )
  }),
  luxuryHotel: defineTheme({
    id: 'luxuryHotel',
    displayName: 'Luxury Hotel',
    description: 'Boutique hotel theme with spacious page templates, immersive media hero, and premium dark-mode accents.',
    tags: ['hotel', 'hospitality', 'luxury'],
    tokens: brandTokens(
      {
        background: '#faf7f1',
        surface: '#ffffff',
        surfaceAlt: '#efe7d8',
        text: '#17130d',
        textMuted: '#6b6254',
        primary: '#7f5f2a',
        primaryForeground: '#ffffff',
        secondary: '#15120d',
        secondaryForeground: '#faf7f1',
        accent: '#d7b86f',
        accentForeground: '#17130d',
        border: '#ded0b8',
        link: '#6f531f'
      },
      {
        background: '#080706',
        surface: '#14110d',
        surfaceAlt: '#241e16',
        primary: '#d7b86f',
        primaryForeground: '#080706',
        secondary: '#f6ead2',
        secondaryForeground: '#080706',
        accent: '#f5d991',
        accentForeground: '#080706',
        border: '#4e422f',
        link: '#f5d991'
      },
      {
        typography: editorialTypography,
        spacing: spaciousSpacing,
        hero: mediaHero,
        cards: luxuryCards,
        buttons: luxuryButtons,
        footer: richFooter,
        responsive: roomyResponsive,
        motion: expressiveMotion
      }
    )
  }),
  construction: defineTheme({
    id: 'construction',
    displayName: 'Construction',
    description: 'Rugged construction theme with high-contrast safety accents, squared UI, and durable service cards.',
    tags: ['construction', 'trade', 'contractor'],
    tokens: brandTokens(
      {
        background: '#fff8e1',
        surface: '#ffffff',
        surfaceAlt: '#ffedb5',
        text: '#1f1b14',
        textMuted: '#5d5548',
        primary: '#d97706',
        primaryForeground: '#111827',
        secondary: '#111827',
        secondaryForeground: '#ffffff',
        accent: '#facc15',
        accentForeground: '#111827',
        border: '#f2cf72',
        link: '#a16207'
      },
      {
        background: '#141007',
        surface: '#211a0d',
        surfaceAlt: '#382b12',
        primary: '#facc15',
        primaryForeground: '#141007',
        secondary: '#f8fafc',
        secondaryForeground: '#141007',
        accent: '#fb923c',
        accentForeground: '#141007',
        border: '#6b561f',
        link: '#fde047'
      },
      {
        radius: blockRadius,
        buttons: squaredButtons,
        cards: serviceCards,
        navigation: darkNavigation,
        footer: richFooter,
        icons: solidIcons,
        spacing: compactSpacing
      }
    )
  }),
  landscaping: defineTheme({
    id: 'landscaping',
    displayName: 'Landscaping',
    description: 'Earthy outdoor services theme with green accents, organic rounded cards, and approachable local-service layouts.',
    tags: ['landscaping', 'outdoor', 'trade'],
    tokens: brandTokens(
      {
        background: '#f6fbef',
        surface: '#ffffff',
        surfaceAlt: '#e7f4d3',
        text: '#1d2b16',
        textMuted: '#5a6b50',
        primary: '#4d7c0f',
        primaryForeground: '#ffffff',
        secondary: '#365314',
        secondaryForeground: '#ffffff',
        accent: '#84cc16',
        accentForeground: '#1d2b16',
        border: '#d1e7b2',
        link: '#3f6212'
      },
      {
        background: '#0b1407',
        surface: '#14200d',
        surfaceAlt: '#223415',
        primary: '#a3e635',
        primaryForeground: '#0b1407',
        secondary: '#d9f99d',
        secondaryForeground: '#0b1407',
        accent: '#bef264',
        accentForeground: '#0b1407',
        border: '#405c2a',
        link: '#bef264'
      },
      {
        typography: friendlyTypography,
        radius: softRadius,
        cards: serviceCards,
        hero: mediaHero,
        icons: softIcons
      }
    )
  }),
  automotiveRepair: defineTheme({
    id: 'automotiveRepair',
    displayName: 'Automotive Repair',
    description: 'Automotive services theme with red action color, dark service bands, squared cards, and practical CTAs.',
    tags: ['automotive', 'repair', 'local-service'],
    tokens: brandTokens(
      {
        background: '#f8fafc',
        surface: '#ffffff',
        surfaceAlt: '#e2e8f0',
        text: '#111827',
        textMuted: '#4b5563',
        primary: '#dc2626',
        primaryForeground: '#ffffff',
        secondary: '#111827',
        secondaryForeground: '#ffffff',
        accent: '#f97316',
        accentForeground: '#111827',
        border: '#cbd5e1',
        link: '#b91c1c'
      },
      {
        background: '#090909',
        surface: '#171717',
        surfaceAlt: '#262626',
        primary: '#f87171',
        primaryForeground: '#1c0b0b',
        secondary: '#f5f5f5',
        secondaryForeground: '#090909',
        accent: '#fb923c',
        accentForeground: '#090909',
        border: '#404040',
        link: '#fca5a5'
      },
      {
        radius: blockRadius,
        buttons: squaredButtons,
        cards: serviceCards,
        navigation: darkNavigation,
        footer: richFooter,
        icons: solidIcons,
        spacing: compactSpacing
      }
    )
  }),
  creativeAgency: defineTheme({
    id: 'creativeAgency',
    displayName: 'Creative Agency',
    description: 'Expressive studio theme with saturated gradients, bold cards, and motion-forward campaign sections.',
    tags: ['agency', 'creative', 'portfolio'],
    tokens: brandTokens(
      {
        background: '#fff7ff',
        surface: '#ffffff',
        surfaceAlt: '#fae8ff',
        text: '#1f1235',
        textMuted: '#6b5a7e',
        primary: '#a21caf',
        primaryForeground: '#ffffff',
        secondary: '#312e81',
        secondaryForeground: '#ffffff',
        accent: '#06b6d4',
        accentForeground: '#06131f',
        border: '#f5d0fe',
        link: '#86198f'
      },
      {
        background: '#100618',
        surface: '#1d0d2b',
        surfaceAlt: '#2e1645',
        primary: '#e879f9',
        primaryForeground: '#100618',
        secondary: '#a5b4fc',
        secondaryForeground: '#100618',
        accent: '#67e8f9',
        accentForeground: '#100618',
        border: '#5b2f76',
        link: '#f0abfc'
      },
      {
        typography: baseTypography,
        radius: softRadius,
        cards: serviceCards,
        hero: mediaHero,
        motion: expressiveMotion,
        icons: solidIcons,
        sections: centeredSections
      }
    )
  }),
  photographyPortfolio: defineTheme({
    id: 'photographyPortfolio',
    displayName: 'Photography Portfolio',
    description: 'Image-led portfolio theme with low-chrome controls, editorial spacing, and darkroom-friendly palettes.',
    defaultMode: 'dark',
    supportedModes: ['dark', 'light', 'highContrast'],
    tags: ['photography', 'portfolio', 'visual'],
    tokens: brandTokens(
      {
        background: '#fafafa',
        surface: '#ffffff',
        surfaceAlt: '#eeeeee',
        text: '#171717',
        textMuted: '#525252',
        primary: '#171717',
        primaryForeground: '#ffffff',
        secondary: '#737373',
        secondaryForeground: '#ffffff',
        accent: '#d4d4d4',
        border: '#e5e5e5',
        link: '#171717'
      },
      {
        background: '#050505',
        surface: '#111111',
        surfaceAlt: '#1f1f1f',
        text: '#fafafa',
        textMuted: '#a3a3a3',
        primary: '#fafafa',
        primaryForeground: '#050505',
        secondary: '#d4d4d4',
        secondaryForeground: '#050505',
        accent: '#737373',
        accentForeground: '#050505',
        border: '#333333',
        link: '#fafafa'
      },
      {
        typography: editorialTypography,
        spacing: spaciousSpacing,
        radius: crispRadius,
        elevation: flatElevation,
        buttons: luxuryButtons,
        cards: flatCards,
        hero: mediaHero,
        navigation: compactNavigation,
        footer: minimalFooter,
        icons: minimalIcons,
        responsive: roomyResponsive
      }
    )
  }),
  interiorDesign: defineTheme({
    id: 'interiorDesign',
    displayName: 'Interior Design',
    description: 'Refined interiors theme with warm neutrals, elegant typography, and gallery-friendly card treatments.',
    tags: ['interiors', 'design', 'portfolio'],
    tokens: brandTokens(
      {
        background: '#faf6f0',
        surface: '#ffffff',
        surfaceAlt: '#eee2d5',
        text: '#282018',
        textMuted: '#6e6258',
        primary: '#9f6f4a',
        primaryForeground: '#ffffff',
        secondary: '#2f2a25',
        secondaryForeground: '#faf6f0',
        accent: '#c8a27a',
        accentForeground: '#282018',
        border: '#dfccba',
        link: '#8a5a39'
      },
      {
        background: '#120f0c',
        surface: '#1e1914',
        surfaceAlt: '#302720',
        primary: '#d6a77f',
        primaryForeground: '#120f0c',
        secondary: '#f6eadc',
        secondaryForeground: '#120f0c',
        accent: '#e2bf9c',
        accentForeground: '#120f0c',
        border: '#57473b',
        link: '#e2bf9c'
      },
      {
        typography: editorialTypography,
        spacing: spaciousSpacing,
        radius: crispRadius,
        cards: luxuryCards,
        hero: mediaHero,
        footer: richFooter,
        sections: editorialSections
      }
    )
  }),
  fitnessGym: defineTheme({
    id: 'fitnessGym',
    displayName: 'Fitness Gym',
    description: 'High-energy fitness theme with dark contrast, bright lime accents, strong cards, and kinetic motion.',
    defaultMode: 'dark',
    supportedModes: ['dark', 'light', 'highContrast'],
    tags: ['fitness', 'gym', 'wellness'],
    tokens: brandTokens(
      {
        background: '#f7fee7',
        surface: '#ffffff',
        surfaceAlt: '#ecfccb',
        text: '#17210a',
        textMuted: '#536044',
        primary: '#65a30d',
        primaryForeground: '#ffffff',
        secondary: '#111827',
        secondaryForeground: '#ffffff',
        accent: '#ef4444',
        accentForeground: '#ffffff',
        border: '#d9f99d',
        link: '#4d7c0f'
      },
      {
        background: '#070a05',
        surface: '#10150c',
        surfaceAlt: '#1b2412',
        primary: '#a3e635',
        primaryForeground: '#070a05',
        secondary: '#f8fafc',
        secondaryForeground: '#070a05',
        accent: '#f87171',
        accentForeground: '#070a05',
        border: '#384b22',
        link: '#bef264'
      },
      {
        radius: blockRadius,
        buttons: squaredButtons,
        cards: serviceCards,
        navigation: darkNavigation,
        footer: richFooter,
        motion: expressiveMotion,
        icons: solidIcons
      }
    )
  }),
  yogaStudio: defineTheme({
    id: 'yogaStudio',
    displayName: 'Yoga Studio',
    description: 'Calm wellness theme with sage and blush tones, soft cards, spacious breathing room, and gentle motion.',
    tags: ['yoga', 'wellness', 'studio'],
    tokens: brandTokens(
      {
        background: '#fbf7f1',
        surface: '#ffffff',
        surfaceAlt: '#e8eee0',
        text: '#283426',
        textMuted: '#65715f',
        primary: '#6b8f71',
        primaryForeground: '#ffffff',
        secondary: '#8a5a67',
        secondaryForeground: '#ffffff',
        accent: '#e8b4a5',
        accentForeground: '#283426',
        border: '#d8dfcf',
        link: '#56775b'
      },
      {
        background: '#0f1510',
        surface: '#192118',
        surfaceAlt: '#273225',
        primary: '#b7d0ac',
        primaryForeground: '#0f1510',
        secondary: '#f0c4bc',
        secondaryForeground: '#0f1510',
        accent: '#e8b4a5',
        accentForeground: '#0f1510',
        border: '#45553f',
        link: '#cbe2c0'
      },
      {
        typography: friendlyTypography,
        spacing: spaciousSpacing,
        radius: softRadius,
        cards: luxuryCards,
        hero: centeredHero,
        motion: lowMotion,
        icons: softIcons,
        sections: centeredSections
      }
    )
  }),
  church: defineTheme({
    id: 'church',
    displayName: 'Church',
    description: 'Welcoming community theme with warm blue and gold accents, clear content sections, and accessible typography.',
    tags: ['church', 'community', 'nonprofit'],
    tokens: brandTokens(
      {
        background: '#f7f6f2',
        surface: '#ffffff',
        surfaceAlt: '#e8e3d6',
        text: '#182233',
        textMuted: '#5a6270',
        primary: '#2563eb',
        primaryForeground: '#ffffff',
        secondary: '#1e3a5f',
        secondaryForeground: '#ffffff',
        accent: '#d9a441',
        accentForeground: '#182233',
        border: '#d8d1c3',
        link: '#1d4ed8'
      },
      {
        background: '#080d15',
        surface: '#111827',
        surfaceAlt: '#1f2937',
        primary: '#93c5fd',
        primaryForeground: '#080d15',
        secondary: '#f8fafc',
        secondaryForeground: '#080d15',
        accent: '#facc15',
        accentForeground: '#080d15',
        border: '#38465a',
        link: '#bfdbfe'
      },
      {
        typography: serifTypography,
        radius: softRadius,
        hero: centeredHero,
        footer: richFooter,
        icons: softIcons,
        sections: centeredSections
      }
    )
  }),
  educationalInstitution: defineTheme({
    id: 'educationalInstitution',
    displayName: 'Educational Institution',
    description: 'Academic theme with navy and gold trust colors, content-rich page templates, and structured navigation.',
    tags: ['education', 'school', 'academic'],
    tokens: brandTokens(
      {
        background: '#f6f8fb',
        surface: '#ffffff',
        surfaceAlt: '#e7edf5',
        text: '#102033',
        textMuted: '#536273',
        primary: '#1d4ed8',
        primaryForeground: '#ffffff',
        secondary: '#0f2f57',
        secondaryForeground: '#ffffff',
        accent: '#f59e0b',
        accentForeground: '#102033',
        border: '#d5dfec',
        link: '#1e40af'
      },
      {
        background: '#07101d',
        surface: '#101b2d',
        surfaceAlt: '#1b2a42',
        primary: '#93c5fd',
        primaryForeground: '#07101d',
        secondary: '#dbeafe',
        secondaryForeground: '#07101d',
        accent: '#fbbf24',
        accentForeground: '#07101d',
        border: '#33465f',
        link: '#bfdbfe'
      },
      {
        radius: crispRadius,
        buttons: squaredButtons,
        cards: flatCards,
        navigation: {
          layout: 'stacked',
          height: '5.5rem',
          activeIndicator: 'block'
        },
        pageTemplates: {
          docs: {
            sidebarWidth: '19rem'
          }
        },
        icons: minimalIcons
      }
    )
  }),
  nonprofit: defineTheme({
    id: 'nonprofit',
    displayName: 'Nonprofit',
    description: 'Mission-driven nonprofit theme with hopeful colors, generous proof sections, and donation-friendly templates.',
    tags: ['nonprofit', 'community', 'mission'],
    tokens: brandTokens(
      {
        background: '#f8fbf5',
        surface: '#ffffff',
        surfaceAlt: '#edf7e5',
        text: '#172516',
        textMuted: '#566550',
        primary: '#16a34a',
        primaryForeground: '#ffffff',
        secondary: '#1d4ed8',
        secondaryForeground: '#ffffff',
        accent: '#f59e0b',
        accentForeground: '#172516',
        border: '#d6ebcb',
        link: '#15803d'
      },
      {
        background: '#071209',
        surface: '#0f1f13',
        surfaceAlt: '#1a321f',
        primary: '#86efac',
        primaryForeground: '#071209',
        secondary: '#93c5fd',
        secondaryForeground: '#071209',
        accent: '#fbbf24',
        accentForeground: '#071209',
        border: '#2f5738',
        link: '#bbf7d0'
      },
      {
        typography: friendlyTypography,
        radius: softRadius,
        cards: serviceCards,
        hero: centeredHero,
        sections: centeredSections,
        icons: softIcons,
        buttons: buttonWithRadius('pill')
      }
    )
  }),
  ecommerceStore: defineTheme({
    id: 'ecommerceStore',
    displayName: 'Ecommerce Store',
    description: 'Retail theme with product-card depth, checkout-aware page templates, and sharp conversion controls.',
    tags: ['ecommerce', 'retail', 'shop'],
    tokens: brandTokens(
      {
        background: '#fffafa',
        surface: '#ffffff',
        surfaceAlt: '#ffe4e6',
        text: '#1f1720',
        textMuted: '#655b65',
        primary: '#e11d48',
        primaryForeground: '#ffffff',
        secondary: '#111827',
        secondaryForeground: '#ffffff',
        accent: '#f97316',
        accentForeground: '#1f1720',
        border: '#fecdd3',
        link: '#be123c'
      },
      {
        background: '#12070a',
        surface: '#1f1115',
        surfaceAlt: '#321a21',
        primary: '#fb7185',
        primaryForeground: '#12070a',
        secondary: '#f8fafc',
        secondaryForeground: '#12070a',
        accent: '#fdba74',
        accentForeground: '#12070a',
        border: '#5c2e39',
        link: '#fda4af'
      },
      {
        radius: crispRadius,
        cards: {
          standard: {
            mediaRadius: 'md',
            hoverShadow: 'lg'
          },
          pricing: {
            border: `1px solid ${color('border')}`,
            shadow: 'md'
          }
        },
        hero: appHero,
        pageTemplates: {
          checkout: {
            maxWidth: 'wide',
            sidebarWidth: '24rem'
          }
        },
        icons: solidIcons
      }
    )
  }),
  technicalDocumentation: defineTheme({
    id: 'technicalDocumentation',
    displayName: 'Technical Documentation',
    description: 'Developer documentation theme with mono-friendly type, sidebar page templates, compact spacing, and accessible contrast.',
    tags: ['documentation', 'developer', 'technical'],
    tokens: brandTokens(
      {
        background: '#fbfdff',
        surface: '#ffffff',
        surfaceAlt: '#eef4fb',
        text: '#0f172a',
        textMuted: '#475569',
        primary: '#2563eb',
        primaryForeground: '#ffffff',
        secondary: '#0f172a',
        secondaryForeground: '#ffffff',
        accent: '#14b8a6',
        accentForeground: '#06131f',
        border: '#dbe4ef',
        link: '#1d4ed8'
      },
      {
        background: '#080b12',
        surface: '#0f172a',
        surfaceAlt: '#172033',
        primary: '#60a5fa',
        primaryForeground: '#080b12',
        secondary: '#e2e8f0',
        secondaryForeground: '#080b12',
        accent: '#5eead4',
        accentForeground: '#080b12',
        border: '#334155',
        link: '#93c5fd'
      },
      {
        typography: technicalTypography,
        spacing: compactSpacing,
        radius: crispRadius,
        elevation: flatElevation,
        cards: flatCards,
        buttons: squaredButtons,
        hero: docsHero,
        navigation: {
          layout: 'sidebar',
          height: '4rem',
          blur: false,
          activeIndicator: 'block'
        },
        pageTemplates: {
          docs: {
            maxWidth: 'full',
            sidebarWidth: '18rem',
            grid: 'minmax(16rem, 0.25fr) minmax(0, 1fr)'
          },
          article: {
            maxWidth: 'prose'
          }
        },
        forms: {
          shadow: 'none',
          radius: 'md'
        },
        icons: minimalIcons,
        responsive: compactResponsive,
        motion: lowMotion
      }
    )
  }),
  auroraGlass: defineTheme({
    id: 'auroraGlass',
    displayName: 'Aurora Glass',
    description: 'Luminous AI/product theme with translucent surfaces, aurora gradients, and airy glass-card depth.',
    tags: ['ai', 'product', 'glass', 'gradient'],
    tokens: brandTokens(
      {
        background: '#f2f8ff',
        surface: '#ffffff',
        surfaceAlt: '#ebe7ff',
        text: '#0d1b2f',
        textMuted: '#516176',
        primary: '#7c3aed',
        primaryForeground: '#ffffff',
        secondary: '#0f766e',
        secondaryForeground: '#ffffff',
        accent: '#06b6d4',
        accentForeground: '#06131f',
        border: '#c7d2fe',
        focus: '#8b5cf6',
        link: '#6d28d9',
        overlay: 'rgb(13 27 47 / 0.58)'
      },
      {
        background: '#07111f',
        surface: '#101c2f',
        surfaceAlt: '#1a2440',
        text: '#f7fbff',
        textMuted: '#c1d1e4',
        primary: '#c4b5fd',
        primaryForeground: '#130b2e',
        secondary: '#67e8f9',
        secondaryForeground: '#05252e',
        accent: '#5eead4',
        accentForeground: '#052522',
        border: '#33446b',
        focus: '#a78bfa',
        link: '#ddd6fe',
        overlay: 'rgb(3 8 18 / 0.78)'
      },
      {
        typography: {
          display: {
            ...baseTypography.display,
            fontFamily: 'Sora, Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(3rem, 7vw, 6.25rem)',
            lineHeight: '0.92',
            letterSpacing: '-0.065em'
          },
          heading: {
            ...baseTypography.heading,
            fontFamily: 'Sora, Inter, ui-sans-serif, system-ui, sans-serif',
            letterSpacing: '-0.045em'
          },
          caption: {
            ...baseTypography.caption,
            letterSpacing: '0.14em',
            textTransform: 'uppercase'
          }
        },
        spacing: spaciousSpacing,
        radius: softRadius,
        elevation: glassElevation,
        buttons: {
          primary: {
            background: `linear-gradient(135deg, ${color('primary')}, ${color('accent')})`,
            hoverBackground: `linear-gradient(135deg, ${colorMix('primary', 'white 8%')}, ${colorMix('accent', 'white 8%')})`,
            radius: 'pill',
            shadow: 'md',
            hoverShadow: 'xl'
          },
          secondary: {
            background: colorMix('surface', 'transparent 14%'),
            hoverBackground: colorMix('accent', 'transparent 82%'),
            hoverBorder: `1px solid ${colorMix('accent', 'transparent 24%')}`,
            radius: 'pill',
            shadow: 'sm',
            hoverShadow: 'lg'
          },
          ghost: {
            hoverBackground: colorMix('primary', 'transparent 88%'),
            radius: 'pill'
          }
        },
        cards: {
          standard: {
            background: colorMix('surface', 'transparent 10%'),
            border: `1px solid ${colorMix('primary', 'transparent 68%')}`,
            radius: '2xl',
            shadow: 'md',
            hoverShadow: 'xl'
          },
          feature: {
            background: `linear-gradient(145deg, ${colorMix('surface', 'transparent 10%')}, ${colorMix('accent', 'transparent 84%')})`,
            border: `1px solid ${colorMix('accent', 'transparent 60%')}`,
            radius: '2xl',
            shadow: 'lg',
            hoverShadow: '2xl'
          },
          testimonial: {
            background: colorMix('background', 'transparent 10%'),
            border: `1px solid ${colorMix('secondary', 'transparent 72%')}`,
            radius: '2xl'
          },
          pricing: {
            background: `linear-gradient(160deg, ${colorMix('primary', 'transparent 86%')}, ${colorMix('surface', 'transparent 6%')})`,
            border: `1px solid ${colorMix('primary', 'transparent 42%')}`,
            radius: '2xl'
          }
        },
        hero: {
          layout: 'app',
          background: `radial-gradient(circle at 18% 16%, ${colorMix('accent', 'transparent 68%')}, transparent 32%), radial-gradient(circle at 84% 18%, ${colorMix('primary', 'transparent 70%')}, transparent 34%), ${color('background')}`,
          mediaShape: 'device',
          contentWidth: 'min(740px, 100%)',
          gap: 'clamp(2.5rem, 6vw, 6.5rem)'
        },
        navigation: {
          layout: 'centered',
          background: colorMix('surface', 'transparent 18%'),
          border: colorMix('primary', 'transparent 72%'),
          height: '5rem',
          blur: true,
          shadow: 'sm',
          activeIndicator: 'dot'
        },
        footer: {
          layout: 'rich',
          background: colorMix('surfaceAlt', 'transparent 20%'),
          foreground: color('text'),
          link: color('primary'),
          border: colorMix('primary', 'transparent 72%'),
          density: 'spacious',
          divider: true,
          socialIconStyle: 'soft'
        },
        sections: {
          services: {
            alignment: 'center',
            cardVariant: 'feature'
          },
          proof: {
            background: colorMix('primary', 'transparent 92%'),
            eyebrowColor: color('secondary')
          },
          process: {
            background: colorMix('accent', 'transparent 92%'),
            cardVariant: 'feature'
          },
          testimonials: {
            background: colorMix('surface', 'transparent 14%')
          },
          content: {
            alignment: 'center'
          }
        },
        icons: {
          ...softIcons,
          style: 'duotone',
          background: colorMix('accent', 'transparent 82%'),
          foreground: color('primary'),
          radius: '2xl'
        },
        motion: expressiveMotion,
        responsive: roomyResponsive
      }
    )
  }),
  brutalistMono: defineTheme({
    id: 'brutalistMono',
    displayName: 'Brutalist Mono',
    description: 'Stark monochrome theme with block navigation, squared cards, heavy type, and zero decorative shadow.',
    tags: ['brutalist', 'monochrome', 'editorial', 'architecture'],
    tokens: brandTokens(
      {
        background: '#ffffff',
        surface: '#f4f4f2',
        surfaceAlt: '#e6e6e0',
        text: '#050505',
        textMuted: '#343434',
        textInverse: '#ffffff',
        primary: '#050505',
        primaryForeground: '#ffffff',
        secondary: '#2a2a2a',
        secondaryForeground: '#ffffff',
        accent: '#737373',
        accentForeground: '#ffffff',
        border: '#050505',
        focus: '#050505',
        link: '#050505',
        overlay: 'rgb(0 0 0 / 0.72)'
      },
      {
        background: '#050505',
        surface: '#111111',
        surfaceAlt: '#1f1f1f',
        text: '#ffffff',
        textMuted: '#e5e5e5',
        textInverse: '#050505',
        primary: '#ffffff',
        primaryForeground: '#050505',
        secondary: '#d4d4d4',
        secondaryForeground: '#050505',
        accent: '#a3a3a3',
        accentForeground: '#050505',
        border: '#ffffff',
        focus: '#ffffff',
        link: '#ffffff',
        overlay: 'rgb(0 0 0 / 0.86)'
      },
      {
        typography: {
          display: {
            fontFamily: '"Archivo Black", Impact, "Arial Black", ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(3rem, 8.5vw, 7rem)',
            lineHeight: '0.82',
            fontWeight: '900',
            letterSpacing: '-0.075em',
            textTransform: 'uppercase'
          },
          heading: {
            fontFamily: '"Archivo Black", Impact, "Arial Black", ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(1.75rem, 4vw, 3.4rem)',
            lineHeight: '0.94',
            fontWeight: '900',
            letterSpacing: '-0.05em',
            textTransform: 'uppercase'
          },
          body: {
            fontFamily: '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
            fontSize: '0.98rem',
            lineHeight: '1.6',
            fontWeight: '500'
          },
          caption: {
            fontFamily: '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
            fontSize: '0.78rem',
            lineHeight: '1.4',
            fontWeight: '700',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          },
          button: {
            fontFamily: '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
            fontSize: '0.9rem',
            lineHeight: '1',
            fontWeight: '800',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          },
          mono: {
            ...technicalTypography.mono,
            fontWeight: '700'
          }
        },
        spacing: compactSpacing,
        radius: {
          xs: '0',
          sm: '0',
          md: '0',
          lg: '0',
          xl: '0',
          '2xl': '0',
          pill: '0'
        },
        elevation: flatElevation,
        buttons: {
          primary: {
            background: color('text'),
            color: color('textInverse'),
            border: `2px solid ${color('text')}`,
            hoverBackground: color('background'),
            hoverColor: color('text'),
            hoverBorder: `2px solid ${color('text')}`,
            radius: 'none',
            shadow: 'none',
            hoverShadow: 'none',
            transform: 'translate(3px, -3px)'
          },
          secondary: {
            background: color('background'),
            color: color('text'),
            border: `2px solid ${color('text')}`,
            hoverBackground: color('text'),
            hoverColor: color('textInverse'),
            hoverBorder: `2px solid ${color('text')}`,
            radius: 'none',
            shadow: 'none',
            hoverShadow: 'none',
            transform: 'translate(3px, -3px)'
          },
          ghost: {
            hoverBackground: color('text'),
            hoverColor: color('textInverse'),
            hoverBorder: `2px solid ${color('text')}`,
            radius: 'none'
          }
        },
        cards: {
          standard: {
            background: color('background'),
            border: `2px solid ${color('text')}`,
            radius: 'none',
            padding: 'clamp(1rem, 2.5vw, 1.75rem)',
            shadow: 'none',
            hoverShadow: 'none',
            mediaRadius: 'none'
          },
          feature: {
            background: color('surfaceAlt'),
            border: `2px solid ${color('text')}`,
            radius: 'none',
            shadow: 'none',
            hoverShadow: 'none',
            mediaRadius: 'none'
          },
          testimonial: {
            background: color('text'),
            foreground: color('textInverse'),
            border: `2px solid ${color('text')}`,
            radius: 'none',
            shadow: 'none',
            hoverShadow: 'none',
            mediaRadius: 'none'
          },
          pricing: {
            background: color('background'),
            border: `3px solid ${color('text')}`,
            radius: 'none',
            shadow: 'none',
            hoverShadow: 'none',
            mediaRadius: 'none'
          }
        },
        hero: {
          layout: 'docs',
          background: `linear-gradient(90deg, ${color('background')} 0 50%, ${color('surfaceAlt')} 50% 100%)`,
          mediaShape: 'none',
          minHeight: 'min(700px, calc(100vh - 4rem))',
          contentWidth: 'min(920px, 100%)',
          gap: 'clamp(1.5rem, 4vw, 4rem)'
        },
        navigation: {
          layout: 'sidebar',
          background: color('background'),
          foreground: color('text'),
          linkHover: color('text'),
          border: color('text'),
          height: '4rem',
          blur: false,
          shadow: 'none',
          activeIndicator: 'block'
        },
        footer: {
          layout: 'simple',
          background: color('text'),
          foreground: color('textInverse'),
          link: color('textInverse'),
          border: color('text'),
          density: 'compact',
          divider: false,
          socialIconStyle: 'plain'
        },
        sections: {
          services: {
            cardVariant: 'standard'
          },
          proof: {
            background: color('text'),
            foreground: color('textInverse'),
            eyebrowColor: color('textInverse'),
            alignment: 'start'
          },
          process: {
            cardVariant: 'feature'
          },
          testimonials: {
            background: color('surfaceAlt'),
            alignment: 'start'
          },
          content: {
            container: 'content'
          }
        },
        icons: {
          style: 'minimal',
          size: '1.35rem',
          strokeWidth: '2.4',
          background: 'transparent',
          foreground: color('text'),
          radius: 'none'
        },
        responsive: compactResponsive,
        motion: lowMotion
      }
    )
  }),
  cyberpunkNeon: defineTheme({
    id: 'cyberpunkNeon',
    displayName: 'Cyberpunk Neon',
    description: 'Dark neon theme with magenta, cyan, and lime energy, glowing cards, and high-motion launch styling.',
    defaultMode: 'dark',
    supportedModes: ['dark', 'light', 'highContrast'],
    tags: ['cyberpunk', 'gaming', 'nightlife', 'launch'],
    tokens: brandTokens(
      {
        background: '#fff7ff',
        surface: '#ffffff',
        surfaceAlt: '#f3e8ff',
        text: '#18051f',
        textMuted: '#6b4b76',
        primary: '#c026d3',
        primaryForeground: '#ffffff',
        secondary: '#0891b2',
        secondaryForeground: '#ffffff',
        accent: '#65a30d',
        accentForeground: '#071200',
        border: '#f0abfc',
        focus: '#06b6d4',
        link: '#0891b2'
      },
      {
        background: '#05000f',
        surface: '#12071f',
        surfaceAlt: '#1f0b34',
        text: '#fbf7ff',
        textMuted: '#cbb9e8',
        primary: '#ff2bd6',
        primaryForeground: '#1b0014',
        secondary: '#00e5ff',
        secondaryForeground: '#001b20',
        accent: '#a3ff12',
        accentForeground: '#071200',
        border: '#5b2387',
        focus: '#00e5ff',
        link: '#67e8f9',
        overlay: 'rgb(5 0 15 / 0.84)'
      },
      {
        typography: {
          display: {
            fontFamily: '"Rajdhani", "Orbitron", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(3rem, 8vw, 6.75rem)',
            lineHeight: '0.88',
            fontWeight: '800',
            letterSpacing: '-0.035em',
            textTransform: 'uppercase'
          },
          heading: {
            fontFamily: '"Rajdhani", "Orbitron", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(1.8rem, 3.6vw, 3.2rem)',
            lineHeight: '1',
            fontWeight: '800',
            letterSpacing: '-0.025em',
            textTransform: 'uppercase'
          },
          body: {
            ...technicalTypography.body,
            fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif'
          },
          caption: {
            ...technicalTypography.caption,
            fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
            letterSpacing: '0.18em',
            textTransform: 'uppercase'
          },
          button: {
            ...technicalTypography.button,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          },
          mono: technicalTypography.mono
        },
        radius: crispRadius,
        elevation: {
          sm: '0 0 0 1px rgb(255 43 214 / 0.28), 0 0 22px rgb(0 229 255 / 0.22)',
          md: '0 0 0 1px rgb(255 43 214 / 0.35), 0 0 38px rgb(0 229 255 / 0.28)',
          lg: '0 0 0 1px rgb(163 255 18 / 0.28), 0 0 64px rgb(255 43 214 / 0.28)',
          xl: '0 0 0 1px rgb(0 229 255 / 0.34), 0 0 90px rgb(255 43 214 / 0.34)',
          '2xl': '0 0 0 1px rgb(163 255 18 / 0.35), 0 0 120px rgb(0 229 255 / 0.34)'
        },
        buttons: {
          primary: {
            background: `linear-gradient(100deg, ${color('primary')}, ${color('secondary')})`,
            hoverBackground: `linear-gradient(100deg, ${colorMix('primary', 'white 10%')}, ${colorMix('secondary', 'white 10%')})`,
            border: `1px solid ${colorMix('secondary', 'transparent 36%')}`,
            hoverBorder: `1px solid ${color('accent')}`,
            radius: 'md',
            shadow: 'md',
            hoverShadow: 'xl',
            transform: 'translateY(-3px) skewX(-2deg)'
          },
          secondary: {
            background: 'transparent',
            color: color('secondary'),
            border: `1px solid ${color('secondary')}`,
            hoverBackground: colorMix('secondary', 'transparent 82%'),
            hoverColor: color('text'),
            hoverBorder: `1px solid ${color('accent')}`,
            radius: 'md',
            shadow: 'sm',
            hoverShadow: 'lg'
          },
          ghost: {
            color: color('accent'),
            hoverBackground: colorMix('accent', 'transparent 84%'),
            hoverColor: color('accent'),
            radius: 'md'
          }
        },
        cards: {
          standard: {
            background: colorMix('surface', 'transparent 8%'),
            border: `1px solid ${colorMix('secondary', 'transparent 48%')}`,
            radius: 'lg',
            shadow: 'md',
            hoverShadow: 'xl'
          },
          feature: {
            background: `linear-gradient(145deg, ${colorMix('primary', 'transparent 86%')}, ${colorMix('surfaceAlt', 'transparent 6%')})`,
            border: `1px solid ${colorMix('primary', 'transparent 32%')}`,
            radius: 'lg',
            shadow: 'lg',
            hoverShadow: '2xl'
          },
          testimonial: {
            background: colorMix('surfaceAlt', 'transparent 12%'),
            border: `1px solid ${colorMix('accent', 'transparent 56%')}`,
            radius: 'lg'
          },
          pricing: {
            background: `linear-gradient(150deg, ${colorMix('secondary', 'transparent 84%')}, ${colorMix('primary', 'transparent 86%')})`,
            border: `1px solid ${color('accent')}`,
            radius: 'lg',
            shadow: 'xl'
          }
        },
        hero: {
          layout: 'media',
          background: `radial-gradient(circle at 20% 20%, ${colorMix('primary', 'transparent 60%')}, transparent 30%), radial-gradient(circle at 82% 8%, ${colorMix('secondary', 'transparent 58%')}, transparent 32%), radial-gradient(circle at 52% 88%, ${colorMix('accent', 'transparent 72%')}, transparent 36%), ${color('background')}`,
          mediaShape: 'bleed',
          minHeight: 'min(840px, calc(100vh - 4.5rem))',
          contentWidth: 'min(760px, 100%)'
        },
        navigation: {
          layout: 'split',
          background: colorMix('surface', 'transparent 4%'),
          foreground: color('text'),
          linkHover: color('secondary'),
          border: colorMix('secondary', 'transparent 55%'),
          height: '4.5rem',
          blur: true,
          shadow: 'md',
          activeIndicator: 'pill'
        },
        footer: {
          ...richFooter,
          background: color('surfaceAlt'),
          foreground: color('text'),
          link: color('secondary'),
          border: colorMix('primary', 'transparent 42%')
        },
        sections: {
          services: {
            background: color('background'),
            eyebrowColor: color('secondary'),
            cardVariant: 'feature'
          },
          proof: {
            background: colorMix('primary', 'transparent 90%'),
            eyebrowColor: color('accent')
          },
          process: {
            background: colorMix('secondary', 'transparent 92%'),
            eyebrowColor: color('accent')
          },
          testimonials: {
            background: color('surface'),
            eyebrowColor: color('primary')
          },
          faq: {
            background: color('surfaceAlt')
          }
        },
        icons: {
          style: 'filled',
          size: '1.65rem',
          strokeWidth: '1.6',
          background: `linear-gradient(135deg, ${color('primary')}, ${color('secondary')})`,
          foreground: color('primaryForeground'),
          radius: 'md'
        },
        animation: {
          durationFast: '90ms',
          durationBase: '170ms',
          durationSlow: '460ms'
        },
        motion: {
          subtle: {
            duration: '180ms',
            translateY: '0.35rem',
            scale: '0.99'
          },
          standard: {
            duration: '300ms',
            translateY: '0.9rem',
            scale: '0.985'
          },
          expressive: {
            duration: '620ms',
            translateY: '1.6rem',
            scale: '0.96'
          },
          entrance: {
            duration: '760ms',
            translateY: '2rem',
            scale: '0.95'
          }
        }
      }
    )
  }),
  botanicalSerif: defineTheme({
    id: 'botanicalSerif',
    displayName: 'Botanical Serif',
    description: 'Warm botanical theme with cream papers, natural greens, editorial serif type, and soft organic cards.',
    tags: ['botanical', 'wellness', 'editorial', 'organic'],
    tokens: brandTokens(
      {
        background: '#fbf7ea',
        surface: '#fffdf5',
        surfaceAlt: '#e9eed7',
        text: '#24301f',
        textMuted: '#66705c',
        primary: '#4f6f3a',
        primaryForeground: '#ffffff',
        secondary: '#7a4f2f',
        secondaryForeground: '#fff7ea',
        accent: '#c8914b',
        accentForeground: '#24301f',
        border: '#d8dcc4',
        focus: '#5f7f45',
        link: '#3f5f2f'
      },
      {
        background: '#10160d',
        surface: '#192113',
        surfaceAlt: '#27331c',
        text: '#f6f1df',
        textMuted: '#cfc7ae',
        primary: '#b7d29a',
        primaryForeground: '#10160d',
        secondary: '#f0c58a',
        secondaryForeground: '#10160d',
        accent: '#d6a35b',
        accentForeground: '#10160d',
        border: '#4d5c3b',
        link: '#d7efb4'
      },
      {
        typography: {
          display: {
            fontFamily: '"Cormorant Garamond", Georgia, Cambria, "Times New Roman", serif',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            lineHeight: '0.96',
            fontWeight: '700',
            letterSpacing: '-0.045em'
          },
          heading: {
            fontFamily: '"Cormorant Garamond", Georgia, Cambria, "Times New Roman", serif',
            fontSize: 'clamp(2rem, 4vw, 3.35rem)',
            lineHeight: '1.08',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          },
          body: {
            fontFamily: '"Libre Baskerville", Georgia, Cambria, "Times New Roman", serif',
            fontSize: '1.05rem',
            lineHeight: '1.82',
            fontWeight: '400'
          },
          caption: serifTypography.caption,
          button: {
            ...serifTypography.button,
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          },
          mono: baseTypography.mono
        },
        spacing: editorialSpacing,
        radius: {
          ...softRadius,
          xl: '2.25rem',
          '2xl': '3rem'
        },
        elevation: glassElevation,
        buttons: {
          primary: {
            background: color('primary'),
            hoverBackground: colorMix('primary', 'black 10%'),
            radius: 'pill',
            shadow: 'sm',
            hoverShadow: 'md'
          },
          secondary: {
            background: colorMix('surface', 'transparent 8%'),
            border: `1px solid ${colorMix('primary', 'transparent 50%')}`,
            hoverBackground: colorMix('primary', 'transparent 88%'),
            radius: 'pill'
          },
          ghost: {
            hoverBackground: colorMix('accent', 'transparent 88%'),
            radius: 'pill'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: '2xl',
            padding: 'clamp(1.5rem, 4vw, 2.75rem)',
            shadow: 'sm',
            hoverShadow: 'md',
            mediaRadius: '2xl'
          },
          feature: {
            background: colorMix('primary', 'transparent 88%'),
            border: `1px solid ${colorMix('primary', 'transparent 58%')}`,
            radius: '2xl',
            mediaRadius: '2xl'
          },
          testimonial: {
            background: color('background'),
            border: `1px solid ${color('border')}`,
            radius: '2xl',
            mediaRadius: 'full'
          },
          pricing: {
            background: colorMix('accent', 'transparent 86%'),
            border: `1px solid ${colorMix('accent', 'transparent 45%')}`,
            radius: '2xl'
          }
        },
        hero: {
          layout: 'editorial',
          background: `radial-gradient(circle at 12% 14%, ${colorMix('primary', 'transparent 84%')}, transparent 30%), ${color('background')}`,
          mediaShape: 'arch',
          contentWidth: 'min(720px, 100%)',
          gap: 'clamp(2.5rem, 6vw, 6rem)'
        },
        navigation: {
          ...centeredNavigation,
          background: color('background'),
          linkHover: color('primary'),
          border: color('border'),
          activeIndicator: 'dot'
        },
        footer: {
          layout: 'columns',
          background: color('surfaceAlt'),
          foreground: color('text'),
          link: color('primary'),
          border: color('border'),
          density: 'spacious',
          divider: true,
          socialIconStyle: 'soft'
        },
        sections: {
          ...editorialSections,
          services: {
            background: color('surface'),
            cardVariant: 'feature',
            alignment: 'center'
          },
          process: {
            background: color('background'),
            eyebrowColor: color('accent'),
            cardVariant: 'feature'
          },
          faq: {
            background: color('surfaceAlt'),
            container: 'prose'
          }
        },
        icons: {
          ...softIcons,
          background: colorMix('primary', 'transparent 82%'),
          foreground: color('primary'),
          radius: 'full'
        },
        motion: lowMotion,
        responsive: roomyResponsive
      }
    )
  }),
  neoBanking: defineTheme({
    id: 'neoBanking',
    displayName: 'Neo Banking',
    description: 'Premium fintech theme with app-like layouts, crisp controls, trustworthy blue-green color, and disciplined cards.',
    tags: ['fintech', 'banking', 'app', 'professional'],
    tokens: brandTokens(
      {
        background: '#f4f8fb',
        surface: '#ffffff',
        surfaceAlt: '#e6eef5',
        text: '#071827',
        textMuted: '#4a5a68',
        primary: '#0b5cff',
        primaryForeground: '#ffffff',
        secondary: '#047857',
        secondaryForeground: '#ffffff',
        accent: '#14b8a6',
        accentForeground: '#04201e',
        border: '#cfdae6',
        focus: '#0b5cff',
        link: '#0848c8'
      },
      {
        background: '#06111f',
        surface: '#0d1b2b',
        surfaceAlt: '#14263a',
        text: '#f5fbff',
        textMuted: '#b9c8d8',
        primary: '#74a7ff',
        primaryForeground: '#06111f',
        secondary: '#5eead4',
        secondaryForeground: '#06111f',
        accent: '#2dd4bf',
        accentForeground: '#06111f',
        border: '#2a435e',
        link: '#9ec0ff'
      },
      {
        typography: {
          display: {
            ...baseTypography.display,
            fontFamily: '"IBM Plex Sans", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            lineHeight: '0.98',
            letterSpacing: '-0.06em'
          },
          heading: {
            ...baseTypography.heading,
            fontFamily: '"IBM Plex Sans", Inter, ui-sans-serif, system-ui, sans-serif',
            letterSpacing: '-0.035em'
          },
          caption: {
            ...baseTypography.caption,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          },
          mono: technicalTypography.mono
        },
        spacing: {
          section: 'clamp(4.25rem, 7vw, 7rem)',
          container: 'min(1180px, calc(100vw - 2rem))'
        },
        radius: crispRadius,
        elevation: {
          sm: '0 1px 2px rgb(7 24 39 / 0.08)',
          md: '0 18px 45px rgb(7 24 39 / 0.12)',
          lg: '0 28px 70px rgb(7 24 39 / 0.16)',
          xl: '0 42px 100px rgb(7 24 39 / 0.2)'
        },
        buttons: {
          primary: {
            background: color('primary'),
            hoverBackground: colorMix('primary', 'black 10%'),
            radius: 'lg',
            padding: '0.95rem 1.45rem',
            shadow: 'sm',
            hoverShadow: 'md'
          },
          secondary: {
            background: color('surface'),
            color: color('secondary'),
            border: `1px solid ${colorMix('secondary', 'transparent 50%')}`,
            hoverBackground: colorMix('secondary', 'transparent 90%'),
            hoverColor: color('secondary'),
            radius: 'lg'
          },
          ghost: {
            hoverBackground: colorMix('primary', 'transparent 91%'),
            radius: 'lg'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: 'lg',
            shadow: 'xs',
            hoverShadow: 'md'
          },
          feature: {
            background: `linear-gradient(145deg, ${color('surface')}, ${colorMix('primary', 'transparent 92%')})`,
            border: `1px solid ${colorMix('primary', 'transparent 62%')}`,
            radius: 'xl',
            shadow: 'md',
            hoverShadow: 'lg'
          },
          testimonial: {
            background: color('background'),
            border: `1px solid ${color('border')}`,
            radius: 'lg'
          },
          pricing: {
            background: color('surface'),
            border: `1px solid ${color('primary')}`,
            radius: 'xl',
            shadow: 'lg'
          }
        },
        hero: {
          layout: 'app',
          background: `linear-gradient(135deg, ${color('background')} 0%, ${colorMix('primary', 'transparent 90%')} 48%, ${colorMix('secondary', 'transparent 90%')} 100%)`,
          mediaShape: 'device',
          minHeight: 'min(780px, calc(100vh - 4.75rem))',
          contentWidth: 'min(700px, 100%)'
        },
        navigation: {
          layout: 'split',
          background: color('surface'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '4.75rem',
          blur: true,
          shadow: 'xs',
          activeIndicator: 'pill'
        },
        footer: {
          layout: 'columns',
          background: color('secondary'),
          foreground: color('secondaryForeground'),
          link: color('accent'),
          border: colorMix('secondary', 'white 16%'),
          density: 'comfortable',
          divider: true,
          socialIconStyle: 'outlined'
        },
        pageTemplates: {
          checkout: {
            maxWidth: 'wide',
            sidebarWidth: '24rem'
          },
          directory: {
            sidebarWidth: '19rem'
          }
        },
        forms: {
          background: color('surface'),
          shadow: 'xs',
          radius: 'lg'
        },
        sections: {
          services: {
            cardVariant: 'feature'
          },
          proof: {
            background: color('surface'),
            eyebrowColor: color('secondary')
          },
          process: {
            background: color('background'),
            eyebrowColor: color('accent')
          },
          testimonials: {
            background: color('surfaceAlt')
          }
        },
        icons: {
          ...solidIcons,
          background: colorMix('primary', 'transparent 86%'),
          foreground: color('primary'),
          radius: 'lg'
        },
        motion: lowMotion
      }
    )
  }),
  noirEditorial: defineTheme({
    id: 'noirEditorial',
    displayName: 'Noir Editorial',
    description: 'Dark literary editorial theme with couture serif scale, gold accents, restrained motion, and high-fashion contrast.',
    defaultMode: 'dark',
    supportedModes: ['dark', 'light', 'highContrast'],
    tags: ['editorial', 'fashion', 'luxury', 'dark'],
    tokens: brandTokens(
      {
        background: '#f7f2e8',
        surface: '#fffaf0',
        surfaceAlt: '#e8ddc9',
        text: '#17120d',
        textMuted: '#63594d',
        primary: '#7a5c25',
        primaryForeground: '#ffffff',
        secondary: '#17120d',
        secondaryForeground: '#f7f2e8',
        accent: '#b68a35',
        accentForeground: '#17120d',
        border: '#d7c9ad',
        link: '#6f511d'
      },
      {
        background: '#050505',
        surface: '#11100e',
        surfaceAlt: '#1d1914',
        text: '#f8f1e3',
        textMuted: '#c5b8a2',
        primary: '#d6b25e',
        primaryForeground: '#050505',
        secondary: '#f8f1e3',
        secondaryForeground: '#050505',
        accent: '#b88935',
        accentForeground: '#050505',
        border: '#4c4030',
        link: '#f0d28a',
        overlay: 'rgb(0 0 0 / 0.82)'
      },
      {
        typography: {
          display: {
            fontFamily: '"Playfair Display", Didot, Georgia, Cambria, serif',
            fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
            lineHeight: '0.86',
            fontWeight: '700',
            letterSpacing: '-0.06em'
          },
          heading: {
            fontFamily: '"Playfair Display", Didot, Georgia, Cambria, serif',
            fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
            lineHeight: '0.98',
            fontWeight: '700',
            letterSpacing: '-0.035em'
          },
          body: {
            fontFamily: '"Libre Baskerville", Georgia, Cambria, "Times New Roman", serif',
            fontSize: '1.08rem',
            lineHeight: '1.86',
            fontWeight: '400'
          },
          caption: {
            ...editorialTypography.caption,
            letterSpacing: '0.18em'
          },
          button: {
            ...serifTypography.button,
            letterSpacing: '0.14em',
            textTransform: 'uppercase'
          },
          mono: baseTypography.mono
        },
        spacing: spaciousSpacing,
        radius: crispRadius,
        elevation: {
          sm: '0 10px 30px rgb(0 0 0 / 0.2)',
          md: '0 20px 55px rgb(0 0 0 / 0.3)',
          lg: '0 34px 90px rgb(0 0 0 / 0.38)',
          xl: '0 48px 120px rgb(0 0 0 / 0.46)'
        },
        buttons: luxuryButtons,
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${colorMix('primary', 'transparent 55%')}`,
            radius: 'md',
            shadow: 'sm',
            hoverShadow: 'md'
          },
          feature: {
            background: color('surfaceAlt'),
            border: `1px solid ${colorMix('primary', 'transparent 44%')}`,
            radius: 'lg'
          },
          testimonial: {
            background: color('background'),
            border: `1px solid ${color('border')}`,
            radius: 'md'
          },
          pricing: {
            background: color('surface'),
            border: `1px solid ${color('primary')}`,
            radius: 'lg',
            shadow: 'lg'
          }
        },
        hero: {
          layout: 'editorial',
          background: `linear-gradient(135deg, ${color('background')} 0%, ${color('surface')} 58%, ${colorMix('primary', 'transparent 86%')} 100%)`,
          mediaShape: 'arch',
          minHeight: 'min(820px, calc(100vh - 5rem))',
          contentWidth: 'min(760px, 100%)',
          gap: 'clamp(2.75rem, 7vw, 7rem)'
        },
        navigation: {
          layout: 'centered',
          background: color('background'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '5rem',
          blur: false,
          shadow: 'none',
          activeIndicator: 'dot'
        },
        footer: {
          ...richFooter,
          background: color('surfaceAlt'),
          foreground: color('text'),
          link: color('primary'),
          border: color('border'),
          socialIconStyle: 'plain'
        },
        sections: editorialSections,
        icons: {
          ...minimalIcons,
          foreground: color('primary'),
          strokeWidth: '1.25'
        },
        motion: lowMotion,
        responsive: roomyResponsive
      }
    )
  }),
  sunsetGradient: defineTheme({
    id: 'sunsetGradient',
    displayName: 'Sunset Gradient',
    description: 'Expressive creator theme with coral, violet, and golden gradients, rounded UI, and energetic motion.',
    tags: ['creator', 'agency', 'campaign', 'gradient'],
    tokens: brandTokens(
      {
        background: '#fff5ed',
        surface: '#ffffff',
        surfaceAlt: '#ffe3d4',
        text: '#25132c',
        textMuted: '#6f5a72',
        primary: '#f97316',
        primaryForeground: '#ffffff',
        secondary: '#7c3aed',
        secondaryForeground: '#ffffff',
        accent: '#facc15',
        accentForeground: '#25132c',
        border: '#fecdb6',
        focus: '#7c3aed',
        link: '#c2410c'
      },
      {
        background: '#18091f',
        surface: '#25102d',
        surfaceAlt: '#3b1746',
        text: '#fff7ed',
        textMuted: '#f1cfc6',
        primary: '#fb923c',
        primaryForeground: '#18091f',
        secondary: '#c4b5fd',
        secondaryForeground: '#18091f',
        accent: '#fde047',
        accentForeground: '#18091f',
        border: '#6f3357',
        link: '#fdba74'
      },
      {
        typography: {
          display: {
            ...friendlyTypography.display,
            fontFamily: '"Space Grotesk", Nunito, Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(3.1rem, 7.5vw, 6.5rem)',
            lineHeight: '0.9',
            letterSpacing: '-0.06em'
          },
          heading: {
            ...friendlyTypography.heading,
            fontFamily: '"Space Grotesk", Nunito, Inter, ui-sans-serif, system-ui, sans-serif'
          },
          body: friendlyTypography.body,
          caption: {
            ...friendlyTypography.caption,
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          },
          button: friendlyTypography.button,
          mono: baseTypography.mono
        },
        radius: {
          ...softRadius,
          xl: '2.25rem',
          '2xl': '2.75rem'
        },
        elevation: glassElevation,
        buttons: {
          primary: {
            background: `linear-gradient(100deg, ${color('primary')}, ${color('secondary')})`,
            hoverBackground: `linear-gradient(100deg, ${colorMix('primary', 'white 8%')}, ${colorMix('secondary', 'white 8%')})`,
            radius: 'pill',
            shadow: 'md',
            hoverShadow: 'xl',
            transform: 'translateY(-3px) rotate(-0.5deg)'
          },
          secondary: {
            background: colorMix('accent', 'transparent 16%'),
            color: color('text'),
            border: `1px solid ${colorMix('accent', 'transparent 42%')}`,
            hoverBackground: colorMix('accent', 'transparent 4%'),
            hoverColor: color('text'),
            radius: 'pill',
            shadow: 'sm'
          },
          ghost: {
            hoverBackground: colorMix('secondary', 'transparent 88%'),
            radius: 'pill'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: '2xl',
            shadow: 'md',
            hoverShadow: 'xl',
            mediaRadius: '2xl'
          },
          feature: {
            background: `linear-gradient(135deg, ${colorMix('primary', 'transparent 84%')}, ${colorMix('secondary', 'transparent 88%')})`,
            border: `1px solid ${colorMix('secondary', 'transparent 60%')}`,
            radius: '2xl',
            shadow: 'lg'
          },
          testimonial: {
            background: colorMix('surface', 'transparent 8%'),
            border: `1px solid ${colorMix('primary', 'transparent 68%')}`,
            radius: '2xl'
          },
          pricing: {
            background: `linear-gradient(145deg, ${colorMix('accent', 'transparent 62%')}, ${color('surface')})`,
            border: `1px solid ${colorMix('primary', 'transparent 44%')}`,
            radius: '2xl',
            shadow: 'xl'
          }
        },
        hero: {
          layout: 'centered',
          background: `radial-gradient(circle at 12% 22%, ${colorMix('primary', 'transparent 65%')}, transparent 32%), radial-gradient(circle at 80% 18%, ${colorMix('secondary', 'transparent 70%')}, transparent 34%), radial-gradient(circle at 52% 90%, ${colorMix('accent', 'transparent 66%')}, transparent 38%), ${color('background')}`,
          mediaShape: 'circle',
          minHeight: 'min(800px, calc(100vh - 5rem))',
          contentWidth: 'min(860px, 100%)'
        },
        navigation: {
          layout: 'centered',
          background: colorMix('surface', 'transparent 12%'),
          foreground: color('text'),
          linkHover: color('secondary'),
          border: colorMix('primary', 'transparent 72%'),
          height: '5rem',
          blur: true,
          shadow: 'sm',
          activeIndicator: 'pill'
        },
        footer: {
          layout: 'centered',
          background: `linear-gradient(135deg, ${colorMix('primary', 'transparent 78%')}, ${colorMix('secondary', 'transparent 82%')})`,
          foreground: color('text'),
          link: color('secondary'),
          border: colorMix('primary', 'transparent 60%'),
          density: 'spacious',
          divider: false,
          socialIconStyle: 'filled'
        },
        sections: {
          ...centeredSections,
          services: {
            alignment: 'center',
            cardVariant: 'feature'
          },
          proof: {
            background: colorMix('accent', 'transparent 82%')
          },
          process: {
            background: colorMix('secondary', 'transparent 92%'),
            cardVariant: 'feature'
          },
          faq: {
            background: colorMix('primary', 'transparent 92%')
          }
        },
        icons: {
          style: 'solid',
          size: '1.55rem',
          strokeWidth: '1.8',
          background: `linear-gradient(135deg, ${color('secondary')}, ${color('primary')})`,
          foreground: color('primaryForeground'),
          radius: '2xl'
        },
        motion: expressiveMotion,
        responsive: roomyResponsive
      }
    )
  }),
  industrialGrid: defineTheme({
    id: 'industrialGrid',
    displayName: 'Industrial Grid',
    description: 'Graphite and safety-orange theme with architectural grids, block geometry, durable cards, and direct navigation.',
    defaultMode: 'dark',
    supportedModes: ['dark', 'light', 'highContrast'],
    tags: ['industrial', 'construction', 'architecture', 'grid'],
    tokens: brandTokens(
      {
        background: '#f3f1eb',
        surface: '#ffffff',
        surfaceAlt: '#dedbd2',
        text: '#171717',
        textMuted: '#525252',
        primary: '#ea580c',
        primaryForeground: '#111111',
        secondary: '#262626',
        secondaryForeground: '#ffffff',
        accent: '#facc15',
        accentForeground: '#171717',
        border: '#b9b4aa',
        focus: '#ea580c',
        link: '#c2410c'
      },
      {
        background: '#0d0f10',
        surface: '#171a1c',
        surfaceAlt: '#252a2d',
        text: '#f4f4f2',
        textMuted: '#c6c4bd',
        primary: '#ff6b00',
        primaryForeground: '#111111',
        secondary: '#f4f4f2',
        secondaryForeground: '#0d0f10',
        accent: '#ffd000',
        accentForeground: '#111111',
        border: '#454b50',
        focus: '#ff8a2b',
        link: '#ff9a3d'
      },
      {
        typography: {
          display: {
            fontFamily: '"Barlow Condensed", "Arial Narrow", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(3.25rem, 8vw, 6.9rem)',
            lineHeight: '0.86',
            fontWeight: '800',
            letterSpacing: '-0.04em',
            textTransform: 'uppercase'
          },
          heading: {
            fontFamily: '"Barlow Condensed", "Arial Narrow", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3.4rem)',
            lineHeight: '0.95',
            fontWeight: '800',
            letterSpacing: '-0.025em',
            textTransform: 'uppercase'
          },
          body: {
            ...baseTypography.body,
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
          },
          caption: {
            ...technicalTypography.caption,
            letterSpacing: '0.16em',
            textTransform: 'uppercase'
          },
          button: {
            ...baseTypography.button,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          },
          mono: technicalTypography.mono
        },
        spacing: compactSpacing,
        radius: blockRadius,
        elevation: flatElevation,
        buttons: {
          primary: {
            background: color('primary'),
            color: color('primaryForeground'),
            border: `2px solid ${color('primary')}`,
            hoverBackground: color('accent'),
            hoverColor: color('accentForeground'),
            hoverBorder: `2px solid ${color('accent')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'none',
            transform: 'translateY(-2px)'
          },
          secondary: {
            background: color('surface'),
            color: color('text'),
            border: `2px solid ${color('border')}`,
            hoverBackground: color('surfaceAlt'),
            hoverBorder: `2px solid ${color('primary')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'none'
          },
          ghost: {
            hoverBackground: colorMix('primary', 'transparent 84%'),
            hoverBorder: `2px solid ${color('primary')}`,
            radius: 'sm'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `2px solid ${color('border')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'none',
            mediaRadius: 'sm'
          },
          feature: {
            background: color('surfaceAlt'),
            border: `2px solid ${color('primary')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'none',
            mediaRadius: 'sm'
          },
          testimonial: {
            background: color('background'),
            border: `2px solid ${color('border')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'none'
          },
          pricing: {
            background: color('surface'),
            border: `3px solid ${color('primary')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'none'
          }
        },
        hero: {
          layout: 'split',
          background: `linear-gradient(${colorMix('border', 'transparent 68%')} 1px, transparent 1px), linear-gradient(90deg, ${colorMix('border', 'transparent 68%')} 1px, transparent 1px), ${color('background')}`,
          mediaShape: 'rounded',
          minHeight: 'min(760px, calc(100vh - 4.5rem))',
          contentWidth: 'min(700px, 100%)',
          gap: 'clamp(2rem, 5vw, 5rem)'
        },
        navigation: {
          layout: 'sidebar',
          background: color('surface'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '4.25rem',
          blur: false,
          shadow: 'none',
          activeIndicator: 'block'
        },
        footer: {
          layout: 'columns',
          background: color('surfaceAlt'),
          foreground: color('text'),
          link: color('primary'),
          border: color('border'),
          density: 'compact',
          divider: true,
          socialIconStyle: 'filled'
        },
        pageTemplates: {
          landing: {
            maxWidth: 'full',
            grid: 'repeat(12, minmax(0, 1fr))'
          },
          directory: {
            sidebarWidth: '20rem',
            grid: 'minmax(18rem, 0.32fr) minmax(0, 1fr)'
          }
        },
        sections: {
          services: {
            cardVariant: 'feature'
          },
          proof: {
            background: color('surfaceAlt'),
            alignment: 'start',
            eyebrowColor: color('primary')
          },
          process: {
            background: color('background'),
            eyebrowColor: color('accent'),
            cardVariant: 'feature'
          },
          testimonials: {
            background: color('surface')
          },
          content: {
            container: 'content'
          }
        },
        icons: {
          style: 'solid',
          size: '1.4rem',
          strokeWidth: '2',
          background: color('primary'),
          foreground: color('primaryForeground'),
          radius: 'sm'
        },
        motion: lowMotion,
        responsive: compactResponsive
      }
    )
  }),
  candyPop: defineTheme({
    id: 'candyPop',
    displayName: 'Candy Pop',
    description: 'Playful pastel theme with oversized radius, bubbly commerce cards, bright CTAs, and bouncy motion.',
    tags: ['playful', 'commerce', 'community', 'pastel'],
    tokens: brandTokens(
      {
        background: '#fff7fb',
        surface: '#ffffff',
        surfaceAlt: '#f5e8ff',
        text: '#2a1636',
        textMuted: '#715d7b',
        primary: '#db2777',
        primaryForeground: '#ffffff',
        secondary: '#7c3aed',
        secondaryForeground: '#ffffff',
        accent: '#fbbf24',
        accentForeground: '#2a1636',
        border: '#fbcfe8',
        focus: '#db2777',
        link: '#be185d'
      },
      {
        background: '#1b1026',
        surface: '#28163a',
        surfaceAlt: '#3a2052',
        text: '#fff7fb',
        textMuted: '#e9cfe9',
        primary: '#f472b6',
        primaryForeground: '#1b1026',
        secondary: '#c4b5fd',
        secondaryForeground: '#1b1026',
        accent: '#fde68a',
        accentForeground: '#1b1026',
        border: '#704071',
        link: '#f9a8d4'
      },
      {
        typography: {
          display: {
            fontFamily: '"Fredoka", Nunito, Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            lineHeight: '0.92',
            fontWeight: '800',
            letterSpacing: '-0.045em'
          },
          heading: {
            ...friendlyTypography.heading,
            fontFamily: '"Fredoka", Nunito, Inter, ui-sans-serif, system-ui, sans-serif',
            fontWeight: '800'
          },
          body: friendlyTypography.body,
          caption: {
            ...friendlyTypography.caption,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          },
          button: {
            ...friendlyTypography.button,
            fontWeight: '800'
          },
          mono: baseTypography.mono
        },
        spacing: spaciousSpacing,
        radius: {
          md: '1.25rem',
          lg: '1.75rem',
          xl: '2.5rem',
          '2xl': '3.25rem',
          pill: '999px'
        },
        elevation: {
          sm: '0 8px 0 rgb(219 39 119 / 0.16)',
          md: '0 14px 0 rgb(124 58 237 / 0.14), 0 24px 50px rgb(219 39 119 / 0.12)',
          lg: '0 18px 0 rgb(251 191 36 / 0.22), 0 32px 70px rgb(124 58 237 / 0.16)',
          xl: '0 24px 0 rgb(219 39 119 / 0.18), 0 48px 110px rgb(124 58 237 / 0.18)'
        },
        buttons: {
          primary: {
            background: color('primary'),
            hoverBackground: colorMix('primary', 'white 8%'),
            radius: 'pill',
            padding: '1rem 1.6rem',
            shadow: 'md',
            hoverShadow: 'lg',
            transform: 'translateY(-4px) scale(1.02)'
          },
          secondary: {
            background: color('accent'),
            color: color('accentForeground'),
            border: `1px solid ${colorMix('accent', 'black 8%')}`,
            hoverBackground: colorMix('accent', 'white 10%'),
            hoverColor: color('accentForeground'),
            radius: 'pill',
            shadow: 'sm',
            hoverShadow: 'md',
            transform: 'translateY(-3px)'
          },
          ghost: {
            hoverBackground: colorMix('secondary', 'transparent 88%'),
            radius: 'pill'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: '2xl',
            shadow: 'md',
            hoverShadow: 'lg',
            mediaRadius: '2xl'
          },
          feature: {
            background: `linear-gradient(135deg, ${colorMix('secondary', 'transparent 90%')}, ${colorMix('primary', 'transparent 90%')})`,
            border: `1px solid ${colorMix('secondary', 'transparent 64%')}`,
            radius: '2xl',
            shadow: 'lg',
            mediaRadius: '2xl'
          },
          testimonial: {
            background: colorMix('accent', 'transparent 78%'),
            border: `1px solid ${colorMix('accent', 'transparent 42%')}`,
            radius: '2xl'
          },
          pricing: {
            background: color('surface'),
            border: `2px solid ${color('primary')}`,
            radius: '2xl',
            shadow: 'xl'
          }
        },
        hero: {
          layout: 'centered',
          background: `radial-gradient(circle at 16% 20%, ${colorMix('accent', 'transparent 58%')}, transparent 30%), radial-gradient(circle at 82% 18%, ${colorMix('secondary', 'transparent 78%')}, transparent 34%), radial-gradient(circle at 50% 88%, ${colorMix('primary', 'transparent 82%')}, transparent 36%), ${color('background')}`,
          mediaShape: 'circle',
          minHeight: 'min(780px, calc(100vh - 5rem))',
          contentWidth: 'min(840px, 100%)'
        },
        navigation: {
          layout: 'centered',
          background: color('surface'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '5rem',
          blur: true,
          shadow: 'sm',
          activeIndicator: 'pill'
        },
        footer: {
          layout: 'centered',
          background: color('surfaceAlt'),
          foreground: color('text'),
          link: color('primary'),
          border: color('border'),
          density: 'spacious',
          divider: false,
          socialIconStyle: 'filled'
        },
        sections: {
          ...centeredSections,
          services: {
            alignment: 'center',
            cardVariant: 'feature'
          },
          proof: {
            background: colorMix('accent', 'transparent 80%')
          },
          process: {
            background: colorMix('primary', 'transparent 92%'),
            cardVariant: 'feature'
          },
          testimonials: {
            background: colorMix('secondary', 'transparent 92%')
          }
        },
        icons: {
          ...softIcons,
          style: 'duotone',
          size: '1.65rem',
          background: colorMix('primary', 'transparent 82%'),
          foreground: color('primary'),
          radius: 'full'
        },
        motion: {
          subtle: {
            duration: '180ms',
            translateY: '0.4rem',
            scale: '0.99'
          },
          standard: {
            duration: '280ms',
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            translateY: '0.85rem',
            scale: '0.985'
          },
          expressive: {
            duration: '560ms',
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            translateY: '1.4rem',
            scale: '0.96'
          },
          entrance: {
            duration: '720ms',
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            translateY: '1.8rem',
            scale: '0.94'
          }
        },
        responsive: roomyResponsive
      }
    )
  }),
  zenInk: defineTheme({
    id: 'zenInk',
    displayName: 'Zen Ink',
    description: 'Calm rice-paper theme with centered editorial composition, monochrome ink tones, hairline cards, and minimal motion.',
    tags: ['minimal', 'zen', 'editorial', 'wellness'],
    tokens: brandTokens(
      {
        background: '#fbf7ef',
        surface: '#fffdf8',
        surfaceAlt: '#eee7dc',
        text: '#1c1917',
        textMuted: '#6b6258',
        primary: '#1c1917',
        primaryForeground: '#fbf7ef',
        secondary: '#6f604e',
        secondaryForeground: '#fbf7ef',
        accent: '#9c7c54',
        accentForeground: '#1c1917',
        border: '#ded5c7',
        focus: '#6f604e',
        link: '#4d4338'
      },
      {
        background: '#0e0d0b',
        surface: '#171511',
        surfaceAlt: '#242017',
        text: '#f5efe4',
        textMuted: '#c8bdad',
        primary: '#f5efe4',
        primaryForeground: '#0e0d0b',
        secondary: '#d6c6ad',
        secondaryForeground: '#0e0d0b',
        accent: '#b79768',
        accentForeground: '#0e0d0b',
        border: '#443c31',
        link: '#ead8bd'
      },
      {
        typography: {
          display: {
            fontFamily: '"Zen Old Mincho", "Noto Serif", Georgia, Cambria, serif',
            fontSize: 'clamp(2.75rem, 6.2vw, 5.75rem)',
            lineHeight: '1',
            fontWeight: '600',
            letterSpacing: '-0.04em'
          },
          heading: {
            fontFamily: '"Zen Old Mincho", "Noto Serif", Georgia, Cambria, serif',
            fontSize: 'clamp(1.85rem, 3.5vw, 3rem)',
            lineHeight: '1.18',
            fontWeight: '600',
            letterSpacing: '-0.02em'
          },
          body: {
            fontFamily: '"Noto Serif", Georgia, Cambria, "Times New Roman", serif',
            fontSize: '1.05rem',
            lineHeight: '1.86',
            fontWeight: '400'
          },
          caption: {
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: '0.8rem',
            lineHeight: '1.5',
            fontWeight: '600',
            letterSpacing: '0.16em',
            textTransform: 'uppercase'
          },
          button: {
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: '0.88rem',
            lineHeight: '1',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          },
          mono: baseTypography.mono
        },
        spacing: spaciousSpacing,
        radius: crispRadius,
        elevation: flatElevation,
        buttons: {
          primary: {
            background: color('primary'),
            color: color('primaryForeground'),
            border: `1px solid ${color('primary')}`,
            hoverBackground: color('background'),
            hoverColor: color('text'),
            hoverBorder: `1px solid ${color('text')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'none',
            transform: 'none'
          },
          secondary: {
            background: 'transparent',
            color: color('text'),
            border: `1px solid ${color('border')}`,
            hoverBackground: color('surfaceAlt'),
            hoverColor: color('text'),
            hoverBorder: `1px solid ${color('text')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'none'
          },
          ghost: {
            hoverBackground: color('surfaceAlt'),
            radius: 'sm'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: 'sm',
            padding: 'clamp(1.5rem, 4vw, 2.75rem)',
            shadow: 'none',
            hoverShadow: 'none',
            mediaRadius: 'sm'
          },
          feature: {
            background: color('background'),
            border: `1px solid ${color('border')}`,
            radius: 'md',
            shadow: 'none',
            hoverShadow: 'none'
          },
          testimonial: {
            background: color('surfaceAlt'),
            border: `1px solid ${color('border')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'none'
          },
          pricing: {
            background: color('surface'),
            border: `1px solid ${color('text')}`,
            radius: 'md',
            shadow: 'none',
            hoverShadow: 'none'
          }
        },
        hero: {
          layout: 'centered',
          background: `radial-gradient(circle at 50% 12%, ${colorMix('accent', 'transparent 88%')}, transparent 34%), ${color('background')}`,
          mediaShape: 'none',
          minHeight: 'min(720px, calc(100vh - 4.75rem))',
          contentWidth: 'min(760px, 100%)'
        },
        navigation: {
          layout: 'centered',
          background: color('background'),
          foreground: color('text'),
          linkHover: color('secondary'),
          border: color('border'),
          height: '4.75rem',
          blur: false,
          shadow: 'none',
          activeIndicator: 'underline'
        },
        footer: minimalFooter,
        sections: {
          ...centeredSections,
          services: {
            alignment: 'center',
            cardVariant: 'standard'
          },
          proof: {
            background: color('surfaceAlt'),
            eyebrowColor: color('secondary')
          },
          process: {
            background: color('background'),
            eyebrowColor: color('accent')
          },
          testimonials: {
            background: color('surface')
          },
          faq: {
            container: 'prose'
          },
          content: {
            alignment: 'center',
            container: 'prose'
          }
        },
        icons: {
          ...minimalIcons,
          foreground: color('text'),
          strokeWidth: '1.2'
        },
        motion: lowMotion,
        responsive: roomyResponsive
      }
    )
  }),
  plasmaDashboard: defineTheme({
    id: 'plasmaDashboard',
    displayName: 'Plasma Dashboard',
    description: 'Deep product dashboard theme with blue-violet plasma glow, app-style hero media, and luminous data cards.',
    defaultMode: 'dark',
    supportedModes: ['dark', 'light', 'highContrast'],
    tags: ['dashboard', 'saas', 'product', 'analytics'],
    tokens: brandTokens(
      {
        background: '#f3f7ff',
        surface: '#ffffff',
        surfaceAlt: '#e5edff',
        text: '#0c1224',
        textMuted: '#4d5b78',
        primary: '#4f46e5',
        primaryForeground: '#ffffff',
        secondary: '#0f172a',
        secondaryForeground: '#ffffff',
        accent: '#0891b2',
        accentForeground: '#06131f',
        border: '#c9d8ff',
        focus: '#6366f1',
        link: '#4338ca',
        overlay: 'rgb(12 18 36 / 0.64)'
      },
      {
        background: '#040816',
        surface: '#0b1224',
        surfaceAlt: '#151a3a',
        text: '#f7fbff',
        textMuted: '#b9c8e8',
        primary: '#8b5cf6',
        primaryForeground: '#14072e',
        secondary: '#38bdf8',
        secondaryForeground: '#04131f',
        accent: '#22d3ee',
        accentForeground: '#04131f',
        border: '#2b3566',
        focus: '#a78bfa',
        link: '#c4b5fd',
        overlay: 'rgb(4 8 22 / 0.84)'
      },
      {
        typography: {
          display: {
            ...technicalTypography.display,
            fontFamily: '"Sora", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(2.9rem, 7vw, 6rem)',
            lineHeight: '0.92',
            letterSpacing: '-0.065em'
          },
          heading: {
            ...technicalTypography.heading,
            fontFamily: '"Sora", Inter, ui-sans-serif, system-ui, sans-serif',
            letterSpacing: '-0.045em'
          },
          caption: {
            ...technicalTypography.caption,
            letterSpacing: '0.16em',
            textTransform: 'uppercase'
          },
          button: {
            ...technicalTypography.button,
            letterSpacing: '0.08em'
          },
          mono: technicalTypography.mono
        },
        spacing: spaciousSpacing,
        radius: {
          ...softRadius,
          lg: '1.25rem',
          xl: '1.75rem',
          '2xl': '2.5rem'
        },
        elevation: {
          sm: '0 0 0 1px rgb(139 92 246 / 0.18), 0 10px 28px rgb(34 211 238 / 0.12)',
          md: '0 0 0 1px rgb(139 92 246 / 0.22), 0 22px 55px rgb(56 189 248 / 0.18)',
          lg: '0 0 0 1px rgb(34 211 238 / 0.26), 0 34px 84px rgb(139 92 246 / 0.24)',
          xl: '0 0 0 1px rgb(167 139 250 / 0.28), 0 48px 120px rgb(34 211 238 / 0.24)',
          '2xl': '0 0 0 1px rgb(34 211 238 / 0.35), 0 60px 150px rgb(139 92 246 / 0.3)'
        },
        buttons: {
          primary: {
            background: `linear-gradient(120deg, ${color('primary')}, ${color('secondary')})`,
            hoverBackground: `linear-gradient(120deg, ${colorMix('primary', 'white 8%')}, ${colorMix('secondary', 'white 8%')})`,
            border: `1px solid ${colorMix('secondary', 'transparent 46%')}`,
            hoverBorder: `1px solid ${color('accent')}`,
            radius: 'lg',
            shadow: 'md',
            hoverShadow: 'xl',
            transform: 'translateY(-2px)'
          },
          secondary: {
            background: colorMix('surface', 'transparent 10%'),
            color: color('text'),
            border: `1px solid ${colorMix('secondary', 'transparent 58%')}`,
            hoverBackground: colorMix('secondary', 'transparent 86%'),
            hoverColor: color('text'),
            hoverBorder: `1px solid ${color('secondary')}`,
            radius: 'lg',
            shadow: 'sm',
            hoverShadow: 'md'
          },
          ghost: {
            color: color('secondary'),
            hoverBackground: colorMix('primary', 'transparent 88%'),
            hoverColor: color('text'),
            radius: 'lg'
          }
        },
        cards: {
          standard: {
            background: colorMix('surface', 'transparent 8%'),
            border: `1px solid ${colorMix('secondary', 'transparent 66%')}`,
            radius: 'xl',
            shadow: 'md',
            hoverShadow: 'xl',
            mediaRadius: 'lg'
          },
          feature: {
            background: `linear-gradient(150deg, ${colorMix('primary', 'transparent 84%')}, ${colorMix('surfaceAlt', 'transparent 8%')})`,
            border: `1px solid ${colorMix('primary', 'transparent 50%')}`,
            radius: '2xl',
            shadow: 'lg',
            hoverShadow: '2xl',
            mediaRadius: 'xl'
          },
          testimonial: {
            background: colorMix('surfaceAlt', 'transparent 10%'),
            border: `1px solid ${colorMix('accent', 'transparent 62%')}`,
            radius: 'xl'
          },
          pricing: {
            background: `linear-gradient(145deg, ${colorMix('secondary', 'transparent 82%')}, ${colorMix('primary', 'transparent 86%')})`,
            border: `1px solid ${color('secondary')}`,
            radius: '2xl',
            shadow: 'xl'
          }
        },
        hero: {
          layout: 'app',
          background: `radial-gradient(circle at 16% 18%, ${colorMix('primary', 'transparent 58%')}, transparent 34%), radial-gradient(circle at 82% 14%, ${colorMix('secondary', 'transparent 60%')}, transparent 34%), radial-gradient(circle at 56% 86%, ${colorMix('accent', 'transparent 74%')}, transparent 38%), ${color('background')}`,
          mediaShape: 'device',
          minHeight: 'min(820px, calc(100vh - 4.75rem))',
          contentWidth: 'min(740px, 100%)',
          gap: 'clamp(2.5rem, 6vw, 6.5rem)'
        },
        navigation: {
          layout: 'split',
          background: colorMix('surface', 'transparent 8%'),
          foreground: color('text'),
          linkHover: color('secondary'),
          border: colorMix('secondary', 'transparent 66%'),
          height: '4.75rem',
          blur: true,
          shadow: 'md',
          activeIndicator: 'pill'
        },
        footer: {
          layout: 'rich',
          background: color('surface'),
          foreground: color('text'),
          link: color('secondary'),
          border: colorMix('secondary', 'transparent 70%'),
          density: 'spacious',
          divider: true,
          socialIconStyle: 'soft'
        },
        pageTemplates: {
          docs: {
            sidebarWidth: '18rem',
            grid: 'minmax(16rem, 0.26fr) minmax(0, 1fr)'
          },
          landing: {
            maxWidth: 'full'
          }
        },
        sections: {
          services: {
            alignment: 'start',
            cardVariant: 'feature'
          },
          proof: {
            background: colorMix('secondary', 'transparent 92%'),
            eyebrowColor: color('accent')
          },
          process: {
            background: colorMix('primary', 'transparent 92%'),
            eyebrowColor: color('secondary'),
            cardVariant: 'feature'
          },
          testimonials: {
            background: colorMix('surface', 'transparent 14%')
          },
          faq: {
            background: color('surfaceAlt')
          }
        },
        icons: {
          style: 'duotone',
          size: '1.55rem',
          strokeWidth: '1.7',
          background: `linear-gradient(135deg, ${colorMix('primary', 'transparent 76%')}, ${colorMix('secondary', 'transparent 76%')})`,
          foreground: color('secondary'),
          radius: 'xl'
        },
        animation: {
          durationFast: '100ms',
          durationBase: '190ms',
          durationSlow: '480ms'
        },
        motion: expressiveMotion,
        responsive: roomyResponsive
      }
    )
  }),
  museumCanvas: defineTheme({
    id: 'museumCanvas',
    displayName: 'Museum Canvas',
    description: 'Quiet gallery theme with ivory canvases, serif curation, restrained borders, and exhibition-style pacing.',
    tags: ['museum', 'gallery', 'editorial', 'culture'],
    tokens: brandTokens(
      {
        background: '#fbf8ef',
        surface: '#fffdf6',
        surfaceAlt: '#eee8da',
        text: '#201b16',
        textMuted: '#665d51',
        primary: '#6d4c2f',
        primaryForeground: '#ffffff',
        secondary: '#2f3437',
        secondaryForeground: '#fbf8ef',
        accent: '#9a7a45',
        accentForeground: '#201b16',
        border: '#ded4c2',
        focus: '#6d4c2f',
        link: '#5f4329'
      },
      {
        background: '#11100d',
        surface: '#1b1813',
        surfaceAlt: '#29241b',
        text: '#f7f0e2',
        textMuted: '#cfc4b1',
        primary: '#d4b98a',
        primaryForeground: '#11100d',
        secondary: '#f7f0e2',
        secondaryForeground: '#11100d',
        accent: '#b99a62',
        accentForeground: '#11100d',
        border: '#4a4032',
        link: '#ead2a0'
      },
      {
        typography: {
          display: {
            fontFamily: '"Cormorant Garamond", Georgia, Cambria, "Times New Roman", serif',
            fontSize: 'clamp(3rem, 7vw, 6.25rem)',
            lineHeight: '0.98',
            fontWeight: '600',
            letterSpacing: '-0.045em'
          },
          heading: {
            fontFamily: '"Cormorant Garamond", Georgia, Cambria, "Times New Roman", serif',
            fontSize: 'clamp(1.9rem, 3.8vw, 3.25rem)',
            lineHeight: '1.12',
            fontWeight: '600',
            letterSpacing: '-0.02em'
          },
          body: {
            fontFamily: '"Libre Baskerville", Georgia, Cambria, "Times New Roman", serif',
            fontSize: '1.0625rem',
            lineHeight: '1.86',
            fontWeight: '400'
          },
          caption: {
            ...serifTypography.caption,
            letterSpacing: '0.18em'
          },
          button: {
            ...serifTypography.button,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          },
          mono: baseTypography.mono
        },
        spacing: {
          section: 'clamp(5.5rem, 10vw, 9.5rem)',
          container: 'min(1180px, calc(100vw - 2rem))',
          '4xl': '7rem'
        },
        radius: crispRadius,
        elevation: flatElevation,
        buttons: {
          primary: {
            background: color('text'),
            color: color('textInverse'),
            border: `1px solid ${color('text')}`,
            hoverBackground: color('background'),
            hoverColor: color('text'),
            hoverBorder: `1px solid ${color('text')}`,
            radius: 'none',
            shadow: 'none',
            hoverShadow: 'none',
            transform: 'none'
          },
          secondary: {
            background: 'transparent',
            color: color('text'),
            border: `1px solid ${color('border')}`,
            hoverBackground: color('surfaceAlt'),
            hoverColor: color('text'),
            hoverBorder: `1px solid ${color('primary')}`,
            radius: 'none',
            shadow: 'none',
            hoverShadow: 'none'
          },
          ghost: {
            hoverBackground: color('surfaceAlt'),
            radius: 'none'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: 'none',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            shadow: 'none',
            hoverShadow: 'none',
            mediaRadius: 'none'
          },
          feature: {
            background: color('background'),
            border: `1px solid ${color('border')}`,
            radius: 'none',
            shadow: 'none',
            hoverShadow: 'none',
            mediaRadius: 'none'
          },
          testimonial: {
            background: color('surfaceAlt'),
            border: `1px solid ${color('border')}`,
            radius: 'none',
            shadow: 'none',
            hoverShadow: 'none'
          },
          pricing: {
            background: color('surface'),
            border: `1px solid ${color('primary')}`,
            radius: 'none',
            shadow: 'none',
            hoverShadow: 'none'
          }
        },
        hero: {
          layout: 'editorial',
          background: `linear-gradient(90deg, ${color('background')} 0%, ${color('background')} 58%, ${color('surfaceAlt')} 58%, ${color('surfaceAlt')} 100%)`,
          mediaShape: 'bleed',
          minHeight: 'min(820px, calc(100vh - 5rem))',
          contentWidth: 'min(760px, 100%)',
          gap: 'clamp(3rem, 7vw, 7rem)'
        },
        navigation: {
          layout: 'centered',
          background: color('background'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '5rem',
          blur: false,
          shadow: 'none',
          activeIndicator: 'underline'
        },
        footer: {
          layout: 'columns',
          background: color('surfaceAlt'),
          foreground: color('text'),
          link: color('primary'),
          border: color('border'),
          density: 'spacious',
          divider: true,
          socialIconStyle: 'plain'
        },
        sections: {
          ...editorialSections,
          services: {
            background: color('surface'),
            alignment: 'start',
            cardVariant: 'standard'
          },
          proof: {
            background: color('background'),
            alignment: 'center',
            eyebrowColor: color('accent')
          },
          content: {
            container: 'prose'
          }
        },
        icons: {
          ...minimalIcons,
          foreground: color('primary'),
          strokeWidth: '1.1'
        },
        motion: lowMotion,
        responsive: roomyResponsive
      }
    )
  }),
  ecoImpact: defineTheme({
    id: 'ecoImpact',
    displayName: 'Eco Impact',
    description: 'Vibrant environmental campaign theme with living greens, earth tones, friendly cards, and hopeful motion.',
    tags: ['environment', 'nonprofit', 'campaign', 'sustainability'],
    tokens: brandTokens(
      {
        background: '#f6fbec',
        surface: '#ffffff',
        surfaceAlt: '#e3f4c5',
        text: '#173018',
        textMuted: '#53694d',
        primary: '#15803d',
        primaryForeground: '#ffffff',
        secondary: '#0f766e',
        secondaryForeground: '#ffffff',
        accent: '#f59e0b',
        accentForeground: '#1f2a0d',
        border: '#c9e8a9',
        focus: '#16a34a',
        link: '#166534',
        overlay: 'rgb(23 48 24 / 0.62)'
      },
      {
        background: '#071308',
        surface: '#0f2111',
        surfaceAlt: '#1a341a',
        text: '#f3fde8',
        textMuted: '#c8deb8',
        primary: '#86efac',
        primaryForeground: '#071308',
        secondary: '#5eead4',
        secondaryForeground: '#071308',
        accent: '#fbbf24',
        accentForeground: '#071308',
        border: '#315d32',
        link: '#bbf7d0'
      },
      {
        typography: {
          display: {
            ...friendlyTypography.display,
            fontFamily: '"Nunito", "Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(3rem, 7.2vw, 6.1rem)',
            lineHeight: '0.94'
          },
          heading: {
            ...friendlyTypography.heading,
            fontFamily: '"Nunito", "Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif'
          },
          body: friendlyTypography.body,
          caption: {
            ...friendlyTypography.caption,
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          },
          button: {
            ...friendlyTypography.button,
            fontWeight: '800'
          },
          mono: baseTypography.mono
        },
        spacing: spaciousSpacing,
        radius: softRadius,
        elevation: {
          sm: '0 10px 24px rgb(21 128 61 / 0.1)',
          md: '0 20px 50px rgb(21 128 61 / 0.14)',
          lg: '0 30px 76px rgb(15 118 110 / 0.16)',
          xl: '0 44px 104px rgb(21 128 61 / 0.2)'
        },
        buttons: {
          primary: {
            background: color('primary'),
            hoverBackground: colorMix('primary', 'black 8%'),
            radius: 'pill',
            padding: '1rem 1.55rem',
            shadow: 'sm',
            hoverShadow: 'lg',
            transform: 'translateY(-2px)'
          },
          secondary: {
            background: colorMix('accent', 'transparent 10%'),
            color: color('text'),
            border: `1px solid ${colorMix('accent', 'transparent 38%')}`,
            hoverBackground: colorMix('accent', 'transparent 0%'),
            hoverColor: color('accentForeground'),
            radius: 'pill',
            shadow: 'xs',
            hoverShadow: 'md'
          },
          ghost: {
            hoverBackground: colorMix('primary', 'transparent 88%'),
            radius: 'pill'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: '2xl',
            shadow: 'sm',
            hoverShadow: 'lg',
            mediaRadius: '2xl'
          },
          feature: {
            background: `linear-gradient(145deg, ${colorMix('primary', 'transparent 88%')}, ${colorMix('accent', 'transparent 82%')})`,
            border: `1px solid ${colorMix('primary', 'transparent 54%')}`,
            radius: '2xl',
            shadow: 'md',
            hoverShadow: 'xl',
            mediaRadius: '2xl'
          },
          testimonial: {
            background: color('surfaceAlt'),
            border: `1px solid ${colorMix('secondary', 'transparent 64%')}`,
            radius: '2xl',
            mediaRadius: 'full'
          },
          pricing: {
            background: color('surface'),
            border: `2px solid ${color('primary')}`,
            radius: '2xl',
            shadow: 'lg'
          }
        },
        hero: {
          layout: 'split',
          background: `radial-gradient(circle at 12% 18%, ${colorMix('accent', 'transparent 70%')}, transparent 32%), radial-gradient(circle at 82% 16%, ${colorMix('primary', 'transparent 76%')}, transparent 36%), ${color('background')}`,
          mediaShape: 'circle',
          minHeight: 'min(800px, calc(100vh - 5rem))',
          contentWidth: 'min(720px, 100%)'
        },
        navigation: {
          layout: 'split',
          background: color('surface'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '5rem',
          blur: true,
          shadow: 'xs',
          activeIndicator: 'pill'
        },
        footer: {
          layout: 'rich',
          background: color('primary'),
          foreground: color('primaryForeground'),
          link: color('accent'),
          border: colorMix('primary', 'white 16%'),
          density: 'spacious',
          divider: true,
          socialIconStyle: 'filled'
        },
        sections: {
          ...centeredSections,
          services: {
            alignment: 'center',
            cardVariant: 'feature'
          },
          proof: {
            background: colorMix('secondary', 'transparent 90%'),
            eyebrowColor: color('secondary')
          },
          process: {
            background: color('background'),
            eyebrowColor: color('accent'),
            cardVariant: 'feature'
          },
          testimonials: {
            background: color('surfaceAlt')
          }
        },
        icons: {
          style: 'duotone',
          size: '1.7rem',
          strokeWidth: '1.7',
          background: colorMix('primary', 'transparent 82%'),
          foreground: color('primary'),
          radius: 'full'
        },
        motion: expressiveMotion,
        responsive: roomyResponsive
      }
    )
  }),
  executiveSlate: defineTheme({
    id: 'executiveSlate',
    displayName: 'Executive Slate',
    description: 'High-trust executive theme with slate authority, crisp controls, measured spacing, and restrained motion.',
    tags: ['executive', 'professional', 'consulting', 'b2b'],
    tokens: brandTokens(
      {
        background: '#f5f7fa',
        surface: '#ffffff',
        surfaceAlt: '#e7edf3',
        text: '#111827',
        textMuted: '#4b5563',
        primary: '#1e3a5f',
        primaryForeground: '#ffffff',
        secondary: '#0f172a',
        secondaryForeground: '#ffffff',
        accent: '#64748b',
        accentForeground: '#ffffff',
        border: '#cfd8e3',
        focus: '#1d4ed8',
        link: '#1e3a5f'
      },
      {
        background: '#070b12',
        surface: '#111827',
        surfaceAlt: '#1c2636',
        text: '#f8fafc',
        textMuted: '#c3cedb',
        primary: '#93b5df',
        primaryForeground: '#070b12',
        secondary: '#e2e8f0',
        secondaryForeground: '#070b12',
        accent: '#94a3b8',
        accentForeground: '#070b12',
        border: '#334155',
        link: '#bfdbfe'
      },
      {
        typography: {
          display: {
            ...baseTypography.display,
            fontFamily: '"IBM Plex Sans", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(2.75rem, 6vw, 5.4rem)',
            lineHeight: '0.98',
            letterSpacing: '-0.055em'
          },
          heading: {
            ...baseTypography.heading,
            fontFamily: '"IBM Plex Sans", Inter, ui-sans-serif, system-ui, sans-serif',
            letterSpacing: '-0.035em'
          },
          caption: {
            ...baseTypography.caption,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          },
          button: {
            ...baseTypography.button,
            letterSpacing: '0.04em'
          },
          mono: baseTypography.mono
        },
        spacing: {
          section: 'clamp(4.25rem, 7vw, 7rem)',
          container: 'min(1160px, calc(100vw - 2rem))'
        },
        radius: crispRadius,
        elevation: {
          sm: '0 1px 2px rgb(15 23 42 / 0.08)',
          md: '0 14px 34px rgb(15 23 42 / 0.12)',
          lg: '0 22px 58px rgb(15 23 42 / 0.16)',
          xl: '0 34px 88px rgb(15 23 42 / 0.2)'
        },
        buttons: {
          primary: {
            background: color('primary'),
            hoverBackground: colorMix('primary', 'black 10%'),
            radius: 'sm',
            shadow: 'xs',
            hoverShadow: 'sm',
            transform: 'translateY(-1px)'
          },
          secondary: {
            background: color('surface'),
            color: color('text'),
            border: `1px solid ${color('border')}`,
            hoverBackground: color('surfaceAlt'),
            hoverColor: color('primary'),
            hoverBorder: `1px solid ${color('primary')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'xs'
          },
          ghost: {
            hoverBackground: color('surfaceAlt'),
            radius: 'sm'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: 'md',
            shadow: 'xs',
            hoverShadow: 'sm',
            mediaRadius: 'md'
          },
          feature: {
            background: color('surfaceAlt'),
            border: `1px solid ${color('border')}`,
            radius: 'lg',
            shadow: 'sm',
            hoverShadow: 'md'
          },
          testimonial: {
            background: color('background'),
            border: `1px solid ${color('border')}`,
            radius: 'md'
          },
          pricing: {
            background: color('surface'),
            border: `1px solid ${color('primary')}`,
            radius: 'lg',
            shadow: 'md'
          }
        },
        hero: {
          layout: 'split',
          background: `linear-gradient(135deg, ${color('background')} 0%, ${color('surfaceAlt')} 100%)`,
          mediaShape: 'rounded',
          minHeight: 'min(740px, calc(100vh - 4.75rem))',
          contentWidth: 'min(720px, 100%)'
        },
        navigation: {
          layout: 'split',
          background: color('secondary'),
          foreground: color('secondaryForeground'),
          linkHover: color('primary'),
          border: colorMix('secondary', 'white 14%'),
          height: '4.5rem',
          blur: false,
          shadow: 'sm',
          activeIndicator: 'block'
        },
        footer: {
          layout: 'columns',
          background: color('secondary'),
          foreground: color('secondaryForeground'),
          link: color('primary'),
          border: colorMix('secondary', 'white 14%'),
          density: 'comfortable',
          divider: true,
          socialIconStyle: 'outlined'
        },
        sections: {
          services: {
            background: color('background'),
            cardVariant: 'standard'
          },
          proof: {
            background: color('secondary'),
            foreground: color('secondaryForeground'),
            eyebrowColor: color('primary'),
            alignment: 'center'
          },
          process: {
            background: color('surface'),
            eyebrowColor: color('accent'),
            cardVariant: 'feature'
          },
          testimonials: {
            background: color('surfaceAlt')
          },
          content: {
            container: 'content'
          }
        },
        icons: {
          ...minimalIcons,
          foreground: color('primary'),
          strokeWidth: '1.6'
        },
        responsive: compactResponsive,
        motion: lowMotion
      }
    )
  }),
  culinaryMarket: defineTheme({
    id: 'culinaryMarket',
    displayName: 'Culinary Market',
    description: 'Vibrant food-market theme with warm produce colors, editorial hospitality rhythm, and image-forward sections.',
    tags: ['food', 'market', 'restaurant', 'hospitality'],
    tokens: brandTokens(
      {
        background: '#fff7e8',
        surface: '#fffdf7',
        surfaceAlt: '#ffe0b8',
        text: '#2d1b12',
        textMuted: '#715946',
        primary: '#b91c1c',
        primaryForeground: '#ffffff',
        secondary: '#166534',
        secondaryForeground: '#ffffff',
        accent: '#f59e0b',
        accentForeground: '#2d1b12',
        border: '#f0c48e',
        focus: '#b91c1c',
        link: '#991b1b'
      },
      {
        background: '#170c07',
        surface: '#25150d',
        surfaceAlt: '#3a2112',
        text: '#fff7e8',
        textMuted: '#ebc9a3',
        primary: '#fb7185',
        primaryForeground: '#170c07',
        secondary: '#86efac',
        secondaryForeground: '#170c07',
        accent: '#fbbf24',
        accentForeground: '#170c07',
        border: '#68401f',
        link: '#fda4af'
      },
      {
        typography: {
          display: {
            ...editorialTypography.display,
            fontFamily: '"Fraunces", Georgia, Cambria, "Times New Roman", serif',
            fontSize: 'clamp(3.2rem, 8vw, 6.8rem)',
            lineHeight: '0.9'
          },
          heading: {
            ...editorialTypography.heading,
            fontFamily: '"Fraunces", Georgia, Cambria, "Times New Roman", serif'
          },
          body: {
            ...friendlyTypography.body,
            fontSize: '1.05rem',
            lineHeight: '1.78'
          },
          caption: {
            ...friendlyTypography.caption,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          },
          button: {
            ...friendlyTypography.button,
            letterSpacing: '0.02em'
          },
          mono: baseTypography.mono
        },
        spacing: editorialSpacing,
        radius: {
          ...softRadius,
          xl: '1.85rem',
          '2xl': '2.75rem'
        },
        elevation: {
          sm: '0 8px 18px rgb(185 28 28 / 0.1)',
          md: '0 18px 42px rgb(185 28 28 / 0.14)',
          lg: '0 28px 70px rgb(45 27 18 / 0.18)',
          xl: '0 42px 100px rgb(45 27 18 / 0.24)'
        },
        buttons: {
          primary: {
            background: color('primary'),
            hoverBackground: colorMix('primary', 'black 8%'),
            radius: 'pill',
            shadow: 'sm',
            hoverShadow: 'lg',
            transform: 'translateY(-2px)'
          },
          secondary: {
            background: color('secondary'),
            color: color('secondaryForeground'),
            border: `1px solid ${color('secondary')}`,
            hoverBackground: colorMix('secondary', 'black 8%'),
            hoverColor: color('secondaryForeground'),
            hoverBorder: `1px solid ${colorMix('secondary', 'black 8%')}`,
            radius: 'pill',
            shadow: 'sm',
            hoverShadow: 'md'
          },
          ghost: {
            hoverBackground: colorMix('accent', 'transparent 82%'),
            radius: 'pill'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: 'xl',
            shadow: 'sm',
            hoverShadow: 'lg',
            mediaRadius: 'xl'
          },
          feature: {
            background: `linear-gradient(145deg, ${colorMix('accent', 'transparent 76%')}, ${colorMix('secondary', 'transparent 90%')})`,
            border: `1px solid ${colorMix('accent', 'transparent 42%')}`,
            radius: '2xl',
            shadow: 'md',
            hoverShadow: 'xl',
            mediaRadius: '2xl'
          },
          testimonial: {
            background: color('surfaceAlt'),
            border: `1px solid ${color('border')}`,
            radius: 'xl'
          },
          pricing: {
            background: color('surface'),
            border: `2px solid ${color('primary')}`,
            radius: '2xl',
            shadow: 'lg'
          }
        },
        hero: {
          layout: 'media',
          background: `radial-gradient(circle at 12% 20%, ${colorMix('accent', 'transparent 58%')}, transparent 28%), radial-gradient(circle at 86% 12%, ${colorMix('secondary', 'transparent 78%')}, transparent 34%), ${color('background')}`,
          mediaShape: 'bleed',
          minHeight: 'min(840px, calc(100vh - 5rem))',
          contentWidth: 'min(760px, 100%)'
        },
        navigation: {
          layout: 'centered',
          background: color('surface'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '5rem',
          blur: false,
          shadow: 'xs',
          activeIndicator: 'dot'
        },
        footer: {
          layout: 'rich',
          background: color('secondary'),
          foreground: color('secondaryForeground'),
          link: color('accent'),
          border: colorMix('secondary', 'white 18%'),
          density: 'spacious',
          divider: true,
          socialIconStyle: 'filled'
        },
        sections: {
          ...editorialSections,
          services: {
            background: color('surface'),
            cardVariant: 'feature'
          },
          proof: {
            background: colorMix('accent', 'transparent 78%'),
            eyebrowColor: color('primary')
          },
          process: {
            background: color('background'),
            eyebrowColor: color('secondary'),
            cardVariant: 'feature'
          }
        },
        icons: {
          style: 'filled',
          size: '1.55rem',
          strokeWidth: '1.7',
          background: color('accent'),
          foreground: color('accentForeground'),
          radius: 'full'
        },
        motion: expressiveMotion,
        responsive: roomyResponsive
      }
    )
  }),
  glowMedspa: defineTheme({
    id: 'glowMedspa',
    displayName: 'Glow Medspa',
    description: 'Premium med-spa glow theme with pearl, rose, and lavender tones, soft radius, and an elegant hero.',
    tags: ['medspa', 'beauty', 'wellness', 'premium'],
    tokens: brandTokens(
      {
        background: '#fff9fb',
        surface: '#ffffff',
        surfaceAlt: '#f5eafa',
        text: '#2d2430',
        textMuted: '#756879',
        primary: '#9f5360',
        primaryForeground: '#ffffff',
        secondary: '#6f5a9d',
        secondaryForeground: '#ffffff',
        accent: '#e9c7d4',
        accentForeground: '#2d2430',
        border: '#edd8e7',
        focus: '#9f5360',
        link: '#87424f',
        overlay: 'rgb(45 36 48 / 0.58)'
      },
      {
        background: '#171018',
        surface: '#241925',
        surfaceAlt: '#342438',
        text: '#fff8fb',
        textMuted: '#e3cbd9',
        primary: '#f0a8b7',
        primaryForeground: '#2d1018',
        secondary: '#c4b5fd',
        secondaryForeground: '#171018',
        accent: '#f8d6e2',
        accentForeground: '#171018',
        border: '#5e4056',
        link: '#f0a8b7'
      },
      {
        typography: {
          display: {
            ...serifTypography.display,
            fontFamily: '"Cormorant Garamond", Georgia, Cambria, "Times New Roman", serif',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            lineHeight: '0.98',
            fontWeight: '600'
          },
          heading: {
            ...serifTypography.heading,
            fontFamily: '"Cormorant Garamond", Georgia, Cambria, "Times New Roman", serif',
            fontWeight: '600'
          },
          body: {
            ...baseTypography.body,
            fontFamily: '"Avenir Next", Inter, ui-sans-serif, system-ui, sans-serif',
            lineHeight: '1.78'
          },
          caption: {
            ...serifTypography.caption,
            letterSpacing: '0.16em'
          },
          button: {
            ...baseTypography.button,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          },
          mono: baseTypography.mono
        },
        spacing: spaciousSpacing,
        radius: {
          md: '1.25rem',
          lg: '1.75rem',
          xl: '2.5rem',
          '2xl': '3rem',
          pill: '999px'
        },
        elevation: {
          sm: '0 10px 26px rgb(183 110 121 / 0.1)',
          md: '0 20px 54px rgb(124 106 166 / 0.14)',
          lg: '0 34px 86px rgb(183 110 121 / 0.18)',
          xl: '0 48px 120px rgb(124 106 166 / 0.22)'
        },
        buttons: {
          primary: {
            background: `linear-gradient(135deg, ${color('primary')}, ${color('secondary')})`,
            hoverBackground: `linear-gradient(135deg, ${colorMix('primary', 'white 8%')}, ${colorMix('secondary', 'white 8%')})`,
            radius: 'pill',
            shadow: 'sm',
            hoverShadow: 'lg',
            transform: 'translateY(-2px)'
          },
          secondary: {
            background: colorMix('accent', 'transparent 24%'),
            color: color('text'),
            border: `1px solid ${colorMix('primary', 'transparent 58%')}`,
            hoverBackground: colorMix('accent', 'transparent 6%'),
            hoverColor: color('text'),
            radius: 'pill',
            shadow: 'xs',
            hoverShadow: 'md'
          },
          ghost: {
            hoverBackground: colorMix('primary', 'transparent 90%'),
            radius: 'pill'
          }
        },
        cards: {
          standard: {
            background: colorMix('surface', 'transparent 4%'),
            border: `1px solid ${color('border')}`,
            radius: '2xl',
            shadow: 'sm',
            hoverShadow: 'md',
            mediaRadius: '2xl'
          },
          feature: {
            background: `linear-gradient(145deg, ${colorMix('accent', 'transparent 52%')}, ${colorMix('secondary', 'transparent 92%')})`,
            border: `1px solid ${colorMix('primary', 'transparent 60%')}`,
            radius: '2xl',
            shadow: 'md',
            hoverShadow: 'lg',
            mediaRadius: '2xl'
          },
          testimonial: {
            background: color('background'),
            border: `1px solid ${color('border')}`,
            radius: '2xl',
            mediaRadius: 'full'
          },
          pricing: {
            background: color('surface'),
            border: `1px solid ${color('primary')}`,
            radius: '2xl',
            shadow: 'lg'
          }
        },
        hero: {
          layout: 'editorial',
          background: `radial-gradient(circle at 16% 18%, ${colorMix('accent', 'transparent 54%')}, transparent 30%), radial-gradient(circle at 82% 16%, ${colorMix('secondary', 'transparent 84%')}, transparent 35%), ${color('background')}`,
          mediaShape: 'arch',
          minHeight: 'min(800px, calc(100vh - 5rem))',
          contentWidth: 'min(720px, 100%)',
          gap: 'clamp(2.75rem, 7vw, 7rem)'
        },
        navigation: {
          layout: 'centered',
          background: colorMix('surface', 'transparent 12%'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '5rem',
          blur: true,
          shadow: 'xs',
          activeIndicator: 'dot'
        },
        footer: {
          layout: 'columns',
          background: color('surfaceAlt'),
          foreground: color('text'),
          link: color('primary'),
          border: color('border'),
          density: 'spacious',
          divider: true,
          socialIconStyle: 'soft'
        },
        sections: {
          ...centeredSections,
          services: {
            alignment: 'center',
            cardVariant: 'feature'
          },
          proof: {
            background: colorMix('accent', 'transparent 64%'),
            eyebrowColor: color('primary')
          },
          process: {
            background: color('background'),
            eyebrowColor: color('secondary')
          },
          faq: {
            background: color('surfaceAlt')
          }
        },
        icons: {
          style: 'duotone',
          size: '1.55rem',
          strokeWidth: '1.45',
          background: colorMix('accent', 'transparent 42%'),
          foreground: color('primary'),
          radius: 'full'
        },
        motion: lowMotion,
        responsive: roomyResponsive
      }
    )
  }),
  terminalDocs: defineTheme({
    id: 'terminalDocs',
    displayName: 'Terminal Docs',
    description: 'Dark terminal documentation theme with mono accents, sidebar/block navigation, and command-line card treatments.',
    defaultMode: 'dark',
    supportedModes: ['dark', 'light', 'highContrast'],
    tags: ['developer', 'documentation', 'terminal', 'technical'],
    tokens: brandTokens(
      {
        background: '#f7faf8',
        surface: '#ffffff',
        surfaceAlt: '#e8f0ec',
        text: '#0d1b16',
        textMuted: '#4f625b',
        primary: '#047857',
        primaryForeground: '#ffffff',
        secondary: '#0f172a',
        secondaryForeground: '#ffffff',
        accent: '#0ea5e9',
        accentForeground: '#06131f',
        border: '#c9d8d0',
        focus: '#059669',
        link: '#047857'
      },
      {
        background: '#020807',
        surface: '#071311',
        surfaceAlt: '#0d211d',
        text: '#eafff4',
        textMuted: '#a8cdbd',
        primary: '#34d399',
        primaryForeground: '#020807',
        secondary: '#eafff4',
        secondaryForeground: '#020807',
        accent: '#38bdf8',
        accentForeground: '#020807',
        border: '#1f4a3c',
        focus: '#5eead4',
        link: '#6ee7b7',
        overlay: 'rgb(2 8 7 / 0.88)'
      },
      {
        typography: {
          display: {
            ...technicalTypography.display,
            fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
            fontSize: 'clamp(2.35rem, 5.4vw, 4.8rem)',
            lineHeight: '1',
            fontWeight: '700',
            letterSpacing: '-0.055em'
          },
          heading: {
            ...technicalTypography.heading,
            fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
            fontSize: 'clamp(1.45rem, 2.7vw, 2.5rem)',
            lineHeight: '1.12',
            fontWeight: '700',
            letterSpacing: '-0.035em'
          },
          body: {
            ...technicalTypography.body,
            fontFamily: '"IBM Plex Sans", Inter, ui-sans-serif, system-ui, sans-serif'
          },
          caption: {
            ...technicalTypography.caption,
            letterSpacing: '0.14em',
            textTransform: 'uppercase'
          },
          button: {
            ...technicalTypography.button,
            letterSpacing: '0.08em'
          },
          mono: technicalTypography.mono
        },
        spacing: compactSpacing,
        radius: blockRadius,
        elevation: {
          sm: '0 0 0 1px rgb(52 211 153 / 0.18)',
          md: '0 0 0 1px rgb(52 211 153 / 0.24), 0 18px 44px rgb(0 0 0 / 0.22)',
          lg: '0 0 0 1px rgb(56 189 248 / 0.28), 0 28px 70px rgb(0 0 0 / 0.28)',
          xl: '0 0 0 1px rgb(52 211 153 / 0.34), 0 42px 100px rgb(0 0 0 / 0.34)'
        },
        buttons: {
          primary: {
            background: color('primary'),
            color: color('primaryForeground'),
            border: `1px solid ${color('primary')}`,
            hoverBackground: colorMix('primary', 'white 8%'),
            hoverColor: color('primaryForeground'),
            hoverBorder: `1px solid ${color('accent')}`,
            radius: 'sm',
            shadow: 'sm',
            hoverShadow: 'md',
            transform: 'translateY(-1px)'
          },
          secondary: {
            background: color('surface'),
            color: color('text'),
            border: `1px solid ${color('border')}`,
            hoverBackground: color('surfaceAlt'),
            hoverColor: color('primary'),
            hoverBorder: `1px solid ${color('primary')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'sm'
          },
          ghost: {
            color: color('primary'),
            hoverBackground: colorMix('primary', 'transparent 88%'),
            hoverColor: color('primary'),
            radius: 'sm'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: 'sm',
            shadow: 'none',
            hoverShadow: 'sm',
            mediaRadius: 'sm'
          },
          feature: {
            background: `linear-gradient(145deg, ${colorMix('primary', 'transparent 92%')}, ${color('surfaceAlt')})`,
            border: `1px solid ${colorMix('primary', 'transparent 52%')}`,
            radius: 'md',
            shadow: 'sm',
            hoverShadow: 'md',
            mediaRadius: 'sm'
          },
          testimonial: {
            background: color('background'),
            border: `1px solid ${color('border')}`,
            radius: 'sm'
          },
          pricing: {
            background: color('surface'),
            border: `1px solid ${color('primary')}`,
            radius: 'md',
            shadow: 'md'
          }
        },
        hero: {
          layout: 'docs',
          background: `linear-gradient(${colorMix('primary', 'transparent 91%')} 1px, transparent 1px), linear-gradient(90deg, ${colorMix('primary', 'transparent 91%')} 1px, transparent 1px), ${color('background')}`,
          mediaShape: 'none',
          minHeight: 'auto',
          contentWidth: 'min(900px, 100%)',
          gap: 'clamp(1.5rem, 3vw, 3.5rem)'
        },
        navigation: {
          layout: 'sidebar',
          background: color('surface'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '4rem',
          blur: false,
          shadow: 'none',
          activeIndicator: 'block'
        },
        footer: {
          layout: 'simple',
          background: color('surface'),
          foreground: color('textMuted'),
          link: color('primary'),
          border: color('border'),
          density: 'compact',
          divider: true,
          socialIconStyle: 'plain'
        },
        pageTemplates: {
          docs: {
            maxWidth: 'full',
            sidebarWidth: '18.5rem',
            grid: 'minmax(16rem, 0.26fr) minmax(0, 1fr)'
          },
          article: {
            maxWidth: 'prose'
          }
        },
        forms: {
          background: color('surface'),
          fieldBackground: color('background'),
          radius: 'sm',
          shadow: 'none'
        },
        sections: {
          services: {
            background: color('background'),
            cardVariant: 'standard'
          },
          proof: {
            background: color('surfaceAlt'),
            eyebrowColor: color('accent'),
            alignment: 'start'
          },
          process: {
            background: color('background'),
            eyebrowColor: color('primary'),
            cardVariant: 'feature'
          },
          testimonials: {
            background: color('surface')
          },
          content: {
            container: 'prose'
          }
        },
        icons: {
          style: 'minimal',
          size: '1.35rem',
          strokeWidth: '1.8',
          background: 'transparent',
          foreground: color('primary'),
          radius: 'none'
        },
        motion: lowMotion,
        responsive: compactResponsive
      }
    )
  }),
  estatePrestige: defineTheme({
    id: 'estatePrestige',
    displayName: 'Estate Prestige',
    description: 'Luxury real-estate theme with black, cream, and bronze tones, image-forward editorial layouts, and polished cards.',
    defaultMode: 'dark',
    supportedModes: ['dark', 'light', 'highContrast'],
    tags: ['real-estate', 'luxury', 'property', 'editorial'],
    tokens: brandTokens(
      {
        background: '#f8f3e8',
        surface: '#fffaf0',
        surfaceAlt: '#eadfc9',
        text: '#1b1712',
        textMuted: '#665c4f',
        primary: '#8b6f3d',
        primaryForeground: '#ffffff',
        secondary: '#111111',
        secondaryForeground: '#f8f3e8',
        accent: '#c49a4a',
        accentForeground: '#1b1712',
        border: '#d8c7a8',
        focus: '#8b6f3d',
        link: '#755b2e'
      },
      {
        background: '#050403',
        surface: '#11100d',
        surfaceAlt: '#1f1a13',
        text: '#fbf3e3',
        textMuted: '#cabb9f',
        primary: '#d6aa5d',
        primaryForeground: '#050403',
        secondary: '#fbf3e3',
        secondaryForeground: '#050403',
        accent: '#b9853b',
        accentForeground: '#050403',
        border: '#4d3f2a',
        link: '#f1d18b',
        overlay: 'rgb(0 0 0 / 0.82)'
      },
      {
        typography: {
          display: {
            fontFamily: '"Playfair Display", Didot, Georgia, Cambria, serif',
            fontSize: 'clamp(3.4rem, 8.5vw, 7.2rem)',
            lineHeight: '0.86',
            fontWeight: '700',
            letterSpacing: '-0.06em'
          },
          heading: {
            fontFamily: '"Playfair Display", Didot, Georgia, Cambria, serif',
            fontSize: 'clamp(2rem, 4.2vw, 3.6rem)',
            lineHeight: '0.98',
            fontWeight: '700',
            letterSpacing: '-0.035em'
          },
          body: {
            fontFamily: '"Libre Baskerville", Georgia, Cambria, "Times New Roman", serif',
            fontSize: '1.07rem',
            lineHeight: '1.84',
            fontWeight: '400'
          },
          caption: {
            ...editorialTypography.caption,
            letterSpacing: '0.18em'
          },
          button: {
            ...serifTypography.button,
            letterSpacing: '0.14em',
            textTransform: 'uppercase'
          },
          mono: baseTypography.mono
        },
        spacing: spaciousSpacing,
        radius: crispRadius,
        elevation: {
          sm: '0 10px 32px rgb(0 0 0 / 0.18)',
          md: '0 20px 60px rgb(0 0 0 / 0.28)',
          lg: '0 36px 90px rgb(0 0 0 / 0.38)',
          xl: '0 52px 130px rgb(0 0 0 / 0.46)'
        },
        buttons: luxuryButtons,
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${colorMix('primary', 'transparent 55%')}`,
            radius: 'md',
            shadow: 'sm',
            hoverShadow: 'md',
            mediaRadius: 'md'
          },
          feature: {
            background: color('surfaceAlt'),
            border: `1px solid ${colorMix('primary', 'transparent 44%')}`,
            radius: 'lg',
            shadow: 'md',
            hoverShadow: 'lg',
            mediaRadius: 'lg'
          },
          testimonial: {
            background: color('background'),
            border: `1px solid ${color('border')}`,
            radius: 'md'
          },
          pricing: {
            background: color('surface'),
            border: `1px solid ${color('primary')}`,
            radius: 'lg',
            shadow: 'lg'
          }
        },
        hero: {
          layout: 'media',
          background: `linear-gradient(135deg, ${color('background')} 0%, ${color('surface')} 45%, ${colorMix('primary', 'transparent 86%')} 100%)`,
          mediaShape: 'bleed',
          minHeight: 'min(860px, calc(100vh - 5rem))',
          contentWidth: 'min(760px, 100%)',
          gap: 'clamp(3rem, 7vw, 7rem)'
        },
        navigation: {
          layout: 'centered',
          background: color('background'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '5rem',
          blur: false,
          shadow: 'none',
          activeIndicator: 'dot'
        },
        footer: {
          ...richFooter,
          background: color('surfaceAlt'),
          foreground: color('text'),
          link: color('primary'),
          border: color('border'),
          socialIconStyle: 'plain'
        },
        sections: {
          ...editorialSections,
          services: {
            background: color('surface'),
            cardVariant: 'feature'
          },
          proof: {
            background: color('secondary'),
            foreground: color('secondaryForeground'),
            eyebrowColor: color('primary')
          },
          process: {
            background: color('background'),
            eyebrowColor: color('accent')
          },
          content: {
            container: 'prose'
          }
        },
        icons: {
          ...minimalIcons,
          foreground: color('primary'),
          strokeWidth: '1.2'
        },
        motion: lowMotion,
        responsive: roomyResponsive
      }
    )
  }),
  festivalPoster: defineTheme({
    id: 'festivalPoster',
    displayName: 'Festival Poster',
    description: 'Expressive event-poster theme with saturated gradients, oversized type, playful cards, and high-energy motion.',
    tags: ['events', 'festival', 'poster', 'creative'],
    tokens: brandTokens(
      {
        background: '#fff4d6',
        surface: '#ffffff',
        surfaceAlt: '#ffd7f0',
        text: '#220f3a',
        textMuted: '#684d78',
        primary: '#c026d3',
        primaryForeground: '#ffffff',
        secondary: '#0369a1',
        secondaryForeground: '#ffffff',
        accent: '#facc15',
        accentForeground: '#220f3a',
        border: '#f0abfc',
        focus: '#0ea5e9',
        link: '#a21caf'
      },
      {
        background: '#13051f',
        surface: '#241033',
        surfaceAlt: '#3a1452',
        text: '#fff4d6',
        textMuted: '#f3c8ea',
        primary: '#f472b6',
        primaryForeground: '#13051f',
        secondary: '#67e8f9',
        secondaryForeground: '#05131a',
        accent: '#fde047',
        accentForeground: '#13051f',
        border: '#74328c',
        link: '#f9a8d4'
      },
      {
        typography: {
          display: {
            fontFamily: '"Cooper Black", "Fredoka", "Arial Black", ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(3.4rem, 10vw, 8rem)',
            lineHeight: '0.78',
            fontWeight: '900',
            letterSpacing: '-0.07em',
            textTransform: 'uppercase'
          },
          heading: {
            fontFamily: '"Space Grotesk", "Fredoka", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(2rem, 4.6vw, 3.8rem)',
            lineHeight: '0.92',
            fontWeight: '800',
            letterSpacing: '-0.05em'
          },
          body: {
            ...friendlyTypography.body,
            fontFamily: '"Space Grotesk", Nunito, Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: '1.04rem',
            lineHeight: '1.7'
          },
          caption: {
            ...friendlyTypography.caption,
            letterSpacing: '0.16em',
            textTransform: 'uppercase'
          },
          button: {
            ...friendlyTypography.button,
            fontWeight: '900',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          },
          mono: baseTypography.mono
        },
        spacing: spaciousSpacing,
        radius: {
          sm: '0.75rem',
          md: '1.2rem',
          lg: '1.75rem',
          xl: '2.5rem',
          '2xl': '3.5rem',
          pill: '999px'
        },
        elevation: {
          sm: '0 8px 0 rgb(34 15 58 / 0.16)',
          md: '0 14px 0 rgb(250 204 21 / 0.32), 0 26px 52px rgb(192 38 211 / 0.18)',
          lg: '0 18px 0 rgb(14 165 233 / 0.28), 0 36px 78px rgb(192 38 211 / 0.22)',
          xl: '0 24px 0 rgb(250 204 21 / 0.28), 0 54px 120px rgb(14 165 233 / 0.24)'
        },
        buttons: {
          primary: {
            background: `linear-gradient(100deg, ${color('primary')}, ${color('secondary')})`,
            hoverBackground: `linear-gradient(100deg, ${colorMix('primary', 'white 8%')}, ${colorMix('secondary', 'white 8%')})`,
            border: `2px solid ${color('text')}`,
            hoverBorder: `2px solid ${color('accent')}`,
            radius: 'pill',
            shadow: 'md',
            hoverShadow: 'lg',
            transform: 'translateY(-5px) rotate(-1deg)'
          },
          secondary: {
            background: color('accent'),
            color: color('accentForeground'),
            border: `2px solid ${color('text')}`,
            hoverBackground: colorMix('accent', 'white 8%'),
            hoverColor: color('accentForeground'),
            radius: 'pill',
            shadow: 'sm',
            hoverShadow: 'md',
            transform: 'translateY(-4px) rotate(1deg)'
          },
          ghost: {
            color: color('primary'),
            hoverBackground: colorMix('primary', 'transparent 84%'),
            hoverColor: color('primary'),
            hoverBorder: `2px solid ${color('primary')}`,
            radius: 'pill'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `2px solid ${color('text')}`,
            radius: '2xl',
            shadow: 'md',
            hoverShadow: 'lg',
            mediaRadius: '2xl'
          },
          feature: {
            background: `linear-gradient(135deg, ${colorMix('primary', 'transparent 78%')}, ${colorMix('secondary', 'transparent 80%')})`,
            border: `2px solid ${color('text')}`,
            radius: '2xl',
            shadow: 'lg',
            hoverShadow: 'xl',
            mediaRadius: '2xl'
          },
          testimonial: {
            background: colorMix('accent', 'transparent 18%'),
            border: `2px solid ${color('text')}`,
            radius: '2xl'
          },
          pricing: {
            background: color('surface'),
            border: `3px solid ${color('primary')}`,
            radius: '2xl',
            shadow: 'xl'
          }
        },
        hero: {
          layout: 'centered',
          background: `radial-gradient(circle at 12% 16%, ${colorMix('accent', 'transparent 40%')}, transparent 28%), radial-gradient(circle at 86% 14%, ${colorMix('secondary', 'transparent 62%')}, transparent 32%), radial-gradient(circle at 50% 90%, ${colorMix('primary', 'transparent 70%')}, transparent 38%), ${color('background')}`,
          mediaShape: 'circle',
          minHeight: 'min(840px, calc(100vh - 5rem))',
          contentWidth: 'min(900px, 100%)'
        },
        navigation: {
          layout: 'centered',
          background: color('accent'),
          foreground: color('accentForeground'),
          linkHover: color('primary'),
          border: color('text'),
          height: '5rem',
          blur: false,
          shadow: 'md',
          activeIndicator: 'pill'
        },
        footer: {
          layout: 'centered',
          background: `linear-gradient(135deg, ${color('primary')}, ${color('secondary')})`,
          foreground: color('primaryForeground'),
          link: color('accent'),
          border: color('text'),
          density: 'spacious',
          divider: false,
          socialIconStyle: 'filled'
        },
        sections: {
          ...centeredSections,
          services: {
            alignment: 'center',
            cardVariant: 'feature'
          },
          proof: {
            background: colorMix('accent', 'transparent 40%'),
            eyebrowColor: color('primary')
          },
          process: {
            background: colorMix('secondary', 'transparent 84%'),
            cardVariant: 'feature'
          },
          testimonials: {
            background: colorMix('primary', 'transparent 90%')
          },
          faq: {
            background: color('surfaceAlt')
          }
        },
        icons: {
          style: 'filled',
          size: '1.75rem',
          strokeWidth: '2',
          background: color('primary'),
          foreground: color('primaryForeground'),
          radius: 'full'
        },
        animation: {
          durationFast: '90ms',
          durationBase: '170ms',
          durationSlow: '520ms'
        },
        motion: {
          subtle: {
            duration: '190ms',
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            translateY: '0.45rem',
            scale: '0.99'
          },
          standard: {
            duration: '320ms',
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            translateY: '1rem',
            scale: '0.98'
          },
          expressive: {
            duration: '700ms',
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            translateY: '1.8rem',
            scale: '0.94'
          },
          entrance: {
            duration: '860ms',
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            translateY: '2.2rem',
            scale: '0.92'
          }
        },
        responsive: roomyResponsive
      }
    )
  }),
  artisanPaper: defineTheme({
    id: 'artisanPaper',
    displayName: 'Artisan Paper',
    description: 'Handmade craft-paper theme with warm ink, tactile cards, gentle serif type, and calm handcrafted motion.',
    tags: ['artisan', 'craft', 'paper', 'maker'],
    tokens: brandTokens(
      {
        background: '#f8efd9',
        surface: '#fff8e8',
        surfaceAlt: '#ead8b8',
        text: '#2a2017',
        textMuted: '#6d5c49',
        primary: '#7c4a2d',
        primaryForeground: '#fff8e8',
        secondary: '#2f4f3a',
        secondaryForeground: '#fff8e8',
        accent: '#c47a3a',
        accentForeground: '#2a2017',
        border: '#d8bd8f',
        focus: '#7c4a2d',
        link: '#6b3f27'
      },
      {
        background: '#160f09',
        surface: '#23180f',
        surfaceAlt: '#332516',
        text: '#f8efd9',
        textMuted: '#d7c4a3',
        primary: '#d8a46c',
        primaryForeground: '#160f09',
        secondary: '#a7c4a2',
        secondaryForeground: '#160f09',
        accent: '#e0a35e',
        accentForeground: '#160f09',
        border: '#5e4630',
        link: '#edc38e'
      },
      {
        typography: {
          display: {
            fontFamily: '"Fraunces", Georgia, Cambria, "Times New Roman", serif',
            fontSize: 'clamp(2.9rem, 6.8vw, 6rem)',
            lineHeight: '0.98',
            fontWeight: '700',
            letterSpacing: '-0.045em'
          },
          heading: {
            fontFamily: '"Fraunces", Georgia, Cambria, "Times New Roman", serif',
            fontSize: 'clamp(1.85rem, 3.8vw, 3.2rem)',
            lineHeight: '1.12',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          },
          body: {
            fontFamily: '"Libre Baskerville", Georgia, Cambria, "Times New Roman", serif',
            fontSize: '1.04rem',
            lineHeight: '1.82',
            fontWeight: '400'
          },
          caption: {
            ...serifTypography.caption,
            letterSpacing: '0.12em'
          },
          button: {
            ...serifTypography.button,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          },
          mono: baseTypography.mono
        },
        spacing: editorialSpacing,
        radius: {
          xs: '0.2rem',
          sm: '0.4rem',
          md: '0.8rem',
          lg: '1.15rem',
          xl: '1.7rem',
          '2xl': '2.25rem',
          pill: '999px'
        },
        elevation: {
          sm: '0 4px 0 rgb(124 74 45 / 0.12), 0 10px 24px rgb(42 32 23 / 0.08)',
          md: '0 6px 0 rgb(124 74 45 / 0.14), 0 18px 42px rgb(42 32 23 / 0.12)',
          lg: '0 8px 0 rgb(124 74 45 / 0.16), 0 28px 70px rgb(42 32 23 / 0.16)',
          xl: '0 10px 0 rgb(124 74 45 / 0.18), 0 42px 100px rgb(42 32 23 / 0.2)'
        },
        buttons: {
          primary: {
            background: color('primary'),
            color: color('primaryForeground'),
            border: `1px solid ${colorMix('primary', 'black 8%')}`,
            hoverBackground: colorMix('primary', 'black 8%'),
            hoverColor: color('primaryForeground'),
            radius: 'pill',
            shadow: 'sm',
            hoverShadow: 'md',
            transform: 'translateY(-2px)'
          },
          secondary: {
            background: color('surface'),
            color: color('secondary'),
            border: `1px dashed ${color('secondary')}`,
            hoverBackground: colorMix('secondary', 'transparent 88%'),
            hoverColor: color('secondary'),
            hoverBorder: `1px dashed ${color('secondary')}`,
            radius: 'pill',
            shadow: 'none',
            hoverShadow: 'sm'
          },
          ghost: {
            hoverBackground: colorMix('accent', 'transparent 82%'),
            radius: 'pill'
          }
        },
        cards: {
          standard: {
            background: color('surface'),
            border: `1px solid ${color('border')}`,
            radius: 'xl',
            shadow: 'sm',
            hoverShadow: 'md',
            mediaRadius: 'lg'
          },
          feature: {
            background: `linear-gradient(145deg, ${color('surface')}, ${colorMix('accent', 'transparent 84%')})`,
            border: `1px dashed ${colorMix('primary', 'transparent 28%')}`,
            radius: '2xl',
            shadow: 'md',
            hoverShadow: 'lg',
            mediaRadius: 'xl'
          },
          testimonial: {
            background: color('surfaceAlt'),
            border: `1px solid ${color('border')}`,
            radius: 'xl',
            mediaRadius: 'full'
          },
          pricing: {
            background: color('surface'),
            border: `2px solid ${color('primary')}`,
            radius: '2xl',
            shadow: 'lg'
          }
        },
        hero: {
          layout: 'editorial',
          background: `radial-gradient(circle at 15% 18%, ${colorMix('accent', 'transparent 76%')}, transparent 32%), linear-gradient(135deg, ${color('background')} 0%, ${color('surface')} 100%)`,
          mediaShape: 'rounded',
          minHeight: 'min(780px, calc(100vh - 4.75rem))',
          contentWidth: 'min(740px, 100%)',
          gap: 'clamp(2.5rem, 6vw, 6rem)'
        },
        navigation: {
          layout: 'split',
          background: color('background'),
          foreground: color('text'),
          linkHover: color('primary'),
          border: color('border'),
          height: '4.75rem',
          blur: false,
          shadow: 'none',
          activeIndicator: 'dot'
        },
        footer: {
          layout: 'columns',
          background: color('surfaceAlt'),
          foreground: color('text'),
          link: color('primary'),
          border: color('border'),
          density: 'comfortable',
          divider: true,
          socialIconStyle: 'soft'
        },
        sections: {
          ...editorialSections,
          services: {
            background: color('surface'),
            cardVariant: 'feature'
          },
          proof: {
            background: colorMix('secondary', 'transparent 88%'),
            eyebrowColor: color('secondary')
          },
          process: {
            background: color('background'),
            eyebrowColor: color('accent')
          },
          faq: {
            background: color('surfaceAlt')
          },
          content: {
            container: 'prose'
          }
        },
        icons: {
          style: 'line',
          size: '1.5rem',
          strokeWidth: '1.5',
          background: colorMix('accent', 'transparent 78%'),
          foreground: color('primary'),
          radius: 'lg'
        },
        motion: {
          subtle: {
            duration: '180ms',
            translateY: '0.25rem',
            scale: '1'
          },
          standard: {
            duration: '260ms',
            translateY: '0.45rem',
            scale: '0.995'
          },
          expressive: {
            duration: '440ms',
            translateY: '0.8rem',
            scale: '0.985'
          },
          entrance: {
            duration: '620ms',
            translateY: '1.2rem',
            scale: '0.98'
          }
        },
        responsive: roomyResponsive
      }
    )
  })
} satisfies Record<string, WebsiteTheme<string>>;

export type ThemeName = keyof typeof themes;
