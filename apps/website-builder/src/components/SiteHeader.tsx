import type { UniversalSite } from '../lib/schema';

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

export default function SiteHeader({ site }: { site: UniversalSite }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href={`/${site.slug}/`} aria-label={`${site.business.name} home`}>
          <span aria-hidden="true">{site.business.name.slice(0, 1)}</span>
          <strong>{site.business.name}</strong>
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          {site.navigation.map((item) => (
            <a href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-call" href={phoneHref(site.business.phone)}>
          Call {site.business.phone}
        </a>
      </div>
    </header>
  );
}
