#!/usr/bin/env node
// Entry point for the `ventix` CLI. Conforms to ADR-0022 (no oclif in Phase 0).
// Uses `tsx` to run TypeScript directly — no build step.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const tsxBin = require.resolve('tsx/cli');
const cliEntry = join(__dirname, '..', 'src', 'index.ts');

const child = spawn(process.execPath, [tsxBin, cliEntry, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));
