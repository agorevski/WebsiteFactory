import type { PageValidationInput, ValidationIssue, ValidationRule } from "./types.js";
import { validateContrastTokens } from "./contrast.js";

export const headingHierarchyRule: ValidationRule = {
  id: "heading-hierarchy",
  category: "a11y",
  severity: "error",
  validate(input, context) {
    const headings = input.headings ?? [];
    const issues: ValidationIssue[] = [];

    if (headings.length === 0) {
      return [{
        ruleId: this.id,
        category: this.category,
        severity: "warning",
        message: "Page has no headings.",
        path: context.path
      }];
    }

    const h1Count = headings.filter((heading) => heading.level === 1).length;
    if (h1Count !== 1) {
      issues.push({
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        message: `Page should have exactly one h1; found ${h1Count}.`,
        path: context.path
      });
    }

    let previousLevel = headings[0]?.level ?? 1;
    for (const heading of headings.slice(1)) {
      if (heading.level > previousLevel + 1) {
        issues.push({
          ruleId: this.id,
          category: this.category,
          severity: this.severity,
          message: `Heading "${heading.text}" jumps from h${previousLevel} to h${heading.level}.`,
          path: context.path,
          selector: heading.selector,
          help: "Do not skip heading levels; use headings to describe document hierarchy."
        });
      }
      previousLevel = heading.level;
    }

    return issues;
  }
};

export const imageAltTextRule: ValidationRule = {
  id: "image-alt-text",
  category: "a11y",
  severity: "error",
  validate(input, context) {
    return (input.images ?? [])
      .filter((image) => !image.decorative && (!image.alt || image.alt.trim().length === 0))
      .map((image) => ({
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        message: `Image "${image.src}" is missing descriptive alt text.`,
        path: context.path,
        selector: image.selector,
        help: "Add alt text for informative images, or mark decorative images with empty alt text."
      }));
  }
};

export const formLabelsRule: ValidationRule = {
  id: "form-labels",
  category: "a11y",
  severity: "error",
  validate(input, context) {
    return (input.formControls ?? [])
      .filter((control) => !control.hidden)
      .filter((control) => {
        const type = control.type?.toLowerCase();
        return type !== "submit" && type !== "button" && type !== "reset";
      })
      .filter((control) => !hasAccessibleName(control.label, control.ariaLabel, control.ariaLabelledBy))
      .map((control) => ({
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        message: `Form control "${control.name ?? control.id ?? control.type ?? "unknown"}" has no accessible label.`,
        path: context.path,
        selector: control.selector,
        help: "Associate inputs with labels or aria-label/aria-labelledby."
      }));
  }
};

export const keyboardNavigationRule: ValidationRule = {
  id: "keyboard-navigation",
  category: "a11y",
  severity: "warning",
  validate(input, context) {
    const issues: ValidationIssue[] = [];

    for (const node of input.interactive ?? []) {
      const tagName = node.tagName?.toLowerCase();
      const role = node.role?.toLowerCase();
      const isNative = tagName ? ["button", "a", "input", "select", "textarea", "summary"].includes(tagName) : false;

      if (!isNative && node.tabIndex === undefined) {
        issues.push({
          ruleId: this.id,
          category: this.category,
          severity: this.severity,
          message: "Custom interactive element is not keyboard focusable.",
          path: context.path,
          selector: node.selector,
          help: "Prefer native interactive elements, or add tabindex and keyboard handlers."
        });
      }

      if (!isNative && (role === "button" || role === "link") && !node.hasKeyboardHandler) {
        issues.push({
          ruleId: this.id,
          category: this.category,
          severity: this.severity,
          message: `Custom ${role} does not expose an obvious keyboard handler.`,
          path: context.path,
          selector: node.selector
        });
      }

      if (!hasAccessibleName(node.text, node.ariaLabel, node.ariaLabelledBy)) {
        issues.push({
          ruleId: "interactive-accessible-name",
          category: this.category,
          severity: "warning",
          message: "Interactive element has no accessible name.",
          path: context.path,
          selector: node.selector
        });
      }
    }

    for (const link of input.links ?? []) {
      if (link.target === "_blank" && !link.rel?.split(/\s+/).includes("noopener")) {
        issues.push({
          ruleId: "external-link-noopener",
          category: "a11y",
          severity: "warning",
          message: "Link opening in a new tab should include rel=\"noopener\".",
          path: context.path,
          selector: link.selector
        });
      }

      if (!hasAccessibleName(link.text, link.ariaLabel)) {
        issues.push({
          ruleId: "link-accessible-name",
          category: "a11y",
          severity: "error",
          message: "Link has no accessible name.",
          path: context.path,
          selector: link.selector
        });
      }
    }

    return issues;
  }
};

