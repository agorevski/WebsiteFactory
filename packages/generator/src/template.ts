import type { TemplateLayout, TemplateSectionDefinition, WebsiteTemplate } from '@website-factory/templates';
import { defaultTemplateId, isTemplateId, listTemplates, resolveTemplate } from '@website-factory/templates';
import { isUniversalSite } from './inventory.js';
import { inferContentSignals } from './signals.js';
import type {
  ContentSignalSummary,
  GeneratorInput,
  TemplateResolutionPlan,
  TemplateSelectionCandidate,
  TemplateSelectionOptions
} from './types.js';

const defaultRecommendationLimit = 5;

function normalizeScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(1, score));
}

function normalizeToken(value: string): string {
  return value.trim().toLowerCase();
}

function tokenize(values: readonly (string | undefined)[]): Set<string> {
  return new Set(
    values
      .filter((value): value is string => value !== undefined)
      .join(' ')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 1)
  );
}

function keywordOverlap(requestedValues: readonly (string | undefined)[], availableValues: readonly string[]): number {
  const requested = tokenize(requestedValues);
  const available = tokenize(availableValues);

  if (requested.size === 0 || available.size === 0) {
    return 0;
  }

  let matches = 0;
  for (const token of requested) {
    if (available.has(token)) {
      matches += 1;
    }
  }

  return matches / requested.size;
}

function matchedKeywords(requestedValues: readonly string[], availableValues: readonly string[]): readonly string[] {
  const available = tokenize(availableValues);
  return [...tokenize(requestedValues)]
    .filter((token) => available.has(token))
    .sort();
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort();
}

function uniqueLayouts(values: readonly TemplateLayout[]): readonly TemplateLayout[] {
  return [...new Set(values)];
}

function templateSearchValues(template: WebsiteTemplate): readonly string[] {
  return [
    template.id,
    template.name,
    template.description,
    template.audience,
    template.layout,
    template.defaultTheme,
    ...template.tags,
    ...template.sections.flatMap((section) => [
      section.id,
      section.schemaType,
      section.component,
      section.variant,
      section.purpose ?? ''
    ])
  ];
}

function addMappedVerticalTags(tags: Set<string>, vertical: string): void {
  const normalized = normalizeToken(vertical);

  if (['dentist', 'doctor', 'medical-clinic', 'medical', 'veterinary', 'med-spa', 'medspa'].includes(normalized)) {
    tags.add('medical');
    tags.add('clinic');
    tags.add('healthcare');
    tags.add('appointments');
  }

  if (['attorney', 'lawyer', 'law-firm', 'professional-services', 'consultant', 'consulting', 'financial-advisor', 'agency'].includes(normalized)) {
    tags.add('professional-services');
    tags.add('trust');
    tags.add('consultation');
  }

  if (['restaurant', 'cafe', 'bar', 'food', 'food-hall'].includes(normalized)) {
    tags.add('restaurant');
    tags.add('hospitality');
    tags.add('food');
    tags.add('hours');
  }

  if (['hotel', 'venue', 'event-venue', 'spa', 'wellness', 'nightclub', 'retreat'].includes(normalized)) {
    tags.add('hospitality');
    tags.add('booking');
    tags.add('visual');
  }

  if (['landscaper', 'construction', 'contractor', 'hvac', 'plumber', 'home-services', 'repair'].includes(normalized)) {
    tags.add('local-business');
    tags.add('local-service');
    tags.add('services');
    tags.add('estimates');
  }

  if (['retail', 'shop', 'ecommerce', 'store', 'maker'].includes(normalized)) {
    tags.add('retail');
    tags.add('commerce');
    tags.add('product');
  }

  if (['software', 'saas', 'developer-tools', 'product'].includes(normalized)) {
    tags.add('saas');
    tags.add('product');
    tags.add('features');
  }
}

