#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const executableName = process.platform === 'win32' ? 'lhci.cmd' : 'lhci';
const localLhci = join(root, 'node_modules', '.bin', executableName);
const lhciCommand = await fileExists(localLhci) ? localLhci : executableName;
const chromePath = process.env.CHROME_PATH || chromium.executablePath();

const child = spawn(lhciCommand, ['autorun', '--config=./lighthouserc.cjs', ...process.argv.slice(2)], {
  cwd: root,
  env: {
    ...process.env,
    CHROME_PATH: chromePath,
  },
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exitCode = code ?? 1;
});

child.on('error', (error) => {
  console.error(`Failed to start Lighthouse CI: ${error.message}`);
  process.exitCode = 1;
});

async function fileExists(path) {
  try {
    await access(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
