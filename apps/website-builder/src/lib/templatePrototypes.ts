import { listTemplates, type TemplateAudience, type TemplateLayout, type TemplateSectionDefinition, type TemplateSlot, type WebsiteTemplate } from '@website-factory/templates';
import { resolveTheme, themeClassNames, themeCssText, type FooterTokens, type HeroTokens, type NavigationTokens, type ThemeMode } from '@website-factory/themes';

export interface TemplatePrototypeMetaItem {
  readonly term: string;
  readonly description: string;
}

export interface TemplatePrototypeDetail {
  readonly title: string;
  readonly body: string;
}

export interface TemplatePrototypeNavItem {
  readonly label: string;
  readonly href: string;
}

export interface TemplatePrototypeTheme {
  readonly id: string;
  readonly displayName: string;
  readonly mode: ThemeMode;
  readonly cssText: string;
  readonly classNames: readonly string[];
}

export interface TemplatePrototypeSection {
  readonly id: string;
  readonly fragmentId: string;
  readonly schemaTypeClassName: string;
  readonly componentClassName: string;
  readonly heading: string;
  readonly eyebrow: string;
  readonly purposeLabel: string;
  readonly purpose: string;
  readonly schemaType: string;
  readonly componentLabel: string;
  readonly slot: TemplateSlot;
  readonly slotLabel: string;
  readonly required: boolean;
  readonly requirementLabel: string;
  readonly visualLabel: string;
  readonly previewItems: readonly string[];
  readonly details: readonly TemplatePrototypeDetail[];
  readonly meta: readonly TemplatePrototypeMetaItem[];
}

export interface TemplatePrototypeVisual {
  readonly audience: TemplateAudience;
  readonly layout: TemplateLayout;
  readonly heroLayout: HeroTokens['layout'];
  readonly mediaShape: HeroTokens['mediaShape'];
  readonly navigationLayout: NavigationTokens['layout'];
  readonly navigationIndicator: NavigationTokens['activeIndicator'];
  readonly footerLayout: FooterTokens['layout'];
  readonly footerDensity: FooterTokens['density'];
  readonly requiredRatio: number;
}

export interface TemplatePrototype {
  readonly id: string;
  readonly name: string;
  readonly brandName: string;
  readonly canonicalPath: string;
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly eyebrow: string;
  readonly heroTitle: string;
  readonly heroLead: string;
  readonly audienceLabel: string;
  readonly layoutLabel: string;
  readonly rhythmLabel: string;
  readonly theme: TemplatePrototypeTheme;
  readonly visual: TemplatePrototypeVisual;
  readonly tags: readonly string[];
  readonly sections: readonly TemplatePrototypeSection[];
  readonly navItems: readonly TemplatePrototypeNavItem[];
  readonly metrics: readonly TemplatePrototypeMetaItem[];
  readonly requiredSectionCount: number;
  readonly optionalSectionCount: number;
}

const slotLabels = {
  header: 'Header',
  main: 'Main content',
  footer: 'Footer',
  utility: 'Utility'
} as const satisfies Record<TemplateSlot, string>;

const layoutLabels = {
  'single-page': 'Single-page',
  'multi-page': 'Multi-page',
  'landing-page': 'Landing page',
  'directory-ready': 'Directory-ready'
} as const satisfies Record<TemplateLayout, string>;

const defaultPurposeBySchemaType: Readonly<Record<string, string>> = {
  breadcrumbs: 'Keeps deeper pages oriented by showing where the visitor is in the site structure.',
  contact: 'Turns interest into a call, form submission, booking, visit, or other conversion action.',
  emergencyBanner: 'Surfaces urgent contact details and immediate response messaging before the main page flow.',
  faq: 'Answers common objections so visitors can keep moving toward a decision.',
  footer: 'Closes the page with durable navigation, business details, and trust reinforcement.',
  gallery: 'Uses visual proof to show the atmosphere, work quality, menu, venue, product, or experience.',
  hero: 'Introduces the core promise, strongest proof point, and primary action for the page.',
  hours: 'Clarifies availability, appointment windows, and practical visit or contact timing.',
  navigation: 'Helps visitors understand the brand, scan destinations, and reach the primary action quickly.',
  pricing: 'Frames packages, tiers, or investment ranges so visitors can self-select next steps.',
  reviews: 'Adds third-party proof through review-style social validation.',
  services: 'Explains the main offerings and gives visitors clear paths into the right service.',
  team: 'Builds trust by introducing providers, staff, experts, or brand principals.',
  testimonials: 'Adds first-person proof that supports the promise and reduces hesitation.',
  trustBadges: 'Highlights credentials, outcomes, guarantees, affiliations, or confidence markers.'
};

