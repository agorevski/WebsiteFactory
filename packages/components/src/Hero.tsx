import type { HeroData, SectionProps } from './types';
import { classNames, containerClassName, ctaClassName, externalLinkAttributes, sectionClassName, themeDataAttributes } from './utils';

export type HeroVariant = 'centered' | 'split' | 'media' | 'compact';
export type HeroProps = SectionProps<HeroData, HeroVariant>;

export function Hero({ id, data, variant = 'split', className, theme, mode }: HeroProps) {
  const headingId = id ? `${id}-title` : undefined;
  const Heading = data.headingLevel ?? 'h1';
  const isCentered = variant === 'centered' || variant === 'compact';

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={sectionClassName(classNames('relative overflow-hidden bg-white text-slate-950', className))}
      {...themeDataAttributes(theme, mode)}
    >
      {data.backgroundImage ? (
        <img
          src={data.backgroundImage.src}
          alt={data.backgroundImage.alt}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
          loading={data.backgroundImage.loading ?? 'lazy'}
        />
      ) : null}
      <div className={containerClassName(classNames('grid items-center gap-12', isCentered ? 'text-center' : 'lg:grid-cols-[1.05fr_0.95fr]'))}>
        <div className={classNames('max-w-3xl', isCentered && 'mx-auto')}>
          {data.eyebrow ? <p className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-700">{data.eyebrow}</p> : null}
          <Heading id={headingId} className="text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            {data.title}
          </Heading>
          {data.subtitle ? <p className="mt-5 text-xl font-semibold text-slate-700">{data.subtitle}</p> : null}
          {data.description ? <p className="mt-5 text-lg leading-8 text-slate-600">{data.description}</p> : null}
          {data.ctas?.length ? (
            <div className={classNames('mt-8 flex flex-wrap gap-3', isCentered && 'justify-center')}>
              {data.ctas.map((cta) => (
                <a key={`${cta.href}-${cta.label}`} href={cta.href} aria-label={cta.ariaLabel} className={ctaClassName(cta.variant)} {...externalLinkAttributes(cta.external)}>
                  {cta.label}
                </a>
              ))}
            </div>
          ) : null}
          {data.trustBadges?.length ? (
            <ul className={classNames('mt-8 flex flex-wrap gap-3 text-sm font-medium text-slate-600', isCentered && 'justify-center')}>
              {data.trustBadges.map((badge) => (
                <li key={badge} className="rounded-full border border-slate-200 px-3 py-1">
                  {badge}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {data.image && variant !== 'compact' ? (
          <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl">
            <img src={data.image.src} alt={data.image.alt} width={data.image.width} height={data.image.height} loading={data.image.loading ?? 'lazy'} className="h-full w-full object-cover" />
          </figure>
        ) : null}
      </div>
    </section>
  );
}
