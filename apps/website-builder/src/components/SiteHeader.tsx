import type { UniversalSite } from '../lib/schema';

export default function SiteHeader({ site }: { site: UniversalSite }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href={`/${site.slug}/`} aria-label={`${site.business.name} home`}>
          <span aria-hidden="true">{site.business.name.slice(0, 1)}</span>
          {site.business.name}
        </a>
        <nav aria-label="Primary navigation">
          {site.navigation.map((item) => (
            <a href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
