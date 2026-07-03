import type { UniversalSite } from '../lib/schema';

type Props = {
  business: UniversalSite['business'];
  hero: UniversalSite['hero'];
  theme: UniversalSite['theme'];
  variant?: 'landing' | 'page';
};

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

export default function Hero({ business, hero, theme, variant = 'landing' }: Props) {
  const isPageHero = variant === 'page';
  const address = business.address;

  return (
    <section className={`hero section-pad ${isPageHero ? 'hero-page' : ''}`}>
      <div className={`container ${isPageHero ? 'hero-page-grid' : 'hero-grid'}`}>
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
        {isPageHero ? null : (
          <aside className="hero-card" aria-label={`${business.name} summary`}>
            <span className="theme-pill">{theme.name}</span>
            <h2>{business.name}</h2>
            <p>{business.tagline}</p>
            <dl>
              <div>
                <dt>Address</dt>
                <dd>
                  {address.street}
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                </dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>{business.hours.map((item) => `${item.label}: ${item.value}`).join(' | ')}</dd>
              </div>
              <div>
                <dt>Call</dt>
                <dd>
                  <a href={phoneHref(business.phone)}>{business.phone}</a>
                </dd>
              </div>
            </dl>
            {business.credentials.length > 0 ? (
              <ul className="trust-list" aria-label={`${business.name} trust details`}>
                {business.credentials.slice(0, 3).map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
            ) : null}
          </aside>
        )}
      </div>
    </section>
  );
}
