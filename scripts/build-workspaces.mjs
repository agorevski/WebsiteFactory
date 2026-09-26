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
    npmCommand,
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

export function selectWorkspaceBuildClosure(workspaces, names = []) {
  if (names.length === 0) {
    return workspaces;
  }

  const byName = new Map(workspaces.map((workspace) => [workspace.name, workspace]));
  const selected = new Set();

  function include(name) {
    if (selected.has(name)) {
      return;
    }

    const workspace = byName.get(name);
    if (!workspace) {
      throw new Error(`Unknown buildable workspace "${name}". Available: ${[...byName.keys()].sort().join(', ')}`);
    }

    selected.add(name);
    for (const dependency of workspace.dependencies) {
      if (byName.has(dependency)) {
        include(dependency);
      }
    }
  }

  names.forEach(include);
  return workspaces.filter((workspace) => selected.has(workspace.name));
}

export function parseBuildArguments(args) {
  const workspaces = [];
  let dryRun = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--dry-run') {
      dryRun = true;
    } else if (argument === '--workspace' || argument.startsWith('--workspace=')) {
      const name = argument === '--workspace' ? args[++index] : argument.slice('--workspace='.length);
      if (!name || name.startsWith('-')) {
        throw new Error('--workspace requires a package name.');
      }
      workspaces.push(name);
    } else {
      throw new Error(`Unknown build argument "${argument}". Use --workspace <package-name> and/or --dry-run.`);
    }
  }

  return { workspaces, dryRun };
}

export async function main(rootDir = defaultRoot, args = process.argv.slice(2)) {
  const options = parseBuildArguments(args);
  const workspaces = await discoverBuildableWorkspaces(rootDir);
  const layers = createWorkspaceBuildLayers(selectWorkspaceBuildClosure(workspaces, options.workspaces));

  if (layers.length === 0) {
    console.log('No buildable workspaces found.');
    return 0;
  }

  if (options.dryRun) {
    for (const [index, layer] of layers.entries()) {
      console.log(`Layer ${index + 1}: ${layer.map((workspace) => workspace.name).join(', ')}`);
    }
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

export function resolveNpmInvocation({
  npmCommand,
  npmCliPath = process.env.npm_execpath,
  nodePath = process.execPath,
  platform = process.platform,
} = {}) {
  if (npmCommand) {
    return { command: npmCommand, args: [] };
  }

  const bundledCli = join(dirname(nodePath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  const cliPath = npmCliPath || (existsSync(bundledCli) ? bundledCli : undefined);

  // Execute npm's JavaScript entry point, not a Windows .cmd shim.
  if (cliPath) {
    return { command: nodePath, args: [cliPath] };
  }

  if (platform === 'win32') {
    throw new Error('Cannot locate npm-cli.js. Run the build through "npm run build".');
  }

  return { command: 'npm', args: [] };
}

function runWorkspaceBuild(workspace, { rootDir, npmCommand, stdout, stderr }) {
  const invocation = resolveNpmInvocation({ npmCommand });

  return new Promise((resolveResult) => {
    const child = spawn(invocation.command, [...invocation.args, 'run', 'build', '--workspace', workspace.name], {
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