function desiredTemplateTags(summary: ContentSignalSummary, options: TemplateSelectionOptions): readonly string[] {
  const tags = new Set<string>();
  const signalIds = new Set(summary.signalIds);

  for (const vertical of summary.inventory.verticals) {
    tags.add(normalizeToken(vertical));
    addMappedVerticalTags(tags, vertical);
  }

  if (options.conversionGoal) {
    tags.add(options.conversionGoal);
  }

  if (signalIds.has('appointmentIntent')) {
    tags.add('appointments');
    tags.add('booking');
  }

  if (signalIds.has('pricingClarity') || signalIds.has('comparison')) {
    tags.add('pricing');
    tags.add('comparison');
  }

  if (signalIds.has('commerce') || signalIds.has('catalog')) {
    tags.add('commerce');
    tags.add('product');
  }

  if (signalIds.has('localDiscovery') || signalIds.has('multiLocation')) {
    tags.add('local-business');
    tags.add('locations');
    tags.add('service-area');
  }

  if (signalIds.has('editorial') || signalIds.has('resourceLibrary')) {
    tags.add('resources');
    tags.add('documentation');
    tags.add('editorial');
  }

  if (signalIds.has('imageHeavy') || signalIds.has('projectShowcase')) {
    tags.add('visual');
    tags.add('portfolio');
    tags.add('gallery');
  }

  if (signalIds.has('regulatedContent') || signalIds.has('trustCredentials')) {
    tags.add('trust');
    tags.add('regulated');
  }

  if (signalIds.has('hiring')) {
    tags.add('hiring');
    tags.add('recruiting');
  }

  if (signalIds.has('timeSensitive')) {
    tags.add('events');
    tags.add('tickets');
  }

  return uniqueSorted([...tags]);
}

function deriveCapabilityKeywords(summary: ContentSignalSummary, options: TemplateSelectionOptions): readonly string[] {
  const capabilities = new Set<string>();
  const { inventory } = summary;
  const signalIds = new Set(summary.signalIds);

  if (options.conversionGoal) {
    capabilities.add(options.conversionGoal);
  }

  if (inventory.services > 0) {
    capabilities.add('services');
    capabilities.add('service catalog');
  }

  if (inventory.locations > 1) {
    capabilities.add('locations');
    capabilities.add('directory');
    capabilities.add('service area');
  }

  if (inventory.hasBooking || inventory.hasAppointments || inventory.hasReservations || signalIds.has('appointmentIntent')) {
    capabilities.add('booking');
    capabilities.add('appointments');
    capabilities.add('conversion');
  }

  if (inventory.pricingOptions + inventory.pricingGroups + inventory.memberships + inventory.subscriptions > 0) {
    capabilities.add('pricing');
    capabilities.add('plans');
  }

  if (inventory.products + inventory.productCatalogs + inventory.menus > 0) {
    capabilities.add('commerce');
    capabilities.add('catalog');
    capabilities.add('products');
  }

  if (inventory.articles + inventory.posts + inventory.docs > 0) {
    capabilities.add('resources');
    capabilities.add('documentation');
    capabilities.add('editorial');
  }

  if (inventory.images + inventory.galleries > 0) {
    capabilities.add('gallery');
    capabilities.add('portfolio');
    capabilities.add('visual');
  }

  if (inventory.people + inventory.staff > 0) {
    capabilities.add('team');
    capabilities.add('profiles');
  }

  if (inventory.testimonials + inventory.reviews > 0) {
    capabilities.add('proof');
    capabilities.add('testimonials');
    capabilities.add('reviews');
  }

  if (inventory.faq > 0 || inventory.regulatedContent) {
    capabilities.add('faq');
    capabilities.add('trust');
  }

  if (inventory.careers > 0) {
    capabilities.add('hiring');
    capabilities.add('recruiting');
  }

  if (inventory.events + inventory.courses > 0) {
    capabilities.add('events');
    capabilities.add('schedule');
  }

  return uniqueSorted([...capabilities]);
}

function getRequestedSiteTemplate(input: GeneratorInput): string | undefined {
  if (isUniversalSite(input)) {
    return undefined;
  }

  return input.template.id ?? input.template.name;
}

function normalizeTemplateRequest(value: string | undefined): string | undefined {
  const requested = value?.trim();
  if (!requested) {
    return undefined;
  }

  if (isTemplateId(requested)) {
    return requested;
  }

  const normalized = normalizeToken(requested);
  const match = listTemplates().find((template) => normalizeToken(template.id) === normalized || normalizeToken(template.name) === normalized);
  return match?.id;
}

