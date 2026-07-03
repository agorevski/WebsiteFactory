export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export type DiagnosticSeverity = "info" | "warning" | "error";

export interface GenerationDiagnostic {
  readonly severity: DiagnosticSeverity;
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface SourceReference {
  readonly id: string;
  readonly label: string;
  readonly url?: string;
  readonly accessedAt?: string;
  readonly excerpt?: string;
}

export type PromptRole = "system" | "user" | "assistant";

export interface PromptMessage {
  readonly role: PromptRole;
  readonly content: string;
}

export interface PromptEnvelope {
  readonly id: string;
  readonly messages: readonly PromptMessage[];
  readonly variables: Readonly<Record<string, JsonValue>>;
}

export interface GenerationParameters {
  readonly temperature: number;
  readonly topP?: number;
  readonly maxTokens?: number;
  readonly seed?: number;
}

export interface GenerationRequest<TKind extends string, TInput> {
  readonly id: string;
  readonly kind: TKind;
  readonly input: TInput;
  readonly prompt: PromptEnvelope;
  readonly parameters: GenerationParameters;
}

export interface GeneratedArtifact<TKind extends string, TValue> {
  readonly id: string;
  readonly kind: TKind;
  readonly value: TValue;
  readonly diagnostics: readonly GenerationDiagnostic[];
  readonly sources: readonly SourceReference[];
  readonly metadata: Readonly<Record<string, JsonValue>>;
}

export interface TaskExecution<TKind extends string, TInput, TOutput> {
  readonly request: GenerationRequest<TKind, TInput>;
  readonly status: "pending" | "running" | "completed" | "failed";
  readonly output?: TOutput;
  readonly diagnostics: readonly GenerationDiagnostic[];
}

export const DEFAULT_GENERATION_PARAMETERS: GenerationParameters = {
  temperature: 0,
  topP: 1,
  seed: 1
};

export function createDiagnostic(
  severity: DiagnosticSeverity,
  code: string,
  message: string,
  path?: string
): GenerationDiagnostic {
  if (path === undefined) {
    return { severity, code, message };
  }

  return { severity, code, message, path };
}

export function stableStringify(value: unknown): string {
  if (value === undefined) {
    return "\"__undefined__\"";
  }

  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return JSON.stringify(value);
  }

  if (value instanceof Date) {
    return JSON.stringify(value.toISOString());
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));

    const serialized = entries.map(
      ([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`
    );

    return `{${serialized.join(",")}}`;
  }

  return JSON.stringify(String(value));
}

export function hashString(value: string): string {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

export function createDeterministicId(prefix: string, ...parts: readonly unknown[]): string {
  return `${slugify(prefix)}-${hashString(stableStringify(parts))}`;
}

export function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : "item";
}

export function toReadonlyRecord(values: Readonly<Record<string, JsonValue>> = {}): Readonly<Record<string, JsonValue>> {
  return Object.fromEntries(
    Object.entries(values).sort(([left], [right]) => left.localeCompare(right))
  );
}

export function normalizeScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(1, score));
}