export const contrastTokenRule: ValidationRule = {
  id: "contrast-tokens",
  category: "a11y",
  severity: "error",
  validate(input, context) {
    return validateContrastTokens(input.contrastTokens, context.path);
  }
};

export const landmarkSemanticsRule: ValidationRule = {
  id: "landmark-semantics",
  category: "a11y",
  severity: "warning",
  validate(input, context) {
    const landmarks = input.landmarks ?? [];
    const issues: ValidationIssue[] = [];

    if (landmarks.length === 0) {
      return [{
        ruleId: this.id,
        category: this.category,
        severity: "info",
        message: "No semantic landmark signals were provided.",
        path: context.path
      }];
    }

    const mainCount = landmarks.filter((landmark) => landmark.role === "main").length;
    if (mainCount !== 1) {
      issues.push({
        ruleId: "main-landmark",
        category: this.category,
        severity: this.severity,
        message: `Page should expose exactly one main landmark; found ${mainCount}.`,
        path: context.path,
        help: "Use one <main> element or role=\"main\" for the primary content."
      });
    }

    for (const role of ["banner", "contentinfo"] as const) {
      const count = landmarks.filter((landmark) => landmark.role === role).length;
      if (count > 1) {
        issues.push({
          ruleId: `${role}-landmark-unique`,
          category: this.category,
          severity: this.severity,
          message: `Page exposes ${count} ${role} landmarks; these should be unique in most static pages.`,
          path: context.path
        });
      }
    }

    const navigationLandmarks = landmarks.filter((landmark) => landmark.role === "navigation");
    if (navigationLandmarks.length > 1) {
      for (const landmark of navigationLandmarks.filter((item) => !hasAccessibleName(item.label))) {
        issues.push({
          ruleId: "navigation-landmark-name",
          category: this.category,
          severity: this.severity,
          message: "Multiple navigation landmarks should have accessible labels.",
          path: context.path,
          selector: landmark.selector
        });
      }
    }

    return issues;
  }
};

export const ariaIntegrityRule: ValidationRule = {
  id: "aria-integrity",
  category: "a11y",
  severity: "error",
  validate(input, context) {
    const issues: ValidationIssue[] = [];

    for (const node of input.aria ?? []) {
      for (const attribute of node.invalidAttributes ?? []) {
        issues.push({
          ruleId: "aria-valid-attribute",
          category: this.category,
          severity: this.severity,
          message: `Unsupported ARIA attribute "${attribute}" was detected.`,
          path: context.path,
          selector: node.selector,
          help: "Use valid WAI-ARIA attributes and prefer native HTML semantics where possible."
        });
      }

      const missingReferences = node.missingReferences ?? [];
      if (missingReferences.length > 0) {
        issues.push({
          ruleId: "aria-reference-exists",
          category: this.category,
          severity: this.severity,
          message: "ARIA reference attributes point to missing element IDs.",
          path: context.path,
          selector: node.selector,
          context: { missingReferences: missingReferences.join(" ") }
        });
      }

      if (node.ariaHidden && node.focusable) {
        issues.push({
          ruleId: "aria-hidden-focusable",
          category: this.category,
          severity: this.severity,
          message: "Focusable elements must not be hidden from assistive technology.",
          path: context.path,
          selector: node.selector
        });
      }

      if (node.interactive && !hasAccessibleName(node.text, node.ariaLabel, node.ariaLabelledBy)) {
        issues.push({
          ruleId: "aria-interactive-name",
          category: this.category,
          severity: "warning",
          message: "Interactive ARIA node has no accessible name signal.",
          path: context.path,
          selector: node.selector
        });
      }
    }

    return issues;
  }
};

