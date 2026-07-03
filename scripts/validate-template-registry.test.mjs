import assert from 'node:assert/strict';
import test from 'node:test';
import { validateTemplateRegistry } from './validate-template-registry.mjs';

const validTemplate = {
  id: 'modern',
  name: 'Modern',
  audience: 'general',
  layout: 'landing-page',
  defaultTheme: 'modern',
  description: 'A valid template.',
  tags: ['marketing'],
  sections: [
    { id: 'nav', schemaType: 'navigation', component: 'Navigation', variant: 'default', slot: 'header', order: 10, required: true },
    { id: 'hero', schemaType: 'hero', component: 'Hero', variant: 'split', slot: 'main', order: 20, required: true },
    { id: 'contact', schemaType: 'contact', component: 'Contact', variant: 'split', slot: 'main', order: 30, required: true },
    { id: 'footer', schemaType: 'footer', component: 'Footer', variant: 'columns', slot: 'footer', order: 40, required: true },
  ],
};

test('accepts a registry with unique templates, valid themes, components, and section order', () => {
  const issues = validateTemplateRegistry({
    templates: [validTemplate],
    themeIds: new Set(['modern']),
    componentNames: new Set(['Navigation', 'Hero', 'Contact', 'Footer']),
  });

  assert.deepEqual(issues, []);
});

test('reports duplicate template IDs, duplicate section IDs, invalid references, and near-duplicate rhythms', () => {
  const duplicate = {
    ...validTemplate,
    name: 'Duplicate',
    defaultTheme: 'missing-theme',
    sections: [
      validTemplate.sections[0],
      { ...validTemplate.sections[1], id: 'nav', component: 'MissingComponent', order: 10 },
    ],
  };

  const issues = validateTemplateRegistry({
    templates: [validTemplate, duplicate],
    themeIds: new Set(['modern']),
    componentNames: new Set(['Navigation', 'Hero', 'Contact', 'Footer']),
  });

  assert.ok(issues.some((issue) => issue.code === 'template.duplicate-id'));
  assert.ok(issues.some((issue) => issue.code === 'template.default-theme.invalid'));
  assert.ok(issues.some((issue) => issue.code === 'template.section.duplicate-id'));
  assert.ok(issues.some((issue) => issue.code === 'template.section.component.invalid'));
  assert.ok(issues.some((issue) => issue.code === 'template.near-duplicate-rhythm'));
});
