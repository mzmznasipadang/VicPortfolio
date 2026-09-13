import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const sourceFiles = tracked.filter((file) => /\.(?:[cm]?[jt]sx?|json|ya?ml)$/.test(file));
const privateKey = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
const secretAssignment = /\b(?:api|auth|access|secret|private)[_-]?(?:key|token)\s*[:=]\s*['"`][^'"`]+['"`]/i;

assert.ok(!tracked.some((file) => /(^|\/)\.env($|\.)/.test(file)), 'Do not commit dotenv files');
assert.ok(!sourceFiles.some((file) => privateKey.test(readFileSync(file, 'utf8')) || secretAssignment.test(readFileSync(file, 'utf8'))), 'Do not commit private keys');
