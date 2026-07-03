import type {
  ComponentCategoryId,
  ComponentContentSignal,
  ComponentDataRequirement,
  ComponentLayoutRole
} from '@website-factory/components/marketplace';
import { getComponentMarketplaceCategory } from '@website-factory/components/marketplace';
import type {
  ContentSignalSummary,
  GenerationDiagnostic,
  GeneratorContentTypeDefinition,
  GeneratorInput,
  InferredSectionCandidate,
  InferSectionCandidatesOptions,
  OmittedSectionReason,
  SectionInferenceResult
} from './types.js';

function unique<TValue extends string>(values: readonly TValue[]): readonly TValue[] {
  return [...new Set(values)];
}

function inferCategorySignals(categoryId: ComponentCategoryId, extraSignals: readonly ComponentContentSignal[]): readonly ComponentContentSignal[] {
  const category = getComponentMarketplaceCategory(categoryId);
  return unique([...(category?.defaultContentSignals ?? []), ...extraSignals]);
}

function inferCategoryRoles(categoryId: ComponentCategoryId, roles: readonly ComponentLayoutRole[] = []): readonly ComponentLayoutRole[] {
  const category = getComponentMarketplaceCategory(categoryId);
  return unique([...(category?.layoutRoles ?? []), ...roles]);
}

function inferCategoryRequirements(categoryId: ComponentCategoryId, requirements: readonly ComponentDataRequirement[] = []): readonly ComponentDataRequirement[] {
  const category = getComponentMarketplaceCategory(categoryId);
  return unique([...(category?.dataRequirements ?? []), ...requirements]);
}

function createCandidate(input: {
  readonly id: string;
  readonly categoryId: ComponentCategoryId;
  readonly label: string;
  readonly reason: string;
  readonly sources: readonly string[];
  readonly confidence: number;
  readonly signals: readonly ComponentContentSignal[];
  readonly roles?: readonly ComponentLayoutRole[];
  readonly requirements?: readonly ComponentDataRequirement[];
  readonly customTypeId?: string;
}): InferredSectionCandidate {
  const candidate: InferredSectionCandidate = {
    id: input.id,
    kind: input.customTypeId ? 'custom-content-type' : 'component-category',
    label: input.label,
    reason: input.reason,
    sources: input.sources,
    confidence: input.confidence,
    contentSignals: inferCategorySignals(input.categoryId, input.signals),
    categoryId: input.categoryId,
    layoutRoles: inferCategoryRoles(input.categoryId, input.roles),
    dataRequirements: inferCategoryRequirements(input.categoryId, input.requirements)
  };

  if (!input.customTypeId) {
    return candidate;
  }

  return {
    ...candidate,
    customTypeId: input.customTypeId
  };
}

function createUnsupportedCandidate(input: {
  readonly id: string;
  readonly label: string;
  readonly reason: string;
  readonly sources: readonly string[];
  readonly confidence: number;
  readonly signals: readonly ComponentContentSignal[];
}): InferredSectionCandidate {
  return {
    id: input.id,
    kind: 'unsupported-intent',
    label: input.label,
    reason: input.reason,
    sources: input.sources,
    confidence: input.confidence,
    contentSignals: input.signals,
    layoutRoles: [],
    dataRequirements: []
  };
}

function createOmitted(candidate: InferredSectionCandidate, code: OmittedSectionReason['reasonCode'], message: string): OmittedSectionReason {
  return {
    candidateId: candidate.id,
    label: candidate.label,
    reasonCode: code,
    message,
    sources: candidate.sources,
    diagnostics: [
      {
        code: `generator.omit.${candidate.id}.${code}`,
        severity: code === 'missing-data' ? 'info' : 'warning',
        message,
        source: candidate.sources[0] ?? 'generator',
        path: []
      }
    ]
  };
}

function createDiagnostic(code: string, message: string, source: string): GenerationDiagnostic {
  return {
    code,
    severity: 'info',
    message,
    source,
    path: []
  };
}

function addCandidate(
  candidates: InferredSectionCandidate[],
  omittedSections: OmittedSectionReason[],
  supportedCategories: ReadonlySet<ComponentCategoryId> | undefined,
  candidate: InferredSectionCandidate
): void {
  if (!candidate.categoryId) {
    omittedSections.push(createOmitted(candidate, 'unsupported-category', `${candidate.label} was omitted because no marketplace component category exists for this content intent.`));
    return;
  }

  if (supportedCategories && !supportedCategories.has(candidate.categoryId)) {
    omittedSections.push(createOmitted(candidate, 'unsupported-category', `${candidate.label} was omitted because category ${candidate.categoryId} is not enabled for this generator run.`));
    return;
  }

  candidates.push(candidate);
}

