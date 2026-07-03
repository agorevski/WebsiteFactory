import { createDeterministicId, stableStringify, toReadonlyRecord, type JsonValue, type PromptEnvelope, type PromptMessage } from "./common.js";
import type { ValidationReport } from "./feedback.js";
import type { YamlGenerationInput } from "./pipeline.js";
import type { BusinessResearchInput, BusinessResearchQuestion } from "./research.js";
import type { AIGenerationTask } from "./tasks.js";

export type PromptOutputFormat = "plain-text" | "markdown" | "json" | "yaml";

export interface PromptSection {
  readonly title: string;
  readonly body: string;
}

export interface PromptBuildOptions {
  readonly id?: string;
  readonly system?: string;
  readonly instructions: readonly string[];
  readonly context?: Readonly<Record<string, JsonValue>>;
  readonly sections?: readonly PromptSection[];
  readonly constraints?: readonly string[];
  readonly outputFormat?: PromptOutputFormat;
}

export function buildPromptEnvelope(options: PromptBuildOptions): PromptEnvelope {
  const messages = buildPromptMessages(options);
  const variables = toReadonlyRecord(options.context);

  return {
    id: options.id ?? createDeterministicId("prompt", messages, variables),
    messages,
    variables
  };
}

export function buildPromptMessages(options: PromptBuildOptions): readonly PromptMessage[] {
  const system = options.system ?? "You are a deterministic Website Factory planning assistant. Do not call external APIs or invent secrets.";
  const userSections: string[] = [
    renderList("Instructions", options.instructions)
  ];

  if (options.context !== undefined) {
    userSections.push(`Context\n${stableStringify(options.context)}`);
  }

  if (options.sections !== undefined && options.sections.length > 0) {
    userSections.push(...options.sections.map((section) => `${section.title}\n${section.body}`));
  }

  if (options.constraints !== undefined && options.constraints.length > 0) {
    userSections.push(renderList("Constraints", options.constraints));
  }

  if (options.outputFormat !== undefined) {
    userSections.push(`Output format\n${options.outputFormat}`);
  }

  return [
    { role: "system", content: system },
    { role: "user", content: userSections.join("\n\n") }
  ];
}

export function buildBusinessResearchPrompt(
  input: BusinessResearchInput,
  questions: readonly BusinessResearchQuestion[]
): PromptEnvelope {
  return buildPromptEnvelope({
    id: createDeterministicId("business-research-prompt", input, questions),
    instructions: [
      "Answer each research question with sourced, factual findings.",
      "Separate confirmed facts from assumptions.",
      "Return structured findings suitable for website planning."
    ],
    context: {
      businessName: input.businessName,
      websiteUrl: input.websiteUrl ?? null,
      industry: input.industry ?? null,
      location: input.location ?? null,
      targetAudiences: input.targetAudiences,
      offerings: input.offerings,
      competitors: input.competitors,
      differentiators: input.differentiators,
      goals: input.goals,
      constraints: input.constraints
    },
    sections: [
      {
        title: "Research questions",
        body: questions.map((question) => `- [${question.priority}] ${question.prompt}`).join("\n")
      }
    ],
    outputFormat: "json"
  });
}

export function buildYamlGenerationPrompt<TSiteSchema>(
  input: YamlGenerationInput<TSiteSchema>
): PromptEnvelope {
  return buildPromptEnvelope({
    id: createDeterministicId("yaml-generation-prompt", input),
    instructions: [
      "Generate website YAML that conforms to the supplied schema hints and constraints.",
      "Use deterministic ordering for pages, sections, and design tokens.",
      "Prefer explicit values over implied defaults."
    ],
    context: {
      siteName: input.siteName,
      locale: input.locale ?? null,
      requestedPages: input.requestedPages,
      requiredSections: input.requiredSections,
      templateCandidates: input.templateCandidates,
      themeCandidates: input.themeCandidates,
      constraints: input.constraints,
      business: stableStringify(input.business),
      researchResult: input.researchResult === undefined ? null : stableStringify(input.researchResult),
      schemaHint: input.schemaHint === undefined ? null : stableStringify(input.schemaHint)
    },
    outputFormat: "yaml"
  });
}

export function buildTaskPrompt(task: AIGenerationTask): PromptEnvelope {
  return buildPromptEnvelope({
    id: createDeterministicId("task-prompt", task.id),
    instructions: [
      `Complete the ${task.kind} task using only the provided input.`,
      "Return deterministic, schema-friendly output.",
      "Do not include credentials, environment secrets, or unsourced factual claims."
    ],
    context: {
      taskId: task.id,
      taskKind: task.kind,
      input: stableStringify(task.input)
    },
    outputFormat: task.kind === "yaml-site" || task.kind === "validation-repair" ? "yaml" : "json"
  });
}

export function buildValidationRepairPrompt(
  currentYaml: string,
  report: ValidationReport,
  constraints: readonly string[] = []
): PromptEnvelope {
  return buildPromptEnvelope({
    id: createDeterministicId("validation-repair-prompt", currentYaml, report.id, constraints),
    instructions: [
      "Repair the YAML so validation issues are resolved.",
      "Preserve valid content and ordering where possible.",
      "Return only the repaired YAML."
    ],
    context: {
      currentYaml,
      reportId: report.id,
      issues: report.issues.map((issue) => ({
        severity: issue.severity,
        code: issue.code,
        path: issue.path,
        message: issue.message,
        suggestion: issue.suggestion ?? null
      })),
      constraints
    },
    outputFormat: "yaml"
  });
}

function renderList(title: string, values: readonly string[]): string {
  return `${title}\n${values.map((value) => `- ${value}`).join("\n")}`;
}
