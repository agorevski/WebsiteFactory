import type {
  AriaNode,
  CssOptimizationSignals,
  FormControlNode,
  HeadingNode,
  ImageNode,
  ImageOptimizationSignals,
  InteractiveNode,
  JavaScriptOptimizationSignals,
  LandmarkNode,
  LinkNode,
  MotionSignals,
  PageValidationInput,
  ScreenReaderSignals,
  SeoDocument
} from "./types.js";

const landmarkRoles = new Set(["banner", "navigation", "main", "complementary", "contentinfo", "search", "form"]);
const interactiveRoles = new Set(["button", "link", "menuitem", "tab", "checkbox", "radio", "switch", "textbox", "combobox"]);
const voidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const validAriaAttributes = new Set([
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-description",
  "aria-details",
  "aria-disabled",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext"
]);

export function enrichFromHtml(input: PageValidationInput): PageValidationInput {
  if (!input.html) {
    return input;
  }

  const html = input.html;
  const extractedImages = input.images ?? extractImages(html);
  const cssOptimization = {
    ...extractCssOptimization(html),
    ...input.cssOptimization
  };
  const javascript = {
    ...extractJavaScriptOptimization(html),
    ...input.javascript
  };

  return {
    ...input,
    headings: input.headings ?? extractHeadings(html),
    images: extractedImages,
    formControls: input.formControls ?? extractFormControls(html),
    links: input.links ?? extractLinks(html),
    interactive: input.interactive ?? extractInteractive(html),
    landmarks: input.landmarks ?? extractLandmarks(html),
    aria: input.aria ?? extractAriaNodes(html),
    screenReader: {
      ...extractScreenReaderSignals(html),
      ...input.screenReader
    },
    motion: {
      ...extractMotionSignals(html),
      ...input.motion
    },
    imageOptimization: {
      ...extractImageOptimizationSignals(html, extractedImages),
      ...input.imageOptimization
    },
    cssOptimization,
    javascript,
    seo: {
      ...extractSeo(html),
      ...input.seo
    },
    responsive: {
      hasViewportMeta: hasViewportMeta(html),
      usesResponsiveImages: extractedImages.some((image) => Boolean(image.srcset || image.sizes)),
      ...input.responsive
    },
    performance: {
      htmlBytes: byteLength(html),
      imageCount: extractedImages.length,
      scriptCount: countMatches(html, /<script\b/gi),
      stylesheetCount: countMatches(html, /<link\b[^>]*rel=["']?stylesheet/gi),
      scriptBytes: javascript.totalScriptBytes,
      styleBytes: cssOptimization.criticalCssBytes,
      hasLazyImages: extractedImages.some((image) => image.loading === "lazy"),
      usesStaticRendering: javascript.usesStaticRendering,
      minimalJavaScript: javascript.minimalJavaScript,
      hasCriticalCss: cssOptimization.hasCriticalCss,
      criticalCssBytes: cssOptimization.criticalCssBytes,
      blockingStylesheetCount: cssOptimization.blockingStylesheetCount,
      fontDisplay: cssOptimization.fontDisplay,
      preloadedFontCount: cssOptimization.preloadedFontCount,
      codeSplitChunkCount: javascript.codeSplitChunkCount,
      lazyLoadedComponentCount: javascript.lazyLoadedComponentCount,
      thirdPartyScriptCount: javascript.thirdPartyScriptCount,
      deferredScriptCount: javascript.deferredScriptCount,
      asyncScriptCount: javascript.asyncScriptCount,
      moduleScriptCount: javascript.moduleScriptCount,
      ...input.performance
    }
  };
}

export function extractHeadings(html: string): HeadingNode[] {
  return [...html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi)].map((match, index) => ({
    level: Number(match[1]) as HeadingNode["level"],
    text: extractVisibleText(match[3] ?? ""),
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
      srcset: attrs.srcset,
      sizes: attrs.sizes,
      decoding: attrs.decoding,
      fetchPriority: attrs.fetchpriority,
      selector: `img:nth-of-type(${index + 1})`
    };
  });
}

export function extractFormControls(html: string): FormControlNode[] {
  const labelsByFor = new Map<string, string>();
  for (const match of html.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/gi)) {
    const attrs = parseAttributes(match[1] ?? "");
    if (attrs.for) {
      labelsByFor.set(attrs.for, extractVisibleText(match[2] ?? ""));
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
      text: extractVisibleText(match[2] ?? ""),
      ariaLabel: attrs["aria-label"],
      target: attrs.target,
      rel: attrs.rel,
      selector: `a:nth-of-type(${index + 1})`
    };
  });
}

