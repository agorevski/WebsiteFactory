#!/usr/bin/env node
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const DEFAULT_BASE_URL = 'http://127.0.0.1:4173';
const DEFAULT_MAX_PAGES = 100;
const DEFAULT_NAVIGATION_TIMEOUT_MS = 15000;
const DEFAULT_SETTLE_MS = 250;
const PAGE_FILE_EXTENSION_PATTERN = /\.(?:avif|bmp|css|csv|gif|ico|jpe?g|js|json|map|mp3|mp4|pdf|png|svg|txt|webm|webp|xml|zip)$/i;

const helpText = `Usage: node scripts/playwright-axe-smoke.mjs [options] [start-path-or-url ...]

Crawls a locally served generated static site with Playwright and @axe-core/playwright.

Options:
  --url <url>             Base URL to crawl. Default: GENERATED_SITE_URL, SITE_URL,
                          PLAYWRIGHT_BASE_URL, or ${DEFAULT_BASE_URL}
  --max-pages <count>     Maximum same-origin pages to visit. Default: ${DEFAULT_MAX_PAGES}
  --browser <name>        chromium, firefox, or webkit. Default: chromium
  --timeout-ms <ms>       Navigation timeout per page. Default: ${DEFAULT_NAVIGATION_TIMEOUT_MS}
  --settle-ms <ms>        Delay after load before collecting links and running axe. Default: ${DEFAULT_SETTLE_MS}
  --viewport <WxH>        Browser viewport, for example 390x844. Default: browser default
  --screenshot-dir <dir>  Write full-page PNG screenshots for visited pages
  --fail-on-horizontal-overflow
                          Report pages where content overflows the viewport horizontally
  --headed                Run the browser headed. Default: headless
  --skip-axe              Skip axe-core checks and only run browser/network smoke checks
  --help                  Show this help

Environment variables:
  GENERATED_SITE_URL, SITE_URL, PLAYWRIGHT_BASE_URL
  GENERATED_SITE_MAX_PAGES, PLAYWRIGHT_BROWSER, PLAYWRIGHT_TIMEOUT_MS,
  PLAYWRIGHT_SETTLE_MS, PLAYWRIGHT_VIEWPORT, PLAYWRIGHT_SCREENSHOT_DIR,
  PLAYWRIGHT_FAIL_ON_HORIZONTAL_OVERFLOW, PLAYWRIGHT_HEADED, SKIP_AXE
`;

export async function runCli(argv = process.argv.slice(2)) {
  const config = parseArgs(argv);

  if (config.help) {
    console.log(helpText);
    return 0;
  }

  const { playwright, AxeBuilder } = await loadDependencies(config.skipAxe);
  const browserType = getBrowserType(playwright, config.browser);
  const browser = await browserType.launch({ headless: !config.headed });
  const context = await browser.newContext(config.viewport ? { viewport: config.viewport } : undefined);

  try {
    const result = await crawlGeneratedSite(context, AxeBuilder, config);
    printResult(result, config);
    return result.findings.length > 0 ? 1 : 0;
  } finally {
    await browser.close();
  }
}

