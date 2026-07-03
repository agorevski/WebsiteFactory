# SEO, Accessibility, and Performance

## SEO

- Use unique titles, descriptions, canonical paths, and service-area content.
- Generate metadata, JSON-LD, sitemap, image sitemap, robots, RSS, and LLM-facing static artifacts from validated business fields where applicable.
- Keep headings hierarchical and section IDs stable.
- Review generator diagnostics before publishing so inferred routes and SEO artifact plans match the YAML.

## Accessibility

- Render semantic landmarks, headings, lists, buttons, and links.
- Keep CTAs as real anchors with descriptive labels.
- Preserve color contrast through theme token checks.
- Require editorial review for generated alt text and regulated claims.
- Use `@website-factory/validation` checklist, contrast, HTML, responsive, performance, accessibility, and schema primitives for reusable quality gates.

## Performance

- Build static pages with Astro.
- Render React components to HTML by default and hydrate only interactive islands.
- Keep CSS token-based and avoid provider-specific runtime dependencies.
- Optimize images when media fields are added to the schema.
