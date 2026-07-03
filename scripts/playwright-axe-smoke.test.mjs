import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeViewport,
  parseArgs,
  screenshotPathForUrl,
} from './playwright-axe-smoke.mjs';

test('parseArgs accepts viewport, screenshot directory, and horizontal overflow checks', () => {
  const options = parseArgs([
    '--url=http://127.0.0.1:4173',
    '--max-pages=5',
    '--viewport=390x844',
    '--screenshot-dir=.website-factory-qa/screenshots',
    '--fail-on-horizontal-overflow',
    '--allow-crawl-limit',
    '--skip-axe',
    '/sample/',
  ]);

  assert.deepEqual(options.viewport, { width: 390, height: 844 });
  assert.equal(options.screenshotDir, '.website-factory-qa/screenshots');
  assert.equal(options.failOnHorizontalOverflow, true);
  assert.equal(options.allowCrawlLimit, true);
  assert.equal(options.skipAxe, true);
  assert.deepEqual(options.startUrls, ['http://127.0.0.1:4173/sample/']);
});

test('normalizeViewport rejects malformed viewport values', () => {
  assert.throws(() => normalizeViewport('390'), /viewport must use WIDTHxHEIGHT/);
  assert.throws(() => normalizeViewport('0x844'), /viewport width and height must be positive/);
  assert.throws(() => normalizeViewport('390xwide'), /viewport must use WIDTHxHEIGHT/);
});

test('screenshotPathForUrl creates deterministic local PNG paths', () => {
  assert.equal(
    screenshotPathForUrl('http://127.0.0.1:4173/service/plumbing/?debug=1', '.website-factory-qa/screenshots'),
    '.website-factory-qa/screenshots/service-plumbing.png',
  );
  assert.equal(
    screenshotPathForUrl('http://127.0.0.1:4173/', '.website-factory-qa/screenshots'),
    '.website-factory-qa/screenshots/index.png',
  );
});
