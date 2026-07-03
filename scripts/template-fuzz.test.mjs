import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import fc from 'fast-check';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const packageEntries = [
  'packages/schema/dist/index.js',
  'packages/themes/dist/index.js',
  'packages/components/dist/index.js',
  'packages/templates/dist/index.js',
].map((path) => join(root, path));

fc.configureGlobal({
  numRuns: Number.parseInt(process.env.FAST_CHECK_RUNS ?? '50', 10),
  seed: Number.parseInt(process.env.FAST_CHECK_SEED ?? '20260703', 10),
});

test('page path normalization preserves route invariants for generated paths', async () => {
  const { normalizePagePath, pagePathToRouteParam, pageHref } = await importAppModule('lib/pages.ts');
  const slug = 'sample-site';
  const site = { slug };

  await fc.assert(fc.asyncProperty(pagePathArbitrary(), async (path) => {
    const normalized = normalizePagePath(path);
    assert.match(normalized, /^\/(?:[a-z0-9-]+\/)*$/);
    assert.equal(normalized.startsWith('/'), true);
    assert.equal(normalized.endsWith('/'), true);

    const page = { path };
    const routeParam = pagePathToRouteParam(path);
    assert.equal(routeParam.startsWith('/'), false);
    assert.equal(routeParam.endsWith('/'), false);
    assert.equal(pageHref(site, page), normalized === '/' ? `/${slug}/` : `/${slug}${normalized}`);
  }));
});

test('template composition is stable for every registered template with matching schema sections', async () => {
  const { listTemplates, composeTemplate, validateTemplateComposition } = await importPackage('templates');
  const templates = listTemplates();

  await fc.assert(fc.asyncProperty(fc.constantFrom(...templates), async (template) => {
    const sections = template.sections.map((definition) => ({
      id: definition.id,
      type: definition.schemaType,
      data: { present: true },
      source: 'services',
    }));
    const composed = composeTemplate({ templateId: template.id, sections });
    const validation = validateTemplateComposition({ templateId: template.id, sections });

    assert.equal(composed.length, template.sections.length);
    assert.equal(validation.valid, true);
    assert.deepEqual(validation.missingRequiredSections, []);
  }));
});

test('template prototypes expose unique fragments and resolvable in-page navigation', async () => {
  const { getTemplatePrototypes } = await importAppModule('lib/templatePrototypes.ts');
  const prototypes = getTemplatePrototypes();

  assert.ok(prototypes.length > 0);
  for (const prototype of prototypes) {
    const fragmentIds = prototype.sections.map((section) => section.fragmentId);
    assert.equal(new Set(fragmentIds).size, fragmentIds.length, `${prototype.id} has duplicate section fragments`);

    const knownTargets = new Set(['template-overview', 'template-rhythm', 'template-contact', ...fragmentIds]);
    for (const item of prototype.navItems) {
      assert.equal(item.href.startsWith('#'), true, `${prototype.id} nav item ${item.label} should be in-page`);
      assert.equal(knownTargets.has(item.href.slice(1)), true, `${prototype.id} nav item ${item.label} points at a missing fragment`);
    }
  }
});

test('valid generated universal YAML parses across slug, palette, mode, radius, and section variants', async () => {
  const { parseUniversalSite } = await importPackage('schema');

  await fc.assert(fc.asyncProperty(siteInputArbitrary(), async (input) => {
    const site = parseUniversalSite(siteYaml(input), `fuzz/${input.slug}/website.yaml`);

    assert.equal(site.slug, input.slug);
    assert.equal(site.theme.palette, input.palette);
    assert.equal(site.theme.mode, input.mode);
    assert.equal(site.theme.radius, input.radius);
    assert.equal(site.sections[0]?.type, input.sectionType);
    assert.equal(site.pages[0]?.sections[0], 'primary');
  }));
});

function pagePathArbitrary() {
  return fc.array(slugSegmentArbitrary(), { minLength: 0, maxLength: 4 }).map((segments) => {
    const path = segments.join('/');
    return fc.sample(fc.constantFrom(path, `/${path}`, `${path}/`, `//${path}//`), 1)[0] ?? '/';
  });
}

function siteInputArbitrary() {
  return fc.record({
    slug: fc.array(slugSegmentArbitrary(), { minLength: 1, maxLength: 3 }).map((segments) => segments.join('-')),
    palette: fc.constantFrom('clinic', 'trade', 'hospitality', 'professional'),
    mode: fc.constantFrom('light', 'dark'),
    radius: fc.constantFrom('soft', 'rounded', 'crisp'),
    sectionType: fc.constantFrom('services', 'proof', 'process', 'testimonials', 'faq', 'content'),
    businessType: fc.constantFrom('Clinic', 'Contractor', 'Restaurant', 'Consultant'),
  });
}

function slugSegmentArbitrary() {
  return fc.constantFrom('alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel');
}

function siteYaml(input) {
  return `schemaVersion: 1
slug: ${input.slug}
vertical: professional
theme:
  name: professional-trust
  palette: ${input.palette}
  mode: ${input.mode}
  radius: ${input.radius}
seo:
  title: ${input.businessType} ${input.slug} | Website Factory
  description: Generated fuzz fixture for ${input.slug}.
  canonicalPath: /${input.slug}/
business:
  name: ${input.businessType} ${input.slug}
  type: ${input.businessType}
  tagline: Clear local help.
  description: Practical service details for generated validation.
  phone: "(555) 010-0000"
  address:
    street: 100 Main Street
    city: Seattle
    region: WA
    postalCode: "98122"
    country: US
  areaServed:
    - Seattle
navigation:
  - label: Services
    href: "#primary"
    variant: secondary
hero:
  title: ${input.businessType} help for ${input.slug}.
  summary: Reliable content for generated parser fuzz checks.
  primaryCta:
    label: Call now
    href: "tel:+15550100000"
    variant: primary
sections:
  - id: primary
    type: ${input.sectionType}
    title: Primary section
    summary: Section copy for generated fuzz checks.
    items:
      - title: Planning
        description: Clear guidance for deciding what to do next.
    stats:
      - label: Projects
        value: "25+"
    steps:
      - title: Start
        description: First step in the process.
    testimonials:
      - quote: Helpful and clear.
        name: Local Client
    questions:
      - question: How do we start?
        answer: Call the team.
pages:
  - path: /
    template: landing
    sections:
      - primary
`;
}

async function importPackage(name) {
  await ensurePackageBuilds();
  return import(`@website-factory/${name}`);
}

async function importAppModule(relativePath) {
  await ensurePackageBuilds();
  return import(pathToFileURL(join(root, 'apps/website-builder/src', relativePath)).href);
}

async function ensurePackageBuilds() {
  if (packageEntries.every((entry) => existsSync(entry))) {
    return;
  }

  for (const workspace of ['@website-factory/schema', '@website-factory/themes', '@website-factory/components', '@website-factory/templates']) {
    const result = spawnSync('npm', ['run', 'build', '--workspace', workspace], {
      cwd: root,
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      throw new Error(`Failed to build ${workspace} before running template fuzz tests.`);
    }
  }
}
