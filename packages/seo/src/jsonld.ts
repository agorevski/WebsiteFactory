import type {
  ArticleInput,
  BreadcrumbItem,
  BusinessProfile,
  FaqItem,
  JsonLdNode,
  OrganizationProfile,
  PageSeoInput,
  PersonProfile,
  ReviewInput,
  SeoImage,
  SiteSeoInput
} from "./types.js";
import { asArray, cleanJsonLd, formatIsoDate, normalizeImage, normalizeImages, normalizeUrl } from "./utils.js";

const JSON_LD_CONTEXT = "https://schema.org";

export function generateStructuredData(site: SiteSeoInput, page: PageSeoInput = {}): JsonLdNode[] {
  const canonicalUrl = normalizeUrl(page.canonicalUrl ?? page.url ?? page.path ?? "/", site.url);
  const nodes: JsonLdNode[] = [];

  if (site.organization) {
    nodes.push(buildOrganizationJsonLd(site, site.organization));
  }

  if (site.business) {
    nodes.push(buildBusinessJsonLd(site, site.business));
  }

  if (page.author && typeof page.author !== "string") {
    nodes.push(buildPersonJsonLd(page.author, site.url));
  }

  const article = page.article ?? inferArticle(page);
  if (article) {
    nodes.push(buildArticleJsonLd(site, page, article, canonicalUrl));
  }

  if (page.faq && page.faq.length > 0) {
    nodes.push(buildFaqJsonLd(page.faq));
  }

  if (page.reviews && page.reviews.length > 0) {
    nodes.push(...page.reviews.map((review) => buildReviewJsonLd(site, page, review, canonicalUrl)));
  }

  if (page.breadcrumbs && page.breadcrumbs.length > 0) {
    nodes.push(buildBreadcrumbJsonLd(page.breadcrumbs, site.url));
  }

  return nodes;
}

export function renderJsonLdScript(nodes: JsonLdNode | JsonLdNode[]): string {
  const graph = Array.isArray(nodes) ? nodes : [nodes];
  const payload = graph.length === 1
    ? graph[0]
    : {
      "@context": JSON_LD_CONTEXT,
      "@graph": graph
    };

  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

export function buildOrganizationJsonLd(site: SiteSeoInput, organization: OrganizationProfile = {}): JsonLdNode {
  return cleanJsonLd({
    "@context": JSON_LD_CONTEXT,
    "@type": "Organization",
    "@id": `${normalizeUrl(organization.url ?? site.url, site.url)}#organization`,
    name: organization.name ?? site.name,
    legalName: organization.legalName,
    url: normalizeUrl(organization.url ?? site.url, site.url),
    logo: normalizeLogo(organization.logo, site.url),
    sameAs: organization.sameAs,
    telephone: organization.telephone,
    email: organization.email,
    address: organization.address,
    contactPoint: organization.contactPoint
  });
}

export function buildBusinessJsonLd(site: SiteSeoInput, business: BusinessProfile): JsonLdNode {
  const type = resolveBusinessType(business);
  const businessUrl = normalizeUrl(business.url ?? site.url, site.url);

  return cleanJsonLd({
    "@context": JSON_LD_CONTEXT,
    "@type": type,
    "@id": `${businessUrl}#business`,
    name: business.name ?? site.name,
    description: business.description ?? site.description,
    url: businessUrl,
    image: normalizeImages(business.image, site.url).map((image) => image.url),
    logo: normalizeLogo(business.logo, site.url),
    telephone: business.telephone,
    email: business.email,
    address: business.address,
    geo: business.geo,
    priceRange: business.priceRange,
    openingHours: business.openingHours,
    openingHoursSpecification: business.openingHoursSpecification,
    servesCuisine: business.cuisine,
    menu: business.menuUrl ? normalizeUrl(business.menuUrl, site.url) : undefined,
    acceptsReservations: business.acceptsReservations,
    medicalSpecialty: business.medicalSpecialty,
    sameAs: business.sameAs
  });
}

export function buildPersonJsonLd(person: PersonProfile, baseUrl: string): JsonLdNode {
  return cleanJsonLd({
    "@context": JSON_LD_CONTEXT,
    "@type": "Person",
    name: person.name,
    url: person.url ? normalizeUrl(person.url, baseUrl) : undefined,
    image: normalizeImageValue(person.image, baseUrl),
    jobTitle: person.jobTitle,
    sameAs: person.sameAs
  });
}

export function buildArticleJsonLd(
  site: SiteSeoInput,
  page: PageSeoInput,
  article: ArticleInput,
  canonicalUrl: string
): JsonLdNode {
  const headline = article.headline ?? page.title ?? site.name;
  const images = normalizeImages(article.image ?? page.images ?? page.image ?? site.defaultImage, site.url).map((image) => image.url);

  return cleanJsonLd({
    "@context": JSON_LD_CONTEXT,
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    mainEntityOfPage: canonicalUrl,
    headline,
    description: article.description ?? page.description ?? page.summary ?? site.description,
    image: images,
    author: normalizeAuthor(article.author ?? page.author, site.url),
    publisher: article.publisher
      ? buildOrganizationJsonLd(site, article.publisher)
      : site.organization
        ? buildOrganizationJsonLd(site, site.organization)
        : undefined,
    datePublished: formatIsoDate(article.publishedAt ?? page.publishedAt),
    dateModified: formatIsoDate(article.modifiedAt ?? page.modifiedAt),
    articleSection: article.section ?? page.section,
    keywords: article.tags ?? page.tags,
    wordCount: article.wordCount
  });
}

export function buildFaqJsonLd(items: FaqItem[]): JsonLdNode {
  return cleanJsonLd({
    "@context": JSON_LD_CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  });
}

export function buildReviewJsonLd(
  site: SiteSeoInput,
  page: PageSeoInput,
  review: ReviewInput,
  canonicalUrl: string
): JsonLdNode {
  return cleanJsonLd({
    "@context": JSON_LD_CONTEXT,
    "@type": "Review",
    itemReviewed: {
      "@type": page.type === "article" ? "Article" : "Thing",
      name: review.itemReviewedName ?? page.title ?? site.name,
      url: canonicalUrl
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.ratingValue,
      bestRating: review.bestRating ?? 5,
      worstRating: review.worstRating ?? 1
    },
    author: normalizeAuthor(review.author, site.url),
    reviewBody: review.reviewBody,
    datePublished: formatIsoDate(review.datePublished)
  });
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], baseUrl: string): JsonLdNode {
  return cleanJsonLd({
    "@context": JSON_LD_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: normalizeUrl(item.url, baseUrl)
    }))
  });
}

