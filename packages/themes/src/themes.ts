import type { ThemeColorTokens, ThemeTokens, WebsiteTheme } from './types';

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
  }
};

const classicTypography: ThemeTokens['typography'] = {
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
    letterSpacing: '0.04em'
  },
  button: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '0.9rem',
    lineHeight: '1',
    fontWeight: '700',
    letterSpacing: '0.02em'
  }
};

const baseSpacing: ThemeTokens['spacing'] = {
  none: '0',
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  section: 'clamp(4rem, 8vw, 7rem)',
  container: 'min(1120px, calc(100vw - 2rem))'
};

const baseRadius: ThemeTokens['radius'] = {
  none: '0',
  sm: '0.375rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  pill: '999px',
  full: '9999px'
};

const baseElevation: ThemeTokens['elevation'] = {
  none: 'none',
  sm: '0 1px 2px rgb(15 23 42 / 0.08)',
  md: '0 12px 30px rgb(15 23 42 / 0.12)',
  lg: '0 24px 60px rgb(15 23 42 / 0.16)',
  xl: '0 36px 90px rgb(15 23 42 / 0.22)'
};

const baseAnimation: ThemeTokens['animation'] = {
  durationFast: '120ms',
  durationBase: '180ms',
  durationSlow: '320ms',
  easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easingEmphasized: 'cubic-bezier(0.16, 1, 0.3, 1)'
};

function tokens(overrides: Partial<ThemeTokens> = {}): ThemeTokens {
  return {
    modes: overrides.modes ?? {
      light: lightNeutral,
      dark: darkNeutral,
      highContrast
    },
    typography: overrides.typography ?? baseTypography,
    spacing: overrides.spacing ?? baseSpacing,
    radius: overrides.radius ?? baseRadius,
    elevation: overrides.elevation ?? baseElevation,
    buttons: overrides.buttons ?? {
      primary: {
        background: 'primary',
        color: 'primaryForeground',
        border: 'primary',
        hoverBackground: 'secondary',
        hoverColor: 'secondaryForeground',
        radius: 'pill',
        padding: '0.9rem 1.35rem',
        shadow: 'md'
      },
      secondary: {
        background: 'surface',
        color: 'text',
        border: 'border',
        hoverBackground: 'surfaceAlt',
        hoverColor: 'text',
        radius: 'pill',
        padding: '0.9rem 1.35rem',
        shadow: 'sm'
      },
      ghost: {
        background: 'transparent',
        color: 'text',
        border: 'border',
        hoverBackground: 'surfaceAlt',
        hoverColor: 'text',
        radius: 'pill',
        padding: '0.85rem 1.2rem',
        shadow: 'none'
      },
      link: {
        background: 'transparent',
        color: 'link',
        border: 'transparent',
        hoverBackground: 'transparent',
        hoverColor: 'primary',
        radius: 'none',
        padding: '0',
        shadow: 'none'
      }
    },
    animation: overrides.animation ?? baseAnimation,
    navigation: overrides.navigation ?? {
      layout: 'split',
      background: 'background',
      foreground: 'text',
      linkHover: 'primary',
      border: 'border',
      sticky: true,
      height: '4.75rem',
      blur: true
    },
    footer: overrides.footer ?? {
      layout: 'columns',
      background: 'surfaceAlt',
      foreground: 'text',
      link: 'link',
      border: 'border',
      density: 'comfortable'
    }
  };
}

const classicColors: Record<'light' | 'dark' | 'highContrast', ThemeColorTokens> = {
  light: {
    ...lightNeutral,
    background: '#fbf7ef',
    surface: '#fffaf2',
    surfaceAlt: '#efe5d3',
    primary: '#7c2d12',
    secondary: '#1f2937',
    accent: '#b45309',
    border: '#d8c7ac',
    link: '#7c2d12'
  },
  dark: {
    ...darkNeutral,
    background: '#1a120c',
    surface: '#24190f',
    surfaceAlt: '#332418',
    primary: '#fbbf24',
    primaryForeground: '#1a120c',
    accent: '#fdba74',
    border: '#5b4632',
    link: '#fbbf24'
  },
  highContrast
};

