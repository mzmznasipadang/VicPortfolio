import assert from 'node:assert/strict';
import { isUtf8 } from 'node:buffer';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const privateKey = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
const secretAssignment = /\b(?:(?:api|auth|access|secret|private)[_-]?(?:key|token)|pass(?:word|wd))['"]?\s*[:=]\s*(?:['"`](?!(?:process\.env|import\.meta\.env)\b)[^'"`]+['"`]|(?![/\s#;]|(?:process\.env|import\.meta\.env)\b)[^\s#;]+)/i;

export const hasSecretExposure = (source) => privateKey.test(source) || secretAssignment.test(source);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
  const textFiles = tracked.map((file) => [file, readFileSync(file)]).filter(([, content]) => isUtf8(content));

  assert.ok(!tracked.some((file) => /(^|\/)\.env($|\.)/.test(file)), 'Do not commit dotenv files');
  assert.ok(!textFiles.some(([, content]) => hasSecretExposure(content.toString('utf8'))), 'Do not commit private keys');
}