export function parseArgs(args) {
  const options = {
    baseUrl: firstDefinedEnv(['GENERATED_SITE_URL', 'SITE_URL', 'PLAYWRIGHT_BASE_URL']) ?? DEFAULT_BASE_URL,
    browser: process.env.PLAYWRIGHT_BROWSER ?? 'chromium',
    maxPages: readInteger(process.env.GENERATED_SITE_MAX_PAGES, DEFAULT_MAX_PAGES, 'GENERATED_SITE_MAX_PAGES'),
    navigationTimeoutMs: readInteger(process.env.PLAYWRIGHT_TIMEOUT_MS, DEFAULT_NAVIGATION_TIMEOUT_MS, 'PLAYWRIGHT_TIMEOUT_MS'),
    settleMs: readInteger(process.env.PLAYWRIGHT_SETTLE_MS, DEFAULT_SETTLE_MS, 'PLAYWRIGHT_SETTLE_MS'),
    viewport: process.env.PLAYWRIGHT_VIEWPORT ? normalizeViewport(process.env.PLAYWRIGHT_VIEWPORT) : undefined,
    screenshotDir: process.env.PLAYWRIGHT_SCREENSHOT_DIR,
    failOnHorizontalOverflow: readBoolean(process.env.PLAYWRIGHT_FAIL_ON_HORIZONTAL_OVERFLOW),
    headed: readBoolean(process.env.PLAYWRIGHT_HEADED),
    skipAxe: readBoolean(process.env.SKIP_AXE),
    startInputs: [],
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--url') {
      options.baseUrl = readRequiredValue(args, index, arg);
      index += 1;
    } else if (arg.startsWith('--url=')) {
      options.baseUrl = readInlineValue(arg, '--url');
    } else if (arg === '--max-pages') {
      options.maxPages = readInteger(readRequiredValue(args, index, arg), DEFAULT_MAX_PAGES, arg);
      index += 1;
    } else if (arg.startsWith('--max-pages=')) {
      options.maxPages = readInteger(readInlineValue(arg, '--max-pages'), DEFAULT_MAX_PAGES, arg);
    } else if (arg === '--browser') {
      options.browser = readRequiredValue(args, index, arg);
      index += 1;
    } else if (arg.startsWith('--browser=')) {
      options.browser = readInlineValue(arg, '--browser');
    } else if (arg === '--timeout-ms') {
      options.navigationTimeoutMs = readInteger(readRequiredValue(args, index, arg), DEFAULT_NAVIGATION_TIMEOUT_MS, arg);
      index += 1;
    } else if (arg.startsWith('--timeout-ms=')) {
      options.navigationTimeoutMs = readInteger(readInlineValue(arg, '--timeout-ms'), DEFAULT_NAVIGATION_TIMEOUT_MS, arg);
    } else if (arg === '--settle-ms') {
      options.settleMs = readInteger(readRequiredValue(args, index, arg), DEFAULT_SETTLE_MS, arg);
      index += 1;
    } else if (arg.startsWith('--settle-ms=')) {
      options.settleMs = readInteger(readInlineValue(arg, '--settle-ms'), DEFAULT_SETTLE_MS, arg);
    } else if (arg === '--viewport') {
      options.viewport = normalizeViewport(readRequiredValue(args, index, arg));
      index += 1;
    } else if (arg.startsWith('--viewport=')) {
      options.viewport = normalizeViewport(readInlineValue(arg, '--viewport'));
    } else if (arg === '--screenshot-dir') {
      options.screenshotDir = readRequiredValue(args, index, arg);
      index += 1;
    } else if (arg.startsWith('--screenshot-dir=')) {
      options.screenshotDir = readInlineValue(arg, '--screenshot-dir');
    } else if (arg === '--fail-on-horizontal-overflow') {
      options.failOnHorizontalOverflow = true;
    } else if (arg === '--headed') {
      options.headed = true;
    } else if (arg === '--skip-axe') {
      options.skipAxe = true;
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      options.startInputs.push(arg);
    }
  }

  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const startUrls = options.startInputs.length > 0
    ? options.startInputs.map((input) => normalizeStartUrl(input, baseUrl))
    : [baseUrl.href];

  return {
    ...options,
    baseUrl,
    startUrls,
  };
}

async function loadDependencies(skipAxe) {
  let playwright;

  try {
    playwright = await import('playwright');
  } catch (error) {
    throwMissingDependencyError(error, 'playwright');
  }

  if (skipAxe) {
    return { playwright, AxeBuilder: undefined };
  }

  try {
    const axe = await import('@axe-core/playwright');
    const AxeBuilder = axe.AxeBuilder ?? axe.default;

    if (typeof AxeBuilder !== 'function') {
      throw new Error('@axe-core/playwright did not expose AxeBuilder.');
    }

    return { playwright, AxeBuilder };
  } catch (error) {
    throwMissingDependencyError(error, '@axe-core/playwright');
  }
}

function throwMissingDependencyError(error, packageName) {
  if (isModuleNotFoundError(error)) {
    throw new Error(
      `Missing ${packageName}. Install the repo dev dependencies that wire this runner, then retry.\n` +
      'Expected packages: playwright and @axe-core/playwright.'
    );
  }

  throw error;
}

function isModuleNotFoundError(error) {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && error.code === 'ERR_MODULE_NOT_FOUND';
}

function getBrowserType(playwright, browserName) {
  const normalizedBrowserName = browserName.toLowerCase();
  const browsers = {
    chromium: playwright.chromium,
    firefox: playwright.firefox,
    webkit: playwright.webkit,
  };

  const browserType = browsers[normalizedBrowserName];

  if (!browserType) {
    throw new Error(`Unsupported browser "${browserName}". Use chromium, firefox, or webkit.`);
  }

  return browserType;
}