export function extractInteractive(html: string): InteractiveNode[] {
  return [...html.matchAll(/<([a-z0-9-]+)\b([^>]*)>/gi)]
    .flatMap((match, index): InteractiveNode[] => {
      const tagName = (match[1] ?? "").toLowerCase();
      const attrs = parseAttributes(match[2] ?? "");
      const isNative = isNativeInteractive(tagName, attrs);
      const role = attrs.role;
      const hasClick = attrs.onclick !== undefined || attrs["@click"] !== undefined;
      const isInteractive = isNative || hasClick || interactiveRoles.has(role ?? "");

      if (!isInteractive) {
        return [];
      }

      return [{
        role,
        tagName,
        tabIndex: readNumber(attrs.tabindex),
        ariaLabel: attrs["aria-label"],
        ariaLabelledBy: attrs["aria-labelledby"],
        text: isVoidElement(tagName)
          ? undefined
          : readElementText(html, tagName, match.index, match[0]?.length ?? 0),
        disabled: attrs.disabled !== undefined || attrs["aria-disabled"] === "true",
        hasKeyboardHandler: attrs.onkeydown !== undefined || attrs.onkeyup !== undefined || attrs.onkeypress !== undefined,
        selector: `${tagName}:nth-of-type(${index + 1})`
      }];
    });
}

export function extractLandmarks(html: string): LandmarkNode[] {
  return [...html.matchAll(/<(header|nav|main|aside|footer|form|section|div)\b([^>]*)>/gi)].flatMap((match, index) => {
    const tagName = (match[1] ?? "").toLowerCase();
    const attrs = parseAttributes(match[2] ?? "");
    const role = attrs.role ?? nativeLandmarkRole(tagName, attrs);
    if (!role || !landmarkRoles.has(role)) {
      return [];
    }

    return [{
      role,
      tagName,
      label: attrs["aria-label"] ?? attrs["aria-labelledby"],
      selector: `${tagName}:nth-of-type(${index + 1})`
    }];
  });
}

export function extractAriaNodes(html: string): AriaNode[] {
  const ids = collectIds(html);
  return [...html.matchAll(/<([a-z0-9-]+)\b([^>]*)>/gi)].flatMap((match, index): AriaNode[] => {
    const tagName = (match[1] ?? "").toLowerCase();
    const attrs = parseAttributes(match[2] ?? "");
    const role = attrs.role;
    const ariaAttributes = Object.keys(attrs).filter((name) => name.startsWith("aria-"));
    const focusable = isFocusable(tagName, attrs);
    const interactive = isNativeInteractive(tagName, attrs) || interactiveRoles.has(role ?? "") || attrs.onclick !== undefined;
    if (!role && ariaAttributes.length === 0 && !focusable && !interactive) {
      return [];
    }

    const invalidAttributes = ariaAttributes.filter((name) => !validAriaAttributes.has(name));
    const missingReferences = [
      ...missingIdRefs(attrs["aria-labelledby"], ids),
      ...missingIdRefs(attrs["aria-describedby"], ids),
      ...missingIdRefs(attrs["aria-controls"], ids)
    ];

    return [{
      selector: `${tagName}:nth-of-type(${index + 1})`,
      tagName,
      role,
      text: readElementText(html, tagName, match.index, match[0]?.length ?? 0),
      ariaHidden: attrs["aria-hidden"] === "true",
      ariaLabel: attrs["aria-label"],
      ariaLabelledBy: attrs["aria-labelledby"],
      ariaDescribedBy: attrs["aria-describedby"],
      ariaControls: attrs["aria-controls"],
      invalidAttributes,
      missingReferences,
      focusable,
      interactive
    }];
  });
}