function getRequestedTemplate(input: GeneratorInput, options: TemplateSelectionOptions): { readonly value: string; readonly source: 'explicit' | 'site-template' } | undefined {
  if (options.templateId?.trim()) {
    return {
      value: options.templateId.trim(),
      source: 'explicit'
    };
  }

  const siteTemplate = getRequestedSiteTemplate(input);
  if (!siteTemplate?.trim()) {
    return undefined;
  }

  return {
    value: siteTemplate.trim(),
    source: 'site-template'
  };
}

function candidateTemplates(options: TemplateSelectionOptions): { readonly templates: readonly WebsiteTemplate[]; readonly cautions: readonly string[] } {
  if (!options.templateCandidates || options.templateCandidates.length === 0) {
    return {
      templates: listTemplates(),
      cautions: []
    };
  }

  const candidateIds = uniqueSorted(options.templateCandidates
    .map((candidate) => normalizeTemplateRequest(candidate))
    .filter((candidate): candidate is string => candidate !== undefined));

  if (candidateIds.length === 0) {
    return {
      templates: listTemplates(),
      cautions: ['Template candidate filter did not include registered template IDs; ranked the full registry instead.']
    };
  }

  return {
    templates: listTemplates().filter((template) => candidateIds.includes(template.id)),
    cautions: []
  };
}

function inferRouteNeeds(input: GeneratorInput, summary: ContentSignalSummary, options: TemplateSelectionOptions): readonly TemplateLayout[] {
  if (options.preferredTemplateLayout) {
    return [options.preferredTemplateLayout];
  }

  const { inventory } = summary;
  const signalIds = new Set(summary.signalIds);
  const pageCount = isUniversalSite(input) ? input.pages.length : 1;
  const layouts: TemplateLayout[] = [];

  if (inventory.locations > 1 || signalIds.has('multiLocation')) {
    layouts.push('directory-ready');
  }

  if (inventory.articles + inventory.posts + inventory.docs > 0 || signalIds.has('pageHierarchy')) {
    layouts.push('directory-ready');
    layouts.push('multi-page');
  }

  if (pageCount > 1 || inventory.services > 5 || inventory.products + inventory.productCatalogs > 5) {
    layouts.push('multi-page');
  }

  if (signalIds.has('primaryConversion') || signalIds.has('leadCapture') || inventory.hasBooking || inventory.forms > 0) {
    layouts.push('landing-page');
  }

  if (layouts.length === 0) {
    layouts.push(inventory.services <= 2 && inventory.locations <= 1 ? 'single-page' : 'landing-page');
  }

  return uniqueLayouts(layouts);
}

function hasEmergencyContact(input: GeneratorInput, summary: ContentSignalSummary): boolean {
  if (!isUniversalSite(input) && input.contact.emergencyPhone) {
    return true;
  }

  const signalIds = new Set(summary.signalIds);
  return signalIds.has('urgentNeed') || signalIds.has('timeSensitive');
}

function availableSchemaTypes(input: GeneratorInput, summary: ContentSignalSummary, routeNeeds: readonly TemplateLayout[]): ReadonlySet<string> {
  const available = new Set<string>(['hero', 'navigation', 'footer']);
  const { inventory } = summary;

  if (inventory.services + inventory.products + inventory.productCatalogs + inventory.menus + inventory.events + inventory.courses + inventory.articles + inventory.posts + inventory.docs > 0) {
    available.add('services');
  }

  if (inventory.pricingOptions + inventory.pricingGroups + inventory.memberships + inventory.subscriptions > 0) {
    available.add('pricing');
  }

  if (inventory.faq > 0 || inventory.regulatedContent) {
    available.add('faq');
  }

  if (inventory.testimonials + inventory.reviews > 0) {
    available.add('testimonials');
    available.add('reviews');
  }

  if (inventory.images + inventory.galleries > 0) {
    available.add('gallery');
  }

  if (inventory.people + inventory.staff > 0) {
    available.add('team');
  }

  if (inventory.hasHours) {
    available.add('hours');
  }

  if (inventory.contactPoints > 0 || inventory.hasAddress || inventory.hasBooking || inventory.hasAppointments || inventory.hasReservations || inventory.forms > 0) {
    available.add('contact');
  }

  if (inventory.credentials + inventory.awards + inventory.certifications > 0 || inventory.regulatedContent) {
    available.add('trustBadges');
  }

  if (hasEmergencyContact(input, summary)) {
    available.add('emergencyBanner');
  }

  if (routeNeeds.some((layout) => layout === 'multi-page' || layout === 'directory-ready')) {
    available.add('breadcrumbs');
  }

  return available;
}

