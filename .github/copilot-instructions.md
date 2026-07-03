# Copilot instructions for Website Factory

Website Factory is a private npm workspace for schema-first static website generation. Keep changes aligned with the pipeline: `examples/**/website.yaml` -> `@website-factory/schema` Zod validation -> optional v2 normalized content -> `@website-factory/generator` planning -> marketplace components/templates/themes -> `@website-factory/website-builder` Astro static routes -> `apps/website-builder/dist`.

## Repository shape

- Work from the repository root and use npm workspaces. Packages live in `packages/*`; the static demo app lives in `apps/website-builder`.
- Preserve package boundaries:
  - `@website-factory/schema`: Zod schemas, YAML parsing, validation errors, exported TypeScript types.
  - `@website-factory/themes`: theme token registries and CSS variable helpers.
  - `@website-factory/components`: reusable semantic React sections and component marketplace descriptors.
  - `@website-factory/templates`: data-only layout composition helpers.
  - `@website-factory/generator`: content signal inference, section candidates, theme resolution, component selection, plugin hooks, and generation plan validation.
  - `@website-factory/seo`: metadata, JSON-LD, sitemap, robots, RSS, and SEO helpers.
  - `@website-factory/validation`: schema, SEO, accessibility, responsive, performance, contrast, checklist, and CLI validation primitives.
  - `@website-factory/ai`: provider-agnostic AI/content orchestration contracts.
  - `@website-factory/deployment`: provider-separated static deployment plan builders.
  - `@website-factory/website-builder`: Astro demo, QA surface, and static preview builder.
- Keep deployment provider runtime code, credentials, redirects, analytics, forms, and image optimization outside the core builder unless they become explicit schema-backed features.

## Coding conventions

- Use TypeScript ESM, strict types, named exports, and existing workspace package imports such as `@website-factory/schema`.
- Avoid `any`, broad casts, and broad `try/catch` fallbacks. Surface validation/build failures clearly.
- Follow file-local style for quotes and formatting. Existing source generally uses 2-space indentation and semicolons.
- Prefer schema-derived types from Zod (`z.infer`) and exported schema package types over duplicating data shapes in apps or packages.
- Keep React components semantic and accessible: preserve headings, landmarks, alt text, ARIA labels, focus-visible behavior, and safe external link attributes.
- Do not commit generated outputs or local state such as `node_modules`, `dist`, `.astro`, `.vite`, coverage, `*.tsbuildinfo`, `.env*`, or provider CLI folders.

## Schema and content rules

- Example sites live at `examples/<site>/website.yaml` or `examples/<state>/<city>/<zipcode>/<business-name>/website.yaml` and must validate through `parseUniversalSite`.
- Keep required universal YAML fields present: `schemaVersion`, `slug`, `vertical`, `theme`, `seo`, `business`, `navigation`, `hero`, `sections`, and `pages`.
- Slugs must be unique lowercase kebab-case values; generated routes are `/<slug>/`.
- Supported universal section types are `services`, `proof`, `process`, `testimonials`, `faq`, and `content`.
- Supported universal theme palettes are `clinic`, `trade`, `hospitality`, and `professional`; modes are `light` or `dark`; radii are `soft`, `rounded`, or `crisp`.
- `theme.name` may target a registered theme from `packages/themes/src/themes.ts` such as `dentalClinic`, but keep `theme.palette` for schema/backward compatibility.
- Optional `content.version: 2` data should normalize sourced facts into services, locations, contacts, people, FAQ, booking, compliance, media, reviews, and related structures without removing the required universal fields.
- Supported YAML page template values are currently `landing` and `service-index`; app route/page behavior lives in `apps/website-builder/src/lib/pages.ts`.
- Keep YAML presentation-agnostic: do not encode component variants or layouts in content. Use generator heuristics (`inferContentSignals`, `inferSectionCandidates`, `selectThemeForContent`, `createGenerationPlan`) to confirm section/theme/component plans.
- Keep AI-assisted content schema-first: generate YAML, validate with Zod, review claims and regulated vertical content, render a static preview, then require human approval before publishing.

## Builder and rendering rules

- The builder discovers examples from `examples/**/website.yaml` at build time, sorts by business name, and uses Astro `getStaticPaths()` to generate static slug routes.
- `UniversalLandingPage.astro` composes the app shell, header, hero, section renderer, and footer from validated universal site data. Avoid adding ad hoc content paths that bypass the schema.
- Theme and presentation changes should remain token/data driven where possible instead of hardcoding vertical-specific behavior.
- Component additions should update the marketplace registry in `packages/components/src/marketplace.ts` and package exports so generator selection remains discoverable.

## Validation commands

- After editing example YAML or content flow, run `npm run validate:examples`.
- After editing v2 content or generation heuristics, run a generator smoke check with `createGenerationPlan` when package outputs are current.
- After TypeScript/package changes, run the smallest relevant workspace check, for example `npm run typecheck --workspace @website-factory/schema` or `npm run build --workspace @website-factory/schema`.
- Before handoff for cross-package or rendering changes, run `npm run validate`.
- The root `npm run lint` script is currently a placeholder; do not add a new linting tool unless the task explicitly requires it.
