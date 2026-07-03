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

export interface NetlifyConfig extends ProviderConfig {
  readonly siteIdVariable?: string;
  readonly publishDirectory?: string;
  readonly functionsDirectory?: string;
  readonly redirects?: readonly NetlifyRedirect[];
}

export interface NetlifyRedirect {
  readonly from: string;
  readonly to: string;
  readonly status: number;
}

export function defineNetlifyConfig(config: NetlifyConfig): NetlifyConfig {
  return config;
}

export function createNetlifyAdapter(): DeploymentAdapter<NetlifyConfig> {
  return {
    provider: "netlify",
    createPlan: buildNetlifyPlan,
    validateConfig: validateNetlifyConfig
  };
}

export function buildNetlifyPlan(config: NetlifyConfig, artifact: StaticSiteArtifact): DeploymentPlan {
  const publishDirectory = config.publishDirectory ?? artifact.outputDirectory;
  const siteIdVariable = config.siteIdVariable ?? "NETLIFY_SITE_ID";
  const diagnostics = validateNetlifyConfig(config, artifact);

  return createDeploymentPlan({
    provider: "netlify",
    projectName: config.projectName,
    artifact,
    environment: config.environment,
    branch: config.branch,
    configFiles: [
      createConfigFile(
        "netlify.toml",
        "toml",
        renderNetlifyToml(artifact, publishDirectory, config),
        "Netlify build and publish configuration."
      )
    ],
    environmentVariables: [
      createEnvironmentVariable(siteIdVariable, "Netlify site identifier consumed by CI automation.")
    ],
    secrets: [
      createSecretReference("NETLIFY_AUTH_TOKEN", "Token used by Netlify CLI or CI deploy integration.")
    ],
    diagnostics,
    steps: [
      createDeploymentStep("build", "Build static site", "Build the generated website.", resolveBuildCommand(artifact)),
      createDeploymentStep(
        "deploy",
        "Deploy to Netlify",
        "Publish static assets with Netlify CLI.",
        `npx netlify deploy --prod --dir ${publishDirectory}`,
        ["build"]
      )
    ],
    notes: ["Netlify environment and secret values are represented as references only."]
  });
}

export function validateNetlifyConfig(
  config: NetlifyConfig,
  artifact: StaticSiteArtifact
): readonly DeploymentDiagnostic[] {
  const diagnostics: DeploymentDiagnostic[] = [
    ...requireNonEmpty(config.projectName, "netlify.project-name", "Netlify project name"),
    ...requireNonEmpty(config.publishDirectory ?? artifact.outputDirectory, "netlify.publish-directory", "Publish directory")
  ];

  return diagnostics;
}

function renderNetlifyToml(
  artifact: StaticSiteArtifact,
  publishDirectory: string,
  config: NetlifyConfig
): string {
  const lines = [
    "[build]",
    `  command = "${resolveBuildCommand(artifact)}"`,
    `  publish = "${publishDirectory}"`
  ];

  if (config.functionsDirectory !== undefined) {
    lines.push(`  functions = "${config.functionsDirectory}"`);
  }

  for (const redirect of config.redirects ?? []) {
    lines.push("", "[[redirects]]", `  from = "${redirect.from}"`, `  to = "${redirect.to}"`, `  status = ${redirect.status}`);
  }

  lines.push("");

  return lines.join("\n");
}
