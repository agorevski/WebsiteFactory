import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createWorkspaceBuildLayers,
  discoverBuildableWorkspaces,
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
