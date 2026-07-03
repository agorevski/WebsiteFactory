# Website Factory Runbook

Operational procedures for developing, validating, building, handing off, and recovering generated Website Factory static sites.

## 1. Local setup

Work from the repository root.

```sh
node --version
npm --version
npm install --no-package-lock
```

The project is an npm workspace with packages under `packages/*` and the Astro builder app under `apps/website-builder`.

Use regular `npm install` instead if the repo adopts a lockfile. Generated-site QA also needs Playwright's Chromium browser, which LHCI uses through `scripts/run-lhci.mjs`:

```sh
npx playwright install chromium
```

If Chromium system libraries are missing, run `npx playwright install --with-deps chromium`; it may require sudo. Local LHCI filesystem reports do not need a GitHub token, so that warning is safe to ignore. HTML validation uses an optional local Nu checker at `http://127.0.0.1:8888/nu/`; absent Nu is recorded as skipped.

## 2. Install or refresh dependencies

Use the current npm install flow from the root:

```sh
npm install --no-package-lock
```

If dependencies appear stale, reinstall before debugging TypeScript or Astro errors. Use regular `npm install` instead if lockfile policy changes. Do not commit provider credentials, deployment tokens, or local environment files.

## 3. Validate the repository

Run the aggregate validation before handoff or after schema/template changes:

```sh
npm run validate
```

This runs workspace type checks, the lint placeholder, package/app builds, and example YAML validation. To validate only example sites:

```sh
npm run validate:examples
```

The example validator builds `@website-factory/schema` when needed, checks required app/doc files, verifies required YAML tokens, parses each `examples/**/website.yaml`, and checks for unique slugs and required vertical coverage.

## 4. Build the static app

To clean generated outputs and regenerate every website from scratch:

```sh
npm run regenerate:websites
```

This runs `npm run clean`, a dependency-ordered `npm run build`, and `npm run validate:examples`. The regenerated static websites are written to `apps/website-builder/dist`.

For a complete dependency-ordered build:

```sh
npm run build
```

For only the Astro builder app after packages are already built:

```sh
npm run build --workspace @website-factory/website-builder
```

The static output is written to:

```text
apps/website-builder/dist
```

The builder post-processes generated HTML so `_astro` and theme asset URLs are relative to each page. You can serve `apps/website-builder/dist` with `npm run preview --workspace @website-factory/website-builder`, deploy it to a static host, or open `apps/website-builder/dist/index.html` directly from the filesystem without Chrome looking for `file:///_astro/...`.

### Compile and validate Madrona Family Dental

The Madrona Family Dental source file is:

```text
examples/wa/seattle/98122/madrona-family-dental/website.yaml
```

After editing that YAML, validate all example site data from the repository root:

```sh
npm run validate:examples
```

Then compile the static builder app:

```sh
npm run build --workspace @website-factory/website-builder
```

The generated Madrona page is written to:

```text
apps/website-builder/dist/madrona-family-dental/index.html
```

The route in local preview or deployment is `/madrona-family-dental/`. Use `vertical: medical`, `theme.palette: clinic`, and the registered `theme.name: dentalClinic` when available. Keep the YAML conservative: if official pages are unavailable or return errors, document that content relies on indexed official snippets, public listings, and practice review rather than unsourced claims.

For Madrona-specific generator confidence after package outputs are current, run the generator smoke check in section 6 and confirm the plan resolves a clinic/dental theme, service/contact/FAQ-oriented sections, and the expected `/madrona-family-dental/` route. For a full pre-handoff check after schema, package, or rendering changes, run `npm run validate` instead of only the example validator.

## 5. Run the Astro dev server

Start the local development server from the root:

```sh
npm run dev --workspace @website-factory/website-builder
```

The app reads validated `website.yaml` files recursively under `examples/` and generates routes from each example `slug`.

## 6. Add or edit example YAML sites

Example generated sites live at:

```text
examples/<site-name>/website.yaml
examples/<state>/<city>/<zipcode>/<business-name>/website.yaml
```

Use an existing example such as `examples/dentist/website.yaml` as the safest starting point. Keep these fields present and aligned with the universal site schema:

- `schemaVersion`
- `slug`
- `vertical`
- `theme`
- `seo`
- `business`
- `navigation`
- `hero`
- `sections`
- `ctas.final`
- `pages`

After adding or editing a site, run:

```sh
npm run validate:examples
```

If the site should be visible in the demo, confirm the `slug` is lowercase, URL-safe, and unique. The Astro route will be `/<slug>/`.

### Schema, theme, template, and component selection

Use this workflow before writing or refreshing YAML:

| Decision | How to choose | Source of truth |
| --- | --- | --- |
| Schema level | Always keep required universal fields. Add optional `content.version: 2` when source facts support normalized services, locations, people, FAQ, booking, compliance, media, or review data. | `packages/schema/src/index.ts` exports `universalSiteSchema`, `UniversalSiteSchema`, `parseUniversalSite`, and `universalContentV2Schema`. |
| Vertical | Use the broad existing top-level vertical for builder compatibility; use `content.verticals` for normalized v2 detail. | Existing examples and `normalizedVerticalSchema`. |
| Theme | Keep `theme.palette` as `clinic`, `trade`, `hospitality`, or `professional`; set `theme.name` to a registered theme such as `dentalClinic` when the registry supports the content. | `packages/themes/src/themes.ts`, `packages/themes/src/index.ts`, `selectThemeForContent`. |
| Page template | Use only schema-supported `pages[].template` values: `landing` or `service-index`. Root pages usually use `landing`; service directories use `service-index`. | `packages/schema/src/index.ts`; app route mapping in `apps/website-builder/src/lib/pages.ts`. |
| Sections | Use universal section types: `services`, `proof`, `process`, `testimonials`, `faq`, `content`. Prefer `content` over fabricated testimonials for unsourced review themes. | `universalSectionSchema`; existing examples. |
| Components | Do not put component variants in YAML. Provide content signals/data and let the generator and marketplace select implementations. | `packages/components/src/marketplace.ts`, `packages/generator/src/index.ts`. |
| Quality | Keep titles, descriptions, canonical paths, alt text, source notes, and regulated-content disclaimers reviewable. | `packages/seo/src/index.ts`, `packages/validation/src/index.ts`. |

