#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { validateSite } from "./validator.js";
import type { SiteValidationInput, ValidationOptions } from "./types.js";

interface CliConfig {
  site?: SiteValidationInput;
  options?: ValidationOptions;
}

export function runCli(argv = process.argv.slice(2)): number {
  const [configPath] = argv;
  if (!configPath || argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return configPath ? 0 : 1;
  }

  const resolved = resolve(configPath);
  const config = loadConfig(resolved);
  const site = isCliConfig(config) ? config.site ?? {} : config;
  const options = isCliConfig(config) ? config.options : undefined;
  const result = validateSite(site, options);

  for (const issue of result.issues) {
    const location = issue.path ? ` ${issue.path}` : "";
    const selector = issue.selector ? ` ${issue.selector}` : "";
    console.log(`${issue.severity.toUpperCase()} ${issue.ruleId}${location}${selector}: ${issue.message}`);
  }

  console.log(`Validation ${result.ok ? "passed" : "failed"}: ${result.summary.error} error(s), ${result.summary.warning} warning(s), ${result.summary.info} info. Score ${result.score}/100.`);
  return result.ok ? 0 : 1;
}

function loadConfig(path: string): CliConfig | SiteValidationInput {
  if (path.endsWith(".json")) {
    return JSON.parse(readFileSync(path, "utf8")) as CliConfig | SiteValidationInput;
  }

  throw new Error(`Unsupported config file ${path}. Use JSON, or import ${pathToFileURL(path).href} from a build script.`);
}

function isCliConfig(config: CliConfig | SiteValidationInput): config is CliConfig {
  return Boolean(config && typeof config === "object" && ("site" in config || "options" in config));
}

function printHelp(): void {
  console.log("Usage: website-factory-validate <config.json>");
  console.log("The JSON file may be a SiteValidationInput or { \"site\": SiteValidationInput, \"options\": ValidationOptions }.");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exitCode = runCli();
}
