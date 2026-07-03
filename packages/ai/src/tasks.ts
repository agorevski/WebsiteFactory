import {
  DEFAULT_GENERATION_PARAMETERS,
  createDeterministicId,
  toReadonlyRecord,
  type GenerationParameters,
  type GenerationRequest,
  type JsonValue,
  type PromptEnvelope,
  type PromptMessage
} from "./common.js";
import type { ValidationReport } from "./feedback.js";
import type { BusinessResearchInput, BusinessResearchPlan } from "./research.js";

export type GenerationTaskKind =
  | "business-research"
  | "yaml-site"
  | "content"
  | "image"
  | "seo"
  | "structured-data"
  | "template-selection"
  | "theme-selection"
  | "validation-repair";

export interface TaskOptions {
  readonly id?: string;
  readonly prompt?: readonly PromptMessage[];
  readonly dependencies?: readonly string[];
  readonly parameters?: Partial<GenerationParameters>;
  readonly variables?: Readonly<Record<string, JsonValue>>;
}

export interface BaseGenerationTask<TKind extends GenerationTaskKind, TInput> {
  readonly id: string;
  readonly kind: TKind;
  readonly input: TInput;
  readonly dependencies: readonly string[];
  readonly prompt: readonly PromptMessage[];
  readonly parameters: GenerationParameters;
  readonly variables: Readonly<Record<string, JsonValue>>;
}

export interface ContentGenerationInput {
  readonly pageId: string;
  readonly sectionId?: string;
  readonly purpose: string;
  readonly audience?: string;
  readonly tone?: string;
  readonly wordCount?: {
    readonly min: number;
    readonly max: number;
  };
  readonly requiredKeywords: readonly string[];
  readonly sourceResearchIds: readonly string[];
}

export interface BusinessResearchGenerationInput {
  readonly business: BusinessResearchInput;
  readonly plan?: BusinessResearchPlan;
  readonly requiredOutputs: readonly string[];
}

export interface ImageGenerationInput {
  readonly assetId: string;
  readonly prompt: string;
  readonly altTextPurpose: string;
  readonly style?: string;
  readonly dimensions?: {
    readonly width: number;
    readonly height: number;
  };
  readonly negativePrompt?: string;
}

export interface SeoGenerationInput {
  readonly pageId: string;
  readonly primaryKeyword?: string;
  readonly secondaryKeywords: readonly string[];
  readonly canonicalPath?: string;
  readonly locale?: string;
  readonly titleLimit: number;
  readonly descriptionLimit: number;
}

export interface StructuredDataGenerationInput {
  readonly pageId: string;
  readonly schemaType: "Organization" | "LocalBusiness" | "Product" | "Service" | "Article" | "FAQPage" | string;
  readonly entityName?: string;
  readonly facts: Readonly<Record<string, JsonValue>>;
}

export interface YamlSiteGenerationInput<TSiteSchema = unknown> {
  readonly siteName: string;
  readonly schemaHint?: TSiteSchema;
  readonly yamlStyleGuide: readonly string[];
  readonly requiredSections: readonly string[];
}

export interface ValidationRepairInput {
  readonly currentYaml: string;
  readonly report: ValidationReport;
  readonly constraints: readonly string[];
}

export interface SelectionInput {
  readonly siteGoal: string;
  readonly industry?: string;
  readonly audience?: string;
  readonly candidates: readonly string[];
  readonly constraints: readonly string[];
}

export type BusinessResearchTask = BaseGenerationTask<"business-research", BusinessResearchGenerationInput>;
export type ContentGenerationTask = BaseGenerationTask<"content", ContentGenerationInput>;
export type ImageGenerationTask = BaseGenerationTask<"image", ImageGenerationInput>;
export type SeoGenerationTask = BaseGenerationTask<"seo", SeoGenerationInput>;
export type StructuredDataGenerationTask = BaseGenerationTask<"structured-data", StructuredDataGenerationInput>;
export type YamlSiteGenerationTask<TSiteSchema = unknown> = BaseGenerationTask<"yaml-site", YamlSiteGenerationInput<TSiteSchema>>;
export type TemplateSelectionTask = BaseGenerationTask<"template-selection", SelectionInput>;
export type ThemeSelectionTask = BaseGenerationTask<"theme-selection", SelectionInput>;
export type ValidationRepairTask = BaseGenerationTask<"validation-repair", ValidationRepairInput>;

export type AIGenerationTask<TSiteSchema = unknown> =
  | BusinessResearchTask
  | ContentGenerationTask
  | ImageGenerationTask
  | SeoGenerationTask
  | StructuredDataGenerationTask
  | YamlSiteGenerationTask<TSiteSchema>
  | TemplateSelectionTask
  | ThemeSelectionTask
  | ValidationRepairTask;

export function createBusinessResearchTask(
  input: BusinessResearchGenerationInput,
  options: TaskOptions = {}
): BusinessResearchTask {
  return createTask("business-research", input, options);
}

export function createContentGenerationTask(
  input: ContentGenerationInput,
  options: TaskOptions = {}
): ContentGenerationTask {
  return createTask("content", input, options);
}

export function createImageGenerationTask(
  input: ImageGenerationInput,
  options: TaskOptions = {}
): ImageGenerationTask {
  return createTask("image", input, options);
}

export function createSeoGenerationTask(
  input: SeoGenerationInput,
  options: TaskOptions = {}
): SeoGenerationTask {
  return createTask("seo", input, options);
}

export function createStructuredDataGenerationTask(
  input: StructuredDataGenerationInput,
  options: TaskOptions = {}
): StructuredDataGenerationTask {
  return createTask("structured-data", input, options);
}

export function createYamlSiteGenerationTask<TSiteSchema>(
  input: YamlSiteGenerationInput<TSiteSchema>,
  options: TaskOptions = {}
): YamlSiteGenerationTask<TSiteSchema> {
  return createTask("yaml-site", input, options);
}

export function createTemplateSelectionTask(
  input: SelectionInput,
  options: TaskOptions = {}
): TemplateSelectionTask {
  return createTask("template-selection", input, options);
}

export function createThemeSelectionTask(
  input: SelectionInput,
  options: TaskOptions = {}
): ThemeSelectionTask {
  return createTask("theme-selection", input, options);
}

export function createValidationRepairTask(
  input: ValidationRepairInput,
  options: TaskOptions = {}
): ValidationRepairTask {
  return createTask("validation-repair", input, options);
}

export function createGenerationRequest<TTask extends AIGenerationTask>(
  task: TTask
): GenerationRequest<TTask["kind"], TTask["input"]> {
  const prompt: PromptEnvelope = {
    id: createDeterministicId("prompt", task.id, task.prompt, task.variables),
    messages: task.prompt,
    variables: task.variables
  };

  return {
    id: createDeterministicId("generation-request", task.id, task.parameters),
    kind: task.kind,
    input: task.input,
    prompt,
    parameters: task.parameters
  };
}

function createTask<TKind extends GenerationTaskKind, TInput>(
  kind: TKind,
  input: TInput,
  options: TaskOptions
): BaseGenerationTask<TKind, TInput> {
  const id = options.id ?? createDeterministicId(kind, input);

  return {
    id,
    kind,
    input,
    dependencies: [...(options.dependencies ?? [])].sort((left, right) => left.localeCompare(right)),
    prompt: options.prompt ?? [],
    parameters: { ...DEFAULT_GENERATION_PARAMETERS, ...options.parameters },
    variables: toReadonlyRecord(options.variables)
  };
}
