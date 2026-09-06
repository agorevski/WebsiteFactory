# SEO, Accessibility, and Performance

## SEO

- Use unique titles, descriptions, canonical paths, and service-area content.
- Generate metadata, JSON-LD, sitemap, image sitemap, robots, RSS, and LLM-facing static artifacts from validated business fields where applicable.
- Keep headings hierarchical and section IDs stable.
- Review generator diagnostics before publishing so inferred routes and SEO artifact plans match the YAML.

### Offline static-link checks

`npm run qa:generated:dist` supplies the full generated HTML and asset inventory
automatically, including nested routes and variation previews that are not linked
from the catalog. Use `npm run qa:generated:dist -- --base-url https://example.com/project/`
for a deployed origin/path prefix. Without this option, a synthetic origin is
used for local links; absolute links to public domains are treated as external.
No HTTP requests are made.

`validateSite` can check internal page links and fragments without a server when
given an explicit, complete static route inventory:

```ts
validateSite({
  routeInventory: {
    baseUrl: 'https://preview.example.test/',
    assetPaths: ['/downloads/guide.pdf'],
  },
  pages: [
    { url: '/business/', path: 'business/index.html', html: homeHtml },
    { url: '/business/services/', path: 'business/services/index.html', html: servicesHtml },
  ],
});
```

Every page must supply its public `url`; `path` is an optional diagnostic file
label. Include all generated HTML pages and known non-HTML asset paths. Relative
inventory URLs resolve against `baseUrl`, including deployment subdirectories.
The check reports missing internal destinations, missing fragments, malformed
link URLs, and duplicate directory/index routes. External and contact URLs are
not fetched. Queries do not create distinct static pages. An HTML `<base href>`
is respected; named anchors and percent-encoded fragment IDs are supported.

For already-extracted inputs, supply `links`, `fragmentIds`, and optional
`baseHref` on each page. Missing HTML and fragment IDs mean fragment coverage is
unknown, not that the page has no IDs. Omit `routeInventory` for partial page
validation. `validateSiteLinks(pages, inventory)` exposes the same deterministic
checks directly as validation issues. HTML extraction is lightweight; browser
and Nu validation remain complementary checks, not replaced by this inventory.

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
