import type {
  ComponentCategoryId,
  ComponentContentSignal,
  ComponentDataRequirement,
  ComponentImplementationDescriptor,
  ComponentLayoutRole,
  ComponentThemeTrait
} from '@website-factory/components/marketplace';
import { selectComponentMarketplaceImplementations } from '@website-factory/components/marketplace';
import type { PageSeoInput } from '@website-factory/seo';
import { isUniversalSite } from './inventory.js';
import { appendLifecycleEvent, runGeneratorHooks } from './plugins.js';
import { inferSectionCandidates } from './sections.js';
import { inferContentSignals } from './signals.js';
import { selectThemeForContent } from './theme.js';
import type {
  CreateGenerationPlanOptions,
  GeneratedSectionPlan,
  GenerationDiagnostic,
  GenerationPlan,
  GenerationRoutePlan,
  GeneratorContentTypeDefinition,
  GeneratorHookContext,
  GeneratorInput,
  GeneratorPlugin,
  InferredSectionCandidate,
  OmittedSectionReason,
  SelectedComponentImplementation,
  StaticArtifactReference,
  StaticGenerationPlan,
  ThemeResolutionPlan
} from './types.js';
import { validateGenerationPlan } from './validation.js';

function unique<TValue extends string>(values: readonly TValue[]): readonly TValue[] {
  return [...new Set(values)];
}

function nonEmpty<TValue>(value: TValue | undefined): value is TValue {
  return value !== undefined;
}

function createDiagnostic(code: string, severity: GenerationDiagnostic['severity'], message: string, source: string): GenerationDiagnostic {
  return {
    code,
    severity,
    message,
    source,
    path: []
  };
}

