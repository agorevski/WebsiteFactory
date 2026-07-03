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

Themes are token-based. YAML chooses a palette such as `clinic`, `trade`, `hospitality`, or `professional`; CSS variables translate that palette into accent colors, surfaces, and component styles. Future themes can add typography, imagery, spacing, or animation tokens without changing content data.