function humanize(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .toLowerCase();
}

function titleCase(value: string): string {
  return humanize(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function sentenceCase(value: string): string {
  const readable = humanize(value);
  return readable.length > 0 ? `${readable.charAt(0).toUpperCase()}${readable.slice(1)}` : value;
}

function fragmentId(sectionId: string): string {
  return `section-${humanize(sectionId).replace(/\s+/g, '-')}`;
}

function classFragment(value: string): string {
  const fragment = humanize(value).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return fragment.length > 0 ? fragment : 'item';
}

function templatePrototypePath(templateId: string): string {
  return `/templates/${templateId}/`;
}

function sectionHeading(definition: TemplateSectionDefinition): string {
  const baseLabel = titleCase(definition.id === definition.schemaType ? definition.schemaType : definition.id);
  return `${baseLabel} ${definition.required ? 'anchor' : 'support'}`;
}

function sectionPurpose(definition: TemplateSectionDefinition, template: WebsiteTemplate): string {
  return definition.purpose ?? defaultPurposeBySchemaType[definition.schemaType] ?? `${sentenceCase(definition.schemaType)} content supports the ${humanize(template.audience)} audience within this ${humanize(template.layout)} rhythm.`;
}

function visitorOutcome(definition: TemplateSectionDefinition, template: WebsiteTemplate): string {
  switch (definition.schemaType) {
    case 'navigation':
      return 'Visitors can scan the site structure, understand the brand, and reach the primary action from any viewport.';
    case 'hero':
      return `Visitors immediately see why this ${humanize(template.audience)} experience exists and what to do next.`;
    case 'services':
      return 'Visitors compare the primary offers and choose the path that best matches their need.';
    case 'testimonials':
    case 'reviews':
      return 'Visitors see credible proof that reinforces the promise made earlier in the page.';
    case 'contact':
      return 'Visitors have a clear final step to call, book, request a quote, or send an inquiry.';
    case 'footer':
      return 'Visitors can still find key links, business facts, and contact paths after the main story ends.';
    case 'emergencyBanner':
      return 'Urgent visitors get the fastest path to response before reading the rest of the page.';
    default:
      return `Visitors get a focused ${humanize(definition.schemaType)} moment that supports the surrounding section rhythm.`;
  }
}

function contentPattern(definition: TemplateSectionDefinition): string {
  const repeatableText = definition.repeatable ? ' It can repeat when the content source has multiple matching entries.' : '';
  const acceptedVariants = definition.acceptsSchemaVariants ? ` It also accepts ${definition.acceptsSchemaVariants.map(sentenceCase).join(', ')} schema variants.` : '';

  return `${definition.component} renders the ${sentenceCase(definition.schemaType)} schema with the ${definition.variant} variant in the ${slotLabels[definition.slot].toLowerCase()} slot.${repeatableText}${acceptedVariants}`;
}

function requirementBody(definition: TemplateSectionDefinition): string {
  if (definition.required) {
    return 'This section is required for the template to preserve its intended information architecture and conversion flow.';
  }

  return 'This optional section enriches the page when matching content exists, without blocking the template from rendering.';
}

function sectionPreviewItems(definition: TemplateSectionDefinition): readonly string[] {
  switch (definition.schemaType) {
    case 'breadcrumbs':
      return ['Parent page', 'Current page', 'Context trail'];
    case 'contact':
      return ['Inquiry path', 'Phone detail', 'Location cue'];
    case 'emergencyBanner':
      return ['Urgent CTA', 'Response detail', 'Phone action'];
    case 'faq':
      return ['Question', 'Answer', 'Objection'];
    case 'footer':
      return ['Durable links', 'Business facts', 'Final CTA'];
    case 'gallery':
      return ['Feature image', 'Detail image', 'Visual proof'];
    case 'hero':
      return ['Promise', 'Proof badge', 'Primary action'];
    case 'hours':
      return ['Today', 'Availability', 'Visit detail'];
    case 'navigation':
      return ['Brand mark', 'Primary links', 'CTA'];
    case 'pricing':
      return ['Offer tier', 'Package detail', 'Decision CTA'];
    case 'reviews':
    case 'testimonials':
      return ['Quote', 'Rating', 'Outcome'];
    case 'services':
      return definition.repeatable ? ['Offer path', 'Repeatable card', 'Comparison cue'] : ['Offer path', 'Detail card', 'Support copy'];
    case 'team':
      return ['Profile', 'Credential', 'Trust cue'];
    case 'trustBadges':
      return ['Credential', 'Metric', 'Affiliation'];
    default:
      return [`${titleCase(definition.schemaType)} block`, `${titleCase(definition.variant)} variant`, definition.required ? 'Required role' : 'Optional support'];
  }
}

function sectionVisualLabel(definition: TemplateSectionDefinition): string {
  return `${sentenceCase(definition.schemaType)} ${definition.variant} preview`;
}

function sectionDetails(definition: TemplateSectionDefinition, template: WebsiteTemplate): readonly TemplatePrototypeDetail[] {
  return [
    {
      title: 'Visitor outcome',
      body: visitorOutcome(definition, template)
    },
    {
      title: 'Content pattern',
      body: contentPattern(definition)
    },
    {
      title: definition.required ? 'Required role' : 'Optional role',
      body: requirementBody(definition)
    }
  ];
}

function sectionMeta(definition: TemplateSectionDefinition): readonly TemplatePrototypeMetaItem[] {
  const meta: TemplatePrototypeMetaItem[] = [
    {
      term: 'Schema type',
      description: definition.schemaType
    },
    {
      term: 'Component / variant',
      description: `${definition.component} / ${definition.variant}`
    },
    {
      term: 'Requirement',
      description: definition.required ? 'Required' : 'Optional'
    },
    {
      term: 'Slot',
      description: slotLabels[definition.slot]
    }
  ];

  if (definition.purpose) {
    meta.push({
      term: 'Purpose',
      description: definition.purpose
    });
  }

  if (definition.repeatable) {
    meta.push({
      term: 'Repeatable',
      description: 'Yes'
    });
  }

  if (definition.acceptsSchemaVariants) {
    meta.push({
      term: 'Accepts variants',
      description: definition.acceptsSchemaVariants.join(', ')
    });
  }

  return meta;
}

function createPrototypeSection(definition: TemplateSectionDefinition, template: WebsiteTemplate): TemplatePrototypeSection {
  const purpose = sectionPurpose(definition, template);

  return {
    id: definition.id,
    fragmentId: fragmentId(definition.id),
    schemaTypeClassName: classFragment(definition.schemaType),
    componentClassName: classFragment(definition.component),
    heading: sectionHeading(definition),
    eyebrow: `${slotLabels[definition.slot]} · order ${definition.order}`,
    purposeLabel: definition.purpose ? 'Template purpose' : 'Prototype purpose',
    purpose,
    schemaType: definition.schemaType,
    componentLabel: `${definition.component} / ${definition.variant}`,
    slot: definition.slot,
    slotLabel: slotLabels[definition.slot],
    required: definition.required,
    requirementLabel: definition.required ? 'Required' : 'Optional',
    visualLabel: sectionVisualLabel(definition),
    previewItems: sectionPreviewItems(definition),
    details: sectionDetails(definition, template),
    meta: sectionMeta(definition)
  };
}

function createNavItems(sections: readonly TemplatePrototypeSection[]): readonly TemplatePrototypeNavItem[] {
  const mainSections = sections.filter((section) => section.slotLabel === slotLabels.main && section.schemaType !== 'hero' && section.schemaType !== 'contact');
  const navSections = mainSections.length > 0 ? mainSections : sections;

  return navSections.slice(0, 5).map((section) => ({
    label: titleCase(section.id),
    href: `#${section.fragmentId}`
  }));
}

function createRhythmLabel(template: WebsiteTemplate, sections: readonly TemplatePrototypeSection[]): string {
  const requiredSectionCount = sections.filter((section) => section.required).length;

  return [
    `${template.name} section rhythm preview`,
    `${sections.length} total sections`,
    `${requiredSectionCount} required`,
    `order: ${sections.map((section) => section.schemaType).join(', ')}`
  ].join('; ');
}

function createVisualMetadata(template: WebsiteTemplate, sections: readonly TemplatePrototypeSection[], requiredSectionCount: number, theme: ReturnType<typeof resolveTheme>): TemplatePrototypeVisual {
  return {
    audience: template.audience,
    layout: template.layout,
    heroLayout: theme.tokens.hero.layout,
    mediaShape: theme.tokens.hero.mediaShape,
    navigationLayout: theme.tokens.navigation.layout,
    navigationIndicator: theme.tokens.navigation.activeIndicator,
    footerLayout: theme.tokens.footer.layout,
    footerDensity: theme.tokens.footer.density,
    requiredRatio: sections.length > 0 ? requiredSectionCount / sections.length : 0
  };
}

function dedupeTemplatePrototypes(prototypes: readonly TemplatePrototype[]): readonly TemplatePrototype[] {
  const prototypesByPath = new Map<string, TemplatePrototype>();

  for (const prototype of prototypes) {
    const existingPrototype = prototypesByPath.get(prototype.canonicalPath);

    if (!existingPrototype) {
      prototypesByPath.set(prototype.canonicalPath, prototype);
      continue;
    }

    if (JSON.stringify(existingPrototype) !== JSON.stringify(prototype)) {
      throw new Error(`Duplicate template prototype route ${prototype.canonicalPath} has conflicting metadata.`);
    }
  }

  return [...prototypesByPath.values()];
}

export function createTemplatePrototype(template: WebsiteTemplate): TemplatePrototype {
  const theme = resolveTheme(template.defaultTheme);
  const themeMode = theme.defaultMode;
  const sections = template.sections.map((definition) => createPrototypeSection(definition, template));
  const requiredSectionCount = sections.filter((section) => section.required).length;
  const optionalSectionCount = sections.length - requiredSectionCount;
  const audienceLabel = titleCase(template.audience);
  const layoutLabel = layoutLabels[template.layout];
  const visual = createVisualMetadata(template, sections, requiredSectionCount, theme);

  return {
    id: template.id,
    name: template.name,
    brandName: `${template.name} prototype`,
    canonicalPath: templatePrototypePath(template.id),
    pageTitle: `${template.name} template prototype | Website Factory`,
    pageDescription: `${template.description} Preview the ${template.name} section rhythm and default ${theme.displayName} theme.`,
    eyebrow: `${audienceLabel} · ${layoutLabel}`,
    heroTitle: `${template.name} website prototype`,
    heroLead: template.description,
    audienceLabel,
    layoutLabel,
    rhythmLabel: createRhythmLabel(template, sections),
    theme: {
      id: theme.id,
      displayName: theme.displayName,
      mode: themeMode,
      cssText: themeCssText(theme, themeMode),
      classNames: themeClassNames(theme, themeMode)
    },
    visual,
    tags: template.tags,
    sections,
    navItems: createNavItems(sections),
    metrics: [
      {
        term: 'Default theme',
        description: theme.displayName
      },
      {
        term: 'Theme mode',
        description: themeMode
      },
      {
        term: 'Layout',
        description: layoutLabel
      },
      {
        term: 'Required sections',
        description: String(requiredSectionCount)
      },
      {
        term: 'Optional sections',
        description: String(optionalSectionCount)
      },
      {
        term: 'Total sections',
        description: String(sections.length)
      }
    ],
    requiredSectionCount,
    optionalSectionCount
  };
}

export function getTemplatePrototypes(): readonly TemplatePrototype[] {
  return dedupeTemplatePrototypes(listTemplates().map(createTemplatePrototype));
}
