import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createWorkspaceBuildLayers,
  discoverBuildableWorkspaces,
  parseBuildArguments,
  resolveNpmInvocation,
  runWorkspaceBuildLayers,
  selectWorkspaceBuildClosure,
} from './build-workspaces.mjs';

test('discovers buildable workspaces and groups them into dependency layers', async () => {
  const root = await createWorkspaceFixture({
    'packages/schema': {
      name: '@website-factory/schema',
      scripts: { build: 'tsc -p tsconfig.json' },
    },
    'packages/themes': {
      name: '@website-factory/themes',
      scripts: { build: 'tsc -p tsconfig.json' },
    },
    'packages/components': {
      name: '@website-factory/components',
      scripts: { build: 'tsc -p tsconfig.json' },
      dependencies: {
        '@website-factory/schema': '0.1.0',
        '@website-factory/themes': '0.1.0',
      },
    },
    'packages/templates': {
      name: '@website-factory/templates',
      scripts: { build: 'tsc -p tsconfig.json' },
      dependencies: {
        '@website-factory/components': '0.1.0',
        '@website-factory/schema': '0.1.0',
        '@website-factory/themes': '0.1.0',
      },
    },
    'apps/website-builder': {
      name: '@website-factory/website-builder',
      scripts: { build: 'astro build' },
      dependencies: {
        '@website-factory/schema': '0.1.0',
        '@website-factory/templates': '0.1.0',
        '@website-factory/themes': '0.1.0',
      },
    },
  });

  try {
    const workspaces = await discoverBuildableWorkspaces(root);
    const layers = createWorkspaceBuildLayers(workspaces);

    assert.deepEqual(layerNames(layers), [
      ['@website-factory/schema', '@website-factory/themes'],
      ['@website-factory/components'],
      ['@website-factory/templates'],
      ['@website-factory/website-builder'],
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('skips workspaces without build scripts', async () => {
  const root = await createWorkspaceFixture({
    'packages/schema': {
      name: '@website-factory/schema',
      scripts: { build: 'tsc -p tsconfig.json' },
    },
    'packages/docs-only': {
      name: '@website-factory/docs-only',
    },
  });

  try {
    const workspaces = await discoverBuildableWorkspaces(root);

    assert.deepEqual(workspaces.map((workspace) => workspace.name), ['@website-factory/schema']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('rejects circular internal build dependencies', async () => {
  const root = await createWorkspaceFixture({
    'packages/alpha': {
      name: '@website-factory/alpha',
      scripts: { build: 'tsc -p tsconfig.json' },
      dependencies: {
        '@website-factory/beta': '0.1.0',
      },
    },
    'packages/beta': {
      name: '@website-factory/beta',
      scripts: { build: 'tsc -p tsconfig.json' },
      dependencies: {
        '@website-factory/alpha': '0.1.0',
      },
    },
  });

  try {
    const workspaces = await discoverBuildableWorkspaces(root);

    assert.throws(
      () => createWorkspaceBuildLayers(workspaces),
      /Circular workspace build dependencies: @website-factory\/alpha, @website-factory\/beta/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('targeted builds include transitive dependencies but exclude unrelated workspaces', () => {
  const workspaces = [
    { name: 'schema', dependencies: [] },
    { name: 'components', dependencies: ['schema'] },
    { name: 'generator', dependencies: ['schema', 'components'] },
    { name: 'app', dependencies: ['components'] },
  ];
  const selected = selectWorkspaceBuildClosure(workspaces, ['generator', 'generator']);
  assert.deepEqual(layerNames(createWorkspaceBuildLayers(selected)), [
    ['schema'], ['components'], ['generator'],
  ]);
  assert.deepEqual(selectWorkspaceBuildClosure(workspaces), workspaces);
  assert.deepEqual(selectWorkspaceBuildClosure(workspaces, ['generator', 'app']), workspaces);
  assert.throws(() => selectWorkspaceBuildClosure(workspaces, ['missing']), /Unknown buildable workspace "missing"/);
  assert.throws(() => selectWorkspaceBuildClosure([], ['missing']), /Unknown buildable workspace/);
});

test('targeted build selection preserves cycle detection', () => {
  const selected = selectWorkspaceBuildClosure([
    { name: 'alpha', dependencies: ['beta'] },
    { name: 'beta', dependencies: ['alpha'] },
  ], ['alpha']);
  assert.throws(() => createWorkspaceBuildLayers(selected), /Circular workspace build dependencies/);
});

test('parses repeatable workspace selection and dry runs, rejecting malformed arguments', () => {
  assert.deepEqual(parseBuildArguments(['--workspace', 'schema', '--workspace=themes', '--dry-run']), {
    workspaces: ['schema', 'themes'], dryRun: true,
  });
  assert.deepEqual(parseBuildArguments([]), { workspaces: [], dryRun: false });
  for (const args of [['--workspace'], ['--workspace='], ['--workspace', '--dry-run'], ['--unknown']]) {
    assert.throws(() => parseBuildArguments(args), /requires a package name|Unknown build argument/);
  }
});

test('executes npm through Node without a shell, preserving paths with spaces', () => {
  assert.deepEqual(resolveNpmInvocation({
    npmCliPath: 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
    nodePath: 'C:\\Program Files\\nodejs\\node.exe',
    platform: 'win32',
  }), {
    command: 'C:\\Program Files\\nodejs\\node.exe',
    args: ['C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js'],
  });
});

test('honors an explicit build command', () => {
  assert.deepEqual(resolveNpmInvocation({ npmCommand: process.execPath }), {
    command: process.execPath,
    args: [],
  });
});

test('runs workspace builds through npm and skips dependents after a build failure', async () => {
  const root = await createWorkspaceFixture({
    'packages/alpha': {
      name: '@website-factory/alpha',
      scripts: { build: 'node -e "console.log(\'alpha-built\')"' },
    },
    'packages/beta': {
      name: '@website-factory/beta',
      scripts: { build: 'node -e "console.error(\'beta-failed\'); process.exit(7)"' },
      dependencies: { '@website-factory/alpha': '0.1.0' },
    },
    'packages/gamma': {
      name: '@website-factory/gamma',
      scripts: { build: 'node -e "console.log(\'gamma-built\')"' },
      dependencies: { '@website-factory/beta': '0.1.0' },
    },
  });
  const output = [];
  const stream = { write: (message) => output.push(message) };

  try {
    const layers = createWorkspaceBuildLayers(await discoverBuildableWorkspaces(root));
    const exitCode = await runWorkspaceBuildLayers(layers, {
      rootDir: root,
      stdout: stream,
      stderr: stream,
    });

    assert.notEqual(exitCode, 0);
    assert.match(output.join(''), /\[alpha\] alpha-built/);
    assert.match(output.join(''), /\[beta\] beta-failed/);
    assert.doesNotMatch(output.join(''), /gamma-built|Building layer 3/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('stops dependent layers and reports child-process launch failures', async () => {
  const root = await createWorkspaceFixture({});
  const output = [];
  const stream = { write: (message) => output.push(message) };

  try {
    const exitCode = await runWorkspaceBuildLayers([
      [{ name: '@website-factory/schema' }],
      [{ name: '@website-factory/app' }],
    ], {
      rootDir: root,
      npmCommand: join(root, 'missing-npm-command'),
      stdout: stream,
      stderr: stream,
    });

    assert.notEqual(exitCode, 0);
    assert.match(output.join(''), /ENOENT/);
    assert.match(output.join(''), /skipping remaining layers/);
    assert.doesNotMatch(output.join(''), /Building layer 2/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

async function createWorkspaceFixture(workspacePackages) {
  const root = await mkdtemp(join(tmpdir(), 'website-factory-build-workspaces-'));
  await writeJson(join(root, 'package.json'), {
    private: true,
    workspaces: [
      'packages/*',
      'apps/*',
    ],
  });

  await Promise.all(Object.entries(workspacePackages).map(async ([workspacePath, packageJson]) => {
    const workspaceDir = join(root, workspacePath);
    await mkdir(workspaceDir, { recursive: true });
    await writeJson(join(workspaceDir, 'package.json'), packageJson);
  }));

  return root;
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
  assert.equal(JSON.parse(await readFile(file, 'utf8')).name ?? true, value.name ?? true);
}

function layerNames(layers) {
  return layers.map((layer) => layer.map((workspace) => workspace.name));
}
