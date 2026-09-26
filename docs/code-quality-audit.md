# Code Quality Audit — website-factory

**Date:** 2026-08-01; findings checked against the repository on 2026-09-25.
**Scope:** Report only — no package source changes as part of this audit.
The test inventory reflects the merged worktree, including subsequent fixes.

## Executive summary

The codebase has useful TypeScript strictness (`noUncheckedIndexedAccess`), package
build/typecheck scripts, and QA commands for axe, Lighthouse CI, linkinator, HTML
validation, and Playwright visual smoke. The root `lint` command is a placeholder,
and package decision logic has limited direct test coverage. Some small utility
implementations overlap across packages, though their contracts are not always identical.

## Findings by severity

### MEDIUM — limited direct tests for some package decision logic

The merged tree contains 13 `*.test.*` files under `apps/`, `packages/`, and
`scripts/`: one builder variation test, four package tests, and eight script tests.
These cover theme variation composition, AI feedback and pipeline transitions,
SEO artifacts, component accessibility, generator behavior, site graph validation,
and template fuzzing, among others. Direct tests of some decision logic remain sparse:

- `packages/generator/` (~3,100 lines) — `plan.ts`, `sections.ts`, `template.ts`, `inventory.ts`, `signals.ts`, `theme.ts` have some script smoke coverage but limited direct unit tests
- `packages/validation/` — `rules.ts` and `html.ts` have limited direct tests beyond site-graph and script validation checks
- `packages/schema/` (`index.ts`, 1,556-line Zod schema; covered in part by template fuzz tests)
- `packages/components/` — notably `marketplace.ts` (~2,700 lines) containing the
  `selectComponentMarketplaceImplementations` ranking algorithm, without direct tests
- `packages/ai/` and `packages/seo/` — scoring and JSON-LD builders lack direct
  tests; focused tests cover pipeline/feedback and SEO artifact behavior
- `packages/deployment/`, `packages/themes/` — lack direct tests; templates have fuzz coverage

AI, SEO, components, and the builder define focused `test` scripts. The root
`lint` script remains a stub (`echo "No linting configured yet."`). Root
`validate` runs build, typecheck, script and workspace tests, that stub, and
example validation; it does not run generated-site QA.

**Fix:** add focused unit tests for pure decision logic (generator planning, validation
rules, marketplace ranking, JSON-LD builders), and configure a real linter if
lint enforcement is desired.

### MEDIUM — overlapping types and helpers across packages

Several related helpers/types are implemented separately; not all are interchangeable:

- `JsonPrimitive` is identical in `packages/ai/src/common.ts` and `packages/seo/src/types.ts`,
  but their `JsonValue` contracts differ (readonly vs mutable; optional object values).
- `slugify` in `packages/ai/src/common.ts` and `packages/seo/src/schema-adapter.ts`
  performs similar normalization; the AI version also calls `.trim()`.
- `DiagnosticSeverity` and `ValidationSeverity` share values, but
  `GenerationDiagnostic` and `ValidationIssue` have different required fields.
- `optional()` has the same generic implementation and type assertion in
  `packages/seo/src/schema-adapter.ts` and `packages/seo/src/metadata.ts`.
- `readTwitterHandle` and `normalizeTwitterHandle` handle different input shapes.
  `sortText` trims, deduplicates and sorts; SEO's `unique` only filters and deduplicates.

**Fix:** consolidate truly identical helpers where useful; preserve each package's
different data contracts rather than moving everything into a shared package.

### MEDIUM — committed build artifacts in source trees

Compiled output is checked in alongside TypeScript source:

- `packages/themes/src/*.js`, `*.d.ts`, `*.d.ts.map` (engine, index, themes, types)
- `packages/schema/src/index.js`, `index.js.map`, `index.d.ts`, `index.d.ts.map`

**Fix:** decide which generated files are intentionally checked in and remove/ignore
unneeded outputs. Verify package consumers before deleting declarations: this repository
uses emitted `.js`/`.d.ts` files alongside some TypeScript source.

### MEDIUM — `components/types.d.ts` duplicates `types.ts`

`packages/components/src/types.d.ts` (221 lines) is a checked-in emitted declaration
beside `packages/components/src/types.ts` (279 lines), not necessarily a second
hand-maintained source of truth. Stale declarations can still drift from source.

**Fix:** establish whether declarations must remain checked in, then regenerate
or remove generated outputs consistently rather than deleting this file in isolation.

### MEDIUM — permissive SEO schema adaptation

