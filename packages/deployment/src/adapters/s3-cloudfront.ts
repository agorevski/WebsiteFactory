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

export interface S3CloudFrontConfig extends ProviderConfig {
  readonly bucketName: string;
  readonly region: string;
  readonly distributionIdVariable?: string;
  readonly cacheControl?: string;
  readonly indexDocument?: string;
  readonly errorDocument?: string;
}

export function defineS3CloudFrontConfig(config: S3CloudFrontConfig): S3CloudFrontConfig {
  return config;
}

export function createS3CloudFrontAdapter(): DeploymentAdapter<S3CloudFrontConfig> {
  return {
    provider: "s3-cloudfront",
    createPlan: buildS3CloudFrontPlan,
    validateConfig: validateS3CloudFrontConfig
  };
}

export function buildS3CloudFrontPlan(config: S3CloudFrontConfig, artifact: StaticSiteArtifact): DeploymentPlan {
  const distributionIdVariable = config.distributionIdVariable ?? "CLOUDFRONT_DISTRIBUTION_ID";
  const cacheControl = config.cacheControl ?? "public,max-age=31536000,immutable";
  const diagnostics = validateS3CloudFrontConfig(config, artifact);

  return createDeploymentPlan({
    provider: "s3-cloudfront",
    projectName: config.projectName,
    artifact,
    environment: config.environment,
    branch: config.branch,
    configFiles: [
      createConfigFile(
        "deployment.s3-cloudfront.json",
        "json",
        renderS3CloudFrontConfig(config, cacheControl),
        "S3 bucket and CloudFront deployment metadata."
      )
    ],
    environmentVariables: [
      createEnvironmentVariable("AWS_REGION", "AWS region used for deployment commands.", config.region),
      createEnvironmentVariable(distributionIdVariable, "CloudFront distribution identifier for invalidations.")
    ],
    secrets: [
      createSecretReference("AWS_ACCESS_KEY_ID", "AWS access key for static deployment automation."),
      createSecretReference("AWS_SECRET_ACCESS_KEY", "AWS secret access key for static deployment automation.")
    ],
    diagnostics,
    steps: [
      createDeploymentStep("build", "Build static site", "Build the generated website.", resolveBuildCommand(artifact)),
      createDeploymentStep(
        "sync",
        "Sync to S3",
        "Upload static files to the S3 website bucket.",
        `aws s3 sync ${artifact.outputDirectory} s3://${config.bucketName} --delete --cache-control "${cacheControl}"`,
        ["build"]
      ),
      createDeploymentStep(
        "invalidate",
        "Invalidate CloudFront",
        "Invalidate CloudFront cache after upload.",
        `aws cloudfront create-invalidation --distribution-id "$${distributionIdVariable}" --paths "/*"`,
        ["sync"]
      )
    ],
    notes: ["AWS credentials are modeled as secret references and are never embedded in generated configuration."]
  });
}

export function validateS3CloudFrontConfig(
  config: S3CloudFrontConfig,
  artifact: StaticSiteArtifact
): readonly DeploymentDiagnostic[] {
  const diagnostics: DeploymentDiagnostic[] = [
    ...requireNonEmpty(config.projectName, "s3-cloudfront.project-name", "S3 deployment project name"),
    ...requireNonEmpty(config.bucketName, "s3-cloudfront.bucket-name", "S3 bucket name"),
    ...requireNonEmpty(config.region, "s3-cloudfront.region", "AWS region"),
    ...requireNonEmpty(artifact.outputDirectory, "s3-cloudfront.output-directory", "Output directory")
  ];

  return diagnostics;
}

function renderS3CloudFrontConfig(config: S3CloudFrontConfig, cacheControl: string): string {
  const payload = {
    bucketName: config.bucketName,
    region: config.region,
    cacheControl,
    indexDocument: config.indexDocument ?? "index.html",
    errorDocument: config.errorDocument ?? "404.html"
  };

  return `${JSON.stringify(payload, null, 2)}\n`;
}
