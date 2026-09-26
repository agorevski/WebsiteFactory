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
  readonly stopOnRepeatedIssues?: boolean;
}

export interface FeedbackProgress {
  readonly resolved: readonly ValidationIssue[];
  readonly introduced: readonly ValidationIssue[];
  readonly persistent: readonly ValidationIssue[];
}

export interface FeedbackIteration {
  readonly id: string;
  readonly index: number;
  readonly report: ValidationReport;
  readonly action: "accept" | "repair" | "fail";
  readonly progress?: FeedbackProgress;
  readonly failureReason?: "iteration-limit" | "stagnation" | "oscillation";
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
  if (state.status !== "needs-repair") {
    throw new Error(`Cannot append feedback to a "${state.status}" loop`);
  }

  const previous = state.iterations.at(-1);
  const iteration = {
    ...createFeedbackIteration(state.iterations.length, report, state.options),
    progress: compareValidationReports(previous?.report ?? createValidationReport(), report)
  };
  const signature = blockingSignature(report, state.options.failOnSeverity);
  const repeated = state.options.stopOnRepeatedIssues && iteration.action === "repair"
    && state.iterations.some((entry) => blockingSignature(entry.report, state.options.failOnSeverity) === signature);
  const nextIteration = repeated
    ? failIteration(iteration, previous && blockingSignature(previous.report, state.options.failOnSeverity) === signature ? "stagnation" : "oscillation")
    : enforceIterationLimit(
      iteration,
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

export function compareValidationReports(
  previous: ValidationReport,
  current: ValidationReport
): FeedbackProgress {
  const before = indexIssues(previous.issues);
  const after = indexIssues(current.issues);

  return {
    resolved: [...before].filter(([key]) => !after.has(key)).map(([, issue]) => issue),
    introduced: [...after].filter(([key]) => !before.has(key)).map(([, issue]) => issue),
    persistent: [...after].filter(([key]) => before.has(key)).map(([, issue]) => issue)
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

  return failIteration(iteration, "iteration-limit");
}

function failIteration(
  iteration: FeedbackIteration,
  failureReason: NonNullable<FeedbackIteration["failureReason"]>
): FeedbackIteration {
  return {
    ...iteration,
    id: createDeterministicId("feedback-iteration", iteration.index, iteration.report.id, "fail", failureReason),
    action: "fail",
    failureReason
  };
}

function resolveFeedbackOptions(options: Partial<FeedbackLoopOptions>): FeedbackLoopOptions {
  const maxIterations = options.maxIterations ?? DEFAULT_FEEDBACK_OPTIONS.maxIterations;
  if (!Number.isSafeInteger(maxIterations) || maxIterations < 1) {
    throw new RangeError("maxIterations must be a positive safe integer.");
  }

  return {
    ...DEFAULT_FEEDBACK_OPTIONS,
    ...options,
    maxIterations
  };
}

function issueSignature(issue: ValidationIssue): string {
  return JSON.stringify([issue.code, issue.path, issue.severity]);
}

function indexIssues(issues: readonly ValidationIssue[]): ReadonlyMap<string, ValidationIssue> {
  return new Map([...issues]
    .sort((left, right) => {
      const leftKey = JSON.stringify([issueSignature(left), left.message, left.suggestion ?? "", left.id]);
      const rightKey = JSON.stringify([issueSignature(right), right.message, right.suggestion ?? "", right.id]);
      return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
    })
    .map((issue) => [issueSignature(issue), issue]));
}

function blockingSignature(report: ValidationReport, threshold: ValidationSeverity): string {
  return JSON.stringify([...indexIssues(report.issues.filter((issue) =>
    severityRank(issue.severity) >= severityRank(threshold))).keys()]);
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