function addMissingDataOmission(omittedSections: OmittedSectionReason[], id: string, label: string, source: string, message: string): void {
  omittedSections.push({
    candidateId: id,
    label,
    reasonCode: 'missing-data',
    message,
    sources: [source],
    diagnostics: [createDiagnostic(`generator.omit.${id}.missing-data`, message, source)]
  });
}

function inferCustomCandidates(
  input: GeneratorInput,
  summary: ContentSignalSummary,
  customContentTypes: readonly GeneratorContentTypeDefinition[]
): readonly InferredSectionCandidate[] {
  return customContentTypes
    .filter((definition) => definition.detect(input, summary))
    .map((definition) => {
      if (definition.categoryId) {
        const candidateInput = {
          id: `custom-${definition.id}`,
          categoryId: definition.categoryId,
          label: definition.label,
          reason: definition.description ?? `Custom content type ${definition.id} matched this site's content.`,
          sources: [`customContentTypes.${definition.id}`],
          confidence: 0.7,
          signals: definition.contentSignals,
          customTypeId: definition.id
        };

        return createCandidate({
          ...candidateInput,
          ...(definition.layoutRoles ? { roles: definition.layoutRoles } : {}),
          ...(definition.dataRequirements ? { requirements: definition.dataRequirements } : {})
        });
      }

      return createUnsupportedCandidate({
        id: `custom-${definition.id}`,
        label: definition.label,
        reason: definition.description ?? `Custom content type ${definition.id} matched this site's content.`,
        sources: [`customContentTypes.${definition.id}`],
        confidence: 0.7,
        signals: definition.contentSignals
      });
    });
}

