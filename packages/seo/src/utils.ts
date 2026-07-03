import type { JsonLdNode, SeoImage } from "./types.js";

export function firstText(...values: Array<string | null | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const trimmed = value.slice(0, Math.max(0, maxLength - 1)).trimEnd();
  return `${trimmed}…`;
}

export function formatIsoDate(value: string | Date | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

export function normalizeUrl(value: string, baseUrl: string): string {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(value || "/", base).toString();
}

export function normalizePath(path: string | undefined): string {
  if (!path || path === "/") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function withoutTrailingSlash(value: string): string {
  return value.endsWith("/") && value !== "/" ? value.slice(0, -1) : value;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeXml(value: string): string {
  return escapeHtml(value);
}

export function normalizeImage(image: string | SeoImage, baseUrl: string): SeoImage {
  if (typeof image === "string") {
    return { url: normalizeUrl(image, baseUrl) };
  }

  return {
    ...image,
    url: normalizeUrl(image.url, baseUrl)
  };
}

export function normalizeImages(
  images: Array<string | SeoImage> | string | SeoImage | undefined,
  baseUrl: string
): SeoImage[] {
  if (!images) {
    return [];
  }

  const list = Array.isArray(images) ? images : [images];
  return list.map((image) => normalizeImage(image, baseUrl));
}

export function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function cleanJsonLd<T extends JsonLdNode>(node: T): T {
  return removeEmpty(node) as T;
}

function removeEmpty(value: unknown): unknown {
  if (value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const items = value.map((item) => removeEmpty(item)).filter((item) => item !== undefined);
    return items.length > 0 ? items : undefined;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, entry]) => [key, removeEmpty(entry)] as const)
      .filter(([, entry]) => entry !== undefined);

    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }

  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}
