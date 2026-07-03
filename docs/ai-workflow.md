# AI Workflow

A safe AI workflow should be reviewable and schema-first:

1. Collect business facts from intake forms, CRM records, or approved prompts.
2. Ask the model to produce universal YAML only, not framework code.
3. Validate YAML with Zod and reject missing or unsafe fields.
4. Use generator smoke checks to infer content signals, theme selection, section candidates, marketplace components, routes, and diagnostics.
5. Run editorial checks for claims, regulated content, tone, and duplicate copy.
6. Render a static preview in the builder app.
7. Let a human approve before publishing.

For regulated verticals such as medical or legal, the AI step should avoid unsupported claims and require domain review before deployment.
