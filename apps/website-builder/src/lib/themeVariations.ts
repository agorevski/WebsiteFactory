import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { getTemplate, isTemplateId, type TemplateId, type WebsiteTemplate } from '@website-factory/templates';
import { isThemeName, type ThemeName } from '@website-factory/themes';
import { parse } from 'yaml';
import { parseUniversalSite, type UniversalSite } from './schema.ts';

const workspaceSuffix = `${sep}apps${sep}website-builder`;
const currentWorkingDirectory = process.cwd();
const repositoryRoot = process.env.WEBSITE_FACTORY_ROOT
  ?? (currentWorkingDirectory.endsWith(workspaceSuffix)
    ? resolve(currentWorkingDirectory, '../..')
    : currentWorkingDirectory);
const examplesRoot = resolve(repositoryRoot, 'examples');

const variationIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const palettes = new Set<UniversalSite['theme']['palette']>(['clinic', 'trade', 'hospitality', 'professional']);
const modes = new Set<UniversalSite['theme']['mode']>(['light', 'dark']);
const radii = new Set<UniversalSite['theme']['radius']>(['soft', 'rounded', 'crisp']);

export interface ThemeVariationTheme {
  readonly name: ThemeName;
  readonly palette: UniversalSite['theme']['palette'];
  readonly mode: UniversalSite['theme']['mode'];
  readonly radius: UniversalSite['theme']['radius'];
}

export interface ThemeVariation {
  readonly id: string;
  readonly label: string;
  readonly template: WebsiteTemplate;
  readonly theme: ThemeVariationTheme;
  readonly rationale: string;
}

export interface ThemeVariationGroup {
  readonly business: string;
  readonly sourcePath: string;
  readonly manifestPath: string;
  readonly site: UniversalSite;
  readonly variations: readonly ThemeVariation[];
}

async function getThemeVariationFiles(directory = examplesRoot): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return getThemeVariationFiles(entryPath);
    }

    if (entry.isFile() && entry.name === 'theme-variations.yaml') {
      return [entryPath];
    }

    return [];
  }));

  return files.flat().sort((left, right) => left.localeCompare(right));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readText(record: Record<string, unknown>, key: string, context: string): string {
  const value = record[key];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${context} must define a non-empty ${key} string.`);
  }

  return value.trim();
}

function readTheme(record: Record<string, unknown>, context: string): ThemeVariationTheme {
  const rawTheme = record.theme;

  if (!isRecord(rawTheme)) {
    throw new Error(`${context} must define a theme block.`);
  }

  const name = readText(rawTheme, 'name', `${context}.theme`);
  const palette = readText(rawTheme, 'palette', `${context}.theme`);
  const mode = readText(rawTheme, 'mode', `${context}.theme`);
  const radius = readText(rawTheme, 'radius', `${context}.theme`);

  if (!isThemeName(name)) {
    throw new Error(`${context}.theme.name must be a registered theme name. Received "${name}".`);
  }

  if (!palettes.has(palette as UniversalSite['theme']['palette'])) {
    throw new Error(`${context}.theme.palette must be one of clinic, trade, hospitality, or professional.`);
  }

  if (!modes.has(mode as UniversalSite['theme']['mode'])) {
    throw new Error(`${context}.theme.mode must be light or dark.`);
  }

  if (!radii.has(radius as UniversalSite['theme']['radius'])) {
    throw new Error(`${context}.theme.radius must be soft, rounded, or crisp.`);
  }

  return {
    name,
    palette: palette as UniversalSite['theme']['palette'],
    mode: mode as UniversalSite['theme']['mode'],
    radius: radius as UniversalSite['theme']['radius'],
  };
}

function readVariation(value: unknown, context: string): ThemeVariation {
  if (!isRecord(value)) {
    throw new Error(`${context} must be an object.`);
  }

  const id = readText(value, 'id', context);
  const label = readText(value, 'label', context);
  const templateId = readText(value, 'template', context);
  const theme = readTheme(value, context);
  const rationale = readText(value, 'rationale', context);

  if (!variationIdPattern.test(id)) {
    throw new Error(`${context}.id must be lowercase kebab-case.`);
  }

  if (!isTemplateId(templateId)) {
    throw new Error(`${context}.template must be a registered template ID. Received "${templateId}".`);
  }

  return {
    id,
    label,
    template: getTemplate(templateId as TemplateId),
    theme,
    rationale,
  };
}

async function readThemeVariationGroup(manifestPath: string): Promise<ThemeVariationGroup> {
  const manifest = parse(await readFile(manifestPath, 'utf8')) as unknown;

  if (!isRecord(manifest)) {
    throw new Error(`${manifestPath} must contain a theme variation manifest object.`);
  }

  const business = readText(manifest, 'business', manifestPath);
  const source = readText(manifest, 'source', manifestPath);
  const rawVariations = manifest.variations;

  if (!Array.isArray(rawVariations) || rawVariations.length !== 5) {
    throw new Error(`${manifestPath} must define exactly five variations.`);
  }

  const seenIds = new Set<string>();
  const variations = rawVariations.map((variation, index) => {
    const resolvedVariation = readVariation(variation, `${manifestPath}.variations[${index}]`);

    if (seenIds.has(resolvedVariation.id)) {
      throw new Error(`${manifestPath} contains duplicate variation id "${resolvedVariation.id}".`);
    }

    seenIds.add(resolvedVariation.id);
    return resolvedVariation;
  });

  const sourcePath = resolve(dirname(manifestPath), source);
  const site = parseUniversalSite(await readFile(sourcePath, 'utf8'), sourcePath);

  if (site.slug !== business) {
    throw new Error(`${manifestPath} business "${business}" must match source site slug "${site.slug}".`);
  }

  return {
    business,
    sourcePath,
    manifestPath,
    site,
    variations,
  };
}

export async function getExampleThemeVariationGroups(directory = examplesRoot): Promise<ThemeVariationGroup[]> {
  const files = await getThemeVariationFiles(directory);
  const groups = await Promise.all(files.map(readThemeVariationGroup));

  return groups.sort((left, right) => left.site.business.name.localeCompare(right.site.business.name));
}

export function applyThemeVariation(site: UniversalSite, variation: ThemeVariation): UniversalSite {
  return {
    ...site,
    theme: { ...variation.theme },
  };
}
