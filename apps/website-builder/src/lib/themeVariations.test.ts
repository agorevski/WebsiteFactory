import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { resolveUniversalTheme } from './theme.ts';
import { applyThemeVariation, getExampleThemeVariationGroups } from './themeVariations.ts';

const siteYaml = `schemaVersion: 1
slug: sample-site
vertical: professional
theme:
  name: professional-trust
  palette: professional
  mode: light
  radius: soft
seo:
  title: Sample Site | Professional Services
  description: Professional service website preview.
  canonicalPath: /sample-site/
business:
  name: Sample Site
  type: Professional Services
  tagline: Practical help for local clients.
  description: A sample local service business used for preview variation tests.
  phone: (555) 010-0000
  address:
    street: 100 Main Street
    city: Seattle
    region: WA
    postalCode: "98122"
    country: US
  areaServed:
    - Seattle
hero:
  title: Practical service with clear next steps.
  summary: Same schema content can render through multiple premium preview directions.
  primaryCta:
    label: Call now
    href: "tel:+15550100000"
    variant: primary
sections:
  - id: services
    type: services
    title: Services
    items:
      - title: Planning
        description: Clear guidance for deciding what to do next.
pages:
  - path: /
    template: landing
    sections:
      - services
`;

const variationsYaml = `business: sample-site
source: website.yaml
variations:
  - id: recommended
    label: Recommended
    template: modern
    theme:
      name: professional-trust
      palette: professional
      mode: light
      radius: soft
    rationale: High-trust default for professional services.
  - id: professional-legal
    label: Professional Legal
    template: authorityPractice
    theme:
      name: lawFirm
      palette: professional
      mode: light
      radius: crisp
    rationale: Formal legal-style direction for trust and clarity.
  - id: classic-local
    label: Classic Local
    template: classic
    theme:
      name: classic
      palette: professional
      mode: light
      radius: rounded
    rationale: Familiar local business structure.
  - id: modern-conversion
    label: Modern Conversion
    template: modern
    theme:
      name: modern
      palette: professional
      mode: light
      radius: soft
    rationale: Conversion-focused modern presentation.
  - id: premium-dark
    label: Premium Dark
    template: luxuryService
    theme:
      name: luxury
      palette: professional
      mode: dark
      radius: crisp
    rationale: Premium dark-mode option for a more editorial feel.
`;

test('loads exactly five preview variations and overlays a registered theme without changing site content', async () => {
  const examplesRoot = await mkdtemp(join(tmpdir(), 'website-factory-variations-'));
  const siteDirectory = join(examplesRoot, 'sample-site');
  await mkdir(siteDirectory, { recursive: true });
  await writeFile(join(siteDirectory, 'website.yaml'), siteYaml, 'utf8');
  await writeFile(join(siteDirectory, 'theme-variations.yaml'), variationsYaml, 'utf8');

  const [group] = await getExampleThemeVariationGroups(examplesRoot);

  assert.ok(group);
  assert.equal(group.site.slug, 'sample-site');
  assert.equal(group.variations.length, 5);
  assert.deepEqual(group.variations.map((variation) => variation.id), [
    'recommended',
    'professional-legal',
    'classic-local',
    'modern-conversion',
    'premium-dark',
  ]);

  const legalVariation = group.variations.find((variation) => variation.id === 'professional-legal');
  assert.ok(legalVariation);
  assert.equal(legalVariation.template.id, 'authorityPractice');

  const previewSite = applyThemeVariation(group.site, legalVariation);
  assert.equal(previewSite.slug, group.site.slug);
  assert.equal(previewSite.business.name, group.site.business.name);
  assert.equal(previewSite.seo.title, group.site.seo.title);
  assert.equal(previewSite.theme.name, 'lawFirm');
  assert.equal(previewSite.theme.palette, 'professional');
  assert.equal(resolveUniversalTheme(previewSite).id, 'lawFirm');
});
