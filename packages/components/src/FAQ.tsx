import type { FAQData, SectionProps } from './types';
import { classNames, containerClassName, sectionClassName, themeDataAttributes } from './utils';
import { SectionHeader } from './SectionHeader';

export type FAQVariant = 'accordion' | 'columns' | 'compact';
export type FAQProps = SectionProps<FAQData, FAQVariant>;

export function FAQ({ id, data, variant = 'accordion', className, theme, mode }: FAQProps) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section id={id} aria-labelledby={headingId} className={sectionClassName(classNames('bg-slate-50 text-slate-950', className))} {...themeDataAttributes(theme, mode)}>
      <div className={containerClassName(variant === 'compact' ? 'max-w-3xl' : undefined)}>
        <div className="max-w-3xl">
          <SectionHeader headingId={headingId} eyebrow={data.eyebrow} title={data.title} description={data.description} />
        </div>
        <div className={classNames('mt-10 grid gap-4', variant === 'columns' && 'lg:grid-cols-2')}>
          {data.items.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-lg font-bold text-slate-950">
                {item.question}
              </summary>
              <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
