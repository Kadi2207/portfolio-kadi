// Recopie les reponses predefinies du chatbot (CANNED, dans app.js) vers api/_lib/canned.js,
// pour que le serveur s'en serve comme "reponses de reference".
//
//   npm run kb            met a jour api/_lib/canned.js
//   npm run kb -- --check echoue si api/_lib/canned.js n'est pas a jour (utilise par les controles)

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'app.js');
const OUT = path.join(ROOT, 'api', '_lib', 'canned.js');

const html = fs.readFileSync(SOURCE, 'utf8');
const start = html.indexOf('const CANNED=');
const end = html.indexOf('\nconst SUGGESTIONS=', start);
if (start < 0 || end < 0) {
  console.error('CANNED introuvable dans app.js (attendu : "const CANNED=" puis "const SUGGESTIONS=").');
  process.exit(1);
}
const literal = html.slice(start + 'const CANNED='.length, end).trim().replace(/;$/, '');
let canned;
try {
  canned = vm.runInNewContext('(' + literal + ')', Object.create(null), { timeout: 1000 });
} catch (e) {
  console.error('CANNED illisible : ' + e.message);
  process.exit(1);
}
for (const lang of ['fr', 'en']) {
  if (!canned[lang] || typeof canned[lang] !== 'object') { console.error(`CANNED.${lang} manquant`); process.exit(1); }
  for (const [k, v] of Object.entries(canned[lang])) if (typeof v !== 'string' || !v.trim()) { console.error(`CANNED.${lang}.${k} vide`); process.exit(1); }
}

const content = '// FICHIER GENERE par "npm run kb" a partir de app.js (const CANNED). Ne pas modifier a la main.\n'
  + 'export const CANNED = ' + JSON.stringify(canned, null, 2) + ';\n';

if (process.argv.includes('--check')) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : '';
  if (current !== content) { console.error('api/_lib/canned.js n\'est pas a jour : lance "npm run kb".'); process.exit(1); }
  console.log('Reponses predefinies synchronisees.');
} else {
  fs.writeFileSync(OUT, content);
  console.log(`api/_lib/canned.js ecrit (${Object.keys(canned.fr).length} reponses FR, ${Object.keys(canned.en).length} EN).`);
}