async function crawlGeneratedSite(context, AxeBuilder, options) {
  const queue = [...new Set(options.startUrls)];
  const queued = new Set(queue);
  const visited = [];
  const findings = [];
  let skippedForLimit = 0;

  while (queue.length > 0 && visited.length < options.maxPages) {
    const url = queue.shift();
    const pageResult = await inspectPage(context, AxeBuilder, url, options);

    visited.push(url);
    findings.push(...pageResult.findings);

    for (const link of pageResult.links) {
      if (visited.includes(link) || queued.has(link)) {
        continue;
      }

      if (visited.length + queue.length >= options.maxPages) {
        skippedForLimit += 1;
        continue;
      }

      queue.push(link);
      queued.add(link);
    }
  }

  if (queue.length > 0 || skippedForLimit > 0) {
    findings.push({
      type: 'crawl-limit',
      pageUrl: options.baseUrl.href,
      message: `Stopped after ${visited.length} pages with ${queue.length + skippedForLimit} page(s) not visited. Increase --max-pages to crawl everything.`,
    });
  }

  return { visited, findings };
}

async function inspectPage(context, AxeBuilder, url, options) {
  const page = await context.newPage();
  const findings = [];
  const links = [];
  const sameOrigin = (candidateUrl) => isSameOrigin(candidateUrl, options.baseUrl);
  const onPageError = (error) => {
    findings.push({
      type: 'page-error',
      pageUrl: url,
      message: error.message,
      detail: error.stack,
    });
  };
  const onConsole = (message) => {
    if (message.type() === 'error') {
      const location = message.location();
      findings.push({
        type: 'console-error',
        pageUrl: url,
        message: message.text(),
        detail: formatLocation(location),
      });
    }
  };
  const onRequestFailed = (request) => {
    const failure = request.failure();
    findings.push({
      type: 'request-failed',
      pageUrl: url,
      message: `${request.method()} ${request.url()} failed`,
      detail: failure?.errorText ?? 'Unknown network failure',
    });
  };
  const onResponse = (response) => {
    if (response.status() >= 400 && sameOrigin(response.url())) {
      const request = response.request();
      findings.push({
        type: 'http-status',
        pageUrl: url,
        message: `${response.status()} ${response.statusText()} for ${request.method()} ${response.url()}`,
        detail: `resourceType=${request.resourceType()}`,
      });
    }
  };

  page.on('pageerror', onPageError);
  page.on('console', onConsole);
  page.on('requestfailed', onRequestFailed);
  page.on('response', onResponse);

  let loaded = false;

  try {
    await page.goto(url, {
      waitUntil: 'load',
      timeout: options.navigationTimeoutMs,
    });
    await page.waitForTimeout(options.settleMs);
    loaded = true;
  } catch (error) {
    findings.push({
      type: 'navigation-error',
      pageUrl: url,
      message: error instanceof Error ? error.message : `Navigation failed for ${url}`,
    });
  }

  if (loaded) {
    if (options.failOnHorizontalOverflow) {
      try {
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        if (overflow.scrollWidth > overflow.clientWidth) {
          findings.push({
            type: 'horizontal-overflow',
            pageUrl: url,
            message: `Page overflows horizontally: scrollWidth ${overflow.scrollWidth}px exceeds clientWidth ${overflow.clientWidth}px.`,
          });
        }
      } catch (error) {
        findings.push({
          type: 'overflow-check-error',
          pageUrl: url,
          message: error instanceof Error ? error.message : `Failed to check horizontal overflow for ${url}`,
        });
      }
    }

    if (options.screenshotDir) {
      try {
        await mkdir(options.screenshotDir, { recursive: true });
        await page.screenshot({
          path: screenshotPathForUrl(url, options.screenshotDir),
          fullPage: true,
        });
      } catch (error) {
        findings.push({
          type: 'screenshot-error',
          pageUrl: url,
          message: error instanceof Error ? error.message : `Failed to write screenshot for ${url}`,
        });
      }
    }

    if (AxeBuilder) {
      try {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        for (const violation of accessibilityScanResults.violations) {
          findings.push({
            type: 'axe-violation',
            pageUrl: url,
            message: `${violation.id} (${violation.impact ?? 'unknown impact'}): ${violation.help}`,
            detail: formatAxeViolation(violation),
          });
        }
      } catch (error) {
        findings.push({
          type: 'axe-error',
          pageUrl: url,
          message: error instanceof Error ? error.message : `Axe analysis failed for ${url}`,
        });
      }
    }

    try {
      const pageLinks = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.href));

      for (const href of pageLinks) {
        const normalizedHref = normalizeDiscoveredUrl(href, options.baseUrl);

        if (normalizedHref) {
          links.push(normalizedHref);
        }
      }
    } catch (error) {
      findings.push({
        type: 'link-crawl-error',
        pageUrl: url,
        message: error instanceof Error ? error.message : `Failed to collect links for ${url}`,
      });
    }
  }

  page.off('pageerror', onPageError);
  page.off('console', onConsole);
  page.off('requestfailed', onRequestFailed);
  page.off('response', onResponse);
  await page.close();

  return { findings, links };
}

