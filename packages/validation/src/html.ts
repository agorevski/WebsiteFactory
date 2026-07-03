import type {
  FormControlNode,
  HeadingNode,
  ImageNode,
  InteractiveNode,
  LinkNode,
  PageValidationInput,
  SeoDocument
} from "./types.js";

export function enrichFromHtml(input: PageValidationInput): PageValidationInput {
  if (!input.html) {
    return input;
  }

  return {
    ...input,
    headings: input.headings ?? extractHeadings(input.html),
    images: input.images ?? extractImages(input.html),
    formControls: input.formControls ?? extractFormControls(input.html),
    links: input.links ?? extractLinks(input.html),
    interactive: input.interactive ?? extractInteractive(input.html),
    seo: {
      ...extractSeo(input.html),
      ...input.seo
    },
    responsive: {
      hasViewportMeta: hasViewportMeta(input.html),
      ...input.responsive
    },
    performance: {
      htmlBytes: new TextEncoder().encode(input.html).length,
      imageCount: countMatches(input.html, /<img\b/gi),
      scriptCount: countMatches(input.html, /<script\b/gi),
      stylesheetCount: countMatches(input.html, /<link\b[^>]*rel=["']?stylesheet/gi),
      hasLazyImages: /<img\b[^>]*\bloading=["']lazy["']/i.test(input.html),
      ...input.performance
    }
  };
}

export function extractHeadings(html: string): HeadingNode[] {
  return [...html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi)].map((match, index) => ({
    level: Number(match[1]) as HeadingNode["level"],
    text: stripTags(match[3] ?? ""),
    selector: `h${match[1]}:nth-of-type(${index + 1})`
  }));
}

export function extractImages(html: string): ImageNode[] {
  return [...html.matchAll(/<img\b([^>]*)>/gi)].map((match, index) => {
    const attrs = parseAttributes(match[1] ?? "");
    return {
      src: attrs.src ?? "",
      alt: attrs.alt,
      decorative: attrs.alt === "" || attrs.role === "presentation" || attrs["aria-hidden"] === "true",
      width: readNumber(attrs.width),
      height: readNumber(attrs.height),
      loading: attrs.loading,
      selector: `img:nth-of-type(${index + 1})`
    };
  });
}

export function extractFormControls(html: string): FormControlNode[] {
  const labelsByFor = new Map<string, string>();
  for (const match of html.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/gi)) {
    const attrs = parseAttributes(match[1] ?? "");
    if (attrs.for) {
      labelsByFor.set(attrs.for, stripTags(match[2] ?? ""));
    }
  }

  return [...html.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)]
    .map((match, index) => {
      const tag = (match[1] ?? "").toLowerCase();
      const attrs = parseAttributes(match[2] ?? "");
      const type = attrs.type ?? tag;
      return {
        id: attrs.id,
        name: attrs.name,
        type,
        label: attrs.id ? labelsByFor.get(attrs.id) : undefined,
        ariaLabel: attrs["aria-label"],
        ariaLabelledBy: attrs["aria-labelledby"],
        hidden: type === "hidden" || attrs.hidden !== undefined || attrs["aria-hidden"] === "true",
        selector: `${tag}:nth-of-type(${index + 1})`
      };
    });
}

export function extractLinks(html: string): LinkNode[] {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match, index) => {
    const attrs = parseAttributes(match[1] ?? "");
    return {
      href: attrs.href,
      text: stripTags(match[2] ?? ""),
      ariaLabel: attrs["aria-label"],
      target: attrs.target,
      rel: attrs.rel,
      selector: `a:nth-of-type(${index + 1})`
    };
  });
}

