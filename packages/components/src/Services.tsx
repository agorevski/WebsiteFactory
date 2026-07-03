import type { SectionProps, ServicesData } from './types';
import { classNames, containerClassName, externalLinkAttributes, sectionClassName, themeDataAttributes } from './utils';

export type ServicesVariant = 'cards' | 'list' | 'featured';
export type ServicesProps = SectionProps<ServicesData, ServicesVariant>;

export function Services({ id, data, variant = 'cards', className, theme, mode }: ServicesProps) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section id={id} aria-labelledby={headingId} className={sectionClassName(classNames('bg-white text-slate-950', className))} {...themeDataAttributes(theme, mode)}>
      <div className={containerClassName()}>
        <div className="max-w-3xl">
          {data.eyebrow ? <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{data.eyebrow}</p> : null}
          <h2 id={headingId} className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          {data.description ? <p className="mt-4 text-lg leading-8 text-slate-600">{data.description}</p> : null}
        </div>
        <div className={classNames('mt-10 grid gap-6', variant === 'list' ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3')}>
          {data.services.map((service) => {
            const body = (
              <article className="h-full rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                {service.icon ? <div className="mb-4 text-3xl" aria-hidden="true">{service.icon}</div> : null}
                <h3 className="text-xl font-bold text-slate-950">{service.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{service.description}</p>
                {service.features?.length ? (
                  <ul className="mt-5 space-y-2 text-sm text-slate-700">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span aria-hidden="true">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );

            return service.href ? (
              <a key={service.title} href={service.href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600" {...externalLinkAttributes(service.href.startsWith('http'))}>
                {body}
              </a>
            ) : (
              <div key={service.title}>{body}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
