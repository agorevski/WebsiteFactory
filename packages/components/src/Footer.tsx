import type { FooterData, SectionProps } from './types';
import { classNames, containerClassName, externalLinkAttributes, formatAddress, telHref, themeDataAttributes } from './utils';

export type FooterVariant = 'columns' | 'simple' | 'rich';
export type FooterProps = SectionProps<FooterData, FooterVariant>;

export function Footer({ id, data, variant = 'columns', className, theme, mode }: FooterProps) {
  const brandHref = data.brand.href ?? '/';
  const addressText = formatAddress(data.address);
  const phoneHref = data.phone?.href ?? (data.phone ? telHref(data.phone.value) : undefined);
  const emailHref = data.email?.href ?? (data.email ? `mailto:${data.email.value}` : undefined);

  return (
    <footer id={id} className={classNames('border-t border-slate-200 bg-slate-950 px-6 py-12 text-slate-100', className)} {...themeDataAttributes(theme, mode)}>
      <div className={containerClassName()}>
        <div className={classNames('grid gap-10', variant === 'simple' ? 'md:grid-cols-1' : 'md:grid-cols-[1.2fr_2fr]')}>
          <div>
            <a href={brandHref} className="flex items-center gap-3 text-lg font-bold text-white">
              {data.brand.logo ? <img src={data.brand.logo.src} alt={data.brand.logo.alt} width={data.brand.logo.width} height={data.brand.logo.height} className="h-10 w-auto" /> : null}
              <span>{data.brand.name}</span>
            </a>
            {data.description ? <p className="mt-4 max-w-md leading-7 text-slate-300">{data.description}</p> : null}
            {addressText || data.phone || data.email ? (
              <address className="mt-5 not-italic text-slate-300">
                {addressText ? <p>{addressText}</p> : null}
                {data.phone && phoneHref ? <p><a href={phoneHref} className="hover:text-white">{data.phone.value}</a></p> : null}
                {data.email && emailHref ? <p><a href={emailHref} className="hover:text-white">{data.email.value}</a></p> : null}
              </address>
            ) : null}
          </div>
          {data.columns?.length ? (
            <nav aria-label="Footer navigation" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.columns.map((column) => (
                <div key={column.title}>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-white">{column.title}</h2>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    {column.links.map((link) => (
                      <li key={`${link.href}-${link.label}`}>
                        <a href={link.href} className="hover:text-white" {...externalLinkAttributes(link.external)}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          ) : null}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>{data.copyright ?? `© ${new Date().getFullYear()} ${data.brand.name}. All rights reserved.`}</p>
          <div className="flex flex-wrap gap-4">
            {data.socialLinks?.map((link) => (
              <a key={`${link.href}-${link.label}`} href={link.href} className="hover:text-white" {...externalLinkAttributes(link.external)}>
                {link.label}
              </a>
            ))}
            {data.legalLinks?.map((link) => (
              <a key={`${link.href}-${link.label}`} href={link.href} className="hover:text-white" {...externalLinkAttributes(link.external)}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
