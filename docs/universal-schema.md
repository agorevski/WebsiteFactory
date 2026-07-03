# Universal Schema

The examples in `examples/**/website.yaml` use one portable universal contract:

- `schemaVersion`, `slug`, and `vertical` identify the document.
- `theme` selects palette, radius, mode tokens, and optionally a registered `theme.name`.
- `seo` provides title, description, and canonical path.
- `business` stores local organization details, contact methods, address, service areas, hours, credentials, and social links.
- `navigation` lists page or anchor links.
- `hero` defines above-the-fold copy, optional media, and primary actions.
- `sections` is an ordered array of typed content blocks; supported types are `services`, `proof`, `process`, `testimonials`, `faq`, and `content`.
- `ctas.final` supplies the closing conversion block.
- `pages` maps the root page and optional subpages to `landing` or `service-index` template names and ordered section IDs.
- `content.version: 2` optionally stores normalized services, locations, contacts, people, FAQ, reviews, booking, compliance, media, taxonomy, and other reusable content.

The shared Zod schema in `@website-factory/schema` validates examples and exports `universalSiteSchema`, `UniversalSiteSchema`, `parseUniversalSite`, `UniversalSite`, `universalContentV2Schema`, and `UniversalContentV2`.

Keep YAML schema-first and presentation-agnostic. Use normalized v2 data to provide richer content signals to `@website-factory/generator`; do not encode component variants or layout decisions in source content.
