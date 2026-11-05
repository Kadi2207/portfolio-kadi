// Controle de sante du site.  npm run check
//
// Echoue (code de sortie 1) si :
//   un lien est casse (lien interne, ancre, fichier local ou lien externe),
//   une image referencee manque,
//   un texte provisoire subsiste (LIEN_DEMO_TCIM, LIEN_..., GROQ_KEY, XXX, cle gsk_),
//   un tiret long, un tiret moyen, un point median ou un emoji non autorise apparait dans les textes du site,
//   /api/health ne repond pas.
//
// Options :
//   SITE_URL=https://ton-domaine.fr npm run check   controle aussi le site en ligne (page d'accueil, /api/health, cle presente)
//   npm run check -- --offline                       saute les liens externes (controle rapide sans internet)

import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const OFFLINE = process.argv.includes('--offline');
const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const problems = [];
const warnings = [];
const fail = m => problems.push(m);
const warn = m => warnings.push(m);
const step = m => console.log('\n' + m);

const html = read('index.html');
const app = read('app.js');
const kb = read('api/_lib/knowledge.js');

// 1. Syntaxe JavaScript et synchronisation du chatbot ------------------------------------
step('1. Syntaxe et chatbot');
for (const f of ['app.js', 'api/chat.js', 'api/health.js', 'api/_lib/knowledge.js', 'api/_lib/canned.js']) {
  const r = spawnSync(process.execPath, ['--check', path.join(ROOT, f)], { encoding: 'utf8' });
  if (r.status !== 0) fail(`erreur de syntaxe dans ${f}`);
}
const sync = spawnSync(process.execPath, [path.join(ROOT, 'scripts/sync-kb.mjs'), '--check'], { encoding: 'utf8' });
if (sync.status !== 0) fail('reponses predefinies non synchronisees : lance "npm run kb"');

// 2. Images ------------------------------------------------------------------------------
step('2. Images');
let manifest = {};
try { manifest = JSON.parse(read('images.json')).images; } catch { fail('images.json absent ou illisible : lance "npm run images"'); }
for (const [name, e] of Object.entries(manifest)) {
  for (const src of [e.src, e.sm].filter(Boolean)) if (!fs.existsSync(path.join(ROOT, src.split('?')[0]))) fail(`image du manifeste manquante : ${src.split('?')[0]} (${name})`);
}
const refs = new Set([
  ...[...html.matchAll(/data-img="([^"]+)"/g)].map(m => m[1]),
  ...[...app.matchAll(/\bimg:'([^']+)'/g)].map(m => m[1]),
  ...[...app.matchAll(/\bimgs:\[([^\]]*)\]/g)].flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1])),
]);
for (const r of refs) if (!manifest[r]) fail(`image referencee mais absente du manifeste : ${r}`);
for (let n = 1; n <= 4; n++) if (!manifest['parole-' + n]) warn(`badge Prise de parole ${n} sans photo (parole-${n})`);
if (!Object.keys(manifest).some(k => /^galerie-\d+$/.test(k))) warn('galerie vide');
console.log(`   ${Object.keys(manifest).length} images dans le manifeste, ${refs.size} references nommees`);

// 3. Liens internes, ancres et fichiers locaux --------------------------------------------
step('3. Liens internes');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
for (const m of html.matchAll(/href="#([^"]*)"/g)) if (m[1] && !ids.has(m[1])) fail(`ancre cassee : #${m[1]}`);
for (const m of html.matchAll(/(?:src|href)="(?!https?:|mailto:|data:|#)([^"?]+)/g)) {
  if (!fs.existsSync(path.join(ROOT, m[1]))) fail(`fichier local introuvable : ${m[1]}`);
}

// Referencement : canonical, sitemap, robots et JSON-LD pointent vers la meme adresse
const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
if (!canonical) fail('balise canonical absente : lance "npm run seo"');
else {
  const sitemap = fs.existsSync(path.join(ROOT, 'sitemap.xml')) ? read('sitemap.xml') : '';
  const robots = fs.existsSync(path.join(ROOT, 'robots.txt')) ? read('robots.txt') : '';
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) fail('sitemap.xml absent ou adresse differente de la canonical : lance "npm run seo"');
  if (!robots.includes(`Sitemap: ${canonical}sitemap.xml`)) fail('robots.txt absent ou adresse differente : lance "npm run seo"');
  if (!html.includes(`"url":"${canonical}"`)) fail('JSON-LD : url differente de la canonical : lance "npm run seo"');
  if (SITE_URL && canonical !== SITE_URL + '/') warn(`la canonical (${canonical}) ne correspond pas a SITE_URL : lance "npm run seo -- ${SITE_URL}"`);
}
for (const f of ['og.jpg', 'favicon.svg', 'favicon-32.png', 'apple-touch-icon.png']) if (!fs.existsSync(path.join(ROOT, f))) fail(`${f} manquant : lance "npm run seo"`);

