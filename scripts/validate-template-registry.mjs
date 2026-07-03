#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const packageEntries = [
  join(root, 'packages/themes/dist/index.js'),
  join(root, 'packages/templates/dist/index.js'),
];
const knownSectionComponentNames = new Set([
  'Hero',
  'Navigation',
  'Contact',
  'Services',
  'FAQ',
  'Testimonials',
  'Gallery',
  'Team',
  'Pricing',
  'Footer',
  'Breadcrumbs',
  'TrustBadges',
  'Hours',
  'EmergencyBanner',
]);
let workspaceBuildReady = false;

export function validateTemplateRegistry({ templates, themeIds, componentNames }) {
  const issues = [];
  const templateIds = new Set();
  const rhythms = new Map();

  for (const template of templates) {
    const templatePath = `templates.${template.id}`;

    if (templateIds.has(template.id)) {
      issues.push(createIssue('template.duplicate-id', 'error', `Template ID "${template.id}" is duplicated.`, templatePath));
    }
    templateIds.add(template.id);

    if (!themeIds.has(template.defaultTheme)) {
      issues.push(createIssue('template.default-theme.invalid', 'error', `Template "${template.id}" references unknown default theme "${template.defaultTheme}".`, `${templatePath}.defaultTheme`));
    }

    if (!Array.isArray(template.tags) || template.tags.length === 0 || template.tags.some((tag) => typeof tag !== 'string' || tag.trim() === '')) {
      issues.push(createIssue('template.tags.empty', 'error', `Template "${template.id}" must define at least one non-empty tag.`, `${templatePath}.tags`));
    }

    validateSections(template, componentNames, issues, templatePath);

    const rhythm = rhythmSignature(template);
    const existingRhythm = rhythms.get(rhythm);
    if (existingRhythm || issues.some((issue) => issue.code === 'template.duplicate-id' && issue.path === templatePath)) {
      issues.push(createIssue(
        'template.near-duplicate-rhythm',
        'warning',
        existingRhythm
          ? `Template "${template.id}" has the same section rhythm as "${existingRhythm}".`
          : `Template "${template.id}" duplicates an existing template ID and should be reviewed for rhythm duplication.`,
        templatePath
      ));
    } else {
      rhythms.set(rhythm, template.id);
    }
  }

  return issues;
}

export async function runCli() {
  const { listTemplates } = await loadWorkspacePackage('templates');
  const { listThemes } = await loadWorkspacePackage('themes');
  const templates = listTemplates();
  const themeIds = new Set(listThemes().map((theme) => theme.id));
  const issues = validateTemplateRegistry({ templates, themeIds, componentNames: knownSectionComponentNames });

  for (const issue of issues) {
    console.log(`${issue.severity.toUpperCase()} ${issue.code} ${issue.path}: ${issue.message}`);
  }

  if (issues.length === 0) {
    console.log(`Template registry validation passed: ${templates.length} template(s).`);
  } else {
    console.log(`Template registry validation failed: ${issues.length} issue(s) across ${templates.length} template(s).`);
  }

  return issues.some((issue) => issue.severity === 'error') ? 1 : 0;
}

function validateSections(template, componentNames, issues, templatePath) {
  if (!Array.isArray(template.sections) || template.sections.length === 0) {
    issues.push(createIssue('template.sections.empty', 'error', `Template "${template.id}" must define sections.`, `${templatePath}.sections`));
    return;
  }

  const sectionIds = new Set();
  let previousOrder = Number.NEGATIVE_INFINITY;

  for (const [index, section] of template.sections.entries()) {
    const sectionPath = `${templatePath}.sections[${index}]`;

    if (sectionIds.has(section.id)) {
      issues.push(createIssue('template.section.duplicate-id', 'error', `Template "${template.id}" duplicates section ID "${section.id}".`, sectionPath));
    }
    sectionIds.add(section.id);

    if (typeof section.order !== 'number' || section.order <= previousOrder) {
      issues.push(createIssue('template.section.order.invalid', 'error', `Template "${template.id}" section "${section.id}" must have a strictly increasing order.`, `${sectionPath}.order`));
    }
    previousOrder = section.order;

    if (!componentNames.has(section.component)) {
      issues.push(createIssue('template.section.component.invalid', 'error', `Template "${template.id}" section "${section.id}" references unknown component "${section.component}".`, `${sectionPath}.component`));
    }
  }

  for (const requiredSchemaType of ['hero', 'contact', 'footer']) {
    if (!template.sections.some((section) => section.required && section.schemaType === requiredSchemaType)) {
      issues.push(createIssue('template.required-section.missing', 'error', `Template "${template.id}" must require a ${requiredSchemaType} section.`, `${templatePath}.sections`));
    }
  }
}

function rhythmSignature(template) {
  return template.sections
    .map((section) => `${section.slot}:${section.schemaType}:${section.component}:${section.variant}:${section.required ? 'required' : 'optional'}`)
    .join('|');
}

function createIssue(code, severity, message, path) {
  return { code, severity, message, path };
}

async function loadWorkspacePackage(name) {
  await ensureWorkspaceBuild();
  return import(pathToFileURL(join(root, `packages/${name}/dist/index.js`)).href);
}

async function ensureWorkspaceBuild() {
  if (workspaceBuildReady) {
    return;
  }

  const workspaces = packageEntries.every((entry) => existsSync(entry))
    ? ['@website-factory/templates']
    : ['@website-factory/schema', '@website-factory/themes', '@website-factory/components', '@website-factory/templates'];

  for (const workspace of workspaces) {
    const result = spawnSync('npm', ['run', 'build', '--workspace', workspace], {
      cwd: root,
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      throw new Error(`Failed to build ${workspace} before validating the template registry.`);
    }
  }

  workspaceBuildReady = true;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  runCli().then((exitCode) => {
    process.exitCode = exitCode;
  }, (error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
