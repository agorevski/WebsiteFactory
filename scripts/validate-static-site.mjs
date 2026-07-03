#!/usr/bin/env node
import { constants, existsSync, accessSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const defaultSiteUrl = 'http://127.0.0.1:4173/';
const defaultDistDir = 'apps/website-builder/dist';
const defaultValidatorUrl = 'http://127.0.0.1:8888/nu/';
const defaultLinkRequestTimeoutMs = 10_000;
const defaultProcessTimeoutMs = 300_000;
const defaultHtmlPageTimeoutMs = 120_000;

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

try {
  await main(options);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

async function main(config) {
  if (config.skipLinkinator && config.skipHtmlValidator) {
    throw new Error('Nothing to validate: do not pass both --skip-linkinator and --skip-html-validator.');
  }

  const siteUrl = normalizeUrl(config.siteUrl, 'site URL');
  const validatorUrl = normalizeUrl(config.validatorUrl, 'validator URL');
  const distDir = resolve(root, config.distDir);

  if (!isLocalUrl(siteUrl) && !config.allowNonLocalSite) {
    throw new Error(`Refusing to validate non-local site URL ${siteUrl.href}. Pass --allow-non-local-site if this is intentional.`);
  }

  if (!config.skipHtmlValidator && !isLocalUrl(validatorUrl)) {
    throw new Error(`Refusing to use non-local HTML validator ${validatorUrl.href}. Use a local Nu validator endpoint or pass --skip-html-validator.`);
  }

  await assertReachable(siteUrl.href, 'generated static site');

  const failures = [];

  if (!config.skipLinkinator) {
    const linkinatorResult = runLinkinator(siteUrl, config);
    if (linkinatorResult !== 0) {
      failures.push(`linkinator exited with ${linkinatorResult}`);
    }
  }

  if (!config.skipHtmlValidator) {
    await assertValidatorReachable(validatorUrl.href);
    const htmlFiles = await getHtmlFiles(distDir);

    if (htmlFiles.length === 0) {
      failures.push(`No HTML files found in ${relative(root, distDir)}. Build the static app before running this validation.`);
    } else {
      const htmlFailures = runHtmlValidator(htmlFiles, distDir, siteUrl, validatorUrl, config);
      failures.push(...htmlFailures);
    }
  }

  if (failures.length > 0) {
    console.error('\nStatic site validation failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('\nStatic site validation passed.');
}

function runLinkinator(siteUrl, config) {
  const command = resolveTool('linkinator', 'LINKINATOR_BIN');
  const args = [
    siteUrl.href,
    '--recurse',
    '--check-css',
    '--check-fragments',
    '--timeout',
    String(config.linkRequestTimeoutMs),
    '--skip',
    buildExternalHttpSkip(siteUrl),
    '--skip',
    buildExternalProtocolRelativeSkip(siteUrl),
    '--skip',
    '^mailto:',
    '--skip',
    '^tel:',
    '--skip',
    '^sms:',
    '--skip',
    '^data:',
    '--skip',
    '^javascript:',
  ];

  for (const skipPattern of config.linkSkips) {
    args.push('--skip', skipPattern);
  }

  console.log(`\nChecking local links/resources with linkinator at ${siteUrl.href}`);
  return runTool(command, args, {
    missingPackage: 'linkinator',
    timeout: config.processTimeoutMs,
  });
}

function runHtmlValidator(htmlFiles, distDir, siteUrl, validatorUrl, config) {
  const command = resolveTool('html-validator', 'HTML_VALIDATOR_BIN');
  const failures = [];

  console.log(`\nValidating ${htmlFiles.length} generated HTML page(s) with ${validatorUrl.href}`);

  for (const htmlFile of htmlFiles) {
    const pageUrl = htmlFileToUrl(htmlFile, distDir, siteUrl);
    const args = [
      pageUrl,
      '--islocal',
      `--validator=${validatorUrl.href}`,
      '--format=gnu',
      '--verbose',
    ];

    for (const ignoredMessage of config.htmlIgnores) {
      args.push(`--ignore=${ignoredMessage}`);
    }

    console.log(`\nHTML validator: ${pageUrl}`);
    const status = runTool(command, args, {
      missingPackage: 'html-validator-cli',
      timeout: config.htmlPageTimeoutMs,
    });

    if (status !== 0) {
      failures.push(`html-validator failed for ${pageUrl} with ${status}`);
    }
  }

  return failures;
}

function runTool(command, args, { missingPackage, timeout }) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    timeout,
  });

  if (result.error) {
    if (result.error.code === 'ENOENT') {
      console.error(`Missing ${missingPackage}. Add it to the workspace dev dependencies or set ${toolEnvName(command)}.`);
    } else if (result.error.code === 'ETIMEDOUT') {
      console.error(`${command} timed out after ${timeout}ms.`);
    } else {
      console.error(`${command} failed to start: ${result.error.message}`);
    }
    return 1;
  }

  if (result.signal) {
    console.error(`${command} exited after signal ${result.signal}.`);
    return 1;
  }

  return result.status ?? 1;
}

async function assertReachable(url, label) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'website-factory-static-validation',
      },
    });

    if (response.status >= 400) {
      throw new Error(`${label} at ${url} returned HTTP ${response.status}.`);
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot reach ${label} at ${url}. Start the built static app locally before running this script. ${detail}`);
  } finally {
    clearTimeout(timer);
  }
}

async function assertValidatorReachable(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);

  try {
    await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'website-factory-static-validation',
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot reach local Nu HTML validator at ${url}. Start a local validator before running HTML validation. ${detail}`);
  } finally {
    clearTimeout(timer);
  }
}

