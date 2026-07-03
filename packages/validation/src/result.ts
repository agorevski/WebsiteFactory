import type { ValidationIssue, ValidationResult, ValidationSeverity, ValidationSummary } from "./types.js";

const severityWeight: Record<ValidationSeverity, number> = {
  error: 15,
  warning: 5,
  info: 1
};

export function createIssue(issue: ValidationIssue): ValidationIssue {
  return issue;
}

export function summarizeIssues(issues: ValidationIssue[]): ValidationSummary {
  return issues.reduce<ValidationSummary>(
    (summary, issue) => ({
      ...summary,
      [issue.severity]: summary[issue.severity] + 1
    }),
    { error: 0, warning: 0, info: 0 }
  );
}

export function createValidationResult(issues: ValidationIssue[], failOnWarnings = false): ValidationResult {
  const summary = summarizeIssues(issues);
  const penalty = issues.reduce((total, issue) => total + severityWeight[issue.severity], 0);
  const score = Math.max(0, 100 - penalty);

  return {
    ok: summary.error === 0 && (!failOnWarnings || summary.warning === 0),
    score,
    issues,
    summary
  };
}

export function mergeValidationResults(results: ValidationResult[], failOnWarnings = false): ValidationResult {
  return createValidationResult(results.flatMap((result) => result.issues), failOnWarnings);
}
