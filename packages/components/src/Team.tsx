import type { SectionProps, TeamData } from './types';
import { classNames, containerClassName, externalLinkAttributes, sectionClassName, themeDataAttributes } from './utils';

export type TeamVariant = 'cards' | 'compact' | 'profiles';
export type TeamProps = SectionProps<TeamData, TeamVariant>;

export function Team({ id, data, variant = 'cards', className, theme, mode }: TeamProps) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section id={id} aria-labelledby={headingId} className={sectionClassName(classNames('bg-slate-50 text-slate-950', className))} {...themeDataAttributes(theme, mode)}>
      <div className={containerClassName()}>
        <div className="max-w-3xl">
          {data.eyebrow ? <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{data.eyebrow}</p> : null}
          <h2 id={headingId} className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          {data.description ? <p className="mt-4 text-lg leading-8 text-slate-600">{data.description}</p> : null}
        </div>
        <div className={classNames('mt-10 grid gap-6', variant === 'compact' ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3')}>
          {data.members.map((member) => (
            <article key={`${member.name}-${member.role}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {member.image ? <img src={member.image.src} alt={member.image.alt} width={member.image.width} height={member.image.height} loading={member.image.loading ?? 'lazy'} className="mb-5 aspect-square w-full rounded-2xl object-cover" /> : null}
              <h3 className="text-xl font-bold text-slate-950">{member.name}</h3>
              <p className="mt-1 text-sm font-semibold text-blue-700">{member.role}</p>
              {member.bio ? <p className="mt-4 leading-7 text-slate-600">{member.bio}</p> : null}
              {member.links?.length ? (
                <ul className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
                  {member.links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <a href={link.href} className="hover:text-slate-950" {...externalLinkAttributes(link.external)}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
