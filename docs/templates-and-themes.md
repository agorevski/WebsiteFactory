# Templates and Themes

Templates should stay vertical-aware but not vertical-specific. YAML `pages[].template` currently accepts `landing` and `service-index`; composition templates in `packages/templates/src/templates.ts` and `registry.ts` are data-only planning helpers, not additional YAML page template names.

The builder app uses schema-defined pages with reusable React components for:

- hero
- navigation
- service or menu cards
- proof statistics
- process steps
- testimonials
- FAQ
- final CTA
- footer business details

Themes are token-based. YAML keeps a compatibility palette such as `clinic`, `trade`, `hospitality`, or `professional`; `theme.name` can target a registered theme such as `dentalClinic` when available. CSS variables from `@website-factory/themes` drive accent colors, typography, surfaces, shadows, navigation, hero treatments, thumbnails, cards, and footer treatments.

Components are selected from the marketplace, not hardcoded in YAML. `packages/components/src/marketplace.ts` describes categories, content signals, theme traits, data requirements, accessibility expectations, and implementation descriptors. `@website-factory/generator` uses `inferContentSignals`, `inferSectionCandidates`, `selectThemeForContent`, and `createGenerationPlan` to turn schema data into a validated component plan.

Universal hero and content items can include optional schema-validated `image` assets. The builder renders those images when provided and falls back to generated theme art when they are absent, so examples can look polished without bypassing the universal YAML contract.
