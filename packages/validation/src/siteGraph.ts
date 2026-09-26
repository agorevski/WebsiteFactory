import { extractLinks } from "./html.js";
import type { PageValidationInput, StaticRouteInventory, ValidationIssue } from "./types.js";

interface RouteDocument {
  page: PageValidationInput;
  url: URL;
  baseUrl: URL;
  fragments: Set<string> | undefined;
  links: ReturnType<typeof extractLinks>;
}

export function validateSiteLinks(
  pages: readonly PageValidationInput[],
  inventory: StaticRouteInventory
): ValidationIssue[] {
  const origin = new URL(inventory.baseUrl);
  if (!isHttp(origin)) {
    throw new Error("Static route inventory baseUrl must be an absolute HTTP(S) URL.");
  }

  const issues: ValidationIssue[] = [];
  const documents = pages.map((page): RouteDocument => {
    if (!page.url) {
      throw new Error(`Static route inventory page ${page.path ?? "(unknown)"} must define a URL.`);
    }
    const url = new URL(page.url, origin);
    if (url.origin !== origin.origin) {
      throw new Error(`Static route inventory page ${page.url} must share the baseUrl origin.`);
    }
    const html = page.html === undefined ? undefined : stripNonMarkup(page.html);
    const fragmentIds = page.fragmentIds ?? (html === undefined ? undefined : extractFragments(html));
    const baseHref = page.baseHref ?? (html === undefined ? undefined : extractBaseHref(html));
    return {
      page,
      url,
      baseUrl: baseHref === undefined ? url : new URL(baseHref, url),
      fragments: fragmentIds === undefined ? undefined : new Set(fragmentIds),
      links: page.links ?? (html === undefined ? [] : extractLinks(html).map((link) => ({
        ...link,
        href: link.href === undefined ? undefined : decodeAttribute(link.href)
      })))
    };
  });
  const routes = new Map<string, RouteDocument>();
  for (const document of documents) {
    const key = routeKey(document.url);
    if (routes.has(key)) {
      issues.push({
        ruleId: "site-route-duplicate",
        category: "content",
        severity: "error",
        path: document.page.path ?? document.url.pathname,
        message: `Multiple pages resolve to static route ${key}.`,
        help: "Give every generated page a unique output route."
      });
    } else {
      routes.set(key, document);
    }
  }
  const assets = new Set((inventory.assetPaths ?? []).map((path) => {
    const url = new URL(path, origin);
    if (url.origin !== origin.origin) {
      throw new Error(`Static route inventory asset ${path} must share the baseUrl origin.`);
    }
    return url.pathname;
  }));

  for (const document of documents) {
    for (const link of document.links) {
      if (link.href === undefined) {
        continue;
      }
      const target = URL.parse(link.href, document.baseUrl);
      if (!target) {
        issues.push({
          ruleId: "site-link-url",
          category: "content",
          severity: "error",
          path: document.page.path ?? document.url.pathname,
          selector: link.selector,
          message: `Link URL ${link.href} cannot be resolved.`,
          context: { href: link.href }
        });
        continue;
      }
      if (!isHttp(target) || target.origin !== origin.origin) {
        continue;
      }
      const destination = routes.get(routeKey(target));
      if (!destination && assets.has(target.pathname)) {
        continue;
      }
      if (!destination) {
        issues.push(linkIssue("site-link-target", document, link, target, `Internal link target ${target.pathname} is absent from the static inventory.`));
        continue;
      }
      const fragment = decodeFragment(target.hash.slice(1).split(":~:text=")[0] ?? "");
      if (fragment && destination.fragments !== undefined && !destination.fragments.has(fragment)) {
        // Browsers treat #top as the document top when there is no matching ID.
        if (fragment.toLowerCase() === "top") {
          continue;
        }
        issues.push(linkIssue("site-link-fragment", document, link, target, `Internal link fragment #${fragment} is absent from ${target.pathname}.`));
      }
    }
  }
  return issues;
}

function linkIssue(
  ruleId: string,
  document: RouteDocument,
  link: RouteDocument["links"][number],
  target: URL,
  message: string
): ValidationIssue {
  return {
    ruleId,
    category: "content",
    severity: "error",
    path: document.page.path ?? document.url.pathname,
    selector: link.selector,
    message,
    help: "Update the link or include its target page, asset, or fragment in the generated output.",
    context: { href: link.href, target: `${target.pathname}${target.search}${target.hash}` }
  };
}

function isHttp(url: URL): boolean {
  return url.protocol === "http:" || url.protocol === "https:";
}

function routeKey(url: URL): string {
  const path = url.pathname.replace(/\/index\.html$/, "/");
  return path.endsWith("/") ? path : `${path}/`;
}

function decodeFragment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function stripNonMarkup(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(<(script|style|textarea|title)\b[^>]*>)[\s\S]*?(<\/\2\s*>)/gi, "$1$3");
}

function tags(html: string): RegExpStringIterator<RegExpExecArray> {
  return html.matchAll(/<([a-z][a-z0-9:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi);
}

function attribute(source: string, name: string): string | undefined {
  for (const match of source.matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    if (match[1]?.toLowerCase() === name) {
      return decodeAttribute(match[2] ?? match[3] ?? match[4] ?? "");
    }
  }
  return undefined;
}

function extractFragments(html: string): string[] {
  return [...tags(html)].flatMap((match) => {
    const attributes = match[2] ?? "";
    const id = attribute(attributes, "id");
    const name = match[1]?.toLowerCase() === "a" ? attribute(attributes, "name") : undefined;
    return [id, name].filter((value): value is string => value !== undefined && value !== "");
  });
}

function extractBaseHref(html: string): string | undefined {
  for (const match of tags(html)) {
    if (match[1]?.toLowerCase() === "base") {
      const href = attribute(match[2] ?? "", "href");
      if (href !== undefined) {
        return href;
      }
    }
  }
  return undefined;
}

function decodeAttribute(value: string): string {
  const named: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: "\u00a0" };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity: string, code: string) => {
    if (!code.startsWith("#")) {
      return named[code.toLowerCase()] ?? entity;
    }
    const point = code[1]?.toLowerCase() === "x" ? Number.parseInt(code.slice(2), 16) : Number.parseInt(code.slice(1), 10);
    return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
      ? String.fromCodePoint(point)
      : "\ufffd";
  });
}
