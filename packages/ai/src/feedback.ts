import { createDeterministicId, type GenerationDiagnostic } from "./common.js";

export type ValidationSeverity = "info" | "warning" | "error";

export interface ValidationIssue {
  readonly id: string;
  readonly severity: ValidationSeverity;
  readonly code: string;
  readonly message: string;
  readonly path: string;
  readonly suggestion?: string;
}

export interface ValidationReport {
  readonly id: string;
  readonly valid: boolean;
  readonly issues: readonly ValidationIssue[];
  readonly diagnostics: readonly GenerationDiagnostic[];
}

export interface FeedbackLoopOptions {
  readonly maxIterations: number;
  readonly failOnSeverity: ValidationSeverity;
}

export interface FeedbackIteration {
  readonly id: string;
  readonly index: number;
  readonly report: ValidationReport;
  readonly action: "accept" | "repair" | "fail";
}

export interface FeedbackLoopState {
  readonly id: string;
  readonly options: FeedbackLoopOptions;
  readonly iterations: readonly FeedbackIteration[];
  readonly status: "pending" | "accepted" | "needs-repair" | "failed";
}

const DEFAULT_FEEDBACK_OPTIONS: FeedbackLoopOptions = {
  maxIterations: 3,
  failOnSeverity: "error"
};

export function createValidationIssue(
  severity: ValidationSeverity,
  code: string,
  message: string,
  path: string,
  suggestion?: string
): ValidationIssue {
  const base = {
    id: createDeterministicId("validation-issue", severity, code, message, path),
    severity,
    code,
    message,
    path
  };

  if (suggestion === undefined) {
    return base;
  }

  return { ...base, suggestion };
}

export function createValidationReport(
  issues: readonly ValidationIssue[] = [],
  diagnostics: readonly GenerationDiagnostic[] = []
): ValidationReport {
  const sortedIssues = [...issues].sort((left, right) => left.id.localeCompare(right.id));

  return {
    id: createDeterministicId("validation-report", sortedIssues, diagnostics),
    valid: sortedIssues.every((issue) => issue.severity !== "error"),
    issues: sortedIssues,
    diagnostics
  };
}

export function createFeedbackLoop(
  initialReport: ValidationReport,
  options: Partial<FeedbackLoopOptions> = {}
): FeedbackLoopState {
  const resolvedOptions = resolveFeedbackOptions(options);
  const firstIteration = enforceIterationLimit(
    createFeedbackIteration(0, initialReport, resolvedOptions),
    1,
    resolvedOptions.maxIterations
  );

  return {
    id: createDeterministicId("feedback-loop", initialReport.id, resolvedOptions),
    options: resolvedOptions,
    iterations: [firstIteration],
    status: statusFromIteration(firstIteration)
  };
}

export function appendFeedbackIteration(
  state: FeedbackLoopState,
  report: ValidationReport
): FeedbackLoopState {
  const nextIteration = enforceIterationLimit(
    createFeedbackIteration(state.iterations.length, report, state.options),
    state.iterations.length + 1,
    state.options.maxIterations
  );
  const iterations = [...state.iterations, nextIteration];

  return {
    ...state,
    iterations,
    status: statusFromIteration(nextIteration)
  };
}

export function nextFeedbackAction(state: FeedbackLoopState): FeedbackIteration["action"] {
  const latest = state.iterations.at(-1);

  return latest?.action ?? "repair";
}

export function reportHasBlockingIssues(
  report: ValidationReport,
  failOnSeverity: ValidationSeverity = "error"
): boolean {
  const threshold = severityRank(failOnSeverity);

  return report.issues.some((issue) => severityRank(issue.severity) >= threshold);
}

function createFeedbackIteration(
  index: number,
  report: ValidationReport,
  options: FeedbackLoopOptions
): FeedbackIteration {
  const action = reportHasBlockingIssues(report, options.failOnSeverity) ? "repair" : "accept";

  return {
    id: createDeterministicId("feedback-iteration", index, report.id, action),
    index,
    report,
    action
  };
}

function enforceIterationLimit(
  iteration: FeedbackIteration,
  totalIterations: number,
  maxIterations: number
): FeedbackIteration {
  if (iteration.action !== "repair" || totalIterations < maxIterations) {
    return iteration;
  }

  return {
    ...iteration,
    id: createDeterministicId("feedback-iteration", iteration.index, iteration.report.id, "fail"),
    action: "fail"
  };
}

function resolveFeedbackOptions(options: Partial<FeedbackLoopOptions>): FeedbackLoopOptions {
  return {
    ...DEFAULT_FEEDBACK_OPTIONS,
    ...options,
    maxIterations: Math.max(1, Math.trunc(options.maxIterations ?? DEFAULT_FEEDBACK_OPTIONS.maxIterations))
  };
}

function statusFromIteration(iteration: FeedbackIteration): FeedbackLoopState["status"] {
  if (iteration.action === "accept") {
    return "accepted";
  }

  if (iteration.action === "fail") {
    return "failed";
  }

  return "needs-repair";
}

function severityRank(severity: ValidationSeverity): number {
  switch (severity) {
    case "info":
      return 1;
    case "warning":
      return 2;
    case "error":
      return 3;
  }
}
