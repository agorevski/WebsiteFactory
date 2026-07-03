# Website Builder Demo

`@website-factory/website-builder` is a static Astro app showing how Website Factory can render a universal YAML site schema through React components, Astro templates, and theme tokens.

## Scripts

- `npm run dev --workspace @website-factory/website-builder`
- `npm run build --workspace @website-factory/website-builder`
- `npm run validate:examples --workspace @website-factory/website-builder`

The app reads examples from repository-level `examples/**/website.yaml` files at build time and emits static pages for each site.
