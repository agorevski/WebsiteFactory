# Deployment

The builder app is intentionally provider-agnostic. It uses Astro static output and does not include adapters for a specific host.

Recommended flow:

1. Validate YAML examples.
2. Run the Astro build for `@website-factory/website-builder`.
3. Publish the generated `apps/website-builder/dist` directory to any static host.
4. Configure redirects, forms, analytics, and image optimization outside the core builder unless they become schema-backed platform features.

Keep environment secrets, provider credentials, and deployment tokens out of source-controlled examples.
