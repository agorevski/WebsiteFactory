import type { UniversalSection, UniversalSite } from './schema';

export type UniversalPage = UniversalSite['pages'][number];

export function normalizePagePath(path: string): string {
  const collapsedPath = path.trim().replace(/\/+/g, '/');

  if (collapsedPath === '' || collapsedPath === '/') {
    return '/';
  }

  const withLeadingSlash = collapsedPath.startsWith('/') ? collapsedPath : `/${collapsedPath}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function getRootPage(site: UniversalSite): UniversalPage {
  const rootPage = site.pages.find((page) => normalizePagePath(page.path) === '/');

  if (rootPage) {
    return rootPage;
  }

  const [firstPage] = site.pages;

  if (!firstPage) {
    throw new Error(`${site.slug} must define at least one page.`);
  }

  return firstPage;
}

export function getNestedPages(site: UniversalSite): UniversalPage[] {
  return site.pages.filter((page) => normalizePagePath(page.path) !== '/');
}

export function getPageSections(site: UniversalSite, page: UniversalPage): UniversalSection[] {
  if (page.sections.length === 0) {
    return site.sections;
  }

  const sectionsById = new Map(site.sections.map((section) => [section.id, section]));
  const missingSectionIds = page.sections.filter((sectionId) => !sectionsById.has(sectionId));

  if (missingSectionIds.length > 0) {
    throw new Error(`${site.slug}${normalizePagePath(page.path)} references missing section IDs: ${missingSectionIds.join(', ')}`);
  }

  return page.sections.map((sectionId) => sectionsById.get(sectionId)).filter((section): section is UniversalSection => section !== undefined);
}

export function pagePathToRouteParam(path: string): string {
  return normalizePagePath(path).replace(/^\/+|\/+$/g, '');
}

export function pageHref(site: UniversalSite, page: UniversalPage): string {
  const pagePath = normalizePagePath(page.path);
  return pagePath === '/' ? `/${site.slug}/` : `/${site.slug}${pagePath}`;
}

export function formatPageLabel(page: UniversalPage): string {
  const routeParam = pagePathToRouteParam(page.path);

  if (routeParam === '') {
    return 'Home';
  }

  return routeParam
    .split('/')
    .map((segment) => segment.replace(/-/g, ' '))
    .join(' / ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatPageTitle(site: UniversalSite, page: UniversalPage): string {
  return normalizePagePath(page.path) === '/'
    ? site.seo.title
    : `${formatPageLabel(page)} | ${site.business.name}`;
}

export function pageDescription(site: UniversalSite, page: UniversalPage, sections: UniversalSection[]): string {
  return normalizePagePath(page.path) === '/'
    ? site.seo.description
    : sections[0]?.summary ?? site.business.description;
}