export function inferSectionCandidates(
  input: GeneratorInput,
  summary: ContentSignalSummary,
  options: InferSectionCandidatesOptions = {}
): SectionInferenceResult {
  const { inventory } = summary;
  const candidates: InferredSectionCandidate[] = [];
  const omittedSections: OmittedSectionReason[] = [];
  const diagnostics: GenerationDiagnostic[] = [];
  const supportedCategories = options.supportedCategories ? new Set(options.supportedCategories) : undefined;

  if (inventory.services > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'services',
      categoryId: 'services',
      label: 'Services',
      reason: 'Service data supports a service catalog section.',
      sources: ['content.services'],
      confidence: 0.92,
      signals: ['serviceCatalog', 'featureHighlights', 'appointmentIntent']
    }));

    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'service-features',
      categoryId: 'features',
      label: 'Service feature highlights',
      reason: 'Service benefits and features can be summarized without encoding presentation in YAML.',
      sources: ['content.services'],
      confidence: 0.74,
      signals: ['featureHighlights', 'serviceCatalog']
    }));
  } else {
    addMissingDataOmission(omittedSections, 'services', 'Services', 'content.services', 'Services section omitted because no services were provided.');
  }

  if (inventory.people + inventory.staff > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'team',
      categoryId: 'team',
      label: 'Team',
      reason: 'People and staff data supports a team section.',
      sources: ['content.people', 'content.staff'],
      confidence: 0.9,
      signals: ['peopleProfiles', 'teamCredibility', 'trustCredentials']
    }));

    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'staff-profiles',
      categoryId: 'staffProfiles',
      label: 'Staff profiles',
      reason: 'Detailed people profiles support staff profile sections.',
      sources: ['content.people', 'content.staff'],
      confidence: 0.82,
      signals: ['peopleProfiles', 'teamCredibility', 'trustCredentials']
    }));
  } else {
    addMissingDataOmission(omittedSections, 'team', 'Team', 'content.people', 'Team section omitted because no people or staff profiles were provided.');
  }

  if (inventory.testimonials + inventory.reviews > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'testimonials',
      categoryId: 'testimonials',
      label: 'Testimonials',
      reason: 'Testimonials or reviews support a social proof section.',
      sources: ['content.testimonials', 'content.reviews'],
      confidence: 0.9,
      signals: ['socialProof', 'quotes', 'ratings']
    }));

    if (inventory.reviews > 0) {
      addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
        id: 'reviews',
        categoryId: 'reviews',
        label: 'Reviews',
        reason: 'Review data supports a review-summary section.',
        sources: ['content.reviews'],
        confidence: 0.84,
        signals: ['ratings', 'socialProof', 'quotes']
      }));
    }
  } else {
    addMissingDataOmission(omittedSections, 'testimonials', 'Testimonials', 'content.reviews', 'Testimonials section omitted because no testimonials or reviews were provided.');
  }

  if (inventory.pricingOptions + inventory.pricingGroups + inventory.memberships + inventory.subscriptions > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'pricing',
      categoryId: 'pricing',
      label: 'Pricing',
      reason: 'Pricing, membership, or subscription data supports a pricing section.',
      sources: ['content.pricing', 'content.memberships', 'content.subscriptions'],
      confidence: 0.88,
      signals: ['pricingClarity', 'comparison', 'transactional']
    }));

    if (inventory.pricingOptions + inventory.pricingGroups > 1) {
      addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
        id: 'comparison-tables',
        categoryId: 'comparisonTables',
        label: 'Comparison tables',
        reason: 'Multiple price options can be compared without layout fields in content YAML.',
        sources: ['content.pricing'],
        confidence: 0.72,
        signals: ['comparison', 'pricingClarity', 'featureHighlights']
      }));
    }
  } else {
    addMissingDataOmission(omittedSections, 'pricing', 'Pricing', 'content.pricing', 'Pricing section omitted because no pricing, membership, or subscription data was provided.');
  }

  if (inventory.products + inventory.productCatalogs + inventory.menus > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'product-catalog',
      categoryId: 'productCatalog',
      label: 'Product catalog',
      reason: 'Product, catalog, or menu data supports catalog browsing.',
      sources: ['content.products', 'content.productCatalogs', 'content.menus'],
      confidence: 0.86,
      signals: ['catalog', 'commerce', 'transactional']
    }));

    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'ecommerce-grid',
      categoryId: 'ecommerceGrid',
      label: 'Commerce grid',
      reason: 'Catalog-like product data can support commerce grid implementations.',
      sources: ['content.products', 'content.productCatalogs'],
      confidence: 0.72,
      signals: ['commerce', 'catalog', 'transactional']
    }));
  }

  if (inventory.locations > 1) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'locations',
      categoryId: 'locations',
      label: 'Locations',
      reason: 'Multiple locations support a location directory or map-adjacent section.',
      sources: ['content.locations'],
      confidence: 0.9,
      signals: ['multiLocation', 'localDiscovery', 'contactIntent']
    }));
  }

  if (inventory.hasHours) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'opening-hours',
      categoryId: 'openingHours',
      label: 'Opening hours',
      reason: 'Hours data supports an availability or opening-hours section.',
      sources: ['content.hours'],
      confidence: 0.86,
      signals: ['availability', 'localDiscovery', 'contactIntent']
    }));
  }

  if (inventory.contactPoints > 0 || inventory.hasAddress) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'contact',
      categoryId: 'contact',
      label: 'Contact',
      reason: 'Contact methods, forms, or address data support a contact gateway section.',
      sources: ['content.contacts', 'business.address'],
      confidence: 0.9,
      signals: ['contactIntent', 'multiChannel', 'localDiscovery']
    }));
  } else {
    addMissingDataOmission(omittedSections, 'contact', 'Contact', 'content.contacts', 'Contact section omitted because no contact method or address data was provided.');
  }

  if (inventory.awards > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'awards',
      categoryId: 'awards',
      label: 'Awards',
      reason: 'Award data supports trust-proof recognition sections.',
      sources: ['content.awards'],
      confidence: 0.82,
      signals: ['trustCredentials', 'brandTrust', 'regulatedContent']
    }));
  }

  if (inventory.certifications + inventory.credentials > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'certifications',
      categoryId: 'certifications',
      label: 'Certifications',
      reason: 'Credential and certification data supports trust-proof credential sections.',
      sources: ['content.certifications', 'content.credentials'],
      confidence: 0.84,
      signals: ['trustCredentials', 'regulatedContent', 'professionalProof']
    }));

    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'trust-proof',
      categoryId: 'logos',
      label: 'Trust proof',
      reason: 'Credential and recognition data can support trust-badge implementations.',
      sources: ['content.credentials', 'content.certifications', 'content.awards'],
      confidence: 0.68,
      signals: ['brandTrust', 'partnerProof', 'socialProof']
    }));
  }

  if (inventory.faq > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'faq',
      categoryId: 'faq',
      label: 'FAQ',
      reason: 'FAQ data supports support-question sections.',
      sources: ['content.faq'],
      confidence: 0.92,
      signals: ['supportQuestions', 'longCopy', 'regulatedContent']
    }));
  }

  if (inventory.images + inventory.galleries > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'gallery',
      categoryId: 'gallery',
      label: 'Gallery',
      reason: 'Image and gallery media supports visual showcase sections.',
      sources: ['content.media'],
      confidence: 0.82,
      signals: ['imageHeavy', 'mediaAvailable', 'projectShowcase']
    }));

    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'image-grid',
      categoryId: 'imageGrid',
      label: 'Image grid',
      reason: 'Image-heavy media supports image-grid implementations.',
      sources: ['content.media'],
      confidence: 0.74,
      signals: ['imageHeavy', 'mediaAvailable', 'projectShowcase']
    }));
  }

  if (inventory.videos > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'video-gallery',
      categoryId: 'videoGallery',
      label: 'Video gallery',
      reason: 'Video assets support video-gallery implementations.',
      sources: ['content.media.videos'],
      confidence: 0.78,
      signals: ['videoAvailable', 'mediaAvailable', 'processEducation']
    }));
  }

  if (inventory.articles + inventory.posts + inventory.docs > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'blog-preview',
      categoryId: 'blogPreview',
      label: 'Blog preview',
      reason: 'Article, post, or documentation content supports editorial preview sections.',
      sources: ['content.articles', 'content.posts', 'content.docs'],
      confidence: 0.82,
      signals: ['editorial', 'articleList', 'freshness']
    }));

    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'related-articles',
      categoryId: 'relatedArticles',
      label: 'Related articles',
      reason: 'Editorial libraries support related-article and internal-linking sections.',
      sources: ['content.articles', 'content.posts'],
      confidence: 0.72,
      signals: ['articleList', 'editorial', 'navigationAid']
    }));

    if (inventory.docs > 0 || inventory.articles + inventory.posts > 2) {
      addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
        id: 'table-of-contents',
        categoryId: 'tableOfContents',
        label: 'Table of contents',
        reason: 'Long-form or documentation content supports table-of-contents navigation.',
        sources: ['content.docs', 'content.articles'],
        confidence: 0.66,
        signals: ['navigationAid', 'longCopy', 'pageHierarchy']
      }));

      addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
        id: 'sidebar-navigation',
        categoryId: 'sidebarNavigation',
        label: 'Sidebar navigation',
        reason: 'Nested editorial or documentation content supports sidebar navigation.',
        sources: ['content.docs', 'content.articles'],
        confidence: 0.64,
        signals: ['navigationAid', 'longCopy', 'pageHierarchy']
      }));
    }
  }

  if (inventory.events > 0) {
    const unsupportedEvents = createUnsupportedCandidate({
      id: 'events-listing',
      label: 'Events listing',
      reason: 'Event data is available, but no event listing category exists in the component marketplace yet.',
      sources: ['content.events'],
      confidence: 0.82,
      signals: ['timeSensitive', 'availability', 'transactional']
    });
    omittedSections.push(createOmitted(unsupportedEvents, 'unsupported-category', 'Events listing was omitted because the component marketplace does not expose an events category yet.'));
  }

  if (inventory.courses > 0) {
    const unsupportedCourses = createUnsupportedCandidate({
      id: 'course-catalog',
      label: 'Course catalog',
      reason: 'Course data is available, but no course catalog category exists in the component marketplace yet.',
      sources: ['content.courses'],
      confidence: 0.82,
      signals: ['resourceLibrary', 'leadCapture', 'transactional']
    });
    omittedSections.push(createOmitted(unsupportedCourses, 'unsupported-category', 'Course catalog was omitted because the component marketplace does not expose a course category yet.'));
  }

  if (inventory.events + inventory.courses > 0 || inventory.forms > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'newsletter',
      categoryId: 'newsletter',
      label: 'Newsletter',
      reason: 'Events, courses, forms, or editorial flows can support lead capture.',
      sources: ['content.events', 'content.courses', 'content.forms'],
      confidence: 0.68,
      signals: ['leadCapture', 'editorial', 'secondaryConversion']
    }));
  }

  if (inventory.events + inventory.courses > 0 || inventory.hasBooking || inventory.hasAppointments || inventory.hasReservations) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'booking',
      categoryId: 'booking',
      label: 'Booking',
      reason: 'Booking, appointment, reservation, event, or course data supports conversion and scheduling sections.',
      sources: ['content.booking', 'content.events', 'content.courses'],
      confidence: 0.78,
      signals: ['appointmentIntent', 'transactional', 'availability']
    }));
  }

  if (inventory.careers > 0) {
    addCandidate(candidates, omittedSections, supportedCategories, createCandidate({
      id: 'careers',
      categoryId: 'careers',
      label: 'Careers',
      reason: 'Career openings support recruiting sections.',
      sources: ['content.careers'],
      confidence: 0.74,
      signals: ['hiring', 'peopleProfiles', 'longCopy']
    }));
  }

  for (const customCandidate of inferCustomCandidates(input, summary, options.customContentTypes ?? [])) {
    addCandidate(candidates, omittedSections, supportedCategories, customCandidate);
  }

  diagnostics.push(createDiagnostic(
    'generator.sections.inferred',
    `Inferred ${candidates.length} supported section candidates and ${omittedSections.length} omissions from available content.`,
    'generator.sections'
  ));

  return {
    candidates,
    omittedSections,
    diagnostics
  };
}