export const screenReaderRule: ValidationRule = {
  id: "screen-reader-signals",
  category: "a11y",
  severity: "warning",
  validate(input, context) {
    const signals = input.screenReader;
    if (!signals) {
      return [{
        ruleId: this.id,
        category: this.category,
        severity: "info",
        message: "No screen reader signals were provided.",
        path: context.path
      }];
    }

    const issues: ValidationIssue[] = [];
    if (signals.hasLangAttribute === false) {
      issues.push({
        ruleId: "document-lang",
        category: this.category,
        severity: this.severity,
        message: "Document should declare a language on the html element.",
        path: context.path
      });
    }

    if (signals.hasDocumentTitle === false) {
      issues.push({
        ruleId: "document-title",
        category: this.category,
        severity: "error",
        message: "Document should expose a non-empty title for screen reader users.",
        path: context.path
      });
    }

    if (signals.hasSkipLink === false && (input.landmarks ?? []).some((landmark) => landmark.role === "navigation")) {
      issues.push({
        ruleId: "skip-link",
        category: this.category,
        severity: "info",
        message: "Pages with navigation should include a skip link to main content.",
        path: context.path
      });
    }

    for (const selector of signals.hiddenFocusableSelectors ?? []) {
      issues.push({
        ruleId: "hidden-focusable-screen-reader",
        category: this.category,
        severity: "error",
        message: "A focusable element is hidden from assistive technology.",
        path: context.path,
        selector
      });
    }

    return issues;
  }
};

export const reducedMotionRule: ValidationRule = {
  id: "reduced-motion",
  category: "a11y",
  severity: "warning",
  validate(input, context) {
    const motion = input.motion;
    if (!motion) {
      return [];
    }

    const animatedCount = (motion.animatedSelectors ?? []).length;
    const autoplayCount = (motion.autoplayMediaSelectors ?? []).length;
    if (motion.honorsReducedMotion !== false && (animatedCount === 0 || motion.honorsReducedMotion === true) && autoplayCount === 0) {
      return [];
    }

    const issues: ValidationIssue[] = [];
    if (animatedCount > 0 && motion.honorsReducedMotion !== true) {
      issues.push({
        ruleId: "prefers-reduced-motion",
        category: this.category,
        severity: this.severity,
        message: "Animation signals were found without a prefers-reduced-motion override.",
        path: context.path,
        context: { animatedCount }
      });
    }

    for (const selector of motion.autoplayMediaSelectors ?? []) {
      issues.push({
        ruleId: "autoplay-motion",
        category: this.category,
        severity: this.severity,
        message: "Autoplaying media should provide controls and honor reduced motion preferences.",
        path: context.path,
        selector
      });
    }

    return issues;
  }
};

export const responsiveHeuristicsRule: ValidationRule = {
  id: "responsive-heuristics",
  category: "responsive",
  severity: "warning",
  validate(input, context) {
    const issues: ValidationIssue[] = [];
    const responsive = input.responsive;

    if (!responsive) {
      return [{
        ruleId: this.id,
        category: this.category,
        severity: "info",
        message: "No responsive signals were provided.",
        path: context.path
      }];
    }

    if (responsive.hasViewportMeta === false) {
      issues.push({
        ruleId: "viewport-meta",
        category: this.category,
        severity: this.severity,
        message: "Page is missing a viewport meta tag with width=device-width.",
        path: context.path
      });
    }

    for (const element of responsive.fixedWidthElements ?? []) {
      if (element.width > 390) {
        issues.push({
          ruleId: "fixed-width-element",
          category: this.category,
          severity: this.severity,
          message: `Element has fixed width ${element.width}px that may overflow small screens.`,
          path: context.path,
          selector: element.selector
        });
      }
    }

    if (responsive.usesResponsiveImages === false && (input.images ?? []).length > 0) {
      issues.push({
        ruleId: "responsive-images",
        category: this.category,
        severity: "info",
        message: "Images were found but responsive image signals were not present.",
        path: context.path
      });
    }

    return issues;
  }
};

