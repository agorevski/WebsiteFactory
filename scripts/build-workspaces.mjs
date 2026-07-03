#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptFile = fileURLToPath(import.meta.url);
const defaultRoot = join(dirname(scriptFile), '..');

export async function discoverBuildableWorkspaces(rootDir = defaultRoot) {
  const rootPackage = await readPackageJson(join(rootDir, 'package.json'));
  const patterns = getWorkspacePatterns(rootPackage);
  const workspaceDirectories = await expandWorkspacePatterns(rootDir, patterns);
  const candidates = [];

  for (const directory of workspaceDirectories) {
    const manifestFile = join(directory, 'package.json');

    if (!existsSync(manifestFile)) {
      continue;
    }

    const manifest = await readPackageJson(manifestFile);

    if (!manifest.name) {
      throw new Error(`${formatPath(rootDir, manifestFile)} is missing a package name`);
    }

    if (!hasBuildScript(manifest)) {
      continue;
    }

    candidates.push({
      name: manifest.name,
      directory: formatPath(rootDir, directory),
      buildScript: manifest.scripts.build,
      dependencies: getDependencyNames(manifest),
    });
  }

  const buildableNames = new Set(candidates.map((workspace) => workspace.name));

  return candidates
    .map((workspace) => ({
      ...workspace,
      dependencies: workspace.dependencies.filter((dependency) => buildableNames.has(dependency)).sort(),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function createWorkspaceBuildLayers(workspaces) {
  const remaining = new Map(workspaces.map((workspace) => [
    workspace.name,
    {
      ...workspace,
      dependencies: workspace.dependencies.filter((dependency) => workspaces.some((candidate) => candidate.name === dependency)),
    },
  ]));
  const layers = [];

  while (remaining.size > 0) {
    const ready = [...remaining.values()]
      .filter((workspace) => workspace.dependencies.every((dependency) => !remaining.has(dependency)))
      .sort((left, right) => left.name.localeCompare(right.name));

    if (ready.length === 0) {
      throw new Error(`Circular workspace build dependencies: ${[...remaining.keys()].sort().join(', ')}`);
    }

    layers.push(ready);

    for (const workspace of ready) {
      remaining.delete(workspace.name);
    }
  }

  return layers;
}

export async function runWorkspaceBuildLayers(layers, options = {}) {
  const {
    rootDir = defaultRoot,
    npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm',
    stdout = process.stdout,
    stderr = process.stderr,
  } = options;

  for (let layerIndex = 0; layerIndex < layers.length; layerIndex += 1) {
    const layer = layers[layerIndex];
    stdout.write(`Building layer ${layerIndex + 1}/${layers.length}: ${layer.map((workspace) => workspace.name).join(', ')}\n`);

    const results = await Promise.all(layer.map((workspace) => runWorkspaceBuild(workspace, {
      rootDir,
      npmCommand,
      stdout,
      stderr,
    })));
    const failures = results.filter((result) => result.exitCode !== 0);

    if (failures.length > 0) {
      stderr.write(`Build failed for ${failures.map((failure) => failure.workspace.name).join(', ')}; skipping remaining layers.\n`);
      return failures[0]?.exitCode ?? 1;
    }
  }

  return 0;
}

export async function main(rootDir = defaultRoot) {
  const workspaces = await discoverBuildableWorkspaces(rootDir);
  const layers = createWorkspaceBuildLayers(workspaces);

  if (layers.length === 0) {
    console.log('No buildable workspaces found.');
    return 0;
  }

  return runWorkspaceBuildLayers(layers, { rootDir });
}

async function readPackageJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

function getWorkspacePatterns(rootPackage) {
  if (Array.isArray(rootPackage.workspaces)) {
    return rootPackage.workspaces;
  }

  if (Array.isArray(rootPackage.workspaces?.packages)) {
    return rootPackage.workspaces.packages;
  }

  throw new Error('Root package.json must define workspaces as an array or { "packages": [] }');
}

async function expandWorkspacePatterns(rootDir, patterns) {
  const directories = new Set();

  for (const pattern of patterns) {
    if (pattern.startsWith('!')) {
      continue;
    }

    for (const directory of await expandPatternSegments(rootDir, pattern.split('/').filter(Boolean))) {
      directories.add(directory);
    }
  }

  return [...directories].sort((left, right) => left.localeCompare(right));
}

async function expandPatternSegments(baseDir, segments) {
  if (segments.length === 0) {
    return [baseDir];
  }

  const [segment, ...remainingSegments] = segments;

  if (segment === '*') {
    let entries;

    try {
      entries = await readdir(baseDir, { withFileTypes: true });
    } catch (error) {
      if (error?.code === 'ENOENT') {
        return [];
      }

      throw error;
    }

    const nested = await Promise.all(entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => expandPatternSegments(join(baseDir, entry.name), remainingSegments)));

    return nested.flat();
  }

  if (segment.includes('*')) {
    throw new Error(`Unsupported workspace pattern segment "${segment}". Only full "*" path segments are supported.`);
  }

  return expandPatternSegments(join(baseDir, segment), remainingSegments);
}

function hasBuildScript(manifest) {
  return typeof manifest.scripts?.build === 'string' && manifest.scripts.build.length > 0;
}

function getDependencyNames(manifest) {
  const names = new Set();

  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    const dependencies = manifest[field];

    if (!dependencies || typeof dependencies !== 'object' || Array.isArray(dependencies)) {
      continue;
    }

    for (const dependency of Object.keys(dependencies)) {
      names.add(dependency);
    }
  }

  return [...names].sort();
}

function runWorkspaceBuild(workspace, { rootDir, npmCommand, stdout, stderr }) {
  return new Promise((resolveResult) => {
    const child = spawn(npmCommand, ['run', 'build', '--workspace', workspace.name], {
      cwd: rootDir,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const prefix = workspace.name.replace(/^@website-factory\//, '');
    const prefixStdout = createLinePrefixer(prefix, (line) => stdout.write(line));
    const prefixStderr = createLinePrefixer(prefix, (line) => stderr.write(line));

    child.stdout.on('data', (chunk) => prefixStdout.write(chunk));
    child.stderr.on('data', (chunk) => prefixStderr.write(chunk));
    child.on('error', (error) => {
      prefixStderr.write(`${error.message}\n`);
    });
    child.on('close', (exitCode, signal) => {
      prefixStdout.end();
      prefixStderr.end();

      if (signal) {
        stderr.write(`[${prefix}] exited from signal ${signal}\n`);
      }

      resolveResult({ workspace, exitCode: exitCode ?? 1 });
    });
  });
}

function createLinePrefixer(prefix, write) {
  let buffered = '';

  return {
    write(chunk) {
      buffered += chunk.toString();

      const lines = buffered.split(/\r?\n/);
      buffered = lines.pop() ?? '';

      for (const line of lines) {
        write(`[${prefix}] ${line}\n`);
      }
    },
    end() {
      if (buffered.length > 0) {
        write(`[${prefix}] ${buffered}\n`);
        buffered = '';
      }
    },
  };
}

function formatPath(rootDir, file) {
  return relative(rootDir, file).split(sep).join('/');
}

if (resolve(process.argv[1] ?? '') === scriptFile) {
  try {
    process.exitCode = await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
