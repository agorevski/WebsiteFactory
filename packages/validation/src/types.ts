export type ValidationSeverity = "error" | "warning" | "info";
export type ValidationCategory = "schema" | "a11y" | "seo" | "performance" | "responsive" | "content";

export interface ValidationIssue {
  ruleId: string;
  category: ValidationCategory;
  severity: ValidationSeverity;
  message: string;
  path?: string | undefined;
  selector?: string | undefined;
  help?: string | undefined;
  context?: Record<string, string | number | boolean | null | undefined> | undefined;
}

export interface ValidationSummary {
  error: number;
  warning: number;
  info: number;
}

export interface ValidationResult {
  ok: boolean;
  score: number;
  issues: ValidationIssue[];
  summary: ValidationSummary;
}

export interface HeadingNode {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  selector?: string | undefined;
}

export interface ImageNode {
  src: string;
  alt?: string | undefined;
  decorative?: boolean | undefined;
  width?: number | undefined;
  height?: number | undefined;
  loading?: "eager" | "lazy" | string | undefined;
  selector?: string | undefined;
}

export interface FormControlNode {
  id?: string | undefined;
  name?: string | undefined;
  type?: string | undefined;
  label?: string | undefined;
  ariaLabel?: string | undefined;
  ariaLabelledBy?: string | undefined;
  hidden?: boolean | undefined;
  selector?: string | undefined;
}

export interface LinkNode {
  href?: string | undefined;
  text?: string | undefined;
  ariaLabel?: string | undefined;
  target?: string | undefined;
  rel?: string | undefined;
  selector?: string | undefined;
}

export interface InteractiveNode {
  role?: string | undefined;
  tagName?: string | undefined;
  tabIndex?: number | undefined;
  ariaLabel?: string | undefined;
  text?: string | undefined;
  hasKeyboardHandler?: boolean | undefined;
  selector?: string | undefined;
}

export interface SeoDocument {
  title?: string | undefined;
  description?: string | undefined;
  canonicalUrl?: string | undefined;
  robots?: string | undefined;
  openGraph?: {
    title?: string | undefined;
    description?: string | undefined;
    image?: string | undefined;
    url?: string | undefined;
  } | undefined;
  twitter?: {
    card?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    image?: string | undefined;
  } | undefined;
  structuredDataTypes?: string[] | undefined;
}

export interface PerformanceSignals {
  htmlBytes?: number | undefined;
  scriptBytes?: number | undefined;
  styleBytes?: number | undefined;
  imageBytes?: number | undefined;
  imageCount?: number | undefined;
  scriptCount?: number | undefined;
  stylesheetCount?: number | undefined;
  hasLazyImages?: boolean | undefined;
}

export interface ResponsiveSignals {
  hasViewportMeta?: boolean | undefined;
  fixedWidthElements?: Array<{ selector?: string | undefined; width: number }> | undefined;
  usesResponsiveImages?: boolean | undefined;
}

export interface ContrastToken {
  name: string;
  foreground: string;
  background: string;
  fontSizePx?: number | undefined;
  fontWeight?: number | undefined;
}

export interface PageValidationInput {
  path?: string | undefined;
  url?: string | undefined;
  html?: string | undefined;
  headings?: HeadingNode[] | undefined;
  images?: ImageNode[] | undefined;
  formControls?: FormControlNode[] | undefined;
  links?: LinkNode[] | undefined;
  interactive?: InteractiveNode[] | undefined;
  seo?: SeoDocument | undefined;
  performance?: PerformanceSignals | undefined;
  responsive?: ResponsiveSignals | undefined;
  contrastTokens?: ContrastToken[] | undefined;
}

export interface SiteValidationInput {
  schema?: unknown;
  pages?: PageValidationInput[] | undefined;
  contrastTokens?: ContrastToken[] | undefined;
}

export interface RuleContext {
  path?: string | undefined;
}

export interface ValidationRule<TInput = PageValidationInput> {
  id: string;
  category: ValidationCategory;
  severity: ValidationSeverity;
  validate(input: TInput, context: RuleContext): ValidationIssue[];
}

export interface SchemaValidationHook<TSchema = unknown> {
  id: string;
  validate(schema: TSchema): ValidationIssue[] | void;
}

export interface SafeParseLike<TSchema = unknown> {
  safeParse(data: unknown): {
    success: boolean;
    data?: TSchema;
    error?: {
      issues?: Array<{ path?: Array<string | number> | undefined; message: string }> | undefined;
      message?: string | undefined;
    } | undefined;
  };
}

export interface ValidationOptions {
  rules?: ValidationRule[] | undefined;
  schemaHooks?: Array<SchemaValidationHook> | undefined;
  failOnWarnings?: boolean | undefined;
}
