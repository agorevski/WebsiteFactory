import type { SectionComponentName } from '@website-factory/components';
import type { Template as SchemaTemplate, WebsiteData } from '@website-factory/schema';
import type { ThemeName } from '@website-factory/themes';

export type TemplateLayout = 'single-page' | 'multi-page' | 'landing-page' | 'directory-ready';
export type TemplateSlot = 'header' | 'main' | 'footer' | 'utility';
export type TemplateAudience =
  | 'local-business'
  | 'medical'
  | 'restaurant'
  | 'professional-services'
  | 'hospitality'
  | 'one-page'
  | 'general';

export type SchemaSectionType =
  | Extract<keyof WebsiteData, 'hero' | 'services' | 'pricing' | 'faq' | 'reviews' | 'testimonials' | 'gallery' | 'team' | 'hours' | 'contact'>
  | 'navigation'
  | 'breadcrumbs'
  | 'trustBadges'
  | 'footer'
  | 'emergencyBanner';

export interface SchemaSectionReference<TData = unknown> {
  readonly id?: string;
  readonly type: SchemaSectionType | string;
  readonly data?: TData;
  readonly source?: keyof WebsiteData;
}

export interface TemplateSectionDefinition {
  readonly id: string;
  readonly schemaType: SchemaSectionType | string;
  readonly component: SectionComponentName;
  readonly variant: string;
  readonly slot: TemplateSlot;
  readonly order: number;
  readonly required: boolean;
  readonly repeatable?: boolean;
  readonly acceptsSchemaVariants?: readonly string[];
  readonly purpose?: string;
}

export interface TemplatePageDefinition {
  readonly path: string;
  readonly label: string;
  readonly sections: readonly string[];
}

export interface WebsiteTemplate {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly audience: TemplateAudience;
  readonly layout: TemplateLayout;
  readonly defaultTheme: ThemeName;
  readonly schemaTemplate?: SchemaTemplate;
  readonly sections: readonly TemplateSectionDefinition[];
  readonly pages?: readonly TemplatePageDefinition[];
  readonly tags: readonly string[];
}

export interface TemplateResolvedSection {
  readonly definition: TemplateSectionDefinition;
  readonly schemaSection?: SchemaSectionReference;
}

export interface TemplateCompositionInput {
  readonly templateId?: string;
  readonly schema?: WebsiteData;
  readonly sections?: readonly SchemaSectionReference[];
}
