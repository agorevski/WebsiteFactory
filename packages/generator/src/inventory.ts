import type { UniversalContentV2, UniversalSite, WebsiteData } from '@website-factory/schema';
import type { ContentInventory, GeneratorInput, GeneratorInputKind } from './types.js';

const emptyContent: UniversalContentV2 = {
  version: 2,
  verticals: [],
  taxonomy: [],
  locations: [],
  serviceAreas: [],
  contacts: [],
  socialLinks: [],
  people: [],
  staff: [],
  credentials: [],
  awards: [],
  certifications: [],
  services: [],
  products: [],
  productCatalogs: [],
  pricing: [],
  pricingGroups: [],
  memberships: [],
  subscriptions: [],
  menus: [],
  events: [],
  courses: [],
  articles: [],
  posts: [],
  docs: [],
  media: {
    assets: [],
    photos: [],
    videos: [],
    galleries: []
  },
  testimonials: [],
  reviews: [],
  faq: [],
  booking: {
    enabled: false,
    modes: [],
    forms: [],
    rules: [],
    customData: {}
  },
  forms: [],
  compliance: {
    jurisdictions: [],
    licenses: [],
    regulatedContent: {
      requiresHumanReview: false,
      notes: []
    },
    disclaimers: [],
    customData: {}
  },
  customData: {
    fields: {},
    slots: []
  }
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isUniversalSite(input: GeneratorInput): input is UniversalSite {
  if (!isRecord(input)) {
    return false;
  }

  const record = input as Record<string, unknown>;
  return typeof record.slug === 'string' && Array.isArray(record.navigation) && Array.isArray(record.sections);
}

export function getInputKind(input: GeneratorInput): GeneratorInputKind {
  return isUniversalSite(input) ? 'universal-site' : 'website-data';
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug.length > 0 ? slug : 'site';
}

function countWeeklyHours(content: UniversalContentV2 | undefined): number {
  if (!content?.hours?.weekly) {
    return 0;
  }

  return Object.values(content.hours.weekly).filter((entry) => entry && (!entry.isClosed || entry.ranges.length > 0 || entry.note)).length;
}

function hasLocationAddress(input: GeneratorInput, content: UniversalContentV2 | undefined): boolean {
  if (content?.locations.some((location) => Boolean(location.address))) {
    return true;
  }

  if (content?.contacts.some((contact) => Boolean(contact.address))) {
    return true;
  }

  if (isUniversalSite(input)) {
    return Boolean(input.business.address);
  }

  return Boolean(input.contact.address) || input.locations.some((location) => Boolean(location.address));
}

function countContactPoints(input: GeneratorInput, content: UniversalContentV2 | undefined): number {
  const contentContacts = content?.contacts.length ?? 0;
  if (contentContacts > 0) {
    return contentContacts;
  }

  if (isUniversalSite(input)) {
    const directMethods = [input.business.phone, input.business.email].filter(Boolean).length;
    return directMethods + input.business.social.length;
  }

  const contactMethods = [input.contact.phone, input.contact.email, input.contact.smsPhone, input.contact.bookingUrl, input.contact.formUrl].filter(Boolean).length;
  return contactMethods + input.contactPoints.length;
}

function countImages(content: UniversalContentV2 | undefined, input: GeneratorInput): number {
  const mediaImages = (content?.media.assets.filter((asset) => asset.type === 'image' || asset.image).length ?? 0)
    + (content?.media.photos.length ?? 0)
    + (content?.media.galleries.reduce((total, gallery) => total + gallery.images.length + gallery.assets.length, 0) ?? 0);

  if (mediaImages > 0) {
    return mediaImages;
  }

  if (isUniversalSite(input)) {
    const sectionImages = input.sections.reduce((total, section) => total + section.items.filter((item) => Boolean(item.image)).length, 0);
    return sectionImages + (input.hero.image ? 1 : 0);
  }

  const galleryImages = input.gallery.length + input.media.photos.length + input.media.galleries.reduce((total, gallery) => total + gallery.images.length + gallery.assets.length, 0);
  const serviceImages = input.services.reduce((total, service) => total + service.images.length + (service.image ? 1 : 0), 0);
  const productImages = input.products.reduce((total, product) => total + product.images.length, 0);
  return galleryImages + serviceImages + productImages + (input.hero?.image ? 1 : 0);
}

function countVideos(content: UniversalContentV2 | undefined, input: GeneratorInput): number {
  const mediaVideos = (content?.media.assets.filter((asset) => asset.type === 'video' || asset.video).length ?? 0) + (content?.media.videos.length ?? 0);
  if (mediaVideos > 0) {
    return mediaVideos;
  }

  if (isUniversalSite(input)) {
    return 0;
  }

  const serviceVideos = input.services.reduce((total, service) => total + service.videos.length, 0);
  const productVideos = input.products.reduce((total, product) => total + product.videos.length, 0);
  return input.videos.length + input.media.videos.length + serviceVideos + productVideos + (input.hero?.video ? 1 : 0);
}

function countPricingOptions(input: GeneratorInput, content: UniversalContentV2 | undefined): number {
  if (content && (content.pricing.length > 0 || content.pricingGroups.length > 0)) {
    return content.pricing.length + content.pricingGroups.reduce((total, group) => total + group.plans.length, 0);
  }

  if (isUniversalSite(input)) {
    return 0;
  }

  return input.pricingOptions.length + input.pricing.plans.length;
}

function countCareers(input: GeneratorInput): number {
  if (isUniversalSite(input)) {
    return 0;
  }

  return input.careers.openings.length;
}

function countLegacyUniversalSections(input: UniversalSite, sectionType: UniversalSite['sections'][number]['type']): number {
  return input.sections.filter((section) => section.type === sectionType).length;
}

function hasLegacyHours(input: GeneratorInput): boolean {
  if (isUniversalSite(input)) {
    return input.business.hours.length > 0;
  }

  return Object.values(input.hours.weekly).some((entry) => entry && (!entry.isClosed || entry.ranges.length > 0 || entry.note));
}

function getBusinessName(input: GeneratorInput): string {
  return input.business.name;
}

function getSlug(input: GeneratorInput): string {
  if (isUniversalSite(input)) {
    return input.slug;
  }

  return slugify(input.business.name);
}

function getVerticals(input: GeneratorInput, content: UniversalContentV2 | undefined): readonly string[] {
  const verticals = new Set<string>();

  if (isUniversalSite(input)) {
    verticals.add(input.vertical);
  } else if (input.business.industry) {
    verticals.add(input.business.industry);
  }

  for (const vertical of content?.verticals ?? []) {
    verticals.add(vertical);
  }

  return [...verticals].filter((vertical) => vertical.trim().length > 0);
}

export function getUniversalContent(input: GeneratorInput): UniversalContentV2 {
  return input.content ?? emptyContent;
}

export function createContentInventory(input: GeneratorInput): ContentInventory {
  const content = getUniversalContent(input);
  const legacyUniversal = isUniversalSite(input) ? input : undefined;
  const isUniversal = Boolean(legacyUniversal);
  const website = isUniversal ? undefined : input as WebsiteData;
  const locations = content.locations.length || (isUniversal ? 1 : website?.locations.length ?? 0);
  const people = content.people.length || (isUniversal ? 0 : website?.people.length ?? 0);
  const staff = content.staff.length || (isUniversal ? 0 : website?.team.members.length ?? 0);
  const testimonials = content.testimonials.length || (legacyUniversal ? legacyUniversal.sections.reduce((total, section) => total + section.testimonials.length, 0) : website?.testimonials.length ?? 0);
  const reviews = content.reviews.length || (isUniversal ? 0 : website?.reviews.length ?? 0);
  const faq = content.faq.length || (legacyUniversal ? legacyUniversal.sections.reduce((total, section) => total + section.questions.length, 0) : website?.faq.length ?? 0);
  const services = content.services.length || (legacyUniversal ? legacyUniversal.sections.reduce((total, section) => total + section.items.length, 0) : website?.services.length ?? 0);
  const products = content.products.length || (isUniversal ? 0 : website?.products.length ?? 0);
  const productCatalogs = content.productCatalogs.length || (isUniversal ? 0 : website?.productCatalogs.length ?? 0);
  const pricingOptions = countPricingOptions(input, content);
  const pricingGroups = content.pricingGroups.length || (isUniversal ? 0 : (website?.pricing.plans.length ?? 0) > 0 ? 1 : 0);
  const memberships = content.memberships.length || (isUniversal ? 0 : website?.memberships.length ?? 0);
  const subscriptions = content.subscriptions.length || (isUniversal ? 0 : website?.subscriptions.length ?? 0);
  const awards = content.awards.length || (isUniversal ? 0 : website?.awards.length ?? 0);
  const certifications = content.certifications.length || (isUniversal ? 0 : website?.certifications.length ?? 0);
  const credentials = content.credentials.length || (legacyUniversal ? legacyUniversal.business.credentials.length : website?.credentials.length ?? 0);
  const articles = content.articles.length || (isUniversal ? 0 : website?.articles.length ?? 0);
  const posts = content.posts.length || (isUniversal ? 0 : website?.blog.length ?? 0);
  const docs = content.docs.length;
  const events = content.events.length || (isUniversal ? 0 : website?.events.length ?? 0);
  const courses = content.courses.length || (isUniversal ? 0 : website?.courses.length ?? 0);
  const menus = content.menus.length || (isUniversal ? 0 : website?.menus.length ?? 0);
  const hasBooking = content.booking.enabled || Boolean(content.booking.bookingUrl) || (isUniversal ? false : Boolean(website?.booking.enabled || website?.appointments.enabled || website?.reservations.enabled));
  const hasAppointments = Boolean(content.appointments?.enabled || content.booking.modes.includes('appointment') || (!isUniversal && website?.appointments.enabled));
  const hasReservations = Boolean(content.reservations?.enabled || content.booking.modes.includes('reservation') || (!isUniversal && website?.reservations.enabled));
  const forms = content.forms.length + content.booking.forms.length + (isUniversal ? 0 : website?.forms.length ?? 0);
  const legalNotices = content.compliance.disclaimers.length + (content.legal?.disclaimers.length ?? 0) + (isUniversal ? 0 : website?.legal.disclaimers.length ?? 0);
  const hasHours = Boolean(content.hours || countWeeklyHours(content) > 0 || content.locations.some((location) => Boolean(location.hours)) || hasLegacyHours(input));
  const images = countImages(content, input);
  const videos = countVideos(content, input);
  const mediaAssets = content.media.assets.length + images + videos;
  const galleries = content.media.galleries.length || (isUniversal ? 0 : website?.media.galleries.length ?? 0);

  return {
    inputKind: getInputKind(input),
    businessName: getBusinessName(input),
    slug: getSlug(input),
    verticals: getVerticals(input, content),
    services,
    products,
    productCatalogs,
    pricingOptions,
    pricingGroups,
    memberships,
    subscriptions,
    people,
    staff,
    testimonials,
    reviews,
    faq,
    locations,
    contactPoints: countContactPoints(input, content),
    socialLinks: content.socialLinks.length || (legacyUniversal ? legacyUniversal.business.social.length : website?.socialLinks.length ?? 0),
    hasAddress: hasLocationAddress(input, content),
    hasHours,
    hasBooking,
    hasAppointments,
    hasReservations,
    forms,
    awards,
    certifications,
    credentials,
    mediaAssets,
    images,
    videos,
    galleries,
    articles,
    posts,
    docs,
    events,
    courses,
    menus,
    careers: countCareers(input),
    legalNotices,
    regulatedContent: content.compliance.regulatedContent.requiresHumanReview || ['doctor', 'dentist', 'medical-clinic', 'attorney'].some((vertical) => getVerticals(input, content).includes(vertical))
  };
}

export function countUniversalLegacySections(input: GeneratorInput, sectionType: UniversalSite['sections'][number]['type']): number {
  return isUniversalSite(input) ? countLegacyUniversalSections(input, sectionType) : 0;
}
