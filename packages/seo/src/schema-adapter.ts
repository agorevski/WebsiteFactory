import type {
  BusinessProfile,
  FaqItem,
  PageSeoInput,
  ProductInput,
  ProductOfferInput,
  ReviewInput,
  SchemaSeoAdapter,
  SeoImage,
  SiteSeoInput
} from "./types.js";
import { normalizePath } from "./utils.js";

export interface SchemaSeoSource {
  site?: Record<string, unknown>;
  business?: Record<string, unknown>;
  brand?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  seo?: Record<string, unknown>;
  organization?: Record<string, unknown>;
  pages?: Array<Record<string, unknown>>;
  faq?: Array<Record<string, unknown>>;
  reviews?: Array<Record<string, unknown>>;
  testimonials?: Array<Record<string, unknown>>;
  blog?: Array<Record<string, unknown>>;
  news?: Array<Record<string, unknown>>;
  events?: Array<Record<string, unknown>>;
  socialLinks?: Array<Record<string, unknown>>;
  locations?: Array<Record<string, unknown>>;
  specialties?: string[];
}

export interface NormalizedSchemaSeo {
  site: SiteSeoInput;
  pages: PageSeoInput[];
}

export const mapSchemaToSeo: SchemaSeoAdapter<SchemaSeoSource, NormalizedSchemaSeo> = (schema) => {
  const siteSource = schema.site ?? {};
  const business = readRecord(schema.business);
  const brand = readRecord(schema.brand);
  const contact = readRecord(schema.contact);
  const seo = readRecord(schema.seo);
  const openGraph = readRecord(seo?.openGraph);
  const organization = readOrganization(schema, business, brand, contact);
  const businessProfile = readBusinessProfile(schema, business, brand, contact);
  const description =
    readString(siteSource, "description") ??
    readString(seo, "description") ??
    readString(business, "description") ??
    readString(business, "tagline");
  const locale = readString(siteSource, "locale");
  const defaultImage =
    readImage(siteSource, "image") ??
    readImage(siteSource, "defaultImage") ??
    readImage(openGraph, "image") ??
    readImage(brand, "logo") ??
    readImage(brand, "icon");
  const twitterHandle = readString(siteSource, "twitterHandle") ?? readTwitterHandle(schema.socialLinks);
  const site: SiteSeoInput = {
    name: readString(siteSource, "name") ?? readString(siteSource, "title") ?? readString(business, "name") ?? readString(seo, "title") ?? "Website",
    url: readString(siteSource, "url") ?? readString(siteSource, "baseUrl") ?? readString(contact, "website") ?? readString(seo, "canonicalUrl") ?? "https://example.com",
    ...optional("description", description),
    ...optional("locale", locale),
    ...optional("defaultImage", defaultImage),
    ...optional("twitterHandle", twitterHandle),
    ...optional("organization", organization),
    ...optional("business", businessProfile)
  };

  const explicitPages = schema.pages?.map(mapSchemaPageToSeo);
  const pages = explicitPages && explicitPages.length > 0
    ? explicitPages
    : [mapHomePageToSeo(schema, site)];
  pages.push(
    ...mapArticleCollection(schema.blog, "blog"),
    ...mapArticleCollection(schema.news, "news"),
    ...mapArticleCollection(schema.events, "events")
  );

  return {
    site,
    pages
  };
};