export const performanceHeuristicsRule: ValidationRule = {
  id: "performance-heuristics",
  category: "performance",
  severity: "warning",
  validate(input, context) {
    const signals = input.performance;
    if (!signals) {
      return [{
        ruleId: this.id,
        category: this.category,
        severity: "info",
        message: "No performance signals were provided.",
        path: context.path
      }];
    }

    const issues: ValidationIssue[] = [];
    if ((signals.htmlBytes ?? 0) > 200_000) {
      issues.push({
        ruleId: "html-size-budget",
        category: this.category,
        severity: this.severity,
        message: "HTML exceeds the 200KB heuristic budget.",
        path: context.path,
        context: { htmlBytes: signals.htmlBytes }
      });
    }

    if ((signals.scriptBytes ?? 0) > 170_000 || (signals.scriptCount ?? 0) > 15) {
      issues.push({
        ruleId: "script-budget",
        category: this.category,
        severity: this.severity,
        message: "JavaScript usage exceeds conservative static-site heuristics.",
        path: context.path,
        context: {
          scriptBytes: signals.scriptBytes,
          scriptCount: signals.scriptCount
        }
      });
    }

    if ((signals.imageBytes ?? 0) > 1_000_000 || (signals.imageCount ?? 0) > 30) {
      issues.push({
        ruleId: "image-budget",
        category: this.category,
        severity: this.severity,
        message: "Image usage exceeds conservative page-weight heuristics.",
        path: context.path,
        context: {
          imageBytes: signals.imageBytes,
          imageCount: signals.imageCount
        }
      });
    }

    if ((signals.imageCount ?? 0) > 3 && signals.hasLazyImages === false) {
      issues.push({
        ruleId: "lazy-images",
        category: this.category,
        severity: "info",
        message: "Multiple images were found without lazy-loading signals.",
        path: context.path
      });
    }

    return issues;
  }
};

export const imageOptimizationMetadataRule: ValidationRule = {
  id: "image-optimization-metadata",
  category: "performance",
  severity: "warning",
  validate(input, context) {
    const issues: ValidationIssue[] = [];
    const signals = input.imageOptimization;

    for (const image of input.images ?? []) {
      if (!image.decorative && (image.width === undefined || image.height === undefined)) {
        issues.push({
          ruleId: "image-dimensions",
          category: this.category,
          severity: this.severity,
          message: `Image "${image.src}" is missing width/height metadata.`,
          path: context.path,
          selector: image.selector,
          help: "Include intrinsic dimensions to avoid layout shift in static output."
        });
      }

      if (image.loading !== "lazy" && image.fetchPriority !== "high" && (input.images ?? []).indexOf(image) > 0) {
        issues.push({
          ruleId: "image-loading-hint",
          category: this.category,
          severity: "info",
          message: `Image "${image.src}" should declare lazy loading or an explicit priority.`,
          path: context.path,
          selector: image.selector
        });
      }
    }

    for (const item of signals?.unoptimizedImages ?? []) {
      issues.push({
        ruleId: "image-optimization-hint",
        category: this.category,
        severity: "info",
        message: `Image "${item.src}" has optimization gap: ${item.reason}.`,
        path: context.path,
        selector: item.selector
      });
    }

    if (signals?.modernFormats === false) {
      issues.push({
        ruleId: "modern-image-formats",
        category: this.category,
        severity: this.severity,
        message: "Image metadata indicates not all raster images use AVIF/WebP.",
        path: context.path
      });
    }

    return issues;
  }
};

