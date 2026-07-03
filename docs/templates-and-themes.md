# Templates and Themes

Templates should stay vertical-aware but not vertical-specific. Keep the template surfaces distinct:

- YAML `pages[].template` currently accepts only `landing` and `service-index`; app routing lives in `apps/website-builder/src/lib/pages.ts`.
- `packages/templates/src/templates.ts` and `registry.ts` are the source of truth for composition template IDs, descriptions, section rhythms, and default themes. They feed generator planning and the builder template catalog/prototype routes (`/#templates` and `/templates/<id>/`); do not duplicate that registry in docs.
- Validated example sites still render through `UniversalLandingPage.astro`, the site header/footer, and the schema section renderer. YAML supplies content and page section order, not component variants.
- Optional `examples/**/theme-variations.yaml` sidecars describe exactly five premium preview directions for one canonical `website.yaml`. Each variation names a registered composition template for preview metadata and a registered theme to overlay; the builder renders them under `/<slug>/variations/<variation-id>/` without creating duplicate YAML sites.

The catalog includes an expressive template/theme library. New entries should preserve discernibility: use data-only templates with meaningfully different section rhythms, match them with token-complete themes, and check for duplicate IDs, routes, palettes, or near-duplicate visual systems before adding another variant.

Themes are token-based. YAML keeps a compatibility palette such as `clinic`, `trade`, `hospitality`, or `professional`; `theme.name` can target a registered theme such as `dentalClinic` when available. CSS variables from `@website-factory/themes` drive accent colors, typography, surfaces, shadows, navigation, hero treatments, thumbnails, cards, and footer treatments.

Components are selected from the marketplace, not hardcoded in YAML. `packages/components/src/marketplace.ts` describes categories, content signals, theme traits, data requirements, accessibility expectations, and implementation descriptors. `@website-factory/generator` uses `inferContentSignals`, `inferSectionCandidates`, `selectThemeForContent`, and `createGenerationPlan` to turn schema data into a validated component plan.

Universal hero and content items can include optional schema-validated `image` assets. The builder renders those images when provided and falls back to generated theme art when they are absent, so examples can look polished without bypassing the universal YAML contract.
