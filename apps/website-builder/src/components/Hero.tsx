import type { UniversalSite } from '../lib/schema';

type Props = {
  business: UniversalSite['business'];
  hero: UniversalSite['hero'];
  theme: UniversalSite['theme'];
};

export default function Hero({ business, hero, theme }: Props) {
  return (
    <section className="hero section-pad">
      <div className="container hero-grid">
        <div className="hero-copy">
          {hero.eyebrow ? <p className="eyebrow">{hero.eyebrow}</p> : null}
          <h1>{hero.title}</h1>
          <p className="lede">{hero.summary}</p>
          <div className="button-row">
            <a className={`button button-${hero.primaryCta.variant}`} href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </a>
            {hero.secondaryCta ? (
              <a className={`button button-${hero.secondaryCta.variant}`} href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
              </a>
            ) : null}
          </div>
        </div>
        <aside className="hero-card" aria-label={`${business.name} summary`}>
          <span className="theme-pill">{theme.name}</span>
          <h2>{business.name}</h2>
          <p>{business.tagline}</p>
          <dl>
            <div>
              <dt>Vertical</dt>
              <dd>{business.type}</dd>
            </div>
            <div>
              <dt>Serving</dt>
              <dd>{business.areaServed.join(', ')}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{business.phone}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
