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

      if (!hasAccessibleName(node.text, node.ariaLabel)) {
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
  responsiveHeuristicsRule,
  performanceHeuristicsRule,
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