function resolveBusinessType(business: BusinessProfile): string {
  const type = business.type ?? "LocalBusiness";
  const normalized = type.toLowerCase();

  if (normalized.includes("restaurant") || business.cuisine || business.menuUrl) {
    return "Restaurant";
  }

  if (normalized === "medical" || normalized.includes("medical") || business.medicalSpecialty) {
    return normalized.includes("clinic") ? "MedicalClinic" : "MedicalBusiness";
  }

  return type;
}

function normalizeLogo(logo: string | SeoImage | undefined, baseUrl: string): string | undefined {
  if (!logo) {
    return undefined;
  }

  return normalizeImage(logo, baseUrl).url;
}

function normalizeImageValue(image: string | SeoImage | undefined, baseUrl: string): string | undefined {
  if (!image) {
    return undefined;
  }

  return normalizeImage(image, baseUrl).url;
}

function normalizeAuthor(author: string | PersonProfile | undefined, baseUrl: string): JsonLdNode | undefined {
  if (!author) {
    return undefined;
  }

  if (typeof author === "string") {
    return cleanJsonLd({
      "@type": "Person",
      name: author
    });
  }

  return buildPersonJsonLd(author, baseUrl);
}

function inferArticle(page: PageSeoInput): ArticleInput | undefined {
  if (!page.publishedAt && !page.modifiedAt && page.type !== "article") {
    return undefined;
  }

  const article: ArticleInput = {};
  if (page.title) {
    article.headline = page.title;
  }
  const description = page.description ?? page.summary;
  if (description) {
    article.description = description;
  }
  if (page.author) {
    article.author = page.author;
  }
  if (page.publishedAt) {
    article.publishedAt = page.publishedAt;
  }
  if (page.modifiedAt) {
    article.modifiedAt = page.modifiedAt;
  }
  if (page.section) {
    article.section = page.section;
  }
  if (page.tags) {
    article.tags = page.tags;
  }
  if (page.images ?? page.image) {
    article.image = asArray(page.images ?? page.image);
  }

  return article;
}