export function extractInteractive(html: string): InteractiveNode[] {
  return [...html.matchAll(/<(button|a|input|select|textarea|summary|[a-z0-9-]+)\b([^>]*)>([\s\S]*?)(?:<\/\1>|$)/gi)]
    .flatMap((match, index): InteractiveNode[] => {
      const tagName = (match[1] ?? "").toLowerCase();
      const attrs = parseAttributes(match[2] ?? "");
      const isNative = ["button", "a", "input", "select", "textarea", "summary"].includes(tagName);
      const role = attrs.role;
      const hasClick = attrs.onclick !== undefined || attrs["@click"] !== undefined;
      const isInteractive = isNative || hasClick || role === "button" || role === "link" || role === "menuitem";

      if (!isInteractive) {
        return [];
      }

      return [{
        role,
        tagName,
        tabIndex: readNumber(attrs.tabindex),
        ariaLabel: attrs["aria-label"],
        text: stripTags(match[3] ?? ""),
        hasKeyboardHandler: attrs.onkeydown !== undefined || attrs.onkeyup !== undefined || attrs.onkeypress !== undefined,
        selector: `${tagName}:nth-of-type(${index + 1})`
      }];
    });
}

export function extractSeo(html: string): SeoDocument {
  return {
    title: readTagText(html, "title"),
    description: readMetaContent(html, "name", "description"),
    canonicalUrl: readLinkHref(html, "canonical"),
    robots: readMetaContent(html, "name", "robots"),
    openGraph: {
      title: readMetaContent(html, "property", "og:title"),
      description: readMetaContent(html, "property", "og:description"),
      image: readMetaContent(html, "property", "og:image"),
      url: readMetaContent(html, "property", "og:url")
    },
    twitter: {
      card: readMetaContent(html, "name", "twitter:card"),
      title: readMetaContent(html, "name", "twitter:title"),
      description: readMetaContent(html, "name", "twitter:description"),
      image: readMetaContent(html, "name", "twitter:image")
    },
    structuredDataTypes: extractStructuredDataTypes(html)
  };
}

function readTagText(html: string, tagName: string): string | undefined {
  const match = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i").exec(html);
  const text = stripTags(match?.[1] ?? "");
  return text || undefined;
}

function readMetaContent(html: string, key: "name" | "property", value: string): string | undefined {
  const metas = html.matchAll(/<meta\b([^>]*)>/gi);
  for (const match of metas) {
    const attrs = parseAttributes(match[1] ?? "");
    if (attrs[key]?.toLowerCase() === value.toLowerCase()) {
      return attrs.content;
    }
  }

  return undefined;
}

function readLinkHref(html: string, rel: string): string | undefined {
  const links = html.matchAll(/<link\b([^>]*)>/gi);
  for (const match of links) {
    const attrs = parseAttributes(match[1] ?? "");
    if (attrs.rel?.toLowerCase() === rel.toLowerCase()) {
      return attrs.href;
    }
  }

  return undefined;
}

function extractStructuredDataTypes(html: string): string[] {
  const types = new Set<string>();
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const payload = safeJsonParse(match[1] ?? "");
    collectJsonLdTypes(payload, types);
  }

  return [...types].sort();
}

function collectJsonLdTypes(value: unknown, types: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectJsonLdTypes(item, types);
    }
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;
  const type = record["@type"];
  if (typeof type === "string") {
    types.add(type);
  } else if (Array.isArray(type)) {
    for (const item of type) {
      if (typeof item === "string") {
        types.add(item);
      }
    }
  }

  collectJsonLdTypes(record["@graph"], types);
  collectJsonLdTypes(record.mainEntity, types);
}

function hasViewportMeta(html: string): boolean {
  return /<meta\b[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html);
}

function parseAttributes(source: string): Record<string, string | undefined> {
  const attrs: Record<string, string | undefined> = {};
  for (const match of source.matchAll(/([:@a-zA-Z0-9_-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    const name = match[1]?.toLowerCase();
    if (name) {
      attrs[name] = match[2] ?? match[3] ?? match[4] ?? "";
    }
  }

  return attrs;
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function readNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function countMatches(value: string, pattern: RegExp): number {
  return [...value.matchAll(pattern)].length;
}
