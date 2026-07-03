import type { PageValidationInput, SiteValidationInput, ValidationOptions, ValidationResult } from "./types.js";
import { createValidationResult } from "./result.js";
import { enrichFromHtml } from "./html.js";
import { runRules } from "./rules.js";
import { validateSchemaHooks } from "./schema.js";

export function validatePage(input: PageValidationInput, options: ValidationOptions = {}): ValidationResult {
  const page = enrichFromHtml(input);
  return createValidationResult(runRules(page, options.rules), options.failOnWarnings);
}

export function validateSite(input: SiteValidationInput, options: ValidationOptions = {}): ValidationResult {
  const schemaIssues = input.schema === undefined
    ? []
    : validateSchemaHooks(input.schema, options.schemaHooks);
  const pageIssues = (input.pages ?? []).flatMap((page) => {
    const withSiteTokens: PageValidationInput = {
      ...page,
      contrastTokens: page.contrastTokens ?? input.contrastTokens
    };
    return validatePage(withSiteTokens, options).issues;
  });

  return createValidationResult([...schemaIssues, ...pageIssues], options.failOnWarnings);
}

export function assertValidationPassed(result: ValidationResult): void {
  if (!result.ok) {
    const summary = `${result.summary.error} error(s), ${result.summary.warning} warning(s), ${result.summary.info} info`;
    throw new Error(`Website Factory validation failed: ${summary}.`);
  }
}