export function mapSchemaPageToSeo(page: Record<string, unknown>): PageSeoInput {
  const seo = readRecord(page.seo);
  const title = readString(page, "title") ?? readString(page, "name");
  const description = readString(page, "description") ?? readString(seo, "description");
  const summary = readString(page, "summary");
  const canonicalUrl = readString(page, "canonicalUrl") ?? readString(page, "canonical") ?? readString(seo, "canonicalUrl");
  const image = readImage(page, "image");
  const noIndex = readBoolean(page, "noIndex") ?? readBoolean(seo, "noIndex");
  const noFollow = readBoolean(page, "noFollow") ?? readBoolean(seo, "noFollow");
  const type = readString(page, "type");
  const tags = readStringArray(page, "tags");
  const section = readString(page, "section");
  const publishedAt = readString(page, "publishedAt") ?? readString(page, "datePublished");
  const modifiedAt = readString(page, "modifiedAt") ?? readString(page, "dateModified");
  const faq = readFaqItems(readRecordArray(page.faq));
  const reviews = readReviews(readRecordArray(page.reviews));
  const product = readProduct(readRecord(page.product));

  return {
    path: normalizePath(readString(page, "path") ?? readString(page, "slug")),
    ...optional("title", title),
    ...optional("description", description),
    ...optional("summary", summary),
    ...optional("canonicalUrl", canonicalUrl),
    ...optional("image", image),
    ...optional("noIndex", noIndex),
    ...optional("noFollow", noFollow),
    ...optional("type", type),
    ...optional("tags", tags),
    ...optional("section", section),
    ...optional("publishedAt", publishedAt),
    ...optional("modifiedAt", modifiedAt),
    ...optional("faq", faq),
    ...optional("reviews", reviews),
    ...optional("product", product)
  };
}

