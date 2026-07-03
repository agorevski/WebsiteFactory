# Copilot instructions for Website Factory

Website Factory is a private npm workspace for schema-first static website generation. Treat content, planning, rendering, QA, and deployment as separate layers in one pipeline:

`examples/**/website.yaml` -> `@website-factory/schema` Zod validation -> optional normalized v2 content -> `@website-factory/generator` signals/plans -> template/theme/component registries -> `@website-factory/website-builder` Astro static root, nested, and preview-variation routes -> `apps/website-builder/dist` -> optional QA/deployment plan tooling.

## Working model

- Work from the repository root with npm workspaces. Use package imports such as `@website-factory/schema`; do not reach across packages with relative source imports.
- Start by identifying the layer you are changing and the downstream packages affected. The repo is now large enough that schema, registry, rendering, validation, AI, deployment, and QA changes usually require coordinated updates.
- Prefer narrow, typed changes that preserve the schema-first flow. Do not add ad hoc content paths, presentation flags, runtime integrations, credentials, redirects, analytics, forms, or image optimization unless they are explicit schema-backed features.
- Keep generated outputs and local state out of commits: `node_modules`, `dist`, `.astro`, `.vite`, coverage, `*.tsbuildinfo`, `.env*`, provider CLI folders, `.website-factory-qa`, `qa-reports`, and generated QA artifacts.

## Package boundaries

- `@website-factory/schema`: Zod schemas, YAML parsing, validation issues, and exported TypeScript types. Add or change content shapes here first.
- `@website-factory/themes`: theme token registries, theme resolution, CSS variable generation, class names, and mode handling.
- `@website-factory/components`: reusable semantic React section contracts plus marketplace descriptors for generator selection.
- `@website-factory/templates`: data-only website template registry, section rhythm, and schema-to-template composition helpers.
- `@website-factory/generator`: content inventory, signal inference, section candidates, theme/component selection, plugin hooks, static artifact planning, and plan validation.
- `@website-factory/seo`: metadata, JSON-LD, sitemap/image sitemap/robots/`llms.txt`/RSS artifacts, and schema adapters.
- `@website-factory/validation`: schema, SEO, accessibility, responsive, performance, contrast, checklist, HTML/static-site, result, and CLI validation primitives.
- `@website-factory/ai`: provider-agnostic research, prompt, recommendation, task, feedback, and YAML pipeline contracts. Keep provider SDK/runtime code out unless explicitly requested.
- `@website-factory/deployment`: deterministic static deployment plan builders and provider adapters only. Providers include GitHub Pages, Cloudflare Pages, Azure Static Web Apps, Netlify, Vercel, S3/CloudFront, and generic static server.
- `@website-factory/website-builder`: Astro demo/preview app, example discovery, static routes, template prototypes, theme variation sidecars, QA surface, and final static output.

## Schema and content rules

- Example sites live at `examples/<site>/website.yaml` or `examples/<state>/<city>/<zipcode>/<business-name>/website.yaml` and must validate through `parseUniversalSite`.
- Optional `examples/**/theme-variations.yaml` sidecars must reference one canonical source `website.yaml`, match the source site slug, define exactly five lowercase kebab-case variations, use registered composition template IDs and registered theme names, and render preview routes without duplicating sites.
- Universal YAML must keep required top-level fields: `schemaVersion`, `slug`, `vertical`, `theme`, `seo`, `business`, `navigation`, `hero`, `sections`, and `pages`.
- Slugs must be unique lowercase kebab-case. Root generated routes are `/<slug>/`; nested page routes are `/<slug>/<page>/`.
- Supported universal section types are `services`, `proof`, `process`, `testimonials`, `faq`, and `content`. Put unsupported or experimental structured content in schema-approved normalized content such as `content.customData`; use `WebsiteData.customSections` only on the `WebsiteData` surface.
- Supported universal theme palettes are `clinic`, `trade`, `hospitality`, and `professional`; modes are `light` or `dark`; radii are `soft`, `rounded`, or `crisp`.
- `theme.name` is required; it can target a registered theme from `packages/themes/src/themes.ts` or a human-friendly legacy name that the builder normalizes before falling back by palette. `theme-variations.yaml` sidecars must use registered theme names. Keep `theme.palette` for schema/backward compatibility.
- Supported universal page template values are `landing` and `service-index`. Page behavior lives in `apps/website-builder/src/lib/pages.ts`.
- Keep template surfaces distinct: YAML page templates (`landing`, `service-index`) are not `@website-factory/templates` composition template IDs; composition IDs are used by generator planning, the catalog/prototype routes, and variation sidecar metadata.
- Optional `content.version: 2` data should normalize sourced facts into services, locations, service areas, contacts, people, FAQ, booking, compliance, media, reviews, taxonomy, pricing, products, events, articles, and related structures without removing required universal fields.
- Distinguish the two schema surfaces:
  - `UniversalSite` powers example YAML and the Astro builder routes.
  - `WebsiteData` powers broader normalized package contracts and template composition.
  Bridge them intentionally with adapters/helpers; do not silently mix shapes in components or route props.
- Keep YAML presentation-agnostic. Do not encode component variants, layout choices, CSS classes, or theme token overrides in content unless the schema explicitly supports them.
- For sourced business content, preserve factuality. Do not invent regulated claims, testimonials, certifications, pricing, hours, legal/medical statements, or review ratings.

## Registry and generation rules

