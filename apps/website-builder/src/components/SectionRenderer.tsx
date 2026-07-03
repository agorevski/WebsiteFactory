import type { UniversalAction, UniversalSection } from '../lib/schema';

type Props = {
  sections: UniversalSection[];
  cta?: {
    title: string;
    summary: string;
    actions: UniversalAction[];
  } | undefined;
};

function Actions({ actions }: { actions: UniversalAction[] }) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="button-row">
      {actions.map((action) => (
        <a className={`button button-${action.variant}`} href={action.href} key={action.label}>
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

export default function SectionRenderer({ sections, cta }: Props) {
  return (
    <>
      {sections.map((section) => (
        <section className={`section-pad section-${section.type}`} id={section.id} key={section.id}>
          <div className="container">
            <SectionIntro section={section} />

            {section.items.length > 0 ? (
              <div className="card-grid">
                {section.items.map((item) => (
                  <article className="card" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            ) : null}

            {section.stats.length > 0 ? (
              <dl className="stat-grid">
                {section.stats.map((stat) => (
                  <div className="stat-card" key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {section.steps.length > 0 ? (
              <ol className="steps">
                {section.steps.map((step) => (
                  <li key={step.title}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
            ) : null}

            {section.testimonials.length > 0 ? (
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
            ) : null}

            {section.questions.length > 0 ? (
              <div className="faq-list">
                {section.questions.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            ) : null}

            <Actions actions={section.actions} />
          </div>
        </section>
      ))}

      {cta ? (
        <section className="section-pad final-cta">
          <div className="container cta-card">
            <div>
              <p className="eyebrow">Ready to publish</p>
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
