'use strict';

const { existsSync, readdirSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

const defaultBaseUrl = 'http://127.0.0.1:4173';
const baseUrl = (process.env.LHCI_BASE_URL || defaultBaseUrl).replace(/\/+$/, '');
const examplesDirectory = join(__dirname, 'examples');

function findWebsiteYamlFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return findWebsiteYamlFiles(entryPath);
    }

    return entry.isFile() && entry.name === 'website.yaml' ? [entryPath] : [];
  });
}

function readSlug(filePath) {
  const contents = readFileSync(filePath, 'utf8');
  const match = contents.match(/^slug:\s*['"]?([a-z0-9]+(?:-[a-z0-9]+)*)['"]?\s*(?:#.*)?$/m);

  return match ? match[1] : null;
}

const sitePaths = Array.from(new Set(findWebsiteYamlFiles(examplesDirectory).map(readSlug).filter(Boolean)))
  .sort()
  .map((slug) => `/${slug}/`);

module.exports = {
  ci: {
    collect: {
      url: ['/', ...sitePaths].map((path) => `${baseUrl}${path}`),
      numberOfRuns: 3,
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci/reports',
    },
  },
};
