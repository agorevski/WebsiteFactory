import type { WebsiteData } from '@website-factory/schema';
import { templates, type TemplateId } from './templates.js';
import type { SchemaSectionReference, TemplateCompositionInput, TemplateResolvedSection, TemplateSectionDefinition, WebsiteTemplate } from './types.js';

export const defaultTemplateId: TemplateId = 'modern';

export function listTemplates(): readonly WebsiteTemplate[] {
  return Object.values(templates);
}

export function isTemplateId(value: string): value is TemplateId {
  return Object.prototype.hasOwnProperty.call(templates, value);
}

export function getTemplate(id: TemplateId = defaultTemplateId): WebsiteTemplate {
  return templates[id];
}

export function resolveTemplate(id?: string): WebsiteTemplate {
  return id && isTemplateId(id) ? getTemplate(id) : getTemplate(defaultTemplateId);
}

export function getTemplateSection(templateId: TemplateId, sectionId: string): TemplateSectionDefinition | undefined {
  return getTemplate(templateId).sections.find((section) => section.id === sectionId);
}

export function findTemplateSectionsBySchemaType(templateId: TemplateId, schemaType: string): readonly TemplateSectionDefinition[] {
  return getTemplate(templateId).sections.filter((section) => section.schemaType === schemaType || section.acceptsSchemaVariants?.includes(schemaType));
}

const schemaSectionKeys = ['hero', 'services', 'pricing', 'faq', 'reviews', 'testimonials', 'gallery', 'team', 'hours', 'contact'] as const satisfies readonly (keyof WebsiteData)[];

function hasSchemaValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object' && value !== null) {
    return Object.values(value).some(hasSchemaValue);
  }

  return value !== undefined && value !== null && value !== '';
}

export function schemaSectionsFromWebsiteData(schema: WebsiteData): readonly SchemaSectionReference[] {
  const sections: SchemaSectionReference[] = [
    { id: 'nav', type: 'navigation', data: schema.business, source: 'business' },
    { id: 'footer', type: 'footer', data: schema.business, source: 'business' }
  ];

  if (schema.business.yearsInBusiness || schema.business.languages.length > 0) {
    sections.push({ id: 'trust', type: 'trustBadges', data: schema.business, source: 'business' });
  }

  if (schema.contact.emergencyPhone) {
    sections.push({ id: 'emergency', type: 'emergencyBanner', data: schema.contact, source: 'contact' });
  }

  for (const key of schemaSectionKeys) {
    const value = schema[key];

    if (hasSchemaValue(value)) {
      sections.push({ id: key, type: key, data: value, source: key });
    }
  }

  return sections;
}

function inputSchemaSections(input: TemplateCompositionInput): readonly SchemaSectionReference[] {
  if (input.sections) {
    return input.sections;
  }

  if (input.schema) {
    return schemaSectionsFromWebsiteData(input.schema);
  }

  return [];
}

function findMatchingSchemaSection(definition: TemplateSectionDefinition, schemaSections: readonly SchemaSectionReference[]): SchemaSectionReference | undefined {
  return schemaSections.find((section) => {
    if (section.id && section.id === definition.id) {
      return true;
    }

    return section.type === definition.schemaType || definition.acceptsSchemaVariants?.includes(section.type) === true;
  });
}

export function composeTemplate(input: TemplateCompositionInput = {}): readonly TemplateResolvedSection[] {
  const template = resolveTemplate(input.templateId);
  const schemaSections = inputSchemaSections(input);

  return template.sections.map((definition) => {
    const schemaSection = findMatchingSchemaSection(definition, schemaSections);

    if (schemaSection) {
      return { definition, schemaSection };
    }

    return { definition };
  });
}

export function validateTemplateComposition(input: TemplateCompositionInput = {}): { readonly valid: boolean; readonly missingRequiredSections: readonly TemplateSectionDefinition[] } {
  const template = resolveTemplate(input.templateId);
  const schemaSections = inputSchemaSections(input);
  const missingRequiredSections = template.sections.filter((definition) => definition.required && !findMatchingSchemaSection(definition, schemaSections));

  return {
    valid: missingRequiredSections.length === 0,
    missingRequiredSections
  };
}
