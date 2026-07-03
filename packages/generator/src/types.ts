import type {
  ComponentCategoryId,
  ComponentContentSignal,
  ComponentDataRequirement,
  ComponentImplementationDescriptor,
  ComponentImplementationType,
  ComponentLayoutRole,
  ComponentThemeTrait
} from '@website-factory/components/marketplace';
import type { PageSeoInput, SeoArtifactOptions } from '@website-factory/seo';
import type { UniversalContentV2, UniversalSite, WebsiteData } from '@website-factory/schema';
import type { ThemeMode, WebsiteTheme } from '@website-factory/themes';

export type GeneratorInput = WebsiteData | UniversalSite;
export type GeneratorInputKind = 'universal-site' | 'website-data';
export type GenerationDiagnosticSeverity = 'info' | 'warning' | 'error';
export type GenerationSignalStrength = 'weak' | 'medium' | 'strong';

export interface GenerationDiagnostic {
  readonly code: string;
  readonly severity: GenerationDiagnosticSeverity;
  readonly message: string;
  readonly source: string;
  readonly path: readonly string[];
}

export interface ContentInventory {
  readonly inputKind: GeneratorInputKind;
  readonly businessName: string;
  readonly slug: string;
  readonly verticals: readonly string[];
  readonly services: number;
  readonly products: number;
  readonly productCatalogs: number;
  readonly pricingOptions: number;
  readonly pricingGroups: number;
  readonly memberships: number;
  readonly subscriptions: number;
  readonly people: number;
  readonly staff: number;
  readonly testimonials: number;
  readonly reviews: number;
  readonly faq: number;
  readonly locations: number;
  readonly contactPoints: number;
  readonly socialLinks: number;
  readonly hasAddress: boolean;
  readonly hasHours: boolean;
  readonly hasBooking: boolean;
  readonly hasAppointments: boolean;
  readonly hasReservations: boolean;
  readonly forms: number;
  readonly awards: number;
  readonly certifications: number;
  readonly credentials: number;
  readonly mediaAssets: number;
  readonly images: number;
  readonly videos: number;
  readonly galleries: number;
  readonly articles: number;
  readonly posts: number;
  readonly docs: number;
  readonly events: number;
  readonly courses: number;
  readonly menus: number;
  readonly careers: number;
  readonly legalNotices: number;
  readonly regulatedContent: boolean;
}

export interface GenerationContentSignal {
  readonly id: ComponentContentSignal;
  readonly strength: GenerationSignalStrength;
  readonly score: number;
  readonly sources: readonly string[];
  readonly reasons: readonly string[];
}

export interface ContentSignalSummary {
  readonly inventory: ContentInventory;
  readonly signals: readonly GenerationContentSignal[];
  readonly signalIds: readonly ComponentContentSignal[];
  readonly diagnostics: readonly GenerationDiagnostic[];
}

export interface InferContentSignalsOptions {
  readonly includeLegacySections?: boolean;
}

export type SectionCandidateKind = 'component-category' | 'unsupported-intent' | 'custom-content-type';

export interface InferredSectionCandidate {
  readonly id: string;
  readonly kind: SectionCandidateKind;
  readonly label: string;
  readonly reason: string;
  readonly sources: readonly string[];
  readonly confidence: number;
  readonly contentSignals: readonly ComponentContentSignal[];
  readonly categoryId?: ComponentCategoryId;
  readonly layoutRoles: readonly ComponentLayoutRole[];
  readonly dataRequirements: readonly ComponentDataRequirement[];
  readonly customTypeId?: string;
}

export type OmittedSectionReasonCode =
  | 'missing-data'
  | 'unsupported-category'
  | 'no-component-implementation'
  | 'plugin-omitted'
  | 'validation-failed';

export interface OmittedSectionReason {
  readonly candidateId: string;
  readonly label: string;
  readonly reasonCode: OmittedSectionReasonCode;
  readonly message: string;
  readonly sources: readonly string[];
  readonly diagnostics: readonly GenerationDiagnostic[];
}

export interface SectionInferenceResult {
  readonly candidates: readonly InferredSectionCandidate[];
  readonly omittedSections: readonly OmittedSectionReason[];
  readonly diagnostics: readonly GenerationDiagnostic[];
}

export interface GeneratorContentTypeDefinition {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly categoryId?: ComponentCategoryId;
  readonly contentSignals: readonly ComponentContentSignal[];
  readonly layoutRoles?: readonly ComponentLayoutRole[];
  readonly dataRequirements?: readonly ComponentDataRequirement[];
  readonly detect: (input: GeneratorInput, summary: ContentSignalSummary) => boolean;
}

export interface InferSectionCandidatesOptions {
  readonly customContentTypes?: readonly GeneratorContentTypeDefinition[];
  readonly supportedCategories?: readonly ComponentCategoryId[];
}

export interface ThemeSelectionOptions {
  readonly themeName?: string;
  readonly mode?: ThemeMode;
}

