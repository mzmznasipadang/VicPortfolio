// Local preview of the static export, with the same /uptime/* proxy production gets from Caddy.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = new URL('../dist/client/', import.meta.url).pathname;
const port = Number(process.env.PORT ?? 4173);
const kuma = 'https://uptime.naspadstudio.id/api/status-page';
const proxied = { '/uptime/monitors': `${kuma}/naspadstudio`, '/uptime/heartbeat': `${kuma}/heartbeat/naspadstudio` };
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (proxied[path]) {
    try {
      const upstream = await fetch(proxied[path]);
      res.writeHead(upstream.status, { 'content-type': 'application/json' }).end(await upstream.text());
    } catch {
      res.writeHead(502).end();
    }
    return;
  }
  // normalize + prefix check keeps requests inside dist/client
  let file = normalize(join(root, path));
  if (!file.startsWith(root)) return res.writeHead(403).end();
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { file = join(root, '404.html'); }
  try {
    res.writeHead(file.endsWith('404.html') && !path.endsWith('404.html') ? 404 : 200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
}).listen(port, () => console.log(`Preview on http://localhost:${port}`));
