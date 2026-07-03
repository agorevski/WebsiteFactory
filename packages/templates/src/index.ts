export type {
  SchemaSectionReference,
  SchemaSectionType,
  TemplateAudience,
  TemplateCompositionInput,
  TemplateLayout,
  TemplatePageDefinition,
  TemplateResolvedSection,
  TemplateSectionDefinition,
  TemplateSlot,
  WebsiteTemplate
} from './types.js';
export { templates } from './templates.js';
export type { TemplateId } from './templates.js';
export {
  composeTemplate,
  defaultTemplateId,
  findTemplateSectionsBySchemaType,
  getTemplate,
  getTemplateSection,
  isTemplateId,
  listTemplates,
  resolveTemplate,
  schemaSectionsFromWebsiteData,
  validateTemplateComposition
} from './registry.js';
