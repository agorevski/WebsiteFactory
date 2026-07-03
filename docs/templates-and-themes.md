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

Themes are token-based. YAML chooses a palette such as `clinic`, `trade`, `hospitality`, or `professional`; the builder resolves that palette to a template theme class such as `template-clinic-showcase`. CSS variables translate the template theme into accent colors, surfaces, hero art, thumbnails, cards, navigation, and footer treatments. Future themes can add typography, imagery, spacing, or animation tokens without changing content data.
