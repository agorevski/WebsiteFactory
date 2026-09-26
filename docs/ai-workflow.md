# AI Workflow

A safe AI workflow should be reviewable and schema-first:

1. Collect business facts from intake forms, CRM records, or approved prompts.
2. Ask the model to produce universal YAML only, not framework code.
3. Validate YAML with Zod and reject missing or unsafe fields.
4. Use generator smoke checks to infer content signals, theme selection, section candidates, marketplace components, routes, and diagnostics.
5. Run editorial checks for claims, regulated content, tone, and duplicate copy.
6. Render a static preview in the builder app.
7. Let a human approve before publishing.

For regulated verticals such as medical or legal, the AI step should avoid unsupported claims and require domain review before deployment.

## Deterministic repair progress

`@website-factory/ai` exposes `compareValidationReports(previous, current)` to
classify resolved, introduced, and persistent issues by code, path, and severity.
Message wording and issue ordering do not change their identity; duplicate
identities are collapsed. Each appended feedback iteration includes this progress.
Pass it as the optional fourth argument to `buildValidationRepairPrompt` to give
the next repair task explicit regression and progress context.

Feedback loops retain the default three-report budget and severity threshold.
Set `stopOnRepeatedIssues: true` to stop early when the blocking issue set repeats:
`stagnation` means it matches the previous report, while `oscillation` means it
matches an earlier report. Nonblocking changes do not disguise repeated blocking
issues. This is opt-in because unchanged issue identities can still describe
partial improvements within a field; it is not a measure of factual accuracy.
Otherwise unresolved issues stop with `failureReason: "iteration-limit"`.

`maxIterations` counts the initial report and must be a positive safe integer.
Accepted and failed loops are terminal; appending to them throws. Start a new
loop for a deliberately renewed repair attempt. These contracts describe
validation progress only: repaired YAML still needs fresh schema validation,
static-preview review, and human approval before publishing.

Focused regression tests run after building the AI workspace:
`npm run build --workspace @website-factory/ai && node --test scripts/ai-feedback.test.mjs`.