export const staticOutputRule: ValidationRule = {
  id: "static-output",
  category: "performance",
  severity: "warning",
  validate(input, context) {
    const signals = input.javascript;
    const performance = input.performance;
    const issues: ValidationIssue[] = [];

    if (signals?.usesStaticRendering === false || performance?.usesStaticRendering === false) {
      issues.push({
        ruleId: "static-rendering",
        category: this.category,
        severity: this.severity,
        message: "Page signals indicate client rendering instead of static output.",
        path: context.path,
        help: "Prefer static HTML with progressive enhancement for Website Factory output."
      });
    }

    const scriptBytes = signals?.totalScriptBytes ?? performance?.scriptBytes ?? 0;
    const scriptCount = performance?.scriptCount ?? 0;
    if (signals?.minimalJavaScript === false || performance?.minimalJavaScript === false || scriptBytes > 70_000 || scriptCount > 8) {
      issues.push({
        ruleId: "minimal-javascript",
        category: this.category,
        severity: this.severity,
        message: "JavaScript signals exceed the minimal-JS static-site target.",
        path: context.path,
        context: {
          scriptBytes,
          scriptCount,
          thirdPartyScriptCount: signals?.thirdPartyScriptCount ?? performance?.thirdPartyScriptCount
        }
      });
    }

    if ((signals?.thirdPartyScriptCount ?? performance?.thirdPartyScriptCount ?? 0) > 0) {
      issues.push({
        ruleId: "third-party-scripts",
        category: this.category,
        severity: "info",
        message: "Third-party script signals should be reviewed before publishing static output.",
        path: context.path,
        context: { thirdPartyScriptCount: signals?.thirdPartyScriptCount ?? performance?.thirdPartyScriptCount }
      });
    }

    return issues;
  }
};

export const cssFontOptimizationRule: ValidationRule = {
  id: "css-font-optimization",
  category: "performance",
  severity: "warning",
  validate(input, context) {
    const css = input.cssOptimization;
    const performance = input.performance;
    if (!css && !performance) {
      return [];
    }

    const issues: ValidationIssue[] = [];
    const blockingStylesheetCount = css?.blockingStylesheetCount ?? performance?.blockingStylesheetCount ?? performance?.stylesheetCount ?? 0;
    if (blockingStylesheetCount > 2) {
      issues.push({
        ruleId: "blocking-stylesheets",
        category: this.category,
        severity: this.severity,
        message: "Page has multiple render-blocking stylesheet signals.",
        path: context.path,
        context: { blockingStylesheetCount }
      });
    }

    const hasCriticalCss = css?.hasCriticalCss ?? performance?.hasCriticalCss;
    if (hasCriticalCss === false && blockingStylesheetCount > 0) {
      issues.push({
        ruleId: "critical-css",
        category: this.category,
        severity: "info",
        message: "Critical CSS metadata was not detected for a page with blocking stylesheets.",
        path: context.path
      });
    }

    const fontDisplay = css?.fontDisplay ?? performance?.fontDisplay;
    if (fontDisplay && !["swap", "fallback", "optional"].includes(fontDisplay)) {
      issues.push({
        ruleId: "font-display",
        category: this.category,
        severity: this.severity,
        message: `Font display strategy "${fontDisplay}" may delay text rendering.`,
        path: context.path,
        help: "Use font-display: swap, fallback, or optional for static pages."
      });
    }

    if ((css?.fontFileCount ?? 0) > 0 && (css?.preloadedFontCount ?? performance?.preloadedFontCount ?? 0) === 0) {
      issues.push({
        ruleId: "font-preload",
        category: this.category,
        severity: "info",
        message: "Font files were detected without preload metadata.",
        path: context.path
      });
    }

    return issues;
  }
};

