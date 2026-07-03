# V2 Platform Reference

Use this reference when deciding what YAML, theme, template, component, and generator APIs to use for a new or refreshed Website Factory example.

## Source/API map

| Need | Source/API |
| --- | --- |
| Universal YAML contract | `packages/schema/src/index.ts` exports `universalSiteSchema`, `UniversalSiteSchema`, `parseUniversalSite`, `UniversalSite`, and optional `universalContentV2Schema` / `UniversalContentV2`. |
| Theme catalog | `packages/themes/src/themes.ts` and `packages/themes/src/index.ts` export the 62-theme catalog, `ThemeName`, `listThemes`, and `resolveTheme`, including `dentalClinic` and palette-compatible aliases. |
| Template/page contract | `packages/schema/src/index.ts` limits YAML `pages[].template` to `landing` and `service-index`; `apps/website-builder/src/lib/pages.ts` maps pages to generated routes. |
| Composition templates | `packages/templates/src/templates.ts` and `packages/templates/src/registry.ts` describe data-only composition templates used by generator planning and builder prototype routes (`/#templates`, `/templates/<id>/`); they are not YAML page template names. |
| Preview variations | `apps/website-builder/src/lib/themeVariations.ts` loads optional `examples/**/theme-variations.yaml` sidecars with exactly five registered template/theme directions and powers `/<slug>/variations/<variation-id>/` Astro routes. |
| Component marketplace | `packages/components/src/marketplace.ts` and package exports list 41 categories, 123 implementation descriptors, content signals, theme traits, and data requirements. |
| Generator heuristics/plugins | `packages/generator/src/index.ts` exports `createGenerationPlan`, `inferContentSignals`, `inferSectionCandidates`, `selectThemeForContent`, `createGeneratorPlugin`, `runGeneratorHooks`, lifecycle events, and `validateGenerationPlan`. |
| SEO/quality | `packages/seo/src/index.ts` and `packages/validation/src/index.ts` export metadata, structured data, artifact, checklist, contrast, HTML, and rule validation helpers. |
| Example validation | `npm run validate:examples` validates every `examples/**/website.yaml` through the builder workspace. |

## Decision checklist

| Decision | Guidance |
| --- | --- |
| Schema level | Always include required universal fields: `schemaVersion`, `slug`, `vertical`, `theme`, `seo`, `business`, `navigation`, `hero`, `sections`, and `pages`. Add optional `content.version: 2` only when normalized source facts are useful for services, locations, people, FAQ, booking, compliance, media, reviews, or local discovery. |
| Vertical | Keep the top-level `vertical` compatible with current examples (`medical`, `home-services`, `food`, `professional`). Use `content.verticals` for richer v2 categories such as `dentist`, `medical-clinic`, or `local-business`. |
| Theme palette/name | `theme.palette` must stay one of `clinic`, `trade`, `hospitality`, or `professional`. Use `theme.name` for a registered theme such as `dentalClinic` when it exists; otherwise rely on palette compatibility and generator theme matching. |
| Page templates | Use `landing` for root/marketing pages and `service-index` for service directory pages. Do not use composition template IDs such as `medical` or `modern` as YAML `pages[].template` values. |
| Preview sidecars | Put five premium options in `theme-variations.yaml`, not in duplicate `website.yaml` files. Sidecar `template` IDs are preview metadata from `@website-factory/templates`; sidecar `theme` blocks are applied to the same parsed `UniversalSite` for static preview routes. |
| Section types | Use only `services`, `proof`, `process`, `testimonials`, `faq`, and `content`. Prefer `content` over `testimonials` when summarizing review themes without permission to quote. |
| Component plan | YAML provides content and signals, not component variants. Let the generator select marketplace implementations from categories, data requirements, content signals, and theme traits. |
| Generator smoke checks | Run `inferContentSignals` or `createGenerationPlan` when adding v2 normalized content, selecting a registered theme, adding pages, or when section choices are uncertain. Confirm selected sections, theme, routes, diagnostics, and omitted-section reasons. |
| Regulated content | For healthcare, legal, finance, and similar verticals, keep claims conservative, source-backed, and marked for human review where appropriate. |

## Madrona guidance

For `examples/wa/seattle/98122/madrona-family-dental/website.yaml`, use `vertical: medical`, `theme.palette: clinic`, `theme.name: dentalClinic`, route `/madrona-family-dental/`, required universal fields, and optional v2 normalized dental content. If official pages are unavailable, rely only on indexed official snippets, reputable public listings, and practice review; do not invent services, insurance, ratings, clinicians, or testimonials.

## Contribution model

- Make schema/data changes before renderer changes; avoid ad hoc content paths that bypass `parseUniversalSite`.
- Keep theme, component, template, generator, SEO, validation, AI, and deployment changes inside their owning workspaces.
- Add generator extensions as plugins, custom content types, or validators instead of hardcoding vertical-specific choices.
- Update docs, examples, and validation commands with API changes, then run the smallest relevant workspace check plus `npm run validate:examples`.
