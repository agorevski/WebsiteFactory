import {
  createConfigFile,
  createDeploymentPlan,
  createDeploymentStep,
  requireNonEmpty,
  resolveBuildCommand
} from "../builders.js";
import type { DeploymentAdapter, DeploymentDiagnostic, DeploymentPlan, ProviderConfig, StaticSiteArtifact } from "../types.js";

export interface StaticServerConfig extends ProviderConfig {
  readonly basePath?: string;
  readonly host?: string;
  readonly port?: number;
  readonly headers?: Readonly<Record<string, string>>;
  readonly rewrites?: readonly StaticServerRewrite[];
}

export interface StaticServerRewrite {
  readonly from: string;
  readonly to: string;
}

export function defineStaticServerConfig(config: StaticServerConfig): StaticServerConfig {
  return config;
}

export function createStaticServerAdapter(): DeploymentAdapter<StaticServerConfig> {
  return {
    provider: "static-server",
    createPlan: buildStaticServerPlan,
    validateConfig: validateStaticServerConfig
  };
}

export function buildStaticServerPlan(config: StaticServerConfig, artifact: StaticSiteArtifact): DeploymentPlan {
  const diagnostics = validateStaticServerConfig(config, artifact);

  return createDeploymentPlan({
    provider: "static-server",
    projectName: config.projectName,
    artifact,
    environment: config.environment,
    branch: config.branch,
    configFiles: [
      createConfigFile(
        "static-server.manifest.json",
        "json",
        renderStaticServerManifest(config, artifact),
        "Generic static server deployment manifest."
      )
    ],
    diagnostics,
    steps: [
      createDeploymentStep("build", "Build static site", "Build the generated website.", resolveBuildCommand(artifact)),
      createDeploymentStep("publish", "Publish static files", "Copy or upload the output directory to the target static host.", undefined, ["build"])
    ],
    notes: ["This adapter intentionally avoids provider-specific APIs and describes portable static hosting requirements."]
  });
}

export function validateStaticServerConfig(
  config: StaticServerConfig,
  artifact: StaticSiteArtifact
): readonly DeploymentDiagnostic[] {
  const diagnostics: DeploymentDiagnostic[] = [
    ...requireNonEmpty(config.projectName, "static-server.project-name", "Static server project name"),
    ...requireNonEmpty(artifact.outputDirectory, "static-server.output-directory", "Output directory")
  ];

  return diagnostics;
}

function renderStaticServerManifest(config: StaticServerConfig, artifact: StaticSiteArtifact): string {
  const payload = {
    outputDirectory: artifact.outputDirectory,
    basePath: config.basePath ?? "/",
    host: config.host ?? "0.0.0.0",
    port: config.port ?? 8080,
    headers: config.headers ?? {},
    rewrites: config.rewrites ?? []
  };

  return `${JSON.stringify(payload, null, 2)}\n`;
}