`packages/ai` models failed pipeline steps and feedback-loop exhaustion explicitly
(`PipelineStepStatus`, `PipelineStepResult`, `FeedbackLoopState`). Current worktree
changes also throw for invalid step transitions and feedback options. It contains
provider-neutral contracts, not provider calls needing a network-error handler.
`packages/seo/src/schema-adapter.ts` accepts optional `Record<string, unknown>`
fields and substitutes defaults such as `"Website"` and `"https://example.com"`
when source fields are missing. This can mask invalid or incomplete input if callers
mistake the adapter for schema validation.

**Fix:** validate inputs at the adapter boundary or document its permissive fallback
contract; preserve AI's existing failure statuses when integrating an actual provider.

### MEDIUM — assertions worth reviewing in schema/SEO adapters

- `readRecord` asserts `Record<string, unknown>` after an object/array guard;
  both SEO `optional()` helpers assert a computed-key record, and `cleanJsonLd`
  asserts `T` after recursively removing empty values. The latter may overstate
  shape preservation when optional/empty properties are removed.
- AI pipeline initialization casts `Object.fromEntries` to
  `Record<string, PipelineStepStatus>` rather than inferring the values.
- Indexed accesses cited as unsafe are not demonstrated bugs:
  `images[0]` is passed to `optional()`, `offers[0]` is read only after a
  length check, and `sitemapUrls[0]` has a `??` fallback.

**Fix:** tighten the shape contract for `cleanJsonLd` and narrow assertions
where practical; do not add redundant guards to already handled indexed accesses.

### MEDIUM — magic strings & hardcoded config scattered across `ai`/`seo`/`components`

- Defaults `"Website"` / `"https://example.com"` (`schema-adapter.ts:61-62`), `"Untitled"` (`:287`), `bestRating: 5` / `worstRating: 0` (`:333-334`)
- `inferBusinessType` hardcodes a keyword→type map (`schema-adapter.ts:470-481`)
- Scoring weights as bare numbers in `recommendations.ts` (0.35/0.25/0.3/0.1/0.4/0.15)
- Repeated Tailwind color/typography classes in components (e.g. `text-blue-700`,
  `text-slate-950`); `ctaClassName`/`sectionClassName` do not cover all these styles
- Provider-specific names and environment variables in deployment adapters

**Fix:** centralize repeated styling or constants where it improves consistency;
provider-specific configuration may appropriately remain in its adapter.

### MEDIUM — UI duplication & dead branches in `packages/components`

- The eyebrow/title/description heading block is copy-pasted across `Gallery`, `Services`, `Team`, `Pricing`, `Testimonials`, `FAQ` — extract a shared `SectionHeader`
- `Footer` duplicates `Contact`'s phone/email href derivation and address
  formatting; `Contact.tsx` and `Utility.tsx` both format time ranges with an en dash
- "wrap body in `<a>`/`<div>`" pattern repeated in `Gallery.tsx:29-35`, `Services.tsx:40-46`, `Team.tsx` — extract a `LinkedCard`
- `Testimonials.tsx` declares `carousel-ready` but renders it like the default
  grid (only `quote` changes layout); `SocialLink.platform` is declared but not
  used by the current component renderers
- 7 deployment adapters are near-identical boilerplate (`netlify.ts:42-74`, `static-server.ts:38-58`)

### LOW — script & tooling duplication

- `validate-static-site.mjs` and `playwright-axe-smoke.mjs` independently
  default to `127.0.0.1:4173`; these CLI scripts can run separately, but the
  shared base URL could be configured in one place.
- `escapeXml` (`packages/seo/src/utils.ts:66-68`) is a no-op alias of `escapeHtml`; scattered `normalizePath`/`normalizeUrl`/`withoutTrailingSlash`/`formatIsoDate` helpers have no single owner.
- `createGenerationRequest` (`packages/ai/src/tasks.ts`) builds a
  `PromptEnvelope` from task messages/variables; `createTask` stores those
  separately, not as an existing envelope that can be reused.

### LOW — documentation

- No JSDoc/TSDoc on large public API surfaces (generator, validation, pipeline, JSON-LD builders).
- `SUGGESTIONS.md` (~12KB) and `RUNBOOK.md` exist at root alongside `README.md`; several `docs/*.md` files. Worth a pass for drift (not exhaustively audited here).

## Positives worth preserving

- `noUncheckedIndexedAccess` enabled in `tsconfig.base.json`; schema validation
  uses Zod (including `.strict()` on relevant object schemas).
- Clean barrel re-exports (`packages/generator/src/index.ts`).
- QA commands include axe, Lighthouse CI, linkinator, HTML validation,
  Playwright visual smoke, and template fuzzing; several tooling scripts have
  tests, but not each script, and generated-site QA is separate from `validate`.
- Root `validate` composes build → typecheck → script and workspace tests →
  placeholder lint → example validation.

## Deliverable

Audit document updated; no package source was modified as part of this audit.
