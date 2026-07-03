import { parse as parseYaml } from "yaml";
import { z } from "zod";

const nonEmptyStringSchema = z.string().trim().min(1);
const textSchema = z.string().trim().min(1);
const urlOrPathSchema = z.string().trim().min(1);
const cssColorSchema = z.string().trim().min(1);
const metadataSchema = z.record(z.string(), z.unknown());

const linkSchema = z
  .object({
    label: nonEmptyStringSchema,
    url: urlOrPathSchema,
    ariaLabel: textSchema.optional(),
    target: z.enum(["self", "blank"]).default("self"),
    variant: z
      .enum(["primary", "secondary", "tertiary", "link", "button"])
      .default("link"),
  })
  .strict();

const imageSchema = z
  .object({
    src: urlOrPathSchema,
    alt: z.string().trim().default(""),
    caption: textSchema.optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    focalPoint: z
      .object({
        x: z.number().min(0).max(1),
        y: z.number().min(0).max(1),
      })
      .strict()
      .optional(),
  })
  .strict();

const videoSchema = z
  .object({
    title: nonEmptyStringSchema,
    url: urlOrPathSchema,
    provider: z
      .enum(["youtube", "vimeo", "self-hosted", "other"])
      .default("other"),
    thumbnail: imageSchema.optional(),
    transcript: textSchema.optional(),
    duration: textSchema.optional(),
  })
  .strict();

const addressSchema = z
  .object({
    street1: textSchema.optional(),
    street2: textSchema.optional(),
    city: textSchema.optional(),
    region: textSchema.optional(),
    postalCode: textSchema.optional(),
    country: textSchema.optional(),
  })
  .strict();

const geoSchema = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict();

const socialLinkSchema = z
  .object({
    platform: nonEmptyStringSchema,
    url: urlOrPathSchema,
    handle: textSchema.optional(),
  })
  .strict();

const dayHoursRangeSchema = z
  .object({
    opens: nonEmptyStringSchema,
    closes: nonEmptyStringSchema,
    label: textSchema.optional(),
  })
  .strict();

const dayHoursSchema = z
  .object({
    isClosed: z.boolean().default(false),
    ranges: z.array(dayHoursRangeSchema).default([]),
    note: textSchema.optional(),
  })
  .strict();

const weeklyHoursSchema = z
  .object({
    monday: dayHoursSchema.optional(),
    tuesday: dayHoursSchema.optional(),
    wednesday: dayHoursSchema.optional(),
    thursday: dayHoursSchema.optional(),
    friday: dayHoursSchema.optional(),
    saturday: dayHoursSchema.optional(),
    sunday: dayHoursSchema.optional(),
  })
  .strict();