const luxuryColors: Record<'light' | 'dark' | 'highContrast', ThemeColorTokens> = {
  light: {
    ...lightNeutral,
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
  dark: {
    ...darkNeutral,
    background: '#090806',
    surface: '#15120d',
    surfaceAlt: '#221d15',
    primary: '#d4af37',
    primaryForeground: '#090806',
    secondary: '#f5f0e6',
    accent: '#f2d98d',
    border: '#4a3f2b',
    link: '#f2d98d'
  },
  highContrast
};

const playfulColors: Record<'light' | 'dark' | 'highContrast', ThemeColorTokens> = {
  light: {
    ...lightNeutral,
    background: '#fff7ed',
    surface: '#ffffff',
    surfaceAlt: '#ffedd5',
    primary: '#f97316',
    secondary: '#7c3aed',
    accent: '#22c55e',
    border: '#fed7aa',
    link: '#c2410c'
  },
  dark: {
    ...darkNeutral,
    background: '#1b1025',
    surface: '#27183a',
    surfaceAlt: '#382150',
    primary: '#fb923c',
    primaryForeground: '#1b1025',
    secondary: '#c4b5fd',
    accent: '#86efac',
    border: '#6d4c8d',
    link: '#fdba74'
  },
  highContrast
};

const clinicShowcaseColors: Record<'light' | 'dark' | 'highContrast', ThemeColorTokens> = {
  light: {
    ...lightNeutral,
    background: '#f2fbfa',
    surface: '#ffffff',
    surfaceAlt: '#e3f4f2',
    text: '#142b3d',
    textMuted: '#526679',
    primary: '#2f7d78',
    secondary: '#17324a',
    accent: '#a9d9d3',
    border: '#c9e3df',
    focus: '#1f8b85',
    link: '#226d68'
  },
  dark: {
    ...darkNeutral,
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
    border: '#2b5b5e',
    link: '#9fe6dd'
  },
  highContrast
};

const tradeProColors: Record<'light' | 'dark' | 'highContrast', ThemeColorTokens> = {
  light: {
    ...lightNeutral,
    background: '#fff7ed',
    surface: '#ffffff',
    surfaceAlt: '#ffedd5',
    text: '#1c1917',
    textMuted: '#57534e',
    primary: '#c2410c',
    secondary: '#111827',
    accent: '#f97316',
    border: '#fed7aa',
    link: '#9a3412'
  },
  dark: {
    ...darkNeutral,
    background: '#160b05',
    surface: '#23140c',
    surfaceAlt: '#372013',
    primary: '#fb923c',
    primaryForeground: '#160b05',
    secondary: '#f8fafc',
    secondaryForeground: '#160b05',
    accent: '#fdba74',
    border: '#6b3b20',
    link: '#fdba74'
  },
  highContrast
};

const hospitalityEditorialColors: Record<'light' | 'dark' | 'highContrast', ThemeColorTokens> = {
  light: {
    ...classicColors.light,
    background: '#fff8ed',
    surface: '#fffdf7',
    surfaceAlt: '#f4e3ca',
    text: '#2b2017',
    textMuted: '#695846',
    primary: '#9a5a16',
    secondary: '#3a2a1c',
    accent: '#d9a441',
    border: '#dfc39b',
    link: '#81470e'
  },
  dark: {
    ...classicColors.dark,
    background: '#140e08',
    surface: '#21170d',
    surfaceAlt: '#332314',
    primary: '#f2b95d',
    primaryForeground: '#140e08',
    secondary: '#fff3d7',
    secondaryForeground: '#140e08',
    accent: '#f6d08a',
    border: '#5d4227',
    link: '#f2b95d'
  },
  highContrast
};

const professionalTrustColors: Record<'light' | 'dark' | 'highContrast', ThemeColorTokens> = {
  light: {
    ...lightNeutral,
    background: '#f6f8ff',
    surface: '#ffffff',
    surfaceAlt: '#e8edff',
    text: '#111827',
    textMuted: '#4b5563',
    primary: '#3730a3',
    secondary: '#172554',
    accent: '#0ea5e9',
    border: '#dbe4ff',
    link: '#312e81'
  },
  dark: {
    ...darkNeutral,
    background: '#070a1c',
    surface: '#111633',
    surfaceAlt: '#1d2550',
    primary: '#a5b4fc',
    primaryForeground: '#070a1c',
    secondary: '#dbeafe',
    secondaryForeground: '#070a1c',
    accent: '#7dd3fc',
    border: '#33407a',
    link: '#bfdbfe'
  },
  highContrast
};

export const themes = {
  modern: {
    id: 'modern',
    displayName: 'Modern',
    description: 'Clean, conversion-focused theme with bold type, soft surfaces, and strong calls to action.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['saas', 'local-service', 'startup'],
    tokens: tokens()
  },
  classic: {
    id: 'classic',
    displayName: 'Classic',
    description: 'Editorial serif typography and warm neutrals for established local businesses.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['professional', 'heritage', 'local-business'],
    tokens: tokens({
      modes: classicColors,
      typography: classicTypography,
      navigation: {
        layout: 'centered',
        background: 'background',
        foreground: 'text',
        linkHover: 'primary',
        border: 'border',
        sticky: false,
        height: '5rem',
        blur: false
      }
    })
  },
  luxury: {
    id: 'luxury',
    displayName: 'Luxury',
    description: 'Premium visual language with restrained gold accents and spacious sections.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['premium', 'hospitality', 'boutique'],
    tokens: tokens({
      modes: luxuryColors,
      spacing: {
        ...baseSpacing,
        section: 'clamp(5rem, 10vw, 9rem)',
        container: 'min(1180px, calc(100vw - 2rem))'
      },
      radius: {
        ...baseRadius,
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      },
      footer: {
        layout: 'rich',
        background: 'secondary',
        foreground: 'secondaryForeground',
        link: 'accent',
        border: 'border',
        density: 'spacious'
      }
    })
  },
  minimal: {
    id: 'minimal',
    displayName: 'Minimal',
    description: 'Quiet monochrome system that prioritizes content, whitespace, and fast loading.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['portfolio', 'one-page', 'content-first'],
    tokens: tokens({
      modes: {
        light: {
          ...lightNeutral,
          surface: '#ffffff',
          surfaceAlt: '#f5f5f4',
          primary: '#111827',
          secondary: '#52525b',
          accent: '#71717a',
          border: '#e7e5e4',
          link: '#111827'
        },
        dark: {
          ...darkNeutral,
          primary: '#f8fafc',
          primaryForeground: '#09090b',
          secondary: '#a1a1aa',
          accent: '#d4d4d8',
          link: '#f8fafc'
        },
        highContrast
      },
      radius: {
        ...baseRadius,
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.375rem',
        xl: '0.5rem'
      },
      elevation: {
        none: 'none',
        sm: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none'
      },
      navigation: {
        layout: 'split',
        background: 'background',
        foreground: 'text',
        linkHover: 'textMuted',
        border: 'border',
        sticky: true,
        height: '4rem',
        blur: false
      },
      footer: {
        layout: 'simple',
        background: 'background',
        foreground: 'textMuted',
        link: 'text',
        border: 'border',
        density: 'compact'
      }
    })
  },
  corporate: {
    id: 'corporate',
    displayName: 'Corporate',
    description: 'Trust-building blue palette, structured spacing, and restrained motion.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['b2b', 'professional-services', 'enterprise'],
    tokens: tokens({
      modes: {
        light: {
          ...lightNeutral,
          primary: '#1e40af',
          secondary: '#334155',
          accent: '#0ea5e9',
          surfaceAlt: '#e2e8f0',
          link: '#1e40af'
        },
        dark: {
          ...darkNeutral,
          primary: '#38bdf8',
          primaryForeground: '#082f49',
          secondary: '#e0f2fe',
          accent: '#818cf8',
          link: '#7dd3fc'
        },
        highContrast
      }
    })
  },
  dark: {
    id: 'dark',
    displayName: 'Dark',
    description: 'Dark-first theme for high-impact launches, creative studios, and nightlife.',
    defaultMode: 'dark',
    supportedModes: ['dark', 'light', 'highContrast'],
    tags: ['creative', 'launch', 'nightlife'],
    tokens: tokens({
      modes: {
        light: {
          ...lightNeutral,
          background: '#f8fafc',
          primary: '#7c3aed',
          secondary: '#111827',
          accent: '#06b6d4',
          link: '#6d28d9'
        },
        dark: {
          ...darkNeutral,
          background: '#030712',
          surface: '#0f172a',
          surfaceAlt: '#1e1b4b',
          primary: '#a78bfa',
          primaryForeground: '#160c2e',
          secondary: '#22d3ee',
          secondaryForeground: '#06202a',
          accent: '#f472b6',
          link: '#c4b5fd'
        },
        highContrast
      },
      navigation: {
        layout: 'split',
        background: 'surface',
        foreground: 'text',
        linkHover: 'primary',
        border: 'border',
        sticky: true,
        height: '4.75rem',
        blur: true
      }
    })
  },
  elegant: {
    id: 'elegant',
    displayName: 'Elegant',
    description: 'Soft rose and slate palette suited for wellness, beauty, and refined service brands.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['wellness', 'beauty', 'service'],
    tokens: tokens({
      modes: {
        light: {
          ...lightNeutral,
          background: '#fff8f6',
          surface: '#ffffff',
          surfaceAlt: '#fdeeea',
          primary: '#be5b50',
          secondary: '#334155',
          accent: '#c08497',
          border: '#f2d3cc',
          link: '#a1463f'
        },
        dark: {
          ...darkNeutral,
          background: '#171111',
          surface: '#211818',
          surfaceAlt: '#332324',
          primary: '#f0a8a0',
          primaryForeground: '#2a1212',
          accent: '#f9c6d0',
          border: '#5f3c3e',
          link: '#f0a8a0'
        },
        highContrast
      },
      typography: classicTypography
    })
  },
  playful: {
    id: 'playful',
    displayName: 'Playful',
    description: 'Energetic theme with friendly color, rounded UI, and upbeat interaction tokens.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['family', 'education', 'food'],
    tokens: tokens({
      modes: playfulColors,
      radius: {
        ...baseRadius,
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      animation: {
        ...baseAnimation,
        durationBase: '220ms',
        durationSlow: '420ms'
      }
    })
  },
  'clinic-showcase': {
    id: 'clinic-showcase',
    displayName: 'Clinic Showcase',
    description: 'Polished healthcare theme with calm teal surfaces, generous spacing, image-led hero cards, and trust-first CTAs.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['clinic', 'medical', 'dental', 'wellness'],
    tokens: tokens({
      modes: clinicShowcaseColors,
      spacing: {
        ...baseSpacing,
        section: 'clamp(4.5rem, 8vw, 7.5rem)',
        container: 'min(1160px, calc(100vw - 2rem))'
      },
      radius: {
        ...baseRadius,
        md: '1rem',
        lg: '1.35rem',
        xl: '2rem'
      },
      elevation: {
        ...baseElevation,
        md: '0 16px 38px rgb(23 50 74 / 0.12)',
        lg: '0 28px 70px rgb(23 50 74 / 0.16)',
        xl: '0 42px 110px rgb(23 50 74 / 0.22)'
      },
      navigation: {
        layout: 'split',
        background: 'surface',
        foreground: 'text',
        linkHover: 'primary',
        border: 'border',
        sticky: true,
        height: '5rem',
        blur: true
      },
      footer: {
        layout: 'rich',
        background: 'secondary',
        foreground: 'secondaryForeground',
        link: 'accent',
        border: 'border',
        density: 'spacious'
      }
    })
  },
  'trade-pro': {
    id: 'trade-pro',
    displayName: 'Trade Pro',
    description: 'High-contrast home-service theme with urgent CTAs, robust card treatments, and bold service-area sections.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['trade', 'home-services', 'plumbing', 'repair'],
    tokens: tokens({
      modes: tradeProColors,
      spacing: {
        ...baseSpacing,
        section: 'clamp(4rem, 7vw, 6.5rem)'
      },
      radius: {
        ...baseRadius,
        md: '0.5rem',
        lg: '0.85rem',
        xl: '1.1rem'
      },
      navigation: {
        layout: 'split',
        background: 'secondary',
        foreground: 'secondaryForeground',
        linkHover: 'accent',
        border: 'border',
        sticky: true,
        height: '4.75rem',
        blur: false
      },
      footer: {
        layout: 'columns',
        background: 'secondary',
        foreground: 'secondaryForeground',
        link: 'accent',
        border: 'border',
        density: 'comfortable'
      }
    })
  },
  'hospitality-editorial': {
    id: 'hospitality-editorial',
    displayName: 'Hospitality Editorial',
    description: 'Warm editorial hospitality theme with serif headlines, layered imagery, and menu-friendly content rhythm.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['hospitality', 'restaurant', 'editorial', 'local-business'],
    tokens: tokens({
      modes: hospitalityEditorialColors,
      typography: classicTypography,
      spacing: {
        ...baseSpacing,
        section: 'clamp(5rem, 9vw, 8rem)',
        container: 'min(1180px, calc(100vw - 2rem))'
      },
      radius: {
        ...baseRadius,
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem'
      },
      footer: {
        layout: 'rich',
        background: 'secondary',
        foreground: 'secondaryForeground',
        link: 'accent',
        border: 'border',
        density: 'spacious'
      }
    })
  },
  'professional-trust': {
    id: 'professional-trust',
    displayName: 'Professional Trust',
    description: 'Structured professional-services theme with crisp hierarchy, deep blue trust colors, and credibility-first sections.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark', 'highContrast'],
    tags: ['professional', 'legal', 'consulting', 'trust'],
    tokens: tokens({
      modes: professionalTrustColors,
      navigation: {
        layout: 'split',
        background: 'surface',
        foreground: 'text',
        linkHover: 'primary',
        border: 'border',
        sticky: true,
        height: '4.75rem',
        blur: true
      },
      footer: {
        layout: 'columns',
        background: 'secondary',
        foreground: 'secondaryForeground',
        link: 'accent',
        border: 'border',
        density: 'comfortable'
      }
    })
  }
} satisfies Record<string, WebsiteTheme<string>>;

export type ThemeName = keyof typeof themes;
