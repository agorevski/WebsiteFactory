# Templates and Themes

Templates should stay vertical-aware but not vertical-specific. The builder app uses a single landing template for root pages and schema-defined subpages with reusable React components for:

- hero
- navigation
- service or menu cards
- proof statistics
- process steps
- testimonials
- FAQ
- final CTA
- footer business details

Themes are token-based. YAML chooses a palette such as `clinic`, `trade`, `hospitality`, or `professional`; the builder resolves that palette to a registered theme such as `clinic-showcase`, `trade-pro`, `hospitality-editorial`, or `professional-trust`. CSS variables from `@website-factory/themes` drive accent colors, typography, surfaces, shadows, navigation, hero treatments, thumbnails, cards, and footer treatments.

Universal hero and content items can include optional schema-validated `image` assets. The builder renders those images when provided and falls back to generated theme art when they are absent, so examples can look polished without bypassing the universal YAML contract.
