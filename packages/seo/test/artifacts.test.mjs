import assert from "node:assert/strict";
import { test } from "node:test";
import {
  generatePageMetadata,
  generateSeoArtifacts,
  mapSchemaToSeo
} from "../dist/index.js";

const site = { name: "Example", url: "https://example.com" };

test("noindex pages still render but are omitted from generated discovery artifacts", () => {
  const manifest = generateSeoArtifacts(site, [
    { path: "/", title: "Home" },
    { path: "/private", title: "Private", noIndex: true }
  ]);

  assert.equal(manifest.pages.length, 2);
  assert.match(manifest.pages[1].metaTags, /noindex,follow/);
  assert.match(manifest.sitemapXml, /https:\/\/example.com\//);
  assert.doesNotMatch(manifest.sitemapXml, /\/private/);
  assert.doesNotMatch(manifest.llmsTxt, /\/private/);
  assert.match(manifest.llmsTxt, /Home/);
});

test("empty image and offer arrays remain optional, while schema noIndex is preserved", () => {
  const metadata = generatePageMetadata(site, { images: [] });
  assert.equal(metadata.twitter.image, undefined);
  assert.equal(metadata.twitter.card, "summary");

  const mapped = mapSchemaToSeo({
    site: { name: "Example", url: site.url },
    pages: [{ path: "/private", noIndex: true, product: { name: "Widget", offers: [] } }]
  });
  assert.equal(mapped.pages[0].noIndex, true);
  assert.equal(mapped.pages[0].product?.offers, undefined);
  assert.doesNotMatch(generateSeoArtifacts(mapped.site, mapped.pages).sitemapXml, /\/private/);
});

test("explicit sitemap overrides remain supported", () => {
  const manifest = generateSeoArtifacts(site, [{ path: "/private", noIndex: true }], {
    sitemapEntries: [{ url: "/custom" }]
  });
  assert.match(manifest.sitemapXml, /\/custom/);
  assert.doesNotMatch(manifest.llmsTxt, /\/private/);
});
