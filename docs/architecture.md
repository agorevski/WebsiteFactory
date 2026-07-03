# Architecture

Website Factory v2 separates source data, normalized content, generation planning, rendering, quality checks, and deployment:

1. Universal YAML describes a business, theme, SEO metadata, page map, reusable content sections, and optional normalized `content.version: 2` data.
2. The schema package validates YAML and exposes TypeScript types used by generator APIs and the builder app.
3. The generator package infers content signals, section candidates, theme resolution, component marketplace implementations, static routes, SEO artifacts, and diagnostics without adding presentation details to YAML.
4. Astro pages read validated examples at build time and generate static routes.
5. React components render schema sections such as hero, services, proof, process, testimonials, FAQ, and CTAs.
6. CSS theme tokens style generated pages and template prototypes for different verticals without provider-specific code.

The implemented package boundary is:

- `@website-factory/schema` for Zod schemas, TypeScript types, YAML parsing, and validation error formatting.
- `@website-factory/themes` for expanded data-driven theme tokens, registered themes, and CSS variable generation.
- `@website-factory/components` for semantic React section components and marketplace descriptors.
- `@website-factory/templates` for data-only layout composition definitions used by planning and the builder template catalog.
- `@website-factory/generator` for schema-driven content signal inference, section selection, theme matching, component matching, plugin hooks, static plan creation, and plan validation.
- `@website-factory/seo` for metadata, JSON-LD, sitemap, robots, RSS, and image sitemap generation.
- `@website-factory/validation` for schema, SEO, accessibility, responsive, and performance quality checks.
- `@website-factory/ai` for provider-agnostic AI-to-schema orchestration contracts and prompt builders.
- `@website-factory/deployment` for provider-separated static deployment adapter contracts.
- `@website-factory/website-builder` for demonstration, QA, and static preview builds.

See [V2 platform reference](./v2-platform-reference.md) for the source/API map agents should use when choosing schema, theme, template, component, and generator behavior.
