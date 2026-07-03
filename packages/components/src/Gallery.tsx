import type { GalleryData, SectionProps } from './types';
import { classNames, containerClassName, externalLinkAttributes, sectionClassName, themeDataAttributes } from './utils';

export type GalleryVariant = 'grid' | 'masonry' | 'featured';
export type GalleryProps = SectionProps<GalleryData, GalleryVariant>;

export function Gallery({ id, data, variant = 'grid', className, theme, mode }: GalleryProps) {
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
        <div className={classNames('mt-10 grid gap-4', variant === 'featured' ? 'md:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3')}>
          {data.items.map((item) => {
            const figure = (
              <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                <img src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} loading={item.image.loading ?? 'lazy'} className="aspect-[4/3] w-full object-cover" />
                {item.caption ? <figcaption className="p-4 text-sm text-slate-600">{item.caption}</figcaption> : null}
              </figure>
            );

            return item.href ? (
              <a key={`${item.image.src}-${item.caption ?? ''}`} href={item.href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600" {...externalLinkAttributes(item.href.startsWith('http'))}>
                {figure}
              </a>
            ) : (
              <div key={`${item.image.src}-${item.caption ?? ''}`}>{figure}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
