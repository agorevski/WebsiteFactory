import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  collectHtmlFiles,
  createPageValidationInput,
  runGeneratedDistValidation,
} from './validate-generated-dist.mjs';

test('collects generated HTML files recursively in deterministic order', async () => {
  const root = await mkdtemp(join(tmpdir(), 'website-factory-dist-validation-'));

  try {
    await mkdir(join(root, 'b'), { recursive: true });
    await mkdir(join(root, 'a'), { recursive: true });
    await writeFile(join(root, 'b', 'index.html'), '<!doctype html><html lang="en"><head><title>B</title></head><body><main><h1>B</h1></main></body></html>');
    await writeFile(join(root, 'a', 'index.html'), '<!doctype html><html lang="en"><head><title>A</title></head><body><main><h1>A</h1></main></body></html>');

    assert.deepEqual(await collectHtmlFiles(root), [
      join(root, 'a', 'index.html'),
      join(root, 'b', 'index.html'),
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('creates validation input with URL, path, HTML, and SEO metadata', () => {
  const html = '<!doctype html><html lang="en"><head><title>Example</title><meta name="description" content="Useful page."><link rel="canonical" href="https://example.test/page/"></head><body><main><h1>Example</h1></main></body></html>';
  const input = createPageValidationInput('/tmp/site/page/index.html', '/tmp/site', html);

  assert.equal(input.path, 'page/index.html');
  assert.equal(input.url, '/page/');
  assert.equal(input.seo?.title, 'Example');
  assert.equal(input.seo?.description, 'Useful page.');
  assert.equal(input.seo?.canonicalUrl, 'https://example.test/page/');
});

test('fails generated dist validation when HTML violates required rules', async () => {
  const root = await mkdtemp(join(tmpdir(), 'website-factory-dist-validation-'));

  try {
    await writeFile(join(root, 'index.html'), '<!doctype html><html><head></head><body><main><h2>Skipped</h2></main></body></html>');
    const result = await runGeneratedDistValidation({ distDir: root, failOnWarnings: false });

    assert.equal(result.ok, false);
    assert.ok(result.issues.some((issue) => issue.ruleId === 'heading-hierarchy'));
    assert.ok(result.issues.some((issue) => issue.ruleId === 'seo-title'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
