import type { NavigationData, SectionProps } from './types';
import { classNames, ctaClassName, externalLinkAttributes, themeDataAttributes } from './utils';

export type NavigationVariant = 'default' | 'centered' | 'compact';
export type NavigationProps = SectionProps<NavigationData, NavigationVariant>;

export function Navigation({ id, data, variant = 'default', className, theme, mode }: NavigationProps) {
  const brandHref = data.brand.href ?? '/';

  return (
    <header id={id} className={classNames('border-b border-slate-200 bg-white px-6', className)} {...themeDataAttributes(theme, mode)}>
      {data.utilityLinks?.length ? (
        <nav aria-label="Utility navigation" className="mx-auto flex max-w-6xl justify-end gap-4 py-2 text-sm text-slate-600">
          {data.utilityLinks.map((link) => (
            <a key={`${link.href}-${link.label}`} href={link.href} className="hover:text-slate-950" {...externalLinkAttributes(link.external)}>
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
      <nav aria-label="Main navigation" className={classNames('mx-auto flex max-w-6xl items-center gap-6 py-4', variant === 'centered' ? 'justify-center' : 'justify-between')}>
        <a href={brandHref} className="flex items-center gap-3 font-bold text-slate-950">
          {data.brand.logo ? <img src={data.brand.logo.src} alt={data.brand.logo.alt} width={data.brand.logo.width} height={data.brand.logo.height} className="h-10 w-auto" /> : null}
          <span>{data.brand.name}</span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {data.links.map((link) => (
            <a key={`${link.href}-${link.label}`} href={link.href} aria-current={link.current ? 'page' : undefined} className="text-sm font-medium text-slate-700 hover:text-slate-950" {...externalLinkAttributes(link.external)}>
              {link.label}
            </a>
          ))}
        </div>
        {data.cta ? (
          <a href={data.cta.href} aria-label={data.cta.ariaLabel} className={classNames(ctaClassName(data.cta.variant), 'hidden md:inline-flex')} {...externalLinkAttributes(data.cta.external)}>
            {data.cta.label}
          </a>
        ) : null}
      </nav>
    </header>
  );
}
