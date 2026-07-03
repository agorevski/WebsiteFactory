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

export interface CloudflarePagesConfig extends ProviderConfig {
  readonly accountIdVariable?: string;
  readonly projectSlug?: string;
  readonly productionBranch?: string;
  readonly compatibilityDate?: string;
}

export function defineCloudflarePagesConfig(config: CloudflarePagesConfig): CloudflarePagesConfig {
  return config;
}

export function createCloudflarePagesAdapter(): DeploymentAdapter<CloudflarePagesConfig> {
  return {
    provider: "cloudflare-pages",
    createPlan: buildCloudflarePagesPlan,
    validateConfig: validateCloudflarePagesConfig
  };
}

export function buildCloudflarePagesPlan(
  config: CloudflarePagesConfig,
  artifact: StaticSiteArtifact
): DeploymentPlan {
  const projectSlug = config.projectSlug ?? config.projectName;
  const accountIdVariable = config.accountIdVariable ?? "CLOUDFLARE_ACCOUNT_ID";
  const diagnostics = validateCloudflarePagesConfig(config, artifact);

  return createDeploymentPlan({
    provider: "cloudflare-pages",
    projectName: config.projectName,
    artifact,
    environment: config.environment,
    branch: config.productionBranch ?? config.branch,
    configFiles: [
      createConfigFile(
        "wrangler.toml",
        "toml",
        renderWranglerToml(projectSlug, artifact.outputDirectory, config.compatibilityDate ?? "2026-01-01"),
        "Cloudflare Pages project configuration."
      )
    ],
    environmentVariables: [
      createEnvironmentVariable(accountIdVariable, "Cloudflare account identifier consumed by deployment automation.")
    ],
    secrets: [
      createSecretReference("CLOUDFLARE_API_TOKEN", "Token with Cloudflare Pages deployment permissions.")
    ],
    diagnostics,
    steps: [
      createDeploymentStep("build", "Build static site", "Build the generated website.", resolveBuildCommand(artifact)),
      createDeploymentStep(
        "deploy",
        "Deploy to Cloudflare Pages",
        "Publish static assets with Wrangler.",
        `npx wrangler pages deploy ${artifact.outputDirectory} --project-name ${projectSlug}`,
        ["build"]
      )
    ],
    notes: ["Keep Cloudflare credentials in CI secret storage; this package never stores secret values."]
  });
}

export function validateCloudflarePagesConfig(
  config: CloudflarePagesConfig,
  artifact: StaticSiteArtifact
): readonly DeploymentDiagnostic[] {
  const diagnostics: DeploymentDiagnostic[] = [
    ...requireNonEmpty(config.projectName, "cloudflare-pages.project-name", "Cloudflare Pages project name"),
    ...requireNonEmpty(artifact.outputDirectory, "cloudflare-pages.output-directory", "Output directory")
  ];

  return diagnostics;
}

function renderWranglerToml(projectName: string, outputDirectory: string, compatibilityDate: string): string {
  return [
    `name = "${projectName}"`,
    `pages_build_output_dir = "${outputDirectory}"`,
    `compatibility_date = "${compatibilityDate}"`,
    ""
  ].join("\n");
}