function readElementText(html: string, tagName: string, startIndex: number | undefined, openingTagLength: number): string | undefined {
  if (startIndex === undefined || isVoidElement(tagName)) {
    return undefined;
  }

  const contentStart = startIndex + openingTagLength;
  const closingTagStart = findClosingTagStart(html, tagName, contentStart);
  if (closingTagStart === -1) {
    return undefined;
  }

  return extractVisibleText(html.slice(contentStart, closingTagStart));
}

function findClosingTagStart(html: string, tagName: string, contentStart: number): number {
  const tagPattern = new RegExp(`<\\/?${escapeRegExp(tagName)}\\b[^>]*>`, "gi");
  tagPattern.lastIndex = contentStart;
  let depth = 1;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(html)) !== null) {
    const tag = match[0] ?? "";
    if (tag.startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        return match.index;
      }
    } else if (!tag.endsWith("/>") && !isVoidElement(tagName)) {
      depth += 1;
    }
  }

  return -1;
}

function isVoidElement(tagName: string): boolean {
  return voidElements.has(tagName);
}

export function extractScreenReaderSignals(html: string): ScreenReaderSignals {
  const htmlAttrs = parseAttributes(/<html\b([^>]*)>/i.exec(html)?.[1] ?? "");
  const hiddenFocusableSelectors = extractAriaNodes(html)
    .filter((node) => node.ariaHidden && node.focusable)
    .flatMap((node) => node.selector ? [node.selector] : []);

  return {
    hasLangAttribute: Boolean(htmlAttrs.lang?.trim()),
    lang: htmlAttrs.lang,
    hasDocumentTitle: Boolean(readTagText(html, "title")),
    hasSkipLink: hasSkipLink(html),
    ariaLiveRegionCount: countMatches(html, /\baria-live=|\brole=["']?(alert|status|log)\b/gi),
    hiddenFocusableSelectors
  };
}

export function extractMotionSignals(html: string): MotionSignals {
  const animatedSelectors = findAnimatedSelectors(html);
  const autoplayMediaSelectors = [...html.matchAll(/<(video|audio)\b([^>]*)>/gi)].flatMap((match, index) => {
    const attrs = parseAttributes(match[2] ?? "");
    if (attrs.autoplay === undefined) {
      return [];
    }

    const tagName = match[1] ?? "media";
    return [`${tagName}:nth-of-type(${index + 1})`];
  });

  return {
    honorsReducedMotion: /prefers-reduced-motion/i.test(html),
    animatedSelectors,
    autoplayMediaSelectors
  };
}

export function extractImageOptimizationSignals(html: string, images: ImageNode[] = extractImages(html)): ImageOptimizationSignals {
  const missingDimensionSelectors = images
    .filter((image) => image.width === undefined || image.height === undefined)
    .flatMap((image) => image.selector ? [image.selector] : []);
  const unoptimizedImages = images.flatMap((image) => {
    const reasons = imageOptimizationReasons(image);
    return reasons.map((reason) => ({
      src: image.src,
      selector: image.selector,
      reason
    }));
  });

  return {
    responsiveImageCount: images.filter((image) => Boolean(image.srcset || image.sizes)).length,
    missingDimensionSelectors,
    unoptimizedImages,
    modernFormats: images.length > 0 ? images.every((image) => isModernImageFormat(image.src)) : undefined,
    preloadedHeroImage: /<link\b[^>]*rel=["']?preload[^>]*as=["']?image/i.test(html)
  };
}

export function extractCssOptimization(html: string): CssOptimizationSignals {
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1] ?? "");
  const styleText = styles.join("\n");
  const fontDisplay = /font-display\s*:\s*([a-z-]+)/i.exec(styleText)?.[1];

  return {
    hasCriticalCss: styles.length > 0,
    criticalCssBytes: byteLength(styleText),
    blockingStylesheetCount: countBlockingStylesheets(html),
    fontDisplay,
    preloadedFontCount: countMatches(html, /<link\b[^>]*rel=["']?preload[^>]*as=["']?font/gi),
    fontFileCount: countMatches(html, /\.(?:woff2?|ttf|otf)(?:[?#][^"')\s]+)?/gi),
    usesVariableFonts: /font-variation-settings|\.woff2[^"']*variable|var\(/i.test(styleText)
  };
}

export function extractJavaScriptOptimization(html: string): JavaScriptOptimizationSignals {
  const scripts = extractScripts(html).filter(isExecutableScript);
  const inlineScriptBytes = scripts.reduce((total, script) => total + byteLength(script.content), 0);
  const totalScriptBytes = inlineScriptBytes;
  const deferredScriptCount = scripts.filter((script) => script.attrs.defer !== undefined).length;
  const asyncScriptCount = scripts.filter((script) => script.attrs.async !== undefined).length;
  const moduleScriptCount = scripts.filter((script) => script.attrs.type?.toLowerCase() === "module").length;
  const thirdPartyScriptCount = scripts.filter((script) => isThirdPartyUrl(script.attrs.src)).length;

  return {
    usesStaticRendering: scripts.length === 0 || scripts.every((script) => script.attrs["data-static"] === "true"),
    minimalJavaScript: scripts.length <= 3 && inlineScriptBytes <= 20_000 && thirdPartyScriptCount === 0,
    totalScriptBytes,
    routeScriptBytes: totalScriptBytes,
    inlineScriptBytes,
    moduleScriptCount,
    deferredScriptCount,
    asyncScriptCount,
    thirdPartyScriptCount,
    codeSplitChunkCount: countMatches(html, /<link\b[^>]*rel=["']?modulepreload|<script\b[^>]*type=["']module/gi),
    lazyLoadedComponentCount: countMatches(html, /\bloading=["']lazy|\bdata-lazy\b|\bclient:visible\b|\bclient:idle\b/gi),
    hydrationStrategy: scripts.length === 0 ? "static" : thirdPartyScriptCount > 0 ? "spa" : "islands"
  };
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
  const text = extractVisibleText(match?.[1] ?? "");
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
  collectJsonLdTypes(record.itemListElement, types);
  collectJsonLdTypes(record.itemReviewed, types);
  collectJsonLdTypes(record.review, types);
  collectJsonLdTypes(record.offers, types);
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

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

function nativeLandmarkRole(tagName: string, attrs: Record<string, string | undefined>): string | undefined {
  switch (tagName) {
    case "header":
      return "banner";
    case "nav":
      return "navigation";
    case "main":
      return "main";
    case "aside":
      return "complementary";
    case "footer":
      return "contentinfo";
    case "form":
      return attrs["aria-label"] || attrs["aria-labelledby"] ? "form" : undefined;
    default:
      return undefined;
  }
}

function collectIds(html: string): Set<string> {
  const ids = new Set<string>();
  for (const match of html.matchAll(/<[^>]+\bid\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'>]+))/gi)) {
    const id = match[1] ?? match[2] ?? match[3];
    if (id) {
      ids.add(id);
    }
  }

  return ids;
}

function missingIdRefs(value: string | undefined, ids: Set<string>): string[] {
  return (value ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .filter((id) => !ids.has(id));
}

function isNativeInteractive(tagName: string, attrs: Record<string, string | undefined>): boolean {
  if (["button", "input", "select", "textarea", "summary"].includes(tagName)) {
    return true;
  }

  return tagName === "a" && Boolean(attrs.href);
}

function isFocusable(tagName: string, attrs: Record<string, string | undefined>): boolean {
  const tabIndex = readNumber(attrs.tabindex);
  if (tabIndex !== undefined && tabIndex >= 0) {
    return true;
  }

  return isNativeInteractive(tagName, attrs) && attrs.disabled === undefined;
}

function hasSkipLink(html: string): boolean {
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = parseAttributes(match[1] ?? "");
    const text = stripTags(match[2] ?? "").toLowerCase();
    if (attrs.href?.startsWith("#") && (text.includes("skip") || attrs.class?.toLowerCase().includes("skip"))) {
      return true;
    }
  }

  return false;
}

function findAnimatedSelectors(html: string): string[] {
  const selectors = new Set<string>();
  const styleText = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1] ?? "").join("\n");
  if (hasMotionDeclaration(styleText)) {
    selectors.add("style");
  }

  for (const match of html.matchAll(/<([a-z0-9-]+)\b([^>]*)>/gi)) {
    const tagName = match[1] ?? "element";
    const attrs = parseAttributes(match[2] ?? "");
    if (hasMotionDeclaration(attrs.style ?? "")) {
      selectors.add(`${tagName}[style]`);
    }
  }

  return [...selectors];
}

function hasMotionDeclaration(value: string): boolean {
  return /(?:^|[;{])\s*(?:animation(?:-[a-z-]+)?|transition(?:-[a-z-]+)?)\s*:/i.test(value);
}

function extractVisibleText(value: string): string {
  return stripTags(removeHiddenElementText(value));
}

function removeHiddenElementText(value: string): string {
  let output = "";
  let cursor = 0;

  for (const match of value.matchAll(/<([a-z0-9-]+)\b([^>]*)>/gi)) {
    const tagName = (match[1] ?? "").toLowerCase();
    const attrs = parseAttributes(match[2] ?? "");
    const tagStart = match.index ?? 0;

    if (tagStart < cursor) {
      continue;
    }

    if (!isHiddenFromAccessibleName(attrs)) {
      continue;
    }

    output += value.slice(cursor, tagStart);
    const openingTag = match[0] ?? "";
    const tagEnd = tagStart + openingTag.length;

    if (openingTag.endsWith("/>") || isVoidElement(tagName)) {
      cursor = tagEnd;
      continue;
    }

    const closingStart = findClosingTagStart(value, tagName, tagEnd);
    cursor = closingStart === -1 ? tagEnd : findTagEnd(value, closingStart);
  }

  return output + value.slice(cursor);
}

function isHiddenFromAccessibleName(attrs: Record<string, string | undefined>): boolean {
  const style = attrs.style?.toLowerCase() ?? "";
  return attrs["aria-hidden"] === "true"
    || attrs.hidden !== undefined
    || /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden)\b/.test(style);
}

function findTagEnd(html: string, tagStart: number): number {
  const tagEnd = html.indexOf(">", tagStart);
  return tagEnd === -1 ? tagStart : tagEnd + 1;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function imageOptimizationReasons(image: ImageNode): string[] {
  const reasons: string[] = [];
  if (!image.srcset && !image.sizes && !isVectorImage(image.src)) {
    reasons.push("missing responsive srcset/sizes metadata");
  }
  if (!isModernImageFormat(image.src) && !isVectorImage(image.src)) {
    reasons.push("image is not a modern web format");
  }
  if (image.decoding !== "async" && !isVectorImage(image.src)) {
    reasons.push("missing async decoding hint");
  }

  return reasons;
}

function isModernImageFormat(src: string): boolean {
  return /\.(?:avif|webp)(?:[?#].*)?$/i.test(src);
}

function isVectorImage(src: string): boolean {
  return /\.svg(?:[?#].*)?$/i.test(src) || src.startsWith("data:image/svg");
}

function countBlockingStylesheets(html: string): number {
  return [...html.matchAll(/<link\b([^>]*)>/gi)].filter((match) => {
    const attrs = parseAttributes(match[1] ?? "");
    if (attrs.rel?.toLowerCase() !== "stylesheet") {
      return false;
    }

    const media = attrs.media?.toLowerCase();
    return !media || media === "all" || media === "screen";
  }).length;
}

interface ScriptTag {
  attrs: Record<string, string | undefined>;
  content: string;
}

function extractScripts(html: string): ScriptTag[] {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map((match) => ({
    attrs: parseAttributes(match[1] ?? ""),
    content: match[2] ?? ""
  }));
}

function isExecutableScript(script: ScriptTag): boolean {
  const type = script.attrs.type?.split(";")[0]?.trim().toLowerCase();
  return !type || ["module", "text/javascript", "application/javascript", "text/ecmascript", "application/ecmascript"].includes(type);
}

function isThirdPartyUrl(src: string | undefined): boolean {
  return Boolean(src && /^https?:\/\//i.test(src) && !src.includes("localhost"));
}