export interface ThemeResolutionPlan {
  readonly requestedThemeId?: string;
  readonly resolvedThemeId: string;
  readonly displayName: string;
  readonly mode: ThemeMode;
  readonly traits: readonly ComponentThemeTrait[];
  readonly matchedTags: readonly string[];
  readonly source: 'explicit' | 'site-theme' | 'content-match' | 'default';
  readonly theme: WebsiteTheme;
}

export interface SelectedComponentImplementation {
  readonly id: string;
  readonly categoryId: ComponentCategoryId;
  readonly variantId: string;
  readonly label: string;
  readonly implementationType: ComponentImplementationType;
  readonly componentName?: ComponentImplementationDescriptor['componentName'];
  readonly matchedSignals: readonly ComponentContentSignal[];
  readonly matchedThemeTraits: readonly ComponentThemeTrait[];
  readonly dataRequirements: readonly ComponentDataRequirement[];
  readonly descriptor: ComponentImplementationDescriptor;
}

export interface GeneratedSectionPlan {
  readonly id: string;
  readonly label: string;
  readonly categoryId: ComponentCategoryId;
  readonly reason: string;
  readonly sources: readonly string[];
  readonly confidence: number;
  readonly contentSignals: readonly ComponentContentSignal[];
  readonly layoutRoles: readonly ComponentLayoutRole[];
  readonly dataRequirements: readonly ComponentDataRequirement[];
  readonly selectedImplementation: SelectedComponentImplementation;
}

export type StaticArtifactKind =
  | 'page-html'
  | 'metadata'
  | 'json-ld'
  | 'sitemap'
  | 'robots'
  | 'rss'
  | 'llms-txt'
  | 'image-sitemap';

export interface StaticArtifactReference {
  readonly kind: StaticArtifactKind;
  readonly path: string;
  readonly source: string;
}

export interface GenerationRoutePlan {
  readonly id: string;
  readonly path: string;
  readonly template: string;
  readonly sectionIds: readonly string[];
  readonly seo: PageSeoInput;
  readonly artifacts: readonly StaticArtifactReference[];
}

export interface StaticGenerationPlan {
  readonly outputFormat: 'static-html';
  readonly routes: readonly GenerationRoutePlan[];
  readonly globalArtifacts: readonly StaticArtifactReference[];
  readonly seoArtifactOptions: SeoArtifactOptions;
}

export type GeneratorLifecycleEventName =
  | 'generator:init'
  | 'content:signals:inferred'
  | 'sections:inferred'
  | 'theme:resolved'
  | 'components:selected'
  | 'plan:created'
  | 'plan:validated';

export interface GeneratorLifecycleEvent {
  readonly name: GeneratorLifecycleEventName;
  readonly sequence: number;
  readonly summary: string;
}

export interface GenerationPlan {
  readonly id: string;
  readonly inputKind: GeneratorInputKind;
  readonly businessName: string;
  readonly slug: string;
  readonly verticals: readonly string[];
  readonly content: ContentSignalSummary;
  readonly theme: ThemeResolutionPlan;
  readonly sections: readonly GeneratedSectionPlan[];
  readonly omittedSections: readonly OmittedSectionReason[];
  readonly diagnostics: readonly GenerationDiagnostic[];
  readonly staticPlan: StaticGenerationPlan;
  readonly lifecycleEvents: readonly GeneratorLifecycleEvent[];
}

export interface GenerationPlanValidationResult {
  readonly valid: boolean;
  readonly diagnostics: readonly GenerationDiagnostic[];
}

export type GenerationPlanValidator = (plan: GenerationPlan) => readonly GenerationDiagnostic[];

export interface GeneratorHookContext {
  readonly input: GeneratorInput;
  readonly content?: ContentSignalSummary;
  readonly sectionInference?: SectionInferenceResult;
  readonly theme?: ThemeResolutionPlan;
  readonly plan?: GenerationPlan;
  readonly diagnostics: readonly GenerationDiagnostic[];
  readonly lifecycleEvents: readonly GeneratorLifecycleEvent[];
}

export type GeneratorHook = (context: GeneratorHookContext) => GeneratorHookContext | void;
export type GeneratorHookMap = Partial<Record<GeneratorLifecycleEventName, readonly GeneratorHook[]>>;

export interface GeneratorPlugin {
  readonly id: string;
  readonly label?: string;
  readonly contentTypes?: readonly GeneratorContentTypeDefinition[];
  readonly validators?: readonly GenerationPlanValidator[];
  readonly hooks?: GeneratorHookMap;
}

export interface CreateGenerationPlanOptions extends ThemeSelectionOptions {
  readonly plugins?: readonly GeneratorPlugin[];
  readonly validators?: readonly GenerationPlanValidator[];
  readonly customContentTypes?: readonly GeneratorContentTypeDefinition[];
  readonly supportedCategories?: readonly ComponentCategoryId[];
  readonly routeBasePath?: string;
  readonly seoArtifactOptions?: SeoArtifactOptions;
}
