import type { ContrastAssessment, ContrastToken, ValidationIssue } from "./types.js";

export function validateContrastTokens(tokens: ContrastToken[] = [], path?: string): ValidationIssue[] {
  return assessContrastTokens(tokens).flatMap<ValidationIssue>((assessment) => {
    if (!assessment.parseable) {
      return [{
        ruleId: "contrast-token-parseable",
        category: "a11y",
        severity: "warning",
        message: `Contrast token "${assessment.token.name}" uses an unsupported color format.`,
        path,
        context: {
          foreground: assessment.token.foreground,
          background: assessment.token.background
        }
      } satisfies ValidationIssue];
    }

    if (assessment.passed || assessment.ratio === undefined) {
      return [];
    }

    return [{
      ruleId: "contrast-token-aa",
      category: "a11y",
      severity: "error",
      message: `Contrast token "${assessment.token.name}" has ratio ${assessment.ratio.toFixed(2)}:1; expected at least ${assessment.requiredRatio}:1.`,
      path,
      help: "Adjust foreground/background color tokens to meet WCAG AA contrast.",
      context: {
        ratio: Number(assessment.ratio.toFixed(2)),
        required: assessment.requiredRatio,
        foreground: assessment.token.foreground,
        background: assessment.token.background
      }
    } satisfies ValidationIssue];
  });
}

export function assessContrastTokens(tokens: ContrastToken[] = []): ContrastAssessment[] {
  return tokens.map((token) => {
    const requiredRatio = isLargeText(token) ? 3 : 4.5;
    const base = {
      token,
      requiredRatio,
      wcagLevel: "AA" as const,
      largeText: isLargeText(token)
    };
    const foreground = parseColor(token.foreground);
    const background = parseColor(token.background);

    if (!foreground || !background) {
      return {
        ...base,
        passed: false,
        parseable: false
      };
    }

    const ratio = contrastRatio(foreground, background);
    return {
      ...base,
      ratio,
      passed: ratio >= requiredRatio,
      parseable: true
    };
  });
}

export function contrastRatio(foreground: RgbColor, background: RgbColor): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function parseColor(value: string): RgbColor | undefined {
  const trimmed = value.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(trimmed);
  if (hex?.[1]) {
    const normalized = hex[1].length === 3
      ? hex[1].split("").map((char) => `${char}${char}`).join("")
      : hex[1];

    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16)
    };
  }

  const rgb = /^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\)$/.exec(trimmed);
  if (!rgb) {
    return namedColor(trimmed);
  }

  return clampRgb({
    r: Number(rgb[1]),
    g: Number(rgb[2]),
    b: Number(rgb[3])
  });
}

function relativeLuminance(color: RgbColor): number {
  const [r, g, b] = [color.r, color.g, color.b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

function isLargeText(token: ContrastToken): boolean {
  const size = token.fontSizePx ?? 16;
  const weight = token.fontWeight ?? 400;
  return size >= 24 || (size >= 18.66 && weight >= 700);
}

function clampRgb(color: RgbColor): RgbColor {
  return {
    r: clampChannel(color.r),
    g: clampChannel(color.g),
    b: clampChannel(color.b)
  };
}

function clampChannel(value: number): number {
  return Math.min(255, Math.max(0, value));
}

function namedColor(value: string): RgbColor | undefined {
  switch (value) {
    case "black":
      return { r: 0, g: 0, b: 0 };
    case "white":
      return { r: 255, g: 255, b: 255 };
    case "transparent":
      return undefined;
    default:
      return undefined;
  }
}
