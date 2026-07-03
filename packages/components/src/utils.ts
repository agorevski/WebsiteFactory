import type { CtaVariant, PostalAddress } from './types';
import type { ThemeMode, WebsiteTheme } from '@website-factory/themes';

export function classNames(...values: readonly (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}

export function ctaClassName(variant: CtaVariant = 'primary'): string {
  const base = 'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  if (variant === 'secondary') {
    return classNames(base, 'border border-slate-300 bg-white text-slate-950 hover:bg-slate-50 focus-visible:outline-slate-600');
  }

  if (variant === 'ghost') {
    return classNames(base, 'border border-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-600');
  }

  if (variant === 'link') {
    return 'inline-flex items-center text-sm font-semibold text-blue-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
  }

  return classNames(base, 'bg-blue-700 text-white shadow-sm hover:bg-blue-800 focus-visible:outline-blue-600');
}

export function externalLinkAttributes(external?: boolean): { readonly target?: '_blank'; readonly rel?: string } {
  return external ? { target: '_blank', rel: 'noreferrer' } : {};
}

export function sectionClassName(className?: string): string {
  return classNames('px-6 py-16 sm:py-24', className);
}

export function containerClassName(className?: string): string {
  return classNames('mx-auto max-w-6xl', className);
}

export function themeDataAttributes(theme?: WebsiteTheme, mode?: ThemeMode): {
  readonly 'data-theme'?: string;
  readonly 'data-theme-mode'?: ThemeMode;
} {
  const attributes: { 'data-theme'?: string; 'data-theme-mode'?: ThemeMode } = {};

  if (theme) {
    attributes['data-theme'] = theme.id;
  }

  if (mode) {
    attributes['data-theme-mode'] = mode;
  }

  return attributes;
}

export function formatAddress(address?: PostalAddress): string {
  if (!address) {
    return '';
  }

  return [address.street, [address.city, address.region, address.postalCode].filter(Boolean).join(', '), address.country]
    .filter(Boolean)
    .join(' ');
}

export function telHref(value: string): string {
  return `tel:${value.replace(/[^+\d]/g, '')}`;
}
