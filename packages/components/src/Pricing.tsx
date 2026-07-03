import type { PricingData, SectionProps } from './types';
import { classNames, containerClassName, ctaClassName, externalLinkAttributes, sectionClassName, themeDataAttributes } from './utils';

export type PricingVariant = 'cards' | 'comparison' | 'simple';
export type PricingProps = SectionProps<PricingData, PricingVariant>;

export function Pricing({ id, data, variant = 'cards', className, theme, mode }: PricingProps) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section id={id} aria-labelledby={headingId} className={sectionClassName(classNames('bg-white text-slate-950', className))} {...themeDataAttributes(theme, mode)}>
      <div className={containerClassName()}>
        <div className="mx-auto max-w-3xl text-center">
          {data.eyebrow ? <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{data.eyebrow}</p> : null}
          <h2 id={headingId} className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          {data.description ? <p className="mt-4 text-lg leading-8 text-slate-600">{data.description}</p> : null}
        </div>
        <div className={classNames('mt-10 grid gap-6', variant === 'simple' ? 'md:grid-cols-2' : 'lg:grid-cols-3')}>
          {data.plans.map((plan) => (
            <article key={plan.name} className={classNames('rounded-3xl border p-6 shadow-sm', plan.highlighted ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-slate-50 text-slate-950')}>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              {plan.description ? <p className={classNames('mt-3 leading-7', plan.highlighted ? 'text-blue-50' : 'text-slate-600')}>{plan.description}</p> : null}
              <p className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-black">{plan.price}</span>
                {plan.period ? <span className={plan.highlighted ? 'text-blue-100' : 'text-slate-500'}>{plan.period}</span> : null}
              </p>
              <ul className={classNames('mt-6 space-y-3 text-sm', plan.highlighted ? 'text-blue-50' : 'text-slate-700')}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden="true">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.cta ? (
                <a href={plan.cta.href} aria-label={plan.cta.ariaLabel} className={classNames('mt-8 w-full', plan.highlighted ? ctaClassName('secondary') : ctaClassName(plan.cta.variant))} {...externalLinkAttributes(plan.cta.external)}>
                  {plan.cta.label}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
