import type { MetadataOptions, PageMetadata, PageSeoInput, SiteSeoInput, TwitterCardType } from "./types.js";
import {
  escapeHtml,
  firstText,
  formatIsoDate,
  normalizeImages,
  normalizeUrl,
  stripHtml,
  truncateText
} from "./utils.js";

const DEFAULT_MAX_TITLE_LENGTH = 60;
const DEFAULT_MAX_DESCRIPTION_LENGTH = 160;

export function generatePageMetadata(
  site: SiteSeoInput,
  page: PageSeoInput = {},
  options: MetadataOptions = {}
): PageMetadata {
  const title = buildTitle(site, page, options);
  const description = buildDescription(site, page, title, options);
  const canonicalUrl = normalizeUrl(page.canonicalUrl ?? page.url ?? page.path ?? "/", site.url);
  const images = normalizeImages(page.images ?? page.image ?? page.product?.image ?? site.defaultImage, site.url);
  const publishedTime = formatIsoDate(page.publishedAt ?? page.article?.publishedAt);
  const modifiedTime = formatIsoDate(page.modifiedAt ?? page.article?.modifiedAt);
  const card: TwitterCardType = images.length > 0 ? "summary_large_image" : "summary";
  const openGraph = {
    title,
    description,
    url: canonicalUrl,
    siteName: site.name,
    type: page.type ?? (page.product ? "product" : publishedTime ? "article" : "website"),
    images,
    tags: page.tags ?? page.article?.tags ?? [],
    ...optional("locale", page.locale ?? site.locale),
    ...optional("publishedTime", publishedTime),
    ...optional("modifiedTime", modifiedTime),
    ...optional("section", page.section ?? page.article?.section)
  };
  const twitter = {
    card,
    title,
    description,
    ...optional("site", site.twitterHandle),
    ...optional("creator", normalizeTwitterHandle(page.author)),
    ...optional("image", images[0])
  };

  return {
    title,
    description,
    canonicalUrl,
    robots: {
      index: page.noIndex !== true,
      follow: page.noFollow !== true
    },
    alternates: normalizeAlternates(page.alternates, site.url),
    openGraph,
    twitter
  };
}

export function renderMetaTags(metadata: PageMetadata): string {
  const lines = [
    `<title>${escapeHtml(metadata.title)}</title>`,
    `<meta name="description" content="${escapeHtml(metadata.description)}">`,
    `<link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}">`,
    `<meta name="robots" content="${metadata.robots.index ? "index" : "noindex"},${metadata.robots.follow ? "follow" : "nofollow"}">`,
    `<meta property="og:title" content="${escapeHtml(metadata.openGraph.title)}">`,
    `<meta property="og:description" content="${escapeHtml(metadata.openGraph.description)}">`,
    `<meta property="og:url" content="${escapeHtml(metadata.openGraph.url)}">`,
    `<meta property="og:site_name" content="${escapeHtml(metadata.openGraph.siteName)}">`,
    `<meta property="og:type" content="${escapeHtml(metadata.openGraph.type)}">`,
    `<meta name="twitter:card" content="${escapeHtml(metadata.twitter.card)}">`,
    `<meta name="twitter:title" content="${escapeHtml(metadata.twitter.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(metadata.twitter.description)}">`
  ];

  if (metadata.openGraph.locale) {
    lines.push(`<meta property="og:locale" content="${escapeHtml(metadata.openGraph.locale)}">`);
  }

  for (const image of metadata.openGraph.images) {
    lines.push(`<meta property="og:image" content="${escapeHtml(image.url)}">`);
    if (image.alt) {
      lines.push(`<meta property="og:image:alt" content="${escapeHtml(image.alt)}">`);
    }
    if (image.width) {
      lines.push(`<meta property="og:image:width" content="${image.width.toString()}">`);
    }
    if (image.height) {
      lines.push(`<meta property="og:image:height" content="${image.height.toString()}">`);
    }
    if (image.type) {
      lines.push(`<meta property="og:image:type" content="${escapeHtml(image.type)}">`);
    }
  }

  if (metadata.openGraph.publishedTime) {
    lines.push(`<meta property="article:published_time" content="${escapeHtml(metadata.openGraph.publishedTime)}">`);
  }

  if (metadata.openGraph.modifiedTime) {
    lines.push(`<meta property="article:modified_time" content="${escapeHtml(metadata.openGraph.modifiedTime)}">`);
  }

  if (metadata.openGraph.section) {
    lines.push(`<meta property="article:section" content="${escapeHtml(metadata.openGraph.section)}">`);
  }

  for (const tag of metadata.openGraph.tags) {
    lines.push(`<meta property="article:tag" content="${escapeHtml(tag)}">`);
  }

  if (metadata.twitter.site) {
    lines.push(`<meta name="twitter:site" content="${escapeHtml(metadata.twitter.site)}">`);
  }

  if (metadata.twitter.creator) {
    lines.push(`<meta name="twitter:creator" content="${escapeHtml(metadata.twitter.creator)}">`);
  }

  if (metadata.twitter.image) {
    lines.push(`<meta name="twitter:image" content="${escapeHtml(metadata.twitter.image.url)}">`);
    if (metadata.twitter.image.alt) {
      lines.push(`<meta name="twitter:image:alt" content="${escapeHtml(metadata.twitter.image.alt)}">`);
    }
  }

  for (const [locale, url] of Object.entries(metadata.alternates).sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(`<link rel="alternate" hreflang="${escapeHtml(locale)}" href="${escapeHtml(url)}">`);
  }

  return lines.join("\n");
}

function buildTitle(site: SiteSeoInput, page: PageSeoInput, options: MetadataOptions): string {
  const rawTitle = firstText(page.title, page.product?.name, site.name) ?? "";
  const separator = options.titleSeparator ?? " | ";
  const templated = options.titleTemplate
    ? options.titleTemplate.replace(/%s/g, rawTitle).replace(/%site/g, site.name)
    : rawTitle === site.name
      ? site.name
      : `${rawTitle}${separator}${site.name}`;

  return truncateText(templated, options.maxTitleLength ?? DEFAULT_MAX_TITLE_LENGTH);
}

function buildDescription(
  site: SiteSeoInput,
  page: PageSeoInput,
  fallbackTitle: string,
  options: MetadataOptions
): string {
  const raw = firstText(
    page.description,
    page.summary,
    page.article?.description,
    page.product?.description,
    site.description,
    options.defaultDescription,
    fallbackTitle
  ) ?? "";
  return truncateText(stripHtml(raw), options.maxDescriptionLength ?? DEFAULT_MAX_DESCRIPTION_LENGTH);
}

function normalizeAlternates(alternates: Record<string, string> | undefined, baseUrl: string): Record<string, string> {
  if (!alternates) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(alternates).map(([locale, url]) => [locale, normalizeUrl(url, baseUrl)])
  );
}

function normalizeTwitterHandle(author: PageSeoInput["author"]): string | undefined {
  if (!author || typeof author === "string") {
    return undefined;
  }

  const handle = author.sameAs?.find((url) => url.includes("twitter.com/") || url.includes("x.com/"));
  if (!handle) {
    return undefined;
  }

  const username = handle.split("/").filter(Boolean).at(-1);
  return username ? `@${username.replace(/^@/, "")}` : undefined;
}

function optional<TKey extends string, TValue>(key: TKey, value: TValue | undefined): Partial<Record<TKey, TValue>> {
  return value === undefined ? {} : { [key]: value } as Record<TKey, TValue>;
}
