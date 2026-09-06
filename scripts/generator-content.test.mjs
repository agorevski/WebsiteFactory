import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { UniversalSiteSchema, parseUniversalSite } from '@website-factory/schema';
import { createGenerationPlan, inferContentSignals, selectTemplateForContent } from '@website-factory/generator';

const fixture = parseUniversalSite(await readFile(new URL('../examples/dentist/website.yaml', import.meta.url), 'utf8'));

function siteWith(overrides) {
  return UniversalSiteSchema.parse({ ...fixture, ...overrides });
}

test('proof and generic content items are not counted as services', () => {
  const site = siteWith({
    sections: [
      { id: 'proof', type: 'proof', title: 'Proof', items: [{ title: 'A proof point', description: 'Supporting detail.' }] },
      { id: 'about', type: 'content', title: 'About', items: [{ title: 'Our story', description: 'About this business.' }] },
    ],
    pages: [{ path: '/', template: 'landing', sections: [] }],
  });
  assert.equal(inferContentSignals(site).inventory.services, 0);
  const selection = selectTemplateForContent(site, undefined, { templateId: 'medical' });
  assert.ok(selection.missingRequiredSections.includes('services:services'));
});

test('legacy service counts exclude other sections and normalized v2 services take precedence', () => {
  const sections = [
    ...fixture.sections,
    { id: 'about', type: 'content', title: 'About', items: [{ title: 'Our story', description: 'About this business.' }] },
  ];
  assert.equal(inferContentSignals(siteWith({ sections })).inventory.services, 3);
  assert.equal(inferContentSignals(siteWith({
    sections,
    content: { version: 2, services: [{ id: 'consultation', name: 'Consultation' }] },
  })).inventory.services, 1);
  assert.equal(inferContentSignals(siteWith({
    sections, content: { version: 2, services: [] },
  })).inventory.services, 3);
});

test('regulated status expresses review needs, not evidence of FAQs or credentials', () => {
  const site = siteWith({
    business: { ...fixture.business, credentials: [] },
    sections: fixture.sections.filter((section) => section.type !== 'faq'),
    pages: [{ path: '/', template: 'landing', sections: [] }],
    content: { version: 2, compliance: { regulatedContent: { requiresHumanReview: true } } },
  });
  const summary = inferContentSignals(site);
  assert.equal(summary.inventory.regulatedContent, true);
  assert.equal(summary.inventory.faq, 0);
  assert.equal(summary.inventory.credentials, 0);
  const selection = selectTemplateForContent(site, summary, { templateId: 'medical' });
  assert.ok(selection.missingRequiredSections.includes('trust:trustBadges'));
  assert.equal(selection.matchedSections.includes('trust'), false);
  assert.equal(selection.matchedSections.includes('faq'), false);
  const plan = createGenerationPlan(site, { templateId: 'medical' });
  assert.ok(plan.template.missingRequiredSections.includes('trust:trustBadges'));
});

test('actual legacy FAQs and credentials remain available for template matching', () => {
  const selection = selectTemplateForContent(fixture, undefined, { templateId: 'medical' });
  assert.ok(selection.matchedSections.includes('trust'));
  assert.ok(selection.matchedSections.includes('faq'));
  assert.equal(selection.missingRequiredSections.includes('trust:trustBadges'), false);
});
