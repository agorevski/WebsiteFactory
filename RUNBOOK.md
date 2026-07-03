# Website Factory Runbook

Operational procedures for developing, validating, building, handing off, and recovering generated Website Factory static sites.

## 1. Local setup

Work from the repository root.

```sh
node --version
npm --version
npm install
```

The project is an npm workspace with packages under `packages/*` and the Astro builder app under `apps/website-builder`.

## 2. Install or refresh dependencies

Use the standard npm install flow from the root:

```sh
npm install
```

If dependencies appear stale, reinstall before debugging TypeScript or Astro errors. Do not commit provider credentials, deployment tokens, or local environment files.

## 3. Validate the repository

Run the aggregate validation before handoff or after schema/template changes:

```sh
npm run validate
```

This runs workspace type checks, the lint placeholder, package/app builds, and example YAML validation. To validate only example sites:

```sh
npm run validate:examples
```

The example validator builds `@website-factory/schema` when needed, checks required app/doc files, verifies required YAML tokens, parses each `examples/*/website.yaml`, and checks for unique slugs and required vertical coverage.

## 4. Build the static app

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

## 5. Run the Astro dev server

Start the local development server from the root:

```sh
npm run dev --workspace @website-factory/website-builder
```

The app reads validated examples from `examples/*/website.yaml` and generates routes from each example `slug`.

## 6. Add or edit example YAML sites

Example generated sites live at:

```text
examples/<site-name>/website.yaml
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
npm run build --workspace @website-factory/website-builder
npm run preview --workspace @website-factory/website-builder
```

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

For data-only incidents, prefer reverting or correcting the affected `examples/<site-name>/website.yaml` and rebuilding. For schema/template/package incidents, validate all examples before republishing because one shared component can affect every generated site.
