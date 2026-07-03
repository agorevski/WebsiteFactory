import type {
  RssFeedInfo,
  RssFeedItem,
  RobotsRule,
  RobotsTxtOptions,
  SeoImage,
  SitemapEntry
} from "./types.js";
import { escapeXml, formatIsoDate, normalizeImage, normalizeUrl, withoutTrailingSlash } from "./utils.js";

export function generateSitemap(entries: SitemapEntry[], siteUrl: string): string {
  const urls = entries
    .map((entry) => ({ ...entry, url: normalizeUrl(entry.url, siteUrl) }))
    .sort((left, right) => left.url.localeCompare(right.url));

  const body = urls.map((entry) => {
    const alternates = Object.entries(entry.alternates ?? {})
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([language, href]) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(normalizeUrl(href, siteUrl))}" />`)
      .join("\n");

    const images = (entry.images ?? []).map((image) => renderImageSitemapNode(image, siteUrl, "    ")).join("\n");
    const parts = [
      "  <url>",
      `    <loc>${escapeXml(entry.url)}</loc>`,
      entry.lastModified ? `    <lastmod>${escapeXml(formatIsoDate(entry.lastModified) ?? "")}</lastmod>` : undefined,
      entry.changeFrequency ? `    <changefreq>${entry.changeFrequency}</changefreq>` : undefined,
      typeof entry.priority === "number" ? `    <priority>${clampPriority(entry.priority).toFixed(1)}</priority>` : undefined,
      alternates || undefined,
      images || undefined,
      "  </url>"
    ].filter((part): part is string => Boolean(part));

    return parts.join("\n");
  }).join("\n");

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\">",
    body,
    "</urlset>"
  ].join("\n");
}

export function generateImageSitemap(entries: SitemapEntry[], siteUrl: string): string {
  const body = entries
    .filter((entry) => (entry.images ?? []).length > 0)
    .map((entry) => [
      "  <url>",
      `    <loc>${escapeXml(normalizeUrl(entry.url, siteUrl))}</loc>`,
      ...(entry.images ?? []).map((image) => renderImageSitemapNode(image, siteUrl, "    ")),
      "  </url>"
    ].join("\n"))
    .join("\n");

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\">",
    body,
    "</urlset>"
  ].join("\n");
}

export function generateRobotsTxt(options: RobotsTxtOptions): string {
  const rules = options.rules && options.rules.length > 0
    ? options.rules
    : [{ userAgent: "*", allow: "/" } satisfies RobotsRule];
  const lines: string[] = [];

  for (const rule of rules) {
    const userAgents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent];
    for (const userAgent of userAgents) {
      lines.push(`User-agent: ${userAgent}`);
    }

    for (const allow of toList(rule.allow)) {
      lines.push(`Allow: ${allow}`);
    }

    for (const disallow of toList(rule.disallow)) {
      lines.push(`Disallow: ${disallow}`);
    }

    if (typeof rule.crawlDelay === "number") {
      lines.push(`Crawl-delay: ${rule.crawlDelay.toString()}`);
    }

    lines.push("");
  }

  if (options.host) {
    lines.push(`Host: ${options.host}`);
  }

  const sitemapUrls = options.sitemapUrls && options.sitemapUrls.length > 0
    ? options.sitemapUrls
    : [`${withoutTrailingSlash(options.siteUrl)}/sitemap.xml`];
  for (const sitemapUrl of sitemapUrls) {
    lines.push(`Sitemap: ${normalizeUrl(sitemapUrl, options.siteUrl)}`);
  }

  return `${lines.join("\n").trim()}\n`;
}

export function generateRssFeed(feed: RssFeedInfo, items: RssFeedItem[] = []): string {
  const sortedItems = [...items].sort((left, right) => {
    const leftTime = new Date(left.publishedAt ?? left.updatedAt ?? 0).getTime();
    const rightTime = new Date(right.publishedAt ?? right.updatedAt ?? 0).getTime();
    return rightTime - leftTime;
  });

  const channel = [
    `<title>${escapeXml(feed.title)}</title>`,
    `<link>${escapeXml(feed.siteUrl)}</link>`,
    `<description>${escapeXml(feed.description)}</description>`,
    feed.feedUrl ? `<atom:link href="${escapeXml(feed.feedUrl)}" rel="self" type="application/rss+xml" />` : undefined,
    feed.language ? `<language>${escapeXml(feed.language)}</language>` : undefined,
    feed.copyright ? `<copyright>${escapeXml(feed.copyright)}</copyright>` : undefined,
    feed.managingEditor ? `<managingEditor>${escapeXml(feed.managingEditor)}</managingEditor>` : undefined,
    feed.webMaster ? `<webMaster>${escapeXml(feed.webMaster)}</webMaster>` : undefined,
    ...sortedItems.map((item) => renderRssItem(item, feed.siteUrl))
  ].filter((line): line is string => Boolean(line));

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">",
    "<channel>",
    ...channel.map((line) => `  ${line}`),
    "</channel>",
    "</rss>"
  ].join("\n");
}

export function createEmptyRssFeed(feed: RssFeedInfo): string {
  return generateRssFeed(feed, []);
}

function renderImageSitemapNode(image: SeoImage, siteUrl: string, indent: string): string {
  const normalized = normalizeImage(image, siteUrl);
  const lines = [
    `${indent}<image:image>`,
    `${indent}  <image:loc>${escapeXml(normalized.url)}</image:loc>`,
    normalized.caption ? `${indent}  <image:caption>${escapeXml(normalized.caption)}</image:caption>` : undefined,
    normalized.title ? `${indent}  <image:title>${escapeXml(normalized.title)}</image:title>` : undefined,
    normalized.license ? `${indent}  <image:license>${escapeXml(normalized.license)}</image:license>` : undefined,
    normalized.geoLocation ? `${indent}  <image:geo_location>${escapeXml(normalized.geoLocation)}</image:geo_location>` : undefined,
    `${indent}</image:image>`
  ].filter((line): line is string => Boolean(line));

  return lines.join("\n");
}

function renderRssItem(item: RssFeedItem, siteUrl: string): string {
  const url = normalizeUrl(item.url, siteUrl);
  const lines = [
    "<item>",
    `  <title>${escapeXml(item.title)}</title>`,
    `  <link>${escapeXml(url)}</link>`,
    `  <guid>${escapeXml(item.guid ?? url)}</guid>`,
    item.description ? `  <description>${escapeXml(item.description)}</description>` : undefined,
    item.publishedAt ? `  <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>` : undefined,
    item.updatedAt ? `  <lastBuildDate>${new Date(item.updatedAt).toUTCString()}</lastBuildDate>` : undefined,
    item.author ? `  <author>${escapeXml(item.author)}</author>` : undefined,
    ...(item.categories ?? []).map((category) => `  <category>${escapeXml(category)}</category>`),
    "</item>"
  ].filter((line): line is string => Boolean(line));

  return lines.join("\n");
}

function toList(value: string | string[] | undefined): string[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function clampPriority(priority: number): number {
  return Math.min(1, Math.max(0, priority));
}