function sectionHasData(section: TemplateSectionDefinition, availableTypes: ReadonlySet<string>): boolean {
  return availableTypes.has(section.schemaType) || availableTypes.has(section.id);
}

function missingRequiredSections(template: WebsiteTemplate, availableTypes: ReadonlySet<string>): readonly string[] {
  return template.sections
    .filter((section) => section.required && !sectionHasData(section, availableTypes))
    .map((section) => `${section.id}:${section.schemaType}`)
    .sort();
}

function scoreLayoutFit(layout: TemplateLayout, routeNeeds: readonly TemplateLayout[]): number {
  if (routeNeeds.includes(layout)) {
    return 1;
  }

  if (layout === 'directory-ready' && routeNeeds.includes('multi-page')) {
    return 0.8;
  }

  if (layout === 'multi-page' && routeNeeds.includes('directory-ready')) {
    return 0.65;
  }

  if (layout === 'single-page' && routeNeeds.includes('landing-page')) {
    return 0.7;
  }

  if (layout === 'landing-page' && routeNeeds.includes('single-page')) {
    return 0.7;
  }

  return 0;
}

function sectionIndex(template: WebsiteTemplate, schemaType: string): number {
  return template.sections.findIndex((section) => section.schemaType === schemaType || section.id === schemaType);
}

function scoreSectionRhythm(template: WebsiteTemplate, summary: ContentSignalSummary): { readonly score: number; readonly reasons: readonly string[]; readonly cautions: readonly string[] } {
  const reasons: string[] = [];
  const cautions: string[] = [];
  let score = 0;
  const mainSections = template.sections.filter((section) => section.slot === 'main');
  const signalIds = new Set(summary.signalIds);

  if (mainSections.length >= 5 && mainSections.length <= 10) {
    score += 0.25;
    reasons.push('uses a balanced section rhythm');
  } else if (mainSections.length < 5) {
    cautions.push('main section rhythm may be too sparse for the available content');
  } else {
    cautions.push('main section rhythm may be dense for quick prospect review');
  }

  if (mainSections.at(0)?.schemaType === 'hero') {
    score += 0.15;
  }

  const finalMainSection = mainSections.at(-1);
  if (finalMainSection && ['contact', 'booking', 'demo', 'consult', 'inquiry', 'waitlist'].includes(finalMainSection.id)) {
    score += 0.15;
    reasons.push('ends the primary story with a conversion path');
  }

  const trustIndex = sectionIndex(template, 'trustBadges');
  const servicesIndex = sectionIndex(template, 'services');
  if (signalIds.has('regulatedContent') || signalIds.has('trustCredentials')) {
    if (trustIndex >= 0 && (servicesIndex < 0 || trustIndex < servicesIndex)) {
      score += 0.15;
      reasons.push('places trust proof before detailed services');
    } else {
      cautions.push('trust-heavy content may need earlier proof placement');
    }
  }

  const galleryIndex = sectionIndex(template, 'gallery');
  if (signalIds.has('imageHeavy') || signalIds.has('projectShowcase')) {
    if (galleryIndex >= 0 && (servicesIndex < 0 || galleryIndex <= servicesIndex)) {
      score += 0.15;
      reasons.push('supports image-led storytelling early in the page');
    } else {
      cautions.push('image-heavy content may need a stronger visual showcase');
    }
  }

  const pricingIndex = sectionIndex(template, 'pricing');
  const faqIndex = sectionIndex(template, 'faq');
  if (signalIds.has('pricingClarity') || signalIds.has('comparison')) {
    if (pricingIndex >= 0 && pricingIndex > servicesIndex && (faqIndex < 0 || pricingIndex < faqIndex)) {
      score += 0.15;
      reasons.push('positions pricing after offer context and before objections');
    } else {
      cautions.push('pricing-heavy content may need a clearer offer-to-objection flow');
    }
  }

  return {
    score: normalizeScore(score),
    reasons,
    cautions
  };
}

