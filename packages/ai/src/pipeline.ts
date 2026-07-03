import { createDeterministicId, type GenerationDiagnostic, type JsonValue } from "./common.js";
import type { BusinessResearchInput, BusinessResearchResult } from "./research.js";
import type { AIGenerationTask } from "./tasks.js";

export type YamlPipelineStepKind =
  | "collect-inputs"
  | "research"
  | "select-template"
  | "select-theme"
  | "draft-yaml"
  | "validate-schema"
  | "repair-yaml"
  | "finalize";

export type PipelineStepStatus = "pending" | "ready" | "running" | "completed" | "skipped" | "failed";

export interface YamlGenerationInput<TSiteSchema = unknown> {
  readonly siteName: string;
  readonly business: BusinessResearchInput;
  readonly researchResult?: BusinessResearchResult;
  readonly schemaHint?: TSiteSchema;
  readonly locale?: string;
  readonly requestedPages: readonly string[];
  readonly requiredSections: readonly string[];
  readonly templateCandidates: readonly string[];
  readonly themeCandidates: readonly string[];
  readonly constraints: readonly string[];
}

export interface YamlPipelineStep {
  readonly id: string;
  readonly kind: YamlPipelineStepKind;
  readonly title: string;
  readonly dependsOn: readonly string[];
}

export interface YamlGenerationPipeline<TSiteSchema = unknown> {
  readonly id: string;
  readonly input: YamlGenerationInput<TSiteSchema>;
  readonly steps: readonly YamlPipelineStep[];
}

export interface YamlPipelineState<TSiteSchema = unknown> {
  readonly pipeline: YamlGenerationPipeline<TSiteSchema>;
  readonly stepStatuses: Readonly<Record<string, PipelineStepStatus>>;
  readonly diagnosticsByStep: Readonly<Record<string, readonly GenerationDiagnostic[]>>;
  readonly artifactsByStep: Readonly<Record<string, JsonValue>>;
  readonly taskQueue: readonly AIGenerationTask<TSiteSchema>[];
}

export interface PipelineStepResult {
  readonly stepId: string;
  readonly status: "completed" | "skipped" | "failed";
  readonly diagnostics?: readonly GenerationDiagnostic[];
  readonly artifact?: JsonValue;
}

export function createYamlGenerationPipeline<TSiteSchema>(
  input: YamlGenerationInput<TSiteSchema>
): YamlGenerationPipeline<TSiteSchema> {
  const collectInputs = createPipelineStep("collect-inputs", "Collect deterministic site inputs");
  const research = createPipelineStep("research", "Resolve business research", [collectInputs.id]);
  const selectTemplate = createPipelineStep("select-template", "Recommend a template", [research.id]);
  const selectTheme = createPipelineStep("select-theme", "Recommend a theme", [selectTemplate.id]);
  const draftYaml = createPipelineStep("draft-yaml", "Draft schema YAML", [selectTheme.id]);
  const validateSchema = createPipelineStep("validate-schema", "Validate YAML against schema", [draftYaml.id]);
  const repairYaml = createPipelineStep("repair-yaml", "Repair YAML from validation feedback", [validateSchema.id]);
  const finalize = createPipelineStep("finalize", "Finalize deployable YAML", [repairYaml.id]);

  return {
    id: createDeterministicId("yaml-pipeline", input),
    input,
    steps: [
      collectInputs,
      research,
      selectTemplate,
      selectTheme,
      draftYaml,
      validateSchema,
      repairYaml,
      finalize
    ]
  };
}

export function createInitialYamlPipelineState<TSiteSchema>(
  pipeline: YamlGenerationPipeline<TSiteSchema>,
  taskQueue: readonly AIGenerationTask<TSiteSchema>[] = []
): YamlPipelineState<TSiteSchema> {
  const stepStatuses = Object.fromEntries(
    pipeline.steps.map((step) => [step.id, step.dependsOn.length === 0 ? "ready" : "pending"])
  ) as Record<string, PipelineStepStatus>;

  return {
    pipeline,
    stepStatuses,
    diagnosticsByStep: {},
    artifactsByStep: {},
    taskQueue
  };
}

export function getNextYamlPipelineStep<TSiteSchema>(
  state: YamlPipelineState<TSiteSchema>
): YamlPipelineStep | undefined {
  return state.pipeline.steps.find((step) => state.stepStatuses[step.id] === "ready");
}

export function startYamlPipelineStep<TSiteSchema>(
  state: YamlPipelineState<TSiteSchema>,
  stepId: string
): YamlPipelineState<TSiteSchema> {
  return {
    ...state,
    stepStatuses: {
      ...state.stepStatuses,
      [stepId]: "running"
    }
  };
}

export function recordYamlPipelineStepResult<TSiteSchema>(
  state: YamlPipelineState<TSiteSchema>,
  result: PipelineStepResult
): YamlPipelineState<TSiteSchema> {
  const nextStatuses: Record<string, PipelineStepStatus> = {
    ...state.stepStatuses,
    [result.stepId]: result.status
  };

  for (const step of state.pipeline.steps) {
    if (nextStatuses[step.id] === "pending" && dependenciesSatisfied(step, nextStatuses)) {
      nextStatuses[step.id] = "ready";
    }
  }

  const diagnosticsByStep = result.diagnostics === undefined
    ? state.diagnosticsByStep
    : { ...state.diagnosticsByStep, [result.stepId]: result.diagnostics };

  const artifactsByStep = result.artifact === undefined
    ? state.artifactsByStep
    : { ...state.artifactsByStep, [result.stepId]: result.artifact };

  return {
    ...state,
    stepStatuses: nextStatuses,
    diagnosticsByStep,
    artifactsByStep
  };
}

export function isYamlPipelineComplete<TSiteSchema>(state: YamlPipelineState<TSiteSchema>): boolean {
  return state.pipeline.steps.every((step) => {
    const status = state.stepStatuses[step.id];
    return status === "completed" || status === "skipped";
  });
}

function createPipelineStep(
  kind: YamlPipelineStepKind,
  title: string,
  dependsOn: readonly string[] = []
): YamlPipelineStep {
  return {
    id: createDeterministicId("yaml-step", kind, title, dependsOn),
    kind,
    title,
    dependsOn
  };
}

function dependenciesSatisfied(
  step: YamlPipelineStep,
  statuses: Readonly<Record<string, PipelineStepStatus>>
): boolean {
  return step.dependsOn.every((dependencyId) => {
    const dependencyStatus = statuses[dependencyId];
    return dependencyStatus === "completed" || dependencyStatus === "skipped";
  });
}
