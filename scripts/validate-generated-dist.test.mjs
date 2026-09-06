import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  collectHtmlFiles,
  createPageValidationInput,
  parseArgs,
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

test('keeps standalone HTML filenames and encodes filesystem URL segments', () => {
  const root = join(tmpdir(), 'site');
  assert.equal(createPageValidationInput(join(root, 'about.html'), root, '').url, '/about.html');
  assert.equal(createPageValidationInput(join(root, 'a b', 'index.html'), root, '').url, '/a%20b/');
});

test('checks the complete output graph, including orphan pages, HTML filenames, and downloads', async () => {
  const root = await mkdtemp(join(tmpdir(), 'website-factory-dist-graph-'));
  const html = (body) => `<!doctype html><html lang="en"><head><title>Example</title></head><body><main><h1>Example</h1>${body}</main></body></html>`;

  try {
    await mkdir(join(root, 'downloads'));
    await mkdir(join(root, 'orphan'));
    await writeFile(join(root, 'index.html'), html('<a href="about.html#details">About</a><a href="downloads/guide%20one.pdf">Guide</a>'));
    await writeFile(join(root, 'about.html'), html('<section id="details">Details</section><a href="https://example.test/project/">Home</a>'));
    await writeFile(join(root, 'downloads', 'guide one.pdf'), 'Fixture download');
    await writeFile(join(root, 'orphan', 'index.html'), html('<a href="../about.html#details">About</a>'));
    const options = { distDir: root, baseUrl: 'https://example.test/project/' };
    const valid = await runGeneratedDistValidation(options);
    assert.equal(valid.pageCount, 3);
    assert.deepEqual(valid.issues.filter((issue) => issue.ruleId.startsWith('site-')), []);

    await writeFile(join(root, 'orphan', 'index.html'), html('<a href="../missing/">Missing page</a><a href="../about.html#absent">Missing fragment</a>'));
    const invalid = await runGeneratedDistValidation(options);
    const graphIssues = invalid.issues.filter((issue) => issue.ruleId.startsWith('site-'));
    assert.equal(invalid.ok, false);
    assert.deepEqual(graphIssues.map((issue) => issue.ruleId), ['site-link-target', 'site-link-fragment']);
    assert.ok(graphIssues.every((issue) => issue.path === 'orphan/index.html'));
    assert.equal(graphIssues[0].context.target, '/project/missing/');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('parses deployment base URLs without accepting missing flag values', () => {
  assert.equal(parseArgs(['--base-url', 'https://example.test/project/']).baseUrl, 'https://example.test/project/');
  assert.equal(parseArgs(['--base-url=https://example.test/']).baseUrl, 'https://example.test/');
  assert.throws(() => parseArgs(['--base-url']), /requires a value/);
  assert.throws(() => parseArgs(['--base-url=']), /requires a value/);
});
