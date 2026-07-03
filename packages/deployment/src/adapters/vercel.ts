import {
  createConfigFile,
  createDeploymentPlan,
  createDeploymentStep,
  createEnvironmentVariable,
  createSecretReference,
  requireNonEmpty,
  resolveBuildCommand
} from "../builders.js";
import type { DeploymentAdapter, DeploymentDiagnostic, DeploymentPlan, ProviderConfig, StaticSiteArtifact } from "../types.js";

export interface VercelConfig extends ProviderConfig {
  readonly outputDirectory?: string;
  readonly framework?: string;
  readonly projectIdVariable?: string;
  readonly orgIdVariable?: string;
  readonly cleanUrls?: boolean;
}

export function defineVercelConfig(config: VercelConfig): VercelConfig {
  return config;
}

export function createVercelAdapter(): DeploymentAdapter<VercelConfig> {
  return {
    provider: "vercel",
    createPlan: buildVercelPlan,
    validateConfig: validateVercelConfig
  };
}

export function buildVercelPlan(config: VercelConfig, artifact: StaticSiteArtifact): DeploymentPlan {
  const outputDirectory = config.outputDirectory ?? artifact.outputDirectory;
  const projectIdVariable = config.projectIdVariable ?? "VERCEL_PROJECT_ID";
  const orgIdVariable = config.orgIdVariable ?? "VERCEL_ORG_ID";
  const diagnostics = validateVercelConfig(config, artifact);

  return createDeploymentPlan({
    provider: "vercel",
    projectName: config.projectName,
    artifact,
    environment: config.environment,
    branch: config.branch,
    configFiles: [
      createConfigFile(
        "vercel.json",
        "json",
        renderVercelJson(config, outputDirectory),
        "Vercel static output configuration."
      )
    ],
    environmentVariables: [
      createEnvironmentVariable(projectIdVariable, "Vercel project identifier consumed by deployment automation."),
      createEnvironmentVariable(orgIdVariable, "Vercel organization identifier consumed by deployment automation.")
    ],
    secrets: [
      createSecretReference("VERCEL_TOKEN", "Token used by Vercel CLI or CI deploy integration.")
    ],
    diagnostics,
    steps: [
      createDeploymentStep("build", "Build static site", "Build the generated website.", resolveBuildCommand(artifact)),
      createDeploymentStep(
        "deploy",
        "Deploy to Vercel",
        "Publish prebuilt static output with Vercel CLI.",
        "npx vercel deploy --prebuilt --prod",
        ["build"]
      )
    ],
    notes: [`Configured output directory: ${outputDirectory}.`]
  });
}

export function validateVercelConfig(
  config: VercelConfig,
  artifact: StaticSiteArtifact
): readonly DeploymentDiagnostic[] {
  const diagnostics: DeploymentDiagnostic[] = [
    ...requireNonEmpty(config.projectName, "vercel.project-name", "Vercel project name"),
    ...requireNonEmpty(config.outputDirectory ?? artifact.outputDirectory, "vercel.output-directory", "Output directory")
  ];

  return diagnostics;
}

function renderVercelJson(config: VercelConfig, outputDirectory: string): string {
  const payload = {
    outputDirectory,
    framework: config.framework ?? null,
    cleanUrls: config.cleanUrls ?? true
  };

  return `${JSON.stringify(payload, null, 2)}\n`;
}
