# Website Builder Demo

`@website-factory/website-builder` is a static Astro app showing how Website Factory can render a universal YAML site schema through React components, Astro templates, and theme tokens.

## Scripts

- `npm run dev --workspace @website-factory/website-builder`
- `npm run build --workspace @website-factory/website-builder`
- `npm run validate:examples --workspace @website-factory/website-builder`

The app reads examples from repository-level `examples/**/website.yaml` files at build time and emits the root route plus any schema-defined subpages for each site. If a site directory also contains `theme-variations.yaml`, the builder emits preview routes at `/<slug>/variations/<variation-id>/` and matching nested page routes using the same YAML content with the variation theme overlaid.

The build step rewrites generated `_astro`, theme asset, and internal page URLs to be relative to each HTML file. That keeps the static output usable through `astro preview`, regular static hosting, or by opening `apps/website-builder/dist/index.html` directly from the filesystem.