function scoreTemplateConstraints(template: WebsiteTemplate, requiredSections: readonly string[] | undefined): { readonly score: number; readonly reasons: readonly string[]; readonly cautions: readonly string[] } {
  if (!requiredSections || requiredSections.length === 0) {
    return {
      score: 0,
      reasons: [],
      cautions: []
    };
  }

  const templateValues = new Set(template.sections.flatMap((section) => [
    normalizeToken(section.id),
    normalizeToken(section.schemaType),
    normalizeToken(section.component)
  ]));
  const required = requiredSections.map(normalizeToken);
  const matched = required.filter((section) => templateValues.has(section));
  const missing = required.filter((section) => !templateValues.has(section));

  return {
    score: matched.length / required.length,
    reasons: matched.length > 0 ? ['satisfies requested template section constraints'] : [],
    cautions: missing.map((section) => `missing requested template section constraint: ${section}`)
  };
}

function createCandidate(
  template: WebsiteTemplate,
  input: GeneratorInput,
  summary: ContentSignalSummary,
  options: TemplateSelectionOptions,
  routeNeeds: readonly TemplateLayout[],
  globalCautions: readonly string[]
): TemplateSelectionCandidate {
  const reasons: string[] = [];
  const cautions: string[] = [...globalCautions];
  const desiredTags = desiredTemplateTags(summary, options);
  const capabilities = deriveCapabilityKeywords(summary, options);
  const availableTypes = availableSchemaTypes(input, summary, routeNeeds);
  const searchValues = templateSearchValues(template);
  const matchedTags = matchedKeywords(desiredTags, searchValues);
  const matchedCapabilities = matchedKeywords(capabilities, searchValues);
  const scorableSections = template.sections.filter((section) => section.slot === 'main' && section.schemaType !== 'hero');
  const matchedSections = scorableSections
    .filter((section) => sectionHasData(section, availableTypes))
    .map((section) => section.id);
  const missingRequired = missingRequiredSections(template, availableTypes);
  const requiredSections = template.sections.filter((section) => section.required);
  const requiredCoverage = requiredSections.length === 0
    ? 1
    : (requiredSections.length - missingRequired.length) / requiredSections.length;
  const sectionCoverage = scorableSections.length === 0 ? 0 : matchedSections.length / scorableSections.length;
  const layoutFit = scoreLayoutFit(template.layout, routeNeeds);
  const verticalFit = keywordOverlap(desiredTags, searchValues);
  const capabilityFit = keywordOverlap(capabilities, searchValues);
  const rhythm = scoreSectionRhythm(template, summary);
  const constraints = scoreTemplateConstraints(template, options.requiredTemplateSections);
  let score = 0.35;

  if (verticalFit > 0) {
    score += 0.18 * verticalFit;
    reasons.push('matches vertical and audience keywords');
  }

  if (sectionCoverage > 0) {
    score += 0.18 * sectionCoverage;
    reasons.push('matches available content inventory sections');
  }

  if (layoutFit > 0) {
    score += 0.12 * layoutFit;
    reasons.push('fits inferred route structure needs');
  } else {
    cautions.push(`layout ${template.layout} does not directly match inferred route needs: ${routeNeeds.join(', ')}`);
  }

  if (capabilityFit > 0) {
    score += 0.12 * capabilityFit;
    reasons.push('aligns with conversion and capability goals');
  }

  score += 0.12 * requiredCoverage;
  if (missingRequired.length === 0) {
    reasons.push('covers required template data');
  } else {
    cautions.push(`missing data for required template sections: ${missingRequired.join(', ')}`);
  }

  score += 0.11 * rhythm.score;
  reasons.push(...rhythm.reasons);
  cautions.push(...rhythm.cautions);

  if (constraints.score > 0) {
    score += 0.1 * constraints.score;
    reasons.push(...constraints.reasons);
  }
  cautions.push(...constraints.cautions);

  if (template.id === defaultTemplateId) {
    score += 0.01;
  }

  return {
    id: template.id,
    displayName: template.name,
    audience: template.audience,
    layout: template.layout,
    defaultThemeId: template.defaultTheme,
    score: normalizeScore(score),
    reasons: reasons.length > 0 ? uniqueSorted(reasons) : ['baseline deterministic fit'],
    cautions: uniqueSorted(cautions),
    matchedTags,
    matchedSections: uniqueSorted(matchedSections),
    matchedCapabilities,
    missingRequiredSections: missingRequired,
    template
  };
}