function normalizePath(path: string): string {
  const normalized = path.trim();
  if (normalized.length === 0 || normalized === '/') {
    return '/';
  }

  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function joinRoutePath(basePath: string | undefined, routePath: string): string {
  const normalizedRoute = normalizePath(routePath);
  if (!basePath || basePath === '/') {
    return normalizedRoute;
  }

  const normalizedBase = normalizePath(basePath).replace(/\/$/, '');
  return normalizedRoute === '/' ? `${normalizedBase}/` : `${normalizedBase}${normalizedRoute}`;
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug.length > 0 ? slug : 'site';
}

function matchedValues<TValue extends string>(available: readonly TValue[], requested: readonly TValue[]): readonly TValue[] {
  return available.filter((value) => requested.includes(value));
}

function createSelectedImplementation(
  descriptor: ComponentImplementationDescriptor,
  requestedSignals: readonly ComponentContentSignal[],
  requestedThemeTraits: readonly ComponentThemeTrait[]
): SelectedComponentImplementation {
  const baseImplementation = {
    id: descriptor.id,
    categoryId: descriptor.categoryId,
    variantId: descriptor.variantId,
    label: descriptor.label,
    implementationType: descriptor.implementationType,
    matchedSignals: matchedValues(descriptor.contentSignals, requestedSignals),
    matchedThemeTraits: matchedValues(descriptor.themeTraits, requestedThemeTraits),
    dataRequirements: descriptor.dataRequirements,
    descriptor
  } satisfies Omit<SelectedComponentImplementation, 'componentName'>;

  if (!descriptor.componentName) {
    return baseImplementation;
  }

  return {
    ...baseImplementation,
    componentName: descriptor.componentName
  };
}

function createOmitted(candidate: InferredSectionCandidate, reasonCode: OmittedSectionReason['reasonCode'], message: string): OmittedSectionReason {
  return {
    candidateId: candidate.id,
    label: candidate.label,
    reasonCode,
    message,
    sources: candidate.sources,
    diagnostics: [
      createDiagnostic(`generator.omit.${candidate.id}.${reasonCode}`, reasonCode === 'no-component-implementation' ? 'warning' : 'info', message, candidate.sources[0] ?? 'generator')
    ]
  };
}

function selectSectionImplementation(
  candidate: InferredSectionCandidate,
  globalSignals: readonly ComponentContentSignal[],
  theme: ThemeResolutionPlan
): GeneratedSectionPlan | OmittedSectionReason {
  if (!candidate.categoryId) {
    return createOmitted(candidate, 'unsupported-category', `${candidate.label} was omitted because it does not map to a marketplace component category.`);
  }

  const requestedSignals = unique([...candidate.contentSignals, ...globalSignals]);
  const implementations = selectComponentMarketplaceImplementations({
    categoryId: candidate.categoryId,
    contentSignals: requestedSignals,
    themeTraits: theme.traits,
    layoutRoles: candidate.layoutRoles,
    limit: 1
  });
  const descriptor = implementations[0];

  if (!descriptor) {
    return createOmitted(candidate, 'no-component-implementation', `${candidate.label} was omitted because no marketplace implementation matched its content signals and theme traits.`);
  }

  const selectedImplementation = createSelectedImplementation(descriptor, requestedSignals, theme.traits);

  return {
    id: candidate.id,
    label: candidate.label,
    categoryId: candidate.categoryId,
    reason: candidate.reason,
    sources: candidate.sources,
    confidence: candidate.confidence,
    contentSignals: candidate.contentSignals,
    layoutRoles: candidate.layoutRoles,
    dataRequirements: candidate.dataRequirements,
    selectedImplementation
  };
}

function inferSelectedSections(
  candidates: readonly InferredSectionCandidate[],
  globalSignals: readonly ComponentContentSignal[],
  theme: ThemeResolutionPlan
): { readonly sections: readonly GeneratedSectionPlan[]; readonly omittedSections: readonly OmittedSectionReason[] } {
  const sections: GeneratedSectionPlan[] = [];
  const omittedSections: OmittedSectionReason[] = [];

  for (const candidate of candidates) {
    const result = selectSectionImplementation(candidate, globalSignals, theme);
    if ('selectedImplementation' in result) {
      sections.push(result);
    } else {
      omittedSections.push(result);
    }
  }

  return {
    sections,
    omittedSections
  };
}

function pageArtifacts(path: string): readonly StaticArtifactReference[] {
  const basePath = path === '/' ? '/index' : path.replace(/\/$/, '');
  return [
    {
      kind: 'page-html',
      path: `${basePath}.html`,
      source: 'generator.static.routes'
    },
    {
      kind: 'metadata',
      path: `${basePath}.metadata.json`,
      source: 'generator.static.seo'
    },
    {
      kind: 'json-ld',
      path: `${basePath}.jsonld.json`,
      source: 'generator.static.seo'
    }
  ];
}

function getRouteSections(sectionIds: readonly string[], allSections: readonly GeneratedSectionPlan[]): readonly string[] {
  if (sectionIds.length === 0) {
    return allSections.map((section) => section.id);
  }

  const allowed = new Set(sectionIds.map((id) => id.toLowerCase()));
  const matched = allSections
    .filter((section) => allowed.has(section.id.toLowerCase()) || allowed.has(section.categoryId.toLowerCase()))
    .map((section) => section.id);

  return matched.length > 0 ? matched : allSections.map((section) => section.id);
}

function universalPageSeo(input: Extract<GeneratorInput, { readonly slug: string }>, path: string): PageSeoInput {
  const seo: PageSeoInput = {
    title: input.seo.title,
    description: input.seo.description,
    path
  };

  if (!input.seo.canonicalPath) {
    return seo;
  }

  return {
    ...seo,
    canonicalUrl: input.seo.canonicalPath
  };
}

function websitePageSeo(input: Exclude<GeneratorInput, { readonly slug: string }>, path: string): PageSeoInput {
  const title = input.seo.title ?? input.business.name;
  const description = input.seo.description ?? input.business.description ?? input.business.tagline ?? `${input.business.name} website`;
  const seo: PageSeoInput = {
    title,
    description,
    path
  };

  if (!input.seo.canonicalUrl) {
    return seo;
  }

  return {
    ...seo,
    canonicalUrl: input.seo.canonicalUrl
  };
}

function createRoutes(
  input: GeneratorInput,
  sections: readonly GeneratedSectionPlan[],
  routeBasePath: string | undefined
): readonly GenerationRoutePlan[] {
  if (isUniversalSite(input)) {
    return input.pages.map((page) => {
      const path = joinRoutePath(routeBasePath, page.path);
      return {
        id: slugify(`${input.slug}-${page.path}`),
        path,
        template: page.template,
        sectionIds: getRouteSections(page.sections, sections),
        seo: universalPageSeo(input, path),
        artifacts: pageArtifacts(path)
      };
    });
  }

  const path = joinRoutePath(routeBasePath, '/');
  return [
    {
      id: slugify(input.business.name),
      path,
      template: input.template.id ?? input.template.name ?? 'landing',
      sectionIds: sections.map((section) => section.id),
      seo: websitePageSeo(input, path),
      artifacts: pageArtifacts(path)
    }
  ];
}

function createGlobalArtifacts(planSlug: string, hasImages: boolean, hasEditorial: boolean): readonly StaticArtifactReference[] {
  const artifacts: StaticArtifactReference[] = [
    {
      kind: 'sitemap',
      path: 'sitemap.xml',
      source: `generation-plans.${planSlug}.seo`
    },
    {
      kind: 'robots',
      path: 'robots.txt',
      source: `generation-plans.${planSlug}.seo`
    },
    {
      kind: 'llms-txt',
      path: 'llms.txt',
      source: `generation-plans.${planSlug}.seo`
    }
  ];

  if (hasImages) {
    artifacts.push({
      kind: 'image-sitemap',
      path: 'image-sitemap.xml',
      source: `generation-plans.${planSlug}.seo`
    });
  }

  if (hasEditorial) {
    artifacts.push({
      kind: 'rss',
      path: 'rss.xml',
      source: `generation-plans.${planSlug}.seo`
    });
  }

  return artifacts;
}

function createStaticGenerationPlan(
  input: GeneratorInput,
  sections: readonly GeneratedSectionPlan[],
  options: CreateGenerationPlanOptions,
  planSlug: string
): StaticGenerationPlan {
  const routes = createRoutes(input, sections, options.routeBasePath);
  const summary = sections.flatMap((section) => section.contentSignals);
  const hasImages = summary.includes('imageHeavy') || summary.includes('mediaAvailable');
  const hasEditorial = summary.includes('editorial') || summary.includes('articleList');

  return {
    outputFormat: 'static-html',
    routes,
    globalArtifacts: createGlobalArtifacts(planSlug, hasImages, hasEditorial),
    seoArtifactOptions: options.seoArtifactOptions ?? {}
  };
}

function collectPluginContentTypes(plugins: readonly GeneratorPlugin[], options: CreateGenerationPlanOptions): readonly GeneratorContentTypeDefinition[] {
  return [
    ...(options.customContentTypes ?? []),
    ...plugins.flatMap((plugin) => plugin.contentTypes ?? [])
  ];
}

function collectValidators(plugins: readonly GeneratorPlugin[], options: CreateGenerationPlanOptions) {
  return [
    ...(options.validators ?? []),
    ...plugins.flatMap((plugin) => plugin.validators ?? [])
  ];
}

function sectionInferenceOptions(
  customContentTypes: readonly GeneratorContentTypeDefinition[],
  supportedCategories: readonly ComponentCategoryId[] | undefined
) {
  const baseOptions = {
    customContentTypes
  };

  if (!supportedCategories) {
    return baseOptions;
  }

  return {
    ...baseOptions,
    supportedCategories
  };
}

function mergeDiagnostics(...diagnosticGroups: readonly (readonly GenerationDiagnostic[] | undefined)[]): readonly GenerationDiagnostic[] {
  return diagnosticGroups.filter(nonEmpty).flatMap((diagnostics) => diagnostics);
}

export function createGenerationPlan(input: GeneratorInput, options: CreateGenerationPlanOptions = {}): GenerationPlan {
  const plugins = options.plugins ?? [];
  const customContentTypes = collectPluginContentTypes(plugins, options);
  const validators = collectValidators(plugins, options);
  let context: GeneratorHookContext = {
    input,
    diagnostics: [],
    lifecycleEvents: appendLifecycleEvent([], 'generator:init', 'Initialized schema-driven static generation planning.')
  };
  context = runGeneratorHooks('generator:init', context, plugins);

  const inferredContent = context.content ?? inferContentSignals(input, { includeLegacySections: true });
  context = {
    ...context,
    content: inferredContent,
    diagnostics: mergeDiagnostics(context.diagnostics, inferredContent.diagnostics),
    lifecycleEvents: appendLifecycleEvent(context.lifecycleEvents, 'content:signals:inferred', `Inferred ${inferredContent.signals.length} content signals.`)
  };
  context = runGeneratorHooks('content:signals:inferred', context, plugins);
  const content = context.content ?? inferredContent;

  const inferredSections = context.sectionInference ?? inferSectionCandidates(input, content, sectionInferenceOptions(customContentTypes, options.supportedCategories));
  context = {
    ...context,
    sectionInference: inferredSections,
    diagnostics: mergeDiagnostics(context.diagnostics, inferredSections.diagnostics, inferredSections.omittedSections.flatMap((section) => section.diagnostics)),
    lifecycleEvents: appendLifecycleEvent(context.lifecycleEvents, 'sections:inferred', `Inferred ${inferredSections.candidates.length} section candidates.`)
  };
  context = runGeneratorHooks('sections:inferred', context, plugins);
  const sectionInference = context.sectionInference ?? inferredSections;

  const inferredTheme = context.theme ?? selectThemeForContent(input, content, options);
  context = {
    ...context,
    theme: inferredTheme,
    lifecycleEvents: appendLifecycleEvent(context.lifecycleEvents, 'theme:resolved', `Resolved theme ${inferredTheme.resolvedThemeId} with ${inferredTheme.traits.length} traits.`)
  };
  context = runGeneratorHooks('theme:resolved', context, plugins);
  const theme = context.theme ?? inferredTheme;

  const selected = inferSelectedSections(sectionInference.candidates, content.signalIds, theme);
  const componentDiagnostics = selected.omittedSections.flatMap((section) => section.diagnostics);
  context = {
    ...context,
    diagnostics: mergeDiagnostics(context.diagnostics, componentDiagnostics),
    lifecycleEvents: appendLifecycleEvent(context.lifecycleEvents, 'components:selected', `Selected ${selected.sections.length} component implementations.`)
  };
  context = runGeneratorHooks('components:selected', context, plugins);

  const allOmittedSections = [
    ...sectionInference.omittedSections,
    ...selected.omittedSections
  ];
  const planSlug = content.inventory.slug;
  const staticPlan = createStaticGenerationPlan(input, selected.sections, options, planSlug);
  const plan: GenerationPlan = {
    id: `generation-${planSlug}`,
    inputKind: content.inventory.inputKind,
    businessName: content.inventory.businessName,
    slug: planSlug,
    verticals: content.inventory.verticals,
    content,
    theme,
    sections: selected.sections,
    omittedSections: allOmittedSections,
    diagnostics: context.diagnostics,
    staticPlan,
    lifecycleEvents: appendLifecycleEvent(context.lifecycleEvents, 'plan:created', `Created static generation plan with ${staticPlan.routes.length} routes.`)
  };

  context = runGeneratorHooks('plan:created', { ...context, plan }, plugins);
  const createdPlan = context.plan ?? plan;
  const validation = validateGenerationPlan(createdPlan, validators);
  const finalPlan = {
    ...createdPlan,
    diagnostics: mergeDiagnostics(createdPlan.diagnostics, validation.diagnostics),
    lifecycleEvents: appendLifecycleEvent(createdPlan.lifecycleEvents, 'plan:validated', validation.valid ? 'Generation plan validation passed.' : 'Generation plan validation reported errors.')
  };
  const finalContext = runGeneratorHooks('plan:validated', { ...context, plan: finalPlan }, plugins);

  return finalContext.plan ?? finalPlan;
}
