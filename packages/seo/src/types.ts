export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue | undefined };

export type JsonLdNode = {
  "@context"?: string;
  "@type"?: string | string[];
  [key: string]: unknown;
};

export type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
export type TwitterCardType = "summary" | "summary_large_image" | "app" | "player";

export interface SeoImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: string;
  caption?: string;
  title?: string;
  license?: string;
  geoLocation?: string;
}

export interface PostalAddress {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface ContactPoint {
  telephone?: string;
  email?: string;
  contactType?: string;
  areaServed?: string | string[];
  availableLanguage?: string | string[];
}

export interface OrganizationProfile {
  name?: string;
  legalName?: string;
  url?: string;
  logo?: string | SeoImage;
  sameAs?: string[];
  telephone?: string;
  email?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint | ContactPoint[];
}

export interface BusinessProfile extends OrganizationProfile {
  type?: "LocalBusiness" | "Restaurant" | "MedicalBusiness" | "MedicalClinic" | string;
  description?: string;
  image?: string | SeoImage | Array<string | SeoImage>;
  priceRange?: string;
  openingHours?: string[];
  openingHoursSpecification?: JsonLdNode[];
  geo?: GeoCoordinates;
  cuisine?: string | string[];
  menuUrl?: string;
  acceptsReservations?: boolean | string;
  medicalSpecialty?: string | string[];
}

export interface PersonProfile {
  name: string;
  url?: string;
  image?: string | SeoImage;
  jobTitle?: string;
  sameAs?: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductAggregateRatingInput {
  ratingValue: number;
  reviewCount?: number;
  ratingCount?: number;
  bestRating?: number;
  worstRating?: number;
}

export interface ProductOfferInput {
  url?: string;
  price?: string | number;
  priceCurrency?: string;
  availability?: string;
  itemCondition?: string;
  priceValidUntil?: string | Date;
  seller?: string | OrganizationProfile | BusinessProfile;
}

export interface ProductInput {
  name: string;
  description?: string;
  image?: string | SeoImage | Array<string | SeoImage>;
  sku?: string;
  gtin?: string;
  brand?: string | OrganizationProfile;
  category?: string;
  offers?: ProductOfferInput | ProductOfferInput[];
  aggregateRating?: ProductAggregateRatingInput;
  reviews?: ReviewInput[];
}

export interface ReviewInput {
  author: string | PersonProfile;
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
  reviewBody?: string;
  datePublished?: string | Date;
  itemReviewedName?: string;
  itemReviewed?: ProductInput | BusinessProfile | OrganizationProfile;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleInput {
  headline?: string;
  description?: string;
  author?: string | PersonProfile;
  publisher?: OrganizationProfile;
  publishedAt?: string | Date;
  modifiedAt?: string | Date;
  image?: string | SeoImage | Array<string | SeoImage>;
  section?: string;
  tags?: string[];
  wordCount?: number;
}

export interface SiteSeoInput {
  name: string;
  url: string;
  description?: string;
  locale?: string;
  defaultImage?: string | SeoImage;
  twitterHandle?: string;
  organization?: OrganizationProfile;
  business?: BusinessProfile;
}

export interface PageSeoInput {
  title?: string;
  description?: string;
  summary?: string;
  path?: string;
  url?: string;
  canonicalUrl?: string;
  locale?: string;
  image?: string | SeoImage;
  images?: Array<string | SeoImage>;
  noIndex?: boolean;
  noFollow?: boolean;
  type?: "website" | "article" | "profile" | "business" | "product" | string;
  tags?: string[];
  section?: string;
  publishedAt?: string | Date;
  modifiedAt?: string | Date;
  alternates?: Record<string, string>;
  breadcrumbs?: BreadcrumbItem[];
  faq?: FaqItem[];
  reviews?: ReviewInput[];
  author?: string | PersonProfile;
  article?: ArticleInput;
  product?: ProductInput;
}

export interface OpenGraphMetadata {
  title: string;
  description: string;
  url: string;
  siteName: string;
  locale?: string;
  type: string;
  images: SeoImage[];
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags: string[];
}

export interface TwitterCardMetadata {
  card: TwitterCardType;
  site?: string;
  creator?: string;
  title: string;
  description: string;
  image?: SeoImage;
}

export interface PageMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: {
    index: boolean;
    follow: boolean;
  };
  alternates: Record<string, string>;
  openGraph: OpenGraphMetadata;
  twitter: TwitterCardMetadata;
}

export interface MetadataOptions {
  titleTemplate?: string;
  defaultDescription?: string;
  titleSeparator?: string;
  maxTitleLength?: number;
  maxDescriptionLength?: number;
}

export interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: ChangeFrequency;
  priority?: number;
  images?: SeoImage[];
  alternates?: Record<string, string>;
}

export interface RobotsRule {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

export interface RobotsTxtOptions {
  siteUrl: string;
  rules?: RobotsRule[];
  sitemapUrls?: string[];
  host?: string;
}

export interface RssFeedInfo {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl?: string;
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
}

export interface RssFeedItem {
  title: string;
  url: string;
  description?: string;
  publishedAt?: string | Date;
  updatedAt?: string | Date;
  author?: string;
  categories?: string[];
  guid?: string;
}

export interface LlmsTxtLink {
  title: string;
  url: string;
  description?: string;
}

export interface LlmsTxtSection {
  heading: string;
  body?: string;
  links?: LlmsTxtLink[];
}

export interface LlmsTxtOptions {
  title?: string;
  description?: string;
  siteUrl?: string;
  pages?: PageSeoInput[];
  sections?: LlmsTxtSection[];
  includeSitemap?: boolean;
  sitemapUrl?: string;
}

export interface PageSeoArtifact {
  path: string;
  url: string;
  metadata: PageMetadata;
  metaTags: string;
  structuredData: JsonLdNode[];
  jsonLdScript: string;
}

export interface SeoArtifactFile {
  path: string;
  contents: string;
  contentType: string;
}

export interface SeoArtifactManifest {
  pages: PageSeoArtifact[];
  sitemapXml: string;
  robotsTxt: string;
  llmsTxt: string;
  imageSitemapXml?: string;
  rssXml?: string;
  files: SeoArtifactFile[];
}

export interface SeoArtifactOptions extends MetadataOptions {
  sitemapEntries?: SitemapEntry[];
  includeImageSitemap?: boolean;
  robots?: Omit<RobotsTxtOptions, "siteUrl">;
  rssFeed?: RssFeedInfo;
  rssItems?: RssFeedItem[];
  llms?: Omit<LlmsTxtOptions, "siteUrl" | "pages">;
}

export interface SchemaSeoAdapter<TSchema, TResult = SiteSeoInput> {
  (schema: TSchema): TResult;
}