### Generator smoke check

Run this when adding v2 content, changing theme names, adding page mappings, or when section choices are uncertain. Build dependent packages first if their `dist` output is stale.

```sh
npm run build --workspace @website-factory/schema
npm run build --workspace @website-factory/themes
npm run build --workspace @website-factory/components
npm run build --workspace @website-factory/seo
npm run build --workspace @website-factory/generator
node --input-type=module -e "import { readFileSync } from 'node:fs'; import { parseUniversalSite } from './packages/schema/dist/index.js'; import { createGenerationPlan, validateGenerationPlan } from './packages/generator/dist/index.js'; const site = parseUniversalSite(readFileSync('examples/wa/seattle/98122/madrona-family-dental/website.yaml', 'utf8'), 'examples/wa/seattle/98122/madrona-family-dental/website.yaml'); const plan = createGenerationPlan(site); const validation = validateGenerationPlan(plan); console.log(JSON.stringify({ theme: plan.theme.resolvedThemeId, sections: plan.sections.map((section) => section.id), routes: plan.staticPlan.routes.map((route) => route.path), diagnostics: validation.diagnostics }, null, 2)); if (!validation.valid) process.exit(1);"
```

The smoke check is not a replacement for `npm run validate:examples`; it confirms the generator can infer content signals, select marketplace components, resolve themes, and create static route plans from the YAML.

## 7. Debug schema validation failures

Start with the focused validator:

```sh
npm run validate:examples
```

Schema failures usually include a source file and field path, for example `Invalid universal site YAML in examples/.../website.yaml: sections.0.items.0.title: Required`. Fix the first reported structural error, then rerun validation.

Common checks:

- YAML syntax: indentation, quoted values containing `:`, and list markers.
- Required top-level keys listed in section 6.
- `pages[].sections` references match `sections[].id`.
- CTA fields use `label`, `href`, and supported variants.
- `seo.canonicalPath` matches the intended route shape.
- `slug` uses lowercase letters, numbers, and hyphens only.

For schema package fixture validation:

```sh
npm run validate --workspace @website-factory/schema
```

## 8. Troubleshoot TypeScript or package build issues

Run the smallest useful check first:

```sh
npm run typecheck
```

If generated package output is missing or stale, rebuild in root dependency order:

```sh
npm run build
```

For package-specific failures, use that workspace directly:

```sh
npm run build --workspace @website-factory/schema
npm run typecheck --workspace @website-factory/schema
```

Package import errors often mean an upstream workspace has not produced `dist` yet. Build from the root before rerunning the app build.

## 9. Clean generated outputs

Only clean generated artifacts when no one needs the current local build output. This removes `dist`, `.astro`, and TypeScript build-info files:

```sh
npm run clean
```

After cleaning, rebuild before running validation or deployment checks:

```sh
npm run build
```

## 10. Check static deployment readiness

Before handing off a generated site or publishing artifacts:

```sh
npm run validate
./scripts/run-generated-qa.sh
```

The QA report runner builds and serves the generated site, runs LHCI, Playwright/axe, linkinator/static checks, and HTML validation when the local Nu checker is available, then writes artifacts under `qa-reports/generated-site/<timestamp>/`.

Treat failed layers as blockers before handoff. Attach or summarize the timestamped report directory with the static artifact; call out any skipped HTML validation explicitly. HTML validation needs a local Nu checker at `http://127.0.0.1:8888/nu/`: the report script records HTML as skipped when it is absent, while `npm run qa:generated:html` requires it. If Playwright Chromium is missing, return to the local setup prerequisite.

Review `apps/website-builder/dist` as the deployable static artifact. Ensure generated routes, canonical paths, static assets, headings, CTAs, and contact links match the YAML source.

## 11. Provider-agnostic deployment handoff

Keep deployment provider details outside app behavior. The Astro app builds static files; provider-specific redirects, forms, analytics, credentials, image optimization, and environment setup belong in adapter/handoff configuration.

Use this handoff shape:

- Site root: repository root
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `apps/website-builder/dist`
- Artifact type: static files
- Required secrets: none for local static generation; provider tokens stay outside the repo

The `@website-factory/deployment` package contains provider-separated adapter contracts for GitHub Pages, Cloudflare Pages, Azure Static Web Apps, Netlify, Vercel, S3 + CloudFront, and generic static hosting. Treat those adapters as handoff planners, not runtime requirements for generated pages.

## 12. Emergency rollback and recovery for generated sites

If a generated site is broken in production:

1. Stop further publishes from the failing artifact.
2. Restore the last known-good static artifact through the hosting provider or deployment pipeline.
3. Identify the changed YAML, schema, template, theme, or package change that produced the bad artifact.
4. Reproduce locally with `npm run validate:examples` and `npm run build`.
5. Correct the source data or code, then rerun `npm run validate`.
6. Hand off a newly built `apps/website-builder/dist` artifact only after validation passes.

For data-only incidents, prefer reverting or correcting the affected `website.yaml` under `examples/` and rebuilding. For schema/template/package incidents, validate all examples before republishing because one shared component can affect every generated site.
