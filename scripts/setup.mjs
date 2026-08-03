#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const applicationDirectory = resolve(scriptDirectory, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function fail(message) {
  console.error(`\nSetup failed: ${message}`);
  process.exit(1);
}

function supportsNode(version) {
  const [major, minor] = version.split('.').map(Number);
  return (
    (major === 20 && minor >= 19)
    || (major === 22 && minor >= 12)
    || major > 22
  );
}

function run(label, command, args) {
  console.log(`\n==> ${label}`);
  const result = spawnSync(command, args, {
    cwd: applicationDirectory,
    stdio: 'inherit',
    // Windows launches npm through npm.cmd; cmd.exe is required for that
    // wrapper, while Unix-like platforms execute npm directly.
    shell: process.platform === 'win32',
  });

  if (result.error) fail(`${label}: ${result.error.message}`);
  if (result.status !== 0) fail(`${label} exited with code ${result.status}.`);
}

console.log('Puratos Contact Us RJSF demo setup');
console.log(`Platform: ${process.platform} ${process.arch}`);
console.log(`Node.js:  ${process.version}`);

if (!supportsNode(process.versions.node)) {
  fail('Node.js ^20.19.0 or >=22.12.0 is required. Install a supported Node.js release and run this script again.');
}

if (!existsSync(resolve(applicationDirectory, 'package-lock.json'))) {
  fail('package-lock.json is missing; a reproducible installation cannot be performed.');
}

run('Checking npm', npmCommand, ['--version']);
run('Installing locked dependencies', npmCommand, ['ci', '--no-audit', '--no-fund']);
run('Checking known dependency vulnerabilities', npmCommand, ['audit', '--audit-level=low']);
run('Building the production bundle', npmCommand, ['run', 'build']);

console.log('\nSetup complete. Start the local application with: npm run dev');
