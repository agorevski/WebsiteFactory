import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const validationEntry = join(root, 'packages/validation/dist/index.js');

test('uses visible link and summary text as ARIA interactive accessible names', async () => {
  const { validatePage } = await importValidationPackage();
  const result = validatePage({
    path: 'visible-interactive-text.html',
    html: '<!doctype html><html lang="en"><head><title>Accessible test page</title><meta name="description" content="Short description for this test page."></head><body><main><h1>Accessible test page</h1><a href="/services/">View services</a><details><summary>What services are available?</summary><p>Preventive care.</p></details></main></body></html>',
  });

  assert.deepEqual(result.issues.filter((issue) => issue.ruleId === 'aria-interactive-name'), []);
});

test('does not treat design-token animation custom properties as active motion', async () => {
  const { validatePage } = await importValidationPackage();
  const result = validatePage({
    path: 'theme-tokens.html',
    html: '<!doctype html><html lang="en" style="--wf-animation-duration-fast: 120ms; --wf-animation-easing-standard: ease;"><head><title>Theme tokens</title><meta name="description" content="Theme token test page."></head><body><main><h1>Theme tokens</h1></main></body></html>',
  });

  assert.deepEqual(result.issues.filter((issue) => issue.ruleId === 'prefers-reduced-motion'), []);
});

test('does not count JSON-LD scripts as client-rendering JavaScript', async () => {
  const { validatePage } = await importValidationPackage();
  const result = validatePage({
    path: 'json-ld-static.html',
    html: '<!doctype html><html lang="en"><head><title>Static JSON-LD page</title><meta name="description" content="Static page with structured data."><script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Example"}</script></head><body><main><h1>Static JSON-LD page</h1></main></body></html>',
  });

  assert.deepEqual(result.issues.filter((issue) => issue.ruleId === 'static-rendering'), []);
});

test('counts parameterized JavaScript MIME types as executable scripts', async () => {
  const { validatePage } = await importValidationPackage();
  const result = validatePage({
    path: 'parameterized-script-type.html',
    html: '<!doctype html><html lang="en"><head><title>Parameterized script page</title><meta name="description" content="Page with an executable script type parameter."><script type="text/javascript; charset=utf-8">window.__hydrated = true;</script></head><body><main><h1>Parameterized script page</h1></main></body></html>',
  });

  assert.equal(result.issues.some((issue) => issue.ruleId === 'static-rendering'), true);
});

test('does not use hidden descendant text as an interactive accessible name', async () => {
  const { validatePage } = await importValidationPackage();
  const result = validatePage({
    path: 'hidden-interactive-text.html',
    html: '<!doctype html><html lang="en"><head><title>Hidden text page</title><meta name="description" content="Page with hidden-only button text."></head><body><main><h1>Hidden text page</h1><button><span aria-hidden="true">Hidden label</span></button><a href="/next/"><span hidden>Hidden link label</span></a></main></body></html>',
  });

  assert.equal(result.issues.filter((issue) => issue.ruleId === 'aria-interactive-name').length, 2);
  assert.equal(result.issues.filter((issue) => issue.ruleId === 'interactive-accessible-name').length, 2);
  assert.equal(result.issues.filter((issue) => issue.ruleId === 'link-accessible-name').length, 1);
});

test('does not use CSS-hidden descendant text as an accessible name', async () => {
  const { validatePage } = await importValidationPackage();
  const result = validatePage({
    path: 'css-hidden-interactive-text.html',
    html: '<!doctype html><html lang="en"><head><title>CSS hidden text page</title><meta name="description" content="Page with CSS-hidden-only interactive text."></head><body><main><h1>CSS hidden text page</h1><button><span style="display: none;">Hidden button label</span></button><a href="/next/"><span style="visibility:hidden">Hidden link label</span></a></main></body></html>',
  });

  assert.equal(result.issues.filter((issue) => issue.ruleId === 'aria-interactive-name').length, 2);
  assert.equal(result.issues.filter((issue) => issue.ruleId === 'interactive-accessible-name').length, 2);
  assert.equal(result.issues.filter((issue) => issue.ruleId === 'link-accessible-name').length, 1);
});

test('handles nested same-tag hidden descendants when reading interactive text', async () => {
  const { validatePage } = await importValidationPackage();
  const result = validatePage({
    path: 'nested-hidden-same-tag.html',
    html: '<!doctype html><html lang="en"><head><title>Nested hidden text page</title><meta name="description" content="Page with nested same-tag hidden-only interactive text."></head><body><main><h1>Nested hidden text page</h1><div role="button"><div aria-hidden="true">Hidden label</div></div></main></body></html>',
  });

  assert.equal(result.issues.filter((issue) => issue.ruleId === 'aria-interactive-name').length, 1);
  assert.equal(result.issues.filter((issue) => issue.ruleId === 'interactive-accessible-name').length, 1);
});

test('removes hidden subtrees that contain same-tag descendants and trailing text', async () => {
  const { validatePage } = await importValidationPackage();
  const result = validatePage({
    path: 'nested-hidden-subtree.html',
    html: '<!doctype html><html lang="en"><head><title>Nested hidden subtree page</title><meta name="description" content="Page with nested same-tag hidden subtree text."></head><body><main><h1>Nested hidden subtree page</h1><button><span aria-hidden="true"><span>Inner hidden</span>Trailing hidden</span></button><a href="/next/"><span hidden><span>Inner hidden link</span>Trailing hidden link</span></a></main></body></html>',
  });

  assert.equal(result.issues.filter((issue) => issue.ruleId === 'aria-interactive-name').length, 2);
  assert.equal(result.issues.filter((issue) => issue.ruleId === 'interactive-accessible-name').length, 2);
  assert.equal(result.issues.filter((issue) => issue.ruleId === 'link-accessible-name').length, 1);
});

test('does not leak text from hidden descendants inside hidden subtrees', async () => {
  const { validatePage } = await importValidationPackage();
  const result = validatePage({
    path: 'nested-hidden-descendant.html',
    html: '<!doctype html><html lang="en"><head><title>Nested hidden descendant page</title><meta name="description" content="Page with hidden descendant text inside a hidden subtree."></head><body><main><h1>Nested hidden descendant page</h1><button><span aria-hidden="true"><span aria-hidden="true">Inner hidden</span>Trailing hidden</span></button><a href="/next/"><span hidden><span hidden>Inner hidden link</span>Trailing hidden link</span></a></main></body></html>',
  });

  assert.equal(result.issues.filter((issue) => issue.ruleId === 'aria-interactive-name').length, 2);
  assert.equal(result.issues.filter((issue) => issue.ruleId === 'interactive-accessible-name').length, 2);
  assert.equal(result.issues.filter((issue) => issue.ruleId === 'link-accessible-name').length, 1);
});

async function importValidationPackage() {
  if (!existsSync(validationEntry)) {
    const result = spawnSync('npm', ['run', 'build', '--workspace', '@website-factory/validation'], {
      cwd: root,
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      throw new Error('Failed to build @website-factory/validation before running HTML validation tests.');
    }
  }

  return import('../packages/validation/dist/index.js');
}
