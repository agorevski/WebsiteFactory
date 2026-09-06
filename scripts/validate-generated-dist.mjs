#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveNpmInvocation } from './build-workspaces.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const defaultDistDir = 'apps/website-builder/dist';
const validationEntry = join(root, 'packages/validation/dist/index.js');

async function collectStaticFiles(directory) {
  if (!existsSync(directory)) {
    throw new Error(`Static output directory ${relative(root, directory)} does not exist. Build the static app first.`);
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectStaticFiles(absolutePath);
    }

    if (entry.isFile()) {
      return [absolutePath];
    }

    return [];
  }));

  return files.flat().sort((left, right) => left.localeCompare(right));
}

export async function collectHtmlFiles(directory) {
  return (await collectStaticFiles(directory)).filter((file) => extname(file).toLowerCase() === '.html');
}

export function createPageValidationInput(htmlFile, distDir, html) {
  const relativePath = relative(distDir, htmlFile).split(sep).join('/');

  return {
    path: relativePath,
    url: htmlFileToUrlPath(relativePath),
    html,
    seo: extractSeo(html),
  };
}

export async function runGeneratedDistValidation(options = {}) {
  const distDir = resolve(root, options.distDir ?? defaultDistDir);
  const failOnWarnings = options.failOnWarnings ?? false;
  const files = await collectStaticFiles(distDir);
  const htmlFiles = files.filter((file) => extname(file).toLowerCase() === '.html');

  if (htmlFiles.length === 0) {
    return {
      ok: false,
      pageCount: 0,
      issues: [{
        ruleId: 'generated-dist-html-files',
        category: 'performance',
        severity: 'error',
        message: `No HTML files found in ${relative(root, distDir)}. Build the static app before validating generated output.`,
        path: relative(root, distDir),
      }],
    };
  }

  const baseUrl = new URL(options.baseUrl ?? 'https://website-factory.invalid/');
  if (!baseUrl.pathname.endsWith('/')) {
    baseUrl.pathname += '/';
  }
  const { validateSite } = await loadValidationPackage();
  const pages = await Promise.all(htmlFiles.map(async (htmlFile) => {
    const html = await readFile(htmlFile, 'utf8');
    const input = createPageValidationInput(htmlFile, distDir, html);
    return { ...input, url: new URL(input.url.slice(1), baseUrl).href };
  }));
  const assetPaths = files
    .filter((file) => extname(file).toLowerCase() !== '.html')
    .map((file) => relative(distDir, file).split(sep).map(encodeURIComponent).join('/'));
  const result = validateSite({
    pages,
    routeInventory: { baseUrl: baseUrl.href, assetPaths },
  }, { failOnWarnings });

  return {
    ok: result.ok,
    pageCount: htmlFiles.length,
    issues: result.issues,
  };
}

export function parseArgs(args) {
  const options = {
    distDir: defaultDistDir,
    failOnWarnings: false,
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dist') {
      options.distDir = readRequiredValue(args, index, arg);
      index += 1;
    } else if (arg.startsWith('--dist=')) {
      options.distDir = readInlineValue(arg, '--dist');
    } else if (arg === '--base-url') {
      options.baseUrl = readRequiredValue(args, index, arg);
      index += 1;
    } else if (arg.startsWith('--base-url=')) {
      options.baseUrl = readInlineValue(arg, '--base-url');
    } else if (arg === '--fail-on-warnings') {
      options.failOnWarnings = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

export async function runCli(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);

  if (options.help) {
    printHelp();
    return 0;
  }

  const result = await runGeneratedDistValidation(options);
  printValidationResult(result);
  return result.ok ? 0 : 1;
}

function htmlFileToUrlPath(relativePath) {
  relativePath = relativePath.split('/').map(encodeURIComponent).join('/');
  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }

  return `/${relativePath}`;
}

function extractSeo(html) {
  return {
    title: stripTags(matchFirst(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i)),
    description: matchFirst(html, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
      ?? matchFirst(html, /<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i),
    canonicalUrl: matchFirst(html, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i)
      ?? matchFirst(html, /<link\b[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i),
    openGraph: {
      title: matchPropertyMeta(html, 'og:title'),
      description: matchPropertyMeta(html, 'og:description'),
    },
    twitter: {
      card: matchNameMeta(html, 'twitter:card'),
    },
    structuredDataTypes: extractStructuredDataTypes(html),
  };
}

function matchFirst(value, pattern) {
  return pattern.exec(value)?.[1]?.trim();
}

function matchNameMeta(html, name) {
  return matchFirst(html, new RegExp(`<meta\\b[^>]*name=["']${escapeRegExp(name)}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i'))
    ?? matchFirst(html, new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*name=["']${escapeRegExp(name)}["'][^>]*>`, 'i'));
}

function matchPropertyMeta(html, property) {
  return matchFirst(html, new RegExp(`<meta\\b[^>]*property=["']${escapeRegExp(property)}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i'))
    ?? matchFirst(html, new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*property=["']${escapeRegExp(property)}["'][^>]*>`, 'i'));
}

function extractStructuredDataTypes(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((match) => {
      try {
        const parsed = JSON.parse(match[1] ?? '{}');
        const items = Array.isArray(parsed) ? parsed : [parsed];
        return items.map((item) => typeof item?.['@type'] === 'string' ? item['@type'] : undefined).filter(Boolean);
      } catch {
        return [];
      }
    });
}

function stripTags(value) {
  return value?.replace(/<[^>]+>/g, '').trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function loadValidationPackage() {
  if (!existsSync(validationEntry)) {
    const invocation = resolveNpmInvocation();
    const result = spawnSync(invocation.command, [...invocation.args, 'run', 'build', '--workspace', '@website-factory/validation'], {
      cwd: root,
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      throw new Error(`Failed to build @website-factory/validation before validating generated output.`);
    }
  }

  return import(pathToFileURL(validationEntry).href);
}

function printValidationResult(result) {
  for (const issue of result.issues) {
    const location = issue.path ? ` ${issue.path}` : '';
    const selector = issue.selector ? ` ${issue.selector}` : '';
    console.log(`${issue.severity.toUpperCase()} ${issue.ruleId}${location}${selector}: ${issue.message}`);
  }

  console.log(`Generated dist validation ${result.ok ? 'passed' : 'failed'}: ${result.issues.length} issue(s) across ${result.pageCount} page(s).`);
}

function readRequiredValue(args, index, flag) {
  const value = args[index + 1];
  if (!value || value.startsWith('-')) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}

function readInlineValue(arg, flag) {
  const value = arg.slice(flag.length + 1);
  if (!value) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}

function printHelp() {
  console.log(`Usage: node scripts/validate-generated-dist.mjs [options]

Options:
  --dist <dir>           Static output directory. Default: ${defaultDistDir}
  --base-url <url>       Public HTTP(S) deployment URL, including any path prefix;
                        enables checking same-origin absolute links (no network requests)
  --fail-on-warnings     Exit non-zero when validation warnings are present
  --help                 Show this help
`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  runCli().then((exitCode) => {
    process.exitCode = exitCode;
  }, (error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
