// Serveur local d'apercu : sert le site ET les fonctions /api comme sur Vercel.
//   npm run serve   puis ouvrir http://localhost:8080
//
// La cle Groq est lue dans .env.local (ignore par git). Elle n'est jamais affichee.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORT = Number(process.env.PORT) || 8080;

// Variables d'environnement : .env.local puis .env (sans ecraser celles deja definies)
for (const f of ['.env.local', '.env']) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    const v = m[2].replace(/^(['"])(.*)\1$/, '$2');
    if (v && process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

const API = { '/api/chat': 'api/chat.js', '/api/health': 'api/health.js' };
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
// Jamais servis : secrets, sources, copies d'origine, dependances
const BLOCKED = /^\/(?:\.|_originaux|node_modules|scripts|api|package|certs)|\.md$/i;

async function handleApi(req, res, file) {
  const mod = await import(pathToFileURL(path.join(ROOT, file)).href);
  const fn = mod[req.method];
  if (typeof fn !== 'function') { res.writeHead(405, { Allow: Object.keys(mod).filter(k => /^[A-Z]+$/.test(k)).join(', ') }); return res.end(); }
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
  headers.set('x-forwarded-for', req.headers['x-forwarded-for'] || req.socket.remoteAddress || '');
  const hasBody = !['GET', 'HEAD'].includes(req.method);
  const request = new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers, body: hasBody ? Readable.toWeb(req) : undefined, duplex: hasBody ? 'half' : undefined });
  const response = await fn(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}

function handleStatic(req, res) {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  if (BLOCKED.test(p) || !file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Introuvable');
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}

http.createServer(async (req, res) => {
  try {
    const route = API[new URL(req.url, 'http://x').pathname];
    if (route) return await handleApi(req, res, route);
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    handleStatic(req, res);
  } catch {
    console.error('[serveur] erreur interne');
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
}).listen(PORT, () => {
  console.log(`Apercu : http://localhost:${PORT}`);
  console.log(`Cle Groq : ${process.env.GROQ_API_KEY ? 'presente (lue dans .env.local)' : 'absente : les questions libres afficheront le message de secours'}`);
});