- Component additions must update `packages/components/src/marketplace.ts`, exported types, package exports, and any generator selection logic that should discover the component.
- Template additions must update `packages/templates/src/templates.ts` and registry exports. If visible in the demo catalog, also update or verify `apps/website-builder/src/lib/templatePrototypes.ts` and `/templates/[id]`.
- Theme additions must update `packages/themes/src/themes.ts` and preserve token completeness for colors, typography, spacing, radius, elevation, buttons, cards, navigation, footer, hero, responsive, motion, forms, icons, and page templates as applicable.
- Theme variation additions must follow `apps/website-builder/src/lib/themeVariations.ts`; do not create duplicate `website.yaml` files for visual alternatives.
- The catalog includes an expressive template/theme library. New template/theme additions must be registry-driven, visually and structurally distinct, and checked for duplicate IDs, routes, section rhythms, palettes, and near-duplicate visual systems before landing.
- Generator changes should use existing helpers: `inferContentSignals`, `inferSectionCandidates`, `selectThemeForContent`, `createGenerationPlan`, plugin hooks, and plan validation. Avoid hardcoding vertical behavior when signal/theme/component metadata can drive the decision.
- SEO changes should flow through schema adapters and metadata/JSON-LD/artifact helpers rather than duplicating schema interpretation in the builder.

## Builder and rendering rules

- The builder recursively discovers `examples/**/website.yaml`, parses each site, sorts by business name, and uses Astro `getStaticPaths()` for root, nested, and variation preview static routes.
- `apps/website-builder/src/pages/[slug].astro` renders root pages; `apps/website-builder/src/pages/[slug]/[...page].astro` renders nested pages. Keep page path normalization in `apps/website-builder/src/lib/pages.ts`.
- `apps/website-builder/src/pages/[slug]/variations/[variation].astro` and `apps/website-builder/src/pages/[slug]/variations/[variation]/[...page].astro` render preview sidecars. Keep variation parsing and theme overlays in `apps/website-builder/src/lib/themeVariations.ts`.
- `UniversalLandingPage.astro` composes the app shell, header, hero, section renderer, and footer from validated `UniversalSite` data. Do not bypass it with one-off site-specific render paths.
- Page `sections` arrays reference universal section IDs. Empty page section arrays intentionally fall back to all site sections; missing referenced IDs should remain hard failures.
- Theme and presentation changes should stay token/data driven. Prefer theme classes, CSS variables, and existing app/theme helpers over hardcoded vertical-specific styles.
- Preserve catalog discernibility in rendered previews: data-only templates should demonstrate meaningfully different structures, and token-driven themes should avoid duplicating existing rhythms or palettes.
- Keep React/Astro output semantic and accessible: headings, landmarks, lists, alt text, aria labels, focus-visible behavior, reduced-motion safety, and safe external links.

## AI, deployment, and operational boundaries

- AI-assisted content must remain schema-first: collect inputs, research, select template/theme, draft YAML, validate schema, repair from validation feedback, finalize, render a static preview, then require human approval before publishing.
- Keep AI package contracts provider-neutral. Do not add hidden network calls, credentials, or provider-specific behavior to schema/generator/builder packages.
- Deployment adapters should produce deterministic plans, config files, steps, diagnostics, environment variables, and secret references. They should not perform live deploys or require provider credentials in core code.
- Validation package CLI accepts JSON validation inputs. Keep validation failures explicit; do not swallow failures with broad `try/catch` or success-shaped fallbacks.

## Coding conventions

- Use TypeScript ESM, strict types, named exports, and package-level public exports.
- Prefer schema-derived types (`z.infer`, exported schema types, `UniversalSite`, `WebsiteData`) over duplicating shapes.
- Avoid `any`, broad casts, and unnecessary `as unknown as` chains. Prefer typed guards, discriminated unions, and existing normalizers.
- Follow file-local style. Existing source generally uses 2-space indentation and semicolons; several packages use single quotes while schema/validation/deployment use double quotes, so match the file you edit.
- Surface validation/build errors clearly. Do not add broad try/catch blocks, silent early returns, or permissive defaults that hide invalid content.
- When changing public APIs, update the package `exports`, index exports, downstream imports, and any generated `.d.ts` source files that are intentionally checked in.

## Validation commands

- After editing example YAML or content flow, run `npm run validate:examples`.
- After editing schema, generator, themes, components, templates, SEO, validation, AI, or deployment packages, run the smallest relevant workspace command, for example `npm run typecheck --workspace @website-factory/schema` or `npm run build --workspace @website-factory/generator`.
- After editing v2 content or generation heuristics, run a generator smoke check with `createGenerationPlan` when package outputs are current.
- After rendering, routing, or static preview changes, run `npm run build --workspace @website-factory/website-builder`; use `npm run validate:examples` for example parsing coverage.
- After editing template/theme registries or catalog/prototype behavior, run `npm run qa:templates` when the change affects registry integrity, rhythms, or theme/template compatibility.
- Before handoff for cross-package, routing, QA, or registry changes, run `npm run validate`.
- Generated-site QA scripts exist for deeper checks: `npm run qa:generated:dist`, `npm run qa:generated:static`, `npm run qa:generated:html`, `npm run qa:generated:playwright`, `npm run qa:generated:visual`, `npm run qa:generated:lhci`, `npm run qa:generated`, and `npm run qa:generated:report`.
- The root `npm run lint` script is currently a placeholder. Do not add a new linting tool unless the task explicitly requires it.
- Docs-only changes do not need npm validation unless a directly relevant docs check exists; use `git diff --check` for lightweight whitespace validation when editing Markdown.