function normalizeBaseUrl(value) {
  const url = new URL(value);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`Base URL must use http or https: ${value}`);
  }

  url.hash = '';
  return url;
}

function normalizeStartUrl(input, baseUrl) {
  const url = new URL(input, baseUrl);
  const normalizedUrl = normalizeDiscoveredUrl(url.href, baseUrl);

  if (!normalizedUrl) {
    throw new Error(`Start URL must be a same-origin page URL: ${input}`);
  }

  return normalizedUrl;
}

function normalizeDiscoveredUrl(value, baseUrl) {
  let url;

  try {
    url = new URL(value, baseUrl);
  } catch {
    return undefined;
  }

  if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !isSameOrigin(url.href, baseUrl)) {
    return undefined;
  }

  url.hash = '';

  if (!looksLikePageUrl(url)) {
    return undefined;
  }

  return url.href;
}

function looksLikePageUrl(url) {
  return !PAGE_FILE_EXTENSION_PATTERN.test(url.pathname);
}

export function normalizeViewport(value) {
  const match = /^(\d+)x(\d+)$/i.exec(value);

  if (!match) {
    throw new Error(`viewport must use WIDTHxHEIGHT, for example 390x844.`);
  }

  const width = Number.parseInt(match[1], 10);
  const height = Number.parseInt(match[2], 10);

  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1) {
    throw new Error('viewport width and height must be positive integers.');
  }

  return { width, height };
}

export function screenshotPathForUrl(value, screenshotDir) {
  const url = new URL(value);
  const slug = url.pathname
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'index';

  return join(screenshotDir, `${slug}.png`);
}

function isSameOrigin(value, baseUrl) {
  return new URL(value, baseUrl).origin === baseUrl.origin;
}

function readRequiredValue(args, index, optionName) {
  const value = args[index + 1];

  if (!value || value.startsWith('-')) {
    throw new Error(`${optionName} requires a value.`);
  }

  return value;
}

function readInlineValue(arg, optionName) {
  const value = arg.slice(optionName.length + 1);

  if (!value) {
    throw new Error(`${optionName} requires a value.`);
  }

  return value;
}

function readInteger(value, defaultValue, name) {
  if (!value) {
    return defaultValue;
  }

  if (!/^\d+$/.test(value)) {
    throw new Error(`${name} must be a positive integer.`);
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return parsed;
}

function readBoolean(value) {
  if (!value) {
    return false;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function firstDefinedEnv(names) {
  for (const name of names) {
    const value = process.env[name];

    if (value) {
      return value;
    }
  }

  return undefined;
}

function formatLocation(location) {
  if (!location.url) {
    return undefined;
  }

  const line = location.lineNumber ? `:${location.lineNumber}` : '';
  const column = location.columnNumber ? `:${location.columnNumber}` : '';
  return `${location.url}${line}${column}`;
}

function formatAxeViolation(violation) {
  const targets = violation.nodes
    .slice(0, 5)
    .map((node) => `    - ${node.target.join(' ')}: ${node.failureSummary ?? 'No failure summary provided'}`)
    .join('\n');
  const truncated = violation.nodes.length > 5
    ? `\n    - ... ${violation.nodes.length - 5} more node(s)`
    : '';

  return [
    violation.description,
    `Help: ${violation.helpUrl}`,
    `Affected node(s): ${violation.nodes.length}`,
    targets ? `Targets:\n${targets}${truncated}` : undefined,
  ].filter(Boolean).join('\n');
}

function printResult(result, options) {
  const axeStatus = options.skipAxe ? 'disabled' : 'enabled';

  if (result.findings.length === 0) {
    console.log(`Generated-site smoke/a11y passed: visited ${result.visited.length} page(s), axe ${axeStatus}.`);
    return;
  }

  console.error(`Generated-site smoke/a11y failed: ${result.findings.length} finding(s) across ${result.visited.length} page(s), axe ${axeStatus}.`);
  console.error(`Base URL: ${options.baseUrl.href}`);
  console.error('');

  for (const [index, finding] of result.findings.entries()) {
    console.error(`${index + 1}. [${finding.type}] ${finding.pageUrl}`);
    console.error(`   ${finding.message}`);

    if (finding.detail) {
      console.error(indentDetail(finding.detail));
    }
  }
}

function indentDetail(detail) {
  return detail
    .split('\n')
    .map((line) => `   ${line}`)
    .join('\n');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  runCli().then((exitCode) => {
    process.exitCode = exitCode;
  }, (error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