async function getHtmlFiles(directory) {
  if (!existsSync(directory)) {
    throw new Error(`Static output directory ${relative(root, directory)} does not exist. Build the static app first.`);
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return getHtmlFiles(absolutePath);
    }

    if (entry.isFile() && extname(entry.name) === '.html') {
      return [absolutePath];
    }

    return [];
  }));

  return files.flat().sort((left, right) => left.localeCompare(right));
}

function htmlFileToUrl(htmlFile, distDir, siteUrl) {
  const relativeFile = relative(distDir, htmlFile).split(sep).join('/');
  const parts = relativeFile.split('/').map(encodeURIComponent);
  let urlPath = parts.join('/');

  if (urlPath === 'index.html') {
    urlPath = '';
  } else if (urlPath.endsWith('/index.html')) {
    urlPath = urlPath.slice(0, -'index.html'.length);
  }

  return new URL(urlPath, siteUrl).href;
}

function resolveTool(binaryName, envName) {
  const fromEnv = process.env[envName];

  if (fromEnv) {
    return fromEnv;
  }

  const executableName = process.platform === 'win32' ? `${binaryName}.cmd` : binaryName;
  const candidates = [
    join(root, 'node_modules', '.bin', executableName),
    join(root, 'apps', 'website-builder', 'node_modules', '.bin', executableName),
  ];

  for (const candidate of candidates) {
    try {
      accessSync(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Try the next conventional workspace binary location.
    }
  }

  return binaryName;
}

function toolEnvName(command) {
  if (command.endsWith('linkinator')) {
    return 'LINKINATOR_BIN';
  }

  if (command.endsWith('html-validator')) {
    return 'HTML_VALIDATOR_BIN';
  }

  return 'the matching *_BIN environment variable';
}

function normalizeUrl(value, label) {
  try {
    const url = new URL(value);
    if (!url.pathname.endsWith('/')) {
      url.pathname = `${url.pathname}/`;
    }
    return url;
  } catch {
    throw new Error(`Invalid ${label}: ${value}`);
  }
}

function isLocalUrl(url) {
  return ['127.0.0.1', 'localhost', '::1', '[::1]', '0.0.0.0'].includes(url.hostname);
}

function buildExternalHttpSkip(siteUrl) {
  const allowedHost = escapeRegex(siteUrl.host);
  return `^https?:\\/\\/(?!${allowedHost}(?:[\\/?#]|$))`;
}

function buildExternalProtocolRelativeSkip(siteUrl) {
  const allowedHost = escapeRegex(siteUrl.host);
  return `^\\/\\/(?!${allowedHost}(?:[\\/?#]|$))`;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseArgs(argv) {
  const config = {
    siteUrl: process.env.STATIC_SITE_URL ?? defaultSiteUrl,
    distDir: process.env.STATIC_SITE_DIST ?? defaultDistDir,
    validatorUrl: process.env.HTML_VALIDATOR_URL ?? defaultValidatorUrl,
    linkRequestTimeoutMs: readIntegerEnv('LINKINATOR_TIMEOUT_MS', defaultLinkRequestTimeoutMs),
    processTimeoutMs: readIntegerEnv('STATIC_VALIDATION_TIMEOUT_MS', defaultProcessTimeoutMs),
    htmlPageTimeoutMs: readIntegerEnv('HTML_VALIDATOR_TIMEOUT_MS', defaultHtmlPageTimeoutMs),
    linkSkips: [],
    htmlIgnores: [],
    skipLinkinator: false,
    skipHtmlValidator: false,
    allowNonLocalSite: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      config.help = true;
    } else if (arg === '--site-url') {
      config.siteUrl = readNext(argv, index, arg);
      index += 1;
    } else if (arg.startsWith('--site-url=')) {
      config.siteUrl = readInline(arg);
    } else if (arg === '--dist-dir') {
      config.distDir = readNext(argv, index, arg);
      index += 1;
    } else if (arg.startsWith('--dist-dir=')) {
      config.distDir = readInline(arg);
    } else if (arg === '--validator-url') {
      config.validatorUrl = readNext(argv, index, arg);
      index += 1;
    } else if (arg.startsWith('--validator-url=')) {
      config.validatorUrl = readInline(arg);
    } else if (arg === '--link-skip') {
      config.linkSkips.push(readNext(argv, index, arg));
      index += 1;
    } else if (arg.startsWith('--link-skip=')) {
      config.linkSkips.push(readInline(arg));
    } else if (arg === '--html-ignore') {
      config.htmlIgnores.push(readNext(argv, index, arg));
      index += 1;
    } else if (arg.startsWith('--html-ignore=')) {
      config.htmlIgnores.push(readInline(arg));
    } else if (arg === '--link-timeout-ms') {
      config.linkRequestTimeoutMs = readInteger(readNext(argv, index, arg), arg);
      index += 1;
    } else if (arg.startsWith('--link-timeout-ms=')) {
      config.linkRequestTimeoutMs = readInteger(readInline(arg), '--link-timeout-ms');
    } else if (arg === '--process-timeout-ms') {
      config.processTimeoutMs = readInteger(readNext(argv, index, arg), arg);
      index += 1;
    } else if (arg.startsWith('--process-timeout-ms=')) {
      config.processTimeoutMs = readInteger(readInline(arg), '--process-timeout-ms');
    } else if (arg === '--html-timeout-ms') {
      config.htmlPageTimeoutMs = readInteger(readNext(argv, index, arg), arg);
      index += 1;
    } else if (arg.startsWith('--html-timeout-ms=')) {
      config.htmlPageTimeoutMs = readInteger(readInline(arg), '--html-timeout-ms');
    } else if (arg === '--skip-linkinator') {
      config.skipLinkinator = true;
    } else if (arg === '--skip-html-validator') {
      config.skipHtmlValidator = true;
    } else if (arg === '--allow-non-local-site') {
      config.allowNonLocalSite = true;
    } else {
      throw new Error(`Unknown option ${arg}. Run node scripts/validate-static-site.mjs --help for usage.`);
    }
  }

  return config;
}

function readNext(argv, index, optionName) {
  const value = argv[index + 1];

  if (!value || value.startsWith('--')) {
    throw new Error(`${optionName} requires a value.`);
  }

  return value;
}

function readInline(arg) {
  return arg.slice(arg.indexOf('=') + 1);
}

function readIntegerEnv(name, fallback) {
  const value = process.env[name];
  return value ? readInteger(value, name) : fallback;
}

function readInteger(value, label) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }

  return parsed;
}