export const hoursSchema = z
  .object({
    timezone: textSchema.optional(),
    summary: textSchema.optional(),
    weekly: weeklyHoursSchema.default({}),
    holidayHours: z
      .array(
        z
          .object({
            date: nonEmptyStringSchema,
            name: textSchema.optional(),
            isClosed: z.boolean().default(false),
            ranges: z.array(dayHoursRangeSchema).default([]),
            note: textSchema.optional(),
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

export const businessSchema = z
  .object({
    name: nonEmptyStringSchema,
    legalName: textSchema.optional(),
    tagline: textSchema.optional(),
    description: textSchema.optional(),
    industry: textSchema.optional(),
    entityType: textSchema.optional(),
    foundedYear: z.number().int().min(1000).max(9999).optional(),
    yearsInBusiness: z.number().int().nonnegative().optional(),
    languages: z.array(nonEmptyStringSchema).default([]),
    timezone: textSchema.optional(),
    keywords: z.array(nonEmptyStringSchema).default([]),
  })
  .strict();

export const brandSchema = z
  .object({
    logo: imageSchema.optional(),
    icon: imageSchema.optional(),
    colors: z
      .object({
        primary: cssColorSchema.optional(),
        secondary: cssColorSchema.optional(),
        accent: cssColorSchema.optional(),
        background: cssColorSchema.optional(),
        foreground: cssColorSchema.optional(),
        muted: cssColorSchema.optional(),
      })
      .strict()
      .default({}),
    typography: z
      .object({
        headingFont: textSchema.optional(),
        bodyFont: textSchema.optional(),
        monospaceFont: textSchema.optional(),
      })
      .strict()
      .default({}),
    voice: z
      .object({
        tone: textSchema.optional(),
        personality: z.array(nonEmptyStringSchema).default([]),
        writingGuidelines: z.array(nonEmptyStringSchema).default([]),
      })
      .strict()
      .prefault({}),
    assets: z.array(imageSchema).default([]),
  })
  .strict();

export const contactSchema = z
  .object({
    email: z.string().trim().email().optional(),
    phone: textSchema.optional(),
    smsPhone: textSchema.optional(),
    fax: textSchema.optional(),
    website: urlOrPathSchema.optional(),
    contactName: textSchema.optional(),
    preferredContactMethod: z
      .enum(["phone", "email", "sms", "form", "appointment"])
      .optional(),
    address: addressSchema.optional(),
    mapUrl: urlOrPathSchema.optional(),
    mapEmbedUrl: urlOrPathSchema.optional(),
    emergencyPhone: textSchema.optional(),
  })
  .strict();

export const locationSchema = z
  .object({
    id: textSchema.optional(),
    name: nonEmptyStringSchema,
    description: textSchema.optional(),
    address: addressSchema.optional(),
    contact: contactSchema.default({}),
    hours: hoursSchema.optional(),
    geo: geoSchema.optional(),
    serviceArea: z.array(nonEmptyStringSchema).default([]),
    amenities: z.array(nonEmptyStringSchema).default([]),
  })
  .strict();

const contentBlockSchema = z
  .object({
    heading: textSchema.optional(),
    body: textSchema.optional(),
    image: imageSchema.optional(),
    links: z.array(linkSchema).default([]),
  })
  .strict();

export const heroSchema = z
  .object({
    eyebrow: textSchema.optional(),
    headline: nonEmptyStringSchema,
    subheadline: textSchema.optional(),
    body: textSchema.optional(),
    primaryCta: linkSchema.optional(),
    secondaryCta: linkSchema.optional(),
    image: imageSchema.optional(),
    video: videoSchema.optional(),
    trustSignals: z.array(nonEmptyStringSchema).default([]),
  })
  .strict();

export const contentSectionSchema = z
  .object({
    title: textSchema.optional(),
    subtitle: textSchema.optional(),
    body: textSchema.optional(),
    blocks: z.array(contentBlockSchema).default([]),
    images: z.array(imageSchema).default([]),
    cta: linkSchema.optional(),
  })
  .strict();

export const serviceSchema = z
  .object({
    id: textSchema.optional(),
    name: nonEmptyStringSchema,
    shortDescription: textSchema.optional(),
    description: textSchema.optional(),
    category: textSchema.optional(),
    price: textSchema.optional(),
    duration: textSchema.optional(),
    image: imageSchema.optional(),
    features: z.array(nonEmptyStringSchema).default([]),
    serviceAreas: z.array(nonEmptyStringSchema).default([]),
    cta: linkSchema.optional(),
  })
  .strict();

export const productSchema = z
  .object({
    id: textSchema.optional(),
    name: nonEmptyStringSchema,
    description: textSchema.optional(),
    category: textSchema.optional(),
    sku: textSchema.optional(),
    price: textSchema.optional(),
    images: z.array(imageSchema).default([]),
    features: z.array(nonEmptyStringSchema).default([]),
    available: z.boolean().default(true),
    cta: linkSchema.optional(),
  })
  .strict();

export const pricingSchema = z
  .object({
    title: textSchema.optional(),
    description: textSchema.optional(),
    currency: textSchema.optional(),
    plans: z
      .array(
        z
          .object({
            id: textSchema.optional(),
            name: nonEmptyStringSchema,
            price: nonEmptyStringSchema,
            period: textSchema.optional(),
            description: textSchema.optional(),
            features: z.array(nonEmptyStringSchema).default([]),
            highlighted: z.boolean().default(false),
            cta: linkSchema.optional(),
          })
          .strict(),
      )
      .default([]),
    notes: z.array(nonEmptyStringSchema).default([]),
  })
  .strict();

export const faqItemSchema = z
  .object({
    question: nonEmptyStringSchema,
    answer: nonEmptyStringSchema,
    category: textSchema.optional(),
  })
  .strict();

export const reviewSchema = z
  .object({
    author: nonEmptyStringSchema,
    quote: nonEmptyStringSchema,
    rating: z.number().min(0).max(5).optional(),
    source: textSchema.optional(),
    date: textSchema.optional(),
    url: urlOrPathSchema.optional(),
  })
  .strict();

export const teamMemberSchema = z
  .object({
    name: nonEmptyStringSchema,
    role: textSchema.optional(),
    bio: textSchema.optional(),
    photo: imageSchema.optional(),
    credentials: z.array(nonEmptyStringSchema).default([]),
    socialLinks: z.array(socialLinkSchema).default([]),
  })
  .strict();

export const careersSchema = z
  .object({
    intro: textSchema.optional(),
    benefits: z.array(nonEmptyStringSchema).default([]),
    openings: z
      .array(
        z
          .object({
            title: nonEmptyStringSchema,
            location: textSchema.optional(),
            type: textSchema.optional(),
            description: textSchema.optional(),
            requirements: z.array(nonEmptyStringSchema).default([]),
            applyUrl: urlOrPathSchema.optional(),
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

export const formSchema = z
  .object({
    id: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    description: textSchema.optional(),
    submitLabel: textSchema.default("Submit"),
    fields: z
      .array(
        z
          .object({
            name: nonEmptyStringSchema,
            label: nonEmptyStringSchema,
            type: z
              .enum([
                "text",
                "email",
                "phone",
                "textarea",
                "select",
                "checkbox",
                "radio",
                "date",
                "time",
                "number",
                "file",
              ])
              .default("text"),
            required: z.boolean().default(false),
            placeholder: textSchema.optional(),
            options: z.array(nonEmptyStringSchema).default([]),
            helpText: textSchema.optional(),
          })
          .strict(),
      )
      .default([]),
    successMessage: textSchema.optional(),
  })
  .strict();

export const appointmentsSchema = z
  .object({
    enabled: z.boolean().default(false),
    bookingUrl: urlOrPathSchema.optional(),
    phone: textSchema.optional(),
    appointmentTypes: z.array(nonEmptyStringSchema).default([]),
    leadTime: textSchema.optional(),
    cancellationPolicy: textSchema.optional(),
  })
  .strict();

export const reservationsSchema = z
  .object({
    enabled: z.boolean().default(false),
    reservationUrl: urlOrPathSchema.optional(),
    phone: textSchema.optional(),
    partySizeMin: z.number().int().positive().optional(),
    partySizeMax: z.number().int().positive().optional(),
    policy: textSchema.optional(),
  })
  .strict();

export const menuSchema = z
  .object({
    name: nonEmptyStringSchema,
    description: textSchema.optional(),
    sections: z
      .array(
        z
          .object({
            name: nonEmptyStringSchema,
            description: textSchema.optional(),
            items: z
              .array(
                z
                  .object({
                    name: nonEmptyStringSchema,
                    description: textSchema.optional(),
                    price: textSchema.optional(),
                    image: imageSchema.optional(),
                    tags: z.array(nonEmptyStringSchema).default([]),
                    allergens: z.array(nonEmptyStringSchema).default([]),
                    available: z.boolean().default(true),
                  })
                  .strict(),
              )
              .default([]),
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

export const insuranceSchema = z
  .object({
    accepted: z.array(nonEmptyStringSchema).default([]),
    notAccepted: z.array(nonEmptyStringSchema).default([]),
    notes: textSchema.optional(),
    verificationUrl: urlOrPathSchema.optional(),
  })
  .strict();

const datedContentSchema = z
  .object({
    id: textSchema.optional(),
    title: nonEmptyStringSchema,
    summary: textSchema.optional(),
    body: textSchema.optional(),
    date: textSchema.optional(),
    image: imageSchema.optional(),
    url: urlOrPathSchema.optional(),
    tags: z.array(nonEmptyStringSchema).default([]),
  })
  .strict();

export const promotionSchema = datedContentSchema.extend({
  code: textSchema.optional(),
  startsAt: textSchema.optional(),
  endsAt: textSchema.optional(),
  terms: textSchema.optional(),
});

export const seoSchema = z
  .object({
    title: textSchema.optional(),
    description: textSchema.optional(),
    keywords: z.array(nonEmptyStringSchema).default([]),
    canonicalUrl: urlOrPathSchema.optional(),
    noIndex: z.boolean().default(false),
    openGraph: z
      .object({
        title: textSchema.optional(),
        description: textSchema.optional(),
        image: imageSchema.optional(),
        type: textSchema.optional(),
      })
      .strict()
      .default({}),
    structuredData: z.array(metadataSchema).default([]),
  })
  .strict();

export const analyticsSchema = z
  .object({
    googleAnalyticsId: textSchema.optional(),
    googleTagManagerId: textSchema.optional(),
    metaPixelId: textSchema.optional(),
    events: z.array(nonEmptyStringSchema).default([]),
    consentRequired: z.boolean().default(false),
  })
  .strict();

export const legalSchema = z
  .object({
    privacyPolicyUrl: urlOrPathSchema.optional(),
    termsUrl: urlOrPathSchema.optional(),
    cookiePolicyUrl: urlOrPathSchema.optional(),
    licenses: z.array(nonEmptyStringSchema).default([]),
    disclaimers: z.array(nonEmptyStringSchema).default([]),
    copyright: textSchema.optional(),
  })
  .strict();

export const accessibilitySchema = z
  .object({
    statementUrl: urlOrPathSchema.optional(),
    contactEmail: z.string().trim().email().optional(),
    contactPhone: textSchema.optional(),
    notes: textSchema.optional(),
    standards: z.array(nonEmptyStringSchema).default(["WCAG 2.2 AA"]),
  })
  .strict();

export const templateSchema = z
  .object({
    id: textSchema.optional(),
    name: textSchema.optional(),
    variant: textSchema.optional(),
    layout: textSchema.optional(),
    hiddenSections: z.array(nonEmptyStringSchema).default([]),
    sectionOrder: z.array(nonEmptyStringSchema).default([]),
    options: metadataSchema.default({}),
  })
  .strict();

export const themeSchema = z
  .object({
    mode: z.enum(["light", "dark", "system"]).default("light"),
    radius: textSchema.optional(),
    spacing: textSchema.optional(),
    colors: brandSchema.shape.colors.default({}),
    customCss: textSchema.optional(),
  })
  .strict();

const universalActionSchema = z.object({
  label: nonEmptyStringSchema,
  href: urlOrPathSchema,
  variant: z.enum(["primary", "secondary", "text"]).default("primary"),
});

const universalAddressSchema = z.object({
  street: nonEmptyStringSchema,
  city: nonEmptyStringSchema,
  region: nonEmptyStringSchema,
  postalCode: nonEmptyStringSchema,
  country: z.string().trim().min(2).default("US"),
});

const universalLabelValueSchema = z.object({
  label: nonEmptyStringSchema,
  value: nonEmptyStringSchema,
});

const universalContentItemSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
});

const universalTestimonialSchema = z.object({
  quote: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  context: textSchema.optional(),
});

const universalFaqSchema = z.object({
  question: nonEmptyStringSchema,
  answer: nonEmptyStringSchema,
});

const universalSectionSchema = z.object({
  id: nonEmptyStringSchema,
  type: z.enum(["services", "proof", "process", "testimonials", "faq", "content"]),
  eyebrow: textSchema.optional(),
  title: nonEmptyStringSchema,
  summary: textSchema.optional(),
  items: z.array(universalContentItemSchema).default([]),
  stats: z.array(universalLabelValueSchema).default([]),
  steps: z.array(universalContentItemSchema).default([]),
  testimonials: z.array(universalTestimonialSchema).default([]),
  questions: z.array(universalFaqSchema).default([]),
  actions: z.array(universalActionSchema).default([]),
});

const universalCtaSchema = z.object({
  title: nonEmptyStringSchema,
  summary: nonEmptyStringSchema,
  actions: z.array(universalActionSchema).min(1),
});

export const universalSiteSchema = z.object({
  schemaVersion: z.number().int().positive(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  vertical: nonEmptyStringSchema,
  theme: z.object({
    name: nonEmptyStringSchema,
    palette: z.enum(["clinic", "trade", "hospitality", "professional"]),
    mode: z.enum(["light", "dark"]).default("light"),
    radius: z.enum(["soft", "rounded", "crisp"]).default("soft"),
  }),
  seo: z.object({
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    canonicalPath: urlOrPathSchema.optional(),
  }),
  business: z.object({
    name: nonEmptyStringSchema,
    type: nonEmptyStringSchema,
    tagline: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    phone: nonEmptyStringSchema,
    email: z.string().trim().email().optional(),
    address: universalAddressSchema,
    areaServed: z.array(nonEmptyStringSchema).default([]),
    hours: z.array(universalLabelValueSchema).default([]),
    credentials: z.array(nonEmptyStringSchema).default([]),
    social: z.array(universalActionSchema).default([]),
  }),
  navigation: z.array(universalActionSchema).default([]),
  hero: z.object({
    eyebrow: textSchema.optional(),
    title: nonEmptyStringSchema,
    summary: nonEmptyStringSchema,
    primaryCta: universalActionSchema,
    secondaryCta: universalActionSchema.optional(),
    mediaAlt: textSchema.optional(),
  }),
  sections: z.array(universalSectionSchema).min(1),
  ctas: z.object({
    final: universalCtaSchema,
  }).optional(),
  pages: z.array(z.object({
    path: nonEmptyStringSchema,
    template: z.enum(["landing", "service-index"]).default("landing"),
    sections: z.array(nonEmptyStringSchema).default([]),
  })).min(1),
});

export const UniversalSiteSchema = universalSiteSchema;

export const websiteSchema = z
  .object({
    schemaVersion: nonEmptyStringSchema.default("1.0"),
    business: businessSchema,
    brand: brandSchema.prefault({}),
    contact: contactSchema.default({}),
    locations: z.array(locationSchema).default([]),
    hours: hoursSchema.prefault({}),
    hero: heroSchema.optional(),
    about: contentSectionSchema.optional(),
    mission: contentSectionSchema.optional(),
    services: z.array(serviceSchema).default([]),
    products: z.array(productSchema).default([]),
    pricing: pricingSchema.prefault({}),
    faq: z.array(faqItemSchema).default([]),
    reviews: z.array(reviewSchema).default([]),
    testimonials: z.array(reviewSchema).default([]),
    gallery: z.array(imageSchema).default([]),
    videos: z.array(videoSchema).default([]),
    team: z
      .object({
        intro: textSchema.optional(),
        members: z.array(teamMemberSchema).default([]),
      })
      .strict()
      .prefault({}),
    careers: careersSchema.prefault({}),
    forms: z.array(formSchema).default([]),
    appointments: appointmentsSchema.prefault({}),
    reservations: reservationsSchema.prefault({}),
    menus: z.array(menuSchema).default([]),
    insurance: insuranceSchema.prefault({}),
    specialties: z.array(nonEmptyStringSchema).default([]),
    amenities: z.array(nonEmptyStringSchema).default([]),
    events: z.array(datedContentSchema).default([]),
    news: z.array(datedContentSchema).default([]),
    blog: z.array(datedContentSchema).default([]),
    promotions: z.array(promotionSchema).default([]),
    socialLinks: z.array(socialLinkSchema).default([]),
    seo: seoSchema.prefault({}),
    analytics: analyticsSchema.prefault({}),
    legal: legalSchema.prefault({}),
    accessibility: accessibilitySchema.prefault({}),
    template: templateSchema.prefault({}),
    theme: themeSchema.prefault({}),
    customSections: metadataSchema.default({}),
  })
  .strict();

export type WebsiteData = z.infer<typeof websiteSchema>;
export type WebsiteDataInput = z.input<typeof websiteSchema>;
export type Business = z.infer<typeof businessSchema>;
export type Brand = z.infer<typeof brandSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Hours = z.infer<typeof hoursSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type ContentSection = z.infer<typeof contentSectionSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Product = z.infer<typeof productSchema>;
export type Pricing = z.infer<typeof pricingSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type Careers = z.infer<typeof careersSchema>;
export type Form = z.infer<typeof formSchema>;
export type Appointments = z.infer<typeof appointmentsSchema>;
export type Reservations = z.infer<typeof reservationsSchema>;
export type Menu = z.infer<typeof menuSchema>;
export type Insurance = z.infer<typeof insuranceSchema>;
export type Promotion = z.infer<typeof promotionSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type Analytics = z.infer<typeof analyticsSchema>;
export type Legal = z.infer<typeof legalSchema>;
export type Accessibility = z.infer<typeof accessibilitySchema>;
export type Template = z.infer<typeof templateSchema>;
export type UniversalSite = z.infer<typeof universalSiteSchema>;
export type UniversalSection = UniversalSite["sections"][number];
export type UniversalAction = z.infer<typeof universalActionSchema>;
export type Theme = z.infer<typeof themeSchema>;

export interface WebsiteValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly path: readonly PropertyKey[];
}

export interface WebsiteValidationErrorOptions {
  readonly issues?: readonly WebsiteValidationIssue[];
  readonly source?: "schema" | "yaml";
  readonly cause?: unknown;
}

export class WebsiteValidationError extends Error {
  readonly issues: readonly WebsiteValidationIssue[];
  readonly source: "schema" | "yaml";
  readonly formatted: string;

  constructor(
    message: string,
    {
      issues = [],
      source = "schema",
      cause,
    }: WebsiteValidationErrorOptions = {},
  ) {
    super(message, { cause });
    this.name = "WebsiteValidationError";
    this.issues = issues;
    this.source = source;
    this.formatted =
      issues.length > 0 ? formatWebsiteValidationIssues(issues) : message;
  }
}

export type WebsiteValidationResult =
  | { readonly success: true; readonly data: WebsiteData }
  | { readonly success: false; readonly error: WebsiteValidationError };

export function validateWebsiteData(data: unknown): WebsiteData {
  const result = websiteSchema.safeParse(data);

  if (!result.success) {
    throw new WebsiteValidationError("Website data is invalid.", {
      issues: result.error.issues,
      source: "schema",
      cause: result.error,
    });
  }

  return result.data;
}

export function safeValidateWebsiteData(
  data: unknown,
): WebsiteValidationResult {
  try {
    return { success: true, data: validateWebsiteData(data) };
  } catch (error) {
    return { success: false, error: toWebsiteValidationError(error) };
  }
}

export function parseWebsiteYaml(yaml: string): WebsiteData {
  let parsed: unknown;

  try {
    parsed = parseYaml(yaml);
  } catch (error) {
    throw new WebsiteValidationError(
      `Website YAML could not be parsed: ${getErrorMessage(error)}`,
      { source: "yaml", cause: error },
    );
  }

  return validateWebsiteData(parsed);
}

export function parseUniversalSite(yaml: string, sourcePath = "website.yaml"): UniversalSite {
  let parsed: unknown;

  try {
    parsed = parseYaml(yaml);
  } catch (error) {
    throw new Error(
      `Invalid universal site YAML in ${sourcePath}: ${getErrorMessage(error)}`,
      { cause: error },
    );
  }

  const result = universalSiteSchema.safeParse(parsed);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${formatPath(issue.path)}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid universal site YAML in ${sourcePath}: ${details}`);
  }

  return result.data;
}

export function safeParseWebsiteYaml(yaml: string): WebsiteValidationResult {
  try {
    return { success: true, data: parseWebsiteYaml(yaml) };
  } catch (error) {
    return { success: false, error: toWebsiteValidationError(error) };
  }
}

export function formatWebsiteValidationError(
  error: z.ZodError<unknown>,
): string {
  return formatWebsiteValidationIssues(error.issues);
}

export function formatWebsiteValidationIssues(
  issues: readonly WebsiteValidationIssue[],
): string {
  if (issues.length === 0) {
    return "Website data is invalid, but no validation issues were reported.";
  }

  const lines = issues.map(
    (issue) =>
      `- ${formatPath(issue.path)}: ${issue.message} (${issue.code})`,
  );

  return [
    "Website data is invalid:",
    ...lines,
    "",
    "AI YAML tips:",
    "- Use a YAML mapping/object at the root.",
    "- Use two-space indentation and '-' list items for arrays.",
    "- Put unsupported or experimental sections under customSections.",
  ].join("\n");
}

function formatPath(path: readonly PropertyKey[]): string {
  if (path.length === 0) {
    return "<root>";
  }

  return path
    .map((segment, index) => {
      if (typeof segment === "number") {
        return `[${segment}]`;
      }

      if (typeof segment === "symbol") {
        return index === 0 ? segment.toString() : `.${segment.toString()}`;
      }

      return index === 0 ? segment : `.${segment}`;
    })
    .join("");
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
}

function toWebsiteValidationError(error: unknown): WebsiteValidationError {
  if (error instanceof WebsiteValidationError) {
    return error;
  }

  return new WebsiteValidationError(getErrorMessage(error), { cause: error });
}
