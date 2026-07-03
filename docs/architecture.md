# Architecture

Website Factory separates data, rendering, and deployment:

1. Universal YAML describes a business, theme, SEO metadata, page map, and reusable content sections.
2. The schema package validates YAML and exposes TypeScript types used by the builder app.
3. Astro pages read validated examples at build time and generate static routes.
4. React components render schema sections such as hero, services, proof, process, testimonials, FAQ, and CTAs.
5. CSS theme tokens style the same templates for different verticals without provider-specific code.

The implemented package boundary is:

- `@website-factory/schema` for Zod schemas, TypeScript types, YAML parsing, and validation error formatting.
- `@website-factory/themes` for data-driven theme tokens and CSS variable generation.
- `@website-factory/components` for semantic React section components.
- `@website-factory/templates` for data-only layout composition definitions.
- `@website-factory/seo` for metadata, JSON-LD, sitemap, robots, RSS, and image sitemap generation.
- `@website-factory/validation` for schema, SEO, accessibility, responsive, and performance quality checks.
- `@website-factory/ai` for provider-agnostic AI-to-schema orchestration contracts and prompt builders.
- `@website-factory/deployment` for provider-separated static deployment adapter contracts.
- `@website-factory/website-builder` for demonstration, QA, and static preview builds.
