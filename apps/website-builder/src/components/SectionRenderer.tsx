import type { UniversalAction, UniversalSection } from '../lib/schema';

type Props = {
  sections: UniversalSection[];
  cta?: {
    title: string;
    summary: string;
    actions: UniversalAction[];
  } | undefined;
};

type AnchorAttributes = {
  rel?: 'noreferrer';
  target?: '_blank';
};

function externalAttributes(href: string): AnchorAttributes {
  return href.startsWith('http') ? { rel: 'noreferrer', target: '_blank' } : {};
}

function Actions({ actions }: { actions: UniversalAction[] }) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="button-row">
      {actions.map((action) => (
        <a className={`button button-${action.variant}`} href={action.href} key={action.label} {...externalAttributes(action.href)}>
          {action.label}
        </a>
      ))}
    </div>
  );
}

function SectionIntro({ section }: { section: UniversalSection }) {
  return (
    <div className="section-intro">
      {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
      <h2>{section.title}</h2>
      {section.summary ? <p>{section.summary}</p> : null}
    </div>
  );
}

function initialsFromTitle(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

function thumbnailLabel(section: UniversalSection, title: string): string {
  if (section.type === 'services') {
    return initialsFromTitle(title);
  }

  if (section.type === 'content') {
    return 'Info';
  }

  return section.type;
}

function CardMedia({ item, section }: { item: UniversalSection['items'][number]; section: UniversalSection }) {
  if (item.image) {
    return (
      <div className="card-media card-media-has-image">
        <img src={item.image.src} alt={item.image.alt} loading="lazy" decoding="async" />
      </div>
    );
  }

  return (
    <div className="card-media" aria-hidden="true">
      <span>{thumbnailLabel(section, item.title)}</span>
    </div>
  );
}

function ContentItems({ section }: { section: UniversalSection }) {
  if (section.items.length === 0) {
    return null;
  }

  const gridClassName = section.type === 'content' ? 'content-grid' : 'card-grid';

  return (
    <div className={gridClassName}>
      {section.items.map((item) => (
        <article className={`card ${section.type === 'services' ? 'service-card' : ''}`} key={item.title}>
          <CardMedia item={item} section={section} />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}

function ProofStats({ section }: { section: UniversalSection }) {
  if (section.stats.length === 0) {
    return null;
  }

  return (
    <dl className="stat-grid" aria-label={`${section.title} details`}>
      {section.stats.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProcessSteps({ section }: { section: UniversalSection }) {
  if (section.steps.length === 0) {
    return null;
  }

  return (
    <ol className="steps">
      {section.steps.map((step, index) => (
        <li key={step.title}>
          <span className="step-count" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Testimonials({ section }: { section: UniversalSection }) {
  if (section.testimonials.length === 0) {
    return null;
  }

  return (
    <div className="quote-grid">
      {section.testimonials.map((testimonial) => (
        <figure className="quote-card" key={testimonial.name}>
          <blockquote>{testimonial.quote}</blockquote>
          <figcaption>
            {testimonial.name}
            {testimonial.context ? <span>{testimonial.context}</span> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function FaqList({ section }: { section: UniversalSection }) {
  if (section.questions.length === 0) {
    return null;
  }

  return (
    <div className="faq-list">
      {section.questions.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export default function SectionRenderer({ sections, cta }: Props) {
  return (
    <>
      {sections.map((section, index) => (
        <section className={`section-pad page-section section-${section.type} ${index % 2 === 1 ? 'section-alt' : ''}`} id={section.id} key={section.id}>
          <div className="container">
            <SectionIntro section={section} />

            <ContentItems section={section} />
            <ProofStats section={section} />
            <ProcessSteps section={section} />
            <Testimonials section={section} />
            <FaqList section={section} />
            <Actions actions={section.actions} />
          </div>
        </section>
      ))}

      {cta ? (
        <section className="section-pad final-cta">
          <div className="container cta-card">
            <div>
              <p className="eyebrow">Next step</p>
              <h2>{cta.title}</h2>
              <p>{cta.summary}</p>
            </div>
            <Actions actions={cta.actions} />
          </div>
        </section>
      ) : null}
    </>
  );
}
