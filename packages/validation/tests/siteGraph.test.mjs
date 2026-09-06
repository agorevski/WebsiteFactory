import assert from 'node:assert/strict';
import test from 'node:test';
import { validateSite, validateSiteLinks } from '../dist/index.js';

const inventory = { baseUrl: 'https://preview.example.test/' };

test('reports missing routes and fragments with source and destination evidence', () => {
  const issues = validateSiteLinks([{
    path: 'demo/index.html',
    url: '/demo/',
    html: '<main id="main"><a href="/missing/">Missing route</a><a href="#absent">Missing fragment</a></main>',
  }], inventory);
  assert.deepEqual(issues.map((issue) => issue.ruleId), ['site-link-target', 'site-link-fragment']);
  assert.equal(issues[0].path, 'demo/index.html');
  assert.equal(issues[0].context.href, '/missing/');
  assert.equal(issues[1].context.target, '/demo/#absent');
  assert.equal(issues[1].severity, 'error');
});

test('resolves nested and variation-relative links without dropping the route context', () => {
  assert.deepEqual(validateSiteLinks([
    { url: '/demo/variations/dark/services/', html: '<a href="../?from=services#home">Home</a><a href="./#service">Service</a>', fragmentIds: ['service'] },
    { url: '/demo/variations/dark/', fragmentIds: ['home'] },
  ], inventory), []);
});

test('recognizes directory index aliases and reports duplicate normalized routes', () => {
  const pages = [
    { url: '/demo/', links: [{ href: './index.html#details' }], fragmentIds: ['details'] },
    { url: '/demo/index.html', fragmentIds: ['details'] },
  ];
  assert.deepEqual(validateSiteLinks(pages, inventory).map((issue) => issue.ruleId), ['site-route-duplicate']);
  assert.deepEqual(validateSiteLinks(pages.slice(0, 1), inventory), []);
});

test('ignores external and contact protocols while validating same-origin absolute URLs', () => {
  const hrefs = [
    'https://other.example.test/missing/', '//other.example.test/missing/',
    'mailto:hello@example.test', 'tel:+12065550100', 'sms:+12065550100', 'data:text/plain,hi',
    'https://preview.example.test/missing/',
  ];
  const issues = validateSiteLinks([{ url: '/', links: hrefs.map((href) => ({ href })) }], inventory);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].context.href, hrefs.at(-1));
});

test('recognizes explicitly inventoried assets without guessing from file extensions', () => {
  const issues = validateSiteLinks([{
    url: '/demo/',
    links: [
      { href: '/files/guide.pdf?download=1#page=2' },
      { href: '/files/download' },
      { href: '/files/missing.pdf' },
    ],
  }], { ...inventory, assetPaths: ['/files/guide.pdf', '/files/download'] });
  assert.equal(issues.length, 1);
  assert.equal(issues[0].context.target, '/files/missing.pdf');
});

test('supports encoded and HTML-escaped IDs, named anchors, and browser top/text fragments', () => {
  const html = '<main id="caf&#233;"><span id="a&amp;b"></span><a name="legacy"></a>'
    + '<a href="#caf%C3%A9">Cafe</a><a href="#a&amp;b">Ampersand</a>'
    + '<a href="#legacy">Legacy</a><a href="#top">Top</a><a href="#:~:text=hello">Text</a><a href="#">Empty</a></main>';
  assert.deepEqual(validateSiteLinks([{ url: '/', html }], inventory), []);
});

test('does not count IDs or links in comments, scripts, styles, or textarea text', () => {
  const html = '<!-- <i id="ghost"></i><a href="/ghost/">Ghost</a> -->'
    + '<script>const content = \'<i id="script"></i><a href="/script/">Script</a>\';</script>'
    + '<style>/* <i id="style"></i> */</style><textarea><i id="text"></i></textarea>'
    + '<p data-id="not-id">Text</p><a href="#ghost">Ghost</a><a href="#script">Script</a>'
    + '<a href="#style">Style</a><a href="#text">Text</a><a href="#not-id">Data</a>';
  const issues = validateSiteLinks([{ url: '/', html }], inventory);
  assert.equal(issues.length, 5);
  assert.ok(issues.every((issue) => issue.ruleId === 'site-link-fragment'));
});

test('uses the first base href and honors external document bases', () => {
  assert.deepEqual(validateSiteLinks([
    { url: '/demo/', html: '<base href="/prefix/"><base href="/wrong/"><a href="target/#ok">Target</a>' },
    { url: '/prefix/target/', fragmentIds: ['ok'] },
  ], inventory), []);
  assert.deepEqual(validateSiteLinks([{
    url: '/', html: '<base href="https://elsewhere.example/"><a href="/not-local/">External</a>',
  }], inventory), []);
});

test('retains IDs on raw-text elements while ignoring markup-looking contents', () => {
  const html = '<textarea id="message"><a id="fake" href="/fake/">Not markup</a></textarea>'
    + '<script id="data">const html = "<a href=/missing/>";</script>'
    + '<a href="#message">Message</a><a href="#data">Data</a>';
  assert.deepEqual(validateSiteLinks([{ url: '/', html }], inventory), []);
});

test('resolves relative inventory paths against deployment base paths', () => {
  assert.deepEqual(validateSiteLinks([
    { url: 'demo/', links: [{ href: '../file.pdf' }, { href: '../other/#ok' }] },
    { url: 'other/', fragmentIds: ['ok'] },
  ], { baseUrl: 'https://preview.example.test/project/', assetPaths: ['file.pdf'] }), []);
});

test('preserves partial-input behavior unless the complete inventory is explicitly provided', () => {
  const pages = [{ url: '/demo/', links: [{ href: '/missing/' }] }];
  const options = { rules: [] };
  assert.equal(validateSite({ pages }, options).ok, true);
  const complete = validateSite({ pages, routeInventory: inventory }, options);
  assert.equal(complete.ok, false);
  assert.deepEqual(complete.issues.map((issue) => issue.ruleId), ['site-link-target']);
});

test('does not claim fragments are absent when the destination HTML or IDs were not supplied', () => {
  const pages = [{ url: '/', links: [{ href: '/target/#unknown' }] }, { url: '/target/' }];
  assert.deepEqual(validateSiteLinks(pages, inventory), []);
  assert.equal(validateSiteLinks([pages[0], { ...pages[1], fragmentIds: [] }], inventory)[0].ruleId, 'site-link-fragment');
});

test('fails explicitly on invalid inventory configuration and malformed links', () => {
  assert.throws(() => validateSiteLinks([], { baseUrl: 'file:///site/' }), /HTTP/);
  assert.throws(() => validateSiteLinks([{ path: 'missing.html' }], inventory), /must define a URL/);
  assert.throws(() => validateSiteLinks([{ url: 'https://other.example/' }], inventory), /origin/);
  assert.throws(() => validateSiteLinks([], { ...inventory, assetPaths: ['https://other.example/file.pdf'] }), /origin/);
  const issues = validateSiteLinks([{ url: '/', links: [{ href: 'http://[' }, { href: '#%malformed' }], fragmentIds: [] }], inventory);
  assert.deepEqual(issues.map((issue) => issue.ruleId), ['site-link-url', 'site-link-fragment']);
});

test('is deterministic and does not mutate source inputs', () => {
  const pages = [{ url: '/demo/', links: [{ href: '/missing/' }] }];
  const snapshot = structuredClone(pages);
  const first = validateSiteLinks(pages, inventory);
  assert.deepEqual(validateSiteLinks(pages, inventory), first);
  assert.deepEqual(pages, snapshot);
});