function rankCandidates(candidates: readonly TemplateSelectionCandidate[]): readonly TemplateSelectionCandidate[] {
  return [...candidates].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    if (left.missingRequiredSections.length !== right.missingRequiredSections.length) {
      return left.missingRequiredSections.length - right.missingRequiredSections.length;
    }

    return left.displayName.localeCompare(right.displayName);
  });
}

function withSelectedCandidate(
  rankedCandidates: readonly TemplateSelectionCandidate[],
  selected: TemplateSelectionCandidate,
  limit: number
): readonly TemplateSelectionCandidate[] {
  const candidates = [
    selected,
    ...rankedCandidates.filter((candidate) => candidate.id !== selected.id)
  ];

  return candidates.slice(0, Math.max(1, limit));
}

function planSource(
  selected: TemplateSelectionCandidate,
  requested: { readonly value: string; readonly source: 'explicit' | 'site-template' } | undefined,
  requestedTemplateId: string | undefined
): TemplateResolutionPlan['source'] {
  if (requestedTemplateId && requested) {
    return requested.source;
  }

  if (selected.id === defaultTemplateId && selected.reasons.length === 1 && selected.reasons[0] === 'baseline deterministic fit') {
    return 'default';
  }

  return selected.id === defaultTemplateId && selected.score <= 0.36 ? 'default' : 'content-match';
}

export function selectTemplateForContent(
  input: GeneratorInput,
  summary: ContentSignalSummary = inferContentSignals(input, { includeLegacySections: true }),
  options: TemplateSelectionOptions = {}
): TemplateResolutionPlan {
  const requested = getRequestedTemplate(input, options);
  const requestedTemplateId = normalizeTemplateRequest(requested?.value);
  const routeNeeds = inferRouteNeeds(input, summary, options);
  const candidatePool = candidateTemplates(options);
  const rankedCandidates = rankCandidates(candidatePool.templates.map((template) => createCandidate(
    template,
    input,
    summary,
    options,
    routeNeeds,
    candidatePool.cautions
  )));
  const requestedCandidate = requestedTemplateId
    ? createCandidate(resolveTemplate(requestedTemplateId), input, summary, options, routeNeeds, candidatePool.cautions)
    : undefined;
  const selected = requestedCandidate ?? rankedCandidates[0] ?? createCandidate(resolveTemplate(), input, summary, options, routeNeeds, candidatePool.cautions);
  const requestCautions = requested && !requestedTemplateId
    ? [`Requested template "${requested.value}" is not registered; selected the highest-ranked content match instead.`]
    : [];
  const rankedTemplates = withSelectedCandidate(rankedCandidates, selected, options.templateRecommendationLimit ?? defaultRecommendationLimit);
  const source = planSource(selected, requested, requestedTemplateId);
  const basePlan = {
    resolvedTemplateId: selected.id,
    displayName: selected.displayName,
    audience: selected.audience,
    layout: selected.layout,
    defaultThemeId: selected.defaultThemeId,
    source,
    score: selected.score,
    reasons: selected.reasons,
    cautions: uniqueSorted([...selected.cautions, ...requestCautions]),
    matchedTags: selected.matchedTags,
    matchedSections: selected.matchedSections,
    matchedCapabilities: selected.matchedCapabilities,
    missingRequiredSections: selected.missingRequiredSections,
    routeNeeds,
    rankedTemplates,
    template: selected.template
  } satisfies Omit<TemplateResolutionPlan, 'requestedTemplateId'>;

  if (!requested?.value) {
    return basePlan;
  }

  return {
    ...basePlan,
    requestedTemplateId: requested.value
  };
}
