import {
  createConfigFile,
  createDeploymentPlan,
  createDeploymentStep,
  createSecretReference,
  requireNonEmpty,
  resolveBuildCommand
} from "../builders.js";
import type { DeploymentAdapter, DeploymentDiagnostic, DeploymentPlan, ProviderConfig, StaticSiteArtifact } from "../types.js";

export interface AzureStaticWebAppsConfig extends ProviderConfig {
  readonly appLocation?: string;
  readonly outputLocation?: string;
  readonly apiLocation?: string;
  readonly routes?: readonly AzureStaticWebAppRoute[];
  readonly navigationFallback?: string;
}

export interface AzureStaticWebAppRoute {
  readonly route: string;
  readonly serve: string;
  readonly statusCode?: number;
}

export function defineAzureStaticWebAppsConfig(config: AzureStaticWebAppsConfig): AzureStaticWebAppsConfig {
  return config;
}

export function createAzureStaticWebAppsAdapter(): DeploymentAdapter<AzureStaticWebAppsConfig> {
  return {
    provider: "azure-static-web-apps",
    createPlan: buildAzureStaticWebAppsPlan,
    validateConfig: validateAzureStaticWebAppsConfig
  };
}

export function buildAzureStaticWebAppsPlan(
  config: AzureStaticWebAppsConfig,
  artifact: StaticSiteArtifact
): DeploymentPlan {
  const outputLocation = config.outputLocation ?? artifact.outputDirectory;
  const diagnostics = validateAzureStaticWebAppsConfig(config, artifact);

  return createDeploymentPlan({
    provider: "azure-static-web-apps",
    projectName: config.projectName,
    artifact,
    environment: config.environment,
    branch: config.branch,
    configFiles: [
      createConfigFile(
        "staticwebapp.config.json",
        "json",
        renderStaticWebAppConfig(config),
        "Azure Static Web Apps runtime configuration."
      )
    ],
    secrets: [
      createSecretReference("AZURE_STATIC_WEB_APPS_API_TOKEN", "Deployment token for the Azure Static Web App.")
    ],
    diagnostics,
    steps: [
      createDeploymentStep("build", "Build static site", "Build the generated website.", resolveBuildCommand(artifact)),
      createDeploymentStep(
        "deploy",
        "Deploy to Azure Static Web Apps",
        "Upload static assets through Azure Static Web Apps deployment action or CLI.",
        `swa deploy ${outputLocation} --app-name ${config.projectName}`,
        ["build"]
      )
    ],
    notes: [
      `App location: ${config.appLocation ?? artifact.siteRoot}.`,
      `Output location: ${outputLocation}.`
    ]
  });
}

export function validateAzureStaticWebAppsConfig(
  config: AzureStaticWebAppsConfig,
  artifact: StaticSiteArtifact
): readonly DeploymentDiagnostic[] {
  const diagnostics: DeploymentDiagnostic[] = [
    ...requireNonEmpty(config.projectName, "azure-static-web-apps.project-name", "Azure Static Web Apps project name"),
    ...requireNonEmpty(config.outputLocation ?? artifact.outputDirectory, "azure-static-web-apps.output-location", "Output location")
  ];

  return diagnostics;
}

function renderStaticWebAppConfig(config: AzureStaticWebAppsConfig): string {
  const routes = config.routes ?? [];
  const navigationFallback = config.navigationFallback ?? "/index.html";

  return `${JSON.stringify({ routes, navigationFallback: { rewrite: navigationFallback } }, null, 2)}\n`;
}
