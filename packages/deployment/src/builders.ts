import type {
  ConfigFile,
  ConfigFileFormat,
  DeploymentDiagnostic,
  DeploymentDiagnosticSeverity,
  DeploymentEnvironment,
  DeploymentPlan,
  DeploymentProvider,
  DeploymentStep,
  DeploymentTarget,
  EnvironmentVariable,
  SecretReference,
  StaticSiteArtifact
} from "./types.js";

export interface DeploymentPlanInput {
  readonly provider: DeploymentProvider;
  readonly projectName: string;
  readonly artifact: StaticSiteArtifact;
  readonly environment?: DeploymentEnvironment | undefined;
  readonly branch?: string | undefined;
  readonly url?: string | undefined;
  readonly configFiles?: readonly ConfigFile[];
  readonly steps?: readonly DeploymentStep[];
  readonly environmentVariables?: readonly EnvironmentVariable[];
  readonly secrets?: readonly SecretReference[];
  readonly diagnostics?: readonly DeploymentDiagnostic[];
  readonly notes?: readonly string[];
}

export function defineStaticSiteArtifact(artifact: StaticSiteArtifact): StaticSiteArtifact {
  return artifact;
}

export function createDeploymentPlan(input: DeploymentPlanInput): DeploymentPlan {
  const target = createDeploymentTarget(
    input.provider,
    input.projectName,
    input.environment ?? "production",
    input.branch,
    input.url
  );

  return {
    id: createDeterministicId("deployment-plan", target, input.artifact, input.configFiles, input.steps),
    provider: input.provider,
    target,
    artifact: input.artifact,
    configFiles: input.configFiles ?? [],
    steps: input.steps ?? [],
    environmentVariables: input.environmentVariables ?? [],
    secrets: input.secrets ?? [],
    diagnostics: input.diagnostics ?? [],
    notes: input.notes ?? []
  };
}

export function createDeploymentTarget(
  provider: DeploymentProvider,
  projectName: string,
  environment: DeploymentEnvironment,
  branch?: string,
  url?: string
): DeploymentTarget {
  const base = { provider, projectName, environment };
  const withBranch = branch === undefined ? base : { ...base, branch };

  return url === undefined ? withBranch : { ...withBranch, url };
}

export function createConfigFile(
  path: string,
  format: ConfigFileFormat,
  contents: string,
  description: string
): ConfigFile {
  return { path, format, contents, description };
}

export function createDeploymentStep(
  id: string,
  title: string,
  description: string,
  command?: string,
  needs: readonly string[] = []
): DeploymentStep {
  const base = {
    id: slugify(id),
    title,
    description,
    needs: [...needs].sort((left, right) => left.localeCompare(right))
  };

  return command === undefined ? base : { ...base, command };
}

export function createEnvironmentVariable(
  name: string,
  description: string,
  value?: string,
  secret = false
): EnvironmentVariable {
  const base = { name, description, secret };

  return value === undefined ? base : { ...base, value };
}

export function createSecretReference(
  name: string,
  description: string,
  required = true,
  providerKey?: string
): SecretReference {
  const base = { name, description, required };

  return providerKey === undefined ? base : { ...base, providerKey };
}

export function createDeploymentDiagnostic(
  severity: DeploymentDiagnosticSeverity,
  code: string,
  message: string,
  path?: string
): DeploymentDiagnostic {
  if (path === undefined) {
    return { severity, code, message };
  }

  return { severity, code, message, path };
}

export function requireNonEmpty(value: string | undefined, code: string, label: string): readonly DeploymentDiagnostic[] {
  if (value !== undefined && value.trim().length > 0) {
    return [];
  }

  return [createDeploymentDiagnostic("error", code, `${label} is required.`)];
}

export function resolveBuildCommand(artifact: StaticSiteArtifact): string {
  return artifact.buildCommand ?? "npm run build";
}

export function resolveInstallCommand(artifact: StaticSiteArtifact): string {
  return artifact.installCommand ?? "npm ci";
}

export function stableStringify(value: unknown): string {
  if (value === undefined) {
    return "\"__undefined__\"";
  }

  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));

    return `{${entries.map(([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`).join(",")}}`;
  }

  return JSON.stringify(String(value));
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

function hashString(value: string): string {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}