export const codeSplittingLazyLoadingRule: ValidationRule = {
  id: "code-splitting-lazy-loading",
  category: "performance",
  severity: "warning",
  validate(input, context) {
    const js = input.javascript;
    const performance = input.performance;
    const issues: ValidationIssue[] = [];
    const routeScriptBytes = js?.routeScriptBytes ?? performance?.scriptBytes ?? 0;
    const codeSplitChunkCount = js?.codeSplitChunkCount ?? performance?.codeSplitChunkCount ?? 0;
    if (routeScriptBytes > 100_000 && codeSplitChunkCount < 2) {
      issues.push({
        ruleId: "code-splitting",
        category: this.category,
        severity: this.severity,
        message: "Large route JavaScript lacks code-splitting metadata.",
        path: context.path,
        context: { routeScriptBytes, codeSplitChunkCount }
      });
    }

    const lazyLoadedComponentCount = js?.lazyLoadedComponentCount ?? performance?.lazyLoadedComponentCount ?? 0;
    if (routeScriptBytes > 70_000 && lazyLoadedComponentCount === 0) {
      issues.push({
        ruleId: "component-lazy-loading",
        category: this.category,
        severity: "info",
        message: "Large route JavaScript has no lazy-loaded component signals.",
        path: context.path
      });
    }

    if ((input.images ?? []).length > 3 && performance?.hasLazyImages === false) {
      issues.push({
        ruleId: "image-lazy-loading",
        category: this.category,
        severity: "info",
        message: "Several images were found without lazy-loading metadata.",
        path: context.path
      });
    }

    return issues;
  }
};

export const seoCompletenessRule: ValidationRule = {
  id: "seo-completeness",
  category: "seo",
  severity: "error",
  validate(input, context) {
    const seo = input.seo ?? {};
    const issues: ValidationIssue[] = [];

    if (!seo.title?.trim()) {
      issues.push(requiredSeoIssue("title", "Page is missing a meta title.", context.path));
    } else if (seo.title.length > 60) {
      issues.push({
        ruleId: "seo-title-length",
        category: this.category,
        severity: "warning",
        message: "Meta title is longer than 60 characters.",
        path: context.path,
        context: { length: seo.title.length }
      });
    }

    if (!seo.description?.trim()) {
      issues.push(requiredSeoIssue("description", "Page is missing a meta description.", context.path));
    } else if (seo.description.length > 160) {
      issues.push({
        ruleId: "seo-description-length",
        category: this.category,
        severity: "warning",
        message: "Meta description is longer than 160 characters.",
        path: context.path,
        context: { length: seo.description.length }
      });
    }

    if (!seo.canonicalUrl?.trim()) {
      issues.push(requiredSeoIssue("canonical", "Page is missing a canonical URL.", context.path));
    }

    if (!seo.openGraph?.title || !seo.openGraph.description) {
      issues.push({
        ruleId: "open-graph-completeness",
        category: this.category,
        severity: "warning",
        message: "OpenGraph title and description should be present.",
        path: context.path
      });
    }

    if (!seo.twitter?.card) {
      issues.push({
        ruleId: "twitter-card",
        category: this.category,
        severity: "warning",
        message: "Twitter card metadata should be present.",
        path: context.path
      });
    }

    if ((seo.structuredDataTypes ?? []).length === 0) {
      issues.push({
        ruleId: "structured-data",
        category: this.category,
        severity: "info",
        message: "No JSON-LD structured data was detected.",
        path: context.path
      });
    }

    return issues;
  }
};

export const defaultRules: ValidationRule[] = [
  headingHierarchyRule,
  imageAltTextRule,
  formLabelsRule,
  keyboardNavigationRule,
  contrastTokenRule,
  landmarkSemanticsRule,
  ariaIntegrityRule,
  screenReaderRule,
  reducedMotionRule,
  responsiveHeuristicsRule,
  performanceHeuristicsRule,
  imageOptimizationMetadataRule,
  staticOutputRule,
  cssFontOptimizationRule,
  codeSplittingLazyLoadingRule,
  seoCompletenessRule
];

export function runRules(
  input: PageValidationInput,
  rules: ValidationRule[] = defaultRules,
  path = input.path ?? input.url
): ValidationIssue[] {
  return rules.flatMap((rule) => rule.validate(input, { path }));
}

function hasAccessibleName(...values: Array<string | undefined>): boolean {
  return values.some((value) => Boolean(value?.trim()));
}

function requiredSeoIssue(field: string, message: string, path?: string): ValidationIssue {
  return {
    ruleId: `seo-${field}`,
    category: "seo",
    severity: "error",
    message,
    path
  };
}
