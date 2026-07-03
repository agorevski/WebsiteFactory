export type DeploymentProvider =
  | "github-pages"
  | "cloudflare-pages"
  | "azure-static-web-apps"
  | "netlify"
  | "vercel"
  | "s3-cloudfront"
  | "static-server";

export type DeploymentEnvironment = "production" | "preview" | "staging" | (string & {});

export type ConfigFileFormat = "json" | "toml" | "yaml" | "text";

export type DeploymentDiagnosticSeverity = "info" | "warning" | "error";

export interface StaticSiteArtifact {
  readonly siteRoot: string;
  readonly outputDirectory: string;
  readonly buildCommand?: string;
  readonly installCommand?: string;
  readonly packageManager?: "npm" | "pnpm" | "yarn" | "bun" | (string & {});
  readonly nodeVersion?: string;
}

export interface DeploymentTarget {
  readonly provider: DeploymentProvider;
  readonly projectName: string;
  readonly environment: DeploymentEnvironment;
  readonly branch?: string;
  readonly url?: string;
}

export interface ConfigFile {
  readonly path: string;
  readonly format: ConfigFileFormat;
  readonly contents: string;
  readonly description: string;
}

export interface DeploymentStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly command?: string;
  readonly needs: readonly string[];
}

export interface EnvironmentVariable {
  readonly name: string;
  readonly description: string;
  readonly value?: string;
  readonly secret: boolean;
}

export interface SecretReference {
  readonly name: string;
  readonly description: string;
  readonly required: boolean;
  readonly providerKey?: string;
}

export interface DeploymentDiagnostic {
  readonly severity: DeploymentDiagnosticSeverity;
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface DeploymentPlan {
  readonly id: string;
  readonly provider: DeploymentProvider;
  readonly target: DeploymentTarget;
  readonly artifact: StaticSiteArtifact;
  readonly configFiles: readonly ConfigFile[];
  readonly steps: readonly DeploymentStep[];
  readonly environmentVariables: readonly EnvironmentVariable[];
  readonly secrets: readonly SecretReference[];
  readonly diagnostics: readonly DeploymentDiagnostic[];
  readonly notes: readonly string[];
}

export interface ProviderConfig {
  readonly projectName: string;
  readonly environment?: DeploymentEnvironment;
  readonly branch?: string;
}

export interface DeploymentAdapter<TConfig extends ProviderConfig> {
  readonly provider: DeploymentProvider;
  readonly createPlan: (config: TConfig, artifact: StaticSiteArtifact) => DeploymentPlan;
  readonly validateConfig: (config: TConfig, artifact: StaticSiteArtifact) => readonly DeploymentDiagnostic[];
}
