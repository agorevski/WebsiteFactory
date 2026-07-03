import type { SectionProps, TestimonialsData } from './types';
import { classNames, containerClassName, sectionClassName, themeDataAttributes } from './utils';

export type TestimonialsVariant = 'cards' | 'quote' | 'carousel-ready';
export type TestimonialsProps = SectionProps<TestimonialsData, TestimonialsVariant>;

export function Testimonials({ id, data, variant = 'cards', className, theme, mode }: TestimonialsProps) {
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
        <div className={classNames('mt-10 grid gap-6', variant === 'quote' ? 'lg:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3')}>
          {data.testimonials.map((testimonial) => (
            <figure key={`${testimonial.author}-${testimonial.quote}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              {testimonial.rating ? <p className="text-sm font-bold text-amber-600" aria-label={`${testimonial.rating} out of 5 stars`}>{'★'.repeat(Math.round(testimonial.rating))}</p> : null}
              <blockquote className="mt-4 text-lg leading-8 text-slate-700">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {testimonial.image ? <img src={testimonial.image.src} alt={testimonial.image.alt} width={testimonial.image.width} height={testimonial.image.height} loading={testimonial.image.loading ?? 'lazy'} className="h-12 w-12 rounded-full object-cover" /> : null}
                <span>
                  <span className="block font-bold text-slate-950">{testimonial.author}</span>
                  {testimonial.role ? <span className="block text-sm text-slate-600">{testimonial.role}</span> : null}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
