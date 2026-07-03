import {
  createConfigFile,
  createDeploymentDiagnostic,
  createDeploymentPlan,
  createDeploymentStep,
  requireNonEmpty,
  resolveBuildCommand,
  resolveInstallCommand
} from "../builders.js";
import type { DeploymentAdapter, DeploymentDiagnostic, DeploymentPlan, ProviderConfig, StaticSiteArtifact } from "../types.js";

export interface GitHubPagesConfig extends ProviderConfig {
  readonly repository: string;
  readonly workflowName?: string;
  readonly publishDirectory?: string;
  readonly customDomain?: string;
  readonly nodeVersion?: string;
}

export function defineGitHubPagesConfig(config: GitHubPagesConfig): GitHubPagesConfig {
  return config;
}

export function createGitHubPagesAdapter(): DeploymentAdapter<GitHubPagesConfig> {
  return {
    provider: "github-pages",
    createPlan: buildGitHubPagesPlan,
    validateConfig: validateGitHubPagesConfig
  };
}

export function buildGitHubPagesPlan(
  config: GitHubPagesConfig,
  artifact: StaticSiteArtifact
): DeploymentPlan {
  const diagnostics = validateGitHubPagesConfig(config, artifact);
  const publishDirectory = config.publishDirectory ?? artifact.outputDirectory;
  const branch = config.branch ?? "main";
  const workflowName = config.workflowName ?? "Deploy static site";
  const nodeVersion = config.nodeVersion ?? artifact.nodeVersion ?? "22";
  const configFiles = [
    createConfigFile(
      ".github/workflows/deploy.yml",
      "yaml",
      renderGitHubPagesWorkflow(workflowName, branch, publishDirectory, nodeVersion, artifact),
      "GitHub Actions workflow for Pages deployments."
    )
  ];

  if (config.customDomain !== undefined) {
    configFiles.push(
      createConfigFile("public/CNAME", "text", `${config.customDomain}\n`, "GitHub Pages custom domain marker.")
    );
  }

  return createDeploymentPlan({
    provider: "github-pages",
    projectName: config.projectName,
    artifact,
    environment: config.environment,
    branch,
    configFiles,
    diagnostics,
    steps: [
      createDeploymentStep("install", "Install dependencies", "Install workspace dependencies.", resolveInstallCommand(artifact)),
      createDeploymentStep("build", "Build static site", "Build the generated website.", resolveBuildCommand(artifact), ["install"]),
      createDeploymentStep("deploy", "Deploy to GitHub Pages", "Upload the static artifact through GitHub Pages.", undefined, ["build"])
    ],
    notes: [
      "Uses the repository-scoped GITHUB_TOKEN supplied by GitHub Actions.",
      `Publishes ${publishDirectory} from ${config.repository}.`
    ]
  });
}

export function validateGitHubPagesConfig(
  config: GitHubPagesConfig,
  artifact: StaticSiteArtifact
): readonly DeploymentDiagnostic[] {
  return [
    ...requireNonEmpty(config.projectName, "github-pages.project-name", "GitHub Pages project name"),
    ...requireNonEmpty(config.repository, "github-pages.repository", "GitHub repository"),
    ...requireNonEmpty(config.publishDirectory ?? artifact.outputDirectory, "github-pages.publish-directory", "Publish directory"),
    ...(artifact.outputDirectory === "dist"
      ? []
      : [createDeploymentDiagnostic("info", "github-pages.custom-output", `Publishing ${artifact.outputDirectory}.`)])
  ];
}

function renderGitHubPagesWorkflow(
  workflowName: string,
  branch: string,
  publishDirectory: string,
  nodeVersion: string,
  artifact: StaticSiteArtifact
): string {
  return [
    `name: ${workflowName}`,
    "",
    "on:",
    "  push:",
    "    branches:",
    `      - ${branch}`,
    "  workflow_dispatch:",
    "",
    "permissions:",
    "  contents: read",
    "  pages: write",
    "  id-token: write",
    "",
    "jobs:",
    "  deploy:",
    "    runs-on: ubuntu-latest",
    "    environment:",
    "      name: github-pages",
    "      url: ${{ steps.deployment.outputs.page_url }}",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - uses: actions/setup-node@v4",
    "        with:",
    `          node-version: ${nodeVersion}`,
    "          cache: npm",
    `      - run: ${resolveInstallCommand(artifact)}`,
    `      - run: ${resolveBuildCommand(artifact)}`,
    "      - uses: actions/configure-pages@v5",
    "      - uses: actions/upload-pages-artifact@v3",
    "        with:",
    `          path: ${publishDirectory}`,
    "      - id: deployment",
    "        uses: actions/deploy-pages@v4",
    ""
  ].join("\n");
}
