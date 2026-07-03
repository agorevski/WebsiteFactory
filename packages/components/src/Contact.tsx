import type { ContactData, SectionProps } from './types';
import { classNames, containerClassName, formatAddress, sectionClassName, telHref, themeDataAttributes } from './utils';

export type ContactVariant = 'split' | 'centered' | 'card';
export type ContactProps = SectionProps<ContactData, ContactVariant>;

export function Contact({ id, data, variant = 'split', className, theme, mode }: ContactProps) {
  const headingId = id ? `${id}-title` : undefined;
  const addressText = formatAddress(data.address);
  const phoneHref = data.phone?.href ?? (data.phone ? telHref(data.phone.value) : undefined);
  const emailHref = data.email?.href ?? (data.email ? `mailto:${data.email.value}` : undefined);

  return (
    <section id={id} aria-labelledby={headingId} className={sectionClassName(classNames('bg-slate-50 text-slate-950', className))} {...themeDataAttributes(theme, mode)}>
      <div className={containerClassName(classNames('grid gap-10', variant === 'split' && 'lg:grid-cols-[0.9fr_1.1fr]'))}>
        <div>
          {data.eyebrow ? <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{data.eyebrow}</p> : null}
          <h2 id={headingId} className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          {data.description ? <p className="mt-4 text-lg leading-8 text-slate-600">{data.description}</p> : null}
          <dl className="mt-8 space-y-4 text-slate-700">
            {addressText ? (
              <div>
                <dt className="font-semibold text-slate-950">Address</dt>
                <dd>{addressText}</dd>
              </div>
            ) : null}
            {data.phone && phoneHref ? (
              <div>
                <dt className="font-semibold text-slate-950">{data.phone.label}</dt>
                <dd>
                  <a href={phoneHref} className="text-blue-700 hover:underline">
                    {data.phone.value}
                  </a>
                </dd>
              </div>
            ) : null}
            {data.email && emailHref ? (
              <div>
                <dt className="font-semibold text-slate-950">{data.email.label}</dt>
                <dd>
                  <a href={emailHref} className="text-blue-700 hover:underline">
                    {data.email.value}
                  </a>
                </dd>
              </div>
            ) : null}
            {data.methods?.map((method) => (
              <div key={`${method.label}-${method.value}`}>
                <dt className="font-semibold text-slate-950">{method.label}</dt>
                <dd>{method.href ? <a href={method.href} className="text-blue-700 hover:underline">{method.value}</a> : method.value}</dd>
              </div>
            ))}
          </dl>
          {data.hours?.length ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-950">Hours</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {data.hours.map((entry) => (
                  <li key={entry.days} className="flex justify-between gap-4">
                    <span>{entry.days}</span>
                    <span>{entry.note ?? [entry.opens, entry.closes].filter(Boolean).join('–')}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {data.form ? (
            <form action={data.form.action} method={data.form.method ?? 'post'} className="space-y-4">
              {data.form.fields.map((field) => {
                if (field.type === 'textarea') {
                  return (
                    <label key={field.name} className="block text-sm font-semibold text-slate-800">
                      {field.label}
                      <textarea
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-950"
                      />
                    </label>
                  );
                }

                const inputType = field.type === 'phone' ? 'tel' : field.type ?? 'text';

                return (
                  <label key={field.name} className="block text-sm font-semibold text-slate-800">
                    {field.label}
                    <input
                      name={field.name}
                      type={inputType}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-950"
                    />
                  </label>
                );
              })}
              <button type="submit" className="rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
                {data.form.submitLabel}
              </button>
            </form>
          ) : data.mapEmbedUrl ? (
            <iframe src={data.mapEmbedUrl} title={`${data.title} map`} loading="lazy" className="h-80 w-full rounded-2xl border-0" />
          ) : (
            <p className="text-slate-600">Contact details are available above.</p>
          )}
        </div>
      </div>
    </section>
  );
}
