# Website Factory

Website Factory is a schema-first static website generation workspace. It turns a portable YAML description of a local business into static Astro pages rendered with reusable React sections, token-driven themes, SEO/static artifact helpers, validation utilities, and provider-agnostic deployment contracts.

The current repository is a private npm workspace and demonstration platform. It includes example verticals, researched local-business templates, a static builder app, and supporting packages that define the boundaries for schema validation, templates, themes, components, SEO, AI-assisted content generation, quality checks, and deployment planning.

## Architecture pipeline

1. **Content starts as YAML** in `examples/**/website.yaml`. A file describes a business, theme, SEO metadata, navigation, hero content, reusable sections, final CTAs, and page mappings.
2. **`@website-factory/schema` validates the YAML** with Zod. The builder app imports `parseUniversalSite` through `apps/website-builder/src/lib/schema.ts` and fails fast on invalid content.
3. **The builder app discovers examples at build time** from `apps/website-builder/src/lib/examples.ts`, sorts them by business name, and exposes them to Astro pages.
4. **Astro generates static routes**. `src/pages/index.astro` renders the example gallery, and `src/pages/[slug].astro` uses `getStaticPaths()` to generate one route for each example slug.
5. **Templates and React components render sections**. `UniversalLandingPage.astro` composes the site shell, header, hero, section renderer, and footer from structured data.
6. **Theme tokens control presentation**. Example YAML selects a palette, mode, and radius; theme helpers and CSS variables keep styling data-driven.
7. **Quality, SEO, AI, and deployment packages stay provider-neutral**. Supporting packages expose contracts and helpers rather than host-specific runtime code.

## Prerequisites

- Node.js and npm with workspace support. The repo does not currently define an `engines` field or `.nvmrc`, so use the project/team standard Node version for this workspace.
- No deployment provider CLI is required for local development.
- Dependencies are installed with npm from the root workspace.

## Quick start

```bash
npm install
npm run validate:examples
npm run dev --workspace @website-factory/website-builder
```

Astro prints the local development URL. The index page lists the generated examples, and each example is available at its configured slug, such as `/bright-smiles-dental/`.

For a production-style static build:

```bash
npm run build
npm run preview --workspace @website-factory/website-builder
```

The static output for the demo app is written to `apps/website-builder/dist`.

## Workspace layout

```text
.
├── apps/
│   └── website-builder/       # Static Astro demo app
├── docs/                      # Architecture and workflow notes
├── examples/                  # Example universal YAML sites
├── packages/                  # Shared workspace packages
├── scripts/                   # Root validation scripts
├── package.json               # Private npm workspace and root scripts
└── tsconfig.base.json         # Strict shared TypeScript baseline
```

## Packages and apps

| Workspace | Purpose |
| --- | --- |
| `@website-factory/website-builder` | Astro app that validates example YAML, renders the example index, and generates static pages for each site slug. |
| `@website-factory/schema` | Universal Zod schema, YAML parsing, exported TypeScript types, and AI-friendly validation errors. |
| `@website-factory/components` | Semantic React UI sections for navigation, hero, services, FAQ, testimonials, gallery, team, pricing, contact, footer, and utility blocks. |
| `@website-factory/templates` | Data-only template definitions and composition helpers that map schema sections to component variants. |
| `@website-factory/themes` | Theme token registry and helpers for palettes, modes, typography, spacing, radius, elevation, navigation, and footer styling. |
| `@website-factory/seo` | Metadata, JSON-LD, sitemap, image sitemap, robots.txt, RSS, and SEO normalization helpers. |
| `@website-factory/validation` | Schema, SEO, accessibility, responsive, performance, contrast, checklist, and CLI validation primitives. |
| `@website-factory/ai` | Provider-agnostic AI research/content/feedback/prompt/task orchestration contracts. |
| `@website-factory/deployment` | Static deployment plan builders and provider config abstractions for GitHub Pages, Cloudflare Pages, Azure Static Web Apps, Netlify, Vercel, S3 + CloudFront, and generic static hosting. |

## Common scripts

Run commands from the repository root unless noted.

| Command | What it does |
| --- | --- |
| `npm run build` | Builds packages in dependency order, then builds `@website-factory/website-builder`. |
| `npm run typecheck` | Runs `typecheck` in workspaces that define it. |
| `npm run lint` | Placeholder command that currently prints `No linting configured yet.` |
| `npm run validate` | Runs typecheck, lint, full build, and example schema validation. |
| `npm run validate:examples` | Runs `scripts/validate-website-builder.mjs` through the builder workspace. |
| `./scripts/run-generated-qa.sh` | Runs generated-site QA and writes a timestamped report under `qa-reports/generated-site/`. |
| `npm run qa:generated` | Builds, serves the Astro preview at `127.0.0.1:4173`, then runs LHCI, Playwright/axe, and link/static checks. |
| `npm run qa:generated:build` | Runs the full workspace build used by generated-site QA. |
| `npm run qa:generated:serve` | Serves the built Astro site at `http://127.0.0.1:4173`. |
| `npm run qa:generated:lhci` | Runs Lighthouse CI with `lighthouserc.cjs`. |
| `npm run qa:generated:playwright` | Runs the Playwright browser smoke crawl with axe accessibility checks. |
| `npm run qa:generated:static` | Runs linkinator local link/static resource checks; skips HTML validation. |
| `npm run qa:generated:html` | Runs `html-validator-cli` against a local Nu HTML checker; skips linkinator. |
| `npm run clean` | Removes common generated outputs such as `dist`, `.astro`, and TypeScript build info files. |
| `npm run regenerate:websites` | Cleans generated outputs, rebuilds all packages and websites, then validates example YAML. |
| `npm run dev --workspace @website-factory/website-builder` | Starts the Astro dev server for the demo app. |
| `npm run build --workspace @website-factory/website-builder` | Builds only the Astro demo app. |
| `npm run preview --workspace @website-factory/website-builder` | Serves the last builder app build locally with Astro preview. |
| `npm run validate --workspace @website-factory/schema` | Builds the schema package and validates its fixture. |

