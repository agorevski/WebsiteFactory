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
} from './types';
export { templates } from './templates';
export type { TemplateId } from './templates';
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
} from './registry';
