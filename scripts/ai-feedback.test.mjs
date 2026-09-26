import assert from 'node:assert/strict';
import test from 'node:test';
import {
  appendFeedbackIteration,
  buildValidationRepairPrompt,
  compareValidationReports,
  createFeedbackLoop,
  createValidationIssue,
  createValidationReport,
} from '../packages/ai/dist/index.js';

const issue = (code, severity = 'error', message = code, path = 'content') =>
  createValidationIssue(severity, code, message, path);
const report = (...issues) => createValidationReport(issues);
const a = issue('a');
const b = issue('b');
const c = issue('c');

test('report diffs ignore message changes and retain current persistent issue details', () => {
  const changed = issue('b', 'error', 'Changed explanation');
  const progress = compareValidationReports(report(a, b), report(c, changed));
  assert.deepEqual(progress, { resolved: [a], introduced: [c], persistent: [changed] });
});

test('report diffs are deterministic, deduplicated, and distinguish paths and severities', () => {
  const warning = issue('a', 'warning');
  const elsewhere = issue('a', 'error', 'a', 'other');
  const before = report(a, a, b);
  const after = report(elsewhere, warning, b, b);
  const progress = compareValidationReports(before, after);
  assert.deepEqual(progress.resolved, [a]);
  assert.equal(progress.introduced.length, 2);
  assert.deepEqual(progress.persistent, [b]);
  assert.deepEqual(progress, compareValidationReports(report(b, a), report(b, warning, elsewhere)));
});

test('duplicate issue messages have order-independent representatives', () => {
  const changed = issue('a', 'error', 'Different message');
  assert.deepEqual(
    compareValidationReports(report(), report(a, changed)),
    compareValidationReports(report(), report(changed, a)),
  );
});

test('default repair budget remains three iterations without early stopping', () => {
  let state = createFeedbackLoop(report(a));
  state = appendFeedbackIteration(state, report(a));
  assert.equal(state.status, 'needs-repair');
  state = appendFeedbackIteration(state, report(a));
  assert.equal(state.status, 'failed');
  assert.equal(state.iterations.at(-1).failureReason, 'iteration-limit');
});

test('repeated blocking signatures fail early even if messages change', () => {
  const state = createFeedbackLoop(report(a), { stopOnRepeatedIssues: true });
  const next = appendFeedbackIteration(state, report(issue('a', 'error', 'New message')));
  assert.equal(next.status, 'failed');
  assert.equal(next.iterations.at(-1).failureReason, 'stagnation');
  assert.equal(state.status, 'needs-repair');
  assert.equal(state.iterations.length, 1);
});

test('nonadjacent repeated blocking signatures detect oscillation', () => {
  let state = createFeedbackLoop(report(a), { maxIterations: 5, stopOnRepeatedIssues: true });
  state = appendFeedbackIteration(state, report(b));
  state = appendFeedbackIteration(state, report(a));
  assert.equal(state.status, 'failed');
  assert.equal(state.iterations.at(-1).failureReason, 'oscillation');
});

test('shrinking issue sets continue and report progress until accepted', () => {
  let state = createFeedbackLoop(report(a, b), { stopOnRepeatedIssues: true });
  state = appendFeedbackIteration(state, report(b));
  assert.equal(state.status, 'needs-repair');
  assert.deepEqual(state.iterations.at(-1).progress.resolved, [a]);
  state = appendFeedbackIteration(state, report());
  assert.equal(state.status, 'accepted');
  assert.equal(state.iterations.at(-1).failureReason, undefined);
});

test('warning changes cannot mask stalled errors, but warnings can be blocking', () => {
  let state = createFeedbackLoop(report(a), { stopOnRepeatedIssues: true });
  state = appendFeedbackIteration(state, report(a, issue('warning', 'warning')));
  assert.equal(state.iterations.at(-1).failureReason, 'stagnation');
  state = createFeedbackLoop(report(issue('warning', 'warning')), {
    failOnSeverity: 'warning', stopOnRepeatedIssues: true,
  });
  state = appendFeedbackIteration(state, report(issue('warning', 'warning')));
  assert.equal(state.iterations.at(-1).failureReason, 'stagnation');
  assert.equal(createFeedbackLoop(report(issue('warning', 'warning'))).status, 'accepted');
});

test('accepted and failed feedback loops cannot be reopened', () => {
  assert.throws(() => appendFeedbackIteration(createFeedbackLoop(report()), report(a)), /accepted/);
  const failed = createFeedbackLoop(report(a), { maxIterations: 1 });
  assert.equal(failed.iterations[0].failureReason, 'iteration-limit');
  assert.throws(() => appendFeedbackIteration(failed, report()), /failed/);
});

test('iteration budgets must be positive safe integers', () => {
  for (const maxIterations of [NaN, Infinity, -Infinity, 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => createFeedbackLoop(report(a), { maxIterations }), RangeError);
  }
  assert.equal(createFeedbackLoop(report(), { maxIterations: 1 }).status, 'accepted');
});

test('repair prompts optionally carry deterministic progress', () => {
  const current = report(b);
  const progress = compareValidationReports(report(a, b), current);
  const baseline = buildValidationRepairPrompt('yaml', current);
  const prompt = buildValidationRepairPrompt('yaml', current, [], progress);
  assert.equal(baseline.variables.progress, undefined);
  assert.deepEqual(prompt.variables.progress, {
    resolved: [{ code: 'a', path: 'content', severity: 'error' }],
    introduced: [],
    persistent: [{ code: 'b', path: 'content', severity: 'error' }],
  });
  assert.notEqual(prompt.id, baseline.id);
  assert.deepEqual(prompt, buildValidationRepairPrompt('yaml', current, [], progress));
});
