#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(root, process.argv[2] ?? 'apps/website-builder/dist');

if (!existsSync(distDir)) {
  throw new Error(`Static output directory does not exist: ${relative(root, distDir)}`);
}

const htmlFiles = await getHtmlFiles(distDir);
let rewrittenFiles = 0;
let rewrittenUrls = 0;

for (const htmlFile of htmlFiles) {
  const source = await readFile(htmlFile, 'utf8');
  const assetPrefix = assetPrefixForHtmlFile(htmlFile);
  const { html, replacements } = rewriteRootUrls(source, htmlFile, assetPrefix);

  if (replacements > 0) {
    await writeFile(htmlFile, html);
    rewrittenFiles += 1;
    rewrittenUrls += replacements;
  }
}

console.log(`Relativized ${rewrittenUrls} static URL(s) across ${rewrittenFiles} HTML file(s).`);

async function getHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return getHtmlFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
  }));

  return files.flat().sort((left, right) => left.localeCompare(right));
}

function assetPrefixForHtmlFile(htmlFile) {
  const relativePath = relative(dirname(htmlFile), distDir).split(sep).join('/');
  return relativePath === '' ? './' : `${relativePath}/`;
}

function rewriteRootUrls(source, htmlFile, assetPrefix) {
  let replacements = 0;
  let html = source.replace(/\b(?<attribute>href|src|poster)=(?<quote>["'])\/(?:\.\/)?(?<path>(?:_astro|themes)\/[^"']+)\k<quote>/g, (...args) => {
    const groups = args.at(-1);

    if (!isAssetAttributeGroups(groups)) {
      return args[0];
    }

    replacements += 1;
    return `${groups.attribute}=${groups.quote}${assetPrefix}${groups.path}${groups.quote}`;
  });

  html = html.replace(/\bsrcset=(?<quote>["'])(?<value>[^"']+)\k<quote>/g, (...args) => {
    const groups = args.at(-1);

    if (!isSrcsetGroups(groups)) {
      return args[0];
    }

    const nextValue = groups.value.replace(/(^|[\s,])\/(?:\.\/)?(?<path>(?:_astro|themes)\/[^\s,]+)/g, (...srcsetArgs) => {
      const srcsetGroups = srcsetArgs.at(-1);

      if (!isPathGroups(srcsetGroups)) {
        return srcsetArgs[0];
      }

      replacements += 1;
      return `${srcsetArgs[1]}${assetPrefix}${srcsetGroups.path}`;
    });

    return `srcset=${groups.quote}${nextValue}${groups.quote}`;
  });

  html = html.replace(/<a\b(?<before>[^>]*?\bhref=)(?<quote>["'])\/(?<path>[^"']*)\k<quote>/g, (...args) => {
    const groups = args.at(-1);

    if (!isAnchorHrefGroups(groups)) {
      return args[0];
    }

    const relativeHref = relativeHrefForRootPath(htmlFile, groups.path);

    if (!relativeHref) {
      return args[0];
    }

    replacements += 1;
    return `<a${groups.before}${groups.quote}${relativeHref}${groups.quote}`;
  });

  return { html, replacements };
}

function relativeHrefForRootPath(htmlFile, rootPath) {
  if (rootPath.startsWith('/') || rootPath.startsWith('_astro/') || rootPath.startsWith('themes/')) {
    return undefined;
  }

  const { pathname, suffix } = splitPathSuffix(rootPath);
  const targetFile = rootPathTargetFile(pathname);
  const relativePath = relative(dirname(htmlFile), targetFile).split(sep).join('/');
  const normalizedPath = relativePath === '' ? 'index.html' : relativePath;

  return `${normalizedPath.startsWith('.') ? normalizedPath : normalizedPath}${suffix}`;
}

function splitPathSuffix(rootPath) {
  const hashIndex = rootPath.indexOf('#');
  const pathAndQuery = hashIndex === -1 ? rootPath : rootPath.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : rootPath.slice(hashIndex);
  const queryIndex = pathAndQuery.indexOf('?');

  if (queryIndex === -1) {
    return { pathname: pathAndQuery, suffix: hash };
  }

  return {
    pathname: pathAndQuery.slice(0, queryIndex),
    suffix: `${pathAndQuery.slice(queryIndex)}${hash}`,
  };
}

function rootPathTargetFile(pathname) {
  if (pathname === '') {
    return join(distDir, 'index.html');
  }

  if (extname(pathname) !== '') {
    return join(distDir, pathname);
  }

  return join(distDir, pathname, 'index.html');
}

function isAssetAttributeGroups(value) {
  return typeof value === 'object'
    && value !== null
    && 'attribute' in value
    && 'quote' in value
    && 'path' in value
    && typeof value.attribute === 'string'
    && typeof value.quote === 'string'
    && typeof value.path === 'string';
}

function isSrcsetGroups(value) {
  return typeof value === 'object'
    && value !== null
    && 'quote' in value
    && 'value' in value
    && typeof value.quote === 'string'
    && typeof value.value === 'string';
}

function isPathGroups(value) {
  return typeof value === 'object'
    && value !== null
    && 'path' in value
    && typeof value.path === 'string';
}

function isAnchorHrefGroups(value) {
  return typeof value === 'object'
    && value !== null
    && 'before' in value
    && 'quote' in value
    && 'path' in value
    && typeof value.before === 'string'
    && typeof value.quote === 'string'
    && typeof value.path === 'string';
}
