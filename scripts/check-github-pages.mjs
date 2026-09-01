import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

assert.ok(existsSync(new URL('../dist/client/index.html', import.meta.url)), 'GitHub Pages export is missing index.html');
