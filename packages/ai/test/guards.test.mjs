import assert from "node:assert/strict";
import { test } from "node:test";
import {
  appendFeedbackIteration,
  createFeedbackLoop,
  createInitialYamlPipelineState,
  createValidationIssue,
  createValidationReport,
  createYamlGenerationPipeline,
  getNextYamlPipelineStep,
  isYamlPipelineComplete,
  recordYamlPipelineStepResult,
  startYamlPipelineStep
} from "../dist/index.js";

const input = {
  siteName: "Example",
  business: { name: "Example" },
  requestedPages: [],
  requiredSections: [],
  templateCandidates: [],
  themeCandidates: [],
  constraints: []
};

test("pipeline rejects unknown and out-of-order step transitions without modifying state", () => {
  const initial = createInitialYamlPipelineState(createYamlGenerationPipeline(input));
  const first = getNextYamlPipelineStep(initial);
  assert.ok(first);
  const second = initial.pipeline.steps[1];
  assert.ok(second);

  assert.throws(() => startYamlPipelineStep(initial, "missing"), /unknown/);
  assert.throws(() => startYamlPipelineStep(initial, second.id), /pending/);
  assert.throws(() => recordYamlPipelineStepResult(initial, { stepId: first.id, status: "completed" }), /ready/);
  const running = startYamlPipelineStep(initial, first.id);
  assert.throws(() => startYamlPipelineStep(running, first.id), /running/);
  const advanced = recordYamlPipelineStepResult(running, { stepId: first.id, status: "completed" });
  assert.equal(getNextYamlPipelineStep(advanced)?.id, second.id);
  assert.equal(isYamlPipelineComplete(advanced), false);
  assert.equal(initial.stepStatuses[first.id], "ready");
});

test("a failed pipeline step cannot unlock dependent steps", () => {
  const initial = createInitialYamlPipelineState(createYamlGenerationPipeline(input));
  const first = getNextYamlPipelineStep(initial);
  assert.ok(first);
  const failed = recordYamlPipelineStepResult(startYamlPipelineStep(initial, first.id), {
    stepId: first.id,
    status: "failed"
  });
  assert.equal(getNextYamlPipelineStep(failed), undefined);
  assert.equal(isYamlPipelineComplete(failed), false);
  assert.equal(failed.stepStatuses[first.id], "failed");
});

test("feedback repair accepts a valid report but cannot reopen a terminal loop", () => {
  const blocking = createValidationReport([createValidationIssue("error", "invalid", "Invalid", "/")]);
  const valid = createValidationReport();
  const loop = createFeedbackLoop(blocking, { maxIterations: 2 });
  assert.equal(loop.status, "needs-repair");
  const accepted = appendFeedbackIteration(loop, valid);
  assert.equal(accepted.status, "accepted");
  assert.throws(() => appendFeedbackIteration(accepted, blocking), /accepted/);
  const failed = appendFeedbackIteration(loop, blocking);
  assert.equal(failed.status, "failed");
  assert.throws(() => appendFeedbackIteration(failed, valid), /failed/);
  assert.throws(() => createFeedbackLoop(blocking, { maxIterations: NaN }), RangeError);
});