## Example sites

Each example lives at `examples/<name>/website.yaml` or, for location-split local businesses, `examples/<state>/<city>/<zipcode>/<business-name>/website.yaml`. The builder app discovers `website.yaml` files recursively.

| Example file | Business | Vertical | Theme palette | Generated route |
| --- | --- | --- | --- | --- |
| `examples/dentist/website.yaml` | Bright Smiles Dental | `medical` | `clinic` | `/bright-smiles-dental/` |
| `examples/wa/seattle/98122/madrona-family-dental/website.yaml` | Madrona Family Dental | `medical` | `clinic` | `/madrona-family-dental/` |
| `examples/plumber/website.yaml` | Summit Plumbing | `home-services` | `trade` | `/summit-plumbing/` |
| `examples/restaurant/website.yaml` | Ember & Olive | `food` | `hospitality` | `/ember-and-olive/` |
| `examples/lawyer/website.yaml` | Northstar Legal | `professional` | `professional` | `/northstar-legal/` |

These examples demonstrate how the same data contract supports healthcare, home services, hospitality, and professional services without changing the rendering pipeline.

## Schema and content workflow

1. Create or edit `examples/<site>/website.yaml`, or use `examples/<state>/<city>/<zipcode>/<business-name>/website.yaml` for location-split local business examples.
2. Keep required top-level fields present: `schemaVersion`, `slug`, `vertical`, `theme`, `seo`, `business`, `navigation`, `hero`, `sections`, and `pages`.
3. Use a unique kebab-case `slug`; it becomes the generated route.
4. Choose a supported universal theme shape: `theme.palette` is one of `clinic`, `trade`, `hospitality`, or `professional`; `theme.mode` is `light` or `dark`; `theme.radius` is `soft`, `rounded`, or `crisp`.
5. Add ordered content blocks under `sections`. Supported universal section types are `services`, `proof`, `process`, `testimonials`, `faq`, and `content`.
6. Map pages under `pages` with templates currently limited to `landing` and `service-index`.
7. Validate with `npm run validate:examples` before relying on the content in the builder.

For AI-assisted content, keep the model output schema-first: generate YAML, validate it with Zod, review claims and regulated content, render a static preview, then approve manually before publishing.

## Validation and build behavior

`npm run validate:examples` checks that required app/doc files exist, verifies expected YAML tokens, parses each example with `parseUniversalSite`, enforces unique slugs, and confirms the four current example verticals are present.

`npm run validate` is the broad repo check. It runs workspace type checks, the placeholder lint command, the full package/app build, and example validation.

The validation package also exposes reusable library and CLI primitives for page-level SEO, accessibility, responsive, performance, contrast, and checklist checks. Its CLI expects a JSON validation config (`website-factory-validate <config.json>`); it is separate from the example YAML validation script.

## Generated-site QA tooling

Use `./scripts/run-generated-qa.sh` for a handoff-ready local QA report. It writes artifacts under `qa-reports/generated-site/<timestamp>/`; if the local Nu HTML checker is not reachable at `http://127.0.0.1:8888/nu/`, HTML validation is recorded as skipped. The direct `npm run qa:generated:html` command requires that checker to be running.

The QA layers are intentionally complementary:

- LHCI checks generated routes for performance, accessibility, best-practices, and SEO thresholds.
- Playwright/axe crawls the local site in a browser and catches rendering, navigation, and axe accessibility issues.
- linkinator/static checks local links, fragments, CSS, and static resources without following external/contact protocols.
- `html-validator-cli` validates generated HTML through the local Nu checker.

If Playwright browsers or Chrome are missing locally, install Chromium with `npx playwright install --with-deps chromium`.

## Deployment stance

The builder app uses Astro static output and intentionally does not commit a host-specific adapter. After validation and build, publish `apps/website-builder/dist` to the static host of your choice.

Deployment provider details, credentials, redirects, analytics, forms, and image optimization should remain outside the core builder unless they become schema-backed platform features. Keep secrets and provider tokens out of source-controlled examples.

Operational procedures: [RUNBOOK.md](./RUNBOOK.md). Provider deployment notes: [docs/deployment.md](./docs/deployment.md).

## Documentation

- [Docs index](./docs/README.md)
- [Architecture](./docs/architecture.md)
- [Universal schema](./docs/universal-schema.md)
- [Templates and themes](./docs/templates-and-themes.md)
- [AI workflow](./docs/ai-workflow.md)
- [SEO, accessibility, and performance](./docs/seo-accessibility-performance.md)
- [Deployment](./docs/deployment.md)
- [Runbook](./RUNBOOK.md)
