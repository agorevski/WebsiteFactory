import { readdir, readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { parseUniversalSite, type UniversalSite } from './schema';

const workspaceSuffix = `${sep}apps${sep}website-builder`;
const currentWorkingDirectory = process.cwd();
const repositoryRoot = process.env.WEBSITE_FACTORY_ROOT
  ?? (currentWorkingDirectory.endsWith(workspaceSuffix)
    ? resolve(currentWorkingDirectory, '../..')
    : currentWorkingDirectory);
const examplesRoot = resolve(repositoryRoot, 'examples');

async function getExampleFiles(): Promise<string[]> {
  const entries = await readdir(examplesRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => resolve(examplesRoot, entry.name, 'website.yaml'));
}

export async function getExampleSites(): Promise<UniversalSite[]> {
  const files = await getExampleFiles();
  const sites = await Promise.all(files.map(async (filePath) => {
    const source = await readFile(filePath, 'utf8');
    return parseUniversalSite(source, filePath);
  }));

  return sites.sort((left, right) => left.business.name.localeCompare(right.business.name));
}

export async function getExampleSite(slug: string): Promise<UniversalSite | undefined> {
  const sites = await getExampleSites();
  return sites.find((site) => site.slug === slug);
}