// 4. Textes provisoires et secrets --------------------------------------------------------
step('4. Textes provisoires et secrets');
const front = { 'index.html': html, 'app.js': app };
for (const [f, t] of Object.entries(front)) {
  for (const re of [/LIEN_[A-Z_]+/g, /\bGROQ_KEY\b/g, /\bXXX\b/g, /\bTODO\b/g]) for (const m of t.matchAll(re)) fail(`texte provisoire "${m[0]}" dans ${f}`);
}
for (const f of ['index.html', 'app.js', 'api/chat.js', 'api/health.js', 'api/_lib/knowledge.js', '.env.example', 'vercel.json']) {
  if (/gsk_[A-Za-z0-9]{10,}/.test(read(f))) fail(`une cle Groq apparait dans ${f} : retire-la et change de cle`);
}

// 5. Typographie : tirets longs, points medians, emoji ---------------------------------
step('5. Typographie');
const ALLOWED_EMOJI = new Set(['\u{1F916}', '\u{1F4AC}', '©']); // robot du chatbot, bulle du bouton "Discuter avec mon IA", copyright
const NAMES = { '—': 'tiret long', '–': 'tiret moyen', '·': 'point median' };
for (const [f, t] of Object.entries({ ...front, 'api/_lib/knowledge.js': kb })) {
  t.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/[—–·]/g)) fail(`${NAMES[m[0]]} dans ${f}, ligne ${i + 1}`);
    if (f === 'api/_lib/knowledge.js') return;
    for (const m of line.matchAll(/\p{Extended_Pictographic}/gu)) if (!ALLOWED_EMOJI.has(m[0])) fail(`emoji "${m[0]}" dans ${f}, ligne ${i + 1}`);
  });
}

// 6. Liens externes -----------------------------------------------------------------------
step('6. Liens externes' + (OFFLINE ? ' (sautes : --offline)' : ''));
if (!OFFLINE) {
  const urls = new Set([
    ...[...html.matchAll(/href="(https:[^"]+)"/g)].map(m => m[1]),
    ...[...app.matchAll(/link:'(https:[^']+)'/g)].map(m => m[1]),
  ].filter(u => !canonical || !u.startsWith(canonical))); // l'adresse du site lui-meme est controlee en partie 7 (SITE_URL)
  await Promise.all([...urls].map(async u => {
    try {
      const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 (verification de liens du portfolio)' } });
      await r.body?.cancel().catch(() => {});
      if (r.status === 404 || r.status === 410 || (r.status >= 500 && r.status !== 999)) fail(`lien externe casse (HTTP ${r.status}) : ${u}`);
      else if (r.status >= 400 || r.status === 999) warn(`lien externe non verifiable automatiquement (HTTP ${r.status}, souvent une protection anti-robot) : ${u}`);
    } catch (e) { warn(`lien externe injoignable (${e.name === 'TimeoutError' ? 'delai' : 'reseau'}) : ${u}`); }
  }));
  console.log(`   ${urls.size} liens externes testes`);
}

// 7. /api/health -----------------------------------------------------------------------
step('7. /api/health' + (SITE_URL ? ` (en ligne : ${SITE_URL})` : ' (serveur local)'));
async function getJson(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
  return { status: r.status, body: await r.json().catch(() => null) };
}
if (SITE_URL) {
  try {
    const home = await fetch(SITE_URL + '/', { signal: AbortSignal.timeout(15000) });
    if (home.status !== 200) fail(`page d'accueil en ligne : HTTP ${home.status}`);
    const h = await getJson(SITE_URL + '/api/health');
    if (h.status !== 200 || h.body?.status !== 'ok') fail(`/api/health en ligne ne repond pas correctement (HTTP ${h.status})`);
    else if (h.body.chatFree && !h.body.groqKey) fail('/api/health en ligne : questions libres ouvertes mais cle Groq absente, voir MAINTENANCE.md');
    else console.log(`   en ligne : OK, questions libres ${h.body.chatFree ? 'ouvertes' : 'fermees'}, modele ${h.body.model}, ${h.body.fallbacks} secours`);
  } catch (e) { fail(`site en ligne injoignable : ${SITE_URL} (${e.name})`); }
} else {
  const port = 8200 + Math.floor(Math.random() * 500);
  const child = spawn(process.execPath, [path.join(ROOT, 'scripts/dev.mjs')], { cwd: ROOT, env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  let out = '';
  child.stdout.on('data', d => out += d);
  for (let i = 0; i < 50 && !out.includes('Apercu'); i++) await new Promise(r => setTimeout(r, 100));
  try {
    const h = await getJson(`http://localhost:${port}/api/health`);
    if (h.status !== 200 || h.body?.status !== 'ok') fail(`/api/health local ne repond pas (HTTP ${h.status})`);
    else console.log(`   local : OK (cle Groq ${h.body.groqKey ? 'presente' : 'absente, normal hors de ton ordinateur'})`);
  } catch { fail('/api/health local injoignable'); }
  const exited = new Promise(r => child.once('exit', r));
  child.kill();
  await exited;
}

// Bilan -----------------------------------------------------------------------------------
console.log('\n' + '='.repeat(60));
for (const w of warnings) console.log('Attention : ' + w);
for (const p of problems) console.log('ECHEC : ' + p);
console.log(problems.length ? `\n${problems.length} probleme(s) a corriger.` : '\nTout est en ordre.');
// exitCode plutot que process.exit() : laisse Node fermer proprement les connexions (evite un plantage sous Windows)
process.exitCode = problems.length ? 1 : 0;