function printHelp() {
  console.log(`Validate a built Website Factory static site served locally.

Usage:
  node scripts/validate-static-site.mjs [options]

Defaults:
  --site-url ${defaultSiteUrl}
  --dist-dir ${defaultDistDir}
  --validator-url ${defaultValidatorUrl}

Options:
  --site-url <url>            Local static preview URL to crawl.
  --dist-dir <path>           Built static output directory to map HTML files to URLs.
  --validator-url <url>       Local Nu HTML checker endpoint for html-validator-cli.
  --link-skip <pattern>       Extra linkinator skip regex. Repeatable.
  --html-ignore <message>     html-validator-cli message to ignore. Repeatable.
  --link-timeout-ms <ms>      Per-request linkinator timeout.
  --process-timeout-ms <ms>   Overall linkinator process timeout.
  --html-timeout-ms <ms>      Per-page html-validator-cli process timeout.
  --skip-linkinator           Skip local link/resource validation.
  --skip-html-validator       Skip local HTML validation.
  --allow-non-local-site      Allow a non-loopback static site URL.
  -h, --help                  Show this help.

Environment:
  STATIC_SITE_URL, STATIC_SITE_DIST, HTML_VALIDATOR_URL
  LINKINATOR_TIMEOUT_MS, STATIC_VALIDATION_TIMEOUT_MS, HTML_VALIDATOR_TIMEOUT_MS
  LINKINATOR_BIN, HTML_VALIDATOR_BIN

Recommended local flow:
  1. Build the static app.
  2. Serve it at http://127.0.0.1:4173.
  3. Start a local Nu HTML checker at http://127.0.0.1:8888/nu/.
  4. Run this script.

The link check skips external http(s), mail, phone, data, and javascript URLs by default so validation does not depend on hosted services.`);
}
