import type { UniversalSite } from '../lib/schema';

export default function SiteFooter({ site }: { site: UniversalSite }) {
  const address = site.business.address;
  const socialLinks = site.business.social.filter((item) => item.href);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h2>{site.business.name}</h2>
          <p>{site.business.description}</p>
          {socialLinks.length > 0 ? (
            <div className="footer-actions">
              {socialLinks.map((item) => (
                <a className={`button button-${item.variant}`} href={item.href} key={item.label}>
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <h3>Explore</h3>
          <ul>
            {site.navigation.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h3>Contact</h3>
          <address>
            {address.street}
            <br />
            {address.city}, {address.region} {address.postalCode}
            <br />
            <a href={`tel:${site.business.phone.replace(/[^+\d]/g, '')}`}>{site.business.phone}</a>
            {site.business.email ? (
              <>
                <br />
                <a href={`mailto:${site.business.email}`}>{site.business.email}</a>
              </>
            ) : null}
          </address>
        </div>
        <div>
          <h3>Hours</h3>
          <dl className="hours-list">
            {site.business.hours.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </footer>
  );
}
