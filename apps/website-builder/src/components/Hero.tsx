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

function formatAddress(address: UniversalSite['business']['address']): string {
  return `${address.street}, ${address.city}, ${address.region} ${address.postalCode}`;
}

export default function Hero({ business, hero, theme, variant = 'landing' }: Props) {
  const isPageHero = variant === 'page';
  const address = business.address;
  const primaryHours = business.hours[0];
  const heroImage = hero.image;
  const imageLabel = hero.mediaAlt ?? heroImage?.alt ?? `${business.name} care preview`;

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
          <aside className="hero-showcase" aria-label={`${business.name} website preview`}>
            <div className={`hero-photo-card ${heroImage ? 'hero-photo-card-has-image' : ''}`} role="img" aria-label={imageLabel}>
              {heroImage ? (
                <img className="hero-photo-image" src={heroImage.src} alt="" aria-hidden="true" decoding="async" />
              ) : (
                <div className="hero-photo-art" aria-hidden="true">
                  <span className="smile-arc" />
                  <span className="spark spark-one" />
                  <span className="spark spark-two" />
                </div>
              )}
              <div className="hero-photo-caption">
                <span>Comfort-focused visits</span>
                <strong>{business.areaServed.slice(0, 2).join(' + ')}</strong>
              </div>
            </div>
            <div className="hero-card">
              <span className="theme-pill">{theme.name}</span>
              <h2>{business.name}</h2>
              <p>{business.tagline}</p>
              <dl>
                <div>
                  <dt>Address</dt>
                  <dd>{formatAddress(address)}</dd>
                </div>
                {primaryHours ? (
                  <div>
                    <dt>Hours</dt>
                    <dd>{primaryHours.label}: {primaryHours.value}</dd>
                  </div>
                ) : null}
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
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
