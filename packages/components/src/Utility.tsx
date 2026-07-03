import type { BreadcrumbsData, EmergencyBannerData, HoursData, SectionProps, TrustBadgesData } from './types';
import { classNames, ctaClassName, externalLinkAttributes, themeDataAttributes } from './utils';

export type BreadcrumbsProps = SectionProps<BreadcrumbsData, 'default' | 'compact'>;
export type TrustBadgesProps = SectionProps<TrustBadgesData, 'default' | 'inline'>;
export type HoursProps = SectionProps<HoursData, 'default' | 'compact'>;
export type EmergencyBannerProps = SectionProps<EmergencyBannerData, 'default' | 'sticky'>;

export function Breadcrumbs({ id, data, className, theme, mode }: BreadcrumbsProps) {
  return (
    <nav id={id} aria-label="Breadcrumb" className={classNames('px-6 py-3 text-sm text-slate-600', className)} {...themeDataAttributes(theme, mode)}>
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
        {data.items.map((item, index) => (
          <li key={`${item.href}-${item.label}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.current ? (
              <span aria-current="page" className="font-semibold text-slate-950">{item.label}</span>
            ) : (
              <a href={item.href} className="hover:text-slate-950" {...externalLinkAttributes(item.external)}>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function TrustBadges({ id, data, variant = 'default', className, theme, mode }: TrustBadgesProps) {
  return (
    <section id={id} aria-label="Trust badges" className={classNames('px-6 py-8', className)} {...themeDataAttributes(theme, mode)}>
      <ul className={classNames('mx-auto flex max-w-6xl flex-wrap items-center gap-3 text-sm font-semibold text-slate-700', variant === 'inline' && 'justify-center')}>
        {data.badges.map((badge) => (
          <li key={badge} className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            {badge}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Hours({ id, data, variant = 'default', className, theme, mode }: HoursProps) {
  return (
    <section id={id} className={classNames('px-6 py-8', className)} {...themeDataAttributes(theme, mode)}>
      <div className={classNames('mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm', variant === 'compact' ? 'max-w-xl' : 'max-w-3xl')}>
        {data.title ? <h2 className="text-xl font-bold text-slate-950">{data.title}</h2> : null}
        <table className="mt-4 w-full text-left text-sm text-slate-700">
          <tbody>
            {data.entries.map((entry) => (
              <tr key={entry.days} className="border-t border-slate-100 first:border-0">
                <th scope="row" className="py-3 pr-4 font-semibold text-slate-950">{entry.days}</th>
                <td className="py-3 text-right">{entry.note ?? [entry.opens, entry.closes].filter(Boolean).join('–')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function EmergencyBanner({ id, data, variant = 'default', className, theme, mode }: EmergencyBannerProps) {
  const toneClass = data.tone === 'urgent'
    ? 'bg-red-700 text-white'
    : data.tone === 'warning'
      ? 'bg-amber-400 text-slate-950'
      : 'bg-blue-700 text-white';

  return (
    <aside id={id} role={data.tone === 'urgent' ? 'alert' : 'status'} className={classNames('px-6 py-3', toneClass, variant === 'sticky' && 'sticky top-0 z-50', className)} {...themeDataAttributes(theme, mode)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm font-semibold md:flex-row md:items-center md:justify-between">
        <p>{data.message}</p>
        {data.cta ? (
          <a href={data.cta.href} aria-label={data.cta.ariaLabel} className={ctaClassName(data.cta.variant ?? 'secondary')} {...externalLinkAttributes(data.cta.external)}>
            {data.cta.label}
          </a>
        ) : null}
      </div>
    </aside>
  );
}
