export interface SectionHeaderProps {
  readonly headingId?: string | undefined;
  readonly eyebrow?: string | undefined;
  readonly title: string;
  readonly description?: string | undefined;
}

export function SectionHeader({ headingId, eyebrow, title, description }: SectionHeaderProps) {
  return (
    <>
      {eyebrow ? <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{eyebrow}</p> : null}
      <h2 id={headingId} className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p> : null}
    </>
  );
}