function readString(source: Record<string, unknown> | undefined, key: string): string | undefined {
  if (!source) {
    return undefined;
  }

  const value = source[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function readRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function readRecordArray(value: unknown): Array<Record<string, unknown>> | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const records = value.map(readRecord).filter((item): item is Record<string, unknown> => item !== undefined);
  return records.length > 0 ? records : undefined;
}

function readBoolean(source: Record<string, unknown> | undefined, key: string): boolean | undefined {
  if (!source) {
    return undefined;
  }

  const value = source[key];
  return typeof value === "boolean" ? value : undefined;
}

function readStringArray(source: Record<string, unknown> | undefined, key: string): string[] | undefined {
  if (!source) {
    return undefined;
  }

  const value = source[key];
  if (!Array.isArray(value)) {
    return undefined;
  }

  const strings = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return strings.length > 0 ? strings : undefined;
}

function optional<TKey extends string, TValue>(key: TKey, value: TValue | undefined): Partial<Record<TKey, TValue>> {
  return value === undefined ? {} : { [key]: value } as Record<TKey, TValue>;
}

function readImage(source: Record<string, unknown> | undefined, key: string): string | SeoImage | undefined {
  if (!source) {
    return undefined;
  }

  const value = source[key];
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  const record = readRecord(value);
  if (!record) {
    return undefined;
  }

  const url = readString(record, "url") ?? readString(record, "src");
  if (!url) {
    return undefined;
  }

  return {
    url,
    ...optional("alt", readString(record, "alt")),
    ...optional("width", readNumber(record, "width")),
    ...optional("height", readNumber(record, "height")),
    ...optional("caption", readString(record, "caption"))
  };
}

function readNumber(source: Record<string, unknown> | undefined, key: string): number | undefined {
  if (!source) {
    return undefined;
  }

  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readOrganization(
  schema: SchemaSeoSource,
  business: Record<string, unknown> | undefined,
  brand: Record<string, unknown> | undefined,
  contact: Record<string, unknown> | undefined
): SiteSeoInput["organization"] {
  const explicit = readRecord(schema.organization);
  if (explicit) {
    return explicit;
  }

  const name = readString(business, "name");
  if (!name) {
    return undefined;
  }

  return {
    name,
    ...optional("legalName", readString(business, "legalName")),
    ...optional("url", readString(contact, "website")),
    ...optional("logo", readImage(brand, "logo")),
    ...optional("sameAs", readSocialUrls(schema.socialLinks)),
    ...optional("telephone", readString(contact, "phone")),
    ...optional("email", readString(contact, "email")),
    ...optional("address", readAddress(readRecord(contact?.address)))
  };
}

function readBusinessProfile(
  schema: SchemaSeoSource,
  business: Record<string, unknown> | undefined,
  brand: Record<string, unknown> | undefined,
  contact: Record<string, unknown> | undefined
): BusinessProfile | undefined {
  const name = readString(business, "name");
  if (!name) {
    return undefined;
  }

  const industry = readString(business, "industry") ?? readString(business, "entityType");
  return {
    name,
    type: inferBusinessType(industry, schema.specialties),
    ...optional("legalName", readString(business, "legalName")),
    ...optional("description", readString(business, "description") ?? readString(business, "tagline")),
    ...optional("url", readString(contact, "website")),
    ...optional("logo", readImage(brand, "logo")),
    ...optional("telephone", readString(contact, "phone")),
    ...optional("email", readString(contact, "email")),
    ...optional("address", readAddress(readRecord(contact?.address))),
    ...optional("sameAs", readSocialUrls(schema.socialLinks)),
    ...optional("medicalSpecialty", schema.specialties)
  };
}

function mapHomePageToSeo(schema: SchemaSeoSource, site: SiteSeoInput): PageSeoInput {
  const seo = readRecord(schema.seo);
  const home: PageSeoInput = {
    path: "/",
    title: readString(seo, "title") ?? site.name,
    ...optional("description", readString(seo, "description") ?? site.description),
    ...optional("canonicalUrl", readString(seo, "canonicalUrl")),
    ...optional("image", readImage(readRecord(seo?.openGraph), "image") ?? site.defaultImage),
    ...optional("noIndex", readBoolean(seo, "noIndex")),
    ...optional("faq", readFaqItems(schema.faq)),
    ...optional("reviews", readReviews(schema.reviews ?? schema.testimonials))
  };

  return home;
}

function mapArticleCollection(items: Array<Record<string, unknown>> | undefined, section: string): PageSeoInput[] {
  return (items ?? []).map((item) => {
    const title = readString(item, "title") ?? "Untitled";
    const path = readString(item, "url") ?? `/${section}/${readString(item, "id") ?? slugify(title)}`;

    return {
      path,
      title,
      type: "article",
      section,
      ...optional("summary", readString(item, "summary")),
      ...optional("description", readString(item, "summary") ?? readString(item, "body")),
      ...optional("image", readImage(item, "image")),
      ...optional("publishedAt", readString(item, "date")),
      ...optional("tags", readStringArray(item, "tags")),
      article: {
        headline: title,
        ...optional("description", readString(item, "summary") ?? readString(item, "body")),
        ...optional("publishedAt", readString(item, "date")),
        ...optional("image", readImage(item, "image")),
        section,
        ...optional("tags", readStringArray(item, "tags"))
      }
    };
  });
}

function readFaqItems(items: Array<Record<string, unknown>> | undefined): FaqItem[] | undefined {
  const faq = (items ?? []).flatMap((item) => {
    const question = readString(item, "question");
    const answer = readString(item, "answer");
    return question && answer ? [{ question, answer }] : [];
  });

  return faq.length > 0 ? faq : undefined;
}

function readReviews(items: Array<Record<string, unknown>> | undefined): ReviewInput[] | undefined {
  const reviews = (items ?? []).flatMap((item) => {
    const author = readString(item, "author");
    const rating = readNumber(item, "rating");
    if (!author || rating === undefined) {
      return [];
    }

    return [{
      author,
      ratingValue: rating,
      bestRating: 5,
      worstRating: 0,
      ...optional("reviewBody", readString(item, "quote")),
      ...optional("datePublished", readString(item, "date"))
    }];
  });

  return reviews.length > 0 ? reviews : undefined;
}

function readProduct(product: Record<string, unknown> | undefined): ProductInput | undefined {
  const name = readString(product, "name") ?? readString(product, "title");
  if (!name) {
    return undefined;
  }

  const offers = readOffers(readRecordArray(product?.offers) ?? readSingleOffer(product));
  const reviews = readReviews(readRecordArray(product?.reviews));
  return {
    name,
    ...optional("description", readString(product, "description") ?? readString(product, "summary")),
    ...optional("image", readImage(product, "image")),
    ...optional("sku", readString(product, "sku")),
    ...optional("gtin", readString(product, "gtin")),
    ...optional("brand", readString(product, "brand")),
    ...optional("category", readString(product, "category")),
    ...optional("offers", offers),
    ...optional("aggregateRating", readAggregateRating(readRecord(product?.aggregateRating))),
    ...optional("reviews", reviews)
  };
}

function readSingleOffer(product: Record<string, unknown> | undefined): Array<Record<string, unknown>> | undefined {
  if (!product) {
    return undefined;
  }

  const price = readString(product, "price") ?? readNumber(product, "price")?.toString();
  const currency = readString(product, "priceCurrency") ?? readString(product, "currency");
  if (!price && !currency) {
    return undefined;
  }

  return [{
    price,
    priceCurrency: currency,
    url: readString(product, "url")
  }];
}

function readOffers(items: Array<Record<string, unknown>> | undefined): ProductOfferInput | ProductOfferInput[] | undefined {
  const offers = (items ?? []).flatMap((item) => {
    const price = readString(item, "price") ?? readNumber(item, "price")?.toString();
    const priceCurrency = readString(item, "priceCurrency") ?? readString(item, "currency");
    const url = readString(item, "url");
    if (!price && !priceCurrency && !url) {
      return [];
    }

    return [{
      ...optional("url", url),
      ...optional("price", price),
      ...optional("priceCurrency", priceCurrency),
      ...optional("availability", readString(item, "availability")),
      ...optional("itemCondition", readString(item, "itemCondition")),
      ...optional("priceValidUntil", readString(item, "priceValidUntil"))
    }];
  });

  if (offers.length === 0) {
    return undefined;
  }

  const first = offers[0];
  return offers.length === 1 ? first : offers;
}

function readAggregateRating(rating: Record<string, unknown> | undefined): ProductInput["aggregateRating"] {
  const ratingValue = readNumber(rating, "ratingValue") ?? readNumber(rating, "rating");
  if (ratingValue === undefined) {
    return undefined;
  }

  return {
    ratingValue,
    ...optional("reviewCount", readNumber(rating, "reviewCount")),
    ...optional("ratingCount", readNumber(rating, "ratingCount")),
    ...optional("bestRating", readNumber(rating, "bestRating")),
    ...optional("worstRating", readNumber(rating, "worstRating"))
  };
}

function readAddress(address: Record<string, unknown> | undefined): BusinessProfile["address"] {
  if (!address) {
    return undefined;
  }

  return {
    ...optional("streetAddress", [readString(address, "street1"), readString(address, "street2")].filter(Boolean).join(", ") || undefined),
    ...optional("addressLocality", readString(address, "city")),
    ...optional("addressRegion", readString(address, "region")),
    ...optional("postalCode", readString(address, "postalCode")),
    ...optional("addressCountry", readString(address, "country"))
  };
}

function readSocialUrls(socialLinks: Array<Record<string, unknown>> | undefined): string[] | undefined {
  const urls = (socialLinks ?? []).flatMap((link) => {
    const url = readString(link, "url");
    return url ? [url] : [];
  });

  return urls.length > 0 ? urls : undefined;
}

function readTwitterHandle(socialLinks: Array<Record<string, unknown>> | undefined): string | undefined {
  for (const link of socialLinks ?? []) {
    const platform = readString(link, "platform")?.toLowerCase();
    if (platform !== "twitter" && platform !== "x") {
      continue;
    }

    const handle = readString(link, "handle");
    if (handle) {
      return `@${handle.replace(/^@/, "")}`;
    }

    const url = readString(link, "url");
    const username = url?.split("/").filter(Boolean).at(-1);
    if (username) {
      return `@${username.replace(/^@/, "")}`;
    }
  }

  return undefined;
}

function inferBusinessType(industry: string | undefined, specialties: string[] | undefined): string {
  const normalized = industry?.toLowerCase() ?? "";
  if (normalized.includes("restaurant") || normalized.includes("food")) {
    return "Restaurant";
  }

  if (normalized.includes("medical") || normalized.includes("health") || (specialties?.length ?? 0) > 0) {
    return "MedicalBusiness";
  }

  return "LocalBusiness";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "item";
}
