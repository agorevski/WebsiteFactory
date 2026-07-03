#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schemaEntry = join(root, 'packages/schema/dist/index.js');

if (!existsSync(schemaEntry)) {
  const schemaBuild = spawnSync('npm', ['run', 'build', '--workspace', '@website-factory/schema'], {
    cwd: root,
    stdio: 'inherit',
  });

  if (schemaBuild.status !== 0) {
    process.exit(schemaBuild.status ?? 1);
  }
}

const { parseUniversalSite } = await import(pathToFileURL(schemaEntry).href);
const failures = [];

const requiredFiles = [
  'apps/website-builder/package.json',
  'apps/website-builder/astro.config.mjs',
  'apps/website-builder/tsconfig.json',
  'apps/website-builder/src/pages/index.astro',
  'apps/website-builder/src/pages/[slug].astro',
  'apps/website-builder/src/pages/[slug]/[...page].astro',
  'apps/website-builder/src/lib/schema.ts',
  'docs/architecture.md',
  'docs/universal-schema.md',
  'docs/templates-and-themes.md',
  'docs/ai-workflow.md',
  'docs/seo-accessibility-performance.md',
  'docs/deployment.md',
];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    failures.push(`Missing ${file}`);
  }
}

const requiredYamlTokens = [
  'schemaVersion:',
  'slug:',
  'vertical:',
  'theme:',
  'seo:',
  'business:',
  'navigation:',
  'hero:',
  'sections:',
  'pages:',
];

const examplesDir = join(root, 'examples');
const exampleFiles = existsSync(examplesDir)
  ? await getWebsiteYamlFiles(examplesDir, 'examples')
  : [];

const slugs = new Set();
const verticals = new Set();

for (const { absoluteFile, relativeFile } of exampleFiles) {
  const source = await readFile(absoluteFile, 'utf8');
  let site;

  for (const token of requiredYamlTokens) {
    if (!source.includes(token)) {
      failures.push(`${relativeFile} is missing ${token}`);
    }
  }

  try {
    site = parseUniversalSite(source, relativeFile);
  } catch (error) {
    failures.push(error instanceof Error ? error.message : `${relativeFile} failed universal schema validation`);
    continue;
  }

  const { slug, vertical } = site;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    failures.push(`${relativeFile} has an invalid slug`);
  } else if (slugs.has(slug)) {
    failures.push(`${relativeFile} duplicates slug ${slug}`);
  } else {
    slugs.add(slug);
  }

  if (vertical) {
    verticals.add(vertical);
  }

  const sectionIds = new Set(site.sections.map((section) => section.id));
  const pagePaths = new Set();

  for (const page of site.pages) {
    const pagePath = normalizePagePath(page.path);

    if (pagePaths.has(pagePath)) {
      failures.push(`${relativeFile} duplicates page path ${pagePath}`);
    } else {
      pagePaths.add(pagePath);
    }

    for (const sectionId of page.sections) {
      if (!sectionIds.has(sectionId)) {
        failures.push(`${relativeFile} page ${pagePath} references missing section ${sectionId}`);
      }
    }
  }
}

for (const expected of ['medical', 'home-services', 'food', 'professional']) {
  if (!verticals.has(expected)) {
    failures.push(`Missing ${expected} example vertical`);
  }
}

if (exampleFiles.length < 4) {
  failures.push('Expected at least four example YAML files');
}

if (failures.length > 0) {
  console.error('Website builder validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Validated ${exampleFiles.length} examples, ${requiredFiles.length} app/doc files, and ${slugs.size} unique slugs.`);

if (process.argv.includes('--build')) {
  const result = spawnSync('npm', ['run', 'build', '--workspace', '@website-factory/website-builder'], {
    cwd: root,
    stdio: 'inherit',
  });
  process.exit(result.status ?? 1);
}

async function getWebsiteYamlFiles(directory, relativeDirectory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const absolutePath = join(directory, entry.name);
    const relativePath = `${relativeDirectory}/${entry.name}`;

    if (entry.isDirectory()) {
      return getWebsiteYamlFiles(absolutePath, relativePath);
    }

    if (entry.isFile() && entry.name === 'website.yaml') {
      return [{ absoluteFile: absolutePath, relativeFile: relativePath }];
    }

    return [];
  }));

  return files.flat().sort((left, right) => left.relativeFile.localeCompare(right.relativeFile));
}

function normalizePagePath(path) {
  const collapsedPath = path.trim().replace(/\/+/g, '/');

  if (collapsedPath === '' || collapsedPath === '/') {
    return '/';
  }

  const withLeadingSlash = collapsedPath.startsWith('/') ? collapsedPath : `/${collapsedPath}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}
