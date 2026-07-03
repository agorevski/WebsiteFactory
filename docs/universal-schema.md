# Universal Schema

The examples in `examples/**/website.yaml` use one portable contract:

- `schemaVersion`, `slug`, and `vertical` identify the document.
- `theme` selects palette, radius, and mode tokens.
- `seo` provides title, description, and canonical path.
- `business` stores local organization details, contact methods, address, service areas, hours, credentials, and social links.
- `navigation` lists page or anchor links.
- `hero` defines above-the-fold copy, optional media, and primary actions.
- `sections` is an ordered array of typed content blocks; service and content items can include optional images.
- `ctas.final` supplies the closing conversion block.
- `pages` maps the root page and optional subpages to template names and ordered section IDs.

The shared Zod schema in `@website-factory/schema` validates examples and exports the `UniversalSite` types consumed by the builder app.
